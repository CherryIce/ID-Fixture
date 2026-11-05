# 本轮证据登记

日期：2026-11-04（Asia/Shanghai）。范围：product_design。

| 层级/事项 | 方法与对象 | 结果 | 限制/位置 |
| --- | --- | --- | --- |
| 工作区基线 | 检查当前目录README、Git根/分支/状态及概念目录关键词 | 当前目录不是Git仓库；现有内容为多项目UI效果册；在全新id-fixture-plan中写文档 | 无目标应用、锁文件或平台工程；其他目录未改 |
| 工厂技能 | 读取本地SKILL.md及workflow/differentiation/UI/artifacts/learning-loop | 本轮选择方案范围，按脚本初始化5份未评估文档后填充 | 技能目录也不是Git仓库；以SKILL.md SHA256记录版本 |
| 文档初始化 | bootstrap_factory_run.py --project id-fixture-plan --config factory-intake.json | 创建报告与intake，未使用force | 脚手架不是通过证据 |
| 中国/越南规则 | 独立研究员浏览政府/标准来源，Coordinator复核核心页面 | 中国结构可设计；越南现行全文与代码表未核全 | 见MARKET_EVIDENCE.md；附件502为实际证据缺口 |
| 美国规则 | Coordinator浏览纽约DMV、California POST及国务院页面 | 只支持有限州/版本的格式结论 | 非发号/签发校验；POST后续find请求超时，不改变先前已读取文本的边界 |
| 类别研究 | 独立研究员浏览Faker/Mockaroo官方资料，Coordinator复核主要页面 | 基础能力常见，强化闭环仍是待验证假设 | 未安装、访谈或购买 |
| 差异化 | 独立初评+Coordinator保守裁决 | needs_revision，未进入MVP实现 | 见DIFFERENTIATION.md |
| 方案一致性 | 独立只读reviewer，检查承诺、规则边界、核心闭环与验收；修订后复核 | passed_for_plan | 1项P2已闭合，无新增阻断；见PLAN_REVIEW.md；非功能验收 |
| 文档完整性 | JSON读取、模板残留/本地链接目标核对，确认两份intake一致 | passed | 仅文档检查，不是产品测试 |
| 静态应用源检查 | 无应用源 | not_applicable | 本轮未创建应用 |
| analyzer/单元/Widget测试 | 未运行 | untested | 无可运行产品 |
| 模拟器/浏览器运行/视觉交互 | 未运行 | untested | 文字布局和验收矩阵不能证明渲染通过 |
| 真机 | 未运行 | untested | 未安装App |
| Release/Archive/上传/TestFlight/审核 | 未执行 | outside_scope | 未作商店评估或外部发布 |
| 收尾 | 按post-build-cleanup核对新建方案目录，未发现本轮构建/缓存输出 | completed，删除0字节 | 保留所有方案与证据；未扫描/清理其他项目或共享缓存 |

如实区分：方案交付完成、产品原创性未通过、规则档案尚未实施、功能及UI未经验证，四者没有互相替代关系。
