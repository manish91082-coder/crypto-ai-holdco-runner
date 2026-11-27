import pg from "pg";
import { config } from "./config.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 3,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 8000,
  application_name: "crypto-ai-holdco-runtime-pilot",
  ssl: { rejectUnauthorized: true }
});

pool.on("error", (error) => {
  // Do not log connection strings, SQL parameters, or credentials.
  console.error(JSON.stringify({
    event: "database_pool_error",
    code: error?.code ?? "UNKNOWN",
    message: "Database pool reported an error"
  }));
});

export async function checkDatabase() {
  const result = await pool.query("SELECT 1 AS healthy, current_database() AS database_name");
  return {
    healthy: result.rows[0]?.healthy === 1,
    database: result.rows[0]?.database_name ?? null
  };
}

export async function assertRuntimeSchema() {
  const result = await pool.query(
    "SELECT to_regclass('runtime.tasks') AS tasks, to_regclass('runtime.agent_messages') AS messages, to_regclass('runtime.audit_events') AS audit"
  );
  const row = result.rows[0];
  if (!row?.tasks || !row?.messages || !row?.audit) {
    throw new Error("PILOT_SCHEMA_NOT_READY");
  }
}

export async function closeDatabase() {
  await pool.end();
}