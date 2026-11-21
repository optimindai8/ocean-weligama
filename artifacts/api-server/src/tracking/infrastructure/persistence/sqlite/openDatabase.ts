import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { runMigrations } from "./migrations.js";

export interface SqliteRunResult {
  changes: number;
  lastInsertRowid: number | bigint;
}

export interface SqliteStatement {
  run(...params: any[]): SqliteRunResult;
  get(...params: any[]): any;
  all(...params: any[]): any[];
}

export interface SqliteDatabase {
  exec(sql: string): void;
  pragma(sql: string): void;
  prepare(sql: string): SqliteStatement;
  transaction<T>(fn: (...args: any[]) => T): (...args: any[]) => T;
  close(): void;
}

export class NodeSqliteAdapter implements SqliteDatabase {
  private readonly raw: DatabaseSync;

  constructor(filePath: string) {
    this.raw = new DatabaseSync(filePath);
  }

  exec(sql: string): void {
    this.raw.exec(sql);
  }

  pragma(pragmaStr: string): void {
    this.raw.exec(`PRAGMA ${pragmaStr};`);
  }

  prepare(sql: string): SqliteStatement {
    const rawStmt = this.raw.prepare(sql);
    return {
      run: (...args: any[]): SqliteRunResult => {
        if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
          const res = rawStmt.run(args[0]);
          return { changes: Number(res.changes), lastInsertRowid: res.lastInsertRowid };
        }
        const res = rawStmt.run(...args);
        return { changes: Number(res.changes), lastInsertRowid: res.lastInsertRowid };
      },
      get: (...args: any[]): any => {
        if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
          return rawStmt.get(args[0]);
        }
        return rawStmt.get(...args);
      },
      all: (...args: any[]): any[] => {
        if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
          return rawStmt.all(args[0]);
        }
        return rawStmt.all(...args);
      },
    };
  }

  transaction<T>(fn: (...args: any[]) => T): (...args: any[]) => T {
    return (...args: any[]): T => {
      this.raw.exec("BEGIN;");
      try {
        const res = fn(...args);
        this.raw.exec("COMMIT;");
        return res;
      } catch (err) {
        this.raw.exec("ROLLBACK;");
        throw err;
      }
    };
  }

  close(): void {
    this.raw.close();
  }
}

/** Opens (and creates, if needed) the SQLite database with safe, low-power settings. */
export function openDatabase(databasePath: string): SqliteDatabase {
  if (databasePath !== ":memory:") {
    mkdirSync(path.dirname(path.resolve(databasePath)), { recursive: true });
  }

  const db = new NodeSqliteAdapter(databasePath);
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("busy_timeout = 5000");
  db.pragma("foreign_keys = ON");

  runMigrations(db);
  return db;
}
