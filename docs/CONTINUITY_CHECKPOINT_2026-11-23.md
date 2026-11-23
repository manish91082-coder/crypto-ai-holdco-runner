# Crypto AI Holdings — Continuity v34.8 / P03.03 Additional Provider Eligibility Review

**Checkpoint:** 23 November 2026 (Asia/Kolkata)  
**Project:** Crypto AI Holdings — Autonomous Crypto Revenue Ecosystem  
**Mission key:** `crypto-ai-holdco-master`  
**Master Constitution:** v2.0.0 LOCKED  
**WBS:** v2.0.0 LOCKED; 24 phases / 119 tasks  
**Active phase/task:** P03 Cloud Runtime and Resilience / P03.03 Secret-Safe Runtime Assurance  
**Prior checkpoint:** v34.7  
**Assessment:** `P03.03_ALTERNATE_CLOUD_RUNTIME_ASSESSMENT_v1.1.md`

## 1. Mission objective and immutable constraints

Ultimate success is independently verified realised net revenue greater than zero from an unrelated external buyer/sponsor after all direct costs, provider/API fees, gas, refunds and losses; sustainable success additionally requires repeat receipts and positive rolling net economics.

First implementation objective remains completion of P01–P05 legal, commercial, runtime, evidence and zero-trust foundations. Agent workforce, A2A/MCP fabric, opportunity discovery, service catalogue and work factory remain behind those gates. Payments, treasury and on-chain execution keep their separate gates.

Zero upfront owner capital; no owner-funded gas; no paid fallback, automatic upgrade, subscription, deposit, borrowing or silent spend. No payment method may be added under the current locked gate. Cloudflare excluded. No laptop, desktop, WSL, local server or self-hosted runner as operational dependency. GitHub is optional public-safe source control only, not an operating dependency. Unknown cost, quota, region, eligibility, terms, availability or security posture fails closed. No secrets in chat/files/SQL/logs/commands; no private signing key, wallet signing, approvals, transfers, withdrawals, live trading, staking, MEV or flash-loan execution in this pre-production phase. Tax remains out of scope. Do not reuse legacy crypto/trading repositories.

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
- Alternate runtime assessment v1.1 SHA-256: `9107638802afef8877a51e7fc138d184924a5efefd70aa2b9017a9a9f36c0d7f`.

Master Constitution and WBS remain LOCKED and unchanged.

## 3. Cold-start canonical state read-back

- Canonical Neon main branch `br-calm-block-a1fbdnnj` is READY and default.
- Branch listing on this review still showed main Functions 0 / Triggers 0 and the legacy validation branch `br-round-block-a16i9agr` READY with configured expiry `2026-11-23T10:30:00Z` (16:00 IST). Do not reuse, extend, delete or repurpose the legacy branch; allow TTL policy to operate.
- Direct task-table count readback: 119 total; COMPLETE 15, BLOCKED 1, PLANNED 103.
- Active task `CRYPTO-HOLDCO-V2-P03-03` remains WBS PLANNED / nested PARTIAL.
- Mission status `P03_OCI_FREE_TIER_SPEND_GUARD_AND_IPV6_EVIDENCE_WAIT`; current phase `P03_CLOUD_RUNTIME_AND_RESILIENCE`.
- Continuity pointer at start of this review: v34.7.
- Quota Governor `PAUSE_DEGRADED`; `work_allowed=false`. Functions active Capacity-Hours, waiting Capacity-Hours and billable storage remain UNKNOWN; invocation observation 11 remains a stale lower bound / DEGRADED.
- Production agent instances, task runs, agent messages, opportunities, revenue events and scheduler invocations remain zero in the last canonical checkpoint; none was created in this review.
- OCI account/type/upgrade status/Home Region/A1/HSM quotas/VCN/IPv6/IGW/egress/billing evidence remains UNKNOWN. No owner evidence supplied.

## 4. P03.03 additional provider eligibility findings v1.1

