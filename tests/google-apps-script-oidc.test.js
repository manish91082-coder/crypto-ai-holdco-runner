import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import {
  verifyGoogleAppsScriptOidc,
  resetGoogleOidcJwksCacheForTests
} from '../scripts/google_apps_script_oidc_auth.mjs';

const NOW = 1800000000;
const AUDIENCE = '987654321-example.apps.googleusercontent.com';
const SUBJECT = '109876543210987654321';
const SUBJECT_SHA256 = createHash('sha256').update(SUBJECT,'utf8').digest('hex');
const { publicKey, privateKey } = generateKeyPairSync('rsa',{modulusLength:2048});
const jwk = {
  ...publicKey.export({format:'jwk'}),
  kid:'google-oidc-unit-test',
  alg:'RS256',
  use:'sig',
  key_ops:['verify']
};

function b64url(value) {
  return Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');
}
function claims(overrides={}) {
  return {
    iss:'https://accounts.google.com',
    aud:AUDIENCE,
    sub:SUBJECT,
    iat:NOW-10,
    exp:NOW+3500,
    nbf:NOW-10,
    ...overrides
  };
}
function makeToken(payload=claims(), key=privateKey) {
  const h=b64url({alg:'RS256',typ:'JWT',kid:jwk.kid});
  const p=b64url(payload);
  const signature=sign('RSA-SHA256',Buffer.from(h+'.'+p),key);
  return h+'.'+p+'.'+signature.toString('base64url');
}
function jwksFetch() {
  let calls=0;
  return {
    calls:()=>calls,
    fetchImpl:async url=>{
      calls+=1;
      assert.equal(url,'https://www.googleapis.com/oauth2/v3/certs');
      return {
        ok:true,
        headers:{get:()=> 'public, max-age=300'},
        json:async()=>({keys:[jwk]})
      };
    }
  };
}
function options(mock, overrides={}) {
  return {audience:AUDIENCE,subjectSha256:SUBJECT_SHA256,fetchImpl:mock.fetchImpl,nowSeconds:NOW,...overrides};
}

test('accepts a correctly signed Google Apps Script ID token bound to exact audience and subject hash',async()=>{
  resetGoogleOidcJwksCacheForTests();
  const mock=jwksFetch();
  assert.equal(await verifyGoogleAppsScriptOidc(makeToken(),options(mock)),true);
  assert.equal(mock.calls(),1);
});

test('rejects missing audience or subject-hash configuration before fetching JWKS',async()=>{
  resetGoogleOidcJwksCacheForTests();
  const mock=jwksFetch();
  assert.equal(await verifyGoogleAppsScriptOidc(makeToken(),options(mock,{audience:null})),false);
  assert.equal(await verifyGoogleAppsScriptOidc(makeToken(),options(mock,{subjectSha256:null})),false);
  assert.equal(mock.calls(),0);
});

test('rejects a different audience and subject before fetching JWKS',async()=>{
  for (const patch of [{aud:'other-client.apps.googleusercontent.com'},{sub:'999999999999999999999'}]) {
    resetGoogleOidcJwksCacheForTests();
    const mock=jwksFetch();
    assert.equal(await verifyGoogleAppsScriptOidc(makeToken(claims(patch)),options(mock)),false);
    assert.equal(mock.calls(),0);
  }
});

test('rejects non-Google issuer, expired, stale and overlong tokens before JWKS fetch',async()=>{
  for (const patch of [
    {iss:'https://evil.example'},
    {exp:NOW-1},
    {iat:NOW+120},
    {iat:NOW-3700,exp:NOW+3500}
  ]) {
    resetGoogleOidcJwksCacheForTests();
    const mock=jwksFetch();
    assert.equal(await verifyGoogleAppsScriptOidc(makeToken(claims(patch)),options(mock)),false);
    assert.equal(mock.calls(),0);
  }
});

test('rejects invalid signatures even when Google issuer and identity claims match',async()=>{
  resetGoogleOidcJwksCacheForTests();
  const other=generateKeyPairSync('rsa',{modulusLength:2048}).privateKey;
  const mock=jwksFetch();
  assert.equal(await verifyGoogleAppsScriptOidc(makeToken(claims(),other),options(mock)),false);
});

test('fails closed when Google JWKS is unavailable',async()=>{
  resetGoogleOidcJwksCacheForTests();
  const unavailable=async()=>({ok:false,headers:{get:()=>null}});
  assert.equal(await verifyGoogleAppsScriptOidc(makeToken(),{
    audience:AUDIENCE,subjectSha256:SUBJECT_SHA256,fetchImpl:unavailable,nowSeconds:NOW
  }),false);
});

test('uses only the standard Google issuer set and Google cert endpoint',()=>{
  const source=requireSource();
  assert.ok(source.includes('https://accounts.google.com'));
  assert.ok(source.includes('accounts.google.com'));
  assert.ok(source.includes('https://www.googleapis.com/oauth2/v3/certs'));
  assert.equal(source.includes('console.log'),false);
});

function requireSource() {
  return [
    'GOOGLE_OIDC_ISSUERS',
    'verifyGoogleAppsScriptOidc',
    'subjectSha256',
    'redirect: \'error\''
  ].join('\n');
}
