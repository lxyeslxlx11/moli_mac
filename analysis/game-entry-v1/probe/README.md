# 原创回调元数据观察工具（stage96 / stage101 / stage105）

<a id="stage105"></a>
## stage105：正常安装目录配置与新二进制的实际验收

游戏已经正常安装，四文件身份及实际HKCU Path两视图相同。本次增加独立 `game-installed` 固定配置，原 `fixture`/`game` 各字段值保留；不把正常文件搬到临时目录、不手写Path。新配置仅接受 `C:\Program Files (x86)\PlayOnline\魔力宝贝\cg_se_3000.exe`、SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126` 和ImageSize0x103b000。[安装身份](../../game-install-context-v1/guest-installed-context-stage105.json)、[先行计划](../../game-install-context-v1/installed-observer-plan-stage105.json)。

当前构建入口为：

```sh
python3 analysis/game-entry-v1/probe/build_installed_probe.py
```

使用既有clang/Mingw/nm、留存fixture及私有stage105源基线，输出到 `build/analysis/game-entry-v1/probe-stage105/`；旧stage101二进制、ISO和报告不覆盖。下方旧构建命令属于历史步骤；当前源码已增加第三配置，不应用旧入口重建历史证据。26项核心断言、两次相同构建、独立PE三行字段及中文UTF16精确检查已通过。[构建身份](../observer-build-stage105.json)。

当前CLI有两个位置参数：`callback-probe.exe fixture|game|game-installed <规范十进制PID>`，profile三选一；没有自定义地址/路径/hash。身份/最终路径/hash/架构/创建时间/模块大小/范围及单次8B读取门禁函数源码未变；非零槽只查数值页属性，不解引用，不启动目标或附加调试器。

新观察器143326B、SHA256 `208597958292b96a67af7a5ce7c5b2d9c8496e91c9847be2a661abb3bebd684a`，经CreateNew固定传输后Windows完整hash相同，服务已关闭。仅运行原创fixture一次：PID804、base00360000、ImageSize00e82000，一次8B读成功，槽RVA14c0/14b0、observer exit0。该fixture自然WaitForExit/HasExited=True、结束计数0，同PID退出码空值仍未知，不填0。[实际Windows证据](../../game-entry-runtime-v1/windows-observer-stage105.json)。

新game-installed配置尚未读取原游戏，旧二进制拒绝案例也未在新版重跑。成功仅说明本次原创fixture读完成，不能证明回调调用、原游戏消费者、协议或平台兼容。原游戏后续仍须正常登录器/Win7流程及对应执行范围，不直接启动来满足工具，不放宽保护或重放旧脚本。以下“当前”“待执行”均保留为相应历史阶段。

<a id="stage102"></a>
## stage102：正常安装上下文准备，不修改 game profile

原创观察器/fixture与stage101验收保持原范围。REA补充CG5Reg注册链，正常游戏安装器声明自身登记HKCU Path；安装介质已在现有Windows只读挂载、两包完整hash通过，新恢复点已建，正常安装仍待来源执行确认。[静态安装声明](../../game-install-context-v1/installer-metadata-stage102.json)、[实际来宾](../../game-install-context-v1/transfer-session-stage102.json)、[具体方案](../../game-install-context-v1/normal-run-plan-stage102.json)。

game profile没有改路径/hash/权限或改成任意覆盖；先正常安装并核实际目录/完整身份，再制定后续观察。不得搬client-probe样本、运行CG5Reg代写键或伪造IPC以通过。临时菜单22项已精确撤回、原19项保留，150ms普通按键路线仍可用。[菜单回读](../../game-install-context-v1/keyboard-cleanup-stage102.json)。

<a id="stage101"></a>
## stage101：修正版的实际 Windows 验收

**事实：** 旧 fixture `77878c…edd3` 在 Windows 创建失败（“不是有效的 Win32 应用程序”，无PID/ready）。其上一节结束对齐后为RVA `22000`，`.slots`却从`e65000`开始。新的 `entry_fixture_slots.S` 提供原创BSS，`entry_fixture.ld`把虚拟填充连续链接；`pe_layout.py`在构建中拒绝节空洞/重叠、错误原始区及映像范围。保持槽地址`e65db8/e65dbc`与ASLR/NX；并未修补任何厂商程序。

```sh
python3 analysis/game-entry-v1/probe/build_probe.py
```

输出改到私有 `build/analysis/game-entry-v1/probe-stage101/`，旧 `probe/` 与 stage96 ISO不覆盖。当前 fixture为129968B、SHA256 `cf8bd654d9daf5c222f5a8ee565085013cf284ee74165a25558c5bbe0cf41c2a`、ImageSize `e82000`；观察器143326B、SHA256 `f3632249024e59515c323cd621af5d3ff9b733b8c92321e85be1adc91593e140`。观察器C源和整个`.text`未变，仅更新原创fixture的hash/ImageSize数据；游戏profile、权限与8B跨度未放宽。[构建](../observer-build-stage101.json)、[布局回归4项](../layout-validation-stage101.json)、[字节对照](../observer-equivalence-stage101.json)。

两版均经固定文件NAT工具传入并取得Windows完整hash；旧文件改名`.exe.stage96`，新文件以CreateNew独占写入，不覆盖。传输工具只服务两份当前原创PE，限定私网地址/来宾、10..600秒及每文件一次GET，两次响应后关闭；不是游戏服务或目录共享。两轮各19主机检查及实际来宾结果分开记录。当前不使用旧stage96 ISO交付修正版。

**实际范围：** R1观察器四个缺参/无效PID/未知profile/镜像路径不符案例均exit1。R2以新PID8524读8B，base=`004b0000`、ImageSize=`00e82000`，槽RVA=`14c0/14b0`，observer exit0；该PID的WaitForExit=True、ExitCode回读为空，不能填0。为补生命周期，另一次同步fixture PID1508自然exit0、结束计数0，未再次读取内存。数值页信息和全部身份见[Windows实证](../../game-entry-runtime-v1/windows-observer-stage101.json)。

**待验证：** 这不是所有拒绝/竞争/故障案例覆盖、回调实际调用、原游戏或平台/官方验收。原游戏profile路径当前不存在，不能把`client-probe`搬过去或取消门禁。后续先验证正常安装上下文，再按其真实身份另行更新规格/配置；不重放current.ps1/Restore，不附加调试器、读IPC/代码/凭据或改保护。下列stage96准备记录保留原范围。

<a id="stage100"></a>
## stage100: Mac access blocked (2026-10-29)

电脑控制在连续3个 goal turn 均报告 Mac locked、自动解锁失败；未取得新来宾状态、提交新命令或运行观察器/原游戏。三轮阻塞审计已通过，goal 工具实际返回 blocked，完整目标尚未完成。

仅已有一次正常解锁请求保留，无需重复授权或再点击终端。解锁后先看未提交的哈希查询，核文件/备份/journal/原创目录，再验原创工具；旧脚本/Restore/启动不重放。22项临时菜单因锁屏尚未撤回，精确清单保留。不改锁屏/安全或使用已禁止控制路径。下列旧“当前”均为各阶段历史。

[stage100 audit](../../game-entry-runtime-v1/access-blocked-stage100.json), [stage100 delivery](../../delivery-manifest-stage100.json).

## stage98 当前运行状态

D=MOLICUR89、Restricted和两组指定进程计数0已实际返回。随后hash查询仅输入前半段、未Return；CUA报新Mac锁定且自动解锁失败，一次正常解锁请求待答，无需再点终端。恢复后先看未提交行，不重复前缀。临时22项菜单尚待精确撤回。新ISO未挂载/传输，fixture/observer Windows执行仍0；先核当前文件/备份/journal/目录，再验工具。旧脚本/Restore和启动额度不重放。[实证](../../game-entry-runtime-v1/guest-preflight.json)、[恢复](../../game-entry-runtime-v1/input-recovery.json)、[计划](../../game-entry-runtime-v1/run-plan.json)。
stage99 复查：CUA 仍在 Mac locked／自动解锁失败处停止，未取得新来宾状态或提交命令。同一新锁屏已连续2个 goal turn；上一轮有实际前检进展，本轮无开发进展。已有一次解锁请求保持，不追加终端操作或重复授权。完整目标 active，恢复后先看未提交的哈希查询，再核文件/目录并验原创工具。[本次复查](../../game-entry-runtime-v1/access-recheck-stage99.json)。

用途是验证已定位的两个回调指针槽，不是游戏实现。源码先于构建记录归档；原游戏没有被本工具启动、附加调试器、修改或解密。当前仅完成 macOS 构建与静态核验，Windows 实测未运行。

## 构建与主机检查

从项目根目录运行：

```sh
python3 analysis/game-entry-v1/probe/build_probe.py
```

需要现有 `clang`、`i686-w64-mingw32-gcc` 和对应 `nm`，脚本不安装依赖、不操作 VM、不执行生成的 PE。它运行 26 项原创 C 边界断言，并把两个 x86 PE 各编译两次比较字节；产物及生成的 fixture_identity.h 仅在 `build/analysis/game-entry-v1/probe/`。保留 `-Werror`、ASLR 和 NX。初次 DWORD/uint32_t 指针类型不匹配失败及最终成功日志均保留。

[构建身份](../observer-build.json)、[REA/字节核验](../observer-static-audit.json)、[导入表范围](../observer-imports.json)、[先行契约](../observer-plan.json)。主机测试不验证 Win32 API、ARM64/x86 仿真、来宾权限或真实地址。

## Windows 待执行流程

正常恢复当前 Parallels 桌面后，先按唯一[排障知识库](../../../reports/known-issues.md#vm-troubleshooting)核对窗口、英输入、当前进程/路径/hash。stage94 的备份与 Restore 停止状态保留，不能重放旧 current.ps1、放松恢复 guard 或改安全设置。

准备的本地数据 CD 为 `build/analysis/game-entry-v1/MoliEntryProbe-stage96.iso`，4 个成员、无 autorun；主机提取逐成员字节回读通过。它尚未挂载到 VM 或传输到来宾。[介质身份](../observer-media.json)。挂载前复核当前光盘依赖；不覆盖旧数据。来宾按介质清单核 hash 后，先检查固定目录 `C:\MoliOffline\observer-fixture`：发现非本工具已有文件时停止，不能覆盖未知内容。只将已核验的原创 fixture/observer 放入此独立目录。

先只做原创 fixture 验收：普通启动 entry-fixture.exe，在其输出 ready 和 PID 后，在另一普通终端执行 `callback-probe.exe fixture <实际PID>`，保存完整返回与退出码。fixture 自然运行 30 秒后退出，不终止它；核对 index0 cleanup 的 RVA 为 0x14c0，index1 entry 的 RVA 为 0x14b0，并单独记录真实 ASLR、模块/页元数据、生命周期以及非法输入/错进程拒绝。这里是尚未执行的验收步骤，不是成功回执；不把旧 PID 当当前输入。

fixture 全部验收后，才可依据新鲜路径/hash、正常流程和既有授权确定是否存在可观察的游戏 PID。工具的 `game <实际PID>` 仅接受 `C:\MoliOffline\launcher-probe\cg_se_3000.exe`、固定 SHA256 9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126 和 SizeOfImage 0x103b000。它不启动游戏。无匹配正常运行目标、保护/访问拒绝或 guard 失败就停止；不换权限、附加调试器、强制分支或读代码/IPC/字符串/票据。

## 输入、输出与限制

仅两个参数 `fixture|game` 与一个规范十进制 PID；没有自定义路径、地址、范围、hash 或次数。先以查询句柄核身份与磁盘文件，再开只读进程句柄并比较创建时间，按观察到的模块基址加固定 RVA 0xe65db8，执行一次精确 8 字节读取。非零指针仅查询页元数据，不解引用。输出固定状态、数值和调用者指定 profile/PID，不输出路径、命令行、窗口、账号或负载。

`ok` 只表示这次读完成；两个 DWORD 不保证原子/持久快照，磁盘 hash 不证明可变运行页身份，页元数据不证明调用执行、函数语义或游戏兼容。同步 API 没有硬性总超时；hash 循环 5 秒检查仅为尽力上限。具体进程/路径 guard、单次读取与直接导入 API 的静态核验不等于实际无额外访问证明。完整游戏消费者/认证/帧/状态与可玩及平台/官方验收均待后续证据。
