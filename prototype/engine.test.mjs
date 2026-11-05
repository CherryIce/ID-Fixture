import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  PROFILES, ENGINE_VERSION, PRNG, DATA_HASH, SNAPSHOT_CANONICAL, MAX_PACKAGE_BYTES,
  generate, validate, createPackage, inspectPackage, replayPackage,
} from './engine_legacy.mjs';

const cn = (overrides = {}) => ({ profileId: 'cn-id-demo', count: 1, seed: 'review-fixture', mode: 'positive', birthDate: '2000-02-29', sex: 'any', addressCode: '110101', ...overrides });
const ny = (overrides = {}) => ({ profileId: 'us-ny-dmv', count: 1, seed: 'review-fixture', mode: 'positive', ...overrides });
const passport = (overrides = {}) => ({ profileId: 'us-passport-ng', count: 1, seed: 'review-fixture', mode: 'positive', ...overrides });
const status = (checks, id) => checks.find(check => check.id === id)?.status;
const copy = value => JSON.parse(JSON.stringify(value));

test('registry is immutable and unverified Vietnam generation is unavailable', () => {
  assert.equal(PROFILES.find(profile => profile.id === 'vn-id').enabled, false);
  assert.throws(() => generate({ profileId: 'vn-id' }));
  assert.throws(() => validate('vn-id', 'test-only'));
  assert.throws(() => { PROFILES[0].enabled = false; });
  assert.throws(() => generate({ profileId: 'all-countries' }));
});

test('frozen snapshot digest matches its published canonical data', () => {
  assert.equal(DATA_HASH, `sha256:${createHash('sha256').update(SNAPSHOT_CANONICAL).digest('hex')}`);
});

test('official GB 11643 appendix example independently validates its X check character', () => {
  // Source: GB 11643-1999 Appendix A/B; public normative example, not a test identity.
  const officialVector = ['110105', '19491231', '002', 'X'].join('');
  const checks = validate('cn-id-demo', officialVector, { sex: 'female' });
  for (const id of ['length', 'charset', 'address', 'date', 'sequence', 'checksum', 'sex']) assert.equal(status(checks, id), 'pass', id);
  assert.equal(status(checks, 'issuance'), 'unknown');
  const changedCheck = officialVector.slice(0, -1) + '0';
  assert.equal(status(validate('cn-id-demo', changedCheck), 'checksum'), 'fail');
});

test('Gregorian century leap rules and generation date bounds are enforced', () => {
  assert.doesNotThrow(() => generate(cn({ birthDate: '2000-02-29' })));
  for (const birthDate of ['1900-02-29', '2001-02-29', '2020-04-31', '2020-00-01', '2020-01-00', '1899-12-31', '2026-01-01', '2020-1-01', 'not-a-date']) assert.throws(() => generate(cn({ birthDate })), birthDate);
  assert.doesNotThrow(() => generate(cn({ birthDate: '1900-01-01' })));
  assert.doesNotThrow(() => generate(cn({ birthDate: '2025-12-31' })));
});

test('calendar validator identifies an impossible date even with a syntactically legal ID', () => {
  const number = generate(cn()).cases[0].value;
  const mutated = number.slice(0, 6) + '19000229' + number.slice(14);
  assert.equal(status(validate('cn-id-demo', mutated), 'date'), 'fail');
  const unknownAddress = '999999' + number.slice(6);
  assert.equal(status(validate('cn-id-demo', unknownAddress), 'address'), 'unknown');
});

test('CN encoded sex and fixed address/date parameters govern a unique 100-case batch', () => {
  for (const sex of ['male', 'female', 'any']) {
    const batch = generate(cn({ count: 100, sex, addressCode: '110102' }));
    assert.equal(new Set(batch.cases.map(item => item.value)).size, 100);
    for (const item of batch.cases) {
      assert.equal(item.value.slice(0, 6), '110102');
      assert.equal(item.value.slice(6, 14), '20000229');
      assert.equal(item.expectedFailureIds.length, 0);
      assert.equal(status(item.checks, 'checksum'), 'pass');
      assert.equal(status(item.checks, 'issuance'), 'unknown');
      if (sex !== 'any') assert.equal(Number(item.value[16]) % 2, sex === 'male' ? 1 : 0);
    }
  }
});

