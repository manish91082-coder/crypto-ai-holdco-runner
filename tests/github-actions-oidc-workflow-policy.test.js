import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/runtime-pilot-ci.yml', import.meta.url), 'utf8');
const verifier = readFileSync(new URL('../scripts/github_actions_oidc_auth.mjs', import.meta.url), 'utf8');
const patcher = readFileSync(new URL('../scripts/patch_neon_function_bundle.py', import.meta.url), 'utf8');

test('OIDC workflow token permission is limited to this workflow job', () => {
  assert.ok(workflow.includes('id-token: write'));
  assert.ok(workflow.includes("audience = 'https://crypto-ai-holdco.invalid/ci-metrics-read'"));
  assert.ok(workflow.includes("response.status !== 200"));
  assert.ok(workflow.includes("process.env.FUNCTION_URL + '/v1/metrics'"));
  assert.ok(workflow.includes("method: 'GET'"));
});

test('live positive OIDC canary is explicitly staged and cannot run on pull requests', () => {
  assert.ok(workflow.includes("if: github.event_name == 'push' && contains(github.event.head_commit.message, 'enable-oidc-live-canary')"));
  assert.ok(workflow.includes("push_event: claims.event_name === 'push'"));
  assert.ok(workflow.includes("hosted_runner: claims.runner_environment === 'github-hosted'"));
});

test('verifier pins immutable repository and workflow identity', () => {
  assert.ok(verifier.includes("GITHUB_OIDC_SUBJECT"));
  assert.ok(verifier.includes("GITHUB_OIDC_WORKFLOW_REF"));
  assert.ok(verifier.includes("String(claims?.repository_id ?? '') === '1468220353'"));
  assert.ok(verifier.includes("String(claims?.repository_owner_id ?? '') === '283637475'"));
  assert.ok(verifier.includes("claims?.event_name === 'push'"));
  assert.ok(verifier.includes("claims?.runner_environment === 'github-hosted'"));
});

test('OIDC is not a general API key and is accepted only for metrics:read', () => {
  assert.ok(patcher.includes("requiredScope === 'metrics:read' && await verifyGithubActionsOidc"));
  assert.ok(patcher.includes("'github-actions:repo:1468220353'"));
  assert.ok(verifier.includes("redirect: 'error'"));
  assert.ok(verifier.includes("return signatureValid ? true : deny('SIGNATURE_INVALID')"));
});

test('live OIDC canary verifies write and A2A scope escalation is denied', () => {
  assert.ok(workflow.includes("process.env.FUNCTION_URL + '/v1/tasks'"));
  assert.ok(workflow.includes("OIDC task-write escalation should be denied"));
  assert.ok(workflow.includes("process.env.FUNCTION_URL + '/a2a/v1/messages'"));
  assert.ok(workflow.includes("OIDC A2A escalation should be denied"));
});

test('token or claim content is never written to logs', () => {
  assert.equal(verifier.includes('console.log'), false);
  assert.equal(verifier.includes('console.error'), false);
  assert.ok(patcher.includes("console.info('GITHUB_OIDC_METRICS_AUTH_DENIED', reason)"));
  assert.ok(patcher.includes("console.info('GITHUB_OIDC_METRICS_AUTH_ACCEPTED', 'repo:1468220353')"));
});

// This controlled push also runs the staged read-only OIDC HTTP canary after verifier deployment.

test('positive metrics response checks only schema presence, not provider numeric wire types', () => {
  assert.ok(workflow.includes("Object.prototype.hasOwnProperty.call(body, 'agent_messages')"));
  assert.equal(workflow.includes('Number.isSafeInteger(body?.tasks?.total)'), false);
});

test('OIDC metrics identity cannot read agents, run demos, read tasks or write A2A/tasks', () => {
  for (const route of [
    "process.env.FUNCTION_URL + '/v1/agents'",
    "process.env.FUNCTION_URL + '/v1/demo'",
    "process.env.FUNCTION_URL + '/v1/tasks/00000000-0000-4000-8000-000000000000'",
    "process.env.FUNCTION_URL + '/v1/tasks'",
    "process.env.FUNCTION_URL + '/a2a/v1/messages'"
  ]) assert.ok(workflow.includes(route), `missing scope-denial probe: ${route}`);
  assert.ok(workflow.includes('OIDC agents:read escalation should be denied'));
  assert.ok(workflow.includes('OIDC demo:run escalation should be denied'));
  assert.ok(workflow.includes('OIDC tasks:read:own escalation should be denied'));
});


test('OIDC verifier binds canary identity to signed run_id and run_attempt claims', () => {
  assert.ok(verifier.includes('claims?.run_id'));
  assert.ok(verifier.includes('claims?.run_attempt'));
  assert.ok(verifier.includes('CLAIM_RUN_ID'));
  assert.ok(verifier.includes('CLAIM_RUN_ATTEMPT'));
  assert.ok(patcher.includes('/internal/ci/auth-canary/issue'));
  assert.ok(patcher.includes('/internal/ci/auth-canary/revoke'));
});

test('workflow proves the standard app-token validator over HTTP and revokes its canary', () => {
  assert.ok(workflow.includes("process.env.FUNCTION_URL + '/internal/ci/auth-canary/issue'"));
  assert.ok(workflow.includes("process.env.FUNCTION_URL + '/internal/ci/auth-canary/revoke'"));
  assert.ok(workflow.includes('runtime API token canary HTTP 200'));
  assert.ok(workflow.includes('runtime API canary revocation verified'));
  assert.equal(workflow.includes('console.log(appToken'), false);
});
