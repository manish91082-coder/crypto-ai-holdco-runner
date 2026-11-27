# Roadmap and Gate Status

Last reviewed: 2026-11-23 (P03.03 v1.5 OCI Free-Tier spend guard and IPv6 egress controls)

## Mission control

- Locked Master Constitution: v2.0.0.
- Locked WBS: v2.0.0, 24 phases / 119 tasks.
- Current active phase: P03 — Cloud runtime and resilience.
- One active WBS phase per work response. See `docs/EXECUTION_CONTROL_PROTOCOL.md`.
- Never mark a phase complete unless every numbered task, phase exit gate, tests, independent review and continuity update pass.

## Task-state read-back

| Scope | Verified status |
|---|---|
| Total task rows | 119 |
| COMPLETE | 15 |
| BLOCKED | 1 |
| PLANNED | 103 |
| P00 | 4/4 COMPLETE |
| P01 | 4 COMPLETE; P01.04 BLOCKED on pilot-specific eligibility |
| P02 | 5/5 COMPLETE |
| P03 | P03.02 and P03.04 COMPLETE; P03.01, P03.03, P03.05 retain partial evidence but are not COMPLETE |
| P04–P23 | PLANNED |

## P03.03 runtime and network decision

Latest report: [P03.03 Secret-Safe Runtime Assurance v1.5](P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.5.md).  
Latest account evidence procedure: [OCI Tenancy Read-Only Evidence Checklist v1.2](P03.03_OCI_TENANCY_READONLY_EVIDENCE_CHECKLIST_v1.2.md).

### Preferred hypotheses

- **Key protection:** OCI Vault HSM-protected RSA + Instance Principals remains the strongest conditional signing candidate. Private key non-exportability and KMS SHA-256 RSA PKCS#1 v1.5 are documented; live signature proof/account eligibility remain open.
- **Network:** OCI public GUA IPv6 + Internet Gateway is the preferred path to test before IPv4 NAT/public IPv4. It could avoid NAT/public IPv4, but is not approved/proven.
- **Neon:** AWS PostgreSQL endpoints support IPv6. Data API is a separate branch-specific HTTPS URL returned by its configuration API; official documentation reviewed does not establish that this hostname has AAAA/IPv6 HTTPS.
- **Security:** Remove IPv6 SSH TCP/22 from `::/0`; deny all inbound management. Restrict egress to the exact Neon Data API IPv6 destination set. Dynamic/unbounded AAAA or unrestrictable egress means NO-GO.
- **Billing:** APAC first 10 TB/month outbound transfer is listed free; overage can be billed. Account-specific GUA/IGW charges and no-overage controls are UNKNOWN. Do not infer zero-cost from missing pricing rows.

### Read-only account evidence required

- Existing tenancy, subscription category and Home Region.
- A1 and HSM quota limit/usage/available.
- Existing VCN IPv6 prefix type: Oracle GUA /56, BYOIPv6, ULA or none.
- Existing subnet public/private state, IPv6 /64 and route `::/0` to IGW.
- Existing Internet/NAT/Service Gateways.
- Existing IPv6 ingress/egress rules, especially SSH from `::/0` and unrestricted egress.
- Exact billing/no-overage treatment for GUA/IGW configuration.

See the updated checklist. No account signup, upgrade, payment, network/VM/key resource or quota increase at this gate.

## Runtime and secret gates

| Gate | Status | Required evidence |
|---|---|---|
| Public repository boundary | COMPLETE | Public repo and file read-back verified |
| Public-safe runner scaffold | COMMITTED; NOT DISPATCHED | Manual-only; no secrets; Actions run history zero |
| GitHub-hosted Actions as runtime | HOLD | Cloudflare supplier-path issue unresolved; no dispatch |
| Neon Functions runtime | CANDIDATE ONLY | Secret assurance, quota headroom, supplier path and deployment review |
| Neon Function env as private-key vault | BLOCKED | Snapshot exists; field-specific assurance insufficient |
| Neon Managed Better Auth OAuth for M2M | REJECTED | No `client_credentials`; signed-in user required |
| Bitwarden Free | NOT SELECTED | Audit/bootstrap limitations |
| Google Secret Manager | NOT SELECTED | Billing account/overage incompatible |
| OCI Vault HSM RSA + Instance Principals | CONDITIONAL | Account/Home Region/free quota/IAM/network eligibility/signature proof |
| OCI GUA IPv6 + IGW to Neon Data API | PREFERRED NETWORK HYPOTHESIS | Exact Data API AAAA/TLS, stable egress allowlist and billing evidence |
| IPv4 NAT/public IPv4 egress | SECONDARY ONLY | No-bill behavior must be proven if IPv6 fails |
| Secret provisioning | BLOCKED | No production key path approved |
| Disposable branch integration QA | NOT AUTHORIZED | Separate bounded authorization, cost evidence and cleanup |
| Production/recurring workloads | PAUSED | All runtime/security/quota/cost gates must pass |

