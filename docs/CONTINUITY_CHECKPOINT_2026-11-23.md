# Crypto AI Holdings — Continuity v34.4 / P03.03 IPv6 Egress Feasibility

**Checkpoint:** 23 November 2026 (Asia/Kolkata)  
**Formal runtime audit lineage:** Audit Round 38 remains the latest formal runtime audit; v34.4 records the official-source IPv6 network research and exact next gate.  
**Master Constitution:** v2.0.0 LOCKED  
**WBS:** v2.0.0 LOCKED; 24 phases / 119 tasks  
**Mission key:** `crypto-ai-holdco-master`  
**Active phase/task:** P03 / P03.03 Secret-Safe Runtime Assurance

## 1. Project identity and locked goal

This is only **Crypto AI Holdings — Autonomous Crypto Revenue Ecosystem**. Separate from ZAGRE / AI Agent-to-Agent Revenue Ecosystem, Supabase ₹1,000/day mission, PHANTOMX, Ghost Hunter and trading bots.

Ultimate success requires independently verified realised net revenue greater than zero from an unrelated buyer/sponsor after direct costs, fees, gas, refunds and losses. Sustainable success requires repeat receipts and positive rolling net economics.

First implementation objective: complete P01–P05 foundations; then build/test specialist agents, A2A/MCP, opportunity discovery, offers and delivery; separately gate payment/treasury/chain work; prove an independent buyer receipt, repeatability and best-effort recovery.

Master Constitution v2.0.0 and WBS v2.0.0 remain unchanged.

## 2. Canonical task and live-state read-back

- Task rows: 119 total; 15 COMPLETE, 1 BLOCKED, 103 PLANNED.
- P00: 4/4 COMPLETE.
- P01: 4 COMPLETE; P01.04 BLOCKED on pilot-specific eligibility/compliance evidence.
- P02: 5/5 COMPLETE; first-wave paths selected, no live buyer/pilot claimed.
- P03: P03.02 and P03.04 COMPLETE. P03.01, P03.03 and P03.05 retain partial evidence but task rows are not COMPLETE.
- P04–P23: PLANNED.
- P03 exit gate remains unmet.
- Neon main: READY; Functions 0; Triggers 0; Data API disabled.
- Global Quota Governor: `PAUSE_DEGRADED`; `work_allowed=false`. Function active/waiting Capacity-Hours and storage UNKNOWN; invocation observation DEGRADED/stale.
- Production agents, task runs, messages, opportunities, scheduler invocations and revenue events remain zero at latest read-only verification.
- Existing validation branch expiry is 23 Nov 2026 16:00 IST. Do not reuse, extend, delete or repurpose.

No OCI resource, VCN, IPv6 prefix/address, route, Internet/NAT gateway, HSM key, IAM policy, Neon branch/Data API/Function/Trigger, secret, wallet or financial activity changed.

## 3. New P03.03 finding — IPv6 network path

New report: `docs/P03.03_SECRET_SAFE_RUNTIME_ASSURANCE_v1.3.md`.  
New checklist: `docs/P03.03_OCI_TENANCY_READONLY_EVIDENCE_CHECKLIST_v1.1.md`.

- OCI VCN can receive an Oracle-allocated globally routable IPv6 /56; IPv6-enabled subnet is /64. A public subnet GUA can route to internet via Internet Gateway.
- This may avoid a public IPv4 and NAT gateway for a worker calling Neon over IPv6.
- Neon's official docs say AWS PostgreSQL endpoints support IPv6. Canonical Neon project is on AWS.
- The target is Neon Data API HTTPS, a separate shared proxy-fleet service. Its branch-specific URL comes from the Data API configuration API. Docs do not explicitly guarantee AAAA/IPv6 HTTPS for this hostname.
- Test must retrieve exact Data API URL on a separately authorized child branch, inspect A/AAAA + TTL, then test IPv6 TLS/HTTPS with hostname/SNI validation. Direct PostgreSQL IPv6 is not sufficient proof.
- Oracle's default IPv6 security-list example may allow TCP/22 from `::/0`; explicitly remove it. No inbound management should remain.
- Egress must be allowlistable to the exact Neon IPv6 address set. If dynamic/unbounded or egress cannot be strictly controlled, NO-GO.
- Oracle lists first 10 TB/month APAC outbound transfer free; overage may be billed. Account-specific GUA/IGW price treatment and no-overage are unknown; do not infer free from missing SKU/price row.
- A1 idle reclaim after 7-day low utilization remains. Not guaranteed 24x7.

## 4. Preferred conditional architecture

- Key: OCI Vault HSM RSA + Instance Principals, conditional only.
- Signature: OCI KMS SHA-256 RSA PKCS#1 v1.5 RAW-message operation is algorithm-level RS256 compatible; live proof not done.
- Network: public GUA IPv6 + Internet Gateway first; no NAT/public IPv4 if Data API IPv6 proves reachable and no-bill.
- Data API: one `holdco_api` schema and one `SECURITY INVOKER` heartbeat RPC only on an authorized test branch; no direct raw-table exposure.
- Egress: exact destination address allowlist, TLS hostname validation, no arbitrary egress, no Cloudflare.
- Production worker: not deployed; quota governor paused.

## 5. Missing OCI evidence

No authenticated OCI tenancy data is available through connected project sources. Need redacted read-only:
- Existing tenancy/subscription/Home Region.
- A1 and HSM limits/usage/available.
- Existing VCN prefix type (Oracle GUA /56, BYOIPv6, ULA, none).
- Existing subnet Public/Private, IPv6 /64, route `::/0` to IGW.
- Existing Internet/NAT/Service Gateways.
- Existing ingress/egress rules (SSH from `::/0`? unrestricted egress?).
- Exact account billing/no-overage status for GUA/IGW and outbound transfer.

Detailed Console steps and redaction rules live in the v1.1 checklist. No account signup, upgrade, payment, resource creation or quota increase.

## 6. Exact next gate

Wait for the redacted OCI account/VCN evidence. Then determine whether account and quota are eligible and whether GUA IPv6 + IGW is truly no-bill for this tenancy. Only after a GO and separate bounded authorization propose a disposable Neon child-branch Data API AAAA/TLS test.

## 7. Exact resume point

- Active phase: P03 Cloud Runtime and Resilience.
- Active task: P03.03 Secret-Safe Runtime Assurance.
- Task row remains PLANNED; nested progress remains PARTIAL.
- Next action: obtain redacted OCI Home Region/quota/VCN/IPv6 evidence.
- Production remains paused; no production agents, live sources or verified revenue.

**Mission state:** P03 IN PROGRESS; Quota Governor PAUSED; no production workloads.
