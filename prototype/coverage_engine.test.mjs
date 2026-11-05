import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import vm from "node:vm";
import {
  PROFILES,
  ENGINE_VERSION,
  DATA_HASH,
  SNAPSHOT_CANONICAL,
  generate,
  validate,
  createPackage,
  inspectPackage,
  replayPackage,
} from "./engine.mjs";
const s = (checks, id) => checks.find((c) => c.id === id)?.status;
const c = (id, extra = {}) => ({
  profileId: id,
  count: 3,
  seed: " 🧪中文 seed ",
  ...extra,
});
const cp = (x) => JSON.parse(JSON.stringify(x));
const fresh = () => createPackage(generate(c("cn-id")));

test("facade exposes ordered regional profiles and freezes the catalog", () => {
  assert.deepEqual(
    PROFILES.map((p) => p.id),
    [
      "cn-id",
      "hk-id",
      "mo-id",
      "tw-id",
      "vn-id",
      "us-ny-dmv",
      "us-passport-ng",
      "cn-id-demo",
    ],
  );
  for (const id of ["cn-id", "hk-id", "mo-id", "tw-id"])
    assert.equal(PROFILES.find((p) => p.id === id).country, "CN");
  assert.equal(PROFILES.at(-1).archived, true);
  assert.equal(
    PROFILES.find((p) => p.id === "cn-id").addressCodes.length,
    2851,
  );
  assert.equal(
    PROFILES.find((p) => p.id === "tw-id").addressCodes.filter((a) => a.current)
      .length,
    22,
  );
  assert.equal(
    new Set(
      PROFILES.find((p) => p.id === "vn-id").addressCodes.map(
        (a) => a.groupCode,
      ),
    ).size,
    34,
  );
  assert.equal(PROFILES.find((p) => p.id === "vn-id").addressCodes.length, 63);
  assert.throws(() => {
    PROFILES[0].addressCodes[0].code = "bad";
  });
  assert.equal(
    DATA_HASH,
    `sha256:${createHash("sha256").update(SNAPSHOT_CANONICAL).digest("hex")}`,
  );
  assert.equal(ENGINE_VERSION, "1.1.0");
});
test("raw data is deeply immutable before the engine imports it", () => {
  const dataUrl = new URL("./coverage_data.mjs", import.meta.url).href;
  const engineUrl = new URL("./engine.mjs", import.meta.url).href;
  // A fresh process excludes the engine's defensive freeze from this assertion.
  const script = `
    import assert from 'node:assert/strict';
    import { createHash } from 'node:crypto';
    const { COVERAGE_DATA: data, COVERAGE_CANONICAL, COVERAGE_DATA_HASH } = await import(${JSON.stringify(dataUrl)});
    const canonical = JSON.stringify(data);
    for (const nested of [data, data.tw.rules.letter_numeric_map, data.tw.addresses,
      data.mainland.addresses[0], data.vn.currentProvinces[0].legacyBirthplaceCodes]) {
      assert.equal(Object.isFrozen(nested), true);
    }
    assert.throws(() => { data.tw.rules.letter_numeric_map.B = 12; }, TypeError);
    assert.throws(() => { data.tw.addresses.push({ code: 'BAD' }); }, TypeError);
    assert.throws(() => { data.mainland.addresses[0].code = '000000'; }, TypeError);
    assert.throws(() => { data.vn.currentProvinces[0].legacyBirthplaceCodes.push('023'); }, TypeError);
    assert.throws(() => { data.tw.rules.letter_numeric_map = { B: 12 }; }, TypeError);
    const { generate, validate, createPackage, replayPackage } = await import(${JSON.stringify(engineUrl)});
    assert.equal(validate('tw-id', 'B120667503').find(c => c.id === 'checksum').status, 'pass');
    const batch = generate({profileId:'tw-id',addressCode:'B',seed:'immutable-rules',count:3});
    assert.equal(replayPackage(createPackage(batch)).matches, true);
    assert.equal(JSON.stringify(data), canonical);
    assert.equal(COVERAGE_CANONICAL, canonical);
    assert.equal(COVERAGE_DATA_HASH, 'sha256:' + createHash('sha256').update(canonical).digest('hex'));
  `;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", script],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
});
test("facade replays 52 old packages and actual native/browser exports unchanged", () => {
  const list = JSON.parse(
    readFileSync(
      new URL(
        "../flutter_app/test/fixtures/js_golden_packages.json",
        import.meta.url,
      ),
    ),
  );
  list.push(
    JSON.parse(
      readFileSync(
        new URL(
          "../flutter_app/test/fixtures/prototype-exported-package.json",
          import.meta.url,
        ),
      ),
    ),
    JSON.parse(
      readFileSync(
        new URL(
          "../docs/mobile/evidence/startup-revision/android-aot-original-export.json",
          import.meta.url,
        ),
      ),
    ),
  );
  for (const p of list) {
    const r = replayPackage(inspectPackage(JSON.stringify(p)));
    assert.equal(r.matches, true);
    assert.deepEqual(r.batch.cases, p.cases);
    assert.equal(r.batch.meta.engineVersion, "1.0.0");
    assert.equal(r.batch.meta.dataHash, p.dataHash);
  }
  for (const id of ["cn-id-demo", "us-ny-dmv", "us-passport-ng"])
    assert.equal(generate(c(id)).meta.engineVersion, "1.0.0");
});
test("all CN references including city references and reported exception generate", () => {
  const p = PROFILES.find((p) => p.id === "cn-id");
  assert.equal(new Set(p.addressCodes.map((a) => a.groupCode)).size, 31);
  assert.equal(
    p.addressCodes.filter((a) => a.kind === "prefecture_direct_reference")
      .length,
    4,
  );
  assert.equal(
    p.addressCodes.find((a) => a.code === "133100").kind,
    "official_reported_identity_prefix",
  );
  for (const a of p.addressCodes) {
    const b = generate(c("cn-id", { addressCode: a.code, count: 1 }));
    assert.equal(b.cases[0].value.slice(0, 6), a.code);
    assert.equal(s(b.cases[0].checks, "address"), "pass");
    assert.equal(s(b.cases[0].checks, "issuance"), "unknown");
  }
});
test("HK checksum agrees with saved official client for single/double letters and check A/0", () => {
  const raw = readFileSync(
    new URL(
      "../docs/coverage/evidence/hk-mo-tw/hk-government-booking-application_mo.js.txt",
      import.meta.url,
    ),
    "utf8",
  );
  const source = raw.slice(
    raw.indexOf("function IsHKID("),
    raw.indexOf("function hkid_display("),
  );
  const context = {};
  vm.createContext(context);
  vm.runInContext(source, context);
  for (const v of [
    "A1234563",
    "A0000070",
    "A000002A",
    "AA0000030",
    "AA000009A",
  ]) {
    assert.equal(context.IsHKID(v), true);
    assert.equal(s(validate("hk-id", v), "checksum"), "pass");
  }
  assert.equal(s(validate("hk-id", "A123456A"), "checksum"), "fail");
  for (const prefix of ["A", "Z", "AA", "AZ", "ZZ"])
    for (const item of generate(c("hk-id", { prefix, count: 100 })).cases)
      assert.equal(context.IsHKID(item.value), true);
  for (const prefix of ["a", "AAA", "A1", " A", "A\n", ""])
    assert.throws(() => generate(c("hk-id", { prefix })));
});
test("TW official example and all 26 mappings remain valid, historical generation explicit", () => {
  assert.equal(
    s(validate("tw-id", "B120667503", { sex: "male" }), "checksum"),
    "pass",
  );
  const values = "1011121314151617341819202122352324252627282932303133"
    .match(/../g)
    .map(Number);
  const p = PROFILES.find((p) => p.id === "tw-id");
  for (const a of p.addressCodes) {
    if (!a.current)
      assert.throws(() => generate(c("tw-id", { addressCode: a.code })));
    const b = generate(
      c("tw-id", {
        addressCode: a.code,
        allowHistorical: !a.current,
        count: 100,
        sex: "female",
      }),
    );
    for (const item of b.cases) {
      const n = values[item.value.charCodeAt(0) - 65];
      let sum = Math.floor(n / 10) + (n % 10) * 9;
      for (let i = 1; i < 10; i++)
        sum += Number(item.value[i]) * (i === 9 ? 1 : 9 - i);
      assert.equal(sum % 10, 0);
      assert.equal(item.value[1], "2");
    }
  }
  assert.throws(() => generate(c("tw-id", { birthDate: "2000-01-01" })));
});
test("VN locks historical prefix under current navigation and encodes only year/sex", () => {
  const p = PROFILES.find((p) => p.id === "vn-id");
  assert.equal(
    p.addressCodes.some((a) => a.code === "023"),
    false,
  );
  for (const a of p.addressCodes) {
    const b = generate(
      c("vn-id", {
        addressCode: a.code,
        currentProvinceAdminCode: a.groupCode,
        sex: "female",
        birthDate: "1999-12-31",
        count: 1,
      }),
    );
    assert.equal(b.config.legacyBirthplaceCode, a.code);
    assert.equal(b.config.currentProvinceAdminCode, a.groupCode);
    assert.equal(b.cases[0].value.slice(0, 6), a.code + "199");
    for (const id of ["checksum", "newIssuance", "issuance"])
      assert.equal(s(b.cases[0].checks, id), "unknown");
  }
  assert.throws(() => generate(c("vn-id", { addressCode: "24" })));
  assert.throws(() =>
    generate(
      c("vn-id", { addressCode: "027", currentProvinceAdminCode: "27" }),
    ),
  );
  assert.throws(() =>
    generate(c("vn-id", { addressCode: "027", legacyBirthplaceCode: "024" })),
  );
  const b = generate(
    c("vn-id", {
      addressCode: "027",
      currentProvinceAdminCode: "24",
      sex: "male",
      birthDate: "2000-01-01",
    }),
  );
  assert.equal(b.cases[0].value.slice(0, 6), "027200");
  assert.equal(b.meta.assurance, "format_only");
  assert.equal(b.config.assurance, "format_only");
  assert.equal(b.config.ruleVersion, b.meta.profileVersion);
  assert.throws(() => generate(c("vn-id", { assurance: "official" })));
  assert.throws(() => generate(c("vn-id", { ruleVersion: "wrong" })));
  assert.deepEqual(
    b.cases,
    generate(
      c("vn-id", {
        addressCode: "027",
        currentProvinceAdminCode: "24",
        sex: "male",
        birthDate: "2000-12-31",
      }),
    ).cases,
  );
});
test("fixed date bounds, leap days and strict incompatible fields reject without time drift", () => {
  for (const id of ["cn-id", "vn-id"]) {
    for (const d of ["1900-01-01", "2000-02-29", "2026-11-05"])
      assert.doesNotThrow(() => generate(c(id, { birthDate: d })));
    for (const d of [
      "1899-12-31",
      "1900-02-29",
      "2026-11-06",
      "2100-01-01",
      "2025-02-29",
      "2000-01-01\n",
    ])
      assert.throws(() => generate(c(id, { birthDate: d })));
  }
  assert.throws(() => generate(c("cn-id-demo", { birthDate: "2026-01-01" })));
  for (const id of ["mo-id", "hk-id"])
    assert.throws(() => generate(c(id, { sex: "male" })));
});
test("all positive/negative modes produce 100 unique items, unknown never passes", () => {
  for (const p of PROFILES.filter((p) => !p.archived)) {
    for (const mode of p.modes) {
      const b = generate(c(p.id, { mode, count: 100 }));
      assert.equal(new Set(b.cases.map((v) => v.value)).size, 100);
      for (const v of b.cases) {
        assert.deepEqual(
          v.expectedFailureIds,
          v.checks.filter((ch) => ch.status === "fail").map((ch) => ch.id),
        );
        assert.equal(v.expectedFailureIds.length === 0, mode === "positive");
        if (mode !== "positive") assert.ok(v.expectedFailureIds.includes(mode));
        assert.equal(s(v.checks, "issuance"), "unknown");
        if (p.id === "mo-id" || p.id === "vn-id")
          assert.equal(s(v.checks, "checksum"), "unknown");
      }
      assert.equal(replayPackage(createPackage(b)).matches, true);
    }
  }
  const b = generate(c("mo-id", { count: 100 }));
  assert.ok(b.cases.some((v) => !["1", "5", "7"].includes(v.value[0])));
  assert.throws(() => generate(c("mo-id", { mode: "checksum" })));
  assert.throws(() => generate(c("vn-id", { mode: "checksum" })));
  for (const mode of ["length", "checksum"])
    for (const v of generate(c("hk-id", { prefix: "AA", mode, count: 100 }))
      .cases)
      assert.ok(v.expectedFailureIds.includes(mode));
});
test("UTF16 seed length, non-BMP codepoints, whitespace, normalization are deterministic", () => {
  for (const p of PROFILES.filter((p) => !p.archived)) {
    for (const seed of [
      " 中文 🧪 ",
      "𝄞",
      "x".repeat(64),
      "😀".repeat(32),
      "\ud800",
    ])
      assert.deepEqual(
        generate(c(p.id, { seed })),
        generate(c(p.id, { seed })),
      );
    assert.notDeepEqual(
      generate(c(p.id, { seed: " x " })).cases,
      generate(c(p.id, { seed: "x" })).cases,
    );
    for (const seed of ["", " \t\n", "\ufeff", "😀".repeat(33)])
      assert.throws(() => generate(c(p.id, { seed })));
    for (const count of [0, 101, 1.5, "3", null])
      assert.throws(() => generate(c(p.id, { count })));
  }
});
test("new package versions, fields, bytes, checks and tampering are bounded", () => {
  for (const field of ["engineVersion", "prng", "profileVersion", "dataHash"]) {
    const p = fresh();
    p[field] = "wrong";
    assert.throws(() => inspectPackage(JSON.stringify(p)));
  }
  for (const [key, value] of [
    ["engineVersion", "1.0.0"],
    ["config", {}],
    ["extra", true],
    ["cases", []],
  ]) {
    const p = fresh();
    p[key] = value;
    assert.throws(() => inspectPackage(JSON.stringify(p)));
  }
  const p = fresh();
  p.cases[0].value = "0" + p.cases[0].value.slice(1);
  assert.equal(replayPackage(p).matches, false);
  const q = fresh();
  q.cases[0].checks[0].status = "unknown";
  assert.equal(replayPackage(q).matches, false);
  const l = fresh();
  l.cases[0].checks[0].labelEn = "modified";
  assert.throws(() => inspectPackage(JSON.stringify(l)));
  for (const text of [
    "{}",
    "null",
    "[]",
    "not json",
    " ".repeat(1024 * 1024 + 1),
    "🧪".repeat(262145),
  ])
    assert.throws(() => inspectPackage(text));
  for (const id of ["cn-id", "hk-id", "mo-id", "tw-id", "vn-id"]) {
    const b = generate(c(id));
    const pkg = createPackage(b);
    delete pkg.config.seed;
    assert.throws(() => inspectPackage(JSON.stringify(pkg)));
    assert.equal(s(validate(id, b.cases[0].value + "\n"), "charset"), "fail");
  }
  const vn = createPackage(generate(c("vn-id")));
  delete vn.config.legacyBirthplaceCode;
  assert.throws(() => inspectPackage(JSON.stringify(vn)));
});
