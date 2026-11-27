# Neon Function: Crypto AI Holdings Pilot Runtime

## Deployment identity
- Neon project: `little-violet-66887398`
- Isolated branch: `br-lively-flower-a15zb6ar`
- Database: `crypto_holdco`
- Function slug: `cryptoaicore`
- Active deployment: `8`
- Runtime: Node.js 24
- Region: `aws-ap-southeast-1` (Singapore)
- Invocation URL: `https://br-lively-flower-a15zb6ar-cryptoaicore.compute.c-1.ap-southeast-1.aws.neon.tech/`

## Reproducible source and deployed bundle
- `function.zip.b64` is the original baseline archive used for deployment 5.
- `scripts/patch_neon_function_bundle.py` deterministically applies the JSONB/UTF-8 payload-normalization patch to that baseline.
- `function-deployment-8.zip.b64` is the exact ZIP uploaded for active deployment 8.
- `index.mjs-deployment-8.sha256` records the exact deployed entrypoint SHA-256:
  `7b6244dae8164e5b9776503ff4cebb37a4cbb3a6c56d91ab8c280f22bcc1ea4b`.
- The patch handles PostgreSQL JSONB task payloads returned as objects, strings, or UTF-8 byte arrays; the claim query explicitly casts `payload::text`.
- All archives/source files contain no operator API token or cron path secret. Never add secrets to this repository.

## Routes
- `GET /`: service identity and version
- `GET /readyz`: live database readiness and runtime-table check
- `GET /.well-known/agent.json`: seven specialist role card
- `GET|POST /internal/dispatch/<64-hex-secret>`: private scheduled task dispatcher; the route secret is stored only in Neon trigger configuration and its SHA-256 digest in `runtime.cron_tokens`
- `POST /v1/demo`: authenticated synthetic E2E
- `POST /v1/tasks`: authenticated opportunity qualification task
- `GET /v1/tasks/:id`: authenticated task result
- `GET /v1/metrics`: authenticated pilot metrics
- `POST /a2a/v1/messages`: authenticated A2A message endpoint

## Current acceptance results
- GitHub Actions bundle build, source hash, syntax, domain/safety and live Neon smoke checks passed: [run 45991263144](https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/45991263144).
- Positive-control task `0d43c3d9-5c8f-42e0-85f2-b9d6cb9fd3b1`: 8/8 synthetic fixture eligibility checks, `QUALIFIED_FOR_HUMAN_REVIEW`, `QA_PASS`, `PACKAGED_FOR_HUMAN_REVIEW`, seven persisted agent messages and eight audit events.
- Negative-control task `4e3f4c18-6c1a-4e32-9850-2f14cc8e4e16`: actual candidate title/source correctly read from JSONB, only 1/8 hard checks passed, `BLOCKED_OR_UNVERIFIED`, `QA_BLOCK`, `BLOCKED_BY_QA`, seven persisted agent messages and eight audit events.
- Both fixtures are explicitly synthetic, not buyers or funded opportunities. Both revenue dispositions are `NO_REVENUE_CLAIM`; realised net revenue is zero.
- Previous task `d9fd8eef-f83d-496a-bda8-c2bde12fbcf6` documents the pre-fix JSONB mapping defect. It is retained as immutable audit evidence; do not interpret its missing title/source as current behavior.

## Safety and operational boundaries
- Pilot branch only. Canonical main branch, Master Constitution v2.0.0, WBS v2.0.0 and P01/P02 task statuses were not changed.
- Scheduled trigger is enabled at five-minute cadence and dispatches at most three queued tasks per invocation.
- The runtime can accept and process supplied qualification tasks. It does not yet run a verified live public opportunity-source scanner, independently confirm sponsor funding, or autonomously submit work to buyers.
- Live submissions, wallet signing, trading, transfers and payments are disabled.
- The function currently uses Neon-injected `DATABASE_URL`. Least-privilege runtime-role adoption, crash-safe lease/retry/idempotency, external backup/restore, and a proven function-capacity governor remain open P03 controls.
- Function API authentication checks SHA-256 token hashes stored in Neon. Cron authentication checks a private path secret against a Neon-stored hash. Do not disclose the trigger path.
- No external buyer, payment, accepted paid delivery or commercial revenue is evidenced.

## Free-plan quota observations
- Neon org reports `free_v3`.
- Project-level hard caps read back: 36 active hours, 10 CU-hours, 1 GB proxy egress, 512 MB branch logical size, 256 MB writes per billing period.
- Defaults are fixed 0.25 CU min/max with zero-second suspend timeout.
- Latest read-back: 80,499 / 129,600 active seconds; 20,380 / 36,000 compute seconds; 22,581,586 / 1,000,000,000 transfer bytes; written data 0 / 268,435,456 bytes; pilot branch logical size 39,903,232 bytes.
- Logical size is not billed physical storage. Neon Free-plan Functions active/waiting capacity and billed storage are not exposed by the v3 consumption API used here (HTTP 403); usage remains UNKNOWN. Provider request logs give only an observed invocation lower bound, not the billing meter.
- No paid upgrade, top-up or automatic paid fallback is enabled. Keep dispatch bounded and stop it if any free-capacity indicator approaches its limit.

## Acceptance evidence
- CI run: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/45991263144
- Deployment 8 source SHA-256: `7b6244dae8164e5b9776503ff4cebb37a4cbb3a6c56d91ab8c280f22bcc1ea4b`
- Canonical pilot evidence IDs and audit IDs are recorded in the Neon `holdco` ledger under the P03 temporary-runtime pilot addendum.
- This is technical pilot evidence only. It is not P03 exit, production certification or commercial success.