## Live baseline

- Neon canonical main branch: READY.
- Main Functions: 0; Triggers: 0; Data API disabled.
- Global Quota Governor: `PAUSE_DEGRADED` / `work_allowed=false`.
- Production agents, task runs, messages, opportunities, revenue events and scheduler invocations: zero at latest read-only query.
- Existing temporary validation branch expiry remains 2026-11-23 16:00 IST. Do not reuse, extend, delete or repurpose.

## Delivery-time realism

P03 remains open; P04–P23 are not started. No production agents, buyer receipts or multi-day P22 stability evidence. Do not claim production 24x7 or realised revenue without proof.

Unknown cost, security semantics, supplier path, quota or eligibility fails closed.


## Current checkpoint overlay — Continuity v34.6 (23 November 2026)

This overlay supersedes prior P03.03 network/cost hypothesis wording above where it differs.

- Active phase/task remains P03 / P03.03. Task row is PLANNED; nested progress is PARTIAL. Counts remain 15 COMPLETE, 1 BLOCKED, 103 PLANNED of 119.
- OCI Budgets are soft limits; budget alerts are evaluated every 24 hours and are not hard spend stops. Do not count a budget alert as a zero-charge guarantee.
- Only a proven, non-upgraded standard Free Tier / Always-Free-only account with exact Always Free resources and verified quota can be a conditional zero-charge candidate. A Pay-As-You-Go or unknown account state is NO-GO under the current policy. Standard Free Trial paid resources are reclaimed if not upgraded; special trial offers may suspend instead.
- OCI IPv6 Resolver support and IPv6 CIDR security rules make constrained egress technically plausible, but the exact Neon Data API AAAA/TLS and stable allowlist are UNKNOWN.
- Neon Data API is not protected by Neon IP Allow / Private Networking. Use strict worker-side egress, TLS hostname verification, JWT, and narrow PostgreSQL GRANT/RLS; this remains a public HTTPS service.
- Neon Function env variables are deployment snapshots. Field-specific assurance for holding private signing keys remains insufficient; not approved as a private-key vault.
- No OCI account evidence supplied; no resource or branch QA authorized; no provisioning or secret creation.
- Quota Governor remains PAUSE_DEGRADED / work_allowed=false. Main Functions 0, Triggers 0, Data API disabled. Production workloads remain paused.

Next action: obtain redacted, read-only OCI account type/upgrade state, Home Region, A1/HSM quota, existing VCN/IPv6/IGW/security-rule, resolver, and cost/usage evidence using checklist v1.2.

## P03.03 Alternate runtime assessment v1.0 / Continuity v34.7 (23 Nov 2026)

- Trigger.dev Cloud Free is a conditional managed-task candidate for a bounded synthetic-only pilot, **not** a production runtime. Published Free: $0/month, no card, $5 monthly credits, 20 concurrent runs, 10 schedules and one-day logs/query history. Its task code runs on managed workers with no fixed task timeout, but Free has no 99% uptime undertaking and the $5 credit pool excludes external model/API costs.
- Material security caution: vendor-reported 1 Nov 2026 incident affected 0.66% of customer environments and exposed root API keys/environment variables in some environments; account-specific impact remains unknown. No credentials, DB passwords, external API tokens, customer data or private keys in any initial synthetic test.
- Netlify generic compute is not approved for this swarm under its 4 Nov 2026 AUP restriction; Inngest is orchestration over customer-hosted workers; Deno beta has no uptime guarantee; Val Town is winding down; Pipedream Free is development-only; QStash is queue-only.
- OCI account/subscription/quotas/VCN/IPv6/billing evidence is still UNKNOWN. OCI remains the first conditional persistent-VM hypothesis. Trigger.dev account and non-local/non-GitHub deployment path are also UNKNOWN.
- Main Neon remains Functions 0 / Triggers 0 / Data API disabled; Quota Governor PAUSE_DEGRADED / work_allowed=false; production agents and recurring workloads remain paused. No deployment or account was created.
- Active task remains P03.03, WBS PLANNED / nested PARTIAL. Counts remain 15 COMPLETE, 1 BLOCKED, 103 PLANNED of 119.
- Canonical continuity: `docs/CONTINUITY_CHECKPOINT_2026-11-23.md` (v34.7). Assessment: `docs/P03.03_ALTERNATE_CLOUD_RUNTIME_ASSESSMENT_v1.0.md`.
- Next single action: obtain redacted read-only OCI subscription/upgrade status, Home Region, A1/HSM quotas, existing VCN/IPv6/IGW/effective egress/DNS and visible cost evidence using checklist v1.2. Do not provision or cross into P04.


