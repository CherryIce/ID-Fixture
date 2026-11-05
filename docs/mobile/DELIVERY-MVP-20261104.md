# 证号实验室 Flutter本地首版交付

日期：2026-11-04，Asia/Shanghai。依据：用户在产品方案和交互原型之后要求“继续下一个流程”。本轮推进Flutter iOS/Android本地实现，不包含生产签名、真机安装、上传、商店提交或对外部署。

本轮结论：代码与调试产物已实现；限定核心功能验收通过，完整验收仍有缺口。iOS 26.5模拟器冷启动短暂黑色过渡未闭合；Android最终APK已在独占Android 15模拟器安装并显示英文首次引导，但首次冷启命令超时后才渲染，未通过启动性能验收。构建和首屏证据不代表完整双平台功能、性能或商店就绪。

## 入口与制作基线

- 工程：flutter_app/，全新子目录，父目录无Git仓库；既有浏览器原型与历史记录保留。
- 安装/测试产物：outputs/ID-Fixture-1.0.0-1-debug.apk、outputs/ID-Fixture-1.0.0-1-ios-simulator.zip；最终大小及SHA256见evidence/artifacts.json。
- 复现：Flutter 3.35.7、Dart 3.9.2、Xcode 26.5、CocoaPods 1.17.0；FVM和pubspec.lock保留。Android使用现有Android Studio JBR、项目Gradle 8.12，未升级全局SDK。
- iOS验证bundle为dev.idfixture.idFixture，Android为dev.idfixture.id_fixture，均是开发占位标识。iOS验证明确关闭签名；未使用自动选中的开发团队、未创建证书。Android交付为Debug APK，Release签名未配置。

继续沿用测试工具定位与原规则范围；未把国家数量、平台迁移或通过测试当作市场/差异化验证。未开展用户访谈，不改写此前市场needs_revision结论。

## 已实现能力

| 能力 | 实现与范围 | 当前证据 |
| --- | --- | --- |
| 国家/证件/必要州联动 | 中国3区演示、纽约驾照格式、新一代护照本格式；越南可见但禁用 | Widget测试；iOS中国路径实际操作 |
| 单条/小批量/正反例 | 1–100条、仅批内去重；反例显示全部实际失败项 | Dart/Widget测试、iOS生成与逐项展开 |
| 跨浏览器/Flutter复现 | 固定seed、PRNG、规则/引擎版本及数据哈希；保留前导零、空格和Unicode | 52个JS生成包及1个实际浏览器导出包在Dart逐项一致 |
| 原生文件/分享 | 用户选JSON，流式1MB上限；系统分享可存到文件，回读先预览再确认 | iOS实际保存到Files→系统picker选择→确认重放；保存字节与原临时文件一致 |
| 反向兼容 | Flutter导出的实际原生文件可由浏览器引擎重放 | native-file-roundtrip.json，javascriptReplayMatches=true |
| 错误/取消/版本差异 | 不执行不可信文件，不自动更新规则；取消/错误保持现有结果，成功重放清旧错误 | Widget与引擎测试；原型历史回归沿用 |
| 语言/外观/持久化 | 系统优先、zh-Hans/en、英文回退，显式覆盖保存/系统模式移除覆盖 | 设置单元/Widget；iOS中文浅色、英文深色切换与恢复 |
| 首次引导 | 两页，可跳过/完成，重看不清完成状态；存储失败允许会话继续并警告 | Widget；iOS完成后终止重开直达工作台 |
| 原创图标与启动 | SVG/Pillow可重现源，替换iOS全套图标和Android legacy/adaptive；原生背景随系统 | iOS安装后图标与启动图实际可见；Android原生启动图标和英文引导实际可见，桌面launcher图标未验 |

实际签发、持有人、真实性和有效性始终未知。没有政府查询、生产表单或账号接入。导出临时副本可能留在应用系统缓存；不宣称零落盘或可以撤回外部分享。

## 测试与构建证据

evidence/quality.json记录最终命令与退出码，format.log、analyze.log、tests.log记录结果：格式与分析通过，34测试通过（17引擎、12Widget、5设置）。包含独立校验向量、日期/性别、确定性、严格包校验、篡改拒绝、种子空格、旧错误、弹层取消/重开、存储失败出口及320宽200%文字的操作可达。

iOS使用本项目.codex-build/DerivedData和build/ios，最后构建日志ios-delivery-build.log；此前首次Flutter默认构建也通过，之后改为明确的本地DerivedData路径，未清理共享DerivedData。Android最后构建为android-delivery-build.log。所有安装包复制到outputs并核验后才清理本地可丢弃中间目录。

独立只读Reviewer检查domain、services、UI、原生权限/图标/启动及依赖，未发现未解决的静态P0/P1/P2。默认计数器测试、zh-Hans构造、首次引导存储失败恢复和警告文案均已修正。此静态结论不关闭下述运行视觉问题。

## iOS实际运行范围

