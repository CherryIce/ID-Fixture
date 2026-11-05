# ID Fixture 移动端交付记录

2026-11-04（Asia/Shanghai），本轮启动修订及Android专用模拟器完整交互验收通过。完整细节与原始证据索引见 [启动与Android交互修订记录](STARTUP_REVISION.md)，上一阶段记录原样保留在 [MVP阶段交付记录](DELIVERY-MVP-20261104.md)。

- iOS 26.5：定位到模拟器包缺少完整资源签名，引发系统LaunchScreen校验失败；使用完整本地ad-hoc签名后，全新安装首启及3次进程冷启动逐帧复测通过，没有再出现原先整窗黑段。仅模拟器签名，不使用开发者证书或Team。
- Android 15：同源Debug与arm64 AOT在稳定开机的专用AVD对照。Debug首次2340ms，中位1853ms；最终AOT本地验收包首次934ms，三次中位870ms，全部Status ok。旧版13秒timeout的系统负载条件不同，不用作同条件优化幅度。
- 回归：34项Dart/Widget测试通过；5组Android设备集成业务测试通过，真实偏好存储/100条剪贴板/引导/国家与规则联动/正反例/错误恢复/双语和外观覆盖均有证据。最终格式与分析无问题。
- 普通AOT包另完成真实数值键盘0报错→改3生成，系统分享打开/取消/重开，合法临时FileProvider授权→独立本地QA接收器保存→系统picker选回同一4735字节JSON→预览取消/重选确认→三条结果一致。该实际导出亦经独立JS引擎复现，零差异。QA接收器只是独立testOnly夹具，不进入产品APK，也不向外部账号发送。
- 损坏JSON、错误版本、篡改号码、超1MB均经真实系统picker验证，原参数和结果保留；随后切US再导回原包，恢复CN三条。普通AOT进程实际停止/重启后，中文深色与已完成引导保持，再将偏好恢复跟随系统。

## 最终产物

| 产物 | 性质 | SHA256 |
| --- | --- | --- |
| [Android APK](../../outputs/ID-Fixture-1.0.0-1-android-arm64-local-test.apk) | arm64 AOT，既有Android Debug证书，本地验收用，18,178,677字节 | b04b9b478cf737f846e31b12e6c87d2d81f5fa7344869fadc804cd0be4d11ddb |
| [iOS模拟器ZIP](../../outputs/ID-Fixture-1.0.0-1-ios-simulator-signed.zip) | 完整ad-hoc模拟器App，36,754,406字节；102文件与已验证应用一致，无额外AppleDouble文件 | d6d40c69c3f4d70d590d24ac8d2225f524a99bce3dab0ad6c35658d71fcd05b7 |

构建方法在flutter_app/tool/build_ios_simulator.sh与build_android_local.sh。Flutter3.35.7/Dart3.9.2、Xcode26.5与现有Android工具链未升级；没有为测试改动产品主入口、偏好或原生生命周期，变化集中在可复现构建、设备测试和独立QA夹具。

证据总目录为evidence/startup-revision/。产物清单见artifacts-final.json；五例集成测试见android-integration-summary.json；真实文件/输入/重启见MANUAL_ANDROID.json与android-manual-*.png；启动原始日志及录像保留。

真机、iPad、其他Android版本/厂商文件提供商、正式生产签名、归档与商店提交未在本轮验证。不扩大证件覆盖：中国仍仅2022北京3区演示，美国仍仅NY DMV和护照公开格式，越南待核禁用；不证明真实身份有效。未做用户访谈或市场差异化复核，保留原产品研究结论。

本轮已清理 5,405,343,744 分配字节（约5.41 GB，非可用空间精确增量），含项目内闲置编译/测试/模块缓存、逐帧临时图及专用Android AVD。专用5556已停止；唯一临时AVD索引核对inode/hash后移除，原5554与其他项目未被操作。源码、测试、工具、锁文件及安装包清理前后内容校验一致，依赖未列入删除目标，最终两份交付包SHA256再次核验。混有App/framework/SO/JAR/APK的受保护子树、原始证据和诊断包保留，未清全局共享缓存；专用iOS应用仍可查看。明细见evidence/startup-revision/CLEANUP.json。 未初始化Git、未提交或推送。
