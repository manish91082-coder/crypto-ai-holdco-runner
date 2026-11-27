#!/usr/bin/env python3
"""Build a deterministic, corrected Neon Function ZIP from the archived deployment bundle.

This patch preserves the existing seven-role flow. It fixes the Postgres JSON/JSONB
wire-format boundary: Neon SQL protocol row values may arrive as JSON text rather
than decoded objects. It also normalizes the receipt field used by revenue handoff.
No secrets are included in the bundle.
"""
from __future__ import annotations

import base64
import hashlib
import io
import pathlib
import sys
import zipfile

if len(sys.argv) != 3:
    raise SystemExit("usage: patch_neon_function_bundle.py INPUT_B64 OUTPUT_ZIP")

source_path = pathlib.Path(sys.argv[1])
output_path = pathlib.Path(sys.argv[2])
encoded = source_path.read_text(encoding="ascii").strip()
archive = base64.b64decode(encoded, validate=True)

with zipfile.ZipFile(io.BytesIO(archive), "r") as original:
    names = original.namelist()
    if names != ["index.mjs"]:
        raise SystemExit(f"unexpected bundle entries: {names!r}")
    source = original.read("index.mjs").decode("utf-8")

helper = """function parseObject(value) {
  // Neon/PostgreSQL protocol adapters can expose JSONB as text or UTF-8 bytes.
  if (value instanceof Uint8Array) {
    try { return parseObject(new TextDecoder().decode(value)); } catch { return {}; }
  }
  if (Array.isArray(value) && value.every((item) => Number.isInteger(item) && item >= 0 && item <= 255)) {
    try { return parseObject(new TextDecoder().decode(new Uint8Array(value))); } catch { return {}; }
  }
  if (value && typeof value === 'object' && value.type === 'Buffer' && Array.isArray(value.data)) {
    try { return parseObject(new TextDecoder().decode(new Uint8Array(value.data))); } catch { return {}; }
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      // Invalid/unexpected JSON fails closed to an empty object.
    }
  }
  return {};
}

"""

anchor = "function syntheticCandidate() {"
if source.count(anchor) != 1:
    raise SystemExit("expected one syntheticCandidate anchor")
source = source.replace(anchor, helper + anchor, 1)

old_candidate = """  const candidate = task.task_type === 'demo_e2e' ? syntheticCandidate() : (task.payload?.candidate ?? {});"""
new_candidate = """  const taskPayload = parseObject(task.payload);
  const candidate = task.task_type === 'demo_e2e' ? syntheticCandidate() : (parseObject(taskPayload.candidate));"""
if source.count(old_candidate) != 1:
    raise SystemExit("candidate normalization patch anchor mismatch")
source = source.replace(old_candidate, new_candidate, 1)

old_receipt = """  const revenue = task.payload?.receipt && Object.keys(task.payload.receipt).length"""
new_receipt = """  const revenue = taskPayload.receipt && Object.keys(taskPayload.receipt).length"""
if source.count(old_receipt) != 1:
    raise SystemExit("receipt normalization patch anchor mismatch")
source = source.replace(old_receipt, new_receipt, 1)

old_ready = """const result = await sql('SELECT 1 AS healthy, current_database() AS database_name');"""
new_ready = """const result = await sql('SELECT 1 AS healthy, current_database() AS database_name, current_user AS database_role');"""
if source.count(old_ready) != 1:
    raise SystemExit("readiness role identity patch anchor mismatch")
source = source.replace(old_ready, new_ready, 1)

old_ready_json = """database_name: result.rows[0]?.database_name ?? null, runtime_schema_tables:"""
new_ready_json = """database_name: result.rows[0]?.database_name ?? null, database_role: result.rows[0]?.database_role ?? null, runtime_schema_tables:"""
if source.count(old_ready_json) != 1:
    raise SystemExit("readiness role JSON patch anchor mismatch")
source = source.replace(old_ready_json, new_ready_json, 1)

old_returning = """RETURNING t.id::text AS id, t.task_type, t.payload, t.attempt_count, t.max_attempts"""
new_returning = """RETURNING t.id::text AS id, t.task_type, t.payload::text AS payload, t.attempt_count, t.max_attempts"""
if source.count(old_returning) != 1:
    raise SystemExit("task-claim payload cast patch anchor mismatch")
source = source.replace(old_returning, new_returning, 1)

if "task.payload?.candidate" in source or "task.payload?.receipt" in source:
    raise SystemExit("un-normalized task payload access remains")

buffer = io.BytesIO()
with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as output:
    output.writestr("index.mjs", source.encode("utf-8"))

payload = buffer.getvalue()
output_path.write_bytes(payload)
print("PATCHED_FUNCTION_SHA256=" + hashlib.sha256(source.encode("utf-8")).hexdigest())
print("PATCHED_ZIP_BYTES=" + str(len(payload)))
print("PATCHED_FUNCTION_BASE64_BEGIN")
print(base64.b64encode(payload).decode("ascii"))
print("PATCHED_FUNCTION_BASE64_END")
