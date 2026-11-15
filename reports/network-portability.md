<a id="target-game-page-lifecycle"></a>

## 游戏页退后台、断开与重新入场

| 宿主 | 已核对的行为 |
| --- | --- |
| 桌面 Chrome | 实际游戏页在准备取消后清理迟到字节，重载后旧 ZIP 和连接关闭。普通标签页切换已取得可信隐藏和可见事件。所选场景在隐藏时暂停绘制，同一连接继续消费回复。对端在后台关闭后，重选素材建立独立连接。 |
| iOS 模拟器 Safari | 短时切到设置后，普通场景停止绘制，保留所选 ZIP 与同一连接。回到前台时已处理该连接的 1 条测试回复，仍需手动继续。另一次后台期间收到对端 EOF，前台无法继续旧会话，重选素材可重新入场。真实离页时旧 ZIP 和连接退役，新文档从空准备页启动。 |
| 微信 Page | 源码与 stage306 生成包通过 Node 驱动的 `wx` 形状端口。App 隐藏取消在途 ZIP 读，晚到缓冲区清零。游戏 Page 隐藏结束本次连接并清除选择，`onShow` 重新绑定绘制表面，重选后新连接可入场。重放旧消息和旧关闭回调未改变新会话。卸载后原所有者释放，新 Page 从空准备开始。 |

