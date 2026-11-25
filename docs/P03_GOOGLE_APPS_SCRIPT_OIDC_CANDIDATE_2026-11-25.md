# P03 — Google OIDC Cloud Scheduler Candidate

**Review date:** 25 November 2026  
**Status:** CONDITIONAL CANDIDATE — PREFLIGHT ONLY; NOT APPROVED OR DEPLOYED.

## Decision

Direct Google Apps Script JDBC to a Neon Free project is rejected: the JDBC path requires Google source IPs to be allowlisted, while Neon IP Allow is a Scale-plan feature. The candidate path is Google Apps Script installable time trigger + Google OpenID Connect identity token + Neon Data API HTTPS.

Google documents `ScriptApp.getIdentityToken()` for the effective user when the explicit `openid` scope is requested. Installable triggers run as their creator. The Neon Data API supports external JWT providers and configurable JWT role claims. A proposed `.sub` claim → dedicated NOLOGIN database role mapping is design-only and must be tested on an isolated branch before any main-branch change.

Official references:
- https://developers.google.com/apps-script/reference/script/script-app#getIdentityToken()
- https://developers.google.com/apps-script/guides/triggers/installable
- https://developers.google.com/apps-script/guides/services/quotas
- https://neon.com/docs/data-api/custom-authentication-providers
- https://neon.com/docs/data-api/access-control
- https://neon.com/docs/data-api/manage

## Bounded design

- 30-minute cadence target, 48 executions/day maximum; no guaranteed schedule or uptime.
- Consumer Apps Script quotas currently publish 90 minutes/day trigger runtime, 20,000 URL Fetch calls/day and six minutes maximum runtime per execution. Quotas may change.
- Internal budget target: no more than 20 seconds per run and four HTTP calls per completed heartbeat.
- Google ID token is obtained just in time; the source code never logs, returns, stores or caches the raw token.
- Runtime is OFF by default. Script-side and database-side kill switches plus all quota rows must permit work.
- No source polling, agent spawning, submissions, wallet actions, payments or chain transactions.

## Evidence status

A private source kit was prepared and passed 12/12 offline mock tests. Those tests are not a live Google or Neon integration test. The Data API is not enabled, no identity provider or role mapping has been configured, and no trigger or Function is deployed.

Neon's Data API relies on PostgreSQL GRANT/RLS controls. No broad grants or public-schema exposure are approved. Only a dedicated NOLOGIN role inheriting an existing narrow worker permission set may be tested.

## Live blockers

- Owner identity preflight has not been run; no Google `sub` or `aud` claim has been captured.
- Google external provider, JWKS, audience and role-claim mapping remain unconfigured and untested.
- Function capacity metrics remain unknown; monthly invocation evidence remains degraded; the global quota governor remains paused.
- A separate PostgreSQL role-state discrepancy is under investigation; do not use the affected runtime role.

**P03 remains IN_PROGRESS. Do not start P04.**