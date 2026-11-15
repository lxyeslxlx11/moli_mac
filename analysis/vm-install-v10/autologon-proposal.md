# 两台项目 Windows VM 的启动／唤醒免验证方案（尚未执行）

核查日期：2026-10-25。目标仅为 `MoliOffline-ARM64-20261025`、`MoliRestoreTest-ARM64-20261025-v9`；Mac 登录、安全设置不变。v10普通权限查询实测测试克隆为 Windows 11 Home ARM64、10.0.26300；完整修订号26300.9711沿用v8。账号类型沿用首次设置记录，不保存账号标识。用户已表达“两台、启动和唤醒都不再验证”的目标，尚未批准下述具体安全变更。

本方案先查微软官方网页，后由根任务只读查看测试克隆标准登录设置：重新登录已为“从不”、Hello-only为“开”，没有改动；设置页不保存截图以避免账号标识进入证据。原VM对应选项本轮未查看。参见[客户机观察](guest-observations.json)。未下载／运行Autologon、未修改登录安全设置。此前 TPM 查询的 UAC 点击遭自动审批拒绝，父任务已取消；本方案不恢复该动作，也不通过 Autologon 的管理员权限运行 TPM 查询。

## 已知事实和适用边界

| 项目 | 官方依据与结论 | 本机仍待验证 |
| --- | --- | --- |
| 唤醒再次登录 | 设置 → 账户 → 登录选项 → 其他设置，有“离开后，Windows 应何时要求重新登录”控件；策略可能令其不可用。[微软操作说明](https://support.microsoft.com/en-us/accessibility/windows/use-a-screen-reader-to-navigate-sign-in-options-in-windows) | 克隆实际已显示“从不”；未展开选择、更改或睡眠验证。原VM待只读核实。 |
| 启动自动登录 | Windows 自动登录是另一项配置；仅改变唤醒要求不能证明冷启动免验证。[微软自动登录说明](https://learn.microsoft.com/en-us/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon) | 两台分别完成正常关机后启动验证；不保证旧工具适配当前构建。 |
| PIN 和密码 | PIN 与 Microsoft 账户密码不同。移除 PIN 仅移除一种验证方法，不能据此实现自动登录。[PIN 官方说明](https://support.microsoft.com/en-us/windows/security/change-or-reset-your-pin-in-windows) | 用户是否有可用账户密码，由用户本人判断和输入，不向代理提供。 |
| Hello-only | 此开关启用时，设备上的 Microsoft 账户不能用密码登录；设置可用性随设备配置变化。[登录选项](https://support.microsoft.com/en-us/accounts-billing/security/sign-in-options-in-windows) | 克隆此开关为“开”，同时重新登录已为“从不”；两者不能混为一谈。原机开关待核实。 |
| ARM64 工具 | [官方 ARM64 目录](https://live.sysinternals.com/ARM64/)列有 `Autologon64a.exe`，本次列表大小 524,880 字节，时间 2020-04-06；[产品页](https://learn.microsoft.com/en-us/sysinternals/downloads/autologon)标题为 v3.10。 | 未下载文件，故实际 PE 架构、版本、SHA256、Microsoft 签名和 26300.9711 兼容性均未验证。目录名称不代替二进制核验。 |

**凭据存储事实：** Sysinternals Autologon 配置系统使用所填账户密码自动登录；密码以加密的 LSA secret 保存，微软明确警告管理员可以取回并解密。工具不检查所填凭据是否正确或该账户是否有登录资格。[Autologon 官方说明](https://learn.microsoft.com/en-us/sysinternals/downloads/autologon)

**风险推论：** 两台各自保存这份秘密；能启动 VM 的人可能直接进入该账户，会获得该账户在客户机内可访问的数据。能控制客户机管理员权限或相应虚拟磁盘的人存在恢复密码的风险；后续复制磁盘／快照可能把秘密一并复制。LSA 加密不能被描述为“没有保存密码”或“管理员也读不到”。原 v8 冷基线不得覆盖，也不为这次设置额外导出含密码的副本。

**没有证实的替代路线：** 本次未找到适用于现有 Microsoft 账户、完全不保存或复用任何凭据的启动自动登录官方支持方案。“无密码账户”仍通过 Hello、Authenticator、验证码或安全密钥验证，并非无人值守免验证。[微软无密码账户说明](https://support.microsoft.com/en-us/accounts-billing/security/how-to-go-passwordless-with-your-microsoft-account) 如果账号本身无密码，不能把 PIN 填进 Autologon；本方案不新增／重置线上密码、转换本地账户或改变 MFA。

本方案不选 `netplwiz`，也不直接写入 Winlogon 的明文 `DefaultPassword`；微软说明后者把密码留在可被读取的注册表值中。仅采用官方工具的 LSA 存储路径，仍须接受上面的可恢复密码风险。[微软自动登录说明](https://learn.microsoft.com/en-us/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon)

## 待批准后执行的最小步骤

1. **先测试克隆，后原 VM。** 分别核对名称、构建和当前登录选项，记录不含账号标识的原设置值。两台保持断网、主机目录／剪贴板／USB 共享关闭；不改 TPM、Secure Boot、UAC 策略或 Mac。需要进入桌面或验证密码时，由用户本人操作。
2. **唤醒：** 测试克隆当前已为“从不”，保留即可；原VM只读确认后，仅在原值不是“从不”且正常界面允许时改为“从不”。若灰显／缺失，记录并停止这一步，不改注册表、策略或安全功能来强行解锁选项。
3. **准备启动工具：** 获批后才从微软官方下载 ARM64 Autologon，记录来源、实际版本、SHA256，核对 ARM64 PE 和有效 Microsoft 签名。拟通过本项目 `build/utm/media/moli-autologon-arm64-v10.iso` 只读介质交付，内容限定经核验的 `Autologon64a.exe`、随附许可及非敏感SHA256清单，不含账户数据。核验来源为 https://live.sysinternals.com/ARM64/Autologon64a.exe 。先测试克隆，正常关机后只将第四个现有只读CD（Identifier `897A5D83-11BC-44A2-AEE4-F0B510C006DE`，原介质 `moli-base-drivers-w11-arm64-0.1.274.qcow2`）暂换为新只读工具介质；保留原介质及配置，结束后正常关机还原此CD引用。原机仅在克隆验收通过并核对身份后同样处理。系统盘、其他3盘、冷基线不改，不开NAT/主机共享，不读取guest磁盘文件系统；UTM如需内部格式转换，创建新容器并记录hash/字节比较，不覆写旧介质。此为待批准交付方案，介质尚不存在，不能在本轮保持会话要求下直接关机实施。
4. **标准密码入口：** 若当前 Hello-only 开关开启且需要恢复标准密码登录入口，可在下面具体批准包含此项时关闭它，记录原值；保留原 PIN 作为手动锁屏或自动登录失败时的回退。无需为了本目标删除 PIN，也不猜测该开关能修复“从不”控件。
5. **启用 Autologon：** 使用核验后的 ARM64 图形程序，适用 [Sysinternals 许可条款](https://learn.microsoft.com/en-us/sysinternals/license-terms)，经本操作独立的 UAC 批准后运行。若实际显示不同新条款或工具审批拒绝，停止而不换路径。用户本人在客户机窗口核对账户／域并填写**账户密码而非 PIN**，点击 Enable；代理暂停截图和 UI 读取，用户完成并关闭敏感窗口后仅报告成功／失败。密码不进聊天、脚本参数、剪贴板、日志、文档或截屏；不读取 LSA secret 来检查。
6. **分别验收：** 正常关机后启动是否直接进入目标桌面；Windows 睡眠后唤醒是否免验证；若支持 UTM 暂停／恢复，再单独验收。三种路径分别记通过／失败／不支持／未运行。Mac 自身唤醒和手动 `Win+L`、注销不在本次免验证范围内。克隆启动失败时由用户使用常规验证进入并 Disable，原 VM 暂不应用；不反复猜密码或为登录静默联网。

没有账户密码、签名不能核验、控件受策略限制、实际不支持睡眠，或当前构建拒绝自动登录时，交付准确缺口；不把已点 Enable 当作验收通过。微软也记录了某些密码策略会阻止自动登录，本方案不移除这些策略。[微软自动登录说明](https://learn.microsoft.com/en-us/troubleshoot/windows-server/user-profiles-and-logon/turn-on-automatic-logon)

## 恢复方法

在同一已核验 Autologon 图形程序点 **Disable**；需要临时跳过一次自动登录时，微软支持在自动登录发生前按住 Shift，再由用户正常登录。将唤醒要求及 Hello-only 恢复到各自记录的原值，然后分别验证启动和唤醒重新要求验证。工具文档只明确 Disable 关闭自动登录，未承诺所有存储残留和既有副本被安全擦除，不作此保证。[Autologon 官方说明](https://learn.microsoft.com/en-us/sysinternals/downloads/autologon)

不以覆盖 v8 冷基线或还原整个 VM 作为普通回退；那会影响后续客户机状态。账号密码改变后自动登录可能失败，不能自动更新或读取新密码。

## 供父会话一次确认的具体安全变更文本

> 仅在 `MoliRestoreTest-ARM64-20261025-v9` 和 `MoliOffline-ARM64-20261025` 内，先克隆后原机：允许通过正常 Windows 设置把唤醒登录要求改为“从不”；如启动密码登录需要，允许关闭设备上的 Hello-only 开关，保留 PIN 回退。允许下载并核验微软 ARM64 Autologon，按本方案通过项目build内的指定只读ISO临时替换两VM第四个CD并在结束后还原，接受所链接且与实际一致的 [Sysinternals 条款](https://learn.microsoft.com/en-us/sysinternals/license-terms)，并批准仅运行此工具所需的管理员提示。理解它会在每台 VM 中加密保存可被管理员恢复的账户密码，允许访问 VM 的人可能直接进入账户；密码由我本人在客户机工具界面输入并启用，代理不查看或接收。允许随后正常重启及可用的睡眠／恢复验收，失败时按本方案关闭自动登录并恢复原设置。Mac、网络／共享、TPM／安全启动和账号线上安全设置不变。

这段是**待用户确认的提案，不是已获授权记录**。具体只读介质交付目标已在第3步列出，仍未创建/挂载；没有用户所需的密码时，不能承诺完成启动自动登录。许可或工具审批仍须以实际结果为准；本次 TPM 的被拒动作保持取消。

## 当前完成状态

- 已完成：官方文档与 ARM64 发布目录核查、区分两类行为、凭据风险／恢复路径／验收边界和具体提案。
- 未运行：二进制下载和签名／架构核验、任何设置变更、密码验证、工具许可接受、启动／唤醒验收。
- 尚需：用户批准具体安全变更；用户亲自在需要时输入账户密码；原VM实际UI、工具签名/架构和构建兼容性验证。
