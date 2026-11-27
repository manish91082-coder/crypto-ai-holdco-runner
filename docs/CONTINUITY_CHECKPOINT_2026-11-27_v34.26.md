# Crypto AI Holdings — Canonical Continuity v34.26
Observed: 27-Nov-2026 17:40 UTC
Mission key: crypto-ai-holdco-master

## Locked authority
- Mission Continuity & No-Drift Lock v1.4.
- Master Constitution v2.0.0 SHA-256: ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803.
- WBS v2.0.0 SHA-256: 7e8fa46de0d1348dd3b3da6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2.
- Both immutable and unchanged. One response = one active WBS phase; no skips, false completion or P04 entry.
- Latest counts remain 16 COMPLETE / 1 BLOCKED / 102 PLANNED / 0 QUEUED (119 total).
- Existing continuity snapshot remains v34.24 / sequence 64. No new snapshot due unresolved P01/WBS/Mission-State projection discrepancy.

## Canonical resources
- Neon project little-violet-66887398, DB/schema crypto_holdco/holdco.
- Main branch br-calm-block-a1fbdnnj.
- Isolated runtime pilot branch br-lively-flower-a15zb6ar.
- GitHub source/audit repo manish91082-coder/crypto-ai-holdco-runner, branch temporary-zero-cost-runtime-pilot; GitHub is not the production runtime.
- Connected Railway project Crypto Holdco Pilot: one pilot environment, zero services, zero shared variables. No Railway deployment is an active consumer.

## Current WBS
- Phase P03_CLOUD_RUNTIME_AND_RESILIENCE active.
- Active task CRYPTO-HOLDCO-V2-P03-03; Neon WBS row still PLANNED with nested partial execution evidence. Do not change task status to COMPLETE.
- P03.01 COMPLETE_WITH_KNOWN_PROVIDER_FUNCTION_METER_LIMITATION.
- P03.02 and P03.04 COMPLETE.
- P03.03 ACTIVE / PARTIAL.
- P03.05 PLANNED / NOT ACTIVE.
- P03 exit NOT PASSED; P04 NOT STARTED.
- Counts remain 16/1/102/0.

## Current runtime deployment #16
- Function cryptoaicore, deployment #16, Node.js 24, Singapore aws-ap-southeast-1.
- Source SHA-256: 76e31c353eacb59f1ffb5d7697d467da66b84ab93dd0de4db5b86e68b386201c.
- DB identity crypto_holdco_function; readiness shows Governor PAUSE_DEGRADED, work_allowed=false.
- Trigger ID trigger-3b855bc5-fb48-4547-a84d-b374e56ebb71, path /internal/dispatch, disabled, next_run_at=null. No provider-origin trigger delivery was executed.
- Legacy neon-scheduled-dispatcher credential is disabled/revoked; no raw token/hash was read.
- Pilot runtime tasks: 7/7 synthetic and owner-bound; 0 ownerless, queued or running. API scope tasks:read:own, not tasks:read:any. Single-owner synthetic pilot only.

## GitHub OIDC metrics-only workload identity
- Function has an OIDC verifier for GitHub Actions issuer https://token.actions.githubusercontent.com, fixed JWKS URL, RS256 signature, short claim lifetime, exact audience, immutable repository/owner IDs, exact workflow/ref, push event, actor and hosted runner.
- OIDC is authorized only when required scope equals metrics:read.
- Live CI #109 SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46043581519. 40/40 tests; 15 exact claim checks pass; authenticated GET /v1/metrics returns HTTP 200.
- Five privilege-escalation probes return HTTP 401: agents read, demo run, task write, owner-task read, and A2A write.
- Unauthenticated metrics/task/A2A requests and forged public Neon trigger request also return HTTP 401.
- CI #110 follow-up policy suite SUCCESS: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/46043585428.
- These are logical specialist roles in one Function, not seven independent LLM agents.
- This OIDC token is a short-lived CI workload bearer, not the persistent application API token. It does not grant task mutation, A2A, financial or scheduler access. CI does not need a long-lived application bearer.

## Application operator token inventory and rotation decision
- Pilot runtime.api_tokens: subject owner-operator-pilot; enabled=true; scopes agents:read, demo:run, tasks:write, metrics:read, a2a:write, tasks:read:own; expires 2026-12-27T09:44:32.105Z; last_used_at 2026-11-27T14:55:00.737Z; not revoked.
- Raw token and stored hash were never read or surfaced.
- The last-used timestamp is not proof of no external/manual consumer.
- Legacy runtime.cron_tokens subject neon-scheduled-dispatcher is disabled/revoked.
- Neon provider credentials for AI Gateway and Object Storage are distinct types/scopes; not app bearer replacements.
- Repo src/config.js reads a separate APP_API_TOKEN; Railway environment has no service or variables, so this is dormant scaffold configuration, not a verified live token consumer.
- Rotation decision: **NOT PERFORMED**. The real app-token consumer set is not proven complete and protected one-time delivery is unavailable. Do not rotate the only working token until consumer mapping, protected delivery, overlap, positive/negative validation and cutover are evidenced.
- Runbook: docs/P03.03_OPERATOR_CREDENTIAL_ROTATION_AND_CONSUMER_INVENTORY_v1.0.md.
- No API token created, rotated, reissued or revoked in this execution.

## Quotas and economics
- Canonical/pilot Governor remains PAUSE_DEGRADED / work_allowed=false.
- Neon Functions MTD invocation and active/waiting Capacity-Hours remain UNKNOWN on Free; observed 111 invocations is a lower-bound log observation, not an invoice meter.
- Billed storage UNKNOWN; logical size is not invoice-grade.
- Custom project quota caps remain: active time 129,600 sec, compute 36,000 CU-sec, transfer 1,000,000,000 bytes, written data 268,435,456 bytes, branch logical-size cap 536,870,912 bytes.
- P03.05 persistent daily budgets, actual custom-quota accounting, 80% fail-closed stops, freshness gates and durable checkpoint recovery are not deployed.
- No scheduler, no paid fallback, no upgrade, no Cloudflare, no local runtime, no owner-funded gas, no live trading, no wallet signing, no transfer, payment or external submission.
- Realised net revenue remains 0.

## Remaining P03.03 gates
1. Positive HTTP canary for normal owner-operator-pilot app bearer via a secure non-disclosing path. OIDC metrics-only HTTP canary is a separate workload identity and does not exercise the DB app-token validator.
2. Complete full consumer census and protected one-time delivery before controlled app-token issue/rotate/reissue; expiry is 27-Dec-2026.
3. Provider-positive Neon scheduled-trigger delivery evidence remains untested; keep trigger disabled unless an exact WBS-compliant one-shot mechanism exists and Governor protections remain verified.
4. Complete remaining deployment/environment/terms evidence and reconcile historical P01/WBS/Mission-State projection before a new continuity snapshot.

No phase completion is claimed. P03 remains active and its exit gate remains NOT PASSED.
