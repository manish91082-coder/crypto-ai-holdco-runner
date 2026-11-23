# Crypto AI Holdings — Continuity v34.7 / P03.03 Alternate Runtime Candidate Review

**Checkpoint:** 23 November 2026 (Asia/Kolkata)  
**Project:** Crypto AI Holdings — Autonomous Crypto Revenue Ecosystem  
**Mission key:** `crypto-ai-holdco-master`  
**Master Constitution:** v2.0.0 LOCKED  
**WBS:** v2.0.0 LOCKED; 24 phases / 119 tasks  
**Active phase/task:** P03 Cloud Runtime and Resilience / P03.03 Secret-Safe Runtime Assurance  
**Prior checkpoint:** v34.6  
**Assessment:** `P03.03_ALTERNATE_CLOUD_RUNTIME_ASSESSMENT_v1.0.md`

## 1. Mission objective and immutable constraints

Ultimate success is independently verified realised net revenue greater than zero from an unrelated external buyer/sponsor after all direct costs, provider/API fees, gas, refunds and losses; sustainable success additionally requires repeat receipts and positive rolling net economics.

First implementation objective remains completion of the P01–P05 legal, commercial, runtime, evidence and zero-trust foundations. Agent workforce, A2A/MCP fabric, opportunity discovery, service catalogue and work factory remain behind those gates. Payments, treasury and on-chain execution retain their separate gates.

Zero upfront owner capital; no owner-funded gas; no paid fallback, automatic upgrade, subscription, deposit, borrowing or silent spend. Cloudflare excluded. No laptop, desktop, WSL, local server or self-hosted runner as an operational dependency. GitHub is optional public-safe source control only, not an operating dependency. Unknown cost, quota, region, eligibility, terms, availability or security posture fails closed. No secrets in chat/files/SQL/logs/commands; no private signing key, wallet signing, approvals, transfers, withdrawals, live trading, staking, MEV or flash-loan execution in this pre-production phase. Tax remains out of scope. Do not reuse legacy crypto/trading repositories.

## 2. Canonical identity and locked checksums

- Neon project: `crypto-autonomous-holdco-memory` / `little-violet-66887398`.
- Region/platform: AWS `ap-southeast-1`.
- Database/schema: `crypto_holdco` / `holdco`.
- Canonical main branch: `br-calm-block-a1fbdnnj`.
- Master Constitution v2.0.0 SHA-256: `ae2086956bdcce1ba8f0086f4a44ffffbb315291c9e7cab6970654391e6fd803`.
- WBS v2.0.0 SHA-256: `7e8fa46de0d1348dd3bda6f266f9afffad9116dd1d814a2bf5f653c74f39a2e2`.
- P03.03 report v1.5 SHA-256: `ad045f081a1eedbfd97bbc4bd6e64c1dac08f63292c4a8c11daeec05018607e1`.
- OCI checklist v1.2 SHA-256: `f80f954a07d9b4263338e02f5aac95696ce7dfa3261629b416126a40dc0dfd3b`.
- Alternate runtime assessment v1.0 SHA-256: `503dfbbf5b941d70d3c9e16389d238af60fad0211ec6b0d5f0873ed609e93403`.

Master Constitution and WBS remain LOCKED and unchanged.

## 3. Cold-start canonical state read-back

- Neon project plan remains Free (`free_v3`); main branch `br-calm-block-a1fbdnnj` READY.
- Main branch Functions 0; Triggers 0; Data API disabled.
- Task table: 119 total; COMPLETE 15, BLOCKED 1, PLANNED 103.
- P00 4/4 complete; P01 baseline complete with P01.04 blocked on pilot-specific evidence; P02 5/5 complete; P03.02/P03.04 complete; P03.01/P03.03/P03.05 partial; P04–P23 planned.
- Active task `CRYPTO-HOLDCO-V2-P03-03` remains WBS `PLANNED`; nested progress `PARTIAL`.
- Quota Governor remains `PAUSE_DEGRADED`, `work_allowed=false`; Functions active and waiting Capacity-Hours and billable storage remain UNKNOWN; monthly invocation observation 11 remains a stale lower bound / DEGRADED.
- Production agents, task runs, agent messages, opportunities, revenue events and scheduler invocations remain 0.
- Existing expiring validation branch `br-round-block-a16i9agr` is not reusable, extendable, deletable or repurposable; allow the configured TTL policy to operate.
- OCI account existence/type, upgrade state, Home Region, A1/HSM quotas, VCN, GUA/IPv6, gateways, routes, effective egress security and billing remain UNKNOWN. No user evidence supplied.

