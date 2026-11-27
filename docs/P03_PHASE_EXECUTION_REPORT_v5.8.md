# Crypto AI Holdings — P03 Phase Execution Report v5.8
Observed: 27-Nov-2026
Mission: crypto-ai-holdco-master
Phase: P03_CLOUD_RUNTIME_AND_RESILIENCE
Active task: CRYPTO-HOLDCO-V2-P03-03

## Executive decision
P03.03 remains ACTIVE / PARTIAL. CI #121 completed positive and negative HTTP proof through the standard SHA-256-backed application-token validator using a short-lived synthetic metrics:read credential, followed by confirmed revocation. The real owner-operator-pilot token remains untested over HTTP and has not been rotated. The current PostgreSQL role holdco_runtime is freshly read back as NOLOGIN with no password on both main and pilot branches. Neon SDK source indicates the API reset path refuses passwordless roles; the new-role SDK workflow uses a bootstrap password literal and may expose it to statement logging. No policy-compliant first-password bootstrap for the existing role has been established.

## Current deployment / pilot
- Neon Function cryptoaicore deployment #17, Node.js24, Singapore, isolated branch br-lively-flower-a15zb6ar.
- Source SHA-256 d294ce82068e6d95dfe8f9f4460d079263c3641d34dc7bd50744ebb366c07a44.
- Function DB identity crypto_holdco_function. Governor PAUSE_DEGRADED / work_allowed=false.
- Scheduled trigger id trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71, route POST /internal/dispatch, disabled, next_run_at=null.
- No real scheduled delivery or worker dispatch.

## CI #121 synthetic app-token proof
- https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46046289848, run 46046289848, attempt 1, SUCCESS.
- 44/44 tests; 17 signed GitHub OIDC claim checks.
- OIDC token metrics-only; GET /v1/metrics 200, protected-scope escalation 401.
- Distinct synthetic application token metrics:read only, 180-second expiry, run-bound subject ci-auth-canary:46046289848:1.
- Standard runtime.validate_api_token GET /v1/metrics = 200; wrong-scope GET /v1/agents = 401; finally revoke count 1.
- Provider metadata confirms enabled=false, revoked_at and last_used_at populated. One historical canary row, zero active canary rows. Raw token/hash not logged or selected.
- This is synthetic validator proof, not the owner-operator-pilot token.

## Owner API token
- owner-operator-pilot enabled with scopes agents:read, demo:run, tasks:write, metrics:read, a2a:write, tasks:read:own.
- Expires 2026-12-27T09:44:32.105Z, last_used_at 2026-11-27T14:55:00.737Z, revoked_at null.
- Raw token/hash not read. No owner token created, rotated, reissued, or revoked.
- Consumer set not fully mapped and protected one-time delivery not established. Rotation remains NO-GO.

## New role bootstrap audit
- holdco_runtime exists on main and pilot branches, but fresh 27-Nov pg_authid read-back on both shows rolcanlogin=false, password absent, and all admin flags false.
- Memberships: crypto_holdco_owner is member of holdco_runtime (admin_option true, inherit false, set false); holdco_runtime is member of holdco_worker (admin false, inherit true, set true).
- Zero active holdco_runtime sessions on both branches.
- This supersedes the contradictory 25-Nov role reconciliation observation as the current state; historical v1.0 record is retained.
- Neon SDK source says password reset API refuses roles without a password. New scoped SDK path creates a new role with a plaintext bootstrap password literal, then resets password, then enables LOGIN; source warns statement logging may record the bootstrap password.
- Neon issues #12984 and #12986 are still OPEN; no maintainer-confirmed safe initializer appeared in retrieved comments.
- No role/password/ACL/membership mutation was made. No plaintext credential workaround is admissible.

## Safe disposition
Keep holdco_runtime unchanged and NOLOGIN. Continue only bounded synthetic pilot work via crypto_holdco_function. No replacement role, no owner role rotation until consumer census/protected delivery, no trigger execution, no worker activation.

## Operational limits and economic status
- Seven pilot task rows synthetic/owner-bound; 0 queued, 0 running, 0 ownerless.
- Neon Functions Free MTD invocations and active/waiting Capacity-Hours UNKNOWN; observed 111 is a degraded log lower-bound, not invoice-grade MTD. Billed storage UNKNOWN.
- No buyer contract, accepted delivery, payment, wallet signing, transfer, trading, external submission or revenue event. Realised net revenue 0.

## Remaining P03.03 gates
1. Owner-operator-pilot actual token positive HTTP proof via protected non-disclosing path.
2. Complete external/manual consumer census and protected one-time delivery, then controlled replacement overlap/cutover/revoke before 27-Dec-2026 expiry.
3. Provider-positive Neon scheduled-trigger delivery is untested; keep trigger disabled.
4. Provider-supported safe bootstrap/reconciliation for existing holdco_runtime or an independently accepted alternate WBS runtime path. No SQL plaintext password, role recreation or privilege elevation.
5. Remaining runtime/terms assurance and historical P01/WBS/Mission-State projection reconciliation.

P03.01 COMPLETE with known Functions-meter limitation; P03.02/P03.04 COMPLETE; P03.03 ACTIVE/PARTIAL; P03.05 PLANNED/NOT ACTIVE. P03 exit NOT PASSED; P04 NOT STARTED. Counts remain 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED. Locked Master/WBS unchanged.
