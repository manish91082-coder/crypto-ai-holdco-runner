# Neon Function: Crypto AI Holdings Pilot Runtime

## Deployment identity
- Neon project: `little-violet-66887398`
- Isolated branch: `br-lively-flower-a15zb6ar`
- Database: `crypto_holdco`
- Function slug: `cryptoaicore`
- Active deployment: `5`
- Runtime: Node.js 24
- Region: `aws-ap-southeast-1` (Singapore)
- Invocation URL: `https://br-lively-flower-a15zb6ar-cryptoaicore.compute.c-1.ap-southeast-1.aws.neon.tech/`

## Source archive
`function.zip.b64` is the exact ZIP uploaded for deployment 5. Decode it to a ZIP and inspect the root `index.mjs` before redeployment. It contains no operator or cron secrets. Do not place secrets in this repository.

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

## Safety and boundaries
- Pilot branch only. Main production branch and locked Master Constitution/WBS were not changed.
- Public CI smoke-tested root handler, database readiness and seven-agent card.
- Scheduled trigger currently runs every 5 minutes and dispatches at most three queued tasks per invocation.
- Positive synthetic E2E task `e1a54be2-6e2e-46f1-8d73-6f8e1a9e7a21`: completed; seven A2A messages, eight audit events, QA_PASS and delivery packaged for human review. No buyer or payment.
- Negative-control task `0b437f24-34fb-4eb1-a6f2-ded86fdbe8b2`: all eight eligibility requirements missing; BLOCKED_OR_UNVERIFIED, QA_BLOCK and BLOCKED_BY_QA; seven messages/eight audit events.
- Both tasks explicitly recorded `NO_REVENUE_CLAIM`; realised net revenue is zero.
- Neon project-level snapshot on 2026-11-27: 20,380 CU-seconds (5.6611 CU-hours), 22,372,340 transfer bytes; pilot database logical size 15,892,480 bytes. Logical size is not billed physical storage.
- Account inventory: two projects; this project has one Function/one trigger, the other project has zero Functions/Triggers. Free-plan consumption API returned HTTP 403 requiring a v3 paid plan; billed storage and Functions active/waiting usage therefore remain UNKNOWN.
- Crash-recovery leases and retry-idempotent writes are not yet deployed/accepted; do not describe the pilot as crash-recovery complete.
- Live submissions, wallet signing, trading and payments are disabled.
- The function currently uses Neon-injected `DATABASE_URL`; least-privilege runtime role adoption and independent backup/restore are still open P03 controls.
- Neon Functions Free allowances are limited and enforced both per project and account-wide. Stop/reduce dispatch if capacity approaches the free ceiling; do not upgrade or enable paid fallback.

## Acceptance evidence
GitHub Actions: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/45977582468
Canonical Neon evidence: `ev.holdco.p03.neon-temporary-runtime-synthetic-e2e.20261127`
Canonical audit: `audit.holdco.p03.neon-temporary-runtime-synthetic-e2e.20261127T095601Z`
