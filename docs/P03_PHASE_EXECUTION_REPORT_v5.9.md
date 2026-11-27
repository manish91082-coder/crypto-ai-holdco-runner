# Crypto AI Holdings — P03 Phase Execution Report v5.9
Observed: 28-Nov-2026
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


## 28-Nov-2026 — Google Apps Script Function-OIDC scheduler candidate
The previously considered Google Apps Script → Neon Data API path is rejected for this mission. Neon Data API selects the PostgreSQL execution role from the JWT `role` claim. A token without that claim falls back to `anonymous`; a valid Google signature alone does not provide the required database role. Mapping Google `sub` to a custom database role would require that role to exist and be granted to `authenticator`, which violates the current no-role/no-membership-mutation constraint. The Data API therefore remains disabled on both canonical main and isolated pilot branches. [Neon custom provider requirements](https://neon.com/docs/data-api/custom-authentication-providers) and [Data API access-control model](https://neon.com/docs/data-api/access-control).

The new candidate avoids the Data API and any new PostgreSQL identity. A thin Google Apps Script time-driven trigger obtains a Google OIDC ID token and sends it to an OIDC-protected route on the existing isolated Neon Function `cryptoaicore`. The Function verifies Google signature, issuer, exact OAuth audience and a SHA-256 hash of the effective user's subject. It uses the already-managed database identity `crypto_holdco_function`. This is a candidate alternative only; the WBS acceptance gate has not yet been independently approved.

## 2. Architecture
**Google Apps Script (owner-created trigger)**  
`ScriptApp.getIdentityToken()` with explicit `openid` scope → HTTPS Authorization Bearer → Neon Function.

**Function route**  
`POST /internal/google/scheduler/dispatch`

**Identity checks**
- Google issuer exactly one of `https://accounts.google.com` or `accounts.google.com`.
- JWT signature RS256 verified against Google's published JWKS endpoint `https://www.googleapis.com/oauth2/v3/certs`.
- Exact OAuth client audience pinned as `GOOGLE_APPS_SCRIPT_CLIENT_ID`.
- Effective-user `sub` SHA-256 pinned as `GOOGLE_APPS_SCRIPT_OWNER_SUB_SHA256`; comparison is constant-time.
- Token time claims must be fresh and unexpired. Failure returns HTTP 401; no claims, bearer, signature, raw subject or token hash are logged.

**Runtime gates**
- Missing audience or subject-hash configuration fails closed.
- `GOOGLE_APPS_SCRIPT_SCHEDULER_ENABLED` must equal `true`; the variable is currently absent/unset.
- Database Governor must independently read `governor_state=RUNNING` and `work_allowed=true`.
- Dispatch bound: `dispatch(1)`, at most one task per tick.
- Existing Neon scheduler trigger remains disabled. This candidate does not enable or alter that trigger.

## 3. Apps Script implementation
Source files:
- `google-apps-script/Code.gs`
- `google-apps-script/appsscript.json`
- `scripts/google_apps_script_oidc_auth.mjs`

Manifest requests only:
- `openid`
- `https://www.googleapis.com/auth/script.external_request`

No `userinfo.email`, profile or Drive scope is requested. `inspectGoogleIdentityBinding()` obtains the effective user's ID token and reports only issuer, OAuth audience, SHA-256(subject), iat and exp. The raw ID token and un-hashed subject are never stored, returned or logged. The server independently verifies the actual JWT signature and configured allowlist; merely decoding the preflight token does not establish trust.

The installable time trigger is set to 30-minute cadence (48 scheduled executions/day). Its installer is a separate function and has not been called. A script lock prevents overlapping ticks and duplicate manual installation. Each execution obtains an ID token just in time, transmits it only in the HTTPS Authorization header, and logs only HTTP/status classification. It distinguishes an authenticated `PAUSED` response from a real `DISPATCH_COMPLETE` acknowledgement.

Google documents that `getIdentityToken()` requires explicit `openid`; installable triggers execute as the account that created them; time-driven triggers can run periodically but their timing may be randomized. The creator account therefore becomes the scheduler's security principal and operational owner. [Identity token API](https://developers.google.com/apps-script/reference/script/script-app#getIdentityToken), [installable trigger behavior](https://developers.google.com/apps-script/guides/triggers/installable).

## 4. Published Google quota envelope
Latest official Google Apps Script quota table retrieved 27-Nov-2026:
- Consumer account: 90 minutes/day trigger-runtime quota; Workspace account: 6 hours/day.
- URL Fetch: 20,000/day consumer; 100,000/day Workspace.
- Script execution maximum: 6 minutes/execution.
- Trigger count: 20 per user per script.
- Quotas are per user, reset 24 hours after the first request, and may change without notice. [Official quota table](https://developers.google.com/apps-script/guides/services/quotas).

Planning calculation, not measured performance:
- 30-minute cadence = 48 executions/day.
- At a 20-second target runtime per execution, total trigger runtime = 16 minutes/day (48 × 20 seconds).
- Consumer baseline remaining headroom would be 74 minutes/day before accounting for other scripts sharing that Google user's quota.
- Consumer baseline hard average ceiling at 48 runs/day is 112.5 seconds/run (5,400 seconds ÷ 48). Design target remains 20 seconds/run, not the ceiling.
- One outbound Function fetch per tick = 48 URL Fetch calls/day, well below the published 20,000/day consumer quota.
- These figures do not prove the owner's account type, remaining quota, available runtime or 24×7 service assurance.

## 5. Current source and CI evidence
- GitHub repo: `manish91082-coder/crypto-ai-holdco-runner`, branch `temporary-zero-cost-runtime-pilot`.
- CI #131: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46053348674, SUCCESS, 58/58 tests, 0 failures.
- Deterministic patched Function source SHA-256: `367ea0205d797aa8a22d78a5b5a6f1e6638460aaf76ef98a20b04f1f78604921`.
- This CI proves source syntax, deterministic bundle generation and offline/unit/security regression only. The live Neon smoke test was skipped. It is not a live Google identity test, deployed Function or trigger run.
- Current active Neon Function remains deployment #17 with source SHA-256 `d294ce82068e6d95dfe8f9f4460d079263c3641d34dc7bd50744ebb366c07a44`, environment key `DATABASE_URL` only.
- No Google Apps Script project has been created/connected; no actual audience or owner subject hash has been observed or configured.
- No Neon Function deployment #18, Google trigger installation, Data API activation, role creation, password, grant, membership, secret or environment-variable change was made.

## 6. Required pre-deployment gates
1. Confirm an owner-controlled Google account is available and permitted to own the script; establish its account type and project-access restrictions.
2. Run the identity-binding preflight inside that owner-created Apps Script project. Review issuer and audience; transmit only the SHA-256 subject binding through a protected setup path. Do not paste the raw token or subject into chat, GitHub, SQL or logs.
3. Verify Google JWKS signature and a positive HTTP request from the real owner-run script against an isolated Function deployment. Verify negative tests for wrong issuer, audience, subject, expired token and invalid signature.
4. Add a replay/rate/idempotency guard for scheduler requests and persist per-day invocation accounting. The present candidate route is not yet certified against repeated valid-token replay.
5. Complete P03.05's persistent daily budget, actual quota accounting, proposed 80% fail-closed stops, source freshness and durable checkpoint/recovery before any scheduler enablement.
6. Complete owner-operator API token consumer census/protected delivery/actual-token HTTP proof and the exact P03.03 WBS exit criteria.
7. Verify current project free-plan headroom and account-specific Google quota; do not assume a public quota table is proof of this account's remaining allowance.
8. Only after all gates: deploy with the two identity allowlist variables, run negative/positive isolated tests, keep the scheduler feature flag off until separately authorized and Governor RUNNING. Installation of the 30-minute Apps Script trigger remains a distinct final approval action.

## Current quota stop
- Neon active time 113,587/129,600 sec = 87.64% (16,013 sec left); compute 28,717/36,000 sec = 79.77% (7,283 sec left); transfer 31,038,118/1,000,000,000 bytes = 3.10%. Period ends 2026-12-01T00:00Z.
- Do not deploy Function #18 or install/arm a scheduler during this quota window. Current Governor remains PAUSE_DEGRADED/work_allowed=false.
- CI #131 https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46053348674: 58/58 tests; deterministic Function build SHA `367ea0205d797aa8a22d78a5b5a6f1e6638460aaf76ef98a20b04f1f78604921`; live smoke skipped. Candidate remains source-only. Active deployment #17 unchanged.

## Exact phase disposition
P03.03 remains ACTIVE/PARTIAL; P03.05 PLANNED/NOT ACTIVE. P03 exit NOT PASSED; P04 NOT STARTED. WBS counts 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED. Locked Master/WBS unchanged. No financial activity and net revenue 0.
