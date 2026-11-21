import type { DeviceType } from '../../domain/types.js';

export interface ParsedUserAgent {
  deviceType: DeviceType;
  browser: string;
  os: string;
}

export interface UserAgentParser {
  parse(userAgent: string): ParsedUserAgent;
}
