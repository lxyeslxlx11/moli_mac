# Windows ARM64 临时 NAT 与最小网络驱动研究

核查日期：2026-10-25。仅官方网页/上游源码和已安装 UTM 的只读核查；本研究未下载驱动、运行安装器、操作 UI 或改变 VM。用户授权仅限本项目 VM 临时 NAT 与必要官方 ARM64 驱动；主机目录、剪贴板和 USB 共享仍关闭，到微软账号页交由用户亲自处理，不提交账号或凭据。该授权不包含游戏运行、官方游戏连接或降低签名/安全要求。

## 已有实测与本轮未测边界

- **本项目既有事实：** `MoliOffline-ARM64-20261025` 为 QEMU/aarch64、4 CPU、8192 MiB，已由 NVMe 系统盘进入 Windows OOBE；系统命令窗口显示 `10.0.26300.9457`。此前无网卡，OOBE要求 Internet，后来正常关机。证据为[联网关口](../vm-install-v3/oobe-network.png)、[系统版本](../vm-install-v3/oobe-system-version.png)、[关机后配置](../vm-install-v3/final-config-audit.json)。这不是驱动故障证明：当时配置中根本没有网卡。
- **本轮尚未实测：** 任意网卡型号的客户机识别、驱动包真实性/架构/签名、DHCP、DNS、HTTPS、OOBE联网、账号页、桌面或游戏。后续主任务的新实测应另立证据，不覆盖本文件研究时点。
- **版本边界：** 本机只读 `Info.plist` 为 UTM `5.0.8 (128)`、`com.utmapp.UTM`。当前官方指南为滚动文档，不是精确绑定本机软件与该 Windows build 的兼容表。[UTM 5.0.8发布说明](https://github.com/utmapp/UTM/releases/tag/v5.0.8)可确认对应发行版本，不能据此承诺网卡驱动可用。

## 网卡与 NAT 选型

**事实：** UTM 当前 QEMU 网络文档推荐 `virtio-net-pci`，同时注明可能需要客户机附加驱动。Emulated VLAN 在用户态处理网络；macOS Shared Network 由宿主路由，客户机与宿主可互相访问其服务。Host Only不能访问Internet，Bridged为二层桥接。因此不能将临时 NAT/Shared 表述为完全隔绝宿主或局域网，也不能把网络模式名称与主机文件共享开关混为一谈。文档列有隔离宿主选项，但其具体模式/后端效果仍应以保存配置和运行证据确认。[UTM Network](https://docs.getutm.app/settings-qemu/devices/network/network/)

| 候选型号 | 官方证据与边界 | 本项目判断 |
|---|---|---|
| `virtio-net-pci` | UTM推荐；Windows排障指向含网络驱动的Guest Tools | 首选有来源的候选，需要匹配 ARM64 NetKVM；不声称系统免驱 |
| `e1000` | 微软QEMU/EXDI示例使用它，但明确为Windows x64和`qemu-system-x86_64` | 不能外推当前ARM64镜像自带驱动 |
| `e1000e` | 未找到微软/UTM对当前Windows11 ARM64内置支持的明确证明 | 待验证；不作为确定的免驱捷径 |
| `rtl8139` | QEMU手册有该设备模型及x86/Linux示例 | 模型存在不等于Windows ARM64内置支持 |

型号对照来源：[微软EXDI示例](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/setting-up-qemu-kernel-mode-debugging-using-exdi)、[QEMU手册](https://www.qemu.org/docs/master/system/qemu-manpage.html)。这项检索缺口不等于证明上述型号绝对不可用。

**事实：** Windows on Arm的x86/x64模拟只覆盖用户态，不能代运行网卡内核驱动；内核组件必须编译为ARM64。[微软模拟说明](https://learn.microsoft.com/en-us/windows/arm/apps-on-arm-x86-emulation)

**工程建议：** 同一VM只增加一枚已选定的`virtio-net-pci`，保存实际NAT模式，不加桥接、端口转发、目录/剪贴板/USB共享或自定义QEMU参数。核对驱动与设备，再分别确认地址分配、网络可用和OOBE前进；配置成功或ping结果都不能替代这些验收。UTM指南还包含OOBE和安全检查绕过内容，本项目不执行。[UTM Windows指南](https://docs.getutm.app/guides/windows/)

## 官方发行介质与最小驱动范围

**事实：** UTM Guest Tools官方文档列出arm64支持；其普通流程下载并挂载工具ISO，整套安装会安装多项驱动和工具，不能视为仅网络驱动的最小变更。[UTM Windows Guest Tools](https://docs.getutm.app/guest-support/windows/)

| 来源 | 已确认信息 | 未确认信息 |
|---|---|---|
| 当前本机UTM官方入口：[utm-guest-tools-3d-latest.iso](https://getutm.app/downloads/utm-guest-tools-3d-latest.iso) | 从已安装5.0.8程序的字符串直接读出，见下方复核命令；属于滚动latest入口 | 未请求该ISO、未解析最终重定向，当前字节数、hash、驱动版本及CAT签名均未核验；不能称固定稳定版本 |
| 固定历史发行：[utm-guest-tools-0.229.iso](https://github.com/utmapp/UTM/releases/download/v4.4.4/utm-guest-tools-0.229.iso) | 官方v4.4.4资产列表显示225 MB，时间2023-11-07T23:14:45Z | 网页仅给四舍五入大小；未下载，实际大小/hash、包内w11/ARM64内容与本系统兼容性未核验，不因版本固定而优先于已确认的新包 |
| virtio-win上游发行入口 | 官方打包README链接Fedora的stable/latest ISO；stable与RHEL发行相关，latest可能具有预发行质量 | 官方archive本次返回Anubis Access Denied，未重试或绕过；没有取得当前发行版本、介质或hash |

发行来源：[UTM v4.4.4官方资产列表](https://github.com/utmapp/UTM/releases/expanded_assets/v4.4.4)、[virtio-win打包README](https://github.com/virtio-win/virtio-win-pkg-scripts/blob/master/README.md)。UTM v5.0.8资产列表未显示单列Guest Tools ISO；应用版本与驱动介质版本不能混用。

本机只读入口复核命令（已执行；没有运行UTM可执行文件）：

```sh
/usr/bin/strings /Applications/UTM.app/Contents/MacOS/UTM | rg -m 12 'https?://[^ ]*(guest-tools|downloads/)|guest-tools.*\.iso'
```

与Windows相关的实际结果为 `https://getutm.app/downloads/utm-guest-tools-3d-latest.iso`，出现两次；字符串出现本身不证明远端文件当前可下载或其签名可信。

**事实：** 上游`win11_arm64.ddf`的NetKVM部分列出`netkvm.cat`、`netkvm.inf`、`netkvm.sys`、`netkvmp.exe`及调试符号；这是ARM64产物布局证据，不是任一发行ISO已核验的文件清单。[virtio-win打包定义](https://github.com/virtio-win/kvm-guest-drivers-windows/blob/master/win11_arm64.ddf)

**事实：** UTM安装脚本的`GetDriverSubdir`为Windows11/NativeARM64选择`w11/ARM64`，NetKVM调用另有明确设备匹配逻辑。整套脚本还包含显示、存储、共享agent等安装流程。因此本任务建议只提取实际介质中NetKVM对应的完整驱动包，按INF的源文件/CopyFiles/CatalogFile引用保留所需文件，不假设仅三文件就完整，不运行整套EXE或实验性图形安装。[UTM安装脚本](https://github.com/utmapp/spice-nsis/blob/main/win-guest-tools.nsis)

**待验证：** 当前发布包是否提供独立最小ARM64 NetKVM下载，未找到明确官方单包发行链接；不能把上游源码或历史issue附件当作已签名正式发行。主任务若取得工具ISO，应记录最终来源、介质SHA256、实际NetKVM目录及逐文件hash，派生只含完整网络驱动包的本地只读介质；不导入官方游戏资产，不新增共享agent。

## 签名与正常安装的证据要求

1. **来源/内容观察：** 下载后绑定实际最终URL、文件名、版本、大小、SHA256；只读检查INF的ARM64节、DriverVer、Provider、CatalogFile、硬件ID以及全部引用文件，检查SYS的PE架构。目录名含ARM64不能替代二进制架构检查；源码仓库声明也不能替代实际包。
2. **CAT签名身份观察：** 主机可只读解析catalog的CMS/证书信息，记录签名者、颁发者、有效期和时间戳；未验证链时只能写“读到身份”，不能写“Windows信任通过”。自行计算hash只能固定字节身份，不认证发布者。
3. **Windows签名政策核验：** 若有官方SignTool，可用`verify /kp /v`核验CAT，并以`/c <catalog>`核验INF/SYS的catalog归属；应按目标系统版本评估，不能只对SYS寻找嵌入签名而漏掉catalog签名。此工具在当前OOBE内是否存在未检查，本任务未安装SDK。[微软SignTool](https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/signtool)、[发行签名验证](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/verifying-the-release-signature)
4. **当前OOBE可行路线（待实测）：** 使用已有“安装驱动程序”按钮指向完整、匹配的ARM64 NetKVM目录，保持系统正常签名检查；这会真实安装驱动，是主任务已获授权的操作，本研究未执行。Windows正常拒绝不可信/不适配包时停止，记录错误，不关闭Secure Boot、不启用test-signing、不导入测试根证书。若以后使用PnPUtil，官方支持明确INF的正常`/add-driver ... /install`，不会强制覆盖更高排名驱动；不应对整张ISO递归安装全部包。[微软PnPUtil](https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/pnputil-command-syntax)
5. **区分证据：** 正常INF安装被系统接受，是该时点安装政策的实际结果；不等同于完整离线证书链审计、WHQL认证、绝对安全或联网成功。上游README对Microsoft attestation与WHQL作了区分，不应将二者混称；具体下载包仍需核验。

## 本研究实际结果与停止边界

- 已完成：官方资料浏览、本机UTM版本及官方下载入口只读核对、ARM64候选/未知项和签名路径整理。
- 未执行：下载/解包/签名验证驱动、修改VM、安装驱动、开启网络、OOBE推进、账号或凭据操作。没有驱动测试通过记录。
- 工具限制：UTM支持页/部分GitHub页面读取返回工具错误；Fedora官方archive显示Anubis Access Denied，未重新请求或绕过。并行研究中QEMU Wiki Networking同样返回访问拒绝；本报告QEMU模型说明来自独立官方手册，不来自被拒页面正文。
- 下一验收：只记录同一VM网卡/驱动/网络的实际结果，到微软账号页停止让用户处理；出现不同条款、签名拒绝、额外安全权限或必要的新共享时准确报告。不要将网络准备转成账号登录或游戏服务器试探。
