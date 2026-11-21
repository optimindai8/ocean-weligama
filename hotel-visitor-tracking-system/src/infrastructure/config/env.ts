import { z } from 'zod';

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  isProduction: boolean;
  host: string;
  port: number;
  databasePath: string;
  allowedOrigins: string[];
  trustProxy: number;
  appSecret: string;
  adminUsername: string;
  adminPasswordHash: string;
  sessionTtlSeconds: number;
  reportUtcOffsetMinutes: number;
  retentionDays: number;
  collectRateLimitPerMinute: number;
  /** Lower-case name of the CDN header that carries the visitor's country, or null when disabled. */
  countryHeader: string | null;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_PATH: z.string().min(1).default('./data/analytics.db'),
  ALLOWED_ORIGINS: z.string().min(1, 'set at least one origin, e.g. https://www.yourhotel.com'),
  TRUST_PROXY: z.coerce.number().int().min(0).max(10).default(0),
  APP_SECRET: z.string().min(32, 'must be at least 32 characters'),
  ADMIN_USERNAME: z.string().min(3).max(64),
  ADMIN_PASSWORD_HASH: z.string().startsWith('scrypt$', 'generate it with: npm run hash-password'),
  SESSION_TTL_HOURS: z.coerce.number().min(1).max(72).default(8),
  REPORT_UTC_OFFSET_MINUTES: z.coerce.number().int().min(-720).max(840).default(330),
  RETENTION_DAYS: z.coerce.number().int().min(30).max(3650).default(395),
  COLLECT_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().min(10).max(100_000).default(600),
  COUNTRY_HEADER: z.string().default('cf-ipcountry'),
});

function parseOrigins(raw: string): string[] {
  const origins = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      try {
        const url = new URL(value);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('bad protocol');
        return url.origin;
      } catch {
        throw new ConfigError(`ALLOWED_ORIGINS contains an invalid origin: "${value}"`);
      }
    });
  if (origins.length === 0) throw new ConfigError('ALLOWED_ORIGINS must contain at least one origin');
  return [...new Set(origins)];
}

/** Reads and validates environment variables. Fails fast with a readable message. */
export function loadConfig(env: NodeJS.ProcessEnv): AppConfig {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`);
    throw new ConfigError(`Invalid configuration:\n${lines.join('\n')}`);
  }
  const v = parsed.data;

  return {
    env: v.NODE_ENV,
    isProduction: v.NODE_ENV === 'production',
    host: v.HOST,
    port: v.PORT,
    databasePath: v.DATABASE_PATH,
    allowedOrigins: parseOrigins(v.ALLOWED_ORIGINS),
    trustProxy: v.TRUST_PROXY,
    appSecret: v.APP_SECRET,
    adminUsername: v.ADMIN_USERNAME,
    adminPasswordHash: v.ADMIN_PASSWORD_HASH,
    sessionTtlSeconds: Math.round(v.SESSION_TTL_HOURS * 3600),
    reportUtcOffsetMinutes: v.REPORT_UTC_OFFSET_MINUTES,
    retentionDays: v.RETENTION_DAYS,
    collectRateLimitPerMinute: v.COLLECT_RATE_LIMIT_PER_MINUTE,
    countryHeader: v.COUNTRY_HEADER.trim() ? v.COUNTRY_HEADER.trim().toLowerCase() : null,
  };
}