test('all advertised positive formats generate without claiming real issuance', () => {
  for (const config of [cn({ count: 100 }), ny({ count: 100 }), passport({ count: 100 })]) {
    const batch = generate(config);
    assert.equal(batch.cases.length, 100);
    assert.equal(new Set(batch.cases.map(item => item.value)).size, 100);
    for (const item of batch.cases) {
      assert.equal(item.checks.filter(check => check.status === 'fail').length, 0);
      assert.equal(status(item.checks, 'issuance'), 'unknown');
      if (config.profileId === 'us-ny-dmv') assert.match(item.value, /^\d{9}$/);
      if (config.profileId === 'us-passport-ng') assert.match(item.value, /^[A-Z]\d{8}$/);
    }
  }
});

test('negative modes report every actual failing constraint, including coupled effects', () => {
  for (const profile of PROFILES.filter(profile => profile.enabled)) {
    const base = profile.id === 'cn-id-demo' ? cn() : profile.id === 'us-ny-dmv' ? ny() : passport();
    for (const mode of profile.modes.filter(mode => mode !== 'positive')) {
      const batch = generate({ ...base, mode, count: 100 });
      assert.equal(new Set(batch.cases.map(item => item.value)).size, 100);
      for (const item of batch.cases) {
        const failures = item.checks.filter(check => check.status === 'fail').map(check => check.id);
        assert.deepEqual(item.expectedFailureIds, failures);
        assert.ok(failures.length > 0);
        assert.ok(failures.includes(mode));
        assert.equal(status(item.checks, 'issuance'), 'unknown');
      }
    }
  }
});

test('generator and validator check the CN checksum through independent arithmetic', () => {
  const batch = generate(cn({ count: 100, seed: 'independent-checksum-oracle' }));
  for (const item of batch.cases) {
    // ISO congruence oracle, separate from generator lookup table.
    const digits = [...item.value].map(character => character === 'X' ? 10 : Number(character));
    const sum = digits.reduce((total, digit, index) => total + digit * (2 ** (17 - index) % 11), 0);
    assert.equal(sum % 11, 1);
  }
});

test('count, seed, mode, address and incompatible configuration are bounded', () => {
  for (const count of [0, -1, 101, 999999, 1.5, '2', NaN, Infinity]) assert.throws(() => generate(ny({ count })));
  for (const seed of ['', ' ', 'x'.repeat(65), 42, null]) assert.throws(() => generate(ny({ seed })));
  assert.throws(() => generate(cn({ sex: 'other' })));
  assert.throws(() => generate(cn({ addressCode: '110108' })));
  assert.throws(() => generate(ny({ mode: 'checksum' })));
  assert.throws(() => generate(ny({ birthDate: '2000-01-01' })));
  assert.throws(() => validate('cn-id-demo', 123));
  assert.throws(() => validate('cn-id-demo', 'x'.repeat(129)));
});

test('same complete configuration replays and different seeds vary the batch', () => {
  for (const config of [cn({ count: 10 }), ny({ count: 10 }), passport({ count: 10 })]) {
    assert.deepEqual(generate(config), generate(config));
    assert.notDeepEqual(generate(config).cases, generate({ ...config, seed: 'different' }).cases);
    const batch = generate(config);
    assert.equal(batch.meta.engineVersion, ENGINE_VERSION);
    assert.equal(batch.meta.prng, PRNG);
    assert.equal(batch.meta.dataHash, DATA_HASH);
  }
});

test('NY leading zero survives JSON export, inspection and replay as a string', () => {
  let batch;
  for (let index = 0; index < 1000; index += 1) {
    const candidate = generate(ny({ seed: `leading-zero-${index}` }));
    if (candidate.cases[0].value.startsWith('0')) { batch = candidate; break; }
  }
  assert.ok(batch);
  const inspected = inspectPackage(JSON.stringify(createPackage(batch)));
  assert.equal(typeof inspected.cases[0].value, 'string');
  assert.equal(inspected.cases[0].value.length, 9);
  assert.ok(inspected.cases[0].value.startsWith('0'));
  assert.equal(replayPackage(inspected).matches, true);
});

