# v9：TPM 查询错误与剩余设备的只读调查

日期：2026-10-25 UTC。范围为微软、QEMU、UTM 官方公开资料及已保存的 v8 证据。没有操作 UI、实时查询客户机、读取虚拟磁盘/TPM 状态载荷、使用凭据、改变设置或安装组件。父任务另行进行的恢复启动测试不属于本报告的实测结果。

## 当前能确定的结论

**事实，高置信：**微软定义 `0x80284001` 为 `TBS_E_INTERNAL_ERROR`，短释义是“An internal software error has been detected.”。它是内部软件错误，不携带具体根因；“未找到兼容 TPM”是另一个错误 `0x8028400F`，不能将二者等同。[微软错误码表](https://learn.microsoft.com/en-us/windows/win32/com/com-error-codes-6)

TBS 是 Windows 中协调应用访问 TPM 的服务层。因此，v8 的失败证明该次查询未得到健康结果，不能单凭此判断 TPM 缺失、物理损坏、状态文件损坏、PIN 错误或必须清除 TPM。[微软 TBS 说明](https://learn.microsoft.com/en-us/windows/win32/tbs/tpm-base-services-portal)

**事实，历史观察：**[v8 客户机记录](../vm-install-v8/guest-observations.json)及[错误截图](../vm-install-v8/tpm-query-error.png)记录管理员查询失败；[安全启动截图](../vm-install-v8/secureboot-state.png)记录 `Confirm-SecureBootUEFI=True`。微软对该命令的定义只涉及安全启动是否启用，不能替代 TPM 健康验收。[命令定义](https://learn.microsoft.com/en-us/powershell/module/secureboot/confirm-securebootuefi?view=windowsserver2025-ps)

v8 的 34 项问题仍是 32 个 **`LNRO0005`**、1 个 `QEMU0002`、1 个 virtio serial PCI `1003`。前两者分别匹配 virtio-mmio 传输节点和 fw_cfg，并非已识别的 TPM 节点；没有证据把这 34 项全部归因于 TPM。设备语义、空 transport 的可能性及漏 O 的旧 INF 负搜索限制，沿用[v8 研究](../vm-install-v8/remaining-device-research.md)，不重复扩展“无驱动”结论。两次设备查询尚未逐实例连接。

## ARM 支持与可复核的兼容性线索

**新增本机事实（父任务只读采集）：**[本机版本记录](utm-local-version.json)为 UTM `5.0.8` build `128`；已装 aarch64 QEMU universal framework SHA256 为 `16d48f6e3e83fdabb760ac01f17f2c69af844f3403be77fad51c692189896f5f`，十进制文件偏移 `11712637`、`41859698` 含 `QEMU emulator version 10.0.12`。本分支只读该小型记录，没有重新读取二进制。该证据绑定已装版本，尚不证明与 `v10.0.12-utm` 源码逐字节对应、实际运行时参数或 PPI 行为。

| 证据等级 | 具体来源 | 对本项目的含义 |
|---|---|---|
| **官方支持说明** | [UTM v4.3 发布说明](https://docs.getutm.app/updates/v4.3/#highlights)明确将 ARM64 纳入 TPM 2.0/Secure Boot 支持。 | 不能笼统称“ARM 不支持 TPM”。支持范围不保证当前 Windows 构建、固件、后端组合健康；本轮不执行文档中重置 UEFI 等配置步骤。 |
| **固定版本源码事实** | [UTM v5.0.8 `tpmArguments`](https://raw.githubusercontent.com/utmapp/UTM/v5.0.8/Configuration/UTMQemuConfiguration%2BArguments.swift)，文件行 1239–1259：`virt` 目标选择 `tpm-crb-device`，连接 socket/emulator 后端。 | 与已有 UTM 版本/virt 配置相符的预期路径；本轮没有读取本机有效命令行，不能称已验证运行时型号。Homebrew 的 qemu-img 版本不能代表 UTM 内嵌后端版本。 |
| **固定版本源码事实** | UTM QEMU `v10.0.12-utm` 的 [`build_tpm_crb_sysbus_aml`](https://raw.githubusercontent.com/utmapp/qemu/v10.0.12-utm/hw/tpm/tpm_crb_sysbus.c)，行 112–116，向 `tpm_crb_build_aml` 传入末参 `false`；[对应函数](https://raw.githubusercontent.com/utmapp/qemu/v10.0.12-utm/hw/tpm/tpm_crb_common.c)，行 232–247，将末参定义为 `build_ppi`，只有为真才追加 PPI ACPI 方法，并声明 TPM 硬件 ID `MSFT0101`。 | **候选缺口：**该固定源的 ARM CRB 路径不生成这些 PPI 方法。已装二进制版本字符串为 10.0.12，但其源码对应、固件及有效参数仍未全部绑定，不能直接认定本次错误根因；也没有用驱动 ISO 的发行标签代替后端版本核验。 |
| **官方相邻机制说明** | [QEMU master 的 ARM64 PPI 文档](https://www.qemu.org/docs/master/specs/tpm.html#ppi-on-arm64-virt)说明缺少 PPI 可使 Windows 11 ARM64 的物理存在能力查询记录错误。 | 该段明确针对 **TIS**，而上述 UTM 路径是 **CRB**。只能支持调查 PPI/ACPI 兼容性这一假设，不能直接套用参数、切换型号或宣称已找到修复。动态 master 文档不等于本机发行版本。 |
| **官方仓库中的用户报告** | [UTM #6167](https://github.com/utmapp/UTM/issues/6167)，2024-03-02，M1 Pro、UTM 4.4.5/4.5.0 beta、Windows 11 ARM 23H2，报告 TPM 驱动错误；本次读取仍为 Open。 | 不是维护者确认的根因/修复；没有给出本项目的精确 HRESULT，版本也不同。仅证明有相关历史报告，不证明当前必现或同因。没有读取其附件日志。 |

**推测，待证伪：**Windows TPM 管理查询与所暴露的 ACPI/PPI 能力不匹配，是有具体源码依据的调查方向；TBS/驱动/固件/模拟后端哪一层产生本次错误尚未定位。本轮限定检索未找到 UTM 官方对 `0x80284001` 的精确诊断或已验证修复。不能据此开展清除、重新初始化、驱动替换或安全设置变更。

## 下一次可执行的最小只读诊断

以下是**待执行方案**，不是结果。本分支未运行。仅在父任务已获得正常 Windows 桌面后逐项执行；遇到登录由用户处理，不使用 v8 的一次性凭据/授权。保持原隔离配置。每项保留命令、时间、成功/失败、返回码和允许字段；失败后不循环重试或改走更高权限路径。

1. **区分服务状态与设备识别。**只读查看 TBS 状态和已存在的安全设备：

   ```powershell
   Get-Service -Name TBS | Select-Object Name,Status
   Get-PnpDevice -PresentOnly -Class SecurityDevices | Select-Object Status,Class,FriendlyName,InstanceId
   ```

   这两条分别读取服务/设备元数据，不启动、停止或重新配置服务，不启用/禁用设备。空结果或查询错误分别记录，不能当作 TPM 一定不存在；服务的一次状态也不能单独证明根因。[Get-Service](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-service?view=powershell-5.1)、[Get-PnpDevice](https://learn.microsoft.com/en-us/powershell/module/pnpdevice/get-pnpdevice?view=windowsserver2025-ps)

2. **用另一官方读取入口交叉检查。**

   ```powershell
   tpmtool getdeviceinformation
   ```

   微软将此子命令定义为显示 TPM 基本信息；按实际返回记录存在/就绪等字段或错误，不凭输出缺失补默认值。不运行同工具的 `gatherlogs` 或 `drivertracing`，它们会创建日志或开启跟踪，不是本方案的纯查询。[tpmtool](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/tpmtool)

3. **必要时只查 WMI 的非秘密属性。**

   ```powershell
   Get-CimInstance -Namespace 'root\CIMV2\Security\MicrosoftTpm' -ClassName Win32_Tpm -Property ManufacturerId,ManufacturerVersion,SpecVersion,PhysicalPresenceVersionInfo,IsEnabled_InitialValue,IsActivated_InitialValue,IsOwned_InitialValue -OperationTimeoutSec 15 |
     Select-Object ManufacturerId,ManufacturerVersion,SpecVersion,PhysicalPresenceVersionInfo,IsEnabled_InitialValue,IsActivated_InitialValue,IsOwned_InitialValue
   ```

   这些属性在官方类定义中为只读；`*_InitialValue` 是实例建立时的快照，不是持续健康监测。`PhysicalPresenceVersionInfo` 有助于区别 PPI 可查询性；“Not Supported”、空结果、权限错误或原 HRESULT 均须原样区分。此查询不调用任何 WMI 修改方法。[Win32_Tpm](https://learn.microsoft.com/en-us/windows/win32/secprov/win32-tpm)、[显式属性读取](https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance?view=powershell-5.1)

   不输出完整 `Get-Tpm` 对象、`Format-List *`、`OwnerAuth`、密钥或恢复材料；微软文档明确完整 TpmObject 可包含 OwnerAuth。v8 只选择健康字段的历史观察不改写，后续优先使用上述限定属性入口。[Get-Tpm 输出字段](https://learn.microsoft.com/en-us/powershell/module/trustedplatformmodule/get-tpm?view=windowsserver2025-ps)

4. **仍不明时只增加所需证据。**可先 `Get-WinEvent -ListProvider '*TPM*' | Select-Object Name` 确认本机有哪些相关提供者。后续若需要事件，只制定有时间窗、最大条数和字段白名单的读取；不先导出全量事件/调试日志，不读取账号/Hello 凭据记录。[Get-WinEvent](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent?view=powershell-5.1) UTM 官方还提示调试日志可能包含按键，因此本轮不启用或索取完整 UTM 调试日志。[UTM Logging](https://docs.getutm.app/settings-qemu/qemu/#logging)

## 结果应如何解释

| 后续观察 | 可以缩小的范围 | 仍不能声称 |
|---|---|---|
| TPM 设备存在、基本信息成功，Get-Tpm 仍失败 | 某个管理查询/能力路径与设备基本识别有区别；继续绑定 PPI/事件证据 | TPM 全部健康、错误一定只在 PowerShell、可直接忽略 |
| PPI 版本不支持/读取失败，而其他基本信息成功 | 与 PPI 假设相容，但还需本机有效参数、固件/后端版本及精确失败位置 | 源码线索已经证明当前根因、应改 `ppi` 或更换 TPM |
| 所有 TPM 信息入口失败，或安全设备有问题码 | 记录枚举/服务/驱动/后端层仍有缺口，先核对准确码和实际设备 ID | TPM 状态坏了、需要清除或重建 |
| 正常恢复启动后现象变化 | 将新观察和 v8 分开，绑定本次副本/系统构建/时间 | 复制或一次启动已验证密钥、TPM、全部设备及游戏兼容 |

本轮停止在可复核的错误含义、固定源线索和最小诊断方案。清除/初始化 TPM、修改 UEFI/安全启动/签名控制、替换 TPM 型号、安装无关增强服务、复用登录凭据及游戏运行均不属于本方案。

## 交付与未验收

已完成官方资料核对与 v8 小文件身份绑定；版本、URL 和输入 SHA256 见[研究元数据](tpm-research-evidence.json)。未执行客户机诊断、克隆/启动、设置变更或设备修复；不将研究结论记作 TPM/环境验收通过。产品代码无变化，未重跑产品测试。父任务统一集成 README/reports，本报告不覆盖 v8 历史状态。
