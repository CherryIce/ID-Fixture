# Android 实际应用交互测试

范围：`integration_test/android_workflow_test.dart`直接运行`IdFixtureApp`，使用真实`NativePreferenceStore`和`NativePlatformServices`；没有替换平台服务，没有增加产品测试入口，也没有修改`lib/`或原生代码。

本套测试实现先经静态检查，现由Coordinator授权在专用emulator-5562运行；最终计数以保存的运行日志与响应报告为准。分析通过或代码存在不能作为Android运行通过。旧emulator-5554不得操作。

## 运行

在`flutter_app`目录选择已确认属于当前任务的Android设备。不要指向用户真机或其他任务的模拟器。

```sh
flutter drive \
  -d emulator-5562 \
  --driver=test_driver/integration_driver.dart \
  --target=integration_test/android_workflow_test.dart \
  --no-pub
```

这里的设备ID只是本次环境候选值，执行前由Coordinator核对。也可直接运行：

```sh
flutter test integration_test/android_workflow_test.dart -d emulator-5562 --no-pub
```

driver默认把响应数据写到`docs/mobile/evidence/startup-revision/android-integration-response.json`，可用`ID_FIXTURE_INTEGRATION_REPORT`指定精确输出路径。响应只含布尔值、检查名称和范围说明，不记录号码或剪贴板内容。必须结合命令退出码及完整运行日志判断结果；报告文件本身不证明全部测试通过。

## 自动覆盖

- 本App三个偏好key清空后的两页引导完成、跳过、设置重看，以及真实偏好存储回读。首个引导测试保留语言/外观的无覆盖默认状态。
- 中国3区演示中的地区和编码性别选择、日期选择器取消/重开、100条生成、逐步显示、展开检查、含空格及Unicode种子的重新生成一致性。
- 真实系统剪贴板复制100条并回读比较，随后恢复原有文本；日志不输出号码。
- 数量错误后恢复、校验位反例及未知签发状态。
- 纽约州必选、恢复后生成、护照本格式、切换上游清旧结果、越南禁用及范围说明、规则目录/详情/返回。
- 设置弹层取消后重开、英文/深色保存、重新创建应用Widget后从真实偏好存储回读、浅色切换及恢复跟随系统时删除覆盖。

每个测试仅清除此App的语言、主题、引导三个key，不清系统/全局偏好。测试结束将本App留在已完成引导、语言/外观跟随系统的状态。应用Widget重新创建加真实存储回读不等于OS进程冷启动；冷启动/系统启动页仍属于Coordinator单独的运行证据。

## 必须单独手动验证

原生系统分享、选择器和跨系统界面的文件回读路径不由这套Flutter集成测试自动操作。`integration_test`只覆盖Flutter树，不能把按钮存在、domain包测试或Widget假服务测试冒称为真实系统交互。

Coordinator须用CUA单独完成：生成→系统分享→保存JSON文件或明确取消→系统文件选择器选回实际文件→包预览→取消/确认重算→版本错误/篡改提示→关闭后重开。实际分享/保存目标的结果、选择器取消和错误恢复需分别记录。此次测试不增加注入文件入口，也不通过伪造`PlatformServices`跳过这些步骤。

这套测试没有覆盖真机、系统语言/外观实际切换、Android系统文字大小、原生启动页时间线、外部来源浏览器或商店行为。已有Widget测试中的320宽/200%文字也不能替代这些原生环境证据。

运行前可靠性复核：每次滚动定位后等待布局稳定并核对目标可点击；Cupertino选项须先确认ActionSheet存在；所有pumpAndSettle限制为20秒，避免动画导致无期限等待。未更改产品代码。

首轮运行暴露测试入口初始化缺陷：Dart顶层final为懒初始化，testWidgets注册时先创建了Live binding，之后访问Integration binding报already initialized。已将IntegrationTestWidgetsFlutterBinding.ensureInitialized()明确放到main的首行；不涉及产品代码。首轮日志保留android-integration-first.log，首轮已中止，不计为产品功能失败。


## 最终运行结果

第四轮命令正常退出0，五项业务设备测试全部通过，运行约50秒。控制台`+7`包含setUpAll/tearDownAll，不应报成七项业务测试。最终完整日志为`android-integration-fourth.log`，响应为`android-integration-response.json`，运行总结与测试源哈希为`android-integration-summary.json`。测试/driver静态分析日志另存`android-integration-analyze.log`。

第二、三轮失败轨迹均保留：越南断言曾沿用“本原型”旧文案，已改为当前profile的精确完整限制文案并滚动确认；`tester.pageBack`在SDK中先找英文Back，中文Material返回键改为按真实BackButton类型定位。数量恢复则通过每步controller断言证实，注入3后立刻仍为0，发生在scenario切换之前。本机SDK `flutter_test/lib/src/test_text_input.dart`明确记录integration_test真实IME连接存在输入注入混淆风险；helper改为实际点击聚焦/稳定连接、注入后发送该字段配置的输入动作（数量next、种子done）提交，未直接写controller、未删除错误恢复判据。第四轮数量3在输入后、切换反例后、生成前和生成后四个阶段均匹配，完整反例和恢复测试通过。这是测试输入可靠性修订，不是对产品源的修复；也不能替代CUA实际键盘输入验收。

设备已释放给后续原生系统流程验证。测试安装的是integration debug目标，后续手动验收应先恢复Coordinator保留的普通AOT应用；设备留为已完成引导、语言/外观跟随系统。旧5554、旧预览服务和其他进程未操作。构建缓存由Coordinator在全部验证结束后统一清理。
