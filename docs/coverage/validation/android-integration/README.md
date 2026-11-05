# Final Android coverage integration — 6/6 passed

The final run **after the Taiwan permission fix** passed all **six business test cases**, normal exit code **0**, approximately **82 seconds** of test runtime. The console `+8` includes one setup and one teardown entry. It is not eight business cases. No reliability edits or failed attempts were required for the final source.

- `drive-final.log`: complete final build/install, VMService connection, device execution, warning and result log.
- `response-final.json`: actual final driver response with 20 completed checks and native-service scope.
- `summary.json`: final machine-readable result, source hashes, history, device handoff and boundaries.
- `source-final-before.json` / `source-final-after.json`: matching hashes for the seven key source/test files before and after the final device run.
- `drive-first.log`, `response-first.json`, `summary-first.json`: preserved initial six-case run before the localized Taiwan permission fix (exit 0, approximately 76 seconds); these do not replace the final result.
- `analyze-final.log`: driver and integration suite, zero issues (exit 0). The coordinator's final full quality gate at `../quality-final/20261105T183503+0800/quality-gate.json` passed formatting, analysis and **53 Flutter tests**. The Node suite passed **28 tests**.

The six cases exercise onboarding completion/reload; skip/replay; CN address/date/sex, 100-case generation, Unicode+space seed, true system clipboard copy/readback and count 0→3 error recovery; NY mandatory state and passport plus Vietnam group 24→027 and rules; four China regions with draft cancellation, city reference and explicit historical Taiwan prefix; and native language/theme persistence with return to system defaults. App Widget recreation with a real native preferences reload is tested; this is not an OS process restart claim. The separate 21-widget suite includes the precise current-prefix A plus `allowHistorical=true` import/regenerate/export regression.

The suite uses `NativePreferenceStore` and `NativePlatformServices`. It does not automate the native Sharesheet, file picker or their import/replay path. Those and ordinary AOT acceptance remain separate coordinator/manual checks. The full log contains an `integration_test plugin was not detected` warning. The VMService driver nevertheless received the successful result and complete response data; this run does not claim Android instrumentation coverage.

The driver report destination remains configurable through `ID_FIXTURE_INTEGRATION_REPORT`; its default is this coverage evidence folder, and the SDK's `writeResponseOnFailure` option is enabled to retain partial response data on future failed test runs.

Final run (from `flutter_app`):

```sh
JAVA_HOME='/Applications/Android Studio.app/Contents/jbr/Contents/Home' \
ID_FIXTURE_INTEGRATION_REPORT='/Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/docs/coverage/validation/android-integration/response-final.json' \
flutter drive --no-pub -d emulator-5562 \
  --driver=test_driver/integration_driver.dart \
  --target=integration_test/android_workflow_test.dart
```

Only the dedicated API 35 `emulator-5562` was addressed. `emulator-5554` and the older preview service were untouched. Flutter drive's default stop uninstalls its test app; the package was absent and `boot_completed=1` after the final run. The AVD remained booted and was handed back to the coordinator for installation of the retained final ordinary AOT APK. No further device input was performed by this executor after handoff.

The post-build-cleanup skill was applied. No build data were deleted: the coordinator explicitly needs shared build output and the running AVD for the next validation step. No process was stopped, no AVD was closed, and no global cache was cleaned. Final protected cleanup remains with the coordinator.
