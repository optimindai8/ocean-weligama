import { describe, expect, it } from 'vitest';
import type {
  AnalyticsQuery,
  BreakdownRow,
  SummaryRow,
} from '../../../src/application/ports/AnalyticsQuery.js';
import type { EventRepository } from '../../../src/application/ports/EventRepository.js';
import { GetDashboardAnalytics } from '../../../src/application/use-cases/GetDashboardAnalytics.js';
import { PurgeExpiredEvents } from '../../../src/application/use-cases/PurgeExpiredEvents.js';
import { RecordTrackingEvent } from '../../../src/application/use-cases/RecordTrackingEvent.js';
import type { TrackingEvent } from '../../../src/domain/entities/TrackingEvent.js';
import { ValidationError } from '../../../src/domain/errors/DomainError.js';
import { HmacIpHasher } from '../../../src/infrastructure/security/HmacIpHasher.js';
import { RegexBotDetector } from '../../../src/infrastructure/services/RegexBotDetector.js';
import { RegexUserAgentParser } from '../../../src/infrastructure/services/RegexUserAgentParser.js';
import { CHROME_WINDOWS, FixedClock, GOOGLEBOT, SESSION_A, VISITOR_A } from '../../helpers/factories.js';

class InMemoryEvents implements EventRepository {
  saved: TrackingEvent[] = [];
  lastCutoff: Date | null = null;

  async save(event: TrackingEvent): Promise<void> {
    this.saved.push(event);
  }

  async deleteOlderThan(cutoff: Date): Promise<number> {
    this.lastCutoff = cutoff;
    return 3;
  }
}

const NOW = new Date('2026-11-18T05:00:00.000Z');

function setup() {
  const events = new InMemoryEvents();
  const clock = new FixedClock(NOW);
  const useCase = new RecordTrackingEvent({
    events,
    clock,
    ipHasher: new HmacIpHasher('s'.repeat(40)),
    userAgents: new RegexUserAgentParser(),
    bots: new RegexBotDetector(),
  });
  return { events, useCase };
}

const base = {
  type: 'pageview' as const,
  visitorId: VISITOR_A,
  sessionId: SESSION_A,
  path: '/rooms?checkin=2026-12-01',
  returning: true,
  userAgent: CHROME_WINDOWS,
  ip: '203.0.113.9',
};

describe('RecordTrackingEvent', () => {
  it('stores a pageview with everything derived on the server', async () => {
    const { events, useCase } = setup();

    const result = await useCase.execute({
      ...base,
      referrer: 'https://www.google.com/',
      language: 'en-US',
      timezone: 'Asia/Colombo',
      screenWidth: 1440,
      countryHint: 'lk',
    });

    expect(result).toEqual({ recorded: true });
    expect(events.saved).toHaveLength(1);
    const stored = events.saved[0]!.props;
    expect(stored.occurredAt).toEqual(NOW);
    expect(stored.path.value).toBe('/rooms');
    expect(stored.traffic).toMatchObject({ source: 'google', medium: 'organic' });
    expect(stored).toMatchObject({ deviceType: 'desktop', browser: 'Chrome', os: 'Windows', country: 'LK', isReturning: true });
  });

  it('never stores the raw IP address', async () => {
    const { events, useCase } = setup();
    await useCase.execute(base);
    const stored = JSON.stringify(events.saved[0]!.props);
    expect(stored).not.toContain('203.0.113.9');
    expect(events.saved[0]!.props.ipHash).toMatch(/^[0-9a-f]{32}$/);
  });

  it('silently ignores bots', async () => {
    const { events, useCase } = setup();
    const result = await useCase.execute({ ...base, userAgent: GOOGLEBOT });
    expect(result).toEqual({ recorded: false, reason: 'bot' });
    expect(events.saved).toHaveLength(0);
  });

  it('ignores traffic-source data on non-pageview events', async () => {
    const { events, useCase } = setup();
    await useCase.execute({ ...base, type: 'custom', name: 'booking_click', referrer: 'https://www.google.com/' });
    expect(events.saved[0]!.props.traffic.medium).toBe('direct');
  });

  it('rejects invalid input with a ValidationError', async () => {
    const { events, useCase } = setup();
    await expect(useCase.execute({ ...base, visitorId: 'nope' })).rejects.toBeInstanceOf(ValidationError);
    await expect(useCase.execute({ ...base, path: 'no-slash' })).rejects.toBeInstanceOf(ValidationError);
    await expect(useCase.execute({ ...base, type: 'engagement' })).rejects.toBeInstanceOf(ValidationError);
    await expect(useCase.execute({ ...base, type: 'custom' })).rejects.toBeInstanceOf(ValidationError);
    expect(events.saved).toHaveLength(0);
  });

  it('drops malformed optional hints instead of failing', async () => {
    const { events, useCase } = setup();
    await useCase.execute({ ...base, language: '<b>', timezone: "x'--", screenWidth: 5, countryHint: 'XX' });
    expect(events.saved[0]!.props).toMatchObject({ language: null, timezone: null, screenWidth: null, country: null });
  });
});

