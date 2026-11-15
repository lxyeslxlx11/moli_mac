## 固定 Item 的窗口表与局部控件记录

第二套表 `5F1F58` 有 99 行，每行 20 字节，`+0` 为窗口 ID、`+4` 登记回调。经典窗 64 的控件原记录为 32 字节，构造准备 36 字节运行记录。`5F1F44` 存经典窗控件文本，指针位于该控件的八字节明细条目。第二套窗 5 的本地控件记录每条 40 字节，命中回调在 `+0x1C`。 [字节范围与各表所有者](game-static.md#item-alternate-dispatch-candidates)

固定 SE 窗 53 的五个报价行使用 32 字节文件记录，`+0x1C` 保存登记回调。对应 36 字节运行记录的 `+0x18` 是参与字段，`+0x20` 由创建分支写实际回调。显示位置沿有符号字节映射查原报价记录，确认沿原记录顺序。 [表项与写入指令](game-static.md#fixed-se-shop-entry-admission)

<a id="wechat-publication-history-format"></a>

## 微信发布记录的身份与历史

**事实**。现有资源槽的修订和内容字节可在重建后完全重用。小型原创提交夹具的修订 1 历史文件只有 40 字节时校验失败，完整 267 字节的历史读回与原槽匹配。原槽随后已被修订 3 复用。 [槽与历史原始文件](../build/analysis/wechat-publication-history-v1/runtime.json)

**事实**。跨工具进程对照复用现有资源槽格式与 ZIP 解析器。两份缓存槽均可重新解码。另用原创短记录保存发布代际、父提交、素材、启动意图和构建的夹具标识，支持比对活动及历史回执。正式发布记录仍按下述设计。 [范围读及槽版本](validation.md#wechat-devtools-process-reopen-validation)

**推测**。通用 CommitCapsule 在已验证的本地存储代际内区分父提交、修订、更新操作、完整素材清单及重启意图。不可变历史按代际和更新编号归属，保留原提交完整性证据。历史证明、原素材和活动启动回执可分别查询，历史保存失败继续保留原槽。该元数据沿 UC-P08/UC-P10 进入自有格式。 [设计与用例](../analysis/capability-first-v1/shared-update-host-design.json#/wechat_publication_history)

**设计**。临时分段重开清单沿现有约定保留各段次序、偏移、长度和摘要。路径用于查找可读来源。补选保留内容匹配的各段，重新取得并核验失效段。持久发布的完整清单还绑定实际持久块及权威读回结果。 [重开和发布规格](../analysis/capability-first-v1/shared-update-host-design.json#/game_resource_reopen/reader_identity_and_publication)

<a id="fixed-se-player-category-format"></a>

## 固定 SE 公共目录文件

**事实**。固定 SE 的 `bin/category.dat` 是 81,620 字节的小端文件。前 20 字节依次是两个版本值、两组行数和迷你邮件邮费提示值。然后是从 `0x14`、`0x6A54`、`0xD494` 起的三张表，各有 100 个 `0x110` 字节槽。每槽活动字在 +0，两个整型在 +4、+8，名称从 +12 起占 256 字节。留存材料三表的活动行数为 29、29、11。摘要及与同包可执行文件的对应关系记录在本机回执中。 [格式、来源与读写](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire/directory_publication/local_material)

**待验证**。原客户端按一个完整块请求读写。短读可能只覆盖前缀，打开成功返回不证明已完成传输。三端将沿已有资源读和本地保存接口核完整长度、失效及读回。 [当前本机结果](validation.md#fixed-se-player-directory-validation)

## 11 月版启动确认声明

F5A 的 PE 类型 10、名称 `POLCN_LAUNCHER_ACK_PROTOCOL`、语言 2052 在分析映像偏移 4,008,688 保存 21 字节 `POLCN_LAUNCHER_ACK_V1`。内嵌更新器也接受尾随单个 NUL 的 22 字节形式。原更新 ZIP 由既有共享解析器读回一个确认声明，实际事件结果仍待验。 [资源偏移与更新器读法](../build/analysis/launcher-f5a-update-handoff-v1/source-review.json) · [本机 ZIP 回执](../build/analysis/launcher-f5a-update-handoff-v1/local-package-probe.json)

F5A 的资源类型 `BIN_DATA`、编号 143、语言 2052 在文件偏移 3,099,256 保存 809,984 字节的内嵌更新器。本次逐字节核对留存成员，SHA-256 为 `c1b2c8b7870275a2268364bfb1e8a8a7a09444174f8be4e9274ed74d6dae4b5b`。原字节经 `0x80C9` 的所选分支交接，新候选启动仍沿上述确认资源。 [资源和入口](launcher-static.md#fixed-f5a-entry-business-admission)

<a id="f5a-catalog-path-roles"></a>

## 11 月版 GameList.xml 的文件角色

固定 4,377 字节的目录 SHA-256 为 `be8f1213d77bd294fbb79b2fb51a5e7fecdc9aa3c0854db7a6d821fad20ef85a`。现有 GBK 解码与目录解析读出五条记录。四条魔力记录均为 `PatchEXE=Patcher_PUK3.exe` 和 `ConfigEXE=Config.exe`。原序号 1、2 的 `SpeFile` 为 `Patcher_PUK3.exe`，原序号 3、4 的 `SpeFile` 为 `CG5Reg.exe`。两条 Code 11 的序号各自保留。 [原字节与解析回执](../build/analysis/launcher-f5a-path-preflight-v1/local-plan-comparison.json) · [角色使用位置](launcher-static.md#f5a-path-preflight)

<a id="first-config-file-effects"></a>

## 首次配置器的 `Config.dat`

固定配置器使用相对工作目录的 `Config.dat`。默认写入 12 字节 ` 3Ddevice:1 `。确认按档位和四个开关编码，保留首尾空格，省略结尾 NUL 与换行。确认分支请求删除旧文件，随后打开或创建并从开头写入。若旧文件未删而写入成功，较短写入可能留下旧尾部。读取仍沿原前 256 字节规格。 [原配置格式](game-static.md#stage149) · [文件调用和原版条件](launcher-static.md#first-config-dialog-outcomes)

固定 SE 与 Item 的游戏进程把最多 255 个可读文本字节的 `Config.dat` 首行与命令尾直接相接。行尾换行可保留，第一个 NUL 是接续位置。游戏只尝试第一个大小写敏感的 `3Ddevice:`，读取十进制前缀后使用有符号低字节。默认档位为 1。历史安装脚本的 `Config.dat` 长度 12、CRC32 `7A5F1F34` 与缺文件默认字节 ` 3Ddevice:1 ` 一致。留存发行文件的 23 字节为 ` 3Ddevice:4 windowmode `。降档路径对 `data\update.dat` 写十进制档位或单字节 `1`，长度由实际文本决定，潜在读回继续取证。 [样本与读取边界](game-static.md#legacy-render-startup-tier-input) · [写入字节](game-static.md#legacy-render-device-preparation)

<a id="legacy-item-resource-path-tables"></a>

## 历史 Item 的资源文件名表

图形、图形索引、动画、动画索引、坐标和坐标索引各有七个 128 字节默认名槽。前四类各有七个普通前缀，后两类各有六个。默认 `Bin` 可由 `binfolder:` 覆盖。坐标和坐标索引的实路径位于组索引 3，初始为 `Crd.bin`、`CrdInfo.bin`。该索引的有效参数先替换实路径，其余 `*3` 槽随后取它的结果。六类路径经 `%s\%s` 拼接。 [表地址、模板和字节核对](../build/analysis/legacy-item-resource-handoff-v1/source-review.json)

同一固定 Item 的交接映射由正常路径读到 NUL，随后清前 256 字节。两段文本各按 `gid:`、`glt:` 定位并以 `%s` 读取。选服再将每项最多 51 字节复制到工作字段，遇 NUL 停止。 [映射、字段及长度范围](game-static.md#legacy-item-startup-handoff)

F5A 生产端的映射视图为 256 字节。一次发布复制 NUL 前的字节及一个 NUL，最多 256 字节，同名短写保留旧视图的剩余字节。32 字节记录保存名称、句柄和视图引用。 [生产与登记布局](launcher-static.md#f5a-mapping-lifecycle)

<a id="legacy-minimap-auto-dat"></a>

## 小地图颜色缓存 `data\auto.dat`

固定 SE 的 `452BC0` 和 `452A50` 分五次读写下列数据。所有多字节整数为小端，完整写入的布局共 65,550 字节。 [原文件字节与调用](../build/analysis/legacy-graphics-scratch-provenance-v1/source-review.json)

| 偏移 | 字节数 | 内容 |
| --- | ---: | --- |
| `0` | 2 | 版本 `2` |
| `2` | 12 | 路径数组前三项各一个 32 位时间值 |
| `14` | 65,536 | 每个图块 ID 一个代表色索引 |

第一项必须打开并成功取得文件状态。后两项打开或取状态失败时对应值为零。磁盘文件的状态字段 `+0x20` 取本地时间转换后的创建时间，创建字段的两个字均为零时回退到转换后的最后写入时间。读取逐项核对版本、时间值和读取数量。所核安装清单的 2,367 个 `app` 文件中该路径命中数为零，实际运行时文件待查。 [状态字段与导入表](../build/analysis/legacy-graphics-scratch-provenance-v1/source-review.json) · [微软文件信息结构](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/ns-fileapi-by_handle_file_information)

## 桌面网页双版本的载荷与文件占用

已测 `bin` 与 `map` 的原始载荷共 2,613,885,785 字节。按该尺寸构造的两份原创分块载荷均已写入并完整读回。两版准备完毕时，IndexedDB 文件实占约 5.23 GB，含本次元数据和文件分配开销。旧根逻辑删除之后的文件释放按宿主实际用量计入预算。 [测量与适用范围](architecture-and-milestones.md#browser-full-resource-budget)

## 图形目录索引与角色内容代

历史 Item 的 `48AB28` 从 40 字节目录记录建立资源 ID 到记录索引的反向表。`48D7BB` 读取与固定 SE 相同的五个探测 ID，以非零索引命中判定内容代。角色升级准入引用已加载目录的这一结果。 [角色操作来源](game-static.md#legacy-item-character-operations)

## 安装包资源实测与负高度 RD 记录

安装器列出 2,368 项。保留的 2,367 个 `app` 文件逐一匹配长度和 SHA-1，原 27 份已选素材的 SHA-256 相符。`bin` 和 `map` 含 2,355 个文件，共 2,613,885,785 字节。最大图形档为 `GraphicEx_4.bin` 的 943,552,437 字节，六个已选档最大图形记录为 456,644 字节。（事实）

C82 的七组参数按 `Bin`、`Bin/Puk2` 和 `Bin/Puk3` 的直接子项筛选。随包匹配 28 个长名候选，`Bin/sec` 的文件不进入这七组。候选字节复核合计 2,073,632,867 字节。 [文件与标题核验](../build/analysis/launcher-resource-arguments-v1/source-review.json)

历史解析选出的路径由既有 1,072 项资源 ZIP 提供。每次目录初始化在资源库层实读 74,804,745 字节，在 ZIP 层读取 74,949,739 字节，后者计入目录和成员头等范围。固定 V2 可选组沿既有缺档条件处理。 [读取回执](../build/analysis/legacy-resource-handoff-v1/runtime.json)

同一留存 ZIP 中的图块范围为 1,660 字节，所测 8 位双声道 WAV 成员为 4,311,856 字节，按 2,155,830 帧逐声道转换。浏览器音频缓冲的逻辑样本量为 17,246,640 字节，另有转换暂存。预算将归档范围和准备后的实际缓冲按各自分配及持有时间计入。 [读取及音频回执](validation.md#resource-budget-retirement-validation)

所选七组使用 `Bin/coordinateinfov3_2.bin` 与 `Bin/coordinatev3_2.bin`。前者为 22,351 字节，由标记 1 和 2,235 条 10 字节行组成，每行依次为 32 位动画 ID、32 位数据偏移和 16 位数量。后者为 7,991,056 字节，偏移定位的每条坐标行 8 字节，由 32 位图形号和两个有符号 16 位坐标组成，图形号加动画所属组的基址。固定 SE 按坐标数据文件名决定是否复用句柄并跳过后续索引。 [原始成员与读取回执](../build/analysis/animation-coordinate-sharing-v1/runtime.json) · [原版消费](game-static.md#animation-coordinate-alias)

真实 ZIP 的可选 V2 缺 `Bin/AnimeInfoV2.bin` 和 `Bin/AnimeV2.bin`。固定 SE 在写入当前 12 字节动画索引行前查 EOF。正常到达文件末尾时保留先前登记的完整行。坐标行的 EOF 检查位于可能的写入后，带标记 1 的残行继续按跨端范围错误处理。 [成员实测和源顺序](validation.md#animation-load-failure-validation)

实际音效 280 的 WAV 成员为 95,602 字节，含 47,745 帧、22,050 Hz、16 位单声道 PCM。居中输出使用一声道 Float32 缓冲，偏声像用独立双声道缓冲。0、13 号调色表各从 708 字节成员读取前 672 字节，图块缓存沿调色投影重新准备像素。 [联合场景核验](validation.md#real-map-mixed-resource-budget-validation)

六档共 641,666 条物理记录，其中 641,664 条正尺寸记录的宽度均为四字节对齐。三个额外 SEC 档的 22,498 条记录也对齐。剩余两条实际记录宽 4、高 −15 和 −26，长度和 RLE 结束位置均为 16，只有头部。动画 110004 的方向 0、动作 0 首帧引用槽 16681。（事实）

固定 37c4 的 `511470` 在压缩起点等于结束处返回缓冲地址、发布原尺寸，像素命令写入 0 字节。`507230` 对这两种高度各算出一块的冷缓存请求，分配仍取决于可用槽。普通 `506030` 的 type 0 在缓存准备后按有符号底边退出，type 1 在源矩形边界或非正高度检查处退出。这两条路径均在调用 `505D70` 之前结束。既有逐行循环规则适用于实际进入 `505D70` 的调用。实际画面待在对应宿主验收。 [绘制入口核验](../build/analysis/smoke-animation-clip-v1/source-review.json)

正尺寸 RD 解码所得的原尺寸在缓存分配前发布。逻辑 64×48 用于图形缓存中的块坐标，-2 的盖章阈值约束槽回收。块的实际可用范围由链和上传结果决定。读取与解码仍沿原 RD 文件字段和范围。 [块布局及使用条件](game-static.md#legacy-graphics-partial-cache)

[资源测量与源规则](../analysis/capability-first-v1/resource-corpus-budget.json)

<a id="launcher-startup-functional-specification"></a>

## 当前登录器补证：嵌套退出hook的安装与所选分支已成规（2026-11-11）

QH沿固定C82 App Init的正向OLE初始化调用补齐EA-F13：45C46F在所证mode/HRESULT条件下把45C570写入44FD1F所得对象+3c；alternate mode可返回1而不走本体setter。45A8A6实际以(1,1)调用，再在正常返回后投递退出消息，不能把所有nonzero初始化结果或quit请求当作资源/登录通道已退役。

所选45C502(1)先执行条件OleFlushClipboard、factory链遍历和先移除再虚槽0调用，然后跳过本地零参filter删除/COM-uninitialize分支。实际module flag、资源成员/间接效果保来源条件；不据所选代码报告必现重绑/死锁或完整Windows关闭接受。普通modal期间形成替换binding的合法producer/投递准入、LS-U3实际消息/销毁和Host drain仍待。

新增7必要完整native/477B，复用App Init与quit两完整体；9窗1679B/531指令核原PE，REA已导出关闭。形成9事实、2推导、5操作、3组开发差异和8项未执行接受案例。停止已答OLE/MFC库存扩张，仅沿原必要正向对象/producer或Host证据继续。

原40/81/37/10/6、owner/依赖/批次/profile及14端口62方法保持；19项固定来源本域规格就绪不变，L03/L06/L08及统一A1..A4不提升。产品仍stage306，本轮无产品修改、目标测试/构建、VM/SDK/网络/账号操作。原GP补丁五组与UH三端发布/恢复方案直接复用，先全部能力成规再按D0–D6开发。

没有新增游戏/补丁文件格式或协议字段。QH描述原module+24工厂链、+40清理链与相关hook对象布局；这些不是跨平台持久化格式，UH六格式和原14/62合同保持。

[quit hook合同](../analysis/capability-first-v1/launcher-quit-hook-contract.json) · [源核验](../build/analysis/launcher-quit-hook-v1/source-review.json) · [本轮核验](../build/analysis/launcher-quit-hook-v1/validation.json) · [原补丁规格](../analysis/capability-first-v1/launcher-game-patch-functional-specification.json)

<a id="launcher-exit-admission"></a>

## 退出消息与虚表字段仍是本地宿主元数据（2026-11-10）

E140/E141、WM_CLOSE、模板100、App+20/+d8、Frame/AAChannel虚槽以及quit对象+3c都是固定PE本地控制/所有权元数据，不是新认证状态、服务器字段或请求代次。Frame close许可、App退出和通道删除不能靠字段同名互相替代。

原两版handshake/record、type10/type11、DM方向材料与LE失败规则保持。12个指针和33个代码窗口只发布地址/长度/哈希入口，无原二进制字节、资源或反编译源码。

[退出准入合同](../analysis/capability-first-v1/launcher-exit-admission-contract.json) · [源核验](../build/analysis/launcher-exit-admission-v1/source-review.json) · [既有端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-exit-admission-v1/validation.json)

<a id="launcher-callback-reentry"></a>

## 8241上下文与连接句柄不是新增线上字段（2026-11-10）

本轮game/step与8241属于Windows本地队列上下文；E140/E141是实际托盘菜单命令，+10f2是业务modal标志，pointer/serial与borrow是本地生命周期。它们不是认证状态、服务器请求代次或新线上协议字段。

原type10/type11、两版handshake/record、DM方向key材料及LE失败分类保持；不增加伪认证/未证字段。发布仅规则和哈希/偏移入口，无原二进制字节、资源或反编译源码。

[回调入口合同](../analysis/capability-first-v1/launcher-callback-reentry-contract.json) · [源核验](../build/analysis/launcher-callback-reentry-v1/source-review.json) · [端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-callback-reentry-v1/validation.json)

<a id="launcher-legacy-failure"></a>

## EH元数据辅助还原，不增加线上格式（2026-11-10）

本批读取的是固定PE的FuncInfo/try/handler和ThrowInfo/catchable/type descriptor，以及原父frame槽与69B共享代码尾。它们不是新协议字段、认证状态或游戏资源格式；class身份匹配与state11保护区只限定原编译异常frame。

原type10/type11、两版handshake/record及DM方向key材料规则保持不变。原random除数32767.0与数学端点单列，目标有效ordinal检查不伪装成原随机保证；未执行native数组越界、异常runtime或真实网络。

[旧版失败合同](../analysis/capability-first-v1/launcher-legacy-failure-contract.json) · [源核验](../build/analysis/launcher-legacy-failure-v1/source-review.json) · [纯目标对照](../build/analysis/launcher-legacy-failure-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-legacy-failure-v1/validation.json)

<a id="launcher-derived-material"></a>

## 短派生材料不新增线上字段（2026-11-10）

原hello/challenge/public/type10/type11/record格式不变。本批只核内部key初态与转换：旧版8字节零初态buffer按canonical hex前部字节对覆盖，短材料不写满处仍为零；单字符0不写。该结果依赖已证新建或完成清理状态，不能直接推广为任意输入填充规则。

当前要求sharedHex至少16字符，才拷前8字节到handshake key并state2/getter发布；不足-5，无partial key发布。材料够长时两版前8字节核心复用。27原创数学/目标例不构成原程序加密网络兼容。

[材料合同](../analysis/capability-first-v1/launcher-derived-material-contract.json) · [来源核验](../build/analysis/launcher-derived-material-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-derived-material-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-derived-material-v1/validation.json)

<a id="launcher-session-functional-specification"></a>

## 登录交换记录与消息格式的两版差异（2026-11-10）

非压缩外记录均为BE32(cipherLength)+BE32(plainLength)+按LE32字操作的8字节块；旧padding=floor(n/8)*8+8，当前=ceil(n/8)*8+8。n=1时密文分别8/16字节；n=8时均16。当前0/0头可消费并产生空正文，旧目标明确拒绝。外记录与内BE16 frame及网络chunk边界互不等同。

type10正文45预算、两个<=18字段和UI各16分开；type11仍含五个word数组和两个尾word，adapter丢W0不改变线上格式。882原创检查覆盖所列padding/分片/边界，未证明压缩/其他模式或真实加密网络兼容。短材料填充仍LS-U2，不新增规则。

[双来源操作规格](../analysis/capability-first-v1/launcher-session-functional-specification.json) · [来源核验](../build/analysis/launcher-session-functional-specification-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-session-functional-specification-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-session-functional-specification-v1/validation.json)

<a id="wechat-sdk-host-probe-preparation"></a>

## WH合成试件与真实大文件能力区分（2026-11-10）

[WH档案](../analysis/capability-first-v1/wechat-host-profile.json)记录工具就绪、原创探针与当前门槛，SDK实际运行0；准备检查不能当微信平台接受。

试件为原创1,048,576B pattern，计划8个position/length/buffer offset组合，含短读/EOF及2^31、2^32以上数值参数。对小文件读高position只观察参数/EOF语义，不证明相应大小的背文件或ZIP64全资源支持。

另有32字节fd重命名后读取、8×4 opaque RGBA和257B本机TCP模式；全部尚未SDK运行。完整原资源manifest、decoded/pinned/concurrent峰值、quota/存储恢复及真实设备offset域继续未测；无厂商素材或原程序加入成果。

<a id="game-battle-functional-specification"></a>

## BF线路、槽、控制表与源读序（2026-11-10）

[BF格式/变体表](../analysis/capability-first-v1/game-battle-functional-specification.json)完整保24token、110显式class、14个SKL组和10消费者。C/M各4槽、原4096B存储与独立4095B上限分开，C22记录/20普通body、28字节名称及原hex scanner；P六%X、A两%X成功部分保尾，不能与C parser混用。

主菜单14×32B定义含10按钮实例、8主行动与9选择flag；29/32各48B描述符及四控件、6B/3B返回leaf分别核原PE。435000旧28B原生范围与完整461B CFG/138指令分列。C5EC18、9250C8、F5F18C为数据上下文，不当缺失procedure。

72/113嵌套与260 chain在准备/运行中保各自字段顺序；self266 variant2末RID word来自此前foreign，不能填本self丢弃值。ITM default推进raw cursor但不造队列，107原wrapper word不换max值。fades12/14、ordinary13和scene15以及counter30分别保源单位；本轮未改解析器或保存厂商资源。

<a id="game-work-functional-specification"></a>

## WK技能、配方、目标与计数布局（2026-11-10）

[WK格式规则](../analysis/capability-first-v1/game-work-functional-specification.json)保留15主技能、步长0x49FC，11×0x94等级；配方+0x698、56×0x134，每行22字段、五材料+0x6C/步长0x28，上下文+0x49F8。接收时stamp当前ctx，reset只将ctx置0及配方/材料ID置-1，非ID数字和文本保持。

固定 SE 的经典描述符每条 48 字节。登记位置 +36 在构造与控件前更新使用，+40 用于控件后绘制，+44 用于实际析构。窗 11 的三个登记为 `476170`、`4767E0`、`4760F0`。另一套所核 16 行每行 20 字节，回调在 +4。计数 C5E944 为四字节，C5E948、C5E949、C5E94A 分别为一字节。有符号等级字节为 C5BD1B，旧三槽只占 C5BD18 至 C5BD1A。因子表 55B024 的七字节对应档位 0 至 6。 [登记与调用顺序](game-static.md#fixed-se-entry-business-admission)

固定 SE 经典窗 10 有 30 个源控件。普通技能十行位于 17–26，运行控件回调从 `472610` 切换至 `472A10`。有效项计数与实际技能槽来自 `EF3568` 的 15 项八字节排序表，记录头两字依次为存在标记和实际槽。 [描述符和选行来源](game-static.md#legacy-se-classic-work-entry)

刻印16字节原文本与空白/DBCS检测分开，配方名称28/描述56/材料名28字节，采集物名28字节。经典绝对bag、另一套relative bag+8及两级目标wire ordinal不混用；本轮未修改解析器或保存厂商素材。

<a id="game-social-family-album-functional-specification"></a>

## SF名单、称号、图鉴与历史布局（2026-11-10）

[SF格式/操作](../analysis/capability-first-v1/game-social-family-album-functional-specification.json)区分队伍5×0x30、名片60×0x74、家族称号32×0x30、成员200×0x7C及图鉴两bank各320×0x80。家族12mask增量顺序、16B称号编辑/24B家族会馆编辑/40B接收边界分别保留；可见行、真实行、成员ID与称号槽不互换。

图鉴解码态总81932B，已包含两bank；CCA头4B、revision8B和81920B记录分开。摘要十mask、详情15int32+2bytes及+0x7F发现byte保留；经典10行夹紧与另一套15行/21页环绕不同。data\album.dat转换仍opaque，未声称原文件互操作。

固定 SE 经典列表按当时角色槽寻址，每槽 320 个 `0x80` 字节记录。记录 `+0` 为有效字节，`+0x34` 为名称，`+0x7F` 为发现标记。列表用后者显示标记，详情刷新有效记录时将该字节清零。 [所选读取和写入](game-static.md#legacy-classic-album-entry-admission)

个人384000B/家族1283200B均是两bank整份缓存。迷你20联系人、每联系人0xC80/十条历史的插入布局，与518280实际20次0x140字段清理分列；后者不是整块memset，当前默认字串值不从虚拟零猜测。mode0x20家族兽与mode0x22饲料箱的C关闭语义不同。本轮未改解析器、读真实缓存或保存厂商素材。

<a id="game-ordinary-services-functional-specification"></a>

## OS物品、服务、交易与仓储的格式范围（2026-11-10）

[OS格式/操作表](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json)区分活体物品65C、商店658、交易64C和仓储644字节stride。28槽中装备0..7、背包8..27；物品14字段的5为code、12为category、13为quantity。目标67C9比较code，不把它改为category字段。signed8选择表保留20物品/5宠物位置与空洞，字节占用不等于revision。

普通用物一级表为 10 条 `0x14` 字节记录，`+0x00` 是 16 位类别，`+0x02` 起为名称。二级资料为最多六条 `0x34` 字节记录，六整数在 `+0x14..+0x28`，类别在 `+0x2C`，选择在 `+0x30`。展示摘要步长 `0x1C`，第二个整型只读低字节。名称正文选取预算为 255 和 127 字节，名称需在相应预算内遇到有效分隔符。格式器的选取预算与记录名存储长度分别验证。 [正文槽位与选取边界](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_item_target_menus)

经典目录继续使用三张 `0x110` 字节行表，`+0x10C` 是所查选择标志。检索名单为至多 20 条 `0x20C` 记录，首字是活动状态，名称、两整数及说明依次位于 `+4`、`+0x104/+0x108` 和 `+0x10C`。迷你历史使用同一已证的十条 `0x140` 字节记录，提交时按原字节添加最新一行。送出的请求内层按字段预转义后再次转义，含终止的预算分别为 256、1024 及 1023 字节。 [原字段和分层数据](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_classic_directory_mini_mail)

Q?m模式/掩码/对话/角色/正文与/1I的逻辑坐标/上下文/按钮/字节正文各沿已有格式；双字段每项46编码字节，图文按钮发送所存图形ID。商店六报价家族和经典训练十mode分别映射，人物学习与宠物资格不能通用化。

交易发布保留稀疏位置、双方阶段与关闭抑制；仓储A/I/P/G先解析缓存再决定窗口，A的20×6物品、5×33宠物和field287余额、I步7/P步34保持。槽100..119与100..104是各自物品/宠物范围；不新增requestID、银行认证或未经证明的线协议字段。本轮只核规格，未改解析器或保存厂商素材。

经典交易的五条宠物活体各为 `0x6D8` 字节，普通行映射为五条八字节记录，开窗缓存步长为 `0x5FC`。五个报价位置按有符号单字节读源槽。`+oj` 的第二段仍按 `源槽|报价位置` 发送，金额取独立的已存整数。 [原件布局及发送字段](game-static.md#legacy-se-trade-pet-gold)

固定 SE 第二套回调扫描 `0x64C` 步长的 20 条物品和 `0x5FC` 步长的五条宠物缓存。每条开头的存在字非零且 `+2` 有符号选择字为正时参加。序列化的物品槽为缓存索引加 8，宠物槽为缓存索引，分别按十进制拼成 `+oj` 的两个字节字段。 [原件布局及发送字段](game-static.md#legacy-se-alternate-trade-gold)

本方物品从 `C53DC8` 起，宠物从 `C135F4` 起，分别紧跟相同步长的 20 个、五个对方缓存。物品缓存 `+4` 提供选起图形，`+8` 提供进入数量框的检查值。双击只在 `+2` 非负时翻转最低位。整条换位包括这一字。 [缓存布局及使用](game-static.md#legacy-se-alternate-trade-selection)

<a id="fixed-se-stack-quantity-preference-byte"></a>

### 固定 SE 的堆叠偏好字节

**事实**。`save.dat` 对应的 1024 字节解码配置记录中，偏好位于 `+0x312`，长一字节。`505862` 读取原值并零扩展，`505817` 把活动偏好低字节写入 `F63062`。字段的原始文件位置取决于既有转换。`+0x313` 的排序快照维持自己的读写来源。**待验证**。异常配置值的界面结果和首启默认值。 [配置结构](../analysis/capability-first-v1/game-mail-data-contract.json#/profile_configuration_subset) · [写入、退役和读取](game-static.md#fixed-se-stack-quantity-input-preference)

<a id="game-presentation-functional-specification"></a>

## 图形/文字格式覆盖与非对齐行边界（2026-11-10）

[PR格式操作](../analysis/capability-first-v1/game-presentation-functional-specification.json)复用RD raw/RLE/16或20B头/调色附层、CUT18B物理到20B运行时、动画12/20B动作/10B帧/8B AP、AUT无头RGB，以及原七资源族/命名调色映射；8/16/24/32属于后续输出转换。资源ID、物理行、图形索引和动画帧仍分开。

固定 SE 的启动调色从 `534B18` 的 130 字节记录读取有符号版本门槛及以 NUL 结尾的文件名。原表 0、19、23 对应基础色、黑场和标识，门槛均为 0。已有 CGP 的 224 组 BGR 色段继续用于颜色解析。 [原表行与素材路径](game-static.md#fixed-se-startup-palette-publication)

固定 SE 的 16、24 位上传共用 RD 的单字节索引。默认 16 位表为 256 个 WORD，动态刷新中间 224 项及透明索引 0。默认 24 位表为 256 个 BGR 三字节，像素按三字节写到目标行。 [索引、掩码与输出布局](game-static.md#fixed-se-palette-output-depth)

固定 Item 的默认表沿相同字节布局。首次装载保留 CGP 原色，随后清现行索引 168，重建按所选位深重算颜色。32 位全黑保留零，并更新 16 位旁表。 [准备和上传范围](game-static.md#fixed-item-palette-output-depth)

命名色载体取 RD 的 BGR 色段，固定 Item 与 SE 使用同一份 1495 槽映射。现有解析按完整三元组和实际索引宽度核可读范围。运行时命名槽在 `+4`、`+0x404` 分别生成原色与通道变换表。内嵌显式色对象经 `+0x10` 取表。两条路径按已知输出位深和当次表面步幅消费，实际短色段尾部沿适用输入验证。 [SE 载体与输出](game-static.md#fixed-se-explicit-palette-upload) · [Item 载体与输出](game-static.md#fixed-item-explicit-palette-upload)

非4倍宽度是缓存/scratch上下文问题，RD本身仍可解码。原宽高低16位与解码stride、每块裁剪宽度和表面pitch不混用；冷/热行区间及已知像素/调色前缀见[scratch核对](../build/analysis/game-presentation-functional-specification-v1/scratch-review.json)。原字节编辑、14字体指标、字节对宽度、272B文字记录/4096容量、48标签和AUT477603B观察各保留其范围；DEFAULT_CHARSET不证明wire编码，字体掩码由明确宿主端口提供。

固定 SE 在当次输入法候选缓冲的 `+0x08`、`+0x0C`、`+0x10`、`+0x14` 读取四个 DWORD，分别为总数、绝对选择、页起点和页大小。`+0x18` 起的 DWORD 偏移相对缓冲起点，指向以 NUL 结束的字符串。组合与属性使用各自的 256 字节缓冲，按所选成功读取长度终止。 [布局、来源和实际读写](game-static.md#battle-266-ime-presentation)

<a id="game-actor-functional-specification"></a>

## C0可变尾部与协同几何表的来源格式（2026-11-10）

[GA来源格式](../analysis/capability-first-v1/game-actor-functional-specification.json)保留原TAB/2047B、inner base62与不同空整数策略。非空C0列17的归一化mask位1/2各消费一资源，位4消费资源、packed方向、两addressed值、inner label；mask7的下一索引25。空尾不等于mask0，不把影子标签255B选择前缀推成服务端长度上限。

协同81/82沿既有动作列6..12七整数，缺值用510E50的-1。52D548表为LE signed int32[3][5][8][2]共960B/120坐标对；bank资源范围和52D908..52D918四常量保留原字节及值。table有效slot0..4/facing0..7不推广到C0全部方向码。没有新增资源解析器或官方素材输出。

<a id="game-flow-functional-specification"></a>

## 主流程状态与资源上下文不是新资源格式（2026-11-10）

[GF来源](../analysis/capability-first-v1/game-flow-functional-specification.json)把F5F17C/F5F1A0/F5F1A8/F5F19C的main/sub/deferred/saved-sub分开；资源内容检测925084决定主1/主D分支。初始化主1来自45CFD0显式store，不以虚拟零解释。主9的22种case、city flag、922C4C等待与BFF328门是所选源内部上下文，没有增加网络字段、资源包格式或凭据材料。

模块摘要/首包沿G01，MAP/cache/局部对象沿G04/local-bootstrap，bank恢复沿AB/CT，截屏/fade/字体/音频沿各原能力。输入无来源的值不填0；20项完整接受条件仍未跑，无原样本/资源内容改写或导出图片声音。

<a id="game-communication-functional-specification"></a>

## G01线格式、可变标签和容量边界（2026-11-10）

[CF源格式](../analysis/capability-first-v1/game-communication-functional-specification.json)：AF EF/LE16/正文/EF AF，6B开销但候选至少8B才检查；112B初始化和64B材料、8B正文转换、binary前缀/段长、raw text/space/NUL与base62规则各自保留。104接收与66发送均有source绑定，标签是CString可变长，GC两字节；原tag_word_sha256核4个存储字节，不能据此固定tag为3B。

两队列各262144容量；append允许恰好上限，native consume拒绝>=上限，独立core边界不模拟负长/无效指针。版本流WinINet每次先保留2048再读，名义16384并不等于可完成16384正文；备用流16383加NUL，strncat内容长度和追踪字节数可不同。parser dynamic38*N+72=2490440B仅是N65536下申请量，非全资源/平台预算。没有新协议字段、真实会话材料或二进制加入成果。

固定 SE 的普通接收单次最多 262,143 字节。全局待消费区容量为 262,144，单条非负帧最多 32,767 字节正文加 6 字节封装。完整帧与余留可同批到达。正常消息解码的 32,768 字节输出区与本次原始读取相邻，余留前移只写全局区。 [缓冲区及余留规格](game-static.md#battle-266-long-receive)

<a id="launcher-config-path"></a>

## 路径字节长度及前缀格式补充（2026-11-10）

[LP证据](../analysis/capability-first-v1/launcher-config-path-contract.json)明确Left/Mid/Right按存储字节长度截取，MBCS比较/CharNext不替换为Unicode或NFC。最终句柄路径的32768字节缓冲与父函数260字节词法输入不同；API长度0或>=32768失败。源规范化先处理设备UNC/通用前缀，再在长度>=4时逐字节去尾反斜杠，最后返回已有drive/UNC根谓词。

缺API分支检查属性0x400，FFFFFFFF属性失败继续扫描；它不是文件存在证明。候选缺失后缀可拼回已有祖先的最终路径，父输出仍是词法候选。未新增资源/协议字段或真实文件样本；系统、locale和实际路径接受未实测。

<a id="launcher-functional-specification"></a>

## 当前首次Config的命名空间、原字节与状态边界（2026-11-10）

[LF规格/原PE核验](../analysis/capability-first-v1/launcher-functional-specification.json)绑定C82编译常量Game（VA5D0BA0，含NUL5B）及_Config（VA5D1994，含NUL8B）。game行基址controller+2BD8、strideA4、Code_attribute_raw偏移40，因此实际key取原Code文本，不能用行号或规范化数字替换。section为账号原字节MD5；这不是认证状态。profile默认整数1、写入0；捕获section/key与key-only已见列表各自保留。

Config使用0x232A/250ms与900000ms一次提醒；patch0x2329/1800000ms及601b无限wait属于不同策略。普通退出追加缓存早于profile写入，失败不撤回；三特殊DWORD退出不清标志。命令使用已解析路径的显式applicationName和435A10引用规则。4329B0长度界限245/260与API返回检查已绑定，两个具名子谓词内部及MBCS/OS实效没有猜测补全。未新增资源格式、协议字段、真实INI或会话样本。

<a id="map-functional-specification"></a>

## MAP01头字段位置修正，源码/目标严格性分栏（2026-11-10）

有效布局为signature0..3、非尺寸word4/8、width12、height16，之后三连续row-major LE16平面。旧game-legacy-world规格的opaque_header_offsets=[4,12]是文字错误，当前覆盖为[4,8]；旧证据冻结保留，parseMAP01早已正确保留bytes4..11。

原reader/writer跳过四个签名字节，45F530才有签名/版本/四word检查，不能把目标严格parser当原reader行为。2601-cell scratch、固定1458B校验及plane2 mode mask/C000写位复用。6份独立头夹具验证偏移；旧32MiB/4Mi-cells profile不是完整资源预算接受。

固定 SE 写补片按两段消息身份选择文件。第三平面写值与 `0xC000` 按位或，第二段身份与活动地图相同且格子落在半开窗口内时同步更新当前第三平面。重读按活动身份从文件取三平面，窗口呈现及移动等待读取各自的发布结果。 [补片写入和重读](../analysis/capability-first-v1/game-map-functional-specification.json#/fixed_se_map_region_refresh)

[地图操作规格](../analysis/capability-first-v1/game-map-functional-specification.json) · [来源核验](../build/analysis/map-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/map-functional-specification-v1/validation.json)

<a id="audio-functional-specification"></a>

## 音频资源域和载体边界保持来源（2026-11-10）

固定音乐目录44曲（0..43），普通cue270条/260路径及500冷却/64声部机制沿旧规格复用；目录ID、loaded/backing索引和环境两表各自独立。PCM frame/byte、声像/音量和MIDI主音量表不混用。两内嵌MIDI载体只按1204/16声明字节界限处理，未加入乐谱、音色或官方资产。

流式首填先使用实际mmio读取长度，ready后父才发布loopEnd字节边界；两个buffer几何字段和异常双区分支不简化。默认GM GUID仅代表源集合请求，不等于可用/可分发bank；FPU index0和原loader实际行为另验。AS的手动PCM路径保持，浏览器decoder归一化/重采样不替代源值。

[音频操作规格](../analysis/capability-first-v1/game-audio-functional-specification.json) · [来源核验](../build/analysis/audio-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/audio-functional-specification-v1/validation.json)

<a id="browser-surface-observations"></a>

## 有限编码、像素和PCM夹具覆盖（2026-11-10）

完整比较既有21791映射/2149未定义的23940格及256单字节；未复制官方素材或改表。原创新WAV各64帧、22050Hz，8/16bit×mono/stereo四类；手动17帧chunk写入原语及gain/loop被逐值核对，非完整WAV资源验收。

640×480 opaque pattern精确；两个256×1全alpha输入保存完整原始/读回结果，表面差异只作用于观察边界。没有据此给出最大贴图/内存/音频上限。字体仅系统渲染自有文本，不导出字体文件；资源和协议字节格式不变。

[实测档案](../analysis/capability-first-v1/browser-surface-profile.json) · [来源与约束](../build/analysis/browser-surface-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-surface-conformance-v1/validation.json)

<a id="browser-host-observations"></a>

## 真实高偏移范围与夹具边界（2026-11-10）

原创新稀疏文件4294975488B（实占73728B），在0、2^31附近、2^32前后及EOF放置自有标记。13次File.slice/Blob.arrayBuffer由独立字节hash核对，单次最多1048576B，未使用应用层whole-file读取；短读/越EOF返回不当完整成功。

此文件不是官方资源包或完整manifest，未测试ZIP64最大值、解码并发和真实资源容量。初次尾标记17B导致EOF多1B的前检失败已保留；修正16B并在写入前核边界，浏览器仅在修正后启动。原资源/协议格式和产品解析器均未改。

[宿主档案](../analysis/capability-first-v1/browser-host-profile.json) · [本轮约束](../build/analysis/browser-host-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-host-conformance-v1/validation.json)

<a id="required-entry-admission"></a>

## 表项、资源与非函数字段（2026-11-10）

原经典描述符48B、控件记录32B、另一表20B行的边界按既有提取器核对，不将2个raw1字段强转callback。MENU128共10节点：6非零命令、3popup和1空标签零命令项；不把容器或分隔项扩成用户能力。

本轮重核14模板/84控件、MENU原字节及2平面消息表，未导出官方图像/文本资产、改资源格式或新增解析器。C82资源/类/消息绑定的静态存在不证明当前匹配游戏版本或实际运行显示。

[入口台账](../analysis/capability-first-v1/entry-admission.json) · [来源与规格](../build/analysis/required-entry-admission-v1/specification.json) · [本轮核验](../build/analysis/required-entry-admission-v1/validation.json)

<a id="required-context-contract"></a>

## 快照元数据与原字节格式分开（2026-11-10）

本轮新增的是独立接口/状态规格，没有改ZIP/ZIP64、资源族、原raw mail/config/album或协议字节格式。lossless offset、源profile、内容清单、预算/lease与发布revision是独立资源元数据；账号/会话秘密不进入资源快照或restart intent。

分块候选先校验完整标志/内容，再由backend权威边界比较expectedRevision并更新active pointer；结果不明必须检查，不视为未提交重写。旧快照仍供已pin读者到物理排空，不能混读新旧字节；临时路径移动后重新绑定已核source。required持久化与session-only不同，微信不从rename/saveFile推断崩溃原子性或quota。

源107所需raw32bit type-word/payload与原格式保持明确，逻辑HP/MP事件不能替代；RID/scratch/共享cursor原数据origin不由新manifest字段补造。

[共同接口合同](../analysis/capability-first-v1/shared-target-contract.json) · [47行范围复核](../build/analysis/required-context-contract-v1/reconciliation.json) · [本轮核验](../build/analysis/required-context-contract-v1/validation.json)

<a id="mail-operation-composition"></a>

历史 Item 的 `data\album.dat` 对应解码后 81932 字节，包含两个各 320 行、每行 128 字节的角色槽及头部。变换输出容量为 163864 字节。映射配置目录中的 `mail.dat` 与 `guildmail.dat` 分别读写 384000 和 1283200 字节的双槽缓冲。所选读回调用的长度、图鉴失配重存和短写返回已核。原文件互操作仍待验。 [原文件与范围](game-static.md#legacy-item-album-mail-lifecycle)

固定 Item 在状态 7 与 11 的所选经典窗口收尾中，依序调用现有图鉴、个人邮件和家族邮件保存入口。继续使用上述三份布局和各自的写入结果。 [状态和保存调用](game-static.md#legacy-item-classic-rebuild-modes)

<a id="legacy-item-mail-records"></a>

固定 Item 的个人缓存每角色槽 192000 字节，60 组各十条 320 字节记录。家族缓存每角色槽 641600 字节，200 行各 3208 字节，每行前 8 字节为成员标识和有效标记，随后是十条记录。迷你记录按独立的 20 个联系人寻址，每人十条 320 字节记录。写入头两个字节记录未读标记和类型，随后向偏移 2 和 20 复制字符串。迷你接收解析器的 511 上限与记录可安全容纳的长度需分别核验。 [原文件与记录写入](game-static.md#legacy-item-mail-history)

## 邮件固定缓存、字段与重置边界（2026-11-10）

个人记录两bank×60×10×320=384000byte；家族两bank×200×(8+10×320)=1283200byte，均原始整buffer写出；迷你20×10记录不使用角色bank。record未读+0、方向+1、日期+2、正文+0x14，个人group步长C80沿原指令，不采纳旧伪代码800步长。

角色bank为所选signed16槽0/1；十目录的FC549C/FC5474与可见行/账号不同。mail.dat缺失时保存后提前返回，不继续guildmail；源短读/写/close与NUL复制没有完整原子成功保证，目标需明确有界文本/日期/索引和存储失败政策。邮件raw文件不套album/config opaque转换。

4E1CF0的43字节包含XOR EAX、A3寄存器存储和C7立即数存储；按原opcode提取六写。C5E94C计数区域清理共28字节，六个附件选择不在已核4FF080范围。初始化/缓存参与/回复保留和物理退役不能用文件结构替代。

固定 SE 的 28 个本地占用字节以绝对槽索引，装备槽 7 是 `C5E953`。物品记录、材料引用和占用各按原回包顺序更新。槽占用加减保存低八位。 [布局和使用条件](game-static.md#fixed-se-work-slot-seven)

[邮件操作规格](../build/analysis/mail-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/mail-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/mail-operation-composition-v1/validation.json)

<a id="chat-operation-composition"></a>

## 聊天存储与计时数据边界（2026-11-10）

D5D790/794为DWORD、D5D7A0为BYTE；F5F170/F536BC为WORD。PE image base400000、.data RVA133000、VirtualSize11,271,384、SizeOfRawData317,952；五字段在虚拟尾部，文件没有其初值字节，装载零值是规则推导。

名单100×17byte物理槽与UI72、环512×0x134与编辑历史64、可选日期文件路径/句柄分别记录。源load/save/count与异常返回已成规，目标保留有界输入与明确I/O失败政策，不复制越界。公告存储最多287byte与原全文量宽分别审定；气泡首行39/40、余段存储+41是布局差异，不是丢弃一个byte。

uint32差值发送/公告、原body绝对deadline与宿主elapsed/缺时钟延后起算分别标记；不统一强改时间域或把构建/纯模型返回当文件落盘证据。

[操作规格](../build/analysis/chat-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/chat-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/chat-operation-composition-v1/validation.json)

<a id="game-application-exit"></a>

## 退出回调表与日志文件的来源边界（2026-11-10）

两组CRT终止表分别为533184..533190和533194..53319C（尾端不含）；DWORD槽跳过0后按地址顺序调用。六个独立指令视图共355字节，保留与14份完整native记录不同的权威；原始字节/IAT表明52420B调用SetUnhandledExceptionFilter，不能误标成HeapDestroy。

聊天按既有Log/chat_YYMMDD.txt规则条件打开，已有句柄不重新选日期，逐条写后关闭重开；程序日志FEEF30另有关闭标记。源无成功I/O回执，平台持久化/预算/取消仍沿RP合同及实际验收。只读取固定PE/旧证据，未读真实聊天文件、账号或运行材料。

[退出规格](../build/analysis/game-application-exit-v1/specification.json) · [原件与来源](../build/analysis/game-application-exit-v1/source-views.json) · [本轮核验](../build/analysis/game-application-exit-v1/validation.json)

<a id="character-operation-composition"></a>

## 角色预览与升级材料边界（2026-11-10）

148字节记录的+24是外观，+36是本地临时分类，+80为预览/入场字段。4586F0先退役旧预览，再检查记录/分配；两占位码33100/33101映射100900/100901，其余可行variant0/1/other分支各有14个静态数值。42值与指针均核固定PE，数值规格不等于像素或回调运行验收。

kind5所用923C40是原程序读者给出的运行期缓冲，生产/所有者未明，不当新文件格式、空字符串默认值或可猜测票据。只读固定PE字节，未读运行材料、账号或凭据；没有交付厂商图片/完整大反编译载体。

固定 Item 的三张预览表与 SE 的 42 项 32 位编号相同。最终样式 0、1、其他值分别取三张表。在已核范围内，用规范编号减 240,000 或 241,400 后除以 100 向零取整为索引，再加规范编号除以 100 的余数按 25 分组的六倍。33,100 和 33,101 取各自固定编号。表与对象初始化共用 CH-T14。 [两个 PE 的指针与表范围](../build/analysis/legacy-item-character-appearance-v1/source-review.json)

Item 从 36 字节活动索引找动作，版本 1 读 20 字节头，其他沿 12 字节头。十字节帧在运行时按 12 字节排列，图块编号加素材组基数。动画和 AP 继续用已有格式。准备与活动帧的五个留存编号已从实际图块范围解码，回执保留摘要。 [资源读者](game-static.md#fixed-item-character-preview-frame) · [素材摘要](../build/analysis/legacy-item-character-preview-frame-v1/preview-material-probe.json)

Item 的绘制队列用四字节排序项定位四十字节绘制记录。排序项开头为 16 位序号，偏移 2 为优先级。普通记录前十二字节依次保存处理后的横坐标、纵坐标和图块索引，另外保留样式和对象引用。选角预览按这套结构进入绘制。 [队列写点和读取](game-static.md#fixed-item-character-preview-draw)

建角从四行 14 项的 32 位编号表选上下图形，颜色偏移为颜色索引的六倍。低类别上方按两个占位值选特殊编号，仍叠加颜色偏移。16 行脚本每项是三个 32 位值，依次为动作、复播阈值和有符号图形偏移。直接入队位置取锚点加图块原点，对象收集沿共用帧偏移。两版数据表的地址、内容和哈希已核。 [编号与动作表](../build/analysis/legacy-item-character-creation-preview-v1/source-review.json)

建角详情选中的八个固定控件各用七个 32 位值。前四项为左上位置、宽和高，后三项为默认、按下与悬停图形。肖像表有两行各 14 个 32 位基本编号，按族及序号查表，详情显示和确认输出共用模式换算。 [两版控件和肖像表](../build/analysis/legacy-item-character-creation-details-v1/source-review.json)

[操作规格](../build/analysis/character-operation-composition-v1/specification.json) · [已有源视图](../build/analysis/character-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/character-operation-composition-v1/validation.json)

## 11 月分发版的交接缓冲

固定 F5A 的选中记录按 `0xA4` 步长定位，选中文本和可选片段进入命令缓冲，再追加合资格的七组资源参数。命名映射单独发布，复制范围为载荷字节加 NUL，视图请求 256 字节。 [命令行和映射](launcher-static.md#f5a-handoff-fields) · [发布边界](launcher-static.md#f5a-mapping-lifecycle)

映射数字以无符号 32 位保存，构造初值为零。所选状态 0 回复的参数加 `0x80000000` 后保留低 32 位，发布时使用小写 32 进制数字。 [数字字段来源](launcher-static.md#f5a-handoff-number-origin)

<a id="capability-specification-audit"></a>

## 当前来源与资源规格边界（2026-11-10）

G17页的四组字段、图形选择值、时间、控制旗标、作者/正文及双层转义沿原来源复用。编辑描述符55DB70首指针为C20280；其余原始word只保留数值，本轮不猜字段名。既有58项字节声明与四个旧派生视图重新核对，不生成或交付厂商图像/完整反编译载体。

头像投影继续归G06，资源预算/manifest/分块持久化/取消与后台归RP/D0宿主合同及真实验收。已有decoder不因设备缺证重新取证；当前不同版本来源不合并。

[当前逐能力审定](../build/analysis/capability-specification-audit-v1/specification.json) · [来源补充](../build/analysis/capability-specification-audit-v1/supplemental-source-views.json) · [本轮核验](../build/analysis/capability-specification-audit-v1/validation.json)

<a id="capability-entry-formats"></a>

## 统一分析新增的窗口与资源元数据

固定 Item 的所选绘制列表项为四字节。开头的有符号 16 位记录号索引 `11D8D18` 中 40 字节的描述符，偏移 2 为无符号优先级。列表的原容量为 4,096 项，追加标记时按三个或四个槽预留。 [字节与排序](game-static.md#legacy-item-frame-hit-selection)

**.pat只据本分支视为文件名**：固定C82拼接反斜杠、raw Code与.pat后直接复制，未观察该分支读内部格式；不能套PUK3的ZIP规则或旧Code\PatchEXE布局。当前game row+0x28是原Code字符串，+0x9D是已准备标志，与installed+0x9C不同。源module filename门槛与destination path门槛分开，caller没有额外source full-path<260检查。未修改解析器或资源格式。 [缺文件准备规格](../build/analysis/launcher-missing-patcher-v1/specification.json) · [核验](../build/analysis/launcher-missing-patcher-v1/validation.json)

已核四条随包魔力配置的原 Code 为 4、1、11、11。当前缺文件分支对应三种名称 `4.pat`、`1.pat`、`11.pat`。所查安装分发和留存清单均未列这些制品。现有 `Patcher_PUK3.exe` 的身份来自主包实际成员及摘要校验，回退文件的实际字节和格式仍待证。 [材料核验](../build/analysis/launcher-patch-payload-association-v1/source-review.json)

**版本与存储边界**：LPS1七raw byte字段、XML first-text/默认/上限、ID键/INI多key和双目录marker是各自格式。22d与7eb updater的留存字节对比仅timestamp/GUID不同，仍保留两个hash；journal stage不是实态。PUK3的.bz2 URL实际ZIP、三操作顺序与候选最终MD5独立政策分别引用。601b首次Config不自动作为C82来源。未修改解析器或持久化格式。 [操作规格](../build/analysis/launcher-operation-composition-v1/specification.json) · [核验](../build/analysis/launcher-operation-composition-v1/validation.json)

**短文字与描述符的来源边界**：核两份48B描述符、四个32B控件、三份8B文本载荷和五个NUL短字符串。type3的文字指针在载荷第二word；指定GBK解码不证明全进程ACP。29的type0点击区域仍参加事件；4A31B0的3B零返回和4678A0的6B返回1 leaf均核原字节，不能将NOP填充并入函数。未改资源解析器。 [来源合同](../build/analysis/battle-observer-entry-contract-v1/specification.json) · [核验](../build/analysis/battle-observer-entry-contract-v1/validation.json)

**元数据不替代格式语义（未改解析器）**：普通字符串内偶然出现7fd4的SHA不证明特殊地图上下文，MutationObserver也不证明战斗观察者。窗口29/32的描述符/回调来源与功能语义分开；A/B在限定入口清单的精确地址未命中不证明全程序没有引用。字节布局、资源解码和原source profiles保持。 [当前前沿](../build/analysis/current-frontier-supersession-v1/specification.json) · [核验](../build/analysis/current-frontier-supersession-v1/validation.json)

**组表与字节账目（未改格式/解析器）**：38/41/43/经典52/53为group2，42为group4；这不是另一套业务表52的激活证据。普通group2构造先mask3同步清理；20物品/5宠物映射与全部28byte计数保持不同布局，8位算术可回绕。六shop内部mode0..5与外层Q?m mode/sequence分开，不新增线路代次字段。 [组合规格](../build/analysis/shared-occupancy-composition-v1/specification.json) · [核验](../build/analysis/shared-occupancy-composition-v1/validation.json)

**数量参数归属纠正（未改解析器）**：47B900九参数中第4/5项均source quantity，第6项0是编辑初值；47E440七个压栈值完整传至47E040，不能按五参伪代码省略误判。I|from|to|amount线路未变，不新增代次/owner字段。38/41/42的group2/2/4、48条32B定义及42 type5焦点载荷分别核原字节。 [数量框规格](../build/analysis/quantity-prompt-lifecycle-v1/specification.json) · [核验](../build/analysis/quantity-prompt-lifecycle-v1/validation.json)

**菜单/变身与物品字节约束（未改解析器）**：窗口26为14×32B定义、运行控件stride36B，所选按钮与选择flag单独映射。变身请求R|1/R|0无尾delimiter，依据实际payload1068；F53538普通field15与F5353C现有计时分开。两个18B帮助串可按GBK解码，不外推全进程ACP。物品字段沿纠正后的code5/category12/qualification10，I无尾分隔而Q有尾分隔。 [整链规格](../build/analysis/battle-input-exit-contract-v1/specification.json) · [核验](../build/analysis/battle-input-exit-contract-v1/validation.json)

**字段读序与部分body权威（未改格式/解析器）**：435000完整461B冷CFG与旧28B规范元数据分开，433B仅是补绑定的范围，不宣称此前无人观察。81首条extra在amount后/RID前；260准备先chain后main guard/chain guard，运行先main guard后chain；72 nested recipient不保留计数，113不读该nested字段。107的LP/FP格式各只有两个%d，消费原对象首两word，不是当前逻辑HP/maxHP或MP/maxMP。RID/游标/显示均不新增猜测字段。 [本批规格](../build/analysis/battle-preflight-boundaries-v1/specification.json) · [核验](../build/analysis/battle-preflight-boundaries-v1/validation.json)

**本批线路/资源复用（未改解析器）**：12保留5字段和1AE64..1AE67吟唱，style5 HP回加；267的word、flags/amount与800000的3RID、反射聚合及附接RID分别处理，资源字面1BE01及visualCount=4-tier不猜映射。41F520 group5复用16表项70F1+(counter>>2)与100tile，共用counter端点按源>14/<1换向。41A240只计20普通槽，区别22注册身份；不新增协议字段或资产。 [本批规格](../build/analysis/battle-utility-consumers-v1/specification.json) · [核验](../build/analysis/battle-utility-consumers-v1/validation.json)

**战斗字节语法复核（未改格式/解析器）**：110仅为当前parser显式类别集合；physical72/113强制pair、其它variant及73独立分支仍分开，98含15种变体。108为target/amount/flags，其他upper为target/flags；400/401/402/405另走专门语法。12单principal/amount与267目标flags/amount/RID均已有旧producer，不增加猜测字段或归一化113/260的读序差异。 [本批对照](../build/analysis/battle-variant-coverage-v1/crosswalk.json) · [核验](../build/analysis/battle-variant-coverage-v1/validation.json)

**本地选择布局补充（未改解析器/线路格式）**：C3AB18为20个signed8物品位置，C22558为5个signed8宠物位置，负字节getter返回-1；源物品选择标记28byte、宠物标记5byte，C5E94C另有28byte共享占用。位置交换不压缩空洞，slot|position线路字段沿用。C5E9C8是单byte抑制，C3B2CC/C43F58在数量链中为from/to；均非新增协议字段。[本批规则](../build/analysis/inventory-selection-ownership-v1/specification.json)

**前组资源边界复核（未改格式/解析器）**：RD/动画/调色板/缓存几何和MIDI/粒子规则按既有版本引用；非4倍scratch、像素精度、16字节MIDI实际loader和默认GM/设备接受继续保留。原缓存opaque互操作须先核需求，不为未准入条件展开所有转换；RP总预算/分块store是已有未实现设计。[逐项对账](../build/analysis/capability-source-reconciliation-v1/reconciliation.json)

**结果资料与状态宽度补充**：池记录stride68，共500条；+34/+38链、+3C kind16、+3E/+40变体按kind解释。普通整数速度和6/7/8的16.16位置不混用，+10绘制标量不当TTL。两组variant0..2共96字节descriptor；像素粒子按源palette/pitch条件，图块/特殊对象走既有资源队列，文件初值与运行值分开。未读真实像素或新增解析器。[合同](../analysis/capability-first-v1/game-entry-review-contract.json) · [核验](../build/analysis/particle-lifecycle-contract-v1/validation.json)

**所选列表/资料布局补充**：一级10行×0x14，类别16位、名称位于+2；二级最多6行×0x34，名称20字节区、六整数及类别/选择值；0x1c摘要单独构建。另有经典61的20行×0x20c活动/名称/数值/说明，以及经典62的14token资料。提取上限与NUL拷贝不等于字段容量检查，合法输入域/独立策略仍分开；未修改产品解析器。[固定样本条款](../analysis/capability-first-v1/game-service-invalidation-contract.json)

**当前接收资料格式补充（固定旧样本，未改解析器）**：`?<E`正文每物品槽13字段、共28槽，活体步长0x65c；空名称只作局部清理，槽8..27另通知服务。它与已有单槽更新及其他报价/缓存布局分别登记。标签GC为2个字符，核对的4字节静态存储包含NUL/对齐，不能强制所有线路标签长3；空字段列表也不等于no-op。联系人/邮件布局继续复用已有合同，未新增资源格式或线路字段。[来源与范围](../analysis/capability-first-v1/game-entry-review-contract.json)

固定 SE 的 `?<E` 全量首个名称从正文位置 2 开始，以固定顺序消费 28 个隐式槽。空名称清存在字和名字首字节。`?l)` 逐槽记录带显式槽号，所选空名称分支只清存在字。全量每槽 13 栏的格式包含 10 个数值栏，四栏写低 16 位。三个文本栏分别进入名称、说明行与附加显示文字，从内层转义转为原始字节，再按字段限值写入。 [字段宽度和布局](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/full_inventory_publication/full_list)

经典制造的六个位置各有 32 位相对槽号、需求组、缓存图标和配方查询值。五个 32 位标记登记要求是否满足。按绝对槽的选中标记与共享占用各用一个字节。全量空项和逐槽清槽后，编辑回调能读取活体中保留的编号、数量及类别，三端沿现有物品记录接入这些规则。 [运行字段及来源](../analysis/capability-first-v1/game-work-functional-specification.json#/inventory_material_selection/association)

经典交易的 20 个本方物品位各存有符号字节绝对槽号，选中标记和占用也按绝对槽索引。报价面板按映射读取 `0x65C` 活体，所选 `0x64C` 交易缓存另含存在、资格和显示字段。换位通知与缓存搬移分别使用各自允许的端点。 [交易运行布局](../analysis/capability-first-v1/game-trade-storage-contract.json#/inventory_confirmation/inventory_publication)

**窗口运行布局补充，非文件或产品ABI**：sidecar步长84字节，livePtr位于+c、保存标记位于+50(hex)，所选循环为68存储项，描述符仍67槽。36字节图形辅助块随回调解释：经典过渡的+0是窗口索引，对象+1d0是owner槽指针；另一缓存变体对应style/tile模式。相同偏移不能统一字段类型。[限定规则](../analysis/capability-first-v1/game-dispatch-findings.json)

**共用运行状态子集，非文件解析器**：f5f050按有符号16位读取，c1dd94恢复标记和两活动槽为32位，字段归属分开。4f06f0以1c步长检查48个记录起点，f5f050只在该CMP中充当终点；字符串实际写跨度不能由终点比较单独推出。上游长度与平台存储合同继续待证，不新增报文字段或产品格式。[事实/边界](../analysis/capability-first-v1/game-dispatch-findings.json)

**当前静态布局，非产品新增格式**：活动名片60×0x74；个人历史2×60×10×0x140，mail.dat原始384,000字节；家族2×200×(8+10×0x140)，guildmail.dat原始1,283,200字节。迷你20×10×0x140不采用角色bank，本组无落盘证明。历史+0未读、+1方向、+2日期、+0x14正文；容量、提取上限及NUL复制边界分开。两文件无本组所见变换，目录映射/缺文件提前返回/短读尾部及未来跨端政策单列；产品格式与解析器未改。[来源](../analysis/capability-first-v1/game-mail-data-source-check.json) · [布局/边界](../analysis/capability-first-v1/game-mail-data-contract.json)

**当前配置子集，非产品新增解析器**：save.dat解码读取要求1024字节及首32位0x7002；十槽/映射与角色bank分开。+0x04/+0x37/+0x6a为三个51字节区，getter对缺映射只写首NUL，满长不补NUL。当前F62D50运行记录保存清临时第二区，+0x313取C5EA70低字节；目录用FC5474[FC549C]，517510内存副本却直取FC549C，并保留第二区。这些表达式不统一，索引不变量、转换/其他字段及渲染编码仍待证；邮件缓存布局不变。[字段与边界](../analysis/capability-first-v1/game-mail-data-contract.json)

**事实与静态推导**。固定 SE 的 `505450` 在打开 `save.dat` 前，先复制 1024 字节的活动配置并清局部偏移 `[0x37,0x6A)`，用 `5111C0` 和种子 0 写 1025 字节。首字节为清理后的输入字节之和取模 256。输入索引从 0 起，索引为偶数或 5 的倍数时，该字节先按位取反。随后第 `i` 个输出字节从 `i=1` 起用变换后的输入 `i−1` 加上首字节乘以 `i² mod 7`，结果取模 256。两份原创配置复算通过。 [原指令和夹具摘要](../build/analysis/battle-266-audio-map-save-v1/source-review.json)

**当前37c4内存/表来源，非新增产品格式**：窗口42描述符48字节、8控件各32字节和独立指针已核原件；宠物属性仍读0x6d8步长记录、选中映射仍取有符号16位索引。局部五项跳转表20字节独立核对。数字回调的8字节栈缓冲及%6d最小宽度不定义新的线路固定长度或持久格式；产品解析器、资源包及构建方式均未改。[表/布局核验](../analysis/capability-first-v1/game-ui-producers-source-check.json)

**当前37c4数据来源，非新增产品格式**：角色资料缓存步长0x828；三组32位flag及字符串与第四字符串分开，所见内层编码容量256，实时flag和缓存flag不合并。ef35e0是接收低字节写入地址，也被用作某数组的结束常量，不能据此命名新字段；eadf88短文本接收上限为字节长度<24，界面复制/排版及整块重置分别登记。以上内存来源不作为持久文件格式；资源解析器、产品包和构建方式未改。[布局与边界](../analysis/capability-first-v1/game-producer-context-contract.json)

**37c4图形对象内存布局，非持久文件格式**：409e70请求800字节主体，4ea7c0请求36字节附加区；主体+8为回调、+0c为附加区、+1c为待删、+2c为动画状态、+170为逻辑包装而非普通ready整数。附加区+0/+2为有符号16位style/counter，+4/+8为32位宽高，+0c/+10为中心，+14/+18为半范围，+1c图形基号，+20选择字；padding不重解释。464c70的399×399 flag/pointer网格只清值1的flag并标记对应对象，不清pointer。现代表99×20字节另核；产品资源格式、解析器和构建方式均未改。[布局及边界](../analysis/capability-first-v1/game-graphics-lifetime-contract.json)

**37c4本组为索引归属，未新增产品格式**：72函数体以PE节映射核范围/哈希，68个3字节tag及其NUL核4字节；伪代码行号/哈希、记录选择器和原始表出现位置保留为追溯元数据，不把内存结构或反编译签名当文件格式。两个常量回调的36/1,464处表引用仍沿用旧源表证据，本轮没有重读全部描述符/控件表。新层与原647图分开，避免改写旧source-check所固定的哈希；产品解析器、资源包和构建方式均未变。[数据与范围](../analysis/capability-first-v1/game-entry-review-source-check.json)

**同C82内存所有权事实，非线路新增格式**：文档/节点/属性七个vtable的slot0绑定实际删除析构；Node先保存next(+0x30)再递归删子节点。Element清first/last(+0x18/+0x1c)，另解链/删除+0x34内嵌哨兵所持属性。Load先删旧子树、改文件名/游标后开文件；直接Parse重置诊断但追加已有子链。局部XML树清理与共享目录发布分开。MessageBox包装实际为ANSI导入，不据反编译宽字符标签推断输入/存储编码；产品资源解析器未改。[表/偏移核验](../analysis/capability-first-v1/launcher-modal-recovery-source-check.json)

**同C82进程内布局，非持久文件/线路格式**：channel+0xc为回复观察标记，+0xd/+0x11为指针/序号，+0x15保留第三字，+0x1c为借用数、+0x20为操作门槛。context+0x68/+0x6c/+0x78分别绑定帧解析/消息/断开回调；前两者复制至connection+0xfc/+0x100。connection+0xec关闭意图与+0xf0销毁状态分开；六个AA vtable代码指针只取24字节前缀。未新增资源解析器或格式。[精确范围与来源](../analysis/capability-first-v1/launcher-channel-source-check.json)

**同C82进程内布局事实，非文件或线路格式**：DNS job正常分配64字节，+0引用计数、+4完成标记、+8自持有host字符串、+0x20结果缓冲、+0x38状态、+0x3c解析函数；worker传入的结果容量为22字节。三个CRT初始化视图由表项绑定，App63c800位于.data原始文件末端后的虚拟区；四个自定义零初值来自明确指令，未把虚拟区称为原文件字节。TaskbarCreated/commctrl_DragListMsg对应托盘/拖动消息，与登录回调分开。产品资源解析器/格式未改。[来源与精确范围](../analysis/capability-first-v1/launcher-lifecycle-source-check.json)

**事实（固定 37c4 来源，以下偏移为十进制）**：传统 descriptor 为 12 个 UInt32/48 字节，+28 为控件数、+32 为原始控件表、+36 为创建及每帧准备回调、+40 为控件处理后的末段回调、+44 为销毁回调；不是单纯“初始化/frame”二分。源控件为 8 个 UInt32/32 字节，+28 的零值在构造时换为 4a31b0；运行副本36字节：type@0、新增零字@4、x/y/width/height@8/12/16/20、participation@24、载荷@28、callback@32。源+20复制至参与字段，必须值1才参加通用绘制/事件。

67 个编号槽引用 66 个描述符，36/37 别名必须保留；68 个 live-object 槽是另一上限。对象224字节，sidecar84字节；组字节表分布0:17、1:32、2:13、4:5，分组关闭使用掩码。36/37的54c298记录初始参与0、width0、callback字段1；通用事件无type保护，尚未排除动态钩子将其激活，不能删除、转为函数或推断永不调用。[生命周期及字段来源](../analysis/capability-first-v1/window-engine-contract.json) · [字节范围/哈希](../analysis/capability-first-v1/window-engine-source-check.json)

另一套表为 99 行、每行 20 字节：id@0、callback@4、group字节@8、图形对象缓存指针@12、dirty低字节@16；后两者已由4e94d0闭合观察用途，不再统称保留字段。0/100行回调为空，group为0..2；活动槽/互斥及输入编码与传统框架不同。每业务描述符、图形对象+0x170与生命周期仍单独取证。[来源合同](../analysis/capability-first-v1/alternate-window-contract.json) · [原文件范围及字节核验](../analysis/capability-first-v1/business-map-source-check.json)

**事实**。99 行范围的右端点分别为 SE `0x55A3CC` 和 Item `0x5F2714`，端点均在表外。两版紧随表的四字节值 392 由各自初始化入口写作窗口 1 描述符的横坐标。 [样本哈希、文件偏移及读写位置](../build/analysis/legacy-se-classic-album-ingress-v1/source-review.json)

**事实（c82f 分析登录器）**：静态资源元数据解析覆盖 14 个对话框/84 控件和一个标准菜单/6 命令，逐资源完整消费。标准与扩展对话框的 creation-data 长度规则分别处理，保持 WORD/DWORD 对齐；标题/标签只存哈希。格式依据微软的 [DLGTEMPLATE](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-dlgtemplate)、[DLGTEMPLATEEX](https://learn.microsoft.com/en-us/windows/win32/dlgbox/dlgtemplateex)、[DLGITEMTEMPLATE](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-dlgitemtemplate)、[DLGITEMTEMPLATEEX](https://learn.microsoft.com/en-us/windows/win32/dlgbox/dlgitemtemplateex) 和 [MENUITEMTEMPLATE](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-menuitemtemplate)。这是分析器的限定覆盖，产品资源解析器与素材格式未变。

**前序平面提取范围（c82f）**：离线提取器只消费指定的43项/2项消息表及各24字节全零终止项、8字节map和6字节返回访问器；6个UInt32分别登记消息/通知/首末ID/观测signature字段/handler，不声称所有MFC ABI相同。同ID本身不证明对话框归属，菜单ID0分隔项不计为命令；后续类绑定见下节。[平面表及来源检查](../analysis/capability-first-v1/launcher-message-map.json) · [复现脚本](../analysis/capability-first-v1/extract_launcher_message_maps.py)

**类/模板补证（同一固定x86样本）**：vtable前一字是RTTI locator指针，所观测locator20字节、TypeDescriptor有8字节前缀和有界ASCII类型名；+0x28槽连到返回消息map的访问器。新分析器只接受B8-immediate/RET及直接E9，访问器链最多4步，map最多16层、每层512项和200字节类型名，保留全零终止、原字节哈希与未解析边界。13个所观测vtable的静态链已读完，不代表所有handler语义完成。[构造/类及消息链](../analysis/capability-first-v1/launcher-dialog-bindings.json)

**预设文件事实（固定 c82f）**：LPS1四字节、UInt32LE版本1、数量0..32；每条UInt32LE类型0..14，随后七次UInt32LE字节长度和原字节，无终止零/内存对象填充，必须精确EOF。七字段上限依次64/512/512/512/512/16/40字节，仅索引4可空；全部拒绝0x00..0x1f和0x7f，不检验UTF-8或代码页。172字节内存记录含七个24字节字符串对象，不能直接持久化该内存布局。读取上限115,724字节，零字节文件失败；12字节零记录文件有效。源编码/解码不检查名称唯一性，名称UI另查重复。当前只有分析规格，未增加产品解析器。[格式与来源](../analysis/capability-first-v1/launcher-presets-contract.json) · [复现脚本](../analysis/capability-first-v1/analyze_launcher_presets.py)

**目录消费者内存布局（c82f，非文件格式）**：以controller+0x120为基，游戏记录从+0x2bd8开始/步长164字节；显示/次级字符串指针为+0/+4，区服索引数组/数量为+68/+148，类型/可用字节为+152/+156。区服记录从+0x3574开始/步长412字节，子区数量+24、按类型数量+168、子区行+228、不可用字节+408。main+0x10f4的预设记录仍为172字节；两种布局不能互换，本组同版生产者又把+0/+4明确为XML Game.Name/EXE，+0x98由Code转换而来；完整XML/安装语义仍未关闭。主可见行→原行映射限定索引<64；回复ID的原序号和可见序号分别处理。[消费者合同与来源](../analysis/capability-first-v1/launcher-apply-contract.json) · [41范围比对](../analysis/capability-first-v1/launcher-apply-source-check.json)

**本地排序/筛选元数据（固定c82f，非线路新增字段）**：+0x1694为规范化游戏ID筛选词；main+0x1c9c逐字节为组、+0x1cdc为有符号排序值、+0x1edc为相对顺序文本，F/B:/A:及缺目标/待处理规则按来源合同保留。GameIDNotes/GID_PIN_/GID_PIN_ORDER_V2_只定位了键名和相关读写者，键派生、全部写入/导入导出格式仍待核，未新增产品解析器。四个运行创建控件和上下文动作7926另登记，不改变14模板/84静态控件/6静态菜单命令的计数。[来源及范围](../analysis/capability-first-v1/launcher-catalog-state-source-check.json) · [字段与排序合同](../analysis/capability-first-v1/launcher-catalog-state-contract.json)

**本地ID元数据细化（固定c82f）**：GameIDNotes为PlayOnline.ini节名；base键GID_后接摘要结果，GID_PIN_/GID_PIN_ORDER_V2_/GID_MOVE_ORDER_V2_/GID_MOVE_ANCHOR_复用后缀。16字节摘要及32个小写十六进制字符的MD5分类由独立静态模型补证。备注规整上限32字节；排序快照为64整数+64整数+64个字符串对象的768字节源布局，不是文件块。API字符串读缓冲256字节、数值以%d写入；未新增产品INI解析器。

**运行时模板模型**：4197f0/4180e0/418250在普通分配成功路径构造标准DIALOG，260×82、四控件7208/7207/1/2；独立模型由既有元数据解析器完整消费，标题/标签只存哈希。它与原程序实际窗口/内存缓冲、14个静态资源模板及尚未闭合的3资源用途分别登记。[格式/模型来源](../analysis/capability-first-v1/launcher-id-metadata-source-check.json)

**固定 F5A 的本地置顶值**。`GameIDNotes` 中的 `GID_PIN_` 与 `GID_PIN_ORDER_V2_` 共用 `GID_` 摘要后缀。两值按十进制写入，排序值非正时写零。正数候选回复加载时，置顶读值按非零判断，排序值保留有符号正值。 [键名、参数和读写证据](launcher-static.md#f5a-pin-publication)

**固定 F5A 的备注、排序和搜索设置**。备注沿 `GameIDNotes` 的基础 `GID_` 键保存，读写应用 32 字节规整。移动排序用 `GID_MOVE_ORDER_V2_`，相对位置用 `GID_MOVE_ANCHOR_`。搜索展开在 `LauncherUI` 的 `GidSearchExpanded` 保存。排序快照是两类整数与锚点字符串组成的运行时状态。 [字段及回读规则](launcher-static.md#f5a-candidate-management)

备注确认时，基础键使用当时的账号和游戏码，以及打开时所记索引处的当前候选名称。账号或名称为空时跳过设置写入并进入失败返回。 [保存目标和回执](launcher-static.md#f5a-note-modal-admission)

**同c82f目录树消费规则**：精确Gamelist/Games与Regionlist/Regions容器通过后，原owner重置并原位装载；字段只消费首个type4子节点，不拼接后代文本。游戏15、区域40、游戏区域成员20、BIP10、Galaxy15，Args按Gamecode存15槽；未解析成员保留-1。Windowed位于DownloadPage属性，Game链接字段偏移按该样本单列；完整XML编码/实体/词法与旧c7ba规格不能合并为通过。无产品解析器或格式变更。[字段/边界合同](../analysis/capability-first-v1/launcher-catalog-install-contract.json) · [源核验](../analysis/capability-first-v1/launcher-catalog-install-source-check.json)

**同版路径/菜单元数据**：目录子规则拒绝点段；盘符首字节依赖已证locale分类，UNC要求非空server/share且排除两设备前缀，后续目录存在性仍由Windows调用决定。标准菜单128仍为258字节/6非零命令，未增加菜单/对话框计数；已逐原件重新解析并绑定加载/创建请求及已知对象路由。4个命令无已知普通handler不等同全局不可用，也不自动新增4个游戏需求。新PE导入解析仅核4个窗口API名称与IAT元数据，不执行原件或动态解析。[来源](../analysis/capability-first-v1/launcher-host-routing-source-check.json)

**同C82 XML字节格式规则**：已登记文档/元素/注释/Unknown/文本/声明及属性的7个parse虚槽、五个命名实体、256项宽度表和14条错误元数据。CDATA按Unknown处理，字段不拼接全部文本；legacy数字实体截低字节，UTF8模式只按宽度复制/输出，不等同致命Unicode解码。当前字符串XML子集的DTD/属性/闭合、节点和字符策略不等同该来源。源码普通路径已成规，失效引用/截断/NUL/容量及系统文件效果另列，产品资源格式/解析器本轮未改。[规格](../analysis/capability-first-v1/launcher-xml-contract.json) · [源核验](../analysis/capability-first-v1/launcher-xml-source-check.json)

基初始化器44ee28在相同receiver存模板ID于+0x80/low16于+0x84；模态方法44f422以+0x84调用FindResourceA(type5)。11模板构造路径包含参数化Surface与不同末级类；这些偏移只用于固定样本取证，不作为跨平台接口或通用MFC ABI。296的删除析构参数不当成模板证据，另3资源用途未闭合。[字节检查及分析脚本](../analysis/capability-first-v1/dispatch-binding-source-check.json) · [复现](../analysis/capability-first-v1/derive_dispatch_bindings.py)

<a id="stage306-work-context"></a>

## stage306 上下文表、配方标签及坐骑条件

**事实**：固定样本55b024的7个字节是64 5f 5a 55 50 4b 46（十进制100..70）；不是新协议字段。F8%既有字段15对应f53538；Xz@既有两个int32经4f2ae0保存剩余毫秒和mode。其时间运算继续使用既有游戏时间所有者。[原字节及偏移](../analysis/game-work-context-v1/source-check.json)

固定 SE 的 `F8%` 在掩码选中位 15 或总选位 0 时更新资料项，其余情况保留原字段。`Xz@` 保存 `max(秒数, 0) × 1000` 的低 32 位和原模式，随后按有符号剩余量推进。 [掩码、字段和时钟核验](game-static.md#fixed-se-work-context-publication)

**事实**：@_i配方格式和普通slot不变；本地标签由回复接收时的上下文决定，不能从回复slot推断。查询／最终提交的slot+100仅限已证操作；目标查询仍是普通slot。人物MP、物品资料和坐骑子体均取已有所有者，没有增加猜测的包字段。

原创独立Python参考覆盖112个signed／unsigned乘法溢出、负数及截断案例和35个tier／时间条件；另用实际客户端包验证配方重查、MP不足和Hx!70坐骑子体条件。[参考模型](../analysis/game-work-context-v1/original-vectors.json) · [验收](validation.md#stage306-work-context)

<a id="stage305-work-targets"></a>

## stage305 目标名单与 kind3／4 字段

既有技能／等级和物品格式不变。type3／4 使用等级 0x7c 与主技能 0x34 计算成本；kind3 主 id221..224 决定语义，已知 kind4 id 决定采集姿势。KxC 名字／flag 对最多补到 10 个一级目标；L<% 外部目标最多六行、每行七字段；名字先执行既有内层解转义。[原字节](../analysis/game-work-targets-v1/source-check.json)

自己的明细使用人物字段 15 等级、F8% 字段 12 健康、E(9 字段 1..4 的 HP／MP，以及字段 29 名字。宠物使用既有 name／nickname、level8、health0xd4、HP0x10／0x20、MP0x30／0x40 和 mode0x6aa；排除 mode3 后源序号压缩，不等于物理槽号。外部七字段保留 rawFields，不臆造额外目标 id。

kind3 七数字的末字段依模式解释，kind4 七数字的末字段为 graphicIndex，随后一个名字；两个布局不得混用。kind4 失败忽略负载并归零展示增益，名字超过 28 字节使用源占位 ???。目标名按 16 字节已证范围读取，不模拟原生 17 字节槽的越界写入。当前背包 28 槽、可用 8..27 保持。

独立 Python 原创参考覆盖 12 模式案例、8 int32 成本、8 deadline 边界、72 模式结果及 4 本地目标序号计划。[模型](../analysis/game-work-targets-v1/original-vectors.json) · [验收](validation.md#stage305-work-targets)

480ac0 证明宠物 0x6aa 到 C1FC14 临时模式表的 signed16 复制，mode3 筛选取值有来源；当前记录的即时消费仍不等于所有原生全局刷新节奏。[补核](../analysis/game-work-targets-v1/pet-mode-check.json)

<a id="stage304-work-actions"></a>

## stage304 物品工作字段与刻印字节边界

此前 14 字段物品、56×22 配方、主技能／等级格式不变。本轮使用物品 category、quantity、level、exchangeCode、首行说明就绪和 qualification；说明标志不能从 qualification 推导。主技能 0x1c 是物品工作等级上限，修理／鉴定按 itemLevel*10 计算成本，不套用普通配方百分比。[来源](../analysis/game-work-actions-v1/source-check.json)

刻印编辑结构 55b24c 为一行 16 字节；55b030 的字号 12 不是容量。0x7c／0x5c 的 DBCS 步进、0x20／0x81／0x40 的逐字节空白检查分别建模，提交原文。资格位 0x400 允许清空已有刻印，0x100／0x200 和类别 47 有独立拒绝条件。c5bd1b 是 PE 虚拟零填充字节，不冒充磁盘原字节或选中等级。

装饰产品成员查询扫描全部 56 行，允许前部负 id 后仍有匹配项；提交基材槽|附加槽，不提交物品 id／数量。kind2 七数值的第二字段保留 raw；装饰保留既有 kind1 八数值及名称预算。原创 Python 参考包含 60 个物品条件、7 个计时边界、13 个文字案例及双材料分类参考。[模型](../analysis/game-work-actions-v1/original-vectors.json)

当前 28 槽／背包 8..27 上限不变；原生 <100 检查不是扩容证明。未给 Lor kind3／4 未完成字段、现行版本或全局别名补猜测结构。

<a id="stage303-craft-input"></a>

## stage303 制造字段覆盖及边界

此前 @_i 的 56×22 字段／每配方五材料保持；本轮证明字段 [4] 为制造 MP 成本基值，[8] 参与耗时，[0xc] 为菜单可进入标志。主技能字段 0x34 为成本百分比，等级 0x8c 为普通选择启用标志；未给其他数字臆造用途。[函数与原始窗口](../analysis/game-craft-input-v1/source-check.json)

既有 14 字段物品记录保留第九字段 level；首行说明是否非空独立于 qualification。原生材料输入允许槽 8..99，但本实现仍沿已验证 28 槽所有者读取 8..27。材料数量 0→1，提交只序列化槽号。Lor 的八个数字中第二字段保留 raw 未命名，失败时图像索引归零；至多六个名称受整体八行预算约束。

原创独立模型包含 8 个 int32 成本／耗时／回绕样例、3 次材料关联状态和 6 种姿势。配方前缀有界为 56，文本不借出所有者缓冲；结果不推算库存／魔力。[模型](../analysis/game-craft-input-v1/original-vectors.json) · [验收](validation.md#stage303-craft-input)

<a id="stage302-craft-recipes"></a>

## stage302 配方记录与原创固定内存参考

本轮没有新网络标签或素材格式。每技能的 0x49fc 布局中，配方区为 +0x698 到 +0x49f8，含 56×0x134；最后 4 字节为来源上下文。每配方 7 个字段加 5×3 材料字段，材料区 +0x6c、步长 0x28。未知数值以源偏移保留；文字上限按反转义后的字节计算，不按 Unicode 字符计数。[字段布局](../analysis/game-craft-recipes-v1/source-check.json)

原创 Python 模型使用独立的固定内存、32 位小端数值与 C 字符串写入；16 份完整期望状态共 896 配方行／4,480 材料，覆盖 56 行、末技能槽、配对字节、反转义、符号／溢出、缺字段、超长保留、部分重置、NUL 和多余尾字段。公开向量只有原创合成字节，不包含原程序或官方配方资料。[生成器](../analysis/game-craft-recipes-v1/generate_vectors.py) · [消费者比较](../analysis/game-craft-recipes-v1/reference.mjs)

<a id="stage301-battle-item-dispatch"></a>

## stage301 ITM 不增加字节或资源格式

本轮没有新增网络字段、道具类型、图片、资源包或解码格式。编号比较覆盖 32 位零、6、7；其他 4,294,967,293 个位型在该回调到公共返回。37 个边界样本用于核对方程，未声称逐个枚举全部位型。[来源](../analysis/game-battle-item-variants-v1/source-check.json)

原始读整数函数按十六进制字符推进原 object+64 游标，编号另存 object+84；本轮没有用预解码字段替换原生的未观察后继读取。公开分析只保存位置、哈希、方程和结果，原始二进制与反编译内容仍在本机 build。既有实际素材和 stage300 生成包未改。[规格](../analysis/game-battle-item-variants-v1/implementation-spec.json)

<a id="stage300-city-water"></a>

## stage300 回城不增加资源或wire格式

资源与网络格式保持：1072文件实际ZIP完整SHA及2,549,171,845字节重核，实际图片／人物／动画未改写。原创布局使用地图40000，转场分支使用59000，战斗条件选择实际特殊背景5000；边界／提前边界保留原地图。fixture的cityMap／background／freshOwnUnit描述可选配置，具体执行分支以回执scene_reloaded及route为准。

真实格式的H#|本地资料只在原创场景回复中补齐，不由动画推断；旧原创对端及原资料文件保留。独立Python提供12条顺序状态轨迹和两组水面后type15淡入的98张完整RGBA，像素为原创梯度；本阶段没有新RD解码器或素材版本等价结论。[核验](../analysis/game-city-water-v1/source-check.json) · [材料与结果](../analysis/game-city-water-v1/validation.json)

<a id="stage299-battle-water"></a>

## stage299 特殊战斗图形仍为原RD资源

没有新增图像或网络格式。实际5000..5008→3096..3104，8946→3105；实际5009为2912，不属于特殊范围。十份原始RD作为背景首次排队时触发门槛处理，随后缓存背景复制不触发。源码／生成各完成20次嵌套捕获与10次缓存复制，完整640×480帧与单独像素放置一致；这检查背景语义与来源材料，不是第二套RD解码器。[材料证据](../analysis/game-battle-water-v1/validation.json)

原创合成夹具单独将5000..5009映射十个特殊索引并使用8×8原始图案，不能与实际档案资源号混淆。Python独立计算1,060帧及1,200次顺序操作；真实素材未改写，完整ZIP的2,549,171,845字节／SHA256重核，实际RGBA压缩文件仅留build。[来源](../analysis/game-battle-water-v1/source-check.json) · [规格](../analysis/game-battle-water-v1/implementation-spec.json)

<a id="stage298-ordinary-water"></a>

## stage298 水面索引仍使用普通RD

本阶段没有新增图片或网络格式：3096..3105仍经既有GraphicInfo和RD路径。所选实际档案中，5000..5008→3096..3104，5009→2912，8946→3105；因此不能按5000..5009名称统称特殊格式。12份实际资源的RD摘要保存在验收记录，原图／压缩RGBA只留build。

新增waterStrip是内部数值绘图描述。原始64项int32表和3项地图表共268字节已匹配原件；640×480快照、8像素带、越界保留及较小视口补零策略分别标记。2,549,171,845字节实际ZIP完整SHA复核，64份完整画面源码／生成相同；底图及上层先由既有资源库准备，Python独立应用水面方程并比较整帧。[来源](../analysis/game-special-graphics-v1/source-check.json) · [材料校验](../analysis/game-special-graphics-v1/validation.json)

<a id="stage297-body-draw-flags"></a>

## stage297 绘图开关保留原动画字段

原资源格式未变。原创夹具给资源100001／110350使用相同20字节头和两帧动画，原flags0..15、ARGB4090c0ff及编号320保持；资源选择产生当前来源覆盖值0／4。身体动作只切换覆盖掩码，既有动画颜色、编号、信号和翻转偏移不被重写。

独立Python按字段顺序计算32队列、160份640×480完整RGBA，与源码／生成核心一致；这是原创回调夹具。实际材料另跑既有CUT59510／59526的8条产品回归，材料字节不变，正常164／165协议生产者仍待确认。[来源](../analysis/game-battle-gmn-flags-v1/source-check.json) · [机器记录](../analysis/game-battle-gmn-flags-v1/validation.json)

<a id="stage296-actual-battle-product"></a>

## stage296 实际ZIP的产品消费

格式与原字节未变。实际ZIP为2,549,171,845字节／1072文件，SHA256 `6ff08fd6251c748afaaa36a894b027a4992bdcc1e1a615d3f739809c5d6d2c8e`；使用stage290显式资源参数。源码／生成预检均核对完整档案身份，角色100010的160动作／24原信号帧，以及group4／index618381的背景300653（640×480）。[机器记录](../analysis/game-actual-battle-product-v1/validation.json)

CUT59510／59526的实际资源经过产品入场、战斗与回场；没有插入信号、补写调色板或转换图片。地图格排列、角色配置及结果由原创本机对端提供，不能据此声称完整原场景、材料版本与服务器兼容。实际图片仅由本地build材料读取，截图放仓库外。[规格](logic-protocol-spec.md#stage296-actual-battle-product)

<a id="stage295-battle-draw-style"></a>

## stage295 六种实际材料战斗上下文

未改变原RD／CUT／动画格式。复核stage294的25个动作／112帧、17个命名载体及每份实际RD摘要，保留645字节前缀及已知色范围。以真实资源300653完整图集为背景，生成640×480原创战斗池：raw、alpha0、alpha64、ghost、RGB覆盖加ghost、清除加色六种上下文，共672份完整RGBA在源码／生成核心一致。[机器记录](../analysis/game-battle-draw-style-v1/validation.json)

原加色帧在alpha0／64或ghost下与raw相同，清除加色位后恢复按alpha混合；非加色帧在alpha0下只保留背景。实际动画头的RGB仍为白色，RGB覆盖是来源字段支持的原创对象上下文，未称原生场景观察。

产品验证另用原创资源100010的40个动作，保持原持续时间／方向／帧字节，将作者夹具扩展为20字节头，分别设ARGB8090c0ff及普通／加色。wire字段未改，原游戏素材不写入夹具或交付。672帧实际材料与八条原创材料产品流程分别记录。[来源](../analysis/game-battle-draw-style-v1/source-check.json) · [验证](validation.md#stage295-battle-draw-style)

<a id="stage294-vertex-color"></a>

## stage294 ARGB动作与有效部分调色板

所选六组实际动画Info的4,911个物理记录、469,263个action头及3,512,593个帧记录已按边界盘点；原始version64按既有源规则回到12字节头。只声明这组明确后缀材料，不代表其他版本或所有运行消费者。25个非ffffffff颜色动作共有112帧，七个alpha值，RGB均白色；其中113073的8帧还带加色位8。[机器摘要](../analysis/game-vertex-color-v1/validation.json)

17份命名调色板载体中113305／编号567为645字节，其十帧最高颜色索引213，位于215项有效BGR范围。当前普通范围渲染可使用有效前缀并检查所有索引。实际帧在CUT59663地面1099／资源300653的 `[576,432,64,48]` 裁片上逐幅验证，和普通不透明覆盖共有1,879,080个像素不同。

产品另选CUT59510／物件8192→113610／编号872，及CUT59526／物件4293→113073／编号335；12×12场景、地面1099和物件位置由原创对端指定。59526所抽查前144个AUT格全黑，使用来源黑色1规则核对。原安装内容保持只读，公开文件无原像素或大段反编译正文。[来源](../analysis/game-vertex-color-v1/source-check.json) · [验收](validation.md#stage294-vertex-color)

<a id="stage293-additive-render"></a>

## stage293 真实加色动画与地面裁片

本轮没有改变RD／CUT／AUT文件格式。真实CUT59663物件1464引用动画113685，2动作／12帧带标志8与命名编号947；原表947映射图形资源113685，其内嵌BGR调色板SHA256 `e5c91a9d2a2079ccfb47b51333d241bee25b4dce02ef9f4449290a83ee262958`。

地面1099使用资源300653的裁片 `[576,432,64,48]`，原RD对应区域3072个非零像素索引。独立参考从实际材料解码地面、调色板和每幅动画，在地面上合成完整画面；12幅加色结果与普通覆盖的28,804个像素不同。实际样本这批帧未触发255截断，饱和边界由480种原创组合覆盖，不能把两种证据混称为实际饱和观察。[材料摘要与结果](../analysis/game-additive-render-v1/validation.json)

产品对端显式选择12×12原创地图、地面1099及物件1464，未恢复或冒充官方地图尺寸／布局。原资源未改写，公开材料只存摘要与原创夹具。[来源](../analysis/game-additive-render-v1/source-check.json) · [验收](validation.md#stage293-additive-render)

<a id="stage292-animation-named-palette"></a>

## stage292 命名调色板图形载体

**事实**：编号320对应固定表 `568310` 的图形资源113058，实际匹配GraphicInfo索引616882／组3／偏移62770262／长度1747。RD为48×54、flags3，解码后带768字节BGR调色板。该颜色独立于本次待画动画帧有无自带调色板，优先用于32位准备精灵。

1,495槽／5,980字节表完整SHA256为 `e840afd5967889eed59ef3445e7ba47cfef465b973df5d5d59e407e32875e150`，通过29个连续数值段保留全部映射；编号归一化覆盖65,536种16位输入。当前独立实现只接受完整768字节命名颜色；部分尾部不补猜测色。实际资源54帧的完整像素、所选4个载体观察与源码身份均保留摘要，不交付原图像或EXE。[来源](../analysis/game-animation-palette-source-v1/source-check.json) · [验证](validation.md#stage292-animation-named-palette)

<a id="stage291-legacy-minimap"></a>

## stage291 AUT原始RGB与普通小地图颜色表

**事实**：`bin/PUK2/cutdat/{selector}.aut` 没有地图头，按RGB字节三元组排列。宽高来自地图缓存，不从文件长度开平方推断。原读取器最多477603字节，即399×399×3的全局容量；独立实现拒绝loaded格子访问文件未提供的RGB，不用旧缓冲尾部补色。

实际材料已有341个CUT与337个AUT，AUT总58,604,403字节，文件名大小写混合。59529.cut为2190字节、121条记录；59529.Aut为4563字节，SHA256 `a3b1c35a68db05a8361730d7aa173005998423b287805ee782cfc77d0a255735`。本轮12×12尺寸是原创对端的显式选择，不是对官方地图尺寸的恢复。[完整盘点与摘要](../analysis/game-legacy-minimap-v1/validation.json)

普通16位颜色表来自最终图形槽，不能直接用资源查找表或GraphicInfo文件+32代替运行时组字段。17,286个地块有合格颜色来源，27个选取颜色与独立Python完整平均一致。实际动画113058的action0含非零调色板320，现有场景未支持；54帧解析成功不等于该动画显示通过。[来源](../analysis/game-legacy-minimap-v1/source-check.json) · [规格](logic-protocol-spec.md#stage291-legacy-minimap)

<a id="stage290-legacy-material-compat"></a>

## stage290 实际元数据、像素、动画及WAVE覆盖

**图形**：六个有数据的槽共641,666行，独立模型比较完整850,000个元数据位和资源查找位；510次重复索引写入均在同组。144个物理RD样本的完整像素一致，136次资源库绘制比较最终槽位像素；8个低于1000的保留索引通过精灵API比较。重复索引259166的三份采样物理像素不同，资源库始终使用最后记录。[来源](../analysis/game-legacy-material-compat-v1/source-check.json)

**动画**：资源库建立2,520个最终动画条目；抽选六组中的36个定义，逐动作、图形基址、信号和附点比较16,280帧。该抽样不等于所有动画体或所有动作消费者均完成。**音频**：270目录编号对应260个实际WAV，Python wave与生产读取器完整比较14,451,010个float32 PCM样本：234个16位单声道22050Hz、各3个16位单声道44100／11025Hz、2个8位单声道11025Hz及18个8位双声道22050Hz。

材料缺少 `bin/PUK2/cutdat/23.cut`，七槽中的V2为空。结构、选定像素和PCM通过不能证明完整素材／客户端版本等价。[完整记录](validation.md#stage290-legacy-material-compat)

<a id="stage289-legacy-resource-archive"></a>

## stage289 游戏资源ZIP／ZIP64覆盖范围

**标准依据**：[PKWARE APPNOTE6.3.10](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT)，4.3.7、4.3.9、4.3.12、4.3.14–16及4.5.3。实现单盘存储／原始Deflate、ZIP64大小与偏移、可选64位结束记录、带／不带签名的32／64位描述符、前缀及注释。允许Python产生的本地／中央版本20／45差异，分别核对受支持版本及实际字段。UTF8外层目录可用，现有游戏相对路径仍为ASCII。[规格](../analysis/game-legacy-resource-archive-v1/implementation-spec.json)

独立工程预算：65,536条目、32MiB中央目录、32MiB单次资源读取、32MiB解码LRU、64KiB Deflate输入块。64位字段由两个uint32组合并验证JavaScript安全整数，不将偏移通过位运算缩成32位。单个943,552,437字节实际存储库按范围读取；真实稀疏夹具中标记位于4GiB之后。大型Deflate每次冷读取仍需扫描，建议用提供的存储型打包工具。

全条目存储读取与Deflate完成读取校验CRC；部分存储读取不承诺整条CRC。实际材料包2,549,171,845字节、1,072文件的全内容另由Python流式SHA-256／CRC校验。原创产品包各273文件，含260个独立音效路径和稀疏零填充，不含原游戏资源。[验收](validation.md#stage289-legacy-resource-archive)

移动 Safari 对同一 ZIP64 归档实际读取到起点 2,549,171,747。文件切片和范围应答均按安全整数保留偏移与长度。微信分段按同一 ZIP64 字节布局映射范围，持久化候选的普通分块写入已复现配额拒绝。分块元数据沿现有独立清单格式。 [移动端原始回执](../build/analysis/mobile-safari-resource-archive-v1/runtime.json) · [微信边界](architecture-and-milestones.md#wechat-sdk-archive-ordinary-quota)

微信分段重开使用原素材的两个连续字节区间。选择清单只记录可再次核验的路径、段顺序、长度和摘要，现有 ZIP64 目录、成员数据与偏移保持原字节。补选同一摘要的段可复用原清单身份。 [完整素材重开](architecture-and-milestones.md#wechat-sdk-segment-resume)

<a id="stage288-legacy-battle-audio"></a>

## stage288 音效目录与调用者提供的WAV

固定构造器定义270个编号、260个不同 `se/*.wav` 路径；记录由2字节编号、64字节路径及音量／音高／种类字节组成，步长70，FFFF结束。种类字段保留为来源元数据，本轮消费的是单次播放入口。目录元数据进入共享代码，游戏WAV未加入成果。[来源表](../analysis/game-legacy-battle-audio-v1/source-check.json)

路径相对于本次选择的Bin或 `binfolder:` 目录；复用现有8／16位、单／双声道PCM读取。音高偏移均为0，保留文件采样率；位置音效按左右独立增益复制PCM。源字节与临时样本在使用后清空。产品测试WAV为原创带标记PCM，21个音效文件用于本轮限定流程。[格式范围](../analysis/game-legacy-battle-audio-v1/implementation-spec.json)

<a id="stage287-legacy-battle-detached-rid"></a>

## stage287 分身零行与空图像

继续复用已有原创资源夹具，未新增档案格式或官方素材。父RID四行各产生一个单行分身；下一行只有槽号−1，其他载荷仍为零。2000使资源0／0／0应用到登记施法者，清除实际骑乘和附属，其身体资源变为0。[来源](../analysis/game-legacy-battle-detached-rid-v1/source-check.json)

软件帧层把图像索引0作为空图像；5738元数据消息与573b提示各有独立资源和位置，573b固定交给登记槽0。1,030张完整RGBA覆盖两个渲染选择器、四个分身、零图像与提示生命周期。可见选择器的空图像检查与另一选择器的8000过滤分别验证；原保留图像0的几何及原后端仍待验收。[验收](validation.md#stage287-legacy-battle-detached-rid)

<a id="stage286-legacy-battle-impact-skills"></a>

## stage286 四格结果、静态投射与动画偏移

复用既有档案格式，夹具追加原创100095／101111动画及 `0x565a`／`0x666c` 静态图像。原创动画5／6／7提供10001信号，用于区分116人物范围的动作7与其他资源的动作5；无需官方素材。97火花使用现有原创1adb6／1adb7，270次固定屏幕生成并由独立动画完成删除。[来源](../analysis/game-legacy-battle-impact-skills-v1/source-check.json)

目标记录为四格；RID在基记录后追加三行。106与低等级116的独立身体只复制一条基记录，其RID运行存储仍待验证。116等级9复制整个记录库，4隐藏身体沿436ee0复制RID后缀，已分别验收。初始不含RID的第四格仍有原栈字未知边界。

109烟雾起点已改用动画drawOffsetY/2。stage285原向量保持，另有两条修正轨迹374状态／40完整RGBA，旧上位套件继续通过。新增64种轨迹共1,206张完整RGBA含箭矢、火花、分身、缩放、后层、数值及背景震动；原渲染后端与x87位级一致仍待验收。[验收](validation.md#stage286-legacy-battle-impact-skills)

<a id="stage285-legacy-battle-upper-skills"></a>

## stage285 上位资源、元组与动画门槛

继续复用既有档案格式，夹具仅追加原创 `0x18aa7` 分身动作和数字样式0的原创图像。三字段目标与FF项保留旧第四格；108的线上数值位置与内部元组位置分别记录。图标15经既有工厂使用 `0x1926a`，不新增同名官方素材。[来源](../analysis/game-legacy-battle-upper-skills-v1/source-check.json)

分身动画5提供原回调所需信号，离场烟雾 `0x1adb4` 依次取速度百分比、角度、速度三个随机值，动画完成删除。474帧完整RGBA含缩放、残影、烟雾和背景震动；仍使用本地近邻采样，原后端与真机待验收。[验收](validation.md#stage285-legacy-battle-upper-skills)

<a id="stage284-legacy-battle-skill99"></a>

## stage284 图标动画和旧元组存储

六个图标资源为 `0x1926a..0x1926f`，动画索引与动作块沿现有档案格式追加；夹具只新增原创动作定义，复用既有原创像素和资源基线。253／274是声音事件键，不要求同编号动画。[来源](../analysis/game-legacy-battle-skill99-v1/source-check.json)

三字段状态记录和终止项保留旧第四格，含中断路径回归。图标尺度与位移逐步保留原浮点方程，352帧完整RGBA检查缩放及恢复；像素采样采用既有本地近邻策略，原版后端和真机渲染仍待验证。[验收](validation.md#stage284-legacy-battle-skill99)

<a id="stage283-legacy-battle-self-flags"></a>

## stage283 元组第四格与反应资源

线格式和档案格式未改。普通自身元组保留完整标志；可选RID资源与护卫槽的字段顺序沿用原格式。259类等级9标记经原 `0x434a90` 写 `[0,0,15]`，第四格延续现有存储；新增旧值 `0x11223344` 回归。[来源](../analysis/game-legacy-battle-self-flags-v1/source-check.json)

复用原创合成档案。100081的攻击信号进入局部反应并选动画9，HP保持70；正常资源允许命中。15种独立前缀共2,400个状态、120帧完整RGBA与源码／生成版一致，完整回调和实际平台证据另行区分。[验收](validation.md#stage283-legacy-battle-self-flags)

<a id="stage282-legacy-battle-self-guard"></a>

## stage282 护卫元组和原创像素参考

档案与线格式未改。护卫追加使用三字段元组，第四格延续现有存储；自身RID重合角色向量刻意保留 `0x11223344`，用于核对追加后的完整存储与游标。资源和消息消费者继续使用原有档案。[来源](../analysis/game-legacy-battle-self-guard-v1/source-check.json)

独立参考使用既有原创合成档案，不复制官方图像。四种重合角色／蓄力／RID场景逐回调比对1,280个状态，并核对32帧完整RGBA；49种源码／生成回调另验证元数据在未到达命中时不执行。有限前缀像素与实际平台渲染分别验收。[验收](validation.md#stage282-legacy-battle-self-guard)

<a id="stage281-legacy-battle-self-metadata"></a>

## stage281 RID资源与动画信号覆盖

消息、档案布局未改。RID三个字段通过既有资源解析器，并展开为原四元组结构，分别交给骑乘／附属资源消费者。67种原创回放覆盖资源替换、移除、槽20别名和连续记录；不包含原版图片或账号数据。[夹具](../analysis/game-legacy-battle-self-metadata-v1/fixture.mjs)

独立Python解析既有原创AnimeInfo／Anime：100041的八个方向攻击动画均无信号；100061为10001，100114为10002。因此换成100041后不会执行下一次命中，测试保留等待恢复；正例使用有信号的资源，验证后续结算与游标。组合消息和零值提示另核对顺序。[来源与动画契约](../analysis/game-legacy-battle-self-metadata-v1/source-check.json)

独立渲染探针选择档案中具备图像的基础资源100020，确认身体100061、骑乘114003、附属100050和五条提示均有有效几何并进入实际绘制；源码与生成包的640×480 RGBA逐字节一致。其余RID组合分别记录节点与游标证据。[验收](validation.md#stage281-legacy-battle-self-metadata)

<a id="stage280-legacy-battle-reentry"></a>

## stage280 第二场原创输入与移动参考

资源和消息格式未改。第二场使用原创合成角色、档案及 S／P／C／A／M 输入，与首场姓名和数值不同，用于检测旧身体、状态或回合残留；不保存原程序素材或账号数据。[夹具](../analysis/game-legacy-battle-reentry-v1/original-fixture.json)

地图为既有12×12原创输入，144个移动标志均为0。移动期望由独立 Python 参考重新求得，保留首场结束后摄像机与坐标，第二次点击的路径从5,3到8,3；参考终点512,192与两条精确请求一起记录。实际 TCP 断言核对请求字节及回场输入恢复。[来源核验](../analysis/game-legacy-battle-reentry-v1/source-check.json) · [验收](validation.md#stage280-legacy-battle-reentry)

<a id="stage279-legacy-battle-self-control"></a>

## stage279 蓄力效果与控制标志

消息和资源档案布局未改。低／高蓄力由动作113选择既有效果变体，分别写入的目标／施法者冻结状态在自身时落于同一身体；效果完成仍经原消费者处理。倒地粒子和散开反应使用现有资源及动作。[来源](../analysis/game-legacy-battle-self-control-v1/source-check.json)

161 种源码／生成回放使用原创合成档案，并复用同一资源库完成下一场组件回合。未据此声明原图像完整还原或真机渲染验收。[验收](validation.md#stage279-legacy-battle-self-control)

<a id="stage278-legacy-battle-self-special"></a>

## stage278 自身特殊结果使用已有字段与数字资源

没有修改 SKL 或图形档案布局。自身反射使用 HP 样式 6，自身治疗使用样式 5，`0x8000` 优先时不要求普通 HP 数字。类别 81 继续保留既有额外整数，并在后续动作 155 可运行时按样式 5 显示和更新 HP。[来源](../analysis/game-legacy-battle-self-special-v1/source-check.json)

161 种回放使用原创合成资源，覆盖结果位组合、别名及整数边界；源码／生成核心输出逐字节一致。原图形完整还原及实际设备渲染仍未验收。[验收](validation.md#stage278-legacy-battle-self-special)

<a id="stage277-legacy-battle-self-family"></a>

## stage277 自身结果数字资源与类别时序

消息及资源档案格式未增加字段。类别 81 继续消费既有额外结果字，类别 5 首条标志按生产者归一化。自身目标清除类别发生在普通 HP／MP 结果分派之前，因此技能 6 自身结果要按 HP 数字样式 6 预检，例如数值 12 使用资源 `243761`、`243762`，而非 MP 样式 3 的两字。[来源](../analysis/game-legacy-battle-self-family-v1/source-check.json)

新增测试使用原创合成档案；32 种源码／生成核心回放结果一致。已核对类别 258／259 九级动作及槽 20 别名，不据此声明原资源像素或真实平台完整验收。[验收](validation.md#stage277-legacy-battle-self-family)

# 本地资源格式：证据与解析边界

<a id="stage276-legacy-battle-self-pair"></a>

## stage276 自身成对记录不增加字段

普通成对物理记录仍使用四个结果字段，`0x10b` 包含基础命中／暴击、闪避和回避位。自身演员与目标经既有槽映射指向同一行；没有为别名建立虚构的目标身体。[来源](game-static.md#stage276-legacy-battle-self-pair)

原创回放复用现有 100114 身体和公共命中特效，覆盖三种类别、零值、闪避、回避、先后混排与槽 20 别名。产品 TCP 两种记录使用费用 3，随后 CFP 费用 2；最终施法者 HP58／MP5，远端目标 HP70 或64。[夹具](../analysis/game-legacy-battle-self-pair-v1/fixture.mjs) · [验收](validation.md#stage276-legacy-battle-self-pair)

<a id="stage275-legacy-battle-weather-targets"></a>

## stage275 重复天气效果复用原有资源

SKL401 使用槽／标志对，`0x80000` 为该生产器的重复效果位。每个效果元组仍为 `[0x1adfa,30,0,23]`，天气开启／关闭行仍为三字段 `[0,1,3]` 与 `[0,1,0]`，不修改接收格式或队列容量。[来源](game-static.md#stage275-legacy-battle-weather-targets)

原创夹具复用 100114 身体、已有咏唱信号、天气和效果资源，覆盖两种先后顺序、双／三重效果与交错目标。TCP 使用 40198、费用 3 和后续 CFP 费用 2。没有新增官方素材或占位效果；资源所有权及现有绘图继续由共享库处理。[夹具](../analysis/game-legacy-battle-weather-targets-v1/fixture.mjs) · [验收](validation.md#stage275-legacy-battle-weather-targets)

<a id="stage274-legacy-battle-pursuit-linked"></a>

## stage274 联动副本和保留图形编号

SKL400 线格式保持槽／标志对。设活动元组为 `[slot,flags,0,0]`，下一元组的槽为 opaque，则子效果为该原始元组、`[opaque,flags,0,0]`、`[opaque,flags,0,0]`、原始元组副本，以及 -1 终止标记。本轮没有将其他家族的内联资源格式套到 SKL400。[来源](game-static.md#stage274-legacy-battle-pursuit-linked)

原创目标、施法者、重复和双组场景复用已有 100114 身体、咏唱信号及挂载资源。联动产生的资源 0 通过动画的隐藏标记处理，不添加资源 0 图片、动画或占位几何。历史链式场景还覆盖资源 7，同属小于 1000 的保留资源。[夹具](../analysis/game-legacy-battle-pursuit-linked-v1/fixture.mjs) · [隐藏绘图核对](../analysis/game-legacy-battle-pursuit-linked-v1/assert-hidden.mjs) · [验收](validation.md#stage274-legacy-battle-pursuit-linked)

<a id="stage273-legacy-battle-pursuit-targets"></a>

## stage273 原创重复列表与容量边界

M 字段格式不变，SKL400 沿用技能号、费用、施法者及以 255 结束的槽／结果位列表。本轮保留列表中的重复项；原创回放使用 40098、费用 3、身体资源 100114 和已有咏唱信号资源。四种列表为重复远端、提示、交错和重复自身。[原创夹具](../analysis/game-legacy-battle-pursuit-targets-v1/fixture.mjs)

数值槽号 50 与 20 经既有映射指向同一槽 20，别名检查覆盖各自的动作与速度元组追加。49／50 条普通重复记录核对既有动作容量检查及拒绝时的身体原子性；未扩大 4095 字节接收上限。TCP 使用既有原创身体资源，M 后接一次 CFP，最终施法者 MP 为 5。[测试](../shared/tests/legacy-game-battle-pursuit-targets.test.mjs) · [验收](validation.md#stage273-legacy-battle-pursuit-targets)

<a id="stage272-legacy-battle-round-ack"></a>

## stage272 A/P 的原创回合夹具

沿用六字 P、双字 A、既有 C 和 M 格式，不增加协议字段。`A|20|0|` 指定回合 0 的槽 5；下一回合的相同掩码先存储，输入初始化时按回合决定是否应用。源码夹具使用身体资源 100080、骑乘资源 100060，TCP 使用既有 100060。P 部分转换验证保留后四个旧字。[原创夹具](../analysis/game-legacy-battle-round-ack-v1/fixture.mjs)

TCP 下一回合只保留 Queued0、Queued5，HP 90、MP 9，并发送候选席位 5、回合 1 的槽 5 标记和 `CFP|5|1`。回合号环绕使用完整 32 位字段；C 的 22 槽与 A 标记的 20 槽分开验证。[原版来源](game-static.md#stage272-legacy-battle-round-ack) · [验收](validation.md#stage272-legacy-battle-round-ack)

<a id="stage271-legacy-battle-character-queue"></a>

## stage271 C 环绕使用的原创消息

沿用既有 C 记录和原创施法、RID0 资源。源码夹具身体资源为 100080，槽 2 骑乘资源为 100060；TCP 使用既有 100060 身体资源。C 更新的槽 0、2 分别命名 Queued0、Queued2，HP 90、MP 9；缺席的槽 5、10 在实际消费时移除。环绕夹具再排入 Later 和 Last 两组不同生命与魔力值，以区别消息顺序。[原创夹具](../analysis/game-legacy-battle-character-queue-v1/fixture.mjs)

格式边界沿用四槽环、4095 字节接收上限和既有名称界限，本轮没有增加协议字段。排队三条记录的验证覆盖跨回合及读指针环绕；原版四条未读导致读写相等的行为不是可靠消息容量保证。[来源](game-static.md#stage271-legacy-battle-character-queue) · [验收](validation.md#stage271-legacy-battle-character-queue)

<a id="stage270-legacy-battle-exit-rid0"></a>

## stage270 致死与成对角色的合成资源

沿用原创施法、死亡粒子与 Y=-16 附着点资源。反射字段 `A|10061|46` 表示 70 点致死结果，`A|810061|46|186DC|0|0` 增加内联坐骑卸载。B 占用施法槽的夹具使用零 HP、倒地标志及已有死亡动画，完整回放覆盖第 448 个回调。[原创资源](../analysis/game-battle-casting-v1/original_assets.mjs) · [下降资源](../analysis/game-legacy-battle-rid0-ownership-v1/fixture.mjs) · [验收](validation.md#stage270-legacy-battle-exit-rid0)

<a id="stage269-legacy-battle-reflected-rid0"></a>

## stage269 反射内联资源夹具

沿用原创资源 100060 的施法信号和资源 100081 的 Y=-16 附着点。目标字段 `A|810001|C|186DC|0|0|` 将反射、内联资源及 12 点结果组合，回程第二资源为零时卸载坐骑。`186DC|186DC|0` 提供保留骑乘的对照。暂存动画对象保留已有资源与动画状态。[原创资源](../analysis/game-battle-casting-v1/original_assets.mjs) · [回放验收](validation.md#stage269-legacy-battle-reflected-rid0)

<a id="stage268-legacy-battle-casting-rid0"></a>

## stage268 动作 6 的动画信号夹具

原创合成资源 100060 的动作 6 第 1 帧信号为 10001，资源 100080 的动作 6 提供无信号对照，既有 100114 用于附带 RID0 接口对照。B 继续使用合成资源 100081 的 Y=-16，供跨多帧下降与投射物延迟命中核验。沿用现有资源读取与字段解释。[动作夹具](../analysis/game-battle-casting-v1/original_assets.mjs) · [下降夹具](../analysis/game-legacy-battle-rid0-ownership-v1/fixture.mjs) · [回放验收](validation.md#stage268-legacy-battle-casting-rid0)

<a id="stage267-legacy-battle-rid0-flight"></a>

## stage267 下降几何与同槽夹具

下降消费当前 B 资源的动作 0 附着点。沿用合成资源 100081 的 Y=-16，计数 0 到 8 的下降值为负，计数 9 到达落地。独立同槽回放还沿用历史 100121 夹具及原字段，前 103 帧与历史归档一致，随后验证实际落地。[算式](../analysis/game-legacy-battle-rid0-flight-v1/source-check.json) · [独立回放](../analysis/game-legacy-battle-rid0-flight-v1/reference.json)

<a id="stage266-legacy-battle-rid0-ownership"></a>

## stage266 RID0 的两个资源和下降偏移

RID0 变体 0 的 21 字段保留 A、B 的名称、资源、状态和数值。B 的动作 0 动画附着点 Y 参与下降完成判断。本轮在原创合成 `Anime.bin` 的资源 100081 动作 0 帧写入 Y=-16，形成 B 已登记、A 尚未登记的可观察窗口。[原版字段和坐标](../analysis/game-legacy-battle-rid0-ownership-v1/source-check.json) · [合成夹具](../analysis/game-legacy-battle-rid0-ownership-v1/fixture.mjs)

<a id="stage265-legacy-battle-rid0-interruption"></a>

## stage265 尾随 RID0 的字节边界

尾随 RID0 变体 0 使用既有的 21 字段表达两组角色数据和附件。SKL72 的中断游标取自该记录前的原始字节，保留大小写和实际分隔符。合成对照包含 `F|FF|RID|`、`2|FF|RID|` 与 `2|FF||RID|`，可达性随固定四字节扫描的位置变化。资源及队列容量按两具待注册身体和原 A 的追加动作预检。[源核验](../analysis/game-legacy-battle-rid0-interruption-v1/source-check.json) · [本地回放](../analysis/game-legacy-battle-rid0-interruption-v1/validation.json)

<a id="stage264-legacy-battle-rid0-receive"></a>

## stage264 尾随 RID0 的两组角色数据

尾随 RID0 按既有 21 字段解析两组名称、资源、状态与数值。动作 221 的元组使用 `[a, 0, a, b]`，新 A 的附件在交接时按记录装入。主段内联 RID 的三资源字仍由动作 14 消费，测试覆盖两者同回合出现以及 A、B 相同的写入顺序。[固定样本](../analysis/game-legacy-battle-rid0-receive-v1/source-check.json) · [回放](../analysis/game-legacy-battle-rid0-receive-v1/validation.json)

<a id="stage263-legacy-battle-following-results"></a>

## stage263 内联 RID 的资源字和队列范围

`0x800000` 在现有物理结果中引入三个资源数值。原版生成一条基本结果、两条资源元组和一条结果副本。回放依次取骑乘基体、角色资源和附件资源，并用 `0x2000` 决定元数据归属。原创夹具覆盖资源切换、一次交付、离场及后续命中。尾随 RID0 由独立记录表示，受击交接待验证。[源核验](../analysis/game-legacy-battle-following-results-v1/source-check.json) · [专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage262-legacy-battle-late-recipient"></a>

## stage262 动作与受击元组的位置

后续配对读取既有字段。先到结果的归属使用动作和元组的绝对位置，命中动画沿用普通身体图形与资源。带附加 RID 的解码记录在私有核心对象上保存来源标记，区分完整普通记录与抽出的主段。原创夹具覆盖两种入口、两次命中、离场替换以及附带段的规划边界。[源核验](../analysis/game-legacy-battle-late-recipient-v1/source-check.json) · [专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage261-legacy-battle-independent-following"></a>

## stage261 后续配对与身体引用

后续配对继续读取已有的攻击者槽、目标槽、标记和数值。规划从已产生的元组中核对指向身体的引用，结合队列首项识别尚未起步的攻击者。原创夹具分别覆盖独立目标、护卫等待和存在后续受击引用。归位沿用已有身体动作 11、38 及其资源。[源核验](../analysis/game-legacy-battle-independent-following-v1/source-check.json) · [专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage260-legacy-battle-missing-lookahead"></a>

## stage260 后续目标槽与四字段转向

前瞻读取原 M 中的攻击者、目标和标记，连续段受 `0x1010` 限制。零结果转向元组按目标槽、0、0、0 保存。后续目标字段可存在于网络记录中，而对应身体已由 PLV 移除。原创资源夹具用现有退场图形覆盖首段和后续护卫的这条路径，并核对计划中没有缺席身体的队列。[源核验](../analysis/game-legacy-battle-missing-lookahead-v1/source-check.json) · [夹具与测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage259-legacy-battle-following-strikes"></a>

## stage259 每条后续记录的结果元组与蓄力图形

普通后续配对沿用 M 中的攻击者、目标、标记和数量字段，规划时记录每条结果元组的消费位置。零结果转向元组仍由 3 和 72 单独推进。动作 113 沿用按标记选择的蓄力资源，取消时结束实际所属的子对象。原创夹具验证前一蓄力取消后，下一次蓄力以新子对象完成。[源核验](../analysis/game-legacy-battle-following-strikes-v1/source-check.json) · [专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage258-legacy-battle-repeated-protection"></a>

## stage258 后续目标的四字段转向元组

原版的后续目标由 M 的数值记录查出。零结果的转向元组是 `[目标槽,0,0,0]`，以 16 字节步长存储，和三字段的护卫交接元组分开消费。共享回放按 3、72 与返回回调的顺序安排元组；资源夹具沿用原创动画和图像接口。测试覆盖一个与两个零结果转向、后续攻击及其蓄力中换人。[源核验](../analysis/game-legacy-battle-repeated-protection-v1/source-check.json) · [专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage257-legacy-battle-guard-wait"></a>

## stage257 护卫元组和零伤害的本地回放

回放沿用原有的动画与图像资源接口及 M 的十六进制数值字段。护卫的三字段写入包含目标槽、结果标记和数量，底层槽距为 16 字节，第四字段保留既有槽内容。共享实现仅在限定的 SKL72 队列中按消费者先后安排护卫元组。测试使用原创的动作与资源夹具，覆盖零外层和零内层结果及护卫槽位互换。[源证据](../analysis/game-legacy-battle-guard-wait-v1/source-check.json) · [专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage256-legacy-battle-skl113-wire"></a>

## stage256 SKL113 嵌套结果和数值扫描

SKL113 的外层配对带低位标记时，执行端读取嵌套目标、标记、数量，以及标记要求的可选字段。预读把嵌套标记当作槽号，因此示例中的 `0x201` 护卫标记和 `0x800001` 内联资源标记会触及槽位边界。数值按大写十六进制读取为有符号 32 位，夹具中的 `FFFFFFFF` 保留为 −1。两个读者对同一字段的解释分别记录。[源回放](../analysis/game-legacy-battle-skl113-wire-v1/source-check.json) · [通信规格](logic-protocol-spec.md#stage256-legacy-battle-skl113-wire)

<a id="stage255-legacy-battle-guard-alias"></a>

## stage255 同槽自身元组与提前退场的标记

SKL266 的护卫槽仍由结果标记 `0x200` 决定是否读取。同槽自身结果的内部队列保存攻击者与结果两个元组，已有 RID 路径另消费三个元组。嵌套护卫提前退场时，已提交队列内指向该护卫的两个槽字段置为 `-1`，动作 72 和 232 分别消费所在位置。新增验收使用原创资源和通信夹具。[通信规格](logic-protocol-spec.md#stage255-legacy-battle-guard-alias) · [专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage254-legacy-battle-guard-departure"></a>

## stage254 飞行护卫元组

固定旧版从施法者自身终止元组读取护卫位，推进后从下一元组取槽，并向当前飞行物追加 `[护卫槽, 0, 0, 0]`。护卫动作 216 仍读取已保存的攻击者元组和最后自身结果。原版动作 217 的转向和减速常量已对照文件字节，平台画面使用原创资源夹具。[源证据](../analysis/game-legacy-battle-guard-departure-v1/source-check.json) · [验收](validation.md#stage254-legacy-battle-guard-departure)

<a id="stage253-legacy-battle-guard-release"></a>

## stage253 自身 RID 与护卫元组

固定旧版的护卫放行依赖已解析的目标槽和角色动作队列。SKL266 自身 RID 消费三个资源字，保存首个解析值。尾部另外两个值对应同一执行分支的外部 RID。原版进入该分支前的栈值待验证。仅自身护卫的 TCP 夹具使用原创动画与资源字节。[源证据](../analysis/game-legacy-battle-guard-release-v1/source-check.json) · [验收](validation.md#stage253-legacy-battle-guard-release)

<a id="stage252-legacy-battle-physical-boundaries"></a>

## stage252 无飞行目标的素材依赖

终止元组只触发施法动画与已有结算，飞行物素材由实际目标元组驱动。SKL266 自身回复仍用动作 216 和原数字样式。自身结果的可选 RID 继续依赖有证据的外部 RID 字段。验收使用原创动画、场景和数字素材。[源证据](../analysis/game-legacy-battle-physical-boundaries-v1/source-check.json) · [专项](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage251-legacy-battle-physical-registry"></a>

## stage251 护卫槽与素材依赖

物理配对的重定向需要当前护卫角色体及其素材上下文。正变体中被覆盖或未进入 SKL266 变体 2 结算的自身护卫字段只保留预约。活动护卫仍沿原有角色体、动作和图形校验。退场验收使用原创 `0x5734` 消息和本机资源夹具。[源证据](../analysis/game-legacy-battle-physical-registry-v1/source-check.json) · [专项](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage250-legacy-battle-assist-terminator"></a>

## stage250 协作者 FF 后的独立角色记录

协作者 `FF` 紧随施法者字段结束 SKL98。后面的 `RID0` 即使有死亡标记，也保留自身的槽和依赖掩码。原创夹具核验独立记录及已交换的状态 32 伙伴阵位，沿用既有角色资源格式。[源证据](../analysis/game-legacy-battle-assist-terminator-v1/source-check.json) · [专项](../shared/tests/legacy-game-battle-missing.test.mjs)

<a id="stage249-legacy-battle-physical-missing"></a>

## stage249 物理中断前的元组

配对与正变体沿用既有 `M` 格式。SKL260 链目标缺席前只写外层元组及准备动作。SKL266 变体 2 的释放尾部复用已保存自身结果的既有元组顺序。三字 RID 及附带 RID0 保留各自的记录边界。专项用原创资源核对已保存回复回放、护卫尾部队列和附带 RID0 中断。[源证据](../analysis/game-legacy-battle-physical-missing-v1/source-check.json) · [专项](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage248-legacy-battle-family-missing"></a>

## stage248 中断前的结果元组与资源

**事实**。常规状态技保留各自目标字段宽度。施法与 SKL82 的标志 `0x800000` 仍占三个资源字。共享计划核对完整记录边界，仅对缺席前的已处理目标解析资源与生成元组。施法反射继续复用最后反射者的资源元组，附带 RID0 随中断记录丢弃。反射与反馈队列用原创图元和资源验证。[源证据](../analysis/game-legacy-battle-family-missing-v1/source-check.json) · [专项](../shared/tests/legacy-game-battle-family-missing.test.mjs)

<a id="stage247-legacy-battle-missing"></a>

## stage247 中断时的角色与阵位

变体 7 已交换的角色体继续使用交换后的槽号及附属对象锚点。归位动作 11、38 使用既有阵位和动画，测试用原创角色与图元核验同组续接和换位后的阵位。缺席后附在当前记录内的 RID0 随该条中断记录丢弃。原版从异常游标触发的附属对象变化待验证。[源证据](../analysis/game-legacy-battle-missing-v1/source-check.json) · [原创夹具](../analysis/game-legacy-battle-status-slots-v1/original_assets.mjs)

<a id="stage246-legacy-battle-status-assist"></a>

## stage246 协作者阵位和效果资源

**事实**。变体 12 依据协作者槽所在侧读取阵位表，走到 `[188,203]` 或 `[449,336]`，使用提示声音 `0x120` 和放大结束时的效果 `0x1ae4a`。变体 13 先走到 `[318,270]`，动作 133 使用 `0x1ae4d`，目标回复动作 146 使用 `0x1ae08`。动作 88 以速度 10 飞行，在距离小于 20 时触发目标，最终越过画面外边界离场。测试使用原创资源，已验证绘制、关联对象和数值变化。**待验证**。原版位图和实际声音。[源证据](../analysis/game-legacy-battle-status-assist-v1/source-check.json) · [原创夹具](../analysis/game-legacy-battle-status-slots-v1/original_assets.mjs)

<a id="stage245-legacy-battle-status-position"></a>

## stage245 换位阵位与资源

**事实**。固定 PE 的 `0x5337b0` 是 22 个阵位索引，`0x533808` 的每个表项为两对有符号 32 位坐标。逐槽比对后沿用共享阵位表。选中角色排入动作 78、11，声音编号为 `0xd2`，移动速度为 3、倍率为 100。状态 32 的配对角色保留此前阵位。测试复用原创动画和位图，核验阵位、画面和声音事件编号。**待验证**。原版动画输出和实际声音。[阵位证据](../analysis/game-legacy-battle-status-position-v1/source-check.json) · [原创资源夹具](../analysis/game-legacy-battle-status-slots-v1/original_assets.mjs)

<a id="stage244-legacy-battle-status-slots"></a>

## stage244 放大与缩小退场的资源

变体 6 使用角色动画 9 和 5，提示资源为 `0x5784`，声音编号为 `0x120`、`0xa8`。变体 8 复用缩小效果，声音编号为 `0xcd`。测试在原创图元目录补入 `0x5784` 的映射，并用现有合成动画和位图核验绘制。原版位图及实际声音仍待验收。

[资源来源](../analysis/game-legacy-battle-status-slots-v1/source-check.json) · [原创夹具](../analysis/game-legacy-battle-status-slots-v1/original_assets.mjs) · [验收](validation.md#stage244-legacy-battle-status-slots)

<a id="stage243-legacy-game-stream"></a>

## stage243 本地游戏流格式

`moli.loopback.v3` 运行配置在启用游戏路径时提供布尔值 `gameStream: true`。游戏桥以既有 JSON 控制帧确认建立、写入序号、EOF 及失败。二进制帧是最长 65,536 字节的游戏 TCP 片段，协议包可跨片段。明文 `3$} nr ` 使用同一会话编解码和外层帧。验证材料使用原创启动配置、角色及场景资源。

[通信规格](logic-protocol-spec.md#stage243-legacy-game-stream) · [验收](validation.md#stage243-legacy-game-stream)

<a id="stage242-legacy-battle-status-variant"></a>

## stage242 SKL98 状态及数值资源

共用变体继续使用本地动画和图元目录。前摇复用角色动作 8、9，并发出 `0xa3`、`0xab`、`0xae` 音效事件。咏唱按技能等级从 `0x1ade8` 起选，六种状态图元从 `0x1adfb` 起选。动作 199 的数值图元沿用 `0x52d450` 表，专项夹具为样式 0 和 4 补充原创数字图元。音效文件映射和输出继续取证。

[资源证据](../analysis/game-legacy-battle-status-variant-v1/source-check.json) · [验收](validation.md#stage242-legacy-battle-status-variant)

<a id="stage241-legacy-battle-summon"></a>

## stage241 SKL93 角色与效果资源

新角色资源沿用旧版角色资源分级和本地动画目录。施法者动作 6 的帧信号触发目标动作，目标继续使用原有入场效果及缩放回调。测试复用原创动画、图元和地图资源，覆盖信号 10001、两个角色资源编号和入场效果。原版素材和渲染后端的效果仍待验证。

[资源与动作的静态证据](../analysis/game-legacy-battle-summon-v1/source-check.json) · [验收](validation.md#stage241-legacy-battle-summon)

<a id="stage240-legacy-battle-city-return"></a>

## stage240 战斗回城的画面和音频

退场复用最后一次提交的 640 × 480 RGBA 战斗画面及 type14。转场接管时保留当前已提交画面，含已清空的画面。目标地图沿用现有缓存和资源选择，入场继续使用 type15。回城音效和战斗音乐渐隐沿用原 WAV 读取路径。[画面与曲目](logic-protocol-spec.md#stage240-legacy-battle-city-return)

<a id="stage239-legacy-city-return"></a>

## stage239 回城的地图与画面

换图仍通过 `TfD` 与已识别的地图内容读取目标地图及切片。转场读取现有 640 × 480 RGBA 画面，type15 按行覆盖并在 49 帧后恢复完整图像。回城提示复用 `se/cgsys09.wav`。[行复制向量](../analysis/game-legacy-city-return-v1/original-vectors.json) · [WAV 范围](#stage236-legacy-audio)

<a id="stage238-legacy-battle-alternate-exit"></a>

## stage238 返回选服的资源

主动回选服复用最近提交的 640 × 480 RGBA 画面、已有 type14 参数以及音效 60 对应的 `se/cgsys09.wav`。两种页面沿用本轮已选资源和音频开关。图像或音效缺失时，会话仍可完成回选服握手。[WAV 读取范围](#stage236-legacy-audio) · [退场规格](logic-protocol-spec.md#stage238-legacy-battle-alternate-exit)

<a id="stage237-legacy-music-phases"></a>

## stage237 选服和战斗曲目

选服曲为 `bgm/cgbgm_t0.wav`。战斗选曲使用 `cgbgm_b0.wav` 至 `cgbgm_b3.wav`，以及 `puk2_battle1.wav`、`puk2_battle2.wav`、`puk3_battle1.wav`、`puk3_battle2.wav`。这些路径相对于启动材料选定的资源目录。源表中各曲目均使用阶段 236 的 WAV 循环读取方式。[曲目证据](../analysis/game-legacy-music-phases-v1/source-check.json) · [WAV 读取范围](#stage236-legacy-audio)

<a id="stage236-legacy-audio"></a>

## stage236 独立 WAV

固定旧版使用资源目录下的 `se/cgsys09.wav` 和 `bgm/*.wav`。目录默认为 `Bin`，跟随 `binfolder:`。合并后的参数含 `soundoff` 或 `musicoff` 时分别停用音效或音乐。另一个安装包中的同名音效归档成员与该包的独立 WAV 逐字节一致。[路径及归档核对](../analysis/game-legacy-audio-v1/source-check.json)

读取器支持单声道或双声道的 8 位无符号和 16 位有符号 PCM，跟随 RIFF 偶数填充。循环模式要求 `smpl` 中有完整的正向循环起止帧，结束位置按排除端处理。读取上限为音乐 16 MiB、退场音效 256 KiB。PCM 末尾的不足一帧字节舍去。

本机安装材料中有两首 WAV 的 RIFF 长度大于文件长度。读取器要求必要块同时位于文件和 RIFF 边界内，允许其后的残缺元数据。共核验 44 个文件和 45 种路径及模式组合，回执保存哈希与元数据。[资源核验](../analysis/game-legacy-audio-v1/material-check.json)

<a id="stage233-legacy-frame-startup"></a>

## stage233 旧版普通入场 JSON

v1 和 v2 的固定旧版启动材料均可将 `context` 设为 `"legacy-se6000-37c4"`。这一字段可替换整个移动、输入、显示、帧与角色对象。既有对象也可继续使用。

v2 从所选资源根目录读取固定 SHA-256 的旧版 `cg_se_6000.exe`。使用 `commandTailHex` 时按既有边界读取同层 `Config.dat`。来源、映射字节、资源参数或命令尾仍由启动材料提供。

[模块接口](module-interfaces.md#stage233-legacy-frame-startup) · [核验](validation.md#stage233-legacy-frame-startup)

<a id="stage232-legacy-ordinary-context"></a>

## stage232 旧版启动材料的普通移动和输入

固定 `legacy-se6000-37c4` 的 v1 与 v2 启动 JSON 可以在 `context.movement`、`context.input` 使用字符串 `"legacy-se6000-37c4"`。两个字段分别选择，可与已有显式对象混用。源移动的时段来自会话数据，源输入根据当前场景、对话和移动状态求值。

启动材料仍提供对应的账号映射、资源参数、帧和角色上下文。显示字段可使用阶段 231 的源选择。

[显示配置](#stage231-legacy-display-startup) · [接口](module-interfaces.md#stage232-legacy-ordinary-context) · [验收](validation.md#stage232-legacy-ordinary-context)

<a id="stage231-legacy-display-startup"></a>

## stage231 固定旧版显示材料

固定 `legacy-se6000-37c4` 启动 JSON 可将 `context.display` 写成字符串 `"legacy-se6000-37c4"`。同一选择可用于 v1 和 v2。画幅和投影中心由固定样本给定。运动、帧状态、角色和输入上下文仍按各自结构提供。

显示也可用六字段对象给出。提供 `initialCamera` 坐标对会使用显式首相机。使用 `null` 则以场景位置初始化并同步位置修正。

[固定样本证据](../analysis/game-legacy-display-startup-v1/source-check.json) · [验收](validation.md#stage231-legacy-display-startup)

<a id="stage230-legacy-config-startup"></a>

## stage230 v2 启动材料的命令尾模式

固定 SE 与 Item 从 `Config.dat` 可见首行和命令尾的合并文本取得 `3Ddevice:`，设备选择使用有符号低字节。设备查询或准备失败时尝试向 `data\update.dat` 写单字节 `1`。已接受档位与请求失配时尝试写实际档位的 ASCII 十进制文本，长度取字符串长度，省略结尾 NUL 和换行。两版均请求创建或截断文件，尝试写入后关闭句柄。打开失败和写入返回后都继续更新内存档位。表面格式前检失败提示并把内存档位置 1。运行时覆盖来源及文件后续读取仍待证。 [来源与适用范围](game-static.md#legacy-render-device-preparation)

固定 SE 的纹理探测传入宽高各 256 及标志 `0x800`。表面构造按所选后端设置描述符，后续纹理绑定和查询使用第 0 层。 [表面构造与探测](game-static.md#legacy-render-recovery-probe)

`moli.legacy-game-startup.v2` 的固定旧版身份、映射和上下文字段沿用阶段 229。资源字段选用已合并的 `resourceParametersHex`，或改用 `commandTailHex`。后者为 WinMain 命令尾的十六进制字节。空字符串表示空命令尾。

文件夹或 ZIP 根目录可放 Config.dat。读取首行并保留 LF，CRLF 归一为 LF，Ctrl+Z 和 NUL 截止可见内容。最多取 256 个原始字节以识别末尾 CRLF，首行至多 255 个文本字节。文件存在时合并上限为 5,119 字节，缺失时命令尾沿用 32,767 字节上限。随后使用已有 ASCII 和相对资源路径检查。

[上一阶段的固定模块身份](#stage229-legacy-startup-materials) · [验收](validation.md#stage230-legacy-config-startup)

<a id="stage229-legacy-startup-materials"></a>

## stage229 v2 游戏启动 JSON

`schema` 为 `moli.legacy-game-startup.v2`，其余键为 `sourceProfile`、`sourceSha256`、`mappingHex`、`resourceParametersHex`、`context`。旧版 profile 为 `legacy-se6000-37c4`。所选根目录的 `cg_se_6000.exe` 必须为 1,569,280 字节且 SHA‑256 与固定旧样本一致。沿用资源端口的路径归一化和别名检查。

网页选择文件夹，微信选择 ZIP，原件在本地只读。导入材料仍受 64 KiB 限制。v1 的 `moduleDigestHex` 是 32 个 ASCII 字节的十六进制编码，也接受既有空值规则。v2 由所选文件计算这 32 字节。

[固定样本身份](../analysis/game-legacy-startup-materials-v1/source-check.json) · [读取接口](module-interfaces.md#stage229-legacy-startup-materials)

<a id="stage228-wechat-special-dialogs"></a>

## stage228 对话图像与外观预览

**事实**。普通图文资源使用共享解析器提取的资源 ID、方向和局部坐标。普通位图尺寸 448×240，宽窗口为 576×432。图文确认使用共享的单图位置，外观预览沿用网页的 280×112 资源布局。绘制仅使用当前已选资源包。

**事实**。缺资源时保留文字和对话选择。本轮通过本机 Canvas 测试端口取得普通图文、图文确认与外观预览的 RGBA 帧，并测试宽文字窗口缺图。

**待验证**。原版复合外观渲染、NPC 肖像、现行资源与微信实机显示。

[固定样本](game-static.md#stage228-wechat-special-dialogs) · [运行说明](../wechat/README.md#stage228-wechat-special-dialogs)

<a id="stage227-wechat-family-board"></a>

## stage227 家族名称、成员与留言格式

**事实**。家族和会馆名的编辑上限是 24 编码字节，称号与家族兽名称的编辑上限是 16 字节。家族接收端可显示 32 个称号槽和 200 个成员槽，成员显示两个姓名字段与称号。

**事实**。留言板每页最多四个来源行。显示作者、文字与本地日期，保留原行号给删除动作。发布使用当前文本编码，换行转为 CR，沿用共享核心的两行和 140 总字节限制。本轮独立夹具核对了 Windows-936 中文、内层转义、换行和源行号。

**待验证**。原版留言图像、NPC 图像和实际设备显示。

[固定样本](game-static.md#stage227-wechat-family-board) · [运行说明](../wechat/README.md#stage227-wechat-family-board)

<a id="stage226-wechat-storage-trade"></a>

## stage226 仓储和交易文字与记录

**事实**。仓储全量记录使用已有的 20 个物品槽、5 个宠物槽与金币余额。微信显示物品名称、数量、说明及宠物名称。交易显示物品名称、别名、数量、说明、宠物名称、昵称和技能。

**事实**。显示沿用游戏配置的文本编码。本轮 TCP 夹具使用 ASCII，核对了候选名称的转义分隔符、物品说明、宠物技能和槽位次序。

**待验证**。真实资源规模、对应图标和原版布局在设备上的表现。

[固定样本](game-static.md#stage226-wechat-storage-trade) · [运行说明](../wechat/README.md#stage226-wechat-storage-trade)

<a id="stage225-wechat-map-services"></a>

## stage225 治疗与技能服务文字

**事实**。微信沿用共享解析器分解治疗行、人物技能描述和宠物报价、目标与栏位，并用当前构建选择的 ASCII 或 Windows-936 解码。本轮 TCP 夹具使用 ASCII，核对治疗名中的转义分隔符、技能描述、容量和显示顺序。

**待验证**。技能师范肖像、图文窗口的图像与排版、音效以及实际素材在微信设备上的表现。此阶段图文对话验收覆盖既有文字选择与缺图时的文字。

[固定样本](game-static.md#stage225-wechat-map-services) · [运行说明](../wechat/README.md#stage225-wechat-map-services)

<a id="stage224-wechat-inventory-shop"></a>

## stage224 物品说明与商店文本

**事实**。微信显示共享解析器提取的物品名称、说明、报价和商店说明，使用该构建的 ASCII 或 Windows-936 编码。商品别名、兑换物名称、回包更新和槽位版本沿用已有格式。资源加载沿用游戏页既有的本地选择与解析。

**待验证**。原版商店图像、音效与实际素材规模下的设备表现。

[格式消费者](game-static.md#stage224-wechat-inventory-shop) · [运行说明](../wechat/README.md#stage224-wechat-inventory-shop)

<a id="stage223-wechat-creation"></a>

## stage223 建角名称与外观编号

**事实**。微信表单使用该游戏构建选择的 ASCII 或 Windows-936 编码。共享草稿按编码后 16 字节校验名称，保留既有保留字节、重复名称和点数规则。表单显示共享计算使用的外观选择与详情编号。

**待验证**。真实素材下的原版人物预览和本地 `profile.dat` 生命周期。

固定 Item 主状态 4 会在提交前初始化选中槽的 `0x828` 字节资料记录，再尝试以 `wb+` 写所选配置目录的 `profile.dat`，请求整块为 `0x1050` 字节。真实写入、失败和重开继续沿创建用例验收。 [资料时点和原字节](game-static.md#fixed-item-character-creation)

固定 Item 与 SE 的名单共用 148 字节槽记录。字段 2 为偏移 24 的外观值，字段 17 为偏移 80 的预览变体，字段 16 为偏移 84 起最多 63 字节的文本。已有角色的外观值小于 30,000 时，准备预览会写 33,100 再计算图形编号。 [字段布局与素材判定](game-static.md#fixed-item-character-roster)

[建角规格](logic-protocol-spec.md#stage223-wechat-creation) · [构建说明](../wechat/README.md#stage223-wechat-creation)

<a id="stage222-wechat-page"></a>

## stage222 微信本次启动和资源导入

**事实**。启动文件使用 `moli.legacy-game-startup.v1`，页面接收 1 至 65,536 字节的 ASCII JSON，允许 UTF-8 BOM。沿用固定样本档案、十六进制字段、显式上下文和资源参数校验。资源选择沿用现有 ZIP 上限、CRC、规范路径和目录冲突检查。

**事实**。显式选入 ZIP 与登录页交接副本均归当次游戏页所有。按范围读取独立字节，结束时清空宿主持有的启动和资源副本。构建中的测试配置和原创夹具分别存放，五套生成包只携带应用代码、配置及页面文件。

**待验证**。微信消息文件选择和真实资源规模在真机上的内存与生命周期表现。

[页面构建](../wechat/README.md#stage222-wechat-page) · [阶段验收](validation.md#stage222-wechat-page)

<a id="stage221"></a>

<a id="stage221-chat-presentation"></a>

## stage221 聊天姓名、气泡断行和公告文本边界

**事实**。原版黑名单为 data\blacklist_%d.txt，表从 0x584120 开始，每行 17 字节，最多 100 行。网页保存 1 至 16 字节姓名的十六进制表示，避免更换文字编码时改写其原始字节。

**事实**。原版 0x445460 检查气泡第一行 40 字节边界，遇双字节跨界时截到 39 字节。0x534224 的角色高度表和 0x538904 的字型宽高表与共享现有表一致。公告按 0x443f20 的 287 字节上限取完整字符。

**待验证**。气泡背景 0x3be84 和发言图标 0x573f 的原版素材、字形像素和音效。网页用本机字体和独立绘制。

[本轮计划](../analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-chat"></a>

### 前序检查点 · 地图聊天字节容量和历史存储

**事实**。0x55bec8 的单行输入描述在偏移 0x21c 与 0x220 分别记录 1 行和 76 字节。0x56bd40 的四个转义对对应换行、逗号、竖线与反斜杠。网页输入以编码后的字节数校验。

**事实**。0x444f20 的环形区为 512 个、每条 308 字节的记录。颜色字段位于文字起点之后 292 字节。共享历史按最多 291 字节正文保留终止空间，超出容量的记录不进入历史。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 成员 ID、称号槽与邻格方向表

**事实**。成员 ID 取八字段名单中的第二字段，当前称号取第八字段。称号选择从实际槽 1 起，0x496c25 读取槽 1 起的名称数组，0x496b4f 把滚动偏移限制为 21，十行可覆盖槽 1 至 31。共享层仅展示已有名称的槽。

**事实**。0x53d4d4 的八组短整数组从北开始顺时针排列，与共享层原有邻格计算一致。邀请、移除和称号分配只编码整数，界面复用上轮名单中的姓名字节。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 家族资料文本与名单容量

**事实**。固定样本 0x55c598 一组输入描述的前两项为单行、24 字节，其余为单行、16 字节。入站资料和称号可到 40 字节，名单两段名各 16 字节。称号表 32 槽、步幅 48，名单 200 槽、步幅 124。

**事实**。共享层按字节长度校验改名，拒绝纯 ASCII 空格或样本的双字节空白 81 40，拒绝独立逗号、竖线和反斜杠。仅修改权限时沿用收到的称号字节。名单的嵌套字段先拆外层，再对两段名分别反转义。

**待验证**。第二段名的业务含义和未展示字段。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 家族兽文本、输入容量与饲料槽记录

**事实**。0x49f380 读取两个以竖线分隔的字段，各限制 1,023 字节并做内部解码。第二字段按换行和双字节边界以 30 字节折行，0x49f2f0 一次投影九行。网页把这些行放入可滚动区域。

**事实**。0x55c368 的输入描述经 0x46cf90 进入文本控件。0x55c584 和 0x55c588 对应一行、16 字节。名称按编码后字节数校验。饲料箱沿用仓储的物品编号、名称、数量和说明。

**待验证**。原版图形、快捷操作和动态拖放层。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 仓储记录与可操作字段

**事实**。物品首字段正图形编号表示占用，第二字段为数量。投影使用名称和说明，名称解码前的字段至多读取 1,023 字节，转义处理后限制 28 字节。说明最多读取 1,023 字节并按 32 字节至多 16 行展示。

**事实**。宠物记录第二字段非负表示占用，名称限制 16 字节。共享层在提交一组增量前检查槽号、行数与数值，非法记录保留先前快照。宠物其他字段及原版图标布局待补齐。

[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 专用对话的字节边界和图形坐标

**事实**。0x1e 的标题读取上限 21 字节，说明上限 256 字节，显示至多五行且每行 20 字节。0x23 使用 448×240 源窗口，文本宽 46 字节。输入分配读取 0xc1e858 的宽度，每项容量为宽度加终止字节，确认的空白判定包括 ASCII 空格和原样本的 81 40。

**事实**。0x24 标题上限 16 字节，说明上限 1,023 字节，按 45 字节取两行。控件表包含 Face、Eyes、Mouth。共享模型支持归一化 240000 到 242799 的外观族。网页显示外观编号，并在资源可用时复用已有绘制器显示直接精灵及 NPC 图形。

**事实**。0x25 文本上限 1,000 字节，每行 32 字节。源窗口保留前三行，带按钮时正文至多八行，无按钮时至多十行。448×240 图层内的图形锚点为 86、98，朝向 0。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 宠物师范字段与文本边界

**事实**。报价和选宠标题最多读入 16 字节。0x18、0x2a、0x2b 各有三组提示，0x19 有一组。每组上限 255 字节，按 20 字节列宽取四行。0x1a、0x2c 标题上限 21 字节，提示上限 511 字节并按 21 字节列宽取五行。

**事实**。报价至多 16 组，依次为名称、源数值、金币费用、说明。选宠至多五组，依次为名称、阈值比较值、容量，扩展行附种族与提示字节。选栏最多十组，依次为名称、源数值、说明。空名保留为空栏。两个阶段的说明按 28 字节列宽取两行。

**事实**。0x55a3fc 的十项种族名称表已核对。网页用文字控件，图形资源号及尚无语义名称的数值保留在共享模型。

[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · 技能服务文本和资源字段

**事实**。五种窗口的开头依次为十进制图形资源号、标题和提示。标题读入上限为 21 字节。入口提示读入上限 255 字节并按 20 字节列宽取五行。技能详情提示上限 511 字节，按 21 字节列宽取五行。

**事实**。0x11 后续为技能名、说明、栏位数和费用，技能名最多读入 80 字节，说明最多读入 511 字节并按 32 字节列宽取八行。0x12 最多 15 组，每组为 21 字节上限的名称和两个有符号十进制值。空名或第一个值为负时隐藏该行。两个数值在共享模型保留原值。

**待验证**。网页保留图形资源号，当前使用文字控件。原版窗口图形、遗忘列表的两个数值栏名称与完整像素布局待核对。

[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · 治疗字段和对话图形资源

**事实**。治疗名称按字段解码，超过 16 字节显示三个问号。伤势零值以及分界 26、51、76 对应五个显示档。原版图标索引表在 0x55a424，网页显示文字档位。

**事实**。图形指令提供十进制资源号，附带方向段时跳过资源分隔后的一个字节，再读有符号朝向。括号内可提供一对坐标。默认锚点为 448×240 或 576×432 窗口中心，坐标按有符号 16 位存放，每窗至多十条。

**事实**。共享绘制复用资源目录、静态 RD 与动画帧读取，网页使用独立图形画布保留锚点。无有效图形时文字和回复可用。**待验证**。原版图文叠放、伤势图标像素和更多资源档。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 交易的物品、宠物与技能记录

**事实**。Mlt 在 0x4cbff0 使用 14 字段记录和 20 个报价位置。位置、名称、描述、图形、标志、兑换代码、数量、替代名分别是第 1、2、4、5、10、11、13、14 字段。单次回包可以更新部分位置。

**事实**。N)u 在 0x4cc1f0 读取五个宠物位置和 23 个有序字段。名称在第 1 字段，图形在第 2 字段，昵称在第 13 字段。负图形清除该位置。N4( 给既有宠物提供至多十条以竖线结束的技能名称。

**待验证**。宠物数值的完整标签与原版物品和宠物图形投影。共享端保留宠物数值字段顺序，网页展示名字、昵称和技能。

[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 留言作者、正文和时间

**事实**。标题最多 16 字节。作者解码后超过 16 字节时显示三个问号。原版对至多 140 字节的内容分为三条 70 字节以内的显示行。

**事实**。原版用 0x51b509 将正秒数转换为本地日期及时间。共享端保留入站秒数和图形选择值，网页本地化显示到分钟。

**待验证**。原版图形选择器与当前资源档的头像投影。

[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 单项给予的名称、文本和图形

**事实**。标题取最多 16 字节，提示和说明的读取上限为 0x2ff，名称解码超过 28 字节时使用三个问号。第 1 字段保存窗口图形，第 13 字段保存确认图形编号。

**事实**。物品匹配使用 ?l) 第 11 字段，数量使用第 13 字段，金币使用 E(9 的掩码 0x08000001。网页显示第一段普通提示和本地校验结果。

**待验证**。原版商店图形和其余提示的完整视觉布局。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 兑换物标签和背包字段

**事实**。兑换物标签按内层转义解码，原版读取 28 字节。商品名、说明与图形编号延用商店字段的字节边界。

**事实**。`?l)` 的第 11 字段进入兑换匹配，独立于第 5 字段的物品编码。第 13 字段提供该记录的数量。换槽时这两个值随物品移动。

**待验证**。原版商店图形、物品图标和其他兑换规则。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 服务报价说明与物品行的文字

**事实**。服务窗口标题、行名和描述复用已有双字节字段、内层转义与源长度限制。`?l)` 每行第 4 字段是物品说明，最多读取 767 字节。原版以 16 行、每行 32 字节排版。

**事实**。共享端保存内层反转义后的有界说明字节，按槽位更新与交换管理。网页按会话编码解码，保留换行并自动折行。聊天解码使用独立的 255 字节上限。

**待验证**。原版商店图形、物品图标与耐久字段的结构化解释。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-shop"></a>

### 前序检查点 · 商店的文本和图形索引

**事实**。商店正文按未转义竖线切字段，保留双字节字符，之后逐字段做内层转义。标题读取 16 字节，说明和描述每字段读取 767 字节，解码后名称超过 28 字节时使用源占位 ???。原版把窗口图形索引写到 0x4ab9b3 所在路径，行内图形字段分别来自买卖记录。

**事实**。网页显示拥有的文本副本，保留图形索引供后续资源接线。本轮的截图与对端输入来自原创夹具。

**待验证**。原版商店图形、商品图标与专用布局的资源绑定。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 普通对话文本与六种按钮的资源索引

**事实**。`0x4e9e20` 在 CR、LF 或固定宽度处分行，成对高字节保留在同一行。普通窗口宽度对应 46 或 60 字节列。菜单首个 LF 前为标题行数。内层转义表 `0x56bd40` 依次绑定 LF、逗号、竖线和反斜杠。

**事实**。`0x52ee44` 以三张图为一组。对既有安装材料的六张默认态 RD 作只读解码，核对 OK、Cancel、Yes、No、Back、Next。资源索引、区间及摘要见源核验，安装资源与 EXE 是否同一发行仍待验证。网页用对应中文文本呈现。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 地面公告的图形和钱币记录

**事实**。`H#|` 沿用按制表符分隔的多记录格式。图形物品走 `0x43fcd0`，保留公告资源编号与名称，记录类型为 2。数值物件走 `0x43fef0`，保留金额并按阈值选 `0x6b08` 起的资源，记录类型为 4。`IZL` 沿用既有 base62 ID 删除。

**事实**。测试使用两枚原创 RD 标记与对应调色板条目核对真实画布，资源格式覆盖沿用既有 RD 与 CGP 解析边界。

[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-targets"></a>

### 前序检查点 · 保留第 10 字段的原始位

**事实**。`?l)` 第 10 字段保留为 16 位无符号值。既有战斗资格继续比较非零，普通特殊目标单独读取位 8、9 和 10。名称和数量边界沿用上轮规格。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-items"></a>

### 前序检查点 · 背包名称与堆叠数量

**事实**。14 字段记录的名称仍按原有转义和 28 字节覆盖边界。第 13 字段解析为十进制 32 位有符号值，正数供背包拆分和数量显示。

**待验证**。图标资源、物品说明和原版提示的完整展示。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-input"></a>

### 前序检查点 · 物品名称的字节边界

**事实**。物品名沿用原版内层双字节字段与转义。255 字节读取预算内须找到分隔符，解转义后最多 28 字节才覆盖名称。网页用当前编码解码，并按文本展示。

**待验证**。原版图标、说明换行、提示窗口与普通物品栏布局。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-input-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-input-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-mp-items"></a>

### 前序检查点 · 用物、回复与数字反馈资源

**事实**。使用者过渡资源 0x1ae18，固定等级 0 的目标回复资源 0x1ae08，回复数字使用样式 5 的既有图形目录。目标回复图形按默认后端的 0x8000 标志进入对应绘制缓冲。

**事实**。验证使用原创 RD 和动画数据。网页战斗画布分别命中用物过渡、目标回复和动作 16 图形各 240 个不透明像素。

[本轮计划](../analysis/game-battle-shared-storage-v1/mp-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/mp-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-transitions"></a>

### 前序检查点 · 变身资源与退场画布

**事实**。REB 复用现有资源归一化与 RD 帧读取。过渡图形按元素和朝向选择，四个跟随图形沿用原有资源组。状态 158 的解除分支清零绘制掩码并保留绘制值。

**事实**。浏览器以原创 RD 档案检查 640 × 480 战斗画布的变身、解除和退场图形，每种完整命中 240 个不透明像素。返回地图后画布恢复 320 × 240。

**待验证**。原版备选渲染后端的混合与舍入。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-transitions-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-transitions-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-friend-roster"></a>

### 前序检查点 · 好友匹配的名称和施法提示图形

**事实**。C 与 MON 保留既有名称字节读取和资源解析。好友明细名按 C 字符串比较，大小写和字节均参与比较。原生名片缓存有两个角色区和 12 字节头。

**事实**。验证中 class22 的友方命中使用资源 57ba，源码和生成包均提交 68 帧。图像由原创合成档案提供，经现有 RD 和共享帧渲染路径处理。

[本轮计划](../analysis/game-battle-shared-storage-v1/friend-roster-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/friend-roster-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-effects"></a>

### 前序检查点 · 发言图标和时间数字资源

**事实**。普通 CHT 走资源 573f，基于发言对象当时的世界坐标加 (-30,-高度)，优先级 204。它按时长删除，位置固定。BST 数字资源为 3b7f4 至 3b7fd，负号 3b859，冒号 3b85a。

**事实**。时间字符串按分钟和两位秒数组字，字距 11，单字宽度 9 用于居中。字形每两帧交错启用，优先级 207，沿 41fd90 对应的生命周期绘制。验证素材由独立合成 RD 图块生成，沿用已有图像目录和调色板读取。

[本轮计划](../analysis/game-battle-shared-storage-v1/side-effects-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/side-effects-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 调色板和效果资源

**事实**。施法动画用 1ae01 加等级表项，组 1 叠层读取 70d9 至 70e0。207 的效果资源为 1adfa，使用现有 RD 与动画解析。

**事实**。默认雨滴四像素相对坐标为 (0,0)、(0,1)、(1,2)、(1,3)，来源是当前调色板第 143 项。整滴的绘制边界为 X 0–635、Y 0–467，优先级 20。原创调色板像素及遮挡关系已验证。

[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 咏唱、弹道与尾迹

**事实**。技能等级表项分别加到 1ade4 和 1addc。组 3 覆盖素材 70e9–70f0，原表逐项重复。尾迹按投射资源使用 1adb7 或 1adb6。

**事实**。默认缓冲中，0x60000 的追踪对象两个选择值都可提交。尾迹由 41f450 的随机样式分配到其中一个选择值。原创索引图和浏览器像素均已核对。**待验证**。公开技能配置仍保留替代渲染门槛。

[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL402 动画与效果资源

**事实**。咏唱资源为 1ade4 加等级表项。各目标通过 41dc00 类型 23 请求 1af8a，由现有动画与 RD 图像解析链读取。位置依次使用当前共享 CRT 随机流、父宽度和有符号绘制偏移。

**事实**。用原创索引图验证默认双缓冲的选择过滤、标志与 RGBA。**待验证**。原生驱动及替代后端的逐帧像素一致性。

[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · SKL405 资源解析与背景过渡

**事实**。每个目标的主体、骑乘、附件资源使用已有等级归一逻辑。已有骑乘且参数非零时调用对应更新，负值移除，零保留当前链接。附件小于 1 时移除。

**事实**。背景使用本地 GraphicInfo/RD 资源，支持已解析的 1000 及以上资源号和 −1 清空值。RGBA 验证使用原创 640×480 索引图，原生驱动混色仍待验证。

### GMN 呈现与前序字段

**事实**。534b18 有 39 条 130 字节记录，含 16 位阈值和 128 字节路径。GMN 用 0 和 13 号记录，二者阈值为 0。CGP BGR 读取前 672 字节，填颜色索引 16 至 239，强制当前索引 168 为黑。13 号文件缺失或短于 672 字节时保留基础投影，并返回资源不可用。

**事实**。GMN 的 40 次插值后在第 41 次归到准确目标。0 号与 13 号色阶分别为 128 与 96。内嵌调色板按通道乘色阶右移 7 位，flag4 绘制保留中性颜色。中性面板图块也使用 flag4。

**事实**。安装包 GraphicInfoV3_18.bin 的索引 1717 至 1725 对应资源 245300 至 245308。九张 RD 均为 flags 3。实际宽度含行对齐，窗口按 74×54 的名义格和 GraphicInfo 原点裁剪。默认路径的中心为不透明，替代纹理路径的中心使用 128 透明度。

**事实**。安装包里 9 张 RD 和两份 708 字节 CGP 已在内存中解码。记录仅保存长度、索引、偏移和哈希。**待验证**。此安装包资源与固定 37c4 样本的同版关系。

[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：静态合击横幅与未知栈字

**事实**：合击横幅按最后参与者所在队侧选择方向，人数上限10，创建9或10个原始静态字块及每块两个整数盒，保留六状态速度、延迟、隐藏标记、读取/重编码、寿命和第十块声音。controlFlags的404掩码或单人合击不创建横幅，也不要求横幅资源。420c50与4210e0为canonical；420e50是独立分析副本中恢复并核验617B/171条指令的derived回调，未升级为canonical或新增Evidence。

**事实／纠错**：强重置4347e0同时清1038并将1040技能等级设为-1，弱重置4348e0也清1038；旧端口漏了等级重置。动作14的目标查找现置于命中信号>9999内，修正击散离场后冷却期提前查找已移除目标的问题；真正命中缺失目标仍报错。unknownFourthCells的源身体ID在RID替换后保持原身份。本轮136份旧生成器/金样均与改前一致，没有重做旧金样。首次完整源码为1075/1076、生成包63/64，唯一失败均是隐藏横幅TCP夹具漏带普通输入10位；仅将对端P控制位合并为410，保留初次记录，针对性源码/生成包复测及最终完整复跑均通过。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](../analysis/game-battle-combination-v1/source-check.json)、[源修正](../analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-combination-v1/test-results.json)、[验收边界](../analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](../analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](../analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：RID0与结果RID3

**事实**：固定37c4旧样本的附带RID0生产者4236d0及动作221已进入shared。每条21字段，名称上限28字节、两组有符号HP/MP、状态与资源按源保留；创建两个隐藏且暂不回调的身体、8个整数盒及16字节逻辑交接对象，再向旧身体追加221和[a,0,a,b]。它与结果RID三资源字属于不同语义。

**事实**：221按当前旧身体元组的a/b替换角色，先安装第二身体，用counter平方的32位有符号结果除5并加动画attachmentY（actor+2f4）控制旧骑手落下；达到地面后安装第一身体、恢复状态和额外挂件，删除旧身体/骑手/交接对象。保留覆盖而未删除的旧B、重复RID遗留隐藏身体，以及body.slot与全局槽位可不同的原始别名，不把它们归一化。逻辑对象ID不是原生内存地址。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](../analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](../analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](../analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](../analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](../analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：73结果与原始数值尾部

**事实**：73初始分派selector7指向4294ac，variant0调用424310后以434a70重启主身体；完成分派selector6指向42912e，434b90(command,0)等待后，仅对仍存在且非死亡的599ba4主身体调用419f60，再释放命令。436c20前瞻只跳amount和RID三字，不跳后续guard；实际解码73命令私有持有原始数值尾部，只有真正NUL才反复返回0。复制命令缺少必要上下文时原子拒绝，不补写或归一化协议。

**待验证**：自身、守护别名、缺少结束信号及RID后跟守护的16条轨迹仍有界等待，不能称为自然回合完成。已有7201恢复是独立机制，未注入ready或清理动画信号。20/21号施法者的73击倒收尾按原指令不补11/44；其他通用类别同类边界尚未纳入本轮实现验收。attachedRID消费者4236d0仍原子拒绝，不能以元数据RID三字已支持推定该消费者已完成。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair73-v1/source-check.json)、[源修正](../analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair73-v1/test-results.json)、[验收边界](../analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：数值尾部、RID与动作信号

**事实**：435000前置计数先读连击再读主守护，424310运行生产者先读主守护再读连击，未发现归一化。4,608条原字段样例保持4,368条准备与240条边界拒绝，928条260运行记录闭合，336条保留角色顺序差异。解析字段顺序未改。为原始解码260命令私有保存数值尾部，436bb0在真正NUL才反复返回0；255后仍可前瞻下一条原始命令。复制命令缺少该上下文时明确拒绝。

**待验证**：两条主守护/RID在205/207帧选择图形0，保持现有几何拒绝；两条次级2041在124/126帧的201读取下一元组哨兵-1，明确报目标上下文错误，失败回调之后不声称状态/像素等价。100110是带非攻击命中信号的原创压力资源，实际入口和重入会重复主命中并等待；不擅自清信号。保留失败与有界等待，普通守护/RID/重入使用已独立建模的100114资源。这些不是原程序或官服验收。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](../analysis/game-battle-chain260-v1/source-check.json)、[源修正](../analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-chain260-v1/test-results.json)、[验收边界](../analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](../analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](../analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：不能截断在200字节的动作读取

**事实／范围**：原200字节观察不足以判断105高等级。REA扩展读取533940处512原字节，其中533968起472字节作为已观察窗口；十等级从零游标出发首次负值偏移依次9、10、163、143、123、103、83、63、43、23。高等级会读到相邻数据37/115/32及533a33的-126，缺少该动作时4fd5f0返回1。没有恢复出472字节的声明类型，不能把相邻数据叫作完整动画表；原生间接写入、整个进程生命周期和超出已观察窗口仍未验证，越界明确报LEGACY_BATTLE_SEQUENCE_CONTEXT。

**事实／待验证**：护卫后的RID后续记录在原创场景中令角色资源变为0；实际核心与独立方程在帧264/311一致进入当前帧控制器的LEGACY_BATTLE_FRAME_GEOMETRY。两个案例保留为渲染边界，未当作像素或正常回合通过。初始新模型未保留失败帧中新建残影的旧优先级17，曾错误地保留计算值16，现仅修正该边界快照；全部场景输入、队列、资源、geometry、拥有存储和成功RGBA保持，只有一条边界轨迹的最后状态改变。未放宽原渲染器或改旧golden。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-context-v1/source-check.json)、[源修正](../analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-context-v1/test-results.json)、[验收边界](../analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：94标量、257/262贴片及效果朝向

**事实**：固定37c4旧样本的94、257、262首条pair/variant0队列及真实消费者已接入shared。94使用额外104c标量、78声音与96前置动画，再由14按字面优先级分派条件和HP；257/262保留73/74、最高级tile2/3、额外效果及262的205冲刺和1af89朝向1。护卫、RID旧第四字、E000、别名自身与普通后续记录分别核对。0x106=262、0x10a=266的先前纠错保持；本轮没有新增平台专用功能。

**待验证**：105高等级动画表没有已观察到的负终止标记，共享58fac0游标的真实上下文未明；260主护卫与串联字段在435000前置解析和424310生产者间顺序不同。两类继续拒绝为未接入，不改已证前置解析；配对73关联路径及此前113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB仍未完整闭合。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](../analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](../analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：105有符号动画表和260字段顺序

**事实／边界**：105使用533968处按等级步长20的有符号动画表与共享58fac0游标；已核200字节只有前两行带负终止标记，后八行全0，不能推定高等级正常完成。260带主护卫的串联字段在435000前置解析与424310实际生产者之间顺序不同。4608个原创字段流对照中，实际shared解析准备4368个、240个触发跨平台边界拒绝；4128个在两个源读取器都完整，336个已准备流呈现不同字段角色顺序。未把这些静态方程当作游戏执行或修改已证前置解析。

**事实**：REA6.7.0/Ghidra12.1.4复用固定37c4旧样本742个canonical函数；有限Evidence并集2646，新增46个不同记录（43条新指令记录、2次数据读取、1次xref；另1条指令记录复用）。44条指令228原字节、216原始数据字节、59段93763字节和18个完整动作组核验。派生4260b0仍按14120指令/54685原字节核对，非新canonical或原程序运行；435000仍是28字节partial及独立461字节续段，未冒称修复。REA已关闭。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](../analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：原始tuple、5783消息与后续RID

**事实**：92复制目标float坐标，角度减180并单次归一，speed50移动一次后朝向目标。93只在counter0执行一次动作3动画，speed6移动16次，第17次结束并把目标HP设为0；执行到该分支时不按收到的amount扣血，也不被108/E000/RID直接改成通用伤害/治疗。临时零值盒只消耗一次rand，已与背景另外两次RNG区分验证。95/94写目标2d4冻结位；78/79/80分别发出62/210/133声音事件，消息为5783。

首条96只保存原始tuple/RID第一字，不展开或应用RID；后续普通记录仍执行自己的元数据。合成夹具只新增原创5783小图，不引入厂商素材。

**事实**：96默认后端的4160组队列、80条轨迹、32959帧状态、11836帧双selector完整RGBA与实际共享核心一致。另两条替代渲染轨迹的927状态/578像素/50样式观察仅为独立源方程；实际公开配置仍报LEGACY_BATTLE_SKILL_CONFIGURATION，未放宽门禁、未计入运行或像素通过。当前仍无替代渲染/半透明后端的完整实现。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special96-v1/source-check.json)、[源修正](../analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special96-v1/test-results.json)、[验收边界](../analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：原始嵌套tuple和消息图形

**事实**：232先移动并按距离/计数处理命中，HP位优先为108跳过正常处理、8000不改HP、4000治疗目标、2000反射伤害攻击者、普通伤害目标；全部先signed32运算再按源钳位。普通零值仅显示573b/57bb；反射会先弹自己与目标动作，组合位可在计数后重处理外层tuple。5实际移动16次，第17次才结束。未知嵌套RID旧存储上下文在写入前明确拒绝。

tuple仍为原始四word或源三word写入；三word保留旧第四word。仅合成素材新增573c/573d消息，55/56/57/58对应13/14/15动作；不加入官方素材或大段反编译正文。

**事实**：原435000只给72读取嵌套记录，且不把嵌套目标本身标成依赖（护卫会标记）；424310运行时同时处理72/113。保留原解析边界：113嵌套的4480组队列/104条轨迹仅为运行时命令夹具；可经真实前置解析的部分为4640组队列/157条轨迹。真实TCP/页面只验证72嵌套及113无嵌套，不将113嵌套标成协议兼容。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](../analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：自身RID尾部与三字tuple

**事实**：216先消费攻击者记录，再消费自身/护卫结果记录与可选RID，随后推进动作与tuple游标。8000跳过HP、4000对HP作signed32加法并仅按maxHP上限截断、2000抑制数值；108与flags3不阻止该结果。非零治疗即使有10000000仍显示style5，只有零治疗改57bb；伤害有10000000时改57bb，否则含零也用style6。自身RID仅保存首字，后两字来自最后一条非自身RID；缺少此前可确定的RID尾部时提交前拒绝，不猜默认值。

护卫第一tuple及最终[-1,0,0]沿用三字写入，保留既有第四字；四字原始结果明确保存firstRID。4位主效果为110000，400为1ae12并额外产生1adbe，随后才看HP结果位；否则仅身体自身level9使用1adbe。未添加猜测网络字段，测试仍是原创合成素材。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-self-physical-v1/source-check.json)、[源修正](../analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：E000数值位、扩展掩码与原创素材

**事实**：正变体结果与直接body14不同。body16/21在8000跳过HP、4000对实际目标HP做signed32加法并仅按maxHP上限截断、2000只抑制数值并释放目标，不在该回调扣攻击者HP；class6正变体也使用HP而非MP。RID仍独立按2000位写真实principal身体，不能写匿名投射物。单弹掩码为7e000/48000/24000/12000，多目标为e000/8000/4000/2000；skip→heal→suppress有先后。6000组合仍显示style5治疗数字；单弹30000与多目标30000保留各自源行为。

27类正变体沿用target/flags/amount与RID三资源字；非自身200不消费guard scalar，related73自身200也仅是标志。自身普通guard scalar与266variant2保持独立待实现，不按pair脚本猜测。119/120/121是factory kind7/8/9与1ae1d/25/2d，body动作不改为7/8/9。所有测试资源为原创合成字节。

207360组独立队列、495条轨迹、57686个状态、7388帧完整RGBA及实际200动作/800tuple初末存储一致。486条身体收敛、3条预期244离场、6条重复治疗/自身73链在1000帧内未自然收敛。27个实际管理器场景中18个正常回合、6个在7203恢复后于7207结束、3个离场；不能把恢复当作正常播放闭合。

[需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](../analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](../analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：E000字面位与三种结果效果

body14值归属：8000不改HP；4000给实际目标HP做signed32加法后仅按maxHP上限截断；2000对攻击者HP做signed32减法后下限0。class6在8000/4000仍扣实际目标MP，在2000扣攻击者MP。84/85/87在E000同样参与HP；不能套用普通分支的HP排除规则。RID按2000位写攻击者，护卫则保留三角色与原生3字tuple旧第四格。反射弹出双方动作并推进攻击者tuple，后续cooldown重新读取新tuple。

组合6000/a000/c000/e000保留值优先级与独立producer/RID判断；不归一化为单一枚举。style3为MP、style5为治疗HP、style6为反射HP；缺少实际所需glyph时原子拒绝。

119/120/121分别构造1ae1d/1ae25/1ae2d，复制世界坐标加trunc(drawOffsetY/2)，不跟随且不初次animate；actual41b640在有效父对象状态1时完成为2，157清自身冻结/状态。删除父对象并复用slot后，旧效果不能写入新身体。CMBtype8的command-owner阶段写入未实现，不能把106c命令指针当保存坐标；本轮只覆盖已支持SKL type0计划。

独立原创方程与实现对照179200组队列、301条轨迹、63085个状态、6100帧完整RGBA（双selector），初始/最终原始200动作格与800tuple格相同。300条身体收敛，1条预期244离场；19个真实命令管理器场景得到18个正常回合和1个离场，均无超时恢复。

[需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-results-v1/source-check.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：护卫标量、连续记录与原创夹具

436c20复制owner payload+64到栈上局部游标，只扫描连续0x1010记录，首条不匹配即停止，不改变主游标；跳过amount和可选3字RID，不额外跳过guard标量。434a90只写3格、保留旧第四格；436e60追加RID后复制之前的完整raw tuple，禁止清零或改复制来源。

M pair记录为actor/target/flags/amount，首条81附extra，再按RID位读取3资源字，guard200位再读取guard slot。50/51映射20/21。新增测试5748静态RD及1adb9/1ae49动画均为独立原创合成字节，无原作图像、EXE或大段反编译源码进入交付。

113先Action5/animate1，再构造(parent,-32,type0/3,filter0,parentlink1)，1000位选择1ae49，否则1adb9；效果复制世界坐标且不跟随，无初次animate。父状态1→2由实际效果完成回调产生，157清自身冻结并弹出。护卫蓄力的被保护者可能保留frozen=1直到队列重置，当前按原始脚本保留并验证nextC/reset，不擅自解除。

独立原创方程与实现对照16000组队列、227条轨迹、58109帧状态、5124帧完整RGBA（双selector），初始/最终原始200动作格和800tuple格也相同。223条身体收敛，1条预期244退出，3条别名/RID链在3000帧内未收敛；真实管理器在7203次回调触发已有恢复后结束，不能把恢复算作正常播放闭合。

[需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：六组平铺索引与瞬时静态图

**事实**：REA6.7.0/Ghidra12.1.4新增10条精确指令观察（原件35B逐字节一致）；29个既有函数范围17465B复核。规范函数仍742，有限Evidence并集2455。4033b0先读limit再读counter并作有符号>=；403410的参数0不是重置值，而是读取后加1；4034f0第21次读取更换掩码。原件与历史源证据未改，REA已关闭、cleanup=false。

533a74的6×16项只交付资源号及证据ID；71b1/71b2是静态Graphic而非Anime。测试仅追加原创RD字节，没有原作图片/二进制；缺瞬时图或启用的平铺行时，在动作/tuple写入前拒绝。

独立原创Python模型与实现对照64800正变体队列、132条新轨迹、19294帧状态、3664帧完整RGBA，双selector一致；132条均在观察内身体收敛。旧206的61920队列/879轨迹输出逐字节不变。原作程序本轮未执行，方程匹配不等于原生运行证据。

[需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：22k箭头是静态图像资源

**事实**：复用REA6.7.0/Ghidra12.1.4保留证据，分层742规范函数、有限2445条Evidence均未增加。33个既有helper范围6634B映射至未改原件，12个完整case组及历史源核验以只读比较复核；Apple LLVM21.0.0独立核对419bd0双减法和420080世界坐标读。REA会话已关闭、cleanup=false。

**事实**：5622/564a加方向的资源号小于100000，属于Graphic，不是Anime index。首次合成夹具误放动画表已纠正为原创RD图像；生产动画边界未放宽。其他新增动画、RD和调色素材均为原创合成测试字节，没有复制原作图片或二进制。

独立原创Python源方程生成61920队列、879轨迹、134538状态和16606帧完整RGBA，两种selector均逐项匹配；873轨迹身体收敛。自身73及重复目标各3条在3000次观察内保持未收敛，不能算成功回合；实际源码/生成包管理器均由wait counter>7200恢复这6条，未注入ready。原作可执行文件未运行，本机方程匹配不等于原生运行证明。

[需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：原创模型纠正与原件索引边界

独立Python模型按同一源证据修正并重跑11个生成器，4份期望状态JSON改变；原创资源字节、geometry、队列输入、场景数、状态帧与RGBA帧覆盖均保持。旧失败日志和历史验收保留；旧模型关于反应烟雾的随机偏移假设由本轮纠正，旧历史通过不代表该假设正确。

**事实**：533a74的384B只读资源编号表已匹配原件；selector0/3/5各16项，41f5b0按32+64*x、24+48*y（x/y0..9）绘制100格。编号不是原作图像；完整美术及替代后端像素未验收。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：首击额外字与packed RID3的真实消费

**事实**：pair流为actor/target/flags/amount到FF；原principal的class/level/cost只分配一次，下一pair类别重置-1。81仅首记录在amount后读额外字；800000追加3资源，保存packed元数据及原结果副本。直接14只在10000..19999信号消费元数据后应用原结果，20000段是前置信号。

75..80且80000命中条件资源为110000+class，259为1adfb；258直接路径的整数中点为[318,270]。原创夹具数字/消息宽8，遵守已有限定行跨度；没有为夹具9px宽度放宽渲染器。

本轮2193项Node测试/183文件、439项生成检查（432 neutral+7 App/Page）、四套构建615输入/34输出均通过。独立15995队列、75场景、17488完整建模状态、2358完整RGBA帧（双selector）；108条实际本地TCP流程验证540次正常启动请求、553包技能、110次查询、113条S、101次退出及202次战后移动。实际game.html桌面/触屏18流程、92截图，Chrome156.0.8078.80/Playwright1.64.1，页面错误/警告/外部请求均0。

正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：公共pair首击字段与方向资源

**事实**：公共generic28类别的variant0是actor/target/flags/amount到FF；72/113无论variant字值均取pair路径。其他generic的1/2/3是单施术者加target/flags/amount列表；相关73另有生产者。800000追加3资源，200另取护卫；260的80000和72/113的嵌套记录有独立边界。81首amount后还有额外字，94首脚本另读字；每个pair结束后class=-1。

**事实/原指令**：41a8c0用trunc((angle+11.25)*(2/45))得到16方向，负时只加16一次，>=16只减16一次，再加resourceBase+16。0.5/0/±180/360与double360、2/45、11.25均核原PE；这不是8方向朝向。FAB254仍是运行时几何目录，不能从未初始化槽位推导0。

本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](../analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](../analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：82三元组、RID与float32常量

**事实/推导**：82是code/cost/忽略字/principal与target/flags/signed amount到FF；800000追加三资源，50/51映射20/21，等级为个位。内部RID布局是原元组、资源01、资源2和原元组副本；436ee0推进三格后回到原结果，随后才推进下个真实目标。未出现RID前的第四内部字未被该消费者读取，便携投影使用0，不能声称原栈字为0。

82目标的10000/20000/40000不走数值治疗/反射逻辑；84逐条按signed32减HP后只截零下限。负数可以增加HP而不截HP上限，重复目标逐条使用收到的不同数值。0且10000000发57bb，否则style6数字，2位可加57b6。

动作83的增量来自原始float32常量，阈值2.0；不是假定100帧完成。构造19/1ae14+tier使用40000，冲击1ae4a普通后端50000。全部图形/动画/字形字节为原创合成。82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](../analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](../analysis/game-battle-skill82-v1/source-check.json)、[验证修正](../analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-skill82-v1/test-results.json)、[TCP](../analysis/game-battle-skill82-v1/network-validation.json)、[页面](../analysis/game-battle-skill82-v1/browser-validation.json)、[验收](../analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](../analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](../analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：83共享三元组、中点与演员副本字段

**事实/推导**：83沿61..63的code/cost/忽略字/principal与target/flags/signed amount到FF格式，50/51映射20/21，其他别名与个位等级沿原消费者。83不用135的资源字段；25构造使用1ae4d、48000和动画drawOffsetY/2整数截断。

中点由两侧533810表位置作整数差的一半后相加得到318/270，不能复用其他field的270.5。残影每隔一次源身体访问复制演员与13b8数据，FF0计数从0起，第12次回调删除；保存当前float/frame及之前screen整数，复制priority/deleted/scale，同时保留新链表链接。

全部动画/RD/数字及像素夹具为原创合成，不新增官方素材或大段反编译内容。非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](../analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](../analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](../analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](../analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](../analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](../analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](../analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：数值三元组和有符号边界

**事实/推导**：61..63顺序为code/cost/忽略字/principal，再target/flags/有符号amount，FF结束。50/51映射20/21，别名与个位等级沿已证规则；本分支800000不额外消费RID三字。与199阶段的状态对字段不能混用。

10000将每个原值按signed32累加，发出元组仅去20位；非零反射总和写施术者style5，去10000的反馈元组归最后反射者。40000/20000/10000按优先级处理；10000000把当前numberStyle设0。治疗先signed32相加再仅截上限，扣血先signed32相减再仅截零下限。重复目标的number字段在排队阶段被后值覆盖，后续两个回调可重复应用最后数值。

新的style0数字夹具为8×8原创合成RD；首次5像素行宽被现有stride门禁拒绝，修夹具而未放宽产品格式。全部资源包、RGBA与输入夹具不含原游戏素材。共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](../analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](../analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](../analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](../analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：目标对、自身标记与68额外字

**事实/推导**：36类均先读code/cost/忽略字/principal；普通共同分支再读target/flags对至FF，仅68每个目标另外消费一个有符号字，标记80000未置位也必须消费。自身50..53/88只消费单一标记字，FF表示无目标元组；不可套伤害三元组。特殊槽50/51映射20/21，类别/等级与别名沿已证源规则。

68在目标上调用4348e0，清原队列/元组游标后再排145/77/155/38；重复或自身目标的覆盖顺序按源保留。队列200格/最多199有效项与结束四元组先检查，reset行按重置后的容量计算。32粒子与128粒子分别按原float32加速度/位移及越界次数结束；fixture完全原创合成。

400B REA常量外，第六组16×4B贴图表直接核原文件偏移1250228；已有41f520指令身份另核。无新增原EXE/DLL/图片/大段反编译代码交付。其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](../analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-status-skills-v1/test-results.json)、[TCP](../analysis/game-battle-status-skills-v1/network-validation.json)、[页面](../analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：SKL元组与施法资源覆盖范围

**事实/推导**：固定37c4的SKL index0先解析code/cost/忽略字/principal，再读target/flags/amount至FF；特殊槽50/51映射20/21。别名先查既有表，类别取code/100整数部、等级取code%10，十位变体依源忽略；这里只覆盖19..31。800000标记另含三个资源，按现有resourceCode规则解析；它与独立attachedRID命令不同。

身体四字元组含资源承载时的额外四元组；RID1额外字在后续普通/反射记录中延续。初个RID之前原栈值未知，本消费者未读取，便携投影为0。反射按有符号32位总和与源最后记录规则处理，不把零和改成完成。资源组表、十等级tier、5×16咏唱100格表和独立向量均可追溯原偏移。

actor+2cc使用当前动画drawOffsetY，和geometry.height分别保留；原背景先复制，便携priority0仅是复制顺序投影。这里只保存原创合成资源和参考数据，无原EXE/DLL/图片等交付。自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[规格](../analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](../analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](../analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-casting-v1/test-results.json)、[TCP](../analysis/game-battle-casting-v1/network-validation.json)、[页面](../analysis/game-battle-casting-v1/browser-validation.json)、[验收](../analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](../analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：15主记录、11子等级与边界

**事实：** 主记录eadfa4、stride49fc；11 token为slot、30、name、1c、24、20、28、u8/19、2c、34、38；数值按已证偏移命名。空name且1c/24都负只清name/1c/24和11×94子区，其他头字段保留，4ff030另清工艺区。4f0210名称23B，主name24B，子name24B/description96B，超限原fallback为???。

JUA先清11×94再顺序读6token：name/description/7c/80/packed/8c。packed低12到84，高四位12..15到90，非空name设88=1；保存11个等级但战斗窗口回调只给10行。子name必须在255B读容量内遇分隔符才返回0；未遇或读满255返回1并结束，不能把这种截断错误当作同一路径的name fallback。内部空名则原循环不推进，独立实现拒绝；槽/等级越界原有不安全写入，本实现有界原子拒绝并留旧状态。

保留DBCS高字节成对、内层转义、NUL、127B数值、符号和32位溢出规则。主34仅在已证等级MP乘法中命名为系数，不猜测其他协议属性；SKL类别与收到的技能ID没有新增未经证实映射。完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-player-skills-v1/source-check.json)、[测试](../analysis/game-battle-player-skills-v1/test-results.json)、[TCP](../analysis/game-battle-player-skills-v1/network-validation.json)、[页面](../analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-player-skills-v1/goal-audit.json)。


<a id="stage196"></a>

## stage196：MON字段、缓存布局及缩放策略边界

**事实：** MON零mode为actor/mode/opaque三字；非零mode追加name<=28B、resource按500a70归一化、value1d0、HP/maxHP/MP/maxMP、statusFlags。第三字不可称为新宠物索引，非零mode也不是乐观模式写入。状态高24..27位复制四个u16元数据；源清savedFE0与队列，scale设0，位置到配对目标。名称字节独立拥有，不把MON伪装成收到新C。

489880读取持久pet encoded wrapper偏移c/1c/2c/3c；旧FBY解析字段10/20/30/40是逻辑写值，不能混成原生编码内存字节。4898e0读取实际配对170/180/1b0/1c0，且要求真实本地body存在、无13b4。

**事实/策略区分：** 447330给出float scale到整数目标矩形的截断几何，原采样委托DDRAW/D3D；独立point采样按目标整数extent映射原像素，支持裁剪/翻转/透明/负坐标与零extent。真实驱动缩放像素、alternate半透明/tinted/additive仍未验收。240独立Python策略像素用例及两选择器MON结果是本地策略证据。完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](../analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pet-transition-v1/source-check.json)、[测试](../analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](../analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](../analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](../analysis/game-battle-pet-transition-v1/goal-audit.json)。


<a id="stage195"></a>

## stage195：FBY/G:w/J_J掩码、宽度及明确边界

**事实：** FBY receive-00567cfc→4f0aa0，G:w receive-00567cf8→4f1000，J_J receive-00567cd0→4f1420，均为int32槽+bytes。前两者base62掩码：bit0全字段，否则ordinal+1位；FBY25字段，G:w16字段，省略保留，数字token127B、缺失-1与有符号32位十进制回绕。FBY0清整个记录/技能；G:w0清present和两个名称首字节，保留其余数值/技能。

FBY mode偏移6aa的bit10另存6d4，名称/昵称内转义后<=16B才覆盖；resource6a0按已有500a70规则归一化。G:w包含末6d0排序值。J_J先清10技能，8字段为slot/id/name/description/cost/flags/targetMask/sortKey；name<=24、description<=96，否则实际53459c的???替代。十进制负slot结束，重复slot最后覆盖，absent宠物忽略。

**受限边界：** 源程序缺少技能索引上界；空技能名分支4f157e回4f148c未经过4f1671的游标+8。独立实现对>9及空名原子拒绝，既有记录不变，不模拟越界内存或循环。其余属性仅按源偏移保存，不赋予未证实名称。36新增/1847全量Node、四构建/173生成检查（166neutral/7App/Page）通过；555输入/34输出身份一致，0external。15独立场景833输入状态、53完整接收记录状态通过。38新真实本机TCP含6实际页面，核190启动、120宠物接收包、86输入（34 W|FF、28 W|0|A、5 W|1|0、3 W|2|29、10 G、6 N）、31退出/62移动与31次正常返回；24张独立原创夹具截图在源码外。

完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](../analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](../analysis/game-battle-mounted-input-v1/source-check.json)、[测试](../analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](../analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](../analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](../analysis/game-battle-mounted-input-v1/goal-audit.json)。


<a id="stage194"></a>

## stage194：CBC资源别名与关联帧的原有格式

未扩展资源/网络解析格式。CBC只归一化base，四数值按i32保留，不钳制；rider/attachment字段遵守源raw语义。骑乘base子资源复用已证5013b0映射。C与CBC对关联字段的归一化与调用条件不同，不能统一为一种更新。

原创动画增加100040/100041/100050/100051/114003/114004，按8朝向和20动作生成，沿已有GraphicInfo/Graphic/AnimeInfo/Anime与RD行对齐。32独立场景1010完整RGBA同时核真实子对象附点、flags、池优先级和备用深度Y；原厂素材/反编译正文不入交付。父mask保留和raw alias105030另有边界检查。完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-character-change-v1/source-check.json)、[规格](../analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-character-change-v1/test-results.json)、[TCP](../analysis/game-battle-character-change-v1/network-validation.json)、[验收](../analysis/game-battle-character-change-v1/validation.json)、[剩余目标](../analysis/game-battle-character-change-v1/goal-audit.json)。

<a id="stage193"></a>

## stage193：EQU静态提示与待用动画资源

**事实：** EQU的消息0x5731小于100000，走GraphicInfo/Graphic静态资源，不是AnimeInfo。type64将1014待用资源写当前2a8，以action5推进真实动画，完成清2d0信号；13a8辅助资源独立保留。grade3资源105030在resourceCode0归一化到100030，code7保留；格式解析器未放宽。

独立参考使用原创8×8、4字节行对齐RD index6000作为5731，100030原创动画使用反向帧序与实际完成信号；50场景1917完整640×480RGBA与1917状态分别核验。初次夹具误放动画目录、随后独立raster漏index6000，均改正参考/原创夹具。完整官方资源和反编译源码继续只在私有分析目录，不入交付。完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-change-v1/source-check.json)、[规格](../analysis/game-battle-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-change-v1/test-results.json)、[TCP](../analysis/game-battle-change-v1/network-validation.json)、[验收](../analysis/game-battle-change-v1/validation.json)、[剩余目标](../analysis/game-battle-change-v1/goal-audit.json)。

<a id="stage192"></a>

## stage192：三种源数字字型与原创夹具边界

**事实：** 原52d450的128B完整表为8行×4i32；style3/5/6资源基数243730/243750/243760。41fe20使用signed十进制（含0、负号），按ASCII宽9居中、53890c style2步距11排列；位移和尺寸取真实catalog。PSN回血使用1ae55..1ae58，最高级附层1ae68，按实际动画和父生命周期结束。

本轮没有扩大解析格式。测试使用原创RD与动画，宽度按既已证实的4字节行对齐；初始未对齐夹具触发STRIDE_UNPROVEN后改正夹具，未放宽解析器。相邻数字字型的负号/数字资源ID会重叠，夹具按每个资源唯一建表，避免两个素材同ID的歧义。2152完整RGBA和735整数边界分别验收；原版素材仍不纳入交付。完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-status-v1/implementation-plan.json)、[源核验](../analysis/game-battle-status-v1/source-check.json)、[规格](../analysis/game-battle-status-v1/implementation-spec.json)、[测试](../analysis/game-battle-status-v1/test-results.json)、[TCP](../analysis/game-battle-status-v1/network-validation.json)、[验收](../analysis/game-battle-status-v1/validation.json)、[剩余目标](../analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：实际战斗位图、普通裁剪与独立像素依据

战斗内部真实捕获/身体/渐变仍为640×480；新增呈现设置让浏览器取得完整战斗RGBA，不把普通startup的320×240误用为战斗裁剪。返回20/3成功后新普通Canvas恢复原320×240上下文，未更改startup schema、C/M记录或线格式。页面读取实际C名称、当前body四值与源倒计时，不内置地图、图像或假角色资源。

独立Python以保留阵型表、原创100020的三个idle帧及原有索引像素合成器生成9个完整640×480参考（两个实际身体和背景）。桌面与390×844触屏仿真都从真实Canvas读取位图，摘要在该独立集合中；没有从产品结果反向生成expected。主页面的其他动作/返回仍沿既有已核消费者，未声称新增全原生菜单/字体/音频资源验收。

45张截图均为原创合成材料在实际页面的捕获，存放源码树外并逐文件核hash。实际损坏的原创数字RD头触发真实资源解析错误、关闭world/library/files；未放宽既有行步幅/调色板/混色/特殊图像边界。手机OS目录选择、原生字体/音频和真实设备仍需验收。

[来源核验](../analysis/game-battle-web-v1/source-check.json)、[规格](../analysis/game-battle-web-v1/implementation-spec.json)、[测试](../analysis/game-battle-web-v1/test-results.json)、[实际页面](../analysis/game-battle-web-v1/browser-validation.json)、[位图核验](../analysis/game-battle-web-v1/canvas-browser.json)、[网络](../analysis/game-battle-web-v1/network-validation.json)、[验收](../analysis/game-battle-web-v1/validation.json)、[目标审计](../analysis/game-battle-web-v1/goal-audit.json)。

<a id="stage190"></a>

## stage190：SKL物理结果、数字字体与倒地子对象

固定旧样本SKL的本次普通类分支从真实数值字段取得类/等级、cost、variant和演员/目标/flags/amount，顺序alias沿既有证据。原子写入每本体动作及4-word tuple；额外tuple word在此无扩展位分支不消费。仅类0/1/3、variant0、mask0x1000012f及普通存活C（raw bits0x401、无链接/缩放）进入本次消费者，其余保持依赖，不构造推测的记录。

实际C四值是当前/最大HP、当前/最大MP；正cost扣MP后下限0。动画>=20000不扣HP，10000..19999在结果位置扣有符号amount并下限0。伤害数字按%d的ASCII字符，经字体表style6×4索引得到base243760，居中宽9、字符步11，实际glyph origin直接并入初始位置；不能二次叠加origin。数字2*i延迟、源浮点弹跳和后续50调用停留，暴击/无伤提示使用实际资源。

蓄力资源为1ae14加实际等级表；KO普通44/46经过8闪，再由50实际子粒子完成通知47/49删除。替代渲染/混色/特殊资源/未证明行步幅仍明确不支持。本轮只交付原创合成资源（数字宽8/12符合既有行步幅边界）和独立参考，不交付厂商素材或反编译全文。3137完整RGBA属于独立合成资源的局部渲染核验，非原程序整场UI等价。

[源证据](../analysis/game-battle-skill-v1/source-check.json)、[规格](../analysis/game-battle-skill-v1/implementation-spec.json)、[测试](../analysis/game-battle-skill-v1/test-results.json)、[TCP](../analysis/game-battle-skill-v1/network-validation.json)、[验收](../analysis/game-battle-skill-v1/validation.json)、[目标审计](../analysis/game-battle-skill-v1/goal-audit.json)。

<a id="stage189"></a>

## stage189：普通场景捕获、固定淡入与新记录来源

普通来源返回不需要重新收到本地unit：本地资源、坐标、朝向、标签、速度来自保留全局；远端只使用退出后新记录。正常入战已清旧远端记录与本地本体，旧运动队列、挂件、spin/ride和frame key不可复用。若本地已被新unit重建，4ff160刷新其保留源资源/朝向；已存在的新远端本体按4405a0规则保留。

返回重建复用已验证的实际map/actor/resource渲染器，640×480捕获私有保存，源13的54步逐行复制；显示裁剪和调用者改上帧字节不改变捕获。1保留旧呈现，11前30次清图，只有重建和20/3分别运行普通帧回调；2不再推进普通动画。1004次独立行复制RGBA检查覆盖真实合成资源捕获、裁剪和场景更新，非完整原程序场景/UI/音频等价；无厂商素材加入交付。[源证据](../analysis/game-battle-return-v1/source-check.json)、[规格](../analysis/game-battle-return-v1/implementation-spec.json)、[测试](../analysis/game-battle-return-v1/test-results.json)、[TCP](../analysis/game-battle-return-v1/network-validation.json)、[验收](../analysis/game-battle-return-v1/validation.json)、[目标审计](../analysis/game-battle-return-v1/goal-audit.json)。

<a id="stage188"></a>

## stage188：退出帧捕获与行复制覆盖

退出使用真正最近呈现的640×480战斗RGBA私有副本，涵盖既有背景/body/child；不再用入场背景缓存替代。源exit12按配对行横移，counter241会重访238；exit14按纵向位置倒序复制479..1。两个纯数值分支有105步/50400可见行状态及32裁剪参考；padding480不属于输出/完成判断。

22条新TCP实际渲染3326帧，其中1008次退出像素与独立源copy计划逐帧核对，包含320×240显示和调用者修改上帧RGBA。此证据仅覆盖退出复制，不涵盖完整SKL动作、原生UI或DirectDraw位级等价。原普通池去投影/数值重置、main9捕获/场景重建/入场渐变、特效/混色/缩放等仍有缺口；无厂商素材交付。[源证据](../analysis/game-battle-exit-v1/source-check.json)、[规格](../analysis/game-battle-exit-v1/implementation-spec.json)、[测试](../analysis/game-battle-exit-v1/test-results.json)、[TCP](../analysis/game-battle-exit-v1/network-validation.json)、[验收](../analysis/game-battle-exit-v1/validation.json)、[目标审计](../analysis/game-battle-exit-v1/goal-audit.json)。

<a id="stage187"></a>

## stage187：M调度复用现有资源格式

没有新增猜测网络字段或厂商资源。PNO的66/63动作队列在自有动画资源上实际回调，busy清除后才允许round递增；ACT复用已移植indicator child。四槽M环保留原写满后读写索引相等的行为，5每次只消费一条，6不抢读下一条。

2518新TCP资源帧中1120入场帧核旧独立RGBA，其余动作帧有实际渲染/生命周期证据，没有新增独立动作UI像素验收。退出所需当前战斗framebuffer捕获和12/14渐变未实现，不能用入场背景缓存替代。完整SKL/body/特效/混色/缩放/普通池及其他资源缺口继续保留。[源证据](../analysis/game-battle-loop-v1/source-check.json)、[规格](../analysis/game-battle-loop-v1/implementation-spec.json)、[测试](../analysis/game-battle-loop-v1/test-results.json)、[TCP](../analysis/game-battle-loop-v1/network-validation.json)、[验收](../analysis/game-battle-loop-v1/validation.json)、[目标审计](../analysis/game-battle-loop-v1/goal-audit.json)。

<a id="stage186"></a>

## stage186：窗口定义与目标值映射的覆盖范围

本轮没有猜测新网络字段。窗口26的原14条widget定义为32字节/条，运行结构36字节/条；目标选择数值与队形表、固定动作字节串有原件/映射证据。菜单的offset/velocity按源更新，完成检查源状态；其实际widget/文字/音频和原生命中像素尚未移植。

**推导：** C中第一项values映射到源对象0x170数字载体，目标资格使用有符号值；首个resolved link>0经422d60创建13b4子对象，完整此类资源拥有链未实现，基本输入明确unavailable。当前没有伪造菜单或挂载句柄。

26新源/生成TCP运行2610个实际资源帧，1568入场帧沿旧独立RGBA参考比较；392新独立步骤核输入数值和字节，不把基础画面称作输入UI像素验收。完整body/坐骑/变形/影子/特效、缩放/混色/捕获与其他资源格式仍有缺口，不交付厂商资源或伪码。[源证据](../analysis/game-battle-input-v1/source-check.json)、[规格](../analysis/game-battle-input-v1/implementation-spec.json)、[测试](../analysis/game-battle-input-v1/test-results.json)、[TCP](../analysis/game-battle-input-v1/network-validation.json)、[验收](../analysis/game-battle-input-v1/validation.json)、[目标审计](../analysis/game-battle-input-v1/goal-audit.json)。

<a id="stage185"></a>

## stage185：640×480捕获与源13渐变

本轮没有新增网络字段。背景仍由真实Graphic/CGP/RD资源投影，在入场0和渐变完成时重建私有640×480捕获；503330的480行速度/偏移以float32保存，13/8/2固定输入按原行序与镜像初始化，完成由row0==0决定。44ce40按short目标与原行矩形裁切复制；客户端输出可以小于或大于原视口，16个边界已独立核验。

54次fade/25920行状态、12场景804完整入场RGBA与实际源/生成client1390帧相符，均是原创合成资源和独立参考证据。索引帧未覆盖像素沿已有RGBA表示保留，未当成原游戏运行截图或原生后端验收。原缩放/混色/全表面生命周期、菜单/音频、其他特效与完整渲染仍未完成；不交付厂商图片、二进制或反编译正文。[源证据](../analysis/game-battle-entry-v1/source-check.json)、[规格](../analysis/game-battle-entry-v1/implementation-spec.json)、[测试](../analysis/game-battle-entry-v1/test-results.json)、[TCP](../analysis/game-battle-entry-v1/network-validation.json)、[验收](../analysis/game-battle-entry-v1/validation.json)、[目标审计](../analysis/game-battle-entry-v1/goal-audit.json)。

<a id="stage184"></a>

## stage184：战斗池对象到真实索引资源的格式边界

本轮未增加或猜测网络字段。frame使用真实animation graphicIndex/geometry/offset与原body screen、actorFlags、scale；506e80在偏移乘scale后ftol再int32加屏幕坐标，当前单位scale路径已接入。五类已移植子对象，以及指定C资源范围，按309/310覆盖drawFlags bit4，仍使用实际CGP/Graphic/RD拥有链，不附带厂商素材。

源depth字段270为signed16、当前构造值0；隐藏/删除/renderer过滤在depth分配之后。深度优先级是byte(rank+9)，背景resource中心320,240按priority5投影；source捕获/渐变生命周期尚未实现。4093对象预算保留三个原记录预约。1835完整原创RGBA一致，159原生缩放/混色样式案例显式未支持；不从DirectDraw/D3D调用推断采样，也不把614390零填充当实际清屏色。[源证据](../analysis/game-battle-scene-v1/source-check.json)、[规格](../analysis/game-battle-scene-v1/implementation-spec.json)、[测试](../analysis/game-battle-scene-v1/test-results.json)、[TCP](../analysis/game-battle-scene-v1/network-validation.json)、[验收](../analysis/game-battle-scene-v1/validation.json)、[目标审计](../analysis/game-battle-scene-v1/goal-audit.json)。

<a id="stage183"></a>

## stage183：源三角表、动画和效果状态格式

新增数值表为原53da08的360个double sine，cosine为float32(angle+90)后反复归一再按整数度索引；方向仍复用53e548的65个double。不能改用Math.sin而宣称同一行为。419fa0从float坐标作平方和开方并ftol；任意x87位一致仍未验证。

动画仍用既有12B索引、12/20B action、10B frame与真实graphic geometry；未新增游戏素材交付。source55只清帧序号/延迟，sourceC还含末尾mode0调用。message以source float0.8加速、7.2阈值，但比较/位置使用尚未舍入的x87和；存储height/position分别float32。视觉随机数为u32(seed×214013+2531011)，返回(seed>>16)&32767，区间helper的high==-1不取随机值。

动作/tuple/value仍最多199条+哨兵；pool移植另设4096个自有节点与65536次同步死亡动画探测预算，不复现原生无界/悬空指针路径。新增1994步原创状态和元数据、1024随机值及查表核验；无本轮战斗RGBA或完整画面验收。[数值表证据](../analysis/game-battle-body-v1/source-tables.json)、[源校验](../analysis/game-battle-body-v1/source-check.json)。

<a id="stage182"></a>

## stage182：body队列与命令游标边界

本轮未引入资源包或新的线路字段。C与M仍为既有4095B/NUL前缀；M读取完字段后才推进执行游标，依赖冲突时执行游标不动，预检游标及之前的预约写入保留。尾部扫描跟随原token函数，剩单字节提前返回，不能一律跳到原始字节长度。

body动作200个int32从aux+ca4起，read/write在fc4/fc8；tuple为aux+1c起200行×16B，read/write在c9c/ca0；value为1080起200个int32，read/write在13a0/13a4。下一记录的-1哨兵会占一个单元，安全上限199条；199/200及插入/部分重置留存第四word有测试，不复制原件越界写。队列type231是下一type哨兵，不代表body动画已完成。

32命令槽是同时在用容量；group×22是原调用计数延迟，没有推断毫秒或帧率。源字节与方向表重核见[源校验](../analysis/game-battle-commands-v1/source-check.json)。完整battle背景/动画/特效资源组合和渲染仍未实现。

<a id="stage181"></a>

## stage181：M字段与别名覆盖

M内层从byte2起以首字节A..Z扫描3字节token并+4，数字是大写hex/int32回绕；不是外层base62。SKL raw>50000先依序应用55组别名，再按有符号整数/100。24类消耗序列、状态800000/80000/200等分支及RID跟随已按源覆盖；字段仅保留位置与原值，不补猜全部业务名称。普通槽50/51映射20/21，RID前看用raw索引；GMN第一槽在全22覆盖外多一次，第二槽只作principal。

名字cap29/256含NUL，对应28/255原字节并走511000反转义；不指定Unicode默认。未知token/截断/非法原生写位置拒绝。32并发对象不限制整个包的命令数，4094B/1023短命令通过。

[源证据](../analysis/game-battle-runtime-v1/source-check.json)、[规格](../analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](../analysis/game-battle-runtime-v1/test-results.json)、[TCP](../analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](../analysis/game-battle-runtime-v1/validation.json)、[完整目标](../analysis/game-battle-runtime-v1/goal-audit.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：战斗C格式、数值表与资源边界

C的byte2起先读flags；flags&20直接end。每行slot/name后10个整数：body2a8资源、aux13a8资源、body1d0值、四个wrapped逻辑值、raw状态字、两个关联资源。资源归一化复用500a70既有显式上下文，字段业务名称不补猜。name cap29含NUL，最多28原字节，DBCS处理与511000内层反转义有源；不将名字赋默认Unicode编码。5337b0的22映射和533808的22×4整数共440B已逐字节核原件；entry/target不是已运行的运动位置。

40a120回调62,225B已保留完整伪代码/汇编，但native value flow截断；M管理回调4365d0未被Ghidra识别为函数，1808B原字节及LLVM21静态COFF逐指令核验不构成完整CFG。P/A初始零来自PE .data零填充推导，不是运行时观测。原生越界copy/指针不复现，安全profile限制C/M最多4095B；完整C身体/特效副作用未声称实现。

[源证据](../analysis/game-battle-transition-v1/source-check.json)、[规格](../analysis/game-battle-transition-v1/implementation-spec.json)、[测试](../analysis/game-battle-transition-v1/test-results.json)、[TCP](../analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](../analysis/game-battle-transition-v1/validation.json)、[完整目标](../analysis/game-battle-transition-v1/goal-audit.json)。

**阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：aux04图像资源与帧次序

默认103100；mode15为1/2时取body value16。C0先比较旧value16与RAW列16设置dirty，再归一化mode/value；新body重置mode/value/child/dirty。创建帧不推进、不占提交槽。保留帧先推进一次，取当前offset-origin，Y加43b9d0原40项人物高度；queued anchor为signed short，图像扩展再加原点。NULL style不沿用动画flip/palette/color，也不OR4。badge先于原状态图标提交，共用1024槽；缺图仍占槽，重复root只推进无提交，越界剔除跳过。安全拥有者替代源指针。

128场景均为既有及本轮原创合成图像/动画/地图，65种RGBA SHA；不交付厂商素材。

[源证据](../analysis/game-party-actions-v1/source-check.json)、[规格](../analysis/game-party-actions-v1/implementation-spec.json)、[测试](../analysis/game-party-actions-v1/test-results.json)、[TCP](../analysis/game-party-actions-v1/network-validation.json)、[验收](../analysis/game-party-actions-v1/validation.json)、[完整目标](../analysis/game-party-actions-v1/goal-audit.json)。


<a id="stage178"></a>

## stage178：队伍槽位、坐标与原人物图像复用

五槽48B记录格式继续沿stage177；本阶段紧凑顺序只取active且身体有效项，不按ID排序。身体+200/+210是target，+1e0/+1f0为display，+220/+248为FIFO两列，+270队列数，+274/+278位置，+27c/+280基础速度，+284自身speed。队长队列按全局本机speed与队列数建速；本机队员和远端队员按首项身体speed建速，统一global957e98乘基础速度。移除传递target；开始行进传递旧display，二者不可混用。

新图像比对复用既有原创图像/动画/地图参考，不加入厂商素材。224图像是普通已实现层；aux04未实现图标未伪造到参考中。

[源证据](../analysis/game-party-follow-v1/source-check.json)、[合同](../analysis/game-party-follow-v1/implementation-spec.json)、[测试](../analysis/game-party-follow-v1/test-results.json)、[网络](../analysis/game-party-follow-v1/network-validation.json)、[验收](../analysis/game-party-follow-v1/validation.json)、[完整目标](../analysis/game-party-follow-v1/goal-audit.json)。


<a id="stage177"></a>

## stage177：值条图像描述与HFs记录

**事实：** 填充3bdf0/3bdef先入全局队列，style box为(-16,-1,width,2)，505bd0从box起点减图像原点；background3bdee经506ac0加原点并在render type0恢复全图。style flag4选择中性表，priority207；普通调用的目的位置分别为parent(-22,+1)、parent(-22,+4)、parent(-10,+3)+背景origin。

HFs原记录48B：active+0、id+4、value8+8、value0c+c、value10+10、value14+14、name+18（至多16B+NUL）、bodyref+2c。掩码顺序是id/value8/value10/value0c/value14/name，不能按物理偏移重排。]_g按最多五个平铺组写body四值，不查本机主角。独立夹具只追加原创RD/索引，无厂商图片或完整字体。

[源证据](../analysis/game-actor-vitals-v1/source-check.json)、[合同](../analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](../analysis/game-actor-vitals-v1/test-results.json)、[网络](../analysis/game-actor-vitals-v1/network-validation.json)、[验收](../analysis/game-actor-vitals-v1/validation.json)、[完整目标](../analysis/game-actor-vitals-v1/goal-audit.json)。


<a id="stage176"></a>

## stage176：字体表、文字记录及标签列表

**事实：** font结构从538908开始，共14行、每行24B：handle、单字节宽/高、双字节宽/高、descriptor word；stage175从53890c采样的前四指标不变，本轮澄清结构起点，不能把下一handle当字体字段。font1指标7/14/14/14。lane priorities为210/212/216/223/226/230。颜色表538a58为12×3B RGB，紧接538a7c宋体字节。文字0x110记录含short x/y、color/font/lane、字符串+9及next+10c；空串仍排队但不调用GDI。

Hr] payload有48组label/int/int，原生内层转义后写入28B记录；+8为20B字符区，first<0清-1/-1/empty。安全实现有效行上限19B，保持缺项-1、额外项计数、原顺序，不重现unchecked copy。mask是独立端口数据（alpha8、尺寸、short origin），不是新增官方文件或字形atlas。

固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4：32新记录含12函数查询（11新规范入口、已知505840单列），15份旧dossier复用；规范目录488→499，1550记录及364943731B快照留build，session已关闭。3段1163B和6端点映射与原件相符，其中534598的8字节读取复用旧记录。

[源证据](../analysis/game-actor-text-v1/source-check.json)、[合同](../analysis/game-actor-text-v1/implementation-spec.json)、[验收](../analysis/game-actor-text-v1/validation.json)、[测试](../analysis/game-actor-text-v1/test-results.json)、[网络](../analysis/game-actor-text-v1/network-validation.json)、[完整目标](../analysis/game-actor-text-v1/goal-audit.json)。


<a id="stage175"></a>

## stage175：高度、variant前缀与UI动画存储位置

**事实：** source-tables.json记录534224的40个int32高度，resource100000..100999按(resource-100000)/25整数索引，范围外-88；534314提取16个int32资源前缀。原生5010e0/438910未限variant，独立渲染只支持0..15；读取发生在force覆盖之前，不能用后续覆盖掩盖越界。53890c的14×6字体宽度行和445170的高位字节两字节步进仅作观察，未实现文字或声称Unicode等价。

图标43e210使用原始资源而非人物归一化。前帧drawOffset-origin存储到新的屏幕anchor，helper取当前bitmap，队列short(anchor)+当前origin，drawFlags OR4；底图尺寸、flip与palette仍走现有RD/library实现。不得套用60附属当前AP锚点，不能重复叠加当前图标frame偏移。

27项新增、1355项全量Node通过；546组控制、1540组图标选择/拒绝、1003组高度/旧偏移，共3089个独立例。720帧完整场景/224种SHA、12帧预解码/延迟精灵像素对比、6条实际原创TCP的1660帧一致；7neutral/7生成工程通过。四份新构建App116输入/11输出、API91输入，均0external，原生game Page仍未实现。 [源证据](../analysis/game-actor-presentation-v1/source-check.json)、[合同](../analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](../analysis/game-actor-presentation-v1/validation.json)、[测试](../analysis/game-actor-presentation-v1/test-results.json)、[网络](../analysis/game-actor-presentation-v1/network-validation.json)。

姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：实际AP坐标文件参与附属锚点

没有更改Anime/Graphic/AP解析格式。本轮使用既有CrdInfo/Crd加载与共享坐标别名规则，在普通钩子把人物当前AP和坐骑当前AP相加；再加未偏移身体屏幕点，避免把坐骑偏移算两次。附属动画沿既有origin/drawOffset/flip/短坐标和样式路径绘制，仅helper0入队。

[原创夹具](../analysis/game-actor-attachment-v1/original-vectors.json)扩充4个合成Anime/AP文件，覆盖角色/坐骑/附属AP、翻转、声明资源1、空动画/动作缺失、资源复用、骑乘/旋转暂停及重建。1760独立计划、540帧/200种SHA及12帧预解码对比通过。[源范围](../analysis/game-actor-attachment-v1/source-check.json)。

没有加入官方素材或完整反编译源码。完整资源风格、中文/字体、其他43d150消费者、当前版本和原生x87仍待证，不由本轮测试推定。


<a id="stage173"></a>

## stage173：骑乘资源映射与动画附着点

**事实：** 5013b0对六个有限角色资源范围按25个一组、组内整数除6映射到114000段，并有18a24/18a25特例；完整输入边界与原PE函数范围见[源核验](../analysis/game-actor-ride-v1/source-check.json)。坐骑参数先按既有500a70归一化；正常资源和临时身体值分开。

本轮没有改变Anime/Graphic/AP二进制解析格式。state1/2使用现有动画播放器的attachmentX/Y，严格区分上一调用缓存和当前调用结果；effect110096/110097面对方向0。普通骑乘还按源资源范围调整绘制flag4，前后子层沿既有短坐标、样式和同优先级逆序规则提交。

[原创夹具](../analysis/game-actor-ride-v1/original-vectors.json)只扩充2个合成Anime文件，覆盖深负/正/变化AP、声明资源1的子图与进出/再次进入。1062资源、264动作、492计划、3444结果及110完整像素场景通过；没有加入官方素材或完整反编译源码。当前资源版本/原生x87仍待验证。


<a id="stage172"></a>
## stage172：80动作、正常资源与旋转常量

**事实：** Hx!动作列表用逗号分隔，C0单位列表用Tab。80只消费资源参数1并进入状态3，坐标/朝向/参数2不驱动本回调；不能把非零参数2误判为附属对象。60另写正常资源并处理附属。身体+2a8与正常f536a0/记录资源的含义必须区分；正常字段在独立实现中保留raw投影并沿既有已证归一化解析，不重建物理包装存储。[字节证据](../analysis/game-actor-spin-v1/source-check.json)。

旋转表为45/0/315/270/225/180/135/90；原常量x=1.75、y=0.6000000238418579、基准Y=-1.399999976158142、弧度0.017453292519444445和投影bias0.5均有原字节。独立逻辑参考的graphicBase为1000，合成磁盘group0基址为0，因此动画帧磁盘需写1002/1004/1005。原创合成文件仅扩展两份动画材料，不含官方美术或会话。[生成器](../analysis/game-actor-spin-v1/generate_vectors.py)、[原创建材](../analysis/game-actor-spin-v1/original_assets.mjs)。生产编码/启动/现行格式仍未完成。


<a id="stage171"></a>
## stage171：单位类别、记录位与构造mode的来源

**事实：** C0列1为类别，不能按远端ESP+20猜成本机mode15。初始记录type由4401b0离散表决定，类型只在新注册时写入；图形记录type2，数值记录type4。[地面记录复核](#stage221-ground-pickup)。draw受控位为0x401700：类别普通位与value7组合位在记录上刷新，在body中累积。value8截低16位；flag11/12对应DWORD motion的0x00400000/0x00800000，其他位不据空值推测。[源表和字段](../analysis/game-actor-context-v1/source-check.json)。

**事实与派生：** 远端初始朝向用真实场景mode8，主5准备中其初值0有45eef0/45f2a0/4649b0证据；声音条件使用另一全局f5f17c。单位资源先沿既有归一化再用于mode0的100000≤id<200000判断，非零mode按源短路保留给定朝向。sourceFrame/sourceSceneMode是宿主元数据，不是新增线上格式、资源文件字段或凭据。

508组原创独立向量与120帧合成资源的像素模型不保存官方图像、声音或大段反编译源码。既有启动JSON格式未变，完整中文、生产启动/digest和现行版本材料仍待验证。[生成器](../analysis/game-actor-context-v1/generate_vectors.py)、[验收](../analysis/game-actor-context-v1/test-results.json)。


<a id="stage170"></a>
## stage170：本机状态字段的来源与构造材料

**事实：** 当前body资源f536a0、所选外观f536a4、@Qu身份f536a8、当前朝向f536ac分别是独立槽位；逻辑X/Y来自96b9c8/96b9e0，speed来自F8% field18及已知动作。state4efad0 field15是本机value7，29/30为首两个标签，不能当身份。资源分类/降级继续使用已有500a70规格。[槽位、来源、函数与原字节核对](../analysis/game-local-bootstrap-v1/source-check.json)。

**派生实现：** main5中已证raw清理给出资源0、value7=0及空标签，朝向明确-1；没有为未知结构体/物理包装字段批量补零。游戏速度在支持的实际源更新前仍不可用。main9逻辑对象先使用这些已知值，单位记录随后更新当前资源；startup的所选外观不会被直接用于身体绘制。

`moli.legacy-game-startup.v1`及所有显式context字段未改格式，生产启动/digest/编码来源仍未闭合。288组原创合成顺序向量、Python生成器与[测试](../analysis/game-local-bootstrap-v1/test-results.json)不包含官方资源、账号会话、EXE/DLL或大段反编译正文。完整原生reset和当前版本格式仍待验证。


<a id="stage169"></a>
## stage169：派生启动配置、明确context与资源所有权

本项目新增JSON schema `moli.legacy-game-startup.v1`，它是独立实现的宿主配置，**不是恢复出的厂商文件格式**。浏览器文件最多65536B，严格拒绝未知字段/缺少context；不储存、不上传材料。

| 字段 | 格式/边界 | 含义 |
| --- | --- | --- |
| sourceProfile | legacy-se6000-37c4 | 限定实现配置 |
| sourceSha256 | 固定37c4 SHA256 | 调用者声明，不认证资源来源/版本/授权 |
| mappingHex | 小写hex，解码1..256B且含NUL | 已证gid/glt字节grammar；不从当前票据转换 |
| moduleDigestHex | 小写hex，解码0或32B ASCII小写hex | 已证发送字段；32字符需再编码为64字符JSONhex，摘要生产者未闭合 |
| resourceParametersHex | 小写hex，解码0..32767B ASCII | 既有source资源参数/默认路径，不是EXE执行命令 |
| context | 完整movement/runtime/actor/input/display对象 | 既有数值接口的明确输入；无隐式零值、无完整native UI证明 |

display的初始camera/center/尺寸、graphicsMode0..2和forceRender由配置提供；其他context按既有源字段类型和ordinary支持范围校验。名称显示/创建在固定页面明确限ASCII，未绑定生产ACP。配置不能凭sourceSha声明证明所选资源与原样本同版。

资源根来自实际folder File输入的明确webkitRelativePath公共根，交给既有只读、大小写无歧义路径适配；library仅读索引/动画/CGP及实际帧范围，CUT仍用源scene selector。地图patch设置0xc000沿既有world规格；copyLocalSceneReadiness要求当前本机格0x4000是派生宿主门槛。无需导出EXE/DLL/原画，原创测试资源独立生成。[合同](../analysis/game-browser-owner-v1/implementation-spec.json)、[原创启动夹具生成器](../analysis/game-browser-owner-v1/original_startup.mjs)。


<a id="stage168"></a>
## stage168：外观数值、预览默认值与版本标记

人物记录仍148B：field2为+24的int32 appearance，+36为native临时classifier，field17为+80的int32 variant。3/4只改变前两项，5/6切换variant后运行数值预览；已有入场0X@继续按field15/17/2发送。类别、范围、换算及14项逆表覆盖见[合同](../analysis/game-character-options-v1/implementation-spec.json)。实际越界拒绝，不用未知stack填充。

**当前正确默认值为33100。** 原PE文件359244的MOV字节c787f8e9f5004c810000写0x814c；旧33000文字/测试属于纠正前历史。与33101一同作为3/4跳过哨兵，但33000仍是合法输入，不能全局替换所有33000。[24行修正记录](../analysis/game-character-options-v1/fallback-correction.json)。预览仅数值，不导出人物原画或模拟对象。

5[B的格式为`int32 kind,bytes marker`；已知固定ASCII marker为abcdefg、20031229_20、20031229_30。选择依据为已锁存generation与发送时category；marker作为拥有字节移交编码后清除。WDM为单个int32，源消费者只读低8位。类别7的kind5需runtime923c40材料，生产者未证，不假造或读取账号材料。

state4f0000/field16的已知native地址f536a4只在进入前写selected appearance；不补零其他未知/wrapped字段，不推角色ID。真实F8%的bit16更新可覆盖此值，已用独立原始wire验证。以上均限定旧37c4，不代表现行资源或协议兼容。


<a id="stage167"></a>
## stage167：创建命令、名称和数值外观格式

固定37c4的/qW由4ef3a0→4f8460序列化：`int32 slot, bytes name, int32 animationCode, int32 iconCode, int32 five0..4, int32 four0..3`，共13字段。U_s由4f8a40分发`bytes result,int32 returnedField15,bytes detail`给4ef480；精确successful仅写字段15与源variant字段17，detail未消费。后续列表仍为人物记录权威，返回字段15未解释为actorID。

名称采用显式游戏字节；宿主覆盖1..16B、无嵌NUL，拒绝超过范围而非模拟原生编辑器截断。源检查精确重名、ASCII空格/8140/a140/[GP]、ASCII |/\/、默认CRT空白/控制；4052d0高位字节与456330的>=81双字节跳过分别实现，locale变化未模拟。测试306名称包含高位/尾随分隔符边界；浏览器原创夹具显式ASCII，不代表生产中文编码绑定。

resourceBase=240000+100*(ordinal+family*14)，原表28项逐字节核对；animation base与ordinal步长/6*color由56项表核对。mode0经500dd0(501200(base))加细节，mode1经501200加细节，mode2直接base加细节；非零mode的nativeVariant均1，不能把mode2直接写字段17。具体公式/偏移见[合同](../analysis/game-character-lifecycle-v1/implementation-spec.json)。仅数值，不导出人物原画或声称完整预览。


<a id="stage166"></a>
## stage166：两槽148B人物记录与内容探测

**固定37c4事实：** VK0参数为int32 status、bytes detail；成功body前四个多字节感知`|`字段按name0/escapedRecord0/name1/escapedRecord1消费，每外字段cap1023B。内串按既有5111a0/511000反转义，再510e50 decimal：缺失/空整数=-1，非法非空按atoi0，溢出按int32；槽非0/1忽略，重复槽后者覆盖。name≤16B（首字节非0表示present），过长为???；field16≤63B。宿主总输入上限32760B为明确安全预算。

| 内字段 | 记录偏移 | 表示 |
| --- | --- | --- |
| name | 0 | 16B加NUL |
| 3 | 18 | int16 |
| 13/2/18/19 | 20/24/28/32 | int32 |
| 4..8 | 40..56，步长4 | int32 |
| 9..12 | 60..72，步长4 | int32除10向零 |
| 15/17 | 76/80 | int32 |
| 16 | 84 | 最多63B加NUL |

field14未消费，offset36不是新增业务字段；不把数值直接命名为HP/等级/职业。4586f0选择前只修field2/17；0X@随后传field15/17/2，不传槽号/姓名。Wb^保存category低8位。五个GraphicInfo resourceID按**映射索引非零**推代际，index0即使有记录也不算命中；六份实际本地元数据641666记录的探测generation4与独立参考一致，仅保存数值/hash，不导出图像。[源/格式合同](../analysis/game-post-login-v1/implementation-spec.json)、[corpus回执](../analysis/game-post-login-v1/corpus-probe.json)。预览像素、完整重置/current等价和官方仍未验证。


<a id="stage165"></a>
## stage165：交接字节、登录字段与回复范围

固定37c4的CGSharedMem消费者先复制到NUL、再找首个大小写敏感gid:/glt:子串并按C空白%s取词。独立安全覆盖要求总输入1..256B且有NUL，两个token各1..50B；不模拟无终止/溢出/未知locale。模块摘要是显式0B失败串或32B小写hex；当前只证16B→hex生产边界，未实现完整摘要计算，也不代填样本指纹。

现有外帧/112B bootstrap/文字codec不变。发送`/b1`的三个bytes字段顺序为模块摘要、glt、gid；接收`UJt`为int32 status与bytes detail。源C字符串取首NUL之前；成功detail首个`|`前≤127B，后段副作用未实现。非零status且detail恰为busy时状态WORD改1234，低16位为0不等于完整status成功。实际账号/名称不持久化，测试全部原创。版本等价、票据绑定与完整后续业务未证。[源核验](../analysis/game-session-runtime-v1/source-check.json)、[格式与API](../analysis/game-session-runtime-v1/implementation-spec.json)。


<a id="stage164"></a>
## stage164：真实资源路径与读取边界

七组顺序为base/Ex/V2/V3/PUK2/PUK3/Joy。Graphic/GraphicInfo、Anime/AnimeInfo、Coordinate/CoordinateInfo默认表为7×128B×6，Bin前缀和数字格式有原件字节；AP的*3别名最终指向组3Crd/CrdInfo。图形0/3/6必需、动画主组必需；缺失可选组仍占组位，graphicBase按已加载GraphicInfo记录累计。[完整路径数据](../analysis/game-resource-runtime-v1/resource-path-catalog.json)。

本轮未发明新vendor格式：GraphicInfo仍40B，动画index12B/action12或20B/frame10B/AP索引10B与数据8B，CUT12B头/18B记录，CGP读取前672B。drawPlan是独立宿主的数值对象，不是wire或磁盘格式。RD只按目录offset/length范围读取，不把639MB主Graphic归档整包装进内存。

中性palette分支已核对并有4原创像素参考：普通default使用当前CGP且168黑；flag4无embedded使用原始快照/显式黑1；embedded BGR显式黑1，索引0透明。动态LUT与其他颜色效果仍未推断。

真实主机语料：25个实际读取文件身份留存，7组累计641666图形记录、2520动画资源；初始化读取66791338B元数据/动画/CGP、图像解码0。随后18图像×2分支的36个64×48摘要与Python一致，未导出图片或完整RD。真实CGP有708B，库仅读取源已证前672B。[语料比较](../analysis/game-resource-runtime-v1/corpus-comparison.json)。完整文件来源与37c4主程序版本等价仍未证明。

<a id="stage163"></a>
## stage163：坐标/时钟常量与本地上下文边界

本轮没有新增游戏资源文件格式。固定37c4原件52dd94的4B为abaaaa3f（float32 4/3），52d920的8B为000000000000e03f（double0.5），538a88/538a90两double均abaaaaaaaaaa3040（16.666666666666668），538a98初始int32=1。53字节/映射检查中包含原件独立PE定位，详细偏移见[source-check](../analysis/game-input-runtime-v1/source-check.json)。本地input/runtime字段不是恢复出的wire字段或新认证格式。

Canvas读取真正sceneRGBA；本轮浏览器使用原创RD/CGP/GraphicInfo/CUT/动画/地图夹具，没有打包官方图片或以占位背景替代scene。实际资源选择、named palette、UI和未知primitive映射仍缺。**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

完整资源与原生 runtime/record/UI 上下文绑定、右键交互、小地图/primitive/特殊角色/特效、战斗/其余业务及认证、现行版本、实际三端与官方可玩仍未完成。旧版37c4不等同9baa/6e2ff；本轮没有VM、WER、CDB、账号、官服或原生IDE新操作，也未重放已消费停止点。

<a id="stage162"></a>
## stage162：PUK2 CUT文件18B、运行记录20B

**事实：** 464a30对`bin\PUK2\cutdat\%d.cut`读12B头，再每条4B＋七个2B，共18B；内存步长20。头前4字节观察为`CUT `，+4为headerSize12，+6/+8/+10为三signed16计数。记录+0 resource32、+4 kind16、+6/+8/+10/+12 clip signed16、+14/+16 anchor signed16；运行时末2B保留清零。464b90清12＋50000×20B，未填kind设FFFF。独立目录严格核对已知头、完整记录及上限，报告尾随字节；原生loader未检查magic/短读，不能据此把损坏输入视为有效。

GraphicInfo ordinal元数据新增metadataAt，宽高占地来自文件28/29，draw kind为rawFlags/100，碰撞仍rawFlags%100；不使用opaque文件32。CUT atlas源矩形为clipXY−320/240−图形原点，目的坐标为tile screen−CUT anchor；动画地图物件改走源player和创建锚点，帧XY偏移不参与这条路径。[格式目录](../analysis/game-legacy-scene-frame-v1/scene-frame-catalog.json)。

本地341CUT/401103条完整数值记录（kind0为395436、kind1为5667）与独立Python摘要相符，未导出图片、地图或音频。另337AUT只记录尺寸/hash，source464bc0/463780指向小地图颜色，尚无AUT解析/小地图UI验收；数值格式相符不证明资源与旧37c4版本等同。[比较](../analysis/game-legacy-scene-frame-v1/corpus-comparison.json)、[测试](../analysis/game-legacy-scene-frame-v1/test-results.json)。

<a id="stage161"></a>
## stage161：图形声明ID与初始ordinal更正

**事实：** 旧37c4 GraphicInfo文件每40B的+36是声明resource ID，loader452460复制到runtime32B的+28，getter453000返回此值。+32仍是其他元数据，不能代替声明ID。`includeImages:true`另持有850000项Uint32声明表，约3.4MB；默认碰撞目录不增加该表。`resourceIdAt(index)`不做resource→ordinal查找，缺省未填记录为0；索引声明ID=1的根保留参与排序，随后才跳过提交。[源核验](../analysis/game-legacy-frame-v1/source-check.json)。

**事实与更正：** 分配器409e70把actor图形ordinal初始化为−1。player初始值及原创参考同步更正；旧参考282个标量仅0→−1，实际资源/动作/帧及1250步数量不变，旧阶段清单作为历史保留。动画12/20B、帧10B、AP8B格式未改；geometry仍必须用实际解码RD尺寸，不能默认索引尺寸可信。当前实体层仅接已有普通palette/effects支持域，named palette、特殊图像效果和完整资源宿主待实现。[合同](../analysis/game-legacy-frame-v1/implementation-spec.json)、[回归](../analysis/game-legacy-frame-v1/test-results.json)。

<a id="stage160"></a>
## stage160：实际动画索引、动作、帧和AP记录

**事实：** index每12B：+0 LE32 resource ID、+4 LE32 animation offset、+8 LE16 action count、+10 LE16 version；source ID−100000，version>1归0，重复后者覆盖，runtime记录36B并按unsigned normalized ID排序。固定loader临时表容10000唯一，runtime20500、7组。[目录](../analysis/game-legacy-animation-v1/animation-catalog.json)、[源](../analysis/game-legacy-animation-v1/source-check.json)。

Action v0为12B、v1为20B：direction16、action16、duration32、frameCount32；extended追加selector16/flags16/color32，v0默认0/0/FFFFFFFF。读取后duration换为duration/(frameCount×16)，非零frame且不足1取1；player再按uint32乘percent/100。每frame10B：graphic32、x16/y16 signed、event16；graphic加同组GraphicInfo基数，runtime扩为12B。source frame上限9999，action10000；独立还核输入/区间/总拥有/总frame预算，不复刻stack或输出越界。

AP index首byte1后每10B为resource32/offset32/count16；AP data每项8B为graphic32＋signed16 dx/dy。全局index更新记录，但读取取该animation记录所在group的AP数据；同graphic取首项。header flags低8位进入player，selector16/color32保留；未知绘制style不直接当普通sprite执行。源几何来自actualRD缓存尺寸，不能套用索引中的width/height猜翻转位置。

**本地比较：** AnimeInfo_Joy_13/Anime_Joy_13与AnimeInfoV3_7/AnimeV3_7四个固定hash文件，396记录/16034动作/58146帧数值metadata全部与独立Python一致，最大单动作frame分别20/35。只输出摘要，不导出官方图像/音频，也不证明旧EXE与当前资源/官方版本等价。[比较](../analysis/game-legacy-animation-v1/corpus-comparison.json)。


<a id="stage159"></a>
## stage159：实际RD位标志、CGP与32位索引颜色

**事实：** fixed37c4 511470中flags&1选compressed、flags&2选20B头和LE32 palette长度；其他位忽略，非只version0..3。width/height是LE signed32；raw从16/20复制W×H+palette、word12未使用，compressed以word12为输入end。command低4位计数；literal bit80=0只看bit10单扩展（0/2/4/6与1/3/5/7别名）。fill bit80=1时bit40决定读值/填0，bit20优先双BE扩展，否则bit10单扩展；值在长度扩展前，C/D/E/F明确是零，count0合法。[source](../analysis/game-legacy-render-v1/source-check.json)、[目录](../analysis/game-legacy-render-v1/render-catalog.json)。

source没有输出长度/输入尾部安全保护；独立decoder要求精确W×H+palette、预算和完整命令，不复刻越界/残留。raw与压缩均保留palette原始字节；允许0或非3倍数长度，但palette颜色只完整triples可知。既有rd-runs结构API保留其历史mask语义，新source profile单列，不把结构猜测当旧版或现行等价。

**事实：** CGP首672B BGR填中间224色，首尾16色固定；snapshot先于current168清黑。retained palet_00.cgp为708B，后36B未解释。native32默认表保留黑色0，explicit32保护黑色为1而entry0清0；嵌入BGR索引尾只消费可知颜色，不补scratch。存储行bottom-up；native cache宽上调4但没有重新排像素，故未对齐width只能解字节不能宣称绘制。GraphicInfo可选image字段为file4 offset/8 length/12及16 origin/20及24 size，后四者runtime截16位，group源自loader。

**本地比较：** 两组27854条与独立Python摘要相符：27820接受/34越界安全拒绝，288条RGBA摘要抽样相符；所有接受宽度4对齐、已有像素使用的partial色均在已知域。此为格式兼容与独立算法证据，无官方像素导出、原程序视觉对照或当前版本/官服证明。[比较回执](../analysis/game-legacy-render-v1/corpus-comparison.json)。


<a id="stage158"></a>
## stage158：GraphicInfo碰撞字段与地图第三层

**事实：** 固定37c4 loader452460每次fread40B转runtime32B；原文件28/29字节分别占格宽/高，30LE16在452f40取%100为collision class，36LE32建立资源ID→record索引。record索引为本组原ID加之前组record总数；default0/last mapping、850000容量、record+10严格小于容量及4个conditional alias有源。没有改变通用40B index parser的其他opaque字段含义，也不把旧版合同套用当前资源。[source](../analysis/game-legacy-local-movement-v1/source-check.json)、[目录](../analysis/game-legacy-local-movement-v1/navigation-catalog.json)。

**事实：** primitive0..19999直接、20000..65535加200000。mode1碰撞只取第三层bit0x100，mode0按ground/object/class与向北/右footprint、passable cell2及最终empty/lowbyte1分支；低byte2/3/6..13还参与source停步事件，raw第三层0是缺块lookahead依据，不能用checksum掩码或collision bit代替。补丁OR0xc000会使已补零值成为非零known word。上述只是碰撞/事件角色，palette/图层/透明/像素/动画语义仍未闭合。[合同](../analysis/game-legacy-local-movement-v1/implementation-spec.json)。

<a id="stage157"></a>
## stage157：实体字段、方向表与资源ID范围

**事实：** 内层tab实体记录返回前2047B；character第11列非空优先于graphic第6列和值对象第4列。base62 ID与decimal数字混用，不能统一当外层整数；byte字段127/255/1023截取、inner解码/嵌套pipe及16/32/60B写入上限见目录。值对象按50..1000000九阈值选择0x6b08..0x6b11，源标签为十进制值+空格+GBK字节bdf0b1d2；保留bytes而非推断整体协议编码。action使用comma且首空终止，action列4/facing列5。[目录](../analysis/game-legacy-actors-v1/actor-catalog.json)。

**事实/独立范围：** 方向来自0x53e548的65项double表，32/24等轴投影和float32常量已逐字节匹配PE。资源ID按500b00有序分类，前置grade0范围会覆盖后续重叠测试；500c40有孔与有序fallback，grade3减5000，模式cap为0/3/6/7。这里只实现ID关系，没有原图、palette、动作帧、图层/透明语义或可用性证明。运行模式必须显式提供；目录与产品数学数据可重提取一致。[源](../analysis/game-legacy-actors-v1/source-check.json)、[合同](../analysis/game-legacy-actors-v1/implementation-spec.json)。

<a id="stage156"></a>
## stage156：地图缓存头创建与内层状态字段

**事实：** 旧版4ef870→45f530/45f760明确MAP01头：0..3为MAP/1，+4/+8为wire6/wire7原32位字，+12/+16为wire2/wire3宽高；创建body为三个连续零LE16平面。全部20B头匹配才复用，identityA2例外重建，identityB0不准备。原+4..11从opaque推进到来源字段，但更高含义仍未知。独立限制正尺寸与原32MiB/4Mi-cell总界，持久路径/variant/IO未模拟。[源](../analysis/game-legacy-scene-v1/source-check.json)、[合同](../analysis/game-legacy-scene-v1/implementation-spec.json)。

状态bytes使用另一层pipe字段与inner转义：反斜线+n/c/z/y分别变LF/逗号/pipe/反斜线，未知去斜线留跟随字节，末斜线消失，高字节成对原样保留；不能拿消息外层转义替代。掩码base62和字段decimal均32位折返，numeric空/缺失-1，固定127/255B截取有源；两个byte槽解码≤16B才更新。标签有全串/首字段两次inner变换。只存原字节与未命名槽，未赋Unicode/资源图层/属性语义。[原创向量](../analysis/game-legacy-scene-v1/original-vectors.json)。

<a id="stage155"></a>
## stage155：MAP01三连续平面及区域数据

**事实：** 旧版37c4的45fbf0/45f850将缓存按20B头、三个连续LE16 row-major平面读写，宽高在+12/+16，+4..11仍不透明。平面起点依次20、20+2WH、20+4WH，不是按cell交错的6B。区域是[x1,x2)×[y1,y2)，读零补并保留请求步长，写只裁剪既有范围，第三层写入OR0xc000。独立MAP01入口继续限定magic/version1、正尺寸、原32MiB/4Mi-cell总界；不扩展旧parseMAP01的角色解释。[源](../analysis/game-legacy-world-v1/source-check.json)、[合同](../analysis/game-legacy-world-v1/implementation-spec.json)。

4ef580区域bytes前三个pipe列表，每列表comma cell；高字节成对跳过分隔符，首NUL为界。数值510f00每字符先×62，0..9/a..z/A..Z累积，任意位置minus设负号、非法0，机器int32折返后存uint16。独立要求每层精确矩形cell数、面积≤2601、cell≤99B/层≤18191B/输入≤32760B，超长拒绝，不复制原截断/未初始化或越界。校验固定每层前1458B、零scratch补足，第三层按mode掩位；不是任意rectangle字节数CRC。平面资源/碰撞角色、缓存初始化及当前版本待验。[原创向量](../analysis/game-legacy-world-v1/original-vectors.json)。

<a id="legacy-map-cache-layout"></a>

### SE 与 Item 共用的地图缓存布局

**事实**。固定 Item 的创建入口 `4A1F26` 与固定 SE 的 `45F760` 都由场景准备写出 `4D 41 50 01`。随后依次是场景传入的两个头值、宽和高，均为 LE32。三个连续平面从 20、`20+2WH`、`20+4WH` 开始，各格为 LE16，初始化为零。场景准备在 B 为零时跳过；复用要求头字段全匹配且 A 非 2。该复用分支只核头字段。 [源范围与路径](game-static.md#legacy-map-cache-io) · [创建与复用协议](../analysis/capability-first-v1/game-map-functional-specification.json#/legacy_map_cache_io/facts/creation)

**事实**。区域读写以原请求行宽索引输出或输入，以裁剪后的坐标寻址文件。有效越界读取留下零值，写入第三平面设置高两位。独立 MAP01 入口继续校验头、范围与精确长度。 [三平面回归与短体结果](validation.md#legacy-map-cache-io-validation)

Item 与 SE 的 256 项位反转表及 256 项多项式表已逐项核对。每平面的 1458 字节校验和现有模式掩码可共用，校验通知的文件与补取身份各按所查字段选取。 [校验与补取规格](game-static.md#legacy-map-notice)

非零 A 的同一个 B 在目录值变动后定位另一份文件，之后再检查对应文件头。A 为零的路径仍为 `map/0/B.dat`。 [目录值保存与覆写](game-static.md#legacy-map-context-reentry)

<a id="stage154"></a>
## stage154：文本field与特殊binary的边界

普通文本以空格划分token开始，CR/LF终止内容而不新建token，首NUL为C边界；数字为0..9/a..z/A..Z base62，字符串是源字节转义/成对高字节模型。不要据此命名字符编码、资源字段或业务对象。已见60发送/104接收字段顺序是source metadata，不是资源文件或图形数据。[目录](../analysis/game-legacy-message-v1/dispatch-catalog.json)、[规格](../analysis/game-legacy-message-v1/implementation-spec.json)。

特殊payload `]^i`后接4个signedLE16长度和4段bytes；`]Pk`后一个signedLE16和一段bytes，在普通正文转换前处理。只实现形状、正长度/范围与trailing计数，实际5187c0/518c30消费者和地图等含义待证；不将binary shape当资源解压已完成。无图形/地图/缓存格式变更，所有新流载荷/keys为原创夹具。[源核对](../analysis/game-legacy-message-v1/source-check.json)、[向量](../analysis/game-legacy-message-v1/original-vectors.json)。

<a id="stage153"></a>
## stage153：正文变换与初始块格式

普通wire payload按8B块重排/循环XOR，补字节0x11，解码最多去8尾0x11；源零值特例和实际尾值造成有损，不能借此解释图形/文本/业务字段。独立预算32760B确保外帧长度正域。初始块限定112B：16B头/64B AES-CBC块体/32B HMAC尾；只有解出64非NUL字节才建立codec，低nibble非0结果不属此profile。算法参数与边界见[规格](../analysis/game-legacy-transform-v1/implementation-spec.json)。

本轮无资源/缓存文件格式或renderer语义变更，固定128B派生输入仅从37c4文件事实绑定；正式原件、完整反编译/快照仍在私有build。原创24普通/6初始块/2拒绝/5任意wire夹具与公共标准基础向量均无真实账号/会话。[源核对](../analysis/game-legacy-transform-v1/source-check.json)、[原创向量](../analysis/game-legacy-transform-v1/original-vectors.json)。

<a id="stage152"></a>
## stage152：网络外帧与资源字节保持分层

旧版37c4真实wire格式为`AF EF | length:LE16 | opaque[length] | EF AF`，总长length+6。接收先从首AF确认至少8B；原MOVSX16使高位长度不安全，本实现只接0..32767。队列上限0x40000；严格错误/终止政策及小帧等待另见[规格](../analysis/game-legacy-network-v1/implementation-spec.json)。这不是资源文件头、RD压缩命令或已恢复的消息正文格式。

本轮没有改图形/地图/缓存格式，也没有将未知资源位置赋颜色/透明/动画含义。所有封包测试载荷来自原创Python生成，正式原件和完整REA反编译仍只在私有build。[源核对](../analysis/game-legacy-network-v1/source-check.json)、[24份原创向量](../analysis/game-legacy-network-v1/original-vectors.json)。

<a id="stage151"></a>
## stage151：普通Wise成员取得与游戏资源参数消费

**事实/容器：** REWise固定commit7e46db71…140af5、0.4.0-dev在本地构建；Wise9脚本200,288B/2369文件条目可由已取得头部读取。原源码默认header算法给dataOffset=165514；选定两游戏项起止+该偏移后，连续1,457,157B包含两个raw DEFLATE+4B尾CRC。原创reader要求精确输入/输出、无unused/unconsumed数据，尾CRC和脚本CRC双匹配，再核完整输出SHA。其代码和普通格式来自工具本身，不是游戏保护负载恢复。[材料与范围](../analysis/game-release-current-v1/legacy-acquisition.json)、[原创核验器](../analysis/game-release-current-v1/verify_source.py)。

**事实/游戏消费：** 新旧版45cfd0/44eba0处理graphic/anime/coordinate七家族文本前缀与文件名；37c4的Config.dat先以至多255B一行读取，再拼接输入字符串，按子串检查windowmode/onlyactive/soundoff/musicoff/3Ddevice:等。设备字段还有非零全局覆盖分支，不能直接承诺renderer效果。[首批静态合同](../analysis/game-release-current-v1/static-contract.json)。

**未验证：** 完整历史包、当前版本等价、RD命令实际解码/颜色/透明、MAP平面、动画与移动/战斗。本轮保留原raw及压缩结构模型的限制，没有据新材料放宽34个RLE越界案例。[REA与源字节核对](../analysis/game-release-current-v1/source-check.json)、[完整目标审计](../analysis/game-release-current-v1/goal-audit.json)。

<a id="stage150"></a>
## stage150：RD v1/v3有界命令结构模型

**事实：** 本地Joy图形/索引分别47,168,682/332,320B，V3分别68,321,498/781,840B，四份完整SHA匹配既有记录。27,785条压缩候选都在范围内，RD magic、u32le@4/@8与索引对应、u32le@12等于压缩记录长度；v1头16B，v3头20B，+16正数p且3整除、≤768。[源与限制](../analysis/game-rd-runs-v1/source-check.json)。

**推测/实现profile：** 高半字节0/1为literal，8/9/A为显式repeat，C/D/E为未知值run；低半字节及后续0/1/2字节按大端组成正count，repeat的值字节位于计数扩展前。literal只接受0/1，本语料未见0x2，不扩大支持。输出恰好width×height+p、输入完全消费；缺参数/literal、zero count、越界、欠长和未知命令均拒绝，不裁尾。输入32MiB、像素4Mi、p768B；与raw @12 opaque政策分开。[实施合同](../analysis/game-rd-runs-v1/implementation-spec.json)。

**保留未知：** literal/repeat才设置known=1，C/D/E保留mask=0，零占位不是已知色号。独立差分接受27,751条、原34条继续拒绝；接受记录累计未知像素142,343,812位置、未知palette1,163,863位置。第三方查看器选择F0并裁尾是它自身行为，不能成为本固定游戏的颜色/容错规格；固定commit与摘要见[源与限制](../analysis/game-rd-runs-v1/source-check.json)。颜色/alpha、方向、原点和动画仍待验证，原raw v0/v2和已有页面行为保留。[完整差分摘要](../analysis/game-rd-runs-v1/corpus-comparison.json)、[验收](validation.md#stage150)。

<a id="stage149"></a>
## stage149：Config.dat配置器来源格式

固定Config.exe401180写一个前导SP，随后`3Ddevice:{1..4} `，再依次可选`windowmode `、`onlyactive `、`soundoff `、`musicoff `；无换行/结尾NUL，12..52B。已有23B模板按新有界codec读取后可逐字节规范重写，原件不改写或放测试夹具。[源](../analysis/game-config-v1/source-check.json)。

401480只要求Read256并做C字符串/十进制前缀查找；范围外和失败状态未闭合。本codec首NUL内遵循已证子串/数字语义，未终止时以有界读末尾替代，显式报告unread/ignored字节，不能当原生栈行为。四开关/设备代码只为历史文件声明，不指派WebGL/Canvas或证明游戏效果。[接口](module-interfaces.md#stage149)。

对话框按[Microsoft DLGTEMPLATEEX](https://learn.microsoft.com/en-us/windows/win32/dlgbox/dlgtemplateex)及[DLGITEMTEMPLATEEX](https://learn.microsoft.com/en-us/windows/win32/dlgbox/dlgitemtemplateex)的UTF16可变字段、DWORD对齐和控件结构解释；只导出小型结构元数据，不导出图片资源，不称实际GUI渲染。[13控件/来源偏移](../analysis/game-config-v1/dialog-structure.json)。

<a id="stage148"></a>
## stage148：原创MOLIRES1资源封套

仅本地缓存，不是官方文件/通信格式；现有resources.v1/v2 schema及精确绑定保留。头48B：0..7 ASCII MOLIRES1，8..15 revision LE64（安全整数1..2^53-2），16..19元数据长度LE32，20..23总payload长度LE32，24..27文件数LE32，28..31必须零，32..47为MD5(header0..31+元数据)。之后是canonical ASCII JSON元数据，再按行顺序连接原文件bytes，无padding或尾随数据。

元数据精确`{schema,binding,files:[{path,length,md5}],trust:'unverified'}`，字段顺序固定；非ASCII UTF-16 code unit用小写\uXXXX转义，JSON恢复代理对，无平台TextEncoder/Decoder依赖。解码先校验头/长度/摘要，重建严格v1/v2快照、验证每文件MD5/路径树/别名/总预算，再按canonical文本精确比较；不接受重复键、额外字段或规范化后“相同”的记录。

元数据≤1MiB，payload≤64MiB，单文件≤32MiB、数量≤1024、路径≤259原有ASCII字符；总记录≤68157488B。覆盖全部原有最大数量/路径需要的元数据，没有缩小文件预算。摘要只有损坏检测；独立Python的6记录、完整64MiB与1024最长路径哈希对照通过。[实现合同](../analysis/launcher-wechat-resource-cache-v1/implementation-spec.json)、[测试](../analysis/launcher-wechat-resource-cache-v1/test-results.json)。

<a id="stage147"></a>
## stage147：当前进程计划与资源字节格式分离

当前备份程序命令使用源证实的Win32引用/反斜杠转义，单独保存明确applicationName和原workingDirectory；这属于原生调用者数据，不是新的游戏通信字段。规范ASCII路径+basename计划和任意字节转义器的覆盖范围不同；MBCS/非规范/嵌套路径与文件系统验证未实现。[字节合同](module-interfaces.md#stage147)。

固定195补丁清单/ZIP/MD5/资源候选v1/v2与目录缓存字节未改，调用者profile不改变资源绑定或认证含义。原版数据/运行均未加入交付。[源](../analysis/launcher-current-patch-v1/source-check.json)。

<a id="stage146"></a>
## stage146：ZIP基础资源与原PUK3候选格式保持

用户选择的资源ZIP复用已有decodeGamePatchArchive：ZIP存储/deflate、CRC/metadata/条数/压缩输出预算原样保留；每包1..64 central entries，压缩/输出各≤32MiB。文件名仍为opaque字节，基础导入按既有严格ASCII相对路径/大小写别名/文件树策略处理；directory只保留结构检查，不落盘。跨包合并不覆盖同名或大小写冲突，最终≤1024文件/64MiB。不是安装器、BZip2或解密功能，扩展名过滤不认证来源。[独立Python输入包](../analysis/launcher-wechat-patch-v1/original_resources.py)、[原创建向量](../analysis/launcher-wechat-patch-v1/original-resources.json)。

补丁清单继续固定195f3afd消费者的分块/create/append/replaceto/首重复字段/跳过规则，外层.bz2后缀仍由ZIP消费者解码，不推断为BZip2。所有所需包按原顺序处理，整轮archive输入/最终文件≤64MiB、单文件32MiB，原MD5校验保持；缺base/未知块仍按既有语义报告，候选不等于完整安装或来源认证。[原源规格](../analysis/launcher-v26/static-spec.json)、[接口](module-interfaces.md#stage146)。

显式选择后copySelectedResources使用既有资源v1/v2快照，保留raw目录MD5、game/reference/region/Galaxy原ordinal、Code原文本、Windows目录元数据、路径codec和所选源；固定备用源序号1进入v2，不能改为过滤后的显示0。未新增持久资源文件格式，候选仅页内内存，EXE即便作为数据也不运行/写安装位置。[验收](validation.md#stage146)。

<a id="stage145"></a>
## stage145：原创目录缓存MOLICAT1

此容器是项目自有本地格式，不是官方安装/网络格式；没有EXE、账号、密码、会话或来源认证字段。两份原始目录保留BOM、行尾及原编码，MD5只检腐坏，不认证来源。格式仍受原候选校验的XML256KiB字符、4096节点/深度8/字段等上限限制；1MiB raw/2MiB+44只是独立容器上限。

| 字节偏移 | 编码/含义 |
| --- | --- |
| 0..7 | ASCII MOLICAT1 |
| 8..15 | LE uint64 revision，仅1..2^53−2 |
| 16 | 0=utf-8，1=gb18030 |
| 17 | allowBareAmpersands，恰0或1 |
| 18..19 | 保留零，非零拒绝 |
| 20..23 / 24..27 | LE uint32游戏/区域原字节数，各1..1048576 |
| 28..43 | MD5二进制16B，覆盖头0..27和payload44..末尾 |
| 44..末尾 | 游戏字节紧接区域字节，拒截断和尾随数据 |

编码器/解码器均有独立byte ownership并重新核候选；非法header、revision、预算、摘要、编码或XML不返回部分目录。原创Python struct/hashlib/XML实现生成UTF8、GB18030补充平面、高32位和最大revision向量，JS编码逐字节相同，反向也由Python验证。[独立实现](../analysis/launcher-wechat-cache-v1/original_cache.py)、[向量](../analysis/launcher-wechat-cache-v1/original-vectors.json)、[接口](module-interfaces.md#stage145)。

native文件端口采用两个固定slot：选最新完整记录；同rev不同字节拒绝，另一slot损坏可报告恢复。写另一份并回读不等于原子事务、跨进程CAS或断电耐久性；未成功枚举目录/读取的错误不推作不存在，保留现有文件。[源码/测试](../analysis/launcher-wechat-cache-v1/source-check.json)、[验收](validation.md#stage145)。

<a id="stage144"></a>
## stage144：固定标准的目录字节解码与本地文件输入

目录编码显式utf-8或gb18030；新纯解码器与原凭据ascii/windows-936/utf-8分开，不能把CP936推断为完整GB18030。UTF-8拒绝overlong、孤立continuation、截断、surrogate及>U+10FFFF，仅消费第一枚开头BOM，其他标量/控制文本原样交XML解析。GB18030的0x80为Euro，完整23940双字节映射/207四字节范围，pointer7457→U+E7C7，39420..188999及>1237575拒绝，BOM作为普通U+FEFF保留。两种编码各≤1MiB，畸形fatal，未实现编码器/恢复替换。

来源为WHATWG/encoding提交`be17ac5c49881336538acfc7b40dba3c8009144b`，双字节表SHA256`746b3c55f1a8ec4b90b451f384437a17fd37cd51cd668456a28071a758d10784`、范围`874c6b6f6f74cf7d427ad228d5b41ddd9354fffd92a2259bf429f86e6baa7a1e`，表声明日期2024-09-18。当前WHATWG两字节采用2022映射并保留A3A0→U+3000；四字节采用其兼容算法，不能宣称等于任意Windows本地代码页。源码部分适用BSD-3-Clause，保留版权/完整许可及构建linked notice。[数据来源](../shared/vendor/whatwg-gb18030/provenance.json)、[生成器](../tools/generate-gb18030.py)、[许可](../shared/vendor/whatwg-gb18030/LICENSE.txt)。

本地EXE输入只在选择后有界读取实际字节，原件不改、不随成果附送；选择路径不入视图/日志，大小前后复核不是不可变文件证明。HTTP更新包复用既有ZIP/EXE候选校验，execution固定not-performed；目录元数据/裸MD5及HTTPS配置也不自动建立来源真实性。[源码合同](../analysis/launcher-wechat-bootstrap-v1/source-check.json)、[完整映射/无效输入检查](../analysis/launcher-wechat-bootstrap-v1/test-results.json)。

<a id="stage143"></a>
## stage143：宿主配置是显式本地JS文本，不是新协议

微信host本地配置为null或七字段JSON，XML是预先解码字符串（每份≤1Mi字符），输入/标签编码另明确为ascii/windows-936/utf-8。没有ACP/GB18030或文件hash推断；纯核心原XML、byteName排序、原Galaxy ordinal和record/type10/type11格式不改。四页文本是调用方提供、当前内存确认，未提交官方条款正文或许可记录。[接口](module-interfaces.md#stage143)。

构建生成runtime-config.js、原创建App/Page/WXML/WXSS、CommonJS和linked notice，均本地build，源配置不含凭据/真实AppID；空默认不连接。生成工程JS专项通过不代表WXML/原生平台编译通过，本轮SDK服务关闭前未载入模拟器。[构建](../wechat/README.md#stage143)、[实际工具回执](../analysis/launcher-wechat-host-v1/native-ui-audit.json)。

<a id="stage142"></a>
## stage142：微信端传原字节，资源与协议格式保持

微信薄适配不新增网络字段、编码或资源文件格式；current hello/challenge/record/type10/type11及选择门槛沿用既有REA合同。native Message的ArrayBuffer复制并分≤64KiB块供同一flow使用；只传owned字节，native write没有完成确认。输入/输出各4MiB与4096事件是独立支持预算，不是原协议新字段。[实施边界](../analysis/launcher-wechat-v1/implementation-spec.json)、[接口](module-interfaces.md#stage142)。

生成物为本地build下CommonJS模块/linked legal notice/输入哈希报告，不含官方资源、AppID或凭据，不是可发布小程序包。微信HTTP/目录/资源适配未增加验收，原游戏格式/业务缺口保留。[构建](../adapters/wechat/README.md#stage142)、[测试](../analysis/launcher-wechat-v1/test-results.json)。

<a id="stage141"></a>
## stage141：恢复日志的stage0来自文件查询，不是文件字段

既有16B header格式不变：stage1..5及stage XOR0xf016ea0b。原生读取器先把输出置0，首个属性查询无效可返回AL1/stage0；这不证明物理缺失，也不新增合法stage0字节。可见文件只读前16B、不检查尾随；shared继续精确16B子集，不静默吞坏header。[源](../analysis/launcher-recovery-state-v1/source-check.json)、[消费分支](../analysis/launcher-recovery-state-v1/static-contract.json)。

`.journal.new`、download/staging/backup/failed的路径角色复用stage101证据。读取阶段号不能推定目标存在、regular、已执行ACK或已恢复；delete helper只有allowMissing且错误2才接受查询不可见，move helper的destination查询无效也不是文件身份保证。本轮无格式/解析器变更或原生恢复执行。[接口](module-interfaces.md#stage141)。

<a id="stage140"></a>
## stage140：启动ACK资源声明与事件参数分开

PE32所选资源type10/name=`POLCN_LAUNCHER_ACK_PROTOCOL`，payload恰21B ASCII `POLCN_LAUNCHER_ACK_V1`，或22B且最后0。固定packed6d459原件的语言2052叶在file1662924/RVA0x420bcc，分析c82fc98在file3947016/RVA0x3dc808，均21B/SHA256 `4122b097cbfed54662bdaec7e0197b898801efaf2b0a1386fc2d4a6f701aeb80`。packed全资源工具因其他范围拒绝，不以所选路径通过替代全表/加载器验收。[原件与工具记录](../analysis/launcher-startup-ack-v1/source-check.json)。

shared实现只走root/type/name/language所选路径，独立约束唯一raw/virtual映射、64 section、累计2048目录项、256WCHAR名称；每个所选numeric语言叶都须相同合法marker，未采用Windows语言回退。重复/循环/大小写别名及畸形拒绝；无声明保留legacy，未遍历其他payload。该声明不是实际启动确认或签名。[规格](../analysis/launcher-startup-ack-v1/implementation-spec.json)、[独立Python合成夹具](../analysis/launcher-startup-ack-v1/make_vectors.py)。

原生`UPDATEACK:`参数另传UTF16事件名：生产者为自身PID+8hex nonce，消费者只约束前缀、32..128WCHAR及尾部hex/下划线。不能把资源marker、接管就绪事件或事件名字符串合并为同一成功位。[逐项合同](../analysis/launcher-startup-ack-v1/static-contract.json)。

<a id="stage139"></a>
## stage139：更新接管事件名是生命周期字段

当前父/更新器两端均使用UTF16格式`Local\POLCN_UpdateHandoff_%lu_%08lX%08lX`：十进制父PID、创建FILETIME的high/low两个大写8hex字段。父端来自自身GetProcessTimes，更新器来自经路径检查后打开的父进程；原字符串及调用范围已与原文件核对。这是正常请求的命名对象关联格式，不是账号、文件完整性、发布者或游戏认证格式。[源](../analysis/launcher-handoff-ready-v1/source-check.json)、[参数顺序与生命周期](../analysis/launcher-handoff-ready-v1/static-contract.json)。

现有资源文件/ZIP/更新日志解析器与预算不变，本轮不增加序列化器或命名事件执行端口；完整原生事务和后续startup ACK保留未验。[验收](validation.md#stage139)。

<a id="stage137"></a>
## stage137：五字段更新参数的ASCII实现子集

当前主登录器c82fc98的逻辑格式为decimal PID、编码URL、编码launcher绝对路径、原包长文字、原MD5，字段间单0x20；URL/路径内部0x20逐个转0x7c。原文禁止管道符/双引号/控制/DEL及首尾SP。输出不含CString存储层NUL，重复内部SP产生重复管道符，包长前导零和hex大小写保留。[源地址/文件哈希](../analysis/launcher-update-arguments-v1/source-check.json)。

纯encoder范围：ASCII、URL≤255B、路径4..259B、非0 UInt32 PID、包长数字1..10B/1..256MiB、MD5恰32hex，合计≤570B。strict own数据/非共享独立字节为工程政策；原MBCS locale、参数消费者完整异常、原生事务和来源信任未验。此参数上限不扩展现有32MiB包/HTTP预算，也未增加游戏资源或通信字段。[接口](module-interfaces.md#stage137)、[13新及663完整Node](../analysis/launcher-update-arguments-v1/test-results.json)。

<a id="stage136"></a>
## stage136：runtime来源标签和有界查询属于独立适配格式

runtime JSON `moli.loopback.v3`和初始化描述`moli.local-bootstrap.v1`新增sourceProfile标签，允许legacy/win32-current；旧描述没有该own字段时按legacy解释。当前页面要求二者一致，未知值不会回退旧协议。该标签不写入request10、握手或game IPC，不证明所传launcherBytes属于某发行版本。[合同](module-interfaces.md#stage136)。

current可把无法提供的旧XML字节明确表示为null（不是自动文件存在性判断），初始化仍顺序请求完整新双XML；空marker是请求成功证据，不解析为摘要对。current本机locator长度来自完整候选archive实际字节数，包结构仍既有Win32候选profile；原生替换/回滚未执行。rtm仅五个固定当前bootstrap路由的单规范uint32，其他query仍拒绝。原shared资源/通信格式和预算保持，未新增游戏业务字段。[源边界与政策](../analysis/launcher-current-page-v1/implementation-spec.json)、[实际验证](validation.md#stage136)。

<a id="stage133"></a>
## stage133：ApexClient.Dat的gzip外壳已证，成员格式未知

**历史核对（stage134）：** [stage40原记录](../analysis/diagnostic-preparation-v1/apex-static.json)已包含下列外/内层哈希和gzip完整性；stage133新增工具与格式检查，不是首次识别该材料。

**事实/样本：** 外文件500154B、SHA256`89fe1c4a907a06c68630b326c339240048272c927599f4e35aeaac8a39ca213c`；以1f8b08起始。普通gzip完整解压得到706686B、SHA256`668a1ab9143b9142c9e05b62ce6714131d7eb35fdf021b4ee69410962c29fb60`，尾部CRC32`0xfe667921`及ISIZE706686匹配，输入无尾随，原件未变。[实际回执](../analysis/game-material-gzip-v1/inspection.json)。gzip头、CRC32与ISIZE语义据[RFC1952](https://www.rfc-editor.org/info/rfc1952/)；ISIZE是展开长度模2^32，不是任意大输出的安全预算。

**工具合同：** [inspect_gzip_member.py](../analysis/diagnostic-preparation-v1/inspect_gzip_member.py)默认最多1MiB压缩输入、8MiB展开，额外探测1字节判断超限；仅接收一个完整成员且无尾随，CRC/长度/格式不符均明确拒绝。单成员与预算是本工具的范围政策，不当原游戏格式要求。使用[Python3.9 zlib接口](https://docs.python.org/3.9/library/zlib.html)的max_length、eof、unused_data/unconsumed_tail区分预算、截断和尾随，不用无界flush继续展开。此轮实际Python3.9.6、zlib运行/编译均1.2.12。

CLI要求绝对输入/新输出目录及预期SHA256；固定写member.bin和inspection.json，不采用归档内名字、不覆盖现有目录、输出后复核原件。完整目标内容只留本地build；运行示例需选尚不存在的输出目录：

```sh
python3 analysis/diagnostic-preparation-v1/inspect_gzip_member.py "$PWD/build/analysis/diagnostic-material-20261026-_9d1ephh/source/app/ApexClient.Dat" --sha256 89fe1c4a907a06c68630b326c339240048272c927599f4e35aeaac8a39ca213c --output "$PWD/build/analysis/gzip-review-new"
```

**成员边界：** 展开成员首部不为MZ，REA默认格式检测返回unsupported_target；19处MZ无完整MZ/PE配对，9处PE字样的候选头均不通过本次有界PE32/PE32+检查。字段依据[微软PE格式](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format)，候选检查的机器值/节数预算不作完整自定义格式或COFF对象解码器。格式、架构、入口、职责及原游戏消费者关系仍未知，不能由PE字样断言存在标准映像，也不能由失败断言没有内部代码。[候选字段与限制](../analysis/game-material-gzip-v1/material-audit.json)。

[10项原创测试](../analysis/diagnostic-preparation-v1/test_inspect_gzip_member.py)覆盖完整往返、损坏CRC、截断、拼接/尾随、输入/展开预算、无效输入/限制、错hash不落盘与拒绝覆盖保留原文件。本轮只增加分析材料的普通容器范围，未增加shared游戏资源/通信格式或受保护映像重建。[验收](validation.md#stage133)。

<a id="stage125"></a>
## stage125：固定代码段全零，不增加资源格式覆盖

游戏一次1753452B `.text` 读取得到 `TEXT_ZERO`，输出未创建，不能把固定长度当已取得的资源/代码样本。没有新的资源字节、格式字段、解析器或测试；原MAP01/RD等已证范围不变。[运行及边界](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)。

<a id="stage122"></a>
## stage122：资源格式与代码段覆盖范围未增加

本次具体游戏诊断已获确认，但输入恢复后 Mac 锁定，尚无新的原游戏代码段或资源字节。原 6624B 原创夹具资格保持其范围；固定游戏读取长度仍只是待执行合同，不是已取回的格式样本。解析器、合成夹具和协议矩阵未改，没有新增资源覆盖或测试。[实际边界](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)。

<a id="stage119"></a>
## stage119：原创代码段原文件直接比较通过

来宾fixture-text.bin为Archive、6624B，完整SHA256 `13da500e013b8455352dd26985f04d8a9c853af45584b0f53ba99b1eb146a9d9`；同一原始文件已按CreateNew留在私有build的stage118目录，没有用主机预期字节替代。按实际base0x00da0000与245个HIGHLOW修正后，全部字节相等。[返回](../analysis/game-text-observer-runtime-v1/snapshot-return-stage119.json)、[直接oracle](../analysis/game-text-observer-runtime-v1/host-oracle-stage119.json)。无新游戏资源格式或厂商代码快照；游戏1753452B固定范围仍是待执行方案。

<a id="stage118"></a>
## stage118：原创快照已有Windows读取输出，直接文件比较待完成

fixture成功stdout声明固定.text RVA1000、6624B、实际基址00da0000和SHA25613da500e…146a9d9；独立245个HIGHLOW计算的预期摘要相同。工具成功路径要求以CreateNew写固定fixture-text.bin，但本轮独立文件元数据查询未提交、文件未返回，不虚构文件级逐字节验收。没有新游戏资源/协议格式或厂商快照；原游戏固定范围与本原创夹具不能互换。[分层实证](../analysis/game-text-observer-runtime-v1/fixture-runtime.json)。

<a id="stage115"></a>
## stage115：私有代码段快照不是新的资源或协议格式

新读取器拟产生固定原.text虚拟跨度的原始字节，旁由stdout给出实际基址、RVA、长度与SHA256；文件没有自行发明游戏头或语义。游戏范围RVA1000/1753452B、原创fixture范围RVA1000/6624B，二者身份/大小独立绑定。只有fixture允许按其245个HIGHLOW修正计算预期字节，不能据此合成游戏代码。[固定配置](../analysis/game-text-observer-v1/host-validation.json)、[oracle](../analysis/game-text-observer-v1/fixture-oracle-validation.json)。

当前没有实际Windows快照。以后游戏字节仅留私有build/来宾实验目录，analysis交付只含原创工具/摘要证据；单读不是原子、稳定、完整解包、资源消费者或协议兼容证明。[限制](../analysis/game-text-observer-v1/README.md)、[验收](../analysis/game-text-observer-v1/validation.json)。

<a id="stage114"></a>
## stage114：resources.v2/v1真实浏览器往返，PDB索引仅作材料路径

事实：相同生产资源格式在真实IndexedDB中保存2个原创文件（含零字节文件）；v2来源0的页面重载和副本变异、来源1的浏览器正常关闭/重开、默认v1的正常重启、旧CAS拒绝和跨来源恢复拒绝均通过。未改变独立格式或容量；83项/35模块hash证明限定范围。[浏览器回执](../analysis/launcher-cache-source-browser-v1/browser-results.json)。

游戏PE的24B RSDS头从文件PointerToRawData核对，声明RVA与文件映射位置不同；无原.text文件代码可恢复。PDB依[SymStore签名/age及压缩名规则](https://learn.microsoft.com/en-us/windows/win32/debug/using-symstore)查两个精确名字均404，没有PDB格式解析或代码恢复成功声明。[游戏源](../analysis/launcher-cache-source-browser-v1/game-source-check.json)、[查询](../analysis/launcher-cache-source-browser-v1/symbol-observation.json)。

<a id="stage113"></a>
## stage113：实际378条更新清单与单ZIP游戏分析输入

事实：两份51700B Update.TXT均按既有字节语法解析为378块/378操作，312 create/66 append，无跳过块；原始SHA和规范字段摘要均不同，差异在一个资源size字段。旧256操作预算曾实际拒绝，现调整为512，与512块/256KiB及其他约束共同限制。该值是独立容量政策，不是native最大值。[原响应与离线重解析](../analysis/launcher-current-entry-v1/manifest-reanalysis.json)、[257/512/513边界](../analysis/launcher-current-entry-v1/test-results.json)。

原生`.bz2`路径实际返回ZIP：6000单包1578707B，既有严格ZIP/CRC解码产生唯一1757184B EXE，长度及MD5与所选清单一致；未按扩展名假定bzip2。输出使用固定私有文件名，没有依据归档路径写安装目录。[包与PE观察](../analysis/launcher-current-entry-v1/variant-observation.json)。

3000目标与现有9baa样本相同；6000的.text/.rdata/.data均RawSize0，原.text读取不完整，不能把虚拟长度当可反编译代码。完整资源事务、非ASCII/全部清单候选适配、原游戏协议及三平台可玩待验。[游戏范围](../analysis/launcher-current-entry-v1/game-capability.json)。

独立资源缓存新增按需resources.v2：固定来源的profile/ordinal进入键和存储；默认configured-only/0仍输出原v1。V1不接受来源字段，V2必须有合法成对字段；跨来源页面恢复和版本不匹配的拒绝已由新回归实证，浏览器持久化V2待验。

<a id="stage112"></a>
## stage112：type1/tag与双BE32布局已源绑定

5890c0应用体精确9B：偏移0为tag1、偏移1和5各为UInt32BE，随后经正常BE16队列及既有current record路径。587a50汇编传type2两个词，AA回调RET8确认两个参数；字段业务含义与版本用途仍待证。7处源锚点仅覆盖所列PE32原字节范围。[格式规格](../analysis/launcher-current-control-v1/implementation-spec.json)、[源核验](../analysis/launcher-current-control-v1/source-check.json)。

现有opaque编码/解析已符合该范围，45相关Node通过，没有新增游戏资源格式、产品解析器或合成测试。Windows安装版游戏hash与固定样本一致、Win7标记存在，原.text文件字节缺口及运行消费者仍未恢复。[前检](../analysis/launcher-current-control-v1/guest-preflight.json)、[验收](validation.md#stage112)。

<a id="stage111"></a>
## stage111：record长度/填充和编译常量版本差异

当前selector1表60756c为block8/maxplain32712/maxcipher32760；592300/59239f..3a8明确ceil(n/8)*8+8，旧472e70是floor规则。外头BE32(cipher,plain)，0/0空记录接收合法，声明前缀保留真实末尾零而忽略padding内容。public API对超单条上限拒绝而不复制原生部分消费，压缩/其他selector不覆盖。[合同](../analysis/launcher-current-record-v1/implementation-spec.json)。

6054d8的8336B ASCII解1042 Pi字与原已核标准LE32摘要一致，仅保存摘要，不把原表/程序/大段伪码放入交付。4原区间、13 ECB记录+最大摘要/3接收/3会话和65分片已核，78相关Node通过；不是新游戏资源格式或真实加密运行证明。[表核验](../analysis/launcher-current-record-v1/table-check.json)、[测试](../analysis/launcher-current-record-v1/test-results.json)。

<a id="stage110"></a>
## stage110：现行握手字节和新鲜配置编码

固定源g为字面2、p为6053a8处256B小写ASCII hex，三长度BE32各1..256，总缓冲784B；status0后字段1/256/256的实际响应529B通过现行解码，key回答/加密记录未实际发出。1<peer<p含p-1，独立向量与530分片覆盖；原生边界、工程20B指数和精确单challenge/错误策略分别说明。[公开数学参数](../analysis/launcher-current-channel-v1/public-group.json)、[规格](../analysis/launcher-current-channel-v1/implementation-spec.json)。不是新增游戏资源格式或地图/图片解码证明。

一次HTTP获取RegionList6421B/hash467e…cd58，声明UTF-8但严格解码在byte147失败；仅分析时显式GBK解码并验证字节往返，BIP/Port为ASCII。没有给产品引入静默猜编码/回退，也不能把XML编码推为A版账号字段ACP。原XML仅私有build临时材料，不入交付清单。[获取/编码/端点角色](../analysis/launcher-current-channel-v1/catalog-acquisition.json)。

<a id="stage109"></a>
## stage109：登录回复中的raw状态word与16位投影

新同hash源码再次确认type10的45B/18B/BE字、type11的<=32B字段、<=64名称和五个UInt32数组及双尾word。五列不是四列：中间适配器丢W0，UI使用W1..W4。16/10实参由汇编确认，保留tailWordB。[源格式/位置](../analysis/launcher-current-login-v1/implementation-spec.json)。

状态raw UInt32保留，原生以低16位存取并判0/-4；原工程canonical扩展限制已在两纯模块移除，计费/过期门槛保持。没有更改EXE/XML/地图/图像或资源格式解析器；仅新增精确固定PE32身份/5锚点只读校验器（节边界/RVA/raw范围受限），不是通用PE加载器。[原创48组格式向量](../analysis/launcher-current-login-v1/state-vectors.json)、[校验覆盖](../analysis/launcher-current-login-v1/source-verification.json)。

<a id="stage108"></a>
## stage108：旧更新器依赖资格与自更新后文件身份

首次运行四旧文件hash相同；补库后的新流程把登录器由599040B/109b…ef0e变为1666048B/6d459…c987，RegionList由0c94…8438变为467e…cd58，更新器46080B/4c46…4976及GameList/be8f…f85a保持。新版EXE与重新hash的保留公开ZIP载荷及REA分析源对应。[新运行前后hash](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)、[版本桥接](../analysis/game-install-context-v1/updated-source-bridge-stage108.json)。

官方bundle只在离线静态CAB/MSI边界内提取三项PE32/x86 DLL；旧更新器258个指定导出均存在，无转发项。只读D介质四文件完整hash通过，WindowsValid只针对外层包，不等同每个DLL签名或完整ABI证明。三项拷贝无覆盖且hash匹配；原四备份须-force才能列全隐藏更新器。[来源/格式边界](../analysis/game-install-context-v1/vc71-source-stage108.json)、[导出资格](../analysis/game-install-context-v1/vc71-static-stage108.json)、[实际介质](../analysis/game-install-context-v1/vc71-guest-media-stage108.json)。

最终force顶层列表还包括LauncherUpdater.log330B、Log.htm829B、Update_Log.htm768B、PlayOnline.ini225B；未读日志/INI正文，不从长度推导内容或临时文件历史。本阶段未修改资源解析器/格式覆盖范围。[验收](validation.md#stage108)。

<a id="stage107"></a>
## stage107：三源文件与嵌入更新器身份复核

原平台包三选定输出重新extract+test，4377B GameList和6205B RegionList的完整hash与既有源相同；本轮尚未回读正常安装XML的完整hash。登录器普通UPX输出同hash后，REA完整资源树中的BIN_DATA/143、语言2052、offset904860、46080B与来宾更新器完整hash相同。未改解析器或扩大格式/编码覆盖，未把厂商图片/资源正文加入成果。[提取](../analysis/game-install-context-v1/source-recheck-stage107.json)、[资源证据](../analysis/game-install-context-v1/rea-bridge-stage107.json)。

<a id="stage106"></a>
## stage106：仅补当前固定包的许可字段定位

平台固定解压header0中，许可原字节位于offset592、长2531，前置u32一致；后接两个零长度字段及3416/IFPS，起点3135与旧证据相同。所选文本GBK严格回转，私有UTF8副本3737B，实际UI首尾相符。不是通用Inno/编码支持或游戏资源/网络格式扩展，完整条款不进成果清单。[字节与私有副本身份](../analysis/game-install-context-v1/platform-license-stage106.json)。

<a id="stage105"></a>
## stage105：原创PE固定配置表的所选核验范围

新增构建工具只读取本次原创PE32中的三行profile表：32位指针引用ASCII名称、UTF16路径、32B摘要及ImageSize，与先行计划逐值核对。实际中文安装路径和final-path前缀均相符；既有PE布局检查也通过。这不是通用PE解析器、厂商代码恢复或新增游戏资源/网络格式覆盖。[编译后表](../analysis/game-entry-v1/observer-build-stage105.json)。

实际安装目录数量/总字节与源加两卸载文件一致，仅四个关键文件做完整hash。安装没有改变固定游戏原.text缺少文件字节的边界。[安装覆盖范围](../analysis/game-install-context-v1/guest-installed-context-stage105.json)。

<a id="stage103"></a>
## stage103：IFPS23安装脚本的静态覆盖范围

两个解压header0中前置u32长度与IFPS片段精确匹配：游戏3778B、平台3416B；各28B头均为magic1397769801/version23/types46，函数数28/24、globals3。完整头值、blob/hash及解压头相对偏移见[提取记录](../analysis/game-install-context-v1/compiled-extraction-stage103.json)。这些不是游戏资源或网络帧格式。

固定上游读取器静态解码表/所选Unicode值、S32、直接Call和Compare；7项原创输入覆盖导出名/Ret、Call索引、UTF16含代理对、负整数、GT/零及选定非法头/指令/索引。不是全部IFPS版本、全部坏输入或VM执行验收。两函数体范围与8原字节锚点独立核对，类型/签名推断另列，完整脚本不交付。[检查](../analysis/game-install-context-v1/reader-qualification-stage103.json)、[所选函数](../analysis/game-install-context-v1/install-conditions-stage103.json)。

<a id="stage102"></a>
## stage102：安装元数据及只读数据介质

固定两包均被核验上游innoextract1.9 debug识别为Inno6.1 Unicode；此版本仅初步支持6.1。Path值的`{<00>a<00>p<00>p<00>}<00>`是带零字节的工具显示，UTF16LE解释为{app}属于派生解释；目录常量、NoWait/条件postinstall只是安装声明。完整条款、编译Pascal及厂商二进制不进入成果。[覆盖/边界](../analysis/game-install-context-v1/installer-metadata-stage102.json)、[上游](https://constexpr.org/innoextract/)。

数据ISO为1106515968B、SHA-256 `e013e939d934471787b78c7c388e5a704eb133fc29cc9b53c0cb6325f9a6a2d8`，PVD/Joliet卷标MOLIINST102，精确两原安装包及原创README.txt209B，没有autorun或boot描述符。初次只读验证在卷标NUL填充解码处失败；保留同一ISO，修正仅去除空格/NUL后完整回读成员和两原件，未重建镜像。[介质身份](../analysis/game-install-context-v1/media-stage102.json)。

Windows实际将本地ISO挂为E: CD-ROM，三个成员ReadOnly、两安装包完整hash相同；[微软文档](https://learn.microsoft.com/en-us/powershell/module/storage/mount-diskimage?view=windowsserver2025-ps)说明ISO挂载为只读。实际结果不代表安装/执行或游戏资源格式已新增覆盖。[来宾回执](../analysis/game-install-context-v1/transfer-session-stage102.json)。

<a id="stage101"></a>
## stage101：原创 PE 零填充区的覆盖边界

这里只修正原创分析fixture，不改变厂商文件或游戏资源格式。旧fixture最后节与上一节有RVA空洞，Windows实际拒绝创建。修正版`.slots`从RVA`6000`连续覆盖VirtualSize`e5fdc0`，RawSize/RawPointer均0；两个32位槽仍在`e65db8/e65dbc`，完整ImageSize`e82000`，文件129968B。链接脚本的固定起点受构建检查约束，编译器布局漂移时停止，不能静默修改header。[构建身份/布局](../analysis/game-entry-v1/observer-build-stage101.json)。

依据[微软PE节布局要求](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format)，新增检查覆盖本工具的页对齐x86 PE32节相邻/范围/原始区与映像大小；不是通用PE加载器或所有Windows加载条件证明。旧拒绝fixture、可运行observer及其空洞/重叠变体4项回归，加上实际Windows新样本结果分别留证。[回归](../analysis/game-entry-v1/layout-validation-stage101.json)、[运行](../analysis/game-entry-runtime-v1/windows-observer-stage101.json)。

<a id="game-stage96"></a>
## stage96：运行回调槽的字节观察边界

**事实：** 固定游戏SHA9baa0d26…的静态VA1265db8起两个uint32（cleanup/entry），RVAe65db8，总8B；静态分析块返回全零。writer119591a/1195923与call1197031/1197056有源字节证据。这里是运行注册元数据，不是资源容器、帧格式或可直接调用ABI。[来源](../analysis/game-entry-v1/static-audit.json)。

准备的工具仅按实际模块基址读取这8B并输出数值/页元数据，Windows未实测；它不解引用代码或资源。原创fixture与工具、无autorun ISO均仅在本地build，交付只含原创新源和元数据。现有地图/库存/图像解析范围保持，未由维护开关/槽值推导游戏消息、认证或状态规则。[工具契约](../analysis/game-entry-v1/observer-plan.json)、[构建运行](../analysis/game-entry-v1/probe/README.md)。

<a id="launcher-stage95"></a>
## stage95：POLU 更新日志头

新updater7eb173b0…与旧22d56137…仅26B COFF/debug时间戳及RSDS GUID不同；完整.text/.data/.rsrc/.reloc原字节相同，.rdata差异也已定位，不能将hash变更直接解释为逻辑改变。[差异分类](../analysis/launcher-update-recovery-v1/byte-comparison.json)。

选定日志格式为16B：四个小端uint32，magic0x554c4f50（POLU）、version1、stage1..5、check=stage XOR0xf016ea0b。API名为parseWin32LauncherUpdateJournalHeader，只接受精确header，不是完整原生文件解析器；原生读前16B可忽略尾随，原创向量明确两例差异。不存在/空文件/读取失败不伪装为阶段0。[源锚点](../analysis/launcher-update-recovery-v1/static-audit.json)、[27原创向量](../analysis/launcher-update-recovery-v1/original-vectors.json)。

结果只含recordedStage/recordedPhase及一致性元数据，fileState未检查、ACK未证明、recovery未执行、authentication未验证。未修改其他资源解析器或持久格式，未复制原程序载荷/反编译源码到交付。

<a id="launcher-stage94"></a>
## stage94：新公开包与运行后身份

公开ZIP1638897B、SHA256 e73ffdbcc53e3377016d07890cdca99168c934d0335c555d61d21c955b3b1108，单个DEFLATE普通EXE条目1666048B、SHA2566d459ddbdf80a86cf7a1e41b99ab7fb575b42842d7163522efb3c9fa6e6ac987，MD5为9c88646172a022046c9c1bffa03608dd。Python/CRC/声明包长及既有decodeWin32LauncherUpdatePackage逐字节对照通过；guest最后同大小/hash。HTTP/MD5只是字节一致性，非发行方认证。[包及范围](../analysis/launcher-current-runtime-v4/new-candidate.json)、[纯核心对照](../analysis/launcher-current-runtime-v4/new-candidate-core.json)。

UPX派生副本4111872B/hashc82fc98d…；资源BIN_DATA143/2052偏移3034136长814080，hash7eb173b0…不同于旧同长updater。ACK资源偏移3947016/21B/hash4122b097…，manifest偏移3947040/746B；只是静态资源身份。原EXE/资源载荷留在私有build，不加入成果。[完整资源hash/位置](../analysis/launcher-current-runtime-v4/static-audit.json)。

未修改ZIP/XML解析器范围。新增refresh仅复用现有候选格式和IndexedDB单记录pair/revision；不把原生rollback marker当浏览器格式，不新增游戏资源字段。

<a id="launcher-stage92"></a>
## stage92：新版自摘要与 locator 元数据

当前样本SHA256为71180e5bdda771e7d57dd27d2b879beddee55d61b957dadf7a2da60c907cb69a（packed），派生分析副本为c7ba69f77809fe589fd5dcccc78fcd4f33d4b6f76325d00a27f37032bbb32384。自摘要先按SP/CR/LF集合去尾/头，再截32字节；规范md5小写值与用于原版比较的原始大小写正文分开。独立解析额外要求完整响应在4096B内、ASCII非NUL、前32位均为hex；原样本畸形字节失败时机不在覆盖范围。[源字节/函数范围](../analysis/launcher-current-metadata-v1/source-check.json)。

locator取classic六种ASCII空白分隔的前两token，保留URL和十进制长度文本。有效交接URL限255B、HTTP/S前缀及原生字符子集，长度文本1..10位且值1..268435456，前导0保留；128token为独立预算。原生前缀检查不等于完整URI、来源授权或可下载。候选下载限32MiB，并继续要求真实archive长度等于声明值、单EXE、CRC/MD5与Win32头子集，不证明可由Windows加载。[63份原创格式向量](../analysis/launcher-current-metadata-v1/original-vectors.json)。

新版配置marker在所观察完整worker中只有请求成功消费者，不解析成两份摘要。两份XML下载后各按明确编码和现有格式规则解析，再比较原始字节；本地计算MD5不是服务器真实性或新配置签名证明。未存官方配置正文或完整反编译源码到交付。

<a id="launcher-stage91"></a>
## stage91：新版配置对与原生暂存标记观察

新版样本的结构门槛是大小写精确的`Gamelist`→直接`Games`、`Regionlist`→直接`Regions`；容器可空，业务字段不是该门槛的检查范围。独立纯检查复用既有单根、256K字符/节点/深度/实体限制，内部处理指令不支持；输入是调用者明确解码的文本，不推断原生ACP/编码等价。[原样本与偏移](../analysis/launcher-current-catalog-v1/source-check.json)。

观察到`GameList.xml.new`、`RegionList.xml.new`、双`.xml.rollback`及`Catalog.rollback.pending`。提交helper仅双原件都存在时创建并flush空marker，再顺序替换两原件；恢复入口有marker才要求双备份复制/重载后清理。这些是静态命名/分支事实，不是新增交付文件格式、原子更新或崩溃持久性证明。新字节比较1MiB/file是独立预算，无XML解析/磁盘操作。[审计](../analysis/launcher-current-catalog-v1/static-audit.json)、[接口](module-interfaces.md#launcher-stage91)。

<a id="launcher-stage88"></a>
## 新版单EXE包与Win32 GUI头profile（stage88）

**事实：** 更新器 `22d56137a48d3c95f4a779c5c68ba85b3ea4fe2439e3e561159d003c697ce479` 的405c40只接一个普通条目，名称405ab0至少4字符、末尾忽略大小写.exe、无斜杠/反斜杠/冒号；解压1..64MiB，正压缩长度时output≤200×compressed+1MiB，MD5必须相同。新共享接口保留既有32MiB ZIP/输出预算与有界结构要求，并明确收窄为可打印ASCII名称。[源证据](../analysis/launcher-current-updater-v1/static-audit.json)。

| 位置 | 有界读取/值 |
| --- | --- |
| DOS +0 | 先具备64字节，uint16 LE MZ=5a4d |
| DOS +0x3c | uint32 LE e_lfanew，64..0xfffff，后面完整248字节仍在输出内 |
| NT +0 | uint32 LE PE signature=4550 |
| NT +4 | uint16 LE Machine=14c（i386） |
| NT +24 | uint16 LE OptionalHeader.Magic=10b（PE32） |
| NT +92 | uint16 LE Subsystem=2（GUI） |

这些是已观察头字段，不验证section/入口/导入/完整PE/签名或可执行性。原创无section夹具通过即为该边界的显式证据；不把MZ文件都视为可运行游戏。真实包输出与Python逐字节一致，PE偏移296；未运行。[向量](../analysis/launcher-current-updater-v1/original-current-update-vectors.json)、[真实包](../analysis/launcher-current-updater-v1/real-candidate-check.json)、[接口](module-interfaces.md#launcher-stage88)。


## 当前游戏侧证据边界（stage76）

本阶段只核验Code11命令行缓存及常量引用，不修改资源格式或解析器。注册类命令文本不能解释MAP01平面、图形ID/颜色、压缩RD或动画语义。原始MAP01与RD0/2的已证覆盖保留，压缩/渲染与游戏消费者仍未验；资源预览不作为游戏实现。[本轮来源审计](../analysis/game-consumer-v1/source-audit.json)、[静态规格](../analysis/game-consumer-v1/static-spec.json)。

<a id="launcher-v30"></a>
## 当前首次Config计划与刷新元数据（stage75）

ConfigEXE正文保存在`configurerText`，保留解码后斜杠/边缘空格；规范文件元数据`files.configuration`不变。首次Config lookup section是当前用户名原bytes的小写MD5，key为`Game{原Code}_Config`，分别补NUL，默认Profile整数1。原Code含前导零不消除；section为账号派生身份，不能作匿名化、签名或认证证明，本轮仅原创向量，无真实Profile读取/写入。[源规格](launcher-static.md#launcher-v30)。

非零标记及非空ConfigEXE生成原目录+反斜杠+正文+NUL，cwd目录+NUL；不追加Argsline或quote。skip时无配置进程数据；等待/写0只作效果意图。16B用户/4096B字段、10位Code/0..14及非NUL/非共享为声明profile，旧原生路径/ACP不由此等价。24Python向量/9结果及固定XML24条件通过。[接口](module-interfaces.md#launcher-v30)、[参考](../analysis/launcher-v30/original-first-config-vectors.json)。

onlyRefreshWord为进程输入的可选own uint32，页面仅提供0/1且不持久化；不进入请求类型10/资源缓存新字段。CG非零时资源组不读取，命令无资源追加并不请求游戏进程；映射producer仍独立。真实游戏消费仍需后续联合验证。[验收](../analysis/launcher-v30/validation.json)。

<a id="launcher-v29"></a>
## 保留独立资源快照和缓存格式（stage74）

pure模型为`{schema:'moli.launcher.resources.v1',binding,files:[{path,bytes,md5}],trust:'unverified'}`；bytes是owned Uint8Array，生产中不JSON/base64化payload。binding准确保存XML摘要对、game/reference/region原ordinal、原Code正文、规范Windows目录、明确路径编码和可选Galaxy ordinal。固定顺序JSON只用于比较非秘密binding identity；不存账号、确认、原进程对象或文件句柄。[接口](module-interfaces.md#launcher-v29)。

创建与读取复用既有相对ASCII路径/大小写别名/树冲突规则及1024文件/单32MiB/总64MiB预算；全file MD5重算。读时root/binding/file准确keys、规范路径/绑定、schema/trust与摘要均检查，空文件/空快照支持；目录/编码或XML摘要变更不能隐式复用。此为独立浏览器缓存格式，不是安装包格式或可信签名。

IDB外层是`{key:'selected',schema:1,revision,resources}`，版本从1递增；单snapshots对象仓、无indexes，事务内验证旧记录/CAS再写完整记录，completed才确认。Python两份独立向量核MD5/JSON key，真实Chrome重载/恢复及坏记录/未来版本保留通过。[向量](../analysis/launcher-v29/original-resources.json)、[契约](../analysis/launcher-v29/implementation-spec.json)、[验收](../analysis/launcher-v29/validation.json)。不覆盖完整安装规模、跨配置迁移、流式或真实配额耗尽。

<a id="launcher-v28"></a>
## 保留页面补丁文件与元数据格式（stage73）

原Update.TXT/ZIP/三操作格式不变。浏览器基输入为共同根目录下的File.webkitRelativePath和原Blob内容；适配器先剥一个根、检查路径/别名/树冲突及1024文件/32MiB各/64MiB总预算，再读拥有的bytes。候选审阅只显示相对ASCII名字和byte长度；选择后的路径列表进入已有资源枚举适配，payload不进入命令、映射、缓存或交换。[接口](module-interfaces.md#launcher-v28)。

可选运行描述为`gamePatch:{schema:'moli.local-game-patch.v1',allowedOrigins:[...]}`，只接受精确数字回环HTTP origin，与所选PIP/PPort独立核对；未配置时不出现该字段。无补丁选择的原安装文件夹仍仅取文件名，基文件夹才读内容。原创夹具最终`Bin/GraphicInfo_8.bin`为58字节，通过PythonZIP/MD5、实际FileList追加及浏览器交接核验；不是官方资源格式或安装写入证明。[契约](../analysis/launcher-v28/implementation-spec.json)、[原创向量](../analysis/launcher-v28/original-ui-patch.json)、[验收](../analysis/launcher-v28/validation.json)。

<a id="launcher-v27"></a>
## 保留补丁生产与请求格式（stage72）

**事实：** 原Code文本与PatchEXE分别是game+1b80/+1b84；PIP/PPort是region+24f8/+24fc，选择后到当前+1b34/+1b38。原PatchEXE经大写与全部`.EXE→.BAK.EXE`，命令是directory、反斜杠、备份名、空格、PIP、空格、PPort，附NUL，无引号。原Code/PatchEXE形成相对打包复制源，不能误把Code槽当安装目录。[来源](launcher-static.md#launcher-v27)。

新model.patcherText保留解码后的原斜杠/空格，files.patcher保留规范路径，两者用途不同。生产端只承认ASCII/C大小写；目录编码仍需明确选择，不能由XML编码推断原ACP。native退出100/101/102只是更新状态，不能据100补造签名或认证。

HTTP按已证`/cg50/Update.TXT?t=`与`/cg50/<path>/<name>.bz2?time=`，空path仍保留双斜杠；包消费者仍是ZIP。显式signed32秒、仅一个已许可origin、URL特殊字符拒绝和总deadline是独立profile；无隐式后备站点/URL编码。顺序迭代不改v26清单/ZIP/摘要格式和严格候选政策。[接口](module-interfaces.md#launcher-v27)、[32生产/21退出码向量](../analysis/launcher-v27/original-entry-vectors.json)。

<a id="launcher-v26"></a>
## 当前Patcher清单与包格式（stage71）

**事实：** Update.TXT先按space/TAB/CR/LF trim、`}`分块，每块依次全删CR/TAB/space/精确`{\n`并trim；按LF分命令/字段，恰好2个冒号分段才进入字节区分大小写map，重复key保留首次。切分保留内部空段、丢末空段，不能用普通filter(Boolean)或INI/XML解析替代。name/md5/path/old_name的消费者与工厂虚表见[REA](launcher-static.md#launcher-v26)、[28源锚点](../analysis/launcher-v26/patch-anchors.json)。

**事实：** URL字面`.bz2?time=`，消费者是classic ZIP EOCD/中央目录和逐条解包，不是后缀推断的bzip2。纯核心覆盖stored/raw-Deflate、已有ZIP前缀/描述符/CRC规则、目录首项及全条目；原自更新首普通条目规则保持。严格拒绝ZIP64/加密/多盘/未知方法/损坏CRC、路径越界和文件目录别名，输出/输入预算另见[接口](module-interfaces.md#launcher-v26)。

**独立政策：** parser保留非NUL高字节字段，候选路径仅相对ASCII；未知ACP/DBCS未实现。最终全MD5与内存原子候选不代表原流程相同行为或来源认证。原创Python31语法/10ZIP场景、Node457/Chrome同向量与8坏包通过；没有官方补丁包、资源或大段反编译加入交付。[验收](../analysis/launcher-v26/validation.json)。

## 当前RegionList的Galaxy结构（stage70）

已证结构为Region内Galaxylist，子Galaxy有Name与Gamecode属性，叶正文为附加参数。新模型保留解码后的名称/正文及Gamecode原文和原ordinal；选择时按数值Code过滤，正文不trim。独立约束15条/槽0..14/非空Name，跨同区域同名禁选；不把Name当服务器认证名或BIP地址。[源规格](../analysis/launcher-v25/static-spec.json)、[63原创向量](../analysis/launcher-v25/original-galaxy-vectors.json)。

固定4377B GameList/6205B RegionList与旧hash一致，5游戏/12区域/8可用选择和5消息向量复验通过；RegionList无Galaxy数据。新增6条分组浏览器夹具均原创，不加入真实服务配置/资产。Gal正文按明确路径profile进1b4c对应额外参数，资源文件名处理规则不变。[旧配置回归](../analysis/launcher-v25/fixed-config-regression.json)、[验收](../analysis/launcher-v25/validation.json)。

## 当前浏览器目录到资源快照适配（stage69）

FileList原生webkitRelativePath提供显式选定root内的相对名字；v24只读此元数据。单root/≤32768文件，拒绝dot/空段/反斜线/冒号/控制与ASCII大小写重名；精确Bin/Puk2/Puk3父目录与anime/graphic前缀、.bin后缀，coordinate仅Bin。按提供顺序送入v23转换，每组≤4096条，synthetic normal-file属性32不作为Windows真实属性。无匹配时enumerated空组，不冒称原FindFile失败。[适配契约](../analysis/launcher-v24/implementation-spec.json)。

实际Chrome选择6个原创文件名，5项进入七组并随候选生成完整命令数据；payload内容未读取/上传，不能当资源完整性或游戏读取验收。Windows目录用已有保守路径政策，三种路径编码明确选，独立于账号/XML；不是完整Win32 wildcard/8.3/locale/顺序/文件系统等价。[验证](../analysis/launcher-v24/launch-browser.json)。API语义参考[MDN目录选择](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory)、[WICG规范](https://wicg.github.io/entries-api/)，实际支持仅本轮Chrome范围。

## 当前资源文件名到参数的生产规则（stage68）

固定登录器408840对七组Bin/Puk2/Puk3的anime/graphic及Bin/coordinate枚举结果变换。每条先GetFileTitle剥末扩展名，再排普通目录；dot目录先排。非目录title执行小写、最后index>0下划线改冒号，以及info→infobin/graphic→graphicbin/anime→animebin/coordinate→coordinatebin的首家族全量替换，每条带一前导空格；不排序/去重，最后一条也处理。`GraphicInfo_Joy_22.bin`→`graphicinfobin_joy:22`，唯一首位`_`保留。[源规格](../analysis/launcher-v23/static-spec.json)。

独立核心只接受显式ASCII/C标题profile与已枚举快照，不扫描/匹配或解码资源内容。5个既有提取basename/大小/摘要及转换已对照，未加入资产字节；该局部材料不是完整安装、相同版本或游戏接收证明。[名字观察](../analysis/launcher-v23/resource-name-observations.json)、[原创新向量](../analysis/launcher-v23/original-process-vectors.json)、[验收](../analysis/launcher-v23/validation.json)。

## 当前映射写入前缀格式（stage67）

v22实现生产端：`gid:`＋raw所选name＋` glt:`＋opaque首NUL前bytes＋`:`＋uint32(tailWordA−80000000h)的小写base32＋空格＋NUL。name支持1..41B非NUL、opaque0..32B；字符编码不在此重新推断。数字0写单个0，无leading zero/符号；lowercase alphabet0..9/a..v。最大92B，容量常量256；只写前缀，不虚构已存在映射的剩余bytes为零，也不生成argv。[源锚点](../analysis/launcher-v22/handoff-anchor-audit.json)、[契约](../analysis/launcher-v22/implementation-spec.json)。

21固定源码锚点、Python94标量/126写入向量和42项原创回包选择投影、Node390通过。四个静态辅助函数和partial caller/共享body边界见[REA](../analysis/launcher-v22/static-spec.json)。字段来源已知而身份/opaque语义和游戏读端仍未知；没有实际共享内存/凭据样本或原游戏资源加入成果。[验收](../analysis/launcher-v22/validation.json)。

## 保留模式设置记录（stage66）

新增独立浏览器偏好格式，固定key/schema均为`moli.launcher.preferences.v1`，唯一数据字段userMode为primitive整数1或2。canonical JSON只有schema/userMode两项与固定顺序、≤128 UTF16字符；限长先于parse，逐字规范回编码一致，未知版本/额外或重复字段/转义key/空白变体/无效mode拒绝。记录没有账号、密码、checkbox、账号编码或文本确认；不是原INI格式或新网络字段。[纯核心](../shared/README.md#launcher-v21)、[契约](../analysis/launcher-v21/implementation-spec.json)。

默认/无效只读不写，明确保存可替换本key；set/get回读一致才报告保存，其余受控未确认或不可用。普通Storage后写覆盖、无原子CAS/自动回滚/断电耐久性承诺。刷新只恢复模式及模式默认标志，其他输入状态重新开始。原16B账号/41B名称、三profile与XML编码边界保持。26原字段字面偏移及2析构CALL/4展开JMP已独立核对，不能扩大成全局无账号存储或内存清零。[静态审计](../analysis/launcher-v21/credential-operand-audit.json)、[验收](../analysis/launcher-v21/validation.json)。

## 保留文本编码与映射数据（stage65）

原协议字段未变：账号各1..16B，候选名称1..41B，排序按原bytes。新增独立显式ASCII/Windows-936/UTF-8→bytes与严格名称decode/reencode；原ANSI/16B事实不能推定实际ACP，XML UTF-8/GB18030选项独立。无trim/规范化/best-fit/替换，拒绝控制、孤立代理项和畸形编码；UTF-8 BOM作为标量保留。[契约](../analysis/launcher-v20/implementation-spec.json)。

936源表Unicode/Microsoft CP936.TXT version2.01/Unicode2.0，日期原文`1/7/2000`不另解释；817310B/SHA256`b86f601c575e9ab457380b6f7abef03c75499cc6075bdc8b4b27f3f2de74bf6a`。公开映射21920项=128 ASCII+80 Euro+21791双字节；生成表23940个UTF16单元，lead81..FE/trail40..FE跳7F，零标未分配，共2149，拒绝GB18030四字节及未支持扩展。不宣称现代Windows PUA或best-fit等价。Unicode License V3随表保留；[依赖/生成表哈希](../analysis/launcher-v20/dependency.json)、[生成器](../analysis/launcher-v20/generate_cp936_table.py)。原源表仅私有build，无运行时下载。

Python独立gbk逐项对照双字节/未分配，80 Euro按源单列；1037原创UTF-8标量另验。Node369和实际中文浏览器交换通过。[参考](../analysis/launcher-v20/encoding-reference.json)、[验收](../analysis/launcher-v20/validation.json)。没有把官方EXE/游戏资产加入交付；历史详细回执事故见[限制](../analysis/launcher-v20/artifact-output-incident.json)。

## 保留配置与初始化输入（stage64）

v19没有扩大原游戏资源/登录字节格式。配置Code数字原文（含前导零）用于许可section，数值用于类型10；重复Code按ordinal保留。区域BIP tuple全部匹配显式允许列表，不能从XML自动获得连接许可。ASCII1..16B与原有XML UTF-8/GB18030选项分别保留，实际账号ACP未知。[REA事实](../analysis/launcher-v19/reused-native-spec.json)。

新本机初始化源只接显式bytes：local launcher0..32MiB/local双XML0..1MiB，remote双XML各1..1MiB/metadata1..4096B，可选package1..32MiB，合计≤36MiB。固定同源路由/描述符为独立适配协议，package定位文本只用于原创源；已有主摘要/两摘要/ZIP/CRC/MD5格式和优先顺序不变。候选仍为完整原bytes/摘要/解析选项pair，缓存不含账号、文本、目录或选择序号。[契约](../analysis/launcher-v19/implementation-spec.json)、[验收](../analysis/launcher-v19/validation.json)。官方原件/解包内容不随成果分发，也没有执行候选。

## 当前输入与本地传输格式（stage63）

v18没有扩大游戏资源或原登录字节协议。REA复用ANSI DDX→CString<char>→16B检查并新增CRT GetACP调用证据，实际代码页仍未知；新UI仅编码可显示ASCII U+0020..U+007E、各1..16B，不把XML GB18030当账号编码。四份明确本地文本分别非空≤64KiB、UTF-8 fatal、拒绝NUL、textContent显示，全文不进入成果/存储，原创测试说明例外。[静态证据](../analysis/launcher-v18/static-spec.json)。

开发桥接使用独立JSON v1授权/ready/written序号/eof/受控failed与原始binary bytes。控制字段均不写进原类型10或游戏数据；原challenge/记录格式/候选仍沿用v7/v9。JSON授权≤256B，块≤64KiB、每向4MiB、消息/总时间预算是独立资源政策。ws8.22.0是Node传输依赖，保留MIT和完整性，[记录](../analysis/launcher-v18/dependency.json)。浏览器/Node测试仅原创bytes和文本，不分发官方资源；[契约](../analysis/launcher-v18/implementation-spec.json)、[验收](../analysis/launcher-v18/validation.json)。

## 当前执行端口字节范围（stage62）

v17沿用v7/v9 hello/挑战/公值、类型10/回包与未压缩flag1/key8格式，没有新协议字段或原格式扩大。会话运行时只把已有bytes交给read/write端口，输入/输出均做实际长度/副本约束：单read非空≤64KiB、累计4MiB；拒绝块不交给协议解析。平台默认20B随机数、时钟/attemptId/I/O计数均为本地实现，不写入新字段。[政策](../analysis/launcher-v17/session-spec.json)。

原创Python/PyCryptodome对端独立计算共享材料、解密并逐字节核对原创请求frame，未保存nonce/key/凭据正文；真实TCP候选/空候选/拒绝及畸形/关闭通过。Node335、浏览器6项通过；后者注入流不等同浏览器TCP。shared图形/地图/ZIP/XML覆盖与预算不变。[验收](../analysis/launcher-v17/validation.json)。

## 保留UserMode本地元数据（stage61）

UserMode在原prefix＋Settings/UserMode中读取默认-1，只1/2直接采用；写入为整数Profile包装。新增模式计划接-1/UInt32与显式1/2/cancel/boolean确认，settingsSection由调用者解析；不增加账号磁盘格式、文本代码页或协议字段。retention/clearInputs/writeRequested是独立本地效果，非游戏消息。[固定样本/8函数](../analysis/launcher-v16/static-spec.json)、[29操作数](../analysis/launcher-v16/mode-operand-audit.json)。

54组原创非秘密政策向量经Python生成并可复现，Node300/Chrome通过；未保存账号、会话或原条款正文。原图形/地图/ZIP/XML覆盖与预算保持；输入清理仍为显式bytes已有API，模式计划自身不接凭据或读写文件。[接口](../shared/README.md#launcher-v16)、[验收](../analysis/launcher-v16/validation.json)。

## 保留页面原字节与缓存范围（stage60）

新File适配在调用slice前固定非空safe-integer size≤1MiB，只读`slice(0,size)`一次；实际ArrayBuffer长度和读取后size须一致，输出独立Uint8Array。解析/MD5/缓存共享这份raw输入，不通过重新编码文本或规范化CRLF获得缓存字节。既有`readLauncherText`仍支持显式UTF-8/GB18030 fatal解码。新3项Node分别覆盖所有权/NUL/高位/CRLF、非buffer/Proxy和变化的size getter；全套288通过。

实际页面已验证原创UTF-8/裸&选项保存、重载与显式恢复；独立GB18030向量`d6 d0 ce c4`显示“中文”，保存前与恢复后raw bytes逐字节相同。[编码回执](../analysis/launcher-v15/encoding-validation.json)、[完整验收](../analysis/launcher-v15/validation.json)。只缓存候选双XML、摘要和解析选项及本地schema/revision，不含文件名、安装目录、选中项、账号/条款决定或会话。恢复后目录重新输入。

没有新原样本、官方响应或游戏帧观察，也没有扩大RD/MAP/压缩或文本代码页覆盖；本机UI的取消/冲突政策不是原文件格式或原程序行为。原生两XML写入边界仍由下方stage59证据约束。

## 保留候选配置字节与存储边界（stage59）

公开raw MD5仍限定原bytes/32MiB，XML候选每份1MiB、非空、期望摘要一致，显式UTF-8/GB18030解码后沿已有结构解析；不能把摘要匹配、空文件或成功获取当有效目录。原生CFile写入使用strlen(R)长度且两文件分开写后才解析；Write/短写/Close有异常链，完整恢复未知。[REA](launcher-static.md#launcher-v14)、[31锚点](../analysis/launcher-v14/catalog-write-audit.json)。

IndexedDB仅保存一对候选raw XML、摘要、编码/兼容选项和本地schema/revision，不含账号、条款决定或游戏数据帧。读回重验，坏记录/未知schema拒绝，单record事务防止自己的pair半更新；不宣称原生文件格式/更新事务已实现。原始图形/地图/压缩覆盖不变。Node285与Chrome12通过，[验收](../analysis/launcher-v14/validation.json)。

## 保留HTTP字节边界（stage58）

固定主登录器的HTTP+34槽现绑定CInternetFile::Read/InternetReadFile，3ffB读取后写NUL再按strlen拼接；这是文本helper语义，不是ZIP/游戏数据格式。新Fetch适配保留NUL/高位原字节，metadata4KiB、catalog1MiB、package32MiB解码后预算与65536read是独立政策；不将Content-Length当解码后精确长度。原创实际GET→目录摘要计划及GET→ZIP/CRC/MD5通过Node/Chrome，未更改已有格式覆盖。[规格](launcher-static.md#launcher-v13)、[验收](../analysis/launcher-v13/validation.json)。没有新官服响应、真实资源或游戏帧材料。

## 保留登录器清单文本增量（stage57）

固定主登录器601b…样本已证：主摘要依次修剪边界空格、LF、CR，再取前32字符；XML前两个token分别绑定GameList/RegionList，超过32只记录日志，该处不截断。定位文本前两token分别进入locator和进度分母。原EXE及两XML均直接对文件bytes做MD5，不先解码或规范化换行。[字段与范围](../analysis/launcher-v12/static-spec.json)、[消费绑定](../analysis/launcher-v12/manifest-bindings.json)。

新核心限定响应4096B、原文件32MiB、最多128token；仅可打印ASCII及六种经典ASCII空白，拒绝NUL/非ASCII。XML摘要严格32hex，进度严格正十进制到INT_MAX；这些是独立有界政策，不代表任意原locale/atoi异常等价。locator只保留文本，不据此请求URL。15组独立Python响应投影、4种目录变化与Node245通过。[接口](../shared/README.md#launcher-v12)、[验收](../analysis/launcher-v12/validation.json)。

历史66B XML摘要正文按保留公开值重建，与历史完整SHA256一致；主摘要使用明确合成本地值进入目录分支，离线固定文件仅RegionList需刷新。没有新观察官方状态或更新文件。该增量不增加游戏帧、地图/图形格式，摘要相等不证明XML可解析、来源可信或登录器就绪。

## 保留登录器更新ZIP增量（stage56）

固定更新器62db…样本中的pak路径已确认为经典ZIP中央目录/首条目，method0复制、method8 raw Deflate，后续CRC与产物MD5闭合。不是把扩展名当格式。新解析器按已证路径选择首中央条目，名字保留opaque bytes、不作文件路径；其余条目仅查metadata。独立严格预算/不支持项、descriptor两种形式与CRC恰为签名的边界见[规格](launcher-static.md#launcher-v11)。

15组原创struct/zlib/zipfile向量覆盖Stored和三种Deflate block、描述符/前缀/extra/注释/目录重排；现有真实ZIP580,477B→599,040B与原样本完整相同。官方ZIP/输出只在私有本地材料中读取，不加入成果。[原始包对照](../analysis/launcher-v11/real-package-comparison.json)、[验收](../analysis/launcher-v11/validation.json)。新Pako3.0.2及原始许可按固定完整性保留，MD5是内部多block复用；未新增地图/图形格式或游戏协议字段。

## 保留登录器本地状态增量（stage55）

许可表是15个gameCode-1槽、每槽四个BIN_DATA ID；Code11为335/329/331/332。四资源仅保存位置/大小/hash，正文不交付。用户名原bytes的MD5小写32hex用于本地INI许可键，不是新增网络字段、身份凭据变换或更新信任依据。原Code文本前导0保留，资源槽1..15与消息Gamecode0..14分开。[固定样本/资源元数据](../analysis/launcher-v10/static-spec.json)。

新review要求四个own boolean表示实际页可用，0→3后独立决定才产生version5写入意图；这个严格政策不复现原unchecked资源载入失败。输入重置只处理显式bytes，不添加磁盘账号格式。23组Python/hashlib原创向量与4080个Node对照、64轮MD5参数核对通过。[验收](../analysis/launcher-v10/validation.json)。没有新图形/地图解析范围或官方材料分发。

## 保留离线交换控制增量（stage54）

v9串联已有字节格式，没有增加协议字段、图形或地图格式。attemptId、总deadline、端点圆环与控制状态都是本地bookkeeping，不能写进官方包或当新服务规格；当前只输出连接/关闭/写入意图。3组独立Python/PyCryptodome向量覆盖hello、公值、加密请求及分段通知/候选结果，均为公开原创常量。[规格](launcher-static.md#launcher-v9)、[验收](../analysis/launcher-v9/validation.json)。

reply stream新close主动丢弃残片、保留既有failed状态，供取消使用；finish仍严格检查截断。RD/MAP/资源覆盖与v8 DIALOG固定分析helper范围不变。

## 保留登录器输入/候选增量（stage53）

类型10的UI子集现绑定用户名/密码控件及各16B校验，原字节builder18B上界不改。类型11投影恢复byteList与W1..W4的排序/列关联、状态/收费/到期选择检查，并补反编译遗漏的tailWordB消费；实际代码页、opaque材料和expiryWord日期解释仍未验。[规格](launcher-static.md#launcher-v8)、[共享接口](../shared/README.md#launcher-v8)。3请求/6候选均为原创Python向量，不保存真实凭据、账号或会话。

新增DIALOG元数据helper只适用于固定SHA256分析样本及既有REA资源清单；按标准/扩展模板对齐读取，拒绝超预算/截断/非空creation data，不输出标题或原始模板。13份固定资源与4项原创格式测试通过；DIALOG133的控件1013/1014确认了Edit/password初始style。[元数据](../analysis/launcher-v8/dialog-controls.json)。它不是产品PE加载器或通用资源格式覆盖；不改变RD/MAP/图形/动画范围。

## 保留的登录器字节增量（stage52）

新增的是登录器通信字节格式，不扩展RD/MAP、图形或动画资源覆盖。类型2/11明文回包、计数宽度、固定hello/挑战/公值消息及未压缩Blowfish记录的字段/上界，见[登录器v7规格](launcher-static.md#launcher-v7)和[模块契约](../shared/README.md#launcher-v7)。7组回包、3组模幂、9组记录与最大记录摘要均为原创合成；PyCryptodome仅用于开发侧独立对照。第三方Blowfish数学常量及MIT代码来自固定公开包，未从官方游戏文件提取进产品。

两字段的UI编码/变换、压缩分支、游戏协议和官方资源语义仍未知。不能把XML的GB18030或加密字节向量匹配扩展为游戏文字/帧或实时会话兼容。

## 保留的登录器文本增量（stage51）

GameList新增`Regions/Region`名称引用，RegionList新增有界纯文本解析；两份固定XML的完整SHA256与Python ElementTree独立对照见[oracle](../analysis/launcher-v6/configuration-oracle.json)，原文件未改写/收录。区域名称精确保留空白，Args保留原字节解码后的文本与换行；Gamecode按已证数值槽选择，Code/ordinal不混用。DTD/实体/深度/预算继续沿用既有核心，端点只作为数据。

浏览器薄适配显式选择GB18030或UTF-8，单文件最多1MiB，fatal解码后交给纯文本核心；核心本身不猜编码。真实配置5游戏/12区域、8可选/1缺失关联和5处显式裸&兼容均通过独立及浏览器验证。另新增的类型10字节模块属于登录器排队前消息边界，见[协议规格](launcher-static.md#launcher-v6)，不改变RD/MAP、游戏帧、颜色/动画或地图语义的支持范围。

分析对象来自 SHA256 `e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983` 的 `CrossGate_Setup.exe`，由 innoextract 1.9 离线选取样本；未执行安装器、未将官方资源打包进原型。

## GraphicInfo 候选 40 字节记录

**事实**：`GraphicInfoV3_18.bin` 大小 781,840 B，可拆成 19,546 条 40 B 记录。按小端整型读取 `+4` 与 `+8`，所有长度为正，19,545 个相邻对满足 `offset + byteLength == next.offset`。最后记录结束值是 68,321,498。`GraphicInfo_Joy_22.bin` 有 8,308 条记录，存在 4 个不连续相邻对，所以连续性不是普适有效性要求。证据：[graphic-index-observations.json](../analysis/game/graphic-index-observations.json)、[resource-observations.json](../analysis/game/resource-observations.json)、[游戏调查](game-static.md)。

| 记录偏移 | 存储观察 | 语义状态 |
|---|---|---|
| +0 | UInt32LE，部分序号重复或跳跃 | 候选图像 ID，不能要求等于记录序号 |
| +4 | UInt32LE | 强证据支持配对图像流中的偏移；尚未对所有版本验证 |
| +8 | UInt32LE | 强证据支持字节长度 |
| +12、+16 | 可读为 Int32LE，观察到负值 | 推测绘制偏移，未证明坐标原点和方向 |
| +20、+24 | 可读为正 Int32LE | 配对 payload +4/+8 全部对应；按当前样本宽、高字段读取，显示方向仍未知 |
| +28…+39 | 剩余 12 B | 语义未确认，不命名为确定标志或序列结构 |

原生 `GraphicIndex40` 只输出元数据、边界和不连续/重叠提示。测试使用合成 40 B 记录。配对文件长度可由调用者传入用于越界校验；没有配对长度时不能宣称实际图像数据有效。这是保留 Swift 模块的范围；跨平台共享核心现在支持下述 RD v0/v2 有限布局。完整 RLE 规范、颜色/透明和 Sprite 动画仍未实现。

## RD v0/v2：本阶段实现的有限布局

**事实**：配对 `GraphicV3_18.bin`（68,321,498 B）与 `Graphic_Joy_22.bin`（47,168,682 B）中的27,854条记录全部通过索引范围、`RD` magic、payload `UInt32LE@4/@8` 与索引 `@20/@24` 一致性核查。四个文件 SHA256、精确计数与独立复核见[图形证据](../analysis/resources-v2/notes-graphics.md)。ID存在重复，调用者必须用ordinal定位，不能用ID静默去重。

| 相对偏移/布局 | 已观察事实与实现 |
|---|---|
| +0/+2 | `52 44` / 版本字节；+3保留opaque |
| +4/+8 | UInt32LE宽/高，与索引对应；乘积先校验预算 |
| +12 | opaque UInt32；69条原始样本中均不等于记录总长，不跟随为指针 |
| v0 | 16 B头 + 宽×高原始索引字节，精确长度；V3有4条 |
| v2 | 20 B头，+16为p；宽×高索引字节后跟p个opaque候选palette字节；共65条 |
| p范围 | 已见516/711/759/768；实现要求正数、3整除且≤768，不强制768 |

**事实**：独立 Python oracle 和 JS 实现对全部69条v0/v2记录的像素SHA256、palette SHA256、头部字段及尺寸一致，见[core验证](../shared/README.md)。推荐复核V3 ordinal4453：offset24,091,510，length49,940，256×192；这些是用户本地文件中的范围，不是附带的官图副本。

实现限制：索引64 MiB、帧32 MiB、4 Mi像素；有界读取、非零Uint8Array offset、宽整数加法、尺寸/记录长度一致性、截断和尾随字节拒绝。v1/v3明确拒绝。8项独立Python测试、18项共享核心测试和7项浏览器文件适配测试均使用原创合成夹具。

**推测 / 待验证**：字节索引按头尺寸平铺可以作灰度核验，但不是正式颜色还原。RGB/BGR、透明索引、行方向、非4倍数宽的行对齐、绘制原点、未知字段和动画语义未确认。当前未强制像素值小于p/3，因为p是否为完整可寻址palette尚无运行语义证据；Python观察到真实65条均满足此关系。工具连接曾中断、现已恢复；浏览器真实文件导入尚未验收，69条差分是独立的命令行验收。

压缩实验覆盖27,785条v1/v3，其中34条v1因末段超过候选像素数1字节而拒绝。该模型尚未成为规格；不截掉多余字节假装成功，也未纳入产品。详细病例及推断局限见[实验记录](../analysis/resources-v2/notes-graphics.md#压缩格式一次全量实验的边界)。

## MAP01 候选结构

**事实**：4 个样本均以十六进制 `4d 41 50 01` 开头，`+12`、`+16` 读取 UInt32LE 得到下表尺寸候选，并精确满足 `总长度 = 20 + 6 × 宽 × 高`。`+4` 和 `+8` 在这些样本中为 0。

| 样本 | 候选宽×高 | 字节数 |
|---|---:|---:|
| map/0/1000.dat | 300×300 | 540,020 |
| map/0/101.dat | 200×200 | 240,020 |
| map/0/1011.dat | 30×30 | 5,420 |
| map/0/40000.dat | 100×80 | 48,020 |

逐文件 SHA256、头与候选平面统计：[map-observations.json](../analysis/game/map-observations.json)。**推测**：每格可能对应 3 个 UInt16，或者三个平面；平面与交错排列未由函数证明，地面/对象/碰撞的语义也未证实。**待验证**：版本字节、额外头字段、顺序、空格/阻挡、尺寸上限与其他样本类型。因此当前原型使用自制 `OfflineWorld`，并不导入官方地图。

## 调色板、动画与音频

- **事实**：安装清单有 `palet_*.cgp`，抽样长度为 708 或 768 B，分别可拆为 236 或 256 个三字节单元。
- **推测**：这些可能是三通道调色板；RGB/BGR 次序、保留颜色、透明索引均未确认。
- **事实**：`Anime*`/`AnimeInfo*`、`Graphic*`/`GraphicInfo*` 成对命名；不能仅凭名称证明结构。
- **事实**：清单有 `.wav` BGM、`sound_1.bin`、`soundaddr_1.txt`、`bgm.cf`。补充只读核查169个索引范围：全部RIFF size+8与记录长度吻合，Python wave识别为PCM单声道16bit（165个22050Hz、3个44100Hz、1个11025Hz），最后结束值等于档案长度。见[音频元数据](../analysis/audio-v2/riff-observations.json)，包含档案及索引SHA256；未实现产品播放或导出音频。

后续每个格式都需要：多个版本的身份清单、精确字段偏移与限制、解析代码、合成边界测试、真实样本只读验收、未知字段清单。格式猜想不得升级为已恢复游戏逻辑。


第三阶段仅推进启动/网络静态规格，未扩展本文件的资源解码覆盖范围；69条差分及未压缩布局限制保持不变。游戏启动代码中的资源枚举不证明地图/动画语义，见[当前逻辑规格](logic-protocol-spec.md#第三阶段消费者启动与网络边界)。


## stage36启动配置文本：实现覆盖与输入边界

资源字节API保持不变。新增[纯启动配置核心](../shared/README.md#offline-launcher-core)只接收已解码的GameList/INI文本，不在核心猜测GB18030/UTF-8字节编码。已观察字段/目录来源与样本哈希见[GameList配置摘要](../analysis/launcher/config-summary.json)、[目录规格](../analysis/launcher-v5/directory-context.md)。自动测试只用原创XML/INI，没有收录官方配置或账号数据。

支持GameList有限树结构、常见实体/CDATA/初始XML声明，保留重复Code及Argsline；DTD/外部实体/命名空间/其他PI明确拒绝。普通裸&只在调用者显式兼容模式下保留并计数，未知/坏实体仍拒绝。INI只支持section、key=value、分号整行注释和Path/Game记录，重复歧义拒绝，不实现整个Windows Profile API。XML256Ki字符、INI64Ki、单字段4096、128条Game、4096节点/8层；这些是本工程安全预算，不是逆向发现的官方常量。路径计划不解析文件系统，不检查实际资源或Windows环境；错误码和使用见共享说明。


## stage38：MAP01原始结构实现及四样本核验

新增[map01.mjs](../shared/map01.mjs)，按本报告原有四样本事实读取magic MAP01、20B头、UInt32LE@12/@16候选宽高与精确`20+6wh`字节数。@4…11和完整6wh体都保留为opaque副本；**没有**把三组UInt16假说升级为地面/对象/碰撞，也不推断行方向、空间坐标或tile语义。非零未知头字节允许保留；版本01之外明确不支持。

输入32MiB、4Mi候选单元；先除后乘防UInt32大维度精度/溢出，短头/截断/尾随/零尺寸/视图越界有负例。独立[Python oracle](../analysis/resources-v2/map01_oracle.py)用已知SHA256的四个显式普通文件核对struct/hashlib结果，Node适配器核对完整身份、尺寸、8B头及body摘要。300×300/200×200/30×30/100×80四样本4/4一致，见[oracle](../shared/evidence/map01-real-oracle.json)、[对照](../shared/evidence/map01-real-comparison.json)。只保存元数据，不分发官方地图内容。

**未验收：** 真实地图渲染、碰撞/通行、坐标定位、资源ID映射、游戏网络和官方兼容。实际安装inventory也是调用者声明，不代替读取这些真实文件或校验完整合法资源。[接口和可运行用例](../shared/README.md#inventory-and-map01)。
