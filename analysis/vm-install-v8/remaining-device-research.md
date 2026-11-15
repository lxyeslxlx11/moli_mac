# v8 剩余设备：官方定义与安装必要性

日期：2026-10-25 UTC。只读研究；没有操作 UI、查询实时客户机、安装驱动、改写 VM、挂载磁盘或访问凭据。README/总体验收由父任务统一更新。

## 实际观察及拼写修正

**事实（已有截图）：** [remaining-device-families.png](remaining-device-families.png) 原分辨率显示，CIM 非零问题码为 34 条 `28`；另一个 `Get-PnpDevice -PresentOnly` 查询将 `Status != OK` 的设备按实例 ID 第二段分组：32 条 `LNRO0005`、1 条 `QEMU0002`、1 条 `VEN_1AF4&DEV_1003&SUBSYS_00031AF4&REV_00`。两次查询不是逐实例连接，不能据数量一致就称所有行已一一关联。

截图首组为 **`LNRO0005`（第 4 位是字母 O，共 8 位）**；聊天转述 `LNR0005` 漏了一位，以截图为准。本轮没有机器可读 ID 导出。截图 SHA256：`f85c6a7057aa97b7fd07e1d62b829826cc602a898dc34c8eee741a64485accd1`。父任务报告此观察发生在 viorng/viogpudo 安装后；本分支没有执行或独立重验安装。

## 官方证据

| 项目 | 事实及来源 | 本项目结论边界 |
|---|---|---|
| `LNRO0005` | QEMU `v10.0.0` 的 [`virtio_acpi_dsdt_add`](https://github.com/qemu/qemu/blob/v10.0.0/hw/virtio/virtio-acpi.c#L10-L30) 为每个 virtio MMIO 节点写入此 `_HID`，并描述 MMIO/中断资源。ARM [`build_dsdt`](https://github.com/qemu/qemu/blob/v10.0.0/hw/arm/virt-acpi-build.c#L769-L773) 传入 [`NUM_VIRTIO_TRANSPORTS = 32`](https://github.com/qemu/qemu/blob/v10.0.0/include/hw/arm/virt.h#L42)；[官方 virt 文档](https://www.qemu.org/docs/master/system/arm/virt.html#supported-devices) 也列出 32 个 transport。 | **高置信语义匹配：**截图中的 32 条与该平台传输节点一致；不是 32 个已证实缺少功能驱动的实际外设。上游固定版本不等于已逐字节核验本机 UTM 内嵌 QEMU。 |
| 空 transport 的可能性 | [`virtio_mmio_read`](https://github.com/qemu/qemu/blob/v10.0.0/hw/virtio/virtio-mmio.c#L79-L107) 明确处理无后端的 transport：部分识别寄存器有效，设备 ID 为 0。 | **事实：**接口允许没有后端设备。**待验证：**本 VM 这 32 个是否全部为空；没有检查实际后端映射，不把“全部无害/完全无需驱动”写成结论。 |
| `QEMU0002` | [QEMU fw_cfg 规范的 ACPI Interface](https://www.qemu.org/docs/master/specs/fw_cfg.html#acpi-interface) 明确对应固件配置接口；固件可从此取得配置/表，内核可据 ACPI 节点清点其占用的 I/O/MMIO。 | **高置信：**它是 fw_cfg，不是显示或键盘设备。该说明未证明普通桌面或本项目实验必须另装 Windows fw_cfg 驱动。 |
| ARM64 fw_cfg 安装支持 | [UTM 官方安装脚本](https://github.com/utmapp/spice-nsis/blob/main/win-guest-tools.nsis#L211-L245) 将 `qemufwcfg` 对 `ACPI\QEMU0002` 的安装置于非 NativeARM64 条件内。 | **事实：**所查脚本在原生 ARM64 跳过此驱动。**未知：**是否存在其他适配、正常签名且支持本 VM 的官方 ARM64 包；不能由脚本推论全球不存在。没有可核验候选，不建议强装。 |
| 剩余 PCI `1003` | 同一 [UTM 脚本](https://github.com/utmapp/spice-nsis/blob/main/win-guest-tools.nsis#L155-L160) 将此 ID 映射至 vioserial/vioser；[v6 本地介质报告](../vm-install-v6/device-driver-candidates.md) 已记录 ARM64 INF 精确匹配、载荷/hash 与证书解析边界。 | 是 virtio serial 传输候选；此处未安装，也未建立本项目必须使用该通道的需求。不以清除警告为由安装完整 Guest Tools、guest agent、共享或其他增强服务。 |

QEMU 源码均固定在 `v10.0.0`；QEMU 文档与 UTM `main` 为本次读取的动态页面，未将 UTM 脚本自动等同本地 `0.1.274` 构建。以上为短释义/符号引用，未复制源码主体。

## 驱动支持与负证据的限制

**未核验：**`LNRO0005` 的适配 Windows ARM64、正常签名且必要的官方驱动包。本轮没有因目录名、证书可解析或 x86 驱动存在就判定其适用。

**纠正既有搜索范围：**v6 报告对官方 UTM `0.1.274` ISO 的 298 份 INF 搜索词是 `LNR0005` 和 `LNR0&DEV_0005`，没有覆盖这里确认的 `LNRO0005`；其“无命中”不能当作正确 ID 的无驱动证据。本轮没有重新挂载/搜索介质。该 ISO SHA256 为 `ab6add47a4ed992f5920f14e96f68d60566e6f731e2cf816c3d38ab2b78f407a`，身份与原搜索方法见 v6 报告；未改写历史记录。

virtio-win 仓库预期 `qemufwcfg` INF 路径返回 404，随后同目录页面读取返回 `restricted URL`，本轮停止该读取路径，没有重试或换访问方式绕过。结论采用可访问的 QEMU 官方定义和 UTM 官方安装逻辑，不补猜未取得的源码/签名支持。

## 当前判断与停止点

**推测/建议：**父任务已有桌面及系统查询成功，因此这些剩余警告至少没有阻止已观察到的启动/查询；这不等于全部设备、图形、稳定性或游戏兼容验收。当前保留这 34 条已知问题及分类，不为达成“零黄色警告”扩大安装范围。

只有出现与某个节点可关联的实际功能阻碍，再核实后端、准确硬件 ID、适配 ARM64 的官方包及正常 Windows 签名信任。不得改 INF、禁用签名检查、隐藏/禁用设备来伪造通过；也没有证据将此前 PIN 输入问题归因到这两类 ACPI 设备。

**完成：**原始截图复读/hash、官方定义与调用链核对、ARM64 安装条件核对、旧负证据限缩。**未运行/未验证：**客户机进一步查询、驱动安装/信任链测试、实际 transport 后端映射、游戏运行/联机；本报告不声称设备已全部修复。
