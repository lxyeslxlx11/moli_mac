# 隔离 Windows 环境：官方资料核对

核对日期：2026-10-25。范围仅为公开资料研究；本文件不证明本机 VM 已创建、启动、隔离或通过游戏兼容性验证。本机盘点与实际配置由本阶段环境记录单独提供。没有下载镜像、接受许可、执行安装或操作虚拟机。

## 选型与兼容性

| 结论 | 分类与置信度 | 官方依据及限制 |
| --- | --- | --- |
| 优先复用已安装 UTM，选择 ARM64 Windows 的硬件虚拟化；x86 整机模拟作为有明确兼容性原因后的备选 | **推测/方案，高** | [UTM 主页](https://getutm.app/) 区分 Apple Silicon 的 ARM64 Hypervisor 加速与较慢的 Intel x86/x64 模拟。该结论是基于本机架构与工具已存在的工程选择，不是游戏兼容承诺。 |
| UTM 官网提供免费开源版本；App Store 付费版功能相同，主要增加自动更新并支持开发 | **事实，高** | [UTM 主页 Questions](https://getutm.app/)。官方发布入口是 [utmapp/UTM releases](https://github.com/utmapp/UTM/releases/latest)，本次重定向至 [v5.0.8](https://github.com/utmapp/UTM/releases/tag/v5.0.8)。无需为本任务购买 App Store 版本或订阅商业产品。 |
| Windows 11 ARM 可模拟 x86 和 x64 用户态程序；内核驱动不在这一模拟范围 | **事实，高** | [Microsoft：How emulation works on Arm](https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-x86-emulation)，2025-11-07 更新。Prism 的部分优化针对 Snapdragon，不能将其全部性能特性推广至 Apple Silicon VM。 |
| 内核、UMDF、打印驱动应匹配 ARM64；旧游戏可能因非 ARM64 反作弊驱动失败 | **事实，高；是否适用于本样本待验证** | [Microsoft：Troubleshooting x86 desktop apps](https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-troubleshooting-x86) Drivers；[Windows ARM FAQ](https://support.microsoft.com/en-us/windows/experience/platform-variants/windows-arm-based-pcs-faq) 明确提示部分反作弊驱动不兼容。当前不能推断 CrossGate 样本必然含此依赖，也不以移除或绕过保护作为解决方法。 |
| Windows ARM 平台层面支持 x86 DirectX 9–12 程序，不等于 UTM 虚拟显卡或本游戏已兼容 | **事实，高** | [Microsoft x86 troubleshooting](https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-troubleshooting-x86) 图形条目。旧 DirectDraw、位深、窗口/全屏、音频、输入和壳的行为仍需单独观察。 |
| UTM 5.0 增加实验性 Windows 11 DirectX 加速，不能继续泛称 UTM 完全没有 DirectX/GPU 支持 | **事实，高** | [UTM v5.0](https://docs.getutm.app/updates/v5.0/)、[Windows guest support](https://docs.getutm.app/guest-support/windows/)。DXMT 提供 DirectX 11；D3DMetal 在可用时提供 DirectX 12，Apple Silicon 上后者需要 Rosetta。驱动实验性且可能不稳定；要求 QEMU 后端、合适的 `-gl` 显示设备、guest tools 和 renderer。需按实际安装版本核验，不自动更新或改全局图形设置，也不自动接受 Rosetta 等新增许可。 |

**待验证：** 游戏 PE32 及其依赖能否在 Windows ARM 用户态模拟中启动；是否要求特定系统驱动；旧图形 API 与 UTM 显示驱动是否匹配；保护/封装是否拒绝模拟环境。x86 整机模拟可改变 CPU/OS 架构条件，但速度和虚拟硬件兼容性仍未知，不能视为万能回退方案。VM 只是分析环境，不替代独立网页/移动网页/小程序客户端实现。

## Windows 镜像与许可边界

- **事实，高：** [Microsoft 官方 Arm64 ISO 页面](https://www.microsoft.com/en-us/software-download/windows11arm64) 本次显示 Windows 11 2026 Update / 26H2、多版本镜像，并提供按语言的 SHA256 核验。下载及选版时应重新记录实际文件名、语言、版本、字节数、SHA256、官方校验值和 URL，不把此页面的当前值套用至已有旧镜像。[Microsoft ISO 说明](https://learn.microsoft.com/en-us/windows/arm/iso) 确认可用来创建 VM。该页面没有证明 UTM 或本机配置获得 Microsoft 兼容认证。
- **事实，高：** [Microsoft Mac 使用说明](https://support.microsoft.com/en-us/windows/experience/platform-variants/options-for-using-windows-11-with-mac-computers-with-apple-m1-m2-and-m3-chips) 指明每个 Windows 11 Pro 实例需独立适用许可，密钥不区分 x64/ARM；页面列出 Parallels 的特定授权方案，未由此建立 UTM 的相同官方授权地位。不要把页面未列 UTM 推论为违法，也不要宣称获得官方背书。
- **待确认：** 用户现有 Windows 许可、可迁移/虚拟化权利、安装版本及将出现的实际条款。条款入口为 [Microsoft License Terms](https://www.microsoft.com/en-us/useterms)，应按 OEM/零售/组织协议和具体版本选用；公开 ISO 可下载不等于已接受新许可或已有使用权。遇到安装器明确接受许可的步骤，按本轮用户要求先交由用户确认，不代点接受、不购买、不激活绕过。
- **事实，高：** [Windows 11 系统要求](https://www.microsoft.com/en-us/windows/windows-11-specifications) 列出至少 4 GB RAM、64 GB 存储、2 核、UEFI/Secure Boot 能力和 TPM 2.0；Home 与个人用途 Pro 的首次设置要求互联网和 Microsoft 账号。这与当前不处理账号凭据、无游戏网络的隔离准备边界须分开处理。可以先准备 VM 和镜像；遇到必要账号/OOBE 步骤应报告，由用户确认后自己处理。不得用账户、TPM 或安全检查绕过来完成验收。

## 隔离与回滚设计（尚非本机验收结果）

1. **方案：** 项目专用 VM，不复用含个人账号或敏感文件的运行状态；若已有合适系统，先关机并复制/克隆后再配置，保留原件。
2. **方案：** 离线观察时删除/禁用 VM 网卡，关闭端口转发；不将 NAT、Shared、Bridged 或 Host-only 称为完全断网。[UTM 网络文档](https://docs.getutm.app/settings-qemu/devices/network/network/) 说明 Shared 可与主机互访，Host-only 阻断 WAN，`Isolate Guest from Host` 只阻断访主机的路径。需要保留网卡的后续模拟网络方案应独立设计及授权，当前不连接官方地址。
3. **方案：** 关闭 clipboard sharing；Shared directory 留空并关闭 WebDAV/VirtFS；不挂主机用户目录、SSH/云盘/凭据目录或真实磁盘；不自动 USB 直通；不用相机、麦克风或远程控制。[UTM Sharing](https://docs.getutm.app/settings-qemu/sharing/) 说明 guest tools 可同步剪贴板，并把宿主目录暴露为 WebDAV/9pfs。安装工具后也必须复核这些开关。
4. **方案：** 只通过专用只读介质导入已核验、获准运行的材料；不得直接共享整个项目或 `moli/`。本轮不导入执行游戏安装包。供后续分析的诊断输出只保留必要的进程/模块/错误与文件哈希，不记录账户或完整内存内容。
5. **事实，高：** [UTM Snapshots](https://docs.getutm.app/advanced/snapshots/) 支持 QEMU 快照；快照仅含 VM 内可写磁盘，不含可移动、只读或外部盘。[Disposable](https://docs.getutm.app/advanced/disposable/) 可丢弃运行产生的磁盘变化，但运行期间不能创建快照。**方案：** 先验证干净系统关机副本及恢复，再保存“操作系统已验证、未导入游戏”的基线；每次观察另建可丢弃副本。容量预算须包含 ISO、增长的虚拟盘、基线与至少一个回滚副本，不只看虚拟盘逻辑容量。

## 本次研究验收与限制

已完成：官方 ARM 模拟/驱动/图形限制、UTM 当前免费分发及版本差异、Windows ISO 与许可/账号关口、隔离与回滚能力核对。没有依赖第三方下载站、破解镜像或社区预装 VM；[UTM Gallery](https://getutm.app/gallery/) 本身明确第三方镜像不由项目制作或审核。

未运行：任何 VM、镜像、安装器、游戏、兼容测试；未验证本机配置、快照恢复、OS 安装、GPU、网络隔离。没有修改主机安全设置或工具审批配置。

检索技术限制：首次错误的 UTM 网络 URL 返回不可访问，随后从官方页面导航至上述实际文档；一次批量页面请求返回内部 500，单独官方页读取成功。均不是访问控制绕过；没有遇到站点安全拒绝，也没有登录。所有结论为公开页面截至核对日的观察，后续应与本机实际版本和安装界面对应。