## P03.03 Alternate runtime eligibility v1.1 / Continuity v34.8 (23 Nov 2026)

- OCI account/subscription/quotas/VCN/IPv6/effective egress/billing evidence remains UNKNOWN. OCI Always Free A1 + GUA IPv6/IGW remains the first conditional persistent-runtime hypothesis, not approved.
- Trigger.dev Cloud Free remains a conditional synthetic-only pilot candidate, not a production runtime; $5/month compute credits, 20 concurrent runs, 10 schedules, one-day logs, no Free SLA, recent vendor-reported 1 Nov credential incident, and unknown non-local/non-GitHub deployment path remain blockers.
- Northflank Sandbox has always-on compute and small free resources, but Northflank requires a payment method before creating resources and says Sandbox must not be used for production. Reject.
- Modal Starter has $30/month compute credits and limited scheduled functions. Modal Workspace budget is documented as a hard outer cap, but exact fresh-Starter zero-exposure cap/credit interaction, no-card eligibility, and compliant deployment route are UNKNOWN. Modal model APIs are separately billed; no deployment/account test performed. Conditional research only, not approved.
- Fly.io Free requires a card and transitions to Pay-As-You-Go after its $5 monthly allowance. Reject.
- Hugging Face Spaces free static hosting is distinct from compute-backed Gradio/Docker Spaces, which require paid plans; free hardware sleeps after inactivity. Not a worker runtime.
- No reviewed provider meets all locked production requirements for zero-upfront, no-card, no-paid-overage, hard no-bill boundary, durable worker, adequate observability/security and a verified no-local/no-GitHub operational deployment route.
- Neon main remains Functions 0 / Triggers 0 / Data API disabled. Quota Governor PAUSE_DEGRADED / work_allowed=false. P03.03 row remains PLANNED / nested PARTIAL; counts remain 15 COMPLETE, 1 BLOCKED, 103 PLANNED of 119.
- Assessment: `docs/P03.03_ALTERNATE_CLOUD_RUNTIME_ASSESSMENT_v1.1.md`. Latest continuity: `docs/CONTINUITY_CHECKPOINT_2026-11-23.md` (v34.8).
- Next single action: obtain redacted read-only OCI subscription/upgrade status, Home Region, A1/HSM quotas, existing VCN/IPv6/IGW/effective egress/DNS and visible cost evidence using checklist v1.2. Do not provision, add a payment method or cross into P04.


## 25 November 2026 — current execution overlay

- Active WBS phase remains P03 — Cloud runtime and resilience; P03 is not complete.
- Main database is READY; Functions 0, Triggers 0, Data API disabled; Quota Governor remains PAUSE_DEGRADED / work_allowed=false.
- Production agents, live opportunity scanning, and verified revenue receipts are not active.
- The operational task queue is not the canonical 119-task WBS register. Historical task counts must be identified by checkpoint/version, and the P01 phase-summary/task-count discrepancy must be reconciled before status changes.
- One response must exhaust independently executable work in one active phase. A phase can be marked COMPLETE only when all tasks and its exit gate pass; external dependencies remain blockers and do not justify skipping phases.
- Latest dated checkpoint: `docs/CONTINUITY_CHECKPOINT_2026-11-25.md`. Execution directive: `docs/EXECUTION_MODE_ADDENDUM_2026-11-25.md`.

## 25 November 2026 — P03 provider evidence refresh

