<a id="handoff-20261115-validation"></a>

## 2026-11-15 换机快照复验

从 Git 暂存区检出独立副本，核 724 份产品与工具文件和前一检查点的摘要一致。271 个测试文件共 3,779 项 Node 回归通过，另有 8 项 Python 和 16 项 SwiftPM 测试。六组战斗接续回放与留存 JSON 逐字节相同。网页资源、登录器、游戏和共享模块四个本机 HTTP 入口均返回 200。 [原始计数和命令](../analysis/capability-first-v1/handoff-20261115/migration-validation.json)

本机恢复 esbuild 0.25.12 后生成默认微信工程和独立游戏 API，均无外部模块导入。微信 App 为 257 个输入、27 个输出，分包连接配置保持默认空值。样本原程序、微信设备和官服以原验收状态为准。14 份近期回执与原文件的长度和 SHA-256 相符。 [回执索引](../analysis/capability-first-v1/handoff-20261115/receipt-index.json) · [换机交接](project-handoff.md)

<a id="safari-navigation-resource-read-validation"></a>

## Safari 导航的旧归档读取回执

在独立的 iOS 27.0（24A434）模拟器复用 stage306 游戏页、本机桥接、原创 TCP 对端和原创 ZIP。核对 644 个现有产品路径的副本字节，只有探针入口页加载额外脚本。初次探针参数被桥接的固定路由拒绝，随后沿标准游戏页用会话内步数重开。每轮 ZIP 各有哈希，产品路径及图形成员范围一致。导航期间的 `NotReadableError`、活动失败、迟到成功与迟到拒绝逐笔可回读。 [探针代码](../build/analysis/safari-navigation-resource-read-v1/run.mjs) · [运行回执](../build/analysis/safari-navigation-resource-read-v1/runtime.json)

四个原创对端收到 EOF，九条桥接流最后均已结束。127 项已有资源库、归档、客户端和本机 TCP 回归通过。专用模拟器已关闭并移除。产品修复、实际设备、完整三端和当前同版仍待验收。 [回归输出](../build/analysis/safari-navigation-resource-read-v1/local-regression.log) · [完整性回执](../build/analysis/safari-navigation-resource-read-v1/validation.json)

<a id="item-alternate-dispatch-candidates-validation"></a>

## 固定 Item 的三个窗口候选核验

REA 6.7.0 与 Ghidra 12.1.4 对固定 Item 取得 33 条相关读取、引用及函数归属记录，导出后关闭会话。复用九个函数档案，以 Apple LLVM 21.0.0 复核 34 处指令、完整 99 行表及十二行的登记和首参传递。所选 `+4` 指针的静态引用查询限于返回的证据。 [原字节、证据编号和引用范围](../build/analysis/item-alternate-candidate-review-v1/source-review.json)

stage306 的训练、普通对话和工艺共享及网页入口共 40 项已有本机用例通过。OS-A26、WK-T27、SF-A28 的原版和目标端完整操作未执行，普通帧外层调用和当前同版仍为待证条件。 [测试输出](../build/analysis/item-alternate-candidate-review-v1/local-regression.log) · [本轮核验](../build/analysis/item-alternate-candidate-review-v1/validation.json)

<a id="f5a-modal-connection-admission-validation"></a>

## 固定 F5A 报错与新连接的入口核验

REA 6.7.0 与 Ghidra 12.1.4 在固定 F5A 取得 16 段共 1,136 字节及 24 条引用回执。其中 2 段读取和 10 条引用与所核历史证据 ID 相同。复用 18 个函数档案，Apple LLVM 21.0.0 核 84 处指令、所选消息登记和通道虚表。另从原字节核连接及确认的直接调用。REA 对 `423220` 返回两条引用，独立字节验证还核到列表双击入口的 `4280B0` 尾跳。按 Win32 夹具已观察到的窗口和投递条件核原版静态准入。后续已补两处程序自身的普通确认投递，实际送达与重绑待验。 [该批字节和入口核验](../build/analysis/launcher-f5a-modal-connection-admission-v1/validation.json) · [后续投递核验](#f5a-ordinary-input-idok-validation)

两组原创流沿现有 `current` 配置让会话收到拒绝并延后关闭回执。旧关闭成功和失败各自归旧会话，新会话仍在等待挑战。八个现有测试文件共 101 项通过。沿 LS-T20 继续核真实关闭、提示及三端产品。 [本机结果](../build/analysis/launcher-f5a-modal-connection-admission-v1/local-comparison.json) · [本机回归](../build/analysis/launcher-f5a-modal-connection-admission-v1/local-regression.log)

<a id="f5a-ordinary-input-idok-validation"></a>

## 固定 F5A 普通输入的 IDOK 投递核验

REA 6.7.0、Ghidra 12.1.4 补核 8 段 826 字节及 4 条引用。Apple LLVM 21.0.0 核对 12 段 1,265 字节、4 项消息登记和 68 条选定指令。对 `43D340` 的引用查询未返回记录，原表 `5E5B18` 的回调字及虚表到该消息表的路径已核。REA 会话已关闭。 [来源、导入与指令](../build/analysis/launcher-f5a-idok-producers-v1/source-review.json)

5 项现有本机回归通过，覆盖旧事件隔离、完成后迟到回执、取消等待和关闭拒绝。原版实际送达、登记和旧借用结束，仍按 LS-T20 验收。 [本机回归](../build/analysis/launcher-f5a-idok-producers-v1/local-regression.log) · [核验回执](../build/analysis/launcher-f5a-idok-producers-v1/validation.json)

<a id="fixed-f5a-entry-business-validation"></a>

## 固定 F5A 的 A1 登录器入口核验

复核 REA 6.7.0、Ghidra 12.1.4 留存的 23 个函数档案。Apple LLVM 21.0.0 核对 45 处指令位置、21 条直接调用或跳转及 15 处直接导入调用。四个消息所有者的虚槽、消息表头和八行登记都读回固定 PE 字节。另核 App 启动虚槽及内嵌更新器资源与成员一致。 [原字节和档案](../build/analysis/launcher-f5a-entry-business-v1/source-review.json)

stage306 的 124 项现有会话、交接、更新、补丁和宿主端口回归通过。普通启动合成输入仍保留 41 字节 ASCII 候选名，采用空应用名和无引号测试命令。对应的 F5A 复刻差异由 D1 实现，Windows 实际行为、三端组合与当前同版游戏读取沿 D5/D6 验收。 [本机回归](../build/analysis/launcher-f5a-entry-business-v1/local-regression.log) · [普通启动对照](../build/analysis/launcher-f5a-entry-business-v1/ordinary-stage306.json) · [范围核验](../build/analysis/launcher-f5a-entry-business-v1/validation.json)

<a id="fixed-se-entry-business-validation"></a>

## 固定 SE 战后、邮件与工艺入口核验

复用 REA 6.7.0、Ghidra 12.1.4 的 15 次留存读回，并与同一原 PE 的文件字节核对。Apple LLVM 21.0.0 独立核对 80 处指令。39 处所选登记对应 31 个原台账根，包括九个经典窗的回调和控件、四条收包、三条发送，以及两条尚待普通分派的第二套窗注册。原 647 根、行号与原有登记保持，当前入口台账追加业务引用。 [来源、登记位置和字节](../build/analysis/fixed-se-entry-business-v1/source-review.json) · [核验清单](../build/analysis/fixed-se-entry-business-v1/validation.json)

stage306 的六个战后测试帧仍只解码，世界视图未发布结果。工艺的两种交换顺序都复现材料旧槽保留及原提交，结果同留存对照。复用邮件的背包和附件对照，现有 152 项共享及网页入口回归通过。所选原版交互、邮件服务结果、三端组合和真机仍按原用例验收。 [战后本机对照](../build/analysis/fixed-se-entry-business-v1/stage306-probe.json) · [工艺本机对照](../build/analysis/fixed-se-entry-business-v1/work-baseline.json) · [回归日志](../build/analysis/fixed-se-entry-business-v1/local-regression.log)

<a id="wechat-publication-history-validation"></a>

## 微信双槽历史与迟到启动确认的两次 App 核验

使用微信开发者工具 2.02.2609250 的原游客工程、SDK 3.18.0 和现有双槽及资源适配器。esbuild 0.25.12 打包 16 个本机输入。本机文件端口预演通过后加载三份临时探针文件，普通编译触发新 App。核对两份启动回执与七个槽、历史及就绪文件，共九个 SDK 文件。原工程 11 个文件恢复并复核，九个探针文件及本次的两个旧格式缓存槽均已清理。135 项已有 Node 回归通过。 [构建与回执摘要](../build/analysis/wechat-publication-history-v1/validation.json) · [回归日志](../build/analysis/wechat-publication-history-v1/local-regression.log)

首次 App 证实相同内容重建的槽字节完全相同，旧修订请求成功。历史不完整以受控写入 40 字节模拟。成功回调由探针暂扣，调用返回结果未知时直接文件读可见已写字节，同一适配器读保持忙。回调交还后再普通编译，第二次 App 读回同一提交，历史补齐后覆盖旧槽。查不到历史的对照仍保持结果未知。串行夹具中的迟到确认返回已取代或范围过期，匹配当前发布的两条确认成功保存。 [第一次 App](../build/analysis/wechat-publication-history-v1/sdk-evidence/phase1.json) · [第二次 App](../build/analysis/wechat-publication-history-v1/sdk-evidence/phase2.json)

同一 DevTools 进程的新 App 已核实际文件回调、所选记录的重开及读回。启动确认使用预设构建标识和串行写入，另一个探针槽代表新存储代际。实际产品端口的并发、原生写失败、进程异常退出、完整素材持久化、代码更新、设备和同版服务继续沿原验收执行。 [规格和用例](architecture-and-milestones.md#wechat-publication-history)

<a id="wechat-devtools-process-reopen-validation"></a>

## 微信开发者工具正常退出与新进程读回

同版 DevTools ASAR 与所选文件模块摘要匹配，复用 REA 6.7.0 的六个文件函数范围。esbuild 0.25.12 加载原创夹具和现有适配器，19 个构建输入含一份注入的试件定义。普通退出见旧 PID 3392 消失且没有匹配主进程，重开见新 PID 15385、同一游客工程和 SDK 3.18.0。新进程内执行一次读回操作。 [来源与构建](../build/analysis/wechat-devtools-process-reopen-v1/source-review.json) · [构建回执](../build/analysis/wechat-devtools-process-reopen-v1/build-receipt.json) · [进程与文件回执](../build/analysis/wechat-devtools-process-reopen-v1/runtime.json)

退出前 8 个文件和重开后 10 个文件均按实际内容核验。两次范围读校验相同的 1,024 字节成员，资源缓存修订 2，活动发布修订 3。核验脚本另用宿主 ZIP 解码和现有资源槽解码核对原始字节。现有 100 项 Node 回归通过。原工程 11 个文件按摘要恢复，清理本次 10 个自建模拟器文件。 [首次回执](../build/analysis/wechat-devtools-process-reopen-v1/sdk-evidence/phase1.json) · [重开回执](../build/analysis/wechat-devtools-process-reopen-v1/sdk-evidence/phase2.json) · [回归日志](../build/analysis/wechat-devtools-process-reopen-v1/local-regression.log) · [复核清单](../build/analysis/wechat-devtools-process-reopen-v1/validation.json)

所测发布与启动写入是原创小型夹具。正式接线、失去进程时尚在途的写入、完整素材持久化、微信实际构建更新和真机继续沿 UH-U02、UH-U03 核验。 [原用例](architecture-and-milestones.md#wechat-devtools-process-reopen)

<a id="portable-boot-entry-identity-validation"></a>

## 网页入口与微信生成包的启动绑定核验

三份微信生成清单各 27 项。复用七条入口加载关系，REA 6.7.0 新查三份生成的游戏配置模块。当前配置、空配置和另一份有效的本机夹具配置只改变分包配置文件。执行真实生成 App/Page 及游戏 bundle 的六个 Node 夹具，覆盖延迟加载、缺依赖、两类混用、交接槽替换及旧导航失败。夹具调用实际启动资料选择和 Canvas 准入，资源为待交接的原创字节。初次生成的测试地址被现有配置校验拒绝，改用项目的本地测试域名格式后生成成功。六个案例均未发起连接。 [生成与加载证据](../build/analysis/portable-boot-entry-identity-v1/validation.json) · [微信回执](../build/analysis/portable-boot-entry-identity-v1/wechat-runtime.json)

Chrome 加载原网页入口。三份页面各收到 214 个静态文件，夹具只用注释区分构建字节。内容发布和最终回执复用留存 IndexedDB 夹具。实际材料预检失败时零连接请求，三次有效准备进入 connecting，均在测试边界截获。根 A 被 B 取代后原提交仍可读，B 的相同绑定重复返回已有结果，继续换 C 时页面启动身份相同。71 项现有回归通过。产品版本绑定、微信 SDK 更新和移动真机待验。 [网页回执](../build/analysis/portable-boot-entry-identity-v1/web-runtime.json) · [回归日志](../build/analysis/portable-boot-entry-identity-v1/local-regression.log)

<a id="resource-budget-retirement-validation"></a>

## 资源换版时的绘制和音频排空核验

Chrome 157.0.8103.51 使用原摘要匹配的完整 ZIP。旧图块和音乐输入经实际 File 切片后各自延迟返回。新库的 12,288 字节帧摘要匹配留存参考，Web Audio 实际建立 2,155,830 帧缓冲并启动。旧库的两个晚到缓冲均被清零，旧帧以取消结算，两次返回后旧读计数保持 72。首轮夹具同时读了返回提示音，多了一个短缓冲。复测使用原 `soundoff` 选项隔离地图音乐，沿原图形配置核验。临时浏览器配置已移除。 [本机回执](../build/analysis/resource-budget-retirement-v1/browser-runtime.json)

微信四个受控回调覆盖归档关闭、外部中止、超时后迟到成功以及超时后迟到失败。同一成员头的超时经缓存保留，另一成员仍可读。85 项已有归档、图形、音频、浏览器端口回归通过。固定 SE 的图形和音频退役继续使用留存 REA 档案，并与原 PE 字节核对。本轮验证所选 Chrome 输出及微信适配器回调。真实持久化换版、完整场景峰值、设备及官方验收沿原范围继续。 [微信回调](../build/analysis/resource-budget-retirement-v1/wechat-callbacks.json) · [回归日志](../build/analysis/resource-budget-retirement-v1/local-regression.log) · [来源核验](../build/analysis/resource-budget-retirement-v1/validation.json)

<a id="real-map-resource-budget-validation"></a>

### 真实素材的六个视口与音乐占用核验

Chrome 157.0.8103.51 的独立无头配置读取摘要一致的 2,549,171,845 字节 ZIP 和 540,020 字节的原地图。原版格式和退役继续复用留存 REA 结论。试次调用现有地图、场景、资源库、Canvas 和 Web Audio，先确认音源已启动，再完成冷缓存与复访各六帧。对应画面 SHA-256 一致，两轮均在第 343 次物理读取结束。音乐逻辑 PCM 为 17,246,640 字节。 [逐帧、音频和文件回执](../build/analysis/real-map-resource-budget-v1/runtime.json)

已采样的 V8 后备存储最高为 238,427,118 字节。显式 GC 后，持有场景时为 139,690,848 字节，关闭场景、归档、缓存和音频后为 3,515,542 字节。采样范围为该页 V8 isolate，音乐值按 Float32 样本计，设备总内存和原生呈现另验。57 项现有回归通过。临时浏览器配置已移除。用 `node build/analysis/real-map-resource-budget-v1/run.mjs` 复现。 [本机回归](../build/analysis/real-map-resource-budget-v1/local-regression.log) · [收尾核验](../build/analysis/real-map-resource-budget-v1/validation.json)

<a id="real-map-mixed-resource-budget-validation"></a>

### Chrome 原地图、角色、调色和混播的联合核验

Chrome 157.0.8103.51 使用 SHA-256 相符的 2,549,171,845 字节 ZIP 和同套安装素材的单独地图文件。角色图像、调色和音频共用 ZIP 读取端口。原创角色输入命中索引 20797。两份实际调色表产生不同的画面，八次 Canvas 读回均与对应合成字节一致。三个同条件复访维持 292 次物理读和 212 次解码，另发生 194 次调色重绘。首次夹具将缺省的重绘计数当作数值，按计数首次出现前为零修正后重跑通过。 [输入、逐帧与读取回执](../build/analysis/real-map-mixed-resource-budget-v1/runtime.json)

可信点击后一个持续音轨和两路重叠音效在同一画面提交点活跃。三个输入 WAV 的声道、采样率、样本宽度和帧数由独立读取核对。提交时三个活跃缓冲的逻辑 PCM 为 17,819,580 字节，所测 V8 后备存储为 137,359,575 字节。准备后的最高采样为 206,080,585 字节，关闭和排空并显式 GC 后采样为 3,532,371 字节。各采样的 GC 条件留在回执中。 [分配和采样回执](../build/analysis/real-map-mixed-resource-budget-v1/runtime.json)

关闭实际音频上下文时，主动延迟的 1,696 字节图块仍在途。返回后实际字节清零，渲染按 `LEGACY_ASSET_CANCELLED` 结算，画布未再次提交。71 项现有本机回归通过，浏览器临时配置已核删除。用 `node build/analysis/real-map-mixed-resource-budget-v1/run.mjs` 复现。音频事件由原创夹具经现有宿主触发，采样覆盖本机选定场景，实际产品、自然峰值、真实可闻输出和其他宿主留在原验收。 [回归日志](../build/analysis/real-map-mixed-resource-budget-v1/local-regression.log) · [独立核验](../build/analysis/real-map-mixed-resource-budget-v1/validation.json)

<a id="animation-coordinate-sharing-validation"></a>

### 动画坐标共享和别名覆盖核验

固定 SE 使用 REA 6.7.0 与 Ghidra 12.1.4。复用四个函数档案，新增完整文件名比较函数和两份引用结果。以 PE 原字节和独立反汇编复核五个函数、13 条直接调用与 42 个定位点。原版别名用例给出的是所选指令路径的推导结果。 [来源回执](../build/analysis/animation-coordinate-sharing-v1/source-review.json)

实际 ZIP 的 14 次动画与坐标成员读取逐一核对摘要。单份快照试次沿现有目录的逻辑准入，按两批遍历 2,520 个最终动画，共核 235,377 个动作、1,699,203 个帧和 639,484 条附件行，两批与现有目录的摘要均相同。额外核十组原创边界及两组文件名别名差异，覆盖关闭重入、另一资源根的首次查找和索引失败时清理。现有动画、资源库和 ZIP 的 84 项回归通过。 [本机对照](../build/analysis/animation-coordinate-sharing-v1/runtime.json) · [回归日志](../build/analysis/animation-coordinate-sharing-v1/local-regression.log)

运行 `python3 -B build/analysis/animation-coordinate-sharing-v1/verify_source.py` 和 `node --expose-gc build/analysis/animation-coordinate-sharing-v1/probe.mjs` 可复核。试次保持每目录 1,048,576 帧的解码上限，阶段规格仍引用 stage306。产品接线和三端峰值沿 D0/D5。 [独立核验](../build/analysis/animation-coordinate-sharing-v1/validation.json)

<a id="animation-load-failure-validation"></a>

### 动画缺档、索引降级与首读回执

复用固定 SE 的 7 份 REA 6.7.0 函数档案，以原 PE 和独立反汇编核对 19 个直接调用与 55 个指令定位点。零数据句柄到 seek 的条件路径核到 PE 导入槽。读取现有 ZIP 时完整复核 SHA-256。V2 索引和数据均缺失，资源库只查询该组索引，仍登记 2,520 个动画。100000 第一次查找的摘要与前轮匹配，未登记的 120499 返回空。 [来源](../build/analysis/animation-load-failure-v1/source-review.json) · [实际档回执](../build/analysis/animation-load-failure-v1/runtime.json)

12 项原创用例分别验主组缺档、完整可选组缺席、只有索引的覆盖、索引末行不完整、坐标文件缺失、非 1 标记及已声明范围短读。可选组 `AnimeInfoEx` 覆盖的 100001 与独有的 100123 在 stage306 的首次查找均返回截断错误，100002 仍有一条附件。另试独立坏标记候选回收，旧根随后首次命中，修正后新根也命中。83 项现有回归通过。 [条件与逐项结果](../build/analysis/animation-load-failure-v1/runtime.json) · [本机测试](../build/analysis/animation-load-failure-v1/local-regression.log)

用 `python3 -B build/analysis/animation-load-failure-v1/verify_source.py` 和 `node build/analysis/animation-load-failure-v1/probe.mjs` 复核。源结论取固定样本的静态条件路径，现有资源库结果来自本机。标记 1 后残行沿现有解析错误，超出范围的附件沿现有首读错误，这是三端规格采用的边界。使用 D0/D5 完成变更和宿主用例。 [规格与版本核验](../build/analysis/animation-load-failure-v1/validation.json)

<a id="browser-audio-voice-budget-validation"></a>

### Chrome 同源重复音效的缓存和关停核验

Chrome 157.0.8103.51 用摘要一致的完整 ZIP，固定 SFX 入口沿 SE 的留存 REA 规则。独立 WAV 头和数据块核对音乐、返回提示、两次实际选择的音效。五个实际 `AudioBuffer` 的逻辑 PCM 合计 17,402,732 字节。音乐保持启动，134 的四个音效声部经各自的实际 `ended` 断开。三次显式 GC 后，四个音效源和两份偏左输出仍能通过弱引用访问。 [固定 SE 来源](../analysis/game-legacy-battle-audio-v1/source-check.json) · [声部与分配记录](../build/analysis/browser-audio-voice-budget-v1/runtime.json)

音效 255 的 33,008 字节实际范围读在夹具中暂扣。上下文关闭时归档仍开且数据未回交，解除暂扣后数据清零，归档正常关闭。此次未新增缓冲或启动节点，排空后再经三次显式 GC，五个声源与五份 PCM 弱引用均不可访问。该结果记录浏览器对象可访问性，设备内存和可闻输出另验。63 项现有回归通过，隔离浏览器配置已移除。用 `node build/analysis/browser-audio-voice-budget-v1/run.mjs` 复现。 [综合核验](../build/analysis/browser-audio-voice-budget-v1/validation.json) · [本机回归](../build/analysis/browser-audio-voice-budget-v1/local-regression.log)

<a id="wechat-sdk-audio-voice-validation"></a>

### 微信 SDK 的分声道读取、播放和退役核验

所选游客工程在开发者工具 2.02.2609250 Stable、SDK 3.18.0 中正常编译。实际 SDK 双声道写入和读回一致。共享宿主创建五份 22,050 Hz 缓冲，四个音效声源和一条循环音乐启动，两个偏左声部的首个样本均是 `−0.5` 和 `Math.fround(−0.000005)`。两次居中使用相同缓冲，音效 134 只读一次。四个音效自然结束并断开。 [构建身份](../build/analysis/wechat-sdk-audio-voice-v1/build.json) · [SDK 播放回执](../build/analysis/wechat-sdk-audio-voice-v1/ready-receipt.json)

共享宿主请求关闭后，实际 `close()` Promise 完成，上下文状态为 `closed`。夹具暂扣的 32,940 字节仍非零，交回后清零，五份缓冲和五次启动的计数保持。首轮合成 WAV 缺少 `smpl` 循环块，补齐后重新编译得到完整结果。22 项现有回归通过，原游客工程 11 个文件恢复并核对，清理两份自建模拟器回执。 [首轮回执](../build/analysis/wechat-sdk-audio-voice-v1/first-attempt/ready-receipt.json) · [恢复与清理](../build/analysis/wechat-sdk-audio-voice-v1/cleanup.json) · [最终核验](../build/analysis/wechat-sdk-audio-voice-v1/validation.json)

<a id="mobile-safari-audio-lifecycle-validation"></a>

### 移动 Safari 的真实触摸与离页音频回执

iOS 27.0（24A434）的 Mobile Safari 27.0（8625.1.29.10.29）使用原创测试页和零增益。XCTest 点击开始与离开，页面收到可信触摸及 `pagehide`。无手势对照中上下文保持挂起。启动后实际音频时钟读到约 0.149 秒，音乐和音效各启动一次，音效自然结束。页面使用的 10 个模块均与留存产品基线相符。 [浏览器回执](../build/analysis/mobile-safari-audio-lifecycle-v1/runtime.json) · [XCTest 结果](../build/analysis/mobile-safari-audio-lifecycle-v1/xctest-summary.json)

离页回调停止并断开循环声源。上下文记录到关闭请求，迟到数据归还后清零。四次读取和两次声源启动的计数保持。替换页读回原记录，观察范围至此。本次独立模拟器已移除，既有 11 个设备状态保持。33 项现有回归通过。实际游戏产品接线、后台中断及真机可闻输出仍沿 AF-T12。 [清理回执](../build/analysis/mobile-safari-audio-lifecycle-v1/cleanup.json) · [综合核验](../build/analysis/mobile-safari-audio-lifecycle-v1/validation.json)

<a id="fixed-se-classic-mail-reopen-validation"></a>

## 固定 SE 经典邮件重开核验

REA 6.7.0 和 Ghidra 12.1.4 在一次会话读取七段共 826 字节，含加载及关闭共 57.789 秒。Apple LLVM 21.0.0 与 PE 原位置独立对照草稿比较、编辑器装入、窗口登记、关闭、群发列表条件及恢复表。四组静态夹具覆盖草稿键、两条重建、父子窗分配与附件释放。 [字节、复用范围及夹具](../build/analysis/fixed-se-classic-mail-reopen-v1/validation.json)

stage306 的原创协议夹具重跑。全量背包收包能解码，既有物品记录仍保持，逐槽、交换、移除及家族编码结果复现。四个现有测试文件共 85 项通过。原版动态、产品邮件操作、真机及同版结果待验。 [本机对照](../build/analysis/fixed-se-classic-mail-reopen-v1/local-comparison.json) · [回归日志](../build/analysis/fixed-se-classic-mail-reopen-v1/local-regression.log)

<a id="fixed-se-shared-scene-frame-validation"></a>

## 换图、回场与工作窗的帧对照

REA 6.7.0 和 Ghidra 12.1.4 对固定 SE 一次读取六段共 608 字节，加载、读取及关闭共 57.213 秒。Apple LLVM 21.0.0 对照两份固定映像和留存档案，核对派发表、两处子状态递增、活动槽关闭请求与完成帧的绘制提交。由原始分支推导 205 在途创建与 204 清表的条件组合。 [字节、偏移、来源及模型](../build/analysis/fixed-se-shared-scene-frame-v1/validation.json)

现有四组夹具重跑。普通换图在新图首次绘制挂起时接收按下，绘制序号由 1 递进至 2。普通战斗回场的运行时修订由 1 到 2，此时呈现序号仍为 236。工作窗口夹具验证旧运行时与迟到回复拒绝，所测换图未发送动作 62。战斗指令窗的等待和回放各推进 18 帧，关窗状态仍停在 2。七个现有测试文件共 113 项通过。原版动态及三端完整验收待执行。 [回归](../build/analysis/fixed-se-shared-scene-frame-v1/local-regression.log) · [本机换图](../build/analysis/fixed-se-shared-scene-frame-v1/map-canvas.json) · [本机战斗回场](../build/analysis/fixed-se-shared-scene-frame-v1/battle-return.json)

<a id="battle-266-relay-retirement-validation"></a>

## 固定 SE 护卫交接后的摘链与结果核验

REA 6.7.0 与 Ghidra 12.1.4 对固定 SE 集中读取六段共 1,008 字节。复用 11 个完整函数档案、动作分派表及 9 个留存字节视图。Apple LLVM 21.0.0 复核 77 处指令。16 个静态相位组合覆盖正常速度、慢速值等于 1、其他慢速值和未设置对象标志。槽顺序和结果分派按已注册对象、有效行及合资格回调推演。 [REA 回执](../build/analysis/battle-266-relay-retirement-v1/rea-evidence.json) · [源指令与条件汇总](../build/analysis/battle-266-relay-retirement-v1/validation.json)

三组原创回放覆盖普通自身、同槽和独立护卫。原距离夹具回执逐字节复现。九个现有测试文件共 162 项通过，另核对 4,858 个基线路径。原版完整回放、同版、新的产品差异实现及三端验收仍待执行。 [回放结果](../build/analysis/battle-266-relay-retirement-v1/local-comparison.json) · [回归日志](../build/analysis/battle-266-relay-retirement-v1/local-regression.log)

<a id="battle-266-guard-slot-consumption-validation"></a>

### 固定 SE 角色槽清零及飞行物消费核验

REA 6.7.0 与 Ghidra 12.1.4 补查三段共 138 字节，复用五份字节、函数和派生视图。Apple LLVM 21.0.0 与 PE 原字节核对 26 处指令，会话已关闭。 [来源核验](../build/analysis/capability-batch-readiness-v1/guard-source-review.json)

原有战斗共享所有者在动作 24、71、217 分别运行撤离和同槽换人，共六种原创输入。stage306 均标记飞行物退役并让施法者进入等待动作 23，三种替换对象都保持动作 0。67 项既有护卫、自身结果和飞行物测试通过。原版实际角色离场与替换时序、三端及同版用例仍待验。 [本机对照](../build/analysis/capability-batch-readiness-v1/guard-local-comparison.json) · [回归日志](../build/analysis/capability-batch-readiness-v1/guard-regression.log)

<a id="battle-slot-publication-validation"></a>

### 固定 SE 动作 221、222、49 的角色登记顺序

REA 6.7.0 与 Ghidra 12.1.4 新读取动作 222 的 340 字节，复用七份留存读取。Apple LLVM 21.0.0 核对 29 处指令、三条动作登记及两个清槽至重绑区间。REA 会话已关闭。 [原字节核验](../build/analysis/battle-slot-publication-v1/source-review.json)

按 0、5 两个槽的两种分配，在 stage306 的动作 221 和 49 回调中观察登记与退场顺序。两组均回放到旧 B 退役且新 B 保留，六项现有 RID0 与护卫离场回归通过。原版动作 49 的最终清槽来自指令，实战自然触发待验。 [两组回放](../build/analysis/battle-slot-publication-v1/slot-comparison.json) · [回归](../build/analysis/battle-slot-publication-v1/targeted-regression.log) · [交付核验](../build/analysis/battle-slot-publication-v1/validation.json)

<a id="battle-266-long-receive-validation"></a>

## 固定 SE 长接收、余留与战斗分派核验

REA 6.7.0、Ghidra 12.1.4 核六段原始字节及余留前移入口。Apple LLVM 21.0.0 复核固定样本的读取容量、边界分支、消息标签、四槽写入与窗口帧的相对地址基准。按已有原始接收偏移对比每个字起点至四字节写满的长度边界。所选普通 `M` 与无效起始标记条件按原指令推导。原版实际网络输入和 SKL266 实读继续沿 BF-T36 验收。 [REA 回执](../build/analysis/battle-266-long-receive-v1/rea-evidence.json) · [来源、边界及推导](../build/analysis/battle-266-long-receive-v1/validation.json)

经现有共享协议及网页会话各跑原创输入，覆盖两条完整战斗消息、七字节余留、容量拒绝、坏尾、无效起始标记及网页分四次读取。网页去掉无效起始标记后保留 29 字节，后续完整战斗消息直到收到下一读才发布。九个现有测试文件共 108 项通过。 [本机夹具](../build/analysis/battle-266-long-receive-v1/local-comparison.json) · [常规测试](../build/analysis/battle-266-long-receive-v1/local-regression.log)

<a id="battle-266-window-draw-retirement-validation"></a>

## 固定 SE 战斗窗绘制及回收的写入核验

同一固定样本用 REA 6.7.0、Ghidra 12.1.4 集中核对共用绘制、文字提交及覆盖层，沿现有档案复核图形值回写、全局队列、输入清理和窗体回收。Apple LLVM 21.0.0 从原字节核两张分派表、所选直接调用的局部地址、池入口及 `KERNEL32!HeapFree` 导入槽。以 `44FC66` 前为基准对三个暂存字逐项比较，所核路径与暂存区间分开。运行输入回调和实际读值沿原 BF-T36 核验。 [工具原始回执](../build/analysis/battle-266-window-draw-retirement-v1/rea-evidence.json) · [地址与版本核验](../build/analysis/battle-266-window-draw-retirement-v1/validation.json)

两组 stage306 超时夹具的输出与上次字节一致，仍复现 18 次等待或回放后关窗状态保持为 2。10 个现有测试文件共 146 项通过。涵盖共享战斗指令、结果、投射物、守护及网页相关用例。原版关窗及实际跨帧读值、目标设备与同版官方会话留作完整验收。 [本机夹具](../build/analysis/battle-266-window-draw-retirement-v1/local-comparison.json) · [本机回归](../build/analysis/battle-266-window-draw-retirement-v1/local-regression.log)

<a id="battle-266-window-input-retirement-validation"></a>

## 固定 SE 战斗退役输入核验

REA 6.7.0、Ghidra 12.1.4 复用四份同版完整函数，补六组引用、一处计算调用解析和 527 字节的五段读取。Apple LLVM 21.0.0 从原文件核对 57 处所选指令及 20 处直接登记。其中 12 处登记见于 REA 引用，另八处由相对调用位移和传参指令复核。导出记录后关闭分析会话。 [原字节、调用登记和栈位置](../build/analysis/battle-266-window-input-retirement-v1/validation.json)

本机经现有 Canvas 入口和共享指针核心送入五次受控事件，核非活动指针失去捕获、活动指针失去捕获、重新按下和取消。现有六组测试文件共 96 项通过。原版窗 26 拖放准入、三个暂存字实际首读、目标宿主焦点和三端组合按对应验收用例。 [指针状态回执](../build/analysis/battle-266-window-input-retirement-v1/local-pointer-comparison.json) · [本机回归](../build/analysis/battle-266-window-input-retirement-v1/local-regression.log)

<a id="battle-266-window-control-writes-validation"></a>

## 固定 SE 指令窗的关闭控件与绘制核验

REA 6.7.0 和 Ghidra 12.1.4 一次会话核七段共 966 字节，含加载和关闭共 57.299 秒。Apple LLVM 21.0.0 独立核完整控件定义、各模式标志、普通及拖放分派、关闭态回调和图文写入。所选图号、文本和绘制指令是固定样本的静态证据。 [样本指纹、原文件偏移与指令](../build/analysis/battle-266-window-control-writes-v1/validation.json)

重跑两组原创超时夹具，分别在等待和回放走 18 帧，阶段 2、速度零、位移零均重现。七个已有测试文件共 77 项通过。第 17 次标记帧的原版控件与绘制结果是静态预期，完整实读及三端用例待执行。 [本机对照](../build/analysis/battle-266-window-control-writes-v1/local-comparison.json) · [回归日志](../build/analysis/battle-266-window-control-writes-v1/focused-regression.log)

<a id="battle-266-ime-presentation-validation"></a>

## 固定 SE 组合与候选呈现核验

REA 6.7.0、Ghidra 12.1.4 复用四份完整函数档案，集中补读四段共 1,299 字节，并查两组全局引用。Apple LLVM 21.0.0 从原文件核过 54 处所选指令及实际导入名称。频道优先级表、候选尺寸和发布、满队列返回及调用栈各按原字节记录。会话已关闭。 [证据、偏移和明确边界](../build/analysis/battle-266-ime-presentation-v1/validation.json)

本机夹具用原创单双字节组合核 14 个字号、NUL 边界和优先级 210、226 的实际返回。五组现有测试共 53 项通过。输入法候选、宿主真实事件与原版逐字暂存值继续沿验收。 [本机对照](../build/analysis/battle-266-ime-presentation-v1/stage306-probe.json) · [回归日志](../build/analysis/battle-266-ime-presentation-v1/local-regression.log)

<a id="battle-266-host-calendar-validation"></a>

## 固定 SE 时区缓存与日期发布核验

REA 6.7.0、Ghidra 12.1.4 复用已有日期投影与环境采样档案，集中读取六段共 644 字节并查两组引用。Apple LLVM 21.0.0 独立核对 61 处所选指令、三个宿主导入、月表及局部分支。会话已关闭。 [指令、文件偏移和核验范围](../build/analysis/battle-266-host-calendar-v1/validation.json)

将原指令推导的算术与独立日期算法比对。25,202 个本地日期覆盖 1970–2038，并用三组给定偏移与两种显式夏令时标志组合，共 151,212 项结果一致。另核对 2038 年进入有符号负区间的位型。stage306 的实际共享客户端在原创夹具中核到游戏日界、无符号秒数环回及 `-1` 的返回。五组既有测试共 113 项通过。真实 Windows 时区切换日的回退和原版 SKL266 实读继续按对应验收。 [本机对照](../build/analysis/battle-266-host-calendar-v1/stage306-probe.json) · [回归日志](../build/analysis/battle-266-host-calendar-v1/local-regression.log)

<a id="battle-266-frame-intervening-writes-validation"></a>

## 固定 SE 的 SKL266 相邻帧所选写入核验

REA 6.7.0 和 Ghidra 12.1.4 读取六段共 340 字节，含加载和关闭共 58.817 秒。Apple LLVM 21.0.0 独立核对调用边、PE 导入和输出区间。对象指针排序、绘制数字转换、所选历史键及键盘地址与 SKL266 三字分开。时区和窗口回调继续按具名范围。 [来源、字节及局部范围](../build/analysis/battle-266-frame-intervening-writes-v1/validation.json)

重新执行 12 个原创战斗用例，其中四个覆盖所选相邻帧。在第 23 次合资格回调运行前序 404 或 405，第 24 次消费 266。两种普通结果第四格均为 0，两种仅自身 RID 均返回缺上下文。七个已有测试文件共 68 项通过。原版最后读值、当前同版及设备仍待执行。 [本机用例](../build/analysis/battle-266-frame-intervening-writes-v1/local-comparison.json) · [回归日志](../build/analysis/battle-266-frame-intervening-writes-v1/focused-regression.log)

<a id="fixed-se-work-slot-seven-validation"></a>

## 固定 SE 的槽 7 占用和制造回包核验

REA 6.7.0 与 Ghidra 12.1.4 复核两个地址的引用和三段共 213 字节。会话含载入、查询及关闭用时 57.537 秒。Apple LLVM 21.0.0 独立核过动作启停、业务通知、两端占用交换和装备选择。已复算两种顺序、同槽、普通槽及字节边界。 [来源、偏移及演算用例](../build/analysis/fixed-se-work-slot-seven-v1/validation.json)

以两组合成回包驱动 stage306 的共享客户端和制造状态。两种顺序都交换了物品，仍发送包含旧槽 8 的 `+>L`。客户端在制造打开期间按普通门槛拒绝主动移动。关闭后发送 `'#Q 8 7 -1`，请求发出时库存仍保持原值。七个既有测试文件共 103 项通过。当前同版、原版和目标设备的组合执行沿原用例验收。 [本机输入和实际请求](../build/analysis/fixed-se-work-slot-seven-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-work-slot-seven-v1/local-regression.log)

<a id="fixed-se-work-context-publication-validation"></a>

## 固定 SE 工作资料、时钟与两种解除的核验

REA 6.7.0 与 Ghidra 12.1.4 在一次会话完成两组引用及三段共 440 字节。载入、查询和关闭共 57.918 秒。独立 Apple LLVM 21.0.0 核对两条回复、两类帧表、解除与预览的原字节。所选经典动作、配方和时钟复用既有档案，背包与技能读取同一状态。 [来源、偏移及核验范围](../build/analysis/fixed-se-work-context-publication-v1/validation.json)

用本机原创回复驱动现有客户端和运行时。掩码不选字段 15 时保留工作资料。显式归零且尚余 1000 毫秒时，stage306 保留活动上下文。当轮从 1 毫秒扣至 0 时生成解除和普通槽配方查询，下一帧清模式，配方需等待新回复。生成的请求按现有编码核字节。六个现有测试文件共 99 项通过。完整原版、三端产品、真机及同版用例沿原计划。 [本机对照](../build/analysis/fixed-se-work-context-publication-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-work-context-publication-v1/local-regression.log)

<a id="fixed-se-alternate-inventory-quantity-validation"></a>

## 固定 SE 的背包数量窗提交和退役核验

REA 6.7.0 与 Ghidra 12.1.4 在一次会话读取三段共 520 字节，并查询三组地址引用，含载入和关闭用时 57.665 秒。从建立取证目录到首次规格核验通过经过 14 分 44 秒。独立 Apple LLVM 21.0.0 核对 82 条指令、14 份留存范围和两条登记记录。三项 REA 地址引用均为空，原 PE 解码可见 21 处直接操作数。沿已留存的启动遍历回调另核设置初始化位置。 [源档案、耗时和字节](../build/analysis/legacy-alternate-inventory-quantity-v1/validation.json)

本机用同一共享客户端及微信库存适配器验证，异槽更新保留选择，源量下调、目标填充和源槽换位分别拒绝旧选择，前述路径共发零条请求。重新选取后接受合法数量 3，发出 `'#Q a b 3`，未收回复前库存保持。网页入口经源码核对。四个已有测试文件共 84 项通过。原版正常事件、实际页面、真机和同版服务继续按用例验收。 [本机夹具](../build/analysis/legacy-alternate-inventory-quantity-v1/stage306-probe.json) · [回归日志](../build/analysis/legacy-alternate-inventory-quantity-v1/local-regression.log)

<a id="fixed-se-stack-quantity-input-preference-validation"></a>

## 固定 SE 的堆叠开框偏好与现有入口对照

REA 6.7.0 与 Ghidra 12.1.4 在同一会话查询三组引用、三段共 270 字节。引擎载入、查询及关闭合计 57.232 秒。从建立取证目录到首次规格核验通过经过 21 分 46 秒，含取证、差异对照、编辑和验证。Apple LLVM 21.0.0 逐指令核对四条消费路径、按钮回调和保存读回。REA 返回六处该设置的引用，原 PE 独立解码共定位 14 处直接地址操作数。经典控件指针由原描述符核对。 [固定样本、耗时、偏移及复用来源](../build/analysis/legacy-stack-input-preference-v1/validation.json)

用原创背包数据驱动 stage306 的共享客户端和微信库存适配器，移动和拆分同时可用，点选目标不发送。源有六件时，输入七保留选择并拒绝发送，动作入口也拒绝输入 `0`。显式移动两件和整组分别发 `'#Q 8 9 2` 和 `'#Q 8 9 -1`，未收到资料更新时库存保持。网页双按钮经源码核对。五个现有测试文件共 91 项通过，本次成果为原版静态规格和本机对照。原版运行、实际页面、真机及当前同版按各自的用例继续。 [本机对照](../build/analysis/legacy-stack-input-preference-v1/stage306-probe.json) · [回归日志](../build/analysis/legacy-stack-input-preference-v1/local-regression.log)

<a id="fixed-se-251-completion-validation"></a>

## 固定 SE 的 251 改路与接收时序核验

REA 6.7.0 和 Ghidra 12.1.4 在同一会话补查三个指令范围及三处地址引用，含分析器载入与关闭共 58.020 秒。Apple LLVM 21.0.0 重核原 PE，场景子状态的精确 REA 引用为 216 处，独立解码还找到四处直接写入。继续以实际分支和对象回调核对所选流程。 [地址、原文件偏移和复用证据](../build/analysis/legacy-scene-251-completion-v1/validation.json)

本机将两条原创 `TfD` 合在同一个数据块。挂起地图 401 的首次素材读取时，现有客户端只消费第一条，旧运行时已关闭。释放后连续准备第二个地图，401 的补片无效，匹配 402 的补片使客户端恢复 `playing`，全程只建立一次会话。五个现有测试文件共 63 项通过。原版实际回复组合及三端完整用例沿 GF-A18 和 WT-A02 继续。 [对照回执](../build/analysis/legacy-scene-251-completion-v1/stage306-probe.json) · [本机回归](../build/analysis/legacy-scene-251-completion-v1/local-regression.log)

<a id="fixed-se-scene-controller-route-validation"></a>

## 固定 SE 的换场控制器选路核验

复用 13 份函数档案，以 REA 6.7.0 和 Ghidra 12.1.4 同次补核 570 字节及四组地址引用，含引擎载入及关闭共 57.923 秒。Apple LLVM 21.0.0 复核两个调用入口、分支、调度及快照的原 PE 指令。`44013B` 的 `5E2748` 引用是邻接数组扫描上界。快照槽的保存与读取沿另外两条引用。 [样本摘要、偏移和调用](../build/analysis/legacy-scene-controller-route-v1/validation.json)

原创的内存夹具内，实际客户端从地图 `[7,23]` 进入 `[7,401]`，退役远端角色，匹配补片后恢复 `playing`，运行时修订为 2。补发带本地和远端 ID 的协同动作 82 成功解码七个参数，客户端以 `LEGACY_GAME_LOCAL_CONTEXT_STALE` 结束，世界和资源库关闭，清理错误为零。九个现有文件的 112 项本机回归通过。原版运行、实际 251 结束、当前同版及三端完整验收待执行。 [本机对照](../build/analysis/legacy-scene-controller-route-v1/stage306-probe.json) · [回归日志](../build/analysis/legacy-scene-controller-route-v1/local-regression.log)

<a id="legacy-transition-graphics-rebuild-validation"></a>

## 固定 SE 过渡期间的图形重建核验

REA 6.7.0 与 Ghidra 12.1.4 在同一会话补读重建及普通场景捕获的两段共 482 字节，查询四处全局引用。包括引擎初始化和关闭共 58.875 秒。Apple LLVM 21.0.0 按固定 PE 核旧资源释放、重建返回分支、两条捕获和共用尾段。 [原文件、函数范围和指令](../build/analysis/legacy-transition-rebuild-v1/validation.json)

两次原创回城夹具调用实际 Canvas 适配函数。替换发生在首次图形读取挂起时，旧画布保持五次绘制，接手画布的四次调度零绘制。独立失败用例共尝试九次绘制，第四张淡入画面失败后报告 `LEGACY_CANVAS_FRAME`，世界及资源库关闭，清理错误为零。七个现有文件共 56 项本机回归通过。原版运行、实际设备返回和三端完整验收待执行。 [本机对照](../build/analysis/legacy-transition-rebuild-v1/stage306-probe.json) · [回归日志](../build/analysis/legacy-transition-rebuild-v1/local-regression.log)

<a id="fixed-se-ordinary-map-fades-validation"></a>

## 固定 SE 普通换图条带与交接核验

复用 10 份固定样本原生函数档案。REA 6.7.0 和 Ghidra 12.1.4 同一会话新读 780 字节并查询实际呈现调用，含初始化与关闭 59.396 秒。Apple LLVM 21.0.0 对照原 PE 核各级派发表、两套推进顺序、阈值、普通更新和外层提交。 [文件偏移、指令及查询回执](../build/analysis/legacy-map-fade-v1/validation.json)

用两幅原创像素源派生 26 张淡出、16 张淡入，以及 16 次内部准备。每次绘制计算 640×480 与 320×240 的像素摘要。独立计算校验行位置、最后一帧和留空行。合成填充值为零，固定样本的实际填充值与设备结果仍待验。 [原创条带对照](../build/analysis/legacy-map-fade-v1/synthetic-frames.json)

现有客户端加 Canvas 函数对照从地图 B=40000 切到 B=40001。匹配补片后原运行时已关闭，新图图形读取故意挂起时一次输入已被接收，呈现序号仍为 1。释放读取后新图呈现序号为 2。六个现有测试文件共 65 项通过。原版运行、同版和三端完整用例待验。 [本机对照](../build/analysis/legacy-map-fade-v1/stage306-probe.json) · [回归日志](../build/analysis/legacy-map-fade-v1/local-regression.log)

<a id="legacy-transition-background-validation"></a>

## 固定 SE 的过渡背景与回场交接核验

对固定 SHA-256 `37c4dfd2…13bd` 复用 11 份 REA 原生函数档案。REA 6.7.0 与 Ghidra 12.1.4 同一会话补两段共 224 字节和一次数据交叉引用，含初始化与关闭共 57.655 秒。Apple LLVM 21.0.0 对照原 PE 核队列、拷贝、准入、直接捕获、重放及物理退役。 [来源、工具与原字节回执](../build/analysis/legacy-transition-background-v1/validation.json)

以现有普通战斗回场夹具驱动共享客户端和战斗 Canvas 函数，可计数 2D 端口在切换前后均为 236 次呈现。普通运行时修订从 1 到 2，战斗画布关闭，末帧未写入。54 次过渡像素对照和后续移动通过。八个相关现有测试文件共 58 项通过。原版和适用设备结果、现行同版、网页、移动网页及微信的完整组合验收待执行。 [本机交接对照](../build/analysis/legacy-transition-background-v1/stage306-probe.json) · [回归日志](../build/analysis/legacy-transition-background-v1/local-regression.log)

<a id="legacy-graphics-deferred-upload-validation"></a>

## 固定 SE 的调色板延后上传核验

复用 5 份 REA 函数档案，另按固定 PE 核对 4516E0 的改变描绘模式提示。REA 6.7.0、Ghidra 12.1.4 新读两段共 158 字节，单次会话 57.378 秒。Apple LLVM 21.0.0 核限额、两条返回消费、标记更新及三个暂时关闭限额的入口。 [文件偏移与证据](../build/analysis/legacy-graphics-deferred-upload-v1/validation.json)

stage306 的 12 幅原创图像同一帧全数换色，未增加读取，再画同一颜色计划也没有新增换色。三个现有测试文件共 22 项通过。原版限额实际触发、背景表面及三端显示仍待验。 [原创图像对照](../build/analysis/legacy-graphics-deferred-upload-v1/stage306-probe.json) · [回归日志](../build/analysis/legacy-graphics-deferred-upload-v1/local-regression.log)

<a id="fixed-se-startup-palette-publication-validation"></a>

## 固定 SE 启动调色的来源和本机对照

REA 6.7.0 和 Ghidra 12.1.4 复用同一 SHA-256 样本的四份函数档案，补了五条定向证据。两个读取段共 2,652 字节，与 PE 原件逐字节一致。Ghidra 对间接分支只返回部分引用，Apple LLVM 21.0.0 和原件核对了 99 处所选指令、六个状态入口和三行资源。导出保留原 59 条与新增 5 条证据，随后关闭会话。 [来源核对与回执](../build/analysis/fixed-se-startup-palette-publication-v1/source-review.json)

stage306 的原创数组试次验证 0、13 的既有颜色路径，并复现 19、23 和零步数被拒。六组现有文件共 121 项本机回归通过。启动逻辑帧、实际标识画面、当前同版和三端产品沿原用例验收。 [共享入口对照](../build/analysis/fixed-se-startup-palette-publication-v1/focused-probe.json) · [回归日志](../build/analysis/fixed-se-startup-palette-publication-v1/local-regression.log) · [范围核验](../build/analysis/fixed-se-startup-palette-publication-v1/validation.json)

<a id="fixed-se-scene-palette-follow-validation"></a>

## 固定 SE 场景调色的来源核验和本机帧对照

复用同一固定 PE 的八份函数档案及 `5028A0` 的 163 字节记录。REA 6.7.0、Ghidra 12.1.4 增查三个精确引用及一个 58 字节窗口，导出保留原 59 条和新增 4 条证据后关闭。Apple LLVM 21.0.0 对照原件核 61 处所选指令、13 处直接调用和 `Ta>` 的注册。两处调色调用的归属及旧音频描述均已更正。 [样本、指令、偏移和回执](../build/analysis/fixed-se-scene-palette-follow-v1/source-review.json)

本轮在相同素材的六个独立世界实例中经现有包解码送入 `Ta>`。空值和 `-7` 解码为 `-1`，0、23、38、39 保留原值。六个 `96×72` 普通帧的 RGBA 摘要相同。另复用已保存的同基线地图夹具，首次新图绘制暂挂时共享客户端已接受移动。六组现有测试文件共 111 项本机回归通过。原版实际场景、设备像素和三端产品仍按对应验收用例。 [场景调色对照](../build/analysis/fixed-se-scene-palette-follow-v1/stage306-probe.json) · [已有地图首帧夹具](../build/analysis/fixed-se-shared-scene-frame-v1/map-canvas.json) · [回归日志](../build/analysis/fixed-se-scene-palette-follow-v1/local-regression.log) · [范围核验](../build/analysis/fixed-se-scene-palette-follow-v1/validation.json)

<a id="fixed-se-palette-output-depth-validation"></a>

## 固定 SE 默认调色位深核验

复用八个已归档函数的入口及原字节范围。REA 6.7.0 和 Ghidra 12.1.4 新增四段读取和两次数据引用，四段共 891 字节均与原 PE 一致。Apple LLVM 21.0.0 复核 107 处所选指令和 8、16、24、32 的上传跳转表。导出保留原 59 条与新增 6 条证据后关闭会话。 [工具、字节与引用](../build/analysis/fixed-se-palette-output-depth-v1/source-review.json)

以原创 CGP、RD 和八个索引驱动现有共享调色及精灵入口，核默认 RGBA、显式黑色和透明索引。固定 16/24 位结果按原指令推导，验证两组掩码、保留项和 BGR 输出顺序。五组现有测试文件共 75 项本机回归通过。原版表面实际返回和像素、当前同版及三端流程继续沿原验收。 [局部像素对照](../build/analysis/fixed-se-palette-output-depth-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-palette-output-depth-v1/local-regression.log) · [范围核验](../build/analysis/fixed-se-palette-output-depth-v1/validation.json)

<a id="fixed-item-palette-output-depth-validation"></a>

## 固定 Item 默认调色位深核验

保留 REA 6.7.0、Ghidra 12.1.4 的 19 条在线调用结果。工具连接中断后，复用留存设备初始化与重建档案，并在同版本本机 REA 命令行补齐 24 位动态转换。命令行进程正常退出，原工具连接仍返回 `Transport closed`，关闭回执无法读取。Apple LLVM 21.0.0 核对 Item 57 处所选指令及 32 个固定色。 [来源、调用与范围](../build/analysis/legacy-item-palette-output-v1/source-review.json)

原创 CGP 与两行 RD 验证固定色、原色与现行索引 168、行顺序和默认 RGBA。指定 RGB565、RGB555 掩码及 BGR 的字值来自静态指令推导。两组相关测试文件共 36 项通过。实际表面、原版重建显示、三端产品和当前同版沿 PR-A09/A10 验收。 [本机对照](../build/analysis/legacy-item-palette-output-v1/stage306-probe.json) · [回归日志](../build/analysis/legacy-item-palette-output-v1/local-regression.log)

<a id="fixed-item-explicit-palette-upload-validation"></a>

## 固定 Item 显式调色的来源与本机核验

原 REA 工具通道返回 `Transport closed`。同版本本地 REA 6.7.0 与 Ghidra 12.1.4 一次载入固定 Item，留存 21 条记录并核实关闭。Apple LLVM 21.0.0 对照 PE 核 9 个函数的 12,243 字节范围和其中所选调用及包装等 75 处指令。两版的 5,980 字节选择表完全一致，65,536 个输入的映射摘要与留存对照一致。 [来源、工具与关闭回执](../build/analysis/legacy-item-explicit-palette-v1/source-review.json)

执行 `node --test shared/tests/legacy-game-named-palette.test.mjs`，8 项通过，覆盖选择域、命名覆盖内嵌、旗标 `0x04`、准备结果及缓存隔离、迟到读取退役、缺载体和未覆盖色值。原版 24 位、空槽和第 11 个合资格失配块依据静态结果填写 PR-A09/A10。实际像素、三端产品及当前同版继续验收。 [回归日志](../build/analysis/legacy-item-explicit-palette-v1/local-regression.log) · [范围核验](../build/analysis/legacy-item-explicit-palette-v1/validation.json)

<a id="fixed-se-explicit-palette-upload-validation"></a>

## 固定 SE 命名与内嵌色表核验

REA 6.7.0、Ghidra 12.1.4 复用同一固定 PE 的七份函数范围。新读 `447B10`、`505ED4`、`445D9B` 共 3,311 字节，均与原 PE 匹配。补取一处完成分支的交叉引用，导出保留 59 条旧记录及 4 条新记录，会话已关闭。Apple LLVM 21.0.0 核对 57 处所选指令及十组 24 位条件与写入。 [工具、版本、偏移和字节](../build/analysis/fixed-se-explicit-palette-upload-v1/source-review.json)

现有共享 RGBA 资源库的九组原创夹具均与既有摘要一致，覆盖边界选择值、色偏和旗标。移除指定载体后确认相关错误和已缓存内嵌图的可绘结果。24 位给定像素按原指令推导。输入 BGR 为 `00 00 00` 和 `60 46 20` 时，所选命名表分别输出 `01 00 00` 和 `60 46 20`，显式表分别输出 `00 00 00` 和 `01 46 20`。五组现有测试文件共 70 项本机回归通过。原版运行、设备输出和三端产品按既有验收用例。 [本机对照](../build/analysis/fixed-se-explicit-palette-upload-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-explicit-palette-upload-v1/local-regression.log) · [范围核验](../build/analysis/fixed-se-explicit-palette-upload-v1/validation.json)

<a id="legacy-graphics-partial-cache-validation"></a>

## 固定 SE 的图形分块缓存和恢复核验

按样本和分析配置复用 7 份 REA 函数档案。REA 6.7.0、Ghidra 12.1.4 补读已分配链的发布和分配结束两段共 200 字节，用同一会话累计 57.620 秒，含初始化及关闭。Apple LLVM 21.0.0 对照固定 PE 核对分配、写尾、命中、每块绘制和重建。 [证据和文件偏移](../build/analysis/legacy-graphics-partial-cache-v1/validation.json)

本机把现有共享资源库上限设为一条缓存。两幅图计划两次返回 `LEGACY_ASSET_PINNED_BUDGET`，零新呈现，随后一幅图可重绘。现有 Canvas 函数接可控画布时保留当轮已产出请求，停止调度。显式给出较小新计划后呈现一次。六个现有测试文件共 77 项通过。原版、实际图形设备、三端产品及当前同版待验。 [对照回执](../build/analysis/legacy-graphics-partial-cache-v1/stage306-probe.json) · [回归日志](../build/analysis/legacy-graphics-partial-cache-v1/local-regression.log)

<a id="f5a-patch-retry-directory-validation"></a>

## 固定 F5A 备份重试和目录恢复核验

按同一固定样本和分析配置复用 12 份 REA 函数档案。REA 6.7.0 与 Ghidra 12.1.4 补读退出 102 分支和结果待处理标记，共两段 157 字节。Apple LLVM 21.0.0 对照原件核对准备、失败分派和目录续接的读写。 [原文件、归档及指令回执](../build/analysis/launcher-patch-retry-directory-v1/validation.json)

stage306 的退出解释器给出两次重试和第三次耗尽。原创夹具从旧目录切到新目录后，晚到旧结果被释放，新选择保持。同 Code 的另一行和旧目录都无法恢复这份缓存，匹配缓存仍需显式选择。六个文件的 38 项本机回归通过。原版实际运行、备用制品、三端产品和同版交接待验。 [本机对照](../build/analysis/launcher-patch-retry-directory-v1/stage306-probe.json) · [回归日志](../build/analysis/launcher-patch-retry-directory-v1/local-regression.log)

<a id="fixed-se-work-transition-retirement-validation"></a>

## 固定 SE 的共用工作退役与重建核验

复用 19 个留存函数范围及既有同步退役、配方重查和控件登记。REA 6.7.0、Ghidra 12.1.4 新取一份 43 字节函数档案、一次精确引用与五段共 542 字节。新增查询累计 56.896 秒，包含首次引擎载入。三条直接调用由 LLVM 21.0.0 解码独立复核。 [原字节与查询回执](../build/analysis/fixed-se-work-retirement-v1/validation.json)

stage306 实测配方返回等级继续持有上下文且无新请求，普通等级关闭走现有 62 编码，技能列表的关闭同样会提交 62。采集换场后关闭、清上下文且没有该请求，迟到结果也没有发送或重开。七个测试文件共 92 项本机回归通过。 [本机对照](../build/analysis/fixed-se-work-retirement-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-work-retirement-v1/local-regression.log)

WT-A01 至 WT-A04 记录实现后的组合验收条件。原版运行中的回调交错、当前同版与三端产品待验。 [组合用例](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_work_transition_retirement/proposed_acceptance)

<a id="fixed-se-classic-scene-window-queue-validation"></a>

## 固定 SE 换图与待处理开窗核验

REA 6.7.0、Ghidra 12.1.4 核对两处 204 写入所属过程和三个字节范围，共 448 字节。四次查询共 56.453 秒，包含启动分析引擎。独立解码核对 200、204、205、250、251、252 的表项及窗口和图形队列的实际调用。 [原字节与复用清单](../build/analysis/fixed-se-classic-transition-v1/validation.json)

stage306 从活跃的二级工作目标连续切换两张地图。旧运行实例关闭，晚到旧地图补片没有推进新地图就绪。旧选择及错阶段的二级回复无效，新一轮配对回包才恢复到二级选择，全程保持一条本机内存会话。所测换场未发动作 62。六个测试文件的 102 项现有测试通过。原版多过渡交错、三端产品与同版会话仍待验。 [本机对照](../build/analysis/fixed-se-classic-transition-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-classic-transition-v1/local-regression.log)

<a id="fixed-se-map-change-readiness-validation"></a>

## 固定 SE 普通换图等待的来源与本机对照

复用八个留存函数视图。REA 6.7.0、Ghidra 12.1.4 新读三段共 419 字节，用时 56.456 秒，含首次分析引擎载入。Apple LLVM 21.0.0 对照固定 PE 核对发送的取值和写入次序、两个回复序号字、补片的独立判断以及 202 的读取。目标文件的 `BFF330` 在初始化零填充区，所查五处绝对引用内三处写零。 [原件、查询与引用核验](../build/analysis/fixed-se-scene-readiness-v1/validation.json)

stage306 的三条合成 `=xE` 均可解码，地图及就绪状态保持。第一身份不同和第二身份为前一地图的补片都未推进新场景。身份对匹配的补片写入后可沿保留的本机角色恢复玩法，仍使用同一条内存会话。三个文件的 49 项现有测试通过。原版补片实际解除、三端产品及同版服务待验。 [本机对照](../build/analysis/fixed-se-scene-readiness-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-scene-readiness-v1/local-regression.log)

<a id="legacy-map-wait-patch-release-validation"></a>

### 两版补片解除与同轮续帧核验

REA 6.7.0、Ghidra 12.1.4 复用 SE 三段读回，在同一 Item 会话取得五份函数档案、开关引用与等待写入所属函数。Apple LLVM 21.0.0 对照两份原件的 86 个指令锚点。两版开关各有五次精确地址引用，已绑定到三个清零和两次读取。Item 会话已关闭。 [样本、档案和范围](../build/analysis/legacy-map-wait-patch-release-v1/source-review.json)

本机用 stage306 实际共享客户端进入新地图。标签先更新，地图及等待继续保留。同 B 异 A 的补片仍未使地图就绪。后续身份对匹配的补片使缓存增加一次更新，客户端在原内存会话就绪，地图名保留。沿用同产品基线的 49 项回归。原版补片开关置 1、实际消息次序及三端产品按 GF-A10 验收。 [本机回执](../build/analysis/legacy-map-wait-patch-release-v1/stage306-probe.json)

<a id="fixed-se-map-region-refresh-validation"></a>

## 固定 SE 地图重读及移动续接核验

固定 PE 复用 16 份留存函数档案。REA 6.7.0 与 Ghidra 12.1.4 补读中心比较及普通帧调度的两段，共 95 字节。两次读回共用分析会话，总耗时约 58 秒，含载入和关闭。Apple LLVM 21.0.0 核对原文件的分支、活动平面写入、范围及调度顺序。 [来源和核验回执](../build/analysis/fixed-se-map-region-refresh-v1/validation.json)

本机以模式 1 和 0 各执行一次缺格等待。旧 B 和同 B 异 A 的补片未写活动缓存，填其它格子及只补一格仍保持等待。收到完整补片时移动状态保持，随后一次移动调用继续且未重发请求。五个测试文件共 85 项通过。读取失败与两种重读时序来自静态证据，原版运行、三端产品和当前同版待验。 [两种模式对照](../build/analysis/fixed-se-map-region-refresh-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-map-region-refresh-v1/local-regression.log)

<a id="legacy-map-movement-refresh-validation"></a>

### 两版地图重读与缺格续接核验

复用 SE 的两段 REA 读回及既有帧规格。REA 6.7.0、Ghidra 12.1.4 在同一次 Item 会话核对四个所属函数、三组引用、两份函数档案及普通帧 100 字节。Apple LLVM 21.0.0 对照 55 个锚点。已沿主状态 9 的子状态 3 核普通移动、共用重读、两个模式与第三个独立读点。Item 会话已关闭。 [源码证据和适用调用](../build/analysis/legacy-map-movement-refresh-v1/source-review.json)

沿用已有场景、补片和移动夹具重跑 stage306 的模式 1 和 0，回执与此前逐字节一致。两组在小块和旧身份回复后保持等待，首次合格更新在缺格补齐后继续且未重发请求。沿用 85 项同代码基线回归。实际原版文件失败、独立函数调用及三端产品继续按具名来源验收。 [本机重跑回执](../build/analysis/legacy-map-movement-refresh-v1/stage306-replay.json)

<a id="legacy-map-cache-io-validation"></a>

### 两版地图缓存来源与本机核验

REA 6.7.0、Ghidra 12.1.4 在同一次 Item 会话保留 17 条记录，并关闭会话。复用三份 SE 资料。Apple LLVM 21.0.0 核对 Item 61 处及 SE 20 处指令和所选 REA 字节范围。路径值对应两版 `@Qu` 的第 3 个整数。负起点的磁盘与活动坐标差异由原循环的参数和寻址推导。 [原文件范围与推导算例](../build/analysis/legacy-map-cache-io-v1/source-review.json)

stage306 收到原创 `@Qu` 后公开既有 `cacheVariant`。原创缓存验证左上越界补片写四格、越界读零及第三平面高位；同 B 异 A 在现有单缓存中拒绝更新，短体返回 `LEGACY_MAP_LENGTH`。15 项地图回归通过。完整宿主读写的错误和恢复、原程序文件异常及当前同版待验。 [本机对照](../build/analysis/legacy-map-cache-io-v1/stage306-probe.json) · [回归日志](../build/analysis/legacy-map-cache-io-v1/local-regression.log)

<a id="legacy-map-notice-validation"></a>

### 地图校验通知与补取核验

REA 6.7.0、Ghidra 12.1.4 在同一次 Item 会话保留三份函数档案及两段字节。复用了两版留存接收和 SE 校验资料。Apple LLVM 21.0.0 核对 Item 35 处、SE 21 处指令，原文件两段各 768 字节的表均与独立生成值匹配。Item 会话已关闭。 [原文件与校验表核验](../build/analysis/legacy-map-notice-v1/source-review.json)

原创越界矩形以模式 1、0 各核同 B 异 A 的匹配和完整 32 位不匹配。原请求 A/B 及矩形保留。现有单缓存遇到不同 B 返回不可用。五项相关测试通过，覆盖 96 组校验和与本机 TCP 补取流程。原版文件短读及不同 B 缓存、场景准备后的三端组合沿 MF-T02 验收。 [本机对照](../build/analysis/legacy-map-notice-v1/stage306-probe.json) · [五项测试回执](../build/analysis/legacy-map-notice-v1/local-regression.log)

<a id="legacy-map-context-reentry-validation"></a>

### 地图目录与会话重开的核验

REA 6.7.0、Ghidra 12.1.4 保留 Item 普通重开、缓冲初始化、连接步骤的五份函数档案及一个所属函数核对。复用两版场景目录、退役与 SE 主状态 11。Apple LLVM 21.0.0 核对 Item 25 处、SE 16 处指令及两版全部精确目录地址引用。REA 会话已关闭。 [样本与指令](../build/analysis/legacy-map-context-reentry-v1/source-review.json)

stage306 原创输入先置目录值 13 并打地图补片，同协议的 `]gQ` 与再次初始化保留这两项。新 `@Qu` 把目录值改为 14 后，原 A/B 与头相同仍复用补片。旧协议关闭后投影清空且拒绝读缓存，新协议在目录未知时创建空图。四项相关回归通过。原版消息先后及三端持久文件仍按 MF-T01 核。 [本机复现](../build/analysis/legacy-map-context-reentry-v1/stage306-probe.json) · [测试日志](../build/analysis/legacy-map-context-reentry-v1/local-regression.log)

<a id="first-config-directory-composition-validation"></a>

## 登录器首次配置与目录恢复的共同核验

复用固定 F5A 的目录选择、首次配置、终止观察和普通启动函数档案。REA 6.7.0、Ghidra 12.1.4 补读三槽检查的 33 字节，Apple LLVM 21.0.0 核对各入口所读槽、选择索引、配置过程占用和清槽时点。 [来源与核验](../build/analysis/launcher-first-config-directory-composition-v1/validation.json)

本机用两条原创同 Code 记录对照，切换条目或目录时资源绑定改变，首次配置查找键相同。现有首次配置计划按旧同步语义生成，现有微信宿主夹具重开后显式恢复目录，再按条目重选，未产生额外写入。七个相关测试文件的 56 项通过。原版运行、实际配置器配对和三端产品配置提交及重开待验。 [本机对照](../build/analysis/launcher-first-config-directory-composition-v1/stage306-probe.json) · [回归日志](../build/analysis/launcher-first-config-directory-composition-v1/local-regression.log)

<a id="historical-forget-return-validation"></a>

## 历史遗忘返回与 Item 报价页数核验

两固定样本分别复用经典资料、已登记回调和另一套窗体的留存来源。REA 6.7.0 与 Ghidra 12.1.4 新取四次精确引用及七段 834 字节。SE 的 `C07F8C` 引用查询未返回结果，固定 PE 的所查指令仍核到三次直接读取。两个会话均已导出并关闭。 [来源、本机夹具与核验范围](../build/analysis/fixed-se-forget-return-v1/validation.json)

stage306 夹具覆盖空列表明确返回、稀疏技能紧密序号、过期选择拒绝后返回，以及离页只退役。六个测试文件的 113 项本机回归通过。第二套遗忘和报价的原版运行、目标页面及同版服务结果继续待验。 [本机对照](../build/analysis/fixed-se-forget-return-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-forget-return-v1/local-regression.log)

<a id="fixed-se-pet-count-selection-validation"></a>

## 固定 SE 宠物资料与训练选择核验

复用四份宠物接收和发布函数档案、加点页已有派生指令及训练报价档案。REA 6.7.0、Ghidra 12.1.4 在同一分析配置补读四个所需范围，共 576 字节，核对原文件及所选调用。查询共 56.805 秒，含首次分析引擎载入，证据已导出并关闭会话。 [证据与验收](../build/analysis/fixed-se-pet-selection-v1/validation.json)

现有客户端用原创回包核对余额不足先于空宠物、金额相等可提交、两稀疏物理槽和经典选宠行、属性刷新及移除失效。六个测试文件的 114 项现有回归通过。第二套原版窗口及目标页面的组合用例待执行。 [本机对照](../build/analysis/fixed-se-pet-selection-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-pet-selection-v1/local-regression.log)

<a id="fixed-se-training-quote-pages-validation"></a>

## 宠物训练报价的空表、翻页和替换

复用 12 个留存的函数范围，校对两版固定 PE。REA 6.7.0 与 Ghidra 12.1.4 新取两次引用查询及 216 字节。两次引用均为空，原文件仍核到窗 58 的表记录、总页数的三处读取、四个窗口登记和六个经典替换序号。Apple LLVM 21.0.0 核实后继调用、先选行后翻页和 Item 同号返回。 [原字节与核验](../build/analysis/fixed-se-training-quote-pages-v1/validation.json)

用 stage306 的实际客户端与内存传输夹具注入原创回包。普通同模式空表保留旧两行。替换序号 `0x146` 发布空表，旧版本点击、空表点击和取消均无新请求。新报价清旧等待资料，迟到选宠无提交，随后只有当前课目的有效选择发出 `/1I`。52 项客户端现有测试通过。 [本机对照](../build/analysis/fixed-se-training-quote-pages-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-training-quote-pages-v1/local-regression.log)

PS-A04、PS-A05 记录后续组合验收。原版第二套窗、三端产品及同版会话待验。 [用例与恢复条件](game-static.md#fixed-se-training-quote-pages)

<a id="fixed-se-battle-results-validation"></a>

## 固定 SE 的战后结果窗核验

沿固定样本和原分析配置复用 ST-01 至 ST-05 及 SO-01/02。REA 6.7.0 与 Ghidra 12.1.4 补核两个接收体、两个初始化体和窗 30 逐帧体的五组字节，共 2,108 字节。Apple LLVM 21.0.0 对照实际调用、数值读取、共享期限和两张经典窗的 70 条控件记录。已导出并关闭 REA 会话。 [字节回执](../build/analysis/fixed-se-battle-results-v1/rea-ranges.json) · [范围核验](../build/analysis/fixed-se-battle-results-v1/validation.json)

已有世界入口对两条结果各验证入场前、普通场景与战斗待入场三种状态。六组原创输入均能解码，消费未产生窗口效果且世界视图未变。包括通信、战斗、入场与退场在内的 100 项现有本机回归通过。两窗口同时活动、连续两份结果的真实帧交错、三端和同版服务仍待验。 [基线对照](../build/analysis/fixed-se-battle-results-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-battle-results-v1/local-regression.log)

<a id="fixed-se-classic-directory-mini-mail-validation"></a>

## 经典目录、玩家资料和迷你邮件核验

复用 13 份同源 REA 函数档案和 16 份已有派生视图。REA 6.7.0 与 Ghidra 12.1.4 新取 `4B8030` 的 35 字节档案。`4B7D30` 在该配置没有函数定义，复用既有控件视图并核对 REA 的 621 字节读回。Apple LLVM 21.0.0 与原 PE 核对 79 处直接调用、93 处指令、4 张经典描述符和 271 条控件记录。REA 已导出并关闭。 [原档案索引](../build/analysis/fixed-se-classic-directory-confirm-v1/source-review.json) · [会话状态](../build/analysis/fixed-se-classic-directory-confirm-v1/rea-session-closed.json)

9 组 stage306 帧走入场前、已有场景普通对话及回城中的真实消费入口，均可解码，所查回复没有发布菜单或历史效果。现有 `/1I` 编码通过 5 组请求对照，另有 10 个原规则投影。6 个测试文件共 115 项既有本机回归通过。SC-T12 至 SC-T15 的原版运行和三端验收待执行。 [本机对照](../build/analysis/fixed-se-classic-directory-confirm-v1/stage306-probe.json) · [回归](../build/analysis/fixed-se-classic-directory-confirm-v1/local-regression.log) · [范围和用时](../build/analysis/fixed-se-classic-directory-confirm-v1/validation.json)

<a id="fixed-se-item-target-menus-validation"></a>

## 经典普通用物的两级目标核验

固定样本复用 9 份 REA 函数档案和 12 份派生视图。REA 6.7.0 与 Ghidra 12.1.4 新增交换函数 `47F200` 的 193 字节档案，查询用时 57.857 秒，含加载。Apple LLVM 21.0.0 对照 59 处直接调用、81 处指令、两组经典描述符的 53 条控件以及另一套的两条注册。REA 会话已导出并关闭。 [原档案索引](../build/analysis/fixed-se-item-target-menus-v1/source-review.json) · [会话结束](../build/analysis/fixed-se-item-target-menus-v1/rea-session-closed.json)

用四组完整帧验证 stage306 在入场前和已有场景时均能解码两种回包，世界仍未发布菜单效果。五种已有请求编码和三个用物入口用例通过。另用 11 个独立投影核对留存序号、名称定界、宠物筛选、普通或特殊槽交换及占用顺序。六个文件的 110 项现有本机回归通过。SC-T01 至 SC-T04 及 SC-T09 至 SC-T11 的原版与三端验收待执行。 [本机对照](../build/analysis/fixed-se-item-target-menus-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-item-target-menus-v1/local-regression.log) · [范围和用时](../build/analysis/fixed-se-item-target-menus-v1/validation.json)

<a id="fixed-se-item-target-retirement-validation"></a>

### 两级用物的替换、取消和换场核验

固定 SE 复用用物、工作目标、窗口帧和换场的 38 份留存函数范围记录。REA 6.7.0 与 Ghidra 12.1.4 新增两个填行函数档案，共 840 字节，另做五次精确引用查询。57.279 秒包含首次引擎载入。引用结果与 LLVM 21.0.0 解码交叉检查，精确引用未命中的直接指令单独记录。 [证据、地址与工时](../build/analysis/fixed-se-item-target-lifecycle-v1/validation.json)

在 stage306 的实际本地客户端会话中，六份用物回复均逐条确认收到。测试覆盖显式用物、一级替换、工作目标活跃和换场后等待地图。均未更新游戏或背包资料，也未发送新请求。现有工作目标可正常返回并在换场时退役。五个文件的 122 项本机回归通过。SC-T10、SC-T11、SC-T16、SC-T17 的原版及三端完整验收待执行。 [收发对照](../build/analysis/fixed-se-item-target-lifecycle-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-item-target-lifecycle-v1/local-regression.log)

<a id="fixed-se-ccl-scene-publication-validation"></a>

## 固定 SE 的 `CcL` 字段与场景消费核验

核对 13 份留存 REA 函数档案。REA 6.7.0 和 Ghidra 12.1.4 新增 `441F50` 档案。回调 `441D70` 在该配置没有函数定义，沿 REA 字节视图与 PE 原字节核对 476 字节。Apple LLVM 21.0.0 核对 64 处直接调用、两组分支表及回调表。REA 已导出并关闭。 [原字节与索引](../build/analysis/fixed-se-ccl-scene-publication-v1/source-review.json) · [会话结束](../build/analysis/fixed-se-ccl-scene-publication-v1/rea-session-closed.json)

3 组实际 stage306 输入覆盖入场前、已有场景和选择超范围，均解码且未发布场景效果。另有 19 个独立投影核对模式、重复、满槽、分配失败及正文边界。8 个文件的 118 项已有本机回归通过。原版实际帧和三端接线待验。 [本机对照](../build/analysis/fixed-se-ccl-scene-publication-v1/stage306-probe.json) · [回归](../build/analysis/fixed-se-ccl-scene-publication-v1/local-regression.log) · [范围和用时](../build/analysis/fixed-se-ccl-scene-publication-v1/validation.json)

<a id="fixed-se-other-player-profile-validation"></a>

## 固定 SE 他人简介的来源与本机对照

复用 10 份 REA 函数档案和 5 份既有派生视图。REA 6.7.0、Ghidra 12.1.4 新增 `4B8070` 和 `5180F0` 档案，调用共 58.174 秒，含首次载入。Apple LLVM 21.0.0 与原 PE 核对 41 处直接调用、21 个控件和 13 个字段。REA 会话已导出并关闭。 [原字节和字段映射](../build/analysis/fixed-se-other-player-profile-v1/source-review.json) · [会话结束](../build/analysis/fixed-se-other-player-profile-v1/rea-session-closed.json)

stage306 本机通过四类请求组包、三个合成回包解码和三个现有外观换算用例。另用八个独立投影检查类别选择、文本、肖像和行终止。8 个文件的 132 项既有回归通过。现有客户端尚未发布这条资料至窗 64。原版现场和真实查询配对待核，三端操作待实现和验收。 [本机对照](../build/analysis/fixed-se-other-player-profile-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-other-player-profile-v1/local-regression.log) · [核验与计时](../build/analysis/fixed-se-other-player-profile-v1/validation.json)

<a id="fixed-se-player-directory-validation"></a>

## 固定 SE 目录读写与发布核验

复用 14 份 REA 函数档案和 5 份既有派生视图。REA 6.7.0、Ghidra 12.1.4 新增两个文件函数档案。Apple LLVM 21.0.0 与原 PE 核对 42 处直接调用和三处尾调用。REA 会话已导出并关闭。 [证据与文件摘要](../build/analysis/fixed-se-player-directory-v1/source-review.json)

stage306 完成五种标签的本机解码，世界入口均未发布对应资料。共核 14 个源规则投影用例和 4 个版本组合，非零掩码沿现有 `:_d` 编码比较明文字节。现有 ZIP 范围入口读回真实 81,620 字节目录，与留存成员 SHA-256 相符。9 个测试文件的 175 项已有回归通过。原版未执行，实际目录发布、窗口行为、保存和三端验收待开发验证。 [本机对照](../build/analysis/fixed-se-player-directory-v1/stage306-probe.json) · [回归](../build/analysis/fixed-se-player-directory-v1/local-regression.log) · [范围与耗时](../build/analysis/fixed-se-player-directory-v1/validation.json)

<a id="fixed-se-classic-player-profile-validation"></a>

## 固定 SE 经典简介的来源与本机对照

复用 7 份完整 REA 档案和 13 份派生视图。新增 3 份函数档案与 1 份已核直接引用。核对 2 个描述符、66 个控件、14 个不同登记回调、37 处直接调用和 1 处尾调用。REA 已导出并关闭。 [原件字节与回调](../build/analysis/fixed-se-classic-player-profile-v1/source-review.json) · [会话结束](../build/analysis/fixed-se-classic-player-profile-v1/rea-session-closed.json)

stage306 通过三个编码的 5 个合成字节用例。三条目录相关报文经现有世界入口均解码，返回的世界 effect 为空。9 个文件的 157 项既有本机回归通过。本批为原文件静态规格和本机对照，原版窗口、当前同版及实际三端产品验收待执行。 [运行回执](../build/analysis/fixed-se-classic-player-profile-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-classic-player-profile-v1/local-regression.log)

专项经过时间从首份本地计划到来源与文档核验，包含准备和等待。40 项中的本域就绪数仍为 19，整体开发工时还需实际实施批次校准。 [计时与汇总核验](../build/analysis/fixed-se-classic-player-profile-v1/validation.json)

<a id="fixed-se-classic-toolbar-status-validation"></a>

## 固定 SE 工具栏和人物窗的来源与本机对照

复用 2 份规范 REA 档案和 21 份原派生视图。REA 6.7.0、Ghidra 12.1.4 新增 2 份函数档案、2 份引用查询和 3 份原字节读取。两次格式器函数查询未取得档案，以原字节读取及 Apple LLVM 21.0.0 核对字段。核对 5 个描述符、163 个控件、22 个不同登记回调及 31 处直接调用锚点。工具栏 6 的人物入口另核一个控件。REA 会话已关闭。 [证据与地址](../build/analysis/fixed-se-classic-toolbar-status-v1/source-review.json) · [会话结束](../build/analysis/fixed-se-classic-toolbar-status-v1/rea-session-closed.json)

原文件确认 `-gR` 和 `->#` 各携一个整型，stage306 的现有目录会拒绝两条新查询的操作 ID。9 个现有编码通过 10 个明文字节对照。四条原创报文通过现有世界入口，`E(9` 保留五项属性及原版称号字段，`Hr]` 发布 48 行原表，`Or@` 和 `Q=[` 仅解码为字段。15 个文件的 149 项已有回归通过，含原创 TCP 对端。 [本机对照](../build/analysis/fixed-se-classic-toolbar-status-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-classic-toolbar-status-v1/local-regression.log)

原版未运行。未验人物窗实际分派、保存重开、目标平台和同版服务端结果。 [阶段核验](../build/analysis/fixed-se-classic-toolbar-status-v1/validation.json)

<a id="fixed-se-outgoing-admission-validation"></a>

## 固定 SE 出站格式器的静态与本机核验

REA 6.7.0、Ghidra 12.1.4 复用 18 份格式器记录，对照同一固定 SE 的 2,427 字节和文件映射 `.text` 的 69 处直接调用。新增 2 次类型 2 标记与消费入口的引用查询。核对经典窗 21 的 18 处控件登记和第二套窗 79 的选定注册。REA 会话确认已关闭。 [原件、档案和调用](../build/analysis/fixed-se-outgoing-admission-v1/source-review.json) · [会话回执](../build/analysis/fixed-se-outgoing-admission-v1/rea-session-closed.json)

Node 26.9.0 运行 stage306 现有组包入口，18 份已有独立字节用例和 18 个参数数量错误用例通过。另有 9 个原创明文用例，含 `;JE` 四种目标及 `#Mi` 的有符号坐标。18 条本机移动轨迹的 403 帧记录 `send-004f6470` 移动命令、`!DS` 地块动作及 `!hM` 地图请求。177 项现有本机回归通过，含原创 TCP 对端。 [共享入口对照](../build/analysis/fixed-se-outgoing-admission-v1/stage306-probe.json) · [回归日志](../build/analysis/fixed-se-outgoing-admission-v1/local-regression.log)

名单回归覆盖构帧，完整名单界面和发出请求的业务分派沿 SF-A09 验收。另一套 79 号窗实际激活及同版会话继续待证。当前核验按 stage306 分析基线和已列用例记录。 [核验汇总](../build/analysis/fixed-se-outgoing-admission-v1/validation.json)

<a id="fixed-se-classic-pre-control-callbacks-validation"></a>

## 固定 SE 经典构造与控件前回调核验

REA 6.7.0、Ghidra 12.1.4 读取 12 段共 852 字节，核对共用构造、控件前分派、工艺模式表及所选窗口写入。Apple LLVM 21.0.0 对照 41 个复用派生范围的 7,360 字节，独立核对 42 个描述符指针。REA 会话已关闭。 [原件、选定指令和模式表](../build/analysis/fixed-se-classic-pre-control-admission-v1/source-review.json) · [验证汇总](../build/analysis/fixed-se-classic-pre-control-admission-v1/validation.json)

本轮核验覆盖固定原件、登记和规格，所有产品文件与上一批一致。原版开窗和控件接收、三端逐帧效果及当前同版仍按对应验收用例。 [回调台账](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_pre_control_callbacks)

<a id="fixed-se-classic-destructor-callbacks-validation"></a>

## 固定 SE 经典关闭回调核验

复用既有共用析构规格和 12 个已有函数范围。REA 6.7.0、Ghidra 12.1.4 在同一会话补核 6 段共 395 字节，从打开至最后一次返回为 57.106 秒。Apple LLVM 21.0.0 对照 18 个登记与全部 1,160 字节，复核 55 条所选指令。 [REA 档案与范围对照](../build/analysis/fixed-se-classic-destructor-admission-v1/source-review.json)

当前验证覆盖固定样本、规则和规格链接。原版与三端的实际关窗、重开及服务结果随对应业务用例验收。统一分析门槛继续待通过。 [验证汇总](../build/analysis/fixed-se-classic-destructor-admission-v1/validation.json)

<a id="fixed-se-classic-work-controls-validation"></a>

## 固定 SE 经典工作控件核验

复用 21 个留存范围。REA 6.7.0、Ghidra 12.1.4 会话补 6 段共 1,578 字节，打开至最后返回 56.845 秒。Apple LLVM 21.0.0 核对 27 个原范围的 15,521 字节、43 个控件登记及 47 条所选指令。核对窗 14 的 `0x47B740` 析构归属，并接回背包规格。 [原件、登记与审核回执](../build/analysis/fixed-se-classic-work-controls-v1/validation.json)

本次验证覆盖源字节、操作与规格引用。原版控件实投递、三端运行和统一分析门槛仍沿项目用例验收。 [工作与战斗的交接规则](game-static.md#fixed-se-classic-work-controls)

<a id="fixed-se-classic-modal-blacklist-log-validation"></a>

## 固定 SE 的三个经典窗口操作核验

REA 6.7.0、Ghidra 12.1.4 记录 12 次引用查询、5 次函数归属检查及 9 段共 761 字节的读取。Apple LLVM 21.0.0 对照 11 个留存回调范围的 4,184 字节及 51 条所选指令，核对 28 个待定控件登记与两处共用关闭。 [来源核验和回执](../build/analysis/fixed-se-classic-window-operations-v1/validation.json)

原版输入、文件重开、服务回执和三端产品接受仍待执行。对没有函数边界的原指令，以文件范围和所选直接调用记录归属。 [三窗规格](game-static.md#fixed-se-classic-modal-blacklist-log)

<a id="fixed-se-classic-contact-list-controls-validation"></a>

## 固定 SE 经典名单控件核验

REA 6.7.0、Ghidra 12.1.4 一次会话读回 6 段 3,402 字节。Apple LLVM 21.0.0 对照窗 21 的 14 个回调范围共 6,044 字节、71 处登记、9 个表项及 55 条所选指令。本轮匹配 8 个原待定回调及 41 处登记。 [回执](../build/analysis/fixed-se-classic-contact-list-v1/validation.json) · [原字节归属](../build/analysis/fixed-se-classic-contact-list-v1/source-review.json)

实际输入、收包及三端结果沿 SF-A09、SF-A10 和对应邮件用例执行。当前验收范围为固定样本的静态登记、分派、源规则与引用。 [操作规格](game-static.md#fixed-se-classic-contact-list-controls)

<a id="fixed-se-classic-family-edit-controls-validation"></a>

## 固定 SE 家族详情与成员称号核验

REA 6.7.0、Ghidra 12.1.4 保存 10 段共 1,797 字节及 5 份引用结果。Apple LLVM 21.0.0 比对 13 个回调范围的 2,091 字节、34 处文件登记及 52 条所选指令。另按运行安装循环核对 35 个权限控件，跟进当前家族 ID 匹配后进入详窗退役的回包链。 [本批数据和回执](../build/analysis/fixed-se-classic-family-controls-v1/validation.json) · [来源](../build/analysis/fixed-se-classic-family-controls-v1/source-review.json)

本机验证覆盖固定样本、表项和操作规格。原版编辑输入、报文响应和三端运行随对应完整用例验收。 [操作与条件](game-static.md#fixed-se-classic-family-edit-controls)

<a id="fixed-se-classic-family-pet-feed-controls-validation"></a>

## 固定 SE 家族兽与饲料箱核验

REA 6.7.0、Ghidra 12.1.4 补核 8 段共 1,762 字节。Apple LLVM 21.0.0 对照 18 个回调范围的 6,582 字节、18 处登记及 59 条选定指令。REA 会话已关闭。 [静态核验](../build/analysis/fixed-se-family-pet-feed-controls-v1/source-review.json)

共享客户端的两条既有合成用例通过，覆盖所收权限、选中物品槽、打开时的回复上下文、饲料箱存取和关闭。原版控件实投递与目标端组合操作待验。 [客户端输出](../build/analysis/fixed-se-family-pet-feed-controls-v1/local-client-tests.log) · [核验回执](../build/analysis/fixed-se-family-pet-feed-controls-v1/validation.json)

<a id="fixed-se-classic-bank-trade-controls-validation"></a>

## 固定 SE 银行与交易控件核验

REA 6.7.0、Ghidra 12.1.4 补读 8 段共 2,266 字节，从打开到最后一次读回为 56.526 秒。Apple LLVM 21.0.0 对照 26 个回调范围的 10,562 字节、40 处文件登记及 55 条选定指令。REA 会话已关闭。 [静态核验](../build/analysis/fixed-se-classic-bank-trade-controls-v1/source-review.json)

共享客户端的四条既有合成用例通过，覆盖银行的物品和宠物槽转移、金币上下界、收到关闭时的回复、交易报价替换、确认及撤回。原版控件实投递、实际结算和三端组合待验。 [客户端输出](../build/analysis/fixed-se-classic-bank-trade-controls-v1/local-client-tests.log) · [核验回执](../build/analysis/fixed-se-classic-bank-trade-controls-v1/validation.json)

<a id="fixed-se-classic-mail-compose-controls-validation"></a>

## 固定 SE 写信、附件与群发控件核验

REA 6.7.0、Ghidra 12.1.4 在一次会话补核四段 159 字节，含附件窗的八项分支表及群发滚动的两处写入阶段，从打开到末次返回为 57.598 秒。Apple LLVM 21.0.0 对照 14 个控件范围的 6,015 字节、30 处登记及 76 条选定指令。REA 会话已关闭。 [来源及指令](../build/analysis/fixed-se-classic-mail-compose-controls-v1/source-review.json)

三个既有编解码测试通过。另以原创正文核出现有家族附件编码及来信字段解码，确认另四个原发送入口仍需补登记。原版实际输入、邮件投递、附件结算和三端组合沿原用例验收。 [测试输出](../build/analysis/fixed-se-classic-mail-compose-controls-v1/local-codec-tests.log) · [现有接口对照](../build/analysis/fixed-se-classic-mail-compose-controls-v1/local-codec-comparison.json) · [核验回执](../build/analysis/fixed-se-classic-mail-compose-controls-v1/validation.json)

<a id="fixed-se-classic-post-control-frames-validation"></a>

## 固定 SE 经典控件后回调核验

REA 6.7.0、Ghidra 12.1.4 补读 10 段共 1,430 字节，复用 20 个已有派生回调范围。Apple LLVM 21.0.0 逐指令核对这 20 个范围的 3,356 字节，并核对 24 处描述符指针、两个共用底图入口、滚动控件和所选写入。REA 会话已关闭。 [原件范围和指令](../build/analysis/fixed-se-classic-frame-admission-v1/source-review.json) · [验证汇总](../build/analysis/fixed-se-classic-frame-admission-v1/validation.json)

现有共享客户端、输入运行时、战斗物品和网页战斗画布的四组测试共 84 项通过。经典原版逐帧输入和三端实际呈现待验。 [本机测试](../build/analysis/fixed-se-classic-frame-admission-v1/local-regression.log)

<a id="fixed-se-send-operation-admission-validation"></a>

## 固定 SE 发送归属与编码核验

复用 REA 6.7.0、Ghidra 12.1.4 留存格式器档案，重新生成并核对 60 条原发送目录。本次所选的 17 个根均有原格式和实际业务依据。Apple LLVM 21.0.0 与原 PE 的位移扫描共同核对 149 处直接调用。补 8 条 REA 记录，其中五段读回 316 字节。第二套昵称调用及另一处称号调用以文件字节和指令位置复核，实际分派沿对应验收。会话已关闭。 [原件与指令](../build/analysis/fixed-se-send-operation-admission-v1/source-review.json) · [汇总](../build/analysis/fixed-se-send-operation-admission-v1/validation.json)

现有 `encodeLegacyGameCommand` 的 17 份原创明文向量逐字节通过，17 次额外参数均按现有接口拒绝。原版界面提交、宿主操作与服务结果继续沿各业务用例。 [34 项本机编码结果](../build/analysis/fixed-se-send-operation-admission-v1/local-encode.json)

<a id="game-resource-reopen-composition-validation"></a>

## 资源重开组合规格与准备期取消

Chrome 157.0.8103.51 运行 stage306 的实际游戏页。延迟原创 ZIP 的第一段 `File.slice().arrayBuffer()` 结果，点击断开后以另一份 ZIP 开始准备。第一段返回后，旧初始化额外发起一次 764 字节的中央目录读取。旧两段缓冲区均清零，新准备状态保持。主动释放新 ZIP 的无效数据后才显示材料错误，所测两次尝试均未建立连接。 [用例和回执](../build/analysis/game-resource-reopen-composition-v1/chrome-retired-archive.json)

复用固定 F5A 的四份 REA 函数档案和原更新回执。9 个既有测试文件共 87 项本机回归通过。组合规格核对五组用例及对应端口。微信临时分段已有后续独立工具进程回执，实际发布、真机及同版联合行为继续待验。 [组合合同](../analysis/capability-first-v1/shared-update-host-design.json#/game_resource_reopen) · [原版档案索引](../build/analysis/launcher-f5a-update-handoff-v1/source-review.json) · [回归日志](../build/analysis/game-resource-reopen-composition-v1/local-regression.log) · [范围核验](../build/analysis/game-resource-reopen-composition-v1/validation.json)

<a id="resource-reopen-reader-identity-validation"></a>

### 资源读者版本、补段与发布边界

REA 6.7.0 复用一个 DevTools JS 成员，新增分析原包内的 1,349 字节描述符成员，校验两成员版本、偏移、摘要及 10 个所选方法。整包分析报告另一解包附件完整性失配，本轮从 ASAR 目录独立核对两个相关内置成员。归档素材重开、普通写入拒绝和存储回执来自留存的六份实际宿主试次。 [来源与范围](../build/analysis/resource-reopen-reader-identity-v1/source-review.json)

两份有效且等长的原创 ZIP 驱动现有可在 Node 调用的入口和真实临时文件。核同路径替换、独立读者、原位写、回调晚到、缺段、同长错段及修复后的跨段读取。归档、资源库和浏览器／微信存储原有回归共 73 项通过。本轮设备及正式发布用例待执行。 [本机结果](../build/analysis/resource-reopen-reader-identity-v1/local-comparison.json) · [回归](../build/analysis/resource-reopen-reader-identity-v1/local-regressions.log) · [核验记录](../build/analysis/resource-reopen-reader-identity-v1/validation.json)

<a id="target-game-page-lifecycle-validation"></a>

## 游戏页隐藏、断开与重进的本机验收

Chrome 157.0.8103.51 使用实际 `web/game.html`。等待旧 JSON 读取时取消，重选材料后进入场景。旧读返回并清零，当时的新游戏继续运行。手动断开与页面重载各结束一个独立连接，持有的 ZIP 均报告关闭。重载记录可信 `pagehide`，新页面无所选文件。该次页签试验保持可见，后续已另在普通浏览器配置中取得可信的隐藏事件。 [桌面回执](../build/analysis/target-game-lifecycle-v1/chrome-runtime.json) · [标签页补验](#desktop-game-tab-visibility-validation)

iOS 27.0（24A434）的 Mobile Safari 27.0 使用原产品模块。在哈希匹配的游戏 HTML 临时副本加一条同源探针标签，脚本为游戏页提供原创 `File` 和按钮输入，前后台由模拟器真实切换。短时后台期间绘制次数未增加，原连接发来一条 22 字节的测试帧，在前台事件时已计入会话。手动继续恢复绘制。下一次后台收到实际对端 EOF，前台只可重新准备，重选后第三次入场。随后真实离页，观察到旧视图与 ZIP 关闭、新文档从空准备启动，独立对端均结束。离页期间旧客户端记录 `LEGACY_ASSET_READ_FAILED`，D0/D5 补验已取消读取与活动读取失败的分类。 [Safari 回执](../build/analysis/target-game-lifecycle-v1/mobile-safari-runtime.json) · [状态差异的首次回执](../build/analysis/target-game-lifecycle-v1/mobile-safari-navigation-state-incomplete.json) · [模拟器清理](../build/analysis/target-game-lifecycle-v1/simulator-cleanup.json)

微信源码适配器及已有 stage306 生成包分别通过两条 Page 用例，均使用 Node 提供的 `wx` 形状端口和实际原创 TCP 对端。模拟 App 隐藏后，迟到的 27,485 字节 ZIP 缓冲区被清零。实际使用 Page 处理函数隐藏旧连接、重选并入场后，重放的旧 `Message` 与 `Close` 未影响新会话。卸载核对已退役所有者及新 Page，旧 Page 的快照不再更新。91 项现有本机回归通过。 [源码回执](../build/analysis/target-game-lifecycle-v1/wechat-source-runtime.json) · [生成包回执](../build/analysis/target-game-lifecycle-v1/wechat-generated-runtime.json) · [回归](../build/analysis/target-game-lifecycle-v1/local-regression.log)

复用固定 SE、Item 和 F5A 的 REA 取证，确认原版所选缓存分派和退役回调各自的顺序。完整真机、微信 SDK 成功建连、持久化资源根和同版会话继续沿原用例。 [来源核验](../build/analysis/target-game-lifecycle-v1/source-review.json) · [汇总核验](../build/analysis/target-game-lifecycle-v1/validation.json)

<a id="desktop-game-tab-visibility-validation"></a>

## 桌面 Chrome 标签页的本机验收

用 Playwright 1.64.1 驱动独立普通 Chrome 157.0.8103.51。同一个窗口中的两个普通标签页先通过可信事件预检，正式试次加载 stage306 实际游戏页。215 个产品响应体的 SHA-256 与工作区文件匹配。首次试跑的回复与入场朝向相同，正式试次用 `6 → 2` 的原创回复观察状态更新。 [普通标签页预检](../build/analysis/desktop-game-tab-visibility-v1/preflight/ordinary-tabs.json) · [正式运行](../build/analysis/desktop-game-tab-visibility-v1/runtime.json)

首次隐藏期间包数从 14 到 15，绘制保持 5 帧。前台点击「继续」后同一连接达到第 7 帧。第二次隐藏期间收到 EOF，旧文件关闭、会话记录 `peer-eof`，页面留在准备入口。重选材料后第二个对端完成 14 包入场，随后正常关闭。两条桥接流最终均退役，页面错误与响应体核对错误均为零。 [运行核验](../build/analysis/desktop-game-tab-visibility-v1/validation.json) · [回到前台的画面](../build/analysis/desktop-game-tab-visibility-v1/after-foreground.png)

现有 102 项相关回归通过。所验范围为短时普通标签页、本机原创素材和对端。长时后台、系统切换、真机、真实微信连接及同版会话仍沿原用例。 [回归日志](../build/analysis/desktop-game-tab-visibility-v1/local-regression.log) · [共用规格](network-portability.md#desktop-game-tab-visibility)

<a id="fixed-se-mail-entry-admission-validation"></a>

## 固定 SE 邮件入口的字节和归属核验

同一固定 SE 映像及留存 REA 6.7.0、Ghidra 12.1.4 证据对齐 30 个此前只有导航归属的入口，核对 41 处注册或协议映射、31 个范围共 20,661 字节及 375 处原相对调用。另核经典 22/23 正文和 49 滚动控件三处使用及对应 114 条指令。该批复用既有档案。实际另一套窗口的分派及 MM-R1 继续取证。 [地址、原规则和后续条件](../build/analysis/target-game-lifecycle-v1/mail-entry-source-review.json) · [原操作合同](../analysis/capability-first-v1/game-mail-data-contract.json#/fixed_se_entry_admission)

<a id="legacy-item-classic-rebuild-modes-validation"></a>

## Item 经典窗口恢复的来源与本机对照

REA MCP 连接已关闭，经本机 REA 6.7.0 与 Ghidra 12.1.4 完成 4 份新函数档案及 3 处调用归属，复用两版 19 份函数档案。Apple LLVM 21.0.0 核对 15,414 字节、3,557 条指令、69 处调用、45 处指令锚点和五处分派。 [来源回执](../build/analysis/legacy-item-classic-rebuild-modes-v1/source-review.json)

15 个静态用例覆盖状态准入、等待边界、22/23 合并、字段恢复和后续活动指针。Node 26.9.0 的现有共享入口完成等待、重建和激活对照。90 项已有本地回归通过，含原创 TCP 对端的退出和恢复流程。原程序的窗口、保存与重入效果、另一套窗口分派及当前同版未验。 [静态用例](../build/analysis/legacy-item-classic-rebuild-modes-v1/source-derived-cases.json) · [共享入口](../build/analysis/legacy-item-classic-rebuild-modes-v1/local-comparison.json) · [回归](../build/analysis/legacy-item-classic-rebuild-modes-v1/local-regression.log) · [回场回归](../build/analysis/legacy-item-classic-rebuild-modes-v1/local-return-regression.log) · [发布核验](../build/analysis/legacy-item-classic-rebuild-modes-v1/validation.json)

<a id="f5a-path-preflight-validation"></a>

## 11 月版路径前检的来源与本机对照

REA MCP 返回连接已关闭。以本机 REA 6.7.0、Ghidra 12.1.4 和本次命令的 Java 路径恢复分析。新增 8 份函数档案并复用 10 份。Apple LLVM 21.0.0 对照 17,110 个原文件字节、5,367 条指令、59 处直接调用、108 处指令锚点和 13 项导入。 [工具与原样本核验](../build/analysis/launcher-f5a-path-preflight-v1/source-review.json)

15 个静态用例核对序号、三种普通标志组合、路径拒绝、文件缺失及发布次序，包含函数体内两个标志同时为真时的后续拒绝。Node 26.9.0 的现有共享入口解析五条目录记录，核对四条魔力路径、7 个原创库存情境和 3 份进程规划。93 项现有本地回归通过。原版 Windows 的实际属性及最终路径、三端产品接线、回退制品和同版游戏消费待验。 [静态用例](../build/analysis/launcher-f5a-path-preflight-v1/preflight-branch-cases.json) · [本机对照](../build/analysis/launcher-f5a-path-preflight-v1/local-plan-comparison.json) · [回归日志](../build/analysis/launcher-f5a-path-preflight-v1/local-regression.log) · [阶段核验](../build/analysis/launcher-f5a-path-preflight-v1/validation.json)

<a id="fixed-se-receive-operation-admission-validation"></a>

## 固定 SE 收包归属与解码核验

复用 REA 6.7.0、Ghidra 12.1.4 的 `4F8A40` 档案和已登记消费范围。重新生成并核对全部 104 条收包目录。37 个所选根各核对一个直接分派、标记字与消费范围。一次 REA 会话补 10 条证据，含 565 字节读取、两个引用组和两个函数范围查询。Apple LLVM 21.0.0 独立核对地址提示、状态初始化及失败提示的相关指令。会话已关闭。 [原始分派和补证](../build/analysis/fixed-se-receive-admission-v1/source-review.json) · [核验回执](../build/analysis/fixed-se-receive-admission-v1/validation.json)

通过 stage306 的 `decodeLegacyGameMessage` 对 37 条各输入完整字段及缺省字段，共 74 例通过。夹具包含整型环回和文字转义。35 条的业务归属已经核对，`Kh>` 的消费者与 `Ok?` 对应的触发仍待。三端界面、世界接线、原版运行及同版服务效果继续沿各业务用例验收。 [解码结果](../build/analysis/fixed-se-receive-admission-v1/local-decode.json)

<a id="legacy-unassigned-receive-validation"></a>

### 通用失败提示与低字状态的两版对照

复用固定 SE 的完整分派及原字节档案。REA 6.7.0、Ghidra 12.1.4 一次 Item 会话取得五条证据，涵盖三份函数档案、清零范围与地址引用。Apple LLVM 21.0.0 在两份原件核对 45 个锚点。两版标签字节和通用失败文字相同。REA 会话已关闭。 [原件和函数来源](../build/analysis/legacy-unassigned-receive-v1/source-review.json)

用实际 stage306 共享收包入口跑 10 组原创输入。五组 `Ok?` 含零、负数及低 16 位为零但完整值非零的情况。五组 `Kh>` 覆盖低字环回。共享入口保留完整解码字段，当前没有这两项的业务效果。沿用同一产品基线的 43 项消息与会话回归。原版实际触发、配对和状态读者仍待证。 [本机回执](../build/analysis/legacy-unassigned-receive-v1/local-projection.json)

<a id="legacy-address-notice-retention-validation"></a>

### 两版地址变化提示的静态与本机核验

REA 6.7.0 与 Ghidra 12.1.4 复用八份完整函数档案及原 SE 提示范围。补四条证据，包含 Item 消费函数、两组数据引用和 SE 数据类型。Apple LLVM 21.0.0 核对两份原件的 45 个指令锚点，两个模板含终止字节均匹配。两个 REA 会话已关闭。 [来源核验](../build/analysis/fixed-se-address-notice-retention-v1/source-review.json)

在 stage306 实际共享收包入口测试七个原创短串组合。七组解码均正确，现有文字记录均为空。同进程和全新进程的提示数是静态规则的本机对照，43 项共享消息与会话回归通过。原版实际重连、业务文本长度和三端产品仍待验。 [短串对照](../build/analysis/fixed-se-address-notice-retention-v1/local-projection.json) · [回归日志](../build/analysis/fixed-se-address-notice-retention-v1/local-regression.log)

<a id="legacy-receive-retirement-order-validation"></a>

## 两版收包、断线和角色槽的来源核验

REA MCP 返回连接已关闭，改用已安装的 REA 6.7.0 命令行与 Ghidra 12.1.4。Item 的断线状态字节新增 1 份数据引用记录，12 处引用逐项匹配原 PE。复用 29 份完整 REA 函数档案。Apple LLVM 21.0.0 核对 32,566 字节、10,159 个指令位置，另核 57 个直接调用、79 处指令或短字节窗口及两版导入序号。 [来源、工具和样本摘要](../build/analysis/legacy-receive-retirement-order-v1/source-review.json)

Node 26.9.0 的现有本地回归 7 项通过。额外的原创字节夹具在同一输入块放入重置和 48 字节详情，确认当前共享解码处理详情后仍等待替换材料。原版和目标宿主的当轮分派、换角后迟到回包及当前同版待验。 [现有测试](../build/analysis/legacy-receive-retirement-order-v1/local-regression.log) · [共享入口对照](../build/analysis/legacy-receive-retirement-order-v1/local-projection.json) · [发布核验](../build/analysis/legacy-receive-retirement-order-v1/validation.json)

<a id="f5a-update-handoff-validation"></a>

## 11 月版更新接管与启动确认核验

REA MCP 连接在导出前关闭。使用已安装的 REA 6.7.0 和 Ghidra 12.1.4 留存四份新函数档案，复用七份档案。Apple LLVM 21.0.0 将 5,017 条指令绑定到 18,130 个原文件字节，另查所选调用窗口、消息表及 PE 资源。更新器来自固定登录器的资源 143，身份已独立核对。 [来源、摘要与回执](../build/analysis/launcher-f5a-update-handoff-v1/source-review.json)

现有共享解析器读回留存更新 ZIP 的单个 EXE，条目摘要、CRC、MD5 和一个语言叶的 v1 声明均通过。Node 26.9.0 的 95 项现有更新相关测试全通过。此次验证覆盖固定字节和本机共享接口。原版 Windows 进程、文件替换和三端产品启动仍待验。 [包解析回执](../build/analysis/launcher-f5a-update-handoff-v1/local-package-probe.json) · [回归日志](../build/analysis/launcher-f5a-update-handoff-v1/local-update-regression.log) · [阶段验收](../build/analysis/launcher-f5a-update-handoff-v1/validation.json)

<a id="portable-update-handoff-validation"></a>

## 资源更新共用用例的本地核验

本批复用 REA 6.7.0 与 Ghidra 12.1.4 的四份函数档案，重新核对 F5A 及其资源 143 更新器的原字节、调用和所选指令。Chrome 157 和 iOS 27.0 的 Safari 模拟器分别以两个不同浏览器进程使用同一原创夹具。第二个同源页面发布 C 后，两端均读回 B 的历史提交、迟到确认已取代、租约释放后回收 B、回滚旧修订冲突，以及重开读回 C 的两块数据。C 的构建与启动编号来自夹具。Safari 首轮重开时的报告未满足接收顺序约束，限定旧用例入口的有效阶段后重跑通过。 [原版核对](../build/analysis/launcher-f5a-update-handoff-v1/source-review.json) · [Chrome 回执](../build/analysis/portable-update-handoff-v1/chrome-runtime.json) · [Safari 回执](../build/analysis/portable-update-handoff-v1/mobile-safari-runtime.json) · [Safari 首轮记录](../build/analysis/portable-update-handoff-v1/mobile-safari-failed-runtime.json)

微信现有适配器经 Node 文件夹具执行三次真实文件写入，两个槽的修订由 1、2 变为 3、2。读出的第二版仍可消费，新实例读到第三版，旧修订重试被拒。现有接口未提供按更新编号查询历史提交，本次沿用留存的微信 SDK 回执核对实际双槽和容量边界。现有 50 项资源缓存与更新回归通过。完整产品端口、实际构建启动、微信 SDK 和真机的组合验收仍待执行。 [本机双槽对照](../build/analysis/portable-update-handoff-v1/wechat-cache-comparison.json) · [测试日志](../build/analysis/portable-update-handoff-v1/local-regression.log) · [汇总核验](../build/analysis/portable-update-handoff-v1/validation.json)

<a id="wechat-sdk-segmented-archive-validation"></a>

## 微信完整分段资源读回与渲染核验

实际 SDK 先后返回两段可读路径。全量摘要阶段读完 2,549,171,845 字节，核对两段和整包摘要，并复核一处跨段读取。现有共享解析器索引 ZIP64 的 1,072 项，资源库六张参考画面与 CUT 59529 的 121 项匹配。合计 392 次逻辑读取和 393 次 SDK 定位读取，其中 66 次逻辑起点达到 2 GiB。 [选择回执](../build/analysis/wechat-sdk-segmented-archive-v1/selection-2-sdk-receipt.json) · [第二段回执](../build/analysis/wechat-sdk-segmented-archive-v1/selection-3-sdk-receipt.json) · [终态回执](../build/analysis/wechat-sdk-segmented-archive-v1/terminal-sdk-receipt.json)

8 字节对照的另存及移除通过，两段的另存均遭配额拒绝。关闭探针资源后，核对两份 SDK 临时副本并移除，原 ZIP 摘要和原游客工程 11 个文件均已复核。正式产品接线、持久化重开及物理设备仍待验。 [清理证据](../build/analysis/wechat-sdk-segmented-archive-v1/cleanup.json) · [核验汇总](../build/analysis/wechat-sdk-segmented-archive-v1/runtime.json)

<a id="wechat-sdk-archive-ordinary-quota-validation"></a>

## 微信实际素材的普通分块拒写与新 App 对照

开发者工具 2.02.2609250、基础库 3.18.0 先后选中原包两段，素材 SHA-256 为 `6ff08fd6251c748afaaa36a894b027a4992bdcc1e1a615d3f739809c5d6d2c8e`。实际 `writeFile` 和后续 `readFile` 核对前 12 块共 100,663,296 字节，第 13 块返回存储配额错误。宿主逐块比对原 ZIP，候选发布清单未出现。 [实际写入回执](../build/analysis/wechat-sdk-archive-reopen-v1/save-sdk-receipt.json) · [前缀独立核验](../build/analysis/wechat-sdk-archive-reopen-v1/verified-prefix.json)

新 App 的实例标识不同，选择路径计数为零。现存部分块使一次普通 8 MiB 写入被拒。通过 SDK 回收该候选后，原创对照写入 12 块，第 13 块再次被拒，测试块均清理。前置改名的小清单对照通过。实际整包持久化和重开未发生，本次没有旧活动根，完整 UH-T01、UH-T03 和真机案例待验。 [新 App 回执](../build/analysis/wechat-sdk-archive-reopen-v1/quota-control-sdk-receipt.json) · [测试清理](../build/analysis/wechat-sdk-archive-reopen-v1/cleanup.json)

已恢复原游客工程 11 个文件并普通编译确认原页面。Node 26.9.0 的现有资源与缓存回归 61 项通过。REA MCP 返回 `Transport closed` 后使用已安装的 6.7.0 CLI。整包静态图标出未解包成员的完整性差异，相关模块以各自原字节摘要和两模块 REA 档案核对。 [取证范围](../build/analysis/wechat-sdk-archive-reopen-v1/source-review.json) · [回归日志](../build/analysis/wechat-sdk-archive-reopen-v1/local-regression.log) · [阶段核验](../build/analysis/wechat-sdk-archive-reopen-v1/validation.json)

<a id="wechat-sdk-selection-lifetime-validation"></a>

## 微信文件选择与重开核验

实际 SDK 选择 167 字节的原创 ZIP。初次读回、同一 App 内新页面、同一开发者工具进程内的新 App 实例均核对临时和用户目录两种来源的整包及条目。移开已确认的临时副本后，第二次编译的新 App 在 `stat` 阶段取得缺失回执，用户目录对照仍匹配。共享解析器共执行 35 次 SDK 定位读。 [实例、回执与摘要](../build/analysis/wechat-sdk-selection-lifetime-v1/runtime.json)

首轮探针补齐归档范围端口的关闭方法后重新选择。已移除本次生成的输入、副本、清单及回执目录，恢复并核对游客工程 11 个原文件，界面回到原 SDK 核验页。后续完整临时分段跨进程结果沿独立试次，真机重开继续验收。 [清理与恢复](../build/analysis/wechat-sdk-selection-lifetime-v1/cleanup.json) · [完整归档跨进程](#wechat-sdk-segment-process-reopen-validation)

<a id="wechat-sdk-segment-resume-validation"></a>

## 微信完整素材的 App 重开及单段补选核验

微信开发者工具 2.02.2609250、基础库 3.18.0、本机游客工程。全量核对素材 2,549,171,845 字节，SHA-256 为 `6ff08fd6251c748afaaa36a894b027a4992bdcc1e1a615d3f739809c5d6d2c8e`。完成修正后的首次核验、普通编译新 App 无需选择的重开、受控移开第 2 段后只补选该段的重开。三个通过回执的 App 标识各异，DevTools 仍为同一进程。每次核对两段摘要、整包摘要、跨段 64 字节、1,072 条目及六张参考画面。已存记录只承载选择清单。 [SDK 回执与逐项核验](../build/analysis/wechat-sdk-segment-resume-v1/runtime.json)

首次选择确认超时后重新观察面板，从已定位目录完成选取。首轮全量操作的探针终态局部变量有误，修正后用此前已写入的清单取得三组可核验结果。复用 REA 6.7.0 的 DevTools 文件模块档案，核对安装包成员和四个函数的源码范围。48 项现有资源及微信缓存本机回归通过。原素材及游客工程 11 个文件重新核对，移除本批时段内与摘要匹配的临时副本和输入。 [静态核验](../build/analysis/wechat-sdk-segment-resume-v1/source-review.json) · [本机回归](../build/analysis/wechat-sdk-segment-resume-v1/local-regression.log) · [清理核验](../build/analysis/wechat-sdk-segment-resume-v1/cleanup.json)

<a id="wechat-sdk-segment-process-reopen-validation"></a>

### 微信完整分段两次正常进程重开的核验

本机游客工程在 DevTools 2.02.2609250、基础库 3.18.0 中使用原共享 ZIP 解析和资源库。工具 PID 依次为 15385、41871、42098，对应三个 App 启动标识。两次正常退出后均确认工具主进程为空，后两次启动均回到同一工程。第一轮跨进程重开沿原清单和原文件，第二轮进程间受控移开第 2 段。 [进程边界与工作区](../build/analysis/wechat-sdk-segment-process-reopen-v1/runtime.json)

首次选择、跨进程重开和补选后三次均核对 2,549,171,845 字节、两段与整包 SHA-256、64 字节跨段读、1,072 个条目及六张参考画面，分别耗时 85.741、85.762、85.758 秒。三次选段记录依次为两段、零段和第 2 段。首次确认目录后选择等待超时，经重新选择继续，最终按 SDK 回执核对。试验结束恢复 11 个原探针文件，保留原素材及脱去临时路径的回执，移除本轮自有副本。完整持久化、产品发布、异常退出及真机沿 UH-U02 验收。 [运行与清理回执](../build/analysis/wechat-sdk-segment-process-reopen-v1/validation.json)

<a id="wechat-sdk-archive-selection-validation"></a>

## 微信实际 ZIP 选择与复制上限核验

游客探针编入现有微信 ZIP 适配器与共享解析器。真实选择 136 字节的原创 ZIP 后，`stat` 确认是文件并匹配大小，五次范围读取后唯一条目 8 字节与原始向量一致，解析器随后关闭。2,549,171,845 字节的材料副本经 SHA-256 核对，三次实际选择均返回正确大小，随后出现 `FILE_SIZE`。完整回执记录 SDK 的临时复制上限错误、无路径、零次 `stat` 与零次读取。 [小包回执](../build/analysis/wechat-sdk-archive-selection-v1/control-sdk-receipt.json) · [大包回执](../build/analysis/wechat-sdk-archive-selection-v1/large-limit-sdk-receipt.json)

原游客工程的 11 个文件逐一核验，测试副本和自建回执目录已移除，原归档哈希复核一致。136 字节的小包临时副本由 SDK 管理，其删除请求被拒。核验范围覆盖选择器、归档适配器和解析器，完整产品、真机及替代输入途径继续验收。 [证据汇总](../build/analysis/wechat-sdk-archive-selection-v1/runtime.json) · [清理记录](../build/analysis/wechat-sdk-archive-selection-v1/cleanup.json)

<a id="wechat-sdk-archive-files-validation"></a>

## 微信模拟器的大文件与分块容量核验

本机开发者工具的游客 App 真实执行四组定位写入。四个 `read` 缓冲均保留身份和未写区域，四个 `readFile` 均回传正确标记。所选 27,867,440 字节的范围读实际完成。按两个原资源根的规模写入原创夹具，304 块首根和 220 块第二根的全部字节由宿主独立校验。SDK 拒绝下一块。 [准备回执](../build/analysis/wechat-sdk-archive-files-v1/prepare-sdk-receipt.json) · [宿主文件核验](../build/analysis/wechat-sdk-archive-files-v1/host-file-verification.json)

新 `App.onLaunch` 回执与首次不同，八组范围与准备时一致。完成后移除本次块和回执，恢复并逐一核验原项目 11 个文件。旧写入前曾删除超大定位文件，容量解释以普通写入对照为准。完整双根写入、真实设备容量及正式产品换版待验。 [普通配额对照](#wechat-sdk-archive-ordinary-quota-validation) · [新 App 回执](../build/analysis/wechat-sdk-archive-files-v1/reopen-sdk-receipt.json) · [本次复核](../build/analysis/wechat-sdk-archive-files-v1/validation.json)

<a id="mobile-safari-persisted-resource-archive-validation"></a>

## 移动 Safari 的实际资源持久化核验

复用桌面的两个归档身份、分块摘要、事务夹具与资源库探针。iOS 27.0（24A434）模拟器成功试次在两个 Safari 进程中核对 B 的 304 块、三个资源库的六组参考画面及 CUT 59529 的 121 项。旧根回收后另核一张，共 19 张画面摘要匹配。每个库的 87 次读取包含 5 次跨块和 18 次 2 GiB 以上起点。 [完整回执](../build/analysis/mobile-safari-persisted-resource-archive-v1/runtime.json)

复合末块先在旧根回收后比较，再在 Safari 重开后比较。完整摘要及尾部摘要均与独立构造的未裁减变体相符。连续字节写入的末块两次均为 7,423,648 字节，摘要匹配。首个测试夹具回执字段覆盖导致的失败已修正，另一次初始导航停在起始页后，对同一运行进程重发本机链接继续。三个临时模拟器均已清理，源 ZIP 完整哈希一致。 [夹具失败](../build/analysis/mobile-safari-persisted-resource-archive-v1/runtime-receipt-field-failure.json) · [重开失败](../build/analysis/mobile-safari-persisted-resource-archive-v1/runtime-tail-reopen-failure.json) · [证据复核](../build/analysis/mobile-safari-persisted-resource-archive-v1/validation.json)

<a id="desktop-persisted-resource-archive-validation"></a>

## 桌面持久化实际 ZIP 核验

Chrome 157.0.8103.51、Playwright 1.64.1 与 Node 26.9.0。复用原 IndexedDB 事务夹具和资源库探针，分别从 A、新发布 B 和正常重开的 B 完成资源初始化。六组各一张参考帧，外加 A 回收后从 B 复核的一张，共 19 张帧摘要匹配。三次均读取 CUT 59529 的 121 条记录。重开后 304 个 B 块逐一校验，旧根清单已回收，原发布回执仍可读。 [运行记录](../build/analysis/browser-persisted-resource-archive-v1/runtime.json)

夹具首次导入时漏掉共享模块依赖的 `.js` 文件类型，按既有探针的本地模块匹配修正后通过。正式更新端口、突停与全场景设备容量仍待验。两次成功阶段的 Chrome 均已关闭，独立配置已清理，源 ZIP 完整哈希复核一致。 [初次记录](../build/analysis/browser-persisted-resource-archive-v1/runtime-import-failure.json) · [阶段核对](../build/analysis/browser-persisted-resource-archive-v1/validation.json)

<a id="browser-resource-version-isolation-validation"></a>

## 桌面资源内容换版与读任务排空核验

Chrome 157.0.8103.51 中，两个 304 块根各通过写入前的分块摘要检查。新根发布后，两份调色板摘要和旧页、新页的雨滴帧摘要分别匹配参考。受控暂停的旧图块在逻辑关闭后读完 1,660 字节，原字节摘要匹配，绘制返回取消。暂停期间回收返回 `busy`，排空并释放租约后回收成功。新根正常重开后，304 块、调色板及画面再次通过核验。 [运行回执](../build/analysis/browser-resource-version-isolation-v1/runtime.json)

中间试次的探针把图块偏移覆盖成中央目录校验字段的偏移，导致等待超时。已改用独立解析出的 RD 位置和原字节摘要复核。最终两次 Chrome 均已关闭，独立配置已清理，源 ZIP 哈希一致。正式三端更新入口、突停和真机仍待验收。 [偏移失败记录](../build/analysis/browser-resource-version-isolation-v1/runtime-offset-mismatch.json) · [发布核验](../build/analysis/browser-resource-version-isolation-v1/validation.json)

<a id="launcher-edit-focus-validation"></a>

## 两版登录器输入通知的来源核验

REA 6.7.0 与 Ghidra 12.1.4 的两份归档保留 10 个函数和 9 个字节读取。Apple LLVM 21.0.0 对照 14 段、4,802 个文件字节与 1,501 条反汇编行。四处 `LOCK XADD` 的前缀分行已逐处核对。三个 F5A 短入口用表项和原字节复核。两版会话均已关闭。 [样本和证据 ID](../build/analysis/launcher-edit-focus-v1/source-review.json)

已核固定来源的编辑处理、焦点请求与排队失效。上一轮的 Windows 原创夹具覆盖模态派发和窗口准入，本轮覆盖静态编辑规则。实际通知顺序及三个产品用例待执行。 [已有夹具](#windows-launcher-modal-dispatch-validation) · [本轮记录](../build/analysis/launcher-edit-focus-v1/validation.json)

<a id="legacy-render-device-preferences-validation"></a>

## SE 与 Item 图形档位的来源核验

REA 6.7.0 与 Ghidra 12.1.4 复用 4 个函数体，新增 4 个。Apple LLVM 21.0.0 对照两个原文件的 17,923 字节和 4,435 条指令。13 个直接调用、74 个指令锚点、文件导入和零填充范围已核。 [函数、哈希和文件偏移](../build/analysis/legacy-render-device-preferences-v1/source-review.json)

文件失败分支和重建顺序的证据来自静态核验，实际文件写入和设备返回留在 PR-A10 宿主验收。 [本轮记录](../build/analysis/legacy-render-device-preferences-v1/validation.json)

<a id="legacy-render-startup-tier-input-validation"></a>

### 两版新进程档位核验

复用 11 份 REA 函数档案，补查 3 份。REA 6.7.0 与 Ghidra 12.1.4 的两次会话均已关闭。Apple LLVM 21.0.0 核对两个原文件的 21,918 字节、6,142 条指令和 `GetCommandLineA` 导入槽。两版补充了首个键失败、十进制低字节、零与非零覆盖的预期。 [来源核验与文件偏移](../build/analysis/legacy-render-next-startup-v1/source-review.json)

用 15 个原创组合对照固定 SE 的现有共享启动入口。14 个成功组合按预期合并文本，均仍返回独立的 `graphicsMode` 2。一个模拟端口拒绝访问的组合返回 `EACCES`。18 项现有配置及启动回归通过。原版、真实设备和三端的 PR-A10 组合仍待执行，当前同版读回未验证。 [本机对照](../build/analysis/legacy-render-next-startup-v1/focused-probe.json) · [现有回归](../build/analysis/legacy-render-next-startup-v1/local-config.log) · [交付核验](../build/analysis/legacy-render-next-startup-v1/validation.json)

冷启动合成复用 REA 6.7.0、Ghidra 12.1.4 的配置器、游戏文件写入和游戏冷启动档案，新增查询为零。实际重核两版游戏与留存配置器的 SHA-256、配置器的 26 个静态指令锚点，以及历史安装脚本第 1278–1279 行的长度和 CRC32。公开站两次返回 FTP 421，历史成员原字节仍缺。留存的实际发行配置单独以 23 字节和 SHA-256 绑定。 [样本、档案和校验](../build/analysis/legacy-render-config-reload-v1/config-reload.json) · [两次范围读回执](../build/analysis/legacy-render-config-reload-v1/legacy-config/receipt.json) · [重试](../build/analysis/legacy-render-config-reload-v1/legacy-config-retry/receipt.json)

三组本机文件端口对照通过，均放入合成的旧降档输出。覆盖取零时，两版静态规则得到请求 4、2、1。stage306 实测查询配置并合并预期字节，绘制值均为 2。18 项同一产品基线的上轮回归继续沿用。本组原版实读、实际设备和三端产品用例待执行。 [静态来源与实现差异](game-static.md#legacy-render-startup-tier-input)

<a id="legacy-render-device-preparation-validation"></a>

### 两版设备准备与文件引用核验

REA 6.7.0、Ghidra 12.1.4 复用 4 份函数档案，补核 28 个指令或数据引用。Apple LLVM 21.0.0 对照两份 PE 的 13,918 字节和 3,481 条指令，核对候选、准备、纹理探测和文件分支。另查 12 个关联 PE 的指定 ASCII 和 UTF-16LE 字面量。REA 会话已关闭。 [指令、文件偏移和样本清单](../build/analysis/legacy-render-override-producers-v1/source-review.json)

18 项现有配置和启动输入测试在本机通过。PR-A10 的实际设备返回、文件消费、同版和三端产品用例待验。 [本机测试](../build/analysis/legacy-render-override-producers-v1/local-config.log) · [交付核验](../build/analysis/legacy-render-override-producers-v1/validation.json)

<a id="legacy-render-admission-validation"></a>

### 图形准入、呈现与恢复的组合核验

REA 6.7.0 与 Ghidra 12.1.4 复用 10 个完整函数体，补查 Item 的 4 个。Apple LLVM 21.0.0 核对 18,170 字节、4,692 条指令和 156 处选定指令。另核原导入表、激活消息表、两版接口 GUID 和留存的 SDK 声明。REA 会话已正常关闭。 [原 PE 与证据定位](../build/analysis/legacy-render-admission-v1/source-review.json)

用 8 条配置输入和 2 条原创绘制命令对照现有模块，13 项既有配置与加色测试通过。复刻用例将已证静态行为与实际设备返回分别核对。原程序、完整产品、真机及当前同版验收待执行。 [本地对照](../build/analysis/legacy-render-admission-v1/focused-probe.json) · [阶段核验](../build/analysis/legacy-render-admission-v1/validation.json)

<a id="legacy-render-system-key-validation"></a>

### 绘制表面忙与系统键重建核验

REA 6.7.0 与 Ghidra 12.1.4 复用 15 个函数体及一份既有派生窗口过程。Item 新查 4 个函数，另核 3 个写入地址的函数归属。两份 PE 共核 24,374 字节、6,556 个指令位置、44 处选定调用及 29 处选定分支。73 条恢复的原记录逐条匹配导出，REA 已关闭。 [原件、偏移、消息表和返回值声明](../build/analysis/legacy-render-system-key-v1/source-review.json)

现有共享输入、加色绘制和 Canvas 三组共 29 项回归通过。另用现有 Canvas 宿主注入呈现故障，观察停住、记录错误和手动推进后复用同一上下文。原设备返回、排队送达和三端模式切换仍待执行。 [本地对照](../build/analysis/legacy-render-system-key-v1/focused-probe.json) · [本批核验](../build/analysis/legacy-render-system-key-v1/validation.json)

<a id="legacy-item-pointer-position-validation"></a>

### 两版鼠标坐标及微信尺寸回执核验

复用两版的窗口过程、按键和帧末命中档案。REA 6.7.0 与 Ghidra 12.1.4 新增四个 Item 位置处理函数，核实关闭。Apple LLVM 21.0.0 复核 643 字节、121 处指令及两版消息分派。37 项现有输入、战斗和 Canvas 回归通过。 [原字节核验](../build/analysis/legacy-item-pointer-position-v1/source-review.json) · [回归日志](../build/analysis/legacy-item-pointer-position-v1/local-tests.log)

Canvas 对照捕获缩放后的按下和松开位置、快点事件、窗外值及普通第二次按下。原版数字用其指令规则计算。微信以 257 个输入、27 个输出逐项匹配的 stage306 工程作文件入口，加载当前宿主源码。本机基线及尺寸查询逆序试次均通过。后一次尺寸回调先送达，只有 800×600 的矩形进入宿主，随后验证触控目标角色的回环请求。实际微信设备、移动网页和原客户端效果沿正式用例验收。 [Canvas 对照](../build/analysis/legacy-item-pointer-position-v1/pointer-probe.json) · [微信本机回执](../build/analysis/legacy-item-pointer-position-v1/wechat-resize.log) · [范围核验](../build/analysis/legacy-item-pointer-position-v1/validation.json)

<a id="fixed-se-ordinary-right-click-position-validation"></a>

### 固定 SE 的普通右键本机选格与请求核验

复用 REA 6.7.0 和 Ghidra 12.1.4 留存的 15 个函数。Apple LLVM 21.0.0 复核固定样本的 92 处指令、帧分派和活动值写点。86 项输入、动作、角色和会话回归及 2 项现有右键客户端用例通过。 [原件与 REA 证据](../build/analysis/fixed-se-right-click-position-v1/source-review.json) · [通用回归](../build/analysis/fixed-se-right-click-position-v1/local-tests.log) · [客户端回归](../build/analysis/fixed-se-right-click-position-v1/client-right-click.log)

同一原创场景比较按原规则输入及 Canvas 正常事件链，两组均由当前运行时产生角色查询，目标分别为 200 与 201。另在现有业务入口核三项同时允许、时钟恰到截止、转向受阻和远格查询。实际原程序、触控设备及当前同版服务待验。 [坐标和命令对照](../build/analysis/fixed-se-right-click-position-v1/right-click-probe.json) · [范围核验](../build/analysis/fixed-se-right-click-position-v1/validation.json)

<a id="fixed-se-ordinary-dialog-lifecycle-validation"></a>

### 固定 SE 的普通对话和拾取恢复核验

复用 REA 6.7.0 与 Ghidra 12.1.4 留存的 20 份规范函数记录、5 个派生函数及 3 处原字节窗口。`4903E0` 沿已读字节范围核对。Apple LLVM 21.0.0 复核 94 处指令、经典窗 37、门槛和替换序号。 [来源回执](../build/analysis/fixed-se-ordinary-dialog-lifecycle-v1/source-review.json)

本机经现有客户端和合成收包验证普通窗打开、重复、强制替换、旧修订拒绝、不同关闭及后续右键。追加普通确认、无回复关闭、人工越界模式和训练等待对照。7 项已有客户端回归通过。原版运行、实际控件的帧投递、三端设备及同版服务未执行。 [本机对照](../build/analysis/fixed-se-ordinary-dialog-lifecycle-v1/local-comparison.json) · [回归](../build/analysis/fixed-se-ordinary-dialog-lifecycle-v1/local-regressions.log) · [范围核验](../build/analysis/fixed-se-ordinary-dialog-lifecycle-v1/validation.json)

<a id="reconstructed-build-identity-validation"></a>

## 微信生成工程的构建身份核验

Node 26.9.0 与 esbuild 0.25.12 实际生成三个工程，逐字节核验三份新工程与一份留存工程各 27 个输出。Node 与 Python 对四份清单计算出一致的身份。REA 6.7.0 核实四个生成入口的七条选定加载关系。 [文件、工具和证据 ID](../build/analysis/wechat-build-identity-v1/source-review.json)

本轮证据覆盖构建产物、配置变更和入口依赖。编译包内身份读取、网页代码激活与真实宿主启动验收仍待执行。 [执行记录](../build/analysis/wechat-build-identity-v1/validation.json)

<a id="f5a-patch-completion-validation"></a>

## F5A 补丁结果续接的来源核验

REA 6.7.0 与 Ghidra 12.1.4 复用 4 个完整函数体，新增 4 个。Apple LLVM 21.0.0 对照 6,243 个文件字节和 1,810 条指令，其中 11 处 `LOCK XADD` 按前缀与操作合并核对。16 个直接调用、57 个指令锚点、托盘文字和 876 的消息表归属已核。 [原件和证据 ID](../build/analysis/launcher-f5a-patch-completion-v1/source-review.json)

现有共享补丁解释的 7 项测试通过，覆盖退出分类和选中项有效性。F5A 的完整阶段续接、通知实效、真实补丁器身份与同版游戏读取待验。 [执行记录](../build/analysis/launcher-f5a-patch-completion-v1/validation.json)

组合复核复用登录入口与补丁完成的两份原审查。REA 复核阶段选择和准备入口引用，独立核对选择函数的 61 个文件字节与 16 条指令，以及相关的 13 个直接调用和 22 个指令锚点。阶段 1、2 到阶段 3 的规则及匹配编号的提交条件已入规格。实际消息顺序、通道重绑与产品组合用例待验。 [原字节核验](../build/analysis/launcher-f5a-patch-login-admission-v1/source-review.json)

<a id="capability-launch-entry-recovery-validation"></a>

## 启动交接、入场与断线恢复的组合核验

同版本本地 REA 6.7.0 与 Ghidra 12.1.4 一次载入固定 SE，导出 5 条记录并核实关闭。Apple LLVM 21.0.0 核 3 个函数的 922 字节范围、两版 46 处所选指令、跳转表及提示文本。复用 F5A 普通交接、Item 断线、两版缓存退役和目录重开的四份来源。三个留存的同分发清单游戏样本重新核验原哈希及节表，`.text` 文件字节均为零。 [原样本、档案和回执](../build/analysis/capability-launch-entry-recovery-v1/source-review.json)

三组原创内存试次调用现有共享客户、资源库及网页会话。入场确认后仍待场景，提前收到 EOF 时运行层修订保持 0。受控 CUT 读取挂起时，EOF 排在资料尾部，释放读取后逻辑 `playing` 先于关闭，旧运行层随后清理。新实例生成 `320×240` 软件像素。登录器交接、共享客户和网页会话的 88 项现有本机回归通过。实际窗口、浏览器首帧回执、三端设备和当前同版沿原用例验收。 [组合试次](../build/analysis/capability-launch-entry-recovery-v1/stage306-probe.json) · [回归日志](../build/analysis/capability-launch-entry-recovery-v1/local-regression.log) · [范围核验](../build/analysis/capability-launch-entry-recovery-v1/validation.json)

<a id="fixed-item-character-creation-validation"></a>

## 固定 Item 新建角色与名单刷新核验

同版本本地 REA 6.7.0 与 Ghidra 12.1.4 一次载入，导出 24 条记录后核实关闭。Apple LLVM 21.0.0 对照原 PE 核 22 个函数的 14,545 字节范围、95 处指令锚点、三个报文标记、提示文字和写入路径。 `/qW` 所查路径有 12 次整型编码、1 次字节串编码。 [来源和原字节](../build/analysis/legacy-item-character-creation-v1/source-review.json)

共享草稿和会话的 14 项本机回归通过。覆盖已有的选项组合、编码、点数预算、一次提交、拒绝确认、超时、重复回复和刷新后的字段。当前产品仍将选角前的本地资料持久化标为未建模。原版重名提示、`profile.dat` 的实际写出、真实回包次序和三端用例待验。 [回归日志](../build/analysis/legacy-item-character-creation-v1/local-regression.log) · [范围核验](../build/analysis/legacy-item-character-creation-v1/validation.json)

<a id="fixed-item-character-roster-validation"></a>

## 固定 Item 角色名单和可选状态核验

同版本本地 REA 6.7.0 与 Ghidra 12.1.4 一次载入，导出 15 条记录并核实关闭。Apple LLVM 21.0.0 复核新查 14 个函数的 5,637 字节、84 处 Item 指令锚点、16 个数值字段目的地址、五段跳转数据和六个字面量。四个名单准备函数和三个主状态或素材函数沿已有档案复核原字节，SE 的 33,100 默认值也经原指令核对。 [工具、样本及完整来源](../build/analysis/legacy-item-character-roster-v1/source-review.json)

24 项现有共享角色及网页会话本机测试通过，覆盖 211 组名单、1,566 组类别和代际输入、1,128 组预览数值，以及结果和时限、重复回复、空槽及现有角色选择。真实角色控件命中、预览像素、后续选服和当前同版继续按原用例验收。 [本机回归](../build/analysis/legacy-item-character-roster-v1/local-tests.log) · [范围核验](../build/analysis/legacy-item-character-roster-v1/validation.json)

<a id="fixed-item-character-appearance-validation"></a>

## 固定 Item 已有角色外观与预览核验

本地 REA 6.7.0、Ghidra 12.1.4 导出四条新函数记录后核实关闭。Apple LLVM 21.0.0 复核直接调用、动作表和两版原 PE。既有名单与选角档案的五个函数范围复核后直接引用。两版可行预览表的 42 个编号逐字节匹配，反向外观表的 14 项及索引 14 边界另有原指令。 [工具、样本及可重跑核验](../build/analysis/legacy-item-character-appearance-v1/source-review.json)

19 项现有测试通过，包括七项共享模块、六项内存会话和六项本地回环 TCP 夹具。覆盖外观边界、两种样式变更、预览数值准备、两槽入场参数及升级后刷新。原版 242,800 的运行结果，实际帧、控件反馈和三端呈现仍待验。 [本机日志](../build/analysis/legacy-item-character-appearance-v1/local-tests.log) · [范围核验](../build/analysis/legacy-item-character-appearance-v1/validation.json)

<a id="fixed-item-character-preview-frame-validation"></a>

## 固定 Item 选角动画帧与留存素材核验

本地 REA 6.7.0 和 Ghidra 12.1.4 导出十个新增函数并核实关闭。Apple LLVM 21.0.0 核其 3,187 字节和两版调用指令，复用四个已有 Item 函数。3/10、共用子状态和动作取值按原跳表复核。29 项共享动画与外观测试通过。 [源核验](../build/analysis/legacy-item-character-preview-frame-v1/source-review.json) · [本机回归](../build/analysis/legacy-item-character-preview-frame-v1/local-tests.log)

使用固定素材配置，复核读到的 20 个完整成员哈希及十段图块读取。五个编号各执行动作 0 和 1，得到十帧非空 640×480 软件输出，逐项验证帧号、位置、调用计数和下一帧。故意让一个图块范围读取失败，得到 `LEGACY_ASSET_READ_FAILED`，随后用同一绘制计划重试成功。探针与摘要可逐字节重跑，原窗口提交、实际设备、同版和三端验收待核。 [素材摘要](../build/analysis/legacy-item-character-preview-frame-v1/preview-material-probe.json) · [范围核验](../build/analysis/legacy-item-character-preview-frame-v1/validation.json)

<a id="fixed-item-character-preview-draw-validation"></a>

## 固定 Item 选角预览的绘制与退役核验

本地 REA 6.7.0 和 Ghidra 12.1.4 导出十条记录并核实关闭。Apple LLVM 21.0.0 核八个函数的 5,823 字节、两个包含函数结果、选角及建角表项和两版收集指令。复用五个已证对象池函数及三个选角函数。66 项共享帧、绘制和资源库回归通过。 [原字节核验](../build/analysis/legacy-item-character-preview-draw-v1/source-review.json) · [本机回归](../build/analysis/legacy-item-character-preview-draw-v1/local-tests.log)

素材对照复核 20 个完整成员。两槽首次收集取活动帧，样式替换后在同一计划中取新槽准备帧和保留槽的当前帧，随后验证新槽的活动帧以及模拟分配为空时的单槽输出。四个 640×480 软件帧摘要各异。已确认旧绘制任务进入指定读取后取消，任务返回 `LEGACY_ASSET_CANCELLED`，替换计划完成。原版窗口和三端界面仍待运行回执。 [帧与取消回执](../build/analysis/legacy-item-character-preview-draw-v1/preview-draw-probe.json) · [范围核验](../build/analysis/legacy-item-character-preview-draw-v1/validation.json)

<a id="fixed-item-character-creation-preview-validation"></a>

## 固定 Item 建角双预览与详情往返核验

复用七个留存建角函数及既有对象池、图形排序规则。REA 6.7.0 与 Ghidra 12.1.4 集中导出四个新函数后核实关闭。Apple LLVM 21.0.0 复核其 874 字节、两版入队指令和四组相同数据表。18 项现有共享草稿、会话和本地回环 TCP 回归通过。 [原字节核验](../build/analysis/legacy-item-character-creation-preview-v1/source-review.json) · [回归结果](../build/analysis/legacy-item-character-creation-preview-v1/local-tests.log)

复核 20 个留存素材成员后，用当前草稿、动画和绘制计划生成四次 640×480 软件预览层。类别 7 初始方向为 5，六次减向后回绕到 7。进入详情当轮仅保留两条已直接入队的预览记录。返回后保留族、序号和颜色，方向回到 5，再进详情核对 30 与 10 两项预算。另核一次模式 1 完成时计数为 255，失效后从首图块重启。此处获取的是软件像素摘要，实际三端和完整原版画面仍待验。 [软件帧摘要](../build/analysis/legacy-item-character-creation-preview-v1/creation-preview-probe.json) · [范围核验](../build/analysis/legacy-item-character-creation-preview-v1/validation.json)

<a id="fixed-item-character-creation-details-validation"></a>

## 固定 Item 和 SE 的建角详情与确认核验

复用两版原详情档案及已有编号、命中和帧末输入证据。REA 6.7.0 和 Ghidra 12.1.4 新增三个 Item 函数，导出后核实关闭。Apple LLVM 21.0.0 复核 427 字节及确认窗的 685 字节调用范围。两版控件区 336 字节和 28 个肖像基本编号逐字节一致。18 项共享草稿、会话和本地回环 TCP 回归通过。 [来源核验](../build/analysis/legacy-item-character-creation-details-v1/source-review.json) · [回归日志](../build/analysis/legacy-item-character-creation-details-v1/local-tests.log)

本机核 10 组确认命中边界和按下条件、3 个加点用例及 4 个肖像和确认往返用例。对向有值的两例发现共享草稿差异，对向为空的零预算转移匹配。三种模式的数值与复用规格一致，实时降低类别时另核占位与提交值。命中和占位结果为来源规则计算。原版及三端实际控件和画面待验。 [差异对照](../build/analysis/legacy-item-character-creation-details-v1/details-probe.json) · [范围核验](../build/analysis/legacy-item-character-creation-details-v1/validation.json)

<a id="fixed-item-state5-reset-validation"></a>

## 固定 Item 角色切换复位核验

同版本本地 REA 6.7.0、Ghidra 12.1.4 导出 24 条记录并核实关闭。Apple LLVM 21.0.0 对照原 PE 核 23 个函数的 2,201 字节范围、64 处锚点、两版各 21 次主状态 5 直接调用及三个输入法导入项。六段清除区和 48 项记录的边界已与两个角色记录及活动槽地址核对。缓存、窗口和固定 SE 的 CT-F2 复用已有档案。 [原始范围、调用和关闭回执](../build/analysis/legacy-item-entry-reset-v1/source-review.json)

选角和创建会话的 20 项原创本机回归通过，覆盖选择、刷新、缺素材、取消及已有世界投影时的拒绝。现有产品在首次入场准备选中角色，并在投影已活动时拒绝同一会话内再次选择。GF-A05 继续验收原顺序的复位、缓存缺失、经典窗口和实际宿主输入。 [本机回归](../build/analysis/legacy-item-entry-reset-v1/local-regression.log) · [范围核验](../build/analysis/legacy-item-entry-reset-v1/validation.json)

<a id="fixed-item-world-entry-validation"></a>

## 固定 Item 入场和首个普通场景核验

同版本本地 REA 6.7.0、Ghidra 12.1.4 一次载入并导出 15 条记录，会话关闭已核。Apple LLVM 21.0.0 核对 10 个函数的 8,871 字节范围、94 处指令、三项主状态及八项子状态表、报文和提示文本。复用固定 SE 的入场档案和前一批的组合用例。 [来源、样本和关闭回执](../build/analysis/legacy-item-world-entry-v1/source-review.json)

执行 `node --test shared/tests/legacy-game-characters.test.mjs`，11 项通过。覆盖三个入场字段、成功字串、重复回复、拒绝和连接先于截止的边界。当前共享角色层在产出请求前保存时钟，网页会话在角色失败后结束。原版失败确认、两项场景就绪和淡入放行沿 GF-A06/A07，实际产品首帧与当前同版待验。 [回归日志](../build/analysis/legacy-item-world-entry-v1/local-regression.log) · [范围核验](../build/analysis/legacy-item-world-entry-v1/validation.json)

<a id="legacy-item-disconnect-recovery-validation"></a>

## 历史 Item 断线提示的来源核验

REA 6.7.0 与 Ghidra 12.1.4 复用 6 个完整函数体，新增 2 个。Apple LLVM 21.0.0 对照原文件的 5,370 字节和 1,367 条指令，核定 31 个直接调用、55 个指令锚点、状态 11 的跳转表项和所选导入。 [原文件、范围与证据 ID](../build/analysis/legacy-item-disconnect-recovery-v1/source-review.json)

本次验收为固定历史样本的静态规格核验。分配失败、等待确认、确认退役、同版适用性与设备测试均留在相应开发验收。 [执行记录](../build/analysis/legacy-item-disconnect-recovery-v1/validation.json)

<a id="legacy-item-work-window-pair-validation"></a>

## 历史 Item 工艺窗口配对的来源核验

复用 REA 6.7.0 与 Ghidra 12.1.4 的五个函数体。Apple LLVM 21.0.0 对照 9 段、1,301 字节和 341 条原文件指令，另核所选五个表行、窗口字段的文件初值及 15 处直接调用。 [来源核验](../build/analysis/legacy-item-work-window-pair-v1/source-review.json)

46 项现有工作与输入本机回归通过。四个槽位组合由源规则导出，原版实际回调、外层帧分派及当前同版继续验收。 [回归日志](../build/analysis/legacy-item-work-window-pair-v1/focused-regression.log) · [发布核验](../build/analysis/legacy-item-work-window-pair-v1/validation.json)

<a id="f5a-status-zero-admission-validation"></a>

## F5A 状态 0 回复的准入核验

REA 6.7.0 与 Ghidra 12.1.4 复用 110 条记录，新增两个函数体。Apple LLVM 21.0.0 独立核对 10 段、515 字节和 143 条指令，另重核留存分派段的字节哈希和所选表项。REA 会话已关闭。 [原字节核验](../build/analysis/launcher-f5a-status-zero-admission-v1/source-review.json)

30 项现有登录和交接本机回归通过。四条准入路径已登记为后续验收用例，实际 Windows 回调和当前同版游戏读取继续取证。 [回归日志](../build/analysis/launcher-f5a-status-zero-admission-v1/focused-regression.log) · [发布核验](../build/analysis/launcher-f5a-status-zero-admission-v1/validation.json)

<a id="f5a-result-selection-validation"></a>

## F5A 登录结果和候选确认的来源核验

REA 6.7.0 与 Ghidra 12.1.4 新增三个小函数档案，复用两份完整入口和四份局部来源。Apple LLVM 与原 PE 对照五个完整函数的 3,449 字节和 980 条指令，另核 22 处直接调用、46 段指令、两个导入和确认表。来源核验重复生成两次，输出逐字节一致。REA 会话已关闭。七项来源用例已登记，Windows 消息、当前同版游戏读取及目标用例仍待实测。 [源字节核验](../build/analysis/launcher-f5a-result-selection-v1/source-review.json) · [发布复核](../build/analysis/launcher-f5a-result-selection-v1/validation.json)

<a id="f5a-ordinary-handoff-validation"></a>

## F5A 普通选服至启动交接的来源核验

复用 REA 6.7.0 与 Ghidra 12.1.4 的 12 个完整函数档案。Apple LLVM 21.0.0 与原 PE 核对 13,434 字节、33 处直接调用、81 处指令锚点、18 个分支和 5 个导入。由同一 Frame 的偏移计算核对候选名、上下文和数字的生产及读取位置。 [原件、归属和原指令](../build/analysis/launcher-f5a-ordinary-handoff-v1/source-review.json)

16 个静态组合用例覆盖确认设置结果、目录或主程序缺失、首次配置、仅刷新变化、映射与进程失败、托盘返回和待处理任务。用例以给定的宿主结果和读取时点推导。Node 26.9.0 的 100 项现有回归通过，新增的分析对照确认 40 与 41 字节 ASCII 名称、空上下文及历史进程参数差异。实际 Windows、三端产品、同版游戏读取及统一分析门槛继续待验证。 [组合用例](../build/analysis/launcher-f5a-ordinary-handoff-v1/source-cases.json) · [本地对照](../build/analysis/launcher-f5a-ordinary-handoff-v1/local-comparison.json) · [发布核验](../build/analysis/launcher-f5a-ordinary-handoff-v1/validation.json)

<a id="f5a-profile-list-projection-validation"></a>

## F5A 候选显示行及全能力流程核验

复用 6 份 REA 档案，通过本机 REA 6.7.0 与 Ghidra 12.1.4 补查 3 个函数。Apple LLVM 21.0.0 对照 12,040 字节、28 处直接调用和 76 处指令锚点。`42D110` 的伪代码省略插入和恢复分支，这些分支按 REA 指令边界和原 PE 核对。会话已关闭。 [原件核验](../build/analysis/launcher-f5a-profile-list-v1/source-review.json)

本机对照确认现有成组交换和状态条件可复用，现有接口仍需接入 F5A 的非空上下文条件、分组筛选和可见行映射。75 项现有本地回归通过。完整原版列表、实际三端流程和同版游戏读取仍待验收。 [合成对照](../build/analysis/launcher-f5a-profile-list-v1/local-comparison.json) · [回归记录](../build/analysis/launcher-f5a-profile-list-v1/local-regression.log)

按现有矩阵核对 40 项需求、19 项固定样本本域规格、六个分析组及七个开发批次。分析用时与后续实现、实际验收和外部材料等待分别估算。统一分析门槛继续待通过。 [执行流程](development-plan.md#capability-first-workflow) · [用时口径](development-plan.md#capability-first-estimation) · [发布核验](../build/analysis/launcher-f5a-profile-list-v1/validation.json)

<a id="f5a-pin-publication-validation"></a>

## F5A 置顶保存和列表恢复核验

REA 6.7.0 与 Ghidra 12.1.4 复用 6 份完整函数档案，补查 4 个函数。Apple LLVM 21.0.0 核对 10,033 字节、33 处直接调用、69 处指令锚点，以及原消息表和两个本地设置键。首次载入计入 93.65 秒的查询时间。REA 会话已关闭。 [原字节、位置和工具计时](../build/analysis/launcher-f5a-pin-publication-v1/source-review.json)

七项静态用例覆盖当前行、无效输入、成功写入、恢复尝试、排序回绕及列表回执。现有 54 项登录选择、偏好、流程和交接回归通过。规格核验的经过时间含证据复用、独立对照、用例和文档，详见回执。实际写入、完整原版流程、三端及当前同版验收待执行。 [用例](../build/analysis/launcher-f5a-pin-publication-v1/source-cases.json) · [本机回归](../build/analysis/launcher-f5a-pin-publication-v1/local-regression.log) · [发布与用时核验](../build/analysis/launcher-f5a-pin-publication-v1/validation.json)

<a id="f5a-candidate-management-validation"></a>

## F5A 候选筛选、备注和排序核验

REA 6.7.0 与 Ghidra 12.1.4 复用 10 份完整函数档案，新增 19 份。Apple LLVM 21.0.0 对照函数范围 17,552 字节、9 个独立字节范围、101 处直接调用和 101 处指令锚点。`421A10` 的移动分支及第二输入由两种指令视图和三个调用点核对。两次 REA 会话均已关闭。 [原件、偏移、消息表和用时](../build/analysis/launcher-f5a-candidate-management-v1/source-review.json)

九项静态用例复用选服与排序既有编号，覆盖筛选、编辑取消、同组拖动、部分写入恢复和单次撤销。原共享入口的合成对照确认排序、确认和现有偏好编码可复用，筛选映射和展开设置仍需接入。92 项现有本地回归通过。实际原版菜单、写回、重开、三端及当前同版继续待验。 [静态用例](../build/analysis/launcher-f5a-candidate-management-v1/source-cases.json) · [本机对照](../build/analysis/launcher-f5a-candidate-management-v1/local-comparison.json) · [回归](../build/analysis/launcher-f5a-candidate-management-v1/local-regression.log) · [发布核验](../build/analysis/launcher-f5a-candidate-management-v1/validation.json)

<a id="f5a-note-modal-admission-validation"></a>

## F5A 候选备注、迟到回复和保存核验

REA 6.7.0 与 Ghidra 12.1.4 复用 11 份函数档案，补得 `45C30D` 的 344 字节函数范围。两次分析请求累计 93.62 秒，其中一次取回与历史证据 ID 相同的 `45AF9C`。Apple LLVM 21.0.0 核对 8 段补充指令范围、75 处指令锚点及 28 处直接调用。拥有者恢复和返回的例外清理以原字节核对。REA 已关闭。 [原件、调用、工具及旧夹具](../build/analysis/launcher-f5a-note-modal-v1/source-review.json)

登录状态机、列表选择和本地偏好的 44 项现有 Node 测试通过。它们覆盖已完成回复后的迟到事件及候选数据所有权。原版备注实际消息、可引发替换的入口和三端写回仍待 LS-T17、LS-T20 核验。 [回归日志](../build/analysis/launcher-f5a-note-modal-v1/local-regression.log) · [核验回执](../build/analysis/launcher-f5a-note-modal-v1/validation.json)

<a id="f5a-start-return-validation"></a>

## F5A 启动返回及准备顺序核验

复用 REA 6.7.0、Ghidra 12.1.4 的 16 个完整函数及一个选择范围。Apple LLVM 21.0.0 复核 3,338 条指令、27 处直接调用和 9 个导入，22 个单列的 `LOCK` 前缀按 REA 指令边界合并计数。4 项现有本机启动参数和取消回归通过。托盘、实际重入投递、当前游戏启动和读取仍待运行验收。 [复算脚本](../build/analysis/launcher-f5a-start-return-v1/verify_source.py) · [原件核验](../build/analysis/launcher-f5a-start-return-v1/source-review.json) · [本机回归](../build/analysis/launcher-f5a-start-return-v1/focused-tests.tap)

<a id="f5a-preparation-generation-validation"></a>

## F5A 预设命令及提交编号核验

REA 6.7.0、Ghidra 12.1.4 新取四个函数，复用六个。Apple LLVM 21.0.0 与原 PE 复核 1,924 条指令、11 处直接调用、四个导入、四个虚槽和三条消息表项。复算覆盖控件 ID、主窗启用检查、编号变化和待处理位。REA 结果已导出并关闭会话。本次为静态核验，实际 Windows 投递、连接重绑及三端用例继续验收。 [复算脚本](../build/analysis/launcher-f5a-preparation-generation-v1/verify_source.py) · [原件核验](../build/analysis/launcher-f5a-preparation-generation-v1/source-review.json)

<a id="f5a-handoff-number-origin-validation"></a>

## F5A 交接数字的来源与边界核验

REA 6.7.0 与 Ghidra 12.1.4 复用 105 条记录，新增两个函数体和三处地址归属。Apple LLVM 21.0.0 独立核对 F5A 与 C82 的 17 段、657 字节和 161 条指令，并核 F5A 的应用入口、回调和状态 0 分派表。REA 会话已关闭。 [来源核验](../build/analysis/launcher-f5a-handoff-number-origin-v1/source-review.json)

四个原创回调边界值与现有映射编码结果相符，构造零值独立核对。19 项现有交接与启动回归通过。实际 Windows 回调、当前同版游戏读取及联合启动待验。 [夹具结果](../build/analysis/launcher-f5a-handoff-number-origin-v1/projection.json) · [回归日志](../build/analysis/launcher-f5a-handoff-number-origin-v1/focused-regression.log) · [发布核验](../build/analysis/launcher-f5a-handoff-number-origin-v1/validation.json)

<a id="f5a-first-config-validation"></a>

## 11 月分发版的首次配置核验

新增 10 条完整 REA 记录及 3 个入口定位，复用 5 条 F5A 记录和 C82 的原范围核验。F5A 的 20 个范围、9990 字节及 3169 条指令与原映像对照，确认 25 处直接调用、67 处指令锚点及 9 项导入。15 个合成用例覆盖缓存匹配、活动轮询、提醒与三个加载失败值。现有解析器读回五条随包目录记录，现有首次配置入口仍输出旧版同步计划。真实 Windows 调度和当前同版消费待验。 [来源与用例](../build/analysis/launcher-f5a-first-config-v1/source-review.json) · [发布核验](../build/analysis/launcher-f5a-first-config-v1/validation.json)

<a id="first-config-outcome-validation"></a>

### 首次配置窗口与文件结果核验

REA 6.7.0 和 Ghidra 12.1.4 复用 5 份完整函数档案与 1 处已存创建调用。Apple LLVM 21.0.0 将 2,518 字节的函数体绑定到所选 PE。两次新增查询中，取消调用取得指令和目标，配置器消息表位置返回不可解码，改由原字节解析表行并核对按钮。另核 60 处指令及 10 个 MFC 导入序号对应的导出。 [样本、方法和结果](../build/analysis/first-config-outcome-v1/source-review.json)

Node 26.9.0 的 15 项现有测试通过。原创字节夹具用较短内容覆盖旧文件的开头，现有解析器仍从保留的尾部读取四个开关。现有启动计划仍按同步等待与写标记意图返回。SS-A19、SS-A20 与 PR-A10 的原版进程退出、实际文件异常和三端执行待验。 [本机回归](../build/analysis/first-config-outcome-v1/local-regression.log) · [原创夹具](../build/analysis/first-config-outcome-v1/local-projection.json) · [发布核验](../build/analysis/first-config-outcome-v1/validation.json)

<a id="f5a-directory-recovery-validation"></a>

## F5A 目录恢复的来源核验

REA 6.7.0 和 Ghidra 12.1.4 核对 11 个完整函数及 4 条调用归属。独立对照 5,919 个文件字节、26 个直接调用、30 个指令锚点及三条消息表记录。PE 导入绑定 `PostMessageA`、`PathFileExistsA` 和 `WritePrivateProfileStringA`。规格保留投递失败、迟到上下文、取消、写入失败及成功续接的用例，实际 Windows 结果待验。 [来源核验](../build/analysis/launcher-f5a-directory-recovery-v1/source-review.json)

<a id="launcher-directory-host-handoff-validation"></a>

### 目录设置读回与现有宿主对照

复用 11 份函数档案。REA 6.7.0 和 Ghidra 12.1.4 补一次过程归属及两段共 216 字节。Apple LLVM 21.0.0 在固定映像独立核对 207 条所选指令及其中 48 处断言，并复核两个目录载入调用与设置读写导入。REA 已关闭。 [固定样本与取证范围](../build/analysis/launcher-directory-host-handoff-v1/source-review.json)

Browser 插件当前缺席，沿现有 Playwright 运行 Chrome 157.0.8103.51。在实际登录页的桌面 1280×920 核对目录变化、前检失败、已选补丁、保存和新页读回，共 9 组结果。390×844 触屏视口另核前检拒绝。页面无应用错误和警告，只有本机夹具请求，登录连接次数为零。首轮遗漏展开缓存区，点击超时，重新展开后完整通过。浏览器取消由合成的 `cancel` 事件驱动，原生文件对话框待验。 [页面断言及视口](../build/analysis/launcher-directory-host-handoff-v1/browser.json)

微信宿主的 6 组本地夹具核对选择器取消、非法 ZIP、重开与不同目录、回调前状态及部分写入后恢复旧版。5 个文件中的 35 项既有本机回归通过。真实微信 SDK 与真机、原版重新载入及完整产品目录恢复待验。产品代码沿 stage306。 [微信宿主回执](../build/analysis/launcher-directory-host-handoff-v1/wechat.json) · [本机回归](../build/analysis/launcher-directory-host-handoff-v1/local-regression.log) · [范围与引用核验](../build/analysis/launcher-directory-host-handoff-v1/validation.json)

<a id="f5a-recovery-prompt-validation"></a>

恢复提示核对复用四个同版函数，REA 补齐创建、窗口过程和启用帮助函数的完整函数体。Apple LLVM 和原 PE 核对新增 1,321 字节、436 条指令，并绑定 58 个指令锚点、7 处直接调用及 12 项导入。86 条原证据原样保留，新增三条后保存并关闭会话。Windows 原版交互和三端产品用例仍待验收。 [来源和结果](../build/analysis/launcher-f5a-recovery-prompt-v1/source-review.json) · [工作区核验](../build/analysis/launcher-f5a-recovery-prompt-v1/validation.json)

<a id="f5a-handoff-fields-validation"></a>

## F5A 两块交接缓冲的来源和本机核验

REA 6.7.0 与 Ghidra 12.1.4 复用 99 条留存记录，新增 6 个函数并关闭会话。Apple LLVM 21.0.0 独立核对 11 个原 PE 范围、2,146 字节和 772 条指令。另核所选直接调用、字段偏移及映射名。

原创夹具对照 70 种映射格式、3 种路径引号和 1 个历史进程计划。40 项现有本机回归通过。数字字段的写入见后续核验。实际 Windows 创建、当前同版游戏读取和联合接受继续待证。 [数字来源](#f5a-handoff-number-origin-validation) · [来源核验](../build/analysis/launcher-f5a-handoff-fields-v1/source-review.json) · [夹具结果](../build/analysis/launcher-f5a-handoff-fields-v1/projection.json) · [回归记录](../build/analysis/launcher-f5a-handoff-fields-v1/focused-regression.log) · [发布核验](../build/analysis/launcher-f5a-handoff-fields-v1/validation.json)

<a id="f5a-mapping-lifecycle-validation"></a>

## F5A 交接映射的发布与退役核验

REA 6.7.0 与 Ghidra 12.1.4 新核四个函数，复用三个完整函数。Apple LLVM 21.0.0 核对 5,598 字节和 1,771 条指令，将分列的 38 个 `LOCK` 前缀按原字节归并。映射生产器由两段规范范围组成，异常处理另按 47 字节及原 PE 表核验。另核 15 处直接调用、17 处导入调用和 33 处指令锚。REA 会话已关闭。 [来源核验](../build/analysis/launcher-f5a-mapping-lifecycle-v1/source-review.json)

24 项现有交接及进程计划本机回归通过。实际 Win32 映射、进程创建、仅刷新事件顺序和当前同版游戏接收待验。 [回归日志](../build/analysis/launcher-f5a-mapping-lifecycle-v1/focused-regression.log) · [本轮核验](../build/analysis/launcher-f5a-mapping-lifecycle-v1/validation.json)

<a id="f5a-installation-and-backup-validation"></a>

## Inno 安装动作和 F5A 备份分支核验

用已有 innoextract 1.9 调试读取器解析两份安装头，再用固定 Binary Refinery 0.11.3 解码 IFPS。两份脚本各有六个内部函数，332 和 318 条指令均匹配各自的文件体。复用三份 REA 函数档案，用 Apple LLVM 21.0.0 独立核对 3,881 字节，合并工具单独显示的九个 `LOCK` 前缀后与 1,156 条指令起点相符。静态读取器的七项资格检查和补丁相关的 31 项本机回归通过。实际回退制品、进程及宿主恢复待验收。 [来源核验](../build/analysis/launcher-inno-provisioning-v1/source-review.json) · [本机回归](../build/analysis/launcher-inno-provisioning-v1/focused-regression.log) · [发布核验](../build/analysis/launcher-inno-provisioning-v1/validation.json)

<a id="legacy-item-upgrade-buffer-validation"></a>

## 历史 Item 的注销与升级输入核验

REA 6.7.0 与 Ghidra 12.1.4 复用 118 条记录并新增 20 条。关闭后的快照保留完整分派记录。Apple LLVM 21.0.0 核对包含 `VKW` 所选分支在内的 18 个范围，共 2,186 条指令和 8,458 个文件字节。角色选项及本机会话的 13 项现有回归通过。升级资料生产、原版运行及当前同版接受仍待。 [来源核验](../build/analysis/legacy-item-upgrade-buffer-provenance-v1/source-review.json) · [本机回归](../build/analysis/legacy-item-upgrade-buffer-provenance-v1/focused-regression.log) · [发布核验](../build/analysis/legacy-item-upgrade-buffer-provenance-v1/validation.json)

<a id="legacy-item-logout-clock-validation"></a>

## 历史注销结果与时钟核验

REA 6.7.0 与 Ghidra 12.1.4 把 `4985A8` 归到留存的选服函数 `49803C`，确认后关闭会话。Apple LLVM 21.0.0 对照十个留存函数、6,849 个原文件字节和 1,892 条指令，核实 20 处 Item 直接调用，并对照固定 SE 的发送顺序、计时写入和阈值。三个阈值各核对临界值前、等于和后一毫秒，共九个 32 位回绕推导用例。 [来源核验](../build/analysis/legacy-item-logout-clock-v1/source-review.json)

现有会话的六项本机返回选服回归通过，覆盖等待严格超过 600,000 毫秒、回绕、收到通知后跳过发送及提前断线。长会话提示和四类结果的完整原版运行与目标端验收仍待。 [本机回归](../build/analysis/legacy-item-logout-clock-v1/focused-regression.log) · [发布核验](../build/analysis/legacy-item-logout-clock-v1/validation.json)

<a id="legacy-item-upgrade-result-flow-validation"></a>

## 历史 Item 升级结果的帧顺序核验

REA 6.7.0 与 Ghidra 12.1.4 复用 118 条记录，新增四个函数和一条调用归属记录后关闭。Apple LLVM 21.0.0 独立核对 15 个范围、4,184 字节和 1,111 条指令，另核主状态 13 的跳表行、接收调用和清零范围。

两个本机夹具核对现有共享流程在发包前忽略回包、在发包后采用首条结果。25 项现有角色回归通过。原版行为来自静态顺序，类别 7 资料的实际写入和当前版本仍待。 [原 PE 核验](../build/analysis/legacy-item-upgrade-result-flow-v1/source-review.json) · [本机对照](../build/analysis/legacy-item-upgrade-result-flow-v1/projection.json) · [发布核验](../build/analysis/legacy-item-upgrade-result-flow-v1/validation.json)

<a id="legacy-item-upgrade-submit-validation"></a>

升级提交核对四个新增和四个留存 REA 函数体。Apple LLVM 与原 PE 对照 2,851 字节、781 条指令、51 个指令及字节锚点、19 处直接调用。另核阶段表、等待标题和 `WSOCK32.dll` 导入序号。实际 Windows 写出、等待窗及三端用例待验收。 [来源核验](../build/analysis/legacy-item-upgrade-submit-v1/source-review.json) · [工作区核验](../build/analysis/legacy-item-upgrade-submit-v1/validation.json)

<a id="legacy-upgrade-empty-material-validation"></a>

## 两版类别 7 空字段的静态与本机核验

复用 REA 6.7.0、Ghidra 12.1.4 的 14 个完整函数体。Apple LLVM 21.0.0 复核这些函数和 5 个 Item 范围，共 1,153 条指令、30 处直接调用。两版条件路径均得到帧前八字节 `35 5B 42 20 35 20 20 00`，并核到普通返回写阶段 3、后续等待创建和写阶段 4。 [复算脚本](../build/analysis/legacy-upgrade-empty-material-v1/verify_source.py) · [原件和 REA 核验](../build/analysis/legacy-upgrade-empty-material-v1/source-review.json)

共享核心和网页会话的 4 项既有测试通过，覆盖资料未明时停止提交、已知请求的等待和结果、重试时类别变化及重复回复。原程序的实际资料、提交和服务器结果待验。 [定向回归输出](../build/analysis/legacy-upgrade-empty-material-v1/focused-tests.tap)

<a id="legacy-item-frame-hit-selection-validation"></a>

## 历史 Item 帧末输入和命中核验

REA 6.7.0 与 Ghidra 12.1.4 复用 123 条活动档案。九个函数体和一条地址归属核验后保存 133 条记录，已关闭会话。九体包括先前留存的 `56F37F`。Apple LLVM 21.0.0 对照 10 个原 PE 范围、6,543 字节和 1,783 条指令。

本机夹具核对同级排序与 4,096 行边界。98 项现有输入、场景、渲染和文字回归通过。原版运行和实际窗口表分派仍待验收。 [原 PE 核验](../build/analysis/legacy-item-frame-hit-selection-v1/source-review.json) · [共享排序对照](../build/analysis/legacy-item-frame-hit-selection-v1/projection.json) · [发布核验](../build/analysis/legacy-item-frame-hit-selection-v1/validation.json)

<a id="legacy-item-normal-slot-validation"></a>

## 两份历史样本的普通窗口请求核验

REA 6.7.0 与 Ghidra 12.1.4 复用 51 条 Item 记录并新增 22 条，导出后关闭会话。复用 SE 的 End 请求档案，Apple LLVM 21.0.0 共核 15 段、1,895 条指令、7,373 个原文件字节。两版的 99 号行、Item 的三个状态表项、按键位和清槽恢复顺序均有字节证据。七个源预期用例登记到窗口合同。原版运行、目标用例和实际回调分派仍待验证。 [来源核验](../build/analysis/legacy-item-window-input-route-v1/source-review.json) · [发布核验](../build/analysis/legacy-item-window-input-route-v1/validation.json)

<a id="legacy-item-classic-frame-dispatch-validation"></a>

## 历史 Item 的经典帧分派核验

复用 REA 6.7.0 与 Ghidra 12.1.4 的五个完整函数。Apple LLVM 21.0.0 对照固定原文件的 9,596 字节和 2,069 条指令。主状态及两个子状态跳转表与 REA 一致，PE 可执行区的 15 处 `56BB20` 直接调用也与留存引用逐项一致。所选调用序列按函数内静态分支和调用正常返回推导。真实运行谓词、另一套回调分派及三端用例继续验收。 [来源核验](../build/analysis/legacy-item-frame-dispatch-v1/source-review.json) · [发布核验](../build/analysis/legacy-item-frame-dispatch-v1/validation.json)

<a id="legacy-item-double-window-frame-validation"></a>

## 历史 Item 恢复帧的两遍更新核验

复用 10 份完整 REA 函数档案，新增 `58D3FB → 593524` 的 1 次指令归属核验。Apple LLVM 21.0.0 对照 10 个函数和 7 个独立范围的 15,747 字节与 3,881 条指令，另核 26 处直接调用、60 处指令锚点及 `GetTickCount` 导入。十个静态推演覆盖过渡的推进与回收、图鉴键位重读及三种剩余时长。 [来源和推演](../build/analysis/legacy-item-double-window-frame-v1/source-review.json)

原创场景夹具核对当前共享运行时的三个泵结果。合资格的一次更新推进场景一次、呈现并清指针事件，未到期的泵保留事件供下一次更新。现有输入、工艺及工作上下文回归 40 项通过。历史恢复帧实跑、另一套窗口分派、当前同版与三端产品继续验收。 [共享运行时结果](../build/analysis/legacy-item-double-window-frame-v1/local-projection.json) · [回归日志](../build/analysis/legacy-item-double-window-frame-v1/local-regression.log) · [核验回执](../build/analysis/legacy-item-double-window-frame-v1/validation.json)

<a id="legacy-item-classic-callback-order-validation"></a>

经典窗口创建与退役核对 8 个完整函数、5,419 字节、1,405 条指令、52 个指令锚点和 13 处直接调用。REA 新增三份函数证据，退役函数复查得到此前同一证据 ID。四个窗口描述符与组字节均直接核对原 PE。另一套窗口分派、实际原版及三端用例仍待。 [来源核验](../build/analysis/legacy-item-classic-callback-order-v1/source-review.json) · [工作区核验](../build/analysis/legacy-item-classic-callback-order-v1/validation.json)

<a id="legacy-item-classic-open-transition-validation"></a>

## 历史 Item 经典窗口的打开与回退核验

REA 复用 95 条记录并新增 6 个函数档案。Apple LLVM 核对 12 个函数体的 4,509 字节和 1,232 条指令，复核 26 处直接调用、49 个原文件锚点及六个窗口组字节。同号复用和先退役再创建的结果按固定样本指令推导。REA 会话已关闭，原版运行与三端用例待执行。 [来源核验](../build/analysis/legacy-item-classic-open-transition-v1/source-review.json) · [核验回执](../build/analysis/legacy-item-classic-open-transition-v1/validation.json)

流程复核时以已有 REA 记录重新生成来源核验，所得字节与原记录一致。延迟创建、同号复用、分配回退和组关闭共四类用例由 D0/D3 共用，实际产品用例待执行。 [用例与预期](game-static.md#legacy-item-classic-open-transition)

<a id="legacy-item-alternate-window-graphics-validation"></a>

## 历史 Item 第二套窗口的图形规则核验

REA 6.7.0 复用 137 条快照记录，新增 4 个函数档案。Apple LLVM 对照 11 个函数体的 4,046 字节和 1,245 条指令。按原表逐项核对 97 处回调到辅助函数的直接调用，另核 15 处链内调用与 46 处指令锚点。四种样式的第 11、12 次回调结果为静态推导。REA 会话已关闭，普通业务回调调度、实际原版与三端用例待执行。 [来源核验](../build/analysis/legacy-item-alternate-window-graphics-v1/source-review.json) · [发布核验](../build/analysis/legacy-item-alternate-window-graphics-v1/validation.json)

<a id="alternate-window-selection-and-cleanup-validation"></a>

## 两份历史样本的第二套窗口查询与退役核验

REA 6.7.0、Ghidra 12.1.4 与 Apple LLVM 21.0.0 共核 33,390 个函数体字节及 9,367 条指令位置。复用 28 份完整档案和 9 份派生视图，新增两个 Item 函数档案。两份 99 行表均核原字节，Item 的 97 个首参转交逐项匹配 REA 引用和原指令。REA 会话已关闭。 [来源核验](../build/analysis/legacy-item-alternate-dispatch-v1/source-review.json)

50 个合成用例核对选中与就绪、先清槽后退役、预览交替、配对关闭及图鉴回页。7 项现有训练、治疗、工艺与工作上下文的本地回归通过。原版正常回调时序、当前同版、完整产品和三端运行仍待验。 [合成推演](../build/analysis/legacy-item-alternate-dispatch-v1/projected-cases.json) · [训练回归](../build/analysis/legacy-item-alternate-dispatch-v1/local-training.log) · [工艺回归](../build/analysis/legacy-item-alternate-dispatch-v1/local-work.log) · [发布核验](../build/analysis/legacy-item-alternate-dispatch-v1/validation.json)

<a id="alternate-window-focus-slots-validation"></a>

## 两份历史样本的焦点与槽位交接核验

REA 6.7.0 与 Ghidra 12.1.4 补核 Item 的槽位筛选函数和两个局部地址归属。Apple LLVM 复核 95 字节的完整函数，原 PE 字节核对两份样本共 12 条焦点分支及 Item 窗口 5、21 的局部调用。来源核验重复生成两次，输出逐字节一致。Item 的 97 个回调地址只有表中登记字面量，六个训练构造入口在所选文件字节范围没有命中精确绝对地址或 `E8/E9` 相对目标。这项检查覆盖指定编码，计算调用和真实帧分派仍待证。五个用例已登记，目标平台用例待运行。 [来源核验](../build/analysis/alternate-window-focus-slots-v1/source-review.json) · [复核记录](../build/analysis/alternate-window-focus-slots-v1/validation.json)

<a id="legacy-item-startup-handoff-validation"></a>

## 历史 Item 的启动交接与类别写入核验

REA 6.7.0 和 Ghidra 12.1.4 新核七个完整函数与一个地址归属，复用 Item 初始化及两份 SE 消费者。Apple LLVM 21.0.0 核对十个完整函数的 8,969 字节、2,620 条指令，再核 `Wb^` 分派窗口、主状态跳转、19 处直接调用、5 处导入调用和 11 个字面量。REA 会话已关闭。 [原件与指令回执](../build/analysis/legacy-item-startup-handoff-v1/source-review.json)

46 项现有交接、配置和角色本机回归通过。历史原程序运行、实际 Windows 枚举与映射、类别 7 升级资料来源及当前同版验收待执行或待证。 [本机回归](../build/analysis/legacy-item-startup-handoff-v1/focused-regression.log) · [本轮核验](../build/analysis/legacy-item-startup-handoff-v1/validation.json)

<a id="legacy-item-resource-handoff-validation"></a>

## 历史 Item 与 SE 的资源路径核验

REA 6.7.0 与 Ghidra 12.1.4 复用 39 条记录并新增 12 条，导出后关闭会话。Apple LLVM 21.0.0 独立核对三段主要函数、两段已有初始化函数及两个帮助函数，共 1,898 条指令和 7,708 个原文件字节。原表提取的 42 个默认值、40 个前缀及 40 个格式与现有共享表相符。 [来源核验](../build/analysis/legacy-item-resource-handoff-v1/source-review.json)

Node 本机核对 42 条默认路径、40 个逐前缀用例及四个合并和别名用例。代码 4 和 11 各走三种随包目录与配置组合，每次匹配 28 个长名，产生 480 字节资源尾部，并匹配 42 条预期路径。当前同版游戏读取、实际 Windows 枚举和联合启动仍待。 [本机回执](../build/analysis/legacy-item-resource-handoff-v1/resource-plan-probe.json) · [发布核验](../build/analysis/legacy-item-resource-handoff-v1/validation.json)

<a id="legacy-graphics-scratch-provenance-validation"></a>

## 图形暂存与颜色缓存核验

REA 6.7.0 与 Ghidra 12.1.4 复用 36 条记录、新增 6 条，导出后关闭会话。另复用五个函数档案，Apple LLVM 21.0.0 独立核对 15 个字节范围，1,076 条指令和 3,306 字节均匹配固定 PE。实际归档的 320 号载体经现有共享解码器展开，3,360 字节前缀与 768 字节色表分别留摘要。本轮证据来自静态检查和共享解码器本机素材读取，原版运行、产品构建及真实平台效果仍待。 [来源核验](../build/analysis/legacy-graphics-scratch-provenance-v1/source-review.json) · [素材核验](../build/analysis/legacy-graphics-scratch-provenance-v1/material.json) · [发布核验](../build/analysis/legacy-graphics-scratch-provenance-v1/validation.json)

<a id="wechat-devtools-local-tcp-validation"></a>

## 微信模拟器原生 TCP 与恢复核验

现有游客工程普通编译后取得两份 SDK 建连回执，分别返回 `-4` 和 `STREAM_CONNECT`。两个独立本机对端均零接入并已退出。实际方法探针确认 11 个 TCP 方法及四组回调注册和移除调用。微信适配器的 19 项受控回归通过。原工程 11 个文件复核相符，普通重编译产生原探针回执。真机及端到端 TCP 仍待验收。 [SDK 与本机对端](../build/analysis/wechat-devtools-local-tcp-v1/runtime.json) · [现有回归](../build/analysis/wechat-devtools-local-tcp-v1/launcher-wechat-regression.log) · [发布核验](../build/analysis/wechat-devtools-local-tcp-v1/validation.json)

<a id="f5a-close-ownership-validation"></a>

## 11 月版普通关窗与补丁句柄核验

复用 88 条 REA 记录并新增 7 条。19 个窗口的 822 条指令与原文件字节相符，核对 App 和 Frame 消息表、两个 Frame 指针字段、补丁句柄发布和析构，以及所选退出后的备份调用。实际 Windows 消息、子进程退出和平台联动继续按原范围验收。 [来源核验](../build/analysis/launcher-f5a-close-ownership-v1/source-review.json) · [发布核验](../build/analysis/launcher-f5a-close-ownership-v1/validation.json)

<a id="legacy-work-context-frame-order-validation"></a>

## 普通帧工作上下文到期核验

Item 复用 39 条 REA 记录并新增 6 条，另复用 SE 的四个函数档案。核对 Item 195 条及 SE 110 条原文件指令。用现有本机会话夹具执行三次单更新，实际观察到 1 毫秒、归零当次发送解除及查询、随后无重复请求。该差异已写入 D0/D3 的验收用例。原版运行、当前版本和三端设备接受继续待证。 [来源核验](../build/analysis/legacy-work-context-frame-order-v1/source-review.json) · [实际本机请求](../build/analysis/legacy-work-context-frame-order-v1/target-baseline.json) · [发布核验](../build/analysis/legacy-work-context-frame-order-v1/validation.json)

<a id="legacy-item-classic-work-recipe-validation"></a>

## 历史 Item 经典工艺的普通入口与配方核验

REA 复用 45 条记录并新增 9 个函数档案。Apple LLVM 对照 10 个函数体的 4,864 字节、1,306 条指令，核对 21 处直接调用、56 个字节锚点及工艺窗十项控件登记。复用经典帧、窗口退役与配方重查证据，核对普通输入、动态回调、回复写入和窗口清理。REA 会话已关闭。该结果覆盖固定历史样本的静态规格，原版运行、现行版本和三端接受待验。 [来源核验](../build/analysis/legacy-item-classic-work-recipe-v1/source-review.json) · [核验回执](../build/analysis/legacy-item-classic-work-recipe-v1/validation.json)

<a id="legacy-se-classic-work-entry-validation"></a>

## 固定 SE 经典技能窗普通与战斗入口的核验

REA 6.7.0 和 Ghidra 12.1.4 复用 4 份函数档案及 8 份派生视图。新增 `471110` 的完整 45 字节档案。REA 对 `48A2C0` 返回该地址无已定义函数，随后沿已证调用点在独立 Ghidra 工程核对两份战斗入口视图，共 239 字节。Apple LLVM 和原文件复核 15 个登记位置、105 个字节锚点及 34 处直接调用。 [来源核验](../build/analysis/legacy-se-classic-work-entry-v1/source-review.json) · [REA 查询与关闭](../build/analysis/legacy-se-classic-work-entry-v1/rea-session.log)

22 项现有工作、上下文和战斗输入回归通过。本地夹具另核首次打开、重复打开、实际槽选择及关闭列表时的解除请求。WK-T02、WK-T23、BF-T07 的新增组合为静态预期，原版、当前同版及目标产品待验收。 [回归](../build/analysis/legacy-se-classic-work-entry-v1/local-regression.log) · [对照](../build/analysis/legacy-se-classic-work-entry-v1/local-comparison.json) · [规格核验](../build/analysis/legacy-se-classic-work-entry-v1/validation.json)

<a id="legacy-item-album-mail-lifecycle-validation"></a>

## 历史 Item 的图鉴与邮件生命周期核验

新增 18 条完整 REA 记录和 11 个入口定位，复用 3 条 Item 记录及 SE 的原缓存规格。24 个范围的 12209 字节、3046 条指令、34 处直接调用、49 处锚点和 15 个字面量核对原文件。13 个合成用例覆盖空摘要组、较旧版本、重复详情、角色槽寻址及文件缺失后的入场次序。真实运行、缓存互操作与当前版适用性继续待验。 [来源与用例](../build/analysis/legacy-item-album-mail-lifecycle-v1/source-review.json) · [发布核验](../build/analysis/legacy-item-album-mail-lifecycle-v1/validation.json)

<a id="legacy-item-mail-history-validation"></a>

## 历史 Item 的邮件记录与未读优先级核验

新增 18 条完整 REA 记录和 4 个入口定位，复用 3 条同版缓存函数记录。25 个范围的 9534 字节、2640 条指令、85 处直接调用、32 处锚点和 14 个字面量均核对原文件。9 个合成用例覆盖记录移位、收发标记、家族缓存选槽和三类未读优先级。原版发件与服务端结算、长字段运行和当前版接受继续待验。 [来源与用例](../build/analysis/legacy-item-mail-history-v1/source-review.json) · [发布核验](../build/analysis/legacy-item-mail-history-v1/validation.json)

<a id="legacy-item-classic-window-reentry-validation"></a>

## 历史 Item 经典窗口重建核验

新增 10 条完整 REA 记录，复用 5 条。24 个范围的 2974 字节、784 条指令、30 个调用点及 50 处锚点均与固定样本对照。合成用例复现组内恢复顺序、其他选中标记清理、重建后重读子状态和计数回绕。原版运行和当前同版验收待验证。 [来源与用例](../build/analysis/legacy-item-classic-window-reentry-v1/source-review.json) · [发布核验](../build/analysis/legacy-item-classic-window-reentry-v1/validation.json)

<a id="legacy-item-window-one-restore-validation"></a>

## 固定 Item 的窗口恢复标记核验

REA 6.7.0 与 Ghidra 12.1.4 导出 106 条会话记录，其中 73 条由已有快照载入。用 LLVM 与原文件核对 10 个函数体和所选指令窗口，共 1,718 条指令、6,858 字节。27 处恢复标记引用中，7 处写入活动判断、5 处写零、15 处比较。4 项后续验收案例已登记，实际帧分派、当前版本和宿主验收待执行。 [静态核验](../build/analysis/legacy-item-window-one-restore-v1/source-review.json) · [验证回执](../build/analysis/legacy-item-window-one-restore-v1/validation.json)

<a id="battle-window-restore-order-validation"></a>

## 战斗延后动作和窗口恢复核验

复用 REA 6.7.0 与 Ghidra 12.1.4 的 14 个完整函数体及两处接收分派窗口。Apple LLVM 21.0.0 核对两份原 PE 的 4,101 条指令、31 处直接调用及主状态、战斗子状态和普通子状态的选择表。两项既有共享测试覆盖 `9/1` 退场请求和重新入场，均通过。两次恢复调用的组合用例和原版实际运行待执行。 [复算脚本](../build/analysis/battle-window-restore-order-v1/verify_source.py) · [来源核验](../build/analysis/battle-window-restore-order-v1/source-review.json) · [本机回归](../build/analysis/battle-window-restore-order-v1/focused-tests.tap)

<a id="legacy-scene-label-window-validation"></a>

### 历史 Item 和 SE 的场景提示核验

REA 6.7.0 与 Ghidra 12.1.4 复用 23 个完整函数及两份派生视图，补查 Item 的经典 39 回调。Apple LLVM 21.0.0 对照函数范围 16,551 字节、46 处直接调用、131 处锚点、29 个分支和四个独立字节范围。两版状态表、`Ta>` 常量及 `GetTickCount` 导入匹配。REA 会话已关闭。 [来源和偏移](../build/analysis/legacy-window-restore-overlay-v1/source-review.json)

十项静态组合用例核对恢复优先级、分配回退、到期和 32 位回绕。现有场景、共享帧时钟和战斗返回的 43 项本机回归通过。原版和三端的组合用例、当前版及第二套窗口分派仍待验证。 [静态用例](../build/analysis/legacy-window-restore-overlay-v1/source-cases.json) · [本机回归](../build/analysis/legacy-window-restore-overlay-v1/local-regression.log) · [发布核验](../build/analysis/legacy-window-restore-overlay-v1/validation.json)

<a id="legacy-item-work-retirement-validation"></a>

## 历史 Item 工作窗口退役核验

保留前次 10 条 REA 记录，增加 29 条。核对另一套窗口表、经典控件表、状态选择表、八个回调的入口及非活动分支和七个相关函数，共 1571 条原文件指令。11 处解除调用、六个局部对象指针和窗口 27 的关闭请求已与原字节对照。16 项现有工作上下文及工作动作回归通过。真实帧分派和三端运行仍待。 [源核验](../build/analysis/legacy-item-work-retirement-v1/source-review.json) · [回归记录](../build/analysis/legacy-item-work-retirement-v1/focused-regression.log)

<a id="mobile-safari-resource-archive-validation"></a>

## 移动 Safari 实际 ZIP 核验

以相同归档哈希、选定目录和桌面像素摘要运行 iOS 27.0 模拟器。两份资源库各读到 1072 项索引。范围服务完成计数、Safari 接收字节和两份归档的读取计数相符。两张参考帧 SHA-256 相符，退役与临时模拟器清理均有回执。归档共享核心与网页适配器的 41 项现有回归通过。真机内存、产品换版和完整玩法仍待验收。 [原始运行](../build/analysis/mobile-safari-resource-archive-v1/runtime.json) · [回归记录](../build/analysis/mobile-safari-resource-archive-v1/focused-regression.log)

## 全能力规格排程复核

从能力矩阵逐项核对 40 个需求，确认 19 项固定样本本域规格可复用，当前六组排程各覆盖其余 21 项一次。X02、X03、X06 的直接依赖方分别为 8、4、5 项。需求、依赖、来源版本、A1–A4 分析准入和 D0–D6 开发批次以原矩阵及计划为准。产品测试与真实环境接受仍按各能力的验收条件记录。 [当前排程](development-plan.md#capability-first-scheduling) · [能力矩阵](../analysis/capability-first-v1/capability-matrix.json) · [本轮核对](../build/analysis/launcher-edit-focus-v1/validation.json)

2026-11-12 复核了首页、需求索引及机器计划指向的排程。取证按共同规则合批，按具体材料条件恢复待证项。交易与仓储既有回执的 101 个来源视图中，52 个为复用的原分析入口，43 个为复用的派生视图。整体节时仍待批次实测。统一分析门槛待通过，本轮核验范围为流程与文档。 [机器计划](../analysis/capability-first-v1/implementation-plan.json) · [来源复用记录](../analysis/capability-first-v1/game-trade-storage-validation.json)

条件模板核验复用 178 条 REA 记录，新增 5 条。三项模板资源与 F5A 对照一致，两个版本所选构造、析构及相关位置的 76 条指令均核对原字节。CE-U1 的实际加载待验证，统一分析门槛尚待完成。 [源核验](../build/analysis/launcher-conditional-template-scope-v1/source-review.json) · [发布核验](../build/analysis/launcher-conditional-template-scope-v1/validation.json)

<a id="f5a-candidate-lifecycle-validation"></a>

## 11 月分发版的候选解析与期限核验

新增 9 条完整 REA 记录，复用 5 条。17 个范围的 5566 字节及 1633 条指令与固定映像对照，核对 22 处直接调用、71 处指令锚点和 10 项导入。13 个合成用例覆盖候选环回、截止前后与回绕、无结果和空结果、重试优先及引用释放顺序。真实 Windows 调度、登录与游戏交接继续待验。 [来源与用例](../build/analysis/launcher-f5a-candidate-lifecycle-v1/source-review.json) · [发布核验](../build/analysis/launcher-f5a-candidate-lifecycle-v1/validation.json)

<a id="launcher-login-timer-dispatch-validation"></a>

## C82 和 F5A 登录计时器及普通退出核验

在两份固定 PE 上核对 6 个消息表行、193 处指令位置及 9073 字节的函数范围，共 2528 条指令。两份 REA 快照的 242 条原记录均保留，新增 10 个函数档案。复用 6 个原完整函数档案和 4 个组合视图，另核 C82 两个早期批量伪代码结果与完整档案一致。 [样本、范围与偏移](../build/analysis/launcher-login-timer-dispatch-v1/source-review.json)

24 个合成用例核对静态分支的解释，5 个用例调用现有会话与调度模块。两套现有 Node 测试共 46 项通过，包含本机回环夹具。原 Windows 计时器和提示投递、三端产品及同版会话留待实际验收。 [合成与本地对照](../build/analysis/launcher-login-timer-dispatch-v1/focused-probe.json) · [测试日志](../build/analysis/launcher-login-timer-dispatch-v1/focused-tests.log) · [发布核验](../build/analysis/launcher-login-timer-dispatch-v1/validation.json)

<a id="launcher-ordinary-exit-confirmation-validation"></a>

### 两版普通退出的共用取证

复用 14 份 REA 档案和范围记录。对固定映像重核 8 条消息登记、319 条所选窗口指令及其中 103 处断言。直接复用本机流的两组旧关闭回执和原创 Windows 模态夹具。后者覆盖受控消息投递，实际两版退出提示的原程序投递和重新绑定仍由 LS-T19 至 LS-T21 验收。此次从固定样本归入一份会话规格，新增 REA 查询为 0。 [原字节、复用记录和对照](../build/analysis/launcher-exit-confirmation-order-v1/source-review.json) · [范围与引用核验](../build/analysis/launcher-exit-confirmation-order-v1/validation.json) · [流程](development-plan.md#capability-first-workflow)

<a id="f5a-disconnect-retry-validation"></a>

## 11 月分发版的断线重试与错误结果核验

保留前次 36 条 REA 记录，新增 33 条。核对 6 处 REA 字节读取、19 个函数档案的已报告范围和 10 个原文件指令窗口，共 2136 条指令。对照两版状态表、关闭回调尾部、11 月版定时器及结果接收尾部。现有迟到事件、回包后超时、截断 EOF、取消和微信隐藏的 5 项回归通过。新规则的真实 Windows 消息顺序、会话重绑和联合接受仍待。 [来源核验](../build/analysis/launcher-f5a-callback-retirement-v1/source-review.json) · [回归记录](../build/analysis/launcher-f5a-callback-retirement-v1/focused-regression.log)

<a id="f5a-pump-retirement-validation"></a>

## 11 月版连接维护与退役核验

REA 6.7.0 与 Ghidra 12.1.4 复用 10 份函数档案，新增 `595590`、`598EA0`、`596B60`、`598940` 四份。Apple LLVM 21.0.0 对照 14 个函数档案与 20 个选定范围，共 3,864 字节、1,198 条指令。另核 31 处直接调用、86 处锚点、6 项导入及三个分派绑定。函数范围与另取窗口按各自范围计，所选异常续体保留独立窗口。 [来源核验](../build/analysis/launcher-f5a-pump-retirement-v1/source-review.json)

两组原创内存流用例分别使旧连接的迟到关闭成功和失败。在旧回执到达前，旧会话已取消，新会话已读入自己的等待阶段。旧读完成被丢弃，回执只更新旧会话。45 项现有本地回归通过。本次覆盖固定样本静态路径和现有本机会话，原版提示送达、新绑定、三端实际关闭及官服联合验收仍待验证。 [本机结果](../build/analysis/launcher-f5a-pump-retirement-v1/local-close-receipts.json) · [回归日志](../build/analysis/launcher-f5a-pump-retirement-v1/local-regression.log) · [核验回执](../build/analysis/launcher-f5a-pump-retirement-v1/validation.json)

<a id="f5a-login-owner-validation"></a>

## 11 月分发版的提交、投递与错误恢复核验

比对模板 133 和 11 个连续消息表行。REA 导出 34 条记录，其中 18 个函数档案，对照 17 个函数体的 2417 条原文件指令。按源分支核对编号回绕、首次投递、投递失败、陈旧消息和匹配后消费。现有会话迟到事件、回包后超时和微信取消的 3 项回归通过。实际 Windows 消息队列和真实同版会话仍待验收。 [来源核验](../build/analysis/launcher-f5a-login-owner-v1/source-review.json) · [静态用例](../build/analysis/launcher-f5a-login-owner-v1/source-derived-cases.json) · [阶段核验](../build/analysis/launcher-f5a-login-owner-v1/validation.json)

<a id="windows-launcher-modal-dispatch-validation"></a>

### Windows 主窗模态消息核验

复用固定 F5A 的 5 个 REA 函数档案，核对 `0x8242` 入口、普通 IDOK 记录、两项窗口检查和提示后恢复调用。Windows 11 ARM64 来宾执行原创夹具一次，取得九行输出和 `$LASTEXITCODE=0`。四条编号记录分别核对提示中的旧编号与匹配编号、返回后按钮恢复前与恢复后的状态。原光盘和桌面已核对。实际登录器的生产、重绑和旧会话退役待验收。 [来宾事件](../build/analysis/windows-launcher-modal-v1/guest-events.jpg) · [证据核对](../build/analysis/windows-launcher-modal-v1/source-review.json) · [环境回执](vm-environment.md#guest-launcher-modal-dispatch)

<a id="launcher-list-activation-validation"></a>

## 两版登录器的列表选择与确认核验

两份模板、6 条消息表记录、2 个跳转目标及 47 条指令与固定映像对照。REA 分别导出 4 条记录，复用 C82 的选择变更记录和已有模态规格。核对网页与微信的四个入口源文件。微信宿主的两项现有选择回归通过。实际 Windows 消息、模态重绑及三端激活继续验收。 [来源核验](../build/analysis/launcher-list-activation-v1/source-review.json) · [阶段记录](../build/analysis/launcher-list-activation-v1/validation.json)

<a id="battle-266-projectile-row-validation"></a>

## SKL266 变体 2 的结果复制核验

复用 6 个固定源函数，REA 新核 7 个指令位置与 1 条调用引用。对照 5 个动作表项和 1615 条原文件指令。用合成动画信号驱动现有动作 15 投射入口，确认当前第四格 0 和按源规则提供的 100040 均原样进入投射物，第二行和终止位置符合预期。投射、RID 归属及自身结果的 3 项现有回归通过。完整原版回放、首个 RID 前的栈值和当前版等价仍待。 [原字节核验](../build/analysis/battle-266-projectile-row-v1/source-review.json) · [共享入口对照](../build/analysis/battle-266-projectile-row-v1/focused-probe.json) · [阶段核验](../build/analysis/battle-266-projectile-row-v1/validation.json)

<a id="battle-266-source-admission-validation"></a>

## SKL266 变体 2 的预检准入核验

新增 7 个 REA 字节窗，复用 4 个规范函数和既有派生命令管理器。9 个范围的 417 条指令、27 处调用、19 个跳转及 24 处锚点与原文件对照。5 个原创字段用例核对角色依赖和现有计划结果，另运行 6 项现有 SKL266 回归。完整原版播放、首次暂存值及当前版继续待验。 [来源与用例](../build/analysis/battle-266-source-admission-v1/source-review.json) · [发布核验](../build/analysis/battle-266-source-admission-v1/validation.json)

<a id="legacy-item-keyboard-frame-validation"></a>

## 历史 Item 键盘生产、消费与清理核验

REA 新增四个函数档案和六条引用或定位记录。复用窗口过程、状态分派、经典帧及图鉴匹配器来源。对照四个跳转表项和 740 条反汇编指令的原文件字节，复核首次按下、重复、松开、同帧轻按和窗口激活后的状态序列。现有指针及帧时钟的四项回归通过。原版键盘运行、图鉴正常帧调用和当前版适用性仍待。 [来源核验](../build/analysis/legacy-item-keyboard-frame-v1/source-review.json) · [静态序列](../build/analysis/legacy-item-keyboard-frame-v1/source-derived-cases.json) · [阶段核验](../build/analysis/legacy-item-keyboard-frame-v1/validation.json)

<a id="f5a-distribution-validation"></a>

## 11 月分发版与原版普通进程创建核验

两个 ZIP 的 CRC 和登录器记录通过比对。两份目录 XML 逐字节匹配此前留存值，当前更新清单中的五个程序大小和 MD5 与留存程序相符。REA 导出 13 条记录，五个所选函数有来源档案。另核对 1482 条独立反汇编指令的文件字节，覆盖启动主函数、前检、调用位置和所选映射帮助函数。Windows 实际创建、游戏读取和联合接受继续待验证。产品保持 stage306，本轮验证范围为来源和规格。 [来源核验](../build/analysis/current-official-launcher-package-v1/source-review.json) · [阶段核验](../build/analysis/current-official-launcher-package-v1/validation.json)

<a id="f5a-resource-arguments-validation"></a>

## 11 月分发版文件搜索与现有参数入口核验

复用上轮的枚举调用者档案，补六个 REA 函数。七个函数体共 2632 字节，含所选表和帮助函数在内核对 1036 条指令的文件字节。正序与逆序各从 2367 条路径匹配 28 个文件，参数尾部均为 480 字节，各组保留提供顺序。现有启动计划的 14 项回归通过。合成夹具复核了索引 0 的下划线差异，以及网页长名入口和共享匹配行入口的短名用例。实际 Windows 文件系统与同版游戏接受仍待。 [来源核验](../build/analysis/launcher-f5a-resource-arguments-v1/source-review.json) · [本地夹具](../build/analysis/launcher-f5a-resource-arguments-v1/focused-probe.json) · [阶段核验](../build/analysis/launcher-f5a-resource-arguments-v1/validation.json)

<a id="f5a-resource-title-bytes-validation"></a>

复用两条文件名来源记录，新增两条 REA 函数记录。六段原文件共核对 481 字节、172 条指令。两组原创字节用例以小写后的缓冲区为输入，复现命中双字节尾部和命中随后独立下划线的差别。现有共享入口的 ASCII 对照得到 `graphicbin:01`，含 `81 5F` 的文件名返回 `RESOURCE_NAME`。 [来源与用例回执](../build/analysis/launcher-f5a-title-bytes-v1/source-review.json)

<a id="windows-installed-resource-enumeration-validation"></a>

一次来宾采集返回 38 行，转录后 SHA-256 与来宾对原数组计算的摘要相符。核对七组 28 个长名、26 个非空短名和逐组结束结果。按原序通过共享启动计划，参数尾部为 480 字节，套用已核身份的随包配置后，42 条历史资源路径与参考一致。实际运行的范围为 Windows 枚举采集器和本机共享入口。F5A 自身的大小写环境、仅短名实际命中及同版游戏读取继续待验。 [来宾结果](../build/analysis/windows-resource-enumeration-v1/guest-output.txt) · [端到端对照](../build/analysis/windows-resource-enumeration-v1/source-review.json)

<a id="f5a-startup-code-page-validation"></a>

复用三条 REA 函数记录，新增十二条。独立解码和原文件核对覆盖 20 段、2538 字节、906 条指令，另核 22 个相对分支、四处导入和启动表。两组原创字节用例以小写后的标题为输入，分别覆盖 `info` 从双字节尾部出现和从下一字符开始的结果。F5A 实际运行中的有效 locale 仍待采集。 [来源、用例及结果](../build/analysis/launcher-f5a-code-page-v1/source-review.json)

<a id="f5a-normal-startup-locale-selection-validation"></a>

## F5A 普通启动与线程选表核验

REA 6.7.0、Ghidra 12.1.4 复用 5 份函数档案，新增 9 段 261 字节、两条表项及调用引用。两处指令的函数查询未返回归属，按表指针和原码核对实际入口。Apple LLVM 21.0.0 对照 18 段 2,140 字节及 62 条指令，核两张初始化表的次序。REA 会话已关闭。 [原字节和证据](../build/analysis/launcher-f5a-startup-locale-selection-v1/source-review.json)

5 组静态推导用例覆盖正常复用、首次失败后恢复、两次失败、共享表刷新及线程表保留。34 项现有本机编码、启动参数与资源枚举回归通过。真实 F5A 的生效表与当前同版读取继续沿 L07/X07 验收。 [现有测试](../build/analysis/launcher-f5a-startup-locale-selection-v1/local-regression.log) · [核验回执](../build/analysis/launcher-f5a-startup-locale-selection-v1/validation.json)

## C82 登录错误提示与主窗控件核验

重新读取模板 133、四个控件、消息表和九项相关 USER32 导入。18 段代码共 496 条指令与固定分析映像匹配。三项既有回归核对迟到会话事件、已结束回包后的事件和微信宿主取消。原 Windows 的提示、输入、退出和完整三端会话仍待实测。 [来源核验](launcher-static.md#c82-owned-login-error) · [阶段核验](../build/analysis/launcher-owned-login-error-v1/validation.json)

## 固定 SE 的 SKL266 暂存与共享结果对照

REA 定位注册引用与两个字节窗口，复用原派生回调核对 905 条指令的边界和字节。原创混合序列经实际共享解码和计划入口，核出普通结果第四格为 0、自身尾部保留最后外部 RID 的后两项，缺外部上下文返回未支持。原自身结果与护卫的 5 项回归通过。原版实际栈值、普通结果后续消费者和完整目标接受仍待验证。 [来源与边界](game-static.md#battle-266-rid-frame) · [阶段核验](../build/analysis/battle-266-rid-frame-v1/validation.json)

<a id="battle-rid-callback-reuse-validation"></a>

## 固定 SE 的战斗暂存与调度复核

复用四个完整 REA 函数体、派生命令回调与管理器，以及已有 SKL266 栈访问记录。Apple LLVM 与原 PE 核对四个函数的 2,069 条指令、所选回调的 377 条及管理器的 38 条。用起始相位 0、1、3 核对相邻独立命令的首次解析序号。实际栈值、回调间覆盖及完整原版回放待验证。本次为静态规格核验。 [来源回执](../build/analysis/battle-rid-callback-reuse-v1/source-review.json) · [工作区核验](../build/analysis/battle-rid-callback-reuse-v1/validation.json)

<a id="battle-result-scratch-writers-validation"></a>

## 固定 SE 的换身与附件暂存核验

复用 REA 6.7.0 与 Ghidra 12.1.4 的六个被调用函数、405 预检及派生战斗回调。Apple LLVM 核对 283 条所选回调指令的 1,020 字节和六个被调用函数的返回约定。按实参栈深度核对两条附属资源写入、普通结果第四格与两条倒计时路径。共享核心的 SKL404、SKL405 现有六项专项回归通过。原版跨帧实际读值和三端完整回放待验。 [来源核验](../build/analysis/battle-result-scratch-writers-v1/source-review.json) · [回归记录](../build/analysis/battle-result-scratch-writers-v1/focused-regression.log) · [阶段核验](../build/analysis/battle-result-scratch-writers-v1/validation.json)

<a id="battle-receive-scratch-overlap-validation"></a>

## 固定 SE 的收包清理与战斗栈范围核验

REA 6.7.0 与 Ghidra 12.1.4 新取栈保留函数，复用六个函数体及派生回调。Apple LLVM 21.0.0 核对 1,787 条函数体指令、25 条派生回调指令、两张分派表中的三项及三处导入跳板。用共同调用基准复算三个四字节范围和接收前缀的起止边界。REA 已导出并关闭。现有七项技能 266 与相邻输入回归通过，覆盖的是本地共享实现。原版首次读取值和三端回放待验。 [可复算证据](../build/analysis/battle-receive-scratch-overlap-v1/source-review.json) · [复算脚本](../build/analysis/battle-receive-scratch-overlap-v1/verify_source.py) · [本地回归](../build/analysis/battle-receive-scratch-overlap-v1/focused-tests.tap)

<a id="battle-266-cleared-frame-read-validation"></a>

## 固定 SE 所选清零帧的首次读取核验

复用 22 份已有函数体，用 REA 6.7.0 与 Ghidra 12.1.4 补取一份结果追加函数。Apple LLVM 21.0.0 核对 2,603 条函数体指令、406 条所选命令指令及 12 条管理对象指令。REA 已导出并关闭。静态复算与两个原创共享入口用例均可复现。普通结果得到 `[12,1,3,0]`，仅自身 RID 在现有计划中提前返回。原版实际读取、其他帧、三端回放及当前同版待验。 [来源回执](../build/analysis/battle-266-initial-read-v1/source-review.json) · [静态复算](../build/analysis/battle-266-initial-read-v1/verify_source.py) · [共享用例结果](../build/analysis/battle-266-initial-read-v1/focused-probe.json)

<a id="battle-266-audio-map-save-validation"></a>

## 固定 SE 曲目配置保存与战斗暂存核验

使用本机 REA 6.7.0 与 Ghidra 12.1.4，补取保存和编码两个函数，核对曲目请求字的引用及三处调用归属。静态复算核对 12 个函数体，其中 10 个复用自已留存记录，另核 18 条直接调用或尾调用。REA 已导出并关闭。 [REA 回执](../build/analysis/battle-266-audio-map-save-v1/rea-session.json) · [证据与复算](../build/analysis/battle-266-audio-map-save-v1/source-review.json)

8 个合成用例覆盖禁用或安静时的保留、相同曲目清请求、不同曲目的两组编码、打开文件失败，以及后续 404 或 405 的覆盖顺序。四份现有战斗与音频测试共 25 项通过。本轮核验覆盖固定样本条件分支与本机回归。后续补核了普通入战时旧请求的有效范围，实际首读和当前同版留在原用例。 [回归日志](../build/analysis/battle-266-audio-map-save-v1/local-regression.log) · [发布核验](../build/analysis/battle-266-audio-map-save-v1/validation.json) · [入战继续核验](#battle-entry-audio-request-validation)

<a id="battle-entry-audio-request-validation"></a>

## 固定 SE 普通地图换曲请求的入战顺序核验

本机 REA 6.7.0 与 Ghidra 12.1.4 补取相位字、主状态字和显式状态写入器的三组引用，复用 11 份完整函数记录。原 PE 对照 24 条调用和四组所选跳转表项。REA 已导出并关闭。 [原指令与引用](../build/analysis/battle-entry-audio-request-v1/source-review.json) · [会话回执](../build/analysis/battle-entry-audio-request-v1/rea-session.json)

8 组原创相位输入与 6 组连续入战输入复算通过。不同曲目按启用的维护时点可在 `9/4`、等待结束的 `9/5` 或 `10/0` 背景捕获前触发保存。到 `10/0` 仍关闭声音时，首次捕获清除请求，后续启用声音仍保留这一清除结果。四份现有本机入场和音频测试共 33 项通过。原版实际首读、跳过清零后的旧字节和其它宿主写入继续按 BF-U1 验证。 [复算脚本](../build/analysis/battle-entry-audio-request-v1/verify_source.py) · [本机回归](../build/analysis/battle-entry-audio-request-v1/local-regression.log) · [发布核验](../build/analysis/battle-entry-audio-request-v1/validation.json)

<a id="battle-266-same-frame-validation"></a>

## 固定 SE 战斗命令的同帧写入核验

固定样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。桌面 REA 通道关闭后，使用现有 REA 6.7.0、Ghidra 12.1.4 和本机 Java 21 进行两次精确引用查询，会话已关闭。Apple LLVM 21.0.0 逐项核对 16 处引用、13 份复用函数档案，以及两条所选生产者路径的 897 条指令和 3,433 字节，另核 404 的非 RID 游标恢复。 [来源回执](../build/analysis/battle-266-same-frame-v1/source-review.json)

12 个原创组合在现有共享帧入口核对两种前序技能、三种聊天时长及两种 266 结果。首轮缺聊天图标资源的夹具报错，复用已有原创图标和变身资源后通过。第 24 次回调确认前序技能先执行，普通第四格依旧为 0，仅自身 RID 返回既有的缺上下文结果。另有 12 项现有本地回归通过。原版数值是按静态前提推导，实际原版执行、当前同版和三端回放待验。 [组合对照](../build/analysis/battle-266-same-frame-v1/focused-probe.json) · [现有回归](../build/analysis/battle-266-same-frame-v1/focused-regression.log) · [交付核验](../build/analysis/battle-266-same-frame-v1/validation.json)

<a id="battle-266-adjacent-frame-validation"></a>

### 固定 SE 战斗相邻帧核验

REA 6.7.0 与 Ghidra 12.1.4 对 `D19020` 新取一次精确引用，返回读和写两处，已导出并关闭会话。复用 20 份 REA 函数档案。Apple LLVM 21.0.0 对照原文件的 13,825 字节和 3,760 条函数体指令，另核两条阶段 1 等待路径的 631 字节、141 条指令。复算八种起始计数及 17 个接收前缀边界。 [原件、引用和复算](../build/analysis/battle-266-adjacent-frame-v1/source-review.json)

八条静态组合覆盖两种前序技能、计数非零、就绪零、下一帧清零及生产者帧先清零。12 个既有共享组合重跑后与原结果逐字节一致，125 项相关本机回归通过。窗口和其它对象中间写入、长前缀后的分派、实际原版读值及三端产品继续待验。 [共享对照与静态推导](../build/analysis/battle-266-adjacent-frame-v1/source-review.json) · [回归日志](../build/analysis/battle-266-adjacent-frame-v1/focused-regression.log) · [范围核验](../build/analysis/battle-266-adjacent-frame-v1/validation.json)

<a id="battle-classic-input-window-frame-validation"></a>

### 固定 SE 战斗指令窗的关闭与退役核验

沿同一固定 SE 样本，REA 6.7.0 和 Ghidra 12.1.4 新取两次槽位及状态引用，导出后关闭会话。复用 11 份 REA 函数档案，由 Apple LLVM 21.0.0 核对 10,282 字节和 2,840 条指令。另核 436 字节、110 条指令的前置回调及 10 处所选数据引用，复算两种后续阶段的 18 次窗口遍历。 [可重跑的来源核验](../build/analysis/battle-266-classic-window-frame-v1/source-review.json) · [REA 记录](../build/analysis/battle-266-classic-window-frame-v1/rea-evidence.json)

两组原创本机对照分别等待回放及立即取得回放记录。超时后各推进 18 帧，菜单均保持状态 2、位移和速度为零。13 项现有输入与回放回归通过。首轮手写复入循环的帧数错误已按原夹具固定为 56 帧，重新取得两组结果。原版实读、活动绘制下层与三端验收仍待核。 [本机对照](../build/analysis/battle-266-classic-window-frame-v1/focused-probe.json) · [现有回归](../build/analysis/battle-266-classic-window-frame-v1/focused-regression.log)

<a id="fixed-se-battle-window-target-selection-validation"></a>

### 固定 SE 战斗窗的技能选择与文字核验

REA 6.7.0 和 Ghidra 12.1.4 记录三组引用和四段读取，共 259 字节。一字节来自 PE 虚拟尾部的静态内存。复用七份完整函数档案及五份派生回调。Apple LLVM 21.0.0 核对 120 处选定指令、窗 26 三个控件和窗 10 的改绑范围。REA 证据已导出，会话已关闭。 [来源与原指令](../build/analysis/fixed-se-battle-window-target-selection-v1/source-review.json) · [REA 记录](../build/analysis/fixed-se-battle-window-target-selection-v1/rea-evidence.json)

stage306 以正常共享战斗入口运行模式 3 与 4。两组选择技能后均进入目标选择，语义返回后技能序号为 −1、目标位清零，提交 escape 均返回 `LEGACY_BATTLE_INPUT_NOT_READY`。51 项既有本机输入、帧与呈现测试通过。原版入队的实际画面、同版回执及产品组合待验。 [两组对照](../build/analysis/fixed-se-battle-window-target-selection-v1/local-comparison.json) · [回归日志](../build/analysis/fixed-se-battle-window-target-selection-v1/local-regression.log) · [发布核验](../build/analysis/fixed-se-battle-window-target-selection-v1/validation.json)

<a id="fixed-se-battle-skill-list-admission-validation"></a>

### 固定 SE 两种战斗技能列表的核验

REA 6.7.0 与 Ghidra 12.1.4 的九段字节查询、三组地址引用以及一次活动样本核对已导出，实际查读共 2,444 字节。复用四份完整函数档案和两段接收函数证据。Apple LLVM 21.0.0 核对 41 处原文件指令。REA 会话已关闭。 [取证与原字节核验](../build/analysis/fixed-se-battle-skill-list-admission-v1/source-review.json)

stage306 的共享战斗输入在两种模式均拒绝资格位清零和 MP 不足，等额时进入目标选择，发出 `0x33` 且暂不发送指令。现有资格位失败为语义拒绝，无 `0x37`。51 项已有输入、帧和呈现测试通过。原版实际点击、滚动重入与三端完整流程待验。 [两组对照](../build/analysis/fixed-se-battle-skill-list-admission-v1/local-comparison.json) · [回归日志](../build/analysis/fixed-se-battle-skill-list-admission-v1/local-regression.log) · [发布核验](../build/analysis/fixed-se-battle-skill-list-admission-v1/validation.json)

<a id="battle-266-self-guard-context-validation"></a>

### 固定 SE 的自身护卫结果核验

复用 9 个函数体及已有派生回调。REA 6.7.0 与 Ghidra 12.1.4 补核 9 处指令，Apple LLVM 21.0.0 对照所选回调的 1,036 字节、292 条指令和 9 个函数的 1,239 字节、395 条指令。五个源指令投影覆盖独立护卫、同槽、清零、既有外部 RID 及无 RID。REA 已关闭。 [来源、实参和结果行](../build/analysis/battle-266-self-guard-context-v1/source-review.json)

六个原创输入经现有共享解码和计划核对，57 项既有自身结果和护卫本地测试通过。原版同槽及无飞行目标的实际推进、同版和三端产品用例待验。 [本地比较](../build/analysis/battle-266-self-guard-context-v1/focused-probe.json) · [专项回归](../build/analysis/battle-266-self-guard-context-v1/local-self-guard.log) · [交付核验](../build/analysis/battle-266-self-guard-context-v1/validation.json)

<a id="battle-266-return-order-validation"></a>

### SKL266 返程测距与护卫退役核验

REA 6.7.0 和 Ghidra 12.1.4 核到 `40C4CE` 调 `419FD0`，复用 1 份完整分派档案与 9 个原字节窗口。Apple LLVM 21.0.0 对照 13 段、1,265 字节和 366 条指令，另核 25 条调用、14 条分支和 39 处指令。 [来源、距离和静态用例](../build/analysis/battle-266-return-order-v1/source-review.json)

14 个原创受控回调用例覆盖 19、20、59、60，及第一次接近后距离变化、护卫与施法者同槽、无护卫和等待到达。现有物理队列测试 67 项通过。受控夹具核对现有共享实现的回调结果，实际原版同回调退役、恢复、同版与三端产品沿 BF-T36 验收。 [共享回调结果](../build/analysis/battle-266-return-order-v1/local-projection.json) · [回归日志](../build/analysis/battle-266-return-order-v1/local-regression.log) · [发布核验](../build/analysis/battle-266-return-order-v1/validation.json)

## 微信模拟器双槽缓存和 App 重开

基础库 3.18.0 实测同一 App 的主包与普通分包共享写入者。重叠请求、过期修订、两页读回、60 字节候选、重开恢复和修订 3 修复均有回执。逐字节核对 5 个完整槽文件及 1 个候选前缀。原缓存 7 项回归通过，原测试工作区 11 个文件已恢复。完整宿主用例、真机和真实中断仍待验证。 [原始回执和核验](../build/analysis/wechat-sdk-slot-store-v1/runtime.json) · [发布核验](../build/analysis/wechat-sdk-slot-store-v1/validation.json)

<a id="wechat-sdk-cache-recovery-validation"></a>

## 微信缓存重建与迟到回执核验

两个游客模拟器用例验证了重建同号覆盖和真实写入回调迟到后的读回。核对 16 个探针构建输入、SDK 写出的原始回执、11 个恢复文件及 3 个已清理的原创槽。现有微信资源缓存回归 7 项通过。自然淘汰、进程崩溃、完整产品发布与真机继续验收。 [原始结果](../build/analysis/wechat-sdk-cache-recovery-v1/runtime.json) · [发布核验](../build/analysis/wechat-sdk-cache-recovery-v1/validation.json)

## 微信开发者工具的本机 SDK 验收

独立游客项目在微信开发者工具 2.02.2609250 上运行，文件回执确认基础库 3.18.0。补齐两个页面配置后自动编译。核验了 18 项回执、八组定位读取、重命名文件的完整 1 MiB 内容、Canvas 像素及前台帧回调。进入第二页再返回后，回执包含九个生命周期事件，待完成 I/O 数为 0。TCP、真机和完整产品用例待执行。 [运行回执](../build/analysis/wechat-offline-sdk-v1/runtime.json) · [执行记录](../build/analysis/wechat-offline-sdk-v1/execution-record.json) · [规格](architecture-and-milestones.md#wechat-devtools-offline-sdk)

## iOS 模拟器 Safari 的后台与进程重开

同源文档的两版数据、旧读者租约、后台收包与回到前台后的读取均经原生运行核对。两次发布报告 `strict`，Safari 进程重开后读回活动版本及两版回执。核对了两个 Safari PID、页面身份及设置前台截图。Xcode 首次启动准备停住后，使用已安装的 CoreSimulator 1174.9.2 完成运行。临时模拟器已关机并删除，本机服务已关闭。 [运行](../build/analysis/mobile-safari-resource-lifecycle-v1/runtime.json) · [设备回执](../build/analysis/mobile-safari-resource-lifecycle-v1/simulator-receipt.json) · [规格](architecture-and-milestones.md#mobile-safari-resource-lifecycle)

## 桌面浏览器配额拒写与重试

真实 Chrome 观察到准备、发布及后续 Blob 块事务的原生 `QuotaExceededError`。两次原子事务的所选写请求均报告成功，随后收到中止事件。逐块写入的首块收到完成事件，第二块中止，重开后仅首块留在候选根。恢复配额并重开后，准备和发布分别重试成功。重复发布读回同一回执。旧根按读者租约回收，临时浏览器配置和本机服务已清理。 [原始运行](../build/analysis/browser-update-quota-v1/runtime.json) · [规格和范围](architecture-and-milestones.md#browser-update-quota)

## Item 鼠标事件与窗口恢复的静态核验

复用 118 条 REA 记录，新增 30 条记录后导出并关闭会话。独立核对 24 个完整函数、15,533 字节、3,627 条指令边界、19 个直接调用和 6 个消息或状态表项。消息表按原指令的基数计算，双击的两次写入按汇编确认先后。原版运行、目标用例与设备验收待执行。 [来源核验](../build/analysis/legacy-item-window-admission-v1/source-review.json)

## 桌面浏览器流的实际写入与连接生命周期

真实 Chrome 和现有回环桥核对了 3 条 TCP 连接。第一条写入逐字节匹配并到期关闭，第二条接收数据后经读取消实际关闭，第三条独立接收数据并读到 EOF。临时浏览器目录已清理，TCP 服务已关闭。页面真实状态为可见，命令间隔中的帧和读回调已记录。

前两次试验分别在等待冻结事件和要求长帧间隔时停止。最终试验核对了实际页面状态和调用结果，完整本机传输检查通过。 [原始运行](../build/analysis/browser-stream-lifecycle-v1/runtime.json) · [规格与验收边界](network-portability.md#desktop-stream-lifecycle)

<a id="battle-detached-rid-context-validation"></a>

## 106 与 116 独立结果身体核验

复用 8 个完整 REA 函数和动作分派体的 8 段指令。2,297 字节、688 条指令边界、18 处直接调用与固定 PE 相符。另核四个动作表项、结果队列尺寸、下一行哨兵及 105 游标的映像零填充。

既有独立 RID 套件 36 项通过，包含 106 反射结果、非反射 106 和低等级 116 的提交前拒绝。来源验证提供静态查找和重叠字段，原版运行值和恢复待验。 [来源核验](../build/analysis/battle-detached-rid-context-v1/source-review.json)

## 历史资源交接和桌面工作集核验

Chrome 156.0.8078.80 实际通过浏览器选中的 ZIP 完成两份资源目录初始化。三种输入都得到既有七槽和调色板路径，两次 64×48 帧 SHA-256 匹配。第二次在第一份资源库和 ZIP 端口关闭后执行。已记录各初始化、就绪及退役样点。归档 SHA-256 前后一致，临时浏览器目录已清理。

首轮夹具的配置合并函数导入路径有误，改用定义模块后运行通过。Windows 来宾回显没有成功，当前同版客户端及实际枚举仍待核验。 [原始运行](../build/analysis/legacy-resource-handoff-v1/runtime.json) · [来宾回执](../build/analysis/legacy-resource-handoff-v1/windows-access.json)

## C82 七组资源参数核验

REA 新增 9 个完整函数并复用 2 个留存函数。固定 PE 的 2,779 字节、997 条指令边界、11 处直接调用及 5 处导入调用相符。REA 保存 184 条记录后关闭。安装包 28 个候选逐一核对长度和 SHA-256。

两种文件顺序均用网页目录适配器处理全量 2,367 条路径，并经过现有共享计划核对 28 个标题及参数字节。两组既有目标测试共 28 例通过。C82 的路径长度和标题边界依据静态来源，Windows 实际枚举和当前游戏消费待验。 [来源核验](../build/analysis/launcher-resource-arguments-v1/source-review.json) · [现有入口实测](../build/analysis/launcher-resource-arguments-v1/focused-probe.json)

<a id="browser-resource-cache-interruption-validation"></a>

## 现有网页资源缓存的中断核验

Chrome 156.0.8078.80 与 Playwright 1.64.1 直接加载现有模块，使用同源双页和真实 IndexedDB。五个独立目录均通过双页修订冲突、旧页字节保留、两个中断点重开及旧修订重试。每次核对两条文件路径、长度和 SHA-256。测试仅终止新建的私有 Chrome 进程组，正常重开后关闭并清理目录。四项现有 Node 回归通过。

首轮漏提供 Pako 的嵌套路由，未运行到存储。补路由后的首轮在完成回调中断后读到空资源。完善记录方式后的五轮未复现。该异常根因、完整更新端口、系统掉电和真实设备恢复待验。 [首轮回执](../build/analysis/browser-resource-cache-interruption-v1/first-attempt.json) · [异常回执](../build/analysis/browser-resource-cache-interruption-v1/second-attempt.json) · [核验汇总](../build/analysis/browser-resource-cache-interruption-v1/validation.json)

<a id="browser-cache-open-outcomes-validation"></a>

## Chrome 157 缓存打开与排队核验

REA 6.7.0 启动并退出私有 Chrome，三个步骤均完成。捕获同一回环源的 13 个请求及终态。10 个模块字节与上轮相同，六组浏览器用例通过。夹具记录原生打开、阻塞、升级、事务、关闭和错误事件。 [REA 证据](../build/analysis/browser-cache-open-outcomes-v1/rea-capture.json) · [原生事件回执](../build/analysis/browser-cache-open-outcomes-v1/runtime.json)

13 项现有资源缓存及网页与微信宿主 Node 回归通过。移动真机、微信与完整多记录端口仍待验收。 [回归日志](../build/analysis/browser-cache-open-outcomes-v1/focused-regression.log) · [发布核验](../build/analysis/browser-cache-open-outcomes-v1/validation.json)

<a id="mobile-safari-cache-open-outcomes-validation"></a>

## iOS 模拟器 Safari 的缓存打开与排队核验

同一夹具和十个网页模块逐个核对 SHA-256。iOS 27.0（24A434）的 iPhone 17 Pro 模拟器上，Safari 27.0（8625.1.29.10.29）通过全部六组用例，事件与 Chrome 的回执逐项相符。核对 Safari 进程与浏览器请求标识后，已关闭本机服务并移除临时模拟器。 [运行回执](../build/analysis/mobile-safari-cache-open-outcomes-v1/runtime.json) · [Safari 身份](../build/analysis/mobile-safari-cache-open-outcomes-v1/simulator-run.json) · [清理核验](../build/analysis/mobile-safari-cache-open-outcomes-v1/cleanup.json) · [发布核验](../build/analysis/mobile-safari-cache-open-outcomes-v1/validation.json)

<a id="browser-cache-receipt-recovery-validation"></a>

## Chrome 157 发布回执与重建核验

直接运行现有网页缓存的默认模式与夹具请求的 `strict` 模式。三个诊断试次共 15 次私有 Chrome 进程，其中 9 次在指定点中断，6 次正常退出。三组分别读回修订 2、3、4，均核两条文件的路径、长度及 SHA-256。11 项现有网页与微信资源存储 Node 回归通过。 [默认一](../build/analysis/browser-cache-receipt-recovery-v1/runtime-default-a.json) · [默认二](../build/analysis/browser-cache-receipt-recovery-v1/runtime-default-b.json) · [显式提示](../build/analysis/browser-cache-receipt-recovery-v1/runtime-strict-a.json)

受控删除后，已确认修订 4 的重试报告冲突。重建到修订 1 后，另一页使用旧库记录的修订 1 提交成功。已核对旧库和重建后同号修订的不同摘要，并读回这次提交的修订 2。另一次默认模式读取库元数据报 `UnknownError`，该次资源读回缺失。 [异常回执](../build/analysis/browser-cache-receipt-recovery-v1/default-open-error.json) · [发布核验](../build/analysis/browser-cache-receipt-recovery-v1/validation.json)

## 桌面双版本等量存储核验

两份各 2,613,885,785 字节的原创载荷均按 312 块存入 IndexedDB，发布后逐块读回。旧页持租约时回收返回忙。删除旧根后，12 秒窗口末仍有约 341 MB 的额外文件逻辑长度。两个自有浏览器实例正常退出，重开后完整读回 B，两个实验的临时目录均已清理。

独立的 32 MiB Blob 持有实验核对了索引删除、旧引用可读与关闭读者页后的空间回落。实际产品负载、自然淘汰和设备场景待验。 [预算规则](architecture-and-milestones.md#browser-full-resource-budget) · [完整载荷实测](../build/analysis/browser-full-resource-budget-v1/runtime.json) · [持有实测](../build/analysis/browser-full-resource-budget-v1/blob-lifetime.json)

## C82 普通游戏创建的静态核验

新增 8 个完整 REA 函数并选用 8 个留存函数。所选 9,725 字节和 3,101 条指令与分析 PE 相符，另核 37 处直接调用和 8 处导入调用。LLVM 单列的 LOCK 前缀按原字节归并到对应指令。已保存 175 条 REA 记录并关闭会话。

原创输入通过既有旧版纯模块检查了空 `applicationName` 和带空格路径的原始命令。C82 的比较来自静态规则，实际创建、游戏消费者及联合接受待验。 [来源规则](launcher-static.md#c82-game-process-producer) · [来源核验](../build/analysis/launcher-current-game-process-v1/source-review.json) · [旧版对照](../build/analysis/launcher-current-game-process-v1/focused-probe.json)

## Item 角色操作的静态核验

复用 105 条 REA 记录，补 12 个函数与 1 个回复包含关系。所选 14 个函数共 11,856 字节、2,899 条指令与原 PE 一致，另核 23 个直接调用和相关状态跳转表。已保存 118 条记录并关闭 REA 会话。原版运行、实际删除和当前同版接受仍待验证。 [角色操作来源](game-static.md#legacy-item-character-operations) · [来源核验](../build/analysis/legacy-item-character-operations-v1/source-review.json)

<a id="legacy-item-album-toolbar-validation"></a>

## Item 图鉴工具栏与物品槽的核验

REA 6.7.0 与 Ghidra 12.1.4 复用 105 条记录，新增 9 个函数、1 个已知登记入口复核及 3 条地址归属记录。快照保存 118 条记录，REA 已关闭。Apple LLVM 21.0.0 对两份原 PE 的 16 个范围核对 5,328 字节、1,489 条指令，另核两条键盘记录和三个窗口表行。

现有共享输入、工作上下文、工作动作、物品目标和好友模块的 50 项本机回归通过。新图鉴用例仍为来源规格，原版普通帧、当前同版和三端完整验收待执行。产品保持 stage306。 [原 PE 核验](../build/analysis/legacy-item-album-menu-v1/source-review.json) · [本机回归](../build/analysis/legacy-item-album-menu-v1/focused-regression.log) · [发布核验](../build/analysis/legacy-item-album-menu-v1/validation.json)

启动补证核对 89 个初始化槽和选定的六个指针。REA 新增 10 个函数，复用两个完整体，Apple LLVM 对照这 12 个范围的 1,306 字节与 361 条指令。另复核三个既有界面范围的摘要、14 个直接调用和 37 个指令锚点。按原指令推演收起、十二次展开更新及准入失效的结果。运行时调用图鉴工具栏及窗口表的普通帧分派仍待证。 [启动与偏移核验](../build/analysis/legacy-item-window-startup-v1/source-review.json)

## Item 图鉴输入表的静态核验

复用 95 个 REA 记录并新增 10 个，最终导出及快照各 105 个。5 个新函数 1,986 字节与 3 个复用函数合计 2,585 字节、708 条指令核对原 PE，另核 7 处直接调用、64 个输入表项及图鉴 23/24 的所选表项。相邻图形加载器单列排除，没有用其推断输入准入。

实际主循环调用、原版和目标输入、当前版本及完整三端验收未执行。REA 已关闭且无清理待项，G19 与统一门槛保持未通过；本次不修改产品代码，不重跑产品构建或套件。 [来源与边界](game-static.md#legacy-item-album-key-registration) · [原文件核验](../build/analysis/legacy-item-album-key-ingress-v1/source-review.json) · [发布核验](../build/analysis/legacy-item-album-key-ingress-v1/validation.json)

<a id="legacy-item-classic-album-ingress-validation"></a>

## 历史 Item 经典图鉴的普通帧核验

REA 复用原会话中的 137 条记录并新增 5 个档案。对照原 PE 的 8 个函数体共 13,363 字节和 3,565 条指令，核对 20 处直接调用、41 个字节锚点及 12 项控件回调登记。复用普通帧与窗口重建证据，绑定按键、工具栏、设置和列表详情的所选分支。会话已关闭。核验范围为静态来源与规格，原版运行及三端验收待执行。 [来源复核](../build/analysis/legacy-item-classic-album-ingress-v1/source-review.json) · [核验回执](../build/analysis/legacy-item-classic-album-ingress-v1/validation.json)

<a id="legacy-se-classic-album-ingress-validation"></a>

## 历史 SE 经典图鉴的普通帧核验

REA 服务连接关闭后，用本机已安装的 REA 6.7.0 命令行与 Ghidra 12.1.4 离线读取 SE 的表尾引用。复用 15 个完整 REA 函数和 3 个留存派生视图，对照原 PE 共 16,512 字节、4,630 个指令位置、24 处直接调用、78 个指令锚点及 12 处控件登记。Item 表尾按第二份原 PE 字节复核。 [工具记录与双样本核验](../build/analysis/legacy-se-classic-album-ingress-v1/source-review.json)

Node 26.9.0 的现有图鉴记录投影与战斗分类回归 4 项通过。SF-A27 的组合用例已登记，原版运行、当前同版与三端验收待执行。 [本地回归](../build/analysis/legacy-se-classic-album-ingress-v1/local-roster-regression.log) · [发布核验](../build/analysis/legacy-se-classic-album-ingress-v1/validation.json)

<a id="legacy-classic-album-entry-admission-validation"></a>

## 固定 SE 经典图鉴的业务入口与规格核验

用 REA 6.7.0、Ghidra 12.1.4 和 Apple LLVM 21.0.0 核对固定 SE 与 Item。复用 15 份完整函数档案和 3 份派生视图。新增 SE 两个刷新函数，共 3,279 字节和 852 个指令位置。两次查询约 58.69 秒，含首次引擎载入。独立复核 27 个登记位置、两版合计 89 个字节锚点和 20 处直接调用。 [原件、取证和位点](../build/analysis/legacy-classic-album-admission-v1/source-review.json) · [查询时长](../build/analysis/legacy-classic-album-admission-v1/se-rea-closed.json)

本地现有摘要、详情和战斗分类回归 4 项通过。SF-A27 已补活动和空记录、首次详情方向、发现标记清除、关窗与重开。原版运行、目标端完整用例、第二套窗口分派及当前同版继续验收。 [回归日志](../build/analysis/legacy-classic-album-admission-v1/local-roster.log) · [规格和文档核验](../build/analysis/legacy-classic-album-admission-v1/validation.json)

## 历史 Item 普通训练的来源核验

复用 62 个留存 REA 记录，新增 33 个记录并导出快照。32 个函数体共 22,376 字节、6,258 条指令与原 PE 核对通过。独立核对十条训练模式的分支、九个资料处理函数、三个经典描述符和 43 处所选直接调用。原版运行、另一套窗口的正常分派和设备验收仍待。 [来源核验](../build/analysis/legacy-item-training-ingress-v1/source-review.json)

<a id="legacy-classic-dialog-frame-hook-validation"></a>

## 两版经典对话的帧钩子和治疗提示核验

在两份固定 PE 上核对 20 个函数或派生范围，共 13,846 字节、4,085 条指令和 93 处指令位置。复用 12 份完整 REA 记录和 3 份派生视图，新增 5 个 Item 函数档案及 12 条两版引用、归属和读字节记录。核对两个描述符、各自的末项控件及十处提示字串。REA 会话已关闭。 [工具、样本、指令和偏移](../build/analysis/legacy-window-dispatch-gates-v1/source-review.json)

15 个合成用例核对帧返回、控件参与和提示分支的静态推演。3 个本地用例直接调用现有共享核心，5 项既有治疗、技能、对话和图形回归通过。完整原版帧、当前同版与三端产品用例待执行。 [本地对照](../build/analysis/legacy-window-dispatch-gates-v1/focused-probe.json) · [回归日志](../build/analysis/legacy-window-dispatch-gates-v1/focused-tests.log) · [发布核验](../build/analysis/legacy-window-dispatch-gates-v1/validation.json)

<a id="legacy-pet-training-wait-validation"></a>

## 宠物训练等待与同窗回包核验

REA 6.7.0 与 Ghidra 12.1.4 复用 22 个完整函数体，新查 Item 的 5 个函数。另复用 5 个已存 SE 派生视图。两份固定 PE 共核 21,894 字节、6,430 条指令位置、35 处选定直接调用及 46 处选定分支。Item 的 73 条原快照记录逐条匹配导出记录，REA 已关闭。 [源文件、偏移与工具版本](../build/analysis/legacy-training-wait-owner-v1/source-review.json)

六组原创收发对照通过，记录现有核心的移除页面、关闭匹配、角色筛选和按钮 2 行为。三项既有宠物训练与治疗回归通过。OS-A24 的原版运行、复刻流程、三端及当前同版验收仍待执行。 [本地对照](../build/analysis/legacy-training-wait-owner-v1/focused-probe.json) · [阶段核验](../build/analysis/legacy-training-wait-owner-v1/validation.json)

<a id="legacy-pet-training-controls-validation"></a>

## 宠物训练再输入和技能栏确认核验

REA 6.7.0 与 Ghidra 12.1.4 复用 16 份完整记录、6 份派生视图，补查 2 个 Item 控件函数。Apple LLVM 21.0.0 对照两版 14,286 字节、27 处直接调用、70 处指令锚点及窗口 54 的控件登记。会话已关闭。 [样本、原字节及范围](../build/analysis/legacy-pet-training-controls-v1/source-review.json)

七个静态用例覆盖等待再输入、输入消费、选栏、确认及取消。现有共享入口的原创夹具确认报价和选宠发送后清页，再次提交返回失效。65 项现有训练、工艺、图鉴及相关本地回归通过。实际输入时序、第二套窗口、当前同版和三端产品仍待验收。 [静态用例](../build/analysis/legacy-pet-training-controls-v1/source-cases.json) · [本地对照](../build/analysis/legacy-pet-training-controls-v1/local-comparison.json) · [回归记录](../build/analysis/legacy-pet-training-controls-v1/local-regression.log) · [发布核验](../build/analysis/legacy-pet-training-controls-v1/validation.json)

<a id="legacy-dialog-actor-facing-validation"></a>

## 普通对话分派与角色朝向核验

两版共核 12 个函数体、4,007 字节及 LLVM 的 1,369 条指令。REA 本轮查询六个函数，其中两个 SE 记录与历史存档完全相同，Item 新补四个。两份转换例程的同一组 WAIT 与 FNSTCW 在 LLVM 分列，原字节一致。REA 已关闭。七个本地收包对照及三个现有治疗和宠物训练回归通过。原版实际朝向、三端流程及当前同版待验。 [原字节核验](../build/analysis/legacy-dialog-actor-facing-v1/source-review.json) · [本地收包结果](../build/analysis/legacy-dialog-actor-facing-v1/focused-probe.json)

## 桌面 Chrome 资源换版与中断恢复核验

六项选定宿主检查通过。跨页读取核对四块实际摘要，释放后核对旧根的块已删除且回执仍可读。三次独立浏览器进程使用同一隔离目录，其中两次在指定边界强制退出。提交前读回 B revision 2，候选 C 保持准备态。提交完成后读回 C revision 3、对应回执及意图，两块 C 资源摘要均匹配。浏览器版本为 156.0.8078.80，临时目录已清理。实际产品端口、完整场景和手机与微信验收仍待。 [运行记录](../build/analysis/browser-update-recovery-v1/runtime.json)

<a id="mobile-safari-stream-commit-validation"></a>

## 移动 Safari 的实际回环桥与发布恢复核验

iOS 27.0（24A434）与 Safari 27.0（8625.1.29.10.29）的独立模拟器完成两次宿主试次。第一项逐个核对 644 个复制文件的基线摘要，使用原适配器和本机桥。19 条浏览器事件与三个业务 TCP 连接的实际字节和关闭回执相符，另有一条仅供探针报告的连接。第二项复用桌面分块和 Worker 夹具，核对不同 Safari PID、旧进程退出、同源修订 2、相同更新编号和两块资源摘要。两个运行分别耗时 15.862 秒和 8.145 秒。已清理独立模拟器与临时树，并复核其余 11 台模拟器状态。完整产品端口、默认持久性、真机和微信待验收。 [传输运行](../build/analysis/mobile-safari-stream-lifecycle-v1/runtime.json) · [提交运行](../build/analysis/mobile-safari-stream-lifecycle-v1/commit-recovery-runtime.json) · [验证汇总](../build/analysis/mobile-safari-stream-lifecycle-v1/validation.json)

<a id="browser-explicit-commit-interruption-validation"></a>

### 显式提交返回后中断的 Chrome 核验

Chrome 157.0.8103.51 和 Playwright 1.64.1 完成两轮，每轮确认两个私有 Chrome 主进程收到 `SIGKILL` 后退出。各轮的两次重开分别核对修订 2、3 与该次提交的回执、清单和重启意图，四次原编号重放返回已有回执，分块摘要核对通过。首次夹具在模块加载后才登记 Worker 消息监听，未到达中断边界。改为先注册监听，再加载模块，两轮均通过。三个临时浏览器目录均已清理。完整产品端口和设备验收待执行。 [首轮](../build/analysis/browser-update-commit-unknown-v1/first-runtime.json) · [复核轮](../build/analysis/browser-update-commit-unknown-v1/runtime.json) · [验证回执](../build/analysis/browser-update-commit-unknown-v1/validation.json)

## 角色结果队列分配与复用核验

固定 SE 的 11 个留存 REA 函数体与 4 段生产者指令窗共 4,997 字节、1,384 条指令与原 PE 核对通过，核验 18 个直接调用。原创 105 输入经现有共享核心写入第四格 100041。两种队列重置各核对了游标、哨兵、同槽更新、护卫复制及新角色初值。两组局部用例通过。原版运行、完整战斗和目标平台验收仍待。 [来源核验](../build/analysis/battle-result-tuple-lifecycle-v1/source-review.json) · [本地核验](../build/analysis/battle-result-tuple-lifecycle-v1/focused-probe.json)

## 105 共享动画游标的进退场核验

两份历史样本的六个 REA 函数体共 7,712 字节、1,876 条指令与原 PE 核对通过。Item 的六段 REA 字节窗、两份动作跳转表和进退场六处清表已绑定。原创夹具通过现有命令所有者确认普通退出清 22 个指针，退出和再次入场后游标均为 1，下一次读动作 8 后到 2。原版运行和目标端完整子状态 9 验收仍待。 [来源核验](../build/analysis/battle-105-cursor-lifecycle-v1/source-review.json) · [本地探针](../build/analysis/battle-105-cursor-lifecycle-v1/focused-probe.json)

<a id="battle-105-106-callback-order-validation"></a>

## 固定 SE 的 105、106 同帧次序核验

复用 REA 6.7.0 和 Ghidra 12.1.4 的 18 份函数档案、两个派生调度视图及共享游标引用。Apple LLVM 21.0.0 对照原件核对档案共 80,781 字节、73 处指令锚点、34 个直接调用及 13 个分派表项。新增 REA 查询为 0。 [原件、档案及分派](../build/analysis/battle-105-106-callback-order-v1/source-review.json)

原创反射组合由现有命令入口推进。两次均在第 44 次遍历创建分身，槽 0 父对象的分身同次进入动作 75，槽 1 的分身暂留动作 24。槽 0 的分身命中先于同帧 105 的游标 0→1。已有共享回放的另一组合观测到槽 0 的 105 先于分身、游标 8→9。普通非反射组合在第 2 次命令回调返回未支持，未发布分身或改变该施法者的数值。43 项现有本地测试通过。原版非反射命中和完整三端案例待验。 [共享对照](../build/analysis/battle-105-106-callback-order-v1/local-comparison.json) · [回归](../build/analysis/battle-105-106-callback-order-v1/local-regression.log) · [发布核验](../build/analysis/battle-105-106-callback-order-v1/validation.json)

<a id="f5a-patch-fallback-validation"></a>

## 11 月版补丁回退与重试核验

复用前次 69 条 REA 记录，增加 19 条。将 10 个 REA 函数档案和 C82 的目录门槛窗口与原文件对照，核对 2514 条指令。核验登录器安装器四条成员、更新 ZIP 及随包目录的四条配置。补丁规划、轮询、退出和字节接口的 15 项现有回归通过。真实回退文件、实际子进程及三端验收仍待。 [来源与归档核验](../build/analysis/launcher-f5a-patch-fallback-v1/source-review.json) · [回归记录](../build/analysis/launcher-f5a-patch-fallback-v1/focused-regression.log)

## 已安装游戏补丁器分发核验

实际提取主包的嵌套安装器和补丁器。两份登录器安装器的四条成员记录一致，最终三个路径逐字节相符。读取四条魔力目录配置，核对两份各 378 项的留存清单。五份相关制品的长度及 MD5 匹配声明，补丁器与固定 REA 样本相符。复用既有更新后磁盘读回，绑定当前打包 EXE 和目录摘要。实际补丁子进程与缺文件回退仍待运行或材料证据。 [核验记录](../build/analysis/launcher-patch-payload-association-v1/source-review.json)

<a id="installed-patcher-argument-handoff-validation"></a>

## 固定补丁器参数交接核验

REA 6.7.0 与 Ghidra 12.1.4 导出固定安装补丁器的 15 条记录并关闭会话。三个固定 PE 的所选窗口用 LLVM 独立核对了 450 条指令。已有共享模块的 7 项回归、含空格路径和缺参数等 5 个原创 ASCII 对照、以及 3 次退出分类均通过。实际回退供应、Windows 子进程与同版联动待验收。 [静态核验](../build/analysis/launcher-patcher-argument-handoff-v1/source-review.json) · [本地用例](../build/analysis/launcher-patcher-argument-handoff-v1/focused-probe.json) · [验证回执](../build/analysis/launcher-patcher-argument-handoff-v1/validation.json)

## 历史 Item 窗口资料及图鉴页规则核验

18 个 REA 函数体的 21,788 字节、5,833 条指令和两段页初始化程序均核原 PE。两份 99 行窗口表的 ID 与 group 一致，独立核对六个训练打开点和两个图鉴切换点。对固定 SE 的 320 个容量内图鉴序号验证了恢复页公式。实际外层入口、产品流程及宿主接受待验证。 [来源与回执](../build/analysis/legacy-item-window-producers-v1/source-review.json)

## 资源规模、RD 头及引用核验

2,367 个应用文件的长度和摘要检查通过。静态读完 664,164 条图形物理记录，按已选动画索引解析 2,520 个最终定义、1,699,203 条帧记录与 639,484 条附属坐标记录。所选烟雾首帧的确切引用已绑定。复用的 8 个 REA 完整体、3,434 字节及 1,124 条指令与原 PE 相符。

核验覆盖文件身份、记录头与范围、帧引用和所选源码分支。设备实际配额、完整展开、画面呈现及三端游玩仍待验收。

补核烟雾生产、动画和普通绘制复用 9 个留存 REA 函数体，6,324 字节、1,859 条指令的范围与原 PE 核对通过。两项原创负高及无符号投影探针均复现当前拒绝，正高度对照在第 1、5、9、13 次调用发布帧，第 17 次完成。以上为静态规则及本地模块差异核验，固定来源画面、产品流程和宿主验收待执行。 [来源核验](../build/analysis/smoke-animation-clip-v1/source-review.json) · [本地探针](../build/analysis/smoke-animation-clip-v1/focused-probe.json)

[资源测量与源规则](../analysis/capability-first-v1/resource-corpus-budget.json)

<a id="launcher-startup-functional-specification"></a>

## 当前登录器补证：嵌套退出hook的安装与所选分支已成规（2026-11-11）

QH沿固定C82 App Init的正向OLE初始化调用补齐EA-F13：45C46F在所证mode/HRESULT条件下把45C570写入44FD1F所得对象+3c；alternate mode可返回1而不走本体setter。45A8A6实际以(1,1)调用，再在正常返回后投递退出消息，不能把所有nonzero初始化结果或quit请求当作资源/登录通道已退役。

所选45C502(1)先执行条件OleFlushClipboard、factory链遍历和先移除再虚槽0调用，然后跳过本地零参filter删除/COM-uninitialize分支。实际module flag、资源成员/间接效果保来源条件；不据所选代码报告必现重绑/死锁或完整Windows关闭接受。普通modal期间形成替换binding的合法producer/投递准入、LS-U3实际消息/销毁和Host drain仍待。

新增7必要完整native/477B，复用App Init与quit两完整体；9窗1679B/531指令核原PE，REA已导出关闭。形成9事实、2推导、5操作、3组开发差异和8项未执行接受案例。停止已答OLE/MFC库存扩张，仅沿原必要正向对象/producer或Host证据继续。

原40/81/37/10/6、owner/依赖/批次/profile及14端口62方法保持；19项固定来源本域规格就绪不变，L03/L06/L08及统一A1..A4不提升。产品仍stage306，本轮无产品修改、目标测试/构建、VM/SDK/网络/账号操作。原GP补丁五组与UH三端发布/恢复方案直接复用，先全部能力成规再按D0–D6开发。

通过的是原件hash、9完整体字节/指令、文件pin/引用及原范围/文档一致性核验；8项接受案例均未执行。既有LR纯目标结果复用未重跑，不当作Windows/SDK/账号或完整Host证据。

[quit hook合同](../analysis/capability-first-v1/launcher-quit-hook-contract.json) · [源核验](../build/analysis/launcher-quit-hook-v1/source-review.json) · [本轮核验](../build/analysis/launcher-quit-hook-v1/validation.json) · [原补丁规格](../analysis/capability-first-v1/launcher-game-patch-functional-specification.json)

<a id="launcher-exit-admission"></a>

## About/Exit静态33窗核验，未新增目标测试（2026-11-10）

9必要新完整native/1198B，另1常量槽3B未用于需求覆盖；2查询与早期完整记录逐字规范对象相同，单列重复。复用19完整和4派生，33体/33窗4851B及1587规范指令、12虚槽核原PE；LOCK前缀归并仍严格保留。两个REA会话分别导出159/160记录并已关闭。

8操作/16事实/2条件推论与8完整接受案例已建，原程序/VM、真实modal/quit callback、原25会话、三端/SDK/官服均未执行。LR四个真实局部端口例只复用旧哈希，不计新测试；本轮未构建产品或跑无关全套。4774既有路径只改授权13文档/JSON，另新增一规则合同，产品不变。

[退出准入合同](../analysis/capability-first-v1/launcher-exit-admission-contract.json) · [源核验](../build/analysis/launcher-exit-admission-v1/source-review.json) · [既有端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-exit-admission-v1/validation.json)

<a id="launcher-callback-reentry"></a>

## 回调入口43窗与4个真实局部端口例（2026-11-10）

5新完整native/748B与1 containing查询；复用22完整native、13非规范派生，40体/43窗14,671字节及4,248规范指令核固定c82f。LLVM把f0 LOCK单列的差异只在原字节和Ghidra .LOCK匹配时归并，保留地址与raw行数；source-review.json可追溯。REA已导出147条记录并关闭。

4个实际JavaScript端口例通过：迟到open/read/write、close内同步新建B；B维持活动，最后独立取消，timer正常退役。最初私有harness导入多一级目录而未运行案例，修正后4例通过。原Windows modal、原25整会话、新完整modal组合、SDK/三端/官服未执行；不运行无关全套构建。

[回调入口合同](../analysis/capability-first-v1/launcher-callback-reentry-contract.json) · [源核验](../build/analysis/launcher-callback-reentry-v1/source-review.json) · [端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-callback-reentry-v1/validation.json)

<a id="launcher-legacy-failure"></a>

## 旧版具名失败frame与129项目标核验（2026-11-10）

2新增完整native/509B、1直接caller查询，16完整源复用；19 native范围/1800条独立指令核原PE。实际EH try/type与throw类型关系、EBP槽和69B非连续continuation已核，原C++runtime未执行；两份compiler主源仅辅助布局，下载字节/hash留私有证据。REA已导出关闭。

实际运行129原创纯目标例：55候选顺序、54取消、10时钟、10无效ordinal；10组initial0即时清理差异保留。770为静态标量解释，不计native或目标测试。保留原25完整接受并增12未执行条件；L03/统一门槛/实际三端/官方未过，产品stage306未改，无完整构建/套件。

[旧版失败合同](../analysis/capability-first-v1/launcher-legacy-failure-contract.json) · [源核验](../build/analysis/launcher-legacy-failure-v1/source-review.json) · [纯目标对照](../build/analysis/launcher-legacy-failure-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-legacy-failure-v1/validation.json)

<a id="launcher-derived-material"></a>

## 短材料源规则补证与27项原创核心对照（2026-11-10）

复用精确哈希snapshot后仅新增8分析操作：5完整native、1汇编、1精确global xrefs和1 containing owner。5新体3600字节、5复用完整体、8旧派生视图和独立8窗/1122指令分别记录，源码字节匹配固定PE；current失败CFG不达key/state2证明已验。两会话已导出关闭。

27原创案例实际调用现有核心；current14项材料结果相符、足够材料两profile共10项前8字节相符，旧版7个短材料例仍拒绝，明确为待补实现差异。源键值预期来自已证静态生命周期和原创算术推导，没有执行原代码。保留25原完整接受及7补充案例，全未执行；L03/统一门槛/三端/官方未过，产品代码/完整构建套件未运行。

[材料合同](../analysis/capability-first-v1/launcher-derived-material-contract.json) · [来源核验](../build/analysis/launcher-derived-material-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-derived-material-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-derived-material-v1/validation.json)

<a id="launcher-session-functional-specification"></a>

## L03双来源规格与882项原创纯模块核验（2026-11-10）

source-authentication将78旧完整记录的33852字节及70当前行的28538字节绑定固定PE，并重核7个当前编译窗；171输入哈希检查通过。当前70行含46canonical行、派生/重复另列，不报告为70新native函数；本轮0新增REA分析查询/静态引擎。旧临时路径已失效，通过原安装包离线恢复相同601b身份。

focused-probe实跑882检查：挑战550拆分、两版76个记录长度/字节、122记录拆分、100跨记录frame及请求/五列/尾字/群边界/取消/期限等。两次原创字节整链仍为纯fixture，无真实传输或账号；current deadline差异明确保留。25完整用例未执行，L03/统一A1..A4/三端与官方接受均未通过，产品未改、完整构建/套件未跑。

[双来源操作规格](../analysis/capability-first-v1/launcher-session-functional-specification.json) · [来源核验](../build/analysis/launcher-session-functional-specification-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-session-functional-specification-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-session-functional-specification-v1/validation.json)

<a id="legacy-shop-quote-drag-validation"></a>

## 固定 SE 商店报价行来源及共享核价核验

复用 REA 6.7.0、Ghidra 12.1.4 的 14 份完整函数档案和 6 份派生视图。Apple LLVM 21.0.0 逐条核对原 PE 指令、两张模式表、五个报价控件和两个相邻控件入口。新增 REA 查询为 0。 [可复核来源](../build/analysis/shop-quote-drag-v1/source-review.json)

三个原创两行夹具覆盖出售、鉴定和修理。将核价输入反向后，现有共享模块仍按原顺序返回背包槽 8、10。省略一个选择时仅返回槽 10，原报价视图仍保留两行。现有 7 项商店回归通过。原版鼠标操作、关闭重叠及三端完整案例待验。 [本地对照](../build/analysis/shop-quote-drag-v1/local-comparison.json) · [回归日志](../build/analysis/shop-quote-drag-v1/local-regression.log) · [验收回执](../build/analysis/shop-quote-drag-v1/validation.json)

<a id="fixed-se-shop-entry-admission-validation"></a>

## 固定 SE 报价窗入口与关闭顺序核验

用 REA 6.7.0、Ghidra 12.1.4 复用 15 份完整函数档案和 11 份派生视图。补查六段原字节和两个地址的精确引用。Apple LLVM 21.0.0 与文件偏移独立核对 12 处登记、16 条直接边、75 处指令及三张模式跳表。A1 保留 647 个原根，12 处登记中的 8 个已有根按其本次业务用途引用。 [来源与完整证据索引](../build/analysis/fixed-se-shop-entry-admission-v1/source-review.json) · [台账更新回执](../build/analysis/fixed-se-shop-entry-admission-v1/ledger-publication.json)

三组原创报价再次证实 stage306 核价用原报价顺序。现有共享客户端 52 项本机回归通过，包含商店入口、出售时的背包修订检查、鉴定和修理的槽列表。原版实际关窗重叠、非零抑制字节的生产者及三端完整操作继续验收。 [本机对照](../build/analysis/fixed-se-shop-entry-admission-v1/local-quote-order.json) · [回归日志](../build/analysis/fixed-se-shop-entry-admission-v1/local-regression.log) · [复核清单](../build/analysis/fixed-se-shop-entry-admission-v1/validation.json)

<a id="fixed-se-shop-retirement-refresh-validation"></a>

## 固定 SE 报价撤选和替换后的本机核验

REA 6.7.0、Ghidra 12.1.4 复用五份同版函数档案和一份派生视图，补三组直接引用及滑块例程的 69 字节。Apple LLVM 21.0.0 从原 PE 核对调用顺序、控件布局和所选帧写入。取证会话已关闭。 [原字节、来源及范围](../build/analysis/fixed-se-shop-retirement-refresh-v1/validation.json)

三组原创输入经现有商店对话验证出售、鉴定和修理。倒序提交选择后仍按原报价顺序核价。替换、关闭及重开共九次旧修订号调用均被拒绝，替换后的行记录与核价保持一致。五组现有测试共 104 项通过。原版取消交错和三端指针呈现按对应验收用例执行。 [本机对照](../build/analysis/fixed-se-shop-retirement-refresh-v1/local-dialog-comparison.json) · [回归日志](../build/analysis/fixed-se-shop-retirement-refresh-v1/local-regression.log)

<a id="wechat-sdk-host-probe-preparation"></a>

## WH工具和原创探针准备验收（2026-11-10）

[准备检查v2](../build/analysis/wechat-host-conformance-v1/preparation-validation-v2.json)核9文件原创小程序、JS/JSON、游客AppID、域名校验保持及原4769公共路径。严格bundle签名/安装检查和一次AX授权UI观察通过；同auth任务两次查询exit1、server未启动，未作为终态或成功。

该次准备的实际 SDK 用例数与 22 个完整用例通过数均为 0。后续本机图形界面已有实际 SDK 回执。 [原准备档案](../analysis/capability-first-v1/wechat-host-profile.json) · [后续核验](architecture-and-milestones.md#wechat-devtools-offline-sdk)

[发布核验](../build/analysis/wechat-host-conformance-v1/validation.json)只更新15既有文档/索引并新增1档案，其他4754旧公共路径、共享合同/浏览器哈希及原40/81/37/10/6、16本域ready保持。排障原节仅插入本次工具门槛，历史原文完整；产品stage306和统一门槛未过状态不变。

<a id="game-battle-functional-specification"></a>

## BF来源、纯核心与公共文档核验（2026-11-10）

[来源预检](../build/analysis/battle-functional-specification-v1/source-validation.json)核75完整native记录122401B、24旧派生62998B及16582条派生指令、358规则节点、24读窗、2689直接call、51变体规格；原28B/完整461B CFG138指令及9B leaf分层证明，14主控件和29/32表逐PE核对。186来源文件核验通过，REA关闭，无新分析查询/引擎进程。

[纯核心结果](../build/analysis/battle-functional-specification-v1/focused-probe.json)通过240C、7数值、240mask、180targetcode、18ring及partial/ACK/branch/phase5-6边界；2个observer当前拒绝复现已知差异。完整产品套件/构建、原程序/Windows API/VM、网络/账号/设备未运行，44完整native或目标用例均未执行。

[发布核验](../build/analysis/battle-functional-specification-v1/validation.json)保原14组/91操作/12差异和40/81/37/10/6，只提升B01/B04固定本域规格；B02/B03 native条件保持。12既有公共文档/索引更新、1新规格，其余4756旧公共路径及产品stage306/14端口/浏览器合同不变；统一A1..A4未通过。

<a id="game-work-functional-specification"></a>

## WK来源、纯模块及文档发布核验（2026-11-10）

[来源预检](../build/analysis/work-functional-specification-v1/source-validation.json)核95完整原生记录31751B、61旧派生观察/59入口/48697B、54规则节点、2读窗、3经典描述符、16另一套表行、14B小指令和7B因子表；完整原记录/派生指令逐原PE重核，0新REA分析查询/0新静态引擎进程，REA已确认关闭。

[纯模块结果](../build/analysis/work-functional-specification-v1/focused-probe.json)通过112耗时、35上下文资格、60物品资格、13刻印、4本地目标序号和72目标结果，明确复现reset保存ctx与移动/due差异，保留已有正确行为。未执行完整产品套件/构建、原程序/Windows API/VM、网络/账号或实际三端，30完整案例均未执行。

[发布核验](../build/analysis/work-functional-specification-v1/validation.json)检查原六组范围/60操作/7差异及40/81/37/10/6、原owner/依赖/批次保持；G18另一套实际dispatch仍未就绪。只更新12既有公共文档/索引并新增1规格，其余4755旧公共路径不变；产品stage306、14端口/浏览器合同和统一A1..A4未通过状态保持。

<a id="game-social-family-album-functional-specification"></a>

## SF来源、纯模块及发布核验（2026-11-10）

[来源预检](../build/analysis/social-family-album-functional-specification-v1/source-validation.json)核171完整原生记录72772B、66旧派生观察/63入口/32663B、58规则节点、186原文件读窗、25新派生体3394B及1067独立LLVM指令。六次REA查询无过程元数据/0新原生Evidence；26种子请求含1次重叠拒绝并归回父体，原PE/REA元数据未改、REA已关闭。

[纯模块结果](../build/analysis/social-family-album-functional-specification-v1/focused-probe.json)通过11快捷边界、9方向、11倍率、战斗队伍保留/重绑、家族ID/称号/有意义名称与6喂食样例、320摘要请求和20槽分类。明确保留源/实现差异；未跑完整产品测试/构建、原程序/Windows API/VM/网络/账号或真实三端。30完整案例仍未执行。

[发布核验](../build/analysis/social-family-album-functional-specification-v1/validation.json)保留原12组/72操作、9差异及40/81/37/10/6范围；G14/G16固定本域就绪，G19必要来源条件未就绪。12既有文档/索引更新、1公共规格新增，其余4754旧公共路径不变；共享14端口/浏览器合同哈希、产品stage306和统一A1..A4未通过状态保持。

<a id="game-ordinary-services-functional-specification"></a>

## OS来源、纯模块与文档发布核验（2026-11-10）

[来源预检](../build/analysis/ordinary-services-functional-specification-v1/source-validation.json)核202完整原生记录77508B、180旧派生观察/167不同入口、1个7B操作码视图、43保留规则节点、10新增派生视图7351B及2169条独立LLVM指令。三次REA函数查询均无过程元数据、0新增原生Evidence；原样本/原分析元数据未修改，REA已关闭。

[纯模块结果](../build/analysis/ordinary-services-functional-specification-v1/focused-probe.json)通过物品槽/命令、当前资格与revision、6双字段、6外观循环、4商人映射、交易阶段/时钟和幂等清理，明确保留已知源/实现差异。没有跑完整产品测试/构建，未执行原程序、Windows API、VM、网络、账号或真实三端；31完整案例仍未执行。

[发布核验](../build/analysis/ordinary-services-functional-specification-v1/validation.json)保留原18组/78操作、5能力及全部40/81/37/10/6范围；G09/G10/G11/G13固定本域就绪，G12条件入口仍未就绪。12既有文档/索引更新、1公共规格新增，其余4753旧公共路径不变，14端口与浏览器合同哈希保持。产品仍stage306，统一A1..A4和完整目标未通过。

<a id="legacy-render-backend-selection-validation"></a>

## 固定 SE 绘制选路核验

REA 6.7.0 与 Ghidra 12.1.4 新核两个完整函数、三个地址归属，复用六个完整函数和所选窗口派生记录。Apple LLVM 21.0.0 逐字节核对八个完整函数的 10,709 字节和 2,948 条指令，再核普通帧与系统键所选分支、16 处直接调用、38 处指令锚和配置文本。REA 会话已关闭。 [来源回执](../build/analysis/legacy-render-backend-selection-v1/source-review.json)

现有配置、绘制、加色和透明度的 43 项本机回归通过。Windows 实际设备选择和像素、完整 PR-A10、非对齐尾部、当前同版和三端验收待执行。 [回归日志](../build/analysis/legacy-render-backend-selection-v1/focused-regression.log) · [本轮核验](../build/analysis/legacy-render-backend-selection-v1/validation.json)

<a id="legacy-render-recovery-probe-validation"></a>

### 固定 SE 的呈现与恢复核验

REA 6.7.0 与 Ghidra 12.1.4 新核三个函数体，复用两个既有函数体及普通帧入口。所选表面检查调用经原 PE 指令独立核对。Apple LLVM 21.0.0 核对 15 段、2,058 字节和 662 条指令。四个 COM 接口的所选槽位与五个 GUID 对照固定微软 SDK 声明。REA 会话已关闭。 [来源核验](../build/analysis/legacy-render-recovery-probe-v1/source-review.json)

44 项现有绘制、加色、透明度和命名调色板本机回归通过。实际 Windows 设备、PR-A10 完整流程、当前同版和三端验收待执行。 [回归日志](../build/analysis/legacy-render-recovery-probe-v1/focused-render-tests.log) · [发布核验](../build/analysis/legacy-render-recovery-probe-v1/validation.json)

<a id="game-presentation-functional-specification"></a>

## G06/G07来源、纯模块及发布核验（2026-11-10）

[PR核验](../build/analysis/game-presentation-functional-specification-v1/validation.json)绑定224完整原生记录/163193B、35精确规则节点、6独立派生视图/2554B和原PE。没有新增REA分析查询/目标打开/派生工程；只读实际会话状态为closed、cleanup=false。原九组范围与52操作、8差异和24项未执行完整接受条件分别列明。

187宽度/2304标签、9小地图网格/18像素哈希/20颜色样例通过；额外检查非4倍RD仍可解码而渲染明确拒绝、13B已知前缀冷/热差异、字体端口强制/像素未验证、水面更新与呈现时钟分开。未跑完整产品测试或构建，也未执行原程序/Windows/VM/网络/账号/真实三端。

仅G07固定来源本域source-ready；G06整域、原依赖与统一A1..A4保持未通过。12既有文档/索引更新，1公共规格新增，其余4752旧公共路径不变；共享14端口/浏览器合同哈希和产品stage306保持，原40/81/37/10/6范围保留。

<a id="game-actor-functional-specification"></a>

## G05全原范围规格与纯模块差异核验（2026-11-10）

[GA核验](../build/analysis/game-actor-functional-specification-v1/validation.json)检查192完整原生记录/65756B、19保留规则节点、173字节/映射观察、5派生视图/3518B、17范围1694独立指令及120几何对。13新查询均由已核原调用或注册回调正向到达，两轮导出7/13记录后REA关闭、cleanup=false；派生视图不冒充原生。

72独立原创样例通过；纯模块检查保留C0/协同未实现边界、本地30命令字段差异、缺整数-1、inclusive16、100存储/101st不存与幂等关闭。未跑完整产品测试/构建、原程序/Windows/VM/网络/账号或三端；25个完整接受条件未执行。

只提升G05固定来源本域规格。完整原40/81/37/10/6、owner/依赖/批次与14端口/浏览器合同保持；12既有文档/索引更新，1公共规格新增，其余4751旧路径不变。产品stage306与统一A1..A4未通过状态保持。

<a id="game-flow-functional-specification"></a>

## G03主流程功能规格核验（2026-11-10）

[GF规格](../analysis/capability-first-v1/game-flow-functional-specification.json)复用63完整原记录/新3查询，共66体30961B；7体1908条独立LLVM指令和三条父CALL绑定原件。恢复副本40A0C0另与其原导出完整记录对比相等。原五组范围/33操作/13事实、22个主9 case、6组待实现差异和20个未执行完整案例分别核验。

原创纯模块检查通过：main5明示unmodeled reset、首包字段/ACK与connected优先、1帧保留+30次清屏、取消/替换旧capture清除及幂等close。该probe未执行新分析的初始分支、原生/Windows API、网络、账号或完整产品构建/套件；不支持真实三端或当前/官方接受声明。REA导出3记录、snapshot3并关闭，cleanup_pending=false。

[最终核验记录](../build/analysis/game-flow-functional-specification-v1/validation.json) · [纯模块记录](../build/analysis/game-flow-functional-specification-v1/focused-probe.json)。原40/81/37/10/6、stage306、现有代码与统一未通过门槛保持。

<a id="game-communication-functional-specification"></a>

## G01全原范围规格与局部运行证据分层（2026-11-10）

[CF验收记录](../build/analysis/game-communication-functional-specification-v1/validation.json)核134复用+7新增完整native记录、141体66345B、58旧规则/端口节点、111旧范围/映射、164标签字；6发送窗口和3小型机器视图区分派生级别。回城60B旧read_bytes完整原记录另核。新增7体/3视图1648B的502条独立指令与原PE相符；2+5记录会话均已导出/快照关闭。

119外帧拆分位置、binary初始化前优先、旧材料重置保留/替换、unknown text、固定模块摘要、首包顺序、full32拒绝与99成功优先通过。104接收/66唯一发送的runtime语义对照和来源元数据另核；4个idle条件算术有2个已知差异，仅执行已核host表达式，不等于完整session/native计时实测。私有前检/夹具失败和纠正留execution-record，16个完整原版/目标接受案未执行。

G01固定来源本域规格ready=true；依赖/全source边界产品一致性/实际三端/当前配对/官方仍false，统一A1..A4未通过。原40/81/37/10/6及owner/依赖/批次保留，产品stage306，无源码变化、全仓构建/测试、VM/API联网/账号/设备动作。

<a id="launcher-config-path"></a>

## Config路径选定来源及纯策略对照（2026-11-10）

[LP验收](../build/analysis/launcher-config-path-v1/validation.json)：8份新完整原生Evidence+9份旧记录、17体8282B/2883独立指令绑定原PE，13个规则/端口节点与编译常量身份复核；434100/4366A0正常返回ABI另证，原伪代码未改。8记录会话已导出/快照关闭，cleanup_pending=false。

5个原创情境实际调用既有纯模块5次：UNC保守政策、相同元数据下不同最终路径/属性条件、缺叶文件与路径候选的区别。源条件是静态推导预期，未执行或仿真C82/Windows API；12条完整接受案例未执行。LP只关闭LF-U2选定源算法，不提升L01–L08或系统/三端/官方接受。

产品stage306，源码、完整测试/构建、VM/网络/账号/设备均无新操作。原40/81/37/10/6、owner/依赖/批次、四个本域就绪及统一A1..A4未通过状态保持。

<a id="launcher-functional-specification"></a>

## 登录器原范围与C82首次配置静态验收（2026-11-10）

[LF核验记录](../build/analysis/launcher-functional-specification-v1/validation.json)：复用11份完整原生Evidence，新增40E900/4329B0两份，13个原函数体/3161条独立指令与固定C82原PE字节比对；80个规则/端口节点及19已有操作身份复核，新补8条Config操作。LO的118个选定规则仍按原来源使用，不重称全需求或新完整Evidence工厂验收。新会话2记录已导出/快照并关闭，cleanup_pending=false。

6组原创纯模块对照通过，实际调用既有legacy Config/current patch纯函数7次，确认raw同步wait与C82异步策略不等价、15min及uint32环绕下patch仍未提醒；没有执行C82实现或源程序。4329B0 ABI纠正来自有界独立代码视图，原伪代码完整保留；两个子谓词内部未被此验收闭合。12个完整接受案例尚未执行。

L01–L08原范围/owner/依赖/批次/profile、40/81/37/10/6及G04/G08/G15/G17原就绪状态保持。产品仍stage306；没有源码改动、完整产品测试/构建、虚拟机/官方联网/账号/设备操作。统一A1..A4、整项登录器规格、L07当前同版消费与真实三端接受均未通过。

<a id="map-functional-specification"></a>

## G04来源/覆盖核验与定向夹具分层（2026-11-10）

102完整native记录的样本/profile/节点及原PE body范围已绑定，220项旧映射/字节观察重新对照原件；26规则和19共同合同节点组成36操作/4差异。6原创头布局夹具通过，另观察到1项已知窗口顺序差异；12条完整业务/平台用例未执行。

局部夹具采用Node26.9.0；失败的提取/collector选择/metadata兼容和遗漏synthetic selector尝试保留execution-record，最终收集和定向probe完成。产品无改动，未跑全仓产品测试/构建/原游戏/完整协议/真实设备或官方验收。新增一份地图规格，其余路径、原范围和14端口合同按冻结基线核对。

[地图操作规格](../analysis/capability-first-v1/game-map-functional-specification.json) · [来源核验](../build/analysis/map-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/map-functional-specification-v1/validation.json)

<a id="audio-functional-specification"></a>

## G08规格与来源核验，产品接受未运行（2026-11-10）

本轮验证42组旧事实、59个carrier文件和78处完整来源/派生绑定（67 native、11 derived），原PE body范围与节点/文件hash一致；另复用三份旧WAV/音乐source-check。34操作覆盖原三组G08行为，8差异各有现有端口/批次，12条用例仅提出、未执行。

G08本域fixed-source规格由false转true；G15/G17保持true，G02/G20及统一A1..A4保持false。产品stage306无改动，未运行产品构建/测试、原游戏、宿主实验、手机/微信或官方验收。仅新增一份公开音频规格；原scope/owner/依赖/批次/映射和14端口合同按冻结基线核对。

[音频操作规格](../analysis/capability-first-v1/game-audio-functional-specification.json) · [来源核验](../build/analysis/audio-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/audio-functional-specification-v1/validation.json)

<a id="browser-surface-observations"></a>

## 编码和音画实际后端的分层验收（2026-11-10）

最终10组观察完成，保留先前0组/6组失败回执及对应脚本前态。完整23940格/256 singles可回读，opaque hash、alpha差异、两字形度量、4 PCM/6声道/gain/loop和音频状态都有实际记录。独立核验另解原WAV、重算每浮点/完整表分类/原像素pattern及所有文档边界。

桌面1120×1100、390×844视口模拟有页面身份/非空/无overlay/交互/截图；0错误、1条明确的手势前autoplay警告、0其他警告及页面外部请求。命令为node build/analysis/browser-surface-conformance-v1/run.mjs（使用/opt/homebrew/bin/node）；原产品套件/构建未跑，真实设备/微信/可闻/官方未验。

[实测档案](../analysis/capability-first-v1/browser-surface-profile.json) · [来源与约束](../build/analysis/browser-surface-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-surface-conformance-v1/validation.json)

截图为原创测量页：

![桌面](/Users/lx/.codex/visualizations/2026/11/10/01a17a35-6c8e-7721-9ea5-8dc56564b109/a4-surfaces-2026-11-09T23-57-25-181Z-77529/desktop-surfaces.png)

![移动视口模拟](/Users/lx/.codex/visualizations/2026/11/10/01a17a35-6c8e-7721-9ea5-8dc56564b109/a4-surfaces-2026-11-09T23-57-25-181Z-77529/mobile-surface-viewport.png)

<a id="browser-host-observations"></a>

## Chrome实际原语、输入和重启的分层验收（2026-11-10）

10组实验/13范围通过；桌面1120×900与移动视口390×844的页面身份、非空、无overlay、console、截图和点击/输入/touch cancel均有证据。无console错误/警告、无外部请求，专用浏览器和loopback服务已关闭。前检尾标记失败单列，不计为浏览器测试成功。

实际运行命令：/opt/homebrew/bin/node build/analysis/browser-host-conformance-v1/run.mjs。Browser插件未提供，按frontend-testing-debugging使用已有Playwright。独立核验重读稀疏文件有限区间/原marker/事件与源码身份；产品测试/构建、真实设备/微信/官方均未运行。完整A1..A4/host_conformance仍false。

[宿主档案](../analysis/capability-first-v1/browser-host-profile.json) · [本轮约束](../build/analysis/browser-host-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-host-conformance-v1/validation.json)

截图仅为原创宿主夹具：

![桌面](/Users/lx/.codex/visualizations/2026/11/10/01a17a35-6c8e-7721-9ea5-8dc56564b109/a4-host-2026-11-09T23-28-50-756Z-76885/desktop-primitives.png)

![移动视口模拟](/Users/lx/.codex/visualizations/2026/11/10/01a17a35-6c8e-7721-9ea5-8dc56564b109/a4-host-2026-11-09T23-28-50-756Z-76885/mobile-viewport-touch-cancel.png)

<a id="required-entry-admission"></a>

## 限定入口和固定字节核验（2026-11-10）

本轮静态重核3301组声明区间、游戏656 body范围、99行callback值及1124原导航节点；647根、2768次代码出现、67/99/14/104/60结构、2非代码字段、14模板/84控件/10菜单节点分别验收。根原记录、候选边界、来源身份和受保护文档通过独立脚本核对。

本轮未执行产品测试/构建/浏览器/微信/真实设备/VM/官方连接；source byte match不升级为功能或服务器接受。A1限定台账复核true，完整业务准入/global gate仍false，A2保持，产品stage306/G15/G17原状态保持。

[入口台账](../analysis/capability-first-v1/entry-admission.json) · [来源与规格](../build/analysis/required-entry-admission-v1/specification.json) · [本轮核验](../build/analysis/required-entry-admission-v1/validation.json)

<a id="required-context-contract"></a>

## 原范围与共享接口规格核验（2026-11-10）

37全文/10完整behavior哈希及原映射逐项核对，47行处置和40能力范围保持；579个机械候选字段只作导航，不作语义闭合。五份RP/CT/IC/LO/MP规格定位保留15组设计、8增量、9owner、19操作边界及26个旧port名称，未将旧false当缺源。

独立合同14端口/62方法、8类型、3状态图、14失败边界、3目标profile、22项未执行验收已登记。文档检查覆盖来源identity/pointer、状态图完整性、committed不转cancelled、unknown只能inspect及旧资源drain边界；这些检查证明规格一致性，不证明产品功能或backend事务实现。

本轮原有14份文档更新并新增1份独立接口合同，产品stage306不变，无产品测试/构建/原程序/VM/设备/联机执行，无新REA函数查询。A2覆盖台账审定，A1/A3及A4完整host profile/实现/接受仍未过；G15/G17和全部原映射保持。

[共同接口合同](../analysis/capability-first-v1/shared-target-contract.json) · [47行范围复核](../build/analysis/required-context-contract-v1/reconciliation.json) · [本轮核验](../build/analysis/required-context-contract-v1/validation.json)

<a id="legacy-full-inventory-publication-validation"></a>

## 全量背包字段、发布和入场核验

固定 SE 复用 23 份 REA 函数档案。固定 Item 再复用 1 份全量接收档案。已核对 13 个字段索引、10 对数值写入宽度、两版接收入口及 SE 的两级状态表，新增 REA 查询为 0。 [原件与来源](../build/analysis/full-inventory-publication-v1/source-review.json)

本机夹具以内存端口核对全量和逐槽。全量包入场前后均解码且效果为空。等待本机角色时逐槽已能写背包，之后角色资料使场景就绪。对照还确认预置物品经过现有入场准备仍保留，逐槽不完整具名组按现有策略整体拒绝。34 项本机相关回归通过。 [本机对照](../build/analysis/full-inventory-publication-v1/local-comparison.json) · [核验清单](../build/analysis/full-inventory-publication-v1/validation.json)

新增的规格预期沿 OS-A01 和 GF-A05、GF-A07 验收。三端完整背包流程、实际原版运行和当前版尚待验证。 [验收用例](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/full_inventory_publication/acceptance)

<a id="legacy-se-craft-inventory-selection-validation"></a>

## 普通制造资料与提交的静态核验和本机对照

核对固定 SE 的 22 份已有 REA 函数档案、7 份独立派生视图及 2 份指令记录，另核四个原件范围。窗口 11、六个材料控件和开始控件按原表核对。新增 REA 查询为 0。 [原件、档案哈希和调用](../build/analysis/craft-inventory-selection-v1/source-review.json)

本机用内存端口以真实共享客户端和表单投影运行 16 条组合，现有相关回归 28 项通过。对照复现全量包无物品发布、编辑态同槽重查、计时中换位送旧槽，以及材料名跟随当时槽位。夹具接收制造结果后重试，确认原材料位已经清空。 [本机组合](../build/analysis/craft-inventory-selection-v1/local-comparison.json) · [回归记录](../build/analysis/craft-inventory-selection-v1/related-tests.log)

OS-A01、WK-T07、WK-T08 记录预期原版行为、实际显示与提交文本的验证条件。原版动态、三端完整产品、当前同版与官方结果仍待验收。 [验收条件](../analysis/capability-first-v1/game-work-functional-specification.json#/inventory_material_selection/acceptance) · [本轮核验](../build/analysis/craft-inventory-selection-v1/validation.json)

<a id="legacy-se-trade-inventory-confirmation-validation"></a>

## 经典交易报价、背包发布和确认核验

重核 21 份留存 REA 函数档案、13 份独立派生视图、2 份指令记录、1 处旧格式化记录，以及三处直接原件指令范围。核到 35 个调用点和窗 43 的发布、确认、撤回与本方投影登记。新增 REA 查询为 0。 [来源核验](../build/analysis/trade-inventory-confirmation-v1/source-review.json)

用现有客户端、会话和微信投影在内存端口运行 18 组编辑或发布后更新的用例。全量和未选槽更新保留现有确认条件。所选槽的逐槽更新、清除和换位使现有确认被拒绝，并保留已发布的显示快照。5 项相关客户端回归通过，stage306 生成 Page 在本机对端完成原交易流程，核对两次确认、撤回和退出。 [本机组合](../build/analysis/trade-inventory-confirmation-v1/local-comparison.json) · [生成 Page 回执](../build/analysis/trade-inventory-confirmation-v1/related-generated-page.log)

统一实现后的验收沿 OS-A01、OS-A27、OS-A28、SW-AC7、SW-AC8、SW-AC12。原版动态、三端完整产品、当前同版与官服验收仍待执行。 [验收条件](../analysis/capability-first-v1/game-trade-storage-contract.json#/inventory_confirmation/acceptance) · [本轮核验](../build/analysis/trade-inventory-confirmation-v1/validation.json)

<a id="legacy-se-trade-pet-gold-validation"></a>

## 经典交易宠物位置、金额与结果核验

复用 13 份完整 REA 函数、20 份派生视图及已核输入和交易规格。三处直接原件范围、七个经典控件、七个接收字面量及 37 条直接调用均匹配。另核第二套窗的登记、索引 2 的间接调用以及所选发布分支先发后调用。新增 REA 查询为 0。 [来源与字节](../build/analysis/trade-pet-gold-v1/source-review.json)

现有共享客户端、会话与微信界面投影以本机内存端口运行 29 条用例。16 条核宠物更新在编辑和发布后的差异，10 条核持有金额与报价，3 条核对方撤回后结果关闭或本地退出并重开。四项宠物现有回归通过。普通资料发布及重开回执可复用，已发报价的确认和重新发布差异随 D0/D3。 [本地组合](../build/analysis/trade-pet-gold-v1/local-comparison.json) · [宠物回归](../build/analysis/trade-pet-gold-v1/pet-tests.log)

原版动态、实际微信和两端网页的完整交互、当前同版及服务端结算留在 OS-A27、OS-A28、SW-AC7 和 SW-AC12。 [验收条件](../analysis/capability-first-v1/game-trade-storage-contract.json#/classic_trade_pet_and_gold/acceptance) · [本轮核验](../build/analysis/trade-pet-gold-v1/validation.json)

<a id="legacy-se-alternate-trade-gold-validation"></a>

## 第二套交易窗的发布、金额和相位核验

复用 8 份 REA 函数档案和 2 份独立派生视图。两次 REA 函数查询返回找不到过程。在临时 Ghidra 副本从已知调用与回调地址导出 2 个函数视图，共 533 条指令、2,124 字节，逐条核对固定 SE 原件。31 条直接调用及 113 处指令位置通过，原分析工程哈希一致。导出已完成，回执生成器按当前 Python 版本修正后从已核导出物恢复回执。 [原件与分派](../build/analysis/alternate-trade-gold-v1/source-review.json) · [派生回执](../build/analysis/alternate-trade-gold-v1/derivation-receipt.json)

现有共享核心用两物品、两宠物和已存金额做本机对照。实际输出两段槽位配对，格式器能编码源回调所需的两段缓存槽列表。覆盖余额降低前后发布、拒绝确认、显式撤回与重发、500/501 毫秒和相位。两项现有交易回归通过。 [共享对照](../build/analysis/alternate-trade-gold-v1/local-comparison.json) · [回归日志](../build/analysis/alternate-trade-gold-v1/trade-tests.log)

第二套窗的普通激活、原版实际输入、三端完整产品与当前同版结算继续留在原用例。 [验收条件](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_gold/acceptance) · [本轮核验](../build/analysis/alternate-trade-gold-v1/validation.json)

<a id="legacy-se-alternate-trade-selection-validation"></a>

## 第二套交易窗的选中、取放与缓存刷新核验

复核 10 份留存 REA 函数与 3 份旧派生视图。五次 REA 查询取得三个完整函数。其余两处用已核登记或直接调用补出派生视图，共 790 条指令、3,201 字节。37 条直接调用和 136 处指令位置匹配原文件。临时 Ghidra 工程已退役，原分析工程哈希一致。 [函数与原字节](../build/analysis/alternate-trade-selection-v1/source-review.json) · [派生回执](../build/analysis/alternate-trade-selection-v1/derivation-receipt.json)

用现有共享客户端、会话和微信界面投影验证草稿改选、发布后拒绝改选、显式撤回及阶段。普通物品所有者复现默认移动参数 −1、数量 3 和参数 0 拒绝。活动交易下的普通移动返回 `LEGACY_GAME_TRADE_CONTEXT`。四项相关现有回归通过。 [本机对照](../build/analysis/alternate-trade-selection-v1/local-comparison.json) · [回归日志](../build/analysis/alternate-trade-selection-v1/related-tests.log)

源规则条件覆盖缓存资格、双击和单击、数量确认前后及资料换位。原版活动窗口、三端实际操作和同版结算继续留在 OS-A01、OS-A27 与 SW-AC9。 [验收条件](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_selection/acceptance) · [本轮核验](../build/analysis/alternate-trade-selection-v1/validation.json)

<a id="legacy-se-mail-attachment-refresh-validation"></a>

## 背包刷新与邮件附件核验

固定 SE 原件与独立指令复核覆盖 9 份留存 REA 函数、14 份派生视图、2 份指令记录、110 个指令定位和 48 个直接调用。新增 REA 查询为 0。表位核对个人 45 号选择页、49 号提交、50 号网格和家族 87/86。 [字节与调用证据](../build/analysis/mail-inventory-selection-v1/source-review.json)

原创本机回包夹具确认 `?<E` 解码后未改背包，`?l)` 更新和清槽、`@Y)` 换槽均返回变更槽，`:+(` 有编码，`(>#` 尚缺目录项。相关本地回归通过 33 项，其中物品/宠物客户端回归 2 项。 [回包对照](../build/analysis/mail-inventory-selection-v1/local-comparison.json) · [本地回归](../build/analysis/mail-inventory-selection-v1/local-tests.log) · [客户端回归](../build/analysis/mail-inventory-selection-v1/client-tests.log)

同槽换物、无有效物品、经典草稿恢复与另一套缓存重用的预期已入原用例。完整原版流程、三端实际操作及当前同版结果待验。 [规格用例](../analysis/capability-first-v1/game-mail-data-contract.json#/inventory_refresh_and_attachment_selection/acceptance_extensions) · [核验清单](../build/analysis/mail-inventory-selection-v1/validation.json)

<a id="mail-operation-composition"></a>

## 邮件客户端操作与重置规格核验（2026-11-10）

13份完整旧native按现装REA记录工厂逐份往返；13范围7,117字节/2,031指令，21个独立派生视图22范围13,338字节/3,688指令另计，全部按固定37c4原件复核；34视图合计495个直接E8。4E1CF0六实际存储、4E1D20原E9尾跳和已核bulk/计数范围分别核对。

50操作、14组规则、9组未实现差异、27项未执行验收条件已登记。定位输出保留六份元数据输入边界，以及292源码路径中24文件/44片段/6条catalog声明、15个旧owner和1个cleanup引用；不由字面零匹配推全项目缺失。

G20只推进客户端操作规格，最终结果同版关联仍缺证，整域ready不变；G15/G17保留。40/81/37/10/6、所有者/依赖/批次/登记保持，产品stage306，无产品测试/构建或VM/三端/联机验收。REA保持关闭，本轮未新开调查会话。

[邮件操作规格](../build/analysis/mail-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/mail-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/mail-operation-composition-v1/validation.json)

<a id="chat-operation-composition"></a>

## 聊天原范围规格与文档核验（2026-11-10）

38份完整旧REA体按现装记录工厂逐份往返，39个native范围18,128字节/5,384指令及512直接E8核原件；1个明确旧派生体1122字节/345指令另计。5组精确引用/54条指令和21处typed写/RMW、PE虚拟尾部与六组bulk范围独立核对。

36操作、12组规则、8组现有实现差异、24项未执行条件已登记；35模块哈希保持，复用292条旧定位引用，补25个小片段，没有重建全部映射。REA会话导出214记录，新快照保存，最终open=false/cleanup_pending=false；未把全会话214条都宣称已逐条语义验收。

当前仅G15固定profile局部规格ready推进，G17保留；40/81/37/10/6与owners/deps/batch/登记映射不变。产品stage306，无产品测试/构建或VM/设备/联机观察；A1..A4及完整目标未完成。下方历史“G15待合表”由本节和当前矩阵承接。

[操作规格](../build/analysis/chat-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/chat-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/chat-operation-composition-v1/validation.json)

<a id="game-application-exit"></a>

## 正常应用退出与日志规格核验（2026-11-10）

14份完整native（6新/8复用）通过现装REA记录工厂逐份往返，15范围10,447字节/2,923条LLVM指令与264条直接E8核原件；6个明确独立视图355字节/141指令另计。两组终止表及CloseHandle/SetUnhandledExceptionFilter IAT绑定匹配。9次函数请求含3次未定义结果，未将失败当规范证据。

已导出155记录并保存新快照，REA最终open=false、cleanup_pending=false。14行来源/宿主边界、3组未实现合同差异及16项未执行验收条件已登记。无产品测试/构建或原程序/VM/账号操作，产品仍stage306；G15整体、A1..A4、真实三端/同版接受与完整目标未完成。原40/81/37/10/6范围、已就绪G17和G02材料缺证保持。

[退出规格](../build/analysis/game-application-exit-v1/specification.json) · [原件与来源](../build/analysis/game-application-exit-v1/source-views.json) · [本轮核验](../build/analysis/game-application-exit-v1/validation.json)

<a id="character-operation-composition"></a>

## 角色域操作规格核验（2026-11-10）

本轮没有产品测试/构建或原版/VM/网络/账号操作。33份完整旧native记录由现装REA6.7.0工厂逐份往返且字段不变；33体17,651字节、4,940条Apple LLVM21.0.0指令及439条直接E8核原件。另核三张14项预览表、5条短警告文本；旧大型载体只为取已知原记录有界读取，不作新函数查询或快照导入。

24行操作、原5条范围、4组实现/宿主政策差异和23项未执行验收条件已登记。类别7材料源CH-U1、工作服务端删除、共享宿主整合及真实三端/同版接受仍未完成；G02整体与全局门槛不提升。当前产品stage306、G17局部就绪及原40/81/37/10/6和既有实现保持，授权文档与源/引用核验见回执。

[操作规格](../build/analysis/character-operation-composition-v1/specification.json) · [已有源视图](../build/analysis/character-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/character-operation-composition-v1/validation.json)

<a id="capability-specification-audit"></a>

## 当前40项审定核验（2026-11-10）

本轮复用既有REA，未新查询或反编译。四个既有派生回调4A7CA0/4A7D20/4A7D30/4A7E10共1,720字节、495指令及58项留言板字节声明重新匹配固定37c4；4E1CF0完整原记录、43字节及六项写入复用。G17六项功能规格就绪，12项验收条件仅已指定，本轮未执行产品/原版用例。

40范围/依赖/所有者/profile、81注册、37复合、10消费者以及原实现批次按前态核对；只更新授权文档，产品仍stage306。A1..A4、共享差异、真实三端/同版官方接受及完整目标仍未完成。文件与规则引用、前后范围及产品不变核验见下方回执；没有产品变化，不运行测试或构建。

[当前逐能力审定](../build/analysis/capability-specification-audit-v1/specification.json) · [来源补充](../build/analysis/capability-specification-audit-v1/supplemental-source-views.json) · [本轮核验](../build/analysis/capability-specification-audit-v1/validation.json)

<a id="capability-first-validation"></a>

## 当前：统一能力分析的入口取证与字节核验

<a id="capability-first-batch-review"></a>

### 能力组复用对账（2026-11-14）

本次按待判定的开发决定复核排程，确认 21 项未齐能力在六组中各有一条排程归属。40 项原需求和 D0–D6 的七个开发批次继续沿原矩阵。固定 SE 工作上下文已用一份规格交接给背包、技能及窗口，外层调度仍随 WK-U1。分析和产品验收继续按各自证据核定。 [排程与估时](development-plan.md#capability-first-estimation) · [本批核验](#fixed-se-work-context-publication-validation)

共用资源规格复核沿用三份桌面回执。真实 ZIP 双库试次记录在途图块、音频和候选准备内存，受控配额试次记录候选准备与发布中止后活动根仍保留，持久化双版本试次记录旧根由 `busy` 到排空后回收。沿这三份回执把重复排入分析的工作并回已交接规则。产品组合、移动宿主及真机结果沿原 D5 用例验收。 [资源工作集与退役](architecture-and-milestones.md#resource-budget-retirement) · [拒写与重试](architecture-and-milestones.md#browser-update-quota) · [版本隔离与物理排空](architecture-and-milestones.md#browser-resource-version-isolation)

固定 F5A 的置顶和候选管理使用同一样本及工具版本。两份来源审查的 7 个共同函数均使用相同 REA 证据 ID，后批标记为复用。前批 54 个通过用例标题全部出现在后批的 92 个标题中，两次测试运行本身均在 0.3 秒以内。两批准备至规格核验的经过时间分别为 993.06 秒、1,431.14 秒，其中 REA 查询分别记录 93.65 秒、188.11 秒。当前对账依据已有回执，能力组节时仍需同口径实测。 [置顶核验](#f5a-pin-publication-validation) · [候选管理核验](#f5a-candidate-management-validation)

<a id="capability-first-effort-check"></a>

#### 批次用时的适用范围（2026-11-15）

窗 26 的新批次把 BF-D1 关窗与 BF-T36 暂存读写放在同一份写入清单中，复用同源函数和两组既有超时夹具。复刻差异仍沿现有帧和结果所有者登记。工时对比按同范围规则、实际补查、差异和回归用例核算，完整交付节时继续随开发批次记录。 [本批复用核验](#battle-266-window-draw-retirement-validation)

<a id="capability-batch-readiness-validation"></a>

**六组对账。** 40 项当前能力中 19 项已有固定样本本域规格，另外 21 项均核到六组排程和原规格。已将第二套窗口的三个外层分派缺口接到同一证据条件。决策来源含已存的桌面、移动模拟器和微信游客工程回执，以及登录器、角色、邮件和战斗的固定样本记录。护卫槽的三处新读取与六组本机对照已并入 BF-D7。覆盖复核通过，必要来源、宿主条件和完整产品验收继续沿各门槛核对。 [对应排程](development-plan.md#capability-first-scheduling) · [核验记录](../build/analysis/capability-batch-readiness-v1/validation.json)

从同口径的准备至核验回执核对四组。F5A 置顶为 16 分 33 秒，F5A 候选管理为 23 分 51 秒，固定 SE 数量偏好为 21 分 46 秒，固定 SE 背包数量窗为 14 分 44 秒。两份 F5A 回执的共同来源和用例按原集合去重。此区间用于校准已有同版材料和入口的类似分析。其余组等待材料、开发和三端验收采用各自的实际回执，完整总工期与节省比例待校准。 [两组 F5A 的对账](#capability-first-batch-review) · [数量偏好](#fixed-se-stack-quantity-input-preference-validation) · [数量窗](#fixed-se-alternate-inventory-quantity-validation) · [本次范围和引用校验](../build/analysis/battle-266-window-control-writes-v1/validation.json)

本轮复核流程、六组的能力覆盖和首批四处窗口规格引用。将 `9/252` 已证的两次更新和同号打开组合为一项静态预期，训练、工艺、图鉴沿原用例验收。核对固定 Item 来源和已有用例编号。原版及目标产品的组合用例待执行，统一分析门槛继续待通过。 [窗口共用用例](game-static.md#legacy-item-classic-open-transition) · [范围与哈希核验](../build/analysis/capability-first-batch-review-v1/validation.json) · [首批安排](development-plan.md#capability-first-next-analysis)

本次流程复核对账 4,858 个基线文件。能力清单 40 项，其中 19 项有固定样本本域规格。抽查 SKL266 的下一帧首次读取，明确哪些结果会改变 BF-D7 和 BF-T36，实际取证仍待执行。同版交接的行为缺证继续列为分析项，设备和真实会话执行沿 D5/D6 验收。A1–A4 待通过。 [执行流程](development-plan.md#capability-first-workflow) · [当前取证](development-plan.md#capability-first-next-analysis) · [估时口径](development-plan.md#capability-first-estimation)

最新复核以 40 项矩阵核对六组排程，19 项固定样本本域规格之外的 21 项均有归属。已把经典战斗关窗差异收进窗口规格，并复核网页和微信现有资源选择及本机缓存入口。资源归档、网页缓存、微信双槽和更新日志的 68 项现有本机用例通过。完整持久化路径、产品接线与真机沿原 UH-U01 至 UH-U04，当前同版游戏读取交接仍是来源缺口，测试账号影响联合实测。项目知识库查询缺 `requirement-index`，本次按仓库内的需求索引和矩阵对账。F5A 的两批现有记录可校准同类列表操作，总工期及节时比例待按能力组与 D0 的实测校准。 [当前排程](development-plan.md#capability-first-next-analysis) · [本机回归](../build/analysis/battle-266-classic-window-frame-v1/resource-regression.log) · [基线与引用核验](../build/analysis/battle-266-classic-window-frame-v1/validation.json) · [前序复用对账](../build/analysis/capability-first-batch-review-v1/validation.json)

本次对照 4,858 个基线文件，核实 40 项能力、19 项固定样本本域规格及原登记覆盖。将 X03–X06 的下一组取证落到退役、发布和新启动读回，并从留存 REA 档案重核 `Ww~` 的固定样本身份和 `4EC670` 的 321 字节，归入 ST-08。此次核验覆盖流程、规格引用和历史用时回执。 [分析排程](development-plan.md#capability-first-next-analysis) · [工时口径](development-plan.md#capability-first-estimation) · [固定样本证据](../analysis/capability-first-v1/game-entry-review-source-check.json#/state_consumer_closure/bodies/7)

流程复核按 40 项能力和六组排程核对现有范围。19 项已有固定样本本域规格，余下 21 项沿各原规格跟进。下一组指向目录选择和恢复的宿主回执。核验本轮文档、取证结果、链接和 stage306 基线，统一分析准入与项目节时仍待判定。 [本轮收尾核验](../build/analysis/launcher-exit-confirmation-order-v1/validation.json) · [剩余能力排程](development-plan.md#capability-first-scheduling)

<a id="capability-first-operation-handoff"></a>

#### 按完整操作交接现有规格

复核固定 Item 和 SE 的十种经典训练模式及 14 个现有操作条目。人物训练、宠物训练、治疗分别使用 OS-A23、OS-A24、OS-A25，共用分派、状态发布和退役。原案 OS-A26 仍等第二套窗口实际帧调用。首批保留窗口、工艺、图鉴的原缺口和用例。随后复用已有取证，完成固定 F5A 所选普通回复至交接发布的静态核对。 [训练交接](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/classic_training_operation_coverage) · [普通启动核验](#f5a-ordinary-handoff-validation)

以 4,858 个基线文件核对当前工作区，复核范围映射、来源、规格引用及两份 F5A 回执。此次复核复用已有 REA 及回归记录。A1–A4 继续待通过，实际运行和三端验收沿原用例。 [核验回执](../build/analysis/capability-first-operation-handoff-v1/validation.json)

**2026-11-13 流程复核**。核对 40 项能力、19 项固定样本本域规格、六个来源及 81／37／10 项原登记。按 4,858 个文件的基线校验，差异均在文档和规格中。新增引用及所选战斗规格的两份回执摘要均匹配。统一分析门槛继续待通过。 [开发顺序](development-plan.md#capability-first-workflow) · [用时依据](development-plan.md#capability-first-estimation) · [本地对照](#battle-266-cleared-frame-read-validation)

本次流程复核逐项对账 40 个能力域、81 项登记、37 条历史要求、10 个消费者组及 6 个来源。六个分析组恰好覆盖 19 项固定样本本域规格以外的 21 项，X02/X03/X06 的直接依赖数分别为 8、4、5。核对流程入口和七个开发批次，并按上轮基线校验 4,837 个文件。统一分析门槛仍待通过，本次验收范围是流程文档和引用。 [当前流程](development-plan.md#capability-first-workflow) · [缺口排程](development-plan.md#capability-first-scheduling) · [能力矩阵](../analysis/capability-first-v1/capability-matrix.json)

**2026-11-11流程复核**：本轮仅核对文档、引用、范围和产品基线。开发前A1–A4核必要规格与设计约束；共享实现、本地产品、实际三端/设备及当前同版官方接受继续分别记录。没有新REA查询、原程序/VM/SDK运行、产品测试或构建，不能据文档核验提升能力就绪或完整目标。[本轮核验](../build/analysis/capability-first-workflow-review-v1/validation.json) · [当前流程](development-plan.md#capability-first-workflow)。

**本批来源/范围核验**：8新规范1197B加旧40F430组合1351B，共2548B/855条LLVM指令、87条直接E8；五短文字/三导入与实参锚点核原PE。8新dossier、旧batch和两个primitive共11完整REA记录通过factory，不能据此称旧根为新规范或整个bundle另做factory导入。924旧record复用至932并导出/保存快照，session关闭且无cleanup。6事实组/4问题/12未执行用例/2合并差异保持边界；无产品测试构建、VM/原程序、网络账号或设备操作。 [缺文件准备规格](../build/analysis/launcher-missing-patcher-v1/specification.json) · [核验](../build/analysis/launcher-missing-patcher-v1/validation.json)

**本批静态合成验证**：10合同118原字段、10来源元数据与24相关规格保留hash/pointer；22选定body声明25范围15,203B核固定C82 PE。19行各有成功/失败/取消关闭/晚到/重开及来源，9所选覆盖链、6开发差异与原40/81/37/10/6核对。当前55模块的一层依赖/1,602原片段由机械定位核对；只验证来源/文档范围，没有产品测试构建、原程序/VM、账号网络或设备操作。 [操作规格](../build/analysis/launcher-operation-composition-v1/specification.json) · [核验](../build/analysis/launcher-operation-composition-v1/validation.json)

**所选静态规格核验**：6份完整native通过REA工厂解析，4旧派生与原PE/LLVM逐指令一致，共4,499B/1,223指令；两独立leaf共9B/4指令，149条直接E8另核。两窗口/四控件/三文字载荷/五短字符串和当前9文件36片段均核身份；8事实组/6未执行案例/3差异保持条件边界。仅来源/规格/文档范围验证，无产品测试/构建、VM/原版/网络账号或设备操作。 [来源合同](../build/analysis/battle-observer-entry-contract-v1/specification.json) · [核验](../build/analysis/battle-observer-entry-contract-v1/validation.json)

**本批前沿引用与范围核验**：40行原scope/owner/依赖/profile/登记及12packet/81/37/10/6保持，10选定覆盖关系均引用既有原文和规则。145战斗元数据文件及17匹配字段、已有入口索引逐项核身份；hash/observer词偶然命中单列。仅做静态引用/路由和文档范围核验，无新REA查询/反编译、产品代码/产品测试构建、原版/VM、账号/设备或官服操作。 [当前前沿](../build/analysis/current-frontier-supersession-v1/specification.json) · [核验](../build/analysis/current-frontier-supersession-v1/validation.json)

**本批共享占用静态核验**：21完整旧REA记录经现装Evidence工厂保持原样通过，5旧派生独立保留；13,123B/4156冷指令/295直接E8和6组表绑定匹配。3当前模块有限提取保存32片段，8组事实/9行条件表保留两条未运行pending动画推断。只核来源/文档范围，没有产品代码、产品测试/构建、原版/VM、账号、设备或官服操作。 [组合规格](../build/analysis/shared-occupancy-composition-v1/specification.json) · [核验](../build/analysis/shared-occupancy-composition-v1/validation.json)

**本批数量prompt静态核验**：12完整旧REA记录经现装Evidence工厂保持原样通过；13旧派生独立保留。10,440B/3225冷指令、168直接E8、6B/2指令叶体及48控件表匹配，九/七PUSH与参数归属另核。8事实/4流程、2条条件推断及1规则纠正不等于原版运行。无产品代码、产品测试/构建、VM、账号、设备或官服操作。 [数量框规格](../build/analysis/quantity-prompt-lifecycle-v1/specification.json) · [核验](../build/analysis/quantity-prompt-lifecycle-v1/validation.json)

**本批输入/退出静态核验**：7完整旧REA记录经现装Evidence工厂无改动通过，13旧派生保持独立来源；12,047原字节、3265冷指令/268直接E8及14表行/6短串核对。14旧规格/后续合同及7当前输入/宿主模块由有限提取定位，10组规则/6条流程/1开发差异保留未执行接受用例。无产品代码、产品测试/构建、原版/VM、账号、设备或官服操作。 [整链规格](../build/analysis/battle-input-exit-contract-v1/specification.json) · [核验](../build/analysis/battle-input-exit-contract-v1/validation.json)

**本批静态闭包与条件对账核验**：5完整旧Evidence通过现装工厂，仍明确435000规范body仅28B；旧主派生回调单列。461B独立直接CFG含138指令/38E8/2RET，旧/新范围去重后67,329原字节，旧体17,766冷指令/E82272；三份107格式头匹配。9份合同及crosswalk有限metadata、13当前模块身份另核。7事实/6条件行不代表完整业务或正常native执行；无新REA函数查询/反编译、产品代码/产品测试构建、原版/VM/账号/设备/官服操作。 [本批规格](../build/analysis/battle-preflight-boundaries-v1/specification.json) · [核验](../build/analysis/battle-preflight-boundaries-v1/validation.json)

**本批静态来源与差异核验**：17体/124,931字节、33,035冷指令、3,340直接E8核原PE；13动作表槽、9所选状态窗和group5的16表项匹配，15完整原记录通过现装REA工厂。两份旧派生与原生权威分开，旧293MB载体只流读保留两份完整记录；无新REA函数查询/反编译。11事实、7借用规则、4代码观察/4未实现差异及12未执行用例分别登记。产品stage306，无产品代码、产品流程/测试/构建、原版/VM/资源包/账号/设备/官服操作；静态通过不提升统一或真实接受门槛。 [本批规格](../build/analysis/battle-utility-consumers-v1/specification.json) · [核验](../build/analysis/battle-utility-consumers-v1/validation.json)

**本批静态对照核验**：原4753路径基线先核无差异；复用51规格和49后续source-check的选定字段，独立机械清单复核8模块/profile导入、110解析与108声明路由并集，父线程再核实际分派与12/267回退。旧派生4260B0的54,685字节/14,120指令核PE，3冷读窗776字节另列；无新REA函数查询/反编译。原40/81/37/10/6范围、全部旧文档层与产品stage306保持。仅静态metadata/来源/引用/差异核验与纯profile导入，无新产品流程、测试/构建、原版/VM/真实资源/账号/设备/官服操作。 [本批对照](../build/analysis/battle-variant-coverage-v1/crosswalk.json) · [核验](../build/analysis/battle-variant-coverage-v1/validation.json)

**本批仅静态来源核验**：37视图/21,459字节、6,540冷指令和443直接E8逐项核原件，66 typed refs按opcode保留（其中60处在所选体外，仅解码，未提升owner语义）；15完整规范记录通过现装REA工厂。两次独立Ghidra导出均实际exit0，原项目/样本hash不变。149 Evidence/72 primitive中133导入记录保持、会话已关闭；18请求含2次无procedure错误，成功新观察16。11事实/4借用规则/3代码观察/3未实现差异、12未执行用例分开；无产品测试/构建、原版/VM/真实资源/账号/设备/官服操作。[来源核验](../build/analysis/inventory-selection-ownership-v1/validation.json) · [本批规则](../build/analysis/inventory-selection-ownership-v1/specification.json)

**前组规格对账核验范围**：以4753文件基线核40能力原范围/依赖/owner/profile/登记，246处保留规则引用、82条共享历史原记录和三份独立metadata清单；另核24token当前源码分派及保留源规格引用。仅静态引用/原文/身份/改动范围复核，无新原生函数查询、产品测试/构建、原版/VM/真实资源/账号/设备/官服操作。产品stage306、统一source gate与完整目标均未完成。[本轮核验](../build/analysis/capability-source-reconciliation-v1/validation.json) · [逐项对账](../build/analysis/capability-source-reconciliation-v1/reconciliation.json) · [战斗命令对照](../build/analysis/capability-source-reconciliation-v1/battle-command-crosswalk.json)

**前组状态消费者核验**：29体/13,821字节/3,780指令/443 E8及54 typed refs、552辅助字节/96 descriptor/10初值/68 float核原件；586条旧快照完整流读，24旧体/5新规范且无新派生。133 Evidence/70 primitive、114导入保持已关闭。576源码有界检索含400行上下文，40域/49缺口metadata及3组未实现差异分栏。无产品测试/构建、原版/VM/账号/设备/官方接受，stage306与完整范围保持。[合同](../analysis/capability-first-v1/game-entry-review-contract.json) · [核验](../build/analysis/particle-lifecycle-contract-v1/validation.json)

**当前委派消费者核验**：4753文件匹配基线上复用45视图/8817字节：8完整旧记录、31旧派生、6必要新规范。1506派生指令逐条核原字节，167直接E8、5描述符及130控件另核；17导入REA记录原样保持，新导出/快照23且open=false/cleanup_pending=false。14组事实、8未执行验收提案；40/81/37/10保持，产品stage306及代码/接口/解析器未改。未执行原游戏、VM、账号/真实资料、产品测试/构建、设备或官服。[本批审计](../build/analysis/service-receiver-consumers-v1/validation.json) · [源视图复现](../build/analysis/service-receiver-consumers-v1/collect-source-views.py) · [规则复现](../build/analysis/service-receiver-consumers-v1/derive-specification.py)

**当前37接收补证核验**：从4753公开文件匹配基线复用20份REA完整原记录与17个旧派生体，37原PE范围/7421字节、全部721派生指令及37个标签存储词/148字节匹配，原记录与旧投影逐字段对应。完整父包按记录流式读取，未重新反编译/开启原生会话；337源文件有限检索与三段标准接收函数人工复核分开。9类规则、6项未执行验收提案保留40/81/37/10原范围，历史72根审计单独保留。产品代码/接口/解析器、stage306未改，未运行产品测试/构建、VM、账号/真实资料、设备或官服。[本批审计](../build/analysis/receive-publication-review-v1/validation.json) · [来源复现](../build/analysis/receive-publication-review-v1/select-retained-sources.py) · [规则复现](../build/analysis/receive-publication-review-v1/derive-receive-review.py)

**当前40域复核验收**：4,753文件基线上逐行保留40域范围/依赖/版本/状态，核对204个不同的显式引用文件，无缺文件；按11组归并必要缺口。现有源码仅做AST与字面目录静态比较，104接收划分为52效果guard、7其他operation guard、8解码控制和37限定待核项；37项均有旧源索引，不是缺功能结论。两份派生脚本须重放字节一致。原81登记/37历史复合记录/10消费者组及全部门槛保持；本批无新原生REA查询、产品代码/接口/资源格式变更、产品测试/构建、VM、真实资料/账号、设备或官服运行，基线仍为stage306。[审计回执](../build/analysis/capability-readiness-review-v1/validation.json) · [输入身份](../build/analysis/capability-readiness-review-v1/source-inputs.json) · [离线审计脚本](../build/analysis/capability-readiness-review-v1/audit-readiness.py)

**本批重建规则核验**：4,753文件基线上补现行共用规格；15份完整原记录/2,170字节逐份验收，64 CALL/4尾跳/1回调指针及四坐标核原件。REA17条中7导入、10本批，已关闭。共用规格累计16组事实和16项未执行用例；修正过渡入口/实际构造时机。产品代码/接口/解析器、40/81/37/10及stage306保持，未运行产品测试/构建、VM、真实资料/账号、设备或官服。[审计](../analysis/capability-first-v1/dispatch-bindings-validation.json) · [离线重放](../analysis/capability-first-v1/derive_dispatch_bindings.py)

**本批共用状态核验**：在4,753文件基线上复用既有分派规格。18视图/10,901字节、12完整原记录逐份验收、5旧派生756指令与128条候选Listing均核原字节；20辅助CALL、36有限MOV目的和主状态/恢复分支绑定。REA导出/快照各7条（3导入、4本批）并关闭。8组来源事实、8项未执行验收提案；产品代码/接口/解析器未改，未运行产品测试/构建、VM、真实资料/账号、设备或官服。40/81/37/10及stage306保持，统一门槛未通过。[审计](../analysis/capability-first-v1/dispatch-bindings-validation.json) · [来源重放](../analysis/capability-first-v1/derive_dispatch_bindings.py)

**2026-11-09 流程复核**：本次仅收紧已有计划的旧证据查重、能力规格停止条件、统一门槛、差异实现和成组验证；40域、81协议登记、37历史要求及10消费者组保留，未提升规格/接受状态。检查当前文档引用、JSON及历史段落保留；663份代码/工具/范围文件前后哈希一致。REA进行中材料已导出17条记录并保存快照、正常关闭；邮件补证未宣称完成。未运行产品测试、构建、VM、设备或官服流程，产品基线仍为stage306；本次不据此推算整体节时比例。[流程核验回执](../build/analysis/capability-workflow-review-v1/validation.json) · [执行约束](development-plan.md#capability-first-execution)

本组在4,753文件基线上补充既有[名片/邮件规格](../analysis/capability-first-v1/game-mail-data-contract.json)，保留原122视图与全部登记，新增16视图后共138视图/56,176字节。8份完整原记录逐份验收（1复用、7新观察），四旧派生复用、四新派生165指令/509字节；累计71原记录、9,553派生指令、996处CALL和69调用/指针/尾跳恢复锚。34直接字面引用、四行/业务描述符与保存栈通过；两批REA各4/3并关闭。33组事实、五组必要缺口、40项未执行提案用例；产品代码/接口/解析器未改，产品测试/构建、VM、真实资料/缓存/账号、设备或官服均未运行。40/81/37/10及统一门槛保持，产品基线stage306。[当前审计](../analysis/capability-first-v1/game-mail-data-validation.json) · [离线复现](../analysis/capability-first-v1/derive_game_mail_data.py)

本组从4,743份公开基线继续，完成[聊天与实际名片来源/邮件发现合同](../analysis/capability-first-v1/game-chat-social-contract.json)。117入口/77,337字节、3,741选定派生指令、2,149处CALL、179控件/五现代行及64旧读窗核验；103完整原记录逐份验收。2新REA/3新独立派生，另重复107字节不计新语义，导出/快照各2并关闭。原39/81/37/10保留，G20补至40域。无原程序/VM/真实聊天名单邮件/账号、产品测试/构建/设备或官服运行；14用例仅提案，统一门槛未通过。[审计](../analysis/capability-first-v1/game-chat-social-validation.json) · [离线复现](../analysis/capability-first-v1/derive_game_chat_social.py)

当前本组从4,688份公开基线继续，形成[手动数字输入与宠物加点来源合同](../analysis/capability-first-v1/game-ui-producers-contract.json)。903条新宠物指令/3,211字节、数字回调32指令/91字节、7个复用派生体/3,288字节、20字节跳转表和窗口42的描述符/控件核原件；规范体按固定来源身份绑定，非独立运行内存捕获。1,703条旧证据保持，新导出1,706并关闭；没有新REA函数反编译或新快照。原程序/VM/账号、产品回归/构建/设备流程均未运行，产品接口/资源格式及stage306不变。[阶段审计](../analysis/capability-first-v1/game-ui-producers-validation.json) · [离线复现](../analysis/capability-first-v1/derive_game_ui_producers.py)

当前本组从4,683份公开基线继续，完成[21发送来源上下文合同](../analysis/capability-first-v1/game-producer-context-contract.json)。9个复用派生体的4,022条指令/13,799字节及15处独立CALL匹配原PE；规范范围按固定来源绑定，9个新体/6,628字节不冒充独立运行内存核验。旧1,676证据全记录保持，新导出1,703；REA已关闭且cleanup_pending=false，未另建快照。原程序/VM/账号、产品回归/构建/设备流程均未运行；产品代码/接口/资源格式和stage306基线保持。[本组审计](../analysis/capability-first-v1/game-producer-context-validation.json) · [离线复现](../analysis/capability-first-v1/derive_game_producer_context.py)

本组从4,678份匹配基线继续，形成[共享图形生命周期合同](../analysis/capability-first-v1/game-graphics-lifetime-contract.json)。8个已有规范体/1,899字节、旧派生回调250指令/720字节、10处rel32调用及现代表1,980字节匹配原PE；9次缓存分页与原父记录完全对应，1667旧记录逐项不变，新导出1676。未新增analyze_function/反编译，未重建快照；原程序/VM/账号、产品测试/构建/设备流程均未运行。97业务回调的限定图零结果单列，不提升全局分析/实现/官方门槛。产品接口、资源格式及运行基线stage306保持。[审计](../analysis/capability-first-v1/game-graphics-lifetime-validation.json) · [离线核验](../analysis/capability-first-v1/derive_game_graphics_lifetime.py)

本组从4,673份匹配基线继续，完成[72根有限归属复核](../analysis/capability-first-v1/game-entry-review-contract.json)。72已有规范体/113记录选择器逐根身份核对，72原PE范围12,617字节、68 tag/272字节及705个留存短窗口哈希通过；1,570处索引出现和1,515处源表选择器在旧源证上对齐，未声称重读全部表字节。39发送中18有业务上下文、21具体待证；29接收和4非协议根另列。没有新REA目标/反编译、原程序/VM/账号运行、产品改动、产品回归/构建/设备流程。原647图及其source-check未改，38/81/37/10和统一门槛仍未关闭。[本组审计](../analysis/capability-first-v1/game-entry-review-validation.json) · [离线复现](../analysis/capability-first-v1/derive_game_entry_review.py)

本组从4,668份匹配基线继续，形成[模态所有者/XML恢复合同](../analysis/capability-first-v1/launcher-modal-recovery-contract.json)。57体含27新规范、23旧规范、7旧伪代码组合；58范围22,705字节及12处1,216字节数据匹配REA静态读取与原PE。36组锚点、四消息继承链、24模态槽/七XML删除槽/一个App槽及17导入另核；三份微软平台文档与原生字节/运行证据分开。REA导出/快照各924并关闭、cleanup_pending=false。原程序/VM/账号未运行，产品代码/接口/资源格式/构建不变，未新增产品回归/设备流程；38/81/37/10及统一门槛仍未完成。[审计](../analysis/capability-first-v1/launcher-modal-recovery-validation.json) · [复现](../analysis/capability-first-v1/derive_launcher_modal_recovery.py)

本组从4,663份匹配基线继续，形成[连接身份/回调/关闭合同](../analysis/capability-first-v1/launcher-channel-contract.json)。43体含23新规范、4旧规范、16旧伪代码组合；43范围16,770字节及六槽24字节前缀匹配REA静态读取与原PE，另核36组锚点、七命名导入、三份引用观察。589520一份新规范重复旧伪代码，已单列，不算新增语义覆盖。REA导出/快照各854并关闭、cleanup_pending=false。原程序/VM/账号未运行，产品代码/接口/资源格式/构建不变，未新增产品回归/设备流程；38/81/37/10与统一门槛保留未完成。[本组审计](../analysis/capability-first-v1/launcher-channel-validation.json) · [复现](../analysis/capability-first-v1/derive_launcher_channel.py)

本组从4,658份匹配基线继续，形成[App/登录任务生命周期合同](../analysis/capability-first-v1/launcher-lifecycle-contract.json)。27体含12新规范、7旧规范、8旧伪代码组合；32范围11,768字节匹配REA静态读取与原PE。三个CRT表项绑定的独立LLVM视图108字节/20指令、184槽表、四处辅助数据、两条注册消息和23组指令锚点另核；规范失败与派生证据分开。REA导出/快照各762并关闭、cleanup_pending=false。原程序/VM/账号未运行，产品代码/接口/资源格式/构建不变，未新增产品回归或设备流程。38/81/37/10及完整生命周期/统一门槛仍未完成。[本组审计](../analysis/capability-first-v1/launcher-lifecycle-validation.json) · [离线复现](../analysis/capability-first-v1/derive_launcher_lifecycle.py)

本组从4,653份匹配基线继续，形成[同C82 XML合同](../analysis/capability-first-v1/launcher-xml-contract.json)。34体含26新规范、7旧规范、1旧伪代码组合，35范围14,930字节匹配REA静态读和原PE；另核70字节/34指令/4数值分支、4处辅助数据读取、7虚槽、5实体、256宽度及14错误元数据。28项现有独立JS解析器/decoder原创行为对照，4个选定属性一致、24个不同，原程序侧只是静态推导；不称原生运行时差分。REA导出/快照各721并关闭、cleanup_pending=false；原程序/VM/账号均未运行，产品代码/接口/格式/构建不变，未跑全量产品回归/构建/设备。全部38/81/37/10及全局门槛保持未完成。[本组审计](../analysis/capability-first-v1/launcher-xml-validation.json) · [离线复现](../analysis/capability-first-v1/derive_launcher_xml.py)

前组从4,648份匹配基线继续，形成[路径/宿主路由合同](../analysis/capability-first-v1/launcher-host-routing-contract.json)。26体含13新规范、10旧规范、3旧伪代码组合，27范围14,658字节匹配REA静态读取与原PE；23组语义锚点、5处字面、3消息继承链、7虚槽、标准菜单258字节/6命令及4个PE导入API另核。实际callee/mask解决FID候选名冲突，目录任务与进程/登录busy分开。REA导出/快照各662并关闭、cleanup_pending=false；未执行原程序/VM/账号，产品接口/格式/构建不变，未重跑产品测试/构建/设备。全部38/81/37/10和完整目标保持未完成。[本组审计](../analysis/capability-first-v1/launcher-host-routing-validation.json) · [离线复现](../analysis/capability-first-v1/derive_launcher_host_routing.py)

前组从4,643份匹配基线继续，形成[目录/安装/宿主合同](../analysis/capability-first-v1/launcher-catalog-install-contract.json)。70体含50新规范、14旧规范、6旧伪代码组合，71范围34,417字节匹配REA静态读取和原PE；31组语义锚点、39处字面范围、两消息继承链及68项App代码指针前缀另核。两个独立派生回调26条指令/95字节与原PE一致，不混作规范dossier或完整ABI。REA导出/快照各636并关闭、cleanup_pending=false；未执行原程序/VM/账号，运行接口/资源格式/构建方式未改，未重跑产品测试/构建/设备。完整XML/晚到重入/菜单与全项目38/81/37/10仍未关闭。[本组审计](../analysis/capability-first-v1/launcher-catalog-install-validation.json) · [离线复现](../analysis/capability-first-v1/derive_launcher_catalog_install.py)

前组从4,637份匹配基线继续，形成[本地ID元数据规格](../analysis/capability-first-v1/launcher-id-metadata-contract.json)。56体含36新规范/19旧规范/1组合复用，57段30,433字节全部匹配REA静态读取和原PE；两15字节命令桥及15字节帮助体另核。动态四控件备注模板仅为静态模型，继承map与类虚槽分别绑定；不将其算入14个静态资源。[来源/范围](../analysis/capability-first-v1/launcher-id-metadata-source-check.json)

摘要压缩视图的150条受限整数赋值，在512组原创state/block输入上匹配独立MD5参考；12个完整原创消息摘要再匹配hashlib，非原程序运行。+0x1998纠正为排序撤销可用，旧目录组3份生成器/合同/源锚点只修对应标签；7209/720a绑定重置/撤销而不新增未证导入导出。REA导出/快照各529、会话关闭且cleanup_pending=false。无运行功能/接口/格式/构建改动，未重跑产品测试、构建或设备；全部38/81/37/10与统一门槛保留，modal/async owner、XML/安装/App、游戏及真实平台/官方接受仍待完成。[本组审计](../analysis/capability-first-v1/launcher-id-metadata-validation.json) · [源核验复现](../analysis/capability-first-v1/derive_launcher_id_metadata.py) · [静态摘要模型](../analysis/capability-first-v1/verify_launcher_metadata_md5.py)

以下为前组目录、应用、列表及类绑定的历史范围。

前组目录/状态分析从4,632份匹配基线继续，形成[目录/ID列表/准备恢复合同](../analysis/capability-first-v1/launcher-catalog-state-contract.json)。49体含30新规范、14旧规范、5旧伪代码与原生范围/汇编组合；50段REA静态加载映像共43,452字节逐项匹配原PE，21组语义锚点、7处字面及CChildView消息链另核。+0x1694纠正为ID筛选词，Game.EXE/Galaxy.Name生产、四动态控件和7926上下文动作创建已有来源；c7ba历史规格与c82f分开。[源核验](../analysis/capability-first-v1/launcher-catalog-state-source-check.json)

独立副本仅补两个参数存储原型，425790/41cc70警告32/102降0，另3调用者保持0；五体1,624指令/6,267字节前后及原PE均一致。此为派生视图，未改规范REA项目，不能把消警告当完整正确性证明。REA导出/快照各452并关闭、cleanup_pending=false；原程序/VM/账号、运行功能/接口/产品格式/构建方式均未改，未重跑产品测试、构建或设备流程。38/81/37/10及所有统一门槛保持；完整安装/编辑持久化/关闭重入/游戏分发与现行接受继续未完成。[本组审计](../analysis/capability-first-v1/launcher-catalog-state-validation.json) · [复现](../analysis/capability-first-v1/derive_launcher_catalog_state.py)

以下为前组应用/列表/类绑定的历史范围。

前组应用分析从已核对一致的4,627份基线继续，形成[预设应用→普通登录→回复后ID选择合同](../analysis/capability-first-v1/launcher-apply-contract.json)。37体包括16新规范dossier、9旧规范体、12旧workflow伪代码与当前范围/汇编的组合体，复用52,453字节伪代码；41段REA静态加载映像读取共23,158字节与固定c82f原PE完全一致，另有15组语义锚点和8处数据范围。组合证据与规范dossier分别记账，未重反编译12个旧体。[来源](../analysis/capability-first-v1/launcher-apply-source-check.json)

REA导出/快照各376条，最终关闭且cleanup_pending=false。分析器/合同和当前文档核验通过；没有原程序/账号运行、产品代码、接口、构建或产品格式改动，未新增产品测试/构建/设备流程。反编译警告、目录生产、异步准备/完整恢复及现行游戏接受仍未闭合，38/81/37/10范围与统一门槛保持。[本组审计](../analysis/capability-first-v1/launcher-apply-validation.json) · [复现](../analysis/capability-first-v1/derive_launcher_apply.py)

以下是前组列表/编辑与类/分发核验。

前组预设分析从已核对一致的4,622份基线继续：54个完整规范体/16,779字节（48新取、6旧记录复用）、28处数据范围及两个15字节命令桥逐项绑定固定c82f。15组语义指令锚点、两个模板范围及所选虚槽另核；本轮体范围哈希来自原PE，不另声称新体有第二份原生内存或独立解码器逐指令比较；完整伪代码留在build/analysis。[来源检查](../analysis/capability-first-v1/launcher-presets-source-check.json) · [工作流合同](../analysis/capability-first-v1/launcher-presets-contract.json)

此次仅静态取证与规格，REA导出/快照各301条，最终会话关闭且cleanup_pending=false。运行代码、接口和构建方式未变，没有重跑产品测试/构建/设备流程；读写失败和Windows原子性没有动态故障注入证明。38能力域/81协议/37历史要求/10消费者组及未通过的统一门槛保持，下一步补预设应用后状态及其他业务。[本组审计](../analysis/capability-first-v1/launcher-presets-validation.json) · [离线复现](../analysis/capability-first-v1/analyze_launcher_presets.py)

以下为此前类/模板和游戏分发分析的原范围。

本组从已核对一致的4,616份基线推进A2/A3。游戏3个规范体/460字节（1新补、2复用）及独立派生4ea740的29指令/82字节均核原件；lookup六个直接调用包含5个规范指令及1个源绑定派生指令。有限直接分发子集已证，实际callback列消费者仍未闭合。[补证事实](../analysis/capability-first-v1/game-dispatch-findings.json)

登录器33个规范体/13,462字节逐完整范围核原件（32新补、1复用）；406a00的两段非连续体分开读取。18个基初始化调用者、13个vtable及消息祖先链形成11模板ID的构造路径，主133的24命令定对象作用域；3资源使用、4菜单路由及完整handler状态仍未关闭。立即PUSH、vptr写、旧App全局存储、RTTI和map范围均有来源/哈希，未把296删除分支参数当模板。[类/资源绑定](../analysis/capability-first-v1/launcher-dialog-bindings.json) · [源检查](../analysis/capability-first-v1/dispatch-binding-source-check.json)

本组共36规范体/13,922字节和82派生字节有匹配证据。游戏导出/快照各1,667，登录器各249，按目标分别记账；最终会话关闭、cleanup_pending=false。无原程序执行或运行代码、模块接口、构建/产品资源格式变更，没有重跑产品测试、构建和设备流程。原38能力域/81协议/37历史要求/10消费者组均保留，统一分析与实现门槛仍false。[本组审计](../analysis/capability-first-v1/dispatch-bindings-validation.json) · [复现](../analysis/capability-first-v1/derive_dispatch_bindings.py)

以下入口归并及共同规则按前序范围保留。前序从4,608基线定位647体（143规范/503旧派生/1组合），84,910派生指令/298,021字节匹配，规范33,810范围字节另核原文件；3,506静态边及160根路径均不作业务闭合。[前序入口图](../analysis/capability-first-v1/business-entry-map.json) · [前序核验](../analysis/capability-first-v1/business-map-validation.json)

另一套窗口16个相关体/2,392字节由REA读取并核原文件，其中7个规范辅助函数新补。隐式this与SETLE、不同事件编码、活动槽/dirty/恢复及共享文本焦点分别成规格；实际表callback分发、图形对象和全部业务仍待证。[来源合同](../analysis/capability-first-v1/alternate-window-contract.json)

c82f两组43/2项消息表、全零终止项、map和6字节返回访问器匹配指定原件范围哈希；旧430ff0伪代码及5d4978/24字节REA读取复用。24条WM_COMMAND中19条ID匹配资源，另5个未匹配；2条菜单目标与6个非零资源命令区分。类/资源/继承及handler效果未关闭，ID0分隔项不计为命令。[源解析及限制](../analysis/capability-first-v1/launcher-message-map.json)

原件及shared/web/wechat/adapters/native、工具/构建源码未变；只运行源绑定和文档/范围/基线审计，没有重跑产品测试、构建或浏览器/设备流程。原38能力域、81协议登记、37历史要求和10消费者组保留，统一分析与实现门槛均false。REA导出与快照各1,656记录，会话关闭且cleanup_pending=false。[本组审计回执](../analysis/capability-first-v1/business-map-validation.json) · [业务图复现](../analysis/capability-first-v1/build_business_map.py) · [登录器解析复现](../analysis/capability-first-v1/extract_launcher_message_maps.py)

前序传统规则从4,603基线闭合25规范体/7,338字节和8派生回调/2,634字节；7处owner直接写、2PUSH锚点及type0初始保护有源，动态激活未排除。当时导出/快照各1,619；原回执保留历史身份。[前序验收](../analysis/capability-first-v1/window-engine-validation.json)

前序 A1/A2 从4,594基线完成两套窗口、主状态、文本收发及登录器资源元数据；2,768引用归为647根，480入口批量恢复，73,645指令/258,651字节及5,827表字节匹配，33间接点待证；当时导出1,578/native快照1,577。原回执按当时文件哈希保留，不改作本组新执行结果。[入口清单](../analysis/capability-first-v1/entry-inventory.json) · [前序核验](../analysis/capability-first-v1/entry-inventory-validation.json)

以下为前序流程调整核验，仍按当时数据保留。

本轮交付为[能力清单初版](requirements-index.md#capability-first-inventory)和[统一分析/开发流程](development-plan.md#capability-first-workflow)，并非全部 REA 完成或新增运行功能。修改前 4,589 份基线哈希全部一致，并备份受影响文档与工作分支计划；没有 Git 元数据，不覆盖无关改动。

能力明细登记 38 个域，逐条映射现有 81 条协议登记、37 条历史剩余要求、10 个消费者组，并保留来源哈希、原状态和未完成条件。引用/文件、映射覆盖、依赖、表格一致性及运行代码不变的检查见[本轮回执](../analysis/capability-first-v1/validation.json)。清单发现、统一分析/规格及完整目标均明确保持未完成。

额外保存的工作窗口研究：27 个独立副本派生入口、31,250 指令字节、4 处共享字节写入与来源回调指针均匹配固定 PE。首次本地核验脚本误把导出状态预期为 `ok`，按实际 `derived-static-export` 修正后通过；未重跑 REA 生产或修改源文件。完整可达性/规格仍未完成。[研究证据](../analysis/game-work-lifetime-v1/research-summary.json)

本轮没有产品代码、模块接口、资源格式或构建方式变更，未重复运行全仓测试、生成构建和浏览器/微信流程。上一实现基线的 3,779 项回归、102 项生成检查、16 条本地产品流程属于 stage306 历史结果；没有将其列为本轮新验收。实际平台/设备和官方接受继续单独待验，REA 当前已关闭。

<a id="stage306-work-context"></a>

## stage306 上下文、直接技能及保留流程验收

新增源码8项；生成API8新＋8制造＋5配方＋8物品工作＋10目标／采集＋63战斗＝102项通过。完整回归3,779项／271文件，冻结1,799输入未变。独立参考112耗时、35可用条件；覆盖收到时配方标签、失配选择拦截／重查、rank+1、时间到期、slot偏移、type5低MP和实际Hx!70子体。[机器回执](../analysis/game-work-context-v1/validation.json)

实际1,072文件ZIP在Chrome156桌面1100×850键盘／鼠标、390×844触屏、源码Page、生成Page分别完成上下文制造→到期解除／配方重查→普通与上下文修理差异→上下文采集→直接技能低MP／坐骑子体条件，每条34请求。原制造、物品工作、目标／连续采集在同四种界面各复测13／26／37请求，共16条本地产品流程、440个核对请求；均使用原创本地对端。

桌面／触屏无框架错误层、控制台错误／警告和横向溢出，已人工查看失配配方禁用与直接技能等待状态；截图在/tmp/moli-stage306-qa。Page以真实源码／生成handler、Canvas及原生形状本地端口运行，未作实际微信／手机验收。[界面回执](../analysis/game-work-context-v1/ui-qa.json)

API197输入／475导出，Page257输入／27输出，均无外部导入；主包783,633／游戏包1,215,247字节。19正式函数／8,758字节、11派生入口／13,688字节已核对，REA保留1,514记录并关闭。原始37要求／10未完成组及平台／官方接受继续保留。

<a id="stage305-work-targets"></a>

## stage305 目标、连续采集和旧流程验收

新增源码 10 项、生成 API 10＋制造 8＋配方 5＋物品工作 8＋战斗 63＝94 项通过；完整回归 3,771 项／270 文件，冻结 1,788 输入未变。独立参考覆盖 12 模式、8 成本、8 时钟、72 结果和 4 本地目标计划；检查宠物空位序号、两级查询、模式结果、成本溢出、严格 unsigned 截止、重启门禁、背包／MP 复核和关闭后迟到回复。[机器回执](../analysis/game-work-targets-v1/validation.json)

实际 1,072 文件 ZIP 在 Chrome156 桌面 1100×850 键盘／鼠标、触屏模拟 390×844、源码 Page、生成 Page，各走通变装失败→宠物变身→宠物急救／低 MP→外部目标→治疗恶化／恢复→采集两轮→暂停／继续／取消，再检查打猎／伐木姿势及迟到回复。四条连接每条核对 37 请求，均为原创本地服务；同四种界面另保留制造各 13 请求、物品工作各 26 请求，共 12 条产品流程。

旧测试逻辑和历史证据不变，仅将输出重定向到 /tmp/moli-stage305-normal-qa 与 /tmp/moli-stage305-item-qa；旧回执保留 303／304 标识，明确为 stage305 最终运行时复测。新截图在 /tmp/moli-stage305-qa，已核对桌面目标、触屏急救、采集结果禁用重启和暂停后继续；无横向溢出、框架错误层或浏览器错误／警告。Browser plugin not available，使用已安装 Playwright1.64.1／Chrome156。[界面核验](../analysis/game-work-targets-v1/ui-qa.json)

API 196 输入／470 导出，Page 256 输入／27 输出，均无外部导入；主包 783,258／游戏包 1,210,963 字节。REA 21 正式函数／8,585 字节、13 派生入口／5,659 字节已核对，1,407 记录导出并关闭。Page 是真实源码／生成 handlers、Canvas 与原生形状本地端口验收；DevTools、实际微信／真实手机、现行／官方接受仍待完成。37／10 原始范围保留。

回归后只读补核宠物模式表 5 函数／4,412 字节，联合 26／12,997 字节，最新 1,426 记录导出并关闭；运行代码未改，1,788 冻结输入再次哈希一致。[补核回执](../analysis/game-work-targets-v1/pet-mode-check.json)

<a id="stage304-work-actions"></a>

## stage304 工作动作与保留制造的本地验收

新增源码 8 项、生成 API 新 8＋保留制造 8＋配方 5＋战斗 63＝84 项通过。完整回归 3,761 项／269 文件，冻结 1,776 输入未变；覆盖 60 个独立物品条件、7 个计时边界、13 个刻印字节案例、产品第 40 行位于负前缀之后、先清旧位、错类／迟到结果、场景失效和无乐观库存／MP 更新。[机器回执](../analysis/game-work-actions-v1/validation.json)

实际 1,072 文件 ZIP，Chrome156 桌面 1100×850 键盘／鼠标、390×844 触屏模拟、源码 Page 和生成 Page，各走通修理→魔力不足→鉴定失败／受伤→刻印／清除→装饰→计时取消／迟到回复。四条本地连接各核对 26 请求；另按未改的旧制造产品测试在同四种界面各复测 13 请求。旧回执保留 stage303 标识，明确是当前 stage304 产物复测，只有输出路径被重定向以保留历史截图。

网页无控制台错误／警告、无横向溢出；已查看桌面修理、触屏刻印／装饰／结果截图，长内容独立滚动，标题与关闭操作可见。Browser plugin not available，使用已安装 Playwright1.64.1／Chrome156。新截图在 /tmp/moli-stage304-qa，保留制造复测在 /tmp/moli-stage304-normal-qa。[界面核验](../analysis/game-work-actions-v1/ui-qa.json)

API 195 输入／461 导出，Page 255 输入／27 输出，均无外部导入；主包 782,883、游戏包 1,199,462 字节。Page 验证真实源码／生成 handlers、Canvas 和原生形状本地端口，未验收 DevTools／实际微信／真实手机或官方服务。REA 28 正式函数／11,974 字节和父阶段 14 派生入口／14,129 字节复核，1,359 记录导出并关闭。37／10 原始范围保留，完整目标仍 active/incomplete。

<a id="stage303-craft-input"></a>

## stage303 制造核心和四端本地产品验收

源码新 9 项、生成新 8 项和保留 63 项通过；完整回归 3,753／268 文件，冻结 1,764 输入未变。独立 Python 参考有 8 个整数／计时边界、3 次材料关联、6 个姿势；覆盖 uint32 回绕的原生比较、必需／附加顺序、数量 0、说明标志、过期选择、技能删除、结果文字预算、取消／场景失效和关闭后只读状态。[机器回执](../analysis/game-craft-input-v1/validation.json)

实际 1,072 文件 ZIP 在 Chrome 桌面 1100×850、触屏 390×844、源码 Page 和生成 Page 分别运行完整制造流程：选择→成功→MP 不足→恢复 MP→失败／受伤→再次制作中取消。四条连接各核对 13 请求，均使用原创本地服务；网页无错误／警告、无横向溢出，键盘与触屏实际操作通过。截图置于 /tmp/moli-stage303-qa；Browser plugin not available，因此使用本机 Playwright1.64.1／Chrome156。[界面核验](../analysis/game-craft-input-v1/ui-qa.json)

API 194 输入，Page 254 输入／27 输出，均无外部导入；主包 782,507 字节、游戏包 1,190,925 字节。Page 证明原始／生成 handlers、Canvas 和原生形状本地端口，不等同于 DevTools／真实微信／手机。修理、合成、其他上下文及完整项目仍未完成；37／10 原始范围保留。

<a id="stage302-craft-recipes"></a>

## stage302 配方接收、删除与重新查询验收

**来源：** 固定 37c4，REA 6.7.0／Ghidra 12.1.4；10 个规范函数／1,939 字节逐段核对原 PE，1,153 条证据导出、快照保存且会话关闭。56 配方、5 材料、22 字段、偏移、文本字节上限与部分重置分别绑定来源。47176f 没有规范函数边界，未据此实现显示语义。[来源](../analysis/game-craft-recipes-v1/source-check.json) · [规格](../analysis/game-craft-recipes-v1/implementation-spec.json)

**独立状态与新检查：** Python 固定字节内存模型产生 16 份完整期望状态，共 896 配方行／4,480 材料。核心所有者和技能所有者各比较 12 份，真实 client／session 比较另外 4 份，共 28 份选定完整投影、1,568 行／7,840 材料；源码和生成 API 各执行一次。新增五项检查全部通过，另验字节所有权、其他槽与主技能版本保持、关闭和新建。

**客户端链路：** 源码及生成 API 都由现有正常入场客户端完成 kind1 自动 '<4 查询、@_i 回复、超长更新、技能删除和再次查询／回复，保持同一会话、playing 和 roundCounter0。端口为原创受控字节端口，生成包用同包原生形状 wx 回调；新增配方流程不作为该功能的实际 TCP、Page 或设备验收。

**完整回归与构建：** 3,744 项／266 文件全部通过，失败／取消／跳过 0；1,729 个真实测试输入在前后保持一致。生成 API 另有 63 项既有道具／战斗检查通过，合计本轮生成检查 68 项。esbuild0.25.12 构建 API193 输入／450 导出、Page251 输入／26 输出，外部导入 0；API2,064,415 字节，Page main782,149／game1,173,743 字节，输入输出及明确 game-config 摘要核对。

**复现：** `python3 analysis/game-craft-recipes-v1/verify_source.py`；`python3 analysis/game-craft-recipes-v1/generate_vectors.py`；`node --test shared/tests/legacy-game-craft-recipes.test.mjs`。生成 API 检查设置 `MOLI_CRAFT_BUILD=build/wechat-game-stage302-api-final/game.js`。构建使用现有 tools/build-wechat-game.mjs 与 tools/build-wechat-app.mjs，Page明确指定 build/analysis/game-wechat-page-v1/game-config.json。[机器回执](../analysis/game-craft-recipes-v1/validation.json)

**未验：** 制造交互／结果、非零上下文及其余完整游戏；本轮没有 UI 改动；新增配方没有页面产品流程或截图验收。原程序执行、VM 操作和官方会话均为 0。真实 DevTools／微信／手机／现行交接与官方接受继续单列，原 37 项要求／10 组保持 active/incomplete。[范围](../analysis/game-craft-recipes-v1/goal-audit.json)

<a id="stage301-battle-item-dispatch"></a>

## stage301 ITM 来源复核与未改动消费者回归

**来源：** 固定 37c4 样本，REA 6.7.0／Ghidra 12.1.4。五段窗口共 2,251 字节与原 PE 相同，含两个规范 helper 共 407 字节；保留派生账本的 14,120 条／54,685 字节逐条重核。本轮逐指令窗口 1,844 字节，432616 仍非规范函数。37 个分派边界样本通过，方程只选中 0／6／7。1,121 条证据和快照保存，REA 已关闭。[来源](../analysis/game-battle-item-variants-v1/source-check.json) · [复核程序](../analysis/game-battle-item-variants-v1/verify_source.py)

**运行代码与测试：** 无运行代码、平台接口、新测试文件或 UI 改动。既有五个 motion／commands／mp-items／shared-storage／item-input 文件在源码和 stage300 生成 API 各通过 63 项，失败／取消／跳过均 0。生成包 447 导出、192 输入及包摘要重核。第一次裸 loader 路径导致加载前失败，改为绝对路径后复跑成功；原失败日志保留。[机器记录](../analysis/game-battle-item-variants-v1/validation.json)

**证据层次：** 完整 3,739 项／265 文件仍是 stage300 回执，本轮未重跑整套；其 1,720 输入摘要重新核对不变。既有页面和实际材料产品流程未在本轮重跑，无新截图或前端接受结论。原程序执行、VM 操作、官方会话均 0。

**结果与未验：** 本轮纠正需求判断，不增造 ITM 效果；独立实现默认拒绝与原生后继行为分开标记。工艺配方、普通上下文、其他控制／RID／自身／混合／空目标／本地停止、完整 UI／调度、现行交接及实际微信／手机仍待推进。37 项需求／10 个未完成组保持 active/incomplete。[完整范围](../analysis/game-battle-item-variants-v1/goal-audit.json)

<a id="stage300-city-water"></a>

## stage300 回城水面与连续等待画面验收

**来源：** 固定37c4，REA6.7.0／Ghidra12.1.4；17函数／15,221字节及旧请求菜单253字节与原件一致，1,090条证据，REA关闭。main9场景清除／main10保留、205捕获无4ff160／11先重建、真实本地消息创建与外层相位／位置顺序分别核验。原程序、VM和官方会话操作均0。[来源](../analysis/game-city-water-v1/source-check.json) · [机器记录](../analysis/game-city-water-v1/validation.json)

**独立与共享实现：** 12条实际client／wire／world轨迹，1,800个Python独立状态检查点，覆盖同图／换图、普通等待、本地资料未到／提前／中途／捕获后到、scene不强制重建及boundary重建。两组水面后type15淡入共98完整640×480 RGBA逐张相同，源码／生成汇总一致。八项新测试源码与生成API均通过，另有异步捕获取消、等待作业取消、未呈现不重复、关闭和Canvas等待调度。编译夹具使用同包会话；Canvas单测用共享源适配，生成Page另行验证。

**完整回归：** 3,739项／265文件通过，失败／取消／跳过0；1,720个真实测试输入在前后与最终审计一致。产品helper和对端在单独QA中核对身份，没有把调试中止的产品尝试计入整回归。API192输入，Page250输入／26输出，esbuild0.25.12，外部导入0，输入／输出完整SHA复核。Page使用明确本机测试game-config。

**实际产品：** scene、boundary、battle-transfer、battle-early、battle-late五路径，各覆盖桌面、触屏模拟、源码Page、生成Page，共20条。实际1072文件ZIP、100010人物和战斗背景5000原字节保持；地图布局与场景回复为原创条件。版本／人物／外观、两次移动、回城请求、必要边界和地图等待、再两次移动及断开全部由独立Python对端回执确认；同一连接，基础9请求加各路径1／2／3个回城请求。场景回复补已有H#|格式本地消息；未到时的保持等待另有独立轨迹覆盖。

**前端：** Browser插件未提供，采用Playwright1.64.1／Chrome；本机/web/game.html，标题Moli · 游戏，1100×850与触屏模拟390×844。10条浏览器流首屏非空、scroll0、无横向溢出／框架遮挡，console error／warning／页面异常0；普通地图等待回复的4条流另计Canvas实际绘图持续增加。已查看五路径桌面／手机返回图；46份本轮截图留/tmp/moli-stage300-qa，stage299历史20份摘要复核。源码Page-scene日志另含4项现有Page检查，产品流计数仍为1。

| 检查 | 桌面五路径 | 触屏模拟五路径 |
| --- | --- | --- |
| 页面身份、非空、无遮挡／溢出 | 通过 | 通过 |
| 等待回复画面、实际素材、回城返回 | 通过 | 通过 |
| 同连接两次移动→回城→两次移动 | 通过 | 通过 |
| error／warning／页面异常 | 0 | 0 |

**复现：** analysis/game-city-water-v1内verify_source.py、generate_vectors.py、portable-test.mjs [generated]；共享测试shared/tests/legacy-game-city-water.test.mjs，生成API设MOLI_CITY_WATER_BUILD=build/wechat-game-stage300-api-final/game.js。product-test.mjs使用MOLI_CITY_HOST=web|wechat及MOLI_CITY_ROUTE=scene|boundary|battle-transfer|battle-early|battle-late；Page设MOLI_PAGE_VARIANT=source|generated和MOLI_PAGE_BUILD=build/wechat-app-stage300-page-final，测试名筛选actual material city。

**未验：** 完整原对象／移动／RNG／音频／窗口调度、其他初始／main9特殊／错误／停止、原驱动缓存、现行交接、实际DevTools／wx文件／Canvas／手机／性能／官方接受与完整游戏。原37项需求／10组保持active/incomplete。[完整范围](../analysis/game-city-water-v1/goal-audit.json)

<a id="stage299-battle-water"></a>

## stage299 正常战斗与回场水面验收

**来源：** 固定37c4模块，REA6.7.0／Ghidra12.1.4；24函数／14,881字节匹配原件，1,059条证据及快照留build，REA关闭。闭合main9/3清除本地对象／置门槛、main10暂停更新、特殊背景排队捕获、缓存背景排除及正常回场顺序。原程序、VM和官方会话操作均0。[核验](../analysis/game-battle-water-v1/source-check.json) · [机器记录](../analysis/game-battle-water-v1/validation.json)

**独立参考：** 十特殊索引×门槛0／1×无背景／原创特殊背景，共40组真实身体所有者场景，1,060张完整RGBA与Python独立参考相同；另有12条轨迹／1,200次advance、consume、savePosition顺序操作。源码和生成API摘要相同，身体回调不因绘图重复。十项新测试覆盖裁减前标记、缓存背景排除、两次嵌套捕获、捕获模式延迟准备、上下文与重入、资源取消重试和三种OS TCP流程。

**返回时序：** 普通返回237次检查／55更新／240准备pass；提前own unit为237／86／240；再入战斗为427／63／433。各包合计901次检查、204更新、913准备pass及170次原有独立回场像素检查，原发送／退出／两次移动／关闭回执全部保留。passes是共享准备次数，含空外层和嵌套捕获，不等于原506820调用数。

**实际材料：** 十份未改特殊RD，源码／生成各比较20次捕获与10次缓存复制的30张完整帧；振幅100进入捕获后为0，相位及更新次数保持，缓存复制本身不触发标记。独立整数像素放置使用既有解码后的素材，因此没有声称独立RD解码。2,549,171,845字节实际ZIP完整SHA重核，图像只留私有build。

**回归与构建：** 3,731项／264文件完整回归通过，1,710个冻结输入在前后及最终审计不变。源码／生成API十项均通过。esbuild0.25.12构建API192输入，Page250输入／26输出，外部导入0；Page沿用明确本机测试game-config，全部输入／输出摘要复核。

**产品流程：** 原创地图40000／59000和战斗背景选择5000，实际人物100010与图形原件保持。桌面、触屏模拟、源码Page、生成Page共8条，完成版本／人物／外观／入场、防御、SKL106、回合1、HP58／MP5、退出、两次移动与断开；每条基础9请求加实际保活，由独立Python对端确认。背景5000是64×47特殊图形，选择方式为原创场景条件，不声称原生整幅战斗场景。

Browser插件未提供，使用Playwright1.64.1／Chrome；本机/web/game.html、标题Moli · 游戏、1100×850及触屏模拟390×844。首屏非空、scroll0、无横向溢出／框架遮挡，四条浏览器流error／页面异常／warning均0。已查看两地图桌面／手机场景及40000战斗结果图；20份本轮截图在仓库外/tmp/moli-stage299-qa，历史stage298的20份摘要复核。

| 检查 | 桌面两地图 | 触屏模拟两地图 |
| --- | --- | --- |
| 页面身份、非空首屏、无横向溢出／框架遮挡 | 通过 | 通过 |
| 实际水面／人物、特殊背景、结果画面 | 通过 | 通过 |
| 防御→结算→退出→两次移动→断开 | 通过 | 通过 |
| error／页面异常／warning | 0 | 0 |

**复现：** analysis/game-battle-water-v1内verify_source.py、generate_vectors.py、portable-test.mjs [generated]、material-test.mjs [generated]、return-probe.mjs [generated]。共享测试为shared/tests/legacy-game-battle-water.test.mjs，生成API设MOLI_BATTLE_WATER_BUILD=build/wechat-game-stage299-api-final/game.js。prepare-product.mjs生成私有runner；MOLI_MATERIAL_MAP=40000|59000，HOST=web|wechat对应完整变量MOLI_MATERIAL_HOST；Page设MOLI_PAGE_VARIANT=source|generated、MOLI_PAGE_BUILD=build/wechat-app-stage299-page-final。截图目录显式/tmp/moli-stage299-qa。共享时序检查直接加载原创源helper，不依赖私有生成文件。

**未验：** 其他main9／城市／错误／停止与进程前缀，原驱动／缓存，完整玩法／原场景，实际DevTools／wx文件／Canvas／音频／手机／性能，现行交接和官方接受。原37项需求／10个未完成组保持active/incomplete。[完整范围](../analysis/game-battle-water-v1/goal-audit.json)

<a id="stage298-ordinary-water"></a>

## stage298 普通地图水面验收

**来源与范围：** 固定37c4，REA6.7.0／Ghidra12.1.4，22函数／15,352字节和268字节表与原件一致，1,026条证据，REA关闭。实现普通地图的标记、队列预留、状态／呈现及RGBA消费者，保留战斗生命周期边界；原程序、VM和官方会话操作0。[源码核验](../analysis/game-special-graphics-v1/source-check.json) · [机器结果](../analysis/game-special-graphics-v1/validation.json)

**独立方程与所有者：** Python提供全部64相位×51偶数振幅的3,264份原尺寸帧，加24份视口和16份顺序帧，共3,304完整RGBA；650次状态／3,313次更新检查，源码／生成摘要相同。8项新测试在源码／生成API均通过，含裁减前标记、3／4项预留、20更新只准备1次、位置与相机分开、重复／过期呈现及prepared／deferred路径。

**实际材料：** 12份未改资源、64个原创场景帧在源码／生成API各执行一次。首帧5009无特殊标记，后63帧使用真实水面、陆地和3105对象。Python在已准备的实际底层／不透明上层之间独立执行水面方程并逐字节比较完整帧，两包RGBA汇总相同；没有替换RD解码器或声称原生驱动观测。ZIP全SHA及2,549,171,845字节复核。

**完整回归与构建：** 3,721项／263文件全通过，1,694个冻结输入在测试前后及最终审计相同。API191输入，Page249输入／26输出，外部导入0。Page最后按既有build/analysis/game-wechat-page-v1/game-config.json明确本机测试配置构建；默认null配置的初次拒绝另保留，不把配置补齐写成代码放宽。

**产品QA：** 原创水面地图40000／59000，各完成桌面、触屏模拟、源码Page、生成Page，共8条：版本／人物／外观／入场、防御、SKL106、回合1、目标HP58／施法者MP5、退出、两次移动、断开。每条基础9请求加真实保活，均有独立Python对端回执。地图布局与交互脚本是原创，图形及100010人物／300653背景来自未改档案。

Browser插件未提供，沿用Playwright1.64.1／Chrome；本机/web/game.html，标题Moli · 游戏，1100×850及触屏模拟390×844。首屏非空、scroll0、无横向溢出／框架遮挡，4条浏览器流console error／页面异常／warning均0。已查看四份scene图；20份截图留仓库外/tmp/moli-stage298-qa，stage297历史20份原图摘要复核。

| 检查 | 桌面两地图 | 触屏模拟两地图 |
| --- | --- | --- |
| 页面身份、非空首屏、无横向溢出／框架遮挡 | 通过 | 通过 |
| 实际水面、陆地、人物与战斗结果 | 通过 | 通过 |
| 防御→结算→退出→两次移动→断开 | 通过 | 通过 |
| error／页面异常／warning | 0 | 0 |

**复现：** 运行analysis/game-special-graphics-v1内verify_source.py、generate_vectors.py、portable-test.mjs [generated]；material-test.mjs [generated]后运行verify_material.py [generated]。8项测试为shared/tests/legacy-game-water.test.mjs，生成API可设MOLI_WATER_BUILD=build/wechat-game-stage298-api-final/game.js。prepare-product.mjs复用原检查生成私有runner，MOLI_MATERIAL_MAP=40000|59000，MOLI_MATERIAL_HOST=web|wechat，Page配MOLI_PAGE_VARIANT=source|generated和MOLI_PAGE_BUILD=build/wechat-app-stage298-page-final；截图目录显式使用/tmp/moli-stage298-qa。

**未验：** 原驱动／缓存、较小视口原生等价、战斗／离开生命周期、完整原场景、实际DevTools／wx文件／Canvas／音频／手机／性能、现行交接与官方接受。37项原始需求和10个未完成组保持active/incomplete。[目标核对](../analysis/game-special-graphics-v1/goal-audit.json)

<a id="stage297-body-draw-flags"></a>

## stage297 身体164／165验收

**来源**：固定37c4模块，REA6.7.0／Ghidra12.1.4；4函数／63,230字节及其中84字节控制分支匹配原件，913条证据和快照留build，REA关闭。164／165分别写309=255／0，只推进一次动作，保留310及独立颜色字段；434a30尾标记选择231。[来源与范围](../analysis/game-battle-gmn-flags-v1/source-check.json) · [机器记录](../analysis/game-battle-gmn-flags-v1/validation.json)

**消费者**：独立Python提供32组原创身体队列，实际所有者执行128回调，160份640×480完整RGBA与源码／生成API一致。覆盖原flags0..15、当前来源值0／4、162→164→165→163、原翻转偏移、颜色／绘图掩码分离、原动画不改、绘制只读和尾状态231。新增三项测试同时验证substate7／慢帧及未知样式在165后的明确边界。初版测试的相位预期已按真实四相位修正。

**生产者范围**：164／165是身体动作编号；正常协议生产者未证实，当前GMN21队列不注入它们。两项PUSH imm32搜索覆盖1,225,058字节已初始化.text且无匹配，不排除其他生产方式。较宽初搜和大函数value-flow的限制保留。实际产品回归不证明该生产链闭合。

**回归与构建**：262文件／3,713项回归通过，30项针对测试及生成API同一三项新测试通过；冻结输入在运行前后及最终审计保持摘要。API190输入／Page248输入重建、esbuild0.25.12、外部导入0，全部输入及输出身份复核。

**八条实际产品回归**：沿stage296实际素材配置，CUT59510／59526各完成桌面、触屏模拟、源码Page及本轮生成Page。角色选择、防御、SKL106、回合1、目标HP58／施法者MP5、退出及两次移动均由独立Python对端确认；基础9请求，加实际保活。素材和协议形状保持，只有截图目录参数扩展；本阶段使用 `/tmp/moli-stage297-qa`，stage296的20份原截图摘要仍复核。

**界面QA**：Browser插件未提供，使用已有Playwright1.64.1／Chrome，本机 `/web/game.html`、标题 `Moli · 游戏`，桌面1100×850、触屏390×844。首屏非空、scroll0、无横向溢出或框架遮罩；实际素材、数值与真实控件通过，四条浏览器流error／页面异常／warning均0。已查看四份battle-result，20份截图在上述仓库外目录，展示实际素材的原创对端场景。源码／生成Page为Node形状端口，真实DevTools、wx文件／Canvas／音频和手机未验。

| 检查 | 桌面两组 | 触屏模拟两组 |
| --- | --- | --- |
| 身份、首屏、无横向溢出／框架遮罩 | 通过 | 通过 |
| 实际素材、回合与HP／MP | 通过 | 通过 |
| 防御→结果→退出→移动 | 通过 | 通过 |
| error／页面异常／warning | 0 | 0 |

**复现**：`verify_source.py`及`generate_vectors.py`位于analysis/game-battle-gmn-flags-v1；同目录portable-test.mjs可追加generated。三项测试为shared/tests/legacy-game-battle-gmn-flags.test.mjs，生成API可设 `MOLI_GMN_FLAGS_BUILD=build/wechat-game-stage297-api-final/game.js`。实际产品沿stage296命令，Page构建改为 `build/wechat-app-stage297-page-final`，截图设 `MOLI_MATERIAL_QA=/tmp/moli-stage297-qa`。

**未完成**：164／165正常协议生产者、3096..3105特殊图形、其他控制、RID／自身／混合／空目标／本地停止、完整调度与UI、现行交接及真实微信／手机。37项需求与10个未完成组保持active/incomplete。[范围审计](../analysis/game-battle-gmn-flags-v1/goal-audit.json)

<a id="stage296-actual-battle-product"></a>

## stage296 实际材料完整产品路径

**材料与来源**：本阶段复用既有入场、动画、CUT及绘制来源，没有新增二进制分析。实际ZIP为2,549,171,845字节／1072文件，完整SHA256与既有材料一致；源码／生成预检相同。实际100010有160动作、24个原信号帧，8方向覆盖0／1／2／5／6；实际300653背景为group4／index618381，640×480。没有改素材、时长、事件或颜色。[规格与来源身份](../analysis/game-actual-battle-product-v1/implementation-spec.json) · [机器记录](../analysis/game-actual-battle-product-v1/validation.json)

**八条产品流程**：CUT59510／59526各完成桌面、触屏模拟、源码Page、生成Page。真实控件依次选择启动资料与ZIP、请求版本、返回人物列表、切换外观并进入、选择防御、消费SKL106、回合1及数值、退出、继续移动和断开。每条结果为角色 `[[0,70,100,5,10],[10,58,100,10,10]]`，一次防御、一次退出、两次移动；基础9请求，加实际保活。生成Page各观察到1次保活，其余0，均由独立Python对端确认。

地图格排列、战斗角色、背景选取与结果来自原创本机对端，素材来自实际档案；不是原服账号会话或完整原场景观察。临时对端仅修改既有数值选择，原文件、字段形状、编解码及请求断言保持。

**界面QA**：Browser插件未提供，使用已有Playwright1.64.1和Chrome；本机 `/web/game.html`、标题 `Moli · 游戏`，桌面1100×850、触屏模拟390×844。首屏非空、scroll0、无横向溢出或框架遮罩；角色、实际人物与背景、防御、结果和移动通过。四条浏览器流error／页面异常／warning均0。已查看四份实际battle-result图；截图在仓库外 `/tmp/moli-stage296-qa/{desktop,mobile}-{59510,59526}-{initial,scene,battle-entry,battle-result,returned}.png`，共20份。

| 检查 | 桌面两组 | 触屏模拟两组 |
| --- | --- | --- |
| 页面身份、首屏、无横向溢出／框架遮罩 | 通过 | 通过 |
| 实际角色／背景、回合与HP／MP | 通过 | 通过 |
| 防御→结算→退出→两次移动 | 通过 | 通过 |
| error／页面异常／warning | 0 | 0 |

**构建与回归**：API190输入／Page248输入重新构建，esbuild0.25.12、外部导入0，输入及产物身份与stage295相同。本阶段运行时代码未改，未重复运行既有3,710项／261文件回归；其1,669个冻结输入在最终审计保持原摘要，本阶段新增8条实际材料产品流程。

**计时诊断**：源码Page与生成Page表现帧数相近，但生成Page的Node vm环境耗时更长；同一CJS产物直接Node与隔离vm的受控背景绘制分开比较。四种环境各12份计量整帧，所有RGBA摘要相同；Math注入只部分改善，内部开销未进一步定位。保持既有跨上下文环境，不将本机vm耗时视为真实微信性能。

**复现**：预检 `node analysis/game-actual-battle-product-v1/preflight.mjs [generated]`；诊断同目录 `benchmark-vm.mjs`。产品测试设 `MOLI_MATERIAL_HOST=web|wechat`、`MOLI_MATERIAL_CUT=59510|59526`，运行同目录product-test.mjs，筛选 `--test-name-pattern='actual material battle'`。Page再设 `MOLI_PAGE_VARIANT=source|generated` 和 `MOLI_PAGE_BUILD=build/wechat-app-stage296-page-final`；API为 `build/wechat-game-stage296-api-final`。

**未验**：真实DevTools、wx文件／Canvas／音频、物理手机、完整原场景与现行交接；GMN164／165等控制、3096..3105特殊图形、其余RID／自身／混合／空目标／本地停止及完整调度／UI。37项原始需求与10个未完成组保持active/incomplete。[范围审计](../analysis/game-actual-battle-product-v1/goal-audit.json)

<a id="stage295-battle-draw-style"></a>

## stage295 战斗样式与对象颜色验收

**来源**：固定37c4模块，REA6.7.0／Ghidra12.1.4；12函数／73,349字节匹配原文件，902条证据及快照保留build，REA关闭。40a120传输溢出用保留投影与完整导出处理；value-flow截断未作全程序闭合证明。原程序执行、VM操作及官方会话0。[原字节与范围](../analysis/game-battle-draw-style-v1/source-check.json) · [机器记录](../analysis/game-battle-draw-style-v1/validation.json)

**原创参考**：2048组覆盖全部256个对象mask值、独立flag覆盖、命名编号、ghost最后覆盖和完整帧；128份历史半透明拒绝在新Python方程下成为正例，合计2176整帧源码／生成相同。旧元素延续末状态改为原动画字段，116份此前状态及14帧不变，原graphic0边界保留；宠物渐显82状态、64既有整帧保持，新增100份旧拒绝的ghost完整帧。两条路径源码／生成另核对178完整帧，历史夹具不改。真实GMN162／163回调、变形副本mask继承、303 alpha赋值与克隆、绘图只读和缓存共享由六项新测试覆盖。

**实际材料**：25动作／112帧、17个载体，六种原创战斗池上下文共672份640×480完整RGBA与独立Python一致。所有RD与原参考摘要复核；实际加色的alpha0／64／ghost与raw相同，清除加色位后改变；非加色的alpha0等于背景。RGB覆盖由来源支持的原创对象字段提供，未声称原生硬件或完整原地图验收。

**回归与构建**：261文件／3,710项回归通过，97项针对测试、18项历史路径测试及生成API同一六项新测试通过。源码／生成API2176和672完整帧摘要相同；历史路径另核对178整帧，其中100份宠物ghost帧由旧拒绝转为正例。API190输入／Page248输入、外部导入0，esbuild0.25.12；全部输入与产物摘要复核，冻结回归输入在运行前后及最终审计保持不变。

**八条产品流程**：原创资源100010的40个动作扩展为20字节头，分别验证ARGB8090c0ff的普通透明与加色；其余持续时间、方向和帧／wire字段保持。每种跑桌面、触屏模拟、Node源码Page及Node生成Page，均完成SKL106、回合1、目标HP58、施法者MP5、退出与继续移动。独立Python对端每条确认9请求、1防御、退出及2移动，无重复／新造会话字段。

**界面QA**：Browser插件未列出，沿用Playwright1.64.1／实际Chrome，记录 `Browser plugin not available`。临时本机 `/web/game.html`，标题 `Moli · 游戏`，桌面1100×850及触屏模拟390×844；首屏非空、scroll0、无横向溢出／框架遮挡，真实按钮与战斗数值／退出／移动通过，四条浏览器流error／页面异常／warning均0。源码／生成Page为Node形状wx端口，实际DevTools／微信Canvas／文件／音频及物理手机未验。

| 检查 | 桌面两场景 | 触屏模拟两场景 |
| --- | --- | --- |
| URL／标题、非空首屏、无横向溢出／框架遮挡 | 通过 | 通过 |
| 人物／版本／外观、战斗技能／数值／回合 | 通过 | 通过 |
| 原透明／加色、退出及回场移动 | 通过 | 通过 |
| error／页面异常／warning | 0 | 0 |

截图在仓库外 `/tmp/moli-stage295-qa/`，为 `{alpha,additive}-{desktop,mobile}-{initial,battle}.png`，已查看四份battle图；画面使用原创稀疏测试素材。实际材料672帧的摘要另见上述记录，不能以截图或构建成功代替完整游戏／真机证明。

**复现**：`analysis/game-battle-draw-style-v1/verify_source.py`、`generate_vectors.py`、`material_oracle.py`；同目录portable-test.mjs、retained-test.mjs和compare-material.mjs可追加 `generated`；generate_regression_references.py独立复现旧路径参考。API／Page输出为 `build/wechat-game-stage295-api-final`、`build/wechat-app-stage295-page-final`。既有entry-test.mjs设 `MOLI_BATTLE_STATUS_VARIANT=impact-106`、`MOLI_BATTLE_DRAW_STYLE=alpha|additive`、`MOLI_ORDINARY_HOST=web|wechat`，筛选 `--test-name-pattern='legacy ordinary startup'`；Page再设 `MOLI_PAGE_VARIANT=source|generated`、`MOLI_PAGE_BUILD=build/wechat-app-stage295-page-final`。新六项测试可设 `MOLI_BATTLE_STYLE_BUILD=build/wechat-game-stage295-api-final/game.js` 对生成API复验。

**未完成**：硬件精度／DDRAW／完整原运行；特殊图形、GMN164／165等控制、其余RID／自身／混合／空目标／本地停止、完整调度／UI、实际材料产品覆盖、现行交接及真实平台／官方验收。37项需求与10个未完成组保持active/incomplete。[范围审计](../analysis/game-battle-draw-style-v1/goal-audit.json)

<a id="stage294-vertex-color"></a>

## stage294 ARGB、部分调色板和实际入口验收

**来源**：固定37c4模块，REA6.7.0／Ghidra12.1.4；9函数／12,101原文件字节与887条保留证据，REA已关闭。微软SDK核对ARGB、方法与枚举，RGB默认纹理状态的使用标为文档推导。原程序执行／VM操作／官方会话0。[来源](../analysis/game-vertex-color-v1/source-check.json) · [完整机器记录](../analysis/game-vertex-color-v1/validation.json)

**独立完整像素**：1,536份混合画面覆盖颜色／alpha／opacity／加色、黑色覆盖、掩码、裁切／翻转／缩放、底图、优先级与同级顺序；16份文字前后层、4份历史alpha动画正例、6份命名缓存组合。另遍历65,536组字节分量与3,584组alpha／opacity／底图，共70,682份整帧参考在源码／生成API相同。原创显式调色板黑色1转换计入参考。部分调色板另用独立12字节正例及缺项／空／不完整项拒绝验证。

**实际材料**：完整所选头盘点找到25个非默认ARGB动作，112帧与独立Python逐幅完整RGBA相同；17份命名载体含113305的645字节，10帧只使用其有效色。8帧带alpha的加色另外证明不使用普通alpha混合。共1,879,080个像素与不透明覆盖不同，实际RGB均白色，任意RGB由上述原创矩阵验证。所有输入／输出摘要及采样范围在build留存。

**回归与构建**：260个文件／3,704测试通过，7项新增；130项针对测试及生成API同一7项检查通过。API189输入／Page247输入重建，esbuild0.25.12、外部导入0，全部输入与产物摘要核对。运行记录分别说明源／生成／本机端口证据。

**八条本机流程**：普通透明CUT59510／物件8192及带alpha加色CUT59526／物件4293，各跑桌面、触屏模拟、Node源码Page、Node生成Page。每条均读实际1072文件ZIP，完成人物／版本／外观、进入、显隐／107／54／27格、触摸或鼠标移动、场景重建和断开；独立Python各确认7请求／2移动。地图为12×12原创布局，实际CUT／AUT／动画材料不等于原版完整地图或服务验收。

**界面QA**：Browser插件未列出，记录 `Browser plugin not available`，沿用Playwright1.64.1／实际Chrome。本机临时URL `/web/game.html`，标题 `Moli · 游戏`，桌面1100×850、触屏模拟390×844。首屏非空、scroll0、无横向溢出或框架遮挡；error／页面异常0，每条浏览器流保留一条getImageData性能warning。源码／生成Page使用Node形状wx端口，实际DevTools／微信文件／Canvas／音频和物理手机尚未验收。

| 检查 | 桌面两场景 | 触屏模拟两场景 |
| --- | --- | --- |
| URL／标题、非空首屏、无溢出／框架遮挡 | 通过 | 通过 |
| 资源／人物／版本／外观及场景 | 通过 | 通过 |
| 透明／加色材料、小地图、移动／切图／断开 | 通过 | 通过 |
| error／页面异常 | 0 | 0 |

截图在仓库外 `/tmp/moli-stage294-qa/`，文件为 `{desktop,mobile}-{alpha,additive}-mode1-{initial,scene,animation}.png`。animation关闭小地图以查看材料对象，已查看两种尺寸。截图和日志完整摘要见机器记录，不能以单个AUT像素证明ARGB功能。

**复现**：依次运行本目录 `analysis/game-vertex-color-v1/verify_source.py`、`material_census.py`、`generate_vectors.py`、`material_oracle.py`；`portable-test.mjs`及`compare-material.mjs`可追加 `generated`。构建为 `build/wechat-game-stage294-api-final`、`build/wechat-app-stage294-page-final`，Page保留 `--game-config build/analysis/game-wechat-page-v1/game-config.json`。product-test.mjs设 `MOLI_VERTEX_SCENARIO=alpha|additive`，Page另设 `MOLI_MATERIAL_HOST=wechat`、`MOLI_PAGE_VARIANT=source|generated`、`MOLI_PAGE_BUILD=build/wechat-app-stage294-page-final`，筛选 `--test-name-pattern='actual ARGB'`。七项新测试还可用 `MOLI_VERTEX_BUILD=build/wechat-game-stage294-api-final/game.js` 对生成API复验。

**未完成**：原生硬件精度／默认状态、战斗专用样式与对象透明度绑定、RID／自身／混合／空目标／本地停止、完整玩法／调度／UI、现行交接和真实平台。37项需求／10个未完成组保持active/incomplete。[目标](../analysis/game-vertex-color-v1/goal-audit.json)

<a id="stage293-additive-render"></a>

## stage293 加色完整像素与实际入口验收

**来源**：固定37c4模块，REA6.7.0／Ghidra12.1.4。8函数／11,232字节和16字节D3D7 GUID完整匹配原文件；保留880条证据。微软SDK头独立核对接口顺序、混色状态和值，URL与完整文件摘要留在build，公开记录只列来源。REA已关闭，原程序执行、VM操作和官方会话0。[来源](../analysis/game-additive-render-v1/source-check.json) · [机器记录](../analysis/game-additive-render-v1/validation.json)

**独立模型**：480种完整画面覆盖遮罩、加色／普通覆盖、RGB饱和、opacity优先级、裁切／翻转／缩放、已有底图、优先级及同级顺序；4份文字前后层和4份历史动画正例，合计488份完整像素在源码／生成API摘要相同。历史35条动画状态轨迹仍逐项核对1250次状态，只将已证实8位的4个历史失败像素转为独立正例，其他不支持的样式保持错误。

**实际材料**：CUT59663／物件1464→动画113685／编号947，2动作／12帧在真实地面1099裁片上逐幅完整RGBA与Python参考一致。相对普通覆盖总计28,804个像素不同，实际这组帧饱和通道0，255截断用原创模型验证。实际选择、原图形与调色板、CUT及每份完整像素摘要全部留档；地图尺寸和布局仍由原创本机对端指定。

**测试与构建**：259文件／3,697测试通过，运行前后冻结输入不变。107项针对测试含新增6项，检查全部模型、文字目标帧、底图所有权、缓存身份、无效参数和动画描述。API189输入／Page247输入重建，外部导入0，全部输入与产物摘要复核。

**四种产品入口**：桌面、触屏模拟网页和Node下源码／生成Page均选择实际1072文件ZIP，完成人物／版本／外观、进入、加色物件、小地图显隐及三范围、移动、场景重建和断开。每种由独立Python对端确认7请求／2移动，没有新增会话命令。三档AUT抽查均为实际 `[0,0,1,255]`；加色完整结果由上述独立材料比较证明，不能仅凭该AUT抽查或成功构建证明。

**界面QA**：Browser插件当前未列出，记录 `Browser plugin not available`，沿用Playwright1.64.1与实际Chromium。本机临时URL `/web/game.html`，标题 `Moli · 游戏`；桌面1100×850、触屏模拟390×844。首次视口非空／scroll0／无横向溢出／无框架遮挡层；真实控制、场景和关闭后状态均检查。error／页面异常0，每条浏览器流一条getImageData性能warning保留。Page是Node形状wx端口，未声称DevTools／真机通过。

| 检查 | 桌面 | 触屏模拟 |
| --- | --- | --- |
| URL／标题、非空首屏及无横向溢出 | 通过 | 通过 |
| 实际资源／人物／版本入口与无框架遮挡 | 通过 | 通过 |
| 加色物件、显隐／三范围、移动／切图 | 通过 | 通过 |
| error／页面异常 | 0 | 0 |

截图在仓库外 `/tmp/moli-stage293-qa/`，为 `{desktop,mobile}-mode1-{initial,scene,animation}.png`。animation是关闭小地图后可见的发光物件，已人工查看两种尺寸；URL及截图摘要见机器结果。

**复现**：`python3 -B analysis/game-additive-render-v1/verify_source.py` 核对保留REA／SDK材料，`generate_vectors.py` 生成原创夹具，本机实际材料另运行 `material_oracle.py`。同目录 `portable-test.mjs`／`compare-material.mjs` 各可追加 `generated`。构建输出使用 `build/wechat-game-stage293-api-final` 和 `build/wechat-app-stage293-page-final`，Page仍传 `--game-config build/analysis/game-wechat-page-v1/game-config.json`。product-test.mjs为网页；Page设 `MOLI_MATERIAL_HOST=wechat`、`MOLI_PAGE_VARIANT=source|generated`、`MOLI_PAGE_BUILD=build/wechat-app-stage293-page-final`，加 `--test-name-pattern='actual additive'`。

**探测修正**：初次“push1／push27”字节搜索命中无关UI，通过D3D7 GUID找到实际初始化；SDK接口解析器一处宏拼写已改正。新功能使旧8位拒绝断言过期，已保留未知16位拒绝，并为原动画4份像素增加独立参考，没有改写历史夹具。任意顶点颜色、其他玩法／全局调度／UI、完整版本／现行交接和真实平台仍未完成，37项需求及10个未完成组保持。[目标](../analysis/game-additive-render-v1/goal-audit.json)

<a id="stage292-animation-named-palette"></a>

## stage292 命名调色板的全编号与真实动画验收

**来源**：REA6.7.0／Ghidra12.1.4，固定37c4 PE的16个函数／7,426字节、固定表1,495槽／5,980字节均完整匹配原文件。866条保留证据与快照只在build；REA已关闭，原程序执行／VM操作／官方会话均0。[来源](../analysis/game-animation-palette-source-v1/source-check.json) · [机器记录](../analysis/game-animation-palette-source-v1/validation.json)

**独立像素**：全部65,536种16位编号与独立原表摘要一致，9种原创完整RGBA覆盖命名颜色优先级、纯黑、0／有效／越界编号、tint和标志4。实际动画113058的2个动作／54帧，每幅完整RGBA与独立Python解析、调色板和栅格摘要相同；源码／生成API的模型与实际材料输出均逐字节一致。

**回归和构建**：258文件／3,691测试通过，运行前后冻结输入未变。本轮55项针对测试中新增8项，覆盖不同换色的缓存身份、64项LRU、取消／关闭的较晚载体读取、缺／短调色板及未证明样式拒绝。API189输入／Page247输入重新构建，外部导入0，全部输入和产物摘要复核。

**产品**：桌面、触屏模拟网页、Node下源码／生成Page共4种实际材料流程，59529物件1116→动画113058／选择器320。每种完成人物／版本／外观、进入、小地图显隐及三范围、移动、场景重建和断开；独立Python对端均确认7请求／2移动，实际命名调色板已被资源库准备。网页另2次完整视觉复查临时关闭小地图，确认动画未因叠层而被截图遮挡；四种变体与两次复查分别计数。

**QA**：`Browser plugin not available`，使用已有Playwright1.64.1与实际Chromium，本机临时URL `/web/game.html`、标题 `Moli · 游戏`。桌面1100×850、触屏模拟390×844。已核对首屏非空／scroll0／无横向溢出／无框架遮挡层，进入实际场景并检查控件、切图及断开；error及页面异常0。每条浏览器流有一条由getImageData像素抽查引起的性能warning，单独保留。Page结果是Node形状wx端口，不代表DevTools或真机。

截图均在仓库外 `/tmp/moli-stage292-qa/`：`{desktop,mobile}-mode1-{initial,scene,animation}.png`。scene展示小地图，animation展示临时关闭小地图后的实际物件，已人工查看两种尺寸；实际URL及文件摘要见机器记录。

**复现**：`python3 -B analysis/game-animation-palette-source-v1/verify_source.py` 核对已保留REA材料，`generate_palette_profile.py` 生成数值映射，`generate_vectors.py` 生成原创夹具；本机实际材料另用 `material_oracle.py`。同目录 `portable-test.mjs` 和 `compare-material.mjs` 可分别追加 `generated`。构建改用 `build/wechat-game-stage292-api-final` 与 `build/wechat-app-stage292-page-final`；Page仍传 `--game-config build/analysis/game-wechat-page-v1/game-config.json`。运行同目录product-test.mjs；Page设 `MOLI_MATERIAL_HOST=wechat`、`MOLI_PAGE_VARIANT=source|generated`、`MOLI_PAGE_BUILD=build/wechat-app-stage292-page-final`，加 `--test-name-pattern='actual named palette'`。

**探测修正与边界**：直接重跑stage291的“应失败”旧脚本会因当前已成功而不满足旧断言，单列为历史负例转正的探测记录。另修正原创测试传入typed-array而既有palette合同要求普通Array、关闭会话允许CLOSED／CANCELLED两种既有错误的核验断言，以及参考脚本的一处Python拼写；没有以修改像素或忽略选择器消除差异。加色标志8、完整动画上下文／资源版本、其余游戏玩法／调度／UI、现行交接和实际平台仍未完成，37项需求和10个未完成组保持。[目标](../analysis/game-animation-palette-source-v1/goal-audit.json)

<a id="stage291-legacy-minimap"></a>

## stage291 小地图来源、完整像素与实际入口验收

**来源**：REA6.7.0／Ghidra12.1.4，固定37c4模块的21个函数／9,427字节及范围常量完整匹配；835条保留证据、快照和完整字节只留build。会话已关闭，原程序执行0、VM操作0、官方会话0。[来源](../analysis/game-legacy-minimap-v1/source-check.json) · [机器结果](../analysis/game-legacy-minimap-v1/validation.json)

**独立与实际材料**：9幅完整格网、18幅完整RGBA、20种代表色及11步时钟，在源码和生成API得到相同49行摘要。实际341CUT／337AUT逐文件摘要已盘点；独立按最终索引扫描得到17,286个颜色来源，27个颜色、59529 AUT及三档完整RGB格网／RGBA都一致。实际113058解析54帧，但非零调色板320的场景显示另列失败验收。

**测试与构建**：257个测试文件、3,683项回归通过，26项本轮针对测试包含宽窗口跨2601格条带、普通物件足迹、原调色板平均、缺／短AUT、队列替换、关闭后读取、显隐缓存及Canvas同步装饰器。测试输入在运行前后冻结并复核。API188输入／Page246输入重新构建，外部导入0；全部输入和产物摘要复核。

**产品流程**：模式0与1各在桌面、触屏模拟网页、Node下源码／生成Page执行，共8条正向流程。每条选择实际1072文件ZIP，完成人物／版本／外观、进入、小地图显隐、三档范围、移动、场景重建及断开；独立Python对端均确认7请求／2移动，无新增或重复请求。四条模式1流程三档抽查均取得实际AUT像素 `[0,0,8,255]`；完整格网／RGBA比较另以Python摘要验证。场景和地图尺寸仍是原创对端内容。

另有1条实际动画负例：59529物件1116→资源113058／调色板320，错误 `LEGACY_SCENE_FRAME_DRAW_STYLE`，不算动画成功。首次探测还修正了核验器误读inspect结构，以及将Canvas readback warning当error的断言；warning随后单独保留，没有更改产品像素或过滤error。

**界面QA**：`Browser plugin not available`，使用既有Playwright1.64.1与实际Chromium；本机临时URL `/web/game.html`、标题 `Moli · 游戏`。桌面1100×850、触屏模拟390×844。已查看两种模式的桌面／手机尺寸场景截图；每条正向浏览器流程一条由重复getImageData触发的性能提示，error和页面异常均0。

| 项目 | 桌面 | 触屏模拟 |
| --- | --- | --- |
| URL／标题、非空首屏、初始scroll0及无横向溢出 | 通过 | 通过 |
| 无框架遮挡层、实际资源／人物／版本入口 | 通过 | 通过 |
| 两种地图、小地图显隐和三档范围 | 通过 | 通过 |
| 实际AUT抽查、移动、切图和独立TCP回执 | 通过 | 通过 |
| 控制台error／页面异常 | 0 | 0 |

截图在仓库外 `/tmp/moli-stage291-qa/`，文件名为 `{desktop,mobile}-mode{0,1}-{initial,scene}.png`，对应实际URL及摘要写入机器记录。微信结果是Node端口验证，不代表DevTools或真机验收。

**复现**：`python3 -B analysis/game-legacy-minimap-v1/generate_vectors.py`；本机保留材料时运行同目录 `material_oracle.py`。`node analysis/game-legacy-minimap-v1/portable-test.mjs` 和 `compare-material.mjs` 各可追加 `generated` 比较新API。构建用 `node tools/build-wechat-game.mjs --outdir build/wechat-game-stage291-api-final` 及 `node tools/build-wechat-app.mjs --game-config build/analysis/game-wechat-page-v1/game-config.json --outdir build/wechat-app-stage291-page-final`。网页测试为同目录product-test.mjs；Page设置 `MOLI_MATERIAL_HOST=wechat`、`MOLI_PAGE_VARIANT=source|generated`、`MOLI_PAGE_BUILD=build/wechat-app-stage291-page-final`，使用 `--test-name-pattern='actual minimap'`。动画负例另设 `MOLI_MINIMAP_ANIMATED=1`。

**未完成**：实际非零动画调色板、完整资源版本、其余游戏消费者／全局调度／UI、现行交接、真实微信／手机／设备音频及官方账号兼容。37项需求和10个未完成组保留。[目标](../analysis/game-legacy-minimap-v1/goal-audit.json)

<a id="stage290-legacy-material-compat"></a>

## stage290 真实素材到可交互场景的限定验收

**来源与完整性**：37c4固定模块、已有REA证据及31处字节／映射、42个默认名称重新匹配；约2.55GB材料ZIP哈希仍与stage289一致。明确参数选择27个文件，原件逐项SHA复核。源码与生成API对641,666行构造的全部850,000个元数据和查找位取得相同摘要，510次同组覆盖保留；没有新增原生字段或原程序执行。[来源](../analysis/game-legacy-material-compat-v1/source-check.json) · [机器记录](../analysis/game-legacy-material-compat-v1/validation.json)

**独立数据比较**：144份完整物理图像像素、136次资源库绘制、36个动画定义／16,280帧均与Python独立参考一致，源码／生成API输出逐字节相同。另有8个保留索引通过直接精灵API比较。260个实际WAV、14,451,010个完整PCM样本与Python wave一致；音频比较使用生产源码读取器，不代表生成独立音频API或设备播放验收。

**本轮新增产品证据**：桌面、触屏模拟网页、Node下源码／生成Page四条正向流程，均选择实际1,072文件ZIP，进行人物列表、版本、外观、进入、移动、场景重建及断开。每条独立Python对端确认7个请求、两条移动请求，画面为真实材料的640×480非空像素；Page观察到超过2GiB的文件读取位置。对端场景是原创内容，明确采用来源已支持的模式0。

**缺文件负例**：另一模式1场景请求缺失的CUT23，桌面流程核对 `LEGACY_ASSET_REQUIRED_FILE`、0场景帧、0控制台／页面错误。这是材料缺口的确认，不是模式1地图通过。最初探测及核验器两次预期修正分别记录于机器结果说明。

**界面QA环境**：本机临时URL `/web/game.html`，标题 `Moli · 游戏`；桌面1100×850、触屏模拟390×844。`Browser plugin not available`，使用既有Playwright1.64.1与实际Chromium，无新依赖。

| 检查 | 桌面 | 触屏模拟 |
| --- | --- | --- |
| 初始URL／标题、非空内容、没有框架遮挡层 | 通过 | 通过 |
| 初始滚动0、无横向溢出 | 通过 | 通过 |
| 实际ZIP及人物／版本／外观控件 | 通过 | 通过 |
| 真实材料画面、移动、场景重建及TCP回执 | 通过 | 通过 |
| 控制台／页面错误为0 | 通过 | 通过 |

截图在仓库外 `/tmp/moli-stage290-qa/`：`desktop-initial.png`、`desktop-scene.png`、`mobile-initial.png`、`mobile-scene.png` 及缺CUT的两张截图；哈希和实际URL见机器记录。已人工检查桌面和手机尺寸的场景画面，手机为触屏模拟。

**命令**：已有本机材料及stage289构建时，运行 `python3 -B analysis/game-legacy-material-compat-v1/corpus_oracle.py`，再运行同目录 `compare-corpus.mjs`／追加 `generated`；音频用 `audio_oracle.py` 和 `compare-audio.mjs`。页面为 `node --test --test-reporter=tap analysis/game-legacy-material-compat-v1/product-test.mjs`；Page加 `MOLI_MATERIAL_HOST=wechat`、`MOLI_PAGE_VARIANT=source` 或 `generated`、`MOLI_PAGE_BUILD=build/wechat-app-stage289-page-final` 及 `--test-name-pattern='actual material'`；缺CUT另设 `MOLI_MATERIAL_MISSING_CUT=1`。

**复用验证**：产品运行／既有测试输入不变，stage289 API186／Page244输入及所有输出哈希重新通过。既有254文件／3,657项回归作为未变输入的历史证据，本轮未重跑或重建；本轮正向4条／负向1条单列。13份文档同步更新，37项需求和10个未完成组不变。

**仍未验收**：缺失CUT与完整素材版本对应、其余游戏消费者／全局调度／完整UI、现行交接、实际微信／物理手机、物理声音和官方账号兼容。[目标](../analysis/game-legacy-material-compat-v1/goal-audit.json)

<a id="stage289-legacy-resource-archive"></a>

## stage289 大型资源读取、构建与界面验收

**实际材料**：固定37c4模块与Bin共1,072文件、2,549,015,355字节，存储型ZIP为2,549,171,845字节。独立Python zipfile流式读取全部文件，逐项SHA-256和CRC均匹配。源码／生成API比较3,216段首／中／尾资源，完整模块SHA及v2摘要一致，并与Node标准MD5结果一致；仅读原件，没有执行模块。首次索引3次读取／143,457字节，完成上述范围与启动检查共读取3,477,476字节。这里验证传输完整性，实际图形／地图版本兼容未验。[来源](../analysis/game-legacy-resource-archive-v1/source-check.json) · [机器记录](../analysis/game-legacy-resource-archive-v1/validation.json)

**格式与回归**：Python／系统zlib原创25种夹具；源码与生成API输出21条记录、3,708次范围查询一致，含15正向及6拒绝／清理模型。30项共享、11项网页／wx新增检查，加旧更新／导入检查共61项专项通过；254个文件／3,657项完整回归通过，1,598个输入在完整回归期间哈希一致；其中3个阶段审计输出随后正常定稿，1,595个运行／规格输入仍保持最终字节。真实稀疏ZIP64在4GiB之后读取标记，没有分配整库。API186输入／Page244输入及全部构建输出重新核对，无外部导入。

**14条本机产品流程**：存储ZIP有声、Deflate ZIP有声、存储ZIP静音，分别跑桌面／触屏模拟Chromium及Node下源码／生成wx Page，共12条；旧文件夹入口桌面／触屏各1条。有声输出菜单56、57和位置命中1共3次PCM，静音0次；每条均9个TCP请求、回合1、MP5、目标HP58，退出后移动2次。ZIP夹具为原创273文件、约2.55GB稀疏包，含260个独立声音路径；每条实际读取低于32MiB，Page观察到超过2GiB的原生形状位置参数。它们没有使用原游戏美术或真实服务器。

**界面QA**：当前没有Browser插件（`Browser plugin not available`），使用已有Playwright1.64.1和实际Chromium。没有新增根package.json或安装依赖。

| 检查 | 桌面1100×850 | 触屏模拟390×844 |
| --- | --- | --- |
| 初始本机URL与标题 `Moli · 游戏` | 通过 | 通过 |
| 非空页面、没有遮挡层、初始滚动为0 | 通过 | 通过 |
| ZIP／文件夹互斥选择及准备连接 | 通过 | 通过 |
| 进入场景、战斗、退出后继续移动 | 通过 | 通过 |
| 无横向溢出、控制台／页面错误为0 | 通过 | 通过 |

14张PNG留在仓库外 `/tmp/moli-stage289-qa/`，包含初始视口及三种ZIP场景的资源／游戏视口；人工查看了桌面／手机初始页、桌面选择资源和手机Deflate资源／游戏页。截图哈希、实际URL及日志见机器记录的 `frontend_QA`。

**复现**：`node analysis/game-legacy-resource-archive-v1/portable-test.mjs` 与追加 `generated` 参数分别读取源／生成API；实际材料检查为同目录 `material_check.mjs`，独立全包校验为 `verify_pack.py`。完整测试命令、每条产品环境变量、构建报告和哈希均在机器记录引用的私有日志／回执中。原生读取清理后3,656项通过；再补打包回执路径冲突检查及有效包回读，最终重新冻结输入通过3,657项。初次新增打包测试误用了Buffer共享切片，已改成独立Uint8Array；失败及早期主动停止记录均保留。

**未验收**：实际微信开发者工具／设备、物理手机文件选择与声音、整套资源版本兼容、完整原生调度／游戏、现行交接及官方账号兼容。没有VM、新REA会话、原程序或官方会话操作；完整目标active。[目标审计](../analysis/game-legacy-resource-archive-v1/goal-audit.json)

<a id="stage288-legacy-battle-audio"></a>

## stage288 音效源码、生成代码及本地产品验收

**已验证**：4个完整函数／1,100字节、8段读取／33,283字节，构造器4,802条指令和188段静态数据输入均绑定固定PE。270个明确编号、260个路径、128个声像格及691个整数横坐标边界已核对。40组独立完整状态共288个选中cue，源码与生成API输出逐字节一致。[完整记录](../analysis/game-legacy-battle-audio-v1/validation.json)

22项音频专项检查及252文件／3,616项完整回归通过，1,578个输入在完整回归中保持一致。专项覆盖单／双声道、采样率、音量、五次更新、64槽复用、静音／缺文件／损坏文件、读取逆序、暂停／换战斗／关闭／过期结果。API185／Page242个输入，两次构建零外部导入。

**产品证据**：8条真实本机TCP流程，包括桌面Chromium、触屏模拟Chromium、Node下源码Page与生成Page，各有声／静音一次。有声各产生3次播放，PCM标记为菜单56、57及10001动画信号的命中1，并观察到位置声道差异；静音为0次。每条均为9个请求、回合1、MP5、目标HP58、退出后移动2次。

**未验证**：物理扬声器听感、实际微信开发者工具／真机、完整原生应用音频调度、当前版本交接和官方账号兼容。首次未完成回归已停止后冻结最终输入重跑；早期产品音效断言误用另一效果分支的134，已按实际动画信号修正。没有原程序、VM或官方会话执行。[目标核对](../analysis/game-legacy-battle-audio-v1/goal-audit.json)

<a id="stage287-legacy-battle-detached-rid"></a>

## stage287 106 RID2000验收

**静态来源通过**：固定37c4历史样本，REA6.7.0／Ghidra12.1.4；10个完整函数共1,844字节、5段读取共9,230字节，15条证据。既有派生主分派14,120条指令、54,685字节重新匹配，REA已关闭。[来源清单](../analysis/game-legacy-battle-detached-rid-v1/source-check.json)

**共享实现通过**：106项定向与6项旧负例（含3条TCP）；720组独立队列、29种轨迹、15,288个状态、1,030张完整RGBA。1种自然结算、28种有限等待前缀；29种真实管理器均到回合1，其中28种在第7,207次回调恢复。源码／生成版结果逐字节一致。另验收旧50动作尾、晚删除槽0、骑乘／附属清除及原子拒绝。[完整回执](../analysis/game-legacy-battle-detached-rid-v1/validation.json)

**产品入口通过**：自然结束与等待恢复各经桌面Chromium、移动触摸仿真、Page源码与生成版，共8条本机TCP流程。施法者HP70／MP5、目标HP70、回合1、退出和后续两次移动通过；等待流程核对实际保活请求。最终250文件、3,602项测试、1,572个冻结输入通过；API183／Page240输入，零外部导入。[目标核对](../analysis/game-legacy-battle-detached-rid-v1/goal-audit.json)

**未验收**：其余未观察的RID／自身／混合／空／停止上下文、完整玩法与原窗口／音频／全局调度、原程序动态及渲染后端、现行交接、真实微信和物理设备。本轮VM动作、原程序执行和官方会话均0；37项需求与10组未整体完成。

<a id="stage286-legacy-battle-impact-skills"></a>

## stage286 五类冲击消费者验收

**静态来源通过**：固定37c4历史样本，REA6.7.0／Ghidra12.1.4；11个完整函数共5,689字节、11段读取共20,575字节。既有派生主分派14,120条指令、54,685字节重新匹配，22条证据已导出，REA已关闭。[来源清单](../analysis/game-legacy-battle-impact-skills-v1/source-check.json)

**共享实现通过**：102项定向、6项旧负例；4,800组独立队列、64种轨迹、14,251个回调状态与1,206张完整RGBA。61种自然完成，3种保留等待前缀；64种真实管理器均到回合1，三种自身等待在第7,207次回调恢复。源码／生成版结果逐字节相同。109烟雾另有374状态／40像素对照，覆盖于现有上位套件。[完整回执](../analysis/game-legacy-battle-impact-skills-v1/validation.json)

**本地产品入口通过**：五类各经桌面网页、移动网页、Page源码与生成版，共20条实际本机TCP流程；施法者HP70／MP5、目标HP58、回合1、退出和后续两次移动均通过。最终249文件、3,566项测试、1,568个冻结输入通过；API183／Page240输入，零外部导入。火花父指针修正前主动中断的首轮回归单列保存，未当作完成。[目标核对](../analysis/game-legacy-battle-impact-skills-v1/goal-audit.json)

**未验收**：分身RID、隐藏偏转几何、空目标及更多混合／停止上下文、107原成功文本、完整玩法、原程序动态和后端、现行交接、真实微信与物理设备。网页／Page为Node测试主机，本轮VM动作、原程序执行、官方会话均0；37项需求与10组继续保留。

<a id="stage285-legacy-battle-upper-skills"></a>

## stage285 六类上位消费者验收

**静态来源通过**：固定37c4历史样本，REA6.7.0／Ghidra12.1.4。5个完整函数共490字节、9段读取共4,236字节；既有派生主分派14,120条指令、54,685字节重新匹配。IAT和CP932格式由原PE字节核对，REA已关闭。[来源清单](../analysis/game-legacy-battle-upper-skills-v1/source-check.json)

**共享实现通过**：62项定向、6项旧负例，4,320组独立队列、26种轨迹、4,825个状态和474帧完整RGBA。24种轨迹结算，2种保留等待前缀；26种真实管理器均到回合1，其中24种自然完成、2种在第7,207次回调恢复。源码／生成版结果一致。[完整回执](../analysis/game-legacy-battle-upper-skills-v1/validation.json)

**本地产品入口通过**：六类各经桌面网页、移动网页和Page源码／生成版，共24条实际本机TCP流程。108目标HP77，112目标离场，其余目标HP70；本地施法者HP70、MP5、回合1、退出与后续两次移动均通过。最终248文件、3,496项测试、1,561个冻结输入通过；API181／Page238输入，零外部导入。首轮旧108负例失败已保留并修正为116。[目标核对](../analysis/game-legacy-battle-upper-skills-v1/goal-audit.json)

**未验收**：107原版成功文字、其余未覆盖技能及混合／空／停止组合、完整玩法、原程序动态、原版渲染后端、现行交接、真实微信和物理手机。本轮VM动作、原程序执行、官方会话均0；37项需求和10个消费者组未整体完成。

<a id="stage284-legacy-battle-skill99"></a>

## stage284 六类状态技能验收

**静态来源通过**：固定SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0／Ghidra12.1.4。2个完整帮助函数、12段读取、6项字节检查及6处调用通过。旧派生主分派的14,120条指令、54,685字节再次匹配；不计为新的规范函数。REA已关闭。[来源清单](../analysis/game-legacy-battle-skill99-v1/source-check.json)

**共享实现通过**：68项定向测试和5个旧负例回归。独立原版方程有2,520组队列、15种完整轨迹、5,156个状态和352帧完整RGBA，全部结算；源码／生成版一致。15种真实管理器回调自然完成回合1，HP事件0、MP扣费各1次。六类253／274声音事件也在源码／生成版一致。C图标保留、位清除、指示器位移、缺失资源、旧第四格、容量原子性及畸形输入另有检查。[完整清单](../analysis/game-legacy-battle-skill99-v1/validation.json)

**产品本地入口通过**：99类、104类及已有图标三种场景，各经桌面／移动网页和Page源码／生成版，共12条实际本机TCP流程。全部HP70、MP5、回合1、退出并恢复移动。全量247文件、3,464项测试、1,555个冻结输入通过。两套构建179／236个输入、零外部导入，只有5个共享运行文件变化。[目标核对](../analysis/game-legacy-battle-skill99-v1/goal-audit.json)

**未验收**：其余游戏消费者、完整玩法、原程序动态、原版后端采样、物理音频、现行交接与真实微信／手机。本轮VM动作、原程序执行和官方会话均为0；37项需求和10个消费者组未整体完成。

<a id="stage283-legacy-battle-self-flags"></a>

## stage283 自身完整结果字验收

**静态来源通过**：固定SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0／Ghidra12.1.4。核对1个完整函数、8段读取、8段保留范围、13项字节检查、4处调用、10个分派表项和10个角度常数。42处直接位移引用的16读／26写仅作限定库存；八个不透明位不作全程序无用途结论。REA已关闭。[来源清单](../analysis/game-legacy-battle-self-flags-v1/source-check.json)

**本地实现通过**：538项针对性测试，含6,800组公共完整字输入、2,800组独立队列。15种独立160次回调前缀共2,400个状态、120帧完整RGBA与源码／生成版一致，均仍未结算。38种完整源码／生成回调逐字节一致，37种保留7203次观察恢复，反射组合自然结束；全部回合1。瓦片旧第四格保留、局部动画9、旋转朝向和费用单列验证。五个相关旧负例回归通过。[完整清单](../analysis/game-legacy-battle-self-flags-v1/validation.json)

**产品本地入口通过**：正常命中、局部反应和不透明位反射组合，各经桌面／移动网页、Page源码／生成版，共12条实际TCP流程。正常命中HP58／局部反应HP70，组合HP58，全部MP5、回合1并退出恢复移动；需原等待的场景保留真实时限和至少3次心跳。全量246文件、3,442项测试、1,551个冻结输入通过。两套构建179／236个输入、零外部导入，仅规划器变化。[目标核对](../analysis/game-legacy-battle-self-flags-v1/goal-audit.json)

**未验收**：全程序间接消费者、完整玩法、原版动态、现行交接、真实微信／手机与官方会话。本轮VM动作、原程序执行及官方会话均为0；37项需求与10个消费者组未整体完成。

<a id="stage282-legacy-battle-self-guard"></a>

## stage282 普通自身护卫与角色重合验收

**静态来源通过**：固定SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0／Ghidra12.1.4 核对两个完整函数、3段读取、8段保留范围、7个操作数和8个调用。24个动作及4个三字段追加顺序已核对，释放条件和原7200等待依据单列；REA已关闭。[来源清单](../analysis/game-legacy-battle-self-guard-v1/source-check.json)

**本地实现通过**：修改前复现自身护卫拒绝。497项针对性测试通过，含14,000组独立原版队列向量和128组释放分支组合。四种独立场景共1,280个回调状态、32帧完整RGBA与产品一致，属于320调用的有限前缀。49种完整源码／生成回调逐字节一致，均在7203次恢复后完成回合1；蓄力冻结、费用、角色资源、先前伤害与无命中副作用均保留。缺失角色、访问器和合并容量拒绝原子性通过。[完整清单](../analysis/game-legacy-battle-self-guard-v1/validation.json)

**产品本地入口通过**：自身由另一角色护卫、三个角色同体、带蓄力的自身护卫，分别经桌面／移动网页、Page源码／生成版运行，共12条实际TCP流程。全部保留真实等待和至少3次心跳，等待回合1后再验证退出与移动；HP70、MP5。全量245文件、3,401项测试及1,547个冻结输入通过。两套构建179／236个输入、零外部导入，仅规划器变化。[目标核对](../analysis/game-legacy-battle-self-guard-v1/goal-audit.json)

**未验收**：剩余自身结果位、完整玩法、原版动态、现行交接、真实微信／手机与官方会话。本轮未操作VM、运行原程序或连接官方服务器，37项需求和10个消费者组保持未整体完成。

<a id="stage281-legacy-battle-self-metadata"></a>

## stage281 自身资源、提示和状态元数据验收

**静态来源通过**：固定SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0／Ghidra12.1.4 核对两个完整辅助函数、4段新读取、8段保留范围、20个操作数及9个调用。元数据目标、RID三次推进、自身类别重置、状态清除及零值消息均有坐标。REA已关闭；原创动画的八方向信号另由Python独立解析。[来源清单](../analysis/game-legacy-battle-self-metadata-v1/source-check.json)

**本地实现通过**：修改前复现规划拒绝。445项针对性测试、2,000组类别／等级／标志规划输入、67种源码／生成回放通过。回放逐字节一致，9种自然完成、58种等待恢复；核对组合消息、RID资源／骑乘／附属节点、别名与连续记录、状态清除条件、元组和费用。另有4种源码／生成扩展探针，验证等级9瓦片／RID游标5／6、类别5首条位清除，以及类别81附加治疗后HP65。缺少攻击信号时没有补造命中。独立选择有完整合成图像的资源，确认身体、骑乘、附属和五条提示均进入绘制，源码／生成包RGBA一致；其他组合的节点与游标证据单列。[完整清单](../analysis/game-legacy-battle-self-metadata-v1/validation.json)

**产品本地入口通过**：消息反射、RID反射及状态清除各经桌面／移动网页、Page源码／生成版，共12条实际TCP流程，核对HP58、MP5、回合1、退出及恢复移动；状态清除保留长等待与心跳。全量244文件、3,349项测试及1,543个冻结输入通过。两套构建179／236个输入、零外部导入，仅共享规划器变化；两组早期参考失败和旧负例回归单独留档。[目标核对](../analysis/game-legacy-battle-self-metadata-v1/goal-audit.json)

**未验收**：自身护卫别名及其他特殊上下文、完整玩法、原版动态、现行交接、真实微信／手机和官方会话。本轮未操作VM、运行原程序或连接官方服务器，37项需求和10个消费者组保持未整体完成。

<a id="stage280-legacy-battle-reentry"></a>

## stage280 实际产品第二场 TCP 验收

**静态来源通过**：固定旧版 SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA6.7.0／Ghidra12.1.4 新取3段字节，重核3段保留原版范围、10个操作数、7个调用；入场重置、首个确认及停止工作所有者已核对。REA 已关闭。移动期望另经独立 Python 坐标、移动和编码参考复算。[来源清单](../analysis/game-legacy-battle-reentry-v1/source-check.json)

**实际产品本地流程通过**：普通自身蓄力、蓄力反射、散开自动停止三种首场，分别运行桌面网页、移动网页、Page源码与生成版，共12条 TCP 流程、24场战斗。每条复用原连接，确认第二场新角色、HP／MP、回合0→1、绘制、技能伤害及费用、再次退出和移动。首场普通蓄力保留长等待与心跳，自动停止仍为回合0且在测试结束指令前退出；第二场统一为MP9→4、目标HP80→68。每条逐包确认两次护卫、两次退出、四条移动请求。[完整清单](../analysis/game-legacy-battle-reentry-v1/validation.json)

**回归与构建通过**：243文件、3,280项测试、1,541个冻结输入保持不变；API179个、Page236个输入、零外部导入，两套构建输入与stage279逐一相同。产品运行代码未改，三处测试夹具扩展连续战斗并修正首场尚未到达时的移动期望。两个初始诊断失败单独保留。[目标核对](../analysis/game-legacy-battle-reentry-v1/goal-audit.json)

**未验收**：完整玩法、原版动态、真实微信／手机、现行交接与官方会话。本轮未操作VM、运行原程序或连接官方服务器；37项需求与10个消费者组未整体完成。

<a id="stage279-legacy-battle-self-control"></a>

## stage279 自身控制、自动退出及组件新入场验收

**静态来源通过**：固定 SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 新取 6 段字节；8 段保留范围、一段补核原 PE 范围、20 个操作数、7 个调用及 4 个分派表项均已核对。观察范围覆盖所选控制片段，不作整个函数／游戏完整证明；REA 会话已关闭。[来源清单](../analysis/game-legacy-battle-self-control-v1/source-check.json)

**本地实现通过**：修改前复现自身控制规划拒绝；376 项针对性测试通过，包含 2,600 个类别／等级／标志组合和 161 种实际控制回放。源码／生成回放逐字节一致：109 种等待恢复、24 种角色移除、24 种停止、4 种自然完成。每种随后经公共入场和角色输入接口，复用原命令所有者及资源库完成新回合；不是重建测试对象或直接写入就绪／身体状态。[完整清单](../analysis/game-legacy-battle-self-control-v1/validation.json)

**产品本地入口通过**：普通自身蓄力、蓄力后反射、主控散开自动停止，分别运行桌面网页、移动网页、Page 源码及生成版，共12条实际本地 TCP 流程。核对费用、结果、退出和回场移动；四条停止路径在测试端发送结束指令前收到退出请求，回合0、MP7；其余场景回合1、MP5。普通蓄力保留真实等待与心跳。全量243文件、3,280项测试、1,540个冻结输入及两套构建通过；构建179／236个输入、零外部导入，仅共享规划器变化。两次测试等待／计数错误单独保留。[目标核对](../analysis/game-legacy-battle-self-control-v1/goal-audit.json)

**未验收**：产品退出后的第二场完整 TCP 流程、原版动态、原图像完整还原、真实微信与手机、现行交接、官方会话和完整玩法。本轮未操作 VM、执行原程序或连接官方服务器。37 项需求与10个消费者组未整体完成。

<a id="stage278-legacy-battle-self-special"></a>

## stage278 自身 E000 结果与后续队列验收

**静态来源通过**：固定 SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 新取 6 段字节，8 段保留范围、19 个操作数及 10 个调用均与原 PE 核对。包括结果优先顺序、反射双次推进、元组及动作 155；两个 REA 会话均已关闭。[来源清单](../analysis/game-legacy-battle-self-special-v1/source-check.json)

**本地实现通过**：修改前复现自身 E000 规划拒绝；213 项针对性测试通过，包括 1,400 个类别／等级／标志组合及 161 种实际回调。161 种源码／生成回放逐字节一致；28 种自然结束，133 种在第 7203 次回调触发既有恢复。类别 81 的 HP `70 → 58 → 65`、连续命中后的类别变化、零值、别名及有符号整数边界均已核对。初次遗漏 81 类额外治疗的预期失败单独保留。[完整清单](../analysis/game-legacy-battle-self-special-v1/validation.json)

**产品本地入口通过**：类别 6 先他后己的反射／治疗、类别 84 的多位优先结果，分别运行桌面网页、移动网页、Page 源码与生成版，共 12 条实际本地 TCP 流程。核对回合 1、费用、结果、退出和恢复移动。反射四条自然结束且心跳为 0，其余八条按正常时钟等待，期间继续发送并核对心跳。首轮反射回执检查失败和一次全量输入变化均保留，最终全量 242 文件、3,117 项测试、1,538 个冻结输入通过。两套构建有 179／236 个输入、零外部导入，仅规划器改变。[目标核对](../analysis/game-legacy-battle-self-special-v1/goal-audit.json)

**未验收**：原版动态、原图像完整还原、真实微信与手机、现行交接、官方会话和完整玩法。本轮未执行原程序、VM 或官方连接。37 项需求与 10 个消费者组未整体完成。

<a id="stage277-legacy-battle-self-family"></a>

## stage277 普通自身家族与实际类别预检验收

**静态来源通过**：固定 SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 新取 5 段字节，与原 PE 一致；8 段保留范围、16 个操作数和 5 个直接调用均复核。REA 会话已关闭。[来源清单](../analysis/game-legacy-battle-self-family-v1/source-check.json)

**本地实现通过**：改动前两个测试分别复现类别 5 被拒及技能 6 错取 MP 数字；修正后 48 项针对性测试通过，包括 200 个类别／等级组合和 32 种真实回调。源码与生成核心的 32 条回放逐字节一致。类别 6 先他后己的场景先扣对方 MP 再扣自身 HP；32 种均经第 7203 次回调的既有恢复，未注入就绪或缩短时钟。初次断言遗漏初始化 `-1` 的失败单独保留。首轮全量回归 2,951／2,952 通过，旧技能 TCP 拒绝夹具仍发送本轮已支持的普通类别 95 自身记录；将该负例改为位 `0x10` 后重跑，保留其费用和 HP 不变断言。[完整清单](../analysis/game-legacy-battle-self-family-v1/validation.json)

**产品本地入口通过**：类别 5 首条`0x4` 标志位、自身在类别 6／84 连续列表之后，各运行桌面网页、移动网页、Page 源码和生成版，共 12 条实际本地 TCP 流程。均核对回合 1、费用、退出和恢复移动；类别 6 还核对目标 MP 4。六次错误主机筛选产生的空场景通过记录已剔除，不计入这 12 条。全量 241 文件、2,952 项测试、1,536 个冻结输入及两套构建通过；构建有 179／236 个输入、零外部导入，仅两个共享运行文件变化。[目标核对](../analysis/game-legacy-battle-self-family-v1/goal-audit.json)

**未验收**：原版动态、原图像完整还原、真实微信与手机、现行交接、官方会话和完整玩法。本轮未执行原程序、VM 或官方连接。37 项需求与 10 个消费者组未整体完成。

# 阶段验收记录

<a id="stage276-legacy-battle-self-pair"></a>

## stage276 普通自身结果与完整收包入口

| 证据层 | 实际结果 |
| --- | --- |
| REA 与 PE | 12 条字节记录、7 个既有范围、15 处操作数、11 个调用通过；两个会话关闭 |
| 角色与调用 | 当前目标来自同一登记表；普通结果推进目标状态；同槽时改变自身状态，原版动作14片段身份通过核验 |
| 实现前 | 新正向规划被统一自身拒绝分支阻止 |
| 新检查 | 12 项通过：30 组类别／等级规划、别名、10 种实际回放及保留的特殊结果边界 |
| 源码／生成 | 十种 JSON 逐字节一致，血量、一次费用、等待恢复和排空均相同 |
| 完成方式 | 全部第 7203 次恢复；普通7207，闪避／回避7254，先他后自7506，未列自然结束 |
| 顺序效应 | 先自后他目标保持70；先他后自目标64、自身58，回调时刻分别70／104 |
| 新本地 TCP | 两种记录 × 网页双视口／Page源码／Page生成版，共8条通过回合、费用、退出与同连接移动 |
| 请求核对 | 每条13个请求，其中4个心跳，guard1、退出1、移动2；最终自身HP58／MP5 |
| Page 回合 | 新Page四条均显式等待并记录 completedRound1；首轮费用／血量判定后的材料保留，未代替最终计数验证 |
| 旧控制 | 天气重复目标网页双视口和生成Page共3条通过 |
| 全量回归 | 240文件、2,916项通过；新增Page断言后重跑，1,534个输入保持不变 |
| 构建 | API／Page两套通过，179／236个输入和输出身份核对通过，外部导入0；API仅规划器改变，Page另含回合投影修正 |
| 未验收 | 其他自身类别／特殊结果、SKL402空侧原版上下文、原版动态、微信运行时、真机、现行版及官方兼容；本轮未重跑模板编译 |

先自后他的初始预期失败后，通过原版目标推进调用和实际状态轨迹确认等待头截断后续结果，修正了预期。首轮全量已通过，复核补齐显式回合断言后，进一步定位到 Page 显示适配器漏传字段。已修正真实计数投影，停止确认无法满足条件的旧等待任务，再完成四条 Page 与最终全量重跑。[来源](../analysis/game-legacy-battle-self-pair-v1/source-check.json) · [验收明细](../analysis/game-legacy-battle-self-pair-v1/validation.json) · [测试](../shared/tests/legacy-game-battle-self-pair.test.mjs) · [目标核对](../analysis/game-legacy-battle-self-pair-v1/goal-audit.json)

<a id="stage275-legacy-battle-weather-targets"></a>

## stage275 重复天气效果的队列与完整入口

| 证据层 | 实际结果 |
| --- | --- |
| REA 与 PE | 4 条新字节记录、6 个既有窗口、19 处操作数、26 个调用通过；会话关闭 |
| 实现前 | 新正向规划被旧重复效果拒绝分支阻止 |
| 定向回归 | 旧天气与新重复目标两个文件共 15 项通过；新增 8 项 |
| 源码／生成回放 | 五种 JSON 逐字节一致，效果总数分别 30、30、30、0、60 |
| 自然结束与退休 | 先普通后效果第 100 次排空，尚存四个效果，后续四次清理 |
| 既有恢复 | 其余四种于 7203 次触发等待恢复、7207 次排空，不列为自然结束 |
| 费用与状态 | 均仅第 3 次 MP 10→7，无 HP 更新，排空时天气 mode0 |
| 队列与原子性 | 100 个技能号、槽别名、66／67 次容量和自身效果写入前拒绝通过 |
| 新本地 TCP | 两种天气排列 × 网页双视口／Page 源码／Page 生成版，共 8 条通过回合、退出及移动 |
| 请求核对 | 自然流程各 9 个请求；叠加流程各 13 个，其中 4 个普通心跳；均 guard1、退出1、移动2，CFP 后 MP5 |
| 既有控制 | SKL400 重复目标网页双视口及生成 Page 共 3 条通过 |
| 全量回归 | 239 文件、2,904 项通过，1,532 个输入在运行期间未变 |
| 构建 | API／Page 两套通过，179／236 个输入与输出身份通过核验，外部导入0；仅共享规划器改变 |
| 未验收 | 原版执行、自身效果原版上下文、现行版、微信运行时、真机与官方兼容；本轮未重跑模板编译 |

首次新回放检查误用了 SKL400 的第 4 次费用时刻。SKL401 没有前置动作 241，实际第 3 次执行扣费；修正的是测试预期，费用实现未变。目标顺序、剩余效果和等待恢复均由真实消费者执行，没有以人工就绪或提前时钟替代。[来源](../analysis/game-legacy-battle-weather-targets-v1/source-check.json) · [验收明细](../analysis/game-legacy-battle-weather-targets-v1/validation.json) · [新测试](../shared/tests/legacy-game-battle-weather-targets.test.mjs) · [目标核对](../analysis/game-legacy-battle-weather-targets-v1/goal-audit.json)

<a id="stage274-legacy-battle-pursuit-linked"></a>

## stage274 联动元组、隐藏绘图与实际等待

| 证据层 | 实际结果 |
| --- | --- |
| REA 与 PE | 11 条字节记录、1 个既有等待窗口、13 处操作数、16 个调用通过；两个会话关闭 |
| 新增检查 | 联动规划、三类不足组、四种实际回放及拒绝原子性共 7 项；另有隐藏／正图形几何边界 1 项 |
| 定向回归 | 6 个文件、51 项通过，保留独立历史向量和绘图前回调前缀 |
| 源码／生成核心 | 四种回放 JSON 逐字节一致，分别排空于 7982、7982、7207、7207 次调用 |
| 等待恢复 | 四种均于第 7203 次触发已有恢复；不归为自然完成 |
| 资源与费用 | 元数据设资源 0 后跳过图形 0，身体仍归原池；MP 各仅 10→7，无 HP 更新 |
| 新本地 TCP | 桌面网页、移动网页、Page 源码和生成版共 4 条联动流程，通过回合、退出和同连接移动 |
| 心跳与请求 | 每条核对 4 个普通心跳，合计 13 个请求，1 次 guard、1 次退出、2 次移动；CFP 后 MP 5 |
| 既有控制 | 重复目标网页双视口、SKL19 反射生成 Page、图形 0 的实际 TCP 流程通过；Page 两种宿主另通过 8 项既有检查 |
| 全量回归 | 238 文件、2,896 项通过，1,530 个输入在运行期间保持不变 |
| 构建 | API／Page 两套通过，179／236 个输入与输出身份核验通过，外部导入 0；仅三个共享运行文件改变 |
| 未验收 | 原版图形 0 后端像素、原版动态、微信运行时、真机、现行版交接和官方兼容；本轮未重跑模板编译 |

初次全量 6 处旧绘图错误断言和 4 条新 TCP 心跳遗漏均已复现、修正。定向复核另区分了资源 7 的隐藏标记、背景绘图提交，以及历史向量停在绘图前的范围；独立状态／像素前缀不由当前实现重生成。[来源](../analysis/game-legacy-battle-pursuit-linked-v1/source-check.json) · [验收明细](../analysis/game-legacy-battle-pursuit-linked-v1/validation.json) · [新测试](../shared/tests/legacy-game-battle-pursuit-linked.test.mjs) · [目标核对](../analysis/game-legacy-battle-pursuit-linked-v1/goal-audit.json)

<a id="stage273-legacy-battle-pursuit-targets"></a>

## stage273 重复目标的队列与回放

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原 PE | 8 个新窗口、3 个既有窗口、20 处操作数和 24 个直接调用通过；会话关闭 |
| 实现前复现 | 新增 5 项正向用例均被旧重复目标拒绝分支阻止 |
| 新增检查 | 7 项通过，覆盖四种队列／回放、别名和容量原子性 |
| 自然完成 | 重复远端第 300 次、交错目标第 307 次回调排空，未触发等待恢复 |
| 提示分支 | 第 58 次排空，仍有两枚效果，再经过 54 次回调清理 |
| 重复自身 | 第 7203 次触发既有等待恢复，第 7730 次排空；不归为自然完成 |
| 费用和结果 | 四种场景均仅扣一次 MP 10→7，没有 HP 更新；效果数与每次目标出现对应 |
| 源码与生成核心 | 4 种回放 JSON 逐字节一致；API 179 个输入中仅施法规划器改变 |
| 全量回归 | 237 文件、2,888 项通过；1,527 个输入身份在运行期间未变，耗时约 275 秒 |
| 新本地 TCP | 普通／提示分支分别通过桌面网页、移动网页、Page 源码及生成版，共 8 条 |
| 请求与移动 | 每条新流程核对 9 个客户端请求、1 次 guard、1 次退出和 2 次移动；后续 CFP 后 MP 为 5 |
| 旧控制 | SKL19 反射交接在网页双视口和生成 Page 共 3 条通过 |
| 构建 | API 与 Page 两套通过，179／236 个输入及输出身份核验通过，外部导入为 0 |
| 未执行 | 原版动态、微信运行时、真机和现行版验收；本轮未重跑模板编译 |

最初观察将提示分支的回合结束等同于效果释放，且自身场景只观察到 7600 次调用。按实际生命周期追加清理，并延续至已存在的等待恢复结束后，两类结果单独通过。来源核验初次所选元组窗口未覆盖尾部，后以既有完整辅助函数窗口补齐，均与当前 PE 重核。[源证据](../analysis/game-legacy-battle-pursuit-targets-v1/source-check.json) · [验收明细](../analysis/game-legacy-battle-pursuit-targets-v1/validation.json) · [测试](../shared/tests/legacy-game-battle-pursuit-targets.test.mjs) · [目标核对](../analysis/game-legacy-battle-pursuit-targets-v1/goal-audit.json)

<a id="stage272-legacy-battle-round-ack"></a>

## stage272 当前身体确认与提前 A/P

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原 PE | 7 个新窗口、1 个既有窗口、30 处操作数、7 个直接调用通过；会话已关闭 |
| 失败复现 | 修正前 A 对 RID0 槽 5 返回空，新增正常入口测试失败；同一用例修正后通过 |
| 登记所有权 | 第 229 次调用登记 B，第 238 次登记 A；无 C 行的 B 仍正确出现在 A 标记结果 |
| 跨回合 A/P | 未来、过期、部分赋值、P 席位延迟及 `FFFFFFFF→0` 环绕共 4 种场景通过 |
| 生成核心 | 4 种回放与源码 JSON 结果逐字节相同；API 179 个输入中 178 个未变，唯一运行改动为共享接收器 |
| 全量回归 | 236 文件共 2,881 项通过，1,525 个输入文件身份在运行期间未变；耗时约 276 秒 |
| 新 TCP | 网页桌面／移动视口和 Page 源码／生成版共 4 条通过；操作席位改为 5，第二回合 MP 9→8 |
| TCP 请求 | 每条新流程核对 10 个客户端请求、2 次 guard、1 次退出和 2 次移动 |
| 旧 TCP 控制 | 提前 C 更新的网页双视口和生成 Page 的反射交接共 3 条通过 |
| 当前构建 | API 与 Page 构建通过，179／236 个输入及当前输出身份核验通过，外部导入均为 0 |
| 未执行 | 原版动态、微信运行时、手机真机及现行版验收；本轮未重跑模板编译 |

检查修改范围时，将当前共享模块逆向恢复为修改前文本并比对阶段初始哈希，确认仅改了 A 标记辅助函数。早期只读探查曾使用不存在的交接／状态字段，修正查询后取得登记证据；这些探查错误不作为产品故障。[源证据](../analysis/game-legacy-battle-round-ack-v1/source-check.json) · [验收明细](../analysis/game-legacy-battle-round-ack-v1/validation.json) · [测试](../shared/tests/legacy-game-battle-round-ack.test.mjs) · [目标核对](../analysis/game-legacy-battle-round-ack-v1/goal-audit.json)

<a id="stage271-legacy-battle-character-queue"></a>

## stage271 C 消费门限与跨回合环绕

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原 PE | 9 个新窗口、3 个既有完整函数窗口、29 处操作数、9 个直接调用通过；会话已关闭 |
| 正常入口 | 新增更新、结束、独立退出通知、三条消息顺序与环绕共 4 项；回程投射物出现后才注入 C |
| 消费时序 | 固定原创夹具第 142 次调用见回程投射物，370 排空回合，371 消费 C；更新之前旧主体已承受 HP 70→58 的反射 |
| 帧与更新 | 消费 C 的调用仍绘制旧槽 10；后续帧移除。三回合依次应用不同 C，最终读写指针均为 0 |
| 源码与生成核心 | 4 种入口回放的 JSON 结果逐字节相同；两个 API 构建的 179 个输入及包内容与 stage270 相同 |
| 相关测试 | 7 个文件共 108 项通过；325 个运行与夹具输入身份未变 |
| 新 TCP | 桌面网页、移动网页、Page 源码和生成版共 4 条通过；每条 10 个请求、2 次 guard、1 次退出、2 次移动 |
| 旧 TCP 控制 | C 注册移除的网页双视口、生成 Page 及来源 Page 的反射交接，共 4 条通过 |
| 当前构建 | API 与 Page 两套通过，外部导入均为 0；API 179 个、Page 236 个输入与输出身份核验通过 |
| 未复跑 | 核心、适配层与产品页面未变，本轮未重跑全量测试、模板编译和原版动态执行；真机及微信运行时未验收 |

初次队列夹具误用单数状态键，修正为 `characters` 后通过；来源断言的一处 TEST 指令操作数编码也经 PE 对照修正。这两处属于验证脚本修正。建立清单时遗漏 build 排除项的读取已中断，正式清单只覆盖 4,127 个成果文件。[来源核验](../analysis/game-legacy-battle-character-queue-v1/source-check.json) · [验收明细](../analysis/game-legacy-battle-character-queue-v1/validation.json) · [测试](../shared/tests/legacy-game-battle-character-queue.test.mjs) · [目标核对](../analysis/game-legacy-battle-character-queue-v1/goal-audit.json)

<a id="stage270-legacy-battle-exit-rid0"></a>

## stage270 致死退出与成对角色的生命周期

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原文件 | 13 个新窗口、1 个既有窗口、34 处操作数和 18 个直接调用核验通过 |
| 致死停止 | 普通与内联致死反射分别在第 285、297 个合成回调请求退出，RID0 仍未执行 |
| 退出与再次入场 | 阶段 7 清空 22 个登记项，阶段 8 完成渐变并发出一次退出请求。下一次入场清理旧对象，新身体可完成自己的扣费回合 |
| 远端离场 | 致死的远端原主体在第 292 个回调结束回合，交接对象标记回收，后续回调释放 |
| B 占用施法槽 | 第 49 个回调登记 B，58 登记 A，79 回程命中当前 B，447 回收 B，448 自然结束 |
| 源码与生成核心 | 四条分支回放逐条一致 |
| TCP 入口 | 八条新增及四条既有路径通过。自动死亡退出核对两次宠物待机、一次退出、两次移动，共 10 次客户端请求。成对角色分支核对一回合及战后移动 |
| 战斗专项 | 4 个文件的 89 项通过，其中三项新增验证退出、远端离场和 B 占用施法槽 |
| 构建 | 五套本地构建及 WXML、WXSS 编译通过 |
| 全量回归 | 234 个文件的 2,873 项通过，1,520 份输入在执行前后的哈希一致 |

原版动态、真实 C 时序、现行版、手机真机、微信运行时及官服继续验收。[源核验](../analysis/game-legacy-battle-exit-rid0-v1/source-check.json) · [回放与验收明细](../analysis/game-legacy-battle-exit-rid0-v1/validation.json)

<a id="stage269-legacy-battle-reflected-rid0"></a>

## stage269 反射内联卸载与交接

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原文件 | 17 个新窗口、4 个既有窗口、37 处操作数和 25 个直接调用复核通过 |
| 卸载与恢复 | 合成回放第 91 个回调命中并暂存骑乘对象，第 156 个回调恢复，第 165 个回调登记 A，第 297 个回调结束。修改前在第 156 个回调中断 |
| 生命周期回归 | 本地、远端及 A、B 同槽均完成交接。暂存期间对象隐藏且回调停用。在回程投射物回收后、221 开始前移除原主体，保留对象和未登记 A、B 均释放 |
| 反射对照 | 15 条回放在源码与生成核心逐条一致，14 条对照与修改前生成核心输出一致。覆盖普通反射、多个反射者、反射者接 RID0、保留骑乘资源及有限等待分支 |
| TCP 入口 | 四条新增及八条既有路径通过，覆盖桌面网页、移动视口及两种 Page 宿主。远端槽 2 最终为 `AfterCast`、HP 41、MP 6，槽 10 HP 70，槽 0 HP 70、MP 10，战后同连接恢复移动 |
| 战斗专项 | 4 个文件的 99 项通过，其中新增两项覆盖交接保留与源身体离场 |
| 构建 | 五套本地构建及 WXML、WXSS 编译通过 |
| 全量回归 | 234 个文件的 2,870 项通过，1,520 份输入在执行前后的哈希一致 |

反射回程实际 HP 命中与最终 RID0 数值分别核对。动画恢复属于独立实现，原版动态、真实 C 时序、现行版、手机真机、微信运行时及官服待验收。[源核验](../analysis/game-legacy-battle-reflected-rid0-v1/source-check.json) · [回放与验收明细](../analysis/game-legacy-battle-reflected-rid0-v1/validation.json)

<a id="stage268-legacy-battle-casting-rid0"></a>

## stage268 施法终止游标与 RID0

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原文件 | 24 个窗口、41 处操作数、21 个直接调用和 1 组含 13 个位置的交叉引用核对通过 |
| 有信号的合成回放 | 普通、空、内联列表在动作 62 时的游标为 2、1、6，221 消费位置相同。普通列表第 22 个回调完成 A 落地，第 39 个回调命中，目标 HP 70→58 |
| 无信号的合成回放 | 普通、空、内联列表分别从 1→2、2→1、5→6 校正。四条带 RID0 的无信号回放完成交接，包含一条 A、B 同槽。目标有待处理动作时，经一次有界等待清理后结束，零 HP 命中 |
| 对照与生成核心 | 三条有信号及一条无尾随的回放与修改前逐条一致。全部八条回放与生成核心输出一致。既有附带 RID 模型核对 53 个场景、13,885 帧状态、1,104 帧渲染和 30 项接口检查 |
| TCP 入口 | 四条新增及八条既有路径通过。远端槽 2 最终为 `AfterCast`、HP 41、MP 6，目标槽 10 HP 58，槽 0 保持 HP 70、MP 10。核对防御、退出、两次移动请求及同连接恢复 |
| 专项与构建 | 战斗专项 117 项通过，其中物理缺席及交接文件 62 项。Page 源码和生成版各 111 项。五套本地构建及 WXML、WXSS 编译通过 |
| 全量回归 | 234 个文件的 2,868 项通过，1,520 份测试输入在执行前后的哈希一致 |

无信号游标校正属于共享恢复策略。原版动态、反射中间队列、真实 C 到达时序、现行版、手机真机、微信运行时及官服待验收。[源核验](../analysis/game-legacy-battle-casting-rid0-v1/source-check.json) · [回放与验收明细](../analysis/game-legacy-battle-casting-rid0-v1/validation.json)

<a id="stage267-legacy-battle-rid0-flight"></a>

## stage267 多帧同槽下降与 B 槽变更

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原文件 | 14 个读取窗口、36 处操作数、16 个直接调用和 2 个既有窗口复核通过 |
| 多帧同槽 | 合成回放在第 17 个回调登记 B，第 26 个回调登记 A，第 44 个回调结束回合。修改前第 18 个回调遇到骑乘对象提前移除 |
| B 清空与替换 | 分槽 B 清空后 A 在下一回调落地，B 槽保持为空。同槽清空在第 19 个回调结束，槽位仍为空。分槽换人的最终 B 保留新身份与 HP 59、MP 3。同槽换人按原落地顺序最终登记 A |
| 独立模型 | 延续历史同槽夹具的 189 帧与 18 帧渲染，前 103 帧与历史归档一致。附带 RID 全模型核对 53 个场景、13,885 帧状态、1,104 帧渲染和 30 项接口与边界检查 |
| 跨平台与入口 | 六条合成回放在源码与微信生成版核心逐帧一致。4 条新增及 8 条既有 TCP 路径通过，覆盖桌面网页、移动视口、Page 源码及生成版的战斗退出和同连接移动恢复 |
| 专项与构建 | 103 项战斗专项通过，其中物理缺席和交接文件 61 项。五套本地构建和 WXML、WXSS 编译通过 |
| 全量回归 | 234 个文件的 2,867 项通过，1,520 份输入哈希一致。Page 源码与生成版各 111 项通过 |

B 中途清空和替换由共享回调层注入，空槽恢复属于共享实现。原版动态、真实 C 到达时序、SKL19 的尾随元组、现行版、手机真机、微信运行时及官服待验收。[源核验](../analysis/game-legacy-battle-rid0-flight-v1/source-check.json) · [回放与验收明细](../analysis/game-legacy-battle-rid0-flight-v1/validation.json)

<a id="stage266-legacy-battle-rid0-ownership"></a>

## stage266 空闲等待和移交后的回收

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原文件 | 24 个读取窗口、41 处操作数、28 个直接调用和 5 个既有窗口复核通过 |
| 游标与回合 | 3 条首配游标对照。首目标、首攻击者和异槽 A 在第 7,201 次等待检查进入归位。首目标的两个 CFP 后继只执行第一条，MP 由 10 到 8。混合用例完成已启动的 A，回收另一具空闲 A 的待交接 |
| B 登记后离场 | 第 17 个回调登记 B 并移除父身体。修改前待登记的 A 和容器留在回放池。修复后两者均释放。保留原 B 的用例在第 7,279 个回调归位，B 的 HP 35、MP 6。替换 B 的用例在第 19 个回调收尾，新 B 的 HP 59、MP 3 |
| 生成版对照 | 7 条新增路径在源码和微信生成版核心逐帧一致。配对模型核对 9,120 项队列、261 个场景和 13 个管理器案例。附带 RID 模型核对 53 个场景、13,800 个状态和 30 项接口与边界检查 |
| 本地入口 | 16 条既有 TCP 路径通过。桌面网页、移动视口、Page 源码及生成版验证名称、数值、战斗退出和同连接移动恢复 |
| 专项和构建 | 102 项战斗专项通过，其中物理缺席和交接文件 60 项。五套本地构建和 WXML、WXSS 编译通过 |
| 全量回归 | 234 个文件的 2,866 项通过，1,519 份输入哈希一致。Page 源码与生成版各 111 项通过 |

中途离场用例在共享回调层注入。真实 C 到达时序、父身体仍在时 B 先离场、原版动态、现行版、手机真机、微信运行时及官服待验收。[源核验](../analysis/game-legacy-battle-rid0-ownership-v1/source-check.json) · [回放与验收明细](../analysis/game-legacy-battle-rid0-ownership-v1/validation.json)

<a id="stage265-legacy-battle-rid0-interruption"></a>

## stage265 缺席中断与尾随 RID0

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原文件 | 25 个读取窗口、31 处操作数、20 个直接调用、3 处分派表项及原文件的计数初值复核通过 |
| 游标与计数 | 7 条独立游标对照覆盖两种缺席位置、十六进制未读字段、额外分隔符和无后继。4 条可达路径均在第 149 个回调完成。双后继只落地第一条 CFP，交接后 MP 由 8 到 6 |
| 修改前后 | 缺席攻击者回放原在第 1,800 个回调仍等待。缺席目标的两条回放原在第 5 和第 7 个回调结束且未交接。修复后各自完成 RID0 |
| 离场回收 | 原身体在第 675 个回调离场，回合仍在第 804 个回调结束。替换者 HP 51、MP 4，逐笔结算一致。专项检查一条及两条待交接记录的两具隐藏身体和容器均已释放 |
| 本地入口 | 8 条新增及 8 条既有 TCP 路径通过。桌面网页、移动视口、Page 源码及生成版验证名称、在场角色数值、退出和同连接移动恢复 |
| 测试与构建 | 234 个全量文件、2,864 项通过，1,518 份输入哈希一致。专项 100 项，其中物理缺席和交接文件 58 项。Page 源码和生成版各 111 项，五套本地构建和 WXML、WXSS 编译通过 |
| 生成版模型 | 配对模型核对 9,120 项队列、261 个场景及 13 个管理器案例。附带 RID 模型核对 53 个场景、13,800 个状态及 30 项接口与边界检查 |

原版动态对照、动作 221 写入 B 后离场、现行版交接、手机真机、微信运行时及官服待验收。[源核验](../analysis/game-legacy-battle-rid0-interruption-v1/source-check.json) · [回放与验收明细](../analysis/game-legacy-battle-rid0-interruption-v1/validation.json)

<a id="stage264-legacy-battle-rid0-receive"></a>

## stage264 尾随 RID0 的受击交接

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原文件 | 12 个读取窗口、2 组交叉引用、21 处操作数、15 个直接调用和动作 221 分派槽复核通过 |
| 回放对照 | 普通回合由第 7,507 个回调超时结束且未交接，变为第 951 个回调正常完成。治疗和反射回放原触发队列容量错误，修复后分别在第 904 和 905 个回调完成 |
| 注册覆盖 | 未起步身体被覆盖的回合由第 7,211 个回调缩短到第 705 个，逐笔 HP、MP 一致。已起步身体在第 580 个回调被覆盖，仍于第 602 个回调完成对 12 号位的命中 |
| 专项 | 17 条定向回放验证两组角色身份、先到结果、下一笔攻击、同槽及多交接、先后覆盖与离场。专项 98 项通过，其中物理缺席与交接文件 56 项 |
| 本地入口 | 12 条新增及 8 条既有 TCP 路径通过。桌面网页、移动视口、Page 源码及生成版验证数值、交接后的名称及同连接移动恢复 |
| 测试与构建 | 234 个全量文件、2,862 项通过，1,518 份输入哈希一致。Page 源码及生成版各 111 项，五套本地构建及 WXML、WXSS 编译通过 |
| 生成版模型 | 配对模型核对 9,120 项队列及 261 个场景。附带 RID 模型核对 53 个场景、13,800 个状态和 30 项接口与边界检查 |

父身体提前离场后，已准备的交接对象生命周期仍待核验。原版运行、现行版交接、手机真机、微信运行时及官服待验收。[静态证据](../analysis/game-legacy-battle-rid0-receive-v1/source-check.json) · [回放与验收明细](../analysis/game-legacy-battle-rid0-receive-v1/validation.json)

<a id="stage263-legacy-battle-following-results"></a>

## stage263 后续物理结果

| 证据层 | 实际结果 |
| --- | --- |
| REA 与原文件 | 14 个读取窗口逐字节匹配，2 组交叉引用、22 处操作数、24 个直接调用和 4 个动作分派槽复核通过 |
| 修改前后 | 10 条相同输入的本地回放从第 7,508 个回调缩短到第 860 至 898 个回调，HP 与 MP 的逐笔变化一致 |
| 专项回放 | 8 种标记组合分别验证有无内联 RID。零值、负值治疗、暴击反射、下一笔攻击、充能中离场、命中后离场及同槽替换通过 |
| 重启信号 | 原创夹具在第 700 个回调重发信号，下一回调保有元组 9 与资源 100060。后续攻击将 11 号位 HP 从 69 降到 65，回合在第 876 个回调完成 |
| 本地入口 | 12 条新增及 8 条既有 TCP 路径通过。桌面、移动视口、Page 源码和 Page 构建版均验证角色数值、首轮退出及同连接移动恢复 |
| 测试 | 全量 234 文件、2,859 项通过，1,518 份输入哈希一致。专项 95 项通过，其中物理缺席与交接文件 53 项。Page 源码和生成版回归各 111 项通过 |
| 构建 | 五套微信本地构建及 WXML、WXSS 编译通过。生成版纯字节模型检查 9,120 项队列、261 个场景和 13 个管理器案例 |

原版运行时的重启信号顺序、尾随 RID0 的后续受击、现行版交接、手机真机、微信运行时和官服待验收。[静态证据](../analysis/game-legacy-battle-following-results-v1/source-check.json) · [回放与验收明细](../analysis/game-legacy-battle-following-results-v1/validation.json)

<a id="stage262-legacy-battle-late-recipient"></a>

## stage262 后续攻击者的先到结果

- **静态**。固定 PE 匹配 13 个 REA 字节窗口、3 组交叉引用、9 个回调表项、20 处操作数和 12 处调用。另复核既有身体回调整段。导出后会话已关闭。[源核验](../analysis/game-legacy-battle-late-recipient-v1/source-check.json)
- **回放**。单发送者的旧本地探针在第 7,507 个回调经超时归位结束，两笔后续伤害未结算。当前探针第 685 个回调扣角色 2 的 HP，第 735 个回调由该角色击中角色 12，第 763 个回调消费已经收到结果的受击等待，第 898 个回调完成。双发送者探针第 923 个回调完成。[回放回执](../analysis/game-legacy-battle-late-recipient-v1/validation.json)
- **身份**。受击者或其攻击目标替换后，新身体保留初始 HP、MP。已命中的发送者离场后，原受击等待仍推进。先取得等待位置的发送者在命中前离场时，第二名发送者能继续。只有一个发送者且在命中前离场的输入仍走原超时恢复。[专项与探针](../analysis/game-legacy-battle-late-recipient-v1/validation.json)
- **入口**。8 条新增与 8 条对照本机 TCP 路径通过，覆盖桌面和移动视口 Chrome、微信 Page 源码及构建版。对端核对防御、退出和移动。Chrome 读回首轮完成，四种入口核对全部在场角色数值。[入口回执](../analysis/game-legacy-battle-late-recipient-v1/validation.json)
- **构建及回归**。五套微信构建及 WXML、WXSS 编译通过。Page 扩展套件源码和构建版各通过 111 项，战斗专项 110 项通过，其中物理边界 50 项。234 个 Node 文件共 2,856 项通过，运行前后 1,518 个输入哈希一致。生成 API 复核 9,120 组计划、261 个场景、58,154 帧和 4,812 项 RGBA。[回归回执](../analysis/game-legacy-battle-late-recipient-v1/validation.json)
- **待验证**。原版运行时序、特殊结果及附带 RID 交接、微信运行时、手机真机、现行版交接与官服。[目标核对](../analysis/game-legacy-battle-late-recipient-v1/goal-audit.json)

<a id="stage261-legacy-battle-independent-following"></a>

## stage261 未起步攻击者的提前归位

- **静态**。固定 PE 匹配 15 个 REA 字节窗口、5 组交叉引用、8 个回调表项、19 处操作数和 22 处调用。导出后分析会话已关闭。[源核验](../analysis/game-legacy-battle-independent-following-v1/source-check.json)
- **回放**。独立目标场景从第 7,210 个回调结束缩短到第 759 个，护卫等待场景从第 7,507 个缩短到第 989 个。归位分别在第 753 和 685 个回调触发。两条探针的已结算 HP、MP 逐笔一致，未起步的攻击没有扣减 HP。已有受击引用、同槽替换与普通可启动队列分别检查。[回放回执](../analysis/game-legacy-battle-independent-following-v1/validation.json)
- **入口**。8 条新增与 8 条对照本机 TCP 路径通过，覆盖桌面和移动视口 Chrome、微信 Page 源码及构建版。独立对端核对一次防御、一次退出和两次移动。护卫等待场景首次在 Page 源码测试中触及测试轮询上限，该场景扩大轮询窗口后，源码和构建版均通过。[入口回执](../analysis/game-legacy-battle-independent-following-v1/validation.json)
- **构建及回归**。五套微信构建及 WXML、WXSS 编译通过。Page 扩展套件源码和构建版各通过 111 项，战斗专项 108 项通过，其中物理边界 48 项。234 个 Node 文件共 2,854 项通过，运行前后 1,518 个输入哈希一致。生成 API 复核 9,120 组计划、261 个场景、58,154 帧和 4,812 项 RGBA。[回归回执](../analysis/game-legacy-battle-independent-following-v1/validation.json)
- **待验证**。原版运行时序、微信运行时、手机真机、现行版交接及官服。[目标核对](../analysis/game-legacy-battle-independent-following-v1/goal-audit.json)

<a id="stage260-legacy-battle-missing-lookahead"></a>

## stage260 前置 PLV 移除后续目标

- **静态**。固定 PE 匹配 12 个 REA 字节窗口，复核 4 个旧窗口、3 组交叉引用、26 处操作数和 17 条调用。导出后 REA 会话已关闭。两条合成 M 的首个扫描候选与共享客户端的已解码后继位置均已记录。[源核验](../analysis/game-legacy-battle-missing-lookahead-v1/source-check.json)
- **回合**。原探针在第 244 个回调拒绝 SKL，初步放行后仍在等待空队列。最终首段和后续护卫的目标离场探针分别在 247 和 208 个回调结束，HP 保持 70，仅 CFP 令施术者 MP 从 10 到 8。末条单独释放可执行返回队列，护卫离场和无关角色离场的对照仍能结束。[回放回执](../analysis/game-legacy-battle-missing-lookahead-v1/validation.json)
- **入口**。8 条新增与 8 条对照本机 TCP 路径通过，覆盖桌面与移动视口 Chrome、微信 Page 源码与构建版。Chrome 读回首轮完成，四种入口核对完整在场角色数值。对端核对一次防御、一次退场和两次移动。[入口回执](../analysis/game-legacy-battle-missing-lookahead-v1/validation.json)
- **构建及回归**。五套微信构建及 WXML、WXSS 编译通过。Page 扩展套件源码和构建版各通过 111 项，战斗专项 105 项通过，其中物理中断及边界套件 45 项。234 个 Node 文件共 2,851 项通过，运行前后 1,518 个输入哈希一致。生成 API 复核 9,120 组计划、261 个场景、58,154 帧和 4,812 项 RGBA。[回归回执](../analysis/game-legacy-battle-missing-lookahead-v1/validation.json)
- **待验证**。原版运行、微信运行时、手机真机、现行版交接及官服。[目标核对](../analysis/game-legacy-battle-missing-lookahead-v1/goal-audit.json)

<a id="stage259-legacy-battle-following-strikes"></a>

## stage259 多击等待、结算与离场验收

- **静态**。33 个 REA 字节窗口逐字节匹配固定 PE，核对 3 组交叉引用、12 个回调表项、39 处操作数与 26 条调用。证据导出后分析会话已关闭。[源核验](../analysis/game-legacy-battle-following-strikes-v1/source-check.json)
- **回合**。护卫在两次后续攻击前离场的探针从第 1,050 个回调仍忙变为第 163 个回调完成。第一击命中后或第二次蓄力时离场，均在第 688 个回调完成，第一位受击者保留 HP 69。两名护卫攻击同一目标的探针在第 730 个回调结束，两击分别在 543 和 652 结算，目标 HP 从 70 降到 69、67。[回放回执](../analysis/game-legacy-battle-following-strikes-v1/validation.json)
- **角色替换**。第一位目标蓄力时被替换，旧特效退出，下一击用独立子对象完成。替换身体保留 HP 51、MP 4。受击者兼任后续攻击者时，仍在场的攻击可结算，离场角色未执行的攻击段会释放。[专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)
- **入口**。8 条新增本机 TCP 路径与 9 条旧入口复测通过。Chrome 读回首轮完成，Page 核对 HP、MP，独立对端核对一次防御、一次退场与两次移动。[入口回执](../analysis/game-legacy-battle-following-strikes-v1/validation.json)
- **构建及回归**。五套微信构建及 WXML、WXSS 编译通过。Page 扩展套件源码和构建版各通过 111 项，战斗专项 130 项通过，其中物理边界 42 项。234 个 Node 文件共 2,848 项通过，运行前后 1,518 个输入哈希一致。生成 API 复核 9,120 组计划、261 个场景、58,154 帧和 4,812 项 RGBA。[回归回执](../analysis/game-legacy-battle-following-strikes-v1/validation.json)
- **待验证**。执行中的离场由本地角色容器探针验证。真实 M 中的前置 `PLV` 移除后续目标后，在第 244 个回调出现 `physical-family-lookahead-context`。独立后续攻击者仍可能停在 0。原版动态、真机、微信运行时、现行版交接及官服待验收。[已知问题](known-issues.md#stage259-legacy-battle-following-strikes)

[范围审计](../analysis/game-legacy-battle-following-strikes-v1/checkpoint-audit.json)

<a id="stage258-legacy-battle-repeated-protection"></a>

## stage258 重复保护、转向和离场验收

- **静态**。24 个 REA 读窗逐字节匹配固定 PE，核对 3 组交叉引用、15 个回调表项、34 处操作数和 30 条调用。证据导出后分析会话已关闭。[源核验](../analysis/game-legacy-battle-repeated-protection-v1/source-check.json)
- **回合**。同一护卫和两名护卫重复保护同一身体，修复前到第 900 个回调仍等待，修复后分别在第 538、530 个回调结束。受保护身体先经 11 归位，再从内层 0 进入第二次反应。外层为零且带后续攻击的探针在第 704 个回调结束，护卫和后续目标的 HP 依次结算为 63 和 69。[回放回执](../analysis/game-legacy-battle-repeated-protection-v1/validation.json)
- **离场**。单条后续攻击覆盖护卫在蓄力前或蓄力中离场，以及目标在转向、蓄力和命中前离场。替换身体保持 HP 51、MP 4 与初始动作游标，已结算的嵌套伤害保留。两条后续攻击的正常对照在第 756 个回调结束，护卫提前离场的变体在第 900 个回调仍等待。[探针回执](../analysis/game-legacy-battle-repeated-protection-v1/validation.json)
- **入口**。12 条新增本机 TCP 路径及 8 条旧入口回归通过。Chrome 读取首轮完成，Page 核对各角色 HP 和 MP，独立对端核对一次防御、一次退场与两次移动。[入口回执](../analysis/game-legacy-battle-repeated-protection-v1/validation.json)
- **构建及回归**。五套微信构建及 WXML、WXSS 编译通过。Page 扩展套件源码和构建版各通过 111 项。战斗专项 126 项通过，其中物理边界 38 项。234 个 Node 文件共 2,844 项通过，前后 1,518 个输入哈希一致。生成 API 复核 9,120 组计划、261 个场景、58,154 帧和 4,812 项 RGBA。[回归回执](../analysis/game-legacy-battle-repeated-protection-v1/validation.json)
- **待验证**。多条后续攻击的退场、特殊结果标记、原版动态、真机、微信运行时、现行版交接与官服。[已知问题](known-issues.md#stage258-legacy-battle-repeated-protection)

[范围审计](../analysis/game-legacy-battle-repeated-protection-v1/checkpoint-audit.json)

<a id="stage257-legacy-battle-guard-wait"></a>

## stage257 护卫返回和共享护卫验收

- **静态**。23 个 REA 字节窗口逐字节匹配固定 PE，核对 3 组交叉引用、12 个动作表项、30 处操作数及 21 条调用。证据导出后关闭分析会话。[源核验](../analysis/game-legacy-battle-guard-wait-v1/source-check.json)
- **回合**。槽 1 正数外层护卫曾在第 650 个回调仍忙。修复后 SKL113 在第 374 个回调自然结束，SKL72 在第 371 个回调结束。SKL72 两人共用护卫的正数、外层零、内层零探针分别在第 528、598、478 个回调结束。内层有伤害时护卫 HP 由 70 降至 63 一次。受影响槽位的新身体保留 HP 51、MP 4 和初始动作游标。[回放回执](../analysis/game-legacy-battle-guard-wait-v1/validation.json)
- **入口**。桌面与移动视口 Chrome、微信 Page 源码和构建版通过八条新增本机 TCP 路径，另有九条既有 SKL113 入口复测。Chrome 读取首轮完成，Page 核对 HP 和 MP，独立对端验证一次防御、一次退场及两条移动请求。[入口回执](../analysis/game-legacy-battle-guard-wait-v1/validation.json)
- **构建及回归**。五套微信构建与 WXML、WXSS 编译通过。Page 扩展套件源码和构建版各通过 111 项。战斗专项 122 项通过，其中物理边界 34 项。234 个 Node 文件共 2,840 项通过，前后 1,518 个输入哈希一致。生成 API 另复核 9,120 组计划、261 个场景、58,154 帧和 4,812 项 RGBA。[回归回执](../analysis/game-legacy-battle-guard-wait-v1/validation.json)
- **待验证**。同一受保护角色被重复保护的探针仍在第 650 个回调等待。原版动态顺序、手机真机、微信运行时、现行版交接与官服仍待验收。[已知问题](known-issues.md#stage257-legacy-battle-guard-wait)

[范围审计](../analysis/game-legacy-battle-guard-wait-v1/checkpoint-audit.json)

<a id="stage256-legacy-battle-skl113-wire"></a>

## stage256 SKL113 的两套游标验收

- **静态**。49 个 REA 字节窗口、6 组交叉引用、4 个表项、45 处操作数、16 条分支及 25 条调用与固定 PE 一致。独立有限读法核对 8 个字节视图和 3 个预约拒绝样本。[源证据](../analysis/game-legacy-battle-skl113-wire-v1/source-check.json)
- **回合**。早结束样本从字节 32 执行收尾，管理器按字节 35 保留后续位置。独立 CFP 使用新命令对象，嵌套目标 HP 63、MP 8。带分隔字节的同组 CFP 使用原对象，嵌套目标 HP 63、施法者 MP 5。共用结束位置的场景保留 −1 的嵌套数量，目标 HP 71，后续配对的护卫 HP 63。
- **专项**。118 项战斗组合测试通过，其中缺席与物理边界专项 30 项。新增四项验证双游标、拒绝时的队列与回放、带分隔字节的同组续接，以及共有终止位置的后续配对。[专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)
- **模型**。最终生成 API 在隔离的 JavaScript 环境复核 9,120 组嵌套计划、261 个场景、58,154 帧与 4,812 项 RGBA。正数外层护卫在槽 1 的探针于第 7,204 个回调触发等待恢复，第 7,249 个回调完成回合。外层结果为零或护卫位于槽 12 的对照自然收尾。
- **入口**。桌面与移动视口 Chrome、微信 Page 源码和构建版通过 12 条 SKL113 本机 TCP 路径。另有 6 条 SKL72、SKL266 入口回归。独立对端核对一次防御、一次退场及两条移动请求。
- **构建**。五套微信构建与 WXML、WXSS 编译通过，Page 扩展套件源码与构建版各通过 111 项。
- **回归**。最终的 234 个 Node 文件共 2,836 项通过，1,518 个输入哈希在运行前后相同。较早一轮运行期间加入了同组扫描修正，验收采用重新运行的最终回执。
- **待验证**。正数外层护卫的自然放行、原版动态、真实手机与微信运行时、现行版交接和官服。

[阶段回执](../analysis/game-legacy-battle-skl113-wire-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-skl113-wire-v1/checkpoint-audit.json)

<a id="stage255-legacy-battle-guard-alias"></a>

## stage255 同槽护卫和启动前退场验收

- **静态**。20 个 REA 字节窗口、3 组交叉引用、10 个动作回调、38 处操作数、11 条分支及 26 条调用与固定 PE 核对。[源证据](../analysis/game-legacy-battle-guard-alias-v1/source-check.json)
- **退场**。在施法者动作 147 或 71 时移除未启动的护卫，两个探针均在第 188 个回调完成。复用原槽的新角色保留初始队列、HP 51 与 MP 4。保护目标带真实 PLV 前置队列的探针在第 210 个回调完成，原角色按原 PLV 退场。
- **专项**。114 项战斗组合测试通过，其中缺席与自身结果专项 26 项。新增三项检查已提交元组、PLV 前置段、同槽有无飞行目标和近距离 216。22 项自身结果本机 TCP 通过，其中两个独立护卫回合保持原 HP 和游标结果。[专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)
- **模型**。2,880 组计划、175 个场景。原期望逐项比较 20,989 帧和 2,892 项 RGBA。同槽以独立的普通自身参考比较返还前 105 帧和 16 项 RGBA。77 个护卫飞行分叉核对 18,525 个回调，78 个近距离返还场景在分叉后核对 3,750 个回调中的游标和结果。无护卫探针在第 107 个回调进入 216，较旧实现提前 18 个回调。上一阶段与本阶段生成 API 分别核对各自参考，13 个命令管理器场景的超时恢复从 1 个降到 0 个。
- **入口**。桌面和移动视口 Chrome、微信 Page 源码及构建版通过 8 条新增本机 TCP 路径。另通过 6 条旧护卫入口回归。两个同槽场景的施法者均为 HP 77、MP 5，外部角色在有命中时为 HP 63、无命中时为 HP 70。Web 读取首轮完成，独立对端核对一次防御、一次退场及两次移动。
- **构建**。五套微信构建与 WXML、WXSS 编译通过，Page 扩展套件源码与构建版各通过 111 项。
- **回归**。234 个 Node 测试文件共 2,832 项通过，1,518 个输入在运行前后的哈希一致。
- **待验证**。原版同槽动态结果、SKL113 嵌套预读、真实手机与微信运行时、现行版交接和官服。

[阶段回执](../analysis/game-legacy-battle-guard-alias-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-guard-alias-v1/checkpoint-audit.json)

<a id="stage254-legacy-battle-guard-departure"></a>

## stage254 护卫退场与第二趟飞行验收

- **静态**。22 个 REA 字节窗口、2 组交叉引用、12 个动作回调、35 处操作数、13 条分支、26 条调用与 4 个浮点常量和固定 PE 一致。[源证据](../analysis/game-legacy-battle-guard-departure-v1/source-check.json)
- **退场**。旧探针在第 550 个回调仍等待。同槽替换时，旧命中使新角色 HP 从 51 降至 44。修复后，分别在护卫动作 4 与 10 移除护卫，回合于第 227 与 269 个回调完成，新角色 HP 为 51。另核对 SKL266 第二趟飞行时移除并替换护卫，外部命中和后续指令保留。
- **专项**。111 项组合测试及其中的 23 项缺席专项通过。新增三项测试覆盖两次护卫移除时点、同一个飞行物经过 217 并返程、第二趟飞行中护卫替换。[专项](../shared/tests/legacy-game-battle-physical-missing.test.mjs)
- **模型**。2,880 组计划与 175 个场景经过核对。当前实现与既有方程吻合的 29,343 帧和 3,366 项图像继续逐项比较。77 个护卫用例在分叉后验证 18,525 个回调中的对象身份、游标及实际 HP。首轮快照漏读同一回调中完成的 216，改用动作和元组推进判定后通过。上一阶段生成包另通过原有 98,543 帧和 6,294 项图像比对。
- **入口**。桌面与移动视口 Chrome、微信 Page 源码及构建版通过 8 条新增本机 TCP 路径。另有 6 条上阶段入口回归。两个原需等待恢复的本机技能对端场景均自然结束，护卫 HP 分别为 58 和 82。
- **构建**。五套微信构建与 WXML、WXSS 编译通过。Page 扩展套件源码与构建版各通过 111 项。
- **回归**。234 个 Node 测试文件共 2,829 项通过，前后 1,518 个输入哈希一致。
- **待验证**。施法者兼任护卫仍进入等待。继续核对护卫启动前退场、普通返程的近距离 216 时序、原版第二趟飞行画面、SKL113 预读、微信运行时与真机、现行版交接和官服。

[阶段回执](../analysis/game-legacy-battle-guard-departure-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-guard-departure-v1/checkpoint-audit.json)

<a id="stage253-legacy-battle-guard-release"></a>

## stage253 护卫放行与自身护卫验收

- **静态**。32 个 REA 字节窗口、4 组交叉引用、11 个动作回调、42 处操作数、12 条分支及 32 条调用与固定 PE 核对一致。另核对三方动作序列和自身 RID 的 21 处压栈指令。[源证据](../analysis/game-legacy-battle-guard-release-v1/source-check.json)
- **回放**。初始 PLV 与无飞行自身护卫各在第 550 个回调仍待放行。改动后，原目标在第 187 个回调退场，回合在第 355 个回调完成，护卫 HP 63。自身护卫于第 180 个回调完成回合，动作 216 将护卫 HP 从 70 改为 77。三方都在场的对照在第 340 个回调完成。两个新场景的后续耗魔均使施法者 MP 降至 5。
- **专项**。108 项战斗组合测试通过，其中缺席与自身结果的专项 20 项。扩充真实 PLV 用例至自然收尾，新增护卫开始后的同槽替换及独立护卫动作 216 两项。替换角色的动作队列、位置及数值逐帧核对。[专项](../shared/tests/legacy-game-battle-physical-missing.test.mjs)
- **入口**。桌面与移动视口 Chrome、微信 Page 源码及构建版共通过 8 条新增本机 TCP 路径。Chrome 核对首轮完成，独立对端核对一次防御、一次退出、两条移动请求和连接关闭。缺席嵌套目标与无护卫自身结果另通过 6 条入口回归。
- **构建及回归**。五套微信构建与 WXML、WXSS 编译通过，Page 扩展套件源码和构建版各通过 111 项。234 个 Node 文件共 2,826 项通过，前后 1,518 个输入哈希一致。
- **待验证**。直接移除护卫本体的探针在第 550 个回调仍等待。另跟踪有飞行物的护卫尾部、同槽护卫、SKL113 嵌套预读、无外部 RID 时原版栈内容、微信运行时与真机、现行版交接和官服。

[阶段回执](../analysis/game-legacy-battle-guard-release-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-guard-release-v1/checkpoint-audit.json)

<a id="stage252-legacy-battle-physical-boundaries"></a>

## stage252 嵌套目标与自身结果验收

- **静态**。41 个 REA 字节窗口、3 组交叉引用、11 个动作回调、53 处操作数、19 条分支和 32 条调用与固定旧版 PE 核对一致。[源证据](../analysis/game-legacy-battle-physical-boundaries-v1/source-check.json)
- **专项**。106 项战斗组合测试通过，其中 18 项核对缺席与自身结果，本阶段新增 5 项。通过命令所有者移除即将进入动作 232 的目标，核对只消费当前元组、保留已扣 MP，并继续同组命令。另用真实 PLV 记录核对护卫离开动作 4，经 42、71 到达 10。首次退场夹具先命中后退场，已分开验证两个时序。无飞行目标的计划覆盖 27 类的三个正变体，SKL266 变体 2 在实际回合结算最后一条自身结果。[专项](../shared/tests/legacy-game-battle-physical-missing.test.mjs)
- **入口**。两种新场景在桌面与移动视口 Chrome、微信 Page 源码及构建版通过 8 条本机 TCP 路径。嵌套目标缺席后的接续施法使 MP 降至 8。SKL266 三个正变体执行后，本方 HP 为 77、MP 为 5，两种场景的敌方 HP 均保持 70。独立对端核对防御、退出、两条移动请求与连接关闭。C 换表及 PLV 后的已支持续接另通过 6 条入口回归。
- **构建**。五套微信构建与 WXML、WXSS 编译通过。Page 源码和构建版各通过 111 项。
- **拒绝断言**。首次组合回归的四处旧断言仍要求拒绝只有自身结果的技能，已按当前支持边界调整。上一阶段与本阶段的生成 API 分别通过四组对应断言。另测的 stage207 至 209 归档包有四处拒绝原因不符。stage208、209 用与改前哈希一致的助手在内存中复跑，均复现差异。[生成包对照](../build/analysis/game-legacy-battle-physical-boundaries-v1/paired-atomic.log) · [早期归档诊断](../build/analysis/game-legacy-battle-physical-boundaries-v1/archival-atomic.log)
- **回归**。首次完整回归在发现旧断言后终止。修正后重跑 234 个 Node 测试文件，2,824 项全部通过，前后 1,518 个输入哈希一致。
- **待验证**。护卫自然收尾、SKL113 嵌套预读、只有自身 RID 时的临时字段来源、原版空槽和终止索引的运行结果、微信运行时及真机、现行版交接与官服。

[阶段回执](../analysis/game-legacy-battle-physical-boundaries-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-physical-boundaries-v1/checkpoint-audit.json)

<a id="stage251-legacy-battle-physical-registry"></a>

## stage251 物理技能角色槽验收

- **静态**。32 个 REA 字节窗口、4 组交叉引用、33 条调用、58 处操作数和 22 条分支与固定 PE 核对一致。27 类正变体由分发表及执行入口复核。[源证据](../analysis/game-legacy-battle-physical-registry-v1/source-check.json)
- **专项**。91 项战斗测试通过。新增 4 项覆盖实际护卫的四个读取点、27 类的 81 种正变体组合、SKL266 最终自身结果及 PLV 后的同组续接。扩充附带 RID0 验收。首次专项补齐自身结果的槽字段并修正 MP 断言下标后复跑通过。[专项](../shared/tests/legacy-game-battle-physical-missing.test.mjs)
- **入口**。C 换表与 PLV 退场通过桌面与移动视口 Chrome、微信 Page 源码及构建版共 8 条本机 TCP 路径。目标 HP 保持 70，后续施法耗魔后 MP 为 8。独立对端核对各回合的防御、退出、两条移动请求及关闭。已有换位和正变体缺席目标另通过 6 条 TCP 回归。
- **构建**。五套微信构建和 WXML、WXSS 编译通过。Page 扩展套件源码版和构建版各通过 111 项。
- **回归**。234 个 Node 测试文件共 2,819 项通过，前后 1,514 个输入哈希一致。
- **待验证**。原版空槽解引用后的运行结果、嵌套目标与仅自身结果、微信运行时与真机、现行版交接及官服。

[阶段回执](../analysis/game-legacy-battle-physical-registry-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-physical-registry-v1/checkpoint-audit.json)

<a id="stage250-legacy-battle-assist-terminator"></a>

## stage250 协作者 FF 验收

- **静态**。23 个 REA 字节窗口、2 组交叉引用、22 条调用、55 处操作数、16 条分支与固定 PE 核对一致，另有 4 条原创游标投影。[源证据](../analysis/game-legacy-battle-assist-terminator-v1/source-check.json)
- **专项**。81 项战斗测试通过。新增 5 项覆盖两种单条回合、同组续接、独立 RID0、有效协作者的空目标边界及状态 32 伙伴换位后缺席。[回合测试](../shared/tests/legacy-game-battle-missing.test.mjs) · [换位测试](../shared/tests/legacy-game-battle-status-position.test.mjs)
- **入口**。两种 FF 场景通过桌面与移动视口 Chrome、微信 Page 源码与构建版共 8 条本机 TCP 路径。后续施法使 MP 从 10 降到 8，目标 HP 保持 70。独立对端核对防御、退出、两条移动请求及关闭。已有协作者命中、回复与缺席换位另通过 9 条 TCP 回归。
- **构建**。五套微信构建和 WXML、WXSS 编译通过。Page 源码和构建版各通过 29 项。
- **回归**。234 个 Node 测试文件共 2,815 项通过，前后 1,514 个输入哈希一致。
- **待验证**。原版 FF 后续运行游标、变体 12 空目标动作 84、微信运行时与真机、现行版交接及官服。

[阶段回执](../analysis/game-legacy-battle-assist-terminator-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-assist-terminator-v1/checkpoint-audit.json)

<a id="stage249-legacy-battle-physical-missing"></a>

## stage249 物理技能中断验收

- **静态**。26 个 REA 字节窗口、3 组交叉引用、7 条缺席路由、34 条调用、66 处操作数和 25 条分支与固定 PE 核对一致。[源证据](../analysis/game-legacy-battle-physical-missing-v1/source-check.json)
- **专项**。72 项战斗测试通过。新增 9 项覆盖 29 类首攻击者和首目标、后续配对、SKL260 链、SKL262 清理后等级检查、正变体及 SKL266 自身结果。同组续接、归位回放、实际回复和附带 RID0 中断均有断言。首次专项的 SKL72 夹具字段和回复动作断言已按源修正，复跑通过。[专项](../shared/tests/legacy-game-battle-physical-missing.test.mjs)
- **入口**。五种场景在桌面与移动视口 Chrome、微信 Page 源码及构建版共通过 20 条本机 TCP 路径。后续施法将 MP 从 10 降到 8，目标 HP 保持 70。对端核对防御、退出、两条移动请求及关闭。另有 6 条 SKL98 换位及数值技缺席入口回归。
- **构建**。五套微信构建和 WXML、WXSS 编译通过。Page 源码和构建版各通过 29 项。
- **回归**。234 个 Node 测试文件共 2,810 项通过，前后 1,514 个输入哈希一致。
- **待验证**。空护卫、正变体空施法者、更多护卫运行组合、原版异常游标、微信运行时与真机、现行版交接及官服。

[阶段回执](../analysis/game-legacy-battle-physical-missing-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-physical-missing-v1/checkpoint-audit.json)

<a id="stage248-legacy-battle-family-missing"></a>

## stage248 技能族缺席恢复验收

- **静态**。22 个 REA 字节窗口、9 条缺席路由、27 条尾部调用、43 处操作数和 20 条分支与固定 PE 核对一致。[源证据](../analysis/game-legacy-battle-family-missing-v1/source-check.json)
- **专项**。114 项战斗测试通过。新增 7 项覆盖 54 类缺席施法者、49 类缺席目标、带符号反射与零和、SKL31 反馈槽、同组续接、附带 RID0 和死亡角色保留队列的容量预检。[专项](../shared/tests/legacy-game-battle-family-missing.test.mjs)
- **入口**。四个技能族通过桌面与移动视口 Chrome、微信 Page 源码和构建版共 16 条本机 TCP 路径。后续施法使 MP 从 10 降到 8，目标 HP 保持 70。独立对端核对防御、退出、两条移动请求及关闭。SKL98 缺席目标和部分换位另通过 6 条入口回归。
- **构建**。五套微信构建与 WXML、WXSS 编译通过。Page 源码和构建版各通过 29 项。
- **回归**。233 个 Node 测试文件共 2,801 项通过，前后 1,513 个输入哈希一致。
- **待验证**。物理技能中断、原版异常游标续接、更多反射资源回放、微信运行时及真机、现行版交接和官服。

[阶段回执](../analysis/game-legacy-battle-family-missing-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-family-missing-v1/checkpoint-audit.json)

<a id="stage247-legacy-battle-missing"></a>

## stage247 SKL98 缺席恢复验收

- **静态**。20 个 REA 窗口、8 个 SKL98 清理路由、21 条函数调用和 52 处操作数与固定 PE 核对一致。[源证据](../analysis/game-legacy-battle-missing-v1/source-check.json)
- **专项**。132 项战斗测试通过。新增 5 项覆盖 15 个变体的首目标缺席、同组续接与附带 RID0、中途换位、缺席施法者及协作者和第 7,201 次等待恢复。首轮发现终止元组会遮住同组后续元组，改为让同组后续从重置后的队列开始。[专项](../shared/tests/legacy-game-battle-missing.test.mjs)
- **入口**。两种缺席场景在桌面及移动视口 Chrome、微信 Page 源码及构建版共通过 8 条本机 TCP 路径。两种后续施法均将 MP 从 10 降到 8。换位中断场景的本方槽为 5。独立对端核对防御、退出、移动和连接关闭。既有协作者命中及回复另通过 6 条入口回归。
- **构建**。五套微信构建与 WXML、WXSS 编译通过。Page 源码和构建版各通过 29 项。
- **回归**。232 个 Node 测试文件共 2,794 项通过，前后 1,512 个输入哈希一致。
- **待验证**。原版异常游标续接、其他技能族和附带 RID 组合、微信运行时和真机、现行版交接与官服。

[阶段回执](../analysis/game-legacy-battle-missing-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-missing-v1/checkpoint-audit.json)

<a id="stage246-legacy-battle-status-assist"></a>

## stage246 SKL98 协作者验收

- **静态**。32 个 REA 窗口、39 处额外槽引用、45 条调用、46 处操作数和 16 项动作映射与固定 PE 核对一致。[源证据](../analysis/game-legacy-battle-status-assist-v1/source-check.json)
- **专项**。109 项战斗测试通过。新增 8 项覆盖十个等级、别名槽、资源元组、目标回复上限、同槽协作者、空记录、动作 244 和提交前的容量及角色校验。[专项](../shared/tests/legacy-game-battle-status-assist.test.mjs)
- **入口**。变体 12、13 各通过桌面及移动视口 Chrome、微信 Page 源码及构建版，共 8 条本机 TCP 路径。目标 HP 从 70 分别到 58 和 82，施法者 MP 从 10 到 7，协作者离场。独立对端核验防御、退出和两条移动请求。上一阶段的换位通过 3 条入口回归。
- **构建**。五套微信构建与 WXML、WXSS 编译通过。Page 源码及构建版各通过 29 项。
- **回归**。231 个 Node 测试文件共 2,789 项通过，前后 1,511 个输入哈希一致。
- **待验证**。缺席目标清理、其他附带 RID 组合、原版绘制与音效、微信运行时及真机、现行版交接和官服。

[阶段回执](../analysis/game-legacy-battle-status-assist-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-status-assist-v1/checkpoint-audit.json)

<a id="stage245-legacy-battle-status-position"></a>

## stage245 SKL98 配对换位验收

- **静态**。18 个 REA 窗口、20 条调用、41 处操作数和 22 项阵位与固定 PE 核对一致。[源证据](../analysis/game-legacy-battle-status-position-v1/source-check.json)
- **专项**。四组战斗测试共 85 项通过。新增七项覆盖十个技能等级、槽别名、角色与附属对象身份、状态 32、重复换位空槽、施法者附带 RID0，以及目标缺席和队列超限时保留原状态。[专项](../shared/tests/legacy-game-battle-status-position.test.mjs)
- **入口**。桌面及移动视口 Chrome、微信 Page 源码及构建版共四条本机 TCP 路径通过。本方槽先从 0 到 5，后续仅发送 C、A、M，无新 P，本方回到 0，MP 从 7 降到 6。独立对端逐条核对两次防御、一次退出、两条移动请求和连接关闭。两条 Page 测试首轮在退场后读取了已清空的页面状态，改为退场前保存读数后通过。变体 6、8 另通过六条入口回归。
- **构建**。五套微信构建和 WXML、WXSS 编译通过。Page 源码及构建版各 29 项通过。
- **回归**。230 个 Node 测试文件共 2,781 项通过，前后 1,510 个输入哈希一致。
- **待验证**。变体 12、13，缺席目标的原版清理，其他附带 RID 组合、原版绘制及声音、微信运行时和真机、现行版交接与官服。

[阶段回执](../analysis/game-legacy-battle-status-position-v1/validation.json) · [范围审计](../analysis/game-legacy-battle-status-position-v1/checkpoint-audit.json)

<a id="stage244-legacy-battle-status-slots"></a>

## stage244 SKL98 目标槽分支验收

- **静态**。28 个 REA 窗口、五处分支、33 条调用、31 处操作数和九项动作映射均已核对原 PE。[源证据](../analysis/game-legacy-battle-status-slots-v1/source-check.json)
- **专项**。三组状态技能测试共 30 项通过。新增用例覆盖 20 种等级与变体组合、别名槽、61 次单精度放大、双音效与提示、已死亡目标重置、本方配对缓存和两种施法者附带 RID0。首轮测试将两个目标的退场音效先后写反，已按配对槽先执行 218 的回调顺序修正。
- **入口**。变体 6、8 分别通过桌面和移动视口 Chrome、微信 Page 源码与构建版，共八条本机 TCP 路径。独立对端核对防御、退出和两条移动请求。Chrome 读回回合完成，Page 在实际绘制结果后继续退场。既有击倒与复活另通过六条入口回归。
- **构建**。五套微信构建、WXML 和 WXSS 编译通过，Page 源码和构建版各 29 项通过。
- **回归**。229 个 Node 测试文件共 2,774 项通过，前后 1,509 个输入哈希一致。
- **待验证**。变体 7、12、13，其他附带 RID 组合、缺席目标、原版资源输出、真机、现行版交接和官服。

[阶段回执](../analysis/game-legacy-battle-status-slots-v1/validation.json)

<a id="stage243-legacy-game-stream"></a>

## stage243 持续游戏连接验收

- **静态**。14 个 REA 读取窗口与固定旧版 PE 相符，另核对 22 处操作数、12 条调用和两段函数。确认最后发送计时、严格阈值和含一个字节串的消息格式。[源证据](../analysis/game-legacy-game-stream-v1/source-check.json)
- **专项**。95 项通过，覆盖严格 30 秒阈值、时钟回绕、接收流量、在途写、退场、授权、建立时限、队列上限和 EOF。单条桥接完成 8,200 次写入，双向各通过 5,248,000 字节，另验证 EOF 前的末尾数据。
- **入口**。正常 CLI 的桌面及移动视口 Chrome、微信 Page 的源码与构建版各通过一条本机 TCP 路径。独立 Python 对端在每条连接上逐字节核验两次 `3$} nr `，随后核验两条移动请求、场景重载和客户端断开。每条连接的两次间隔合计超过 60 秒。
- **构建**。五套微信构建和 WXML、WXSS 编译通过。Page 源码和构建版各 29 项通过。
- **回归**。首轮保活默认启用时，加速时钟让固定脚本收到额外的空闲记录。改由正常入口显式启用后，两条曾失败的回放复测通过。228 个 Node 测试文件共 2,768 项通过，前后 1,507 个输入哈希一致。
- **待验证**。浏览器后台计时、真实设备网络与微信模拟器、现行启动交接和官服。

[阶段回执](../analysis/game-legacy-game-stream-v1/validation.json)

<a id="stage242-legacy-battle-status-variant"></a>

## stage242 SKL98 共用目标记录验收

- **静态**。31 个 REA 窗口、54 条调用和 4 个函数完成证据核对。确认共用记录、动作 37、状态选择、当前 HP 清零和回合释放。[源证据](../analysis/game-legacy-battle-status-variant-v1/source-check.json)
- **专项**。16 项通过，含 100 组变体与等级组合、六种状态、普通和特殊槽清除、HP 清零、复活与自己重置，以及同轮 CFP。原状态技能和 PSN 35 项通过。SKL86 的独立轨迹重算和本机 TCP 流程均通过。
- **入口**。击倒和复活分别通过桌面与移动尺寸 Chrome、微信 Page 源码和构建版，共八条本机 TCP 路径。独立对端逐字节验证防御、战斗退出和恢复移动。网页重跑使用现有 45 秒桥接时限。
- **构建与回归**。五套微信构建和 WXML、WXSS 编译通过，Page 源码和构建版各通过 25 项，另重跑四条 SKL93 入口。228 个 Node 测试文件共 2,762 项通过，前后 1,507 个输入哈希一致。
- **待验证**。独立变体及附带 RID、原版素材和音效输出、持续游戏会话、微信真机、现行交接与官服。

[阶段回执](../analysis/game-legacy-battle-status-variant-v1/validation.json)

<a id="stage241-legacy-battle-summon"></a>

## stage241 SKL93 角色入场验收

- **静态**。24 个 REA 读取窗口和 39 条调用通过原 PE 核验，确认字段、分派、入场信号和等待释放。[源证据](../analysis/game-legacy-battle-summon-v1/source-check.json)
- **专项**。5 项通过，覆盖占槽和重复槽位、信号前后的入场顺序、MP 和后续 CFP、特殊槽映射及异常记录。
- **入口**。桌面与移动尺寸 Chrome、微信 Page 源码和构建版各通过一条本机 TCP 路径。独立对端验证防御、战斗退出和地图移动。两种宿主均读取了新角色的名称与数值。
- **构建与回归**。五套微信本机构建和 WXML、WXSS 编译通过。Page 源码与构建版各通过 25 项，另有三条战斗回城入口通过。227 个 Node 测试文件共 2,746 项通过，前后 1,502 个输入哈希一致。
- **待验证**。备用渲染、原版运行和素材、微信模拟器及真机、现行版交接及官服。

[阶段运行回执](../analysis/game-legacy-battle-summon-v1/validation.json)

<a id="stage240-legacy-battle-city-return"></a>

## stage240 战斗内回城验收

- **静态**。固定旧版 PE 与 28 个 REA 读取窗口一致，核对 21 条调用与 12 个函数。确认子状态 7 到 8 的衔接、type14 完成后的回包及 `TfD` 的主状态检查。[源证据](../analysis/game-legacy-battle-city-return-v1/source-check.json)
- **专项**。14 项通过，覆盖末帧未提交时收到 `>HY`、已清空画面的 type14、回城后新战斗世代，以及原有的 type15 和会话清理。
- **入口**。桌面和移动尺寸 Chrome、微信 Page 源码适配器及本轮构建版共通过十二条本机 TCP 路径。两个角色体进入战斗后分别测试提前换图、提前 `>HY`、退场后 `>HY` 再换图。独立对端核对一次 `4}o`、对应次数的 `$!~ 0` 和回城后的移动命令。每条路径沿用原连接，验证了回城音效、战斗音乐渐隐及地图音乐恢复。
- **构建和回归**。五种微信本机构建及 WXML、WXSS 编译通过，Page 源码适配器和构建版各通过 25 项。普通地图回城、主动回选服、服务端退场及战斗音乐另重跑 26 条入口路径。226 个 Node 测试文件共 2,741 项通过，运行前后 1,500 个输入哈希一致。[运行回执](../analysis/game-legacy-battle-city-return-v1/validation.json)

微信 Page 首轮入口夹具卡在 ZIP 打包的标准输入。核对进程采样后改用临时文件传递并设定超时，重跑通过。微信模拟器、真机、现行版交接和官服待验收。

<a id="stage239-legacy-city-return"></a>

## stage239 普通地图注销回城验收

- **静态**。固定旧版 PE 与 46 个 REA 读取窗口一致，另核对 21 条直接调用及 22 份函数观察。主状态 9 的直接换图与提前重建分别有独立跳表和捕获点。[源证据](../analysis/game-legacy-city-return-v1/source-check.json)
- **专项**。12 项通过，包含 49 帧 type15 的行坐标与像素哈希、同一会话连续回城、回包写入延迟、旧画面作业取消及服务端退场接管。
- **入口**。桌面和移动尺寸 Chrome、微信 Page 源码适配器和本轮构建版共通过八条本机 TCP 路径。换图时对端更换地图标识并延迟发送地图块，页面在图块就绪前保持等待。提前重建路径核对 `$!~ 0` 和 `,ua 0`。两条路径均在同一 TCP 连接上恢复移动，并播放一次回城音效。
- **构建和回归**。五种微信本机构建及 WXML、WXSS 编译通过，Page 源码适配器和构建版各通过 25 项。另重跑主动回选服、服务端退场及战斗音乐的 18 条入口路径。226 个 Node 测试文件共 2,739 项通过，运行前后 1,499 个输入哈希一致。[运行回执](../analysis/game-legacy-city-return-v1/validation.json)

战斗内主动回城、微信模拟器和真机、现行版交接及官服待验收。

<a id="stage238-legacy-battle-alternate-exit"></a>

## stage238 主动返回选服验收

- **静态**。固定旧版 PE 与 REA 的 38 个读取窗口一致，另核对 31 条直接调用和 23 份函数证据。通过物理跳表分清战斗子状态 7、8、9 的入口，并核实回选服、回城两个按钮的请求顺序。[源证据](../analysis/game-legacy-battle-alternate-exit-v1/source-check.json)
- **专项**。7 项测试通过，覆盖 type14 的 50 帧像素回归、应答前断线、拒绝、提前成功、无符号时钟回绕、退出期间的收发和清理。
- **入口**。桌面及移动尺寸 Chrome、微信 Page 源码适配器及本轮构建版，各通过普通地图与战斗两种入口。八条独立本机 TCP 路径均验证退场画面、音效一次、`1^t` 一次及 `VKW` 成功后自动关闭。另重跑 6 条服务端主动退出路径和 4 条选服、战斗及回地图音乐路径。
- **构建与回归**。五种微信本机构建及 WXML、WXSS 编译通过，Page 源码适配器与构建版各通过 25 项。226 个 Node 测试文件共 2,735 项通过，运行前后 1,495 个输入哈希一致。[运行回执](../analysis/game-legacy-battle-alternate-exit-v1/validation.json)

首轮 Page 探针因未指定本轮构建目录而载入旧 Page，切换到本轮构建后重跑通过。微信模拟器、真机、现行交接和官服待验收。

<a id="stage237-legacy-music-phases"></a>

## stage237 选服、战斗与返回地图验收

- **静态**。核对固定 PE 与 REA 的 28 个文件读取窗口、2 个初始为零的虚拟位置、16 条直接调用和 9 个函数。复核两张战斗跳转表、背景与地图号边界，以及 `S)B` 的接收范围。[源证据](../analysis/game-legacy-music-phases-v1/source-check.json)
- **专项**。8 项音频测试通过，覆盖 288 种战斗选曲边界组合、选人渐隐、重复帧去重、待用曲目及无待用曲目时的恢复、旧渐隐回调失效。
- **入口**。桌面和移动尺寸 Chrome 的音频图检测到实际 PCM。微信 Page 源码及构建版使用本机音频端口夹具。四条入口均走过选服、人物入场、战斗与普通返回地图。本机 TCP 对端在战斗期间发送有效和越界的 `S)B`，验证切曲延至地图重建，并核对既有的战斗退出请求。
- **退场回归和构建**。另有六条本机 TCP 路径验证普通及战斗中的 `VKW` 退场。五种本机构建与 WXML、WXSS 编译通过。
- **全量回归**。226 个 Node 测试文件共 2,730 项通过，运行前后 1,494 个输入哈希一致。微信 Page 源码和构建版各通过 25 项回归。[运行回执](../analysis/game-legacy-music-phases-v1/validation.json)

首轮入口夹具放入了场景模式 0 的战斗曲。测试场景为模式 1，补入查表所需的 `puk2_battle1.wav` 后重跑通过。微信模拟器、真机播放、现行版交接和官服待验收。

<a id="stage236-legacy-audio"></a>

## stage236 场景音乐与退场音效验收

- **静态与资源**。23 个 REA 读取范围与固定 PE 一致，另核对 10 条直接调用、44 条曲目记录及 45 个选曲值。对 44 个本地 WAV 文件核验了 45 种路径及模式组合。[源证据](../analysis/game-legacy-audio-v1/source-check.json) · [资源回执](../analysis/game-legacy-audio-v1/material-check.json)
- **专项**。覆盖原始选曲表、8 位和 16 位 PCM、独立静音开关、循环起止、重复退出、时钟回绕及过期读取。初次全量回归发现静音字段改变了既有资源计划结构。将开关移入内部元数据后，资源计划与音频专项 27 项通过。
- **入口**。六条本机 TCP 路径通过。桌面与移动尺寸 Chrome 的音频图检测到合成 PCM。微信 Page 源码与构建产物通过 Node 音频端口夹具覆盖普通地图和战斗退场。对端在确认前观察到连接保持，确认后收到 EOF。
- **构建与 Page 回归**。五种本机构建通过，WXML 和 WXSS 编译通过。微信 Page 源码与构建产物各通过 25 项回归。
- **全量回归**。226 个 Node 测试文件共 2,728 项通过，运行前后 1,493 个输入的哈希一致。[运行回执](../analysis/game-legacy-audio-v1/validation.json)

微信模拟器和真机的音频输出、固定原生程序的实际混音、现行交接与官服仍待验收。

<a id="stage235-legacy-server-return-fade"></a>

## stage235 退出画面验收

- **静态**。核对 10 个函数、8 条直接调用、8 个文件窗口、10 条 REA 指令和 5 个操作数窗口，另核对默认帧周期与虚拟填充初值。[源证据](../analysis/game-legacy-server-return-fade-v1/source-check.json)
- **逐帧**。Canvas 适配器的 50 帧哈希与独立参考逐一一致。测试覆盖无全幅画面、UInt32 时钟回绕、关闭取消及重复回调。
- **入口**。桌面及移动尺寸 Chrome、微信 Page 源码与构建产物通过 6 条本机 TCP 路径。微信两套入口各额外在战斗画面提交后接收退出通知。各路径均在末帧开放确认，确认后对端观察到 EOF。
- **回归与构建**。225 个 Node 测试文件共 2,722 项通过。两套微信 Page 回归各通过 25 项，五种本机构建及 WXML、WXSS 编译通过。[运行回执](../analysis/game-legacy-server-return-fade-v1/validation.json)

浏览器初次检查在播放期间读取了画面，最终入口测试改为等实际完成态再取样。音效在阶段 236 单独验证，原生填充、现行交接、微信模拟器、真机和官服仍待验收。[音频验收](#stage236-legacy-audio)

<a id="stage234-legacy-server-return"></a>

## stage234 服务端退出通知验收

- **静态**。核对 11 个函数、14 个直接调用、9 个文件窗口、8 条 REA 指令和 11 个操作数窗口。调用点复核纠正了初稿中的字段位置，最终验收使用首字段。[源证据](../analysis/game-legacy-server-return-v1/source-check.json)
- **会话**。首字段精确匹配才接受。重复通知和同批后续位置包留在接收缓冲。暂停中的战斗退出会取消待发指令，已提交写入的迟到失败保留退出提示。
- **入口**。桌面及移动尺寸 Chrome、微信 Page 源码和构建产物完成入场、步行、通知与确认退出。原创对端在确认前观察到连接保持且无额外请求，确认后观察到 EOF。
- **回归与构建**。225 个 Node 测试文件共 2,720 项通过。两套微信 Page 回归各通过 25 项，五种本机构建及 WXML、WXSS 编译通过。[运行回执](../analysis/game-legacy-server-return-v1/validation.json)

原生退场画面、现行游戏交接、微信模拟器、真机和官服仍待验收。

<a id="stage233-legacy-frame-startup"></a>

## stage233 普通帧与单字段入场验收

- **静态**。对照固定旧版 PE 核对 21 个函数、15 条直接调用、12 个文件窗口、8 条 REA 指令及 4 个虚拟初始化值。[源证据](../analysis/game-legacy-frame-startup-v1/source-check.json)
- **共享运行**。三个夹具角色同帧推进，主 9 抑制类别 3 的帧音效，其余两个角色产生声音。收到动作 99 后，本机与相应远端角色进入不同的门控分支。
- **材料与入口**。v2 通过只读端口校验固定旧版 EXE 并合并合成的 `Config.dat` 和命令尾。桌面与移动尺寸 Chrome、微信 Page 源码和构建产物均用单字段配置连接本机原创对端，通过入场、两条步行请求及换场。
- **回归与构建**。225 个 Node 测试文件共 2,718 项通过。微信两套 Page 回归各通过 25 项。五种本机构建和 WXML、WXSS 编译通过。[运行回执](../analysis/game-legacy-frame-startup-v1/validation.json)

现行游戏交接、微信模拟器、实体设备和官服仍待验收。

<a id="stage232-legacy-ordinary-context"></a>

## stage232 普通入场、时段与实际移动验收

- **静态**。核对 23 个函数、16 个原始字节窗口、11 个直接调用和 7 个虚拟初始化值。[REA 与 PE 核对](../analysis/game-legacy-ordinary-context-v1/source-check.json)
- **共享运行**。跨过时段边界后，6 号地砖进入事件分支，产生预期字段并保持动作锁。换场后保留事件序号与点击节流。另核对 `@Qu` 负偏移的 UInt32 回绕。
- **入口**。桌面和移动尺寸 Chrome、微信 Page 源码与构建产物均通过本机入场、两条精确步行请求和换场。微信换场以场景状态和新帧核验。
- **回归与构建**。225 个 Node 测试文件共 2,716 项通过，微信两套 Page 回归各通过 25 项。五种本机构建及 WXML、WXSS 编译通过。[运行回执](../analysis/game-legacy-ordinary-context-v1/validation.json)

微信模拟器、真机、现行交接及官服仍待验收。

<a id="stage231-legacy-display-startup"></a>

## stage231 画幅、相机及实际入口验收

- **静态**。核对 14 个函数、13 个原始字节窗口、5 个直接调用及 2 个虚拟初始化值。固定样本的建窗、投影、节奏和坐标写入路径见证据。[REA 与 PE 核对](../analysis/game-legacy-display-startup-v1/source-check.json)
- **入口**。桌面和移动尺寸 Chrome、微信 Page 源码和构建产物均完成本机角色入场。角色数据补齐后绘出非空 640×480 画面。共享运行测试验证位置修正在下一次指针投影前生效。v2 的模块、Config.dat 和源显示选择通过组合检查。
- **回归与构建**。225 个 Node 测试文件共 2,714 项通过。微信两套 Page 回归各通过 25 项，五种本机构建、WXML 和 WXSS 编译通过。[运行回执](../analysis/game-legacy-display-startup-v1/validation.json)

微信模拟器、真机、现行交接及官服仍待验收。

<a id="stage230-legacy-config-startup"></a>

## stage230 Config.dat 启动配置验收

- **静态**。固定旧版经 12 个函数、10 个原始字节窗口和 9 个直接调用核对，绑定 WinMain、CRT 文本输入与资源消费者。另单列一个虚拟初始化值。[REA 和 PE 核对](../analysis/game-legacy-config-startup-v1/source-check.json)
- **入口**。桌面和移动尺寸 Chrome、微信 Page 源码和构建产物使用迁移后的原创资源，向本机对端发送预期首包并取得角色列表。缺文件、短读、CRLF、Ctrl+Z、NUL 和缓冲区边界已覆盖。微信换包成功后重新核验配置，失败时保留已有选择。
- **回归和构建**。225 个 Node 测试文件共 2,711 项通过，微信两套 Page 回归各通过 25 项，v2 显式参数入口继续通过。五种本机构建及 WXML、WXSS 编译通过。[测试和构建回执](../analysis/game-legacy-config-startup-v1/validation.json)

微信模拟器、真机与官服未验收。

<a id="stage229-legacy-startup-materials"></a>

## stage229 旧版模块摘要与启动入口验收

- **静态**。REA 的 7 个文件窗口与 10 个直接调用完成字节核对。64 轮常量、消息字选择和旋转相符。另复核两个现行样本的原 `.text` 文件范围。[核对回执](../analysis/game-legacy-startup-materials-v1/source-check.json)
- **运行**。桌面和移动尺寸 Chrome、微信 Page 源码和生成包均向原创本机对端发出预期首包，取得角色列表后正常断开。网页拒绝缺失和同尺寸错文件，微信拒绝缺文件并丢弃晚到的选择。v1 网页通过回归。[入口验收](../analysis/game-legacy-startup-materials-v1/validation.json)
- **回归与构建**。225 个 Node 测试文件共 2,708 项通过。两套微信 Page 回归各通过 25 项。五种本机构建和 WXML、WXSS 编译通过。[回执](../analysis/game-legacy-startup-materials-v1/validation.json)

微信模拟器、真机和官服尚待验证。微信 Page 的联机结果来自本机 TCP 对端。

<a id="stage228"></a>

<a id="stage228-wechat-special-dialogs"></a>

## stage228 微信物品交接、双字段、外观和图文验收

**事实**。源码适配与生成包各通过 25 项页面测试，每套含 24 条独立 TCP 会话。新增会话覆盖给予与接受、报价确认、双字段确认和取消、外观草稿与提交、图文确认和关闭。普通图文会话增加画布绘制和缺图验证。两套运行的对端回执与三组 RGBA 帧哈希一致。

**事实**。225 个文件的 2,706 项源码回归与 80 项生成核心测试通过。五套构建核对 1,101 项输入和 105 项输出，外部导入为零。启用游戏的主包 760,294 字节，游戏分包 1,048,768 字节。微信 WXML 和 WXSS 编译均退出 0，可定位到新画布和第二字段处理函数。

**运行检查**。使用本机 DevTools 自动化入口和本轮生成目录测试连接。工具返回 `IDE_SERVICE_PORT_EXPLICITLY_DISABLED`，退出 1，模拟器连接和页面执行均待验证。保留当次生成包哈希和结果回执。

**待验证**。原版复合外观渲染与 NPC 图像、入站邀请、微信模拟器和真机游戏操作、现行登录交接及官服兼容。

[验证回执](../analysis/game-wechat-special-dialogs-v1/validation.json) · [交付校验](../analysis/game-wechat-special-dialogs-v1/checkpoint-audit.json) · [已知限制](known-issues.md#stage228-wechat-special-dialogs)

<a id="stage227"></a>

<a id="stage227-wechat-family-board"></a>

## stage227 微信家族、家族兽与留言板验收

**事实**。源码适配与生成包各通过 24 项页面测试，每套含 23 条独立 TCP 会话，其中 4 条覆盖本轮家族、家族兽和留言板。两套对端回执一致。检查了资料更新、权限变动、相邻邀请、成员分配、确认移除及退出，家族兽的特例和普通喂食、改名与关闭，以及留言板刷新、双向翻页、Windows-936 发帖和原行号删除。

**事实**。225 个文件的 2,706 项源码回归与 80 项生成核心测试通过。五套构建核对 1,097 项输入和 105 项输出，外部导入为零。启用游戏的主包 760,294 字节，游戏分包 1,042,388 字节。微信 WXML、WXSS 编译退出 0，产物可定位到三个新增 Page 处理函数和相关样式。

**复验记录**。首次成员邀请用例返回失败，当时未保存提示。夹具改为确认收到完整相邻角色帧、之后至少两帧场景绘制，并满足严格超过 500 毫秒的输入门槛。复跑的源码和生成包均通过。静态校验同时修正家族兽分派入口为 `0x4900a9`，直接调用仍为 `0x4900ac`。

**待验证**。入站家族邀请、原版 NPC 与留言图像、其他地图窗口、微信模拟器与真机、现行登录交接及官服兼容。

[验证回执](../analysis/game-wechat-family-board-v1/validation.json) · [交付校验](../analysis/game-wechat-family-board-v1/checkpoint-audit.json) · [已知限制](known-issues.md#stage227-wechat-family-board)

<a id="stage226"></a>

<a id="stage226-wechat-storage-trade"></a>

## stage226 微信仓储、饲料箱与玩家交易验收

**事实**。源码适配与生成包各通过 20 项页面测试，每套含 19 条独立 TCP 会话，其中 3 条覆盖仓储、饲料箱与玩家交易。两套对端回执一致。验收覆盖物品拆分和整组移动、宠物和金币双向存取、金币上限、饲料箱限制及静默关闭、双交易入口、报价失效和重新报价。

**事实**。225 个文件的 2,706 项源码回归与 80 项生成核心测试通过。五套构建核对 1,073 项输入和 93 项输出，外部导入为零。启用游戏的主包 760,294 字节，游戏分包 1,020,677 字节。微信 WXML、WXSS 编译退出 0，产物可定位到两个新增 Page 处理函数和仓储样式。

**复验记录**。首轮源码版在首次交易请求返回失败，当时未记录提示。复跑按共享核心严格超过 500 毫秒的门槛等待并记录时点。一次生成包拾取回归在对端读取 EOF 时收到连接重置。夹具加入完整硬币移除帧的收齐检查，源码适配与生成包随后均通过。

**待验证**。微信模拟器与真机、实际对端结算、仓储其他专用窗口、现行登录交接及官服兼容。

[验证回执](../analysis/game-wechat-storage-trade-v1/validation.json) · [交付校验](../analysis/game-wechat-storage-trade-v1/checkpoint-audit.json) · [已知限制](known-issues.md#stage226-wechat-storage-trade)

<a id="stage225"></a>

<a id="stage225-wechat-map-services"></a>

## stage225 微信治疗、人物技能与两套宠物训练验收

**事实**。源码适配与生成包各通过 17 项页面测试，每套含 16 条独立 TCP 会话，其中 3 条覆盖本轮服务。两套运行的对端回执一致。验证内容包括治疗单选、完整治疗、取消和余额更新，人物学习和遗忘、名单更新后撤销确认，两套宠物训练的资格、栏位与退出，以及既有图文对话的文字选择。

**事实**。225 个文件的 2,706 项源码回归与 80 项生成核心测试全部通过。五套构建核对 1,057 项输入与 85 项输出，外部导入为零。启用游戏的主包 760,294 字节，游戏分包 1,002,958 字节。原生 WXML、WXSS 编译器均退出 0，生成产物可定位到新增处理函数及样式。

**待验证**。微信模拟器与真机运行、完整 NPC 图像、仓储与玩家交易等地图窗口、现行登录至游戏的交接和官服兼容。测试使用原创材料和独立本机对端。

[验证回执](../analysis/game-wechat-map-services-v1/validation.json) · [交付校验](../analysis/game-wechat-map-services-v1/checkpoint-audit.json) · [已知限制](known-issues.md#stage225-wechat-map-services)

<a id="stage224"></a>

<a id="stage224-wechat-inventory-shop"></a>

## stage224 微信背包、商店及地图入口验收

**事实**。源码版与生成包各通过 14 项页面测试，每套含 13 条独立 TCP 会话，其中 7 条新增。涵盖物品使用、装备、拆分、交换、定向使用和确认丢弃，地面物品拾取后按回包入包。还核对六类商店、失效报价、买卖回包、鉴定说明、耐久更新和地图 NPC 入口。

**事实**。225 个文件的 2,706 项源码回归与 80 项生成核心测试全部通过。五套构建核对 1,049 项输入与 81 项输出，外部导入为零。启用游戏的主包 760,294 字节、游戏分包 995,580 字节。包含背包和商店模板的 WXML、WXSS 编译器退出 0。初次构建的 NPC 服务模块导入名已修正。

**复验记录**。首轮源码版完整页面测试在物品操作后的末尾移动等待超时，当时缺少触控时标。复跑等到已有 250 毫秒输入门槛并记录下界，源码与生成包均通过。

**待验证**。微信模拟器与真机运行、完整角色与地图业务、现行交接及官服。测试使用原创材料和独立本机对端。

[验证回执](../analysis/game-wechat-inventory-shop-v1/validation.json) · [交付校验](../analysis/game-wechat-inventory-shop-v1/checkpoint-audit.json) · [已知限制](known-issues.md#stage224-wechat-inventory-shop)

<a id="stage223"></a>

<a id="stage223-wechat-creation"></a>

## stage223 微信建角、名单刷新和首次触控验收

**事实**。源码适配和生成包各通过 7 项页面测试，分别覆盖 6 条独立 TCP 会话。三条新增会话涵盖双空槽成功建角与两条移动、拒绝后返回原列表、待应答时退后台。原版建角的名称与点数校验、取消和防重由既有共享会话承担。

**事实**。225 个文件的 2,706 项源码回归与独立生成核心的 80 项测试全部通过。五套构建核对 1,033 项输入和 73 项输出，外部导入为零。游戏启用构建的主包 760,294 字节、游戏分包 980,626 字节。微信自带 WXML、WXSS 编译器退出 0。

**复验记录**。首轮两套页面测试均将双空槽夹具误判为另一槽占用。修正断言后的试跑停在 5 次写入，缺少两条移动。**推测**。试跑触控早于共享输入 250 毫秒门槛，当时缺少触控时标。**事实**。按门槛复验并记录触控时间下界，两套完整页面测试均通过。

**待验证**。微信模拟器、真机、真实资源、完整角色管理和官方会话。本轮使用独立原创 TCP 对端及微信 API 形状的测试端口。

[验证回执](../analysis/game-wechat-creation-v1/validation.json) · [交付校验](../analysis/game-wechat-creation-v1/checkpoint-audit.json) · [已知限制](known-issues.md#stage223-wechat-creation)

<a id="stage222"></a>

<a id="stage222-wechat-page"></a>

## stage222 微信游戏页、本机 TCP 与网页复验

**事实**。225 个测试文件的 2,706 项源码回归与独立生成核心的 80 项测试通过。实际 Page 处理函数在源码适配和隔离生成包各通过 4 项，覆盖导航与资源清理、选角和地图、战斗返回、聊天。每套各 3 条会话经独立 TCP 对端核对，模拟微信文件与画布端口。

**事实**。五套构建核对 1,033 项输入记录与 73 项输出记录，外部导入为零。启用游戏的构建中，主包 760,294 字节、游戏分包 971,719 字节。微信自带 `wcc` 与 `wcsc` 对最终构建退出 0。桌面与触屏网页的 48 条流程、240 张截图及控制台检查通过。当前没有 Browser 插件，使用本机 Playwright 1.64.1 与 Chrome。

**事实**。首批生成核心和全量浏览器日志完整，shell 包装脚本因误用 zsh 保留变量而丢失子进程退出码。修正后复跑生成核心 80 项与桌面、触屏画布各一条，均记录退出 0。

**事实**。DevTools 自动化 SDK 返回 `IDE_SERVICE_PORT_EXPLICITLY_DISABLED`。DevTools Stable 2.02.2608070 的普通导入向导读取默认构建路径后显示游客 AppID 限制，创建点击后仍在导入页，随后取消导入。该次探测尚未取得小程序模拟器会话。

**待验证**。原生微信运行、真机、真实资源规模、完整游戏及现行和官方兼容。测试使用独立原创夹具，本轮实际 Windows 活动和官方游戏会话均为零。

[验证回执](../analysis/game-wechat-page-v1/validation.json) · [交付校验](../analysis/game-wechat-page-v1/checkpoint-audit.json) · [已知限制](known-issues.md#stage222-wechat-page)

<a id="stage221"></a>

<a id="stage221-chat-presentation"></a>

## stage221 地图气泡、名单与公告的本机验收

**事实**。225 个测试文件的 2,706 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 783 个输入和 34 个输出，外部导入为零。 五项定向测试核对既有聊天、名单容量与所有权、双字节断行、角色生命期和公告循环。

**事实**。48 条本机 TCP 流程通过。新增源码与生成核心分别核对过滤、气泡、公告、角色移除与移动。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过 24 条网页流程，页面错误、警告和外部请求均为零。 两种尺寸另各重连一次，核对名单恢复和首批收包。保留 240 张合成资源截图。

**事实**。定向首跑发现 Buffer 切片共享字节，改用独立复制后重测。页面首跑通过 DOM 检查但较小画布中没有可见的气泡和公告，修正视口映射后分别核对红、黄、绿绘制像素。

**待验证**。原版隐藏聊天开关、气泡素材和音效、特殊角色、战斗中公告、家族邀请应答、真实联机、手机真机及微信原生游戏页待验证。

[本轮计划](../analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-chat"></a>

### 前序检查点 · 地图聊天字节、限频及网页验收

**事实**。225 个测试文件的 2,703 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 783 个输入和 34 个输出，外部导入为零。 四项定向测试覆盖普通与小队聊天、76 字节边界、限频、512 条历史和既有家族及消息目录回归。

**事实**。46 条本机 TCP 流程通过。新增源码与生成核心均比对两条文本和两条频道设置请求，并核对消息回显与清理。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 23 条网页流程，页面错误、警告和外部请求均为零。 保留 232 张合成资源截图，新增 12 张覆盖收包、输入、发出后等回显、小队及返回地图。

**待验证**。原版头顶气泡、黑名单、滚动公告、家族邀请应答、真实联机、手机真机、微信原生游戏页及官服兼容待验证。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 邀请、成员管理和退出的本机验收

**事实**。225 个测试文件的 2,701 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 779 个输入和 34 个输出，外部导入为零。 九项定向测试覆盖家族动作、权限、消息格式、严格冷却和交易回归。

**事实**。44 条本机 TCP 流程通过。新增源码和生成核心各核对四条请求、角色权限撤回、其他成员变化期间保留等待，以及退出后移动。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 22 条网页流程，页面错误、警告和外部请求均为零。 保留 220 张合成资源截图，新增 16 张覆盖受保护成员、邀请、称号编辑、移除确认与取消、退出和返回地图。

**待验证**。收到邀请后的应答、独立入会申请、旧布局中的称号清除、真实结算、手机真机、微信原生游戏页与官服兼容仍待验证。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 家族管理的字节、权限和网页验收

**事实**。225 个测试文件的 2,699 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 779 个输入和 34 个输出，外部导入为零。 五项定向测试覆盖资料、名单、消息编码及上一轮家族兽和饲料箱。

**事实**。42 条本机 TCP 流程通过。新增的源码和生成核心流程各核对三条家族编辑命令、名单变化和关闭后移动。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 21 条网页流程，页面错误、警告和外部请求均为零。 保留 204 张合成资源截图，新增 12 张覆盖只读、等待、编辑、权限撤回、清除家族及返回地图。

**待验证**。入会申请、邀请、成员移除和分配称号的出站流程，以及真实结算、手机真机、微信原生游戏页与官服兼容待验证。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 家族兽与饲料箱的字节和网页验收

**事实**。225 个测试文件的 2,697 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 775 个输入和 34 个输出，外部导入为零。 两项定向测试覆盖权限状态、例外类别、槽修订、名称边界及转义、记录更新与窗口归属。

**事实**。40 条本机 TCP 流程通过，新增源码和生成核心各核对 7 条 /1I。单独核对饲料箱关闭的静默和家族兽 C 的序号归属。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 20 条网页流程，页面错误、警告和外部请求均为零。 保留 192 张合成资源截图，其中新增 16 张。两种视口均核对滚动信息、权限、等待更新、饲料箱槽位和返回地图。

**待验证**。原版拖放、近距关闭、其余家族窗口、真实结算、手机真机、微信原生游戏页和官服兼容仍待验证。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 仓储存取的字节和网页验收

**事实**。225 个测试文件的 2,695 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 771 个输入和 34 个输出，外部导入为零。 两项定向测试覆盖损坏增量的原子拒绝、过期修订、物品分组、金币上限和关闭所有者。

**事实**。38 条本机 TCP 流程通过。新增的源码和生成核心各核对 8 条 /1I，包含本地和服务端关闭回复。提交后以对应入站记录更新钱包、携带物和仓储。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 19 条网页流程，页面错误、警告和外部请求均为零。 保留 176 张合成资源截图，其中新增 14 张。核对来源与目标槽位、等待更新、金币上限、仓储变体和关闭后移动。

**待验证**。六位数字提示与认证的关系、0x22 独立窗口、真实结算、手机真机、微信原生游戏页和官服兼容仍待验证。

[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 地图专用对话的字节与网页验收

**事实**。225 个测试文件的 2,693 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 767 个输入和 34 个输出，外部导入为零。 三项定向测试覆盖字段边界、双字节尾、两层转义、裁剪、外观草稿及图形编号。

**事实**。36 条本机 TCP 流程通过。新增两条分别从源码和生成核心核对 9 条 /1I 字节，包括外观箭头阶段没有发包和提交后角色记录仍由服务端更新。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 18 条网页流程，页面错误、警告和外部请求均为零。 保留 162 张合成资源截图，新增 14 张。两种视口均核对图文像素、输入错误后保留两项和关闭后继续移动。

**待验证**。组合式外观像素、其余地图窗口和银行协议、真实服务端结算、手机真机、微信原生游戏页及官服兼容仍待验证。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 宠物训练原始回复与浏览器验收

**事实**。225 个测试文件的 2,690 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 763 个输入和 34 个输出，外部导入为零。 两项定向测试覆盖拒绝无上下文或不同 NPC 的后继、金币和宠物变化、十个栏位上限和相同记录重放。

**事实**。34 条本机 TCP 流程通过。新增源码与生成核心流程分别核对 9 条 /1I 字节和关窗后的移动。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过 17 条网页流程，页面错误、警告和外部请求均为零。 保留 148 张原创夹具截图，其中 14 张记录新增训练流程。

**待验证**。宠物师范原版图形和提示布局、其余专用窗口、真实服务端结算、手机真机、微信游戏页和官服兼容仍待验。

[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · 商店入口和技能师范本机验收

**事实**。225 个测试文件的 2,688 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 759 个输入和 34 个输出，外部导入为零。 两项定向测试覆盖买卖标志组合、技能容量与费用、排序后的原回复编号、失效、最大 15 项和本地关闭。

**事实**。32 条本机 TCP 流程通过。新增源码与生成核心分别验证 11 条 /1I 的精确字节，包括两个后续商店窗口和所有技能分支。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过 16 条网页流程。页面错误、警告和外部请求均为零。 保留 134 张原创夹具截图，其中 14 张验证新增流程的商店入口、师范、学习、遗忘确认、列表失效及返回地图。

**待验证**。NPC 窗口原版图形与遗忘数值栏名称、宠物技能和其余专用窗口、真实结算、手机真机、微信游戏页和官服兼容仍待验。

[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · 治疗原字节与对话像素验收

**事实**。225 个文件的 2,686 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 755 个输入和 34 个输出，外部导入为零。 八项定向测试覆盖治疗空位、伤势分档、选择、取消、更新余额、图形指令、资源边界和普通对话回归。

**事实**。30 条本机 TCP 流程通过。新增源码与生成核心流程检查治疗 5、9 和取消的原字节，验证图文选择、缺图文字、无额外请求和正常清理。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十五条网页流程。页面错误、警告和外部请求均为零。 保留 120 张原创夹具截图，其中 8 张为新增流程。网页读回静态 RGBA 和动画变化，关闭后画布清空，缺图时文字仍可操作。此环境使用既有 Playwright。

**待验证**。原版伤势图标、图文窗口像素布局、其余专用窗口、真实治疗结算、手机真机、微信游戏页和官服兼容仍待验。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 玩家交易的双入口和回包验收

**事实**。225 个文件的 2,684 项源码测试和生成核心的 80 项测试通过。四套小程序构建核对 751 个输入和 34 个输出，外部导入为零。 十二项定向测试覆盖交易双入口、候选行号、资格、重复槽、金币限制、原字节、撤回、报价过期、战斗中拒绝和回包更新。

**事实**。28 条本机 TCP 流程通过。新增的源码与生成核心流程确认选人、原字节报价与确认、对方撤回、拒绝旧报价、结束后等权威记录更新、直接邀请与正常退出。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十四条网页流程。页面错误、警告和外部请求均为零。 保留 112 张原创夹具截图，其中 10 张来自交易。Browser 插件在此环境缺失，本轮使用既有 Playwright。

**待验证**。原版队伍交易入口和交易详情、真实结算、手机真机、微信游戏页、现行版与官服兼容待验。

[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 留言板的回包、编辑与动作验收

**事实**。225 个文件的 2,682 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。 九项定向测试含留言板的双层转义、空槽、名字及内容上限、原行号、失效版本、发帖和关闭。

**事实**。26 条本机 TCP 流程通过。新增的源码和生成核心流程验证原样回包、中文双行发布、原条目删除与关闭后的移动。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十三条网页流程。页面错误、警告和外部请求均为零。 保留 102 张原创夹具截图，其中 10 张来自留言板。Browser 插件在此环境缺失，本轮使用既有 Playwright。

**待验证**。玩家交易、原版留言头像与编辑细节、手机真机、微信游戏页、现行版与官服兼容待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 单项给予的限量、复核和回包

**事实**。225 个文件的 2,680 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。 七项定向测试覆盖普通对话、买卖、鉴定修理、物品兑换和单项给予。给予用例核对 999 上限、负数拒绝、金币的递增边界、物品和金币变化、确认及取消。

**事实**。24 条本机 TCP 流程通过。新增的源码与生成核心流程覆盖两个分支、预览无发包、拒绝过期选择、确认和取消，以及服务端物品和金币更新。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十二条网页流程。页面错误、警告和外部请求均为零。 保留 92 张原创夹具截图，其中 10 张来自单项给予。Browser 插件在此环境缺失，本轮使用既有 Playwright。

**待验证**。其余交易模式、原版商店图形、手机真机、微信游戏页、现行版与官服兼容待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 兑换容量、确认、取消和物品回包

**事实**。225 个文件的 2,678 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。 五项定向用例覆盖普通对话、买卖、鉴定修理和兑换。兑换用例核对第 11 字段、带装备的余额、首个部分付款时停止腾格、容量变化、超过 20 件的合法堆叠与取消。

**事实**。22 条本机 TCP 流程通过。新增的源码与生成核心兑换用例验证满包付款腾格、更新后重算、准确回复和回包后的商品。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十一条网页流程。页面错误、警告和外部请求均为零。 保留 82 张原创夹具截图，其中 10 张来自兑换。Browser 插件在此环境缺失，本轮使用既有 Playwright。

**待验证**。其余交易模式、原版商店图形、手机真机、微信游戏页、现行版与官服兼容待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 鉴定、修理和背包说明回归

**事实**。225 个文件的 2,677 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。 四项定向测试覆盖普通对话、买卖和鉴定修理。新用例覆盖七字段记录、双槽确认、余额边界、过期槽位、修理取消和长说明回包。

**事实**。20 条本机 TCP 流程通过。新增源码及生成核心两条服务流程核对鉴定和修理费用、回复字节和背包更新。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十条网页流程。页面错误、警告和外部请求均为零。 保留 72 张原创夹具截图，其中 10 张来自鉴定与修理。Browser 插件在此环境缺失，本轮使用既有 Playwright。

**待验证**。其他交易模式、原版商店图形、手机真机、微信游戏页、现行版与官服兼容待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-shop"></a>

### 前序检查点 · 普通买卖、取消和回包验收

**事实**。225 个文件的 2,676 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。 新增两个定向用例，覆盖购买堆叠和余额边界、装备提示、出售金额上限、过期报价、原始行序和取消字节。

**事实**。初次实现曾将装备限制用于拒绝购买。核对 0x5637b0 的原版提示和购买加量路径后，改为提示并重跑构建、源码、TCP 与网页验收。

**事实**。18 条 TCP 流程通过。商店用例分别在源码与生成核心核对买卖总价、旧报价拒绝、核对时无发包、服务端更新、取消与返回地图。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过九条网页流程。页面错误、警告和外部请求均为零。 保留 62 张原创夹具截图，其中 10 张来自两条新商店流程。Browser 插件在此环境缺失，本轮使用既有 Playwright。

**待验证**。鉴定、修理、其他交易模式、原版商店图形、手机真机、微信游戏页、现行版与官服兼容待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 地图对话、选择、文本和关闭验收

**事实**。225 个文件的 2,674 项源码测试与生成核心的 80 项测试通过。四套构建核对 743 个输入和 34 个输出，外部导入为零。 26 项定向测试覆盖槽复用、三种右键指令顺序、普通模态门控、菜单回复、中文转义、重复包、过期修订和关闭。

**事实**。16 条本机 TCP 流程通过。新用例验证收到服务端包才开窗，菜单和中文回复字节与独立对端一致，错误关闭保留窗口，本地关闭后继续移动。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过八条流程。页面错误、警告和外部请求均为零。 保存 52 张原创夹具截图，六张展示新对话或返回地图。Browser 插件不可用，使用已有 Playwright 运行本机页面。

**更正**。初版夹具把关闭标记放在第三个整数。重新核对分发栈后改为第二个整数，补验序号 -1 且掩码为 0 的普通窗口，并重跑全部本机验收。

**待验证**。原版图文及专用弹窗、商店、手机真机、微信游戏页、现行版和官服兼容仍待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 拾取、回包与平台回归验收

**事实**。225 个文件的 2,673 项源码测试与生成核心的 80 项测试通过。四套构建核对 739 个输入和 34 个输出，外部导入为零。 客户端专项覆盖两个冷却、长按、范围、非匹配角色、移动中拾取和本机门控。

**事实**。14 条源码和生成核心本机 TCP 流程通过。地面拾取核对丢弃、移动、转身、捡回、同格钱币和两类状态的延迟回包。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过七条流程，页面错误、警告和外部请求均为零。 保留 46 张原创夹具截图，其中六张为本轮拾取。分别核对物品、钱币像素出现和删除后的消失，以及背包恢复。

**待验证**。当时还剩原版角色交互、商店与弹窗、完整玩法、手机真机、微信游戏页、现行版和官服兼容仍待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-targets"></a>

### 前序检查点 · 特殊目标、丢弃、卸武器及回归验收

**事实**。95 个文件的 1,267 项源码回归与生成核心 80 项测试通过。四套构建核对 739 个输入和 34 个输出，外部导入为零。 29 项专项覆盖第 10 字段边界、槽位修订、空位数、冻结状态、当前格与移动目标格不同。

**事实**。12 条源码和生成核心本机 TCP 流程通过。新分支使用延迟回包核对目标资格更新、丢弃移除、卸武器后盾留在手位、回合结算和地图返回。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过六条流程，页面错误、警告和外部请求均为零。 留存 40 张原创夹具截图。初次截图中的触屏丢弃提示可能滚出屏幕。提示移到操作按钮旁，复测核对提示与确认按钮同屏。

**待验证**。当时还剩地面拾取、商店分支、原版指针和弹窗行为、手机真机、微信游戏页、现行版和官服兼容仍待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-items"></a>

### 前序检查点 · 普通背包与修正后的战斗用物验收

**事实**。95 个测试文件的 1,264 项源码回归和生成包 78 项测试通过。四套构建核验 739 个输入和 34 个输出，外部导入为零。 20 项专项覆盖当前格与移动目标格不同、旧修订号、暂停、受限状态和数量边界。

**事实**。源码和生成包 10 条本机 TCP 流程通过。普通用例覆盖空目标槽修订变化、特殊编码拒绝、超量拒绝及五个有效指令。战斗用例覆盖定向回复、自身使用、装备和换槽重选。

**事实**。Chrome 156 与 Playwright 1.64.1 在桌面 1100×850 和触屏模拟 390×844 各跑五条流程。页面错误、警告和外部请求均为零。 留存 28 张原创夹具截图，已查看普通背包的桌面和触屏截图。

**待验证**。特殊道具选目标、丢弃、战斗卸下武器快捷操作、原版图标和提示窗口、手机真机、微信游戏页与设备、现行版和官服兼容待完成。 当前没有测试账号。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-input"></a>

### 前序检查点 · 战斗物品输入、服务器结果与地图返回验收

字段纠正和复测见[本轮记录](#stage221-ordinary-items)。

**事实**。94 个测试文件的 1,250 项源码回归和生成包 76 项测试通过。四套构建核验 739 个输入和 34 个输出，外部导入为零。六项定向测试和六项既有输入回归通过。覆盖名称和槽位边界、满包、未鉴定、群体目标、修订校验、取消和超时。

**事实**。八条本机 TCP 流程逐字节核对动作。定向回复使目标 HP 70 → 100，自身使用使本机 HP 70 → 80，装备把资源 100114 切到 100061。换槽后仅发送重新选中的槽 9。每次完成一回合并恢复两条地图移动请求。

**事实**。桌面点击和触屏模拟各通过定向回复、自身使用、装备和换槽重选四条流程。留存 24 张原创夹具截图，页面错误、警告和外部请求均为零。回到地图后仍可读取服务端确认的背包计数。

**待验证**。普通场景背包、战斗卸下武器快捷操作、原版物品图标与说明、手机真机、微信游戏页与设备、现行版和官服兼容待完成。当前没有测试账号。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-input-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-input-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-mp-items"></a>

### 前序检查点 · CFP、ITM0 与 ITM7 验收

**事实**。93 个测试文件的 1,244 项源码回归和生成包 73 项测试通过。四套构建核验 735 个输入和 34 个输出，外部导入为零。六项定向测试覆盖有符号溢出、槽号别名、自身和重复目标、空列表、目标缺失、绘制缓冲及提前退出。

**事实**。正常路径 MP 10 → 7 → 0，目标 HP 70 → 100，动作 36 保持 120 次回调，提示音事件一次。提前退出时目标 HP 仍为 70、回合数为 0。四条本机 TCP 流程均清理 22 个槽位并恢复地图移动。

**事实**。桌面点击与触屏模拟各通过正常结算和提前中断。留存 16 张原创夹具截图，页面错误、警告和外部请求均为零。旧的未支持命令用例改用 ITM9，六条本机回归通过。

**待验证**。物品选择与发送、其他战斗行为、手机真机、微信游戏页与设备、现行版和官服兼容待完成。当前没有测试账号。

[本轮计划](../analysis/game-battle-shared-storage-v1/mp-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/mp-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-transitions"></a>

### 前序检查点 · REB 变身与 PLV 角色退场验收

**事实**。92 个测试文件的 1,238 项源码回归和生成包 67 项测试通过。四套构建核验 735 个输入和 34 个输出，外部导入为零。六项定向测试覆盖四种元素、同资源变身、无效序号或缺图形、22 个槽的坐标、存活与倒地角色，以及双动作中断。

**事实**。四条本机 TCP 流程中，正常路径完成一回合，并移除槽 10 一次。提前中断路径结束两个活跃动作，回合数保持 0。两条路径均清理 22 个槽位并返回地图。

**事实**。桌面点击与触屏模拟各通过正常结算和服务器提前中断。14 张原创夹具截图已核对，页面错误、警告和外部请求均为零。正常路径槽 0 的 HP 保持 70/100、MP 保持 10/10。四条浏览器流程均恢复地图点击或触屏移动。

**待验证**。CFP 和其余 ITM 分支、原版其他渲染后端和对象引用重叠场景、手机真机、微信游戏页与设备、现行版和官服兼容待验证。当前没有测试账号。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-transitions-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-transitions-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-friend-roster"></a>

### 前序检查点 · 好友名单与对侧召唤验收

**事实**。91 个测试文件的 1,232 项战斗回归及生成包 61 项专项通过。四套构建核验 735 个输入及 34 个输出，外部导入为零。 四项定向测试覆盖边界索引、符号位、版本刷新、原始名称、16 字节回退、四项非零比较和 C 再次入场。

**事实**。源码和生成包各通过匹配、刷新后不匹配与施法提示三条本机 TCP 流程。桌面与触屏模拟各验证两条召唤流程，留存 12 张原创夹具截图。页面错误、警告和外部请求均为零。 本机两种 MON 场景均完成一次召唤，槽 15 的 HP 为 61/90、MP 为 7/12，槽 5 保留本机宠物。施法反馈以收到的明细触发。

**事实**。首轮回归有一项旧施法夹具仍期待缺表。补入真实名单报文后，源码与生成包均验收 57ba 提示，完整回归重跑通过。

**待验证**。原生名片文件和角色切换的名单隔离、其余战斗消费者、手机真机、微信游戏页与设备、现行版与官服兼容待验收。 当前没有测试账号。

[本轮计划](../analysis/game-battle-shared-storage-v1/friend-roster-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/friend-roster-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-effects"></a>

### 前序检查点 · CHT/BST 验收与可重放证据

**事实**。90 个测试文件的 1,228 项战斗回归及生成包 58 项专项通过。四套构建核验 731 个输入及 34 个输出，外部导入为零。 五项定向测试覆盖原始名称命中、活动/全局退场顺序、精确零点与 32 位回绕、512 项覆盖和真实画布像素。

**事实**。源码与生成包各通过正常回合和提前退场的本机 TCP 流程。桌面与触屏模拟各验证两条流程，留存 18 张原创夹具截图，页面错误、警告和外部请求均为零。 四条页面流程均验证返回地图、保留三条聊天、断开后清空。触屏模拟使用 390×844，桌面使用 1100×850。

**待验证**。原生聊天过滤、音效播放、替代渲染、其余退场分支、手机真机、微信游戏页和设备、现行版与官服兼容待验收。 当前没有测试账号。

[本轮计划](../analysis/game-battle-shared-storage-v1/side-effects-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/side-effects-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 位移、像素和退场验证

**事实**。89 个测试文件的 1,223 项战斗回归及生成包 53 项专项通过。四套构建核验 727 个输入和 34 个输出，外部导入为零。 7 项新增定向测试覆盖 100 个技能号、两次模式写入、CRT 与粒子位置、30 次效果、四像素与遮挡、无信号游标和两种退场。

**事实**。源码和生成包各完成普通回合与提前退场两条本机 TCP 流程。普通用例结算 30 次效果并在地图画面绘出余滴，提前退场的地图画面没有余滴。 桌面 1100×850 与触屏模拟 390×844 分别复核两种退场，留存 16 张原创素材截图。页面错误、警告和外部请求均为零。

**事实**。本机和浏览器使用原创对端、调色板、效果素材和延长的施法夹具，便于在普通地图画布捕获余滴。播放与渲染检查分别取样新建对象和已载入图像的对象。

**待验证**。完整独立模型、替代渲染、手机真机、微信原生游戏页和设备、现行版及官服兼容待验收。

[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 逐帧、生成包与页面验收

**事实**。88 个测试文件的 1,216 项战斗回归和生成包 46 项专项通过。四套构建核验 723 个输入及 34 个输出，外部导入为零。 新增 7 项覆盖 100 个技能号、800 组队列、共享随机顺序、双缓冲像素、搬运、闪避、本机停止和无信号恢复。

**事实**。源码和生成包各完成本机搬运与成对离场两条流程。收到 M 后 MP 从 10 扣至 7，完成一轮、退场和两次地图移动。成对离场从对象与名单同时移除 10、15 槽。 桌面 1100×850 和触屏模拟 390×844 各完成搬运与成对离场。四条真实页面流程各捕获至少 512 个原创特效像素，共留存 12 张截图。页面错误、警告和外部请求均为零。

**事实**。最初把追踪对象当作只在一个缓冲可见，复核源标志后改为追踪双缓冲、尾迹单缓冲。自选目标的尾迹验证纳入帧开始的两次偏移随机数。前一次回归因源计数字段和名单接线调整而停止，本节计数来自最终工作区的完整复跑。

**待验证**。本轮使用原创对端与素材。替代渲染的公开技能配置仍有边界。替代渲染、完整独立状态模型、手机真机、微信原生游戏页和设备、现行版及官服兼容待验收。

[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL402 字节、回归和正常流程验证

**事实**。87 个测试文件的 1,209 项战斗回归与生成包 39 项专项全部通过。四套构建核验 723 个输入和 34 个输出，外部导入为零。 新增 5 项覆盖 100 个技能号、三个选择值、中途信号与结束、独立随机位置计算、两侧、倒地槽、空侧和新战斗清理。

**事实**。源码和生成包分别经本机 TCP 走完两侧用例。每次提交一条技能命令，收到 M 后从 MP 10 扣到 7，完成一轮战斗、退场和两次地图移动。 桌面 1100×850 与触屏模拟 390×844 各覆盖两侧。实际 Canvas 捕获到原创效果，四条页面流程共留存 12 张截图。页面错误、警告和外部请求均为零。

**待验证**。本轮用原创资源和本机协议对端。完整的独立状态模型、原生图形后端、手机真机、微信原生游戏页和设备、现行版及官服兼容待验收。

[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · 同槽恢复、SKL405 与页面回执

**事实**。86 个文件的 1,204 项回归及生成包的 34 项专项全部通过。四套构建核验 723 个输入与 34 个输出，外部导入为 0。 新增 6 项覆盖 7,201 次忙检查、登记身份、技能号个位、实际信号、背景像素、无信号和链接移除。

**事实**。源码和生成包各完成同槽 SKL404 与 SKL405 的本机 TCP 流程。同槽用例恢复后接收下一轮 C/M、再次发送技能请求并完成第二轮，最终目标 HP 为 65。 桌面 1100×850 和触控模拟 390×844 均验证 SKL405 的背景、MP 10 → 7、结算和返回地图。共 6 张原创素材截图，页面错误、警告和外部请求均为 0。

**事实**。初轮断言将省略透明度误读为缺少终帧，复核按已有不透明表示处理。本机同槽复验采用非本地骑乘主体，生成包回执复制槽数组后比较。浏览器初轮探针被 CSP 拦截，改用直接 Canvas 采样。

**待验证**。其他别名、完整的独立状态模型、原生图形后端、手机真机、微信原生游戏页与设备、现行版和官服兼容仍待验证。 GMN、CMB 和 RID 的前序回执仍在阶段验证内。

[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：完整回归、管理器与触控页面

**事实**：当前77个战斗文件1,076/1,076项、当前neutral生成包64/64项通过；四套构建核对687个输入和34个输出，外部导入0。当前物理族主验收本机TCP397次（源码337、生成52、页面8）；新增CMB为14源码、14生成、8页面，调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共46截图，全部正常回合、返回地图与准确后续移动；页面错误、警告、外联0。Browser插件不可用，使用已有Playwright1.64.1。触控HUD核对Hero MP10、替换的OriginalRider HP40/MP8、目标HP51；nextC中的MP7来自新C包，不是合击扣费。

**事实**：256组独立队列、62条轨迹的81,918帧完整状态/拥有存储和3,918帧RGBA通过；59条身体结算、duplicate/self两条有界等待和1条本地退出分别记录。冷状态模型的反射/治疗等保留实际7201忙检查恢复；17条实际管理器入口为14个自然回合、2个等待、1个退出，不把不同初始上下文合并。immune两条结算后残留afterimage节点，9000帧观察不等于完整原生对象池收尾。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](../analysis/game-battle-combination-v1/source-check.json)、[源修正](../analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-combination-v1/test-results.json)、[验收边界](../analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](../analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](../analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：完整回归与明确消费者边界

**事实**：当前75个战斗文件1,058/1,058项、当前neutral生成包46/46项通过；四套构建核对679个输入和34个输出，外部导入0。当前物理族主验收本机TCP369次（源码323、生成38、页面8）；新增RID为10源码、10生成、8页面，额外调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共42截图，全部完成回合、返回地图及准确后续移动；页面错误、警告、外联0。实际HUD显示替换后的OriginalRider HP40/100、MP8/10。原创小像素夹具不代表完整游戏画面。

**事实**：新独立方程覆盖53场景、13,799帧状态、完整拥有存储及1,098帧RGBA；50条身体结算，same-a-multiple有界等待，same-a-b子对象移除与element159两条显式消费者边界分别保留。缺少骑手、当前槽位上下文及未覆盖角色标记原子拒绝；135等共用105c指针分支显式停止，未借独立chant/projectile映射伪造原生共享指针。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](../analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](../analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](../analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](../analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](../analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：完整回归和明确等待

**事实**：当前73个战斗测试文件完整回归1,046项全部通过；neutral生成包完整34项全部通过。四种构建核对671个输入与34个输出，外部导入0。357次主物理家族本机TCP回执（源码313、生成28、页面16）均校验正常启动、准确指令和清理。桌面1100×850与触控模拟390×844各8条实际game.html流程，共82截图；15条返回地图并继续准确移动，1条保留有界等待后断开。页面错误、警告、外联均为0。

**事实**：4,640组独立队列、136条轨迹、50,158帧状态与10,580帧完整RGBA对照通过，118条身体自然结算、2条本地244退出、16条有界等待分别记录。22条实际管理器流程为17条自然回合、4条既有7201恢复和1条退出。额外回归旧73远程变体7,680队列、15轨迹、4,108状态、310帧RGBA；132份旧生成器与金样文件均未改变。

**待验证**：自身、守护别名、缺少结束信号及RID后跟守护的16条轨迹仍有界等待，不能称为自然回合完成。已有7201恢复是独立机制，未注入ready或清理动画信号。20/21号施法者的73击倒收尾按原指令不补11/44；其他通用类别同类边界尚未纳入本轮实现验收。attachedRID消费者4236d0仍原子拒绝，不能以元数据RID三字已支持推定该消费者已完成。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair73-v1/source-check.json)、[源修正](../analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair73-v1/test-results.json)、[验收边界](../analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：状态、像素、入口与复验

**事实**：71文件完整战斗回归初轮1,012项中1,011通过、1条压力资源重入的“应正常回合”预期失败；生成包初轮33项中31通过，另有同一重入预期及跨VM对象原型比较失败。只修正3个测试辅助文件，源码与生成包各定向复验2项通过，最终分别覆盖1,012与33个检查；未声称修正后重跑完整两套。932个其他输入及产品运行代码保持相同。四种构建671输入/34输出、外部导入0；328次主物理家族TCP回执（源码285、生成27、页面16）。桌面与触屏模拟各8流程、83截图，15条正常返回移动及1条预期上下文错误/清理通过，页面错误、警告、外联0。

**事实**：独立模型4,640组队列、191条轨迹、66,189个状态和21,374帧受支持RGBA比较通过；167条身体结算、2条本地244、18条有界等待、2条保留图形0错误与2条201上下文错误分开记录。21条真实管理器路径为18条自然回合、2条既有7201恢复及1条退出。130份旧生成器/金样未改；原188条本轮轨迹也完整保留，另增3条普通信号资源轨迹。

**待验证**：两条主守护/RID在205/207帧选择图形0，保持现有几何拒绝；两条次级2041在124/126帧的201读取下一元组哨兵-1，明确报目标上下文错误，失败回调之后不声称状态/像素等价。100110是带非攻击命中信号的原创压力资源，实际入口和重入会重复主命中并等待；不擅自清信号。保留失败与有界等待，普通守护/RID/重入使用已独立建模的100114资源。这些不是原程序或官服验收。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](../analysis/game-battle-chain260-v1/source-check.json)、[源修正](../analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-chain260-v1/test-results.json)、[验收边界](../analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](../analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](../analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：105状态、像素、共享游标和错误边界

**事实**：当前69文件战斗979/979、当前neutral生成包34/34、四套构建663输入/34输出通过，0外部导入。当前物理族主验收本地TCP301次（源码258、生成27、实际页面16），另4次实际98动作内暂停/重入定向核对不计入主总数；暂停的重试不重复消耗游标，重入保留2，两次已发生的M消耗按两次计算。桌面/触屏模拟各8流程、83张截图，15条返回移动及1条预期错误提示/清理通过，页面异常/警告/外联0。921个运行/测试/对端输入稳定，含58个Python对端。未重跑全仓或历史生成包全套。

**事实**：4640组队列、158条轨迹、63158帧状态、可渲染部分42058帧完整RGBA及两selector/拥有存储一致。141条身体结束、3条244退出、12条1800帧等待、2条渲染拒绝分别记录。七组真实交错游标流程通过，护卫延迟触及相对偏移209；十等级763次动画完成只在随后14结算一次HP。22条命令管理器流程含19次自然回合结束、2次现有超时恢复、1次退出，没有注入ready、游标或手动弹队列。此前128个生成器/golden字节不变。

**事实／待验证**：护卫后的RID后续记录在原创场景中令角色资源变为0；实际核心与独立方程在帧264/311一致进入当前帧控制器的LEGACY_BATTLE_FRAME_GEOMETRY。两个案例保留为渲染边界，未当作像素或正常回合通过。初始新模型未保留失败帧中新建残影的旧优先级17，曾错误地保留计算值16，现仅修正该边界快照；全部场景输入、队列、资源、geometry、拥有存储和成功RGBA保持，只有一条边界轨迹的最后状态改变。未放宽原渲染器或改旧golden。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-context-v1/source-check.json)、[源修正](../analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-context-v1/test-results.json)、[验收边界](../analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：三类队列、状态、像素与真实页面验收

**事实**：当前67文件战斗945/945、当前neutral生成包33/33、四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP272次（源码231、生成27、实际页面14）；桌面/触屏模拟各7流程、74张截图，页面错误/警告/外联均为0。907个运行/测试/对端输入稳定，含57个Python对端。未重跑全仓或历史生成包全套。

**事实**：41760组队列、307条轨迹、71230帧状态、32260帧完整RGBA及两selector/完整拥有存储与实际共享核心一致；286条身体结束、6条244退出、15条1200帧等待分开记录。18条真实命令管理器流程含12次自然回合结束、5次现有超时恢复、1次退出，未注入ready或手动弹队列。初始新模型遗漏44对子效果的清理，已按既有源码修正；37440组原队列、289条原轨迹输入、原创资源和geometry保留，8条预期轨迹改变，另增18条优先级轨迹。此前126个生成器/golden文件字节不变。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](../analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](../analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：纠错后的源码、生成包与页面验收

**事实**：当前65文件战斗912/912、当前neutral生成包27/27和四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP227次（源码204、生成21、实际页面2）；桌面/触屏各一次266反射、回合、返回及精确移动流程通过，共10张截图，页面错误/警告/外联0。895个运行/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成包全套。

**事实**：三套受影响独立模型完整重跑，原场景、队列输入、原创资源和geometry保持一致；仅266预期队列和21条轨迹改变。当前三套合计211195队列、603轨迹、138928状态、13600完整RGBA帧，两selector经实际核心核对。旧126个生成器/golden文件中6个发生本次明确修正，其余120个字节不变；历史修改前原件及源核验视图均保留。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](../analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：当前全绿与未通过的后端边界

**事实**：当前战斗912/912（65文件）、当前neutral生成包25/25、四套构建（659输入、34输出、0外部导入）通过。当前物理族本地TCP共241次：保留源码184、新源码20、生成20、实际页面17；17条桌面/触屏流程、106张截图，页面错误/警告/外联均为0。893个源码/模型/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成套件。

**事实**：96默认后端的4160组队列、80条轨迹、32959帧状态、11836帧双selector完整RGBA与实际共享核心一致。另两条替代渲染轨迹的927状态/578像素/50样式观察仅为独立源方程；实际公开配置仍报LEGACY_BATTLE_SKILL_CONFIGURATION，未放宽门禁、未计入运行或像素通过。当前仍无替代渲染/半透明后端的完整实现。

**事实**：公开默认配置下72条轨迹自然收敛、2条244退出、6条保留1200帧等待。16条真实管理器验证得到9个自然回合、6个源超时恢复回合、1个退出；各命令与最终管理器分别计数，7201次忙等待触发恢复，纯回位等待不加计数。自身、护卫别名和连续反击的正常原生完成仍未闭合；未注入ready或手动弹动作来强行结束。

**事实**：HP先归零再经45/44/46/47/49移除目标；下一C会重建目标，已验证70→0、下一C58→0及最终移除，未把移除误记为HP缺失。44完成还会清理状态子节点，新独立模型继承时的该遗漏已修正；旧参考生成器与golden全部未改。两处旧“未实现96”的负向对端夹具改为仍未实现的262，独立Python对端与JS预期同步；历史证据不改写。初次完整源码912项中911通过，1个旧unsupported96对端失效；精确旧输入与日志已归档，修正为262后重跑完整912项。早期测试括号、seed字段/背景RNG及替代配置错误均保留日志。

命令：`python3 -B analysis/game-battle-special96-v1/verify_source.py`；`node --test --test-concurrency=2 shared/tests/legacy-game-battle*.test.mjs web/tests/legacy-game-battle*.test.mjs`；`node --test analysis/game-battle-special96-v1/portable-test.mjs`。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special96-v1/source-check.json)、[源修正](../analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special96-v1/test-results.json)、[验收边界](../analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：独立模型、当前回归和真实网页

**事实**：当前战斗887/887（63文件）、当前neutral生成包25/25、四套构建（651输入、34输出、0外部导入）通过。当前物理族本地TCP共220次：保留源码164、新源码20、生成20、实际页面16；16条桌面/触屏流程、84张截图，页面错误/警告/外联均为0。879个源码/模型/测试/对端输入稳定，含55个Python对端。未重跑全仓或历史生成套件。

**事实**：独立9120组队列、261条轨迹、58154帧状态、4812帧双selector完整RGBA及前后200动作/800tuple存储一致；256条自然收敛、1条244退出、4条等待1200帧。13条真实管理器中8个自然回合、4个超时恢复回合、1个退出；各命令与最终管理器分别计数，7201次忙等待触发恢复，纯回位等待不加计数。双护卫自然完成不等于此前211自身护卫正常完成已解决。

**事实**：24动画遗漏同时存在于产品和旧独立模型；15组旧参考全部重算，输入、队列、素材及几何不变，仅repeat-hit、repeat、reflect-guard-followup三条轨迹输出变化。3358份精确前修改工件已备份；211源核验在只读历史视图重验通过，原始与历史证据未改写。初期合成素材、独立模型对象/55动作、113前置解析、等待计数所属和跨realm数组断言问题均保留失败日志并按实际原因修正。

核验命令：`python3 -B analysis/game-battle-nested-physical-v1/verify_source.py`；`node --test --test-concurrency=2 shared/tests/legacy-game-battle*.test.mjs web/tests/legacy-game-battle*.test.mjs`；`node --test analysis/game-battle-nested-physical-v1/portable-test.mjs`。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](../analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：当前战斗单次全绿与恢复边界

61个当前shared/web战斗文件共862项单次全绿；当前生成包27项通过；四套构建643输入/34输出身份一致、无外部导入。当前物理族203次本机TCP：既有源码142、新源码22、生成22、实际页面17。17条桌面/触屏流程、89张截图，页面错误/警告/外联均为0；865个源码/模型/测试/对端输入稳定，含54个Python对端。未重跑全仓或历史486项生成套件。

2880组队列、175条轨迹、98543状态、6294帧完整RGBA及初末200动作/800tuple存储一致。92条身体收敛、2条244离场、81条等待链在1000帧内未自然收敛。13个实际管理器场景中9个正常回合、3个等待恢复后回合、1个离场。普通护卫观察在7204恢复、7208结束；自身别名为7203/7207。阈值是7201次busy调用，归位等待不递增，不能把恢复称作正常护卫命中。

首次完整源码862项中859通过、3个旧“self266 producer pending”原因断言失败，原日志、865身份与3份精确旧输入已归档；仅修改3处旧断言，定点3项通过后完整862重跑通过。产品、构建及当前生成包输入未因此改变。专项早期wire索引、RID同值断言和固定恢复帧号也已修正；未放宽产品解析或注入ready/状态。

命令：`python3 -B analysis/game-battle-self-physical-v1/verify_source.py`；`node --test --test-concurrency=2 shared/tests/legacy-game-battle*.test.mjs web/tests/legacy-game-battle*.test.mjs`；`node --test analysis/game-battle-self-physical-v1/portable-test.mjs`。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-self-physical-v1/source-check.json)、[源修正](../analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：完整当前战斗回归与等待边界

59个当前shared/web战斗测试文件共835项单次全绿，当前生成包33项通过；四套构建643输入/34输出核验通过，0external。当前物理族189次本机TCP（既有源码115、新结果源码27、生成27、页面20），20条实际桌面/触屏流程、104张截图，页面错误/警告/外联均为0。853个源码/模型/测试/对端输入身份稳定，包含53个Python对端。本轮未重跑全仓或历史486项生成包全套。

207360组独立队列、495条轨迹、57686个状态、7388帧完整RGBA及实际200动作/800tuple初末存储一致。486条身体收敛、3条预期244离场、6条重复治疗/自身73链在1000帧内未自然收敛。27个实际管理器场景中18个正常回合、6个在7203恢复后于7207结束、3个离场；不能把恢复当作正常播放闭合。

初次完整回归835项中833通过，2项由同一旧验收器把已支持1011当异常引起；修改前完整日志/853输入快照保留。只把该测试替换为真实多余尾字段拒绝，2项定向通过后重跑全部835项自然退出0；生成包33项和四套构建的实际依赖未变。TCP恢复验收最初误以为只恢复busy身体，已按原始wait的完整命令依赖mask修正，未改产品恢复逻辑。本轮无VM/原程序/账号/官服操作。

命令：`node --test --test-concurrency=2 shared/tests/legacy-game-battle*.test.mjs web/tests/legacy-game-battle*.test.mjs`；生成：`node --test analysis/game-battle-projectile-results-v1/portable-test.mjs`；源复核：`python3 -B analysis/game-battle-projectile-results-v1/verify_source.py`，依赖原件/保留REA/派生主函数/修改前精确历史副本。

**待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](../analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](../analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：当前回归、生成包及真实页面验收

57个当前shared/web战斗测试文件共802项通过，当前生成包27项通过；四套构建643输入/34输出身份核验通过。当前物理族150次本机TCP执行（既有源码94、新结果源码21、生成21、页面14）。14条真实桌面/触屏流程、74张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。

独立原创方程与实现对照179200组队列、301条轨迹、63085个状态、6100帧完整RGBA（双selector），初始/最终原始200动作格与800tuple格相同。300条身体收敛，1条预期244离场；19个真实命令管理器场景得到18个正常回合和1个离场，均无超时恢复。

源码命令：`node --test --test-concurrency=2 shared/tests/legacy-game-battle*.test.mjs web/tests/legacy-game-battle*.test.mjs`；生成：`node --test analysis/game-battle-physical-results-v1/portable-test.mjs`；源复核：`python3 -B analysis/game-battle-physical-results-v1/verify_source.py`。源复核依赖原件、当前build保留证据和精确历史副本；历史stage208校验在修改前副本上运行，当前模型另按源重验。

**待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。

[需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-results-v1/source-check.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：当前战斗回归与有限收敛边界

当前55个shared/web战斗测试文件共775项通过；当前生成包17项通过；四套构建639输入/34输出身份核验通过。当前物理族117次本机TCP执行（既有源码81、新护卫源码13、生成13、页面10）。10条实际桌面/触屏流程、54张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。

独立原创方程与实现对照16000组队列、227条轨迹、58109帧状态、5124帧完整RGBA（双selector），初始/最终原始200动作格和800tuple格也相同。223条身体收敛，1条预期244退出，3条别名/RID链在3000帧内未收敛；真实管理器在7203次回调触发已有恢复后结束，不能把恢复算作正常播放闭合。

源码命令：`node --test --test-concurrency=2 shared/tests/legacy-game-battle*.test.mjs web/tests/legacy-game-battle*.test.mjs`。生成包命令：`node --test analysis/game-battle-physical-guard-v1/portable-test.mjs`。源复核命令：`python3 -B analysis/game-battle-physical-guard-v1/verify_source.py`，依赖本地原件和build保留REA。

**待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：当前源码、生成包和实际页面

**事实**：REA6.7.0/Ghidra12.1.4新增10条精确指令观察（原件35B逐字节一致）；29个既有函数范围17465B复核。规范函数仍742，有限Evidence并集2455。4033b0先读limit再读counter并作有符号>=；403410的参数0不是重置值，而是读取后加1；4034f0第21次读取更换掩码。原件与历史源证据未改，REA已关闭、cleanup=false。

2243项源码测试通过（188文件）；486项当前生成包检查单次全绿（479 neutral API、7 App/Page）。四套构建631输入/34输出身份核对通过，无外部导入。物理族177次本机TCP执行（源码81、生成81、真实页面15）；14种桌面/触屏流程共15次执行、80张独立截图，页面错误/警告/外联均为0。

独立原创Python模型与实现对照64800正变体队列、132条新轨迹、19294帧状态、3664帧完整RGBA，双selector一致；132条均在观察内身体收敛。旧206的61920队列/879轨迹输出逐字节不变。原作程序本轮未执行，方程匹配不等于原生运行证据。

最初聚焦运行13项中2项为测试设定错误（慢放保留已删节点、72/113嵌套输入）；修正验收器后2项复跑通过，原失败日志保留，随后当前全量均自然退出0。源核验命令：`python3 -B analysis/game-battle-physical-specials-v1/verify_source.py`，需要本地原件与build保留REA材料。

**待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。

[需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：独立轨迹、生成包与实际页面验收

**事实**：复用REA6.7.0/Ghidra12.1.4保留证据，分层742规范函数、有限2445条Evidence均未增加。33个既有helper范围6634B映射至未改原件，12个完整case组及历史源核验以只读比较复核；Apple LLVM21.0.0独立核对419bd0双减法和420080世界坐标读。REA会话已关闭、cleanup=false。

2223项源码全量测试通过（186文件）。生成包全量运行469项，3项因验收器跨realm数组原型比较失败；只修正测试比较后，4项相关检查复跑通过，469个不同检查均有通过证据，原失败运行保留，未称单次全绿。四套构建的623输入/34输出身份一致；物理族161次本机TCP执行（源码69、生成69、页面23）完成，页面21种桌面/触屏流程、105张独立截图，错误/警告/外联均为0。

独立原创Python源方程生成61920队列、879轨迹、134538状态和16606帧完整RGBA，两种selector均逐项匹配；873轨迹身体收敛。自身73及重复目标各3条在3000次观察内保持未收敛，不能算成功回合；实际源码/生成包管理器均由wait counter>7200恢复这6条，未注入ready。原作可执行文件未运行，本机方程匹配不等于原生运行证明。

源核验命令：`python3 analysis/game-battle-physical-projectiles-v1/verify_source.py`（需要本地build保留原件与REA证据）。完整失败运行、验收器修正、聚合通过范围、自然退出回执和hash见test-results及source-corrections。

**待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。

[需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：当前源码、生成包与实际页面验收

**事实**：REA6.7.0/Ghidra12.1.4新增14规范函数（2991B），分层总数742；21个原件范围5189B逐字节吻合，有限Evidence并集2445（新增58），当前154条快照已关闭、cleanup=false。421f90/41a660在独立分析副本恢复为219/224B派生回调，不计规范函数，原件未改未运行。

全量2194项源码测试（184文件）、440项生成检查（433 neutral＋7 App/Page）、四套构建通过；615输入和34输出身份一致。108条本机OS TCP流程及18条实际桌面/触屏页面流程通过，92截图逐个hash，页面错误/警告/外联均为0。新增源码与生成回归各1项；本轮没有新增TCP场景。

独立Python模型按同一源证据修正并重跑11个生成器，4份期望状态JSON改变；原创资源字节、geometry、队列输入、场景数、状态帧与RGBA帧覆盖均保持。旧失败日志和历史验收保留；旧模型关于反应烟雾的随机偏移假设由本轮纠正，旧历史通过不代表该假设正确。

运行`python3 analysis/game-battle-physical-consumers-v1/verify_source.py`复核固定原件链（依赖本机build内原件和保留证据）。测试命令、自然退出回执、日志hash、输入身份和截图索引见test-results；没有把中途观察、派生代码或候选图当完整交付。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：有限公共物理实现的分层验收

固定旧样本37c4（`cg_se_6000.exe`，1569280B，SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`）沿用REA6.7.0/Ghidra12.1.4来源。本轮只读重核原PE、分层728个规范过程、2387条有限Evidence及最新95记录已关闭快照；没有新查询、没有重写历史证据。完整公共族来源仍未闭合。

本轮2193项Node测试/183文件、439项生成检查（432 neutral+7 App/Page）、四套构建615输入/34输出均通过。独立15995队列、75场景、17488完整建模状态、2358完整RGBA帧（双selector）；108条实际本地TCP流程验证540次正常启动请求、553包技能、110次查询、113条S、101次退出及202次战后移动。实际game.html桌面/触屏18流程、92截图，Chrome156.0.8078.80/Playwright1.64.1，页面错误/警告/外部请求均0。

运行`python3 analysis/game-battle-physical-family-runtime-v1/verify_source.py`复核固定源链（依赖本机build内固定原件和保留REA证据，交付源码不含原EXE或完整反编译缓存）；测试命令与自然退出日志哈希见test-results。首轮三处旧/新夹具假设已修正，次轮并发计时测试单独16项通过，最终完整2193检查限制文件并发为2；旧日志与被停止的过时生成检查均保留、不计入通过结果。最终439检查为连续完整运行。

**事实**：页面从实际文件选择/正常进入/技能/等级/目标走到Canvas、数值、回合、返回和移动，未注入ready/状态；92截图在工作区外并逐个hash。原创合成贴图只作验证，不表示原作美术还原。

正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：仅来源核验通过，公共物理实现待续

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增10规范函数3679B及44B常量核原件，重核公共生产者8618B、身体/构造67615B及分派器54685B指令。规范函数由718到728；本次95记录含54复用/41新增，有限快照并集由2346到2387，不能把规范缓存算成完整Evidence。45个旧大快照核完整哈希和身份并沿用逐对象JSON证明，另解析29/42/54三个小快照。会话已关闭、cleanup=false。

来源脚本同时检查原PE连续映射、完整函数范围与直接callees、六参数ESP/x87交接、有符号AL返回、16方向资源、x87截断控制字和旧快照有限身份。新增10个过程的直接callee均在分层728规范缓存中；此限定事实不表示整个公共族已经闭合。

运行`python3 analysis/game-battle-physical-family-v1/verify_source.py`可复核本次证据。

本轮新运行源码测试0、生成检查0、页面流程0；运行模块/导出/适配器/测试及native/vendor未改。已复核stage202构建607输入/34输出和日志身份；此前2142项Node、393生成检查、15页面流程是历史验收基线，本轮未重跑，未重复累计。只运行并通过当前来源核验脚本。

本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](../analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](../analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：82来源、生成和实际产品验收

新增48项，全量181文件2142项Node通过。四套当前构建核607输入/34输出身份、0external；393生成检查（386neutral/7App/Page）通过。独立1463队列、63场景16706完整建模状态和2404完整RGBA帧（两选择器）一致；47源停止、15身体结束与1空目标未证边界分开。97条最终真实本机TCP（41来源/41生成/15实际页面）核485启动、498技能包、99自动查询、102个S请求、90返回/180移动。81次独立截图、53个不同图像文件哈希位于源码外，均为原创合成资源；浏览器0错误/警告/外部请求。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4复用718规范函数，本轮0新增；核298B冲击辅助/回调、72B常量、352B中点表、70074B身体/构造/C原字节及54685/682B分派器/管理器指令。45个历史快照核完整哈希和身份集合并沿用逐对象JSON解析证明，另解析后续29/42记录快照；本轮54记录为11新增/43复用，有限快照并集从2335到2346。规范缓存和快照记录分开计数；会话关闭、cleanup=false，旧封存证据保留。

7项核心覆盖完整队列/16706状态/2404完整RGBA、真实管理器停止与回合、RID游标/骑乘/附件/一次数值更新、重复/0/符号边界、放大/隐藏/真实冲击/震动，以及空目标/getter/上下文/容量原子拒绝。全量2142当前测试和393当前生成检查均通过。

Playwright1.64.1/Chrome156.0.8078.80：1100×850桌面、390×844触摸，实际文件选择/升级/人物/技能/等级/目标与S/M、双方位置、资源、HP、下一C/停止返回/移动、暂停、空目标提示。最终15路径由11未受探针错误影响的成功路径与4修正后放大路径构成；产品身份相同。

初始参考误删效果容器而未删预有状态链接，按原指令改新参考后通过；首个TCP测试遗漏适配器，补显式导入后通过，均未为测试改变产品。最初4px假设不涵盖12px帧，已提高到17px并重测四条；通过OffscreenCanvas只读实际像素，0控制台警告。目视放大、RID目标61、后侧Hero58和空目标保持70/MP10，控件清晰、无水平溢出。

82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](../analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](../analysis/game-battle-skill82-v1/source-check.json)、[验证修正](../analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-skill82-v1/test-results.json)、[TCP](../analysis/game-battle-skill82-v1/network-validation.json)、[页面](../analysis/game-battle-skill82-v1/browser-validation.json)、[验收](../analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](../analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](../analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：独立状态/像素与实际页面验收

新增33项、全量179文件2094项Node通过。四套当前构建覆盖599输入/34输出身份，0external；生成验收共351项（344neutral/7App/Page），由326既有、24新TCP及1修正后的队列检查构成，初始验证脚本错误与重测日志单独保留。独立939队列含737支持/202明确拒绝边界；59场景核9387完整状态和1828完整RGBA帧（两选择器），区分31源停止、22身体结束、4特殊槽身体等待和2未证边界；phase2未交接4例，其中3已被源停止抢先结束、1仍在等待。最终61条真实本机TCP（24来源/24生成/13实际页面）核305启动、318技能包、63自动查询、66个S请求、48返回/96移动。69次独立截图、46个不同图像文件哈希在源码外，均为原创合成资源。浏览器0错误/0外部请求；3条Canvas读回性能提示来自验证器反复读像素，无其他警告。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增41f740/41f7a0共1598B，规范缓存由716到718；436530解析到已知436500，其202B只按复核。保留41f280的70B、独立播种41f250的33B、54685B分派器和682B管理器原指令、70074B身体/构造/C消费者均核原PE。45个历史快照核完整哈希和身份集合，沿用上轮逐对象JSON解析证明，另核上轮29记录无新增；本轮42记录为12新增/30复用，并集2335。独立播种不改规范计数；函数缓存与有限快照记录分开，旧封存证据未改写，会话已关闭且无待清理项。

9项新核心包括939队列、9387状态/1828完整RGBA、本地244下一回调停止、非本地删除/回合、旧屏幕/当前浮点/12访问残影/复制缩放、特殊槽大于7201回调恢复、零和等待及原子拒绝。生成最终覆盖326既有+24新TCP+1队列；队列初始误比对象键序，修正为结构比较后单独通过，无产品修改。

Playwright1.64.1/Chrome156.0.8078.80，1100×850桌面和390×844触摸模拟：13实际game.html路径均核正常文件输入/升级/人物/技能/等级/目标和真实TCP。12已成功路径与修正后的独立KO路径组成验收集合，输入/产品身份一致。首次返回验证误比已关闭battle与普通world的不同serial，KO首次误等回合后角色删除；初始日志保留。3条getImageData性能提示归验证读回，不抹成0警告。

目视移动残影、治疗82、非本地82回合、KO0和特殊槽70等待，控件/HUD可读，无水平溢出，允许纵向滚动。ROI仅对独立路径像素检测跨度，不冒充原游戏画面。

非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](../analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](../analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](../analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](../analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](../analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](../analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](../analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：数值、反射、像素与实际页面验收

35新增/2061全量Node、四套构建/326生成检查（319neutral/7App/Page）通过；595输入/34输出身份一致，0external。独立3类十等级、2317队列、157场景16447完整状态、3250完整RGBA帧（两选择器）一致；154场景身体结束、151场景命令结束，6个源phase2等待单独保留。71条最终验收用真实本机TCP（28来源/28生成/15实际页面），核355启动、368技能包、73自动查询、76个S请求、60正常返回/120移动；初始观察不重复计入。78次独立截图在源码外，对应43个不同图像文件哈希；均为原创合成资源，浏览器0错误/0警告/0外部请求。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4复用716规范函数，本轮无新增规范函数；重新查询41b6a0并核其62B，另复核70074B身体/构造/C消费者及54685B分派器原指令。45个历史快照逐条JSON解码并核完整哈希，再与流式身份检索交叉核验，实际不同Evidence记录并集为2323；历史累计2400多计77，首次引入位置尚未查明。当前29记录均已复用，无新增不同记录。函数缓存数和有限快照记录数分开，旧封存证据未改写；会话已关闭且无待清理项。

完整177个测试文件共2061项通过，新增7核心与28来源TCP；独立参考无产品模块导入，逐帧比较16447状态及两选择器3250完整RGBA。零和3场景身体完成但命令继续等待，重复反射3场景还保留身体等待；另用真实命令管理器700步验证未虚报回合。

浏览器Playwright1.64.1/Chrome156.0.8078.80：1100×850桌面与390×844触摸模拟，实际文件选择/升级/人物进入/技能/等级/目标、费用/HP、反射/KO、下一C/返回/恢复移动、暂停与零和等待均通过。已目视扣血58、治疗82、反射施术者82及零和等待截图，控件可读、无水平溢出；正常纵向滚动。细小点阵来自原创资源，未声称原游戏画面等价。

共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](../analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](../analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](../analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](../analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：独立状态、真实请求与实际页面验收

59新增/2026全量Node、四套构建/297生成检查（290neutral/7App/Page）通过；587输入/34输出身份一致，0external。独立36类十等级、2912队列、416场景12775状态、6384完整RGBA帧（两选择器）一致。115条最终验收用真实本机TCP（51来源/51生成/13实际页面），核575启动、591技能包、117自动查询、123个S请求、109正常返回/218移动；初始观察不重复计入。71张原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增3规范函数595B，另1个105B函数已在旧缓存、按复用核验；3个独立播种回调1170B、400B常量、额外64B第六组贴图表、70074B既有身体/构造/C消费者、133B贴图助手及54685B分派器指令核原PE。累计716规范函数/2400条有限快照记录并集；当前26记录为22新增/4复用，44个历史快照核身份。函数缓存与快照记录是两种计数，会话已关闭且无待清理项。

新8核心+51来源TCP，完整175个测试文件共2026项通过。新旧施法核心21项亦通过；旧213场景参考因构造器2标记修正重算。浏览器Playwright1.64.1/Chrome156.0.8078.80、桌面1100×850和390×844触摸模拟，正常文件选择/升级/人物进入/技能/等级/目标/M/回合/下一C/返回/移动/暂停均由实际页面驱动。

首13功能流程通过；3张900ms粒子时刻截图可能仍为咏唱，仅补验clear/class68/self-reset，以真实画布ROI出现像素为条件，分别观测9/13/13像素。产品与输入身份不变，最终13组合保留71独立截图。已目视新67上升粒子、手机68下落粒子、86全屏表和field-C第二轮，无重叠/水平溢出；细小点阵来自原创资源，正常纵向滚动。

本轮0 VM/CUA/原程序执行/官方会话；上述证据不等于完整游戏或实际设备通过。其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](../analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-status-skills-v1/test-results.json)、[TCP](../analysis/game-battle-status-skills-v1/network-validation.json)、[页面](../analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：静态、独立、生成和实际网页证据分层

38新增/1967全量Node、四套构建/245生成检查（238neutral/7App/Page）通过；579输入/34输出身份一致，0external。独立4686队列、213回调场景25917状态、6078完整RGBA帧（两呈现选择器）、294寻向和180个有符号CRT边界通过。60新真实本机TCP含10实际网页鼠标/触摸流程，核300启动、313技能包、2个1101标签包、62自动查询、65个S请求、53次正常返回/106移动；52张验收用独立原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增8规范函数2645B，另核5个独立播种回调7520B、400B常量和16B原文件常量，并复核4260b0分派器54685B指令；累计713规范函数/2378不同记录并集。当前40记录全部新增，43个历史快照核身份；REA会话已关闭且无待清理项。40记录快照不是完整并集。

浏览器为Playwright1.64.1/Chrome156.0.8078.80，真实game.html文件输入、桌面鼠标和390×844触摸模拟，经实际DOM技能/等级/目标控件进入回调，核施法像素、MP/HP、暂停/下一C/返回。已目视最终手机施法、桌面31结果和手机RID结果截图，无重叠/水平溢出；资源均为原创夹具，正常纵向滚动。首次10功能流程成功但像素探针产生9条性能警告；仅改验收探针到带willReadFrequently的离屏ROI，最终0警告，保留首次记录但不计入52张验收截图。

本轮0 VM/CUA/原程序执行/官方会话。上述分层验证不等于完整游戏或真实平台验收。自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[规格](../analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](../analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](../analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-casting-v1/test-results.json)、[TCP](../analysis/game-battle-casting-v1/network-validation.json)、[页面](../analysis/game-battle-casting-v1/browser-validation.json)、[验收](../analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](../analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：人物技能来源、生成和实际页面验收

31新增/1929全量Node、四构建/218生成检查（211neutral/7App/Page）通过；571输入/34输出身份一致，0external。45独立完整接收状态、14输入场景781状态、110个有符号MP计算边界通过。32新真实本机TCP含6实际页面，核160启动、177技能接收包、34自动查询及37个S请求；25次正常返回、25退出/50移动，27张原创夹具截图在源码外。

完整171个测试文件，18新增核心+13来源TCP；四构建实际输入逐项核验。neutral生成API211检查另含45完整接收状态/110整数边界及13新实际TCP，另7为既有App/Page。首次全量两个失败来自旧skill未支持断言及KO已删身体读取；修正后进一步确认池已实际释放，最终1929全通过。neutral比较做跨VM数组归一化，独立期望字节/数值不变；旧加载的生成脚本已中断留痕，初轮曾按身份复用四构建；最后修复实际接收竞态后重新生成全部四构建并跑完整218项，旧构建/中断只作历史记录，不计当前通过。

Chrome156.0.8078.80/Playwright1.64.1，实际game.html文件选择/正常升级与入场/技能等级/目标/回包/下一C/普通返回移动，桌面与移动触屏仿真6条；无Browser插件，使用已有Playwright。页面身份/非空/无错误覆盖层/console与page健康/控件交互全部通过，0错误/警告/外部请求。27捕获外部留存并核hash，实际查看移动等级、桌面双目标结果及更新后的下一C等级，未见重叠/横向溢出；资源全部原创夹具，非原游戏美术等价证据。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增10规范函数2175B；19个独立播种回调6651B、1032B常量及既有4260b0分派器54685B指令核原PE。累计705规范函数/2338记录并集；当前48记录含3复用/45新增，42个历史快照核身份，会话已关闭。48记录快照不是完整并集。

完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-player-skills-v1/source-check.json)、[测试](../analysis/game-battle-player-skills-v1/test-results.json)、[TCP](../analysis/game-battle-player-skills-v1/network-validation.json)、[页面](../analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-player-skills-v1/goal-audit.json)。


<a id="stage196"></a>

## stage196：独立方程、当前全量与实际画布验收

51新增/1898全量Node、四构建/203生成检查（196neutral/7App/Page）通过；567输入/34输出身份一致，0external。16独立MON场景1864状态、13输入场景673状态、240独立缩放策略像素用例通过；MON同时核两呈现选择器，共3628个像素结果，100个alternate未支持结果。32新真实本机TCP含6实际页面，核160启动、210宠物接收包、42输入（27 M|1、8 M|FF、3 W|FF、4 N）、25退出/50移动及25次正常返回；25张独立原创夹具截图在源码外。

最终Node枚举全部169测试文件；首次1897中两处旧TCP仍要求49后活体，依据源证据校正并保留失败日志，最终包含额外paired-absent边界的1898项全通过。四构建逐项核567当前输入/34输出，203生成检查中196为neutral共享API，另7为既有App/Page；生成检查也完整比较16 MON参考场景和真实13条新TCP。

Chrome156.0.8078.80/Playwright1.64.1使用实际文件输入、正常升级、宠物按钮/触摸、真实MON/下一C/W、暂停及普通返回移动。当前工具清单无Browser插件，使用已安装普通Playwright；零console/page错误/警告/外部请求，25捕获路径互异且已外部留存。逐个实际paint核呈现serial/selector，读帧不冒充呈现。静态、策略像素、本地产品、原生设备和官方证据分层。完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](../analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pet-transition-v1/source-check.json)、[测试](../analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](../analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](../analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](../analysis/game-battle-pet-transition-v1/goal-audit.json)。


<a id="stage195"></a>

## stage195：独立参考、真实回环与实际按钮验收

36新增/1847全量Node、四构建/173生成检查（166neutral/7App/Page）通过；555输入/34输出身份一致，0external。15独立场景833输入状态、53完整接收记录状态通过。38新真实本机TCP含6实际页面，核190启动、120宠物接收包、86输入（34 W|FF、28 W|0|A、5 W|1|0、3 W|2|29、10 G、6 N）、31退出/62移动与31次正常返回；24张独立原创夹具截图在源码外。

最终Node运行枚举全部164测试文件；初次沿用194显式列表只跑1811的记录保留，不当1847全量证据。构建检查逐项核555当前输入与34输出哈希/外部导入；生成版166neutral+7App/Page均通过。来源与生成版各一次取消W像素读取重试、一次重入、一次失败读取及关闭，实际请求无重复。浏览器Chrome156.0.8078.80/Playwright1.64.1，1100×850及390×844触摸模拟，零console/page错误/警告/外部请求。

截图复核修正旧操作提示，并修复反馈轮截图文件名重复；最后24个捕获路径互异、哈希核验，全部原创夹具且在源码外。静态源字节、测试、构建、本地产品运行与设备/官方证据分层记录。完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](../analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](../analysis/game-battle-mounted-input-v1/source-check.json)、[测试](../analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](../analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](../analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](../analysis/game-battle-mounted-input-v1/goal-audit.json)。


<a id="stage194"></a>

## stage194：CBC状态/像素、真实网页与深度回归

50新增/1811全量Node、四构建/157生成检查（150neutral/7App/Page）通过；551输入/34输出身份一致，0external。32独立场景1010状态/完整640×480RGBA通过；36新真实TCP含8实际页面，核180启动、39输入（36个G/3个H|A）、27退出/54移动、27次正常返回。24张原创夹具截图在源码外。

新增36核心/14源TCP；CBC包含22槽、raw/归一化差异、4有符号值、骑乘存在/0/负值规则、附着复用/删除、入场/死亡/quarter。浏览器Playwright1.64.1/Chrome156.0.8078.80，1100×850桌面/390×844触屏仿真，8流程无控制台错误/警告/外部请求。Browser插件未提供，沿用本地Playwright。

初次独立节点工厂重复drawPriority、输入依赖误认会使客户端failed、下一C的敌方max值期望错误均已按真实结果修正；本地骑乘输入缺口保留负向验证。审查发现alternateY遗漏后，独立参考先复现10失败，再修实际owner并重跑源/生成/产品；全量首轮1810/1811的旧挂载输入夹具使用资源1，改用真实原创挂载资源，原依赖断言保留。失败日志完整留私有build，无VM/CUA/原程序/官方会话。完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-character-change-v1/source-check.json)、[规格](../analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-character-change-v1/test-results.json)、[TCP](../analysis/game-battle-character-change-v1/network-validation.json)、[验收](../analysis/game-battle-character-change-v1/validation.json)、[剩余目标](../analysis/game-battle-character-change-v1/goal-audit.json)。

<a id="stage193"></a>

## stage193：50场景1917RGBA、两轮页面与全量验收

70新（56核心/12源TCP/2桥边界）与1761全量Node通过；四构建142生成（135neutral/7App/Page）、547输入/34输出身份核对，0external。独立Python50场景1917状态与1917完整640×480RGBA覆盖22位置有/无配对、死亡两侧、quarter门限与3装备资源变更；既有物理后PSN真实复现角度修复、归一化/资源信号和容量/字段边界另验。

31新TCP核39输入、24退出、48移动；7实际game.html通过真实资源文件选择、正常升级/选人和实际按钮到换位/装备/混合/下一C/返回。Chrome156.0.8078.80、Playwright1.64.1；1100×850桌面/390×844触屏仿真，0控制台错/警告/外部请求。Browser插件未提供，使用既有Playwright；21张原创夹具截图在源码外。

初次TCP固定56帧假设被C flags1真实入场推翻，改为等真实phase4；页面两轮捕获BRIDGE_TIMEOUT，修复真实本地桥的有界时长配置并以实际到期断流验清理。全量首轮1760/1761：旧夹具覆盖表误等同全部动作，改成保留覆盖子集，旧帧比较不变，target回归和最终1761全量通过；失败日志均保留。无VM/CUA/原程序/官方会话。完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-change-v1/source-check.json)、[规格](../analysis/game-battle-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-change-v1/test-results.json)、[TCP](../analysis/game-battle-change-v1/network-validation.json)、[验收](../analysis/game-battle-change-v1/validation.json)、[剩余目标](../analysis/game-battle-change-v1/goal-audit.json)。

<a id="stage192"></a>

## stage192：PSN算术、2152RGBA与真实页面验收

38新（27核心/11真实源TCP）与1691全量Node通过；四构建/129生成（122neutral+7App/Page）通过，543输入/34输出身份核对，0external。21独立Python场景逐状态比对2152次，并对全部2152真实资源完整640×480RGBA比摘要；735有符号整数边界另验。

29新真实TCP=11源+11生成API+7实际game.html，核34输入/22退出/44恢复移动。源与生成均验证结算像素读取取消重试、重入、关闭、读失败，两个暂停重试不重算值；新C覆盖与三类串联成立。页面以真实文件选择、正常升级/选人、实际PSN/C/M到HUD/返回/移动；Chrome156.0.8078.80、Playwright1.64.1，1100×850桌面/390×844触屏仿真，0控制台错/警告/外部请求。Browser插件未提供，沿用既有Playwright。

20张原创夹具截图在源码外。初次夹具重复glyph ID、未对齐宽度、内部模块导入和测试循环断言，以及浏览器人物资源合并顺序的问题均已纠正；失败日志保留，未用产品放宽处理。4新规范函数/126B、原派生54685B及有效快照/关闭分别核；本轮0 VM/CUA/原程序/官方会话。完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-status-v1/implementation-plan.json)、[源核验](../analysis/game-battle-status-v1/source-check.json)、[规格](../analysis/game-battle-status-v1/implementation-spec.json)、[测试](../analysis/game-battle-status-v1/test-results.json)、[TCP](../analysis/game-battle-status-v1/network-validation.json)、[验收](../analysis/game-battle-status-v1/validation.json)、[剩余目标](../analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：真实网页战斗、像素与释放验收

3新增（2viewport门禁/上下文、1实际Canvas OS TCP取消意图）/1653全量Node通过；四构建/117生成检查（110neutral+7App/Page），539输入与34产物身份一致、0external。新neutral两项为构造/关闭/无隐式IO边界，完整呈现语义以真实浏览器和源测试为证，不扩大为原生微信验收。

14次实际产品流程包括12主场景和2独立Canvas，另7次普通页面回归、2次改前基线，共23次；桌面1100×850与390×844触屏仿真、Chrome156.0.8078.80/Playwright1.64.1，0控制台错误/警告/外部请求。完整640×480 Canvas与独立Python9种参考中的对应摘要一致，稳定live区域在回调继续时没有反复DOM改写。45张原创夹具截图置于源码外。15新战斗TCP核75启动请求、16输入/10退出/20恢复移动；真实文件错误/资源等待/不支持动作/暂停/重入/pagehide分别验收。

最初断言使用getByRole查终止后已隐藏的攻击按钮，9场景已过后超时；改为检查该隐藏且disabled的DOM控件，原报告和日志留存。源数据/消费者无放宽。固定样本与6组既有REA证据身份重核，675规范/2210记录复用，native query=0；0 VM/CUA/原程序/官方会话。实际手机目录选择/网络/设备、完整玩法、原生微信/现行与官方仍未验收，目标active。

[来源核验](../analysis/game-battle-web-v1/source-check.json)、[规格](../analysis/game-battle-web-v1/implementation-spec.json)、[测试](../analysis/game-battle-web-v1/test-results.json)、[实际页面](../analysis/game-battle-web-v1/browser-validation.json)、[位图核验](../analysis/game-battle-web-v1/canvas-browser.json)、[网络](../analysis/game-battle-web-v1/network-validation.json)、[验收](../analysis/game-battle-web-v1/validation.json)、[目标审计](../analysis/game-battle-web-v1/goal-audit.json)。

<a id="stage190"></a>

## stage190：物理攻击状态、像素和客户端验收

33新增（19核心+14源TCP）/1650全量Node通过；四构建/115生成检查（108neutral+7App/Page），539输入/34产物身份一致、0external。独立Python13组3137回调状态和3137完整640×480 RGBA逐项核对，包括暴击/闪避/无伤/负数/KO/前置受击/MP下限/多段/反击/慢效果门控；使用原创合成资源，没有把原生运行当已验证。

28新实际OS TCP核10726战斗/返回帧、1144普通帧、32准确攻击、22退出与44移动请求；22次成功返回、真实新C数值覆盖、2命中取消重试、2重入、4旧命中帧取消和2读取失败通过。静态24新/675规范、2210记录，19781新增read字节及8B保留浮点、536派生指令字节均核原件。

初次独立参考补齐源11的跳跃/死亡分支和角度存储舍入，puff逻辑owner不等于原生父指针；原创字体宽度曾落入未证明行步幅，已改原创宽8/12，未放宽解析器。TCP夹具修正同帧意图冲突、重入MP事件计数；旧SKL回归更新为真实缺目录原因，保留环/轮次/不推进断言。失败日志保留。REA新快照校验失败，完整export和675函数档案保留，会话已正常关闭；0新产品浏览器流程/截图、VM/CUA、原程序、DevTools/设备和官方会话。完整目标active。

[源证据](../analysis/game-battle-skill-v1/source-check.json)、[规格](../analysis/game-battle-skill-v1/implementation-spec.json)、[测试](../analysis/game-battle-skill-v1/test-results.json)、[TCP](../analysis/game-battle-skill-v1/network-validation.json)、[验收](../analysis/game-battle-skill-v1/validation.json)、[目标审计](../analysis/game-battle-skill-v1/goal-audit.json)。

<a id="stage189"></a>

## stage189：实际普通返回、淡入和输入恢复验收

18新增（7核心+11源TCP）/1617全量Node、18焦点通过；四构建/101生成检查（94neutral+7App/Page），531输入/34产物身份核验、0external。源状态86步/保留type13的54步参考，返回中普通回调仅在重建和20/3推进；未加入调用者initialized/ready。

22新增OS TCP核5390战斗/返回帧、936返回后普通帧、1004独立返回RGBA，18个实际返回playing共36准确移动请求；24准确G/24退出请求、48受限unit/action与24独立removal、4取消重试、2返回中重入、4依赖检查、2资源读取故障通过。静态2134记录、651规范函数；新457B与独立callback1515指令字节核原件，快照和会话已关闭。

初次整合暴露whole-world快照重入，已改为只读网格中心；初始错误码被笼统包装也已改为保留具体码。夹具两次错误分别为显示中心偏移、期待尚未发送的网络修正；已按独立移动参考修正，四份失败日志保留。source验证曾错误要求伪代码显示thiscall ECX参数，已以真实汇编/xrefs断言，不更改证据。无新增产品UI截图/浏览器流程/DevTools/设备/官方会话；完整目标active。[源证据](../analysis/game-battle-return-v1/source-check.json)、[规格](../analysis/game-battle-return-v1/implementation-spec.json)、[测试](../analysis/game-battle-return-v1/test-results.json)、[TCP](../analysis/game-battle-return-v1/network-validation.json)、[验收](../analysis/game-battle-return-v1/validation.json)、[目标审计](../analysis/game-battle-return-v1/goal-audit.json)。

<a id="stage188"></a>

## stage188：退出复制、真实请求和生命周期验收

18新增（7核心+11源TCP）/1599全量Node、18焦点通过；四构建/89生成检查（82neutral+7App/Page），527输入/34产物核身份，0external。105源独立渐变步/50400可见行状态/32裁剪通过，垂直行0确实不复制。

22新增OS TCP/3326实际资源帧，1008次独立退出RGBA，24输入和16准确$!~ int0退出请求；捕获不受调用者/裁剪影响，4次取消不重放，重入/关闭、嵌入名称CHT依赖、实际main10 ACK和2次退出写故障通过。静态12段7055B含新561B核原件；2115记录、648规范入口和快照已保存/关闭。

初次U测试夹具在ACT已加轮次后发送旧轮次A，正确未标记却被夹具错误期待；已改到递增前发送并校验round0，失败17pass/1fail原日志/回执保留。中止扫描和参数前检复核后重新核构建输入与测试，旧验证日志/回执分别保留。退出到9/1后仍非普通playing，完整普通池/数值/重建、SKL/菜单/产品控件、其他玩法/设备/现行/官方未完成，整体active。[源证据](../analysis/game-battle-exit-v1/source-check.json)、[规格](../analysis/game-battle-exit-v1/implementation-spec.json)、[测试](../analysis/game-battle-exit-v1/test-results.json)、[TCP](../analysis/game-battle-exit-v1/network-validation.json)、[验收](../analysis/game-battle-exit-v1/validation.json)、[目标审计](../analysis/game-battle-exit-v1/goal-audit.json)。

<a id="stage187"></a>

## stage187：自动M和实际回合反馈验收

16新增（7核心+9源TCP）/1581全量Node、16焦点通过；8独立场景33调度步骤覆盖ACT合并/并行、空M、END、回绕和未支持SKL。PNO实际队列/动画/busy结束、6请求2不提前消费C、下一轮A与M环边界已核。

四构建/77生成检查（70neutral+7App/Page）；519输入/34产物一致、0external。18新增OS TCP、30准确输入请求、2518实际资源帧；1120入场像素比较沿旧独立参考，未增加独立动作UI像素验收。像素重试不重放clock/回调/M，两侧重入/关闭清旧任务；无新产品UI/浏览器流程。静态6段10104B核原件，642规范入口，2088记录及快照已保存/关闭。退出返回、完整动作/菜单/产品/设备/现行/官方仍未完成，整体active。[源证据](../analysis/game-battle-loop-v1/source-check.json)、[规格](../analysis/game-battle-loop-v1/implementation-spec.json)、[测试](../analysis/game-battle-loop-v1/test-results.json)、[TCP](../analysis/game-battle-loop-v1/network-validation.json)、[验收](../analysis/game-battle-loop-v1/validation.json)、[目标审计](../analysis/game-battle-loop-v1/goal-audit.json)。

<a id="stage186"></a>

## stage186：基础输入、请求和失败路径的验收

19新增（6核心+13源TCP）/1565全量Node、19焦点通过；240目标掩码、180目标编码、10独立场景392步骤/18请求。源/生成各13新OS TCP，合计26条/42准确输入请求/2610实际资源帧，1568入场帧核旧独立RGBA；完整输入UI/原生命中像素未验。双方各一次取消重试和一次明确wx.write失败，重入、旧意图、A标记累计及正链接13b4依赖通过。

四构建，60neutral+7App/Page=67通过；三App135输入/11产物、API110输入，515输入和34产物身份一致/0external。静态45段17405B、13派生回调4446指令字节核原件；2074记录与506614267B快照已关闭并私留build。

M5/6、退出7/8/9、完整菜单/技能/道具/宠物/坐骑/观察/音频/命中、实际战斗页面/触屏、完整其他玩法、原生微信gamePage/DevTools/设备及现行/官方仍未完成。整体active，原战斗阶段/186均phase_complete=false。本轮0 VM/CUA/原程序/账号/官方会话；没有测试账号。[源证据](../analysis/game-battle-input-v1/source-check.json)、[规格](../analysis/game-battle-input-v1/implementation-spec.json)、[测试](../analysis/game-battle-input-v1/test-results.json)、[TCP](../analysis/game-battle-input-v1/network-validation.json)、[验收](../analysis/game-battle-input-v1/validation.json)、[目标审计](../analysis/game-battle-input-v1/goal-audit.json)。

<a id="stage185"></a>

## stage185：入场与自动C验收范围

19新增（8核心+11源TCP）/1546全量Node通过，19项焦点通过。独立54fade调用/25920行速度偏移、16裁切、12场景805步/804完整入场RGBA核对；源/中立生成API各11新OS TCP，共22条/1390帧，覆盖C时点、到位、M等待、取消重试无逻辑重放、旧场景交接、reentry、失败与关闭。四新构建、46neutral+7App/Page=53通过；三App134输入/11产物，API109输入，511输入与34产物身份核验、0external。

固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4，52新记录/6规范函数，619总数；20段10668B（14新read记录7062B）与原件相符，1915记录快照已关闭、私留build。没有新产品UI/浏览器流程/图片，旧stage180证据保留。输入、弹窗/选择、M5/6、退出7/8/9及地图返回、完整其他动作/玩法、网页实际战斗页面、微信原生gamePage/设备和现行/官方兼容仍未完成。

整体active、原战斗阶段/185均phase_complete=false；没有真实测试账号。本轮0新VM/CUA/原程序/账号/官方会话，旧诊断不重放。[源证据](../analysis/game-battle-entry-v1/source-check.json)、[规格](../analysis/game-battle-entry-v1/implementation-spec.json)、[测试](../analysis/game-battle-entry-v1/test-results.json)、[TCP](../analysis/game-battle-entry-v1/network-validation.json)、[验收](../analysis/game-battle-entry-v1/validation.json)、[目标审计](../analysis/game-battle-entry-v1/goal-audit.json)。

<a id="stage184"></a>

## stage184：基础战斗frame验收范围与未完成项

已通过13新增（8核心+5源TCP）/1527全量Node；焦点20项含12旧body回归。独立36排序案例、20轨迹1994帧中1835完整RGBA相符，159缩放/混色帧明确报未支持；实际源/生成API各5条OS TCP，合计422渲染帧/420回调，五正常启动请求及暂停/恢复/取消/关闭/读失败清理均核。四新构建，34neutral+7App/Page=41通过；三App132输入/11产物，API107输入，503输入与34产物身份一致，0external。

固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4；33新记录中7新规范函数/1已知复查，613规范总数，8段4014B原件一致、旧派生96B重核；1863记录快照私留build，session已关闭。无新UI/浏览器流程/图片；stage180旧证据保留，不算本轮。测试夹具适配器/视口及独立Python递归预算修正记录保留。

原战斗阶段及stage184仍phase_complete=false，完整目标active。显式基础像素不是产品战斗可玩验收；自动main10/渐变/C/M、完整动作、输入/退出返回、缩放/混色/捕获生命周期、微信原生gamePage/设备、现行/官方兼容均未完成。0新VM/CUA/原程序/官方会话。[源证据](../analysis/game-battle-scene-v1/source-check.json)、[规格](../analysis/game-battle-scene-v1/implementation-spec.json)、[测试](../analysis/game-battle-scene-v1/test-results.json)、[TCP](../analysis/game-battle-scene-v1/network-validation.json)、[验收](../analysis/game-battle-scene-v1/validation.json)、[目标审计](../analysis/game-battle-scene-v1/goal-audit.json)。

<a id="stage183"></a>

## stage183：1994步body轨迹、1514测试与14条TCP

12核心+7源TCP新增，19新增/1514全量Node通过。20组1994步原创独立Python数值/动画元数据轨迹覆盖所列23类type；另48角度/朝向、20查表运动和1024 CRT值。C末尾辅助动画、未舍入x87高度、子对象预删除、四拍门控、同次插入、脱槽、231 busy清除、55帧重置、244停止延后一拍、209未实现保护均核验。

四新构建通过，最终28neutral+7App/Page=35检查通过。七条源/七条生成API实际OS TCP，共14新路/1238回调、每路9次真实资源读取和5请求核对；均正常关闭。499次构建输入身份、34个产物身份相符。没有本轮战斗像素/背景/阴影或产品UI验收，没有新浏览器流程/截图；旧stage180两流程6图只保留历史。

REA74新记录/21新规范/1已知466820复查，585→606，30复用；17段67476B、源360sin/旧65方向值、新独立169/旧55491派生指令B与原件一致。1830记录/489276177B快照私留build，open=false、cleanup_pending=false。固定37c4的调用级验证不构成完整battle或现行/官方兼容，phase_complete=false。[测试](../analysis/game-battle-body-v1/test-results.json)、[TCP](../analysis/game-battle-body-v1/network-validation.json)、[验收](../analysis/game-battle-body-v1/validation.json)、[交付审计](../analysis/game-battle-body-v1/delivery-audit.json)。

<a id="stage182"></a>

## stage182：1495测试、四构建与命令调用证据

21项新增/1495项全量Node通过（18核心+3源TCP新增）；12组原创队列例及并发32槽/bit31、冲突的部分预约、coalesce、22计数延迟、回收/旧handle、199+sentinel、7200/7201、C死亡历史、END/EOF/round回绕和真实尾扫描均覆盖。源码复核修正末尾标点扫描游标及C新角色构造后强制队列初始化，单字节提前返回/新死亡角色均单列回归。死体SUP等待跳过是源行为，未把它改成强制等待。

四个stage182新构建通过，生成API的21neutral与7App/Page共28项通过；3条源/3条生成API新增实际OS TCP覆盖queues/end/eof。三App各128输入/11输出，API103输入/1bundle；487次源身份和34产物身份一致，external_imports=0。原生微信游戏Page、设备与官方验收均false。无UI变化，未运行新浏览器流程，旧stage180两流程6图保留。

REA新增27记录/10新规范入口/1已知重查，复用25dossier；5段1109B、缓存520B方向表及旧派生55491指令B重核原件一致，575→585，1756记录/482967273B快照私留build，open=false、cleanup_pending=false。所有事实限定固定37c4，不移用到现行样本。原战斗阶段及整体仍未完成。[测试明细](../analysis/game-battle-commands-v1/test-results.json)、[网络](../analysis/game-battle-commands-v1/network-validation.json)、[阶段验收](../analysis/game-battle-commands-v1/validation.json)、[交付审计](../analysis/game-battle-commands-v1/delivery-audit.json)。

<a id="stage181"></a>

## stage181：字段/依赖、静态导出和构建核验

11项新增/1474项全量Node通过；582条原创独立用例覆盖24token、131个SKL类别和55别名，另验RID回退、原始槽区别、字节计数回绕与1023命令边界。源模块/中立生成API各2条实际OS TCP，共4新路径，核正常五请求、M字段/名字/依赖一致、环未消费及关闭。18neutral/7生成检查和四构建通过；三App各126输入11输出，API101输入，0external。

固定旧样本SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`、1,569,280B，REA6.7.0/Ghidra12.1.4。新增48记录/24规范函数，551→575，复用18份旧dossier；9段1944B与原件相符。1729记录/478576202B快照留build，open=false、cleanup_pending=false。 默认未识别的4365d0/4260b0/4198d0在独立分析副本补建入口，导出682/54685/96B；另435000仍报告28B。四体55491指令字节全部等于原件，属于分析者播种的派生边界，不计入24个规范REA函数。435000另以461B原始范围和LLVM21核对所有非调用分支闭合，未宣称修好provider边界。 三个缺失回调的静态导出成功不证明运行、完整动作语义或图像。582条是原创构造参考，不是真实服务器会话。先前1473结果及构建日志保留，最后修正包命令预算后1474/25重新通过。

[源证据](../analysis/game-battle-runtime-v1/source-check.json)、[规格](../analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](../analysis/game-battle-runtime-v1/test-results.json)、[TCP](../analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](../analysis/game-battle-runtime-v1/validation.json)、[完整目标](../analysis/game-battle-runtime-v1/goal-audit.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：战斗接收基础核验与未完成事项

17项新增/1463项全量Node通过。原创独立240条C消息/820记录/7数字边界与22槽源表核对；源模块与中立生成API各2条实际OS TCP，共4条，验证正常五请求、实际入场/队列/显式消费/回绕与关闭，没有战斗图像或动作执行验收。16neutral/7生成检查、四构建通过；三App各123输入11输出，API98输入，均0external。 Chrome156.0.8078.80/Playwright1.64.1实测桌面1100×850和触屏390×844两条game.html流程，真实Files/正常人物升级选择/入场/持续收包/断开通过，6张原尺寸截图全部复核，0应用错误、警告、外部请求和横向溢出。Browser插件缺席，复用现有Playwright。stage179的15浏览器流程证据保留，本轮未重跑，不能合计为本轮17条。

固定37c4样本SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`、1,569,280B，REA6.7.0/Ghidra12.1.4。复用18份旧dossier，新增56记录/28规范函数，523→551；8段5946B与原PE逐字节相符。1681记录/451623812B快照留build；会话已关闭，open=false、cleanup_pending=false。 40a120回调62,225B已保留完整伪代码/汇编，但native value flow截断；M管理回调4365d0未被Ghidra识别为函数，1808B原字节及LLVM21静态COFF逐指令核验不构成完整CFG。P/A初始零来自PE .data零填充推导，不是运行时观测。原生越界copy/指针不复现，安全profile限制C/M最多4095B；完整C身体/特效副作用未声称实现。 静态数表/原创字节参考/真实TCP/生成包/实际浏览器各层单列；没有战斗图像摘要、原生设备或官方会话验收。

[源证据](../analysis/game-battle-transition-v1/source-check.json)、[规格](../analysis/game-battle-transition-v1/implementation-spec.json)、[测试](../analysis/game-battle-transition-v1/test-results.json)、[TCP](../analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](../analysis/game-battle-transition-v1/validation.json)、[完整目标](../analysis/game-battle-transition-v1/goal-audit.json)。

**阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：图标、组队字节、实际页面及构建验收

18新增/1446全量Node通过。独立Python覆盖960图标、5376命令、3009锚点及128完整场景/65种RGBA SHA。源模块和中立生成API各2条实际原创OS TCP，共4新路径/256帧，并核对延迟回复、精确出站字节和关闭。14neutral/7生成检查、四构建通过；三App各121输入11输出，API96输入，均0external。 Chrome156.0.8078.80/Playwright1.64.1共15桌面/触屏流程通过，75张截图经7联系表与新原尺寸图复核。实际game.html/Files/正常人物流程/按钮/暂停/关闭验证；0应用错误、警告或外部请求，4条QA Canvas读回提示单列。Browser插件缺席，使用现有Playwright；无浏览器安全覆盖。

固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4。复用28份dossier，新增14记录/1规范函数43f2d0，522→523；4段1031B与原PE逐字节相符，复用32B方向表另以PE头核对。614884位于.data零填充尾部，初始化零是推导，非原文件字节或运行时观测。1625记录/387120057B快照留build；会话已关闭、cleanup_pending=false。 新TCP actions模式在收到请求后暂不回复，断言源状态未提前变化；join接受后仍等HFs；leave接受后必须观察确切/Re才继续。full模式两种API各128完整RGBA。静态/独立参考/实际TCP/构建/浏览器证据分别保存，不能替代原生设备/官方兼容。

[源证据](../analysis/game-party-actions-v1/source-check.json)、[规格](../analysis/game-party-actions-v1/implementation-spec.json)、[测试](../analysis/game-party-actions-v1/test-results.json)、[TCP](../analysis/game-party-actions-v1/network-validation.json)、[验收](../analysis/game-party-actions-v1/validation.json)、[完整目标](../analysis/game-party-actions-v1/goal-audit.json)。

完整队伍控制/其他快捷键/modal、战斗/宠物/特效/复合转场、其余纠偏/输入/reset/生产启动/资源/玩法、微信原生gamePage和设备、现行及官方兼容仍未完成。无真实测试账号。完整目标active，本轮无VM/CUA/WER/CDB/原程序/账号/官方操作；stage131已执行恢复的诊断不重放。


<a id="stage178"></a>

## stage178：队伍输入、跟随、转移及实际产品验收

16项新增、1428项全量Node通过；160距离用例、11个队列长度/速率、16分支组合及3场景224帧完整图像/195种RGBA SHA通过。源模块与实际中立API各3条原创OS TCP，共6条/448帧，独立peer核对队长两条源移动命令、队员零自主命令和关闭归属。12neutral/7生成检查通过；三App各120输入11输出、API95输入，均0external。 13个Chrome156.0.8078.80桌面/触屏流程通过；新2条实际game.html路径含正常选人/升级、实际Files、队员点击禁自主路径、收到解散、暂停/继续/关闭。65张唯一截图经6联系表复核，新桌面/手机跟随图另读原尺寸；0应用错误/警告/外部请求，4条旧QA Canvas读回提示单列。

固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4；本阶段31新记录、13个函数查询，其中12新规范函数、1次已知461370查询（完整已缓存facet相符），510→522；23旧dossier复用。3段1193B及6端点映射与原件相符。1611记录/386815720B快照留build，会话已关闭并复核open=false、cleanup_pending=false。 原生静态字节事实、独立Python状态与图像、真实TCP、构建/中立运行、Chrome实际页面分别记录；未用测试通过替代完整目标或目标程序运行。

[源证据](../analysis/game-party-follow-v1/source-check.json)、[合同](../analysis/game-party-follow-v1/implementation-spec.json)、[测试](../analysis/game-party-follow-v1/test-results.json)、[网络](../analysis/game-party-follow-v1/network-validation.json)、[验收](../analysis/game-party-follow-v1/validation.json)、[完整目标](../analysis/game-party-follow-v1/goal-audit.json)。

完整队伍UI/加入离开响应、aux04队长/模式图标、战斗/宠物影子/活跃复合转场、其他文字/UI与完整纠偏/输入/reset/生产启动/玩法、微信原生gamePage及设备、现行和官方兼容仍未完成；原生x87与非法重复身体/空指针行为未复现。完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage177"></a>

## stage177：源状态值条与队伍记录验收

25项新增、1412项全量Node通过；198个独立整数用例、120帧完整图像/107种SHA、12帧预解码/延迟资源相符。1001人物/3003值条全局图像与文字共用4096槽（文字存在时4095图像）的边界已验。6条实际原创TCP核460帧、每条5次既定客户端请求；9neutral/7生成检查通过。三App119输入11输出、API94输入、0external。 11个Chrome156.0.8078.80桌面/触屏流程通过，61张最终唯一截图以6张联系表及2张原尺寸复查；0应用错误/警告/外部请求，4条QA读Canvas性能提示单列。按钮实际改变状态条显示，原有中文标签、暂停、换场景与关闭继续通过。

固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4；30条新记录、11个新规范函数，499→510，23份旧dossier复用；3段1583B及6端点映射与原件相符。1580记录/378372484B快照留build，session已关闭并复查open=false、cleanup_pending=false。 源绘制参数与独立原始像素参考、预解码/延迟绘制、duplicate/resource1/outside/gates/spin、值/行归属及4K共享队列均验。截图为原创资源的真实产品显示，未使用目标程序/原生GDI运行作像素对照。

[源证据](../analysis/game-actor-vitals-v1/source-check.json)、[合同](../analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](../analysis/game-actor-vitals-v1/test-results.json)、[网络](../analysis/game-actor-vitals-v1/network-validation.json)、[验收](../analysis/game-actor-vitals-v1/validation.json)、[完整目标](../analysis/game-actor-vitals-v1/goal-audit.json)。

队伍跟随/本机输入上下文同步、aux04队长/模式图标、宠物影子及战斗条源、其他文字/UI、完整纠偏/输入/reset/生产启动与玩法、微信原生gamePage/设备、现行与官方兼容仍未完成。HFs已存状态尚未动态桥接f5f170/f536b2到现有显式输入上下文；完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage176"></a>

## stage176：普通姓名与标签阶段验收

32项新增、1387项全量Node通过；187宽度、2304标签选择、24文字合成，共2515个独立例（含预期拒绝），120帧完整场景/96种SHA、12帧预解码/延迟精灵相符。6条实际原创TCP核460帧，标签循环不增加5次既定客户端请求；8neutral/7生成检查通过。三App118输入11输出、API93输入、0external。 11个Chrome156.0.8078.80桌面/触屏流程通过，37张唯一最终截图已查，0应用错误/警告/外部请求；4条QA读Canvas性能提示单列。网页新增显式ASCII/Windows936选择和实际标签切换按钮；宿主字体为可替代端口，未证明Windows原生GDI字形像素或线路默认编码。

固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4：32新记录含12函数查询（11新规范入口、已知505840单列），15份旧dossier复用；规范目录488→499，1550记录及364943731B快照留build，session已关闭。3段1163B和6端点映射与原件相符，其中534598的8字节读取复用旧记录。 原创像素参考使用29份合成字形mask，不含字体或官方图像；浏览器证据为实际宿主字体观察，不能与原生GDI字形等价混用。覆核了有效目录19B/负行、原始排序、全局标签重建、资源0/1、重复/离屏、骑乘/旋转、空run保留slot、mask取消/关闭/借用边界及getter拒绝。

[源证据](../analysis/game-actor-text-v1/source-check.json)、[合同](../analysis/game-actor-text-v1/implementation-spec.json)、[验收](../analysis/game-actor-text-v1/validation.json)、[测试](../analysis/game-actor-text-v1/test-results.json)、[网络](../analysis/game-actor-text-v1/network-validation.json)、[完整目标](../analysis/game-actor-text-v1/goal-audit.json)。

HP/队伍、其他文字通道/聊天/头顶气泡/aux04/菜单、完整本机纠偏/输入/reset/生产启动与中文语义、战斗及其余玩法、微信原生gamePage/设备、现行消费者和官方兼容仍未完成；整体goal active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage175"></a>

## stage175：状态字、图标、输入门控及生命周期验收

固定旧版37c4（1,569,280B），REA6.7.0/Ghidra12.1.4；50条新记录，37次函数查询中36个新规范入口、1个已知45f2f0（伪码与指令相同），规范目录452→488；35份旧dossier复用，2446B原字节及8映射一致，1518记录与358988573B快照留build，session已关闭。 27项新增、1355项全量Node通过；546组控制、1540组图标选择/拒绝、1003组高度/旧偏移，共3089个独立例。720帧完整场景/224种SHA、12帧预解码/延迟精灵像素对比、6条实际原创TCP的1660帧一致；7neutral/7生成工程通过。四份新构建App116输入/11输出、API91输入，均0external，原生game Page仍未实现。 11个Chrome156.0.8078.80桌面/触屏流程通过，32张最终唯一截图已查看，0应用错误/警告/外部请求。4条性能提示来自QA反复读取Canvas，单列保留。浏览器只验证实时状态/遮挡/门控/暂停/场景/关闭；601次回调的精确超时由核心/TCP/neutral证明。

真实拥有客户端覆盖资源重用、helper-1/1仍绘旧缓存、资源0占槽无像素、primary覆盖和side±17、transient隐藏计时/601清位/下一帧删除、shadow位映射、scene9声音坐标、源99指针/运动/镜头和回调停止、去重根-1/离屏释放、1024共享预算、特殊暂停、场景与关闭。身体duration重建0且源全局字保留有回归。

复核修正旧测试的mode100粘滞预期、参考模型漏掉本机C0的40位、人物时长所有权；已在最终全量和构建后验证。浏览器等待601回调遇开发桥既有10秒idle关闭，改为有限实时检查而不改桥；截图初稿7处跨mode重名已改并重跑。函数重复查询1次如实单列，未冒充第37个新函数。所有失败/初稿留build。

复现：python3 analysis/game-actor-presentation-v1/generate_vectors.py；node --test shared/tests/legacy-game-actor-presentation.test.mjs web/tests/legacy-game-actor-presentation-tcp.test.mjs；全量node --test shared/tests/*.test.mjs web/tests/*.test.mjs。四构建命令及neutral/生成工程回执在build；私有原件存在时可运行verify_source.py仅读核对，绝不执行样本。[源证据](../analysis/game-actor-presentation-v1/source-check.json)、[合同](../analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](../analysis/game-actor-presentation-v1/validation.json)、[测试](../analysis/game-actor-presentation-v1/test-results.json)、[网络](../analysis/game-actor-presentation-v1/network-validation.json)。

姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：附属更新、锚点、入队及拥有者验收

| 证据层 | 结果 |
| --- | --- |
| 静态 | 固定37c4，20函数复用/0新函数，3段223字节+6端点映射及1 retained view；1468记录，session关闭 |
| 核心 | 21新增核心+6真实TCP，1328全量Node通过；1760独立计划；540完整场景/200种SHA |
| 绘制 | 实际资源库延迟绘制与借用预解码精灵路径12帧像素一致 |
| 网络 | Node/微信形状适配各full/reload/close，6条实际原创TCP/1300帧一致 |
| 构建 | 3App各115输入11输出，API90输入，0外部导入；7neutral/7生成检查通过 |
| 网页 | Chrome156.0.8078.80、Playwright1.64.1，1100×850鼠标和390×844触摸，7既有+4附属流程、18图已查 |

[测试与命令](../analysis/game-actor-attachment-v1/test-results.json)、[网络](../analysis/game-actor-attachment-v1/network-validation.json)、[网页回归](../analysis/game-actor-attachment-v1/browser-validation.json)、[附属网页](../analysis/game-actor-attachment-v1/browser-attachment.json)。Browser插件缺席，使用现有Playwright；0应用警告/错误/网页外部请求，2条QA重复getImageData提示另存。18图总览并看2张原尺寸，无遮挡/溢出；浏览器hash是观察，540帧精确预期在核心/TCP/neutral核对。

普通回调与特殊状态、body/mount当前AP、helper1/-1的旧图抑制、隐藏/资源1、去重根-1、离屏删除、1024共享槽、暂停时删除、换场景与关闭均覆盖。未完成：其他姓名/状态/队伍/UI/输入/reset/生产中文/战斗/剩余玩法、现行、微信原生与官方验收。本轮无VM/原程序/账号执行。[阶段验收](../analysis/game-actor-attachment-v1/validation.json)保持完整goal active。


<a id="stage173"></a>

## stage173：骑乘转换与复合场景验收

| 证据层 | 本轮结果 |
| --- | --- |
| 静态 | 固定37c4；6新REA记录/3新函数/24复用；epsilon原文件一致；1458记录导出并关闭 |
| 独立规则 | 1062资源+264动作+492计划+3444完成结果，共5262例 |
| 运行与像素 | 110完整场景/85种SHA；24新增/1301全量Node通过 |
| 实际网络 | 6原创本机TCP路径/380帧完整像素一致，包含进出/重进、换场景、关闭 |
| 构建 | 3份App各114输入11输出、API89输入，0外部导入；6neutral/7生成检查通过 |
| 浏览器 | Chrome156.0.8078.80，1100×850与390×844，固定game.html经真实Files、选角、升级、进入、骑乘/退出/重进、暂停/场景/关闭；11流程16图已查 |

[测试与命令](../analysis/game-actor-ride-v1/test-results.json)、[网络](../analysis/game-actor-ride-v1/network-validation.json)、[网页回归](../analysis/game-actor-ride-v1/browser-validation.json)、[骑乘网页](../analysis/game-actor-ride-v1/browser-ride.json)。Browser插件缺席，使用已装Playwright1.64.1；0应用错误/警告/外部请求，3条QA反复getImageData提示单列。16图总览并打开2张原尺寸，原创图案的动作差异另以状态/像素确认。

未知/未执行：完整source60附属、队伍/UI/input/reset/剩余玩法/生产资源、原生微信gamePage/设备、现行9baa/6e2ff和官方兼容。无VM/CUA/原程序/WER/CDB/账号/官方执行。整体目标active；[阶段结果](../analysis/game-actor-ride-v1/validation.json)不等于完整游戏完成。


<a id="stage172"></a>
## stage172：旋转状态、真实字段来源与跨端验收

静态层：固定37c4与REA6.7.0/Ghidra12.1.4，28复用dossier、26新增记录/字节映射核对，无重复新函数；1452记录及快照保存在build，session已关闭。[源核验](../analysis/game-actor-spin-v1/source-check.json)。无原程序/VM/WER/CDB/账号/官方新操作。

实现层：最终20新增/1277全Node通过；3285规划+24返回码独立例，400完整场景帧/114种SHA、合成动画第365帧完成。6条实际原创TCP核对1474帧，5neutral/7生成工程通过；三份v2 App各113输入/11输出、API88输入，0external，game_Page_implemented=false。真实移动中旋转、同向写入、结束身体/正常朝向不同、真实body转向比较及换场景重建均有回归。[测试](../analysis/game-actor-spin-v1/test-results.json)、[TCP](../analysis/game-actor-spin-v1/network-validation.json)。

浏览器层：固定game.html，7既有+4旋转流程，1100×850鼠标与390×844触屏；真实File输入、源选人/升级、活跃/完成旋转、暂停/恢复、中途换场景和关闭通过。12图实看，0应用错误/警告、0external。Browser插件缺席，Playwright1.64.1/Chrome156.0.8078.80；2条Canvas性能建议来自QA重复getImageData，单独留存，未改产品渲染设置。[页面回归](../analysis/game-actor-spin-v1/browser-validation.json)、[旋转流程](../analysis/game-actor-spin-v1/browser-spin.json)。

真实client原行为0≠3及初稿结束反馈5≠4的红绿记录保留。最终v2构建和全部最终检查均在身体朝向修复后执行；动画基址、动作分隔、首帧/指针/转向夹具的更正未修改源解析规则或400帧独立期望。原生x87、完整特殊/骑乘/输入/生产启动/中文、微信设备、其余玩法/current/官方未验。[目标审计](../analysis/game-actor-spin-v1/goal-audit.json)。


<a id="stage171"></a>
## stage171：实体标志、初始朝向和混合物件验收

静态层：固定37c4，REA6.7.0/Ghidra12.1.4，28复用dossier、79新增记录/4函数，74项原字节/映射/表核对及1数据xref通过。1426记录导出与快照仅留build，session已关闭；无原程序/VM/WER/CDB/账号/官方新操作。[源核验](../analysis/game-actor-context-v1/source-check.json)。

实现层：18新增/1257全Node通过。独立Python生成84组类别/标志、270组朝向、51组范围和103组容量/重复，共508例；120帧混合场景含13种像素SHA。6条新增实际原创TCP留存回执，其中480帧独立像素、深度提交、远端释放与重复保活通过。4neutral/7生成工程通过，三份App各112输入/11输出、游戏API87输入，均0external，game_Page_implemented=false。[测试](../analysis/game-actor-context-v1/test-results.json)、[网络](../analysis/game-actor-context-v1/network-validation.json)。

浏览器层：固定game.html经7既有/4混合实体流程，桌面1100×850及触屏390×844，真实File输入和原创对端，不注入场景逻辑。暂停、换场景、关闭、选人/外观与重连回归通过，0console error/0external；10张最终截图实看。Browser插件不可用，使用Playwright1.64.1与Chrome156.0.8078.80，无安全覆盖。[回归](../analysis/game-actor-context-v1/browser-validation.json)、[混合场景](../analysis/game-actor-context-v1/browser-mixed.json)。

最终源码复核发现初稿把构造mode接到声音context，新增mode1/sound0真实client回归先失败0≠4。改为实际scene.fields[8]及有源main5初值后，以上全部最终测试、构建、TCP和Chrome重新执行；旧候选日志与失败回执保留。参考提交顺序元数据、严格catalog配置和data-xref检查器也已纠正。完整native/生产启动/中文/微信设备/玩法/current/官方仍未验收。[目标审计](../analysis/game-actor-context-v1/goal-audit.json)。


<a id="stage170"></a>
## stage170：初始化、源等待与换场景验收

静态证据：固定37c4身份、REA6.7.0/Ghidra12.1.4/profile、31复用dossier、69新记录/1新入口、57原字节映射与7数据xref通过；1347记录与快照留build，provider已关闭。[源核验](../analysis/game-local-bootstrap-v1/source-check.json)。没有原程序/VM/WER/CDB/账号/官方新操作。

实现证据：288组独立Python构造顺序、19新增/1239全部Node通过。8新增真实原创TCP验证源请求、等待与迟到位置、地图错身份、无额外单位的普通场景重建及关闭；完整回归仍含既有7条TCP与双目标WebSocket。3份App各111输入/11输出、游戏API86输入，0external；3neutral与7实际生成工程检查通过。[完整测试回执](../analysis/game-local-bootstrap-v1/test-results.json)、[真实TCP回执](../analysis/game-local-bootstrap-v1/network-validation.json)。

固定game.html经7既有/4新增Chrome流程，桌面1100×850与触屏390×844，0console/0external；10图已实看。等待时暂停禁用、stage隐藏、没有活动Canvas；源材料释放后正确位置入场，普通场景重建、断开与原有选择/重连流程通过。[既有流程](../analysis/game-local-bootstrap-v1/browser-validation.json)、[新增边界](../analysis/game-local-bootstrap-v1/browser-boundaries.json)。

初轮测试中的导入/碰撞未知/布尔/phase、异步屏障、cache-checksum配对和隐藏Canvas断言已修正并保留失败记录；没有把错误夹具改成产品规则。完整native UI/reset/context、生产启动/中文编码、原生微信宿主、设备/current/完整玩法/官方均未验收。[剩余目标](../analysis/game-local-bootstrap-v1/goal-audit.json)。


<a id="stage169"></a>
## stage169：固定网页入口与生命周期验收

**源核验：** 固定37c4，REA6.7.0/Ghidra12.1.4；新42记录/6新函数、7主dossier复用、18指令与18映射对原PE全部相符。最终1278记录和350369862B快照hash复核，provider关闭。原生目标/VM执行为0。[核验](../analysis/game-browser-owner-v1/source-check.json)。

**完整/定向测试：** 22新增/1220全Node，fail/cancel/skip均0；定向为两个shared client/config、实际TCP和browser-ports测试文件。覆盖真实材料就绪、非固定收包数、迟到metadata/CUT关闭、暂停重置clock、场景重载保暂停、丢本机actor后立即停旧runtime及真实记录恢复、异常hook/错误factory独立清理。独立Python240空闲更新/13摘要全部与核心匹配；没有将自动浏览器固定在旧首帧时钟。

**实际网络与页面：** 7原创PythonTCP，5成功场景链各52摘要/两移动，普通7请求、retry8请求；含两槽、33100、scene reload和拒绝/取消。另1真实双目标WebSocket验证第二目标完成5请求、第一目标0连接。7Chrome流程在实际web/game.html正常产品模块和File输入上运行，测试仅读inspection，无注入重建场景逻辑；1100×850鼠标与390×844触屏、显式retry、重载保暂停、入场前关闭、pagehide、同页重新选择材料/第二目标重连和错误桥profile均核对。首次可见空闲画面匹配独立序列，console/外部请求0，5张最终截图实际查看、无横向溢出。Browser插件缺失，沿Playwright1.64.1/Chrome156.0.8078.80普通HTTP回环，无安全开关。

**构建/启动：** 3新App各111输入11输出，API86输入、均0external；2neutral/7实际生成工程通过。neutral实例无DOM/Buffer/URL/TextEncoder/网络/Abort/timer全局，实际同身份WeChat API执行完整client资源/升级/入场/52帧/两移动/清理。CLI启动、GET固定页/runtime、SIGTERM退出0、0对端连接已核验。最终构建输入输出hash一致；web-only端点修复不在bundle依赖图，未作无依据重建。[回执/命令](../analysis/game-browser-owner-v1/test-results.json)、[浏览器](../analysis/game-browser-owner-v1/browser-validation.json)。

**失败与修复：** 原scene回调重入读取、丢就绪仍留旧runtime、第二目标ordinal误重排均复现并修复。测试字符串Function曾被CSP拒绝，改只读inspection轮询而未改CSP；自动idle摘要改用独立序列；一轮测试在生成器未结束时误读旧无tick产物，等待同一句柄终结后重跑。截图发现准备表单占手机大部，现连接时收起。最终回执已排除这些失败，历史日志私有保留。

**未验收：** 生产启动/摘要/编码/context链、完整native main5/main9/UI/preview、本机物化深层字段；原生微信game Page/Canvas/file/scheduler/实体手机；其余玩法、现行9baa/6e2ff和官方。startup的hash声明不证明资源同版；桥10秒/4MiB未改。无VM/WER/CDB/原程序、账号、官服新动作。[目标](../analysis/game-browser-owner-v1/goal-audit.json)、[交付](../analysis/game-browser-owner-v1/delivery-audit.json)。


<a id="stage168"></a>
## stage168：外观、版本升级、纠正默认值和单字段绑定验收

**静态证据：** 旧37c4、REA6.7.0/Ghidra12.1.4；新增111REA/25新规范函数入口，复用12主dossier，82字节/映射与原PE相符。最终1236记录与纠正快照hash复核、provider关闭。新原始指令0x45874c纠正fallback为33100。[核验](../analysis/game-character-options-v1/source-check.json)。

**测试：** `node --test shared/tests/legacy-game-character-options.test.mjs web/tests/legacy-game-character-options-session.test.mjs web/tests/legacy-game-character-options-tcp.test.mjs`19/19；全部shared/web Node1198/1198，fail/cancel/skip均0。15296外观、1566升级门槛及1128修正预览一致；原创建8400/6000/306覆盖仍在完整套件。field16只绑定一次、未知值不补零、真实bit16状态更新覆盖、非actorID、重入等待者和关闭清帧均检查。

**运行证据：** 6实际原创PythonTCP：普通/WeChat形状两槽、33100fallback及明确retry四条场景成功各52摘要/两移动，常规7请求/retry8请求；拒绝/中止不刷新不进入。5Chrome：1000×800鼠标、390×844触屏及拒绝后retry各53帧、两移动/纠正/EOF；控件关闭和成功观察器关闭都无复活/自动刷新。console/外部请求0，5张截图全部实际查看，控件可读、布局无横向溢出。Browser插件缺失时沿既有Playwright1.64.1/Chrome156.0.8078.80普通HTTP回环验证；未加浏览器安全开关。

**构建：** 3新App各109输入11输出、API84输入，均0external；2neutral/7实际生成App/Page回归通过。neutral无DOM/Buffer/URL/text/network/Abort/timer全局，实际同身份bundle执行升级/刷新/外观/field16/入场/关闭。所有构建输入与输出hash复核。[完整回执/命令](../analysis/game-character-options-v1/test-results.json)、[浏览器](../analysis/game-character-options-v1/browser-validation.json)。

**纠正与限制：** 首次新测试误用了不存在的copyActors/normalizedCode测试字段，改为实际copyGameState().actors/normalizedPreviewCode及独立wire后通过，非产品算法修改。更重要的是旧实现与参考共同的33000错误现被原始指令纠正24行；历史验收保留原文，当前结果以本阶段为准。未运行原程序/VM/WER/CDB、native微信/手机或账号/官方；正式game Page、完整reset/UI/preview、类别7材料/current/完整玩法仍未验。[目标](../analysis/game-character-options-v1/goal-audit.json)、[交付](../analysis/game-character-options-v1/delivery-audit.json)。


<a id="stage167"></a>
## stage167：创建、列表刷新、入场与场景验收

| 层 | 实际结果 | 边界 |
| --- | --- | --- |
| REA/原文件 | 81新记录/21新函数/10主复用，60字节映射一致；1125记录/快照留存并关闭 | 固定37c4，无原程序执行 |
| 独立参考 | 8400外观/6000单步分配/306名称相符，13字段及两wire分支 | Python静态源推导，原创数据 |
| Node | 18新增/1179全套，0fail/cancel/skip | 原login-only/选人链回归保留 |
| actual TCP | 通用slot1/mode2、微信形状slot0/mode0：auth/list/create/refresh/entry/52帧/两移动/7请求；另拒绝保留连接与主动中止 | 独立原创Python，无真实账号/官服 |
| Chrome156 | 5流程；桌面1000×800鼠标/390×844触控各53摘要；真实点数/名称/确认/刷新/选人/移动/校正；拒绝返回和控件/观察器关闭晚答复 | 临时原创HTML与真实产品creator/picker，无正式游戏页证明 |
| 构建产物 | 2neutral/7实际生成App/Page通过；三App各107输入11输出，独立API82输入，0external | 无native IDE/AppID/游戏Page/设备验收 |

沿前端测试技能：Browser插件/技能未列出，复用Playwright1.64.1/Chrome156.0.8078.80。普通本地HTTP与原有桥，未改浏览器安全设置；console/外部请求0。4张截图实际查看：桌面双列、移动单列表单可读且无横向溢出，点数/禁用态/名称显示正确；纵向滚动正常，首场景后控件销毁。图像为原创合成场景。[浏览器记录/截图路径](../analysis/game-character-lifecycle-v1/browser-validation.json)。

本轮初始与最终检查均通过，无新产品故障修复；源码审阅补初次准备期禁用控件，TCP测试读取metadata避免无用副本。未运行原程序/VM/WER/CDB、官方或native IDE。删除/look/aux、完整reset/preview/profile、语义标签/正式编码、正式页面/runtime上下文、native微信/物理手机/current/官方仍未验。[完整回执](../analysis/game-character-lifecycle-v1/test-results.json)、[总验收](../analysis/game-character-lifecycle-v1/validation.json)、[目标](../analysis/game-character-lifecycle-v1/goal-audit.json)、[交付审计](../analysis/game-character-lifecycle-v1/delivery-audit.json)。


<a id="stage166"></a>
## stage166：人物列表、选择入场与源场景链验收

| 层次 | 实际完成 | 范围 |
| --- | --- | --- |
| REA静态 | 89新记录/27新函数入口/17复用；60字节映射一致；1044记录/快照留存且关闭 | 37c4；5111a0重复查询单列 |
| 独立参考 | 211人物记录/1566category门槛/1128预览数值修正相符 | 原创字节/数值，无账号/原画 |
| 本地源元数据 | 6份GraphicInfo，641666记录，5探测值与generation4一致 | 不证明current EXE等价 |
| Node | 28新增/1161全套，0fail/cancel/skip | 保留旧login-only默认回归 |
| actual TCP | 4场景；auth/list/两槽entry逐字节验证，成功各52帧/两移动，拒绝/OUTOFSERVICE结束 | 原创Python，含WeChat形状端口 |
| Chrome156 | 5流程；桌面1000×800鼠标/390×844触控各53像素摘要、两移动/校正/EOF/暂停断开；拒绝及控件/观察器关闭晚到回复 | 实际产品picker，临时原创测试文档 |
| 生成工程 | 2neutral/7实际生成App/Page；三App各106输入/11输出，游戏API81输入，均0external | 无native IDE/AppID/游戏Page/设备验收 |

Browser插件缺失，沿前端测试技能复用Playwright1.64.1/Chrome156.0.8078.80。普通HTTP文档与既有本地桥，无浏览器安全改动；console/外部请求0。最终4张截图已实际查看，选人名称/按钮可读、两视口无横向溢出；首帧显示后测试父宿主关闭选人控件。控件close或source-entry observer close后，晚到成功不再触发游戏回调或恢复控件。

初次会话测试的包装spread将stats getter固定成0，修为转发getter；初次浏览器denial定位status匹配两个元素，改为picker内定位，并修等待选项位置/去无效断言。均为测试改正，未更改产品协议、放宽限制或抹去失败日志。[详细回执](../analysis/game-post-login-v1/test-results.json)。

完整native UI/reset/创建删除/预览像素、正式页面/全部runtime上下文、微信Canvas/文件/调度、current消费者和官方可玩仍未验。本轮无VM/原程序/WER/CDB或官方操作。[总验收](../analysis/game-post-login-v1/validation.json)、[浏览器](../analysis/game-post-login-v1/browser-validation.json)、[目标审计](../analysis/game-post-login-v1/goal-audit.json)、[交付审计](../analysis/game-post-login-v1/delivery-audit.json)。


<a id="stage165"></a>
## stage165：登录、真实原创对端与场景链验收

| 层次 | 本轮实际结果 | 边界 |
| --- | --- | --- |
| 静态源 | 42新REA/10新函数/11复用；30字节和映射相符；完整955记录/快照保存，provider已关闭 | 仅37c4，不外推current |
| 独立参考 | 24交接输入、131轨迹/4315源状态；全部相符 | 原创字段，无账号 |
| Node | 25新/1133完整通过，0fail/cancel/skip | 本地实现 |
| actual TCP | 通用/微信形状端口先核登录请求、各52帧/2移动；另核busy拒绝和duplicate忽略 | Python原创loopback，不是官方/原生设备 |
| Chrome156 | 桌面1000×800鼠标/390×844触控各53像素摘要；真实移动、校正/EOF、暂停/断开；拒绝分支通过，console/外部请求0 | 静态原创测试HTML，不是正式游戏页 |
| 生成工程 | 2neutral＋7实际生成App/Page通过；三App各105输入/11输出，游戏API80输入，均0external | 无原生IDE/AppID/游戏Page/设备验收 |

截图已查看，原创图案场景与按钮/状态可读，两视口无横向溢出；不导出官方像素。Browser插件缺失，依前端测试技能复用Playwright1.64.1/Chrome156.0.8078.80。常规HTTP夹具和既有loopback桥通过，未改浏览器安全设置。

失败没有删去：最初回调包清零晚于done，修产品生命周期；浏览器首次验证发现native timer被伪receiver调用，修端口与默认包装；微信夹具端点、neutral测试clearTimer拼写仅修测试。替换活跃登录页DOM引发late handler错误，以及合成响应触发LNA，均改为独立正常HTTP夹具。完整失败/修复和私有原回执路径见[test-results](../analysis/game-session-runtime-v1/test-results.json)；通过后的代码只在新增修改/回归要求处复测。

完整摘要算法/票据绑定、主阶段3后续、正式页面与完整runtime/resource owner、微信Canvas/文件/调度、current消费者、实际设备/官方可玩仍未验。无VM/原程序/WER/CDB或官方新动作。[总验收](../analysis/game-session-runtime-v1/validation.json)、[浏览器证据](../analysis/game-session-runtime-v1/browser-validation.json)、[目标审计](../analysis/game-session-runtime-v1/goal-audit.json)。


<a id="stage164"></a>
## stage164：按需资源→延迟场景→真实 Canvas

| 证据层 | 本轮实际结果 |
| --- | --- |
| 静态 | 固定37c4；34新REA/3dossier（2新入口、1重复）；31字节/映射与另1原件别名格式核对，20旧函数复用，913记录/快照已关闭 |
| Node | 21新/1108完整，0失败/跳过 |
| 独立参考 | 209路径计划、4palette、160裁剪/翻转、52普通延迟场景摘要；跳绘19轮0图像读取 |
| 实际本地TCP | Python对端核对2条真实发送帧，52场景摘要及server位置校正；I/O不重播motion/helper/request |
| neutral | 2项实际执行，平台API缺失仍跑资源/read端口/异步job与52场景/两编码请求 |
| 生成工程 | 3新微信各104输入/11输出/0外部导入，7生成App/Page回归 |
| 浏览器 | Playwright1.64.1/Chrome156.0.8078.80；1000×800鼠标/390×844触控各53个独立Canvas摘要，7项交互/生命周期检查；0console/外部请求 |
| 真实本地资源 | 25读取文件身份，641666图形记录/2520动画资源；18图像36中性分支摘要全部匹配Python，未导出图片 |

浏览器流：原创File对象→显式根内File.slice→真实目录/动画/CGP→快点/轻触→source world/drawPlan→范围读与缓存→Canvas。identity/非空/无overlay/无横溢出、停止/恢复、旧timer、5002..5010的I/O后7ms剩余等待、取消pending read、新scene消息抑制旧像素、post-I/O tick关闭均通过。另旧同步宿主2视口回归通过；截图存系统临时目录并已查看，无控件重叠/截断；截图计数54含resume额外一帧，53个独立摘要只计此前idle+52更新。[浏览器回执](../analysis/game-resource-runtime-v1/browser-validation.json)、[同步回归](../analysis/game-resource-runtime-v1/browser-sync-regression.json)。

首次新测试14/16，定位到数值队列误将裁剪命令flip列为必填；既有renderer省略flip表示0，修正后160裁剪/52场景均通过。私有调试trace已移除，失败日志保留。复核新增timer generation/handle/once与clock回调关闭门，浏览器回归通过。之前全套前一轮误跑20项input targeted，最终已明确跑21项资源targeted并保留前轮回执，完整1108包含全部新增。

真实安装语料只证明该选择的元数据与36中性像素分支，不能证明全图像/命名palette/现行消费者或官方可玩。source库显式neutral，实际移动设备对全包641666目录/41MB动画的内存/启动耗时未测。native DirectDraw池、网络调度、资源更新与消息并发、完整应用页面仍需继续。[测试/构建](../analysis/game-resource-runtime-v1/test-results.json)、[语料](../analysis/game-resource-runtime-v1/corpus-comparison.json)、[审计](../analysis/game-resource-runtime-v1/goal-audit.json)。

完整登录页→游戏接线、微信游戏Canvas与原生文件/调度、真实runtime/record/UI上下文、动态LUT/命名调色板/效果、骑乘组队/primitive/小地图、战斗/其余业务及认证、现行与实际三端/官方可玩仍未完成。旧版37c4源码与当前安装资源能按格式组合验证，不构成9baa/6e2ff消费者或官方接受证明。

<a id="stage163"></a>
## stage163：输入→world→相机→Canvas验证

| 证据层 | 本轮结果 |
| --- | --- |
| 静态源 | 固定37c4，新96REA/23唯一dossier，53字节映射；2BSS数据观察另列，879记录/快照存储并关闭 |
| Node | 20新/1087完整，0失败/跳过；保留先前17/18项阶段回执 |
| 独立参考 | 1213逆投影/边界拾取、33按钮/长按/门/uint32更新、1800正常/落后/force/mode0/wrap时钟调用，52跟随camera场景摘要 |
| 实际本地TCP | 原创Python发启动/状态/地图，实际pointer/runtime产生2条encoded移动请求，对端字节核对并退出0；52scene摘要及server修正位置相符 |
| neutral | 2项实际执行，DOM/网络/文本/crypto/timer全缺；52scene和2条编码请求仍相符 |
| 构建 | 3新微信各100输入/11输出/0外部导入，7生成App/Page回归 |
| 浏览器 | Playwright1.64.1/Chrome156.0.8078.80；1000×800鼠标与390×844触控各53独立Canvas摘要，stop/resume、identity/非空/无overlay/无横溢出通过，控制台/外部请求均0 |

实际浏览器检查流为原创wire/resource→快点/轻触→52次source update→两移动描述符与camera[320,192]→Canvas读回摘要。截图在系统临时目录，已实际查看两视口，无裁切或控件重叠；恢复操作又产生一帧，截图计数54，不把这额外帧计入53独立摘要。[浏览器回执](../analysis/game-input-runtime-v1/browser-validation.json)、[测试/构建回执](../analysis/game-input-runtime-v1/test-results.json)。Browser插件未提供，按技能走既有Playwright；全程loopback，未安装依赖。

先前测试fixture在provider内构造frame，先触发world重入门；改为在provider外构造才能验证runtime门，产品未因错误断言改门。首次浏览器服务遗漏3个vendor.js路由导致ready超时，修正夹具允许范围；第二次两视口交互/像素已通过，但频繁读回产生2条Canvas性能提示，设置仅测试context的willReadFrequently后0提示。源码verifier初次把3个composed workflow当Ghidra而断言失败，现分别校验精确provider/profile，不放宽原字节检查。全部失败和修正材料保留在私有build。复核新增服务器位置修正后仍按前相机pick，以及ownGate不更新camera两个回归，再跑全套均通过。

**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

**未验收：** 完整资源与原生 runtime/record/UI 上下文绑定、右键交互、小地图/primitive/特殊角色/特效、战斗/其余业务及认证、现行版本、实际三端与官方可玩仍未完成。旧版37c4不等同9baa/6e2ff；本轮没有VM、WER、CDB、账号、官服或原生IDE新操作，也未重放已消费停止点。

<a id="stage162"></a>
## stage162：CUT、普通场景合并与跨块裁剪验收（2026-11-04）

**源证据与保护：** 2175项旧清单及固定37c4/744记录工件核对，24候选先备份；39新REA/14唯一函数、19字节/映射匹配，22旧函数复用，最终783记录及快照已关闭。CUT18B文件/20B运行时、原生窗口/对角遍历、静态/动画地图物件与多格比较/三队列合并、源裁剪有具体函数/原字节证据。[核验](../analysis/game-legacy-scene-frame-v1/source-check.json)、[合同](../analysis/game-legacy-scene-frame-v1/implementation-spec.json)。

**实际本地运行：** 17新增/1067完整Node、2neutral、7实际生成工程回归、3新微信构建（各97输入/11输出/0外部导入）通过。原创参考含10CUT记录、100窗口、7对角遍历、600比较、27合并（含1024根）、160裁剪（含132×100图像跨64×48纹理块）、6组144场景帧；独立3材料Python TCP实核52场景摘要/2发送请求及后续位置更正，退出0。341本地CUT/401103条数值metadata摘要全部相符，337AUT仅尺寸/hash盘点，未导出图像/音频或标小地图通过。[测试/构建日志摘要与退出码](../analysis/game-legacy-scene-frame-v1/test-results.json)、[资源比较](../analysis/game-legacy-scene-frame-v1/corpus-comparison.json)。

**初次失败与复核：** 首次并行全量中，既有35ms总截止/20ms忙循环测试观察1条请求、预期2条；隔离重跑1/1、其他重检查结束后最终同命令全量1067/1067通过。bootstrap实现及测试hash与前清单相同，未为取绿修改；CPU负载影响只是推测，首次log/receipt与隔离log保留。

**复现：** `python3 analysis/game-legacy-scene-frame-v1/generate_vectors.py`；`node --test shared/tests/legacy-game-scene-frame.test.mjs`；`node --test analysis/game-legacy-scene-frame-v1/portable-test.mjs`。保留的私有样本/工件可用`python3 analysis/game-legacy-scene-frame-v1/verify_source.py`重核。默认微信构建为`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage162`，另两份原创配置输出build/wechat-app-local-stage162、build/wechat-app-resources-stage162；完整运行命令、时间、退出码、输入输出hash均在回执。

**未完成：** RGBA为普通移植场景的透明底拥有缓冲，尚未验收原生UI/清屏/小地图/特殊效果、输入/帧时钟/资源/Canvas宿主、战斗/认证及现行/真实三端/官方可玩。没有VM/WER/CDB/原程序、账号/官服/原生IDE新增动作；目标active/incomplete。[审计](../analysis/game-legacy-scene-frame-v1/goal-audit.json)、[交付复核](../analysis/game-legacy-scene-frame-v1/delivery-audit.json)。

<a id="stage161"></a>
## stage161：普通实体帧与独立TCP验收（2026-11-04）

**源证据：** 2157项旧文件先核对、25候选备份；旧37c4新增31REA/9唯一函数，14字节/映射及旧callback1520B匹配，713旧记录保留，744记录导出/快照保存并关闭。图形初值更正−1，282个旧参考标量仅0→−1；资源/动作/帧数量与其他参考值不变。[源核验](../analysis/game-legacy-frame-v1/source-check.json)、[更正记录](../analysis/game-legacy-frame-v1/test-results.json)。

**实际运行：** 17项新增/1050项完整Node、2neutral、7生成工程通过；3个新微信构建各96输入/11输出/0外部导入。1064独立回调计划、44原生排序用例（含8/9阈值、相同坐标、1001/1024根）、7组448耦合帧验证motion/animation/event/depth/RGBA。独立Python TCP子进程仅3原创材料，实际校验2条发送请求、52个画面摘要及后续位置更正，退出0。覆盖重复动作、冻结/音频门、四轮调度、移除重建、延迟转向、重入/close与绘制失败保留网络请求。[测试与构建回执](../analysis/game-legacy-frame-v1/test-results.json)。

**复现：** `python3 analysis/game-legacy-frame-v1/generate_vectors.py`生成原创参考；`python3 analysis/game-legacy-frame-v1/verify_source.py`核对本地保留私有证据；`node --test shared/tests/legacy-game-frame.test.mjs`与`node --test analysis/game-legacy-frame-v1/portable-test.mjs`运行定向/neutral验证。`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage161`构建默认工程；另两份原创配置工程为build/wechat-app-local-stage161、build/wechat-app-resources-stage161。完整命令、开始/结束时间、退出码及log摘要在测试回执。

**限制与接续：** 图像失败可能已推进部分实体，failed帧系统需重新配置，协议继续可用。未完成完整scene/ground/object、原生record上下文、特殊/ride/party、input/resource/Canvas宿主、特效/战斗/其他业务/认证与现行/实际三端/官方可玩；无新增VM/WER/CDB/原程序、账号/官服或原生IDE验收。目标active/incomplete。[审计](../analysis/game-legacy-frame-v1/goal-audit.json)、[交付复核](../analysis/game-legacy-frame-v1/delivery-audit.json)。

<a id="stage160"></a>
## stage160：真实动画格式、每调用状态与普通RGBA验收

**静态：** 2138前文件相符、21候选备份；37c4与658旧记录核验，新55REA、20dossier19唯一、24指令/32B比较器读/映射共26源检查，4data/5resolve。完整旧GNU callback1520B逐段匹配；453720/453cc0受stack probe影响的formal签名用fread/原汇编约束；4531c0无procedure不制造dossier，4fd4f0内址返回既有4fd0d0不计新唯一。为实际绘制原点缺口恢复自己新快照一次，最终713记录/快照保存、session closed，未执行游戏。[回执](../analysis/game-legacy-animation-v1/source-check.json)。

**原创实现：** 5资源46动作106帧、35组1250状态及1235普通RGBA步，21新增/1033完整Node、2neutral、7生成工程通过。覆盖group/ID覆盖、version规范化、12/20/10/AP布局、same-action invalidate、freeze、once255重试、循环、uint32百分比乘法、事件抑制/持久signal、source origin与flip、优先级10/低ordinal guard、拥有/close/重入、畸形/预算与typed输入。三个全新微信各95输入/11输出/0外部导入。[测试](../analysis/game-legacy-animation-v1/test-results.json)。

**本地格式：** 两组396资源全部metadata摘要相符（16034动作58146帧），未导出图像/音频；这是数值格式/算法证明，不是游戏视觉或现行版本接受。归档helper直接执行重复报非UTF8，但当前同字节UTF8/bytes及str compile均成功；原因未定，等价Unicode转义ASCII源后成功，保留原件/错误回执；产品测试未失败、未改产品来解决归档问题。[比较](../analysis/game-legacy-animation-v1/corpus-comparison.json)。

**未验/接续：** 完整callback重复/scene时钟与actor/network同动作重启/生命周期、named palette/全部特效/audio执行、实际scene/input/resource/frame游戏host、party/battle/business/control/auth、现行与实际三端/官方可玩。无VM/WER/CDB/账号/官服/原生IDE新增动作或确认，完整目标active/incomplete。[目标审计](../analysis/game-legacy-animation-v1/goal-audit.json)、[交付清单](../analysis/delivery-manifest-stage160.json)。


<a id="stage159"></a>
## stage159：字节、颜色与普通精灵帧验收

**静态：** 前2119项hash相符、20候选备份；37c4与566记录身份一致。新增92REA/36唯一函数，47指令、48B比较器读与文件映射共49核对匹配，2数据/1非指令观察和4处resolve明确保留。449cf0全value-flow截断、上传formal签名错误仅以已核分支/汇编收束；完整658记录导出/快照保存、session closed。源EXE未执行。[核验器](../analysis/game-legacy-render-v1/verify_source.py)、[回执](../analysis/game-legacy-render-v1/source-check.json)。

**原创实现：** 独立Python315RD（256flag＋59命令/边界）、1CGP、23palette、4sprite与100frame向量；28新/1012完整Node、2neutral、7生成工程通过。覆盖zero run/C..F零填/all aliases、raw/end/尾随、已知partial颜色、default/explicit黑色、倒序行、signed16、origin/priority tie/flip/clip、拥有copy/close和再入关闭拒绝、预算/畸形。3新微信94输入/11输出/0外部导入。[测试回执](../analysis/game-legacy-render-v1/test-results.json)。

**本地资源：** Python/JS逐条比对27854 records，27820接受/34过展开安全拒绝；同两组原hash＋708B CGP，288帧RGBA摘要抽样匹配，未导出官方像素。首次oracle因相对路径relative_to绝对root失败，仅修oracle路径后通过，失败日志/exit1保留；产品测试28/28首次即通过。不是原程序渲染对照、真实设备/网络性能或版本等价。[资源比较](../analysis/game-legacy-render-v1/corpus-comparison.json)。

**未验/接续：** 动画时间线、actor-resource绑定与真实scene/input/frame游戏host，16/24bit/GPU/scale/crop/特效、全scene/party/业务/战斗/auth，现行与三端/官方可玩。无VM/WER/CDB/账号/官服或原生IDE新增动作/确认；完整目标active/incomplete。[目标审计](../analysis/game-legacy-render-v1/goal-audit.json)、[交付清单](../analysis/delivery-manifest-stage159.json)。


<a id="stage158"></a>
## stage158：碰撞、路径与普通本机帧验收

**源/完整性：** 2099前清单一致、21候选备份；固定37c4与449旧记录身份匹配。新增117REA记录/52唯一dossier、52指令/32B读/1映射共54源检查匹配PE，5data/undecodable仅引用及6resolve保留；566完整导出/185MB新快照保存并关闭。大renderer value-flow截断明示，仅使用直接collision/wait链。[核验器](../analysis/game-legacy-local-movement-v1/verify_source.py)、[源结果](../analysis/game-legacy-local-movement-v1/source-check.json)。

**实际通过：** 原创8primitive/41collision/149path/32lookahead/32selector/18local轨迹403帧，37新增/984完整Node（0fail/skip）、2neutral及7生成工程。两种隔离Python TCP场景在targeted/full各一次，总4轮，每轮核2实际发送请求；普通6消息驱动两步＋一步及server correction，缺块9消息驱动movement+map request/wait/patch/resume。只3公开原创文件，不依赖私有PE/账号/捕获会话。三个新微信构建各93输入/11输出、0外部导入，输出720224/721482/721481B；App/Page检查仍覆盖已有登录器/资源流程，游戏数学另由neutral实际字节组合核验。[测试](../analysis/game-legacy-local-movement-v1/test-results.json)。

覆盖源GraphicInfo字段/分组/alias/default和count+10容量、primitive边界，两mode/cell2/footprint/后写覆盖、非对称window/byte所有权、原生候选/corner/merge/fallback/same-point/100cap与危险域，leading raw word缺块、source gates/selector/sequence、两步/float/snap/next idle、before/after tile event、turn strict500/unsigned wrap、重规划/校正/display rollback、invalidated/close/EOF。首targeted35/36：错误假设单个障碍会产生终点turn，原生算法仍可绕行而正确发移动；只改独立部分路径夹具、保留失败，再加容量测试，最终37/984通过。

运行`node --test shared/tests/legacy-game-navigation.test.mjs shared/tests/legacy-game-local-movement.test.mjs`；全回归`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`；neutral用`node --test analysis/game-legacy-local-movement-v1/portable-test.mjs`；工程先按tools/build-wechat-app.mjs生成stage158三目录再跑bundle-test。generate_vectors用公开原创helper/metadata，source核验需本地私有原件/REA，未附原件。没有VM/原程序/WER/CDB、账号/官服或原生IDE动作。实际游戏host、完整scene/gates/party/UI/附件、renderer/动画/战斗/auth、现行/设备/三端/官方可玩仍未验。[完整目标](../analysis/game-legacy-local-movement-v1/goal-audit.json)、[交付](../analysis/delivery-manifest-stage158.json)。

<a id="stage157"></a>
## stage157：实体与普通移动验收

**源与完整性：** 2077前清单相符、19候选备份。固定37c4新增109REA记录，48dossier/47唯一入口；35指令/13读/8映射共56匹配，2typed data引用。GNU仅补43ba10无函数callback：REA1520B与484指令、非call CFG479可达核对；没有执行原程序或分析器配置变更。完整导出/快照保存且REA关闭，65方向表与产品数学/范围metadata重提取相符。[核验器](../analysis/game-legacy-actors-v1/verify_source.py)、[回调核验](../analysis/game-legacy-actors-v1/verify_callback.py)、[源回执](../analysis/game-legacy-actors-v1/source-check.json)。

**已通过：** 50unit/13action/9remove、466方向、44移动轨迹895帧、637资源范围/模式、23投影Python原创向量；33新增/947完整Node（0fail/skip）、2neutral及7生成工程。单独临时目录只复制3公开原创文件，targeted/full两轮Python TCP各核1实际移动请求、10消息、2scene、4actor、2action/2remove。覆盖三型/截取、tab与comma空项、own ID、容量1000原子性、重复公告不teleport、名称所有权、state槽桥接、队列/因子/overflow/zero speed、到达延迟idle、方向/投影/资源孔、raw/world、重入scene flag及失败/EOF/close。三新微信构建各90输入/11输出、0外部导入，输出718241/719499/719498B。[测试回执](../analysis/game-legacy-actors-v1/test-results.json)。

**修正与重现：** 首targeted32pass/1fail定位display截断的JavaScript-0，改为源int32式0后33/947全部通过；首neutral1pass/1fail是比较器Array.map保留跨realm原型，改外层Array.from，产品未变，2项重跑通过。失败log/receipt保留。运行`node --test shared/tests/legacy-game-actors.test.mjs shared/tests/legacy-game-motion.test.mjs`；全回归`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`；neutral用`node --test analysis/game-legacy-actors-v1/portable-test.mjs`；工程检查先按build脚本生成stage157三工程再跑bundle-test。generate_vectors只用公开原创helper和metadata；source/extractor/callback核验需本地私有PE/REA/GNU，不随源码附带。

本轮没有VM/原程序/WER/CDB、原生IDE、账号/官服动作。原生x87逐位/真实时钟、本机碰撞寻路预测、复合party/ride/附件/条件生命周期、资源绘制/战斗/其他业务/控制auth、当前及实际三端/官方可玩仍未验。[完整目标](../analysis/game-legacy-actors-v1/goal-audit.json)、[交付](../analysis/delivery-manifest-stage157.json)。

<a id="stage156"></a>
## stage156：自动场景、标签与状态增量验收

**源/前检：** 2057项前清单一致，19候选路径备份；37c4和293记录快照/导出身份匹配。新47REA记录/17唯一函数，17指令/7读取/6映射匹配，default-C256分类表词、4对inner转义、fallback3字节和30/18状态metadata提取/产品一致；完整私有导出/快照后关闭会话。[核验器](../analysis/game-legacy-scene-v1/verify_source.py)、[源核对](../analysis/game-legacy-scene-v1/source-check.json)、[提取器](../analysis/game-legacy-scene-v1/extract_catalog.py)。

**独立验证：** 21场景/119状态/20标签原创向量，16新增/914完整Node（0fail/skip）、2neutral/7生成工程通过。隔离Python TCP在targeted/full两轮各驱动12消息、3场景/3状态、3notice/1patch，核1补取请求；没有手动先装地图，从仅3公开原创文件运行，无私有原件/会话依赖。覆盖源header/mode/位置映射、缓存创建/复用/A2重建/B0跳过、维度/字节所有权、bit0-all/稀疏/缺失/extra、机器折返/截取/字节保留、两次inner标签与阈值、状态快照、reset保留与终止清理。三新微信工程87输入/11输出、0外部导入，输出714639/715897/715896B。[回执](../analysis/game-legacy-scene-v1/test-results.json)。

首targeted为15pass/1fail：夹具的零缓存和零远端校验已一致，产品正确不补取，断言失败；改成独立计算的补丁后远端校验，仅改夹具，targeted重跑/完整回归通过。旧失败log/receipt和修正说明保留。

可运行`node --test shared/tests/legacy-game-scene.test.mjs`、`node --test analysis/game-legacy-scene-v1/portable-test.mjs`；全回归`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`。generate_vectors只读公开原创helper/metadata；verify_source/extract_catalog需私有本地原件/REA，未随源码附带；生成工程检查需先生成stage156三目录。没有VM/原程序/WER/CDB、原生IDE、账号或官服动作。真实场景/actor/资源绘制/移动战斗、属性名/剩余业务、host持久cache/完整auth/当前版本及实际平台/官方仍未验。[完整审计](../analysis/game-legacy-scene-v1/goal-audit.json)、[交付清单](../analysis/delivery-manifest-stage156.json)。

<a id="stage155"></a>
## stage155：地图缓存与协议闭环验收

**源/前检：** 2041项前清单逐项一致，17候选路径备份；37c4原件与247记录导出/快照重核。新增46REA记录/19函数，17指令/4读取/6映射匹配，512 primitive表项独立生成一致，5原始算法样例与288层校验对比一致。4601f0伪代码漏字节算术、大栈帧签名失真以汇编/ESP及原表校正；完整证据私有保存、导出/快照后会话关闭。[核验器](../analysis/game-legacy-world-v1/verify_source.py)、[源核对](../analysis/game-legacy-world-v1/source-check.json)。

**实现验证：** 32矩形/96校验/5补丁原创向量，15新增/898完整Node（0fail/skip）、2neutral/7生成工程通过。隔离Python TCP在targeted/full两轮各核1补取请求，驱动2notice/1patch/1缓存不可用；从仅3份公开原创文件启动，无私有游戏或账号依赖。覆盖三连续层/裁剪/步长/固定1458B、第三层mode mask/OR0xc000、非首minus/32位折返、高字节分隔/首NUL/忽略尾、精确预算/缺失拒绝、输入及缓存所有权/事务/重入/EOF和失败清理。三新微信工程各84输入/11输出、0外部导入，输出707499/708757/708756B。[回执](../analysis/game-legacy-world-v1/test-results.json)。

运行`node --test shared/tests/legacy-game-map.test.mjs`、`node --test analysis/game-legacy-world-v1/portable-test.mjs`；全回归`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`。`generate_vectors.py`只复用公开原创bootstrap，`verify_source.py`需本地私有源/REA证据；生成工程检查需先生成stage155三个目录。无需重跑既有原程序/VM或原生IDE停止点。

**未验：** 没有原程序/VM/WER/CDB、真实账号/官服或原生IDE动作。缓存创建/来源/上下文、native场景guard/viewport/actor、平面游戏角色、绘制/移动战斗、完整认证、现行版本及实际平台/官方可玩均未完成。同步8192轮调度/取消/设备性能缺口沿用。[完整审计](../analysis/game-legacy-world-v1/goal-audit.json)、[交付清单](../analysis/delivery-manifest-stage155.json)。

<a id="stage154"></a>
## stage154：旧版消息目录、协议状态和投影验收

**源/交付前检：** 2021项原清单全部相符，16候选路径备份；37c4与129记录快照/导出身份重核。新增118REA记录，86dossier对应85唯一函数（4ff680内址返已有4ff5a0，不重复计唯一）；15指令/11完整读取/5映射匹配，164标签原字、全部60发送与104接收metadata可重提取并与产品相同。旧大dispatcher完整记录复用，value-flow截断仍保留；新导出/快照保存、会话关闭。[核验器](../analysis/game-legacy-message-v1/verify_source.py)、[源核对](../analysis/game-legacy-message-v1/source-check.json)、[提取器](../analysis/game-legacy-message-v1/extract_catalog.py)。

**独立验证：** 113整数写/265读/1030field/8反转义/104接收/60发送/4binary原创向量（另复用2原创bootstrap），新增17/完整883Node（0fail/skip）、2neutral/7生成工程通过。隔离原创PythonTCP每轮收发验证62回复、104分支、两次材料/一次reset、binary和最终网络位置投影；targeted/full均从仅4份公开原创文件目录启动，不需私有原件。覆盖C边界/空与缺失/额外、所有高字节lead/保护第二字节、整数折返/危险写入域、负/截断binary、112B分支优先、旧key等待/新key替换、float32比例/快照、reentrant close、预算/EOF/失败清理。三新微信工程各83输入/11输出、0外部导入，总输出706671/707929/707928B。[回执](../analysis/game-legacy-message-v1/test-results.json)。

可运行`node --test shared/tests/legacy-game-message.test.mjs`和`node --test analysis/game-legacy-message-v1/portable-test.mjs`；完整回归`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`。`python3 analysis/game-legacy-message-v1/generate_vectors.py`只读公开source metadata及此前原创bootstrap；`extract_catalog.py`/`verify_source.py`需本地私有源/REA证据，不随源码附带。生成工程检查沿现有构建入口，需先构建stage154三个目录。

**失败/未验：** 首neutral脚本断言多一括号，模块加载失败、产品测试尚未运行；修测试后仅重跑该项，原失败日志/回执保留，产品无变。没有VM/原程序/WER/CDB、真实账号/官服或原生IDE动作。位置是意图投影，原actor同步/其余95业务/binary消费者/地图/renderer/移动战斗、完整认证、当前等价、同步派生调度/取消、实际平台与官服可玩均未验。完整目标active/incomplete。[完整审计](../analysis/game-legacy-message-v1/goal-audit.json)、[交付清单](../analysis/delivery-manifest-stage154.json)。

<a id="stage153"></a>
## stage153：旧版payload与初始材料独立实现验收

**源/依赖：** 1991项原清单全部相符，16候选路径备份；37c4、86记录快照身份重核。新43REA记录/16dossier，14指令/8读/4映射全部匹配原件，两表/固定128B参数与产品一致，SHA64常量顺序匹配；SHA大响应沿保留证据分页，value-flow截断保留，已保存新快照并关闭。两个2.4.0依赖12个原源码/许可/包文件及2 provenance，发布包SRI和文件摘要核验，无安装脚本执行。[可复核脚本](../analysis/game-legacy-transform-v1/verify_source.py)、[源核对](../analysis/game-legacy-transform-v1/source-check.json)。

**独立行为：** 24普通/6bootstrap/2拒绝/5任意wire原创Python/stdlib+LibreSSL3.3.6向量，公共[NIST AES/CBC](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf)及[RFC4231 HMAC](https://www.rfc-editor.org/rfc/rfc4231)基础向量通过。新增16/完整866Node（0fail/skip）、2neutral及7生成工程通过；targeted/full实际原创TCP从只含三份公开原创文件的隔离目录运行两次，无私有游戏文件依赖。覆盖有损NUL/尾0x11、8/64边界、32760预算、key/input/output所有权、tag/格式拒绝、hostile/detached/shared/proxy、close及外帧分片组合。三新工程各80输入/11输出，总输出674114/675372/675371B、0外部导入。[回执/日志摘要](../analysis/game-legacy-transform-v1/test-results.json)。

可运行`node --test shared/tests/legacy-game-payload.test.mjs`、`node --test analysis/game-legacy-transform-v1/portable-test.mjs`；完整回归`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`。重生成原创向量`python3 analysis/game-legacy-transform-v1/generate_vectors.py`仅为独立核对固定派生参数需要本地37c4源；普通测试及对端不读取它。微信构建沿现有工具和配置，生成工程检查须先构建stage153三路径。

**失败与限度：** 初专项15/16，标准夹具AES key63hex字符被Buffer截短为31B，库正确拒绝；修正64位并加even-hex检查，产品代码未变。依赖闭包初扫描误识注释import，修正实际语法且复用已核缓存。失败日志/回执保留。neutral7次bootstrap批次8024.702ms仅检查耗时，不是控制基准，UI调度/取消/设备性能未验。未运行VM/游戏/WER/CDB、真实账号/官服或原生IDE；完整握手、字段/状态/移动/战斗、renderer、现行等价及三端可玩仍未验。完整目标active/incomplete。[完整审计](../analysis/game-legacy-transform-v1/goal-audit.json)、[交付清单](../analysis/delivery-manifest-stage153.json)。

<a id="stage152"></a>
## stage152：旧版外帧源与跨平台纯字节核心验收

**源/前检：** 1975项原清单全部匹配，16个候选路径备份；37c4及旧快照/导出身份重核。REA新增47记录/17dossier，10解码指令、4完整读取和3源映射匹配原件；两个数据/非指令查询不算成功指令，4ee380失败不算dossier。大分发函数完整保留但只读首6400/81694字符；value-flow截断保留，导出/快照已保存、会话关闭。[源核对](../analysis/game-legacy-network-v1/source-check.json)、[可复核脚本](../analysis/game-legacy-network-v1/verify_source.py)。

**本机实现：** 24份原创Python向量，新12/完整850Node（0fail/skip），2无DOM/Node/wx/text/network API bundle与7生成工程检查通过；原Python对端在targeted/full各实际loopback收发一次。覆盖每个小拆分/逐字节、0/1B门槛、多帧、噪声/假标记、截断/坏尾/高位长度、精确256KiB/消费后压紧、输入输出所有权、终止清空。三新微信工程各71输入/11输出、0外部导入，总输出672239/673497/673496B。[测试与日志摘要](../analysis/game-legacy-network-v1/test-results.json)。

可重跑`node --test shared/tests/legacy-game-envelope.test.mjs`和`node --test analysis/game-legacy-network-v1/portable-test.mjs`；完整回归为`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`，原创向量由`python3 analysis/game-legacy-network-v1/generate_vectors.py`生成。构建脚本和配置沿现有入口，生成工程本机回归需先显式构建相应stage152输出。原件核对脚本需要用户本地私有材料，不随源码附带。

**未验：** 没有VM/原程序/WER/CDB、真实账号/官方游戏服务器或原生DevTools动作；原禁用端口停止点未重试/绕过。帧内转换/认证/状态/移动/战斗/renderer、现行版本等价、三平台可玩及官方接受未完成。报告聚合相对路径错误已修正，不重跑通过的产品检查。完整目标仍active/incomplete。[完整审计](../analysis/game-legacy-network-v1/goal-audit.json)、[交付清单](../analysis/delivery-manifest-stage152.json)。

<a id="stage151"></a>
## stage151：完整成员、源码工具和首批消费者核验

**通过：** REWise源码包1,971,013B/SHAce21d669…af09fec、固定Git commit及所选源码Git blob逐项匹配，configure/build/version/list/script-dump均exit0，工具v0.4.0-dev，只在build。普通两成员精确DEFLATE/大小/脚本和流尾CRC、完整SHA通过；原创核验器1正/6负夹具通过。REA6.7.0/Ghidra12.1.4取得39记录/8dossier，8指令、4读、4源映射与实际成员匹配，快照已导出，会话已关闭。[原创核验器](../analysis/game-release-current-v1/verify_source.py)、[REA与源字节核对](../analysis/game-release-current-v1/source-check.json)。

**限定或失败：** 完整历史载体下载因速率/预算主动中止，exit130且只保留30,343,168B；两成员另由精确范围完整取得，不能声称整包完整。Inno列表exit2、7-Zip仅嵌入gzip、网页/日志编码错误与FTP421都保留，最小处理见[唯一排障条目](known-issues.md#stage151-release-source)。HTTPS页面和FTP/MD5身份并非发行包签名验证；范围前核SIZE/MDTM，未在范围后重新核远端元数据。

**本轮未运行：** 产品JS测试/构建（产品代码未改；上次stage150为838Node/2portable/7工程）、原程序/VM/WER/CDB/实际IPC/账号/游戏服务及原生IDE。当前版本、资源效果、业务协议与真实可玩仍未验证，不能以新增旧版消费者替代这些门槛。[首批静态合同](../analysis/game-release-current-v1/static-contract.json)、[完整目标审计](../analysis/game-release-current-v1/goal-audit.json)。

<a id="stage150"></a>
## stage150：RD结构模型与全语料差分

**已完成：** 四份图形/索引前后SHA一致，独立Python/JS比较27,785条压缩记录的四份值/mask摘要、尺寸、计数/命令统计；27,751接受、34同ordinal拒绝，32份旧实验零占位摘要样例仍一致。48原创Python编码覆盖8种支持命令与跨像素/palette边界。新增9项、完整838Node，2neutral bundle及7生成工程检查实际exit0，无失败/取消/跳过。[完整差分摘要](../analysis/game-rd-runs-v1/corpus-comparison.json)、[测试回执](../analysis/game-rd-runs-v1/test-results.json)。

**构建：** esbuild0.25.12生成默认、本地、资源三工程，各70输入/11输出/0外部导入；体积分别671,344、672,602、672,601B。neutral模型/资源codec bundle12输入/1输出，测试时无DOM/Node/wx/text宿主能力。文件原始bytes保留，known mask在恢复后重新计算；未把本机JS/API形状测试当原生平台证明。

**未完成：** 原主游戏业务消费者、颜色/透明/方向/动画、实际renderer、账号/官服及设备接受。无新REA native、VM/原程序/WER/CDB/官方会话或原生IDE动作；连接器github.fetch返回Unknown tool后只用公开主站只读HTTPS完成参考身份，不改配置。历史raw解码/页面和native保留。[源与限制](../analysis/game-rd-runs-v1/source-check.json)、[唯一排障条目](known-issues.md#stage150-rd-runs)、[完整目标审计](../analysis/game-rd-runs-v1/goal-audit.json)。

<a id="stage149"></a>
## stage149：配置器来源、纯codec与回归

修改前1934项清单逐项相符，16路径备份；原Config.exe和23B数据重新匹配。REA34成功记录（4 Ghidra dossier）、14指令/6字节读/3源映射和5资源payload相符，GNU静态43回调指令匹配原件，dialog13控件恰消费792B。3次无函数选择不计成功，改用现有objdump，没有安装/配置修改或原目标运行。[来源检查](../analysis/game-config-v1/source-check.json)。

最终实际退出0：新增7/完整829 Node、3无DOM配置bundle及7生成工程检查；64原创保存和31读取向量涵盖最大52B、前256截断、NUL、子串、大小写、数字/溢出/非法值、所有权和无getter。现有23B模板无NUL且匹配规范writer。三个微信工程各69输入/11输出、0外部导入；portable核心12输入/1输出无外部import。[日志/回执/构建](../analysis/game-config-v1/test-results.json)。

没有原配置器GUI/游戏执行、原生写安装目录、VM/WER/CDB/账号/官服；配置编辑界面、实际游戏读取/渲染效果与平台/官方可玩未验证，bounded EOF不是原生未终止栈的等价证明。原生工具停止点未重试/修改/复核。[完整审计](../analysis/game-config-v1/goal-audit.json)。

<a id="stage148"></a>
## stage148：资源持久化的本机验收与实际平台缺口

修改前1918项清单逐项相符，21个候选路径备份。纯资源快照/消费者/路径/摘要/当前调用者、旧目录封套和原生工具停止点文件保持原hash；新容器为原创实现，无新REA/VM/游戏/CDB/账号/官服动作。[源码绑定](../analysis/launcher-wechat-resource-cache-v1/source-check.json)。

最终命令实际退出0：822/822 Node，0fail/cancel/skip；20新增，6Python封套、64MiB/32MiB每文件和1024x259路径覆盖，包含canonical/摘要/绑定/CAS/恢复/迟到/超时/共享存储拒绝。7生成工程检查通过，真实原创文件在新JS环境恢复、明确选择后完成原创Python current交换；三个工程各68输入/11输出、0外部导入，许可证正文保留。[日志/回执/构建](../analysis/launcher-wechat-resource-cache-v1/test-results.json)。

先前821/7通过后又复现deadline续接未清交付buffer，保留失败与修前hash，修复后重构建并跑最终822/7；另两次夹具失败保留并区分测试计数字段与非幂等迁移，未削弱原消费者。实际微信quota/内存/FS与WXML、跨worker/进程/断电、AppID/设备/HTTPS、官方与原游戏可玩仍未验。既有native服务门槛未重试、未改设置、当前设置未复核。[完整审计](../analysis/launcher-wechat-resource-cache-v1/goal-audit.json)。

<a id="stage147"></a>
## stage147：当前补丁调用者的本地与静态验收

1905项既有清单修改前逐项相符，21个候选路径备份。当前c82/195原件及匹配历史导出重核；REA6.7.0/Ghidra12.1.4新增30记录、7函数dossier，14指令原件字节和4源映射相符，最后会话已关闭。[源检查](../analysis/launcher-current-patch-v1/source-check.json)。

实际完整Node命令退出0：802/802，0fail/cancel/skip；新增10项，370原创命令向量并用Python stdlib核有空格路径、22轮询和36退出组合。5生成工程检查通过，包含真实本机ZIP/relay/原创Python对端；三个独立微信构建各65输入/11输出、0外部导入。[日志/回执/构建hash](../analysis/launcher-current-patch-v1/test-results.json)。

静态证据、纯格式、JS宿主与生成工程层已验；当前Web配置绑定是源接线加API流程检查，本轮未做新浏览器渲染或原生WXML。完整Win32路径/locale/文件存在性、手机/微信/AppID/HTTPS/资源持久化及官方游戏未验；既有DevTools关闭服务停止点未重试、设置未复核或改动。完整目标仍active/incomplete。[完整审计](../analysis/launcher-current-patch-v1/goal-audit.json)。

<a id="stage146"></a>
## stage146：792Node和5生成工程通过，资源仅本地候选验收

**实际测试：** 最终`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`792/792，19新增，0失败/取消/跳过；`node --test analysis/launcher-wechat-patch-v1/bundle-test.mjs`5/5。原有50补丁/文件及23宿主回归先通过；新增专项19通过，涵盖实际固定relay原字节/头隔离/Origin/路径/重定向/断开取消，原创建Python ZIP、多批1024文件、别名/树/CRC入口、未知源不请求、原备用ordinal1、总期限永不settle provider和输入快照。[命令/退出/日志哈希](../analysis/launcher-wechat-patch-v1/test-results.json)。

**实际运行/构建：** 真实本机原创ZIP文件在无DOM生成App/Page中只读导入，目录→来源→候选明确选择→原创Python登录交换走通，选择持续到交换完成；另检查占位解除选择、隐藏/迟到不复活、旧本地配置回归。三个工程64输入/11输出，643160/644418/644331B，0外部导入，完整BSD声明匹配；是JS与本地文件/HTTP证据，不是原生WXML编译、TLS、设备或包大小权威。[源码/构建绑定](../analysis/launcher-wechat-patch-v1/source-check.json)。

**失败/修复：** 新增隐藏返回用例修前1/1失败，根因reset同时清来源列表而父级仍保留目录选择；修为清数据后按当前目录重建可选来源，仍不自动选择。初次5生成检查4过1失败，是测试DNS映射返回真实loopback Response.url，被产品正确拒绝；修测试Response包装，产品最终URL/重定向限制保留。资源选择到交换断言同时加强，日志与修前source hash留存。[排障](known-issues.md#stage146-wechat-resources)。

**源复核/未验收：** Patcher项目副本578560B匹配195f3afd；四份历史导出/快照匹配。两个旧/tmp原件失效，旧601b主程序未在限定项目候选中定位，c7ba与当前c82不作替代。本轮原程序执行、REA新查询、CLI/VM/CDB/账号/官服0；未重试原生服务停止点，未部署HTTPS/公网桥接。真实平台/域名/设备/存储、资源持久化、Win32事务及原游戏业务/可玩仍缺接受。[完整审计](../analysis/launcher-wechat-patch-v1/goal-audit.json)。

<a id="stage145"></a>
## stage145：773Node和4生成工程通过，缓存仅本地层验收

**实际测试：** 最终`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`773/773（22新增），0失败/取消/跳过；`node --test analysis/launcher-wechat-cache-v1/bundle-test.mjs`4/4。记录UTF8/GB18030/高revision由独立Python struct/hashlib逐字节核对并反向解析；畸形header/摘要/XML/尾随/预算、原始BOM行尾、双slot恢复、冲突/CAS/并发、目录错误不当缺失、迟到write与buffer生命周期均有检查。[命令/退出/哈希](../analysis/launcher-wechat-cache-v1/test-results.json)。

**实际运行/构建：** 真实本机自有测试目录检查跨store/JS环境持久读回并保留原创无关marker；其文件API由Node facade提供，不是微信。实际生成CJS/App/Page在无DOM环境走HTTP→原始字节保存→新JS环境检查/显式恢复→同一current原创Python对端交换，另验证App hide未知写结果/迟到状态。三个独立本地工程各57输入/11输出，588157/589415/589126B，0外部导入，完整BSD声明仍匹配；不是原生包大小/编译或设备权威。[源码/构建绑定](../analysis/launcher-wechat-cache-v1/source-check.json)。

**失败/纠正：** 首轮19项18过1失败，夹具误将1MiB ASCII XML当可接受，忽略既有256KiB字符上限；保留产品限制，修夹具后19过。初次全回归771过后复核新增可变expectedRevision用例，修前1/1失败（过期写被放过）；固定own data选项快照并增getter/字段边界，最终22专项/773完整/4工程通过。保留日志、修前源码及回执，早期绿灯不冒充最终版本证明。[排障](known-issues.md#stage145-wechat-cache)。

**未验收：** 本轮原生CLI/VM/Windows/游戏/CDB/账号/官服动作0，旧服务关闭停止点未重试。真微信文件系统、AppID/域名/设备/渲染、跨worker/进程与断电耐久性、资源补丁、原生事务、官方及原游戏可玩仍不成立；完整目标active/incomplete。[既有原生停止点](../analysis/launcher-wechat-host-v1/native-ui-audit.json)、[完整审计](../analysis/launcher-wechat-cache-v1/goal-audit.json)。

<a id="stage144"></a>
## stage144：751Node、4生成工程通过；没有新原生或官方验收

**实际测试：** Node v26.9.0/ICU78.3，`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`751/751，新增32项，0失败/取消/跳过；`node --test analysis/launcher-wechat-bootstrap-v1/bundle-test.mjs`4/4。完整回归含浏览器默认bootstrap、三个HTTP模块夹具路由、全部有效UTF-8标量1112064、GB18030双字节23940及有效四字节指针1087996与native ICU对照、畸形/预算/BOM、HTTP重定向/头/块/最终重复数据/期限取消、文件大小/类型/迟到，以及真实host刷新失效与原创Python会话。[哈希/命令/日志](../analysis/launcher-wechat-bootstrap-v1/test-results.json)。

**实际构建/运行层：** 三个本地输出`build/wechat-app-stage144`、`build/wechat-app-local-stage144`、`build/wechat-app-http-stage144`各54输入/11输出，分别564798/566056/565734B，0外部导入；linked WHATWG BSD声明在输出内。实际生成CJS/App/Page/lifecycle在独立无DOM环境运行，原创HTTP与文件API形状夹具、固定原创Python对端均在本机；HTTPS fixture URL仅显式映射至自有127.0.0.1服务，未测试真实微信HTTPS/TLS/证书或域名批准。没有把工程字节数当原生包大小权威。[来源/报告](../analysis/launcher-wechat-bootstrap-v1/source-check.json)。

**失败已处理：** 初次5项解码专项4过1失败，是BOM测试把code point误作pointer；纠正为固定84319533字节。首轮25项21过4失败：宿主丢allowBareAmpersands影响3项、GB测试XML缺必需EXE影响1项；修产品/夹具后25过，增补后29过，最终751全回归通过。日志保留且不抹去失败；未为测试放宽协议/平台门槛。[排障](known-issues.md#stage144-wechat-http)。

**交付许可检查：** 初次linked notice断言失败，定位生成器匹配到引言BSD名称而非独立标题；修正后重生成，三份输出均与完整BSD正文匹配，最终751Node/4工程在此之后通过。原始错误notice与审计摘要保留在私有build，源LICENSE一直完整。[准确哈希](../analysis/launcher-wechat-bootstrap-v1/source-check.json)。

**未执行/未验收：** 本轮原生DevTools尝试0，既有service-disabled门槛保留，没有修改工具设置/重试；原生编译渲染、游客AppID接受、手机、文件选择对App/Page hide的影响、网络配额/后台timer仍待验。没有新VM/Windows/游戏/CDB/真实账号/官服请求、发布或提交。微信缓存/补丁资源、原生事务及原游戏业务消费者/可玩保持未完成，完整goal active/incomplete。[原生旧回执](../analysis/launcher-wechat-host-v1/native-ui-audit.json)、[完整审计](../analysis/launcher-wechat-bootstrap-v1/goal-audit.json)。

<a id="stage143"></a>
## stage143：微信宿主本地实现通过，原生模拟器未验收

| 层级 | 实际结果 |
| --- | --- |
| 前态/复用 | 原1817项修改前全匹配，13份候选前态保留；原核心/协议与stage142入口不改，0新REA查询 |
| 宿主 | 目录/区域/原Galaxy ordinal、显式三编码/16B输入、四页确认、current会话/候选、隐藏/卸载/迟到清理 |
| Node | 新增10、完整719通过；输入修改提示的新断言先失败再修产品；CJS夹具scope失败单独保留 |
| 工程JS | 默认和原创配置各生成10文件、46输入/0外部import，另2项无DOM检查实际加载App/Page/bundle完成原创Python交换/清理 |
| 原生尝试 | 公开CLI+官方SDK0.13.0一次，trustProject=false，无登录票据/其他项目AppID，明确服务端口关闭；退出1、0连接/渲染检查/截图 |
| 未改设置 | 未开启服务端口/安全配置、换信任标志、重试相同拒绝或借用其他项目；未上传发布 |
| 未验证 | WXML原生编译/渲染、游客占位/实际AppID、真手机/域名/JS运行、账号/官服/HTTP资源及原游戏消费者/可玩 |
| 完整目标 | 实际实现进展，goal active/incomplete；rev40仍20项/7 observed/13 unknown；不能用JS构建/原创交换缩小目标 |

[来源](../analysis/launcher-wechat-host-v1/source-check.json)、[实施规格](../analysis/launcher-wechat-host-v1/implementation-spec.json)、[测试和构建回执](../analysis/launcher-wechat-host-v1/test-results.json)、[原生工具回执](../analysis/launcher-wechat-host-v1/native-ui-audit.json)、[配置/运行](../wechat/README.md#stage143)、[完整目标](../analysis/launcher-wechat-host-v1/goal-audit.json)、[交付](../analysis/launcher-wechat-host-v1/validation.json)、[清单](../analysis/delivery-manifest-stage143.json)。没有本轮浏览器渲染、VM/厂商执行/CDB/新转储或游戏服务器/账号动作。

<a id="stage142"></a>
## stage142：微信会话薄适配的本地实现验证通过

| 层级 | 实际结果 |
| --- | --- |
| 前态/来源 | 修改前1800项清单匹配、15份候选前态保留；复用同SHA的REA合同，0新二进制查询 |
| 实现 | 现有session取消端口与异常清理；新增WeChat TCP/CSPRNG/private取消/本地期限clock组合current flow，无新协议字段 |
| 修复前 | finally修正后的3项控制器回归在基线自然失败，exit1；首次中断夹具与失败日志单独保留 |
| Node | 新增23项；完整shared/web709通过、0失败/取消/跳过，Node26.9.0 |
| 独立对端 | Node提供wx API形状，TCP只映射到固定本机原创Python；正常登录报文字节、错误组与原选择门槛通过，不是账号/微信证据 |
| 构建 | 固定本地esbuild0.25.12/registry完整性，生成119241B CommonJS、37输入、0外部import；源码哈希有报告 |
| bundle专项 | 另1项检查在无DOM AbortController/crypto/performance/Buffer/require/fetch/URL/TextEncoder等VM完成原创交换；这是JS构建运行证据 |
| 纠正/限制 | 官方Performance未声明now，已用独立timer-floor clock；TCP write仅接受，原生消费/域名/配额/JS能力仍未验 |
| 未执行 | 无渲染页面/真手机/微信开发者工具或上传发布；无VM/厂商/CDB/新转储/官方服务器/账号动作 |
| 完整目标 | 实际实现进展，goal active/incomplete；微信完整宿主/HTTP资源、游戏消费者/可玩与官方接受未完成，rev39仍7/13 |

[来源](../analysis/launcher-wechat-v1/source-check.json)、[实施规格](../analysis/launcher-wechat-v1/implementation-spec.json)、[测试与构建命令/哈希](../analysis/launcher-wechat-v1/test-results.json)、[接入](../adapters/wechat/README.md#stage142)、[完整目标](../analysis/launcher-wechat-v1/goal-audit.json)、[交付核验](../analysis/launcher-wechat-v1/validation.json)、[清单](../analysis/delivery-manifest-stage142.json)。

<a id="stage141"></a>
## stage141：恢复消费者的有限静态合同通过

| 层级 | 实际结果 |
| --- | --- |
| 前态 | 原1794项交付修改前全匹配，12份候选前态保留 |
| 身份与复用 | 固定7eb173/814080B重核，复用57条native replay；旧target-free资源inventory仍在原58条ledger |
| REA | 新6份调查/12记录，6段2760B原件相等，17处指令确认；新high-pcode完整，no-return/默认签名限制保留 |
| 恢复合同 | 无日志查询、stage1/2..4/5分支及presence/delete/move/backup行为；query-invalid与物理缺失、AL1与恢复成功分开 |
| 收尾 | 完整bundle69条/快照69条私有导出，REA open=false/cleanup_pending=false/analysis_run=null |
| 产品/测试 | shared/web/native/adapters217项保持；无新增代码/测试/构建/渲染，686Node和46浏览器是stage140历史结果 |
| 未执行 | 无VM/厂商程序、CDB/转储、文件恢复、游戏服务器或账号动作，无新的手动/审批请求 |
| 目标 | 实际消费链分析进展；goal active/incomplete，rev38仍20项/7 observed/13 unknown，完整游戏与设备/官方接受未完成 |

[来源/字节核验](../analysis/launcher-recovery-state-v1/source-check.json)、[状态/动作合同](../analysis/launcher-recovery-state-v1/static-contract.json)、[完整目标](../analysis/launcher-recovery-state-v1/goal-audit.json)、[交付核验](../analysis/launcher-recovery-state-v1/validation.json)、[清单](../analysis/delivery-manifest-stage141.json)。现有构建运行命令与依赖不变，无本轮兼容运行或恢复故障矩阵通过声明。

<a id="stage140"></a>
## stage140：启动声明校验的有限实现验收通过

| 层级 | 实际结果 |
| --- | --- |
| 前态/源码 | 原1782项交付修改前全匹配，13份候选前态保存；既有产品只改shared/launcher-update.mjs，新增原创测试 |
| REA | 当前两端7新调查/23记录，9段5792B与原件相等；新调查完整，旧入口截断/假设保留，会话已关闭无待清理 |
| 声明来源 | packed与分析映像所选21B marker相同；packed整表格式拒绝单独保留，不宣称完整加载器有效 |
| Node | 原创23项改前全失败，改后72相关及完整686通过；Node26.9.0，退出码分别1/0/0 |
| 固定候选 | 未改packed原件包装私有原创ZIP，经现有decoder解码相等，v1/1语言；不是官方ZIP、未执行 |
| 浏览器 | Browser plugin not available，复用Playwright1.64.1/Chrome156.0.8078.74；测试页点击触发真实ESM decoder，1100×820和390×844各23项通过 |
| 浏览器收尾 | URL/非空/交互/无横溢出、无console/page错误、仅回环请求通过；截图已目视，owned contexts/browser/server正常关闭、端口拒绝连接 |
| 未运行 | 无native构建、厂商程序/VM/CDB/新转储/游戏服务器/账号操作；浏览器测试页不是完整登录页、真手机或微信验收 |
| 目标 | 实际分析与实现进展，goal active/incomplete；rev37仍20项/7 observed/13 unknown，原游戏消费者/可玩与官方接受未完成 |

[源检查](../analysis/launcher-startup-ack-v1/source-check.json)、[实施规格](../analysis/launcher-startup-ack-v1/implementation-spec.json)、[测试命令和日志哈希](../analysis/launcher-startup-ack-v1/test-results.json)、[浏览器回执与截图路径](../analysis/launcher-startup-ack-v1/browser-audit.json)、[完整目标](../analysis/launcher-startup-ack-v1/goal-audit.json)、[交付核验](../analysis/launcher-startup-ack-v1/validation.json)、[清单](../analysis/delivery-manifest-stage140.json)。

运行`node --test shared/tests/launcher-update-ack.test.mjs`复验所选资源边界；完整命令`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`。浏览器runner与截图在项目外本地目录，私有原候选/REA全量材料留build，不加入源码交付。

<a id="stage139"></a>
## stage139：两端接管就绪交接的有限静态合同通过

| 层级 | 实际结果 |
| --- | --- |
| 前态 | 原1776项交付修改前全匹配，12份受影响/候选文档与导出前态保留 |
| 身份 | 当前packed6d459/分析c82fc98、内嵌更新器7eb173完整SHA重新相符，匹配快照复用 |
| REA | 父侧7/更新器12新记录，共5新dossier；7段11948B与原件相等，含3132B旧callback重核 |
| 新合同 | 接管就绪事件的创建、正常父路径检查、置位、100ms/60秒轮询、等父退出后才恢复/更新；不等同startup ACK/commit |
| 工具限制 | 名称SetEvent未解析以PE IAT/xrefs补证；默认void以AL指令/调用方补证；入口pcode截断下界1/terminal假设保留 |
| 收尾 | 两份完整REA包/快照私有导出，最终open=false/cleanup_pending=false/analysis_run=null |
| 未改变/未运行 | 产品/模块接口/资源解析/构建流程不改；0新测试/构建/浏览器/设备、0厂商执行/VM/CDB/转储/游戏服务器或账号操作 |
| 目标 | 实际分析进展，完整goal active/incomplete；rev36仍20项/7 observed/13 unknown |

[源证据](../analysis/launcher-handoff-ready-v1/source-check.json)、[合同及真值表](../analysis/launcher-handoff-ready-v1/static-contract.json)、[完整目标](../analysis/launcher-handoff-ready-v1/goal-audit.json)、[文件核验](../analysis/launcher-handoff-ready-v1/validation.json)、[交付](../analysis/delivery-manifest-stage139.json)。原字节匹配和静态分支表不证明实际窗口退出、事件调度、文件替换/恢复、新进程ACK、真实认证、游戏消费者或三平台/官方可玩；663Node为stage137历史结果，本轮没有重测。

<a id="stage138"></a>
## stage138：既有转储固定64B查询完成，未取得游戏消费者

| 层级 | 实际结果 |
| --- | --- |
| 前态 | 原1770项交付修改前全匹配，9份规范文档前态保留 |
| 输入/前检 | 1→输出1及短命令实际执行；dump完整SHA/16924391B、CDB完整SHA/Valid、空symbols/无ntsd.ini、新日志False、进程0通过 |
| 离线查询 | 一次CDB -z，12参数先完整回读，固定两段各32B；退出0、8880B/74行日志完整SHA已读 |
| 有限比较 | 初始化32B未捕获；故障32B可读，与原0x011bd152参考有31B不同；完整32B/26B后缀在原件精确搜索均0 |
| 收尾 | 原dump SHA前后相同，游戏/CDB进程0，空提示符；无新游戏/读取器/转储/附加或配置变更 |
| 代码/测试 | 产品代码、架构/接口/资源格式/构建流程未改，本轮测试/构建/浏览器/手机/微信0；663Node为stage137历史结果 |
| 规格/目标 | rev35仅补证据，仍20项/7 observed/13 unknown；本轮为实际诊断进展，完整goal active/incomplete |
| 未验 | 精确CDB进程起止时刻、未知代码归属/根因/业务消费者、真实认证/更新事务、三平台与官方可玩 |

[输入及前检](../analysis/game-text-observer-runtime-v1/access-stage138.json)、[查询和源比较](../analysis/game-text-observer-runtime-v1/code-fingerprint-stage138.json)、[完整目标](../analysis/game-text-observer-runtime-v1/goal-audit-stage138.json)、[文件核验](../analysis/game-text-observer-runtime-v1/validation-stage138.json)、[交付](../analysis/delivery-manifest-stage138.json)。主机32B哈希来自可见hex转录后的计算，未伪称来宾直接二进制hash；原始完整日志和dump仅留来宾。没有新增REA会话或把历史663项写成本轮重测。

<a id="stage137"></a>
## stage137：现行更新参数字节实现通过，游戏读数未取得

| 层级 | 实际结果 |
| --- | --- |
| 前态/源 | 原stage136的1760项交付修改前全匹配；当前c82fc98固定映像未执行 |
| REA | 新5dossier/14records，7段4933B全部与原文件相等；完整包/快照私有，最终open=false/cleanup_pending=false |
| 新实现 | pure shared encoder，own输入/ASCII子集、内部SP→管道、五字段/≤570B；未实现原生执行/事件/替换/页面接线 |
| 首轮/修正 | 88项初跑78通过/10失败，合成MD5误34B；只修夹具32B，未放宽产品门槛，截断的工具输出私有保留 |
| 最终测试 | 新13项、相关88/88、完整shared+web Node663/663，Node26.9.0；含既有原创本地WS/TCP/Python场景 |
| VM输入 | 现有画面可读，既有Win+Q打开搜索；普通输入无确认，0命令/0CDB/0游戏/0dump字节，无新人工请求或配置变更 |
| 未运行/未验收 | 本轮浏览器/物理手机/微信、Swift构建、原生更新事务/ACK/恢复、真实账号/原游戏业务/官方可玩 |
| 规格/目标 | rev34仍20项/7 observed/13 unknown；有限实际实现进展，完整goal active/incomplete |

[源及限制](../analysis/launcher-update-arguments-v1/source-check.json)、[实现](../analysis/launcher-update-arguments-v1/implementation-spec.json)、[测试日志摘要](../analysis/launcher-update-arguments-v1/test-results.json)、[输入实际状态](../analysis/game-text-observer-runtime-v1/access-stage137.json)、[完整目标](../analysis/launcher-update-arguments-v1/goal-audit.json)、[交付核验](../analysis/launcher-update-arguments-v1/validation.json)、[清单](../analysis/delivery-manifest-stage137.json)。

<a id="stage136"></a>
## stage136：实际现行页面接线验收，完整目标保持未完成

| 层级 | 实际结果 |
| --- | --- |
| 前态/源 | 原1747项交付一致；现行6d459原件与c82fc98分析映像完整SHA核对，非c7ba69旧样本默认等同 |
| REA | 3新dossiers、14指令及7literal字节独立匹配；worker/HTTP high-pcode截断和body/terminal限制保留，完整原始证据私有；最终关闭无待清理 |
| 修复前 | 新5项桥接/profile回归4失败/1通过 |
| 实现测试 | 加真实当前/旧WS-TCP独立Python及错误组后8项通过；完整Node650/650（shared+web） |
| 实际页面 | Chrome156.0.8078.74 / Playwright1.64.1，1100×820/390×844，6场景通过；身份/非空/无错误覆盖层/控制台/截图/交互均检查；6PNG中3张已观察 |
| 失败/收尾 | 初轮runner仅夹具预期错误，失败保留后修runner；后续原创对端信号处理改动，8项受影响回归与真实CLI启动/Ctrl+C退出0通过，未重复全650/6browser；浏览器/对端/服务正常关闭，4176无监听 |
| 状态/规格 | rev33仍20项/7 observed/13 unknown；有证据的登录器产品进展，goal active，不复用旧blocked计数 |
| 未验收 | 真实账号/服务器身份、完整原生更新器事务/locale、原游戏业务消费者/玩法、真手机/微信/官方可玩 |

[源字节与限制](../analysis/launcher-current-page-v1/source-check.json)、[测试](../analysis/launcher-current-page-v1/test-results.json)、[实际页面/截图/初轮失败](../analysis/launcher-current-page-v1/browser-audit.json)、[完整目标](../analysis/launcher-current-page-v1/goal-audit.json)、[文件/引用核验](../analysis/launcher-current-page-v1/validation.json)、[交付清单](../analysis/delivery-manifest-stage136.json)。未构建native或发布应用，无厂商/VM/游戏服务器操作；接口、资源格式、架构和运行说明同步。

<a id="stage135"></a>
## stage135：阻塞审计，未宣称完整交付

| 证据层 | 实际结果 |
| --- | --- |
| 当前材料 | 原1743项交付、两个安装原件、已知app根12文件全哈希匹配；三游戏原.text RawSize0，不能据此否定其他节代码 |
| 存活状态 | REA open=false/cleanup_pending=false，analysis_run=null；无确认live作业或verified wait |
| 三轮 | 同一缺口持续133/134/135；保留133有限工具进展与134历史纠正，不复用旧76/130阻塞区间；135无实现进展 |
| 完整目标 | 五项要求均有限、不完整或未验证；没有游戏业务消费者/实际可玩或三平台/官方接受 |
| 产品与规格 | 211项产品文件与协议rev32保持，20项仍7 observed/13 unknown；无代码、字段、测试/构建或新VM/游戏/转储/网络操作 |
| 状态 | goal已标记为blocked；达到连续三轮且无独立可行步骤条件，状态按工具实际回执记录 |

[逐项/三轮审计](../analysis/game-material-gzip-v1/blocked-audit-stage135.json)、[状态回执](../analysis/game-material-gzip-v1/goal-status-stage135.json)、[文件/引用核验](../analysis/game-material-gzip-v1/validation-stage135.json)、[交付清单](../analysis/delivery-manifest-stage135.json)。本轮审计、清单和文档不作游戏实现进展；架构/接口/格式实现/构建方式未变。

<a id="stage134"></a>
## stage134：历史纠正与有界直接引用核对

| 证据层 | 实际结果 |
| --- | --- |
| 前态 | stage133清单1740项/46647129B全部匹配，11份受影响文件前态留私有build；保留历史清单本身 |
| 历史 | stage40和133同一外/内层SHA、长度、CRC/ISIZE；纠正首次发现，无新游戏材料 |
| DLL检查 | 四个已记录DLL完整SHA匹配；16项直接ASCII/UTF16LE文件名/基名搜索均0，非间接读取不存在证明 |
| 会话 | REA6.7.0当前open=false/cleanup_pending=false、analysis_run=null，无live分析句柄/verified wait |
| 产品 | 211项既有产品文件未改；无测试/构建、VM/游戏/转储或网络操作；原10项工具测试是stage133历史结果 |
| 规格 | rev31→32只纠正样本历史和成员措辞；20项仍7 observed/13 unknown，无新字段/实现准入 |
| 完整目标 | 登录器有限实现保留；真实认证/完整交接、游戏消费者与实现、三平台及官方接受均未完成；当前同一材料缺口计2，goal保持active |

[事实、逐项要求与计数](../analysis/game-material-gzip-v1/continuation-audit-stage134.json)、[本轮文件/引用核验](../analysis/game-material-gzip-v1/validation-stage134.json)、[交付清单](../analysis/delivery-manifest-stage134.json)。本轮纠正和负向线索核对不当游戏实现进展，架构/产品接口/资源格式实现/构建流程保持。

<a id="stage133"></a>
## stage133：普通gzip工具与既有成员的格式检查

| 证据层 | 本轮实际结果 |
| --- | --- |
| 前态 | 原1733项/46283185B交付哈希一致，9份受影响规范文档/矩阵前态保留 |
| 原件/游戏身份 | 两安装原件完整SHA重核匹配；已知app根12文件/三游戏哈希及原.text file_bytes0已读；未重解包或执行原件 |
| 新分析工具 | 默认1MiB输入/8MiB展开，完整单gzip成员/无尾随，SHA绑定/新目录/原件保留；无全局依赖/配置变更 |
| 原创验证 | 最终10项夹具/CLI测试通过，包括错CRC/截断/拼接/尾随/预算/错hash及拒绝覆盖；早期8项通过后新增两项CLI保留验证再运行 |
| 真实材料 | 89fe1c…ca213c的500154B展开为668a1a…29fb60的706686B，CRC32/ISIZE/eof一致、尾随0，原件不变；完整成员留私有build |
| 格式与REA | 默认打开返回unsupported_target/file_format_rejected；19 MZ候选无完整MZ/PE配对、9 PE候选无合格PE32/PE32+头，字面量零匹配不作缺代码证明；最终REA关闭无待清理 |
| 规格同步 | rev30→31，仍20项/7 observed/13 unknown；仅样本、交接与依赖边界/引用和下一步更新，5个既有根形式证据路径按本行相对位置规范化 |
| 产品/平台 | 211项既有产品文件未改；无产品测试/构建、新VM/游戏/读取器/CDB运行、游戏服务器请求或联机验收；只读规范查阅不当官服请求 |
| 完整目标 | 五项逐一为有限证据/不完整/未验证；本轮为有界工具和既有成员的格式补查；gzip事实已见stage40，新的路线耗尽区间从133计1，goal保持active/incomplete，无live作业等待 |

[普通gzip检查回执](../analysis/game-material-gzip-v1/inspection.json)、[材料与REA错误](../analysis/game-material-gzip-v1/material-audit.json)、[完整目标审计](../analysis/game-material-gzip-v1/completion-audit.json)、[文件/引用核验](../analysis/game-material-gzip-v1/validation.json)、[交付清单](../analysis/delivery-manifest-stage133.json)。既有格式CRC、工具测试和补充格式检查均不等于游戏消费者、崩溃根因、真实认证或网页/移动网页/微信/官方可玩。架构、产品接口和构建流程未改，受影响的资源格式文档已同步。

<a id="stage132"></a>
## stage132：静态来源与既存转储有限对应验收

| 证据层 | 本轮实际结果 |
| --- | --- |
| 前态 | stage131的1727项/45920333B交付重核一致；7份规范文档前态保留 |
| 静态REA | 5份函数调查+10个指令锚点+1份引用，共16条；15个ID未见于已核96/131包，注册链本身此前已知 |
| 原字节核对 | 10处指令与固定9baa…9d3126原文件匹配；14个连续DWORD写入覆盖56B初始化记录 |
| 分析限制 | setter高层pcode截断3000操作；section选择器默认void与EAX使用不符，保留指令优先级；无完整别名或运行时字节证明 |
| VM与输入 | 已知VM普通Resume一次后桌面/新终端/字符1执行成立；无用户手动请求或新权限设置，损坏长行取消后短查询成立 |
| 既存转储 | 同次PID5304第二份16924391B及完整哈希新核；CDB哈希/Valid签名新核，新输出不存在/符号目录空/同名进程0 |
| 有限CDB | 一次离线-z，21:24:19.4881799 +08:00开始，退出0、77行；四段76B、七行19个DWORD全部取得；未重启游戏或跟随指针 |
| 局部对应 | 三个固定地址、两处帧内指针、模块句柄候选及哨兵共七项一致；初始化副本槽与回填槽同为0x0b7c7cc0；仍不当真实整链/目标代码/根因 |
| 收尾 | 日志8822B及完整哈希实际读出，仅留来宾；21:33画面游戏/CDB进程0及空提示符；REA已关闭且无待清理资源 |
| 产品/平台 | 211项既有产品文件、rev30的7 observed/13 unknown保持；无源码/接口/架构/资源格式/构建流程变更，无产品测试/构建或联机验收 |

[静态摘要](../analysis/game-text-observer-runtime-v1/indirect-flow-stage132.json)、[限定计划](../analysis/game-text-observer-runtime-v1/indirect-flow-plan-stage132.json)、[CDB数值与局部核对](../analysis/game-text-observer-runtime-v1/cdb-stack-stage132.json)、[访问](../analysis/game-text-observer-runtime-v1/vm-access-stage132.json)、[文件和链接核验](../analysis/game-text-observer-runtime-v1/validation-stage132.json)、[交付](../analysis/delivery-manifest-stage132.json)。本轮有实际分析进展，完整目标active/incomplete；工具退出0和局部吻合均不等于游戏消费者、根因、正常登录/玩法或网页、移动网页、微信/官方可玩。

<a id="stage131"></a>
## stage131：限定诊断、恢复和静态边界验收完成

| 证据层 | 本轮实际结果 |
| --- | --- |
| 前态 | 原stage130的1713项/45549477B交付哈希一致；7份规范文档及原方案前态保留在私有build |
| 恢复点 | 新原生点current/poweron、六个旧点保留及XML摘要已核；还原启动未测 |
| 实际进程 | 普通空参数一次PID5304，18:50:22.6669501–18:50:29.1332491（+08:00），6.466299秒自然退出`0xc0000005`；无重试或强杀 |
| WER恢复 | 双视图本轮三值/类型恢复前一致，游戏键及原先不存在的空父键均撤销；18:59四项不存在，管理员会话19:01正常结束 |
| 转储资格 | 两个同PID新文件16926131/16924391B，共33850522B；稳定长度/时间及完整SHA256已核，未导出 |
| 离线CDB | x86微软CDB哈希/Valid签名/版本已核；两次`-z`退出0，分别取得`0xc00001a5 @ 0x0b86db30`与`0xc0000005 @ 0x0b7c8152`；原始输出仅留来宾 |
| 异常/栈边界 | 39模块记录集合差异0，两异常VA均在所列范围外；9/8行候选栈各有一次可能错误警告，不当根因或可靠调用链 |
| 静态REA | REA6.7.0/Ghidra12.1.4新增24条；六个`.text1`候选返回地址的函数/指令/CALL结束边界成立，四个直接目的地、两个间接目标未知；原文件与运行时字节一致性未验 |
| 运行后收尾 | 19:56游戏EXE完整哈希匹配、游戏/CDB进程合计0；19:59两个原始日志长度/哈希和CDB版本回读，普通空提示符保留；REA最终open=false/cleanup_pending=false |
| 产品与平台 | 本轮无产品实现、接口/资源格式/架构或构建流程变更；未运行产品测试/构建。211项既有产品文件与rev30保持不变，完整登录/玩法/三平台/官方可玩未完成 |

[生命周期](../analysis/game-text-observer-runtime-v1/wer-lifecycle-stage131.json)、[恢复](../analysis/game-text-observer-runtime-v1/wer-restoration-stage131.json)、[CDB](../analysis/game-text-observer-runtime-v1/cdb-summary-stage131.json)、[REA](../analysis/game-text-observer-runtime-v1/rea-stack-correlation-stage131.json)、[收尾](../analysis/game-text-observer-runtime-v1/wer-postflight-stage131.json)、[本轮文件核验](../analysis/game-text-observer-runtime-v1/validation-stage131.json)、[交付](../analysis/delivery-manifest-stage131.json)。这里只验收实际诊断与静态证据，不把工具退出0、bundle中未登记unknown或本地文件完整性当游戏兼容证明；原stage128方案已执行且额度已用。

<a id="stage130"></a>
## stage130：阻塞审计，不计产品或取证进展

| 证据层 | 本轮实际结果 |
| --- | --- |
| 前态 | 原1709项交付哈希一致，6份受影响文档前态保留 |
| 前轮分类 | 128材料核验、129前检均有实际进展；本轮只重核状态/交付，不计新实现或取证 |
| 当前条件 | 原stage128具体执行时问题仍无答复，跨128/129/130持续；独立前检已完成 |
| 等待类型 | 未确认任何live分析作业，不称verified wait；没有重复发送确认或人工操作问题 |
| 行为 | 无CUA/来宾命令、游戏/工具运行、REA、设置变更或产品测试/构建 |
| 状态 | 阻塞审计阈值满足，准确goal结果见工具回执；完整四步/三平台/官方可玩未完成 |

[阻塞审计](../analysis/game-text-observer-runtime-v1/blocked-audit-stage130.json)、[工具回执](../analysis/game-text-observer-runtime-v1/goal-status-stage130.json)、[交付核验](../analysis/game-text-observer-runtime-v1/validation-stage130.json)。blocked只表示需原问题答复或外部证据变化才能继续，不是根因、兼容或交付完成；保留129原回执，恢复后按新鲜状态开始新的阻塞审计。

<a id="stage129"></a>
## stage129：只读前检通过，诊断尚未启用

| 证据层 | 实际结果 |
| --- | --- |
| 前态 | 原1705项交付一致，7份受影响文档前态保留 |
| 注册表 | 显式Registry64/Registry32身份已回读；LocalDumps父/游戏子键均不存在；AeDebug键存在，Auto成员均False；仅读取 |
| 资源 | 实验目录False，C余量230298329088B大于512MiB；未预留或创建目录 |
| 游戏状态 | 同名进程0，精确安装路径及2904064B新核；哈希/Win7未在此轮重读 |
| 输入/收尾 | 中途失效后同次实时Win+Q恢复；4个只读句柄Dispose，无报错，原终端空提示符 |
| 待执行 | 既有来源执行时确认待答复；新恢复点、设置、启动、采集和恢复均未开始 |
| 产品 | 无新REA操作、消费者、源码/架构/接口/资源格式、测试或构建变更；rev30仍7/13；完整四步/三平台/官方可玩未完成 |

[前检](../analysis/game-text-observer-runtime-v1/wer-preflight-stage129.json)、[输入](../analysis/game-text-observer-runtime-v1/input-stage129.json)、[交付核验](../analysis/game-text-observer-runtime-v1/validation-stage129.json)。键/Auto缺失只描述当时的精确目标，不证明视图物理关系、自动调试全面排除或未来转储成功；短输入恢复不证明稳定性/根因。goal active/incomplete，准备层实际进展不作为产品完成。

<a id="stage128"></a>
## stage128：既存材料核验通过，故障上下文仍缺

| 证据层 | 实际结果 |
| --- | --- |
| 前态 | 原1699项交付一致，7份受影响文档前态保留 |
| 输入 | 正常窗口/既有Win+Q恢复后，字符/取消/短查询及输出可证；不代表永久稳定 |
| 归档 | 实际引用目录存在，含隐藏项直接计数各1；Report.wer分别44628/44632B、完整SHA256已读 |
| 附件 | 每份5个原引用均False，包括各一份.dmp；仅覆盖此时这些路径 |
| 报告 | 签名与126一致，各38模块、PowerShell默认比较差异0；无地址/栈/根因 |
| 身份 | 游戏当前哈希匹配；既有x86 CDB哈希匹配、签名Valid，调试器未运行 |
| 新方案 | 已准备；键/目录前检、新恢复点、设置、再次启动/采集未执行，执行时确认未取得 |
| 产品 | 无源码、解析器、接口、资源格式、测试/构建变更；rev30仍7/13，完整四步/三平台/官方可玩未完成 |

[材料](../analysis/game-text-observer-runtime-v1/wer-artifacts-stage128.json)、[输入](../analysis/game-text-observer-runtime-v1/input-stage128.json)、[准备](../analysis/game-text-observer-runtime-v1/diagnostic-readiness-stage128.json)、[具体方案](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)。本轮有实际分析进展，goal active/incomplete，不复用127的blocked计数；文档/清单核验只属于交付层。

<a id="stage127"></a>
## stage127：图像读取恢复，普通输入与附件未通过

| 证据层 | 实际结果 |
| --- | --- |
| 前态 | 原1694项交付hash一致，6份受影响文档前态保留 |
| 画面 | 同一Windows11、搜索及原终端可读，不能据旧空白持续判锁屏 |
| 输入 | 有界字符/单键、窗口/搜索位置点击、正常窗口选择/Escape均未有可确认来宾响应 |
| 执行 | 无Return、来宾命令、新游戏/工具/读取或附件结果，附件存在性未知 |
| 等待/进展 | 无确认存活的分析作业可等；本轮无实现/附件调查进展，文档校验不算产品进展 |
| 阻塞审计 | 同一间歇性普通输入问题在125/126/127三个末态复现，前两轮的实际进展分别保留 |
| 产品与平台 | 源码、rev30、历史测试/构建未改；认证、消费者、玩法、三平台/官方可玩未完成 |

[访问回执](../analysis/game-text-observer-runtime-v1/access-stage127.json)、[阻塞审计](../analysis/game-text-observer-runtime-v1/blocked-audit-stage127.json)、[可恢复入口](../analysis/game-text-observer-runtime-v1/resume-plan-stage126.json)。阻塞状态不表示目标完成，也不替代游戏协议或兼容验收。

<a id="stage126"></a>
## stage126：事件与样本关联通过，根因和游戏消费者未通过

| 证据层 | 实际结果 |
| --- | --- |
| 前态 | 原1685项交付一致；9份文档前态保留 |
| 普通输入 | 搜索字符、实际Ctrl+C及空提示符、多个完整只读命令成立；不代表持续稳定 |
| Error1000 | 两条的PID5136/精确FILETIME/安装路径对应上次进程；0xc00001a5→0xc0000005，模块均unknown |
| 时间线 | 两ISO时间已读；100ns整数计算得首条记录创建后0.5352709秒、早于最早读取0.9647291秒，属于有条件推导 |
| WER1001 | 两份APPCRASH的EventName/P1..P8已读；仅StackHash/PCH不透明签名，无模块地址/堆栈 |
| 文件身份 | 游戏9baa0d26…9d3126、工具16386482…b83732f5的完整运行后hash匹配前检 |
| REA与静态 | 一条section_headers证据、11节与独立PE头核对；两个FaultOffset均不能直接选取原文件代码 |
| 当前访问 | 路径赋值返回提示符，值/附件未核；后续输入未回显，菜单恢复后截图主体空白，终端状态未知 |
| 实现与平台 | 无产品/工具源码变更、新测试/构建或平台验收；rev30仍7/13，消费者/认证/玩法未完成 |

[事件与推导](../analysis/game-text-observer-runtime-v1/events-stage126.json)、[REA](../analysis/game-text-observer-runtime-v1/rea-fault-layout-stage126.json)、[样本范围](../analysis/game-text-observer-runtime-v1/fault-layout-stage126.json)、[运行后身份](../analysis/game-text-observer-runtime-v1/postrun-identity-stage126.json)、[接续](../analysis/game-text-observer-runtime-v1/resume-plan-stage126.json)。本轮没有重复样本执行、采集堆栈/游戏内存或改变保护；声明仅覆盖实际证据。

<a id="stage125"></a>
## stage125：游戏单次运行及零读取实证，消费者仍未通过

| 证据层 | 本次实际结果 |
| --- | --- |
| 前态 | 原1678项交付核对一致；19项文档/矩阵前态已保留 |
| 恢复条件 | 原stage119点仍current/poweron、VmUuid/XML摘要一致；未新建或还原，恢复启动未测 |
| 新鲜前检 | 游戏/读取器完整hash、普通目录、Win7值、五直接DLL、空参数/精确工作目录、无输出/进程0 |
| 输入 | 第一可疑定义已取消；第二定义ToString完整核对，触发一次；后续事件详情回读再次未证 |
| 游戏运行 | Start=True，PID5136，实际9.123410秒，HasExited=True，exit `0xc0000005` |
| 单次读取 | `game-installed`，固定1753452B，`TEXT_ZERO`/reader exit1，无输出文件 |
| 整体标记 | 17:36:41.4199383–17:36:57.0539053 +08:00，15.633967秒；不等同进程存活时长 |
| 结束复查 | Test-Path=False，同名进程0；未进入正常关窗分支，无强杀/重启 |
| 事件/修改后hash | 事件查询赋值返回提示符，详情未回读；执行后文件hash未取得，不宣称不变 |
| 产品/平台 | 无产品源码改动、新测试/构建或设备验收；rev30仍7/13，认证/消费者/玩法/三平台/官方可玩未完成 |

[前检](../analysis/game-text-observer-runtime-v1/game-guest-preflight-stage125.json)、[运行](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)、[输入](../analysis/game-text-observer-runtime-v1/input-resume-stage125.json)、[下一步](../analysis/game-text-observer-runtime-v1/resume-plan-stage125.json)。本次一次启动/读取方案已经使用，不复用旧夹具或传输额度。

<a id="stage122"></a>
## stage122：执行确认已取得，输入恢复有实证，游戏仍未验收

| 证据层 | 实际结果 |
| --- | --- |
| 前态 | 原 1671 项交付 hash 一致，19 项文档/矩阵前态已保留 |
| 具体执行确认 | 用户已答复；goal 实际为 active，未修改全局/工具规则 |
| 恢复点 | 同一精确 PVM/VmUuid、current 点及 XML 摘要已新核；新建/还原 0，还原启动未测 |
| 普通输入 | 实时菜单选取既有 Win+Q 后，搜索中的 1 与 Escape 关闭实证 |
| 当前门禁 | 下一次 Get-Date 输入返回 Mac locked / 自动解锁失败；没有 Return 或新的来宾检查结果 |
| 游戏/工具 | 新启动/读取/夹具 0；触发块未加载，游戏消费者、认证与玩法未验 |
| 产品/测试 | shared/web/native/协议矩阵与工具源码未改，无新产品构建或重跑历史测试 |

[授权](../analysis/game-text-observer-runtime-v1/authorization-stage122.json)、[恢复点](../analysis/game-text-observer-runtime-v1/recovery-recheck-stage122.json)、[输入](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)、[路径表示纠正](../analysis/game-text-observer-runtime-v1/command-path-correction-stage122.json)。待正常解锁后继续原一次诊断；本轮文档和清单检查只证明交付完整性，不是游戏或三平台/官方可玩证明。

<a id="stage119"></a>
## stage119：原创正向资格通过，游戏验收保持待验证

| 证据层 | 实际结果 |
| --- | --- |
| 前态完整性 | 修改前 stage118 的 1656 项 hash 一致，19 项文档/矩阵前态保留 |
| Windows 原始文件 | 同一既有快照 6624B/Archive/完整 SHA256 已回读；本轮没有新夹具启动或 RPM |
| 原文件返回 | 单次 POST，原文件接收/关闭 success=true，host exit0；客户端返回长度 0 后 Dispose，最终无 listener 报告 |
| 全量 oracle | 实际 base0x00da0000、245 个 HIGHLOW，6624B 全部相等；原创正向资格通过 |
| 游戏静态证据 | REA 新增 1 条 i386 文件头；导出的 4 条含 3 条历史，GNU 导入表另记 |
| 来宾前检 | hash/Win7/五个直接 DLL/读取器/目录/无输出/进程数 0 已实际核对 |
| 恢复点 | 原生新建，旧点保留，当前/poweron/对应文件元数据已核；还原启动未测 |
| 游戏与产品 | 游戏未执行/读取；无新字段、产品代码、构建、账号或三平台/官方可玩验收 |

[资格](../analysis/game-text-observer-runtime-v1/qualification-stage119.json)、[原文件返回](../analysis/game-text-observer-runtime-v1/snapshot-return-stage119.json)、[直接比较](../analysis/game-text-observer-runtime-v1/host-oracle-stage119.json)、[来宾前检](../analysis/game-text-observer-runtime-v1/game-guest-preflight-stage119.json)、[恢复点](../analysis/game-text-observer-runtime-v1/recovery-point-stage119.json)。未修改原读取器/传输器源码，不重复运行旧 39C/6Python 工具测试、5 项传输测试或产品测试；它们保持历史范围。新实证是原文件全量比较，不证明新游戏 profile、所有拒绝路径、稳定/原子快照或消费者。[下一步限定方案](../analysis/game-text-observer-runtime-v1/game-startup-plan-stage119.md)正在等待来源执行确认。

<a id="stage118"></a>
## stage118：Windows首次读取和自然退出已证，完整资格尚未完成

| 证据层 | 实际结果 |
| --- | --- |
| 新固定传输主机测试 | 5项通过，host exit0；合成字节，不是来宾快照 |
| 来宾读取器身份 | 146798B/SHA25616386482…83732f5完整一致 |
| 原创fixture实际读取 | PID260，6624B，基址00da0000，1区域，15ms，观察器exit0 |
| 独立预期摘要 | 实际基址245个HIGHLOW后13da500e…146a9d9，与观察器输出相同 |
| 同一fixture生命周期 | 14:46:53–14:47:23自然30秒；WaitForExit=True、HasExited=True、ExitCode0 |
| 文件传回/直接逐字节比较 | 未执行；完整资格仍待完成 |
| 原游戏/账号/消费者/玩法 | 未执行/未取得 |

一次GET服务已成功关闭且host exit0；反向接收服务未启动。普通来宾输入再次未确认，快照查询未提交；原生Ctrl+Break进入PowerShell自身DBG，退出未证。最后输入模式仍自动检测，配置经正常菜单关闭；没有重跑fixture、改安全/快捷键定义或要求人工焦点操作。

[主机测试](../analysis/game-text-observer-runtime-v1/test-results.json)、[传输](../analysis/game-text-observer-runtime-v1/transfer-runtime.json)、[运行及独立oracle](../analysis/game-text-observer-runtime-v1/fixture-runtime.json)、[输入与边界](../analysis/game-text-observer-runtime-v1/input-observations.json)。本轮没有产品源变更，未把旧188/79/83产品结果算作新运行；矩阵rev30保持7/13，完整三平台/官方目标未完成。[下一步](development-plan.md#stage118)、[阶段审计](../analysis/game-text-observer-runtime-v1/validation.json)。

<a id="stage117"></a>
## stage117：三轮正常访问失败，目标已标记blocked

stage115–117连续三个goal turn的正常电脑控制均报告Mac locked/自动解锁失败；第116/117轮无开发进展，没有活跃观察任务可等待。三轮审计通过后，目标工具实际返回blocked，完整目标仍未完成。[审计](../analysis/game-text-observer-v1/blocked-audit-stage117.json)、[实际状态](../analysis/game-text-observer-v1/goal-status-stage117.json)。

1639项上一交付hash和新工具146798B/16386482…83732f5一致；矩阵rev30仍7observed/13unknown。本轮无新源码/产品测试、来宾/游戏执行或VM/安全变更。保留已有正常解锁请求及现有Windows/联网/工具授权；恢复正常访问后先验真实fixture读出、完整字节与自然生命周期，再制定新鲜有界游戏诊断方案。[资格步骤](../analysis/game-text-observer-v1/windows-qualification-plan.json)、[交付](../analysis/delivery-manifest-stage117.json)。

<a id="stage115"></a>
## stage115：主机工具准备通过，Windows及游戏验收未运行

实际完成：39项C边界断言和6项Python原创fixture oracle测试通过；两次x86 PE构建相同，146798B/SHA25616386482…83732f5，两套链接配置和中文路径、ASLR/NX及78导入名已核。REA成功3条：游戏资源1、原创产物objdump2；Linux-only不支持未计成功。三个首轮构建/解析失败已修复并保留。[构建](../analysis/game-text-observer-v1/host-validation.json)、[oracle](../analysis/game-text-observer-v1/fixture-oracle-validation.json)、[证据审计](../analysis/game-text-observer-v1/evidence-audit.json)。

未运行：真实Windows新工具/fixture读出和完整字节比较、原游戏启动/读取、游戏消费者及通信/玩法、账号与三平台/官方可玩。电脑控制首次输入报告锁定，Return/来宾命令0；新鲜依赖/恢复/Win7/PID均待下一次正常前检。没有新增产品代码/Node/浏览器验收，历史79/83仍属对应阶段。[本轮验收](../analysis/game-text-observer-v1/validation.json)、[访问](../analysis/game-text-observer-v1/access-observation.json)、[下一步](../analysis/game-text-observer-v1/windows-qualification-plan.json)、[交付](../analysis/delivery-manifest-stage115.json)。

stage116只读复查：1637项前交付hash一致，正常电脑访问再次报告Mac locked/自动解锁失败，未取得app/guest、来宾输入或新游戏证据。同一阻塞连续2个goal turn，已有正常解锁请求保留，本轮无开发进展；目标active，尚未达到三轮blocked门槛。恢复后仍按新工具的真实fixture/完整字节/自然生命周期顺序验收。[回执](../analysis/game-text-observer-v1/access-recheck-stage116.json)。

<a id="stage114"></a>
## stage114：真实浏览器来源缓存验收通过，游戏仍未完成

环境为Playwright-core1.64.1/Chrome156.0.8078.74，Browser插件未提供；原创建验收夹具的同一本机origin，桌面1100×820/手机尺寸390×844，任务专用持久配置，不接触个人浏览器配置。

| 检查 | 实际结果 |
| --- | --- |
| 页面身份、有效内容、无错误遮罩/横向裁切 | 两尺寸6次启动通过 |
| 控制台、真实点击、截图 | 成功轮无警告/运行错误，2张视口图已检查 |
| 原生IndexedDB、重载及浏览器正常重启 | v2来源0重载/副本变异、来源1重启、默认v1重启通过 |
| 来源拒绝、明确选择与旧CAS | 错来源无候选；正确来源待审阅后选择；旧CAS拒绝且保留v2 |
| 源身份与收尾 | 35模块匹配stage113；6会话及夹具服务已关闭 |

流程为保存来源0→重载读回→拒绝来源1→明确选择来源0→保存来源1→关闭重开→拒绝来源0/旧CAS→选择来源1→默认v1覆盖→关闭重开与明确选择；合计83项（每尺寸40项及3项汇总）通过。首轮三404系夹具遗漏嵌套vendor路由，失败保留后只修夹具。产品源没有修改，未重复执行旧79Node。[初始失败](../analysis/launcher-cache-source-browser-v1/browser-initial-failure.json)、[成功83项](../analysis/launcher-cache-source-browser-v1/browser-results.json)、[桌面](../analysis/launcher-cache-source-browser-v1/desktop-v2-selected.png)、[手机尺寸](../analysis/launcher-cache-source-browser-v1/mobile-v2-selected.png)。

游戏：9baa RSDS头直接文件核验，REA头部查询为330000ms启动超时；另两负面字节记录均0B/complete=false，均非成功反编译。两个精确公开PDB GET均404，没有新游戏材料或消费者。[源/限制](../analysis/launcher-cache-source-browser-v1/game-source-check.json)、[符号回执](../analysis/launcher-cache-source-browser-v1/symbol-observation.json)。物理手机/微信、真实认证、原游戏通信/玩法和官方可玩未验；矩阵rev30仍7/13。[闭合检查](../analysis/launcher-cache-source-browser-v1/validation.json)、[交付](../analysis/delivery-manifest-stage114.json)。

<a id="stage113"></a>
## stage113：静态、独立回归、主机联网与游戏缺口分层验收

静态：当前登录器155+35=190、固定Patcher37+9=46、不同6000样本4条REA，10处源字节映射相等；均保存并关闭。实现：4份既有产品源修改，新增1模块和1原创测试文件，8测试文件79项通过，11项为新增；默认来源、所选来源固定、独立许可、取消/失败/事务及257/512/513边界有回归。[REA](../analysis/launcher-current-entry-v1/rea-audit.json)、[测试回执](../analysis/launcher-current-entry-v1/test-results.json)。

主机联网：3配置+2清单+1归档，共6个新方案内GET均HTTP200；最初378操作触发PATCH_BUDGET的回执保留，扩容后只离线重解析原响应。既有3000文件与两源目标相同；不同6000经ZIP CRC/MD5/长度验证，REA原.text仍返回0/16B且complete=false。[清单](../analysis/launcher-current-entry-v1/manifest-reanalysis.json)、[游戏能力](../analysis/launcher-current-entry-v1/game-capability.json)。

未验收：浏览器原站CORS、移动网页/微信适配、完整原生更新/恢复、真实认证、原游戏消费者/通信/玩法与官方可玩。无账号、无本轮VM/原程序/真实IPC操作，未进行保护绕过。矩阵rev29保留7/13；本阶段通过不等于完整目标完成。[交付闭合检查](../analysis/launcher-current-entry-v1/validation.json)、[清单](../analysis/delivery-manifest-stage113.json)。

缓存所有者原先投影丢失profile/ordinal，导致键相同、不同来源可误恢复；3项新回归已实际失败再修复。现在固定来源进入资源键并使用resources.v2，默认/旧缓存仍为v1；79项回归包含键、格式、页面恢复和旧缓存路径，浏览器V2持久化仍待验。

<a id="stage112"></a>
## stage112：控制源链与独立实现对应通过，游戏仅前检

1580项前态hash重核一致后写入。REA139+16=155，本轮21个不同函数、7处原字节锚点通过，会话导出保存关闭；当前type1的9B双BE32和type2两参数ABI及正常type10提交段已源绑定。无产品代码修改，现有相关4测试文件45项Node通过，0失败/取消/跳过。[源台账](../analysis/launcher-current-control-v1/rea-audit.json)、[核验](../analysis/launcher-current-control-v1/source-check.json)、[实际测试](../analysis/launcher-current-control-v1/test-results.json)。

已有原创观察器5项源码和构建hash复核通过，历史Windows通过范围仅fixture profile。当前Windows六条赋值/只读命令实际返回游戏9baa…d3126与`~ WIN7RTM`；输入短链恢复，临时全屏已还原，未运行原游戏或观察器。[能力](../analysis/launcher-current-control-v1/game-capability.json)、[前检](../analysis/launcher-current-control-v1/guest-preflight.json)。

无新外部探测/账号/厂商执行。type1业务值/版本用途、真实加密账号接受、原游戏消费者/通信/玩法和浏览器/手机/微信及官方可玩未验，测试账号暂无。矩阵rev28仍7/13；当前阶段闭合不标全目标完成。[阶段闭合](../analysis/launcher-current-control-v1/validation.json)、[交付](../analysis/delivery-manifest-stage112.json)。

<a id="stage111"></a>
## stage111：现行record源合同与独立字节回归通过

1568项前态重核一致后更改；REA123+16=139、本轮34不同成功反编译入口，会话导出保存关闭。4原区间（rounding/stride8/selector表/Pi ASCII）通过，1042 Pi字同已核标准；旧472e70历史证据hash匹配。[源核验](../analysis/launcher-current-record-v1/source-check.json)、[表/历史](../analysis/launcher-current-record-v1/table-check.json)。

新增现行codec/stream/profile和flow/session一致选择。修复前exit1证明29B明文请求得32B cipher而当前应40B；修复后13独立ECB记录+最大摘要、3解码边界、3原创会话/65分片，相关7文件78Node全通过，0失败/取消/跳过。默认generic旧字节/最低8B政策保留。[实际测试与命令](../analysis/launcher-current-record-v1/test-results.json)。

本轮无新外部网络/原程序/账号执行，真实观测仍仅stage110 hello；未运行浏览器/手机/微信。现行源范围与合成对应通过，真实加密接受/身份/账号/游戏及官方可玩未验。用户确认暂无专用测试账号，继续无账号正常连接控制，矩阵rev27仍7/13。[阶段闭合](../analysis/launcher-current-record-v1/validation.json)、[交付](../analysis/delivery-manifest-stage111.json)。

<a id="stage110"></a>
## stage110：共享现行握手与一次真实前置字节验收

stage109清单1552项重核一致后更改。REA累计123记录（106复用/17新增、本轮25不同成功反编译入口），会话保存/导出/关闭；固定源3字节区间通过。新增显式current profile和flow/web session传递，独立Python3有效/8无效向量、530分片、原生p-1、错误组早拒绝、getter拒绝及旧兼容契约通过。[源核验](../analysis/launcher-current-channel-v1/source-check.json)、[78项最终Node结果与命令](../analysis/launcher-current-channel-v1/test-results.json)。修复前错误模数大小写仍进入challenge-ready，修复后该回归通过。

**实际网络：** 先通过6个loopback TCP检查，再对新鲜配置且源角色绑定的221.122.108.12:9030一次连接，10秒上限；只请求写8B hello，write callback完成、收529B、字段1/256/256与固定组一致，1483.317ms实际close。没有挑战回答/账号请求，未保存challenge原文；一次额度已用，禁止重放该计划。[回执](../analysis/launcher-current-channel-v1/network-observation.json)、[计划](../analysis/launcher-current-channel-v1/plan.json)。close不等于服务器业务ACK，组匹配不等于对端身份或登录。

**证据层：** 当前源码/选定原字节、原创合成向量、Node适配与真实认证前置分别通过。未运行浏览器/手机/微信、原Windows程序或账号/原游戏验收；完整record等价、认证会话、游戏消费者/玩法和官方可玩均未完成。矩阵rev26保持7/13。[本阶段校验](../analysis/launcher-current-channel-v1/validation.json)、[交付清单](../analysis/delivery-manifest-stage110.json)。

<a id="stage109"></a>
## stage109：状态投影源核验、失败复现与定向回归

先逐项回读stage108的1540文件一致并保存修改前副本。REA6.7.0/Ghidra12.1.4复用47历史记录，新增59查询记录/43不同成功反编译入口，累计106；一项未识别procedure不算成功。已导出私有完整证据/新快照并关闭会话。[REA台账](../analysis/launcher-current-login-v1/rea-audit.json)。

- 5精确原字节锚点及固定PE32源身份通过；错误身份合成样本实际拒绝，未执行原程序。[覆盖/结果](../analysis/launcher-current-login-v1/source-verification.json)。
- 新合成回归在修复前确实失败（PROFILE_STATE_ENCODING），修复后48组独立Python struct向量贯穿reply/选择/handoff，包括W0哨兵、upperbits、受限状态和计费/过期；Node26.9.0运行6个相关测试文件，78/78、失败/跳过/取消均0。[命令/范围](../analysis/launcher-current-login-v1/test-results.json)。
- 公开规格/源码/测试/文档与交付清单收尾单独核验；不是把私有伪代码或厂商EXE放进交付。[阶段检查](../analysis/launcher-current-login-v1/validation.json)、[清单](../analysis/delivery-manifest-stage109.json)。

未跑完整产品构建/全套、浏览器、Windows/设备、账号/官方联网或原游戏。本轮只证实上述字节切面与Node薄适配回归；认证、游戏/可玩、网页/移动网页/微信及官方兼容仍未完成，矩阵7/13保持。

<a id="stage108"></a>
## stage108：REA与依赖修复、自更新及主界面实证；完整产品未验收

**静态通过：** 1517项基线回读一致；旧更新器REA两条新证据导出关闭，88锚点/8区间hash通过；三项x86 DLL覆盖258导出。新版当前保留载荷、分析副本、REA导出/快照四项重新hash/大小一致，与新鲜来宾EXE完整hash/大小对应。[REA](../analysis/game-install-context-v1/rea-updater-stage108.json)、[依赖静态资格](../analysis/game-install-context-v1/vc71-static-stage108.json)、[版本对应](../analysis/game-install-context-v1/updated-source-bridge-stage108.json)。

**Windows实际通过：** 两路径Win7配置回读、新快照元数据；首次9732→2484、父exit0、87.164秒进程点计数0；第二次前D介质四hash/外层包签名Valid、原四备份及三app-local拷贝完整hash通过。新正常9280→10436→9012，3start/2stop，两登录器stop0，V2.01主界面/列表可见、约52秒正常关闭；97.321秒才读回父exit0/相关进程数0，不称全部验证均在90秒内。EXE/RegionList实际变化、更新器/GameList保持原hash。[首次](../analysis/game-install-context-v1/lifecycle-runtime-stage108.json)、[第二次完整回执](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)。

**操作收尾通过：** 两次订阅与队列分别0/0、两个专用管理员终端正常关闭，原普通终端/备份保留；原19项键盘菜单及顺序精确恢复、窗口模式保持。原VM恢复启动、旧隐藏1e行清空仍未验。[键盘收尾](../analysis/game-install-context-v1/keyboard-cleanup-stage108.json)。

**未验证：** 更新器10436退出码/stop、实际加载映像/DLL路径、完整文件顺序/ACK/崩溃恢复、账号认证、原游戏消费者/可玩及网页/移动网页/微信/官方兼容。产品源码未变，不重复运行产品测试或构建；本阶段另做JSON、链接、文档/范围和交付hash检查。协议仍7 observed/13 unknown，完整目标未完成。[机器验收](../analysis/game-install-context-v1/validation-stage108.json)、[交付清单](../analysis/delivery-manifest-stage108.json)。

<a id="stage107"></a>
## stage107：正常平台身份与静态源对应通过，运行验收未通过

写前1509项交付回读一致。实际原安装器WaitForExit/HasExited均True、ExitCode=0；InstallDir32/64同值且各exit0，目录及登录器/更新器完整hash已核。原包三成员extract+test、普通UPX输出同hash、REA资源143完整hash与7处源锚点通过。[实际安装](../analysis/game-install-context-v1/platform-installed-stage107.json)、[REA与私有证据摘要](../analysis/game-install-context-v1/rea-bridge-stage107.json)。

普通来宾输入恢复未验收，当前进程计数查询未提交；Win7新路径、安装XML、自动更新子生命周期与原游戏消费者仍未知。本轮产品源/接口未变、既有产品测试未重跑，不新增认证/协议/平台通过声明。完整目标与7 observed/13 unknown保留。[阶段核验](../analysis/game-install-context-v1/validation-stage107.json)、[具体待执行方案](../analysis/game-install-context-v1/normal-launcher-plan-stage107.json)。

<a id="stage106"></a>
## stage106：平台启动与许可取证，安装尚未验收

1503项stage105交付回读一致；新鲜E:MOLIINST102/CD-ROM、平台2192044B/完整dc90…b0fb11相同。InstallDir32/64缺项/值、exit1；两默认父目录False、相关进程0、已安装游戏完整hash相同。正常平台启动/UAC各一次，展开路径匹配E:\POLCN_Setup.exe，原PID3440初始HasExited=False。[前检](../analysis/game-install-context-v1/platform-preflight-stage106.json)、[实际运行](../analysis/game-install-context-v1/platform-runtime-stage106.json)。

欢迎页后实际许可页默认拒绝、Next禁用；查看首尾未改变选择，Install点击0、许可接受0。私有全文1325字符/3737 UTF8字节由已核header字段2531原字节严格GBK回转，首尾与UI相符；没有逐字转录全部UI或通用解析器验收。一次提问已接收，尚未收到用户接受；文件打开请求queued不当作展示成功。[许可实证](../analysis/game-install-context-v1/platform-license-stage106.json)。

本轮无产品代码或测试重跑，无原游戏/登录器/更新器/内存读取；平台安装完成、真实目录/hash/view、原进程退出码、消费者、协议及跨平台/官方验收均未取得。规格13未知项不升级，快照恢复未测。

<a id="stage105"></a>
## stage105：正常安装实证与新观察器的所列验收

**运行实证：** 固定安装器启动/UAC各一次，向导完成后取消平台安装、窗口关闭，原PID6368 WaitForExit=True/HasExited=True/ExitCode0。实际默认目录及HKCU Path两视图相同；四文件完整hash相符，目录2369文件/2629576143B仅聚合一致。没有全文件hash、完整子进程轨迹、游戏或平台执行验收。[实际安装](../analysis/game-install-context-v1/guest-installed-context-stage105.json)。

**原创工具：** 全部门禁函数保持不变，增加真实目录固定配置；26主机断言通过，编译PE三配置/中文UTF16逐值核对，两次产物相同。新143326B/20859795…d684a已获Windows完整hash；原创fixture PID804一次8B读取成功、observer exit0，RVA14c0/14b0。夹具自然结束、结束计数0，同PID退出码空值保留未知；旧二进制拒绝案例未在新二进制重跑。[主机](../analysis/game-entry-v1/observer-build-stage105.json)、[Windows](../analysis/game-entry-runtime-v1/windows-observer-stage105.json)。

**未验：** 原游戏配置实际读取、消费者及回调调用、完整登录器生命周期/恢复、游戏协议、可玩与网页/移动网页/微信/官方验收。产品源未改，本轮未重跑历史产品测试；13未知项不因安装或工具成功升级。快照恢复启动未测。[本轮验收范围](../analysis/game-install-context-v1/validation-stage105.json)。

<a id="stage104"></a>
## stage104：复核与阻塞审计，不新增实现验收

1490项stage103交付文件重新逐项hash相同；固定游戏2904064B/9baa0d26…d3126原.text RawSize0再次只读核实。13未知项逐条及原四步/平台/官方要求均审计，现有615历史产品检查、7项IFPS检查和原创观察器实证仅保留原范围，本轮未重跑或扩大结论。[完整审计](../analysis/game-install-context-v1/blocked-audit-stage104.json)。

本次来源执行确认连续stage102/103/104仍待答；前两轮独立准备已完成，本轮无新实现、Windows/厂商执行或已确认live取证任务。三轮阻塞审计通过后goal工具返回blocked，完整目标未完成。确认来自CUA执行时规则，不是Auto-review拒绝、Mac锁定或当前策略错误；旧锁屏/运行回执不当作本轮状态。

<a id="stage103"></a>
## stage103：静态读取器与来宾查询的实证范围

**已执行：** 两包只读头提取exit0、两blob及私有反汇编摘要相符；固定PyPI归档和817源文件/8依赖文件回读通过。7项原创静态读取unittest方法通过、runner exit0；GetLauncherPath/CheckPolCNSetup共8处原字节锚点及两函数体hash相符。[读取测试](../analysis/game-install-context-v1/reader-qualification-stage103.json)、[依赖回读](../analysis/game-install-context-v1/dependency-integrity-stage103.json)、[选定函数](../analysis/game-install-context-v1/install-conditions-stage103.json)。

**来宾实证：** 当前用户HKCU Launcher/InstallDir显式reg:32/reg:64查询均显示缺项/值、exit1；各整行核对后一次Return，最后空提示符。无注册表写入、策略/网络变化或原程序执行。[实际输出](../analysis/game-install-context-v1/guest-platform-context-stage103.json)。

**未验：** 真正安装/提权后视图及用户、postinstall选项/求值/子链、游戏消费者和平台/官方兼容；来源执行问题仍待答。本轮无产品源改动，未重复旧615 Node/Chrome；读取器通过不提升20规格的13项unknown。[本轮验收与限制](../analysis/game-install-context-v1/validation-stage103.json)。

<a id="stage102"></a>
## stage102：安装静态取证、传输与恢复准备分别验收

**已执行：** REA/Ghidra对固定CG5Reg取得25记录/4锚点、私有导出关闭；核验上游debug工具及三个兼容补丁，配置/构建和两包元数据读取均退出0。7个原创传输unittest方法通过，覆盖多块流、重复/过期请求、身份改变、peer、路径/方法/请求体、symlink和hash/长度；两次测试夹具/时序失败及修正保留，未放宽生产guard。[构建](../analysis/game-install-context-v1/tool-build-stage102.json)、[7项检查](../analysis/game-install-context-v1/transfer-host-validation-stage102.json)。

**来宾/环境实证：** 镜像1106515968B及两个安装包完整SHA均与原件一致；E=MOLIINST102、CD-ROM/ReadOnly，签名检查两者NotSigned。一次限定来宾传输自然exit0、端口拒绝；新原生快照名称唯一、创建进度结束/元数据已核但还原未测。22临时菜单逐项撤回，重开后原19项顺序完全一致。[回执](../analysis/game-install-context-v1/transfer-session-stage102.json)、[恢复点](../analysis/game-install-context-v1/recovery-point-stage102.json)、[撤回](../analysis/game-install-context-v1/keyboard-cleanup-stage102.json)。

**未执行/未验收：** 正常安装、UAC/新条款、实际注册目录、原登录器/游戏消费者和官方兼容；仅本次来源执行确认待答。NotSigned通用提示不是执行策略拒绝。未重跑旧615 Node/Chrome，无产品源改动；旧测试保留原范围。完整目标active/未完成，7 observed/13 unknown不变。[方案](../analysis/game-install-context-v1/normal-run-plan-stage102.json)。

<a id="stage101"></a>
## stage101：构建、传输与 Windows 回执分层验收

本轮新跑26主机C断言、4布局回归，两PE各两次构建一致；GCC16.2.0、ASLR/NX/Werror保留。两版传输端分别19项主机检查通过；两次实际NAT传输均有完整来宾hash/长度，服务端2响应后exit0及独立socket拒绝，新旧来宾文件保留。旧615 Node/Chrome属于先前验收，本轮未重跑、也无产品源改动。

**Windows事实：** R1观察器四项拒绝均exit1，fixture创建失败且无PID/ready。修正版R2 PID8524的一次观察返回read_bytes8、base004b0000、ImageSize00e82000、槽RVA14c0/14b0、observer exit0；其WaitForExit=True但ExitCode为空，不填0。独立同步fixture PID1508自然exit0、结束后两名字计数0，未重复内存读。[完整身份和页数值](../analysis/game-entry-runtime-v1/windows-observer-stage101.json)、[布局4项](../analysis/game-entry-v1/layout-validation-stage101.json)、[当前传输19项](../analysis/game-entry-runtime-v1/transfer-host-validation-stage101-r2.json)。这不是全部门禁/竞争/故障覆盖或原游戏兼容。

REA新增14保留记录/4字节锚点，私有导出hash回读并关闭；旧/新Updater26字节差异与4锚点桥接重核。来宾旧hash、journal精确候选False及Path键原生/32位未取得目录分别记录。[REA](../analysis/launcher-update-recovery-v1/path-audit-stage101.json)、[安装上下文](../analysis/game-entry-runtime-v1/game-context-stage101.json)。本轮原程序启动0、Restore/策略放宽0，原生更新ACK/恢复、游戏/平台/官方未验收。完整目标保持active。

<a id="stage100"></a>
## stage100: Mac access blocked (2026-10-29)

电脑控制在连续3个 goal turn 均报告 Mac locked、自动解锁失败；未取得新来宾状态、提交新命令或运行观察器/原游戏。三轮阻塞审计已通过，goal 工具实际返回 blocked，完整目标尚未完成。

仅已有一次正常解锁请求保留，无需重复授权或再点击终端。解锁后先看未提交的哈希查询，核文件/备份/journal/原创目录，再验原创工具；旧脚本/Restore/启动不重放。22项临时菜单因锁屏尚未撤回，精确清单保留。不改锁屏/安全或使用已禁止控制路径。下列旧“当前”均为各阶段历史。

[stage100 audit](../analysis/game-entry-runtime-v1/access-blocked-stage100.json), [stage100 delivery](../analysis/delivery-manifest-stage100.json).

<a id="stage98"></a>
## Windows 实际前检与新访问停止（stage98 / 2026-10-29）

**实证：** 写前1427项未变，后续仅7份已声明状态文档变化；两份工具PE及stage89/96介质大小/hash重核一致。新系统NoProfile终端返回D=MOLICUR89/CD-ROM/Healthy/OK/1.5MB、有效Restricted及两组指定进程计数0，均整行核对后提交，无策略更改。[来宾结果](../analysis/game-entry-runtime-v1/guest-preflight.json)。

**边界：** 新增22个临时键盘菜单项尚待撤回；优化组合框未可靠选值，End移动侧栏，未改启动顺序/TPM/硬件/网络/共享/安全。最后hash查询只输入前半段、未Return，CUA再报Mac锁定/自动解锁失败，未取得hash。一次正常解锁请求待答，之后先看未提交行。[动作](../analysis/game-entry-runtime-v1/access-observation.json)、[恢复](../analysis/game-entry-runtime-v1/input-recovery.json)。

文件hash/备份/journal/目录、新介质传输、Windows fixture/observer/guard/ASLR及游戏/平台/官方均未验。无新产品测试/REA；615 Node/Chrome和26主机断言为前阶段范围。新锁屏第2轮，完整目标active/未完成。[目标审计](../analysis/game-entry-runtime-v1/goal-audit.json)。

[stage98 validation](../analysis/game-entry-runtime-v1/validation.json), [stage98 delivery](../analysis/delivery-manifest-stage98.json).

stage99 复查：CUA 仍在 Mac locked／自动解锁失败处停止，未取得新来宾状态或提交命令。同一新锁屏已连续2个 goal turn；上一轮有实际前检进展，本轮无开发进展。已有一次解锁请求保持，不追加终端操作或重复授权。完整目标 active，恢复后先看未提交的哈希查询，再核文件/目录并验原创工具。[本次复查](../analysis/game-entry-runtime-v1/access-recheck-stage99.json)。

<a id="stage97"></a>
## 三轮访问阻塞核验（stage97 / 2026-10-29）

**实际回读：** stage96交付清单1421文件全部hash/大小相同；固定游戏2904064B/9baa0d26…及原创fixture/observer/ISO三工件身份均相同。20项规格保持7 observed/13 unknown、revision25。未改产品/native或重跑未受影响的615Node/Chrome与26主机检查；既有结果只按原阶段范围使用。[前检](../analysis/game-runtime-access-v1/preflight.json)、[本轮校验](../analysis/game-runtime-access-v1/validation.json)。

**实际访问：** CUA getApp再次报告Mac locked/自动解锁失败，在来宾状态/输入前停止；0来宾命令/0原程序/0新介质挂载传输/0旧脚本重放/0安全或VM设置变更。stage95/96/97连续三goal turn同一阻塞，前两轮有独立实质进展，当前必要运行/业务消费者步骤无可用独立动作；不存在已确认活的进程/job/session等待。[访问记录](../analysis/game-runtime-access-v1/access-observation.json)。

**结论边界：** 阻塞审计满足门槛，交付回读后请求goal blocked；它不证明完整登录器/游戏完成，也不是全部未来静态分析不可能。Windows工具/实际回调/协议/游戏/移动网页/微信/官方验收继续未通过。旧一般授权有效，人工解锁请求只保留一次。[完整审计](../analysis/game-runtime-access-v1/blocked-audit.json)、[交付审计](../analysis/game-runtime-access-v1/delivery-audit.json)。

<a id="game-stage96"></a>
## 游戏入口与原创观察工具准备验收（stage96 / 2026-10-29）

**静态证据：** stage95的1402交付项前检均相同。固定游戏hash复核，REA新增33条/6函数、7源字节锚点，含原7条共40条导出/关闭；只证明入口/回调注册边界，槽静态零值没有实际消费者结论。[源审计](../analysis/game-entry-v1/static-audit.json)。

**主机与构建：** 26项原创C PID/地址范围断言实际通过，Windows x86 fixture/observer各编译两次字节一致；ASLR/NX保留。工具REA13记录与5原字节锚点、固定8B读取及直接导入表核验通过，已导出/关闭。首次DWORD*与uint32_t*不匹配构建失败后修正类型，Werror未放松；首次REA main选择/structured内容留存失败改以实际_main符号/地址查询，未改工具配置。[构建](../analysis/game-entry-v1/observer-build.json)、[工具静态审计](../analysis/game-entry-v1/observer-static-audit.json)。

**介质：** 4成员无autorun ISO921600B/SHA256 `1b0d9b3ccaaf755a4dd100e9ee3f21635c72519b921a5ae34c2883df1abaf249`，主机提取逐成员字节一致，权限0400。[介质记录](../analysis/game-entry-v1/observer-media.json)。

**未运行：** Windows fixture/observer/guard/真实ASLR和游戏读槽，来宾挂载/传输、新原程序/账号/官服；CUA在getApp即报Mac锁定，来宾命令和旧一次脚本/启动重放均0。615Node/Chrome是stage95已验结果，产品/native本轮未改、不重复运行。静态直接API表不证明运行时无额外访问；完整游戏/平台/官方目标保持未完成。[本轮实际校验](../analysis/game-entry-v1/validation.json)、[交付核对](../analysis/game-entry-v1/delivery-audit.json)。

## 新版更新器差异与纯日志头验收（stage95 / 2026-10-29）

**源与静态：** stage94的1387文件重新核对无差异；旧/新814080B updater26个差异字节全部落在时间戳/GUID，其他字节及18旧函数体逐范围相同。新hash独立REA9函数/35记录、8原字节锚点一致，导出/关闭，原样本未执行。[静态证据](../analysis/launcher-update-recovery-v1/static-audit.json)。

**实现与实际测试：** 先行规格后新增纯16B日志头解析器及shared导出。27独立Python向量（原生可读7份、精确header可读5份，尾随差异2份）、10定点、完整45文件615Node退出0；Chrome27向量/6组断言通过，另1条SAB可用性记录为false，shared/detached边界由Node验证。29本地GET无错误/失败，浏览器/上下文/fixture关闭；未重跑无关native测试。[验收与日志hash](../analysis/launcher-update-recovery-v1/validation.json)。

**当前运行边界：** 新鲜CUA绑定前返回Mac锁定，来宾命令/新原程序/脚本重放均0，已发送一次解锁请求。实际journal、原生恢复/ACK/子链、游戏消费者/协议和可玩/设备/官方兼容尚未验收；不以源码相同或stage5替代这些证明。完整goal当前active，未标完成或blocked。

## 正常首屏、新版静态与配置对刷新验收（stage94 / 2026-10-29）

**实际Windows证据：** 九文件hash/Windows5.1解析及Verify/Install通过。Observe实际初始父句柄退出0、早期Updater进程、后续主界面/普通关闭均分别记录。Restore以预定未知hash保护停止，exit1，未恢复；新公开payload与最终guest EXE hash/大小相同。临时四进程结束后有效Restricted，无持久策略变更。主窗口映像归属/完整子链/更新ACK不是已验收项。[运行验收](../analysis/launcher-current-runtime-v4/validation.json)。

**静态与代码证据：** 新packed1666048B、新独立UPX副本4111872B，REA47记录/8选定函数、10原字节锚点一致，导出/关闭。既有纯核心与Python对真实新ZIP完全一致。新增显式配置刷新模块，22新定点、完整44文件605Node退出0；Chrome真实ESM/IndexedDB11项、73GET最终零错误/失败且浏览器/上下文/fixture关闭。首轮浏览器11功能断言通过但网络审计1次ERR_ABORTED导致exit1，记录保留；只修测试同步/标签，精确根因未证。[代码验收与日志hash](../analysis/launcher-current-refresh-v1/validation.json)。

没有新增Swift/native或游戏实现；未重复native测试。原生事务/断电恢复、新内嵌更新器、真实认证/消费者、手机/微信/官方验收及完整目标仍未完成，不能用首屏、Node或浏览器配置存储替代。

## 必要运行链阻塞审计与当前策略实测（stage93 / 2026-10-28）

**本轮实际运行：** Parallels现有Windows窗口可读、英输入可用；完整核对后只提交一次Get-ExecutionPolicy，输出Restricted并返回空提示符。未重试受阻脚本，未改策略或执行新原程序。旧五scope Undefined/脚本SecurityError只作为stage90历史证据。[观察](../analysis/launcher-current-runtime-v3/observation.json)。

**静态/交付：** stage92的1359项全部hash回读通过。固定游戏旧tmp路径读取失败后，在项目既有build缓存找到文件，重核SHA256为9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126，原.text virtual_size1753452/rva4096/raw_size0。未重新解包、运行、修改样本或重跑REA；不作全局静态不可分析断言。主机原创脚本与ISO hash仍相同。

**已有验证范围：** 保留stage92实际583Node、Chrome69GET和已关闭REA；本轮重核9份私有日志/脚本回执hash，没有重跑未受改动的产品测试。inventory/MAP01确已实现并在旧回归覆盖，旧“待实现”提案不是真实新任务。9份规范文档更新；接口、格式与产品/native代码不变。[本轮验收](../analysis/launcher-current-runtime-v3/validation.json)。

**完整目标审计：** 原四步及平台/官方验收共7项要求，20规格中7 observed/13 unknown，不升级任何状态。仅进程RemoteSigned的当次回复在stage90至93四轮均未到；本次新证明策略仍Restricted，独立配置/元数据进展已完成，当前必要正常运行证据不能继续。blocked审计通过后提交状态；未标complete/paused，不用文档或候选测试缩减目标。[完整审计](../analysis/launcher-current-runtime-v3/blocked-audit.json)、[交付核验](../analysis/launcher-current-runtime-v3/delivery-check.json)。

## 新版元数据与显式 HTTP 候选入口（stage92 / 2026-10-28）

**静态：** 新packed SHA256为71180e5bdda771e7d57dd27d2b879beddee55d61b957dadf7a2da60c907cb69a，分析副本为c7ba69f77809fe589fd5dcccc78fcd4f33d4b6f76325d00a27f37032bbb32384。Ghidra12.1.4/REA6.7.0补12函数/8指令，保留31条，总51证据导出关闭；8指令/4字面均按PE节映射核对。0x407680/0x409aa0的候选角色已纠正；摘要大小写、包长与配置请求消费者形成先行规格。[审计](../analysis/launcher-current-metadata-v1/static-audit.json)、[原字节](../analysis/launcher-current-metadata-v1/source-check.json)。

**实现与测试：** 三项shared纯API、一个显式浏览器工厂，旧默认profile不变。原创Python提供22摘要/37locator/4计划共63向量，未改oracle或新增排除。25新增定点通过；43个测试文件完整Node26.9.0实跑583/583、0失败/取消/skip，11931.649416ms。Chrome155.0.8059.85与现有Playwright1.62.1实际ESM同63向量及2所有权检查、9组HTTP/行为检查、69回环GET，0错误/失败；全部任务实际退出0，浏览器/上下文/fixture关闭。[浏览器回执](../analysis/launcher-current-metadata-v1/browser-validation.json)、[完整结果与日志hash](../analysis/launcher-current-metadata-v1/validation.json)。

代码复核新增一项旧接口契约用例，实际复现common factory错误读取旧调用原本忽略的cacheTick访问器；修正后25定点/全583及Chrome重跑通过。该初始1项失败与此前582项通过记录都保留，不以最终结果覆盖历史。

**未验证：** 本轮未操作Windows、未变更执行策略或执行新原版；stage90仅进程RemoteSigned具体问题未答。候选准备不等于原生文件事务/恢复、完整认证或游戏可玩。Safari/移动网页/微信设备、官方服务器/账号与兼容验收均未完成；没有新“最新版本”联网断言。

准备阶段发生的补丁上下文拒绝、工具调用字符串解析错误、错误fixture只读路径及未运行的生成器行纠正均单独记录；这些未作为产品失败或最终通过次数隐藏。未执行分析副本或保存官方素材正文。[交付回读](../analysis/launcher-current-metadata-v1/delivery-check.json)。

## 新版配置容器与两文件比较（stage91 / 2026-10-28）

**静态：** 当前packed SHA256`71180e5bdda771e7d57dd27d2b879beddee55d61b957dadf7a2da60c907cb69a`的独立unpacked分析样本`c7ba69f77809fe589fd5dcccc78fcd4f33d4b6f76325d00a27f37032bbb32384`，恢复14条匹配旧证据后补11函数/17条新记录。31条导出/快照并关闭。4指令/10字面源字节锚点匹配，比较函数真实EAX返回与伪代码void区别已核。[静态审计](../analysis/launcher-current-catalog-v1/static-audit.json)、[原字节](../analysis/launcher-current-catalog-v1/source-check.json)。

**实现/测试：** 新容器检查与原始字节对比较仅共享纯函数；完整字段解析器不放宽。Python ElementTree/bytes提供24XML/29比较向量，1内部PI明确profile排除。新定点10项通过，全41测试文件558/558、0skip，Node26.9.0；Chrome155.0.8059.85/现有Playwright1.62.1实际ESM同53向量及四组附加检查通过，28个回环GET、0错误/失败，独立上下文/服务器正常退出。[浏览器](../analysis/launcher-current-catalog-v1/browser-validation.json)、[总验收](../analysis/launcher-current-catalog-v1/validation.json)。

**失败与未验：** 初轮定点9/10因内部PI差异失败；原oracle不改，明确排除后重验，不当作完全XML兼容。准备时错误architecture.md路径在第9份基线后停止，找到实际architecture-and-milestones.md后核旧9份并补3份，无覆盖。无新Windows读取/策略/工具或原程序执行；原生提交/回滚/崩溃、页面默认接入、账号/游戏/真机/官方仍未验。548Node是上一轮历史，本轮实际总数558。

## 来宾输入、数据CD与Windows5.1解析（stage90 / 2026-10-28）

**实际通过：** 正常解锁后普通来宾输入与PowerShell5.1.26100.4202版本查询；挂载D:MOLICUR89；Get-FileHash九成员均匹配stage89主机清单；parse.cmd返回MOLI_PARSE_OK并重复核对current.ps1及原始packed候选hash。当前主机选定配置仍Shared/NAT Connected1、IsolatedVm1、两共享目录标志0；新CD路径已记录。配置不替代本轮来宾联网测试。[来宾回执](../analysis/launcher-current-runtime-v2/guest-preflight.json)。

**实际失败并停止：** verify.cmd返回MOLI_CURRENT_VERIFY_EXIT=1，Windows报禁运行脚本、SecurityError/UnauthorizedAccess；工具主体未加载。五个策略作用域均Undefined，默认Restricted只是文档支持的推断。未进行Install/Observe/Restore、UAC或新候选/游戏执行，无NTFS恢复/首屏/子链/兼容验收。独立进程RemoteSigned[方案](../analysis/launcher-current-runtime-v2/policy-proposal.json)已提出，未获当次确认/未执行。

**限定只读诊断：** SysWOW64的普通*71.dll查询及固定运行目录含隐藏项的*71.dll查询均无对象；范围不覆盖所有加载搜索路径。旧日志数组前619字节摘要与最早619字节文件摘要不同，不支持原样追加假设。[回执与限制](../analysis/launcher-current-runtime-v2/readonly-diagnostics.json)。无新产品测试/构建，548Node和12项macOS工具测试均为先前实跑；产品/native保持原字节，完整目标未完成。

## 新版正常启动工具与只读介质（stage89 / 2026-10-28）

**实际新增：** PowerShell7.6.6 macOS-arm64便携归档70604356字节，SHA256 `6df833d094ebac1c1a74340d7b3437f4aaf5e03ce640484a1c4359f3ce8b3db1`，GitHub发布digest与UTF16LE随附hash表一致；pwsh的codesign strict通过、签名Microsoft UBF8T346G9，实际版本/ParserType探针通过。只装项目build，无全局安装、安全/审批配置变更。[工具回执](../analysis/launcher-current-runtime-v1/tool-readiness.json)。

**工具测试：** 原创AST/固定启动参数、hash/预算、拒覆盖/链接、创建JSON、原子替换/恢复、ReadOnly清除恢复、真实原创pwsh进程退出7与25ms超时保留、Mac平台拒绝等12项通过。初测发现未类型化$null被.NET string参数绑定为空，替换失败发生在原创主机夹具；改用NullString.Value后通过，微软API文档列5.1适用，Windows实际效果仍待验。首次校验表UTF8解码失败在提取前停止，识别FFFE BOM后复核原下载并按UTF16读取，无重下。[测试](../analysis/launcher-current-runtime-v1/host-tests.json)、[源](../analysis/launcher-current-runtime-v1/test_current.ps1)。

**介质：** data-only ISO1574912字节，SHA256 `5061fc63ff80d1bf98a2d4f546309369e39e179f7712065a8f0e02095be85eb4`，0400，描述符1/2/255、无boot/autorun，9成员全部回读相同，含原始当前packed候选。未挂VM或执行候选。[逐项回执](../analysis/launcher-current-runtime-v1/media-validation.json)。

**未验证：** GUI两次locked；来宾命令/新CD挂载/候选执行0。Windows5.1/UAC/NTFS、90秒真实父进程与子链、恢复启动、旧依赖根因、账号/游戏/目标设备/官方仍未验。本轮产品/native不变，不重跑其548Node/构建；548为stage88历史实跑。[本轮总检查](../analysis/launcher-current-runtime-v1/validation.json)。


## 新版更新器与独立候选校验（stage88 / 2026-10-28）

**静态证据：** 新版814080字节更新器SHA256 `22d56137a48d3c95f4a779c5c68ba85b3ea4fe2439e3e561159d003c697ce479`；Ghidra12.1.4分析18函数，27条初始证据后按缺口补2条下载worker证据，共29条，导出/快照关闭成功。主程序ACK资源在已核位置21字节与标记完全相同，仅为静态存在。AL返回及PE比较由实际汇编补核，未把void伪签名或FID类名当原始ABI。[台账](../analysis/launcher-current-updater-v1/static-audit.json)。

**本轮测试：** Python标准库原创28份ZIP/PE头向量、4项选项/所有权/旧行为/头校验范围测试，新增32项；新旧定点49项通过；完整40个测试文件548/548、无skip，Node26.9.0。真实1469515字节新ZIP经新接口输出1496576字节，SHA256 `71180e5bdda771e7d57dd27d2b879beddee55d61b957dadf7a2da60c907cb69a`，与既有候选及Python解包逐字节相同。[向量](../analysis/launcher-current-updater-v1/original-current-update-vectors.json)、[真实包回执](../analysis/launcher-current-updater-v1/real-candidate-check.json)。

**未运行/未验：** 当前GUI报告Mac locked；无来宾命令、新包传输/执行、原生事务或游戏验证。未重跑浏览器/Safari/手机/微信真机、native构建、完整PE/签名或官方互操作。首次inline Node实际样本检查误把stdin的dash当argv路径，在写回执/候选修改前ENOENT失败，修正argv[2..5]后对照通过；一次JS查询语法错误未执行工具。均不作为产品测试失败或审批拒绝。[完整验收](../analysis/launcher-current-updater-v1/validation.json)。


## 原登录器交接与当前更新包实测（stage87 / 2026-10-28）

**实测：** 当前旧登录器普通UAC一次，PID7684、15:11:59至15:12:03、exit0；受控日志尾部显示开始更新后结束，与旧REA成功交接分支一致。普通查询当前无匹配进程，不证明子进程从未运行。主EXE/两XML hash未变，Hidden更新器46080B hash匹配已证内嵌样本；日志1078B。[生命周期](../analysis/launcher-runtime-v2/startup-observation.json)、[文件](../analysis/launcher-runtime-v2/postrun-files.json)。

**静态/核心校验：** 当前摘要与旧MD5不同。1469515B真实ZIP经shared方法8/CRC/MD5核验，1496576B输出与Python标准库逐字节相同；这验证已有候选格式范围，不是运行该EXE。新REA14条及旧跟进10条均已导出关闭，新旧样本/内嵌更新器hash分开。[核心](../analysis/launcher-runtime-v2/independent-candidate.json)、[对照](../analysis/launcher-runtime-v2/candidate-independent-comparison.json)、[REA](../analysis/launcher-runtime-v2/rea-followup.json)。

**未通过/未运行：** 退出在90秒后才被确认，完整实时观察不通过；未见稳定登录窗口，未取得更新器PID/退出/替换成功。回车再次无响应，日志旧前缀校验仍待提交；ReadOnly及旧MFC运行库只是原因候选。无新包执行/VM传输、真实账号、游戏、设备或官方联机验收。本轮未改产品，未重跑全部测试/构建，516Node是stage75历史。[本阶段记录检查](../analysis/launcher-runtime-v2/validation.json)。

## 会话恢复与公开补丁取证（stage86 / 2026-10-28）

**最后访问复查：** 电脑控制在读取窗口前再次报告Mac locked且自动解锁失败，未提交原启动命令。需正常手动解锁并恢复既有终端焦点操作；当前Windows/联网授权保持。[最新工具结果](../analysis/launcher-patch-live-v1/access-recheck.json)。

**实测达到：** 自动暂停覆盖层明确可见，原生“恢复”一次后消失；没有重启/还原或改变自动暂停策略。正常继续不等于来宾输入通过，PowerShell仍未因点击打开，原启动/UAC0。[恢复](../analysis/launcher-patch-live-v1/vm-resume.json)。

**实际失败：** 当前目录HTTP RemoteDisconnected5.040秒；同路径正常HTTPS SSLEOF5.032秒；已核验旧快照绑定怀旧首区域221.122.108.10:80，单次Update.TXT请求15.003秒整体超时。三次均无正文，当前目录对/真实补丁清单均未取得，解析器没有获得新实际输入。无载荷/账号/执行，未把历史配置当当前。[HTTP](../analysis/launcher-patch-live-v1/network-observation.json)、[HTTPS](../analysis/launcher-patch-live-v1/https-catalog-followup.json)、[旧快照探测](../analysis/launcher-patch-live-v1/retained-source-probe.json)。

产品/native未改，无本轮测试或构建；516Node仍为stage75历史。四步全目标逐项均不满足最终验收，同一来宾输入阻碍已连续核实，现需人工终端焦点恢复；既有授权保留。[审计](../analysis/launcher-patch-live-v1/blocked-audit.json)、[本阶段记录校验](../analysis/launcher-patch-live-v1/validation.json)。

## 官网分发来源链（stage85 / 2026-10-28）

**临时目录重核：** 发布前实际发现旧三文件临时提取目录已不存在，校验在发布前中止；原ZIP和原安装器hash仍完整。已从同一不变ZIP重新以extract+test提取三文件，退出0且全部hash一致，当前文件再次回读通过。缺失原因未知，未删除或覆盖旧回执。[新增重核](../analysis/launcher-provenance-v1/installer-chain-followup.json)。

**最新访问补验：** 用户解锁后桌面可读，重新绑定当前窗口；原生Keyboard菜单Win+Q实际打开Windows Search。普通点击/文本尚未在来宾中生效，已请求人工点PowerShell/终端焦点；重绑后未重核guesthash，原启动命令未输入/提交、UAC0。主机最新配置仍共享网络Connected1/目录隔离1；不是官服/游戏或完整输入通过。[后续证据](../analysis/launcher-provenance-v1/access-followup.json)。

**实测通过：** 官网HTTPS页面DOM实际列出HTTP下载；按该原链接一次GET200取得1682288B ZIP，SHA2564f13…a45d。ZIP唯一安装器2192044B、SHA256dc90…fb11，与原件逐字节相同；innoextract1.9 extract+test选定三成员退出0，原登录器及两XML均匹配来宾hash。REA artifact-graph provider1独立清单2节点/1边、无矛盾，导出2记录。[包比对](../analysis/launcher-provenance-v1/archive-comparison.json)、[三文件链](../analysis/launcher-provenance-v1/installer-chain.json)、[REA](../analysis/launcher-provenance-v1/rea-archive.json)。

**真实失败与未执行：** 正常HTTPS获取EOF/0B，浏览器下载canceled且原因未给；未关闭TLS检查或绕过安全警告。REA归档无具体provider profile，带snapshot关闭失败，随后不带snapshot正常关闭，已有bundle保留。来源对应后准备原程序时，CUA先报告Mac locked；本轮启动/UAC0，未观察原运行/账号/游戏，产品代码/测试/构建未变。完整目标active且未完成。[访问](../analysis/launcher-provenance-v1/access-observation.json)、[验收](../analysis/launcher-provenance-v1/validation.json)。

## 原登录器启动前核对（stage84 / 2026-10-28）

**本轮实际通过：** 新鲜来宾目录、原登录器/两XML SHA256对照；Windows Authenticode查询实际返回`NotSigned`，未声称签名通过。现有共享网络Connected1、Mac目录隔离1/共享磁盘0/用户目录0，既有stage81快照元数据哈希未变且名称唯一，恢复启动仍未验。公开HTTP摘要单次GET200/33B匹配原登录器MD5，无EXE下载。[来宾](../analysis/launcher-runtime-v1/guest-preflight.json)、[更新摘要](../analysis/launcher-runtime-v1/update-metadata-preflight.json)。

**未执行：** 原登录器、内嵌更新器、游戏、账号/真实IPC或官服认证观察；没有产品改动、测试或构建重跑。未提交的反斜杠损字查询已Ctrl+C取消，改用可见核对的`XML/*`后查询成功。正常启动具体方案及风险已保存，执行时确认待回复；完整目标保持active且未完成。[本轮验收](../analysis/launcher-runtime-v1/validation.json)。

## 当前共享网络与原创调试运行验收（stage83 / 2026-10-28）

- 前轮1220项已核，六规范文档基线私有保留；产品/native及协议矩阵未变，未重跑产品构建或测试，stage75的516Node仍为历史。
- 网络原生菜单成功选择共享网络，Enabled1/Connected1/EmulatedType1；来宾正常HTTPS HEAD200，Mac文件共享隔离未变。原Qt组合控件问题仍未归因，本轮未出现新关键错误。[联网回执](../analysis/runtime-observer-v3/network-observation.json)。
- 原创固定x86 EXE普通运行退出0。ARM64 CDB创建了目标但WOW64上下文/回调观察未通过，正常qd返回；保留实际失败，不能据工具退出0追认目标通过。[普通运行](../analysis/runtime-observer-v3/fixture-normal-run.json)、[失败](../analysis/runtime-observer-v3/arm64-debugger-attempt.json)。
- 来宾x86 CDB摘要匹配、签名Valid、版本26100.9457；实际7个返回位点与REA/raw bytes一致。生命周期补验ASLR基址0x00810000，明确Exit process code0；多余g报No runnable debuggees后确认目标已退出，再q正常返回PowerShell、调试器退出0。[完整运行结果](../analysis/runtime-observer-v3/fixture-lifecycle.json)、[会话关闭](../analysis/runtime-observer-v3/fixture-session-close.json)。
- 每份原创介质均hdiutil生成及bsdtar全成员回读，再核来宾全部hash。长输入损字、IME组合、CDB radix/注释语法、退出后回调报错分别保留。无原登录器/游戏执行、真实IPC/凭据读取、保护绕过或官方游戏会话。

未验：每事件相对时间、通用采集器隐私/任意API入口、恢复点还原、原客户端/业务协议、网页/移动网页/小程序可玩及官方兼容。固定夹具结果不代替这些条件，完整目标继续active。[结构化验收](../analysis/runtime-observer-v3/validation.json)、[保存检查](../analysis/runtime-observer-v3/delivery-check.json)、[stage83清单](../analysis/delivery-manifest-stage83.json)。


## 当前Windows调试工具安装与自检（stage82 / 2026-10-28）

- stage81清单1207项与六文档基线已核；本阶段不改产品源码/测试，不重跑历史516Node或17项native测试。
- 微软正式SDK26100.9457 ISO单次正常HTTPS GET200、1173295104B；实际SHA256已固定，未冒充微软另发校验值。主机补入sevenzip26.04、msitools0.106_1、osslsigncode2.14_1及必要gcab/libgsf，安装调用未自动更新、统计或清理旧包。[工具](../analysis/runtime-tool-readiness-v1/toolchain.json)。
- UDF286项含archive记录；SDK MSI表1003文件/40CAB，提取1001项大小全匹配，缺两非压缩Redist；15核心文件独立双解码一致。ARM64 CDB同目录普通/延迟导入静态闭包4模块，外部59名及动态加载不据此判通过。[组件](../analysis/runtime-tool-readiness-v1/sdk-audit.json)。
- 默认CA失败与Redist摘要不匹配已分开保留；官方指纹绑定Root2010仅作为CA/TSA-CA输入后19项选定文件签名及时间戳退出0，没有系统/来宾信任导入或验证降级。Redist外层MD5匹配不替代各自签名，原因未知，未手动执行/改写/重签。[签名](../analysis/runtime-tool-readiness-v1/signature-audit.json)。
- 人工焦点恢复、单键/退格/英文切换、完整命令先读回后提交通过；原生菜单逐项selected及精确Open路径接入D:SDK介质。Windows主安装器hash匹配/Authenticode Valid，C盘安装前Free242279370752B。文件配置网卡0、隔离1、共享0，恢复点仍在但还原未测。[焦点与介质](../analysis/runtime-tool-readiness-v1/gui-focus-and-media-followup.json)。
- 用户在当前SDK许可页回复后接受本次许可。可选统计No，依赖反向取消并读回仅调试工具534.0MB；核对微软发布者后接受该安装UAC一次。安装器显示Welcome完成页并正常Close，未收集其进程退出码或逐项内部子包链。[安装回执](../analysis/runtime-tool-readiness-v1/sdk-installation-followup.json)。
- 来宾ARM64 CDB SHA256`fd1c20f7b6789095c73c21116832fa7bbdfb70d4288870f56e43b8a8b7d7870b`匹配、Windows签名Valid；`-version`返回10.0.26100.9457、紧接读取退出码0。这只证明自身启动，未启动调试目标、附加或采集。[自检](../analysis/runtime-tool-readiness-v1/cdb-windows-check.json)。
- 知识库双角色查询缺requirement-index已记录，未写知识库。原创目标/原程序本阶段执行0；跨架构观察、采集器隐私、完整游戏及平台/官方验收未完成，目标active。

早期JSON的未挂载/输入未恢复/许可待确认状态保留为时间点记录，以上安装/自检回执更新其当前状态。[结构化验收](../analysis/runtime-tool-readiness-v1/validation.json)、[保存检查](../analysis/runtime-tool-readiness-v1/delivery-check.json)、[stage82清单](../analysis/delivery-manifest-stage82.json)。


## 当前正常访问及恢复点核验（stage81 / 2026-10-28）

- 前轮1201项交付hash通过，六文档写前基线保留。用户正常解锁后普通CUA取得现有Windows11；既有v22原生快照名确认目标，Mac隔离勾选1/网络Source断开可见。
- 原生创建新快照`Moli-before-observer-install-20261028-stage81`一次，创建进度结束；Snapshots.xml名称精确一项匹配，文件SHA256`1b8b0309d8b459fee1d12ba5878fd108833584f7cc289371c757e791a94a686b`。还原启动未测试。[回执](../analysis/runtime-install-v1/recovery-point.json)。
- 来宾Task Manager三次明确提交、读回`launcher/cg/patch`均无匹配；不当穷尽进程证明。已安装应用`windbg`无匹配，不排除portable/SDK副本。原始像素/120ms坐标动作有效，首次半尺度点击未命中、追加/IME未提交不计成功。
- Source控件未展开，随后一次Devices/Network父菜单操作出现关键错误；本机精确报告QtWidgets栈EXC_BAD_ACCESS。仅关报告且新读确认Windows桌面仍可访问，快照元数据仍在；Connected0/IsolatedVm1/ShareAllMacDisks0/ShareUserHomeDir0。未发送报告、选择网络或重试失败菜单。[操作](../analysis/runtime-install-v1/gui-observation.json)、[去敏错误摘要](../analysis/runtime-install-v1/parallels-error-summary.json)。
- 当前人工网络调整待回应；无工具安装、目标导入/执行、原程序/账号/真实IPC/官服会话或产品源码变更。未重跑产品测试/构建，stage75的516Node仍仅为历史测试。完整目标active且未完成，下方旧blocked描述为历史。

保存核验见[本阶段交付检查](../analysis/runtime-install-v1/delivery-check.json)与[stage81清单](../analysis/delivery-manifest-stage81.json)；前轮记录保留，六文档以外的既有文件必须逐项保持原hash。

## 当前恢复目标的阻塞核实（stage80）

前轮1197项hash匹配，6个文档写前保留；第三个连续恢复目标回合，普通CUA仍报告locked，在目标应用/来宾取得前结束。旧工具包失败请求不再发出，无新测试/构建/下载、来宾/原程序、网络/安全或凭据操作。当前无活跃任务，不能标verified wait。

stage78的准备进展、stage79的下载路线排除与当前无进展分别记录；同一GUI依赖连续三轮、当前确无可推进Windows实测的普通路径，符合blocked门槛。目标未完成，既有权限保留，恢复普通访问后继续。[逐项审计](../analysis/runtime-access-blocked-v1/blocked-audit.json)、[交付保存](../analysis/runtime-access-blocked-v1/delivery-check.json)。


## 当前访问与公开下载核验（stage79）

本轮无实现进展。前轮1191项hash匹配、6个文档写前基线保留；1次普通GUI读取报告locked，无目标/活跃观察句柄。微软公开固定包HEAD403、正常GET403、0字节，均失败，未拿发布清单当包获取或安装成功。[状态](../analysis/runtime-access-v1/access-status.json)、[HEAD](../analysis/runtime-access-v1/pinned-package-head.json)、[GET](../analysis/runtime-access-v1/pinned-package-get.json)。无新产品/测试/构建/来宾/原程序/账号/游戏请求；完整目标未完成，正常手动解锁请求待回应。[交付核对](../analysis/runtime-access-v1/delivery-check.json)。


## 当前联网快照与原创观测准备（stage78 / 2026-10-27）

- 新授权与写前基线：用户批准联网及本项目工具操作；前轮1169项hash核对通过，9个受影响文档写前保存。
- 主机网络：5次固定HTTP GET均200、0重定向/重试/账号请求；另1次严格HTTPS握手以SSLEOFError失败。DNS198.18.1.240非全局，不宣称发行方身份或VM联网。原packed启动器MD5匹配，GameList原字节一致，RegionList变化；两份XML与返回MD5一致且解析为5游戏/12区域。
- 原创目标：现有MinGW/GCC编译退出0；x86 PE32/8969B/SizeOfImage24576/仅11个KERNEL32导入，无CRT。2次构建及准备副本字节一致；10项真实C函数host stand-in用例通过，包含毒指针不解引用、PID边界、失败清理。
- REA：2份原创函数dossier、16原CALL/IAT锚点通过；导出/快照后关闭。2项ISO9660文件回读hash匹配。静态RVA、host模拟及ISO回读分别不证明WinDbg/真实Win32执行/来宾导入。
- 当前CUA入口报告locked，无后续GUI、来宾命令、工具安装、原EXE/账号/游戏服务或VM网络操作，无挂起工具。已请求正常手动解锁；不是许可审批拒绝。
- shared/web/native源码未变，未重跑产品测试/构建/浏览器；stage75的516 Node仍仅作历史证据。完整目标未完成。[结果](../analysis/runtime-observer-v2/validation.json)、[工具/证据/边界](../analysis/runtime-observer-v2/static-spec.json)、[交付核对](../analysis/runtime-observer-v2/delivery-check.json)。


## 当前阻塞审计（stage77 / 2026-10-27）

本轮是阻塞核实与文档收尾，无产品实现进展。前轮1,163项交付hash全部一致，6个受影响文档写前保留基线；原包2,368项清单已与旧清单逐项匹配，REA当前open=false/cleanup_pending=false，无活跃观察任务可等待。没有重跑产品测试/浏览器/构建/旧静态查询或原EXE/VM，既有绿色结果仍按原阶段限定。

同一游戏业务consumer/protocol材料缺口连续三轮出现；固定样本、文件后备命令函数、四DLL直接线索与有界公开检索均未给出可实现的匹配规格。按完整需求逐项审计，游戏实现及官方/目标平台验收仍不成立；符合blocked门槛。[阻塞审计](../analysis/game-consumer-blocked-v1/blocked-audit.json)、[保存与交付核对](../analysis/game-consumer-blocked-v1/delivery-check.json)。仅将目标状态置blocked，不缩小目标或宣称完成。

## 当前游戏消费者静态核验（stage76 / 2026-10-27）

- 前轮1154项文件哈希匹配，11个文档/矩阵目标写前保留基线；固定Code11游戏哈希重新通过。
- REA6.7.0/Ghidra12.1.4新增2份函数dossier、4次xref、1次所属函数查询，共7记录导出/快照并关闭，cleanup_pending=false。34/34源字节锚点通过；消费者high-pcode截断/至少省1操作单列，空xref不作穷尽证明。
- 未修改产品代码、接口或UI，未重复产品测试/构建/浏览器；516项Node通过属于stage75历史记录。没有原程序/VM/真实IPC/账号或官方请求。
- 实际结果是排除把注册类命令路径当游戏argv的错误依据；游戏消费者/协议/游戏与目标平台官方兼容仍未验。[静态规格](../analysis/game-consumer-v1/static-spec.json)、[验收数据](../analysis/game-consumer-v1/validation.json)、[交付核对](../analysis/game-consumer-v1/delivery-check.json)。

## 当前首次配置与刷新模式验收（stage75 / 2026-10-27）

- **证据／规格：** 前轮1119项hash通过，21项目标基线保存。REA复用321记录，新增1函数/2读取/11 retained投影至335，导出/快照/关闭；26原字节/CALL/分支锚点和3错误声明反例通过。不是14个新函数或独立重分析。
- **字节／代码：** Python24生产/9结果、固定5游戏/12区域/8选择×3标记的24对照通过。516/516 Node（新15）及54项定向/ESM语法通过；原文ConfigEXE/所有权、空值/预算/坏字段、onlyRefresh lazy resource读与非CG分支均覆盖。
- **实际浏览器：** Chrome155/Playwright1.62.1，1280×1100/390×844：独立目录最终9项/186请求、24生产/9结果通过，5次原创请求独立核验；普通/刷新反馈、锁定伪造事件、失效、未给目录不能fallback、真实不支持文件名跳过枚举、pagehide均通过。缓存13/补丁13/无补丁Galaxy6回归通过；0相关page/console错误。六项检查与新首屏/控件/交接截图已观察。
- **实际入口：** 4174交付示例新运行，选中补丁后勾刷新并重准备，交换/选择得到0资源/映射17B/不请求原游戏的交接；原创对端核验1次请求，服务正常exit0。

**产物留痕：** 缓存回归重写同阶段两张初始首屏PNG路径，初始精确bytes未记录，无法确认恢复/比较；原9项与13项回执保留。已在新目录独立重验9项并用`open(wx)`写截图buffer，碰撞拒写/原bytes保留有机械证明；最终截图路径互不重叠并记录SHA256。不能把重采集当原件。[事故](../analysis/launcher-v30/artifact-output-incident.json)、[视觉](../analysis/launcher-v30/visual-review.json)、[总验收](../analysis/launcher-v30/validation.json)、[清单](../analysis/delivery-manifest-stage75.json)。历史stage65事故保持原限制。

[门槛审计](../analysis/launcher-v30/launcher-gate-audit.json)接受已证登录器自身契约的限定实现，允许下一步游戏消费者静态联合验证；完整登录器、实际Config/Profile/账号、源信任/原生恢复/容量/平台、游戏及官方接受未完成。无原样本/VM运行或真实账号/官方请求。

## 保留资源快照／保存／恢复验收（stage74 / 2026-10-27）

- **证据与格式：** 前轮1089项hash匹配，18项修改前基线保留；两固定样本/私有REA导出与快照复核，无新native查询。Python两原创资源向量独立核MD5与固定绑定key。新pure格式及受影响ESM语法检查通过。
- **Node：** 501/501（新10）通过，覆盖owned bytes/空文件、所有binding字段、准确格式/摘要/路径/预算、共享/假bytes拒绝、存储输入/时限/取消及状态恢复/失败清就绪。
- **实际Chrome IndexedDB：** 12项/51模块请求通过；原生CAS恰一胜、put成功后abort保完整旧记录、注入put异常保旧记录、提交完成后取消与迟到deadline返回已提交标志、坏内容/未知schema/未来DB保留。put异常为明确注入，不是实际填满quota。
- **实际页面与回归：** 1280×1100/390×844，新13项/299请求，原补丁13项/201请求和无补丁Galaxy6项/118请求通过。含保存/重载/精确绑定恢复/再次选择、两页面冲突、真实等待open取消、pagehide隔离迟到及实际原创交换。0pageerror/console warn/error，截图首屏和保存/恢复逐张观察，六项检查通过。
- **交付入口：** 原4174示例实际新运行，经明确保存/重载/恢复后再次选择，1次原创请求由Python独立核验，交接1资源/映射17字节，服务/对端exit0正常结束。新UI另2次、旧补丁2次、默认回归3次完整原创请求也分别核验。

[总回执](../analysis/launcher-v29/validation.json)、[真实IDB](../analysis/launcher-v29/resource-store-browser.json)、[页面](../analysis/launcher-v29/ui-cache-browser.json)、[视觉](../analysis/launcher-v29/visual-review.json)、[交付清单](../analysis/delivery-manifest-stage74.json)。本轮无失败回执或历史覆盖；代码复核补入undefined Galaxy和VersionError边界后完成验证。64MiB范围/原生事务/来源信任/服务/游戏、真实quota耗尽、Safari/真机/微信/完整BFCache未验，完整目标保持active。

## 保留登录页补丁选择验收（stage73 / 2026-10-27）

- **静态/参考：** 1056前轮交付hash和20项修改前基线已核对；v26/27两样本及私有REA导出/快照重核一致，无新原程序查询/事实。原创Python ZIP/MD5夹具生成58字节资源候选。
- **单元/平台端口：** Node491/491（新13）通过，覆盖真实Blob所有权/路径/预算/取消、候选选择/跳过门槛、快照/迟到/新代次和显式来源；新增/受影响ESM语法检查通过。
- **实际页面：** Chrome155/Playwright1.62.1，1280×1100和390×844；补丁13流程192请求、默认无补丁/Galaxy6流程112请求通过，0pageerror/console warn/error。实际HTTP、FileList基文件追加、取消重试、目录/编码/文件/配置/pagehide失效、XML缓存恢复和来源拒绝前零更新GET/零会话通过。
- **独立交换与示例：** 补丁桌面/手机2次、默认回归3次完整原创请求由Python独立解密核对；交付`launcher-browser-game-patch-local.mjs`另在4174实际跑通1次，完整交接1项资源/映射17字节，进程与服务正常退出。截图首屏/候选审阅已观察，六项浏览器检查通过。

最初fieldset断言重复了既有测试API误解，随后append缺基文件测试等错成功文案；均为测试预期问题，保留两份失败回执，不更改产品政策。最终13项通过另存，历史产物未覆盖。[修正](../analysis/launcher-v28/review-corrections.json)、[视觉](../analysis/launcher-v28/visual-review.json)、[总回执](../analysis/launcher-v28/validation.json)、[清单](../analysis/delivery-manifest-stage73.json)。候选只在页面内存；真实来源信任、安装提交/恢复、完整登录器、游戏/官方及Safari/真机/微信仍未验。

## 保留补丁配置与下载验收（stage72 / 2026-10-27）

- 静态：固定601b…主样本/快照重核，REA新增1函数、1读取、4投影和1已有重查至321记录，已关闭；32源锚点/3负例通过。重查不是新函数或独立证据，原pcode/locale/运行失败限制保留。[证据](../analysis/launcher-v27/static-spec.json)。
- 独立参考：Python32原始生产/21退出码向量；本地固定GameList/RegionList hash与5游戏/12区域、8补丁命令通过PythonElementTree与实际JS交叉核对，只保存元数据和命令摘要。[生成器](../analysis/launcher-v27/patch_entry_oracle.py)、[固定配置](../analysis/launcher-v27/fixed-config-regression.json)。
- Node：478/478，新21；含catalog的定向52/52，0失败；已有v26字节核心也回归。生产端/迭代器/input快照、顺序依赖、无许可来源、取消、deadline跨请求、坏包/清单与退出码均覆盖。[全量](../analysis/launcher-v27/node-tests-verified.log)、[定向](../analysis/launcher-v27/patch-entry-tests-final.log)。
- 实际浏览器：Chrome155/Playwright1.62.1，11流程、13次更新HTTP/346总请求，0外部请求/非预期console/page错误；32生产/21退出码与旧31语法/10候选在真实ESM复验，独立服务核对请求顺序。无新UI/视觉/物理设备验收。[回执](../analysis/launcher-v27/browser-qa-verified.json)。
- 运行：`node web/examples/launcher-game-patch-local.mjs`实际三次原创GET后生成候选并正常关闭。[输出](../analysis/launcher-v27/example.log)。

候选仍未认证，未写安装目录/执行原程序。页面接入、存储/选择/失效、真实来源与包、Win32复制/属性/进程/恢复、完整登录器及后续游戏/目标平台/官方验收保持未完成。[完整验收](../analysis/launcher-v27/validation.json)、[交付检查](../analysis/launcher-v27/delivery-check.json)。

## 保留游戏补丁核心验收（stage71 / 2026-10-27）

- 静态：固定Patcher SHA256 195f3a…，REA6.7.0/Ghidra12.1.4共35函数/2读取/37记录；闭会话open=false/cleanup_pending=false。28源锚点/3身份或锚点篡改负例通过，未运行原程序。[来源](../analysis/launcher-v26/static-spec.json)。
- 独立参考：Python字节扫描器31语法向量，zipfile/zlib/hashlib生成10候选场景；stored/Deflate、目录首项、多条目、create/append/replaceto/串行及skip覆盖。夹具均原创，[生成器](../analysis/launcher-v26/patch_oracle.py)。
- Node：457/457，新21；定向38/38。首轮37测试中1个测试误把含额外冒号的字段当有效路径，按已证native分段行为修正后通过，首轮失败日志保留。[全量](../analysis/launcher-v26/node-tests.log)、[初始](../analysis/launcher-v26/patch-tests.log)、[定向最终](../analysis/launcher-v26/patch-tests-final.log)。
- 运行：实际Chrome155/Playwright1.62.1在现有回环/CSP connect-none通过31语法/10候选/8坏包，30同源请求，0console/page错误/外部请求；示例三种操作运行成功。新UI/视觉/移动设备未验，不复用旧截图宣称本轮通过。[Chrome](../analysis/launcher-v26/core-browser.json)、[示例](../analysis/launcher-v26/example.log)。

**限制：** 此轮通过纯字节候选，不等于安装目录更新、原生事务/回滚、真实服务器补丁、身份认证或官方/目标平台兼容。UPD-GAME状态仅限定样本事实改observed，其余19状态不变，整体目标active。阶段完整证据与交付保留核验见[validation](../analysis/launcher-v26/validation.json)、[delivery-check](../analysis/launcher-v26/delivery-check.json)。

## 保留Galaxy验收（stage70 / 2026-10-27）

| 层 | 实际结果 | 限制 |
|---|---|---|
| REA/源字节 | 6新函数、9记录至314（1份旧helper重查不计新）；26锚点/3负例，export/snapshot后关闭 | 原inclusive-loop/first-name-match仅静态观察，不宣称运行故障 |
| Node/独立参考 | 436/436，新15；63 PythonElementTree/筛选/全名计数向量；10ESM/1Python AST | 原创XML，严格政策不冒充native边界行为 |
| 固定旧配置 | hash一致，5游戏/12区域/8可用选择/5消息向量通过 | Galaxy为0，不能证明真实分组接受 |
| Chrome新/旧 | 6分组/9无分组流程，各98本机请求；3+4完整请求由独立Python核对 | 实际HTTP/IDB/FileList/WS/TCP，无官方/原EXE/VM |
| 视觉 | 1280×1100/390×844，身份/内容/无遮罩/控制台/图像/交互六项通过 | 未测Safari/真机/微信/完整BFCache |

[回执](../analysis/launcher-v25/validation.json)、[Node](../analysis/launcher-v25/node-tests-final.log)、[新浏览器](../analysis/launcher-v25/galaxy-browser.json)、[旧流程](../analysis/launcher-v25/plain-config-regression.json)、[视觉](../analysis/launcher-v25/visual-review.json)、[交付检查](../analysis/launcher-v25/delivery-check.json)、[清单](../analysis/delivery-manifest-stage70.json)。两个现有测试仅更新为已证结构/明确选择门槛，历史oracle和回执不改。984前轮hash为修改前真源、22目标写前基线；最终保留计数见交付检查。完整登录器、游戏与官方/设备仍未完成。

## 当前统一交接验收（stage69 / 2026-10-27）

| 层 | 实际证据 | 限制 |
|---|---|---|
| REA复用 | 固定样本/305记录的两个私有导出hash/size匹配，49/21短锚点保留；无新producer，session closed | 不把页面适配政策当新的原二进制行为 |
| Node | 421/421，新17；45独立process+handoff联合向量、旧回包选择、字段编码/目录/所有权/转移清理 | 原创夹具，无真实账号或资产内容 |
| 新浏览器 | 9项/98本机请求，4完整请求由Python独立核对；实际FileList/双Code11/CP936及UTF8路径/旧状态失效 | 无游戏/OS进程/官方接受 |
| 旧交接回归 | 最终8项/147请求，7个完整请求独立核对，0非预期console/page错误 | 原编码/配置的完整17/9套件未在本轮重新跑，既有回执保留 |
| 视觉与语法 | 1280×1100与390×844，六项浏览器检查通过；最终控件/就绪图已观察，11ESM语法与原创例子正常退出 | 不等于Safari/真机/小程序/完整BFCache |

[验收](../analysis/launcher-v24/validation.json)、[Node最终日志](../analysis/launcher-v24/node-tests-final.log)、[新浏览器](../analysis/launcher-v24/launch-browser.json)、[回归](../analysis/launcher-v24/handoff-regression.json)、[视觉](../analysis/launcher-v24/visual-review.json)、[交付检查](../analysis/launcher-v24/delivery-check.json)、[清单](../analysis/delivery-manifest-stage69.json)。

真实产品缺陷已复现：consumer覆盖fill，close显示closed但mapping仍非零。现捕获内建fill，分离一个buffer也继续清其他view；外部copy/转移目标不谎称擦除。两个早期浏览器失败分别是fieldset isDisabled断言和webkitdirectory传空数组的QA假设，原回执/像素与修复前回归已保留，不因它们改产品。[复核记录](../analysis/launcher-v24/review-corrections.json)。前轮959项作修改前真源，目标从19增至20前另存handoff原件；native与历史回执保留，最终哈希计数见交付检查。完整登录器/游戏/官方和设备仍未完成。

## 当前命令/资源生产验收（stage68 / 2026-10-27）

| 证据层 | 实际结果 | 限制 |
|---|---|---|
| REA静态 | 24函数+7读取、31新记录至305，export/snapshot后关闭；49文件锚点/3身份或字面负例 | 不运行原程序或推断工具冲突名称 |
| Node | 404/404通过，新14；48进程/4枚举独立Python向量，边界/ownership/未使用字段/descriptor异常覆盖 | 原创输入，无真实账号/资源资产夹具 |
| Chrome ESM | 48+4与5既有文件名通过，30本机源码请求，0warn/error/pageerror | 无新UI、整页视觉回归、OS枚举/进程/游戏或真机验收 |
| 示例/静态 | 原创data示例正常退出；4 ESM语法/1 Python AST通过 | 打印数据不执行参数 |
| 保留性 | 前轮940项hash为修改前真源，14计划目标写前基线；只改这些旧文件，native保留 | 最终计数/链接/清单见下方回执 |

[当前回执](../analysis/launcher-v23/validation.json)、[Node日志](../analysis/launcher-v23/node-tests.log)、[源核验](../analysis/launcher-v23/process-anchor-audit.json)、[浏览器](../analysis/launcher-v23/browser-core.json)、[交付检查](../analysis/launcher-v23/delivery-check.json)、[清单](../analysis/delivery-manifest-stage68.json)。首轮测试13/14，原因是metadata投影多比oracle的bytes_hex，命令bytes已一致；初始日志保留，修正测试投影后全部通过，未为此改产品。历史v19回执覆盖事故不重写。

此前4174示例会话48946现已exit1、端口未监听，originalPeerVerified/stopped均false，原因未从输出归因；未用它作成功证据，也未自动重启。本轮验证独立使用原4173只读服务。实际locale/ACP/DBCS/Win32匹配顺序、上游ready与原游戏参数接受、真实账号/服务、更新信任/事务、手机/微信/官方兼容仍未完成，目标active。

## stage67 / 登录器v22（2026-10-27，当前）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| 前置/REA | 911旧交付hash通过、16目标基线；REA6.7.0/Ghidra12.1.4新增4函数/7记录至274，导出/关闭 | [前置](../analysis/launcher-v22/preflight.json)、[静态](../analysis/launcher-v22/static-spec.json) |
| 独立源码/格式 | 21源码锚点、94标量/126原创写入向量、42回包选择投影；最大92B、尾空格/NUL/首NUL与未写尾部均覆盖 | [锚点](../analysis/launcher-v22/handoff-anchor-audit.json)、[参考](../analysis/launcher-v22/original-handoff-vectors.json) |
| Node | 390/390，新10、0fail/skipped；actual reply selection→producer、raw gate、own/bytes/边界、lease一次借出/close清view | [完整](../analysis/launcher-v22/node-tests.log)、[专项](../analysis/launcher-v22/handoff-tests.log) |
| 浏览器 | Chrome155/Playwright1.62.1，1280×1100/390×844；8交接/135请求、9编码/262请求、17配置流程+1测量/473请求通过；0非预期错误、1预期取消单列 | [交接](../analysis/launcher-v22/handoff-browser.json)、[编码](../analysis/launcher-v22/encoding-regression.json)、[配置](../analysis/launcher-v22/config-session-regression.json) |
| 独立I/O/时限 | 新交接7个实际请求由Python核对；编码6完整、配置5完整/1取消保持；总deadline10039ms含5500ms前置 | [汇总](../analysis/launcher-v22/validation.json) |
| 修复/修正 | 初始交接7通过后发现pagehide仍显示就绪，修复后8通过；配置旧文案断言在6项后失败，改验真实CG17B准备/游戏未接收状态后17+1通过。失败/日志/像素先保留 | [复核](../analysis/launcher-v22/review-corrections.json)、[视觉](../analysis/launcher-v22/visual-review.json) |

pagehide为受控PageTransitionEvent处理器测试，非完整BFCache；snapshot/截图不是游戏接收或安全擦除全部内存证明。没有创建Windows映射/argv/执行原EXE或VM、读取真实IPC/账号或请求官方游戏服务；依赖无新增、无提交发布。消费者、真实身份/opaque寿命、argv/资源、更新信任/事务、Safari/真机/小程序/官方兼容未验，完整目标active。[汇总与交付](../analysis/launcher-v22/validation.json)。

## stage66 / 登录器v21（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| 前置/REA | 初始887旧交付hash通过、16目标写前基线。REA6.7.0/Ghidra12.1.4新增5函数/9记录至267，导出/快照后关闭 | [前置](../analysis/launcher-v21/preflight.json)、[静态](../analysis/launcher-v21/static-spec.json) |
| 原文件独立核验 | .text完整720384B内26偏移/2析构CALL/4展开JMP一致；初始搜索范围遗漏4处已补查，不能证明间接路径/清零/全局无账号存储 | [审计](../analysis/launcher-v21/credential-operand-audit.json) |
| Node | 380/380，新11（核心5/存储6），0fail/skipped；产品通过后仅文档/证据变化 | [完整日志](../analysis/launcher-v21/node-tests.log) |
| 设置浏览器 | Chrome155/Playwright1.62.1，1280×1100/390×844，12项/495请求：实际Storage保存/刷新恢复、取消/锁定、无效保留/明确替换、不可用/写入异常/回读失败/不一致；恢复后实际请求经Python核对 | [回执](../analysis/launcher-v21/preferences-browser.json)、[视觉](../analysis/launcher-v21/visual-review.json) |
| 编码/配置回归 | 9编码/256请求；17配置会话+1测量/462请求，整体10041ms含5500ms前置。0非预期错误/console warn，1预期取消单列 | [编码](../analysis/launcher-v21/encoding-regression.json)、[会话](../analysis/launcher-v21/config-session-regression.json) |
| 修正与历史 | 初始QA用了错误selector，0项完成/退出1后才改测试重跑，未改产品或放宽断言。stage65历史事故记录保留，本轮新输出先核路径/guard，不重写历史回执 | [初始失败](../analysis/launcher-v21/preferences-browser-initial.json)、[复核](../analysis/launcher-v21/review-corrections.json) |

正向保存使用真实Storage；只有专门负例用受控方法hook模拟blocked/quota/readback异常与竞争，不能当原生配额或竞态全面覆盖。回读相同不代表原子CAS、断电耐久或原Profile映射。原程序/VM/真实账号/官方游戏端点无执行，依赖未新增、未提交/发布。实际ACP、账号/条款/服务身份与opaque寿命、官方更新/原生事务、游戏/Safari/手机真机/微信/官方兼容仍未完成，完整目标保持active。[汇总](../analysis/launcher-v21/validation.json)。

## stage65 / 登录器v20（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| 前置/REA复用 | 初始857旧交付hash通过，22个修改目标先留基线；复用ANSI/16B/GetACP既证事实，无新REA生产查询 | [前置](../analysis/launcher-v20/preflight.json)、[原静态证据](../analysis/launcher-v18/static-spec.json) |
| 依赖/独立参考 | Unicode官方936表/License V3固定hash与可重现生成；21791映射/2149未分配/1037 UTF-8标量对照 | [依赖](../analysis/launcher-v20/dependency.json)、[参考](../analysis/launcher-v20/encoding-reference.json) |
| Node | 369/369、新11，0fail/skipped；字节边界、映射/畸形/无回显/own参数与用户名许可/请求一致 | [最终完整日志](../analysis/launcher-v20/node-tests-final.log) |
| 编码浏览器 | Chrome155/Playwright1.62.1、1280×1100/390×844，9检查、244源码回环请求、0非预期错误或console警告；6完整原创请求独立核对 | [当前编码回执](../analysis/launcher-v20/encoding-browser.json) |
| 配置会话回归 | 17流程+1测量，440请求/0非预期错误/1次预期取消另列；整体10043ms含5500ms前置等待；Python5完整请求+1取消 | [当前回归回执](../analysis/launcher-v20/config-session-regression.json) |
| 交付示例/视觉 | 实际windows-936示例中文交换、四候选/两可选，Python true、正常退出/端口释放；当前桌面/390px截图已查 | [示例](../analysis/launcher-v20/example-browser.json)、[视觉](../analysis/launcher-v20/visual-review.json) |

**本轮证据事故单独处理：** 误执行旧QA脚本，覆盖v19详细回执及3张临时PNG；精确原内容不可恢复。stage64原manifest哈希、既存汇总/日志保留，旧回执现为事故指针，当前重验另存v20；不得把新结果当旧原件。22项计划修改以外该历史回执是单独披露的意外变更。[事故及原身份](../analysis/launcher-v20/artifact-output-incident.json)、[初始测试假设修正](../analysis/launcher-v20/review-corrections.json)。

实际原程序ACP/IME/best-fit/其他代码页、真实条款/账号持久化/服务身份/opaque寿命、官方更新信任/原生事务、游戏/Safari/手机真机/微信小程序及官方兼容未验收。无原EXE/VM/真实账号/官方游戏端点、提交或发布；纯数据依赖在本轮普通授权内补齐。完整目标继续active。[汇总与交付层](../analysis/launcher-v20/validation.json)。下方历史v19详细回执须带本次事故限制阅读。

## stage64 / 登录器v19（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| 前置/REA | 832项旧交付hash一致，21目标基线；样本/bundle身份及7函数证据重核，复用已有REA，不重复生产查询 | [前置](../analysis/launcher-v19/preflight.json)、[证据](../analysis/launcher-v19/reused-native-spec.json) |
| Node | 358/358、新11；Code/许可原文、重复/顺序/允许拒绝/快照、实际HTTP新pair和自更新候选等；0fail/skipped | [完整](../analysis/launcher-v19/node-tests.log)、[23专项](../analysis/launcher-v19/focused-tests.log) |
| 实际浏览器 | Chrome155/已有Playwright1.62.1，1280×1000/390×844，17流程+1测量；429回环请求、1次负例ERR_ABORTED单列，0非预期错误/warn | [回执](../analysis/launcher-v19/browser-validation.json)、[视觉](../analysis/launcher-v19/visual-review.json) |
| 时限/独立算法 | 整体10052ms，包含前段5500ms参考等待与后段初始化；最终6次Python连接，5完整请求独立解密/逐字节核对，1取消关闭；同页counter0→1 | [回执](../analysis/launcher-v19/browser-validation.json) |
| 交互/存储 | HTTP→全pair/目标→四页/真实WS/TCP/候选；原生IDB显式保存、刷新/恢复、CAS冲突、坏记录保留；区域变化清输入/确认/候选；自更新/摘要失败不留目标 | [浏览器](../analysis/launcher-v19/browser-validation.json) |
| 交付示例/修正 | 实际示例脚本页面跑通、Python核对true/正常退出并释放端口。初始2个单测API假设和fieldset断言修正保留；没有放宽生产校验 | [示例](../analysis/launcher-v19/example-browser.json)、[修正](../analysis/launcher-v19/review-corrections.json) |

无原EXE/VM/真实账号/官方游戏端点、新依赖安装或提交发布。完整目标仍未完成：非ASCII/实际ACP、适用条款/账号与服务身份/opaque寿命、可信官方更新/原生事务、游戏、Safari/真机/小程序与官方兼容未验收。手动配置路径不证明原在线初始化完成；原生File取消只丢弃完成后的结果。文件保留/链接/矩阵/hash层另见[汇总](../analysis/launcher-v19/validation.json)。下方各阶段按原范围保留。

## stage63 / 登录器v18（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| 前置/REA | 778旧交付hash通过；13原目标及追加原创peer基线保留；固定样本导入匹配快照，新增2函数/3xref，3独立IAT字节锚点通过，导出/快照后关闭 | [前置](../analysis/launcher-v18/preflight.json)、[静态规格](../analysis/launcher-v18/static-spec.json) |
| 依赖 | ws8.22.0主注册表tarball SHA512/SHA1通过，19文件/MIT保留；无install scripts/原生插件/全局配置变更 | [记录](../analysis/launcher-v18/dependency.json) |
| Node | 347/347、新12，通过；新增真实WS→TCP→Python三分支、EOF队列/复制/取消、Host/Origin/token/端点拒绝等；0fail/skipped | [完整日志](../analysis/launcher-v18/node-tests.log)、[专项](../analysis/launcher-v18/loopback-tests.log) |
| 浏览器实际运行 | Chrome155.0.8059.85/Playwright1.62.1，独立临时上下文，1280×1000及390×844；最终10项/167源码回环GET，0console warn/error、pageerror/requestfailed | [回执](../analysis/launcher-v18/browser-validation.json)、[视觉](../analysis/launcher-v18/visual-review.json) |
| 独立算法/交互 | 最终浏览器profiles2/empty1/rejected1的4请求经Python/PyCryptodome独立解密、逐字节核对且关闭；两个fresh公值不同；stall取消关闭。四页/拒绝/UTF-8/字面内容/保留/刷新/候选选择均通过 | [浏览器](../analysis/launcher-v18/browser-validation.json) |
| 复核修正 | 根入口相对资源404、输入变化未丢弃旧候选两处实现缺陷已复现/修复；第二次误期望6候选按既有4修正，无放宽协议；失败记录保留 | [修正](../analysis/launcher-v18/review-corrections.json)、[诊断](../analysis/launcher-v18/browser-diagnostic.json) |

此为限定本地浏览器登录切面验收；没有运行原EXE/VM、读取真实账号或请求官方游戏服务。实际ACP、适用条款/账号持久化、配置/bootstrap合流、来源信任/原生更新事务、服务/opaque寿命、游戏、Safari、远程手机/微信小程序与官方兼容未验收。stage63结果不能代替这些证据。具体文件保留/文档链接/交付hash核对见[汇总](../analysis/launcher-v18/validation.json)；下方按历史阶段保留。

## stage62 / 登录器v17（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| 前置/规格 | stage61的756项hash匹配，13目标基线保留；复用v7/v9 REA字节/控制证据，无新原样本问题或REA调用 | [preflight](../analysis/launcher-v17/preflight.json)、[端口政策](../analysis/launcher-v17/session-spec.json) |
| Node完整相关回归 | **335/335**，0失败/跳过：原300＋会话25/Node端口10 | [日志](../analysis/launcher-v17/node-tests.log) |
| 实际TCP独立对端 | 9次原创Python/PyCryptodome回环会话，独立pow/解密/逐字节请求核对：候选/空/拒绝、两次新熵、断流/坏挑战/截断、真实10s超时和EOF；没有固定重放服务器key替代新熵分支 | [对端源](../analysis/launcher-v17/original_tcp_peer.py)、[运行测试](../web/tests/launcher-session.test.mjs) |
| 可运行示例 | 另三次真实TCP候选/空/拒绝，3×peerVerified=true，候选显式选择sourceOrdinal0；只输出状态/计数/核对结果，退出0 | [示例](../analysis/launcher-v17/example-output.json) |
| 生命周期/预算 | 开启前有限轮换；已开不重发；open/read/write/熵等待取消；迟到连接/完成、绝对截止优先、输入快照、4MiB合法空记录预算、端口关闭不响应/拒绝不挂住，候选释放 | [Node日志](../analysis/launcher-v17/node-tests.log) |
| 复核修复 | 可变close被重读：原0/替换1，修复后原1/替换0；返回错误对象可改变内部错误码：修复为冻结code/message。null定时器与原型code边界也收紧 | [复核证据](../analysis/launcher-v17/review-corrections.json) |
| 浏览器 | Chrome155.0.8059.85/Playwright1.62.1独立临时上下文6项/27源码GET通过；三组原创注入流、真实WebCrypto路径、取消/迟到关闭/所有权、原配置页身份/内容/控制/CSP | [回执](../analysis/launcher-v17/browser-session-smoke.json) |
| 控制台/截图/语法 | 最终0console warn/error/pageerror/requestfailed；桌面1280×1000截图人工核对，PNG/脚本在项目外；7 ESM和1 Python AST通过 | [汇总](../analysis/launcher-v17/validation.json) |

**初次失败不是通过：** 端口测试先以一次setImmediate推定远端关闭，9/10；改观察close后又在peer尚未触发accept时抓取Set，9/10并引发测试清理中的未观察read拒绝。已保留两个日志，改为实际accept→注册close→取消→等待拒绝与close，断言仍为对端Set空；生产行为未为测试放宽。[原假设/修正](../analysis/launcher-v17/test-corrections.json)。全套335项已在全部修复后运行。

**证据边界：** Node为真实TCP、本机原创对端独立算法；浏览器是同一运行时加原创注入流，不宣称浏览器TCP。真实平台熵路径与caller-provided夹具熵区分。关闭调用完成不等于远端关闭；9次对端场景的EOF/预期断流分别验。没有日志/成果中的真实nonce/key/凭据、原程序/VM或官方游戏请求。现有页面未新增会话控件/CSP；Safari/手机/小程序、真实账号/条款/服务身份/生命周期、原生更新事务和游戏仍未验。未重跑旧真实XML/图形导入、完整窄视口和未变Swift/Python资源套件。

## stage61 / 登录器v16（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| 身份/前置 | stage60的746项交付hash、固定主登录器601b…及v14快照hash一致；16个目标基线保留，无Git | [preflight](../analysis/launcher-v16/preflight.json) |
| REA | v14快照补8函数/14记录至253，DIALOG287/1与2控件、空own message表、Profile IAT5处引用；导出/快照后关闭 | [规格/范围](../analysis/launcher-v16/static-spec.json) |
| 独立固定字节 | 14 direct call＋5 IAT/import＋10数据/比较/控件操作数＝29通过，改字节/截断/空样本身份均拒绝 | [操作数回执](../analysis/launcher-v16/mode-operand-audit.json) |
| 独立政策向量 | Python54组初始化/选择/取消/切换/确认表，生成器与保留JSON逐字节一致；原生已证规则和新严格政策分别标记 | [生成器](../analysis/launcher-v16/make_mode_vectors.py)、[向量](../analysis/launcher-v16/original-mode-vectors.json) |
| Node完整相关回归 | **300/300**，0失败/跳过：原288＋12项模式/确认/取消/初始化差异、字段所有权/边界/输入清理组合 | [日志](../analysis/launcher-v16/node-tests.log) |
| Chrome实际运行 | Chrome155.0.8059.85/Playwright1.62.1：54向量、冻结/受控错误/bytes清理、原配置缓存保存/恢复/计划与原图形夹具，5项/48回环GET通过；0console warn/error、pageerror、requestfailed | [浏览器回执](../analysis/launcher-v16/browser-mode-smoke.json) |
| 语法/保持范围 | 3 ESM语法与2新Python AST通过；web产品源码/服务/native/算法依赖保持stage60，模式无I/O | [汇总](../analysis/launcher-v16/validation.json) |

**名称/范围区别：** 字面过程搜索未匹配dlgUserMode，精确API名查找未解析；这不证明对话框/API不存在，后续用已知构造/虚表指针与原始IAT验证。新增scalar wrapper没有解析的direct caller，只是该覆盖下的负结果；框架还有注册表分支，不声称无账号持久化。伪代码标签与返回类型不能代替指令/操作数。29操作数验证固定样本静态绑定，54政策表不冒充原程序运行。

**实现差异/未验证：** 显式取消与未确认均不写入，未复制原modal非1全归2。计划不接受账号bytes、不执行清空或存储；初始化mode2保留用户名勾选，切换无论同模式都发清空意图。实际模式UI/Profile映射/耐久性、账号记忆/条款/服务会话/游戏、原程序/VM/官方连接和Safari/真机/小程序仍未验。原页面截图已人工看过；未重跑stage60完整14项/窄视口/GB18030或未变Swift/Python资源套件。

## stage60 / 登录器v15（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| 规格/修改前状态 | 复用固定样本v6配置/v14缓存边界，无新增REA；修改前737项交付hash一致，无Git | [preflight](../analysis/launcher-v15/preflight.json)、[规格](launcher-static.md#launcher-v15) |
| Node完整相关回归 | **288/288**，0失败/跳过：原285＋原字节File所有权/类型/size快照3项 | [日志](../analysis/launcher-v15/node-tests.log) |
| 实际配置页面 | Chrome155.0.8059.85/Playwright1.62.1；标题/URL、有效内容、无框架错误覆盖层、CSP与14项流程/125源码回环GET通过 | [UI回执](../analysis/launcher-v15/ui-validation.json) |
| 交互/原生IDB | 显式保存/重载/恢复、raw/选项、双页CAS不覆盖、重检不应用模型、写失败、按钮取消与晚提交、旧异步读取、缓存不可用/坏记录、恢复后离线计划 | [14项详细结果](../analysis/launcher-v15/ui-validation.json) |
| 独立窄视口 | 从初次导航起390×844上下文：保存→恢复→填目录→计划；无横溢出、header仅1、4按钮153×46；25源码GET | [窄屏回执](../analysis/launcher-v15/mobile-validation.json) |
| GB18030实际文件 | 原创ASCII XML＋`d6 d0 ce c4`“中文”向量，上传→保存→重载→恢复，编码与原始bytes一致；50源码GET | [编码回执](../analysis/launcher-v15/encoding-validation.json) |
| 最终控制台/截图 | 上述三组共200 GET、0console warn/error与pageerror；桌面1280×1000、390×844初始/恢复截图已人工检查，脚本/PNG仅临时目录 | [视觉记录](../analysis/launcher-v15/visual-review.json) |
| 本地服务根因/修复 | 16并发同Handler：队列5为6/16，64为16/16；只调本机backlog，核对进程后正常SIGINT/原端口启动，16/16及5项路径/CSP边界通过 | [诊断](../analysis/launcher-v15/server-burst-check.json) |
| 静态/保持范围 | 3 ESM语法、1 Python AST通过；Handler/后缀白名单/HTML CSP与基线一致，shared63项非README与native均未改 | [汇总](../analysis/launcher-v15/validation.json) |

**失败与修正：** 独立窄屏首次等待4s失败，诊断等待按既有缓存10s总预算调整为12s仍失败；捕获4个ESM模块`ERR_CONNECTION_RESET`，不是IDB拒绝的证据。原服务存活且直接GET200，不将原因归到日志阻塞。控制对照支持本地监听队列修复，正常重启后完整14项和独立窄屏重跑通过。早期缩放截图出现额外顶栏条带，原因未定；捕获等待两帧并用全新窄上下文复核，最终DOM/截图正常，未据此宣称修复产品CSS。失败未计通过，未放宽页面行为断言。UI回执scope的“server unchanged”文字已校正为Handler/routes/CSP未变，测试结果未改。

**工具/范围：** Browser插件不可用，按已读取frontend-testing-debugging技能使用现有Playwright/Chrome；未下载新包。仅原创配置、私有临时浏览器存储/受控native失败钩子，均在finally恢复；没有请求拦截来替代实际页面模块加载。缓存是独立候选政策；晚取消已提交不称回滚，恢复先清旧计划/目录。

**未运行/未验证：** 原程序、VM、账号或官方端点；HTTP bootstrap实际页面接线、官方来源/CORS、原生替换回滚/完整EH、实际条款/账号存储/会话/游戏；Safari、手机真机、小程序、旧真实XML/图形UI文件流程及未变Swift/Python资源套件。窄视口和本机缓存不标完整登录器或平台兼容。

## stage59 / 登录器v14（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| REA静态 | 同601b…主登录器v13快照补入6函数，总239记录；Write/短写/Close异常、Open3001、更新后统一解析边界；导出/快照后关闭 | [规格](../analysis/launcher-v14/static-spec.json)、[producer](../analysis/launcher-v14/catalog-producer.json) |
| 独立固定字节 | 22个direct call、7个kernel IAT、2处3001，共31锚点；修改/截断/空样本先拒绝 | [回执](../analysis/launcher-v14/catalog-write-audit.json) |
| Node完整相关回归 | **285/285**，0失败/跳过：原263＋raw digest3、候选pair3、bootstrap16 | [日志](../analysis/launcher-v14/node-tests.log) |
| 实际初始化I/O | 原创服务四种目录变化/最少有序GET、self→locator→ZIP候选、下载hash/整pair文本结构、HTTP失败/超时/取消无候选、输入快照 | [示例](../analysis/launcher-v14/example-output.json) |
| 原生Chrome IndexedDB | 写入失败、put后abort保留旧pair；有效整体提交、complete时晚取消回报已提交；并发CAS仅一写成功，候选/期望revision快照、pre/mid取消、坏数据/schema不回退、重新加载恢复 | [浏览器](../analysis/launcher-v14/browser-bootstrap-smoke.json) |
| 浏览器总运行 | Chrome155/Playwright1.62.1独立临时headless上下文12项/51回环GET通过；正例0console错误/请求失败，HTTP500负例各1分别保留 | [汇总](../analysis/launcher-v14/validation.json) |
| 独立只读复核 | bootstrap16＋catalog-data3，共19/19通过，无可复现契约缺陷；IDB仅静态复核，其运行证据来自父线程Chrome | [范围](../analysis/launcher-v14/validation.json) |
| 示例/语法/依赖 | 自包含4次GET示例退出0，只准备2游戏/3区域、不commit；10 ESM/1 Python AST通过，无新包/安装 | [命令](../web/README.md#launcher-v14) |

**证据区别：** 原代码主调者没有返回值检查，但Write/Close会走异常链；不能写成原程序完全忽略错误。主调者存在先覆盖Game再Region失败的路径；本次未执行原程序或验证磁盘/EH。新候选缓存是独立浏览器策略，complete之前被abort不暴露半pair；complete已发生后的取消回报committed，不宣称已撤销。未模拟断电或证明持久性/原生事务。

**未运行/未验证：** 官方HTTP/CORS/可信来源、原文件替换/回滚/重启、完整原EH/账号/条款/真实会话/游戏、实际UI接线、Safari/手机/小程序；未重跑旧页面真实文件/窄视口及未变Python/Swift资源套件。harness只用原创配置和ZIP，浏览器存储在独立临时上下文，不含用户或官方数据。

## stage58 / 登录器v13（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| REA静态 | 同601b…主登录器v12快照，补入14函数dossier/3次4B虚槽观察，共233记录；主HTTP包含早期helper复核，非所有函数首次分析；导出/快照后关闭 | [规格](../analysis/launcher-v13/static-spec.json) |
| 独立固定字节核验 | 构造vptr/三虚槽/Read和Close IAT/3ff读/400分配/NUL共14新锚点；17旧调用/导入/文本锚点重核；改字节/截断/空样本身份门槛均拒绝 | [新锚点](../analysis/launcher-v13/http-bindings.json)、[旧重核](../analysis/launcher-v13/old-http-anchors-recheck.json) |
| Node完整相关回归 | **263/263**，0失败/跳过，原245＋HTTP18；真实原创loopback服务和受控流负例 | [日志](../analysis/launcher-v13/node-tests.log) |
| 实际I/O组合 | GET清单→两文件比较→候选目录；GET原创372B ZIP→256B/CRC/MD5；保持未认证/未信任/未替换。3次GET示例退出0、文件写入0 | [示例](../analysis/launcher-v13/example-output.json) |
| 边界/独立复核 | 两主题缺陷修复：同步阻塞/迟到拒绝需绝对deadline；origin getter增长需固定初始长度。独立30ms/1ms和第17项精确复验、16+1origin复验均通过 | [修正记录](../analysis/launcher-v13/test-review-corrections.json) |
| 浏览器原生运行 | Chrome155/Playwright1.62.1原创harness最终6项/36回环GET通过；正例0console错误/请求失败，负例4条console消息/9次请求失败按预期记录；未把负例称“全程零错误” | [回执](../analysis/launcher-v13/browser-http-smoke.json) |
| 浏览器传输诊断 | native/native-signal/adapter × binary/empty/chunks × 有无拦截，共18次字节长度匹配且无requestfailed。前两次合并smoke的ERR_ABORTED未计通过；加networkidle等待后最终通过，根因仍未定 | [诊断](../analysis/launcher-v13/browser-transport-diagnostic.json)、[失败边界](../analysis/launcher-v13/browser-smoke-investigation.json) |
| 依赖/语法 | 复用工具，无新包/安装脚本；4 ESM和1 Python AST通过；共享核心/依赖及native均未改 | [汇总](../analysis/launcher-v13/validation.json) |

**语义差异：** 原helper是NUL结尾文本逐块追加，原查询失败也能继续；新平台适配保留raw bytes，严格可检查2xx/无重定向/无凭据。预算、总单调截止点、read上限、显式origin及受控错误是独立政策，不冒充原异常/缓存/locale全等价。Content-Length只作hint/提前预算，不与解码后bytes等同。

**失败/修正留存：** 新测试曾假设Node26必须拒绝透明AbortSignal Proxy，实测宿主getter接受；另曾误用既有ZIP API字段md5Verified，正确为digestMatches。只修正这两项错误测试假设，产品API未因此放宽。独立实现缺陷则修改实现并补正反回归，迟到fetch抛错分支也单独确认。

**未运行/未验证：** 原程序、VM、账号或官方端点、实际存储/写入/替换/回滚/重启、当前官方CORS/可信来源、完整原EH/locale/rtm、真实会话/游戏仍待验。现有离线UI未接线且CSP未改；旧两页真实UI/窄视口、Swift/Python资源套件、Safari/手机/小程序本轮未重跑。

## stage57 / 登录器v12（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| REA静态 | 同601b…主登录器复用v10快照；新增19不同函数/24记录，专题26函数/共216记录；导出及保存快照后关闭 | [规格](../analysis/launcher-v12/static-spec.json)、[栈/分支绑定](../analysis/launcher-v12/manifest-bindings.json) |
| Node完整相关回归 | **245/245**，0失败/跳过：原232＋清单/元数据13 | [日志](../analysis/launcher-v12/node-tests.log) |
| 独立原创对照 | Python独立singleton修剪/截断/hashlib：15主摘要投影、4种目录变化；Node原文件bytes摘要与crypto对照 | [向量](../analysis/launcher-v12/original-manifest-vectors.json) |
| 历史正文重建 | 66B XML摘要正文SHA256为11f2051c…7361，与保留历史完整SHA一致；合成本地主摘要仅为进入目录分支，固定本地文件得仅RegionList刷新 | [精确来源及局限](../analysis/launcher-v12/local-metadata-comparison.json) |
| 边界/独立复核 | 主摘要与XML截断差异、token槽/六空白、进度政策、预算/所有权/Proxy、未用输入getter与分支优先级；独立只读复核无可复现缺陷 | [汇总](../analysis/launcher-v12/validation.json) |
| 浏览器实际运行 | Chrome155/Playwright1.62.1独立临时headless会话最终6项/46回环GET/0warn/error通过，含历史重建与旧ZIP/两页 | [最终回执](../analysis/launcher-v12/browser-manifest-smoke.json) |
| 依赖/示例/语法 | 复用现有工具，无新下载/安装；原创示例退出0，3 ESM语法与1 Python AST通过 | [示例](../analysis/launcher-v12/example-output.json)、[使用说明](../shared/README.md#launcher-v12) |

**失败与最终结果分开：** 初次按钮等待超时未产生核心通过结果；独立诊断观察4个本地模块ERR_CONNECTION_RESET。原服务仍在、直接GET200；根因未定，未重启服务或更改源码/断言，新上下文最终完整通过。[初次记录](../analysis/launcher-v12/browser-first-failure.json)。不把重试通过当作根因修复证明。

**规格边界：** 三次单字符边界修剪和主摘要32cut、XML两个token对应关系及正常启动分支是固定样本事实；可打印ASCII/六空白、4096B/128token、严格32hex和正整数分母是独立政策。4093a0/4097a0的库名与实际操作不符，按callee与指令核验；40b158是父栈延续，不照抄为递归。metadata-current只指摘要匹配，不等于有效配置、就绪、认证或可信来源。

**未运行/未验证：** 无原程序/VM/账号/官方新请求、实际下载/写入/替换/回滚。实际HTTP及locale、异常与事务、条款/存储/真实会话/传输和游戏仍待验；历史正文重建不代表当前服务状态。Safari/手机/小程序、旧真实文件UI/窄视口、Python/Swift资源套件本轮未重跑。

## stage56 / 登录器v11（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| REA静态 | 固定86,016B/62db…更新器，23函数/3短字节观察，共26记录；导出/快照后关闭 | [规格](../analysis/launcher-v11/static-spec.json) |
| 独立算法/旧锚点 | 完整64轮MD5常数/消息字/轮前表达式/旋转及4状态加回；CRC表256项；旧48生命周期锚点/5区间hash本轮重核通过 | [MD5复核](../analysis/launcher-v11/native-md5-review.json)、[锚点回执](../analysis/launcher-v11/lifecycle-check.json) |
| Node完整相关回归 | **232/232**，0失败/跳过：原215＋更新17，包含旧许可MD5复用回归 | [日志](../analysis/launcher-v11/node-tests.log) |
| 独立原创ZIP | Python struct/raw zlib构造、zipfile再读15组；Stored/三Deflate block/空内容、descriptor两种及CRC=签名、前缀/extra/comment/中央顺序；摘要与长度匹配 | [向量](../analysis/launcher-v11/original-update-vectors.json) |
| 真实包对照 | 现有580,477B ZIP→599,040B；Python与Node完整比较原登录器相同，CRC/MD5/SHA256均匹配；Chrome同SHA | [对照](../analysis/launcher-v11/real-package-comparison.json) |
| 边界/独立复核 | 声明预算在分配前、截断前缀/尾随/坏元数据/重复范围/子类/Proxy/输出及流结束；发现1个合法descriptor边界，修复后2项独立精确复现通过 | [汇总](../analysis/launcher-v11/validation.json) |
| 浏览器实际运行 | Chrome155/Playwright1.62.1独立临时headless会话6项：15原创ZIP、真实ZIP纯bytes、CRC/MD5拒绝与子类、23旧许可向量、既有两页；44回环GET、0warn/error | [回执](../analysis/launcher-v11/browser-update-smoke.json) |
| 依赖/示例/语法 | 固定Pako3.0.2原发布ESM SHA512/本地hash匹配，MIT/Zlib notice保留，无安装脚本；原创示例退出0，4 ESM语法/1 Python AST通过 | [provenance](../shared/vendor/pako/3.0.2/provenance.json)、[示例](../analysis/launcher-v11/example-output.json) |

**修复边界：** 原首word=0x08074b50即选signed，会拒绝CRC自身为该值的合法unsigned descriptor。原创payload ac0a7ad5由zipfile独立核验；现按central CRC/size匹配12/16B候选并先检查边界，要求唯一。两形式均通过且trust仍未验证，不把该数值当特殊认证字段。

**未运行/未验证：** 原程序/VM/账号/官方端点、实际下载/清单可信来源、文件事务/回滚/重启、完整原ZIP库/EH行为、服务会话/真实传输、游戏与官方兼容。所有其余ZIP条目仅metadata检查，不称其payload已校验。旧Python/Swift资源套件、Safari/手机/小程序/真实导入窄视口未重跑；真实PE只作字节数据，没有执行。依赖下载属于普通开发能力，不是新官方下载。

## stage55 / 登录器v10（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| REA静态 | 同601b…样本复用v9快照；新增42不同函数/66记录，专题33函数/总192记录；导出/新快照后关闭 | [规格](../analysis/launcher-v10/static-spec.json) |
| 算法/资源独立核对 | MD5全部64轮常数/消息字/移位/寄存器顺序匹配；Code11四BIN_DATA只重核位置/大小/hash | [64轮](../analysis/launcher-v10/md5-schedule-check.json)、[资源元数据](../analysis/launcher-v10/static-spec.json) |
| Node完整相关回归 | **215/215**，0失败/跳过：原200＋本地状态15 | [日志](../analysis/launcher-v10/node-tests.log) |
| 独立digest对照 | Python hashlib23原创/短标准向量及所有1..16长度×255非零重复byte，共4080个Node crypto对照通过 | [向量](../analysis/launcher-v10/original-local-vectors.json) |
| 边界/复核 | 四页独立最终决定、版本/force/缺页/拒绝/取消、15资源槽、两个reset标志四组合；独立发现的array iterator与TypedArray metadata缺陷均修复并补回归 | [汇总](../analysis/launcher-v10/validation.json) |
| 浏览器实际运行 | Chrome155/Playwright1.62.1独立临时headless会话6项通过；23向量/四页/拒绝取消与恶意子类/reset及既有两页；38回环GET，0warn/error | [回执](../analysis/launcher-v10/browser-local-smoke.json) |
| 示例/语法 | 原创占位页示例退出0，仅输出状态/页ID/长度/意图值；3个ESM语法及2个Python AST通过，64轮helper实际退出0 | [示例](../analysis/launcher-v10/example-output.json)、[运行说明](../shared/README.md#launcher-v10) |

availability现固定校验四个own索引，空洞/继承值拒绝；字节预算通过原生length getter在复制前校验，按TypedArray内部字节复制，拒绝假Proxy。独立两复现及3个筛选回归确认修复。固定hash脚本初次误取subject.sha256，按实际subject.digest.sha256修正后重新成功；不把初次失败计为核验通过。

本轮没有新安装，复用已有工具并补上纯JS兼容digest能力。所有review/test/示例只使用原创公开输入/占位页和显式availability；无实际条款接受、配置存储、账号或网络动作。实际条款内容/版本/适用性、代码页/输入通知、INI和磁盘账号持久化、可信更新/回滚、会话/真实传输、游戏/官方兼容仍未验。旧Python/Swift资源套件、Safari/手机/小程序/真实文件窄视口未重跑。

## stage54 / 登录器v9（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| REA静态 | 同601b…样本复用v8快照；新增9函数，专题16函数/126记录；SetTimer/KillTimer、WM_TIMER100、异常轮换/父栈延续/关闭边界；导出/快照后关闭 | [规格/范围/未知项](../analysis/launcher-v9/static-spec.json) |
| 独立指令 | 现有Apple LLVM21.0.0按已知边界核对15处起点/回绕/标志/跳转；普通路径为JMP，不照抄伪代码自调用 | [独立证明](../analysis/launcher-v9/retry-independent.json) |
| Node完整相关回归 | **200/200**，0失败/跳过：原179＋流程21；包含reply stream显式close | [日志](../analysis/launcher-v9/node-tests.log) |
| 独立原创全流程 | 3组Python struct/PyCryptodome3.23.0：hello、公值、加密请求逐字节匹配；分段通知/候选/空表/非零结果匹配 | [向量](../analysis/launcher-v9/original-flow-vectors.json) |
| 流程边界 | 所有挑战两段切分/逐字节密文、1..10端点及每个起点、deadline边界与不重置、陈旧/当前代次错误、断流/重复终包/所有权/取消；独立只读复核无可复现缺陷 | [汇总](../analysis/launcher-v9/validation.json) |
| 浏览器实际运行 | Chrome155/Playwright1.62.1独立临时headless会话6项通过：3全流程、轮换/陈旧、deadline/晚到、选择隔离及原两页；36回环GET，0控制台warn/error | [回执](../analysis/launcher-v9/browser-flow-smoke.json) |
| 示例/语法 | 示例退出0，2次连接意图、3个写入长度、4行选择/来源0/selected且仍未验证；不打印输入、key或opaque。4个ESM语法及Python AST检查通过 | [示例](../analysis/launcher-v9/example-output.json) |

本轮没有新安装，复用已验证工具。探索性一次反汇编从半条指令41158b开始，前缀不是有效证据；已从已知411594重新读取，仅正确边界输出/15锚点计数，未据错误前缀判断保护或样本损坏。完整decomp/反汇编/快照只留私有build。

**明确政策差异：** 严格单调时钟/总deadline先赢、仅预请求开启失败有限轮换/不自动重发、完成后晚到事件忽略、notice及终包批次约束均为独立策略。没有用这些测试证明原Windows调度或EH所有throw点等价，关闭意图也不代表外部socket已关。

**未运行/未验证：** 原程序、VM、账号、官方端点、真实socket/平台CSPRNG/时钟/代码页、本地许可/记忆、真实服务会话/opaque生命周期、可信更新/回滚与交接。本目标游戏阶段未开始；Safari/手机/小程序、旧真实文件/窄视口、未变资源Python/Swift套件本轮未重跑。

## stage53 / 登录器v8（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| REA静态 | 同601b…样本复用v7快照，新增9函数dossier，专题14函数/115记录；DDX/16B、候选排序/列绑定、成功/失败回调及第16/10实参闭合；导出/保存后已关闭 | [规格](../analysis/launcher-v8/static-spec.json)、[ABI修正](../analysis/launcher-v8/reply-abi.json) |
| 独立指令核验 | 原410df0 Listing缺后方case4，现有Apple LLVM21.0.0静态核对411be1..411c4e，9处条件/字段/跳转全部匹配 | [范围/摘要/结果](../analysis/launcher-v8/case4-independent.json) |
| Node相关完整回归 | **179/179**，0失败/跳过：原161＋登录输入/候选18 | [日志](../analysis/launcher-v8/node-tests.log) |
| 独立Python向量 | 3组UI请求与6组候选（含64行/重复标签/高位bytes/非零及空结果/受限行）匹配；尾字段、配对列和原换位顺序一致 | [原创向量](../analysis/launcher-v8/original-login-vectors.json) |
| DIALOG分析helper | 固定13资源核验，DIALOG133/23控件定位1013/1014；4/4原创测试覆盖标准/扩展模板、对齐/style、所有截断前缀、预算和未支持creation data拒绝 | [元数据](../analysis/launcher-v8/dialog-controls.json)、[测试](../analysis/launcher-v8/dialog-tests.log) |
| 浏览器实际运行 | 现有Chrome155/Playwright1.62.1独立临时headless会话6项通过：3请求/6候选、受限检查/来源绑定、record→reply→model组合、原配置与资源页；34回环GET、0控制台warn/error | [浏览器回执](../analysis/launcher-v8/browser-login-smoke.json) |
| 示例/静态检查 | 原创示例退出0，35B请求封装/4行/2行通过已证检查/来源0；只输出长度/计数/序号及未验证标志。新模块/测试/示例node --check和3个Python AST通过 | [示例](../analysis/launcher-v8/example-output.json)、[完整回执](../analysis/launcher-v8/validation.json) |

独立只读复核18项通过、未发现可复现缺陷；指出的case4 Listing覆盖不足已做上述独立补核。v8当时的非规范signed16、短列、空/NUL标签拒绝及不模拟CString截断是工程严格政策，不描述为原程序完整校验；其中signed16规范扩展限制已在stage109按现行原生门槛修正，其余支持边界保留。未改变低层18B字节codec；UI16B子集不是所有客户端的协议上界。

工具盘点曾猜测Homebrew gobjdump路径，实际不存在（127）；随后核对标准`/usr/bin/objdump`为Apple LLVM21.0.0且能读本样本PE/x86，复用完成核验。没有安装GNU工具、修改工具/审批配置或把历史GNU版本冒充本轮证据。

**未运行/未验证：** 原程序/VM/账号/官方连接、实际Windows活动代码页/通知、许可/记忆/持久化、完整会话/重试/更新回滚及真实交接/认证。本目标的游戏阶段未开始；Safari、手机/小程序、旧真实文件/窄视口全套、旧资源Python/Swift套件本轮未重跑。候选选择通过和原创新向量不能证明真实身份、余额、有效票据或游戏就绪。

## stage52 / 登录器v7（2026-10-27，保留）

| 证据层 | 实际结果 | 回执 |
|---|---|---|
| REA静态 | 同601b…样本恢复v6快照，新增52函数dossier，专题60函数/98证据记录；4168B Blowfish P/S常量与独立公开实现全部一致；最终导出、保存新快照并关闭 | [规格/身份/摘要](../analysis/launcher-v7/static-spec.json) |
| Node完整相关回归 | **161/161**，0失败/跳过：原125＋回包18＋密钥/记录18 | [日志](../analysis/launcher-v7/node-tests.log) |
| 独立回包对照 | Python struct原创7向量，最大正文4592B；type2/11、FD/FE计数、所有截断前缀、分段/粘包和坏流清理 | [回包向量](../analysis/launcher-v7/original-reply-vectors.json) |
| 独立算术/加密对照 | Python pow/struct＋已有PyCryptodome3.23.0：3组模幂/hex/派生材料，9组记录双向匹配及32728B最大记录全摘要；LE32转换、额外零块、原文尾零、上下界与嵌套分段 | [连接向量](../analysis/launcher-v7/original-channel-vectors.json) |
| 依赖核验 | 固定egoroof-blowfish4.0.3 ESM与MIT原样保存，registry SHA512/本地SHA256匹配；无npm安装/lifecycle脚本或传递运行依赖 | [provenance](../shared/vendor/egoroof-blowfish/4.0.3/provenance.json) |
| 浏览器实际运行 | 现有Chrome155/Playwright1.62.1独立临时headless会话，6检查通过；3组模幂/9组记录/最大摘要、内外分段、既有配置计划与资源页启动；32回环GET、0控制台warn/error | [运行回执](../analysis/launcher-v7/browser-core-smoke.json) |
| 示例与静态检查 | 原创组合示例退出0，两加密记录→一类型2回包；新模块/示例node --check和两个Python脚本AST通过 | [示例](../analysis/launcher-v7/example-output.json)、[汇总](../analysis/launcher-v7/validation.json) |

独立只读复核未发现可复现阻断缺陷，并明确原接收器允许0/0，而本实现要求密文≥8B是严格政策差异。接收按声明长度截取而不去零；新API均不产生认证成功状态。

新浏览器smoke前两次断言有误：先误期待原创资源夹具的序号禁用，又将实际文件计数提示用在原创夹具；均是测试契约错误。复核`web/app.mjs:loadFixture`后改为准确来源/可用状态/夹具提示，删除catch假成功，仅最终完整通过计数；应用未为错误断言改动。[完整过程](../analysis/launcher-v7/browser-smoke-test-correction.json)。

**未运行/未验证：** 原程序、VM、账号、官方服务、真正CSPRNG/身份/prime-order规则、压缩及其他连接模式、连接重试/会话、完整认证/更新/交接，以及本目标的游戏阶段。stage51真实双XML导入和390px全套本轮未重跑；Safari、手机及小程序真机仍未验。原资源Python/Swift实现未改，对应旧套件本轮未重跑。向量、测试与浏览器运行不能代替官方兼容证据。

## stage51 / 登录器v6（2026-10-27，保留）

| 验收层 | 实际结果 | 证据 |
|---|---|---|
| REA静态 | 同601b…样本恢复快照，19相关函数dossier、9短字节观察；认证入口/类型10/排队前边界有证据，私有导出后会话已关闭 | [静态规格](../analysis/launcher-v6/static-spec.json) |
| 原创实现与Node回归 | 125/125，0失败/跳过：原85＋区域26＋消息10＋File4；原Swift及Python资源测试本轮未重跑 | [日志](../analysis/launcher-v6/node-tests.log) |
| 真实双XML | 固定SHA256、5游戏/12区域、8个可选关联、1个缺失引用、所有已处理字段/Args摘要与独立Python一致 | [oracle](../analysis/launcher-v6/configuration-oracle.json)、[对照](../analysis/launcher-v6/independent-comparison.json) |
| 原创消息字节 | Python struct独立生成5组正文与BE16封装向量，JS编码/解码全部匹配；不使用真实账号或现场包 | [向量](../analysis/launcher-v6/request10-vectors.json) |
| 浏览器实际运行 | Chrome155/Playwright1.62.1，1280×1000及390×844共12项通过；真实GB18030双文件导入、显式裸&、双Code11选择、错误/异步/安全文字、图形入口回归；无warn/error或远程请求 | [浏览器](../analysis/launcher-v6/browser-validation.json) |
| 示例/静态检查 | 原创区域组合示例退出0；3新Web模块node --check与Python脚本AST检查通过 | [示例](../analysis/launcher-v6/example-output.json)、[完整回执](../analysis/launcher-v6/validation.json) |

只读复核发现新名称关联曾调用trim产生空白/NBSP别名；已仅对区域Name和引用改为保留原文，并增加负例。完整消息/区域审查未发现新的可复现缺陷。全包REA包装取值未取得可存储记录时改用retained-evidence分页，没有把失败取值计为有效证据。

最后无错误smoke曾因浏览器请求`/favicon.ico`返回404失败，应用数据流当时正常；已添加原创本地图标及两页显式引用，并在最终完整浏览器复核等待networkidle，12/12通过、0控制台错误。初次回执与失败/修复均保留：[过程](../analysis/launcher-v6/final-smoke-issue.json)。另穷举361组字段长度（358合法、3组合计超限正确拒绝），错误配置身份负例拒绝；没有通过降低断言处理失败。

**未验证：** 连接、加密协商、凭据变换、回包与会话；真实认证、更新/回滚、IPC消费者、游戏及官服；Safari/手机/小程序；VM实际状态、恢复启动或本轮原程序执行。125项通过不改变这些门槛，游戏分支本轮未开始。以下均为历史阶段记录。

日期：2026-10-24 UTC。终端日志显示本机时区 2026-10-25 00:xx，两者是同一时段。环境：Apple Silicon，Swift 6.4，宿主报告 macOS 27.0.1；包部署目标 macOS 13，不代表所有目标版本都已测试。

## 第一阶段已通过

| 验收 | 结果与证据 |
|---|---|
| 原安装包身份 | 系统 shasum、Python 流式摘要、原生 CLI 三路一致。见 [输入清单](../analysis/input-manifest.json)、[复算清单](../analysis/reproduced-input-manifest.json)、[原生身份结果](../native/evidence/installer-identities.json) |
| Inno 内容列举/选择解包 | 两份清单成功；仅选取模块、配置与少量资源，未执行目标。见 [登录器清单](../analysis/polcn-inventory.txt)、[主程序清单](../analysis/crossgate-inventory.txt) |
| REA artifact inventory | 两份安装包的 SHA256/PE 身份证据成功；Inno内部清单来自innoextract，不能扩大REA覆盖声明 |
| REA PE资源 | 登录器静态UPX解压副本、6个游戏相关应用EXE成功；资源只记录偏移/长度/hash |
| REA/Ghidra | 标准缓存写入获执行后成功分析登录器；overview、更新器调用函数摘要均有Evidence关联。没有改安全配置 |
| 静态调用交叉验证 | updater格式串 VA0x401d0a、CreateProcessA VA0x401d46，被GNU objdump、Rizin与Ghidra佐证 |
| XML离线复核 | 固定解压副本hash、5游戏项、重复Code11、5处裸&、12区域断言通过；严格XML失败符合预期 |
| 资源结构 | 4个MAP、2个GraphicInfo结构关系验证；含Joy不连续例外，未将语义推测写为事实 |
| Swift构建 | MoliCore / moli-inspect / MoliOffline 编译通过，见 [构建日志](../native/evidence/swift-build.log) |
| Swift测试 | **16 tests，0 failures**，见 [完整日志](../native/evidence/swift-test.log)。PE32/PE32+、截断/坏头/节范围/预算、未知Machine、Data切片、稀疏5GiB有限读取、FIFO非阻塞拒绝、SHA256、索引边界/重叠与离线移动 |
| 原生真实样本CLI | 两安装包身份与SHA256一致；V3索引19,546记录/end68,321,498；Joy8,308记录/非连续。见 [V3](../native/evidence/graphic-index-v3.json)、[Joy](../native/evidence/graphic-index-joy.json) |
| 原生GUI | 实际AppKit窗口与CUA交互成功，步骤见下表；不是WebView或Wine，也不是静态设计图 |

测试日志末尾还有 Swift Testing 的“0 tests”：本包使用 XCTest，前面的 **Executed 16 tests** 才是该套测试结果，不能误读为未测试。

## 真实窗口验收

只运行本工程原创 `MoliOffline`，使用本地开发 `.app`，没有运行官方 EXE。CUA选择窗口“Moli · 离线实验室”，读取AX与实际截图；截图显示原创网格、角色、完整按钮和离线说明，未见截断或占位错误。下列为工具返回状态的精简记录，没有保留文件选择器中的无关目录名称：

| 操作 | AX观察 |
|---|---|
| 初始 | `5, 5 0 步 准备就绪` |
| Right | `6, 5 1 步 已移动` |
| A | `5, 5 2 步 已移动` |
| 点击 ↑ | `5, 4 3 步 已移动` |
| 重置 | `5, 5 0 步 已重置` |
| 原生文件选择器选择 `moli/POLCN_Setup.exe` | `PE32 · Intel i386`；`2192044 bytes`；`节数：10`；`入口 RVA：0xb5eec`；明确标注仅结构识别 |
| 文件选择返回后 Right | `6, 5 1 步 已移动`，键盘焦点可用 |

核心测试验证障碍/边界；GUI没有穷举所有方向、连续长按、多窗口、所有系统版本或辅助技术。原型没有音频，不能写作音频验收通过。

## 遇到的失败与处理

- 初次Ghidra readiness：Swift/Clang默认缓存写入被沙箱阻止，临时缓存变量未影响REA子进程。经明确的标准缓存写入执行请求后Ghidra可用；初次失败证据保留。
- `rea doctor` 全局 healthy=false：非必要后端/其他客户端注册等缺项；本次需要的Ghidra/JDK检查通过。未为了全绿安装工具或改设置。
- REA objdump/Rizin封装：受限环境报无法运行configured command；直接GNU objdump/Rizin补充观察。封装仍记失败，不冒充通过。
- 压缩登录器资源读取：资源范围不在文件后备节；仅对可识别的UPX进行标准离线解压后成功。
- 严格解析原GameList.xml：因5个裸&失败；脚本只在内存中进行已定位替换再提取字段，未修改原件。
- 最初游戏模块通配选择未匹配：改为明确文件名选择后成功，不是全包完整资源解包。
- SwiftUI ImageRenderer预览不支持嵌入AppKit视图，产生禁止占位符；已删去该预览功能/图，改用真实窗口验收。没有用失败截图作为交付证明。
- 直接在受限shell运行GUI曾出现LaunchServices/XPC连接警告；停止该测试进程，使用本工程开发.app的正常原生窗口完成验收。

## 第一阶段未运行 / 未完成（历史记录）

官方安装器/登录器/更新器/游戏执行；动态脱壳或保护绕过；游戏服务器连接；账号登录；认证会话抓取；联网补丁；官方图像/动画/MAP语义解码；声音播放；真实游戏规则与战斗；macOS 13/Intel实机；签名/公证/发布。

第一阶段通过的是 **M0限定静态调查 + M1原生离线基础**。后续路线已按跨平台目标重新编号，以[当前架构](architecture-and-milestones.md)为准。后续文档更新是每阶段验收条件，详见[项目开发说明](../AGENTS.md)。

## 第二阶段：规格台账与跨平台有限资源切片

工程目标改为网页、移动网页和小程序；保留Swift代码，新增纯ESM核心和本地网页核验台。验收发生于同一工作阶段的离线分析与环境恢复后集成，工具日志保留各自时间，不把恢复后页面状态等同于此前中断操作成功。当前集成工具版本为 Node v26.9.0、系统Python 3.9.6；既有REA/Ghidra版本见分析方法。

| 验收 | 结果与证据 |
|---|---|
| 逻辑/协议规格 | 20项：6事实、1推测、13待验证；29个静态锚点、样本身份、依赖/链接及篡改样本拒绝检查通过。[validation.json](../analysis/protocol-v2/validation.json) |
| 全表结构 | 两对GraphicInfo/Graphic共27,854条均在范围内、RD标记及索引/payload尺寸吻合；不等于全部可解码。[图形证据](../analysis/resources-v2/notes-graphics.md) |
| 独立Python oracle | **8/8通过**，恶意尺寸、截断/越界、长度、短palette、未知版本等；集成时重跑同样通过。[日志](../analysis/resources-v2/raw-oracle-tests.log) |
| 共享核心及File适配 | **25/25通过**：共享核心18项＋File适配7项。5GiB模拟文件仅按范围读取、预算、截断、非零offset、复制所有权等。[集成日志](../web/evidence/integrated-node-tests.log) |
| 异步UI状态独立复核 | 代码审查及额外Node DOM桩复核确认generation取消旧读取、读取时禁用序号、非法请求取消旧结果；不计入上述25项单元测试，记录见[web说明](../web/README.md) |
| 真实资源只读差分 | V3 62条＋Joy 7条，**69/69**像素/palette SHA256、头字段及尺寸与独立oracle一致。[V3](../shared/evidence/real-v3-comparison.json)、[Joy](../shared/evidence/real-joy-comparison.json) |
| 保留Swift回归 | **16 tests，0 failures**，Swift源码未改动。[回归日志](../native/evidence/swift-regression-web-transition.log) |
| 浏览器桌面 | 实际IAB页面1280px，document宽1280；64×48合成夹具8倍显示宽512；无横向溢出。[截图](../web/evidence/desktop-synthetic.jpg) |
| 浏览器窄视口 | 390×844，document宽390，画布276，控件最小高度44；适合画布与重载夹具正常；控制台error/warn为空；结束恢复视口。[截图](../web/evidence/narrow-synthetic.jpg)、[QA记录](../web/evidence/browser-qa.json) |
| 本地服务范围 | 路径解析离线检查：允许4项，拒绝8项（安装包、analysis、穿越、目录及非源码类型）；没有发网络请求，不冒充HTTP集成测试。[结果](../web/evidence/server-path-checks.json) |
| 音频补充观察 | 169个范围均匹配RIFF长度，Python wave识别PCM单声道16bit；未播放/导出。[元数据](../analysis/audio-v2/riff-observations.json) |

浏览器截图仅含原创合成夹具，无官方图片。窄视口只是桌面浏览器的响应式验证，不代表手机触控、Safari、Android或微信真机通过。Node测试不是实际浏览器文件选择验收。

### 中断、失败及支持范围

- 浏览器文件导入：确切目标是临时离线索引 `GraphicInfoV3_18.bin`（781,840 B），页面 `http://127.0.0.1:4173/web/`。工具展示“Allow upload”审批；用户确认经父会话转交。随后工具连接中断，原调用没有成功回执。恢复后实际页面两个输入均为“尚未选择”，没有持续导入结果；未重试或将其标为通过。
- 页面实现只通过File.slice读取本地内存，未提供上传、fetch/WebSocket、持久存储或资源导出；CSP connect-src none，静态服务不处理上传。官方文件未传给服务器。服务进程在环境恢复时已停止，本轮没有重启或扩大监听范围。
- 此前本地预览绑定回环端口在普通沙箱内失败，经具体执行审查后曾成功；不意味着对官方服务器的网络授权。
- RD v1/v3实验27,785条中有34条v1末段越界；模型不纳入产品，所有压缩版本继续拒绝。原始布局通过只覆盖固定的69条样本，未认证其他版本。
- 微信官方TCP文档访问曾被站点安全策略拒绝，已停止；没有绕过，也不是还在等待执行审批。精确基础库/平台/域名/端口条件待查证，见[网络报告](network-portability.md)。
- 第一阶段REA包装器失败继续保留，不为修全局工具扩大范围。

### 第二阶段未运行 / 未完成

真实资源浏览器导入完整流程、手机真机、小程序运行；官方色彩/透明/方向、动画、MAP层与碰撞、音频播放；生产更新器、帧编解码、认证、会话、游戏逻辑；官方Windows目标执行、动态观察、服务器连接、账号会话、代理部署、签名与发布。官方可玩性没有验证，不能标完成。

本阶段交付的是 **M2有限资源规格/核心与Web核验工具 + M3规格台账基线**；M2浏览器真实文件流程和M3完整协议仍有明确缺口。文档、API和测试同步完成后才算本次范围交付。


## 第三阶段：离线启动与网络调用证据增量

停止条件为“形成可复核链增量，或精确指出当前静态证据无法闭合的位置”。本轮达到后者并交付前者：已核对更新器消费者、登录器启动和更新HTTP；游戏消费端到socket仍未闭合。没有以框架、网页或虚构协议补空白。下面是**证据核验和审计工具测试**，不是官方协议兼容测试。

| 检查 | 实际结果 / 证据 |
|---|---|
| 更新器五槽＋文件生命周期 | **88锚点、8区间哈希、3个REA回执通过**；错误样本、错误锚点及引用关系检查通过。[回执](../analysis/protocol-v3/updater/verification-result.json) |
| 登录器非自更新启动链 | **52/52锚点通过**，IAT/API名独立核对。[锚点](../analysis/protocol-v3/launch/anchor-validation.json) |
| 登录器更新HTTP辅助链 | **17/17锚点通过**，含10直接调用、4导入调用、3字面量；改字节/截断/空样本拒绝。[回执](../analysis/protocol-v3/http-helper/verified-http-chain.json) |
| Patcher入口/更新路径/HTTP | **16/16锚点集成复核通过**；函数REA和两个xref回执成功；虚分派实际选择未闭合。[锚点](../analysis/protocol-v3/game-network/patcher-anchors.json)、[函数摘要](../analysis/protocol-v3/game-network/patcher-http-function-summary.json) |
| 三游戏静态边界 | 13个descriptor、651个ILT/IAT项及节/入口映射核对；网络导入不可见、同名标签仅字面关联，匿名映射排除。[边界](../analysis/protocol-v3/game-network/packed-boundary.md) |
| 新增原创合成审计测试 | **12/12通过**：启动核验器7项＋PE审计helper5项；包括截断、未后备/跨界VA、符号/ordinal、错误相对调用、IAT/opcode/字面量、错样本和0x前缀回归。[启动日志](../analysis/protocol-v3/launch/tests.log)、[PE日志](../analysis/protocol-v3/game-network/pe-helper-tests.log) |
| 规格/文档集成 | 20个ID、6事实/1推测/13待验证，依赖与文件链接通过；本轮未升级官服状态。[集成回执](../analysis/protocol-v3/validation.json) |
| 既有运行代码 | 集成脚本逐文件核对shared/web/native运行源码及相关测试与第二阶段哈希相同。本轮未重跑既有25 Node、8资源Python、16 Swift；它们的上一阶段通过记录保留，不冒充本轮执行 |

根任务实际重跑了12项新审计测试及集成核验器。成功只说明固定版本字节、声明、引用及负例门槛可复核；手工数据流解释、库语义、动态可达性与协议兼容需要独立证据。PE审计helper不是产品用任意PE解析器，部分错误以struct.error/AssertionError拒绝。

### 失败、修正和未运行

- 初次REA普通沙箱调用因标准Swift/Clang缓存写入失败。随后对明确静态分析任务的具体执行审查获准并完成；没有改REA/全局安全配置，没有执行Windows目标。各分支回执记录首次失败与后续成功。
- GNU objdump直接目标提取最初未兼容`0x`前缀，已修正并新增回归；直接边只保存有界摘要，不能把线性反汇编计数当完整CFG。
- Ghidra对启动、更新器等函数的high p-code存在截断；更新器消费者有10处未解析调用，HTTP辅助有未解析虚读取；无未解析调用的函数也不等于数据流完整。具体限制保留在各dossier摘要。
- 原样本可见等待参数异常、文件替换返回值未检查、再次启动两分支均exit0、HTTP状态查询失败仍继续。这些是局部静态观察，不能变成实际故障断言，也不是独立实现应照搬的行为。
- 未运行：官方PE、真实更新HTTP、文件替换/进程启动、账号/共享内存读取、游戏连接、帧编解码与认证兼容、浏览器真实文件导入。未重试已被站点策略拒绝的页面；未保存长期自动批准规则。

### 最小复核命令

在项目根执行；路径仅指向临时离线材料，重建时须核对样本hash，不得用更改门槛来接受新版：

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s analysis/protocol-v3/launch -p 'test_*.py' -v
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s analysis/protocol-v3/game-network -p 'test_*.py' -v
PYTHONDONTWRITEBYTECODE=1 python3 analysis/protocol-v3/verify_stage3.py \
  --launcher /tmp/moli-analysis/polcn/POLCN_Launcher.unpacked.exe \
  --updater /tmp/moli-analysis/polcn/LauncherUpdater.unpacked.exe \
  --patcher /tmp/moli-analysis/crossgate/app/Patcher_PUK3.exe \
  --http-dossier /tmp/moli-analysis/stage3-http/helper-function-authorized.json \
  --updater-dossier-dir /tmp/moli-analysis/polcn
```

若临时完整REA回执已清理，先按各分支说明用REA重新静态生成并重新记录证据身份；不能把缺失回执列为通过。产品依然只有有限离线资源能力，官方游戏可玩性未验证。


## 隔离Windows环境准备（2026-10-25）

| 检查 | 本轮结果 |
|---|---|
| 主机与软件盘点 | M3 Pro/36GB/初始约246GiB余量；UTM5.0.8已装，签名及公证核验通过；未重复安装 |
| 空白VM创建 | 本项目ARM64/4核/8GiB/80GiB稀疏盘配置创建并保存；不触碰废纸篓旧VM |
| 隔离配置审计 | **73/73通过**，根任务实际运行复核；[JSON](../analysis/vm-preparation-v1/vm-isolation-audit.json) |
| 原创审计测试 | **7/7通过**，根任务重跑；网络/共享、外部路径、符号或硬链接、缺字段、畸形/超限输入、未知配置等；[日志](../analysis/vm-preparation-v1/isolation-tests.log) |
| 固件启动与停止 | 进入空白EDK II UEFI Shell，第一次停止已确认；后续用户改变UTM状态又出现运行中Shell，停止进一步UI操作；[状态记录](../analysis/vm-preparation-v1/ui-validation.json) |
| 磁盘结构 | 关机时qemu-img check-errors=0、dirty=false、逻辑80GiB；[记录](../analysis/vm-preparation-v1/disk-check.json) |
| 关机基线 | 首次停止后4文件864365字节复制，逐文件哈希一致；未做恢复启动；[清单](../analysis/vm-preparation-v1/cold-baseline.json) |
| Windows ISO | Microsoft官方简体中文ARM64 26H2/26300.9457，8852006912字节；SHA256与官网匹配；[清单](../analysis/vm-preparation-v1/windows-iso.json) |
| 既有代码与协议 | shared/web/native运行源码未变，规格台账仍20项6/1/13；25 Node/8资源Python/16Swift/12第三阶段审计本轮未重跑，保留各原阶段记录 |

失败或中断：沙箱内sysctl、UTM容器读、utmctl帮助、签名子系统及下载DNS曾失败；使用获准的具体只读签名核验及官方镜像下载后相关步骤成功，未更改安全配置。UTM Windows向导无镜像时提示必须选择启动映像，改用“其他/无启动设备”明确创建空白固件配置，没有绕过Windows要求。后续UI动作因用户已改变应用而中断，未重试抢占界面。

未运行/未完成：Windows安装器/EULA、系统安装、OOBE账号/联网、系统内部隔离及Secure Boot/TPM验证、guest工具/图形驱动、x86样例程序、官方游戏及更新器、账号会话、服务器连接、快照或关机基线恢复启动。固件成功和配置审计不证明Windows或游戏兼容。仅镜像下载使用主机到微软官方域名的连接，未给VM添加网卡。

检查脚本仅适用于当前受控空白配置；不抵抗祖先路径链接、并发替换或后续运行时覆盖。完整操作、资源预算、许可关口和观察方案见[环境记录](vm-environment.md)。

## 安装介质与许可关口增量（2026-10-25，v1阶段历史结果）

| 检查 | 本轮结果及证据 |
|---|---|
| 官方ISO复算 | SHA256再次与前轮官方值一致，8,852,006,912字节；[介质记录](../analysis/vm-install-v1/media-validation.json) |
| 导入与只读挂载 | UTM转换为内部qcow2；CD/USB/ReadOnly=true。qemu-img compare退出0，逻辑内容一致；不是容器字节相同 |
| 双盘配置核验 | **30/30通过**；无网络/共享、原盘身份、固定CD角色及路径，[JSON](../analysis/vm-install-v1/media-config-verification.json) |
| 新审计测试 | **4/4通过**，根任务重跑；坏角色/权限/路径、网络共享、未知缺字段、链接、畸形/超限和错基线，[日志](../analysis/vm-install-v1/media-config-tests.log) |
| 安装器实际启动 | 简体中文Windows 11、微软拼音；家庭版/家庭单语言版/专业版实际可见。保留默认家庭版仅预览条款 |
| 实际许可关口 | 2024年4月“微软软件许可条款 / WINDOWS 操作系统”；**未点击接受**，[截图](../analysis/vm-install-v1/license-boundary.png)、[步骤](../analysis/vm-install-v1/ui-validation.json) |
| 当时状态/磁盘 | 该阶段结束时VM仍运行在许可页；系统盘未替换但引导后qcow2由197888增至393216字节、hash变化，原因未归属；没有到分区或复制步骤，[采样](../analysis/vm-install-v1/installation-boundary.json) |
| 回滚及产品范围 | 原空白关机副本4文件、两份游戏安装包hash均复核一致；shared/web/native已交付38文件均与上轮相同；177个文档本地链接存在。未恢复启动，无新增游戏协议事实。[集成核验](../analysis/vm-install-v1/stage-validation.json) |

失败/恢复：UTM可移动盘弹窗控件访问异常，取消未保存设置后使用标准Import成功；首次CD按键超时后从同一Boot Manager成功引导。guest部分鼠标点击无效，键盘加速键及短键有效；UEFI长字符串输入重复已清除，无成功执行该目录命令。以上不是自动审查拒绝；没有用修改安全设置或更换非官方介质处理。

未运行/未完成：许可接受、最终版别/用户许可核对、系统安装、OOBE、激活、guest内隔离/驱动/TPM/Secure Boot、x86样例、官方游戏/更新器/网络/账号、真实网页文件导入及基线恢复。既有25 Node、8资源Python、16 Swift、12阶段三审计、7空白策略测试本轮未重跑，各历史通过记录保留。新增CD不适用旧73项空白策略；历史JSON不篡改。Windows安装器能启动不等于已完成Windows或旧游戏兼容验收。

## Windows许可接受及存储接口增量（2026-10-25，v2历史结果）

| 检查 | 本轮结果 |
|---|---|
| 条款实际接受 | 首次接受成功：2024年4月《微软软件许可条款 / WINDOWS操作系统》，UI进入磁盘页；家庭版默认，不代表许可证/激活验证 |
| VirtIO目标盘 | **未识别**；安装器磁盘列表空，WinPE `list disk`无固定磁盘；只读诊断，未分区/格式化 |
| 正常关机与配置 | `wpeutil shutdown`后UTM确认停止；同一原系统盘唯一字段VirtIO→NVMe，网络/共享/QEMU安全配置不变 |
| NVMe固定策略 | **38/38通过**，根任务重跑，[结果](../analysis/vm-install-v2/nvme-config-verification.json)；不是客户机兼容测试 |
| 新增原创审计测试 | **4/4通过**，根任务重跑；旧VirtIO、CD只读、网络共享、外部路径、未知设备、链接、共同篡改/坏输入，[日志](../analysis/vm-install-v2/nvme-config-tests.log) |
| 重新引导 | 微软安装器再次启动，家庭版默认及2024年4月许可页面核对一致；WinPE先前实际banner10.0.26100.9457，不混作安装后OS版本 |
| 第二次接受 | **被自动审批拒绝，未执行**；审查未认可转交确认作为该具体许可承诺授权。未重试/绕过，[当前截图](../analysis/vm-install-v2/license-action-blocked.png) |
| 当时终态 | VM运行在许可页；NVMe客户机盘识别、Windows安装和OOBE均未完成，[步骤](../analysis/vm-install-v2/ui-validation.json) |

本轮没有下载新驱动、修改签名/安全保护、添加网卡/共享、输入密钥/账号、运行游戏或连接官方服务。旧策略按设计不接受NVMe，未改历史JSON来伪造通过。既有25 Node、8资源Python、16 Swift、12阶段三审计及前版环境测试本轮未重跑，产品源码无改动；历史通过不冒充本轮执行。原空白基线保留，未做恢复启动或新Windows系统基线。

本轮集成核验：38个产品交付文件、11个v1环境证据文件均与上轮hash相同，原空白基线4文件hash一致，189个文档本地链接存在。见[集成回执](../analysis/vm-install-v2/stage-validation.json)。


## NVMe安装至OOBE联网关口（2026-10-25，v3历史结果）

| 检查 | 结果及可复核边界 |
|---|---|
| 许可页面状态 | 本轮开始已越过许可页，未重试接受，不归因操作者；v2首次成功、第二次拒绝仍分别保留 |
| NVMe目标盘 | **通过**：唯一Disk 0未分配80.0GB；原盘/ID及配置hash相同，[截图](../analysis/vm-install-v3/nvme-disk-visible.png) |
| 正常安装/系统盘启动 | **通过此阶段**：确认家庭版，执行正常安装并自动从Windows Boot Manager系统盘启动；未改安全配置 |
| 首次设置 | **未完成**：已到OOBE，地区/键盘设置后要求Internet，“下一步”灰色；[截图](../analysis/vm-install-v3/oobe-network.png) |
| 系统版本 | **观察到**：系统盘C:\Windows\system32\cmd.exe banner为10.0.26300.9457；不是完整桌面/架构/激活验收，[证据](../analysis/vm-install-v3/oobe-system-version.png) |
| 正常关机 | **通过**：UTM“请求关闭电源”后显示开始/播放和停止禁用；强制停止警告已取消，[截图](../analysis/vm-install-v3/stopped-after-oobe.png) |
| 当前配置审计 | **38/38通过**，退出0；同一NVMe固定策略，无网卡/共享/额外设备，[JSON](../analysis/vm-install-v3/final-config-audit.json) |
| 产品代码/历史测试 | 无源码或测试修改；25 Node、8资源Python、16Swift、12阶段三审计及环境单测本轮未重跑，历史通过记录保留，不计为本轮执行 |

当前阻碍为实际OOBE联网要求超出离线授权，**不是新的审批拒绝或未结束的工具调用**。未尝试添加网卡、驱动、登录/创建账号或传输凭据。命令文本未见输入/执行，架构查询和命令行关机不计成功；使用正常UTM电源请求完成关机。输入捕获已释放，未强制断电。未运行游戏/更新器/服务器连接/真实网页文件导入，未验证桌面、许可适用性、激活、TPM/Secure Boot、驱动、x86样例或恢复启动，未创建完成OS基线。

[完整过程与停止条件](../analysis/vm-install-v3/progress-observations.json)。安装到OOBE支持磁盘与引导阶段可用，不能证明Windows环境完整就绪或旧游戏兼容；共享核心/API未变，游戏协议台账仍为20项（6事实、1推测、13待验证）。

集成核验：38个产品文件及23个v1/v2历史证据文件与上轮hash一致；原空白关机基线4文件hash匹配。全部本地文档链接存在，具体计数与资源采样见[集成回执](../analysis/vm-install-v3/stage-validation.json)。没有新增单测或修改运行代码；配置审计通过与历史测试通过分开记录。


## v4 NAT与驱动准备、清理盘点（2026-10-25，历史）

| 检查 | 本轮实际结果 |
|---|---|
| 授权范围 | 临时NAT及必要官方ARM64驱动已获授权；无桥接/转发/主机文件共享/账号提交/游戏权限 |
| 运行状态与关机 | 原控制台仍在OOBE；正常请求关机后确认停止，未强制断电 |
| NAT设备入口 | **失败/阻塞**：两次自动审查拒绝“设备→新建…”入口，均未执行；第二次后停止，设置取消未保存 |
| 最终配置 | **38/38通过**，配置hash与v3一致；Network空，主机共享关闭，[JSON](../analysis/vm-install-v4/final-config-audit.json) |
| 官方介质下载 | HTTP200、143898624B、SHA256已绑定实际0.1.274内容；非独立发布者hash比对，[来源](../analysis/vm-install-v4/driver-media.json) |
| 网卡包静态检查 | INF/ARM64 PE/文件hash已记录；最小ISO九文件逐字节回读一致，保留原许可材料，[证据](../analysis/vm-install-v4/netkvm-package.json) |
| 签名边界 | CAT签名者证书身份可解析；CMS验证器对CTL格式失败，Windows信任链/时间戳/成员验证**未运行**，不计签名通过 |
| 驱动与OOBE | 驱动未挂载/安装，NAT未开启，未联网/到账号页/桌面；未改变安全保护 |
| 清理盘点 | 当前UI五个候选均停止、注册路径在Trash；文件系统访问受限、共享依赖未知，无删除，[清单](../analysis/vm-install-v4/cleanup-candidates.md) |

操作限制/恢复：沙箱DNS和只读挂载受限后，经各自具体审批完成官方介质下载、挂载与正常卸载；未修改主机安全设置。ISO的UDF文件树不能由本机bsdtar直接完整列出，改用只读文件系统挂载。临时复制目录继承只读模式，补原许可时仅给自建临时副本增加owner写权限；最终最小ISO已核对，源挂载始终只读。上述恢复不涉及被拒绝的NAT入口；该UI动作未换路重试。

运行代码、解析器和测试均未修改，既有25 Node、8资源Python、16Swift、12阶段三审计以及环境单测本轮未重跑。未运行官方游戏、连接游戏服务器、提交凭据、恢复启动或验证官方兼容。临时主机驱动挂载已卸载，无未结束工具调用；当前VM关机且无网络。

本轮集成回执记录产品/历史证据/基线哈希、本地链接、介质回读及实际未运行项：[v4集成核验](../analysis/vm-install-v4/stage-validation.json)。

## v5 NAT与驱动接入（2026-10-25）

- 新的具体确认后，原菜单动作重试一次成功；NAT配置只改变Network节，无桥接/端口转发/主机共享。
- 最小ARM64 NetKVM介质导入为第三只读USB CD，原两盘完整配置不变。raw与qcow2逻辑比对退出0。
- 正常Windows目录安装流程后显示“网络已连接”，下一步可用，进入更新检查；设备具体版本和完整签名信任详情尚未单独验证。
- 用户中途改变UTM导致界面暂停，回到原项目且确认继续后恢复。没有创建第二VM。
- 旧VM清理已撤销；无成功取消注册、删除或清空Trash，不再读取废纸篓。

v2的38项固定审计仅适用于无网卡、两块原盘配置；临时NAT/第三CD不符合该策略，未修改旧核验器或冒用旧通过记录。初次介质扩展名断言因UTM自动转换qcow2失败，核对后修正检查；沙箱ps只读查询受限，未重试，也没有靠它推断运行状态。运行代码未修改，既有25 Node、8资源Python、16 Swift、12阶段三审计及环境单测本轮未重跑；没有官方游戏/账号/服务器动作。

系统更新流程观察到第1/3步完成、进入第2/3步下载；在约14%时使用安装器公开提供的“稍后更新”及其确认入口，Windows正常重启继续OOBE。完整更新仍未完成，后续需通过正常Windows更新验收；没有修改注册表、禁用更新服务、关闭安全控制或绕过OOBE。见[正常延后更新画面](../analysis/vm-install-v5/oobe-normal-defer-update.png)。

### v5终态和未运行项目

本轮先到微软密钥登录页面；后续获准检查正常离线入口时，页面已推进到验证码步骤，停止UI避免干扰。没有填写/提交认证信息、处理通行密钥或获取账号会话，未将账号标识或验证码写入本地证据。正常离线/本地入口检查未完成，不能把此版本或全部Windows版本写成必须使用个人微软账号。OOBE/桌面没有验收完成。当前NAT仍用于未结束的系统设置，主机共享关闭，**恢复断网尚未执行**；[交接配置复核](../analysis/vm-install-v5/account-handoff-config.json)与三盘NAT保存结果一致。没有新的审批拒绝或工具挂起。

通过：新增配置节差异核对、原两盘和共享设置保持、驱动光盘逻辑内容比较、正常安装后网络连接观察、12个PE身份/架构与7个API字节锚点核对。完整Windows更新、具体设备驱动版本/信任详情、桌面、激活、TPM/Secure Boot、x86样例、基线恢复和官方游戏均未验收。更新在正常“稍后更新”入口延后；未禁用更新服务或保护措施。全量产品单测未重跑，38个产品文件与43个v1–v4历史证据文件hash不变，原空白基线4文件hash匹配。最终链接计数和媒体hash见[v5集成回执](../analysis/vm-install-v5/stage-validation.json)。

## v6实际系统增量（2026-10-25）

| 项目 | 本轮结果 |
|---|---|
| 用户登录后的实际桌面 | **已观察**；助手未完成用户认证 |
| 版别/架构/完整构建 | **通过只读查询**：Windows11家庭版ARM64，更新前10.0.26300.9457；[截图](../analysis/vm-install-v6/windows-full-build.png) |
| 网卡实际版本与签名字段 | **通过只读查询**：Red Hat VirtIO Ethernet Adapter、100.100.104.27100、Up、IsSigned=True、Microsoft Windows Hardware Compatibility Publisher；[截图](../analysis/vm-install-v6/netkvm-windows-signature.png) |
| 全部设备健康 | **未通过**：36项非零问题记录；三项具名PCI硬件ID已记录，不把数组分组首项当全部ID |
| TPM健康查询 | **未取得**：普通权限命令要求管理员；未改变安全控制 |
| Windows Update/正常重启 | **部分完成**：正常重启更新、到登录页；更新后完整结果和桌面恢复待用户输入PIN |
| PIN/自动锁定设置分支 | **结束**：仅见屏幕/睡眠原值均从不，助手无修改；用户自行处理后撤销此分支 |
| 最小RNG/基础显示介质 | **准备通过**：8文件回读hash一致、3个PE为ARM64、只读非启动；未挂VM/安装，Windows信任未验收 |
| v6离线核验器测试 | **10/10通过**，根任务重跑；原v1/v2不变 |
| 当前真实离线配置 | **正确拒绝**：21项仅Network失败，NAT尚在；不称离线通过 |
| 断网、正常关机后Windows冷基线/恢复启动 | **未完成/未运行**，当前认证交接；pre-os基线保留 |
| 游戏实验与官方兼容 | **未运行**，只有[待授权计划](../analysis/vm-install-v6/client-experiment-plan.md) |
| 产品回归 | 运行代码未改，本轮不重复历史25 Node/8 Python/16 Swift及12第三阶段审计；历史结果不冒充本轮重跑 |

命令、实际结果及观察边界见[JSON](../analysis/vm-install-v6/guest-observations.json)，配置审计见[负向回执](../analysis/vm-install-v6/current-config-negative-audit.json)，最小介质见[回读记录](../analysis/vm-install-v6/base-drivers-media.json)。没有接受游戏条款、执行游戏PE、连接游戏服务、读取账号会话或分发资产。

本轮集成核验：38个产品文件与57个v1–v5历史证据文件hash保持不变，原pre-os基线4文件hash匹配；350个本地文档链接核查无缺失（新增本条链接后的最终计数见回执）。最小介质及来源hash重核一致，真实配置仍正确拒绝NAT。见[v6集成回执](../analysis/vm-install-v6/stage-validation.json)。

## v7更新后核验与断网（2026-10-25）

| 项目 | 实际结果 |
|---|---|
| 更新后桌面和构建 | 已观察桌面；10.0.26300.9711 |
| 设备健康 | 未通过：仍36项代码28，三项PCI ID不变 |
| 剩余更新 | 仍有可用更新；详细余项未确认，无待重启提示，不称全部完成 |
| 正常关机 | UTM请求关闭后已停止，未强制断电 |
| 恢复断网 | NAT网卡已移除并保存；主机共享关闭 |
| 第四只读最小光盘 | 已导入；原三盘不变；raw/qcow2 compare退出0 |
| 磁盘外部依赖 | 4盘头部chain各1项，无backing-filename；未挂载guest文件系统 |
| 当前四盘配置 | 22/22通过，仅配置/元数据保证 |
| 新增合成测试 | 策略12＋冷副本17，普通及-O各通过；根任务29项复跑通过 |
| 驱动安装/断网桌面 | 尚未完成，断网启动当前在PIN登录页，由用户解锁 |
| 私有Windows冷副本/恢复启动 | 未创建/未运行；脚本准备不等于副本成功 |
| PIN/旧VM/游戏 | 无改PIN、旧VM清理、游戏执行或服务器动作 |
| 产品回归 | 本轮未重跑；产品运行代码未改 |

[系统观察](../analysis/vm-install-v7/guest-observations.json)、[真实配置](../analysis/vm-install-v7/four-drive-config-audit.json)、[介质对比](../analysis/vm-install-v7/media-and-backing-check.json)、[本轮测试](../analysis/vm-install-v7/root-tests.log)。旧v6三盘规则及历史通过记录原样保留，不能用于宣称当前四盘通过。

本轮交付核验：38个产品文件、80个v1–v6历史证据文件及4个pre-os基线文件hash未变。文档链接、真实离线配置、29项测试、介质与磁盘头部检查汇总见[v7集成回执](../analysis/vm-install-v7/stage-validation.json)。当前只有用户认证交接，无新的操作拒绝。

## v8输入恢复、驱动与私有基线（2026-10-25）

| 验收项 | 实际结果 |
|---|---|
| 本次输入/登录 | 通过：置前窗口和输入捕获后响应，特定授权一次提交成功；未复用凭据 |
| RNG/普通DOD安装 | 通过：PnP正常安装，版本100.100.104.27100 / 22.7.38.43，IsSigned=True；两个当前设备均OK |
| 全部设备健康 | 未通过：36→34项代码28；PresentOnly分类32 LNRO0005、1 QEMU0002、1 PCI1003 |
| 安全启动 | 只读查询True；未修改配置 |
| TPM健康 | 失败：管理员Get-Tpm内部错误0x80284001；没有健康结果或修改TPM |
| 正常关机、配置隔离 | 通过：正常电源请求后已停止，Network空、共享关闭；固定四盘22/22 |
| 磁盘外部依赖 | 4块qcow2头部单项链、无backing；未挂载guest文件系统 |
| 新私有冷副本 | 通过：7文件38,027,612,093字节逐项SHA256一致，源保持不变；新目录0700/文件0600 |
| 复制/隔离脚本测试 | 19项＋12项根任务复跑通过；19项在普通与-O均通过 |
| 安装后重启/恢复启动 | 未运行；副本不注册/启动，下一次登录不复用授权 |
| 完整更新、激活、x86/旧图形/游戏 | 未完成或未运行；不得称兼容通过 |

[实际观察](../analysis/vm-install-v8/guest-observations.json)、[配置](../analysis/vm-install-v8/four-drive-config-audit.json)、[复制](../analysis/vm-install-v8/windows-cold-baseline.json)、[测试](../analysis/vm-install-v8/cold-baseline-tests.json)、[设备定义与限制](../analysis/vm-install-v8/remaining-device-research.md)。本轮没有新的自动审批拒绝或悬而未决的复制动作，TPM为已返回的技术错误。原25 Node、8资源Python、16 Swift及12阶段三审计为历史通过，本轮产品代码未改、不重复运行；当前环境测试不冒充产品测试。

所有stage11既有交付文件在开始时hash匹配；后续仅本轮文档及新证据改变。产品/历史证据/pre-os基线保存检查、本地链接检查见[v8集成回执](../analysis/vm-install-v8/stage-validation.json)。

## v9恢复引导与只读研究（2026-10-25）

| 项目 | 实际结果 |
|---|---|
| 冷基线身份/独立复制 | 7文件完整SHA256符合v8，副本独立，无backing/外部数据，只有新Name/UUID变化 |
| 恢复启动 | 已到Windows锁屏；已正常关闭测试克隆 |
| 桌面/TPM新查询 | 未运行，需要用户亲自登录测试克隆 |
| 原VM/冷基线 | 原VM已运行，本阶段未操作；config隔离22项通过，guest可变元数据发生变化；冷基线未变 |
| TPM研究 | 精确为TBS内部错误；ARM/PPI线索不等于根因 |
| 克隆测试 | 普通/-O各25项通过，根任务复跑通过 |
| 产品与历史材料 | 产品未改，历史测试未重跑；保留hash核验见集成记录 |
| 游戏候选 | 5/5静态hash一致，未导入/执行 |

[引导观察](../analysis/vm-install-v9/restore-boot-observations.json)、[复制](../analysis/vm-install-v9/restore-clone.json)、[测试](../analysis/vm-install-v9/restore-clone-tests.json)、[集成核验](../analysis/vm-install-v9/stage-validation.json)。34项设备问题和历史Get-Tpm失败继续列为未解决；没有凭据使用、TPM安全修改、游戏执行或官服连接。

## v9后续输入验证

通过：原VM窗口身份、Capture Input由0到1、工具一次空格使锁屏进入空PIN字段。未运行：PIN字符测试/提交、新登录、实体键盘验证、guest诊断。未改变：原VM电源、安全/账号/PIN、网络和主机共享；恢复克隆保持停止。用户持续输入问题仍待验证，不记全面修复。[记录](../analysis/vm-install-v9/input-focus-followup.json)。

输入复查后的新登录阶段：用户已确认仅测试克隆一次登录；执行前getAXState和getApp刷新都报host locked，未执行启动/凭据输入/提交，授权未使用。不是工具审批拒绝，实际屏幕状态未知；没有绕过或重复尝试登录。[错误与动作边界](../analysis/vm-install-v9/login-access-blocker.json)。

## v10 / stage16：恢复桌面、只读诊断与知识库

| 项目 | 结果及边界 |
|---|---|
| 准确测试克隆启动及单次登录后的桌面 | 通过；当次授权已使用，当前按要求保留登录会话，不重启。 |
| 普通权限OS/驱动读取 | 通过；家庭版ARM64 10.0.26300，RNG/DOD版本和IsSigned=True与v8一致。完整修订号沿用v8，不冒充本轮新查询。 |
| TPM/PnP基础信息 | 部分通过；TPM 2.0 PnP=OK，tpmtool退出0，标签/部分值缺失；完整健康与先前0x80284001根因未完成。 |
| 服务查询 | 未找到tbs服务对象，错误NoServiceFoundForGivenName；不等于TPM缺失或服务停止。 |
| 全部设备健康 | 未通过；仍34项CM_PROB_FAILED_INSTALL。没有盲装平台/串口驱动。 |
| 管理员UAC动作 | 自动审批拒绝，已知未执行且已取消；未绕过。 |
| 保存配置与冷源元数据 | 通过；两VM离线/无共享，冷源7文件元数据未变且无打开句柄。最后全hash为v9，本轮非新全盘hash。 |
| 登录选项只读 | 通过；克隆唤醒“从不”、Hello-only“开”；原机未检查，没有任何安全变更。 |
| 启动自动登录/睡眠唤醒 | 未运行；待具体安全变更批准及用户本人安全输入，保留PIN。 |
| 知识库与流程 | 新增canonical排障节和AGENTS要求；README、环境/方法/验收入口链接，文档核验结果见阶段核验。 |
| 产品测试 | 本轮产品代码未改变，未重跑；历史25项Node、8项Python、16项Swift通过，不混作VM新测试。 |
| 游戏/官方联机 | 未运行、未授权本轮执行；不能由桌面恢复推定兼容。 |

证据：[客户机查询](../analysis/vm-install-v10/guest-observations.json)、[输入观察](../analysis/vm-install-v10/input-observations.json)、[配置/元数据](../analysis/vm-install-v10/host-isolation-check.json)、[提权拒绝](../analysis/vm-install-v10/elevation-blocker.json)。下一次操作前读[知识库](known-issues.md#vm-troubleshooting)，严格区分执行结果、授权状态和验收层次。

## v11 / stage17：Autologon只读介质准备

| 项目 | 结果 |
|---|---|
| 官方源与文件身份 | 通过；HTTPS原地址200，ARM64 PE32+，记录SHA256；未执行。 |
| 完整Authenticode/Windows信任 | 未运行；目前只做静态元数据，不能标有效签名。 |
| 随附许可与已展示网页 | 有文本差异，未认定一致；未运行或接受不同条款。 |
| 只读ISO构建/内容 | 通过；3/3成员回读一致、无启动/autorun、0444，项目build复制hash一致。 |
| VM隔离/冷源 | 保存config hash保持、无NIC/共享；冷源7文件元数据未变、无打开句柄。未进行新的全盘hash。 |
| 新配置/自动登录/重启/睡眠 | 未运行；用户不在场且无账户密码，保留现有会话和设置。 |
| 原机/游戏 | 原机客户机未操作，游戏未运行。 |
| 产品代码测试 | 产品代码无变化，未重跑；不把历史25Node/8Python/16Swift记为本轮新通过。 |

证据：[身份](../analysis/vm-install-v11/download.json)、[静态与许可](../analysis/vm-install-v11/tool-static-metadata.json)、[介质](../analysis/vm-install-v11/media-validation.json)、[隔离](../analysis/vm-install-v11/host-preservation.json)、[授权边界](../analysis/vm-install-v11/authorization-and-actions.json)。开始后续操作前读[知识库](known-issues.md#vm-troubleshooting)。

## v12 / stage18：挂盘前状态与依赖

通过：新鲜屏幕确认准确克隆仍登录桌面；UTM标准光驱提示及禁用编辑状态已观察；两VM配置和准备ISO哈希保持。用户已确认实际随附许可，但运行时许可点击尚未执行。

暂停：内部只读CD不支持当前标准热换盘菜单，需停机配置；停机/换盘本身已有授权，新一次Windows登录仍须用户本人或具体当次确认。没有新审批拒绝、没有不明写入结果。

未运行：挂盘、Windows签名、Autologon/UAC/Enable、任何安全设置、重启/睡眠验证、游戏。产品代码未改、测试未重跑。见[本阶段证据](../analysis/vm-install-v12/media-mount-blocker.json)。

## v13 / stage19：Parallels只读盘点及UTM暂停

已完成：明确UTM停在关机前，未换盘/重启/登录/UAC，新单次确认未使用；两VM配置hash与隔离保持。已检查标准应用元数据、可见应用清单、CLI路径、安装收据、三个常见PVM目录、三个已知登记文件及本项目即时目录；均未发现Parallels/PVM。结果是限定范围未发现，版本/许可/旧VM架构未知，不是全机不存在的证明。

未执行：未知VM启动、新安装/试用/购买/条款接受、网络/共享变更、TPM/许可秘密读取、删除/废纸篓扫描、游戏运行。产品42文件不变，产品测试未重跑。具体检查路径、限制和暂停状态见[盘点](../analysis/vm-install-v13/parallels-inventory.json)，官方条件性复用路线见[环境报告](vm-environment.md#v13-parallels-assessment)。

## v14 / stage19：整体移除前只读清单（未删除）

已核对UTM 5.0.8、项目原VM/克隆、两冷基线、4份独立ISO以及6个历史明确临时路径。UI原VM锁屏/克隆桌面；精确lsof显示两VM各4盘仍开着，冷副本/独立介质无输出。13个QCOW2头无backing/external-data-file，持久引用局限各自bundle。没有读客户数据、TPM秘密、旧废纸篓或其他VM，完整依赖适用范围见[检查](../analysis/vm-install-v14/dependency-check.json)。

未运行：正常关机、退出UTM、取消注册、任何移动/删除/恢复、Autologon、登录、游戏/联网、替代软件安装。未保存工作及其他VM反向依赖未全部可见。只读ps被EPERM阻止，未重试；不影响本轮清单但不报告完整进程盘点。产品文件不变，未重跑产品测试。[清单](../analysis/vm-install-v14/removal-inventory.json)；文档链接/交付前检查见[阶段核验](../analysis/vm-install-v14/stage-validation.json)。

## v15 / stage20：可恢复清理执行与现有Parallels接管

**通过：** Finder正常移动9项主体、6项既知临时工件、4项后核实工件/空目录、3个空build父目录；22原路径不存在。旧NetKVM ISO 8/8成员hash与v4匹配。文档更新前stage19全部409文件hash一致，42产品文件hash一致，moli原件元数据一致。UTM退出；Gatekeeper最后仍enabled。当前Parallels由用户启动后确认运行，Windows 11窗口可观察。

**失败/阻碍：** UTM容器Data元数据列举OS EPERM，整包保留；Parallels codesign严格验证失败、spctl应用评估内部错误。第一次正常启动被自动审批拒绝，第二次经新确认的重试被用户中止；这些不等同于macOS原生启动拒绝。工具多次长等待分别记录。

**未运行/未验收：** 废纸篓清空/放回、Gatekeeper设置UI确认、许可证与激活、Windows桌面/客户机架构、实际网络/剪贴板/USB隔离、游戏执行/官服互操作。产品测试未重跑，因为产品代码未改；25 Node/8 Python/16 Swift为历史通过结果。具体[清理核验](../analysis/vm-install-v15/final-removal-verification.json)、[现有会话](../analysis/vm-install-v15/parallels-running-observation.json)、[阶段文档核验](../analysis/vm-install-v15/stage-validation.json)。


## v16 / stage21：Parallels启动只读跟进

已验证：现有配置页/设备菜单可读；共享网络、双向剪贴板与双向共享具体选项；具名日志/元数据及磁盘活动。最终画面从“请稍等”变为黑屏，桌面仍未验收。被拒且未执行：一次Ctrl+Alt+Delete响应检查；已停止，无绕路重试。未通过/待验证：桌面、OOBE/更新完成、许可/激活与实际隔离。未运行：来宾命令、凭据输入、游戏、重启/强关机、隔离修改或产品测试。产品代码未改，历史测试不能写成本轮运行。[观察](../analysis/vm-install-v16/startup-and-isolation-observation.json)。


## v17 / stage22：来宾桌面与固定样本重新核验

通过：已观察桌面并正常打开系统设置、winver、msinfo32；专业版24H2/26100.4349及ARM64直接确认；5/5固定样本hash与原计划一致；Gatekeeper仍启用。未通过/待验证：激活/许可、Mac/Windows隔离、私有恢复点、全部设备/图形API、游戏与官方协议兼容。未运行：Ctrl+Alt+Delete（请求取消）、凭据、重启/强关机、隔离修改、游戏导入/执行、产品测试。只读系统查看器本轮实际运行；没有把它记成游戏动态分析。[桌面](../analysis/vm-install-v17/desktop-and-isolation-observation.json)、[样本](../analysis/vm-install-v17/fixed-sample-recheck.json)。


## v18 / stage23：有界实验准备

通过：五源文件hash、ISO固定5成员/无启动/无autorun检查、5/5逐字节回读；PVM具名结构/容量只读预检。失败已修复：首版介质脚本拒绝标准/tmp别名，输出前停止；核实无结果后新版本按/private/tmp运行成功。阻碍：首次屏幕调用报告locked，未做界面动作或重试。未运行：VM隔离、关机/重启、冷副本/恢复验证、挂盘/导入/客户机hash、样本执行（0次）、产品测试。产品代码未改。[状态](../analysis/vm-install-v18/execution-state.json)、[介质](../analysis/vm-install-v18/media-validation.json)、[恢复前检](../analysis/vm-install-v18/recovery-preflight.json)。


## v19 / stage24：隔离与原生恢复点，客户机输入阻碍

通过：正常关机及重启到桌面；主机侧NIC断开、Mac隔离与可见外设共享关闭；已验证光盘正常挂载；原生关机快照管理器可见、内部两层磁盘链与状态文件hash核验。冷副本20/20内容hash匹配，但严格扩展属性比较失败，不能标恢复通过。未运行：原生还原/恢复启动、客户机网络/共享/五文件hash查询及复制、PowerShell命令、样本（0次）、游戏联机。阻碍为中文IME改写/截断输入，未提交且已取消。自制复制器8项原创夹具测试属于工具准备（含mock边界），不等同产品测试或真实副本通过。产品42文件无计划改动，25Node/8Python/16Swift为历史结果，本轮不重跑。[状态](../analysis/vm-install-v19/execution-state.json)、[隔离](../analysis/vm-install-v19/isolation-and-media.json)、[恢复点](../analysis/vm-install-v19/native-snapshot-verification.json)、[失败副本](../analysis/vm-install-v19/cold-copy-failure.json)。


## v20 / stage25：单次客户端离线启动与故障证据

通过：英文短段输入可核验；普通Medium权限；CD5/5、目的地运行前5/5、运行后5/5 SHA256匹配；一次进程创建PID600并在约16秒观察窗口内确认退出，未到90秒；来宾断网与主机隔离复核；目录仅五文件、大小/hash未变，当前直接后代查询为空。

失败/未达成：没有可验收游戏窗口，系统记录同PID两条Application Error1000（c00001a5、c0000005，模块unknown）；游戏启动可用性未通过。此前独立冷副本严格属性失败仍保留。未取得：数值退出码、活进程模块、完整子进程/系统写入轨迹、根因。未运行：第二次启动、补DLL/资源、安装器/登录器/更新器、游戏账号/官服、转储/抓包/注入、原生快照还原。产品代码未改，25Node/8Python/16Swift仍是历史通过，本轮未重跑。结论不能扩展为ARM完全不兼容或官方可玩。[本次观察](../analysis/vm-install-v20/run-observation.json)、[文件核验](../analysis/vm-install-v20/guest-files.json)、[隔离](../analysis/vm-install-v20/isolation-final.json)。


同阶段启动器v4：只读增量覆盖CreateProcess十参/工作目录/NULL环境、映射失败继续路径，以及原始/解压PE manifest身份和权限声明；精确核验回执见[启动上下文](../analysis/launcher-v4/launch-context.md)和[manifest](../analysis/launcher-v4/manifest-context.json)。兼容模式版本、设置对象与正常流程尚未验证；未启动登录器、设置兼容模式或接受UAC。此前直启不代表用户所述正常流程。

启动器v4最终核验：39/39字节锚点（4个IAT API）、6/6合成测试通过；首次测试收集ModuleNotFoundError已在新测试加载器修复，初始失败日志保留。manifest原始登录器/解压副本/游戏3/3通过，声明级别与资源身份均核验。没有修改产品代码或运行目标PE。


## 启动器v5限定静态验收（2026-10-25）

- **通过：** 状态链39/39指令/数据锚点、3个IAT调用点及1个唯一目标控件；RT_DIALOG133/2052的23个控件有界解析，元数据匹配固定hash。[结果](../analysis/launcher-v5/state-field.validation.json)。
- **通过：** 原创DIALOGEX/分支/身份拒绝6/6测试，覆盖82个截断前缀；未使用官方资源作为测试夹具。[测试记录](../analysis/launcher-v5/state-field.tests.json)。
- **通过：** 目录链54/54锚点、9个IAT调用点、8短字符串、2条Code11目录元数据。[结果](../analysis/launcher-v5/directory-validation.json)。
- **通过：** 目录核验的截断PE、修改PE、截断XML、错误API/跳转目标/字符串6/6负例均拒绝；样本原件未修改。[记录](../analysis/launcher-v5/directory-negative-validation.json)。
- **未运行：** Windows7设置/启动器/更新器/主程序实验、VM或账号/网络观察、产品Node/Python/Swift回归。产品代码未变，历史25/8/16测试结果保留，不能当作本轮重新运行。
- **无新失败/权限阻碍：** 仅缓存资料探索中XML把Code误当子元素的查询未命中，改按实际属性定位；不影响最终固定hash/两条记录验证。无目标执行不明、待审批或样本运行重试。

规格产出是控件状态生产链及目录到cwd来源，未解决完整认证/消息帧/游戏消费者，未验收官服兼容。用户Win7双EXE前提单独标记未在当前VM验证。[结论和停止边界](launcher-static.md#launcher-v5-prerequisites)。


## 最后一轮启动器有界静态验收

- **通过：** [就绪链](../analysis/launcher-v5/readiness-evidence.json)47/47锚点、3条静态消息表、3个控件、2个分派表；4个篡改负例拒绝。
- **通过：** [argv/IPC来源](../analysis/launcher-v5/launch-inputs-evidence.json)50/50锚点（含静态写入别名及Galaxy计数）、2个文件枚举IAT调用点；4个hash/截断/API/跳转负例拒绝。固定RegionList Code11 Args=3、Galaxy/Galaxylist=0，仅为磁盘配置观察。
- **失败：** 无新增验收失败。**未运行：** 既有产品回归、解析器历史6项自测（代码未改）、Windows/兼容模式/游戏/启动器运行、账号/IPC/网络观察。
- 不宣称完整状态机、认证含义、实际运行值、故障根因或官方兼容。没有新增审批待办；本轮因到达明确静态语义边界收口，不是工具拒绝。[可读总结与最小下一方案](launcher-static.md#launcher-final-static-flow)。



## v21 / stage28：启动器材料通过，动态实验未开始

**通过：** 固定三源文件大小/hash、BIN_DATA/143/2052固定46080字节hash；新ISO精确3常规文件/2目录、3/3逐字节回读、无启动/autorun、mode0400。白名单配置只读复核NIC0/IsolatedVm1及旧CD路径。[介质](../analysis/vm-install-v21/media-validation.json)、[配置](../analysis/vm-install-v21/config-observation.json)。

**初次失败后已澄清：** 制作ISO成功，成员检查误计XML目录，退出1。未重建/覆盖；独立按类型核对既有镜像成功，构建器修正未重新运行。**阻碍：** CUA当前报告Mac locked，未重试/绕路，没有挂起操作。**未运行：** 新恢复点、界面与来宾隔离复核、Win7设置、挂盘/导入/来宾hash、UAC、启动器/更新器/游戏或官服，产品回归。当前本次执行额度0，产品无改动；25/8/16历史测试不可标本轮通过。[完整状态](../analysis/vm-install-v21/execution-state.json)。


## v22 / stage29：准备通过；有界启动器观察未验收

- **通过：** 正常关机/原生快照名称与poweroff状态；三层内部盘链及11份配置/快照/磁盘/只读CD文件hash；正常重启桌面未输入凭据；v21 CD与来宾目标各3/3 hash匹配；来宾网卡Disconnected、最终配置NIC0/Mac隔离1。
- **失败：** 启动器Win7选择未保存；事件查询被IME改写后取消未提交。
- **结果不明：** 属性页Escape/Enter是否激活启动器。未见/接受UAC，未有意启动，但无法排除短暂运行。当前指定3进程无返回行、默认目录枚举3原文件hash不变，只能作为有限收尾，不能证明运行次数为0。
- **未运行/未验收：** 再次样本启动、游戏Win7设置、恢复点还原启动、≤90秒有界观察、初始界面/错误原因、官方联网。产品代码未改，25 Node/8 Python/16 Swift历史测试本轮不重跑、不计作本轮通过。

证据：[恢复点](../analysis/vm-install-v22/native-snapshot-verification.json)、[三文件](../analysis/vm-install-v22/guest-file-validation.json)、[执行不确定性](../analysis/vm-install-v22/execution-state.json)。


## v23 / stage31：一次启动器初始错误已观察

- **通过：** 复用v22恢复点的metadata/两份非活动父盘hash，固定源/介质/内嵌Updater身份；输入和正常Explorer关窗；固定路径UAC核对、仅一次明确启动；PID2132的HasExited=True、ExitCode=-1、Process时间记录；运行后原三文件hash一致、最终NIC0/Mac隔离1。
- **运行结果：** 自动更新检查“网络错误12007”及“更新检查失败”，正常关闭两个提示后退出。目标进程01:28:05–01:29:19 UTC，74秒；含UAC等待的提交到退出137秒，**违反90秒约定**，且结果报告延迟，本轮**不完整通过**。整个进程树寿命未连续验证。
- **有限负结果：** 当前三命名进程与PID2132直接子进程均空，不证明从未有后代；Log.htm新增619字节，正文未读，其他系统写入未审计。
- **未验收：** 更新成功、登录UI/认证/游戏/官方联网，原生快照还原启动、全部后代寿命、实体键盘根因。Win7两者按用户确认，不重复属性页。无产品代码改动，不重跑25/8/16历史产品测试。

[本次证据](../analysis/vm-install-v23/run-observation.json)、[最终配置](../analysis/vm-install-v23/final-config-observation.json)、[完整结果](vm-environment.md#v23-launcher-initial-probe)。

**v23静态收尾：** 更新失败路径新增22/22字节与字串锚点匹配；3份v23 JSON解析及11处新增v23链接检查通过。没有新增样本运行、联网或VM设置变更，未读取Log.htm正文；产品测试未重跑。该静态校核不能补偿90秒执行约定失败或延迟回报，详见[证据](../analysis/vm-install-v23/update-failure-static.json)。


**stage32 / v23公开请求：** 一次直接GET首清单已完成：HTTP200、text/plain、33字节、单行32位十六进制结构（值不保存），未重定向/带凭据/追加请求，未改VM或执行样本。JSON解析与三处新增证据链接检查通过；产品测试未重跑。此项仅验公开URL当时可达，不补偿v23时限失败，不验官服兼容。[元数据](../analysis/vm-install-v23/public-manifest-observation.json)。


**stage33 / 公开更新元数据有界收尾：** 两个精确地址各一次HTTP200；公开下载地址仅记录未访问。XML两摘要与本地只读比较为GameList相同、RegionList不同；未确证EXE版本或管理员更新安全性。请求数=2、无重定向/凭据/后续下载、无VM变化或程序执行。JSON及三处新增证据链接检查通过；不重跑产品测试，不追加网络检查。[证据与限制](../analysis/vm-install-v23/public-update-metadata-observation.json)。


**stage34 / 更新器最后有界静态收尾：** 复用历史88锚点/8区间结果（未重跑），仅补核2个本地样本SHA256、8/8调用上下文/退出定点锚点；新JSON解析与受影响证据链接检查通过。无产品代码变更、产品测试未重跑；网络请求/下载/样本执行/VM变化均为0。[证据](../analysis/protocol-v3/updater/lifecycle/restart-context.json)。


**stage35 / 已批准公开ZIP离线比较：** 一次GET580477字节，路径/驱动器/穿越/链接/特殊文件/重复/压缩膨胀边界检查与CRC通过；唯一599040字节EXE和原件完整字节/SHA256/MD5相同。PE安全目录为零、manifest哈希/权限复核、Rizin版本资源1.5.8.2读取完成；仅新JSON与相关链接核验。无样本执行/安装/VM变化/新协议实现；产品测试未重跑，未验证真实更新或官服兼容。[完整记录](../analysis/launcher/public-package-comparison.json)。


## stage36：跨平台启动配置与目录文件计划的实际代码验收

新增[launcher.mjs](../shared/launcher.mjs)、[31项原创测试](../shared/tests/launcher.test.mjs)和[可运行合成示例](../shared/examples/launcher-plan.mjs)，从`shared/index.mjs`重导出。没有只扩报告，也没有猜造认证/帧或添加执行器。

| 本轮执行 | 结果 | 证据 |
| --- | --- | --- |
| 全部shared/Web Node套件，含31个新配置测试及原25个测试 | 56/56通过，0失败/跳过 | [Node日志](../shared/evidence/launcher-node-tests.log) |
| Python资源oracle合成回归 | 8/8通过 | [Python日志](../shared/evidence/launcher-python-regression.log) |
| 保留Swift原型回归，私有/tmp缓存和构建目录 | 16/16通过，0失败；源码不变、未启动GUI | [Swift日志](../shared/evidence/launcher-swift-regression.log) |
| `node shared/examples/launcher-plan.mjs` | 退出0，输出INI来源及client/config路径，静态Argsline原文 | [实际JSON](../shared/evidence/launcher-example.json) |

边界测试覆盖重复Code/ordinal、HKCU优先与缺失/错误回退、快照引用不匹配、Path/Game反置/重复、旧键拒绝、XML实体/CDATA/数字换行/截断/恶意声明/重复/原型键、Unicode、所有固定预算和路径穿越/ADS/设备/歧义。代码审查中修正了数字CR实体保留与快照键长度，最终Node套件在修正后再次全部通过；没有测试失败被省略。

[回执与版本/源码哈希](../shared/evidence/launcher-validation.json)。本轮未运行官方XML输入、真实文件/注册表/账号、浏览器或真机的新接口集成、任何原程序或网络/VM操作。Node解析通过不等于小程序支持、真实完整安装、启动器ready、游戏协议或官方可玩性。下一关键依赖仍为游戏端消费者和就绪/认证规格；独立可推进的是有证据的离线逻辑，不能用此文件计划越过权限边界。


**stage37 / 游戏消费者可行性边界：** 固定se3000样本SHA256及14/14命令行缓存/读取、API解析、零派发槽和CodeView短锚点通过，新增JSON和相关链接核验。未闭合游戏消费者至socket；未做解保护、执行、网络、真实内存或VM操作；无工具拒绝或挂起。产品源码未改，stage36的56 Node/8 Python/16 Swift保持历史通过，本轮不重复跑。[可复核证据与严格限度](../analysis/protocol-v3/game-network/static-feasibility-20261026.json)。


## stage38：显式inventory与MAP01原始解析代码验收

新增[17项inventory测试](../shared/tests/install-inventory.test.mjs)、[12项MAP测试](../shared/tests/map01.test.mjs)、组合示例和显式四文件只读验证器；共用路径政策保留原LauncherError契约，并补组合路径4096字符门槛。

| 实际执行 | 结果 | 证据 |
| --- | --- | --- |
| 新单元首次运行 | 28/29通过；缺摘要测试夹具错误，已修正且不降低断言 | [首轮原因及最终回执](../shared/evidence/install-map-validation.json) |
| 修正后的新单元 | 29/29通过 | [单元日志](../shared/evidence/install-map-unit-tests.log) |
| 全部shared/Web Node，含原56项 | 85/85通过，0失败/跳过 | [Node日志](../shared/evidence/install-map-node-tests.log) |
| Python资源回归 | 8/8通过 | [Python日志](../shared/evidence/install-map-python-regression.log) |
| 原Swift原型回归 | 16/16通过，源码不变，未启动GUI | [Swift日志](../shared/evidence/install-map-swift-regression.log) |
| 四hash绑定真实MAP与独立Python oracle | 4/4身份、尺寸、头、body长度/SHA256匹配 | [oracle](../shared/evidence/map01-real-oracle.json)、[Node对照](../shared/evidence/map01-real-comparison.json) |
| `node shared/examples/install-and-map.mjs` | 退出0，metadata/原始地图用例输出且ready未验证 | [输出](../shared/evidence/install-map-example.json) |

负例含所有地图截断前缀、尾部、错magic/版本、0/超大/溢出形维度、32MiB预算、非零byteOffset/数组子类独立副本；inventory包含root不匹配、伪造路径、穿越/UNC/ADS/设备/别名、重复/缺失、大小/摘要未提供或不匹配、安全整数与字符/条目预算。真实资源只读已明确四路径，未扫描用户目录或保存body。[源哈希和范围](../shared/evidence/install-map-validation.json)。

**未运行/未验收：** 真实安装扫描、PE/资源内容真实性、完整游戏安装、地图平面/渲染/碰撞/坐标、手机/小程序接入、任何原程序执行/联网/VM变化、游戏认证/帧/官服兼容。协议阻碍仍在stage37，不以这两项依赖实现替代。


**stage39 / 诊断准备实际验收：** 固定安装包全SHA256匹配，innoextract排除temp离线输出2367文件/2,626,083,970字节，退出0；9候选组件只读hash/头字段完成。真实固定GameList首次通过共享解析器：5记录、5处显式裸&兼容、两Code11；源metadata四配置要求匹配，五文件材料模型缺3项。新增4个原创准备测试全部通过，[日志](../analysis/diagnostic-preparation-v1/tests.log)、[数据结果](../analysis/diagnostic-preparation-v1/material-assessment.json)。新样本执行/联网/VM变化为0；产品代码不变，不重复跑stage38已通过的85 Node/8 Python/16 Swift。`ps`查询被沙箱拒绝，未绕路；来宾诊断器/无登录业务可达性/可靠停止未验，不能将材料完整或窗口出现标成协议验证。[具体阻碍与下一范围](../analysis/diagnostic-preparation-v1/diagnostic-plan.json)。


## stage40：容器证据和合成观察契约验收

- **通过：** 固定Apex样本摘要、单gzip流CRC/ISIZE/输出预算和内层摘要核实；六EXE直接文件名/基名字面量搜索范围已记录，零命中只作为有界负结果。[证据](../analysis/diagnostic-preparation-v1/apex-static.json)。
- **通过：** Node v26.9.0原创元数据契约测试6/6，含顺序/缺项、失败退出、秘密或缓冲字段、网络/派生API、外部模块、身份/机器/RVA越界、时间/数量预算负例。[实际日志](../analysis/diagnostic-preparation-v1/synthetic-trace-tests.log)。校验器不执行目标或采集元数据；测试不证明上游观察器隐私或真实调用可见性。
- **阻断、未执行：** 普通`launcherVM.getAXState`返回工具报告locked，未进入来宾观察器存在性/帮助查询；未重试/绕路，未重复被拒的ps，无挂起工具。[状态](../analysis/diagnostic-preparation-v1/guest-tool-check.json)。
- **未运行/未验证：** C源码Windows编译、来宾导入/执行、真实API演练、ARM对x86观察能力、任何官方程序/网络/账号或协议。产品代码不变，stage38已通过的85Node/8Python/16Swift及4真实MAP作为历史记录，本轮未重跑；本轮没有测试失败。


## stage41：本地非GUI可行性只读核验

**已完成：** 原工程Darwin/ARM64路径/macOS静态事实、三个CLI入口及脚本/二进制hash、随附exec/enter/current-user语法与Tools依赖核对。prlctl签名校验退出1，明确arm64代码/签名被修改；包装器先ps再可能初始化服务、prlexec转调/自动启动的控制流均已从文件验证。[证据](../analysis/diagnostic-preparation-v1/local-cli-feasibility.json)。

**阻碍/未执行：** 先前屏幕访问恢复但输入路由失败，未按Enter提交工具查询；不再反复探测。硬件sysctl查询权限拒绝后停止。CLI因前置完整性/禁止ps及服务副作用条件未满足而未运行，这不是一次CLI运行被审批拒绝；未使用直接路径或其他方法绕过。[界面记录](../analysis/diagnostic-preparation-v1/guest-tool-followup.json)。

**未运行/未验证：** CLI --help/--version、有效版别许可、来宾Tools/账户令牌与锁屏可用性、任何来宾回显/工具/样本/API观察。无新单元测试或产品代码修改，既有6项合成测试仍为stage40历史结果，本轮不重复；无下载、提权、网络/安全变化或挂起工具。


## stage42：官方修复路径和PVM保留方案核验

**已核实：** 当前应用Info26.3.3(57507)、CLI/包装器hash与stage41相同；已知PVM非symlink、两具名快照、三磁盘层引用存在且解析后内部。仅结构/存在性，不是冷备份/还原验收。官方资料支持应用替换复用VM、整包关机备份、CLI版别及Tools依赖；来源/日期/局限已保存。[回执](../analysis/diagnostic-preparation-v1/official-repair-assessment.json)。

**未执行/待验证：** 许可及目标版本选择、官方DMG二进制下载/签名/实际条款、关机/冷复制/还原、应用安装、Tools更新、正常入口权限、CLI/来宾无凭据回显、具名观察器及锁屏可用性。无新拒绝、挂起调用、产品代码或测试变更；既有6项合成和产品回归不重复。未重试先前被拒ps/硬件查询，不执行异常CLI、不改VM或主机安全/网络。


**stage43 / 许可只读核查：** 既有窗口读取被工具锁定状态阻断，关于/账户许可检查未执行；仅普通应用Info.plist版本及非敏感字段名检查完成，未得出许可版别/有效期/升级结论。未重试、未读密钥存储或凭据，无新测试、CLI/样本/VM/安全设置操作；无挂起调用。[准确状态](../analysis/diagnostic-preparation-v1/license-check-blocker.json)。


**stage44 / Business用户确认：** 当前版别采用11:57 UTC用户明确确认，未重复UI/文件辨认；核对官方有效Business订阅升级政策和企业管理员可禁大版本条件。当前实际有效期/覆盖仍未知，未把政策当个人许可查询。无UI/CLI/来宾/安装/设置变更，无代码/新测试或回归重跑。[当前状态](../analysis/diagnostic-preparation-v1/business-license-status.json)。


**stage45 / GUI观察器存在性：** 完整路径绑定相同既有VM窗口及屏幕读取通过；一次可见设置图块点击后的导航未确认，工具名称/版本/帮助/ARM-x86 API能力未验，不能记为缺失或成功。无来宾命令、样本、附加、安装/下载/提权/设置变化；无新代码/单元测试或完整回归重跑。CLI及修复查找取消，不复用历史授权。[精确只读记录](../analysis/diagnostic-preparation-v1/gui-tool-presence-followup.json)。


**stage46 / WinDbg离线准备：** 官方Win11 ARM64、后台更新和MSIX本地GUI机制已核对；Mac官方文本GET与短链HEAD完成，清单HEAD403后停止，无二进制GET或执行。当前大小/依赖/条款未验证；微软WinGet固定旧版URL/SHA仅为公开预期，未做下载比较。另一次GitHub目录读取被工具标restricted URL后未重试，Store公开文本仅JS提示，不能据此宣称许可无要求。无新增测试/产品修改；原6项schema测试和其他回归不重复。[精确已完成、受阻、未执行及未来范围](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json)。


**stage47 / GUI与公开分发语义：** 通过：同一窗口可见焦点的一次120ms物理`x`输入读回`windbgx`，清除读回`windbg`；输出截断后先观察未重发。JPEG尺寸3456×2010已按格式核实，旧PNG运算丢弃。未验：鼠标、typeText、完整导航/继续/关闭与根因隔离。仅官方文档确认独立Store路线和RFC9110的HEAD/403/405区别；受拒端点未重试，二进制下载/安装/提权/VM设置/官方样本执行均为0，无挂起工具。代码未改，无新增单元测试或产品回归重跑；既有结果保持历史记录。[GUI证据](../analysis/diagnostic-preparation-v1/gui-tool-presence-followup.json)、[官方来源及限制](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json)。


**stage48 / Store attempt:** Passed recovery-manager visibility/internal disk references, isolation1, guest launcher/cg filters and normal Task Manager close.120ms mouse/search partially passed; modifier shortcut/native popup had no confirmed effect. Blocked by cannotClickOffscreenElement, not an approval denial; not retried. Final NIC Connected0. Store installation0, no tool version/initial UI acceptance, new terms/UAC/login or pending tool. No product changes or regression rerun. [Evidence](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json).


**stage49:** Single native Tab recovery did not establish focus movement/popup visibility. Stopped, no hidden-element click. Final NIC Connected0/IsolatedVm1 verified; Store install0, no prompts or pending tools. No product/test changes or regression rerun. [Receipt](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json).


**stage50:** Network reconnection not executed: initial normal app binding blocked by tool-reported Mac lock. No retry, installs, game runs or setting changes. File config Connected0/IsolatedVm1 only, no live network acceptance. Pending tools0. [Receipt](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json).
