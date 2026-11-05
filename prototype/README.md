# 证号实验室 交互原型

当前为 **1.1覆盖扩展**（2026-11-05）的本地浏览器原型，用于选国家/区域/证件、配置、生成、检查、导出和复现。Flutter应用已另行实现；浏览器原型和移动端的验收证据分别记录，均未发布到外网。完整范围与证据边界见[当前覆盖与交付记录](../docs/coverage/DELIVERY.md)。

当前预览：[打开本地原型](http://127.0.0.1:8743/)。服务仅绑定本机，需要本机服务处于运行状态。

停止后可在该目录重新启动：

```sh
python3 -m http.server 8743 --bind 127.0.0.1 --directory /Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/prototype
```

`standalone.html`是无外部运行依赖的单文件交付，由`node package-preview.mjs`从当前源文件生成。当前内置预览只允许HTTP/HTTPS，未验证file协议下的浏览器运行及剪贴板行为；优先使用上述本地预览。

## 当前规则范围

- 中国大陆：31省级导航、2851个公开参考候选代码，以及公开结构/校验；可搜索地名或代码并分层选择。参考集合不是全国实际签发代码全集，特殊候选保留其来源与未知项。
- 中国香港：公开格式与校验、1或2个大写字母前缀，规范输出不带括号。
- 中国澳门：仅公开格式，校验字符算法未知，不提供校验位反例。
- 中国台湾：22个当前地区前缀、4个须显式选择的历史前缀，以及编码性别与公开校验规则。
- 越南：启用公开历史结构；按34个当前省级单位导航，选择对应的63个公开历史出生地前缀。当前行政码不冒充证件前缀，现行新签发分配符合性未知。
- 美国：纽约州DMV ID与新一代护照本公开格式，范围不延伸为全美驾照或完整签发算法。

旧`cn-id-demo`仅作为1.0归档规则供已有包复现，保留北京3区演示快照，不静默升级。所有号码是本地合成测试数据，可能与真实号码重合，不能用于证明签发、持有人或有效状态。

本地生成与文件操作已实现，JSON包可下载、回读、确认重算；错误版本或内容差异会明示。规则测试、浏览器操作、移动端集成测试和系统分享/文件选择是不同证据层，以[当前交付记录](../docs/coverage/DELIVERY.md)逐项说明为准。

## 测试与历史记录

无需依赖安装即可运行规则测试：

```sh
node --test /Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/prototype/engine.test.mjs /Users/starburst/Downloads/app-ui-atlas/id-fixture-plan/prototype/coverage_engine.test.mjs
```

本轮28项Node测试通过；同一产品修订另有53项Flutter测试、6项Android集成业务测试通过。Android普通1.1 AOT包仅做一次921ms首启smoke，系统分享/文件选择本轮未重测；iOS本轮仅完成构建、签名、安装及启动截图，新地区菜单尚无CUA手动交互通过结论。

2026-11-04原型阶段的[能力与验收记录](../docs/prototype/REVIEW.md)及[界面截图](../docs/prototype/evidence/desktop-zh-light.png)作为1.0历史证据保留，其中北京3区、越南禁用等描述不是当前范围。
