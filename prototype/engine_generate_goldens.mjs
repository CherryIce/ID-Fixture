// Rebuild only the new 1.1.0 cross-language test fixtures, never legacy packages.
import { writeFileSync } from "node:fs";
import { PROFILES, generate, createPackage } from "./engine.mjs";
const packages = [];
for (const profile of PROFILES.filter(
  (p) => !p.archived && p.country !== "US",
)) {
  for (const mode of profile.modes) {
    for (const seed of [" 中文 🧪 seed ", "\ud800"]) {
      const base = { profileId: profile.id, count: 4, mode, seed };
      const configs = [base];
      if (profile.id === "hk-id") configs.push({ ...base, prefix: "ZZ" });
      if (profile.id === "tw-id")
        configs.push({
          ...base,
          addressCode: "Y",
          allowHistorical: true,
          sex: "female",
        });
      if (profile.id === "vn-id")
        configs.push({
          ...base,
          addressCode: "027",
          currentProvinceAdminCode: "24",
          birthDate: "1999-12-31",
          sex: "female",
        });
      if (profile.id === "cn-id")
        configs.push({
          ...base,
          addressCode: "133100",
          birthDate: "2026-11-05",
          sex: "male",
        });
      for (const config of configs) {
        const pkg = createPackage(generate(config));
        pkg.exportedAt = "2026-11-05T00:00:00.000Z";
        packages.push(pkg);
      }
    }
  }
}
writeFileSync(
  new URL(
    "../flutter_app/test/fixtures/coverage_js_golden_packages.json",
    import.meta.url,
  ),
  `${JSON.stringify(packages, null, 2)}\n`,
);
console.log(`Wrote ${packages.length} new 1.1.0 golden packages.`);
