# P03 — Public Provider Evidence Review

**Evidence date:** 25 November 2026  
**Scope:** P03 — Cloud runtime and resilience  
**Status:** P03 remains IN_PROGRESS; the exit gate has not passed.

## Neon Free — published limits

Neon's current plans documentation describes the Free plan as $0/month and includes, per project, 100 CU-hours/month, 1 GB Postgres storage, 5 GB public network transfer, and Functions allowances of 10 active Capacity-Hours, 400 waiting Capacity-Hours, and 1 million invocations per month. Free compute scales to zero after five minutes and this cannot be disabled. Function execution and egress consume the applicable project allowances.

Official source: https://github.com/neondatabase/website/blob/main/content/docs/introduction/plans.md

Project verification continues to show the canonical database branch READY, with no deployed Functions, no Triggers, and Data API disabled. Database storage and network measurements have been refreshed; Function capacity remains unknown and invocation evidence remains degraded, so the global Quota Governor stays paused.

## OCI Always Free — published eligibility

Oracle documents Always Free resources as available in the tenancy Home Region. Ampere A1 receives 1,500 OCPU-hours and 9,000 GB-hours/month, equivalent in an Always Free tenancy to 2 OCPUs and 12 GB memory. The documentation also lists 200 GB block-volume storage, 10 TB/month outbound data transfer, 20 HSM-protected key versions, and 150 Vault secrets.

Official source: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm

Oracle Budgets are soft limits, with budget alerts evaluated periodically every 24 hours. They are not a hard spending stop. Compartment quotas are a distinct provisioning control and must not be mistaken for proof of a universal zero-bill boundary.

Official sources:
- https://docs.oracle.com/en-us/iaas/Content/Billing/Concepts/budgetsoverview.htm
- https://docs.oracle.com/en-us/iaas/Content/General/service-limits/default.htm

## Decision

OCI remains a conditional candidate only. Account type/upgrade state, actual Home Region, available A1 capacity, current quotas, VCN/IPv6/route/egress/DNS configuration and billing evidence are not verified. No resource or account was provisioned or upgraded during this review.

P03 is not complete. The active blockers are unknown Function usage, degraded invocation evidence, the unresolved secret-safe runtime deployment route, and missing OCI account/network/billing evidence. No later WBS phase is authorised until P03's exit gate passes.