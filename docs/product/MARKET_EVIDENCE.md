# 证件号测试工具 规则与类别证据

访问日期：2026-11-04（Asia/Shanghai）。方法：官方政府/标准及工具官方文档。研究员分别核查中越规则与测试工具类别，Coordinator复核关键页面。附件只是研究线索，其保证性文字未被采信。

## 公开规则来源

| ID/来源 | 发布者与日期 | 直接观察 | 产品推断及限制 |
| --- | --- | --- | --- |
| C1 [GB 11643-1999](https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=080D6FBF2BB468F9007657F26D60013E&refer=outter) | 国家标准公开系统；1999-01-19发布，1999-07-01实施 | 本次页面列标准现行 | 可用作中国大陆公民身份号码结构依据，不扩展到其他中国证件 |
| C2 [标准全文](https://zjw.beijing.gov.cn/Portals/0/zhuanti/fazhan/%E8%BA%AB%E4%BB%BD%E8%AF%81GB11643-1999.pdf) | 北京市住建委托管标准 | 第5章规定结构与MOD 11-2校验 | 可支持算法设计，未运行算法；未打包全文 |
| C3 [号码组成答复](https://gaj.beijing.gov.cn/hudong/rddf/202003/t20200331_1771804.html) | 北京市公安局；答复2019-03-11 | 18位由地址、出生日期、顺序、校验组成，末位可能为X | 长度正确不等于签发或真实身份 |
| C4 [户口居民身份证管理规范](https://www.beijing.gov.cn/zhengce/zhengcefagui/202211/t20221116_2860246.html) | 公安部文件，政府网站发布；2021-07-24成文 | 编号与首次登记相关，迁移等情形不简单重编 | 地址表须版本化；不能把前缀解释为当前居住地 |
| V1 [12位结构说明](https://xaydungchinhsach.chinhphu.vn/cach-nho-12-so-can-cuoc-cong-dan-gan-chip-cuc-de-119220914161814354.htm) | 越南政府门户；页面日期2023-01-12 | 历史公开说明为地区/国家码、世纪及性别、年份、随机段，总长12位 | 是历史结构证据，不足以证明现行代码全集；未描述独立校验位不等于证明不存在其他约束 |
| V2 [个人身份号码与税号](https://xaydungchinhsach.chinhphu.vn/quy-dinh-moi-tu-1-7-2025-su-dung-so-dinh-danh-ca-nhan-thay-cho-ma-so-thue-119241228125210708.htm) | 越南政府门户；2024年末 | 引用身份法：12位、由国家人口数据库建立及公安部统一管理 | 随机12位不能视作已建立的身份 |
| V3 [58/2026/NĐ-CP说明](https://bocongan.gov.vn/bai-viet/quy-dinh-moi-lien-quan-den-thi-hanh-luat-can-cuoc-gop-phan-don-gian-hoa-thu-tuc-hanh-chinh-cho-nguoi-dan-1778569520) | 越南公安部；2026-05-12 | 取消部分因性别/出生年/登记地点资料更正而注销重建号码的规定 | 解析旧编码不能承诺等于当前法定资料；这是产品边界推断，不是法律意见 |
| V4 [17/2024/TT-BCA](https://congbao.chinhphu.vn/van-ban/thong-tu-so-17-2024-tt-bca-42016/50405.htm) 与 [118/2026/TT-BCA](https://congbao.chinhphu.vn/van-ban/thong-tu-so-118-2026-tt-bca-470080.htm) | 越南政府公报；后者2026-06-29发布、2026-07-01生效 | 存在2024→2025→2026修订链 | 研究员请求官方附件返回502，未完整逐条核对正文/发号表；不能宣称越南现行规则已经闭合 |
| V5 [34省市行政代码目录](https://xaydungchinhsach.chinhphu.vn/bang-danh-muc-va-ma-so-cua-34-tinh-thanh-moi-cac-don-vi-hanh-chinh-cap-xa-moi-11925070418263625.htm) | 越南政府门户；2025-07-04 | 说明2025-07-01起使用的新行政目录 | 两位行政码不能直接补零冒充三位证件发号码；旧63省表有时代边界 |
| U1 [纽约DMV输入说明](https://dmv.ny.gov/transaction-message/information-about-transaction-entries) | 纽约州DMV；页面未列修订日 | DMV ID是9位数字；document number为另一字段 | 必须区分同卡两个号码，当前仅证明格式 |
| U2 [Information Systems 教材](https://post.ca.gov/portals/0/post_docs/basic_course_resources/workbooks/LD_36-V5.0.pdf) | California POST；扉页修订2026-01 | 加州驾照/ID号码组成有字母与7个数字的说明 | 与纽约不同，支持按州建档；教材不是完整现行发号算法，仍需限制字符范围与适用版本 |
| U3 [护照设计和安全](https://travel.state.gov/en/passports/apply/help/security-design.html) | 美国国务院；页面更新2026-07-08 | 新一代护照本号码为字母加8数字，旧设计未过期/未损坏时仍可使用 | 仅覆盖特定护照本格式；不能说所有美国护照统一为该格式或推断实际签发 |

高信心：来源明确陈述的长度、基本组成与页面版本状态。中等信心：据此作出的产品边界推断。未核完整：越南现行全文/代码表、中国地址代码数据集及许可、各规则完整发号算法、美国所有州/版本。

本次限定官方检索未找到中国、越南向公众明确保证永不签发的通用测试保留号段；不构成不存在证明。随机格式正例可能与真实号码重合。产品不得把格式、部分语义或校验位检查包装为身份/有效性核验。

## 类别研究

| 工具与官方来源 | 直接观察 | 账号/商业边界 | 本项目推断 |
| --- | --- | --- | --- |
| [Faker文档](https://faker.readthedocs.io/en/stable/) | 测试数据、locale/provider、pytest fixture及seed；文档提醒数据集更新可能改变跨补丁版本结果 | 本地开源库；未安装/运行或审查完整许可 | 多国与复现已常见；只固定seed不足以保证跨版本重放 |
| [Faker美国provider](https://faker.readthedocs.io/en/stable/locales/en_US.html#faker-providers-passport) | 已有护照及部分无效号码相关provider | 具体provider不是政府发号规则来源 | “有证件号/反例”本身不足以形成差异 |
| [Mockaroo](https://www.mockaroo.com/) | 无代码字段配置，批量和CSV/JSON/SQL/Excel等导出；保存schema/API路径 | 网页有免费试用能力及付费方案；保存/自动化涉及登录，未创建账号 | 批量/导出/配置是惯例；不引用价格作为本产品商业决策 |
| [Mockaroo帮助](https://www.mockaroo.com/help) | 关联字段、公式、模板、dataset/schema分享及下载恢复说明 | 仅文档观察，未实际导出或用API | 联动与保存配置也有替代；不能说竞品没有 |

两个产品的官方材料都支持测试数据准备这一类别工作，但不等于独立证件工具的需求频率、手机优势或付费意愿已成立。未采集用户抱怨、市场规模或转化数据，不编造“重复痛点”。

机会假设：证件专属来源与版本、明确的本地预期检查、可解释正反例和锁版导出可能降低校验回归的配置成本。这是组合差异化推断，未证明市场唯一，须用真实用户任务验证。

## 权利与证据限制

仅保存链接及简要事实描述，未复制竞品资产、品牌布局、代码或整套外部数据。后续规则表/数据打包须核对来源许可与使用条件。无用户访谈、竞品安装或独立运行测试；官方文件不可访问的内容保持未核状态。不用历史文章替代现行缺失证据，未评估App Store或各地法律可接受性。
