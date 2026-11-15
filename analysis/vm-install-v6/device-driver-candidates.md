# v6设备错误与ARM64驱动候选（静态匹配，未安装）

日期：2026-10-25 UTC。只读检查本项目已下载的UTM 0.1.274介质及已有官方研究。未操作UI/VM、运行介质程序、安装驱动、改变工具/安全设置或访问账号、PIN、游戏服务。本轮没有重新联网取包。PIN设置任务已由用户撤销并自行处理，不属于本调查。

## 输入与观察来源

**介质事实：** 已保存`build/drivers/utm-guest-tools-0.1.274.iso`，143,898,624 B；本轮重新SHA256为`ab6add47a4ed992f5920f14e96f68d60566e6f731e2cf816c3d38ab2b78f407a`，与[v4下载记录](../vm-install-v4/driver-media.json)一致。发行来源为UTM官方GitHub的`v10.0.12-utm/utm-guest-tools-0.1.274.iso`；没有单独发布者校验值，因此不称官网hash匹配。ISO内路径、INF原行号及下表hash共同绑定本次结论。

**客户机事实由父任务提供，本分支未独立操作客户机：** 网卡正常，NetKVM版本`100.100.104.27100`；36个Win32_PnPEntity记录的ConfigManagerErrorCode非零，另一个分组输出Name为`CM_PROB_FAILED_INSTALL`。明确具名的三项hardware ID如下，参照[PCI设备记录](device-pci-details.png)、[错误计数](device-error-count.png)与[硬件ID分组](device-id-group.png)。本轮未把分组名称擅自换算成每条记录的数值问题码。

## 三项精确匹配

所有目录均位于本ISO的`Drivers/<类别>/w11/ARM64/`。三个普通候选的SYS实际PE Machine均为`0xaa64`，不是仅凭目录名推断架构。

| 客户机明确硬件ID | 精确INF候选与行号 | 版本与完整本地包 | 结论边界 |
|---|---|---|---|
| `PCI\VEN_1AF4&DEV_1003&SUBSYS_00031AF4&REV_00`（PCI简单通讯控制器） | `vioserial/vioser.inf`第49行；NTARM64节第44行 | `01/13/2025,100.100.104.27100`；`vioser.inf/.cat/.sys` | **事实：**匹配VirtIO Serial Driver。不是网卡；匹配不等于安装/启动通过 |
| `PCI\VEN_1AF4&DEV_1005&SUBSYS_00041AF4&REV_00`（PCI设备） | `viorng/viorng.inf`第53行；NTARM64节第52行 | `01/13/2025,100.100.104.27100`；`viorng.inf/.cat/.sys`及`viorngum.dll` | **事实：**匹配VirtIO RNG Device；安装内容还包括用户态随机数提供程序 |
| `PCI\VEN_1AF4&DEV_1050&SUBSYS_11001AF4&REV_01`（视频控制器） | `viogpudo/viogpudo.inf`第30行；NTARM64节第29行 | `04/18/2025,22.7.38.43`；`viogpudo.inf/.cat/.sys` | **事实：**匹配Red Hat VirtIO GPU DOD controller，属于普通显示候选，不是本轮游戏图形验收 |

**同ID竞争候选：** `viogpu3d/viogpu3d.inf`第44行也匹配1050的完整ID，并提供较宽的`PCI\VEN_1AF4&DEV_1050`匹配；DriverVer为`10/15/2026,100.6.101.58000`，NTARM64节第43行。它与DOD不是同一包。不能对整张ISO或整个Drivers目录递归安装，否则会暴露多个匹配候选；最终Windows排名/选择本轮未测试，不能承诺一定选普通DOD。

## 最低必要性与安全影响

