# Crypto AI Holdings — Temporary Zero-Cost Runtime Pilot

This is a temporary, isolated execution pilot. It is not a production revenue claim.

## What it runs
- One Node.js API + worker process.
- Durable PostgreSQL task queue in the isolated Neon pilot branch, schema `runtime`.
- Seven specialist workflow agents: discovery, eligibility, planning, engineering, independent QA, delivery packaging and revenue evidence hand-off.
- Internal agent-to-agent messages and append-only pilot audit events.
- Health/readiness, task queue, metrics, agent-card and A2A message endpoints.
- Synthetic end-to-end test flow and fail-closed opportunity qualification.

## Safety
- Live external submissions are disabled.
- Wallet signing, trading, transfers and payments are disabled.
- The revenue-verifier agent cannot certify revenue; it only hands receipt evidence to an independent reviewer.
- A candidate is blocked when actual funding evidence, sponsor, AI participation, India eligibility, scope, deadline or zero-upfront requirements are unknown.
- The pilot role can access only the `runtime` schema in its isolated Neon branch.

## Required provider secrets
- `DATABASE_URL`: scoped `holdco_pilot` connection string for the temporary Neon branch.
- `APP_API_TOKEN`: random 32+ character operator token.
- Optional: `GEMINI_API_KEY` and `GEMINI_MODEL`. Without a model key, deterministic specialist agents run; no paid model API is called.

## Deploy
Connect the Railway service to branch `temporary-zero-cost-runtime-pilot`. Build uses the Dockerfile. Set environment variables in the host's secret manager. The worker starts automatically and polls the durable queue. The free trial is finite; stop the service when its free credit is exhausted and do not upgrade automatically.

## Pilot acceptance
1. `GET /healthz` returns alive.
2. `GET /readyz` returns database connected.
3. `POST /v1/demo` creates a synthetic task.
4. Worker completes it and writes agent messages and audit events.
5. `GET /v1/tasks/:id` shows completion and outputs.
6. `GET /v1/metrics` shows worker heartbeat, task counts and agent messages.
7. Restart the service and confirm the task ledger persists.
8. Repeat with a real public candidate; incomplete funding/eligibility evidence must be blocked.

A synthetic pass proves runtime mechanics only. It is not a buyer, acceptance, settlement or revenue event.