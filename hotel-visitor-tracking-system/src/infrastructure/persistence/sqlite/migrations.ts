import type Database from 'better-sqlite3';

interface Migration {
  id: number;
  name: string;
  sql: string;
}

/**
 * Append-only list. Never edit a migration that has already been released;
 * add a new one instead.
 */
const MIGRATIONS: readonly Migration[] = [
  {
    id: 1,
    name: 'create_tracking_events',
    sql: `
      CREATE TABLE tracking_events (
        id            INTEGER PRIMARY KEY,
        type          TEXT    NOT NULL CHECK (type IN ('pageview', 'engagement', 'custom')),
        name          TEXT,
        occurred_at   INTEGER NOT NULL,           -- epoch milliseconds (UTC)
        visitor_id    TEXT    NOT NULL,
        session_id    TEXT    NOT NULL,
        path          TEXT    NOT NULL,
        is_returning  INTEGER NOT NULL DEFAULT 0 CHECK (is_returning IN (0, 1)),
        duration_ms   INTEGER,
        referrer_host TEXT,
        source        TEXT    NOT NULL,
        medium        TEXT    NOT NULL,
        campaign      TEXT,
        device_type   TEXT    NOT NULL,
        browser       TEXT    NOT NULL,
        os            TEXT    NOT NULL,
        country       TEXT,
        language      TEXT,
        timezone      TEXT,
        screen_width  INTEGER,
        ip_hash       TEXT    NOT NULL
      );
      CREATE INDEX idx_events_type_time ON tracking_events (type, occurred_at);
      CREATE INDEX idx_events_time      ON tracking_events (occurred_at);
    `,
  },
];

export function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id         INTEGER PRIMARY KEY,
      name       TEXT    NOT NULL,
      applied_at INTEGER NOT NULL
    )
  `);

  const applied = new Set(
    (db.prepare('SELECT id FROM schema_migrations').all() as Array<{ id: number }>).map((row) => row.id),
  );
  const record = db.prepare('INSERT INTO schema_migrations (id, name, applied_at) VALUES (?, ?, ?)');

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.id)) continue;
    db.transaction(() => {
      db.exec(migration.sql);
      record.run(migration.id, migration.name, Date.now());
    })();
  }
}
