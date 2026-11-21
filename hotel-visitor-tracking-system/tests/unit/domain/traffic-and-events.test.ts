import { describe, expect, it } from 'vitest';
import { classifyTraffic } from '../../../src/domain/services/TrafficSourceClassifier.js';
import { ValidationError } from '../../../src/domain/errors/DomainError.js';
import { EventName } from '../../../src/domain/value-objects/EventName.js';
import { buildEvent } from '../../helpers/factories.js';

describe('classifyTraffic', () => {
  it('treats no referrer as a direct visit', () => {
    expect(classifyTraffic({})).toEqual({ source: 'direct', medium: 'direct', campaign: null, referrerHost: null });
  });

  it.each([
    ['https://www.google.com/search?q=hotel', 'google', 'organic'],
    ['https://www.google.co.uk/', 'google', 'organic'],
    ['https://www.bing.com/', 'bing', 'organic'],
    ['https://l.facebook.com/l.php?u=x', 'facebook', 'social'],
    ['https://www.instagram.com/', 'instagram', 'social'],
    ['https://t.co/abc', 'x', 'social'],
    ['https://www.booking.com/hotel/lk/x.html', 'booking.com', 'travel'],
    ['https://www.tripadvisor.com/Hotel_Review', 'tripadvisor', 'travel'],
    ['https://www.tripadvisor.co.uk/Hotel_Review', 'tripadvisor', 'travel'],
    ['https://blog.example.org/best-hotels', 'blog.example.org', 'referral'],
  ])('classifies %s', (referrer, source, medium) => {
    expect(classifyTraffic({ referrer })).toMatchObject({ source, medium });
  });

  it('does not let look-alike domains pass as search engines', () => {
    expect(classifyTraffic({ referrer: 'https://google.evil.com/' })).toMatchObject({
      source: 'google.evil.com',
      medium: 'referral',
    });
    expect(classifyTraffic({ referrer: 'https://notfacebook.com/' })).toMatchObject({ medium: 'referral' });
  });

  it('campaign tags win over the referrer and are cleaned', () => {
    expect(
      classifyTraffic({ referrer: 'https://www.google.com/', utmSource: ' Newsletter! ', utmCampaign: 'Summer Sale' }),
    ).toMatchObject({ source: 'newsletter', medium: 'campaign', campaign: 'summer sale' });
  });

  it.each(['javascript:alert(1)', 'not a url', 'ftp://example.org/'])('ignores unusable referrer %j', (referrer) => {
    expect(classifyTraffic({ referrer })).toMatchObject({ source: 'direct', medium: 'direct' });
  });
});

describe('TrackingEvent invariants', () => {
  it('accepts a valid pageview, engagement and custom event', () => {
    expect(() => buildEvent()).not.toThrow();
    expect(() => buildEvent({ type: 'engagement', durationMs: 5000 })).not.toThrow();
    expect(() => buildEvent({ type: 'custom', name: EventName.from('booking_click') })).not.toThrow();
  });

  it('rejects an engagement event without a sensible duration', () => {
    expect(() => buildEvent({ type: 'engagement', durationMs: null })).toThrow(ValidationError);
    expect(() => buildEvent({ type: 'engagement', durationMs: 0 })).toThrow(ValidationError);
    expect(() => buildEvent({ type: 'engagement', durationMs: 3 * 60 * 60 * 1000 })).toThrow(ValidationError);
  });

  it('rejects a custom event without a name, and pageviews carrying extras', () => {
    expect(() => buildEvent({ type: 'custom', name: null })).toThrow(ValidationError);
    expect(() => buildEvent({ type: 'pageview', durationMs: 1000 })).toThrow(ValidationError);
    expect(() => buildEvent({ type: 'pageview', name: EventName.from('booking_click') })).toThrow(ValidationError);
  });

  it('is immutable', () => {
    const event = buildEvent();
    expect(() => {
      (event.props as { country: string | null }).country = 'DE';
    }).toThrow(TypeError);
  });
});
