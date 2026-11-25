# P03 Runtime Role NOLOGIN Alignment — Public-Safe Summary

**Date:** 25 November 2026  
**Phase:** P03 — Cloud runtime and resilience  
**Disposition:** Provider/catalog login-flag conflict resolved to NOLOGIN; separate runtime login path remains unproven.

## Official contract

Neon's role management documentation defines NOLOGIN as a role that cannot authenticate. The provider role API had already reported the role's authentication method as `no_login`, but PostgreSQL's catalog unexpectedly reported `rolcanlogin=true`. Neon’s CLI describes `--no-login` as creating a passwordless role that cannot log in.

## Minimal alignment

A single least-privilege statement aligned the PostgreSQL flag to the provider contract: `ALTER ROLE holdco_runtime NOLOGIN`. The database owner had CREATEROLE. The target role owned no relations, routines, schemas, types or default ACLs. No password reset, grant, revoke, membership/ownership change or login attempt was performed.

Post-change read-back: the API reports `no_login`; the catalog reports `rolcanlogin=false`. The role remains a non-superuser privilege group with no role/database creation or RLS-bypass flags. Existing read-only and narrow column-scoped scheduler permissions remain unchanged. A catalog password-hash field still exists, but no raw hash was retrieved; NOLOGIN prevents the role from authenticating.

## Remaining gate

The role is now a NOLOGIN permission group, not a usable runtime login identity. A separate secret-safe LOGIN identity or validated OIDC/JWT runtime route is still required. No worker was deployed. Global quota governance remains fail-closed and no production work is enabled.

Official references: [Manage roles](https://neon.com/docs/manage/roles), [Neon CLI roles](https://neon.com/docs/cli/roles), [Create role API](https://neon.com/docs/reference/api/branches/create-project-branch-role).

**P03 exit: NOT PASSED. Do not begin P04.**
