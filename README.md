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
- Neon Function `cryptoaicore`, deployment #16, Node.js 24, Singapore.
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
Latest continuity: [v34.26](docs/CONTINUITY_CHECKPOINT_2026-11-27_v34.26.md).  
Next-chat resume: [v2.7.7](docs/NEXT_CHAT_RESUME_PROMPT_v2.7.7.md).

## Evidence and verification

- Reproducible Governor test: `db/tests/pilot/verify_governor_pause_running_recovery.sql`.
- Database migration: `db/migrations/pilot/20261127_fail_closed_governor.sql`.
- Static regression tests: `tests/governor-migration.test.js`.
- Active Function documentation: [Neon Function runtime README](neon-functions/cryptoaicore/README.md).
- Latest live OIDC runtime CI #109: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46043581519 (SUCCESS); follow-up regression CI #110: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46043585428 (SUCCESS); earlier security CI #69/#70 remain historical evidence.
- CI includes source integrity/build, 40 domain/security tests, live readiness, seven-role agent card, positive OIDC Bearer metrics HTTP 200, OIDC privilege-escalation denials, unauthenticated route denials and forged-trigger HTTP 401.

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


## Current P03.03 security checkpoint — v34.22
- Neon Function deployment #12, Node.js 24, Singapore. The runtime DB role has least-privilege access and no direct token-table SELECT.
- API/cron credentials now have explicit scopes, 30-day expiry, revocation fields, rotation groups and last-used tracking. Existing credential expiry: 27-Dec-2026 09:44:32 UTC. No replacement token issued or rotated.
- Scoped validators enforce enabled/scope/expiry/revocation. Request-body cap 65,536 bytes; generic internal errors are sanitised.
- CI #69 denies unauthenticated metrics, task submission, A2A and cron routes with HTTP 401.
- Positive database validator canary now passes (API metrics:read=1, wrong wallet:withdraw=0; cron dispatch:run=1) and both last_used_at fields are observed. Positive HTTP bearer request, secure token rotation and subject-bound task ownership remain open. The tasks:read:any scope is restricted to the single operator pilot and is not suitable for multiple buyers.
- Neon remains infrastructure for our own agent services only. Do not white-label/resell Neon APIs or build a competing Neon backend. Customer remains responsible for security and backups.
- P03.03 PARTIAL; P03.05 quota Governor not yet implemented. Scheduler disabled; Governor PAUSE_DEGRADED / work_allowed=false; realised net revenue 0.
- [P03.03 security report](docs/P03.03_NEON_FUNCTION_AUTH_HARDENING_2026-11-27.md), [continuity v34.24](docs/CONTINUITY_CHECKPOINT_2026-11-27_v34.24.md), [resume v2.7.5](docs/NEXT_CHAT_RESUME_PROMPT_v2.7.5.md).


## v34.24 positive scoped-validator checkpoint
- Function deployment #12 SHA-256: `15871f3c2114ba0b0c21a3634ca9b267fb7a3802cf71aac41d4d007c596c3c87`.
- Database-only positive validator check passed without exposing raw credentials: API `metrics:read` one match; API wrong `wallet:withdraw` zero matches; cron `dispatch:run` one match. Both last-used timestamps are now non-null.
- This is not an authenticated HTTP bearer proof; no task was inserted or dispatched.
- Both credentials expire 27-Dec-2026 09:44:32.105 UTC; no rotation/reissue yet.
- Current project transfer: 24,997,930 bytes (2.500% of custom cap); active and compute use unchanged at 73.061% / 66.528%.
- Current continuity v34.24, audit 48, snapshot 64. P03.03 remains PARTIAL.


## v34.25 — deployment #14 and cron trigger provenance hardening (27-Nov-2026)
- Pilot Function `cryptoaicore`, deployment **#14**, Node.js 24, Singapore; patched source SHA-256 `1ab68658535fbfa6302da18512d8c1d2d902f10def7cebeb722b3e32ef77b567`.
- The scheduled route no longer carries a secret in its URL. It is fixed at `POST /internal/dispatch` and accepts only the Neon edge-attested `X-Neon-Trigger-Invocation-Id` matched to the request envelope and the exact scheduled-trigger ID.
- The existing trigger path is now `/internal/dispatch`; **enabled=false**, `next_run_at=null`. No recurring dispatch is running.
- CI #87: [run 46039261655](https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46039261655), SUCCESS; 25/25 tests; live readiness, DB role, Governor and A2A card checks pass. Forged public trigger request returned **401 UNAUTHORIZED**; unauthenticated metrics/tasks/A2A also returned 401.
- Pilot ownership read-back: 7/7 synthetic task rows are owner-bound; 0 owner-less, 0 queued, 0 running. Pilot API scope has `tasks:read:own`, not `tasks:read:any`. This is a single-pilot boundary, not multi-tenant certification.
- Final pilot Governor remains `PAUSE_DEGRADED / work_allowed=false`. No actual scheduler invocation, buyer work, payment, wallet action, trading or revenue is claimed.
- P03.03 remains PARTIAL: positive authenticated API Bearer HTTP canary and safe credential issue/revoke/rotation/reissue procedure remain open. P03.05 remains PLANNED/not active; its persisted daily budget and 80% quota stops are not deployed. P03 exit remains NOT PASSED; P04 not started.