| 类别 | 实际INF内容 | 当前工程判断（推测/建议，未实施） |
|---|---|---|
| vioserial传输驱动 | `vioser.inf:70–78`注册内核驱动`VirtioSerial`、StartType=3，载荷只有`vioser.sys`；包内无SPICE用户态agent/文件共享服务 | 已有桌面和网络说明它不是当前网卡/系统启动的前提。只有需修复该明确PCI设备或验证必要通道时，才考虑单包安装。它可能为客户机/宿主通道提供传输能力，不能因只装驱动就宣称通道无安全影响 |
| SPICE agent与共享功能 | 现有[UTM研究](../vm-install-v4/network-driver-research.md)记录整包会包含共享agent；本次vioser三文件不是整套SPICE工具 | 传输驱动、用户态agent、主机通道与共享开关是不同层。安装vioserial不等于已开启剪贴板/目录共享，也不证明没有可用宿主通道。保持主机共享关闭，不为消除设备错误安装整套Guest Tools、WebDAV、clipboard或其他agent；具体活动通道仍未知 |
| viorng | `viorng.inf:78–85`注册内核驱动；第96–103行复制ARM64 `viorngum.dll`并在Windows Cryptography下注册/加入`QEMU VirtIO RNG Provider` | 是随机数/熵设备候选，不是网络/显示/共享agent。可以针对已配置的1005设备评估，但不能称只复制SYS或纯粹改一个设备名；它影响客户机可用的随机数提供程序。现有证据不证明缺它导致Windows或游戏不能运行，也不证明全部随机数当前不安全 |
| viogpudo普通显示 | `viogpudo.inf:22–23、32–53`只引用该SYS并注册需求启动内核显示服务；第78行给出DOD设备名称 | 如目标是针对当前1050设备修复正常显示驱动，这是比实验3D包更小的候选；当前已有可见桌面，实际效果/需要重启与回退仍待正常安装验证。它不能作为DirectDraw/Direct3D游戏兼容证据 |
| viogpu3d实验图形 | 第64行复制内核与多项用户态图形组件；第70行添加并启动`vgpusrv`服务，第83–89行声明LocalSystem用户态分辨率代理及Auto Start；第112–113行修改图形调度/TDR相关注册表值 | 不是为了清除设备错误可顺带安装的最小候选。包内除ARM64组件，还含x86/x64标记的用户态兼容DLL，不能笼统声称“全部文件ARM64”。本轮不安装、不调整图形硬件/renderer，不把此包当必要系统驱动 |

