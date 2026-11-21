import type { BotDetector } from '../../application/ports/BotDetector.js';

const BOT_PATTERN =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|pingdom|uptime|monitor|curl\/|wget|python-requests|python-urllib|httpclient|okhttp|axios|node-fetch|postman|facebookexternalhit|embedly|preview|scrapy/i;

/** Keeps search-engine crawlers, uptime monitors and scripts out of the visitor numbers. */
export class RegexBotDetector implements BotDetector {
  isBot(userAgent: string): boolean {
    const ua = userAgent.trim();
    return ua.length === 0 || BOT_PATTERN.test(ua);
  }
}
