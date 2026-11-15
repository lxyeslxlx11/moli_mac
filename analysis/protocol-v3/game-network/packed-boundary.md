# 三个游戏 EXE：静态网络可见性与入口边界

调查日期：2026-10-25 UTC。已读取当前项目AGENTS：主线为逻辑/通信协议规格及跨平台实现，保留native历史代码。本项只检查用户样本的磁盘字节、PE目录和有限入口控制转移；不运行PE、不脱壳、不仿真、不修改保护、不连接网络、不读取运行共享内存或凭据。

工具：Python 3.9.6标准库（struct/hashlib）、GNU objdump（GNU Binutils）2.47.20260726。完整字段、全部导入项、ILT/IAT地址与原始值、入口边、标签搜索结果见 [packed-boundary.json](packed-boundary.json)。JSON只包含结构元数据及少量必要入口字节，不包含完整程序或大段反编译结果。

## 样本身份

以下每一项结论均绑定本表哈希；同名其他版本不在范围内。

| 文件简称 | SHA256 |
|---|---|
| item = cg_item_6000.exe | `06447ec8e108ffc4153a1720e729d74cc37c39aee0da268ab7b144ba17d9a7e2` |
| se3000 = cg_se_3000.exe | `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126` |
| se6000 = cg_se_6000.exe | `6e2ff83274561047129ef61cbda8b718e3806f68aeb5d36f3a9b5cd08df60a4a` |

三者ImageBase均为`0x400000`，Machine=`0x14c`，PE32。本文VA由文件ImageBase+RVA计算，是首选映像地址，并非观察到的实际运行地址。

## 事实，高置信度：原.text没有文件后备字节

| 文件 | .text节头file offset | .text RVA / VA | VirtualSize | SizeOfRawData |
|---|---|---|---:|---:|
| item | `0x220` | `0x1000` / `0x401000` | 1,992,799 | 0 |
| se3000 | `0x248` | `0x1000` / `0x401000` | 1,753,452 | 0 |
| se6000 | `0x210` | `0x1000` / `0x401000` | 1,206,458 | 0 |

因此不能把该虚拟区间直接映射为磁盘上的原始游戏指令。三个文件都有附加的`.text1`、`.adata`、`.data1`、`.pdata`。这与打包/保护布局相容（**推测，中置信度**），没有认定具体保护产品，也没有恢复其运行时载荷。

## 事实，高置信度：入口的有限可追范围

| 文件 | EP字段file offset | 入口RVA | 入口VA | 入口file offset | 所在节 |
|---|---|---|---|---|---|
| item | `0x150` | `0xf85000` | `0x1385000` | `0xbd000` | .adata |
| se3000 | `0x178` | `0xde6d1e` | `0x11e6d1e` | `0x97d1e` | .text1 |
| se6000 | `0x140` | `0xc3c000` | `0x103c000` | `0x64000` | .adata |

item和se6000入口最初16字节一致：先保存通用寄存器，`call`下一条指令，再`pop ebp`。入口+`0x12`跳到+`0x23`，后者又跳到+`0x1b`；该位置位于从入口做简单线性反汇编时另一条指令的内部。因此线性反汇编输出中出现的后续异常远跳，不能直接视为实际可达流程。精确源/目标VA/RVA/file offset已存JSON；本项在此边界停止，没有做反混淆或载荷重建。

se3000能解出较普通的启动序列：

| 静态边 | 源VA / RVA / file offset | 目标VA / RVA / file offset |
|---|---|---|
| entry直接call | `0x11e6d1e` / `0xde6d1e` / `0x97d1e` | `0x11f14f7` / `0xdf14f7` / `0xa24f7` |
| 返回后直接jmp | `0x11e6d23` / `0xde6d23` / `0x97d23` | `0x11e6bb1` / `0xde6bb1` / `0x97bb1` |
| 被检查启动路径内的直接call | `0x11e6cc6` / `0xde6cc6` / `0x97cc6` | `0x1179000` / `0xd79000` / `0x2a000` |

首个helper引用常量`0xbb40e64e`并经IAT调用时间/进程/线程计数函数，后续流程准备启动参数，符合编译器运行库初始化的特征（**推测，中置信度**）。`0x1179000`附近又可见`GetModuleHandleA`与`GetCommandLineW`的真实IAT调用；它们不构成游戏握手或票据解析证据。

**待验证：**此有限路径没有连到可识别的游戏业务/网络函数。这里的结论是“本项未恢复”，不是“全部.text1无法分析”或“静态分析永远无法推进”。没有通过实际执行验证上述路径可达性。

## 事实，高置信度：真实导入descriptor与IAT

| 文件 | Import RVA / file offset | descriptors | IAT RVA / VA / file offset | IAT bytes | 实际符号 |
|---|---|---:|---|---:|---:|
| item | `0xfb52e8` / `0xea2e8` | 5 | `0xf95000` / `0x1395000` / `0xca000` | 960 | 235 |
| se3000 | `0xe692e8` / `0x1132e8` | 5 | `0xe49000` / `0x1249000` / `0xf3000` | 960 | 235 |
| se6000 | `0xc5fa04` / `0x84a04` | 3 | `0xc4c000` / `0x104c000` / `0x71000` | 736 | 181 |