- Neon Free published limits have been rechecked against the official plans documentation; database storage and public network transfer observations have fresh read-backs and pass the project safe ceilings.
- Function active/waiting capacity observations remain unknown and monthly invocation evidence remains degraded, so the Quota Governor remains paused.
- OCI Always Free is a conditional candidate only; the account's Home Region, upgrade state, A1 quota, network topology, billing and secret-safe deployment are not verified. Budgets are soft alerts, not hard spend stops.
- P03 remains IN_PROGRESS; do not begin P04. See `docs/P03_OFFICIAL_PROVIDER_EVIDENCE_2026-11-25.md` and `docs/CONTINUITY_CHECKPOINT_2026-11-25_v34.10.md`.

## 25 November 2026 — open WBS/mission-state reconciliation

The locked WBS document metadata still reports P02 as next and P00 as the only completed phase. The live Mission State reports P03 active and P00/P02 complete, while its own P01 projections conflict (phase array NOT_STARTED vs phase-state baseline complete with a pilot gate blocked). This is an OPEN reconciliation item. Do not alter WBS v2.0.0, force P01 complete, or use this discrepancy to skip/reorder phases. Current P03 exit gate still controls the active phase. See `docs/CONTINUITY_CHECKPOINT_2026-11-25_v34.11.md`.

## 25 November 2026 — Google OIDC runtime candidate / v34.12

- Direct Apps Script JDBC to Neon Free is rejected because it requires source IP allowlisting and Neon IP Allow is Scale-tier only.
- Google Apps Script + Google OIDC ID token + Neon Data API HTTPS is a conditional preflight candidate. The proposed `.sub` → NOLOGIN Postgres role mapping is not validated; do not configure on main.
- Private source kit passed 12/12 offline mock tests; these are not live Google/Neon integration tests. No Data API, provider, role, Function or trigger was enabled or created.
- P03 remains IN_PROGRESS; quota governor remains PAUSE_DEGRADED. The role-state reconciliation and WBS/P01 phase-state discrepancy remain open.
- Latest continuity: `docs/CONTINUITY_CHECKPOINT_2026-11-25_v34.12.md`. Candidate review: `docs/P03_GOOGLE_APPS_SCRIPT_OIDC_CANDIDATE_2026-11-25.md`.
- Do not begin P04 until P03 exit gate passes.

## P03 validation overlay — v34.13 (25 November 2026)

P03 remains IN_PROGRESS / NOT PASSED. A bounded isolated-branch authentication investigation produced three negative results:

- Passwordless Postgres through a Function-injected connection string failed with SQLSTATE 28P01 (SCRAM-SHA-256).
- Data API requests without a JWT bearer token failed with HTTP 401 / PGRST302. Anonymous role access is not JWT-free.
- A private Object Storage bootstrap request returned HTTP 403. The diagnostic did not capture the provider error body/code, so the cause remains unclassified. The deployed probe recorded 55 failed application events in the isolated test only. No identity, Auth account, JWT or business-data row was created.

The disposable test environment was cleaned up: Functions 0, Triggers 0, Data API disabled, buckets 0, Auth disabled. Production main was not modified. The failed manual signer is not evidence that Object Storage itself is unavailable; next iteration must use the official AWS SDK pattern or an independently standards-tested SigV4 signer, capture only sanitised error code/request ID, and run once without a recurring trigger.

The conditional Google Apps Script + Google OIDC candidate remains design/preflight-only. The owner-side preflightIdentity() still needs to supply only subject_id and audience. OCI account and network evidence also remains outstanding. Quota Governor continues to fail closed. The holdco_runtime control-plane/catalog discrepancy remains OPEN.

- WBS and Master Constitution remain v2.0.0 LOCKED, 24 phases / 119 tasks.
- P03.02 and P03.04 remain COMPLETE; P03.01, P03.03 and P03.05 remain partial/blocked.
- The P01/WBS/Mission-State sequencing discrepancy remains OPEN.
- No production agents, recurring workloads, source polling, opportunities or realised revenue are claimed.

Canonical continuity: [CONTINUITY_CHECKPOINT_2026-11-25_v34.13.md](CONTINUITY_CHECKPOINT_2026-11-25_v34.13.md). Detailed validation: [P03_NEON_AUTH_OBJECTSTORE_VALIDATION_2026-11-25.md](P03_NEON_AUTH_OBJECTSTORE_VALIDATION_2026-11-25.md).

**P03 exit: NOT PASSED. Do not begin P04.**

## P03 S3 validation overlay — v34.14 (25 November 2026)

