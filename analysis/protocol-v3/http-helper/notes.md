# 更新/目录下载到 WinINet 的静态链

**stage58补证：** 固定同SHA256的v13已闭合这里原先未知的+34虚槽到CInternetFile::Read/InternetReadFile及正常关闭，原末尾41aed9为JMP父栈延续。14新锚点与17旧锚点重核通过，原EH仍不称完整。新增Fetch薄适配只对本机原创服务实际运行，不能扩为官方网络或游戏协议证明。[当前规格](../../../reports/launcher-static.md#launcher-v13)、[证据](../../launcher-v13/static-spec.json)。下表与验证器中的覆盖限制保留为早期观察。

**事实**：固定解压登录器 SHA256 `601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31` 中，REA 6.7.0 / Ghidra 12.1.4 对 `FUN_0041ab70` 的 Evidence 为 `ev_55ecff2200e634057c076604a9418249b9eec6b5d2d1f6757606e0f1bc81cf7f`。完整 dossier 留在临时目录；[verified-http-chain.json](verified-http-chain.json)绑定其SHA256，并只保存原创关系摘要和地址。

| 路径 | 可复核静态事实 | 边界 |
|---|---|---|
| 初始化 → 辅助函数 | 5个调用：`401991`、`401b51`、`4020a8`、`40229b`、`402457` → `41ab70`，分别对应先前有证据的launcher_md5、launcher_url、xml_md5、GameList、RegionList控制分支 | 是代码路径，不是执行轨迹；没有取真实返回内容 |
| URL构造 | `41abe7`引用`%s?rtm=%lld`（VA`4b62fc`，file`b54fc`），`41ac21`引用`http://`（VA`4b6308`，file`b5508`）；两次连接字符串辅助调用后交给OpenURL | rtm数值生成规则、精确时间单位及规范化尚未完整恢复；不能冒充认证签名 |
| 网络初始化 | `41ac07` → `445d98`，其中`445dd0`经IAT`4b169c`调用WININET InternetOpenA | IAT名称独立从PE导入表核对 |
| 打开定位符 | `41ac8e` → `446731`，该wrapper的非本地文件分支`446849`经IAT`4b1684`调用InternetOpenUrlA | 不声称所有wrapper分支均走网络；本调用提供http前缀 |
| 可选发送分支 | 对输入文本长度作非零分支，`41acff` → `4462cf`，`4462e4` → `4462a0`，`4462b7`经IAT`4b1688`调用HttpSendRequestA；分支引用form-urlencoded类型字面值 | 这是辅助函数的条件路径，不证明5个更新调用都携带实体，也不证明平台认证使用此函数；HTTP方法未从这条证据单独断言 |
| 状态查询 | `41ad91` → `4457d2`，`445801`经IAT`4b16a8`调用HttpQueryInfoA；成功查询后值≥400进入失败处理路径 | 没有测试真实状态码或网络失败 |
| 读取循环 | `41ae63`为寄存器间接call，来自对象虚表+0x34；可见0x400分配、0x3ff读取上限及返回长度后的NUL写入 | REA明确列为未解析调用，尚未闭合到唯一InternetReadFile实现，不把库中其他read导入引用强连到这里 |

**通过**：[verify_http_helper.py](verify_http_helper.py)对10个E8、4个FF15导入名称与3个字符串共17个锚点验证通过；改一字节、截断及空样本均在固定SHA256门槛被拒绝。验证器复用相邻`game-network`原创PE审计映射器，不能当作生产用任意PE安全加载器。它不执行目标、不请求URL、不读取运行态值。

**限制**：Ghidra函数体范围为`41ab70..41aedd`；`41aed9`的终结流转至另一个识别函数`41af63`，完整异常/清理边界仍需复核。p-code保留931项、未截断，但“未截断”不代表间接目标全解析。首次沙箱调用因工具标准Swift缓存写入被拒绝，具体静态分析请求经执行审查后exit0；未改安全配置。失败摘要见[initial-tool-failure.json](initial-tool-failure.json)。

**结论**：当前有直接静态证据把自更新/目录分支与WinINet链关联；这不能推导游戏使用HTTP，不能得出游戏帧、认证或会话规格。不存在新增网络产品实现。

复核：

```sh
python3 analysis/protocol-v3/http-helper/verify_http_helper.py \
  --pe /tmp/moli-analysis/polcn/POLCN_Launcher.unpacked.exe \
  --dossier /tmp/moli-analysis/stage3-http/helper-function-authorized.json
```