- Northflank Sandbox offers always-on compute and small free resources, but the official billing guide says a payment method is mandatory before creating resources and expressly says the free sandbox should not be used for production. Reject.
- Modal Starter offers $30/month compute credits and limited scheduled functions. Modal's Workspace budget is documented as a hard monthly cap for total workspace spend, but the exact fresh-Starter zero-exposure cap and credit-accounting behavior are UNKNOWN; Environment budgets are higher-tier only; Model APIs are charged separately; the Startup-credit FAQ says a payment method is required to avoid interruption at credit exhaustion, while applicability to ordinary Starter onboarding is not fully established. CLI deploy is documented and GitHub Actions is a common deployment route; no compliant alternative deployment path was proven. Conditional research only; not approved.
- Fly.io Free's $5 allowance transitions to Pay-As-You-Go and requires a credit card. Reject.
- Hugging Face Spaces: free static hosting differs from compute-backed Gradio/Docker spaces; docs require paid plan for compute-backed Spaces and say free hardware sleeps after inactivity. Not an autonomous worker runtime.
- Trigger.dev Cloud Free from v1.0 remains conditional synthetic-only pilot candidate, not production. Its no-SLA, $5 credits, security incident, one-day logs and unknown deployment path remain unresolved.
- OCI remains the first conditional persistent-runtime hypothesis, awaiting existing-account read-only evidence.
- No provider satisfies all locked criteria for a proven zero-cost, no-card, no-paid-overage, no-local/no-GitHub-dependency, production-grade 24x7 runtime.

## 5. Decision and next gate

- `production_runtime`: `PAUSED`.
- `work_allowed`: `false`.
- `quota_governor`: `PAUSE_DEGRADED`.
- `active_task`: P03.03; task row PLANNED; nested progress PARTIAL.
- `northflank_sandbox`: REJECTED_PAYMENT_METHOD_AND_NONPRODUCTION_TERMS.
- `modal_starter`: CONDITIONAL_RESEARCH_ONLY_WORKSPACE_HARD_CAP_DOCUMENTED_BUT_FRESH_STARTER_ZERO_SPEND_CARD_AND_DEPLOYMENT_GATES_UNKNOWN.
- `fly_io_free`: REJECTED_CARD_REQUIRED_AND_PAYG_CONTINUATION.
- `huggingface_spaces`: REJECTED_AS_WORKER_FREE_COMPUTE_SLEEPS_OR_REQUIRES_PAID_PLAN.
- `triggerdev_cloud_free`: CONDITIONAL_PILOT_CANDIDATE_NOT_APPROVED.
- Primary next gate remains redacted read-only OCI account/subscription/upgrade state, Home Region, A1/HSM quotas, existing VCN IPv6/subnet, Internet Gateway route, effective ingress/egress, DNS and visible billing evidence using checklist v1.2.
- No automatic provider switch. A Trigger.dev synthetic-only pilot would still need a separate exact authorization, verified existing account/terms/security-impact state and acceptable no-local/no-GitHub deployment path.

## 6. No-change confirmation

No OCI, Northflank, Modal, Fly.io, Hugging Face or Trigger.dev account was created or accessed. No terms accepted, payment method added, resource/service/job/database/token/secret/role/branch/Data API/Function/Trigger/key/deployment created or changed. No workflow dispatched, no task invoked, no runtime activated and no financial activity occurred. Master Constitution/WBS hashes and task statuses unchanged.

**Mission status:** P03 IN PROGRESS; P03.03 PARTIAL; recurring production workloads PAUSED; no approved 24x7 runtime; no production agents; no independently verified revenue receipt.

## 7. Primary sources

- Northflank pricing: https://northflank.com/pricing
- Northflank billing/free Sandbox: https://northflank.com/docs/v1/application/billing/pricing-on-northflank
- Modal pricing: https://modal.com/pricing
- Modal Workspace/Environment budget semantics: https://modal.com/docs/guide/budgets
- Modal payment-method FAQ: https://modal.com/startups
- Modal deployment CLI: https://modal.com/docs/cli/latest/deploy
- Modal GitHub Actions deployment example: https://modal.com/docs/guide/useful-snippets
- Fly.io pricing: https://fly.io/pricing/
- Hugging Face Spaces overview: https://huggingface.co/docs/hub/spaces-overview
- Prior assessment v1.0: `P03.03_ALTERNATE_CLOUD_RUNTIME_ASSESSMENT_v1.0.md`
- OCI evidence checklist v1.2: `P03.03_OCI_TENANCY_READONLY_EVIDENCE_CHECKLIST_v1.2.md`