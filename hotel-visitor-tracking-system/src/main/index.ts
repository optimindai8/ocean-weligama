import { existsSync } from 'node:fs';
import path from 'node:path';
import { ConsoleLogger } from '../infrastructure/logging/ConsoleLogger.js';
import { ConfigError, loadConfig } from '../infrastructure/config/env.js';
import { createApp } from '../interfaces/http/createApp.js';
import { buildContainer } from './container.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function main(): void {
  const logger = new ConsoleLogger();

  if (existsSync('.env')) process.loadEnvFile('.env');

  let config;
  try {
    config = loadConfig(process.env);
  } catch (error) {
    console.error(error instanceof ConfigError ? error.message : error);
    process.exit(1);
  }

  const container = buildContainer(config);
  const app = createApp({
    config,
    logger,
    // Same relative location whether running from src/ (dev) or dist/ (production build).
    publicDir: path.resolve(import.meta.dirname, '../../public'),
    useCases: container.useCases,
  });

  const server = app.listen(config.port, config.host, () => {
    logger.info('server_started', { host: config.host, port: config.port, env: config.env });
  });

  // Retention: delete old raw events once at start-up and then once a day (one wake-up per day).
  const purge = async (): Promise<void> => {
    try {
      const removed = await container.useCases.purgeExpiredEvents.execute();
      if (removed > 0) logger.info('old_events_deleted', { removed });
    } catch (error) {
      logger.error('purge_failed', { message: error instanceof Error ? error.message : 'unknown error' });
    }
  };
  void purge();
  const purgeTimer = setInterval(() => void purge(), ONE_DAY_MS);
  purgeTimer.unref(); // never keeps the process alive on its own

  let shuttingDown = false;
  const shutdown = (signal: string): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info('shutting_down', { signal });
    clearInterval(purgeTimer);
    server.close(() => {
      container.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref(); // force-exit if connections hang
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main();