## Deployment #16 — GitHub OIDC metrics-only workload identity (27-Nov-2026)
- Active Neon Function `cryptoaicore`, deployment **#16**, Node.js 24, Singapore `aws-ap-southeast-1`.
- Deployed source SHA-256: `76e31c353eacb59f1ffb5d7697d467da66b84ab93dd0de4db5b86e68b386201c`.
- GitHub Actions issues a short-lived OIDC JWT for this exact repository, workflow, push branch and actor. The Function verifies RS256 signature against GitHub's JWKS, issuer, audience, immutable repository/owner IDs, exact workflow_ref, event/ref, actor, hosted-runner and token time claims. JWT/token content and raw claims are never written to logs.
- The OIDC workload identity is accepted **only** for `GET /v1/metrics` (`metrics:read`). Live request returns HTTP 200.
- Live scope-escalation probes for `agents:read`, `demo:run`, `tasks:write`, `tasks:read:own` and A2A all returned HTTP 401. Unauthenticated metrics/tasks/A2A and forged public Neon trigger requests also returned HTTP 401.
- CI #109: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46043581519 — SUCCESS; 40/40 tests; 15 OIDC claim checks passed; positive metrics HTTP 200; five OIDC scope-escalation denials and existing unauthenticated/forged-trigger denials passed. CI #110: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46043585428 — SUCCESS (follow-up policy suite).
- This is a CI workload identity, not the `owner-operator-pilot` application API token and not a general API credential. It does not authorize task mutation, A2A, wallet, financial, scheduler or owner operations.
- The Neon trigger remains disabled (`/internal/dispatch`, `next_run_at=null`); Governor remains `PAUSE_DEGRADED / work_allowed=false`. No task dispatched, no buyer action, no financial action, and no revenue.

## Operator API credential inventory and rotation decision
- Current Neon app credential subject `owner-operator-pilot`: enabled, scopes `agents:read`, `demo:run`, `tasks:write`, `metrics:read`, `a2a:write`, `tasks:read:own`; expiry `2026-12-27T09:44:32.105Z`; last-used metadata `2026-11-27T14:55:00.737Z`. No raw token or hash was read.
- The old cron credential `neon-scheduled-dispatcher` remains disabled/revoked; raw token/hash was not read.
- The connected Railway project `Crypto Holdco Pilot` has a `pilot` environment but zero services and zero shared variables. The repository's `APP_API_TOKEN` is a separate placeholder-based legacy Node scaffold setting, not evidence of a live service consumer.
- CI no longer needs a long-lived application bearer: its OIDC identity is short-lived and metrics-only. This does not prove the owner API token has no manual or external consumers. Its last-used timestamp is not a complete consumer inventory.
- **Rotation decision: NO-GO until consumer mapping and protected one-time delivery are available.** Do not revoke or rotate the existing owner token prematurely. See `docs/P03.03_OPERATOR_CREDENTIAL_ROTATION_AND_CONSUMER_INVENTORY_v1.0.md` for the controlled overlap/cutover/revocation procedure.
- No credential was created, rotated, reissued or revoked in this update. The existing token remains active and expires on 27-Dec-2026; the raw value remains undisclosed.

## Current P03.03 / P03.05 status
- P03.03 remains ACTIVE / PARTIAL. OIDC metrics-only HTTP proof and scope-denial proof are complete. The normal owner API-token HTTP path, protected token delivery/rotation, and real provider-origin trigger delivery remain open.
- P03.05 remains PLANNED / NOT ACTIVE. Application daily budgets, custom quota enforcement, 80% fail-closed stops and durable checkpoint recovery are not yet implemented.
- P03 exit NOT PASSED; P04 NOT STARTED. WBS counts remain 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED. The locked Master/WBS are unchanged.
