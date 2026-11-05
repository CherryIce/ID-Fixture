# ID Fixture · 证号实验室

离线合成证件号码测试工具，当前版本 **1.1.0+2**。选择国家、区域和证件，配置测试参数，生成可解释的正反用例，并通过锁定规则版本的 JSON 用例包导出和复现。

不使用账号、后端、遥测或真实身份核验。合成值可能与真实号码重合；格式和校验通过不证明签发、归属或有效性。

## 覆盖范围

| 区域 | 已实现范围 |
| --- | --- |
| 中国大陆 | 31 个省级分组、2,851 个公开参考候选代码；GB 11643 结构和校验。候选目录不是公安实际发号全集。 |
| 中国香港 | 单/双字母前缀、六位数字与公开校验规则。 |
| 中国澳门 | 八位数字公开格式；校验算法未知，保持未知状态。 |
| 中国台湾 | 22 个现行地区前缀，另四个历史前缀需显式选择；公开校验规则。 |
| 越南 | 34 个现行省市导航到 63 个公开历史出生地码；十二位公开结构，当前新签发分配对应关系未知。 |
| 美国 | 纽约州 DMV ID 与新一代护照本公开格式。 |

旧版大陆三地区及美国用例保持原 1.0 引擎回放，导入时不静默升级。

## 目录

- [flutter_app/](flutter_app/)：iOS / Android Flutter 应用、平台工程、测试和构建工具。
- [prototype/](prototype/)：可直接运行的浏览器预览与 JavaScript 引擎。
- [data/coverage_snapshot.json](data/coverage_snapshot.json)：版本化规范数据；Dart / JavaScript 数据由同一脚本生成。
- [docs/coverage/DELIVERY.md](docs/coverage/DELIVERY.md)：1.1 覆盖说明、验证结果与限制。
- [docs/coverage/FINAL_REVIEW.md](docs/coverage/FINAL_REVIEW.md)：独立审查结论。
- [docs/coverage/evidence/](docs/coverage/evidence/)：官方规则及地区数据的来源、快照和哈希。

## 本机预览

在仓库根目录运行：

```sh
python3 -m http.server 8743 --bind 127.0.0.1 --directory prototype
```

打开 <http://127.0.0.1:8743/standalone.html>。单文件内嵌运行资源，无需安装前端依赖；`file://` 行为未验证。修改源文件后可运行 `node prototype/package-preview.mjs` 重新生成。

## 应用开发

基线为 Flutter **3.35.7** / Dart **3.9.2**，见 [flutter_app/.fvmrc](flutter_app/.fvmrc)。iOS 13+，Android API 24+；原验证环境为 Xcode 26.5 和 Android API 35 模拟器。

```sh
cd flutter_app
flutter pub get
flutter analyze --no-pub
flutter test --no-pub

# 本地 arm64 AOT APK，使用已有标准 Android Debug 证书
./tool/build_android_local.sh

# 仅 iOS 模拟器，完整 ad-hoc 资源签名
./tool/build_ios_simulator.sh 'id=<模拟器UDID>'
```

仓库包含标准 Gradle Wrapper。Android SDK、本机路径配置、Pods、包缓存和签名资料需要在开发机准备，不能从本仓库获取。

规则引擎检查可在仓库根目录运行：

```sh
node --test prototype/engine.test.mjs prototype/coverage_engine.test.mjs
```

规范数据生成：`python3 flutter_app/tool/generate_coverage_data.py`。

## 验证及交付边界

1.1 本地修订通过 **53 项 Flutter 检查、28 项 JavaScript 检查、6 项 Android 集成业务用例**。iOS 完成构建、完整资源签名、安装启动及主屏呈现；新地区完整手动交互未逐项验证。Android 系统分享和文件选择本轮未重测，历史记录单独保留。未进行真机、生产签名或商店发布验收。

本仓库提交源码、测试输入、规则证据及验证汇总。安装包保留在开发机的 `outputs/`，由构建脚本重新生成；安装包、缓存及原始设备/主机日志不进入 Git。历史记录中的绝对路径、本机预览链接和被忽略日志引用属于原验证环境，并不表示这些文件在 GitHub 上可下载。
