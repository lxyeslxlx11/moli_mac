# 一次 Windows 本地小型崩溃转储诊断（stage128）

当前状态（2026-11-02 stage131）：**已获本次具体确认、已执行并恢复，启动额度已用**。用户答复“允许本次诊断及对应 UAC”；一次普通PID5304运行6.466299秒自然退出，两份合格小型转储均已离线读取，临时双视图WER设置已恢复，运行后哈希一致且游戏/CDB进程0。[授权](authorization-stage131.json)、[生命周期](wer-lifecycle-stage131.json)、[恢复](wer-restoration-stage131.json)、[CDB摘要](cdb-summary-stage131.json)、[收尾](wer-postflight-stage131.json)。后续REA静态核对见[独立摘要](rea-stack-correlation-stage131.json)，根因与游戏消费者仍未知。

下文保留stage128原计划与当时材料状态，未来式条件不表示仍未执行或允许再次启动。本方案不复用stage125已消耗的启动/读取额度。原两份WER归档各只有一份Report.wer，十条临时附件引用当时均不存在，见[实际核验](wer-artifacts-stage128.json)。

目的：取得无账号启动失败时的实际异常地址、线程上下文和模块范围，判断后续是否有可定位的游戏代码。它是崩溃诊断；经登录器认证后的正常启动、游戏消费者和三平台可玩另行验收。

固定目标为现有 Parallels Windows 11，PVM `/Users/lx/Parallels/Windows 11.pvm`，VmUuid `{0a440763-a14c-4cbe-b6df-abfa4fe079a3}`。游戏为 `C:\Program Files (x86)\PlayOnline\魔力宝贝\cg_se_3000.exe`，2904064 字节，SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126`；本轮已重新读取完整哈希。原件、兼容标记与安全设置不修改。

使用已安装微软 SDK 的 `C:\Program Files (x86)\Windows Kits\10\Debuggers\x86\cdb.exe`，SHA256 `6ca9dd8ee2d764087c4a561ecfee05cdf17751dfd9c2f21700211a897cd68129`；本轮完整哈希及 Authenticode `Valid` 已回读，未运行调试器。无需新增安装或接受许可。

## 执行前条件

正常电脑控制与英文短输入必须可证。重新核对精确 VM、恢复点、磁盘余量、游戏路径/大小/哈希、`~ WIN7RTM`、同名进程为零；保留现有会话及旧快照，新建一次具名恢复点 `Moli-before-game-wer-20261102-stage128`，不还原或删除旧点。快照结构核验不当作恢复启动通过。

先只读检查 HKLM 的 Registry64、Registry32 两个逻辑视图中下列**精确应用子键**及父键存在性。若已有该应用子键、目标目录已存在、任一读取拒绝或归属不明，停止本方案，保留现场，不覆盖既有设置。

`SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps\cg_se_3000.exe`

另外只读核实这两个视图下精确 `SOFTWARE\Microsoft\Windows NT\CurrentVersion\AeDebug` 的 `Auto` 值。若配置为自动事后调试或无法判定，停止；不修改 AeDebug 或全局 WER。执行前检查的结果尚未取得，不能把计划当作前检通过。

## 唯一临时变更

普通权限创建新的私有实验目录 `C:\MoliOffline\game-wer-stage128`、其空子目录 `dumps`、`symbols`，验证不是重解析点；保留默认权限，不开放共享。目录需至少 512 MiB 可用空间。随后仅为上述应用子键的两个逻辑视图设置：

| 值 | 类型 | 固定值 |
| --- | --- | --- |
| DumpFolder | REG_EXPAND_SZ | `C:\MoliOffline\game-wer-stage128\dumps` |
| DumpCount | REG_DWORD | `2` |
| DumpType | REG_DWORD | `1`（小型转储） |

注册表写入使用正常微软工具及所需的普通 UAC；管理员会话仅设置/恢复这些诊断键，**游戏仍从原普通权限会话启动**。若两个视图实际共享同一键，记录别名、只记录一次所有权并恢复一次，不把第二次可见误当既有外部配置。没有管理员会话则停止，不提取凭据或改权限。按短行完整回读和实际返回验收每次写入，不运行旧脚本、不改变 PowerShell 执行策略。

微软文档说明 LocalDumps 可按应用设置、需管理员权限，DumpType=1 为小型转储；自带崩溃报告或启用自动事后调试时可能不采集。因此这里是待验证的取证方法，不能保证产生文件。[微软 LocalDumps 说明](https://learn.microsoft.com/en-us/windows/win32/wer/collecting-user-mode-dumps)、[注册表逻辑视图](https://learn.microsoft.com/en-us/windows/win32/sysinfo/32-bit-and-64-bit-application-data-in-the-registry)。

## 一次启动与恢复

从原普通权限 PowerShell 新建独立 Process 对象，精确 FileName/WorkingDirectory、空参数、UseShellExecute=false；完整回读后只调用一次 Start。保持现有网络，程序可能自行发起网络检查或写日志；不登录账号、不点击更新/进入游戏、不注入、附加调试器或调用 `.text` 读取器。

记录实际 PID/开始时刻，自然等待最多 30 秒；仍存活时只尝试一次 CloseMainWindow，再等 5 秒。执行观察目标总计不超过 90 秒；若无法正常结束，保留进程/状态并报告，不强杀、不重启或自动再试。自然退出必须记录真实 ExitTime/ExitCode，不能用 CDB 退出码代替。

无论是否有文件，结束观察后正常恢复本次所建的应用诊断子键：先确认所有值仍精确等于本方案、没有新增子键/其他所有者改动，再撤销本次创建并读回不存在。若父 LocalDumps 原先不存在且此时仍为空，可撤销本次空父键；既有父键不动。遇差异不覆盖，保留准确状态供后续恢复。保留诊断目录及文件用于本地分析，不自动删除。

## 本地只读分析

只检查新目录中的 `cg_se_3000.exe.<实际PID>.dmp`，核文件时间、长度、SHA256、进程归属和写入完成；最多两份。文件超过合计 128 MiB、身份不符或不稳定时停止读取并报告。该阈值是分析门槛，不保证 Windows 写入阶段硬限额。没有文件就是本方法未取得证据，不重跑或切换为全内存采集。

已核验 CDB 仅用 `-z` 打开该次已结束进程的小型转储，使用 `-sins` 和显式空本地符号目录、`-noshell`；不附加存活 PID、不使用符号服务器或第三方扩展。只读异常记录、异常上下文、最多 20 帧调用栈和模块范围后 `q` 退出，记录真实工具退出码。缺失符号、页或 ARM/x86 上下文失败如实保留，不自动扩大采集。[微软离线转储入口](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/opening-a-crash-dump-file-using-cdb)、[CDB 参数](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/cdb-command-line-options)。

转储、原始调试输出和可能的内存内容只留来宾私有目录；不上传、不提交、不自动传回主机。公开证据仅保留允许的数值、模块基名、摘要和推导，排除账号标识、报告 GUID、私有路径及原始寄存器/内存。实际运行可能崩溃或自行发起网络检查；设置/恢复可能需要对应 UAC。任何新许可、凭据、安全提示、保护/权限拒绝或输入不可证即停，不绕过。

stage128准备时尚未取得执行时确认；这一历史等待已由stage131用户对原问题的明确答复解除并实际执行。已有Windows/联网/工具授权继续有效，本次具体启动额度已用；不把本方案重复当作待执行任务。执行时来源确认来自电脑控制工具规则，不是REA技能或项目另设的长期审批。