The private S3 SigV4 diagnostic has advanced to a root-layout Node.js 24 Function bundle (deployment v5). The local ZIP integrity check passes and its SigV4 implementation matches the AWS published signer test vector. This is not proof of Neon storage access. The deployed Function uses Neon-injected branch-scoped S3 environment variables, and the test branch contains a private smoke bucket plus a short-lived `storage:read` / `storage:write` credential.

The trigger scheduler did not produce a Function invocation and remains disabled. No S3 List/PUT/GET/DELETE application event has occurred, and the bucket is empty. A high-entropy nonce-protected manual GET capability is staged for a single bounded canary; its nonce and credential material are deliberately excluded from public files. TinyFish automation could not start because its wallet balance was negative; no paid top-up is used. Local DNS and the web fetch route could not reach the Function host. Storage authentication remains unproven, not failed.

Main production remains Functions 0 / Triggers 0 / Data API disabled; Quota Governor remains PAUSE_DEGRADED / work_allowed=false. The temporary test resources remain disposable-branch only and must be cleaned up after the canary or credential expiry. Google OIDC preflight and OCI evidence remain outstanding. P01 sequencing discrepancy remains OPEN. Locked Master/WBS v2.0.0 are unchanged.

Canonical continuity: [CONTINUITY_CHECKPOINT_2026-11-25_v34.14.md](CONTINUITY_CHECKPOINT_2026-11-25_v34.14.md). Detailed public-safe validation: [P03_S3_SIGV4_ROOT_BUNDLE_AND_CANARY_GATE_2026-11-25.md](P03_S3_SIGV4_ROOT_BUNDLE_AND_CANARY_GATE_2026-11-25.md).

**P03 exit: NOT PASSED. Do not begin P04.**


## P03.05 quota Governor v0.2.1 overlay — v34.16 (25 November 2026)

A current 25-Nov-2026 Neon Free-plan six-resource quota snapshot has been added as an offline fixture to the v0.2.0 deterministic Governor. The v0.2.1 package has 33/33 tests passing, re-extracted archive tests passing, syntax/manifest/ZIP integrity checks passing, and a secret-pattern scan with no matches. No runtime dependency, network call, database connection, schema migration, deployment or dispatch authority was added.

The exact-six-resource contract remains unchanged. Object Storage inventory and branch count stay in audit context, not in the Governor feed. Fresh database compute, transfer and storage guard measurements do not clear the global pause: Function active/waiting capacity remains UNKNOWN and invocation evidence remains stale/DEGRADED. Global Governor remains PAUSE_DEGRADED / work_allowed=false.

Public-safe continuity: [CONTINUITY_CHECKPOINT_2026-11-25_v34.16.md](CONTINUITY_CHECKPOINT_2026-11-25_v34.16.md). P03.05 report: [P03_QUOTA_GOVERNOR_V0.2.1_OFFLINE_EVIDENCE_REFRESH_2026-11-25.md](P03_QUOTA_GOVERNOR_V0.2.1_OFFLINE_EVIDENCE_REFRESH_2026-11-25.md).

P03.01, P03.03 and P03.05 remain partial/blocked; P03.02 and P03.04 remain complete. The runtime authentication, live freshness/recovery, role reconciliation, Google OIDC and OCI evidence gates remain open. P01 sequencing reconciliation remains open. Locked Master/WBS v2.0.0 unchanged.

**P03 exit: NOT PASSED. Do not begin P04.**

## P03.03 runtime role reconciliation overlay — v34.17 (25 November 2026)

A read-only recheck still shows an unresolved contradiction: provider role API says `no_login`, while PostgreSQL catalog reports `rolcanlogin=true` and a password field. Role permissions remain narrow, but this does not prove a valid login path. No reset, login attempt, grant, role mutation or deployment was performed. The runtime role remains prohibited pending an isolated authentication proof.

Quota Governor v0.2.1 offline evidence remains 33/33 tests passing; no production deployment. Global Governor remains fail-closed. P03.01, P03.03 and P03.05 remain partial/blocked. P03.02 and P03.04 remain complete. Main compute is suspended. Master/WBS v2.0.0 unchanged; phase-sequencing discrepancy open.

Public-safe continuity: [CONTINUITY_CHECKPOINT_2026-11-25_v34.17.md](CONTINUITY_CHECKPOINT_2026-11-25_v34.17.md). Role audit: [P03_RUNTIME_ROLE_RECONCILIATION_2026-11-25.md](P03_RUNTIME_ROLE_RECONCILIATION_2026-11-25.md).

