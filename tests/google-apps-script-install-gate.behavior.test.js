import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../google-apps-script/Code.gs', import.meta.url), 'utf8');
const GATES = [
  'P03_03_INDEPENDENT_WBS_ACCEPTED',
  'P03_03_GOOGLE_IDENTITY_PREFLIGHT_VERIFIED',
  'P03_03_FRESH_TOKEN_PER_TICK_VERIFIED',
  'P03_05_QUOTA_RECOVERY_COMPLETE',
  'GOOGLE_SCHEDULER_TRIGGER_APPROVED'
];

function createHarness({ properties = {}, existingTriggers = [], lockAvailable = true } = {}) {
  const calls = {
    lockAttempts: 0,
    releases: 0,
    listTriggers: 0,
    created: [],
    propertyWrites: 0
  };
  const scriptProperties = {
    getProperty(name) {
      return Object.prototype.hasOwnProperty.call(properties, name) ? properties[name] : null;
    },
    setProperty() {
      calls.propertyWrites += 1;
      throw new Error('TEST_PROPERTY_STORE_MUST_NOT_BE_MUTATED');
    }
  };
  const context = vm.createContext({
    PropertiesService: {
      getScriptProperties: () => scriptProperties
    },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => {
          calls.lockAttempts += 1;
          return lockAvailable;
        },
        releaseLock: () => {
          calls.releases += 1;
        }
      })
    },
    ScriptApp: {
      getProjectTriggers: () => {
        calls.listTriggers += 1;
        return existingTriggers.map(handler => ({ getHandlerFunction: () => handler }));
      },
      newTrigger: handler => ({
        timeBased: () => ({
          everyMinutes: minutes => ({
            create: () => {
              calls.created.push({ handler, minutes });
              return { getHandlerFunction: () => handler };
            }
          })
        })
      })
    }
  });
  vm.runInContext(source, context, { filename: 'google-apps-script/Code.gs' });
  return { install: () => context.installSchedulerTrigger(), calls };
}

test('missing properties fail closed before a lock or trigger API is touched', () => {
  const h = createHarness();
  assert.equal(h.install(), 'INSTALL_GATES_NOT_SATISFIED');
  assert.equal(h.calls.lockAttempts, 0);
  assert.equal(h.calls.listTriggers, 0);
  assert.equal(h.calls.created.length, 0);
  assert.equal(h.calls.propertyWrites, 0);
});

test('one false or absent gate blocks installation even when the other four are true', () => {
  for (const missingGate of GATES) {
    const properties = Object.fromEntries(GATES.map(gate => [gate, 'true']));
    properties[missingGate] = 'false';
    const h = createHarness({ properties });
    assert.equal(h.install(), 'INSTALL_GATES_NOT_SATISFIED', missingGate);
    assert.equal(h.calls.lockAttempts, 0, missingGate);
    assert.equal(h.calls.created.length, 0, missingGate);
  }
  const absent = Object.fromEntries(GATES.filter((_, i) => i !== 3).map(gate => [gate, 'true']));
  const h = createHarness({ properties: absent });
  assert.equal(h.install(), 'INSTALL_GATES_NOT_SATISFIED');
  assert.equal(h.calls.created.length, 0);
});

test('all five explicit gates permit exactly one 30-minute scheduler trigger', () => {
  const properties = Object.fromEntries(GATES.map(gate => [gate, 'true']));
  const h = createHarness({ properties });
  assert.equal(h.install(), 'INSTALLED_30_MINUTE_TRIGGER');
  assert.deepEqual(h.calls.created, [{ handler: 'schedulerTick', minutes: 30 }]);
  assert.equal(h.calls.lockAttempts, 1);
  assert.equal(h.calls.releases, 1);
  assert.equal(h.calls.propertyWrites, 0);
});

test('an existing scheduler trigger is not duplicated', () => {
  const properties = Object.fromEntries(GATES.map(gate => [gate, 'true']));
  const h = createHarness({ properties, existingTriggers: ['schedulerTick'] });
  assert.equal(h.install(), 'ALREADY_INSTALLED');
  assert.equal(h.calls.created.length, 0);
  assert.equal(h.calls.listTriggers, 1);
  assert.equal(h.calls.releases, 1);
});

test('lock contention stops trigger installation without listing or creating triggers', () => {
  const properties = Object.fromEntries(GATES.map(gate => [gate, 'true']));
  const h = createHarness({ properties, lockAvailable: false });
  assert.equal(h.install(), 'INSTALL_LOCK_BUSY');
  assert.equal(h.calls.listTriggers, 0);
  assert.equal(h.calls.created.length, 0);
  assert.equal(h.calls.releases, 0);
});
