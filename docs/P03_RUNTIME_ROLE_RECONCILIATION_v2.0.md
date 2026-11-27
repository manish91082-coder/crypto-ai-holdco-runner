# P03.03 Runtime Role Reconciliation v2.0 — 27-Nov-2026
Mission: crypto-ai-holdco-master
Purpose: supersede the current-state interpretation in the 25-Nov v1.0 read-back without deleting historical evidence.

## Current source of truth: fresh PostgreSQL catalog
Both Neon main branch br-calm-block-a1fbdnnj and isolated pilot branch br-lively-flower-a15zb6ar were read-only checked on 27-Nov-2026. The current holdco_runtime row on both reports:
- rolcanlogin=false
- rolpassword IS NOT NULL=false
- rolsuper=false
- rolcreatedb=false
- rolcreaterole=false
- rolreplication=false
- rolbypassrls=false
- zero active sessions for usename holdco_runtime.

Membership graph on both branches:
- crypto_holdco_owner -> holdco_runtime with admin_option=true, inherit_option=false, set_option=false.
- holdco_runtime -> holdco_worker with admin_option=false, inherit_option=true, set_option=true.

No raw password hash was selected. No role API password reveal call was made. No role or grant mutation occurred.

## Historical discrepancy
The 25-Nov-2026 v1.0 public-safe note described catalog state rolcanlogin=true and password-field-present, while provider control-plane authentication metadata reported no_login. That observation is not reproduced by this 27-Nov fresh catalog read. Keep the older note as a dated historical observation; for current decision-making this v2.0 read-back supersedes it. This record does not claim why the role state differs across dates.

## Password bootstrap blocker
The role currently has NOLOGIN and no password. Neon SDK source in neondatabase/neon-pkgs confirms the provider reset API refuses to reset a passwordless role. The SDK's new scoped-role route inserts a bootstrap password as a literal SQL statement and warns that statement logging may record it. That route creates a new role, not the existing holdco_runtime identity. No supported secret-safe first-password method for the existing role was confirmed from the reviewed provider sources or open issues #12984/#12986.

## Decision
- Preserve role identity, current attributes, memberships and custom privileges unchanged.
- Do not insert plaintext passwords in SQL, use unverified SCRAM-verifier routes, recreate/replace the role, enable LOGIN, add neon_superuser or alter membership.
- Continue the isolated Function pilot only under its separate Neon-managed crypto_holdco_function identity with Governor paused and trigger disabled.
- P03.03 remains partial until an official supported first-password path exists or the locked plan's exact alternative runtime exit gate is independently satisfied.