test('every enabled profile and negative mode round-trips through the exact package', () => {
  for (const profile of PROFILES.filter(profile => profile.enabled)) {
    const base = profile.id === 'cn-id-demo' ? cn() : profile.id === 'us-ny-dmv' ? ny() : passport();
    for (const mode of profile.modes) {
      const batch = generate({ ...base, mode, count: 3 });
      const pkg = createPackage(batch);
      const inspected = inspectPackage(JSON.stringify(pkg));
      const replay = replayPackage(inspected);
      assert.equal(replay.matches, true);
      assert.deepEqual(replay.differences, []);
      assert.deepEqual(replay.batch, batch);
    }
  }
});

test('semantically identical reordered JSON configuration is accepted', () => {
  const pkg = createPackage(generate(cn()));
  pkg.config = Object.fromEntries(Object.entries(pkg.config).reverse());
  assert.equal(replayPackage(inspectPackage(JSON.stringify(pkg))).matches, true);
});

test('wrong engine, profile, data or PRNG versions never silently upgrade', () => {
  const base = createPackage(generate(ny()));
  for (const field of ['engineVersion', 'prng', 'profileVersion', 'dataHash', 'profileId', 'schema', 'schemaVersion']) {
    const mutated = copy(base);
    mutated[field] = 'unavailable-version';
    assert.throws(() => inspectPackage(JSON.stringify(mutated)), field);
  }
});

test('tampered cases or expected statuses cannot become a passing replay', () => {
  const base = createPackage(generate(ny()));
  const changedValue = copy(base);
  changedValue.cases[0].value = changedValue.cases[0].value === '000000000' ? '111111111' : '000000000';
  assert.equal(replayPackage(inspectPackage(JSON.stringify(changedValue))).matches, false);
  const changedStatus = copy(base);
  changedStatus.cases[0].checks[0].status = 'fail';
  changedStatus.cases[0].expectedFailureIds = ['length'];
  const mismatch = replayPackage(inspectPackage(JSON.stringify(changedStatus)));
  assert.equal(mismatch.matches, false);
  assert.ok(mismatch.differences.length >= 2);
  assert.throws(() => createPackage({ ...generate(ny()), cases: changedValue.cases }));
});

test('malformed, oversized and unexpected file data are rejected without execution', () => {
  for (const text of ['', '{', 'null', '[]', '42', 'x'.repeat(MAX_PACKAGE_BYTES + 1)]) assert.throws(() => inspectPackage(text));
  const base = createPackage(generate(ny()));
  for (const mutate of [
    pkg => { pkg.cases = []; },
    pkg => { pkg.cases = Array(101).fill(pkg.cases[0]); pkg.config.count = 101; },
    pkg => { pkg.cases[0].value = 123; },
    pkg => { pkg.synthetic = false; },
    pkg => { pkg.issuanceChecked = true; },
    pkg => { pkg.url = 'https://example.invalid'; },
    pkg => { pkg.code = 'globalThis.shouldNeverRun = true'; },
    pkg => { pkg.cases[0].checks[0].labelZh = '<script>run()</script>'; },
    pkg => { pkg.cases[0].expectedFailureIds = ['invented-rule']; },
    pkg => { delete pkg.config.count; },
    pkg => { pkg.exportedAt = 'yesterday'; },
  ]) {
    const mutated = copy(base); mutate(mutated);
    assert.throws(() => inspectPackage(JSON.stringify(mutated)));
  }
  assert.equal(globalThis.shouldNeverRun, undefined);
  const pollution = JSON.stringify(base).replace('"config":{', '"config":{"__proto__":{"polluted":true},');
  assert.throws(() => inspectPackage(pollution));
  assert.equal({}.polluted, undefined);
});
