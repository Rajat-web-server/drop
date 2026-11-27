import Database from "@tauri-apps/plugin-sql";
import type { Session } from "../store/timerStore";

let db: Database | null = null;

export async function initDatabase() {
  if (db) return db;

  db = await Database.load("sqlite:drop.db");
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      tag TEXT NOT NULL,
      duration_ms INTEGER NOT NULL,
      started_at INTEGER NOT NULL,
      completed_at INTEGER NOT NULL
    )
  `);

  return db;
}

export async function saveSession(session: Session) {
  const database = await initDatabase();

  await database.execute(
    `INSERT INTO sessions
      (id, tag, duration_ms, started_at, completed_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      session.id,
      session.tag,
      session.durationMs,
      session.startedAt,
      session.completedAt,
    ]
  );
}

export async function getSessions(): Promise<Session[]> {
  const database = await initDatabase();

  return database.select<Session[]>(
    `SELECT
      id,
      tag,
      duration_ms AS durationMs,
      started_at AS startedAt,
      completed_at AS completedAt
     FROM sessions
     ORDER BY completed_at DESC`
  );
}
