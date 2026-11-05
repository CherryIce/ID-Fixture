// Versioned public-format fixtures, never an issuance or identity lookup.
import {
  COVERAGE_DATA,
  COVERAGE_DATA_HASH,
  COVERAGE_CANONICAL,
} from "./coverage_data.mjs";
export const ENGINE_VERSION = "1.1.0";
export const PRNG = "fnv1a32-seeded-mulberry32-v1";
export const AS_OF = "2026-11-05";
export const MAX_PACKAGE_BYTES = 1024 * 1024;
export const DATA_HASH = COVERAGE_DATA_HASH;
export const SNAPSHOT_CANONICAL = COVERAGE_CANONICAL;
const error = (zh, en) => new Error(`${zh} / ${en}`);
const clone = (value) => JSON.parse(JSON.stringify(value));
function freeze(value) {
  Object.freeze(value);
  for (const item of Object.values(value))
    if (item && typeof item === "object" && !Object.isFrozen(item))
      freeze(item);
  return value;
}
freeze(COVERAGE_DATA);
export const PROFILE_DEFINITIONS = [
  {
    id: "cn-id",
    country: "CN",
    region: "mainland",
    dataKey: "mainland",
    nameZh: "公民身份号码 · 全国参考表",
    nameEn: "Citizen ID · nationwide reference",
    fidelity: "reference",
    version: "gb11643-1999-reference-20261105-v1",
    coverageZh: "31省级地区 · 2851个公开参考代码",
    coverageEn: "31 province-level areas · 2,851 public reference codes",
    limitationsZh:
      "行政区划参考表含4个市级参考及133100专项代码，不等于公安完整发号表。仅支持1900-01-01至2026-11-05合成生日及001–999顺序码；签发、持有人、实际分配与身份有效性未知。",
    limitationsEn:
      "The administrative reference includes four city-level entries and the separately reported 133100 prefix; it is not a complete police allocation table. Synthetic dates are limited to 1900-01-01 through 2026-11-05 and sequences to 001–999. Issuance, holder, allocation and identity validity remain unknown.",
    modes: ["positive", "length", "charset", "checksum"],
    constraints: [
      "length",
      "charset",
      "address",
      "date",
      "sequence",
      "checksum",
      "sex",
      "issuance",
    ],
  },
  {
    id: "hk-id",
    country: "CN",
    region: "HK",
    dataKey: "hk",
    nameZh: "香港身份证号码",
    nameEn: "Hong Kong identity card number",
    fidelity: "checksum",
    version: "hk-public-client-mod11-20261105-v1",
    coverageZh: "1–2字母、6数字及校验字符",
    coverageEn: "One or two letters, six digits and a check character",
    limitationsZh:
      "采用政府公开客户端MOD11算法；输出不带括号的主体及校验字符。A–Z前缀仅用于格式测试，不代表现行签发范围；不编码生日或性别，不核验真实身份。",
    limitationsEn:
      "Uses the public government-client MOD11 algorithm. Canonical output appends the check character without parentheses. A–Z prefixes are a format-test alphabet, not an issued-prefix catalogue; birth date, sex and real identity are not verified.",
    modes: ["positive", "length", "charset", "checksum"],
    constraints: ["length", "charset", "checksum", "issuance"],
  },
  {
    id: "mo-id",
    country: "CN",
    region: "MO",
    dataKey: "mo",
    nameZh: "澳门居民身份证号码",
    nameEn: "Macao resident identity card number",
    fidelity: "format",
    version: "mo-bir-eight-digit-format-20261105-v1",
    coverageZh: "现行法定8位数字格式",
    coverageEn: "Current statutory eight-digit format",
    limitationsZh:
      "仅检查7位主体加1位检验数字的格式，未取得可信公开算术算法，校验位始终未知。不将历史1/5/7前缀强套为现行限制；不核验身份、居留资格或签发。",
    limitationsEn:
      "Checks the seven-digit body plus one check-digit format only. A supported public arithmetic algorithm was not established, so checksum remains unknown. Historical 1/5/7 prefixes are not imposed as current restrictions. Identity, residence status and issuance are not verified.",
    modes: ["positive", "length", "charset"],
    constraints: ["length", "charset", "checksum", "issuance"],
  },
  {
    id: "tw-id",
    country: "CN",
    region: "TW",
    dataKey: "tw",
    nameZh: "台湾国民身分证统一编号",
    nameEn: "Taiwan national identification number",
    fidelity: "checksum",
    version: "tw-mod10-regions-20261105-v1",
    coverageZh: "22现行地区 · 可显式选4个历史前缀",
    coverageEn:
      "22 current regions · four historical prefixes by explicit choice",
    limitationsZh:
      "采用官方MOD10方法及1/2编码性别；不含居留证。地区码不等于现住地，历史L/R/S/Y须显式选择；流水配赋、真实签发和持有人未知。",
    limitationsEn:
      "Uses the official MOD10 method and encoded sex digits 1/2; excludes residence permits. Region prefix is not current residence. Historical L/R/S/Y requires explicit selection. Serial allocation, actual issuance and holder remain unknown.",
    modes: ["positive", "length", "charset", "checksum"],
    constraints: [
      "length",
      "charset",
      "address",
      "sex",
      "checksum",
      "issuance",
    ],
  },
  {
    id: "vn-id",
    country: "VN",
    region: "",
    dataKey: "vn",
    nameZh: "个人身份号码 · 公开结构",
    nameEn: "Personal identification number · public structure",
    fidelity: "format",
    version: "vn-public-structure-63-birthplaces-20261105-v1",
    coverageZh: "当前34省市导航 · 63历史公开出生地码",
    coverageEn:
      "34 current navigation areas · 63 published historical birthplace codes",
    limitationsZh:
      "12位历史公开结构测试：3位出生地、世纪/编码性别、出生年及6位随机段。当前34省市仅为导航，不把两位行政码补零用作新号码前缀。2026新签发分配未知；只编码出生年，不编码月日，不添加校验算法。",
    limitationsEn:
      "Tests the published historical 12-digit structure: three-digit birthplace, century/encoded sex, birth year and six random digits. The 34 current areas are navigation only; their two-digit administrative codes are never padded into identity prefixes. Current 2026 allocation remains unknown. Only birth year is encoded, not month/day; no checksum algorithm is invented.",
    modes: ["positive", "length", "charset"],
    constraints: [
      "length",
      "charset",
      "address",
      "year",
      "sex",
      "checksum",
      "newIssuance",
      "issuance",
    ],
  },
];
export const PROFILES = freeze(
  PROFILE_DEFINITIONS.map(({ dataKey, ...p }) => ({
    ...p,
    documentType: "national-id",
    enabled: true,
    available: true,
    archived: false,
    addressCodes: COVERAGE_DATA[dataKey].addresses ?? [],
    sources: COVERAGE_DATA[dataKey].sources,
  })),
);
export const CHECK_LABELS = freeze({
  length: ["长度符合规则", "Length matches the rule"],
  charset: ["字符组成符合规则", "Character structure matches the rule"],
  address: [
    "属于版本化公开参考代码表",
    "Included in the versioned public reference table",
  ],
  date: ["出生日期为有效日历日期", "Birth date is a valid calendar date"],
  sequence: ["测试顺序码001–999", "Test sequence is 001–999"],
  checksum: ["公开规则校验字符", "Public-rule check character"],
  sex: [
    "编码性别符合所选测试参数",
    "Encoded sex matches the selected test parameter",
  ],
  year: [
    "编码出生年符合所选测试参数",
    "Encoded birth year matches the selected test parameter",
  ],
  newIssuance: [
    "现行新签发分配规则符合性",
    "Conformity with current new-issuance allocation rules",
  ],
  issuance: [
    "真实签发、持有人及有效状态",
    "Actual issuance, holder and validity",
  ],
});
export function profileFor(id) {
  const p = PROFILES.find((p) => p.id === id);
  if (!p) throw error("未知规则档案", "Unknown rule profile");
  return p;
}
function object(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}
function exact(value, allowed, required = allowed) {
  if (
    !object(value) ||
    Object.keys(value).some((k) => !allowed.includes(k)) ||
    required.some((k) => !Object.hasOwn(value, k))
  )
    throw error(
      "文件字段或结构不符合本产品格式",
      "Unexpected package fields or structure",
    );
}
function full(pattern, value) {
  const m = pattern.exec(value);
  return m !== null && m[0].length === value.length;
}
function validDate(value) {
  if (typeof value !== "string" || !full(/^\d{4}-\d{2}-\d{2}/, value))
    return false;
  const [y, m, d] = value.split("-").map(Number);
  return (
    y > 0 &&
    m > 0 &&
    m <= 12 &&
    d > 0 &&
    d <=
      [
        31,
        y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ][m - 1]
  );
}
function configKeys(id) {
  return [
    "profileId",
    "count",
    "seed",
    "mode",
    ...(["cn-id", "vn-id"].includes(id)
      ? [
          "birthDate",
          "sex",
          "addressCode",
          ...(id === "vn-id"
            ? [
                "currentProvinceAdminCode",
                "legacyBirthplaceCode",
                "ruleVersion",
                "assurance",
              ]
            : []),
        ]
      : id === "tw-id"
        ? ["addressCode", "sex", "allowHistorical"]
        : id === "hk-id"
          ? ["prefix"]
          : []),
  ];
}
function normalize(input) {
  exact(input, configKeys(input?.profileId), ["profileId"]);
  const p = profileFor(input.profileId);
  const { count = 1, seed = "fixture-01", mode = "positive" } = input;
  if (!Number.isInteger(count) || count < 1 || count > 100)
    throw error(
      "生成数量须为1–100的整数",
      "Count must be an integer from 1 to 100",
    );
  if (
    typeof seed !== "string" ||
    seed.length < 1 ||
    seed.length > 64 ||
    !seed.trim()
  )
    throw error("复现种子须为1–64个字符", "Seed must contain 1–64 characters");
  if (!p.modes.includes(mode))
    throw error(
      "此规则不支持所选测试模式",
      "Unsupported test mode for this profile",
    );
  const c = { profileId: p.id, count, seed, mode };
  if (["cn-id", "vn-id", "tw-id"].includes(p.id)) {
    const sex = input.sex === undefined ? "any" : input.sex;
    if (!["any", "male", "female"].includes(sex))
      throw error("编码性别参数无效", "Invalid encoded-sex parameter");
    if (p.id !== "tw-id") {
      const birthDate =
        input.birthDate === undefined ? "2000-01-01" : input.birthDate;
      if (
        !validDate(birthDate) ||
        birthDate < "1900-01-01" ||
        birthDate > AS_OF
      )
        throw error(
          "合成生日须在1900-01-01至2026-11-05内",
          "Synthetic birth date must be valid and within 1900-01-01 through 2026-11-05",
        );
      c.birthDate = birthDate;
    }
    c.sex = sex;
    c.addressCode =
      input.addressCode === undefined
        ? p.addressCodes[0].code
        : input.addressCode;
    const address = p.addressCodes.find((a) => a.code === c.addressCode);
    if (!address)
      throw error(
        "地区不在版本化公开参考表内",
        "Address is not in the versioned public reference table",
      );
    if (p.id === "tw-id") {
      const allowHistorical =
        input.allowHistorical === undefined ? false : input.allowHistorical;
      if (
        typeof allowHistorical !== "boolean" ||
        (!address.current && !allowHistorical)
      )
        throw error(
          "历史地区须显式启用",
          "Historical regions require explicit opt-in",
        );
      c.allowHistorical = allowHistorical;
    }
    if (p.id === "vn-id") {
      c.currentProvinceAdminCode =
        input.currentProvinceAdminCode === undefined
          ? address.groupCode
          : input.currentProvinceAdminCode;
      c.legacyBirthplaceCode =
        input.legacyBirthplaceCode === undefined
          ? c.addressCode
          : input.legacyBirthplaceCode;
      if (c.legacyBirthplaceCode !== c.addressCode)
        throw error(
          "历史出生地码与选择不匹配",
          "Historical birthplace code does not match the selection",
        );
      c.ruleVersion =
        input.ruleVersion === undefined ? p.version : input.ruleVersion;
      c.assurance =
        input.assurance === undefined ? "format_only" : input.assurance;
      if (c.ruleVersion !== p.version || c.assurance !== "format_only")
        throw error(
          "越南规则范围元数据不匹配",
          "Vietnam rule-scope metadata mismatch",
        );
      if (c.currentProvinceAdminCode !== address.groupCode)
        throw error(
          "当前导航省市与历史出生地码不匹配",
          "Current navigation area does not match the historical birthplace code",
        );
    }
  }
  if (p.id === "hk-id") {
    c.prefix = input.prefix === undefined ? "A" : input.prefix;
    if (typeof c.prefix !== "string" || !full(/^[A-Z]{1,2}/, c.prefix))
      throw error(
        "香港前缀须为1–2个大写字母",
        "Hong Kong prefix must contain one or two uppercase letters",
      );
  }
  return c;
}
function randomFor(seed) {
  let state = 2166136261;
  for (const ch of seed)
    state = Math.imul(state ^ ch.codePointAt(0), 16777619) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let v = Math.imul(state ^ (state >>> 15), 1 | state);
    v ^= v + Math.imul(v ^ (v >>> 7), 61 | v);
    return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
  };
}
function cnCheck(base) {
  const w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  return "10X98765432"[
    [...base].reduce((s, d, i) => s + Number(d) * w[i], 0) % 11
  ];
}
function hkSum(base) {
  const prefix = base.slice(0, -6),
    digits = base.slice(-6);
  let sum =
    prefix.length === 1
      ? 36 * 9 + (prefix.charCodeAt(0) - 55) * 8
      : (prefix.charCodeAt(0) - 55) * 9 + (prefix.charCodeAt(1) - 55) * 8;
  for (let i = 0; i < 6; i++) sum += Number(digits[i]) * (7 - i);
  return sum;
}
const twMap = COVERAGE_DATA.tw.rules.letter_numeric_map;
function twSum(base) {
  const n = twMap[base[0]];
  let sum = Math.floor(n / 10) + (n % 10) * 9;
  for (let i = 1; i < 9; i++) sum += Number(base[i]) * (9 - i);
  return sum;
}
const check = (id, status) => ({
  id,
  status,
  labelZh: CHECK_LABELS[id][0],
  labelEn: CHECK_LABELS[id][1],
});
export function validate(id, value, context = {}) {
  const p = profileFor(id);
  if (typeof value !== "string" || value.length > 128)
    throw error(
      "号码必须为不超过128字符的字符串",
      "Value must be a string of at most 128 characters",
    );
  const len =
    id === "cn-id"
      ? 18
      : id === "vn-id"
        ? 12
        : id === "tw-id"
          ? 10
          : id === "mo-id"
            ? 8
            : null;
  const hkPrefix = /^[A-Z]{1,2}/.exec(value)?.[0];
  const lengthOk =
    len === null
      ? hkPrefix
        ? value.length === hkPrefix.length + 7
        : value.length === 8 || value.length === 9
      : value.length === len;
  const shape =
    id === "cn-id"
      ? /^\d{17}[\dX]/
      : id === "hk-id"
        ? /^[A-Z]{1,2}\d{6}[\dA]/
        : id === "tw-id"
          ? /^[A-Z][12]\d{8}/
          : /^\d+/;
  const chars = full(shape, value);
  const positioned = lengthOk && chars;
  const out = [
    check("length", lengthOk ? "pass" : "fail"),
    check("charset", chars ? "pass" : "fail"),
  ];
  const push = (key, test) =>
    out.push(check(key, !positioned ? "unknown" : test ? "pass" : "fail"));
  if (["cn-id", "tw-id", "vn-id"].includes(id))
    out.push(
      check(
        "address",
        !positioned
          ? "unknown"
          : p.addressCodes.some(
                (a) =>
                  a.code ===
                  value.slice(0, id === "cn-id" ? 6 : id === "vn-id" ? 3 : 1),
              )
            ? "pass"
            : "unknown",
      ),
    );
  if (id === "cn-id") {
    const d = `${value.slice(6, 10)}-${value.slice(10, 12)}-${value.slice(12, 14)}`;
    push("date", validDate(d) && d <= AS_OF);
    push("sequence", value.slice(14, 17) !== "000");
    let sum = 0;
    if (positioned)
      for (let i = 0; i < 18; i++)
        sum +=
          (value[i] === "X" ? 10 : Number(value[i])) * (2 ** (17 - i) % 11);
    push("checksum", sum % 11 === 1);
  }
  if (id === "hk-id")
    push(
      "checksum",
      positioned &&
        (hkSum(value.slice(0, -1)) +
          (value.at(-1) === "A" ? 10 : Number(value.at(-1)))) %
          11 ===
          0,
    );
  if (id === "tw-id") {
    if (context.sex && context.sex !== "any")
      push("sex", value[1] === (context.sex === "male" ? "1" : "2"));
    push(
      "checksum",
      positioned &&
        (twSum(value.slice(0, -1)) + Number(value.at(-1))) % 10 === 0,
    );
  }
  if (id === "cn-id" && context.sex && context.sex !== "any")
    push("sex", Number(value[16]) % 2 === (context.sex === "male" ? 1 : 0));
  if (id === "vn-id") {
    const century = Number(value[3]);
    const year =
      1900 + Math.floor(century / 2) * 100 + Number(value.slice(4, 6));
    if (context.birthDate)
      push(
        "year",
        validDate(context.birthDate) &&
          year === Number(context.birthDate.slice(0, 4)),
      );
    if (context.sex && context.sex !== "any")
      push("sex", century % 2 === (context.sex === "male" ? 0 : 1));
    out.push(check("checksum", "unknown"), check("newIssuance", "unknown"));
  }
  if (id === "mo-id") out.push(check("checksum", "unknown"));
  out.push(check("issuance", "unknown"));
  return out;
}
export function generate(input) {
  const config = normalize(input),
    p = profileFor(config.profileId),
    random = randomFor(`${PRNG}|${p.id}|${config.seed}`),
    digits = (n) =>
      Array.from({ length: n }, () => Math.floor(random() * 10)).join("");
  const sequences = [];
  if (p.id === "cn-id") {
    for (let n = 1; n <= 999; n++)
      if (config.sex === "any" || n % 2 === (config.sex === "male" ? 1 : 0))
        sequences.push(n);
    for (let i = sequences.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [sequences[i], sequences[j]] = [sequences[j], sequences[i]];
    }
  }
  const cases = [],
    seen = new Set();
  let attempts = 0;
  while (cases.length < config.count) {
    if (++attempts > 10000)
      throw error(
        "无法在限定次数内生成唯一批次，请更换参数",
        "Unique-batch attempt limit reached; change parameters",
      );
    let value;
    if (p.id === "cn-id") {
      const base =
        config.addressCode +
        config.birthDate.replaceAll("-", "") +
        String(sequences[cases.length]).padStart(3, "0");
      value = base + cnCheck(base);
    }
    if (p.id === "hk-id") {
      const base = config.prefix + digits(6),
        c = (11 - (hkSum(base) % 11)) % 11;
      value = base + (c === 10 ? "A" : c);
    }
    if (p.id === "mo-id") value = digits(8);
    if (p.id === "tw-id") {
      const sex =
        config.sex === "any"
          ? Math.floor(random() * 2) + 1
          : config.sex === "male"
            ? 1
            : 2;
      const base = config.addressCode + sex + digits(7);
      value = base + ((10 - (twSum(base) % 10)) % 10);
    }
    if (p.id === "vn-id") {
      const y = Number(config.birthDate.slice(0, 4)),
        sex =
          config.sex === "any"
            ? Math.floor(random() * 2)
            : config.sex === "male"
              ? 0
              : 1;
      value =
        config.addressCode +
        (Math.floor((y - 1900) / 100) * 2 + sex) +
        String(y % 100).padStart(2, "0") +
        digits(6);
    }
    if (config.mode === "length") value = value.slice(0, -1);
    if (config.mode === "charset") value = "!" + value.slice(1);
    if (config.mode === "checksum")
      value = value.slice(0, -1) + (value.at(-1) === "0" ? "1" : "0");
    if (seen.has(value)) continue;
    seen.add(value);
    const checks = validate(p.id, value, config),
      expectedFailureIds = checks
        .filter((c) => c.status === "fail")
        .map((c) => c.id);
    if ((config.mode === "positive") !== (expectedFailureIds.length === 0))
      throw error(
        "内部生成结果与测试场景不一致",
        "Generated result does not match the selected test scenario",
      );
    cases.push({ value, checks, expectedFailureIds });
  }
  return {
    profileId: p.id,
    config,
    cases,
    meta: {
      engineVersion: ENGINE_VERSION,
      profileVersion: p.version,
      dataHash: DATA_HASH,
      prng: PRNG,
      synthetic: true,
      issuanceChecked: false,
      asOf: AS_OF,
      fidelity: p.fidelity,
      ...(p.id === "vn-id"
        ? {
            currentProvinceAdminCode: config.currentProvinceAdminCode,
            legacyBirthplaceCode: config.addressCode,
            ruleVersion: p.version,
            assurance: "format_only",
          }
        : {}),
    },
  };
}
function sameChecks(a, b) {
  return (
    Array.isArray(a) &&
    a.length === b.length &&
    a.every((v, i) => v.id === b[i].id && v.status === b[i].status)
  );
}
function sameStrings(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function sameCases(a, b) {
  return (
    Array.isArray(a) &&
    a.length === b.length &&
    a.every(
      (v, i) =>
        v.value === b[i].value &&
        sameChecks(v.checks, b[i].checks) &&
        sameStrings(v.expectedFailureIds, b[i].expectedFailureIds),
    )
  );
}
export function createPackage(batch) {
  if (!object(batch)) throw error("缺少可导出的批次", "No batch to export");
  const b = generate(batch.config);
  if (!sameCases(batch.cases, b.cases))
    throw error(
      "批次与锁定配置不一致，不能导出",
      "Batch does not match its locked configuration",
    );
  return {
    schema: "id-fixture-package",
    schemaVersion: 1,
    engineVersion: ENGINE_VERSION,
    prng: PRNG,
    profileId: b.profileId,
    profileVersion: b.meta.profileVersion,
    dataHash: DATA_HASH,
    synthetic: true,
    issuanceChecked: false,
    config: clone(b.config),
    cases: clone(b.cases),
    exportedAt: new Date().toISOString(),
  };
}
export function inspectPackage(text) {
  if (
    typeof text !== "string" ||
    new TextEncoder().encode(text).length > MAX_PACKAGE_BYTES
  )
    throw error(
      "用例包必须为不超过1MB的JSON文本",
      "Fixture package must be JSON text no larger than 1 MB",
    );
  let p;
  try {
    p = JSON.parse(text);
  } catch {
    throw error(
      "无法读取JSON，请选择本产品导出的用例包",
      "Unable to read JSON; select an exported fixture package",
    );
  }
  exact(p, [
    "schema",
    "schemaVersion",
    "engineVersion",
    "prng",
    "profileId",
    "profileVersion",
    "dataHash",
    "synthetic",
    "issuanceChecked",
    "config",
    "cases",
    "exportedAt",
  ]);
  if (
    p.schema !== "id-fixture-package" ||
    p.schemaVersion !== 1 ||
    p.synthetic !== true ||
    p.issuanceChecked !== false
  )
    throw error(
      "不是受支持的合成用例包",
      "Not a supported synthetic fixture package",
    );
  const rule = profileFor(p.profileId);
  if (
    p.engineVersion !== ENGINE_VERSION ||
    p.prng !== PRNG ||
    p.profileVersion !== rule.version ||
    p.dataHash !== DATA_HASH
  )
    throw error(
      "精确规则、引擎、随机算法版本或数据哈希不匹配",
      "Exact rule, engine, PRNG version or data hash mismatch",
    );
  const c = normalize(p.config);
  if (
    c.profileId !== p.profileId ||
    Object.keys(c).length !== Object.keys(p.config).length ||
    Object.entries(c).some(([k, v]) => p.config[k] !== v)
  )
    throw error(
      "配置缺失或内容与锁定格式不符",
      "Configuration is incomplete or differs from the locked format",
    );
  if (!Array.isArray(p.cases) || p.cases.length !== c.count)
    throw error(
      "用例条数与配置不符或超限",
      "Case count differs from configuration or exceeds the limit",
    );
  if (
    typeof p.exportedAt !== "string" ||
    p.exportedAt.length > 40 ||
    !Number.isFinite(Date.parse(p.exportedAt))
  )
    throw error("导出时间字段无效", "Invalid export timestamp");
  for (const entry of p.cases) {
    exact(entry, ["value", "checks", "expectedFailureIds"]);
    if (
      typeof entry.value !== "string" ||
      entry.value.length < 1 ||
      entry.value.length > 128 ||
      !Array.isArray(entry.checks) ||
      entry.checks.length > 10 ||
      !Array.isArray(entry.expectedFailureIds) ||
      entry.expectedFailureIds.length > 10
    )
      throw error("用例字段无效或超限", "Invalid or oversized case fields");
    const ids = new Set();
    for (const ch of entry.checks) {
      exact(ch, ["id", "status", "labelZh", "labelEn"]);
      if (
        !rule.constraints.includes(ch.id) ||
        !CHECK_LABELS[ch.id] ||
        !["pass", "fail", "unknown"].includes(ch.status) ||
        ids.has(ch.id) ||
        ch.labelZh !== CHECK_LABELS[ch.id][0] ||
        ch.labelEn !== CHECK_LABELS[ch.id][1]
      )
        throw error(
          "检查项不属于该规则或被修改",
          "Check does not belong to this rule or was modified",
        );
      ids.add(ch.id);
    }
    if (
      entry.expectedFailureIds.some(
        (id) => typeof id !== "string" || !ids.has(id),
      ) ||
      new Set(entry.expectedFailureIds).size !== entry.expectedFailureIds.length
    )
      throw error("预期失败项无效", "Invalid expected-failure identifiers");
  }
  return clone(p);
}
export function replayPackage(pkg) {
  const p = inspectPackage(JSON.stringify(pkg)),
    batch = generate(p.config),
    differences = [];
  p.cases.forEach((v, index) => {
    const a = batch.cases[index];
    if (v.value !== a.value)
      differences.push({
        index,
        reason:
          "号码与固定参数重算结果不同 / Value differs from deterministic replay",
      });
    if (!sameChecks(v.checks, a.checks))
      differences.push({
        index,
        reason:
          "预期检查状态与重算结果不同 / Expected check statuses differ from replay",
      });
    if (!sameStrings(v.expectedFailureIds, a.expectedFailureIds))
      differences.push({
        index,
        reason:
          "预期失败项与重算结果不同 / Expected failures differ from replay",
      });
  });
  return { batch, matches: differences.length === 0, differences };
}