- item/se3000的真实descriptor为：KERNEL32.dll、USER32.dll、GDI32.dll、COMDLG32.dll、SHELL32.dll。
- se6000为：KERNEL32.dll、USER32.dll、GDI32.dll。
- 共651个符号均为按名字导入，无ordinal导入；全部ILT值与磁盘IAT初始值相等，全部IAT槽位在声明区间内。每个文件IAT长度都精确等于`4×(符号数+DLL终止项数)`。三者Delay Import目录均为`(0,0)`。
- 三者真实导入表均没有WinSock/WinINet DLL，也没有socket/connect/recv/send等命名网络导入。
- 三者都真实导入`LoadLibraryA`、`GetProcAddress`、`VirtualAlloc`、`VirtualProtect`等函数；其中两个还有`LoadLibraryW`。因此**不能**从当前网络导入不可见推导出游戏没有联网逻辑，也不能推定运行时会加载哪个库。

## 事实，高置信度：网络残留字符串不等于真实导入

下表仅se3000命中，全部位于保留的`.rdata`。item/se6000未命中这些精确字面量，只代表此搜索范围内未见。

| 字面量 | file offset | RVA | VA |
|---|---|---|---|
| WSOCK32.dll | `0x290ca` | `0x1d60ca` | `0x5d60ca` |
| WININET.dll | `0x28ff2` | `0x1d5ff2` | `0x5d5ff2` |
| RECV ERROR=%d | `0xd1d0` | `0x1ba1d0` | `0x5ba1d0` |
| CONNECT ERROR=%d | `0xd270` | `0x1ba270` | `0x5ba270` |
| CONNECT OK | `0xd2a4` | `0x1ba2a4` | `0x5ba2a4` |

JSON也记录一个历史HTTP模板的字面量位置；没有访问该地址。上述只能支撑“样本保留网络相关词串”，没有提供协议帧、opcode、加密、认证字段、会话状态机或WebSocket兼容性的规格。

## 事实，高置信度：CGSharedMem与标签的静态交叉核对

按新增线索，对三个磁盘样本搜索ASCII及UTF-16LE的`CGSharedMem`、`gid:`、`glt:`、`OpenFileMappingA/W`、`MapViewOfFile`。

se3000的`.rdata`包含下列以NUL终止的独立ASCII字面量；另两文件均未命中其ASCII/UTF-16LE形式：

| 字面量 | file offset | RVA | VA |
|---|---|---|---|
| CGSharedMem | `0x4874` | `0x1b1874` | `0x5b1874` |
| gid: | `0x4880` | `0x1b1880` | `0x5b1880` |
| glt: | `0x4888` | `0x1b1888` | `0x5b1888` |

搜索整个se3000文件中上述三个VA的精确小端UInt32字节表示，匹配数均为0。该检查不覆盖相对、间接、编码、运行时恢复的引用；不能据此声称不存在消费者。

三者均没有`OpenFileMappingA/W`静态字符串或真实导入。三者均有真实`MapViewOfFile`导入：item IAT VA=`0x1395084`/RVA=`0xf95084`/file=`0xca084`；se3000为`0x1249084`/`0xe49084`/`0xf3084`；se6000为`0x104c0ec`/`0xc4c0ec`/`0x710ec`。

仅se3000的可执行文件后备节中找到直接`FF 15 <IAT VA>`调用模式，并经有限反汇编确认：

- `MapViewOfFile`调用：VA=`0x1180381`，RVA=`0xd80381`，file offset=`0x31381`。
- 前面的`CreateFileMappingA`调用：VA=`0x118031e`，RVA=`0xd8031e`，file offset=`0x3131e`；其IAT槽VA=`0x1249090`，RVA=`0xe49090`，file=`0xf3090`。
- 连续参数压栈表明`CreateFileMappingA`的`lpName=NULL`、高位大小0、低位大小`0x1000`、`flProtect=4`、`hFile=0xffffffff`；返回值保存在同一局部槽位，后续`MapViewOfFile`以该句柄映射`0x1000`字节。

**结论：**这里观察到的是匿名4096字节映射，不能把它归因为命名`CGSharedMem`的消费者，也不能把它与父任务中的Launcher命名256字节映射链合并为已证实的端到端流程。没有检查或读取任何实际运行的共享内存。

**待验证：**字面标签与Launcher相符只是静态对应线索；`gid`、`glt`的语义、分隔/长度/编码、有效期、票据交接和真实性校验仍未证实。本项不命名或实现它们为账号、密码、票据或认证字段。

## 验收与停止点

已通过：3个PE头/节/入口映射解析；13个真实import descriptors及651个ILT/IAT项相互核对；有限入口边静态解码；ASCII/UTF-16LE标签扫描；MapViewOfFile局部参数链核对；JSON重新解析。

未运行：官方PE、自动/手工脱壳、动态内存观察、真实共享内存读取、登录、凭据会话、网络、官服协议兼容测试。没有权限或自动审批拒绝。本项停止原因是现有磁盘/有限控制流证据未连接到实际协议消费者，而不是把未知内容补成协议规格。

可继续的授权内工作是对已有未受保护的Launcher/Patcher控制流完善可追溯规格，并把游戏侧仅有的静态候选对应关系列为待验证。不能据当前证据创建游戏认证实现或宣称网页/手机/小程序已经兼容官服。
