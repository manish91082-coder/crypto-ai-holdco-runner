# Crypto AI Holdings — Phase-Per-Response Execution Protocol v1.0

**Effective:** 26 November 2026 (Asia/Kolkata)  
**Mission key:** `crypto-ai-holdco-master`  
**Authority:** Additive operational protocol under Mission Continuity & No-Drift Lock v1.4. Master Constitution v2.0.0 and WBS v2.0.0 remain immutable and LOCKED.

## 1. Primary operating rule

**One assistant work response = one active WBS phase.** The execution target is to complete one entire phase in that response whenever its tasks, prerequisites, credentials, legal authority, provider capacity and verification evidence are available.

The assistant is the execution lead: decide task order, perform safe authorised work, test, independently audit, persist evidence and prepare the next checkpoint without asking the owner to manage ordinary project steps.

This is a throughput target, not a waiver of phase gates. A phase may not be declared complete merely to fit one response. Owner-only identity/account evidence, provider-side prerequisites, security authorization, legal/KYC, unavailable quota or missing buyer evidence may require additional responses. In that case:
- keep the same phase active;
- execute every other independently executable task in the phase during the response;
- make one precise blocker register, avoid circular re-investigation, and do not reopen auxiliary work without a newly evidenced defect;
- resume the same phase on the next response.

## 2. Mandatory response execution cycle

For every response:

1. **Cold-start verification:** Read the latest canonical resume prompt, Mission Continuity & No-Drift Lock v1.4, Master v2.0.0, WBS v2.0.0, live `mission_state`, task rows, evidence, audit tail, quota Governor, provider/runtime inventory and latest continuity snapshot. Independently verify the locked Master/WBS hashes.
2. **Select exactly one phase:** Use the live canonical `current_phase` and WBS dependency order. No parallel phase execution and no cross-project work.
3. **Inventory all phase tasks:** For each numbered task, classify it as executable now, dependent on another phase task, owner-only, provider-gated, legal/security-gated, or blocked by evidence.
4. **Execute to completion, not merely plan:** Complete every independently executable research, design, build, integration, data change, test, readback and review within that phase, using existing approved resources. Batch independent actions where safe. Do not stop after planning while executable work remains.
5. **Avoid polish loops:** Do not rebuild an existing package or repeat a source-kit/test suite unless a newly observed defect changes acceptance. Prefer resolving the highest blocking dependency over polishing a passing auxiliary component.
6. **Verify:** Run relevant tests, negative cases, hash/integrity checks, least-privilege/readback and independent acceptance review. Distinguish source-level, offline, synthetic, provider-live and production evidence.
7. **Update state in the same response:** Append a versioned canonical execution report/checkpoint, append evidence records for new claims, and append an audit event with evidence links, phase/task decisions, blockers, no-change controls and the exact next action. Publish the next-chat resume prompt with the latest verified state. Verify document SHA-256 against the stored body.
8. **Protect canonical governance:** Never edit the locked Master/WBS or force task/phase status. Update a task row only after its exact WBS acceptance criteria are met and evidence is persisted. Do not create a continuity snapshot while the documented P01/WBS/Mission-State projection discrepancy remains open.
9. **Close and clean up:** Read back all writes. Suspend/idle any temporary database compute or test resource that was started, where safe. Verify no unwanted trigger, deployment, paid usage or financial action occurred.
10. **Report clearly:** State current phase, actual task completion, tests/evidence, open blockers, no-drift result, exact next executable action and latest checkpoint identifiers.

## 3. Phase completion standard

A phase closes only when all its WBS tasks and its exact exit gate pass with required primary-source evidence, live state readback, passing tests, independent review and continuity update. No status inference from code existence, documentation, mock tests, proposed architecture, reward caps, opportunities, applications or testnet activity is allowed.

When all requirements are available, the target is one response per phase. When not available, the response must still exhaust all independently executable work and preserve the phase as active. Never skip/reorder P00–P23 or start the next phase before the exit gate passes.

## 4. Response-count planning

- Planning target: **one response per phase that has no unresolved external gate**.
- Blocked phases require as many additional responses as are genuinely necessary to obtain/verify external prerequisites and finish live tests.
- Current mission has 21 phase gates remaining from P03 through P23. The current P03 has owner/provider gates, so a one-response completion promise is not evidence-based.
- Revenue Hunting begins at P08, not P02. P02 is market research and portfolio selection; P08 is the first live read-only funded-opportunity discovery and qualification phase.
- First verified revenue is P20: unrelated buyer, accepted deliverable, final receipt and independently verified NET REVENUE > 0 after all costs.

These are execution targets and phase counts, not time or revenue guarantees.

## 5. Per-response continuity contract

Every work response must persist:
- latest canonical active phase and mission status;
- all WBS task counts and per-phase status;
- newest evidence IDs and audit event;
- live source/agent/message/opportunity/task-run/scheduler/revenue counters;
- quota Governor and provider/runtime state;
- current blockers and owner-only dependencies;
- Master/WBS/Lock/Prompt/report checksums;
- latest continuity snapshot pointer, or explicit reason why no snapshot is allowed;
- next phase-local action and prohibited actions.

Use append-only, versioned `canonical_documents`, `evidence_records` and `audit_events` as the response checkpoint mechanism. The resume prompt must be updated on every response. A new continuity snapshot is separate and is created only when governance permits it. GitHub may carry a public-safe copy of the protocol/prompt, but Neon remains the live authority and GitHub is never runtime.

## 6. Commercial and security invariants

The exclusive objective remains the zero-upfront crypto-native autonomous revenue business with authenticated independent A2A communication, specialist agents, funded opportunity discovery, automated engineering/delivery, external buyer payments and independently verified positive net revenue.

No paid fallback, auto-upgrade, payment method, owner-funded gas, Cloudflare, local runtime, credential leakage, unauthorized financial execution, wallet signing, trading, transfer, external security testing or self-certified revenue. Unknown cost, account quota, terms, identity, region, permissions, buyer funding or payout eligibility fails closed. Human KYC, legal identity, platform attestation and account-authority requirements remain human-controlled.

## 7. Current application

Active phase remains P03 — Cloud Runtime & Resilience. P03.02 and P03.04 are COMPLETE; P03.01, P03.03 and P03.05 remain incomplete. The latest P03 joint reassessment is report v1.6. No OIDC source-kit rebuild without a newly evidenced defect. Do not enable source polling, agent dispatch or payment rails while the live quota Governor is PAUSE_DEGRADED.

**This protocol accelerates execution; it never weakens evidence, security, legal or commercial acceptance.**