import path from 'node:path';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Express } from 'express';
import type { AppConfig } from '../../src/infrastructure/config/env.js';
import { ConsoleLogger } from '../../src/infrastructure/logging/ConsoleLogger.js';
import { hashPassword } from '../../src/infrastructure/security/ScryptPassword.js';
import { createApp } from '../../src/interfaces/http/createApp.js';
import { buildContainer, type Container } from '../../src/main/container.js';
import {
  CHROME_WINDOWS,
  FixedClock,
  GOOGLEBOT,
  IPHONE_SAFARI,
  SESSION_A,
  SESSION_B,
  VISITOR_A,
  VISITOR_B,
} from '../helpers/factories.js';

const ORIGIN = 'https://www.test-hotel.lk';
const PASSWORD = 'Correct-Horse-Battery-9';
const NOW = new Date('2026-11-18T05:00:00.000Z');

let app: Express;
let container: Container;
let clock: FixedClock;
let passwordHash: string;

/** Builds a brand-new application with its own empty in-memory database. */
function startFreshApp(): void {
  container?.close();
  const config: AppConfig = {
    env: 'test',
    isProduction: false,
    host: '127.0.0.1',
    port: 0,
    databasePath: ':memory:',
    allowedOrigins: [ORIGIN],
    trustProxy: 0,
    appSecret: 'x'.repeat(48),
    adminUsername: 'manager',
    adminPasswordHash: passwordHash,
    sessionTtlSeconds: 3600,
    reportUtcOffsetMinutes: 330,
    retentionDays: 395,
    collectRateLimitPerMinute: 1000,
    countryHeader: 'cf-ipcountry',
  };
  clock = new FixedClock(NOW);
  container = buildContainer(config, clock);
  app = createApp({
    config,
    logger: new ConsoleLogger(true),
    publicDir: path.resolve(process.cwd(), 'public'),
    useCases: container.useCases,
  });
}

beforeAll(async () => {
  passwordHash = await hashPassword(PASSWORD);
  startFreshApp();
});

afterAll(() => container.close());

/** Sends a tracking message exactly like the browser tracker does (JSON as text/plain). */
function collect(payload: unknown, { ua = CHROME_WINDOWS, country = 'LK', origin = ORIGIN } = {}) {
  const req = request(app)
    .post('/api/v1/collect')
    .set('Content-Type', 'text/plain;charset=UTF-8')
    .set('User-Agent', ua)
    .set('cf-ipcountry', country);
  if (origin) req.set('Origin', origin);
  return req.send(typeof payload === 'string' ? payload : JSON.stringify(payload));
}

const pageview = (overrides: Record<string, unknown> = {}) => ({
  type: 'pageview',
  visitorId: VISITOR_A,
  sessionId: SESSION_A,
  path: '/rooms',
  returning: false,
  referrer: 'https://www.google.com/',
  language: 'en-US',
  timezone: 'Asia/Colombo',
  screenWidth: 1440,
  ...overrides,
});

describe('basics', () => {
  it('answers the health check and sets security headers', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('serves the tracker script cross-origin and cacheable', async () => {
    const res = await request(app).get('/hotel-tracker.js');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/javascript/);
    expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    expect(res.headers['cache-control']).toContain('max-age=86400');
    expect(res.text).toContain('hotelTracker');
  });

  it('returns JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'not_found' });
  });
});

describe('POST /api/v1/collect', () => {
  it('accepts a pageview from the hotel website', async () => {
    const res = await collect(pageview());
    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe(ORIGIN);
    // Without this, browsers print "ERR_BLOCKED_BY_RESPONSE.NotSameOrigin" on the hotel site.
    expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
  });

  it('rejects other websites and requests without an Origin', async () => {
    expect((await collect(pageview(), { origin: 'https://evil.example' })).status).toBe(403);
    expect((await collect(pageview(), { origin: '' })).status).toBe(403);
  });

  it('answers CORS preflight only for the hotel website', async () => {
    const ok = await request(app).options('/api/v1/collect').set('Origin', ORIGIN);
    expect(ok.status).toBe(204);
    expect(ok.headers['access-control-allow-methods']).toContain('POST');

    const denied = await request(app).options('/api/v1/collect').set('Origin', 'https://evil.example');
    expect(denied.status).toBe(403);
  });

  it('rejects malformed input with 400', async () => {
    expect((await collect('not json')).status).toBe(400);
    expect((await collect('')).status).toBe(400);
    expect((await collect({ ...pageview(), visitorId: 'nope' })).status).toBe(400);
    expect((await collect({ ...pageview(), type: 'hack' })).status).toBe(400);
    expect((await collect({ ...pageview(), path: 'no-slash' })).status).toBe(400);
    expect((await collect({ ...pageview(), type: 'engagement' })).status).toBe(400); // needs durationMs
    expect((await collect({ ...pageview(), type: 'event' })).status).toBe(400); // needs name
  });

  it('rejects oversized bodies with 413', async () => {
    const res = await collect(JSON.stringify({ ...pageview(), path: `/${'a'.repeat(5000)}` }));
    expect(res.status).toBe(413);
  });
});