**P03 exit: NOT PASSED. Do not begin P04.**


## P03.03 runtime role alignment overlay — v34.18 (25 November 2026)

The provider role API reports the runtime role as no_login; Neon documentation defines NOLOGIN as non-authenticating. Its PostgreSQL catalog flag unexpectedly showed rolcanlogin=true. A minimal `ALTER ROLE ... NOLOGIN` aligned the catalog, and read-back confirmed rolcanlogin=false. No password reset, grant/revoke, membership/ownership change, login attempt or runtime deployment occurred. The role is now a privilege group, not a login identity. A separate secret-safe login/OIDC/JWT runtime path remains unproven.

Quota Governor v0.2.1 remains offline-only with 33/33 tests passing. Global governor remains PAUSE_DEGRADED / work_allowed=false. P03.01, P03.03, P03.05 remain partial/blocked; P03.02 and P03.04 remain complete. Main compute suspended. Master/WBS v2.0.0 unchanged; phase sequencing discrepancy remains open.

Public continuity: [CONTINUITY_CHECKPOINT_2026-11-25_v34.18.md](CONTINUITY_CHECKPOINT_2026-11-25_v34.18.md). Role audit: [P03_RUNTIME_ROLE_NOLOGIN_ALIGNMENT_2026-11-25.md](P03_RUNTIME_ROLE_NOLOGIN_ALIGNMENT_2026-11-25.md).

**P03 exit: NOT PASSED. Do not begin P04.**


## Current authoritative overlay — 27-Nov-2026 / Continuity v34.20
This section supersedes earlier status statements above wherever they conflict. Historical overlays remain for audit provenance; do not use them as current live status.

### Canonical status
- Mission: `crypto-ai-holdco-master`; current phase P03 Cloud Runtime & Resilience.
- Active WBS task: `CRYPTO-HOLDCO-V2-P03-01`, PLANNED / progress PARTIAL.
- P03.02 and P03.04 COMPLETE. P03.03/P03.05 remain subject to goal-first re-assessment. P03 exit NOT PASSED; P04 not started.
- Master Constitution v2.0.0 and WBS v2.0.0 hashes remain unchanged.
- Mission status: `P03_GOAL_FIRST_GATES_RECLASSIFIED_BOUNDED_ON_DEMAND_ONLY`.
- Continuity v34.20; audit round 43; canonical snapshot sequence 60.

### Goal-first gate interpretation
- Functions exact MTD usage is unknown on Free because the consumption API returns 403. It is not a blocker to engineering/on-demand synthetic tasks while the scheduler stays disabled; it is required before recurring scheduling or sustained autonomous dispatch.
- Exact billed storage Console meter is not a development blocker while the project remains on confirmed Free v3 and within published limits. Logical database/branch size is not invoice storage. Do not buy snapshots or upgrade.
- Private external backup/restore of canonical holdco is mandatory before the first real buyer contract, accepted delivery, settled receipt or treasury/revenue ledger write. It does not block isolated engineering or public read-only discovery.
- Governor pause/recovery remains mandatory before workers activate. On the isolated pilot, PAUSE sees zero queued rows; RUNNING allows the exact dispatcher CTE to claim one synthetic row (attempt_count=1); Governor re-paused; probe deleted; final queued/running counts zero.

### Live runtime
- Neon project `little-violet-66887398`, plan `free_v3`.
- Isolated pilot branch `br-lively-flower-a15zb6ar`; Function `cryptoaicore`, deployment #11, Node.js 24, Singapore.
- Function DB role `crypto_holdco_function`; `/readyz` reports `PAUSE_DEGRADED` and `work_allowed=false`.
- Seven logical specialist roles are in one Function, not seven independent concurrently running models.
- Scheduler trigger is disabled; all five known Postgres endpoints were returned to idle.
- No live trading, signing, transfer, payment or external submission. Realised net revenue=0.