describe('GetDashboardAnalytics', () => {
  const summary: SummaryRow = {
    pageViews: 30,
    visitors: 10,
    sessions: 12,
    returningVisitors: 4,
    engagedMs: 600_000,
    engagedSessions: 8,
  };
  const row = (label: string): BreakdownRow => ({ label, visitors: 1, views: 1 });

  const query: AnalyticsQuery = {
    summary: async () => summary,
    daily: async () => [{ date: '2026-11-17', visitors: 6, pageViews: 14 }],
    breakdown: async (dimension) => [row(dimension)],
    customEvents: async () => [{ name: 'booking_click', count: 3, visitors: 2 }],
    activeVisitorsSince: async (since) => (since.getTime() === NOW.getTime() - 5 * 60_000 ? 7 : -1),
  };

  it('computes derived numbers and fills missing days with zeros', async () => {
    const useCase = new GetDashboardAnalytics({ query, clock: new FixedClock(NOW), utcOffsetMinutes: 330 });
    const result = await useCase.execute('7d');

    expect(result.summary).toEqual({
      visitors: 10,
      newVisitors: 6,
      returningVisitors: 4,
      pageViews: 30,
      sessions: 12,
      pagesPerSession: 2.5,
      avgEngagedSeconds: 75,
    });
    expect(result.daily).toHaveLength(7);
    expect(result.daily.find((d) => d.date === '2026-11-17')).toEqual({ date: '2026-11-17', visitors: 6, pageViews: 14 });
    expect(result.daily.find((d) => d.date === '2026-11-15')).toEqual({ date: '2026-11-15', visitors: 0, pageViews: 0 });
    expect(result.onlineNow).toBe(7);
    expect(result.topPages[0]?.label).toBe('page');
    expect(result.events).toEqual([{ name: 'booking_click', count: 3, visitors: 2 }]);
  });

  it('does not divide by zero on an empty period', async () => {
    const empty: AnalyticsQuery = {
      ...query,
      summary: async () => ({ pageViews: 0, visitors: 0, sessions: 0, returningVisitors: 0, engagedMs: 0, engagedSessions: 0 }),
    };
    const result = await new GetDashboardAnalytics({ query: empty, clock: new FixedClock(NOW), utcOffsetMinutes: 330 }).execute('today');
    expect(result.summary).toMatchObject({ pagesPerSession: 0, avgEngagedSeconds: 0, newVisitors: 0 });
  });
});

describe('PurgeExpiredEvents', () => {
  it('deletes everything older than the retention period', async () => {
    const events = new InMemoryEvents();
    const removed = await new PurgeExpiredEvents({ events, clock: new FixedClock(NOW), retentionDays: 395 }).execute();
    expect(removed).toBe(3);
    expect(events.lastCutoff).toEqual(new Date(NOW.getTime() - 395 * 86_400_000));
  });
});