describe('admin API', () => {
  it('requires a session for data', async () => {
    expect((await request(app).get('/admin/api/analytics')).status).toBe(401);
    expect((await request(app).get('/admin/api/session')).status).toBe(401);
    const forged = await request(app).get('/admin/api/analytics').set('Cookie', 'hva_session=abc.def');
    expect(forged.status).toBe(401);
  });

  it('rejects login without the CSRF header and with wrong credentials', async () => {
    const noHeader = await request(app).post('/admin/api/login').send({ username: 'manager', password: PASSWORD });
    expect(noHeader.status).toBe(403);

    const wrong = await request(app)
      .post('/admin/api/login')
      .set('X-Requested-With', 'hotel-admin')
      .send({ username: 'manager', password: 'wrong' });
    expect(wrong.status).toBe(401);
    expect(wrong.headers['set-cookie']).toBeUndefined();

    const malformed = await request(app)
      .post('/admin/api/login')
      .set('X-Requested-With', 'hotel-admin')
      .send({ username: 'manager' });
    expect(malformed.status).toBe(400);
  });

  it('serves the dashboard pages', async () => {
    const page = await request(app).get('/admin/');
    expect(page.status).toBe(200);
    expect(page.text).toContain('Website Visitors');
    expect((await request(app).get('/admin/login.html')).status).toBe(200);
    expect((await request(app).get('/admin/dashboard.js')).status).toBe(200);
  });
});

describe('end to end: guests browse, manager reads the dashboard', () => {
  // Empty database, so the totals below are exact.
  beforeAll(() => startFreshApp());

  it('records real traffic and reports accurate numbers', async () => {
    // Guest A (desktop, from Google) opens two pages, clicks "book", stays 30 s.
    await collect(pageview());
    await collect(pageview({ path: '/' }));
    await collect({ type: 'event', name: 'booking_click', visitorId: VISITOR_A, sessionId: SESSION_A, path: '/rooms' });
    await collect({ type: 'engagement', durationMs: 30_000, visitorId: VISITOR_A, sessionId: SESSION_A, path: '/rooms' });
    // Guest B (iPhone, returning, from a Facebook campaign, Germany). The query string must not be stored.
    await collect(
      pageview({
        visitorId: VISITOR_B,
        sessionId: SESSION_B,
        path: '/rooms?email=guest@example.com',
        returning: true,
        referrer: undefined,
        utmSource: 'Facebook',
        utmCampaign: 'Summer Sale',
      }),
      { ua: IPHONE_SAFARI, country: 'DE' },
    );
    // A search-engine bot must not change the numbers.
    expect((await collect(pageview({ path: '/bot-page' }), { ua: GOOGLEBOT })).status).toBe(204);

    const agent = request.agent(app);

    const login = await agent.post('/admin/api/login').set('X-Requested-With', 'hotel-admin').send({ username: 'manager', password: PASSWORD });
    expect(login.status).toBe(200);
    const cookie = String(login.headers['set-cookie']);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Strict');
    expect(cookie).toContain('Path=/admin');

    expect((await agent.get('/admin/api/session')).body).toEqual({ username: 'manager' });

    const res = await agent.get('/admin/api/analytics?period=today');
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toBe('no-store');

    const data = res.body;
    expect(data.summary).toEqual({
      visitors: 2,
      newVisitors: 1,
      returningVisitors: 1,
      pageViews: 3,
      sessions: 2,
      pagesPerSession: 1.5,
      avgEngagedSeconds: 30,
    });
    expect(data.onlineNow).toBe(2);
    expect(data.daily).toEqual([{ date: '2026-11-18', visitors: 2, pageViews: 3 }]);
    expect(data.topPages).toEqual([
      { label: '/rooms', visitors: 2, views: 2 },
      { label: '/', visitors: 1, views: 1 },
    ]);
    expect(data.topPages.map((p: { label: string }) => p.label)).not.toContain('/bot-page');
    expect(JSON.stringify(data)).not.toContain('guest@example.com');

    expect(data.mediums).toEqual(
      expect.arrayContaining([
        { label: 'organic', visitors: 1, views: 2 },
        { label: 'campaign', visitors: 1, views: 1 },
      ]),
    );
    expect(data.sources.map((s: { label: string }) => s.label).sort()).toEqual(['facebook', 'google']);
    expect(data.countries.map((c: { label: string }) => c.label).sort()).toEqual(['DE', 'LK']);
    expect(data.devices.map((d: { label: string }) => d.label).sort()).toEqual(['desktop', 'mobile']);
    expect(data.events).toEqual([{ name: 'booking_click', count: 1, visitors: 1 }]);

    // Longer periods work and fill the chart with zero days.
    const week = await agent.get('/admin/api/analytics?period=7d');
    expect(week.body.daily).toHaveLength(7);
    expect(week.body.summary.pageViews).toBe(3);

    // Bad period -> 400
    expect((await agent.get('/admin/api/analytics?period=forever')).status).toBe(400);

    // Logout clears the cookie, and the session stops working in this browser.
    const logout = await agent.post('/admin/api/logout').set('X-Requested-With', 'hotel-admin').send({});
    expect(logout.status).toBe(200);
    expect(String(logout.headers['set-cookie'])).toContain('Max-Age=0');
    expect((await agent.get('/admin/api/analytics')).status).toBe(401);
  });

  it('expires sessions after the configured lifetime', async () => {
    const agent = request.agent(app);
    await agent.post('/admin/api/login').set('X-Requested-With', 'hotel-admin').send({ username: 'manager', password: PASSWORD });
    expect((await agent.get('/admin/api/session')).status).toBe(200);

    clock.set(new Date(NOW.getTime() + 3601 * 1000));
    expect((await agent.get('/admin/api/session')).status).toBe(401);
    clock.set(NOW);
  });
});
