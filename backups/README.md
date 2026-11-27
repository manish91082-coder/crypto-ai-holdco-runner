# Pilot Runtime Backup and Restore Evidence

## Artifact
- File: `pilot-runtime-logical-backup-v1.2026-11-27.json`
- SHA-256: `fdad18b80c65395ef4613926f53d959389e1a2058dd2c498d0cccea67288b6eb`
- Classification: `SYNTHETIC_TEST_DATA_ONLY`
- Source Neon project: `little-violet-66887398`
- Source branch: `br-lively-flower-a15zb6ar`
- Source database: `crypto_holdco`

## Backup contents
| Table | Rows |
|---|---:|
| runtime.tasks | 7 |
| runtime.agent_messages | 49 |
| runtime.audit_events | 56 |
| runtime.opportunity_candidates | 7 |
| runtime.worker_heartbeats | 0 |

The backup intentionally excludes `runtime.api_tokens`, `runtime.cron_tokens`, raw Bearer secrets, connection strings and wallet keys.

## Restore drill
- Target branch: `br-flat-violet-a11s64uz`
- Target branch name: `crypto-holdco-pilot-external-backup-restore-drill-2026-11-27`
- Restore method: recreate pilot DDL, then load JSON rows through PostgreSQL `jsonb_populate_recordset`.
- Tasks restored: 7
- Agent messages restored: 49
- Audit events restored: 56
- Opportunity candidates restored: 7
- API token rows restored: 0
- Cron token rows restored: 0
- Restore endpoint: suspended after verification.

## Content-integrity comparison
Source and restored branches produced identical ordered-row hashes:

| Table | Source = restored MD5 |
|---|---|
| tasks | `fa73aebfb9ae24bf6201ff94b2f1dbdd` |
| agent_messages | `fedcb9db3137aa0dadccdd394e023913` |
| audit_events | `7ac88731f77a2eb38c6ca771a4381056` |
| opportunity_candidates | `45fb764a2d1bb364817f39491da39000` |

<badge>Restore result: PASS</badge>

This proves an external logical backup/restore of synthetic pilot runtime data. It does **not** prove backup/restore of the canonical `holdco` schema, real buyer records, or any production revenue ledger. This file is stored in a public GitHub repository; never add private customer data, raw credentials, token hashes or wallet information to it.
