# 固定 `.text` 观察工具（stage115）

<a id="stage125"></a>
## stage125：game-installed 已尝试一次，返回 TEXT_ZERO

同一146798B、SHA256 `163864829f3b47eaa0b640c44b5de1d46f0e44658919b7c4e51974e5b83732f5` 读取器用于实际PID5136，固定1753452B读取后返回 `TEXT_ZERO` / exit1。该分支在创建输出前停止；实际Test-Path=False已核，未改工具/放宽检查或重跑夹具。[实际结果](../game-text-observer-runtime-v1/game-runtime-stage125.json)。这不提供代码消费者或故障根因，原正向夹具资格与游戏失败路径分开记录。

<a id="stage122"></a>
## stage122：原创资格保留，本次游戏执行确认已取得

工具源码、产物与原始夹具资格未改，未重跑夹具或读取器。本次一次游戏启动/固定读取的来源确认已答复；输入恢复后 Mac 锁定，尚无新的来宾前检、游戏读取或 REA 消费者。[授权](../game-text-observer-runtime-v1/authorization-stage122.json)、[输入证据](../game-text-observer-runtime-v1/input-recovery-stage122.json)。恢复后检查当前行并继续原一次方案。

<a id="stage119"></a>
## 当前资格：原创正向路径通过，游戏 profile 未执行

stage119已取回stage118同一次Windows运行生成的原始6624B文件；按实际base0x00da0000与245个HIGHLOW修正，全部字节相等。读取器没有修改或重建，未重跑fixture、重读进程或重放传输。[完整资格](../game-text-observer-runtime-v1/qualification-stage119.json)、[原文件oracle](../game-text-observer-runtime-v1/host-oracle-stage119.json)。此结论不覆盖所有拒绝路径、原子/稳定快照、游戏 profile 或消费者。

原游戏新鲜前提与恢复点已有回执，一次有界诊断正等待来源执行确认。[游戏方案](../game-text-observer-runtime-v1/game-startup-plan-stage119.md)、[当前需求](../../reports/development-plan.md#stage119)。下方stage115–118保留其当时构建/接续记录；旧待办以stage119回执为准。新私有目录的比较复用纯oracle API，未放宽CLI路径限制。

历史stage117：正常电脑控制连续三轮报告Mac locked/自动解锁失败，目标工具已实际返回blocked。新工具Windows资格及原游戏消费者尚未取得；保留源码和主机准备，恢复普通输入后沿具体资格方案继续。[三轮审计](blocked-audit-stage117.json)、[实际状态](goal-status-stage117.json)。

用途是补齐原游戏代码取证能力。**stage118已取得原创fixture的一次真实Windows 6624B读取、预期摘要匹配和自然exit0；原始文件传回/直接逐字节比较仍待完成，原游戏未读取。** [运行与限制](../game-text-observer-runtime-v1/fixture-runtime.json)、[当前接续](../../reports/development-plan.md#stage118)。 原8B槽观察器及其历史资格继续按原范围解释。本工具不启动目标。

stage116只读复查仍报告Mac locked/自动解锁失败，未取得app/guest或提交输入；已有正常解锁请求保留。1637项前交付hash一致，新工具/游戏仍未实跑，同一阻塞第2个goal turn，本轮没有开发进展。[复查](access-recheck-stage116.json)。

```sh
python3 analysis/game-text-observer-v1/tool/build_observer.py
python3 -m unittest discover -s analysis/game-text-observer-v1/tool -p 'test_fixture_oracle.py' -v
```

使用已有Clang、i686 MinGW/binutils；不安装依赖或执行PE。39项C边界断言、6项原创夹具字节oracle测试通过，两次构建相同，ASLR/NX保留。初始节表字段、DWORD指针和objdump输出格式问题已修复，失败记录留在私有build。[构建身份、链接配置和导入](host-validation.json)、[oracle结果](fixture-oracle-validation.json)、[验收](validation.json)。

Windows接口是 `text-observer.exe fixture|game-installed <规范十进制PID>`。两套固定身份分别绑定现有原创fixture和完整安装版9baa…d3126；只读对应`.text`的6624或1753452字节。文件最终路径/hash、x86、进程创建时间、模块大小、完整区域所属映像及可读可执行属性必须通过。保护页、无访问、非映像/非提交页、范围缺口或任意读取失败即停；没有重试、提权、注入、调试附加、目标启动或控制。

输出目录必须预先是普通非reparse目录 `C:\MoliOffline\game-text-observer-stage115`。工具固定以CREATE_NEW写入`fixture-text.bin`或`game-text.bin`；已有输出即停，不覆盖/删除。成功输出固定数值、实际基址、长度与SHA256；失败只给原因或对应固定区域元数据。原游戏代码字节只能留在私有来宾/主机build，不进入analysis交付。

单次读取不保证原子、稳定、完整解包、执行或消费者语义。区域元数据与字节可能竞争；磁盘hash不证明运行页原样。hash循环5秒、区域循环10秒检查是尽力预算，不是整个同步API调用的硬期限。源码/导入检查也不替代Windows运行证明；CRT的本进程VirtualProtect导入不等于对目标调用VirtualProtectEx。

下一步按[Windows资格方案](windows-qualification-plan.json)恢复普通输入、核文件/目录和新PID，先运行原创fixture，立即记录观察器输出与退出码，再核该fixture自然退出。应取回该次6624字节，与实际ASLR基址对应的245个HIGHLOW修正后预期字节完整比较：

```sh
python3 analysis/game-text-observer-v1/tool/fixture_oracle.py --base 0xACTUAL_BASE --snapshot /absolute/project/build/analysis/game-text-observer-v1/fixture-text.bin
```

`0xACTUAL_BASE`和路径是待替换占位，不能照抄。oracle只接受固定原创fixture，不给原游戏生成“预期代码”，不改写/执行PE；其HIGHLOW规则来自[微软PE格式说明](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format#the-reloc-section-image-only)。当前6项测试使用离线预期数据，不能当作上述真实Windows比较已完成。

原游戏必须另有新鲜依赖、Win7、恢复状态、身份/PID及具体诊断方案。无参数诊断启动与经登录器认证进入分开验收；不伪造账号、CGSharedMem、票据或会话，不为满足工具而启动游戏或复用旧计划。遇到保护/权限要求停止，不换权限或控制路径。Mac首次输入被锁屏拦下，只有一次正常解锁请求，未提交Return或执行来宾命令。[访问证据](access-observation.json)、[源与清单](source-check.json)。
