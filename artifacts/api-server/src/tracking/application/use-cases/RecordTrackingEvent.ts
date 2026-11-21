import { TrackingEvent } from '../../domain/entities/TrackingEvent.js';
import { classifyTraffic } from '../../domain/services/TrafficSourceClassifier.js';
import { GeoResolver } from '../../domain/services/GeoResolver.js';
import type { EventType } from '../../domain/types.js';
import { sanitizeLanguage, sanitizeScreenWidth, sanitizeTimezone } from '../../domain/value-objects/ClientHints.js';
import { parseCountryCode } from '../../domain/value-objects/CountryCode.js';
import { EventName } from '../../domain/value-objects/EventName.js';
import { PagePath } from '../../domain/value-objects/PagePath.js';
import { SessionId } from '../../domain/value-objects/SessionId.js';
import { VisitorId } from '../../domain/value-objects/VisitorId.js';
import type { BotDetector } from '../ports/BotDetector.js';
import type { Clock } from '../ports/Clock.js';
import type { EventRepository } from '../ports/EventRepository.js';
import type { IpHasher } from '../ports/IpHasher.js';
import type { UserAgentParser } from '../ports/UserAgentParser.js';

export interface RecordTrackingEventCommand {
  type: EventType;
  name?: string;
  visitorId: string;
  sessionId: string;
  path: string;
  returning: boolean;
  durationMs?: number;
  referrer?: string;
  utmSource?: string;
  utmCampaign?: string;
  screenWidth?: number;
  language?: string;
  timezone?: string;
  /** Request details supplied by the HTTP layer. */
  userAgent: string;
  ip: string;
  countryHint?: string | null;
}

export type RecordTrackingEventResult = { recorded: true } | { recorded: false; reason: 'bot' };

interface Dependencies {
  events: EventRepository;
  ipHasher: IpHasher;
  userAgents: UserAgentParser;
  bots: BotDetector;
  clock: Clock;
}

/** Records one thing a guest did on the hotel website. */
export class RecordTrackingEvent {
  private readonly recentCustomEvents = new Map<string, number>();

  constructor(private readonly deps: Dependencies) {}

  async execute(command: RecordTrackingEventCommand): Promise<RecordTrackingEventResult> {
    const { events, ipHasher, userAgents, bots, clock } = this.deps;

    if (bots.isBot(command.userAgent)) return { recorded: false, reason: 'bot' };

    // Strict requirement: Never track internal admin panel activity
    const normalizedPath = (command.path || '').toLowerCase();
    if (
      normalizedPath.startsWith('/ow-admin') ||
      normalizedPath.startsWith('/admin') ||
      normalizedPath.includes('/admin/')
    ) {
      return { recorded: true };
    }

    // Time always comes from the server, never from the browser, so it cannot be faked.
    const now = clock.now();

    // High-accuracy deduplication: Prevent accidental double/triple logging on a single user action
    if (command.type === 'custom' && command.name) {
      const dedupKey = `${command.visitorId}:${command.name}:${normalizedPath}`;
      const last = this.recentCustomEvents.get(dedupKey) || 0;
      if (now.getTime() - last < 3000) {
        return { recorded: true };
      }
      this.recentCustomEvents.set(dedupKey, now.getTime());
      if (this.recentCustomEvents.size > 2000) {
        const cutoff = now.getTime() - 10000;
        for (const [k, t] of this.recentCustomEvents.entries()) {
          if (t < cutoff) this.recentCustomEvents.delete(k);
        }
      }
    }

    const agent = userAgents.parse(command.userAgent);

    // Where the guest came from is only meaningful on the pageview that opens a page.
    const traffic =
      command.type === 'pageview'
        ? classifyTraffic({
            referrer: command.referrer,
            utmSource: command.utmSource,
            utmCampaign: command.utmCampaign,
          })
        : classifyTraffic({});

    const event = TrackingEvent.create({
      type: command.type,
      name: command.name === undefined ? null : EventName.from(command.name),
      occurredAt: now,
      visitorId: VisitorId.from(command.visitorId),
      sessionId: SessionId.from(command.sessionId),
      path: PagePath.from(command.path),
      isReturning: command.returning,
      durationMs: command.durationMs ?? null,
      traffic,
      deviceType: agent.deviceType,
      browser: agent.browser,
      os: agent.os,
      country: GeoResolver.resolveCountry({
        countryHint: command.countryHint,
        timezone: command.timezone,
        language: command.language,
        ip: command.ip,
      }),
      language: sanitizeLanguage(command.language),
      timezone: sanitizeTimezone(command.timezone),
      screenWidth: sanitizeScreenWidth(command.screenWidth),
      ipHash: ipHasher.hash(command.ip, now),
      ip: command.ip || null,
    });

    await events.save(event);
    return { recorded: true };
  }
}
