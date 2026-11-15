# 启动上下文与共享映射顺序：v4 静态增量

本分支仅静态读取既有解包样本，未执行官方程序、操作虚拟机、改兼容模式、联网或读取进程内存、账号与会话。先前单次游戏运行授权不在本分支复用。未修改产品代码和项目主文档。

## 固定样本与方法

- `POLCN_Launcher.unpacked.exe`，1,735,168 字节，SHA256 `601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31`，PE 映像基址 `0x400000`。
- 来源延续 stage3 离线解包记录；POLCN 安装包 SHA256 `dc90bb88e35a82a649f1c026bd0b7b6e7039ddbe5e872f40ffebfb4b16b0fb11`。没有新样本替换。
- 本轮使用 GNU objdump `2.47.20260726` 的限定范围反汇编，并用 Python `3.9.6` 独立读取 PE 节表、导入表、指令字节和相对分支目标。验证器不执行输入文件。
- 复用 REA `6.7.0` / Ghidra `12.1.4` 的函数 `0x407a00..0x408656` 证据，ID `ev_dbedcd398f62cfc0101d98d128add039c7a90461c7435bb3b9077cb713da935e`；旧 dossier SHA256 `ae86a0293ea8074c95746d208aedd07a2866e922f203bd6501527bc58c8bbcbe`。其 high-pcode 标记 **truncated**，不能视作完整语义证明。本轮结论以列出的机器字节及局部控制流为界。
- 详细字段、39 个短指令锚点在 [launch-context.json](launch-context.json)，独立核验的文件偏移和 API 在 [launch-context-validation.json](launch-context-validation.json)。不附完整反编译源码或官方二进制。

## 事实：十个启动参数

`0x408589`（文件偏移 `0x7989`）为间接调用 `IAT 0x4b136c`；独立解析 PE 导入表确认是 `CreateProcessA`。调用前十个参数按 x86 栈逆序压入，无中途额外栈参数。置信度：固定样本该调用的静态值高；运行时字符串内容未观测。

| Win32 参数位置 | 值或局部来源 | push VA |
| --- | --- | --- |
| 1 lpApplicationName | NULL | `0x408587` |
| 2 lpCommandLine | `EBP-0x80` 的 CString 指针 | `0x408586` |
| 3 lpProcessAttributes | NULL | `0x40857c` |
| 4 lpThreadAttributes | NULL | `0x40857a` |
| 5 bInheritHandles | 0 | `0x408578` |
| 6 dwCreationFlags | 0 | `0x408576` |
| 7 lpEnvironment | NULL，没有本调用专用环境缓冲 | `0x408574` |
| 8 lpCurrentDirectory | `EBP-0x14` 的 CString 指针 | `0x408573` |
| 9 lpStartupInfo | `EBP-0x7c`，清零的 0x44 字节结构，cb=0x44 | `0x40856a` |
| 10 lpProcessInformation | `EBP-0x28`，清零的 0x10 字节结构 | `0x408566` |

工作目录在 `0x407e3e`（偏移 `0x723e`）取对象字段 `+0x1b18`，`0x407e47` 调用复制辅助函数存到 `EBP-0x14`。命令行先由 `0x407e25` 的 `+0x1b1c` 拷入 `EBP-0x80`，随后追加空格、`0x407e69` 的 Argsline 访问器结果、可选字段 `+0x1b48/+0x1b4c` 和特定分支的资源枚举结果。此处只记录字段和调用关系，没有导出运行值。

此前目录证据中的 Game Code 11 对应 `cg_se_3000.exe`，Argsline 为静态文本 ` updated `；配置摘要源 SHA256 为 `be8f1213d77bd294fbb79b2fb51a5e7fecdc9aa3c0854db7a6d821fad20ef85a`。Code 11 不走 Code 3/5 的 Bin/GBrowser 工作目录改写分支。**推测**：独立无参数启动与该启动器路径可能有影响行为的上下文差异。**待验证**：目录字段最初的完整生产链、附加字段语义、实际启动参数及其游戏侧消费者。

## 事实：CGSharedMem 早于启动，但成功并非硬门槛

Code 11 在 `0x407fbf` 条件处分入 CG 分支，`0x407fc5` 引用 `CGSharedMem` 常量；`0x408391` 跳至共享映射公共段 `0x408457`。

1. `0x408477`（偏移 `0x7877`）调用 `OpenFileMappingA`，IAT `0x4b1340`。
2. 返回句柄为零时，`0x4084a2`（偏移 `0x78a2`）调用 `CreateFileMappingA`，IAT `0x4b1344`；容量静态参数 `0x100`，证据 `0x408495`。
3. **关键失败分支**：`0x4084b5`（偏移 `0x78b5`）的 `je` 直接到 `0x4084ea`。因此句柄仍为零时跳过映射及复制，却继续初始化进程启动结构；不能把共享映射创建成功称为此路径强制前置条件。
4. 非零句柄路径在 `0x4084c6` 调用 `MapViewOfFile`（IAT `0x4b1348`），`0x4084cc` 保存返回指针，之后 `0x4084e2` 调用复制类辅助函数。这个局部区间没有检查返回指针为零的条件跳转；未据此断言运行失败、漏洞或此前崩溃原因。
5. `0x4084ea` 开始启动结构初始化，随后 `0x408589` 才可能调用 `CreateProcessA`。

另一个精确但语义未闭合的门槛：对 Code 11，`object+0x1708 == 0` 时，`0x408525` 跳 `0x408563` 进入压参；非零时，经 Code 条件分支在 `0x408561` 跳 `0x408592`，跳过本次 CreateProcess。**待验证**：`+0x1708` 的生产者和业务含义。不能擅自命名为登录、认证或已运行标志。

`CGSharedMem` 的名称、容量、生产调用顺序是静态事实；其中标签和对象字段不构成已还原的网络协议。游戏端如何消费共享映射仍缺少证据。

## 验证与准确边界

- 独立字节核验：**39/39 通过**，其中 4 个 API 通过 PE IAT 名称解析核对，分支从相对机器码重新计算目标。
- 验证器原创合成夹具：**6/6 通过**。覆盖相对负位移、截断/错误分支编码、样本哈希变化、错误 API、错误分支目标、错误指令及重复锚点 ID。
- 首次测试收集因历史夹具的 `verify_launch` 模块导入路径未注册而失败；已显式复用同一路径加载的模块后重跑通过。首次日志保存在 `launch-context-tests-initial-import-failure.log`，最终日志为 `launch-context-tests.log`。
- 未运行：官方启动器或游戏、兼容模式实验、动态上下文核验、网络/账号/协议会话实验。没有据此验收官方可玩性。

从包含 `analysis/` 的项目/暂存根重现：

```sh
python3 analysis/launcher-v4/verify-launch-context.py --pe /tmp/moli-analysis/polcn/POLCN_Launcher.unpacked.exe
python3 -m unittest discover -s analysis/launcher-v4 -p 'test_launch_context.py' -v
```

本增量可复核地缩小了“启动器与直接执行的差别”，尚不足以归因既有故障或认定兼容模式有效。最小后续静态证据是定位 `+0x1708` 的写入者、`+0x1b18` 的来源及游戏端命令行/共享映射消费者；若转为动态验证，需要新、明确的授权范围，不能复用已消费的单次运行批准。本分支没有操作被拒、待审批或执行结果不明的动作。
