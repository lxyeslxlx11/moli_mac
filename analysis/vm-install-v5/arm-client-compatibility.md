# ARM 取证环境与实际客户端架构复核

日期：2026-10-25 UTC。范围为已有安装清单、固定临时解包样本、PE头/导入/短字符串与官方文档的只读复核。未执行游戏、安装器或保护组件，未连接游戏服务器、读取凭据或改动VM。JSON摘要及逐文件身份见[arm-client-compatibility.json](arm-client-compatibility.json)。本记录是环境选型证据，不是跨平台游戏兼容证明。

## 样本身份和方法

原件身份沿用[输入清单](../input-manifest.json)，本轮未重新对1GB安装包做全量hash：`CrossGate_Setup.exe` SHA256 `e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983`；`POLCN_Setup.exe` SHA256 `dc90bb88e35a82a649f1c026bd0b7b6e7039ddbe5e872f40ffebfb4b16b0fb11`。这些hash识别用户提供的字节；来源真实性和是否为服务端当前版本仍未证实。

使用Python 3.9.6读取明确路径的普通文件、重算SHA256，并从DOS头`+0x3c`读取PE头位置P，在`P+4`读取COFF Machine、`P+24`读取Optional Header Magic。10个既有游戏包EXE/DLL及登录器原压缩/已有UPX解压副本共12个，hash均匹配既有证据，均为`Machine=0x14c`、`Magic=0x10b`，即x86 PE32。没有执行PE，也未在本轮重新解压/修改样本。现存REA 6.7.0/GNU objdump证据作为交叉来源；REA包装失败的历史限制未被改写为成功。

| 样本 | SHA256 | Machine / Magic文件偏移 |
|---|---|---|
| `cg_se_3000.exe` | `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126` | `0x154` / `0x168` |
| `cg_se_6000.exe` | `6e2ff83274561047129ef61cbda8b718e3806f68aeb5d36f3a9b5cd08df60a4a` | `0x11c` / `0x130` |
| `cg_item_6000.exe` | `06447ec8e108ffc4153a1720e729d74cc37c39aee0da268ab7b144ba17d9a7e2` | `0x12c` / `0x140` |
| `POLCN_Launcher.exe`原压缩副本 | `109b13382e7fbd96759f52e8cdb4bc269c379a613dbbf1ddd04a69a4a5c8ef0e` | `0x104` / `0x118` |
| 已有登录器UPX解压副本 | `601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31` | `0x104` / `0x118` |

其余`Patcher_PUK3.exe`、`Config.exe`、`CG5Reg.exe`、`d3drm.dll`、`d3dx9_43.dll`、`MFC71.dll`、`msvcr71.dll`的完整hash/偏移在JSON，来源为[模块身份](../game/modules.json)。以上是**事实，高置信度**；文件名中的3000/6000不构成当前服务端版本确认。

## 内核组件线索：负证据覆盖有限

**事实：** innoextract 1.9保存的[CrossGate清单](../crossgate-inventory.txt)有2,368项，[POLCN清单](../polcn-inventory.txt)有4项（含重复登录器）。按条目后缀大小写不敏感检查，两份均无`.sys`、`.inf`、`.cat`。清单hash保存在JSON。此结论只针对清单显示的文件名，不覆盖嵌入内容或运行时生成文件。

**事实：** 两枚游戏有真实`KERNEL32!DeviceIoControl`导入。GNU objdump 2.47.20260726与既有独立PE导入记录一致：

| 样本 | 名称字节文件偏移 | IAT VA / 文件偏移 | 来源 |
|---|---|---|---|
| `cg_se_3000.exe` | `0x1142aa` | `0x1249294` / `0xf3294` | [导入JSON](../protocol-v3/game-network/cg_se_3000.exe.network-imports.json)，[objdump](../game/cg_se_3000.exe.objdump.txt)第220行 |
| `cg_item_6000.exe` | `0xeb2aa` | `0x1395294` / `0xca294` | [导入JSON](../protocol-v3/game-network/cg_item_6000.exe.network-imports.json)，[objdump](../game/cg_item_6000.exe.objdump.txt)第221行 |

se3000有界反汇编还看到调用候选VA`0x11dea7a`/文件`0x8fa7a`、VA`0x11e21cb`/文件`0x931cb`，前面压入`0x900a8`。**待验证：** 完整可达性、句柄来源和控制码实际语义。一般设备I/O调用本身不是专有驱动、反作弊或必需内核组件的证明。

**待验证：** CrossGate清单第2357行列出`app/ApexClient.Dat`（488 KiB），不在上述10个EXE/DLL范围；明确的临时路径`/tmp/moli-analysis/crossgate/app/ApexClient.Dat`当前未解出。没有独立hash、文件类型或头字节判断，本轮未重新大规模解包。名称本身不证明它是什么保护组件。三个游戏原`.text`节RawSize为0，存在`LoadLibraryA`/`GetProcAddress`等动态导入，见[保护载荷边界](../protocol-v3/game-network/packed-boundary.md)。安装脚本、嵌入内容、动态载荷和后续更新并未穷尽。**“未检出.sys”不能改写成“绝无驱动”。**

## 图形、输入和音频依赖

**事实，高置信度：** 对se3000同一hash的原始文件重新比较以下7处ASCII字节，全部匹配；偏移是文件偏移：

| 文件偏移 | 字面值 | 能支持的结论 |
|---|---|---|
| `0x3d84`、`0x3db0` | `DDRAW.DLL`、`DirectDrawCreate` | 存在DirectDraw加载/初始化线索 |
| `0x3e20`、`0x3e4c` | `DINPUT.DLL`、`DirectInputCreateA` | 存在DirectInput线索 |
| `0x290d6`、`0xeb9a` | `DSOUND.dll`、`DirectSoundCreate Start` | 存在DirectSound线索 |
| `0x29142` | `WINMM.dll` | 存在Windows多媒体依赖线索 |

