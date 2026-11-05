# 本地Android共享接收验收夹具

这个接收器仅为本次原始JSON字节往返验证而建，独立包名`dev.idfixture.qa.share_receiver`，不属于产品功能、不捆绑产品、不发布。API29+；`testOnly=true`、`debuggable=false`，manifest不声明网络或危险存储权限。没有Launcher入口，从系统Sharesheet接收`ACTION_SEND application/json`。

## 已构建交付

APK：`docs/mobile/evidence/startup-revision/native-share-receiver/QA.apk`。完整离线构建日志、编译后manifest/权限/签名校验及SHA256在同目录`build.log`、`build-report.json`。没有运行或安装设备；实际系统行为仍需Coordinator验收。

源码仅用Android/Java SDK，无Gradle、下载或第三方依赖。重建：

```sh
python3 /Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/flutter_app/test/native_share_receiver/build.py
```

使用已有SDK35构建工具、android-36/android.jar、Android Studio JBR和既有debug.keystore签名；不创建证书。中间输出仅在当前Flutter项目`.codex-build/share-receiver-build/`，由Coordinator保留证据后统一清理，保护其他构建与模拟器目录。

## Coordinator安装命令

以下命令仅供当前任务设备所有者在其交互空档执行；本子任务没有执行：

```sh
/Users/starburst/Library/Android/sdk/platform-tools/adb -s emulator-5562 install -t -r /Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/docs/mobile/evidence/startup-revision/native-share-receiver/QA.apk
```

不要操作旧5554。安装后在最终AOT主应用生成用例→导出→Android系统Sharesheet→用户选择“ID Fixture QA Receiver”。不能用直接启动Activity或私有cache读取替代真实Sharesheet授权。

## 授权及原始字节路径

接收器只接受精确authority `dev.idfixture.id_fixture.flutter.share_provider`的`content://`URI。必须同时含临时`FLAG_GRANT_READ_URI_PERMISSION`、且Android `checkUriPermission`对本接收器UID返回GRANTED，再通过`ContentResolver.openInputStream`读取；不申请持久URI权限，不使用root，不读取产品私有文件系统路径，也不修改产品debuggable属性。

原始输入限1MiB；不解析、重排或重新序列化JSON。文件名取FileProvider的DISPLAY_NAME，仅接受本产品安全ASCII JSON名称。为避免同名碰撞，写入`Download/IDFixture-QA/receive-<唯一标识>/<原JSON名>`，每次独立子目录，保留原basename，不覆盖已有捕获。

通过MediaStore.Downloads创建本接收器所有的pending记录，写入原bytes，再读回逐字节与SHA256比较。比较成功才公开文件；失败仅移除本次新建row。界面显示授权、authority、原文件名、字节数、SHA256、实际公开位置和读回一致状态。“完成并返回”结束接收器。

接收器显示Saved后，主应用可通过系统文件选择器进入Downloads→IDFixture-QA→该次receive子目录→选回同名JSON，继续包预览/确认复现。这里只证明合法共享授权、原字节保存和回读路径；不证明号码真实签发或身份有效。验收结束是否卸载QA包由Coordinator处理，不随主包交付。

## 已知构建轨迹

首轮编译/签名成功，但构建脚本最小SDK检查误用了旧badging标签`sdkVersion`而非当前aapt2输出的`minSdkVersion`，因此报告阶段报错。首轮日志保存为`build-attempt1.log`；修正检查后重建通过。产品代码、权限或签名配置均未改变。
