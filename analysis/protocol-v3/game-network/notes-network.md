# 第三阶段：游戏网络边界与补丁 HTTP 调用证据

调查日期：2026-10-25 UTC。只读用户安装包解出的四个本地PE，未执行PE、未联网、未读取进程或共享内存、未取凭据、未脱壳或重建受保护载荷。本轮未修改产品代码或根reports。每个地址均为样本首选映像VA（ImageBase+RVA），不代表实际运行地址。

## 结论

**事实，高置信度：**Patcher有可追溯WinINet调用链，已由原始IAT、GNU objdump和REA/Ghidra交叉验证；更新清单路径在从入口可静态追到的应用代码中引用。它是更新侧证据，不是游戏包协议。

**事实，高置信度：**三款游戏的普通导入表中没有WSOCK32/WS2_32/WinINet网络导入；它们原`.text`均无文件后备字节，入口在新增节。se3000保留CGSharedMem/gid:/glt:字面量，但未找到可证消费者到socket的链。

**待验证：**动态导入、解包后业务代码、命名映射消费者、票据意义、帧边界、认证、加密或会话状态机。没有可见网络导入不意味着运行时没有网络能力。不得据此编造跨平台协议实现。

## 样本身份

| 模块 | SHA256 |
|---|---|
| Patcher_PUK3.exe | `195f3afda41f342147b0616a4c005a4cb308ae6869b52c4a558fded5f5d9aaa8` |
| cg_se_3000.exe | `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126` |
| cg_se_6000.exe | `6e2ff83274561047129ef61cbda8b718e3806f68aeb5d36f3a9b5cd08df60a4a` |
| cg_item_6000.exe | `06447ec8e108ffc4153a1720e729d74cc37c39aee0da268ab7b144ba17d9a7e2` |

四者均x86 PE32。独立PE解析、导入名称/ordinal、ILT/IAT地址、节和入口偏移分别在对应`*.network-imports.json`。当前解析器定位固定hash样本的审计helper，不是面向任意用户文件的产品解析器。

## Patcher：实际网络导入和调用引用

Patcher普通导入表含200项，其中WinINet7项、WS2_32 29项。WS2_32的ordinal-only导入保留ordinal而未猜名字。下表是实际WinINet IAT与已解析调用点，均绑定上述Patcher哈希。

| API | IAT VA | IAT file offset | FUN00407cb0中的call VA / file offset |
|---|---|---|---|
| InternetOpenA | `0x46926c` | `0x6786c` | `0x407d88` / `0x7188` |
| InternetConnectA | `0x46927c` | `0x6787c` | `0x407e40` / `0x7240` |
| HttpOpenRequestA | `0x469270` | `0x67870` | `0x407eca` / `0x72ca` |
| HttpSendRequestA | `0x469264` | `0x67864` | `0x407f0e` / `0x730e` |
| HttpQueryInfoA | `0x469274` | `0x67874` | `0x407f51` / `0x7351` |
| InternetReadFile | `0x469278` | `0x67878` | `0x407f97` / `0x7397`，`0x407fe2` / `0x73e2` |
| InternetCloseHandle | `0x469268` | `0x67868` | `0x407d50` / `0x7150`等 |

REA/Ghidra12.1.4把该函数识别为`FUN_00407cb0`，body为`0x407cb0..0x407fff`与`0x40804b..0x40810d`两个范围。它打开HTTP会话、连接、选择请求方法、发送、查询响应并循环读取；这些调用具有ReferenceManager的COMPUTED_CALL证据，不只是字符串猜测。

GET/POST字面量分别在VA`0x4778f4`/`0x4778f8`（file`0x75ef4`/`0x75ef8`），函数中存在选择它们的路径。函数请求/读取参数来自上游对象或参数，当前没有把这些上游值解释为游戏认证字段。

独立REA xrefs确认`HttpSendRequestA` IAT的引用为`0x407f0e`与`0x4082fc`：

- [REA xrefs Evidence](rea-patcher-http-send-xrefs-unsandboxed.json)，Evidence ID `ev_d5c58d64959ea2e35b64e7691f5e81328ad778dbebfaf834c9f559ab9ae5b254`。
- [函数有界摘要](patcher-http-function-summary.json)，完整函数Evidence ID `ev_2c835ca1925c857f24136de13aa5095ace229467e1979ada924f75b310407ba5`。
- [固定hash字节锚点](patcher-anchors.json)。完整1.5MB dossier/反编译文本只在`/tmp/moli-analysis/patcher-http-function.json`，没有复制到交付目录；摘要保存其hash与证据ID便于重跑对照。

**可达性限制：**该函数的REA直接caller列表为空，唯一入引用是DATA `0x477950 → 0x407cb0`。字节确认该数据槽保存函数VA；工厂`0x404cd0`的一条分支在`0x404d7b`写入表地址`0x47792c`，它与调度表解释相容。尚未完成从当前配置到具体分支再到间接调用的完整取值证明；不能把它写成已证实运行时必经路径，也不能把空caller列表写成不可达。

## Patcher：入口到更新路径的有限链

下列实际字节与解码的直接边已保存到`patcher-anchors.json`：

