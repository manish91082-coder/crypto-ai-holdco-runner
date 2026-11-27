# Crypto AI Holdings — Continuity Checkpoint v34.24
Observed: 27-Nov-2026 14:42 UTC
Mission key: `crypto-ai-holdco-master`

## Locked authority
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3bda6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`
- Both remain immutable and unchanged.

## Current WBS state
- Phase P03 Cloud Runtime & Resilience remains IN_PROGRESS; exit NOT PASSED; P04 not started.
- P03.01 COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION.
- P03.02 and P03.04 COMPLETE.
- P03.03 active, PLANNED / nested PARTIAL.
- P03.05 PLANNED / nested PARTIAL, later in sequence.
- Task counts: 16 COMPLETE, 1 BLOCKED, 102 PLANNED, 0 QUEUED (119 total).
- Active task: `CRYPTO-HOLDCO-V2-P03-03`.
- Canonical continuity v34.24, audit round 48, snapshot `snap.holdco.continuity.v34.24`, sequence 64.

## Canonical resources
- Neon project `little-violet-66887398`, plan `free_v3`.
- Canonical branch/database/schema `br-calm-block-a1fbdnnj` / `crypto_holdco` / `holdco`.
- Runtime pilot branch `br-lively-flower-a15zb6ar`, database `crypto_holdco`.
- GitHub repo `manish91082-coder/crypto-ai-holdco-runner`, branch `temporary-zero-cost-runtime-pilot`.

## Deployed runtime #12
- Function `cryptoaicore`, deployment #12, Node.js 24, Singapore (`aws-ap-southeast-1`).
- Source SHA-256: `15871f3c2114ba0b0c21a3634ca9b267fb7a3802cf71aac41d4d007c596c3c87`.
- CI #69 independently rebuilt the same patched source hash and passed live smoke.
- CI #69: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46016226247 (SUCCESS).
- CI #70: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46017056190 (SUCCESS).
- Environment variable name inventory is `DATABASE_URL` only; environment values were not read.
- Neon Function variables are deployment snapshots; do not claim this is a dedicated private-key vault.

## Runtime identity / RLS / Governor
- DB identity `crypto_holdco_function`: NOSUPERUSER, NOCREATEDB, NOCREATEROLE, NOBYPASSRLS.
- USAGE on `runtime`; no USAGE on canonical `holdco`.
- Forced RLS on `runtime.tasks`; task SELECT and UPDATE require Governor RUNNING and `work_allowed=true`.
- Function role has SELECT-only on `runtime.control_plane`.
- Scheduler trigger `trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71` disabled; `next_run_at=null`.
- Governor `PAUSE_DEGRADED`; `work_allowed=false`.
- Seven specialist entries remain logical roles within one deterministic Function, not seven independent LLM agents.

## Scoped API and cron credential lifecycle
Token tables now contain `token_hash`, `subject`, `enabled`, `created_at`, `scopes`, `expires_at`, `revoked_at`, `rotation_group`, `last_used_at`. Raw bearer values and token hashes were never read or surfaced.
- API token subject `owner-operator-pilot`; scopes: `agents:read`, `demo:run`, `tasks:write`, `tasks:read:any`, `metrics:read`, `a2a:write`.
- Cron subject `neon-scheduled-dispatcher`; scope: `dispatch:run` only.
- Both expire at `2026-12-27T09:44:32.105Z`; neither has been rotated or replaced.
- SECURITY DEFINER validators `runtime.validate_api_token(text,text)` and `runtime.validate_cron_token(text,text)` have fixed `search_path=pg_catalog,runtime`, enforce enabled/scope/expiry/revocation and update last-used timestamps.
- Function role has EXECUTE on these validators but no direct SELECT on either token table; PUBLIC execute is revoked.
- API routes have explicit scope mapping. JSON request body max 65,536 bytes; oversized requests return 413; invalid JSON 400; internal error response is sanitized.
- CI #69 negative tests: unauthenticated metrics, task submission, A2A message and cron dispatch all returned HTTP 401.
- New positive database-validator canary: API `metrics:read` accepted (1); wrong `wallet:withdraw` scope rejected (0); cron `dispatch:run` accepted (1). Subsequent read-back found `last_used_at` non-null on both.
- This is a database-validator test, NOT a positive authenticated HTTP bearer request. No task was inserted or dispatched.
- `tasks:read:any` remains single-operator only until task ownership isolation is built.
- Cron credential is currently carried in the dispatch URL path; review logging exposure and replace with a safer invocation mechanism before enabling any scheduled trigger.

## Neon current custom project usage
Billing period 2026-11-16T06:19:20Z to 2026-12-01T00:00:00Z.
- Active cap 129,600 sec; current 94,687 (73.061%).
- Compute cap 36,000 CU-sec = 10 CU-hours; current 23,950 (66.528%).
- Transfer cap 1,000,000,000 bytes; current 24,997,930 (2.500%).
- Writes cap 268,435,456 bytes; current 0.
- Functions active/waiting Capacity-Hours and MTD invocations remain UNKNOWN on Free; do not infer zero.
- Proposed P03.05 80% thresholds and daily invocation budgets are NOT live.
- Exact billed storage remains UNKNOWN; logical size is not an invoice meter.

## Neon Terms / suitability
Official Terms permit ordinary Project management, queries and compute, but prohibit commercial resale/white-labeling of Neon products/APIs/connectors and building a competing Neon backend. Customer is responsible for credential security and backups. Neon uses commercially reasonable efforts and reserves the right to change/discontinue product functionality; there is no Free-plan 24x7 SLA. The pilot sells our own agent services, not Neon itself.
Terms: https://d7umqicpi7263.cloudfront.net/eula/ETeCDF9JpM27sHwVLg5xdCTWvMfSD6N0ibw9OxKWt80

## Strict money / operational boundary
- No live trading, wallet signing, transfers, payments, external submissions or owner-funded gas.
- No paid fallback, upgrades or paid snapshots.
- No canonical private-data backup to public GitHub.
- No real buyer/accepted-delivery/treasury ledger entries until private canonical backup + restore passes.
- Realised net revenue remains zero; no revenue claim.

## Next actions, remain within P03.03
1. Establish a positive authenticated HTTP bearer canary through a secure method that does not expose raw credentials.
2. Implement/complete issue, revoke, rotate and reissue process before 27-Dec-2026 expiry.
3. Build token-subject task ownership; keep `tasks:read:any` single-operator only.
4. Review the cron secret in URL-path handling and log-exposure risk; no scheduler activation.
5. Complete deployment/environment/runtime provider checklist.

Then and only then move to P03.05: persisted daily invocation budgets, custom-project quota counters, 80% fail-closed soft stop, checkpoint/recovery and verified free fallback. Keep Governor paused and scheduler disabled. P03 exit NOT PASSED.
