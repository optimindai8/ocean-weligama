import type { TrafficMedium } from '../types.js';

export interface TrafficSourceInput {
  referrer?: string | null;
  utmSource?: string | null;
  utmCampaign?: string | null;
}

export interface TrafficSource {
  source: string;
  medium: TrafficMedium;
  campaign: string | null;
  referrerHost: string | null;
}

interface Rule {
  source: string;
  medium: TrafficMedium;
  patterns: RegExp[];
}

const escapeDots = (domain: string): string => domain.replace(/\./g, '\\.');
/** Matches "example.com" and any sub-domain of it. */
const exact = (domain: string): RegExp => new RegExp(`(^|\\.)${escapeDots(domain)}$`);
/** Matches "name.com", "name.lk", "name.co.uk", "name.com.au" (and sub-domains), but not "name.evil.com". */
const anyTld = (name: string): RegExp => new RegExp(`(^|\\.)${name}\\.(?:com|[a-z]{2}|(?:co|com)\\.[a-z]{2})$`);

const RULES: readonly Rule[] = [
  // Search engines
  { source: 'google', medium: 'organic', patterns: [anyTld('google')] },
  { source: 'bing', medium: 'organic', patterns: [exact('bing.com')] },
  { source: 'duckduckgo', medium: 'organic', patterns: [exact('duckduckgo.com')] },
  { source: 'yahoo', medium: 'organic', patterns: [anyTld('yahoo')] },
  { source: 'yandex', medium: 'organic', patterns: [anyTld('yandex')] },
  { source: 'baidu', medium: 'organic', patterns: [exact('baidu.com')] },
  { source: 'ecosia', medium: 'organic', patterns: [exact('ecosia.org')] },
  // Social networks
  { source: 'facebook', medium: 'social', patterns: [exact('facebook.com'), exact('fb.com'), exact('fb.me')] },
  { source: 'instagram', medium: 'social', patterns: [exact('instagram.com')] },
  { source: 'x', medium: 'social', patterns: [exact('twitter.com'), exact('t.co'), exact('x.com')] },
  { source: 'youtube', medium: 'social', patterns: [exact('youtube.com'), exact('youtu.be')] },
  { source: 'tiktok', medium: 'social', patterns: [exact('tiktok.com')] },
  { source: 'linkedin', medium: 'social', patterns: [exact('linkedin.com'), exact('lnkd.in')] },
  { source: 'pinterest', medium: 'social', patterns: [anyTld('pinterest')] },
  { source: 'whatsapp', medium: 'social', patterns: [exact('whatsapp.com'), exact('wa.me')] },
  { source: 'reddit', medium: 'social', patterns: [exact('reddit.com')] },
  // Travel / booking platforms
  { source: 'booking.com', medium: 'travel', patterns: [exact('booking.com')] },
  { source: 'tripadvisor', medium: 'travel', patterns: [anyTld('tripadvisor')] },
  { source: 'agoda', medium: 'travel', patterns: [exact('agoda.com')] },
  { source: 'expedia', medium: 'travel', patterns: [anyTld('expedia')] },
  { source: 'airbnb', medium: 'travel', patterns: [anyTld('airbnb')] },
  { source: 'hotels.com', medium: 'travel', patterns: [exact('hotels.com')] },
  { source: 'trivago', medium: 'travel', patterns: [anyTld('trivago')] },
  { source: 'kayak', medium: 'travel', patterns: [anyTld('kayak')] },
  { source: 'makemytrip', medium: 'travel', patterns: [exact('makemytrip.com')] },
];

function extractHost(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    return host.length > 0 && host.length <= 100 ? host : null;
  } catch {
    return null;
  }
}

function cleanLabel(raw: string | null | undefined, maxLength: number): string | null {
  if (!raw) return null;
  const value = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._ -]/g, '')
    .slice(0, maxLength)
    .trim();
  return value.length > 0 ? value : null;
}

/**
 * Works out how a guest found the website.
 * Priority: campaign tag (?utm_source=...) > referring website > direct visit.
 */
export function classifyTraffic(input: TrafficSourceInput): TrafficSource {
  const referrerHost = extractHost(input.referrer);

  const utmSource = cleanLabel(input.utmSource, 50);
  if (utmSource) {
    return { source: utmSource, medium: 'campaign', campaign: cleanLabel(input.utmCampaign, 80), referrerHost };
  }

  if (referrerHost) {
    const rule = RULES.find((r) => r.patterns.some((p) => p.test(referrerHost)));
    return rule
      ? { source: rule.source, medium: rule.medium, campaign: null, referrerHost }
      : { source: referrerHost, medium: 'referral', campaign: null, referrerHost };
  }

  return { source: 'direct', medium: 'direct', campaign: null, referrerHost: null };
}