### Latest observed project telemetry
- Provider project snapshot: compute_time_seconds=22,622 = 6.2838889 CU-hours; active_time_seconds=89,443; public transfer=24,068,418 bytes (~0.481% of 5GB).
- Pilot pg_database_size=16,097,280 bytes; branch logical-size proxy=40,124,416 bytes. Neither is invoice-grade storage.
- Exact Functions MTD active/waiting/invocation usage remains UNKNOWN, not zero.
- Published Neon Free values: 100 CU-hours/project/month, 1GB PostgreSQL/project, 10 branches/project, 5GB public transfer/project/month, 5GB Object Storage/project, Functions 1M invocations, 10 active and 400 waiting Capacity-Hours/project/month.
Sources:
https://neon.com/blog/neon-free-plan-1-gb-per-project
https://neon.com/blog/neon-backend-is-ga

### Current evidence / continuity / CI
- Goal-first gate review: `docs/P03_GOAL_FIRST_GATE_REVIEW_2026-11-27.md`
- Continuity checkpoint: `docs/CONTINUITY_CHECKPOINT_2026-11-27_v34.20.md`
- Resume prompt: `docs/NEXT_CHAT_RESUME_PROMPT_v2.7.2.md`
- Function runtime report: `neon-functions/cryptoaicore/README.md`
- Governor migration: `db/migrations/pilot/20261127_fail_closed_governor.sql`
- Reproducible two-state test: `db/tests/pilot/verify_governor_pause_running_recovery.sql`
- Static Governor regression tests: `tests/governor-migration.test.js`
- Latest CI run #51 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46010612368

### Next execution policy
Continue bounded on-demand engineering; do not repeat OCI or Apps Script account audits because neither is selected as a runtime dependency. Keep recurring scheduling behind Functions MTD evidence and first real financial data behind private canonical backup/restore. Keep Governor PAUSE outside controlled tests. Do not change locked Master/WBS or claim revenue.


## Authoritative current overlay — 27-Nov-2026 / Continuity v34.21
This overlay supersedes the older status and quota statements above. Historical notes remain for audit history.

### WBS status
- P03.01 COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION.
- P03.02 and P03.04 COMPLETE.
- P03.03 is the next active WBS task (runtime/auth/region/secrets/deployment evaluation).
- P03.05 remains PLANNED / nested PARTIAL and follows P03.03.
- P03 remains IN_PROGRESS; P03 exit NOT PASSED; P04 not started.
- Counts: 16 COMPLETE, 1 BLOCKED, 102 PLANNED, 0 QUEUED of 119.
- Locked Master/WBS hashes unchanged.

### Neon custom project quota telemetry
Actual custom project settings, project `little-violet-66887398`, plan `free_v3`, period 16-Nov to 01-Dec 2026:
- Active time cap 129,600 sec; current use 94,687 sec (73.061%); remaining 34,913 sec.
- Compute cap 36,000 CU-sec (10 CU-hours); current use 23,950 CU-sec (6.65278 CU-hours; 66.5278%); remaining 12,050 CU-sec.
- Transfer cap 1,000,000,000 bytes; current 24,860,369 bytes (2.486%).
- Written bytes cap 268,435,456; current 0.
- Per-branch logical size cap 536,870,912 bytes.
These actual custom project limits are tighter than Neon Free’s published default 100 CU-hours and 5GB transfer; use the project-specific caps for operations.

### Functions meter limitation
Functions active/waiting Capacity-Hours and MTD invocations are UNKNOWN, not zero. Free-plan consumption API returns HTTP 403 and Neon’s official Plans documentation says the simplified Usage Summary does not display Function metrics. Recurring scheduler stays disabled. P03.05 must implement application-side counters/budgets and fail-closed dispatch.

### P03.05 quota guard requirement, not yet implemented
Proposed internal 80% limits: active 103,680 sec; compute 28,800 CU-sec; transfer 800,000,000 bytes; writes 214,748,364 bytes. Current margin to internal thresholds: 8,993 active seconds and 4,850 compute CU-seconds. These are design targets only, not live enforcement.

### Current runtime and latest CI
Function `cryptoaicore`, deployment #11, Node.js 24, Singapore; Governor PAUSE_DEGRADED/work_allowed=false; scheduler disabled. All five known Postgres endpoints are idle after the last audit. Run #55 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46012576148. Runtime CI path filters skip live Neon smoke on documentation-only commits.
Full quota details: [P03.01 Neon telemetry](P03.01_NEON_PROJECT_QUOTA_TELEMETRY_2026-11-27.md). Continuity: [v34.21](CONTINUITY_CHECKPOINT_2026-11-27_v34.21.md). Resume: [v2.7.3](NEXT_CHAT_RESUME_PROMPT_v2.7.3.md).
