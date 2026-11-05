# 香港 澳門 臺灣號碼規則研究

查核日期：2026-11-05，Asia/Shanghai。研究員只寫本證據目錄，未修改應用或執行構建。這裡記錄可實施的本地格式/校驗層，不是簽發規則全集或真實身份驗證。

## 可啟用範圍

| 地區 | 最強可支持能力 | 已知限制 |
| --- | --- | --- |
| 香港 | 官方schema格式 + 公開政府客戶端加權mod11校驗，可處理單/雙字母及括號顯示 | 政府前端程式不是完整現行發號規則；不能從前綴推出生日、性別、地區、簽發或證件有效性 |
| 澳門 | 現行法規的7位主體+1位檢驗數字格式 | 目前未找到官方公開算術算法；checksum必須unknown。1/5/7來自歷史法規，不能強套現行全體新發號 |
| 臺灣 | 官方10碼格式、1/2編碼性別、26字母數值映射及加權mod10；預設提供現行22地區，顯式歷史選項另含L/R/S/Y | 不含居留證、完整流水號配賦語義；不從首碼推出現住地。歷史碼不能僅因行政區改制被判格式無效 |

機器可讀事實見rules.json與tw-regions.json。country_key=CN、region_key=HK/MO/TW僅沿用Coordinator指定的產品層級，研究員不決定政治或界面文案。

## 香港證據

