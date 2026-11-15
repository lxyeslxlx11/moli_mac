# 隔离 Windows 环境准备

<a id="guest-launcher-modal-dispatch"></a>

## Windows 主窗模态消息夹具

2026-11-12 在现有 Parallels Windows 11 ARM64、窗口 5956 中核对 PowerShell 5.1 的算术回显。将原创 `MoliModal.cs` 置于只读 `MOLIMODAL` 光盘。来宾 `D:\MoliModal.cs` 的完整 SHA-256 与主机相符，独立 PowerShell 编译并运行一次，采集九行窗口事件及 `$LASTEXITCODE=0`。 [源文件、介质和来宾回执](../build/analysis/windows-launcher-modal-v1/source-review.json)

结束时恢复 `MoliVC71-stage108.iso`。主机复核同一映像摘要及连接状态，来宾读回 `D:` 卷标 `MOLIVC108` 和退出码 0，随后正常退出本轮打开的 PowerShell。实际登录器及同版会话的窗口行为继续按 LS-U3 验收。 [窗口结果](launcher-static.md#windows-launcher-modal-dispatch)

<a id="guest-resource-access-recheck"></a>

## 资源查询入口复核

当前安装的 Parallels 26.3.3 (57507) CLI 严格签名校验通过，标准 `status` 对现有 Windows 11 返回运行中和退出码 0。`exec --current-user` 的无害回显返回 255，未得到来宾结果。窗口读取显示激活提醒在普通关闭和 Escape 后仍可见。实际 Windows 枚举、回退文件状态和游戏运行待验。 [本次回执](../build/analysis/legacy-resource-handoff-v1/windows-access.json) · [排障记录](known-issues.md#guest-resource-enumeration-access)

前次复核取得相同的 CLI 签名、运行状态及回显退出码。窗口可读，显示更新重启计划为来宾时间 04:30。当时尚无枚举输出。 [前次检查回执](../build/analysis/launcher-f5a-title-bytes-v1/source-review.json)

2026-11-12 在同一 Windows 11 窗口观察到自动暂停。前台激活和标准 `prlctl resume` 恢复后，Win+R 打开普通 PowerShell 5.1，`MOLI_READY` 回显及退出码 0 已核。长输入受中文组合影响并在提交前取消。来宾在临时只读 `MOLIENUM` 光盘上核对原创采集代码的完整 SHA-256，编译并执行一次，返回七组匹配行。 [来宾操作与输出摘要](../build/analysis/windows-resource-enumeration-v1/source-review.json)

结束时恢复原 `MoliVC71-stage108.iso`，主机镜像 SHA-256 与原件一致，来宾 `vol D:` 显示 `MOLIVC108` 及退出码 0。本次打开的 PowerShell 已正常退出。 [恢复回执](../build/analysis/windows-resource-enumeration-v1/source-review.json)

<a id="stage138"></a>
## stage138：普通输入恢复，已有转储被动查询已完成

本轮先实际输入1/Return→输出1/空提示符，正常点击最大化已有PowerShell；原因和长期稳定性未隔离。约180字符长行内部损字已在Return前Ctrl+C取消；随后短行完整回显后逐条提交。旧变量cb128为空时未执行未知路径，随后显式设定CDB路径并核完整SHA/Valid。没有新增locked/审批拒绝或人工操作请求。[输入及前检](../analysis/game-text-observer-runtime-v1/access-stage138.json)。

现有cwd、既有dump16924391B/完整SHA、CDB完整SHA/Valid、空本地symbols、cwd无ntsd.ini、新日志False及同名进程0均有本轮输出。12参数回读后只调用一次CDB -z，两段各32B；退出0、8880B/74行日志完整SHA已读，原始留来宾。初始化32B未捕获、故障32B与候选原字节不同；没有新的游戏启动、读取器/夹具、新转储、附加或WER/注册表/UAC/策略/网络/共享/兼容/安全/后端/VM生命周期变更。[查询](../analysis/game-text-observer-runtime-v1/code-fingerprint-stage138.json)。

14:46+08实际复查游戏/CDB进程0、dump完整SHA仍相同，空提示符保留。未独立查询token/当前VM UUID/全套隔离配置，不把本轮正常终端、桌面和离线日志当管理员身份、恢复启动、设备、正常游戏或三平台/官方接受证明。stage131一次WER已用及其恢复是历史事实，本轮不重放、不新增配置。[唯一排障](known-issues.md#stage138-fingerprint)、[验收](validation.md#stage138)。

<a id="stage137"></a>
## stage137：画面与菜单可用，普通输入未恢复

现有Windows11画面可读，仍显示历史stage132 PowerShell结果；本轮既有原生Keyboard→Win+Q打开搜索，普通字符/按键、200ms输入、暴露Raise及正常Window菜单选择均没有确认文字。一次原生AX Keyboard点击返回AXError.failure，随后坐标菜单成功；不是审批拒绝或Mac locked。本轮没有按Return或提交来宾命令，没有新CDB/游戏/读取器执行，进程/文件/签名/空目录等新鲜前检均未完成。[实际观察](../analysis/game-text-observer-runtime-v1/access-stage137.json)。

最后关闭所查看的Edit菜单，保留搜索与既有终端。未粘贴/启用共享、修改网络/权限/安全/策略/Win7、恢复/重启/关机/建立快照或切换控制后端，无新增人工请求；这些表示本轮动作范围，不作为当前全部配置/进程状态的独立复核。后续必须先观察实际输入和清洁提示符，再完成原限定64B已有dump查询的身份前检，不复用已消费游戏运行。[唯一排障](known-issues.md#stage137-input)。

<a id="stage132"></a>
## stage132：现有VM正常恢复，仅读同次已有转储

新鲜UI显示现有Windows11处于暂停，主机限定配置读取仍为UUID`{0a440763-a14c-4cbe-b6df-abfa4fe079a3}`、IsolatedVm=1；config SHA256`d3ffd4d014d05740109a396fc7e59d8034845e85d5cdb95ba8d8863a0d64fe9d`。在操作菜单选择普通“恢复”一次并观察回到桌面，未选恢复快照、重启/关机或建立新点。通过既有Win+Q打开新的Windows PowerShell，未选择管理员启动，实际字符1执行输出1，切换实验目录和日期查询成立；本轮没有另读主体管理员角色，不能由窗口标题代替权限标志。[访问回执](../analysis/game-text-observer-runtime-v1/vm-access-stage132.json)。

仅对stage131已合格第二份转储重新核长度16924391B/完整SHA256，与微软x86 CDB哈希/Valid签名。游戏/CDB进程0、新输出路径False、本地符号目录含隐藏项计数0、cwd ntsd.ini=False均实际读出；十一项参数完整回读后仅执行一次离线CDB，21:24:19.4881799（+08:00）开始，退出0、日志77行。四个固定栈范围76B的19个DWORD全部取得，未追随数值指针或新增代码/字符串读取。[有限读取回执](../analysis/game-text-observer-runtime-v1/cdb-stack-stage132.json)。

读取后日志8822B及完整哈希新核；21:33来宾时钟画面下游戏与CDB进程合计0、空提示符保留。长收尾行出现内部损字时已在Return前Ctrl+C取消，改短行完成。没有新的游戏/读取器/夹具执行、转储采集、UAC、注册表、WER、网络/共享/安全/策略/兼容修改或控制后端替换；stage131已恢复的WER结果保留为历史实测，本轮未重查注册表。原始dump和日志留原来宾私有目录，不导出。当前桌面/本轮输入/离线读取已证，持续输入稳定、设备归属、恢复启动及正常游戏进入/官方兼容未验。[唯一排障](known-issues.md#stage132-stack)。

<a id="stage131"></a>
## stage131：本次WER设置、单次启动、恢复和离线读取已执行

原stage128具体确认已收到，同一Parallels Windows11/PVM UUID`{0a440763-a14c-4cbe-b6df-abfa4fe079a3}`继续；未重建、重启或改网络/共享。新原生点`Moli-before-game-wer-20261102-stage128`、GUID`{7976ae00-cf4f-4159-92e6-d349186b1c59}`已由正常UI建立，XML current/poweron及六个旧点保留已核；还原启动未测。[恢复点](../analysis/game-text-observer-runtime-v1/recovery-stage131.json)。前检完整游戏哈希、`~ WIN7RTM`、进程0、C余量230315257856B、双视图原键不存在和AeDebug Auto缺失成立。[前检](../analysis/game-text-observer-runtime-v1/wer-preflight-stage131.json)。

普通会话创建新实验目录/空dumps和symbols，默认权限保留；对应微软UAC后，仅在临时管理员会话设置双视图本应用小型转储值。游戏从原普通会话空参数运行一次，PID5304于18:50:22.6669501–18:50:29.1332491（+08:00）自然退出，未调用CloseMainWindow或强杀。恢复时先逐视图核三个值/类型和零子键，再非递归移除本次游戏键及原先不存在且仍空的父键；18:59双视图父/游戏键均不存在，句柄释放，19:01管理员终端正常关闭。[实际设置](../analysis/game-text-observer-runtime-v1/wer-configuration-stage131.json)、[生命周期](../analysis/game-text-observer-runtime-v1/wer-lifecycle-stage131.json)、[恢复](../analysis/game-text-observer-runtime-v1/wer-restoration-stage131.json)。

两份新小型转储稳定且共33850522B，各PID/时间/哈希合格。已核验微软x86 CDB两次以`-z`离线打开，各退出0；原始转储/输出仍在来宾，无符号服务器、活进程附加、账号登录或`.text`读取。19:56EXE完整哈希未变且游戏/CDB进程合计0，19:59版本/日志完整性回读后普通空提示符保留；主机REA静态核对完成并关闭会话。[文件资格](../analysis/game-text-observer-runtime-v1/wer-dumps-stage131.json)、[收尾](../analysis/game-text-observer-runtime-v1/wer-postflight-stage131.json)。本次诊断已用，不重放；根因/正常启动/设备归属/恢复启动/消费者及官方可玩分别未验，当前不能宣称ARM或游戏兼容失败。[唯一排障](known-issues.md#stage131-wer)。

<a id="stage130"></a>
## stage130：保留129会话，当前不重复来宾操作

本轮只读核主机交付清单及最近三轮接续状态，没有CUA动作、来宾命令、游戏/读取器/夹具/CDB执行、内存或转储读取；也没有新快照/生命周期/UAC/注册表/权限/策略/网络/共享/键盘设置变更。最后普通终端空提示符与4句柄Dispose是129实测，不作为本轮新设备或输入验收。

独立前检已完成，原stage128执行时问题仍待答复；相同条件跨三轮后按[审计](../analysis/game-text-observer-runtime-v1/blocked-audit-stage130.json)停止自动重复，目标状态见[回执](../analysis/game-text-observer-runtime-v1/goal-status-stage130.json)。不请求用户操作Windows；收到原答复后按[既有方案](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)新鲜核实再接续。[唯一排障](known-issues.md#stage130-wait)。

<a id="stage129"></a>
## stage129：同一会话只读核键、目录和资源

原Parallels Windows11普通PowerShell完成显式Registry64/Registry32前检：LocalDumps父/游戏子键均无，AeDebug键有而Auto值无。实验目录不存在；C余量230298329088B、同名进程0、安装路径/2904064B新核。只读句柄4个已Dispose，空提示符保留。普通输入中途失效，经同次实时菜单Win+Q/字符/Escape/可见取消后恢复；无新locked或人工操作请求。[前检](../analysis/game-text-observer-runtime-v1/wer-preflight-stage129.json)、[输入](../analysis/game-text-observer-runtime-v1/input-stage129.json)。

没有新快照/还原/重启、目录或注册表写入、UAC、游戏/读取器/夹具/CDB执行，网络/共享/安全/权限/策略/键盘定义均未变；没有检查新的恢复启动或设备归属。[原方案](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)执行时确认仍未答复，不能把本轮前检当设置/采集或游戏兼容。[唯一排障](known-issues.md#stage129-input)。

<a id="stage128"></a>
## stage128：普通输入恢复，限定报告检查完成

正常Window菜单选既存Windows11、既有Win+Q、搜索字符1/Escape及终端Ctrl+C均实际回读，随后短查询成立。本轮无locked错误或用户操作请求。两份WER归档/文件/摘要及10条引用的False取得结果；普通输入可用仅描述本轮观察，不是永久修复或设备归属证明。[输入](../analysis/game-text-observer-runtime-v1/input-stage128.json)、[材料](../analysis/game-text-observer-runtime-v1/wer-artifacts-stage128.json)。

游戏哈希、既有x86 CDB哈希/Valid签名新核；没有新游戏/读取器/夹具/调试器执行、内存/转储采集、快照/VM生命周期、UAC、网络/共享/权限/安全或策略变更。最后普通空PowerShell提示符，原会话保留。[准备层](../analysis/game-text-observer-runtime-v1/diagnostic-readiness-stage128.json)。[新本地诊断](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)未执行，键/目录/恢复点须按方案前检，执行时确认未取得；125额度已用。恢复启动、正常游戏进入及官方兼容分别未验。[唯一排障](known-issues.md#stage128-input)。

<a id="stage127"></a>
## stage127：同一窗口可读，普通来宾输入仍未恢复

新鲜画面是原Windows搜索面板及PowerShell，同一AX窗口标识；本轮只做有界文字/单键、正常窗口/搜索位置点击、实时Window菜单选择原窗口和Escape，均未证来宾响应。指针反馈不等于点击送达，旧空提示符不代表当前可提交命令。无Return、新来宾查询、游戏/读取器执行、VM生命周期/恢复点/网络/共享/安全/权限变更，也无新locked错误或人工操作请求。[回执](../analysis/game-text-observer-runtime-v1/access-stage127.json)。

保留现有会话；崩溃附件是否存在仍未知。按[连续末态审计](../analysis/game-text-observer-runtime-v1/blocked-audit-stage127.json)记录普通输入阻塞并停止自动重复，实际输入恢复后从无害短输入和原两报告元数据检查接续。已有执行证据不回退，设备归属/恢复启动/正常游戏进入/官方可玩仍未新增验收。[唯一排障](known-issues.md#stage127-input)。

<a id="stage126"></a>
## stage126：仅读既存运行事件，未再次启动样本

同一Parallels窗口普通输入曾恢复，旧未提交行已实际取消；存量事件、ISO时间与运行后哈希均有完整输出。两条1000的PID5136及创建FILETIME对应上次进程；两份1001只显示选定签名，均未提供可用模块地址。本轮没有游戏/读取器/fixture运行、快照/还原/重启、UAC或设置变更。[输入](../analysis/game-text-observer-runtime-v1/input-stage126.json)、[事件](../analysis/game-text-observer-runtime-v1/events-stage126.json)。

第二WER记录路径赋值返回提示符，但值/附件未验；下一只读前缀查询未回显、未Return。正常Raise/既有Win+Q后截图主体为空白，Escape后的原终端未恢复可读，当前输入状态未知；没有Mac locked错误。保留现有会话，不以旧空提示符代替当前输入证明，不请求人工Windows操作。先恢复可读窗口、取消可能未提交查询，再按[接续计划](../analysis/game-text-observer-runtime-v1/resume-plan-stage126.json)检查这两份既存报告；设备归属、恢复启动、正常游戏进入与官方可玩未新增验收。[唯一排障](known-issues.md#stage126-input)。

<a id="stage125"></a>
## stage125：同一 Parallels VM 完成单次游戏诊断

原stage119恢复点current/poweron、精确VmUuid和XML摘要再次一致，未新建/还原快照；还原启动仍未测。通过正常菜单恢复普通输入后核文件/目录/Win7/直接DLL/StartInfo，完整脚本回读后只Start一次、固定读取一次。PID5136运行9.123410秒后异常退出 `0xc0000005`；读取器 `TEXT_ZERO`/exit1、无输出，结束复查进程0。无新UAC/许可/账号、强杀、重启、CLI、保护或网络/共享变更。[前检](../analysis/game-text-observer-runtime-v1/game-guest-preflight-stage125.json)、[恢复点](../analysis/game-text-observer-runtime-v1/recovery-recheck-stage125.json)、[运行](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)。

本轮桌面/若干真实命令/进程生命周期已验，原游戏消费者和正常登录启动未验。后续事件详情回读普通输入再次无可靠响应，取消未证；没有新的Mac locked错误，不把旧锁屏计数套用本次。保留原会话及待核只读文本，接续先核并取消未提交行，不重放游戏触发。[唯一排障](known-issues.md#stage125-input)、[下一步](development-plan.md#stage125)。

<a id="stage122"></a>
## stage122：同一 Parallels VM 与恢复点已复核，当前 Mac 锁定

实际 config.pvs 的 VmName=Windows 11、VmUuid={0a440763-a14c-4cbe-b6df-abfa4fe079a3} 与新恢复点 current 标志、Snapshots.xml 摘要一致；AX 窗口 ID 是另一个标识。未新建/还原/重启 VM，也未改网络、共享、权限或快捷键定义；还原启动仍未测。[只读复核](../analysis/game-text-observer-runtime-v1/recovery-recheck-stage122.json)。

正常退出全屏已执行，窗口辅助应用的 bundle 选择因当前/冷副本重名而被拒；随后仅精确当前 PVM 的辅助入口选择超时，未取得控制 handle，未选冷副本。最终仍为原窗口/会话；普通搜索字符及 Escape 成立，下一次输入时工具报告 Mac locked。当前只需正常解锁状态，已有本次游戏执行确认保留；按[唯一排障知识库](known-issues.md#stage122-input)接续，未执行原游戏或读取器。

<a id="stage119"></a>
## stage119：原文件返回与新原生恢复点已证

普通Ctrl+C已从自身DBG回到空PowerShell，短行与实际输出链恢复；长行回读不一致已取消，后续短行检查取得结果。未改变网络、共享、权限、安全、输入后端或Windows生命周期。[前检](../analysis/game-text-observer-runtime-v1/game-guest-preflight-stage119.json)、[唯一排障节](known-issues.md#stage119-input)。

原生新点`Moli-before-game-text-read-20261101-stage119` / `{309dcd44-c759-43a0-9f01-8fdec2cbdd0c}`于2026-11-01 16:02:47建立，当前/poweron；旧5个项目记录保留，7个对应文件元数据与主机剩余182072279040B已核。还原启动未测，不是独立备份。config VmUuid `{0a440763-a14c-4cbe-b6df-abfa4fe079a3}` 与窗口AX ID `{bac7348c-9220-4447-94e4-e49b00f44939}` 是不同标识；首次回执写入断言误将两者等同，写入前失败，已按实际字段更正。[完整回执](../analysis/game-text-observer-runtime-v1/recovery-point-stage119.json)。游戏执行/读取仍为0，启动对象仅已准备并核对参数。

<a id="stage118"></a>
## stage118：正常访问及原创fixture运行已证，普通输入随后再次失效

当前Parallels本地Info.plist新鲜核对为26.3.3(57507)，不是从来宾最近文件名推断。用户解锁后短输入、Get-Date和现有私有IPv4可读，固定原创fixture/新读取器hash与长度一致；固定实验目录新建、CreateNew落地、一次fixture PID260读取与30秒自然exit0实际通过。一次GET传输服务已关闭并exit0，没有游戏/登录器执行。[前检](../analysis/game-text-observer-runtime-v1/guest-preflight.json)、[传输](../analysis/game-text-observer-runtime-v1/transfer-runtime.json)、[生命周期](../analysis/game-text-observer-runtime-v1/fixture-runtime.json)。

临时全屏已通过正常菜单还原；早期USB2 Controller Hub2目的地提示未明确选接Windows，设备最终归属未独立复核。普通输入后续失效，原生Ctrl+Break进入PowerShell自身DBG，q退出未证；现有Win+Q可打开搜索，普通文字仍未出现。输入模式控件最后均自动检测，未观察到改值；配置最终经File > Close Window正常关闭，现有VM与搜索/终端仍在。本轮未暂停/关机/重启、改变网络/共享/安全、添加快捷键定义或索取人工操作。[唯一排障](known-issues.md#stage118-input)、[模式回执](../analysis/game-text-observer-runtime-v1/input-mode-experiment.json)。

原快照传回/直接比较仍待完成；原游戏的依赖、Win7、恢复和诊断PID尚未新鲜前检，不能挪用stage112历史作为当前验收。完整游戏与三平台/官方可玩未完成。[接续步骤](development-plan.md#stage118)。

<a id="stage117"></a>
## stage117：三轮正常访问失败，目标已标记blocked

stage115–117连续三个goal turn的正常电脑控制均报告Mac locked/自动解锁失败；第116/117轮无开发进展，没有活跃观察任务可等待。三轮审计通过后，目标工具实际返回blocked，完整目标仍未完成。[审计](../analysis/game-text-observer-v1/blocked-audit-stage117.json)、[实际状态](../analysis/game-text-observer-v1/goal-status-stage117.json)。

1639项上一交付hash和新工具146798B/16386482…83732f5一致；矩阵rev30仍7observed/13unknown。本轮无新源码/产品测试、来宾/游戏执行或VM/安全变更。保留已有正常解锁请求及现有Windows/联网/工具授权；恢复正常访问后先验真实fixture读出、完整字节与自然生命周期，再制定新鲜有界游戏诊断方案。[资格步骤](../analysis/game-text-observer-v1/windows-qualification-plan.json)、[交付](../analysis/delivery-manifest-stage117.json)。

<a id="stage115"></a>
## stage115：Windows画面读取成功，首次输入批次报告Mac锁定

正常CUA重新绑定既有Windows11/PowerShell，画面有空提示符及旧stage112结果；首次点击/输入/AX批次返回Mac locked/automatic unlock失败，没有Return/来宾命令提交。不能把画面可读、旧hash或Win7标记当作本次输入/依赖/恢复/PID通过。一次正常解锁请求保留，不要求点击终端或重复授权；新锁屏本goal轮计1，不复用旧三轮阻塞记录。[访问记录与逐动作证据限制](../analysis/game-text-observer-v1/access-observation.json)。

主机只准备新固定.text工具和fixture oracle，39C/6Python通过；未传输、运行新PE/原游戏或建立监听器，未改VM、网络、共享、安全和恢复点。`prlctl --version`只返回26.3.3(57507)，没有VM枚举/执行/配置或恢复旧CLI。下一步沿普通输入和具体资格方案核实际文件/目录/PID；只有真实fixture读出/完整字节/自然退出通过，才进入新的游戏诊断方案。[Windows方案](../analysis/game-text-observer-v1/windows-qualification-plan.json)、[唯一知识库](known-issues.md#vm-troubleshooting)。

stage116只读复查：1637项前交付hash一致，正常电脑访问再次报告Mac locked/自动解锁失败，未取得app/guest、来宾输入或新游戏证据。同一阻塞连续2个goal turn，已有正常解锁请求保留，本轮无开发进展；目标active，尚未达到三轮blocked门槛。恢复后仍按新工具的真实fixture/完整字节/自然生命周期顺序验收。[回执](../analysis/game-text-observer-v1/access-recheck-stage116.json)。

<a id="stage114"></a>
## stage114：独立Chrome配置已收尾，未操作Windows来宾

本轮仅任务专用Chrome持久配置和本机夹具：成功轮6会话、两次每尺寸正常关闭/重开、服务关闭均有记录；个人浏览器配置未用。没有电脑控制、来宾命令、VM/共享/网络/兼容设置修改，原游戏/观察器未运行。[生命周期与边界](../analysis/launcher-cache-source-browser-v1/evidence-audit.json)。

REA读取游戏文件不等于游戏运行：首个头部查为分析器启动超时，后续原.text负面记录已保存关闭，失败启动PID在收尾后不存在；未修改分析器配置。下一次游戏启动观察仍需新鲜核对现有安装目标、依赖、恢复条件及有界目的，不复用旧执行方案。锁屏/来宾桌面/设备/原游戏仍分别待实际核验。[游戏源](../analysis/launcher-cache-source-browser-v1/game-source-check.json)。

<a id="stage113"></a>
## stage113：本轮为主机源码/公开输入工作，未重新操作来宾

本轮未使用电脑控制、提交来宾命令、运行厂商/观察器、接受新UAC/条款或修改VM/网络/共享/安全配置。stage112的安装版hash与Win7标记、输入恢复和窗口还原是该阶段实证，不当作本轮恢复点、依赖、桌面或PID新核验。[历史前检](../analysis/launcher-current-control-v1/guest-preflight.json)。

新增联网仅为主机6次公开GET；原3000主机副本9baa与当前两份更新目标相同，不等于已重新核对来宾运行映像。6000只在私有build解码静态分析，原.text无文件字节，未执行也未移植3000的RVA。[本轮源范围](../analysis/launcher-current-entry-v1/game-capability.json)。

后续正常原游戏观察仍需依最新状态核对恢复/依赖/目标PID；暂无测试账号与调试材料。锁屏恢复、桌面、设备和原游戏验收分别记录，不能由主机GET或静态成功替代；本轮无手动操作请求。[唯一知识库](known-issues.md#vm-troubleshooting)、[阶段验收](validation.md#stage113)。

<a id="stage112"></a>
## stage112：来宾输入恢复与游戏文件只读前检

先读唯一排障节，再访问现有Parallels Windows11，当前桌面可访问。初始原生菜单可操作而来宾输入未确认；临时切全屏、点击来宾提示符后物理单字符可见，Ctrl+C取消并回到空提示符，随后6条赋值/只读命令逐条完整回读再Return，实际得到时间、游戏hash与HKCU标记。[当前实证](../analysis/launcher-current-control-v1/guest-preflight.json)、[唯一知识库](known-issues.md#vm-troubleshooting)。

安装版游戏SHA-256为9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126，Layers值`~ WIN7RTM`；仅证明身份与现有标记，不证明运行效果。最终恢复原窗口模式、PowerShell空提示符，未改键盘映射、共享、网络、安全、VM配置或恢复点，没有新UAC/安装/原游戏/观察器执行或人工操作请求。旧恢复点/依赖记录保持其历史验收层级，未新核恢复启动、依赖或原游戏PID。[后续观察条件](../analysis/launcher-current-control-v1/game-capability.json)。

<a id="stage111"></a>
## stage111：无VM操作，继续独立连接协议分析

本轮未操作Windows/Parallels、执行厂商程序、修改网络/共享/安全或恢复点；旧快照、设备、备份仅维持各自历史证据层。无解锁/焦点人工请求；以后VM操作仍先按[唯一知识库](known-issues.md#vm-troubleshooting)核当前窗口/目标/已用额度，不把本轮纯字节测试当设备或原游戏验收。

主机REA123+16=139后保存关闭，当前record差异已进入shared/flow，相关7文件78Node通过。本轮无新外部TCP/账号运行，用户暂无测试账号；继续无账号正常连接控制。stage110真实前置仅8B hello，不升格为加密/账号或游戏兼容。[阶段方案](../analysis/launcher-current-record-v1/plan.json)、[验收](validation.md#stage111)。

<a id="stage110"></a>
## stage110：本轮仅主机源码、纯模块与无账号TCP观察

未操作Parallels/Windows或运行厂商程序，未改VM、网络、安全策略或共享；stage108快照/备份/设备记录保持其当时核验层级，未补恢复启动或原游戏验收。当前不要求用户解锁/点焦点；任何后续VM操作仍先读[唯一知识库](known-issues.md#vm-troubleshooting)，按新鲜画面核对，不把旧锁屏/输入状态当当前事实。

主机REA续查累计123记录后关闭，4现有纯模块修改、3源区间/独立向量/78相关Node通过。主机独立TCP仅一配置端点8B hello→529B源组匹配→1483.317ms close，没有账号或原游戏。本阶段不把独立Node网络当原Windows链路/设备或官方验收。[范围](../analysis/launcher-current-channel-v1/plan.json)、[实际回执](../analysis/launcher-current-channel-v1/network-observation.json)、[验收](validation.md#stage110)。

<a id="stage109"></a>
## stage109：不依赖新VM执行的登录协议推进

本轮仅在Mac私有build内REA读取已核对的更新版分析副本，未访问/操作Windows、重启、安装、UAC、改共享/网络/安全、读账号/IPC或执行厂商程序。stage108的D介质、备份和正常关窗/订阅0/0是当时实证，本轮不据历史再宣称当前VM/恢复点/进程状态，不重放旧脚本。[范围](../analysis/launcher-current-login-v1/plan.json)。

已从现行登录器原生门槛修正两个shared模块，48组合成字节链/78相关Node与5原字节锚点通过，REA新快照保存后关闭。完整Windows游戏消费者、恢复启动、账号、设备与官方兼容仍未验证；后续需要VM时先按唯一知识库核新鲜状态和具体目的，沿现有授权不重复一般权限询问。[本轮实证](../analysis/launcher-current-login-v1/rea-audit.json)、[测试范围](../analysis/launcher-current-login-v1/test-results.json)、[唯一知识库](known-issues.md#vm-troubleshooting)。

<a id="stage108"></a>
## stage108：app-local依赖修复后正常自更新与主界面（2026-10-30）

复用现有Parallels Windows11；新私有原生恢复点`Moli-before-normal-launcher-20261030-stage108`元数据唯一、旧stage102保留，未还原启动或验收独立备份。真实新安装路径Win7两值已回读；网络/共享/安全及执行策略本阶段未改。[恢复点](../analysis/game-install-context-v1/recovery-point-stage108.json)、[配置](../analysis/game-install-context-v1/compatibility-stage108.json)。

首次专用管理员5608中正常父9732创建更新器2484，父exit0、87.164秒点计数0、四hash相同；订阅/队列清零后正常关终端，5临时键盘项撤回并核原19项及顺序。输入长行仍可丢中部，未普遍验收。[首次事件](../analysis/game-install-context-v1/lifecycle-runtime-stage108.json)、[键盘收尾](../analysis/game-install-context-v1/keyboard-cleanup-stage108.json)。

D现为只读MOLIVC108、四文件hash相同，Windows外层运行库包签名Valid，E与旧ISO源保留。新微软管理员PowerShell9208正常UAC后，精确四原件备份hash通过（更新器隐藏，-force列全），精确三DLL File.Copy(String,String)无覆盖新增于平台目录并hash。未执行VMware安装器或安装全局运行库。[介质](../analysis/game-install-context-v1/vc71-guest-media-stage108.json)、[新修复实证](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)。

新单次正常父9280→旧更新器10436→新登录器9012，到V2.01主界面/网吧模式，未登录或启动游戏。约52秒正常关窗，97.321秒才回读退出/进程数0；EXE和RegionList更新，更新器退出未知。新会话订阅/队列0/0后19:58正常关闭专用管理员终端，原普通终端/私有备份保留；第二次未新增键盘项。旧隐藏1e行是否清空仍未知，不盲目提交/关闭、不重放D脚本或Restore。[实际事件、文件和清理](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)、[版本对应](../analysis/game-install-context-v1/updated-source-bridge-stage108.json)、[唯一知识库](known-issues.md#vm-troubleshooting)。

<a id="stage107"></a>
## stage107：用户完成平台安装后的实际回读（2026-10-30）

原平台PID3440实际WaitForExit(0)=True、HasExited=True、ExitCode=0。HKCU\SOFTWARE\SECN\Launcher的InstallDir32/64均REG_SZ、exit0，同值为`C:\Program Files (x86)\易玩通\“易玩通”娱乐平台`；目录及599040B登录器、46080B更新器完整hash已核。[安装记录](../analysis/game-install-context-v1/platform-installed-stage107.json)。本轮安装器重启/接受条款/Install/厂商启动指令均0，用户中间自动运行未知。

后续普通来宾输入失效；原生菜单一次正常暂停出现明确覆盖层，继续后层消失，正常退出全屏后Windows时钟恢复更新。主机原生搜索的setValue+a实际可用、已清空；原有Win+Q能打开来宾搜索，普通Escape/点击/按键尚无预期来宾回执。鼠标/键盘均自动游戏检测，没有选中新值；原生File关闭配置回到同一Windows11窗口，最后观察时钟14:44。无重启/重置/强杀/还原、网络/共享/安全或自定义键盘菜单变更。[已试与未决](../analysis/game-install-context-v1/access-observation-stage107.json)。

当前只读进程查询末尾仍是`ft id,nam`、未提交；一次最小手动焦点请求待答，无密码/命令/重复授权请求。恢复后先检查/取消未提交行，核新鲜进程、文件和Win7真实路径，再按[新正常启动方案](../analysis/game-install-context-v1/normal-launcher-plan-stage107.json)推进；不复用旧额度或重放旧脚本。

<a id="stage106"></a>
## stage106：同一VM内的平台安装向导停在许可页

新鲜终端/英输入可用，E:MOLIINST102/CD-ROM及平台完整hash相同，C余227420581888B；平台InstallDir两视图缺项/值、两个默认父目录不存在、相关进程0。已安装游戏hash保持相同。原平台安装器一次正常RunAs/UAC，展开精确E路径后接受，PID3440初始HasExited=False；欢迎页后到实际许可页。[前检](../analysis/game-install-context-v1/platform-preflight-stage106.json)、[运行](../analysis/game-install-context-v1/platform-runtime-stage106.json)。

当前许可拒绝选中、Next禁用，未接受或点Install；一次本次协议确认待答，保留现有向导、不重放命令。本轮未主动改网络/共享/策略/安全、重启/还原或读账号，无新增人工解锁/焦点请求。平台安装完成及退出码仍待证；既有恢复点保留，恢复启动未测。[许可](../analysis/game-install-context-v1/platform-license-stage106.json)、[知识库](known-issues.md#vm-troubleshooting)。

<a id="stage105"></a>
## stage105：复用现有Windows完成正常游戏安装

用户的本次安装/UAC确认已使用；新鲜前检核C盘空间、E:MOLIINST102及游戏安装包完整hash、两默认父目录原先不存在、相关进程0。既有stage102恢复点名称/元数据仍在，未创建或还原其他VM，恢复启动未测。现有桌面及150ms逐字输入可用，无新增人工操作请求。[前检](../analysis/game-install-context-v1/guest-preflight-stage105.json)。

正常向导实际落到 `C:\Program Files (x86)\PlayOnline\魔力宝贝`；结束取消平台安装，PID6368退出0。Path两视图/四文件hash已核，未自行运行游戏、登录器、CG5Reg或卸载器。[安装回执](../analysis/game-install-context-v1/guest-installed-context-stage105.json)。新原创观察器通过一次固定NAT传输，完整hash相同；只对原创fixture读一次8B、observer退出0、fixture自然结束，相关结束进程计数0，传输服务已关闭。[工具实证](../analysis/game-entry-runtime-v1/windows-observer-stage105.json)。

本轮未改网络/共享/执行策略/安全设置，未重放旧脚本或Restore、未读账号；这不重新证明所有现有网络/共享状态。安装完成不等于原游戏/协议/官方兼容。[操作知识库](known-issues.md#vm-troubleshooting)。

<a id="stage104"></a>
## stage104：没有新来宾操作，阻塞来自待答执行确认

本轮未调用电脑控制、未提交Windows命令、未运行安装器/厂商程序/旧脚本，也未还原快照或更改网络/共享/策略。stage103空提示符及两视图结果属于当时实证，不能据此宣称本轮Mac/Windows仍解锁、文件仍挂载或路径实时存在。

当前goal已因本次未知来源安装/UAC确认待答而返回blocked；一般Windows/联网/工具授权未撤回，既有问题不重复发送，无新解锁/焦点人工请求。确认后先核新鲜窗口/成员hash/实际目的地，再沿stage102正常交互方案继续，保留既有恢复点与介质。[三轮与范围](../analysis/game-install-context-v1/blocked-audit-stage104.json)、[唯一知识库](known-issues.md#vm-troubleshooting)。

<a id="stage103"></a>
## stage103：平台路径的两视图只读回执

现有Windows11前台NoProfile终端仍可用，未重新登录/重启/还原。对HKCU SOFTWARE\SECN\Launcher的InstallDir分别提交显式reg:32/reg:64查询，各取得“系统找不到指定的注册表项或值”和$LASTEXITCODE=1，最后空提示符。它们属于本次当前用户/指定值，不能外推全系统未安装或提权后上下文。[实际查询](../analysis/game-install-context-v1/guest-platform-context-stage103.json)。

stage102的快照与E:MOLIINST102保留，未重建/还原/重新传输；不把历史挂载当本轮独立复测。本轮厂商程序/安装器/脚本执行0、注册表写入0，未改网络/共享/策略。仅既有本次来源执行/UAC确认待答，无新增人工解锁、焦点或键入请求。[操作知识库](known-issues.md#vm-troubleshooting)。

<a id="stage102"></a>
## stage102：本地只读安装介质与新恢复点

现有Windows11会话和普通输入持续可用，无解锁/焦点人工请求。原物理D卷仍MOLICUR89，设备菜单未确认换源；改用已授权私网固定ISO传输，CreateNew/Write/None独占写到C:/MoliOffline/install-stage102.iso，完整SHA一致后以Windows原生Mount-DiskImage只读挂入E:MOLIINST102（\\.\CDROM1）。两安装包来宾hash匹配且NotSigned；没有自动启动或安装。[实际文件/挂载/签名](../analysis/game-install-context-v1/transfer-session-stage102.json)。传输流均释放，服务自然退出且端口拒绝，未改变共享/网络/防火墙/策略。

通过原生UI创建`Moli-before-normal-install-20261030-stage102`一次，进度结束回桌面；Snapshots.xml精确一项、guid/state和完整metadata hash已核。它是原PVM内恢复点，未还原/恢复启动，不能当独立备份；保留全部磁盘层及介质。[前检与容量](../analysis/game-install-context-v1/recovery-point-preflight-stage102.json)、[创建回执](../analysis/game-install-context-v1/recovery-point-stage102.json)。

此前22项临时键盘菜单已逐项删除，偏好设置正常关闭后重开实际菜单，精确保留原有19项及顺序，未使用恢复默认。[撤回清单](../analysis/game-install-context-v1/keyboard-cleanup-stage102.json)。当前仅本次游戏包来源执行/UAC确认待答，原安装器/登录器/游戏本阶段均0；不重放旧脚本、Restore或已消费启动额度。最新操作问题见[唯一知识库](known-issues.md#vm-troubleshooting)，旧锁屏/22项待撤回状态均为历史。

<a id="stage101"></a>
## stage101：同一 Parallels 会话恢复与原创工具实测

实际回到同一Windows桌面/NoProfile终端，150ms逐字按键、整行核对后单次Return可用；`=`曾变为`+`，在提交前Ctrl+C取消，改用Set-Variable。未重建/恢复/重启VM或使用被禁CLI控制。原CD仍MOLICUR89，新stage96 ISO未挂载；原创两版PE通过临时固定文件NAT复制，两端完整hash核对，新文件CreateNew、旧文件`.stage96`保留。源CD/旧脚本不重放。[会话与文件回读](../analysis/game-entry-runtime-v1/resume-stage101.json)。

修正版一次8B观察与独立同步自然exit0已取得；首个Process.ExitCode空值保留，不混用两个PID回执。结束原创进程计数0、对象/缓冲已释放、两临时传输端均关闭；有效策略仍Restricted。本切面未改网络/共享/策略/安全权限，不把现有桌面或NAT等同隔离/游戏兼容。先前键盘辅助临时开关最终off已记录，22项临时菜单仍待精确撤回。[Windows案例](../analysis/game-entry-runtime-v1/windows-observer-stage101.json)。

原Updater实际旧hash22d561…e479、候选journal路径False；固定游戏仅client-probe副本，规定game路径不存在。Path键的原生与reg:32查询未得目录，INI所选模式零匹配，尚未建立正常游戏上下文。没有原游戏/启动器/更新器新启动或真实IPC/账号观察。[上下文](../analysis/game-entry-runtime-v1/game-context-stage101.json)、[操作前唯一知识库](known-issues.md#vm-troubleshooting)。旧stage100 blocked为历史，当前无待回复人工步骤。

<a id="stage100"></a>
## stage100: Mac access blocked (2026-10-29)

电脑控制在连续3个 goal turn 均报告 Mac locked、自动解锁失败；未取得新来宾状态、提交新命令或运行观察器/原游戏。三轮阻塞审计已通过，goal 工具实际返回 blocked，完整目标尚未完成。

仅已有一次正常解锁请求保留，无需重复授权或再点击终端。解锁后先看未提交的哈希查询，核文件/备份/journal/原创目录，再验原创工具；旧脚本/Restore/启动不重放。22项临时菜单因锁屏尚未撤回，精确清单保留。不改锁屏/安全或使用已禁止控制路径。下列旧“当前”均为各阶段历史。

[stage100 audit](../analysis/game-entry-runtime-v1/access-blocked-stage100.json), [stage100 delivery](../analysis/delivery-manifest-stage100.json).

<a id="stage98"></a>
## stage98：新终端实际前检通过，随后 Mac 再锁定（2026-10-29）

仍是既有Parallels Windows11会话。旧损字行清空已确认；原生Win+R/Enter打开一个系统powershell -NoProfile，实际取得D=MOLICUR89、Restricted及两组指定进程计数0。[实证](../analysis/game-entry-runtime-v1/guest-preflight.json)。

22个临时原生按键菜单项尚待按精确清单撤回，不点恢复默认。未切换游戏优化/启动顺序/TPM，未改VM硬件/网络/共享/策略/安全；设置窗此前正常关闭，无新电源/还原动作。[过程与清单](../analysis/game-entry-runtime-v1/input-recovery.json)。

最后hash查询前半段未Return，后续CUA在读画面前报Mac锁定/自动解锁失败。一次正常解锁请求待答，无需终端点击，恢复后先核未提交行。主机stage89 CD来源与来宾标签对应，不证明文件或打开句柄；stage96新CD未挂载/传输，工具/原游戏启动0。先核文件/备份/journal/目录和原创工具，不重放旧脚本/Restore/额度。新锁屏第2轮，完整目标active/未完成。[访问](../analysis/game-entry-runtime-v1/access-observation.json)、[计划](../analysis/game-entry-runtime-v1/run-plan.json)。

stage99 复查：CUA 仍在 Mac locked／自动解锁失败处停止，未取得新来宾状态或提交命令。同一新锁屏已连续2个 goal turn；上一轮有实际前检进展，本轮无开发进展。已有一次解锁请求保持，不追加终端操作或重复授权。完整目标 active，恢复后先看未提交的哈希查询，再核文件/目录并验原创工具。[本次复查](../analysis/game-entry-runtime-v1/access-recheck-stage99.json)。

<a id="stage97"></a>
## stage97：第三轮同一锁定条件，来宾无新动作（2026-10-29）

操作前读唯一排障知识库的stage96及操作清单，回读完整stage96交付，再用CUA getApp绑定现有Parallels。工具再次报告Mac locked/自动解锁失败，未得到新桌面/输入/文件/进程状态。来宾命令、介质挂载/传输/执行、原程序启动、current.ps1/Restore重放、VM/网络/共享/策略/安全变更均0。[当前观察](../analysis/game-runtime-access-v1/access-observation.json)。

同一访问条件从stage95连续三goal turn，前两轮独立分析/准备有进展，当前无已验证活进程句柄可等待、也无可补装依赖替代OS解锁。所有已准备工件重核相同，Windows未验。完整阻塞审计及交付通过后提交goal blocked；已有授权保留，旧policy blocker不合并计数。[审计与恢复步骤](../analysis/game-runtime-access-v1/blocked-audit.json)。

保留现有Parallels与stage94备份/未知当前EXE恢复guard。正常手动解锁后先新鲜核对窗口/英输入、路径/hash/备份/journal，不能复用历史桌面或重复旧一次脚本/启动；随后先完成原创工具Windows验收，再观察正常获授权现有游戏PID，不附加调试器/修改保护或读取代码/IPC/秘密。

<a id="stage96"></a>
## stage96：正常访问仍锁定，观察工具仅主机准备（2026-10-29）

本轮操作前读唯一排障知识库及stage94/95当前范围；CUA绑定现有 `/Applications/Parallels Desktop.app`即返回Mac locked/自动解锁失败，未获取新来宾桌面状态或提交输入。来宾命令/原游戏启动/current.ps1重放/VM网络共享安全设置变更均0。stage95已发一次解锁请求仍待答，本轮不重发或重问已有效授权。[前检与访问结果](../analysis/game-entry-v1/preflight.json)。

原创x86 fixture/只读观察器已在Mac构建并做静态/26边界检查，4成员数据CD在主机回读通过，尚未挂载或传入来宾；PE与ISO仅保留本地build，未新安装/购买或改全局工具配置。[介质](../analysis/game-entry-v1/observer-media.json)、[待执行步骤](../analysis/game-entry-v1/probe/README.md)。

当前恢复运行的同一锁定条件为第二轮，本轮独立分析/工具有实质进展，goal保持active。stage94一次RemoteSigned已用完、末次有效Restricted，Restore因未知当前EXE停止且**未恢复**；它们只描述已观察时点。正常解锁后先重新核窗口/输入/文件/备份/journal，不重放旧一次脚本、放松guard或改调试/保护决策；原创工具Windows验收须先于任何游戏槽观察。

<a id="stage95"></a>
## stage95：本轮绑定前锁定，未执行来宾动作（2026-10-29）

操作前读取唯一排障知识库当前stage94与操作清单，并恢复CUA文档；getApp现有Parallels路径返回Mac locked/自动解锁失败。未取得新桌面/输入/文件/进程状态，来宾命令、原程序启动、current.ps1重放和VM/策略/网络/共享变更均0。已发一次人工解锁请求；已有授权继续，不重问临时策略。[新观察](../analysis/launcher-update-recovery-v1/access-observation.json)。

stage94首屏、普通退出、更新后EXE及保留备份均作为其当时观察，不能当本轮journal或完整恢复证明。下一实际步骤为访问恢复后按固定路径只读核对journal/事务文件；不放宽Restore guard或自动覆盖新EXE。当前锁屏恢复未通过，桌面/设备/游戏均无本轮新验收；独立REA与纯核心进展见[验收](../analysis/launcher-update-recovery-v1/validation.json)。

<a id="stage94"></a>
## stage94：具体临时策略执行、正常首屏与受控恢复停止（2026-10-29）

复用同一Windows11 PVM/窗口。主机实际Parallels26.3.3/build57507，历史20.4.2不作为现状。初始画面有既存Tools重启倒计时，随后见重装34%→Welcome→桌面；没有选择Restart/Reinstall菜单或输入凭据，发起者未建立。普通窗口下Ctrl+Escape、英输入及分段命令重新有响应，单一恢复根因未证。[前检与外部变化](../analysis/launcher-current-runtime-v4/access-preflight.json)。

新鲜只读配置仍是Shared/NAT、NIC Connected1，IsolatedVm1且Mac全盘/用户目录共享0；本轮未改网络/共享/Win7/安全设置。原stage89数据CD九hash一致、Windows5.1解析MOLI_PARSE_OK；已批准RemoteSigned独立进程依次Verify、Install、Observe、Restore，各1次，无持久策略修改。[介质](../analysis/launcher-current-runtime-v4/guest-media.json)、[前检](../analysis/launcher-current-runtime-v4/verify.json)、[安装回执](../analysis/launcher-current-runtime-v4/install.json)。

显式启动1次、预期UAC确认1次，初始PID2384运行3424ms退出0，UAC及Start单独39039ms；早期读到Updater1020。随后网吧模式V2.01主界面出现，经Exit/Yes正常关闭，没有凭据/登录/游戏。不能把父句柄3.4秒当全自动子链时长或认定只产生一个进程。[时间回执](../analysis/launcher-current-runtime-v4/observation-readback.json)、[UI](../analysis/launcher-current-runtime-v4/ui-observation.json)。

Restore返回MOLI_UNRECOGNIZED_CURRENT_EXE/exit1并在替换前停止。最后EXE为1666048B/6d459ddbdf…，独立获取公开包载荷逐字节hash相同；保留新文件及C:\\MoliOffline\\current-stage89四备份，没有guard放宽、重试、强杀或全VM回滚。四子PowerShell返回后五scope Undefined、有效Restricted、终端无待提交行。[停止](../analysis/launcher-current-runtime-v4/restore-stopped.json)、[策略](../analysis/launcher-current-runtime-v4/policy-after.json)。锁屏/桌面恢复已观察，设备只覆盖当前输入/CD/网络元数据，游戏与官方兼容未验。

<a id="stage93"></a>
## stage93：当前桌面可控，有效策略实测 Restricted（2026-10-28）

按操作知识库读取现有Windows 11窗口，ID仍为{bac7348c-9220-4447-94e4-e49b00f44939}；来宾位于C:\MoliOffline\launcher-probe，英输入、完整短命令核对与一次Return均有实际响应。Get-ExecutionPolicy显示Restricted，回到无待提交行的提示符。这是新查询；画面中的stage90五scope Undefined与旧脚本错误不重算本次执行。[非敏感观察](../analysis/launcher-current-runtime-v3/observation.json)。

当前阻碍不是锁屏或焦点问题，不重复索取解锁/一般Windows或联网授权。仅进程RemoteSigned问题未答，未输入其命令；Verify/Install/Observe/Restore本次均0，未新增UAC、策略/网络/共享/兼容设置、挂盘、快照、电源或原程序动作。主机脚本/ISO hash本轮重核，来宾九成员hash仍是stage90结果，恢复执行前须重新核对。

现有SDK/x86原创夹具及主机PowerShell准备保留，不因策略门槛重装依赖或换通道执行等价脚本。四轮同条件审计已满足blocked门槛；目标仍未完成，恢复点是既定前检。[审计](../analysis/launcher-current-runtime-v3/blocked-audit.json)、[方案](../analysis/launcher-current-runtime-v2/policy-proposal.json)。

<a id="stage92"></a>
## stage92：独立实现推进，未操作 Windows（2026-10-28）

本轮仅新版静态REA、共享字节核心及实际Node/独立Chrome回环验证。VM UI/命令/挂盘/进程/网络或共享/策略/快照/电源动作均0次，没有执行packed候选或分析副本。最近实际Windows输入/CD/hash/解析及策略拒绝仍以[stage90回执](../analysis/launcher-current-runtime-v2/guest-preflight.json)为准，不宣称当前界面已重新验收。

仅进程RemoteSigned具体问题未收到回复；保留[精确方案](../analysis/launcher-current-runtime-v2/policy-proposal.json)，不把自动goal继续当批准。已有Windows/联网/工具授权及用户确认的双Win7设置继续有效，不重复索取。原版新候选正常启动/更新子链、文件事务恢复、账号/游戏与官方验收均未完成；可恢复后仍从原计划前检开始，不重装现有SDK/观察器或恢复旧清理分支。[本轮实际结果](../analysis/launcher-current-metadata-v1/validation.json)。

<a id="stage91"></a>
## stage91：本轮未操作VM，Windows策略具体问题仍待答（2026-10-28）

最近实际来宾状态仍以[stage90回执](../analysis/launcher-current-runtime-v2/guest-preflight.json)为准；本轮没有新的UI读取、脚本、策略、挂盘、联网/共享、快照、电源或原程序动作。仅进程RemoteSigned问题未收到回复，不把自动goal继续消息当批准。Mac解锁/来宾输入在stage90通过的事实保留，不虚构当前重新验收。

本轮工作在主机静态REA/纯共享核心：新11函数/17条记录导出关闭，Node558与独立临时Chrome ESM测试完成。它们没有进入既有Windows、替换原程序或取得新首屏/子进程/游戏证据。普通Windows/联网/工具授权继续，具体策略门槛不绕过；完整目标保持active/未完成。[验收](../analysis/launcher-current-catalog-v1/validation.json)。

<a id="stage90"></a>
## stage90：普通输入恢复，数据CD已挂载，脚本策略阻止执行（2026-10-28）

用户正常解锁后的新鲜Windows窗口和实际终端结果已取得；PowerShell为5.1.26100.4202。一次原生光驱菜单操作挂入stage89已核验ISO，来宾提示D:MOLICUR89，九成员hash均相同。主机只读配置再次显示Enabled1/Connected1/EmulatedType1、IsolatedVm1、ShareAllMacDisks0/ShareUserHomeDir0及该新CD路径；本轮未改网络、共享、安全、兼容、快照或电源。[访问与介质](../analysis/launcher-current-runtime-v2/guest-preflight.json)。

parse.cmd实际通过；verify.cmd被Windows禁运行脚本，exit1，工具主体尚未进入。随后只读Get-ExecutionPolicy -List显示五作用域Undefined。Install/Observe/Restore、新候选运行、UAC及游戏执行均0；原Win7设置继续沿用用户确认，不复查改写。仅进程RemoteSigned的具体请求待答，无持久或进程策略变更。[待确认影响与恢复](../analysis/launcher-current-runtime-v2/policy-proposal.json)。

早先三轮Mac-lock审计在用户解锁、任何goal状态修改前已失效，未设置blocked。当前止于实际脚本策略门槛，完整目标active/未完成；旧locked/未挂盘记录仅对应各自时点。后续新动作仍按[操作知识库](known-issues.md#vm-troubleshooting)和当前状态核对。

<a id="stage89"></a>
## stage89：只读配置仍原样，新运行介质未挂载（2026-10-28）

操作前读取VM排障章节并核对stage88。现有Parallels Windows11 PVM的只读选定配置仍Enabled1/Connected1/EmulatedType1、IsolatedVm1、ShareAllMacDisks0/ShareUserHomeDir0；唯一光驱仍stage83d ISO。配置是主机文件观察，不能证明桌面/网络实际可用。[前置快照](../analysis/launcher-current-runtime-v1/preflight.json)。

CUA本轮首次及介质准备后再次读取均报告Mac locked/automatic unlock failed；未取得来宾窗口，未输入、换盘、复制或运行。当前待本人正常解锁，沿用已有授权；不另问泛化Windows/联网许可，不改锁屏/共享/网络/策略或回滚快照。

新数据CD已在build准备，9项回读通过。原创工具方案保留同一EXE路径及Win7已确认设置，只会在未来前置通过后备份四文件并替换EXE、普通UAC观察和精确EXE恢复；本轮全部未在VM执行。12项macOS工具测试/签名工具启动不充当来宾或游戏验收。[方案](../analysis/launcher-current-runtime-v1/run-plan.json)、[介质](../analysis/launcher-current-runtime-v1/media-validation.json)、[验收](../analysis/launcher-current-runtime-v1/validation.json)。


<a id="stage88"></a>
## stage88：Mac访问再次锁定，继续静态与纯核心（2026-10-28）

当前目标仍为现有Parallels Windows11 PVM；先读本项目操作知识库，再恢复CUA文档并读取已有绑定，工具在取得来宾窗口前报告Mac locked/automatic unlock failed。已异步请求本人正常解锁，截至本轮记录未回复；既有Windows/联网/工具授权有效。这是访问失败，无新审批拒绝。[访问记录](../analysis/launcher-current-updater-v1/access-observation.json)。

本轮来宾命令/新包传输/执行均0；stage87只读日志前619字节hash待提交行未重发，旧单次正常启动方案已消费，不盲启原文件。未改变PVM网络、共享、安全、驱动、电源、快照或文件属性。新样本的18函数/29条静态REA与548Node不充当桌面/原生恢复/游戏验收；恢复输入后再核实际状态和当前版本普通启动。[当前开发切面](development-plan.md)。


<a id="stage87"></a>
## 正常原登录器首次联网交接（stage87 / 2026-10-28）

当前自动暂停已原生正常继续，切全屏后实际搜索/PowerShell输入恢复，英文、目录及四hash已重新读回。原Win7设置沿用用户确认，Shared/NAT Connected1与Mac目录隔离保留；未重新安装Tools、改安全权限、共享或重启。[预检](../analysis/launcher-runtime-v2/guest-preflight.json)。

来源对应方案实际使用一次。正常UAC展开路径确认`C:/MoliOffline/launcher-probe/POLCN_Launcher.exe`后Yes；PID7684，来宾15:11:59启动、15:12:03退出、exit0。含UAC约31秒至退出，但只有90秒后才确认，不称全程计时通过；无需强杀/重启。日志与成功更新器交接路径相符，当前主程序/两XML未替换。[运行](../analysis/launcher-runtime-v2/startup-observation.json)、[文件](../analysis/launcher-runtime-v2/postrun-files.json)。

更新器实际是隐藏文件，hash匹配旧内嵌样本。普通列表不能证明隐藏项不存在；主EXE仍ReadOnly。旧更新器MFC71/MSVCP71/MSVCR71静态导入是下一步依赖查询候选，当前没做来宾缺失确认/补库或属性修改。新主机候选及814080B新更新器均未传入/运行VM。后续输入再次间歇失效，未提交的行只做日志前缀hash；无账号或游戏动作。[下一切面](../analysis/launcher-runtime-v2/next-slice.json)。

<a id="stage86"></a>
## 现有会话自动暂停的正常恢复（stage86 / 2026-10-28）

**最后访问复查：** 电脑控制在读取窗口前再次报告Mac locked且自动解锁失败，未提交原启动命令。需正常手动解锁并恢复既有终端焦点操作；当前Windows/联网授权保持。[最新工具结果](../analysis/launcher-patch-live-v1/access-recheck.json)。

新鲜截图显示现有Windows11“已自动暂停”，后台仍是既有搜索。原生操作菜单明确“恢复”，仅选择一次，覆盖层消失；不是“恢复到快照”，未重启/关机/改自动暂停策略。恢复后一次PowerShell图标点击仍未见终端，不能据菜单成功当guest输入通过。[实际观察](../analysis/launcher-patch-live-v1/vm-resume.json)。

原登录器命令未输入/提交、UAC0、游戏0；人工终端焦点请求继续，后续需重核英文、固定guesthash和当前运行状态。当前独立主机清单取证均无正文，不将主机请求失败推广成guest或游戏结论。[网络](../analysis/launcher-patch-live-v1/network-observation.json)、[阻塞审计](../analysis/launcher-patch-live-v1/blocked-audit.json)。已有Windows/联网授权保持，完整开发目标未完成。

<a id="stage85"></a>
## 来源对应后，正常启动尚缺可用来宾输入（stage85 / 2026-10-28）

**解锁后当前：** 已重新绑定并读到Windows桌面；原生键盘菜单Win+Q成功打开Search，普通点击/文本未在来宾生效，已请求手动点PowerShell/终端空白区恢复焦点。新AX窗口ID不是VM UUID，不据旧绑定或回执继续发启动命令；重绑后未重核guest文件/进程，本阶段启动/UAC仍0。最新主机config共享网络Connected1、目录隔离1、共享磁盘/用户目录0。[补验](../analysis/launcher-provenance-v1/access-followup.json)。

现有来宾三固定文件已能对应当前官网ZIP安装器的静态提取结果；HTTP与未签名限制保留，按现有Windows/联网授权准备一次正常启动。[来源与启动方案](../analysis/launcher-provenance-v1/source-assessment-and-run-plan.json)。

较早原启动前的CUA getAXStateAndScreenshot返回Mac locked/automatic unlock failed，发生于窗口读取和输入之前；本轮启动提交、UAC接受与游戏启动均0次，当前guest进程未独立读取。已请求正常手动解锁，不复用旧解锁状态，不改PIN/安全或换路径执行。主机只读config仍Enabled1/Connected1/EmulatedType1、IsolatedVm1/共享磁盘0/用户目录0；stage81快照元数据哈希未变且名称唯一，恢复启动未验。[当前访问与配置](../analysis/launcher-provenance-v1/access-observation.json)。

<a id="stage84"></a>
## 原登录器联网启动前置（stage84 / 2026-10-28）

当前仍为同一Parallels Windows11，Shared/NAT Enabled1/Connected1/EmulatedType1，IsolatedVm1/ShareAllMacDisks0/ShareUserHomeDir0。stage81快照名称一项且元数据SHA256仍1b8b…a686b；未恢复/重启/修改权限或共享。[现场核对](../analysis/launcher-runtime-v1/guest-preflight.json)。

`C:\MoliOffline\launcher-probe`的原登录器及两XML哈希匹配，Windows报告原登录器NotSigned；仅哈希Log.htm，未读内容。已发出工具要求的本次具体运行确认，原登录器/更新器/游戏本阶段均未运行。确认后沿[方案](../analysis/launcher-runtime-v1/normal-start-plan.json)正常观察首屏，账号本人输入，当前不宣称游戏或官方兼容。

<a id="stage83"></a>
## 当前共享网络与原创目标调试结果（stage83 / 2026-10-28）

用户明确要求直接操作且不再需要网络隔离后，现有Windows11的原生工具栏网络菜单实际选择共享网络（建议）。配置Enabled1/Connected1/EmulatedType1，来宾正常HTTPS HEAD微软文档站返回200；IsolatedVm1/ShareAllMacDisks0/ShareUserHomeDir0保持。未设桥接、端口转发、文件或剪贴板共享，未重启/还原/清理VM。[联网](../analysis/runtime-observer-v3/network-observation.json)。

源码已审阅的原创x86 EXE SHA256`01588841278dcb7360c91333f0f7c5ec81aec84625ca274be54ad9011aaf10eb`普通运行退出0。ARM64 CDB创建目标后WOW64上下文观察失败，qd分离后进程查询无匹配，目标退出码未捕获，不能写成通过。SDK x86 CDB SHA256`6ca9dd8ee2d764087c4a561ecfee05cdf17751dfd9c2f21700211a897cd68129`来宾签名Valid，版本26100.9457；实际固定7返回位点与REA/字节锚点一致。补验基址0x00810000，目标退出事件code0；退出回调多余g报No runnable debuggees，确认目标已退出后q，调试器返回0。[目标退出](../analysis/runtime-observer-v3/fixture-lifecycle.json)、[关闭](../analysis/runtime-observer-v3/fixture-session-close.json)。

四份只读测试ISO及SDK/原v21介质均私有保留；每次CD切换核对精确路径及全部来宾文件hash。当前光驱为stage83d生命周期介质，网络保持接通。原stage81恢复点还原未测试；原登录器/游戏本阶段执行0，游戏/官方服务器兼容仍未验。CDB默认通用寄存器输出和未计时限制见[本轮验收](../analysis/runtime-observer-v3/validation.json)。以下旧断网与未运行记录为各阶段历史。


<a id="stage82"></a>
## 当前Windows调试工具安装与自检（stage82 / 2026-10-28）

现有Parallels Windows11继续使用，网卡断开/IsolatedVm1/Mac磁盘与Home共享0，原stage81恢复点保留、还原未测。人工点击后普通输入恢复；原生菜单逐项键盘导航打开精确文件框，SDK26100.9457只读ISO已接入D:，原v21介质保留。文件框返回的捕获用一次已观察来宾空白区点击恢复；未走旧CLI、改共享/保护、重启或强退VM。[焦点与介质](../analysis/runtime-tool-readiness-v1/gui-focus-and-media-followup.json)。

微软ISO和全部程序/库、表及许可全文保留在私有build。主机19项选定签名/时间戳和15项双解码一致；两Redist MSI摘要异常未定，未手动运行/修复/重签，不称全包验证。Windows主安装器hash匹配、Authenticode Valid后普通启动一次；具体SDK许可页经用户回复确认后已接受本次许可，可选统计No。最终仅选Debugging Tools for Windows（估算534.0MB），核对微软发布者后批准安装UAC，完成页确认并正常关闭。[安装回执](../analysis/runtime-tool-readiness-v1/sdk-installation-followup.json)。

来宾ARM64 CDB hash匹配、签名Valid，普通`-version`实际返回10.0.26100.9457、退出0。尚未执行调试目标或采集，安装器内部子包链未逐项记录；原创x86/采集器隐私、游戏消费者和协议/官方仍待验。工具准备已跨过安装与自身启动，下一步保持隔离先验原创目标；联网批准仍有效，网络恢复请求保留。[自检](../analysis/runtime-tool-readiness-v1/cdb-windows-check.json)、[验收](../analysis/runtime-tool-readiness-v1/validation.json)。以下旧“当前”及早期JSON均按各自时间理解。

<a id="stage81"></a>
## 当前普通访问恢复与新快照（stage81 / 2026-10-28）

用户回复已正常解锁后，普通CUA的应用列表/既有完整路径绑定成功，Windows11桌面可读。配置中Isolate Windows and Mac勾选1、Source断开；旧`Moli-before-launcher-probe-20261026-v22`原生快照确认本项目目标，不将窗口包装UUID变化当VM变化。Win7/Business既有用户确认沿用，不复查。当前联网/工具授权有效，账号仍本人操作。

创建原生快照`Moli-before-observer-install-20261028-stage81`一次，创建前主机可用182.82GiB；原生进度结束、Snapshots.xml精确一项存在，SHA256`1b8b0309d8b459fee1d12ba5878fd108833584f7cc289371c757e791a94a686b`。旧v19/v22仍在，未做恢复启动，不称恢复验收完成。[回执](../analysis/runtime-install-v1/recovery-point.json)。来宾Task Manager有限关键词检查及InstalledApps的windbg无匹配分别记录，不推出全机/全进程结论。

Source下拉未展开，随后一次设备/网络父菜单动作出现Parallels关键错误；精确本机报告记录26.3.3的QtWidgets combo/widget栈与EXC_BAD_ACCESS。正常关闭报告后现有Windows桌面仍可读；没有发送报告、选择网络类型或重试该菜单。文件仍Connected0/IsolatedVm1/ShareAllMacDisks0/ShareUserHomeDir0，新快照仍在。[操作](../analysis/runtime-install-v1/gui-observation.json)、[错误摘要](../analysis/runtime-install-v1/parallels-error-summary.json)。复现性及根因未知；没有强退/重启/还原、CLI/权限/保护变更。

已请求用户通过正常配置手动设共享网络并保留Mac隔离，若再次关键错误即停。当前网络、工具安装、原创目标/原程序运行均未验/未执行，完整目标active且未完成。下方旧“当前/blocked”仅对应当时状态；继续前按[操作知识库](known-issues.md#vm-troubleshooting)核对本节和实际界面。

## 当前访问依赖达到阻塞门槛（stage80）

第三个连续恢复目标回合，一次正常cua.listApps(emit:false)仍在应用绑定前报告Mac locked及automatic unlock失败。代理没有输入凭据或发起显式解锁命令，不据工具消息独立断言实际Mac/Windows画面；无后续输入、来宾、原程序或配置/网络/共享操作。无活跃工具/进程句柄，正常用户解锁请求仍待回应。

现有工具/联网授权有效，host x86目标与介质已准备；当前官方固定包请求均失败，Windows观察器/目标未验。此次仅核实保存并将完整目标置blocked，不重新运行旧探针、恢复旧CLI或改变保护；普通访问恢复后按既有范围继续。[连续三轮与完整需求审计](../analysis/runtime-access-blocked-v1/blocked-audit.json)。


## 当前普通访问仍未取得（stage79）

一次新的cua.listApps(emit:false)在应用绑定前报告Mac locked，未取得Parallels/来宾、发输入或改配置；实际Mac/Windows状态未独立观察。已接受现有工具/联网授权，正常手动解锁请求已发送。主机对微软公开固定包HEAD/正常GET各403、0字节，无包获取、签名/依赖检查或安装；当前地址停止，不再把旧“GET未发出”当现在事实。WinDbg现状及Windows ARMx86实测仍待正常GUI恢复。[状态](../analysis/runtime-access-v1/access-status.json)。无VM/网络/共享/安全/凭据或原程序操作。


## 当前恢复与主机准备（stage78 / 2026-10-27）

用户已恢复完整目标、确认无额外调试资料，并批准联网测试及本项目工具操作。此次主机5个更新/配置GET成功，严格HTTPS失败；不代表来宾已联网。当前config.pvs只读仍Connected0/IsolatedVm1/ShareAllMacDisks0/ShareUserHomeDir0，实际Windows画面/运行状态未取得。

原创x86 PE32目标与只读ISO已在主机准备，10项host C模拟、16处REA/CALL-IAT原字节和2项ISO回读通过；尚未挂载、复制到来宾、安装WinDbg或执行目标/原程序。旧Win7/Business用户确认沿用，不复查。既有两原程序单次批准仍是已消费历史；本轮新授权记录为当前工具/网络/诊断范围，不能将其写作已发生执行。

正常CUA列表读取在选择Parallels前报告“Mac is locked and automatic unlock could not unlock it”；已请求用户本人正常解锁，没有解锁/凭据输入、重试或改走CLI/其他接口。旧网络恢复请求与本轮一般联网批准不作为Connected1的证据。[环境记录](../analysis/runtime-observer-v2/environment-observation.json)、[介质](../analysis/runtime-observer-v2/media-preparation.json)、[本轮验收](../analysis/runtime-observer-v2/validation.json)。恢复普通GUI后，先核实/安装正式观察器并验收原创x86目标，再进入已审阅的正常客户端链；不重复离线更新失败探针。


最新状态见[2026-10-26 v23](#v23-launcher-initial-probe)；以下各阶段保留历史，旧“最新”字样仅指当时。

记录日期：2026-10-25。**最新v9：独立恢复测试克隆已引导到Windows锁屏并正常关机；未登录，桌面/TPM/设备健康仍待验收。原v8冷基线未启动或修改。原VM被观察到已运行，本阶段未操作其客户机会话；其运行盘状态不再静止。原VM和克隆均无NIC/主机共享配置。** v8已安装并验证RNG/DOD签名及设备状态，Secure Boot=True，但Get-Tpm失败0x80284001和34项设备问题继续保留。此环境是离线取证前提，不是跨平台客户端或官服兼容证明；许可证适用性/激活未核实，游戏未运行。各旧阶段保留为历史，当前结果以末节v9及[实际引导证据](../analysis/vm-install-v9/restore-boot-observations.json)为准。

## 盘点与选型

**事实，高置信度：** 本机为 Apple M3 Pro / ARM64 的 MacBook Pro（Mac15,7），12核、36 GB内存、macOS 27.0.1；开始盘点时磁盘约余246 GiB。已装UTM 5.0.8和Homebrew QEMU 11.1.2的aarch64/x86_64后端，不需要重复安装。UTM在具体只读执行审查后通过完整代码签名核验及Gatekeeper公证检查：Turing Software, LLC，团队WDNLXAD4W8。沙箱内初次签名错误不是软件损坏的最终结论。资源采样有时间差：初始df为约246 GiB；下载中元数据记录260,505,600,000字节（约242.61 GiB）；下载完成后约237.66 GiB。配置分配8 GiB不等于实时驻留内存，后者未测量。版本、命令和限定搜索范围见[盘点证据](../analysis/vm-preparation-v1/host-inventory.json)。

**事实：** UTM列表中已有Win11CG、Win10CG和三个测试项。只查看了两个Windows候选的主界面元数据：均已停止、各4 GB内存，但路径位于`/Users/lx/.Trash/moli-mac/build/utm/`，均配置共享网络。没有恢复、复制、启动、删除或读其客户机内容。名称与备注不能证明系统干净、许可有效或没有账号材料。只在Downloads、当前项目moli及工作暂存目录顶层筛选镜像文件名，未发现ISO/VHDX等；这不证明其他目录没有镜像，也没有扫描私人目录或废纸篓内容。

**方案：** 复用已验证的UTM，准备新的空白ARM64配置；只有用户明确选择且可确认无敏感状态时，才另评估废纸篓旧系统的安全复用。首选Windows ARM硬件虚拟化；x86整机模拟留作有具体兼容证据后的备选，不同时安装第二套系统。

官方[ARM应用模拟说明](https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-x86-emulation)支持x86/x64用户态应用；[驱动限制](https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-troubleshooting-x86)意味着不能保证旧客户端、保护驱动和图形依赖可用。UTM 5.0已有实验性DirectX支持，不能再笼统称其不支持GPU；本轮未安装图形/guest工具或验证游戏图形。完整官方资料、版本差异及引用见[官方研究](../analysis/vm-preparation-v1/official-research.md)。

## 初始创建与隔离（历史配置，后续变更见末节）

新配置：`build/utm/MoliOffline-ARM64-20261025.utm`，在UTM侧边栏可见。仅本项目新配置被操作。

| 项目 | 实际状态及边界 |
|---|---|
| CPU / 内存 | ARM64、4核、8192 MiB、Hypervisor开启；没有扩大主机安全权限 |
| 磁盘 | 80 GiB内部稀疏qcow2；原文件/ID保留。VirtIO未被WinPE识别，现改NVMe；本轮安装器已识别80GB目标盘 |
| 启动保护 | UEFI和TPM 2.0开启；在新空白配置中选择了预加载Microsoft安全启动密钥。Windows内Secure Boot/TPM健康状态尚未验收 |
| 网络 | `Network=[]`，没有网卡、NAT、桥接、Host-only或端口转发 |
| 主机共享 | 剪贴板关闭、目录共享模式None、无主机目录路径、USB共享关闭 |
| 其他设备 | 无声音、串口、自定义QEMU参数；不挂相机、麦克风或真实主机磁盘 |
| 显示 | virtio-ramfb，未安装加速guest驱动；不宣称DirectX兼容 |
| 固件/安装器 | 先完成空白EDK II测试和只读CD安装器启动；现已从系统盘进入OOBE联网关口，正常请求关机后停止；未到桌面、未运行游戏 |
| 安装介质 | 第二内部qcow2设备，ImageType=CD、Interface=USB、ReadOnly=true；这是虚拟USB光盘，UsbSharing仍false |

[只读审计脚本](../scripts/check_vm_isolation.py)只读取64 KiB以内的config.plist及文件元数据，检查特定空白配置版本并拒绝未知键、缺字段、网卡、共享、外部磁盘与链接。它不启动VM、不读客户机盘内数据，也不证明运行时绝对隔离；不检查全部祖先目录链接，不能抵抗并发目录替换；UTM全局设置、运行时覆盖及检查后的更改不在证明范围。配置改变后必须复核，不能放宽检查只为得到通过。

以下为空白阶段历史复核命令；当前VM已有只读CD，旧策略会按预期拒绝。当前应使用本文末节NVMe核验器，不因拒绝修改旧策略。

```sh
PYTHONDONTWRITEBYTECODE=1 python3 scripts/check_vm_isolation.py \
  build/utm/MoliOffline-ARM64-20261025.utm
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s analysis/vm-preparation-v1 -p 'test_*.py' -v
```

**上一阶段UI状态（本轮结果见末节）：** 上一轮因用户改变UTM而暂停界面操作；本轮用户明确要求继续后，重新观察并通过`reset -s`正常关闭空白UEFI，随后导入只读安装CD并启动安装器。该阶段结束时VM仍运行、闲置在许可页，未点击“接受”，不是已停止或暂停。当时页面保留供条款确认；后续接受与安装结果见末节。

## 回滚与空间预算

**事实：** 空白固件测试停止后，已创建`build/utm/baselines/MoliOffline-ARM64-20261025-pre-os.utm`关机副本，4个文件共864,365字节，逐文件SHA256一致；qcow2结构检查`check-errors=0`、逻辑容量85,899,345,920字节。见[基线清单](../analysis/vm-preparation-v1/cold-baseline.json)。这仅为文件复制/校验通过，**不是恢复后启动验收，也不是已安装Windows快照**。

恢复方案：确认测试VM已停止，保留当前状态为另一副本；复制关机基线到新路径再通过UTM打开，复查隔离配置后验证固件。不要同时注册并运行具有相同UUID的副本，不覆盖旧VM。本轮没有执行恢复或删除任何基线。

后续Windows安装完成、未导入游戏时再建立操作系统基线。UTM快照不覆盖可移动/只读/外部盘，见[官方快照说明](https://docs.getutm.app/advanced/snapshots/)；完整回滚还须包含配置、EFI/TPM状态与内部磁盘的关机副本。容量按ISO约数GiB、80 GiB增长上限、至少一个关机副本预算，保留不少于约40 GiB宿主余量；这是工程预算，不是已占满虚拟磁盘。

## 已核验的安装介质与上一阶段许可停止点

已从[微软官方ARM64页面](https://www.microsoft.com/en-us/software-download/windows11arm64)生成下载链接，经Microsoft下载域名取得 `Windows11_Client_arm64_zh-cn_26300_9457.iso`，页面声明为Windows11 26H2 / 26300.9457 / 简体中文。文件8,852,006,912字节（约8.24 GiB），存于`build/iso/`并设为本地只读。

SHA256：`cd573df724862300895d0f5d0836e663756d22cc4e964c752efdc05b4fc09e8b`，与官网Chinese Simplified条目逐字一致。证据见[镜像清单](../analysis/vm-preparation-v1/windows-iso.json)。临时带签名的下载查询串不保存到文档；镜像不随源码交付。此清单是上一轮下载时的历史状态；本轮重新计算ISO SHA256一致后，通过UTM标准导入生成内部qcow2，并在保存/首次引导前改为只读CD/USB设备。QEMU 11.1.2 `qemu-img compare -f raw -F qcow2`退出0，显示Images are identical，证明逻辑镜像内容一致，不能把qcow2容器哈希当成ISO哈希。[介质核验](../analysis/vm-install-v1/media-validation.json)记录来源、大小、转换及比较。

**上一阶段停止点（此后第一次接受已成功）：** 简体中文Windows 11安装器已到“适用的声明和许可条款”，显示“微软软件许可条款 / WINDOWS 操作系统”，上次更新2024年4月。[截图](../analysis/vm-install-v1/license-boundary.png)、[UI观察](../analysis/vm-install-v1/ui-validation.json)。版别页实际有家庭版、家庭单语言版、专业版；保留默认家庭版仅用于查看条款，用户最终版别未确定。产品密钥输入为空，使用安装器自身的“我没有产品密钥”入口继续查看，没有激活绕过。未点击接受，未到磁盘分区或系统文件复制步骤。

上一阶段的下一动作“接受”需要用户针对实际条款明确确认，并确认所选版别/授权类型适用于此VM；不需要把密钥或密码发给助手。公开入口为[Microsoft License Terms](https://www.microsoft.com/en-us/useterms)，[已核查参考及适用边界](../analysis/vm-install-v1/licensing-research.md)。官网ISO可下载不等于具备许可；不默认为免费试用，不复用未核实旧VM许可证。该阶段当时是许可接受未获确认，并非工具审批挂起、自动审查拒绝或UI控制权仍阻塞；本轮状态已在末节更新。

## 下一步离线观察方案与停止条件

1. Windows安装介质必须从微软官方入口取得，记录具体文件、版本、语言、字节数及官网匹配SHA256；不得用预装第三方镜像、破解或激活绕过。Windows许可、实际EULA接受与首次设置账号步骤由用户确认；无需把产品密钥发给助手。
2. 必要的Windows首次设置联网与游戏联网是不同授权。本次临时NAT和必要官方ARM64网卡驱动已经具体获准，v5已观察网络连接；仅用于当前系统设置及必要官方服务，完成后恢复断网并复核。微软账号页停下交由用户，不读取或提交凭据；不用OOBE、TPM或安全检查绕过完成验收。官方UTM指南中的此类绕过建议不执行。
3. Windows就绪后先验证架构、系统版本、TPM/Secure Boot、磁盘和设备；用原创无网络小程序确认x86用户态运行，不能据此宣布游戏可用。安装guest工具或实验性图形组件前核对官方来源、签名、许可并再次检查共享开关。
4. 游戏安装及运行仍待来源/许可和具体授权。拟观察：在断网、不使用游戏账号、无自启动、独立回滚副本中，检查进程树、模块加载、命令行结构、文件路径和明确错误；不得记录账号值、完整内存或秘密。不开登录、不让更新器联网、不关闭反作弊或保护措施。
5. 优先解决已有静态问题：游戏是否消费所观察的启动参数/命名映射、实际加载哪个网络模块、在哪个阶段因无网络退出。任何账号票据、在线会话、解密/保护绕过要求都停止并返回目的及最小授权；现阶段不能承诺拿到完整游戏协议。

每次观察结束停止VM、核对无联网和无额外共享、按需回滚，提交去敏元数据及可追溯观察，再决定是否足以形成独立规格；不能把VM运行或远程串流当跨平台客户端成果。

## 上一阶段双盘VirtIO核验及资源变化

**事实：** 双盘配置SHA256为`1206383b36fc281a3d98ce6f00180931bde52a2780bca4f5687d23d0565cd9fd`；无网卡、剪贴板/目录/USB共享关闭，只有原内部系统盘及只读安装CD。新增转换盘文件8,849,653,760字节、实际分配8,863,744,000字节；与原ISO并存，额外占约8.25 GiB。本轮末宿主余244,940,800,000字节（约228.12 GiB）。8 GiB是VM配置分配，不是实测驻留内存。

原系统盘未替换，起始大小及SHA256保存在`before-install.json`；安装器引导后qcow2文件由197,888增长到393,216字节，哈希改变，不能声称本轮结束磁盘字节不变。尚未区分客户机写入与qcow2元数据变化，也未进入分区或复制页面；运行中采样不是原子快照。[边界采样](../analysis/vm-install-v1/installation-boundary.json)。原关机基线保持不变，不能用运行中的磁盘创建“干净已安装系统”基线。

```sh
PYTHONDONTWRITEBYTECODE=1 python3 analysis/vm-install-v1/verify_media_config.py \
  --bundle /Users/lx/Documents/code/moli-mac/build/utm/MoliOffline-ARM64-20261025.utm \
  --baseline analysis/vm-install-v1/before-install.json
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s analysis/vm-install-v1 -p 'test_*.py' -v
```

本轮固定双盘策略30/30通过，原创负例测试4/4通过。旧空白核验器继续保留且会拒绝新增CD，属于版本策略预期差异；旧73/73是历史验收，未改门槛伪造当前通过。配置核验不证明guest系统隔离或运行时绝对安全。

UI复现：空白固件正常关机→UTM标准导入ISO→将导入盘改为只读CD/USB→保存/审核→启动→若进入Shell，`exit`进入Boot Manager选择QEMU USB设备→及时按键从CD启动→简体中文/微软拼音→安装选项（仅本项目可恢复空白盘）→暂不输入密钥→默认家庭版仅预览→许可页停止。部分鼠标点击没有效果，短键盘加速键及80ms单键输入有效；首次CD提示超时后通过同一启动菜单成功。不得为跳过要求修改固件、安全或OOBE设置。

## 上一阶段：条款接受、存储缺口与第二次审批拒绝（历史）

**事实：** 重新观察仍为此前简体中文“微软软件许可条款 / WINDOWS 操作系统”、更新时间2024年4月。按用户本次明确同意执行接受，安装器随后进入“选择安装Windows 11的位置”，证明第一次接受实际完成。没有验证用户许可证或激活；版别沿用家庭版默认，密钥输入仍为空。许可入口：[Microsoft License Terms](https://www.microsoft.com/en-us/useterms)。

**事实：** VirtIO模式磁盘列表为空；内置WinPE的`diskpart`只执行`list disk`、`exit`，报告没有固定磁盘。未执行clean、format、partition或属性更改。WinPE命令窗口显示10.0.26100.9457、DiskPart10.0.26100.1；这与下载页面/文件名的26H2/26300.9457标识属于不同层次，不能据此宣布安装后的OS版本，差异来源未核实。[空磁盘页](../analysis/vm-install-v2/virtio-no-disk.png)、[诊断截图](../analysis/vm-install-v2/virtio-list-disk.png)。

**处理与边界：** 通过`wpeutil shutdown`正常关机并确认UTM已停止。仅把原系统盘Interface从VirtIO改为NVMe，不替换、转换、格式化或扩大磁盘；新配置精确差分确认只有该字段变化，网络/共享/固件安全设置完全相同。[配置差分](../analysis/vm-install-v2/nvme-config.json)。微软文档说明StorNVMe为[系统自带驱动](https://learn.microsoft.com/en-us/windows-hardware/drivers/storage/nvme-features-supported-by-stornvme)，所以以此进行标准接口兼容尝试；这不是已证实本VM可用。UTM[Windows指南](https://docs.getutm.app/guides/windows/)通常提供guest驱动介质，但本轮未下载/安装驱动、未关闭签名检查或Secure Boot。来源边界见[研究摘要](../analysis/vm-install-v2/storage-research.json)。

**上一阶段精确阻塞：** NVMe配置再次成功引导同一微软安装器，继续默认家庭版，重新核对仍是同一2024年4月条款。此时`Alt+A`接受动作被自动审批审查拒绝，理由是该动作形成法律/许可承诺，审查未将现有代理转交的确认认定为具体授权。该次动作未执行；没有换成鼠标、脚本或其他输入方式重试。第一次接受成功与第二次拒绝必须分别报告。[完整步骤](../analysis/vm-install-v2/ui-validation.json)、[当前页面](../analysis/vm-install-v2/license-action-blocked.png)。不是等待中的工具调用或不确定写入。

该阶段结束时VM仍运行并闲置在许可页，无网卡、目录/剪贴板/USB共享关闭。没有进入NVMe下的目标盘列表，因此当时NVMe客户机识别仍待验证；Windows未安装，未到OOBE、没有账号/凭据/游戏/服务器操作。该阶段最小下一步是解决该次具体许可接受确认，随后验证80GiB安装目标盘；若仍缺驱动或要求联网/登录，再返回准确关口。不得用安装器启动、配置核验或首次条款接受充当系统安装验收。

### v2阶段配置复核（当前同一策略的重跑见末节）

```sh
PYTHONDONTWRITEBYTECODE=1 python3 analysis/vm-install-v2/verify_nvme_config.py \
  --bundle /Users/lx/Documents/code/moli-mac/build/utm/MoliOffline-ARM64-20261025.utm
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s analysis/vm-install-v2 -p 'test_*.py' -v
```

当前固定NVMe策略38/38检查、4/4原创测试通过；根任务实际重跑。它复用前版有界读取/schema，仅接受固定原配置加系统接口改为NVMe，拒绝旧VirtIO、额外设备、可写CD、网络/共享与外部路径。前两版工具及历史证据保持不变；它们对当前新增配置按设计拒绝。配置SHA256为`f93fc4e4da000f9738212ef6cd1ba1ee5968bcea441fd273b81c8d2324231d16`。当时系统盘文件393216字节是元数据观察，不是磁盘完整性或客户机写入内容证明。仍未建立Windows安装后关机基线，原空白关机基线保留且未做恢复启动。

## v3历史：NVMe识别与正常Windows安装

**事实：** 本轮用户提供对具体重启后条款接受的新确认，但操作前重新观察发现安装器已经越过许可页，显示唯一“磁盘0 未分配空间 80.0GB”。因此没有重试被拒动作，不把页面推进归因于助手或用户。既有首次接受成功、后续拒绝未执行的记录仍成立；[NVMe实际识别截图](../analysis/vm-install-v3/nvme-disk-visible.png)是新状态证据。

配置SHA256仍为`f93fc4e4da000f9738212ef6cd1ba1ee5968bcea441fd273b81c8d2324231d16`，只有原内部NVMe系统盘和只读USB CD，无网卡、主机共享或自定义QEMU参数。没有换盘/改安全保护。安装确认页明确“Windows 11家庭版”“不保留任何内容”，只作用于本项目新建空白盘；[确认页](../analysis/vm-install-v3/install-ready-home.png)。随后实际启动正常安装并观察11%、33%、55%进度；进度不是环境就绪验收。

微软[系统要求](https://www.microsoft.com/en-us/windows/windows-11-specifications)说明Home及个人用途Pro在首次设置时需要互联网和Microsoft账号，见[来源记录](../analysis/vm-install-v3/oobe-requirements.json)。这是公开要求，不新增给VM联网/登录/传输凭据的授权。本轮实际页面与该要求一致，具体如下。


### 实际OOBE停止点与版本

**事实，高置信度：** 安装器自动重启，固件显示从内部HD上的Windows Boot Manager加载，随后进入OOBE地区页。正常选择中国、微软拼音、跳过第二键盘后，出现“让我们为你连接到网络”，明确需要Internet才能继续，“下一步”灰色，无可见离线选项。见[实际页面](../analysis/vm-install-v3/oobe-network.png)。没有添加网卡、安装驱动、联网、创建/登录账号或输入密钥；未使用OOBE、激活或安全检查绕过。

**事实：** 在此系统盘启动的OOBE中按Shift+F10，窗口路径`C:\Windows\system32\cmd.exe`、banner显示`10.0.26300.9457`。[版本截图](../analysis/vm-install-v3/oobe-system-version.png)。它不同于之前安装介质WinPE的`10.0.26100.9457`，两个观察均保留。家庭版由安装确认页证实；桌面内版别/架构、激活和许可证适用性尚未验收。只读架构命令的文本没有可见输入/输出，因此不计为已执行或成功。

**关机事实：** 命令输入未见生效，未宣称`shutdown`执行。UTM工具栏“停止”显示强制停止警告后已取消；随后选择菜单“虚拟机→电源→请求关闭电源”。最终UTM显示播放/开始、停止禁用，输入捕获已释放，确认停止。[关机截图](../analysis/vm-install-v3/stopped-after-oobe.png)。未强制关机，没有待运行的安装/审批工具调用。

### 关机后复核、资源占用及下一步

同一v2固定配置策略重跑**38/38通过**，配置hash未变，系统盘/CD身份一致，Network为空、目录/剪贴板/USB共享关闭。[结果](../analysis/vm-install-v3/final-config-audit.json)。系统qcow2现为17,742,561,280字节，实际分配17,692,557,312字节（约16.48GiB）；这是安装后的元数据，不是字节完整性验证。CD仍为8,849,653,760字节；宿主df此时可用227,328,000,000字节（约211.72GiB），可能受其他主机活动影响。8GiB仍只是配置分配，未测驻留内存。当前系统盘已写入Windows，不能再称空白盘。

**v3当时待授权（v4已授权NAT/必要驱动）：** 要沿当前Home正常流程完成OOBE，需要临时给该VM添加联网能力，可能还需来源核验后的网卡驱动；这会改变当前无网络隔离边界。联网后Windows可向微软安装/更新服务发送设备和网络信息，具体字段尚未观察；若出现账号页面，应由用户亲自处理账号及凭据。需确认具体网络范围与回收时点，主机共享保持关闭，游戏服务连接仍禁止。当前不是自动审查拒绝或工具挂起，而是实际安装流程超出当前离线授权。

**未完成：** OOBE/桌面、guest架构和设备健康、TPM/Secure Boot、x86原创样例、驱动/图形、许可证/激活、官方游戏动态分析及联机。原空白关机基线保留并复核；未建立完成Windows的基线、未恢复启动。当前正常停止的盘保留安装进度，未来获授权继续前先核对实际UI/配置；只有桌面和隔离验收后才建立并标注干净OS基线。完整步骤见[过程记录](../analysis/vm-install-v3/progress-observations.json)。


## v4历史：临时NAT授权、驱动准备与设备入口拒绝

**事实：** 用户明确要求安装驱动并给本项目VM开NAT；“主机直接共享”按网络上下文处理，没有具体主机文件目录授权。仅允许这次OOBE及必要官方驱动/系统服务，完成后恢复断网；不桥接/端口转发，不开启主机目录、剪贴板或USB共享，到微软账号页停止让用户处理。UTM的Shared/NAT仍可能使guest访问宿主网络服务，不能把目录共享关闭解释为网络上绝对隔绝宿主。来源见[网络与驱动研究](../analysis/vm-install-v4/network-driver-research.md)。

**实际UI结果：** 本轮开始UTM显示该VM运行在OOBE；双击注册项曾报文件不存在，但窗口菜单中的原控制台可以正常选择，实际仍是联网关口。原因未确认，没有替换文件或恢复旧VM。通过该控制台菜单请求正常关机并确认停止，随后只打开项目VM设置。尝试点击“设备”分组的“新建…”以显示设备类型菜单时，自动审查认为控件紧邻“显示”，不能确认是网络入口，因此拒绝且未执行；重新查看截图和完整AX后，对同一入口重试一次仍被拒。已停止该动作，取消设置未保存，没有改用脚本/其他入口绕过。[画面](../analysis/vm-install-v4/device-menu-blocked.png)、[逐次记录](../analysis/vm-install-v4/ui-validation.json)。

**v4结束时网络状态：** NAT动作已经获用户授权，但未实际发生；不是需要重新确认NAT用途。VM现在已停止，`Network=[]`，配置SHA256仍为`f93fc4e4da000f9738212ef6cd1ba1ee5968bcea441fd273b81c8d2324231d16`，无共享/额外设备，固定策略复核38/38通过。[结果](../analysis/vm-install-v4/final-config-audit.json)。没有到新的账号页、没有账号/凭据/游戏操作；没有挂起工具调用。

### 官方驱动材料与验证边界

本机已核验的UTM 5.0.8(128)内含官方滚动地址`https://getutm.app/downloads/utm-guest-tools-3d-latest.iso`。本轮HTTPS重定向到[UTM官方qemu v10.0.12-utm的0.1.274介质](https://github.com/utmapp/qemu/releases/download/v10.0.12-utm/utm-guest-tools-0.1.274.iso)，HTTP200下载143,898,624字节，SHA256 `ab6add47a4ed992f5920f14e96f68d60566e6f731e2cf816c3d38ab2b78f407a`。未取得单独发布者校验值，因此此hash绑定本轮下载内容，不称官网hash匹配。[来源及下载回执](../analysis/vm-install-v4/driver-media.json)。滚动latest不能当作固定版本名称。

ISO以只读、不打开Finder方式挂载，仅静态取出`Drivers/NetKVM/w11/ARM64`，随后已正常卸载。INF声明`DriverVer=01/13/2025,100.100.104.27100`，目标`NTARM64.10.0...16299`，列出VirtIO网络设备`VEN_1AF4`下`DEV_1000/1041`；SYS及附带PE均为机器类型`0xaa64`。INF要求复制`netkvm.sys`和`netkvmp.exe`，没有执行EXE、脚本或整套Guest Tools。包hash、INF行号及架构见[包证据](../analysis/vm-install-v4/netkvm-package.json)。这只支持包针对ARM64和相应设备，尚不证明当前guest可安装或联网。

CAT可由OpenSSL 4.0.3 PKCS7解析，signer序列号对应证书主体`Microsoft Windows Hardware Compatibility Publisher`、签发者`Microsoft Windows Third Party Component CA 2014`。**只解析身份不是签名/信任验证通过。** OpenSSL CMS通用验证器对该CTL编码返回wrong tag（退出2）；它是工具格式限制，不作驱动签名无效判断。证书有效期及指纹已记录，时间戳、链、撤销和catalog成员验证未完成；不能仅凭证书日期判断带时间戳驱动的接受结果。以后必须依赖Windows正常驱动信任检查；任何拒绝均停止，不关闭签名强制、Secure Boot等保护。

只含NetKVM目录8文件及原`virtio-win_license.txt`的本地非启动ISO已制作，9文件逐字节回读一致，无autorun/unattend、SPICE共享agent或图形组件。大小3,006,464字节、SHA256 `52a8cb592fee39d0f8e487563075f183f2d786848c3bc06d11e32d79c3afe4c4`。两份介质均以0444保存于`build/drivers/utm-guest-tools-0.1.274.iso`和`build/drivers/netkvm-w11-arm64-0.1.274.iso`，原许可材料仅在本地介质内保留；不进入源码交付。未挂到VM、未安装、未下载无关驱动。以后正常INF安装可能复制其必要辅助程序，不能把“不运行整包安装器”说成只有SYS文件。

**v4当时下一步（已由v5推进）：** 对设置中“设备→新建…”这一具体类型选择入口解决确认或由用户打开类型菜单，再选择网络并核对仅Shared/NAT、无桥接/转发；不再凭现有证据重复被拒动作。之后再挂最小只读驱动盘、让Windows正常选择INF并验证设备/网络。若进入微软账号页立即停止，尚无桌面完成或游戏兼容证明。

### 其他虚拟机清理候选（v4历史；请求现已撤销）

用户要求清理无关VM，当前先盘点具体候选，未删除/移动/移除注册。当前UTM逐项显示Win11CG、ImportTest、Bisect1、Bisect4、Win10CG均已停止，注册路径全部位于`/Users/lx/.Trash/moli-mac/build/utm/`。名称、完整路径、显示大小和证据边界见[候选清单](../analysis/vm-install-v4/cleanup-candidates.md)及[JSON](../analysis/vm-install-v4/cleanup-inventory.json)。文件系统列举该Trash目录被系统权限拒绝，未重试、改变权限或改读子路径；因此UI注册路径不等于实际文件存在证明，实际占用、共享磁盘依赖仍待确认，不汇总为可释放空间。当前项目`build/utm`只发现应保留的项目VM和baselines。清理UTM注册项与永久清空废纸篓是不同动作，须先确认具体目标。

## v5：NAT、只读驱动介质及Windows联网

**事实，高置信度：** 用户针对先前被拒的“设备→新建…”入口提供新的具体确认后，同动作只重试一次并成功。通过正常UTM设置新增`virtio-net-pci`，`Mode=Shared`、`PortForward=[]`；只改变Network节，主机目录、剪贴板、USB共享继续关闭。Shared/NAT的`IsolateFromHost=false`，不能称完全隔绝宿主网络。见[NAT画面](../analysis/vm-install-v5/nat-settings.png)、[配置差异](../analysis/vm-install-v5/nat-config.json)。未换路径绕过此前拒绝。

随后导入已核验的最小NetKVM ISO，添加第三块只读USB虚拟CD，UTM转换为`netkvm-w11-arm64-0.1.274.qcow2`，3,342,336字节，SHA256 `532a8190e967ecd58deee6ee411fa3b3fed4d84cfcb06c39da3e0d1e28d0f4bc`。原NVMe系统盘、Windows安装CD完整配置以及其余节不变。qemu-img的raw→qcow2逻辑比较退出0，`Images are identical.`；这是逻辑字节相同，不是容器hash相同。初次检查误以为UTM保留.iso扩展名而触发断言，观察转换后修正检查，没有为通过修改配置。见[驱动CD配置](../analysis/vm-install-v5/driver-cd-config.json)、[独立重比结果](../analysis/vm-install-v5/post-interruption-config.json)。

**界面协调与恢复：** 项目VM启动后，UTM被人工切到另一新建流程，工具返回用户改变应用；重读见x86_64客户机与arm64映像不匹配提示。当时暂停，没有取消用户表单、创建第二台VM或改动其配置。后来重新观察已回到原项目OOBE，且用户确认继续ARM尝试，随后恢复原任务。中间[主窗口画面](../analysis/vm-install-v5/user-ui-interruption.png)只作为协调记录，不能据预览判断实时guest完成状态。

**驱动与实际网络观察：** Windows“安装驱动程序”的目录选择器中实际显示`E: MOLI_NETKVM`，同时存在原D:微软安装盘和C:系统盘。通过正常入口选择E:根目录，先出现“正在搜索和安装新驱动程序”，随后网络状态为“已连接”，“下一步”启用。选择下一步后进入系统更新检查。[联网截图](../analysis/vm-install-v5/oobe-network-connected.png)。未出现需要绕过的签名警告，没有关闭任何安全控制或运行整套增强包；这证明正常安装路径后网卡可用于当前OOBE，不替代设备管理器版本、完整签名链/时间戳/撤销或全部驱动健康验收。页面仍显示“找不到网络驱动程序”辅助入口，保留完整截图，不隐藏该文字。

旧VM清理已由用户明确撤销并表示自行处理。此前Win10CG移除快捷方式入口被自动审查拒绝且未执行，未重试；本项目没有成功取消注册、删除或清空废纸篓，之后不再读取Trash。不能声称释放了空间，历史候选表不再是待办。

产品代码/协议结论不变；原空白基线未覆盖，未创建完整Windows基线。媒体接入后配置SHA256为`97cb2df7e4554cb742d6026ab02388f4333b847c75620a7c5798e2de585c3ce8`。本次中途磁盘余量271,564,800,000字节，仅是采样，不能归因于助手清理。当前v2固定无网卡双盘策略不适用临时三盘NAT配置，未放宽旧策略。

v5最终OOBE交接点与未完成收尾见下文。

### 实际客户端架构与路线门槛

本轮只读复核12个PE hash/架构、7处旧API字节及DirectDraw导入，均与固定样本证据一致。三枚游戏为x86 PE32；清单无.sys/.inf/.cat不是无内核依赖证明，DeviceIoControl、保护载荷和未解出的ApexClient.Dat仍须区别处理。详见[兼容证据](../analysis/vm-install-v5/arm-client-compatibility.md)。用户了解ARM与x86取舍后确认继续现VM，未要求切换架构。

ARM特有停止条件是确认必需内核组件只有x86/x64版本且无合法ARM64替代；不得关闭签名/安全控制来修补架构。一般OOBE/驱动缺失、签名信任、旧DLL/图形问题分别诊断，只对有证据的普通依赖作有针对性的修正，同错误无新证据就收口。当前virtio-ramfb无实验图形驱动，未验收DirectDraw或游戏；x86整机模拟只是有条件备选，不创建第二VM或换入不匹配ISO。

系统更新流程观察到第1/3步完成、进入第2/3步下载；在约14%时使用安装器公开提供的“稍后更新”及其确认入口，Windows正常重启继续OOBE。完整更新仍未完成，后续需通过正常Windows更新验收；没有修改注册表、禁用更新服务、关闭安全控制或绕过OOBE。见[正常延后更新画面](../analysis/vm-install-v5/oobe-normal-defer-update.png)。

### v5本轮最后确认与交接

**首次账号交接点：** 正常“稍后更新”重启后，UI观察显示“使用密钥登录”“安全密钥”“login.microsoft.com 的通行密钥”。已经停止全部客户机界面操作，通知用户亲自完成账号步骤；没有点击账号认证、输入或读取密码/密钥、获取会话，亦不推断该页如何选择到通行密钥方式。此为用户身份验证交接，**不是工具审批拒绝或正在等待NAT批准**。为避免读到用户随后输入的账号材料，没有继续截图/检查登录流程。

系统设置尚未完成，VM最后确认仍在运行；NAT保留在当前获准的Windows设置范围内，**尚未恢复断网**。保存配置hash仍为`97cb2df7e4554cb742d6026ab02388f4333b847c75620a7c5798e2de585c3ce8`，Network仍单枚Shared、无端口转发，目录/剪贴板/USB共享仍关闭。[交接时配置和资源采样](../analysis/vm-install-v5/account-handoff-config.json)。只读元数据采样：系统qcow2约22,294,822,912字节，主机可用269,926,400,000字节；运行盘未做完整hash或冷快照。

下一步先尊重用户当前账号操作与不绑定账号的偏好：确认是否继续正在进行的正常登录，或在界面空闲时核对安装器可见的跳过/离线/本地账户入口；此版本具体入口未确认，不要求用户必须使用个人账号。取得可继续的桌面后，再验证实际驱动版本、设备健康、系统版本/安全状态；补做正常系统更新，在本次设置结束后安全关机、恢复无网卡并复核，最后才能建立已就绪Windows冷基线。当前不能标环境完成，也不尝试用离线绕过结束OOBE。完整动作结果见[UI记录](../analysis/vm-install-v5/ui-validation.json)，配置/介质/保留文件及链接检查见[集成回执](../analysis/vm-install-v5/stage-validation.json)。

用户后续询问能否跳过登录，并明确倾向不绑定微软账号，已授权检查正常界面选项。重新观察账号引导页可见“登录”，未见跳过/本地选项，但页面覆盖不足；尝试滚到顶部时工具报告用户改变UTM，该动作未发送，随后截图超时并重置内核。恢复只读观察后已到邮件验证码步骤，没有发送验证码、填写账户或提交认证，亦未保存该账号页截图或标识。停止界面检查以免打断正在进行的操作。正常离线入口结论是“尚未核验”，不是“肯定没有”；未用脚本、注册表、断网故障或安全检查绕过强制推进。此处为界面协调/工具超时，不是新的自动审批拒绝。

## v6：实际桌面与驱动核验，正常更新重启后的交接

**事实，高置信度：** 用户自行完成Windows登录后，已观察真实桌面，未见剩余OOBE提示。用无profile PowerShell将提示符先移到`C:\`，只采集选定系统字段。CIM返回`Microsoft Windows 11 家庭版`、`10.0.26300`、`ARM 64 位处理器`；后来`cmd /c ver`直接报告更新前完整构建`10.0.26300.9457`，没有把旧banner补填为新结果。见[系统身份](../analysis/vm-install-v6/windows-edition-architecture.png)、[完整构建](../analysis/vm-install-v6/windows-full-build.png)、[命令及结果](../analysis/vm-install-v6/guest-observations.json)。

**网卡事实：** Get-NetAdapter显示`Red Hat VirtIO Ethernet Adapter`、`100.100.104.27100`、`Up`；Win32_PnPSignedDriver返回同版本、IsSigned=True、Signer=`Microsoft Windows Hardware Compatibility Publisher`，与v4 INF一致。见[实际网卡](../analysis/vm-install-v6/netkvm-version.png)和[Windows签名元数据](../analysis/vm-install-v6/netkvm-windows-signature.png)。这补齐实际版本和OS签名字段，不等于独立验证完整catalog成员、时间戳/撤销或所有设备健康。

**设备缺口事实：** Win32_PnPEntity非零问题记录36项，分组名称`CM_PROB_FAILED_INSTALL`。具名三项为PCI简单通讯控制器`VEN_1AF4/DEV_1003/SUBSYS_00031AF4/REV_00`、PCI设备`DEV_1005/SUBSYS_00041AF4/REV_00`、视频控制器`DEV_1050/SUBSYS_11001AF4/REV_01`。见[数量](../analysis/vm-install-v6/device-error-count.png)、[精确标识](../analysis/vm-install-v6/device-pci-details.png)。HardwareID数组分组显示首项LNR0005，但语义未闭合，不能把全部36项归成同一种设备。TPM只读命令返回“需要管理员权限”，未取得健康结果；没有为此改变TPM、安全启动或签名控制。

**已完成的驱动准备，未安装：** 只读重核UTM官方0.1.274原介质hash，并静态匹配vioserial、viorng、普通viogpudo三个ARM64包。实验viogpu3d也匹配1050，且另增自动服务及图形设置，因此不对整张盘递归安装。当前仅制作`/tmp/moli-base-drivers-w11-arm64-0.1.274.iso`，921600字节、0444、SHA256 `fc1c1b35f8fc5f9fac36f5119f16de6170044bc6f06a8ff7eabce4f4169bc3c6`；只含viorng/和普通viogpudo/及原许可，共8文件，回读hash全部相同，无vioserial/SPICE/3D/autorun。viorng还注册随机数提供程序，不能称只复制SYS。没有挂入VM、安装或写入项目build；CAT身份解析不替代Windows正常信任检查。见[驱动候选与影响](../analysis/vm-install-v6/device-driver-candidates.md)、[介质回执](../analysis/vm-install-v6/base-drivers-media.json)。ISO只读挂载均已正常卸载。

**PIN分支已结束：** 系统查询中曾意外回到PIN页，立即暂停；用户随后自行解锁并短暂要求减少自动锁定。实际电源页已是关闭屏幕=从不、睡眠=从不，助手未修改。打开登录选项后界面工具超时，重连时回到PowerShell；随后用户表示PIN设置已完成并要求停止此分支。没有修改PIN/密码、锁屏、睡眠、唤醒登录、账号或自动登录，也不继续核验用户具体改动。原部分版本查询仍在输入缓冲，已Ctrl+C取消，没有执行。账号页/标识/凭据没有保存到工程。

**正常更新与当前阻碍：** Windows Update显示“需要重启（预计3分钟）”，通过其“立即重新启动”按钮正常推进，观察到27%，之后“第1阶段（共2阶段）100%”，再自动回到Windows锁屏及PIN登录页。见[更新进度](../analysis/vm-install-v6/windows-update-27.png)。这证明正常重启到登录界面，不等于所有更新成功或重启后桌面验收；更新后版本、历史和余下任务仍需用户亲自登录后检查。已请求用户在VM输入PIN，不在聊天发送；助手停止输入，不改其登录设置。此为认证交接，**不是自动审批拒绝或尚待NAT批准**。

**终态与恢复边界：** 已保存配置仍为`97cb2df7e4554cb742d6026ab02388f4333b847c75620a7c5798e2de585c3ce8`，单枚Shared/NAT、无端口转发、主机目录/剪贴板/USB共享关闭；网络尚未恢复离线。见[更新期间配置](../analysis/vm-install-v6/during-update-config.json)。新[固定三盘离线核验器](../analysis/vm-install-v6/verify_offline_config.py)10项合成测试通过，当前21项中仅Network失败，正确拒绝NAT；旧策略未放宽。它只查配置/元数据，不证明运行状态或客户机健康。UTM旧备注仍写初始空白状态，只是历史标签。

Windows关机基线未创建，原pre-os空白副本保留。完成更新后检查、必要设备处理、正常关机及移除本VM网卡后，才可重新核验并创建私有Windows恢复副本。用户已登录Windows，因此未来副本可能含身份状态，不能称无账号干净镜像、上传或分发；恢复复制/hash一致也不等于实际恢复启动通过。当前不能把环境标为全面就绪。

下一次游戏实验已收窄为[固定五文件、唯一EXE的单次无参数加载观察](../analysis/vm-install-v6/client-experiment-plan.md)：`cg_se_3000.exe` SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126`，最多90秒、普通权限及有限元数据。来源认证、游戏许可、Windows身份风险和该具体执行仍需单独确认；没有导入或运行这五个文件，不执行Setup/登录器/更新器，不连接游戏服务。成功窗口也不证明协议或官方可玩性。

## v7：更新后桌面、恢复断网和四盘驱动介质

**事实：** 用户要求继续后，重新观察到真实桌面。`cmd /c ver`返回`10.0.26300.9711`，说明v6更新后的正常启动及桌面恢复已观察，不再沿用9457为当前构建。[版本截图](../analysis/vm-install-v7/post-update-build.png)。桌面显示激活提示；未操作激活、核实许可证或输入密钥。

**事实：** 设备查询仍为36项非零问题，实际本轮分组显示代码`28`；三项具名PCI标识与v6相同。[数量](../analysis/vm-install-v7/post-update-device-count.png)、[硬件标识](../analysis/vm-install-v7/post-update-device-ids.png)。不能称设备问题已解决。Windows更新页仍显示可用更新，说明会随下一次累积更新自动安装；未显示待重启。具体剩余更新清单/类别未确认，未再次安装更新、暂停更新服务或关闭保护。

**界面过程及限制：** 查看更新说明时Tab+Space意外进入Edge首次欢迎/同步页面，原焦点不确定。未接受同步、登录或导入，未输入凭据；该含账号页面没有保存为工程截图。普通关闭/返回桌面快捷键无可见效果，未将其记为成功。通过UTM“请求关闭电源”正常关闭，界面明确显示已停止，未使用强制关机。见[操作记录](../analysis/vm-install-v7/guest-observations.json)。

**隔离恢复事实：** 停止后只移除本项目Shared/NAT网卡并保存，三盘固定策略21/21通过。随后通过UTM标准Import导入已核验最小ISO为第四内部只读CD/USB：`moli-base-drivers-w11-arm64-0.1.274.qcow2`，ID `897A5D83-11BC-44A2-AEE4-F0B510C006DE`。可移动光盘创建弹窗未产生有效结果，取消后使用Import；未创建额外可移动设备。新配置相对开始只改变Network和追加Drive，原三盘完整字段不变；主机共享、安全选项保持。配置SHA256 `c7c980a646028c867429f2bc047361bcc92e9e396d871c1b438f1e58c14f8743`。[差分](../analysis/vm-install-v7/offline-driver-cd-config.json)。新增光盘是虚拟USB设备，并非开启主机USB透传。

**介质事实：** 原ISO SHA256 `fc1c1b35f8fc5f9fac36f5119f16de6170044bc6f06a8ff7eabce4f4169bc3c6`重核一致、保持0444。qemu-img compare退出0且`Images are identical.`；转换后的qcow2容器720896字节，不能拿其容器hash当ISOhash。4块盘的qemu-img info --backing-chain均返回单项且无backing-filename；只检查头部，未挂载guest文件系统或读取凭据。[比较与磁盘依赖证据](../analysis/vm-install-v7/media-and-backing-check.json)。

**当前停止点：** 断网启动已到PIN页，登录由用户亲自完成，助手未尝试凭据、不改PIN设置。随机数/普通DOD显示驱动**尚未安装**。四盘配置[22/22通过](../analysis/vm-install-v7/four-drive-config-audit.json)，这是保存配置与文件元数据核验，不能替代guest健康、运行时网络抓取或兼容验收。旧三盘v6规则保持原样，按设计拒绝第四盘。

**恢复准备：** 新[私有冷副本脚本](../analysis/vm-install-v7/create_cold_baseline.py)固定七文件（config、四盘、EFI、TPM），默认仅preflight；复制须新鲜关机记录、名称/UUID/config hash绑定、无打开文件、最坏完整复制容量加40GiB余量。新增策略12项＋复制脚本17项合成测试通过，根任务29项复跑通过；副本尚未创建或启动。脚本拒绝覆盖，失败保留部分目录待检查，目录0700/文件0600；cp -c可能回退普通复制，不宣称已证明共享区块。见[审查](../analysis/vm-install-v7/cold-baseline-review.md)、[测试](../analysis/vm-install-v7/root-tests.log)。未来副本含用户Windows身份状态，只能本地私有保存，不称无账号镜像，不上传/分发；原pre-os基线保留。

下一步仍是用户解锁→确认两项必要驱动的正常签名安装→设备与显示复查→正常关机→四盘隔离核验→私有关机副本。TPM/Secure Boot健康、系统激活、全部更新、x86探针、恢复启动和游戏兼容仍待验收；游戏未运行，游戏服务未连接。

## v8：输入恢复、必要驱动和私有Windows关机副本

**事实：** 用户报告PIN框无响应后，重新置前本项目窗口，开启UTM输入捕获，Space可打开登录输入。收到本次特定登录确认后仅提交一次并成功进入桌面；没有记录凭据值、剪贴板传递、自动登录配置、PIN设置修改或授权复用。**推测：**窗口焦点/捕获参与了问题，但未证明唯一根因，不能归因于ACPI设备。见[输入观察](../analysis/vm-install-v8/input-observations.json)。

**事实：** 正常Microsoft Windows发布者的UAC后，在无profile管理员PowerShell中确认E:为`MOLI_BASEDRV`、F:为`MOLI_NETKVM`；盘符与前轮不同，未猜测。仅执行`pnputil /add-driver E:\viorng\viorng.inf /install`及`pnputil /add-driver E:\viogpudo\viogpudo.inf /install`。两包成功添加为oem3.inf/oem4.inf，正常Windows签名检查没有拒绝，未观察到要求重启；未安装vioserial、SPICE、实验3D或全盘递归驱动。原介质/hash身份沿用v6/v7核验，未改变安全控制。

| 当前设备 | 实测版本 | OS签名/当前状态 |
|---|---|---|
| VirtIO RNG Device | 100.100.104.27100 | IsSigned=True，Microsoft Windows Hardware Compatibility Publisher；PresentOnly=OK |
| Red Hat VirtIO GPU DOD controller | 22.7.38.43 | 同上；PresentOnly=OK，控制台持续可见且分辨率变化 |

[安装及查询记录](../analysis/vm-install-v8/guest-observations.json)、[签名字段](../analysis/vm-install-v8/driver-signatures.png)、[设备状态](../analysis/vm-install-v8/installed-device-status.png)。OS签名字段不等于独立完整链/撤销验证；基础显示可用不等于DirectDraw、3D、x86模拟或游戏通过。安装后未重启再登录。

**未通过/待验证：** CIM问题由36减至34，仍代码28。PresentOnly分组为32个`LNRO0005`、1个`QEMU0002`、1个VirtIO串口1003；原截图为8位LNRO0005，早先聊天漏O已纠正。官方QEMU定义分别对应virtio-mmio传输节点与fw_cfg，但本VM的实际后端/必要性未全部核实；UTM所查脚本在ARM64跳过qemufwcfg，未强装。v6 INF负搜索漏O，不能作正确ID无驱动的证明，历史证据保留并限缩。详见[剩余设备研究](../analysis/vm-install-v8/remaining-device-research.md)。

**安全健康：** `Confirm-SecureBootUEFI`返回True；`Get-Tpm`在管理员终端仍返回内部错误HRESULT 0x80284001，未取得健康字段。没有清除、初始化或改动TPM、Windows Hello、安全启动、签名强制等。此失败是技术未验收项，不是工具审批拒绝。激活、全部更新完成、TPM健康及完整硬件健康不标通过。[截图](../analysis/vm-install-v8/secureboot-state.png)。

**关机与隔离事实：** 通过UTM“虚拟机→电源→请求关闭电源”正常关闭，随后开始/播放可用、停止/重启禁用；未强制断电。保存配置仍为SHA256 `c7c980a646028c867429f2bc047361bcc92e9e396d871c1b438f1e58c14f8743`，Network空，目录/剪贴板/USB共享关闭，四盘22/22通过。4枚qcow2头部各为单项链、无backing文件；未挂载guest文件系统。[界面与绑定](../analysis/vm-install-v8/final-ui-state.json)、[配置审计](../analysis/vm-install-v8/four-drive-config-audit.json)、[磁盘依赖](../analysis/vm-install-v8/disk-backing-check.json)。

**冷副本已实际完成：** `build/utm/baselines/MoliOffline-ARM64-20261025-windows-v8.utm`，7文件共38,027,612,093字节（文件长度总和，非独占物理空间），config/4盘/EFI/TPM逐文件SHA256相同。复制前后源文件状态一致且无打开文件，副本独立inode，目录0700/文件0600，无UTM缩略图；原VM、pre-os基线均保留。复制后宿主可用264,909,045,760字节，超过40GiB预算。`cp -c -n`请求克隆但共享区块未独立证明，空间差不作为清理成果。[完整回执](../analysis/vm-install-v8/windows-cold-baseline.json)。

这只是**保留已知缺口的私有检查点**，不是健康验收完成、无账号镜像、异盘灾备或恢复启动测试。已有Windows身份状态可能保存在盘与TPM中，不读取其凭据存储、不上传/分发。恢复时先保留当前状态，不同时启动同UUID副本，不覆盖原盘；恢复启动与下一次登录仍待安排。本次登录授权已使用，不自动续用。

下一步是只读定位TPM查询失败、按实际功能评估剩余设备、恢复启动验证，再向用户提交已准备的固定客户端单次离线加载计划。游戏来源/许可/具体执行授权及跨平台协议缺口继续独立处理；本轮没有游戏导入或执行、官服连接。

## v9：独立恢复克隆引导验证与TPM调查

**事实：**连接复查成功，先前CUA报告Mac锁定已不适用。13:50 UTC观察到原`MoliOffline-ARM64-20261025`已运行并停在Windows锁屏，本阶段没有启动、关机或登录原VM。原config仍通过22项隔离策略，系统盘、EFI、TPM的元数据与初始停止采样不同；记录为运行中的状态变化，不声称原VM全盘未变。[连接复查](../analysis/vm-install-v9/connection-recheck.json)。

只从已校验v8冷副本创建`build/utm/MoliRestoreTest-ARM64-20261025-v9.utm`，UUID`52490BAF-23BC-4E29-A39A-AA9F4E11A1F9`。执行前7文件SHA256全部匹配v8固定值，源无打开句柄，容量满足完整复制加40GiB预留。新副本与原VM/基线跨文件inode不共享；四盘无backing/data-file，配置路径在各自bundle内。只修改克隆Name/UUID，安全/TPM/EFI及无NIC/无共享配置保持原值。私有目录0700、文件0600，真实结果见[复制回执](../analysis/vm-install-v9/restore-clone.json)。

**实际验收边界：**UTM已打开并启动独立测试克隆，进入Windows锁屏；没有输入任何凭据或复用一次性登录授权，未进入桌面。已正常关闭测试克隆。这验证了副本可引导至登录前UI，不证明桌面、TPM健康、全部设备、激活或游戏兼容。原冷副本未被启动/修改；原VM当前运行不影响独立冷源复制。[启动观察](../analysis/vm-install-v9/restore-boot-observations.json)、[最终核验](../analysis/vm-install-v9/stage-validation.json)。

**TPM事实与推测：**微软定义`0x80284001`为TBS内部软件错误，不等于TPM缺失。UTM5.0.8的ARM CRB/PPI路径存在源码调查线索，本机QEMU字符串为10.0.12并记录hash/偏移；尚未绑定全部运行时行为，不能认定根因或建议清TPM。34项历史设备问题保留，不能把平台transport/fw_cfg/serial节点全部当作必装驱动。[官方资料与限定只读方案](../analysis/vm-install-v9/tpm-and-device-investigation.md)。本轮没有新的guest诊断或驱动/安全修改。

克隆脚本普通/优化模式各25项合成测试通过，根任务复跑通过，包含源变化、跨文件inode依赖、外部backing、容量、隔离、原config变化、旧目标和不确定lsof拒绝。运行原VM的正常可变盘写入不作为冷基线损坏证据。[脚本测试](../analysis/vm-install-v9/restore-clone-tests.json)。只读重新核对游戏候选5/5hash与固定计划一致，未导入执行。精确下一步及游戏实验单独授权范围见[下一步](../analysis/vm-install-v9/next-actions.md)。

## v9后续输入复查

用户继续报告无法自行输入PIN，未把“以后全部代填”转为保存凭据、自动登录或复用旧确认。原VM已运行，先前Capture Input为0；通过Window菜单选择准确窗口、置前、开启捕获后只发送一次空格，进入Windows PIN页，空框有焦点。没有输入测试字符、提交、登录或改变电源/安全设置；未保存包含账户标识的页面截图。最终原VM捕获为1，恢复克隆仍关闭。此为工具导航通路验证，不是实体键盘/数字输入通过，也未证明唯一根因。详见[限定观察](../analysis/vm-install-v9/input-focus-followup.json)。恢复阶段中“未操作原VM客户机”的描述属于前一恢复阶段；本补充仅有上述普通导航。

后续14:07 UTC用户对测试克隆本次一次登录给出具体确认；尚未消费。约14:08 UTC读取当前UI及重新绑定UTM两次返回“The Mac is locked and automatic unlock could not unlock it.”，因此停止界面分支，没有启动克隆、输入或提交凭据，也未尝试其他控制路径。需恢复正常工具访问后重新核对准确目标；若用户实际Mac未锁定，应排查连接/前台状态，不反复断定用户需要解锁。此次不是自动审批拒绝。[最新工具阻碍](../analysis/vm-install-v9/login-access-blocker.json)。

## v10：恢复桌面、普通权限诊断与免验证方案

本节更新当前状态；v9后续的locked/授权未使用是历史记录。操作前必须读取[项目知识库](known-issues.md#vm-troubleshooting)。2026-10-25 14:15 UTC起确认准确测试克隆、无NIC/共享的完整配置及关闭的冷源，随后启动克隆并使用当次单独批准的登录一次成功。此次授权已消费，没有保存凭据值。目标名称仍是`MoliRestoreTest-ARM64-20261025-v9`，v10只是证据阶段号。原VM与v8冷基线不作本次UI目标。[前检](../analysis/vm-install-v10/before-validation.json)、[登录结果](../analysis/vm-install-v10/login-result.json)。

**事实：** 普通权限PowerShell确认Windows 11家庭版、10.0.26300、ARM64。RNG 100.100.104.27100和DOD 22.7.38.43的IsSigned均True，34项`CM_PROB_FAILED_INSTALL`仍在。安全设备类显示TPM 2.0及Pluton命名设备均OK；后者是枚举结果，不证明实体Pluton。`tpmtool getdeviceinformation`退出0，显示IBM/SW TPM/2.0等，但多处标签/值空白，不能猜Ready/Enabled/Owned/PPI值；渲染/本地化还是实现问题尚未确定。`Get-Service tbs`未找到当前查询可见对象，不是Stopped或AccessDenied，不能推为TPM不存在。完整命令、截图和限制见[客户机观察](../analysis/vm-install-v10/guest-observations.json)。[微软tpmtool说明](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/tpmtool)仅将该子命令定位为基础信息查询；没有启用跟踪、收集日志或清TPM。

**拒绝与已完成区分：** 管理员PowerShell的UAC“是”点击被自动审批拒绝，理由是当前只读查询授权未明确覆盖管理员权限提升；动作未执行，Escape取消，没有换途径提权。其后普通非提升PowerShell读取得到以上独立证据。此前v8的管理员Get-Tpm内部错误0x80284001仍保留，根因及完整健康未闭合。[拒绝记录](../analysis/vm-install-v10/elevation-blocker.json)。

**当前隔离与基线：** 原机/冷基线config精确符合固定四盘策略；克隆仅名称/UUID不同，其余精确一致。均无NIC，目录/剪贴板/USB共享关闭。14:40 UTC冷基线7文件元数据相对本轮开始未变、lsof无打开句柄；本轮没有重读全盘hash，最后全hash为v9。运行中的原机系统盘发生正常可变写入，测试克隆系统盘/EFI/TPM也正常变化，不能称它们全盘不变。本轮没有操作原机客户机、修改VM配置或冷源。[只读核验](../analysis/vm-install-v10/host-isolation-check.json)。

**两台免验证目前仅提案：** 正常设置页显示克隆唤醒重新登录已经“从不”、Hello-only为“开”，PIN保留；没有修改，也不重启/睡眠验证以保留会话。原机登录选项本轮未看，不能假设相同。启动免验证另需官方Autologon与账户密码的LSA保存，准确介质交付、用户本人输入、许可/UAC/回退见[方案](../analysis/vm-install-v10/autologon-proposal.md)。没有下载/执行Autologon或接受新条款。当前克隆保持已登录运行、普通PowerShell可见；本轮不关机、不重启。设备完整健康、更新/激活、实体键盘、启动/唤醒免验证和游戏兼容均未验收。

<a id="v11-autologon-preparation"></a>
## v11：已批准方案的独立准备，尚未启用自动登录

用户具体同意此前披露的两台Autologon方案，同时暂不能本人输入账户密码。本轮只做无需密码的宿主准备；没有UI操作、挂载、重启、登录、UAC、许可点击或安全设置更改。测试克隆当前会话不被打断，原机未进入设置检查。[批准与实际动作](../analysis/vm-install-v11/authorization-and-actions.json)。历史v10方案中的“尚未批准”是提案形成时状态，不应覆盖本段的新批准及限制。

**下载事实：** 从`https://live.sysinternals.com/ARM64/Autologon64a.exe`通过正常TLS下载524880字节，PE machine=`0xaa64`、PE32+；SHA256=`b1d7f3e4aadaca6e6cb8a9ad612931a75394588b4012f7bf38e734d27e324bbd`。同时下载官方同目录Eula.txt，7490字节，SHA256=`8329bcbadc7f81539a4969ca13f0be5b8eb7652b912324a1926fc9bfb6ec005a`。默认沙箱首次DNS解析失败，未下载；按正常执行器权限流程完成官方下载，未关闭TLS或换非官方源。[来源及HTTP元数据](../analysis/vm-install-v11/download.json)。

**静态与许可边界：** 版本字符串为3.10，固定版本资源为3.1.0.0；版本/嵌入证书只作元数据观察；证书名称或SHA256不能替代Authenticode文件摘要、可信链与时间戳验证。当前已检查Mac的OpenSSL/系统Python不具备现成完整PE验证器，本轮未安装额外全局工具。Windows内置`Get-AuthenticodeSignature`的只读核验待安全取得介质后进行；离线检查还不能保证当前吊销状态。随附Eula.txt与已披露微软许可网页文本存在差异，不认定全文一致，不推断数据收集行为或法律效力。没有运行工具、接受不同条款或跳过签名校验。[静态摘要](../analysis/vm-install-v11/tool-static-metadata.json)。

**介质已实际准备：** `build/utm/media/moli-autologon-arm64-v10.iso`（沿用已披露v10方案的固定文件名，证据阶段为v11），921600字节、0444、卷标`MOLI_AUTOLOGON`；SHA256=`3e1a87c8f6ff50bca52003d17de3a41c5ec200f6bcb90ad50a66bea79a192e31`。ISO9660+Joliet数据盘，仅含Autologon64a.exe、Eula.txt、SHA256SUMS.txt，无autorun/启动项/无人值守脚本/凭据。通过bsdtar回读3/3文件与源一致，复制到新build路径后hash一致；没有覆盖旧介质或宿主/客户机挂载。[构建与回读](../analysis/vm-install-v11/media-validation.json)。官方工具和完整许可只在临时/build介质内，不进入源码交付。

**状态保留：** 两台保存config hash与v10一致，仍无NIC、无目录/剪贴板/USB共享。15:00 UTC两台系统盘各有QEMULauncher打开句柄，说明运行进程仍持盘，不证明原机桌面/登录状态；本轮未请求屏幕或输入。冷基线7文件元数据未变且无打开句柄，本轮不是新的全盘hash。[宿主只读核验](../analysis/vm-install-v11/host-preservation.json)。

**具体未完成依赖：** 自动登录尚未启用。缺用户本人安全输入的账户密码；不能改用PIN、获取保存凭据或猜测。介质尚未挂到克隆，现有第四CD的替换仍按原方案在安全节点进行，不为了准备不必要丢失会话。即使后续正常重启获准，也不因此复用已消费的登录授权。下一次有人在场后先确认实际适用许可差异、挂载只读介质、执行Windows签名核验、再运行获批Autologon/UAC，由用户独立输入密码并Enable；成功后才分别验证冷启动、受支持睡眠唤醒、UTM暂停恢复，并恢复原CD。克隆失败不推广到原机；原机须另行核实自身状态。PIN保留、唤醒现值“从不”不重复改，Mac/TPM/SecureBoot/冷基线不变。任何新权限、不同条款或登录失败按具体阻碍停止，不在用户休息期间催问。游戏执行/官方联机不在此范围。

## v12：实际许可已确认，标准光盘挂载依赖已定位

用户已明确确认官方ARM64随附Eula.txt；此前网页/文本差异仍保留为事实，不再把已确认的实际许可当待确认项，但没有运行Autologon或点击其运行时许可。新观察确认Mac屏幕可读、准确测试克隆仍登录桌面；没有重用PIN或提交新登录。原有JS绑定已失效，首次调用只报变量未定义，随后正常重新绑定UTM，不是主机锁定或权限拒绝。

**具体技术阻碍：** 点击光盘入口后UTM提示“未找到空的可移动驱动器”。当前四盘都有ImageName；UTM v5.0.8模型据此判为内部盘（isExternal=false），ReadOnly独立于可移动属性。标准换盘界面只列外部/可移动盘；库界面显示克隆已启动、编辑禁用。对应[模型](https://github.com/utmapp/UTM/blob/v5.0.8/Configuration/UTMQemuConfigurationDrive.swift)、[换盘界面](https://github.com/utmapp/UTM/blob/v5.0.8/Platform/Shared/VMRemovableDrivesView.swift)、[停止后配置路径](https://github.com/utmapp/UTM/blob/v5.0.8/Scripting/UTMScriptingConfigImpl.swift)。不能把只读CD当可热换CD，也不替换运行中映像或用QMP绕过标准路径。

提示关闭的首次操作遇到工具“应用已变化”保护，未执行；按提示重新读取界面，确认仍是同一警告后正常关闭，并通过Window菜单返回准确测试克隆。这个保护不是审批拒绝。没有挂载、停止、重启、改盘或安全设置；两VM配置hash和ISOhash与v11一致。[非敏感完整记录](../analysis/vm-install-v12/media-mount-blocker.json)。

正常停机/重启和原计划内第四只读光盘替换已获批准，不重复索取同项批准；但停机后需要一次新的Windows登录，旧单次授权已经消费。按保留可用会话及登录边界要求，暂停在停机前，由主会话协调用户本人登录或新的具体单次登录确认。之后才执行原四盘范围内挂盘→Windows只读签名核验→获批Autologon的UAC/实际许可→暂停观察让用户本人输入账户密码。没有自动扩大为第五块新盘；若标准设置确需不同设备范围，先说明差异。测试通过才处理原机。

<a id="v13-parallels-assessment"></a>
## v13：在关机前暂停UTM，转为Parallels只读复用评估

**UTM实际到达点：** 新一次克隆登录确认收到后，仅重新绑定准确窗口、置前、展开/取消本机菜单。随后用户要求暂停UTM后续；尚未点击任何关机、重启、换盘、登录或UAC动作，新的单次登录授权未使用。原机、测试克隆、冷基线均保留；两VM保存config hash仍与v12相同，Network空、目录/剪贴板/USB共享关闭。后续不再开始Autologon或设备调优，除非用户恢复该方向。[当前盘点与暂停记录](../analysis/vm-install-v13/parallels-inventory.json)。

**本机只读盘点事实：** Mac架构arm64、macOS 27.0.1。`/Applications/Parallels Desktop.app`不存在；`/Applications`即时非符号链接.app的Info.plist未发现Parallels名字/bundle ID，`~/Applications`不存在；当前应用清单无Parallels，PATH无prlctl/prlsrvctl，pkgutil无匹配安装收据。`~/Parallels`、`~/Documents/Parallels`、`/Users/Shared/Parallels`均不存在；已知三个vmdirectorylist.desktop.xml位置不存在，项目根/build即时层无.pvm。检查范围和准确路径完整见JSON。**不能推论全机绝无Parallels、许可无效或旧环境不存在**；自定义目录、外置盘、其他Mac未扫描。版本、可见许可/试用状态、旧Windows架构及可复用性当前未知。未读取激活资料、许可证密钥、钥匙串或账号秘密；未启动既有未知VM、安装/试用/购买、接受新条款、改共享或清理旧VM/废纸篓。

**官方资料与适用边界：** [Parallels系统要求](https://kb.parallels.com/en/124223)当前列出27版支持Apple Silicon、macOS 27范围，并列Windows 11 Pro/Enterprise ARM为推荐客户机；不是对本项目家庭版26300.9711或游戏的兼容保证。用户只报告以前Windows11+Parallels较顺利，未报告已在其中运行魔力。支持应用/图形仍须按实际客户端测试，不能把换虚拟化产品当协议/官服兼容完成。

**最省事的条件性路线：** 先由用户给出以前Parallels所在Mac/外置盘及.app/.pvm的准确路径，并说明现有许可是否可用（不提供密钥）。找到后只读确认版别/版本、目标PVM架构、是否正常关闭及外部盘依赖；优先复用已有正常环境，不自动重装/升级/购买。若仍需副本或迁移，先核查适用的官方恢复方法及许可，不能盲拷PVM后启动。官方[TPM说明](https://kb.parallels.com/en/122702)指出带TPM的VM复制/跨Mac迁移有宿主钥匙串依赖；本任务不读取/导出TPM密码，不照网页敏感导出步骤操作，也不开启iCloud同步。Standard与App Store Edition的[克隆能力不同](https://kb.parallels.com/en/123796)，不能默认都具备相同克隆功能。启动/隔离设置/软件安装及不同许可的具体下一步待现有环境身份确定后再列出，不擅自执行。

找到软件后可按支持版别使用[官方CLI](https://docs.parallels.com/landing/parallels-desktop-developers-guide/command-line-interface-utility)只读列VM；Standard缺少某CLI能力不等于没有VM。`prlsrvctl info --license`原始输出可能包含部分密钥/标识，本轮没有执行，不记录原文；不运行会update-license的官方示例脚本。优先取得不含秘密的可见版别/许可状态即可。[密钥输出边界](https://kb.parallels.com/en/115424)。

当前阻碍是以前环境的位置/身份缺失，不是新的工具审批拒绝；本轮没有不明修改结果。UTM资产不删除，已有解析/协议/测试成果保持，跨平台项目目标不变。

<a id="v14-removal-preflight"></a>
## v14：用户改为整体移除UTM，本轮只完成删除前清单

**最新目标覆盖旧分支：** 2026-10-25 17:15 UTC用户要求整体移除UTM环境；不再继续配置、登录、Autologon或设备调优。父任务已承诺先说明精确清单，本轮因此只有只读盘点和文档同步，**没有关机、退出UTM、取消注册、移动到废纸篓或删除**。17:04新的一次克隆登录确认未使用，当前方向下不再执行。先前实际条款确认不等于工具运行；Autologon一直未挂载/运行/启用。

**事实：** UTM 5.0.8 (128)仍运行；当前正常UI逐个核对原VM为Windows锁屏、测试克隆为已登录桌面，克隆可见Widgets及先前PowerShell查询结果。原机/克隆各4个虚拟盘分别被PID49447/55639打开。克隆没有可见的未保存文档警告，但不能排除后台工作；原机锁屏后的会话内容未知。本轮仅窗口切换/菜单查看，不输入客户机命令、密码或PIN。`ps`只读查询被系统返回operation not permitted，未重试或提升权限；使用已有精确文件句柄结果与正常UI分别提供证据，不宣称拥有完整进程清单。精确17文件lsof检查退出1、stderr空，列出上述8个打开盘；其余路径无输出不代表不存在任何其他持有者或反向引用。

### 待确认的主要可恢复移除候选

数字依次为**文件逻辑字节和st_blocks分配字节之和**（实际精确整数在JSON）。稀疏盘与APFS克隆共享extent可使后者重复计数；不能把各行合计当成独占占用或承诺可释放空间。**正常移到废纸篓不会立即释放全部空间；本任务不清空废纸篓。**

| 精确路径 | 逻辑 / 分配求和 | 当前状态 |
|---|---|---|
| `/Applications/UTM.app` | 1.295 GiB / 1.297 GiB | 应用运行；退出后才可移除 |
| `/Users/lx/Documents/code/moli-mac/build/utm/MoliOffline-ARM64-20261025.utm` | 35.416 GiB / 33.279 GiB | 运行，锁屏；不可直接移动 |
| `/Users/lx/Documents/code/moli-mac/build/utm/MoliRestoreTest-ARM64-20261025-v9.utm` | 35.416 GiB / 33.286 GiB | 运行，桌面；不可直接移动 |
| `/Users/lx/Documents/code/moli-mac/build/utm/baselines/MoliOffline-ARM64-20261025-windows-v8.utm` | 35.416 GiB / 33.266 GiB | 冷副本；本次未启动，无观测到的磁盘句柄 |
| `/Users/lx/Documents/code/moli-mac/build/utm/baselines/MoliOffline-ARM64-20261025-pre-os.utm` | 0.824 MiB / 0.832 MiB | 冷副本；本次未启动，无观测到的磁盘句柄 |
| `/Users/lx/Documents/code/moli-mac/build/utm/media/moli-autologon-arm64-v10.iso` | 0.879 MiB / 0.879 MiB | 独立源介质，当前未观测到打开句柄 |
| `/Users/lx/Documents/code/moli-mac/build/drivers/netkvm-w11-arm64-0.1.274.iso` | 2.867 MiB / 2.867 MiB | 独立源介质，当前未观测到打开句柄 |
| `/Users/lx/Documents/code/moli-mac/build/drivers/utm-guest-tools-0.1.274.iso` | 137.232 MiB / 137.234 MiB | 独立源介质，当前未观测到打开句柄 |
| `/Users/lx/Documents/code/moli-mac/build/iso/Windows11_Client_arm64_zh-cn_26300_9457.iso` | 8.244 GiB / 8.244 GiB | 独立源介质，当前未观测到打开句柄 |

这4个项目bundle共有13个QCOW2；只读头检查均无backing文件与external-data-file标志/扩展，13个持久Drive引用全部位于各自bundle/Data，没有跨bundle路径、符号链接、硬链接或额外QEMU参数。APFS克隆物理块共享不会变成运行时对另一个bundle路径的依赖。原始ISO已转换为各bundle内QCOW2，不依赖外部原ISO；Autologon ISO未出现在持久config中。没有扫描其他VM，**未核实未知其他VM对这些文件的反向引用、运行态临时挂载或应用容器内其他数据**，因此不能称所有依赖全机穷尽。[依赖证据](../analysis/vm-install-v14/dependency-check.json)。

### 已有回执指向的专用临时工件

仅检查历史明确路径是否存在和大小，没有按名字在全机/临时目录做通配搜索。这些是另列的可恢复候选，不删除临时目录中的分析脚本、交付回滚副本或其他内容。

| 精确路径 | 逻辑 / 分配求和 |
|---|---|
| `/tmp/moli-utm-guest-tools-3d-latest.iso` | 137.232 MiB / 144.059 MiB |
| `/tmp/moli-netkvm-w11-arm64-0.1.274` | 2.810 MiB / 2.828 MiB |
| `/tmp/moli-netkvm-w11-arm64-0.1.274-with-license.iso` | 2.867 MiB / 2.867 MiB |
| `/tmp/moli-base-drivers-w11-arm64-0.1.274` | 0.310 MiB / 0.328 MiB |
| `/tmp/moli-base-drivers-w11-arm64-0.1.274.iso` | 0.879 MiB / 0.879 MiB |
| `/private/var/folders/6x/dn2b4v591x184z9lb1tbv6yr0000gn/T/moli-autologon-v11-k74xwlgm` | 1.898 MiB / 1.914 MiB |

### 最小正常移除与恢复办法（方案，未执行）

1. 主对话展示并确认上述精确路径范围，特别是Windows原ISO、冷基线和临时工件；不以`UTM*`等通配扩大。源代码、`moli/`安装原件、全部`analysis/`、`reports/`、知识库、交付备份及非UTM产物保留。
2. 对准确原VM/克隆分别走Windows正常“电源→关机”。原机锁屏可先查看正常电源选项，不为关机复用登录授权。遇到未保存工作阻止、更新写入、登录依赖或系统拒绝就停并报告，**不点强制关闭、不kill、不丢弃状态**。目前还没有验证正常关机是否成功。
3. 等两VM显示停止并复核上述8个打开盘句柄已消失，再正常退出UTM。只在确认无运行占用后，用Finder的正常“移到废纸篓”逐个处理已批准路径；不使用rm/unlink、不直接操作废纸篓目录、不清空。macOS应用移除若需要管理员确认由正常系统流程处理，不能预称成功。
4. 确认源路径已不存在且Finder正常可恢复；不扫描既有废纸篓。本轮尚未测试“放回”，所以恢复能力是基于正常废纸篓流程的计划，不是已完成验收。需恢复时仅放回本次条目原路径，应用重新打开前先确认VM身份和离线配置；不覆盖同名新文件、不直接启动冷基线。

`/Users/lx/Library/Containers/com.utmapp.UTM`确实存在，但可能含其他VM登记/数据。本轮只检查路径存在，不遍历、不删除；`~/Library/Preferences/com.utmapp.UTM.plist`及`~/Library/Application Support/UTM`检查时不存在。不能把移除应用+项目build说成所有全局偏好/缓存均已清理；若要处理容器需另做有边界的内容与依赖核查，不能恢复已取消的旧VM/废纸篓清理。UTM应用本身是全局应用，移除后其他UTM环境暂时无法通过它启动，但本轮不动其他人的VM文件。

**状态与阻碍：** 本轮清单已完成，删除仍未开始；两台运行中VM必须先正常关机，未保存工作状态未完全可见。没有新的自动审批拒绝动作或不明修改结果；ps只是只读工具能力限制。Parallels限定位置未找到的结果仍见[v13](#v13-parallels-assessment)，没有安装替代软件，旧Windows体验不等于游戏兼容。本次证据：[精确清单与运行观察](../analysis/vm-install-v14/removal-inventory.json)。

<a id="v15-removal-and-parallels"></a>
## v15：已执行可恢复UTM清理，接管用户运行的Parallels

### 已执行与保留

用户在v14清单说明后授权可恢复移除，并进一步要求完整移除专属残留。开始时**两台项目VM已经显示Stopped**，精确磁盘文件lsof无输出；没有由助手再关机/启动，也不能将用户期间发生的停止归为助手正常关机测试。正常退出UTM后，应用清单确认isRunning=false。

通过Finder准确选择、Command+Backspace和行消失观察，完成：原清单9项；历史6个确切临时工件；另一个旧NetKVM ISO和三个空准备目录；最后3个只含空子目录及.DS_Store的项目build父目录。共22个原路径已复核不存在。扩展旧ISO的8个成员hash与v4既有NetKVM清单全部相同，没有靠名字猜归属。路径、分组及结果见[逐项核验](../analysis/vm-install-v15/final-removal-verification.json)、[临时候选](../analysis/vm-install-v15/remnants-inventory.json)、[额外可见工件](../analysis/vm-install-v15/additional-visible-remnants.json)、[旧ISO内容比对](../analysis/vm-install-v15/old-netkvm-content-check.json)。三个空父目录原为build/utm、build/drivers、build/iso，[移动前检查](../analysis/vm-install-v15/empty-build-parents.json)证明没有产品/分析文件。

**恢复范围：** 所有实际移除均使用Finder正常移到废纸篓，不使用rm、直接unlink、清空废纸篓或永久删除。未读取旧废纸篓，没有进行放回测试；正常恢复须从本次条目放回准确原路径，不覆盖同名新文件。由于VM包与空父目录分开移动，恢复时先确认父路径和所需包，不能误将空父目录当作完整VM恢复。冷副本在废纸篓中仍不应直接启动。移动不等于释放存储空间，APFS克隆/稀疏文件也不支持按逻辑大小承诺释放量。

**保留与具体阻碍：** `/Users/lx/Library/Containers/com.utmapp.UTM/Data`的单次列举被OS拒绝：`[Errno 1] Operation not permitted`，未重试/改权限/通过Finder绕路。整容器保留，因为无法排除其他VM/无关资料。外层`Caches/com.utmapp.UTM`、`Saved Application State/com.utmapp.UTM.savedState`及`Preferences/com.utmapp.UTM.plist`不存在；这不证明被拒容器内部为空。保留所有代码、moli原件、analysis/reports/KB、交付备份、其他VM与Parallels文件。删除后且本轮文档更新前，原stage19的409文件全部hash一致，42产品文件hash一致，moli原件size/inode/mtime一致。

### 工具中断不能写成待批准或删除成功

获取Finder窗口的只读调用曾等待2848.3524秒才返回，期间没有执行删除，根因未确定，不能把延迟自行归因为用户拒绝或审批等待。恢复后重新核对9项均仍存在、VM无打开盘、UTM退出，再一次执行各项移动。后来的第二次Parallels标准启动调用等待955.6秒后返回用户中止；只读清单随后确认未运行，未盲目重复启动。System Settings读取也等待343.906秒才返回。工具timeout_ms=10000没有保证这些宿主/交互等待在10秒内结束。已执行、未执行、结果不明及复核后的实际状态分别记载，不据取消/超时自动重发写动作。

### Parallels实际已安装与当前会话

v13“未找到”只对当时盘点有效。当前`/Applications/Parallels Desktop.app`Info.plist为20.4.2(55999)、bundle ID com.parallels.desktop.console，主程序通用x86_64/arm64。本机`codesign --verify --deep --strict`退出1并报告`invalid signature (code or signature have been modified)`、architecture arm64；spctl assess退出1报Code Signing subsystem内部错误。属于实际检测失败，不证明软件恶意、破解或许可证情况。没有重签名、移除隔离或删除/替换Parallels。[身份和输出](../analysis/vm-install-v15/parallels-current-app.json)。

登记文件指向`/Users/lx/Parallels/Windows 11.pvm/config.pvs`，未执行prlctl/prlsrvctl或读取许可证/账号存储。只读配置身份/字段与来源hash见[登记盘点](../analysis/vm-install-v15/parallels-vm-inventory.json)。用户确认正常启动后一次工具动作被自动审批拒绝（理由将当前范围解读为仅只读，与转交确认不一致）；收到新的范围澄清才重试同动作一次，后被用户中止。随后用户明确报告应用已在运行，正常app清单确认true后才只读绑定现有窗口。**不是助手成功启动应用或VM的证据**；当前截图观察为Windows徽标/旋转指示，未验证桌面、客户机架构、版别、许可或激活。[过程与拒绝原文](../analysis/vm-install-v15/parallels-launch-blocker.json)、[现有窗口观察](../analysis/vm-install-v15/parallels-running-observation.json)。

### Gatekeeper的准确执行边界

用户曾进一步明确批准全局关闭；本机macOS27.0.1的spctl(8)规定`--global-disable`只是显示Privacy & Security的“任何来源”选项。命令实际执行并退出1，提示必须在System Settings确认；没有点击该确认或输入管理员认证。随后用户要求接管已运行Parallels，暂停未执行的Gatekeeper变更。最终`spctl --status`仍为`assessments enabled`；不能把命令尝试写成已关闭，也不宣称该“任何来源”选项可见性已验收。未改SIP/FileVault/XProtect/TCC、隔离标记或应用签名。[具体回执](../analysis/vm-install-v15/gatekeeper-action-and-pause.json)。[Apple说明](https://support.apple.com/en-us/102445)区分签名/损坏检测与用户例外，应用能运行不修复无效签名。

### 当前安全边界与最短下一步

当前config显示NetworkAdapter Enabled=1/Connected=1、ClipboardSync Enabled=1、GuestSharing Enabled=1，HostSharing Enabled=0，并有USB Connected=1。未解码未经核对的网络枚举为NAT/桥接，也未测试实际传输。这不是离线隔离配置，不把用户已有配置当新增共享授权；本轮未改动配置/网络/主机共享、未粘贴或传送游戏文件。[精确所读字段](../analysis/vm-install-v15/parallels-current-flags.json)。

最小路径是先确认这台已运行Windows到达什么界面及架构/许可条件，随后明确离线实验所需断网/共享边界和可逆基线。已有客户端动态实验仍只是[固定样本待授权计划](../analysis/vm-install-v6/client-experiment-plan.md)，不能因为换虚拟化平台而自动运行游戏或连接官服。现阶段可继续主机上的既有静态逻辑/协议证据分析，无需重建UTM或新建竞争实现。


<a id="v16-startup-readonly"></a>
## v16：启动等待的只读检查与最小隔离提案

**事实：** 本轮只读检查用户已运行的Windows 11.pvm。画面保持“请稍等”，旋转点位置变化；18:58至19:01 UTC磁盘文件由14,895,022,080增至14,899,216,384字节且mtime推进。不能因此称更新完成或认定死机。VmInfo.pvi报24H2、10.0.26100、补丁0.4349、64bit/4CPU、AppleHV；这是缓存元数据，不是桌面内winver验收。Tools日志有NTarm64驱动安装exit(00000000)，之后VM日志有VmStateRunning、MonitorArm与TOOLS_READY。[受控摘录、行号、hash和实际配置](../analysis/vm-install-v16/startup-and-isolation-observation.json)。未读Unattended.iso、来宾内存、账号/许可秘密，未复制完整日志。

**推测：** 等待可能关联刚完成的Tools/系统配置，但根因没有证明。ARM虚拟化、ARM64驱动和A64镜像名支持ARM64判断；来宾系统查询未做。**待验证：** 桌面、版别、许可/激活、OOBE/更新完成、设备健康与游戏兼容。

实际页面：网络“共享网络（建议）”；“隔离Windows和Mac”未勾选；剪贴板“双向”；共享Mac页的用户目录镜像、云文件夹、Mac卷勾选，自定义目录未勾选；共享Windows页的从Mac访问Windows文件夹、OneDrive共享勾选。不能凭v15 HostSharing=0推断所有Mac共享关闭。USB允许全部7类外设、智能卡共享未勾选；Devices→USB只见配置入口。控制器Connected=1不是物理USB直通证据。仅查看页面/收起窗口，未切换配置或试传数据。

**待确认的最小变更：** Windows自身流程到安全节点后，仅对此VM将Hardware→Network→Source设“断开”，勾选Security→“隔离Windows和Mac”，复核双向目录/镜像/云/Mac卷/OneDrive和剪贴板均关闭，实际外设不直通。保留ARM虚拟键鼠所需USB控制器；不改Mac/PIN/TPM/SecureBoot，不预设需要重启。按上述原选择逐项回滚，不用“恢复默认设置”。[v20网络](https://docs.parallels.com/landing/pdfm-ug/v20-en-us/parallels-desktop-for-mac-20-users-guide/parallels-desktop-preferences-and-virtual-machine-settings/virtual-machine-settings/hardware-settings/network-settings)、[隔离](https://docs.parallels.com/landing/pdfm-ug/v20-en-us/parallels-desktop-for-mac-20-users-guide/use-windows-on-your-mac/protecting-your-data/isolating-windows-from-mac)、[USB](https://docs.parallels.com/landing/pdfm-ug/v20-en-us/parallels-desktop-for-mac-20-users-guide/parallels-desktop-preferences-and-virtual-machine-settings/virtual-machine-settings/hardware-settings/usb-and-bluetooth-settings)。提案未执行。

19:04 UTC前后画面从“请稍等”变成黑屏，随后仍未见登录/桌面。当前无挂起工具。一次Devices→Keyboard→Ctrl+Alt+Delete响应检查被自动审批拒绝、已知未执行；理由是会发送安全注意序列并可能进入登录/凭据界面，超出只读范围。已收起菜单，未换快捷键/路径重试。继续该检查须取得针对本VM当次动作的明确确认；不包含凭据输入。未重启/强关机/登录、未改共享或Gatekeeper，未运行游戏。根因仍未知；不能仅凭画面强制断电、重建VM或扩大驱动修复。


<a id="v17-desktop-confirmed"></a>
## v17：现有Parallels桌面、版本和架构已核实，隔离仍待确认

**事实：** 用户19:13 UTC报告正常后，助手刷新观察到桌面，随后正常打开系统设置、winver和msinfo32。winver为Windows 11专业版24H2、OS 26100.4349；msinfo32系统类型为ARM64-based PC、型号可见前缀Parallels ARM Virtual；设置显示Apple Silicon/4处理器、8GB内存、256GB虚拟盘（29GB已用）。基本窗口/开始菜单响应通过，不等于全部设备、图形API或游戏通过。图形卡片显示“无专用VRAM/未安装GPU”，没有据此断言驱动根因或追加修复。未导出系统信息全表，也不保存包含用户桌面文件名/账户标识的截图。[去敏观察](../analysis/vm-install-v17/desktop-and-isolation-observation.json)。

曾弹出“立即激活Windows”提示，只点关闭，未购买、输入密钥或改激活。因此当前专业版许可/激活未验收，不能继承旧UTM家庭版的许可讨论。旧Ctrl+Alt+Delete请求已取消；此前拒绝动作保持未执行，本轮没有发送、重试、重启或输入凭据。原等待/黑屏根因仍未确定，后来进入桌面不能追认某个修复有效。Gatekeeper19:19 UTC复查仍assessments enabled。

**当前实际隔离选项仍未改变：** Hardware→Network源为共享网络（建议）；Security→隔离Windows和Mac未勾选；Clipboard sync双向。共享Mac页：镜像用户目录、云文件夹、Mac卷均勾选，自定义目录未勾选。共享Windows页：从Mac访问Windows文件夹、OneDrive共享均勾选。桌面有镜像图标，但未打开/测试任何私人文件；不能把它当全面数据流验收。只读查看不修改这些选项。

**最小待确认操作：** 仅此PVM断网并启用Mac/Windows隔离，复核双向剪贴板/目录/云/镜像关闭且无外设直通；保持USB控制器、Mac安全、PIN/TPM/SecureBoot不变。然后建立适合这台已有用户身份状态VM的私有实验前恢复点。当前未创建、启动或测试新副本；UTM清理不重做。上述环境条件具体确认/验收后，另行确认[原有固定五文件实验](../analysis/vm-install-v6/client-experiment-plan.md)。

**离线分析独立部分：** 原计划5文件仍在/tmp/moli-analysis/crossgate/app，大小与SHA256全部匹配，见[本次重核](../analysis/vm-install-v17/fixed-sample-recheck.json)。拟议唯一主动目标cg_se_3000.exe（SHA256 9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126），其余4DLL仅正常加载器按需读取。全断网、无参数、普通权限、一次且最长90秒，观察加载/退出/缺依赖或上下文错误；不运行安装器/登录器/更新器、不提权/装驱动、不抓内存/账号/网络。它最多缩小初始化边界，不能闭合argv/CGSharedMem→游戏消费者→socket→分帧的协议缺口。样本未完成权威逐字节来源认证，游戏用途许可与既有Windows身份风险仍需具体处理，没有执行授权。


<a id="v18-bounded-probe-preparation"></a>
## v18：有界实验已批准；介质通过，屏幕访问阻止VM步骤

用户22:06 UTC明确批准仅本VM断网/关闭主机共享、私有恢复点（必要时正常关机再启动）、五文件只读CD导入、唯一cg_se_3000.exe普通权限无参数一次且不超过90秒。来源未逐字节官方认证及既有Windows身份风险已披露。新许可/权限/联网/驱动提示即停，不复用登录/PIN授权，不提权或运行安装器/登录器/更新器，不抓内存/网络/凭据。该确认仍不接受未来新条款，不授权Mac安全或其他VM变化。

**实际阻碍：** 约22:08 UTC首次cua.listApps返回“The Mac is locked and automatic unlock could not unlock it”。这是工具报告，不独立证明用户看到的屏幕状态。未通过其他路径控制界面、未循环重试。隔离开关、正常关机、恢复点、挂盘/客户机哈希及样本运行均未执行，样本执行计数0；不是等待新的实验批准。[状态记录](../analysis/vm-install-v18/execution-state.json)。

**独立完成：** 五源文件hash再次匹配；制作 `build/parallels/media/moli-client-probe-v18.iso`，6,713,344字节，SHA256 `ef526c404a4ce264c07530707329ffb2fbea0f2e158809f803b5153c2c349f68`。仅含批准的5文件；ISO9660/Joliet、无启动描述符、无autorun、文件mode0400，专用父目录私有。通过bsdtar内存回读5/5字节/hash一致，没有在主机挂载或执行。官方二进制只在私有build与临时准备目录，未进入源码交付。首次准备脚本在输出前因macOS标准/tmp符号链接被自身guard阻止；确认无ISO/回执后，新版本使用已核实/private/tmp真实路径，保留其余路径检查并成功。不把该实现错误写为审批拒绝。[介质回执](../analysis/vm-install-v18/media-validation.json)。

**恢复点选型/前检：** 当前PVM 23常规文件、6目录，约16.80GiB逻辑大小，可用约222.40GiB；未见symlink/hardlink/特殊文件，单HDD/HDS引用内部、单Shot且ParentGUID为零、无链接克隆标志。配置中已断开的外部Windows ISO不当系统盘依赖；不读取内容。Autoprotect的TotalSnapshots=3不证明已有3快照。运行残留及lsof无输出均不证明已关机。[精确预检](../analysis/vm-install-v18/recovery-preflight.json)。选择正常关机后的完整私有PVM冷副本：新目标、完整文件集/大小/hash/内部引用校验、源不可变，原包不覆盖；冷基线不直接启动。文件级恢复点校验与实际恢复启动分开记录，当前两者都未做，不用前检冒充通过。

下一步仅需恢复合法屏幕访问，核对无未保存工作并执行已批准隔离/正常关机，然后完成冷副本验证。没有复用旧PIN，不强制关闭，不重建环境；登录依赖另行交用户。只在所有执行门槛通过后消耗一次样本启动机会。既有[最小实验计划](../analysis/vm-install-v6/client-experiment-plan.md)继续作为唯一方案。


<a id="v19-isolated-snapshot"></a>
## v19：隔离、正常重启与原生恢复点已完成；样本仍0次

**事实（2026-10-25 22:23–22:53 UTC）：** 用户报告解锁后正常屏幕访问恢复。bundle ID同时匹配已安装与挂载卷中的Parallels；只读进程文件引用确认正在运行的是`/Applications/Parallels Desktop.app`，以完整路径绑定，未重复启动。两处Info.plist现为26.3.3(57507)，与v15的20.4.2不同；本阶段没有安装/更新。严格codesign退出1，`CSSMERR_TP_NOT_TRUSTED`/arm64；原因待验证，不推断恶意或许可有效。Gatekeeper复查`assessments enabled`，未改安全设置。

正常Resume后确认桌面无打开编辑窗口，通过Operations→关闭，先看到Windows“正在关机”，再看到大启动按钮及关闭/重启禁用；无强关、凭据或未保存阻止提示。在关机状态设置网卡“已断开”、安全性“隔离Windows和Mac”=1，七类外部USB全0、相机0、麦克风禁用、Mac打印机共享0；虚拟USB Ehc/Xhc控制器保留。共享/剪贴板页明确显示因隔离不可用，保存的子项仍为1/双向，**不是逐项清零**。XML中未在UI列出的Communication/Other允许标志仍1，USB AutoConnect=0；未接入外设，不声称这些隐藏字段已关闭。隔离语义依据[官方v26说明](https://docs.parallels.com/landing/pdfm-ug/v26-en-us/parallels-desktop-for-mac-26-users-guide/use-windows-on-your-mac/protecting-your-data/isolating-windows-from-mac)，实际来宾网络/共享路径查询尚未运行。[隔离与光盘状态](../analysis/vm-install-v19/isolation-and-media.json)。

**冷副本失败，未掩盖：** 正常关机后对20文件/23,399,602,823字节建立私有预检，系统ditto保留元数据复制到`build/parallels/baselines/Windows11-before-clientprobe-v19.pvm`。独立复核20/20内容hash与快照前源清单匹配，inode独立；严格校验仍失败，27项com.apple.provenance摘要不同，根com.apple.FinderInfo缺失。mode/mtime/ACL无所见差异。副本保留、不启动、不接受为已验收备份，未清除/伪造属性、未放宽guard；快照后源合法改变，旧清单只代表快照前。[精确失败记录](../analysis/vm-install-v19/cold-copy-failure.json)。此前自制复制器8项原创夹具通过但含适用边界mock，因不能保留元数据而停止该路线；系统ditto小夹具曾通过，不等于真实PVM必然通过。

**原生恢复点（与独立备份分开）：** 已关机VM的正常“拍快照”创建`Moli-before-client-probe-20261025-v19`，GUID `{cd6af400-d740-4aac-83f0-b70bbd78cde4}`。管理器重新可见完整名称和“转到”入口；Snapshots.xml state=poweroff。两个HDS均内部常规文件，GUID父链完整、无环/外部引用；快照配置及状态文件hash已记。[核验](../analysis/vm-install-v19/native-snapshot-verification.json)。这是已创建并通过结构核验的本地回滚点，**未执行还原/恢复启动/恢复桌面**，依赖原PVM及其磁盘，不能当独立冷备份。[官方快照方法](https://docs.parallels.com/landing/pdfm-ug/v26-en-us/parallels-desktop-for-mac-26-users-guide/advanced-topics/working-with-virtual-machines/saving-snapshots-of-a-virtual-machine)、[快照限制](https://kb.parallels.com/en/5691)、[完整备份区别](https://kb.parallels.com/en/4859)。需要回滚时先正常关机并确认没有新用户工作，再在同一管理器选这个确切恢复点，不手改描述符、不直接启动失败副本。

挂载既有`moli-client-probe-v18.iso`（mode0400，hash仍为v18值），配置核实CD Connected=1且准确路径、NIC Connected=0、IsolatedVm=1；没有重建介质。正常启动到桌面，无凭据输入，先前镜像Mac桌面文件不再显示。客户机内五文件读取/复制/hash仍未执行，不能把主机挂盘当客户机导入验收。

**当前具体阻碍：** 来宾正常Run窗口可打开，但英文PowerShell文本被中文IME形成候选或截断；未按确认/Return提交，已取消回桌面。单独Shift键被电脑工具拒为`keyPressIncludedNoNonModifierKeys`，是API输入限制，不是安全审批拒绝；未通过其他输入技术绕路。当前无挂起调用、无本轮新的审批拒绝，样本0次。最小后续是将该会话切成英文输入并打开普通权限PowerShell，再核对来宾离线/光盘/目标五hash。已有实验批准继续有效，不需要重问相同范围。[动作与未执行清单](../analysis/vm-install-v19/execution-state.json)。


<a id="v20-first-client-probe"></a>
## v20：首次有界离线执行，创建进程后出现应用故障

**事实：** 使用v18原只读光盘，不新增材料。来宾D:标签MOLI_PROBE_V18；CD五项SHA256均与固定样本一致。`C:\MoliOffline\client-probe`先检查不存在，再以普通权限创建、复制五项，复制后和运行后hash再次全匹配。当前终端为Medium Mandatory Level（S-1-16-8192），没有提权。来宾网卡查询Disconnected；执行前后主机config哈希均为 `1ac24428a6eec086a50b213dafc82b93c8a42a2852bc27fa52bd754ca8145018`，NIC Connected0、IsolatedVm1不变，共享子值保留但隔离下不可用。没有启用共享剪贴板。

2026-10-25 **23:10:07 UTC**从准确工作目录无参数启动唯一cg_se_3000.exe一次，普通Start-Process的NoNewWindow/PassThru模式；PID600，**23:10:23**返回HasExited=True，约16秒是启动调用至退出观察的窗口，非精确CPU运行时长。预设70秒正常关窗/再等10秒的分支未触发，无正常关窗请求、强杀或超时。退出码为空，不记作0。采样画面未见游戏或错误窗口；不能证明从未出现瞬态窗口。

限定Application日志、EventID1000、23:10:07–23:10:24 UTC、Data准确等于样本名的查询得到两条Application Error：

| UTC（秒精度） | 异常码 | 故障模块 | PID | 路径 |
|---|---|---|---|---|
| 23:10:21 | c00001a5 | unknown | 0x258＝600 | C:\MoliOffline\client-probe\cg_se_3000.exe |
| 23:10:22 | c0000005 | unknown | 0x258＝600 | 同上 |

只提取事件编号/时间/模块/异常码/PID/应用路径；未导出完整日志、读取崩溃转储、注入或抓包。`c0000005`的通用含义为访问违例，不能据此确定本样本根因；[微软说明](https://learn.microsoft.com/en-us/shows/inside/c0000005)。`c00001a5`本轮保留原始值，不用未核实映射作根因解释。已证实“进程创建且故障退出”，**未证实ARM模拟、资源缺失、只读属性、无参数交接或保护机制哪一项是原因**。

**收尾：** 直接后代ParentProcessId=600查询未返回当前进程；不是完整后代时间线。目录含隐藏项的检查仍仅五文件、大小和hash不变，属性ReadOnly/Archive；不扩大为系统无其他写入/持久化的结论。未取得活进程模块清单、根进程数值退出码、调用栈或协议证据。VM留在普通PowerShell、断网隔离；恢复点未还原，失败冷副本未动。没有新审批拒绝、挂起工具或第二次样本执行。

**下一步：** 静态调查可读GetCommandLineW路径（0x1179000附近），与登录器CreateProcessA 0x408589及CGSharedMem交接对应；当前证据仍未闭合到游戏socket与分帧。不能补造参数/票据。若需要新的动态实验，先说明准确材料、参数、观察方式和风险再取得新范围；本次一次授权已消费。[原始有限记录](../analysis/vm-install-v20/run-observation.json)、[三次文件核验](../analysis/vm-install-v20/guest-files.json)、[最终隔离](../analysis/vm-install-v20/isolation-final.json)、[实际命令](../analysis/vm-install-v20/commands-observed.json)。


<a id="v21-launcher-preparation"></a>
## v21：启动器单次观察获批，介质完成，屏幕步骤未执行

**事实（2026-10-26）：** 用户00:11 UTC批准固定三文件、Win7双EXE设置、新恢复点，以及仅POLCN_Launcher.exe一次管理员启动和已识别固定hash内嵌LauncherUpdater.exe自动运行，合计最多90秒；00:12要求重新询问，00:13随即更正。按最新更正保留本次明确批准，不解释为未来无限提权、联网或任意程序许可。没有启动器启动、UAC接受或本次实验产生的子进程，额度未使用。来源风险与已有Windows身份风险保持原披露；不读秘密、不点更新/登录/游戏、不批准其他UAC/程序、不修改Gatekeeper。

**阻碍：** 本轮首次`cua.getState`返回apps空、`The Mac is locked and automatic unlock could not unlock it`。仅记录工具报告，不断言用户实际屏幕锁定；精确检查秒数未保留。本轮未重复UI调用、没有挂起工具、VM修改、关机/重启、新恢复点、兼容设置或导入。恢复访问后仍须先核对真实窗口/会话；若需Windows登录则停下，不复用旧PIN授权。[执行状态](../analysis/vm-install-v21/execution-state.json)。

**独立准备通过：** 用户POLCN_Setup.exe来源的原始POLCN_Launcher.exe、XML/GameList.xml、XML/RegionList.xml三份源hash与固定计划一致；已生成私有`build/parallels/media/moli-launcher-probe-v21.iso`，921600字节，SHA256 `7933b0476c06405ff969fcc9531eda70afd6db41e84432299e0e1599d3fa780d`。ISO9660/Joliet、mode0400、无启动描述符/autorun，原XML相对路径保留，恰好三文件逐字节回读通过。未主机挂载/客户机挂载/复制，官方内容不进入源码交付。[介质核验](../analysis/vm-install-v21/media-validation.json)。

首次制作已经写出ISO，但旧的纯文件列表检查把无尾斜杠XML目录误算作文件，脚本退出1且未写回执。这是校验器缺陷，不是审批拒绝或镜像内容失败。随后只读核对文件类型、精确成员集与3/3字节，不重建、不覆盖镜像；构建脚本同步修正但未再次执行。可重现只读验证脚本保留，不以失败重试为由重复创建材料。

**有限配置观察：** config.pvs hash仍为`1ac24428a6eec086a50b213dafc82b93c8a42a2852bc27fa52bd754ca8145018`，NIC Connected=0、IsolatedVm=1，CD仍指向旧v18介质。这只是磁盘配置，不能代替当前来宾/界面隔离核验；不推断运行/关机状态。[配置白名单结果](../analysis/vm-install-v21/config-observation.json)。

下一步在屏幕访问恢复后按[唯一实验计划](../analysis/vm-install-v6/client-experiment-plan.md#v21-launcher-authorization)继续；必须建立并核验新的恢复点，不以旧v19或失败冷副本替代。监测子进程不等于事前拦截；遇到批准外自动程序即停止进一步动作，保持离线并报告。尽早正常关闭，不能正常结束则报告，不强杀/强制关机。初始界面/报错成功也不能解决认证回调/游戏消费者或证明官服可玩。


<a id="v22-launcher-preparation-result"></a>
## v22：新恢复点与导入完成，启动结果不明后停止

**事实：** 用户00:18 UTC报告解锁后，CUA重新看到既有Parallels Windows11桌面。正常关闭来宾并观察关机完成，没有未保存提示或强关。原生快照`Moli-before-launcher-probe-20261026-v22`（GUID `{7d7de628-ef85-4b19-873d-99071422ea2b}`）在管理器可见，关机状态、内部三层盘链、配置、快照文件和介质hash通过核验；随后正常重启直接到桌面，没有凭据输入。[恢复点回执](../analysis/vm-install-v22/native-snapshot-verification.json)、[核验器](../analysis/vm-install-v22/verify_native_snapshot.py)。

**恢复边界：** 这是同一PVM内部原生恢复点，不是独立备份；未执行还原/还原后启动。快照保留旧v18只读CD依赖（SHA256 `ef526c404a4ce264c07530707329ffb2fbea0f2e158809f803b5153c2c349f68`），需保留该介质。快照文件hash是关机时的证据，不把重启后的活动盘变化当损坏。

**导入通过：** 配置CD选择框没有响应，未生效；通过正常“设备→CD/DVD→连接镜像”菜单接入已核验v21只读ISO。来宾`D:`标签`MOLI_LAUNCH_V21`、类型CD-ROM。`C:\MoliOffline\launcher-probe`原先不存在，复制后仅本次默认常规文件枚举返回三文件，CD/目标均3/3 hash匹配。界面网络为断开、Mac隔离选中，来宾`Get-NetAdapter`显示Disconnected；最终config.pvs白名单仍NIC0/IsolatedVm1，CD为v21。可见USB类别/摄像头/麦克风/打印机关闭，虚拟键鼠控制器保留；USB隐藏Communication/Other标志保留，不能说全部字段为0。[来宾文件核验](../analysis/vm-install-v22/guest-file-validation.json)、[准备观察](../analysis/vm-install-v22/ui-preparation.json)、[最终配置](../analysis/vm-install-v22/final-config-observation.json)。

**失败与结果不明：** 约00:41 UTC在启动器属性中选择Win7，但OK/Apply低于可见区域。`Alt+Space`后未见系统菜单，助手连续发送Escape和Return，未在两键间观察。之后为Explorer选中文件；重新打开属性发现兼容框未勾选、默认Windows8禁用，说明Win7未保存。**推测**：Escape可能取消属性页，Return可能激活EXE；是否实际执行无法确认。未见/接受UAC，未有意提交启动命令，未出现可见样本窗口。不能将其记为0次，也不能认定已执行一次或已通过90秒实验。[执行状态与按键顺序](../analysis/vm-install-v22/execution-state.json)。

**有限收尾：** 约00:47 UTC普通权限查询POLCN_Launcher、LauncherUpdater、cg_se_3000没有返回行（SilentlyContinue限制保留）；默认递归文件枚举返回原三文件，hash未变，没有在该枚举中发现Updater。当前无进程/文件不变都不能排除短暂执行或其他系统写入。限定1000/1001、00:39–00:44 UTC故障事件查询输入被IME改写，Escape/Ctrl+C取消、未提交，没有日志查询结论。未再启动、未强杀、未联网、未读凭据；当前停普通PowerShell提示符，没有挂起工具。

**下一步：** 先向用户如实报告可能启动和未保存Win7前提，不把旧批准仍未使用当事实。现有普通只读证据不足以证明从未运行；不通过再次运行来验证。若用户决定继续，应明确限定新的观察并说明本次不确定性，先解决可见的兼容保存/输入步骤；无须重建环境或再次制作材料。当前未得到启动器初始界面/报错结论，更未验证认证、游戏或官服。


<a id="v23-launcher-initial-probe"></a>
## v23：启动器离线更新检查报错，单次执行已结束

**事实与授权：** 用户00:58 UTC在获知v22可能短暂激活后，批准再一次相同范围观察；01:20确认两EXE Win7设置并要求不重复检查。启动器此前已由助手保存Win7并重开确认，后续两者状态采用用户确认；管理员运行勾选在用户接管中改变，助手没有再修改。输入恢复后，文件选择与正常关闭Explorer通过；启动前指定三进程无返回行。v22恢复点及其两份非活动父盘在01:00:25–01:01:00 UTC复核hash一致，未新建快照或测试还原；原三源、v21/v18介质与固定内嵌Updater身份一致。

**实际运行：** 普通PowerShell构造固定目录`C:\MoliOffline\launcher-probe`与`POLCN_Launcher.exe`路径，`Start-Process -WorkingDirectory ... -Verb RunAs -PassThru`仅提交一次。提交01:27:02.434 UTC，01:28:04.205点击已核实完整路径的UAC“是”；发布者显示未知，与未认证来源风险一致。返回PID2132，来宾Process记录StartTime为09:28:05、ExitTime为09:29:19（本地UTC+8），HasExited=True、ExitCode=-1，即UTC **01:28:05–01:29:19 / 74秒**。

**界面与关闭：** 自动出现“正在检查更新”进度及`POLCN_Launcher`标题的“网络错误：12007”；01:28:57.647请求正常X关闭后，出现“错误 / 更新检查失败!”；再次正常X关闭后样本窗口消失，Process查询确认退出。没有主动点击更新、登录或启动游戏，没有强杀、重启、提权其他程序或再次运行。未观察到LauncherUpdater进程窗口；这不能证明它从未短暂执行。

**计时失败与报告延迟：** 目标进程寿命74秒是已观测事实，但提交至退出含UAC等待约137秒，**违反本次90秒观察约定**，不能用较短进程寿命替代完整验收。实际运行结果未及时回传，父会话多次追问后才获得结论，回报延迟也记为执行流程失败。独立计时在94秒读到首次错误时已超过以提交为起点的90秒，本轮立即正常收尾。没有连续采集子进程寿命，不能把目标进程74秒等同整个进程树均已验收。今后有界实验应在UAC耗时过长时取消尚未接受的请求，预留正常关闭时间；不能用计时失败作为重试许可。

**有限收尾：** 当前三指定进程与ParentProcessId=2132的直接子进程查询均无返回行。根目录与XML目录的Force元数据枚举显示原三文件，以及新增`Log.htm`619字节；原三文件运行后hash全部匹配既定身份。未读取日志正文，也未导出完整系统日志/账号数据。当前负结果不证明没有历史后代或其他磁盘/注册表写入。最终配置仍NIC Connected=0、IsolatedVm=1，v21只读CD接入；没有挂起调用。

**推测与未知：** 微软WinINet将12007定义为`ERROR_INTERNET_NAME_NOT_RESOLVED`；该含义与离线更新检查失败相符，但本轮没有捕获API/请求/目标地址，不能据错误值断言具体域名状态或官服故障。[微软错误定义](https://learn.microsoft.com/en-us/windows/win32/wininet/wininet-errors)。未进入登录主界面、未证明认证/IPC/游戏/官服兼容；不据此判定ARM或Win7模式无效。

证据：[单次运行与有限收尾](../analysis/vm-install-v23/run-observation.json)、[最终隔离配置](../analysis/vm-install-v23/final-config-observation.json)。本轮已静态定位首次更新请求失败→提示→退出-1，见[错误路径及网络边界](launcher-static.md#launcher-v23-update-failure)；进一步联网或样本运行须有对应明确范围，当前本次额度已使用。产品实现/接口/资源格式未变，历史25 Node/8 Python/16 Swift测试不重跑，不冒充本轮验收。


## stage39：动态诊断可执行性准备，尚不具备原样本启动条件

**已实际完成：** 只用既有固定CrossGate安装包（SHA256 e593e47f…1982f983），innoextract离线排除temp后成功解出2367文件/2,626,083,970字节，耗时42.514秒；新私有`build/analysis/diagnostic-material-20261026-_9d1ephh/source`，全部样本文件0400。没有运行Setup或任何包内程序、导入/安装VM或联网。九个候选代码/组件的完整来源/hash/PE目录见[材料回执](../analysis/diagnostic-preparation-v1/source-material.json)。ApexClient.Dat为500154B、SHA25689fe1c4a907a06c68630b326c339240048272c927599f4e35aeaac8a39ca213c，普通头检查未识别PE，未解码或推断为特定反作弊/无害数据。

**实际接口准备：** 真实固定GameList按GB18030读取，显式裸&兼容共5处，解析5条游戏/两个Code11（ordinal3、4）。现有共享核心对完整源选定代码metadata核对client/patch/config/special四项均匹配旧hash；历史五文件模型只覆盖client、缺另外3项。此检查针对主机源材料，不是新读取的来宾安装清单；完整源也不证明当前版本/资源/注册表/就绪。[实际数据核对](../analysis/diagnostic-preparation-v1/material-assessment.json)，[4个合成准备测试](../analysis/diagnostic-preparation-v1/tests.log)通过。没有复核用户已确认Win7设置。

**只读环境与限制：** config.pvs读到NIC Connected=0、IsolatedVm=1，底层ClipboardSync.Enabled保留1；没有运行时验证，不能从底层值判断隔离失效或从文件设置声称实际分享/会话状态。主机`ps -axo pid,comm`被沙箱以PermissionError/Operation not permitted拒绝，未执行、未换途径重试；没有新的锁屏/运行状态结论。Frida不在当前PATH及明确已查CLI位置，REA-bin --version命令返回127/不存在，不等于证明所有位置都未安装。Mac的LLDB/原先Frida安装不能证明Windows ARM64/x86仿真来宾可附加。来宾CIM/WER曾可用，只能回答生命周期/模块/故障，未确认Windows API观察器。

**可行路径与必须的具体范围：** 先在无账号、自然退出的原创目标验证具名Windows观察器、架构适配、仅API名/模块偏移输出和停止方式，再提出固定原程序正常派生观察。普通CIM/WER或初始窗口不够；若正常派生要求登录/既有会话，当前限制下停止，不能伪造参数/映射。本轮还不能给出可立即执行的真实游戏观测包。

后续材料导入应为保持布局的完整app资源，新来宾私有目录（计划标签`C:\MoliOffline\game-candidate`，并非已观察安装路径），启动器/两XML分开存放，不运行Setup、不覆盖旧探针/用户安装，排除两个非Code11客户端的导入/执行。固定cg_se_3000/Config/Patcher/CG5Reg及四DLL、Apex的候选hash已列；配置/Patcher是条件路径，SpeFile存在不等于必定执行，未知组件加载必须明确。当前HKCU/INI未读取，不默改注册表或原用户配置。

网络仅已知`launch.polchina.com.cn:80`更新HTTP/DNS；真正初始化可能访问先前列出的清单/XML。不能直接开放无边界NAT；首轮须先独立核验当前摘要，并在可执行之前对新载荷/未知域/重定向/launcher_url.dat更新定位实施可靠限制，不能把事后进程监测说成事前拦截。游戏/区服/门户认证端点不在此更新范围。WinINet cookie/代理等状态未观察，不能保证无账户相关外传。没有部署这些限制或改变网络。

**数据、停止与耗时：** 候选观测仅进程/模块身份/寿命及API调用点/返回地址，不采参数、映射内容、账号/票据、缓冲/通信负载、内存转储或全日志。调试检测/反作弊/访问拒绝、新程序/驱动/UAC/条款/登录/越界网络即停，不隐藏或绕过；没有经演练的真实程序限时停止机制，不重复承诺90秒，正常关窗失败不能强杀/强关。已测材料准备43秒；下一只读工具检查在桌面可用时预算1–3分钟，找不到能力即停。真实观测/协议恢复目前没有可信总耗时保证。元数据定位仍无法还原受保护缺失代码或帧/认证，最终需要合法可分析材料或权威/获许可的语义向量。[完整可审阅范围与未闭合项](../analysis/diagnostic-preparation-v1/diagnostic-plan.json)。


## stage40：普通来宾工具检查被屏幕访问状态阻断

**已执行/阻碍：** 2026-10-26 06:09:48 UTC（错误返回后读取时钟）复用既有`launcherVM`绑定调用`getAXState`，工具返回“Mac is locked and automatic unlock could not unlock it”。这是工具报告，不断言用户实际屏幕锁定；未进入来宾工具/帮助检查、未执行来宾命令、未读凭据，亦未重试/换路或重做stage39被拒的主机ps。无挂起调用，未启动/重启虚拟机或官方程序，未改网络/共享/安全设置。[精确状态及最小恢复动作](../analysis/diagnostic-preparation-v1/guest-tool-check.json)。在恢复普通屏幕访问前，不能给出已验证的Windows ARM/x86 API观察器，也不能宣布其未安装。

**独立准备：** Apex标准gzip头和CRC/ISIZE已核实，内层706686B格式与加载角色未知；此结论更新stage39的“未识别头/未解码”历史状态，不据文件名或高熵断言反作弊。原创Windows x86合成诊断源码及只收元数据的schema已准备，6/6主机测试通过；没有编译/导入/来宾运行或实测观察器。源码仅使用自己的合成命名映射、不访问缓冲，正常清理自然退出；等待时长不保证进程停止。[源码和边界](../analysis/diagnostic-preparation-v1/synthetic-readme.md)。

**下一最小步骤：** 主会话协调正常屏幕访问恢复后，只检查具名来宾工具存在性/帮助；不安装、提权、附加官方进程或将CIM/WER元数据写成协议证据。用户确认的两EXE Win7设置没有再查。游戏消费者、无需登录可达性、事前网络/子进程限制和可靠停止均仍未验证。


## stage41：屏幕输入检查与本地非GUI接口边界

**06:47后实际界面状态：** 用户报告解锁后，既有Windows11绑定的AX/截图读取恢复，普通PowerShell画面可见；坐标点击两次返回`windowNotFoundAtPosition`，一次typeText无可见查询文字。未按Enter、未提交来宾查询；菜单只查看后取消，未启动/停止VM或改设置。不是仍锁定，也不是新的审批拒绝；具名观察器仍未核实。后续按用户方向停止屏幕探测。[有限操作记录](../analysis/diagnostic-preparation-v1/guest-tool-followup.json)。

**06:58后纯本地核验：** 命令实际在Darwin/arm64、macOS27.0.1/26A434，cwd及解析后路径为`/Users/lx/Documents/code/moli-mac`，README存在。硬件型号sysctl查询被沙箱以Operation not permitted拒绝，未重试/换路；没有据此声称核实具体芯片型号。应用Info.plist为Parallels26.3.3(57507)，这是静态应用版本，未运行CLI的--version。CLI为arm64+x86_64通用Mach-O，但`codesign --verify --strict`对prlctl报“invalid signature (code or signature have been modified) / arm64”；没有执行它，不据此断言恶意。

**已证正常接口与当前阻碍：** 随附2026-05-14手册@202列出`prlctl exec <VM> --current-user <command>`，要求来宾安装Parallels Tools；当前许可证/版别、Tools健康、实际令牌、锁屏时可用性均未实测。`/usr/local/bin/prlctl`实际指向parallels_wrapper，运行help前也会通过is_running调用主机ps；还存在初始化/启动服务路径。未调用包装器或换成直接二进制规避限制。prlexec为shell转调同一入口且可自动启动VM，不是独立避路。只读取随附帮助文本，不执行任何来宾命令、不建立持久权限或改网络/安全。[文件hash、代码行号、签名及候选范围](../analysis/diagnostic-preparation-v1/local-cli-feasibility.json)。

**最小下一步：** 先解决可信CLI来源/完整性与标准入口前置动作的授权边界；之后另行明确批准固定VM、--current-user、无凭据的一次无副作用回显和具名工具查询，不默认允许默认用户/提权、启动VM、服务初始化或被拒ps。该管理接口是候选正常工具通道，未验证之前不能保证不受主机或来宾锁定影响；不修改锁屏保护，不复用旧PIN。


## stage42：官方修复/重装方案只读核查

**本机事实：** 当前`/Applications/Parallels Desktop.app`仍26.3.3(57507)；`Contents/MacOS/prlctl`与`parallels_wrapper`摘要与stage41一致，故既有arm64签名完整性失败及包装器ps/初始化前置风险仍未解决。本轮不执行CLI或重做被拒查询。官方[26版更新记录](https://kb.parallels.com/en/131014)确有26.3.3(57507)，但版本文字匹配不能认证安装字节；同页26.5.0及[27正式版说明](https://www.parallels.com/blogs/parallels-desktop-27/)也不证明用户免费升级资格。27明确声明macOS27支持，不能由此倒推26完全不支持。

**保留范围：** `/Users/lx/Parallels/Windows 11.pvm`存在且非符号链接；配置引用内部harddisk.hdd，v19与v22两个具名快照仍在，描述符三hds文件存在、非symlink且解析后均在本PVM内。只查元数据，不读内存/来宾日志；vm.lock及内存文件名不是已关机证明。尚未正常关机、冷复制或实测恢复。未来应在正常关机和退出应用获准/核实后复制整个PVM，保留配置/NVRAM/快照树/所有磁盘层，核验空间与冷副本身份，不只备份活动hds、不合并快照。官方[备份说明](https://kb.parallels.com/en/4859)建议关机并整包复制；本检查仍不构成所有外部/加密/TPM依赖已验。

**官方路径及许可门槛：** [KB124255](https://kb.parallels.com/en/124255)区分应用移除和PVM删除，说明升级可由安装器替换应用，无需预先卸载；不采用其清空废纸篓步骤。[KB124250](https://kb.parallels.com/en/124250)允许复用已有VM并要求先备份。已查资料没有提供已验证的单独CLI修复包，不手动拷贝/改签名补组件。官方[CLI指南](https://docs.parallels.com/landing/parallels-desktop-developers-guide/command-line-interface-utility)面向Pro、Business/Enterprise，[exec](https://docs.parallels.com/landing/parallels-desktop-developers-guide/command-line-interface-utility/manage-virtual-machines-from-cli/general-virtual-machine-management/execute-a-command-in-a-virtual-machine)要求Tools；用户现有版别/覆盖版本/Tools健康未知，Standard重装不等于得到受支持CLI。

**真正需要后续确认：** 先由用户仅确认许可版别/覆盖版本，不发送密钥；再选择官方适配的固定安装版本。官方[下载入口](https://www.parallels.com/products/desktop/download/)含试用/购买/既有许可下载分支，本轮未启动；[当前EULA](https://www.parallels.com/about/legal/eula/)自述下载/安装/使用视为接受，实际适用版本/许可仍需用户确认，不作法律有效性判断。[安装流程](https://kb.parallels.com/en/130231)涉及管理员认证及可能的文件夹/辅助功能/全磁盘访问，新权限按实际精确范围报批，不笼统接受。正常关机、私有冷备份、固定应用替换、适用新条款/标准管理员安装分别要有具体范围；不重建Windows，不购买/试用。重装也不自动授权包装器被拒ps或初始化，需核实新标准入口并明确其权限后才可调用。未来无凭据回显/具名工具查询实测前不承诺免锁屏影响。

[完整来源、路径、摘要、快照/磁盘引用与步骤回执](../analysis/diagnostic-preparation-v1/official-repair-assessment.json)。本轮实际只有本地只读文件/公开官方文档；无GUI、软件二进制下载、CLI/来宾/样本执行、安装/卸载/新许可/购买、VM启动/关机/备份、安全或网络变更，无挂起调用。


## stage43：用户要求自行查询许可，当前只读界面访问阻断

2026-10-26 11:55:48 UTC（UI错误返回后读时钟），复用既有Windows11窗口以emit:false读取AX，工具报告“Mac is locked，automatic unlock could not unlock it”。未进入关于/账户与许可页、未截图/启动应用，未重试或换路。这是工具报告，不能断言用户实际屏幕状态或把它当成许可无效。

独立只读应用Info.plist确认`com.parallels.desktop.console`、26.3.3(57507)；顶层键名按edition/license/subscription/expiry相关模式搜索无匹配，不能证明已激活版别、到期、覆盖版本或升级资格。没有读取许可证/凭据文件、Keychain、密钥/令牌/密码，没有执行异常CLI、被拒ps/硬件查询或变更系统。无需用户研究许可或发送密钥；最小依赖是恢复正常屏幕访问并保持可见，原关于/许可只读授权继续有效，届时只查非敏感字段。[本轮结果与未执行项](../analysis/diagnostic-preparation-v1/license-check-blocker.json)。无挂起工具。


## stage44：接受用户Business版确认，仅剩订阅/覆盖条件未知

用户于2026-10-26 11:57 UTC确认“商业版”，当前按Business接受，不重复核对Standard/Pro/Business，不把历史stage43未知版别当当前结论。官方[2026升级保证说明](https://kb.parallels.com/en/131167)明确有效Business订阅可升级最新版；这是附有效状态条件的政策，未查询本用户订阅。官方[Business/Enterprise更新说明](https://kb.parallels.com/en/130247)还说明企业IT可禁用大版本升级，版别本身不证明管理员许可或当前升级激活资格。

剩余未知只包括当前有效/过期状态、续期/到期、具体版本覆盖和企业大版本策略。没有新的屏幕访问恢复证据，本轮不再探测UI，也不改读密钥/许可证或凭据文件。将来普通界面安全可读时由助手查这些非敏感字段；若无法取得继续明确未知，不让用户重新研究版别、不发送密钥，不安装/购买/执行异常CLI或改变设置。[当前确认及官方条件](../analysis/diagnostic-preparation-v1/business-license-status.json)。本轮仅公开政策核对，无挂起调用。


## stage45：完整路径消歧成功，来宾工具存在性仍未验

**事实：** 复用v19知识库，通过工具支持的完整路径`/Applications/Parallels Desktop.app`绑定到同一Windows11窗口`{b0583b09-10ab-47dd-99c2-bc80be499944}`，AX与截图可读；没有重做旧ps/进程文件引用、启动另一份应用或弹出安装卷。一次REPL变量不存在，经顶层完整路径重绑定后可读，根因未定，不等于Windows或审批错误。

用户13:10手动打开开始后，观察到Windows开始/搜索热门应用面板；在可见“设置”图块一次点击，工具完成，但随后仍为原面板，没有确认设置窗口出现。导航结果未确认，已停且未重复点击/输入；尚未到工具清单或帮助，API Monitor/WinDbg/Frida/Process Monitor名称、版本、能力均未验，也不证明不存在。未保存截图/账户内容、提交来宾命令或执行样本。当前只保留正常GUI路线，CLI及其修复/重装查找已取消，Business与Win7采用用户确认。无安装/下载/UAC/网络/安全设置变化或挂起工具。[本次只读操作与精确边界](../analysis/diagnostic-preparation-v1/gui-tool-presence-followup.json)。


## stage46：WinDbg ARM64离线部署核查，尚未形成就绪安装包

已只读确认Windows已安装列表显示29项，先前10可见项包含Parallels Tools26.3.3.57507；用户输入windbg后全驱动器应用注册列表无匹配，不排除SDK/便携副本。工具版本/能力未验证，不再要求用户逐项搜索。

[微软安装说明](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/)支持Win11 ARM64，并明确直接/Store安装后台自动更新。Mac仅读取官方HTML并从真实下载锚点取得aka.ms/windbg/download，其HEAD重定向至`https://windbg.download.prss.microsoft.com/dbazure/prod/1-0-0/windbg.appinstaller`，最终HEAD403。已停止，不改用GET/换源/修改TLS或User-Agent；无工具二进制下载。脚本退出0但回执status=stopped，不能当核验通过。当前精确版本/完整包大小、依赖/实际条款未取得。

微软WinGet公共清单另有固定旧版1.2506.12002.0，ARM64条目指向`.../1-2506-12002-0/windbg.msixbundle`并公布InstallerSha2567E7F01AE…69308A1E；未访问该包、验证签名/大小或选择它替代当前版本。[已验证来源与完整摘要](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json)。本地MSIXBundle经Windows App Installer GUI部署有[官方文档依据](https://learn.microsoft.com/en-us/windows/msix/desktop/managing-your-msix-deployment-enterprise)，但App Installer现状、框架依赖和逐用户权限仍需确认；不能据通用安装机制宣布WinDbg包可完整离线安装。

完整有界提案已列在回执：先取得合法可访问的固定官方包，在Mac离线验签/检查ARM64成员、依赖和实际许可；再经确认恢复点、断网/共享关闭及只读ISO导入，仅普通权限GUI安装，新增条款/UAC/服务/信任要求即停。之后只调试已有原创合成源码的经审阅x86构建，不附加官方进程、不TTD/转储/符号服务/账号或缓冲读取。现无编译好的夹具、可靠GUI继续/关闭手段，也未从本轮核实适用许可，故尚不能直接进入“一次安装并演练”。不把旧Windows许可或未知Parallels到期当当前下载方案依据，不恢复CLI路线。无VM动作、安装/提权、网络/安全变化或挂起调用。


## stage47：一次可见按键测试通过，未改环境

当前完整路径绑定仍为既有Windows11窗口。可见已安装应用搜索`windbg`有焦点，唯一短标记`x`（按下120ms）读回`windbgx`及中文IME候选；单次BackSpace清除后读回原`windbg`。中间输出截断先只读核查，没有重发输入。AX仅为Mac包装窗口，未冒称取得来宾控件树。返回图像是JPEG3456×2010，旧PNG偏移运算无效，不据此归因DPI。当前聚焦物理键盘路线验证通过，鼠标/typeText/多步骤导航和正常停止调试器仍未验证；根因未隔离。没有新权限、安装、重启、CLI、样本或安全/网络设置变化，无挂起调用。[精确记录](../analysis/diagnostic-preparation-v1/gui-tool-presence-followup.json)。

仅阅读微软安装文档与RFC9110，确认Store GUI、WinGet及直接安装是正式路线。此前清单HEAD403只记录请求拒绝，原因未知；没有微软证据确认是HEAD方法限制，没有向拒绝端点换GET/代理/源重试，也未下载工具。Store不是已验证离线包：未来如采用需具体批准临时VM网络、真实条款和安装范围。当前仍无完整包/依赖/条款与已编译原创x86目标，不进入安装或原程序观察。[来源、条件与未决](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json)。


## stage48: Store attempt stopped before network enable

v19/v22 snapshots are visible; v22 Go To exists and three disk layers are internal/non-symlink. Restore remains untested. Task Manager Details committed launcher and cg filters each showed no results, then closed normally. Isolate Windows and Mac remains checked; sharing entries disabled.120ms right/left clicks and guest search worked; modifier shortcut and native network popup did not. Source stayed Disconnected; child selection returned server-10005 cannotClickOffscreenElement. Stopped, no retry/config write. Final Connected0, IsolatedVm1, ShareAllMacDisks0, ShareUserHomeDir0. No network enable/restore, Store navigation/install, new terms/login/UAC, samples/fixtures/debugging or pending tool. A minimal handoff would only open the current Source dropdown and leave it open, without connecting. [Evidence](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json).


**stage49 bounded follow-up:** Exact existing configuration window rebound. AX showed focus18 on Source:Disconnected; one120ms Tab caused no AX/focus change and no visible popup was established. Stopped without repeating keys or selecting hidden options. Final NIC Connected0 and IsolatedVm1 confirmed from config. Store not opened/installed; no new prompts, changes or pending tools. Cause remains unknown, not an approval denial; no user handoff or extra approval requested. [Receipt](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json).


**stage50 / network restore requested:** Latest user goal overrides temporary-install disconnect cleanup: restore network and leave connected; no software/game actions. One exact-path getApp returned tool-reported Mac lock before window/menu access. No network change or retry. Read-only file metadata Connected0/IsolatedVm1; live Windows connectivity not observed. Pending tools0. Need normal manual Mac unlock and one fresh access check; no extra approval or credentials. [Receipt](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json).
