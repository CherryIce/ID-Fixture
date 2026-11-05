# 启动与 Android 交互修订记录

结论：本轮启动修订与Android专用模拟器完整交互验收通过，独立复核通过。

日期：2026-11-04（Asia/Shanghai）。范围：关闭上一阶段 iOS 模拟器启动黑段、核查 Android 首启慢并补齐专用模拟器交互证据。未升级 Flutter/SDK，未改生产签名或上传商店。

## iOS：资源封装签名修复已通过

上一阶段以 CODE_SIGNING_ALLOWED=NO 构建模拟器包，Mach-O 仅有 linker 签名，Info.plist 未绑定且没有资源封套。系统 SplashBoard 历史日志直接报出读取 LaunchScreen nib 的 Security -67056 资源校验失败，随后拒绝生成启动快照。`security error -67056` 对应“code has no resources but signature indicates they must be present”。

保持同一 bundle ID 和应用数据，仅补齐本地 ad-hoc 签名，黑段消失。最终 `tool/build_ios_simulator.sh` 限定 iphonesimulator，使用 Manual / CODE_SIGN_IDENTITY=- / 空 Team，由 Xcode 正确签署嵌套代码与资源；不使用开发者证书或设备签名。

最终脚本产物已全新安装后首启，再连续三次终止进程冷启动。四组录像逐帧接触表未再出现原先的整窗黑段；0.2 秒采样均无全黑视口样本，日志无对应资源验证或 denylist 拒绝。此结论限本次 iPhone 17 / iOS 26.5 专用模拟器与该产物，不代表真机或短于采样间隔的绝对保证。

首次两页引导完成、生成、检查展开及重启跳过引导另有真实 CUA 操作证据。最终完整签名含 Info.plist 37 项与 98 个封装资源文件。交付 ZIP 仅有 102 个应用文件，逐文件与已验证应用一致，无 AppleDouble 或 __MACOSX 额外文件。

证据：`evidence/startup-revision/ios-final-signature.log`、`ios-final-fresh-contact.jpg`、`ios-final-repeat-1..3-contact.jpg`、`ios-final-visual-stats.json`、对应原始视频/系统日志、`artifacts-final.json`。

## Android：同源构建模式对照已通过

独占 Pixel 7 / Android 15 API35 / arm64 AVD，等待系统开机稳定；未操作原有 emulator-5554。每种模式首次安装后启动一次，再 force-stop 后冷进程启动两次；未丢弃系统文件缓存，首装与重复启动分开记录。

| 构建 | 安装后首次 | 第2次冷启 | 第3次冷启 | 三次中位数 |
| --- | ---: | ---: | ---: | ---: |
| Debug arm64 | 2340 ms | 1531 ms | 1853 ms | 1853 ms |
| AOT arm64 本地验收 | 934 ms | 804 ms | 870 ms | 870 ms |

六次 am start 均为 Status ok，系统 Displayed 与 Fully drawn 时间一致。Debug 首次有 kernel/snapshot 资源提取，日志跨度 286 ms；AOT 无这些提取日志。上轮新 AVD 忙碌条件下的约13秒 timeout 不能作为本表的同条件基线或源码优化幅度。

没有证据指向业务初始化阻塞，故不猜测改动偏好存储、主入口或原生生命周期。修订落在交付和测量方式：`tool/build_android_local.sh` 固化 arm64 AOT 本地验收包，用既有 Android Debug 证书签名；18,178,677 字节，输出 SHA 与测量包完全相同。它不是生产签名或商店发行包。

证据：`android-debug-startup-results.json`、`android-release-startup-results.json`、对应原始 logcat / am-start / 宿主及模拟器负载、`android-final-local-build.log`、`artifacts-final.json`。

## Android 完整交互

5组 Android 模拟器实际运行的集成测试全部通过（退出码0，约50秒；console的+7含setup/teardown，不是7个业务测试），响应包含18项完成检查。使用真实偏好存储、平台服务和100条系统剪贴板回读，覆盖引导完成/跳过/重看、CN参数与正反例/错误恢复/Unicode种子、NY州必选/护照/VN禁用/规则目录、中英语言与深浅外观/恢复系统。

最终五例日志为 android-integration-fourth.log，结果为 android-integration-response.json 与 android-integration-summary.json。

普通AOT包已用真实数值软键盘完成 Quantity=0 报错→Backspace改3→成功生成3条，seed文字软键盘及Done另有真实画面。此专用AVD的预装Gboard曾出现数值布局为空，重置该临时设备的Gboard测试数据后恢复；没有修改产品输入类型或宿主键盘。

系统分享已真实完成打开、取消、重开，并选择独立本地QA接收器。接收器仅验证合法FileProvider临时READ授权并将原始bytes存到本机Downloads；它没有网络/存储权限，不读取产品私有目录，不捆绑进产品，也不向外部账号发送。最终真实AOT导出4735字节，SHA256为0432396c17f56c7efb52ed277ca066b925af062eddd6b66b6b75a42ac72c9fe4，接收后逐字节读回一致；该JSON另被独立JS规则引擎复现，3条结果零差异。证据为 android-manual-share-receiver.png、android-aot-original-export.json 和 android-native-export-js-verification.json。

同一份真实导出文件已通过系统picker在Downloads/IDFixture-QA选回，预览取消→重选→确认复现，3条结果一致。四类原生错误也已实际选入：损坏JSON、engineVersion=999、CASE001号码篡改、1,048,577字节超限；对应错误/差异提示正确，关闭后原CN/东城/2000-01-01/随机/正例/count3/seed0与三条结果均保留。证据为android-manual-original-preview.png、original-replay-success.png、invalid-json.png、wrong-version.png、tampered-difference.png、over-1mb.png与errors-config/results-retained.png。错误后又先切US清空旧结果，再从同一原文件确认回放，实际恢复CN与三条结果，完成有效导入恢复。普通AOT进程也实测force-stop（PID3219已消失）→重启为PID4822，中文+深色和已完成引导均保留；随后将语言与外观都恢复跟随系统。此过程仅偏好持久化，号码不作历史保存，符合设计。证据为android-manual-recovery-us-before.png、recovery-cn-three-after.png、prefs-before-restart.png、prefs-after-restart-home/settings.png和android-manual-process-restart.json。

已有34项 Dart/Widget 回归全部通过，format/analyze（含集成测试最终修订后再检查）通过。前三轮新增集成测试的绑定懒初始化、旧文案及真实 IME 同步问题均保留失败日志；最终修订只限测试harness，未修改产品源码，也未绕过数量恢复断言。真实按键0→3已由最终普通AOT包的CUA流程独立交叉验证。

## 交付与保留边界

最终产物清单及哈希在 `evidence/startup-revision/artifacts-final.json`。iOS ZIP 仅用于 Apple Silicon 模拟器；Android APK 是 arm64 AOT / Debug 证书本地验收包。真机、iPad 分享、其他 Android 版本/厂商文件提供商、正式签名、归档和商店提交不在本轮已验证证据内。

本轮已清理 5,405,343,744 分配字节（约5.41 GB，非可用空间精确增量），含项目内闲置编译/测试/模块缓存、逐帧临时图及专用Android AVD。专用5556已停止；唯一临时AVD索引核对inode/hash后移除，原5554与其他项目未被操作。源码、测试、工具、锁文件及安装包清理前后内容校验一致，依赖未列入删除目标，最终两份交付包SHA256再次核验。混有App/framework/SO/JAR/APK的受保护子树、原始证据和诊断包保留，未清全局共享缓存；专用iOS应用仍可查看。明细见evidence/startup-revision/CLEANUP.json。
