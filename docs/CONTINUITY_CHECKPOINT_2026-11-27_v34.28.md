# Crypto AI Holdings — Canonical Continuity v34.28
Observed: 27-Nov-2026
Mission key: crypto-ai-holdco-master

## Locked authority
- Mission Continuity & No-Drift Lock v1.4.
- Master Constitution v2.0.0 SHA-256 ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803.
- WBS v2.0.0 SHA-256 7e8fa46de0d1348dd3b3da6f266f9afffad9116d1d814a2bf5f653c74f39a2e2.
- Both locked and unchanged. 24 phases, 119 WBS tasks. One response = one active phase.
- WBS counts remain 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED.
- Existing continuity snapshot v34.24 / sequence 64. Do not create new snapshot before historical P01/WBS/Mission-State projection discrepancy is reconciled.

## Canonical resource identity
- Neon project little-violet-66887398.
- Main branch br-calm-block-a1fbdnnj, DB/schema crypto_holdco/holdco.
- Isolated pilot branch br-lively-flower-a15zb6ar.
- GitHub manish91082-coder/crypto-ai-holdco-runner / temporary-zero-cost-runtime-pilot is source and evidence trail, not operational runtime.
- Railway Crypto Holdco Pilot has one pilot environment, zero services, zero shared variables.

## Exact WBS
- Active phase P03_CLOUD_RUNTIME_AND_RESILIENCE.
- Active task CRYPTO-HOLDCO-V2-P03-03; canonical task row status remains PLANNED with nested partial execution evidence. Do not mark complete.
- P03.01 complete with known Neon Free Functions telemetry limitation; P03.02/P03.04 complete.
- P03.03 partial/active. P03.05 planned/not active. P03 exit NOT PASSED; P04 NOT STARTED.

## Function deployment #17
- Function cryptoaicore, isolated pilot, Node.js24, Singapore. Source SHA-256 d294ce82068e6d95dfe8f9f4460d079263c3641d34dc7bd50744ebb366c07a44.
- DB identity crypto_holdco_function; Governor PAUSE_DEGRADED / work_allowed=false.
- Trigger id trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71, POST /internal/dispatch, disabled, next_run_at null.
- Seven runtime task rows synthetic and owner-bound; 0 ownerless, queued, running.
- CI #121 https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46046289848: SUCCESS, 44/44 tests, 17 signed OIDC claims. Synthetic app canary metrics:read HTTP 200, wrong scope 401, finally revoked and metadata disabled/revoked. One historic row, zero active.
- Synthetic canary is not the owner-operator-pilot credential.

## Owner API token / rotation
- owner-operator-pilot remains enabled, six scopes, expires 2026-12-27T09:44:32.105Z, last_used_at 2026-11-27T14:55:00.737Z, revoked_at null.
- Raw token/hash never read. Owner token HTTP proof not done. No token creation/rotation/reissue/revocation.
- Full external/manual consumer census and protected one-time delivery remain open. Rotation remains NO-GO.
- Runbook v1.1 exists; see GitHub document path.

## Newly reconciled holdco_runtime role blocker
- Fresh read-only pg_authid on both main and pilot branches reports holdco_runtime rolcanlogin=false, password absent, and all privilege flags (superuser/createdb/createrole/replication/bypassrls) false.
- No active sessions on either branch.
- Membership graph on both: crypto_holdco_owner member of holdco_runtime (admin=true, inherit=false, set=false); holdco_runtime member of holdco_worker (admin=false, inherit=true, set=true).
- This 27-Nov read-back supersedes the contradictory current-state values in the historic 25-Nov role-reconciliation note; preserve that note as historical and use the newer v2.0 reconciliation/research.
- SDK source: roles.reset password API refuses when role has no password. For NEW scoped roles, SDK uses literal SQL bootstrap password, warns statement logging may record it, then provider reset, then enables LOGIN. It is not an existing-role initializer. Default/admin roles join neon_superuser; prohibited.
- Provider issues #12984 and #12986 remain OPEN in latest retrieval; no maintainer-confirmed safe first-password route seen. Project's earlier reset returned HTTP 422 and was not retried.
- Do not set password, LOGIN, recreate/replace role, change membership/privileges or insert plaintext secret. Current role remains untouched and fail-closed.
- Research report: docs/P03.03_ROLE_PASSWORD_BOOTSTRAP_RESEARCH_v1.2.md; reconciliation report: docs/P03_RUNTIME_ROLE_RECONCILIATION_v2.0.md.

## Quotas and controls
- Governor PAUSE_DEGRADED / work_allowed=false; trigger disabled.
- Neon Free Functions MTD invocations and active/waiting Capacity-Hours UNKNOWN, not zero; observed 111 is degraded log lower-bound. Billed storage UNKNOWN.
- P03.05 daily budgets, true custom-quota counters, 80% fail-closed stops, freshness controls, checkpoint/recovery not implemented.
- No paid fallback, upgrade, Cloudflare, local runtime, owner-funded gas, wallet signing, transfer, trading, payment, external submission.
- Realised net revenue 0.

## Remaining P03.03
1. Prove actual owner token HTTP path securely without disclosure.
2. Complete manual/external consumer census and protected one-time delivery, then only issue replacement, overlap, cut over and revoke before expiry.
3. Obtain provider-supported safe initialization/reconciliation for existing holdco_runtime without plaintext SQL or role recreation, or pass exact locked alternate runtime acceptance route.
4. Provider-positive scheduled trigger delivery untested; keep trigger disabled and Governor paused.
5. Finish terms/runtime evidence, resolve P01/WBS/Mission-State projection discrepancy before new snapshot.

P03.03 ACTIVE/PARTIAL. P03.05 NOT ACTIVE. P03 exit NOT PASSED. No revenue/completion claim.
