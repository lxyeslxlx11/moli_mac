## 自更新接管与新版启动验收

D1 将 F5A 的自更新占用状态接入现有更新所有者。排队登录、游戏补丁和启动共用准入。D5 复用发布读回、重启意图及新启动回执，验收旧实例退役、迟到回执与实际活动内容。D6 继续核对原版进程、替换和同版游戏结果。 [原版证据与用例](launcher-static.md#f5a-update-handoff-and-ack)

## 图形回退进入原设备验收

PR-A10 共用启动档位、表面格式失配、设备创建与准备、文件写入和呈现恢复用例。D0/D3 复用现有图形和窗口所有者，分别验收创建失败后的下一候选、准备失败后的档位 1、能力位缺失时继续准备和写入结果。覆盖字节和档位文件读取沿具名生产者或消费者补证。 [档位和文件](game-static.md#legacy-render-device-preparation) · [呈现与恢复](game-static.md#legacy-render-presentation-recovery)

PR-A10 同时覆盖绘制表面忙后的键盘和鼠标消费、系统 Enter 的两次可能重建及调色板失败后投递的系统键。D0/D3 共用现有输入端口和图形所有者，按消息实际到达次序接线。 [输入与重建顺序](game-static.md#legacy-render-system-key-rebuild)

## 构建身份进入原启动验收

UH-U03 已核定微信生成工程的身份输入。D0 直接复用构建报告的产物文件清单。D5 在版本化网页入口及微信生成包中提供可读身份，沿原 `bindNewBoot` 验收配置变更、旧分包晚到、同一构建的内容重绑以及实际新启动。 [生成证据与设计](architecture-and-milestones.md#reconstructed-build-identity)

## 持久化分块与现有资源库接线

X03/X04 的桌面和移动 Safari 夹具共用跨块、大偏移、旧根继续使用与重开用例。D0 在移动 Safari 对所测复合块采用连续字节写入，预算按有效清单计算。D5 用同一组用例验收产品更新端口。完整场景、自然配额与设备寿命继续沿 UH-U01/U04 核对。 [桌面读回](architecture-and-milestones.md#desktop-persisted-resource-archive) · [移动读回](architecture-and-milestones.md#mobile-safari-persisted-resource-archive)

D0/D5 将同名等长的内容换版与旧读任务退役纳入同一验收。UC-P07 验旧根与新根各自的成员摘要及画面。UC-P09 验逻辑关闭后仍保留租约，等宿主读和绘制任务返回后释放，UC-P08 再核旧根回收与新根重开。桌面夹具已通过这组案例，正式三端继续验收。 [组合实测](architecture-and-milestones.md#browser-resource-version-isolation)

X03/X05 共用微信大偏移、双根容量和完整素材的分段选择证据。D0 在候选获取或写入失败时继续保留旧根。D5 沿 UH-U02 接入已在 DevTools 验证的分段范围读，并按实际另存配额补齐持久化、重开和换版用例。iOS 和 Android 的实际输入途径及容量分别验收。 [微信读回](architecture-and-milestones.md#wechat-sdk-archive-files) · [完整资源分段实测](architecture-and-milestones.md#wechat-sdk-segmented-archive)

D0/D5 共用新 App 按清单重开、逐段复核及缺段补选的用例。已验证小型 ZIP 的临时路径与持久副本读回，以及临时路径缺失时保留可用副本的条件。D5 继续沿 UH-U02 验收大包与真机。 [重开实测](architecture-and-milestones.md#wechat-sdk-selection-lifetime)

## 补丁结果恢复登录准备

D1 复用当前退出码解释和登录所有者。所选等待分支写阶段 1 或 2，成功回调先消费待处理标记，再续接阶段 3 并沿现行准备编号进入同一个提交准入。D5 通过宿主通知端口处理提示请求、临时图标和定时清理。补丁、登录和宿主共用一次等待到续接的用例，覆盖选择失效、迟到结果、任务槽占用和提示期间的匹配消息。 [来源与用例](launcher-static.md#f5a-patch-completion)

## 断线恢复的共用规格

D0/D2 将固定 Item 的断线提示与确认归入已有输入、游戏状态及会话退役所有者。先核活动槽与重复帧，再覆盖分配失败、未命中、重复点击和确认后切回选服。目标宿主的错误来源与实际同版在 D5/D6 验收。 [原版状态及对象顺序](game-static.md#legacy-item-disconnect-recovery) · [验收范围](validation.md#legacy-item-disconnect-recovery-validation)

D0/D2/D3 合并两版当轮缓存消费、就绪位清除、提示发布及角色槽变更的用例。CF-D3 复用共享解码，GF-A19 和 SF-A29 分别观察状态及记录。D5 沿现有会话接口核对真实关闭、旧读取完成和新连接。 [共用规则与实施差异](game-static.md#legacy-receive-retirement-order)

## 按实物资源规模继续完成规格

原 D0 资源规格采用本次核对的 2,613,885,785 字节 `bin` 与 `map` 载荷和现有初始化的数组下界。大图形档优先按范围或有界分块读取。坐标数据在同一版本内按文件身份共享，每个动画组保留自己的图形基数。

G06、G07 和 X03 共用本批的图形暂存与颜色缓存规则。D0 复用现有资源库的代表色计算，覆盖来源校验命中、失配重建及可选路径缺失。D2 按原顺序准备调色板，再查询精灵缓存。用同一规格检查各端的素材发布、解码输出和换版退役。 [共享规格](game-static.md#legacy-graphics-scratch-provenance)

G06/X03 在 PR-D2 补图形块预算不足时的覆盖范围、绘制与恢复。D0/D2 复用现有资源库、已准备计划和场景身份。D5 沿 PR-A05、PR-A06 核实际块盖章、呈现回执及世界请求。 [来源与用例](game-static.md#legacy-graphics-partial-cache)

G06/X02/X03 沿同一个绘制所有者区分颜色已匹配、进入限额、超过限额继续绘制及解码失败。D0/D2 复用颜色计划和资源库，D5 沿 PR-A06、PR-A09、PR-A10 验普通绘制、背景捕获与重建。 [颜色规则](game-static.md#legacy-graphics-deferred-upload)

G06 的 D0/D3 将固定 SE 的配置请求、设备档位和两级绘制条件归入原颜色后端差异。沿 PR-A10 核对第 0 层纹理探测、设备准备回退及普通与缩放加色分支。X02 共用呈现失败登记、宿主就绪和旧上下文退役的顺序。原设备输出和当前同版按各自来源继续验收。 [来源与实现边界](game-static.md#legacy-render-recovery-probe)

本包正尺寸图形均对齐。非对齐尾部在出现相应实际素材时复核。固定来源的烟雾首帧会推进动画，普通绘制准备缓存后因负高度裁掉该帧。D0 处理有符号几何及绘制边界，D4 验证首帧、后续帧及完成回调的顺序。

[资源测量与源规则](../analysis/capability-first-v1/resource-corpus-budget.json)

<a id="launcher-startup-functional-specification"></a>

## 当前登录器补证：嵌套退出hook的安装与所选分支已成规（2026-11-11）

QH沿固定C82 App Init的正向OLE初始化调用补齐EA-F13：45C46F在所证mode/HRESULT条件下把45C570写入44FD1F所得对象+3c；alternate mode可返回1而不走本体setter。45A8A6实际以(1,1)调用，再在正常返回后投递退出消息，不能把所有nonzero初始化结果或quit请求当作资源/登录通道已退役。

所选45C502(1)先执行条件OleFlushClipboard、factory链遍历和先移除再虚槽0调用，然后跳过本地零参filter删除/COM-uninitialize分支。实际module flag、资源成员/间接效果保来源条件；不据所选代码报告必现重绑/死锁或完整Windows关闭接受。普通modal期间形成替换binding的合法producer/投递准入、LS-U3实际消息/销毁和Host drain仍待。

新增7必要完整native/477B，复用App Init与quit两完整体；9窗1679B/531指令核原PE，REA已导出关闭。形成9事实、2推导、5操作、3组开发差异和8项未执行接受案例。停止已答OLE/MFC库存扩张，仅沿原必要正向对象/producer或Host证据继续。

原40/81/37/10/6、owner/依赖/批次/profile及14端口62方法保持；19项固定来源本域规格就绪不变，L03/L06/L08及统一A1..A4不提升。产品仍stage306，本轮无产品修改、目标测试/构建、VM/SDK/网络/账号操作。原GP补丁五组与UH三端发布/恢复方案直接复用，先全部能力成规再按D0–D6开发。

本批关闭具名source问题，未另起产品批次。LS-U3剩余普通准入只接受正向producer/投递材料；必要Host走既有共同端口。先全能力可实现规格、统一A1..A4，再按原D1/D5补差异。

[quit hook合同](../analysis/capability-first-v1/launcher-quit-hook-contract.json) · [源核验](../build/analysis/launcher-quit-hook-v1/source-review.json) · [本轮核验](../build/analysis/launcher-quit-hook-v1/validation.json) · [原补丁规格](../analysis/capability-first-v1/launcher-game-patch-functional-specification.json)

<a id="launcher-exit-admission"></a>

## 退出源规格纳入原批次，回到能力矩阵（2026-11-10）

EA补原L03/L08相邻宿主路径：About、Exit、Frame忙碌/空闲关闭、嵌套quit、外层App退出及通道owner释放。D1仍由既有shared flow/session和薄host接关闭准入、请求、排空与最终销毁；D5/D6保留真实三端、SDK和当前同版接受。源Sleep等待不移植为浏览器阻塞循环。

本轮原32必要体/1诊断槽的有界问题已答，停止通用框架/recovery helper扩展。仅出现所需普通producer/consumer时回补LS-U3，其他原能力继续依赖队列。2重复查询不算新增语义，1常量slot不算需求覆盖；未改产品、未重跑LR四例或完整构建，统一门槛仍false。

[退出准入合同](../analysis/capability-first-v1/launcher-exit-admission-contract.json) · [源核验](../build/analysis/launcher-exit-admission-v1/source-review.json) · [既有端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-exit-admission-v1/validation.json)

<a id="launcher-callback-reentry"></a>

## 回调补证归入原批次，不扩展为全消息枚举（2026-11-10）

LR按原L03 owner补10操作与9入口：D0保留profile和规格归属；D1组合既有flow、DM/LE差异、host准入与会话退役；D5核真实三端/SDK；D6保留原25完整会话接受及新增modal组合。四个原创端口例证明现有distinct-session所有权可复用，不增第二套登录核心。

LS-U3未闭：只继续具名普通modal producer/guard、关于/退出销毁及所需binding顺序，有限负搜索不算准入证明。禁止按任意消息/线程全交错扩展helper库存；其余原能力继续原优先队列。统一A1..A4仍false，产品未改，SDK原设置授权请求不重发也不视为已同意。

C82 的主窗按钮和成功回包预设路径已各自绑定准入。D1 按忙标记、模态提示、控件恢复和旧会话排空的顺序衔接现有共享所有权。后续只沿确切的已入队消息、其它有效生产者或实际宿主退出证据补 LS-U3。 [登录错误入口与恢复](launcher-static.md#c82-owned-login-error)

L03/L08 的 D1/D5 共用 Windows 夹具的模态派发证据。按匹配编号消费后检查当前窗口，提示返回与提交按钮恢复各自完成。实际登录器的生产者、重绑和旧借用退役仍按 LS-U3 验收。 [派发与控件状态](launcher-static.md#windows-launcher-modal-dispatch)

L03、L04、L08 共用输入与排队规则。D1 复用现有登录所有者，收到 F5A 密码变化时只清待处理。D5 用同一组案例核对键盘、触屏、焦点恢复和迟到提交。 [编辑通知规格](launcher-static.md#launcher-edit-focus)

D1/D5 将两版列表双击归入现有阶段确认，沿原规则读取当前行。通知 1 沿阶段 0、4 刷新资料。F5A 阶段 3 的确认先清自动提交待处理位，再按忙标记决定是否继续。实际模态投递与新旧会话退役仍按 LS-U3 验收。 [列表与确认规格](launcher-static.md#launcher-list-activation)

[回调入口合同](../analysis/capability-first-v1/launcher-callback-reentry-contract.json) · [源核验](../build/analysis/launcher-callback-reentry-v1/source-review.json) · [端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-callback-reentry-v1/validation.json)

<a id="launcher-legacy-failure"></a>

## 旧版失败规则按原owner集中开发（2026-11-10）

LE合成8操作/15事实，关闭LS-U1的具名frame/typed失败/候选和返回尾部。LE-D1区分可重试连接错误、send numeric/容量状态、取消与内部生命周期失败；D2保留正确顺序并显式处理initial0清理、源timer与目标clock差异；D3沿既有owner管理退役和有效ordinal；D4复用DM材料、14宿主端口并继续LS-U3，沿原D0/D1/D5/D6开发。

不新增native EH模拟器或平行登录核心，不能把无局部deadline源等待复制成跨端阻塞。129实际纯目标例与770静态解释分列，原25完整接受及12补充接受未执行；L03/统一A1..A4保持false，产品未改。下一步只沿current LS-U3具名普通入口补证，SDK原请求不重发。

[旧版失败合同](../analysis/capability-first-v1/launcher-legacy-failure-contract.json) · [源核验](../build/analysis/launcher-legacy-failure-v1/source-review.json) · [纯目标对照](../build/analysis/launcher-legacy-failure-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-legacy-failure-v1/validation.json)

<a id="launcher-derived-material"></a>

## 材料源缺口关闭后，旧版目标差异归既有批次（2026-11-10）

DM关闭LS-U2所选普通方向key初态/部分写/发布规则，补7操作/11事实。DM-D1在原D1按明确旧版source profile实现七个短材料结果；generic独立群政策保留，不把旧零尾部规则全局套到current。DM-D2复用正确current长度拒绝/前8字节分支并接共享退役；DM-D3沿既有D0/D1/D5/D6继续原LS-U1/LS-U3及25完整接受。

新5 native/1 assembly/1 exact xrefs/1 containing查询均有具名缺口，已核字节及独立解码后关闭两会话；不继续扩展本材料helper。L03/统一A1..A4仍false，产品仍stage306。本轮无产品修改或完整构建/测试；下一次沿原必要异常/普通回调入口补证，SDK请求仍待原回复。

[材料合同](../analysis/capability-first-v1/launcher-derived-material-contract.json) · [来源核验](../build/analysis/launcher-derived-material-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-derived-material-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-derived-material-v1/validation.json)

<a id="launcher-session-functional-specification"></a>

## L03先按两来源收敛完整交换规格，再按共享owner开发（2026-11-10）

原八组与601b/c82f分别映射16操作。LS-D1/D4直接复用正确的profile codec、帧/五列/尾ABI/低16位投影；D2集中候选/提交deadline与时钟，D3集中异步背压/退役，D5先补具名异常/短材料来源，D6接L02/L04/L08及14宿主端口，沿原D0/D1/D5/D6组合，不新增平行核心。

当前createLauncherLoginFlow轮转和提交仍保留开始时总期限，882检查明确其与c82f源两阶段期限不同。LS-U1..3尚未闭，L03整项false；平台与同版账号接受LS-U4独立。全40项和A1..A4通过前不改产品；当前仍stage306，25完整用例未执行。已完整的codec/helper停止扩展，下一次仅追必要普通错误或方向key初态正向来源。

[双来源操作规格](../analysis/capability-first-v1/launcher-session-functional-specification.json) · [来源核验](../build/analysis/launcher-session-functional-specification-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-session-functional-specification-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-session-functional-specification-v1/validation.json)

<a id="wechat-sdk-host-probe-preparation"></a>

## 平台先核真实SDK前提，保持统一分析顺序（2026-11-10）

原工具准备记录保留当时的服务授权状态。图形界面后续已运行独立探针。 [原准备档案](../analysis/capability-first-v1/wechat-host-profile.json) · [本机模拟器实测](architecture-and-milestones.md#wechat-devtools-offline-sdk)

X01–X08原范围已读；本次选择X03/X05/X06缺实际SDK的文件/生命周期/本机流证据，先准备独立工程，不重构stage306产品或重跑全仓构建。首次授权会改变Mac上工具服务端口/客户端许可，现有设置保持、等待具体确认；其余静态规格工作可继续。

原服务任务继续按已提出的范围处理。已实测的本机文件、Canvas 和 Page 路径可进入宿主规格。完整用例、真机及当前同版继续验收。 [本机模拟器实测](architecture-and-milestones.md#wechat-devtools-offline-sdk)

<a id="game-battle-functional-specification"></a>

## 战斗按完整流程和共享所有者归并开发差异（2026-11-10）

[BF规格](../analysis/capability-first-v1/game-battle-functional-specification.json)保留B01–B04原14组需求、24token/110class/14个SKL组、51变体规格与10消费者，合成91操作。B01/B04固定本域成规，B02/B03必要native origin/context仍未闭，统一A1..A4保持未通过。

BF-D1..4归并接收/ACK/调度、29/32、transform/特殊技能和当前输入；D5..10补12/267、保双读序/foreign scratch/cursor/原word及共同body/动画/RNG/资源；D11复用退出/回城/重建；D12接三端及真实同版。已有正确字节/目标/MP重验/实际return直接复用，不按每个class重开阶段。

44完整案例未执行、产品未改。下一批原X01–X08及登录器未决做必要规格总审，BF-U1只沿实际正向来源补证，不重做已明helper或用缺账号驱动离线循环；没有可靠整体剩余工期或节时比例。

<a id="game-work-functional-specification"></a>

## G18按共享状态归并差异，继续战斗与公共规格（2026-11-10）

[WK规格](../analysis/capability-first-v1/game-work-functional-specification.json)保留六组原需求、两套窗口与既有所有者，合成60操作和7组开发差异。WK-D1修配方reset保存ctx归0；D2/D3集中共享计数、byte、时钟、同帧标记/发送/析构；D4/D5复用正确制造/物品/目标/采集/direct；D6保另一套实际准入条件；D7沿既有14端口接三端和同版接受。

现有正确材料关联、全56产品查找、刻印字节、目标序号和暂停晚到行为直接复用，避免按界面重写。源规则、独立atomic/revision/closed-late政策及未实现分别决定；纯检查通过不覆盖源差异。

另一套实际dispatch仍缺证，G18整项false。30完整案例与原依赖/真实接受未完成；统一A1..A4通过后再按D0/D3/D5/D6开发，本批无产品修改。下一组原B01–B04及公共需求对齐既有来源，只为会改变必要规则的具名缺口补证；整体剩余工期及节省比例仍无可靠估计。

<a id="game-social-family-album-functional-specification"></a>

## 队伍、联系人与家族按共享所有者开发（2026-11-10）

[SF规格](../analysis/capability-first-v1/game-social-family-album-functional-specification.json)合成原12组/72操作；先分析全部必要需求、统一A1..A4，再集中开发的顺序保持。SF-D1..2复用共享时钟、队伍/运动/徽标与战斗重绑；D3补实际联系人三view/选择/删除；D4..6组合家族资料、32称号草稿、兽与饲料箱；D7..8补完整图鉴和缓存身份/失败政策；D9沿D5/D6接实际三端接受。

已有有意义名称拒绝、喂食category0x35例外、共享绝对时钟、正确包字段和图鉴查询直接复用。源部分写/当前全局读取与独立原子/revision/pending/迟到过滤逐项决定，避免每个业务和平台各建一份状态模型。迷你清理20次地址范围不静默改10，也不当作已观察崩溃。

G14/G16固定本域成规；G19另一套激活与page初始/恢复仍保条件。30完整案例未执行，产品代码未改、统一门槛未通过。下一组审定原G18及战斗/公共需求，只补改变必要行为的具名缺口；没有可靠整体节时比例或剩余工期。

<a id="game-ordinary-services-functional-specification"></a>

## 按需求收敛分析，按共享所有者集中开发（2026-11-10）

1. 保留原40能力/81登记/37历史要求/10消费者/6来源；分析全部必要需求，复用现有证据与正确模块。
2. 每项REA结果收敛为输入、状态转移、输出、失败/取消、所有者、版本与证据。达到可实现规格即停止该族分析；只有改变必要行为的具名正向缺口才新增查询。
3. 汇总公共选择/数量、时钟、窗口退役、缓存、输入焦点、资源和宿主端口，完成统一A1..A4；源规则、独立目标政策、实现差异和外部接受分别判定。
4. 门槛通过后沿既有D0–D6依赖成组开发；stage306正确模块继续复用，三端共用核心与薄适配。
5. 按组验证边界，再逐端核完整流程。缺账号、当前配对材料、实际设备和官方接受时保留明确未决，不以局部夹具宣称交付。

[OS规格](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json)本批归并G09–G13原18组范围/78操作。OS-D1..9在原D0/D3集中处理选择占用、数量框、窗口准入/退役、物品、对话外观、商店训练、交易和仓储；OS-D10沿D5/D6接真实平台与完整接受。保留正确bag-only目标、外观循环、菜单映射及已有字节模块，不为每个平台重复实现。

G09/G10/G11/G13固定来源本域成规；G12另一套入口及需求关联仍缺证。31项完整接受未执行，纯模块检查只核当前策略与已知差异。产品仍stage306、统一门槛未通过；下一组审定G14/G16/G18/G19及战斗/公共需求，停止已知业务helper扩张。预期节时来自复用与减少返工，尚无可靠百分比或总工期。

<a id="game-presentation-functional-specification"></a>

## G06/G07按共享所有者合表，继续剩余业务审定（2026-11-10）

[PR规格](../analysis/capability-first-v1/game-presentation-functional-specification.json)将原五组图形与四组文字范围合成52操作/20组事实。全部224完整原记录与6派生视图复用，无新分析查询。PR-D1..8分别进入原D0/D2/D3/D4/D5/D6资源身份/预算、非对齐scratch、动画、颜色后端、水面粒子、字节文字输入、HUD小地图和目标生命周期，不重做正确核心。

G07固定来源本域规则就绪，原G05/G06依赖与宿主效果继续独立验收。G06因PR-U1所需非4倍尾部生产/别名/复用和后端/版本上下文保持未就绪；冷/热地址规则已可实现，不再重复解码/缓存辅助链。当前4倍宽度限制不是原资源范围的缩减许可。

24项完整接受未执行；纯模块检查通过且保留现有限制。统一A1..A4和stage306产品代码保持。下一组回原G09/G10等业务需求，用已有源组合操作和实现差异；只有具体必要资源/调用上下文才重开PR-U1，不按函数数或局部就绪数估工期。

<a id="game-actor-functional-specification"></a>

## 全需求分析、统一设计、按依赖复刻的执行流程（2026-11-10）

1. 固定原40能力/81登记/37历史要求/10消费者/6来源，逐项列出必要行为与当前正确实现。
2. 先REA覆盖全部必要能力；每项写清输入、状态转移、输出、失败/取消、所有者和证据，达到能指导实现即停止。已有来源复用，仅查询会改变实现的具名正向缺口。
3. 汇总共享状态、时钟、输入焦点、资源预算、持久化、更新接管、退役和宿主接口，统一A1..A4复核。源规则、独立目标政策、实现差异、外部接受分别记账。
4. 门槛通过后按既有D0–D6依赖成组开发，只补stage306差异。正确字节/移动/地图/附属/骑乘/文字核心继续复用；三端接同一核心及薄适配。
5. 每组核边界，再逐端验证完整流程；账号、当前配对材料、实际设备和官方接受保留独立证据。无法取得的材料只保留明确阻塞，不反复深挖已知辅助链。分析/开发/验收均按实际结果声明。

[GA规格](../analysis/capability-first-v1/game-actor-functional-specification.json)完成G05原六组范围/42操作。GA-D1..7把可变C0尾部、协同81/82、本地纠正/30重置、共享状态与统一退役并入既有D0/D2/D3/D5/D6；现有正确解码/插值/60/70/80/文本模块复用。72组原创样例通过，25个完整案例未跑，产品无修改。

此流程预期减少重复分析、跨模块返工和三端重复实现；当前未完成全部能力与统一门槛，没有可核验的整体节时百分比或剩余工期。下一组按原G06等必要规则审定，停止本对象族扩张，不以局部ready数预测交付。

<a id="game-flow-functional-specification"></a>

## G03原五组需求成规，停止主状态同族扩张（2026-11-10）

[GF规格](../analysis/capability-first-v1/game-flow-functional-specification.json)按原初始/普通/注销/服务端退出/回城重建合成33操作。复用63完整原生记录，新3次只补5015A0正向分派的454110/453E40/456E70；原45CFD0初始化及图形辅助直接复用。主9的22个显式子状态保留输入/顺序/完成/失败/所有者，外部业务仍引用G01/G02等原依赖。

统一A1..A4之后按GF-D1..6成组补D0/D2状态与CT reset、D0/D2/D3主9组合、D0/D2/D5返回/物理退役及D5/D6平台效果；已有角色字节/握手、地图、对象、fade、31次回城等待与迟到保护保留。当前没有产品修改，20个完整案例未跑；不按来源函数数或本域ready数估工期。

下一组回原G05/G06对象/图形范围审定；不重查本主状态/ACK/CRT/图形通用辅助，不扩展所有别名。原40/81/37/10/6、G02及其他未决、全局门槛和stage306保持。

<a id="game-communication-functional-specification"></a>

## G01原完整范围成规，通信核心按真正差异开发（2026-11-10）

[CF规格](../analysis/capability-first-v1/game-communication-functional-specification.json)覆盖原六组范围/33操作。134份完整原记录复用，7次新查询只补两个收发错误分类和五个可选版本预检函数；回城等6个后续发送窗口及3个已绑定小型机器码视图保留派生级别，未重查根函数。早期“模块摘要算法未知”由后续完整MD5生产链覆盖；104接收/66发送保持各自来源。

统一A1..A4后按CF-D1..5成组补差异：D0/D2显式版本/连接/active-pump与共享上下文，D0/D2/D5核空闲绝对时钟/部分发送/队列与租约，D2/D5/D6沿已实现字节/摘要/登录核心接薄端口及实际验收。不重做正确的二进制优先、旧材料保留、字段语法和摘要模块。

本轮119拆分及纯流程检查通过；两个时钟环绕差异保留未修，版本预检未在目标端完整实现。G01本域source-ready不提升原L07/X02/X06、业务/当前同版/三端接受。原40/81/37/10/6及stage306保持，下一组审定其余状态/对象/图形完整操作，停止通信族helper扩张。

<a id="launcher-config-path"></a>

## LF-U2已按必要调用链闭合，停止同族重复分析（2026-11-10）

[LP合同](../analysis/capability-first-v1/launcher-config-path-contract.json)补齐词法严格后代、最终路径/缺API属性扫描和已有祖先/缺失后缀；8次新查询全部来自具名必要正向调用，9份旧完整记录直接复用。17体原字节/ABI核验通过；5个纯策略情境只核现有模块边界，未运行源算法或Windows效果。

LP-D1..3并入原LF-D3及D0/D1：显式原字节/MBCS、API能力/属性/最终路径观察；路径候选、元数据存在与创建进程分开，沿既有14端口设计处理。统一A1..A4前不实现新功能。此路径族与旧根规则不再驱动新查询；下一步回原多profile必要操作和其余能力审定。原40/81/37/10/6、L01–L08=false、四个本域就绪及stage306保持。

<a id="launcher-functional-specification"></a>

## 登录器原范围复核与首次配置版本差异（2026-11-10）

执行主线保持全部能力A1..A4后再D0..D6成组开发。本轮为L01–L08原完整范围建立逐项/逐profile对照，复用LO19操作、118选定规则与MP缺失patcher闭合；新增C82 Config8操作，源查询仅40E900/4329B0，11份完整旧记录直接复用。没有新增产品功能。

601b的原unquoted/null applicationName/同步无限wait，与C82显式applicationName/quoted command/250ms异步poll/15min提醒、特殊退出及缓存先于profile写入是不同策略。D0/D1只在统一门槛后实现LF-D1..4，并复用原LO-D1..6/MP差异；不重新实现已经有源且合适的模块。D5/D6再组合完整所有者流程与三端效果。6组原创纯模块对照确认策略不等价；没有运行C82实现、Windows程序或完整产品构建。

本轮没有提升任何L项：原多profile、必要变体、4329B0两个具名子谓词、L07当前同版消费者和实际目标条件保留。下一步按[LF剩余项](../analysis/capability-first-v1/launcher-functional-specification.json)补会改变必要操作的来源，随后审定其余能力；不重复MP已闭合边或泛化任意重入组合。统一门槛、40/81/37/10/6和stage306保持。缩短时间来自证据复用与共享核心减返工，尚无可靠总工期。

<a id="map-functional-specification"></a>

## G04成规，保留已实现算法并登记真正差异（2026-11-10）

36操作覆盖地图/缓存、阻挡、逆投影、普通移动和纠正。方向候选/回退、100容量、batch2、缺块等待、局部插值、独立键鼠500ms已有源和现有核心，不重写为A*或重复新增timer。

MF-D1在D2修复纠正先旧窗口的顺序；MF-D2补cache namespace/持久与提交，MF-D3沿D0整合G03/G06实际上下文，MF-D4沿D5接平台范围/预算/失效。全需求分析门槛通过后才成组开发。下一组归并原登录器19操作与L01–L08覆盖；原40/81/37/10/6和全部未决保留。

[地图操作规格](../analysis/capability-first-v1/game-map-functional-specification.json) · [来源核验](../build/analysis/map-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/map-functional-specification-v1/validation.json)

<a id="audio-functional-specification"></a>

## G08功能规格审定，后续只实现已列差异（2026-11-10）

原地图/选服/战斗音乐、事件音效、停止/切换/重复已逐项映射到34项操作；初始化、环境登记/touch、MIDI/GM、流式首填/终点后发布、停止确认和进程退役一并归入8组差异。沿既有UC-P13与共享更新/lease实现，不新建第二播放器。

G08固定来源本域ready不提升X02/X03依赖、物理输出、三端或全局门槛。下一组复用G04地图/碰撞/点击/移动与回包位置修正规格作完整操作合成；只补具名必要正向边，不重跑已证音频helper或CH-U1精确指针扫描。统一A1..A4通过后才按D0–D6开发，原40/81/37/10/6范围不变。

[音频操作规格](../analysis/capability-first-v1/game-audio-functional-specification.json) · [来源核验](../build/analysis/audio-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/audio-functional-specification-v1/validation.json)

<a id="browser-surface-observations"></a>

## A4的具体表面差异已测，转回必要源语义（2026-11-10）

AH-U2的所选桌面codec/font/canvas/audio字段已有实际实验，不再作为整包未知驱动重复测试。AS-D1..D6分别归D0/D5，已有手动PCM和严格编码表继续复用；未以系统decoder替换它们或新增产品功能。

下一步先按CH-U1原约束检查459BC0/923C40已有正向初始化/alias/registration材料，只在存在实际正向边时补REA；无边则保留未知，转其他必要业务。完整资源预算、A1准入/A3和真实目标仍须关闭，统一门槛后才按D0–D6开发。

[实测档案](../analysis/capability-first-v1/browser-surface-profile.json) · [来源与约束](../build/analysis/browser-surface-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-surface-conformance-v1/validation.json)

<a id="browser-host-observations"></a>

## A4已有实际浏览器证据，接口实现仍待统一门槛（2026-11-10）

本轮用独立原创夹具实测10组原语及13组真实File读取，复用已安装Playwright1.64.1/Chrome156，不再只写宿主待测清单。正常关闭并重开浏览器验证同origin提交/回执；新boot不等于产品更新接管。

下批仅补AH-U2具体codec/font/canvas/audio字段和具名A1/A3源缺口。完整资源预算、未知提交/损坏/突停恢复、WeChat positioned FS/journal及真实设备仍需各自证明；既有40/81/37/10/6、G15/G17及D0–D6统一门槛保持。

[宿主档案](../analysis/capability-first-v1/browser-host-profile.json) · [本轮约束](../build/analysis/browser-host-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-host-conformance-v1/validation.json)

<a id="required-entry-admission"></a>

## 入口台账收敛，下一步测宿主条件（2026-11-10）

647限定根逐条保留事实/上下文、共享机制、导航和业务待定处置，72审查直接复用。39旧wire-producer中已有21个生产者上下文，不能按旧泛化缺口再次追39套调用者；台账29个正向context关联根包含相关调用点。436无primary typed绑定只是指定扫描结果，不是未分析函数或缺失玩法数量。

A1限定盘点复核完成，完整准入及A3仍开放；A2覆盖审定保持。下一项采用既有14端口/62方法合同做A4宿主实测，分别记录范围偏移、预算、提交/取消/恢复及生命周期。只为UC-U1/U3等具名必要未知补源；统一门槛后按D0–D6开发差异，原需求不删减。以下旧下一步以本节为准。

[入口台账](../analysis/capability-first-v1/entry-admission.json) · [来源与规格](../build/analysis/required-entry-admission-v1/specification.json) · [本轮核验](../build/analysis/required-entry-admission-v1/validation.json)

<a id="required-context-contract"></a>

## 共用接口已具体化，A2覆盖台账审定（2026-11-10）

已逐条保留原37全文/10完整行为及原primary映射，形成47行有效处置。110显式解析类/24token仍是限定范围，不被升级为所有原生可达类或正常服务器输入穷尽。12/267、435000、29/32与特殊0x62不再作为缺体任务；source107原word/格式与ITM/98FF已知规则按D4差异处理，真实RID/scratch/105共享cursor等origin缺口保留。

A2“每能力有可追溯覆盖、已证/缺证分栏”的台账条件已审定，A1准入与A3必要语义仍开放。CA-N2共同接口边界已从草案归并为14接口/62方法、8类型、3状态表、14失败条件和3目标profile；宿主参数/实现/真实接受未完成，不能据接口数估完成率或可靠总工期。

下一步处理A1必要入口准入台账，直接复用已有72审查和647限定根/来源图，逐条给出已对应需求或不适用理由。只有真实仍未绑定且必要的正向业务边才补REA，不重查已审体、不为全别名证明递归。UC-U1/U3具名源缺口与U4宿主参数/一致性、U5开发和U6外部接受分别推进；统一门槛后按合同复用stage306进入D0-D6。

[共同接口合同](../analysis/capability-first-v1/shared-target-contract.json) · [47行范围复核](../build/analysis/required-context-contract-v1/reconciliation.json) · [本轮核验](../build/analysis/required-context-contract-v1/validation.json)

<a id="mail-operation-composition"></a>

## 邮件操作与下一组共用合同（2026-11-10）

本轮完成原G20的50项客户端操作、14组来源规则、9组有限差异和27项未执行条件。选择器/资料/重置、经典回复/草稿、现代缓存初始化/活动行/清理，以及角色bank/存储目录/双缓存的组合已成表，原CA-N3在这些所选交点不再作为重复函数分析任务。

发送者最终投递/失败/拒收/撤销及附件结算仍无同版关联，保留为MM-R1，不删除原结果要求、编ACK或以本地结束代替成功。G20整域ready=false；G15/G17保留，统一门槛未过，产品stage306不变。

D0/D3 把 Item 三类来信、未读页、两份持久缓存和本地发件历史合入同一邮件规格。普通与宠物提交共用记录和保存规则，后续沿同一组用例核对。MM-R1 补证从可关联请求的结果或附件变更开始。 [来信与发件历史](game-static.md#legacy-item-mail-history)

下一组按CA-N8审定原37历史复合要求/10消费者上下文的必要变体及D0共同所有者/时钟/输入/持久化/更新接管重启合同，复用已成规G02/G15/G17/G20客户端规则。停止已知mail formatter/decoder/4E1CF0和通用辅助的重复取证；只补会改变实现的必要正向来源。

[邮件操作规格](../build/analysis/mail-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/mail-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/mail-operation-composition-v1/validation.json)

<a id="chat-operation-composition"></a>

## 能力规格先行与G15成组差异（2026-11-10）

执行顺序为：40能力清单→必要源逻辑/协议/状态→逐能力操作规格与差异→共享所有者合同→统一A1..A4→D0/D3/D5等成组实现→薄端适配→真实验收。同一辅助规则只取证一次；补证须回答会改变实现的具体问题，已满足原需求的能力停止扩展，按剩余规则缺口评估工作量，不能按函数/文档数量估工期。

本轮G15固定37c4原范围36项操作已合成，12组规则/8组有限差异和24项未执行验收条件就绪。现有map-chat、文本、actor及world/session/Page所有者已经存在；复用35模块定位和旧完整源体，不重做已有功能。G15局部规格ready由false推进为true，G17保留，G02材料来源及其它必要缺口不变。

下一步按现存40能力清单推进G20所选邮件操作/选择器及CT/IC/RP合同，已知聊天formatter/decoder/CRT不再重挖。统一门槛未过，不新增产品功能。工期收益来自减少重复分析、状态返工和三端重复实现，当前不以未经验证的百分比或总时长代替剩余缺口。

[操作规格](../build/analysis/chat-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/chat-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/chat-operation-composition-v1/validation.json)

<a id="game-application-exit"></a>

## 正常应用退出与日志边界已成规（2026-11-10）

已沿实际PE入口、消息泵/游戏清理、WinMain和CRT退出序列关闭选定正常生命周期源问题。FEEF30程序日志条件关闭/清槽、标准流刷新尝试及最终API边界分别登记，不能用注销/main7/B或同步session close替代。6新规范/8旧规范与6独立指令视图分列，9次函数请求含3次未定义结果，停止继续扩展CRT。

534354仅已证初值1/渲染读者；原G15没有已准入的用户气泡配置操作。别名/发布未知保留正向发现条件，不以单一读者推无写者，也不把潜在设置当新需求。CA-N4/CO-R2所选退出部分由本规则承接；247byte未激活片段仍条件未证。

后续用已有发送节流/接收发布、输入/角色/连接恢复和绝对/elapsed时钟差异完成G15原范围操作表，继续G20选择器及共享宿主合同。文件log/资源物理收尾归D0/D3/D5，真实接受另列；A1..A4及完整目标仍未通过。

[退出规格](../build/analysis/game-application-exit-v1/specification.json) · [原件与来源](../build/analysis/game-application-exit-v1/source-views.json) · [本轮核验](../build/analysis/game-application-exit-v1/validation.json)

<a id="character-operation-composition"></a>

## 角色域原范围操作已合成（2026-11-10）

G02“角色资料、创建确认、删除等待、升级/选项、选角入场”已归24行操作/状态表；旧post-login/creation remaining不再驱动重复分析已存在的character-options。33份完整旧REA经现装6.7.0记录工厂验证，17,651字节/4,940条LLVM指令匹配固定37c4，无新函数查询。

所选原始规则剩余一项具名缺口：类别7升级材料923C40的生产/所有者。仅有正向初始化/别名/注册或模块来源时继续；精确指针只有一处读取不能证明无写者，也不能以空值替代。CT重置/持久化、预览、输入/晚到政策及删除等待呈现归CH-D1..D4/D0/D2。下一独立工作为534354配置发布/必要退出与其余必要状态/宿主合同；停止通用G02前沿重复复核。

历史 Item 的状态 7 注销提示和状态 13 升级发送分别绑定到各自调用。G03 的 D0/D2 复用现有会话所有者，补发送后采样、会话时长阈值及四类结果的退役和确认时点。G02 的类别 7 资料继续沿 CH-U1 跟踪实际初始化、别名或配对模块写入。 [注销状态](game-static.md#legacy-item-logout-clock) · [升级资料范围](game-static.md#legacy-item-upgrade-buffer-provenance)

D0/D2 纳入 Item 的接收、待切换状态发布和帧派发次序。验收发送前收到结果、同一轮相反结果以及待切换覆盖。类别 7 后续沿新的实际写入继续补证。 [升级结果用例](game-static.md#legacy-item-upgrade-result-flow)

D0 复用升级与注销的发送队列证据，分别核对接纳、容量拒绝和写出裁减。D2 按来源验收升级提交返回、等待窗分配及结果到达的独立顺序。 [提交与等待规格](game-static.md#legacy-item-upgrade-submit)

X02 的普通帧后段已核事件清理、长按位、绘制列表排序与命中。`4874D1 → 56F787` 归入 D0/D3 的指针与绘制规则。复用现有排序并加入预留槽和点击读取用例。99 行窗口表的实际回调仍沿具名调用来源补证。 [所选帧规格](game-static.md#legacy-item-frame-hit-selection)

固定体删除只到等待，工作服务端删除和现行同版/设备/真实接受仍未证明。G02整体就绪及全局门槛保持未通过，原范围不缩减；G17此前局部功能规格就绪不受影响。

[操作规格](../build/analysis/character-operation-composition-v1/specification.json) · [已有源视图](../build/analysis/character-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/character-operation-composition-v1/validation.json)

<a id="capability-specification-audit"></a>

## 当前规格审定与下一批次（2026-11-10）

先完成全需求盘点和可实现规格，再按共享所有者成组复刻的顺序保持。当前40项均有原范围对应的工作判定；G17固定37c4六项功能规格就绪，其依赖与完整接受没有提升。A1入口准入、A2/A3必要操作/上下文合成和具名来源、A4目标宿主合同仍开放，不能把现行游戏消费者缺证简单归为“账号未验”。

后续依次：用已有完整来源合成G02角色操作与G20选择器重置；定位534354配置发布/必要退出的正向边；按确切入口队列审核需求/不适用；审定原37/10战斗上下文和D0宿主合同。4E1CF0、XML、已证补丁来源、数量/占用、12/267、435000、29/32和0x62停止重复取证。另一套激活、资源/菜单及247byte片段只在新正向证据出现时扩展。

真实账号、设备和官方接受后续分别验证；当前无测试账号，先推进不依赖它们的工作。没有产品变化时仅核证据/文档；统一门槛后复用stage306，按D0–D6补差异并按能力组验证。预期节省来自共享取证/实现和减少返工，尚未量得项目节时比例或剩余工期。

[当前逐能力审定](../build/analysis/capability-specification-audit-v1/specification.json) · [来源补充](../build/analysis/capability-specification-audit-v1/supplemental-source-views.json) · [本轮核验](../build/analysis/capability-specification-audit-v1/validation.json)

<a id="capability-first-workflow"></a>

## 先分析全部需求能力，再按依赖复刻（2026-11-15 复核）

按完整操作核算需求覆盖，按共用规则核算分析量，按现有模块的唯一差异核算开发量。收包、状态、窗口和资源等规则取证一次，关联的登录器和游戏功能共用。开发从已验证的 stage306 入口接线，业务核心实现一次，三端各自补宿主接口。

先把登录器和游戏的全部需求按完整用户操作排清，再用 REA 确定原版行为，同时用宿主资料和本机回执确认网页、移动网页和微信的实现条件。40 项能力沿现有矩阵核对覆盖，按共用规则成组处理。补证深度由会影响行为、接口或验收结果的具体问题决定。全部规格通过 A1–A4 统一复核后，按 D0–D6 的依赖开发。

全量覆盖按需求操作核对。每项操作沿「需求编号 → 原版入口 → 行为规则 → 现有模块和实现差异 → 验收用例」交接。同一规则的来源、共用用例与共享差异在负责模块的原规格中登记一次。引用该规则的能力只补各自不同的触发条件和预期结果。规则足以决定实现和预期结果时结束该项取证。后续发现会改变规格的证据时，只复核受影响的操作和依赖。

排程以待判定的规则为单位。每批先对账现有证据，再合并读写同一状态、使用同一回调或共用同一接口的问题。能从现有证据决定实现和预期结果的规则直接交接。剩余问题按样本与具名入口集中用 REA 补证，优先处理会解开下游能力的规则。每组共用证据索引、规格和验收输入。 [当前排程](#capability-first-scheduling)

先对六组做一次完整对账。每组从原需求列出待判定的规则，明确哪个结果会改变哪项实现或用例，再安排查询。已有材料的组在这些问题都可交接时结束。等待材料的问题保存恢复条件并从可执行队列移出，统一准入仍核对它们对实现的影响。新发现沿受影响的原操作补入六组，以同样条件重新核对。 [待补范围](#capability-first-scheduling)

遇到缺少同版样本、实际入口或服务结果的必要问题，在原需求记录被挡住的决定、已尝试的来源和恢复条件，再推进下一项可查规则。取得新样本、具名调用边或适用回执后回到该项。宿主和服务的实际验收先写通过条件，随 D5/D6 执行。需先确认可行性才能决定共用接口的宿主问题归 A4。

| 顺序 | 工作 | 结束条件 |
| --- | --- | --- |
| 1 全量盘点 | 以现有 40 个能力域为基线，沿登录、选服、入场、场景、战斗、退出和恢复等完整操作，对齐原始需求与菜单、窗口、协议和资源入口 | 每条必要入口有能力归属或有证据的不适用说明。需要取证才能判定的入口归入对应规则组，随该组复核 |
| 2 复用并集中 REA | 按样本 SHA、分析配置和入口查找留存证据，索引缺项时核对历史原记录。沿同一入口或共享规则成组补证 | 每条新增证据回答一个会影响必要行为的问题，受影响能力引用同一份规则 |
| 3 编写能力规格 | 为每个必要操作写清输入和前提、协议或资源、状态所有者和时序、输出、失败、取消、重入与恢复。附来源版本、验收用例、现有实现及差异 | 开发者能从规格决定实现和预期结果。事实、推测和待验证各有标记，必要缺证继续留在原能力 |
| 4 合并设计与统一准入 | 汇总共用状态、时钟、资源、传输、存储和平台端口，按 A1–A4 复核全部能力 | 需求发现与必要规则闭合，依赖、接口、目标宿主约束和用例明确。每项差异有一个负责模块和主批次 |
| 5 按 D0–D6 开发 | 复用符合规格的 stage306 模块，按底座、登录交接、游戏状态、普通业务、战斗、宿主接入及联合验证组织已登记差异 | 共享逻辑实现一份，三端接各自的宿主接口。每批验证完整业务及受影响的共享边界 |
| 6 逐层验收 | 分别验证共享实现、本地产品、网页、移动网页、微信及当前同版官方行为 | 各层按实际证据验收，缺账号、设备或同版材料的结果继续待验证 |

提交补证前，在原操作写明待判定问题、各答案对应的实现或用例，以及可查的样本和入口。先按样本 SHA-256、分析配置和 `procedure.address` 查留存档案，核定函数范围。同版同配置仍缺的入口尽量在同一次载入处理。缺少解包、取证或离线对照工具时随该组补齐。 [当前缺口及顺序](#capability-first-scheduling)

按规则组完成一次交接。原规格维护行为、实现差异和用例，能力矩阵引用各自适用的规则。开发计划更新批次归属和下一项，验收记录引用实际回执。对照输入、实现版本和宿主均相同的用例共用结果。来源版本、需求范围或共用接口变化时扩大核对，统一准入时复核全表。 [选服规格与差异](launcher-static.md#f5a-profile-list-projection) · [本批来源核验](validation.md#f5a-note-modal-admission-validation)

L02、L04、L08 的 D1/D5 将筛选、备注、置顶、组内移动、重置与单次撤销沿同一个候选及重建入口接线。复用原 SP-C07、SO-C04 至 SO-C11 的用例，补入 F5A 的控件展开与清查询、拖动落点、备注取消和恢复回执。实际窗口与同版游戏沿原验收。 [候选操作共用规格](launcher-static.md#f5a-candidate-management)

### 分析门槛与交付门槛

| 门槛 | 开发前需要确认 | 留到相应实现后的证据 |
| --- | --- | --- |
| A1 需求发现 | 所需入口、条件能力、来源版本与需求归属完整 | 新材料若改变范围，更新受影响规格与依赖 |
| A2 覆盖与所有权 | 全能力规则台账、生产/消费链及共享所有者可追溯 | 目标实现是否正确遵循这些规则 |
| A3 可实现规格 | 全部必要操作及失败/取消/重入规则有依据，影响实现的未知已解决 | 完整产品组合、运行与恢复接受 |
| A4 设计与宿主约束 | 共同接口、资源/网络/生命周期约束、可行性证据、批次依赖和验收方案足够明确 | 完整三端SDK/设备效果、性能预算及官方联合接受 |

分析阶段定下同版必要规则、宿主可行性、接口及验收条件。当前同版游戏读取启动信息的规则缺证，属于 L07 的分析缺口。测试账号缺失影响 D6 的真实会话执行。完整产品流程和真机沿 D5 验收。统一门槛仍待通过，产品处于 stage306。

### 已有规格与补证条件

各能力组的当前取证顺序由[下方排程](#capability-first-scheduling)维护。共用状态和接口以各自的规格为准。

D0/D3 在同一个经典窗口所有者落实所选普通对话的帧钩子、当前控件参与、治疗提示和退役。OS-D5 与 OS-D7 复用已证的控件动作和回复字段。第二套窗口帧分派仍按训练、工艺和图鉴的具名入口补证。 [共用规则与实现差异](game-static.md#legacy-classic-dialog-frame-hook)

11 月分发版的登录入口已绑定模板 133、普通按钮和 `0x8242`。D1 在现有登录所有者内处理按编号投递、无回复断线的定时器重试及错误结果恢复，沿用按尝试标识退役。提示中的实际消息、退出及同版会话接受继续按原范围核验。 [11 月版登录入口](launcher-static.md#f5a-login-owner) · [重试与退役规格](launcher-static.md#f5a-disconnect-retry)

D0/D1 共用 F5A 的候选遍历、定时器截止及解析任务退役规格。按同一组用例验证候选环回、截止时已有结果、取消先到和工作线程先到。D5 验证宿主的调度结果与迟到事件。 [候选与期限规格](launcher-static.md#f5a-candidate-lifecycle)

D0/D1 将 C82 与 F5A 的阶段时钟归入 LS-D2。DNS 截止和通道提交各有明确先后，D5 与既有退出流程共用调度失败、计时器投递、提示返回时的忙态和关闭回执用例。实际消息与会话重绑继续沿 LS-U3。 [两版共用规格](launcher-static.md#launcher-login-timer-dispatch)

L03、L08 和 X06 在 LS-D3 共用固定 F5A 的接收、断线、停止和退役规格。复用 10 份 REA 函数档案，补查 4 个决定维护准入和释放的函数。D0/D1/D5 沿现有会话身份验收关闭未完成、旧回执迟到及新尝试继续。实际提示期间的新绑定沿 LS-U3 和各版宿主证据核对。 [来源、复用与用例](validation.md#f5a-pump-retirement-validation)

登录报错、自动提交与普通确认沿同一 LS-D3/LS-T20 交接。D1 按输入生成与送达时的各自条件处理普通及编号提交，D5 核实际提示、入队、送达和关闭回执。已核两处原程序普通确认的投递。 [固定 F5A 准入](launcher-static.md#f5a-ordinary-input-idok)

1. **同版交接和共用底座。** L06 已核已安装补丁器身份及 11 月版回退路径、备份启动和 102 重试。后续补实际回退制品和运行中子进程身份。L07 已核 11 月分发版的普通创建、七组枚举和标题转换，现有共享入口已用 Windows 的实际匹配行复核顺序。后续沿同版游戏读取和实际启动器大小写环境取证。X03 已测桌面双版本存储、实际 ZIP 共存工作集及受控配额下的中止和重试。继续补实际产品持久化联动、完整场景与三端生命周期。 [补丁材料](launcher-static.md#installed-patcher-association) · [回退规格](launcher-static.md#f5a-patch-fallback) · [Windows 资源参数](launcher-static.md#windows-installed-resource-enumeration) · [历史资源交接](game-static.md#legacy-resource-handoff) · [工作集](architecture-and-milestones.md#desktop-resource-working-set) · [配额核验](architecture-and-milestones.md#browser-update-quota)
   X03/X04/X06 已核移动 Safari 模拟器的旧资源租约、进程重开、实际桥接后台收包、登录到期、取消和独立重连。D0/D5 将这些边界与桌面流归入同一组用例。长时后台、完整产品、真机与微信继续验收。 [移动存储与重开](architecture-and-milestones.md#mobile-safari-resource-lifecycle) · [移动连接](network-portability.md#mobile-safari-stream-lifecycle) · [桌面连接](network-portability.md#desktop-stream-lifecycle)

   L07 和 G01 的历史 Item 与 SE 共用资源输入和路径选择规格。D1 传递原顺序的参数行，D0 复用已有共享计划处理配置首行、首个匹配和坐标别名。以实际 Windows 行复核的历史路径投影仍与原 42 条参考一致。 [Item 来源与共享规则](game-static.md#legacy-item-resource-handoff) · [实测行对照](validation.md#windows-installed-resource-enumeration-validation)

   L07 补入固定 Item 的初始化与选服读取、字段保留和发布顺序。D0/D1 复用启动上下文，覆盖缺前缀、原字段为空和完成选服的路径。G02 的 D2 按 `Wb^` 更新实时类别，类别 7 资料继续沿 CH-U1 追来源。 [交接与角色类别](game-static.md#legacy-item-startup-handoff)

   L07/L08 将 F5A 的同名复用、首次登记、异常错误 8、按名退役和析构清理归入现有 D1/D5。D6 核对实际映射与进程回执、仅刷新锁存和实时值的顺序，以及当前游戏读取。 [发布及退役规则](launcher-static.md#f5a-mapping-lifecycle)

   L07 已核 F5A 的独立命令行和映射载荷。D1 复用路径引号、原始字节和数字格式化规则，按显式应用名及分发版输入组装。验收构造零值、状态 0 回复写入、32 位调整的边界及输出顺序。实际 Windows 回执和当前同版游戏读取继续取证。 [字段来源与组装](launcher-static.md#f5a-handoff-number-origin)

   L03、L07 与 L08 复用同一回复准入和候选确认。D1 先核形状、忙态和待关闭，再按空结果与非空结果分派。普通阶段 3 的非空路径先写交接数字，再核唯一候选与显示行；自动和手动共用阶段 4 的确认。D5 实测重入、选择和实际进程回执，当前同版消费沿 L07/X07 核验。 [准入](launcher-static.md#f5a-status-zero-admission) · [确认与交接](launcher-static.md#f5a-result-selection)

   D1/D5 在同一启动用例中核对创建回执、托盘失败后的可见界面、任务槽和重新准备。若准备时仍是已尝试的同一编号，则跳过投递。普通预设应用通过准入后才换编号，D1 复用现有提交所有者，D5 验证根窗禁用和迟到消息。LS-U3 继续验收实际投递和新绑定。 [普通返回顺序](launcher-static.md#f5a-start-return) · [编号与预设规则](launcher-static.md#f5a-preparation-generation)

   X03/X04 的移动 Safari 已实测同一实际 ZIP 的两份资源库、超过 2 GiB 的偏移及退役后的参考帧。D0 复用现有范围读取和所有者关闭顺序，继续补持久化后端、不同版本共存和真机容量。 [移动 ZIP 实测](architecture-and-milestones.md#mobile-safari-resource-archive)

   X03/X05 已核微信开发者工具基础库 3.18.0 的定位读取、旧描述符和页面导航。单个 App 的主包与普通分包可复用已有缓存写入者，修订冲突和重开恢复已有回执。后续补通用发布历史、真机容量、TCP 及产品端口。 [微信模拟器实测](architecture-and-milestones.md#wechat-devtools-offline-sdk) · [双槽核验](architecture-and-milestones.md#wechat-sdk-slot-store)

   D0 在通用发布入口绑定活动根身份和修订，D5 复用微信现有单 App 写入者和实际回调边界。用同一组案例核对同号旧根被拒和迟到回执排空后的权威读回。App 崩溃后的发布意图恢复沿 UH-U02 实测。 [微信重建核验](architecture-and-milestones.md#wechat-sdk-cache-recovery)

   X05/X06 已补微信 TCP 方法和回调实测。两次本机建连均失败，D5/D6 待具备连接条件的 SDK 或真机完成字节收发、取消及远端关闭用例。 [实际 SDK 回执](network-portability.md#wechat-devtools-local-tcp)

2. **共用业务入口。** G12 复用固定 SE 与 Item 的普通训练十模式。另一套窗口在 G12/G18/G19 的正常激活和帧分派继续沿可核的注册或调用边追证。两版经典图鉴由 D0/D3 共用活动槽、首次按下、延后创建和选中行规则，SF-A27 覆盖按钮与快捷键同帧。图鉴输入表到窗口 23 的局部调用等待主循环的正向调用证据。B02/B03 复用已核的技能 105 游标、进退场及角色结果队列规则。D4 补证集中于会改变实现的生产者暂存和其它必要角色上下文。 [经典图鉴](game-static.md#legacy-se-classic-album-ingress) · [输入表边界](game-static.md#legacy-item-album-key-registration) · [普通训练来源](game-static.md#legacy-item-training-ingress) · [战斗结果来源](game-static.md#battle-result-tuple-lifecycle)

   D0 复用 Item 鼠标事件、键盘消息与帧末清理，以及窗口恢复请求的已证顺序。主状态 9、子状态 3 的键盘读和经典回调已接到同一帧。D3 的训练、工艺、图鉴沿实际调用者、注册者或同版材料补另一套窗口的回调准入。 [窗口恢复与帧证据](game-static.md#legacy-item-window-admission) · [普通键盘状态](game-static.md#legacy-item-keyboard-frame)

   D0/D3 已取得 Item 八个工作窗口的非活动清理规则，复用原工作上下文和 `+5D` 解除请求。窗口 19、29、30 的用例按配对打开、主槽返回、非活动清理及同步恢复分步核对。继续沿实际帧调用者补活动状态的来源。 [工作窗口退役](game-static.md#legacy-item-work-retirement) · [配对窗口顺序](game-static.md#legacy-item-work-window-pair)

   D0/D3 补入 End 的首次事件、任一槽非空的关闭请求、Escape 同步恢复和状态 11 的创建顺序。训练、工艺及图鉴沿既有合同复用槽位规则，实际回调分派继续补证。 [普通槽位生产](game-static.md#legacy-item-normal-slot-producers)

   D0/D3 共用固定 Item 的经典帧顺序表。保留新建时的 `-1` 回调、活动表整理、输入值逐窗传递、帧前退役和训练收包同步组关闭。按实际窗口组核对影响范围，并覆盖 End 与工作时钟在各子状态的位置。另一套窗口继续沿正向调用证据补齐。 [创建、更新与关闭](game-static.md#legacy-item-classic-callback-order) · [子状态顺序](game-static.md#legacy-item-classic-frame-dispatch)

   G12 与 X02 在 OS-D7 共用经典窗口 54 的选择等待、就地回包、关闭和退役规则。D0/D3 复用现有训练资料与选择入口，由同一个窗口所有者处理状态差异，OS-A24 覆盖普通及扩展两条训练流程。 [来源和用例](game-static.md#legacy-pet-training-wait-owner)

   D0/D3 将训练、工艺和图鉴的经典打开请求接入共用过渡流程。验收按实际对象更新次数推进，覆盖同号重复完成、分配失败后同步创建及组关闭与图形回收各自的触发条件。 [共用打开与回退](game-static.md#legacy-item-classic-open-transition)

   D0/D3 同时核对所选普通帧的到期顺序。原版在本次扣时前检查解除资格。用剩余 1 毫秒、一次扣减 1 毫秒的用例验证，归零当次保留上下文，下一次符合条件的更新发送解除，配方归属失配时随后查询普通槽。 [两版顺序与现有差异](game-static.md#legacy-work-context-frame-order)

   D0/D3 合并经典工艺的工具栏与快捷键、技能和等级选择、配方归属与最后一个窗口的退役。现有配方表和请求包装沿用同一份用例，覆盖发送后进入配方页、回复到达时记录归属，以及活动指针清除前的重查。 [经典工艺来源](game-static.md#legacy-item-classic-work-recipe)

   D0/D2/D3 合并固定 Item 的经典窗口重建用例。由既有窗口、状态和工作上下文所有者处理关闭回调、工作解除、按标记恢复及重读子状态后的计数更新。四项能力引用同一份来源合同。 [经典窗口重建](game-static.md#legacy-item-classic-window-reentry)

   G05、G10、G12 与 X02 复用普通 `Q?m` 的一条收包规格。OS-D2 沿现有对话和角色所有者验首次打开、重复来包指向另一角色、替换、匹配关闭及目标缺席。当前同版和重合坐标的实际读值按来源补证。 [共用规格和用例](game-static.md#legacy-dialog-actor-facing)

   X02 的窗口状态持有一份窗口 1 恢复标记。G03 与 B01 复用同一个活动判断，在普通帧动作和所选入场回复时保存，按恢复入口决定清除时机。 [恢复标记规格](game-static.md#legacy-item-window-one-restore)

   D0/D2/D3 共用角色槽发布、当前槽清除、邮件重载和图鉴消费用例。入场覆盖个人文件缺失时的提前返回，摘要覆盖空位图组后的版本发布，详情覆盖重复记录的新发现标记。 [角色资料规格](game-static.md#legacy-item-album-mail-lifecycle)

   非反射 106 的指针来源和低等级 116 的结果区重叠已定位。D4 继续补实际运行值、恢复和其它生产者暂存。 [独立结果身体](game-static.md#battle-detached-rid-context)

   SKL266 变体 2 在 BF-D7 共用依赖计数、来源上下文和结果四格。BF-T36 使用同一组用例核两次测距、同回调退役、慢速摘链、护卫和施法者各自的队列与结果。相邻帧已核清理条件、前序命令等待和所选长接收分派。前序对象实际写入、原版完整播放和槽替换继续按具名证据核验。 [长接收](game-static.md#battle-266-long-receive) · [退役与结果](game-static.md#battle-266-relay-retirement)

   G02 已核历史 Item 的图形目录、内容代、升级发送与回复，以及删除等待。D0/D2 共用资源索引。类别 7 的资料生产与实际服务器删除留待正向来源。 [角色操作来源](game-static.md#legacy-item-character-operations)
3. **明确交付前的验证条件。** 网页、移动网页和微信的必要宿主能力在设计阶段确认。完整设备、账号和同版官服流程在对应实现后验收。

一个能力达到“每个必要操作可说明输入、状态变化、输出和失败/退役结果，并有来源及对应案例”即停止该范围补证。新的矛盾或必要调用上下文再打开受影响部分。若关键材料确实不可得，明确受阻规则及其依赖，继续其他分析；保留原需求和统一门槛未通过状态。

<a id="capability-first-scheduling"></a>

### 当前分析排程

从能力矩阵复核 40 项需求。19 项已有固定样本本域规格，直接核对来源适用性、共用依赖和现有实现。其余 21 项沿下表把尚待判定的规则和宿主条件归入各组。X03–X06 已交接资源和连接组合用例，固定 SE 已交接战后结果窗和所选宠物资料与训练报价规则。L07 的同版游戏消费沿原条目等待适用证据。 [同版源材料缺口](known-issues.md#current-game-handoff-evidence)

普通换图、战斗回场和工作窗已共用 GF-A10、GF-A11、GF-A18、WT-A02、WK-T23 的帧规则。经典邮件复用同一窗口重建和占用合同，所选草稿及子窗规则沿 MM-D3/MM-D7 交接。第二套窗口仍沿 WK-U1、OS-A26 跟踪实际入口，邮件最终结果沿 MM-R1。 [共用帧规格](game-static.md#fixed-se-shared-scene-frame) · [经典邮件](game-static.md#fixed-se-classic-mail-reopen)

| 能力组 | 对应需求 | 优先产出 |
| --- | --- | --- |
| 三端共用底座 | X03、X04、X05、X06 | D0 共用资源候选发布、启动身份和旧读者排空，保留三端的宿主回执。完整微信素材已有跨进程临时段读回和缺段补选依据。UH-U02/U04 继续决定完整持久根可用容量和恢复输入，产品接线、实际设备连接及生命周期沿 D5。 [分段恢复](architecture-and-milestones.md#wechat-sdk-segment-process-reopen) · [宿主流程](network-portability.md#target-game-page-lifecycle) |
| 窗口、输入与业务恢复 | X02、G12、G18、G19 | D0/D3 共用经典打开、恢复帧两遍更新、占用和关闭规则。第二套窗口将 OS-U1、WK-U1、SF-U1 的活动值和新旧窗次序合为一次取证。取得读取同一登记表回调列的正向调用、适用运行记录或配对模块后核活动首参及业务准入。 [恢复帧](game-static.md#legacy-item-double-window-frame) · [共同取证入口](game-static.md#item-alternate-dispatch-candidates) |
| 版本、登录与游戏交接 | X01、L01、L03、L06、L07、L08、X07 | D0/D1 共用配置、启动生产、登录时钟、更新接管和退役。LS-U3 按正常投递和能改变活动绑定的具名路径补证。GP-U01 需要实际回退制品，L07/X07 需要同版游戏读取命令与映射的正向证据。`Kh>` 和 `Ok?` 沿原业务归属继续等状态读者和配对回复。 [接管规格](launcher-static.md#f5a-update-handoff-and-ack) · [同版证据](known-issues.md#current-game-handoff-evidence) · [待定收包](game-static.md#fixed-se-receive-operation-admission) |
| 资源与战斗 | G06、B02、B03 | D0/D2 复用两版启动档位、设备创建、准备、降档写入与窗口恢复。图形只跟影响所需输出的具名覆盖或设备来源。BF-D7 已核护卫空槽和替换位置的消费条件。BF-U1 沿实际角色登记、帧暂存写入和触发回执核动作续接。 [启动档位](game-static.md#legacy-render-startup-tier-input) · [护卫槽消费](game-static.md#battle-266-guard-slot-consumption) |
| 角色与邮件 | G02、G20 | 两版升级的空字串构帧、等待、角色清零与邮件发送前资料规则可接原 D2/D3。CH-U1 在发送前取得材料初始化、写入或配对模块后确定字节所有者。MM-R1 在取得同版业务回复后核发送结果和附件结算的对应顺序。 [升级规格](game-static.md#legacy-upgrade-empty-material) · [邮件规则](game-static.md#fixed-se-classic-mail-compose-controls) |
| 全量复核 | X08 | A2 继续用现有 40 项覆盖台账。A1 和 A3 沿上面的必要业务入口与规则复核，A4 按共用接口和已测宿主条件审定。全规格通过后按 D0–D6 开发。真机和真实会话沿 D5/D6 核实际结果。 |

G01/G03/B01/B04 与 X02 共用一个延后动作字和一组恢复用例。D0 处理入场和回包的写入顺序，D2/D3/D4 复用淡出回到 `9/1`、动作 3 清标记和定时入口选择经典 39 的案例。第二套窗口表的实际调度继续沿原 X02 缺口补证。 [两版共用规格](game-static.md#battle-window-restore-order)

窗口组已把固定 Item 和 SE 的定时提示接到实际创建、文字及退役。D0/D2/D3/D4 复用现有场景标签和帧入口，以一组用例核对创建延迟、两次音效请求、零计时清过渡、绝对时钟回绕及到期后清活动指针。 [本批规格和复用](game-static.md#legacy-scene-label-window)

每组先用适用的成功、失败和恢复路径核对现有规格。同一样本及配置的必要查询集中执行，可用时共用已核验的分析会话。优先处理有材料且影响多个开发批次的规则。X02 的输入、窗口和调度被 8 项能力直接依赖，X03 的资源发布与恢复被 4 项依赖，X06 的连接状态和退役被 5 项依赖。先在各自的共用规格中确认一份规则，再由训练、工艺、图鉴、登录和平台适配等操作引用。各组可以先完成有证据的操作，剩余材料按对应规则继续跟踪。

| 核对结果 | 下一步 |
| --- | --- |
| 已有证据可判定行为 | 对照 stage306 的实际入口。符合规格的实现直接复用，差异在负责模块的原规格登记一次，关联到一个主批次和适用用例。 |
| 必要规则仍待证，且有可查入口 | 先写明要判定的结果及其实现影响。用需求编号、样本和具名入口找原记录；仍缺证时，沿最短的生产、消费或调度链用 REA 查到能决定实现为止。 |
| 必要规则等待新材料 | 在原操作写清缺失的证据、影响的实现决定和恢复条件。转入下一项具备材料的工作；相应的分析门槛待通过。 |
| 行为与宿主设计已明确，实际验收待执行 | 写好用例、环境和通过条件，随产品批次执行。三端产品与设备沿 D5 验收，同版真实会话沿 D6 验收。 |

<a id="capability-first-next-analysis"></a>

#### 当前取证与交接

第二套窗口普通帧目前等待同版调用边、实际帧回执或可配对模块。已有三个局部候选归原规格，训练、工艺和图鉴继续共用该缺口。退出现有材料可查队列，恢复时只补活动首参和新旧窗调用顺序。 [原候选与恢复条件](game-static.md#item-alternate-dispatch-candidates)

固定 SE 的 B01/B02/B03 与 G08 已将普通地图发布、停曲归零及 `10/0` 捕获清请求并入 BF-T36。所选旧请求最迟在 `10/0` 的维护触发编码，后续按各次实际写入验收暂存。D0/D4 共用声音持续启用、入战时恢复启用和捕获后恢复三种用例。 [入战顺序](game-static.md#battle-entry-audio-request)

UH-U04 已补 Chrome 的原地图、单角色、动态调色和重叠音效。同一组用例覆盖复访、音频缓冲身份和待返回图块的关闭结算，供 D0/D5 共用。其他宿主、真实产品场景和自然压力沿原用例。 [联合占用与退役](architecture-and-milestones.md#real-map-mixed-resource-budget)

G06/X03 的七组坐标索引别名、动画组和数据持有已交给 D0/D5 共用。一份私有快照和两根分别释放有实际素材对照，文件名别名顺序有固定 SE 原字节及现有实现差异。 [坐标来源](game-static.md#animation-coordinate-alias) · [快照与验收](architecture-and-milestones.md#animation-coordinate-storage)

动画缺档和坏标记的启动与首读已交接 D0/D5。主组必要文件、可选半组覆盖、正常 EOF、坐标索引跳过和宿主读取失败沿同一份规格，原版实际异常和三端产品沿验收。 [源条件与用例](game-static.md#animation-load-and-first-lookup)

下一项回 B02/B03 的 BF-U1，沿已核的动作 49 退场、221/222 登记和正常战斗调度追能否形成旧护卫晚退场。只追改变当前护卫槽及动作 24、71、217 的具名写入。 [已有登记顺序](game-static.md#battle-slot-publication-order) · [当前队列](../analysis/capability-first-v1/implementation-plan.json#/execution_review/next_available_analysis)

换机检查点保存了 SKL73、SKL72 与 SKL404 各两组正常命令入口回放。SKL73 在 stage306 的两组结果均先登记新 B，旧 B 后执行 49。接手先收窄到固定 SE 的 SKL73 正向链。 [接手条件](project-handoff.md#当前接续点) · [回放数据](../analysis/capability-first-v1/handoff-20261115/battle-slot-checkpoint.json)

固定 F5A 已核登录错误提示、自动提交、配置续接与连接入口。新增两处普通确认投递及各自的启用检查。D0/D1/D5 共用 LS-D3 与 LS-T20，实际入队送达、合资格候选、新登记和借用归还沿原验收条件。 [登录输入和恢复规格](launcher-static.md#f5a-ordinary-input-idok)

微信原创离线工程完成一次工具正常退出及新进程重开。D0/D1/D5 沿 UC-P08、UC-P10 复用小 ZIP、双槽、历史提交和新启动读回用例。完整临时段按另一次跨进程回执交接，完整持久化按实际容量继续验收。 [小包 SDK 回执](architecture-and-milestones.md#wechat-devtools-process-reopen) · [完整临时分段](architecture-and-milestones.md#wechat-sdk-segment-process-reopen)

固定 SE 商店窗 53 的报价行、预览及实际关闭已接回 A1。D0/D3/D5 沿同一份 OS-D6 规格与 OS-A18、OS-A20、OS-A21，核前一帧标记、下一帧推进、同步组关闭和换成新窗口时的归属。实际原版关窗重叠与抑制字节非零来源继续按具名证据。 [本轮来源及用例](game-static.md#fixed-se-shop-entry-admission)

桌面 Chrome 已在实际游戏页核对可信隐藏和可见事件。同一连接在后台应用了一条回复，点击继续后恢复绘制。第二次隐藏期间对端 EOF，回到前台后重选材料，建立独立连接并重新入场。移动 Safari 模拟器与桌面沿 UC-P09、UC-P11、UC-P14 共用用例，长时后台和实际产品接线按 D5 验收。 [桌面与三端生命周期](network-portability.md#desktop-game-tab-visibility)

固定 SE 启动标识的 19/23 请求已核对到选择、等待、素材读和同帧发布。D0/D2 沿 PR-D2 与 PR-A02、PR-A10 共用已有颜色算术和读、绘制接口。阶段可在跳过绘制的逻辑轮推进，活动色保留与素材重试沿原用例。 [所选启动规格](game-static.md#fixed-se-startup-palette-publication)

固定 SE 已将 `Ta>` 的调色字段、`502950` 的跟随与显式选择，以及 `451BA0` 的时段更新归入 G03、G06 和 X02 的共用规格。调色发布位于 `5028A0` 的内层捕获之后、外层画面提交之前。D0/D2 复用已有解码、时钟、CGP 和恢复帧入口。 [调色与恢复帧](game-static.md#fixed-se-scene-palette-follow)

固定 SE 的默认 16、24 位调色已核对掩码计数、更新区间、零值及精灵实际查表。D0/D2 复用已有 RD、CGP 与 RGBA 入口，沿 PR-A09、PR-A10 核对应位深。 [默认位深与上传规格](game-static.md#fixed-se-palette-output-depth)

固定 SE 的命名和内嵌表已核到实际选路、转换、上传、颜色标签和换色限额。G06、X02 共用一份规格。现有 RGBA 和资源库可复用，所选原表布局和空槽结果归同一批验收。 [显式色表与本机对照](game-static.md#fixed-se-explicit-palette-upload)

固定 SE 的窗 26 已核拖放拥有者、所选取消回调和类型 1/5 的文字焦点条件。B02、B03 与 X02 共用 BF-D1、BF-T36 的关闭夹具，沿同一帧顺序记录回调、默认焦点和暂存字来源。原版实际活动回调沿对应条件核验。 [退役规则及用例](game-static.md#battle-266-window-input-retirement)

固定 SE 的输入法组合串、候选来源和绘制已归入文字与战斗共用规格。现有量宽可复用。原版两个文字频道分别排到 210 与 226，后一优先级已登记为共享呈现的开发差异。BF-T36 引用同一份相对写入范围。 [原版规则及本机差异](game-static.md#battle-266-ime-presentation)

固定 SE 的 UTC 分钟缓存、显式日期换算和游戏日期写入已并入共用时钟。现有秒数端口与日界推进可复用。原版时区切换日的失败回退沿 BF-T36 保存实际读值的继续条件。 [日期规则与本机对照](game-static.md#battle-266-host-calendar)

商店的合资格取消已交接一份共用刷新规则。D0/D3 沿窗口修订号和原报价顺序复用现有核心，D4 共用所选战斗帧的写入范围。五份同版档案及一份派生视图可复用，本机三组旧修订号对照和 104 项回归通过。 [共用规则与回执](game-static.md#fixed-se-shop-retirement-refresh)

固定 SE 已复核 37 个 A1 收包入口，其中 34 个沿已有业务规格归属，一条地址变化提示由补证确定。`Kh>` 的实际读者及 `Ok?` 对应的用户操作按各自条件补证。 [收包归属](game-static.md#fixed-se-receive-operation-admission) · [复用与本机回执](validation.md#fixed-se-receive-operation-admission-validation)

固定 SE 的 17 个待定发送根均已归属。继续复用同一组包入口。D3 按原窗口决定宠物槽和昵称字节准备，保留称号及通用回复各自的去重、字段与准入。 [操作和本机回执](game-static.md#fixed-se-send-operation-admission)

20 个经典控件后回调已核对到 24 个窗口登记。D0 复用帧顺序、滚动和底图，D3 沿各自参与值、写回选择和可见行的时点处理业务。 [帧规则和核验](game-static.md#fixed-se-classic-post-control-frames)

41 个构造与控件前回调已核对到 42 个登记。D0 按池登记、初始化和编号指针发布的时点接线。D3/D4 共用嵌套开窗、同轮参与及已有窗口用例。 [构造交接](game-static.md#fixed-se-classic-pre-control-callbacks)

18 个经典析构回调已归入同一关闭顺序。D0 先运行所属业务回调，再清编号活动槽。位置、设置、工作和迷你邮件用既有规格交接各自的关闭和重开。 [关闭规格与验收](game-static.md#fixed-se-classic-destructor-callbacks)

经典工作所选 43 个控件已归入各业务入口。D0 共用输入、滚动和关窗，D3 接已有槽位、费用及编辑器，D4 沿已存回调处理略过。 [工作控件规格](game-static.md#fixed-se-classic-work-controls)

窗 47、65、66 已接到共用删除确认、黑名单和日志查看。D0/D3 共享窗口和输入条件，D3 沿现有过滤、名单和日志规则接读写，D5 验证目标端的实际按键、点击和日志重开。 [三窗交接](game-static.md#fixed-se-classic-modal-blacklist-log)

窗 21 的两种布局和三类名单共用窗口输入，沿各自真实槽或记录 ID 接详情、通信记录、写信、删除及名称资料。D3 归入 SF-D3 与既有邮件入口。 [名单规格](game-static.md#fixed-se-classic-contact-list-controls)

家族详窗与称号窗已核文件登记和运行权限回调。D3 复用已有家族资料、输入校验和消息编码，按原用例补整批预检、编辑焦点和撤族退役。 [操作规格](game-static.md#fixed-se-classic-family-edit-controls)

家族兽与饲料箱已落实当前选择、占用、改名和各自的收尾。D0/D3 复用输入、库存、数量与已有格式器，D5 使用同一组操作用例。 [家族兽与饲料箱](game-static.md#fixed-se-classic-family-pet-feed-controls)

银行和交易的 40 处登记共用数量、滚动、焦点和退役规格。D3 在同一物品和宠物资料入口接当前页签及报价快照，D5 复用转移、刷新和确认用例。 [银行与交易控件](game-static.md#fixed-se-classic-bank-trade-controls)

固定 SE 的邮件控件已按正文、附件和群发收进邮件操作规格。D0/D3 复用窗池、编辑器和占用，按实际控件读写收件资料和选择。D5 共用窗口切换、换选和退出用例，最终结果继续沿 MM-R1。 [邮件控件与用例](game-static.md#fixed-se-classic-mail-compose-controls)

F5A 的普通启动已核两次代码页选择、原表保留与线程刷新条件。D1 沿同一启动和资源快照交接这些条件，D5/D6 共用冷启、重新建表与标题验收用例。 [启动选表](launcher-static.md#f5a-normal-startup-locale-selection)

F5A 的辅助输入窗已核回车和鼠标确认的真实投递入口。窗口启用和焦点重查沿 D0/D1，实际投递、连接及旧借用的先后沿 D5/D6。 [普通确认生产者](launcher-static.md#f5a-ordinary-input-idok)

完整素材换版的容量、候选拒写和旧读者释放沿 UC-P06 至 UC-P09 一次交接。D0 复用现有归档和资源库，按已有接口记占用、拒写和排空。D2 运行中的场景沿已取得的资源根租约读取。D5 用同一组合用例核对新候选拒绝后旧根仍可读、晚到读取结算、最后释放与重开，并记录实际宿主容量。 [共用预算规格](architecture-and-milestones.md#resource-budget-retirement) · [复用核验](validation.md#capability-first-batch-review)

UH-U02 已核完整临时分段在所测 DevTools 两次正常重开后的读回与缺段补选。D0/D5 复用现有清单、范围读和 ZIP 解析，按路径和内容身份恢复候选。完整持久化、产品发布及真机继续验收。 [跨进程规格](architecture-and-milestones.md#wechat-sdk-segment-process-reopen) · [三次读回](validation.md#wechat-sdk-segment-process-reopen-validation)

固定 SE 战斗窗 26 已核模式 3/4、技能窗的开关、选行及略过回调，以及条目 12 在共用绘制后的复制顺序。D0/D4 将这些差异并入 BF-D1，沿 stage306 的输入与目标规则接现有窗口和文字所有者。 [规则及本机对照](game-static.md#fixed-se-battle-window-target-selection)

窗 10 的普通宠物及骑乘选行已交接 BF-D1。D0/D3/D4 共用十行发布、滚动、点击及退役用例。已核两模式的角色 MP、资格反馈和空回调分支。 [合并规格](game-static.md#fixed-se-battle-skill-list-admission) · [本机对照](validation.md#fixed-se-battle-skill-list-admission-validation)

六组已核对原需求、共用规则和恢复条件。窗口组将第二套窗口三个业务缺口合并为一次外层调用取证，沿同一个活动首参和新旧窗次序验收训练预览、工艺持有者和图鉴回页。 [本轮对账](validation.md#capability-batch-readiness-validation) · [三组共用条件](game-static.md#item-alternate-dispatch-candidates)

动作 221、222 的首段登记与回落重绑已合入同一规格。独立动作 49 按退场对象的槽号清零，沿 BF-D7、BF-T36 核飞行物实际获得的登记及旧对象回调。原版实战中重叠的队列需适用记录。 [换人顺序](game-static.md#battle-slot-publication-order)

配置器与两版历史游戏已合成冷启动输入规格。D0/D3/D5 沿 PR-D4 与 PR-A10 复用 `Config.dat` 编解码、原有读取及命令尾合并。降档文件的实际读者和非零覆盖赋值等具名证据到齐后更新规则。 [档位规则与对照](game-static.md#legacy-render-startup-tier-input)

两版固定样本的 `W(y` 共用一个文本发布规格。D0/D2 复用解码及文字呈现，按已证生命周期核旧值。D5 共用首次、同实例重开和新实例用例。实际文本长度及同版触发沿原证据条件。 [地址提示交接](game-static.md#legacy-address-notice-retention)

两个固定样本的 `Ok?` 和 `Kh>` 已在同一批对照。D0/D2 复用解码，通用失败提示按完整首整数判断。低字状态沿所核初始化清零，读者和具名失败请求等对应证据继续。 [字段和用途](game-static.md#legacy-unassigned-receive-outcomes)

两版地图等待已共用 GF-A10 的序号、补片尾部和续帧条件。D0/D2 复用地图与文字入口，按实际地图身份发布缓存、区域及帧就绪。两版补片开关置 1 仍等具名写入或适用原版回执。 [等待与复用方式](game-static.md#legacy-map-wait-patch-release)

两版的地图重读、缺格等待和下一次合资格移动已共用 MF-D2/MF-D3。Item 的普通帧两路与独立读点已归到两个函数，普通帧调用链已落实。D0/D2 复用两个模式的本机对照。 [帧规则与复用](game-static.md#legacy-map-movement-refresh)

G04、X03 已共用地图缓存头、路径值、活动第三平面和文件打开失败的两版规格。D0/D2 复用 `cacheVariant`、字节读写及资源持有者，按 MF-D2 接缓存归属和实际读写回执。D5 复用 MF-T01、MF-T03、MF-T07，核短读、写入失败及重开。 [缓存规格与实现差异](game-static.md#legacy-map-cache-io)

G03/G04/X03 的地图校验通知已共用文件身份、定长校验和补取规格。D0/D2 复用现有字节及编码，补非活动 B 的缓存查询、匹配后状态和宿主文件回执，按 MF-T02 验收。 [规格与本机核验](game-static.md#legacy-map-notice)

G03/G04 与 X02/X03/X06 共用返回选服、连接退役及地图目录的规则。D0/D2 复用目录值解码及会话所有者，把目录值纳入实际缓存选取。D5 随 MF-T01/T02 核同进程重开、再次入场和新实例。 [目录与会话规格](game-static.md#legacy-map-context-reentry)

G06/X03 已将 Item 重建后的默认调色并入 SE 共用规则。D0/D2 沿已核位深、默认色表和像素写宽复用 CGP/RD 与资源库，PR-A09/A10 核重建后色表和宿主表面结果。 [共用规格](game-static.md#fixed-item-palette-output-depth)

Item 的命名选择映射、显式色来源和图块限额已并入 SE 的 PR-A09/A10。现有共享模块复用选择器和 RGBA，D0/D2/D5 沿已核位深和实际呈现回执验标签、延期及失败。短色段与非四倍宽暂存沿 PR-U1 的适用素材和路径。 [共用规格](game-static.md#fixed-item-explicit-palette-upload)

X08 已沿版本启动、入场与恢复核对三组实现决定。D1 复用固定 F5A 的命令、路径和映射生产，L07/X07 保留同版读取缺口。D0/D2 复用原入场与场景所有者，按 GF-A06/A07 核确认、资料与实际呈现。GF-A16/A19 共用两版提示、旧连接退役和重开。 [共用规格与回执](validation.md#capability-launch-entry-recovery-validation)

固定 Item 的状态 6 与首次普通场景已并入 SE 的 GF-A06/A07。D0/D2 共用发包、连接与结果判断，补发送后计时、提示确认和两项就绪位到普通帧的放行。D5 核真实首帧与重开。 [两版共用规格](game-static.md#fixed-item-world-entry)

固定 Item 的状态 5 已接入 GF-A05。两版复用角色、地图、窗口和缓存入口，按来源执行实际清理、读回、发布状态 6 及 28 字节清除。D5 继续验收实际换角和宿主输入。 [共用复位规格](game-static.md#fixed-item-state5-reset)

固定 Item 的角色创建已与 SE 共用一次提交、结果确认及名单刷新。D0/D2 接资料保存、发送时点及两种结果的提示。创建成功后沿实际名单进入后续准备。 [来源与现有差异](game-static.md#fixed-item-character-creation)

固定 Item 名单、类别与预览数据已并入 SE 共用用例。D0/D2 复用现有解析和会话，补维护与读取失败的确认和各槽输入条件。D5 共用刷新、选角命中与实际预览用例。 [共用规格](game-static.md#fixed-item-character-roster)

固定 Item 的已有角色动作 3 至 6 已并入 SE 的 CH-T12 至 CH-T14。D0/D2 复用现有外观和样式值处理，实际预览对象、控制反馈及入场取值沿共用用例验收。 [外观与样式规格](game-static.md#fixed-item-character-appearance)

选角预览的编号查找、两种动作请求和逐次调用计数已并入 CH-T14。D0/D2 复用动画和资源库。D5 以同一组帧、位置和失败回执验实际画面。 [帧与素材规格](game-static.md#fixed-item-character-preview-frame)

选角预览已核动作 0 与 1 在收集前的顺序、旧对象避开新队列、同优先级排序及普通图块消费。D0/D2 共用绘制计划和取消端口，D5 继续核实际提交。 [绘制与退役规格](game-static.md#fixed-item-character-preview-draw)

建角双预览已核方向、选表、直接绘制与对象收集。D0/D2 复用同一个草稿、动画、对象退役与绘制计划，按外观与详情的切换补两份预览。D5 沿同一组用例验三端输入、焦点和画面提交。 [原版规则与差异](game-static.md#fixed-item-character-creation-preview)

建角详情已核两版共同的步进条件、肖像计算及确认。D0/D2 在同一草稿补对向属性加点准入，沿现有编号和提交路径接肖像及提示。D5 复用按住、命中和取消用例，核三端里的实际输入和画面。 [详情规格与回执](game-static.md#fixed-item-character-creation-details)

两版鼠标尺寸和位置写入已接入 PR-A10。D0/D5 复用共有帧输入，按实际消费者提供移动与按键点，沿现有画布和微信宿主核重建、快点及过期尺寸回执。 [来源和本机对照](game-static.md#legacy-item-pointer-position)

普通右键将移动点选格、派生按下和三个独立业务条件交 D0/D2。D5 与缩放用例合验同一快点、控件条件和实际角色目标。本批复用既有时钟、槽位和发送形状。 [规则和本机对照](game-static.md#fixed-se-ordinary-right-click-position)

D0/D3/D5 共用固定 SE 的普通对话生命周期。服务器关闭先于地图动作时按当前模式和角色释放，控件回复和距离关闭沿实际窗帧退役。G09/G10/G12 与 X02 复用训练等待、迟到关闭和拾取截止用例。 [来源与实现差异](game-static.md#fixed-se-ordinary-dialog-lifecycle)

A4 三端资源重开的所选规则已交接。D0/D1/D5 复用范围读、共用归档和原存储入口，验错段、候选写拒绝与旧读回调。微信临时读回已有完整素材回执，持久发布、实际描述符和真机容量沿 UH-U02、UH-U04 续验。 [实施条件与回执](architecture-and-milestones.md#resource-reopen-reader-identity)

下一批核训练、工艺和图鉴共用的第二套窗口。沿已有表项和槽位入口查普通帧如何调用回调并传入活动值。 [下一批范围](../analysis/capability-first-v1/implementation-plan.json#/execution_review/next_available_analysis)

固定 SE 已交 BF-D7 与 BF-T36 的护卫交接、待摘链飞行物及角色 216。D0/D4 复用既有对象和动作队列，用同一规格处理普通与慢速遍历。实际护卫等待恢复、离场替换及原始区末次写入继续按各自的具名来源核对。 [已交接的战斗规则](game-static.md#battle-266-relay-retirement)

Safari 已核活动读失败和正常离页对在途图形读取的影响。D0/D5 复用页面与资源所有者，把导航意图、旧读实际结果和新页启动按同一用例验收。后退、系统离页、长后台和持久根在设备上继续验。 [宿主实测](network-portability.md#safari-navigation-resource-read)

固定 Item 已核第二套窗口的三个候选及十二个登记回调的首参传递。经典窗控件资料、第二套局部命中和初始化各有来源。G12、G18、G19 共用已核的活动值消费与退役。外层首参和实际帧顺序取得正向调用或适用运行材料后复查。 [候选与调用规格](game-static.md#item-alternate-dispatch-candidates)

固定 F5A 的自更新接管、补丁完成、普通确认和关闭已核八行消息及一个启动虚槽。D1/D5 复用准备编号、计时器所有者及关闭接口，按补丁和普通启动各自的阶段发布顺序验收。Windows 的真实投递、备用制品和当前同版游戏读入沿原用例。 [登录器入口归属](launcher-static.md#fixed-f5a-entry-business-admission)

固定 SE 的战后窗、邮件和工艺已核 39 处所选登记，覆盖九个经典窗口及两处仍待实际分派的第二套注册。D0 用同一经典窗口次序，D2/D3/D4 分别接材料资料、邮件与工艺和战后结果，D5 沿原用例验三端。 [登记、调用与验收](game-static.md#fixed-se-entry-business-admission)

UH-U02 的提交历史和晚到确认已有同一工具内的新 App 对照，小型提交夹具也已在新工具进程读回。D0/D1/D5 复用原读回与启动端口，按代际、提交和意图确认归属，持同一写入者核历史，再复用旧槽。异常退出、实际产品、完整素材与设备继续沿原用例。 [双槽恢复与交接](architecture-and-milestones.md#wechat-publication-history) · [正常进程重开](architecture-and-milestones.md#wechat-devtools-process-reopen)

UH-U03 已对照真实网页入口和微信生成 App/Page 模块。D0/D1/D5 共用完整加载身份、导航尝试、实际准备和最终活动发布的规则。所选入口已交接，真实小程序代码更新、产品发布端口及真机仍沿原用例验收。 [加载与绑定](architecture-and-milestones.md#portable-boot-entry-identity)

G06、G08、X03–X05 已把在途范围、绘制、音频和资源版本纳入同一预算规则。D0 复用既有归档与资源库，由 UC-P06 至 UC-P09 按实际分配、持有和回执登记占用。D5 在三端现有入口验收发布时仍在用的旧根、候选拒写和真正排空。 [共用预算及退役](architecture-and-milestones.md#resource-budget-retirement)

经典邮件的所选草稿、群发列表及附件已成规。D0/D3 复用 MAIL-08、MAIL-17 及换场、焦点和物品占用规则，按普通重建与战斗入口的实际差异执行。D5 沿 MAIL-CASE-41 至 MAIL-CASE-44 验三端。 [原版行为与用例](game-static.md#fixed-se-classic-mail-reopen)

首批对账 X03、X04、X05 的资源选择、范围读取、内容发布、重开和启动确认。已读 stage306 的真实入口，网页直接从所选 ZIP 或目录准备游戏，微信游戏页的选择器当前接收一个临时 ZIP。启动器本地缓存各有自己的发布和读回，游戏所选素材要接入同一套活动根与重开合同。由 D0/D5 复用 UC-P06 至 UC-P10、现有 ZIP 解析器和宿主文件端口。普通单文件载入、分段临时读取和持久化发布各自以实测规格给出的回执为准。 [现有入口和宿主条件](architecture-and-milestones.md#resource-import-and-reopen-comparison)

微信完整素材的新 App 和独立工具进程读回共用段身份与范围接口。D0/D5 沿同一清单恢复所选素材，持久化发布由完整来源和读回决定。受支持的完整持久化来源与 iOS、Android 真机沿 UH-U02。 [清单重开和补选](architecture-and-milestones.md#wechat-sdk-segment-process-reopen)

X03–X06 已合成旧页面及资源根退役、候选发布和新页面读回的五组用例。D0 补准备期读取所有者及排空，D1/D5 接入发布回执、实际重开与连接关闭。Chrome 实测旧 ZIP 取消后额外发起一次目录读取。实际微信建连、桌面可信隐藏、移动真机长时后台及持久化恢复沿原宿主条件。 [资源发布与读回](architecture-and-milestones.md#portable-update-handoff-readback) · [准备期取消回执](validation.md#game-resource-reopen-composition-validation)

A1 已对账 30 条固定 SE 邮件入口的业务归属，含经典窗口、收包和另一套窗口登记，补入两项已知的正文和滚动控件。实际调度和候选条件继续沿另一套窗口的正向证据，最终投递和附件结算沿 MM-R1。 [入口与用例](game-static.md#fixed-se-mail-entry-admission)

A1 已审定 18 个出站格式器的已证业务调用和参数。D2 复用普通移动并保留有明确条件的类型 2 构帧，D3 以同一格式器接名片、家族和迷你名单，并沿原物品、工艺用例核验待接条件。D0 处理共用阶段准入，角色、回场和战斗沿既有批次。 [固定样本规格](game-static.md#fixed-se-outgoing-admission) · [本机核验](validation.md#fixed-se-outgoing-admission-validation)

A1 已复核固定 SE 经典 4、5、7、8、9 的所选操作。D0 复用窗口打开、重排、实际退役和位置继承。D2 沿现有通信和资料接入两条已证请求、点数与阵位回包及称号排序副本。D3 复用已有组队、交易、名片和家族操作，并补人物状态、明细与称号入口。D4 验收阵位的后续消费。 [窗口及业务规格](game-static.md#fixed-se-classic-toolbar-status) · [本机对照](validation.md#fixed-se-classic-toolbar-status-validation)

A1 已复核经典简介窗 58 和目录窗 59 的所选操作。D0 复用人物窗和编辑焦点，D2 复用现有组包并接角色缓存、请求顺序及资料发布，D3 补四项编辑和三类目录。用 PROFILE-A01 至 PROFILE-A05 覆盖返回、编辑、选择、公开、入场及退出重开。 [共用规格](game-static.md#fixed-se-classic-player-profile)

目录的两组版本比较、行发布和公共文件已按同一来源成规。D0 沿原资源与设置端口处理读写回执，D2 共用版本与资料状态，D3 复用人物窗和迷你邮件界面。PROFILE-A03、A05–A08 覆盖缩表、尾行、版本差、重开和所选角色。 [规格与用例](game-static.md#fixed-se-player-directory)

已核他人简介的四类查询和 `^=0` 到窗 64 的显示与退役。D0 复用窗口池，D2 复用解码及外观换算并接有序发布，D3 沿 SF-A09 与 PROFILE-A09 至 A12 接名单与显示。四类实际服务回复的配对继续验收。 [来源与差异](game-static.md#fixed-se-other-player-profile)

`CcL` 的直接特效与先登记再显示已归入同一实体规格。D2 复用现有解码、资源换算和远端 ID 表，D0 复用场景帧与对象池。CCL-A01 至 A05 统一验收重复、满槽、分配失败、结束查找和三端呈现。 [场景规格与差异](game-static.md#fixed-se-ccl-scene-publication)

`LC=` 和 `LHm` 已归入经典普通用物。D3 复用五条现有编码，补共同的两级资料和选择操作。D0 复用已登记的窗口构造及退役规则，D5 沿同一组用例验收三端操作。 [用物规格](game-static.md#fixed-se-item-target-menus)

经典 60–63 已核目录、检索、资料和迷你邮件的客户端操作。D3 沿同一世界分派、目录缓存和 `/1I` 编码接四组操作。D0 复用字节输入和窗组退役，D5/D6 验收三端及实际回复和收费。 [目录与迷你邮件规格](game-static.md#fixed-se-classic-directory-mini-mail)

留存 ST-08 已覆盖 `Ww~` 的两项配置和输入记录池，直接归回原规则。战斗结果已核经典窗 30/31 的创建取值、窗 30 每帧取图和共用的绝对截止，D0/D4 复用原帧、角色与技能状态。 [结果窗规则](game-static.md#fixed-se-battle-results)

固定 SE 复用五槽发布与已存加点回调，补证资料页翻页后取槽、加点页翻页前取槽，以及第二套报价的余额、零宠物与页内行规则。D0/D2/D3 共用 PS-A01 至 PS-A03。 [已交接操作](game-static.md#fixed-se-pet-count-selection)

报价空表、同号刷新及晚到选择归入 PS-A04、PS-A05。复用经典 `Q?m`、`/1I` 和原训练等待用例。固定 SE 的页数写入及两版实际活动调用取得相应证据后再补，局部翻页和同号替换沿现有窗口及训练模块交接。 [报价规格及恢复条件](game-static.md#fixed-se-training-quote-pages)

两版遗忘窗的未命中返回已核为读背包说明索引，经典窗的 99 继续复用现有回复。Item 报价页归入同一组规格和 FR-A01 至 FR-A04。 [遗忘及报价](game-static.md#historical-forget-return)

固定 SE 的经典工作窗返回、同步退役和共用清零交 WK-D2、WK-T23 及 WT-A01 至 WT-A04。D0 维护共用窗口顺序，D2/D4 使用普通及战斗回场分支，D3 沿现有工艺和工作上下文补持有计数及解除条件。 [工作窗口规格](game-static.md#fixed-se-work-transition-retirement)

普通用物与工作共用的两级目标已核对资料替换、输入失效和换场退役。D0/D2/D3 共用窗和场景状态，在现有业务入口管理各自的回调与占用，并沿 SC-T10、SC-T11、SC-T16 和 SC-T17 验收。 [用物的共用规格](game-static.md#fixed-se-item-target-retirement)

普通换图的旧窗退役、202 等待、205 队列及两处 204 写入共用 GF-A10、WT-A02、SC-T17。D2 复用移动组包、回复解码和地图身份校验，补状态发布及区域刷新时序。D0/D3 复用旧窗退役、迟到选择及新地图重开用例。 [窗口与队列](game-static.md#fixed-se-classic-scene-window-queue) · [等待与解除](game-static.md#fixed-se-map-change-readiness)

固定 SE 两条换场入口共用一个选择器。D2 复用现有七字段角色动作解码，把登记、选路和目标准备经 GF-D3、GA-D2 接回现有状态。D0/D3 沿同一组场景、资源及经典窗用例处理实际退役。GF-A18 加入同批回复先于重建、新登记后重入、素材等待及旧补片。 [规则、差异和用例](game-static.md#fixed-se-251-completion)

换图、水面和战斗回场沿同一份临时面规格交接。D0/D2 复用已有场景、城市捕获和战斗画布所有者，由 GF-D3 接普通回场提交，PR-D5 接图形顺序。D5 共用成功绘制、迟到任务释放和普通输入恢复的用例。 [图形和回场规则](game-static.md#legacy-transition-background)

普通换图的 16/17 条带同 202/205、204 窗口重建及 9/20 后的普通输入纳入同一组合用例。D0/D2 沿现有源帧顺序复用城市和战斗回场的呈现回执，按当前场景接普通淡出、淡入和失败恢复。D5 以同一组准备和呈现条件验三端。 [普通换图及首帧](game-static.md#fixed-se-ordinary-map-fades)

图形重建后的临时面重获与待呈现帧交接合入 PR-A10、PR-A12、GF-A10、GF-A11。D0/D2 复用场景与战斗背景计划、公用资源和 Canvas 回执。D5 同组验证旧代退役、正在读取的帧替换和中途绘制失败。 [重建规则及验证](game-static.md#legacy-transition-graphics-rebuild)

地图补片的实时第三平面、区域重读与移动续接沿 MF-D2/MF-D3。D0/D2 在一个帧用例覆盖旧身份、同 B 异 A、部分补齐、读取负返回和下一帧恢复。现有方向请求、碰撞和插值沿用。 [已证顺序与待接差异](game-static.md#fixed-se-map-region-refresh)

L03/L08 已用留存证据核对两版普通退出中候选、提交与窗口关闭的组合。D1/D5 沿 LS-T19 至 LS-T21 接已有尝试退役和宿主回执。 [退出组合](launcher-static.md#launcher-ordinary-exit-confirmation)

FR-U3 的目录选择所选规则已核到 F5A 写入与冷启动读回，D0/D1/D5 复用内容绑定、尝试身份及设置回执。失败保持旧目录、未知写入等待读回、手动与恢复各自续接归入同一组用例。原版运行和移动真机、微信持久化仍待验收。 [规格与实测](launcher-static.md#launcher-directory-host-handoff) · [下一组待决规则](../analysis/capability-first-v1/implementation-plan.json#/execution_review/next_available_analysis)

L06/L08/X03 的补丁重试和目录恢复共用一个准备所有者。D0 复用资源绑定和退役，D1 补错误码及已确认目录的续接，D5 复用设置读回与候选回执，D6 沿 GP-U01 验实际备用制品与子进程。 [组合规格与用例](launcher-static.md#f5a-patch-retry-directory)

战斗与窗口共用规格补齐经典指令窗 26 的关闭帧。达到标记的当帧仍按当前模式调用控件并绘制，下一次活动表整理处理退役。D0/D4 用同一条关闭用例，分别覆盖存在和缺少事件位。BF-T36 只沿可能覆盖三个暂存字的具名写入或适用实读推进。 [窗口与用例](game-static.md#battle-266-window-control-writes)

| 上一组核对项 | 已有规格与待证条件 |
| --- | --- |
| X02 与 G12、G18、G19 的经典窗口 | 一次核对打开、同帧推进、关闭和回场，复用 `SD-CASE-09` 至 `SD-CASE-16`。已将 `9/252` 两遍更新和同号过渡合为一项静态预期，覆盖训练重建及工艺、图鉴复用。实际用例沿 D0/D3 执行。 [打开和共用用例](game-static.md#legacy-item-classic-open-transition) · [经典重建](game-static.md#legacy-item-classic-rebuild-modes) |
| G12 的经典操作 | 两版十种模式已对照到人物训练、宠物训练、治疗，沿原 14 个操作条目及 OS-A23 至 OS-A25 交接 D0/D3。共用输入、状态发布与窗口退役，各操作保留自己的返回和取消。 [操作与用例](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/classic_training_operation_coverage) |
| 同组的第二套窗口 | 共用槽位和缓存退役规则。已核十二个回调的首参传递，三个候选的用途已确定。下一次补证从具名外层调用或适用运行材料核活动值与新旧窗顺序，供训练预览、工艺准入和图鉴回页共用。 [候选及待证入口](game-static.md#item-alternate-dispatch-candidates) |

窗口组沿现有合同与四项能力行交接。已证的共同次序和案例交 D0，业务差异交 D3，普通回场及战斗回场继续由 D2/D4 引用。取得适用材料的第二套窗口操作沿同一合同补入。 [共用合同](../analysis/capability-first-v1/alternate-window-contract.json) · [需求索引](requirements-index.md#capability-first-inventory)

固定 F5A 的普通回复至交接发布已完成所选启动器侧静态核对。D1/D5 复用现有选服、路径和启动所有者，覆盖保存失败仍推进、前检失败、首次配置、映射失败及仅刷新各时点。L07/X07 的同版游戏消费规则等待可读代码或适用消费证据，D6 沿原用例执行同版联合验收。 [普通启动组合](launcher-static.md#f5a-ordinary-handoff) · [同版材料](known-issues.md#current-game-handoff-evidence)

桌面 Chrome 和移动 Safari 模拟器已用同一套夹具验证 B 已提交、C 成为活动版本、B 的启动确认迟到和浏览器重开。微信现有双槽缓存的本机文件对照确认第三次发布会复用第一槽。D0/D1/D5 复用原更新所有者、发布读回、退役及启动确认，统一验收最终写入时的版本比较、旧读者释放后回收，以及回收后仍可查旧提交。微信 SDK、完整包持久化及实际产品启动继续沿 D5 验收。 [共同用例与端口](architecture-and-milestones.md#portable-update-handoff-readback) · [本地回执](validation.md#portable-update-handoff-validation)

B02/B03 已把同施法者合组、接续倒计时和同次遍历的读写补入 BF-D7/BF-T36。D0/D4 复用现有命令调度。选定 404 写三个字，405 只更新附件对应的字，266 按读取点消费。原版实际值和其它同帧写入按 BF-U1 继续核验。 [来源与共用用例](game-static.md#battle-266-same-frame-producers)

G06、X02 已核到两版新进程的命令尾、首行合并与首个档位键。D0/D3 复用启动输入和图形所有者，D5 沿 PR-A10 验证打开失败及冷启动。`update.dat` 读回和非零覆盖来源沿具名证据继续取证。 [启动规格](game-static.md#legacy-render-startup-tier-input)

X01、X02 和 G19 已核固定 SE 经典图鉴的 27 个登记位置。`46A4D0` 的八个分支中，工具栏控件 6 使用图鉴槽。D0/D3 沿 SF-A27 验证列表滚动与空行点击、详情步进、发现字节清除及关窗退役。另一套窗口的实际分派沿 SF-U1 取证。 [当前入口归属和用例](game-static.md#legacy-classic-album-entry-admission)

X01、X02、G18 和 B01 已核经典技能窗的普通与战斗入口。两版快捷键均要求 Ctrl 按住及 E 或 W 首次按下。固定 SE 的十行选技能和分模式析构归原 WK-T02、WK-T23，主状态 10 的战斗准入归 BF-T07。D0/D3/D4 共用窗口时序。 [入口、规格和用例](game-static.md#legacy-se-classic-work-entry)

L03、L04 和 L08 已合并固定 F5A 备注对话、迟到回复与保存回执的规格。普通阶段 4 空闲时收到的状态 0 无法换表。确认、取消和替换后槽内容的条件用例交 D1/D5，沿原 LS-T17、LS-T20 验收。 [备注准入和保存目标](launcher-static.md#f5a-note-modal-admission)

B02、B03 已核 105 动作 98 与 106 分身动作 14 的条件顺序和两次读取。D0/D4 复用现有对象遍历、分身分配及动作队列，沿 BF-T35、BF-T36 验创建当次、同帧增量、清零及不同帧。实际非反射指针和恢复沿 BF-U1 取证。 [共用战斗规格](game-static.md#battle-105-106-callback-order)

X01、X02 与 G11 已核固定 SE 的商店报价行。出售、鉴定和修理共用换位、取消和撤选规则，确认继续按原报价记录顺序。D0/D3 复用核价及提交接口，沿 OS-D6、OS-A18、OS-A20 和 OS-A21 交接三端。 [业务与共用窗口规格](game-static.md#legacy-shop-quote-drag)

G09、G20 和 X02 已共用三条背包发布路径、普通选择失效及邮件提交和重开规则。D0/D3 复用单槽与交换，补接全量发布，沿 MM-D3、MM-D4、MM-D7 接入附件。 [共用规格](game-static.md#legacy-se-mail-attachment-refresh)

G03、G09 和 X02 已共用 28 槽全量字段、短尾、入场清除及等待规则。D0/D3 复用现有逐槽、交换与物品修订，补全量发布。D2 沿 GF-A05、GF-A07 核入场重置与地图、角色两位的实际到达顺序。 [共用规格](game-static.md#legacy-full-inventory-publication)

G09、G18 和 X02 已共用背包发布、制造编辑重查、计时换位及结果释放的规格。D0/D3 在现有所有者中补齐材料引用随背包移动、装备换位清除及晚于收包的编辑检查，沿 OS-A01、WK-T07、WK-T08 验收。 [制造材料规则](game-static.md#legacy-se-craft-inventory-selection)

G09、G13 和 X02 已共用背包刷新、已选物品随槽移动、报价面板重查与确认先后的规格。D0/D3 复用共同背包和帧入口，SW-D1/SW-D3 与 OS-D8 接稀疏报价位置、撤回和占用退役。 [交易选择规格](game-static.md#legacy-se-trade-inventory-confirmation)

G05、G13 和 X02 已共用经典宠物活体、稀疏报价位置、持有及报价金币、发布和退役规格。D0/D3 通过同一组操作和资料入口验收已选宠物清槽与恢复、余额下降和回升、撤回后重发及新会话。 [共用规格](game-static.md#legacy-se-trade-pet-gold)

G13 与 X02 已在同一交易规格中核对第二套窗的发布列表和金额回调。D0 保留帧准入、控件先后与共享时钟，D3 沿现有交易所有者及消息格式器按已证入口处理各自的列表、相位和金额。OS-A27、OS-A28 和 SW-AC12 增补同帧发包、仅截低余额、主动编辑与关闭用例。 [共用规格](game-static.md#legacy-se-alternate-trade-gold) · [本机对照](validation.md#legacy-se-alternate-trade-gold-validation)

G05、G09、G13 与 X02 已把第二套交易窗物品、宠物的缓存及输入归入同一份规格。D0/D3 共用原背包发布、数字输入和交易阶段，沿 OS-A01、OS-A27 与 SW-AC9 验证双击、选起取消、数量提交、单行刷新和整行交换。SW-R2 继续等普通打开或帧分派的正向证据。 [操作与用例](game-static.md#legacy-se-alternate-trade-selection)

G03 与 X02 将 Item 的初始化、断线、换场和战斗转换归入同一经典窗口规格。D0/D2 复用窗口、帧时钟和返回入口。D3/D4 沿现有缓存保存与战斗阶段接入按状态区分的清理和重开。另一套窗口继续沿实际回调列的具名调用补证。 [固定来源](game-static.md#legacy-item-classic-rebuild-modes)

D0/D3 将经典控件消费与待退役顺序在训练、工艺和图鉴中共用。训练的 OS-D7 增补等待页有效再输入、报价栏按本地页改装、技能栏确认与取消。沿 OS-A24 和 SF-A27 各验业务结果。另一套窗口继续等待具名调用或适用运行材料。 [两版训练控件与共用帧](game-static.md#legacy-pet-training-controls)

训练 55–59、67 的需求归属随第二套窗口的业务帧调用核对。X03/X06 分别有 4 项和 5 项直接依赖方，资源提交恢复与连接退役已补移动 Safari 的宿主证据。后续沿原 D5 验收产品端口、长时后台及真实设备。 [依赖关系](../analysis/capability-first-v1/capability-matrix.json) · [共用窗口](game-static.md#alternate-window-focus-slots) · [移动宿主核验](validation.md#mobile-safari-stream-commit-validation)

L07 与 X01 复用 F5A 七组文件搜索的来源及 Windows 返回的 28 行。D1 按宿主序号处理长名和属性，再按标题字节规则转换。六组与排序输入不同，沿实际序号验收末行和参数顺序。D6 沿原用例验证当前同版游戏读取及实际启动器环境。 [标题规则](launcher-static.md#f5a-resource-title-bytes) · [Windows 顺序和用例](launcher-static.md#windows-installed-resource-enumeration)

L04、L07 与 X01 共用 F5A 的选表证据。D1 复用显式编码及原始文件名字节，按实际选表转小写、逐字节替换下划线，再查词族。D6 验证正常初值、同代码页再次选择、线程表恢复及实际标题。登录框按保存的 ANSI 字节各验 16 字节。 [选表和输入用例](launcher-static.md#f5a-normal-startup-locale-selection)

D0/D1 将 F5A 的配置节与游戏键组合、250 毫秒轮询、三个加载失败分支及持久化回执并入同一首次配置流程。固定配置器的初始化、恢复默认、取消和确认复用已有设置字节接口。D5 用现有 SS-A19、SS-A20 与 PR-A10 核对有无旧文件、提示与关闭、文件失败、换账号和普通退出续接。 [观察规格](launcher-static.md#f5a-first-config) · [配置窗口及文件结果](launcher-static.md#first-config-dialog-outcomes)

L01/L08 与 X03–X05 沿同一准备所有者核对三槽占用、首次配置、目录替换及设置重开。D0/D1/D5 复用 UC-P12 与 LP-A09 至 LP-A12 的保存及读回，补来源选路、同 Code 分行前检、不同目录设置，以及收尾后的活动条目准入。 [组合规格与本机对照](launcher-static.md#first-config-directory-composition)

L01/L06/L07/L08 将 F5A 的目录准入、按操作检查文件、诊断与缓存发布并入已有路径和首次配置规格。D0 复用原字节与路径观察，D1 接入目录和启动所有者，D5 复用现有文件、写入及宿主回执用例。路径通过后才判对应文件存在，后续配置器或补丁进程各有自己的结果。 [固定来源](launcher-static.md#f5a-path-preflight)

D1 合并普通启动失败、补丁失败及右键目录选择的共用处理。失败提示按错误码提供重选操作，选择后按提示退出时的条目与阶段投递恢复。用一组用例核对普通关闭、投递失败、条目或阶段失配、取消、写入失败和成功后的两种续接。D5 复用消息、目录选择和持久化回执端口，验证提示期间的实际投递与退役。 [提示准入](launcher-static.md#f5a-recovery-prompt) · [目录恢复与续接](launcher-static.md#f5a-directory-recovery)

CE-U1 的三个模板已核两版资源内容和更新窗口的实际模板编号。找到影响魔力必要操作的赋值、加载或调用时再补证，当前优先推进同版游戏交接与共享底座。 [条件模板核验](launcher-static.md#conditional-template-scope)

L03、L06、L08 的 D1 补入 F5A 普通关窗和补丁句柄归属。D5/D6 验证忙态下两次关窗的投递顺序、投递失败、实际窗口退役和补丁子进程的退出与备份结果。回退制品继续沿对应分发或实际读回取证。 [关窗规格](launcher-static.md#f5a-close-ownership)

L06 的 D1 补入每次备份启动前的属性查询、已有备份删除、无覆盖复制及定时器错误。退出 102 的下一次尝试重新读取属性。沿现有更新和事务端口验收这些完成点，实际回退制品和子进程身份继续沿 GP-U01。 [来源规则](launcher-static.md#f5a-installation-and-backup-preflight)

L06 与 L08 共用一份备份命令及固定安装补丁器参数规格。D1 复用现有命令规划和退出解释，D6 按 GP-U01 对实际回退制品、子进程映像与退出做同版验收。 [参数交接](launcher-static.md#installed-patcher-argument-handoff)

X03 的 D0 复用网页单事务比较和完成事件。已知发布后遇记录缺失时进入待恢复，后端打开错误保留待查。结构错误、删除排队及晚到请求清理在 Chrome 与 Safari 模拟器沿同一套用例验收。重建同时核对活动根身份与修订。继续验收分块端口、回执、意图及设备生命周期。 [打开与排队实测](architecture-and-milestones.md#browser-cache-open-outcomes) · [回执与重建](architecture-and-milestones.md#browser-cache-receipt-recovery)

X03/X04 的 D0/D5 沿同一夹具覆盖 `commit()` 已返回而发布方中断。Chrome 与移动 Safari 模拟器均已读回原更新编号、活动根和重启意图，后续用相同边界验收实际网页端口。 [显式提交中断](architecture-and-milestones.md#browser-explicit-commit-interruption) · [移动重开](architecture-and-milestones.md#mobile-safari-explicit-commit)

<a id="capability-first-estimation"></a>

### 减少工作量与估时

按下一组具备材料的共享规则统计新增查询和用时。开发阶段按负责模块中的唯一差异和依赖排时，多个需求引用同一项差异时只计一次。材料等待与可推进的工量分别跟踪。现有四批分析样本可校准同类小组，项目总工期和节省比例需要剩余差异盘点及实际批次数据。 [样本和统计边界](validation.md#capability-first-batch-review)

六组对账后，以仍可查的规则数和同类实测估剩余分析。在统一准入时按去重后的模块差异与依赖估开发，首个 D0 批次用实际开发、回归与返工时间校准。桌面、移动网页和微信的适配及验收按宿主实测，同版材料和真实会话的等待单独计入各自依赖。四个样本只覆盖已有来源的局部规格分析。 [四批用时](validation.md#capability-first-effort-check)

固定 SE 收包专项对账 37 个入口，34 个沿已有业务规则归属，补证明确 1 个，另有 2 个等待具名业务证据。按待决规则计量即可直接转交已有结论。 [分派、复用与核验](validation.md#fixed-se-receive-operation-admission-validation)

经典关闭这一批沿用同一个业务回调与活动槽清除顺序，18 个登记中 12 个直接复用已有范围。补查的 6 段共用一次 REA 载入。D0 的退役实现和三端的关窗用例按共享规则计一项，各业务只计自己的动作差异。 [本批核验用时](validation.md#fixed-se-classic-destructor-callbacks-validation)

固定 F5A 的一批入口核对覆盖自更新、补丁、普通确认和关闭，复用 23 个留存函数档案，新增 REA 查询为零。一个子视图计时器所有者和一个主窗提交所有者分别供多个操作引用。一次 124 项本机回归核对现有模块，沿 D1 复用共用实现及 D5 的入口用例。 [复用范围与本机结果](validation.md#fixed-f5a-entry-business-validation)

普通选服至启动交接复用了 12 个完整 REA 函数档案，沿一个确认与启动链核对保存、路径、映射和返回结果。D1/D5 合用同一组分支用例。 [来源与对照](validation.md#f5a-ordinary-handoff-validation)

资源更新复用四个 REA 函数档案，新增查询为零。同一套合成输入在桌面 Chrome 和移动 Safari 模拟器执行。微信核对现有双槽实现的差异，已有 SDK 范围读与配额回执继续使用。现有 50 项相关回归用时 6.44 秒。 [核验和适用范围](validation.md#portable-update-handoff-validation)

经典邮件复用 24 个留存范围。草稿及群发表补读集中在一次 REA 会话，含加载与关闭共 57.789 秒。同一规格供 G03、G09、G20 和 X02 使用，开发共用原窗口、编辑器和占用状态。 [取证与本机对照](validation.md#fixed-se-classic-mail-reopen-validation)

图鉴复用原按钮、绘制与回包证据，补齐启动初值和局部更新顺序。D0/D3 在现有窗口所有者内用同一份描述符和偏移验收命中、绘制与退回收起状态。普通帧分派沿一个共用问题继续核对，训练、工艺和图鉴各自补实际业务准入。 [共用规则](game-static.md#legacy-item-album-toolbar-and-slot-reset)

固定 SE 出站专项复用 18 份格式器证据及 stage306 的 18 个编码，只补 2 次 REA 引用查询。四类 `;JE` 请求共用编码，开发按实际调用补三种名单入口。用同一批 177 项现有本机回归核对相关共享操作。 [本批核验](validation.md#fixed-se-outgoing-admission-validation)

工具栏与人物窗共用 23 个已有回调档案或视图，补齐 7 条 REA 证据。9 个现有编码及两类资料解析可沿用，缺少的请求格式、世界发布和输入入口分别交现有模块。 [本批回执](validation.md#fixed-se-classic-toolbar-status-validation)

简介与目录窗复用 20 份已有档案或派生视图，新增 4 条 REA 证据。两条简介编码及目录版本请求编码均可沿用。公开、入场和提交各自的调用顺序一次落实到同一资料所有者，再给各端接输入和呈现。 [复用与用例](validation.md#fixed-se-classic-player-profile-validation)

目录版本、行发布和读写复用 19 份档案及视图，只新增两个文件函数的 REA 档案。现有字段与前缀解析供两种列表共用，真实目录文件沿已有素材入口读回。14 个行投影和 4 个版本用例可随 D2 复用。 [工时与核验](validation.md#fixed-se-player-directory-validation)

他人简介复用 15 份档案和视图，只补查目录查找和窗 64 刷新两个函数。四种查询共用一个已有编码，回包复用已有解码。编解码、发布和显示的差异按现有模块各实现一次，三端共用用例。 [复用数与本机回执](validation.md#fixed-se-other-player-profile-validation)

场景回包 `CcL` 复用 13 份 REA 函数档案，只补一份构造函数档案和一份帧回调字节视图。固定样本的两类消费沿现有实体表、资源换算和场景帧入口实现，三端共用 5 组验收条件。 [取证与本机核验](validation.md#fixed-se-ccl-scene-publication-validation)

普通用物的两级目标复用 9 份 REA 函数档案和 12 份派生视图。新增一份槽交换档案，查询计入首次引擎载入为 57.857 秒。五条现有请求编码已通过本机对照，开发工量集中于一组业务缺口和现有窗口及宿主接线。 [原证据、复用范围与用时](validation.md#fixed-se-item-target-menus-validation)

两级目标的后续取证复用同一接收与发送入口，仅新增两个填行函数档案和五次地址引用查询。用物、工作和换场沿一次共用窗口核对，现有 122 项相关回归通过。新增查询共 57.279 秒，含首次引擎载入。 [取证和本机回执](validation.md#fixed-se-item-target-retirement-validation)

目录检索与迷你邮件复用 13 份 REA 函数档案和 16 份派生视图。新取 1 份标记退役函数档案及 1 份提交回调字节视图。现有 `/1I` 编码覆盖五组线格式对照，后续共用外层编码、现有输入与窗口规则，按各步骤补业务。 [复用与用时](validation.md#fixed-se-classic-directory-mini-mail-validation)

经典工作窗复用 19 个留存函数范围，先查一次共用计数清零，再沿同一份退役顺序交窗口、普通场景、工艺和战斗回场。两种解除路径以及配方重查均使用现有编码。新增查询含引擎首次载入共 56.896 秒，本机相关回归 92 项。 [本批取证与回归](validation.md#fixed-se-work-transition-retirement-validation)

普通换图的等待复用八个函数视图，新增三次 REA 字节查询。现有五字段组包、两个整型解码及补片处理直接进入一组组合用例。49 项相关本机回归通过。含引擎载入的首次查询用时 56.439 秒，后两次读回合计 17 毫秒。 [复用与核验范围](validation.md#fixed-se-map-change-readiness-validation)

地图重读复用 16 份档案，两段补查共用同一个 REA 会话。两种地图模式共用一套补片、等待和续接输入。开发差异合入已有 MF-D2/MF-D3。 [复用与本机回执](validation.md#fixed-se-map-region-refresh-validation)

首次配置与目录恢复沿既有来源档案合成，只补读进程槽的 33 字节。按一套用例核三个入口及三个设置结果，复用现有配置字节与候选读回。 [复用与本机回执](validation.md#first-config-directory-composition-validation)

补丁重试与目录恢复复用 12 份函数档案和现有退出解释、目录绑定、候选退役。两处补读集中为一组，备份实际错误、目录写入读回和再次准备沿 GP-T18、LP-A09、LP-A12 与 UC-P12 共用用例。38 项相关本机回归通过。 [复用与本机回执](validation.md#f5a-patch-retry-directory-validation)

图形缓存复用 7 份函数档案，新增两段字节查询共用一次分析引擎载入。分配耗尽、普通和缩放绘制及重新准备归入同一 PR-D2，沿 PR-A05 和 PR-A06 共用验收。77 项相关本机回归通过。 [取证与本机回执](validation.md#legacy-graphics-partial-cache-validation)

延后上传沿同一 PR-D2 合并普通与缩放绘制、颜色失配及限额复位。保留已有颜色、解码和缓存实现，补相同场景持续绘制时的旧块结果及下一轮重新着色。22 项相关本机回归通过。 [取证和本机对照](validation.md#legacy-graphics-deferred-upload-validation)

过渡背景和回场的首帧交接复用 11 份函数档案。三次查询共用一次引擎启动，含初始化和关闭用时 57.655 秒。保留城市过渡成功绘制的回执，补普通战斗回场同一提交条件。58 项相关本机回归通过，另独立复现所需的提交次序差异。 [取证和本机对照](validation.md#legacy-transition-background-validation)

普通换图复用十份函数档案，三次补查共用一次引擎启动。条带、资源就绪、窗口重建和实际交互恢复共用 GF-A10。现有场景角色、画布和城市回执进同一组实现差异。65 项本机回归通过，另以可控首次读取复现输入提前。 [取证与实测](validation.md#fixed-se-ordinary-map-fades-validation)

图形重建专项通过同一次引擎启动补两段字节和四次引用。普通与战斗背景沿原入口重新取得，画布替换和失败共用资源、帧及回执接口，56 项本机回归通过。 [取证与本机对照](validation.md#legacy-transition-graphics-rebuild-validation)

换场与角色控制器一次核对了 200、250、251 和 252。四次读字节及四次引用共用一次 REA 加载，查询会话共 57.923 秒。换图、角色和工作窗只登记一份分派差异，两条本机对照与 112 项现有回归用于定位接线范围。 [复用和本机核验](validation.md#fixed-se-scene-controller-route-validation)

251 的后续条件复用既有帧分派、接收与控制器档案，六次 REA 补查共用一次载入，含初始化及关闭用时 58.020 秒。连续回复的本机对照覆盖素材挂起后恢复与旧补片拒绝。63 项相关回归通过。 [本次核验](validation.md#fixed-se-251-completion-validation)

堆叠数量窗一次确认了两处设置、四条放置消费和保存读回。首次交接核验距建立取证目录 21 分 46 秒，六次 REA 补查含载入及关闭占其中 57.232 秒。两套设置和三项能力共用一份准入规则，D0/D3 沿现有上下文、数量校验和发送，D5 复用设置回执及重开用例。91 项相关本机回归通过。 [本批复用、耗时和待验条件](validation.md#fixed-se-stack-quantity-input-preference-validation)

另一套背包的数量编辑复用两条注册回调和已有键盘帮助体，继续沿 SW-AC9 与 OS-A01 整合窗口页、普通输入、背包发布和已存数量。从准备至首次核验通过为 14 分 44 秒，84 项相关本机回归通过。 [来源、用时和现有行为](validation.md#fixed-se-alternate-inventory-quantity-validation)

背包、技能和工艺的工作资料发布共用一批。五次 REA 查询共用一次引擎载入，已有解码、工作时钟、解除及配方请求复用。99 项本机回归按同一套工作状态核对。 [工作上下文回执](validation.md#fixed-se-work-context-publication-validation)

槽 7 取证复用已有物品交换、制造关联和工作时钟。五次 REA 查询共用一次引擎载入，两种回包时序都通过现有共享客户端和相同的材料用例。 [槽占用核验](validation.md#fixed-se-work-slot-seven-validation)

战斗相邻帧复用既有排序、绘制及输入档案，新增六段取证共用一次引擎载入。按同一相对地址核多条分支，结合 12 个共享夹具及 68 项现有回归交 BF-T36。 [帧写入核验](validation.md#battle-266-frame-intervening-writes-validation)

护卫交接和结果复用 11 个完整函数档案、动作表及 9 个已有字节视图。六段新增读取共用一次 REA 会话。三组本机帧对照和原有距离夹具供同一 BF-T36 使用，162 项本机回归通过。两个战斗能力共用一份实现差异。 [取证复用和本机回执](validation.md#battle-266-relay-retirement-validation)

工作量直接记入原规格、实现差异和验收回执。计时覆盖准备、查证、汇编或字节核对、规则整理、差异对照和验收中实际发生的工作，并纳入工具用时。排程只保留当前待决问题及下一条证据入口。

| 估算项 | 工作量口径 | 校准依据 |
| --- | --- | --- |
| 剩余分析与规格 | 按尚未判定的操作和共享规则计，记录复用数、新查询数及从准备到规格可交接的用时 | 有适用旧证据的操作采用同类回执。缺同版材料的规则记录恢复条件及所影响的依赖 |
| 实现和返工 | 每项规则差异由负责模块计一次。各端计实际的适配差异，记录实现、回归及因规格变化发生的返工 | 统一复核后的首个 D0 批次，随后按同类实现调整 |
| 产品及设备验收 | 共用用例准备一次，各端按实际环境执行所需用例 | D5/D6 的实际产品、设备和会话回执 |

从以上工作量计算交付依赖上的工期。优先安排会挡住后续批次的规则，允许独立的现有证据复核继续推进。仅把影响依赖完成的同版材料、设备和账号等待计入相应的交付日期，重叠时段只计一次。比较节省时保持原需求、基线和验收口径一致。记录每条共用规则涉及的操作数、实际分析次数、实现处数和用例数，可分别观察重复工作和返工是否下降。 [历史回执与复用对账](validation.md#capability-first-batch-review)

按现有回执，四批有已知入口的分析从准备到规格核验各用 14 分 44 秒至 23 分 51 秒。F5A 的两个候选操作批次共用 7 份来源档案及 54 个同名测试用例。相关准备和规格合成可以共用，实际节时取决于合批后的作业时间和返工。待同版游戏交接材料影响分析准入，无测试账号影响 D6 联合执行，两者分别计入各自依赖。 [耗时、重复工作与边界](validation.md#capability-first-effort-check)

同一份批次回执先记操作范围与基线，收尾补齐已成规操作、仍需取证的规则、等待材料、去重后的实现差异和共用用例。实际作业时间覆盖找证据、取证、写规格和核对，其中 REA 查询耗时作为明细。材料等待单列。用同类操作的实测区间估分析余量，再用首个 D0 批次实测校准开发和返工。40 个能力域的规格状态用于查覆盖，工期以未决规则和交付依赖为准。

F5A 置顶和候选管理从准备到规格核验分别用时约 16 分 33 秒和 23 分 51 秒。两批合计约 40 分 24 秒，REA 查询约 4 分 42 秒，占经过时间的 11.6%。后批复用了 7 个同源 REA 函数档案，两批的回归用例有 54 个同名标题。这两笔可以校准入口明确、已有证据可复用的列表专项。接下来按批次实测合并规格、共用实现和回归带来的工作量变化。 [两批对账](validation.md#capability-first-batch-review)

按每组减少的待决规则、合并后的实现差异和准备至交接的用时评价效率。已有证据、符合规格的 stage306 实现和同条件的验收用例按适用范围复用。能独立推进的批次先按相近操作给区间，随后滚动更新。完整交付日期还取决于对应版本来源、宿主条件和联合验收，项目节时比例需按同一范围实测。 [剩余能力排程](#capability-first-scheduling)

F5A 的置顶和取消置顶共用一次入口核对，复用 6 份完整 REA 档案，补查 4 个函数。分析引擎首次载入计入查询的 93.65 秒。专项从补证启动到规格核验的经过时间沿回执记录，用于校准下一组已有明确入口的操作。 [专项耗时与范围](validation.md#f5a-pin-publication-validation)

F5A 的目录恢复与宿主选择复用 11 份档案，补一次过程归属和两段原字节。三次 REA 调用合计 92.532 秒，包含首次载入。目录输入、保存读回与两条续接路径共用一个规格和原验收组。 [取证与三端入口对照](validation.md#launcher-directory-host-handoff-validation)

同一列表的筛选、备注和排序合组复用 10 份 REA 档案并补查 19 个函数。查询累计 188.11 秒，包含两次分析引擎载入。筛选显示、备注修改和排序恢复共用原列表及设置接口，用时按同一批记账。 [本批用时与用例](validation.md#f5a-candidate-management-validation)

备注对话后续复用 11 份 REA 函数档案和已有 Windows 夹具。两次调用取得 1 份新档案和 1 份证据 ID 相同的历史档案，累计 93.62 秒，包含首次引擎载入。保存与回复准入合用 LS-T17、LS-T20。 [调用用时和回归](validation.md#f5a-note-modal-admission-validation)

同一份微信素材的临时读取、分块拒写及重开对照已归入 X03/X05。两项共用已证的 ZIP 解析器和失败用例，D0/D5 按真实配额回执接线。现有 61 项资源和缓存回归通过。 [对照与回归](validation.md#wechat-sdk-archive-ordinary-quota-validation)

集中整理规格有前期成本。交易和仓储核验的 101 个来源视图中复用了 95 个。角色五组需求合成 24 项操作时复用了 33 份完整 REA 记录，新增函数查询为零。stage306 的一次全量回归为 3,779 项、335.25 秒。分析阶段按组核证，产品批次合并时运行适当的全量回归。 [交易和仓储核验](../analysis/capability-first-v1/game-trade-storage-validation.json) · [角色规格核验](../build/analysis/character-operation-composition-v1/validation.json) · [回归时长](../build/analysis/game-work-context-v1/regression-receipt.json)

Item 经典窗口恢复复用 19 份 REA 函数档案，补查 4 份函数和 3 处调用归属，累计约 102 秒。普通重建与战斗重开直接复用 SD-CASE-12 至 SD-CASE-16 的共同验收。 [来源与对照](validation.md#legacy-item-classic-rebuild-modes-validation)

Item 的 `9/252` 复用 10 份完整 REA 函数档案，只补 1 个绘制调用的指令归属。一次核对同时明确恢复状态、对象推进、输入清理及工作上下文顺序。D0/D2/D3 在现有运行时中按同一份规格接线，各业务共用次序用例。 [证据复用与本机核验](validation.md#legacy-item-double-window-frame-validation)

首次配置复用 5 个完整 REA 函数体和 1 个既有进程创建调用视图。补查 2 个位置，其中 1 次在消息表数据上没有指令结果，改用原文件字节验证。配置窗口、文件提交与游戏续接共用一组用例，既有配置和启动规划的 15 项本地回归通过。 [取证与本机对照](validation.md#first-config-outcome-validation)

经典图鉴复用 15 份 REA 函数档案和 3 份既有派生视图，新增 1 个指令归属核验。按钮、快捷键与详情沿一套窗口规则和 SF-A27 用例接入，资料以现有图鉴记录及战斗分类投影为基础。 [取证与本地回归](validation.md#legacy-se-classic-album-ingress-validation)

经典图鉴的入口复核继续复用这 15 份档案和 3 份视图，只新增两次刷新函数查询，合计约 59 秒，含首次引擎载入。工具栏、列表和详情的 27 个登记位置共用一次帧分派核对和一组验收用例。 [入口与查询回执](validation.md#legacy-classic-album-entry-admission-validation)

经典技能窗复用 4 份完整 REA 档案、8 份派生视图和 Item 的现有规格。新增 1 份完整 REA 档案和两份独立视图，一次核对普通与战斗入口，沿原 WK-T02、WK-T23 和 BF-T07 交接。 [取证与本机对照](validation.md#legacy-se-classic-work-entry-validation)

105 与 106 合用 18 份 REA 函数档案、2 份派生调度视图及已有引用。新增 REA 查询为 0，分身入队与游标读写进入现有 BF-D7 和两条战斗用例。 [取证与共用回归](validation.md#battle-105-106-callback-order-validation)

出售、鉴定和修理合用 14 份 REA 函数档案及 6 份派生视图，新增 REA 查询为 0。三种报价复用同一核价入口和报价选择规则，现有 7 项商店回归通过。 [取证与共用回归](validation.md#legacy-shop-quote-drag-validation)

背包发布与邮件附件合用 9 份 REA 函数档案、14 份派生视图和 2 份指令记录，新增 REA 查询为 0。本机 33 项相关回归通过。三类背包发布和三套表单复用一组槽变化及重开用例。 [取证与用例](validation.md#legacy-se-mail-attachment-refresh-validation)

背包字段、入场与说明共用两份样本的 24 份 REA 函数档案，新增 REA 查询为 0。34 项现有本机回归通过。全量、逐槽与入场共用已有状态、字段解码和验收用例。 [核验及接线范围](validation.md#legacy-full-inventory-publication-validation)

制造材料、普通背包和经典窗复用 22 份 REA 函数档案、7 份独立派生视图和 2 份指令记录。补核四个原件范围，新增 REA 查询为 0。16 条本机组合和 28 项相关回归通过，现有用例继续承接三端。 [取证与共用用例](validation.md#legacy-se-craft-inventory-selection-validation)

交易复用 21 份 REA 函数档案、13 份独立派生视图、2 份指令记录及已核发布格式。补核三个原件范围，新增 REA 查询为 0。18 条本机组合、5 项客户端回归与 1 项现有生成 Page 的本机交易流程通过。 [取证与共用用例](validation.md#legacy-se-trade-inventory-confirmation-validation)

经典交易的宠物与金币继续复用同一确认和输入规格。13 份完整 REA 档案与 20 份派生视图重核原件，新增 REA 查询为 0。29 条本机组合覆盖两种编辑状态和关闭重开。 [取证与共用用例](validation.md#legacy-se-trade-pet-gold-validation)

第二套交易窗复用 8 份 REA 函数档案与 2 份派生视图。两次 REA 函数查询返回缺少函数边界，随后用同一临时分析工程生成两个必要回调视图并核对原件。两个列表模式沿同一消息格式器及交易所有者交接，余额与相位用例一起核验。 [取证与本机对照](validation.md#legacy-se-alternate-trade-gold-validation)

本方物品、宠物选择共用 10 份留存 REA 档案及 3 份已有派生视图，补查三个函数及两个具名派生回调。用同一组背包与交易用例核移动参数、阶段及发布。交易确认和数量框沿现有模块归并。 [取证与本机对照](validation.md#legacy-se-alternate-trade-selection-validation)

接收、断线、选角、图鉴及来信共用一份顺序规则。复用 29 份 REA 函数档案，只新增 Item 断线标记的 1 次数据引用查询。以现有解码和会话入口完成本地对照，验收仍用原 CF、GF、SF 用例。 [来源复用与回归](validation.md#legacy-receive-retirement-order-validation)

G06 与 X02 共用档位、呈现和恢复规则。本次复用 10 个函数体，只补查 Item 的 4 个具名函数，沿一组用例对照现有配置和合成入口。 [图形取证与用例核验](validation.md#legacy-render-admission-validation)

两版设备准备复用 4 份完整函数档案，补核 28 个具名指令和引用。候选重试、设备准备失败和两种文件结果共用 PR-A10，现有配置与启动接口复用同一组回归。 [取证与回归](validation.md#legacy-render-device-preparation-validation)

11 月版自更新复用 7 份现成函数档案，补查 4 个决定接管与启动确认的函数及 1 份资源表。四次 REA 函数调用合计约 4 分 36 秒。登录、更新、补丁、启动和退役直接沿用原用例与三端端口。该时长只计 REA 函数调用。 [来源复用和本地核验](validation.md#f5a-update-handoff-validation)

SKL266 自身护卫复用 9 个函数体及已存命令回调，补核 9 处指令。独立护卫、同槽和无外部 RID 归入同一份结果队列规格，复用现有共享入口核对差异。 [取证与回归](validation.md#battle-266-self-guard-context-validation)

投射物返程复用 1 份 REA 函数档案和 9 份原字节窗口，仅新增 1 处第二次测距调用的 REA 核验。现有角色队列、测距和飞行物所有者继续复用，差异归入 BF-D7，按 BF-T36 验收。 [返程核验与回归](validation.md#battle-266-return-order-validation)

SKL266 同帧对照复用原命令调度、清零帧和结果写入。新增两次精确引用查询。404、405 和 266 用同一套合组与前后帧用例，按写入字的位置交接给 D0/D4。 [原版与共享入口对照](validation.md#battle-266-same-frame-validation)

图形与输入的重建顺序复用 15 个 REA 函数体和一份原窗口过程派生记录。新增四个 Item 函数档案及三个地址归属查询，将两版的绘制忙、输入消费和排队行为写进现有 PR-A10。 [本批核验](validation.md#legacy-render-system-key-validation)

G12 与 X02 共用一份训练等待规格。复用 22 个 REA 函数体和 5 个已存派生视图，新增 5 个 Item 函数查询。用同一个本地共享入口对照六种收发时序，确认需要一次集中处理的差异。 [训练取证与本地对照](validation.md#legacy-pet-training-wait-validation)

经典训练再输入和确认复用 16 份完整 REA 记录及 6 份派生视图。补查 2 个 Item 控件函数，查询累计约 101 秒，含分析引擎首次载入。工作量按共同帧与训练业务差异各记一次。 [取证及回归](validation.md#legacy-pet-training-controls-validation)

L03、L06 与 L08 合用补丁等待到登录续接的证据。复用两份已有来源审查，只新增一个阶段选择函数的分析和一份调用引用核对，验收沿同一组阶段、编号及任务槽用例。 [补丁与登录的组合核验](validation.md#f5a-patch-completion-validation)

登录计时器与普通退出合用两版的提交、候选、轮询与停止证据。本批复用 6 份 REA 函数档案及 4 份组合视图，新增 10 份完整函数档案，其中 C82 两项已有一致的批量伪代码。把查到的截止优先级和宿主调度差异直接归入 LS-D2 与原验收用例。 [取证复用与本地对照](validation.md#launcher-login-timer-dispatch-validation)

连接维护和关闭回执沿已有 LS-D3 与 LS-T20 合并。F5A 四次补查累计约 98 秒，包含分析引擎首次载入。现有流会话、三个宿主端口和原测试复用在同一组案例。 [取证与回归](validation.md#f5a-pump-retirement-validation)

F5A 启动路径复用 10 份 REA 函数档案并补查 8 份。新增查询累计约 191 秒。15 个静态分支和 7 个合成库存对照共用一份规格，D0/D1/D5 统一引用。 [取证和本机核验](validation.md#f5a-path-preflight-validation)

F5A 的列表到确认复用 6 份 REA 函数档案，补查 3 个列表函数。三次查询累计约 94 秒，含首次载入分析引擎。既有回复、登录与交接入口继续使用，排序、筛选和行映射差异在 D1/D5 共用同一份规格。 [取证与对照](validation.md#f5a-profile-list-projection-validation)

经典对话与治疗复用 12 个 REA 函数档案和 3 个既有派生视图，补查 5 个 Item 函数，并核对两版的实际登记。共享窗口规则记录一次，治疗与图文确认沿原 OS-D5、OS-D7 和用例接入。 [取证与本地对照](validation.md#legacy-classic-dialog-frame-hook-validation)

两份历史样本的第二套窗口复用 28 份函数档案和 9 份派生视图，新增 2 个函数档案。X02、G12、G18、G19 共用选中、缓存、预览及配对退役用例。 [来源与用例](validation.md#alternate-window-selection-and-cleanup-validation)

两版启动档位复用 11 份 REA 函数档案，只补 3 次命令尾与十进制扫描查询，累计约 160 秒，含两次引擎载入。沿 PR-A10 一次核启动输入、默认、低字节及覆盖。现有配置和启动回归合并执行。 [本批取证与本机对照](validation.md#legacy-render-startup-tier-input-validation)

两个 F5A 列表和两个固定 SE 数量专项从准备到核验约 15–24 分钟一组，可校准入口明确且已有来源的同类分析。总工期沿未决规则和实际开发差异估算，并按依赖链加入同版游戏材料和真实会话的等待。 [列表工时](validation.md#capability-first-batch-review) · [数量偏好工时](validation.md#fixed-se-stack-quantity-input-preference-validation) · [数量窗工时](validation.md#fixed-se-alternate-inventory-quantity-validation)

[能力矩阵](../analysis/capability-first-v1/capability-matrix.json) · [机器可读计划](../analysis/capability-first-v1/implementation-plan.json) · [共享接口合同](../analysis/capability-first-v1/shared-target-contract.json) · [11 月 11 日流程复核](../build/analysis/capability-first-workflow-review-v1/validation.json) · [经典窗口用例核验](validation.md#legacy-item-classic-open-transition-validation)

<a id="capability-first-execution"></a>

### 执行约束与分析停止条件

执行顺序和停止条件见[当前流程](#capability-first-workflow)，各组的缺口处理见[当前排程](#capability-first-scheduling)。以需求能力和完整用户流程为工作单位，在原规格、能力矩阵和对应开发批次中维护证据、差异及验收条件。

### A：先完成统一分析和可追溯规格

当前推进 A2/A3，A1 的全部发现范围保持开放。已取得[源入口清单](../analysis/capability-first-v1/entry-inventory.json)：传统窗口 67 槽/66 描述符、2,309 控件出现位置；另一套表 99 行/97 个非空回调；主表 14 槽/12 个明确状态；复用 104 文本接收分支/60 个格式化发送函数，并登记分析登录器的 14 个对话框/84 控件/6 菜单命令。这些只是限定来源入口，不是全部功能覆盖率。

2,768 处回调及收发引用已去重为 647 个函数入口。先复用现有引用，再在独立分析副本一次恢复 480 个缺口入口；73,645 指令/258,651 字节全部匹配固定原文件。647 入口现在都有[证据索引](../analysis/capability-first-v1/entry-evidence-index.json)，但业务条件/状态/生命周期尚未整体复核，不能将引用齐备写成规格闭合。

共同传统窗口的[来源规格](../analysis/capability-first-v1/window-engine-contract.json)已集中登记帧顺序、事件位、owner、重排、同步/延迟关闭及业务析构差异。25 个规范函数体/7,338 字节、8 个派生回调/2,634 字节均核原件；其中仅 12 个规范函数和 1 个动态回调为本组补证，其他复用。该组不是全部窗口/业务已分析完成。[来源核验](../analysis/capability-first-v1/window-engine-source-check.json)

647 根入口的已登记地址集/视图已全部复用定位（这是工具范围，不是业务路径完整性证明）：143 规范留存、503 旧派生、1 组合证据；没有重新反编译这些根。形成 3,506 条静态调用边和 160 根在所选图内的可能收发路径；路径条件未审查、图外被调用者不外推，72 根暂无旧能力候选。[业务索引及边界](../analysis/capability-first-v1/business-entry-map.json)

另一套窗口的活动槽/恢复、dirty 清理、不同事件编码和共享焦点已形成[来源规则](../analysis/capability-first-v1/alternate-window-contract.json)；16 个相关体/2,392 字节核原件，其中仅 7 个辅助函数新补证。c82f 两组[登录器消息表](../analysis/capability-first-v1/launcher-message-map.json)前序定位 24 条 WM_COMMAND 和 2 个菜单命令，后续类/模板归属见下述绑定。

登录器类/模板已集中补证：18个基初始化调用者、13个vtable及消息继承链，11个模板ID有构造路径；主133的24个命令按对象作用域绑定。共同Surface基类接收7900/7927，但调用者随后写入不同末级类。模板296的一个数字匹配实际位于删除析构分支，未将它误报为资源使用。[绑定与边界](../analysis/capability-first-v1/launcher-dialog-bindings.json)

游戏lookup的6个直接调用已核，新增派生82字节toggle按图形缓存是否存在选择open/close并忽略其返回值；两条旧交互入口及延期动作中的恢复字段也已绑定。实际callback列消费者仍未确定，有限直接搜索不证明框架无用。[分发补证](../analysis/capability-first-v1/game-dispatch-findings.json)

预设的七字段、LPS1 文件语法、选择/重命名/删除/排序、单次撤销和外层取消/重开已归入[来源合同](../analysis/capability-first-v1/launcher-presets-contract.json)，54 个完整体/16,779 字节按固定 c82f 核对；它不等于整个 L04/L08 完成。此后补证已把目录匹配、普通登录及回复后ID选择成合同；本组进一步核对同版目录字段、筛选/分组/选择恢复和准备回调，四动态控件及上下文动作7926已有创建/分派来源；完整目录/安装、编辑持久化、全关闭/重入、模板296/30721/30734和其余4菜单继续审查，再归并游戏实际分发、图形/输入/恢复。已纳入版本/关联模块和动态发现仍保持边界，不穷举无关历史版本，不因找不到直接消费者删需求。4a8e20及G18/X02研究保留，分支开发延后。[前序类/分发核验](../analysis/capability-first-v1/dispatch-bindings-validation.json) · [预设核验](../analysis/capability-first-v1/launcher-presets-validation.json)

预设应用已扩展到普通登录与回复后ID选择：[37体/41范围来源核验](../analysis/capability-first-v1/launcher-apply-source-check.json)中有16新规范dossier、9旧规范体、12个旧workflow伪代码+当前范围/汇编组合体；后者不冒充新dossier。52,453字节旧伪代码已复用，不重做其反编译。规则包括目录唯一性/归属、输入密码、账号/选项变化转手动、回复后唯一且可用ID的单次消费，及键盘提示/普通登录定时器的区别。[合同](../analysis/capability-first-v1/launcher-apply-contract.json)

本组[目录/状态合同](../analysis/capability-first-v1/launcher-catalog-state-contract.json)绑定49体/43,452字节；复用14旧规范体、5旧伪代码组合体。独立副本只补两个参数存储原型，425790/41cc70的删除块警告32/102降到0，五调用者1,624指令/6,267字节不变；派生视图与规范REA分开。+0x1694已纠正为游戏ID筛选词，预设字段2绑定Game.EXE；c7ba历史目录/元数据规格不合并为c82f证据。[核验](../analysis/capability-first-v1/launcher-catalog-state-validation.json)

本组已集中补证本地ID元数据：备注/置顶/顺序修改、账号-游戏类型-ID键和INI读写、重置与单次撤销、运行时备注窗口及保存失败恢复尝试。+0x1998实际为排序撤销可用标记；7209/720a是重置/撤销，本组未观察导入导出入口，不据旧推测新增能力。完整关闭/重入、OS代码页和实际存储仍待验。[合同及来源](../analysis/capability-first-v1/launcher-id-metadata-contract.json) · [核验](../analysis/capability-first-v1/launcher-id-metadata-validation.json)

本组已把同c82f的XML目录生产/默认/上限、游戏资格、HKCU及INI目录发现、模板295手动提交、App/Frame/Main及选定任务引用/关闭链集中成规。70体/71范围34,417字节及两个95字节独立派生回调均核原件；旧伪代码和规范dossier分别保留，REA导出/快照各636并关闭。原程序、运行功能与全量产品回归均未新增。[合同](../analysis/capability-first-v1/launcher-catalog-install-contract.json) · [来源](../analysis/capability-first-v1/launcher-catalog-install-source-check.json) · [本组审计](../analysis/capability-first-v1/launcher-catalog-install-validation.json)

本组已核同版路径子谓词：点段、盘符首字节分类及UNC服务器/共享边界；FID冲突名称由实际callee及0x103/多字节标志核定。菜单128经LoadMenu/CreateEx进入窗口创建请求，失败清理和命令委派、目录任务WM_CREATE/80C9/80CC及两字段启动门槛已成规。26体/27范围14,658字节核原件，含13新规范、10旧规范、3旧伪代码组合；REA各662并关闭，无运行功能变化。[合同](../analysis/capability-first-v1/launcher-host-routing-contract.json) · [来源](../analysis/capability-first-v1/launcher-host-routing-source-check.json) · [核验](../analysis/capability-first-v1/launcher-host-routing-validation.json)

本组已把同C82的文件加载/错误标志、编码模式、节点分派、名称/属性、文本/实体和局部失败发布归为[XML来源合同](../analysis/capability-first-v1/launcher-xml-contract.json)。34体/35范围14,930字节及一个70字节数值分支补证匹配原件；规范体的缺失跳转和派生视图区分保留。28项当前独立解析器行为实测与静态期望有24个选定属性差异，说明D1须先按来源字节语法/节点取值再解码，不能只放宽现有字符串解析器。未改产品代码、未运行原程序；REA各721并关闭。[来源](../analysis/capability-first-v1/launcher-xml-source-check.json) · [核验](../analysis/capability-first-v1/launcher-xml-validation.json)

本组[App与登录任务合同](../analysis/capability-first-v1/launcher-lifecycle-contract.json)已绑定实际CRT入口、四自定义零初值、候选索引/次数、独立DNS job引用和定时器、普通stop/close/destroy及回复忙碌门槛。27体/32范围11,768字节，另有三个指针表绑定的独立LLVM视图108字节/20指令；12新规范、7旧规范、8旧伪代码组合分别计数。REA导出/快照各762并关闭，无产品改动。[来源](../analysis/capability-first-v1/launcher-lifecycle-source-check.json) · [核验](../analysis/capability-first-v1/launcher-lifecycle-validation.json)

本组已补[同C82连接身份/回调/关闭规格](../analysis/capability-first-v1/launcher-channel-contract.json)：正常注册/序号校验、回调借用、0x332 pump及重入门槛、帧回调后重查、Stop意图与正常析构等待成规。43体/43范围16,770字节及36组锚点核原件，16旧伪代码组合直接复用；23新规范中一份重复旧伪代码，单列而不增加语义覆盖。REA各854并关闭，无产品变化。[来源](../analysis/capability-first-v1/launcher-channel-source-check.json) · [核验](../analysis/capability-first-v1/launcher-channel-validation.json)

本组已把四个弹窗家族的普通所有者/模态循环/结果恢复、登录停止后错误提示和XML七类删除/递归清理/诊断与发布边界集中成规。57体/58范围22,705字节、12处数据、36组锚点均核原件；23旧规范与7旧伪代码组合继续复用。REA各924并关闭，无产品改动。[合同](../analysis/capability-first-v1/launcher-modal-recovery-contract.json) · [核验](../analysis/capability-first-v1/launcher-modal-recovery-validation.json)

本组已补X03官方声明与独立整体资源合同。下一组将RP-D1..D7与完整共享上下文/源规则归并复核；统一必要规格通过后按D0实现context/预算、fd/Blob源、manifest/store及恢复，再接D1–D6。真实平台、完整语料和同版外部接受继续单列。


### 当前共享分析批次（不新增需求）

| 组 | 共用问题 | 涉及能力 |
| --- | --- | --- |
| RG01 | 来源版本与正常交接 | L07、G01、G02、X01、X07 |
| RG02 | 登录器配置、更新与任务生命周期 | L01、L02、L03、L04、L05、L06、L08、X06 |
| RG03 | 共用状态、输入、时钟和重建 | G03、G05、G07、G08、G09、G10、G11、G12、G13、G14、G15、G16、G17、G18、G19、G20、B01、B02、B03、B04、X02 |
| RG04 | 游戏连接、角色与接收发布 | G01、G02、G03、X06 |
| RG05 | 地图、人物、资源、文本和音频 | G04、G05、G06、G07、G08、X03 |
| RG06 | 背包、服务、交易与工作 | G09、G10、G11、G12、G13、G18 |
| RG07 | 社交、家族、留言、图鉴与邮件 | G10、G14、G15、G16、G17、G19、G20 |
| RG08 | 完整战斗命令、身体与退出 | B01、B02、B03、B04、G05、G08、G09、G18 |
| RG09 | 网页、移动网页及微信宿主 | L08、G06、G07、G08、X03、X04、X05、X06 |
| RG10 | 真实同版联合接受 | L07、X07 |
| RG11 | 全需求发现与单一追溯入口 | X01、X08 |

完整问题、具体下一来源及动作以[统一矩阵](../analysis/capability-first-v1/capability-matrix.json)为准。分组降低重复取证和跨页面重复实现；本轮未取得可用于整体工期或节时百分比的测量。

### D：统一分析完成后，按依赖批次复刻

| 批次 | 主要能力 | 复用与交付边界 |
| --- | --- | --- |
| D0 共用底座 | X01/X02/X03/X06、G06/G08 | 先合并版本、资源、状态/调度、读写和传输的共同合同；保留已验实现，只补规格确认的差异 |
| D1 登录器闭环 | L01..L08 | 配置/目录、更新、交换、选择、交接统一落地；游戏联合接受与 D2/D6 配套验收 |
| D2 游戏基础闭环 | G01..G07 | 连接/选角/建角、主流程、场景、人物、移动和呈现；复用 D0 |
| D3 普通业务 | G09..G20 | 背包、交互、商店/训练、交易/仓储、社交、家族、留言、全部工作、图鉴与邮件，共用所有者成组接入 |
| D4 战斗闭环 | B01..B04 | 按完整命令覆盖表处理生产/播放、输入、回合、退出及恢复，复用普通人物/技能/物品/资源 |
| D5 目标平台 | X04/X05，L08 的宿主接线 | 网页/移动网页/微信薄适配、完整产品流程、DevTools 和设备验收；核心业务保持一份 |
| D6 同版联合兼容 | X07 | 对应版本的真实登录、正常启动、业务及断开/恢复；真实测试条件不足时保留缺口 |

以上是依赖批次，不要求重写既有模块，也不为每个小分支再建立一套阶段文档。批次内按具体输入和状态边界实施；发现规格冲突先修订相关能力及依赖，再继续受影响实现。`native/` 保留历史状态。

### 验证和文档安排

- 分析阶段在能力组收尾时核对证据身份、字节、分派覆盖及状态规则。需用本机结果判定实现差异时，同基线和同输入的回归在组内合并执行。
- 开发期间运行受影响模块及共享状态边界的有意义回归。改变产品输入/画面时补实际产品流程；共享核心影响扩大时扩大回归。
- 每个开发批次合并时运行适当的集成、生成产物和全量回归；失败或新风险再补测，不把上一批结果当本批结果。
- 需求清单维护当前能力状态，开发计划维护当前顺序。阶段结束更新 README 和受影响的分析/架构/接口/资源/运行/验收/问题文档，用来源链接复用细节，不再给每个细分支复制整套进度描述。原有历史证据继续保留。
- 六个维度分别记录：来源证据、规格闭合、共享实现、本地产品、实际平台/设备、同版官方接受；任一维度通过都不替代其他维度。

<a id="stage306-work-context"></a>

## stage306 技能上下文及 type5 请求切面交付

继续按“REA 分析 → 可追溯规格 → 独立共享实现 → 兼容性验收”推进，实施前已建立[需求开发方案](../analysis/game-work-context-v1/implementation-plan.json)。本轮闭合 5e2778 的实际用户回调、61／62 请求、配方上下文归属及重查、工作耗时和 rank+1，以及 type5 的等级／MP／坐骑子体条件。[本轮验收](validation.md#stage306-work-context)

已完成 8 项新增源码、102 项生成 API、3,779 项完整检查和 16 条实际资源本地产品流程。保持旧制造、物品工作、目标技能和连续采集入口。后续继续 REA 追踪 c5bd1b 作业等级字节的动态写入者、原生窗口计数和剩余消费者，再完成有证据的共享实现；全部 37／10 原始范围及真实平台／官方接受保留。

<a id="stage305-work-targets"></a>

## stage305 普通目标工作和采集切面交付

本阶段继续“REA 分析 → 规格 → 独立共享实现 → 本地验收”。已从 472a10 追踪两级目标请求、角色／宠物数据来源、已知 type3／221..224 的提交与结果，以及已知 type4 六个 id 的连续采集时序。实施前已有[需求开发方案](../analysis/game-work-targets-v1/implementation-plan.json)，来源与验收分别留档。[结果](validation.md#stage305-work-targets)

普通上下文 0 的已知消费者本地已实现，保留对制造、修理／鉴定／刻印／装饰的实际产品复测。后续继续 REA 追踪非零上下文的切换、重查和成本／耗时缩放，以及 472a10 的 type5 等其余普通分支，再落实有证据的消费者；原生动画／窗口别名、原始战斗消费者组及真实平台／官方接受仍在完整目标内。

<a id="stage304-work-actions"></a>

## stage304 普通物品工作与装饰切面交付

沿既有制造所有者完成下一段“REA → 可追溯规格 → 独立实现 → 本地验收”：固定 37c4 样本的 type2／217..220 和 type1／255 已进入共享核心及实际网页／Page 操作。实施前已有[需求开发方案](../analysis/game-work-actions-v1/implementation-plan.json)，结果见[验收](validation.md#stage304-work-actions)。

范围是普通上下文 0 的武器修理、防具修理、鉴定、刻印和装饰，不是全部普通技能。下一步继续 REA 追踪 Lor kind3 的治疗／急救／变身／变装和 kind4 的采集／发现输入及结果，再实现消费者；非零上下文和重查、原生动画／全局别名／RNG 节奏、真实平台及全部原始游戏组保留。完整项目目标仍 active/incomplete。

<a id="stage303-craft-input"></a>

## stage303 制造输入与结果切面交付

本阶段沿已接收配方继续 REA：固定 37c4 样本中的技能／等级选择、材料分配、耗时、提交和结果链已落实到共享核心与实际网页／Page 操作。实现前已有[需求开发方案](../analysis/game-craft-input-v1/implementation-plan.json)，结果见[验收](validation.md#stage303-craft-input)。

本地实现只覆盖 kind1、identifier 非 0xff、普通上下文 0。后续先分析修理／合成／上下文切换及重查，再实现其消费者；保留全部原始游戏组与真实平台验收。当前阶段切面可交付，完整项目目标仍 active/incomplete。

<a id="stage302-craft-recipes"></a>

## stage302 配方接收完成与制造输入下一步

本轮完成既有 kind1 自动查询→@_i 回复→技能所有者中的 56×5 配方状态→world／client 只读投影；删除技能同时执行来源部分重置。10 个规范函数／1,939 字节已核原 PE，新增 5 项源码／生成检查及完整 3,744 项回归通过。[计划](../analysis/game-craft-recipes-v1/implementation-plan.json) · [验收](validation.md#stage302-craft-recipes)

下一步沿 REA 追踪制造选择、材料分配、提交与结果消费者，并核对非零普通上下文的切换／重查；随后接入网页与 Page 的真实交互。其他控制、RID／自身／混合／空目标／本地停止、完整调度／UI、现行交接及真实平台继续保留。外部知识库 requirement-index 角色仍缺，采用仓库实时索引；原 37 项要求／10 组不删减。[目标](../analysis/game-craft-recipes-v1/goal-audit.json)

<a id="stage301-battle-item-dispatch"></a>

## stage301 ITM 结果与下一步工艺逻辑

本轮原计划核对 ITM 1–5；REA 证明该样本仅为 0／6／7 生成效果，其他值读取后返回且不完成命令。本轮据此保留现有运行实现，不新增无来源效果。63 项源码及 63 项生成检查通过。[实施记录](../analysis/game-battle-item-variants-v1/implementation-plan.json) · [规格](../analysis/game-battle-item-variants-v1/implementation-spec.json)

下一步从已确认的 4f0290／4ff030 与请求入口追踪工艺配方、普通上下文及真实输入／回复闭环，再实施完整切面。其余控制、RID／自身／混合／空目标／本地停止、UI／调度、现行交接与实际平台仍在范围。37 项原始需求／10 组保持；外部知识库 requirement-index 角色仍缺，沿用仓库实时需求入口。[范围](../analysis/game-battle-item-variants-v1/goal-audit.json)

<a id="stage300-city-water"></a>

## stage300 回城水面完成及下一步

本阶段完成五种既有回城路径中的水面状态绑定、场景返回的角色创建边界、嵌套捕获与外层更新分离，以及等待回复期间网页／Page共用Canvas的连续绘制。独立1,800状态、98整帧、完整3,739回归及20条产品路径通过。[结果](validation.md#stage300-city-water)

继续未移植控制、RID／自身／混合／空目标／本地停止、完整游戏交互与调度、现行交接及真实平台。其他main9／初始／错误／停止与原生缓存仍单列；37项原始需求／10组和来源身份保持。外部知识库requirement-index仍缺，当前仓库需求索引为入口。[完整范围](../analysis/game-city-water-v1/goal-audit.json)

<a id="stage299-battle-water"></a>

## stage299 正常战斗水面完成与后续

本阶段用REA闭合main9/3→main10→main9返回的本地对象、9250c8门槛、嵌套捕获与外层呈现。共享水面所有者拆分consume和savePosition，接通战斗特殊图形，缓存背景复制不重置振幅；提前收到own unit时按实际本地对象存在推进相位。3,731项回归及8条实际材料产品流程通过。[验收](validation.md#stage299-battle-water)

下一步继续其他main9／城市／错误／停止分支、未移植控制与RID／自身／混合／空目标／本地停止、完整调度和UI、现行交接及真实平台。正常战斗完成不等于这些分支完成；原37项需求／10组保留，外部知识库requirement-index仍缺，当前仓库需求索引为入口。[完整范围](../analysis/game-battle-water-v1/goal-audit.json)

<a id="stage298-ordinary-water"></a>

## stage298 普通水面完成与后续所有者

本阶段完成普通地图水面状态、类型8条带命令、绘制／文字／资源库接入，以及world和runtime的更新／呈现分离。原始特殊对象即使在辅助项裁减中被去除，仍保留该帧水面请求；普通3项、特殊4项预留同步修正。完整3,721项回归及8条产品路径通过。[证据](../analysis/game-special-graphics-v1/validation.json)

下一步沿REA核对战斗、返回和停止阶段的相位／位置／9250c8所有者，之后接通现有战斗特殊索引边界。继续其余RID／自身／混合／空目标／本地停止、完整调度与UI、现行交接和实际平台；37项需求／10组保持，外部知识库仍缺requirement-index，沿用当前仓库入口。[范围](../analysis/game-special-graphics-v1/goal-audit.json)

<a id="stage297-body-draw-flags"></a>

## stage297 身体164／165消费者结果

REA复用固定37c4快照，核对4函数／63,230字节与其中84字节控制分支；164／165只切换309，保留310／308等原字段并调用434a30。共享消费者、独立32组队列／160完整帧、门控和恢复边界已验证。[来源](../analysis/game-battle-gmn-flags-v1/source-check.json) · [验收](validation.md#stage297-body-draw-flags)

正常协议生产者仍待确认：当前独立GMN21队列未注入这两个动作；完整的PUSH imm32搜索无匹配，不排除其他存储或表驱动生产。下一步优先沿REA处理3096..3105特殊图形，并继续其余控制、RID／自身／混合／空目标／本地停止、完整调度／UI、现行交接及真实微信／手机。保留原37项需求／10组和缺失的外部requirement-index状态。[完整范围](requirements-index.md#stage297-body-draw-flags)

<a id="stage296-actual-battle-product"></a>

## stage296 实际材料产品路径通过

已在未修改的1072文件实际ZIP上完成两组CUT、四类入口的8条战斗产品流程，覆盖实际角色与背景、原动画信号、结果、退出及移动。源码／生成Page的结果一致；Node vm耗时差异已单独定位并留存受控绘制记录，不作为真实微信性能结论。[验收](validation.md#stage296-actual-battle-product)

下一步沿REA处理GMN164／165等未移植控制及3096..3105特殊图形，再继续其余RID／自身／混合／空目标／本地停止、完整调度与UI。现行交接、完整原场景和实际微信／手机验收仍在原37项需求／10组中。外部知识库仍缺requirement-index，当前仓库需求继续为入口。[范围](requirements-index.md#stage296-actual-battle-product) · [逐项来源](../analysis/game-actual-battle-product-v1/goal-audit.json)

<a id="stage295-battle-draw-style"></a>

## stage295 战斗绘制字段分离与后续

已用REA闭合506e80最终队列、对象默认值／复制、GMN及共享透明度写入和普通绘制链，12函数／73,349字节与原件相同。完成当前已移植回调的对象mask／ARGB绑定，原动画flag8与颜色保留；数字8位于两个字段的混淆已修正。[来源](../analysis/game-battle-draw-style-v1/source-check.json) · [验证](validation.md#stage295-battle-draw-style)

下一步扩大完整实际材料在产品战斗／退出／回场中的入口验证，并继续原特殊图形、GMN164／165等未移植控制、其余RID／自身／混合／空目标／本地停止、完整调度和UI。现行交接、实际微信／手机及官方验收继续保留，37项原始需求与10个未完成组保持active/incomplete。外部知识库仍缺requirement-index角色，本轮沿用仓库需求入口。[范围](requirements-index.md#stage295-battle-draw-style) · [逐项来源](../analysis/game-battle-draw-style-v1/goal-audit.json)

<a id="stage294-vertex-color"></a>

## stage294 普通ARGB消费者与后续战斗绑定

已核对9函数／12,101字节，接通普通绘制ARGB、逐命令透明混合与加色优先顺序。完整盘点所选六组动画头，并核验所有25个非默认颜色动作的112帧；17份命名载体中113305只有645字节，现按有效颜色范围处理。[来源](../analysis/game-vertex-color-v1/source-check.json) · [结果](validation.md#stage294-vertex-color)

下一步沿REA核对战斗帧中305／300动画样式与308／30f对象透明度的最终队列生产者，再接通战斗颜色、命名编号及已有独立opacity翻译；当前该专用绑定仍有显式限制。继续RID／自身／混合／空目标／本地停止、完整调度和UI、现行交接及真实微信／手机。37项需求、10个未完成组保持active/incomplete，外部知识库仍缺requirement-index角色，当前仓库需求为入口。[需求](requirements-index.md#stage294-vertex-color) · [目标核对](../analysis/game-vertex-color-v1/goal-audit.json)

<a id="stage293-additive-render"></a>

## stage293 加色消费者结果与下一步

已用REA验证设备初始化、普通／缩放绘制及动画标志生产者，8函数／11,232字节和D3D7 GUID完整匹配原文件，微软SDK头核对方法与枚举。共享软件帧缓冲实现来源D3D分支的ONE+ONE规则；真实113685效果与普通覆盖的28,804个像素差异经过独立比较，四种入口通过。[来源](../analysis/game-additive-render-v1/source-check.json) · [验证](validation.md#stage293-additive-render)

下一步核对任意顶点ARGB颜色的调制／透明度与普通绘制分支，扩大实际命名调色板／动画上下文覆盖。继续RID／自身／混合／空目标／本地停止、完整调度和UI、现行交接、实际微信／手机及完整游戏。37项原始需求、10个未完成组保持active/incomplete；知识库requirement-index角色仍缺，采用当前仓库需求入口。[需求](requirements-index.md#stage293-additive-render) · [目标核对](../analysis/game-additive-render-v1/goal-audit.json)

<a id="stage292-animation-named-palette"></a>

## stage292 命名调色板的最小实际消费者

已闭合action头→动画状态→普通队列→命名调色板映射→GraphicInfo→RD内嵌颜色→32位绘制。16个函数／7,426字节和1,495项／5,980字节映射全部匹配37c4原文件；共享资源库和延迟地图场景接通编号320，stage291的动画负例已转为当前正例。完整素材兼容继续单列。[来源](../analysis/game-animation-palette-source-v1/source-check.json) · [验收](validation.md#stage292-animation-named-palette)

下一步按REA追踪并实现加色标志8的限定绘制消费者，扩大命名调色板实际资源覆盖与其他动画绑定上下文；继续RID／自身／混合／空目标／本地停止、完整调度／UI、现行交接和真实微信／手机。37项原始需求、10个未完成组保持active/incomplete。知识库仍缺requirement-index角色，本轮使用当前仓库需求入口。[需求](requirements-index.md#stage292-animation-named-palette) · [目标](../analysis/game-animation-palette-source-v1/goal-audit.json)

<a id="stage291-legacy-minimap"></a>

## stage291 小地图结果及后续材料适配

已定位并实现AUT／普通索引颜色两条小地图路径，完成共享异步资源所有者、网页和Page显隐及107／54／27格范围控件。REA21个函数的9,427字节已与37c4原文件核对；原程序未执行。实际341CUT／337AUT的盘点纠正stage290的下一步判断：23是原创测试地图的缺文件，不需要为它补造材料。[来源](../analysis/game-legacy-minimap-v1/source-check.json) · [验证](validation.md#stage291-legacy-minimap)

实际59529静态CUT和AUT、普通模式颜色均通过8条产品流程。新增动画物件113058解析到54帧，但action0的paletteSelector320在场景绘制处明确拒绝；418个选取的实际CUT动画候选都有非零调色板编号，不能把它们一律当0。下一步沿REA核对非零动画调色板的来源、选择及实际材料版本关系，再扩展绘制；当前负例不算动画验收。

继续RID／自身／混合／空目标／本地停止、完整调度和UI、现行交接、实际微信／手机及完整游戏。37项原始需求、10个未完成组保持active/incomplete。知识库查询仍缺requirement-index角色，本轮沿用仓库实时需求入口，未修改外部知识库。[需求](requirements-index.md#stage291-legacy-minimap) · [目标核对](../analysis/game-legacy-minimap-v1/goal-audit.json)

<a id="stage290-legacy-material-compat"></a>

## stage290 从实际材料到页面像素的验收

本轮复用同一37c4样本的REA合同，重新核对31处字节／映射及42个文件名常量；按明确版本参数选择27个实际文件，验证七组资源槽、元数据、动画、调色板和PCM。既有产品实现已能完成本轮实际素材流程，无需修改运行代码。[需求](../analysis/game-legacy-material-compat-v1/implementation-plan.json) · [规格](../analysis/game-legacy-material-compat-v1/implementation-spec.json)

四条真实材料入口均完成7个原创TCP请求、两条移动请求和场景重建。首次默认原创场景需要材料中不存在的 `bin/PUK2/cutdat/23.cut`；已分别保留模式1缺文件负例和明确模式0正例。510次同组图形索引覆盖按原顺序保留，物理记录像素与最终槽位像素分开核验。[验收](validation.md#stage290-legacy-material-compat)

后续沿已有发布／补丁证据定位缺失CUT及其版本关系，再扩大实际地图与完整资源链；同时继续RID／自身／混合／空目标／本地停止等消费者、完整调度和UI、现行交接及真实平台。37项需求和10个未完成组保持active/incomplete。知识库查询仍缺requirement-index角色，继续采用项目实时需求文档。[目标](../analysis/game-legacy-material-compat-v1/goal-audit.json)

<a id="stage289-legacy-resource-archive"></a>

## stage289 独立资源包入口与后续完整资源链

原游戏Page复用更新器的64条目／32MiB整包解码和1,024文件候选，实际Bin却有1,071文件、约2.55GB及943,552,437字节单库。本轮建立单独的资源文件合同、共享ZIP／ZIP64解析、浏览器／wx薄适配及存储型打包工具；旧更新器保持原字节。[实施需求](../analysis/game-legacy-resource-archive-v1/implementation-plan.json) · [规格](../analysis/game-legacy-resource-archive-v1/implementation-spec.json)

完整回归3,657项及14条产品流程已通过；实际材料全文件完整性、3,216段读取、启动摘要以及超过4GiB的真实文件偏移已核验。产品流程使用原创273文件稀疏包，实际材料用于字节传输验收，两类证据分别记录。[结果](validation.md#stage289-legacy-resource-archive)

下一步继续实际所选资源的版本适配、完整渲染链和未闭合游戏消费者，并推进实际微信与物理设备。大型Deflate冷读取性能、完整调度、现行交接和官方账号兼容仍未验。原37项需求／10个未完成组保留，整体active/incomplete。知识库的requirement-index角色仍缺失，沿用本项目实时需求文档，未修改外部知识库。[完整范围](../analysis/game-legacy-resource-archive-v1/goal-audit.json)

<a id="stage288-legacy-battle-audio"></a>

## stage288 战斗音效与下一步资源导入

完成270条固定音效映射、对数声像、五次更新去重和64槽输出的来源核对及共享实现；两端已消费既有战斗声音事件。有声和静音流程分别验证回合、HP／MP、退出及继续行走。[实施记录](../analysis/game-legacy-battle-audio-v1/implementation-plan.json) · [结果](validation.md#stage288-legacy-battle-audio)

下一步先把整套游戏资源导入与更新器的64条目ZIP配置分开，验证完整资源及音频文件导入；本轮没有放宽该旧配置。继续其余游戏消费者、混合／空目标／本地停止、UI及完整调度、现行交接和真实平台。37项原始需求、10组范围保持；知识库仍缺本项目需求索引角色，当前仓库索引为真源。[目标核对](../analysis/game-legacy-battle-audio-v1/goal-audit.json)

<a id="stage287-legacy-battle-detached-rid"></a>

## stage287 分身RID的明确路径与后续

完成106的RID2000存储、消息接收者、实际资源及动作尾验证，并接入共享回调。独立对照保留新分身的零存储和目标原有动作；等待恢复另由真实管理器及产品流程验收。[需求开发记录](../analysis/game-legacy-battle-detached-rid-v1/implementation-plan.json) · [结果](validation.md#stage287-legacy-battle-detached-rid)

401自身效果已在stage275证明会交错同一目标库，本轮复核后保留拒绝；106无2000的RID及低等级116 RID仍进入未观察的原查找上下文。继续其他实际消费者、混合／空目标／本地停止、107显示语义、完整玩法与UI／音频／调度、现行交接及真实平台。37项原始需求、10组范围保持；知识库仍缺项目需求索引角色，使用当前仓库索引。[目标核对](../analysis/game-legacy-battle-detached-rid-v1/goal-audit.json)

<a id="stage286-legacy-battle-impact-skills"></a>

## stage286 五类共享消费者与后续

完成SKL4／97／106／111／116的来源绑定、限定队列／回调、独立方程和本机产品入口验证。统一独立身体工厂；辅助计数只访问登记的22槽。109烟雾坐标及97火花父指针已修正并重新验收。[需求开发记录](../analysis/game-legacy-battle-impact-skills-v1/implementation-plan.json) · [结果](validation.md#stage286-legacy-battle-impact-skills)

下一步继续闭合106与低等级116的分身RID存储、4的隐藏偏转几何、401自身效果、空目标／混合元数据／本地停止及107提示语义。保留37项原始需求、10个未完成消费者组、完整玩法、现行交接与真实平台范围；知识库查询仍缺项目需求索引角色，使用当前仓库需求入口。[目标核对](../analysis/game-legacy-battle-impact-skills-v1/goal-audit.json)

<a id="stage285-legacy-battle-upper-skills"></a>

## stage285 上位六类共享消费者与后续

已完成六类的来源核对、共享队列／回调、独立方程、本地管理器和产品入口验证，保留SKL107提示文本的未验收边界。SKL117两种原等待路径另验证在第7,207次管理器回调恢复，不将其写成自然完成。[需求开发记录](../analysis/game-legacy-battle-upper-skills-v1/implementation-plan.json) · [验收](validation.md#stage285-legacy-battle-upper-skills)

继续从实际生产者和回调核对SKL4／97／106／111／116及其他未完成游戏消费者，并补齐空目标、混合元数据和本地停止组合。37项原始需求与10个未完成消费者组范围保持，完整玩法、现行交接和真实平台仍在目标内；知识库查询缺需求索引角色，当前仓库索引为本次真源。[目标核对](../analysis/game-legacy-battle-upper-skills-v1/goal-audit.json)

<a id="stage284-legacy-battle-skill99"></a>

## stage284 SKL99–104状态消费者已接入

完成六类技能的限定来源、共享实现和本地入口验证，包含C状态图标生命周期、旧元组存储、局部资源与容量边界。同步修正共有蓄唱推进次数与无效变体清理错误。[实施计划](../analysis/game-legacy-battle-skill99-v1/implementation-plan.json) · [验收](validation.md#stage284-legacy-battle-skill99)

继续沿实际分派推进SKL107／108／109／112／114／117等剩余消费者，先闭合来源和规格，再实现与验收。37项原始需求和10个未完成消费者组保留；完整玩法、现行交接和真实平台仍在目标内。知识库查询缺需求索引角色，仓库索引仍为本次真源。[目标核对](../analysis/game-legacy-battle-skill99-v1/goal-audit.json)

<a id="stage283-legacy-battle-self-flags"></a>

## stage283 普通自身标志字审计与实现

完成剩余11个位的限定范围审计：`0x4`、`0x800`、`0x08000000` 有现有命中／反应消费者；其余八位在本次生产者、动作14、反应及相关帮助函数范围内透传。移除旧标志白名单，并修正259类等级9三字段追加的第四格保留行为。[实施计划](../analysis/game-legacy-battle-self-flags-v1/implementation-plan.json) · [验收](validation.md#stage283-legacy-battle-self-flags)

下一步依据当前需求索引推进未完成的游戏消费者及SKL99等尚未实现类别，先补来源与规格；另修复无效变体解析失败时清理逻辑覆盖原错误的问题。37项原始需求、10个未完成消费者组、完整玩法、现行交接与实际平台范围保留。知识库查询缺需求索引角色，继续以仓库索引为准。[目标核对](../analysis/game-legacy-battle-self-flags-v1/goal-audit.json)

<a id="stage282-legacy-battle-self-guard"></a>

## stage282 自身护卫入口与原队列已接通

普通20类自身记录新增护卫标志，允许范围为 `0x13f8f77b`，类别5首条为 `0x13f8f77f`。原护卫与结果消费者未改；独立队列／回调／像素比对及产品本地TCP验证均通过。[实施计划](../analysis/game-legacy-battle-self-guard-v1/implementation-plan.json) · [验收](validation.md#stage282-legacy-battle-self-guard)

下一步沿生产者、动作14及排队反应核对剩余自身结果位，明确它们被消费、忽略或仍有缺口，再继续完整玩法、现行交接和实际平台。37项原始需求、10个未完成消费者组保留；知识库查询仍缺需求索引角色，沿用仓库索引。[需求索引](requirements-index.md#stage282-legacy-battle-self-guard) · [目标核对](../analysis/game-legacy-battle-self-guard-v1/goal-audit.json)

<a id="stage281-legacy-battle-self-metadata"></a>

## stage281 自身元数据已进入既有消费者

普通20类自身记录的允许范围扩展至 `0x13f8f57b`，类别5首条为 `0x13f8f57f`。原消息、RID资源、状态和结果消费者保持执行所有权；67种回放与12条产品本地TCP流程已验证。[实施计划](../analysis/game-legacy-battle-self-metadata-v1/implementation-plan.json) · [验收](validation.md#stage281-legacy-battle-self-metadata)

下一步核对自身护卫别名及其队列所有者，继续剩余特殊标志、完整玩法、现行交接和实际平台。37项原始需求、10个未完成消费者组保留。知识库查询仍缺本项目需求索引角色，沿用仓库索引。[需求索引](requirements-index.md#stage281-legacy-battle-self-metadata) · [目标核对](../analysis/game-legacy-battle-self-metadata-v1/goal-audit.json)

<a id="stage280-legacy-battle-reentry"></a>

## stage280 第二场产品流程已验证

stage279 的组件新入场已有独立证据，本轮补齐实际产品第二场。12条本地 TCP 流程使用同一连接完成两场战斗，覆盖普通蓄力、自然反射和动作244自动停止后的重新入场；第二场新角色、新数值、回合0→1、再次退出及移动请求均通过。[实施计划](../analysis/game-legacy-battle-reentry-v1/implementation-plan.json) · [验收](validation.md#stage280-legacy-battle-reentry)

下一步核对剩余自身资源／状态元数据和护卫别名，继续完整玩法、现行交接与真实平台。37项原始需求、10个未完成消费者组保留；本轮没有新增产品接口或运行代码。TalonBrain 查询缺项目需求索引角色，沿用仓库索引。[需求索引](requirements-index.md#stage280-legacy-battle-reentry) · [目标核对](../analysis/game-legacy-battle-reentry-v1/goal-audit.json)

<a id="stage279-legacy-battle-self-control"></a>

## stage279 自身控制结果与退出路径已接入

已核对普通 20 类自身蓄力、倒地和散开，允许范围扩展至 `0xf17b`，类别 5 首条为 `0xf17f`。实际冻结、反应、移除和动作244继续由已有消费者执行；新增产品测试直接观察自动退出请求。[实施计划](../analysis/game-legacy-battle-self-control-v1/implementation-plan.json) · [验收](validation.md#stage279-legacy-battle-self-control)

下一步先完成实际产品退出后的第二场 TCP，再核对自身资源／状态元数据及护卫别名，继续推进完整玩法、现行交接和实际平台。37 项原始需求、10 个未完成消费者组保留。TalonBrain 查询仍缺需求索引角色，本轮沿用仓库索引。[需求索引](requirements-index.md#stage279-legacy-battle-self-control) · [目标核对](../analysis/game-legacy-battle-self-control-v1/goal-audit.json)

<a id="stage278-legacy-battle-self-special"></a>

## stage278 自身特殊结果与后续动作已接入

已核对并实现普通 20 类自身记录的 E000 结果组合，来源覆盖动作 14、同一身体的双次推进、元组前进以及 81 类后续动作 155。只修改共享规划器的允许范围，既有结果消费者负责执行。[实施计划](../analysis/game-legacy-battle-self-special-v1/implementation-plan.json) · [验收](validation.md#stage278-legacy-battle-self-special)

下一步继续核对自身蓄力、散开及资源元数据等剩余上下文，并推进完整玩法、现行交接与实际平台。37 项原始需求、10 个未完成消费者组保留。TalonBrain 查询仍缺项目需求索引角色，本轮使用仓库索引。[需求索引](requirements-index.md#stage278-legacy-battle-self-special) · [目标核对](../analysis/game-legacy-battle-self-special-v1/goal-audit.json)

<a id="stage277-legacy-battle-self-family"></a>

## stage277 普通物理家族自身路径已接入

已按固定旧版 PE 的生产者和动作 14 核对 20 类基础自身记录，新增其中 17 类支持。类别 5 的第一条结果清除`0x4` 标志位，类别 6 与 84／85／87 在自身目标清除类别后走普通 HP 结果；资源预检与实际消费者已一致。[实施计划](../analysis/game-legacy-battle-self-family-v1/implementation-plan.json) · [验收](validation.md#stage277-legacy-battle-self-family)

下一步继续核对特殊自身结果位及共享目标所有权，并推进完整玩法、现行交接和实际平台。37 项原始需求、10 个未完成消费者组继续保留。TalonBrain 查询仍缺项目需求索引角色，本轮使用仓库索引。[需求索引](requirements-index.md#stage277-legacy-battle-self-family) · [目标核对](../analysis/game-legacy-battle-self-family-v1/goal-audit.json)

# 需求与开发顺序

<a id="stage276-legacy-battle-self-pair"></a>

## stage276 从拒绝条件核对推进普通自身成对结果

先核对施法附加 RID 和 SKL402 空侧目标：解码器拥有的 RID 已由身体封装拆分；空侧释放则先读取当前槽，再检查下一条结束标记，原版空侧运行上下文仍缺证据，两项边界继续保留。随后核对并实现普通 0／1／3 的基础自身成对结果，覆盖同槽、别名、前后混排及实际命中消费者。[实施计划](../analysis/game-legacy-battle-self-pair-v1/implementation-plan.json) · [验收](validation.md#stage276-legacy-battle-self-pair)

下一步核对普通 5／6 等类别及附加结果位的自身语义，重点区分同槽覆盖类号后读取 HP／MP 的实际归属，继续其余玩法与实际平台。37 项原始需求和 10 个未完成组保留；TalonBrain 查询缺需求索引角色，本轮仍使用仓库索引。[需求索引](requirements-index.md#stage276-legacy-battle-self-pair) · [目标核对](../analysis/game-legacy-battle-self-pair-v1/goal-audit.json)

<a id="stage275-legacy-battle-weather-targets"></a>

## stage275 按原队列顺序开放重复天气效果

已完成 SKL401 重复目标的原文件分析、共享规划器修正、五种实际回调回放及网页／Page 收包流程。原版每次出现均追加动作，重复效果数量由实际动作读指针决定；本轮没有按目标次数推断播放次数。自身带效果的混合元组队列路径单独标为未支持上下文。[实施计划](../analysis/game-legacy-battle-weather-targets-v1/implementation-plan.json) · [验收](validation.md#stage275-legacy-battle-weather-targets)

下一步从原文件核对其余施法附加 RID 和侧目标边界，继续其他未完成战斗消费者及产品玩法。37 项原始需求、10 个未完成消费者组保留。TalonBrain 查询仍缺项目需求索引角色，使用当前仓库索引。[需求索引](requirements-index.md#stage275-legacy-battle-weather-targets) · [目标核对](../analysis/game-legacy-battle-weather-targets-v1/goal-audit.json)

<a id="stage274-legacy-battle-pursuit-linked"></a>

## stage274 既有元组的联动读取

已完成 SKL400 联动位的原文件分析、规划边界、类型 31 效果副本和实际回调实现。回归揭示旧测试仍把图形编号 0 当作失败，本轮依照新核对的动画辅助函数补齐隐藏绘图；既有独立向量保留，原先绘图前的回调前缀继续核对，隐藏绘图单独验收。[实施计划](../analysis/game-legacy-battle-pursuit-linked-v1/implementation-plan.json) · [验收](validation.md#stage274-legacy-battle-pursuit-linked)

下一步按原文件核对 SKL401 的自身效果和重复效果目标边界，继续其余 SKL 消费者及产品玩法。37 项原始需求、10 个未完成组继续保留。TalonBrain 查询仍缺项目需求索引角色，仓库需求索引为本轮入口。[需求索引](requirements-index.md#stage274-legacy-battle-pursuit-linked) · [目标核对](../analysis/game-legacy-battle-pursuit-linked-v1/goal-audit.json)

<a id="stage273-legacy-battle-pursuit-targets"></a>

## stage273 补齐 SKL400 重复目标

盘点实际拒绝分支后，选取此前明确未支持的 SKL400 重复目标。已核对原版每次目标出现的动作追加、目标元组追加、施法信号遍历及等待恢复，并实现同一身体的队列累积。新增七项检查，四种源码／生成核心回放和八条新本地 TCP 入口通过。[实施计划](../analysis/game-legacy-battle-pursuit-targets-v1/implementation-plan.json) · [验收](validation.md#stage273-legacy-battle-pursuit-targets)

下一步核对 SKL400 结果位 `0x800000` 的元组与元数据消费者，继续其余未完成 SKL 和产品玩法。37 项原始需求、10 个未完成组继续保留。TalonBrain 查询仍缺项目需求索引角色，本轮使用仓库索引。[需求索引](requirements-index.md#stage273-legacy-battle-pursuit-targets) · [目标核对](../analysis/game-legacy-battle-pursuit-targets-v1/goal-audit.json)

<a id="stage272-legacy-battle-round-ack"></a>

## stage272 A/P 跨回合所有权

原版 A 接收器和输入初始化均调用当前登记表标记函数。已复现并修正共享接收器因依赖 C 元数据而漏报 RID0 B 槽的偏差；验证未来与过期 A、P 新席位在 C 消费后生效、回合号环绕和部分字段赋值。[实施计划](../analysis/game-legacy-battle-round-ack-v1/implementation-plan.json) · [验收](validation.md#stage272-legacy-battle-round-ack)

下一步盘点剩余消费者组中明确缺失的 SKL 分支，按原版证据继续补齐玩法和产品入口。37 项原始需求、10 个未完成组保留，完整目标持续进行。TalonBrain 查询仍缺项目需求索引角色，本轮使用仓库索引。[需求索引](requirements-index.md#stage272-legacy-battle-round-ack) · [目标核对](../analysis/game-legacy-battle-round-ack-v1/goal-audit.json)

<a id="stage271-legacy-battle-character-queue"></a>

## stage271 C 队列与回合边界

已从原版字节核对接收环、主流程分派和 C 消费位置。正常入口的在途更新、缺席槽移除、C 结束标志、独立退出通知及三条排队消息跨回合环绕均通过。共享核心已有该调度，无新增运行代码。[实施计划](../analysis/game-legacy-battle-character-queue-v1/implementation-plan.json) · [验收](validation.md#stage271-legacy-battle-character-queue)

下一步核对提前到达的 A/P 更新与待处理命令的跨回合所有权，继续推进完整玩法、现行版和实际平台。37 项原始需求、10 个未完成消费者组继续保留。TalonBrain 查询缺项目需求索引角色，本轮使用仓库需求索引。[需求索引](requirements-index.md#stage271-legacy-battle-character-queue) · [目标核对](../analysis/game-legacy-battle-character-queue-v1/goal-audit.json)

<a id="stage270-legacy-battle-exit-rid0"></a>

## stage270 致死反射的完整退出路径

已核实 244 到主流程阶段 7、8 的清理顺序，并以共享退出所有者验证对象池回收、回合计数及下一场战斗。远端主体死亡的待处理 RID0 会随主体回收。B 占用施法槽的回放继续到第 448 个回调，自然完成。[实施计划](../analysis/game-legacy-battle-exit-rid0-v1/implementation-plan.json) · [验收](validation.md#stage270-legacy-battle-exit-rid0)

下一步从实际 C 消费入口验证回程投射物在途时的角色更新与移除，继续推进其余玩法与真实环境验收。37 项原始需求、10 个消费者组保留。TalonBrain 查询仍缺项目需求索引角色，本轮沿用仓库需求索引。[需求索引](requirements-index.md#stage270-legacy-battle-exit-rid0) · [目标核对](../analysis/game-legacy-battle-exit-rid0-v1/goal-audit.json)

<a id="stage269-legacy-battle-reflected-rid0"></a>

## stage269 反射回程与已准备的交接对象

已核对反射生产器、phase2 门限、137 的投射物复制、72 的元组推进及回程中的坐骑卸载。共享核心在原主体仍拥有待处理 RID0 时暂存并隐藏交接动画对象，221 校验后复用。离场清理覆盖保留对象、容器及尚未登记的 A、B。[实施计划](../analysis/game-legacy-battle-reflected-rid0-v1/implementation-plan.json) · [验收](validation.md#stage269-legacy-battle-reflected-rid0)

后续核对致死反射进入 244 时的尾随队列，以及 RID0 的 B 占用施法槽后，回程命中的登记对象和等待状态。37 项原始需求和 10 个消费者组继续保留。TalonBrain 查询仍缺项目需求索引角色，使用仓库需求索引。[需求索引](requirements-index.md#stage269-legacy-battle-reflected-rid0) · [目标核对](../analysis/game-legacy-battle-reflected-rid0-v1/goal-audit.json)

<a id="stage268-legacy-battle-casting-rid0"></a>

## stage268 施法游标与尾随交接

旧版 SKL19–31 共用施法生产器。本阶段追到 `FF`、终止元组、动作 135、62 与尾随 221，复现两条结束分支。共享实现只在同一队列所有者的 221 消费点检查并归位已排入的元组。源码及生成核心回放覆盖有信号与无信号的普通、空和内联列表。[实施计划](../analysis/game-legacy-battle-casting-rid0-v1/implementation-plan.json) · [验收](validation.md#stage268-legacy-battle-casting-rid0)

继续分析反射产生的中间队列、已倒地或离场的原主体与 C 刷新的实际到达时序。保留 37 项原始需求和 10 个消费者组。TalonBrain 查询缺项目需求索引角色，本轮使用仓库索引。[需求索引](requirements-index.md#stage268-legacy-battle-casting-rid0) · [目标核对](../analysis/game-legacy-battle-casting-rid0-v1/goal-audit.json)

<a id="stage267-legacy-battle-rid0-flight"></a>

## stage267 多帧下降中的槽位与对象

已核对动作 221 的原父身体骑乘指针、每帧 B 槽重读和落地注册。共享回放按当前元组与已准备记录的一致性保留骑乘对象，并处理 B 先离场的两种槽位归属。独立模型延续历史同槽夹具，新增本地 TCP 验收覆盖普通回合。[实施计划](../analysis/game-legacy-battle-rid0-flight-v1/implementation-plan.json) · [验收](validation.md#stage267-legacy-battle-rid0-flight)

下一步核对 SKL19 接尾随 RID0 时，施法队列的元组读位置为何落在 `[0,0]` 而记录指定 `[0,5]`。已倒地或离场的原主体、真实 C 到达时序和现行版继续跟踪。37 项原始需求和 10 个消费者组仍在范围内。TalonBrain 查询缺项目需求索引角色，本轮使用仓库索引。[需求索引](requirements-index.md#stage267-legacy-battle-rid0-flight) · [目标核对](../analysis/game-legacy-battle-rid0-flight-v1/goal-audit.json)

<a id="stage266-legacy-battle-rid0-ownership"></a>

## stage266 空闲交接的回合收尾

已核对首配缺席、尾随 A 属于另一具空闲身体、动作 221 的 B 注册和普通 C 的父身体清理。共享核心保留中断游标和命令计数，等待超限时按现有归位路径回收未启动的交接。中途离场按已转移的对象身份分开清理。[实施计划](../analysis/game-legacy-battle-rid0-ownership-v1/implementation-plan.json) · [验收](validation.md#stage266-legacy-battle-rid0-ownership)

下一步核对父身体仍在时 B 槽先被移除或覆盖，以及交接与倒地、离场队列共存的情况。37 项原始需求和 10 个消费者组继续跟踪。TalonBrain 查询缺项目需求索引角色，本轮使用仓库索引。[需求索引](requirements-index.md#stage266-legacy-battle-rid0-ownership) · [目标核对](../analysis/game-legacy-battle-rid0-ownership-v1/goal-audit.json)

<a id="stage265-legacy-battle-rid0-interruption"></a>

## stage265 旧版主段中断与交接回收

已核对 SKL72 后段缺席路径的扫描位置、组内剩余计数和动作 221 之前的对象清理。实现范围限于尾随 A 仍是原骑乘主身体且中断扫描正好到达 RID0 的配对记录。专项回放覆盖缺席攻击者、缺席目标、可达和不可达的尾随游标，以及一条和两条组内后继。[实施计划](../analysis/game-legacy-battle-rid0-interruption-v1/implementation-plan.json) · [验收](validation.md#stage265-legacy-battle-rid0-interruption)

下一步核对首配中断、A 槽属于另一身体及动作 221 写入 B 后离场的对象归属。37 项原始需求和 10 个消费者组继续跟踪。TalonBrain 查询缺项目需求索引角色，本轮沿用仓库索引。[需求索引](requirements-index.md#stage265-legacy-battle-rid0-interruption) · [目标核对](../analysis/game-legacy-battle-rid0-interruption-v1/goal-audit.json)

<a id="stage264-legacy-battle-rid0-receive"></a>

## stage264 原身体受击后继续 RID0

已核对配对生产、激活、追加动作 221 和两次注册表写入的顺序。共享客户端以原身体身份接续受击队列，覆盖同槽交接、两个发送者、两个挂载身体及旧身体在起步前后被覆盖的差别。[实施计划](../analysis/game-legacy-battle-rid0-receive-v1/implementation-plan.json) · [验收](validation.md#stage264-legacy-battle-rid0-receive)

下一步追踪主段缺席中断时的尾随游标，以及提前离场时已准备的交接对象生命周期。37 项原始需求和 10 个消费者组继续跟踪。TalonBrain 查询缺项目需求索引角色，本轮使用仓库索引。[目标核对](../analysis/game-legacy-battle-rid0-receive-v1/goal-audit.json)

<a id="stage263-legacy-battle-following-results"></a>

## stage263 先到特殊结果与内联 RID

已用 REA 核对反射、治疗、免伤的优先级、各自推进的身体队列及内联 RID 的四个元组位置。共享客户端按实际结算登记交付，验证资源切换重放信号、接续下一笔攻击和离场后同槽替换。[阶段计划](../analysis/game-legacy-battle-following-results-v1/implementation-plan.json) · [验收](validation.md#stage263-legacy-battle-following-results)

下一步沿尾随 RID0 的主段、交接对象和动作 0 核对等待归属。37 项原始需求和 10 个消费者组继续跟踪。TalonBrain 查询缺项目需求索引角色，本轮使用仓库索引。[目标核对](../analysis/game-legacy-battle-following-results-v1/goal-audit.json)

<a id="stage262-legacy-battle-late-recipient"></a>

## stage262 先受击的已排队攻击者

已核对旧版动作 24、普通动作 14、目标动作推进和施术者元组消费。共享客户端已实现先到结果与后续受击等待的对应，验证单发送者、双发送者和离场替换。下一步核对带特殊结果标记及附带 RID 时的对应消费者，并继续核对现行版交接。37 项需求和 10 个消费者组继续跟踪。TalonBrain 查询缺项目需求索引角色，本轮使用仓库索引。[阶段计划](../analysis/game-legacy-battle-late-recipient-v1/implementation-plan.json) · [目标核对](../analysis/game-legacy-battle-late-recipient-v1/goal-audit.json)

<a id="stage261-legacy-battle-independent-following"></a>

## stage261 后续攻击者的起步与归位

已核对主施术者激活、空闲动作、护卫交接和超时归位的旧版入口。两个没有交接来源的普通 SKL72 回合已通过本地回放。下一步核对动作 24 在队列首项但同一身体稍后才成为受击者的分支，再核对特殊结果与无外部 RID 的字段来源。37 项需求和 10 个消费者组继续跟踪。TalonBrain 查询缺项目需求索引角色，本轮使用仓库索引。[阶段计划](../analysis/game-legacy-battle-independent-following-v1/implementation-plan.json) · [目标核对](../analysis/game-legacy-battle-independent-following-v1/goal-audit.json)

**推测**。存在后续受击引用时，原版动作 24 检查当前身体类型，随后普通受击调用 `0x40d86d` 推进目标。在隔离的共享代码副本中放行这一处等待后，角色 2 和 12 获得各自结果，回合仍要等待超时归位。后续核对目标推进后留下的受击队列位置。[试验与边界](../analysis/game-legacy-battle-independent-following-v1/validation.json)

<a id="stage260-legacy-battle-missing-lookahead"></a>

## stage260 后续配对缺席与清理

已核对先写转向元组、后查后续目标的旧版顺序，补齐共享客户端在两种前置 PLV 离场输入上的回合结算。旧版组内游标与共享客户端的恢复边界分别记录。下一步追踪独立后续攻击者已有动作 24 但当前动作仍为 0 的回调路径，再核对特殊结果标记和无外部 RID 的字段来源。37 项需求与 10 个消费者组继续跟踪。TalonBrain 查询缺项目需求索引角色，本轮使用仓库索引。[阶段计划](../analysis/game-legacy-battle-missing-lookahead-v1/implementation-plan.json) · [目标核对](../analysis/game-legacy-battle-missing-lookahead-v1/goal-audit.json)

<a id="stage259-legacy-battle-following-strikes"></a>

## stage259 后续攻击的独立等待与中途离场

已核对旧版后续配对循环、攻击动作、受击等待和蓄力回调。共享核心完成多次普通后续攻击的结算与执行中离场。下一步核对提交前 PLV 使前瞻目标缺席时的原版部分队列，以及独立后续攻击者的首次激活。特殊结果标记和无外部 RID 的字段来源继续跟踪。原 37 项需求和 10 个消费者组保留。TalonBrain 查询仍缺项目需求索引角色，本轮沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-following-strikes-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage259-legacy-battle-following-strikes) · [验收](validation.md#stage259-legacy-battle-following-strikes)

<a id="stage258-legacy-battle-repeated-protection"></a>

## stage258 重复保护和后续攻击

已核对固定旧版的两次保护写入、受保护角色归位、零结果转向元组及后续目标扫描。共享核心完成普通 SKL72 的重复保护、下一次攻击与双方离场，原 37 项需求和 10 个消费者组继续跟踪。下阶段先核对多条后续攻击的退场顺序、特殊结果标记下的角色重合，以及无外部 RID 时的字段来源。TalonBrain 查询缺本项目需求索引角色，沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-repeated-protection-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage258-legacy-battle-repeated-protection) · [验收](validation.md#stage258-legacy-battle-repeated-protection)

<a id="stage257-legacy-battle-guard-wait"></a>

## stage257 护卫返回和嵌套结果的放行

已追到固定旧版的护卫队列与动作推进例程。共享核心完成外层护卫的动作 1 放行、普通 SKL72 单护卫服务两个不同角色、零伤害等待及受影响槽位替换的本地实现。下一步核对两条交接指向同一受保护角色、带后续护卫目标的结果分支，以及无外部 RID 时的旧版字段来源。原 37 项需求及 10 个消费者组继续跟踪。TalonBrain 查询仍缺本项目的需求索引角色，本轮沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-guard-wait-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage257-legacy-battle-guard-wait) · [验收](validation.md#stage257-legacy-battle-guard-wait)

<a id="stage256-legacy-battle-skl113-wire"></a>

## stage256 SKL113 预读、执行和后续指令

已核对 SKL113 通过 M 预读与执行分派到达动作 232 的条件。共享回合覆盖分开的结束位置及两套游标共用结束位置，并按实际扫描验证同组续接。下一段跟踪正数外层护卫的动作 1 放行、两角色共享护卫时的队列先后及无外部 RID 的原版字段来源。原 37 项要求和 10 个消费者组继续跟踪。TalonBrain 本次查询缺项目需求索引角色，沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-skl113-wire-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage256-legacy-battle-skl113-wire) · [验收](validation.md#stage256-legacy-battle-skl113-wire)

<a id="stage255-legacy-battle-guard-alias"></a>

## stage255 同槽护卫与待启动交接

固定旧版的队列别名、动作 71 双推进和动作 22 近距离返还已核对。共享回放已覆盖 SKL266 同槽自身结果及 SKL72 待启动护卫的退场。下一段从 SKL113 的预读与生产者边界入手，核对嵌套输入能否从 M 命令到达相应回调，再核对缺少外部 RID 时的原版输入来源。原 37 项要求与 10 个消费者组继续跟踪。TalonBrain 本次查询缺项目需求索引角色，沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-guard-alias-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage255-legacy-battle-guard-alias) · [验收](validation.md#stage255-legacy-battle-guard-alias)

<a id="stage254-legacy-battle-guard-departure"></a>

## stage254 飞行护卫与已启动护卫退场

已核对动作 22 的护卫分支、动作 217 和原版退场后的等待。共享回放已覆盖独立护卫、受击角色兼任护卫及已启动的嵌套护卫退场。下一步核对施法者兼任护卫、护卫启动前的队列边界及 SKL113 嵌套预读。原 37 项要求与 10 个消费者组继续跟踪。TalonBrain 查询缺本项目需求索引角色，本阶段沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-guard-departure-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage254-legacy-battle-guard-departure) · [验收](validation.md#stage254-legacy-battle-guard-departure)

<a id="stage253-legacy-battle-guard-release"></a>

## stage253 护卫动作的放行和续接

已核对施法者、护卫与原目标的三次放行，补齐真实 PLV 退场后的嵌套护卫回合及无飞行目标的 SKL266 自身护卫回合。下一步核对护卫自身退场、存在飞行物时的护卫收尾、槽别名与嵌套 RID。原 37 项要求和 10 个消费者组继续跟踪。TalonBrain 查询缺本项目需求索引角色，本阶段沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-guard-release-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage253-legacy-battle-guard-release) · [验收](validation.md#stage253-legacy-battle-guard-release)

<a id="stage252-legacy-battle-physical-boundaries"></a>

## stage252 嵌套目标与无飞行目标的回合

已核对嵌套目标的预读、生产与动作 232，补齐无飞行目标的正变体结算。下一步追踪原目标在护卫动作中退场后的跨角色放行链，以及 SKL266 只有自身 RID 时的临时字段来源。原 37 项要求与 10 个消费者组继续跟踪。TalonBrain 缺本项目需求索引角色，本轮沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-physical-boundaries-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage252-legacy-battle-physical-boundaries) · [验收](validation.md#stage252-legacy-battle-physical-boundaries)

<a id="stage251-legacy-battle-physical-registry"></a>

## stage251 物理技能的角色槽生命周期

已沿普通 C、PLV、M 预约及物理生产者核对角色槽。实际需解引用的空护卫、空施法者使用同一命令所有者续接。下一步核对 SKL72、113 的嵌套目标和正变体只有自身结果时的执行与回合边界。原 37 项要求和 10 个消费者组继续跟踪。TalonBrain 缺本项目的需求索引角色，当前沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-physical-registry-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage251-legacy-battle-physical-registry) · [验收](validation.md#stage251-legacy-battle-physical-registry)

<a id="stage250-legacy-battle-assist-terminator"></a>

## stage250 协作者终止字段与后续命令

SKL98 变体 12、13 的协作者 `FF` 已接入正常命令所有者，核对了同组续接、独立 `RID` 和单条回合。变体 7 的状态 32 伙伴与后续缺席目标已补充队列验收。下一步沿物理护卫和正变体的角色注册与移除链路确认先解引用分支的触发条件，并继续核对原 37 项要求和 10 个消费者组。TalonBrain 查询缺本项目需求索引角色，本阶段沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-assist-terminator-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage250-legacy-battle-assist-terminator) · [验收](validation.md#stage250-legacy-battle-assist-terminator)

<a id="stage249-legacy-battle-physical-missing"></a>

## stage249 物理技能中断与后续工作

物理配对、正变体和 SKL260 链目标的已证缺席分支已接入同一命令所有者。下一步区分 SKL98 协作者 FF、物理护卫空值解引用前的角色状态来源，以及这些分支是否能通过正常入场与战斗记录触发。继续核对原 37 项要求与 10 个消费者组。TalonBrain 查询缺本项目的需求索引角色，本阶段沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-physical-missing-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage249-legacy-battle-physical-missing) · [验收](validation.md#stage249-legacy-battle-physical-missing)

<a id="stage248-legacy-battle-family-missing"></a>

## stage248 技能族缺席角色与反射尾部

固定旧版的常规状态技、数值技、施法技和 SKL82 已沿各自缺席路径接入共享命令所有者。后续先追物理技能入口 `0x424310` 的攻击者、目标、护卫与后续命中中断，按各段队列写入和清理顺序建立规格。原 37 项要求及 10 个消费者组继续逐项核验。TalonBrain 查询缺本项目的需求索引角色，本阶段沿用仓库索引。[阶段计划](../analysis/game-legacy-battle-family-missing-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage248-legacy-battle-family-missing) · [验收](validation.md#stage248-legacy-battle-family-missing)

<a id="stage247-legacy-battle-missing"></a>

## stage247 缺席角色、队列清理与继续回合

已核验 `0x436930` 的队列清理、忙碌等待和 SKL98 缺席分支。共享层保留已完成的注册表变化，并按已解析记录续接。下一步结合 37 项要求与 10 个未完成消费者组，追踪其他技能族如何处理中断的结果记录及角色交接。TalonBrain 查询仍缺本项目的需求索引角色，本轮沿用仓库索引。

[阶段计划](../analysis/game-legacy-battle-missing-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage247-legacy-battle-missing) · [验收](validation.md#stage247-legacy-battle-missing)

<a id="stage246-legacy-battle-status-assist"></a>

## stage246 协作者与结果队列

已从固定旧版追到变体 12、13 的协作者字段、施法信号、命中及回复回调，并在共享层和网页、微信 Page 入口核验。下一步追踪 `0x436930` 如何跳过缺席角色、处理等待并推进到后续记录。TalonBrain 查询仍缺需求索引角色，本轮使用仓库索引。

[阶段计划](../analysis/game-legacy-battle-status-assist-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage246-legacy-battle-status-assist) · [验收](validation.md#stage246-legacy-battle-status-assist)

<a id="stage245-legacy-battle-status-position"></a>

## stage245 配对换位与下一轮角色记录

已在固定旧版样本核验变体 7 的目标与配对槽、施法者及本方槽转移、动作队列和附属对象锚点。共享层沿用同一战斗连接完成换位、下一轮防御与退场。下一步追踪变体 12、13 对额外槽及角色体的读写，再决定共享队列接口。TalonBrain 查询缺少本项目的需求索引角色，本阶段沿用仓库的需求索引。

[阶段计划](../analysis/game-legacy-battle-status-position-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage245-legacy-battle-status-position) · [验收](validation.md#stage245-legacy-battle-status-position)

<a id="stage244-legacy-battle-status-slots"></a>

## stage244 SKL98 目标槽列表

已实现目标放大、缩小退场与本方配对槽缓存处理，并验证变体 6、8 后的施法者 RID0 交接。下一阶段沿变体 7 的配对槽、局部槽号与注册表变化追踪位置交接，同时保留变体 12、13 的额外槽和各自字段。TalonBrain 缺少本项目的需求索引角色，本轮使用仓库索引。

[阶段需求](../analysis/game-legacy-battle-status-slots-v1/implementation-plan.json) · [静态分析](game-static.md#stage244-legacy-battle-status-slots) · [验收](validation.md#stage244-legacy-battle-status-slots)

<a id="stage243-legacy-game-stream"></a>

## stage243 持续游玩连接

阶段 242 的网页回放触及桥接的 10 秒会话时限。本阶段从固定旧版网络泵确认 `3$} nr` 的触发，再接入独立游戏桥和共享会话定时。TalonBrain 缺少本项目的需求索引角色，本轮以仓库索引定位要求。

接续核对 SKL98 的五个独立变体、附带 RID 和原需求中的其他玩法消费者。真实设备网络、现行版交接及官服验收继续分别跟踪。

[阶段需求](../analysis/game-legacy-game-stream-v1/implementation-plan.json) · [静态分析](game-static.md#stage243-legacy-game-stream) · [验收](validation.md#stage243-legacy-game-stream)

<a id="stage242-legacy-battle-status-variant"></a>

## stage242 SKL98 共用目标记录

已补齐变体 0 至 5、9、10、11、14 的共享队列、施法前摇、状态效果和回合释放。动作 43 的活体 HP 写入已按原 PE 修正，并重新核验 SKL86。后续继续追踪五个独立变体和附带 RID。网页当前本机桥的会话时限也纳入持续游玩验收。TalonBrain 缺少本项目的需求索引角色，本轮沿用仓库索引。

[阶段需求](../analysis/game-legacy-battle-status-variant-v1/implementation-plan.json) · [静态分析](game-static.md#stage242-legacy-battle-status-variant) · [验收](validation.md#stage242-legacy-battle-status-variant)

<a id="stage241-legacy-battle-summon"></a>

## stage241 SKL93 战斗角色入场

已完成固定旧版 SKL93 的字段、角色登记、动作队列和释放条件核验。共享实现支持空槽入场、占槽替换、重复槽位与同轮后续结算。继续从需求索引核对未覆盖的战斗和普通玩法消费者，保留现行版交接、微信设备与官服验收。

TalonBrain 缺少本项目的需求索引角色，本轮以仓库的需求索引定位约束。

[阶段需求](../analysis/game-legacy-battle-summon-v1/implementation-plan.json) · [静态分析](game-static.md#stage241-legacy-battle-summon) · [验收](validation.md#stage241-legacy-battle-summon)

<a id="stage240-legacy-battle-city-return"></a>

## stage240 战斗回城与普通地图交接

已接通固定旧版主状态 10 的回城出口。战斗退出使用 type14，提前 `>HY` 可以接管退出，`TfD` 根据收到时所在的主状态决定是否另起换图。接续分析仍未覆盖的战斗消费者与普通玩法，保留现行版交接和真实设备的验收要求。

[阶段需求](../analysis/game-legacy-battle-city-return-v1/implementation-plan.json) · [静态分析](game-static.md#stage240-legacy-battle-city-return) · [验收](validation.md#stage240-legacy-battle-city-return)

<a id="stage239-legacy-city-return"></a>

## stage239 普通地图的回城重建

已把普通地图的 `4}o`、直接换图和 `>HY` 重建接到两种宿主。共享层驱动旧画面退场、目标地图就绪和 type15 入场，进入后恢复本轮会话的移动操作。接下来沿主状态 10 子状态 7、8 跟进战斗回城，核对 type14 完成与提前收到 `>HY` 或 `TfD` 时的重建交接。

[阶段需求](../analysis/game-legacy-city-return-v1/implementation-plan.json) · [静态分析](game-static.md#stage239-legacy-city-return) · [验收](validation.md#stage239-legacy-city-return)

<a id="stage238-legacy-battle-alternate-exit"></a>

## stage238 返回选服与注销回城分支

已确认固定旧版菜单的两条退场生产者。主动回选服已接到网页与微信 Page 的普通地图和战斗入口，并覆盖渐隐后发请求、应答、拒绝及超时。接下来按 `4}o`、场景更新和 `$!~ 0` 的调用链补全注销回城的场景重建与转场顺序。

[阶段需求](../analysis/game-legacy-battle-alternate-exit-v1/implementation-plan.json) · [静态分析](game-static.md#stage238-legacy-battle-alternate-exit) · [验收](validation.md#stage238-legacy-battle-alternate-exit)

<a id="stage237-legacy-music-phases"></a>

## stage237 选服及普通战斗音乐

已把固定旧版主状态 2 的曲目、主状态 10 的开场选曲与普通退出渐隐，以及主状态 9 重建地图时的恢复曲目接到共享会话和两种页面。通过已有分派表处理 `S)B` 的待用选择，支持场景重建及普通战斗返回时消费。

下一步继续追踪主状态 10 子状态 9 与条件退场的实际生产者，以及其他效果音调用。现行版交接和设备验收继续按原需求推进。

[阶段需求](../analysis/game-legacy-music-phases-v1/implementation-plan.json) · [静态分析](game-static.md#stage237-legacy-music-phases) · [验收](validation.md#stage237-legacy-music-phases)

<a id="stage236-legacy-audio"></a>

## stage236 主状态 7 的音效与场景音乐

已核对音效 60 的路径、场景选曲字段和主状态 7 的渐隐调用链。以同一份共享选曲表及 PCM 读取器支持网页和微信 Page。两套入口均已验证由本机对端发包触发的音乐、退出音效和关闭。

选服和普通战斗音乐已在阶段 237 接入。主状态 7 的其他结果、主状态 10 子状态 9 与子状态 8 的触发来源及其他效果音继续取证。[音乐阶段](#stage237-legacy-music-phases)

[阶段需求](../analysis/game-legacy-audio-v1/implementation-plan.json) · [分析](game-static.md#stage236-legacy-audio) · [验收](validation.md#stage236-legacy-audio)

<a id="stage235-legacy-server-return-fade"></a>

## stage235 主状态 7 的画面过渡

已将固定旧版主 7 的画面捕获和第 14 类逐行过渡接到现有 `VKW` 会话退出。沿用共享逐行算法，普通与战斗画布向同一个退场所有者移交最近一次显示的图像。网页与微信在完成画面后开放确认。

声音 60 的文件选择和音乐渐隐已在阶段 236 接入。主 7 的其他结果和主 10 的子状态 9 及条件退场仍按原目标取证。[阶段 236](#stage236-legacy-audio)

[阶段需求](../analysis/game-legacy-server-return-fade-v1/implementation-plan.json) · [分析](game-static.md#stage235-legacy-server-return-fade) · [验收](validation.md#stage235-legacy-server-return-fade) · [原目标](../analysis/game-legacy-server-return-fade-v1/goal-audit.json)

<a id="stage234-legacy-server-return"></a>

## stage234 服务端通知后的退场

已确认固定旧版 `VKW` 首字段、主状态 7 的退出提示和连接清理。共享会话在通知后停用普通与战斗操作，网页和微信沿用现有关闭入口返回连接设置。

主 7 退场画面及音效分别接续至阶段 235 和 236。主 10 子状态 9 的实际触发条件与子状态 8 的另一条过渡继续取证。其余玩法、现行版交接和外部验收继续按原要求推进。[画面](#stage235-legacy-server-return-fade) · [音效](#stage236-legacy-audio)

[阶段需求](../analysis/game-legacy-server-return-v1/implementation-plan.json) · [分析](game-static.md#stage234-legacy-server-return) · [验收](validation.md#stage234-legacy-server-return) · [原目标](../analysis/game-legacy-server-return-v1/goal-audit.json)

<a id="stage233-legacy-frame-startup"></a>

## stage233 普通帧和角色初值

已定位主状态 9、子状态 3、角色体与记录的初值来源。共享客户端接受单个固定旧版配置值，进入普通地图时沿用现有收包和角色所有权。网页和微信本机入口通过入场与换场。

后续继续追踪普通场景外的状态生产端、未覆盖玩法与现行游戏票据消费者。微信模拟器、实体设备和官服继续分别验收。

[阶段需求](../analysis/game-legacy-frame-startup-v1/implementation-plan.json) · [分析](game-static.md#stage233-legacy-frame-startup) · [验收](validation.md#stage233-legacy-frame-startup) · [原目标](../analysis/game-legacy-frame-startup-v1/goal-audit.json)

<a id="stage232-legacy-ordinary-context"></a>

## stage232 普通入场的移动和输入生产端

已核对主流程状态 5 的重置、移动门与动作锁、时段数据流和会话计数。普通启动可通过材料选择源配置。共享层根据本机时钟和收包驱动移动，网页点击和微信触控均到达已有网络发送入口。

后续继续核对普通帧和角色上下文、原生其他交互门与剩余玩法。现行登录票据消费、微信运行、实体设备及官服继续分层取证。

[先行需求](../analysis/game-legacy-ordinary-context-v1/implementation-plan.json) · [分析](game-static.md#stage232-legacy-ordinary-context) · [验收](validation.md#stage232-legacy-ordinary-context) · [原目标](../analysis/game-legacy-ordinary-context-v1/goal-audit.json)

<a id="stage231-legacy-display-startup"></a>

## stage231 旧版显示和相机初始化

通过 REA 核对 WinMain 建窗、原始显示字段、正逆投影和场景坐标写入。共享客户端现在可使用明确的源显示选择，入场和位置修正均走已有状态通路。使用原创对端验证桌面和移动尺寸网页及微信 Page 的入场和绘制。

后续继续核对运动、帧与输入上下文的初始生产端，并沿原生事件追动态绘制门。现行游戏交接、余下玩法、微信运行、真机和官服继续分别验收。

[先行需求](../analysis/game-legacy-display-startup-v1/implementation-plan.json) · [分析](game-static.md#stage231-legacy-display-startup) · [验收](validation.md#stage231-legacy-display-startup) · [原目标](../analysis/game-legacy-display-startup-v1/goal-audit.json)

<a id="stage230-legacy-config-startup"></a>

## stage230 固定旧版启动配置

通过 REA 绑定 WinMain 的命令尾、Config.dat 普通文本读取、首行与后续资源解析。网页和微信使用同一个共享实现，从用户选择的文件中读取有界前缀。验收用 Config.dat 指向迁移后的资源，并向本机原创对端请求角色列表。

下一步继续追 WinMain 中图形参数和默认启动上下文的写入与消费，再核对能直接投影到共享游戏状态的部分。现行登录票据的同版本消费证据、其余玩法、微信与设备运行、官服兼容继续分别验收。

[先行需求](../analysis/game-legacy-config-startup-v1/implementation-plan.json) · [分析](game-static.md#stage230-legacy-config-startup) · [验收](validation.md#stage230-legacy-config-startup) · [原目标](../analysis/game-legacy-config-startup-v1/goal-audit.json)

<a id="stage229-legacy-startup-materials"></a>

## stage229 旧版启动摘要与现行交接边界

本轮沿现行登录器映射写入函数复核生产端，再对固定旧版游戏追到启动模块读取、摘要和首包。已在网页和微信入口实现选定文件核对与摘要生成，并通过本机原创对端的角色列表往返。

后续继续核对 Config.dat 首行到资源参数、启动上下文的来源及剩余消费者。现行游戏样本原 `.text` 文件字节缺失，当前交接和认证需要同版本消费者证据。微信运行、设备与官服验收分别记录。

[先行需求](../analysis/game-legacy-startup-materials-v1/implementation-plan.json) · [交接规格](logic-protocol-spec.md#stage229-legacy-startup-materials) · [验收](validation.md#stage229-legacy-startup-materials) · [原目标](../analysis/game-legacy-startup-materials-v1/goal-audit.json)

<a id="stage228-wechat-special-dialogs"></a>

## stage228 微信特殊对话和图文完成本机实现

**事实**。固定样本的物品交接、双字段、外观及图文确认已接入微信 Page。独立本机对端核对收发，Canvas 测试端口核对绘制、缺图和关闭。

**待验证**。继续核实现行登录材料与游戏启动的交接、入站邀请及其他未闭合消费者。完整原版图像、微信实际运行、真机和官服继续追踪。保留原 37 项要求与 10 个未完成消费者组。

[本轮计划](../analysis/game-wechat-special-dialogs-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage228-wechat-special-dialogs) · [目标审计](../analysis/game-wechat-special-dialogs-v1/goal-audit.json)

<a id="stage227-wechat-family-board"></a>

## stage227 微信家族、家族兽与留言板完成本机实现

**事实**。复核固定样本的家族资料、权限和成员操作，接入微信家族、家族兽与留言板。独立对端覆盖名单变动、两类喂食、发布与删除留言，关闭后恢复地图输入。

**待验证**。继续核对物品交接、双字段输入、外观和特殊图文窗口等地图业务。入站邀请、完整图像、现行登录交接、模拟器、真机和官服继续追踪。保留原 37 项要求与 10 个未完成消费者组。

[本轮计划](../analysis/game-wechat-family-board-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage227-wechat-family-board) · [目标审计](../analysis/game-wechat-family-board-v1/goal-audit.json)

<a id="stage226-wechat-storage-trade"></a>

## stage226 微信仓储和交易完成本机实现

**事实**。复核固定样本仓储、饲料箱与两条交易入口，接入微信 Page。独立本机对端覆盖转移、报价、失效、退出和恢复移动。

**待验证**。继续接入家族、留言板及其余地图窗口。现行登录交接、完整图文渲染、模拟器、真机和官服继续追踪。保留原 37 项要求与 10 个未完成消费者组。

[本轮计划](../analysis/game-wechat-storage-trade-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage226-wechat-storage-trade) · [目标审计](../analysis/game-wechat-storage-trade-v1/goal-audit.json)

<a id="stage225-wechat-map-services"></a>

## stage225 微信治疗与技能训练完成本机实现

**事实**。复核固定样本的治疗、人物师范和两套宠物训练，接入微信原生 Page。独立对端已核对选择、确认、列表失效和离开后的移动。

**待验证**。后续地图窗口包括仓储和玩家交易。现行登录至游戏的交接、完整图文渲染、模拟器、真机与官服继续追踪。保留原 37 项要求与 10 个未完成消费者组。

[本轮计划](../analysis/game-wechat-map-services-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage225-wechat-map-services) · [目标审计](../analysis/game-wechat-map-services-v1/goal-audit.json)

<a id="stage224-wechat-inventory-shop"></a>

## stage224 微信地图物品与商店完成本机实现

**事实**。先复核固定样本的地图物品和窗口分派，再接入微信背包、商人和兑换员、六类商店和订单核对。独立对端已确认普通物品操作和商店数据变化。

**待验证**。继续迁移治疗、技能、仓储和玩家交易窗口，并核实现行版本和真机行为。原 37 项要求与 10 个未完成消费者组继续追踪。

[本轮计划](../analysis/game-wechat-inventory-shop-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage224-wechat-inventory-shop) · [目标审计](../analysis/game-wechat-inventory-shop-v1/goal-audit.json)

<a id="stage223-wechat-creation"></a>

## stage223 微信建角和首次入场完成本机实现

**事实**。REA 复核固定样本的建角、应答与失败分支。微信游戏页沿用共享会话完成空槽建角与服务端名单刷新。双空槽、拒绝和隐藏已通过本机 Page 与 TCP 验证。

**待验证**。继续补齐微信地图服务窗口、原版角色预览、真机和现行交接。原 37 项要求与 10 个未完成消费者组继续追踪。

[本轮计划](../analysis/game-wechat-creation-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage223-wechat-creation) · [目标审计](../analysis/game-wechat-creation-v1/goal-audit.json)

<a id="stage222-wechat-page"></a>

## stage222 微信游戏页完成本机实现

**事实**。先复核固定样本选角、入场、场景和战斗路径，再把微信 Page 接到共享核心。独立配置启用会话，资源可以从登录页一次性交接。源码和生成包的页面及本机 TCP 用例、模板编译与网页回归均已通过。

**待验证**。下一步继续补齐现行登录到游戏的交接证据、完整游戏菜单和玩法，取得可用的微信运行时验收，再核对真机的资源、网络和触控。原 37 项要求及 10 个未完成消费者组继续追踪。

[本轮计划](../analysis/game-wechat-page-v1/implementation-plan.json) · [需求索引](requirements-index.md#stage222-wechat-page) · [剩余要求审计](../analysis/game-wechat-page-v1/goal-audit.json)

<a id="stage221"></a>

<a id="stage221-chat-presentation"></a>

## stage221 地图气泡、名单和两条公告完成本机实现

**事实**。先用 REA 核定固定样本的过滤、渲染与时钟，再实现共享普通帧和网页适配。225 个测试文件的 2,706 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 783 个输入和 34 个输出，外部导入为零。

**待验证**。原版隐藏聊天开关、气泡素材和音效、特殊角色、战斗中公告、家族邀请应答、真实联机、手机真机及微信原生游戏页待验证。 TalonBrain 缺本项目需求索引，本轮采用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-chat"></a>

### 前序检查点 · 地图和小队聊天完成本机切面

**事实**。先用 REA 核定输入、发送、收包和小队位，再接入共享核心、桌面和移动网页。225 个测试文件的 2,703 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 783 个输入和 34 个输出，外部导入为零。

**待验证**。继续核对头顶气泡、公告与其他消费者。TalonBrain 缺本项目需求索引，本轮使用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 家族邀请和成员管理完成本机切面

**事实**。先用 REA 取证权限、成员选择、邻格和三个发送函数，再实现共享核心、桌面和移动网页。225 个测试文件的 2,701 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 779 个输入和 34 个输出，外部导入为零。

**待验证**。继续追踪邀请接收、入会与其他消费者。TalonBrain 缺本项目需求索引，本轮使用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 家族资料、成员名单和称号完成本机切面

**事实**。先用 REA 核定窗口、状态、权限与出站回调，再实现共享核心、桌面和移动网页。225 个测试文件的 2,699 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 779 个输入和 34 个输出，外部导入为零。

**待验证**。成员管理出站入口、原版余下家族窗口、真实结算和平台验收。TalonBrain 缺本项目需求索引，本轮使用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 家族兽和饲料箱完成本机切面

**事实**。先核验窗口分派、独立权限包、喂食和改名回调，再接入共享核心、桌面和移动网页。225 个测试文件的 2,697 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 775 个输入和 34 个输出，外部导入为零。

**待验证**。继续核对其余家族操作和窗口、近距关闭、原版快捷控制与实际结算。TalonBrain 缺本项目需求索引，本轮使用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 银行和仓储完成本机切面

**事实**。先核验固定 PE 的两种窗口入口、快照、增量、存取及关闭，然后接入共享核心和网页。225 个测试文件的 2,695 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 771 个输入和 34 个输出，外部导入为零。

**待验证**。继续核对 0x22 的独立动作与其他地图窗口。TalonBrain 缺本项目需求索引，本轮使用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 四种地图对话完成本机切面

**事实**。先核验原版解析、字段与回调，再实现共享对话及网页。225 个测试文件的 2,693 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 767 个输入和 34 个输出，外部导入为零。

**待验证**。继续追踪其余 Q?m 窗口及银行独立所有者。TalonBrain 缺本项目需求索引，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 宠物师范两套流程通过本机验收

**事实**。REA 核对报价、选宠、选栏、确认和取消后，普通与扩展宠物训练已接入共享核心及网页。225 个测试文件的 2,690 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 763 个输入和 34 个输出，外部导入为零。

**待验证**。继续追踪其余专用窗口。TalonBrain 缺本项目需求索引，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · 普通技能师范与商店入口通过本机验收

**事实**。REA 闭合固定样本的五种窗口后，普通买卖、兑换入口及技能师范已进入现有网页游戏。225 个测试文件的 2,688 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 759 个输入和 34 个输出，外部导入为零。

**待验证**。下一步追踪宠物技能与其余专用窗口。TalonBrain 缺本项目需求索引，本轮沿用仓库内的需求索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · NPC 治疗和图文对话通过本机验收

**事实**。0x13 的六个原位置、完整治疗、取消和普通余额已接通。文字模式的图形指令通过本机静态像素和动画验收。225 个文件的 2,686 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 755 个输入和 34 个输出，外部导入为零。

**待验证**。继续核对其余专用窗口与消费者，再完成实际平台与服务器验收。TalonBrain 仍缺本项目需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 玩家交易通过本机验收

**事实**。候选选择、直接开窗、物品宠物与金币报价、双方确认、撤回和退出已接通。225 个文件的 2,684 项源码测试和生成核心的 80 项测试通过。四套小程序构建核对 751 个输入和 34 个输出，外部导入为零。

**待验证**。继续追踪其余图文与专用窗口、消费者以及平台验收。TalonBrain 仍缺本项目需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 留言板通过本机验收

**事实**。模式 0x15 的读取、刷新、发布、删除、双向翻页和关闭已接通。225 个文件的 2,682 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。

**待验证**。继续核对已定位的玩家交易发包与入站状态，以及其余消费者与平台。TalonBrain 仍缺本项目需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 单项给予通过本机验收

**事实**。模式 0x1f 的两套数量限制、确认、取消和回包更新已接通。225 个文件的 2,680 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。

**待验证**。继续核对其他交易模式、剩余共享消费者与平台验收。TalonBrain 仍缺本项目需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 物品兑换通过本机验收

**事实**。模式 0x1c 已接通物品付款、堆叠容量、确认和取消。225 个文件的 2,678 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。

**待验证**。继续核对独立模式 0x1f 和其他交易、共享消费者与平台验收。TalonBrain 仍缺本项目需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 鉴定和修理通过本机验收

**事实**。鉴定和修理的报价、提交、取消与背包说明已接通。225 个文件的 2,677 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。

**待验证**。继续核对剩余商店模式、其他共享消费者及平台验收。TalonBrain 仍缺本项目需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-shop"></a>

### 前序检查点 · 普通买卖通过本机验收

**事实**。完成普通买卖、数量核对、槽位保护和取消。225 个文件的 2,676 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。

**待验证**。下一批按已定位的鉴定入口和其他专用模式继续核对，再接入相关资源、剩余共享消费者和平台验收。TalonBrain 仍缺本项目需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 角色交互和普通对话通过本机验收

**事实**。右键查角色、普通服务端对话、菜单与中文输入回复已接入。225 个文件的 2,674 项源码测试与生成核心的 80 项测试通过。四套构建核对 743 个输入和 34 个输出，外部导入为零。

**待验证**。继续追踪商店分支、原版图文与专用窗口，再完成余下共享消费者和平台验收。TalonBrain 缺本项目需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 地面拾取通过本机验证

**事实**。普通右键转身、相邻物品拾取、同格钱币拾取和服务端更新已接通。225 个文件的 2,673 项源码测试与生成核心的 80 项测试通过。四套构建核对 739 个输入和 34 个输出，外部导入为零。

**待验证**。继续追踪掩码 8 的交互回包与展示，再接商店和其余消费者。手机真机、微信游戏页及现行官服待验。TalonBrain 缺本项目需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-targets"></a>

### 前序检查点 · 三条物品分支通过本机验证

**事实**。特殊道具选目标、普通地图丢弃和战斗卸武器已由 REA 字节证据接入。95 个文件的 1,267 项源码回归与生成核心 80 项测试通过。四套构建核对 739 个输入和 34 个输出，外部导入为零。

**待验证**。继续地面拾取、商店模式和其余消费者及平台验收。TalonBrain 缺本项目需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-items"></a>

### 前序检查点 · 普通背包操作已通过本机验证

**事实**。已按 REA 证据接入地图用物、装备、卸下装备、拆分和换槽，纠正战斗物品类别。95 个测试文件的 1,264 项源码回归和生成包 78 项测试通过。四套构建核验 739 个输入和 34 个输出，外部导入为零。

**待验证**。继续特殊物品、丢弃、战斗卸下武器快捷分支、其他消费者和跨平台验收。

**事实**。TalonBrain 缺本项目的需求索引角色，本轮沿用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-input"></a>

### 前序检查点 · 战斗物品输入已接通

**事实**。已从 REA 证据接通背包更新与交换、选择物品、目标编码和发包。94 个测试文件的 1,250 项源码回归和生成包 76 项测试通过。四套构建核验 739 个输入和 34 个输出，外部导入为零。

**待验证**。继续普通场景物品栏与使用、卸下武器快捷分支、其余共享消费者和设备及官服验收。

**事实**。TalonBrain 缺本项目的需求索引角色，本轮使用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-input-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-input-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-mp-items"></a>

### 前序检查点 · 物品结果与待接入的物品输入

**事实**。已完成 CFP、ITM0 和 ITM7 的 REA 核对、共享实现及本机验收。93 个测试文件的 1,244 项源码回归和生成包 73 项测试通过。四套构建核验 735 个输入和 34 个输出，外部导入为零。

**待验证**。查证物品栏状态、选取目标和发送命令，并继续其余共享消费者、独立模型和平台验收。

**事实**。TalonBrain 缺本项目的需求索引角色，本轮使用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/mp-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/mp-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-transitions"></a>

### 前序检查点 · 变身、退场与剩余回合分支

**事实**。REA 字节核验、共享实现、本机 TCP 和真实浏览器验证已完成。92 个测试文件的 1,238 项源码回归和生成包 67 项测试通过。四套构建核验 735 个输入和 34 个输出，外部导入为零。

**待验证**。继续分析 CFP、其余 ITM 分支及依赖 105c、13b4 的回合行为。保留原生名片文件和角色切换、独立模型及平台验收要求。

**事实**。TalonBrain 查询缺本项目的需求索引角色，本轮使用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-transitions-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-transitions-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-friend-roster"></a>

### 前序检查点 · 好友名单与回合进展

**事实**。C、MON 与施法反馈已沿实际收包路径通过本机验收。91 个测试文件的 1,232 项战斗回归及生成包 61 项专项通过。四套构建核验 735 个输入及 34 个输出，外部导入为零。

**待验证**。继续剩余 105c、13b4 消费者和依赖回合分支。原生名片文件缓存、角色切换与平台验收保持开放。

**事实**。TalonBrain 查询缺本项目的需求索引角色，本轮使用仓库索引。

[本轮计划](../analysis/game-battle-shared-storage-v1/friend-roster-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/friend-roster-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-effects"></a>

### 前序检查点 · CHT/BST 播放与收尾检查点

**事实**。正常播放、阶段 7 退场和地图继续显示通过本地验证。90 个测试文件的 1,228 项战斗回归及生成包 58 项专项通过。四套构建核验 731 个输入及 34 个输出，外部导入为零。

**待验证**。继续其余 105c 与 13b4 消费者、未覆盖的技能/命令别名、原生显示与调度，以及平台验收。保留 37 项要求和 10 个未完成消费者组。

[本轮计划](../analysis/game-battle-shared-storage-v1/side-effects-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/side-effects-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 普通战斗及地图回执

**事实**。SKL401 已接入正常战斗收包。带结果位 0x80000 的目标按源队列产生 30 次效果。雨开启时逐帧生成，归零后已有雨滴继续移动。提前退场会清掉仍开启的雨。 89 个测试文件的 1,223 项战斗回归及生成包 53 项专项通过。四套构建核验 727 个输入和 34 个输出，外部导入为零。

**待验证**。继续覆盖 105c、13b4 的剩余消费者、角色别名、原生渲染和三平台兼容。

**事实**。TalonBrain 查询缺本项目需求索引角色，本轮按仓库需求索引和阶段计划追踪。

[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 普通收包验证

**事实**。SKL400 已接入普通 M 收包。施法中途信号启动追踪，目标按结果位闪避、显示提示、随追踪对象移动后归位或离场。离场时同步更新战斗登记与名单。 88 个测试文件的 1,216 项战斗回归和生成包 46 项专项通过。四套构建核验 723 个输入及 34 个输出，外部导入为零。

**待验证**。接通 SKL401 动作 206、207 的天气池及多次目标效果，继续核对 105c 和 13b4 的其余消费者、SKL400 关联记录和完整模型。

**事实**。TalonBrain 查询缺 moli-mac 的需求索引角色，按仓库需求索引和本轮计划追踪本地开发。

[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL402 已接通普通收包

**事实**。SKL402 已接入共享战斗流程。选择器为零时扫描 0–9 槽，非零时扫描 10–19 槽。登记中的倒地角色也参与。施法自然完成后放行目标，各自等到效果结束才释放。 87 个测试文件的 1,209 项战斗回归与生成包 39 项专项全部通过。四套构建核验 723 个输入和 34 个输出，外部导入为零。

**待验证**。继续沿 422500 核对 SKL400 的追踪与目标接管，并核对 SKL401 天气池、动作 207 的重复效果及退出。完整独立模型、其余 105c 与 13b4 消费者和跨平台验收仍在本阶段范围内。

[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · 同槽恢复与 SKL405 本地验证

**事实**。SKL404 同槽交接保留两次登记，在第 7,201 次忙碌检查时追加 11、38 归位动作，随后释放命令并结算。技能等级取编号个位，40491 走等级 1。 SKL405 已接入施法回调。真实动画信号按序更新目标的 1d0、主体资源和链接对象，背景图元完成 255 次透明度递增后交给下一次背景刷新。 86 个文件的 1,204 项回归及生成包的 34 项专项全部通过。四套构建核验 723 个输入与 34 个输出，外部导入为 0。

**待验证**。继续覆盖共用 105c、13b4 的剩余消费者，以及别名、打断和完整独立参考。其他别名、完整的独立状态模型、原生图形后端、手机真机、微信原生游戏页与设备、现行版和官服兼容仍待验证。

[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：合击与完整目标

**事实**：固定37c4旧样本的CMB（opcode8）已接入shared实际四阶段命令执行。依次准备参与者、等待动作70到齐、按源计数器放行、再由434b90等待归位与释放；普通结果先累计32位有符号伤害，1038标记让前序命中只产生反馈，最后一次扣累计HP。没有生成动作53或MP扣费。

**事实**：256组独立队列、62条轨迹的81,918帧完整状态/拥有存储和3,918帧RGBA通过；59条身体结算、duplicate/self两条有界等待和1条本地退出分别记录。冷状态模型的反射/治疗等保留实际7201忙检查恢复；17条实际管理器入口为14个自然回合、2个等待、1个退出，不把不同初始上下文合并。immune两条结算后残留afterimage节点，9000帧观察不等于完整原生对象池收尾。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](../analysis/game-battle-combination-v1/source-check.json)、[源修正](../analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-combination-v1/test-results.json)、[验收边界](../analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](../analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](../analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：附带RID与完整目标

**事实**：固定37c4旧样本的附带RID0生产者4236d0及动作221已进入shared。每条21字段，名称上限28字节、两组有符号HP/MP、状态与资源按源保留；创建两个隐藏且暂不回调的身体、8个整数盒及16字节逻辑交接对象，再向旧身体追加221和[a,0,a,b]。它与结果RID三资源字属于不同语义。

**事实**：新独立方程覆盖53场景、13,799帧状态、完整拥有存储及1,098帧RGBA；50条身体结算，same-a-multiple有界等待，same-a-b子对象移除与element159两条显式消费者边界分别保留。缺少骑手、当前槽位上下文及未覆盖角色标记原子拒绝；135等共用105c指针分支显式停止，未借独立chant/projectile映射伪造原生共享指针。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](../analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](../analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](../analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](../analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](../analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：近战分派与结算

**事实**：固定37c4样本的73类variant0已接入共有近战生产者424310；十个等级都以38/53开始，不加入147，按实际M记录扣一次MP。护卫、RID元数据、反射/治疗/跳过、击倒、普通后续记录与自身目标保留原始动作顺序。73没有14专用资源映射，普通命中使用1adb1～1adb3随机效果。原先73的variant1/2/3仍走独立远程路径，不增加近战MP扣费。

**事实**：4,640组独立队列、136条轨迹、50,158帧状态与10,580帧完整RGBA对照通过，118条身体自然结算、2条本地244退出、16条有界等待分别记录。22条实际管理器流程为17条自然回合、4条既有7201恢复和1条退出。额外回归旧73远程变体7,680队列、15轨迹、4,108状态、310帧RGBA；132份旧生成器与金样文件均未改变。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair73-v1/source-check.json)、[源修正](../analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair73-v1/test-results.json)、[验收边界](../analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：连击生产者与回调

**事实**：按固定37c4样本的424310与40a120接入260首对生产者、201/203移动朝向、204第二目标和14主命中，十个等级、守护、RID、普通后续记录及255结束标记均有独立证据。204在dead*14+24帧处理第二目标，先保存原攻击者再替换父关联；主攻击1af89朝向0，原攻击者仍为260/9时连击朝向1。202单独验证为“元组slot与flags坐标”，不是amount；260生产者并不发出202。

**事实**：独立模型4,640组队列、191条轨迹、66,189个状态和21,374帧受支持RGBA比较通过；167条身体结算、2条本地244、18条有界等待、2条保留图形0错误与2条201上下文错误分开记录。21条真实管理器路径为18条自然回合、2条既有7201恢复及1条退出。130份旧生成器/金样未改；原188条本轮轨迹也完整保留，另增3条普通信号资源轨迹。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](../analysis/game-battle-chain260-v1/source-check.json)、[源修正](../analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-chain260-v1/test-results.json)、[验收边界](../analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](../analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](../analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：多段动作与共享游标的完整本地切面

**事实**：固定37c4旧样本的105首条pair/variant0及真实156/97/98已接入shared，保留前置蓄力、残影、速度25、逐次动画反应和声音，再由14统一结算HP/RID。游标属于同一客户端播放所有者，在两个施术者之间共享；自身反应中断后保留1，清理身体后下一次从动作8继续，完成时才按源重置。既有正变体105路径保持。

**事实**：4640组队列、158条轨迹、63158帧状态、可渲染部分42058帧完整RGBA及两selector/拥有存储一致。141条身体结束、3条244退出、12条1800帧等待、2条渲染拒绝分别记录。七组真实交错游标流程通过，护卫延迟触及相对偏移209；十等级763次动画完成只在随后14结算一次HP。22条命令管理器流程含19次自然回合结束、2次现有超时恢复、1次退出，没有注入ready、游标或手动弹队列。此前128个生成器/golden字节不变。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-context-v1/source-check.json)、[源修正](../analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-context-v1/test-results.json)、[验收边界](../analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：三个配对生产者进入共享核心

**事实**：固定37c4旧样本的94、257、262首条pair/variant0队列及真实消费者已接入shared。94使用额外104c标量、78声音与96前置动画，再由14按字面优先级分派条件和HP；257/262保留73/74、最高级tile2/3、额外效果及262的205冲刺和1af89朝向1。护卫、RID旧第四字、E000、别名自身与普通后续记录分别核对。0x106=262、0x10a=266的先前纠错保持；本轮没有新增平台专用功能。

**事实**：41760组队列、307条轨迹、71230帧状态、32260帧完整RGBA及两selector/完整拥有存储与实际共享核心一致；286条身体结束、6条244退出、15条1200帧等待分开记录。18条真实命令管理器流程含12次自然回合结束、5次现有超时恢复、1次退出，未注入ready或手动弹队列。初始新模型遗漏44对子效果的清理，已按既有源码修正；37440组原队列、289条原轨迹输入、原创资源和geometry保留，8条预期轨迹改变，另增18条优先级轨迹。此前126个生成器/golden文件字节不变。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](../analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](../analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：先修正源类别，再接入剩余特殊pair

**事实／纠错**：原424310的`0x106`是262，`0x10a`才是266。旧实现和独立模型曾把262的205冲刺、最高等级73/74套给266；本轮修正shared的配对生产者及护卫路径，266恢复普通9接近。此前stage209相关“266/205”结论已被新证据纠正；正变体和自身266的独立规则继续区分。其余五类特殊pair并未因此启用。

**事实**：三套受影响独立模型完整重跑，原场景、队列输入、原创资源和geometry保持一致；仅266预期队列和21条轨迹改变。当前三套合计211195队列、603轨迹、138928状态、13600完整RGBA帧，两selector经实际核心核对。旧126个生成器/golden文件中6个发生本次明确修正，其余120个字节不变；历史修改前原件及源核验视图均保留。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](../analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：96默认后端与剩余开发

**事实**：固定37c4旧样本的96首条pair/variant0生产者及75/76/80/89/90/92/93/94/95真实动作已进入shared，包含可见性/瞬移/冲刺、源HP置零、冻结、护卫及普通后续记录；正变体1/2/3仍沿用先前普通发射路径。

**事实**：公开默认配置下72条轨迹自然收敛、2条244退出、6条保留1200帧等待。16条真实管理器验证得到9个自然回合、6个源超时恢复回合、1个退出；各命令与最终管理器分别计数，7201次忙等待触发恢复，纯回位等待不加计数。自身、护卫别名和连续反击的正常原生完成仍未闭合；未注入ready或手动弹动作来强行结束。

下一步继续其他特殊pair、radial238、attachedRID/CMB；并闭合替代渲染及等待的原生前提，保留完整游戏与平台验收范围。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special96-v1/source-check.json)、[源修正](../analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special96-v1/test-results.json)、[验收边界](../analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：嵌套生产者与继续开发

**事实**：固定37c4旧样本的72/113首条嵌套生产者及真实232、5、56/57/58/61/79动作已进入shared，包含主目标/嵌套目标的双护卫、反射/治疗/跳过/组合位、游标和普通后续记录；24等待忙目标时的动画遗漏已按原始代码修正。

**事实**：独立9120组队列、261条轨迹、58154帧状态、4812帧双selector完整RGBA及前后200动作/800tuple存储一致；256条自然收敛、1条244退出、4条等待1200帧。13条真实管理器中8个自然回合、4个超时恢复回合、1个退出；各命令与最终管理器分别计数，7201次忙等待触发恢复，纯回位等待不加计数。双护卫自然完成不等于此前211自身护卫正常完成已解决。

下一步继续特殊pair96/radial238/attachedRID/CMB及完整游戏；并核对113前置解析与嵌套RID/等待的原生前提。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](../analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：266自身/护卫生产者与继续开发

**事实**：固定37c4旧样本的266正变体2已接入“保存最后一条自身记录→独立216结果”共享核心；通用正变体可解析并忽略自身护卫标量。原有网页、移动网页、微信薄适配沿用同一核心，未增加Swift/AppKit功能。

2880组队列、175条轨迹、98543状态、6294帧完整RGBA及初末200动作/800tuple存储一致。92条身体收敛、2条244离场、81条等待链在1000帧内未自然收敛。13个实际管理器场景中9个正常回合、3个等待恢复后回合、1个离场。普通护卫观察在7204恢复、7208结束；自身别名为7203/7207。阈值是7201次busy调用，归位等待不递增，不能把恢复称作正常护卫命中。

下一步继续核对护卫等待的正常前提及原生调度，再推进nested72/113、特殊pair96、radial238、attachedRID/CMB和完整游戏。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-self-physical-v1/source-check.json)、[源修正](../analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：正变体E000与后续完整目标

**事实**：固定37c4样本的27类正变体1/2/3接入字面E000结果动作与119/120/121实际完成，包含目标HP、RID归属、组合位、单弹/多目标返回及回合/离场。非自身目标的10/1000/200位按原始生产者作为普通标志处理，不套用pair护卫/113脚本。

207360组独立队列、495条轨迹、57686个状态、7388帧完整RGBA及实际200动作/800tuple初末存储一致。486条身体收敛、3条预期244离场、6条重复治疗/自身73链在1000帧内未自然收敛。27个实际管理器场景中18个正常回合、6个在7203恢复后于7207结束、3个离场；不能把恢复当作正常播放闭合。

下一步跟踪自身266/guard与nested72/113实际生产者和消费者，再继续特殊pair/radial/attachedRID/CMB及所有原始要求。

**待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](../analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](../analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：E000直接结果进入跨平台核心

**事实**：固定37c4样本的20类有限pair/variant0路径接入E000反射、治疗、跳过，真实119/120/121效果完成、HP/MP、护卫、RID、tuple游标及回合/离场所有权进入shared跨平台核心。值优先级为8000→4000→2000；producer及RID独立判断2000，保留组合位的源行为。

独立原创方程与实现对照179200组队列、301条轨迹、63085个状态、6100帧完整RGBA（双selector），初始/最终原始200动作格与800tuple格相同。300条身体收敛，1条预期244离场；19个真实命令管理器场景得到18个正常回合和1个离场，均无超时恢复。

下一步依据实际消费者推进正变体结果，再继续nested/special/self/radial/attachedRID与其他原始要求。

**待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。

[需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-results-v1/source-check.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：继续完整物理族的护卫消费者

**事实**：固定37c4样本的20类已支持pair路径接入三角色护卫、连续0x1010 look-ahead和113状态的0/3蓄力；护卫者承担真实结果，被保护者保留受击移动。RID与三字tuple保留原有第四字，113按源逻辑冻结自身与当前tuple目标。

独立原创方程与实现对照16000组队列、227条轨迹、58109帧状态、5124帧完整RGBA（双selector），初始/最终原始200动作格和800tuple格也相同。223条身体收敛，1条预期244退出，3条别名/RID链在3000帧内未收敛；真实管理器在7203次回调触发已有恢复后结束，不能把恢复算作正常播放闭合。

下一步按body14/4241f0实际结果路由补齐E000，再继续nested、特殊pair与self/radial/attachedRID；不能以119/120/121视觉蓄力代替结果路由。

**待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：继续完整物理族

**事实**：固定37c4样本的258类variant1/3已接入71b1（最高等级71b2）瞬时叠图，variant2保留无叠图分支；258/259/266正变体最高等级240平铺前缀、259最高等级直接路径及命中平铺进入shared核心。瞬时图复制当次世界坐标，不跟随父节点。

独立原创Python模型与实现对照64800正变体队列、132条新轨迹、19294帧状态、3664帧完整RGBA，双selector一致；132条均在观察内身体收敛。旧206的61920队列/879轨迹输出逐字节不变。原作程序本轮未执行，方程匹配不等于原生运行证据。

**待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。

[需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：正变体发射、回收与独立73

**事实**：基于固定37c4样本，实现25个generic选择器及独立73类的有限variant1/2/3发射路径：真实动画probe、单弹、多目标回收、连续发射和28反应；73不使用generic耗蓝前缀。95/105/110前缀与6/84/85/87的正变体HP结果保留各自源规则。公共消息工厂改为当次世界浮点坐标，修复95移动后仍取旧屏幕缓存的问题。

独立原创Python源方程生成61920队列、879轨迹、134538状态和16606帧完整RGBA，两种selector均逐项匹配；873轨迹身体收敛。自身73及重复目标各3条在3000次观察内保持未收敛，不能算成功回合；实际源码/生成包管理器均由wait counter>7200恢复这6条，未注入ready。原作可执行文件未运行，本机方程匹配不等于原生运行证明。

**待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。

[需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：完整消费者主线继续推进

**事实**：本轮依据固定37c4样本的41f310/41f2d0，修正公共26/160反应烟雾：使用身体当次移动前世界坐标、无父链接、不消耗模型随机数；12/13逃跑烟雾沿用独立随机工厂。没有新增正变体或特殊技能可用范围。

先补齐原生helper与消费链，再实现正变体/probe/projectile及完整guard/charge/脚本；当前没有以有限烟雾修复替代全族完成条件。

全量2194项源码测试（184文件）、440项生成检查（433 neutral＋7 App/Page）、四套构建通过；615输入和34输出身份一致。108条本机OS TCP流程及18条实际桌面/触屏页面流程通过，92截图逐个hash，页面错误/警告/外联均为0。新增源码与生成回归各1项；本轮没有新增TCP场景。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：有限直接路径实现与完整公共族后续

前检3140文件/200541442B零差异，494个候选文件保持精确修改前备份。experience,requirement-index/development/3000仍缺requirement-index，使用当前项目需求索引；git status128，没有git登记，不改外部规则。

已接入20类的有限pair/variant0直接结果（259的level9除外），保留29类选择器；MP6、84/85/87不扣HP、首击/后续actor、状态/RID、81额外回复、258移动和真实等待/结束拥有者分别处理。旧`planBattleStrike`/`queueStrike`仍是0/1/3有限接口，实际游戏公共族命令走新`queuePhysicalFamily`。

本轮2193项Node测试/183文件、439项生成检查（432 neutral+7 App/Page）、四套构建615输入/34输出均通过。独立15995队列、75场景、17488完整建模状态、2358完整RGBA帧（双selector）；108条实际本地TCP流程验证540次正常启动请求、553包技能、110次查询、113条S、101次退出及202次战后移动。实际game.html桌面/触屏18流程、92截图，Chrome156.0.8078.80/Playwright1.64.1，页面错误/警告/外部请求均0。

正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：公共物理族完整实现前的来源核验

前检3131文件/199834018B零差异，492个候选文件已先备份。experience,requirement-index/development/3000仍exit2缺requirement-index，使用项目内需求索引；git status128，无git登记，不改外部规则。

当前入口是4260b0/424310完整公共族，覆盖28个generic类别及相关73、0/1/2/3变体和独立脚本。十组消费者义务将生产者、护卫/后续拥有者、直接命中、15/18及投射物、113蓄力、72/113嵌套、96脚本、高类别/自身、73与整体验收分开跟踪，均未标完成。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增10规范函数3679B及44B常量核原件，重核公共生产者8618B、身体/构造67615B及分派器54685B指令。规范函数由718到728；本次95记录含54复用/41新增，有限快照并集由2346到2387，不能把规范缓存算成完整Evidence。45个旧大快照核完整哈希和身份并沿用逐对象JSON证明，另解析29/42/54三个小快照。会话已关闭、cleanup=false。

本轮新运行源码测试0、生成检查0、页面流程0；运行模块/导出/适配器/测试及native/vendor未改。已复核stage202构建607输入/34输出和日志身份；此前2142项Node、393生成检查、15页面流程是历史验收基线，本轮未重跑，未重复累计。只运行并通过当前来源核验脚本。

本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](../analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](../analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：继续82完整消费者链

编辑前核stage201的3106文件/195938062B，0差异；479个候选文件先按原清单备份，未重建基线。experience,requirement-index/development/3000仍exit2缺requirement-index；项目内需求索引继续维护，无git登记，不改外部规则或审批配置。

先定位4260b0的82分支、147/8/6/10/78/83/34/89/84/35/87以及RID/震动/停止返回闭环，再实现共享核心并核独立方程和来源/生成/实际页面。原18条剩余要求逐字保留并追加第19条，不结束完整目标。

新增48项，全量181文件2142项Node通过。四套当前构建核607输入/34输出身份、0external；393生成检查（386neutral/7App/Page）通过。独立1463队列、63场景16706完整建模状态和2404完整RGBA帧（两选择器）一致；47源停止、15身体结束与1空目标未证边界分开。97条最终真实本机TCP（41来源/41生成/15实际页面）核485启动、498技能包、99自动查询、102个S请求、90返回/180移动。81次独立截图、53个不同图像文件哈希位于源码外，均为原创合成资源；浏览器0错误/警告/外部请求。

82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](../analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](../analysis/game-battle-skill82-v1/source-check.json)、[验证修正](../analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-skill82-v1/test-results.json)、[TCP](../analysis/game-battle-skill82-v1/network-validation.json)、[页面](../analysis/game-battle-skill82-v1/browser-validation.json)、[验收](../analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](../analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](../analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：沿完整消费者追踪83移动与停止

编辑前核stage200的3082文件/192891796B，0差异；467个候选文件先按原清单备份，未重建基线。experience,requirement-index/development/3000仍exit2缺requirement-index，项目内需求索引持续维护；无git登记，不改外部规则或工具审批。

先用REA核83共享记录、移动/目标/残影和599c40/599c44的真实读写，再实现纯shared并核独立方程、来源/生成TCP与实际页面。原17条剩余要求逐字保留并追加第18条；本地有限切面验收不结束完整目标。

新增33项、全量179文件2094项Node通过。四套当前构建覆盖599输入/34输出身份，0external；生成验收共351项（344neutral/7App/Page），由326既有、24新TCP及1修正后的队列检查构成，初始验证脚本错误与重测日志单独保留。独立939队列含737支持/202明确拒绝边界；59场景核9387完整状态和1828完整RGBA帧（两选择器），区分31源停止、22身体结束、4特殊槽身体等待和2未证边界；phase2未交接4例，其中3已被源停止抢先结束、1仍在等待。最终61条真实本机TCP（24来源/24生成/13实际页面）核305启动、318技能包、63自动查询、66个S请求、48返回/96移动。69次独立截图、46个不同图像文件哈希在源码外，均为原创合成资源。浏览器0错误/0外部请求；3条Canvas读回性能提示来自验证器反复读像素，无其他警告。

非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](../analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](../analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](../analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](../analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](../analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](../analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](../analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：数值消费者、实际回合与证据计数纠正

编辑前核stage199的3057文件/188321569B，0差异；454个候选文件先备份并核原清单，无重建基线。外部experience,requirement-index/development/3000仍exit2缺requirement-index；继续用项目内需求真源，无git登记，不改外部规则或审批。

先复用并核验4260b0/40a120/41dc00及41b6a0的真实消费者，再实现无平台核心，最后核独立方程、来源/生成TCP和实际网页。35新增/2061全量Node、四套构建/326生成检查（319neutral/7App/Page）通过；595输入/34输出身份一致，0external。独立3类十等级、2317队列、157场景16447完整状态、3250完整RGBA帧（两选择器）一致；154场景身体结束、151场景命令结束，6个源phase2等待单独保留。71条最终验收用真实本机TCP（28来源/28生成/15实际页面），核355启动、368技能包、73自动查询、76个S请求、60正常返回/120移动；初始观察不重复计入。78次独立截图在源码外，对应43个不同图像文件哈希；均为原创合成资源，浏览器0错误/0警告/0外部请求。

原16条剩余要求逐字保留，本轮追加第17条。下一步继续83及其真实移动/死亡依赖，随后其余技能、玩法和实际平台验收。共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](../analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](../analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](../analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](../analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：状态消费者与回合所有权

编辑前核stage198累计3032文件/182501413B，0差异；440候选和2个额外旧参考均先备份核原清单，共442可复核基线，未重建基线。外部experience,requirement-index/development/3000查询仍exit2缺requirement-index，使用项目内需求索引；无git登记，不改外部规则/审批。

先核共用元组/135分支、四个查询函数和实际回调指针，去重后只计3个新规范函数；再实现状态/辅助队列、粒子计数和C效果拥有者，最后比对独立方程及真实产品。59新增/2026全量Node、四套构建/297生成检查（290neutral/7App/Page）通过；587输入/34输出身份一致，0external。独立36类十等级、2912队列、416场景12775状态、6384完整RGBA帧（两选择器）一致。115条最终验收用真实本机TCP（51来源/51生成/13实际页面），核575启动、591技能包、117自动查询、123个S请求、109正常返回/218移动；初始观察不重复计入。71张原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

原15条剩余要求逐字保留，本轮进展追加为第16条。下一步继续数值/治疗类61..63及其真实消费者，随后补其余技能、玩法与真实平台验收。其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](../analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-status-skills-v1/test-results.json)、[TCP](../analysis/game-battle-status-skills-v1/network-validation.json)、[页面](../analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：施法消费者到产品验收

编辑前核stage197清单3005文件/175743254B，0差异；412候选文件与15额外旧分析文件均先备份并核原清单，共427可复核基线。无git登记，未暂存/提交。外部experience,requirement-index/development/3000查询仍exit2缺requirement-index，使用项目内既有索引；未改外部知识库、规则或审批。

先定位需求和原14条剩余要求，再核分派器/真实指针/独立回调及常量，继而实现无平台核心；最后核原方程、来源/生成TCP及实际页面。38新增/1967全量Node、四套构建/245生成检查（238neutral/7App/Page）通过；579输入/34输出身份一致，0external。独立4686队列、213回调场景25917状态、6078完整RGBA帧（两呈现选择器）、294寻向和180个有符号CRT边界通过。60新真实本机TCP含10实际网页鼠标/触摸流程，核300启动、313技能包、2个1101标签包、62自动查询、65个S请求、53次正常返回/106移动；52张验收用独立原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

下一步继续已留存分派器中的剩余技能、独立RID及状态/连接依赖，先补消费者证据再实现。原14条要求逐项保留，本轮增量作为第15条追加。自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[规格](../analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](../analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](../analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-casting-v1/test-results.json)、[TCP](../analysis/game-battle-casting-v1/network-validation.json)、[页面](../analysis/game-battle-casting-v1/browser-validation.json)、[验收](../analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](../analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：接收规格到人物技能产品链路

编辑前核stage196清单2983文件/173429372B，0差异；409候选文件先备份。需求计划保留上一阶段13条完整剩余要求，先追消费者/回调和格式，再实现无平台核心及薄页面控件。外部experience,requirement-index/development/3000查询仍exit2缺requirement-index；维护项目内现有需求索引，不改外部知识库、规则或审批。

本轮由主记录/子等级拥有者、主技能/等级/目标状态、会话自动工艺查询、实际已有SKL物理回调串起完整有限路径。独立参考、来源TCP、生成API与实际页面依次验收。31新增/1929全量Node、四构建/218生成检查（211neutral/7App/Page）通过；571输入/34输出身份一致，0external。45独立完整接收状态、14输入场景781状态、110个有符号MP计算边界通过。32新真实本机TCP含6实际页面，核160启动、177技能接收包、34自动查询及37个S请求；25次正常返回、25退出/50移动，27张原创夹具截图在源码外。

下一步继续原分派器的未移植技能/魔法与自身/状态/RID真实队列和效果，补齐普通玩法、原生窗口/命中/音频/整体调度与真实平台验收。完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-player-skills-v1/source-check.json)、[测试](../analysis/game-battle-player-skills-v1/test-results.json)、[TCP](../analysis/game-battle-player-skills-v1/network-validation.json)、[页面](../analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-player-skills-v1/goal-audit.json)。


<a id="stage196"></a>

## stage196：从普通宠物窗口到真实MON生命周期

执行前按stage195清单核2952文件/166155842B，394候选文件先备份，另外6个受影响旧分析/参考/TCP文件在编辑前另备并核原清单，共400可复核基线；没有重建或覆盖未知基线。先建需求/规格，再改共享核心与薄适配层。外部experience,requirement-index/development/3000查询仍exit2缺requirement-index；项目内索引继续为需求真源，未改外部登记。

实现包含缓存捕获/C刷新/218刷新、window28真实intro、M选择/收回、MON0/2/1队列、39/65/51/52/218与49删除，以及实际呈现令牌/缩放依赖。先按独立方程比对，再做来源/生成/实际页面和生命周期验收。51新增/1898全量Node、四构建/203生成检查（196neutral/7App/Page）通过；567输入/34输出身份一致，0external。16独立MON场景1864状态、13输入场景673状态、240独立缩放策略像素用例通过；MON同时核两呈现选择器，共3628个像素结果，100个alternate未支持结果。32新真实本机TCP含6实际页面，核160启动、210宠物接收包、42输入（27 M|1、8 M|FF、3 W|FF、4 N）、25退出/50移动及25次正常返回；25张独立原创夹具截图在源码外。

下一步按已留存源证据继续未实现处理者、原生窗口/命中/音频与跨平台真实游玩；保留以下完整目标。完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](../analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pet-transition-v1/source-check.json)、[测试](../analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](../analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](../analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](../analysis/game-battle-pet-transition-v1/goal-audit.json)。


<a id="stage195"></a>

## stage195：接收数据到骑乘/宠物选择的最小完整切面

执行前按stage194累计清单核2929文件，保留388当前候选备份；HTML另以已读旧内容与逆向差分恢复并核194完整哈希，明确不称为编辑前备份。需求索引先建立本轮计划，再按接收者/状态机规格实现。外部experience,requirement-index/development/3000仍exit2缺requirement-index，项目内索引继续是真源，未改外部登记。

先补齐持久宠物/技能载体，再移植状态0/3/4/5、记忆与真实窗口动画，最后接薄网页/触摸；初次参考和网络失败保留，按源证据改正夹具/参考而不注入就绪。36新增/1847全量Node、四构建/173生成检查（166neutral/7App/Page）通过；555输入/34输出身份一致，0external。15独立场景833输入状态、53完整接收记录状态通过。38新真实本机TCP含6实际页面，核190启动、120宠物接收包、86输入（34 W|FF、28 W|0|A、5 W|1|0、3 W|2|29、10 G、6 N）、31退出/62移动与31次正常返回；24张独立原创夹具截图在源码外。

下一步继续未实现SKL类别/动作处理、其他身体与渲染分支和产品玩法，逐项完成独立参考与实际流程。完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](../analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](../analysis/game-battle-mounted-input-v1/source-check.json)、[测试](../analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](../analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](../analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](../analysis/game-battle-mounted-input-v1/goal-audit.json)。


<a id="stage194"></a>

## stage194：CBC到真实子对象与本机产品链路

执行前核2907文件基线，按当前清单备份383候选；将持续演进的未支持操作夹具从CBC迁往CFP前再备份2个旧辅助文件。执行模式development/R1；外部experience,requirement-index/development/3000查询仍缺requirement-index，仓库需求索引为真源，未改外部知识库。

CBC不是装备等待动作，故接入即时当前资源/四数值与实际子对象所有者；复用已完成REA档案，只补6个缺失辅助函数及指针已证的32B回调。复核时发现备用深度Y漏接，先改独立参考得到10项真实失败，再修产品并重跑相关验收；没有只以初次绿灯结案。50新增/1811全量Node、四构建/157生成检查（150neutral/7App/Page）通过；551输入/34输出身份一致，0external。32独立场景1010状态/完整640×480RGBA通过；36新真实TCP含8实际页面，核180启动、39输入（36个G/3个H|A）、27退出/54移动、27次正常返回。24张原创夹具截图在源码外。

完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-character-change-v1/source-check.json)、[规格](../analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-character-change-v1/test-results.json)、[TCP](../analysis/game-battle-character-change-v1/network-validation.json)、[验收](../analysis/game-battle-character-change-v1/validation.json)、[剩余目标](../analysis/game-battle-character-change-v1/goal-audit.json)。

<a id="stage193"></a>

## stage193：实际对象换位与资源回调闭合

继续同一完整游戏目标，执行前已建立本轮需求/规格，核2885文件基线并按当前清单备份377候选；桥接器在发现实际问题后另做1份修改前备份，原Web测试已在候选内。外部experience,requirement-index/development/3000仍缺requirement-index，项目索引继续作为需求真源；未修改外部知识库。

复用已完成REA档案，核12项规范函数范围和派生4260b0的54685B原指令。最小实现切面为POS真实对象/元数据/当前操作者、EQU待用/当前资源、PSN共用完成朝向，以及实际网页两轮复现后新增的有界本地桥时长。70新/1761Node、四构建142生成、31新TCP、7实际页面通过，完整目标未缩为本轮切面。完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-change-v1/source-check.json)、[规格](../analysis/game-battle-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-change-v1/test-results.json)、[TCP](../analysis/game-battle-change-v1/network-validation.json)、[验收](../analysis/game-battle-change-v1/validation.json)、[剩余目标](../analysis/game-battle-change-v1/goal-audit.json)。

<a id="stage192"></a>

## stage192：闭合共用PSN数值与等待消费者

本轮沿完整游戏目标继续：PSN是剩余技能、道具会依赖的HP/MP与数字回调。实现所有者为shared的commands、body、playback与新status模块；实际网页沿既有owner显示值，没有新增演示状态或协议字段。

执行前已建立需求计划/规格并核2863文件基线、80候选备份；外部experience,requirement-index/development/3000查询仍缺requirement-index，项目内索引是需求真源。本轮先补4项REA函数并核原字节，再生成独立参考和实现。附RID、未知选择值及其他分支保持明确依赖，未把原阶段改成只做PSN。

38新/1691Node、四构建129生成、29新TCP和7页面流程通过。完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-status-v1/implementation-plan.json)、[源核验](../analysis/game-battle-status-v1/source-check.json)、[规格](../analysis/game-battle-status-v1/implementation-spec.json)、[测试](../analysis/game-battle-status-v1/test-results.json)、[TCP](../analysis/game-battle-status-v1/network-validation.json)、[验收](../analysis/game-battle-status-v1/validation.json)、[剩余目标](../analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：把已有有源战斗接入实际网页产品

**根因与来源：** 修改前通过实际文件选择、正常升级/选人与真实B/C/P/A/M，桌面和触屏仿真均确认game.html隐藏战斗画布且没有攻击控件。所有者为web/legacy-game-client和game-app：前者没有配置战斗端口、只建立普通Canvas；后者遇battle-pending主动隐藏stage。本轮复用675规范函数/2210记录及既有entry/input/loop/exit/return/skill规格，固定37c4/1569280B身份重核，不重复native问题。

**实现：** 每个真实浏览器client绑定自己的目录、身体/帧/入场/输入/回合/退出/返回。新增battle Canvas拥有异步任务、调度、一次延迟意图与暂停/关闭；真实640×480战斗呈现不改变普通显示上下文。页面按钮、目标、姓名、当前HP/MP、倒计时由真实source owner投影，源菜单未就绪时不可提交。像素I/O取消保留同一逻辑帧和待消费意图；回合2等待下一真实C，返回缺坐标时等待实际后续消息，不制造ready。稳定live文字不重复改写。

**验收：** 3新增/1653 Node；四构建/117生成检查，539输入和34产物核身份。实际页面14次（12主场景+2独立Canvas）、旧普通页面7次、改前基线2次共23次，0控制台错误/警告/外部请求。15次新战斗OS TCP（页面14+组件1）核16输入、10退出、20恢复移动请求；10次产品返回。独立Python9个全幅640×480参考与桌面/触屏实际位图摘要一致，45张原创夹具截图置于源码树外。

**仍需完成：** 全部其余技能/handler/人物分支、原生菜单图像/命中/音频/渲染变体/调度、其他玩法和平台验收。手机仅触屏仿真，WebKit文件夹选择、localhost外网络和真实手机均未证明；原生微信游戏Page/设备及现行/官方未完成，无测试账号。旧未配置49切片的统一仍保留在原阶段要求。本轮0 VM/CUA/原程序/官方会话，不改Swift，phase_complete=false，完整目标active。

[来源核验](../analysis/game-battle-web-v1/source-check.json)、[规格](../analysis/game-battle-web-v1/implementation-spec.json)、[测试](../analysis/game-battle-web-v1/test-results.json)、[实际页面](../analysis/game-battle-web-v1/browser-validation.json)、[位图核验](../analysis/game-battle-web-v1/canvas-browser.json)、[网络](../analysis/game-battle-web-v1/network-validation.json)、[验收](../analysis/game-battle-web-v1/validation.json)、[目标审计](../analysis/game-battle-web-v1/goal-audit.json)。

<a id="stage190"></a>

## stage190：实现有源的普通物理SKL消费者

**范围与来源：** 延续原完整战斗阶段。固定cg_se_6000.exe为1569280B、SHA256 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd；REA6.7.0/Ghidra12.1.4，24新规范函数后总数675，2210记录。新增27段19781B与原件一致，复用8B浮点常量另核；独立派生KO回调536指令字节核原件，不计规范函数。新快照因evidence_integrity_mismatch未保存，完整证据导出已保留，分析会话open=false/cleanup_pending=false；不重复已完成查询或改工具配置。

**实现：** 普通物理类0/1/3、variant0、结果位0x1000012f，经实际424310队列/tuple进入main10/6。38/147/157/53使用真实蓄力动画和C当前MP，7/9/10/24/242/14推进真实位置、目标和命中信号；HP仅在10000..19999信号结果处更新，>=20000只做前置受击。26/160、29、数字/命中/提示、44/46/47/49和50粒子完成反馈均接实际池。C保存的四值与运行body值分开拥有，新一轮C实际覆盖，目标筛选读当前HP。

**验收：** 19核心+14源TCP=33新增，1650全量通过。13场景3137状态/完整RGBA独立核对；四构建/115生成检查，539输入和34产物核身份、0external。28新OS TCP完成10726战斗/返回帧、1144普通帧、32准确H|A、22退出和44移动请求；命中取消不重扣、重入/关闭、读取故障及真实C反馈均核。

**仍需完成：** 其余SKL类/变体/结果位、RID、自己/预先死亡/状态/挂件/坐骑/缩放等分支、其他handler和完整渲染/菜单/音频、产品页面/触屏、其他玩法及微信设备/现行/官方。新增已配置路径的49遵循源删除；旧未配置局部切片仍有历史49行为，须统一，不能当完整实现。本轮未操作VM/CUA/原程序/账号，无测试账号；phase_complete=false、完整目标active。

[源证据](../analysis/game-battle-skill-v1/source-check.json)、[规格](../analysis/game-battle-skill-v1/implementation-spec.json)、[测试](../analysis/game-battle-skill-v1/test-results.json)、[TCP](../analysis/game-battle-skill-v1/network-validation.json)、[验收](../analysis/game-battle-skill-v1/validation.json)、[目标审计](../analysis/game-battle-skill-v1/goal-audit.json)。

<a id="stage189"></a>

## stage189：实际普通场景返回与输入恢复（原战斗阶段继续）

**前检与真源：** 上轮为有效进展；2797选定文件重核0不符，72候选文件修改前备份，无Git。已读项目目标/文档/材料、需求索引、Router分类/加载合同及REA/native指南；external experience,requirement-index/development/3000仍缺requirement-index，使用项目内需求真源，未修改外部知识库、工具或全局规则。

**事实：** 固定cg_se_6000.exe为1,569,280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA6.7.0/Ghidra12.1.4，2115→2134记录，6函数查询中3新规范入口、3旧入口，648→651；3新read/6映射核457B。20个保留函数的PE跨度14699B另留身份；43ba10代码指针入口无法由REA识别，独立临时Ghidra工程导出并逐指令核1515B，不计为REA新规范函数。524041509B快照留build，最终open=false/cleanup_pending=false。

**修正上一阶段理解：** 501a50/3在进入main10前调用4ff430移除本地本体、440450清空远端逻辑记录，保留本地资源/朝向/坐标/标签/速度全局。9250c8是包装数值基址，9250cc仅载荷；真实4f16d0/4f2010通过ECX传基址并检查值，伪代码省略thiscall参数，不能只查载荷引用。独立实现普通0/1值及对应两类消息限制，不仿制包装或新增线字段；移除、地图、状态等消费者分别处理。

**推导：** 支持的ordinary0来源必经main9/3，之前103或11回退已把f5f18c设为1；已观测重置在9/0，不在这条路径中。因此使用来源路径不变量，不增加调用者initialized/ready字段；不宣称全程序间接写入穷尽。

**实现：** 显式configureBattleReturn后，9/1保留上帧并设wait0；11清30次后用真实全局创建/刷新本地本体，保留退出后新远端本体，关闭旧动画/移动拥有者，复用实际地图/角色渲染并捕获640×480；同次开始source13淡入，2仅复制固定捕获，完成后20/3生成真实普通帧。只有像素成功后以同一逻辑帧及generation提交，pending才清，创建新runtime。取消重试保留原逻辑帧；场景/CUT更新保留已捕获淡入，依赖未就绪不推进重建/激活。

**验证：** 7核心+11源TCP=18新增，1617全量/18焦点通过；四构建、94neutral+7App/Page=101检查，531输入/34产物身份一致、0external。源/生成各11新OS TCP，共22条；5390战斗/返回帧、936返回后普通帧，1004独立捕获淡入RGBA，24准确G/24退出请求/36返回后移动请求。18次实际返回playing，每次52普通帧和两准确移动。4取消重试、2次返回中重入、4依赖检查、48被限制unit/action与24未限制removal、2读取故障分别核验。

**问题与下一步：** 初次真实整合发现scene回调读取全世界/battle快照触发重入；已改为实际网格中心专用只读投影并保留错误码。另两项测试前提分别误用旧显示中心和未发送的后续网络修正，已按独立指针/52帧参考修正；四份原失败日志保留。正常返回是独立逻辑移植，原生普通池/完整UI和音频调度、其他main9分支、退出9/type14控制、CHT/BST、完整SKL/其他动作、产品页面/触屏/微信gamePage/设备及其他完整玩法仍缺。无测试账号，本轮0 VM/CUA/原程序/账号/官方会话；phase_complete=false，完整目标active。[源证据](../analysis/game-battle-return-v1/source-check.json)、[规格](../analysis/game-battle-return-v1/implementation-spec.json)、[测试](../analysis/game-battle-return-v1/test-results.json)、[TCP](../analysis/game-battle-return-v1/network-validation.json)、[验收](../analysis/game-battle-return-v1/validation.json)、[目标审计](../analysis/game-battle-return-v1/goal-audit.json)。

<a id="stage188"></a>

## stage188：源退出清理、捕获与渐变到main9/1（原阶段继续）

**前检：** 上轮为有效进展；2776选定文件重核无不符，65候选文件修改前备份，无Git。读取项目目标/文档/材料、需求索引、Router分类/加载合同和REA/native指南；external experience,requirement-index/development/3000仍缺requirement-index，继续用项目内真源，未改外部知识库或工具规则。

**事实：** 固定cg_se_6000.exe，1,569,280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4，2115记录/27新增，8函数查询含6新规范入口、1旧入口查询及1次同新入口的内部地址重复解析，642→648，未重计。12段7055B核原件，其中6新read561B；518538004B快照私留build，最终open=false/cleanup_pending=false。502810的终止调用流模型限制保留，不能推成完整全程序可达性证明。

**实现：** 显式configureBattleExit后，普通入场分支0从7清mask/stop、遍历一次回调、清22指针并捕获实际已呈现的640×480战斗字节，同次落入8的退出12渐变。完成后标记自有battle池待删除、记录实际主状态9/1并准备send-004f67f0/$!~的一int32参数0。main9完整重建、440570原生普通池去投影及9250cc数值拥有者仍缺，pending不清、不能恢复playing。退出9和纵向14的真实控制拥有链尚未接；14数值/像素函数有独立参考。

原423660/434770中止扫描看原始大写三字节片段，名称中也能出现CHT/BST；已同时检查解析记录和真实剩余字节，在未实现副作用时先明确unavailable，mask/回调/指针均不变，安全余流才推进游标。手动清理上下文也先校验slowEffects，错误不能先改变状态。真实world的battle数据曾固定按main9处理，现按拥有者mainState路由，A确认标记在实际main10及时应用。

client持有完整呈现帧与固定退出捕获的私有副本；调用者改RGBA、裁剪显示不会改变源捕获。像素/最终请求取消后复用同一逻辑帧与发送Promise；重入/关闭清理旧捕获。**验证：** 7核心+11源TCP新增，共18新增/1599全量Node；四构建、82neutral+7App/Page=89通过，527输入/34产物身份一致、0external。105独立渐变步骤/50400可见行状态、32裁剪；源/生成各11新TCP，共22条/3326资源帧、24输入和16准确退出请求，1008次独立退出RGBA核对。双方各2次取消重试、1次重入、1次退出write故障和3次实际main10 ACK检查；只验证退出复制像素，非完整动作/战斗UI。

**待验证/下一步：** 完成main9的原生普通池去投影/数值、等待、重建、捕获与入场渐变，才可返回普通playing；继续退出9/type14控制、CHT/BST、完整SKL/其他15 handler/body/特效/输入/产品页面和其他玩法，以及微信gamePage/设备/现行/官方。无测试账号；本轮0 VM/CUA/原程序/账号/官方会话，phase_complete=false、整体active。[源证据](../analysis/game-battle-exit-v1/source-check.json)、[规格](../analysis/game-battle-exit-v1/implementation-spec.json)、[测试](../analysis/game-battle-exit-v1/test-results.json)、[TCP](../analysis/game-battle-exit-v1/network-validation.json)、[验收](../analysis/game-battle-exit-v1/validation.json)、[目标审计](../analysis/game-battle-exit-v1/goal-audit.json)。

<a id="stage187"></a>

## stage187：真实M5/6调度、身体结束及下一轮确认（原战斗阶段继续）

**前检：** stage186的2756选定文件重核无不符，62候选文件修改前备份，无Git。复核项目目标/文档/材料、需求索引和原180计划，复用REA/native指南。external experience,requirement-index/development/3000仍缺requirement-index，未改外部知识库/工具规则。

**事实：** 固定cg_se_6000.exe，1,569,280B、SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4，2088记录/14新增，5条函数查询含3新规范入口与2旧入口，639→642。6段10104B核原件，3映射复用保留记录。517000289B快照私留build，会话open=false/cleanup_pending=false。已有独立派生4365d0/4260b0复用，不冒充新规范函数。

**实现：** 显式configureBattleLoop后，entry5先回调/画面再从四槽取一条M；entry6只回调/画面，实际命令及身体结束才由管理器递增轮次并请求2。switch按调用开始的分支继续，回调改成2不在同一次6调用消费C；roundCounter同步到实际A接收拥有者，旧轮次确认不能串入下一轮。PNO真实66/63队列、动画和busy结束，以及ACT合并/并行、END、uint32回绕已核。没有注入phase、body-ready或伪句柄；其他15 handler及未移植body保持明确unavailable。

**验证：** 7核心+9源TCP新增，共16新增/1581全量Node；8独立场景33调度步骤。四构建、70neutral+7App/Page=77通过；三App各136输入/11产物、API111输入，519输入和34产物身份一致，0external。源/生成API各9新OS TCP，共18条、30准确G请求、2518实际资源帧；1120入场像素比较复用旧独立参考，没有新增动作UI像素验收。双方各一次M像素取消重试，clock/回调/出队不重放；旧M任务由重入/关闭取消共4次。原180计划同步当前进展，原始完整要求保持。

**待验证/下一步：** 已追出7→8的战斗画面捕获/退出渐变、501a10(9,1)、4f67f0(0)及main9的501a50消费者；当前没有实现退出，7仍明确拒绝，不能直接改成playing。继续完成SKL及其余命令/body、退出与普通场景重建、完整菜单/命中/音频和网页/触屏/微信gamePage，以及其他玩法、设备/现行/官方验收。无测试账号；本轮0 VM/CUA/原程序/账号/官方会话，phase_complete=false、整体active。[源证据](../analysis/game-battle-loop-v1/source-check.json)、[规格](../analysis/game-battle-loop-v1/implementation-spec.json)、[测试](../analysis/game-battle-loop-v1/test-results.json)、[TCP](../analysis/game-battle-loop-v1/network-validation.json)、[验收](../analysis/game-battle-loop-v1/validation.json)、[目标审计](../analysis/game-battle-loop-v1/goal-audit.json)。

<a id="stage186"></a>

## stage186：基础输入、源请求与菜单时序已到client（原战斗阶段继续）

**前检：** 上轮是有效进展；2735选定文件重核无不符，58候选文件修改前备份，无Git。实际读AGENTS目标/文档/材料、需求索引和185计划、Router分类/加载合同及REA v42/native指南。external experience,requirement-index/development/3000仍缺requirement-index；项目内索引有效，未改外部登记或工具规则。

**事实与证据：** 固定cg_se_6000.exe，1,569,280B、SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4。2074记录/159新增，其中23条函数记录包含20新规范入口与3旧入口查询，619→639；不把重复规范入口重计。另用项目内原创Java脚本，在独立临时Ghidra工程中定义13个已有代码指针入口，取得派生静态分析；13入口4446指令字节均核原件。45段17405B与原件相符，新read记录15450B；506614267B快照私留build，最终open=false/cleanup_pending=false。中断关闭了REA会话，已核实状态、导入1945记录并重取三项未落盘结果，没有重放VM/WER。

**已实现：** phase4基础输入拥有源菜单速度/偏移与关闭状态、主/次行动计数和30000ms期限。实际P/C/A提供local/control、目标数值及actor flags；436fa0/436f50清理和累计确认标记，A重复只累加。4374e0/437080的目标资格、单体/交叉/阵营/全体编码有独立参考；攻击和G/P/E直接命令经原send-004f88f0/$T5路径发送，N/W|FF超时请求按源条件产生。完整技能/道具/宠物/坐骑/观察输入仍缺。**推导：** C values[0]对应源0x170数值；正的已解析首链接由422d60创建13b4子对象，该完整拥有链未恢复时明确unavailable，不注入句柄。

client在源逻辑步后将请求排队并与资源画面任务共同结算；暂停取消保留同一frame和同一发送Promise，重试不重读clock、不重放状态或发送。新一代入场拒绝旧输入意图。写入失败先关闭拥有链时，任务仍保留failed原因，不误记成cancelled。只有源菜单关闭和计数满足才请求phase5；M仍未消费，之后明确未支持。

**验证：** 6核心+13源TCP新增，共19新增/1565全量Node、19焦点、四构建与60neutral+7App/Page=67通过。240目标掩码/180编码、10独立场景392步骤/18预期请求；源/生成API各13新OS TCP，共26条、42条准确输入请求、2610实际资源帧，其中1568入场帧复用旧独立RGBA参考，输入UI像素并未验收。双方各一次发送后取消/像素重试及一次显式原创wx.write失败；失败注入不计作已送达输入。三App135输入/11产物、API110输入；515输入及34产物身份一致、0external。中立夹具曾直接比较不同Realm数组，现用host Array.from严格比较字节/数值。首次中立失败完整日志被同名复跑覆盖，原失败回执及后续验证日志在；源写失败日志保留。没有新产品UI、浏览器流程或图片。

**仍未完成：** 完整phase4窗口/菜单/音频/命中与产品鼠标触屏输入、技能/道具/宠物/坐骑/观察，M5/6与其余15 handler/ESC2/209，退出7/8/9及地图返回，全body/特效/缩放/混色/捕获，完整其他玩法、全应用RNG/普通对象池及网页/微信gamePage/设备/现行/官方兼容。无测试账号，本轮0 VM/CUA/原程序/账号/官方会话。整体active、原战斗阶段与186均phase_complete=false。

下一步沿437b30的5/6真实M调度和退出消费者闭合主循环，并继续恢复缺失菜单、资源与产品输入，不用基础接口代替完整战斗。[源证据](../analysis/game-battle-input-v1/source-check.json)、[规格](../analysis/game-battle-input-v1/implementation-spec.json)、[测试](../analysis/game-battle-input-v1/test-results.json)、[TCP](../analysis/game-battle-input-v1/network-validation.json)、[验收](../analysis/game-battle-input-v1/validation.json)、[目标审计](../analysis/game-battle-input-v1/goal-audit.json)。

<a id="stage185"></a>

## stage185：源入场渐变、自动C及到位推进已到client（原战斗阶段进行中）

**前检与需求：** stage184是有效进展；2714选定文件重核无不符，54候选文件修改前备份，无Git。实际读项目AGENTS的目标/文档/材料、需求索引及184计划，复用已读Router分类/加载/风险合同与REA v42/native指南；外部experience,requirement-index/development/3000仍缺requirement-index登记，未改外部库或工具规则。完整main10/动作/图像/输入/退出及各平台要求保留。

**事实与源证据：** 固定cg_se_6000.exe，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`、1,569,280B；REA6.7.0/Ghidra12.1.4。52新记录（6新规范函数、14读取、32映射），613→619；复用19完整dossier。当前20段10668B与原件相符，其中新read记录7062B；5项float常量独立核对。**推导：** 46c6b0表基址c101bc、84字节步长映射编号32至c10c3c，4378d0检查的是已有入场窗口；新接口据此命名entryWindowPresent，完整窗口生命周期未恢复。1915记录、498783001B快照私留build，open=false、cleanup_pending=false。

**已实现：** 505030(13,8,float2)→503330 case6的480行交替位移、速度/偏移初始化及row0归零完成条件；44ce40的实际行裁切复制。entry拥有main10部分0/1、2、3、4状态：0标记旧battle池删除/清全局槽并捕获背景；1真正渐变完成才到2；2先回调/排序/提交画面，再消费至多一条C，C end请求7，否则源转向后到3；3先绘图，再对前20槽请求下一次state2运动，到位后建立30000ms选择期限并到4；4诚实等待未实现输入，不越过它消费M。P中的local/control来自真实接收，转向使用源entry-target及mode1。弹窗依赖缺失时明确unavailable，没有假造句柄或完成位。

client.configureBattleEntry/advanceBattleEntry绑定实际world、资源和私有640×480捕获；输出按客户端尺寸裁切。C创建在当帧图后生效，入场运动在下一回调才执行。取消未完IO会保留已算的frame供像素重试，不重读clock、不重放渐变/回调或C；旧ordinary读未结束先报忙，reentry取消旧job并清私有捕获。完整普通对象池/窗口/音频、输入/M5/6与退出7/8/9仍未恢复。

**验证与纠正：** 8核心+11源TCP新增，共19新增/1546全量Node通过。独立address-based Python参考核54次渐变/25920行速度与偏移、16裁切、12场景805步/804完整像素帧，含C延迟、到位、转向、状态/死亡、额外槽、弹窗缺失、C end/U、四环回绕与uint32期限回绕。源/中立生成API各11新实际OS TCP，共22条/1390像素帧；正常五请求、C自动处理/M未消费、暂停捕获与C后像素重试、提前关闭/读失败、reentry与旧ordinary交接通过。四构建，46neutral+7App/Page=53；三App134输入11产物、API109输入，511输入及34产物身份核验、0external。夹具曾在read-fail关闭前只等对端发送，导致未读end时RST；现等待实际接收写游标变化后关闭，EOF继续严格核对。reentry包数修正为11，失败日志保留。未改UI，无新浏览器流程/图片，旧180证据不重计。

**仍未完成：** 原战斗阶段和185均phase_complete=false，整体active。弹窗/观察/选择/音频/UI、完整native main10、真实输入、M5/6及退出/地图返回、其余15 M handler、ESC2/209、完整body/坐骑/影子/变形/特效、缩放/混色及全捕获表面交互、全应用RNG/普通对象池语义、实际网页/微信gamePage/设备、其他完整玩法与现行/官方兼容未完成。无测试账号，本轮0 VM/CUA/原程序/账号/官方会话，旧WER不重放。

下一步沿48b810及其实际窗口/选择消费者补齐输入边界，再闭合M与退出；把已验证入场像素接产品页面前继续保留完整UI/异常恢复要求。[源证据](../analysis/game-battle-entry-v1/source-check.json)、[规格](../analysis/game-battle-entry-v1/implementation-spec.json)、[测试](../analysis/game-battle-entry-v1/test-results.json)、[TCP](../analysis/game-battle-entry-v1/network-validation.json)、[验收](../analysis/game-battle-entry-v1/validation.json)、[目标审计](../analysis/game-battle-entry-v1/goal-audit.json)。

<a id="stage184"></a>

## stage184：源对象排序与基础战斗资源像素已接入（原战斗阶段进行中）

**前检与需求：** 上轮为有效进展；stage183的2696个选定文件重核无不符，50候选修改前备份，无Git。实际读项目AGENTS目标/文档/材料、项目需求索引与阶段计划、Router分类/加载/风险合同、REA v42及native指南；外部experience,requirement-index/development/3000查询仍缺requirement-index，项目内索引有效，未改外部库/全局工具规则。原完整main10/动作/图像/输入/退出要求保留。

**事实与源证据：** cg_se_6000.exe固定SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`、1,569,280B，REA6.7.0/Ghidra12.1.4。33新记录含8函数查询（7新规范入口、1次已知447330复查）、9读取和16映射，606→613；复用20完整dossier。8段4014B原件一致，旧派生4198d0的96指令B重新核原件，不算新增规范函数。614390的4B是分析内存零填充，无原文件映射，不能当运行时清屏色。1863记录、495576734B快照私留build，open=false、cleanup_pending=false。

**已实现：** 419930先收0x20000对象、用源pointer qsort按屏幕Y/替代Y和signed16字段270排序，再写byte(rank+9)；270在当前对象构造时为0，并非角色槽号。506e80的renderer/deleted/hidden过滤、原池中脱槽body、四拍延迟删除、坐标及五类子对象的bit4调色板覆盖保留。背景按真实resource在320,240投影，基本frame把其作为priority5复制记录，保留source的4093对象绘图预算；原priority6捕获/20鼠标记录只说明来源，不假装已实现。client.configureBattleFrames借本身library，renderBattleFrame生成真正drawPlan并读取RD/CGP像素；暂停/关闭取消任务，恢复早于读取完成也不把已取消任务当致命错误。绘制不推进队列、动画或任何完成位。

**验证与纠正：** 8核心+5源TCP新增，13新增/1527全量Node通过；20核心组合含12旧body回归。36个独立排序案例含4096同键、signed270/替代Y、8/9分界、256回绕；20轨迹1994帧中1835完整RGBA相符，159帧按证据范围显式拒绝缩放/混色。源/中立生成API各5条实际OS TCP，共10条/422渲染帧/420回调，核正常五请求、资源拥有链、脱槽、暂停先取消再恢复、提前关闭和读失败。四新构建、34neutral+7App/Page=41通过；三App各132输入11产物、API107输入，503次输入身份与34产物身份一致、0external。修正了排序第二键/背景优先级误读、已知447330计数，以及测试缺少显式session适配器、继承320×240普通场景视口的问题；TCP改用显式源640×480视口，失败日志保留。未改UI，无新浏览器流程/截图，旧stage180证据不重计。

**仍未完成：** 原stage180/181/182/183/184均phase_complete=false，整体active。自动main10入场/渐变/C/M、C选择4235f0/423500、其余15 M handler、ESC2/209、完整body/坐骑/影子/变形/特效、原缩放/混色后端及捕获表面生命周期、产品战斗画面/输入/退出返回、全应用RNG仍缺。其他完整玩法、微信原生gamePage/DevTools/设备、现行/官方兼容未验收，无测试账号；本轮0 VM/CUA/原程序/账号/官方会话，旧WER不重放。

下一步在已有真实资源像素链上继续闭合437b30的入场/渐变及C自动调度，再接实际战斗输入、M与退出返回，不用显式frame端口替代完整战斗。[源证据](../analysis/game-battle-scene-v1/source-check.json)、[规格](../analysis/game-battle-scene-v1/implementation-spec.json)、[测试](../analysis/game-battle-scene-v1/test-results.json)、[TCP](../analysis/game-battle-scene-v1/network-validation.json)、[验收](../analysis/game-battle-scene-v1/validation.json)、[目标审计](../analysis/game-battle-scene-v1/goal-audit.json)。

<a id="stage183"></a>

## stage183：body动作消费与资源绑定已接入（原战斗阶段进行中）

**前检与需求：** stage182为有效进展，2673个选定文件重新核对无不符；41候选修改前备份，无Git。实际读取项目AGENTS的目标/文档/材料、需求索引、Router分类/加载/风险合同、REA v42及native指南，复用585规范函数和原派生回调。外部experience,requirement-index/development/3000查询仍缺requirement-index登记；项目内索引有效，未改外部库或工具审批规则。原stage180/181/182的main10、完整动作/渲染/输入/退出要求完整保留。

**事实与源证据：** 固定cg_se_6000.exe，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`、1,569,280B，REA6.7.0/Ghidra12.1.4。本轮74新记录：22函数查询中21新规范入口、1次已知466820复查，另17读取、34映射和1次包含函数查询；585→606。复用30完整dossier，17段67476B（含整个62225B body范围）及360项sin/旧65项方向表与原PE相符。默认未识别的4204c0由420570写入的指针定位，在独立Ghidra副本播种导出169指令B并逐字节核原件；不计规范REA函数，也未修全局provider。旧四个派生体55491指令B重核。1830记录、489276177B快照私留build；open=false、cleanup_pending=false。

**已实现：** 动画目录/geometry为真实拥有的资源，C构造动画→强制队列初始化→目标/死亡分支→末尾额外mode0调用已绑定。源查表运动、距离截断、显式CRT视觉随机数和23个基础body type分支、message/puff/status/death/indicator五类子回调已接入；208仍停到未实现209。源priority/FIFO、同次遍历新对象、四拍执行/删除、type49仅解除全局槽、type231后续调用才清busy、55只重置帧/延迟、244先置stop再由下一次manager请求7均保留。新增ACT调用420750。client.configureBattlePlayback从自己library借目录/geometry，advanceBattleCallbacks驱动manager→命令→body，依赖实际状态完成；没有动画-ready注入或自动假完成。

**验证与纠正：** 12核心+7源TCP新增，19新增/1514全量Node通过。20组1994步独立Python轨迹覆盖所列23类分支、48角度/朝向、20查表运动、1024 CRT值、C死亡与收尾、插入/四拍删除、脱槽、busy/轮次/停止顺序。七条源客户端和七条中立生成API实际OS TCP，共14条/1238次回调，实际资源读各9次，正常五请求/暂停不推进/关闭均核验。四新构建、28neutral+7App/Page=35通过；三App各131输入11产物、API106输入，499次输入身份和34产物身份一致，0external。本轮修正了C末尾额外动画调用、420010未舍入x87高度参与后续运算、C删除预标子对象；已知466820复查单列，不计新函数。无UI改动或新浏览器验收，stage180旧两流程6图不重计。

**仍未完成：** stage180/181/182/183均phase_complete=false、整体active。main10入场/渐变/自动C及资源调度、其余15个M opcode、ESC2/209和完整body/变形/坐骑/影子/特效、C选择位4235f0/423500、战斗画面/输入/退出返回未闭合；其他完整玩法、原生微信gamePage/DevTools/设备、现行/官方兼容未完成，无测试账号。视觉seed、quarter和renderer上下文仍显式提供，全应用RNG、任意x87位一致和原生堆地址语义未声称恢复。0 VM/CUA/原游戏程序/官方会话，旧WER不重放。

下一步沿437b30与419930/渲染提交的真实数据流继续闭合战斗main10及画面，再接输入、退出和余下动作，不以显式回调端口替代完整游戏。[源证据](../analysis/game-battle-body-v1/source-check.json)、[规格](../analysis/game-battle-body-v1/implementation-spec.json)、[测试](../analysis/game-battle-body-v1/test-results.json)、[TCP](../analysis/game-battle-body-v1/network-validation.json)、[验收](../analysis/game-battle-body-v1/validation.json)、[目标审计](../analysis/game-battle-body-v1/goal-audit.json)。

<a id="stage182"></a>

## stage182：继续原战斗阶段的调度和队列执行切面（进行中）

**前检与需求：** 已核对stage181的2653个选定文件，0不符，37个候选文件修改前备份；无Git。已读AGENTS目标/文档/材料、项目需求索引、Router模式/主域/风险/加载合同与REA v42 native指南，复用既有575规范函数与派生回调。TalonBrain的experience,requirement-index/development/3000查询仍缺requirement-index登记；项目需求索引可用，未写外部知识库或规则。既有VM/WER不重放。

**事实：** 固定cg_se_6000.exe，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`、1,569,280B；REA6.7.0/Ghidra12.1.4。新增27记录（11次函数查询、11个地址映射、5段读取），其中10个新规范入口、1次434820→已知4347e0复查，另434a10归一到新4349e0。规范函数575→585，复用25完整dossier。5段1109B、缓存方向表520B及旧派生4体55491指令字节重核原件一致；没有新增派生导出。1756记录和482967273B快照留build，会话open=false、cleanup_pending=false。

**已实现：** C记录为22槽创建/更新自有body位置与死亡位；新角色在构造后强制重置队列，再施加死亡位，target分支同步朝向，之后C更新保留队列及之前死亡状态的entry/target行为；有源动作/tuple/value队列及199条+sentinel边界、reset/append/activate/pop与434b90等待/7201恢复。M在显式main10/substate5上下文下成功解码后才消费一格，返回请求6。4365d0的32槽、字节预约、部分冲突写、同principal或CHT/BST合并、group×22延迟和436930切换/释放已移植为调用级状态。七类有源动作队列分支和END等待已接入；未实现handler明确unavailable，不伪造body执行或busy归零。END请求7与耗尽后请求2/round uint32回绕分开。实际world有copy/consume/manager/command端口，真实client继续battle-pending。

**验证：** 18条新核心测试与3条新源TCP测试，新增21/全量1495通过。12组原创队列向量及32槽bit31、合并/冲突游标、22延迟、回收/旧handle、199边界、7200/7201、C死亡历史、END/EOF及尾标点游标均有核验。三条源模块和三条生成API的实际本地OS TCP通过；四新构建、21neutral+7App/Page=28通过，487次构建输入身份和34个产物身份核验。无新UI或浏览器验收，stage180两流程/6图仅保留历史。

**原战斗阶段、stage181及stage182均仍phase_complete=false，整体active。** main10自动调度/入场渐变/C真实循环、剩余16个M handler及244个外层body case中的完整动作/运动/动画/特效、战斗渲染/输入和退出返回尚未闭合；其他完整玩法、微信原生gamePage/开发者工具/设备、现行/官方兼容未完成，没有测试账号。0 VM/CUA/原程序/官方会话。本轮不提交、推送或发布。

下一步继续沿4260b0→40a120实际动作消费，优先闭合基础队列对应的运动/动画完成条件，再接main10真实调度及battle资源/画面、输入与退出，不以本轮调用端口替代游戏运行。[源证据](../analysis/game-battle-commands-v1/source-check.json)、[规格](../analysis/game-battle-commands-v1/implementation-spec.json)、[验收](../analysis/game-battle-commands-v1/validation.json)、[目标审计](../analysis/game-battle-commands-v1/goal-audit.json)。

<a id="stage181"></a>

## stage181：继续原战斗阶段的M链（进行中）

**前检与需求：** 复核stage180的2630文件无不符，31候选修改前备份，无Git。已读AGENTS目标/文档/材料、需求索引、Router分类/加载/风险合同与REA原生指南；experience,requirement-index/development/3000外部登记仍缺角色，不改知识库。原phase180完整主循环/执行/图像/输入/退出要求不缩小。

**事实与实现：** 固定旧样本SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`、1,569,280B，REA6.7.0/Ghidra12.1.4。新增48记录/24规范函数，551→575，复用18份旧dossier；9段1944B与原件相符。1729记录/478576202B快照留build，open=false、cleanup_pending=false。 M的24类token、字段消费、22槽字节计数/掩码、principal及groupAdvance、SKL类别/状态分支、55条顺序别名与可选RID前看已独立实现。新增共享字节/字段读取器保留C原行为；显式world.copyBattleMotionPlan返回自有预处理结果，不消费环、不运行main10或动作回调。32个原生对象槽是并发容量，4095B包内1023条短命令已验证。 默认未识别的4365d0/4260b0/4198d0在独立分析副本补建入口，导出682/54685/96B；另435000仍报告28B。四体55491指令字节全部等于原件，属于分析者播种的派生边界，不计入24个规范REA函数。435000另以461B原始范围和LLVM21核对所有非调用分支闭合，未宣称修好provider边界。

**核验：** 11项新增/1474项全量Node通过；582条原创独立用例覆盖24token、131个SKL类别和55别名，另验RID回退、原始槽区别、字节计数回绕与1023命令边界。源模块/中立生成API各2条实际OS TCP，共4新路径，核正常五请求、M字段/名字/依赖一致、环未消费及关闭。18neutral/7生成检查和四构建通过；三App各126输入11输出，API101输入，0external。

**纠错：** standalone首启未找到系统登记Java，按进程JAVA_HOME复用现有JDK21.0.13；没有安装/改全局。新测试语法与虚构导出名已修；GMN第二槽不额外计数、RID前看不用50/51映射已复核。初版512上限在源预算复核中移除并重跑全套/构建。失败记录保留。

[源证据](../analysis/game-battle-runtime-v1/source-check.json)、[规格](../analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](../analysis/game-battle-runtime-v1/test-results.json)、[TCP](../analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](../analysis/game-battle-runtime-v1/validation.json)、[完整目标](../analysis/game-battle-runtime-v1/goal-audit.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：实际战斗消费者、接收与角色记录（进行中）

**需求与前检：** 原始四步目标与网页/移动网页/微信范围不变。开发前已定位[需求索引](requirements-index.md)与本阶段计划，复核stage179的2607文件无不符，25候选修改前备份，无Git。实际读取项目规则的目标/文档/材料章节、Router分类/加载合同与REA原生指南；外部experience,requirement-index/development/3000查询仍缺登记角色，不改知识库。

**事实与实现：** 固定37c4样本SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`、1,569,280B，REA6.7.0/Ghidra12.1.4。复用18份旧dossier，新增56记录/28规范函数，523→551；8段5946B与原PE逐字节相符。1681记录/451623812B快照留build；会话已关闭，open=false、cleanup_pending=false。 真正的战斗分派为main10→437b30，不是普通场景main9的250..252。现已把>HY/4f3430普通入场、?+e/4f36d0的C/P/A/M/U分支、两个四槽环、P/A部分字段保留和显式C角色记录消费接入共享核心与world。真实客户端收到入场后关闭旧地图runtime、保持session接收，网页/移动网页隐藏旧地图、禁用普通操作并显示“已收到战斗数据，战斗画面尚不可用，连接保持”。

**核验与局限：** 17项新增/1463项全量Node通过。原创独立240条C消息/820记录/7数字边界与22槽源表核对；源模块与中立生成API各2条实际OS TCP，共4条，验证正常五请求、实际入场/队列/显式消费/回绕与关闭，没有战斗图像或动作执行验收。16neutral/7生成检查、四构建通过；三App各123输入11输出，API98输入，均0external。 Chrome156.0.8078.80/Playwright1.64.1实测桌面1100×850和触屏390×844两条game.html流程，真实Files/正常人物升级选择/入场/持续收包/断开通过，6张原尺寸截图全部复核，0应用错误、警告、外部请求和横向溢出。Browser插件缺席，复用现有Playwright。stage179的15浏览器流程证据保留，本轮未重跑，不能合计为本轮17条。 40a120回调62,225B已保留完整伪代码/汇编，但native value flow截断；M管理回调4365d0未被Ghidra识别为函数，1808B原字节及LLVM21静态COFF逐指令核验不构成完整CFG。P/A初始零来自PE .data零填充推导，不是运行时观测。原生越界copy/指针不复现，安全profile限制C/M最多4095B；完整C身体/特效副作用未声称实现。

[源证据](../analysis/game-battle-transition-v1/source-check.json)、[规格](../analysis/game-battle-transition-v1/implementation-spec.json)、[测试](../analysis/game-battle-transition-v1/test-results.json)、[TCP](../analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](../analysis/game-battle-transition-v1/validation.json)、[完整目标](../analysis/game-battle-transition-v1/goal-audit.json)。

**下一步与原要求保留：** **阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：源aux04与组队请求、回复、离队确认

**需求与前检：** 沿完整REA登录器→实现→REA游戏→实现目标继续，先验stage178的2582文件，无不符。28候选备份、无Git；需求计划/合同先于产品。实际读取当前项目规则、Router加载合同和REA技能，继续前端验证技能。外部experience,requirement-index/development/3000查询缺角色，在项目内建立[需求索引](requirements-index.md)，未修改或宣称修复外部登记。

**事实与实现：** 固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4。复用28份dossier，新增14记录/1规范函数43f2d0，522→523；4段1031B与原PE逐字节相符，复用32B方向表另以PE头核对。614884位于.data零填充尾部，初始化零是推导，非原文件字节或运行时观测。1625记录/387120057B快照留build；会话已关闭、cleanup_pending=false。 实际人物aux04队长/模式图标按源规则创建、重建、移除和推进：创建当帧无动画/绘制，保留帧用当前偏移/原点与人物高度，NULL样式固定palette0/flags0/白色。共享核心拥有并回收子图像。网页/移动网页新增加入/离开按钮；*Cc发本机display及1/0，Kk0仅按真实回复改源状态，HFs到达才显示已加入；离队成功自动经真实session队列发送/Re，使用target及朝向低字节符号扩展。

**验收与纠错：** 18新增/1446全量Node通过。独立Python覆盖960图标、5376命令、3009锚点及128完整场景/65种RGBA SHA。源模块和中立生成API各2条实际原创OS TCP，共4新路径/256帧，并核对延迟回复、精确出站字节和关闭。14neutral/7生成检查、四构建通过；三App各121输入11输出，API96输入，均0external。 Chrome156.0.8078.80/Playwright1.64.1共15桌面/触屏流程通过，75张截图经7联系表与新原尺寸图复核。实际game.html/Files/正常人物流程/按钮/暂停/关闭验证；0应用错误、警告或外部请求，4条QA Canvas读回提示单列。Browser插件缺席，使用现有Playwright；无浏览器安全覆盖。 旧测试仅父helper计数及未实现标记已按新源切面更新；独立参考补原resource1整根过滤；TCP显式传真实适配器。网页脚本人物选项与peer对齐；产品收到HFs后的等待提示已纠正。失败日志保留。

[源证据](../analysis/game-party-actions-v1/source-check.json)、[规格](../analysis/game-party-actions-v1/implementation-spec.json)、[测试](../analysis/game-party-actions-v1/test-results.json)、[TCP](../analysis/game-party-actions-v1/network-validation.json)、[验收](../analysis/game-party-actions-v1/validation.json)、[完整目标](../analysis/game-party-actions-v1/goal-audit.json)。

**下一步：** 完整队伍控制/其他快捷键/modal、战斗/宠物/特效/复合转场、其余纠偏/输入/reset/生产启动/资源/玩法、微信原生gamePage和设备、现行及官方兼容仍未完成。无真实测试账号。完整目标active，本轮无VM/CUA/WER/CDB/原程序/账号/官方操作；stage131已执行恢复的诊断不重放。


<a id="stage178"></a>

## stage178：源队伍输入、跟随与成员移除坐标传递

**需求与前检：** 沿原REA登录器→实现→REA游戏→实现完整目标继续；stage177的2559文件/114039450B清单相符。25候选修改前备份，无Git。沿已读项目目标/文档要求、Router合同及experience,requirement-index/development/3000缺需求索引记录，本地阶段计划/合同先于产品，不改外部规则。

**事实与实现：** 固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4；本阶段31新记录、13个函数查询，其中12新规范函数、1次已知461370查询（完整已缓存facet相符），510→522；23旧dossier复用。3段1193B及6端点映射与原件相符。1611记录/386815720B快照留build，会话已关闭并复核open=false、cleanup_pending=false。 实际HFs/进入初始化的队伍mode与本机primary标志已驱动pointer、localMovement、world/runtime和client；队长普通寻路向第一队员送旧显示格，队员按紧凑有效槽位队列依次跟随。移除成员按461f40的slot0队列/对齐/前驱距离门限级联旧target；会员200位抑制普通人物重复步进。

**验收与纠错：** 16项新增、1428项全量Node通过；160距离用例、11个队列长度/速率、16分支组合及3场景224帧完整图像/195种RGBA SHA通过。源模块与实际中立API各3条原创OS TCP，共6条/448帧，独立peer核对队长两条源移动命令、队员零自主命令和关闭归属。12neutral/7生成检查通过；三App各120输入11输出、API95输入，均0external。 13个Chrome156.0.8078.80桌面/触屏流程通过；新2条实际game.html路径含正常选人/升级、实际Files、队员点击禁自主路径、收到解散、暂停/继续/关闭。65张唯一截图经6联系表复核，新桌面/手机跟随图另读原尺寸；0应用错误/警告/外部请求，4条旧QA Canvas读回提示单列。 参考初稿的未接收remote速度已修正；解散后的旧插值须先完成；全量八条旧调用方的启动标志不再覆盖已收源状态，另有专门回归。已知函数复查未计作新规范函数。

[源证据](../analysis/game-party-follow-v1/source-check.json)、[合同](../analysis/game-party-follow-v1/implementation-spec.json)、[测试](../analysis/game-party-follow-v1/test-results.json)、[网络](../analysis/game-party-follow-v1/network-validation.json)、[验收](../analysis/game-party-follow-v1/validation.json)、[完整目标](../analysis/game-party-follow-v1/goal-audit.json)。

**下一步：** 完整队伍UI/加入离开响应、aux04队长/模式图标、战斗/宠物影子/活跃复合转场、其他文字/UI与完整纠偏/输入/reset/生产启动/玩法、微信原生gamePage及设备、现行和官方兼容仍未完成；原生x87与非法重复身体/空指针行为未复现。完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage177"></a>

## stage177：状态值条、远端值写入与五槽记录

**需求与前检：** 继续REA登录器→实现→REA游戏→完整跨平台游戏。2531旧清单匹配，27候选修改前备份，无Git。已读项目目标/文档要求、Router加载合同、开发计划stage176和REA原生指南；experience,requirement-index/development/3000仍缺需求索引，本阶段计划/合同先于产品实现，不改外部规则。

**事实与实现：** 固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4；30条新记录、11个新规范函数，499→510，23份旧dossier复用；3段1583B及6端点映射与原件相符。1580记录/378372484B快照留build，session已关闭并复查open=false、cleanup_pending=false。 普通人物状态值条已进入actor/world/scene/resource与网页开关：本机E(9前四槽、远端]_g最多五组四值、源32位SHL/IDIV及16位宽、零分母跳过、资源原点裁剪、中性调色板4和priority207均有来源。HFs五槽掩码记录、成员/队长标志及普通解绑/解散已接；这仍不等于完整队伍玩法。

**验收：** 25项新增、1412项全量Node通过；198个独立整数用例、120帧完整图像/107种SHA、12帧预解码/延迟资源相符。1001人物/3003值条全局图像与文字共用4096槽（文字存在时4095图像）的边界已验。6条实际原创TCP核460帧、每条5次既定客户端请求；9neutral/7生成检查通过。三App119输入11输出、API94输入、0external。 11个Chrome156.0.8078.80桌面/触屏流程通过，61张最终唯一截图以6张联系表及2张原尺寸复查；0应用错误/警告/外部请求，4条QA读Canvas性能提示单列。按钮实际改变状态条显示，原有中文标签、暂停、换场景与关闭继续通过。

**纠错：** 独立参考初稿沿用普通调色板，与source flag4中性表不同，现已改参考。TCP/浏览器原创夹具命名替换、7个失败临时夹具清理及重复/离屏条值独立覆盖均已完成，失败证据留build。

[源证据](../analysis/game-actor-vitals-v1/source-check.json)、[合同](../analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](../analysis/game-actor-vitals-v1/test-results.json)、[网络](../analysis/game-actor-vitals-v1/network-validation.json)、[验收](../analysis/game-actor-vitals-v1/validation.json)、[完整目标](../analysis/game-actor-vitals-v1/goal-audit.json)。

**下一步：** 队伍跟随/本机输入上下文同步、aux04队长/模式图标、宠物影子及战斗条源、其他文字/UI、完整纠偏/输入/reset/生产启动与玩法、微信原生gamePage/设备、现行与官方兼容仍未完成。HFs已存状态尚未动态桥接f5f170/f536b2到现有显式输入上下文；完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage176"></a>

## stage176：普通姓名、选中标签与字形端口

**需求与前检：** 继续REA登录器→独立实现→REA游戏→完整跨平台目标。2500旧清单全部匹配；30初始加2补充候选共32份编辑前备份，无Git。项目目标/文档要求、Router加载合同和本计划stage175已读；requirement-index仍缺，以本阶段计划/源合同先于产品修改，不改外部规则。

**事实与实现：** 固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4：32新记录含12函数查询（11新规范入口、已知505840单列），15份旧dossier复用；规范目录488→499，1550记录及364943731B快照留build，session已关闭。3段1163B和6端点映射与原件相符，其中534598的8字节读取复用旧记录。 普通人物姓名与选中标签已进入实际actor/world/client/scene/resource链：六档显示、源字节宽度居中、font1/lane0、priority210、插入顺序/黑影、48行Hr]与E(9字段28均有静态来源。局部全局label2/3跨身体重建保留；重复根和resource1过滤不吞已排队文字，离屏/门控及state1/2/3跳过普通名字。

**验收：** 32项新增、1387项全量Node通过；187宽度、2304标签选择、24文字合成，共2515个独立例（含预期拒绝），120帧完整场景/96种SHA、12帧预解码/延迟精灵相符。6条实际原创TCP核460帧，标签循环不增加5次既定客户端请求；8neutral/7生成检查通过。三App118输入11输出、API93输入、0external。 11个Chrome156.0.8078.80桌面/触屏流程通过，37张唯一最终截图已查，0应用错误/警告/外部请求；4条QA读Canvas性能提示单列。网页新增显式ASCII/Windows936选择和实际标签切换按钮；宿主字体为可替代端口，未证明Windows原生GDI字形像素或线路默认编码。

**纠错：** 原创C0包少外层转义、resource0初值/resource1静态物件查找及骑乘AP完成时点等测试前提已纠正；产品字段语法未迎合夹具改写。已知505840重查和8字节复用各自单列，非12个新函数或3次新字节读取。源表按24字节font结构与3字节RGB核对。

[源证据](../analysis/game-actor-text-v1/source-check.json)、[合同](../analysis/game-actor-text-v1/implementation-spec.json)、[验收](../analysis/game-actor-text-v1/validation.json)、[测试](../analysis/game-actor-text-v1/test-results.json)、[网络](../analysis/game-actor-text-v1/network-validation.json)、[完整目标](../analysis/game-actor-text-v1/goal-audit.json)。

**下一步：** HP/队伍、其他文字通道/聊天/头顶气泡/aux04/菜单、完整本机纠偏/输入/reset/生产启动与中文语义、战斗及其余玩法、微信原生gamePage/设备、现行消费者和官方兼容仍未完成；整体goal active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage175"></a>

## stage175：状态字来源、普通图标及源门控

**需求与前检：** 延续REA登录器→独立实现→REA游戏→完整网页/移动网页/微信目标。stage174清单2475项匹配，28候选修改前备份，无Git。已读本计划stage174、状态上下文、REA原生与前端测试技能；知识库仍缺requirement-index，本阶段[需求计划](../analysis/game-actor-presentation-v1/implementation-plan.json)和合同先于产品代码，不改外部规则。

**事实与实现：** 固定旧版37c4（1,569,280B），REA6.7.0/Ghidra12.1.4；50条新记录，37次函数查询中36个新规范入口、1个已知45f2f0（伪码与指令相同），规范目录452→488；35份旧dossier复用，2446B原字节及8映射一致，1518记录与358988573B快照留build，session已关闭。 已将真实45..49/63/64/99和远端40/41/42/44的状态字写入接入actor/world/frame；primary、transient、side图标按前帧偏移、人物高度、资源覆盖顺序、声音、601回调计时及type1队列绘制。源99的raw80门控同步实际指针/移动/镜头/回调；状态全局字与人物31c时长分开，重建时仅时长和自有子对象归零。

**纠错与验收：** 27项新增、1355项全量Node通过；546组控制、1540组图标选择/拒绝、1003组高度/旧偏移，共3089个独立例。720帧完整场景/224种SHA、12帧预解码/延迟精灵像素对比、6条实际原创TCP的1660帧一致；7neutral/7生成工程通过。四份新构建App116输入/11输出、API91输入，均0external，原生game Page仍未实现。 11个Chrome156.0.8078.80桌面/触屏流程通过，32张最终唯一截图已查看，0应用错误/警告/外部请求。4条性能提示来自QA反复读取Canvas，单列保留。浏览器只验证实时状态/遮挡/门控/暂停/场景/关闭；601次回调的精确超时由核心/TCP/neutral证明。 复核修正旧测试的mode100粘滞预期、参考模型漏掉本机C0的40位、人物时长所有权；已在最终全量和构建后验证。浏览器等待601回调遇开发桥既有10秒idle关闭，改为有限实时检查而不改桥；截图初稿7处跨mode重名已改并重跑。函数重复查询1次如实单列，未冒充第37个新函数。所有失败/初稿留build。 [源证据](../analysis/game-actor-presentation-v1/source-check.json)、[合同](../analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](../analysis/game-actor-presentation-v1/validation.json)、[测试](../analysis/game-actor-presentation-v1/test-results.json)、[网络](../analysis/game-actor-presentation-v1/network-validation.json)。

**下一步：** 追踪43d150此前的姓名/标签/HP及font消费者，再补队伍与本机纠偏实际全局/身体同步，推进完整玩法和平台验收。姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：source60附属对象更新、复合绘制与生命周期

**需求与前检：** 完整目标仍为REA登录器→实现→REA游戏→完整跨平台游戏及兼容验收。上一阶段是有效进展；2452项旧清单0不符，21候选编辑前备份，无Git。复用当前AGENTS、Router加载合同、REA原生及前端测试工作流；experience,requirement-index/development/3000查询仍缺需求索引，以本节及先于产品编辑建立的[计划](../analysis/game-actor-attachment-v1/implementation-plan.json)、[合同](../analysis/game-actor-attachment-v1/implementation-spec.json)为真源，不改外部规则。

**事实与实现：** 复用20份既有函数，452个已知入口没有重复新分析。10新REA记录为1个retained view、3段原字节和6端点映射，核对43bfeb普通钩子及43d150的AP累加/附属尾段。source60更新正常/身体资源并创建、复用或移除aux34；本轮接入动作8→3否则0、实际朝向、一次mode0 helper、仅返回0提交type1，以及人物+坐骑当前AP锚点。状态1/2/3跳过普通钩子；重复图形根-1仍更新附属，离屏移除在钩子前返回。[源核验](../analysis/game-actor-attachment-v1/source-check.json)。

**验收：** 21新核心加6真实TCP、1328全量Node通过；1760独立计划/540完整场景/200种SHA，6实际原创TCP/1300帧一致，另有12帧预解码精灵对比。三App各115输入11输出、API90输入，7neutral/7生成检查通过。11Chrome桌面/移动网页流程、18图已查，0应用警告/错误/外部请求；2条QA反复读取Canvas提示单列。旧测试的“60必须未建模”断言已改为自有隐藏子对象，不宣称修复了新的生产故障。浏览器控制时点不同于精确源帧，其像素hash是观察；逐帧等价证据在核心/TCP/neutral。[测试](../analysis/game-actor-attachment-v1/test-results.json)、[网络](../analysis/game-actor-attachment-v1/network-validation.json)。

**下一步：** 继续43d150其他状态/姓名/队伍/UI消费者及生产者、完整输入/reset/生产启动/digest/中文、战斗/剩余玩法、微信原生gamePage/设备、现行消费者及官方验收。静态删除谓词异常不等于原程序泄漏；独立所有权释放全部自有播放器。矩阵revision71保留40项27observed/13unknown，完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方执行，不重问既有账号/PDB或重复消费授权。[目标审计](../analysis/game-actor-attachment-v1/goal-audit.json)。


<a id="stage173"></a>

## stage173：真实70号动作、state1/2与普通骑乘

**需求与前检：** 延续REA登录器→独立实现→REA游戏→完整网页/移动网页/微信目标。上一阶段是有效进展；2429项旧清单0不符，29初始候选及1项既有测试共30份编辑前备份，无Git。已读项目AGENTS、Router加载合同、REA原生与前端测试技能。知识库仍缺强制requirement-index，以本节和实施前建立的[计划](../analysis/game-actor-ride-v1/implementation-plan.json)、[合同](../analysis/game-actor-ride-v1/implementation-spec.json)为真源，不改外部规则。

**事实与实现：** 复用24份既有dossier，新分析5013b0/438bc0/40a090；6新REA记录使总数1458，固定37c4规范函数449→452。闭合70的本机/远端差异、资源映射、439080进入/退出和439a70人物/坐骑动作。动画的上一附着点控制插值/快进，当前附着点控制进入完成；退出音463仅在快进后计数仍为0时触发。普通骑乘、type1→root→type0复合队列及1024子项预算进入实际client/world/frame；本机动画实际写入单独传递，特殊移动后同步拥有者。[源证据](../analysis/game-actor-ride-v1/source-check.json)。

**复核与验收：** 源复核发现屏幕投影在43c700移动前计算、深度读取移动后位置，已修正并加入真实输入回归。初稿测试的缺少远端坐骑/未准备入口/查询字段/镜头预期等前提已更正，未改生产协议迎合夹具。最终24新/1301Node、5262独立例/110场景、6实际原创TCP/380帧、6neutral/7生成、11Chrome通过。16图总览加2图原尺寸查看，无应用错误/警告/外部请求；3条提示来自QA反复读取Canvas，单独保留。首稿重复截图文件名已更正并重跑4个骑乘浏览器流程。[测试](../analysis/game-actor-ride-v1/test-results.json)、[网络](../analysis/game-actor-ride-v1/network-validation.json)。

**下一步：** source60附属构造已证，绘制尚待闭合；继续队伍/其余消费者、完整输入/UI/reset、生产启动/digest/中文、战斗/玩法、微信gamePage与设备、现行消费者及官方验收。静态删除谓词异常不等于运行泄漏；独立实现按所有权释放子对象。矩阵revision70仍40项27observed/13unknown，整体goal active/incomplete。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。[目标审计](../analysis/game-actor-ride-v1/goal-audit.json)。


<a id="stage172"></a>
## stage172：80号源状态、旋转回调与正常字段恢复

**需求与前检：** 延续REA登录器→独立实现→REA游戏→完整网页/移动网页/微信目标。上一轮属于有效进展，当前2406项清单0不符；24初始候选加本机移动模块，共25项在产品编辑前备份，无Git。已读当前AGENTS、README/计划stage171、Router加载合同、REA summary-first/native及前端测试技能。知识库experience,requirement-index/development/3000查询仍缺强制requirement-index；本节与[计划](../analysis/game-actor-spin-v1/implementation-plan.json)、[合同](../analysis/game-actor-spin-v1/implementation-spec.json)先记录需求，不改外部规则。没有账号/PDB不重问，不重放stage131已恢复诊断。

**事实：** 固定37c4，REA6.7.0/Ghidra12.1.4，复用28份dossier、449已知规范入口；新增26记录，含4段原字节、4映射及18指令核对，无重复新分析函数。4ffe10/43e610 case80只写身体状态3/资源并清辅助计数；正常f536a0不变。439080计数0..360旋转，之后action4/mode1返回1才清状态并跟进mode0，末尾计数仍加1。特殊回调的事件坐标、深度flag0和绕过普通运动/裁剪都有源。1452记录导出与353371441B快照留build，session已关闭。[证据](../analysis/game-actor-spin-v1/source-check.json)。

**实现：** 无平台纯planner与演员自有specialSpin接入实际client/world/frame，完整400帧含114种场景SHA、合成动画在第365帧结束，静态/冻结资源继续等待。正常资源/朝向与身体分离；实际运动/转向写入通过内部所有者桥传递，转向资格比较真实body朝向。ready场景重建使用正常源。已知未实现的骑乘/附属操作显式保留，不在普通路径伪绘制。

**纠错与验收：** 原行为的真实client回归0≠3转绿；初稿结束后把正常朝向回写身体，移动中旋转回归5≠4促成保留最终body值并核对462410。全部最终20新/1277Node、四份v2构建、5neutral/7生成、6实际原创TCP/1474帧和11Chrome在修复后执行。修正合成动画磁盘基址、动作逗号/单位Tab分隔、首帧时钟、指针方向及非空转向路径夹具，未改核心格式迎合夹具。12图实看；两条Chrome提示来自QA重复像素读取，0应用警告/错误，无渲染设置修改。[测试](../analysis/game-actor-spin-v1/test-results.json)、[网络](../analysis/game-actor-spin-v1/network-validation.json)。

**下一步：** 继续真实state1/2、骑乘/子对象与来源，再闭合record/global输入、完整UI/reset、生产启动/digest/中文、微信gamePage宿主、战斗/特效/其余玩法、现行消费者及设备/官方验收。矩阵revision69仍40项27observed/13unknown，整体goal active/incomplete。本轮无VM/CUA/原程序/WER/CDB/账号/官方操作。[目标审计](../analysis/game-actor-spin-v1/goal-audit.json)。


<a id="stage171"></a>
## stage171：实体来源、构造朝向与普通物件过滤

**需求与前检：** 延续REA登录器→独立实现→REA游戏→完整网页/移动网页/微信目标。修改前核对stage170的2384项清单，0不符，23候选文件逐一备份；目录无Git。当前规则、README/本计划和[需求计划](../analysis/game-actor-context-v1/implementation-plan.json)、[实现合同](../analysis/game-actor-context-v1/implementation-spec.json)作为本轮真源；沿用已读Router加载合同、REA summary-first/native与前端测试技能。历史requirement-index缺项仍以当前项目文档补足，不扩大到外部规则维护。

**事实：** 固定37c4旧PE，REA6.7.0/Ghidra12.1.4；复用28份既有dossier，新增79记录/4规范函数、74项字节/映射/表核对与1数据xref。C0列1才是43f380参数13的类别；远端分支尚留的归一化参数改变ESP栈偏移，不能套用本机mode15的位置。类型只在注册时赋值，绘制字段刷新而body位累积。构造朝向读取957e88：wire8→45f2a0参数7→4649b0参数4；45eef0在明确main5准备时写0。声音消费者4fd0d0读f5f17c，不能借用同名“场景”语义。[静态证据与偏移](../analysis/game-actor-context-v1/source-check.json)。

**实现：** shared新增纯字节实体上下文模块，实际世界场景直接驱动构造mode；只在mode0且类别>3时需要资源归一化决定初始朝向。mode更新不回写现有朝向。逐实体元数据保存初始type、当前draw、累积body与已证motion掩码；保留显式未知门控、special/frozen/child等。拥有客户端启用绑定，普通body0x400路径增加±16格及100键过滤。动画/事件先推进，重复不绘制但保活，远端越界在所有权检查后释放，不伪造网络移除包。

**纠错与验收：** 最终复核发现初稿误接runtime.soundScene。真实client的mode1/sound0回归先失败0≠4，改为实际scene.fields[8]并加入mode变更、未知及归一化短路检查；最终18新/1257全Node、四份新构建、中性/生成工程、实际TCP和浏览器均在修正后重跑。另修正独立参考的提交顺序元数据、严格catalog输入及数据xref分类，保留失败日志。[测试](../analysis/game-actor-context-v1/test-results.json)含508独立例/120混合帧、6条新实际原创TCP/480帧，4neutral/7生成检查和11Chrome/10实看截图；Browser插件缺席，使用既有Playwright/Chrome，不改浏览器安全设置。

**下一步：** 追踪未闭合record gate、special/frozen/child、原生输入和party生产者及处理器；继续生产启动/digest/中文、微信原生宿主，再完成战斗、特效、现行消费者和设备/官方验收。矩阵revision68仍40项、27observed/13unknown。有限普通路径完成不等于完整游戏；goal active/incomplete。本轮0 VM/CUA/原程序/WER/CDB/账号/官方操作，不重放已执行恢复的stage131诊断。[目标审计](../analysis/game-actor-context-v1/goal-audit.json)。


<a id="stage170"></a>
## stage170：本机源字段、逻辑构造与入场等待

**需求与前检：** 保留REA登录器→独立登录器→REA游戏→完整网页/移动网页/微信游戏目标。stage169的2364项清单全部相符，26候选文件修改前备份，目录无Git。本节、[计划](../analysis/game-local-bootstrap-v1/implementation-plan.json)与[源合同](../analysis/game-local-bootstrap-v1/implementation-spec.json)先于产品代码。沿用已读Router加载合同、REA summary-first/native指南、当前README/开发计划与规格；知识库requirement-index历史缺项以当前项目需求文档为真源，不写外部规则。没有账号/PDB不重问，已执行恢复的stage131 WER不重放。

**事实：** 固定37c4旧PE，REA6.7.0/Ghidra12.1.4；31份既有dossier复用，新增69记录/1个规范函数、57项原字节/映射与7个数据地址xref核对。main5的45eef0设922c4c=3、4ff080的已知raw清理与朝向-1、main9的4ff160构造和101等待，以及单位/地图清位有源。f536a0是当前body资源、a4是所选外观、a8是身份、ac是朝向；不能从参数序号或字段15猜ID。43ba10能解码且有构造器DATA引用，但不在Ghidra procedure内；失败查询不计新函数，不猜边界重跑。[证据](../analysis/game-local-bootstrap-v1/source-check.json)。

**实现：** 只扩展shared演员/世界核心。显式人物进入准备后，已知身份与真实场景坐标建立普通逻辑本机对象；初始资源0不会冒充外观或实际单位记录。提前位置/朝向与源状态有独立保留。初次本机单位更新已存在对象时保留其当前坐标/非负朝向。保守sourceEntryWaitMask起始3，接受地图后清1、本机单位后清2；移动所有者与页面都遵守等待，并继续检查实际地块/速度。ready普通换场景重建本机key/动画、用新坐标和已知资源/朝向/速度/标签，旧player失效。未消费的首次场景等待身份才允许迟到身份构造，重复身份不回卷或复活移除对象。

**纠错与验收：** 288组独立Python顺序例、19新增/1239全Node、8新增实际TCP（Node及微信形状端口）通过，完整回归另含既有7条TCP和实际双目标WebSocket检查。11Chrome流程含4新初始化边界，0console/0external，10图实看；3neutral/7生成App/Page与3份111输入11输出App、86输入API构建通过。修正了测试的私有API导入、碰撞未知/布尔值/phase假设、异步观察屏障、独立cache/checksum配对及静态隐藏Canvas判断；保留失败日志，不改产品语义迎合错误夹具。[回执](../analysis/game-local-bootstrap-v1/test-results.json)、[实际TCP](../analysis/game-local-bootstrap-v1/network-validation.json)。

**下一步：** 继续main9普通记录/body/runtime输入上下文生产者、生产启动/digest/中文文本链与原生微信gamePage/Canvas/file/scheduler；再完成队伍、战斗、特效、现行消费者和平台/官方验收。本阶段是有限逻辑投影，完整原生reset/UI/条件分支仍未闭合。整体goal active/incomplete；本轮无VM/CUA/原程序/WER/CDB/账号/官方操作。[目标审计](../analysis/game-local-bootstrap-v1/goal-audit.json)。


<a id="stage169"></a>
## stage169：固定游戏页面、可移植所有者与同页重连

**需求与前检：** 继续原REA登录器→实现登录器→REA游戏→完整网页/移动网页/微信游戏目标。stage168的2335项清单全部相符；23候选文件在修改前精确备份，目录无Git。本节/计划/源合同先于产品代码建立；已读README/计划stage168、Router加载合同、REA summary-first/native指南及前端测试技能。当前知识库查询仍缺moli-mac requirement-index，以当前项目需求为真源，不写外部规则。无账号/PDB不重问，已执行恢复的stage131WER不重放。

**REA：** 复用5015a0/501a50等7主dossier，新增42记录/6新规范函数与36字节/映射核对，最终1278记录和350369862B快照保留、provider关闭。主9的0/100→101及922c4c等待、4ff160/4405a0/4fe580/44e7d0/44e7e0/5028a0的初始化/记录/绘制计时片段有源；完整UI和嵌套上下文仍未闭合，不据此默认清零或模拟原生phase。[证据](../analysis/game-browser-owner-v1/source-check.json)。

**实现：** 无平台依赖的startup/context验证器与owning client拥有world/library/session/runtime/CUT，借用文件端口。就绪依源入场、scene/map/local actor/速度及本机地块标记，不看固定包数；丢就绪即停旧运行时，实际记录恢复后重建。场景切换先停画面/输入，再换CUT/scene；暂停保连接、恢复重置时钟；close/失败/EOF按代际失效清理独立所有者。浏览器薄层拥有File适配、picker与Canvas。

**固定入口：** web/game.html由实际game-app模块加载，正常File输入/会话选择→源人物流程→Canvas；无测试脚本注入场景或隐藏fixture。连接后收起准备表单，断开后展开，材料不存储、输入清空；pagehide关闭，隐藏时暂停。重连用新所有者。发现第二目标序号被单目标数组重排，已将完整有序runtime端点表经页面/薄层/浏览器session传递；实际WebSocket第一目标0连接、第二目标5请求及同页两次连接通过。独立CLI以明确原创回环端点提供该页面，无默认对端或自动连接。

**验收：** 22新增/1220全Node、2neutral/7生成工程通过；3App各111输入11输出、API86输入，均0external。7原创TCP含5场景链各52摘要/两移动、场景重载保暂停、33100默认值、重试及拒绝/入场前关闭。7Chrome含桌面/触屏、真实材料恢复、重载/暂停、pagehide、同页重连、错误桥profile，0console/0external、5图已看；正常CLI HTTP/优雅结束且0对端连接。[回执](../analysis/game-browser-owner-v1/test-results.json)。

**继续：** 固定网页入口已落地，但显式context/派生startup生产者未闭合，ASCII名称是当前明确子集；不把sourceHash声明当认证或所选资源鉴定。继续原生state-backed本机对象/完整main9上下文、生产编码/启动链、原生微信game Page/Canvas/file/scheduler，再补party/战斗/特效/current/设备/官方。旧开发桥10秒/4MiB未改；整体goal active/incomplete。本轮无VM/CUA/原程序/WER/CDB/官方操作。[目标审计](../analysis/game-browser-owner-v1/goal-audit.json)。


<a id="stage168"></a>
## stage168：已有角色外观、已知升级与进入前状态

**需求与前检：** 原REA登录器→独立登录器→REA游戏→完整网页/移动网页/微信游戏目标保留。stage167的2313项清单全部相符，29候选文件先精确备份，当前目录无Git。本节、实施计划和源合同先于产品代码建立；已读当前README/计划、Router合同、REA保留证据及native指南。知识库requirement-index历史缺项仍以当前项目需求为真源；不修改外部规则、不重复询问账号/PDB、不重放已执行恢复的stage131WER。

**源分析：** 复用458900/4593b0/4586f0及四换算等12份主dossier，新增111REA记录/25新规范函数入口、82字节映射与原PE核对。最终1236记录及纠正后快照留在build，provider已关闭。25入口含18个main5直接callee、2个profile getter、2个升级控制器、2个未赋升级语义的探索消费者与真实WDM消费者4f4a80。对f5f1a0的216条xref定位回复；923c40只取得已知reader，生产者未闭合。[证据](../analysis/game-character-options-v1/source-check.json)。

**实现：** action3/4按类别与临时分类修改field2，保留预览缓存和field17；5/6等价切换field17后重新数值准备。只在下次已有入场发送field15/17/2。main13已知kind2/4与固定marker接入flow/session和真实升级视图，WDM取低字节、独立结果且无源deadline；成功确认后重查列表，失败明确重试且每次有独立等待者。main5→4ff080的selected appearance只绑定已证明同址的state4f0000/field16，不补全未知reset或把field15当actorID。

**纠错与边界：** 补看0x45874c实际MOV后确认0x814c=33100；旧实现及Python参考同误为33000，修正24/1128预览行，其余集合不变。逆向表只有14项，源分类包含242800可落index14；独立实现原子拒绝实际越界，不捏造stack值，也不宣称观察到原程序崩溃。类别7需运行材料923c40，未发伪marker；generation1源停滞与本机generation>=2门槛分别记录。

**验收：** 15296外观/1566升级/1128修正预览；19新增、1198全Node，2neutral与7实际生成工程通过。6原创TCP含两槽/正确33100默认值、拒绝后明确重试、重复回复/拒绝/中止；成功各52场景摘要与两移动。5Chrome含桌面/手机触屏、重试成功各53帧，以及控件关闭/观察器关闭晚答复；console/外部请求0，5图实际查看。3App各109输入11输出、API84输入，均0external。[回执](../analysis/game-character-options-v1/test-results.json)。

**下一步：** 保留已纠正源快照，继续main9 runtime/UI上下文及正式game/resource/Canvas所有者和页面，再补未决材料生产者、生产编码与其余玩法/current/设备/官方。只读到18个直接callee不等于完整重置；已有原创浏览器验证文档不等于正式game Page。整体goal仍active/incomplete，本轮无VM/CUA/WER/CDB/原程序或官方新操作。[目标](../analysis/game-character-options-v1/goal-audit.json)。


<a id="stage167"></a>
## stage167：创建人物控制、握手与列表刷新

**需求/前检：** 原REA登录器→实现登录器→REA游戏→完整网页/移动网页/微信游戏目标保留。上轮为实际进展；2293项stage166清单全部匹配，22候选文件先备份，目录无Git。已读当前README/开发计划、Router加载合同、REA技能与native guide、前阶段合同/接口。知识库requirement-index历史缺项继续以本项目需求为真源，未重复空查询或写外部规则。本节、计划和源合同先于产品代码建立；没有账号/PDB不再询问，stage131已执行恢复的WER不重放。

**源证据：** 复用5015a0/458900/4593b0等10份主dossier，3份探索性旧结果未赋创建/删除语义；新81REA/21函数入口/60字节映射核对，1125记录与快照留存且关闭。459f30→45a1a0/45a970闭合造型/配色、五项30点/单项15、四项10点及名称检查；4ef3a0→4f8460发送槽位/名称/两外观数值/五+四分配值。U_s→4ef480的成功、ack优先与600001ms、成功回main3sub0重新查询已核对。内地址4ef4a0规范为4ef480，不是重复新版本；已知入口缓存未重复分析函数，CRT指针一次同读/映射沿用旧Evidence。[核验](../analysis/game-character-lifecycle-v1/source-check.json)。

**实现：** 纯创建草稿拥有名称/分配值，已有角色flow与可选session接一次确认写入、回复和刷新；浏览器picker接真实创建表单，显式文本端口、点数/名称校验、确认/修改/取消/失败返回与稳定输入焦点。成功不本地捏造人物记录、不自动进入；refresh后的field17才用于已有入场链。错误保留连接，关闭清待发名称/在途帧并结算commit。原生profile.dat重置/写入、预览对象/像素和属性语义标签未重建，中性标签单列。

**验收：** 8400外观/6000分配/306名称独立参考；18新增/1179全Node、2neutral/7生成工程通过。4原创实际TCP验证两槽/mode2与0、重复成功、拒绝/主动中止；成功各52场景摘要/两移动/7请求。5Chrome流程含两视口各53摘要、真实校验、刷新入场、失败返回和控件/观察器关闭晚答复；console/外部请求0，4图实际查看。3App各107输入11输出和82输入API均0external。本轮首次与最终检查均通过，没有新增运行故障修复声明。[回执](../analysis/game-character-lifecycle-v1/test-results.json)。

**继续：** 固定删除分支458900→455820的完整体恒返回0，发送消费者未闭合，不补造协议。继续已有角色look/aux、main5完整重置与runtime/UI上下文、正式资源/Canvas/game owner/page、游戏文本编码及标签绑定，再补剩余业务/party/战斗/current。完整goal active/incomplete；原生微信/物理手机/官方未验。无VM/CUA/WER/CDB、原程序/账号/官服新动作。[目标](../analysis/game-character-lifecycle-v1/goal-audit.json)。


<a id="stage166"></a>
## stage166：已有角色列表、选择和源入场

**需求/前检：** 原始REA登录器→独立实现→REA游戏→完整网页/移动网页/微信可玩目标继续有效。stage165的2268项清单逐一匹配，24个候选文件先精确备份；目录无Git，历史与无关内容保留。实际读取Router加载合同、REA保留证据/原生指南、当前需求、前阶段源合同和会话/资源接口；知识库requirement-index的历史缺项仍以本项目开发计划为真源，没有重复空查询或修改外部规则。本节、计划与源合同先于产品代码建立。没有账号/PDB不重复询问；stage131已执行并恢复的WER不重放。

**源证据：** 先复用5015a0/457c30，再沿主阶段3的458900追到455910/455920→4eed10/4eed50及VK0消费者4eef20/500630，才确认它是两槽148B人物列表。新增89条REA记录、27新函数入口、60字节/映射检查，17份旧dossier复用，1044条完整记录/快照保留且provider关闭。其中5111a0有一次重复已完成查询，单列不计新入口；随后按已知入口缓存过滤后续请求。Wb^保存低8位category，五资源探测与source gate闭合；4586f0选择前修正field2/17。已有角色经主阶段5/6发送field15/17/2，精确successful与600001ms轮询成功后请求下一主阶段9。[证据](../analysis/game-post-login-v1/source-check.json)、[合同](../analysis/game-post-login-v1/implementation-spec.json)。

**实现：** 新纯字节角色所有者保存两份记录并提供拥有副本；会话通过可选postLogin复用有序写队列、读流与计时器，自动查询并等待选择，入场前拒绝业务发送。旧login-only默认不变。新增选人控件只显示真实解码名称、空槽与待确认状态；不补猜测属性或人物画面。完整原生main5重置尚未实现，宿主明确要求首次进入空scene/map/actors的借用world，绑定已观察category，不把field15当actorID或静默重置世界。菜单、入场与终结Promise各有边界，关闭后的历史成功快照不能触发活跃游戏回调。

**验收/更正：** 211记录/1566门槛/1128修正、实际6份GraphicInfo的641666条记录探测一致。28新/1161全Node、2neutral/7生成工程、3App各106输入11输出及81输入API通过，均0external。原创Python实际TCP覆盖两槽、重复、OUTOFSERVICE、拒绝；成功各52场景摘要/两移动，5条Chrome流程含两视口各53摘要与控件关闭/观察器关闭晚到回复。截图4张实际查看，console/外部请求0。首次会话测试的stats getter被spread固定为0、浏览器status locator匹配两个元素，均只修测试包装/定位，未放宽产品限制或浏览器安全设置。[回执](../analysis/game-post-login-v1/test-results.json)。

**继续：** 复用已保留5015a0/458900，沿main4/459f30追创建人物，再闭合删除、外观与aux消费者；继续真实runtime/UI/resource/Canvas组合所有者及正式页面、摘要/票据版本绑定、剩余party/战斗/业务/current。原生微信、物理手机、官服和完整三端可玩仍未验，完整goal active/incomplete。本轮无VM/原程序/WER/CDB、账号/官服或原生IDE新动作。[目标审计](../analysis/game-post-login-v1/goal-audit.json)。


<a id="stage165"></a>
## stage165：旧版登录消费者与会话宿主

**需求/前检：** 原始“REA登录器→实现登录器→REA游戏→实现游戏”及网页、移动网页、微信可玩目标继续有效。stage164的2242项清单逐一匹配；21候选文件在修改前精确保留，目录无Git。实际读取Router加载合同、REA保留证据/原生指南、当前README/开发计划、既有源合同和WER回执；知识库requirement-index既有缺项沿用本项目需求真源，没有重复空查询或修改外部知识库。实施计划和本节先于产品代码建立。stage131已消耗的WER诊断、设置恢复及根因未定已核实，本轮不重放。

**源证据与切面：** 实际登录器入口/交接复盘后，先补齐旧37c4的post-connect登录前置。复用11个已完成dossier；新增42条REA记录、10个新函数及30字节/映射核对。457c30与505610/505670→505640/5056a0闭合glt/gid复制，505540/404c40/404d30只证本模块16B摘要→32小写hex的边界；完整摘要算法未恢复。4ee730→4f83d0按“模块摘要、glt、gid”发送，4eec00处理UJt的单次待确认回复，延迟轮询到99返回1→主阶段3。下一阶段尚未赋游戏/角色语义。4f6440单独识别为UI/effect回调入口，不当作认证回复。[源核验](../analysis/game-session-runtime-v1/source-check.json)、[合同](../analysis/game-session-runtime-v1/implementation-spec.json)。

**实现：** shared新增拥有交接字段/回复的纯登录状态机；web新增借用genuine world的流/时钟/写队列所有者与显式loopback浏览器端口。微信复用已有TCP/control/clock限制，game.mjs统一导出核心与适配，避免不同bundle的world身份混用。启动、ready/done、源等待、有限写队列、晚到open/read/write/callback、EOF、关闭、重新bootstrap不重发登录均有明确边界。不自动填入原样本指纹、不把current登录器票据接到旧game；auth detail不进入观察回调或日志。完整游戏页面/资源/runtime所有者继续保留为后续目标。

**验收与更正：** 24组输入、131条轨迹/4315状态相符；25新/1133完整Node、2neutral/7生成工程通过。三份新App各105输入/11输出，游戏API80输入，均0external。原创TCP覆盖登录→52场景帧/两发送、重复回复、busy拒绝；Chrome156两视口各53像素摘要、真实移动、校正/EOF与暂停/断开通过，0console/外部请求，截图实际查看。首轮发现关闭时done早于回调包清零，已改为终结前同步清理；浏览器还发现定时器伪receiver导致首次连接失败，已改为plain函数端口及原生默认包装。微信夹具端点和neutral测试拼写错误仅修测试。浏览器测试由真实HTTP提供专用原创HTML，避免替换运行中登录页DOM及合成响应引发的LNA检查；没有改浏览器安全设置。[回执](../analysis/game-session-runtime-v1/test-results.json)。

**继续：** 先复用5015a0/457c30，沿主阶段3的458900追真实消费者，再接完整runtime/资源/Canvas及正式页面；补摘要/票据版本绑定、aux405620、副作用/后续阶段、UI/特效/party/战斗/剩余业务和当前9baa/6e2ff。没有账号/PDB不重复询问；原生微信、物理手机、官服与完整三端可玩仍未验，完整goal active/incomplete。REA快照/完整Evidence已保存并关闭，本轮无VM、原程序执行、WER/CDB、账号/官服或原生IDE新动作。[目标审计](../analysis/game-session-runtime-v1/goal-audit.json)。


<a id="stage164"></a>
## stage164：资源路径、延迟图像读取与宿主所有权

**需求与前检：** 原始REA登录器→实现→REA游戏→完整游戏及网页/移动网页/微信/官方目标保留。stage163为进展；2216项旧清单、固定37c4及879记录工件复核，24候选文件先备份。已读AGENTS目标/文档、Router加载合同、REA原生/保留证据流程、当前需求及graphics/animation/render/runtime接口。requirement-index既有缺项沿用项目需求真源，不重复无变化查询或写外部规则。源合同先于产品改动，无Git，以清单与备份保护现有内容。

**源事实：** 新34REA、3dossier（其中2新函数入口，4649b0已有分析但被重复请求，不算新入口）、31字节/映射检查；复用20旧函数，最终913记录/快照存储且关闭。5376B默认表与参数字串给出七组路径，保留graphicbiv2x→graphicbinv2的分支覆盖次序，Crd的*3别名在参数后共享组3路径。452460要求图形0/3/6组，453720要求动画主组。506030→5074d0/505d70→453030证明数值绘制队列先于图像I/O，而44fb60可先跳绘。当前scene.resolvedSelector已提供CUT选择，不新增wire字段。[source-check](../analysis/game-resource-runtime-v1/source-check.json)、[合同](../analysis/game-resource-runtime-v1/implementation-spec.json)。

**实现：** 可选deferImages保持旧同步API，world只推进一次并返回无像素的drawPlan，选中呈现后才范围读RD/CGP准备RGBA。资源库拥有目录/中性调色板/缓存，借用文件端口；CUT由调用者单独拥有。缓存按整帧pin和独立LRU预算管理，不伪称复刻DirectDraw贴图池时序。异步Canvas保留已产出请求，停止/场景改变/旧timer/clock回调关闭均不提交陈旧像素，I/O后按原绝对deadline计算剩余等待。

**验收与接续：** 21新/1108完整、2neutral、7生成工程及3新微信（104输入/11输出/0外部导入）。209路径/160裁剪/4palette/52源场景及实际TCP2请求相符；双视口各53摘要、7异步/交互检查及旧同步宿主2视口回归通过。真实本地源25文件身份留存，641666图形/2520动画目录、18图像36摘要全部匹配Python。首次新测试14/16，根因是裁剪命令的省略flip未按既有默认0处理，已修复；无透明占位或重跑逻辑。[验收](validation.md#stage164)。

下一步把资源/会话生命周期接到实际游戏页面与微信，再继续所有剩余源业务。完整登录页→游戏接线、微信游戏Canvas与原生文件/调度、真实runtime/record/UI上下文、动态LUT/命名调色板/效果、骑乘组队/primitive/小地图、战斗/其余业务及认证、现行与实际三端/官方可玩仍未完成。旧版37c4源码与当前安装资源能按格式组合验证，不构成9baa/6e2ff消费者或官方接受证明。 无VM/WER/CDB/原程序/账号/官服/原生IDE新操作，不重放已消费停止点，也不重复索要不可用账号/PDB。

<a id="stage163"></a>
## stage163：源输入、相机、帧时钟与 Canvas 运行连接

**需求与前检：** 原始REA登录器→实现登录器→REA游戏→完整游戏及网页/移动网页/微信/官方目标保留。stage162为进展；2196项旧清单、固定37c4及783记录工件核对，26候选先备份。已读Router加载合同、REA原生/保留证据流程、当前需求和frame/map/scene/local接口；requirement-index既有缺项沿用本项目需求真源，不重复无变化查询或写外部规则。源码合同先于产品改动；无Git，使用清单和备份保护现有工作。

**事实与实现：** 新96REA含23唯一dossier、26指令观察（24解码/2数据）、4读/25映射、10归属查询、3名称xref工作流及5xref；53字节/映射相符，13旧dossier记录复用、879最终记录/快照存储并关闭。463dc0/4665b0闭合float32逆投影、double0.5偏置与C截断地块拾取；6个按钮入口与460c40/44fb60闭合保留点击边沿、250ms节流、500ms自动行走和19次跳绘上限。完整清理/保护/账号代码未执行或重实现。[源证据](../analysis/game-input-runtime-v1/source-check.json)、[合同](../analysis/game-input-runtime-v1/implementation-spec.json)。

**实现与验证：** pointer/clock/runtime拥有各自状态、借用world；显式初始camera跨wire修正保留，输入取前相机、移动后跟随，ownGate阻止跟随。world的旧advanceFrame语义保留，新增follow/context读取与不重置路线的context更新。Canvas源逻辑仍每轮更新，显示只取源时钟选中帧，发送描述符逐条保留。20新/1087完整Node、2neutral、7生成工程及3新微信（100输入/11输出/0外部导入）；独立1213拾取/33输入/1800时钟/52相机场景、实际Python TCP52帧和2发送请求通过。Chrome156鼠标/触控各53像素摘要、停止/恢复/无溢出/0控制台和外部请求通过。

**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

**接续：** 完整资源与原生 runtime/record/UI 上下文绑定、右键交互、小地图/primitive/特殊角色/特效、战斗/其余业务及认证、现行版本、实际三端与官方可玩仍未完成。旧版37c4不等同9baa/6e2ff；本轮没有VM、WER、CDB、账号、官服或原生IDE新操作，也未重放已消费停止点。 原创fixture验证不是完整游戏页面或官方接受；继续完整资源/上下文宿主和剩余功能。[验收](validation.md#stage163)。

<a id="stage162"></a>
## stage162：普通地图、静态/动画物件与实体源场景合并

**需求与前检：** 原始四步与完整网页/移动网页/微信/官方可玩目标保留。stage161为已验证进展，2175项旧清单、固定37c4及744记录工件核对，24候选先备份。已读Router「加载合同」、REA原生/保留证据流程、当前需求与frame/map/scene接口；requirement-index既有缺项继续用本项目需求真源，不重复无变化查询或写外部规则。源合同先于产品改动；无Git，使用清单/备份保护已有工作。

**事实与实现：** 新39REA含14唯一函数、13解码指令、5xref、3读取/3映射及1新增函数归属查询，19字节/映射核对相符；复用22个已完成函数分析，最终783记录及快照保存并关闭，无原程序执行。CUT读取为12B头/18B文件记录/20B运行时，原先按runtime猜20B文件长度的判断已被实际341资源及fread序列纠正。45f1c0/45f250证明非对称渲染窗口；463ea0→462db0/464cc0→463240/463410闭合普通地形、静态/动画物件、实体/物件/类型3尾队列。AUT另用于小地图，不是地形替换表；463780大栈探测造成签名失真，未据此伪造小地图实现。[源证据](../analysis/game-legacy-scene-frame-v1/source-check.json)、[目录](../analysis/game-legacy-scene-frame-v1/scene-frame-catalog.json)、[合同](../analysis/game-legacy-scene-frame-v1/implementation-spec.json)。

**实现与边界：** world可选configureSceneFrames后，advanceFrame把实际地图缓存、已有actor根、本地移动接到普通场景RGBA；旧actor输出保留。源矩形裁剪含负起点与翻转位置，独立参考按64×48纹理块验算；图形ordinal占地元数据独立于resource查找。动画地图物件首次可见只创建，后续可见轮次才调一次helper，资源/锚点按创建时捕获，隐去保留、实际scene消息即释放。特殊primitive/样式明确拒绝；scene失败可能已部分推进，释放其播放器并保留actor输出、移动请求及协议，不声称整帧回滚。

**验收与接续：** 17新/1067完整Node、2neutral、7工程、3新微信（各97输入/11输出/0外部导入）；100窗口/7遍历/600比较/27合并/160裁剪/6组144场景帧及52实际TCP场景帧/2发送请求通过；341CUT/401103数值记录相符。首次全量旧35ms截止测试仅观察1条而预期2条请求，隔离及最终同命令全量通过，bootstrap模块/测试hash未变；负载影响为推测，失败材料保留。下步分析源输入/帧时钟并连接真实资源/Canvas游戏宿主，再补小地图、primitive、UI/特殊角色/特效、战斗/其他业务/认证及现行/实际三端/官方验收。目标active/incomplete，无VM/WER/CDB/原程序/账号/官服/原生IDE新动作或确认。[验收](validation.md#stage162)、[审计](../analysis/game-legacy-scene-frame-v1/goal-audit.json)。

<a id="stage161"></a>
## stage161：实体动作、源回调与普通世界帧连接

**需求与前检：** 保留REA登录器→实现登录器→REA游戏→完整游戏及网页/移动网页/微信/官方验收目标。stage160为进展，未标完成；2157项旧清单、固定37c4及713记录工件已核验，最终25个候选文件先备份。已读项目目标/文档规则、Router加载合同、REA保留证据与原生流程、现有实体/移动/动画接口；requirement-index既有缺项沿用本需求真源，不重复无变化查询或写外部知识库。源合同先于产品改动，无Git，使用清单与备份保护现有文件。

**事实与实现：** 新31REA含9个唯一函数、13指令观察（10解码/2数据/1不可解码）、5resolve、2读取/2映射；14字节/映射核对及旧callback完整1520B相符，713旧记录保留，最终744记录/快照已存并关闭。409e70/409fe0证明同层创建FIFO与四轮条件回调；43ba10普通分支的stage/own/record门、队列出队后或全局阈值的helper次数、loop条件、延迟转向均接入。动作phase−1使播放器重播，helper后写回cached lastAction，并同步本地移动控制器，避免每帧重播。深度使用原生qsort而非JS排序；图形file36声明ID=1在排序后过滤。[证据](../analysis/game-legacy-frame-v1/source-check.json)、[合同](../analysis/game-legacy-frame-v1/implementation-spec.json)。

**更正与边界：** 分配器明确actor+20初始−1，修正旧player默认0，并重新生成原创参考；282个旧参考标量仅graphicIndex从0变−1，其他值及5资源/46动作/106帧/1250步数量不变。world新增显式源上下文的普通实体层；可选本地移动先产生请求，绘制错误返回安全代码，协议继续可用。绘制失败可能已部分推进实体，须重新配置帧系统；不伪称事务回滚或完整场景。native字段不是新增wire字段，party/ride/child/culling未支持时明确拒绝。

**验收与接续：** 17新/1050完整Node、2neutral、7工程、3新微信构建（各96输入/11输出/0外部导入）；1064计划/44排序/7组448帧，独立Python TCP实际核对52帧及2条移动请求。下一步分析完整地形/物件合并与原生record上下文/特殊回调，再实现完整scene/resource/input host、特效/战斗/其他业务/认证及现行版本/实际三端/官方可玩。目标active/incomplete；无新增VM/WER/CDB/原程序执行/账号/官服/原生IDE或人工确认。[验收](validation.md#stage161)、[审计](../analysis/game-legacy-frame-v1/goal-audit.json)。


<a id="stage160"></a>
## stage160：真实动画目录、每调用计数与普通帧定位

**需求/前检：** 原始四步和网页/移动网页/微信/官方完整目标保留。stage159为真实进展；2138项清单相符、21候选文件备份，37c4与658记录导出/快照核验。已读AGENTS目标/交付、Router加载合同、REA保留证据/原生流程、当前需求/actor/render接口；requirement-index既有缺项沿用本需求真源，不重复无变化查询/写外部知识库。无Git，以清单和备份保护现有内容；需求/源合同先于产品代码。

**事实/实现：** 新55REA、20dossier/19唯一函数，24指令＋32B比较器读取/映射共26核对，4数据观察、5resolve；旧callback43ba10完整1520B逐段重核。一次4fd4f0内址返回既有4fd0d0，未重复计唯一函数；4531c0无procedure，用有界原字节/GNU比较器，不强改Ghidra。复用已完成453720 loader；4533c0/453ad0/453cc0闭合12B index、12/20B action、10B frame与AP8B偏移，4fd0d0缓存/延迟/循环/单次与4fdaf0→462fc0→463120→506d50原点链闭合。第一次关闭后为实际draw消费者缺口恢复自己的快照；最终713记录/新快照保存并关闭，无原程序执行。[source](../analysis/game-legacy-animation-v1/source-check.json)、[目录](../analysis/game-legacy-animation-v1/animation-catalog.json)、[合同](../analysis/game-legacy-animation-v1/implementation-spec.json)。

新增animation owning catalog/player；group顺序与graphicBase显式给定，重复ID后者覆盖，version>1归0，延迟按duration/(frameCount×16)再uint32乘percent/100。计数是每helper调用，不能猜成16ms或每RAF一次。资源/action/facing变化重置，freeze恰为1保持，单次末尾delay255/循环计数1；0actions源加载失败code−1，空frame循环是不安全域明确拒绝。事件只描述不播放；AP首个graphic匹配与翻转投影保留。historical motion.phase对应actor+2b4上次动作，不是帧序号；新player独立持有lastAction，same-action restart须显式invalidate，自动wire/actor接线尚未完成。

**验收/接续：** 5资源/46动作/106帧、35组1250状态/1235普通RGBA步原创Python参考，21新/1033完整Node、2neutral、7工程通过；三新微信95输入/11输出/0外部导入。两组本地396资源/16034动作/58146帧全部数值metadata摘要相符，未导出图像/音频。归档helper直接执行两次报非UTF8而同文件UTF8/compile检查通过，原因未定；等价ASCII Unicode转义后成功，保留原件/回执，产品未改。矩阵rev57为30项/17observed/13unknown。下步真实actor/network重启/生命周期、callback重复调度/场景时钟、named palette/特效、实际scene/input/resource gamehost和战斗/business/control/auth、现行与实际三端/官方可玩；完整目标active/incomplete，无VM/WER/CDB/账号/官服/原生IDE新增动作或确认。[验收](validation.md#stage160)、[审计](../analysis/game-legacy-animation-v1/goal-audit.json)。

<a id="stage159"></a>
## stage159：真实RD、调色板和普通精灵绘制

**需求/前检：** 原始REA登录器→独立实现→REA游戏→完整游戏与网页/移动网页/微信/官方目标保留。stage158为真实进展；2119项前清单相符，20候选文件先备份，固定37c4原件与566记录快照/导出匹配。已读Router加载合同、REA原生/保留证据流程、当前需求与资源规格；requirement-index既有缺项沿用本需求真源，不重复无变化查询或写外部知识库。实施计划与源合同先于产品代码建立；无Git，不覆盖无关变化。

**事实/实现：** 新92REA/36唯一函数、47指令＋48B比较器读取/文件映射共49核对；2数据地址和1内址非指令边界只保留观察，未当可执行证据。真实453030→511470按flag低两位处理16/20B头、raw/压缩与palette尾；其他flag位忽略，C/D/E/F实际填0，literal与fill命令别名、零run和扩展次序有源。449cf0读取CGP前672B、固定首尾16色与current168变黑；447b10/native32、4497c0/449a10倒序行、4468b0零色key、446e00普通翻转裁剪及507200排序闭合。大函数449cf0的value-flow截断与上传函数错误签名保留，使用实际literal/分支/原汇编而非猜测。[核验](../analysis/game-legacy-render-v1/source-check.json)、[目录](../analysis/game-legacy-render-v1/render-catalog.json)、[合同](../analysis/game-legacy-render-v1/implementation-spec.json)。

新增legacy-game-render纯字节核心；拥有图像/palette/sprite并按close清空、copy返回独立数组。默认32位保留黑色0，显式palette把非首黑色改1；partial BGR只标完整可用triples，遇引用未知颜色拒绝。decoder安全限制与源不安全输出不同；绘制只覆盖正signed16尺寸、4对齐宽度、普通完整sprite，不猜padding/残留scratch。catalog可选includeImages保留group/offset/length/origin/size并接archive范围；组合为RGBA普通翻转/视口裁剪/priority升序、同priority ordinal降序。原结构RD模型不重写为新profile。

**验收/接续：** 315RD/1CGP/23palette/4sprite/100frame原创Python参考；28新/1012完整Node、2neutral、7工程通过，3新微信各94输入/11输出/0外部导入。27854条本地资源与独立Python摘要相符，27820接受/34越界安全拒绝，288帧RGBA摘要抽样一致；708B CGP仅消费672B，不导出官方像素。oracle首次元数据相对路径错误，修oracle路径后通过，产品未改；保留失败日志。矩阵rev56为29项/16observed/13unknown。完整REA导出658记录/快照已保存并关闭；无VM/原程序/WER/CDB、账号/官服或原生IDE动作。下一步动画时间线/实体资源绑定→真实scene/input/frame/资源host，再补特效/场景条件/party/战斗/business/auth及现行、实际三端/官方可玩；完整目标active/incomplete。[验收](validation.md#stage159)、[完整审计](../analysis/game-legacy-render-v1/goal-audit.json)。

<a id="stage158"></a>
## stage158：实际碰撞、路径与普通本机移动

**需求/前检：** 保留REA登录器→独立实现→REA游戏→实现可玩游戏及网页/移动网页/微信/官方完整目标。stage157是真实进展；本轮2099前清单逐项相符，21候选文件修改前备份，固定37c4原件与449记录导出/快照身份匹配。实际读取Router加载合同、REA原生/保留证据指南、当前需求和actor/scene合同。requirement-index既有缺项沿用本需求真源，不重复无变化查询/写外部知识库。目录无Git，以清单/备份保留改动；本节和实施计划在分析/代码前建立，最终更新实绩。

**事实/实现：** 新117REA记录/52唯一dossier，52条指令、32B方向表读取和文件映射共54检查匹配，另5处data/undecodable引用及6处procedure-resolve；原生目标未执行。碰撞4607c0/4648f0/4603a0、图形元数据452460/452f40/452ee0与primitive映射463e60、路径462650/462520、普通本机460f20/462110/461660、补图460820/461e90、交互461960/461ac0及转向462410闭合。大renderer463ea0的value-flow截断保留，只使用直接collision/wait调用链；不宣称完整绘制。完整私有导出/新快照保存且REA已关闭。[源核对](../analysis/game-legacy-local-movement-v1/source-check.json)、[目录](../analysis/game-legacy-local-movement-v1/navigation-catalog.json)、[合同](../analysis/game-legacy-local-movement-v1/implementation-spec.json)。

新增graphics/navigation/local-movement纯核心；40B文件→32B运行元数据、源class/footprint、非对称51×51窗口、真实方向优先/斜步/合并与xy fallback、100路径容量、2步批次、float32本机运动、地图等待/请求、before/after-entry地块事件和严格500ms转向均有源。world显式配置源gates/selector/sequence，要求已知own actor/speed/位置/cache；不会从认证或未证wire字段猜上下文。当前只普通无party、无正值arrival-countdown效果；native UI/附件/场景条件生命周期及响应语义仍未完整实现。

**验收/接续：** 原创8primitive、41collision、149path、32lookahead、32selector及18条403帧local轨迹；37新增/984完整Node、2neutral/7工程通过。隔离Python TCP两种场景在targeted/full各一次（总4轮），每轮核2实际请求；普通场景6消息、缺块场景9消息，3公开原创文件即可复现，无私有原件依赖。首turn测试前提错误：一个障碍仍可对角绕行，正确产生移动；改为真实部分路径到达后的转向测试，仅修夹具并保留35/36失败记录，另加native图形count+10容量边界，最终37通过。三新微信工程93输入/11输出；矩阵rev55为28项/15observed/13unknown，旧27项状态保持。下一步继续实际图形/动画/palette/renderer和input/scene上下文/host，其他业务/战斗/control auth及当前版本/实际平台/官方接受。无VM/原程序/WER/CDB、账号/官服或原生IDE动作；不重放已用停止点或重复索取无账号/PDB，完整目标active/incomplete。[验收](validation.md#stage158)、[完整审计](../analysis/game-legacy-local-movement-v1/goal-audit.json)。

<a id="stage157"></a>
## stage157：实体归属、普通远端移动与源移动消息

**需求/前检：** 原始四步和网页/移动网页/微信可玩及官方验收目标保留。2077项前清单逐项相符，19候选文件修改前备份；旧版37c4原件及340记录导出/快照匹配。已读Router加载合同、REA保留证据流程、当前需求及scene/state合同。requirement-index既有缺项沿用本需求真源，不重复无变化查询或写外部知识库。目录无Git，以清单/备份保留原改动；本阶段需求和实施计划在新代码前建立，现更新实绩。

**事实/实现：** 新109条REA记录、48dossier/47唯一入口；35条指令、13读取、8映射共56检查匹配PE，另有2处typed data引用。4f2bb0经4ff570设置own ID；4f16d0按tab与字段11/6/4选择character/graphic/value三型；4f2010的action在第4列、facing第5列，comma空项停止。远端注册表1000，与独立本机指针分开；重复记录更新公告位置，不直接移动已有body。动作队列/插值、方向65表、投影及显式资源ID模式都有源。未定义回调43ba10使用现有GNU范围反汇编补充，484条指令逐字节匹配、479条非call CFG可达，不伪称Ghidra函数dossier。完整私有导出/快照保存，会话关闭。[源](../analysis/game-legacy-actors-v1/source-check.json)、[合同](../analysis/game-legacy-actors-v1/implementation-spec.json)。

新增actor/motion/data纯核心，world处理context/list/action/removal、场景远端清理和四个已证local globals桥接；显式advance只推进普通远端，encodeMovement用调用方origin/路径字节与当前scene字段11，不虚构寻路或本机预测。未知初始本机速度/资源模式保持null，local网络display因碰撞依赖保持未知；party/ride/附件、条件flags/local reset及renderer仍未完整模拟。

**验收/接续：** 50list/13action/9remove、466方向/44移动轨迹895帧/637资源/23投影原创Python向量；33新增/947完整Node、2neutral/7工程通过。隔离原创TCP两轮各验证1移动请求、10消息/2scene/4actor/2action/2remove，三新微信工程90输入/11输出。修复实际负数截断-0差异；neutral比较器曾保留跨realm数组原型，修正适配器后通过，原失败证据保留。矩阵rev54新增实体/普通移动项，旧26项状态保持。下一步实际碰撞/路径/本机预测、资源动画绘制、战斗/其他业务与控制auth，独立比较当前版本并接游戏host/平台/官方验收。无VM/原程序/WER/CDB/账号/官服/原生IDE动作，不重放停止点或重复索取已答缺失账号/PDB；完整目标active/incomplete。[验收](validation.md#stage157)、[审计](../analysis/game-legacy-actors-v1/goal-audit.json)。

<a id="stage156"></a>
## stage156：场景初始化、地图上下文与状态增量

**需求/前检：** 原始四步、网页/移动网页/微信可玩及官方验收范围不变。stage155为实际地图链路progress；2057项前清单相符，19候选路径备份，37c4与293记录导出/快照身份重核。已读项目当前目标、stage155需求/源分析、Router加载合同及REA保留证据流程；requirement-index既有缺项沿用当前需求真源，不重复无变化查询/写外部知识库。目录无Git元数据，以清单/备份保护原改动。本节与合同在代码前建立并以最终结果更新。

**事实/实现：** 新47REA记录/17唯一函数，17指令/7读取/6映射匹配；default-C256个分类表词、4对inner转义、两条共48槽metadata可重提取核对。4ef870经缓存准备/上下文/位置链，参数8号索引是校验mode，头+4/+8来自6/7号索引；identityA2强制重建、identityB0跳过准备。4ef9d0标签及4efad0/4f0000的mask选择、数值与字节更新有源，游戏属性名未猜测。[源核对](../analysis/game-legacy-scene-v1/source-check.json)、[状态目录](../analysis/game-legacy-scene-v1/state-catalog.json)、[实施合同](../analysis/game-legacy-scene-v1/implementation-spec.json)。

新增scene/state/catalog核心及world协议工厂；世界消息自动建当前缓存，校验/补图沿既有实现，标签/状态快照独立拥有字节。原raw入口保留类型消息/显式缓存行为；native guard/viewport/actor/resource/renderer、持久cache路径/variant不模拟。初始未观察状态为null，保留未选槽及超长字节字段，source包裹存储不仿真。

**验收/接续：** 21场景/119状态/20标签原创向量，16新增/914完整Node、2neutral/7工程通过；隔离Python TCP两轮各12消息、3场景/3状态、1补取及补丁后校验。首TCP夹具零缓存和零远端校验相等，未触发请求；改为独立补丁后校验，仅改夹具重跑，失败证据保留。三新微信工程87输入/11输出；矩阵rev53为26项/13observed/13unknown，旧25项状态保持。下步追actor/属性语义、资源绘制/移动战斗/剩余89业务、完整控制认证及host缓存，再验当前/实际平台/官方。无VM/原程序/WER/CDB、账号/官服或原生IDE动作，不重放停止点或重复索取无账号/PDB；完整目标active/incomplete。[验收](validation.md#stage156)、[完整审计](../analysis/game-legacy-scene-v1/goal-audit.json)。

<a id="stage155"></a>
## stage155：实际地图缓存与协议业务子链

**需求/前检：** 原始四步与网页/移动网页/微信可玩、官方验收目标保持；stage154为文本/协议及网络位置投影的进展。2041项清单逐项相符，17候选路径备份，37c4原件与247记录导出/快照身份匹配。已读Router「加载合同」、REA保留证据工作流、当前需求和资源/协议接口；requirement-index既有缺项沿用，不重复无变化查询、不写外部知识库。本节与实施合同在分析/代码前建立，最终结果在此更新。

**事实/实现：** 新46REA记录含19函数、17指令/4读取/6映射；27项源字节/映射与512 primitive表项全部匹配。沿4ef510→460240和4ef580→45f850核实三层缓存、固定校验和补丁。4601f0反编译漏算术，两个大栈帧签名失真，改以原汇编、cdecl栈偏移与表为依据。两种特殊binary的高层目的未明，没有把它们推定为地图。[源核对](../analysis/game-legacy-world-v1/source-check.json)、[实施规格](../analysis/game-legacy-world-v1/implementation-spec.json)。

shared新增纯字节地图缓存、裁剪/校验/补丁和显式缓存状态；协议增加缓存安装/复制及地图effect。校验失败仅提供source-bound补取命令描述符，不自动联网。只对完整有界三层/精确区域cell数更新；缺失/未初始化或越界危险域拒绝，第三层写入保留源OR0xc000。原native/厂商依赖字节未改。

**验收/接续：** 32矩形/96校验/5补丁原创向量，15新/898完整Node、2neutral/7工程通过；隔离Python TCP在targeted/full两轮各核1补取请求、2notice/1patch/1不可用cache。三新工程84输入/11输出。矩阵rev52为25项/12observed/13unknown，旧24项状态保持。下步追缓存初始化、场景/剩余93业务、actor/renderer/移动战斗与完整控制认证，再验当前版本/平台/官方；不重放已用诊断/IDE停止点或再问无账号/PDB。本轮无原程序/VM/WER/CDB、真实账号/官服或原生IDE动作，完整目标active/incomplete。[验收](validation.md#stage155)、[完整审计](../analysis/game-legacy-world-v1/goal-audit.json)。

<a id="stage154"></a>
## stage154：旧版文本目录、协议状态与位置意图

**需求/前检：** 原始四步及网页/移动网页/微信可玩、官方验收目标保持；stage153为实际payload/bootstrap实现进展。2021项清单逐项一致，16候选路径备份，37c4原件与129记录导出/快照匹配。已读Router「加载合同」、REA保留证据工作流、当前需求及协议规格；requirement-index既有缺项沿用，不重复无变化查询、不写外部知识库。实施前合同在本轮分析/代码前建立。

**源与目录：** 新118REA记录含86dossier/85唯一入口，一次4ff680内址返回已有4ff5a0，不重复计唯一函数。15指令/11读/5映射匹配；60个已保留formatter调用者全部分析，复用大dispatcher完整证据提取104分支/最多17参数，164标签原字核对，未重新请求大分析。7个无效果别名为507690 RET，另有一条reset清c60528；主循环忽略dispatcher返回并清token表。完整导出/快照保存、会话关闭。[源核对](../analysis/game-legacy-message-v1/source-check.json)、[目录](../analysis/game-legacy-message-v1/dispatch-catalog.json)。

**实现：** shared新增冻结目录、base62/字节转义、60command编码/104分支解码、两种长度binary和pull协议对象。保留C前缀/空与缺失0/empty/额外计数、未知转义丢跟随字节、高字节第二保护值变f等有损事实；INT32_MIN写入和dangling高字节等原生不安全域明确拒绝。特殊binary先于bootstrap，ready时112B走普通正文；reset等待新材料期间仍用旧codec，成功替换再清旧材料。网络位置意图按源转换×64 float32、原第三方向候选码/零motion；actor条件回写与其他业务未模拟。无UI/网络端口或真实认证接线。[合同](../analysis/game-legacy-message-v1/implementation-spec.json)。

**验证与接续：** 113整数写/265读/1030字节field/8反转义/104接收/60发送/4binary原创向量，17新/883完整Node、2neutral、7生成工程通过。隔离PythonTCP每轮62回复、104分支及更新材料/投影两次通过；三新工程83输入/11输出。neutral脚本首次多一括号、模块未加载，修测试后仅重跑该项，失败回执保留。矩阵rev51另列旧版消息观察，原23项状态不变。下步追实际binary/map与95其他业务、actor/renderer/移动战斗和完整控制认证，再验当前版本/平台/官方；不重放已用诊断、IDE停止点或再问已无账号/PDB。无原程序/VM/WER/CDB、账号/官服或原生IDE动作，完整目标active/incomplete。[验收](validation.md#stage154)、[完整审计](../analysis/game-legacy-message-v1/goal-audit.json)。

<a id="stage153"></a>
## stage153：旧版正文转换与初始材料子链

**需求/前检：** 原始四步及网页/移动网页/微信可玩、官方验收目标保持。stage152为真实外帧实现进展；1991项原清单逐项匹配，16个候选路径已备份，37c4及快照/导出身份相同。已读Router「加载合同」、REA保留证据工作流和当前需求；requirement-index缺项沿用，不重复无变化查询、不写外部知识库。本轮实施前合同已建立。

**源与依赖：** REA新增43记录/16dossier，14指令/8读/4映射相符；405110/4051f0重排/XOR、404db0初始块及SHA/AES辅助链闭合。SHA压缩大dossier已完成但MCP超限，沿retained读首7000/44068字符，完整私有文本用于64轮常量顺序和尾状态核对，value-flow截断保留。两表与128B固定派生参数匹配原件；导出/快照已保存，REA关闭。补入@noble/hashes/ciphers2.4.0的12个原始闭包/许可/包文件及两份provenance，SRI/单文件hash核验，不运行安装脚本或改第三方源码。[源核对](../analysis/game-legacy-transform-v1/source-check.json)、[实施合同](../analysis/game-legacy-transform-v1/implementation-spec.json)。

**实现：** 新shared codec复制64非NUL材料，执行8B重排/循环异或；源NUL特例、至多8尾0x11删除和空encode保留，明确不是任意字节的无损往返。32760预算与外帧有符号长度正域对齐。112B bootstrap只接受64B结果分支，8192轮SHA256派生、无填充AES256-CBC与ciphertext的HMACSHA256；本实现先验tag再解块，失败不输出候选。close清拥有缓冲，不输出inspect密钥；有效tag不代表官方身份。index新增导出，既有页面/传输未接游戏协议。

**验证/纠正：** 24普通/6bootstrap/2拒绝/5任意wire原创向量、公共NIST/RFC基础向量、新16/完整866Node、2neutral及7生成工程通过；三新微信工程各80输入/11输出。最初依赖闭包扫描误读注释中的示例import，修为实际语法且复用已核缓存；首专项15/16，NIST夹具密钥63hex位导致31B，修正64位并加偶数hex检查，产品无变。对端复制到无私有材料的独立临时目录，targeted/full两次通过。neutral7次派生批次约8.0s仅为检查耗时，未验UI调度/取消/设备性能。[测试](../analysis/game-legacy-transform-v1/test-results.json)。

**接续：** 矩阵rev50新增旧版payload观察，原22项状态不变。下步沿37c4已有escape/base62/分发消费者闭合实际消息与状态/移动/战斗，独立比较现行版本，再做host调度及平台/官方接受。无原程序/VM/WER/CDB、账号/官服或原生IDE动作，不重放已用停止点、不再索取已答缺失的账号/PDB；完整目标active/incomplete。[完整审计](../analysis/game-legacy-transform-v1/goal-audit.json)。

<a id="stage152"></a>
## stage152：REA闭合旧版外帧，并实现独立字节核心

**需求/前检：** 原始四步及网页/移动网页/微信可玩、官方验收目标保持。1975项上一阶段清单逐项匹配，16个候选路径修改前已备份。已读Router「加载合同」、REA主流程、当前需求及stage151首批消费者/快照；requirement-index缺项沿用，本节及实施计划在分析/代码前建立，不写外部知识库。

**实际源：** 固定旧版SE SHA37c4dfd2…4013bd，复用39记录，新增47记录/17dossier；10指令、4读和3映射全部匹配原件。接收4ee330→4ee470、发送4fce00以及4edef0循环闭合AFEF/LE16/opaque/EFAF外帧；原PE按序号导入网络函数，不把缺少名称当没有网络。4ee380不是已定义函数，失败选择没有dossier；超大4f8a40完整证据保留，仅查看6400/81694伪代码字符，value-flow截断不掩盖。完整私有导出/新快照保存并关闭REA。[源核对](../analysis/game-legacy-network-v1/source-check.json)、[实施规格](../analysis/game-legacy-network-v1/implementation-spec.json)。

**实现：** 新shared纯字节profile/编码器/pull reader，256KiB队列、独立输入/输出所有权、首AF扫描与8字节门槛；小端字长接收原生MOVSX，因此本实现0..32767，坏尾/高位长度终止清空，明确不同于原生阻塞/未定义路径。payload已经转换后的wire字节保持opaque，未实现405110/4051f0、key/认证或玩法。index新增导出，不改变现有launcher和页面流程。

**验收与接续：** 原创24Python向量、新12/完整850Node、2portable及7生成工程通过；三新微信工程各71输入/11输出、0外部导入。报告聚合曾误按项目根读取输出app.js，按build目录相对路径修正，无产品修复或重跑已通过测试。矩阵rev49新增独立旧版观察项，原21项状态不变。无VM/原程序/WER/CDB/账号/官服或原生IDE动作，不重放已用诊断；完整目标active/incomplete。下一步固定37c4追payload/key/text和业务消费者，再独立比较现行版本，不再询问已答缺失的账号/PDB。[验收](validation.md#stage152)、[完整审计](../analysis/game-legacy-network-v1/goal-audit.json)。

<a id="stage151"></a>
## stage151：新旧版主游戏材料与首批真实消费者

**需求/前检：** 完整原始四步及网页/移动网页/微信目标保留；stage150为实际实现进展。本轮1965项清单逐项匹配，最终15个文档/矩阵候选路径备份。已读Router加载合同、需求和10月30日材料记录；requirement-index缺项沿用，本节在新材料/分析前建立，不写外部知识库。

**实际材料/能力：** 当前两份51700B补丁清单与10月30日SHA相同，现行EXE声明未变。主站下载页另关联历史6.0 Wise包，FTP SIZE=1,582,593,033/MDTM=20130427023541；完整传输按实测速度不能在600秒预算完成，169.926秒时正常中止自有下载，保留30,343,168B头部，进程exit130。Inno不支持、7-Zip只识别内嵌gzip，不能当完整目录。按固定commit构建REWise0.4.0-dev，Git blob逐项匹配、原许可保留，只在build，不全局安装；读得Wise9脚本与2369文件条目。[当前发布观察](../analysis/game-release-current-v1/release-observation.json)、[材料与范围](../analysis/game-release-current-v1/legacy-acquisition.json)。

**精确成员：** 按脚本给定数据偏移165514和两项范围，普通REST/RETR仅读连续1,457,157B。两个raw DEFLATE均完整结束、精确输出、脚本和尾CRC一致，得到cg_se_6000.exe1,569,280B/SHA37c4dfd2…4013bd及cg_item_6000.exe2,213,376B/SHAce3fd800…3126a9；.text文件大小1,225,216/1,840,640B。完整安装包SHA未知，不将片段称完整载体、不恢复游戏保护负载。两新成员与现有6e2ff/06447/9baa分别绑定。

**REA事实：** 对37c4旧版由Ghidra12.1.4取得39记录/8函数；45cc90配置读取与映射消费、45cfd0参数/资源名消费、457c30选择路径映射消费、44eba0资源路径组装及4个CRT辅助函数闭合。Config游戏读取至多255字节/首换行并NUL，再直接追加输入字符串；不同于Config.exe的Read256边界。gid:/glt:来自命名映射文本并在两路径清前256B；实际身份/协议和运行效果不由名称推导。8指令/4读/4源映射匹配原件，完整私有证据和快照已导出，会话已关闭。[REA与源字节核对](../analysis/game-release-current-v1/source-check.json)、[首批静态合同](../analysis/game-release-current-v1/static-contract.json)。

**验收与接续：** 原创成员核验器1正/6负夹具及两真实成员、全部源锚点通过；本轮未改产品代码或重跑JS/构建，stage150的838/2portable/7工程仍是其历史证据。没有VM/游戏/WER/CDB/账号/官服会话或原生IDE动作。下一步沿新旧版来源追socket/帧和资源/业务消费者，独立比较版本后才制定当前兼容实现；不重复下载未变现行EXE、已用诊断或索取已回答缺失的账号/PDB。完整目标active/incomplete。[原创核验器](../analysis/game-release-current-v1/verify_source.py)、[验收](validation.md#stage151)、[完整目标审计](../analysis/game-release-current-v1/goal-audit.json)。

<a id="stage150"></a>
## stage150：压缩图形命令结构与未知位置保留

**需求/前检：** 原始REA登录器→实现→REA游戏→实现及网页/移动网页/微信目标完整保留；stage149为实际进展。1949项清单逐项匹配，16个候选路径备份。已读Router加载合同、当前需求/消费者矩阵、资源格式与原创RD实验；requirement-index缺项沿用，本文件和实施合同在代码前建立，不写外部知识库。

**实际实现：** 新增无平台依赖的RD v1/v3结构模型，8类已见命令按前缀计数、repeat先值后扩展长度，完整消费且精确展开；literal/repeat与C/D/E未知位置各自有known mask，跨像素/候选调色板边界保留。只有规范字节的事实，不赋颜色/alpha/方向语义；0x2未被既有语料模型观察，本profile拒绝。32MiB输入、4Mi像素、768B候选palette预算，原始raw API保留。[实施合同](../analysis/game-rd-runs-v1/implementation-spec.json)。

**新证据与限制：** 四份图形/索引hash重新匹配，独立Python/JS在27,785条压缩记录中27,751条接受、34条同ordinal越界拒绝，32份旧零占位摘要样例仍一致。接受记录累计142,343,812个未知像素位置、1,163,863个未知palette位置，不能当完整颜色还原。第三方查看器固定commit/文件摘要仅作其自身行为对照，不是固定游戏消费者，不复制其代码或作为依赖。无新增REA native查询；既有游戏业务缺口不变。[源与限制](../analysis/game-rd-runs-v1/source-check.json)、[完整差分摘要](../analysis/game-rd-runs-v1/corpus-comparison.json)。

**验收/接续：** 48份原创Python编码、9新/838完整Node、2无DOM及7生成工程通过，三个微信工程各70输入/11输出、0外部导入。完整原目标active/incomplete：还需主游戏真实业务合同、renderer语义与平台/官方接受；不以结构解码当可玩。没有VM/原程序/WER/CDB/账号/官服或原生IDE动作，账号/PDB不可用答复及已用诊断/原生停止点保留。[测试回执](../analysis/game-rd-runs-v1/test-results.json)、[完整目标审计](../analysis/game-rd-runs-v1/goal-audit.json)。

<a id="stage149"></a>
## stage149：REA追踪游戏配置器的Config.dat读写

**需求/前检：** 原始四步及三平台/官方目标保留，stage148为实际进展。1934项清单逐项相符，16个候选路径备份；已读Router加载合同、需求、game-static stage138/135和矩阵未知项，沿既有REA原生工作流。requirement-index缺项沿用，本文件和合同于代码前建立，不写外部知识库。

**实际源分析：** Config.exe61440B/SHA9389add9…efa0f7d与23B数据重新匹配。REA6.7.0/Ghidra12.1.4取得34条成功记录、4函数dossier、14条指令/6处字节读取/3源映射；5资源payload重核，DIALOGEX13控件解析恰好消费792B。部分callback未被Ghidra定义，3次函数选择错误保留，改用已有REA GNU objdump静态反汇编，43条回调指令匹配原件，无重复原查询或分析器配置变更。[源/限制](../analysis/game-config-v1/source-check.json)。

**实现：** 写入顺序固定为前导空格、3Ddevice:1..4及各开关空格，12..52B，不写NUL/换行；原数据23B与此规范输出一致。shared新增默认状态、精确Boolean模型保存和有界reader：只复制前256B，首NUL内终止，否则采用独立有界EOF，按首个大小写敏感子串/ASCII十进制前缀读取；缺失、失败、溢出/非法档位拒绝，不伪造原生栈/解析未定义状态。[合同](../analysis/game-config-v1/implementation-spec.json)。

**验收/剩余：** 64原创保存/31读取向量、7新/829完整Node、3无DOM bundle和7生成工程通过；三个微信工程各69输入/11输出。配置字节可进入既有v2资源/缓存，但宿主设置界面、renderer映射、主游戏实际配置/业务消费者、设备与官方接受未实现或未验。无原配置器/游戏/WER/CDB/VM/账号/官服运行，保留未获账号/PDB答复与原生停止点。完整目标active/incomplete。[完整审计](../analysis/game-config-v1/goal-audit.json)。

<a id="stage148"></a>
## stage148：微信资源候选持久化与显式恢复

**需求/前检：** 保留原始四步及三平台/官方目标；stage147为实际进展。本轮1918项清单逐项相符，21个候选路径已备份。已读Router加载合同、需求、资源快照、目录双slot与宿主生命周期；requirement-index缺项沿用，本文件和实施合同在代码前建立，不写外部知识库。

**实际实现：** 新原创MOLIRES1封套以48B头/canonical ASCII JSON元数据/原文件字节保存现有资源v1/v2；元数据MD5和各文件MD5检查损坏，不认证来源。1024文件/32MiB每文件/64MiB总预算保留。提取目录双slot状态机给资源复用；固定目录两slot、回读、CAS与同上下文互斥，原目录格式/API保留。[格式](resource-formats.md#stage148)、[合同](../analysis/launcher-wechat-resource-cache-v1/implementation-spec.json)。

**宿主与生命周期：** 可选resourceCacheProfile默认关闭、无启动IO。检查后只有精确目录/游戏/区域/Galaxy/来源绑定才能恢复；恢复仍为候选，重新明确选择，恢复数据同时可作下一清单base。保存只接受已选择快照与检查过的revision；隐藏/换来源清内存与preview，迟到不能复活。写已发出后结果未知，缓冲/锁保留到原生回调，不自动重试/删除；初始化所选登录器、输入和会话不入缓存，资源不执行。

**验收/纠正：** 独立Python六份封套和程序生成64MiB/1024最长路径预期通过；20新/822完整Node、7生成工程通过。真实原创文件在新宿主及新JS环境恢复后无HTTP/文件选择即完成原创Python对端交换，下一清单只取清单。保留三次失败证据：测试计数字段错误、重放已完成rename迁移被原消费者正确拒绝，以及真实的超时续接缓冲清理遗漏；最后补清理并重构建/回归。[测试](../analysis/launcher-wechat-resource-cache-v1/test-results.json)、[排障](known-issues.md#stage148-resource-cache)。

**剩余：** 实际原生存储/配额/内存、跨worker/进程及断电、AppID/设备/HTTPS/官方与原游戏业务消费者/可玩均未验。无新增REA/VM/游戏/CDB/账号/官服或原生工具尝试；完整目标active/incomplete，不能用本机文件恢复当正式兼容。[完整审计](../analysis/launcher-wechat-resource-cache-v1/goal-audit.json)。

<a id="stage147"></a>
## stage147：按当前登录器证据分离补丁进程策略

**需求/前检：** 沿用REA登录器→独立实现→REA游戏→独立游戏及三平台完整目标。stage146的1905项清单本轮逐项相符，21个候选路径已备份。实际读取Router加载合同、REA主流程/原生指南、需求和相关实现。知识库requirement-index缺项沿用；本文件和实施合同在代码前建立，不写外部知识库。

**实际分析：** 重用当前c82登录器和195补丁器匹配材料及stage113快照；新增30条REA记录（7个函数dossier）、14条指令原件字节与4处源映射核验。原始GetExitCodeProcess短名未解析，改按返回的完整名称/引用找到timer。随后为未查过的命令辅助函数和路径辅助函数两次重开自有快照，最后均已导出并关闭；未运行目标。[源与限制](../analysis/launcher-current-patch-v1/source-check.json)。

**实现与纠正：** 当前435a10→431f90始终引用并转义备份路径；当前435ad0会规范化/检查路径，根目录不重复添加分隔符。因此不能把旧601b原始命令/目录字符串当当前等价。独立转义器、规范ASCII目录+basename的当前计划、UInt32轮询和退出数据已接入；保留旧默认，Web按runtime sourceProfile、微信固定当前。HTTP仍顺序单来源，无自动重试；资源缓存绑定/格式未改。[实施合同](../analysis/launcher-current-patch-v1/implementation-spec.json)。

**验收/接续：** 10新/802完整Node、5生成工程通过，含370命令向量/Python stdlib交叉核验、22轮询、36退出组合、实际本机relay/ZIP/原创对端。三个工程65输入/11输出且0外部导入。[测试](../analysis/launcher-current-patch-v1/test-results.json)。当前计划的ASCII路径子集更窄，不实现完整MBCS/Windows目录存在性或规范化，转义器输出不证明路径可用。无新VM/游戏/CDB/账号/官服或原生IDE动作；资源持久化、平台和游戏消费者/可玩仍未完成，完整目标active/incomplete。

<a id="stage146"></a>
## stage146：将已证补丁准备接入微信资源候选流程

**原需求/前检：** 保留四步及三平台/官方接受目标；上一轮145为实现进展。本轮1880项清单逐项相符，21个可能修改路径已备份。实际读取Router「加载合同」、stage145需求、补丁计划/准备器、PUK3源政策、资源快照、ZIP/路径及原有夹具。知识库requirement-index缺项沿用记录，本文件仍是当前需求真源；本轮不新增REA查询或游戏字段。

**完整切面：** 将现有目录补丁计划/顺序下载/ZIP/摘要候选逻辑提取为无平台依赖入口，Web默认保持；微信绑定既有native HTTP/期限/取消/纯目录codec。原来源为HTTP，微信连接须配置明确的来源→HTTPS桥接route，不自动升级协议/改主机或重试备用。新增仅固定启动配置来源的Node只读relay及loopback启动器，不做公网/TLS部署，桥接真实性与官方兼容不因声明成立。

**资源与宿主：** 可选patch配置含Windows目录元数据、显式pathEncoding、源profile和最多两条受限route；UI明确选择可用来源，保留原sourceOrdinal（不能用过滤后的index代替）。可逐批选择本地ZIP读入内存基础资源，复用现有ZIP与路径/树预算；每包原有64条/32MiB限制，合并仍受1024文件/64MiB限制，冲突不覆盖，明确清除只清本页内存。准备只按既有create/append/replaceto与MD5处理并列候选，明确选择后可复制既有资源快照；不写安装目录、不执行EXE、不视为游戏可玩。

**生命周期/验收：** 输入/确认在导入和准备时清空；配置目录/区域/Galaxy/来源变化及隐藏释放资源/撤销候选，异步迟到不得复活。用原创ZIP/HTTP服务验证Web回归、relay固定来源/路径/CORS/取消、微信API形状及无DOM生成工程，保留原生DevTools停止点，不新增VM/游戏/CDB/账号或官服动作。实际平台/TLS/域名/账号/原游戏仍未验，完整goal active/incomplete。[实施合同](../analysis/launcher-wechat-patch-v1/implementation-spec.json)。

**实际完成：** 已提取原路径/树/预算与补丁计划，顺序准备器增加完整期限/取消/解码/来源字节端口；原Web默认及既有字节规则保留。微信来源映射和固定Node relay、ZIP逐批基础资源、宿主/Page候选选择与旧资源快照复制接通。19新/792完整Node及5生成工程通过，三个本地工程各64输入/11输出且0外部导入。[源与提取核验](../analysis/launcher-wechat-patch-v1/source-check.json)、[测试](../analysis/launcher-wechat-patch-v1/test-results.json)。

**源与纠正：** 旧/tmp两份原件不在，四份私有导出/快照重核相符；项目保留Patcher副本578560B重新匹配195f3afd。旧601b主登录器原件未定位，另有c7ba副本不得等同601b/c82，本轮未增加其原生语义事实。隐藏后来源列表被清空已复现修复；首次生成工程被测试DNS别名返回的真实loopback Response.url拦下，修夹具而保留产品重定向检查，并加强候选选择持续到交换的断言。[排障](known-issues.md#stage146-wechat-resources)。

**接续：** 本轮实现进展，完整goal active/incomplete；后续补资源持久化及实际平台验收条件。relay只是原创建端口/本机运行，不是已部署的官方HTTPS来源；原游戏业务协议/消费者仍缺证据，不能由资源候选推导可玩。旧原生服务停止点保留，不重放VM/游戏/CDB或再问已缺失的账号/PDB。[完整审计](../analysis/launcher-wechat-patch-v1/goal-audit.json)。

<a id="stage145"></a>
## stage145：将原始目录对缓存接入微信宿主

**原需求/前态：** 原始四步和网页/移动网页/微信目标保留，上一轮144为实际实现进展；本轮1863项清单逐项重核相符，18个候选路径已备份。已读Router「加载合同」、stage144需求/接口、现有目录/资源缓存及补丁准备实现。知识库requirement-index缺项沿用准确记录，不重查无变化条目或写外部知识库；本文件为当前需求真源。

**本轮完整切面：** 提取已有纯目录候选校验到shared（浏览器包装保留原默认解码行为），增加原创本地二进制记录：两份原始目录字节、显式编码/兼容开关、revision及整记录兼容摘要，≤2MiB+44B；不存账号、密码、会话或EXE。微信USER_DATA_PATH下只使用明确profile的两个固定slot，读取完整记录后选最新；写非当前slot并回读核验，保留另一完整版本，不宣称原生原子rename/断电持久性。来源身份仍unverified。

**一致性/取消：** 同一JS上下文同路径/profile互斥，expectedRevision冲突不写；完整同revision但内容不同拒绝，单slot损坏可显式报告回退到完整slot。文件是否存在由成功的目录枚举确认，普通访问错误不能当缺失。原生writeFile无abort，写已发出后取消/超时/错误一律报告结果未知，并在原生回调前保留缓冲和互斥；不自动回滚或重试。外部worker/进程竞争及真实设备存储语义仍待验。

**宿主接线：** 可选catalogCacheProfile启用，默认关闭且无自动读写；提供明确检查/恢复/保存按钮。只有HTTP/缓存来源的原始字节对可保存，不把JS文本重新编码冒充原字节。恢复重置输入、确认、选择，按配置编码/兼容策略检查；再次HTTP刷新传实际此前目录字节用于比较，失败不恢复旧可选目录。隐藏/取消阻止迟到状态，已发出保存提示重新检查结果。

**验收计划/范围：** 原创Python独立记录编码、畸形/预算/摘要、两slot破损恢复、CAS/并发/配额错误、取消与迟到写；实际JS宿主/生成工程缓存到目录再到原创对端交换。保留原生DevTools停止点，不重试或改设置；不新增VM/游戏/CDB/账号/官服/发布动作。实现前合同已建立，实际结果见下文；完整目标active/incomplete。[实施合同](../analysis/launcher-wechat-cache-v1/implementation-spec.json)。

**实际完成：** shared纯候选校验提取完成，Web默认TextDecoder包装保留；原创记录和微信双slot端口、host/Page按钮及实际字节刷新比较均接入。22新增/773完整Node、4生成工程检查通过，三个本地工程各57输入/11输出且0外部导入；新JS环境从本机实际测试文件恢复后完成原创Python对端交换，不再次HTTP获取。[源码绑定](../analysis/launcher-wechat-cache-v1/source-check.json)、[测试](../analysis/launcher-wechat-cache-v1/test-results.json)。

**复核纠正：** 首轮边界用例忽略原XML256KiB字符上限，按保留门槛修夹具；2MiB+44只是容器字节上限，并非放宽解析预算。771回归后新增可变options复现：await后重读expectedRevision可能放过起初过期的写；改为开始时复制已知own data选项并拒accessor/额外字段，最终773/4通过。保留失败日志、修前源码hash及完整命令回执。[排障](known-issues.md#stage145-wechat-cache)。

**接续与完整目标：** 本轮为实现进展，goal active/incomplete；继续已证资源/补丁端口与真实平台验收条件。原生服务关闭未重试；文件系统设备/多worker/持久性、官方账号/网络及原游戏消费者/可玩仍未完成，不重放已消费的VM/游戏/CDB，也不再索取已回答缺失的账号/PDB。[完整审计](../analysis/launcher-wechat-cache-v1/goal-audit.json)、[交付](../analysis/delivery-manifest-stage145.json)。

<a id="stage144"></a>
## stage144：将已证初始化与有界 HTTP 目录接入微信宿主

**本轮需求与范围：** 沿用原始“REA 登录器 → 独立实现 → REA 游戏 → 独立游戏”及网页/移动网页/微信三端目标；本切面补齐 stage143 宿主缺少的初始化，不新增协议字段。复用 current 初始化的自摘要、定位器、包候选、目录请求顺序、rtm 及原始字节比较；以显式平台端口替换浏览器专属时钟、取消与文本解码。空配置继续无 IO，更新包仅校验候选，不在微信执行或替换 EXE。

**执行前证据与合同：** stage143 的1840项清单已逐项重核，20个可能修改路径已备份。实际读取 Router「加载合同」、本需求与相关实现/接口定义；此前知识库 requirement-index 缺项仍未修订外部知识库，本文件为当前需求真源。官方微信类型列明 redirect manual 从3.2.2起仅支持 Android/iOS/开发者工具，适配器据此检查实际能力并保留域名检查。目录解码需完整 UTF-8/GB18030；先核对 WHATWG 算法、数据及许可，不将 windows-936 凭据编码当作完整 GB18030。[实现合同](../analysis/launcher-wechat-bootstrap-v1/implementation-spec.json)。

**本地输入接线：** 配置只增加可选 bootstrap（显式 HTTPS DNS 来源、五个完整地址、目录编码、超时），不嵌入 EXE 或凭据。用户点击加载后通过 chooseMessageFile 选择一份本地文件，校验文件大小/类型，按显式长度有界只读并复核大小，随后计算实际字节摘要；文件路径不进入视图/日志。取消或隐藏使选择/读取回调失效；文件选择和只读 API 不提供原生 abort，不能宣称能关闭原生对话框或取消底层读取。未提供目录时允许 XML 双 null，只有完整验证的新目录对才能选择；不自动请求。

**验收计划：** 原创有界 HTTP 夹具检查重定向、状态、分块/长度、超时取消与迟到回调；纯解码器检查完整映射/范围及畸形输入；现有浏览器回归与微信宿主实际接线、无 DOM 生成工程检查。只在本机原创服务上测试，不连接官服或输入真实账号。现有开发者工具明确关闭服务端口，保留 stage143 原始停止点，不重复请求或改变工具安全设置；实际微信/手机/官方/可玩游戏仍待验收。

**实际完成：** 微信 HTTP/本地文件/纯解码端口与宿主按钮已接入；现有 bootstrap 增加完整平台端口，浏览器保留默认实现；独立 HTTP 错误/预算模块避免微信导入 DOM 依赖。新增32/完整751 Node与4生成工程检查通过，三个独立本地工程各54输入/11输出。全部23940双字节、1087996有效四字节指针及1112064 Unicode标量与当前Node/ICU一致；畸形/预算/取消/重定向也有检查。[源码绑定](../analysis/launcher-wechat-bootstrap-v1/source-check.json)、[测试](../analysis/launcher-wechat-bootstrap-v1/test-results.json)。

**纠正与交付：** 联调复现配置快照丢失allowBareAmpersands，补保留并验false/true；两处测试夹具分别修正错误BOM指针与缺少必需EXE字段。独立HTTP模块的新浏览器ESM依赖同步加入三个夹具的精确路由并实际HTTP检查，未扩大通配服务范围。最初20个候选加4个相关路径共24备份；旧1840项除本轮明确路径外保持。[已知边界](known-issues.md#stage144)、[交付](../analysis/delivery-manifest-stage144.json)。

**交付检查纠正：** 构建linked notice检查发现生成器误截到引言内BSD短句，未包含完整正文；改为精确独立标题并要求许可条件/免责声明，重生成后逐份匹配完整正文。源LICENSE一直完整，最终751Node/4生成工程在此次重生成后再通过；保留错误notice及检查摘要，没有将首次检查失败当交付成功。[来源/许可审计](../analysis/launcher-wechat-bootstrap-v1/source-check.json)。

**接续/完整目标：** 本轮为实际实现进展，goal active/incomplete；继续微信资源/补丁与目录缓存的已证端口，实际开发者工具/设备/AppID/域名/文件选择生命周期仍受原生停止点与验收条件约束。没有新增VM/游戏/CDB/账号或官服动作；原游戏仍缺可绑定业务消费者，不能用目录/构建代替可玩。已有无账号/PDB答复和已消费诊断不重放。[完整审计](../analysis/launcher-wechat-bootstrap-v1/goal-audit.json)。

<a id="stage143"></a>
## stage143：将微信会话模块接入实际宿主工程

上一轮142是实际实现进展，已补微信TCP/CSPRNG/取消/期限端口，709Node和1bundle专项通过；原完整目标仍未完成。本轮1817项交付修改前相符、13份候选前态已备份。沿用已读stage142接口/构建说明及shared目录选择、四页阅读和ASCII输入合同，不重复同一REA分析或补猜游戏字段。

**实施前切面：** 新增微信宿主控制器与App/Page/WXML工程，明确载入本地配置XML、选择游戏/区域/分组、四页显式阅读、当前会话和候选选择。复用现有纯目录/阅读/选择逻辑和stage142入口；私有输入不写setData/日志/存储，取消/隐藏/卸载清空并阻止迟到结果。默认配置空且不连接服务，构建只将明确配置放入build工程，不嵌入账号/AppID秘密；保留原生域名校验，不把游客或Node夹具当官方认证。

**验证路线：** 先记录支持范围与意义明确的host/lifecycle用例，独立原创Python核实际页面控制器交换。再构建新输出，利用本机现有微信开发者工具公开CLI尝试导入/编译/模拟器；工具拒绝/新安全设置或登录依赖如实记录，不改安全设置、借用其他项目AppID或登录凭据。无上传/发布/官方服务器/VM/游戏/CDB动作。真实微信手机、HTTP目录/资源、账号和原游戏消费者/可玩仍分层未完成，完整goal active/incomplete，不复用旧blocked计数。

**实际实现：** 微信host复用纯XML/区域/Galaxy原ordinal、显式ascii/windows-936/utf-8编解码、阅读及current会话；App/Page/WXML将真实控制器接入。输入不进setData/日志/存储，隐藏/卸载取消并阻止迟到结果，输入/目标变化撤销确认，native输入以key重建清除。默认/原创配置分别生成本地工程，域名校验true/游客占位未被工具验证；不生成游戏假入口。[支持范围](../analysis/launcher-wechat-host-v1/implementation-spec.json)、[接入](../wechat/README.md#stage143)。

**实际验收/限制：** 10项新增、完整719Node及2项无DOM生成工程检查通过，独立Python核正常/错误组交换及选择门槛。测试修正了CJS夹具共享作用域；新增断言先复现输入变化后旧确认提示，修产品后全回归通过。官方SDK0.13.0及现有CLI实际尝试一次，明确服务端口关闭，0连接/渲染/截图；按AGENTS不修改工具安全配置，保留准确未验收状态，不把JS构建或游客占位当原生接受。[测试](../analysis/launcher-wechat-host-v1/test-results.json)、[工具回执](../analysis/launcher-wechat-host-v1/native-ui-audit.json)、[操作知识库](known-issues.md#stage143-wechat-cli)。

**接续与完整目标：** 本轮为实际宿主实现进展，完整goal active/incomplete；下一步接现有已证初始化/HTTP目录与资源到微信端，原生WXML/实际AppID/设备/账号门槛保持。原游戏消费者/可玩仍需独立可绑定业务证据，既有无账号/PDB答复保留，不重放旧运行、不改保护、不重复当前被拒工具请求。原始四步、三平台和官方接受没有缩小。[完整审计](../analysis/launcher-wechat-host-v1/goal-audit.json)、[验收](validation.md#stage143)。

<a id="stage142"></a>
## stage142：补齐微信端的实际会话适配入口

上一轮141是恢复消费者的实际静态进展；本轮修改前1800项交付一致，15份候选前态保留。进一步源码盘点确认当前只有Node TCP及浏览器回环桥，没有微信适配。对原生下载继续堆静态说明不足以补此实现缺口，先把已证current握手/record/登录flow接到微信平台能力，不新增游戏/认证字段或演示玩法。

**实施前合同：** 复用stage110/111/112/136对应6d459/c82fc98的REA规格及现有createLauncherSession驱动；仅增加可注入取消控制器以免微信依赖DOM AbortController。新增adapters/wechat入口组合TCPSocket与UserCryptoManager随机数。显式endpoint allowlist、所选平台端口限制、缓冲预算、错误清理、取消/超时/晚到回调和已有输入所有权均保留；无熵/必要API直接失败，不用Math.random替代。TCPSocket.write返回void只能表示调用接受，不能谎报传输或认证成功。官方Performance类型没有now，已在实现前后核对中排除该假设；时钟改用独立本地单调逻辑值与timer floor，不把墙钟回退变成无限续期，不当服务器时钟。

直接开发者文档网页不可由web工具打开；改查微信官方api-typings源，保留具体URL/内容SHA/支持边界。若需补本地构建器，只在build依赖目录固定版本/完整性，不改全局工具。先建立实施规格及有意义用例，再实现；验证分为原生API形状夹具、独立原创TCP对端、无DOM的CommonJS构建检查，真实微信/AppID/域名/账号/设备仍单独未验收。

**实际实现与验收：** 已新增adapters/wechat的TCP、private取消信号、本地期限时钟和组合会话入口，直接调用原createLauncherSession/current flow。普通浏览器默认controller保持，新增SESSION_CONTROL及异常清理；shared协议/字节格式未变。固定本地esbuild0.25.12构建119241B CommonJS、37源输入、0外部import。3项旧驱动回归在基线自然失败；最终新增23项、完整709项Node及另1项无DOM bundle检查通过，含独立Python的正常交换/错误组、选择门槛、取消/预算/时钟回退与晚到回调。[来源](../analysis/launcher-wechat-v1/source-check.json)、[测试与构建](../analysis/launcher-wechat-v1/test-results.json)、[接入](../adapters/wechat/README.md#stage142)。

**未决/下一步：** 这是实际平台适配实现进展，不是小程序或完整游戏验收。没有页面、HTTP/目录/资源的微信宿主接线，真实AppID/域名/平台限额/JS支持和生命周期、设备及官方账号仍未验；公网裸IP不在本适配器支持范围。下一步按现有已证目录/配置合同补微信宿主接线及可运行工程，再分层验证实际开发者工具与设备；游戏仍只接受可绑定的业务消费者，不猜字段或恢复受保护负载。goal继续active/incomplete，不以新构建/原创交换缩小原目标。[完整目标审计](../analysis/launcher-wechat-v1/goal-audit.json)。

完整四步及web/mobile-web/WeChat/官方可玩目标保持，游戏消费者缺口/无账号/PDB答复保留；本轮不重放VM/游戏/CDB诊断或连接官方服务，不请求重复授权。旧blocked计数不复用，知识库requirement-index仍缺，以本页为当前需求真源。

<a id="stage141"></a>
## stage141：核对恢复日志的实际消费与文件恢复边界

上一轮140是实际实现进展：当前候选decoder已接启动声明校验，686项Node/46项浏览器夹具通过；完整目标未完成。本轮先核原1794项交付均一致，12份候选文档/导出前态保留，再复用当前7eb173更新器的匹配REA快照。现有web初始化确实调用该decoder并返回update对象，上一轮校验不是未接入的独立helper。

**本轮问题：** 复用既有0x40ee10/0x40ebd0/0x40e7d0伪代码，仅补缺的函数体/AL返回、文件状态判定与恢复helper调用证据；区分无日志、坏日志、stage1、stage2..4与stage5的动作和失败条件。核对是否已有shared header语义需要修正，再依据实际受支持端口决定实现；不把离线计划当文件恢复或新增未接入的Win32执行API。修改解析器须先建立支持范围和原创正反例。

**实际结果：** 新6份函数调查/12条记录，6段2760B逐段匹配7eb173原件，17处指令对照确认被默认void签名遗漏的AL及分支。日志读取器第一次GetFileAttributesW无效即返回AL1/stage0，没有读取错误码；stage2..4备份查询无效则拒绝隐式提交。恢复helper先target→failed、再backup→target，第二步失败时可尝试failed→target但仍返回AL0；成功后的failed删除是best effort。完整文件状态、竞态和实际恢复并未证明。[具体源/偏移/限制](../analysis/launcher-recovery-state-v1/source-check.json)、[逐阶段合同](../analysis/launcher-recovery-state-v1/static-contract.json)。

**实现决定：** 既有header解析器只读精确16B，阶段1..5/校验与原生读取子集一致；原生stage0是外部查询分支，不能伪装成新header值。当前新增事实依赖真实文件系统，不新增无执行端口的恢复helper或修改已正确的字节接口。现有current网页prepare调用decoder并返回update，确认stage140校验已在实际候选链。产品217项（含目录内说明）保持，没有本轮测试/构建或渲染运行；686Node/46浏览器仅stage140历史结果。[接口边界](module-interfaces.md#stage141)、[验收](validation.md#stage141)。

**接续：** 本轮为实际静态消费链进展，完整目标保持active/incomplete；原生全事务、真实认证与游戏业务消费者/可玩及三平台/官方接受未完成。后续只沿可证的正常安装/下载/异常分支或可绑定的游戏材料推进，不重复已有恢复函数分析、旧游戏/CDB执行或无变化状态核对；没有新业务材料时精确审计未决，不以文档或演示替代实现。[完整目标](../analysis/launcher-recovery-state-v1/goal-audit.json)。

当前按开发/R1本地可恢复分析推进，没有VM、厂商执行、CDB/转储、官方服务器或账号动作；游戏业务材料缺口/无账号/PDB答复保留，不重放已用诊断。知识库上次experience,requirement-index/3000/development查询缺requirement-index，以本页为需求真源，不重复无变化查询或写外部规则。完整goal继续active/incomplete，不复用旧blocked计数。

<a id="stage140"></a>
## stage140：启动确认消费者已追清，候选资源声明校验已接入

上一轮139为实际分析进展，已区分接管就绪与后续startup ACK。本轮原1782项交付修改前全匹配，受影响/候选文档与导出前态保存；继续同一四步及web/mobile-web/WeChat目标。复用当前6d459/c82fc98父样本与7eb173更新器材料，先定位UPDATEACK参数的生产、解析、事件置位时点及更新器确认/提交/回滚调用关系；已有生产者反编译先复用，具体缺口才新增REA查询。不将就绪位、退出码或声明资源当启动成功，不补猜游戏协议。

**实际分析：** REA6.7.0/Ghidra12.1.4新增7份函数调查/23条记录，9段5792B与各自原文件相等。新登录器只消费第一个精确大小写的UPDATEACK参数，在frame-painted后打开/置位事件；更新器只把两句柄等待结果0视为ACK，最多约30秒，再到所选提交/恢复分支。它不证明账号、游戏或发布者身份。[来源与限制](../analysis/launcher-startup-ack-v1/source-check.json)、[静态合同](../analysis/launcher-startup-ack-v1/static-contract.json)。

**新增实施切面（代码前建立）：** 已证更新器0x402a00以type10/命名资源检查启动ACK声明，21B固定ASCII或22B末尾NUL合法，畸形返回AL0；缺少资源则允许legacy能力分支。当前shared候选解码只验PE头，补入所选资源字节检查并返回未观察ACK的声明元数据，直接接现有current decoder；不增加命名事件/原生执行端口。支持范围及独立预算、语言/格式歧义处理先写入[实施规格](../analysis/launcher-startup-ack-v1/implementation-spec.json)，再用原创Python PE/ZIP夹具经公开decoder验证修复前后。

**实际实现与验收：** `shared/launcher-update.mjs`现有current decoder已接所选资源校验，返回冻结的startupAcknowledgement；畸形拒绝、缺失声明保留旧分支，trust/authentication/replacement不提升。独立Python原创夹具23项在改动前全失败、改后相关72项及完整686项Node通过；Chrome桌面/手机尺寸测试页各23项通过，固定6d459原候选装入私有原创ZIP后解码字节一致、声明v1/1语言。它不是官方ZIP或运行验收。[测试](../analysis/launcher-startup-ack-v1/test-results.json)、[浏览器](../analysis/launcher-startup-ack-v1/browser-audit.json)、[接口](module-interfaces.md#stage140)。

**未决与接续：** 所选静态ACK/恢复关系不等于全EH、竞态或文件事务通过，当前平台没有Win32事件执行端口。本轮实际实现进展，完整goal保持active/incomplete；继续核对恢复/日志消费者及候选结果的现有调用方，再决定可证的跨平台切面。游戏仍缺独立绑定模块/代码与业务行为的证据，不用演示或猜字段替代。保留无账号/PDB答复，不重放已用游戏/CDB额度或复用旧阻塞计数。[完整目标](../analysis/launcher-startup-ack-v1/goal-audit.json)、[验收](validation.md#stage140)。

没有新增VM/厂商执行、CDB/转储、游戏服务器或账号操作，未构建native。已知上轮知识库experience,requirement-index/3000/development查询缺项目requirement-index，以本页为需求真源，不重复无变化查询或写外部规则。保留旧文档/产品，修改前1782项全匹配；本阶段源码差异与交付由独立清单核验。

<a id="stage139"></a>
## stage139：现行更新器接管就绪与父进程退出的正常交接已追清

上一轮138完成既有转储固定64B查询，是实际诊断进展；任意delta映射未成立，游戏消费者仍未知。本轮原1776项交付修改前全匹配，12份既有文档/导出前态保存。按完整目标接续stage137明确未决的当前更新事件/父进程确认链，当前c82fc98分析映像、6d459原始更新版及7eb173内嵌更新器完整hash重新核实；复用匹配REA快照，新增5份调查/19条记录，7段11948B原字节全部相等。[源证据](../analysis/launcher-handoff-ready-v1/source-check.json)。

**事实与范围：** timer0x232b每100ms检查手动reset就绪事件与更新器进程；未就绪且仍运行时，DWORD tick差小于60000才继续等。就绪且更新器仍运行并通过窗口获取检查时，清理句柄并请求父窗口关闭；其余终态走窗口辅助/错误提示。更新器正常请求先做父进程路径检查、同PID/创建FILETIME事件置位，再最多等父退出60000ms；只有wait结果0才进入后续恢复/更新。事件缺失且错误2是兼容分支，不等于实际置位。就绪不是替换完成或新子进程启动ACK。[合同和真值表](../analysis/launcher-handoff-ready-v1/static-contract.json)。

**实施决定/未决：** 新证据是Win32命名对象、进程和窗口生命周期，当前跨平台架构没有对应执行端口；本轮固化规格，不新增未接入的执行辅助接口，不改native、现有shared/页面代码或协议字段。7eb173主入口高pcode仍截断、terminal假设保留，默认void签名以原指令AL返回和调用方测试校正解释；不声称完整EH/竞态/事务等价。独立登录器真实认证、后续启动ACK/替换恢复、游戏消费者及三平台/官方可玩仍未完成。[完整审计](../analysis/launcher-handoff-ready-v1/goal-audit.json)。

下一步追踪与本就绪事件不同的现行新登录器启动ACK消费及其参数/事件合同，再依据实际支持的平台端口决定实现；不得把当前就绪位或历史退出码写成更新成功。游戏仍需要独立绑定模块/代码与业务行为的材料，不重放已用CDB/游戏运行、不再用任意delta映射。现有模块接口、资源文件解析与构建运行流程未改，本轮无产品测试/构建或设备/联网验证。[验收](validation.md#stage139)。

本阶段未请求新的厂商执行、VM/内存/联网或账号操作，不重放stage138有限查询。知识库experience,requirement-index/3000/development查询仍exit2缺requirement-index，当前本页为需求真源，外部知识库/全局规则不改。完整目标继续active/incomplete，不复用旧阻塞计数。

<a id="stage138"></a>
## stage138：已有游戏转储固定64B查询完成，任意delta映射未成立

上一轮137是实际当前登录器参数实现进展。本轮原1770项交付全部匹配并保留9份规范文档前态；现有Windows前台空终端已实际typeText1/Return→输出1/空提示符，普通输入本轮恢复，不推定长期稳定或所有配置/权限已验。

**事实：** dump16924391B/完整SHA、CDB完整SHA/Valid签名、进程0、空本地symbols、cwd无ntsd.ini及新日志不存在均实际前检。12项参数完整回读后，仅一次离线-z查询0x0b7c7cc0与0x0b7c8152各32B，退出0；8880B/74行日志留来宾，仅投影4行地址/hex，不带ASCII。查询前标记14:42:31.3476825、退出后观察14:43:19.4577073+08，不当精确进程时长。[输入/前检](../analysis/game-text-observer-runtime-v1/access-stage138.json)、[查询及比较](../analysis/game-text-observer-runtime-v1/code-fingerprint-stage138.json)。

**结果与边界：** 初始化候选32B全为??，表示未捕获而非零；故障32B可读，与任意delta所选原文件0x011bd152参考有31B不同。固定故障32B及其26B后缀在原件精确搜索均0，仅限这两个精确模式。不能认定主映像重定位/代码所有者、真实调用链或根因；不对未知运行时内存反编译，不扩大读取或重建受保护映像。查询后原dump SHA相同、游戏/CDB进程0并留空提示符。游戏/读取器/新转储/附加/权限或配置变更均0，既有授权及无账号/PDB答复保留。

本轮属于实际诊断进展，未取得游戏业务合同或修改产品；完整goal仍active/incomplete，不沿用旧blocked计数。rev35只补样本与交接证据，仍20项/7 observed/13 unknown。架构、模块接口、资源格式、构建流程未改，663Node沿用stage137历史记录，本轮未重跑测试/构建/浏览器/设备。下一步停止用该任意delta映射游戏函数；仅以能独立绑定源文件/模块和行为的材料或协议证据建立消费者规格。现有登录器完整认证、更新事务与游戏/三平台/官方接受门槛见[完整目标审计](../analysis/game-text-observer-runtime-v1/goal-audit-stage138.json)，不以诊断记录替代实现。

<a id="stage137"></a>
## stage137：现行更新参数纯核心已实现；游戏固定指纹未执行

继续完整四步及网页/移动网页/微信目标。原1760项交付在修改前全部匹配，受影响规范文档前态留私有build。此前136为实际实现进展；本轮也有新的有限登录器合同/代码，不复用旧blocked计数，完整goal仍active/incomplete。[逐项审计](../analysis/launcher-update-arguments-v1/goal-audit.json)。

**游戏路线实际状态：** 主模块历史记录仍为0x00400000，不能用候选0x0b7c7cc0与包装器0x011bccc0的任意差值认定重定位/所有者。已从9baa…9d3126原文件准备两个32B参考点，拟只读同次PID5304已有第二份dump对应范围；现有Windows画面/既有菜单Win+Q可响应，但普通typeText/单键/点击/窗口选择无可确认输入，未按Return、提交任何来宾命令或新执行CDB/游戏。本轮未改WER/权限/网络/共享、恢复/重启、输入配置或控制后端，无新人工请求。参考字节不是运行时证据，已有栈警告与消费者缺口保留。[准确观察与接续](../analysis/game-text-observer-runtime-v1/access-stage137.json)。

**REA与实现：** 转向既有未决的当前更新交接。对c82fc98分析映像补5份dossier/14新记录，7段原件字节4933B全部匹配。0x406590及URL/字段/replace helpers证明五字段格式、内部SP→管道符与边界；0x40a320所选分支证明后续runas/事件/定时器仍属原生生命周期。callback高pcode截断与terminal假设显式保留，不作完整EH/事务等价。[源证据](../analysis/launcher-update-arguments-v1/source-check.json)。

新增shared纯encoder与导出，严格own data及非共享/未分离字节，ASCII子集：PID UInt32非0、URL≤255B、盘符绝对路径4..259B、包长1..10位且数值1..256MiB、32hex MD5；保留前导零/大小写，最多570B且不含逻辑NUL。256MiB只描述原参数格式，不扩展已有32MiB候选/下载预算。无Node/DOM/wx/文件/网络/进程/事件依赖，没有页面或原生执行器接线。[接口](module-interfaces.md#stage137)、[实现规格](../analysis/launcher-update-arguments-v1/implementation-spec.json)。

**验证与未决：** 首轮合成MD5夹具误写34B，引起10项预期正例被正确长度门槛拒绝；仅修夹具为32B。最终新13、相关88、完整663项Node全通过，未重跑浏览器/设备/Swift或原程序。REA导出/快照关闭后open=false/cleanup_pending=false，原始代码/反编译留私有build。[测试](../analysis/launcher-update-arguments-v1/test-results.json)、[验收](validation.md#stage137)。

下一步仅在普通输入实际恢复并完成清洁提示符、dump/CDB身份/Valid签名、进程/空符号目录/ntsd.ini与新日志前检后，执行原64B被动比对，不重放已用游戏启动。完整更新事件/ACK/替换/恢复、真实认证、游戏业务消费者与三平台/官方接受仍未完成，不用本encoder或演示玩法代替。矩阵rev34仍20项/7 observed/13 unknown。最近知识库experience,requirement-index查询缺少项目requirement-index，以本页为需求真源；本轮未重复无变化查询或写外部知识库。

<a id="stage136"></a>
## stage136：现行登录器页面/回环接线已实现并本地验收

用户恢复goal=active后，从完整目标重新审查，发现旧“无独立步骤”结论过宽：游戏业务材料不足仍属事实，但现行bootstrap/握手/record接口尚未接入登录页，回环服务还拒绝rtm。已修正该实现缺口与旧审计解释，不复用133–135阻塞计数。[完整目标与接续](../analysis/launcher-current-page-v1/goal-audit.json)。

**源与实现：** REA6.7.0/Ghidra12.1.4对实际更新版6d459ddb…的c82fc98…分析映像取得3份新函数调查，14处指令与7处文字均独立匹配原文件。marker门控双XML顺序、32B比较及HTTP cache-tick子链直接绑定当前源，不沿用c7ba69旧metadata地址。新增纯核心明确sourceProfile，Node/runtime/页面成组选择legacy或win32-current，默认legacy；current仅五个固定路由允许单个有界rtm，支持明确null旧XML及空marker，更新只准备结构候选不执行。[源核对](../analysis/launcher-current-page-v1/source-check.json)、[接口](module-interfaces.md#stage136)。

**实际验证：** 新5项回归修复前4失败/1通过；加入真实WS/TCP独立Python与错误组检查后8项通过。完整shared/web Node650/650，Chrome156/Playwright1.64.1实际页面6场景通过，含1100×820/390×844、当前/旧分支、取消迟到、错误组、未知/不一致profile，截图已观察。初轮浏览器夹具预期错误只修runner并保留失败；后续CLI Ctrl+C发现原创对端KeyboardInterrupt，补信号停止后8项受影响回归及实际启动/退出0通过，未重跑全650或6浏览器。临时浏览器、服务和对端正常关闭，无4176监听。[测试](../analysis/launcher-current-page-v1/test-results.json)、[浏览器](../analysis/launcher-current-page-v1/browser-audit.json)、[运行](../web/README.md#stage136)。

**未完成与下一步：** 完整目标仍包括REA登录器→独立完整登录器→REA游戏→可玩游戏及三平台/官方接受。当前是有证据的登录器实现进展，goal保持active；真实认证、当前原生更新器替换/恢复、完整异常/locale与游戏业务消费者未证，不能以原创对端、手机尺寸或结构候选替代。继续有来源的当前更新/正常入口细节，游戏字段必须由实际业务合同驱动；账号/PDB不可用答复与原授权保留，不重复索取、不重放旧厂商运行。知识库experience,requirement-index/3000本轮query仍exit2缺requirement-index，以本页为真源，未写外部知识库。协议rev33仍20项/7 observed/13 unknown。[验收](validation.md#stage136)。

<a id="stage135"></a>
## stage135：完整目标未完成，当前材料缺口已连续三轮

133实际新增工具/格式检查，134纠正历史并完成四DLL直接名称负向核对；两轮都未取得游戏消费者，当前135只作停机审计，不重写为实现进展或verified wait。两个安装原件与12个已知app文件全SHA匹配，三游戏原.text RawSize仍0（不意味着其他节无代码），当前REA open=false/cleanup_pending=false、analysis_run=null。[逐项与三轮证据](../analysis/game-material-gzip-v1/blocked-audit-stage135.json)。

完整目标包括REA登录器/独立实现/REA游戏/可玩实现及当前三平台与官方接受，五项均有限或未完成。goal已标记为blocked；达到133/134/135连续三轮同一实际材料缺口且无可行独立步骤的门槛，按[实际回执](../analysis/game-material-gzip-v1/goal-status-stage135.json)停止自动重复工作，不沿用旧76/130计数。当前缺的是匹配业务材料、可靠协议/脱敏向量或已知成员的格式/读取源，不是工具安装或新的权限确认；已有授权与无账号/PDB答复保留。出现实质新证据后再核身份接续，单独的继续指令不作新材料。

本轮未改产品代码、协议字段、架构/接口/资源格式实现/构建流程；无测试、构建、VM/游戏/转储或网络操作。rev32仍20项/7 observed/13 unknown，211项产品文件保持。知识库上次query缺requirement-index，本轮不重复无变化查询，以本页为需求真源，未写外部知识库。[验收](validation.md#stage135)。

<a id="stage134"></a>
## stage134：核对材料历史与剩余读取来源

本轮先对照stage40的`apex-static.json`纠正stage133“首次发现gzip”的表述：外/内层哈希、长度、CRC与完整流结果均已有记录，不能把重复核验当成新游戏材料。stage133实际新增有界CLI、10项原创测试、私有成员落盘后的REA格式拒绝及候选头检查；产品/协议未推进。

已实际检查四个随包DLL的直接Apex文件名线索：完整SHA均匹配旧DLL记录，ASCII/UTF16LE、不区分大小写的精确文件名/基名搜索共16项均为0；没有取得直接读取源，也不证明没有间接加载。REA当前open=false/cleanup_pending=false、analysis_run=null，没有可轮询的存活分析句柄。[历史对照、DLL结果与完整目标审计](../analysis/game-material-gzip-v1/continuation-audit-stage134.json)。

本轮只纠正历史和收窄未证路径，无游戏消费者/实现进展，不作verified wait。当前同一材料缺口在133/134两轮持续（计2），goal保持active/incomplete，不复用旧76/130阻塞计数；若下一轮仍无独立可行步骤且缺口未变，再按三轮门槛设blocked。账号/PDB不可用及已有授权保留，不重复索取或重放旧运行。知识库本轮query仍exit2/missing requirement-index，以本页为需求真源，未写外部知识库。产品/接口/资源格式实现/构建流程未改，无测试、构建或新VM/游戏服务器操作；rev32只纠正样本历史，仍20项/7 observed/13 unknown。[验收](validation.md#stage134)。

<a id="stage133"></a>
## stage133：普通gzip材料能力已补齐，候选成员格式仍未知

上一轮132取得启动数据流和有限转储对应，属于实际进展。本轮原1733项交付哈希一致，9份受影响文档/矩阵前态留私有build。复核既有`ApexClient.Dat`；stage40已经记录同一gzip及内层哈希/完整性，stage133实际新增的是有界工具和后续普通格式检查，不能称为新材料发现。[材料审计](../analysis/game-material-gzip-v1/material-audit.json)。

**实际结果：** 新增项目内有界标准库工具，默认压缩输入1MiB、展开8MiB，只接收完整单成员且拒绝尾随/拼接；输出新私有目录，先核给定SHA256、后复核原件未变。500154B/89fe1c…ca213c展开为706686B/668a1a…29fb60，CRC32=`0xfe667921`、ISIZE706686及完整流均通过。10项原创夹具/CLI保留测试通过，不把辅助工具测试当产品或游戏验收。[检查回执](../analysis/game-material-gzip-v1/inspection.json)、[工具范围与复现](resource-formats.md#stage133)。

REA6.7.0/Ghidra12.1.4普通静态能力可用；当前REA归档格式无gzip入口，缺口由项目内辅助工具补齐，未改全局REA/安全配置。展开成员未获标准原生格式绑定，REA返回target_unavailable/unsupported_target；19处MZ候选没有完整MZ/PE头配对，9处PE签名候选的有界PE32/PE32+头检查均不通过。其自定义格式、架构、入口和职责仍未知，没有强行按raw指定架构/入口、改头、重建或执行内部内容。REA最终open=false/cleanup_pending=false。

**完整目标与下一步：** 登录器有限静态规格/独立实现保留，但真实认证、完整更新/交接及平台/官方接受未证；游戏仅有启动层、有限栈和资源解析，未取得原游戏通信/状态/移动/战斗消费者。本轮gzip线索并未补齐这些合同，不能向shared添加猜测字段或以演示玩法替代。[逐项完成审计](../analysis/game-material-gzip-v1/completion-audit.json)。

当前普通材料/源边界路径已经核清；需要合法可分析的匹配游戏业务版本、权威协议/脱敏向量，或能将该opaque成员绑定到消费者的真实格式/读取源。账号/PDB不可用的答复及Windows/联网/工具授权继续保留，不重复提问或重放已用运行。此轮为实际分析能力/材料进展，goal保持active/incomplete；新“可用路线耗尽”区间从133计1，不把131/132进展改写成停滞或复用旧76/130阻塞。若同一实际缺口在之后连续三轮仍无独立进展，再按门槛设blocked。

rev31只同步样本、交接与依赖边界，仍20项/7 observed/13 unknown，211项既有产品文件、架构、接口及构建流程未改；无产品测试/构建或新VM/游戏服务器操作。知识库上次按experience,requirement-index/3000查询缺失requirement-index，本轮不重复无变化查询，以本页和当前材料问题为需求真源，未写外部知识库。[验收](validation.md#stage133)。

<a id="stage132"></a>
## stage132：启动间接调用的静态来源和有限栈对应已完成

当前目标仍为REA分析登录器→独立实现登录器→REA分析游戏→独立实现游戏，网页/移动网页/微信及官方兼容分别验收。上一轮真实诊断属于进展；本轮原1727项交付哈希一致，7份规范文档前态保留。需求与[事先限定的问题](../analysis/game-text-observer-runtime-v1/indirect-flow-plan-stage132.json)未以演示界面替代。

**已完成：** 固定9baa…9d3126原文件新增16份REA记录（15个ID不在已核stage96/131包），5份函数调查、10个指令锚点和1份引用列表。注册链将回填槽`[EBP-0x54]`复制给`[EBP-0xd4]`，随后在`0x1195a3f`调用；另一个包装器在`0x11bcd0e`转发入参。14个DWORD构成56B本地初始化记录，10处指令原字节全部匹配。已知注册链是stage96结果的来源细化，未恢复新的游戏消费者。[分析](game-static.md#stage132)、[静态摘要](../analysis/game-text-observer-runtime-v1/indirect-flow-stage132.json)。

**离线接续实际完成：** 重新核第二份转储哈希与微软CDB哈希/Valid签名，仅以`-z`读四个预定范围76B、19个DWORD，退出0。七项局部对应及初始化槽同值支持候选帧解释；完整栈展开、代码字节/归属和根因仍待证。未跟随指针、读取代码/字符串/全局数据、重新运行游戏、附加调试器或改WER。日志8822B及哈希、最终游戏/CDB进程0已回读，原始材料仅留来宾。[读取回执](../analysis/game-text-observer-runtime-v1/cdb-stack-stage132.json)、[环境](vm-environment.md#stage132)。

**实现准入与下一步：** 当前边界已具体化为映射/导出注册/初始化层，不能据回调地址或56B结构推导网络字段、认证或玩法。先核对已有材料是否存在独立的原游戏消费者或完整、未经保护恢复的协议证据；没有可用材料时记录精确缺口，不重复本次崩溃、补猜协议或提取受保护负载。账号/PDB不可用的答复保留，无需重复索取。完整目标仍未完成，本轮是分析进展，goal保持active/incomplete；不沿用旧等待计数。[验收](validation.md#stage132)。

项目知识库按development/experience,requirement-index/3000预算查询仍缺requirement-index（exit2）。当前需求真源由本页和上述问题补齐，未将历史卡当当前状态，未修改外部知识库/全局规则。shared/web/native/adapters的211项既有产品文件、架构、接口、资源格式、构建流程与协议rev30保持；本轮无产品测试或构建。

<a id="stage131"></a>
## stage131：执行已确认的小型转储诊断，继续核对静态入口

**事实：** 用户对原stage128问题答复“允许本次诊断及对应 UAC”，此前确认条件已解除。新原生恢复点、双视图按应用WER设置、一次普通无参数游戏启动、恢复及两次离线CDB读取均已实际完成；游戏PID5304运行6.466299秒后自然退出`0xc0000005`。[授权](../analysis/game-text-observer-runtime-v1/authorization-stage131.json)、[生命周期](../analysis/game-text-observer-runtime-v1/wer-lifecycle-stage131.json)。启动额度已用，不重放125或本次运行。

**证据与实现边界：** 两份小型转储分别记录`0xc00001a5 @ 0x0b86db30`、`0xc0000005 @ 0x0b7c8152`；39个模块记录集合一致，两处异常地址均不在所列范围。CDB的9/8行候选栈都带可能错误警告；六个主程序返回值按文件布局落在`.text1`。尚无可靠调用链、故障所有者或协议消费者，不能据此实现认证/玩法字段。[CDB摘要](../analysis/game-text-observer-runtime-v1/cdb-summary-stage131.json)、[布局算术](../analysis/game-text-observer-runtime-v1/stack-file-boundary-stage131.json)。

**已完成的静态接续：** REA6.7.0/Ghidra12.1.4新增24条记录，六个候选返回地址均在已分析函数内，且恰为前一条CALL的结束地址；四处直接目的地、两处间接调用边界已核。静态直接边依次支持`___tmainCRTStartup → 0x1179000 → 0x11970f0 → 0x11967d0 → 0x1195380`，但不证明运行时走过全链；两个间接目标仍未知。[REA摘要](../analysis/game-text-observer-runtime-v1/rea-stack-correlation-stage131.json)、[分析](game-static.md#stage131)。未再次启动游戏或扩大采集，REA会话已关闭并核无待清理资源。

**下一步与未决：** 只沿可证的静态数据流核对两个间接调用的参数来源及函数职责，保留运行时目标、字节一致性和消费者归属未知；若文件证据不足，记录具体缺口，不猜协议或重复崩溃实验。原始转储/调试输出保留来宾，临时WER键已恢复，运行后EXE哈希一致且游戏/CDB进程数0。[恢复](../analysis/game-text-observer-runtime-v1/wer-restoration-stage131.json)、[收尾](../analysis/game-text-observer-runtime-v1/wer-postflight-stage131.json)。无新产品实现/测试/构建，完整四步与网页/移动网页/微信/官方可玩仍未完成，协议rev30不变。[本阶段验收](validation.md#stage131)。

<a id="stage130"></a>
## stage130：独立前检完成后，既有确认成为当前阻塞

**事实/分类：** 128的WER材料核验、129的注册表与资源前检均为实际进展，本轮只复核状态与1709项交付一致性，不计实现/取证进展或verified wait。最近三轮的原问题及后续记录已只读核对，没有新的具体答复；没有确认存活的分析作业可轮询。[三轮审计](../analysis/game-text-observer-runtime-v1/blocked-audit-stage130.json)。

**阻塞与边界：** 同一stage128执行时问题在128、129、130持续；可独立完成的只读前检已用尽，不能用重复哈希/查询、无账号假认证、无证据协议或演示玩法替代完整目标。不是复用旧127输入阻塞计数，也不把前两轮进展改写为停滞。本轮没有CUA/来宾命令、新样本/调试器执行、REA或产品变更。

**接续：** 按审计阈值请求goal blocked，准确结果见[状态回执](../analysis/game-text-observer-runtime-v1/goal-status-stage130.json)；停止自动重复工作。等待原问题实际答复或实质性新消费者证据，已有授权保留且不重复提问。恢复后重新开始阻塞审计，按答复及[原方案](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)核当前身份/Win7/进程/键目录/资源与新恢复点，不重放125。rev30仍7 observed/13 unknown，完整四步、三平台和官方可玩未完成。[验收](validation.md#stage130)。

<a id="stage129"></a>
## stage129：按应用诊断的只读前检取得实际结果

**事实：** 原1705项交付哈希一致，7份文档前态保留。两个显式逻辑视图的 LocalDumps 父/游戏子键均不存在，AeDebug存在而Auto缺失；实验目录False、C余量230298329088B、同名进程0、安装文件精确路径/2904064B均有输出。四个只读句柄已Dispose，原普通终端空提示符保留。[前检](../analysis/game-text-observer-runtime-v1/wer-preflight-stage129.json)。

**边界：** 两视图的不存在结果不证明物理键是否共享；Auto缺失不保证未来生成转储。普通输入再次中断后，经同次实时菜单选择既有Win+Q、字符1/Escape/可见^C恢复；不是输入根因或永久修复。[回执](../analysis/game-text-observer-runtime-v1/input-stage129.json)。

**下一步：** 保留stage128已提出且仍待答复的执行时确认，不重复提问或把自动继续当答复。获得答复后，按[原方案](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)重新核实时态、身份/Win7/进程/键目录和余量，建立指定恢复点，再执行唯一临时设置/一次普通启动/恢复；这些均未发生。没有账号/PDB的新依赖请求，不重放125已用运行。此轮是准备层实际进展，goal active/incomplete；源码、架构/接口/格式、rev30的7 observed/13 unknown、测试及构建未变，完整四步/三平台/官方可玩未完成。[验收](validation.md#stage129)。

<a id="stage128"></a>
## stage128：既存 WER 材料已核，准备新的故障上下文方案

**事实：** 原1699项交付一致，7份受影响文档前态保留；普通输入实际恢复，无需用户点击。两份实际StorePath归档存在，含隐藏项的直接条目计数各1，只剩44628/44632B文本报告，完整SHA256已读。两组各5个WER/Temp附件均False，包括两份.dmp。签名与126一致，各38模块、PowerShell默认条目比较差异0。[材料](../analysis/game-text-observer-runtime-v1/wer-artifacts-stage128.json)、[输入](../analysis/game-text-observer-runtime-v1/input-stage128.json)。

**推导与边界：** 原两报告的附件路线已结束，未取得栈、运行时基址/映射或消费者；不扩大到全盘搜索，不由模块存在判定ARM、依赖或保护为根因。源码、资源格式、接口、架构和协议rev30（7 observed/13 unknown）保持，报告核验不提升兼容状态。

**下一步：** [新方案](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)拟仅按应用临时设置Windows小型转储，一次普通无账号启动，不附加调试器或调用读取器；结束恢复设置，既有CDB只离线查看该次材料。游戏当前哈希与CDB哈希/Valid签名已实际复核；新恢复点、键/目录前检、设置与执行尚未发生，执行时确认尚未取得。新方案不重放已用125额度。已有VM/联网/工具授权和账号/PDB不可用答复保留。

本轮为实际分析进展，目标active/incomplete，恢复后阻塞审计重新开始，不沿用127计数。无新产品测试/构建；完整四步、三平台与官方可玩仍未完成。[验收](validation.md#stage128)。

<a id="stage127"></a>
## stage127：只读接续受普通来宾输入阻挡

上一轮126属于实际进展：事件归属、运行后身份与REA范围结果改变了下一调查问题。本轮原1694项交付一致、6份文档前态保留；同一窗口画面重新可读，但有界文字/单键/正常点击/窗口菜单/Escape均未证普通输入可用，无Return、来宾命令、附件结果或新增游戏执行。[访问证据](../analysis/game-text-observer-runtime-v1/access-stage127.json)。本轮分类为**无实现或附件调查进展**，文档/清单更新不作为产品进展。

125/126虽各有实际成果，其末尾普通输入均再次失去可核验响应；127同一症状持续。当前没有已确认运行的分析作业可等，继续重复头部查询、盲输或补猜游戏协议不能推进原目标，按[三轮审计](../analysis/game-text-observer-runtime-v1/blocked-audit-stage127.json)记录阻塞并停止自动重复操作。已有VM/联网/工具授权保留，不把原因写成待授权或重新要求账号/PDB。

可恢复入口仍是[两份既存WER报告的限定只读检查](../analysis/game-text-observer-runtime-v1/resume-plan-stage126.json)：普通输入实际恢复后，先核/取消可能未提交的无害查询并验证短输入，再核真实引用路径与文件元数据。游戏消费者/通信/玩法和完整三平台/官方可玩目标未完成；源码、rev30、构建与测试没有新增变更。[唯一排障](known-issues.md#stage127-input)。

<a id="stage126"></a>
## stage126：事件归属和映像范围已核，继续检查既存崩溃材料

**已完成：** 原1685项交付核对一致，9份受影响文档前态保留。普通输入实际恢复，旧未提交行已取消；已存4条事件中，两条1000由PID5136与精确FILETIME绑定到上次游戏进程。两份1001只读取事件类型和P1..P8，均未给出可用模块地址；游戏与工具运行后哈希匹配。[事件](../analysis/game-text-observer-runtime-v1/events-stage126.json)、[身份](../analysis/game-text-observer-runtime-v1/postrun-identity-stage126.json)。

**推导与未决：** 记录时钟及脚本顺序支持首条错误记录早于读取器最早调用时点；无法据此确定后续访问违例的原因。REA新增一条节表证据、独立11节头解析说明原始FaultOffset不能直接映射函数；没有游戏快照、调用栈或业务消费者，不能补写协议或玩法。[REA](../analysis/game-text-observer-runtime-v1/rea-fault-layout-stage126.json)、[PE范围](../analysis/game-text-observer-runtime-v1/fault-layout-stage126.json)。

**下一步：** 仅读这两份已存WER记录实际引用的本地材料，先核目录/文件存在性、名称和大小，再按真实类型决定是否有可用堆栈或模块映射。第二记录StorePath赋值已返回提示符，但值、存在性和附件未核；后续只读前缀查询未回显且未提交，正常菜单恢复后画面主体为空白。先恢复可证终端并取消可能未提交的查询，不盲按Return、不新扫其他应用或自动导出内存。不存在或普通权限拒绝即记录停止。[精确接续](../analysis/game-text-observer-runtime-v1/resume-plan-stage126.json)、[唯一排障](known-issues.md#stage126-input)。

本轮为分析进展，无新的游戏/读取器/夹具执行、产品改动、测试或构建。已有Windows/联网/工具授权与无账号/PDB的答复保留，无重复人工请求。原四步和三平台/官方可玩目标未完成；本轮不标complete或套用旧锁屏blocked计数。

<a id="stage125"></a>
## stage125：单次游戏诊断完成，继续定位异常退出

**事实：** 原1678项交付一致，19项文档/矩阵前态保留；普通输入恢复，旧解锁请求已被实际恢复接续，无需人工回复。游戏/读取器完整hash、目录/Win7/五直接DLL、StartInfo及原恢复点重新核对，完整ToString回读后只触发一次。[前检](../analysis/game-text-observer-runtime-v1/game-guest-preflight-stage125.json)、[输入边界](../analysis/game-text-observer-runtime-v1/input-resume-stage125.json)。

实际PID5136、运行9.123410秒、退出0xc0000005；一次固定1753452B读取返回TEXT_ZERO/reader exit1，无代码文件。整体开始/结束标记15.633967秒；自然等待观察到退出，未进入关窗分支，实际复查输出不存在/同名进程0。[运行回执](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)。

**下一步：** 先恢复可证普通输入，核并取消可能未提交的只读事件投影，读取本次已查询的目标错误字段与执行后hash；再以真实故障模块/偏移选择REA问题。当前没有事件详情、堆栈或消费者代码，不能确定ARM、依赖或保护为根因。原一次方案已经使用，不重放游戏/夹具/传输命令；不改保护、伪造认证或重开取消的CLI。已有账号/PDB不可用答复保留，不再索取聊天凭据。[具体接续](../analysis/game-text-observer-runtime-v1/resume-plan-stage125.json)。

原四步与网页/移动网页/微信完整目标继续未完成。产品代码、解析器、接口、rev30和历史测试未改，本轮无新增产品测试/构建或平台/官方可玩验收。

<a id="stage122"></a>
## stage122：本次执行确认已取得，正常解锁后继续原有诊断

**事实：** 用户已答复 stage119 的具体执行问题，goal 已实际返回 active；原 1671 项交付 hash 一致，19 项文档/矩阵前态已保留。原 pending 回执维持历史状态，由[本次授权](../analysis/game-text-observer-runtime-v1/authorization-stage122.json)接续。原恢复点仍 current，精确 VmUuid 和 XML 摘要一致，未新建/还原快照。[恢复复核](../analysis/game-text-observer-runtime-v1/recovery-recheck-stage122.json)。

正常退出全屏后，通过单次调用内实时匹配原有 Win+Q 菜单项，实际打开搜索；普通字符 1 可见，Escape 实际返回原 PowerShell。下一次无害 Get-Date 输入时工具报告 Mac locked / automatic unlock failed；没有 Return、脚本块加载、游戏或原创工具启动。[输入回执](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)。旧启动信息回执中的反斜杠表示错误另以[纠正记录](../analysis/game-text-observer-runtime-v1/command-path-correction-stage122.json)接续，不改旧文件或来宾值。

**下一步：** 正常解锁后先检查未提交行，核无害短命令与游戏 hash/Win7/依赖/无输出/无进程/实际 StartInfo，再按原[一次限定方案](../analysis/game-text-observer-runtime-v1/game-startup-plan-stage119.md)加载并回读命令，只执行一次启动及最多一次固定读取，记录实际生命周期。若有真实代码，再 REA 追溯消费者，更新规格并实现 shared 与薄适配层。来源执行确认已取得，不重复索取；当前只有一次正常 Mac 解锁状态请求。

当前阻塞为新出现的 Mac 锁定，不沿用旧授权等待或 stage115–117 锁屏计数；本轮不标 blocked/complete。没有测试账号，不再索取聊天凭据。真实认证/消费者/玩法及三平台/官方可玩仍未完成，rev30 保持 7 observed / 13 unknown。[接续计划](../analysis/game-text-observer-runtime-v1/resume-plan-stage122.json)。

<a id="stage119"></a>
## stage119：原创资格已补齐，推进游戏限定诊断

当前goal已实际返回active；上一轮有实际Windows读取/摘要/自然exit0进展。本轮1656项前交付hash一致，先保留19项文档/矩阵前态；知识库3000预算查询仍缺requirement-index退出2，本页继续为需求真源。正常UI已使q完整回显，Return后未见正常提示符，随后Ctrl+C实际返回正常空提示符；只证明当前短输入链。[本轮接续方案](../analysis/game-text-observer-runtime-v1/resume-plan-stage119.json)。

**已完成：** 同一原始快照在来宾核长度/属性/完整 hash 后，单次 POST 返回，主机接收器成功关闭并退出 0；按实际基址和 245 个 HIGHLOW 比较，全部 6624 字节相等。原创正向资格通过，没有新夹具启动或读取。[返回](../analysis/game-text-observer-runtime-v1/snapshot-return-stage119.json)、[完整资格](../analysis/game-text-observer-runtime-v1/qualification-stage119.json)。

**当前推进：** 安装版游戏 hash/Win7/五个直接 DLL、读取器/普通目录/无既存输出/进程数 0 已核对，新原生恢复点已建立且旧点保留；还原启动未测。精确启动参数已回读，一次无账号启动、一次固定 `.text` 读取及正常结束的[独立方案](../analysis/game-text-observer-runtime-v1/game-startup-plan-stage119.md)已写出，来源执行确认已提出、尚未取得。当前只有对象准备，没有游戏启动或读取。

取得真实代码后先用 REA 追溯消费者，只有证实的合同才进入 shared 与薄适配层。真实认证、消费者、玩法及三平台/官方可玩未完成，rev30 仍为 7 observed / 13 unknown；没有测试账号，不再重复索取或伪造会话。长批量行回读不一致已在提交前取消，短行输出取得结果；根因未定。

<a id="stage118"></a>
## stage118：实际Windows读取及生命周期已证，完整传回仍待完成

原四步和网页/移动网页/微信目标保持。1642项stage117交付hash通过，保留18项文档/矩阵前态后建立[执行前方案](../analysis/game-text-observer-runtime-v1/plan.json)。用户正常解锁后，实际短输入和Get-Date通过；既有网络10.211.55.2/3仅用于传送原创工具，不修改网络、共享、安全或快捷键定义。新建固定来宾实验目录，读取器按CreateNew落地，完整146798B/SHA25616386482…83732f5一致，一次GET服务已成功关闭并退出0。[前检](../analysis/game-text-observer-runtime-v1/guest-preflight.json)、[传输](../analysis/game-text-observer-runtime-v1/transfer-runtime.json)。

**事实：** 一次原创fixture PID260的真实ready、6624B单次读出、实际基址00da0000、观察器退出0均有Windows回读；同一进程14:46:53–14:47:23自然运行30秒，WaitForExit=True、HasExited=True、ExitCode=0。独立主机oracle按245个HIGHLOW修正得到SHA25613da500e…146a9d9，与观察器输出一致。原快照文件未传回，直接逐字节比较仍为false，冻结方案的完整资格尚未通过。[分层实证](../analysis/game-text-observer-runtime-v1/fixture-runtime.json)。

**未决：** 快照元数据查询显示缺字，未提交；普通输入随后无可确认响应。原生Ctrl+Break进入PowerShell自身DBG，q未见回显/未提交；原生Win+Q能开搜索，普通字符仍不出现。配置控件不支持setValue，正常选择也未观察到改值；最后鼠标/键盘均为自动检测，配置通过文件菜单正常关闭。[输入回执](../analysis/game-text-observer-runtime-v1/input-observations.json)、[有限模式检查](../analysis/game-text-observer-runtime-v1/input-mode-experiment.json)。没有新增人工操作请求，未重放fixture或改安全/输入后端。

**下一步：** 沿正常UI恢复当前终端，只有q完整可见时才提交退出自身DBG；核原始fixture-text.bin长度/属性/hash，启动已准备的固定接收器传回同一6624B文件并按已观察基址直接比较，不重跑已完成的fixture。其后才新鲜核游戏身份、依赖、Win7与恢复条件并建立具体有界无参数诊断方案。新游戏观察与认证后正常进入分别验收，不伪造票据/IPC、不更改保护。

本轮5项新传输主机测试通过，未修改shared/web/native产品代码、未重跑旧产品测试，也没有新REA游戏消费者或原游戏执行/读取。矩阵rev30保持7 observed/13 unknown；暂无账号/PDB/调试构建的既有答复保留。完整登录器、游戏及三平台/官方可玩仍未完成。控制器在恢复开始时仍返回旧blocked，本轮未调用不存在的resume或把新输入问题计作旧三轮锁屏。[验收](validation.md#stage118)。

<a id="stage117"></a>
## stage117：三轮正常访问失败，目标已标记blocked

stage115–117连续三个goal turn的正常电脑控制均报告Mac locked/自动解锁失败；第116/117轮无开发进展，没有活跃观察任务可等待。三轮审计通过后，目标工具实际返回blocked，完整目标仍未完成。[审计](../analysis/game-text-observer-v1/blocked-audit-stage117.json)、[实际状态](../analysis/game-text-observer-v1/goal-status-stage117.json)。

1639项上一交付hash和新工具146798B/16386482…83732f5一致；矩阵rev30仍7observed/13unknown。本轮无新源码/产品测试、来宾/游戏执行或VM/安全变更。保留已有正常解锁请求及现有Windows/联网/工具授权；恢复正常访问后先验真实fixture读出、完整字节与自然生命周期，再制定新鲜有界游戏诊断方案。[资格步骤](../analysis/game-text-observer-v1/windows-qualification-plan.json)、[交付](../analysis/delivery-manifest-stage117.json)。

<a id="stage115"></a>
## stage115：固定 `.text` 观察依赖已准备，真实Windows资格待验

1620项stage114交付逐项一致后保留17项前态，先建立[方案](../analysis/game-text-observer-v1/plan.json)。知识库experience,requirement-index/3000查询仍缺requirement-index退出2，本页维持需求真源，未改知识库或全局规则。原四步及网页/移动网页/微信完整目标保留。

旧8B槽工具不足以取得业务代码，本轮新增独立固定.text读取器与原创fixture离线字节oracle。39项C和6项Python通过，两次构建相同，链接的两身份/路径/范围/输出与ASLR/NX通过。初始三类构建/解析问题已修复并保留失败；新REA资源/objdump共3条成功记录，不把Linux-only不支持算成PE证据。[主机结果](../analysis/game-text-observer-v1/host-validation.json)、[oracle](../analysis/game-text-observer-v1/fixture-oracle-validation.json)、[审计](../analysis/game-text-observer-v1/evidence-audit.json)。

现有Windows画面可读，首次输入批次被Mac locked/自动解锁失败拦下，Return/来宾命令提交0；一次正常解锁请求保留。没有游戏/新工具执行、传输监听或配置变更。后续先恢复正常输入，核实际文件/目录/新PID，验真实fixture字节与自然生命周期；旧传输工具固定的是不同hash，不能重放冒充新版。[访问](../analysis/game-text-observer-v1/access-observation.json)、[具体资格方案](../analysis/game-text-observer-v1/windows-qualification-plan.json)。

原游戏另需新鲜依赖、Win7、恢复与具体有界诊断方案；诊断启动与正常认证进入分别验收，不假造账号/IPC/票据或改保护。暂无测试账号/PDB/调试构建，原.text消费者、通信/玩法和三平台/官方可玩仍未完成；矩阵rev30的7/13不提升。[阶段验收](validation.md#stage115)。

stage116只读复查：1637项前交付hash一致，正常电脑访问再次报告Mac locked/自动解锁失败，未取得app/guest、来宾输入或新游戏证据。同一阻塞连续2个goal turn，已有正常解锁请求保留，本轮无开发进展；目标active，尚未达到三轮blocked门槛。恢复后仍按新工具的真实fixture/完整字节/自然生命周期顺序验收。[回执](../analysis/game-text-observer-v1/access-recheck-stage116.json)。

<a id="stage114"></a>
## stage114：浏览器缓存链已验收，继续正常启动的游戏代码观察

1607项stage113交付逐项hash一致后保存前态。原四步和网页/移动网页/微信完整目标保持；上一goal轮为实际进展。本轮知识库experience,requirement-index/3000查询仍缺requirement-index退出2，本页为需求真源，未改知识库或全局规则。[执行前方案](../analysis/launcher-cache-source-browser-v1/plan.json)。

Browser插件未提供；用户已有补依赖授权下只在私有build安装Playwright-core1.64.1（固定版本、npm完整性一致、忽略安装脚本），复用Chrome156。原创夹具首次三条嵌套依赖404后已保留失败，修夹具路由重测：83项、6次浏览器会话、35模块hash一致，真实IndexedDB/重启/来源拒绝/旧v1与CAS已验。本轮未修改产品源码，没有重复跑已通过的79项Node作为新证据。[工具](../analysis/launcher-cache-source-browser-v1/tooling.json)、[浏览器](../analysis/launcher-cache-source-browser-v1/browser-results.json)。

游戏原件CodeView头直接文件核验与REA头部启动超时分层记录；两个REA负面读取未恢复原.text。按精确GUID/age和标准名字在微软公开符号源两次GET均404，无新调试材料。[源与限制](../analysis/launcher-cache-source-browser-v1/game-source-check.json)、[查询方案](../analysis/launcher-cache-source-browser-v1/symbol-plan.json)、[实际结果](../analysis/launcher-cache-source-browser-v1/symbol-observation.json)。

下一步对现有Windows、安装版hash、依赖与恢复条件做新前检，形成有界观察方案，检查未改动游戏程序自身启动是否产生可读代码；诊断启动与经登录器正常进入分别验收，不伪造票据/会话、不更改保护检查、不复用已用旧脚本额度。暂无测试账号/PDB/可分析构建；真实认证、原游戏协议/玩法与三平台/官方可玩仍未完成，矩阵rev30仍7/13。[阶段验收](validation.md#stage114)。

<a id="stage113"></a>
## stage113：正常补丁入口与显式来源能力已完成，游戏消费者继续保留缺口

1589项stage112交付逐项hash一致后保存前态，依REA→规格→独立实现→验收顺序推进。当前目标仍是网页/移动网页/微信；本轮没有扩展native。知识库experience,requirement-index/3000查询缺requirement-index退出2，本页继续作为需求真源，未扩大到知识库/全局配置维护。[本轮方案](../analysis/launcher-current-entry-v1/plan.json)。

事实：正常选择后可以在账号提交前准备补丁；新增35条当前登录器、9条固定Patcher和4条独立游戏静态记录，10字节区间核对通过。按源补充固定Patcher两来源数据与web显式profile/ordinal；真实清单378操作超出旧256上限，补到512并保留其余约束。[源与规格](../analysis/launcher-current-entry-v1/implementation-spec.json)。

新建且分别使用一次的公开配置3GET、两来源清单2GET、变体包1GET方案均HTTP200；原超容量失败保留，后续离线重解析成功。11项新测试、8文件79Node通过。3000现有文件与两源声明相同，避免重复下载；另取6000作为不同样本，CRC/MD5/长度通过但原.text仍无文件字节，REA不能从该段恢复消费者。[网络与清单](../analysis/launcher-current-entry-v1/manifest-reanalysis.json)、[测试](../analysis/launcher-current-entry-v1/test-results.json)、[游戏能力](../analysis/launcher-current-entry-v1/game-capability.json)。

下一步需要有证据的正常原游戏消费者与字段语义，才能继续兼容游戏通信/玩法；运行前按最新目标核依赖、恢复状态与PID。暂无测试账号与调试材料，不重复索取聊天凭据，不填造会话/保护字段。当前切面完成不代表完整登录器或三平台可玩；矩阵rev29的20项状态保持7/13。[阶段验收](validation.md#stage113)。

缓存所有者原先投影丢失profile/ordinal，导致键相同、不同来源可误恢复；3项新回归已实际失败再修复。现在固定来源进入资源键并使用resources.v2，默认/旧缓存仍为v1；79项回归包含键、格式、页面恢复和旧缓存路径，浏览器V2持久化仍待验。

<a id="stage112"></a>
## stage112：正常连接控制源链与游戏只读前检已完成

1580项stage111交付逐项hash一致后保存前态；原四步顺序及网页/移动网页/微信目标保持。REA沿同hash139条快照取得16新记录/累计155，本轮21个不同函数、7处原字节锚点通过，已导出保存关闭。[阶段方案](../analysis/launcher-current-control-v1/plan.json)、[源核验](../analysis/launcher-current-control-v1/source-check.json)。

正常待登录段ready后直接调用type10；type1的9B两词格式已证、词含义/实际调用值未知，type2的两参数ABI与本次不使用参数的回调已证。现有opaque API和flow覆盖该字节范围，相关4文件45Node通过，本轮不新增业务字段或产品代码。[规格](../analysis/launcher-current-control-v1/implementation-spec.json)、[实际测试](../analysis/launcher-current-control-v1/test-results.json)。

在现有Parallels恢复输入后完成6条进程内赋值/只读命令，取得安装版游戏完整hash及`~ WIN7RTM`，临时全屏已还原；没有原游戏、观察器、新联网或账号执行。已有原创观察器5项源码及构建hash通过，历史Windows通过范围仍仅fixture profile。[当前前检](../analysis/launcher-current-control-v1/guest-preflight.json)、[游戏能力](../analysis/launcher-current-control-v1/game-capability.json)。

下一步继续查正常游戏入口与原消费者证据，先按具体方案核依赖、恢复状态和目标PID；不重放旧额度/脚本、不伪造票据/控制值。真实登录验收因暂无专用测试账号保留，游戏协议/玩法及三平台/官方可玩未完成。矩阵rev28的20状态仍7/13。知识库experience,requirement-index/3000查询缺requirement-index退出2，本页继续作为当前需求真源，未改知识库或全局规则。[阶段验收](validation.md#stage112)。

<a id="stage111"></a>
## stage111：现行record合同补齐，继续无账号连接控制

stage110交付1568项一致后保留前态，沿REA123记录快照续查发送/接收与缓存调度。123+16=139，本轮34不同成功反编译入口，已导出保存关闭；4源区间与8336B ASCII→1042个标准Pi字对应。[方案](../analysis/launcher-current-record-v1/plan.json)、[源核验](../analysis/launcher-current-record-v1/source-check.json)。

现行592300/59239f..3a8为ceil(n/8)*8+8，旧472e70历史证据为floor规则；592090允许cipher0/plain0。失败回归先证明29B请求由旧核心产生32B cipher而现行应40B，再新增显式current codec/stream/profile并让current flow/session统一选择，generic不变。13独立ECB记录/1最大摘要、3接收边界、3会话、65分片及相关7文件78Node全通过。[实现合同](../analysis/launcher-current-record-v1/implementation-spec.json)、[测试](../analysis/launcher-current-record-v1/test-results.json)。

本轮无新外部联网、账号或厂商/Windows执行，真实前置仍是stage110无回答的hello。用户已明确暂时无专用测试账号；下一步先核无账号的正常连接控制/版本消息，不把账号可用设为独立静态工作的前提，不重复索取聊天凭据或已答没有的PDB。矩阵rev27仍7/13，认证、原游戏消费者/玩法与三平台/官方可玩继续未验。

<a id="stage110"></a>
## stage110：现行握手源绑定、独立实现与一次真实前置观察

原四步与网页/移动网页/微信完整目标保持。1552项stage109交付逐项一致后保留14文档、6源/说明和矩阵修改前副本。沿现有联网/工具授权，先REA再实现，最后单次无账号观察；没有Windows/厂商执行、系统配置或安全变更。[方案与已用额度](../analysis/launcher-current-channel-v1/plan.json)。

当前客户端固定组约束在590c80/590bb0，591100缓冲784B；588690/58c9b0选1/key8，5912e0 hello8B。原通用模块未表达该版本约束，现新增两现行纯API和常量、flow/session显式current选项；保留旧generic数学输入，现行p-1边界按源码处理。REA新增17记录、本轮25不同成功反编译入口，累计123，会话已导出/保存/关闭。[源与实现](../analysis/launcher-current-channel-v1/implementation-spec.json)、[台账](../analysis/launcher-current-channel-v1/rea-audit.json)。

本机6项TCP检查通过后只向已绑定BIP一次连接，写8B/收529B，源组匹配、1483.317ms close，未回答挑战或提交账号；方案已用1次，不重放。新回归修复前失败、实现后相关78Node全通过。[运行](../analysis/launcher-current-channel-v1/network-observation.json)、[测试](../analysis/launcher-current-channel-v1/test-results.json)。

矩阵rev26仍7/13，只更新AUTH前置子范围和过期下一步。继续核现行加密记录/连接后状态与真实账号、游戏消费者；已有游戏.text文件字节缺口、玩法、目标设备及官方验收未解决。测试账号是否可用已询问，未请求当前操作/聊天凭据；未答不作为账号可用或登录已批准的证明。

<a id="stage109"></a>
## stage109：更新版登录契约与原生状态投影修复

原四步及网页/移动网页/微信完整范围不变。1540项stage108基线逐项一致后保存14份规范文档和5份源/测试/接口文档副本；先REA新版，再按已证差异修改shared。本轮知识库experience,requirement-index/3000查询仍因moli-mac缺requirement-index角色退出2，需求真源继续维护本页，未改知识库/全局规则。[计划](../analysis/launcher-current-login-v1/plan.json)。

REA新增59查询记录/43不同成功反编译入口，旧47记录保留；源码身份c82fc…c152对应已正常更新的6d459…c987。确认发送/回复布局及W0丢弃适配，完整回调仍16/10实参，不能据伪代码删尾字段。原共享实现额外拒绝非规范符号扩展word；两所有者已按原16位状态读写和选择汇编修正，未发明认证字段或添加平台依赖。[规格](../analysis/launcher-current-login-v1/implementation-spec.json)、[REA](../analysis/launcher-current-login-v1/rea-audit.json)。

修复前新回归实际因PROFILE_STATE_ENCODING失败；修复后48组原创向量贯穿解码/选择/交接，相关78Node全通过，5锚点与错误身份拒绝通过。此切面不等于完整登录器完成；下一步继续核游戏启动消费者/正常运行取证条件，现有游戏.text文件字节缺口、认证接受、游戏通信/玩法与三平台/官方验收仍未解决。矩阵7/13保持，无VM或真实账号操作。[测试](../analysis/launcher-current-login-v1/test-results.json)、[阶段验收](validation.md#stage109)。

<a id="stage108"></a>
## stage108：REA定位依赖后，正常自更新与主界面取得运行证据

持续需求仍为“REA分析登录器→实现登录器→REA分析游戏→实现游戏”，目标网页/移动网页/微信。先逐项回读stage107的1517项基线一致；已有shared/web/native源码保留，本阶段无产品源变更。

首次正常启动旧登录器9732创建更新器2484，父退出0、87.164秒点计数0、四文件hash相同；仅两条start，不能当更新成功。随后REA6.7.0/Ghidra12.1.4复核旧更新器0x401180非连续体及0x411410的xref；88字节锚点/8区间hash通过，完整框架参数赋值与加载器仍未恢复。[首次实证](../analysis/game-install-context-v1/lifecycle-runtime-stage108.json)、[REA范围](../analysis/game-install-context-v1/rea-updater-stage108.json)。

只读检查在平台目录、SysWOW64及7项PATH均未找到三个VC71依赖。官方Broadcom/VMware附件静态取出三项x86 DLL，所需258个导出均存在；Mac本地签名链未完成，Windows对同一外层包实际返回Valid，两者分别记录。只读D介质四文件hash通过；原四文件备份（含隐藏更新器）通过，再以File.Copy(String,String)无覆盖新增三个app-local DLL，完整hash通过；没有全局运行库/PATH/策略变更，也未执行VMware安装器。[诊断](../analysis/game-install-context-v1/diagnostics-runtime-stage108.json)、[来源](../analysis/game-install-context-v1/vc71-source-stage108.json)、[介质核验](../analysis/game-install-context-v1/vc71-guest-media-stage108.json)。

新修复方案只用一次正常父启动，实际9280→10436→9012；到达使用模式选择和V2.01主界面，选网吧模式、未填账号，52.325秒正常关窗。两登录器stop均为0；退出/点计数0的控制台回读在97.321秒，不能称全部回读都在90秒内。EXE变为1666048B/6d459…c987、RegionList变为467e…cd58，更新器/GameList保持原hash；同hash新版对应既有47条REA记录及已实现的当前配置刷新切面。更新器stop/退出码、映像hash及完整文件操作事务仍未知。[新方案](../analysis/game-install-context-v1/vc71-remediation-plan-stage108.json)、[补库与实际结果](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)、[新版对应](../analysis/game-install-context-v1/updated-source-bridge-stage108.json)。

两次观察的临时订阅/队列分别归零、专用管理员终端正常关闭；5个临时键盘项已撤回，原19项及顺序一致、窗口模式恢复。旧隐藏1e行是否清空仍未知，不盲目提交。没有新的手动操作请求。[输入收尾](../analysis/game-install-context-v1/keyboard-cleanup-stage108.json)、[唯一知识库](known-issues.md#vm-troubleshooting)。

下一步沿已核对的新版继续REA登录与游戏启动消费者，先形成可追溯规格再实现shared/薄适配层；已有配置/更新切面不冒充完整登录器。游戏.text文件字节缺口、认证、游戏通信与玩法仍未解决，协议矩阵7 observed/13 unknown保持；网页/移动网页/微信和官方可玩验收未完成。[阶段验收](validation.md#stage108)。

<a id="stage107"></a>
## stage107：正常安装身份闭合，保留原四步与运行缺口

需求真源继续是本次用户四步顺序与当前项目跨平台目标；按已有Windows/联网/工具授权自主推进，不重复Win7偏好或索要已确认没有的PDB/协议材料。

| 顺序 | 已有结果 | 尚未满足的完成条件 |
| --- | --- | --- |
| REA分析登录器 | 既有函数/资源/参数证据；本轮把正常安装的旧版二进制与源重新关联 | 正常更新器子进程、提交/ACK/恢复的实际生命周期 |
| 独立实现登录器 | 保留shared纯字节核心和薄适配层；本轮无接口或产品源变更 | 真实端到端兼容与目标平台验收 |
| REA分析游戏 | 保留既有入口/注册分析及原创8B夹具验证 | 正常原游戏消费者、参数/IPC实际消费与通信协议 |
| 独立实现游戏 | 保留已有资源/补丁等有界切面 | 有证据的状态/移动/战斗/认证及可玩验收 |

原平台安装器退出0、HKCU InstallDir两视图与两关键hash已验；用户结束页自动运行及中间进程未知。REA对同hash普通UPX输出复核资源143与7字节锚点，未升级任何游戏未知项。[安装](../analysis/game-install-context-v1/platform-installed-stage107.json)、[REA对应](../analysis/game-install-context-v1/rea-bridge-stage107.json)。

后续已准备新正常目录方案：先恢复实际输入、核未提交行/当前进程/文件/Win7新路径与恢复条件，再显式采用真实平台目录作为父工作目录。旧脚本、旧启动额度不重放；新方案显式启动0次，原程序本轮启动指令0。[方案与门禁](../analysis/game-install-context-v1/normal-launcher-plan-stage107.json)。

知识库按experience,requirement-index及3000预算查询，经显式build后仍缺moli-mac的requirement-index角色；本次直接维护此需求索引与项目排障真源，未改知识库项目文档或工具配置。完整目标未完成；当前一次焦点恢复请求待答，普通来宾输入尚未验收。

<a id="stage106"></a>
## stage106：平台正常启动到新许可页，等待本次协议确认

stage105的1503项交付回读一致；新鲜前检核E光盘及平台包完整hash，当前InstallDir32/64均缺项/值、exit1，两个默认父目录不存在，相关进程0，已安装游戏完整hash相同。沿用本项目Windows/联网/工具与补依赖授权，固定平台包有既有官方归档字节对应；正常启动/UAC各一次，原PID3440初始HasExited=False。[方案](../analysis/game-install-context-v1/platform-plan-stage106.json)、[前检](../analysis/game-install-context-v1/platform-preflight-stage106.json)。

实际欢迎页Next一次后显示北京易通幻龙网络科技有限公司的许可协议；“我拒绝”保持选中、Next禁用，Install点击0。完整正文只留私有build，来源字段/GBK严格回转及实际首尾分别核验，一次新许可确认已提交，尚非接受。[实际许可与全文位置](../analysis/game-install-context-v1/platform-license-stage106.json)、[运行](../analysis/game-install-context-v1/platform-runtime-stage106.json)。

答复后先核新鲜窗口/同一协议与当前选中状态，再继续现有向导，检查目的地、取消结束自动运行并回读平台目录/文件hash/两视图，不重放启动命令。游戏/登录器/更新器本轮启动0，产品源未改、13未知项不升级；原四步和可玩/网页/移动网页/微信/官方目标继续保留。

<a id="stage105"></a>
## stage105：正常安装已完成，新增真实目录观察配置并验原创夹具

本次固定安装/UAC确认已使用一次，先前同一等待已解除。1492项旧交付回读一致、恢复点元数据仍在；新鲜前检后完成正常游戏安装，实际默认目录及HKCU Path两视图已核，安装器退出0，结束页平台安装选项取消。四个关键文件完整hash相同，2369文件/总字节仅做聚合核对。未见新条款页的结论限于本次实际向导路线。[安装实证](../analysis/game-install-context-v1/guest-installed-context-stage105.json)。

在真实安装身份基础上增加独立 `game-installed` 固定配置，未搬样本或放宽原门禁；26项主机断言、编译后三配置/UTF16检查及两次构建相同通过，新工具在Windows原创夹具完成一次8B观察、observer退出0。夹具WaitForExit/HasExited为True、结束进程计数0，同PID退出码空值仍未知。[构建](../analysis/game-entry-v1/observer-build-stage105.json)、[运行](../analysis/game-entry-runtime-v1/windows-observer-stage105.json)。

下一步核平台正常安装上下文，再按已指定的Win7/登录器链观察原游戏消费者；不直接启动游戏来满足工具，不重放旧额度、脚本或Restore。完整四步及可玩/网页/移动网页/微信/官方目标保留，13未知规格未升级；产品源本轮未改，恢复启动未测，无新增人工解锁或焦点请求。

<a id="stage104"></a>
## stage104：完整范围审计后，等待既有安装确认

上一轮为实质进展：固定IFPS静态能力、条件函数及两视图查询。本轮1490交付项回读一致、游戏固定hash及.text RawSize0边界重核，仅为状态复核，无新消费者/业务规则；不是运行任务的verified wait。普通授权保持，本次来源执行/UAC确认尚未收到，自动goal继续不作为人工答复。

同一条件在三个连续goal轮次stage102/103/104出现；前两轮独立工作已完成，本轮选定正常路径需要安装后的实际目录/身份与运行消费者。完整七要求、13未知规格及候选路线审计后，goal实际设为blocked，非complete/paused。完整登录器生命周期、REA游戏消费者、可玩独立实现、网页/移动网页/微信和官方验收均保留。[逐项证据/三轮依据](../analysis/game-install-context-v1/blocked-audit-stage104.json)。

恢复只需回复已经发出的本次安装/UAC确认，不重复一般权限、终端操作或已确认没有的PDB/协议资料。之后按新鲜前检正常安装、新条款实际展示处理、取消自动启动并回读真实路径/hash/view，再继续游戏分析/实现；不重放旧脚本/Restore、不伪造Path/IPC、不恢复保护代码。

<a id="stage103"></a>
## stage103：安装条件静态语义与读取能力已核验

来源执行确认仍待答，本轮沿既有REA安装链继续独立静态工作，不把自动goal继续当批准。已从两包新私有解压头提取3778/3416B IFPS23；可信PyPI固定读取器及缺失依赖只在私有目录补齐，7项原创合成检查通过。GetLauncherPath/CheckPolCNSetup两函数体和8原字节锚点支持HKCU Launcher/InstallDir非空谓词；原字节事实、工具解释、运行未决分别列出。[选定结果](../analysis/game-install-context-v1/install-conditions-stage103.json)、[能力验收](../analysis/game-install-context-v1/reader-qualification-stage103.json)。

现有来宾32/64位该值查询均真实返回缺项/值及exit1；无注册表写入、厂商脚本/安装器/原游戏运行。下一步收到已发出的本次来源执行/UAC确认后，正常安装并处理实际新条款、取消结束自动启动、回读真实目录/hash/view，再决定游戏消费者观察。一般Windows/联网/工具授权沿用，无人工解锁/终端请求，不重问PDB，不重放旧脚本或放宽身份门禁。

本轮有实质静态进展，完整四步goal active/未完成；可玩、网页/移动网页/微信、官方及原生ACK/恢复仍未验收，20规格保持7 observed/13 unknown。原件、受影响文档与交付文件回读见[验收](../analysis/game-install-context-v1/validation-stage103.json)、[交付](../analysis/delivery-manifest-stage103.json)。

<a id="stage102"></a>
## stage102：正常安装静态链与介质就绪，执行待确认

按先行需求完成原安装包身份、Inno元数据和CG5Reg注册辅助链：REA25记录/4锚点、上游debug工具构建和两包只读metadata退出0。正常游戏安装器自身声明Path登记及有条件平台/登录器postinstall；条件编译脚本未验证，不手动伪造键或调用辅助程序来满足观察器。[静态结果](../analysis/game-install-context-v1/cg5reg-static-stage102.json)、[元数据](../analysis/game-install-context-v1/installer-metadata-stage102.json)。

原件保留不变。约1.1GB ISO经限定来宾的一次流式传输，镜像/两安装包来宾完整hash均相同，E:MOLIINST102实际只读、两包NotSigned；服务exit0且端口关闭。新原生快照已建/核元数据，未还原；22临时菜单已撤回并精确保留原19项。C盘前检剩余230837530624B，主机快照前剩余210020241408B，容量数字仅代表各次观察。[回执](../analysis/game-install-context-v1/transfer-session-stage102.json)、[恢复点](../analysis/game-install-context-v1/recovery-point-stage102.json)、[菜单撤回](../analysis/game-install-context-v1/keyboard-cleanup-stage102.json)。

当前尚未运行安装器、原登录器/游戏或旧脚本。游戏原件与当前官方发布字节对应未证，官网所链网盘被站点策略拦下，未绕过；只待本次来源执行与对应UAC确认，一般Windows/联网/工具授权沿用。后续正常交互安装，遇新条款实际展示再处理，取消结束自动启动，回读目录/hash/registry view后才决定游戏profile。[可复核方案](../analysis/game-install-context-v1/normal-run-plan-stage102.json)、[来源](../analysis/game-install-context-v1/source-assessment-stage102.json)。原四步及网页/移动网页/微信/官方目标仍active/未完成，20规格仍7 observed/13 unknown；不重放旧额度、不放宽身份/权限或恢复保护代码。

<a id="stage101"></a>
## stage101：原创观察能力已实测，继续正常游戏上下文

本轮正常访问恢复，原四步及网页、移动网页、微信目标不变。旧原创fixture的Win32加载失败已通过连续BSS布局修正，并增加构建检查；新PID的一次8B观察返回预期RVA、observer exit0。首个fixture仅WaitForExit=True（ExitCode空）；独立同步生命周期案例取得exit0与结束计数0，不混用PID回执。[身份与实际输出](../analysis/game-entry-runtime-v1/windows-observer-stage101.json)。

REA闭合所选原更新器journal/log路径构造；当前旧更新器hash与新样本分别记录，4锚点及26元数据差异重核。候选journal路径当前不存在，完整提交/ACK/恢复未验收。[证据](../analysis/launcher-update-recovery-v1/path-audit-stage101.json)。

下一步核验用户原安装包身份、正常安装要求与VM资源预算，建立完整正常游戏上下文，再决定游戏profile。当前固定样本仅在client-probe，规定路径不存在；已查询原生/32位Path键和INI所选模式，尚未得到正常目录。不得移动样本、写伪注册表/IPC或放宽身份/权限门禁来通过观察。[上下文](../analysis/game-entry-runtime-v1/game-context-stage101.json)。

不重放已消费的current.ps1/Restore，不重用旧启动额度，不恢复被禁的控制/提权分支；普通可逆工作自主继续。22项临时键盘菜单仍待精确撤回。完整目标active、未完成；旧stage100等blocked是历史。[本轮目标审计](../analysis/game-entry-runtime-v1/goal-audit-stage101.json)。

<a id="stage100"></a>
## stage100: Mac access blocked (2026-10-29)

电脑控制在连续3个 goal turn 均报告 Mac locked、自动解锁失败；未取得新来宾状态、提交新命令或运行观察器/原游戏。三轮阻塞审计已通过，goal 工具实际返回 blocked，完整目标尚未完成。

仅已有一次正常解锁请求保留，无需重复授权或再点击终端。解锁后先看未提交的哈希查询，核文件/备份/journal/原创目录，再验原创工具；旧脚本/Restore/启动不重放。22项临时菜单因锁屏尚未撤回，精确清单保留。不改锁屏/安全或使用已禁止控制路径。下列旧“当前”均为各阶段历史。

[stage100 audit](../analysis/game-entry-runtime-v1/access-blocked-stage100.json), [stage100 delivery](../analysis/delivery-manifest-stage100.json).

<a id="stage98"></a>
## 当前：前检取得实际结果，正常访问仍待恢复（stage98 / 2026-10-29）

stage97 的1427项写前均未变；原四步和网页/移动网页/微信验收范围不变。普通操作自主完成，只在不可替代的人工步骤求助，不重复既有一般授权。

新系统 NoProfile 终端实际返回 D=MOLICUR89、Restricted，以及原程序三名字/原创工具两名字的查询计数均0。随后哈希查询只输入前半段、未Return；CUA新报Mac锁定且自动解锁失败，已仅请求一次正常解锁，无需再点终端。恢复后先核未提交行。[实证](../analysis/game-entry-runtime-v1/guest-preflight.json)。

临时22项菜单尚待撤回；未改优化、VM硬件、网络、共享、保护或策略。新ISO未挂载、原创工具Windows执行0；文件hash/备份/journal/目录仍待核。先前检再验工具，不重放旧脚本/Restore/启动。20规格仍7 observed/13 unknown，615 Node/Chrome和26主机断言保留原范围。新锁屏第2轮，已有实际进展，goal active/完整目标未完成。[运行计划](../analysis/game-entry-runtime-v1/run-plan.json)、[目标审计](../analysis/game-entry-runtime-v1/goal-audit.json)。

stage99 复查：CUA 仍在 Mac locked／自动解锁失败处停止，未取得新来宾状态或提交命令。同一新锁屏已连续2个 goal turn；上一轮有实际前检进展，本轮无开发进展。已有一次解锁请求保持，不追加终端操作或重复授权。完整目标 active，恢复后先看未提交的哈希查询，再核文件/目录并验原创工具。[本次复查](../analysis/game-entry-runtime-v1/access-recheck-stage99.json)。

<a id="stage97"></a>
## 当前：三轮访问阻塞审计（stage97 / 2026-10-29）

上一goal turn为实质进展：游戏入口到运行注册边界及原创观察工具主机准备。当前先回读1421交付文件均未变，按唯一排障知识库绑定现有Parallels，仍在Mac锁定处停止；0来宾命令/0传输执行/0旧脚本重放。stage95/96/97是同一访问条件连续三轮，旧执行策略blocked次数未复用，不把待回复或锁文件当活进程等待。[新鲜前检](../analysis/game-runtime-access-v1/preflight.json)、[访问证据](../analysis/game-runtime-access-v1/access-observation.json)。

七项要求及20规格（7 observed/13 unknown）保持原范围。普通静态入口/注册引用工作和工具编译/主机验证已闭合当前切面，仍缺正常运行回调、argv/CGSharedMem与帧/认证/状态规则；更多维护代码、模拟界面、猜测字段或环境切换不供应这些证据。原生更新/恢复验收也需要真实来宾文件/进程/journal，不能由header/API/旧回执推定。[逐项证据、路线与阻塞门槛](../analysis/game-runtime-access-v1/blocked-audit.json)。

当前无可独立推进实际终态的下一步，交付回读通过后将goal设为blocked，不complete/paused。恢复条件为正常手动解锁Mac，或实际新增合法匹配业务材料；不再索要用户已确认没有的PDB/协议资料、不重复一般授权、不更改保护或安全配置。恢复后先核目标状态，再做原创工具Windows验收和正常游戏消费者观察，原四步及可玩/平台/官方目标不变。

<a id="game-stage96"></a>
## 当前：进入游戏源控制流与观察能力准备（stage96 / 2026-10-29）

上轮为实质进展，本轮先逐项复核 stage95 的1402文件均未变。沿用 v30“登录器自身已证契约验收，游戏消费者后续联合验证”的原门槛，继续固定游戏静态分析，不宣称完整登录器/官方验收通过。REA新增33记录/6函数、7原字节锚点闭合入口到注册/间接调用边界，静态槽零值仍不能给出业务消费者。[先行范围](../analysis/game-entry-v1/preflight.json)、[结果](../analysis/game-entry-v1/static-audit.json)。

为下一项实际缺口补原创观察器：固定两个 profile、精确8字节槽读取和只查指针页元数据；先查询身份/路径/磁盘hash，再申请只读进程句柄，比较创建时间，拒绝即停。已完成26主机断言、确定性编译、REA13记录/5锚点与ISO4成员回读，Windows fixture/guard/ASLR尚未验，不是新游戏模块。[先行工具契约](../analysis/game-entry-v1/observer-plan.json)、[构建运行](../analysis/game-entry-v1/probe/README.md)。

Mac锁定是本次恢复运行的第二轮同一访问条件，仍有独立实质进展，不复用旧策略阻塞次数。原人工解锁问题不重复发送，Windows/联网/工具授权保留；旧 current.ps1/Restore 和已消费启动额度均未重放。下一步正常解锁后，先核新鲜来宾状态并完成原创工具Windows验收，再定位正常游戏消费者。七要求/20规格（7 observed/13 unknown）与完整可玩/平台/官方目标保持。[逐项审计](../analysis/game-entry-v1/goal-audit.json)。

## 当前：恢复日志格式与新版源差异已闭合（stage95 / 2026-10-29）

上一goal turn只有重复授权确认，为无进展。本轮先重新核对stage94的1387交付项，均相同；从现有固定ISO重提旧样本，比对新内嵌updater，26差异字节全部属于时间戳/GUID，其余源字节和18已分析函数体相同。新hash独立REA9函数/35记录、8原字节锚点已导出关闭。[前检](../analysis/launcher-update-recovery-v1/preflight.json)、[静态证据](../analysis/launcher-update-recovery-v1/static-audit.json)。

先建立[实施规格](../analysis/launcher-update-recovery-v1/implementation-spec.json)，再实现16字节日志头的共享纯解析器；27原创Python向量、10定点、615Node/45文件、Chrome27向量/6断言组通过。原生只读前16字节而独立API要求精确header，两份尾随数据差异保留。阶段只是已写入标记，不替代实际文件状态、ACK或故障恢复矩阵。[验收](../analysis/launcher-update-recovery-v1/validation.json)。

当前get_goal实测active；先前缺临时策略回复条件已消失，授权已用，不重放。CUA新鲜getApp报告Mac锁定，来宾命令/原程序0，已发一次人工解锁请求；当前正常运行/日志读回须待实际访问恢复。本轮仍有独立实现进展，不套用旧blocked次数。继续完整REA登录器→实现登录器→REA游戏→实现可玩游戏及目标平台/官方验收，不把纯header或已知首屏作为全目标完成。[要求审计](../analysis/launcher-update-recovery-v1/goal-audit.json)。

## 当前：正常首屏、新样本核对与配置对提交入口（stage94 / 2026-10-29）

当次具体 RemoteSigned 回复已收到并使用：固定脚本 Verify/Install/Observe/Restore 各一次。新鲜来宾九成员hash及前检通过，备份四文件，仅替换EXE；一次显式初始启动的父进程2384退出0，观察到更新器1020、V2.01网吧模式主界面与普通退出。没有账号/游戏操作、强杀或持久策略改变。[授权执行对照](../analysis/launcher-current-runtime-v4/authorization.json)、[实际父句柄回执](../analysis/launcher-current-runtime-v4/observation-readback.json)。

Restore因当前EXE已不在原固定两hash而停止，未还原或重试；退出后1666048B新hash与独立新公开ZIP载荷一致，备份保留。自动更新/重启主界面为合理推测，精确子链、窗口映像和commit/ACK未捕获；初始1496576B文件不能认作全程同一版本。四个子PowerShell均返回，实际有效策略Restricted。[停止点](../analysis/launcher-current-runtime-v4/restore-stopped.json)、[策略回读](../analysis/launcher-current-runtime-v4/policy-after.json)。

按新身份重建REA分析，8选定函数、47记录、10源锚点通过并导出关闭；内嵌更新器新hash不沿用旧版全部语义。先建立[实施规格](../analysis/launcher-current-refresh-v1/implementation-spec.json)，再新增HTTP准备→IndexedDB原子配置对提交的显式工厂，保留原页面/旧profile。22定点、完整605Node与Chrome11项/73GET通过；浏览器初次网络审计失败及同步修订保留，未改产品来掩盖失败。[验收](../analysis/launcher-current-refresh-v1/validation.json)。

完整四步目标未完成，继续完成新版更新器/原生事务及故障恢复，再观测游戏消费者和据证实现可玩游戏；手机/微信/官方验收保留。原策略缺回复条件已解除，不复用旧blocked审计或重问同一确认；既有goal工具此前仍记blocked且无resume接口，未伪造状态变更。

## 当前必要运行链的阻塞审计（stage93 / 2026-10-28）

上一轮为实质实现进展，当前先完整回读stage92的1359项交付，再按唯一排障知识库读取当前Parallels。窗口/英输入可用，一次Get-ExecutionPolicy实际返回Restricted并回到提示符，替代stage90仅据Undefined推断默认策略的间接证据；没有新脚本尝试、策略变更或原程序运行。[观察与材料hash](../analysis/launcher-current-runtime-v3/observation.json)。

按原四步及目标平台/官方验收审计七项要求、20规格（7 observed/13 unknown，未升级状态）。已有inventory/MAP01和观察器准备确已完成，不重复实现或安装；旧临时游戏路径失效后仅复用项目现有缓存，hash与原样本相同且原.text raw_size为0。现有候选/离线测试不闭合正常启动、消费者/帧和可玩游戏。[逐项审计与备选路线](../analysis/launcher-current-runtime-v3/blocked-audit.json)。

同一策略具体回复在stage90/91/92/93连续未到，期间两轮独立实现已完成；当前没有可推进必要正常运行/消费者证据的下一动作。审计通过后提交goal blocked，不标complete/paused。现有授权和全部成果保留；收到此前仅进程RemoteSigned的具体回复后，先新鲜核验来宾路径/hash/进程，再按Verify→Install→Observe→必要Restore，不依据旧截图重复执行。[精确方案](../analysis/launcher-current-runtime-v2/policy-proposal.json)。本轮无产品修改，不重跑未受影响的583项测试。

## 当前新版元数据与独立HTTP入口（stage92 / 2026-10-28）

上一轮为实质进展，当前继续完整登录器。复核1346项交付并保存基线，恢复新版匹配REA快照，补12函数/8指令共20记录；导出总51条后关闭。32字节摘要保留比较大小写、地址/声明包长与配置请求顺序已形成[先行规格](../analysis/launcher-current-metadata-v1/implementation-spec.json)及三项纯API和显式createWin32LauncherBootstrap，旧默认路径保留。

已实现大小写敏感分支、声明包长及32MiB独立预算、严格Win32候选、rtm查询和整对XML检查/字节比较。缓存MD5是本地一致性记录，不是服务器摘要认证。63原创Python向量、25新增定点、43文件完整583Node及Chrome实际ESM/HTTP69GET均通过；源字节12锚点相符。[实际验收](../analysis/launcher-current-metadata-v1/validation.json)。

下一步仍是完整登录器的正常原版启动/更新子链、文件事务与恢复故障矩阵及目标平台薄适配；现有浏览器入口只准备候选，不提交文件或更新进程。Windows具体策略确认未答，本轮UI/命令/策略均0次；不把自动继续当批准。游戏消费者/协议及可游玩实现、目标平台和官方验收继续保留。完整四步目标active/未完成，Node/Chrome已实际退出0且REA关闭。

## 当前新版配置对检查切面（stage91 / 2026-10-28）

stage90是实际来宾进展；仅进程RemoteSigned的当次确认仍未收到，Windows脚本路径保持停止，不改变安全策略。独立推进新版主程序REA：恢复同hash快照，跟踪XML容器校验、逐字节比较、两文件提交/恢复入口；旧摘要刷新规则不扩成新版行为。[先于代码的实施规格](../analysis/launcher-current-catalog-v1/implementation-spec.json)。

本切面已实现两个纯核心能力：已解码XML的容器检查、调用者所给两份文件的字节比较。完整游戏/区域字段解析器保持严格；空容器通过只代表容器存在。11新函数/17条新REA、14源字节锚点、24XML/29字节原创向量、完整558Node及Chrome实际ESM核验通过。内部处理指令与既有有界解析器不兼容的失败已保留为明确profile排除，未改原向量或放宽解析器。[实际验收](../analysis/launcher-current-catalog-v1/validation.json)。

下一步仍是完整登录器：正常Windows启动/更新子链与当前HTTP完整规则、文件提交和恢复故障矩阵尚缺，现有导出不自动接入旧bootstrap。待当次策略确认后继续既定运行核验；有证据后再推进游戏消费者/协议及独立可游玩实现。完整四步目标active/未完成，本轮不是等待存活进程：Node/Chrome任务均实际退出0，REA已关闭。

## 当前来宾核验与策略停止点（stage90 / 2026-10-28）

继续“REA登录器→独立实现→REA游戏→实现游戏”及网页/移动网页/微信小程序目标。用户解锁后已实际恢复输入、挂载既有数据CD并核对九成员hash；Windows5.1语法检查通过。`-File`被执行策略拒绝发生在原创工具主体加载前，不是程序依赖或游戏失败；Install/Observe/Restore均未运行。[实际前检](../analysis/launcher-current-runtime-v2/guest-preflight.json)。

原stage89方案明确要求策略拒绝即停，本轮已遵守。新增[待确认方案](../analysis/launcher-current-runtime-v2/policy-proposal.json)只为独立PowerShell进程及其子会话使用RemoteSigned，保留固定hash/路径/进程/备份及一次观察约束，不修改持久策略；当次确认尚未收到，不能继续依赖步骤。原来三轮locked审计在用户解锁、状态变更前已失效，目标仍active，未标blocked/complete。

没有新产品代码、原程序执行或游戏/账号观察。两处限定运行库查询无对象不证明完整加载搜索失败；旧日志已载入数组的619字节前缀hash不同于最早619字节文件hash，不能再假设旧文件原样追加。先完成已准备的正常启动路径，再以实际证据推进游戏消费者，完整目标不缩减。

## 当前正常运行准备切面（stage89 / 2026-10-28）

上一轮为实质进展；本轮继续完整四步顺序，针对stage87实际长命令/晚确认退出问题，准备同路径新版EXE的可审阅恢复及独立计时工具。前置仍是本人解锁、普通来宾输入、当前路径/源hash/无匹配进程；固定新packed候选已核，不执行UPX分析副本。当前ISO只在主机build中，未挂载/传入来宾。[执行前方案](../analysis/launcher-current-runtime-v1/run-plan.json)。

原创工具分Verify只读、Install备份/仅替换EXE、Observe一次普通UAC/返回后90秒父句柄观察、Restore精确EXE恢复。没有账号/游戏/窗口标题/命令行/内存/网络载荷采集、强杀、执行政策绕过或新增权限。保留同一EXE路径及用户确认的Win7设置，不重复询问。其他三备份文件不自动恢复，不虚构全VM/应用状态回滚。

项目内便携PowerShell7.6.6已实际启动并做12项原创主机测试，ISO9成员回读相同；新能力只用于工具验证，产品及native不变。下一步正常解锁后先解析/hash核对，再Verify；旧加载DLL/ReadOnly原因、Windows5.1/原生恢复/首屏仍待实际证据，再推进游戏消费者。当前仍无法读取来宾，连续锁定条件为第2个goal turn，存在本轮准备进展，保持active而不提前标blocked/complete。[验收](../analysis/launcher-current-runtime-v1/validation.json)。


## 当前新版更新器与纯候选校验（stage88 / 2026-10-28）

继续原四步顺序与网页/移动网页/微信小程序目标。本轮在已定位需求后，按新样本独立完成更新器18函数/29条REA证据，导出后关闭；新主程序ACK资源复用stage87已核资源证据，再实际读相应21字节确认。旧样本门槛只适用于其声明profile，不扩成新样本或游戏验收。[静态审计与问题清单](../analysis/launcher-current-updater-v1/static-audit.json)。

新增 `decodeWin32LauncherUpdatePackage`，复用有界ZIP/CRC/MD5，仅补新样本可证的单EXE/长度/解压预算/Win32 GUI头校验；旧首条目接口保留。32MiB与可打印ASCII是独立更窄政策，原生事务/事件、完整PE/签名和运行均未实现。28份原创Python合成向量、4项额外边界、真实当前包与Python逐字节对照和完整548项Node通过。[先于代码建立的实施规格](../analysis/launcher-current-updater-v1/implementation-spec.json)、[验收](../analysis/launcher-current-updater-v1/validation.json)。

当前GUI工具报告Mac locked，自动解锁失败；人工解锁问题待答，现有Windows/联网/工具授权继续有效。无新来宾提交/新包传输/执行。恢复后先读清旧日志只读待提交行并验证输入，再完成旧更新器加载原因及可恢复的新正常启动观察，然后继续游戏消费者；不重问已确认没有的PDB或泛化授权。完整目标active且未完成。


## 当前正常启动与新版本取证（stage87 / 2026-10-28）

四步顺序与跨平台目标保持。当前普通来宾输入曾实际恢复，旧来源方案已使用一次：PID7684运行4秒、exit0；受控日志与已证成功启动更新器交接分支相符。未见稳定首屏、无子进程生命周期或更新替换证明，不能重用该单次计划盲启。[启动](../analysis/launcher-runtime-v2/startup-observation.json)、[后续](../analysis/launcher-runtime-v2/postrun-files.json)。

当前公开软件摘要已改变。取得新ZIP后，现有纯核心完成真实包CRC/MD5和Python逐字节对照；新登录器与内嵌更新器单独定hash。REA分离新旧样本，旧10条跟进含复用，新14条选定证据均已导出/关闭；当前只完成初步入口/交接定位，不认定新旧全部契约相同。[对照](../analysis/launcher-runtime-v2/independent-candidate.json)、[台账](../analysis/launcher-runtime-v2/rea-followup.json)。

下一切面是恢复可证明的终端提交，读目标特定加载错误/依赖，再完成新样本启动/更新器审计及可恢复正常运行。旧MFC71系列依赖与目标ReadOnly仅为候选原因，未实际补DLL、改属性、替换或运行新包；不再索取用户已确认没有的PDB，也不重问既有Windows/联网授权。[具体计划](../analysis/launcher-runtime-v2/next-slice.json)。完整目标未完成，未改产品/native代码或扩大未知认证实现。

## 当前公开补丁取证与阻塞审计（stage86 / 2026-10-28）

**最后访问复查：** 电脑控制在读取窗口前再次报告Mac locked且自动解锁失败，未提交原启动命令。需正常手动解锁并恢复既有终端焦点操作；当前Windows/联网授权保持。[最新工具结果](../analysis/launcher-patch-live-v1/access-recheck.json)。

既有VM自动暂停已通过原生“恢复”继续，覆盖层消失；PowerShell点击仍未打开终端，原登录器命令/UAC0，人工焦点请求保持。当前目录HTTP远端在响应前关闭、正常HTTPS握手EOF，均未取得新目录；另以已核验旧快照绑定怀旧首区域声明PIP作一次15秒Update.TXT请求，超时无正文。没有新清单/载荷/账号/执行，不以旧地址或菜单回执替代通过。[恢复](../analysis/launcher-patch-live-v1/vm-resume.json)、[HTTP](../analysis/launcher-patch-live-v1/network-observation.json)、[HTTPS](../analysis/launcher-patch-live-v1/https-catalog-followup.json)、[历史端点](../analysis/launcher-patch-live-v1/retained-source-probe.json)。

完整四步与网页/移动网页/微信小程序/最终官方验收范围保留；已有限定登录器实现、资源核心及native历史均保留，无产品改动。相同普通来宾输入阻碍已跨三个连续观察turn核实，独立取证路线本次无正文，需人工恢复终端焦点后重核guesthash并继续正常原登录器/消费者。既有网络/Windows/工具授权不重问；不重复索取用户已确认没有的PDB/调试材料。[全目标与阻塞审计](../analysis/launcher-patch-live-v1/blocked-audit.json)、[阶段验收记录](../analysis/launcher-patch-live-v1/validation.json)。

## 当前来源链核对（stage85 / 2026-10-28）

前轮新增来宾hash/签名与公开摘要是实质进展；本轮进一步取得官网实际HTTP链接的ZIP，其中安装器与原件逐字节一致，静态重新抽取的登录器/两XML也匹配来宾，REA独立清单确认。来源现可对应官网分发，HTTP/未签名限制仍保留，未把未回复的具体问题当作批准。按现有Windows/联网授权准备单次正常启动/UAC。[来源与当前启动方案](../analysis/launcher-provenance-v1/source-assessment-and-run-plan.json)。

较早Mac locked已在用户解锁后转为桌面可读；中断后的CUA绑定已重建，原生键盘菜单Win+Q实际打开搜索。普通点击/文字仍未落入来宾，已请求手动点PowerShell及终端空白处恢复焦点。重绑后尚未重核来宾hash，启动命令未输入/提交、UAC0，未运行原程序。最新主机网络/目录隔离保持；完整目标active且未完成，恢复输入后继续原登录器首屏，再推进游戏消费者。[最新输入补验](../analysis/launcher-provenance-v1/access-followup.json)、[验收](../analysis/launcher-provenance-v1/validation.json)。

## 当前原登录器联网启动切面（stage84 / 2026-10-28）

stage83已实际验证共享网络及原创x86目标7位点/退出0。本轮来宾原登录器/两XML哈希匹配固定源，Windows签名实际为`NotSigned`；主机公开更新摘要200/33B所称MD5匹配，来源身份仍未认证。[来宾核对](../analysis/launcher-runtime-v1/guest-preflight.json)、[摘要](../analysis/launcher-runtime-v1/update-metadata-preflight.json)。单次管理员联网观察的具体方案已准备，电脑控制工具对来源未核实软件的执行时确认已发出，尚未回复/运行。普通工具/联网授权沿用，不复用旧v23单次额度。[方案](../analysis/launcher-runtime-v1/normal-start-plan.json)、[验收](../analysis/launcher-runtime-v1/validation.json)。完整目标active且未完成；产品/native代码未改。


## 当前网络与原创观察目标验收（stage83 / 2026-10-28）

完整顺序仍为REA分析登录器→独立实现→REA分析游戏→独立实现。本阶段完成运行观察依赖的实际切面：前轮1220项交付与六文档基线核验后，按用户最新指令用原生工具栏菜单接通现有共享网络，来宾HTTPS HEAD200；再完成原创x86目标正常退出0及x86 CDB的7个固定返回位置/目标退出事件code0。[前置](../analysis/runtime-observer-v3/preflight.json)、[联网](../analysis/runtime-observer-v3/network-observation.json)、[实际生命周期](../analysis/runtime-observer-v3/fixture-lifecycle.json)。

ARM64 CDB实际启动了原创目标，但WOW64上下文/自动回调未通过，已正常qd分离。x86 CDB的Windows SHA256/签名Valid与版本26100.9457通过，架构匹配后观察成功。长GUI命令损字改为核验字节的只读CMD介质短入口；旧失败与四份介质分别保留，未改原样本/保护。[失败](../analysis/runtime-observer-v3/arm64-debugger-attempt.json)、[x86首次记录](../analysis/runtime-observer-v3/x86-debugger-attempt.json)。

下一步推进原登录器正常联网启动链，确认实际显示/更新与游戏消费入口。事件时间、通用采集器隐私及游戏业务协议仍未验；不伪造elapsedMs或凭字面量实现未知认证/帧。产品/native保留，未重跑无变更的产品测试。账号凭据本人输入，原程序新的实际条款/工具门槛按出现内容处理；本阶段不等于官方兼容。[验收](../analysis/runtime-observer-v3/validation.json)。


## 当前Windows工具验收切面（stage82 / 2026-10-28）

完整顺序仍为REA分析登录器→独立实现→REA分析游戏→独立实现。本阶段只补运行观察依赖，没有产品代码变更。stage81的1207项交付hash与六文档写前基线已核；普通GUI、原生恢复点和隔离状态沿最新证据使用，未重试故障Qt网络菜单或已取消CLI。

微软SDK26100.9457 ISO已实际下载，1173295104B，SHA256`a364f38f35a2ade85ca676361643276b87ec494b103988ae20d7cbbdf94523ad`。Homebrew补入sevenzip、msitools、osslsigncode及gcab/libgsf；19项选定组件签名/时间戳、15项双解码bytes和ARM64 PE身份通过。1001/1003提取差额、默认CA缺issuer与两Redist独立摘要异常分别保留；没有重签或放松验证。[组件](../analysis/runtime-tool-readiness-v1/sdk-audit.json)、[签名](../analysis/runtime-tool-readiness-v1/signature-audit.json)。

人工点击与来宾空白区捕获恢复后，完整只读命令已执行，原生菜单键盘导航接入D:SDK ISO；标准目录原先False只是安装前观察。Windows主安装器hash匹配/签名Valid。用户在具体许可门槛回复后，本次SDK许可已接受；Privacy No、仅调试工具534.0MB选择、微软安装器UAC及完成页依次确认。ARM64 CDB已实际启动，版本10.0.26100.9457，退出0，hash匹配、Windows签名Valid。[后续安装](../analysis/runtime-tool-readiness-v1/sdk-installation-followup.json)、[自检](../analysis/runtime-tool-readiness-v1/cdb-windows-check.json)。

下一步保持断网/共享隔离，用已审阅原创x86目标验证正常运行、调试停止/继续/退出和仅元数据观察，再按现有授权推进原客户端。工具自身启动不证明跨架构调试、采集器隐私、游戏协议或官方兼容；恢复网络和最终目标保留。SDK内部子包执行未逐项采集，Redist未手动执行。[验收](../analysis/runtime-tool-readiness-v1/validation.json)。

知识库Router按development/system-operations、experience/requirement-index、3000预算查询，因moli-mac缺requirement-index失败；未称双角色加载成功、未写其他项目/知识库，本仓库需求文档仍为需求真源。


## 当前恢复与环境进展（stage81 / 2026-10-28）

用户回复正常解锁，普通CUA现已取得既有Windows11；完整四步目标恢复active，沿用本项目联网/工具授权，不再复用stage80访问阻塞结论或重问权限。先定位原项目VM、建立恢复点，再实际验Windows观察器/原创x86目标，随后观察正常客户端消费者；不以准备替代游戏实现。

已创建原生快照`Moli-before-observer-install-20261028-stage81`，进度结束、元数据一项匹配，恢复启动未验。网络Source控件无响应，展开设备/网络父菜单后出现关键错误；正常关报告后桌面仍可访问，Connected0/IsolatedVm1保持。当前请求用户最小人工网络调整，未选择网络类型、安装工具或运行任何目标。[操作](../analysis/runtime-install-v1/gui-observation.json)、[恢复点](../analysis/runtime-install-v1/recovery-point.json)、[错误摘要](../analysis/runtime-install-v1/parallels-error-summary.json)。后续先核实网络结果，正式安装路线/实际条款与依赖按实测处理；固定403地址不重试。下面旧“当前”仅指对应历史阶段。

## 当前阻塞审计（stage80）

恢复目标后的三轮中，同一普通GUI访问阻碍持续；本轮新读仍在应用绑定前报告Mac locked。stage78完成联网/原创目标准备，stage79排除当前固定包直接获取路线，本轮无实现进展；当前剩余Windows步骤确需正常界面访问，符合blocked门槛。[完整需求逐项与可选路线审计](../analysis/runtime-access-blocked-v1/blocked-audit.json)。

现有工具/联网授权保持，无需重问，也不再要求用户找没有的PDB。正常手动解锁/普通访问恢复后，先验Windows观察器和原创x86目标，再观测正常客户端；全游戏/跨平台/官方验收目标保持且未完成。不以host模拟、元数据或文档改写替代进展。


## 当前访问与工具依赖（stage79）

上一轮为实质准备进展，本轮无实现进展。普通GUI入口再次报告locked；微软公开固定包HEAD及正常GET均403，0字节，停止该下载地址。当前工具/联网授权继续有效，正常手动解锁请求已发送。[状态](../analysis/runtime-access-v1/access-status.json)。完整目标保持active，后续先恢复普通GUI、沿微软正式安装路线验观察器/原创x86目标，再观测正常客户端消费者；不以未执行计划或host模拟宣称游戏完成。


## 当前恢复：联网与诊断工具准备（stage78）

**实际进展：** 5个主机HTTP路径200、两XML摘要匹配，原启动器/目录字节已实算；RegionList需刷新。TLS EOF与非全局DNS使来源身份未验。现有MinGW已构建原创无CRT x86目标，10项host C模拟、16处REA/源调用点、两次构建一致与ISO回读通过；REA已导出/关闭。当前CUA在应用列表前报告locked，未安装Windows工具、未执行来宾/原程序或改VM网络，已请求正常手动解锁。此为准备进展，完整目标保持active且未完成。[验收](../analysis/runtime-observer-v2/validation.json)。

用户已确认无额外调试/PDB/协议材料，随后恢复目标，并明确批准联网测试及本项目工具操作。先对已证官方更新/配置端点做无账号请求，固定响应身份；编译/静态审阅原创x86观测目标，核实Windows ARM/x86观察能力后再进入原客户端正常启动链。现有静态规格/实现保留；账号本人操作，不绕过认证/保护或放大采集为真实凭据/全内存。[写前基线与本轮范围](../analysis/runtime-observer-v2/preflight.json)。旧blocked记录保留为历史，完整目标仍未完成。

## 当前阻塞与恢复条件（stage77）

完整四步目标保持。本轮在第三步遇到的同一材料缺口已连续三轮核实：缺少版本匹配可分析的游戏消费端/协议材料，无法据现有字面量实现认证、帧、移动或战斗。第二轮原包2,368项与四DLL检查无新入口，第三轮输入/1,163项交付hash与关闭会话再次核对；定向公开资料查询未取得匹配材料，不作全网不存在的断言。当前符合blocked门槛，停止重复自动推进。[逐项完成/阻塞审计](../analysis/game-consumer-blocked-v1/blocked-audit.json)。

恢复需合法提供的版本匹配可分析业务构建、权威协议或去敏参考向量的本地路径；先核身份/范围。PDB只补名字/类型，不恢复缺失代码。既有登录器限定实现、资源核心与native历史代码保留；原EXE/VM/官方会话/保护修改无新增操作或授权。

更新：2026-10-27（Asia/Shanghai）。本文件是当前需求入口；实际证据与验收继续复用各专题报告，不复制历史进度。

## 当前用户需求

原始目标为“先使用rea分析登录器，再实现登录器，再使用rea分析游戏，实现游戏。”2026-11-08 用户将流程调整为：**先 REA 分析所有需求能力，再针对需求能力复刻开发**。当前执行顺序为[统一分析 A1..A4 → 按依赖开发 D0..D6](#capability-first-workflow)，不再沿此前小分支交替分析/开发。网页、移动网页、微信及完整登录器/游戏/同版兼容范围保持。

当前用户已补充本项目联网测试、缺少工具/依赖及Windows操作授权，并明确不再要求网络隔离，普通操作沿此推进。固定脚本的仅进程RemoteSigned具体批准与一次启动已于stage94使用；当前Mac锁定不撤销既有授权，也不能重放旧额度。新运行依新鲜目标/来源/正常流程和工具实际门槛处理，拒绝即停。账号凭据本人输入，不读取/保存会话秘密或绕过保护。目标沿用网页/移动网页/小程序共享核心，保留`native/`历史成果。

## 当前游戏消费者静态分析（stage76）

**实际结果：** REA两份函数/4次xref/1次所属查询共7记录，34源字节锚点通过；命令行缓存消费者引用注册/维护类开关，尚不能认作游戏argv，命名映射消费者仍缺失。已导出/快照并关闭。无产品变更/原EXE或官服操作；现有工具可用，未补装无关依赖。需匹配可分析业务材料或权威规格，已询问本地路径；无新材料不重复扫描。[验收](../analysis/game-consumer-v1/validation.json)。

登录器自身已证契约的限定门槛通过，进入配置Code11对应`cg_se_3000.exe`的argv/CGSharedMem联合静态核验。先复用历史packed-boundary/static-feasibility，重核固定hash和REA留存情况，再定位文件后备消费者；缺少可分析的业务字节时不得把载入器命令或匿名映射实现为游戏协议。[修改前基线](../analysis/game-consumer-v1/preflight.json)。本阶段无原EXE/VM/真实IPC/官服操作，最终平台与官方兼容目标保持不变。

## 登录器当前检查项（launcher-v30）

- 已有：已证候选到映射写入生产端/可关闭内存lease，非秘密UserMode偏好明确保存/回读/刷新恢复，显式ASCII/Windows-936/UTF-8字节适配与中文候选严格解码，配置/区域/Code原文绑定、显式XML缓存及HTTP初始化与实际会话合流；补丁审阅/选择、owned资源快照与本机CAS保存/恢复/再次选择已接入；HKCU显式快照/INI回退、静态文件计划和inventory保留。
- 已闭合子集：区域/输入/字节/候选模块；10秒UI定时器与异常轮换/关闭静态链、离线交换控制器；首次Config lookup/条件/原命令/结果生产计划及实际onlyRefresh控件/资源/交接分支。实际Config设置、游戏消费者与官方接受仍单独待验。
- 待追踪：实际ACP/IME/best-fit/其他代码页与输入通知、原许可/账号持久化、真实服务会话/opaque生命周期、来源信任与原生安装提交/回滚、目标平台；原EH/调度全行为仍未验。许可/会话内清理、更新ZIP/MD5/三操作与页面候选选择已有限定实现及验收，不再笼统列为未还原。
- 实现必须绑定REA地址/样本哈希和配置结构；官方XML只在临时目录本地读取，交付仅含元数据和原创夹具。
- 完成代码切片时同步根README、登录器分析、逻辑规格、架构、模块接口、资源格式、shared/web运行说明、验收与已知问题。
- 本轮前置状态见[preflight](../analysis/launcher-v6/preflight.json)；没有Git，修改前已保存本地源码/文档基线。TalonBrain项目需求索引查询缺失，本次在项目内建立本入口，不修改其他项目或全局规则。

本轮继续（launcher-v8）已核验UI `+1484/+1488`的控件绑定、16B校验与直接字节提交，并追`419fe0→4133a0`的回包业务消费。复用v7身份/快照，没有运行原程序。[修改前状态](../analysis/launcher-v8/preflight.json)、[14函数与独立case4核验](../analysis/launcher-v8/static-spec.json)。

**stage53实际结果：** 新增登录输入编排及游戏ID候选模型，18项新测试/总179项Node、Python3请求/6候选向量、4项DIALOG合成测试/13份真实模板、Chrome6项通过。callback/consumer实际为16/10个栈参数，修正伪代码遗漏的tailWordB；case4 Listing缺口由现有Apple LLVM定点补核。[验收](../analysis/launcher-v8/validation.json)。当前是实质进展；完整登录器和游戏仍未完成，下一步保持登录器主线，不提前宣称认证或游戏可用。

本轮继续（launcher-v9）已追`410df0`的10秒SetTimer、`414a00`超时清理、`41195e`异常轮换及`411bb9`父栈延续块；已有字节/候选模块已串成离线流程。[修改前状态](../analysis/launcher-v9/preflight.json)、[16函数台账与严格政策](../analysis/launcher-v9/static-spec.json)。

**stage54实际结果：** 新增单调时钟/总deadline、连接代次、预请求开启失败有限轮换、分段密钥交换/密文提交、回包/候选、取消和断流清理。Node200/200（新增21）、3组独立全流程向量、15定点指令、Chrome6项通过。[验收](../analysis/launcher-v9/validation.json)。这些是无socket的控制意图，独立严格政策与原Windows行为分开记录；完整登录器/游戏目标继续保持，下一步推进本地许可/记忆与更新/会话缺口。

本轮继续（launcher-v10）仅追固定登录器的本地许可/账号记忆与显式快照边界：复用v9快照，先核对Profile读取、写入、控件绑定与条件，再实现已证离线规则。修改前653项交付哈希和17项native文件匹配；[前置记录](../analysis/launcher-v10/preflight.json)。不读取真实用户配置、不接受条款、不执行原程序或官方连接。

**stage55实际结果：** REA新增42个不同函数/66记录，专题33函数；本地许可键、版本/force、四页及独立决定、登录页字段清空已静态闭合并实现。Node215（新增15）、独立Python23向量/4080个Node摘要对照/64轮参数核验、Chrome6项通过。两项输入边界复核缺陷已修复并验证。[验收](../analysis/launcher-v10/validation.json)。账号磁盘持久化、实际条款/存储适配仍未验；继续可信更新/变换/回滚与会话/平台接口规格，不提前标完整登录器或转入游戏。

本轮继续（launcher-v11）定位现有内嵌更新器的pak→new变换和摘要算法，并核对替换/失败边界；先REA取证，再实现已证离线字节处理。旧667项交付哈希匹配，固定86,016B更新器SHA256已核实。[前置记录](../analysis/launcher-v11/preflight.json)。不发出官方请求、不执行更新器或替换真实文件；可信来源/回滚属于独立实现约束，不能补造原程序已有保障。

**stage56实际结果：** REA23函数/26记录闭合ZIP首中央条目、Stored/raw Deflate、CRC和完整MD5；共享核心实现有界候选解码，依赖Pako3.0.2已核验并保留许可。Node232（新17）、15原创ZIP/独立摘要、真实ZIP→原EXE完整字节匹配、Chrome6项通过。descriptor CRC=签名歧义已修复并独立确认。[验收](../analysis/launcher-v11/validation.json)。来源信任/实际下载、事务替换/回滚和服务会话/平台仍未完成；继续登录器主线。

本轮继续（launcher-v12）按固定主登录器601b…副本追上游清单的文本变换、XML两摘要、更新定位文本/进度整数及本地比较，复用v10快照。[修改前状态](../analysis/launcher-v12/preflight.json)。687项前轮交付哈希匹配；只读现有静态材料，不请求官方清单、不执行原程序或更新文件。

**stage57实际结果：** REA新增19不同函数/24记录，专题26函数；主摘要singleton trim/cut、XML token绑定和正常启动分支已证。纯核心新增13/总245 Node通过，Python15响应/4目录组合、历史66B正文重建匹配保留SHA256及真实本地字节比较、Chrome最终6项通过。首次本地连接重置不计成功且保留原因未定记录。[验收](../analysis/launcher-v12/validation.json)。未把ASCII/正整数独立profile当完整旧locale/atoi等价；下载信任/文件事务、真实平台和会话仍待继续。

本轮继续（launcher-v13）复用固定主登录器v12快照，先闭合HTTP读取虚槽、返回状态和正常清理，再实现显式来源、可取消/有总时限和字节预算的GET薄适配。[修改前状态](../analysis/launcher-v13/preflight.json)已核对702项交付哈希。仅用本机原创HTTP服务验证实际I/O；不请求官方地址、不改现有离线页CSP、不执行下载内容或更新真实文件。原EH/所有locale与平台规则不靠新实现政策补成事实。

**stage58实际结果：** REA补入14函数/3短虚槽观察至233记录，独立14新锚点+17旧锚点重核通过。GET薄适配在原创回环服务串联清单/候选和ZIP核心，Node263（新18）、Chrome6项及独立18次传输对照通过。独立复核发现deadline与origin快照边界并修复；迟到拒绝分支再复验通过。初始测试假设与CDP ERR_ABORTED另列，不计成功。[验收](../analysis/launcher-v13/validation.json)。平台UI编排、可信来源/文件事务、实际账号/会话及官方兼容仍未完成；按顺序继续登录器。

本轮继续（launcher-v14）先核对原两个XML下载后的写入/解析顺序，再把已证元数据规则与GET适配串成可取消的初始化流程，并实现独立候选配置对缓存的事务语义。[修改前状态](../analysis/launcher-v14/preflight.json)719项哈希匹配。测试只用原创本地HTTP服务和独立临时浏览器存储，不写原游戏文件、不联网官方、不操作账号/VM；浏览器候选缓存不是原EXE更新事务或来源信任证明。

**stage59实际结果：** REA补入6函数至239记录、31固定锚点通过；闭合Write/短写/Close异常及Open3001→OPEN_ALWAYS，主调者两文件分开写、之后统一解析的边界已记录。新增初始化prepare/候选pair验证与独立IndexedDB缓存；Node285（新22）、Chrome原生12项通过，包括实际HTTP、自更新分支、存储失败/abort、CAS、晚取消已提交与重载。[验收](../analysis/launcher-v14/validation.json)。独立只读19项复核无可复现契约缺陷，未把其当独立IDB运行。当前仍未完成UI/账号/真实会话、官方信任或原生文件事务与游戏。

本轮继续（launcher-v15）把已验收候选缓存接入现有本地配置页，显式保存/恢复/重新检查/取消，处理版本冲突、旧异步结果和存储不可用；复用v6配置与v14缓存规格，不重跑相同REA。[修改前状态](../analysis/launcher-v15/preflight.json)737项哈希匹配。页面保留`connect-src none`、服务仅回环，不接官方端点或账号；浏览器验证仅原创文件与独立临时缓存。按用户文档要求在既有reports/analysis保存验收元数据；临时测试脚本和截图放项目外。

**stage60实际结果：** 页面已接入本机候选缓存，新增原字节File适配并通过Node288（新3）；Chrome实际页面14项、独立390px流程及GB18030原bytes保存/重载/恢复通过，最终200源码回环GET、0控制台warn/error及pageerror。并发模块连接重置经相同Handler队列5/64对照复现，只改本地服务backlog为64，正常SIGINT重启后16/16成功，路径/CSP不变。[验收](../analysis/launcher-v15/validation.json)。HTTP bootstrap仍与页面分开；继续条款/账号存储和会话接口的静态证据及独立实现，不把缓存页当完整登录器，游戏阶段保持后续顺序。

本轮继续（launcher-v16）沿固定样本复用v14快照，限定核查UserMode与Profile读写、会话内记忆边界；先追真实调用/分支，再实现有证据的非秘密模式决定与输入清理规则。[修改前状态](../analysis/launcher-v16/preflight.json)746项哈希及目标/快照身份匹配。不读取真实配置或凭据，不将模式存储意图当实际条款接受/账号持久化，也不执行原程序。

**stage61实际结果：** REA新增8函数/14记录至253，导出/快照后关闭；29固定操作数/3身份负例通过。新增纯模式初始化/切换计划及明确取消/确认政策，Node300（新12）、独立Python54向量与Chrome54向量/旧页面5项通过。[验收](../analysis/launcher-v16/validation.json)。精确名称查找未解析不当API不存在，实际按IAT核实5处Profile写调用；其他注册表/文件API与间接调用仍不能形成账号持久化全局结论。模式UI/真实存储、条款/账号与服务会话、完整登录器及游戏仍待继续。

本轮继续（launcher-v17）把已验收的交换控制器接到实际字节流I/O，补平台CSPRNG、单调时钟、总截止点、取消、迟到连接清理与候选生命周期；增加显式端点白名单的Node TCP验证适配。测试只连127.0.0.1上的原创Python/PyCryptodome对端，不请求官方端点、不执行原样本/VM或读取真实账号。复用v7/v9协议证据，不为普通适配重复REA；新执行政策与原Windows行为分开。[修改前状态](../analysis/launcher-v17/preflight.json)756项hash匹配。

**stage62实际结果：** 交换已从意图进入实际端口执行，原创Python对端独立推导密钥/解密并逐字节核对请求，验证候选/空候选/拒绝、分段/断流/截断与真实10秒超时后的关闭。Node335（新35）、Chrome6项通过；方法快照/失败元数据所有权两处复核缺陷已复现、修复并回归，端口测试的接受/关闭事件时序假设另列。[验收](../analysis/launcher-v17/validation.json)。Node是开发验证TCP端口，浏览器用注入流；网页/小程序实际传输、UI/代码页/条款/账号和服务生命周期仍未完成，不扩大为完整登录器或游戏。

本轮继续（launcher-v18）先用REA核查控件ANSI输入/代码页依赖，再实现浏览器可操作的登录会话流程与显式启用的回环WebSocket→TCP薄适配。输入暂采用明确标记的ASCII兼容子集，不把XML编码当账号代码页；条款只读取用户明确提供的本地文本，测试使用原创四页内容，决定限当前页面。原离线配置页和CSP保留，新运行入口仅连接启动时明确列出的回环原创对端；默认无官方端点，不执行游戏或账号存储。缺少的普通开发依赖按用户授权直接补齐、固定版本/完整性/许可。修改前778项哈希通过；[前置记录](../analysis/launcher-v18/preflight.json)。完整跨平台、官方认证/游戏和真实条款仍分别验收。

**stage63实际结果：** REA新增2函数/3xref，3原始IAT字节锚点通过、导出/快照后关闭；ANSI路径已证，实际ACP未知。新增可操作浏览器四页文本/保留方式/真实回环交换/候选选择，ws8.22.0已核来源/完整性/MIT；Node347（新12）、Chrome最终10项/167回环GET、Python独立核对4次完整浏览器请求通过。根入口404及输入变化保留旧候选两处实现缺陷已修复，6→4测试假设另列。[验收](../analysis/launcher-v18/validation.json)。仍未完成配置/bootstrap合流、非ASCII/真实条款/账号与服务生命周期、完整登录器/游戏/远程手机/小程序或官方兼容；继续当前顺序，不以本地测试替代这些条件。

本轮继续（launcher-v19）复用REA的Game Code/区域BIP/许可原文键及初始化证据，把文件读取、原bytes缓存恢复、HTTP候选准备与实际浏览器会话串联。所选BIP必须全部匹配显式回环白名单，不能静默过滤/改写；请求Code取配置数值，许可Code保留原字符串，不再从UI索引或+1推算。初始化只能准备候选，自更新候选不执行/替换；配置/区域变化必须清旧输入、确认和候选。修改前832项hash通过，21个目标基线保留；[前置](../analysis/launcher-v19/preflight.json)。仅原创回环服务/合成数据测试，仍不运行原程序、VM或官方连接。

**stage64实际结果：** 配置文件/缓存/HTTP初始化→Code/区域允许绑定→四页文本→原生WS/TCP会话已合流。复用7函数REA身份，不重复反编译；Code原文/数值不再+1或按UI索引推算。Node358（新11）、Chrome17流程+1时限测量通过；整体10052ms、429回环请求/1预期负例取消单列，Python独立核对5完整请求/另1取消，同页计数0→1。交付示例实际跑通且正常退出；测试初始假设修正与文档锚点修复保留。[验收](../analysis/launcher-v19/validation.json)。实际ACP/非ASCII、适用条款/账号存储、服务/opaque生命周期、可信更新/原生事务、游戏与各平台/官方兼容仍未验收；保持完整目标和顺序。

本轮继续（launcher-v20）按已证ANSI控件与16B请求边界，增加用户明确选择的ASCII/Windows-936/UTF-8纯字节适配和候选名称严格解码，不推断实际ACP或复用XML编码。Windows936数据从Unicode官方公开映射固定并保留许可；不做best-fit/替换/规范化，切换编码清输入/确认/候选，名称不能无损解码时禁止选择。真实回环交换与Python独立对照使用原创中文输入；857项hash通过、22目标基线保留，[前置](../analysis/launcher-v20/preflight.json)。原EXE/VM/真实账号/官方游戏服务仍无新增授权或操作。

**stage65实际结果：** 三种明确文本profile、16B计数、名称严格decode/reencode与会话失效/锁定已接通；Unicode官方固定CP936数据/License V3已补齐。Node369（新11）、21791映射/2149未分配/1037 UTF-8参考、Chrome9编码检查+17配置会话回归/1测量通过；936/UTF-8中文实际请求由Python独立核对，交付936示例另跑通/正常退出。[验收](../analysis/launcher-v20/validation.json)。误运行旧QA覆盖一份历史v19详细回执和3张临时PNG，精确原件未恢复；原身份与保留汇总/日志、当前独立重验和限制已单列[事故](../analysis/launcher-v20/artifact-output-incident.json)。实际ACP/真实账号/服务与更新信任、游戏/目标平台/官方兼容仍未完成，目标保持active。

本轮继续（launcher-v21）先复用已有REA证据，再追账号缓冲的读取/写入/销毁和框架Profile分支，区分页面内保留、模式设置与账号持久化；只在有调用/字节证据时实现对应离线模块，不读真实配置或账号。修改前887项交付hash通过，先保存13项文档/矩阵基线，新增修改目标在写前另存；现已增加shared/index与web登录HTML/app三项，共16项。[前置](../analysis/launcher-v21/preflight.json)。原EXE/VM、官方游戏服务与系统配置均不在本轮操作范围。

v21实现范围已收敛为：用已有UserMode整数读写事实，实现纯严格非秘密偏好记录、浏览器独立存储适配、明确保存/回读状态与刷新恢复。原账号字面字段22处引用和销毁路径只支持有界结论，不补造账号落盘格式；账号/复选框/编码/文本确认均不进入该记录。

**stage66实际结果：** REA补齐5函数/9记录至267，原文件完整.text与两段搜索26字面偏移、2析构CALL/4展开JMP一致；此为有界引用清单，原账号持久化仍非全局结论。新增严格非秘密mode记录与浏览器明确保存/回读/刷新恢复，取消/锁定/未知/写入异常状态已接线。Node380（新11）、Chrome12设置/9编码/17配置会话回归+1测量通过，总10041ms；恢复模式后的真实原创请求由Python独立核对。[验收](../analysis/launcher-v21/validation.json)。初始范围和selector错误已修正并保留失败，不扩展认证/游戏结论。完整账号/服务/更新信任、游戏/目标平台/官方兼容仍未完成，继续原顺序。

本轮继续（launcher-v22）集中登录器→游戏交接主链：复用候选选择、407a00启动/映射的REA证据，补查字符串复制与无符号radix转换；只实现已证生产端字节/内存所有权，保持游戏消费者/真实认证未知。修改前911交付hash通过、13文档/矩阵基线保留，代码目标写前另存。[前置](../analysis/launcher-v22/preflight.json)。不读取真实IPC或账号、不创建Windows共享映射、不执行原EXE/VM或官方连接。

v22已证生产格式为原字节gid/name、glt/opaque首NUL截断、tailWordA减0x80000000后按unsigned32→小写base32、尾空格与NUL。只输出映射写入前缀，不把未写尾部清零或生成可执行argv。页面接一次性可关闭的内存lease，游戏消费者/认证仍未知。新增3代码基线后共16目标；测试仅原创字节/本机独立对端。

**stage67实际结果：** REA4函数/7记录至274，补齐C-string共享copy体、unsigned32→base32与尾空格/NUL，21源锚点/126原创向量/42候选投影通过。新pure producer和private lease接入实际页面选择；Node390（新10）、Chrome8交接/9编码/17配置流程+1测量通过，总10039ms。pagehide就绪残留已复现修复，旧文案断言修正另列。[验收](../analysis/launcher-v22/validation.json)。没有创建Windows映射、argv、游戏执行或消费；消费者/身份/opaque寿命、argv/资源及更新/平台/官方兼容仍未完成，按原顺序继续。

本轮继续（launcher-v23）收敛到启动参数与资源枚举生产端：复用407a00/目录/区域参数证据，补查408840枚举与字符串拼接，先明确顺序、分隔/转义/文件名变换和工作目录，再实现纯数据计划。修改前940交付hash通过、13文档/矩阵基线保留，代码目标写前另存。[前置](../analysis/launcher-v23/preflight.json)。只用显式快照/原创文件测试，不执行EXE、不读真实IPC/账号、不动VM或官方网络。

v23实现范围：raw字节当前EXE/目录/Argsline/区域/Galaxy字段与七组显式枚举结果，按原空格和次序生成NUL结尾命令及cwd/局部进程条件。资源标题先剥最后扩展名、显式ASCII/C case profile、最后非首位下划线→冒号、info/graphic/anime/coordinate优先替换；保留provider枚举顺序和末行，不伪造Windows通配符/DBCS/实际顺序或执行。增加shared/index基线后共14目标。

**stage68实际结果：** REA新增24函数/7短读取至305记录，闭合raw命令/cwd及七组资源枚举生产子集，导出后关闭。49源锚点/3负例、Node404（新14）、独立Python48进程/4枚举向量、Chrome同向量和5既有ASCII文件名通过。首轮测试metadata投影错误已保留并修正；本轮无新UI/OS进程或游戏执行。[验收](../analysis/launcher-v23/validation.json)。ASCII/C标题、raw已解析字段与提供者枚举次序是显式范围，实际locale/DBCS/Win32匹配、上游条件/游戏消费、账号/服务、更新信任/原生事务与平台/官方兼容仍未完成。继续登录器自身缺口，目标保持active。

本轮继续（launcher-v24）将已证命令/cwd/七组资源与映射生产端接入实际浏览器配置/区域/候选选择。用户明确给目录并单独选择路径编码，浏览器目录元数据只作ASCII长文件名匹配子集；完整命令与映射由同一可关闭context持有，字段/目录/配置/生命周期变化使旧数据失效。修改前959项hash通过、19目标基线保留；[前置](../analysis/launcher-v24/preflight.json)。复用已验REA生产端，不重复原函数；不执行游戏/原程序/VM，不读真实账号，不连接官方。

v24复核已复现借出typedarray的fill可覆盖导致close后映射字节残留；修复前另存shared/launcher-handoff基线，共20目标。内建擦除及独立视图转移清理会加入回归；外部复制/转移后的目标缓冲仍属消费者，不声明全堆擦除。

**stage69实际结果：** 明确目录/独立路径编码/原生FileList元数据已接当前配置及实际回包候选，命令/cwd/资源/映射由同一closable context持有；目录变化/配置/生命周期清旧结果，未尝试时原映射流程保留。借出fill覆盖造成擦除失效已复现修复，分离buffer不阻断其他清理，外部转移目标不保证清除。17新/421总Node、45独立联合向量、Chrome9新/8旧流程、4+7真实原创请求独立核验通过，桌面/390px六项检查通过。[验收](../analysis/launcher-v24/validation.json)。复用REA源证据，没有新目标运行；实际Win32/ACP、资源内容、真实账号/服务、更新信任/事务、游戏消费和目标设备/官方仍未完成，继续原完整目标与顺序。

本轮继续（launcher-v25）先用REA复用固定样本当前快照，核实此前不支持的Galaxylist/Galaxy配置、Gamecode槽/顺序、选择与参数来源，再实现已证解析/选择子集。修改前984项hash和目标/快照一致，先存13文档/矩阵基线，源码改前另存。[前置](../analysis/launcher-v25/preflight.json)。不运行原EXE/VM/账号，不连接官方，不提前进入游戏阶段；固定RegionList无Galaxy数据，不能把合成夹具当实际服务器配置。

**stage70实际结果：** REA新增6不同函数/9记录至314（含一份旧helper重查，不计新/独立），闭合Galaxy Name/Gamecode/正文、当前game筛选/原index与1b4c参数。共享解析/显式选择及实际页面/缓存/统一交接已接通，跨游戏重名拒绝；不复现原inclusive循环/无界下标。26源锚点/3负例、63Python独立向量、Node436（新15）、Chrome6新/9旧及3+4真实原创请求通过，固定5游戏/12区域/8选择/5消息向量hash回归通过。[验收](../analysis/launcher-v25/validation.json)。固定配置无Galaxy，真实配置/原运行时、更新信任/事务/平台、真实账号/服务、游戏消费与目标设备/官方仍未完成，目标继续active。

本轮继续（launcher-v26）按完整登录器审计优先补UPD-GAME-001：固定Patcher_PUK3样本195f…身份重核，先追Update.TXT工厂/虚分派及create/append/replaceto实际消费者，闭合规格后才实现更新核心。修改前1007项hash通过，先保存13文档/矩阵，源码改前另存。[前置](../analysis/launcher-v26/preflight.json)。本分支是启动器关联的补丁更新，不是游戏业务协议；不执行原Patcher、不写原安装文件、不动VM/账号或官方网络，不用自更新ZIP规则替代游戏补丁规则。


**stage71实际结果：** 固定Patcher的Update.TXT语法/map/虚表、ZIP全条目和create/append/replaceto消费者已证；35函数/2读取/37记录导出关闭，28源锚点/3负例通过。新增纯字节候选与全条目ZIP解码，严格最终MD5/相对ASCII路径/输入不变政策与原shell/日志行为分开。Python31语法/10候选、Node457（新21）、实际Chrome同向量/8坏包通过，原创示例三操作已运行。[验收](../analysis/launcher-v26/validation.json)。矩阵revision19仅UPD-GAME从inferred改为限定样本observed，仍partial；真实包/来源信任、更新入口与平台存储/交互、原生替换/回滚和服务语义未验。登录器整体、后续游戏/目标设备/官方兼容仍未完成，目标active。

本轮继续（launcher-v27）先闭合当前游戏/区域的PatchEXE、PIP/PPort、安装目录到补丁启动的生产端，复用主登录器已有REA快照；已有Patcher语法/候选核心再与配置绑定，避免独立包处理停留在孤立示例。1027项前轮hash通过、13文档/矩阵基线保留，源码改前另存。[前置](../analysis/launcher-v27/preflight.json)。只做静态/离线与原创本机验证，不执行原EXE、写原安装目录、操作VM/账号或连接官方。


**stage72实际结果：** 配置Code/PatchEXE/PIP/PPort/目录到原补丁生产与退出规则已闭合；32锚点/3负例、32独立生产/21退出码与固定配置8命令通过。新增保留原PatchEXE正文、纯计划/退出解释、候选顺序迭代和显式来源/总时限/取消的HTTP准备，创建后追加读取前一步候选。Node478（新21）、Chrome11流程/13更新GET及旧核心回归通过，原创示例三GET正常关闭。[验收](../analysis/launcher-v27/validation.json)。16旧目标基线保存，REA新增1函数/1短读/4投影/1已有重查至321后关闭。没有安装目录写入或进程执行；下一步把准备/取消/候选选择接入页面并验生命周期。原生恢复/locale、来源信任、完整登录器与后续游戏/目标设备/官方兼容仍未完成，目标active。

本轮继续（launcher-v28）复用v26/27已证清单/入口/下载规格，把补丁准备、取消、候选审阅和明确选择接入实际登录页；所选候选文件列表进入资源参数，配置/目录/编码/文件/pagehide变化清旧结果并拦截迟到完成。前轮1056项hash一致，20项文档/矩阵/页面/本地服务基线已保存。[前置](../analysis/launcher-v28/preflight.json)。仅原创本机服务与显式本地文件，不写安装目录、不执行原EXE或接官方；页面通过不等于完整登录器/目标平台/游戏完成。

**stage73实际结果：** 基文件读取、准备/取消/审阅/选择/放弃已进实际页面，选中路径进入资源参数，配置/目录/编码/基文件/缓存恢复/pagehide清旧结果并隔离迟到完成。无新REA查询，两固定样本/导出hash复核通过；Node491（新13）、Chrome13补丁/6默认无补丁Galaxy流程及实际交付示例通过，桌面/390px六项检查与截图观察通过。[验收](../analysis/launcher-v28/validation.json)。候选不持久化、不写安装目录；原生恢复/来源信任、真实服务/opaque、完整登录器及后续游戏/目标设备/官方仍未验，原完整目标继续active。

本轮继续（launcher-v29）补齐所选补丁资源的独立本机保存/恢复与可供后续读取的字节快照。先定义明确的own-format和当前配置/区域/目录/编码绑定，再实现CAS原子存储、失败/取消/冲突保留旧版本，接入实际页面的明确保存/检查/恢复；恢复不自动选择或认证。前轮1089项hash一致，18项修改前基线已保存。[前置](../analysis/launcher-v29/preflight.json)。复用v26/27/28已有REA规格，不把自有IndexedDB事务当原Windows回滚；仅原创文件/本机服务与临时浏览器，不操作原安装目录、样本/VM、真实账号或官方网络。

**stage74实际结果：** 新pure资源快照/非秘密精确绑定与IDB单完整记录CAS已接明确检查/保存/恢复，恢复仍须审阅选择，owned bytes可供后续资源消费。501Node（新10）、Python2参考、真实IDB12项、页面13项及13补丁/6默认回归通过；实际4174示例保存/重载/恢复后独立原创交换通过，桌面/390px六项检查及截图观察通过。[验收](../analysis/launcher-v29/validation.json)。没有新REA查询、原安装写入或真实账号/官方请求；64MiB范围/原生恢复/来源信任/设备与游戏仍未验。下一步依据当前证据审计登录器自身门槛，区分可静态补齐/独立实现项和游戏消费者联合验证项；原完整目标active，不将新缓存当完整登录器或可游玩游戏。

本轮继续（launcher-v30）先逐项审计登录器原始需求、REA事实、源码与实际验收。发现目录适配把已证onlyRefresh固定0、页面无该控件；首次Config分支只有定位，条件/参数/结果规格未闭合。先复用主登录器REA快照，补查首次Config的有界链并实现纯计划，再接实际“仅刷新通行证”输入、失效与不同交接反馈；不将这些状态命名为认证。前轮1119项hash及主样本/导出/快照一致，19项修改前基线保留。[前置](../analysis/launcher-v30/preflight.json)。不执行Config/游戏/原样本、不改VM或读取真实账号/官方服务；游戏消费者仍在后续联合验证。

**stage75实际结果：** REA补闭首次Config的账号派生lookup/原命令/创建等待写0或失败继续，保存ConfigEXE正文；修复web onlyRefresh固定0，实际控件/锁/失效/0资源与不同交接已通。335记录（新1函数/2读取/11投影）导出关闭，26锚点/3反例、24生产/9结果/固定24、516Node（新15）、Chrome最终9新/32回归及示例通过。[验收](../analysis/launcher-v30/validation.json)。本阶段两首屏同名重写已留痕，新目录排他写入重验，不假称初始PNG恢复。

[门槛审计](../analysis/launcher-v30/launcher-gate-audit.json)保留全范围：已证登录器自身契约在声明profile内验收，下一步固定游戏版本做argv/CGSharedMem静态消费者联合验证，再推进资源/通信/游戏实现。完整登录器、原Config/真实账号/服务/原生恢复/规模/目标设备/官方仍未完成；依据上方第2项分开联合验收，避免循环门槛，不宣称完整交付或取得新动态授权。原完整目标active。

## 项目经验入口

本轮后续（launcher-v7）已沿`4153c0`提交前处理、`46d010`字段来源、`46cbe0/46cf90`连接配置与等待、服务端消息到回调继续REA分析，并补到密钥交换/Blowfish记录层。新增52个函数dossier，专题台账含60函数及4168B算法常量对照；大段反编译只在私有build，导出并保存快照后已关闭会话。[前置身份](../analysis/launcher-v7/preflight.json)、[规格台账](../analysis/launcher-v7/static-spec.json)。

**stage52保留结果：** 回包与未压缩连接字节核心已实现；新增36项、总161项Node通过，独立Python/PyCryptodome对照及Chrome6项运行检查通过。按用户要求直接补入固定4.0.3 Blowfish ESM和MIT许可，核验包完整性且不执行安装脚本。[验收](../analysis/launcher-v7/validation.json)。当时计划追两byte字段及回包消费者，现已推进至上方stage53；完整登录器/游戏仍未交付，不以原程序运行填补授权缺口。

**stage51实际结果：** 配置/区域与请求类型10的已证字节结构已实现，Node125/125、真实XML独立对照、5组原创消息向量及页面12项检查通过。[验收回执](../analysis/launcher-v6/validation.json)。完整认证、更新、游戏交接仍未完成；游戏分支本轮未开始。

[已知问题与操作知识库](known-issues.md)；电脑控制前必须复核该页的对应阶段。工具准备与游戏兼容分别验收；本轮不恢复UTM、旧PIN或取消的CLI排障分支。

## 需求关联资料

[登录器调查](launcher-static.md)、[逻辑/协议规格](logic-protocol-spec.md)、[架构与里程碑](architecture-and-milestones.md)、[模块接口](module-interfaces.md)、[验收](validation.md)。
