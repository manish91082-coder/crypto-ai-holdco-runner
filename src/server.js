import express from "express";
import helmet from "helmet";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { config, validateRuntimeConfig } from "./config.js";
import { pool, checkDatabase, assertRuntimeSchema, closeDatabase } from "./db.js";
import { startWorker, stopWorker, runOnce } from "./worker.js";

const app = express();
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "256kb", strict: true }));

const publicAgents = [
  { id: "opportunity-discovery", role: "Find and normalise public candidate opportunities", tools: ["public-http-read"] },
  { id: "eligibility-analyst", role: "Verify funding, country, AI permission and zero-upfront constraints", tools: ["evidence-validation"] },
  { id: "scope-planner", role: "Create bounded work plans", tools: ["plan-generation"] },
  { id: "engineering-agent", role: "Prepare engineering work packages", tools: ["sandbox-plan-only"] },
  { id: "independent-qa", role: "Review scope, safety and output quality", tools: ["independent-checks"] },
  { id: "delivery-packager", role: "Package deliverables for human review", tools: ["artifact-metadata"] },
  { id: "revenue-verifier", role: "Route receipt evidence to an independent verifier", tools: ["receipt-evidence-read"] }
];

function authorised(req, res, next) {
  const expected = config.apiToken;
  const provided = req.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!expected || provided.length !== expected.length) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  if (!timingSafeEqual(a, b)) return res.status(401).json({ error: "UNAUTHORIZED" });
  return next();
}

app.get("/healthz", (_req, res) => {
  res.json({
    status: "alive",
    service: "crypto-ai-holdco-runtime-pilot",
    version: "0.1.0",
    timestamp: new Date().toISOString()
  });
});

app.get("/readyz", async (_req, res) => {
  try {
    const db = await checkDatabase();
    res.json({ ready: db.healthy, database: "connected", name: db.database });
  } catch {
    res.status(503).json({ ready: false, database: "unavailable" });
  }
});

app.get("/.well-known/agent.json", (_req, res) => {
  res.json({
    name: "Crypto AI Holdings Pilot Agent Network",
    description: "Controlled A2A engineering and opportunity qualification pilot",
    version: "0.1.0",
    supportedInterfaces: [{ url: "/a2a/v1/messages", protocolBinding: "HTTP+JSON", protocolVersion: "1.0" }],
    capabilities: { streaming: false, pushNotifications: false },
    authentication: { schemes: ["Bearer"] },
    skills: publicAgents.map((agent) => ({ id: agent.id, name: agent.id, description: agent.role }))
  });
});

app.use("/v1", authorised);
app.use("/a2a", authorised);

app.get("/v1/agents", (_req, res) => res.json({ agents: publicAgents }));

app.post("/v1/tasks", async (req, res) => {
  const taskType = req.body?.task_type;
  const allowed = new Set(["demo_e2e", "qualify_opportunity"]);
  if (!allowed.has(taskType)) return res.status(400).json({ error: "UNSUPPORTED_TASK_TYPE" });
  if (taskType === "qualify_opportunity" && !req.body?.candidate) {
    return res.status(400).json({ error: "CANDIDATE_REQUIRED" });
  }

  const id = randomUUID();
  const idempotencyKey = req.get("idempotency-key")?.slice(0, 200) ?? null;
  try {
    const result = await pool.query(
      `INSERT INTO runtime.tasks (id, task_type, payload, idempotency_key)
       VALUES ($1,$2,$3::jsonb,$4)
       ON CONFLICT (idempotency_key) DO UPDATE SET idempotency_key=EXCLUDED.idempotency_key
       RETURNING id, task_type, status, created_at`,
      [id, taskType, JSON.stringify(req.body), idempotencyKey]
    );
    return res.status(202).json({ task: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "TASK_CREATE_FAILED", code: error?.code ?? "UNKNOWN" });
  }
});

app.post("/v1/demo", async (_req, res) => {
  const id = randomUUID();
  const result = await pool.query(
    "INSERT INTO runtime.tasks (id, task_type, payload) VALUES ($1,'demo_e2e',$2::jsonb) RETURNING id, status, created_at",
    [id, JSON.stringify({ synthetic_test: true })]
  );
  res.status(202).json({ task: result.rows[0], note: "Synthetic test only; not a buyer, award, payment or revenue." });
});

app.get("/v1/tasks", async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 20, 100));
  const result = await pool.query(
    "SELECT id, task_type, status, attempt_count, created_at, updated_at, completed_at, last_error FROM runtime.tasks ORDER BY created_at DESC LIMIT $1",
    [limit]
  );
  res.json({ tasks: result.rows });
});

app.get("/v1/tasks/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM runtime.tasks WHERE id=$1", [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ error: "TASK_NOT_FOUND" });
  res.json({ task: result.rows[0] });
});

app.get("/v1/metrics", async (_req, res) => {
  const result = await pool.query(
    `SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE status='queued')::int AS queued,
      count(*) FILTER (WHERE status='running')::int AS running,
      count(*) FILTER (WHERE status='completed')::int AS completed,
      count(*) FILTER (WHERE status='failed')::int AS failed
     FROM runtime.tasks`
  );
  const messages = await pool.query("SELECT count(*)::int AS count FROM runtime.agent_messages");
  const heartbeat = await pool.query("SELECT worker_id, last_seen_at, status FROM runtime.worker_heartbeats ORDER BY last_seen_at DESC LIMIT 1");
  res.json({ tasks: result.rows[0], agent_messages: messages.rows[0].count, worker: heartbeat.rows[0] ?? null });
});

app.post("/v1/worker/run-once", async (_req, res) => {
  const processed = await runOnce();
  res.json({ processed });
});

app.post("/a2a/v1/messages", async (req, res) => {
  const { task_id, from_agent, to_agent, message_type, payload } = req.body ?? {};
  if (!task_id || !from_agent || !to_agent || !message_type || payload === undefined) {
    return res.status(400).json({ error: "INVALID_A2A_MESSAGE" });
  }
  const task = await pool.query("SELECT id FROM runtime.tasks WHERE id=$1", [task_id]);
  if (!task.rows[0]) return res.status(404).json({ error: "TASK_NOT_FOUND" });
  const id = randomUUID();
  await pool.query(
    "INSERT INTO runtime.agent_messages (id, task_id, correlation_id, from_agent, to_agent, message_type, payload) VALUES ($1,$2,$2,$3,$4,$5,$6::jsonb)",
    [id, task_id, String(from_agent).slice(0, 100), String(to_agent).slice(0, 100), String(message_type).slice(0, 100), JSON.stringify(payload)]
  );
  res.status(202).json({ message_id: id, accepted: true });
});

app.use((error, _req, res, _next) => {
  console.error(JSON.stringify({ event: "request_error", name: error?.name ?? "Error" }));
  res.status(400).json({ error: "INVALID_REQUEST" });
});

const errors = validateRuntimeConfig();
if (errors.length) {
  console.error(JSON.stringify({ event: "configuration_error", errors }));
  process.exit(1);
}

await assertRuntimeSchema();
const server = app.listen(config.port, "0.0.0.0", () => {
  console.log(JSON.stringify({
    event: "service_started",
    port: config.port,
    worker_enabled: config.workerEnabled,
    model_provider: config.modelProvider,
    live_submissions_enabled: false,
    wallet_signing_enabled: false,
    payments_enabled: false
  }));
});

if (config.workerEnabled) startWorker();

async function shutdown(signal) {
  console.log(JSON.stringify({ event: "shutdown", signal }));
  await stopWorker();
  server.close(async () => {
    await closeDatabase();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));