**事实：** 随包`d3drm.dll` SHA256 `58226b8e12c98ef437af103273c21e88b659acd8328bd4c55fddbae97ab8fad2`真实导入`DDRAW.dll!DirectDrawCreate`。本轮从原PE复核：描述符文件`0x4cd5c`，DLL名称`0x4d4ec`，符号名称`0x4d4da`，IAT RVA`0x1010` / VA`0x6db91010` / 文件`0x410`，与[objdump](../game/d3drm.dll.objdump.txt)第182–186行一致。随包另有x86 `d3dx9_43.dll`，完整hash见JSON。

**推测：** 样本包含旧DirectX时代的渲染/输入/音频路径。**未知：** 正常分支是否加载每个DLL、调用可达性、实际图形特性/硬件加速要求、兼容层表现；DLL存在不等于游戏已经成功调用。微软[DirectDrawCreate说明](https://learn.microsoft.com/en-us/windows/win32/api/ddraw/nf-ddraw-directdrawcreate)区分软件模拟与仅硬件模式；当前字节证据没有给出样本的实际运行模式，不能直接判定必须硬件3D。

v5[VM配置](driver-cd-config.json)记录`Display.Hardware=virtio-ramfb`（没有`-gl`后缀），最小NetKVM介质不含图形驱动。UTM当前[Windows支持文档](https://docs.getutm.app/guest-support/windows/)将Windows QEMU DirectX加速列为实验性，要求`-gl`显示卡及相关驱动，提示游戏兼容有限、可能不稳定。此处仅作**配置与官方能力说明**，本项目未安装实验图形驱动、未执行图形测试；成功安装Windows或网卡不证明旧游戏图形可用。

## ARM限制与转向门槛

官方资料于2026-10-25核查。微软[仿真说明](https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-x86-emulation)明确Windows 11 ARM支持x86/x64用户态仿真，内核组件必须编译为ARM64；[ARM FAQ](https://learn.microsoft.com/en-us/windows/arm/faq)补充内核驱动及用户态打印驱动须原生ARM64，并说明不能靠x86/x64安装程序安装ARM64驱动。二者页面更新日期均为2025-11-07。支持该类别不保证此样本可运行，也不验证虚拟机、许可或保护组件兼容性。

| 观察 | 判定与有界下一步 |
|---|---|
| 当前x86 PE32游戏与登录器 | **事实：** 在Windows ARM用户态仿真支持的架构类别内。保留当前ARM VM，不能仅凭32位EXE要求改建x86 VM；真实运行仍待来源/许可核实和具体授权。 |
| 确认游戏必须加载只有x86/x64版本的内核驱动，且没有合法ARM64版本 | **ARM特有停止条件：** 停止该组件在Windows ARM上的尝试；不靠重装、签名绕过或补丁解决CPU架构限制。评估合法x86/x64 Windows环境，或另行决定是否试x86整机模拟。当前尚未确认触发。 |
| OOBE联网、普通存储/网卡驱动缺失 | **环境准备问题：** 不是游戏ARM不兼容证据。只做已授权的正常设置/官方匹配驱动安装，不绕过OOBE或账号要求。NetKVM属于虚拟硬件驱动，不能据其ARM64身份推导游戏无内核依赖。 |
| 签名、目录成员或来源验证失败 | **信任/许可停止条件：** 停止该包安装，记录原始错误并核查官方发行。不能归因为ARM，也不关闭安全控制。 |
| 旧DLL/DirectDraw失败、显示异常或输入音频失败 | **一般兼容问题，原因待证：** 先记录具体模块/错误/调用与环境。只有证据指向正常官方依赖或配置时做一次有针对性的修正并复验；同样失败且无新证据时收口，不反复重建VM或试不明补丁。当前尚未运行游戏，不能预判故障。 |
| 保护载荷或未分析Dat导致依赖链无法闭合 | **证据停止条件：** 保留未知项，先做范围明确的合法静态观察；动态观察须另外确认，不绕过保护或访问限制。 |

UTM[System文档](https://docs.getutm.app/settings-qemu/system/)说明Apple Silicon硬件虚拟化要求客户机架构为aarch64；x86客户机在ARM宿主上走整机模拟，强制多核还有正确性警示。**推测/备选：** x86 Windows可消除“ARM不能加载x86内核驱动”这一架构不匹配，但不能保证游戏、虚拟硬件、反作弊或性能兼容。它需要匹配的x86/x64系统介质和独立许可评估，不是给ARM64 ISO改一个VM架构字段。本轮没有新建第二台VM、替换或删除当前VM。

## 验收与项目关系

已完成：12/12固定PE hash和架构复核、7/7字符串字节核对、d3drm真实导入复核、2份清单（2368/4项）后缀检查；摘要JSON可解析。新增摘要引用的9份证据hash一致；本记录及两份受影响报告共53个本地链接均存在。未新增运行代码或测试，既有测试本项未重跑。未运行客户端、核实完整驱动依赖、验证图形/输入/音频或官方联机。没有此项操作拒绝或待审批；未解出的Dat与保护载荷属于证据覆盖限制。

本环境只服务“逻辑/协议证据 → 规格 → 独立共享核心”的取证主线。Windows仿真、x86整机模拟及远程串流都不是网页/手机/小程序的独立实现，也不改变M4/M5/M6尚未完成的状态。