官方能力背景沿用已核查的[UTM Sharing](https://docs.getutm.app/settings-qemu/sharing/)、[UTM Windows Guest Tools](https://docs.getutm.app/guest-support/windows/)及[官方安装脚本](https://github.com/utmapp/spice-nsis/blob/main/win-guest-tools.nsis)。UTM将Windows DirectX加速标为实验性，要求匹配显示设备/后端，且游戏兼容有限。当前已记录的`virtio-ramfb`没有`-gl`后缀；这里不重复验证配置或据静态包宣称具备加速。以上功能判断以实际INF和已有研究为依据，没有重新访问这些网页。

## 包身份与签名边界

| 相对路径（均在对应`w11/ARM64`内） | SHA256 |
|---|---|
| `vioserial/vioser.inf` | `483413ce82b63d758c5c057727bed47296e5c02ea276bf680aebc6a1ed2031dd` |
| `vioserial/vioser.cat` | `582f0d76dd3665230f7f93bf4e069680086ca36e85cc67ca893519897c02dd8a` |
| `vioserial/vioser.sys` | `b7a4329b3ecacd3532365ee1c5f80a57e48f14e5f3bf111b22ae14178ab896e1` |
| `viorng/viorng.inf` | `5227b59991b17917435f0e9f59a38cb1a9affa4f247334454dbc35578caf86f8` |
| `viorng/viorng.cat` | `855424ff1afe172626a40724b43fde8d599d146ed892d749f6e821ee3fe489e1` |
| `viorng/viorng.sys` | `2a9a17043d41a80c2a2c680bab65d7b6e66f772a66ae889136469e8d1b80045e` |
| `viorng/viorngum.dll` | `117266d5dbd1c014494d7e5d72176d53f2951dda8033c045556e79573d780e73` |
| `viogpudo/viogpudo.inf` | `56d941110dac9675543c4174d65de7164f5f70127812ffecc6c7bf98a0c1b8ec` |
| `viogpudo/viogpudo.cat` | `9bee682e4caec6ab701a8ff4e637d292885e7bec11a3f45f609946daa7d9e988` |
| `viogpudo/viogpudo.sys` | `674113d577141914008bbe2b71bd4bf34de1d0b5d65f18edc2daecc962b4dcd5` |
| `viogpu3d/viogpu3d.inf`（仅用于区分，非安装建议） | `22dca43cb82e02eb1467effa0ea8e3288da0c8a07b99c6e3bd95a79b98f92545` |

Python 3.9.6完成hash和PE Machine读取。LibreSSL 3.3.6的`openssl pkcs7 -inform DER -print_certs -noout`对vioser、viorng、viogpudo、viogpu3d四份CAT均退出0；证书集合中包含`Microsoft Windows Hardware Compatibility Publisher`，颁发者为`Microsoft Windows Third Party Component CA 2014`。**这只是证书身份可解析，不是完整签名、时间戳/撤销、catalog成员或Windows信任链验证。** 不把NetKVM已安装成功外推到另外三个包。

将来若父任务选择单包，应完整保留该目录中的INF/CAT及INF引用载荷，连同原许可材料在本地处理；正常Windows驱动安装机制及签名检查必须保持。只针对明确INF和实际ID，不递归安装所有类别，不关闭Secure Boot、测试签名检查或导入测试证书；安装拒绝、需新许可/额外权限时记录实际原因，不能换包/换入口绕过。本研究没有创建新安装介质或接受新许可。

## 未命名错误设备与负证据范围

父任务的硬件ID分组显示首项`ACPI\VEN_LNR0&DEV_0005`、`ACPI\LNR0005`、`*LNR0005`，但该输出涉及数组分组，尚不能断言36条都是同一个ID或同一种故障。应按单设备实例保留InstanceId、完整hardware ID数组、Present状态、问题码及类名，再决定是否有可用匹配。

本轮对已挂载介质`Drivers/`下**298份INF**逐个解码并大小写不敏感搜索`LNR0005`和`LNR0&DEV_0005`，无命中、无解码跳过。此负证据仅说明该ISO这些INF没有对应明文ID，不证明Windows没有内置支持、没有其他官方包或该设备本来必需；更不能据此修改ACPI、强制指定不匹配驱动或禁用安全检查。Balloon等其他目录存在ARM64包，不因中文名“PCI设备”就追加安装。

## 挂载退出与本轮验收

已有临时目录仅留NetKVM选择包，不包含本次三类完整INF。对已保存ISO使用`hdiutil attach -readonly -nobrowse -mountpoint /tmp/moli-v6-drivers-readonly <项目ISO>`：普通沙箱返回“设备未配置”；随后同一只读挂载经原生审批成功，返回`/dev/disk4`。只读访问INF、证书和PE字节，没有启动ISO根目录的`utm-guest-tools.exe`、`Autounattend.xml`或卸载脚本。

目标`diskutil info -plist /dev/disk4`在沙箱无法访问DiskManagement，因此没有独立取得VolumeReadOnly字段；只读挂载标志与工具成功回执已记录，不伪称额外查询通过。普通沙箱卸载报Operation not permitted，随后同一`hdiutil detach /dev/disk4`经原生审批退出0，返回`disk4 ejected`。已正常卸载，不留挂载等待，也没有改用另一入口绕过拒绝。工具提示hdiutil接口已弃用仅是警告，本次动作实际完成。

**完成：** 原ISO身份复核；三个明确PCI ID静态匹配；相关INF版本/载荷/架构核对；四份CAT证书身份解析；298份INF的LNR限定搜索；正常卸载。卸载后原ISO重算SHA256仍一致，挂载点已无Drivers树；本报告5个本地链接和12个hash引用核对通过。**未执行：** 驱动安装、客户机设备修复/重启、运行时通道或图形测试、完整Windows签名信任验证、游戏兼容测试。只形成候选及范围判断，不能把36个设备错误记为已修复。

## 后续最小介质准备（同日独立增量，仍未安装）

父任务随后要求只准备viorng和非实验viogpudo，以便Windows正常更新/重启后仍有对应缺口时再决定是否安装。已在`/tmp/moli-base-drivers-w11-arm64-0.1.274.iso`生成921,600字节的数据ISO，SHA256为`fc1c1b35f8fc5f9fac36f5119f16de6170044bc6f06a8ff7eabce4f4169bc3c6`，文件权限0444，卷名`MOLI_BASEDRV`。没有复制到项目build或挂入VM。

介质精确包含独立`viorng/`目录4文件、`viogpudo/`目录3文件及原`virtio-win_license.txt`，共8文件；不含vioserial、SPICE、实验3D、安装EXE、autorun、Autounattend或引导映像。使用hdiutil makehybrid的ISO9660/Joliet数据格式，卷描述符没有类型0引导记录。bsdtar对全部8文件逐字节回读，大小/hash一致，三个PE载荷均为ARM64。两份CAT证书身份再次可解析，Windows信任/成员/时间戳/撤销验证仍未完成，没有接受新许可或改变安全限制。

本次重新只读挂载源ISO，经原生审批成功；提取后正常卸载，返回`disk4 ejected`，源ISO重算hash不变。输出ISO通过归档读取回验，没有再挂载。完整成员/hash、INF行号与硬件匹配、CAT边界、生成命令和退出结果见[最小介质记录](base-drivers-media.json)。此为材料准备，不是必要性、安装或设备修复验收；以更新/重启后实际问题码与ID决定下一步。
