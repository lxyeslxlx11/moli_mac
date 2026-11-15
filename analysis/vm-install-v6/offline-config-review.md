# v6 固定离线配置核验器审查

日期：2026-10-25 UTC。只读配置与文件元数据，不操作 UI、不修改 VM、不打开客户机磁盘内容。

**事实：** 新增 [verify_offline_config.py](verify_offline_config.py) 与 [test_offline_config.py](test_offline_config.py)。代码内固定完整配置，唯一允许相对 v5 的变化是 `Network=[]`；仍保留原 NVMe 系统盘、只读 Windows CD 和只读 NetKVM CD。固定期望已与 [v5 配置证据](../vm-install-v5/driver-cd-config.json) 移除 Network 后逐字段、逐类型比对一致。运行时不读取或信任该 JSON，因此篡改基线不会授予新设备、网络或共享权限。`Information.Notes` 仍是旧备注，为精确差分而固定，不把它当当前系统状态。

**事实：** Python 3.9.6 下 10 个测试方法通过，包含多组有意义负例：所有网卡模式与端口转发、目录/剪贴板/USB 共享、QEMU 自定义参数、TPM/UEFI 变化、外部/替换/重排磁盘、可写 CD、新设备/未知或缺少字段、bool/int 混淆、VM 身份变化、叶路径符号链接/硬链接、缺失/额外/非普通 Data 文件、超大/坏 plist、重复 plist 键、FIFO 及 stat/open 之间文件替换。有效 XML/binary plist 只打开配置文件；客户机文件增长只形成元数据观察，不被说成完整性验证。见 [测试日志](offline-config-tests.log) 和 [验证回执](offline-config-validation.json)。原 v1/v2 策略及 v2 测试文件与 stage9 manifest 的 hash 相同，没有放宽旧策略。

**事实：** 对实际当前 VM 执行一次保存的审计采样，退出码 **1**，21 项检查中唯一失败是 `config.Network`。配置 SHA256 仍为 `97cb2df7e4554cb742d6026ab02388f4333b847c75620a7c5798e2de585c3ce8`。这是对当前临时 NAT 的**预期拒绝证据**，不是“离线配置通过”；20 项通过也不能消除 Network 失败。见 [当前负向审计](current-config-negative-audit.json)。没有自动删除/断开网卡、改变配置或操作客户机；父任务仍负责后续 UI 断网及复核。

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s analysis/vm-install-v6 -p 'test_offline_config.py' -v
PYTHONDONTWRITEBYTECODE=1 python3 analysis/vm-install-v6/verify_offline_config.py \
  --bundle /Users/lx/Documents/code/moli-mac/build/utm/MoliOffline-ARM64-20261025.utm
```

**待验证：** 实际恢复断网后的审计通过尚未发生。正常关机、重启恢复、Windows 更新/设备、安全启动、签名信任、冷基线、游戏兼容等都不在这个配置核验器的证明范围。它只打开至多 65,537 字节的 `config.plist`，其余为元数据；不读取 qcow2 header/backing chain、介质 hash、EFI/TPM 或用户数据。叶路径链接被拒绝，但祖先目录链接、全部并发替换、UTM 全局/运行时覆盖及检查后的变化仍不由此保证。必须把 UI 状态和独立介质/冷基线证据与本结果分别记录。
