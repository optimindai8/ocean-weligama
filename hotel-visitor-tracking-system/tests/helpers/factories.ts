import { TrackingEvent, type TrackingEventProps } from '../../src/domain/entities/TrackingEvent.js';
import { classifyTraffic } from '../../src/domain/services/TrafficSourceClassifier.js';
import { PagePath } from '../../src/domain/value-objects/PagePath.js';
import { SessionId } from '../../src/domain/value-objects/SessionId.js';
import { VisitorId } from '../../src/domain/value-objects/VisitorId.js';
import type { Clock } from '../../src/application/ports/Clock.js';

export const VISITOR_A = '11111111-1111-4111-8111-111111111111';
export const VISITOR_B = '22222222-2222-4222-9222-222222222222';
export const SESSION_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
export const SESSION_B = 'bbbbbbbb-bbbb-4bbb-9bbb-bbbbbbbbbbbb';

export const CHROME_WINDOWS =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
export const IPHONE_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1';
export const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bin/google-bot.html)';

export class FixedClock implements Clock {
  constructor(private current: Date) {}

  now(): Date {
    return this.current;
  }

  set(next: Date): void {
    this.current = next;
  }
}

export function buildEvent(overrides: Partial<TrackingEventProps> = {}): TrackingEvent {
  return TrackingEvent.create({
    type: 'pageview',
    name: null,
    occurredAt: new Date('2026-11-18T05:00:00.000Z'),
    visitorId: VisitorId.from(VISITOR_A),
    sessionId: SessionId.from(SESSION_A),
    path: PagePath.from('/'),
    isReturning: false,
    durationMs: null,
    traffic: classifyTraffic({}),
    deviceType: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    country: 'LK',
    language: 'en-US',
    timezone: 'Asia/Colombo',
    screenWidth: 1440,
    ipHash: 'hash',
    ...overrides,
  });
}
