# Flutter Quality Gate

Generated: 2026-11-05T18:09:31+08:00
Project: `/Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/flutter_app`
Verdict: `passed`
Git: not a Git repository

| Step | Status | Command | Duration | Full log |
| --- | --- | --- | ---: | --- |
| format-check | `passed` | `/opt/homebrew/share/flutter/bin/dart format --output=none --set-exit-if-changed lib test` | 1.523s | `/Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/docs/coverage/validation/quality/20261105T180931+0800/format-check.log` |
| flutter-analyze | `passed` | `/opt/homebrew/bin/flutter analyze --no-pub` | 2.711s | `/Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/docs/coverage/validation/quality/20261105T180931+0800/flutter-analyze.log` |
| flutter-test | `passed` | `/opt/homebrew/bin/flutter test --no-pub --reporter expanded` | 15.993s | `/Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/docs/coverage/validation/quality/20261105T180931+0800/flutter-test.log` |

## Evidence limits

- Formatting, analyzer, and automated tests do not prove simulator or physical-device behavior.
- An Android debug APK is not a Play release artifact; Gradle may create or use a local debug keystore for that explicitly requested build.
- An unsigned iOS archive does not prove signing, installation, upload, TestFlight, or App Review.
- This script never performs production signing, changes production certificates/accounts, uploads, or submits; an explicitly requested Android debug build may create or use a local debug keystore.