专用设备：ID Fixture Validation，iPhone 17，iOS 26.5，UDID B4B102C1-3F49-4EA8-9497-B4A506CB5292，Debug构建。未在用户真机或既有LangPack模拟器执行测试。会话中验证设备曾被外部关闭，之后仅恢复本任务设备；不把Shutdown状态当成App崩溃。

已检查：安装图标、首次两页引导与完成、返回用户启动、CN生成/检查展开、系统分享及保存Files、原生picker导入/预览/确认重放、语言/外观操作层、中文浅色/英文深色、输入软件键盘和完成后的恢复。截图与文件字节证明见evidence/ios-*.png和native-file-roundtrip.json。

小屏/200%文本有Widget证据，未在第二款模拟设备或真机做相同渲染；读屏、真实离线网络切换、真机文件提供商、iPad分享定位及全平台原生冷启动尚未验证。分享锚点已用真实按钮RenderBox，并有Widget覆盖，不能代替iPad运行验收。

## 未闭合问题与下一步

P2：iOS 26.5 Debug模拟器冷启动在原生[1]出现之前有短暂黑色窗口。CLI启动与主屏幕图标启动均复现，之后应用正常显示和操作。原生LaunchScreen声明、资源成员关系与PNG均已核对，未找到可确认的配置缺失原因。

做了一次受限修订：Main/现有window/root view背景改为动态LaunchBackground；异步偏好初始化期间deferFirstFrame，并在finally配对allowFirstFrame，不增加延时、重建window或更改Scene/SDK。专用模拟器重启后的复测仍有黑段，因此没有写成“已修复”。evidence/ios-startup-final.mp4和ios-startup-final-contact-sheet.jpg保留实际结果。录像含工具预录段，时间戳不作为启动耗时指标。

这仍需后续区分系统启动截图、原生窗口与Flutter首帧阶段；不能仅因随后出现[1]就认定系统启动画面正常，因为Flutter也会加载同一splash视图。参考[Apple TN3118](https://developer.apple.com/documentation/technotes/tn3118-debugging-your-apps-launch-screen)及[Flutter对应版本源](https://github.com/flutter/flutter/blob/3.35.7/engine/src/flutter/shell/platform/darwin/ios/framework/Source/FlutterViewController.mm)。首帧控制依据[官方deferFirstFrame API](https://api.flutter.dev/flutter/rendering/RendererBinding/deferFirstFrame.html)，不是已证实的根因解释。

Android限定运行：只使用既有API35/Android 15 arm64镜像创建项目内Pixel 7 AVD，串号emulator-5562，未下载镜像。前3次因空间预检失败；环境可用空间后来恢复至约10GB后，第4次成功开机。最终APK哈希匹配并安装成功，已实际看到原生启动图标及英文首次引导，截图为android-native-launch.png、android-first-onboarding.png。am start -W返回timeout（WaitTime 12735ms），随后首屏正常渲染、进程存在且未见已检查日志中的崩溃信号，因此不宣称冷启流畅或性能通过。未操作引导按钮、Android核心流程/文件交互、桌面launcher图标或真机。最终记录见android-runtime.json及日志；5562已停止且进程退出0，5554始终未被操作。临时AVD数据随后按技能清理，未扩大为清理其他项目或全局SDK。

下一阶段应先关闭启动视觉问题并补齐Android核心交互、启动性能及真机证据，再考虑发布预检；本轮没有App Store/Google Play就绪结论。

## 加密与外部动作

应用自有代码只做格式、MOD11校验与确定性随机；文件、偏好、分享及打开来源使用系统接口。当前原生依赖未发现自有数据加密；Dart uuid/crypto用途为digest/随机，不是数据加密功能。独立Reviewer核对后将ITSAppUsesNonExemptEncryption设为Boolean false，实际模拟器bundle也核实该值；依赖清单见pubspec.lock、Podfile.lock。没有检查正式Archive，依赖或功能改变时须重新判断。[Apple说明](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption)

没有创建生产标识、证书、账号、后台或费用，没有提交、推送或发布。未开展正式法律或商店评估；发行市场与商业模式仍未决定。

## 清理与保留

按照post-build-cleanup执行精确路径预览和删除，并比较源码/依赖/包配置及交付文件。首批删除47个已闲置目录，分配空间合计972480512字节；记录在cleanup-preview.json、cleanup-applied.json及source-before-cleanup.json。删除结果与路径消失已核对。

各批清理分配空间合计3306979328字节（约3.31GB），包括验证重建后再次清理的目录；最终记录见cleanup-final-summary.json及android-cleanup-applied.json。此数值不是可用磁盘空间的精确增量。不会声称整个build根已删除：含App/framework/SO/JAR/APK等受保护产物或依赖的混合子树继续保留，保护脚本拒绝后未绕过；源码、Pods、SDK、锁文件、全部交付包和必要证据保留。共享/global缓存与其他项目未清理。专用iOS应用保留用于查看；没有Android新模拟器进程残留。
