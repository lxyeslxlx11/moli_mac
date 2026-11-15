# 原创诊断目标：仅源码准备

## 当前后续：已编译的独立v2目标（stage78）

新[freestanding原创源码](../runtime-observer-v2/synthetic-target.c)复用现有MinGW/GCC16.2.0生成x86 PE32，只导入11项KERNEL32，无CRT/参数解析；手写PID名称、导出moli_probe_sequence。旧v1源码保持原字节，本页后文是其历史准备状态。v2已过10项host C模拟、16个REA/CALL-IAT源锚点及两次构建一致核验。[二进制身份与路径](../runtime-observer-v2/fixture-preparation.json)、[源审计](../runtime-observer-v2/fixture-static-audit.json)。

准备副本名moli-diagnostic-fixture.exe、SHA256 `01588841278dcb7360c91333f0f7c5ec81aec84625ca274be54ad9011aaf10eb`、SizeOfImage24576，可供既有metadata checker核身份；构建导出目录的旧basename不改变复制后的bytes。只读ISO两payload回读已通过，但尚未挂载或运行Windows目标，WinDbg与ARMx86实测待普通GUI访问恢复。当前工具报告locked，不以host测试代替实际验收。[介质](../runtime-observer-v2/media-preparation.json)、[状态](../runtime-observer-v2/validation.json)。

复核静态调用点可使用：
```sh
python3 analysis/runtime-observer-v2/audit_fixture.py --target build/analysis/runtime-observer-v2/media/moli-diagnostic-fixture.exe --output /tmp/moli-new-fixture-audit.json
```
输出路径必须尚不存在；静态returnRVA不是运行时记录。Windows演练只能使用此原创目标、显式过滤的7项API元数据与正常退出，不访问参数/映射bytes，不附加原游戏；实际GUI工具/版本/条款与停止路径在恢复访问后核验。


`synthetic-diagnostic-target.c` 是原创Win32源码，未编译、导入或运行。未来需在已核实的现有工具链生成x86 PE32，再核实机器类型、SizeOfImage、摘要和签名/来源；仅ARM64目标不能证明对游戏x86进程的观察能力。源码身份和限制见[范围回执](synthetic-target-scope.json)。没有现成可批准运行的二进制或已验证观察器。

源码只取自己命令行指针而不读取/输出内容；创建带当前PID的64字节合成命名映射，拒绝已有同名对象，打开、映射但不读取/写入映射缓冲，清理句柄后自然退出。没有显式网络、子进程、文件I/O、账号查询或游戏命名空间调用。1500ms及250ms等待仅为未来观察准备，不是限时退出保证；编译器/运行库及实际行为仍须验证。本轮不安装工具、不在来宾编译/执行、不附加原程序、不改变执行策略/安全控制。

[schema校验器](synthetic-trace-contract.mjs)只验调用名、固定目标模块、模块内RVA、单调相对时间及目标身份；拒绝参数、缓冲、账号、未知字段、外部模块、网络/派生API，要求五个API依序且解映射后两次CloseHandle。`identity.imageSize`必须来自未来审阅二进制的PE SizeOfImage，不能用磁盘文件大小替代；虚拟夹具中的SHA值仅是合成测试值。它不采集数据、不证明上游采集器没有读取敏感内容，也不能判断游戏协议。

主机可重复的原创合成校验：

```sh
node --test analysis/diagnostic-preparation-v1/synthetic-trace-contract.test.mjs
```

实际6/6通过，见[日志](synthetic-trace-tests.log)。未运行Windows编译或API观察演练；没有将原游戏命令行、共享内存或通信负载加入夹具。后续只有正常来宾界面具名工具存在性/帮助检查获得证据后，才能提出精确工具、权限与单独演练范围；遇拒绝立即停止，不把CIM/WER替代为协议证据。