1. PE入口VA`0x4152c7`先call`0x41579a`；`0x4152cc`直接jmp`0x41514b`进入CRT代码。
2. CRT代码中的`0x41523e`直接call应用体`0x409240`。这是静态潜在路径；启动错误或条件分支仍可能阻止实际运行。
3. 应用体`0x40983e`加载VA`0x477b24`，其file`0x76124`处为`/cg50/Update.TXT?t=`。
4. 应用体`0x409b9e`直接call`0x404cd0`，该函数包含上文调度对象工厂分支。

[更新路径REA xrefs](rea-patcher-update-path-xrefs.json)只返回`0x40983e`，Evidence ID `ev_8d01e710e9e6fe69822c6eb8d847ad54d9ca83420bdc3275e2c3aec9a36ca2f3`。没有访问该路径或内嵌IP，也没有获得实时更新清单。

这将更新路径从“磁盘字符串存在”推进到“应用代码实际引用”；尚不能闭合到特定HTTPhelper的当前运行分支，更不能据此恢复游戏业务协议。

## 三游戏：具体静态停止边界

详见独立复核 [packed-boundary.md](packed-boundary.md) 和 [packed-boundary.json](packed-boundary.json)。三款普通导入目录共13个descriptor、651个ILT/IAT项，全部复核通过。

| 模块 | 原.text VirtualSize / raw size | 入口VA / file offset / 节 |
|---|---|---|
| item6000 | 1,992,799 / 0 | `0x1385000` / `0xbd000` / `.adata` |
| se3000 | 1,753,452 / 0 | `0x11e6d1e` / `0x97d1e` / `.text1` |
| se6000 | 1,206,458 / 0 | `0x103c000` / `0x64000` / `.adata` |

**事实：**原业务代码虚拟区不能直接映射到文件字节。item/se6000入口有限片段有跳入线性反汇编另一指令内部的边；不能把后续线性解码当可靠控制流。se3000能追到少量启动/运行库代码，未找到消费命名映射并调用游戏网络的函数。

**推测，中置信度：**节布局与打包/保护相容。未识别具体保护器，也未进行脱壳、动态解码、补丁修改或仿真。

## CGSharedMem：命中与排除

se3000 `.rdata` 有以下ASCII常量：

- `CGSharedMem`：file`0x4874`、VA`0x5b1874`。
- `gid:`：file`0x4880`、VA`0x5b1880`。
- `glt:`：file`0x4888`、VA`0x5b1888`。

它们与登录器分支观察到的命名映射和标签一致，构成静态字面关联，**没有读取任何真实字段值**。另两游戏未发现相同ASCII/UTF16字面量；这不是运行时行为不存在的证明。三个VA的简单小端绝对地址引用在se3000整个文件均未找到，仍不排除间接、相对或打包后的引用。

**排除一条看似相关的路径：**se3000在VA`0x118031e`调用CreateFileMappingA，参数为`hFile=-1`、name=NULL、size=`0x1000`；随后VA`0x1180381`调用MapViewOfFile，映射`0x1000`字节。它是匿名4096字节区域，不能被解释为登录器创建的命名`CGSharedMem`/256字节区域的消费者。三款普通导入表均没有OpenFileMappingA/W。

最小缺口现在可精确表述为：`CGSharedMem/gid:/glt:`常量 → 游戏实际读取/解析函数 → 其会话状态 → socket发送函数。四个箭头中的业务数据流均未获得证据，不能把`glt`直接命名为特定票据或认证算法。

## 工具结果、测试与复核方式

- 成功：GNU binutils2.47.20260726静态PE导入与指令读取；Rizin0.9.1静态分析作辅助（其函数边界有重叠/漏检，未当唯一事实）；原创PE解析；REA/Ghidra12.1.4 xrefs和Patcher函数分析。
- 环境失败：第一次普通沙箱REA xrefs因`/Users/lx/.cache/clang/ModuleCache`写入受限而失败；原始记录见`rea-patcher-http-send-xrefs.json`。随后对同一明确静态任务申请工具沙箱升级获准并成功。未改变全局审批、安全设置或工具配置；失败不是样本无调用的证据。
- 成功：[原创PE审计helper测试](test_scan_network_static.py)5项全部通过，[日志](pe-helper-tests.log)。覆盖VA映射、无文件后备区域、命名/ordinal IAT、截断失败、GNU objdump两种直接目标语法。helper对部分坏输入抛`struct.error`/`AssertionError`，不是通用产品解析器。
- 直接边提取原先未兼容GNU输出的`0x`前缀，已修正并加回归测试。最终`*.direct-control-edges-summary.json`明确只保留入口128字节和两个指定Patcher锚点；线性直接边总数不作为可靠CFG或协议覆盖率。
- 未运行：官方程序、真实HTTP、官服通信、账号/共享内存读取、认证、反作弊、协议互操作测试。

只读复核命令：在本目录运行`python3 -m unittest -v test_scan_network_static.py`；样本hash匹配后运行`python3 scan_network_static.py`。扫描器只读取临时PE并调用objdump，输出结构/少量锚点，不执行PE。

## 不涉及保护绕过的下一份证据

可继续比较用户合法持有、明确版本和来源的未受同样布局限制的历史/官方调试样本，或取得官方提供的协议/启动接口说明；不能默默下载不明版本。当前可见Patcher/Launcher的明文代码仍可继续做离线数据流规格，但不应借此冒充游戏消费者规格。

若未来确需动态运行、连接服务或观察真实会话，应另行说明具体目的、环境和风险并取得授权；本轮没有请求或执行这些动作。当前交付应停在上述静态证据边界，不扩展游戏协议实现。
