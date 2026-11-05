// Public facade: legacy exports stay pinned to their exact 1.0.0 implementation.
import * as legacy from "./engine_legacy.mjs";
import * as coverage from "./coverage_engine.mjs";
export const {
  ENGINE_VERSION,
  PRNG,
  DATA_HASH,
  SNAPSHOT_CANONICAL,
  AS_OF,
  MAX_PACKAGE_BYTES,
} = coverage;
const legacyIds = new Set(["cn-id-demo", "us-ny-dmv", "us-passport-ng"]);
const archived = {
  ...legacy.PROFILES.find((p) => p.id === "cn-id-demo"),
  region: "mainland",
  archived: true,
};
export const PROFILES = Object.freeze([
  ...coverage.PROFILES,
  ...legacy.PROFILES.filter((p) => p.country === "US").map((p) =>
    Object.freeze({ ...p, region: "", archived: false }),
  ),
  Object.freeze(archived),
]);
const engineFor = (id) => (legacyIds.has(id) ? legacy : coverage);
export const generate = (input) => engineFor(input?.profileId).generate(input);
export const validate = (id, value, context = {}) =>
  engineFor(id).validate(id, value, context);
export const createPackage = (batch) =>
  engineFor(batch?.profileId).createPackage(batch);
export function inspectPackage(text) {
  if (
    typeof text !== "string" ||
    new TextEncoder().encode(text).length > MAX_PACKAGE_BYTES
  )
    return coverage.inspectPackage(text);
  let pkg;
  try {
    pkg = JSON.parse(text);
  } catch {
    return coverage.inspectPackage(text);
  }
  return engineFor(pkg?.profileId).inspectPackage(text);
}
export function replayPackage(pkg) {
  const inspected = inspectPackage(JSON.stringify(pkg));
  return engineFor(inspected.profileId).replayPackage(inspected);
}
