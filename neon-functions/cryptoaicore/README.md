# Neon Function: Crypto AI Holdings Pilot Runtime

## Current deployment
- Neon project: `little-violet-66887398`
- Isolated pilot branch: `br-lively-flower-a15zb6ar`
- Database: `crypto_holdco`
- Function slug: `cryptoaicore`
- Active deployment: `10`
- Deployed source SHA-256: `1fda8626e5ddb092586b9bf0beca1643ebda4a17cdd79559c3ca16791eb2642c`
- Runtime: Node.js 24
- Region: `aws-ap-southeast-1` (Singapore)
- Invocation URL: `https://br-lively-flower-a15zb6ar-cryptoaicore.compute.c-1.ap-southeast-1.aws.neon.tech/`
- Function DB identity: Neon-managed `crypto_holdco_function`
- Scheduler trigger: present but **disabled**. Do not restart it automatically.
- Public GitHub CI: [run 45996257276](https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/45996257276)

## Source and reproducibility
- Base archive: `neon-functions/cryptoaicore/function.zip.b64`
- Base archive source hash: `neon-functions/cryptoaicore/index.mjs.sha256`
- Deterministic build patch: `scripts/patch_neon_function_bundle.py`
- CI verifies the base archive, patches it, checks the resulting JavaScript syntax, runs five unit/safety tests, then invokes the live endpoint.
- Deployment 10 uses the corrected JSONB/UTF-8 task-payload decoder and returns the active database role on `/readyz`.

## Routes
- `GET /`: service identity and version
- `GET /readyz`: live database readiness, database name, active DB role, and six critical runtime-table checks
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
- Read-only access to pilot API/cron token hash tables

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
