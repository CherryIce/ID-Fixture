# Coverage expansion UI validation

21 widget tests pass; the five UI/test files analyze without issues. Final logs: `widget-final-21.log` (exit 0) and `analyze-tw-permission-final.log` (exit 0). `ui-validation-summary.json` records source hashes and prior failures. The first runs found stale test wording and locator behavior in a 153px-high, keyboard-constrained scroll viewport; smaller real scroll steps and tapping a genuinely hit-tested visible portion fixed the harness without removing business assertions.

The picker keeps a draft until Confirm. Mainland province/city/county navigation and full original-name/code search share the same scrollable picker; directly administered leaves stay directly under the province. Search results include province/city paths. The four city-level reference codes and Xiongan are labeled with their scope and unknown issuance. Vietnam first selects a current province group and then a historical coding area. Taiwan starts with 22 current prefixes; the four historical prefixes require an explicit mode and remain labeled. Cancel, barrier dismissal, system Back, and reopening retain workbench results. Header and rows scroll together; confirmation stays above the keyboard with a dynamic safe-area inset.

Tests retain onboarding, errors/recovery, scoped US state selection, checks, copying/sharing contract, seed preservation, settings dismissal/reset and small-screen assertions. New cases cover east/south/west/north, four special cities and Xiongan, regional parameter isolation, Vietnam 24 → 024/027 filtering, Taiwan history switching, archived 1.0 replay without upgrade, and exact parameter/case replay for all five new profiles.

## Android integration boundary

`integration_test/android_workflow_test.dart` now has six business cases using NativePreferenceStore and NativePlatformServices. It passed static analysis at the UI freeze. The final post-fix dedicated Android run passed **6/6 business cases on emulator-5562**; see `../android-integration/summary.json` and its complete log/response. Previous startup-revision five-case device evidence remains scoped to the previous product revision. This suite still deliberately leaves real system sharing, file selection and file-import/replay acceptance to the coordinator's manual native run. It never substitutes fake services for that boundary.

When the coordinator grants a device turn, run from `flutter_app` with the existing JBR:

```sh
JAVA_HOME='/Applications/Android Studio.app/Contents/jbr/Contents/Home' \
ID_FIXTURE_INTEGRATION_REPORT='/Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/docs/coverage/validation/ui/android-integration-response.json' \
flutter drive -d emulator-5562 --driver=test_driver/integration_driver.dart \
  --target=integration_test/android_workflow_test.dart --no-pub
```

No device input or native build/install was performed during the initial focused UI stage. The subsequent separately authorized Android integration run is recorded in `../android-integration/`; no release was performed. Final builds, system-sheet CUA evidence, and the shared build-tree cleanup remain with the coordinator. Focused tests reused the shared project build tree; it is retained while those concurrent tasks are active, per the post-build-cleanup skill.

## Stable interaction keys

Existing workbench keys remain. Region chips: `region.mainland`, `region.HK`, `region.MO`, `region.TW`; HK parameter: `prefix.input`; archived restoration note: `profile.archived`.

Picker: `address.picker`, `address.results`, `address.search`, `address.search.clear`, `address.group.<code>`, `address.parent.<code>`, `address.code.<code>`, `address.current`, `address.history`, `address.back`, `address.cancel`, `address.confirm`. Only leaf `address.code.*` items can be confirmed. In VN, group keys use the current two-digit administrative code, while leaf keys use the historical three-digit code. Rule catalog items: `rule.<profileId>`.

## Post-review Taiwan permission fix

An independent reviewer found a valid cross-platform package with current prefix A and `allowHistorical=true`. Flutter previously inferred permission from the selected prefix and silently changed the flag to false on regeneration. The workbench now retains an independent permission value: profile changes reset it, import restores it exactly, and only a confirmed change to another area derives a new value. Picker cancellation and same-code confirmation preserve the imported value.

`tw-permission-before.log` records the focused failure; `tw-permission-after.log` records the passing regression. The regression compares complete configuration and cases through import → Generate → export, then checks cancellation, same-code confirmation, a real change to B and profile reset. All 21 widget tests pass afterward. The initial six-case Android device run preceded this fix and remains accessible as `../android-integration/summary-first.json`. The final post-fix run passed all six business cases in approximately 82 seconds, exit 0, with matching pre/post source hashes; see `../android-integration/summary.json`, `drive-final.log` and `response-final.json`. The coordinator’s final full quality gate passed 53 Flutter tests, formatting and analysis; the Node suite passed 28 tests. Ordinary AOT artifacts and native system-sheet acceptance retain their separate evidence boundaries.
