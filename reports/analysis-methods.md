# 静态分析方法与可追溯证据

## 从确认字段追到启动读取

固定 F5A 复用完整 REA 函数档案，按原 PE 的直接调用、导入和指令边界连接回复、普通确认和启动返回。设置写入结果核到调用方下一条指令。确认缓冲区与启动读取按同一 Frame 的实际偏移计算，名称长度另核回复解析和确认复制各自的计数。 [源核验和用例](validation.md#f5a-ordinary-handoff-validation)

<a id="stage235-legacy-server-return-fade"></a>

## stage235 原表面调用与逐行参考

REA 的证据与 PE 核对覆盖 10 个函数、8 个文件窗口、10 条指令、8 个直接调用和 5 个操作数窗口。填充值初始位置单独核对为虚拟零区。第 14 类逐行参考沿用既有独立 Python 数值与像素向量，当前把 50 个哈希用于实际 Canvas 播放端口。

[复核程序](../analysis/game-legacy-server-return-fade-v1/verify_source.py) · [证据索引](../analysis/game-legacy-server-return-fade-v1/source-check.json)

<a id="stage234-legacy-server-return"></a>

## stage234 用调用点复核协议字段

对照 `4fc14c` 的调用顺序与 `4ef290` 的栈偏移，确认套接字参数之后才是两个线字段。证据逐字节比较 9 个 REA 文件窗口、8 条 REA 指令，并在原 PE 复核 14 个直接调用和 11 个操作数窗口。已导出证据并关闭 REA 会话。

[复核程序](../analysis/game-legacy-server-return-v1/verify_source.py) · [证据索引](../analysis/game-legacy-server-return-v1/source-check.json)

<a id="stage233-legacy-frame-startup"></a>

## stage233 对照帧状态与初始化字节

用 REA 跟踪主状态、子状态、清零分配及角色回调。在原 PE 中复核 15 条直接调用和 8 条字段相关指令，并逐字节比较 REA 返回的 12 个文件窗口与 8 条指令。4 个虚拟零值单独验证其节区边界。角色回调的检查保留具体指令地址。REA 证据已导出，会话已关闭。

[复核程序](../analysis/game-legacy-frame-startup-v1/verify_source.py) · [证据索引](../analysis/game-legacy-frame-startup-v1/source-check.json)

<a id="stage232-legacy-ordinary-context"></a>

## stage232 追普通入场重置与时钟消费者

结合主流程状态 5、指针动作锁清除分支、事件读写引用和 `@Qu` 的原始调用指令。使用独立 PE 读取核对原文件窗口、直接调用和初始常量，虚拟初始化值单列。帧中计算时段使用的墙钟秒与移动节流使用的单调毫秒分别记录。

[核对程序](../analysis/game-legacy-ordinary-context-v1/verify_source.py) · [证据回执](../analysis/game-legacy-ordinary-context-v1/source-check.json)

<a id="stage231-legacy-display-startup"></a>

## stage231 连接建窗、投影和位置写入

按建窗调用、同一尺寸字段的引用、正逆投影、两条坐标入口及相机写入收集 REA 证据。独立映射 PE 核对原始窗口与直接调用。相机和强制绘制位的虚拟零值单列。历史封装样本的分析边界沿用各自身份记录。

[核对程序](../analysis/game-legacy-display-startup-v1/verify_source.py) · [证据回执](../analysis/game-legacy-display-startup-v1/source-check.json)

<a id="stage230-legacy-config-startup"></a>

## stage230 跨 CRT 和资源消费者的调用核对

用 REA 先从 WinMain 的调用引用定位 CRT 启动，再区分 WinMain 的合并、文本输入转换、首次子串搜索三层。独立读取 PE 核对直接调用和指令窗口。文本模式的默认值来自虚拟初始化区域，与原文件范围分别登记。

[复核程序](../analysis/game-legacy-config-startup-v1/verify_source.py) · [证据回执](../analysis/game-legacy-config-startup-v1/source-check.json)

<a id="stage229-legacy-startup-materials"></a>

## stage229 文件摘要的数据流核对

REA 先复核登录器分析映像和映射写入，再打开另一份固定旧版游戏 PE。根据 `ReadFile` 的计数存储和 `0x404d03` 的减法复核循环边界。用独立 PE 映射核对文件字节与相对调用，按 64 轮顺序检查常量、词选择和旋转。

两个 REA 证据包分别保存于私有构建目录并关闭会话。PE 虚拟初始化值单列，现行保留样本的节表由文件独立读取。

[复核脚本](../analysis/game-legacy-startup-materials-v1/verify_source.py) · [摘要证据](../analysis/game-legacy-startup-materials-v1/source-check.json)

<a id="stage228-wechat-special-dialogs"></a>

## stage228 对话分派、控件和图像的复核

**事实**。用 REA 复核 `Q?m` 的十个相关模式、控件回调和绘制参数，区分共用解析器与独立回调。独立 PE 映射逐项验证直接调用、窗口描述符及转义字节。

**事实**。用独立 TCP 夹具驱动 Page 处理函数，另用 Canvas 测试端口记录尺寸、像素哈希、缺图状态和晚到绑定。微信模板编译单独记录。

[REA 字节核验](../analysis/game-wechat-special-dialogs-v1/source-check.json) · [验收记录](validation.md#stage228-wechat-special-dialogs)

<a id="stage227-wechat-family-board"></a>

## stage227 家族与留言板的证据核对

**事实**。对固定 PE 的 `Q?m` 分派同时核对跳转入口、直接调用与刷新位置。复核窗口描述符、家族收发字面量、权限与编辑长度常量，再以独立 PE 映射匹配 REA 的字节窗口。

**事实**。用独立 TCP 夹具驱动微信 Page。源适配和生成包使用同一组对端消息，模板编译单独记录。发送回执和客户端收到完整帧分别检查。

[REA 字节核验](../analysis/game-wechat-family-board-v1/source-check.json) · [验收记录](validation.md#stage227-wechat-family-board)

<a id="stage226-wechat-storage-trade"></a>

## stage226 仓储记录和交易收发链复核

**事实**。对仓储入口使用两级跳转表核对模式、入口与直接调用位置，核对记录分派、槽位、余额上限与销毁回调。用独立 PE 映射校验 REA 的函数范围和原字节窗口。交易收发以已证分派目录、生产者引用及字面量交叉核对。

**事实**。使用独立 TCP 字节夹具驱动微信 Page 的实际处理函数。通过持有记录变动和对端关闭验证窗口版本，模板编译另行记录。

[REA 字节核验](../analysis/game-wechat-storage-trade-v1/source-check.json) · [验收记录](validation.md#stage226-wechat-storage-trade)

<a id="stage225-wechat-map-services"></a>

## stage225 用跳转表和原字节复核地图服务

**事实**。用 REA 重新读取固定 PE 的 10 个地图模式，按模式索引、跳转入口、直接调用位置和目标分别核验。对函数范围和字节窗口重新映射到文件偏移，记录样本哈希、分析配置和证据 ID。复核治疗、人物技能与宠物栏位经同一发送器的分支。

**事实**。复用独立 TCP 夹具验证 Page 处理函数。夹具先送窗口和列表更新，再检查预览期间静默以及实际回复。WXML 与 WXSS 由本机微信模板编译器单独检查。

[REA 字节核验](../analysis/game-wechat-map-services-v1/source-check.json) · [验收记录](validation.md#stage225-wechat-map-services)

<a id="stage224-wechat-inventory-shop"></a>

## stage224 物品操作和窗口分派的复核

**事实**。对固定 PE 复核六类商店和两个入口的分派，逐条核对调用指令、数据窗口及发送器使用的标签。商人和兑换员区分分支入口与后一字节的调用位置。

**事实**。独立 TCP 夹具分别给出选中槽变动、余额或容量变化、成功回包及取消。实际 Page 与生成包通过测试端口使用同一组对端字节。

[REA 字节核验](../analysis/game-wechat-inventory-shop-v1/source-check.json) · [验收记录](validation.md#stage224-wechat-inventory-shop)

<a id="stage223-wechat-creation"></a>

## stage223 从建角消费者到页面测试

**事实**。沿固定旧样本的确认、编码、回包和计时入口重新取 REA 证据，再按独立 PE 映射核对调用、原字节和三个协议字面值。

**事实**。页面测试加载实际 WXML 所绑定的处理函数，使用既有原创 Python 对端核对帧和顺序。测试分别加载源码适配及隔离的微信生成包。

[字节核验](../analysis/game-wechat-creation-v1/source-check.json) · [验证记录](validation.md#stage223-wechat-creation)

<a id="stage222-wechat-page"></a>

## stage222 固定 PE 与平台分层验收

**事实**。独立脚本依据 PE 节映射复核 REA 导出的函数、窗口与调用，保留原样本哈希和所用分析版本。源证据覆盖接入的选角、普通场景、移动和战斗入口。

**事实**。分别记录源码测试、隔离 V8 中的生成包测试、独立 TCP 对端、微信模板编译与实际 DevTools 导入。真实浏览器复验使用 Playwright 与 Chrome 执行桌面和触屏流程。

[字节核验](../analysis/game-wechat-page-v1/source-check.json) · [平台验收](validation.md#stage222-wechat-page)

<a id="stage221-chat-presentation"></a>

## stage221 地图聊天显示的交叉核验

**事实**。用 REA 核对收包分流、黑名单、气泡和公告回调，并通过独立 PE 映射比对 26 个原字节窗口、52 个函数范围、34 个调用和 16 个指令位置。0x43ba10 是构造函数写入的回调入口，保留解码指令，规范函数仍由 REA 的实际函数边界计数。

**事实**。独立 TCP 夹具生成过滤、气泡和公告消息。浏览器 DOM 断言核对文本，场景截图再分别确认气泡与两条公告像素。两个层次单独记账。

[本轮计划](../analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage126"></a>
## stage126：事件时序、状态定义和静态地址解释分别取证

先恢复普通输入并实证取消旧行，再读同一$ev125的元数据/两条1000消息与ISO时间，以PID和创建FILETIME绑定进程；独立100ns整数换算与原生命周期一致。1500ms等待只给出读取器最早调用界，不能替代实际调用时刻或因果轨迹。1001在来宾内存解析，仅观察字段名与EventName/P1..P8；签名不当模块、基址或协议。[事件与限制](../analysis/game-text-observer-runtime-v1/events-stage126.json)。

REA新增一条section_headers记录（-h，exit0，未截断，前后hash一致），私有导出1记录/0unknown；选取回执保留EvidenceID、原provider.version=null和独立GNU2.47.20260726探针。Python独立核11节头，原.text的VirtualSize与零RawSize分别保留，不把objdump的Size0误报为零虚拟长度。未知模块FaultOffset只保留原值、做三种范围否定，不猜实际加载基址。[REA](../analysis/game-text-observer-runtime-v1/rea-fault-layout-stage126.json)、[PE检查](../analysis/game-text-observer-runtime-v1/fault-layout-stage126.json)。

微软维护的WinSDK头经一次普通HTTP200取得，原688716B/摘要只留私有build，公开仅选取两个状态声明/行号和来源hash；状态分类不推导根因。没有新游戏代码/调用栈、目标执行或源码变更，后续仅读两份既存报告的实际附件元数据。[一手定义](../analysis/game-text-observer-runtime-v1/status-reference-stage126.json)、[接续](../analysis/game-text-observer-runtime-v1/resume-plan-stage126.json)。

<a id="stage125"></a>
## stage125：区分一次真实零读取、进程异常退出和未回读事件

**事实：** 完整ToString回读后只触发一次脚本；实际Start=True/PID5136、`TEXT_ZERO`/reader exit1、HasExited=True/game `0xc0000005`、ISO创建/退出时刻及Test-Path=False/进程数0均已观察。源工具的TEXT_ZERO分支位于单次ReadProcessMemory及仍运行检查之后、CREATE_NEW之前，因此只支持本次固定读取全零；不证明一直为零、代码已展开或消费者语义。失败分支未输出基址/页面表/摘要，不补造这些数值。[回执与限制](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)。

事件赋值查询返回提示符，目标详情投影未取得可靠回执；普通取消也未验，不把无显示解释为无错误记录。当前无新REA消费者、游戏快照或产品测试；后续先读本次精确错误，再决定新分析问题，不为增加记录数重复已有文件头查询。

<a id="stage122"></a>
## stage122：保留执行时授权与分层输入证据

本次具体启动/读取确认已答复，原 pending 文档保留历史，接续以[授权回执](../analysis/game-text-observer-runtime-v1/authorization-stage122.json)为准。原窗口读回不是普通输入证明；实时 AX 文本选取既有 Win+Q、搜索字符 1 和 Escape 的实际画面分别记录。随后 Mac 锁定，未提交 Return、前检或游戏启动。[输入回执](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)。

历史 StartInfo JSON 中双反斜杠的表示错误以[单独纠正](../analysis/game-text-observer-runtime-v1/command-path-correction-stage122.json)接续；不修改旧清单或来宾实际值。没有新 REA 消费者、夹具读取、游戏快照或产品测试；恢复后按原合同取实际结果，再决定分析与实现。

<a id="stage119"></a>
## stage119：原文件全量比较与工具来源分层

**事实：** 同一 Windows 6624B 原始快照已返回，按实际 base0x00da0000 与原创 PE 的 245 个 HIGHLOW 预期比较，全部字节相等，SHA256 `13da500e013b8455352dd26985f04d8a9c853af45584b0f53ba99b1eb146a9d9`。纯 oracle 本身不提供执行证明；同一 PID260 的读取/自然退出来自 stage118，文件返回/直接比较来自 stage119。[比较](../analysis/game-text-observer-runtime-v1/host-oracle-stage119.json)、[完整资格](../analysis/game-text-observer-runtime-v1/qualification-stage119.json)。

REA 本轮新增 1 条 `file_headers`，实际为 `objdump -f`；4 条导出含 3 条历史记录。五个直接库描述符另由 GNU Binutils 2.47.20260726 `objdump -p` 取得，不归给 REA 的 `-f`，不作为完整运行依赖证明。[REA](../analysis/game-text-observer-runtime-v1/rea-preflight-stage119.json)、[导入表](../analysis/game-text-observer-runtime-v1/game-static-preflight-stage119.json)。没有新的游戏消费者证据。

<a id="stage118"></a>
## stage118：Windows输出摘要与完整文件比较分层

**事实：** 原创读取器身份在来宾完整核对，一次fixture PID260实际读取6624B并退出0，fixture自然退出0。实际加载基址00da0000下，独立oracle处理245个HIGHLOW后SHA25613da500e…146a9d9，与Windows观察器stdout一致。该摘要覆盖完整缓冲区；原始文件尚未返回，直接逐字节比较未进行，不能写成完整资格通过或原游戏消费者已恢复。本轮无新REA游戏记录。[原始数值与方法](../analysis/game-text-observer-runtime-v1/fixture-runtime.json)、[验收](validation.md#stage118)。

<a id="stage115"></a>
## stage115：文件声明、固定代码段观察与真实字节证明分层

REA资源解析器对9baa…d3126原件生成完整31项/12资源元数据；822B清单的直接hash/XML解析独立确认asInvoker/uiAccess=false，声明不等于实际UAC效果。REA的两个objdump操作检查新原创i386观察器文件/节，均完整且artifact_changed=false；pwntools的Linux-only capability_unavailable不是PE成功证据。[源](../analysis/game-text-observer-v1/source-check.json)、[工具证据审计](../analysis/game-text-observer-v1/evidence-audit.json)。

新工具只允许固定身份/PID/.text单次读取，区域/路径/hash/创建时间先行检查，输出CREATE_NEW。独立oracle依[微软PE HIGHLOW说明](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#the-reloc-section-image-only)对固定原创fixture的245个fixup计算实际基址下预期6624B，供未来真实完整字节比较。当前只有39C+6Python主机检查；无Windows或游戏字节。同步API无全程硬期限，单读不保证原子/稳定/语义。[方法与范围](../analysis/game-text-observer-v1/README.md)。

<a id="stage114"></a>
## stage114：原生IndexedDB验证与游戏文件/分析器失败分层

浏览器使用原创夹具和真实生产模块：6个独立启动会话、两份任务专用持久配置，83项检查通过；35模块按stage113清单逐个比对SHA256。首次夹具路由漏嵌套vendor模块的三条404已保留，再仅修夹具路由；成功轮无页面警告、运行错误或HTTP失败。[证据审计](../analysis/launcher-cache-source-browser-v1/evidence-audit.json)。

游戏9baa原件的RSDS头按PE PointerToRawData直接读取24B并固定hash：文件偏移0x26a00，文件映射VA5d3a00，声明的CodeView VA426a00与之不同。REA首个头部读取发生330000ms启动超时，没有成功Evidence；其后两条负面字节记录分别返回原.text0/16B和声明地址0/24B，均complete=false，已保存快照关闭，未更改分析器配置。[源检查](../analysis/launcher-cache-source-browser-v1/game-source-check.json)。

按[微软SymStore规则](https://learn.microsoft.com/en-us/windows/win32/debug/using-symstore)以签名/age查找，普通及下划线压缩名各一次；两个404仅限该公开源和精确身份，不推断全网不存在PDB，也不把PDB元数据当缺失代码。[查询](../analysis/launcher-cache-source-browser-v1/symbol-observation.json)。

<a id="stage113"></a>
## stage113：用机器码澄清库名和栈别名，再绑定真实输入

事实：REA6.7.0/Ghidra12.1.4在现行c82fc样本复用155、新增35、累计190条；Patcher195f样本37+9=46条；独立6e2ff游戏样本4条，均已保存快照并关闭。当前新增查询解析19个不同函数首址，Patcher新增查询3个。10处完整REA字节读与各自PE原文件映射逐字节相等。[台账](../analysis/launcher-current-entry-v1/rea-audit.json)、[字节检查](../analysis/launcher-current-entry-v1/source-check.json)。

`599ec5`的FID冲突名含mbslwr，实际调用`599edc __mbsupr_s_l`，映射标志0x200，并与大写`.EXE/.BAK.EXE`常量互证；未据歧义库名改坏既有ASCII编码器。Patcher工作函数的优化栈伪码有别名，改看40928c/409528的ESP与PUSH调整：主/备host和port是成对数组，40a125循环两来源。只实现已核对的精确地址子集。[实现合同](../analysis/launcher-current-entry-v1/implementation-spec.json)。

6次源绑定GET和79项Node分开记录。原网络回执中的PATCH_BUDGET失败保留，修改容量后只对已hash固定的原响应离线重解析；没有改写历史回执。新游戏.text返回0B/complete=false且无对应函数，只能证明本次静态缺口，不能推定所有代码或协议不存在。[重解析](../analysis/launcher-current-entry-v1/manifest-reanalysis.json)、[游戏范围](../analysis/launcher-current-entry-v1/game-capability.json)。

<a id="stage112"></a>
## stage112：控制消息通过虚表、汇编参数与原字节交叉确认

REA6.7.0/Ghidra12.1.4沿同hash139条快照续查，新增16/累计155，本轮21个不同函数；内部selector 431340/422c10/41b6d0分别归入431000/422b80/41b690，不把内部地址计作新函数首址。587a50实际PUSH两个参数、CALL slot0x10，431d00的RET8确认ABI；5890c0写标记1和两个BE32，424ef1选slot0xc。7处原字节锚点与完整分析样本hash通过。[台账](../analysis/launcher-current-control-v1/rea-audit.json)、[原字节核验](../analysis/launcher-current-control-v1/source-check.json)。

587880的已见入引用是两处虚表，不能据无直接代码调用推断所有间接调用不存在。已追踪正常提交段未建立必需type1前置，字段业务含义仍待验证。现有实现相关45Node通过；REA已导出、保存并关闭，完整伪码仅在私有build。Windows前检另按实际命令/结果分层记录。[规格](../analysis/launcher-current-control-v1/implementation-spec.json)、[前检](../analysis/launcher-current-control-v1/guest-preflight.json)。

<a id="stage111"></a>
## stage111：版本差异从原指令与独立oracle确认

现行16新记录/34不同成功反编译入口、4源区间；59239f..3a8实际NEG/LEA/ADD/AND/ADD确定ceil补齐，591f20中undefined3指针表达不能直接按C尺寸推断，59200d实际ADD ESI,8确定stride。只在旧39MB私有证据完整hash匹配后确认472e70的floor表达，不宣称重新运行旧程序。[源核验](../analysis/launcher-current-record-v1/source-check.json)、[旧表对照](../analysis/launcher-current-record-v1/table-check.json)。

PyCryptodome3.23.0标准ECB在前后交换每32位字，与现行LE32块I/O相对照；13原创新记录/最大摘要、3解码前缀与空记录、3原创交换、65分片，相关78Node通过。修复前的完整exit1与实际32B/应40B保留，源原件/完整伪码只在build，不入交付。该层不是原程序运行、真实加密会话或身份认证。[测试](../analysis/launcher-current-record-v1/test-results.json)。

<a id="stage110"></a>
## stage110：固定公开组与单次无账号观察分层

同hash现行源通过REA快照续查，106历史/17新增/123累计区分；本轮25不同成功反编译入口不等于25新协议字段。591620服务端辅助与591100/590c80客户端路径分开，按构造上下文selector/key和发送/解析调用链绑定。[台账](../analysis/launcher-current-channel-v1/rea-audit.json)。

6053a0/6053a8的编译时公开g/p与原文件节映射字节比对，另核hello主版本写入和key8/flag1栈参数，共3区间。1<peer<p来自零/一谓词和比较，不能自行把p-1删除。3/8原创新向量由Python pow/struct产生，私有指数/keys均为公开测试常量，不用真实challenge造夹具。[源检查](../analysis/launcher-current-channel-v1/source-check.json)、[向量](../analysis/launcher-current-channel-v1/original-vectors.json)。

先以6个本机TCP夹具证明仅8B写、分片、限存/超时/关闭，再单个源绑定配置BIP一次实测；529B响应仅留长度/摘要及校验结果，原文/peer值不留。Node请求写完成/close不当服务端ACK，固定组匹配不当身份认证或游戏接受。[实际回执](../analysis/launcher-current-channel-v1/network-observation.json)、[测试范围](../analysis/launcher-current-channel-v1/test-results.json)。

<a id="stage109"></a>
## stage109：同版本桥接、虚表绑定与独立状态字oracle

对实际更新后的6d459…c987，仅使用已核同hash的c82fc…c152分析副本/旧快照。REA新增59查询记录/43不同成功反编译入口，47历史记录分别列出，完整伪代码仅在私有build。0x401079未有procedure时改查精确指令/静态app vtable，不创建臆测函数；无工具/审批配置修改。[台账](../analysis/launcher-current-login-v1/rea-audit.json)。

按431000构造→5d69c4 vtable→请求/回复消费者建立源绑定，五列与丢W0的中间适配分开；4316c0伪签名15参、423c30九参不作为ABI，RET0x40/10push保留实际16/10实参。原16位复制和选择39B汇编支持状态投影，未用协议名字猜业务授权。[逐项事实](../analysis/launcher-current-login-v1/implementation-spec.json)。

原创Python struct按原生UInt32 little-endian存储后signed16读取产生48组合成报文/期望，与JS位移实现独立。精确PE32源校验器仅支持固定hash、受限节头/RVA到raw映射及5锚点，错误身份拒绝；不作通用PE解析或行为等价证明。[生成器](../analysis/launcher-current-login-v1/build_state_vectors.py)、[校验器](../analysis/launcher-current-login-v1/verify_source.py)、[结果](../analysis/launcher-current-login-v1/source-verification.json)。

<a id="stage108"></a>
## stage108：REA、依赖资格、运行事件与文件身份分别取证

**事实：** REA6.7.0/Ghidra12.1.4对4c46…4976旧更新器的普通UPX5.2.1分析副本62db…b0a4读取0x401180两段体（2176B）与0x411410的xref；88字节锚点和8区间hash复核通过。只恢复选定启动检查/五槽消费者，不把有限xref或伪代码当完整框架赋值/加载器；两条新记录私有导出后关闭会话。[REA证据与限制](../analysis/game-install-context-v1/rea-updater-stage108.json)。

**事实：** 官方附件边界内静态提取的三项PE32/x86 DLL覆盖所需258导出；Windows实际核验外层VMware包Valid，Mac本地链核验未完成，不能互相替代，也未核成每个DLL独立签名。只读介质、原四文件备份和app-local3落盘均有完整hash回执。[静态资格](../analysis/game-install-context-v1/vc71-static-stage108.json)、[Windows介质/签名](../analysis/game-install-context-v1/vc71-guest-media-stage108.json)、[落盘和运行](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)。

首次9732→2484仅两start；补库后9280→10436→9012有3start/2stop和V2.01 UI，前后四文件hash证实EXE/RegionList变化。stop里的登录器名称没有.exe，解释其不能被旧精确全名筛选命中；更新器stop未取得，不能据此宣称已证实其截断原因或退出码。provider相邻100ns值不作物理运行时长。新版完整hash/大小与当前重新hash的保留样本相同，复用既有47条REA证据，不算本轮新增47条。[首次事件](../analysis/game-install-context-v1/lifecycle-runtime-stage108.json)、[新版对应](../analysis/game-install-context-v1/updated-source-bridge-stage108.json)。

**推测：** 本次三个运行库修复支持先前加载依赖导致早退的解释；没有逐DLL加载路径/单变量排除，尚不能定唯一根因。未采集真实命令行、SID、IPC、账号或游戏帧，也未验证完整自更新事务/官方兼容。[验收分层](validation.md#stage108)。

<a id="stage107"></a>
## stage107：正常安装身份到REA源的独立对应

innoextract1.9仅extract+test三选定成员；原包完整hash与输出均核。REA直接读取打包PE资源时因范围无文件字节而明确失败，未使用部分结果；正常UPX5.2.1离线解压到独立临时文件，1735168B/601b…e31与历史目标一致后再读资源。未解包游戏保护或执行厂商代码。[提取](../analysis/game-install-context-v1/source-recheck-stage107.json)、[UPX记录](../analysis/game-install-context-v1/launcher-unpack-stage107.json)。

REA资源解析器v1完整观察325项/156资源；Ghidra12.1.4复核既有4015a0范围和401d46调用点，7处源锚点由独立文件映射核字节。完整反编译、资源内容和102条含历史Evidence仅在私有build；102不是本轮新增数，工具unknowns=0不代表游戏未知项清零。已导出并关闭会话。[证据、私有摘要与限制](../analysis/game-install-context-v1/rea-bridge-stage107.json)。

<a id="stage106"></a>
## stage106：固定许可字段与实际页面互证

已有源包/解压header摘要核对后，仅取header0 offset592前置u32=2531的许可字段，严格GBK解码/回转；后续两空字段及IFPS偏移/长度与旧证据相符。实际UI的公司/标题及末尾文字与私有全文对应；这是所选字段互证，没有通用格式/全部UI逐字验证或新的REA消费者结论。[字段/摘要/范围](../analysis/game-install-context-v1/platform-license-stage106.json)。

完整条款仅留私有build供用户查看，公开记录只保留身份与方法。提问工具accepted和文件打开queued分别是工具回执，均不当作用户接受或展示成功；当前拒绝仍选中、Next禁用，协议确认未取得。

<a id="stage105"></a>
## stage105：安装实证与原创观察工具分别验收

本轮安装结论来自实际向导、原进程回执及Windows目录/两注册表视图/四文件完整hash，聚合目录相符不表述为全文件hash验收。没有新REA游戏消费者结论；沿既有REA/静态安装链取得正常上下文。[实际安装](../analysis/game-install-context-v1/guest-installed-context-stage105.json)。

原创C仅增加固定profile行；先核门禁函数源码未变，26项主机断言和两次构建相同，再独立读取编译PE的三行指针/UTF16/hash/ImageSize，最后对完整hash相同的Windows原创fixture做一次8B观察。该次observer exit0；fixture自然结束但同PID退出码空值，保留未知。主机表检查、实际Win32成功案例和原游戏尚未读取各自留证，不把页属性当回调调用。[构建](../analysis/game-entry-v1/observer-build-stage105.json)、[Windows](../analysis/game-entry-runtime-v1/windows-observer-stage105.json)。

<a id="stage103"></a>
## stage103：解压容器、字节码解码与运行事实分层

已核上游innoextract debug CLI以 `--dump-headers --output-dir` 在两个新私有目录运行，均exit0；以唯一IFPS标记、前置u32长度及边界提取3778/3416B脚本。上游1.9对Inno6.1仍为初步支持；完整解压头含代码/条款，仅留私有build。[提取](../analysis/game-install-context-v1/compiled-extraction-stage103.json)。

可信PyPI的 binary-refinery0.11.3 源包及 pure-magic-rs0.5.1 CPython312/macOS ARM64轮包核大小/SHA，隔离到私有目录，使用现有bundled Python3.12.14 -I；未全局安装。首次缺pure_magic_rs的导入失败保留；补依赖后两包仅IFPSFile.Parse/disassembly通过。817源文件及8依赖文件与固定归档回读一致。[依赖](../analysis/game-install-context-v1/ifps-dependency-stage103.json)、[完整性](../analysis/game-install-context-v1/dependency-integrity-stage103.json)。

7项原创合成测试覆盖所用解码能力，未执行任何IFPS函数；独立读取选定导出表/体范围、字串/立即数及8个指令锚点。函数语义属于工具支持的静态推测，无新REA伪代码或运行证据。官方说明[RegQueryStringValue失败时不改输出](https://jrsoftware.org/ishelp/topic_isxfunc_regquerystringvalue.htm)、[Check可多次调用](https://jrsoftware.org/ishelp/topic_scriptcheck.htm)，故不从当前缺键推定后续分支/完整子链。[选定结果](../analysis/game-install-context-v1/install-conditions-stage103.json)。

<a id="stage102"></a>
## stage102：安装声明与注册辅助代码分层取证

**事实：** `CG5Reg.exe` 完整 SHA-256 `c3baedb2…e7e228a9`，REA6.7.0/Ghidra12.1.4保留25条记录与4锚点，导出关闭。Init `401410` 取得并截取模块目录；消息映射 `402498` 的6个uint32把 WM_COMMAND/control1 接到 `4011d0`。默认分析未把该处理器定义成函数，不能把空xref当无调用。**推测：** REA原字节、导入与独立 objdump 共同支持 `4011d0..4012a1` 向 HKCU 写 REG_SZ Path=模块目录；未伪造此段REA反编译。[证据ID、文件偏移、身份和私有导出](../analysis/game-install-context-v1/cg5reg-static-stage102.json)。

发行版 innoextract CLI 不输出完整安装动作，补构建核验上游1.9 debug版本，三个校验固定的 Homebrew 上游兼容补丁逐一 dry-run/零fuzz应用；配置、构建及两包 `--debug --info --color=0 --progress=0` 均退出0，未执行安装或Pascal。上游1.9对Inno6.1仅初步支持；两个样本均识别为6.1 Unicode，不能声称已解释全部脚本。[来源/补丁/构建](../analysis/game-install-context-v1/tool-build-stage102.json)、[所选元数据](../analysis/game-install-context-v1/installer-metadata-stage102.json)、[上游支持范围](https://constexpr.org/innoextract/)。完整条款和编译脚本留私有build。

**事实/待验证分界：** 主机与来宾完整hash、E卷ReadOnly和NotSigned实际回读已取得；签名检查的通用执行策略提示不是EXE启动失败或策略拒绝。注册声明、管理员要求和postinstall条件不证明安装、注册成功或子进程已运行。[实际回执](../analysis/game-install-context-v1/transfer-session-stage102.json)。

<a id="stage101"></a>
## stage101：路径证据与原创 PE 加载条件

**事实：** REA6.7.0/Ghidra12.1.4对`7eb173…0fe1`的16次查询新增14条保留记录（合计49），不从重复ID推算cache hit。`404010`查询实际落在包含函数`403cf0`；`40c360/40ae70/40adf0`闭合所选UTF16复制/追加链。journal/log字串在文件749068/749132，PUSH引用在13580/13776，共4处原字节锚点；完整证据私有导出并关闭。[路径审计与Evidence IDs](../analysis/launcher-update-recovery-v1/path-audit-stage101.json)。

来宾实际hash为旧`22d561…e479`，不是新样本。两私有源新鲜重核，仍仅26个时间戳/GUID字节不同，4锚点相等；这只桥接所选静态路径，不扩为全运行等价。journal精确候选Test-Path=False，不构成ACK/提交证据。

原创fixture旧版虽通过原主机检查，却被Windows拒绝。节间空洞违反[微软PE格式的节布局要求](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format)；修正版改成连续BSS并补构建门禁，取得Windows加载/8B读与独立自然退出实证。构建与实际运行仍分别记录；不把主机C断言或源码return0当退出码。[布局4项](../analysis/game-entry-v1/layout-validation-stage101.json)、[Windows结果及边界](../analysis/game-entry-runtime-v1/windows-observer-stage101.json)。

<a id="game-stage96"></a>
## stage96：按源入口追踪，区分静态槽与运行值

固定样本与7条快照先核hash，从真实entry RVA0xde6d1e（VA11e6d1e）定点追CRT/helper/注册/间接调用；新增33记录和6函数，7处按REA映射独立核原文件字节。入口JMP的编码与Ghidra CALL_TERMINATOR分类分别留痕；伪类型不代替汇编。静态8B零读与writer/read引用不解析实际回调。只分析普通控制流边界，不模拟/解密/重建保护负载。[证据ID与导出](../analysis/game-entry-v1/static-audit.json)。

新原创工具另以自身SHA和REA会话核主函数、ReadProcessMemory唯一显式调用、8B参数/返回长度、RVA和VirtualQueryEx锚点，共13记录/5源锚点。Ghidra栈/类型警告保留，以C源/汇编宽度为准，静态导入无侵入API不当作运行证明。两会话均导出并关闭。[工具证据与失败修正](../analysis/game-entry-v1/observer-static-audit.json)。主机只运行26项纯边界测试，Windows未运行；原始反编译、厂商代码与二进制留私有build。

## stage95：精确差异分类后复用代码证据

先核1387项交付与当前需求，从已有ISO静态恢复旧packed/分析副本/内嵌updater并分别核hash。逐字节差异仅26B，按真实PE debug目录和CodeView结构定位为时间戳/GUID，其余字节同一；18旧函数体逐范围映射新源并计算hash。该结果支持限定代码证据复用，不等于所有外部身份检查或运行行为相同。[源比对](../analysis/launcher-update-recovery-v1/byte-comparison.json)。

新hash独立打开REA，无旧snapshot导入，选9函数/8指令映射源字节，35记录私有导出/关闭。日志返回值按AL而非void伪类型；先行规格注明16B header/原生尾随、历史stage/当前文件、XOR/认证三种边界，再编写纯实现和独立Python向量。[规格与验收](../analysis/launcher-update-recovery-v1/validation.json)。

知识库Router真实位置在00-Atlas，双角色3000预算查询缺requirement-index而失败，未称完整加载或修改其他项目；当前项目需求真源已定位。GUI只调用文档恢复及现有Parallels绑定，工具返回locked后未输入，未重放临时策略。当前Node/Chrome句柄已确认退出0，不把等待用户解锁称作verified wait。

## 新鲜运行分层与自动换版的独立身份（stage94）

同一脚本四模式各1次，分别保存Verify、Install、父句柄Observe、UI、Restore停止、最后文件与策略回读。所有时间区分UAC/Start与父句柄，不按成功marker推断子链完成；不保存原始来宾截图、凭据、账号、窗口标题/argv/内存或网络载荷。已存在的Tools重启变化记为外部观察，未猜测发起者。[证据入口](../analysis/launcher-current-runtime-v4/validation.json)。

Restore guard发现换版即停，没有改名单重试；以独立有界公开HTTP三GET、ZIP/Python及现有纯核心确认最终guest同hash，再用UPX5.2.1生成独立分析副本。新REA目标不导入旧snapshot，Ghidra12.1.4选择8函数、10指令映射到原始副本字节均匹配，47记录私有导出/快照后关闭。新嵌入updater不同hash即不同样本，旧推论不自动沿用。[静态台账](../analysis/launcher-current-runtime-v4/static-audit.json)、[源核对](../analysis/launcher-current-runtime-v4/source-check.json)。

先行实施规格区分已证“整对更新”与独立IndexedDB事务；代码验证区分模型化故障注入、真实Chrome事务与Windows未知故障矩阵。初次浏览器网络审计失败及修订同步后实跑分别保留，未删失败记录或把真实事务替换成模拟结果。[实施与验收](../analysis/launcher-current-refresh-v1/validation.json)。

## 当前策略实测与旧材料去过期（stage93）

先回读stage92的1359交付项、规范需求与唯一VM排障知识库，再恢复CUA文档并读取准确Parallels窗口。只读短命令Get-ExecutionPolicy在英输入下完整可见后提交一次，结果Restricted；旧错误/历史scope列表不当新执行。记录受控元数据，不保存原始来宾画面、账号或日志。没有新REA/原程序/网络载荷观察。[观察](../analysis/launcher-current-runtime-v3/observation.json)。

旧game-consumer预检的tmp路径已失效，读取失败不作为分析阴性证据；仅用rg在项目build内找到既有同名缓存，核hash后按PE头/节表读原.text边界。缓存hash与留存证据一致，但不据raw_size0否定可见helpers或所有合法新材料路线。旧stage37建议的inventory/MAP01对照当前导出/源码确认stage38已实现，不重复建功能。

按完整四步、平台及官方验收检查7项要求/20规格；同策略条件连续4轮，期间独立实现进展与当前受阻分别记账，不借用旧locked审计计数。先完成文档/交付检查再提交blocked状态，实际状态以goal工具回执为准；未把策略放宽或自动继续消息当批准。[审计与规则原文](../analysis/launcher-current-runtime-v3/blocked-audit.json)。

## 新版元数据的生产者、ABI 与请求消费者（stage92）

复核stage91交付1346项、匹配样本与快照后，沿完整worker中的本地摘要、比较调用、locator-builder和HTTP包装器逐层补12函数/8指令，共20新证据，总51。原始函数dossier及快照只在private build；公共台账保留hash、provider/profile、函数体范围和Evidence ID，导出后关闭，不执行UPX分析副本。[先行问题与规格](../analysis/launcher-current-metadata-v1/implementation-spec.json)、[最终审计](../analysis/launcher-current-metadata-v1/static-audit.json)。

摘要生产者的小写nibble路径与case-sensitive比较消费者结合，避免只看规范化后的MD5。配置摘要的“无token消费者”结论限定在已分析完整worker，不推广到其他路径；HTTP包装参数依汇编调用栈确认8MiB/cache/cancel，EAX使用纠正伪代码签名。源码角色0x407680不是hash、0x409aa0不是初始化，保留问题原文并记录纠正。

独立check_source.py按PE节raw映射核对8指令和4字面，检查51记录与31旧/20新ID和profile；单入口字节不单独证明函数语义。Python hashlib/bytes标准操作与明确拒绝向量提供原创oracle，63向量未排除。真实Chrome加载实际shared/web模块并发回环HTTP，不用注入的假网络替代69次实际GET；没有渲染产品UI变化或视觉验收声明。[验证](../analysis/launcher-current-metadata-v1/validation.json)。

## 新版配置对的消费者与独立核心（stage91）

固定新样本及匹配Ghidra12.1.4/profile快照复用14记录，沿既有callback的三个callee→rollback字面xref→恢复入口及XML命名子元素查找，共补11函数/17记录；导出31记录后关闭。没有运行分析unpacked程序。伪代码void由比较helper的实际EAX/EBX返回纠正，staged-write角色由API消费者确认；函数体inclusive范围及非源码性质保留。[可追溯台账](../analysis/launcher-current-catalog-v1/static-audit.json)。

源文件hash先核，按PE节raw映射核对4条指令及10字面，共14锚点；不使用VA减base作为原始文件偏移。独立核心只复用既有有界XML语法解析和原始字节所有权，完整字段解析不改。Python标准库ElementTree与bytes给原创向量，不保存官方配置/反编译正文。内部PI的oracle/实现差异保留明确profile排除。[源字节](../analysis/launcher-current-catalog-v1/source-check.json)、[先行规格](../analysis/launcher-current-catalog-v1/implementation-spec.json)。

Node558实际回归和独立Chrome上下文的ESM导出/53向量及四组附加检查完成，进程均退出0。浏览器插件/skill未列出，使用已有Playwright；本次是非渲染库检查，无新页面或视觉声明。原生事务/恢复与Windows策略停止点仍独立，不用测试通过替代目标程序/游戏验收。[验证分层](../analysis/launcher-current-catalog-v1/validation.json)。

## 来宾解析与执行策略拒绝分层（stage90）

本轮无新REA查询/协议推断。正常解锁后以实际可见完整命令→提交→新结果/提示符核验输入；九成员hash人工转录后与主机JSON逐项比较。Windows5.1Parser只读解析不执行.ps1，MOLI_PARSE_OK不替代Verify主体、NTFS或原程序验证。后续-File的真实SecurityError如实保留，停止该路线，不换输入形式执行同一脚本。[来宾回执](../analysis/launcher-current-runtime-v2/guest-preflight.json)。

五作用域Undefined是事实；默认Restricted及进程参数失效范围按[微软5.1文档](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-5.1)解释。仅进程RemoteSigned是待当次确认的具体变更，允许该会话及子会话的未签名本地脚本，不能称单文件白名单。没有持久策略更改、凭据、原程序内存或协议载荷采集。[方案](../analysis/launcher-current-runtime-v2/policy-proposal.json)。

限定目录的通配查询无对象只能支持该查询结果，不能证明Windows全局缺库或旧子进程失败原因。前缀hash来自旧已载入数组，不能追认为本轮文件新读或原文件保留。上下文截断不当作目标执行失败/重发依据；完整原始画面及日志不保存到交付。[诊断](../analysis/launcher-current-runtime-v2/readonly-diagnostics.json)。

## 正常运行准备与工具验证分层（stage89）

本轮没有新REA查询或目标程序执行。固定新packed候选 `71180e5bdda771e7d57dd27d2b879beddee55d61b957dadf7a2da60c907cb69a`仅作为数据加入私有ISO，保留18函数/29条REA及新字节核心的既有结果。备份/替换/观察/恢复工具为原创，先建方案，再写源码并用官方便携PowerShell解析、原创临时文件与真实原创短进程验证。[方案](../analysis/launcher-current-runtime-v1/run-plan.json)、[12项结果](../analysis/launcher-current-runtime-v1/host-tests.json)。

工具来源按微软[macOS archive说明](https://learn.microsoft.com/powershell/scripting/install/installing-powershell-on-macos)和[固定7.6.6发布](https://github.com/PowerShell/PowerShell/releases/tag/v7.6.6)，下载digest/独立hash表、Mach-O arm64、codesign strict与实际版本分别核对；没有把元数据当运行证明。首次UTF8误解码hash表在提取前失败，UTF16 BOM复核后继续；File.Replace空值绑定由原创fixture复现，typed [NullString](https://learn.microsoft.com/en-us/dotnet/api/system.management.automation.language.nullstring?view=powershellsdk-1.1.0)修复，原失败fixture保留，不改Windows政策。[工具身份](../analysis/launcher-current-runtime-v1/tool-readiness.json)。

ISO使用hdiutil data-only/Joliet，在临时目录构造，bsdtar精确集合与各字节回读，检查非boot/无autorun，产物只在build。主机解析/文件系统/计时测试不代表Windows5.1/NTFS/UAC/目标进程；本轮GUI仍locked，恢复后继续独立来宾验收。[介质](../analysis/launcher-current-runtime-v1/media-validation.json)。


## 新样本更新器与可复现候选校验（stage88）

从stage87固定新内嵌更新器814080字节/`22d56137a48d3c95f4a779c5c68ba85b3ea4fe2439e3e561159d003c697ce479`单独开Ghidra12.1.4，字符串→xref→包含函数→dossier，共18函数/29条证据。先导出27条并关闭，下载完成条件留下具体缺口，再从同hash快照恢复补2条，最终导出/关闭；不重复统计缓存证据。完整反编译/快照只保留private build，公开台账仅元数据/短结论。[原始证据身份、范围与限制](../analysis/launcher-current-updater-v1/static-audit.json)。

**事实：** 名称函数405ab0的AL返回、405c40的DOS/NT读取长度、e_lfanew范围和四个字段比较由汇编确认，纠正伪代码void签名；FID类名不当源码。主程序ACK资源复用已取得资源树，再按偏移3940872重读21字节校hash；没有重复资源枚举或执行目标。

先建实施规格，再独立编写纯共享校验和Python zipfile/struct/hashlib合成向量。正常/截断/异构PE头/名称/多条目/CRC/MD5/声明长度/膨胀预算分别隔离，原创无section样本明确证明仅头profile；真实包与标准库逐字节对照。Windows事务/ACK运行、完整PE、原生签名和游戏仍待验证。[实施范围](../analysis/launcher-current-updater-v1/implementation-spec.json)、[验收](../analysis/launcher-current-updater-v1/validation.json)。


## 正常启动、日志关联与不同样本分离（stage87）

先重核stage86全部1282项及八文档基线，依操作知识库恢复自动暂停、实际英文终端和固定guesthash，才提交一次原登录器/UAC。显示/进程生命周期分开验收；晚确认的15:11:59至15:12:03不倒写成90秒实时监控通过。无账户、抓包、映射或调试寄存器采集。[启动](../analysis/launcher-runtime-v2/startup-observation.json)。

普通文件列表漏隐藏项，后用`-Force`及LiteralPath hash查到原嵌更新器；不把早期未列出改写为不存在。仅在来宾内读取受控无账号日志，按936解码尾部、去HTML看诊断；成果只保存状态，完整日志/截图不复制。前619字节hash命令仍未取得提交结果，不声明逐字节追加证明。[后续](../analysis/launcher-runtime-v2/postrun-files.json)。

临时旧PE缺失后，从同hash原安装器静态重提、UPX5.2.1解压至同hash，恢复旧快照。10条新增记录含符号拼写纠正和既有函数复用，不算独立新发现；首次摘要脚本因procedure字段可为字符串而失败，写前停止，后按实际类型纠正。旧会话331记录导出/快照关闭。[台账](../analysis/launcher-runtime-v2/rea-followup.json)。

当前主机HTTP元数据两次200，再按locator的两个token分别解析URL/进度分母；不能把整个两行文本交URL规范化。一次20秒/4MiB包预算GET，真实1469515B；shared解包结果与Python zipfile/zlib逐字节比。新UPX副本另开REA，4函数dossier/14记录与完整有界资源清单157项，导出/关闭。旧偏移不迁移，反编译栈别名不当精确ABI；HTTP/摘要不证明来源认证。[当前元数据](../analysis/launcher-runtime-v2/current-update-metadata.json)、[获取](../analysis/launcher-runtime-v2/update-package-acquisition.json)、[对照](../analysis/launcher-runtime-v2/candidate-independent-comparison.json)。

## 有界公开清单取证及历史源界限（stage86）

**最后访问复查：** 电脑控制在读取窗口前再次报告Mac locked且自动解锁失败，未提交原启动命令。需正常手动解锁并恢复既有终端焦点操作；当前Windows/联网授权保持。[最新工具结果](../analysis/launcher-patch-live-v1/access-recheck.json)。

复用固定Patcher SHA256195f…aaa8的REA v26规格：409240应用体、40983e更新路径引用及477b22字节；独立适配已明确epochSeconds构造Update.TXT?t。没有新REA会话或函数分析，也没有执行补丁器。先请求当前公开XML摘要；HTTP在响应前关闭，正常TLS又握手EOF，未继续下载两XML或声称当前对通过。[HTTP](../analysis/launcher-patch-live-v1/network-observation.json)、[HTTPS](../analysis/launcher-patch-live-v1/https-catalog-followup.json)。

随后独立标记“历史外部服务快照”，重新核验旧GameList/RegionList与其摘要，绑定唯一Code11怀旧→首个区域名→Region33的PIP/PPort，只允许该全局IPv4:80一请求；不猜地址、不扫描、不下载载荷。macOS进程内SIGALRM约束本次15秒整体请求，实测超时，无正文/新格式事实。旧源不替代当前配置或官方接受。[限定方案](../analysis/launcher-patch-live-v1/retained-source-probe-plan.json)、[结果](../analysis/launcher-patch-live-v1/retained-source-probe.json)。

VM当前自动暂停正常恢复，只证明控制操作及覆盖层变化；普通来宾输入仍需单独证明。[恢复](../analysis/launcher-patch-live-v1/vm-resume.json)。

## 当前官网包与固定输入链（stage85）

通过普通浏览器读取官网“HTTP下载”的实际DOM href，纠正网页检索工具所尝试HTTPS不能代替原链接的判断。正常HTTPS失败及浏览器canceled分别记录，取消原因未知；依据实际HTTP链接做有界单次入站下载，未改变浏览器或TLS设置。[浏览器记录](../analysis/launcher-provenance-v1/browser-observation.json)、[获取](../analysis/launcher-provenance-v1/http-acquisition.json)。

ZIP唯一安装器与原件逐字节比较，再用innoextract1.9 extract+test仅抽取临时目录三文件，匹配来宾固定hash。REA inspect_artifact的artifact-graph provider1独立确认同成员SHA256，归档中央目录范围完整；非成员字节不在其范围。export2records后，归档无具体profile导致snapshot保存失败，空参数close正常结束；不把失败snapshot当成功。[链](../analysis/launcher-provenance-v1/installer-chain.json)、[REA摘要](../analysis/launcher-provenance-v1/rea-archive.json)。

当前推论限“官网分发对应”，不升级为HTTP认证、签名、原程序行为或官方兼容。较早locked后用户已解锁，重建CUA绑定；原生Win+Q显示搜索，但普通mouse/text尚未证明到达来宾，不能据成功回执声明输入可用。没有原启动命令输入/提交，已请求人工焦点后再重核guesthash。[较早访问](../analysis/launcher-provenance-v1/access-observation.json)、[最新补验](../analysis/launcher-provenance-v1/access-followup.json)。

## 来宾签名与公开摘要核对（stage84）

本轮使用CUA读取既有Windows PowerShell的固定目录/hash及Authenticode结果，留存去敏元数据，无原始终端/账号画面。原登录器SHA256109b…8ef0e匹配、实际`NotSigned`；两XML匹配原固定版本。主机只对已证HTTP摘要路径作一次无账号GET，33B摘要匹配不构成发行者认证。没有新REA会话/反编译、原程序执行或内存采集；原REA静态链仍沿既有证据。[来宾](../analysis/launcher-runtime-v1/guest-preflight.json)、[摘要](../analysis/launcher-runtime-v1/update-metadata-preflight.json)。

固定来源未核实样本的单次正常联网启动已形成可审阅方案；具体执行确认来自CUA政策，不把普通工具授权收回，也不虚构自动审批拒绝。[方案](../analysis/launcher-runtime-v1/normal-start-plan.json)。

## 当前运行证据方法与范围（stage83 / 2026-10-28）

**事实：** 复核stage82全部1220项hash和六文档私有基线；已有REA固定x86夹具的16个调用点/原字节证据复用，没有新开REA会话。微软SDK x86 CDB及目标均在Windows核SHA256，CDB签名Valid/版本26100.9457；7个真实EIP相对位点102f/1137/1192/11e5/1236/1249/1259与已证调用返回地址一致。ASLR未关闭，`@$exentry-0x1270`与`lm m moli*`实际基址一致，目标退出事件code0。[原调用点](../analysis/runtime-observer-v2/fixture-call-sites.json)、[实测](../analysis/runtime-observer-v3/fixture-lifecycle.json)。

**失败与纠正：** 固定400000假设在制作介质前被DYNAMIC_BASE检查阻止；长交互命令损字曾让CDB把脚本当EXE，193/0x800700c1在目标创建前失败。ARM64工具WOW64上下文返回EIP0，改用同SDK x86工具；`.radix 16`改为`n 16`，`$$`注释中的分号也会分割命令。目标退出后的g已报错并正常收尾，不写成无错误全自动通过。[记录](../analysis/runtime-observer-v3/arm64-debugger-attempt.json)、[x86首次](../analysis/runtime-observer-v3/x86-debugger-attempt.json)。

**推测与待验证：** 架构一致是本次观察成功的条件，不能据两次运行证明ARM64工具失败的唯一根因。固定返回位点的API标签来自先前静态分析，并非通用API入口解析。无事件计时，既有计时契约未运行；CDB自动打印过原创目标寄存器，去敏保留选择性元数据不等于通用后端隐私通过。原程序/会话/通信消费者仍待正常流程证据。[验收](../analysis/runtime-observer-v3/validation.json)。


## 当前SDK工具核验与Windows安装方法（stage82 / 2026-10-28）

先核stage81的1207文件并保存六文档基线；实际项目需求与操作知识库优先，知识库双角色查询缺requirement-index明确保留，未全量加载索引或写其他项目。微软[调试工具说明](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/debugger-download-tools)列出[SDK/ISO正式路线](https://learn.microsoft.com/en-us/windows/apps/windows-sdk/downloads)：一次标准HTTPS GET取得1173295104B，26.094秒，实际SHA256固定而非微软另发校验值。[下载](../analysis/runtime-tool-readiness-v1/sdk-download.json)。

bsdtar提示视图不作完整目录。用Homebrew sevenzip读取UDF、GNOME工具核MSI表/提取，逐项对照1003路径与大小，1001项有文件，两非压缩Redist缺项保留；只读原ISO完整。15核心PE经File/Component/Directory/Media链定位至CAB，用7-Zip与msiextract独立双解码完整bytes比较；三架构PE各核，ARM64 CDB同目录导入闭包4模块，外部与动态加载待实测。[组件](../analysis/runtime-tool-readiness-v1/sdk-audit.json)、[主机依赖](../analysis/runtime-tool-readiness-v1/toolchain.json)。

默认CA五项失败先保留，区分缺issuer与两MSI内容摘要不匹配。微软[PKI仓库](https://www.microsoft.com/pkiops/docs/repository.htm)发布的Root2010指纹与官方HTTPS证书匹配，证书仅作CA/TSA-CA参数，无系统信任导入、忽略时间戳或验证降级；19项选定文件通过。Redist异常原因未定，未手动运行或重签；安装器内部子包执行链未逐项采集，不能扩大为全包验签。[签名范围](../analysis/runtime-tool-readiness-v1/signature-audit.json)。

普通GUI未确认输入时停止试键；人工点击后先验单键/退格/英文，再核完整PowerShell命令后提交。原生菜单逐项selected导航至CD/Open，只选重核hash的精确SDK ISO；文件框返回后一次已观察来宾空白区点击恢复捕获。D:Loaded True、安装器完整hash和Windows签名Valid后普通启动SDK；许可出现时先停。用户对具体许可门槛回复后接受本次协议，Privacy No保留。按依赖顺序取消并读回仅调试工具，核对微软UAC后安装、确认完成页、正常Close。[安装](../analysis/runtime-tool-readiness-v1/sdk-installation-followup.json)。

安装后重新核ARM64 CDB hash和Windows签名，普通`-version`返回10.0.26100.9457、退出0；不把创建PID/完成页/自身启动写成目标调试能力。当前无新REA会话、原程序或原创目标运行，产品测试未重跑；后续先验原创x86程序和仅元数据采集。[来宾证据](../analysis/runtime-tool-readiness-v1/cdb-windows-check.json)。


## 当前GUI恢复与控件错误核验（stage81 / 2026-10-28）

复核前轮1201项hash、保存六文档基线，先读操作知识库。用户正常解锁后只用普通CUA绑定已知完整应用路径，由既有v22快照名确认目标，不用AX窗口UUID当VM身份；先观察隔离/断网、建原生恢复点，再做有限进程关键词查询。来宾截图使用本次实际原始像素；IME预编辑须提交且读回，延迟窗口出现与动作发送分别记录。[实际观察](../analysis/runtime-install-v1/gui-observation.json)。

网络Source有限操作未展开，不点击隐藏子项。Devices/Network父菜单出现错误报告后停止该路径，仅正常关闭；关闭输出截断先读状态，不重发。定点读取对应时刻的一份本机`.ips`，仅提取版本/异常/前八帧模块及源SHA256，未保存完整报告、内存、寄存器、账户、截图或发送遥测。Qt栈与动作时序是事实，根因和复现性未知，不用旧CLI签名失效替代此次根因证据。[去敏摘要](../analysis/runtime-install-v1/parallels-error-summary.json)。

原生创建进度结束与快照XML精确名称/hash交叉核验，不宣称还原通过。当前Windows画面可见及配置Connected0/IsolatedVm1分开记录，不把配置文件、桌面可读或快照存在当网络、工具或游戏验收。已请求最小人工正常网络调整；新恢复回合已有实际环境进展，旧blocked结论仅保留历史。

## 当前阻塞审计方法（stage80）

按最近一次用户恢复目标重新计数，不复用stage77旧材料阻塞计数。stage78记录准备进展并首次遇GUI依赖，stage79记录公开包GET失败及第二次GUI依赖，本轮普通入口新读再次报告locked。先验证1197项当前产物，再审计完整四步目标、已有授权、剩余路线与无活跃句柄；不把用户回复/锁状态文件或准备进展当实时观察。[审计](../analysis/runtime-access-blocked-v1/blocked-audit.json)。

当前仅记录代理实际动作：工具消息包含automatic unlock失败，不宣称工具内部零尝试；代理未输入/读取密码PIN或发显式解锁命令。停止后续重复请求和变更，恢复正常普通访问后再接续；完整游戏仍不成立。


## 当前访问及固定公开包核验（stage79）

复核1191项产物，普通CUA读取报告locked后停止。读取[微软固定清单](https://github.com/microsoft/winget-pkgs/blob/master/manifests/m/Microsoft/WinDbg/1.2506.12002.0/Microsoft.WinDbg.installer.yaml)确认ARM64、地址和发布SHA，仅作元数据。当前工具/联网授权下的公开正常GET与HEAD分别记录，标准TLS与客户端身份未改；两者均403/0字节，原因未知，该地址停止。旧appinstaller拒绝端点未重试。[结果](../analysis/runtime-access-v1/access-status.json)。微软[正式安装路线](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/)仍是后续候选，未实测Store/安装/包依赖。无活跃进程或工具句柄，不称verified wait。


## 当前联网与原创Windows观测目标方法（stage78）

按用户新授权，用独立http.client GET请求5个已证路径，限定正文预算、逐次关闭连接，不跟重定向、不带账号/Cookie或环境代理凭据；原始响应仅私有build。另一次标准TLS请求记录EOF失败且保持验证，DNS非全局仅报告路由观测，不推断源站。现有shared解析器和实际旧源bytes独立核对当前摘要/XML；探索性历史匹配标记被新字节对照明确替代，没有改写旧回执。[请求脚本](../analysis/runtime-observer-v2/probe_updates.py)、[当前对照](../analysis/runtime-observer-v2/current-source-comparison.json)。

复用现有MinGW-w64/GCC16.2.0，新增原创freestanding C以手写PID名称/导出函数代替旧CRT入口；只链接KERNEL32。Mac clang host stand-ins执行同一函数，毒指针与失败清理10例；PE字节/导入与REA两函数交叉核验16处CALL，再比较两次构建。完整REA导出/快照留私有build，摘要/证据ID/hash交付，完成后关闭。静态returnRVA不伪造为实时事件，host模拟不称Windows验收。[源审计](../analysis/runtime-observer-v2/audit_fixture.py)、[全部边界](../analysis/runtime-observer-v2/static-spec.json)。

当前Cua文档重载后，仅一次emitfalse应用列表请求报告locked，未绑定应用或改状态；不把通用工具授权当访问已恢复，也不走已取消CLI或调低保护。[当前观察](../analysis/runtime-observer-v2/environment-observation.json)。


## 当前阻塞核实方法（stage77 / 2026-10-27）

连续三轮把同一游戏consumer/protocol材料缺口按同一条件计数；不因词义变化、重校hash或文档变更重置审计。第二轮只读重核原包哈希/2,368清单与四DLL直接字面线索，第三轮再次核输入/1,163项交付hash和REA会话关闭。初始`--silent`无列表不作为未发现文件的证据，普通重新列清单后再比对。[清单核验](../analysis/game-consumer-blocked-v1/inventory-revalidation.json)。

有界公开检索仅查询发行方相关资料与精确PDB名/GUID，没有获得版本匹配协议/可分析构建；[官方安装说明](https://www.crossgate.com.cn/_private/setupgame.htm)只作用户流程参考，不转作消息规格。未采信第三方协议替代固定样本、下载未知程序或联系账号方。完整目标/可选路线/停止理由与恢复材料见[审计](../analysis/game-consumer-blocked-v1/blocked-audit.json)。无新产品/VM/原程序/凭据/安全配置操作。

## 当前游戏命令行候选核验（stage76 / 2026-10-27）

复用packed-boundary/static-feasibility与登录器门槛审计，先重核Code11游戏SHA256及REA留存（0条），再分析两份文件后备函数，定点查询3交接常量及缓存全局引用。独立Python固定hash PE映射重核34处指令/UTF16LE/ASCII锚点；没有重复全量字面扫描或匿名映射分析。[可重跑源审计](../analysis/game-consumer-v1/verify_source.py)。

完整7条REA证据与快照只在私有build，新文件导出后关闭、open=false/cleanup_pending=false；交付保留摘要/证据ID/hash，不保存大段反编译代码。函数边界/assembly与high-pcode覆盖分别标记；注册/维护用途只作推测，未知间接/重建流不因空xref被排除。[工具版本、位置、覆盖与原始导出hash](../analysis/game-consumer-v1/static-spec.json)。未执行/解密/重建载荷或读取真实IPC/账号/官服。

## 当前门槛审计、首次Config与模式接线取证（stage75 / 2026-10-27）

先把需求/REA/源码/实际验收逐项对照，发现onlyRefresh的真实接线遗漏及首次Config规格缺口；不通过缩小完整目标宣称完成。[审计](../analysis/launcher-v30/launcher-gate-audit.json)。主样本/旧导出hash重核后import已有321记录，仅409780为新函数，读取2短区域、11份retained投影，不重复分析已有大函数；335记录导出/快照后实际closed/cleanupfalse。主value-flow截断保持未知，局部Listing/Profile helper顺序与原PE短字节交叉核26锚点/3反例。

MD5 section与原Code key、raw ConfigEXE命令、wait/失败继续分别依据具体参数/分支；不按GetAllocLength/FID名或词义猜。Python hashlib/rawconcat参考24+9，原固定XML独立ElementTree/bytes24条件，Node516与浏览器模块同向量/实际5次原创交换通过。新模式不改wire；真实账号/Profile/Config或游戏均未执行/读取。工具与依赖沿REA6.7.0/Ghidra12.1.4、Node/Python和已装Playwright/Chrome，无新安装/全局变更。[总回执](../analysis/launcher-v30/validation.json)。

当前阶段两个首屏PNG路径被回归同名重写，初始像素身份不能验证；原回执留存，不虚称已恢复。新目录独立重验并采用排他句柄写入，collision拒绝有证明，最终路径交集与每图hash核对；历史阶段保留检查独立进行。[事故](../analysis/launcher-v30/artifact-output-incident.json)、[视觉](../analysis/launcher-v30/visual-review.json)。六项浏览器检查通过，手机尺寸不等同真机/微信，pagehide不等于完整BFCache。

## 保留资源快照与原生浏览器事务取证（stage74 / 2026-10-27）

复用固定样本v26/27语法/候选/配置绑定，重核原文件和私有导出/快照hash；没有新native问题，不重复REA。新资源快照schema、CAS、取消/锁与精确恢复是独立政策，不作为原Windows事务事实。[复用](../analysis/launcher-v29/evidence-reuse.json)。前轮1089项hash和18项基线保留；当前KB查询仍缺requirement-index，以项目需求文档为真源，不改全局知识。

Python hashlib/JSON提供两原创bytes/MD5/绑定key参考；Node501验纯格式和生命周期。Chrome真实IndexedDB测试以原生事务与最小事件hook区分put成功后abort、complete后取消、已提交后的截止点；put错误明确注入，未知/坏/冲突数据保留通过。IDB完成事件是提交证据，onsuccess(put)只作中间观察；不以mock数据库当原生浏览器证明。[存储](../analysis/launcher-v29/resource-store-browser.json)。

Browser插件/skill缺席，复用Playwright1.62.1/Chrome155；实际本机HTTP/WS/TCP、两页面CAS、重载/恢复及等待open取消，13新UI/19旧回归和交付示例通过。六项浏览器检查与首屏/保存/恢复截图逐张观察，脚本/像素均项目外，analysis只存用户要求的原创向量/元数据。无新依赖或样本/VM/真实账号/官方请求；容量/配额/设备/游戏未验。[视觉](../analysis/launcher-v29/visual-review.json)、[总验收](../analysis/launcher-v29/validation.json)。

## 保留补丁页面复用取证与实际I/O核验（stage73 / 2026-10-27）

本轮直接复用已证v26/27规格，无新native问题，不重复REA；重新核对两固定样本及私有导出/快照hash，函数与工具版本保留在[复用记录](../analysis/launcher-v28/evidence-reuse.json)。界面状态/明确选择/总时限与精确来源属于独立政策，不能据测试通过反推原Windows实现。修改前1056项hash及20项目标基线保存，旧产物继续保留。

浏览器插件/skill未提供，按frontend-testing-debugging使用已装Playwright1.62.1/Chrome155；临时脚本和截图放项目外，按用户项目文档要求仅将测试元数据/原创向量纳入analysis。桌面/390px先验首屏、身份/非空/overlay/console，再跑实际原生FileList、跨明确CORS的原创HTTP、WS/TCP和Python独立请求核对。13补丁/6默认回归及可运行示例通过；截图逐张观察，不以DOM代替视觉。两项测试预期纠正另存失败/最终回执，无历史覆盖。[方法结果](../analysis/launcher-v28/visual-review.json)、[验收](../analysis/launcher-v28/validation.json)。

现有Node/Python/PyCryptodome/Pako与浏览器能力足够，无新依赖、全局配置或安全权限变更。没有样本运行、安装写入、真实账号/会话或官方请求；原生恢复/来源信任/目标设备/游戏未验。

## 保留补丁入口的取证与实现复核（stage72 / 2026-10-27）

先核1027前轮hash与固定主登录器/167594732B快照，13文档/矩阵基线后源码改前扩至16目标。REA v42复用406110/4015a0/405da0和大小写/替换callee，新增一个operator+重载、1短读取/4投影及1已存在函数重查至321记录；没有把重查当独立证据。精确Listing/短字节复核32锚点及3篡改负例，导出/快照关闭后open=false/cleanup_pending=false。[台账](../analysis/launcher-v27/static-spec.json)。

Python原创32生产/21退出码与固定配置8命令独立对照；Node478和Chrome11流程/13更新HTTP通过。回环服务用Python原创ZIP，独立记录实际URL序列，旧31语法/10候选也在浏览器回归。原生valueflow截断、locale/权限/错误恢复保持未知；新增ASCII/C、快照、URL/来源/总时限与候选事务是独立政策。[验收](../analysis/launcher-v27/validation.json)。

已有REA/Ghidra/Java、Xcode LLVM、Pako、Node/Python和Chrome/Playwright足够，无新安装/安全/VM修改；Browser插件未提供，故复用Playwright。路由development/R1的项目requirement-index仍缺，当前development-plan为需求真源，不修改全局知识库。新阶段输出与临时QA目录均带v27/stage72保护，未重写历史回执或引入官方资源。

## 保留Patcher证据链与复核（stage71 / 2026-10-27）

沿REA v42静态工作流，以固定578560B/hash的Patcher为唯一目标，已有HTTP407cb0 dossier只读复用；旧6131B空快照无primitive记录，不当函数缓存。新增35函数/2短读取，追应用→文本切分/字段map→操作虚表→下载→ZIP枚举→文件消费者，原始bundle/快照留私有build并记录hash，37记录导出后关闭；无目标执行、全局审批/安全配置改动。[精确账本](../analysis/launcher-v26/static-spec.json)。

源字节独立复核28锚点（call/短literal/虚表/指令）及3篡改负例；Python独立扫描器31语法、zipfile/zlib/hashlib10原创候选与Chrome实际ESM对照；Node457（新21）通过。初次测试含盘符字段预期错误如实保留，按冒号消费者事实修正。反编译变量恢复/完整错误路径不因测试通过而确认为原行为。[验收](../analysis/launcher-v26/validation.json)。

用户已授权缺失普通依赖直接补齐，本轮xcrun llvm-objdump补足PATH未含objdump的只读能力，REA/Ghidra/Java/Pako/Chrome/Playwright/Python均已有；没有新安装、付费、VM或官方连接。Browser插件未提供，故复用现有Playwright作核心引擎核验，没有新增UI或截图验收。知识路由development/R1下项目requirement-index仍缺，使用当前development-plan，不改全局知识库。历史回执与native17文件按新交付清单继续保留。

## 保留Galaxy证据与实现方法（stage70）

984前轮hash和固定样本/快照先核，13文档/矩阵及源码改前补至22基线。复用4015a0/410df0/407a00与旧源Listing，补405f90、407880、自定义列表metadata包装、阶段UI函数；6新函数/9新记录至314，另明确一份旧helper重查。源LLVM Listing辅助跨未归属dispatcher片段，不把function跨度当完整归属；26短字面/CALL/操作数锚点+3身份/字面负例绑定原PE。大段反编译/反汇编仅私有build，export/snapshot后关闭。[台账](../analysis/launcher-v25/static-spec.json)。

PythonElementTree/独立筛选和全区域Name计数给出63原创向量；15新/436总Node测试显式选择、源序号、歧义、参数、路径/端点边界。固定真实配置只读hash与旧oracle重核5/12/8/5通过；真实配置无Galaxy另列。Chrome实际HTTP/IDB/FileList/WS/TCP，6分组/9旧流程与独立3+4请求通过，桌面/390px图已观察。Browser插件缺失复用Playwright1.62.1，不重跑已闭合producer、不安装无关依赖。[QA输出守卫](../analysis/launcher-v25/qa-runner-guard.json)、[验收](../analysis/launcher-v25/validation.json)。

## 当前统一交接的实现与验证方法（stage69）

先核959前轮hash，保存19目标，发现handoff清理缺陷后在修改前补第20原件。固定v23/v22的process/resource/mapping已证，无新二进制问题，直接复用305记录及两个匹配私有导出；不为页面接线重复REA。配置pair重新校验、ordinal绑定、严格路径/字节profile与浏览器目录规则明确标独立适配政策。[复用元数据](../analysis/launcher-v24/reused-native-spec.json)、[检查](../analysis/launcher-v24/checks.json)。

45组旧Python独立process/mapping向量联合、原回包选择和新字段编码/目录/所有权边界组成17新/421总Node。借出fill覆盖先复现再最小修复、验证单buffer转移清理。实际Chrome原生目录选择+HTTP/WS/TCP由独立Python核4新/7旧请求，9新/8旧流程通过；桌面/390px六项检查及最终图已观察。Browser插件缺失复用Playwright1.62.1，没有新增依赖/全局配置。MDN/WICG只用于API边界，不当Windows行为证据。[QA隔离守卫](../analysis/launcher-v24/qa-runner-guard.json)、[验收](../analysis/launcher-v24/validation.json)。

## 当前命令/资源生产证据方法（stage68）

先验940前轮hash/固定样本与快照，再复用407a00，针对408840、CFileFind双buffer、title/目录虚槽、CString append/replace和mbslwr链取24函数/7短读取。31新记录至305；私有完整导出和快照摘要保留，REA关闭。成果仅元数据、函数范围/ID、49短锚点和原创向量，不加入完整反编译或资产。字节验证纠正GetAllocLength/Uppercase名称，Listing栈参数补足title拼接。[台账](../analysis/launcher-v23/static-spec.json)、[可重复oracle](../analysis/launcher-v23/process_oracle.py)。

Python bytes/正则作为独立参考生成48进程/4枚举向量，另3身份/字面负例；手工规则哨兵、输入预算/ownership/异常分支纳入14新/404总Node。Chrome实际ESM执行这些向量及5既有ASCII名字，未重复未改UI的视觉回归。普通依赖已足够，未安装新包/改全局配置。Microsoft的FindFirst/FindNext、CFileFind、splitpath和mbslwr官方资料用于界定顺序/locale限制，具体链接见台账；源Listing仍为固定样本事实依据。[验收](../analysis/launcher-v23/validation.json)。

## stage67：交接生产端与共享函数体取证（2026-10-27）

911旧交付hash先核通过，13文档/矩阵和3代码目标共16写前基线。复用已有REA技能/规则与当前开发需求；3000-token development/R1 experience/requirement-index查询仍缺项目索引，以项目内需求真源继续，没有写全局/其他项目。[前置](../analysis/launcher-v22/preflight.json)。

匹配601b…样本/v21快照复用407a00/4133a0/v8候选证据，补4函数/2静态bytes读/1内部地址解析，共7记录至274，导出/关闭。44dc00入口只7B，不能让伪代码的完整copy循环掩盖body归属；沿跳转定位44dc75并读取其所属44dc10。unsigned64 wrapper的坏参数伪表达式以原push顺序/high0/radix32/sign0和digit分支为准；partial caller限制保留。[台账](../analysis/launcher-v22/static-spec.json)。

复用旧只读PE32锚点核验器，21处源字面/调用/指令通过；Python用bit groups而JS用除法生成base32，126原创向量/42回包选择投影独立匹配。pure producer只返回NUL前缀，不把映射尾部/OS副作用或argv补造成事实。Node390（新10）；Browser插件缺席用已有Playwright1.62.1/Chrome155，实际HTTP/native WS/TCP/Python原创对端，8交接+9编码+17配置流程/1测量通过，总10039ms。[验收](../analysis/launcher-v22/validation.json)。

真实产品pagehide显示残留先复现再修根因；旧文案测试断言另列修正，未放宽门禁。两个初始失败回执/日志/像素先保留，当前runner独立stage22 guard，不重写历史结果。控制PageTransitionEvent只验handler，不充当全部BFCache/设备或游戏消费者。没有真实IPC/账号、原EXE/VM/官服/新依赖或提交发布；完整源/快照仅私有build。[复核](../analysis/launcher-v22/review-corrections.json)。

## stage66：字段引用完整范围与非秘密模式存储（2026-10-27）

初始887旧交付hash通过，先留13文档/矩阵基线，实施前再加shared/index与web HTML/app，共16。development/R1与3000-token experience/requirement-index查询仍缺当前项目需求索引；按当前项目需求文档继续，没有构建非过期索引、读取其他项目或修改全局规则。[前置](../analysis/launcher-v21/preflight.json)。

REA6.7.0/Ghidra12.1.4复用v18匹配快照/固定601b…样本，先查+1484/+1488字面偏移、析构。原文件独立完整.text扫描纠正初始搜索范围不全：4额外地址均在后段异常展开函数；扩展同目标搜索/4个函数后，26字面位置、2析构CALL与4展开JMP全部独立验证。新增5函数/9记录至267，完整bundle/快照仅私有build，关闭状态另确认。释放不等于零化，字面引用完整也不代表别名/间接/其他存储API完整，保持有界未知。[证据](../analysis/launcher-v21/static-spec.json)、[核验器](../analysis/launcher-v21/audit_credential_fields.py)。

已证UserMode整数与账号字段分开：新增纯严格两key偏好codec和浏览器懒Storage/明确保存/回读/刷新恢复。Node380（新11）通过，随后产品未变。Browser插件缺席，依前端验证技能使用现有Playwright1.62.1/Chrome155；临时脚本/PNG项目外，元数据按项目要求归analysis/reports。12设置检查/495请求，9编码/256请求和17配置回归+1测量/462请求通过，0非预期错误，1预期取消单列，总10041ms。正向为真实Storage/HTTP/native WS/TCP/Python独立对端；异常/读回竞争仅专门hook，范围单列。[验收](../analysis/launcher-v21/validation.json)。

初始错误selector导致0流程完成，旧会话已退出1后才改脚本重跑；记录失败，不因观察超时重启未确认进程。新runner先复制/核全输出路径并限定stage21，历史stage65事故记录/原manifest身份保持，未把新结果写回旧回执。[复核](../analysis/launcher-v21/review-corrections.json)。没有新依赖/原EXE/VM/真实账号/官方游戏请求、提交或发布；模式设置的回读/刷新不替代原INI映射/耐久性或真实账号/游戏验收。

## stage65：固定公开映射、独立编码对照与事故留痕（2026-10-27）

初始857旧交付hash全部通过，22个目标修改前存基线。按当前需求先登录器，复用REA6.7.0/Ghidra12.1.4的ANSI/16B/GetACP证据；不为普通平台编码适配重复反编译，也不从显式profile推定实际ACP。TalonBrain development/R1、experience/requirement-index/3000-token查询仍缺本项目需求索引，以现有development-plan为需求真源，没有构建非过期索引或改全局/其他项目。[前置](../analysis/launcher-v20/preflight.json)。

按用户“缺少依赖能力直接补充”下载Unicode官方CP936表/许可并核hash，保留License V3；源表只在私有build，确定性生成器须匹配固定源hash、可--check，无安装脚本/运行时下载。Python标准库gbk与UTF8/struct/hashlib独立产生21791映射/2149未分配/1037标量参考，80 Euro按微软源单列。JavaScript纯核心不调用平台TextEncoder/Decoder；Node369（新11）通过。[依赖](../analysis/launcher-v20/dependency.json)、[参考](../analysis/launcher-v20/encoding-reference.json)。

现有Playwright1.62.1/Chrome155，独立临时上下文/原创中文输入和四页说明，9编码检查+17配置会话回归/1时限测量通过。实际浏览器HTTP/native WS→owned Node TCP→Python独立编码/解密验证请求，不用同一JS算法自证；244/440请求分别记录、回归1预期取消另列、总10043ms。名称源顺序假设失败保留，依据独立数值列修正测试，不放宽生产门禁。当前桌面/390px截图检查，不当真机结果。[验收](../analysis/launcher-v20/validation.json)、[复核](../analysis/launcher-v20/review-corrections.json)。

**可避免的操作事故：** 误运行旧v19脚本导致一份历史详细回执及3张临时PNG覆盖；原详细bytes/像素无法恢复。保留stage64 manifest原身份、未变历史汇总/日志；被覆盖回执改为诚实事故指针，新观察/当前重验单独保存。后续复制/全路径核对/输出guard后运行；禁止根据hash或汇总臆造原文件。[事故证据/恢复限制](../analysis/launcher-v20/artifact-output-incident.json)。此为计划22目标之外的单列意外变更，不称全部历史原件保持。临时测试脚本/截图在项目外，无原样本、VM、真实账号、官方游戏端点或提交发布。

## stage64：复用REA事实、验证实际编排（2026-10-27）

先核832旧交付hash/21目标基线，需求文档明确配置到会话的范围。知识库development/R1路由与3000-token experience/requirement-index查询仍报缺项目需求索引，以仓库当前需求为真源；不构建非过期索引或扩大读取其他项目。复用固定601b…样本/v18私有bundle并核7函数ID；Code请求word、原文许可键及BIP事实已在v6/v7/v10闭合，不重复REA生产查询，不把UI策略回写为原行为。[证据](../analysis/launcher-v19/reused-native-spec.json)。

编排File/缓存/HTTP/bootstrap与原生WebSocket/TCP；全部输入为原创XML/参考bytes/条款说明和公开合成账号。Node358（新11）通过；Chrome17流程+1实际测量、429回环请求，1次预期负例取消单列、0非预期错误。前置5500ms延迟后仍在总10052ms停止，证明未给后段重置10s；Python独立验证5个完整浏览器请求（含同页0→1）/另1取消。[回执](../analysis/launcher-v19/browser-validation.json)。取消/时限负例用Playwright持有原创响应，正向流程为真实HTTP/IDB/native WS/TCP，分开声明。

Browser插件不存在，继续已有Playwright1.62.1/Chrome155；没有新依赖/全局配置。临时脚本/截图位于/private/tmp，成果只保留用户要求的可复核元数据与日志；全文反编译/官方原件不进交付。两个单测字段/标签假设与fieldset断言差异先诊断后修测试，未改变生产门禁，[记录](../analysis/launcher-v19/review-corrections.json)。文档锚点v17曾移到v18段前，本轮归回其正确标题并按实际目标验链。没有原程序/VM/真实账号/官方请求或独立子代理审查。

## stage63：窄范围REA与实际浏览器交互（2026-10-27）

核对778旧交付哈希并保存精确基线，先在需求入口确定ASCII子集/原创新服务范围。按既有路由使用项目requirement-index缺失时的本仓库需求真源；不重建或扩大读取其他知识库。REA复用v16匹配快照，GetACP/GetWindowTextA/WideCharToMultiByte定点xref及两个新CRT函数；既有DDX/提交证据直接读缓存，不重复相同生产查询。5新记录至258、3原字节/IAT锚点通过，完整bundle/快照只在build并正常关闭，[身份/位置](../analysis/launcher-v18/static-spec.json)。GetACP有限引用不等于运行ACP已知，所以独立ASCII政策保持标注。

按用户“缺少的依赖能力直接补充”，从ws主注册表固定8.22.0，校验tarball SHA512/SHA1与19文件，保留MIT，不执行安装脚本/安装可选原生包/改全局设置。已有Node26.9.0、Python/PyCryptodome3.23.0、Chrome155与Playwright1.62.1继续复用。Browser插件不存在，使用普通Playwright，临时脚本/截图在/private/tmp；项目只保留用户要求的可复核元数据/日志，[依赖](../analysis/launcher-v18/dependency.json)。

实现后Node347（新12）通过；实际浏览器页面而非注入session检查10项/167 GET。最终5连接为profiles2、empty1、rejected1、stall取消1，4完整请求由Python独立算法解密/逐字节比较，fresh公值不同、关闭可见。原文本始终textContent，截图只含原创公开测试数据。根URL资源404和旧候选失效问题均先复现后修复；6→4属于夹具期望错误，失败记录不计通过。[方法/修正](../analysis/launcher-v18/review-corrections.json)、[验收](../analysis/launcher-v18/validation.json)。这是主线程复核，未声称独立子代理审查。原EXE/VM/官服/真实账号和游戏均无新增执行。

## stage62：从字节意图到实际流I/O（2026-10-27）

先核对756项当前交付/13个修改基线，复用v7/v9 REA事实，不为普通适配重复原函数分析。新端口政策显式写出：输入/方法快照、平台熵/单调时钟、10s总截止、4MiB计数、取消/迟到清理与candidate所有权；不新增协议字段或原Windows行为结论。[契约](../analysis/launcher-v17/session-spec.json)。知识库当前项目缺mandatory requirement-index，项目内既有development-plan继续作为真实需求入口；没有借加载其他项目或改全局规则替代。

用原创Python/PyCryptodome进程绑定127.0.0.1，公开原创新挑战/请求frame和独立pow/Blowfish核对实际TCP；每次客户端平台熵不同，对端由client public重新推导key，不能靠重放固定密文key过关。测试/示例只保存状态、计数、相等/EOF结果，不保存生成的nonce/key或请求正文。[对端](../analysis/launcher-v17/original_tcp_peer.py)、[三组示例](../analysis/launcher-v17/example-output.json)。

先保留两个端口事件时序失败，再用实际accept/close事件修正测试假设；未改变生产关闭语义。根线程复核直接复现可变close重读和可变错误回执污染snapshot，两者最小修复并补回归；null定时器/原型code边界同时收紧。[测试修正](../analysis/launcher-v17/test-corrections.json)、[复核](../analysis/launcher-v17/review-corrections.json)。最终Node335（会话25/端口10新测试）全部通过。

Browser插件未提供，沿用Playwright1.62.1/Chrome155新临时上下文；实际portable ESM、WebCrypto/时钟/取消及原页面6项通过，27源码回环GET/0错误。浏览器流注入与Node真实TCP分开，不把页面/向量当浏览器联网；临时脚本/PNG在项目外，仅按项目规则保留元数据。[回执](../analysis/launcher-v17/browser-session-smoke.json)、[验收](../analysis/launcher-v17/validation.json)。官方Node API资料支持平台契约，版本化文档路径不可访问的局限与实际本机26.9.0运行分开记录。无原程序/VM、真实账号或官方游戏端点操作。

## stage61：模式/Profile的有限调用与效果计划（2026-10-27）

前置核对746项交付和固定目标/v14快照hash，再复用REA6.7.0/Ghidra12.1.4。已有4015a0/415d20及Profile/清理证据直接读取既有bundle；新增8函数/14记录至253，导出和新快照后关闭。[台账](../analysis/launcher-v16/static-spec.json)。只有元数据/地址/哈希入analysis，完整反编译在私有build。

字面dlgUserMode过程搜索为空、精确API名解析失败均保留为有界结果；新证据按构造器已引用虚表/返回map指针及已知IAT4b12d8追踪，不重复同一失败或重装工具。独立PE将5处间接调用绑定WritePrivateProfileStringA，14直调/10数据共29操作数通过；不从无direct caller或某个INI导入推导全程序无账号持久化。框架注册表分支、间接调用和真实Profile映射仍未知。

分别写出初始化mode2保留用户名勾选、切换清两项输入、2→1确认等原事实；明确cancel/等待不写、own数据属性和section预算为新政策。纯计划只发非秘密效果，不复制原非1modal结果落mode2的隐含决定，也不访问真实凭据。Python54政策向量可重复生成，Node300及Chrome54向量/旧页5项分别证明当前实现；这不证明原程序动态等价或账号/条款已持久化。[验收](../analysis/launcher-v16/validation.json)。

## stage60：实际配置页面与原生缓存验收（2026-10-27）

本轮复用v6配置/v14原写入与候选缓存规格，没有新原程序问题，不重复REA。修改前stage59的737项交付hash匹配，先保留目标源码/文档基线再改。主实现只加浏览器原字节File适配及本机缓存页面编排；shared核心、算法依赖及native历史未变。[前置](../analysis/launcher-v15/preflight.json)、[当前规格](launcher-static.md#launcher-v15)。

使用frontend-testing-debugging技能，运行时无Browser插件/对应browser技能，按其fallback使用现有Playwright1.62.1与Chrome155。临时脚本/PNG放项目外，按项目文档要求仅在analysis/reports保存有界结果元数据。实际页面URL/标题、非空内容、错误覆盖层、console、交互及截图分别验；Node288不代替浏览器原生IndexedDB。受控write/abort/complete延迟钩子只作用独立临时上下文并finally恢复，模块源码通过真实回环GET加载，无请求拦截伪造页面结果。

桌面1280×1000与缩放390×844的14项实际页面流程通过；另独立390×844初次导航→保存/恢复→离线计划，以及GB18030已知向量文件→保存→重载→恢复/逐字节比较通过。最终三组共200源码GET，0console warn/error与pageerror。原始XML/原游戏资源/账号均未进入这些测试；截图只含原创内容。[UI](../analysis/launcher-v15/ui-validation.json)、[窄屏](../analysis/launcher-v15/mobile-validation.json)、[编码](../analysis/launcher-v15/encoding-validation.json)。

窄屏初次等待失败后保留诊断：不是先重启，先查DOM/请求和精确进程；4模块连接重置、直接GET200、服务仍活。相同Handler/16并发的队列5与64分别6/16和16/16，只改本机backlog，精确目标SIGINT正常退出/同端口启动再测16/16与完整页面。Handler/白名单/CSP保持不变，不追认历史失败根因。初次缩放截图条带原因未定，最终等待两帧及全新上下文截图正常；不据此改CSS或放宽交互断言。[服务证据](../analysis/launcher-v15/server-burst-check.json)、[视觉/失败区别](../analysis/launcher-v15/visual-review.json)、[总验收](../analysis/launcher-v15/validation.json)。

## stage59：文件错误边界与跨平台初始化（2026-10-27）

固定601b…主登录器恢复v13快照，REA6.7.0/Ghidra12.1.4补入6函数、总239记录，导出/快照后关闭。独立producer审查用4015a0既有dossier，精确比较Game/Region GET、Delete/Open/strlen/Write/Close与最终parse顺序；31原始字节锚点绑定file offset/导入名，变样本先拒绝。[台账](../analysis/launcher-v14/static-spec.json)、[生产链](../analysis/launcher-v14/catalog-producer.json)。

补查callee纠正过度结论：Write/Close没有可检查的主调者返回值，不等于没有失败处理；WriteFile/GetLastError/短写→CFileException抛出链可见。3001在Open算出disposition4，与CreateFileA的OPEN_ALWAYS对应；不能称CREATE_ALWAYS或必截断。408660是选择状态相关重置，不当写后hash。未见主调者成对回滚是有界观察，磁盘半更新仅为可达推论，原程序/EH未执行。

新实现明确为独立prepare→显式候选缓存两步：raw digest与整pair文本/XML先于提交；缓存按版本/单record事务，native complete才确认、abort保持旧pair、晚取消已提交作不同结果。Node285与真实Chrome12项分别验I/O/数据和原生IDB行为，无fake IndexedDB替代。独立只读复核19项无可复现问题；没有据其静态复核冒称独立浏览器运行。[验收](../analysis/launcher-v14/validation.json)。

## stage58：vtable到WinINet与平台I/O（2026-10-27）

从固定601b…主登录器v12快照继续，REA6.7.0/Ghidra12.1.4补入14函数/3次4B槽观察，总233记录，导出/快照后关闭。CHttpFile构造写4ba934、基类写4ba8cc，+34槽读取与445f74 Listing/IAT4b168c共同闭合；+4c槽与445b3d/InternetCloseHandle闭合正常释放。14个原创固定字节锚点和旧17锚点独立重核，样本改变先拒绝。[台账](../analysis/launcher-v13/static-spec.json)、[新锚点](../analysis/launcher-v13/http-bindings.json)。

分清原指令与反编译：QueryInfo的EDI/EAX保存恢复优先于cookie返回伪表达式；41aed9 Listing为JMP到父栈延续，不将“terminal call”通用标签当CALL指令。逐块409030追加最终走strlen，不能拿文本helper推导二进制ZIP传输。另一父对象/全EH、rtm和locale仍未知，正常闭合不扩大成全流程等价。

先定义显式origin/严格2xx/raw bytes/预算与截止点这些独立政策，再用真实原创loopback HTTP服务验GET→既有清单/ZIP核心。Node263、Chrome6项及18次native/adapter对照分别证明本地运行；实际UI接线、官方CORS/信任和存储事务不由这些结果推导。[验收](../analysis/launcher-v13/validation.json)。

独立复核精确复现了timer调度延迟和origin getter增长；最小修复单调绝对截止点（含拒绝）及固定初始length，保留回归和独立确认。两个错误测试假设另列。Chrome合并smoke曾在bytes断言通过后报告ERR_ABORTED；保留失败，独立native/adapter有无拦截18次均未复现，加networkidle等待后完整通过。原因未定，不宣称已证明修复Chrome或对端已关闭。[诊断](../analysis/launcher-v13/browser-transport-diagnostic.json)。

## stage57：清单文本与调用栈消费绑定（2026-10-27）

主登录器601b…重新核hash，复用该目标v10快照，不能复用v11更新器快照为主登录器证据。REA6.7.0/Ghidra12.1.4新增19不同函数/24记录，专题26函数；共216记录导出/快照后关闭，完整产物留私有build。[台账](../analysis/launcher-v12/static-spec.json)。重复获取同函数不计新增不同函数。

库名不是行为证据：4093a0标成MakeLower但下游实际走__mbsupr_s_l；4097a0误名ReleaseAccessors，但这里设置CString长度/NUL。409440的右/左修剪与调用者空格→LF→CR序列分开核验。40b158依赖父栈，是提取器延续；用原始push次序和EAX回传辨别预压第二实参，不按伪代码错配两个XML摘要或locator/progress。[地址/EBP/跳转绑定](../analysis/launcher-v12/manifest-bindings.json)。

原始文件MD5与响应文本处理是两条不同路径。独立Python/hashlib15响应/4目录组合、Node245及Chrome6项验证限定实现；经典ASCII空白和严格整数等政策单列，不泛化为原locale/atoi的所有输入等价。历史66B XML摘要按保留值重建并匹配当时完整SHA256；主摘要显式合成，没有新HTTP观察，不能据此宣称当前更新或服务兼容。[离线比较](../analysis/launcher-v12/local-metadata-comparison.json)。

浏览器首次本地模块连接重置及按钮超时均保留、不计成功；检查原服务与直接GET后用新独立上下文完成验证，无源码改动或断言放宽。连接重置根因仍未定，最终通过不能反推最初已成功。[验收及边界](../analysis/launcher-v12/validation.json)。

## stage56：更新ZIP与完整摘要算法（2026-10-27）

固定更新器62db…副本重新核hash；REA6.7.0/Ghidra12.1.4专题23函数/3短字节观察，26记录，导出/快照后关闭。用PK0506/0102/0304实际比较、首目录选择、method0/8与windowBits=-15辨别ZIP/raw Deflate；CFile间接调用错位栈仍记为部分恢复，不照抄伪代码。[台账](../analysis/launcher-v11/static-spec.json)。

独立Listing逐轮表达式核对4037b0的64常数/消息字/Boolean sum/旋转和四项加回；识别ESP+58临时复用、被JMP跳过的非连续body缺口。配合IV/bitcount/LE/padding及实读format字节，MD5从算法猜测升级为限定静态事实；CRC表256项亦匹配。[复核](../analysis/launcher-v11/native-md5-review.json)。它们不证明可信清单或成功替换。

Pako3.0.2 registry tarball SHA512核对，选未改发布Inflate-only ESM，保留MIT和源map中原Zlib notice；不运行安装/脚本。原创15 ZIP由Python struct/zlib构造再由zipfile读取，Node232及Chrome6通过，真实ZIP与原样本完整比较。独立descriptor歧义复现已修复并双形式回归；所有测试与真实对照保持trust未验证，未执行文件。[验收](../analysis/launcher-v11/validation.json)。

## stage55：许可键、数据长度与会话内清理（2026-10-27）

固定601b…副本复用v9快照，REA6.7.0/Ghidra12.1.4新增42不同函数/66记录，总192；导出/保存快照后关闭。许可Profile消费者、MD564轮及四Boolean helper、LE/padding/hex、资源构造/页推进和输入清理分别闭合；台账仅保留地址/range/hash，反编译和条款正文留私有build。[范围](../analysis/launcher-v10/static-spec.json)。

函数命名不能覆盖原始字段：40bd50被命名GetAllocLength却读data-0x10+4，结合40d370的+4/+8与Microsoft CStringData定义修正为当前数据长度。UserMode初始化mode2不清username标志，而修改模式会清两输入，保留差异，不泛化到磁盘持久化。四页ID非零也不等于已读取/已显示。[具体链](launcher-static.md#launcher-v10)。

独立Python/hashlib23向量、4080个Node crypto对照、64轮schedule比较和Node215/Chrome6项验证原创实现。独立复核的迭代器/TypedArray子类伪装已修复；预算使用原生长度先于copy，四availability用own索引。工具证据hash字段的初次错误已修正并重跑；没有以空/失败输出冒充核验。实际条款接受、存储和官方互操作仍无证据。[验收](../analysis/launcher-v10/validation.json)。

## stage54：消息表/父栈延续与离线流程（2026-10-27）

同601b…样本恢复v8快照，REA6.7.0/Ghidra12.1.4新增9函数、2处字节读取，专题16函数/126记录，完整bundle/新快照最终已关闭。SetTimer/KillTimer wrappers、WM_TIMER行、异常块和延续块分别取证；不把不同对象的完成字节、timer值或可写状态合并为认证标志。[台账](../analysis/launcher-v9/static-spec.json)。

原始continuation的非连续范围和父栈依赖优先于伪代码自调用；用既有Apple LLVM21.0.0从已知指令边界独立核对15处索引/跳转。一个探索性半指令起点已纠正，只保留/计数正确输出；大段原输出不进源码成果。[独立核验](../analysis/launcher-v9/retry-independent.json)。原EH类型/所有throw点和运行时消息调度仍未恢复，不用有界实现政策补成观察事实。

新控制器仅有本地代次/时钟与字节/连接意图，单调总deadline、有限开启失败轮换和不重发策略与原Windows调度分开。3组独立Python/PyCryptodome原创向量校验完整字节链，Node200及Chrome6项证据分别证明核心和当前浏览器运行；不证明原程序、socket回执、真实身份/会话或官方兼容。[验收](../analysis/launcher-v9/validation.json)。

## stage53：UI/ABI与有界覆盖补核（2026-10-27）

固定601b…登录器复用v7快照，REA6.7.0/Ghidra12.1.4新增9函数，专题14函数/115证据；最后导出完整bundle/新快照至私有build并关闭。DDX/校验/提交链和资源style交叉确认字段边界，资源只投影位置/摘要/控件metadata；标题、原始模板和大段源码不进入新成果。[台账](../analysis/launcher-v8/static-spec.json)、[DIALOG核验](../analysis/launcher-v8/dialog-controls.json)。

反编译签名少参时用逐push与RET栈清理核对，不能因其少第16/10参而丢tailWordB。原410df0 Listing的后半覆盖不足时，没有重复全量分析或宣称完整；以现有Apple LLVM21.0.0读取已知case4范围，9处条件/跳转独立匹配，原输出只在build，交付仅指令地址/相关操作、range SHA和结论。[ABI](../analysis/launcher-v8/reply-abi.json)、[范围证据](../analysis/launcher-v8/case4-independent.json)。猜测Homebrew gobjdump路径失败后盘点了实际`/usr/bin/objdump`；无新安装、安全配置变化或目标执行。

独立Python3请求/6候选向量、DIALOG4原创测试、Node179及Chrome6项运行验证已完成，均只用公开原创常量或固定离线材料。代码页/平台文本转换、真实身份/会话和官方兼容仍未知；静态调用、原型恢复、数学匹配和选择门槛不可互相代替。[验收](../analysis/launcher-v8/validation.json)。下列工具/阶段记录是各自当时的事实。

## 样本身份

| 安装包 | 字节数 | SHA256 |
|---|---:|---|
| POLCN_Setup.exe | 2,192,044 | `dc90bb88e35a82a649f1c026bd0b7b6e7039ddbe5e872f40ffebfb4b16b0fb11` |
| CrossGate_Setup.exe | 1,104,268,439 | `e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983` |

位置均在项目 `moli/`。两者 `e_lfanew` 位于文件 `0x3c`，值 `0x100`；`PE` 签名后的 Machine 为 `0x14c`，OptionalHeader Magic `0x10b`，10 个 section：可确认 x86 PE32。Certificate Directory 为 0/0，只能说明未在该目录观察到嵌入证书；未验证外部目录签名或官方发布摘要。

初始工程除 `.DS_Store` 和两份安装包外无文件，没有 `.git`、源码、`AGENTS.md`、`.agents/skills`；对项目及祖先路径的适用 AGENTS 文件已检查。未清理原文件。文件 mtime 是样本元数据，不等于构建/官方发布日期。

Quarantine 显示登录器来源应用为 Chrome，主包对应百度网盘字符串；没有 WhereFroms URL。这是下载应用线索，不能认证来源。[input-manifest.json](../analysis/input-manifest.json) 保存原始观察；[复核清单](../analysis/reproduced-input-manifest.json) 由项目脚本重新计算。公开官方页面链接的 ZIP 日期恰与本地 mtime 日期相合，仍未下载或逐字节比对。详见[公开渠道与条款](official-terms.md)。

## 工具与方法

- REA 6.7.0 完整环境 CLI：`/Users/lx/.local/share/rea-engines/bin/rea`。没有改动注册、安全或审批配置。
- 免费后端 Ghidra 12.1.4、JDK 21.0.13；REA `inspect-artifact` 对两个安装包产生身份/格式证据。该入口把包当成 PE，**没有识别出 Inno 内部文件**，所以它的 root coverage 不代表安装内容已完全分析。
- `innoextract 1.9 --list` 识别 setup data version 6.1.0 (unicode)。虽然 help 声明支持上限为 6.0.5，实际样本列举与所选内容解包成功；这不证明所有安装脚本语义都已解析。
- 仅选择配置、模块和少量资源到 `/tmp/moli-analysis/`，不运行 PE。UPX 的标准静态解压仅用于其可识别的登录器/内嵌更新器，保持安装包原件不变；没有对游戏保护做动态绕过。
- GNU objdump、Rizin 用于静态头/导入和已定位引用。无效或不可运行的 REA 包装入口保留错误，不用假设填补。
- Python 标准库与项目 Swift 工具用于独立哈希、边界及结构复核。测试输入是合成数据。

## REA 运行状态

1. 初次 `rea doctor` 在受限环境无法写 Swift/Clang 默认模块缓存；改到 `/tmp` 的编译缓存变量未传递到 REA 所需子进程。保留 [失败证据](../analysis/rea-doctor.json)。
2. 经执行权限审查允许运行标准自检后，Ghidra、JDK、native decompiler 检查通过，见 [自检报告](../analysis/rea-doctor-authorized.json)。全局 healthy 仍为 false，原因包括没有安装非必要付费后端/其他客户端注册或 skill identity 漂移；未为此更改配置。
3. 随后 REA/Ghidra 对 **UPX 静态解压副本**真实完成分析：[rea-launcher-ghidra.json](../analysis/rea-launcher-ghidra.json)。识别 x86、ImageBase 0x400000、5,789 个已识别过程、2,456 个已定义字符串。这是后端的分析数量，不代表完整恢复源程序。
4. `inspect-with-objdump` 和部分 `execute-rizin-command` 包装入口在沙箱中报无法运行 configured command，直接静态后端能读取；保留失败文件与直接工具结果。没有修改审批设置来隐藏失败。
5. 当前会话的 MCP 工具目录未暴露 REA 工具，因此使用用户指定完整环境 CLI。没有把“CLI 成功”写成“MCP 连通性已验证”。

## 复现与证据目录

在项目根执行以下命令不会执行或下载目标程序：

```sh
python3 scripts/inventory-installers.py moli
/opt/homebrew/bin/innoextract --list moli/POLCN_Setup.exe
/opt/homebrew/bin/innoextract --list moli/CrossGate_Setup.exe
/Users/lx/.local/share/rea-engines/bin/rea inspect-artifact moli/POLCN_Setup.exe --format json
```

更深入分析的精确样本/命令/偏移见[登录器报告](launcher-static.md)与[游戏报告](game-static.md)。安装内容清单分别在 `analysis/polcn-inventory.txt` 与 `analysis/crossgate-inventory.txt`；后续证据在 `analysis/launcher/`、`analysis/game/`。临时解包路径将来可能消失，保留的哈希、清单与方法可用于复核，不应把临时路径当成长期依赖。

所有数字偏移明确区分文件偏移与虚拟地址（VA）。UPX 解压副本与原 EXE 的哈希及偏移不同。没有账号、凭据、会话捕获、动态游戏运行、服务器探测、官方资源分发或源码拷贝；报告中的少量字符串/头信息仅为可追溯观察。

## 前两项执行审批的实际范围与结果

以下来自实际工具调用与返回；没有将未澄清的“始终允许”保存为全局或项目自动批准规则，也没有修改REA安全/审批设置。

| 顺序 | 实际命令/目标及副作用 | 执行结果 |
|---|---|---|
| 1 | `rea doctor --format json`，完整环境CLI；允许生成已安装分析工具所需标准编译缓存，结果写入 `analysis/rea-doctor-authorized.json` | `require_escalated` 请求获执行，命令结束exit 1；Ghidra/JDK/native decompiler通过，整体healthy=false源于其他缺项。不能写成全部自检通过 |
| 2 | `rea analyze /tmp/moli-analysis/polcn/POLCN_Launcher.unpacked.exe --provider ghidra --snapshot /tmp/moli-analysis/polcn/launcher-ghidra.json --format json`；读取离线副本并创建静态分析缓存 | 请求获执行，exit 0；`analysis/rea-launcher-ghidra.json` 的Evidence `ev_6cf90853937d900e48ce7e50a7ec04cdb46894c53c5c7febc44ed5cd9ae9d50c`确认完成 |

风险限于运行已安装工具解析未知字节和写缓存，不包含运行Windows目标、联网、读取账号或改变访问策略。“获执行”依据工具回执，不臆测由谁点击批准。随后的更新器函数静态核查和第一阶段项目写回也都返回完成。就这两项及已结束的静态执行而言，均有终止回执，没有running/pending；不能用此结论覆盖后来中断的浏览器导入。未来操作按具体范围及环境权限判断。


## 第二阶段方法和导入审批边界

新证据目录为 `analysis/protocol-v2/`、`analysis/resources-v2/`、`analysis/audio-v2/`。协议规格逐项绑定静态字节/调用、推测和所需下一验证；资源采用独立Python oracle与无平台依赖JS核心差分。真实样本仍仅在临时目录，工程保留元数据和哈希，测试只含原创夹具。

最近浏览器审批对应 `GraphicInfoV3_18.bin`，781,840 B，配对图形的40B记录索引，目的为导入本地 `http://127.0.0.1:4173/web/` 核验工具。网页代码仅在浏览器内存读取，不经网络传输或持久保存文件内容。工具因连接中断没有返回成功；恢复后两个文件输入为空。本轮未重复导入，实际UI流程记为未验收；不是“始终允许”规则已保存，也不把它扩展为任意文件或外部上传许可。详见[验收记录](validation.md)。


## 第三阶段复核方法与执行状态

复用原样本身份及标准离线解包，不新增下载。REA6.7.0/Ghidra12.1.4提供函数/引用观察，GNU objdump2.47.20260726、Rizin0.9.1及原创Python3.9.6脚本交叉核对PE导入、VA/file offset、短锚点与区间hash。完整dossier只在临时目录；`analysis/protocol-v3/`保存有限来源投影、Evidence ID/原JSON hash、原创解释和测试。

本轮分别核查更新器consumer、非自更新启动、更新HTTP及游戏/Patcher边界。对函数边界、p-code截断、间接调用和线性解码不确定性显式保留；未解析边不被自动补为网络关系。原产品运行源码未改动，仅补分析脚本/证据和同步文档。

首次普通沙箱REA请求仍因标准Swift/Clang缓存目录写权限失败；针对明确静态工具命令的执行审查后成功完成。没有修改安全设置或全局规则，调用均有终止回执，无挂起分析/审批。浏览器文件导入本轮按要求未重试；不把此前用户“始终允许”扩展到任意操作。各分支结果和集成命令见[第三阶段验收](validation.md#第三阶段离线启动与网络调用证据增量)。

## 隔离环境准备方法与审批事实（2026-10-25）

本轮先只读system_profiler/df、应用版本和限定目录文件名，再用UTM界面盘点。只查看旧VM摘要，不打开其客户机文件；两个Windows候选在废纸篓并使用共享网络，因此未恢复或启动。新建本项目空白VM、关闭网络/共享、只启动UEFI后停止并做关机副本。详见[盘点](../analysis/vm-preparation-v1/host-inventory.json)和[环境记录](vm-environment.md)。

普通沙箱内sysctl读内存失败，改用system_profiler；UTM容器目录读权限失败后未再读取；utmctl --help退出134，未依赖该CLI。codesign/spctl在沙箱内报签名子系统错误，具体只读命令经外部执行审查后通过签名与公证验证，没有改Gatekeeper。项目build/utm目录及新VM关机基线复制均经具体执行审查完成，不覆盖旧数据。微软官方ISO下载首次因沙箱DNS受限失败；对同一官方生成链接的具体下载审查获准后HTTP200完成，不接受安装许可、不传用户文件。未保存广泛自动批准规则。

UTM界面曾由用户改变：后续关闭窗口动作被工具拦下；重读发现空白VM又显示UEFI Shell。停止进一步UI更改以免冲突，继续镜像核验和文档。此为用户接管/状态变化，不是自动批准审查拒绝；不要报告最后仍已关机。

## 上一阶段安装介质与许可关口（2026-10-25，历史结果）

上一轮UI控制协调已获用户明确继续。仅操作同一新项目VM，正常关闭空白UEFI，UTM导入已校验官方ISO后转为只读CD/USB，再启动Windows安装器。重新SHA256和qemu-img逻辑比较通过，固定双盘审计30项及4项原创负例通过；没有改旧空白策略来放宽验收。证据目录`analysis/vm-install-v1/`；上一轮`vm-preparation-v1`未挂载/停止等记录保留历史语境。

当前显示实际中文2024年4月微软许可页，默认家庭版仅用于查看；未按接受、没有最终版别/许可承诺。产品密钥字段始终为空，使用官方安装器内置的延后输入入口；不构成绕过激活或免费试用。该阶段当时等待具体条款确认，并非工具审批挂起或自动审查拒绝；后续拒绝见本轮记录。安装器启动后内部qcow2容器大小和哈希变化已记录，不宣称原盘全程只读或Windows已安装；原关机基线未覆盖。部分guest鼠标输入无效、长字符串输入重复和首次CD按键超时均保留为操作限制，使用正常键盘流程完成引导。

## Windows安装继续与拒绝（2026-10-25，v2历史）

用户明确确认具体2024年4月条款后，重新观察一致并首次接受成功；安装目标盘为空。WinPE内置diskpart仅作list disk/exit只读诊断，无固定磁盘，wpeutil shutdown正常关机。UTM仅更改原系统盘接口为NVMe，精确diff及独立策略验证，无驱动下载/安全修改。微软公开StorNVMe资料仅为接口选择依据，不冒充实际客户机支持证明。

重启后重新核对同一许可，第二次Alt+A被自动审批审查拒绝，理由为未认可转交确认对具体法律承诺的授权。该动作未执行，未通过点击/脚本等替代方式重试；该阶段结束时仍在许可页，NVMe客户机识别和Windows安装未完成。独立文档/测试/配置核验继续完成。`analysis/vm-install-v2/`保存逐次结果；v1历史未接受状态保留，不覆盖为本轮状态。此处是真实自动审查拒绝，与此前用户接管、浏览器连接中断和site-safety拒绝分别记录。

## 后续观察与安装推进（2026-10-25）

新具体确认到达后，先观察UI，发现已显示NVMe下唯一80GB空白目标盘；没有重试被拒的接受动作，没有通过其他路径绕过，也不推断中间操作者。再次只读核对配置hash和无网络/共享，选中原盘并在家庭版确认页启动正常安装。安装进度仅记录观察，不代替OOBE、桌面或版本验收；新证据保存在`analysis/vm-install-v3/`。此前v2的拒绝记录不删除，最新结果由新增观察补充。


v3最终观察：自动从系统盘启动到OOBE；地区/键盘正常设置后必须联网，未扩大网络/账号权限。Shift+F10只打开系统内命令窗口，banner为10.0.26300.9457；架构命令文本未可见生效，不能列为查询成功。输入捕获曾开启后释放；强制停止弹窗取消，改用UTM菜单“请求关闭电源”，最终确认停止。最终配置38/38复核通过。未修改产品代码、旧核验器或安全规则；过程、截图、当前阻碍及未运行项见`analysis/vm-install-v3/`和环境报告。


## v4网络准备与工具边界（2026-10-25）

用户具体授权临时NAT/必要官方ARM64驱动后，先复核原配置和磁盘，不沿用上轮关机结论。本轮初始VM又在OOBE，控制台窗口正常请求关机；设置新增类型入口被自动审查拒绝。重查实际截图/完整AX后同一动作重试一次仍被拒，停止并取消设置；没有用文件编辑、其他入口或脚本替代。精确状态见[动作记录](../analysis/vm-install-v4/ui-validation.json)。网络授权与控件目标审查是两回事，不把失败写成用户未授权NAT。

独立准备仅下载UTM当前官方链接的实际版本，静态检查NetKVM ARM64，记录hash/INF行号/PE机器及签名证书身份，制作并回读校验只含该驱动与原许可的本地ISO。OpenSSL通用CMS解析失败不推断签名有效或无效，Windows验签仍待运行。只读挂载已卸载，没有执行驱动或整包增强工具。其他VM仅查看UTM注册摘要及允许的文件元数据；Trash目录系统访问拒绝后不重试，不读盘内数据、不删除。

## v5具体重试与驱动验证（2026-10-25）

新的具体确认后，对已知未执行的菜单动作重试一次成功。通过正常UTM保存Shared/NAT并导入最小只读驱动盘，分别检查Network节和第三CD差异，原盘保持。UTM自动转换qcow2后用qemu-img验证逻辑内容，不要求容器hash相同，也不修改旧无网卡策略。

中途用户切换UTM到另一新建流程时暂停，不取消其表单；回到原VM且新确认继续后恢复。Windows实际目录选择器显示E: MOLI_NETKVM，正常安装后网络已连接并进入更新检查。未关闭保护、运行整套Guest Tools或提交凭据。此流程成功不等于完整签名链/设备健康或游戏兼容验收。证据保存在`analysis/vm-install-v5/`。

Win10CG移除快捷方式入口曾被审查拒绝且未执行，未换路或重试；用户随后撤销清理，终止所有清理及Trash读取。没有成功删除/取消注册/释放磁盘结论。只读ps被沙箱阻止，未重试。

v5最后观察为微软账号“使用密钥登录”页面；停止客户机UI，不继续抓取账号流程画面或读取认证信息。独立收尾仅核对本项目配置元数据和文档：仍为三盘/Shared NAT、主机共享关闭。记录为待用户身份验证、NAT恢复离线未完成，不把它混作自动审批拒绝。系统更新使用公开正常的“稍后更新”流程，完整更新单独保持未完成。

用户后续询问能否跳过登录，并明确倾向不绑定微软账号，已授权检查正常界面选项。重新观察账号引导页可见“登录”，未见跳过/本地选项，但页面覆盖不足；尝试滚到顶部时工具报告用户改变UTM，该动作未发送，随后截图超时并重置内核。恢复只读观察后已到邮件验证码步骤，没有发送验证码、填写账户或提交认证，亦未保存该账号页截图或标识。停止界面检查以免打断正在进行的操作。正常离线入口结论是“尚未核验”，不是“肯定没有”；未用脚本、注册表、断网故障或安全检查绕过强制推进。此处为界面协调/工具超时，不是新的自动审批拒绝。

## v6系统只读观察与认证交接

用户自行完成登录后重新观察桌面，使用无profile PowerShell，提示符先移到`C:\`，只选CIM Caption/Version/OSArchitecture和网卡InterfaceDescription/DriverVersion/Status字段。两条查询及去敏截图见[观察记录](../analysis/vm-install-v6/guest-observations.json)。键盘输入可能漏字，执行前按画面核对，先前错误输入取消而未执行。随后另一查询尚未提交时界面转到PIN页，立即停止输入；未保存该页、未收集或填写PIN，等待用户自行解锁。当时UBR、设备错误码、更新和安全状态尚未取得，不能用文件名/旧banner补填本轮结果。没有客户端执行、注入、内存读取或协议会话采集。

v6后续核验补充：用户解锁后，原未完成查询在PowerShell输入缓冲中可见，已取消；`cmd /c ver`独立确认更新前完整构建10.0.26300.9457。CIM设备问题与精确PCI ID、NetKVM签名字段分别读取；TPM查询未获得管理员权限，未返回数据。Windows Update正常重启后到PIN页，认证再次交给用户。PIN设置分支仅观察到原有屏幕/睡眠“从不”，助手无修改，用户已结束此分支。非启动最小RNG/DOD介质只读回读通过，未挂VM或安装；最终命令、流程和边界以[本轮观察](../analysis/vm-install-v6/guest-observations.json)及[环境记录](vm-environment.md)为准。

## v7更新后核验方法与界面恢复

复用实际Windows会话，用`cmd /c ver`独立取得9711构建，CIM仅筛选设备问题码和硬件标识。首个cmd输入漏字在Return前补正并核对，未执行错误文本。更新页含账号栏，未保存整页；意外打开Edge欢迎页未接受同步/认证。来宾普通快捷键无效后用UTM正常电源请求停止。移除NAT与导入第四只读光盘均经UI完成，保存后对比配置节；未改全局工具、保护、PIN或其他VM。

qemu-img只读比较最小ISO与新CD逻辑内容，并观察4盘backing-chain头部；无guest文件系统挂载。新增四盘核验器不放宽旧策略，新增冷副本脚本固定七文件且使用显式失败检查，普通/-O合成测试均通过。来源、命令和限制见[v7观察](../analysis/vm-install-v7/guest-observations.json)、[介质核验](../analysis/vm-install-v7/media-and-backing-check.json)。当前PIN认证交接，无待处理审批拒绝；新驱动安装和冷复制均未执行。

## v8输入、设备与冷副本证据方法

先观察本项目窗口并恢复捕获；用户在明确披露目的后批准的一次登录成功，凭据值不写入文件、命令行、剪贴板、报告或截图，授权不复用。Guest命令经CUA逐键输入、执行前核对，只查询选定系统字段；管理员UAC发布者为Microsoft Windows。E:卷标确认后，仅安装已核验两项INF，保存PnP成功/签名/设备状态证据。Get-Tpm内部错误如实保留，SecureBoot=True单独记录，未改变安全设置。

源VM正常关机后，固定四盘策略22项通过，头部确认无backing，固定7文件脚本实际复制与双端hash通过。根任务复跑19项复制测试和12项策略测试；普通/-O复制测试均通过。预案、合成测试、真实复制与恢复启动四者分开记账。文档/元数据交付不包含官方驱动文件、ISO、客户机磁盘或身份状态。[v8观察](../analysis/vm-install-v8/guest-observations.json)、[冷副本回执](../analysis/vm-install-v8/windows-cold-baseline.json)。

旧INF搜索曾把LNRO0005漏写O，本轮回看原图和官方源纠正转述并限缩旧负证据，未改写旧证据文件。公开源码中的可能性不自动等同本机后端事实。[核查与读取限制](../analysis/vm-install-v8/remaining-device-research.md)。

## v9调查与独立恢复方法

核对微软错误码和固定UTM/QEMU源码，分离事实、PPI假设和本机未知；本机framework只读版本字符串/hash，不读取完整调试日志、TPM状态语义或账号秘密。5枚游戏候选只重新hash。克隆源是未运行v8冷副本，全部源/复制hash和磁盘依赖核查通过，UI只操作新克隆；到Windows锁屏停止，不复用凭据。原VM后来已运行，正常磁盘状态变化与助手修改分开记录。25项克隆测试普通/-O和根任务复跑通过，产品代码未改。[研究元数据](../analysis/vm-install-v9/tpm-research-evidence.json)、[复制](../analysis/vm-install-v9/restore-clone.json)、[引导](../analysis/vm-install-v9/restore-boot-observations.json)。

## v10 操作观察与项目知识沉淀

仅操作准确恢复测试克隆，单次已批准登录成功后不复用授权。英文只读命令先取消错误IME组合、核对可见英文状态和完整文本，再提交；工具API不支持单独Shift与窗口坐标错误分开记录，不当作用户拒绝或Windows损坏。[输入证据](../analysis/vm-install-v10/input-observations.json)。工具键盘成功未解决用户实体键盘的未决问题。

管理员UAC点击被自动审批拒绝、未执行并取消；没有重试/旁路提权。普通非提升命令范围仅Get-Service、Get-PnpDevice、CIM OS/设备/签名字段与tpmtool基础信息。没有收集账号、凭据、TPM密钥或全量系统日志。设置页的账号标识不写入证据或截图文件，只人工记录相关非敏感选项。[具体拒绝](../analysis/vm-install-v10/elevation-blocker.json)、[查询](../analysis/vm-install-v10/guest-observations.json)。

[唯一排障知识库](known-issues.md#vm-troubleshooting)接入AGENTS及README；每条区分已验证影响条件、假设根因、最小检查、禁忌和未决。connected/attached/authorized、工具locked、实际可控分别记录；恢复锁屏、桌面、设备健康、游戏兼容分别验收。旧阶段文件保持原样，用最新阶段链接更正当前状态，不覆盖历史失败证据。

## v11 官方工具准备方法与范围

下载只用微软公开HTTPS，保存响应地址、长度、Last-Modified/ETag、SHA256及PE machine；不执行程序。第一次普通沙箱DNS失败后使用正常执行器授权流程下载，未关闭TLS或绕过拒绝。现有OpenSSL展示的证书属于元数据；没有完整Authenticode验证器时不以“Microsoft”字样当有效签名。Windows只读信任核验留到介质可安全使用时，不以安装新全局工具或丢失已登录会话扩展本次准备。

只读ISO用hdiutil生成，bsdtar列举与逐成员回读；不挂载宿主/客户机、不加入autorun。官方EXE与完整随附EULA仅存临时/build，源码交付仅含原创观察、哈希与步骤。批准、实际执行、尚缺用户本人输入及不同条款分别记录。[动作边界](../analysis/vm-install-v11/authorization-and-actions.json)、[介质核验](../analysis/vm-install-v11/media-validation.json)。知识沉淀继续进入[同一排障节](known-issues.md#vm-troubleshooting)。

## v13 只读环境方向切换

用户提供已有Windows11+Parallels体验后，先在安全边界冻结UTM分支，记录新登录确认未使用和没有电源/配置动作。调查只读应用Info.plist的身份/版本字段、已知目录/登记文件是否存在及公开官方资料；没有扫无关私人目录、启动未知VM或读许可证/钥匙串秘密。盘点未发现要限定检查范围，不能推成不存在或无许可。任务目标仍为证据驱动的跨平台实现，环境选择不构成游戏/协议兼容结论。见[盘点证据](../analysis/vm-install-v13/parallels-inventory.json)。

## v14 移除前只读依赖检查

在最新用户移除意图下，仅统计准确应用/项目build/已有回执明确临时路径的lstat大小；读取QCOW2头和配置路径以区分backing/外部盘/符号及硬链接，避免打开客户机文件系统。UI与精确文件句柄共同核实运行态；不把文件大小、没有backing或锁屏误作可立即删除。正常关机/移动/放回另验收。全局容器和其他VM反向引用未扫描，范围限制随证据保存；不为盘点绕过ps权限拒绝。[清单](../analysis/vm-install-v14/removal-inventory.json)。

## v15 时点与移除证据

清理只用Finder正常Move to Trash，前后准确路径状态、文件哈希与产品保留核验并行记载，不读取旧Trash、不用删除命令替代。只读QCOW/配置证据保留为历史，路径移动后运行说明同步失效。Parallels签名检查、应用运行清单、Windows启动画面及PVM配置标志分别是不同证据层；不从OS枚举代码/主机arm64直接推定来宾架构，不把主机共享主开关0当所有剪贴板/反向共享都关闭。[阶段证据](../analysis/vm-install-v15/final-removal-verification.json)。
