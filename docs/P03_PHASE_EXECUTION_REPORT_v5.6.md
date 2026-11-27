# Crypto AI Holdings — P03 Phase Execution Report v5.6
Observed: 27-Nov-2026 17:40 UTC
Mission: crypto-ai-holdco-master
Phase: P03_CLOUD_RUNTIME_AND_RESILIENCE
Active WBS task: CRYPTO-HOLDCO-V2-P03-03

## Executive decision
P03.03 remains ACTIVE / PARTIAL. Deployment #16 and CI #109 prove a bounded GitHub OIDC workload identity can read pilot metrics and cannot escalate to any other protected API scope. This closes an authenticated HTTP proof for the CI workload identity only. It does not prove the separate owner-operator-pilot application token over HTTP, and it does not complete application-token rotation/reissue or real provider-trigger delivery.

## Deployment #16
- Neon Function cryptoaicore, isolated pilot branch br-lively-flower-a15zb6ar, Node.js 24, Singapore.
- Source SHA-256: 76e31c353eacb59f1ffb5d7697d467da66b84ab93dd0de4db5b86e68b386201c.
- DB role crypto_holdco_function; readiness reports database connected; Governor PAUSE_DEGRADED / work_allowed=false.
- Trigger POST /internal/dispatch, ID trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71, disabled, next_run_at=null.
- Legacy path-secret cron credential disabled/revoked; raw token/hash never read.

## GitHub OIDC — positive and negative live HTTP evidence
- CI #109 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46043581519. 40/40 tests; source-integrity and deterministic Function build passed.
- OIDC claim checks: issuer, audience, immutable subject, repository, repository ID, owner/owner ID, workflow name/ref, push event/ref, actor ID, hosted runner, repository visibility, validity window, jti and commit SHA. 15/15 passed.
- Authenticated GET /v1/metrics with OIDC Bearer returned HTTP 200 and expected response schema.
- The OIDC identity is accepted only for metrics:read. The same token returned HTTP 401 for GET /v1/agents, POST /v1/demo, POST /v1/tasks, GET /v1/tasks/:id and POST /a2a/v1/messages.
- Unauthenticated metrics, task submission and A2A POST returned HTTP 401. Forged public trigger POST returned HTTP 401.
- CI #110 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46043585428; follow-up static workflow/security policy suite passed.
- Function logs record token-free success/deny reason only. No JWT, raw claim set, signature or key material is logged.
- The identity is specific to one public GitHub repository, one workflow/ref and one actor. Branch protection is currently disabled in provider read-back; keep this as a pilot-only trust boundary, not a production operator identity.

## Application API token inventory and rotation decision
- runtime.api_tokens subject owner-operator-pilot: enabled=true; scopes agents:read, demo:run, tasks:write, metrics:read, a2a:write, tasks:read:own; expires 2026-12-27T09:44:32.105Z; last_used_at 2026-11-27T14:55:00.737Z; not revoked.
- Raw API token and token hash were never selected. The OIDC HTTP canary is not a request through the stored application token validator.
- Legacy cron token is disabled/revoked; Neon provider AI Gateway and Object Storage scoped credentials are separate credential types.
- Railway project Crypto Holdco Pilot: one pilot environment, zero services, zero shared variables. Repo APP_API_TOKEN in src/config.js is a separate dormant Node scaffold config; not a live deployed consumer.
- Rotation deferred: external/manual consumers of the owner API token are not fully mapped and a protected one-time secret-delivery channel is not verified. Issuing or revoking without cutover could break a hidden consumer.
- Procedure: docs/P03.03_OPERATOR_CREDENTIAL_ROTATION_AND_CONSUMER_INVENTORY_v1.0.md. No new app token issued; no rotation/reissue/revocation performed.

## Pilot data, scheduler and economics
- 7/7 runtime task rows synthetic and bound to owner-operator-pilot; 0 ownerless, queued or running.
- Governor PAUSE_DEGRADED / work_allowed=false; trigger disabled. No real scheduled delivery or task dispatch.
- Neon Functions exact MTD invocation/active/waiting meters remain UNKNOWN on Free; observed 111 invocations is only a log lower bound. Billed storage UNKNOWN.
- No buyer contract, accepted delivery, payment, wallet signing, token transfer, live trading or revenue event. Realised net revenue 0.

## Remaining P03.03 gates
1. Positive HTTP request through the normal hash-backed owner-operator-pilot credential path, without exposing the raw token.
2. Complete external/manual consumer inventory and protected one-time delivery; issue a least-privilege replacement, validate positive/negative scopes and last_used, cut over consumers, revoke old token, read back metadata.
3. Provider-positive Neon scheduled-trigger delivery remains untested; keep trigger disabled and do not activate recurring scheduling to produce evidence.
4. Finish remaining deployment/terms assurance and reconcile historical P01/WBS/Mission-State projection before new continuity snapshot.

## WBS status
- P03.01 COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION.
- P03.02 and P03.04 COMPLETE.
- P03.03 ACTIVE / PARTIAL.
- P03.05 PLANNED / NOT ACTIVE; daily budgets, actual custom-quota accounting, 80% stops, freshness gates and durable recovery are not deployed.
- P03 exit NOT PASSED; P04 NOT STARTED.
- Counts remain 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED (119 total).
- Master Constitution v2.0.0 and WBS v2.0.0 remain unchanged.
