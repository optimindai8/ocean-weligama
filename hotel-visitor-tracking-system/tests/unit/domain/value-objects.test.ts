import { describe, expect, it } from 'vitest';
import { ValidationError } from '../../../src/domain/errors/DomainError.js';
import { sanitizeLanguage, sanitizeScreenWidth, sanitizeTimezone } from '../../../src/domain/value-objects/ClientHints.js';
import { parseCountryCode } from '../../../src/domain/value-objects/CountryCode.js';
import { EventName } from '../../../src/domain/value-objects/EventName.js';
import { PagePath } from '../../../src/domain/value-objects/PagePath.js';
import { isReportPeriod, resolveRange } from '../../../src/domain/value-objects/ReportPeriod.js';
import { VisitorId } from '../../../src/domain/value-objects/VisitorId.js';

describe('PagePath', () => {
  it('removes query string, hash and trailing slashes', () => {
    expect(PagePath.from('/rooms/deluxe/?checkin=2026-12-01&email=a@b.c#top').value).toBe('/rooms/deluxe');
    expect(PagePath.from('/a//').value).toBe('/a');
  });

  it('keeps the home page as "/"', () => {
    expect(PagePath.from('/').value).toBe('/');
    expect(PagePath.from('/?utm_source=x').value).toBe('/');
  });

  it.each(['rooms', '', 'http://evil.com/', '/a\nb', '/a\u0000b'])('rejects %j', (bad) => {
    expect(() => PagePath.from(bad)).toThrow(ValidationError);
  });

  it('rejects very long paths and non-strings', () => {
    expect(() => PagePath.from(`/${'a'.repeat(250)}`)).toThrow(ValidationError);
    expect(() => PagePath.from(42)).toThrow(ValidationError);
  });
});

describe('VisitorId', () => {
  it('accepts a UUID v4 and normalises case', () => {
    expect(VisitorId.from('11111111-1111-4111-8111-111111111111').value).toBe('11111111-1111-4111-8111-111111111111');
    expect(VisitorId.from('AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA').value).toBe('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
  });

  it.each(['', 'not-a-uuid', '11111111-1111-1111-8111-111111111111', "'; DROP TABLE tracking_events;--", null, 7])(
    'rejects %j',
    (bad) => {
      expect(() => VisitorId.from(bad)).toThrow(ValidationError);
    },
  );
});

describe('EventName', () => {
  it('accepts snake_case names', () => {
    expect(EventName.from('booking_click').value).toBe('booking_click');
  });

  it.each(['A', 'Booking', '1abc', 'with space', 'x'.repeat(41), '<script>', ''])('rejects %j', (bad) => {
    expect(() => EventName.from(bad)).toThrow(ValidationError);
  });
});

describe('parseCountryCode', () => {
  it('normalises valid codes and drops everything else', () => {
    expect(parseCountryCode('lk')).toBe('LK');
    expect(parseCountryCode(' DE ')).toBe('DE');
    expect(parseCountryCode('XX')).toBeNull();
    expect(parseCountryCode('T1')).toBeNull();
    expect(parseCountryCode('LKA')).toBeNull();
    expect(parseCountryCode('')).toBeNull();
    expect(parseCountryCode(undefined)).toBeNull();
  });
});

describe('client hints', () => {
  it('accepts sane values', () => {
    expect(sanitizeLanguage('en-US')).toBe('en-US');
    expect(sanitizeTimezone('Asia/Colombo')).toBe('Asia/Colombo');
    expect(sanitizeScreenWidth(1440)).toBe(1440);
  });

  it('drops suspicious values instead of storing them', () => {
    expect(sanitizeLanguage('<script>')).toBeNull();
    expect(sanitizeTimezone("Asia/Colombo'; --")).toBeNull();
    expect(sanitizeScreenWidth(12.5)).toBeNull();
    expect(sanitizeScreenWidth(99_999)).toBeNull();
    expect(sanitizeScreenWidth(undefined)).toBeNull();
  });
});

describe('resolveRange (hotel local time, UTC+05:30)', () => {
  const offset = 330;

  it('"today" runs from local midnight to the next local midnight', () => {
    const range = resolveRange('today', new Date('2026-11-18T05:00:00Z'), offset);
    expect(range.from.toISOString()).toBe('2026-11-17T18:30:00.000Z');
    expect(range.to.toISOString()).toBe('2026-11-18T18:30:00.000Z');
    expect(range.localDays).toEqual(['2026-11-18']);
  });

  it('switches day exactly at local midnight', () => {
    expect(resolveRange('today', new Date('2026-11-17T18:29:59Z'), offset).localDays).toEqual(['2026-11-17']);
    expect(resolveRange('today', new Date('2026-11-17T18:30:00Z'), offset).localDays).toEqual(['2026-11-18']);
  });

  it('"7d" covers seven local days ending today', () => {
    const range = resolveRange('7d', new Date('2026-11-18T05:00:00Z'), offset);
    expect(range.localDays).toHaveLength(7);
    expect(range.localDays[0]).toBe('2026-11-12');
    expect(range.localDays[6]).toBe('2026-11-18');
  });

  it('handles negative offsets', () => {
    const range = resolveRange('today', new Date('2026-11-18T03:00:00Z'), -300);
    expect(range.localDays).toEqual(['2026-11-17']);
  });

  it('validates period names', () => {
    expect(isReportPeriod('30d')).toBe(true);
    expect(isReportPeriod('1y')).toBe(false);
    expect(isReportPeriod(undefined)).toBe(false);
  });
});
