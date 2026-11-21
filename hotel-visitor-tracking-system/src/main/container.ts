import type Database from 'better-sqlite3';
import type { Clock } from '../application/ports/Clock.js';
import { AuthenticateAdmin } from '../application/use-cases/AuthenticateAdmin.js';
import { GetDashboardAnalytics } from '../application/use-cases/GetDashboardAnalytics.js';
import { PurgeExpiredEvents } from '../application/use-cases/PurgeExpiredEvents.js';
import { RecordTrackingEvent } from '../application/use-cases/RecordTrackingEvent.js';
import { VerifyAdminSession } from '../application/use-cases/VerifyAdminSession.js';
import type { AppConfig } from '../infrastructure/config/env.js';
import { openDatabase } from '../infrastructure/persistence/sqlite/openDatabase.js';
import { SqliteAnalyticsQuery } from '../infrastructure/persistence/sqlite/SqliteAnalyticsQuery.js';
import { SqliteEventRepository } from '../infrastructure/persistence/sqlite/SqliteEventRepository.js';
import { ConfiguredAdminCredentialsVerifier } from '../infrastructure/security/ConfiguredAdminCredentialsVerifier.js';
import { HmacIpHasher } from '../infrastructure/security/HmacIpHasher.js';
import { HmacSessionTokenService } from '../infrastructure/security/HmacSessionTokenService.js';
import { RegexBotDetector } from '../infrastructure/services/RegexBotDetector.js';
import { RegexUserAgentParser } from '../infrastructure/services/RegexUserAgentParser.js';
import { SystemClock } from '../infrastructure/services/SystemClock.js';

export interface Container {
  useCases: {
    recordTrackingEvent: RecordTrackingEvent;
    getDashboardAnalytics: GetDashboardAnalytics;
    authenticateAdmin: AuthenticateAdmin;
    verifyAdminSession: VerifyAdminSession;
    purgeExpiredEvents: PurgeExpiredEvents;
  };
  database: Database.Database;
  close(): void;
}

/**
 * Composition root: the ONLY place that knows which concrete classes implement which port.
 * Swapping SQLite for PostgreSQL later means changing this file and adding two adapter classes.
 */
export function buildContainer(config: AppConfig, clock: Clock = new SystemClock()): Container {
  const database = openDatabase(config.databasePath);

  const events = new SqliteEventRepository(database);
  const query = new SqliteAnalyticsQuery(database);
  const tokens = new HmacSessionTokenService(config.appSecret, config.sessionTtlSeconds);
  const credentials = new ConfiguredAdminCredentialsVerifier(config.adminUsername, config.adminPasswordHash);

  return {
    database,
    useCases: {
      recordTrackingEvent: new RecordTrackingEvent({
        events,
        ipHasher: new HmacIpHasher(config.appSecret),
        userAgents: new RegexUserAgentParser(),
        bots: new RegexBotDetector(),
        clock,
      }),
      getDashboardAnalytics: new GetDashboardAnalytics({
        query,
        clock,
        utcOffsetMinutes: config.reportUtcOffsetMinutes,
      }),
      authenticateAdmin: new AuthenticateAdmin({ credentials, tokens, clock }),
      verifyAdminSession: new VerifyAdminSession({ tokens, clock }),
      purgeExpiredEvents: new PurgeExpiredEvents({ events, clock, retentionDays: config.retentionDays }),
    },
    close: () => database.close(),
  };
}
