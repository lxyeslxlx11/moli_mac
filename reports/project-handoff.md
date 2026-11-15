# moli-mac 换机交接 · 2026-11-15

产品基线是 **stage306**。规格与差异清单沿 **stage307 能力矩阵**继续维护。目标端为桌面网页、移动网页和微信小程序，业务共用 `shared/`，保留 SwiftPM 原生离线包。正在进行的开发目标已暂停，接手后从本文件与现行排程恢复。 [产品基线](../analysis/game-work-context-v1/checkpoint-audit.json) · [能力矩阵](../analysis/capability-first-v1/capability-matrix.json) · [开发流程](development-plan.md#capability-first-workflow)

## 当前成果

| 范围 | 已有工作和证据 | 接手关注 |
| --- | --- | --- |
| 登录器 | 旧版和分发版的配置、目录、候选、登录错误与恢复、更新接管及启动生产侧已有追溯规格。已有网页和小程序基础模块。 | 当前同版游戏的命令与映射消费、真实进程交接和测试账号会话仍待材料。 [登录器分析](launcher-static.md) · [同版缺口](known-issues.md#current-game-handoff-evidence) |
| 游戏 | stage306 已把工艺、维修、采集和直接技能等接到现有入口。基线回执记录 3,779 项 Node 测试、102 项生成工程测试，以及本地 16 段流程、440 条请求。 | 完整业务行为、战斗回场、当前同版和真实设备仍按原需求验收。 [基线回执](../analysis/game-work-context-v1/validation.json) · [状态与通信规格](logic-protocol-spec.md) |
| 资源和宿主 | 持久发布、重开、新旧根身份、范围读及迟到工作已有共用设计。Chrome 取得真实 ZIP 的地图、角色、调色和混播的联合回执。动画单份坐标快照用实际 2,520 个动画验证，每根可少持有 47,946,336 字节。动画缺档与坏索引已核原版路径和现有差异。 | D0/D5 按同一规格开发和验证产品接线、整场工作集、微信持久存储及真机。 [共用设计](architecture-and-milestones.md#resource-reopen-reader-identity) · [动画读取](game-static.md#animation-load-and-first-lookup) · [本轮保留的历史回执](../analysis/capability-first-v1/handoff-20261115/receipt-index.json) |
| 授权与环境 | 原 Windows 环境、诊断方案和已发生的结果有历史记录。 | 尚无测试账号。恢复需要同版材料或实际设备时，核对接手机器及现场条件。 [已知问题](known-issues.md) · [Windows 环境记录](vm-environment.md) |

需求范围为 40 个能力域，保留 81 项协议登记、37 条历史要求、10 个消费者组和 6 个来源。19 个能力域有固定来源的本域规格，21 个仍有必要分析缺口。先补决定实现和验收的缺口，A1–A4 统一准入后按 D0–D6 开发。完整三端、当前同版和官服接受仍待核验。 [需求索引](requirements-index.md#capability-first-inventory) · [六组排程](development-plan.md#capability-first-scheduling)

## 当前接续点

B02/B03 的动作 49 与 221/222 已有固定 SE 的登记和逐对象回调证据。暂停前新增六个本机回放，均经现有战斗命令解码和管理器。两组 SKL73 加 RID0 的新 B 都在第 68 次回调登记，旧 B 当时处于动作 32。之后旧 B 分别在第 152、130 次执行退场，新 B 仍在 stage306 的登记槽。两组 SKL72 对照均先退场再登记。两组 SKL404 则在新 B 登记后把本次伤害施加给新 B，所核回合内旧 B 未执行 49。回调编号仅对应本机原创资源和输入。 [原版条件](game-static.md#battle-slot-publication-order) · [六组回执](../analysis/capability-first-v1/handoff-20261115/battle-slot-checkpoint.json)

恢复分析时，先沿固定 SE 的 SKL73 配对解析、动作 49 入队条件、命中释放和尾随 RID0 确认同一原版输入的正向链。分派及发布的已有证据可直接复用，BF-T36 保留原版实际重叠次序与护卫动作 24、71、217 的消费。训练、工艺和图鉴的第二套窗口仍等待有效外层帧调用。角色类别 7 及邮件最终结果沿 CH-U1、MM-R1 的具名来源补证。 [下一项](development-plan.md#capability-first-next-analysis) · [战斗规格](../analysis/capability-first-v1/game-battle-functional-specification.json) · [窗口候选](game-static.md#item-alternate-dispatch-candidates)

## 在另一台电脑打开

将本次交付的 `moli-mac-20261115.bundle` 带到另一台电脑。在新目录检出即可保留当地已有的工作和上下文。

```sh
git clone --branch main /path/to/moli-mac-20261115.bundle moli-mac-handoff
cd moli-mac-handoff
git log -1 --oneline
git status --short
```

另一台电脑已有该项目 Git 工作树时，可以先取到单独分支，对比源码和文档后再整合。

```sh
git fetch /path/to/moli-mac-20261115.bundle main:refs/heads/handoff-20261115
git diff HEAD handoff-20261115 -- README.md reports shared web wechat
```

仓库保留源码、原创夹具、规格、摘要和 14 份按原摘要核定的近期回执。历史文档里的 `build/`、临时目录和省略的 Windows 截图指向原机工件。安装包、解包素材、原始反汇编、分析缓存、虚拟机、生成工程和工具缓存仍在原机本地。接手机器已有分析样本时按 [原始材料指纹](../analysis/capability-first-v1/handoff-20261115/local-inputs.json) 核对，按该机路径准备 REA 和材料。需要原始复验时，以报告中的工件路径和摘要选择要同步的内容。 [近期回执索引](../analysis/capability-first-v1/handoff-20261115/receipt-index.json) · [分析方法](analysis-methods.md)

## 从干净检出复验

本次使用 Node.js 26.9.0、Python 3.9.6 和 macOS Swift 6.4.2。Node 回归中的部分原创 TCP 夹具会调用 `python3` 和 PyCryptodome 3.23.0。以下为 macOS shell 示例，网页静态服务监听本机回环。

```sh
python3 -m venv build/handoff-python
. build/handoff-python/bin/activate
python3 -m pip install PyCryptodome==3.23.0
node --test --test-concurrency=6 shared/tests/*.test.mjs web/tests/*.test.mjs
node analysis/capability-first-v1/handoff-20261115/battle-slot-checkpoint.mjs
python3 -m unittest discover -s analysis/resources-v2 -p 'test_*.py' -v
python3 scripts/serve_web.py --port 4173
```

网页资源、登录器、游戏入口依次为 `http://127.0.0.1:4173/web/`、`/web/launcher.html` 和 `/web/game.html`。保留的原生包在 macOS 上用 `swift test --package-path native` 验证。 [网页使用](../web/README.md) · [原生包](../native/README.md)

微信构建脚本从项目本地 `build/dependencies/esbuild-0.25.12` 读取构建工具。在接手机器上按其架构恢复。

```sh
npm install --prefix build/dependencies/esbuild-0.25.12 --no-save --no-audit --no-fund esbuild@0.25.12
node tools/build-wechat-app.mjs --outdir build/wechat-app
node tools/build-wechat-game.mjs --outdir build/wechat-game
```

默认微信工程的连接配置为空。需要原机特定配置进行历史回放时，按对应验收记录在本机配置，随后才进行开发者工具导入及设备验收。 [微信工程与配置](../wechat/README.md) · [换机复验记录](validation.md#handoff-20261115-validation)
