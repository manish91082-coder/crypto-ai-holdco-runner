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
  assert.equal(script.includes('PropertiesService'),false);
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
  assert.ok(script.includes("/^[\\\\x20-\\\\x7E]{1,255}$/"));
});
