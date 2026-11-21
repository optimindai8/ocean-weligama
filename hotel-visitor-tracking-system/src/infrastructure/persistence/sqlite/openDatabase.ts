import { mkdirSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { runMigrations } from './migrations.js';

/** Opens (and creates, if needed) the SQLite database with safe, low-power settings. */
export function openDatabase(databasePath: string): Database.Database {
  if (databasePath !== ':memory:') {
    mkdirSync(path.dirname(path.resolve(databasePath)), { recursive: true });
  }

  const db = new Database(databasePath);
  db.pragma('journal_mode = WAL'); // readers never block the writer: smooth under load
  db.pragma('synchronous = NORMAL'); // safe with WAL, far fewer disk flushes
  db.pragma('busy_timeout = 5000');
  db.pragma('foreign_keys = ON');

  runMigrations(db);
  return db;
}
