import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script=readFileSync(new URL('../google-apps-script/Code.gs',import.meta.url),'utf8');
const manifest=JSON.parse(readFileSync(new URL('../google-apps-script/appsscript.json',import.meta.url),'utf8'));
const patcher=readFileSync(new URL('../scripts/patch_neon_function_bundle.py',import.meta.url),'utf8');
const helper=readFileSync(new URL('../scripts/google_apps_script_oidc_auth.mjs',import.meta.url),'utf8');

test('Apps Script scheduler is owner-triggered and requests only required OIDC/external scopes',()=>{
  assert.ok(manifest.oauthScopes.includes('openid'));
  assert.ok(manifest.oauthScopes.includes('https://www.googleapis.com/auth/script.external_request'));
  assert.equal(manifest.oauthScopes.some(x=>x.includes('userinfo')),false);
  assert.ok(script.includes('ScriptApp.getIdentityToken()'));
  assert.ok(script.includes('everyMinutes(30)'));
  assert.ok(script.includes('ScriptApp.getProjectTriggers()'));
  assert.ok(script.includes('everyMinutes(30)'));
  assert.ok(script.includes('INSTALL_LOCK_BUSY'));
});

test('Apps Script keeps ID tokens ephemeral and never writes or logs token contents',()=>{
  assert.ok(script.includes('Authorization: \'Bearer \' + token'));
  assert.ok(script.includes('LockService.getScriptLock()'));
  assert.equal(script.includes('Logger.log(token)'),false);
  assert.equal(script.includes('Logger.log(idToken)'),false);
  assert.equal(script.includes("Logger.log('Bearer ' + token)"),false);
  assert.ok(script.includes('PropertiesService.getScriptProperties()'));
  assert.equal(script.includes('setProperty('),false);
  assert.equal(script.includes('Logger.log(PropertiesService'),false);
  assert.equal(script.includes('Logger.log(JSON.stringify(result))'),true);
});

test('Neon Function Google scheduler route is fail-closed and one-task bounded',()=>{
  assert.ok(patcher.includes('/internal/google/scheduler/dispatch'));
  assert.ok(patcher.includes('GOOGLE_APPS_SCRIPT_CLIENT_ID'));
  assert.ok(patcher.includes('GOOGLE_APPS_SCRIPT_OWNER_SUB_SHA256'));
  assert.ok(patcher.includes("GOOGLE_APPS_SCRIPT_SCHEDULER_ENABLED !== 'true'"));
  assert.ok(patcher.includes("governor_state !== 'RUNNING'"));
  assert.ok(patcher.includes('dispatch(1)'));
  assert.ok(helper.includes('timingSafeEqual'));
  assert.ok(helper.includes('subjectSha256'));
});

test('Google OIDC source never accepts a token without pinned owner-sub hash and client audience',()=>{
  assert.ok(helper.includes('typeof audience !== \'string\''));
  assert.ok(helper.includes('typeof subjectSha256 !== \'string\''));
  assert.ok(helper.includes('GOOGLE_OIDC_ISSUERS.has(claims?.iss)'));
  assert.ok(helper.includes('GOOGLE_OIDC_JWKS_URL'));
  assert.ok(helper.includes('return signatureValid ? true : deny(\'SIGNATURE_INVALID\')'));
  assert.equal(helper.includes('console.log'),false);
});

test('Apps Script distinguishes an authenticated-but-paused Function from a dispatch acknowledgement',()=>{
  assert.ok(script.includes("responseState === 'PAUSED'"));
  assert.ok(script.includes("responseState === 'DISPATCH_COMPLETE'"));
  assert.ok(script.includes("return 'SCHEDULER_PAUSED'"));
  assert.ok(script.includes("return 'DISPATCH_ACK'"));
  assert.ok(script.includes('response.getContentText()'));
});

test('identity preflight rejects unsupported issuer, non-text subject and incomplete timestamps',()=>{
  assert.ok(script.includes("payload.iss === 'https://accounts.google.com'"));
  assert.ok(script.includes("payload.iss === 'accounts.google.com'"));
  assert.ok(script.includes("Number.isFinite(Number(payload.iat))"));
  const printableAsciiPattern = '/' + '^[' + String.fromCharCode(92) + 'x20-' + String.fromCharCode(92) + 'x7E' + ']{1,255}$' + '/';
  assert.ok(script.includes(printableAsciiPattern));
});


test('each Apps Script tick carries a fresh UUID idempotency key and classifies duplicate responses',()=>{
  assert.ok(script.includes('const tickId = Utilities.getUuid()'));
  assert.ok(script.includes('JSON.stringify({ tick_id: tickId })'));
  assert.ok(script.includes("status === 409"));
  assert.ok(script.includes("return 'DUPLICATE_TICK'"));
});


test('scheduler trigger installation fails closed until every independent gate is explicitly true',()=>{
  const gates=[
    'P03_03_INDEPENDENT_WBS_ACCEPTED',
    'P03_03_GOOGLE_IDENTITY_PREFLIGHT_VERIFIED',
    'P03_03_FRESH_TOKEN_PER_TICK_VERIFIED',
    'P03_05_QUOTA_RECOVERY_COMPLETE',
    'GOOGLE_SCHEDULER_TRIGGER_APPROVED'
  ];
  const installStart=script.indexOf('function installSchedulerTrigger()');
  const lockStart=script.indexOf('const lock = LockService.getScriptLock()',installStart);
  const createStart=script.indexOf('ScriptApp.newTrigger(SCHEDULER_HANDLER)',installStart);
  assert.ok(installStart>=0);
  assert.ok(lockStart>installStart);
  assert.ok(createStart>lockStart);
  assert.ok(script.slice(installStart,lockStart).includes("if (!schedulerInstallGatesSatisfied()) return 'INSTALL_GATES_NOT_SATISFIED'"));
  assert.ok(script.includes('INSTALL_GATE_PROPERTIES.every('));
  for(const gate of gates) assert.ok(script.includes(gate),`missing explicit installation gate ${gate}`);
  assert.ok(script.includes("properties.getProperty(propertyName) === 'true'"));
  assert.equal(script.includes('PropertiesService.getScriptProperties().setProperty'),false);
});
