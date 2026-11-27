# Crypto AI Holdings — Autonomous Crypto Revenue Ecosystem

**Current status (27-Nov-2026): isolated zero-upfront runtime pilot deployed, Governor paused, no live revenue operations.**

This repository is the engineering source and audit trail for the Crypto AI Holdings mission. It is public source control, not the production database or an always-on scheduler. The canonical mission ledger remains Neon.

## Mission and locked controls

- Mission key: `crypto-ai-holdco-master`
- Canonical Neon project/database/schema: `little-violet-66887398` / `crypto_holdco` / `holdco`
- Canonical branch: `br-calm-block-a1fbdnnj`
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3bda6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`
- Both locked documents remain unchanged.

The goal is a zero-upfront, cloud-only, crypto-native AI-agent revenue ecosystem with A2A coordination, funded opportunity qualification, engineering delivery and independently verified positive net revenue. Synthetic tests, proposals and unaccepted work are not revenue.

## Current runtime

- Isolated pilot branch: `br-lively-flower-a15zb6ar`, database `crypto_holdco`.
- Neon Function `cryptoaicore`, deployment #12, Node.js 24, Singapore.
- Function database identity: `crypto_holdco_function`.
- `/readyz` reports `governor_state=PAUSE_DEGRADED`, `work_allowed=false`.
- Seven specialist roles appear in the A2A agent card. These are logical roles in one Function, not yet seven independent LLM instances.
- Neon scheduler trigger exists but is **disabled**. No recurring polling or autonomous dispatch is running.
- All five known PostgreSQL endpoints are idle after the latest audit.

## Current four-gate release policy

The four pre-production checks are separated by the release they protect. They are not all blockers to engineering.

1. **Functions MTD usage:** exact active/waiting Capacity-Hours and MTD invocations remain UNKNOWN because the Free-plan consumption API returns HTTP 403. This does not block engineering or bounded on-demand synthetic work while the scheduler is disabled. It is required before recurring scheduling or sustained autonomous dispatch.
2. **Billed storage:** exact Console billing meter is not a development blocker on confirmed Free v3. Published caps are 1GB PostgreSQL/project and 5GB Object Storage/project. Monitor size; logical database/branch size is not invoice storage. No paid snapshots or upgrades.
3. **Private canonical backup:** mandatory before first real buyer contract, accepted delivery, settled receipt or treasury/revenue ledger write. It does not block isolated synthetic engineering or public read-only discovery. Private canonical ledger data must never be stored in this public repository.
4. **Governor:** mandatory before worker activation. Both PAUSE and RUNNING recovery passed with the actual dispatcher claim query. The Governor was restored to `PAUSE_DEGRADED`; test data was removed.

Detailed gate decision: [P03 Goal-First Gate Review](docs/P03_GOAL_FIRST_GATE_REVIEW_2026-11-27.md).  
Latest continuity: [v34.22](docs/CONTINUITY_CHECKPOINT_2026-11-27_v34.22.md).  
Next-chat resume: [v2.7.4](docs/NEXT_CHAT_RESUME_PROMPT_v2.7.4.md).

## Evidence and verification

- Reproducible Governor test: `db/tests/pilot/verify_governor_pause_running_recovery.sql`.
- Database migration: `db/migrations/pilot/20261127_fail_closed_governor.sql`.
- Static regression tests: `tests/governor-migration.test.js`.
- Active Function documentation: [Neon Function runtime README](neon-functions/cryptoaicore/README.md).
- Latest security runtime CI run #69: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46016226247 (SUCCESS).
- CI includes source integrity/build, domain/safety tests, Governor policy regression tests, live readiness, seven-role agent card and HTTP 401 denial for unauthenticated internal metrics.

## Strict boundaries

- No paid fallback, upgrade, paid snapshot, top-up or owner-funded gas.
- No live trading, wallet signing, token transfers, payments, external submissions or production key handling.
- No scheduler activation while Functions MTD headroom is unknown.
- No real buyer/financial ledger record until the private canonical backup/restore release gate passes.
- Synthetic pilot opportunity fixtures are not real buyers or funded work.
- Realised net revenue remains zero; no revenue claim is made.

## Roadmap

The detailed historical plan and evidence overlays are in [docs/ROADMAP.md](docs/ROADMAP.md). Older status statements in that history are explicitly superseded by the 27-Nov-2026 current overlay; they are retained for audit history.


## Latest WBS and quota checkpoint — Continuity v34.21
- P03.01 is now COMPLETE with a documented Neon Free Functions-meter limitation; P03.03 is the next active WBS task.
- Counts: 16 COMPLETE, 1 BLOCKED, 102 PLANNED, 0 QUEUED of 119. P03 remains IN_PROGRESS; its exit gate is NOT PASSED.
- Actual custom Neon project caps: 129,600 active seconds; 36,000 compute CU-seconds (10 CU-hours); 268,435,456 written bytes; 1,000,000,000 transfer bytes; 536,870,912 per-branch logical-size cap.
- Latest use: active 94,687 sec (73.061%); compute 23,950 CU-sec (66.5278%); transfer 24,860,369 bytes (2.486%); writes zero.
- Neon Free Functions active/waiting MTD Capacity-Hours and invocations remain UNKNOWN, not zero, because the Free API returns 403 and the simplified Usage Summary omits these Function metrics. Scheduler remains disabled.
- P03.05 must implement application-level invocation/day budget and proposed 80% stop thresholds. These are not currently deployed.
- Details: [custom quota telemetry](docs/P03.01_NEON_PROJECT_QUOTA_TELEMETRY_2026-11-27.md), [continuity v34.21](docs/CONTINUITY_CHECKPOINT_2026-11-27_v34.21.md), [resume prompt v2.7.3](docs/NEXT_CHAT_RESUME_PROMPT_v2.7.3.md).


## Latest P03.03 security and continuity checkpoint — v34.22
- Function deployment #12, Node.js 24, Singapore. The database role has least-privilege access; direct token-table SELECT is revoked.
- API and cron tokens now have explicit scopes, 30-day expiry, revocation fields, rotation groups and last-used tracking. Existing credentials expire 27-Dec-2026 09:44:32 UTC. No replacement token has been issued or rotated.
- Scoped validators enforce enabled, scope, expiry and revocation. Request body cap is 65,536 bytes; internal error messages are sanitised.
- CI #69 denies unauthenticated metrics, task submission, A2A and cron routes with HTTP 401.
- Positive bearer-token canary, secure rotation, subject-bound task ownership and successful last-used event remain unverified. The owner-only tasks:read:any scope is not approved for multi-tenant use.
- Neon Terms review: use Neon only as infrastructure for Crypto AI Holdings' own services; do not resell/white-label Neon APIs/products or build a competing Neon backend. Customer-owned backup/security responsibility remains.
- P03.03 remains PARTIAL; P03.05 quota Governor remains PLANNED. Scheduler disabled, Governor PAUSE_DEGRADED, work_allowed=false, revenue ₹0.
- [P03.03 security review](docs/P03.03_NEON_FUNCTION_AUTH_HARDENING_2026-11-27.md), [continuity v34.22](docs/CONTINUITY_CHECKPOINT_2026-11-27_v34.22.md), [resume prompt v2.7.4](docs/NEXT_CHAT_RESUME_PROMPT_v2.7.4.md).
