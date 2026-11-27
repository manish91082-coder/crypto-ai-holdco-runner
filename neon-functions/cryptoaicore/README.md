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
- Current verified task was synthetic only: seven agent messages, eight audit events, QA_PASS; realised net revenue is zero and no revenue claim is made.
- Live submissions, wallet signing, trading and payments are disabled.
- The function currently uses Neon-injected `DATABASE_URL`; least-privilege runtime role adoption and independent backup/restore are still open P03 controls.
- Neon Functions Free allowances are limited and enforced both per project and account-wide. Stop/reduce dispatch if capacity approaches the free ceiling; do not upgrade or enable paid fallback.

## Acceptance evidence
GitHub Actions: https://github.com/manish91082-coder/crypto-ai-holdco-runner/actions/runs/45977582468
Canonical Neon evidence: `ev.holdco.p03.neon-temporary-runtime-synthetic-e2e.20261127`
Canonical audit: `audit.holdco.p03.neon-temporary-runtime-synthetic-e2e.20261127T095601Z`
