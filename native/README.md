# Moli 原生离线基础（保留的第一阶段成果）

项目目标已改为网页、移动网页与小程序。此目录保留源码、CLI和16项测试，停止新增Swift/AppKit专用功能。新资源实现见[共享核心](../shared/README.md)，本目录不宣称与其功能等价。

SwiftPM + SwiftUI + AppKit，macOS 13 或更新版本，无第三方依赖。当前本机产物是 arm64 Mach-O；不包含 Wine、CrossOver 或任何官方资源。此版本不能登录或游玩官方服务器。

## 构建与运行

在本目录运行：

```sh
swift build
swift test
swift run MoliOffline
```

`MoliOffline` 是默认 GUI 产品；`moli-inspect` 是只读 CLI；`MoliCore` 是解析与离线状态库。纯 SwiftPM 不自动生成 `.app`。如需可双击的开发应用：

```sh
sh scripts/make-dev-app.sh
open .build/MoliOffline.app
```

开发包未公证，脚本不安装、不签名、不发布。它仅将本工程编译的程序复制进本目录的 `.build/`。

本次受限执行环境使用的构建命令：

```sh
CLANG_MODULE_CACHE_PATH=/tmp/moli-native-clang-cache \
SWIFTPM_MODULECACHE_OVERRIDE=/tmp/moli-native-swift-cache \
swift test --disable-sandbox
```

此参数只用于本工程 SwiftPM 构建过程，不修改 REA 或系统安全设置。普通本地开发优先用上面的默认命令。原始日志含 SwiftPM 用户缓存不可写警告，但本次构建与测试成功。

## 当前可验收行为

- 原创等距网格与标记，方向键/WASD 或屏幕按钮移动；蓝色格子和地图边界阻挡移动，可重置。键盘焦点丢失时单击地图恢复。
- 原生文件选择器仅读取用户明确选择的本地文件。默认不扫描安装目录，不读取账号、注册表或凭据，不执行 PE。
- PE 头识别器读取精确范围，显示机器类型、PE32/PE32+、节表和入口 RVA。可选 SHA256 以 1 MiB 块读取，按初始文件长度限定读量；不将 1 GB 安装包整体载入内存。
- 图形索引检查器按已观察的 40 字节候选布局读取 +0 ID、+4 offset、+8 byteLength（均 LE UInt32）。剩余 28 字节不解释，不解码图像。连续、零长度、相邻重叠为观察值，不擅自判定为错误。
- 全部产品没有网络传输、登录、更新下载、认证或会话协议实现。结构检查不代表文件安全、来源可信或官方兼容。

## CLI

```sh
swift run moli-inspect /absolute/path/POLCN_Setup.exe
swift run moli-inspect --sha256 /absolute/path/POLCN_Setup.exe /absolute/path/CrossGate_Setup.exe
swift run moli-inspect --graphic-index /absolute/path/GraphicInfoV3_18.bin
swift run moli-inspect --graphic-index /absolute/path/GraphicInfoV3_18.bin --paired-bytes 68321498
```

`--paired-bytes` 是调用者提供的数据文件实际长度。只有提供后才检查每条 `offset + length` 是否越过该长度；最后一个示例仅示范接口，不能代替对配对数据文件的测量。GUI 当前未提供配对数据选择，并明确提示范围未核对。

退出码：0 成功，1 解析或读取失败，2 未提供参数。输出为 JSON。路径必须显式提供；没有联网查询或文件默认路径。

## 模块接口与限制

| 模块 | 入口 | 行为与限制 |
|---|---|---|
| `PEInspector` | `inspect(url:hash:)` / `inspect(data:)` | MZ、PE 签名、COFF、最小可选头、节表及节文件范围；e_lfanew 上限 1 MiB、最多 96 节、可选头最多 4096 B。不是完整 PE 合法性验证器，也不验证 Authenticode。未知 machine 保留数值。 |
| `GraphicIndex40` | `inspect(url:pairedByteCount:)` / `inspect(data:pairedByteCount:)` | 非空、40 字节整记录、64 MiB 上限；UInt64 计算结束偏移，防 UInt32 回绕；配对长度越界报错。没有格式 magic，因此通过检查不证明是官方索引。 |
| `OfflineWorld` | `move(_:)`, `reset()`, `isBlocked(_:)` | 12×12 原创场景，四向离散移动、固定障碍；不代表官方地图碰撞、寻路或规则。 |
| `LocalBinaryFile` | 内部 | O_NONBLOCK 只读打开后 fstat 要求普通文件；拒绝 FIFO、目录、设备。读取范围先校验文件长度。 |

解析器不提供原子文件快照：检查过程中同长度原位修改无法完全检测。应对稳定副本分析。SHA256 检测读途中截断及最终长度变化；它不是数字签名或来源认证。

## 本次验证证据

见 `evidence/swift-test.log`、`evidence/swift-build.log`、`evidence/installer-identities.json`、`evidence/graphic-index-v3.json`、`evidence/graphic-index-joy.json`。证据只含结构、摘要和测试结果，不含官方二进制或资源字节。

16 项测试全部通过，覆盖 PE32/PE32+、坏签名、多个截断点、头偏移预算、可选头、节表/节范围、未知机器、非零 Data 切片索引、5 GiB 稀疏文件有限读取、FIFO 非阻塞拒绝、流式 hash、索引记录截断/宽整数范围/连续与重叠提示、地图阻挡及重置。样本 SHA256 与独立系统摘要一致。

根任务已在真实 AppKit 窗口验证：Right、A 键、屏幕方向按钮、重置、原生文件选择器读取 POLCN 安装包，以及文件选择返回后的键盘移动。初始位置 5,5，Right 后 6,5，A 后 5,5，↑ 后 5,4，重置恢复 5,5。该实际窗口的 AX 及视觉验收记录见工程 `reports/validation.md`；核心单元测试与窗口交互验证分别记录。

## 后续维护

保留原行为与回归测试，不扩展Mac专用功能。逻辑和通信协议先形成可追溯规格，再进入共享跨平台核心；参见[架构与验收路线](../reports/architecture-and-milestones.md)。官方联网仍未授权或验证。
