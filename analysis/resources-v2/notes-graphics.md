# 第二阶段：配对图形 payload 的离线结构证据

2026-10-25 UTC。已读取工程 `AGENTS.md`。本阶段按用户改为网页、手机、小程序的目标提供跨平台字节解析证据；不再为 Swift 扩充功能。这里只处理本地文件，未运行官方程序、连接游戏服务、取账号会话或规避保护。解包的官方文件仍在 `/tmp/moli-analysis/crossgate/app/bin/`，本目录只保存原创分析脚本、字段/计数/哈希和拒绝病例，不含官方图片、像素副本或源码。

## 结论与当前可实现范围

**事实：**两个图形集合共27,854条索引记录全部位于配对文件范围内，记录首2字节均为 `RD`；payload的 `u32le@4/@8` 与40字节索引中的 `u32le@20/@24` 全部一致。当前可以把这两个字段按候选宽高读取。

**事实：**共有69条未压缩候选记录：4条version0和65条version2。全部通过独立Python oracle的边界、精确长度与索引范围检查，无拒绝病例；输出逐条像素候选SHA256，便于JavaScript `Uint8Array` 实现差分核对。

**可交付的受限能力：**浏览器通过用户显式选择配对索引与payload文件，按记录序号有界读取version0/2，将候选像素值0…255直接作为灰度显示。标为“RD索引值灰度预览”，不标为完整官图还原。不需要网络、平台登录、Windows执行环境或官方资源随包分发。

**待验证：**RGB/BGR、色彩空间、透明索引、图像上下方向、行对齐与实际绘制原点。所有当前样本宽度均为4的倍数，不能据此证明非4对齐宽度的行为。version1/3压缩图形本轮不纳入产品解析器。

## 来源与身份

从同一用户安装包 `CrossGate_Setup.exe` 使用本机 `innoextract 1.9` 精确选择解出：

```text
--include app/bin/Graphic_Joy_22.bin
--include app/bin/GraphicV3_18.bin
```

命令成功退出0，日志为 [extraction.log](extraction.log)，空日志源于 `--silent`。安装包本身未执行；未修改其字节。

| 文件 | bytes | SHA256 |
|---|---:|---|
| Graphic_Joy_22.bin | 47,168,682 | `febe67d2a09c4b06b144442d5939917b682ffc1dbe680f3196b9e32d410a7656` |
| GraphicInfo_Joy_22.bin | 332,320 | `456c0d4321968a1466b5dbf3a22a106c8562cddf4d3aa23a205a9ca430ae2e68` |
| GraphicV3_18.bin | 68,321,498 | `34711ea1e5134e540a0a4479f2e27aebd230f016910473b5dcc215dce2b993e1` |
| GraphicInfoV3_18.bin | 781,840 | `bd80c12e99af0945bef572301ccd3b2d0dbd2adb4e130c801fe85619dc5b83aa` |

| 集合 | 总记录 | v0 | v1 | v2 | v3 |
|---|---:|---:|---:|---:|---:|
| Joy | 8,308 | 0 | 4,732 | 7 | 3,569 |
| V3 | 19,546 | 4 | 16,887 | 58 | 2,597 |

## version0/2：已经交叉核对的结构

共同头：magic@0为 `RD`；version为byte@2；byte@3语义未知；width/height为u32le@4/@8；u32le@12语义未知。在全部69条原始记录中，**@12均不等于记录总长度，不能校验成总长，也不能跟随为指针**。

- version0：头16字节，记录总长度精确等于 `16+width×height`，剩余为候选索引字节。4条均为V3记录380/381/402/403，尺寸4×3或4×4，最大16像素。
- version2：头20字节，`p=u32le@16`；总长度精确等于 `20+width×height+p`。前 `width×height` 个字节为候选像素，尾部p字节为候选调色板。全部65条满足 `p>0`、`p%3==0`、`p<=768`、每个候选像素 `<p/3`。
- **短调色板是有效样本，不能固定p=768。** Joy7条为768；V3为55条768，另759/711/516各1条，分别在记录3882/4193/4194（均4×1）。早期消息中的“全部768”结论已撤回，以这里的全量统计和JSON为准。
- 不要将标识字段视为唯一主键：Joy有457个标识值重复，V3有8个。保留record ordinal、identifier、offset三者，不以Dictionary静默覆盖。