**事实**。Safari 的所测离页先报告 `pagehide`，随后报告可见性变化。旧客户端在离页期间记录 `LEGACY_ASSET_READ_FAILED`，视图与 ZIP 关闭，原 TCP 对端也收到 EOF。后续取证定位到 ZIP 内 `Graphic.bin` 的浏览器范围读。 [原运行与回归](validation.md#target-game-page-lifecycle-validation) · [本次读取取证](#safari-navigation-resource-read)

**设计**。UC-P14 按宿主事件和当前会话身份决定前台恢复或重新准备。UC-P11 沿同一串行流分别记录本地取消、对端 EOF 和旧连接退役。UC-P09 区分界面收起、读任务结束和可回收资源根。晚到资源、绘制或流回调归原所有者；仅显示暂停时，当前连接仍按其来源阶段接收数据。固定 SE、Item 的缓存和断线发布顺序以及固定 F5A 的回调归还沿已有协议规格。 [共享宿主设计](../analysis/capability-first-v1/shared-update-host-design.json#/game_page_lifecycle) · [原版收包](game-static.md#legacy-receive-retirement-order) · [登录连接退役](launcher-static.md#f5a-pump-retirement)

**设计**。游戏实例持有地址变化提示的旧值，连接重开仍沿当前接收身份准入。D5 沿 UC-P11 核退役连接的迟到读结果，以及同实例重开与新实例进入时的提示差异。 [适用的旧版行为](game-static.md#legacy-address-notice-retention)

**设计**。页面或 App 指向新素材时，旧读者仍持前一次已验证来源。微信适配器本机取消可先返回，宿主读取仍可能在途。资源排空沿 UC-P09 收到实际结束，连接关闭沿原会话回执。 [旧读和恢复边界](architecture-and-milestones.md#resource-reopen-reader-identity)

**本机对照**。受控串行读在场景素材挂起时暂未读取尾部 EOF。资料就绪后先形成逻辑 `playing`，随后消费 EOF 并结束运行层。D0/D2/D5 在 UC-P11 和 UC-P13 沿同一活动实例验实际读结束、首帧回执、提示准入和旧句柄退役。 [组合试次与适用范围](validation.md#capability-launch-entry-recovery-validation)

**待验证**。桌面窗口和系统的其他切换路径、长时后台、移动真机，微信支持环境中的实际建连、回调和关闭，以及持久化根在中断后的恢复，沿 D5/D6 和 UH-U01/U02。微信基础库实测已执行两次建连尝试，均未接入本地对端。将这些连接回执与资源读的实际结束一并接入重开用例。 [微信实际建连回执](#wechat-devtools-local-tcp) · [重开组合规格](../analysis/capability-first-v1/shared-update-host-design.json#/game_resource_reopen)

<a id="desktop-game-tab-visibility"></a>

### Chrome 切换标签页的暂停与连接结束

**事实**。Chrome 157.0.8103.51 在 macOS 27.2 的独立普通浏览器配置中运行实际 `web/game.html`，经现有回环桥接原创 TCP 对端。两个普通标签页位于同一窗口，四次 `visibilitychange` 均为可信浏览器事件。首次隐藏 1,192 毫秒，绘制计数保持在 5，场景输入暂停，当前 ZIP 和连接保持。对端回复的 22 字节在隐藏期间应用，角色朝向由 6 变为 2。前台仍需点击「继续」，同一连接随后恢复绘制。 [本机运行回执](../build/analysis/desktop-game-tab-visibility-v1/runtime.json)

**事实**。第二次隐藏时对端发送 EOF。回到前台前已记录 `peer-eof`，ZIP 关闭，旧连接退役。页面继续显示准备入口，旧会话的继续按钮不可用。重选同一原创素材后建立独立连接并完成入场。两条连接最终均结束。 [本机验收和范围](validation.md#desktop-game-tab-visibility-validation)

**设计**。D0/D5 复用桌面与移动既有暂停、EOF 和重开用例。UC-P14 根据当前会话决定能否继续，UC-P11 读取实际结束结果，UC-P09 管理旧资源和在途读。普通标签页的短时场景已取证，其他后台路径随宿主验收。 [共用规格](../analysis/capability-first-v1/shared-update-host-design.json#/game_page_lifecycle/desktop_chrome_tab_visibility)

<a id="safari-navigation-resource-read"></a>

### Safari 离页时的资源读结束

**事实**。iOS 27.0 模拟器 Safari 27.0 运行现有 stage306 游戏页及原创 ZIP。普通游玩在同源替换导航期间，Safari 的 `Blob.arrayBuffer()` 对 `Bin/Graphic.bin` 一笔读取返回 `NotReadableError`。读失败时客户仍在游玩，文件和库均活动。网页范围读通过共享库转成 `LEGACY_ASSET_READ_FAILED`，可信 `pagehide` 收尾后旧客户保留 failed，资源及连接均关闭。两次运行观察到的 ZIP 范围依次为 `[822,878)` 和 `[946,994)`，都在同一成员内。 [浏览器原始结果](../build/analysis/safari-navigation-resource-read-v1/runtime.json)

**事实**。保持活动时拒绝一笔 3,088 字节读取会显示资源错误。另两例把该读的成功数据或拒绝延到 `pagehide` 的关闭处理后。旧页都保持 closed、原因 `caller-closed`，新文档从空选择开始。成功的迟到缓冲经原适配器归零，受控拒绝的缓冲由夹具回收。四个原创 TCP 对端均观察到 EOF。 [受控读与连接结果](validation.md#safari-navigation-resource-read-validation)

**设计与待验证**。D0/D5 在现有页面所有者绑定可观察的导航意图，按活动代记录在途读和实际结束。保留活动页面真实读取失败的反馈。设备上的后退、系统离页和无法事先获知导航的错误分类按原用例现场核验。持久化根和长时后台继续沿宿主合同。 [共用规格](../analysis/capability-first-v1/shared-update-host-design.json#/game_page_lifecycle/safari_navigation_resource_read)

另一个同源导航试次中，音频上下文在可信 `pagehide` 收到关闭请求，旧文档随后完成晚到读清理。换出的页面与静态资源读取继续复用同一退役身份，音频完成由独立回执确认。 [移动 Safari 音频结果](validation.md#mobile-safari-audio-lifecycle-validation)

<a id="wechat-devtools-local-tcp"></a>

## 微信开发者工具的原生 TCP 建连实测

**事实**。开发者工具 2.02.2609250 在现有游客工程中普通编译，实际基础库为 3.18.0。原探针调用 `wx.createTCPSocket` 连 `127.0.0.1`，SDK 返回 `-4` 和 `invalid address`。本机监听器在试次期间接入次数为零。工程 `urlCheck` 为真。 [原生 SDK 回执](../build/analysis/wechat-devtools-local-tcp-v1/sdk-receipt.json)

**事实**。使用同机已有私有 IPv4 及符合现有端点校验的端口，运行由原适配器和取消控制模块打包的独立探针。`openStream` 返回 `STREAM_CONNECT`，本机对端接入次数为零。私有地址试次的 SDK 原因未直接捕获。 [适配器与对端回执](../build/analysis/wechat-devtools-local-tcp-v1/runtime.json)

**事实**。同环境的 `connect`、`write`、`close` 和四组 `on`、`off` 方法均存在。四组回调注册与移除调用均正常返回。D5/D6 的真实微信建连、字节收发、读取消和远端关闭继续等待具备测试条件的 SDK 或设备。 [接口探针](../build/analysis/wechat-devtools-local-tcp-v1/private-address/method-receipt.json) · [验收记录](validation.md#wechat-devtools-local-tcp-validation)

<a id="desktop-stream-lifecycle"></a>

## 桌面浏览器的实际流回执与关闭

**事实**。Chrome 156.0.8078.80 的原生 WebSocket 经现有 Node 回环桥连接原创 TCP 对端。浏览器收到 `written` 序号 0，TCP 对端收到完整原始字节，对端回复字节数为 0。邮件最终投递与附件结算仍按原同版结果要求验证。

**事实**。本次桥期限设为 3 秒。登录流到期后实际关闭 TCP，桥返回 `BRIDGE_TIMEOUT`，浏览器的待处理读返回 `STREAM_READ`。同页游戏流在就绪后跨越该期限并收到数据。取消其下一次待处理读得到 `STREAM_ABORTED`，随后观察到旧 TCP 关闭。新连接独立收到本次字节和 EOF。

**事实**。本轮窗口最小化后页面仍报告可见。请求冻结到恢复指令之间约 2.15 秒，最大帧间隔约 10.4 毫秒。两路读取结果均在恢复指令发出前回传。后续实际标签页切换已取得隐藏事件及完整游戏页对照。系统切换及其他宿主沿各自用例验收。 [原始运行](../build/analysis/browser-stream-lifecycle-v1/runtime.json) · [标签页实测](#desktop-game-tab-visibility)

固定 SE 与 Item 的接收错误可先处理已缓存记录，随后由轮询入口或就绪分支发布断线。现有网页对宿主 EOF 有终止路径，对已关闭流的迟到读取有本地回归。D5 按原用例核对三个目标端的具体错误、已取得的字节、结束回执和替换连接。 [原版顺序及本地回归](validation.md#legacy-receive-retirement-order-validation)

<a id="mobile-safari-stream-lifecycle"></a>

## iOS 模拟器 Safari 的后台收包

**事实**。在 iOS 27.0 模拟器中切到设置，Safari 的同一文档从可见变为隐藏，2,119 毫秒后切回可见。按页面序号，四字节回环 WebSocket 消息在隐藏事件之后、恢复可见之前读到。前台、后台和恢复共用一条连接，恢复后也完成字节回显。隐藏前后的帧计数相同，所选最大帧间隔为 2,358 毫秒。

**事实**。后续在同版本 Safari 模拟器中接入仓库原浏览器适配器、Node 回环桥及原创 TCP 对端。登录流收到 `written` 序号 0，对端实收 5 个原始字节。页面隐藏 4,914 毫秒，游戏流在隐藏期间读到 6 字节，并在前台命令之前交付回执。设置为 9 秒的登录流到期时，旧 TCP 已关闭，桥返回 `BRIDGE_TIMEOUT`，待处理读以 `STREAM_READ` 结束。游戏连接保持可用。 [实际桥接记录](../build/analysis/mobile-safari-stream-lifecycle-v1/runtime.json)

**事实**。恢复后，对同一游戏连接发起并行读返回 `STREAM_BUSY`。取消待处理读返回 `STREAM_ABORTED`，实际旧 TCP 关闭。替换连接独立发送 3 字节，随后读完对端 7 字节和 EOF。最大帧间隔为 5,197 毫秒。**设计依据**。UC-P09/P11/P14 允许绘制暂停时接收和报告字节，分别确认连接退役、重连与业务结果。长时后台、完整产品、真机和微信继续验收。 [移动桥接核验](validation.md#mobile-safari-stream-commit-validation) · [早期直接 WebSocket 运行](../build/analysis/mobile-safari-resource-lifecycle-v1/runtime.json) · [存储和恢复](architecture-and-milestones.md#mobile-safari-resource-lifecycle)

## 登录连接的关闭请求与回执

固定 F5A 的连接维护防止嵌套推进，所选关闭回调结束后才解除底层登记并释放记录。本机流夹具已验证取消返回与关闭回执可分开，旧连接迟到的读和关闭结果归原尝试。D0/D1/D5 复用现有身份和宿主退役端口，沿 LS-T20 以实际三端关闭回执验收。 [来源与用例](launcher-static.md#f5a-pump-retirement) · [本机对照](validation.md#f5a-pump-retirement-validation)

stage306 在收到所选合成拒绝结果后请求关闭，两组用例分别延后成功和失败回执。替换尝试保持独立待收包。F5A 的消息送达与通道重绑另按实际宿主证据核验。 [报错准入与本机结果](validation.md#f5a-modal-connection-admission-validation)

<a id="launcher-startup-functional-specification"></a>

## 当前登录器补证：嵌套退出hook的安装与所选分支已成规（2026-11-11）

QH沿固定C82 App Init的正向OLE初始化调用补齐EA-F13：45C46F在所证mode/HRESULT条件下把45C570写入44FD1F所得对象+3c；alternate mode可返回1而不走本体setter。45A8A6实际以(1,1)调用，再在正常返回后投递退出消息，不能把所有nonzero初始化结果或quit请求当作资源/登录通道已退役。

所选45C502(1)先执行条件OleFlushClipboard、factory链遍历和先移除再虚槽0调用，然后跳过本地零参filter删除/COM-uninitialize分支。实际module flag、资源成员/间接效果保来源条件；不据所选代码报告必现重绑/死锁或完整Windows关闭接受。普通modal期间形成替换binding的合法producer/投递准入、LS-U3实际消息/销毁和Host drain仍待。

新增7必要完整native/477B，复用App Init与quit两完整体；9窗1679B/531指令核原PE，REA已导出关闭。形成9事实、2推导、5操作、3组开发差异和8项未执行接受案例。停止已答OLE/MFC库存扩张，仅沿原必要正向对象/producer或Host证据继续。

原40/81/37/10/6、owner/依赖/批次/profile及14端口62方法保持；19项固定来源本域规格就绪不变，L03/L06/L08及统一A1..A4不提升。产品仍stage306，本轮无产品修改、目标测试/构建、VM/SDK/网络/账号操作。原GP补丁五组与UH三端发布/恢复方案直接复用，先全部能力成规再按D0–D6开发。

本轮没有新网络连接。quit hook身份与(1,1)所选分支是静态源证据；连接取消、外层会话退出、底层IO关闭排空和真实平台后台恢复仍分别沿原合同接受。SDK历史请求未在本轮查询或重发。

[quit hook合同](../analysis/capability-first-v1/launcher-quit-hook-contract.json) · [源核验](../build/analysis/launcher-quit-hook-v1/source-review.json) · [本轮核验](../build/analysis/launcher-quit-hook-v1/validation.json) · [原补丁规格](../analysis/capability-first-v1/launcher-game-patch-functional-specification.json)

<a id="launcher-exit-admission"></a>

## host退出顺序不由局部流测试代替（2026-11-10）

EA源顺序将窗口关闭请求、准入/延迟、外层quit与通道最终释放分开；旧callback同步退役的推论显式受hook正常返回等条件限制。源PostQuit helper带可选callback，不能按纯消息投递移植；实际Windows/三端消息和销毁顺序仍需host接受。

本轮没有新socket/SDK或目标执行，LR四例只引用既有结果。原WeChat服务端口设置授权请求仍待原回复，不启用、不换CLI或重试认证绕过；当前同版账号官方接受未执行。

[退出准入合同](../analysis/capability-first-v1/launcher-exit-admission-contract.json) · [源核验](../build/analysis/launcher-exit-admission-v1/source-review.json) · [既有端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-exit-admission-v1/validation.json)

<a id="launcher-callback-reentry"></a>

## 取消与迟到端口已局部核验，宿主消息顺序未验（2026-11-10）

四个原创deferred端口例在现有session执行：取消后的迟到open/read/write及raw.close回调同步启动B，均不关闭另一实例。使用独占raw、显式clock/timer与原创字节，没有socket或SDK；不把此层验证写成真实三端接受。

源timer100、engine332与keyboard36a各有不同gate，MainStop后错误prompt的普通命令投递/新binding及About/exit销毁仍待。原SDK服务端口设置授权请求仍待回复，不启用、不重试认证或换CLI绕过；原账号/当前同版官方接受未执行。

[回调入口合同](../analysis/capability-first-v1/launcher-callback-reentry-contract.json) · [源核验](../build/analysis/launcher-callback-reentry-v1/source-review.json) · [端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-callback-reentry-v1/validation.json)

<a id="launcher-legacy-failure"></a>

## 旧版失败/计时器与目标传输政策分列（2026-11-10）

旧版显式连接/context Exp可在匹配state11处理器中推进；数字send失败及容量非正没有相同自动throw/retry证据。容量wait无局部deadline/取消退出，target异步host须接原owner合同并明确其期限政策。源完成flag来自实际timer/callback，不以单调clock参数替代原Windows调度证明。

55顺序目标例与源标量顺序相符，10个initial0最终失败的即时清理不同；其他异常、Close invariant失败和current LS-U3只按具名准入继续。129例没有socket、SDK或账号官服，真实三端/当前同版游戏接受及SDK原请求状态不变。

[旧版失败合同](../analysis/capability-first-v1/launcher-legacy-failure-contract.json) · [源核验](../build/analysis/launcher-legacy-failure-v1/source-review.json) · [纯目标对照](../build/analysis/launcher-legacy-failure-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-legacy-failure-v1/validation.json)

<a id="launcher-derived-material"></a>

## 材料规则与原网络/生命周期接受分开（2026-11-10）

current前置peer区间通过不表示派生完成；p-1偶数指数shared1会在完成长度门槛拒绝。目标现有current拒绝正确复用，旧版所选初态的partial prefix差异归DM-D1。不得由这些静态字段推真实服务端接受、身份真实性或同版游戏交接。

普通池清理的归还/清零顺序与目标异步owner/retire合同分别保留；27例只运行现有纯核心，没有socket、原程序或SDK。原三端、背压/后台/IME、当前同版消费者、账号官方接受继续独立，微信首次授权原任务未重发。

[材料合同](../analysis/capability-first-v1/launcher-derived-material-contract.json) · [来源核验](../build/analysis/launcher-derived-material-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-derived-material-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-derived-material-v1/validation.json)

<a id="launcher-session-functional-specification"></a>

## 登录时钟、背压与来源协议分列（2026-11-10）

所选源challenge/record profile保留旧601b和更新c82f差异；当前每候选首10秒、成功提交后另10秒，不等于现有纯flow开始时单个10秒deadline。DNS job/通道ready/capacity/已提交回复阶段分别保持，源signed32 tick与目标单调clock之间须由明确合同连接。

原写容量service/Sleep1不移植为网页忙等；异步host的写入、排队、关闭和retire要接既有14端口。882检查只跑纯字节/时钟，无socket、SDK或官服。当前微信首次工具设置请求仍待回复，复用原任务，不借CLI或其他路径绕过。实际三端/同版游戏/账号接受保持未完成。

[双来源操作规格](../analysis/capability-first-v1/launcher-session-functional-specification.json) · [来源核验](../build/analysis/launcher-session-functional-specification-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-session-functional-specification-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-session-functional-specification-v1/validation.json)

<a id="wechat-sdk-host-probe-preparation"></a>

## WH本机TCP探针已准备，真实微信流未测（2026-11-10）

[原创peer脚本](../build/analysis/wechat-host-conformance-v1/tcp-peer.mjs)只绑定127.0.0.1临时端口、接收固定257B原创模式并分块回显，最大观察120秒；目前未启动。SDK项目保留域名校验，不改服务/CLI安全配置来制造通过。

微信开发工具首次Codex授权明确会开启服务端口，该变化等待具体确认；同auth任务查询因server未启动失败，未重发原操作。此端口是工具控制入口，不是游戏/TCP对端成功证据。[WH状态](../analysis/capability-first-v1/wechat-host-profile.json)

现有网页桥接/wx形状本地夹具、部署/真实设备网络与当前游戏/账号官方接受继续分层，本轮网络测试执行0。

# 网页、移动网页与微信小程序的网络适配调查

<a id="stage235-legacy-server-return-fade"></a>

## stage235 播放退场时保留连接

桌面和移动尺寸 Chrome、微信 Page 源码与构建产物在本机对端发送通知后进入逐行退场。对端检查确认前仍保持连接且无后续发送。微信的战斗路径另外等到战斗画面已提交，再发相同通知。确认后对端观察到连接结束。

[验收记录](validation.md#stage235-legacy-server-return-fade)

<a id="stage234-legacy-server-return"></a>

## stage234 服务端退出的本机验收

独立 Python 对端在常规入场和两条步行请求后，分片发送拒绝、成功、重复通知与后续位置包。它在用户确认前检查连接仍开放且没有后续客户端字节，确认后取得连接结束。桌面及移动尺寸 Chrome、微信 Page 源码与构建产物均通过。

[验收记录](validation.md#stage234-legacy-server-return)

<a id="stage233-legacy-frame-startup"></a>

## stage233 单字段启动经本机对端验收

桌面、移动尺寸 Chrome 与微信 Page 以相同的旧版字符串选择普通上下文。每次入口测试连接独立的本机原创 TCP 对端，核对角色入场、两条步行请求和换场。原样本与官方服务器的实网会话仍待验证。

[验收记录](validation.md#stage233-legacy-frame-startup)

<a id="stage232-legacy-ordinary-context"></a>

## stage232 本机对端验证普通移动

网页通过既有本机桥接，微信 Page 通过测试宿主连到独立 Python 对端。实测登录、选择角色、入场和两条步行请求，再接收位置与换场数据。两种宿主通过各自输入入口驱动相同共享状态。

[入口验收](validation.md#stage232-legacy-ordinary-context)

<a id="stage231-legacy-display-startup"></a>

## stage231 入场数据就绪后建立画布

网页和微信经本机原创 TCP 对端验证启动、角色列表、升级确认和入场。测试先发送位置及地图数据，稍后提供缺少的角色资料，再观察真实画布绘制。位置修正沿用已有的共享收包效果。

[入口验收](validation.md#stage231-legacy-display-startup)

<a id="stage230-legacy-config-startup"></a>

## stage230 资源定位完成后进入本机游戏连接

网页从选定文件夹读取配置，微信从选定 ZIP 读取。原创新资源仅放在配置指定的目录，同名命令尾指向不可用目录。两端在配置生效并读取资源后才建立本机 TCP 路径。独立对端核对首包与角色列表请求。

[入口验收](validation.md#stage230-legacy-config-startup)

<a id="stage229-legacy-startup-materials"></a>

## stage229 摘要生成与本机连接

文件检查在建立 TCP 或网页桥接流前完成。网页对端与服务限制于本机。微信 Page 测试经模拟宿主转到本机 TCP 对端，用原创票据字节和回复验证首包、人物列表及断开。模块文件只供本地计算，首包携带计算所得的 32 字节摘要。

[本机验证](validation.md#stage229-legacy-startup-materials) · [平台待验收](known-issues.md#stage229-legacy-startup-materials)

<a id="stage228-wechat-special-dialogs"></a>

## stage228 特殊对话的 TCP 校验

**事实**。独立对端核对给予、折算确认、接受与拒绝，双字段确认和取消，以及外观提交和图文确认的两个按钮。双字段用例包含 Windows-936 尾字节 `0x5c` 及取消时的分隔符转义。无效确认、过期输入和外观箭头保持本地。

**事实**。普通图文用例继续核对原有选择编号，缺图时可读并可关闭。图文确认另测本地关闭和随后恢复移动。

**待验证**。真实微信设备网络、现行登录交接和官服会话。

[独立对端与回执](../analysis/game-wechat-special-dialogs-v1/validation.json)

<a id="stage227-wechat-family-board"></a>

## stage227 家族与留言的 TCP 校验

**事实**。独立本机对端检查家族名、会馆名、称号和权限写入，覆盖无权限操作、相邻邀请、成员分配、移除及自己退出。无关的资料与名单更新保持等待，目标回包解除等待。

**事实**。家族兽夹具核对普通与特例喂食、名称转义、权限撤销、关闭回复及饲料箱静默关闭。留言板夹具核对同窗刷新、双向翻页、Windows-936 发帖、指定行删除和本地关闭。

**待验证**。入站家族邀请、微信设备网络、现行登录交接和官服会话。

[独立对端与回执](../analysis/game-wechat-family-board-v1/validation.json)

<a id="stage226-wechat-storage-trade"></a>

## stage226 仓储与交易的 TCP 校验

**事实**。独立 Python 对端核对拆分存入、整组取出、宠物双向移动、金币上限与仓储关闭。独立饲料箱夹具核对两次物品转移、两类受限物品类别及绑定标志，并验证本地和对端关闭均无回复帧。

**事实**。交易夹具核对候选选择、发布、对方报价、双方确认、对方撤回、失效后的撤回与重新报价、直接开窗和退出。回包之间检查未确认草稿与无效请求的静默，以及关闭后的移动和断开。

**待验证**。真实微信设备网络、现行登录交接和官服会话。

[独立对端与回执](../analysis/game-wechat-storage-trade-v1/validation.json)

<a id="stage225-wechat-map-services"></a>

## stage225 治疗与训练的 TCP 校验

**事实**。本机 Python 对端发送治疗、人物训练、宠物训练窗口，核对玩家坐标、窗口序号、NPC ID、按钮和文本回复。校验包括治疗行 5、完整治疗 9、取消，人物学习、遗忘序号 2、失效后返回 99，以及两套宠物目标与栏位选择。

**事实**。治疗余额、人物技能容量和名单、宠物名单与技能栏由回包更新。对端在确认前检查连接静默，在提交后检查下一条合法帧、恢复移动和断开。源码适配与生成包使用微信 API 形状的本机测试端口。

**待验证**。真实微信设备网络、现行登录交接和官服会话。

[独立对端与回执](../analysis/game-wechat-map-services-v1/validation.json)

<a id="stage224-wechat-inventory-shop"></a>

## stage224 地图物品和商店的 TCP 校验

**事实**。独立 Python 对端检查物品使用、装备和卸下、部分数量移动、槽位交换、定向使用、丢弃与拾取。商人和兑换员测试从角色交互进入买入与兑换窗口，校验选择、提交和取消的帧。

**事实**。四条会话覆盖六类商店，检查余额不足、槽位失效、兑换支付腾空格、折算配额与持有变动。对端核对预览阶段的静默、提交顺序，以及拒绝旧确认后的合法请求。

**待验证**。真实微信设备网络、现行登录交接和官方会话。

[独立对端与回执](../analysis/game-wechat-inventory-shop-v1/validation.json)

<a id="stage223-wechat-creation"></a>

## stage223 微信建角的独立 TCP 校验

**事实**。在已有 wx TCP 适配上，源码版与生成包各通过三条新增建角会话。双空槽成功流程核对 7 次请求，包括创建、重新取角色列表、选角和两条移动。重复提交被拦截，重复应答后仍只有一次名单刷新。

**事实**。拒绝与请求后退后台分别核对 3 次请求，均结束于创建请求之后。拒绝可回到原列表，退后台释放套接字、材料和未完成页面动作。

**待验证**。微信设备端的 TCP 会话、现行登录票据交接及官服行为。

[本机回执](../analysis/game-wechat-creation-v1/validation.json)

<a id="stage222-wechat-page"></a>

## stage222 原生游戏 TCP 接入

**事实**。微信游戏页通过 `createWeChatLegacyGameSession` 调用 `wx.createTCPSocket`，连接目标和文本编码来自构建时显式配置，沿用登录适配的地址与端口限制。平台域名、端口和基础库能力由微信运行时检查。 [微信 TCP API 类型声明](https://raw.githubusercontent.com/wechat-miniprogram/api-typings/master/types/wx/lib.wx.api.d.ts#L23188-L23202)

**事实**。源码适配和生成包分别执行三个端到端会话。Page 调用测试端口，独立 Python 对端通过真实本机 TCP 校验选角、普通移动、CP936 对话、战斗用物与结算、普通与小队聊天。主机端口和测试地址属于夹具。

**待验证**。微信宿主实际 TCP、真机局域网与域名许可、现行登录交接和官方端点行为。

[接口](module-interfaces.md#stage222-wechat-page) · [证据](../analysis/game-wechat-page-v1/validation.json)

<a id="stage221"></a>

<a id="stage221-chat-presentation"></a>

## stage221 地图聊天过滤与显示的本机复验

**事实**。源码和生成核心各用独立 TCP 对端核对过滤两条消息、两行中文气泡、角色移除后同 ID 重建、两条公告和随后普通移动。新增名单操作和收包显示未产生额外请求。

**事实**。两个网页场景各用一条新连接验证同一目标恢复名单，从首批接收消息开始过滤。不同端口查不到该名单。Playwright 使用本机桥接地址，外部请求为零。

**待验证**。真实账号、现行协议和官服兼容。

[本轮计划](../analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-chat"></a>

### 前序检查点 · 独立对端核对普通和小队聊天

**事实**。源码与生成核心各核对两条 )bX 和两条 *(2，包括双字节文字、标点转义、显示参数以及保留的设置位。

**事实**。对端分开发送玩家文字、普通系统文字、公告、频道设置和队伍状态。检查等待回显、限频期间静默、退出小队后恢复移动，以及断开清理。

**待验证**。真实服务的发送接受、收发顺序、当前版本和微信宿主网络。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 独立本机对端核对家族成员请求

**事实**。源码和生成核心各比对 8^J 邀请、8MV 分配、两条 8u6 移除和退出的完整请求字节。对端检查无权限、无目标、受保护成员、重复提交和取消确认的静默。

**事实**。对端在分配等待时先更新姓名再更新称号，移除等待时先移除其他成员，再移除目标。退出后发送匹配家族的 Zi8，并核对关闭后两条移动请求。

**待验证**。官方结算、当前线上协议及微信宿主网络。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 家族管理的独立本机对端

**事实**。源码和生成核心各比对 7nu 家族名、7nu 会馆名和 80i 称号更新的完整请求字节，并检查普通移动恢复。对端检查入口和关闭、无权限操作、无效名称、等待重试的静默。

**事实**。合成对端分别注入资料、名单与称号回包，覆盖先更新成员再更新待提交字段、授予后撤回权限、无关家族重置和匹配重置。

**待验证**。官方结算、当前线上协议及微信宿主网络。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 家族兽和饲料箱的独立本机对端

**事实**。源码与生成核心各核对 7 条 /1I 回复，包括两条喂食、改名、两条饲料箱存取和家族兽的两条关闭。对端比较原始请求字节，核对受限操作和饲料箱关闭期间的静默，以及关闭后重新移动。

**事实**。合成对端依次授予、撤销权限，并分开提供背包、家族兽文字和饲料箱增量。网页和共享核心均以这些入站记录为准。

**待验证**。官方结算、当前线上协议和微信宿主网络。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 仓储存取的独立本机对端

**事实**。源码与生成核心各通过一次完整仓储流程，核对 8 条 /1I 回复，包含物品存取、宠物存取、金币存取、用户关闭和服务端关闭。核对收到增量后才更新余额和物品，以及关闭后恢复移动。

**事实**。合成对端从仓储余额 999990、钱包 50 的状态验证存款上限 10。存入 10 后取出 5，最后投影余额 999995、钱包 45。非法操作、错误关闭对象和重复关闭由独立对端检查。

**待验证**。真实结算、微信宿主网络与当前线上协议。

[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 四种对话在独立本机对端的交互

**事实**。源码与生成核心各走完整的入图、交接、后继给予、接受和拒绝、双项确认和取消、外观确认以及图文确认和取消。独立 TCP 对端按字节核对 9 条 /1I 回复以及重新移动。

**事实**。非法双项输入、外观箭头与普通本地关闭通过对端的空闲断言。应用在外观选择及提交后都保留原角色字段，等待服务端状态。

**待验证**。真实结算、微信宿主网络与当前线上协议。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 宠物训练在本机对端的完整交互

**事实**。独立 TCP 对端核对三阶段普通和扩展训练，包括原始宠物槽 4 发送紧凑编号 1，空技能栏 2 发送 1，替换技能栏 1 发送 0，以及取消的空正文。

**事实**。对端控制金币和技能更新时点。选择后收到 E(9 和 J_J 才改变相关状态。技能变化触发失效后可以取消，回到地图后原移动命令恢复。

**待验证**。真实服务端资格检查、扣费、发放与替换，以及微信宿主网络。

[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · 从 NPC 对话进入现有业务窗口

**事实**。独立 TCP 对端验证右键交互、购买入口和实际商店、出售单选窗口退出、兑换入口和实际兑换窗口。双选买卖窗口的退出只关闭本地窗口。

**事实**。学习和遗忘请求沿用原 /1I 的当前位置、窗口序号、角色、按钮和正文。对端核对遗忘的原序号 2、返回 99，并注入 J<= 使确认中的窗口失效。退出后原地图移动恢复。

**待验证**。真实服务的学习扣费、遗忘结算、完整宠物流程、微信宿主网络与官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · 治疗和图文对话的本机发包

**事实**。独立 TCP 对端校验治疗原选项 5、完整治疗 9、按钮 2 取消和图文菜单选项 2。未入站新的金币记录时，单项治疗请求发出后持有金币仍为 30，收到 E(9 后才更新为 22。

**事实**。源码与生成核心各跑十五条本机 TCP 流程。网页经本机中转通过同一对端，关窗后恢复移动。

**待验证**。真实治疗服务的鉴权、扣费、恢复与回包顺序，以及微信宿主网络。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 玩家交易的本机字节验收

**事实**。独立 Python TCP 对端按原字节核对 +BQ、+i@、两次 +oj、两次 ,ua 1、,3K 与 ,ua 0。首份报价的两段字节分别为 10|0|8|1 和 2|0，整数金币为 19。

**事实**。源码和生成核心各通过十四条本机 TCP 流程。桌面与触屏模拟经过实际网页和本机中转。对方撤回与服务端结束后没有多余发包，退出后恢复普通移动。

**待验证**。真实交易撮合、服务端验证、结算顺序和微信网络。

[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 留言板的本机字节验收

**事实**。本机对端核对了双向翻页空正文、中文及分隔符与 CR 的发帖正文，以及原条目序号 2 的删除。草稿错误、删除预览和本地关闭期间保持无多余请求。

**事实**。源码和生成核心各通过十三条本机 TCP 流程。桌面与触屏模拟经过实际网页和本机中转。

**待验证**。真实留言服务的权限、返回规则、微信网络与设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 单项给予的本机字节验收

**事实**。独立对端检查两个分支的 1\z3 与 1\z4、取消的空正文和离店后的移动。对端改变金币和物品时，过期的数量无法提交，恢复合法选择后才发送确认。

**事实**。源码与生成核心各通过十二条本机 TCP 流程。桌面和触屏模拟经过实际网页和本机中转。

**待验证**。真实服务器结算、微信网络和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 兑换的本机字节验收

**事实**。独立对端验证确认正文 `0\z4\z1\z2`、取消的空正文和离店后的移动。兑换物不足、容量不足、核价和容量变化时均未提交订单。回包后余额从 23 变为 9，两个新商品占用腾出的背包槽。

**事实**。源码与生成核心各通过十一条本机 TCP 流程。桌面和触屏模拟经过真实网页及本机中转。

**待验证**。真实服务器的扣除顺序、库存回包、微信网络与设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 鉴定、修理和取消的本机回放

**事实**。对端分别验证鉴定的 `10\z8`、修理的 `9`、按钮 2 的空正文以及离店后的移动。费用不足、核对订单和槽位失效期间均无订单发包。背包说明随本机对端的物品更新而刷新。

**事实**。源码与生成核心各通过十条本机 TCP 流程。桌面和触屏模拟经过真实网页及本机中转。

**待验证**。真实服务器触发、订单接受与回包，及微信网络和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-shop"></a>

### 前序检查点 · 普通买卖的本机 TCP 验收

**事实**。原创对端独立验证 `/1I` 的购买正文为 `0\z2\z2\z1`，出售为 `10\z1\z8\z2`，取消按钮为 2 并携带空正文。核对订单时无发包，旧报价被拒，回包后金币与槽位更新，离店后可继续移动。

**事实**。18 条本机 TCP 流程包含源码和生成核心各九条，桌面与触屏走真实网页入口和本机中转。

**待验证**。真实服务器的开店触发、订单接受与回包，及微信端网络与游戏页。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 角色请求与普通对话的本机字节验收

**事实**。本机对端核对 `;JE [3,200]`、`/1I [2,3,41,200,0,"2"]` 和序号 42 的 Windows-936 文本回复，并验证关闭对话后两次移动。错误角色的关闭包后紧接可观察的角色公告，证明关闭包已处理时原窗口仍在。

**事实**。源码和生成核心共通过 16 条 TCP 流程，含两条新角色交互路径。对端按测试顺序独立发送 `Q?m`，实际服务端对 `;JE` 的响应另行验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 本机丢弃、移动与捡回的字节顺序

**事实**。独立 TCP 对端逐字节核对 `&E1 [2,3,8]`、`!0b [2,3,c,99]`、`!0b [3,3,G,99]`、`&?S [3,3,6]` 和同格钱币的 `&?S [3,3,2]`。源码与生成核心共通过 14 条流程。

**事实**。对端先延迟丢弃回包，再延迟两次拾取回包。地面物品与钱币分别保留到收到 `IZL`，背包条目在收到 `?l)` 后恢复。关闭连接时独立对端检查没有额外字节。

[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-targets"></a>

### 前序检查点 · 三条新物品指令的本机线协议

**事实**。原创对端逐字节核对 `6=L` 的目标槽 12 与来源槽 11，`&E1` 的逻辑格 (2,3) 与槽 14，以及 `$T5` 的 `Q|FF|`。回包故意延迟，槽位在出站后保持到收到权威更新。

**事实**。战斗用例由服务器腾出一个空位后允许卸下，武器进包且类别 7 的装备留在手位。结算后返回地图并继续两次移动请求。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-items"></a>

### 前序检查点 · 普通背包本机报文验收

**事实**。独立本机对端验证普通使用、装备、卸下装备、拆分和交换。每次在收到出站指令后延迟回包，核实客户端保留旧槽位直到收到 `?l)` 或 `@Y)`。

**事实**。源码与生成包各跑一条完整普通背包流程，并各重跑四条战斗物品流程。每条都经过五条启动请求及后续两条地图移动请求。

**待验证**。现行游戏及官服连接。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-input"></a>

### 前序检查点 · 定向物品、自身使用、装备与换槽重选

**事实**。源码和生成核心各验收 I|8|A、I|9|0、Q|A|、I|9|A。对端逐字节核对包头、动作、一次战斗退出和两条地图移动请求。

**事实**。换槽用例在等待选择目标时送达 @Y)，清除旧目标标记并重开物品栏。重新选择后只发送新槽号。装备移动和消耗都由对端发来的槽位更新确认。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-input-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-input-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-mp-items"></a>

### 前序检查点 · 物品结果和地图返回的本机协议验收

**事实**。源码和生成包各验证正常结算与收到 xU 提前中断。对端逐条核对五条启动请求、防御 G、战斗退出和两条地图移动请求。

**事实**。三套旧用例改用 ITM9 检查未支持命令。源码与生成包共六条回归均保持回合数为零并正常释放会话。

[本轮计划](../analysis/game-battle-shared-storage-v1/mp-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/mp-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-transitions"></a>

### 前序检查点 · 变身和退场的本机协议流程

**事实**。本机 TCP 对端校验五条启动请求、防御 G、一条战斗退出请求和两条地图移动请求。源码和生成包各走完整结算和提前收到 xU 两条路径。

**事实**。完整结算先执行变身、解除和对侧离场，再完成一回合。xU 在两条动作活跃时到达，双方动作队列清理，地图输入恢复。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-transitions-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-transitions-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-friend-roster"></a>

### 前序检查点 · 好友明细请求与本机完整流程

**事实**。匹配用例在已认证、选角完成前逐条核对 320 个 'q=。明细返回后，同版本摘要没有附加请求。刷新用例先请求 1、320，再清除 1 并刷新 320。

**事实**。两类对侧 MON 均实际完成，返回地图后各校验两条移动请求。施法用例验证好友标记参与提示资源选择。会话断开时释放名单。

[本轮计划](../analysis/game-battle-shared-storage-v1/friend-roster-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/friend-roster-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-effects"></a>

### 前序检查点 · 本机 CHT/BST 正常与提前退出

**事实**。原创本机对端发送 Xz@、战斗进入和 M。核对五条启动请求、S|2|0|A、一次退场与两条返回后的移动。普通用例运行三条 BST，本机扣 61 秒并回加 3 秒。远端 2 秒只有数字反馈。

**事实**。提前退场在第一条聊天进入环后发送 U。活动尾部和全局尾部分别补处理，净扣 58 秒，只追加后两条聊天。地图继续按时钟更新。断开后清空会话拥有状态。

[本轮计划](../analysis/game-battle-shared-storage-v1/side-effects-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/side-effects-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 本机正常与提前退出

**事实**。源码和生成包各完成普通回合与提前退场两条本机 TCP 流程。普通用例结算 30 次效果并在地图画面绘出余滴，提前退场的地图画面没有余滴。 桌面 1100×850 与触屏模拟 390×844 分别复核两种退场，留存 16 张原创素材截图。页面错误、警告和外部请求均为零。

**待验证**。真实手机、微信设备、现行版及官服会话。

[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 本机协议与页面

**事实**。源码和生成包各完成本机搬运与成对离场两条流程。收到 M 后 MP 从 10 扣至 7，完成一轮、退场和两次地图移动。成对离场从对象与名单同时移除 10、15 槽。 桌面 1100×850 和触屏模拟 390×844 各完成搬运与成对离场。四条真实页面流程各捕获至少 512 个原创特效像素，共留存 12 张截图。页面错误、警告和外部请求均为零。

**待验证**。真实手机、微信设备、现行版本及官服会话。

[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL402 本机 TCP 和页面验证

**事实**。源码和生成包分别经本机 TCP 走完两侧用例。每次提交一条技能命令，收到 M 后从 MP 10 扣到 7，完成一轮战斗、退场和两次地图移动。 桌面 1100×850 与触屏模拟 390×844 各覆盖两侧。实际 Canvas 捕获到原创效果，四条页面流程共留存 12 张截图。页面错误、警告和外部请求均为零。

**待验证**。真实手机、微信设备、现行版本及官服会话。

[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · 同槽第二轮与 SKL405 本机验证

**事实**。源码和生成包各完成同槽 SKL404 与 SKL405 的本机 TCP 流程。同槽用例恢复后接收下一轮 C/M、再次发送技能请求并完成第二轮，最终目标 HP 为 65。 桌面 1100×850 和触控模拟 390×844 均验证 SKL405 的背景、MP 10 → 7、结算和返回地图。共 6 张原创素材截图，页面错误、警告和外部请求均为 0。

**待验证**。微信设备、现行版本与官服兼容。

[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：真实CMB收包、暂停与返回

**事实**：当前77个战斗文件1,076/1,076项、当前neutral生成包64/64项通过；四套构建核对687个输入和34个输出，外部导入0。当前物理族主验收本机TCP397次（源码337、生成52、页面8）；新增CMB为14源码、14生成、8页面，调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共46截图，全部正常回合、返回地图与准确后续移动；页面错误、警告、外联0。Browser插件不可用，使用已有Playwright1.64.1。触控HUD核对Hero MP10、替换的OriginalRider HP40/MP8、目标HP51；nextC中的MP7来自新C包，不是合击扣费。

14种源码与生成包TCP分别覆盖普通/单人/多人/十人/隐藏横幅/RID3/附带RID双方/暂停/重入/关闭/读取失败/nextC/退出。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](../analysis/game-battle-combination-v1/source-check.json)、[源修正](../analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-combination-v1/test-results.json)、[验收边界](../analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](../analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](../analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：实际RID收包与所有权

**事实**：当前75个战斗文件1,058/1,058项、当前neutral生成包46/46项通过；四套构建核对679个输入和34个输出，外部导入0。当前物理族主验收本机TCP369次（源码323、生成38、页面8）；新增RID为10源码、10生成、8页面，额外调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共42截图，全部完成回合、返回地图及准确后续移动；页面错误、警告、外联0。实际HUD显示替换后的OriginalRider HP40/100、MP8/10。原创小像素夹具不代表完整游戏画面。

**事实**：新独立方程覆盖53场景、13,799帧状态、完整拥有存储及1,098帧RGBA；50条身体结算，same-a-multiple有界等待，same-a-b子对象移除与element159两条显式消费者边界分别保留。缺少骑手、当前槽位上下文及未覆盖角色标记原子拒绝；135等共用105c指针分支显式停止，未借独立chant/projectile映射伪造原生共享指针。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](../analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](../analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](../analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](../analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](../analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：73真实收包和跨平台回归

**事实**：当前73个战斗测试文件完整回归1,046项全部通过；neutral生成包完整34项全部通过。四种构建核对671个输入与34个输出，外部导入0。357次主物理家族本机TCP回执（源码313、生成28、页面16）均校验正常启动、准确指令和清理。桌面1100×850与触控模拟390×844各8条实际game.html流程，共82截图；15条返回地图并继续准确移动，1条保留有界等待后断开。页面错误、警告、外联均为0。

**待验证**：自身、守护别名、缺少结束信号及RID后跟守护的16条轨迹仍有界等待，不能称为自然回合完成。已有7201恢复是独立机制，未注入ready或清理动画信号。20/21号施法者的73击倒收尾按原指令不补11/44；其他通用类别同类边界尚未纳入本轮实现验收。attachedRID消费者4236d0仍原子拒绝，不能以元数据RID三字已支持推定该消费者已完成。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair73-v1/source-check.json)、[源修正](../analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair73-v1/test-results.json)、[验收边界](../analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：双目标、重入与正常信号

**事实**：71文件完整战斗回归初轮1,012项中1,011通过、1条压力资源重入的“应正常回合”预期失败；生成包初轮33项中31通过，另有同一重入预期及跨VM对象原型比较失败。只修正3个测试辅助文件，源码与生成包各定向复验2项通过，最终分别覆盖1,012与33个检查；未声称修正后重跑完整两套。932个其他输入及产品运行代码保持相同。四种构建671输入/34输出、外部导入0；328次主物理家族TCP回执（源码285、生成27、页面16）。桌面与触屏模拟各8流程、83截图，15条正常返回移动及1条预期上下文错误/清理通过，页面错误、警告、外联0。

**待验证**：两条主守护/RID在205/207帧选择图形0，保持现有几何拒绝；两条次级2041在124/126帧的201读取下一元组哨兵-1，明确报目标上下文错误，失败回调之后不声称状态/像素等价。100110是带非攻击命中信号的原创压力资源，实际入口和重入会重复主命中并等待；不擅自清信号。保留失败与有界等待，普通守护/RID/重入使用已独立建模的100114资源。这些不是原程序或官服验收。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](../analysis/game-battle-chain260-v1/source-check.json)、[源修正](../analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-chain260-v1/test-results.json)、[验收边界](../analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](../analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](../analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：105单动作、多施术者和失败清理

**事实**：当前69文件战斗979/979、当前neutral生成包34/34、四套构建663输入/34输出通过，0外部导入。当前物理族主验收本地TCP301次（源码258、生成27、实际页面16），另4次实际98动作内暂停/重入定向核对不计入主总数；暂停的重试不重复消耗游标，重入保留2，两次已发生的M消耗按两次计算。桌面/触屏模拟各8流程、83张截图，15条返回移动及1条预期错误提示/清理通过，页面异常/警告/外联0。921个运行/测试/对端输入稳定，含58个Python对端。未重跑全仓或历史生成包全套。

**事实／待验证**：护卫后的RID后续记录在原创场景中令角色资源变为0；实际核心与独立方程在帧264/311一致进入当前帧控制器的LEGACY_BATTLE_FRAME_GEOMETRY。两个案例保留为渲染边界，未当作像素或正常回合通过。初始新模型未保留失败帧中新建残影的旧优先级17，曾错误地保留计算值16，现仅修正该边界快照；全部场景输入、队列、资源、geometry、拥有存储和成功RGBA保持，只有一条边界轨迹的最后状态改变。未放宽原渲染器或改旧golden。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-context-v1/source-check.json)、[源修正](../analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-context-v1/test-results.json)、[验收边界](../analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：特殊配对的完整本地通信流程

**事实**：当前67文件战斗945/945、当前neutral生成包33/33、四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP272次（源码231、生成27、实际页面14）；桌面/触屏模拟各7流程、74张截图，页面错误/警告/外联均为0。907个运行/测试/对端输入稳定，含57个Python对端。未重跑全仓或历史生成包全套。

**待验证**：105高等级动画表没有已观察到的负终止标记，共享58fac0游标的真实上下文未明；260主护卫与串联字段在435000前置解析和424310生产者间顺序不同。两类继续拒绝为未接入，不改已证前置解析；配对73关联路径及此前113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB仍未完整闭合。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](../analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](../analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：真实读取顺序与本地通信验证

**事实／边界**：105使用533968处按等级步长20的有符号动画表与共享58fac0游标；已核200字节只有前两行带负终止标记，后八行全0，不能推定高等级正常完成。260带主护卫的串联字段在435000前置解析与424310实际生产者之间顺序不同。4608个原创字段流对照中，实际shared解析准备4368个、240个触发跨平台边界拒绝；4128个在两个源读取器都完整，336个已准备流呈现不同字段角色顺序。未把这些静态方程当作游戏执行或修改已证前置解析。

**事实**：当前65文件战斗912/912、当前neutral生成包27/27和四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP227次（源码204、生成21、实际页面2）；桌面/触屏各一次266反射、回合、返回及精确移动流程通过，共10张截图，页面错误/警告/外联0。895个运行/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成包全套。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](../analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：96的20种TCP与下一C

**事实**：当前战斗912/912（65文件）、当前neutral生成包25/25、四套构建（659输入、34输出、0外部导入）通过。当前物理族本地TCP共241次：保留源码184、新源码20、生成20、实际页面17；17条桌面/触屏流程、106张截图，页面错误/警告/外联均为0。893个源码/模型/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成套件。

20种新源码/生成流程覆盖KO/普通/未命中/防御/反射/治疗/跳过/忽略首RID/护卫/后续RID/244/暂停/重入/关闭/读失败/下一C。S显示cost3且不提前扣MP；M cost4才扣除，下一C重置后MP7→3。

**事实**：HP先归零再经45/44/46/47/49移除目标；下一C会重建目标，已验证70→0、下一C58→0及最终移除，未把移除误记为HP缺失。44完成还会清理状态子节点，新独立模型继承时的该遗漏已修正；旧参考生成器与golden全部未改。两处旧“未实现96”的负向对端夹具改为仍未实现的262，独立Python对端与JS预期同步；历史证据不改写。初次完整源码912项中911通过，1个旧unsupported96对端失效；精确旧输入与日志已归档，修正为262后重跑完整912项。早期测试括号、seed字段/背景RNG及替代配置错误均保留日志。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special96-v1/source-check.json)、[源修正](../analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special96-v1/test-results.json)、[验收边界](../analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：嵌套真实TCP与回合

**事实**：当前战斗887/887（63文件）、当前neutral生成包25/25、四套构建（651输入、34输出、0外部导入）通过。当前物理族本地TCP共220次：保留源码164、新源码20、生成20、实际页面16；16条桌面/触屏流程、84张截图，页面错误/警告/外联均为0。879个源码/模型/测试/对端输入稳定，含55个Python对端。未重跑全仓或历史生成套件。

20种新源码/生成流程包含伤害、未命中、113无嵌套、反射/治疗/跳过/组合/零消息、两级护卫、忽略的主RID、普通后续、本地244、暂停/重入/关闭/读失败和下一C。输入S显示cost3不提前扣MP；收到M cost4才更新MP。下一C重置后MP7→3、嵌套目标HP70→58。

**事实**：原435000只给72读取嵌套记录，且不把嵌套目标本身标成依赖（护卫会标记）；424310运行时同时处理72/113。保留原解析边界：113嵌套的4480组队列/104条轨迹仅为运行时命令夹具；可经真实前置解析的部分为4640组队列/157条轨迹。真实TCP/页面只验证72嵌套及113无嵌套，不将113嵌套标成协议兼容。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](../analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：22种真实自身TCP流程

61个当前shared/web战斗文件共862项单次全绿；当前生成包27项通过；四套构建643输入/34输出身份一致、无外部导入。当前物理族203次本机TCP：既有源码142、新源码22、生成22、实际页面17。17条桌面/触屏流程、89张截图，页面错误/警告/外联均为0；865个源码/模型/测试/对端输入稳定，含54个Python对端。未重跑全仓或历史486项生成套件。

覆盖伤害/治疗/抑制/跳过/组合、108、消息位、RID、最后自身记录、护卫等待、ignored scalar、244、暂停/重入/关闭/读失败与下一C。S不提前扣MP；M的cost4独立于输入显示cost3。第二C权威重置后，攻击者MP7→3、HP70→58，目标HP58→51。护卫长等待有源码/生成TCP及管理器证据，未列入17条页面流程。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-self-physical-v1/source-check.json)、[源修正](../analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：27种实际正变体TCP模式

59个当前shared/web战斗测试文件共835项单次全绿，当前生成包33项通过；四套构建643输入/34输出核验通过，0external。当前物理族189次本机TCP（既有源码115、新结果源码27、生成27、页面20），20条实际桌面/触屏流程、104张截图，页面错误/警告/外联均为0。853个源码/模型/测试/对端输入身份稳定，包含53个Python对端。本轮未重跑全仓或历史486项生成包全套。

覆盖三种变体的E000/组合位、class6 HP、RID、扩展掩码、ignored bits、local244、repeat/self73 wait、pause/reentry/close/read-fail/nextC。S不提前扣MP；M实际cost4独立于输入cost3，class73不走通用扣蓝；class6结果不额外扣MP。第二C把目标HP写58，治疗后70，攻击者MP7→3。两个等待模式实际执行既有恢复，恢复所有命令依赖身体。

**待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](../analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](../analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：结果M与实际HP/MP网络归属

57个当前shared/web战斗测试文件共802项通过，当前生成包27项通过；四套构建643输入/34输出身份核验通过。当前物理族150次本机TCP执行（既有源码94、新结果源码21、生成21、页面14）。14条真实桌面/触屏流程、74张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。

21种当前结果对端覆盖reflect/heal/skip、三类MP、guard、RID、266、84、组合位、追击、scatter以及pause/reentry/close/read-fail/nextC。S不预扣MP；M cost4与选中cost3分开。反射MP在M扣4后再由结果6→0；护卫治疗首回合HP70→82，第二C写58后治疗至70，攻击者MP7→3。

**待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。

[需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-results-v1/source-check.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：护卫S/M和真实第二回合

当前55个shared/web战斗测试文件共775项通过；当前生成包17项通过；四套构建639输入/34输出身份核验通过。当前物理族117次本机TCP执行（既有源码81、新护卫源码13、生成13、页面10）。10条实际桌面/触屏流程、54张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。

13种当前护卫对端覆盖普通护卫、0/3蓄力及组合、RID、连续记录、2599、暂停/重入/关闭/读失败/nextC。实际S不预扣MP；返回M cost4与选中cost3独立，目标10保持70HP、护卫11首次58HP，第二次C/M后46HP。只有原创本机对端，无账号或官服。

**待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：实际返回M、RID和第二回合

2243项源码测试通过（188文件）；486项当前生成包检查单次全绿（479 neutral API、7 App/Page）。四套构建631输入/34输出身份核对通过，无外部导入。物理族177次本机TCP执行（源码81、生成81、真实页面15）；14种桌面/触屏流程共15次执行、80张独立截图，页面错误/警告/外联均为0。

36种当前源码/生成对端场景含258叠图、三类最高等级三变体、259直接RID/反击、nextC两回合和pause/reentry/close/read-fail；45种既有直接路径也回归。真实S不预扣MP，返回M的cost4独立于输入cost3。只有原创本机TCP，无官服或账号。

**待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。

[需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：正变体收到M后才执行

2223项源码全量测试通过（186文件）。生成包全量运行469项，3项因验收器跨realm数组原型比较失败；只修正测试比较后，4项相关检查复跑通过，469个不同检查均有通过证据，原失败运行保留，未称单次全绿。四套构建的623输入/34输出身份一致；物理族161次本机TCP执行（源码69、生成69、页面23）完成，页面21种桌面/触屏流程、105张独立截图，错误/警告/外联均为0。

新24种源码/生成对端场景覆盖variant1/2/3、6/84/85/87、95/105/110、257level9、RID、73独立耗蓝和deflection、pause/reentry/close/read-fail/nextC、pending258/tile。真实S选择不预扣MP，原生布局的返回M拥有实际cost；73没有generic扣蓝。全部来自原创本机对端。

**待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。

[需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：同源修复通过当前生成API和本机TCP

全量2194项源码测试（184文件）、440项生成检查（433 neutral＋7 App/Page）、四套构建通过；615输入和34输出身份一致。108条本机OS TCP流程及18条实际桌面/触屏页面流程通过，92截图逐个hash，页面错误/警告/外联均为0。新增源码与生成回归各1项；本轮没有新增TCP场景。

源码45、生成45、实际页面18条流程合计验证540启动请求、553技能包、110查询、113条精确S、101退出和202恢复移动；无伪造/重复指令。网络记录来自原创本机对端，不是官服会话。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：真实S/M、费用、结束与返回的跨平台核验

source/generated各45种实际OS TCP，对端为独立原创Python模型；浏览器另18条真实game.html输入流程。S的输入费用3与返回M费用4不同；HP/MP由收到的M及真实动画信号拥有，下一C可更新MP7并在下一M变为3，没有乐观扣费。20/21槽、连续反击、pause/reentry/close/read-fail均检查拥有者。

本轮2193项Node测试/183文件、439项生成检查（432 neutral+7 App/Page）、四套构建615输入/34输出均通过。独立15995队列、75场景、17488完整建模状态、2358完整RGBA帧（双selector）；108条实际本地TCP流程验证540次正常启动请求、553包技能、110次查询、113条S、101次退出及202次战后移动。实际game.html桌面/触屏18流程、92截图，Chrome156.0.8078.80/Playwright1.64.1，页面错误/警告/外部请求均0。

这些连接仅到本地原创对端。微信生成接口在无DOM/Buffer/URL/文本全局的neutral环境验收，未运行原生微信设备。

正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：协议消费者继续分析，暂无新联机验收

本轮没有新增TCP或页面流程。来源确定了公共物理record的首击/后续差异、护卫拥有者、RID复制和变体结果路径；接入后仍需实际主技能S/M、输入费用与实际费用、C/下一回合、目标停止/普通返回/移动及生命周期验证。

本轮新运行源码测试0、生成检查0、页面流程0；运行模块/导出/适配器/测试及native/vendor未改。已复核stage202构建607输入/34输出和日志身份；此前2142项Node、393生成检查、15页面流程是历史验收基线，本轮未重跑，未重复累计。只运行并通过当前来源核验脚本。

本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](../analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](../analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：41来源、41生成与15页面流程

新增48项，全量181文件2142项Node通过。四套当前构建核607输入/34输出身份、0external；393生成检查（386neutral/7App/Page）通过。独立1463队列、63场景16706完整建模状态和2404完整RGBA帧（两选择器）一致；47源停止、15身体结束与1空目标未证边界分开。97条最终真实本机TCP（41来源/41生成/15实际页面）核485启动、498技能包、99自动查询、102个S请求、90返回/180移动。81次独立截图、53个不同图像文件哈希位于源码外，均为原创合成资源；浏览器0错误/警告/外部请求。

41组来源/生成路径覆盖本地/非本地、双方/20/21、十等级端点、多目标/重复/自身、逐值扣血/KO/0/负值/溢出、非反射10000/非吸收40000、RID目标/施术者/跟随普通目标/清附件、初始缩放、状态移除、暂停缓存、重入/关闭/读失败、下一C和空目标拒绝。

S仍来自接收技能/等级/目标，M实际扣4而输入等级费用为3或12；无乐观数值。正常回合才测试C20，本地244及本地目标停止都直接核真实退出请求，再核普通返回后的两条移动。初始诊断、无效放大探针及重测不重复累计。82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](../analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](../analysis/game-battle-skill82-v1/source-check.json)、[验证修正](../analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-skill82-v1/test-results.json)、[TCP](../analysis/game-battle-skill82-v1/network-validation.json)、[页面](../analysis/game-battle-skill82-v1/browser-validation.json)、[验收](../analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](../analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](../analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：83输入、停止/回合/等待与普通返回TCP

新增33项、全量179文件2094项Node通过。四套当前构建覆盖599输入/34输出身份，0external；生成验收共351项（344neutral/7App/Page），由326既有、24新TCP及1修正后的队列检查构成，初始验证脚本错误与重测日志单独保留。独立939队列含737支持/202明确拒绝边界；59场景核9387完整状态和1828完整RGBA帧（两选择器），区分31源停止、22身体结束、4特殊槽身体等待和2未证边界；phase2未交接4例，其中3已被源停止抢先结束、1仍在等待。最终61条真实本机TCP（24来源/24生成/13实际页面）核305启动、318技能包、63自动查询、66个S请求、48返回/96移动。69次独立截图、46个不同图像文件哈希在源码外，均为原创合成资源。浏览器0错误/0外部请求；3条Canvas读回性能提示来自验证器反复读像素，无其他警告。

每组24来源/生成流程覆盖本地/非本地、多目标/重复/自身/空、治疗/扣血/KO/吸收/0/style0/负值/溢出、本地反射、20/21/零和等待、暂停缓存重试、重入、关闭、读取失败和下一C。输入S费用与返回M扣4分开，无乐观MP/HP。

本地停止由服务器实际收到退出请求证实，期间不发测试C20；非本地正常结束才发送C20。返回后核两条真实普通移动，等待流程断开且没有退出/移动请求。初始观察与修正用例不重复累计。非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](../analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](../analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](../analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](../analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](../analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](../analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](../analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：28来源、28生成与15实际页面流程

35新增/2061全量Node、四套构建/326生成检查（319neutral/7App/Page）通过；595输入/34输出身份一致，0external。独立3类十等级、2317队列、157场景16447完整状态、3250完整RGBA帧（两选择器）一致；154场景身体结束、151场景命令结束，6个源phase2等待单独保留。71条最终验收用真实本机TCP（28来源/28生成/15实际页面），核355启动、368技能包、73自动查询、76个S请求、60正常返回/120移动；初始观察不重复计入。78次独立截图在源码外，对应43个不同图像文件哈希；均为原创合成资源，浏览器0错误/0警告/0外部请求。

每组28流程从正常升级/人物进入、实际技能/P/C到精确S与独立M，覆盖三类、治疗/扣血/吸收/反射、多目标/重复、自身、特殊20/21、style0、signed边界、KO、下一C和普通返回。每组另有暂停缓存重试、重入、关闭、读取失败及无信号/零和/重复反射等待。原生fakeWeChat宿主连接真实OS TCP，仍不是原生微信设备。

输入等级费用与服务器M费用分开；队列构建和S均不改MP/HP，实际53扣4，数值回调才改变HP。最终组合71用例含15真实网页，45000ms本机桥无外部请求；初始观察不累计两次。共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](../analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](../analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](../analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](../analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：51来源、51生成与13实际页面流程

59新增/2026全量Node、四套构建/297生成检查（290neutral/7App/Page）通过；587输入/34输出身份一致，0external。独立36类十等级、2912队列、416场景12775状态、6384完整RGBA帧（两选择器）一致。115条最终验收用真实本机TCP（51来源/51生成/13实际页面），核575启动、591技能包、117自动查询、123个S请求、109正常返回/218移动；初始观察不重复计入。71张原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

每组51真实OS TCP从正常升级/人物进入接收J/P/C，到精确S、独立返回M、费用/状态/粒子/回合/下一C/退出和普通移动。覆盖全部36类及无标记、自身、特殊20、切换/清除、self68 reset、真实C头field更新和无施法信号。来源/生成各有一次缓存像素重试、重入、读取失败及2个旧渲染任务取消。

无信号仍可有已执行的53费用，但目标不完成；不得据时间造状态或回合。字段效果由源M/C更新，S的目标和费用不投影成服务器结果。实际页面为本机45000ms桥，未访问外部地址；最终组合按用例计数，保留的初始来源/截图观察不重复累加。其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](../analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-status-skills-v1/test-results.json)、[TCP](../analysis/game-battle-status-skills-v1/network-validation.json)、[页面](../analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：真实本机TCP与生成适配验收

38新增/1967全量Node、四套构建/245生成检查（238neutral/7App/Page）通过；579输入/34输出身份一致，0external。独立4686队列、213回调场景25917状态、6078完整RGBA帧（两呈现选择器）、294寻向和180个有符号CRT边界通过。60新真实本机TCP含10实际网页鼠标/触摸流程，核300启动、313技能包、2个1101标签包、62自动查询、65个S请求、53次正常返回/106移动；52张验收用独立原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

来源25条、生成API25条、实际game.html 10条均用操作系统TCP和原创对端，从正常升级/人物进入接收技能到精确S、真实M施法、结算/下一C/退出及普通移动。来源/生成各核一次缓存像素重试、重入和注入资源读取失败，各取消2个旧渲染任务。metadata真实发送Hr]标签包，经普通接收者捕获1101值；不注入战斗就绪或游戏状态。

网页桥限制本机且单会话45000ms；浏览器只见本地请求。生成代码0external import证明构建封闭性，不代表微信原生网络或官服接纳。自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[规格](../analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](../analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](../analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-casting-v1/test-results.json)、[TCP](../analysis/game-battle-casting-v1/network-validation.json)、[页面](../analysis/game-battle-casting-v1/browser-validation.json)、[验收](../analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](../analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：自动查询、精确S与服务器数值权威

主记录2c==1触发原4f6d00，tag'<4/int32，slot+(5e2778?100:0)；会话在实际J<=后自动发送。目前普通上下文owner保持源初值0，未实现非零上下文/工艺配方。查询不能被误称为取子等级，真实子等级来自JUA。

主S经send-004f88f0，S|mainHex|levelHex|targetHex，实际槽、全大写、无尾分隔符。原创对端刻意让输入显示消耗3/6/2而回包M消耗4，核实际MP事件证明没有乐观扣蓝或以界面费用替代服务器结果。组目标29随后走两个真实目标队列；立即S另接实际PNO，仅验输入，不捏造其技能结算。

31新增/1929全量Node、四构建/218生成检查（211neutral/7App/Page）通过；571输入/34输出身份一致，0external。45独立完整接收状态、14输入场景781状态、110个有符号MP计算边界通过。32新真实本机TCP含6实际页面，核160启动、177技能接收包、34自动查询及37个S请求；25次正常返回、25退出/50移动，27张原创夹具截图在源码外。 来源与neutral各13条，实际桌面/390×844触屏仿真6条；暂停取消重试不重复S/MP、重入旧任务无效、读资源失败和关闭按各自结果验收。仍仅本机OS TCP及既有浏览器桥，无官服会话。完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-player-skills-v1/source-check.json)、[测试](../analysis/game-battle-player-skills-v1/test-results.json)、[TCP](../analysis/game-battle-player-skills-v1/network-validation.json)、[页面](../analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-player-skills-v1/goal-audit.json)。


<a id="stage196"></a>

## stage196：真实M请求与独立呈现进度

普通宠物选择使用send-004f88f0的M|%X：实际槽0..4或FF收回，没有尾分隔符。接收mode1且缓存HP>0才允许新选择；mode2不能再选，收回只要求437430存在，不以HP门限拒绝。收到MON前不改持久mode/活动索引。后续C才按接收mode找到活动宠物并刷新缓存。

51新增/1898全量Node、四构建/203生成检查（196neutral/7App/Page）通过；567输入/34输出身份一致，0external。16独立MON场景1864状态、13输入场景673状态、240独立缩放策略像素用例通过；MON同时核两呈现选择器，共3628个像素结果，100个alternate未支持结果。32新真实本机TCP含6实际页面，核160启动、210宠物接收包、42输入（27 M|1、8 M|FF、3 W|FF、4 N）、25退出/50移动及25次正常返回；25张独立原创夹具截图在源码外。 来源与neutral各13条，实际桌面/390×844触屏仿真6条；真实dead busy队列触发MON phase2，暂停取消像素重试不重复M、不重放源步骤或翻转选择器。页面只走正常文件输入/升级/人物入场，实际paint计数与呈现serial一一核对。网络仅实际OS回环TCP与既有认证WebSocket桥，无官方会话。

完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](../analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pet-transition-v1/source-check.json)、[测试](../analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](../analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](../analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](../analysis/game-battle-pet-transition-v1/goal-audit.json)。


<a id="stage195"></a>

## stage195：接收宠物数据与真实W请求

真实消息catalog的FBY/G:w/J_J经当前字节会话解码转发，不用配置或UI注入技能。W使用已证send-004f88f0：目标为W|技能hex|437080目标码hex；无目标技能的第三值为宠物索引；待机/骑乘超时为W|FF，源强制跳过为N。正常G/H/P/E路径保留。

36新增/1847全量Node、四构建/173生成检查（166neutral/7App/Page）通过；555输入/34输出身份一致，0external。15独立场景833输入状态、53完整接收记录状态通过。38新真实本机TCP含6实际页面，核190启动、120宠物接收包、86输入（34 W|FF、28 W|0|A、5 W|1|0、3 W|2|29、10 G、6 N）、31退出/62移动与31次正常返回；24张独立原创夹具截图在源码外。 网络是实际OS回环TCP，页面经现有认证回环WebSocket桥；来源/生成版各16条，实际页面6条。记录持久、跨回合记忆、两次骑乘选择、正常返回后继续移动和取消/重入/关闭/读取失败均核验。不是官方服务器会话或原生微信网络验收。

完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](../analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](../analysis/game-battle-mounted-input-v1/source-check.json)、[测试](../analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](../analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](../analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](../analysis/game-battle-mounted-input-v1/goal-audit.json)。


<a id="stage194"></a>

## stage194：CBC、骑乘对手与原生输入边界的真实TCP

14源客户端+14neutral生成API+8实际网页=36新真实OS TCP；核180正常启动、39输入（G36/H|A3）、27退出和54恢复移动，27成功普通返回。两侧各11完成轮，网页8轮。模式含普通/附着、骑乘对手更新/0保留/负值移除、连续CBC、物理/PSN/EQU混合、下一C、暂停读取/重入/关闭/读失败以及CFP未知分支。

保留真实当前操作者骑乘输入的负向流程：实际13b4导致source-body-child13b4，未提交输入且连接保持，未绕过原生菜单。8页面走真实文件选择/正常升级选人/实际按钮，7次完成返回移动；3次Chrome触屏仿真。四构建157检查、551输入/34输出、0external。沿既有显式30000ms本机桥配置，实机与官方会话未验。完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-character-change-v1/source-check.json)、[规格](../analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-character-change-v1/test-results.json)、[TCP](../analysis/game-battle-character-change-v1/network-validation.json)、[验收](../analysis/game-battle-character-change-v1/validation.json)、[剩余目标](../analysis/game-battle-character-change-v1/goal-audit.json)。

<a id="stage193"></a>

## stage193：换位与装备资源的真实三层TCP

12源客户端+12neutral生成API+7实际网页=31新真实OS TCP；核155正常启动请求、39输入（24个P、12个H|A、3个G）、24退出和48恢复移动，24次成功普通返回。源/生成各完成11轮，浏览器完成8轮；Python对端逐字节核请求并等EOF检查无重复。

实际下一P5、P0不改变当前操作者，下一C才覆盖；名字/数值随真实C和身体位置同步。暂停像素读取重试、重入、关闭、读失败、未支持CBC均另验。四构建142检查（135neutral/7App/Page），547输入/34输出身份核对，0external。实际两轮流程捕获BRIDGE_TIMEOUT后，桥新增显式1..60000ms时长，本轮30000；默认10秒和真实到期清理保持。390×844仅Chrome触屏仿真，实际设备与官方会话仍未验。完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-change-v1/source-check.json)、[规格](../analysis/game-battle-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-change-v1/test-results.json)、[TCP](../analysis/game-battle-change-v1/network-validation.json)、[验收](../analysis/game-battle-change-v1/validation.json)、[剩余目标](../analysis/game-battle-change-v1/goal-audit.json)。

<a id="stage192"></a>

## stage192：真实PSN源、生成API和网页TCP链路

11源客户端+11neutral生成API+7实际网页=29新真实OS TCP流程；核145正常启动请求、34个H|A输入、22退出与44恢复移动，22次成功普通返回。各原创Python对端逐字节验请求并等EOF确认无重复。新C覆盖旧HP/MP、三类串联、最高级回血、KO、暂停读取重试/重入/关闭/读失败和未知分支分别核验。

四构建/129检查（122neutral+7App/Page），543输入/34产物身份一致，0external。网页经显式授权loopback桥连本机原创对端；390×844仅Chrome触屏仿真，真实手机文件选择/跨设备网络仍未证明。完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-status-v1/implementation-plan.json)、[源核验](../analysis/game-battle-status-v1/source-check.json)、[规格](../analysis/game-battle-status-v1/implementation-spec.json)、[测试](../analysis/game-battle-status-v1/test-results.json)、[TCP](../analysis/game-battle-status-v1/network-validation.json)、[验收](../analysis/game-battle-status-v1/validation.json)、[剩余目标](../analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：页面按钮经真实桥接与源对端核字节

新增14次实际页面战斗流程（12主场景、2Canvas独立核验），经同源WebSocket→既有认证回环桥→独立Python OS TCP。另1个Canvas组件测试使用明确原创建输/文件/时钟端口和实际OS TCP。15次各核5个正常启动请求，共75；16条输入为12×H|A、2×G、1×E、1×P，10个既有退出请求和20个恢复移动请求全部逐字节验证，无新增线字段。

页面实际攻击显示HP100→88与MP10→7；防御/换位/逃跑提交已证请求，后续表现仍等待真实C/M。10次产品正常返回后恢复点击/触屏移动；暂停、重入、pagehide/关闭、未知动作停住、真实损坏文件和缺坐标后的真实消息恢复分别验证。组件的G在像素I/O取消/暂停/准备帧重试后仅发送一次，不重读逻辑clock/回调。

四构建/117检查、539输入/34产物身份一致、0external；旧普通页面另7次和改前基线2次分开记录。手机尺寸是Chrome触屏仿真，本机桥仍限制127.0.0.1，手机系统资源选择/跨设备网络和真实设备未证明；原生微信和现行/官方兼容继续未完成。

[来源核验](../analysis/game-battle-web-v1/source-check.json)、[规格](../analysis/game-battle-web-v1/implementation-spec.json)、[测试](../analysis/game-battle-web-v1/test-results.json)、[实际页面](../analysis/game-battle-web-v1/browser-validation.json)、[位图核验](../analysis/game-battle-web-v1/canvas-browser.json)、[网络](../analysis/game-battle-web-v1/network-validation.json)、[验收](../analysis/game-battle-web-v1/validation.json)、[目标审计](../analysis/game-battle-web-v1/goal-audit.json)。

<a id="stage190"></a>

## stage190：真实攻击字节、C反馈与返回链

源和中立生成API各14新本机OS TCP，共28条；每条核对五个正常启动请求。实际输入先消费attack意图，再在源菜单状态选择目标A；32条准确H|A、22条既有退出请求和44条恢复移动请求均由独立Python对端逐字节校验，没有新线格式或模拟命中包。

10726战斗/返回资源帧、1144普通帧和6004实际body回调完成；22次实际返回playing各52普通帧。真实下一轮C/A/M覆盖前轮数值，普通二次攻击结果为HP100→88→76和MP10→7→4；前置信号30个观察状态不扣HP。两次命中渲染取消重试无逻辑/clock/请求重放，两次重入、旧帧关闭与两次实际资源读取失败分别核验。

四构建/115检查，539输入和34产物核身份、0external。原创wx/files/clock端口与真实loopback TCP不是原生微信或官方服务；产品战斗Page/Canvas/设备、现行/官方仍需单独验收。

[源证据](../analysis/game-battle-skill-v1/source-check.json)、[规格](../analysis/game-battle-skill-v1/implementation-spec.json)、[测试](../analysis/game-battle-skill-v1/test-results.json)、[TCP](../analysis/game-battle-skill-v1/network-validation.json)、[验收](../analysis/game-battle-skill-v1/validation.json)、[目标审计](../analysis/game-battle-skill-v1/goal-audit.json)。

<a id="stage189"></a>

## stage189：返回后真实移动与生成包核验

源和生成API各11条新OS loopback TCP，共22条；每条五个独立核对的正常启动请求。共24准确G、24既有$!~ int0退出请求、36返回后准确移动请求；18个成功返回各跑52普通资源帧。5390战斗/返回主帧及936普通帧完成，1004独立返回淡入RGBA一致。

48条unit/action由实际9250c8状态限制，24条removal仍进入各自消费者；退出后新unit可立即应用，本地无需再发unit。4次像素取消重试不重读clock/回调，2次返回中入新战斗、4个实际资源/地图依赖检查及2次读取失败通过。场景更新不抹掉旧捕获，CUT未就绪不推进重建/激活。

四构建/101检查、531输入/34产物身份一致、0external。原生微信、浏览器产品战斗页面、设备/现行/官方仍未验收；本机TCP和生成接口不替代它们。[源证据](../analysis/game-battle-return-v1/source-check.json)、[规格](../analysis/game-battle-return-v1/implementation-spec.json)、[测试](../analysis/game-battle-return-v1/test-results.json)、[TCP](../analysis/game-battle-return-v1/network-validation.json)、[验收](../analysis/game-battle-return-v1/validation.json)、[目标审计](../analysis/game-battle-return-v1/goal-audit.json)。

<a id="stage188"></a>

## stage188：准确退出字节与重试不重发

源/生成API各11新OS loopback TCP，共22条；正常每条五启动请求，24条准确G输入与16条send-004f67f0/$!~、一int32参数0由独立原创字节对端核对。原正常/U/SKL中止/C-end、取消捕获/最终请求、重入/关闭、原始名称CHT依赖、写故障和裁剪均分开验证。

4次取消重试不重读clock/清理/渐变/发送，2次重入丢旧捕获；另2次原创wx.write故障发生在退出字节送达前，不计入16次接受。6次实际main10 ACK证明world不再固定路由9。四构建/89生成检查、527输入/34产物核身份、0external。main9仍待返回，原生微信/设备/现行/官方未验。[源证据](../analysis/game-battle-exit-v1/source-check.json)、[规格](../analysis/game-battle-exit-v1/implementation-spec.json)、[测试](../analysis/game-battle-exit-v1/test-results.json)、[TCP](../analysis/game-battle-exit-v1/network-validation.json)、[验收](../analysis/game-battle-exit-v1/validation.json)、[目标审计](../analysis/game-battle-exit-v1/goal-audit.json)。

<a id="stage187"></a>

## stage187：源与生成API的实际多轮TCP

源和生成API各9条新增OS loopback TCP，共18条，正常启动每条5请求，30条准确$T5/G输入请求；实际C/P/A/M驱动多轮、轮次回绕、PNO结束、END、缺失SKL及重入。两次M像素重试不再读clock、执行回调或取M；重入/关闭共取消4旧M任务，无重复输入或虚构退出请求。

四构建/77生成检查，519输入与34产物核身份、0external；中立API无DOM/Buffer/Text/网络/计时全局依赖，wx/files/clock/timer均显式原创端口。2518新资源帧和1120旧入场像素参考不等于原生微信、网页触屏或完整动作像素验收；官方/现行和设备未验。[源证据](../analysis/game-battle-loop-v1/source-check.json)、[规格](../analysis/game-battle-loop-v1/implementation-spec.json)、[测试](../analysis/game-battle-loop-v1/test-results.json)、[TCP](../analysis/game-battle-loop-v1/network-validation.json)、[验收](../analysis/game-battle-loop-v1/validation.json)、[目标审计](../analysis/game-battle-loop-v1/goal-audit.json)。

<a id="stage186"></a>

## stage186：$T5基础输入的双侧实际TCP

源和实际生成中立API各13新OS loopback TCP，共26条；每条正常五请求，42条准确$T5输入请求核对，包括H|A/G/P/E、N与W|FF。两次重入循环与两次发送后取消/像素重试证明意图和发送不重放；端点始终为原创本地对端，原生wx、设备和官方未参与。

另外双方各一次原创wx.write失败，真实startup/incoming仍走OS TCP，但失败的输入没有送达服务器，单独记录；任务保留failed终因，错误详情经适配层净化，拥有链闭合。C/P/A驱动源输入；M在phase4与请求5边界仍排队，不假造服务器接受动作。

四构建/67生成检查，515输入与34产物核身份、0external；中立包不依赖DOM/Buffer/Text/网络/计时全局。测试夹具跨Realm数组比较已改为host Array.from后的严格字节/数值比较。原生gamePage/网络准入/设备、现行与官方兼容仍未验收。[源证据](../analysis/game-battle-input-v1/source-check.json)、[规格](../analysis/game-battle-input-v1/implementation-spec.json)、[测试](../analysis/game-battle-input-v1/test-results.json)、[TCP](../analysis/game-battle-input-v1/network-validation.json)、[验收](../analysis/game-battle-input-v1/validation.json)、[目标审计](../analysis/game-battle-input-v1/goal-audit.json)。

<a id="stage185"></a>

## stage185：真实C/M接收与入场双侧运行

新增源和实际生成中立API各11条OS loopback TCP，共22条/1390像素帧，均核正常五个启动请求。覆盖正常/延迟C、入场运动、捕获与C后的取消重试、提前关闭/读失败、再入场、弹窗依赖、四C环回绕和普通场景未完读取交接。entry自动在2帧后消费一条C，M仍等待4之后尚未实现的输入。

暂停重试合计4次均核clock、phase/callback与C读游标不重放；reentry取消旧像素并严格核重复entry/data包数。关闭前先等真实end接收写游标，再核EOF，解决早关导致RST的夹具竞态。原生wx/设备/官服未参与；wx/文件/时钟/计时器均为显式原创端口。四构建/53生成检查通过，511输入和34产物身份一致，0external。[源证据](../analysis/game-battle-entry-v1/source-check.json)、[规格](../analysis/game-battle-entry-v1/implementation-spec.json)、[测试](../analysis/game-battle-entry-v1/test-results.json)、[TCP](../analysis/game-battle-entry-v1/network-validation.json)、[验收](../analysis/game-battle-entry-v1/validation.json)、[目标审计](../analysis/game-battle-entry-v1/goal-audit.json)。

<a id="stage184"></a>

## stage184：基础战斗像素的源/生成API双侧联测

新增源客户端与实际生成中立API各5条OS loopback TCP，共10条；正常五个启动请求、真实C/M/资源拥有链与422像素帧/420回调通过，另核暂停取消后提前恢复、读取未完即关闭、资源读取失败。像素oracle独立用Python投影观察到的原创测试状态，body状态的独立20组1994步另验；不混淆两类证据。

测试明确供给wx/文件/计时端口与640×480源视口，修正了原普通场景夹具320×240造成的裁切误比。成功绘图后仍保持battle-pending，M/END不自动返回地图。34neutral及7App/Page、四构建通过；503输入身份、34产物身份、0external。没有原生微信网络/设备、原程序、官方服务器或账号验收。[源证据](../analysis/game-battle-scene-v1/source-check.json)、[规格](../analysis/game-battle-scene-v1/implementation-spec.json)、[测试](../analysis/game-battle-scene-v1/test-results.json)、[TCP](../analysis/game-battle-scene-v1/network-validation.json)、[验收](../analysis/game-battle-scene-v1/validation.json)、[目标审计](../analysis/game-battle-scene-v1/goal-audit.json)。

<a id="stage183"></a>

## stage183：真实资源库与C/M回调的本地网络验证

新增14条实际127.0.0.1 OS TCP：源客户端和中立生成API各7条sup/escape-failed/escape-other/escape-local/status/end/dead-sup。原创Python对端核五个正常启动请求，经真实codec/session/world传C/M；client绑定自己library的目录/geometry，每路9次资源读取。共1238次调用验证动作反馈、状态/ACT、死亡子对象、脱槽和停止后下一次manager请求7；暂停不推进和owner关闭均检查。

这些是显式本地源上下文调用，不是原生WeChat网络或自动main10。没有新战斗线路字段/出站动作，client保持battle-pending，不把END写成返回地图。视觉RNG seed/quarter/renderer上下文显式提供，完整应用RNG和原生时序仍未知。

1514 Node、四构建与35生成检查通过；三App各131输入/11产物、API106输入，499次输入与34产物身份相符，0external。完整战斗渲染/输入/退出、原生微信游戏Page/设备及现行/官方仍未验收。[网络回执](../analysis/game-battle-body-v1/network-validation.json)、[构建/测试](../analysis/game-battle-body-v1/test-results.json)。

<a id="stage182"></a>

## stage182：真实C/M网络入口到调用级命令状态

新增6条实际127.0.0.1 OS TCP：源模块和新生成API各有queues/end/eof三路。原创Python对端严格核对5次启动请求，再经真实会话/codec/外层分派传入C/M；显式world调用消费M并验证32槽/队列、END请求7、耗尽请求2和轮次2→3。每路检查owner正常释放；wx/文件/时钟端口是显式原创适配，不是原生微信或官方网络证据。

没有新增战斗出站字段、认证或保护绕过。真实client继续battle-pending，无普通runtime与战斗渲染，END和C end都不会直接恢复地图。21neutral+7生成App/Page共28检查及四构建通过；三App各128输入/11产物、API103输入，487次输入身份检查及34个产物身份相符，外部导入0。

main10完整驱动、其他handler、body/渲染/输入/退出返回、原生WeChat游戏Page/设备和现行/官方联机仍未完成。[网络回执](../analysis/game-battle-commands-v1/network-validation.json)、[构建和测试](../analysis/game-battle-commands-v1/test-results.json)。

<a id="stage181"></a>

## stage181：真实M入站与源/生成API一致性

没有新线路字段或新出站战斗操作。继承真实>HY/?+e解码/四槽环，新增显式准备端口；原创对端M含ESC/CHT/END，principal20/21/-1、源名字Original|Message和依赖mask在两种API相同，且环未消费。

11项新增/1474项全量Node通过；582条原创独立用例覆盖24token、131个SKL类别和55别名，另验RID回退、原始槽区别、字节计数回绕与1023命令边界。源模块/中立生成API各2条实际OS TCP，共4新路径，核正常五请求、M字段/名字/依赖一致、环未消费及关闭。18neutral/7生成检查和四构建通过；三App各126输入11输出，API101输入，0external。

[源证据](../analysis/game-battle-runtime-v1/source-check.json)、[规格](../analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](../analysis/game-battle-runtime-v1/test-results.json)、[TCP](../analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](../analysis/game-battle-runtime-v1/validation.json)、[完整目标](../analysis/game-battle-runtime-v1/goal-audit.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：实际战斗入站与真实本地TCP

>HY两个int32和?+e一个bytes均复用既有catalog，不新增线路字段。P从byte2按六个%X，A按两个%X部分赋值；C/M分离四槽环；second-U的判断顺序必须保留。当前没有发出新战斗命令。

17项新增/1463项全量Node通过。原创独立240条C消息/820记录/7数字边界与22槽源表核对；源模块与中立生成API各2条实际OS TCP，共4条，验证正常五请求、实际入场/队列/显式消费/回绕与关闭，没有战斗图像或动作执行验收。16neutral/7生成检查、四构建通过；三App各123输入11输出，API98输入，均0external。 Chrome156.0.8078.80/Playwright1.64.1实测桌面1100×850和触屏390×844两条game.html流程，真实Files/正常人物升级选择/入场/持续收包/断开通过，6张原尺寸截图全部复核，0应用错误、警告、外部请求和横向溢出。Browser插件缺席，复用现有Playwright。stage179的15浏览器流程证据保留，本轮未重跑，不能合计为本轮17条。

[源证据](../analysis/game-battle-transition-v1/source-check.json)、[规格](../analysis/game-battle-transition-v1/implementation-spec.json)、[测试](../analysis/game-battle-transition-v1/test-results.json)、[TCP](../analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](../analysis/game-battle-transition-v1/validation.json)、[完整目标](../analysis/game-battle-transition-v1/goal-audit.json)。

**阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：真实*Cc/Kk0和/Re闭合

出站*Cc为3个int32：DISPLAY X/Y及join1/leave0；入站Kk0为2个int32：mode/result；离队确认/Re为3个int32：TARGET X/Y及native facing低byte符号扩展。使用已有catalog，无新增字段。

18新增/1446全量Node通过。独立Python覆盖960图标、5376命令、3009锚点及128完整场景/65种RGBA SHA。源模块和中立生成API各2条实际原创OS TCP，共4新路径/256帧，并核对延迟回复、精确出站字节和关闭。14neutral/7生成检查、四构建通过；三App各121输入11输出，API96输入，均0external。 Chrome156.0.8078.80/Playwright1.64.1共15桌面/触屏流程通过，75张截图经7联系表与新原尺寸图复核。实际game.html/Files/正常人物流程/按钮/暂停/关闭验证；0应用错误、警告或外部请求，4条QA Canvas读回提示单列。Browser插件缺席，使用现有Playwright；无浏览器安全覆盖。 额外测试在display[2,3]/target[3,3]移动段及facing255时确认/Re 3 3 -1，不能把当前位置代替target。

[源证据](../analysis/game-party-actions-v1/source-check.json)、[规格](../analysis/game-party-actions-v1/implementation-spec.json)、[测试](../analysis/game-party-actions-v1/test-results.json)、[TCP](../analysis/game-party-actions-v1/network-validation.json)、[验收](../analysis/game-party-actions-v1/validation.json)、[完整目标](../analysis/game-party-actions-v1/goal-audit.json)。

完整队伍控制/其他快捷键/modal、战斗/宠物/特效/复合转场、其余纠偏/输入/reset/生产启动/资源/玩法、微信原生gamePage和设备、现行及官方兼容仍未完成。无真实测试账号。完整目标active，本轮无VM/CUA/WER/CDB/原程序/账号/官方操作；stage131已执行恢复的诊断不重放。


<a id="stage178"></a>

## stage178：源队伍状态贯穿真正输入和字节通路

16项新增、1428项全量Node通过；160距离用例、11个队列长度/速率、16分支组合及3场景224帧完整图像/195种RGBA SHA通过。源模块与实际中立API各3条原创OS TCP，共6条/448帧，独立peer核对队长两条源移动命令、队员零自主命令和关闭归属。12neutral/7生成检查通过；三App各120输入11输出、API95输入，均0external。 新6条为三种场景×源模块/中立生成API；通过具名公开测试，逐次断言独立peer的出站帧回执、完整RGBA与关闭。无新增协议字段。

13个Chrome156.0.8078.80桌面/触屏流程通过；新2条实际game.html路径含正常选人/升级、实际Files、队员点击禁自主路径、收到解散、暂停/继续/关闭。65张唯一截图经6联系表复核，新桌面/手机跟随图另读原尺寸；0应用错误/警告/外部请求，4条旧QA Canvas读回提示单列。 中立VM内无DOM/Buffer/URL/文本编解码器/网络/时钟全局，OS socket是明确传入的原创宿主端口；未声称原生微信设备、官服或真实账号验收。

[源证据](../analysis/game-party-follow-v1/source-check.json)、[合同](../analysis/game-party-follow-v1/implementation-spec.json)、[测试](../analysis/game-party-follow-v1/test-results.json)、[网络](../analysis/game-party-follow-v1/network-validation.json)、[验收](../analysis/game-party-follow-v1/validation.json)、[完整目标](../analysis/game-party-follow-v1/goal-audit.json)。

完整队伍UI/加入离开响应、aux04队长/模式图标、战斗/宠物影子/活跃复合转场、其他文字/UI与完整纠偏/输入/reset/生产启动/玩法、微信原生gamePage及设备、现行和官方兼容仍未完成；原生x87与非法重复身体/空指针行为未复现。完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage177"></a>

## stage177：真实值写入/队伍记录和显式显示选择

25项新增、1412项全量Node通过；198个独立整数用例、120帧完整图像/107种SHA、12帧预解码/延迟资源相符。1001人物/3003值条全局图像与文字共用4096槽（文字存在时4095图像）的边界已验。6条实际原创TCP核460帧、每条5次既定客户端请求；9neutral/7生成检查通过。三App119输入11输出、API94输入、0external。 本轮接收真实E(9 / ]_g / HFs，条值/标签开关仅改变本地选项；peer对本地操作的stdin应答不算网络消息。

所有数值/掩码/队伍数据与坐标描述在shared；网页新增薄显示按钮，微信API统一导出。真实TCP来自独立原创Python、wx形状端口依然由Node提供OS socket，未构成原生微信/官方网络验收。

[源证据](../analysis/game-actor-vitals-v1/source-check.json)、[合同](../analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](../analysis/game-actor-vitals-v1/test-results.json)、[网络](../analysis/game-actor-vitals-v1/network-validation.json)、[验收](../analysis/game-actor-vitals-v1/validation.json)、[完整目标](../analysis/game-actor-vitals-v1/goal-audit.json)。

队伍跟随/本机输入上下文同步、aux04队长/模式图标、宠物影子及战斗条源、其他文字/UI、完整纠偏/输入/reset/生产启动与玩法、微信原生gamePage/设备、现行与官方兼容仍未完成。HFs已存状态尚未动态桥接f5f170/f536b2到现有显式输入上下文；完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage176"></a>

## stage176：字形端口与本地标签选项

普通姓名的线路字节保留在shared，平台端口选择解码与宿主字形；不从DEFAULT_CHARSET推出线路编码。实际Hr]接收消费者和E(9 field28已连接，标签显示循环只改本地mode，未编造发送命令。

32项新增、1387项全量Node通过；187宽度、2304标签选择、24文字合成，共2515个独立例（含预期拒绝），120帧完整场景/96种SHA、12帧预解码/延迟精灵相符。6条实际原创TCP核460帧，标签循环不增加5次既定客户端请求；8neutral/7生成检查通过。三App118输入11输出、API93输入、0external。 11个Chrome156.0.8078.80桌面/触屏流程通过，37张唯一最终截图已查，0应用错误/警告/外部请求；4条QA读Canvas性能提示单列。网页新增显式ASCII/Windows936选择和实际标签切换按钮；宿主字体为可替代端口，未证明Windows原生GDI字形像素或线路默认编码。

微信API有相同可选rasterText回调，neutral测试显式注入原创mask与微信形状OS TCP端口。它不提供原生微信字体/Canvas/游戏Page或官方TLS/账号验收。

[源证据](../analysis/game-actor-text-v1/source-check.json)、[合同](../analysis/game-actor-text-v1/implementation-spec.json)、[验收](../analysis/game-actor-text-v1/validation.json)、[测试](../analysis/game-actor-text-v1/test-results.json)、[网络](../analysis/game-actor-text-v1/network-validation.json)、[完整目标](../analysis/game-actor-text-v1/goal-audit.json)。

HP/队伍、其他文字通道/聊天/头顶气泡/aux04/菜单、完整本机纠偏/输入/reset/生产启动与中文语义、战斗及其余玩法、微信原生gamePage/设备、现行消费者和官方兼容仍未完成；整体goal active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage175"></a>

## stage175：状态动作的实际本地TCP与可移植性

真实协议管线消费45..49/63/64/99、远端40/41/42/44；未使用包坐标的分支不套坐标范围检查。99写raw180而不是仅绘制提示，实际pointer/本机运动/普通回调都遵守其80位。现有显式源上下文的其他未知位继续保留。

6条原创Python回环TCP（Node及wx形状端口各full/reload/close）验证1660帧完整场景、24个源事件、5次真实请求和各所有者清理；7neutral/7生成工程在无DOM/Node/默认网络能力上下文通过。wx形状测试使用本机实际socket，不等于原生微信设备、TLS或官方会话。浏览器桥的既有10秒idle/4MiB范围未变；QA不能靠无限静默等待证明原生会话寿命。

[源证据](../analysis/game-actor-presentation-v1/source-check.json)、[合同](../analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](../analysis/game-actor-presentation-v1/validation.json)、[测试](../analysis/game-actor-presentation-v1/test-results.json)、[网络](../analysis/game-actor-presentation-v1/network-validation.json)。姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：60附属经真实TCP抵达拥有者和完整场景

[独立原创Python对端](../analysis/game-actor-attachment-v1/original_peer.py)验证5个实际客户端请求，以真实封包发送60/8/0/70/80序列。Node及微信形状适配各跑full540帧、reload20帧、close90帧，共6路径1300完整场景像素一致。full含12个源消息、15条60记录；更换空/缺动作资源、恢复、骑乘、旋转、移除、重建均经真实会话抵达核心。[回执](../analysis/game-actor-attachment-v1/network-validation.json)。

测试控制管道只让原创对端决定发送时点，不新增游戏协议字段。浏览器另有11实际页面流程；精确源帧与浏览器墙钟时点分开记录。微信形状传输仍由本机Node承载，原生微信设备不作验收；本轮0官方会话、无账号操作或原程序联网。


<a id="stage173"></a>

## stage173：源70经真实本机TCP到完整渲染

[独立Python原创对端](../analysis/game-actor-ride-v1/original_peer.py)核对5个真实客户端请求，按明文规格发送单位与70进入/退出/再进入记录，经实际封包、编解码、会话和world抵达拥有者。Node与微信形状适配各跑full/reload/close，共6条路径380帧完整场景像素一致；每条收尾均关闭拥有者。full收到9条70动作、close6条、reload3条，未猜测参数2用途。[回执](../analysis/game-actor-ride-v1/network-validation.json)。

微信路径的TCP后端仍是本机Node，原生微信设备不作验收。另有11个实际网页流程、6neutral/7生成工程检查；0外部请求。既有联网授权保持，但本轮没有官方服务器、账号或原程序联网行为；本机对端成功不代表官方兼容。


<a id="stage172"></a>
## stage172：实际源80路径与旋转中的场景/关闭

封套、codec、认证和线上字段未新增。真实Hx!动作80驱动演员状态，真实场景仍通过现有入场等待/缓存处理。原创建材先发送单位和80、后发送最后地图材料，确保首次播放前状态齐全；没有伪造移除或额外C0来完成换场景。

6条新增实际原创TCP覆盖完整400帧、137帧时换场景、200帧时关闭，Node与微信API形状端口各3条，各737帧，合计1474帧独立像素与状态/事件/深度通过。Python核对5个客户端源请求及3个80发送；非零参数2不生成附属。换场景从正常100001资源/朝向重建，旧runtime/player关闭；活跃旋转关闭无残留监听。[回执](../analysis/game-actor-spin-v1/network-validation.json)。

5neutral含实际bundle的400帧，7生成工程与11Chrome通过。API形状TCP、桌面/移动浏览器均不是原生微信设备或官方会话；现有本地桥目标和预算未放宽。[测试与范围](../analysis/game-actor-spin-v1/test-results.json)。


<a id="stage171"></a>
## stage171：同一源实体绑定通过实际TCP跨端检查

网络封套、codec与已证单位/场景格式未新增。世界消费真实scene.fields[8]和C0类别/标志，client直接启用逐实体绑定，不通过启动声音context补构造mode，也不发送虚构移除包。普通换场景继续释放旧远端及动画，新的mode只作用于之后的构造。

6条新增真实原创TCP路径覆盖混合实体、换场景与关闭，分别使用通用Node端口和实际Node TCP承载的微信API形状端口。独立Python对端核对5个客户端源请求、9条混合实体发送及结束回执；四条播放路径合计480帧像素/提交顺序通过，其余两条验证关闭。[实际回执](../analysis/game-actor-context-v1/network-validation.json)。4neutral含真实bundle的120混合帧；11Chrome流程保持本机目标和真实File输入。

这些结果不代表微信原生设备或官方会话。开发桥既有目的地、10秒/4MiB限制与原有WebSocket回归未改；生产认证/启动、完整玩法、当前版本及官方兼容仍在[剩余目标](../analysis/game-actor-context-v1/goal-audit.json)。


<a id="stage170"></a>
## stage170：初始等待与提前位置包的跨端一致性

现有封套、codec、接收分派及线上字段未新增。shared本机投影会保存提前到达的逻辑坐标/朝向；main9对象已存在时，C0只刷新源资源/标签及适用值，保留当前坐标和非负朝向。移动/Canvas等待实际本机单位及已接受地图，同时保留本地地块与速度检查。

sourceEntryWaitMask是宿主元数据，初始3对应已证main5等待来源；已接受地图清1、本机单位清2。原生4ef580清位位于补丁处理后，宿主仅接受身份兼容的成功写入或匹配notice，属于明确的保守子集，不能把此字段当完整原生922c4c镜像。普通ready换场景可用已知全局资源重建，不要求伪造额外C0。

8条新增真实原创TCP用例分别在Node与微信形状端口检查位置提前、地图缺失/错身份、普通换场景和等待关闭；5个客户端请求均由独立Python对端核验，回执留存。[网络证据](../analysis/game-local-bootstrap-v1/network-validation.json)。完整Node还覆盖既有7条TCP及双目标WebSocket；11Chrome流程通过。微信原生设备/current/官方与完整网络业务仍未验收，现有开发桥10秒/4MiB边界未改。


<a id="stage169"></a>
## stage169：统一连接生命周期与有序端点绑定

portable client先初始化本地资源，再通过明确factory取得同身份session；源认证/列表/创建/选项/升级/入场继续沿已证协议。首次ready同时要求实际scene/map/local actor/速度/当前地块，代替测试里的固定5包条件。没有新游戏报文、认证字段或账号模拟。

新增可选browser session `endpoints`保存桥的完整有序allowlist；此前只传选定端点，会把第二目标误发ordinal0。本轮实际双目标WebSocket验证第一目标0连接，第二原创peer完成auth/list/upgrade/refresh/entry5请求；同页断开后第二目标重新选材料、两次源bootstrap验证通过。控制序号是桥协议，不是游戏wire字段。回环地址限制、CSP、安全设置和既有10秒/4MiB桥预算均未改。

场景变化和丢就绪停止旧输入/runtime，源CUT准备完成再恢复；暂停不关闭连接，恢复重置clock；EOF/失败/离页关闭独立所有者并结算Promise。共享文件端口借用，浏览器File包装自己关闭。7原创TCP含5场景链各52摘要/两移动及拒绝/入场前断开；7Chrome包含真实File、桌面/触屏/重试、重载保暂停、pagehide、同页重连和错误bridge profile。[回执](../analysis/game-browser-owner-v1/test-results.json)。

这不等于长期官服通道；生产startup/digest/current ticket/文本/context producer、native微信game Page/Canvas/file/scheduler与设备/官方继续待验。固定网页入口已存在，完整游戏目标仍active。


<a id="stage168"></a>
## stage168：升级握手的独立时序与跨端结果

source main13的5[B和WDM不共用登录ack/deadline。0/1→2后已知请求→3，下一步等待窗→4；WDM低字节0→100→101成功，非零→200→201失败，无材料→202→203。成功由用户确认后main3sub0重查询，失败由用户重试回phase1；实现不设猜测600001/20001超时、不自动重发或本地升级名单。

session owns每次Promise/有序写入/帧清除；marker编码后清。发送前校验fresh borrowed world；关闭在途等待者必结算，观察器重试不覆盖旧等待者，过期/重复WDM不能消费列表ack。外观按钮无新网络动作，修改后仍用既有field15/17/2入场；单field16绑定先于发包。

6原创Python实际TCP验证auth/list/upgrade/refresh/entry、两移动/位置纠正/EOF，含两槽、默认33100、拒绝后明确重试及拒绝/中止；四条成功各52场景摘要。普通API和WeChat形状端口共用核心；fixture.invalid:12345映到自有回环端口，不放宽正式端点规则。Chrome5流程含鼠标/触屏/显式retry各53帧以及两个晚答复关闭分支，外部请求0。[回执](../analysis/game-character-options-v1/test-results.json)。

这仍是原创受控对端验证。native WeChat/TLS/设备、正式game Page/current票据/模块摘要及官方接受未验，整体目标继续active。


<a id="stage167"></a>
## stage167：创建握手、刷新与错误保留连接

postLogin会话的创建命令只由已确认源draft产生，同一FIFO编码一次并清移交name。U_s的ack1/精确successful和4ef430 ack优先/600001ms独立于登录期限；这里没有entry的connected-first门槛。成功回main3sub0查询真实新列表，不从本地参数造人、不自动进入。拒绝/超时保留stream，显式错误返回main3sub10，无retry/requery；close清待发/在途材料与commit等待者。

4原创实际Python TCP核auth→list→create→refresh→entry→两移动，通用slot1/mode2和微信形状slot0/mode0成功各52摘要/7请求；重复成功、拒绝保留连接及主动中止通过。Chrome两视口真实表单→同一链各53摘要，另错误返回与两种晚到close通过，console/外部请求0。原有loopback/同源/token/4MiB/10s与WeChat域名/端口限制保持，未添官方目标或放宽安全配置。

这些是原创本地流量与实际浏览器证据；native微信设备/中文编码生产绑定/正式页面/生产网络路径/current/官服仍未验。[回执](../analysis/game-character-lifecycle-v1/test-results.json)、[接口](module-interfaces.md#stage167)。


<a id="stage166"></a>
## stage166：登录后列表与已有角色入场流

启用postLogin后，源登录ready仍与菜单/游戏入场分开。会话通过现有world codec发无参1?v，等待VK0，仅在菜单武装且已有槽可用时按0X@的三个已证数值字段发送。V?S的精确successful和源main9边界之前拒绝业务命令；重复/错阶段回复不能替换列表或重放请求。host whitelist是比native共享ack更严格的明确政策。

列表与入场的600001ms计时不复用登录20001ms；native entry先看连接，再ack，再deadline。流宿主遇EOF/关闭仍立即终结，以宿主资源政策处理断线；无自动重连/登录重放。名称与原始entry detail留在拥有的core，onPacket不见这些材料。browser/WeChat仅透传显式postLogin，原有loopback/同源/token、端口/域名/资源上限不变。

4条实际原创Python TCP覆盖两槽成功/重复、OUTOFSERVICE与拒绝，先逐字节核auth/list/entry，再成功各52场景摘要/两移动。Chrome两视口经真实HTTP/本地桥与选人控件各53摘要，拒绝和两种晚到close通过，console/外部请求0。全部是原创本地流量；正式页面、生产浏览器网络路径、原生微信、当前/官方仍未验。[回执](../analysis/game-post-login-v1/test-results.json)、[API](module-interfaces.md#stage166)。


<a id="stage165"></a>
## stage165：源登录流程跨流端口运行

source-bound纯login只认明确uint32时钟和已证回复，world保留原帧/key/message逻辑；stream owner将连接成功边界、单读、有限有序写、EOF、取消及deadline接到两端。source poll返回1前不放行业务；ready/官方接受分开。宿主在挂起open/read/write/回调期间也施加20s期限，这是保守端口政策，不宣称原生调度交错完全相同。无自动重连/心跳全生命周期。

browser复用**原创本地**WebSocket→TCP桥，保留loopback目标、token、同源与既有4MiB/10s测试限额；不是可直接访问官服的浏览器方案。WeChat复用已有createTCPSocket与端口/域名/资源上限，不关闭原生校验；native write完成只代表API接受。独立API构建不等于游戏Page或设备网络验收。

原创实际TCP的登录请求/两移动请求经独立Python逐字节核对；两成功用例各52帧、busy拒绝，Chrome两视口各53摘要、校正/EOF/关闭通过。正常HTTP测试夹具能保持同源local交付；合成导航响应曾触发LNA，原因关联是推导，实际错误和修复记录保留；浏览器权限/安全flag未改。[Chrome官方LNA说明](https://developer.chrome.com/docs/modern-web-guidance/guides/security/local-network-access)、[回执](../analysis/game-session-runtime-v1/test-results.json)。正式页面、完整上下文/current/原生三端/官服仍未完成。


<a id="stage164"></a>
## stage164：异步资源与发送请求的分界

资源库与数值drawPlan无DOM/平台timer/网络/文本/crypto依赖；文件访问必须注入stat/read，浏览器适配只读已选File句柄。world仍同步推进，I/O在呈现队列之后；onRequests先交付已产出描述符，图像失败或retry不得重新发送/推进同一轮。独立Python原TCP实际验证52场景摘要和2条编码移动请求，校正消息在该可控trace结束后消费，不当作真实网络调度接受证明。

2neutral在缺Buffer/TextEncoder/DOM/Abort/performance/crypto/timer环境运行209路径、4palette与52延迟场景/两编码请求；3新微信工程各104输入/11输出/0外部导入，7项生成App/Page回归通过。微信Page尚未接新的游戏Canvas/File资源宿主；构建不是WXML/AppID/设备接受。

Chrome156桌面与触控各53摘要、7项异步/交互门通过；另旧同步Canvas两视口回归通过。I/O后按原绝对deadline计算剩余wait，5002→5010读图与5016⅔ deadline实际测试得7ms；不把旧等待时长再加一遍。generation/句柄/once门抑制旧timer，source tick回调关闭也不提交像素。实际设备/文件读取耗时、跨worker/存储quota、真实消息回压与当前/官方均待验。[验收](validation.md#stage164)。

<a id="stage163"></a>
## stage163：普通运行核心的发送与平台边界

runtime无DOM、socket、timer和隐式账号行为，调用者提供uint32 tick及原生上下文。所有skip轮次仍推进world/map/actor并保留已产出移动请求；独立Python原TCP实际接收两条encoded frame，并核对52个camera/scene摘要。Canvas的onRequests在像素呈现前收到描述符，顺序/重试/回压由外部传输owner负责，未新增官方网络端点。

esbuild0.25.12 neutral产物在无Buffer/TextEncoder/DOM/Abort/performance/crypto/timer环境通过2项实际执行；3份微信构建各100输入/11输出/0外部导入，7项生成App/Page回归通过。微信Page尚未接新游戏Canvas/input宿主，生成包不代表WXML/AppID/设备/原生网络或官方接受。浏览器普通适配在Chrome156桌面/触控各53个独立像素摘要通过；它使用显式一次tick采样和测试调度，不能证明真实设备时延/性能或原多次GetTickCount完全等价。

**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

完整资源与原生 runtime/record/UI 上下文绑定、右键交互、小地图/primitive/特殊角色/特效、战斗/其余业务及认证、现行版本、实际三端与官方可玩仍未完成。旧版37c4不等同9baa/6e2ff；本轮没有VM、WER、CDB、账号、官服或原生IDE新操作，也未重放已消费停止点。

<a id="stage162"></a>
## stage162：实际本地TCP到普通地图场景

独立Python对端仍仅用3份原创材料，经127.0.0.1实际分段收发bootstrap、角色、scene与地图patch；客户端把已有map/actor/local movement接到CUT普通场景，52个场景RGBA摘要及2条实际移动请求经独立参考核对，对端退出0，后续服务端位置更正仍可处理。scene提供器失败时，actor画面和待发移动仍返回，协议可继续；重新configure后恢复。[回执](../analysis/game-legacy-scene-frame-v1/test-results.json)。

2项neutral在无DOM/wx/Buffer/编码器/网络API环境验证同一流程；三个新微信工程各97输入/11输出/0外部导入、7工程回归通过。实际Canvas/输入/帧时钟/资源宿主、原生WXML/设备/域名/AppID/HTTPS及认证官服仍未验收；本轮没有新增官方请求或账号会话。[接口](module-interfaces.md#stage162)。

<a id="stage161"></a>
## stage161：本地TCP消息与画面状态连接验收

独立原创Python TCP对端只用3份公开原创材料，在127.0.0.1分段发送bootstrap/scene/角色/地图patch，核对客户端实际编码发送的2条移动请求，再发位置更正。world帧接口的52帧位移、动画和RGBA摘要与Python独立参考相符，进程退出0。绘制提供器失败时，移动请求仍随返回值交调用方发送，协议可继续接收；未把图像故障当作网络断线。[测试回执](../analysis/game-legacy-frame-v1/test-results.json)。

2项neutral测试在无DOM/wx/Buffer/编码器/网络API环境验证同一核心。三个微信工程各96输入/11输出/0外部导入、7工程回归通过。以上是本地协议/生成工程证据，未新增官方连接；原生TLS/域名/AppID/设备、完整场景时钟/输入、账号认证和官服兼容均未验收。[接口](module-interfaces.md#stage161)。

<a id="stage160"></a>
## stage160：动画与帧时钟、资源IO保持显式接口

动画catalog/player只消费传入字节/整数/geometry，事件仅数值描述符，不访问时钟、文件、Canvas、DOM、音频或网络。geometry与prepared sprite由资源host提供，记录kind区分animation graphic ordinal和static resource lookup；禁止按文件名猜group/base或按16ms猜helper次数。两项neutral在平台API缺席时复核1250状态及1235普通RGBA步，0外部导入。

三新微信95输入/11输出/0外部导入，7实际生成工程回归、1033完整Node通过；旧launcher目录/候选/缓存/清理流程保持。尚未把动画强行接到未知游戏会话/认证或实际输入/时钟；actor/network重启与场景资源host需要后续源绑定。没有账号/官方服务器/VM/原生IDE新增接受，当前和三端可玩仍未完成。[测试](../analysis/game-legacy-animation-v1/test-results.json)。


<a id="stage159"></a>
## stage159：图像核心与传输分离

新增source图像/CGP/native32/普通sprite/frame核心不访问网络、文件、DOM、Canvas、Buffer、TextEncoder或wx；caller传入选定archive区间和显式palette/LUT/position/context。两项neutral检查在这些平台API全部缺席时复核315RD、23palette、100frame及catalog/archive拥有链；pure核心0外部导入。frame是RGBA拥有数组，Canvas或微信绘制/帧时钟尚需薄适配接线。

三个全新微信工程各94输入/11输出/0外部导入及7工程测试通过；既有目录/资源候选/清理与本地原创peer流程继续工作。没有新增网络请求/账号/官服/原生IDE或微信设备接受。游戏auth、完整scene/input/animation/battle/host和当前官方兼容保持未完成。[测试](../analysis/game-legacy-render-v1/test-results.json)。


<a id="stage158"></a>
## stage158：本机运动、地图等待与可移植元数据

graphics/navigation/local-movement仅标准typed arrays/WeakMap/Math；无DOM/Node/wx/IO/时钟/新依赖。world使用map.readRectangle和小collision缓存组合实际已证数据，host显式供源context/帧tick并发送描述符。独立Python对端只3公开原创文件，在targeted/full共4轮分别核普通移动/位置校正和地图等待/补丁恢复，每轮2真实封包请求。[接口](module-interfaces.md#stage158)、[回执](../analysis/game-legacy-local-movement-v1/test-results.json)。

984Node/2neutral/7工程、三新微信构建93输入/11输出/0外部导入通过。生成App/Page仍是既有登录器/资源流程，不能据此声称游戏host/renderer已接入；实际gates/scene/party、8192轮与frame调度/设备性能、HTTPS/AppID/存储配额、完整auth和当前/官方可玩仍待完成。

<a id="stage157"></a>
## stage157：可移植实体状态、单步移动与请求

新actor/motion/data只依赖标准typed arrays/Map/Math；复用源inner/数值字段语法，无DOM/wx/Node/时钟/网络/文件API及新依赖。world组合源context、实体/动作/删除、local globals和场景清理，移动描述符经既有加密/封包链发送，host显式提供origin/路径并调tick。[接口](module-interfaces.md#stage157)。

947Node/2neutral覆盖全部原创记录与方向/轨迹/范围/投影、字节world链和重入/清理；独立TCP核1移动请求/10消息。三新微信工程90输入/11输出、0外部导入，7生成检查通过。实际游戏host尚未接绘制/输入/时钟/缓存路径；本机预测/碰撞/寻路、8192轮调度/设备性能、HTTPS/AppID/网络配额、完整auth与当前/官方接受未验。[回执](../analysis/game-legacy-actors-v1/test-results.json)。

<a id="stage156"></a>
## stage156：world协议与无平台状态组合

新scene/state/catalog依赖标准typed arrays/Map及既有MAP界，无DOM/Node/wx/网络/文件API或新增依赖。world从首场景自动准备缓存；原始byte协议入口保持raw模式，已有encodeCommand消费地图请求描述符。2neutral覆盖21场景/119状态/20标签及12消息组合。[接口](module-interfaces.md#stage156)、[测试](../analysis/game-legacy-scene-v1/test-results.json)。

三个新微信工程各87输入/11输出、0外部导入，914Node/7生成工程通过。实际host缓存持久路径/variant、游戏网络/HTTPS/AppID/域名/配额、设备性能和8192轮派生调度/取消、完整认证和官方可玩未验；无原生IDE/VM动作，保留既有停止点。

<a id="stage155"></a>
## stage155：地图业务的纯字节接线

固定37c4地图投影只依赖typed arrays及已有MAP限制，无DOM/Node/wx/网络/文件API或新增依赖。显式安装缓存后可由已有协议流校验、生成补取描述符、应用区域数据及再校验；描述符经既有编码发送，核心不发起连接。源码及2neutral覆盖32矩形/96校验/5补丁与完整字节组合。[接口](module-interfaces.md#stage155)、[测试](../analysis/game-legacy-world-v1/test-results.json)。

三新微信工程各84输入/11输出、0外部导入，898Node/7生成工程通过；这是本地可移植和回归证据。实际host缓存来源/初始化、原生socket/TLS/域名/AppID/配额/设备、此前8192轮派生的调度/取消/性能、完整认证及官服可玩均未验。原native服务停止点保持，没有新的IDE或VM尝试。

<a id="stage154"></a>
## stage154：从字节协议到类型消息的纯核心

新消息/协议对象使用既有纯JS crypto与外帧，不依赖DOM/Node/wx/文本/随机/时钟/网络API。pull next一次一事件，所有key/输入/输出所有权与终止清理有本机证据；仅位置意图投影接线，socket和真实控制/认证、游戏业务尚需host与来源合同。浏览器仍须明确传输支持。[接口](module-interfaces.md#stage154)、[合同](../analysis/game-legacy-message-v1/implementation-spec.json)。

2neutral检查覆盖全部目录与更新材料/位置投影；targeted/full的原创PythonTCP从仅四份公开原创脚本/数据的独立目录各运行一次，每轮验证62个回复与104接收分支，无私有游戏材料依赖。三新工程各83输入/11输出、7工程回归通过。没有原生SDK/设备/网络或当前官方接受；同步8192轮的调度/取消与设备性能仍未验。[测试](../analysis/game-legacy-message-v1/test-results.json)、[完整审计](../analysis/game-legacy-message-v1/goal-audit.json)。

<a id="stage153"></a>
## stage153：无平台crypto API的旧版正文核心

payload模块只依赖精确锁定的纯JS SHA256/HMAC/AES-CBC模块，调用方传字节；自身无DOM/Node/wx、随机数、socket、文本codec或计时器。与stage152外帧API可组合完成原创本机流，但没有接入真实连接/认证/业务生命周期，也未给浏览器增加原生TCP能力。[接口](module-interfaces.md#stage153)、[合同](../analysis/game-legacy-transform-v1/implementation-spec.json)。

2neutral检查在无平台API环境匹配Python/OpenSSL向量，targeted/full的Python TCP对端从独立临时目录启动，只复制原创夹具/脚本、不需私有游戏文件；三新工程各80输入/11输出、7工程回归通过。neutral7次bootstrap批次约8.0s，非真机基准；同步8192轮的host调度/取消、平台内存/性能和真实网络仍待验。没有当前版本或官方服务接受。[测试](../analysis/game-legacy-transform-v1/test-results.json)、[完整审计](../analysis/game-legacy-transform-v1/goal-audit.json)。

<a id="stage152"></a>
## stage152：纯字节旧版游戏wire封套

shared独立提供来源固定的编码和有界pull reader，不依赖DOM、Node、wx、文本API、socket或计时器。实际转换后的wire payload仍opaque；当前launcher TCP/HTTP/record与游戏封包各自分层，浏览器传输仍需实际桥接/平台支持，不因导出字节API获得游戏连接能力。[接口](module-interfaces.md#stage152)、[源合同](../analysis/game-legacy-network-v1/implementation-spec.json)。

24原创Python向量、任意小帧拆分/多帧/边界与本机Python TCP对端均通过；2neutral和3新微信构建、7生成工程仅验本地层。无原生网络/设备、真实服务器、账号或官方接受；现行9baa/6e2ff仍独立未知。8B候选门槛与无AF噪声保留可导致等待，队列满即明确拒绝追加，不静默丢数据；终止与上层超时归宿主后续合同。[测试回执](../analysis/game-legacy-network-v1/test-results.json)、[完整审计](../analysis/game-legacy-network-v1/goal-audit.json)。

<a id="stage151"></a>
## stage151：发行文件读取与游戏网络证据分开

实际新增网络为两个固定补丁元数据GET、主站公开下载页面和公开匿名FTP的精确文件/范围读取；没有游戏账号或官服会话。当前两清单SHA未变、各378操作，现行EXE未重下。历史包FTP单连接错误421保留，关闭自有未完成下载后才进行顺序范围请求，没有换IP或并发绕限。[当前发布观察](../analysis/game-release-current-v1/release-observation.json)、[材料与范围](../analysis/game-release-current-v1/legacy-acquisition.json)。

CGSharedMem是旧版Win32本地消费者证据，不能直接搬到网页/微信或推断游戏帧/身份；本轮未新增传输端口或业务字段。原生IDE停止点未重试/改设置，实际设备/当前服务/官方可玩仍待验。[首批静态合同](../analysis/game-release-current-v1/static-contract.json)、[完整目标审计](../analysis/game-release-current-v1/goal-audit.json)。

<a id="stage150"></a>
## stage150：结构模型的无DOM验证

新RD结构模型没有网络、文件系统、DOM、Canvas、Node/Buffer或微信依赖。实际neutral CommonJS bundle有12输入/1输出、0外部导入，在TextEncoder/Decoder、URL、fetch/process/require/wx/window/document及其他宿主API均未提供的JS环境通过48原创向量与资源v2/缓存恢复后解码。[测试回执](../analysis/game-rd-runs-v1/test-results.json)。

三个微信工程各70输入/11输出，保留urlCheck=true、游客AppID占位和完整既有许可，7生成工程检查通过。本轮没有原生IDE/手机渲染或网络接受；旧服务关闭停止点未重试/改设置，当前设置也未重新读取。资源结构模型不提供游戏网络、颜色或可玩证明。[验收](validation.md#stage150)、[完整目标审计](../analysis/game-rd-runs-v1/goal-audit.json)。

<a id="stage149"></a>
## stage149：配置文件不是游戏通信协议

Config.exe的3Ddevice及四flag是配置器的本地文件字段；本轮没有从它们推出服务器字段、游戏帧或认证前置。纯codec不依赖DOM/Node/wx/text全局，实际CJS与既有v2资源封套接通；829Node/3portable/7工程通过。[接口](module-interfaces.md#stage149)。

文件前256B/EOF替代策略不涉及真实socket；主游戏网络消费者、设备和官方可玩仍未验证，无新VM/账号/官服或原生工具动作。

<a id="stage148"></a>
## stage148：本机恢复与网络接受分开

新JS环境从实际原创测试文件恢复目录/资源后，无新增HTTP或文件选择，继续既有current会话并与原创Python对端交换；恢复base的下一清单只取manifest、不取archive。原create→append/rename迁移不宣称幂等，重复时保留PATH_ALIAS拒绝策略。[本机证据](../analysis/launcher-wechat-resource-cache-v1/test-results.json)。

缓存位于明确profile的USER_DATA_PATH固定子目录，无自动请求/保存/恢复/来源回退，取消晚写要求重新检查。822Node/7生成工程不是实际微信网络、TLS/域名/AppID、设备存储、官服或原游戏可玩接受。原生DevTools停止点未重复尝试。

<a id="stage147"></a>
## stage147：原生轮询策略不转换为网络重试

当前launcher经timer查询Windows进程，30分钟是一次提示阈值；与网页/微信有界HTTP总期限不是同一个契约。新纯模块只描述native动作，现有单来源顺序下载在失败时仍结束，sourceOrdinal/relay许可与请求序列未改。[接口](module-interfaces.md#stage147)。

802Node/5生成工程与本机relay证明本地实现层；未新增官服、VM或原生微信尝试。实际Web渲染后的current配置、手机/微信设备、HTTPS域名、AppID及官方登录/可玩仍待验收。

<a id="stage146"></a>
## stage146：固定资源来源relay及微信明确映射

固定PUK3资源请求仍是原HTTP来源/cg50/Update.TXT?t=epoch与/cg50/path/name.bz2?time=epoch。微信HTTPS profile不能把它自动改成同主机HTTPS；新增独立桥接route把选中的声明address/原portText明确绑定origin/id，客户端只发已验证原资源路径。此为本项目传输合同，桥接服务器/TLS/域名批准和上游真实性仍需实际配置与验收。[接口](module-interfaces.md#stage146)、[源绑定](../analysis/launcher-wechat-patch-v1/source-check.json)。

原创建Node handler仅启动固定来源，拒任意target/query、跨路径与未允许Origin，不转发Cookie/Auth/Referer；默认每个上游GET10秒，元数据/包按既有字节预算，body到finish/close后才释放，未完成close中断上游。便利server仅127.0.0.1随机端口，未提供公网/TLS部署。Node finish/writableFinished说明系统写入完成，不证明远端送达或认证。[Node官方HTTP文档](https://nodejs.org/api/http.html)、[本地实现](../adapters/node/launcher-patch-relay.mjs)。

本轮实际链路为原创上游HTTP→loopback relay→Node native-API形状客户端；HTTPS fixture与patch-source.invalid均由测试显式映射至自有loopback，未验TLS/DNS/AppID/真实微信网络。备用来源用完全封闭的原创响应函数验证序号，不对其公网IP发请求。既有Web默认行为保留，[验收记录](validation.md#stage146)确认792Node/5生成工程通过；未取得官服接受。

<a id="stage144"></a>
## stage144：微信HTTP支持显式HTTPS来源，原生网络接受仍待验

新微信请求端口以固定官方类型为依据：manual重定向从基础库3.2.2起列明Android/iOS/开发者工具支持，PC/Harmony未纳入本适配profile；运行时读取getAppBaseInfo.SDKVersion/getDeviceInfo.platform后决定是否可用。只支持明确HTTPS DNS/默认443来源及受限完整URI，responseType=arraybuffer，手动重定向、关闭缓存、分块预算与总期限；不推导真实官方端点或关闭原生域名/TLS检查。[接口依据](https://github.com/wechat-miniprogram/api-typings)、[固定源hash和接口位置](../analysis/launcher-wechat-bootstrap-v1/source-check.json)。

此端口复用既有current初始化语义，读取一份使用者明确选择的本地launcher字节，不拿小程序版本/空文件摘要冒充Windows样本。当前历史官方地址中的HTTP/裸IP不能直接套此HTTPS profile；需要适当且可核的实际服务/平台条件，未建设公网代理或替代官方服务。原生cookie/平台头、手动重定向的真实效果、域名批准/证书/配额与后台timer未获真实WeChat证据，不能等同浏览器Fetch credentials:omit。

本轮原创HTTPS URL仅由Node API形状夹具显式映射到自有127.0.0.1 HTTP服务，实际服务器/分块/重定向/取消均有检查，但不证明TLS或微信网络。完整751Node/4生成工程通过，原生CLI服务关闭的既有停止点未重试；真实手机也不能访问桌面loopback即视为接通。[验收](validation.md#stage144)、[原生门槛](known-issues.md#stage143-wechat-cli)。

<a id="stage136"></a>
## stage136：现行页面适配仍限明确本机对端

当前网页通过一个明确sourceProfile同时选择HTTP初始化与握手/record；current的cache tick只由Node固定bootstrap路由接受，未加上游代理、CORS例外或远程目标。实际浏览器→WebSocket→127.0.0.1 TCP→原创Python验证了当前/旧模型和错误组拒绝，不是浏览器可直连官方TCP或手机/微信可访问桌面loopback的证明。[接口](module-interfaces.md#stage136)、[浏览器与限制](../analysis/launcher-current-page-v1/browser-audit.json)。

服务端身份、真实账号、远程移动设备/小程序网络权限与官方接受仍未验收；独立适配不补猜认证/游戏字段。没有新游戏/登录器服务器请求、厂商程序运行或保护恢复，原授权和无账号答复保留。[完整目标](../analysis/launcher-current-page-v1/goal-audit.json)。

<a id="stage125"></a>
## stage125：游戏诊断不增加网络与平台兼容证明

本次已授权游戏普通启动可能自行进行例行网络检查，但未采集网络、提交账号或得到业务回执，不能据此声称联网成功或完全没有网络活动。固定代码段读取为零且游戏异常退出，无消费者快照；未改网络/共享/权限或平台传输层。[实际范围](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)。网页、移动网页、微信及官方可玩仍待独立验收。

<a id="stage122"></a>
## stage122：本次诊断已获确认，网络配置与平台验收未推进

本轮仅正常窗口/输入诊断及同一恢复点只读复核，没有网络、共享或权限设置变更，没有原游戏连接、代码段取得或平台传输验收。Windows 搜索中的普通字符和关闭已实际验证，不作为登录器/游戏网络证据；当前 Mac 锁定。[输入边界](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)。本次具体游戏启动确认已取得，正常恢复后按原方案继续，不新增未知协议字段。

<a id="stage119"></a>
## stage119：原创快照单次本地返回成功

来宾实际IPv4为10.211.55.3；同一原创快照只POST至主机10.211.55.2:65378。接收器核6624B/固定hash/全部预期字节后关闭并exit0，客户端返回长度0并Dispose，最终未报告listener。无网络/共享配置变更；普通HTTP/peer限制不构成加密或发行者认证。本地分析传输不证明官方游戏、浏览器TCP/CORS、手机或微信兼容。[原始返回回执](../analysis/game-text-observer-runtime-v1/snapshot-return-stage119.json)。

<a id="stage118"></a>
## stage118：现有私有网络仅传送原创分析工具

现有Windows实际IPv4为10.211.55.3，主机限定10.211.55.2:65378，只向固定来宾发送新原创读取器一次146798B；来宾完整hash相同，主机服务成功关闭并exit0。没有启用文件/剪贴板共享或更改网络配置。反向6624B原fixture接收器已准备但未启动；普通HTTP及peer限制不构成加密/发布者身份验证。

本地传输测试5项通过，仅为分析依赖；不是官方游戏请求、浏览器TCP/CORS、手机或微信传输验收，没有账号/会话数据。[主机测试](../analysis/game-text-observer-runtime-v1/test-results.json)、[实际传输](../analysis/game-text-observer-runtime-v1/transfer-runtime.json)。

<a id="stage114"></a>
## stage114：页面请求仅本机，公开符号查询另记

浏览器夹具仅允许精确127.0.0.1来源，成功轮页面无跨源请求、HTTP错误、失败请求或控制台警告；6会话正常关闭，35生产模块按hash验证，IndexedDB重启恢复由83项覆盖。这不是游戏服务器CORS、移动设备或微信传输验收。[浏览器证据](../analysis/launcher-cache-source-browser-v1/browser-results.json)。

本轮另有工具包registry下载和微软公开符号查询：精确CrossGate GUID/age的普通/压缩名字两GET均404，无重试/重定向/账号或代理；没有新游戏服务请求或厂商执行。PDB查询结论仅限该公开源。[工具范围](../analysis/launcher-cache-source-browser-v1/tooling.json)、[符号回执](../analysis/launcher-cache-source-browser-v1/symbol-observation.json)。

<a id="stage113"></a>
## stage113：主机已实测公开配置、两来源清单和一个分析包

事实：沿现有用户联网授权，3份配置、2份Patcher清单和1个6000分析包共6次独立GET均HTTP200；源绑定方案分别新建并只用一次。Node HTTP直连经过有容量/完整deadline的owned-byte适配，未使用环境代理、Cookie或Authorization。清单/包数据和完整源码证据留私有build。[配置](../analysis/launcher-current-entry-v1/network-observation.json)、[两源清单](../analysis/launcher-current-entry-v1/patch-network-observation.json)、[分析包](../analysis/launcher-current-entry-v1/variant-observation.json)。

新增显式source profile/ordinal，默认仍配置来源。备选origin必须单独允许，所有包使用同一个所选清单来源；没有自动跨来源failover，已有取消/完整deadline回归通过。HTTP200及MD5/CRC仅是所取内容证据，未建立发布者认证；两源原清单不同，不能混用。[合同](module-interfaces.md#stage113)。

待验证：浏览器原站CORS、移动网页和微信的实际传输/适配；原生Win32后端选择/重试/安装事务、账号与游戏消费者和官方可玩。6次主机GET不能作为上述平台验收，矩阵rev29仍7/13。

<a id="stage112"></a>
## stage112：控制格式对应已核，新增网络发送条件未成立

正常待登录段ready后调用type10；type1仅确立tag1+两UInt32BE的9B格式，业务词值与实际调用未绑定，type2本次回调不使用两个词。既有opaque codec/flow保留，45相关Node通过，纯字节层没有引入平台网络依赖。[源规格与网络决定](../analysis/launcher-current-control-v1/implementation-spec.json)。

本轮没有新的外部TCP探测、真实加密账号请求或厂商执行；Windows仅完成身份/Win7只读前检。stage110已用hello计划保持其一次性结果，一般联网授权继续有效；新的发送须具备源字段和时序证据。暂无测试账号，浏览器/移动网页/微信传输、原游戏及官方可玩未验。[前检](../analysis/launcher-current-control-v1/guest-preflight.json)、[验收](validation.md#stage112)。

<a id="stage111"></a>
## stage111：当前record与握手统一选择

shared新增current record profile/codec/stream，flow/session的handshakeProfile='current'统一两段现行字节；纯核心无Node/浏览器网络依赖。发送ceil(n/8)*8+8零补齐，接收允许0/0空记录并取声明前缀；generic默认保留原floor/独立最低8B。LE32 Blowfish/8B key、record头BE32、内帧BE16有现行源/4原区间与78相关Node对应。[接口](module-interfaces.md#stage111)、[规格](../analysis/launcher-current-record-v1/implementation-spec.json)。

本轮只源码和原创内存流夹具，没有新的外部TCP/账号/原Windows执行。stage110真实8B→529B不升级为加密会话接受；账号暂时没有，下一步沿无账号正常连接控制。浏览器/微信传输、游戏协议与官方可玩仍待验。[测试](../analysis/launcher-current-record-v1/test-results.json)、[实际前置历史](../analysis/launcher-current-channel-v1/network-observation.json)。

<a id="stage110"></a>
## stage110：源组选择与独立TCP前置观察

当前588690/58c9b0选择hello版本1/key8，591100/590c80限定三hex字段/784B和固定g/p；共享flow与web session新增显式handshakeProfile='current'，省略为generic。该选择不引入Node/平台依赖；当前record完整等价与账号尚未验证。[接口](module-interfaces.md#stage110)、[源合同](../analysis/launcher-current-channel-v1/implementation-spec.json)。

任务专用Node TCP观察器先6项本机检查，再依据40bf80→4291d0/424cf0的BIP角色和新配置选择一次目标；literal IPv4/family4/关闭autoSelectFamily、单次connect且不重试，只8B hello、最多保留784B、10秒全局时限，destroy后等实际close。Node的socket超时通知本身不会关闭连接，故显式截止/关闭由观察器负责。[Node26.9.0文档](https://nodejs.org/download/release/v26.9.0/docs/api/net.html#socketsettimeouttimeout-callback)、[资格检查与最终78项](../analysis/launcher-current-channel-v1/test-results.json)。

实际221.122.108.12:9030收529B/1483.317ms关闭，源组匹配；无挑战回答、账号请求或真实session材料落盘。仅留元数据/摘要，不证明服务端业务接受/身份。公共HTTP XML编码声明错误独立记录，不从中推定账号ACP。[网络回执](../analysis/launcher-current-channel-v1/network-observation.json)、[配置获取](../analysis/launcher-current-channel-v1/catalog-acquisition.json)。这次额度已用，浏览器/微信传输、完整账号/游戏与官方兼容未验。

<a id="stage109"></a>
## stage109：协议投影修复，不扩大网络能力

更新版REA把type10发送/type11解码和AAChannel适配建立同hash对应，五个word数组仍在wire中，W0在中间被丢弃；现有纯codec布局可以沿用。profile与handoff仅修正raw UInt32到native signed16门槛，没有新增transport、代理、账号存储或网络权限。[规格](../analysis/launcher-current-login-v1/implementation-spec.json)。

48原创报文与含web session/launch的相关78项Node通过；本轮没有联网、浏览器、VM或设备运行。官网服务认证、实际代码页/会话、游戏协议及网页/移动网页/微信官方兼容仍未验收，矩阵7/13保持；不把Node适配回归当设备/官方证据。[验收](../analysis/launcher-current-login-v1/test-results.json)。

<a id="stage108"></a>
## stage108：已见正常自更新结果，跨平台网络兼容仍未验收

首次更新检查只见子进程；补库后的新正常流程已见更新器10436创建登录器9012、V2.01 UI，磁盘EXE变为6d459…c987、RegionList变为467e…cd58。与保留的公开更新载荷/已分析版本完整hash对应，但本阶段没有完整HTTP/下载包转录，也未采集认证或游戏帧。[实际事件与文件](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)、[版本对应](../analysis/game-install-context-v1/updated-source-bridge-stage108.json)。

本阶段没有新增网络、共享或策略变更；Windows原厂自更新不等于网页/移动网页/微信网络适配、登录成功或官方游戏兼容。仍沿有证规格实现共享核心，7 observed/13 unknown保持。[阶段验收](validation.md#stage108)。

<a id="stage107"></a>
## stage107：安装身份不等于联网兼容

Windows/联网/工具授权继续有效；本轮无新的游戏服务器连接、账号会话、网络帧或浏览器/微信网络验收。正常安装与旧登录器资源对应已核，来宾输入恢复后按[具体方案](../analysis/game-install-context-v1/normal-launcher-plan-stage107.json)继续标准启动/更新观察；仍不把二进制构建、目录存在或退出0当官方兼容。当前7 observed/13 unknown不变。

<a id="launcher-stage94"></a>
## stage94：当前HTTP准备与浏览器配置对提交

新增显式refresh模块用同一总deadline串起缓存读取、当前HTTP bootstrap和IndexedDB整对revision提交；所有origin与五端点仍由调用者明确给定，没有默认官方目标或额外代理授权。22定点与Chrome真实ESM/IndexedDB通过，官方HTTP三GET只是主机无账号取新包，不证明官方CORS、移动网络或游戏协议。[接口](module-interfaces.md#launcher-stage94)、[验收](../analysis/launcher-current-refresh-v1/validation.json)。

原版Windows现已观察正常主界面和更新后文件，未登录账号/运行游戏；完整自动子链/ACK未捕获。游戏仍缺消费者/帧/会话及手机/微信适配验收；下方网络能力调查保持其原日期和未知项，不因桌面IndexedDB成功提高状态。

**2026-10-27 / stage58增量：** 登录器更新/目录HTTP读取链现已静态闭合，Fetch GET薄适配通过本机原创服务实际字节验证，含清单比较与ZIP校验。[接口](../web/README.md#launcher-v13)、[范围/验收](../analysis/launcher-v13/validation.json)。它不提供原始TCP或游戏通道，不验证官方CORS、来源信任、真实会话或微信能力。现有离线页面CSP未变，产品UI未接线；下方2026-10-24能力调查保留原时间边界。

核查日期：2026-10-24 UTC。项目目标已变更为网页、手机和小程序可玩；当前暂按“手机＝移动网页、小程序＝微信小程序”规划。独立 iOS/Android App、其他小程序平台，以及“微信小程序”或“微信小游戏”的最终产品形态尚未确认。本文件是能力调查与设计判断，没有实现或验证官方游戏通信。

## 当前能确认什么

本地 `CrossGate_Setup.exe` 的 SHA256 为 `e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983`。`cg_se_3000.exe` 的文件偏移 `0x290ca` 存在 `WSOCK32.dll`，`0xd1d0`、`0xd2a4` 有接收/连接日志；登录器还导入 Winsock。**事实**是存在原生网络依赖线索，**待验证**是实际使用 TCP、UDP、TLS 或哪种帧/会话/认证协议。不能从 DLL 名、IP 和端口确定完整传输方式。证据见[游戏调查](game-static.md)和[登录器调查](launcher-static.md)。

| 环境/能力 | 已核实的事实与来源 | 对本项目的影响 |
|---|---|---|
| 普通桌面/手机网页的 WebSocket | WHATWG 明确说明此接口不开放底层原始网络；规范定义打开握手、校验响应和消息发送。接口支持二进制数据，但二进制仍装在 WebSocket 消息中。[规范 §1、§2.2、§3.1](https://websockets.spec.whatwg.org/) | 将配置中的 `IP:port` 改为 `ws://IP:port` 不是协议适配。服务端或中间层必须理解 WebSocket；当前没有官方支持此协议的证据。 |
| 普通网页中的流量控制 | 标准 WebSocket API 的接收侧不提供自动背压；应用处理速度不足可能积压内存。[MDN WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) | 将来需要消息长度/队列/工作预算、超时和断开策略，不能只做无限转发。 |
| WebTransport | W3C 定义多流和数据报能力，建立的是 WebTransport 会话；规范将其映射到 HTTP/3 或 HTTP/2 连接。[W3C §1、§3、§13](https://www.w3.org/TR/webtransport/) | “有数据报”不等于任意原生 UDP 套接字。未经确认，不能将 WebTransport 作为官方原生协议的直接替代。 |
| Direct Sockets | WICG 提案的接口带 `SecureContext`、`IsolatedContext` 条件；解释文档将其置于 Isolated Web Apps，并说明现有常见网页接口不能任意原始 TCP/UDP 通信。[接口提案](https://wicg.github.io/direct-sockets/)、[解释文档](https://github.com/WICG/direct-sockets/blob/main/docs/explainer.md) | 不能把特定隔离应用能力当作普通 Safari/Chrome 手机网页的通用基线。安装成 PWA 也不能据此自动认定获得相同能力。 |
| 微信小程序原生网络 API | `wx.connectSocket`、`wx.createTCPSocket`、`wx.createUDPSocket` 是本项目必须核查的候选接口；本轮官方正文访问被拒绝，未确认当前可用范围。官方入口列于下节。 | 不能说“微信只支持 WebSocket”或“微信不支持 TCP/UDP”；也不能仅凭 API 名称就判断当前设备、域名和端口可用。 |
| 小程序内 H5 `web-view` | 本轮未取得微信官方正文，业务域名、主体资格、桥接 API 与平台差异均待核实。 | H5 页与小程序原生逻辑层应分开设计；不假定 H5 的 `window` 可直接调用任意 `wx` TCP/UDP API。 |

上述普通网页结论针对开放网页的跨平台基线，不是断言所有浏览器扩展、隔离应用或专有宿主都没有额外能力。也没有通过实际连接来测试上述服务或任何官方游戏端点。

## 微信待核查入口与明确阻碍

以下是待核查的官方地址，不表示本轮已读到正文或验证其参数：

- [网络能力说明](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)：合法域名、TLS、端口、并发和后台行为。
- [wx.connectSocket](https://developers.weixin.qq.com/miniprogram/dev/api/network/websocket/wx.connectSocket.html)：WebSocket 创建、当前基础库与平台条件。
- [wx.createTCPSocket](https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/wx.createTCPSocket.html) 与 [TCPSocket.connect](https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/TCPSocket.connect.html)：TCP 当前最低基础库、平台、目标域名/IP/端口及并发条件。
- [wx.createUDPSocket](https://developers.weixin.qq.com/miniprogram/dev/api/network/udp/wx.createUDPSocket.html)：UDP 当前范围、平台、报文与生命周期限制。
- [web-view](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)：主体资格、业务域名、H5 桥接和真机差异。

**访问状态：已拒绝。** 网页读取工具访问上述微信页面返回不可重试错误。只读研究子任务随后在 Chrome 打开 `https://developers.weixin.qq.com/miniprogram/dev/api/network/tcp/wx.createTCPSocket.html`，被浏览器工具的 **site-safety policy** 明确拒绝，并禁止改用其他浏览器、间接执行或绕过方式获取同一内容。因此已停止该站点访问，没有重试绕过。该拒绝不是用户审批请求或 Auto-review 拒绝；没有待审批或结果不明的调用。

未使用搜索到的第三方转载补齐版本数字、并发额度、端口或域名条件。这些规则会变化，后续必须取得可访问的官方正文，再用目标基础库、微信版本和 iOS/Android 真机验收。开发工具中的成功或关闭域名检查不能替代正式运行条件；本阶段没有改动此类设置。

## 共享核心与适配层的设计判断

以下为项目建议，不能标为已经实现的网络模块：

1. **共享纯逻辑核心**接收 `Uint8Array`/明确长度的字节数据，负责资源解析、候选格式验证、游戏状态模型和将来的消息编解码；不依赖 DOM、AppKit、Node socket 或全局 `wx`。重用分析证据、合成夹具和跨实现摘要，而非维护三套独立协议逻辑。
2. **浏览器适配层**处理用户选择的本地 `File`、分块读取、Canvas/触控/键盘、页面生命周期。真实资源留在用户设备，不能为方便手机访问自动上传或随站点分发官方资产。
3. **小程序适配层**将文件、渲染、触控、生命周期能力注入共享核心。文件获取、包体/缓存预算、Canvas 与后台行为必须另验收；不能将普通网页打包为 `web-view` 便宣称完成小程序适配。
4. **会话与 Transport 分离**：共享协议层应处理可被任意切分/合并的输入字节及明确的状态变迁，不依赖“一次 socket 回调＝一个游戏消息”。平台层只提供打开、关闭、读写和错误事件。当前先使用合成离线回放，不给生产网络端点默认值。
5. **保留 Swift 阶段成果**作为历史原型与独立解析回归参考，不继续扩展 Mac 专用产品功能，也不删除用户可复用材料。跨平台核心只迁移已被证实的结构与行为；未证实协议不能借迁移之名变成确定实现。

## 是否需要代理网关

**条件判断：**如果官方只接受普通网页不能直接使用的原生传输，而运营方允许该互操作方案，则浏览器可能需要一个理解网页传输的中间层，或官方提供适合网页的接口。若官方已有支持的 WebSocket/WebTransport 接口，路径会不同。微信原生 TCP 能力即使将来确认，也不能消除普通网页一端的限制。当前官方接口、传输与许可都未确认，**网关尚不能认定为必要、充分或可合法部署**。

可讨论的方案是 `浏览器/小程序 → 明确授权的适配服务 → 官方服务`，并让渲染与游戏状态仍在跨平台客户端中运行。它与在远端 Windows 客户端上运行游戏再传视频的远程串流不同；本项目不将串流称为原生跨平台客户端。这里只是方案分析，未实现、部署或向任何端点发送消息。

| 需先解决的事项 | 具体影响与验收要求 |
|---|---|
| 认证与隐私 | 网关可能看到账号标识、票据、角色信息和通信内容，取决于尚未恢复的协议。不能承诺端到端保密，也不能擅自收集用户凭据。先确定信任边界、数据用途和明确授权。 |
| 加密边界 | 浏览器到网关的 TLS 不会自动为网关到旧服务端的链路提供同等保护。不能通过终止/伪造认证来绕过官方校验；需要真实协议和服务方许可。 |
| 会话隔离 | 每会话的认证上下文、序列、重连与退出必须隔离；限速、长度/队列上限、异常关闭和凭据清除不能遗漏。不得把密码/票据放入 URL、访问日志或错误追踪。 |
| 出口与访问范围 | 未经授权不得开放可任意指定目的 IP/端口的通用转发服务；未来若获准，端点范围、访问控制和审计目的需明确。当前没有网关。 |
| 延迟与可靠性 | 多一跳带来延迟、断线与队列管理成本。TCP 字节流、WebSocket 消息和游戏消息边界不同，透明转发也不能假定一一对应。需要本地模拟故障测试后再考虑获准联机测试。 |
| 运行费用 | 成本由并发常连接、每会话内存、流量/出口、TLS、可用性、监控和运维决定；尚无负载数据，因此不报未经测算的金额。官方资源不应进入分发/CDN预算。 |
| 平台与许可 | 微信平台的应用类型、域名/接口条件、审核要求和游戏运营方的授权是不同门槛。代理不消除随附条款中的协议模拟/重定向限制或账号处置风险。见[条款核查](official-terms.md)。 |

## 网络与平台验收矩阵

| 阶段 | 必须证实的结果 | 本次状态 |
|---|---|---|
| 公开技术资料 | 浏览器传输区别与限制；微信当前正式规则 | 浏览器核心区别已核实；微信正文访问被拒绝，具体限制待核实 |
| 跨平台离线核心 | 同一合法样本/合成坏输入在共享核心上给出可复现结果 | 由当前资源实现与测试报告记录，本文件不代替测试结果 |
| 桌面/手机浏览器 | 真实浏览器页面、触控/键盘、文件选择、视口/内存预算；不用桌面缩窄视口冒充手机真机通过 | 网络研究分支未运行；实现分支需分别记录模拟视口与真机 |
| 小程序适配 | 确认产品形态；目标基础库与开发工具、iOS/Android 真机、正式域名条件、前后台生命周期 | 未运行，不宣称完成 |
| 离线协议/网关模型 | 合成数据上的分帧、拆包/粘包、乱序（如适用）、背压、超时、断连/重连与会话隔离 | 未实现；不能猜测官方消息补齐 |
| 官方互操作 | 当前版本/协议完整证据、运营方许可、明确的用户操作授权、受控测试范围 | 未满足；未登录、未连接、未部署 |

下一步先完成共享资源读取和离线交互切片，并在当前文档索引中保留这些网络缺口。任何线上工作都应单独列明目的、实际目标、数据范围、许可依据和停止条件；工具自动批准不扩大用户授权。
