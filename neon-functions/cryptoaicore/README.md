# Neon Function: Crypto AI Holdings Pilot Runtime

## Current deployment
- Neon project: `little-violet-66887398`
- Isolated pilot branch: `br-lively-flower-a15zb6ar`
- Database: `crypto_holdco`
- Function slug: `cryptoaicore`
- Active deployment: `12`
- Deployed source SHA-256: `15871f3c2114ba0b0c21a3634ca9b267fb7a3802cf71aac41d4d007c596c3c87`
- Runtime: Node.js 24
- Region: `aws-ap-southeast-1` (Singapore)
- Invocation URL: `https://br-lively-flower-a15zb6ar-cryptoaicore.compute.c-1.ap-southeast-1.aws.neon.tech/`
- Function DB identity: Neon-managed `crypto_holdco_function`
- Scheduler trigger: present but **disabled**. Do not restart it automatically.
- Public GitHub CI: [latest security runtime smoke run #69](https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46016226247)

## Source and reproducibility
- Base archive: `neon-functions/cryptoaicore/function.zip.b64`
- Base archive source hash: `neon-functions/cryptoaicore/index.mjs.sha256`
- Deterministic build patch: `scripts/patch_neon_function_bundle.py`
- CI verifies the base archive, deterministically patches the Function, checks JavaScript syntax, runs domain/security regression tests, then invokes the live endpoint.
- Deployment 12 adds route-specific API/cron token scopes, expiry/revocation checks, 65,536-byte JSON body limit, sanitized internal errors, and Governor-aware readiness with the active database role. The deterministic patcher rejects the legacy blanket-token lookup and unbounded JSON parser.

## Routes
- `GET /`: service identity and version
- `GET /readyz`: live database readiness, database name, active DB role, four Function-visible operational runtime-table checks, Governor state and `work_allowed`
- `GET /.well-known/agent.json`: seven specialist role card
- `GET|POST /internal/dispatch/<64-hex-secret>`: private scheduled/manual dispatcher; route secret is stored only in the Neon trigger configuration and its SHA-256 digest in `runtime.cron_tokens`
- `POST /v1/demo`: authenticated synthetic E2E
- `POST /v1/tasks`: authenticated opportunity qualification task
- `GET /v1/tasks/:id`: authenticated task result
- `GET /v1/metrics`: authenticated pilot metrics
- `POST /a2a/v1/messages`: authenticated A2A message endpoint

## Verified runtime identity
The live SQL catalog read-back confirms Neon-managed `crypto_holdco_function`:
- `NOSUPERUSER`, `NOCREATEDB`, `NOCREATEROLE`, `NOBYPASSRLS`
- `USAGE` on `runtime`, no `USAGE` on canonical `holdco`
- Read/write on the pilot task, message, audit, and candidate tables
- No direct SELECT on API/cron token tables; EXECUTE only on fixed-search-path `SECURITY DEFINER` token validators

The CI run asserts that the live `/readyz` response identifies `crypto_holdco_function`.

## Backup and restore evidence
- Synthetic-only logical backup: `backups/pilot-runtime-logical-backup-v1.2026-11-27.json`
- SHA-256: `fdad18b80c65395ef4613926f53d959389e1a2058dd2c498d0cccea67288b6eb`
- Restore test branch: `br-flat-violet-a11s64uz`
- Restored counts: 7 tasks, 49 agent messages, 56 audit events, 7 opportunity candidates
- MD5 row-set hashes for tasks/messages/audits/opportunities matched the source branch exactly.
- API/cron token tables were intentionally excluded and remain empty on the restore branch.
- The restore endpoint was suspended after verification.

This backup covers synthetic pilot runtime records only. It is not a backup of the canonical `holdco` schema or of real buyer/revenue records.

## Safety and boundaries
- Main branch and locked Master Constitution/WBS remain unchanged.
- Scheduled trigger is disabled; no autonomous polling is running.
- Live external submissions, wallet signing, trading, transfers, and payments remain disabled.
- All current opportunity fixtures are synthetic. Realised net revenue remains zero; no revenue claim is made.
- No manual Neon snapshot was created because snapshot storage is separately billable. Free-plan point-in-time history is limited to six hours / one GB of changes; the Free plan permits one manual snapshot, but its storage is billed.
- Functions active/waiting Capacity-Hours and exact invocation meter are not available through the current Free-plan consumption API. The API returns 403 for Free; do not infer these meters from provider logs.
- Storage billing is not certified by branch logical-size values.
- Do not upgrade, enable paid fallback, create owner-funded gas, or re-enable the scheduler without a new verified quota decision.


## P03 pilot Governor: database-enforced fail-closed gate
- Migration source: `db/migrations/pilot/20261127_fail_closed_governor.sql`
- Live branch: `br-lively-flower-a15zb6ar` / database `crypto_holdco`
- Live control row: `runtime.control_plane` = `PAUSE_DEGRADED`, `work_allowed=false`
- `runtime.tasks` has Row-Level Security enabled and forced.
- Forced RLS includes both Governor-gated SELECT and UPDATE policies. SELECT must permit the claimed `running` tuple while RUNNING; an earlier `status='queued'` filter incorrectly blocked `UPDATE ... RETURNING`, and was corrected.
- Final two-state recovery test: while paused, Function role saw **0** queued tasks; while RUNNING, the exact dispatcher claim CTE claimed one synthetic probe (`status=running`, `attempt_count=1`); Governor was then restored to `PAUSE_DEGRADED`, the probe was removed, and paused visibility returned to **0**.
- Reproducible test: `db/tests/pilot/verify_governor_pause_running_recovery.sql`. The live runtime audit event records `GOVERNOR_PAUSE_RUNNING_RECOVERY_TEST_PASS`.
- The Function role has **SELECT only** on `runtime.control_plane`; INSERT, UPDATE and DELETE privileges were explicitly revoked after detecting broad default table grants.
- Live post-hardening privilege audit: control-plane SELECT=true; INSERT/UPDATE/DELETE=false. The Function role still has the task-table UPDATE grant, but the forced RLS policy denies all task updates unless the control row is explicitly `RUNNING` and `work_allowed=true`.
- Temporary owner-only test policy and probe row were removed. The durable governor policy and one audit event remain.
- Scheduler remains disabled. Current queued tasks=0 and running tasks=0.
- Database gate changes do not require a Function redeploy; active Function deployment remains #11.
- This is a pilot fail-closed control, not proof of autonomous revenue operation. P03.01 remains partial; P03 exit remains NOT PASSED.


## Current Function deployment 11: Governor-aware readiness
- Active deployment: `11` (Node.js 24, Singapore)
- Patched source SHA-256: `931c4635c038ec9855db1137df5b7822e0313020b59fdaaae9f4b1b5b0d29741`
- `/readyz` now reports `governor_state` and `work_allowed` from the isolated database control-plane row, alongside the live DB role and required runtime table count.
- Live readiness readback: `database_role=crypto_holdco_function`, `governor_state=PAUSE_DEGRADED`, `work_allowed=false`, `runtime_schema_tables=6`.
- CI run #39: [run 46006251587](https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46006251587), retry attempt 2 **SUCCESS**. The live smoke test asserts the paused Governor state, the seven-specialist A2A card, and HTTP 401 for unauthenticated metrics.
- No scheduler activation; no external work, wallet signing, trading, transfers, payments or revenue.


## Goal-first gate rationalisation — 27-Nov-2026
The four pre-production gates are split by what they actually protect. They are no longer all treated as blockers to code development and bounded synthetic testing.

1. **Exact Functions MTD usage meter:** not a blocker for engineering, authenticated on-demand tests or read-only discovery while the scheduler stays disabled. The Free plan's published envelope is 1,000,000 invocations/project/month, 10 active Capacity-Hours and 400 waiting Capacity-Hours. Exact account MTD use is still unknown because the Free consumption API returns 403. Console meter read-back remains mandatory before enabling recurring/automated scheduling or sustained worker dispatch.
2. **Billed storage console read-back:** not a separate development blocker while the project remains on confirmed `free_v3`, with no paid upgrade or paid snapshot. Current Free-plan published ceiling is 1 GB PostgreSQL storage/project (20 GB across the account) and 5 GB Object Storage/project. The project remains bounded below published limits; current Postgres DB reads are about 16 MB and branch logical-size proxies about 40 MB. These are distinct measurement types, not invoice storage. Keep storage headroom monitoring; stop writes and clean up before approaching the free cap. Do not enable paid snapshots.
3. **Private external backup of canonical `holdco`:** moved to the first-real-business-data release gate. It is not required to continue isolated engineering, synthetic tests or public read-only opportunity discovery. It becomes mandatory before the first real buyer contract, accepted delivery record, or settled-revenue/treasury ledger write. The existing public GitHub backup remains synthetic pilot data only and must never receive private canonical ledger contents.
4. **Governor pause/recovery:** remains mandatory before any worker activation. Both directions are now proven on the isolated pilot with the actual queue-claim SQL; final state is PAUSE_DEGRADED and work_allowed=false. Scheduler remains disabled.

### Current Neon Free published allowance (as of 27-Nov-2026)
- Postgres: 100 CU-hours/project/month; 1 GB storage/project; 20 GB account-wide Postgres storage; 10 branches/project; 5 GB public network transfer/project/month.
- Object Storage: 5 GB/project.
- Functions: 1M invocations/project/month; 10 active and 400 waiting Capacity-Hours/project/month.
- Current project plan read-back: `free_v3`. Current provider snapshot: `compute_time_seconds=22622` = 6.2839 CU-hours; `data_transfer_bytes=24068418` ≈ 0.481% of 5 GB. This is project-level Postgres/project telemetry, not Functions MTD usage. Exact Functions active/waiting/invocation meter remains unknown.
- Current pilot `pg_database_size=16097280` bytes. The branch-level logical-size proxy is ~40 MB. Neither number is an invoice-aligned storage meter.
- No auto-trigger, no paid fallback, no paid snapshot, no owner-funded gas, no wallet signing, trading, transfers or payments.

The official plan facts above are from Neon’s 02-Oct-2026 Free-plan update and 17-Sep-2026 Functions GA announcement: https://neon.com/blog/neon-free-plan-1-gb-per-project and https://neon.com/blog/neon-backend-is-ga.

## Release ladder
- **Development / synthetic validation:** may continue with on-demand requests under the paused Governor and synthetic-only fixtures.
- **Bounded on-demand worker pilot:** allowed only after two-state Governor test, explicit on-demand invocation budget, and fresh no-paid-path review. No scheduler.
- **Recurring autonomous worker:** blocked until the Console's Functions MTD meter is observed, capacity/invocation headroom documented, and hard application rate limits are live.
- **First real buyer/financial ledger event:** blocked until private canonical backup + restore evidence, counterparty eligibility, commercial acceptance, and independent receipt verification are complete.

P03.01 remains PARTIAL and the overall P03 exit gate remains NOT PASSED; this is an intentional release-tier separation, not a revenue or production-readiness claim.


## Canonical continuity and decision records
- Goal-first P03 gate review: `docs/P03_GOAL_FIRST_GATE_REVIEW_2026-11-27.md`
- Latest mission continuity checkpoint v34.20: `docs/CONTINUITY_CHECKPOINT_2026-11-27_v34.20.md`
- CI run #47 verified the new SQL-migration regression tests (4 additional tests) plus live endpoint smoke tests: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46009145835

- Canonical resume prompt v2.7.2: `docs/NEXT_CHAT_RESUME_PROMPT_v2.7.2.md`


## Project-level quota telemetry — 27-Nov-2026
Selected Neon project is confirmed on Free v3. Its actual custom project caps are narrower than published plan defaults:
- Active time: 129,600 seconds; current use 94,687 (73.061%).
- Compute: 36,000 CU-seconds = 10 CU-hours; current use 23,950 (6.65278 CU-hours; 66.5278%).
- Public transfer: 1,000,000,000 bytes; current use 24,860,369 (2.486%).
- Written data: 268,435,456 bytes; current use zero.
- Per-branch logical size cap: 536,870,912 bytes.
The published Free 100 CU-hours and 5GB transfer defaults must not override these custom project limits.

Functions active/waiting Capacity-Hours and MTD invocation usage remain UNKNOWN: the Free consumption API returns 403 and the simplified Usage Summary does not display Function usage measures. The scheduler stays disabled. P03.05 will implement app-level daily invocation budgets.

Proposed 80% thresholds (design only, not deployed): active 103,680 sec; compute 28,800 CU-sec; transfer 800,000,000 bytes; writes 214,748,364 bytes. Do not claim enforcement until P03.05 passes.

WBS: P03.01 COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION; next P03.03. P03 remains IN_PROGRESS / exit NOT PASSED. Full evidence: `docs/P03.01_NEON_PROJECT_QUOTA_TELEMETRY_2026-11-27.md`; continuity v34.21; resume prompt v2.7.3.

Latest runtime CI #55 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46012576148. The workflow now path-filters runtime/migration/test files; documentation-only changes do not run live Neon checks.


## Deployment 12 — scoped credential lifecycle and bounded request boundary (27-Nov-2026)
- Function #12, Node.js 24, Singapore; source SHA-256 `15871f3c2114ba0b0c21a3634ca9b267fb7a3802cf71aac41d4d007c596c3c87`.
- Credential schema includes one-way hash, subject, enabled, created_at, scopes, expires_at, revoked_at, rotation_group and last_used_at.
- API scopes: agents:read, demo:run, tasks:write, tasks:read:any, metrics:read, a2a:write. Cron: dispatch:run only.
- Existing credentials expire 27-Dec-2026 09:44:32 UTC. No raw token/hash read, no replacement issued, no rotation performed.
- Fixed-search-path SECURITY DEFINER validators check enabled, scope, expiry and revocation; successful validation records last_used_at. Function role has validator EXECUTE, no direct credential-table SELECT.
- Route mapping is scope-aware; request JSON body is capped at 65,536 bytes; oversized=413, invalid JSON=400; generic 500 does not disclose SQL/DB messages.
- CI #69 live negative smoke: unauthenticated metrics/tasks/A2A/cron all return 401. Positive bearer canary and valid-authenticated route remain unverified; no token-rotation runbook; task reads use privileged tasks:read:any for the single operator only.
- Scheduler disabled; Governor PAUSE_DEGRADED / work_allowed=false. Seven roles remain logical in one deterministic pipeline, not independent LLMs.
- Full security report: [P03.03 auth hardening](../../docs/P03.03_NEON_FUNCTION_AUTH_HARDENING_2026-11-27.md); continuity [v34.22](../../docs/CONTINUITY_CHECKPOINT_2026-11-27_v34.22.md); resume [v2.7.4](../../docs/NEXT_CHAT_RESUME_PROMPT_v2.7.4.md).
