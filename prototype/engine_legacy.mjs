// Frozen 1.0.0 rules for exact replay of existing packages.
// A local test-data prototype. No lookup, issuance or identity verification occurs.
export const ENGINE_VERSION = '1.0.0';
export const PRNG = 'fnv1a32-seeded-mulberry32-v1';
export const AS_OF = '2026-11-04';
export const MAX_PACKAGE_BYTES = 1024 * 1024;
export const SNAPSHOT_CANONICAL = 'IDFIXTURE|engine:1.0.0|cn:GB11643-1999:demo-2022:110101,110102,110105|ny:dmv-id:9digits|us:ng-passport-book:A-Z+8digits|asof:2026-11-04';
export const DATA_HASH = 'sha256:d4f79e09d7b2a746842b72357ed8bd438ef640eab9f318afd21f56d7452d07c1';

const cnSource = 'https://zjw.beijing.gov.cn/Portals/0/zhuanti/fazhan/%E8%BA%AB%E4%BB%BD%E8%AF%81GB11643-1999.pdf';
const addressSource = 'https://mzj.beijing.gov.cn/art/2023/6/12/art_9984_644480.html';
const profileData = [
  {
    id: 'cn-id-demo', country: 'CN', documentType: 'national-id',
    nameZh: '公民身份号码', nameEn: 'Citizen ID number', enabled: true, available: true,
    fidelity: 'demo', version: 'gb11643-1999-demo-2022-v1',
    coverageZh: '小范围演示 · 北京地区代码快照', coverageEn: 'Limited demo · Beijing code snapshot',
    modes: ['positive', 'length', 'charset', 'checksum'],
    addressCodes: [
      { code: '110101', nameZh: '北京市东城区', nameEn: 'Dongcheng, Beijing' },
      { code: '110102', nameZh: '北京市西城区', nameEn: 'Xicheng, Beijing' },
      { code: '110105', nameZh: '北京市朝阳区', nameEn: 'Chaoyang, Beijing' },
    ],
    constraints: ['length', 'charset', 'address', 'date', 'sequence', 'checksum', 'sex', 'issuance'],
    sources: [
      { title: 'GB 11643-1999 · 官方托管标准全文', url: cnSource },
      { title: '北京市民政局 · 2022年行政区划代码（2023-06-12发布）', url: addressSource },
    ],
    limitationsZh: '只采用2022年北京3个代码的固定演示快照，不覆盖全国或历史代码。生日1900–2025、顺序001–999是本原型的测试范围。通过检查不代表已签发，也不保证不会与真实号码重合。',
    limitationsEn: 'Fixed demo snapshot of three Beijing codes from 2022; no nationwide or historical coverage. Years 1900–2025 and sequences 001–999 are prototype test limits. Passing does not establish issuance or prevent a collision with a real number.',
  },
  {
    id: 'us-ny-dmv', country: 'US', documentType: 'driver-license',
    nameZh: '纽约州驾照 · DMV ID', nameEn: 'New York licence · DMV ID', enabled: true, available: true,
    fidelity: 'format', version: 'ny-dmv-id-format-20261104-v1',
    coverageZh: '纽约州 · 仅9位数字格式', coverageEn: 'New York · nine-digit format only',
    modes: ['positive', 'length', 'charset'], constraints: ['length', 'charset', 'issuance'],
    sources: [{ title: 'New York DMV · Information about Transaction Entries', url: 'https://dmv.ny.gov/transaction-message/information-about-transaction-entries' }],
    limitationsZh: '仅检查9位数字，不检查发号算法。DMV ID与同卡document number不同，不适用于全美。真实签发及持有人未知。',
    limitationsEn: 'Checks nine digits only, not an issuance algorithm. DMV ID is separate from the document number and is not a nationwide format. Issuance and holder are unknown.',
  },
  {
    id: 'us-passport-ng', country: 'US', documentType: 'passport',
    nameZh: '新一代护照本号码', nameEn: 'Next Generation Passport Book', enabled: true, available: true,
    fidelity: 'format', version: 'us-ng-book-format-20261104-v1',
    coverageZh: '新一代护照本 · 仅字母加8位数字', coverageEn: 'Next Generation book · letter plus eight digits',
    modes: ['positive', 'length', 'charset'], constraints: ['length', 'charset', 'issuance'],
    sources: [{ title: 'U.S. Department of State · Design and Security of our Documents', url: 'https://travel.state.gov/en/passports/apply/help/security-design.html' }],
    limitationsZh: '只演示公开的字母加8位数字结构，A–Z为格式测试字符集，不代表每个前缀实际用于该类护照。不覆盖护照卡、旧版或实际签发检查。',
    limitationsEn: 'Demonstrates the published letter-plus-eight-digits structure. A–Z is a format-test alphabet, not evidence that every prefix is issued for this passport type. Excludes passport cards, older formats and issuance checks.',
  },
  {
    id: 'vn-id', country: 'VN', documentType: 'national-id', nameZh: '个人身份号码', nameEn: 'Personal identification number',
    enabled: false, available: false, fidelity: 'not_connected', version: 'unverified',
    coverageZh: '现行完整规则待核实', coverageEn: 'Current complete rules pending verification',
    modes: [], constraints: [],
    sources: [{ title: '越南政府公报 · 118/2026/TT-BCA', url: 'https://congbao.chinhphu.vn/van-ban/thong-tu-so-118-2026-tt-bca-470080.htm' }],
    limitationsZh: '基础12位结构有官方说明；现行完整正文与代码表未核全，本原型不生成越南号码。',
    limitationsEn: 'Official material describes a 12-digit structure; current complete text and code tables remain unverified. Generation is disabled.',
  },
];

