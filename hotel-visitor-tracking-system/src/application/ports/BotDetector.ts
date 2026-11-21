export interface BotDetector {
  /** True for crawlers, monitors, headless browsers and other non-human traffic. */
  isBot(userAgent: string): boolean;
}
