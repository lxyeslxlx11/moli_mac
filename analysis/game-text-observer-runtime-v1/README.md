# 原创固定代码段工具的Windows实测与资格

<a id="stage138"></a>
## stage138：已有转储固定64B读数与比较完成

[输入/前检](access-stage138.json)记录本轮实际恢复、长行取消、短行逐次回读及dump/CDB身份；[查询与比较](code-fingerprint-stage138.json)记录一次-z、固定两段各32B、退出0、日志8880B/74行与完整hash。初始化候选32B未捕获，故障32B与任意delta所选源参考31B不同，原件精确32B/26B后缀搜索均0；不扩大内存读数或解释未知代码。

原dump前后SHA相同、结束进程0并保留空提示符，没有重放已用游戏运行/读取器或采集新转储。原始dump/日志留来宾，有限hex投影留私有build；公开交付只有地址/摘要/边界。没有产品代码、测试/构建或新的REA会话。完整消费者、可玩实现和三平台/官方接受仍未完成，goal active；[目标与接续](goal-audit-stage138.json)、[分析](../../reports/game-static.md#stage138)、[唯一排障](../../reports/known-issues.md#stage138-fingerprint)、[验收](../../reports/validation.md#stage138)、[文件核验](validation-stage138.json)、[交付](../delivery-manifest-stage138.json)。下方保留历史。

<a id="stage137"></a>
## stage137：固定游戏指纹比对未执行

主机从固定原件准备两个32B参考点；一个opaque指针对算出的delta不证明主映像重定位，原主模块历史地址仍400000。既有Windows画面/菜单Win+Q可响应，普通来宾输入没有确认，本轮0命令/0CDB/0游戏/0dump字节；没有新采集、配置或人工请求，不能把屏幕中的stage132结果算本轮证据。[准确记录及后续身份前检](access-stage137.json)、[唯一排障](../../reports/known-issues.md#stage137-input)。

另有当前登录器更新参数的真实REA/纯核心进展，完整目标保持active；不是游戏消费者或可玩验收。[本轮审计](../launcher-update-arguments-v1/goal-audit.json)、[结果](../../reports/validation.md#stage137)。

<a id="stage136"></a>
## stage136：完整目标已恢复，未重放游戏诊断

用户恢复active后，本轮找到并完成已证登录器profile的页面/本机服务接线，旧135全目标耗尽解释已纠正；既有游戏运行/转储回执仍是历史已用结果，没有新CUA/VM、读取器/CDB、游戏/转储或外部服务器操作。[完整目标](../launcher-current-page-v1/goal-audit.json)、[现行登录器验收](../../reports/validation.md#stage136)。游戏业务消费者仍未知，不以本地合成认证或新报告替代。

<a id="stage135"></a>
## stage135：当前材料缺口达到停止重复门槛

本轮仅复核材料/交付一致性与当前REA无存活分析状态，没有CUA/VM、游戏/读取器/CDB、转储或网络操作；原运行不重放。133/134/135同一业务证据缺口连续三轮，完整目标未完成，goal已标记为blocked。[阻塞审计](../game-material-gzip-v1/blocked-audit-stage135.json)、[实际状态](../game-material-gzip-v1/goal-status-stage135.json)。等待实质新匹配材料、协议/脱敏向量或可绑定的读取源后再接续，不新增演示玩法替代。[需求](../../reports/development-plan.md#stage135)、[验收](../../reports/validation.md#stage135)。

<a id="stage134"></a>
## stage134：材料历史纠正，无新运行

stage40已核同一Apex gzip；stage133实际新增有界工具/测试与格式检查，首次发现表述已纠正。本轮仅核对旧记录和四DLL直接文件名/基名，16项均0，没有新游戏消费者。没有CUA、VM/游戏/读取器/CDB运行或转储读取；旧运行均不重放。[审计](../game-material-gzip-v1/continuation-audit-stage134.json)、[验收](../../reports/validation.md#stage134)。当前完整目标未完成、同一材料缺口计2，goal仍active，没有live分析作业等待。

<a id="stage133"></a>
## stage133：沿材料缺口补查普通gzip候选

本轮没有新来宾操作、游戏/读取器/CDB运行或转储读取。stage132之后复核stage40已知的ApexClient.Dat完整gzip成员（并非新材料发现），项目内辅助工具10项原创测试通过，实际500154B→706686B、CRC32/ISIZE一致、原件未变。[格式回执](../game-material-gzip-v1/inspection.json)、[材料分析与REA格式拒绝](../game-material-gzip-v1/material-audit.json)。完整成员仅留私有build，内部格式/架构/职责和业务消费者关系仍未知。

[完整目标审计](../game-material-gzip-v1/completion-audit.json)保留登录器、游戏实现、三平台及官方接受未完成，不把普通工具或容器资格当协议。新的路线耗尽区间从133计1，goal仍active；旧账号/PDB答复和授权保留，没有人工请求或live分析作业等待。[格式/工具复现](../../reports/resource-formats.md#stage133)、[验收](../../reports/validation.md#stage133)、[文件核验](../game-material-gzip-v1/validation.json)、[交付](../delivery-manifest-stage133.json)。下方为历史阶段结果。

<a id="stage132"></a>
## stage132：启动间接调用来源与76B既有栈数据核对

[事先范围](indirect-flow-plan-stage132.json)限定两个间接调用的生产者/参数来源。REA新增5份函数调查、10处指令和1份引用记录；10处指令与原字节一致，56B/14DWORD记录及注册回填到初始化指针的路径已明确。完整REA包留私有build，公开[有限静态摘要](indirect-flow-stage132.json)含记录ID/哈希/偏移及截断、默认签名限制；不附大段反编译或受保护负载。

[同次转储有限读数](cdb-stack-stage132.json)记录重新核验的dump/CDB身份、十一项参数、一次离线退出0、七行19个DWORD/76B，以及七项局部对应、初始化副本槽同值和局限。原始转储及8822B日志保留来宾，未跟随指针、重新运行游戏或变更WER。已有栈展开警告继续有效，不能由局部吻合确定根因、目标代码归属或游戏协议。

[访问与输入](vm-access-stage132.json)只证明已知VM普通Resume后本轮桌面/终端/短命令可用；最终游戏/CDB进程0、空提示符，未请求人工操作。[分析](../../reports/game-static.md#stage132)、[唯一排障](../../reports/known-issues.md#stage132-stack)、[验收](../../reports/validation.md#stage132)、[文件核验](validation-stage132.json)、[交付](../delivery-manifest-stage132.json)。无新产品实现/测试/构建，rev30和完整三平台/官方可玩目标未完成；下方保留历史状态。

<a id="stage131"></a>
## stage131：一次WER诊断及REA静态地址核对完成

原stage128执行确认已收到；新恢复点/双视图按应用设置/一次普通PID5304运行/恢复/两份小型转储资格及离线CDB读取均有实际回执。游戏6.466299秒自然退出`0xc0000005`，临时父/游戏WER键均恢复不存在，管理员会话正常结束，运行后哈希一致、游戏/CDB进程0。[授权](authorization-stage131.json)、[恢复点](recovery-stage131.json)、[前检](wer-preflight-stage131.json)、[设置](wer-configuration-stage131.json)、[生命周期](wer-lifecycle-stage131.json)、[恢复](wer-restoration-stage131.json)、[文件资格](wer-dumps-stage131.json)、[收尾](wer-postflight-stage131.json)。

两份CDB结果各退出0，异常分别`0xc00001a5 @ 0x0b86db30`、`0xc0000005 @ 0x0b7c8152`，模块记录39且集合相同；两异常均在所列范围外，9/8行候选栈都有可能错误警告。[CDB摘要](cdb-summary-stage131.json)。REA/Ghidra新增24条原文件记录，六个`.text1`候选返回值均核实函数/指令及前一CALL的结束边界，四个直接静态目的地成立、两个间接目标未知。[布局](stack-file-boundary-stage131.json)、[REA摘要及私有bundle摘要](rea-stack-correlation-stage131.json)。完整转储/调试输出仅留来宾，完整静态指令清单留私有build；不加入交付。

本次运行已用，未重跑读取器、附加调试器或新增协议/产品代码；根因、真实调用链、运行时字节一致性与游戏消费者仍未知。[输入与投影修正](input-stage131.json)、[唯一排障](../../reports/known-issues.md#stage131-wer)、[实际验收](../../reports/validation.md#stage131)、[文件核验](validation-stage131.json)、[交付清单](../delivery-manifest-stage131.json)。完整目标与rev30未知项未完成，下方旧阶段保留当时状态。

<a id="stage130"></a>
## stage130：独立前检后等待既有执行时答复

1709项交付仍一致，129的只读前检及收尾结果保留。原128具体问题在三轮中持续待答，本轮没有新UI/来宾操作、REA/消费者或实现进展；无live作业可轮询。[阻塞审计](blocked-audit-stage130.json)、[状态回执](goal-status-stage130.json)。

按审计停止自动重复工作，不重发问题或要求Windows手动操作；实际答复/新证据到来后按[原方案](game-wer-plan-stage128.md)核实时态再接续，不能重放125已用运行。完整目标及rev30未知项仍未完成。[验收](../../reports/validation.md#stage130)、[唯一排障](../../reports/known-issues.md#stage130-wait)、[交付核验](validation-stage130.json)。下方旧阶段描述当时状态。

<a id="stage129"></a>
## stage129：补齐按应用诊断的只读前检

两个显式逻辑视图LocalDumps父/游戏子键均无，AeDebug有而Auto值无；实验目录False，C余量230298329088B，游戏进程0与精确路径/2904064B新核。4个只读句柄已释放，未写配置或启动目标。[前检](wer-preflight-stage129.json)。普通输入中断经同次实时菜单定位原有Win+Q后恢复，稳定性/根因仍未知。[输入](input-stage129.json)、[唯一排障](../../reports/known-issues.md#stage129-input)。

[原小型转储方案](game-wer-plan-stage128.md)的执行时问题仍待答复，新恢复点/设置/启动/采集未执行；无新REA或消费者、产品/测试/构建变更，rev30与完整目标未完成。[验收](../../reports/validation.md#stage129)、[交付核验](validation-stage129.json)。下方旧阶段描述当时状态。

<a id="stage128"></a>
## stage128：原两份 WER 材料已检查

普通输入实际恢复，两归档各只剩Report.wer，十条实际临时附件均不存在。选定字段/摘要与38模块基名已记录，无栈、运行时地址或消费者。失效附件路线结束，不全盘搜索或重放旧启动。[材料](wer-artifacts-stage128.json)、[输入](input-stage128.json)。

游戏当前哈希及既有微软x86 CDB哈希/Valid签名已核；[新按应用小型转储方案](game-wer-plan-stage128.md)已准备，未启用、执行或取得执行时确认。[准备](diagnostic-readiness-stage128.json)、[验收](../../reports/validation.md#stage128)、[唯一排障](../../reports/known-issues.md#stage128-input)。无源码/测试/构建或新REA操作，rev30和完整目标未完成。下方旧阶段描述当时状态。

<a id="stage127"></a>
## stage127：画面可读，普通输入仍阻止附件核验

新鲜观察重新看到原搜索/终端，但有界普通字符/按键/点击/窗口选择/Escape没有可确认来宾响应；无Return、新命令、目标运行或附件结果。[访问证据](access-stage127.json)。125/126的实际运行、事件和REA证据保留，本轮没有新消费者或产品实现；同一间歇性输入问题连续三个末态复现，按[审计](blocked-audit-stage127.json)停止自动重复操作，实际控制状态变化后沿[原只读报告检查](resume-plan-stage126.json)接续。[验收](../../reports/validation.md#stage127)、[唯一排障](../../reports/known-issues.md#stage127-input)。下方旧阶段保留当时状态。

<a id="stage126"></a>
## stage126：本次运行的错误记录与运行后身份已补齐

普通输入曾恢复，读出存量4事件、两条1000完整详情/ISO时间及两个完整运行后哈希；两条1000均对应PID5136/同一创建FILETIME，顺序为0xc00001a5→0xc0000005，模块unknown。两份1001只显示EventName/P1..P8，无可用地址。按记录时钟及1500ms等待，首条错误记录早于最早读取0.9647291秒；保留时序推导的边界。[事件](events-stage126.json)、[身份](postrun-identity-stage126.json)。

REA节表新增1条证据，独立11节头检查不能把原始FaultOffset映射到原文件函数；状态定义另据微软维护头文件。没有新游戏/读取器/fixture执行或内存快照。[REA](rea-fault-layout-stage126.json)、[PE检查](fault-layout-stage126.json)、[状态来源](status-reference-stage126.json)。后续路径查询输入未回显、未Return，正常菜单恢复后截图主体为空白，附件存在性未知；先恢复可证终端，再仅读两份实际引用的本地材料。[输入边界](input-stage126.json)、[接续](resume-plan-stage126.json)、[验收](../../reports/validation.md#stage126)。旧回执保留当时状态，当前以本节为准。

<a id="stage125"></a>
## stage125：游戏单次诊断结束，没有代码快照

本次具体确认已落实为一次Start、实际PID5136及一次 `game-installed` 读取。读取器 `TEXT_ZERO` / exit1，未创建游戏输出；同一进程运行9.123410秒后以 `0xc0000005` 退出，整体标记15.633967秒。自然等待观察到退出，未进入CloseMainWindow分支，无强杀/重启。[运行回执](game-runtime-stage125.json)、[新鲜前检](game-guest-preflight-stage125.json)、[原恢复点复核](recovery-recheck-stage125.json)。

普通输入恢复后先完整回读定义，首个可疑定义已Ctrl+C取消；第二个定义经ToString全文核对后仅触发一次。生命周期、ISO时刻、输出不存在和进程数0均有实际输出；后续目标错误事件详情回读未证，当前不能声称无事件或输入已恢复。[输入边界](input-resume-stage125.json)、[接续计划](resume-plan-stage125.json)。原方案已用，不重放fixture/读取/传输命令；没有游戏文件可返回或导入REA，产品源码与测试未改。下方旧阶段描述其当时状态。

<a id="stage122"></a>
## stage122：本次执行已确认，输入恢复后 Mac 锁定

原 1671 项交付 hash 一致；已有本次具体游戏执行确认，同一 PVM 的原新恢复点仍 current，XML 摘要一致。正常退出全屏、实时读取菜单并选原有 Win+Q 后，搜索中的普通字符 1 与 Escape 关闭实证；随后下一次无害输入返回 Mac locked / 自动解锁失败。未提交 Return、加载触发块、启动游戏或仅读工具。当前只有一次正常解锁状态请求，Windows 焦点操作和执行确认无需重复。[授权](authorization-stage122.json)、[恢复点](recovery-recheck-stage122.json)、[输入](input-recovery-stage122.json)。

历史启动信息 JSON 的双分隔符表示错误以[纠正记录](command-path-correction-stage122.json)接续，未改来宾值或旧交付。正常解锁后先检查未提交行、新鲜前检与完整命令，再继续原一次限定诊断。[当前计划](../../reports/development-plan.md#stage122)、[验收](../../reports/validation.md#stage122)。下方旧阶段仅描述其当时状态。

<a id="stage119"></a>
## 当前：原创正向资格通过，游戏独立诊断待执行

同一Windows原始fixture-text.bin已经完整返回主机，6624B/SHA256 `13da500e013b8455352dd26985f04d8a9c853af45584b0f53ba99b1eb146a9d9`；按实际base0x00da0000/245个HIGHLOW修正，全部字节相等。接收器单次成功关闭并exit0，客户端返回长度0并Dispose，最终无listener报告。没有重新启动fixture或重读进程。[返回](snapshot-return-stage119.json)、[直接比较](host-oracle-stage119.json)、[完整正向资格](qualification-stage119.json)。

私有文件仍按既定契约保留在`build/analysis/game-text-observer-runtime-v1/stage118/fixture-text.bin`；目录名不改。现有固定receive-fixture调用已实际完成，不要重复执行下方历史命令，不用主机预期字节替代文件。stage118回执保留当时的host_received=false等状态，最新结果由stage119回执补充。

游戏安装文件/Win7/直接DLL/读取器/普通目录/无输出/进程数0已新鲜核对，新原生恢复点已创建并保留旧点，还原启动未测。REA本轮新增1条文件头记录，4条导出含3条历史；导入表由独立GNU检查取得。[REA](rea-preflight-stage119.json)、[导入](game-static-preflight-stage119.json)、[来宾前检](game-guest-preflight-stage119.json)、[恢复点](recovery-point-stage119.json)、[一次限定方案](game-startup-plan-stage119.md)。当前只准备了未启动的进程对象，来源执行确认正在等待答复。

原读取器/固定传输器源码与产品源码未改，未重复运行旧测试。游戏profile、消费者、账号、玩法及三平台/官方可玩仍未验收，rev30保持7 observed / 13 unknown。[持续需求](../../reports/development-plan.md#stage119)、[验收](../../reports/validation.md#stage119)、[唯一排障](../../reports/known-issues.md#stage119-input)。下方stage118均为当时记录。

## 历史stage118：实际读取已证，原文件返回当时未完成

当前只完成资格的部分运行证据；完整原始文件比较仍待恢复普通来宾输入。原四步及网页、移动网页、微信目标未完成，原游戏本轮没有执行或读取。

| 检查 | 实际结果 |
| --- | --- |
| 前交付 | stage117的1642项hash一致，修改前保留18项文档/矩阵前态 |
| 新原创读取器传输 | 146798B，完整SHA256 `163864829f3b47eaa0b640c44b5de1d46f0e44658919b7c4e51974e5b83732f5` 一致 |
| 原创fixture | 129968B，SHA256 `cf8bd654d9daf5c222f5a8ee565085013cf284ee74165a25558c5bbe0cf41c2a`，实际PID260 |
| 实际读取 | 基址00da0000、RVA1000、6624B、1区域、15ms、observer exit0 |
| 完整缓冲摘要 | `13da500e013b8455352dd26985f04d8a9c853af45584b0f53ba99b1eb146a9d9`，与按实际基址/245个HIGHLOW计算的预期一致 |
| 同一fixture生命周期 | 14:46:53–14:47:23（来宾本地），自然30秒，WaitForExit=True、HasExited=True、ExitCode0 |
| 直接文件比较 | 未执行：原始fixture-text.bin尚未传回主机 |
| 原游戏/账号/消费者/玩法 | 未执行或未取得 |

[执行前方案](plan.json)、[新鲜前检](guest-preflight.json)、[实际传输](transfer-runtime.json)、[读取与独立预期摘要](fixture-runtime.json)、[5项主机测试](test-results.json)、[验收](validation.json)。历史准备记录仍描述其当时状态；后续运行回执优先。

`fixed_transfer.py`是本阶段新增的原创分析依赖。它只绑定127.0.0.1或当前10.211.55.2，peer固定为同端或10.211.55.3。GET `/text-observer.exe`只能送上述读取器；POST `/fixture-text.bin`仅接受原fixture的6624B，按实际基址同时核摘要与全部预期字节，以CreateNew写固定私有build文件。拒绝未知路径/方法、任意文件名、认证/Cookie、Range、分块和错误长度；一次成功后关闭。TTL/套接字限制为尽力约束，不是所有同步调用的硬期限。普通HTTP/peer限制不是加密或发布者身份认证。

本轮send-observer已实际成功、关闭且host exit0；不要重放该步骤。receive-fixture没有启动。普通输入恢复、核对同一快照及当前网络身份后，已准备的接收调用为：

```sh
python3 -B analysis/game-text-observer-runtime-v1/fixed_transfer.py receive-fixture --bind 10.211.55.2 --port 65378 --ttl 600 --base 0x00da0000
```

该命令不是已执行回执。只传回已有原创快照 `C:\MoliOffline\game-text-observer-stage115\fixture-text.bin`，不能重新启动fixture以制造另一份捕获，也不能把主机生成的预期字节当来宾文件。主机目标固定为 `build/analysis/game-text-observer-runtime-v1/stage118/fixture-text.bin`，存在即停；成功后还须核接收器退出及原始字节比较。原oracle CLI限定旧私有目录，新目录比较可复用其纯函数API，不放宽CLI路径限制。

后续输入回执在[input-observations.json](input-observations.json)。原生Ctrl+Break进入的是PowerShell自身DBG，q退出尚未证；原生Win+Q能开搜索，普通文字仍未出现。输入模式检查未观察到改值，最后均自动检测，配置经正常文件菜单关闭。[模式检查](input-mode-experiment.json)引用的v20说明不是当前26.3.3故障原因或修复证明；没有采用论坛系统标志、修改快捷键定义、共享、安全或控制后端。没有新增人工操作请求。

原读取器源码/构建及39C/6Python资格保留在[stage115工具](../game-text-observer-v1/README.md)，本轮没有重建或修改它，也没有重复运行旧产品测试。游戏另需新鲜目标、依赖、Win7、恢复和具体有界方案；原创工具实测不替代原游戏消费者或三平台/官方验收。[持续需求](../../reports/development-plan.md#stage118)、[唯一排障知识库](../../reports/known-issues.md#stage118-input)。