function deepFreeze(value) {
  Object.freeze(value);
  for (const item of Object.values(value)) if (item && typeof item === 'object' && !Object.isFrozen(item)) deepFreeze(item);
  return value;
}
export const PROFILES = deepFreeze(profileData);
const CHECKS = deepFreeze({
  length: ['长度符合规则', 'Length matches the rule'],
  charset: ['字符组成符合规则', 'Character structure matches the rule'],
  address: ['属于本演示地区快照', 'Included in this demo code snapshot'],
  date: ['出生日期为有效日历日期', 'Birth date is a valid calendar date'],
  sequence: ['演示顺序码001–999', 'Demo sequence is 001–999'],
  checksum: ['MOD 11-2校验位', 'MOD 11-2 check character'],
  sex: ['编码性别符合所选测试参数', 'Encoded sex matches the selected test parameter'],
  issuance: ['真实签发、持有人及有效状态', 'Actual issuance, holder and validity'],
});
const clone = value => JSON.parse(JSON.stringify(value));
const error = (zh, en) => new Error(`${zh} / ${en}`);
function profileFor(id) {
  const profile = PROFILES.find(item => item.id === id);
  if (!profile) throw error('未知规则档案', 'Unknown rule profile');
  return profile;
}
function plainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}
function exactKeys(object, allowed, required = allowed) {
  if (!plainObject(object) || Object.keys(object).some(key => !allowed.includes(key)) || required.some(key => !Object.hasOwn(object, key))) {
    throw error('文件字段或结构不符合本产品格式', 'Unexpected package fields or structure');
  }
}
function check(id, status) { return { id, status, labelZh: CHECKS[id][0], labelEn: CHECKS[id][1] }; }
function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const days = [31, year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

function normalizeConfig(input) {
  if (!plainObject(input)) throw error('配置必须为对象', 'Configuration must be an object');
  const profile = profileFor(input.profileId);
  if (!profile.enabled) throw error('该规则仍待核实，暂不生成', 'This rule remains unverified; generation is disabled');
  const isCn = profile.id === 'cn-id-demo';
  const allowed = ['profileId', 'count', 'seed', 'mode', ...(isCn ? ['birthDate', 'sex', 'addressCode'] : [])];
  exactKeys(input, allowed, ['profileId']);
  const count = input.count === undefined ? 1 : input.count;
  const seed = input.seed === undefined ? 'fixture-01' : input.seed;
  const mode = input.mode === undefined ? 'positive' : input.mode;
  if (!Number.isInteger(count) || count < 1 || count > 100) throw error('生成数量须为1–100的整数', 'Count must be an integer from 1 to 100');
  if (typeof seed !== 'string' || seed.length < 1 || seed.length > 64 || !seed.trim()) throw error('复现种子须为1–64个字符', 'Seed must contain 1–64 characters');
  if (!profile.modes.includes(mode)) throw error('此规则不支持所选测试模式', 'Unsupported test mode for this profile');
  const config = { profileId: profile.id, count, seed, mode };
  if (isCn) {
    const birthDate = input.birthDate === undefined ? '2000-01-01' : input.birthDate;
    const addressCode = input.addressCode === undefined ? '110101' : input.addressCode;
    const sex = input.sex === undefined ? 'any' : input.sex;
    if (!validDate(birthDate) || birthDate < '1900-01-01' || birthDate > '2025-12-31') throw error('合成生日须为1900–2025内的有效日期', 'Synthetic birth date must be valid and within 1900–2025');
    if (!profile.addressCodes.some(item => item.code === addressCode)) throw error('地区不在固定演示快照内', 'Address is not in the fixed demo snapshot');
    if (!['any', 'male', 'female'].includes(sex)) throw error('编码性别参数无效', 'Invalid encoded-sex parameter');
    Object.assign(config, { birthDate, sex, addressCode });
  }
  return config;
}

function randomFor(seed) {
  let state = 2166136261;
  for (const character of seed) {
    state ^= character.codePointAt(0);
    state = Math.imul(state, 16777619) >>> 0;
  }
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
function makeCheckCharacter(base) {
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const total = [...base].reduce((sum, character, index) => sum + Number(character) * weights[index], 0);
  return '10X98765432'[total % 11];
}

/** Returns checks only for documented constraints; unknown issuance is never promoted. */
export function validate(profileId, value, context = {}) {
  const profile = profileFor(profileId);
  if (!profile.enabled) throw error('该档案尚未启用', 'This profile is disabled');
  if (typeof value !== 'string' || value.length > 128) throw error('号码必须为不超过128字符的字符串', 'Value must be a string of at most 128 characters');
  const lengthOk = value.length === (profileId === 'cn-id-demo' ? 18 : 9);
  const checks = [check('length', lengthOk ? 'pass' : 'fail')];
  if (profileId !== 'cn-id-demo') {
    const format = profileId === 'us-ny-dmv' ? /^\d+$/ : /^[A-Z]\d*$/;
    checks.push(check('charset', format.test(value) ? 'pass' : 'fail'));
  } else {
    const characterOk = /^\d{17}[\dX]$/.test(value);
    checks.push(check('charset', characterOk ? 'pass' : 'fail'));
    const hasPositions = lengthOk && characterOk;
    checks.push(check('address', hasPositions ? (profile.addressCodes.some(item => item.code === value.slice(0, 6)) ? 'pass' : 'unknown') : 'unknown'));
    const date = `${value.slice(6, 10)}-${value.slice(10, 12)}-${value.slice(12, 14)}`;
    checks.push(check('date', hasPositions ? (validDate(date) && date <= AS_OF ? 'pass' : 'fail') : 'unknown'));
    checks.push(check('sequence', hasPositions ? (value.slice(14, 17) !== '000' ? 'pass' : 'fail') : 'unknown'));
    // Independent from generation: validate the full weighted MOD 11-2 congruence.
    let checksumOk = false;
    if (hasPositions) {
      let sum = 0;
      for (let index = 0; index < 18; index += 1) {
        const digit = value[index] === 'X' ? 10 : Number(value[index]);
        sum += digit * (2 ** (17 - index) % 11);
      }
      checksumOk = sum % 11 === 1;
    }
    checks.push(check('checksum', hasPositions ? (checksumOk ? 'pass' : 'fail') : 'unknown'));
    if (context.sex && context.sex !== 'any') {
      const matches = context.sex === 'male' ? Number(value[16]) % 2 === 1 : Number(value[16]) % 2 === 0;
      checks.push(check('sex', hasPositions ? (matches ? 'pass' : 'fail') : 'unknown'));
    }
  }
  checks.push(check('issuance', 'unknown'));
  return checks;
}

export function generate(input) {
  const config = normalizeConfig(input);
  const profile = profileFor(config.profileId);
  const random = randomFor(`${PRNG}|${profile.id}|${config.seed}`);
  const sequences = [];
  if (profile.id === 'cn-id-demo') {
    for (let sequence = 1; sequence <= 999; sequence += 1) {
      if (config.sex === 'any' || (config.sex === 'male' ? sequence % 2 === 1 : sequence % 2 === 0)) sequences.push(sequence);
    }
    if (config.count > sequences.length) throw error('请求数量超出演示组合容量', 'Requested count exceeds demo capacity');
    for (let index = sequences.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [sequences[index], sequences[other]] = [sequences[other], sequences[index]];
    }
  }
  const cases = [];
  const seen = new Set();
  let attempts = 0;
  while (cases.length < config.count) {
    if (++attempts > 10000) throw error('无法在限定次数内生成唯一批次，请更换参数', 'Unique-batch attempt limit reached; change parameters');
    let value;
    if (profile.id === 'cn-id-demo') {
      const sequence = String(sequences[cases.length]).padStart(3, '0');
      const base = config.addressCode + config.birthDate.replaceAll('-', '') + sequence;
      value = base + makeCheckCharacter(base);
    } else {
      const digits = Array.from({ length: profile.id === 'us-ny-dmv' ? 9 : 8 }, () => Math.floor(random() * 10)).join('');
      value = profile.id === 'us-ny-dmv' ? digits : String.fromCharCode(65 + Math.floor(random() * 26)) + digits;
    }
    if (config.mode === 'length') value = value.slice(0, -1);
    if (config.mode === 'charset') value = `!${value.slice(1)}`;
    if (config.mode === 'checksum') value = value.slice(0, -1) + (value.at(-1) === '0' ? '1' : '0');
    if (seen.has(value)) continue;
    seen.add(value);
    const checks = validate(profile.id, value, config);
    const expectedFailureIds = checks.filter(item => item.status === 'fail').map(item => item.id);
    if ((config.mode === 'positive') !== (expectedFailureIds.length === 0)) throw error('内部生成结果与测试场景不一致', 'Generated result does not match the selected test scenario');
    cases.push({ value, checks, expectedFailureIds });
  }
  return {
    profileId: profile.id, config, cases,
    meta: { engineVersion: ENGINE_VERSION, profileVersion: profile.version, dataHash: DATA_HASH, prng: PRNG, synthetic: true, issuanceChecked: false, asOf: AS_OF, fidelity: profile.fidelity },
  };
}

export function createPackage(batch) {
  if (!plainObject(batch)) throw error('缺少可导出的批次', 'No batch to export');
  const regenerated = generate(batch.config);
  if (!sameCases(batch.cases, regenerated.cases)) throw error('批次与锁定配置不一致，不能导出', 'Batch does not match its locked configuration');
  return {
    schema: 'id-fixture-package', schemaVersion: 1, engineVersion: ENGINE_VERSION,
    prng: PRNG, profileId: regenerated.profileId, profileVersion: regenerated.meta.profileVersion,
    dataHash: DATA_HASH, synthetic: true, issuanceChecked: false,
    config: clone(regenerated.config), cases: clone(regenerated.cases), exportedAt: new Date().toISOString(),
  };
}
function sameChecks(a, b) {
  return Array.isArray(a) && a.length === b.length && a.every((item, index) => item.id === b[index].id && item.status === b[index].status);
}
function sameCases(a, b) {
  return Array.isArray(a) && a.length === b.length && a.every((item, index) => item.value === b[index].value && sameChecks(item.checks, b[index].checks) && JSON.stringify(item.expectedFailureIds) === JSON.stringify(b[index].expectedFailureIds));
}
function validatePackage(pkg) {
  exactKeys(pkg, ['schema', 'schemaVersion', 'engineVersion', 'prng', 'profileId', 'profileVersion', 'dataHash', 'synthetic', 'issuanceChecked', 'config', 'cases', 'exportedAt']);
  if (pkg.schema !== 'id-fixture-package' || pkg.schemaVersion !== 1 || pkg.synthetic !== true || pkg.issuanceChecked !== false) throw error('不是受支持的合成用例包', 'Not a supported synthetic fixture package');
  const profile = profileFor(pkg.profileId);
  if (!profile.enabled || pkg.engineVersion !== ENGINE_VERSION || pkg.prng !== PRNG || pkg.profileVersion !== profile.version || pkg.dataHash !== DATA_HASH) throw error('精确规则、引擎、随机算法版本或数据哈希不匹配', 'Exact rule, engine, PRNG version or data hash mismatch');
  const config = normalizeConfig(pkg.config);
  if (config.profileId !== pkg.profileId || Object.keys(config).length !== Object.keys(pkg.config).length || Object.entries(config).some(([key, value]) => pkg.config[key] !== value)) throw error('配置缺失或内容与锁定格式不符', 'Configuration is incomplete or differs from the locked format');
  if (!Array.isArray(pkg.cases) || pkg.cases.length !== config.count || pkg.cases.length < 1 || pkg.cases.length > 100) throw error('用例条数与配置不符或超限', 'Case count differs from configuration or exceeds the limit');
  if (typeof pkg.exportedAt !== 'string' || pkg.exportedAt.length > 40 || !Number.isFinite(Date.parse(pkg.exportedAt))) throw error('导出时间字段无效', 'Invalid export timestamp');
  for (const entry of pkg.cases) {
    exactKeys(entry, ['value', 'checks', 'expectedFailureIds']);
    if (typeof entry.value !== 'string' || entry.value.length < 1 || entry.value.length > 128 || !Array.isArray(entry.checks) || entry.checks.length > 8 || !Array.isArray(entry.expectedFailureIds) || entry.expectedFailureIds.length > 8) throw error('用例字段无效或超限', 'Invalid or oversized case fields');
    const ids = new Set();
    for (const item of entry.checks) {
      exactKeys(item, ['id', 'status', 'labelZh', 'labelEn']);
      if (!Object.hasOwn(CHECKS, item.id) || !profile.constraints.includes(item.id) || !['pass', 'fail', 'unknown'].includes(item.status) || ids.has(item.id) || item.labelZh !== CHECKS[item.id][0] || item.labelEn !== CHECKS[item.id][1]) throw error('检查项不属于该规则或被修改', 'Check does not belong to this rule or was modified');
      ids.add(item.id);
    }
    if (entry.expectedFailureIds.some(id => typeof id !== 'string' || !ids.has(id)) || new Set(entry.expectedFailureIds).size !== entry.expectedFailureIds.length) throw error('预期失败项无效', 'Invalid expected-failure identifiers');
  }
  return clone(pkg);
}

export function inspectPackage(text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).byteLength > MAX_PACKAGE_BYTES) throw error('用例包必须为不超过1MB的JSON文本', 'Fixture package must be JSON text no larger than 1 MB');
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw error('无法读取JSON，请选择本产品导出的用例包', 'Unable to read JSON; select an exported fixture package'); }
  return validatePackage(parsed);
}

export function replayPackage(pkg) {
  // Reinspect even when callers bypass the file-text entry point.
  const inspected = inspectPackage(JSON.stringify(pkg));
  const batch = generate(inspected.config);
  const differences = [];
  inspected.cases.forEach((entry, index) => {
    const actual = batch.cases[index];
    if (entry.value !== actual.value) differences.push({ index, reason: '号码与固定参数重算结果不同 / Value differs from deterministic replay' });
    if (!sameChecks(entry.checks, actual.checks)) differences.push({ index, reason: '预期检查状态与重算结果不同 / Expected check statuses differ from replay' });
    if (JSON.stringify(entry.expectedFailureIds) !== JSON.stringify(actual.expectedFailureIds)) differences.push({ index, reason: '预期失败项与重算结果不同 / Expected failures differ from replay' });
  });
  return { batch, matches: differences.length === 0, differences };
}
