import { describe, expect, it } from 'vitest';
import { ConfiguredAdminCredentialsVerifier } from '../../../src/infrastructure/security/ConfiguredAdminCredentialsVerifier.js';
import { HmacIpHasher } from '../../../src/infrastructure/security/HmacIpHasher.js';
import { HmacSessionTokenService } from '../../../src/infrastructure/security/HmacSessionTokenService.js';
import { hashPassword, verifyPassword } from '../../../src/infrastructure/security/ScryptPassword.js';
import { RegexBotDetector } from '../../../src/infrastructure/services/RegexBotDetector.js';
import { RegexUserAgentParser } from '../../../src/infrastructure/services/RegexUserAgentParser.js';
import { CHROME_WINDOWS, GOOGLEBOT, IPHONE_SAFARI } from '../../helpers/factories.js';

describe('RegexUserAgentParser', () => {
  const parser = new RegexUserAgentParser();

  it.each([
    [CHROME_WINDOWS, { deviceType: 'desktop', browser: 'Chrome', os: 'Windows' }],
    [IPHONE_SAFARI, { deviceType: 'mobile', browser: 'Safari', os: 'iOS' }],
    [
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      { deviceType: 'mobile', browser: 'Chrome', os: 'Android' },
    ],
    [
      'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      { deviceType: 'tablet', browser: 'Chrome', os: 'Android' },
    ],
    [
      'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
      { deviceType: 'tablet', browser: 'Safari', os: 'iOS' },
    ],
    [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      { deviceType: 'desktop', browser: 'Edge', os: 'Windows' },
    ],
    ['Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0', { deviceType: 'desktop', browser: 'Firefox', os: 'Linux' }],
    [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      { deviceType: 'desktop', browser: 'Safari', os: 'macOS' },
    ],
    [
      'Mozilla/5.0 (Linux; Android 14; SAMSUNG SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36',
      { deviceType: 'mobile', browser: 'Samsung Internet', os: 'Android' },
    ],
  ])('parses %#', (ua, expected) => {
    expect(parser.parse(ua)).toEqual(expected);
  });
});

describe('RegexBotDetector', () => {
  const detector = new RegexBotDetector();

  it.each([GOOGLEBOT, 'curl/8.4.0', 'python-requests/2.31', 'Mozilla/5.0 HeadlessChrome/120.0', 'UptimeRobot/2.0', ''])(
    'flags %j as a bot',
    (ua) => {
      expect(detector.isBot(ua)).toBe(true);
    },
  );

  it.each([CHROME_WINDOWS, IPHONE_SAFARI])('lets real browsers through', (ua) => {
    expect(detector.isBot(ua)).toBe(false);
  });
});

describe('HmacIpHasher', () => {
  const hasher = new HmacIpHasher('k'.repeat(40));

  it('is stable within a day and different across days and IPs', () => {
    const morning = new Date('2026-11-18T01:00:00Z');
    const evening = new Date('2026-11-18T22:00:00Z');
    const tomorrow = new Date('2026-11-19T01:00:00Z');
    expect(hasher.hash('203.0.113.9', morning)).toBe(hasher.hash('203.0.113.9', evening));
    expect(hasher.hash('203.0.113.9', morning)).not.toBe(hasher.hash('203.0.113.9', tomorrow));
    expect(hasher.hash('203.0.113.9', morning)).not.toBe(hasher.hash('203.0.113.10', morning));
  });

  it('does not depend on the secret being known', () => {
    const other = new HmacIpHasher('z'.repeat(40));
    const at = new Date('2026-11-18T01:00:00Z');
    expect(hasher.hash('203.0.113.9', at)).not.toBe(other.hash('203.0.113.9', at));
  });
});

describe('scrypt passwords', () => {
  it('verifies the right password and rejects the wrong one', async () => {
    const stored = await hashPassword('correct horse battery staple');
    expect(stored.startsWith('scrypt$')).toBe(true);
    expect(await verifyPassword('correct horse battery staple', stored)).toBe(true);
    expect(await verifyPassword('wrong password', stored)).toBe(false);
  });

  it('uses a fresh salt every time', async () => {
    expect(await hashPassword('same password 123')).not.toBe(await hashPassword('same password 123'));
  });

  it.each(['', 'plain-text', 'scrypt$1$2$3', 'scrypt$99999999999$8$1$AAAA$BBBB', 'bcrypt$a$b$c$d$e'])(
    'rejects malformed stored hash %j without throwing',
    async (stored) => {
      expect(await verifyPassword('anything', stored)).toBe(false);
    },
  );
});

describe('HmacSessionTokenService', () => {
  const secret = 's'.repeat(48);
  const service = new HmacSessionTokenService(secret, 3600);
  const now = new Date('2026-11-18T05:00:00Z');

  it('round-trips a valid token', () => {
    expect(service.verify(service.issue('manager', now), now)).toEqual({ username: 'manager' });
  });

  it('rejects an expired token', () => {
    const token = service.issue('manager', now);
    expect(service.verify(token, new Date(now.getTime() + 3600_000))).toBeNull();
    expect(service.verify(token, new Date(now.getTime() + 3599_000))).not.toBeNull();
  });

  it('rejects tampered, foreign and malformed tokens', () => {
    const token = service.issue('manager', now);
    const [payload, signature] = token.split('.') as [string, string];
    const forgedPayload = Buffer.from(JSON.stringify({ sub: 'admin', exp: 9_999_999_999 })).toString('base64url');

    expect(service.verify(`${forgedPayload}.${signature}`, now)).toBeNull();
    expect(service.verify(`${payload}.${signature.slice(0, -2)}xx`, now)).toBeNull();
    expect(new HmacSessionTokenService('o'.repeat(48), 3600).verify(token, now)).toBeNull();
    for (const bad of ['', 'abc', 'a.b.c', '.', 'a.']) expect(service.verify(bad, now)).toBeNull();
  });
});

describe('ConfiguredAdminCredentialsVerifier', () => {
  it('requires both the right username and the right password', async () => {
    const verifier = new ConfiguredAdminCredentialsVerifier('manager', await hashPassword('Sup3r-secret-pass'));
    expect(await verifier.verify('manager', 'Sup3r-secret-pass')).toBe(true);
    expect(await verifier.verify('manager', 'nope')).toBe(false);
    expect(await verifier.verify('someone', 'Sup3r-secret-pass')).toBe(false);
    expect(await verifier.verify('', '')).toBe(false);
  });
});
