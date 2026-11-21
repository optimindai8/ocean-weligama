import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { classifyTraffic } from '../../src/domain/services/TrafficSourceClassifier.js';
import { EventName } from '../../src/domain/value-objects/EventName.js';
import { PagePath } from '../../src/domain/value-objects/PagePath.js';
import { SessionId } from '../../src/domain/value-objects/SessionId.js';
import { VisitorId } from '../../src/domain/value-objects/VisitorId.js';
import { openDatabase } from '../../src/infrastructure/persistence/sqlite/openDatabase.js';
import { SqliteAnalyticsQuery } from '../../src/infrastructure/persistence/sqlite/SqliteAnalyticsQuery.js';
import { SqliteEventRepository } from '../../src/infrastructure/persistence/sqlite/SqliteEventRepository.js';
import { SESSION_A, SESSION_B, VISITOR_A, VISITOR_B, buildEvent } from '../helpers/factories.js';

const OFFSET = 330; // UTC+05:30
// "Today" in hotel time: 18 Nov 2026 00:00 -> 19 Nov 2026 00:00 local
const TODAY = { from: new Date('2026-11-17T18:30:00Z'), to: new Date('2026-11-18T18:30:00Z') };
const TWO_DAYS = { from: new Date('2026-11-16T18:30:00Z'), to: TODAY.to };

describe('SQLite repository + analytics queries', () => {
  let db: Database.Database;
  let repo: SqliteEventRepository;
  let query: SqliteAnalyticsQuery;

  beforeEach(async () => {
    db = openDatabase(':memory:');
    repo = new SqliteEventRepository(db);
    query = new SqliteAnalyticsQuery(db);

    const A = { visitorId: VisitorId.from(VISITOR_A), sessionId: SessionId.from(SESSION_A) };
    const B = { visitorId: VisitorId.from(VISITOR_B), sessionId: SessionId.from(SESSION_B) };

    // 23:59:59 local on the 17th -> belongs to yesterday
    await repo.save(buildEvent({ ...A, occurredAt: new Date('2026-11-17T18:29:59Z'), path: PagePath.from('/') }));
    // 00:00:00 local on the 18th -> belongs to today
    await repo.save(buildEvent({ ...A, occurredAt: new Date('2026-11-17T18:30:00Z'), path: PagePath.from('/rooms') }));
    // visitor B, returning, arrived from Google, on a phone, in Germany
    await repo.save(
      buildEvent({
        ...B,
        occurredAt: new Date('2026-11-18T03:00:00Z'),
        path: PagePath.from('/rooms'),
        isReturning: true,
        traffic: classifyTraffic({ referrer: 'https://www.google.com/' }),
        deviceType: 'mobile',
        browser: 'Safari',
        os: 'iOS',
        country: 'DE',
      }),
    );
    await repo.save(buildEvent({ ...A, type: 'engagement', durationMs: 40_000, occurredAt: new Date('2026-11-18T03:01:00Z') }));
    await repo.save(buildEvent({ ...B, type: 'engagement', durationMs: 20_000, occurredAt: new Date('2026-11-18T03:02:00Z') }));
    await repo.save(
      buildEvent({ ...B, type: 'custom', name: EventName.from('booking_click'), occurredAt: new Date('2026-11-18T03:03:00Z') }),
    );
  });

  afterEach(() => db.close());

  it('summarises only pageviews inside the range', async () => {
    const s = await query.summary(TODAY);
    expect(s).toEqual({
      pageViews: 2,
      visitors: 2,
      sessions: 2,
      returningVisitors: 1,
      engagedMs: 60_000,
      engagedSessions: 2,
    });
  });

  it('buckets days by hotel local midnight, not UTC', async () => {
    expect(await query.daily(TWO_DAYS, OFFSET)).toEqual([
      { date: '2026-11-17', visitors: 1, pageViews: 1 },
      { date: '2026-11-18', visitors: 2, pageViews: 2 },
    ]);
  });

  it('ranks pages, sources, devices and countries by unique visitors', async () => {
    expect(await query.breakdown('page', TODAY, 10)).toEqual([{ label: '/rooms', visitors: 2, views: 2 }]);

    const sources = await query.breakdown('source', TODAY, 10);
    expect(sources).toEqual(
      expect.arrayContaining([
        { label: 'direct', visitors: 1, views: 1 },
        { label: 'google', visitors: 1, views: 1 },
      ]),
    );
    expect(await query.breakdown('medium', TODAY, 10)).toHaveLength(2);

    expect((await query.breakdown('deviceType', TODAY, 10)).map((r) => r.label).sort()).toEqual(['desktop', 'mobile']);
    expect((await query.breakdown('country', TODAY, 10)).map((r) => r.label).sort()).toEqual(['DE', 'LK']);
    expect((await query.breakdown('os', TODAY, 10)).map((r) => r.label).sort()).toEqual(['Windows', 'iOS']);
    expect((await query.breakdown('browser', TODAY, 1))).toHaveLength(1); // limit is respected
  });

  it('reports "Unknown" when the country is not known', async () => {
    await repo.save(buildEvent({ country: null, occurredAt: new Date('2026-11-18T04:00:00Z') }));
    const countries = await query.breakdown('country', TODAY, 10);
    expect(countries.find((c) => c.label === 'Unknown')).toBeDefined();
  });

  it('counts custom events separately from page views', async () => {
    expect(await query.customEvents(TODAY, 10)).toEqual([{ name: 'booking_click', count: 1, visitors: 1 }]);
  });

  it('counts distinct active visitors since a moment in time', async () => {
    expect(await query.activeVisitorsSince(new Date('2026-11-18T02:55:00Z'))).toBe(2);
    expect(await query.activeVisitorsSince(new Date('2026-11-18T03:02:30Z'))).toBe(1);
    expect(await query.activeVisitorsSince(new Date('2026-11-18T04:00:00Z'))).toBe(0);
  });

  it('deletes only events older than the cutoff', async () => {
    const removed = await repo.deleteOlderThan(new Date('2026-11-17T18:30:00Z'));
    expect(removed).toBe(1);
    expect((await query.summary(TWO_DAYS)).pageViews).toBe(2);
  });

  it('counts a guest as new when their first visit is inside the period, even if they come back later', async () => {
    // Visitor A already has a first-visit pageview today (is_returning = 0).
    // Their second session today is flagged returning, but they must still count as NEW.
    await repo.save(
      buildEvent({
        visitorId: VisitorId.from(VISITOR_A),
        sessionId: SessionId.from('cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
        isReturning: true,
        occurredAt: new Date('2026-11-18T04:00:00Z'),
      }),
    );
    const s = await query.summary(TODAY);
    expect(s.visitors).toBe(2);
    expect(s.returningVisitors).toBe(1); // only visitor B
  });

  it('applies migrations only once', () => {
    const count = db.prepare('SELECT COUNT(*) AS n FROM schema_migrations').get() as { n: number };
    expect(count.n).toBe(1);
  });
});
