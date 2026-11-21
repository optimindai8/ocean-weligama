import type { ParsedUserAgent, UserAgentParser } from '../../application/ports/UserAgentParser.js';
import type { DeviceType } from '../../domain/types.js';

/**
 * Small, dependency-free User-Agent parser. It only needs the three facts the dashboard
 * shows (device type, browser, operating system), so it avoids a heavy parsing library.
 * Order matters: many browsers also contain "Chrome" or "Safari" in their User-Agent.
 */
export class RegexUserAgentParser implements UserAgentParser {
  parse(userAgent: string): ParsedUserAgent {
    return {
      deviceType: this.deviceType(userAgent),
      browser: this.browser(userAgent),
      os: this.os(userAgent),
    };
  }

  private deviceType(ua: string): DeviceType {
    if (!ua) return 'unknown';
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
    if (/Android/i.test(ua) && !/Mobile/i.test(ua)) return 'tablet';
    if (/iPhone|iPod|Android|Mobile|Windows Phone/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  private browser(ua: string): string {
    if (/Edg(e|A|iOS)?\//.test(ua)) return 'Edge';
    if (/OPR\/|Opera/.test(ua)) return 'Opera';
    if (/SamsungBrowser\//.test(ua)) return 'Samsung Internet';
    if (/Firefox\/|FxiOS\//.test(ua)) return 'Firefox';
    if (/Chrome\/|CriOS\//.test(ua)) return 'Chrome';
    if (/Safari\//.test(ua) && /Version\//.test(ua)) return 'Safari';
    return 'Other';
  }

  private os(ua: string): string {
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
    if (/Android/.test(ua)) return 'Android';
    if (/Windows/.test(ua)) return 'Windows';
    if (/CrOS/.test(ua)) return 'ChromeOS';
    if (/Macintosh|Mac OS X/.test(ua)) return 'macOS';
    if (/Linux|X11/.test(ua)) return 'Linux';
    return 'Other';
  }
}
