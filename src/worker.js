import { pool } from "./db.js";
import { config } from "./config.js";
import { executePipeline } from "./pipeline.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let stopping = false;
let running = false;

async function claimTask() {
  const result = await pool.query(`
    WITH candidate AS (
      SELECT id
      FROM runtime.tasks
      WHERE status = 'queued'
      ORDER BY created_at
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    UPDATE runtime.tasks AS task
    SET status = 'running',
        attempt_count = task.attempt_count + 1,
        started_at = now(),
        updated_at = now()
    FROM candidate
    WHERE task.id = candidate.id
    RETURNING task.*
  `);
  return result.rows[0] ?? null;
}

async function updateTask(id, status, result = null, error = null) {
  await pool.query(
    `UPDATE runtime.tasks
     SET status=$2, result=$3::jsonb, last_error=$4,
         completed_at=CASE WHEN $2 IN ('completed','failed') THEN now() ELSE completed_at END,
         updated_at=now()
     WHERE id=$1`,
    [id, status, result ? JSON.stringify(result) : null, error]
  );
}

async function runOne() {
  const task = await claimTask();
  if (!task) return false;
  try {
    const result = await executePipeline(task);
    await updateTask(task.id, "completed", result, null);
  } catch (error) {
    const retry = task.attempt_count < task.max_attempts;
    await updateTask(task.id, retry ? "queued" : "failed", null,
      String(error?.message ?? "TASK_FAILED").slice(0, 200));
  }
  return true;
}

async function heartbeat() {
  await pool.query(
    `INSERT INTO runtime.worker_heartbeats (worker_id, last_seen_at, status, metadata)
     VALUES ($1, now(), 'running', $2::jsonb)
     ON CONFLICT (worker_id) DO UPDATE
     SET last_seen_at=now(), status='running', metadata=EXCLUDED.metadata`,
    ["primary-worker", JSON.stringify({ version: "0.1.0", pid: process.pid })]
  );
}

export async function runOnce() {
  return runOne();
}

export function startWorker() {
  if (running || !config.workerEnabled) return;
  running = true;
  stopping = false;
  void (async () => {
    while (!stopping) {
      try {
        await heartbeat();
        const processed = await runOne();
        if (!processed) await sleep(config.workerPollMs);
      } catch (error) {
        console.error(JSON.stringify({
          event: "worker_cycle_error",
          code: error?.code ?? "UNKNOWN",
          message: String(error?.message ?? "WORKER_ERROR").slice(0, 120)
        }));
        await sleep(Math.max(config.workerPollMs, 5000));
      }
    }
    running = false;
  })();
}

export async function stopWorker() {
  stopping = true;
  if (running) {
    await pool.query(
      "UPDATE runtime.worker_heartbeats SET status='stopping', last_seen_at=now() WHERE worker_id='primary-worker'"
    ).catch(() => {});
  }
}