首选真实切片为V3记录4453：offset24,091,510、length49,940、256×192、头20字节；候选像素SHA256为 `b2545a5ec3e2c0feda23c64472fd8e903cb4750f96954a814ba1a8502e15750e`。更大样本V3记录579为640×480；这是本批version2最大尺寸。具体原点、byte3、word12、palette哈希见逐条manifest。

## Python oracle 与验证

[raw_graphic_oracle.py](raw_graphic_oracle.py) 使用Python标准库，自行编写，没有依赖第三方游戏代码。它先检查索引与档案范围及预算，再seek/read单条记录；不把整个大图形档案加载为图像，也不输出像素。默认只报告metadata与哈希；version1/3被跳过，指定这些单条记录时明确记录不支持。

```sh
python3 raw_graphic_oracle.py /tmp/moli-analysis/crossgate/app/bin/GraphicInfoV3_18.bin /tmp/moli-analysis/crossgate/app/bin/GraphicV3_18.bin --record 4453
python3 -m unittest -v test_raw_graphic_oracle.py
```

原创合成夹具的8项测试全部通过：[raw-oracle-tests.log](raw-oracle-tests.log)。覆盖opaque字段、负绘制偏移、短palette、尺寸不一致、越界/截断/错误record序号、不支持压缩版本、palette索引越界、非法palette长度、尾随数据、极端尺寸预算。

实际本地样本检查全部通过：

- [raw-oracle-joy.json](raw-oracle-joy.json)：7条version2，零拒绝。
- [raw-oracle-v3.json](raw-oracle-v3.json)：4条version0＋58条version2，零拒绝。
- [independent-check.md](independent-check.md)：另一个独立分析任务的全表头部、原始格式、短palette与ID重复复核。

尚未在本分支执行浏览器UI、JavaScript差分测试或真实颜色显示；由集成任务记录其实际结果，不将Python通过当作浏览器验收。

## 压缩格式：一次全量实验的边界

[probe_graphics.py](probe_graphics.py) 是从本地短记录和长度约束推导的**实验模型**，不是正式格式规范。尝试高半字节区分literal、repeat、zero-run，低半字节与后续字节组合计数；repeat中先读填充值再读扩展计数。在前400条进行另一种“先读长度再读填充值”的对照，其精确长度成功率显著更低。代码中的0x2扩展literal分支在本批成功记录中没有出现，不能称为已证实。

仅运行了一次全表模型，不为赶进度放松越界规则。结果：[graphics-probe-results.json](graphics-probe-results.json)。

| 集合/压缩版本 | 总数 | 严格精确展开成功 | 因越界拒绝 |
|---|---:|---:|---:|
| Joy v1 | 4,732 | 4,701 | 31 |
| Joy v3 | 3,569 | 3,569 | 0 |
| V3 v1 | 16,887 | 16,884 | 3 |
| V3 v3 | 2,597 | 2,597 | 0 |

合计27,785条压缩记录，27,751条严格展开到候选像素数（v3另含p字节），34条v1因末段超出1字节而拒绝。例如V3记录387/406预期200而最后命令要求199+2；462预期4320而要求4319+2。没有把这些字节截断后当作成功。所有压缩记录的header@12等于索引长度，所有成功v3输出的候选像素均在p/3范围内。

**推测：**少量多1字节可能来自编码器尾填充、尺寸语义或尚未识别的命令规则。没有足够证据决定哪一种正确；本次不修补原文件、不执行官方解码器，也不把RLE模型并入产品。

## 后续建议

浏览器、手机网页和后续小程序适配层共用纯字节解析核心，以69条真实样本manifest作本地差分证据，以原创合成夹具作可分发单元测试。文件选择/seek读取与Canvas显示留在平台适配层。小程序文件权限、文件大小及Canvas API需要单独验证，不能由浏览器通过推断为已支持小程序。

本调查没有环境权限阻断。未完成的颜色/方向/压缩语义与官方联机均是明确缺口；本地灰度查看器只证明有限格式读取能力。