HK-SCHEMA：[數字政策辦 HKID Number Details](https://www.digitalpolicy.gov.hk/en/our_work/data_governance/policies_standards/interoperability_framework/common_schemas/hkid_number/index.html)，Approved v1.0，2005-02-01；頁面目前標2026-06-30修訂。主體1–2字母和6數字，CheckDigit獨立0–9/A。XML樣例只是結構示例，**A123456配A不是有效校驗向量**。

HK-XSD：[同頁公開XML schema](https://www.digitalpolicy.gov.hk/en/our_work/data_governance/policies_standards/interoperability_framework/doc/common_schemas/hkid_number_v1_0.xsd)。已歸檔hk-schema-v1.xsd，明確[A-Z]{1,2}[0-9]{6}與[A0-9]；無權重算法。

HK-ROP133：[入境處ROP133](https://www.immd.gov.hk/pdforms/rop133.pdf)，版本10/2025。明確括號內字符不是身份證號碼本體，只供電腦處理。建議引擎分開identifier與check_character；括號為顯示格式。

HK-CLIENT：[政府疫苗預約公開JavaScript](https://booking.covidvaccine.gov.hk/forms/assets/js/application_mo.js)，2026-11-05直接HTTP200讀取，歸檔為hk-government-booking-application_mo.js.txt。SHA256：b33a4a2c2f287bef1907892a37c0b09dcc158f6a5a196715af7c27ba3a5c207b。IsHKID函式明確A=10至Z=35，單字母前補36並乘9，字母乘8；雙字母乘9/8；六數字乘7/6/5/4/3/2。以mod11餘數求末位，10寫A；hkid_display將末位放括號。這是一手公開政府客戶端實現證據，未提交任何表單、未執行下載程式。

找到此政府檔案的線索為[原作者公開參考庫](https://github.com/shermanfcm/HKID)。未以其對政府原碼的轉載取代直接來源，也未將其樣例冒充政府測試向量。尚未找到官方專用、保證未簽發的HKID校驗向量或保留段。單/雙字母均可做合成結構，不宣稱所有前綴均現行簽發。

## 澳門證據

MO-CURRENT：[第41/2023號行政法規，重刊第23/2002號規章](https://bo.dsaj.gov.mo/bo/i/2023/45/regadm41_cn.asp?printer=1)，2023-11-06公報。已直接HTTP200歸檔原HTML（Big5）及UTF-8抽取。重刊第五條明文七位數字加一位檢驗數字；未列出本號碼校驗算法或現行前綴全集。不能用MRZ檢驗碼取代本號碼檢驗位。

MO-HISTORICAL：[第6/92/M號法令第8條](https://bo.dsaj.gov.mo/bo/i/92/04/declei06_cn.asp?printer=1)及[1999年公報](https://images.bo.dsaj.gov.mo/bo/i/99/19/bo-i-19-99.pdf)記載歷史1/5/7前綴與繼承舊證號情形。其可作歷史說明，不能在缺少現行依據時當成新發號限制或居留身份分類。

MO-BOOKING：[身份證明局公開預約頁](https://app.dsi.gov.mo/Book/)可見8位輸入示意，說明無需斜線或括號。直接讀取HTML曾返回405，未提交表單或嘗試服務驗證。它是輸入格式說明，不是校驗向量。

本次未取得官方公開算法/有效校驗向量，不能把未找到寫成官方未公開的絕對結論。可啟用8位格式例，結果獨立列checksum=unknown；不提供“校驗位正確”承諾或校驗位反例。

## 臺灣證據

TW-LAW：[現行辦法第3條](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0030030)，2024-10-18修正，10碼，首碼地區英文字母、第二碼性別、第十碼檢查碼。第4/5條也表明配賦並非單靠自行編碼即可取得身份。

TW-SCHEMA：[政府資料標準 人屬性基本資料](https://schema.gov.tw/lists/167)，明確1為男性、2為女性；與新式外來人口8/9的號碼分開。它的值域文字是資料描述，不直接當程式正則照抄。

TW-CURRENT-REGIONS：[宜蘭市戶政FAQ](https://ilhhr.e-land.gov.tw/cp.aspx?n=3515)，目前列表22地區，已歸檔HTML。A/B/C/D/E/F/G/H/I/J/K/M/N/O/P/Q/T/U/V/W/X/Z。編碼地不等於當前居住地；名稱可隨行政改制變化。

TW-HISTORICAL-REGIONS：[太平戶政26碼官方表](https://www.htaiping.taichung.gov.tw/media/371529/662813505431.pdf)，含L原臺中縣、R原臺南縣、S原高雄縣、Y陽明山；F原臺北縣、H原桃園縣仍分別沿用F/H。[北屯戶政FAQ](https://www.hbeitun.taichung.gov.tw/1521664/1521705/1521712/1585217)的索引說明2010-12-25改制；直接web讀取該舊網址410，故不以該單一已失效網址作唯一依據。

TW-CHECK-2023：[行政院公報029卷234期2023-12-11，附件6](https://gazette2.nat.gov.tw/EG_FileManager/eguploadpub/eg029234/ch04/type2/gov30/num6/images/Eg01.pdf)，直接HTTP200歸檔tw-check-method-2023.pdf；物理第179頁、印刷附件21頁已抽取文字並渲染目視核對。26字母數值表、權重及B120667503末位3的算術示例明確。樣例只證明邏輯校驗，不代表官方保留且未簽發。

TW-CHECK-2022：[2022公報相同附件](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg028236/ch04/type2/gov30/num5/images/BB.pdf)，物理178頁另存交叉核對。web擷取曾403，但正常直接公開URL讀取成功；未使用登入、代理或規避措施。

TW-CURRENT-TAX-MANUAL：[114年度官方申報手冊](https://download.tax.nat.gov.tw/imx/IMX-USER-114.pdf)仍引用作業要點附件6作檢查方法。現行法及政府schema均支持該格式；本研究不宣稱掌握完整流水配賦規則。

算法：字母值拆十位/個位，分別乘1/9，再加八位主體數字乘8到1；檢查碼=(10−總和mod10)mod10。驗證時加末位後mod10為0。預設生成22現行區域；26字母校驗映射保留，歷史生成須顯式標記。

## 研究驗證和界限

下載雜湊與時間見download-manifest.json、hk-government-js-source.json。官方PDF已逐相關頁視讀；沒有構建、應用測試、身份核驗服務請求或真人資料查詢。新增資料仍須由Executor以獨立測試向量和UI檢查驗收；checksum通過不等於身份有效。