## 4. P03.03 alternate runtime assessment v1.0

- OCI Always Free A1 + GUA IPv6/IGW remains the strongest conditional persistent-VM hypothesis, not approved and not provisioned.
- Trigger.dev Cloud Free is the strongest newly reviewed **managed task** candidate for a bounded synthetic-only pilot. Published plan: $0/month, no credit card, $5 monthly usage credits, 20 concurrent runs, 10 schedules, one-day logs/query history, Dev and Prod environments. Tasks execute on managed workers and the pricing FAQ states no fixed timeout. Invocation fee and compute-second costs both apply.
- Trigger.dev is **not approved for production**: no Free SLA; Free support is discretionary; $5 compute credit pool is small and external model/API/data costs are separate; 1-day logs limit incident forensics; deployment without local machine or GitHub operational dependency is UNKNOWN.
- Material security risk: vendor reports 1 Nov 2026 incident affecting 0.66% of customer environments; root API keys and environment variables were accessed in some environments; vendor says it revoked affected keys, notified impacted accounts and found no evidence of wider customer data or production database access. Account-specific impact status is unknown.
- Any future pilot, only after separate precise authorization, must use synthetic fixtures and public/non-sensitive metadata. No Neon passwords, DB credentials, API tokens, personal/customer data, wallet secrets or private keys. No external API/model calls, no production tasks, no payments or financial action.
- Credit exhaustion requires a paid upgrade to continue according to vendor pricing FAQ; the mission does not allow upgrade. Stop/pause and never auto-upgrade.
- Netlify generic compute is rejected for autonomous revenue-swarm use due the 4 Nov 2026 AUP restriction to website/web-application-related workloads. Inngest is orchestration, not general host for customer code. Deno Deploy beta has no uptime guarantee and 512 MB limit. Val Town is winding down; Pipedream Free is development-only; QStash is queue/scheduler, not worker runtime. No candidate satisfies production 24x7 requirements.

## 5. Decision and next gate

- `triggerdev_cloud_free`: `CONDITIONAL_PILOT_CANDIDATE_NOT_APPROVED`.
- `production_runtime`: `PAUSED`.
- `work_allowed`: `false`.
- `quota_governor`: `PAUSE_DEGRADED`.
- `triggerdev_account_state`: `UNKNOWN`; no account accessed or created.
- `triggerdev_security_impact_state`: `UNKNOWN`; no account-specific dashboard or email inspected.
- `triggerdev_nonlocal_nongithub_deployment`: `UNKNOWN`.
- `triggerdev_secrets_policy`: no DB credentials, external API tokens, personal data, wallet credentials, signing keys or private keys in initial evaluation.
- Primary next gate remains read-only evidence from an existing OCI account using `P03.03_OCI_TENANCY_READONLY_EVIDENCE_CHECKLIST_v1.2.md`: subscription category and upgrade state; Home Region; A1/HSM limits/usage/available; existing VCN IPv6 prefix/subnet; gateway/route; effective IPv6 ingress/egress and DNS; visible billing/usage state.
- If OCI evidence is unavailable or fails, do not switch automatically to Trigger.dev. A separately authorized owner review of an already-existing Trigger.dev account, its current terms, incident notification status and non-local/non-GitHub deployment path would be needed before a synthetic-only pilot can be proposed.
- Only after OCI account eligibility, quota, billing, exact Data API AAAA/TLS and egress controls are all verified may a new disposable Neon child-branch network test be proposed. It requires a separate bounded authorization. Never reuse the expiring validation branch.

## 6. No-change confirmation

No OCI account/resource/VM/VCN/prefix/route/gateway/security-rule/HSM key/IAM policy was created or changed. No Trigger.dev account was created or accessed; no terms accepted; no payment instrument added; no task deployed or invoked. No Neon branch/Data API/Function/Trigger/role/credential/secret/signing key was created or changed. No GitHub workflow dispatched. No wallet, transaction, payment, signing, withdrawal or financial activity occurred. No WBS task or phase was marked complete.

**Mission status:** P03 IN PROGRESS; P03.03 PARTIAL; recurring production workloads PAUSED; no approved 24x7 runtime; no production agents; no independently verified revenue receipt.