<a id="wechat-sdk-host-probe-preparation"></a>

## 原创SDK核验工程已准备，尚未运行（2026-11-10）

[独立游客工程](../build/analysis/wechat-host-conformance-v1/probe-project/project.config.json)包含9原创文件，计划文件/Canvas/前台帧/Page导航与本机TCP核验；[静态准备检查](../build/analysis/wechat-host-conformance-v1/preparation-validation-v2.json)通过。它不重建或替换stage306产品。

本机官方工具2.02.2609250/技能0.3.11就绪，但首次Codex授权会开启服务端口，设置确认待回复；SDK基础库/文件/Canvas/网络的实际结果尚无。本轮无导入/编译/模拟器运行、手机、上传/预览或官方游戏接受。[当前档案](../analysis/capability-first-v1/wechat-host-profile.json)

同配置的两次本地生成已匹配 stage306 的 27 个文件。默认配置改变游戏分包配置及构建身份。现有 `build-report.json` 的输出清单用于后续身份生成和验收。 [生成核验](../reports/validation.md#reconstructed-build-identity-validation)

<a id="wechat-resource-quota-probe"></a>

## 微信游客模拟器的完整资源导入与普通存储

本机以普通编译运行独立游客探针。开发者工具 2.02.2609250 和基础库 3.18.0 已核完整素材分两段读取。按 8 MiB 写用户目录时，实际素材和新 App 的合成对照均在第 13 块遇到配额拒绝，候选清单未发布。试件已移除，原探针 11 个文件已校验并恢复。正式产品的资源发布、完整重开和 iOS／Android 设备继续沿 D5 验收。 [当前宿主结果](../reports/architecture-and-milestones.md#wechat-sdk-archive-ordinary-quota) · [原始回执](../reports/validation.md#wechat-sdk-archive-ordinary-quota-validation)

同一游客探针已核新 App 读回 2.55 GB 素材。两段仍可读时直接重开，移开临时第 2 段后可以只补选该段。完整持久化和真机继续按原用例。 [当前重开核验](../reports/validation.md#wechat-sdk-segment-resume-validation)

同一 DevTools 进程的两次 App 启动已验证双槽、历史读回和迟到启动确认。另在工具正常退出并重开后核对原创小 ZIP、双槽、历史和新启动回执。三份临时探针文件已恢复，原工程 11 个文件核对通过。正式产品发布、异常退出、完整素材持久化及真机沿 UH-U02/U03 验收。 [两次 App 回执](../reports/validation.md#wechat-publication-history-validation) · [工具进程重开及清理](../reports/validation.md#wechat-devtools-process-reopen-validation)

<a id="stage306-work-context"></a>

## stage306 Page 上下文控制及直接技能状态

Page的生产技能面板增加精灵变身开关、剩余时间、配方返回等级及直接技能等待状态；context／levels-back继续由实际onCraft→host→共享client处理，无平台特有技能逻辑或新计时器。[接口](../reports/module-interfaces.md#stage306-work-context)

`node tools/build-wechat-app.mjs --game-config build/analysis/game-wechat-page-v1/game-config.json --outdir build/wechat-app-stage306-page-final`生成257输入／27输出，无外部导入；主包783,633／游戏包1,215,247字节。源码和生成Page各完成新34请求，并各保留制造13、物品工作26、目标／采集37请求，均用实际1,072文件ZIP。[验收](../reports/validation.md#stage306-work-context)

Page本地端口验收、DevTools、实际微信及真实手机分别记账；本轮只记录本地Page验收，设备／官方接受仍待完成。

生成包启动对照复用 `tools/build-wechat-app.mjs`，使用原配置、默认配置和另一份有效的原创配置核分包加载。运行 `node build/analysis/portable-boot-entry-identity-v1/probe-wechat.mjs` 可复查三份留存产物的六个入口用例。当前结果为生成模块在本地端口执行，实际小程序代码更新及分包调度沿 UH-U03 验收。 [运行证据与规格](../reports/validation.md#portable-boot-entry-identity-validation)

<a id="stage305-work-targets"></a>

## stage305 Page 目标技能与连续采集

Page 的生产技能面板增加角色／角色或宠物选择、返回一级、急救／治疗结果、采集暂停和继续。person／subject dataset 经实际 onCraft→host→共享 client；KxC／L<% 与 Lor kind3／4 进入同一所有者。普通帧推进循环，结果重启门禁与网页一致。[接口](../reports/module-interfaces.md#stage305-work-targets)

`node tools/build-wechat-app.mjs --game-config build/analysis/game-wechat-page-v1/game-config.json --outdir build/wechat-app-stage305-page-final` 生成 256 输入／27 输出，无外部导入；主包 783,258／游戏包 1,210,963 字节。源码和生成 Page 各完成新目标／采集 37 请求，并各复测制造 13 与物品工作 26 请求，均用实际 1,072 文件 ZIP。[验收](../reports/validation.md#stage305-work-targets)

本轮未导入 DevTools 或验收实际微信／真实手机；非零上下文、其他分支和完整项目继续未完成。

<a id="stage304-work-actions"></a>

## stage304 Page 工作模式、刻印与生成结果

Page 的生产技能面板复用网页同一控制模型和共享核心，增加修理／鉴定目标、刻印确认／清空、装饰材料分类。onCraftMark 经现有编码器、host 与实际 client 完成；计时继续由普通 Canvas 接受帧推进，隐藏／退出沿原所有者释放。[接口](../reports/module-interfaces.md#stage304-work-actions)

`node tools/build-wechat-app.mjs --game-config build/analysis/game-wechat-page-v1/game-config.json --outdir build/wechat-app-stage304-page-final` 生成 255 输入／27 输出，无外部导入；主包 782,883／游戏包 1,199,462 字节，包含更新的 craft.wxml。源码和生成 Page 各用实际 1,072 文件 ZIP 完成新工作 26 请求，并保留复测普通制造 13 请求。[验收](../reports/validation.md#stage304-work-actions)

本轮没有导入 DevTools 或验收实际微信／真实手机；Lor kind3／4、非零上下文及完整游戏保持未完成。

<a id="stage303-craft-input"></a>

## stage303 Page 制造与生成输出

游戏 Page 新增 onCraft 和 craft.wxml，复用共享状态及与网页相同的制造控制模型。六位材料、魔力检查、计时、等待结果、重试和关闭已接入真实 handler／host／session；活动状态随普通呈现更新。隐藏／退出仍沿既有客户端释放所有者。[接口](../reports/module-interfaces.md#stage303-craft-input)

`node tools/build-wechat-app.mjs --game-config build/analysis/game-wechat-page-v1/game-config.json --outdir build/wechat-app-stage303-page-final` 生成 254 输入／27 输出，无外部导入，包含 craft.wxml；主包 782,507／游戏包 1,190,925 字节。源码和生成 Page 各用实际 1,072 文件 ZIP 完成成功／失败／魔力不足／取消，服务各核对 13 请求。[验收](../reports/validation.md#stage303-craft-input)

本轮未导入 DevTools 或验收真实微信／手机；其他工艺和完整游戏目标保持未完成。

<a id="stage302-craft-recipes"></a>

## stage302 配方核心已编入 API 和 Page

新输出为 build/wechat-game-stage302-api-final（193 输入、450 导出）与 build/wechat-app-stage302-page-final（251 输入／26 输出）；Page沿用明确本机 game-config，外部导入 0。新增配方 API 的五项和既有道具 63 项生成检查通过。[验证](../reports/validation.md#stage302-craft-recipes)

生成客户端在同包原生形状 wx 回调上完成正常入场后的自动工艺查询、配方回复、删除和重查，属于 Node 受控端口验证。制造 Page 界面未接入，本轮不标 DevTools、微信文件／Canvas／音频、手机或真实网络接受。[范围](../analysis/game-craft-recipes-v1/goal-audit.json)

<a id="stage301-battle-item-dispatch"></a>

## stage301 既有生成 API 道具回归

保留 stage300 API／Page 输出，本轮不新增构建或 Page 改动。对既有 API 包的 447 个导出、192 个输入和 SHA 完整复核，五个道具相关测试文件共 63 项通过；源码同样 63 项通过。[机器记录](../analysis/game-battle-item-variants-v1/validation.json)

ITM 未识别编号仅有原生当前回调返回的证据，本轮不编造 1–5 效果。没有在本轮重跑 Page／DevTools／设备流程；已有 Page 结果与真实微信接受继续分开记录。[验收](../reports/validation.md#stage301-battle-item-dispatch)

<a id="stage300-city-water"></a>

## stage300 源码与生成Page的五条回城路径

本轮API为build/wechat-game-stage300-api-final（192输入），Page为build/wechat-app-stage300-page-final（250输入／26输出），外部导入0。Page沿用明确本机测试配置build/analysis/game-wechat-page-v1/game-config.json；源码检查也必须指向本轮Page目录。[接口](../reports/module-interfaces.md#stage300-city-water)

源码／生成Page各完成五条实际素材回城路径，共10条，同一连接恢复四次移动。生成API八项新检查与源码／Python参考一致；等待服务器阶段共享Canvas继续调度。Node形状端口与本机原创新对端不代替真实DevTools、微信文件／Canvas／音频、手机或性能验收。[结果](../reports/validation.md#stage300-city-water)

<a id="stage299-battle-water"></a>

## stage299 战斗水面进入源码与生成Page

API构建为build/wechat-game-stage299-api-final（192输入），Page为build/wechat-app-stage299-page-final（250输入／26输出），外部导入0。Page仍使用明确本机测试配置build/analysis/game-wechat-page-v1/game-config.json；没有改变启动资料门槛。[接口](../reports/module-interfaces.md#stage299-battle-water)

生成API的十项新测试与Python参考一致；源码／生成Page在原创地图40000／59000及实际特殊背景5000完成4条战斗／退出／移动流程，资源1072文件、人物100010和图形均未改。Page验证使用Node形状端口，真实DevTools、wx文件／Canvas／音频、手机和性能未验；完整目标保持active。[验收](../reports/validation.md#stage299-battle-water)

<a id="stage298-ordinary-water"></a>

## stage298 水面核心进入源码和生成Page

本轮API为build/wechat-game-stage298-api-final（191输入），Page为build/wechat-app-stage298-page-final（249输入／26输出），外部导入0。Page使用既有明确本机测试配置；默认null配置按设计拒绝启动资料，本轮保留该初检回执，未改变资料校验。

两个水面地图在源码／生成Page共4条Node形状wx端口流程完成实际素材入场、战斗、退出与移动；8项生成API测试、3,304完整帧及64实际帧与源码相同。真实DevTools、wx文件／Canvas／音频、手机及性能仍待验收。[记录](../reports/validation.md#stage298-ordinary-water)

<a id="stage297-body-draw-flags"></a>

## stage297 身体绘图开关进入共享包

本轮API为 `build/wechat-game-stage297-api-final`（190输入），Page为 `build/wechat-app-stage297-page-final`（248输入），外部导入0。消费者164／165由相同共享回调处理，源码／生成API的三项新测试及160完整帧一致。

两组实际CUT在源码／生成Page共4条回归中完成既有正常战斗、结果、退出及移动；这不确认164／165的正常协议生产者。真实微信、文件／Canvas／音频和手机仍待验收，Node vm计时边界保留。[记录](../reports/validation.md#stage297-body-draw-flags)

<a id="stage296-actual-battle-product"></a>

## stage296 实际材料进入源码与生成Page

新构建为 `build/wechat-app-stage296-page-final`（248输入）和 `build/wechat-game-stage296-api-final`（190输入），产物身份与stage295相同，外部导入0。两组CUT在源码／生成Page共4条本机流程中完成实际素材入场、防御、SKL106结果、退出和移动，单连接保持。

源码与生成Page的回合／数值结果一致。生成Page的Node vm耗时较长，受控相同产物绘制已分开诊断；该环境不是实际微信性能测量。真实DevTools、wx文件／Canvas／音频及物理手机继续验收。[记录与命令](../reports/validation.md#stage296-actual-battle-product)

<a id="stage295-battle-draw-style"></a>

## stage295 战斗最终样式进入Page

本机构建为 `build/wechat-app-stage295-page-final`（248输入）及 `build/wechat-game-stage295-api-final`（190输入），外部导入0，完整输入／产物摘要复核。对象颜色覆盖与动画加色由共享核心处理，Page没有新增平台事件或会话字段。

普通透明／加色两场景的源码／生成Page共4条本机流程，均完成SKL106、回合、HP／MP、退出和移动；源码／生成API的原创及672实际材料整帧另通过比较。实际DevTools、wx文件／Canvas／音频和物理手机仍未验收。[结果与命令](../reports/validation.md#stage295-battle-draw-style)

<a id="stage294-vertex-color"></a>

## stage294 Page共享ARGB与部分调色板

当前本机构建 `build/wechat-app-stage294-page-final`（247输入）及 `build/wechat-game-stage294-api-final`（189输入），外部导入0，所有输入／产物摘要核对。普通ARGB及有效颜色前缀由共享核心处理，无新平台配置或事件。

Node源码／生成Page各完成两种真实动画材料场景、小地图、移动／重建和各7请求／2移动，共4条流程。API源码／生成完整参考相同；DevTools、真实wx文件／Canvas／音频及物理手机仍未验收。[结果与命令](../reports/validation.md#stage294-vertex-color)

<a id="stage293-additive-render"></a>

## stage293 共享加色进入Page

当前本机构建为 `build/wechat-app-stage293-page-final`（247输入）与 `build/wechat-game-stage293-api-final`（189输入），外部导入0，输入和输出摘要复核通过。Page沿已有共享资源／Canvas路径取得加色，平台事件和配置未增加。

源码／生成Page各通过实际113685／947、三档小地图、触摸移动、场景重建和7请求／2移动回执。实际wx文件／Canvas／音频与手机设备仍未验收。[复现及结果](../reports/validation.md#stage293-additive-render)

<a id="stage292-animation-named-palette"></a>

## stage292 命名调色板进入源码和生成Page

最新本机构建为 `build/wechat-app-stage292-page-final`（247输入）及 `build/wechat-game-stage292-api-final`（189输入），外部导入0、输入与输出摘要已核对。共享范围库消费命名BGR调色板，Page事件／平台专用代码未增加。

源码和生成Page分别通过实际59529／113058／320动画、显隐／三范围、触摸移动和场景重建，独立对端均确认7请求／2移动。Node结果继续与原生wx、物理手机、存储、Canvas和音频验收分开。[完整验证](../reports/validation.md#stage292-animation-named-palette)

<a id="stage291-legacy-minimap"></a>

## stage291 Page小地图与最新本机构建

Page新增小地图显隐、范围按钮及读取／不可用状态，底层与网页共用纯字节核心和异步所有者。本轮重建 `build/wechat-app-stage291-page-final`（246输入）及 `build/wechat-game-stage291-api-final`（188输入），外部导入0，产物和输入摘要全部复核。

源码与生成Page在Node下分别完成两种地图模式的实际1072文件ZIP流程，每条都有三档小地图、显隐、触摸移动、场景重建和7请求／2移动回执。真实wx文件、存储、原生Canvas／音频及设备内存验收仍保留；动画调色板320负例不算完整素材通过。[复现和验证](../reports/validation.md#stage291-legacy-minimap)

<a id="stage290-legacy-material-compat"></a>

## stage290 Page使用实际素材的本机流程

沿用 `build/wechat-app-stage289-page-final` 及对应API，没有改变构建输入或重新构建；244／186输入和全部输出哈希已复核。源码和生成Page分别在Node形状wx端口下选择实际1,072文件ZIP，完成外观、进入、触摸移动和场景重建，独立对端均确认7请求／2移动。[验证与复现](../reports/validation.md#stage290-legacy-material-compat)

资源索引初读143,457字节，连接后实际图形／动画元数据读取约75MB；这是按现有消费者读取所需元数据，不代表整包装入内存。场景为原创模式0，缺CUT23的模式1仍待材料补齐。真实微信文件、存储、音频和设备验收继续保留。[已知问题](../reports/known-issues.md#stage290-legacy-material-compat)

<a id="stage289-legacy-resource-archive"></a>

## stage289 Page独立资源ZIP读取与当前构建

最新Page为 `build/wechat-app-stage289-page-final`，对应API为 `build/wechat-game-stage289-api-final`。游戏资源ZIP选择保留在原生文件系统，Page按需读取受限范围，不再复用更新器的整包64条目配置；启动JSON继续使用原小文件读取器。[接口](../reports/module-interfaces.md#stage289-legacy-resource-archive)

```sh
node tools/build-wechat-game.mjs --outdir build/wechat-game-stage289-api-final
node tools/build-wechat-app.mjs --game-config build/analysis/game-wechat-page-v1/game-config.json --outdir build/wechat-app-stage289-page-final
```

API186／Page244个输入和全部产物已核对，外部导入0。源码／生成Page在Node的wx形状端口下各完成存储有声、Deflate有声及存储静音共6条流程，使用约2.55GB原创包和实际本机范围读取。没有微信开发者工具或真机的选择器／容量／临时文件寿命验收，不能据Node结果推定平台大文件可用。[完整验证](../reports/validation.md#stage289-legacy-resource-archive)

<a id="stage288-legacy-battle-audio"></a>

## stage288 Page战斗音效与当前构建

生成目录为 `build/wechat-app-stage288-page-final`，对应API为 `build/wechat-game-stage288-api-final`。Page与网页共用音效选择器和PCM输出，通过现有 `wx.createWebAudioContext` 端口接入。源码与生成Page在Node形状端口下分别完成有声／静音、结算和移动流程；实际微信及设备仍未验收。[结果](../reports/validation.md#stage288-legacy-battle-audio)

本轮资源夹具含21个所需原创音效WAV。整套游戏ZIP目前仍继承64条目的旧导入配置，完整资源包导入是后续工作。[缺口](../reports/known-issues.md#stage288-legacy-battle-audio)

<a id="stage287-legacy-battle-detached-rid"></a>

## stage287 Page106 RID消费

自然结束与原等待恢复两种106 RID，均经Page源码／生成版完成本机TCP回合、退出及移动，共4条流程。等待流程保留实际回合1与保活验证。[接口](../reports/module-interfaces.md#stage287-legacy-battle-detached-rid)

`build/wechat-app-stage287-page-final`有240个输入，相对stage286仅一个共享回调变化，零外部导入。当前为Node中模拟微信原生API的主机证据，真实微信与物理手机继续验收。[验收](../reports/validation.md#stage287-legacy-battle-detached-rid)

<a id="stage286-legacy-battle-impact-skills"></a>

## stage286 Page五类冲击技能消费

五类各经Page源码／生成版完成本机TCP入场、回合1、退出及继续移动，共10条流程。角色数值与网页一致，使用同一共享规划与身体所有者。[接口](../reports/module-interfaces.md#stage286-legacy-battle-impact-skills)

`build/wechat-app-stage286-page-final`有240个输入，相对stage285有230个输入相同，零外部导入。当前为Node Page主机证据，真实微信与物理手机继续验收。[验收](../reports/validation.md#stage286-legacy-battle-impact-skills)

<a id="stage285-legacy-battle-upper-skills"></a>

## stage285 Page上位六类消费

六种技能各经Page源码／生成版完成实际本机TCP流程，共12条；等待真实回合1，核对数值、退出及后续触摸移动。与网页共用同一状态和身体所有者。[接口](../reports/module-interfaces.md#stage285-legacy-battle-upper-skills)

`build/wechat-app-stage285-page-final` 有238个输入，229个相对stage284相同，零外部导入。Node Page主机与真实微信／物理手机验收分别记录。[验收](../reports/validation.md#stage285-legacy-battle-upper-skills)

<a id="stage284-legacy-battle-skill99"></a>

## stage284 Page六类状态结果

三种状态图标场景各经Page源码／生成版运行，共六条本机TCP流程。等待真实回合1后验证退出与触摸移动，保持HP70、MP5。[接口](../reports/module-interfaces.md#stage284-legacy-battle-skill99)

`build/wechat-app-stage284-page-final` 有236个输入、零外部导入，231个相对stage283相同。Node Page主机证据与真实微信／手机验收分别记录。[验收](../reports/validation.md#stage284-legacy-battle-skill99)

<a id="stage283-legacy-battle-self-flags"></a>

## stage283 Page自身完整结果字

三种结果字场景各经Page源码／生成版运行，共六条本地TCP流程。保持原回调、费用、等待与回合1，再核对退出及触摸移动。[接口](../reports/module-interfaces.md#stage283-legacy-battle-self-flags)

`build/wechat-app-stage283-page-final` 有236个输入、零外部导入，235个相对stage282不变。证据来自Node Page主机与本机TCP；真实微信／手机与完整玩法另行验收。[验收](../reports/validation.md#stage283-legacy-battle-self-flags)

<a id="stage282-legacy-battle-self-guard"></a>

## stage282 Page自身护卫与原等待恢复

三种自身护卫场景各经Page源码／生成版运行，共六条本地TCP流程。HP不变时仍等待回合1，保留费用、真实等待和心跳，再核对退出及触摸移动。[接口](../reports/module-interfaces.md#stage282-legacy-battle-self-guard)

`build/wechat-app-stage282-page-final` 有236个输入、零外部导入，235个相对stage281不变。本轮是Node Page主机与回环TCP证据，真实微信／手机和完整玩法仍待验收。[验收](../reports/validation.md#stage282-legacy-battle-self-guard)

<a id="stage281-legacy-battle-self-metadata"></a>

## stage281 Page自身元数据

消息反射、RID反射及状态清除分别经Page源码／生成版运行，共六条本地TCP流程。两版均确认HP58、MP5、回合1、退出和触摸移动；状态清除从C状态输入开始并保留真实等待和心跳。[接口](../reports/module-interfaces.md#stage281-legacy-battle-self-metadata)

`build/wechat-app-stage281-page-final` 有236个输入、零外部导入，235个相对stage280不变。证据来自Node Page主机与回环TCP，真实微信／手机和完整玩法仍待验收。[验收](../reports/validation.md#stage281-legacy-battle-self-metadata)

<a id="stage280-legacy-battle-reentry"></a>

## stage280 Page 连续两场战斗

三种首场分别经Page源码／生成版运行，共六条本地 TCP 流程。第二场在同一连接中使用不同角色和数值，核对回合0→1、新绘制帧、伤害／扣费、再次退出与触摸移动；两次退出均由独立测试端确认。[接口](../reports/module-interfaces.md#stage280-legacy-battle-reentry)

`build/wechat-app-stage280-page-final` 有236个输入、零外部导入，与stage279所有输入逐一相同。本轮是Node Page主机与回环TCP证据，真实微信／手机及完整玩法仍待验收。[验收](../reports/validation.md#stage280-legacy-battle-reentry)

<a id="stage279-legacy-battle-self-control"></a>

## stage279 Page 自身控制与真实退出请求

普通自身蓄力、蓄力后反射和主控散开经 Page 源码／生成版运行，共六条本地 TCP 流程。散开退出在测试端发送结束指令之前已观察到，保持回合0与MP7；另外两类以回合1和MP5完成。回场后触摸移动已验证。[接口](../reports/module-interfaces.md#stage279-legacy-battle-self-control)

`build/wechat-app-stage279-page-final` 有236个输入、零外部导入，235个输入相对stage278不变。本轮证据来自 Node Page 主机及本地TCP；组件下一场复用已有单独证据，产品第二场、真实微信／手机与官方会话仍待验收。[验收](../reports/validation.md#stage279-legacy-battle-self-control)

<a id="stage278-legacy-battle-self-special"></a>

## stage278 Page 验证自身反射与治疗

三种新增场景经 Page 源码及生成版运行，共六条本地 TCP 流程，核对真实回合 1、费用、结果、退出及恢复移动。反射自然结束时退出回执仍包含心跳数 0，测试显式观察该字段；治疗及多位优先结果保留真实等待时钟。[接口](../reports/module-interfaces.md#stage278-legacy-battle-self-special)

`build/wechat-app-stage278-page-final` 有 236 个输入、零外部导入，相对 stage277 仅共享规划器改变。本轮证据来自 Node Page 主机和本地 TCP，真实微信、手机及官方会话继续待验。[验收](../reports/validation.md#stage278-legacy-battle-self-special)

<a id="stage277-legacy-battle-self-family"></a>

## stage277 普通自身家族进入 Page

三种新增自身场景分别经 Page 源码与生成版运行，共六条实际本地 TCP 流程；核对绘制后的真实回合计数 1、费用、退出和恢复移动。类别 6 先扣他人 MP，再按目标别名清除后的类别扣自身 HP。共享预检已选择对应 HP 数字资源。[接口](../reports/module-interfaces.md#stage277-legacy-battle-self-family)

构建 `build/wechat-app-stage277-page-final` 有 236 个输入、零外部导入；仅两个共享运行文件相对 stage276 改变。测试主机筛选应使用 `wechat`；六次错误筛选的空场景结果未计入验收。当前证据来自 Node Page 主机及本地 TCP，真实微信、手机和官方会话待验。[验收](../reports/validation.md#stage277-legacy-battle-self-family)

# 微信宿主工程

<a id="stage276-legacy-battle-self-pair"></a>

## stage276 Page 显式核对自身结果的回合完成

Page显示适配器从共享Canvas透传真实回合计数，源码及生成宿主通过纯自身、先他后自两种物理记录。新流程在结束战斗前同时等待血量／费用和回合计数1，并记录 completedRound1，然后核对退出及地图移动。每条13个请求含4个心跳，API／Page构建通过；Node宿主和本地TCP证据单列，微信运行时与真机继续验收。[验收](../reports/validation.md#stage276-legacy-battle-self-pair)

<a id="stage275-legacy-battle-weather-targets"></a>

## stage275 Page 消费重复天气目标

Page 源码和生成宿主均通过先普通后效果、双效果两种 SKL401 记录及回合、退出和地图移动。请求分别为 9 个及含 4 个心跳的 13 个。两套构建已更新并核对输入、输出；Node 模拟宿主与本地 TCP 证据单列，微信运行时和真机继续验收。[验收](../reports/validation.md#stage275-legacy-battle-weather-targets)

<a id="stage274-legacy-battle-pursuit-linked"></a>

## stage274 Page 消费联动元组和隐藏资源

Page 源码与生成宿主均通过 SKL400 联动记录、真实等待、回合、退出及地图移动；每条核对 4 个心跳和 13 个请求。另保留资源生命周期及既有地图、战斗、聊天检查，API／Page 构建均通过。Node 宿主与本地 TCP 证据单列，微信运行时和真机继续验收。[验收](../reports/validation.md#stage274-legacy-battle-pursuit-linked)

<a id="stage273-legacy-battle-pursuit-targets"></a>

## stage273 Page 接收重复目标列表

Page 源码与生成宿主均通过普通和提示两种 SKL400 重复目标、本地输入、回合完成、退出及返回地图移动。当前 API 与 Page 构建通过。Node 模拟宿主和本地 TCP 证据单独记录，微信运行时及真机仍待验收。[验收](../reports/validation.md#stage273-legacy-battle-pursuit-targets)

<a id="stage272-legacy-battle-round-ack"></a>

## stage272 A/P 消息和新的操作席位

Page 源码和生成宿主通过本地 TCP 提前 A/P、C 消费后切换至槽 5、第二回合扣费及同连接返回地图移动。共享确认结果按当前身体登记判定。当前 API 与 Page 两套构建通过；Node 模拟宿主结果与微信运行时、真机验收分开记录。[验收](../reports/validation.md#stage272-legacy-battle-round-ack)

<a id="stage271-legacy-battle-character-queue"></a>

## stage271 C 队列与后续回合

Page 源码及生成版的本地宿主均通过施法期间提前收到下一回合 C/A/M、更新角色并移除缺席槽、第二回合扣费、退出及同连接移动。两套当前构建通过，运行产品文件未改。本次 Page 结果来自 Node 模拟宿主，微信运行时和真机继续验收。[验收](../reports/validation.md#stage271-legacy-battle-character-queue)

<a id="stage270-legacy-battle-exit-rid0"></a>

## stage270 待机、死亡与返回地图

Page 源码和生成版宿主通过本地骑乘角色的两次待机与自动退战，并在同一连接返回地图移动。B 占用施法槽的路径也纳入本地 TCP 验收。微信运行时与手机真机继续验收。[验收](../reports/validation.md#stage270-legacy-battle-exit-rid0)

<a id="stage269-legacy-battle-reflected-rid0"></a>

## stage269 反射交接的共享核心

Page 源码和生成版宿主通过反射卸载后的 RID0 本地 TCP 入口，最终角色数值与网页相符。交接动画对象的保留、恢复与释放由共享核心承担。微信运行时和手机真机继续验收。[验收](../reports/validation.md#stage269-legacy-battle-reflected-rid0)

<a id="stage268-legacy-battle-casting-rid0"></a>

## stage268 施法交接的生成版验证

Page 源码和生成版的本地宿主均通过远端 SKL19 尾随 RID0 的 TCP 入口。共享源码与生成核心另对照八条合成回放，覆盖无信号、空目标与内联字段。微信运行时和手机真机待验收。[验收](../reports/validation.md#stage268-legacy-battle-casting-rid0)

<a id="stage267-legacy-battle-rid0-flight"></a>

## stage267 微信 Page 的多帧同槽 RID0

Page 源码和生成版各通过一条新增本地 TCP 路径，核对同槽下降后的角色身份、数值、战斗退出及同连接移动。共享源码与生成版核心另对照六条下降回放。微信运行时与手机真机待验收。[验收](../reports/validation.md#stage267-legacy-battle-rid0-flight)

<a id="stage266-legacy-battle-rid0-ownership"></a>

## stage266 微信生成版核心的 RID0 回收

微信生成版核心的 7 条新分支回放与共享源码逐帧一致，覆盖空闲等待、归位回收和 B 登记后的父身体清理。Page 源码与生成版各通过四条既有 TCP 路径和 111 项回归。微信运行时及手机真机待验收。[验收](../reports/validation.md#stage266-legacy-battle-rid0-ownership)

<a id="stage265-legacy-battle-rid0-interruption"></a>

## stage265 Page 的中断交接

Page 源码与生成版各验证缺席目标和缺席攻击者的本地 TCP 路径。结果核对交接名称、所有在场角色的 HP 和 MP、战斗退出及同连接移动恢复。五套本地构建和 WXML、WXSS 编译通过。微信运行时及手机真机待验收。[验收](../reports/validation.md#stage265-legacy-battle-rid0-interruption)

<a id="stage264-legacy-battle-rid0-receive"></a>

## stage264 Page 的尾随 RID0 回合

Page 源码和生成版各验证普通受击后分离、内联结果与尾随 RID0 共存、同槽交接三条本地 TCP 路径，核对角色名称、HP、MP 和离开战斗后的同连接移动。五套本地构建及 WXML、WXSS 编译通过。微信运行时与手机真机待验收。[验收](../reports/validation.md#stage264-legacy-battle-rid0-receive)

<a id="stage263-legacy-battle-following-results"></a>

## stage263 Page 的后续物理结果

Page 源码和生成版各通过反射内联 RID、治疗内联 RID 后续击及免伤三条本地 TCP 路径，核对全体角色 HP、MP 与退出后的移动。五套本地构建以及 WXML、WXSS 编译通过。微信运行时与手机真机待验收。[验收](../reports/validation.md#stage263-legacy-battle-following-results)

<a id="stage262-legacy-battle-late-recipient"></a>

## stage262 Page 回合的先到受击

Page 源码和构建版各验证单发送者和双发送者回合，核对所有在场角色数值与退出后的同连接移动。五套本地构建及 WXML、WXSS 编译通过。微信运行时和真机待验收。[验收](../reports/validation.md#stage262-legacy-battle-late-recipient)

<a id="stage261-legacy-battle-independent-following"></a>

## stage261 Page 回合的提前归位

Page 源码和构建版各验证两条未起步攻击者回合，核对已结算的角色数值及退场后同连接移动。五套本地构建及 WXML、WXSS 编译通过。微信运行时和真机待验收。[验收](../reports/validation.md#stage261-legacy-battle-independent-following)

<a id="stage260-legacy-battle-missing-lookahead"></a>

## stage260 Page 的前置目标离场回合

Page 源码和构建版各验证两种 PLV 离场输入，核对结算后的角色、HP、MP 及同连接恢复移动。五套本地构建及 WXML、WXSS 编译通过，微信运行时和真机待验收。[验收](../reports/validation.md#stage260-legacy-battle-missing-lookahead)

<a id="stage259-legacy-battle-following-strikes"></a>

## stage259 Page 的多击回合

Page 源码和构建版各通过同一护卫连续攻击、两名护卫攻击同一角色两条本机 TCP 路径。五套本地构建及 WXML、WXSS 编译通过，微信运行时及真机待验收。[验收](../reports/validation.md#stage259-legacy-battle-following-strikes)

<a id="stage258-legacy-battle-repeated-protection"></a>

## stage258 Page 的重复护卫回合

Page 源码与构建版各通过三条本机 TCP 路径，分别覆盖同一护卫、两名护卫和零结果后的后续攻击。五套本地构建及 WXML、WXSS 编译通过，微信运行时和真机待验收。[验收](../reports/validation.md#stage258-legacy-battle-repeated-protection)

<a id="stage257-legacy-battle-guard-wait"></a>

## stage257 Page 的本机护卫回合

Page 源码和构建版各通过 SKL113 外层护卫、SKL72 共享护卫两条本机 TCP 路径，包含结算、退出战斗和恢复移动。五套本地构建及 WXML、WXSS 编译通过，微信运行时和真机待验收。[验收](../reports/validation.md#stage257-legacy-battle-guard-wait)

<a id="stage256-legacy-battle-skl113-wire"></a>

## stage256 SKL113 的本机 Page 入口

Page 源码与构建版通过独立后续、可达的同组续接和共用结束位置三种 SKL113 本机 TCP 场景。独立对端核对战斗退出和继续移动。五套构建及 WXML、WXSS 编译通过，微信运行时和真机待验收。[验收](../reports/validation.md#stage256-legacy-battle-skl113-wire)

<a id="stage255-legacy-battle-guard-alias"></a>

## stage255 施法者兼任护卫的本机 Page 入口

Page 源码和构建版均通过 SKL266 的同槽有飞行目标与仅自身结果。独立本机 TCP 核对战斗退出、移动及连接复用。五套构建与 WXML、WXSS 编译通过，微信运行时和真机待验收。[验收](../reports/validation.md#stage255-legacy-battle-guard-alias)

<a id="stage254-legacy-battle-guard-departure"></a>

## stage254 有飞行目标的护卫本机验收

Page 源码与构建版通过 SKL266 独立护卫、受击角色兼任护卫的本机 TCP 入口。后续耗魔、退场和移动经同一连接核对。微信运行时和真机待验收。[验收](../reports/validation.md#stage254-legacy-battle-guard-departure)

<a id="stage253-legacy-battle-guard-release"></a>

## stage253 护卫动作本机验收

Page 源码与构建版通过 SKL72 护卫原目标退场和 SKL266 仅自身带护卫两种本机 TCP 场景，核对后续耗魔、退场与移动。微信运行时和真机待验收。[验收](../reports/validation.md#stage253-legacy-battle-guard-release)

<a id="stage252-legacy-battle-physical-boundaries"></a>

## stage252 嵌套目标和自身施法回合

Page 通过共享层执行嵌套目标缺席后的续接与无飞行目标的自身结算。源码和构建版的本机 TCP 路径、构建结果及真实平台验收分别记录。[构建与验收](../reports/validation.md#stage252-legacy-battle-physical-boundaries)

<a id="stage251-legacy-battle-physical-registry"></a>

## stage251 物理技能的角色槽续接

Page 使用共享战斗核心处理 C 换表和 PLV 退场后的物理技能。源码和构建版通过本机 TCP 路径核对后续结算、退出及移动。微信运行时和设备验收单独跟踪。[构建与验收](../reports/validation.md#stage251-legacy-battle-physical-registry)

<a id="stage250-legacy-battle-assist-terminator"></a>

## stage250 协作者 FF 后的 Page 续接

游戏 Page 源码和构建版通过两种协作者终止场景的本机 TCP 验证，均可继续施法、退场并触屏移动。五套构建和模板编译通过，微信运行时及真机仍待验收。[构建和验收](../reports/validation.md#stage250-legacy-battle-assist-terminator)

<a id="stage249-legacy-battle-physical-missing"></a>

## stage249 物理中断后的 Page 续接

微信 Page 源码和构建版通过五种物理缺席场景的本机 TCP 验证。两种 Page 均可继续施法、退场并触屏移动，五套构建及模板编译通过。微信运行时与真机仍待验收。[构建和验收](../reports/validation.md#stage249-legacy-battle-physical-missing)

<a id="stage248-legacy-battle-family-missing"></a>

## stage248 技能中断后的 Page 续接

游戏 Page 源码与构建版都通过四个技能族的本机 TCP 缺席目标、后续施法、退场及触屏移动测试。五套构建与模板编译通过，微信运行时与真机仍待验收。[构建和验收](../reports/validation.md#stage248-legacy-battle-family-missing)

<a id="stage247-legacy-battle-missing"></a>

## stage247 战斗缺席恢复

游戏 Page 源码及构建版已在本机测试通过缺席目标、部分换位、后续施法、退场和触屏移动。微信运行时及真机仍待验收。

[构建和验收](../reports/validation.md#stage247-legacy-battle-missing)

<a id="stage246-legacy-battle-status-assist"></a>

## stage246 协作者命中与回复

游戏 Page 源码及构建版在本机 TCP 测试通过变体 12、13 的防御、结果绘制、协作者离场、退出和触屏移动。微信运行时与真机仍待验收。

[构建和验收](../reports/validation.md#stage246-legacy-battle-status-assist)

<a id="stage245-legacy-battle-status-position"></a>

## stage245 旧版战斗换位

游戏 Page 使用共享换位结果更新本方角色和 MP。源码及构建版经本机 Page 测试通过两次防御、槽 5 到槽 0 的角色记录交接、退场与触屏移动。微信运行时、真机与官服分别验收。

[构建和验收](../reports/validation.md#stage245-legacy-battle-status-position)

<a id="stage244-legacy-battle-status-slots"></a>

## stage244 游戏 Page 放大与退场

游戏 Page 沿用共享角色体绘制变体 6、8。源码和构建版在本机通过防御、播放结果、退出与触屏移动。微信模拟器、真机及官服继续分别验收。

[构建和验收](../reports/validation.md#stage244-legacy-battle-status-slots)

<a id="stage243-legacy-game-stream"></a>

## stage243 游戏 Page 出站保活

游戏 Page 通过现有 TCP 适配器使用共享会话的出站空闲计时。源码和构建版均在本机适配中通过两次保活、触屏移动、场景重载及断开。真机网络及微信模拟器继续单独验收。

[会话接口](../reports/module-interfaces.md#stage243-legacy-game-stream) · [构建和验收](../reports/validation.md#stage243-legacy-game-stream)

<a id="stage242-legacy-battle-status-variant"></a>

## stage242 游戏 Page 状态结算

游戏 Page 使用共享 SKL98 队列推进状态、击倒和复活，战斗角色列表同步更新。构建及本机入口结果记录在阶段验收，微信模拟器和真机继续分别验证。

[构建和验收](../reports/validation.md#stage242-legacy-battle-status-variant)

<a id="stage241-legacy-battle-summon"></a>

## stage241 游戏 Page 角色入场

游戏 Page 沿用共享层的 SKL93 替换、动画和战斗结算。源码适配器和本轮构建版均在本机 TCP 下通过角色显示及退场移动。微信模拟器和真机待验收。

[构建和验收](../reports/validation.md#stage241-legacy-battle-summon)

<a id="stage240-legacy-battle-city-return"></a>

## stage240 游戏 Page 战斗回城

游戏 Page 在普通地图和已初始化的战斗中都提供“注销回城”。战斗退出和地图重建使用当前连接，完成转场后恢复触屏移动。[构建和验收](../reports/validation.md#stage240-legacy-battle-city-return)

<a id="stage239-legacy-city-return"></a>

## stage239 游戏 Page 普通地图回城

普通地图操作栏提供“注销回城”。等待转场时触屏移动停用，重建完成后沿用原连接恢复。Page 源码适配器和本轮构建产物均以本机对端验证。[构建和验收](../reports/validation.md#stage239-legacy-city-return)

<a id="stage238-legacy-battle-alternate-exit"></a>

## stage238 游戏 Page 返回选服

普通地图或战斗中可点击“返回选服”。完成退场和应答后，Page 释放本轮连接及资源并恢复选择材料的控件。源码适配器和本轮构建的 Page 均通过独立本机 TCP 对端验证。[构建和验收](../reports/validation.md#stage238-legacy-battle-alternate-exit)

<a id="stage237-legacy-music-phases"></a>

## stage237 选服和战斗曲目

将所需 WAV 放在资源 ZIP 的对应目录下。游戏 Page 从连接到战斗和返回地图使用同一音频适配器。源码和构建产物的本机验收及微信设备范围见运行记录。

[文件布局](../reports/resource-formats.md#stage237-legacy-music-phases) · [构建和验收](../reports/validation.md#stage237-legacy-music-phases)

<a id="stage236-legacy-audio"></a>

## stage236 旧版游戏音频

将所需的独立 WAV 保留在所选资源 ZIP 的资源目录下。游戏 Page 在连接时获取微信音频上下文，在退出或页面隐藏时释放。源码和构建产物均经过本机 TCP 对端及音频端口夹具验证。微信模拟器与真机输出待验收。

[文件布局](../reports/resource-formats.md#stage236-legacy-audio) · [构建和验收](../reports/validation.md#stage236-legacy-audio)

<a id="stage235-legacy-server-return-fade"></a>

## stage235 普通地图与战斗退场

游戏 Page 复用网页的逐行退场适配器。播放期间停用确认与游戏操作，末帧提交后允许返回连接设置。本机源码和构建产物均经过普通地图和战斗两种路径的验证。

[构建和验收](../reports/validation.md#stage235-legacy-server-return-fade)

<a id="stage234-legacy-server-return"></a>

## stage234 服务端退出提示

游戏 Page 接到共享会话的退出状态后显示“返回连接设置”，同时停用触控和战斗操作。确认会关闭 TCP 会话并释放当前材料。本机源码和构建产物均已通过验证。

[通信规格](../reports/logic-protocol-spec.md#stage234-legacy-server-return) · [构建和验收](../reports/validation.md#stage234-legacy-server-return)

<a id="stage233-legacy-frame-startup"></a>

## stage233 选择旧版普通入场

游戏 Page 的启动 JSON 支持整个 `context` 使用 `"legacy-se6000-37c4"`。导入启动 JSON 和资源 ZIP 后，Page 从共享客户端取得帧、角色、相机及触控初值。本机源码和构建产物均已通过入场、移动与换场。微信模拟器和真机仍待验收。

[材料格式](../reports/resource-formats.md#stage233-legacy-frame-startup) · [构建和验收](../reports/validation.md#stage233-legacy-frame-startup)

<a id="stage232-legacy-ordinary-context"></a>

## stage232 普通触控和地砖时段

游戏页接受固定旧版普通移动与输入选择。导入启动 JSON 和资源 ZIP 后，场景触控使用当前移动门和相机。时段由会话数据与宿主时钟计算。本机 Page 源码和构建产物均已验证移动及换场。

[材料格式](../reports/resource-formats.md#stage232-legacy-ordinary-context) · [构建和验收](../reports/validation.md#stage232-legacy-ordinary-context)

<a id="stage231-legacy-display-startup"></a>

## stage231 旧版显示选择

游戏页读取含 `context.display = "legacy-se6000-37c4"` 的启动 JSON 后，使用共享的源画幅和相机。保持使用所选资源 ZIP。场景和角色就绪后，画布端口收到 640×480 像素。

本机构建产物和 Page 源码已通过场景绘制，微信模拟器和真机待验。

[材料格式](../reports/resource-formats.md#stage231-legacy-display-startup) · [构建和验收](../reports/validation.md#stage231-legacy-display-startup)

<a id="stage230-legacy-config-startup"></a>

## stage230 从资源 ZIP 读取 Config.dat

使用 v2 的 `commandTailHex` 时，先导入资源 ZIP，再选启动 JSON。Config.dat 与旧版模块放在 ZIP 根目录。更换资源 ZIP 后，重新选择启动 JSON 可按新包生成资源参数。

本机测试覆盖构建产物的选择、换包、首包、角色列表和断开。微信模拟器与真机运行仍待验。

[材料格式](../reports/resource-formats.md#stage230-legacy-config-startup) · [本机构建和验收](../reports/validation.md#stage230-legacy-config-startup)

<a id="stage229-legacy-startup-materials"></a>

## stage229 使用 ZIP 中的旧版启动模块

游戏页使用 v2 JSON 时先选资源 ZIP，根目录应有固定旧版 `cg_se_6000.exe`，再选启动 JSON 并连接。v1 可按原流程选择。Page 将已选 ZIP 通过只读端口交给共享核验，断开会释放本次材料。

本机构建使用 `node tools/build-wechat-app.mjs --game-config <本机配置 JSON> --outdir <build 内目录>`。模板编译和构建产物的本机 Page 验收已通过。微信模拟器和真机待验。

[启动材料格式](../reports/resource-formats.md#stage229-legacy-startup-materials) · [构建与验收](../reports/validation.md#stage229-legacy-startup-materials)

<a id="stage228-wechat-special-dialogs"></a>

## stage228 使用交接、外观和图文窗口

从地图交互打开交接窗口。给予分支按提示核对数量，接受与退出按当前按钮执行。双字段对话分别填写两项，单项最多 46 编码字节。

外观窗口可用箭头预览当前编号，确认时提交。图文窗口从所选资源包加载图像，缺图时仍可用文字和回复控件。

**本机验收**。从仓库根目录运行以下命令。测试端口将配置中的连接指向独立本机对端。

```sh
node tools/build-wechat-app.mjs --game-config build/analysis/game-wechat-page-v1/game-config.json --outdir build/wechat-app-stage228-page-final
node --test analysis/game-wechat-special-dialogs-v1/page-test.mjs
MOLI_PAGE_VARIANT=source node --test analysis/game-wechat-special-dialogs-v1/page-test.mjs
```

**待验证**。微信实际游戏操作、真机与实际服务端运行。

[连接配置](#stage222-wechat-page) · [验收与夹具](../reports/validation.md#stage228-wechat-special-dialogs)

<a id="stage227-wechat-family-board"></a>

## stage227 使用家族、家族兽和留言板

进入地图后点「家族」查看资料和名单。拥有对应权限时，可编辑家族或会馆、调整称号、面向相邻玩家发送邀请，或管理成员。移除成员和自己退出需确认。

切换「交互模式」并选择家族兽或留言板。家族兽可选允许喂食的物品，名称提交后等待刷新。留言板按窗口提供的方向翻页，发帖受编码字节长度限制，删除按提示确认。

**本机验收**。从仓库根目录运行以下命令。测试端口将配置中的连接指向独立本机对端。

```sh
node tools/build-wechat-app.mjs --game-config build/analysis/game-wechat-page-v1/game-config.json --outdir build/wechat-app-stage227-page-final
node --test analysis/game-wechat-family-board-v1/page-test.mjs
MOLI_PAGE_VARIANT=source node --test analysis/game-wechat-family-board-v1/page-test.mjs
```

**待验证**。模拟器、真机与实际服务端运行。

[连接配置](#stage222-wechat-page) · [验收与夹具](../reports/validation.md#stage227-wechat-family-board)

<a id="stage226-wechat-storage-trade"></a>

## stage226 使用仓储与交易

进入地图后，打开「交互模式」并选择仓储 NPC。银行和仓储可选物品、宠物或金币，饲料箱仅提供物品。物品选来源与目标槽，数量留空表示整组。确认后等待窗口更新。金币页会显示可操作金额。

面向附近可交易角色，点「玩家交易」并选择候选。可勾选物品和宠物、填写金币并发布报价。双方发布后核对报价并确认。若页面提示持有记录变动，先撤回旧报价再核对。

**本机验收**。从仓库根目录运行以下命令。测试端口将配置中的连接指向独立本机对端。

```sh
node tools/build-wechat-app.mjs --game-config build/analysis/game-wechat-page-v1/game-config.json --outdir build/wechat-app-stage226-page-final
node --test analysis/game-wechat-storage-trade-v1/page-test.mjs
MOLI_PAGE_VARIANT=source node --test analysis/game-wechat-storage-trade-v1/page-test.mjs
```

**待验证**。模拟器、真机与实际服务端运行。

[连接配置](#stage222-wechat-page) · [验收与夹具](../reports/validation.md#stage226-wechat-storage-trade)

<a id="stage225-wechat-map-services"></a>

## stage225 在地图治疗与训练

场景出帧后打开「交互模式」，点治疗或技能 NPC。治疗窗口显示每个对象的伤势和费用，可单选、完整治疗或取消。人物师范提供学习与遗忘。遗忘先选技能，再确认。

宠物训练先选课程和合格宠物，再选栏位。确认前会显示空栏学习或替换已有技能。若名单有更新，按窗口提示返回或取消后重新打开。

**本机验收**。从仓库根目录执行以下命令。测试端口将配置中的连接指向独立本机对端。

```sh
node tools/build-wechat-app.mjs --game-config build/analysis/game-wechat-page-v1/game-config.json --outdir build/wechat-app-stage225-page-final
node --test analysis/game-wechat-map-services-v1/page-test.mjs
MOLI_PAGE_VARIANT=source node --test analysis/game-wechat-map-services-v1/page-test.mjs
```

**待验证**。模拟器、真机与实际服务端运行。

[连接配置](#stage222-wechat-page) · [验收与夹具](../reports/validation.md#stage225-wechat-map-services)

<a id="stage224-wechat-inventory-shop"></a>

## stage224 在地图使用背包与商店

场景就绪后打开「背包」，选择源物品，再选择使用、丢弃确认或移动到目标槽。移到空背包槽时可填拆分数量。切换「交互模式」后点近处物品或商人。

商店显示对应的金币、兑换物或配额，以及当前可用数量。选好后按「核对订单」，确认后发送。余额或背包有更新时重新核对。可从当前商店选择「离开商店」。

**本机验收**。使用保留的 `build/wechat-app-stage224-page-final` 构建，运行 `node --test analysis/game-wechat-inventory-shop-v1/page-test.mjs`。加 `MOLI_PAGE_VARIANT=source` 可验证源码适配。

**待验证**。原生模拟器、真机和实际对端运行。

[连接配置](#stage222-wechat-page) · [验收与夹具](../reports/validation.md#stage224-wechat-inventory-shop)

<a id="stage223-wechat-creation"></a>

## stage223 建角和首次进入场景

按游戏连接配置构建并打开游戏页。连接后选择空槽的「创建人物」，按页面依次选择外观、填写名称、分配两组点数并核对。确认收到成功应答后，刷新列表会显示新角色，再选择「进入游戏」。创建被拒绝时可返回原列表。

**本机验收**。使用保留的 `build/wechat-app-stage223-page` 配置构建，运行 `node --test analysis/game-wechat-creation-v1/page-test.mjs`。加 `MOLI_PAGE_VARIANT=source` 可验证源码适配。两套各 7 项已通过。

**待验证**。DevTools 模拟器运行、设备上的输入、网络、外观预览和真实联机。

[连接配置](#stage222-wechat-page) · [验收与夹具](../reports/validation.md#stage223-wechat-creation)

<a id="stage222-wechat-page"></a>

## stage222 构建与打开原生游戏页

从仓库根目录运行 `node tools/build-wechat-app.mjs --outdir build/wechat-app`，将生成目录作为小程序项目打开。默认游戏端点为空，游戏页显示未配置状态。

有已获授权的可访问对端时，可将地址、端口和 `textEncoding` 写入单独 JSON，并使用 `--game-config <JSON>`。文件的结构如下。示例地址用于说明结构，运行时需替换为实际测试对端。

```json
{"endpoint":{"address":"fixture.invalid","port":12345},"textEncoding":"windows-936"}
```

从登录页进入游戏页，选择 `moli.legacy-game-startup.v1` 启动 JSON 与匹配的本地资源 ZIP。登录页已经选择资源时，进入游戏页可接收那份资源副本。两份材料和画布齐备后才能连接。页面隐藏或断开后重新选择材料。微信运行时需提供 `chooseMessageFile`、文件系统、Canvas 2D 与 TCP API。

**事实**。宿主游戏分包、独立共享 API、微信自带模板编译器和两套页面测试均通过。定向测试可运行 `MOLI_PAGE_BUILD=build/wechat-app-stage222-page-final node --test analysis/game-wechat-page-v1/page-test.mjs`，使用该检查点保留的本机 TCP 夹具。

**待验证**。当前 DevTools 的自动化端口和普通游客导入分别遇到运行限制，模拟器和真机验收待完成。

[适配端口](../adapters/wechat/README.md#stage222-wechat-page) · [构建与验收证据](../reports/validation.md#stage222-wechat-page) · [微信 Canvas 2D 示例](https://github.com/wechat-miniprogram/miniprogram-demo/blob/master/miniprogram/packageComponent/pages/canvas/canvas-2d/canvas-2d.js)

<a id="stage221"></a>

<a id="stage221-chat-presentation"></a>

## stage221 气泡、名单和公告的共享构建

**事实**。四套构建核对 783 个输入和 34 个输出。生成核心通过 80 项测试和 24 条本机 TCP 流程，覆盖新增共享名单及普通帧数据。

**事实**。当前输出目录为 build/wechat-app-stage221-chat-presentation、build/wechat-app-local-stage221-chat-presentation、build/wechat-app-resources-stage221-chat-presentation 与 build/wechat-game-stage221-chat-presentation。构建命令和产物哈希见阶段验证。

**待验证**。微信原生游戏页的显示和存储适配、DevTools、实机及官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-chat"></a>

### 前序检查点 · 地图聊天的共享构建

**事实**。四套构建核对 783 个输入和 34 个输出。生成核心在本机完成聊天请求和回显字节验收。

**待验证**。微信原生游戏页、DevTools 与设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 家族成员操作的共享构建

**事实**。四套构建核对 779 个输入和 34 个输出。家族邀请与成员操作已在生成核心完成本机字节验收。

**待验证**。微信原生游戏页、DevTools 与设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 家族资料和称号管理的共享构建

**事实**。四套构建核对 779 个输入和 34 个输出，家族状态和管理命令经生成核心完成本机字节验收。

**待验证**。微信原生游戏页、DevTools 与设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 家族兽和饲料箱的共享构建

**事实**。四套构建核对 775 个输入和 34 个输出。家族兽与饲料箱经生成核心完成本机字节验收。

**待验证**。微信原生游戏页、DevTools 与设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 仓储存取的共享构建

**事实**。四套构建核对 771 个输入和 34 个输出。生成核心已完成仓储存取的本机字节流程。

**待验证**。微信原生游戏页、DevTools 与设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 地图专用窗口的共享构建

**事实**。四套构建核对 767 个输入和 34 个输出。新窗口经生成核心走完本机字节流程。

**待验证**。微信原生游戏页、DevTools 与设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 宠物训练的共享构建

**事实**。四套构建核对 763 个输入和 34 个输出，生成核心完成宠物训练的本机字节回放。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · NPC 服务的共享构建

**事实**。四套构建核对 759 个输入和 34 个输出。生成核心已通过买卖、兑换入口和技能师范的本机原字节回放。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · 治疗和对话图形的共享构建

**事实**。四套构建核对 755 个输入和 34 个输出。生成核心完成治疗与图文菜单的本机原字节回放。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 玩家交易的共享构建

**事实**。四套构建核对 751 个输入和 34 个输出。生成核心通过玩家交易的双入口和报价生命周期本机回放。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 留言板的共享构建

**事实**。四套构建核对 747 个输入和 34 个输出。生成核心通过留言板读写、刷新和关闭的本机回放。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 单项给予的共享构建

**事实**。四套构建核对 747 个输入和 34 个输出。生成核心通过两套数量限制、确认、取消及离店移动的本机回放。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 物品兑换的共享构建

**事实**。四套构建核对 747 个输入和 34 个输出。生成核心通过兑换、取消和离店移动的本机回放。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 鉴定与修理的共享构建

**事实**。四套构建核对 747 个输入和 34 个输出。生成核心通过鉴定、修理和取消的本机回放。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-shop"></a>

### 前序检查点 · 普通买卖的共享构建

**事实**。四套构建核对 747 个输入和 34 个输出。独立生成核心通过普通买卖与取消的本机 TCP 流程。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 角色交互和对话的共享构建

**事实**。四套构建核对 743 个输入和 34 个输出。生成核心通过角色目标、菜单、中文文本与关闭的本机字节流程。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 地面拾取的共享构建

**事实**。四套构建核对 739 个输入和 34 个输出，外部导入为零。生成核心完成普通转身、地面物品和同格钱币的本机 TCP 验证。

**待验证**。微信原生游戏页、DevTools 和设备。

[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 共享构建

**事实**。89 个测试文件的 1,223 项战斗回归及生成包 53 项专项通过。四套构建核验 727 个输入和 34 个输出，外部导入为零。 中性生成包完成正常及提前退场的本机 TCP 流程。

**待验证**。微信原生游戏页、DevTools 和设备。

[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 共享构建

**事实**。88 个测试文件的 1,216 项战斗回归和生成包 46 项专项通过。四套构建核验 723 个输入及 34 个输出，外部导入为零。 中性生成包经本机 TCP 验证搬运、成对离场和地图返回。

**待验证**。微信原生游戏页、DevTools 和设备。

[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL402 共享构建

**事实**。87 个测试文件的 1,209 项战斗回归与生成包 39 项专项全部通过。四套构建核验 723 个输入和 34 个输出，外部导入为零。 生成包在中性环境及本机 TCP 验证两侧。

**待验证**。微信原生游戏页、DevTools 和设备。

[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · 共享恢复与本地构建

**事实**。86 个文件的 1,204 项回归及生成包的 34 项专项全部通过。四套构建核验 723 个输入与 34 个输出，外部导入为 0。 neutral 包完成同槽 SKL404 两轮和 SKL405 单轮的本机 TCP 流程。

**待验证**。微信原生 gamePage、DevTools、设备和官服兼容。

[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：合击构建与设备边界

**事实**：当前77个战斗文件1,076/1,076项、当前neutral生成包64/64项通过；四套构建核对687个输入和34个输出，外部导入0。当前物理族主验收本机TCP397次（源码337、生成52、页面8）；新增CMB为14源码、14生成、8页面，调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共46截图，全部正常回合、返回地图与准确后续移动；页面错误、警告、外联0。Browser插件不可用，使用已有Playwright1.64.1。触控HUD核对Hero MP10、替换的OriginalRider HP40/MP8、目标HP51；nextC中的MP7来自新C包，不是合击扣费。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](../analysis/game-battle-combination-v1/source-check.json)、[源修正](../analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-combination-v1/test-results.json)、[验收边界](../analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](../analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](../analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：RID构建与设备边界

**事实**：当前75个战斗文件1,058/1,058项、当前neutral生成包46/46项通过；四套构建核对679个输入和34个输出，外部导入0。当前物理族主验收本机TCP369次（源码323、生成38、页面8）；新增RID为10源码、10生成、8页面，额外调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共42截图，全部完成回合、返回地图及准确后续移动；页面错误、警告、外联0。实际HUD显示替换后的OriginalRider HP40/100、MP8/10。原创小像素夹具不代表完整游戏画面。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](../analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](../analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](../analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](../analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](../analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：73构建与平台边界

**事实**：当前73个战斗测试文件完整回归1,046项全部通过；neutral生成包完整34项全部通过。四种构建核对671个输入与34个输出，外部导入0。357次主物理家族本机TCP回执（源码313、生成28、页面16）均校验正常启动、准确指令和清理。桌面1100×850与触控模拟390×844各8条实际game.html流程，共82截图；15条返回地图并继续准确移动，1条保留有界等待后断开。页面错误、警告、外联均为0。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair73-v1/source-check.json)、[源修正](../analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair73-v1/test-results.json)、[验收边界](../analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：260构建与平台边界

**事实**：71文件完整战斗回归初轮1,012项中1,011通过、1条压力资源重入的“应正常回合”预期失败；生成包初轮33项中31通过，另有同一重入预期及跨VM对象原型比较失败。只修正3个测试辅助文件，源码与生成包各定向复验2项通过，最终分别覆盖1,012与33个检查；未声称修正后重跑完整两套。932个其他输入及产品运行代码保持相同。四种构建671输入/34输出、外部导入0；328次主物理家族TCP回执（源码285、生成27、页面16）。桌面与触屏模拟各8流程、83截图，15条正常返回移动及1条预期上下文错误/清理通过，页面错误、警告、外联0。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](../analysis/game-battle-chain260-v1/source-check.json)、[源修正](../analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-chain260-v1/test-results.json)、[验收边界](../analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](../analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](../analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：105构建和设备边界

**事实**：当前69文件战斗979/979、当前neutral生成包34/34、四套构建663输入/34输出通过，0外部导入。当前物理族主验收本地TCP301次（源码258、生成27、实际页面16），另4次实际98动作内暂停/重入定向核对不计入主总数；暂停的重试不重复消耗游标，重入保留2，两次已发生的M消耗按两次计算。桌面/触屏模拟各8流程、83张截图，15条返回移动及1条预期错误提示/清理通过，页面异常/警告/外联0。921个运行/测试/对端输入稳定，含58个Python对端。未重跑全仓或历史生成包全套。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-context-v1/source-check.json)、[源修正](../analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-context-v1/test-results.json)、[验收边界](../analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：构建与设备验收边界

**事实**：当前67文件战斗945/945、当前neutral生成包33/33、四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP272次（源码231、生成27、实际页面14）；桌面/触屏模拟各7流程、74张截图，页面错误/警告/外联均为0。907个运行/测试/对端输入稳定，含57个Python对端。未重跑全仓或历史生成包全套。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](../analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](../analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：构建与实际设备边界

**事实**：当前65文件战斗912/912、当前neutral生成包27/27和四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP227次（源码204、生成21、实际页面2）；桌面/触屏各一次266反射、回合、返回及精确移动流程通过，共10张截图，页面错误/警告/外联0。895个运行/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成包全套。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](../analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：四套构建与未验原生平台

**事实**：当前战斗912/912（65文件）、当前neutral生成包25/25、四套构建（659输入、34输出、0外部导入）通过。当前物理族本地TCP共241次：保留源码184、新源码20、生成20、实际页面17；17条桌面/触屏流程、106张截图，页面错误/警告/外联均为0。893个源码/模型/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成套件。

输出build/wechat-app-stage213-verified、build/wechat-app-local-stage213-verified、build/wechat-app-resources-stage213-verified、build/wechat-game-stage213-verified。App各171输入、Game146输入，未运行原生微信DevTools或设备。

**事实**：96默认后端的4160组队列、80条轨迹、32959帧状态、11836帧双selector完整RGBA与实际共享核心一致。另两条替代渲染轨迹的927状态/578像素/50样式观察仅为独立源方程；实际公开配置仍报LEGACY_BATTLE_SKILL_CONFIGURATION，未放宽门禁、未计入运行或像素通过。当前仍无替代渲染/半透明后端的完整实现。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special96-v1/source-check.json)、[源修正](../analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special96-v1/test-results.json)、[验收边界](../analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：四套构建及平台验收边界

**事实**：当前战斗887/887（63文件）、当前neutral生成包25/25、四套构建（651输入、34输出、0外部导入）通过。当前物理族本地TCP共220次：保留源码164、新源码20、生成20、实际页面16；16条桌面/触屏流程、84张截图，页面错误/警告/外联均为0。879个源码/模型/测试/对端输入稳定，含55个Python对端。未重跑全仓或历史生成套件。

输出build/wechat-app-stage212-verified、build/wechat-app-local-stage212-verified、build/wechat-app-resources-stage212-verified、build/wechat-game-stage212-verified。App各169输入、Game144输入；未运行原生微信DevTools或设备。

**事实**：原435000只给72读取嵌套记录，且不把嵌套目标本身标成依赖（护卫会标记）；424310运行时同时处理72/113。保留原解析边界：113嵌套的4480组队列/104条轨迹仅为运行时命令夹具；可经真实前置解析的部分为4640组队列/157条轨迹。真实TCP/页面只验证72嵌套及113无嵌套，不将113嵌套标成协议兼容。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](../analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：四套构建及未验原生平台

61个当前shared/web战斗文件共862项单次全绿；当前生成包27项通过；四套构建643输入/34输出身份一致、无外部导入。当前物理族203次本机TCP：既有源码142、新源码22、生成22、实际页面17。17条桌面/触屏流程、89张截图，页面错误/警告/外联均为0；865个源码/模型/测试/对端输入稳定，含54个Python对端。未重跑全仓或历史486项生成套件。

输出：build/wechat-app-stage211-verified、build/wechat-app-local-stage211-verified、build/wechat-app-resources-stage211-verified、build/wechat-game-stage211-verified。App各167输入、Game142输入，输出34件；未运行原生微信DevTools/设备。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-self-physical-v1/source-check.json)、[源修正](../analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：当前四套构建与平台边界

59个当前shared/web战斗测试文件共835项单次全绿，当前生成包33项通过；四套构建643输入/34输出核验通过，0external。当前物理族189次本机TCP（既有源码115、新结果源码27、生成27、页面20），20条实际桌面/触屏流程、104张截图，页面错误/警告/外联均为0。853个源码/模型/测试/对端输入身份稳定，包含53个Python对端。本轮未重跑全仓或历史486项生成包全套。

输出：`build/wechat-app-stage210-verified`、`build/wechat-app-local-stage210-verified`、`build/wechat-app-resources-stage210-verified`、`build/wechat-game-stage210-verified`。App各167输入、Game142输入，34输出且无外部导入。构建沿用tools/build-wechat-app.mjs及tools/build-wechat-game.mjs；未运行原生微信DevTools或设备。

**待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](../analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](../analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：当前四套构建与未验收设备

57个当前shared/web战斗测试文件共802项通过，当前生成包27项通过；四套构建643输入/34输出身份核验通过。当前物理族150次本机TCP执行（既有源码94、新结果源码21、生成21、页面14）。14条真实桌面/触屏流程、74张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。

输出：`build/wechat-app-stage209-verified`、`build/wechat-app-local-stage209-verified`、`build/wechat-app-resources-stage209-verified`、`build/wechat-game-stage209-verified`；App各167输入，Game142输入，输出共34个、外部导入0。沿用tools/build-wechat-app.mjs及tools/build-wechat-game.mjs；未运行原生微信DevTools或设备。

**待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。

[需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-results-v1/source-check.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：四套当前构建与设备边界

当前55个shared/web战斗测试文件共775项通过；当前生成包17项通过；四套构建639输入/34输出身份核验通过。当前物理族117次本机TCP执行（既有源码81、新护卫源码13、生成13、页面10）。10条实际桌面/触屏流程、54张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。

输出：`build/wechat-app-stage208-verified`、`build/wechat-app-local-stage208-verified`、`build/wechat-app-resources-stage208-verified`、`build/wechat-game-stage208-verified`；App各166输入、Game141输入，输出共34个，外部导入0。构建命令沿用tools/build-wechat-app.mjs和tools/build-wechat-game.mjs；未运行原生微信DevTools或设备。

**待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：四套新构建与设备边界

2243项源码测试通过（188文件）；486项当前生成包检查单次全绿（479 neutral API、7 App/Page）。四套构建631输入/34输出身份核对通过，无外部导入。物理族177次本机TCP执行（源码81、生成81、真实页面15）；14种桌面/触屏流程共15次执行、80张独立截图，页面错误/警告/外联均为0。

输出：`build/wechat-app-stage207-verified`、`build/wechat-app-local-stage207-verified`、`build/wechat-app-resources-stage207-verified`、`build/wechat-game-stage207-verified`。App各164输入、Game139输入；未运行原生微信DevTools或设备。

**待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。

[需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：四套构建与生成包验收

2223项源码全量测试通过（186文件）。生成包全量运行469项，3项因验收器跨realm数组原型比较失败；只修正测试比较后，4项相关检查复跑通过，469个不同检查均有通过证据，原失败运行保留，未称单次全绿。四套构建的623输入/34输出身份一致；物理族161次本机TCP执行（源码69、生成69、页面23）完成，页面21种桌面/触屏流程、105张独立截图，错误/警告/外联均为0。

当前输出：`build/wechat-app-stage206-verified`、`build/wechat-app-local-stage206-verified`、`build/wechat-app-resources-stage206-verified`、`build/wechat-game-stage206-verified`。App各162输入、Game137输入，无外部导入；没有运行原生微信DevTools或真机。

**待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。

[需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：当前四套构建与440项生成检查

全量2194项源码测试（184文件）、440项生成检查（433 neutral＋7 App/Page）、四套构建通过；615输入和34输出身份一致。108条本机OS TCP流程及18条实际桌面/触屏页面流程通过，92截图逐个hash，页面错误/警告/外联均为0。新增源码与生成回归各1项；本轮没有新增TCP场景。

四套输出：`build/wechat-app-stage205-verified`、`build/wechat-app-local-stage205-verified`、`build/wechat-app-resources-stage205-verified`、`build/wechat-game-stage205-verified`。App各160输入、Game135输入；本轮未运行原生开发者工具或真机。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：四套当前构建与439生成检查

四套输出为`build/wechat-app-stage204-verified`、`build/wechat-app-local-stage204-verified`、`build/wechat-app-resources-stage204-verified`及`build/wechat-game-stage204-verified`。源码身份615项、生成输出34项全部复核；App三套各160输入，Game135输入。439项检查由432 neutral和7 App/Page组成，新增45实际TCP及1个15995队列检查。

正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：保留stage202已构建基线

仍使用stage202-verified四套构建；本轮复核607输入/34输出，没有重新构建或重复累计393检查。10个新增原生辅助过程属于分析证据，公共物理族扩展尚未进入生成游戏。原生微信gamePage/Canvas/font/audio/network/scheduler、DevTools及设备继续未验。

本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](../analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](../analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：当前构建与原生微信待验

当前产物为`build/wechat-app-stage202-verified`、`build/wechat-app-local-stage202-verified`、`build/wechat-app-resources-stage202-verified`和`build/wechat-game-stage202-verified`。三App各158输入/11输出、Game133输入/1bundle，总607/34、0external；393当前生成检查通过。

继续使用`node tools/build-wechat-app.mjs --outdir <目录>`、`node tools/build-wechat-game.mjs --outdir <目录>`；local/resources配置及逐命令日志/身份见test-results。15网页鼠标/触摸流程不替代微信导入、DevTools和设备。82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](../analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](../analysis/game-battle-skill82-v1/source-check.json)、[验证修正](../analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-skill82-v1/test-results.json)、[TCP](../analysis/game-battle-skill82-v1/network-validation.json)、[页面](../analysis/game-battle-skill82-v1/browser-validation.json)、[验收](../analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](../analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](../analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：当前生成产物与微信待验

当前目录为`build/wechat-app-stage201-verified`、`build/wechat-app-local-stage201-verified`、`build/wechat-app-resources-stage201-verified`和`build/wechat-game-stage201-verified`。三App各156输入/11输出，Game131输入/1bundle，总599/34、0external；351生成检查通过的最终集合及初始修正日志见test-results。

继续用`node tools/build-wechat-app.mjs --outdir <目录>`、`node tools/build-wechat-game.mjs --outdir <目录>`，local/resources配置和逐命令日志/身份均保留。13网页鼠标/触摸流程不替代微信导入、DevTools或实际设备。非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](../analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](../analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](../analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](../analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](../analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](../analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](../analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：当前构建与原生微信待验

已生成`build/wechat-app-stage200-verified`、`build/wechat-app-local-stage200-verified`、`build/wechat-app-resources-stage200-verified`和`build/wechat-game-stage200-verified`。三App各155输入/11输出，Game130输入/1bundle，总595/34，0external；326生成检查（319neutral/7App/Page）通过。

仍以`node tools/build-wechat-app.mjs --outdir <目录>`和`node tools/build-wechat-game.mjs --outdir <目录>`构建，local/resources配置和每次命令/日志/身份见test-results。28新生成TCP和2317独立队列核当前bundle；15网页鼠标/触摸流程不替代微信导入、DevTools与实际设备。共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](../analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](../analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](../analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](../analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：当前构建及微信待验

已生成`build/wechat-app-stage199-verified`、`build/wechat-app-local-stage199-verified`、`build/wechat-app-resources-stage199-verified`和`build/wechat-game-stage199-verified`。三App各153输入/11输出，Game128输入/1bundle，总587/34，0external；297生成检查（290neutral/7App/Page）通过。

重建仍使用`node tools/build-wechat-app.mjs --outdir <目录>`、`node tools/build-wechat-game.mjs --outdir <目录>`，完整local/resources配置路径和每次命令/日志/输入输出哈希见本轮test-results。51新生成TCP和2912独立队列核当前bundle；13网页触摸/鼠标证据不替代真实微信导入、DevTools与设备验收。其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](../analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-status-skills-v1/test-results.json)、[TCP](../analysis/game-battle-status-skills-v1/network-validation.json)、[页面](../analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：四套当前构建与真实微信待验

已生成`build/wechat-app-stage198-verified`、`build/wechat-app-local-stage198-verified`、`build/wechat-app-resources-stage198-verified`和`build/wechat-game-stage198-verified`。三App各151输入/11输出，Game126输入/1bundle，总579/34且0external。生成独立检查245项（238neutral/7App/Page）通过，包含25条施法真实本机TCP及原队列/寻向/CRT对比。

重建命令沿用`node tools/build-wechat-app.mjs --outdir <目录>`和`node tools/build-wechat-game.mjs --outdir <目录>`；完整本轮命令、local/resources配置路径、构建输入与输出哈希在test-results。正常微信导入仍需原生DevTools/设备核验。本轮网页10条触摸/鼠标流程仅为浏览器证据。自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[规格](../analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](../analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](../analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-casting-v1/test-results.json)、[TCP](../analysis/game-battle-casting-v1/network-validation.json)、[页面](../analysis/game-battle-casting-v1/browser-validation.json)、[验收](../analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](../analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：人物技能进入共享生成核心

共享核心已接入已证J:@/J<=/JUA记录、主指令技能/等级/目标与S请求，衔接实际已有物理回调及下一C/普通返回；原生微信游戏Page仍待开发验收。既有启动器App/Page7项检查保留通过，完整生成API211检查包括13条新实际OS TCP。

31新增/1929全量Node、四构建/218生成检查（211neutral/7App/Page）通过；571输入/34输出身份一致，0external。45独立完整接收状态、14输入场景781状态、110个有符号MP计算边界通过。32新真实本机TCP含6实际页面，核160启动、177技能接收包、34自动查询及37个S请求；25次正常返回、25退出/50移动，27张原创夹具截图在源码外。

完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-player-skills-v1/source-check.json)、[测试](../analysis/game-battle-player-skills-v1/test-results.json)、[TCP](../analysis/game-battle-player-skills-v1/network-validation.json)、[页面](../analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-player-skills-v1/goal-audit.json)。


<a id="stage196"></a>

## stage196：继续共享M/MON核心，原生游戏Page仍待完成

最新共享核心完成已证普通宠物选择/缓存/M/MON队列、实际身体/效果/缩放策略与独立呈现选择器；neutral生成API含13条新真实TCP、16场景逐帧参考与呈现令牌检查。既有启动器App/Page7检查继续通过，网页实际触屏流程仅是本地产品证据。

51新增/1898全量Node、四构建/203生成检查（196neutral/7App/Page）通过；567输入/34输出身份一致，0external。16独立MON场景1864状态、13输入场景673状态、240独立缩放策略像素用例通过；MON同时核两呈现选择器，共3628个像素结果，100个alternate未支持结果。32新真实本机TCP含6实际页面，核160启动、210宠物接收包、42输入（27 M|1、8 M|FF、3 W|FF、4 N）、25退出/50移动及25次正常返回；25张独立原创夹具截图在源码外。

完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](../analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pet-transition-v1/source-check.json)、[测试](../analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](../analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](../analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](../analysis/game-battle-pet-transition-v1/goal-audit.json)。


<a id="stage195"></a>

## stage195：继续共享游戏核心，原生游戏Page仍待完成

最新共享核心已支持由接收数据驱动的普通骑乘/宠物语义输入和真实本地W请求，neutral生成游戏API16条TCP通过；既有启动器App/Page7检查继续通过。当前gamePage/Canvas/font/audio/network/scheduler原生集成、DevTools、微信及设备实际游玩仍待完成，不以网页触摸模拟替代。

36新增/1847全量Node、四构建/173生成检查（166neutral/7App/Page）通过；555输入/34输出身份一致，0external。15独立场景833输入状态、53完整接收记录状态通过。38新真实本机TCP含6实际页面，核190启动、120宠物接收包、86输入（34 W|FF、28 W|0|A、5 W|1|0、3 W|2|29、10 G、6 N）、31退出/62移动与31次正常返回；24张独立原创夹具截图在源码外。

完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](../analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](../analysis/game-battle-mounted-input-v1/source-check.json)、[测试](../analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](../analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](../analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](../analysis/game-battle-mounted-input-v1/goal-audit.json)。


<a id="stage194"></a>

## stage194：构建运行与CBC生成验收

App：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage194-final`；local/resources沿原local-config.json/resources-config.json和对应stage194-final目录。API：`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage194-final`。检查：`node --test analysis/game-battle-character-change-v1/portable-test.mjs analysis/game-battle-character-change-v1/bundle-test.mjs`。

四构建157生成、551输入/34输出身份核对通过。14条CBC关联真实TCP在neutral生成API执行，包含保留原生骑乘输入缺口的负向流程。没有运行原生微信游戏Page或DevTools/设备。完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-character-change-v1/source-check.json)、[规格](../analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-character-change-v1/test-results.json)、[TCP](../analysis/game-battle-character-change-v1/network-validation.json)、[验收](../analysis/game-battle-character-change-v1/validation.json)、[剩余目标](../analysis/game-battle-character-change-v1/goal-audit.json)。

<a id="stage193"></a>

## stage193：构建运行与POS/EQU生成验收

App：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage193-final`；local/resources沿原local-config.json/resources-config.json和对应stage193-final目录。API：`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage193-final`。检查：`node --test analysis/game-battle-change-v1/portable-test.mjs analysis/game-battle-change-v1/bundle-test.mjs`。

四构建142检查、547输入/34输出身份核对，0external；12真实TCP在neutral生成API中验证真实对象换位、装备切换、下一C和取消/重入/关闭。原生微信游戏Page及DevTools/设备没有运行，不把网页仿真算设备验收。完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-change-v1/source-check.json)、[规格](../analysis/game-battle-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-change-v1/test-results.json)、[TCP](../analysis/game-battle-change-v1/network-validation.json)、[验收](../analysis/game-battle-change-v1/validation.json)、[剩余目标](../analysis/game-battle-change-v1/goal-audit.json)。

<a id="stage192"></a>

## stage192：构建与普通PSN的生成验收

App：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage192-final`；local/resources沿既有local-config.json/resources-config.json及对应stage192-final目录。API：`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage192-final`。检查：`node --test analysis/game-battle-status-v1/portable-test.mjs analysis/game-battle-status-v1/bundle-test.mjs`。

四构建/129检查、543输入/34输出身份核对，0external；11条PSN在neutral生成API中走真实TCP。原生微信游戏Page/端口和DevTools/设备未运行，不把网页触屏仿真当原生验收。完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-status-v1/implementation-plan.json)、[源核验](../analysis/game-battle-status-v1/source-check.json)、[规格](../analysis/game-battle-status-v1/implementation-spec.json)、[测试](../analysis/game-battle-status-v1/test-results.json)、[TCP](../analysis/game-battle-status-v1/network-validation.json)、[验收](../analysis/game-battle-status-v1/validation.json)、[剩余目标](../analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：构建与网页能力的边界

App：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage191-final`；local/resources沿既有`--config build/analysis/game-legacy-scene-frame-v1/local-config.json`或`resources-config.json`及对应stage191-final目录。API：`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage191-final`。检查：`node --test analysis/game-battle-web-v1/portable-test.mjs analysis/game-battle-web-v1/bundle-test.mjs`。

四构建/117检查、539输入/34产物核身份、0external通过。实际基础战斗页面和触屏仿真属于网页适配；原生微信仍为登录器Page和游戏API构建，游戏Page/Canvas/文件/网络/字体/音频/调度与完整菜单/玩法、DevTools及设备/现行/官方未完成，本轮未运行这些原生验收。

[来源核验](../analysis/game-battle-web-v1/source-check.json)、[规格](../analysis/game-battle-web-v1/implementation-spec.json)、[测试](../analysis/game-battle-web-v1/test-results.json)、[实际页面](../analysis/game-battle-web-v1/browser-validation.json)、[位图核验](../analysis/game-battle-web-v1/canvas-browser.json)、[网络](../analysis/game-battle-web-v1/network-validation.json)、[验收](../analysis/game-battle-web-v1/validation.json)、[目标审计](../analysis/game-battle-web-v1/goal-audit.json)。

<a id="stage190"></a>

## stage190：构建运行和局部技能验收

App：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage190-final`；local/resources沿既有`--config build/analysis/game-legacy-scene-frame-v1/local-config.json`或`resources-config.json`及对应stage190-final目录。API：`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage190-final`。生成检查：`node --test analysis/game-battle-skill-v1/portable-test.mjs analysis/game-battle-skill-v1/bundle-test.mjs`。

三App141输入/11产物、API116输入，539输入/34产物核身份，0external，115检查通过；共享普通物理队列/动画/数值和战后恢复已核。原生游戏Page、Canvas/输入/完整菜单/音频等平台端口和设备未实现或未验收，本轮未运行DevTools，不代表完整可玩或官方兼容。

[源证据](../analysis/game-battle-skill-v1/source-check.json)、[规格](../analysis/game-battle-skill-v1/implementation-spec.json)、[测试](../analysis/game-battle-skill-v1/test-results.json)、[TCP](../analysis/game-battle-skill-v1/network-validation.json)、[验收](../analysis/game-battle-skill-v1/validation.json)、[目标审计](../analysis/game-battle-skill-v1/goal-audit.json)。

<a id="stage189"></a>

## stage189：构建运行与普通返回证据

App：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage189-final`；local/resources使用既有`--config build/analysis/game-legacy-scene-frame-v1/local-config.json`或`resources-config.json`及对应stage189-final目录。API：`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage189-final`。生成检查：`node --test analysis/game-battle-return-v1/portable-test.mjs analysis/game-battle-return-v1/bundle-test.mjs`。

三App各139输入/11产物，API114输入；531输入/34产物身份一致、0external，101检查通过。正常来源返回及后续准确移动已到共享client/API，实际原生游戏Page、产品控件/设备和完整玩法/官方仍未完成；本轮未运行DevTools/设备。[源证据](../analysis/game-battle-return-v1/source-check.json)、[规格](../analysis/game-battle-return-v1/implementation-spec.json)、[测试](../analysis/game-battle-return-v1/test-results.json)、[TCP](../analysis/game-battle-return-v1/network-validation.json)、[验收](../analysis/game-battle-return-v1/validation.json)、[目标审计](../analysis/game-battle-return-v1/goal-audit.json)。

<a id="stage188"></a>

## stage188：构建与退出验证命令

App：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage188-final`；local/resources使用原有`--config build/analysis/game-legacy-scene-frame-v1/local-config.json`或`resources-config.json`及对应stage188-final目录。API：`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage188-final`。生成检查：`node --test analysis/game-battle-exit-v1/portable-test.mjs analysis/game-battle-exit-v1/bundle-test.mjs`。

三App各138输入/11产物，API113输入；527输入/34产物身份一致、0external，89生成检查通过。实际游戏Page、原生控件/设备、普通返回和完整玩法/官方仍未完成；本轮未运行DevTools/设备。[源证据](../analysis/game-battle-exit-v1/source-check.json)、[规格](../analysis/game-battle-exit-v1/implementation-spec.json)、[测试](../analysis/game-battle-exit-v1/test-results.json)、[TCP](../analysis/game-battle-exit-v1/network-validation.json)、[验收](../analysis/game-battle-exit-v1/validation.json)、[目标审计](../analysis/game-battle-exit-v1/goal-audit.json)。

<a id="stage187"></a>

## stage187：构建与自动M验证命令

App：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage187-final`；local/resources分别使用已有`--config build/analysis/game-legacy-scene-frame-v1/local-config.json`或`resources-config.json`和对应stage187-final目录。API：`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage187-final`。生成检查：`node --test analysis/game-battle-loop-v1/portable-test.mjs analysis/game-battle-loop-v1/bundle-test.mjs`。

三App各136输入/11产物，API111输入；519输入/34产物身份核对一致，0external。77生成检查通过，但实际游戏Page、原生控件/设备、完整玩法/退出及官方仍未完成；本轮未运行DevTools/设备。[源证据](../analysis/game-battle-loop-v1/source-check.json)、[规格](../analysis/game-battle-loop-v1/implementation-spec.json)、[测试](../analysis/game-battle-loop-v1/test-results.json)、[TCP](../analysis/game-battle-loop-v1/network-validation.json)、[验收](../analysis/game-battle-loop-v1/validation.json)、[目标审计](../analysis/game-battle-loop-v1/goal-audit.json)。

<a id="stage186"></a>

## stage186：构建与中立输入验证命令

App构建为`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage186-final`；local/resources加原有`--config build/analysis/game-legacy-scene-frame-v1/local-config.json`或`resources-config.json`并使用对应stage186-final目录。API构建为`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage186-final`。生成产物检查：`node --test analysis/game-battle-input-v1/portable-test.mjs analysis/game-battle-input-v1/bundle-test.mjs`。

三App135输入/11产物，API110输入；515输入/34产物核身份，0external。60neutral+7App/Page通过，包含新的基础语义输入/$T5请求及失败/取消/重入。实际游戏Page与原生控件/设备、M/退出及完整玩法未完成；本轮没有运行DevTools/设备。[源证据](../analysis/game-battle-input-v1/source-check.json)、[规格](../analysis/game-battle-input-v1/implementation-spec.json)、[测试](../analysis/game-battle-input-v1/test-results.json)、[TCP](../analysis/game-battle-input-v1/network-validation.json)、[验收](../analysis/game-battle-input-v1/validation.json)、[目标审计](../analysis/game-battle-input-v1/goal-audit.json)。

<a id="stage185"></a>

## stage185：四构建与53项生成检查

执行`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage185-final`；local/resources分别加`--config build/analysis/game-legacy-scene-frame-v1/local-config.json`或`resources-config.json`及相应stage185-final目录。API用`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage185-final`。检查入口为`node --test analysis/game-battle-entry-v1/portable-test.mjs analysis/game-battle-entry-v1/bundle-test.mjs`。

三App各134输入/11产物，API109输入，511输入及34产物身份一致、0external。46neutral+7App/Page通过，含新入场/C/捕获、取消/再入场/旧ordinary交接及54fade步骤。原生gamePage、实际战斗操作/M/退出及设备验收仍未完成；本轮未运行DevTools/设备。[源证据](../analysis/game-battle-entry-v1/source-check.json)、[规格](../analysis/game-battle-entry-v1/implementation-spec.json)、[测试](../analysis/game-battle-entry-v1/test-results.json)、[TCP](../analysis/game-battle-entry-v1/network-validation.json)、[验收](../analysis/game-battle-entry-v1/validation.json)、[目标审计](../analysis/game-battle-entry-v1/goal-audit.json)。

<a id="stage184"></a>

## stage184：四新构建及41项生成检查

运行`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage184-final`；local/resources另带`--config build/analysis/game-legacy-scene-frame-v1/local-config.json`或`resources-config.json`及对应stage184-final输出目录。API用`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage184-final`；检查`node --test analysis/game-battle-scene-v1/portable-test.mjs analysis/game-battle-scene-v1/bundle-test.mjs`。

三App各132输入/11产物，API107输入，0external；503输入与34产物身份核验。新包保留原普通场景/登录器流程，同时含基础战斗client frame任务；34neutral+7App/Page通过，其中新增5条真实OS TCP核211帧、暂停取消/早恢复/关闭/读失败。小程序原生gamePage和完整战斗流程尚未实现或验收，未运行本轮DevTools/设备。[源证据](../analysis/game-battle-scene-v1/source-check.json)、[规格](../analysis/game-battle-scene-v1/implementation-spec.json)、[测试](../analysis/game-battle-scene-v1/test-results.json)、[TCP](../analysis/game-battle-scene-v1/network-validation.json)、[验收](../analysis/game-battle-scene-v1/validation.json)、[目标审计](../analysis/game-battle-scene-v1/goal-audit.json)。

<a id="stage183"></a>

## stage183：四构建与35项生成包检查

新产物为build/wechat-app-stage183-final、wechat-app-local-stage183-final、wechat-app-resources-stage183-final及wechat-game-stage183-final。三App各131输入/11产物，API106输入/1bundle；499次输入和34个产物身份一致，external_imports均0。最终28neutral+7App/Page=35检查通过，含七条新增实际OS TCP/619回调的资源绑定与body反馈。

前三构建继续用`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage183-final`；local/resources分别带`--config build/analysis/game-legacy-scene-frame-v1/local-config.json`或`resources-config.json`及对应outdir。游戏API用`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage183-final`。检查入口：`node --test analysis/game-battle-body-v1/portable-test.mjs analysis/game-battle-body-v1/bundle-test.mjs`。

这些是登录器App/Page与游戏API产物；本轮没有原生游戏Page、开发者工具或设备验收。完整战斗/main10/渲染/输入/退出和现行/官方仍未完成。[验收](../analysis/game-battle-body-v1/validation.json)。

<a id="stage182"></a>

## stage182：四构建与28项生成包检查

新产物为build/wechat-app-stage182-final、wechat-app-local-stage182-final、wechat-app-resources-stage182-final和wechat-game-stage182-final。前三App各128输入/11产物，API103输入/1bundle，external_imports均0；487次输入身份和34个产物身份核验一致。21neutral+7App/Page共28项检查通过，新增生成API三条实际本地TCP调用命令/END/EOF。

复现前三构建分别运行`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage182-final`，以及加`--config build/analysis/game-legacy-scene-frame-v1/local-config.json`/`resources-config.json`并使用相应local/resources outdir；游戏API使用`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage182-final`。检查入口为`node --test analysis/game-battle-commands-v1/portable-test.mjs analysis/game-battle-commands-v1/bundle-test.mjs`。

这些是登录器App/Page及游戏API的本地产物，不是原生游戏Page/设备验证。完整战斗/其他玩法、开发者工具/设备与现行/官方兼容继续未完成。[验收](../analysis/game-battle-commands-v1/validation.json)。

<a id="stage181"></a>

## stage181：四构建与25项生成检查

build/wechat-app-stage181-final、wechat-app-local-stage181-final、wechat-app-resources-stage181-final与wechat-game-stage181-final已构建；三App各126输入11输出，API101输入，0external。18中立/7生成检查通过。App仍为登录器Page，M准备核心和模拟原生端口不构成微信游戏Page、设备、图像或官方接受证明；未启动IDE/上传发布。

[源证据](../analysis/game-battle-runtime-v1/source-check.json)、[规格](../analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](../analysis/game-battle-runtime-v1/test-results.json)、[TCP](../analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](../analysis/game-battle-runtime-v1/validation.json)、[完整目标](../analysis/game-battle-runtime-v1/goal-audit.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：四生成包与未完成的平台验收

新目录build/wechat-app-stage180-final、wechat-app-local-stage180-final、wechat-app-resources-stage180-final、wechat-game-stage180-final。三App各123输入11输出，游戏API98输入，均0external；16neutral/7生成检查通过。App仍为既有登录器Page；战斗记录核心构建不等于原生游戏Page或可玩。未启动IDE、未上传发布。

[源证据](../analysis/game-battle-transition-v1/source-check.json)、[规格](../analysis/game-battle-transition-v1/implementation-spec.json)、[测试](../analysis/game-battle-transition-v1/test-results.json)、[TCP](../analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](../analysis/game-battle-transition-v1/validation.json)、[完整目标](../analysis/game-battle-transition-v1/goal-audit.json)。

**阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：四构建和独立平台边界

新目录build/wechat-app-stage179-final、wechat-app-local-stage179-final、wechat-app-resources-stage179-final、wechat-game-stage179-final。三App各121输入11输出、API96输入、0external；14neutral/7生成检查通过。App仍为既有登录器Page，游戏API是同一源重构核心，原生游戏Page/Canvas/字体/调度/设备未完成。未启动IDE、未发布。

[源证据](../analysis/game-party-actions-v1/source-check.json)、[规格](../analysis/game-party-actions-v1/implementation-spec.json)、[测试](../analysis/game-party-actions-v1/test-results.json)、[TCP](../analysis/game-party-actions-v1/network-validation.json)、[验收](../analysis/game-party-actions-v1/validation.json)、[完整目标](../analysis/game-party-actions-v1/goal-audit.json)。

完整队伍控制/其他快捷键/modal、战斗/宠物/特效/复合转场、其余纠偏/输入/reset/生产启动/资源/玩法、微信原生gamePage和设备、现行及官方兼容仍未完成。无真实测试账号。完整目标active，本轮无VM/CUA/WER/CDB/原程序/账号/官方操作；stage131已执行恢复的诊断不重放。


<a id="stage178"></a>

## stage178：生成工程与队伍核心构建

最新四构建目录为build/wechat-app-stage178-final、wechat-app-local-stage178-final、wechat-app-resources-stage178-final、wechat-game-stage178-final。三App各120输入11输出，API95输入，均0external；12neutral/7生成检查通过。

App继续是既有登录器Page；普通队伍逻辑位于生成API。原生gamePage/Canvas/字体/调度/设备仍未实现，本轮未启动IDE、未发布。

[源证据](../analysis/game-party-follow-v1/source-check.json)、[合同](../analysis/game-party-follow-v1/implementation-spec.json)、[测试](../analysis/game-party-follow-v1/test-results.json)、[网络](../analysis/game-party-follow-v1/network-validation.json)、[验收](../analysis/game-party-follow-v1/validation.json)、[完整目标](../analysis/game-party-follow-v1/goal-audit.json)。

完整队伍UI/加入离开响应、aux04队长/模式图标、战斗/宠物影子/活跃复合转场、其他文字/UI与完整纠偏/输入/reset/生产启动/玩法、微信原生gamePage及设备、现行和官方兼容仍未完成；原生x87与非法重复身体/空指针行为未复现。完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage177"></a>

## stage177：当前构建与有限值条验收

当前构建为build/wechat-app-stage177-final、wechat-app-local-stage177-final、wechat-app-resources-stage177-final及wechat-game-stage177-final。三App119输入11输出，独立API94输入，均0external；精确命令、配置及输入/输出hash见[测试](../analysis/game-actor-vitals-v1/test-results.json)。

9neutral/7生成检查通过，实际API组合值条、E(9 / ]_g / HFs、原label/glyph端口和本机开关。生成App仍是既有登录器Page，没有原生游戏Page/Canvas/调度/字体设备实现，本轮未操作IDE或发布。

[源证据](../analysis/game-actor-vitals-v1/source-check.json)、[合同](../analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](../analysis/game-actor-vitals-v1/test-results.json)、[网络](../analysis/game-actor-vitals-v1/network-validation.json)、[验收](../analysis/game-actor-vitals-v1/validation.json)、[完整目标](../analysis/game-actor-vitals-v1/goal-audit.json)。

队伍跟随/本机输入上下文同步、aux04队长/模式图标、宠物影子及战斗条源、其他文字/UI、完整纠偏/输入/reset/生产启动与玩法、微信原生gamePage/设备、现行与官方兼容仍未完成。HFs已存状态尚未动态桥接f5f170/f536b2到现有显式输入上下文；完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage176"></a>

## stage176：新构建与文字端口验收边界

当前构建为build/wechat-app-stage176-final、wechat-app-local-stage176-final、wechat-app-resources-stage176-final及wechat-game-stage176-final。前三个118输入11输出，独立API93输入；0external。构建命令、原创配置路径和完整输入/输出hash见[测试回执](../analysis/game-actor-text-v1/test-results.json)。

8neutral/7生成检查通过；API包含源标签选择、48行Hr]、field28和显式rasterText端口。neutral文字流程用原创合成mask与微信形状OS socket核120帧，不是原生wx字体、Canvas或设备。完整游戏Page仍false，既有工程仍为登录器宿主；本轮未启动IDE、改服务安全选项、上传或发布。

[源证据](../analysis/game-actor-text-v1/source-check.json)、[合同](../analysis/game-actor-text-v1/implementation-spec.json)、[验收](../analysis/game-actor-text-v1/validation.json)、[测试](../analysis/game-actor-text-v1/test-results.json)、[网络](../analysis/game-actor-text-v1/network-validation.json)、[完整目标](../analysis/game-actor-text-v1/goal-audit.json)。

HP/队伍、其他文字通道/聊天/头顶气泡/aux04/菜单、完整本机纠偏/输入/reset/生产启动与中文语义、战斗及其余玩法、微信原生gamePage/设备、现行消费者和官方兼容仍未完成；整体goal active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage175"></a>

## stage175：本地生成工程状态

生成build/wechat-app-stage175-final、build/wechat-app-local-stage175-final、build/wechat-app-resources-stage175-final及build/wechat-game-stage175-final，App116输入/11输出、API91输入，0external。7生成工程检查和7neutral状态/历史回归通过；独立API含本阶段状态字/图标、实际源99门控和所有权实现。

这是本机产物与原始合成端口验证；没有原生game Page、AppID上传、真机或官方会话验收。[源证据](../analysis/game-actor-presentation-v1/source-check.json)、[合同](../analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](../analysis/game-actor-presentation-v1/validation.json)、[测试](../analysis/game-actor-presentation-v1/test-results.json)、[网络](../analysis/game-actor-presentation-v1/network-validation.json)。姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：当前生成工程与source60核心边界

当前App三构建位于build/wechat-app-stage174-final、wechat-app-local-stage174-final、wechat-app-resources-stage174-final，各115输入11输出；API为build/wechat-game-stage174-final，90输入，均0外部导入。既有tools/build-wechat-app.mjs --outdir/--config及tools/build-wechat-game.mjs --outdir继续适用，精确配置/命令/哈希见[测试](../analysis/game-actor-attachment-v1/test-results.json)。

7neutral/7生成检查通过，含540帧附属/AP/骑乘/旋转/释放的中性客户端；微信形状真实TCP另核对650帧。当前启动器Page仍不等于原生游戏gamePage，完整小程序游戏/设备、AppID/域名/上传发布和官方兼容未完成。


<a id="stage173"></a>

## stage173：当前生成项目与骑乘核心边界

三份当前App构建：build/wechat-app-stage173-final、wechat-app-local-stage173-final、wechat-app-resources-stage173-final；各114个源输入、11个输出、0外部导入。API构建build/wechat-game-stage173-final有89输入。使用既有tools/build-wechat-app.mjs的--outdir/--config和tools/build-wechat-game.mjs --outdir生成，精确配置/哈希见[测试记录](../analysis/game-actor-ride-v1/test-results.json)。

6neutral/7生成检查通过；共享实际70骑乘的110帧纯宿主场景及微信形状真实TCP的190帧均核对。生成启动器Page仍不是游戏gamePage；完整小程序游戏、原生设备、AppID/域名/发布/官方兼容未验收，没有上传或发布。


<a id="stage172"></a>
## stage172：包含源80回调的最终v2构建

`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage172-final-v2`产生88输入/0external独立API；5neutral覆盖实际包的完整400旋转帧、源等待、120混合帧、52移动及所有权。game_Page_implemented仍false。原生微信file/Canvas/scheduler和设备未验收。[当前输入/输出hash](../analysis/game-actor-spin-v1/test-results.json)。

`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage172-final-v2`及既有local/resources配置对应build/wechat-app-local-stage172-final-v2、build/wechat-app-resources-stage172-final-v2，各113输入/11输出/0external；7项实际生成App/Page检查通过。四份v2构建均在最终朝向修复后生成，早期候选不作为最终交付。完整原生宿主/玩法/current/官方仍在[后续目标](../analysis/game-actor-spin-v1/goal-audit.json)。


<a id="stage171"></a>
## stage171：包含实体来源与物件过滤的新构建

`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage171-final`产生87输入/0external游戏API，含逐实体标志、真实scene mode初始朝向与100键普通物件过滤。game_Page_implemented仍为false。4neutral检查实际bundle的启动/入场等待、原52帧移动、120混合帧及资源释放，不依赖DOM/Buffer/文字编码/网络/计时器全局。[测试与hash](../analysis/game-actor-context-v1/test-results.json)。

`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage171-final`及既有原创local/resources配置对应build/wechat-app-local-stage171-final、build/wechat-app-resources-stage171-final，各112输入/11输出/0external；7项实际生成App/Page回归通过。它们继续是既有登录器工程，未新增原生游戏Page或Canvas宿主。

初稿构造mode误接声音context已纠正，四份最终构建与全部中性/生成检查在修复后重跑。原生微信file/Canvas/scheduler、设备、完整玩法、当前版本及官方仍未验收。[后续目标](../analysis/game-actor-context-v1/goal-audit.json)。


<a id="stage170"></a>
## stage170：重新构建的共享初始化核心

`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage170`产生86输入/0external独立游戏API，包含源本机准备、保守入场等待与普通场景所有者重建；game_Page_implemented继续为false。3neutral检查真实bundle的等待边界、显式startup/context和实际资源/升级/入场/52帧/关闭链。

`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage170`及既有原创local/resources配置对应build/wechat-app-local-stage170、build/wechat-app-resources-stage170，各111输入/11输出/0external；7项实际生成App/Page回归通过。它们继续是既有登录器工程，未擅自登记native游戏Page或新增Canvas宿主。[构建输入/输出hash和回执](../analysis/game-local-bootstrap-v1/test-results.json)。

源角色/单位/地图逻辑已在shared和原创TCP/Chrome链核验，原生微信file/Canvas/scheduler、设备/current/完整游戏/官方仍未验收。下一步继续绑定实际上下文与生产文本/启动链后实现原生宿主。[后续目标](../analysis/game-local-bootstrap-v1/goal-audit.json)。


<a id="stage169"></a>
## stage169：共享client构建完成，原生游戏页待接入

`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage169`输出86输入/0external，同身份包含startup/context与owning client；native game_Page_implemented=false继续准确。2neutral验证实际资源/升级/入场/52帧/两移动和全拥有对象关闭，未使用浏览器或Node平台全局。

`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage169`及既有原创local/resources配置对应build/wechat-app-local-stage169、build/wechat-app-resources-stage169各111输入/11输出/0external；7实际生成App/Page回归通过。这些仍是既有登录器Page，未自动新增native游戏Canvas。web/game.html固定入口与7Chrome、7原创TCP、实际双目标WS和1220Node已通过。[构建/命令/hash](../analysis/game-browser-owner-v1/test-results.json)。

本轮无原生IDE/AppID/实体设备、VM/WER/CDB/原程序或官方操作。继续原生微信game Page/Canvas/file/scheduler与生产context/启动/编码，原始全游戏目标active/incomplete。[需求](../reports/development-plan.md#stage169)、[目标](../analysis/game-browser-owner-v1/goal-audit.json)。


<a id="stage168"></a>
## stage168：新API与三App重建

`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage168`得到84输入/0external，2neutral测试检查15296外观/1566升级/1128修正预览和实际升级/刷新/外观/field16/入场/关闭。它继续是独立API，game_Page_implemented=false，未实现native游戏Canvas/file scheduler或正式中文编码绑定。

`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage168`；沿既有原创local-config/resources-config分别加`--config build/analysis/game-legacy-scene-frame-v1/{local,resources}-config.json`输出到build/wechat-app-local-stage168、build/wechat-app-resources-stage168。三份各109输入11输出0external，7实际生成App/Page回归通过。完整Node1198、新增19、6原创TCP/5Chrome通过。[完整命令与hash](../analysis/game-character-options-v1/test-results.json)。

未操作native IDE/AppID/设备/正式域名或官方服务；既有WER不重放。原始全游戏目标active，正式game owner/page与运行上下文、native端/current/官方继续未完成。[需求](../reports/development-plan.md#stage168)、[目标](../analysis/game-character-options-v1/goal-audit.json)。


<a id="stage167"></a>
## stage167：创建API构建与现有App回归

`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage167`生成同身份游戏API，82输入/0external；2neutral覆盖8400外观/6000控制和实际bundle创建/刷新/入场/关闭。它仍不是正式游戏Page，不含浏览器DOM表单的native转换或游戏Canvas/file scheduler。

`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage167`及两既有原创配置的`build/wechat-app-local-stage167`、`build/wechat-app-resources-stage167`各107输入/11输出/0external。7实际生成App/Page回归、18新增/1179全Node、原创TCP和Chrome通过。[回执](../analysis/game-character-lifecycle-v1/test-results.json)。

本轮无native IDE/AppID/设备/正式域名设置或官方验收；不恢复已停工具分支，不重复索取账号/PDB。完整人物生命周期、game owner/page/current/官方继续active/incomplete。[需求](../reports/development-plan.md#stage167)、[目标](../analysis/game-character-lifecycle-v1/goal-audit.json)。


<a id="stage166"></a>
## stage166：人物核心API构建与现有App回归

游戏API：`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage166`，81输入/0external，包含同身份角色核心/可选会话；2neutral测试覆盖完整独立参考与实际bundle的auth/list/第二槽entry/关闭。尚未登记游戏Page，没有native Canvas/文件/调度宿主。

现有App：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage166`，另两原创配置输出`build/wechat-app-local-stage166`、`build/wechat-app-resources-stage166`；各106输入/11输出/0external。7项实际生成App/Page回归、28新增/1161全Node及本地原创TCP/真实浏览器选人场景链通过。[回执](../analysis/game-post-login-v1/test-results.json)。

本轮没有native IDE、AppID/域名/游戏Canvas/设备存储验收，完整/current/官方未完成。不恢复已停原生工具分支，不重复询问无账号/PDB；继续源人物生命周期和正式页面/所有者。[目标](../analysis/game-post-login-v1/goal-audit.json)、[需求](../reports/development-plan.md#stage166)。


<a id="stage165"></a>
## stage165：新增游戏API构建，现有App回归通过

独立游戏API：`node tools/build-wechat-game.mjs --outdir build/wechat-game-stage165`，产出同身份core/session入口，80输入/0外部导入。2项neutral包括实际bundle的WeChat形状端口登录；不依赖浏览器Abort/DOM/Buffer/URL全局。它尚未登记游戏Page，也没有正式游戏Canvas/资源/调度流程。

现有App可复现：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage165`。另两原创配置输出`build/wechat-app-local-stage165`、`build/wechat-app-resources-stage165`；每份105输入/11输出/0external，7项实际生成App/Page回归通过。1133完整Node/25新及浏览器/原创TCP链通过。[回执](../analysis/game-session-runtime-v1/test-results.json)。

原生IDE、AppID/域名、WXML/游戏Canvas/设备存储/文件、当前版本与官方可玩没有本轮验收；不恢复已停止的原生工具分支、不重复索取账号/PDB。完整后续见[目标审计](../analysis/game-session-runtime-v1/goal-audit.json)与[需求](../reports/development-plan.md#stage165)。


<a id="stage164"></a>
## stage164：新资源核心与本地工程

默认构建：node tools/build-wechat-app.mjs --outdir build/wechat-app-stage164。另两原创配置输出build/wechat-app-local-stage164、build/wechat-app-resources-stage164；各104输入/11输出/0外部导入，7生成App/Page回归通过。1108完整Node、21新增与2neutral通过。[测试与构建](../analysis/game-resource-runtime-v1/test-results.json)。

资源路径/图像范围读/缓存/数值场景计划已在shared独立实现；浏览器已用File.slice与异步Canvas验证，微信Page尚未接实际游戏Canvas/File/clock宿主。没有新增原生IDE、账号或官服动作；构建与原生/设备验收分开。完整登录页→游戏接线、微信游戏Canvas与原生文件/调度、真实runtime/record/UI上下文、动态LUT/命名调色板/效果、骑乘组队/primitive/小地图、战斗/其余业务及认证、现行与实际三端/官方可玩仍未完成。旧版37c4源码与当前安装资源能按格式组合验证，不构成9baa/6e2ff消费者或官方接受证明。

<a id="stage163"></a>
## stage163：新共享runtime与本地构建

复现默认工程：node tools/build-wechat-app.mjs --outdir build/wechat-app-stage163。另两原创配置工程为build/wechat-app-local-stage163和build/wechat-app-resources-stage163；各100输入/11输出/0外部导入，7生成App/Page回归通过。20新增/1087完整Node和2neutral通过；这些不是原生IDE/AppID/WXML/设备验收。[测试与构建](../analysis/game-input-runtime-v1/test-results.json)。

shared source input/clock/local/actor/map/scene已连接，web鼠标/触控Canvas已做各53像素摘要；微信Page尚未接实际游戏Canvas与native输入/调度，仍需真端绑定和验收。**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

完整资源与原生 runtime/record/UI 上下文绑定、右键交互、小地图/primitive/特殊角色/特效、战斗/其余业务及认证、现行版本、实际三端与官方可玩仍未完成。旧版37c4不等同9baa/6e2ff；本轮没有VM、WER、CDB、账号、官服或原生IDE新操作，也未重放已消费停止点。

<a id="stage162"></a>
## stage162：普通地图场景模块参与新工程构建

默认构建：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage162`；另两份原创配置输出build/wechat-app-local-stage162、build/wechat-app-resources-stage162。三个工程各97输入/11输出/0外部导入，7项实际生成App/Page回归通过。[测试与构建](../analysis/game-legacy-scene-frame-v1/test-results.json)。

shared具备源CUT、地形/静态与动画物件/实体合并和裁剪RGBA，1067完整Node与neutral52世界帧通过；生成工程界面仍未接实际游戏Canvas/input/frame clock/resource宿主。原生WXML/设备/AppID/域名、UI/小地图/特殊效果、战斗/认证、现行官方可玩未完成，无新增原生IDE/账号/官服动作。[验收](../reports/validation.md#stage162)。

<a id="stage161"></a>
## stage161：携带world实体帧核心的新工程

构建默认工程：`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage161`。另两份原创配置工程为build/wechat-app-local-stage161与build/wechat-app-resources-stage161。三者各96输入/11输出/0外部导入，7项实际生成App/Page回归通过。[构建与测试](../analysis/game-legacy-frame-v1/test-results.json)。

shared已连接wire动作、实体位移、动画缓存、源调度/深度与普通RGBA，完整Node1050、neutral52世界帧通过。生成工程尚未接完整游戏Canvas、地形物件、input/resource宿主；特殊角色/特效/战斗/认证、原生WXML/AppID/设备/域名及现行官方可玩未完成。本轮没有新增原生IDE、账号或官服动作。[验收](../reports/validation.md#stage161)。

<a id="stage160"></a>
## stage160：动画核心随工程的本地构建验收

可运行node tools/build-wechat-app.mjs --outdir build/wechat-app-stage160；另两原创配置工程位于build/wechat-app-local-stage160与build/wechat-app-resources-stage160。三者95输入/11输出/0外部导入，7实际生成App/Page回归通过。[测试](../analysis/game-legacy-animation-v1/test-results.json)。

shared source动画每helper调用计数、ordinary origin/flip与RGBA已实现，neutral1250状态/1235普通帧步通过；生成工程不代表自动actor/scene/input/frame/resource host或微信Canvas已接线。完整玩法/特效/auth、nativeWXML/AppID/设备/域名与现行官方接受仍未完成，无新增原生IDE/账号/官服动作。[验收](../reports/validation.md#stage160)。


<a id="stage159"></a>
## stage159：工程携带普通图像核心的本地检查

构建复现：node tools/build-wechat-app.mjs --outdir build/wechat-app-stage159。另两个原创配置工程位于build/wechat-app-local-stage159、build/wechat-app-resources-stage159；三者各94输入/11输出/0外部导入，7项实际生成App/Page回归通过。[测试回执](../analysis/game-legacy-render-v1/test-results.json)。

shared source RD/CGP/native32/普通RGBA frame已独立实现并通过neutral检查；生成工程不表示新增游戏Canvas/动画/输入时钟接线。实际游戏host/完整玩法/auth、native WXML/AppID/设备/域名与官方验收保持未完成；本轮没有新增原生IDE/账号/官服操作。[接口](../reports/module-interfaces.md#stage159)、[验收](../reports/validation.md#stage159)。


<a id="stage158"></a>
## stage158：碰撞与本机运动核心的新构建

shared新增真实碰撞元数据、原生路径和普通本机运动/等待/事件请求，world已组合，仍需实际游戏host和renderer；App/Page保留现有登录器/资源功能，不用无协议演示代替可玩验收。[接口](../reports/module-interfaces.md#stage158)。

新build/wechat-app-stage158、build/wechat-app-local-stage158、build/wechat-app-resources-stage158各93输入/11输出、0外部导入；984Node/2neutral/7生成工程通过。无原生IDE动作，完整scene/party/图形动画/战斗/auth、实际平台和现行官方可玩仍未完成。[验收](../reports/validation.md#stage158)。

<a id="stage157"></a>
## stage157：实体/移动核心与新构建

shared新增实体生命周期、普通远端插值/方向/投影/资源ID和源移动请求，world已组合；App/Page仍是已有登录器/资源流程，没有新增无协议依据的可玩演示。[接口](../reports/module-interfaces.md#stage157)、[合同](../analysis/game-legacy-actors-v1/implementation-spec.json)。

新build/wechat-app-stage157、build/wechat-app-local-stage157、build/wechat-app-resources-stage157各90输入/11输出、0外部导入；947Node/2neutral/7生成工程通过。未启动原生IDE；游戏host、本机路径预测/绘制/战斗/完整auth、实际平台和当前官服可玩仍未完成。[验收](../reports/validation.md#stage157)。

<a id="stage156"></a>
## stage156：world核心与新构建回归

shared新增场景自动准备缓存、标签和48掩码槽状态，App/Page仍是既有登录器/资源流程，没有把源槽投影当完整actor/场景渲染或官服可玩。[接口](../reports/module-interfaces.md#stage156)、[合同](../analysis/game-legacy-scene-v1/implementation-spec.json)。

新build/wechat-app-stage156、build/wechat-app-local-stage156、build/wechat-app-resources-stage156各87输入/11输出、0外部导入，7生成工程及914Node/2neutral通过。无原生IDE动作；实际网络/设备/host缓存/资源绘制/移动战斗/完整认证、当前及官方接受仍未完成。[验收](../reports/validation.md#stage156)。

<a id="stage155"></a>
## stage155：地图缓存核心与新工程回归

shared已实现源绑定地图缓存校验、补取描述符和区域更新；App/Page仍为既有登录器/资源流程，未将缓存投影当完整场景/角色/玩法。无原生IDE动作。[接口](../reports/module-interfaces.md#stage155)、[规格](../analysis/game-legacy-world-v1/implementation-spec.json)。

新`build/wechat-app-stage155`、`build/wechat-app-local-stage155`、`build/wechat-app-resources-stage155`各84输入/11输出、0外部导入，7生成工程与898Node/2neutral通过。实际设备/原生网络、缓存初始化/renderer/移动战斗、完整认证、当前与官方接受仍未完成。[验收](../reports/validation.md#stage155)。

<a id="stage154"></a>
## stage154：消息/协议核心与新构建

App/Page仍为既有登录器/资源候选流程，shared新增固定37c4的类型消息/ready状态/位置意图能力；未将本机协议流当完整游戏、actor或官方身份。没有原生IDE动作，旧停止点保持。[接口](../reports/module-interfaces.md#stage154)、[源规格](../analysis/game-legacy-message-v1/implementation-spec.json)。

新`build/wechat-app-stage154`、`build/wechat-app-local-stage154`、`build/wechat-app-resources-stage154`各83输入/11输出、0外部导入，7生成工程与883Node/2neutral通过。地图/renderer/移动战斗、完整认证、实际原生/设备调度/取消/网络与官方接受仍未完成。[回执](../analysis/game-legacy-message-v1/test-results.json)、[完整审计](../analysis/game-legacy-message-v1/goal-audit.json)。

<a id="stage153"></a>
## stage153：新正文核心及生成工程

新增shared固定37c4 payload/bootstrap字节能力；App/Page仍是既有登录器和资源候选流程，完整游戏控制/认证、业务与玩法未接。没有原生IDE动作，也没有把本机bootstrap tag当官方身份。[接口](../reports/module-interfaces.md#stage153)、[源规格](../analysis/game-legacy-transform-v1/implementation-spec.json)。

新`build/wechat-app-stage153`、`build/wechat-app-local-stage153`、`build/wechat-app-resources-stage153`各80输入/11输出、0外部导入；7生成工程回归及866Node/2neutral通过。同步8192轮的UI/取消/设备性能、原生网络/存储及官方可玩仍未验收。[测试](../analysis/game-legacy-transform-v1/test-results.json)、[完整目标审计](../analysis/game-legacy-transform-v1/goal-audit.json)。

<a id="stage152"></a>
## stage152：新旧版wire核心与新构建

`shared/legacy-game-envelope.mjs`提供固定37c4来源的编码与有界reader，payload未解释。既有App/Page仍为登录器和资源候选流程，没有把封包导出当游戏可玩。原生服务端口停止点保持，本轮只本机构建/检查。[接口](../reports/module-interfaces.md#stage152)、[规格](../analysis/game-legacy-network-v1/implementation-spec.json)。

新产物`build/wechat-app-stage152`、`build/wechat-app-local-stage152`、`build/wechat-app-resources-stage152`分别未配置/原创本地/资源配置；各71输入/11输出、0外部导入，7项生成工程回归通过。850Node/2neutral只验证本地能力；正文转换、认证、renderer/移动/战斗、原生平台和官方接受仍未完成。[测试回执](../analysis/game-legacy-network-v1/test-results.json)、[完整目标审计](../analysis/game-legacy-network-v1/goal-audit.json)。

<a id="stage151"></a>
## stage151：新增游戏源证据，微信接口与门槛保持

37c4旧版主游戏可读代码与首批消费者已源绑定；其分析标识不是现有launcher profile的别名，不能把Win32映射或旧版字段直接加入微信当前认证流程。本轮未改微信/App/Page/shared产品代码，也未生成新工程。[REA与源字节核对](../analysis/game-release-current-v1/source-check.json)、[首批静态合同](../analysis/game-release-current-v1/static-contract.json)。

旧原生IDE服务关闭停止点未重试/改设置；实际AppID/设备/存储/renderer、官方认证和游戏可玩仍待验，stage150的838Node/2portable/7生成工程只是此前本机证据。继续由新游戏源合同推进实现。[验收](../reports/validation.md#stage151)、[完整目标审计](../analysis/game-release-current-v1/goal-audit.json)。

<a id="stage150"></a>
## stage150：共享结构模型与工程回归

新增无平台依赖的RD v1/v3结构解码导出，known mask只表示literal/repeat字节是否明确，不能直接当alpha；C/D/E进入候选palette的位置也保留未知。未增加微信页面/Canvas或游戏消息，资源缓存可保留原bytes并在显式调用核心时重新解码。[接口](../reports/module-interfaces.md#stage150)、[格式](../reports/resource-formats.md#stage150)。

三个stage150本地工程各70输入/11输出、0外部导入，7项实际生成工程JS与2项neutral检查通过；完整Node838。urlCheck和游客AppID占位保留，无上传/发布或原生IDE重试/设置修改；真实WXML、AppID、设备/renderer、官服和游戏可玩仍待验。[验收](../reports/validation.md#stage150)、[完整目标审计](../analysis/game-rd-runs-v1/goal-audit.json)。

<a id="stage149"></a>
## stage149：配置核心已可用，宿主设置UI尚未实现

shared新增Config.exe来源的默认/编码/有界读取，legacy显卡代码及开关只为配置声明，不能作手机图形后端选择或实际游戏效果。没有自动Config.dat读写或新增UI动作。三个build/wechat-app-*-stage149本地工程各69输入/11输出、0外部导入；829Node、3portable及7生成检查通过，实际原生/设备/游戏未验。[接口](../reports/module-interfaces.md#stage149)、[验收](../reports/validation.md#stage149)。

<a id="stage148"></a>
## stage148：资源保存与重开恢复

可选root `resourceCacheProfile: "my-resources"`（1..32字母/数字/_/-，需已有patch配置），默认关闭，不自动读写。选择游戏/区域/来源后检查本机资源缓存；匹配才可恢复为候选，再明确选择。保存要求已选择及检查过的revision。可配合catalogCacheProfile在重开后先恢复原始目录，再恢复资源，无需重选初始化文件或重下资源。

保存采用固定目录两完整记录和回读，写已发出后取消/隐藏会提示重新检查结果，禁止自动重试；清除按钮只清本页，文件保留。缓存资源视图标明未保存上次操作明细，不据此显示补丁已完成。[接口/边界](../reports/module-interfaces.md#stage148)。

`node tools/build-wechat-app.mjs --outdir build/wechat-app-stage148`生成默认本地工程；本轮三个工程各68输入/11输出、0外部导入。822Node/7生成检查含真实原创文件和新JS环境恢复后交换，实际WXML/AppID/域名/设备/存储/官服可玩仍未验，未重试既有服务门槛。[验收](../reports/validation.md#stage148)。

<a id="stage147"></a>
## stage147：当前补丁调用者与构建更新

资源准备端口固定当前c82调用者计划：备份路径引用/转义、明确applicationName及timer元数据；不增加平台配置项或实际进程执行。计划限规范ASCII盘符目录+单文件名，完整路径≤259B；Windows路径存在性、完整MBCS/非规范目录未验。[接口](../reports/module-interfaces.md#stage147)。

三个本地工程build/wechat-app-stage147、build/wechat-app-local-stage147、build/wechat-app-resources-stage147各65输入/11输出且0外部导入；802Node/5生成工程通过。原生WXML、AppID、设备、HTTPS/持久化和官方可玩仍未验，未重试服务关闭门槛。[验收](../reports/validation.md#stage147)。

<a id="stage146"></a>
## stage146：明确来源、ZIP基础资源与候选选择

已有配置可增加可选patch（省略/null关闭），必须有HTTP/缓存来源的raw目录才可准备；单纯JS XML文本没有原始身份字节，不能冒充此输入。下面只是格式示例，地址不可用，不是官方服务：

```json
{
  "directoryText": "C:\\Moli\\Client",
  "pathEncoding": "ascii",
  "patchSourceProfile": "configured-only",
  "routes": [{
    "source": {"address": "patch-source.invalid", "portText": "80"},
    "origin": "https://bridge.invalid",
    "id": "resources"
  }]
}
```

directoryText仅保留原Windows目录元数据/资源绑定，不是手机存储目标；pathEncoding为ascii/windows-936/utf-8。source profile为configured-only或固定puk3-195f3afd（额外原备用源），route1..2份且不重复，来源address/原portText须精确匹配所选声明；origin受既有HTTPS DNS/443 profile，id为1..32 ASCII字母数字_-。没有匹配route就不请求，不自动升级原HTTP或回退另一来源，桥接声明也不认证上游。[网络条件](../reports/network-portability.md#stage146)。

操作顺序为加载/恢复目录→选游戏/区域/分组→明确选资源来源→可选导入现有资源ZIP→准备候选→明确选择。source picker首项是占位，过滤后的显示index不能代替原sourceOrdinal。每个ZIP按既有64条/32MiB压缩与输出限制，只读stat/有界read；可重复导入非冲突批次，基础资源最终1024文件/64MiB。清除按钮只清本页内存，冲突不覆盖。清单缺base/忽略项按原语义计数，候选不等于安装更新成功。

目录/区域/分组/来源变化及隐藏释放资源、撤销选择，回来重建允许来源但不自动选；导入/准备清输入与文本确认，之后可按原流程重新填写。选择后copySelectedResources可复制既有资源v1/v2数据，仍unverified；本轮没有资源持久化、安装目录写入或EXE运行。[模块接口](../reports/module-interfaces.md#stage146)。

```sh
node tools/build-wechat-app.mjs --outdir build/wechat-app-stage146
node tools/build-wechat-app.mjs --config <local-config.json> --outdir build/wechat-app-configured
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

Node只读relay库支持固定routes和明确CORS，createLocalLauncherPatchRelay仅loopback；没有公网/TLS部署。实际微信还需可访问的已配置HTTPS、域名/AppID/JS/设备条件，不能访问桌面loopback便声称接通。三个本地工程64输入/11输出、643160/644418/644331B，0外部导入；792Node及5生成JS工程检查通过（真实本机原创ZIP、relay和原创登录对端），原生WXML/手机/官方与可玩游戏仍未验。[验收](../reports/validation.md#stage146)。

<a id="stage145"></a>
## stage145：明确检查、恢复和保存原始目录

在已有七字段/可选bootstrap配置中，可增加`"catalogCacheProfile": "launcher-local"`（1..32 ASCII字母数字_-）；省略或null关闭，不用账号命名或自动派生。构建仍校验配置，默认null没有任何启动读写。启用后三个入口分别执行：

- 检查：只读两个专用记录并验证，展示检查版本；不会自动恢复。
- 恢复：读入所检查且解码/兼容策略匹配的完整目录，清空输入/确认/区域选择，再明确选择。来源仍未验证。
- 保存：只允许HTTP/已恢复来源的实际raw字节及已检查revision；本地XML字符串没有原始字节则不可保存。写另一slot并回读确认，不运行或保存EXE。

数据仅在USER_DATA_PATH/moli-launcher-catalog-v1/profile.a.bin、profile.b.bin；不含账号、密码或会话，不改安装材料、其他profile或未知文件。再次HTTP刷新比较此前实际目录字节；失败不恢复旧可选目录。隐藏/取消清除输入与检查状态，已发出保存可能完成，需重新检查；不自动回滚/重试。没有原生回调时该JS上下文保留互斥，返回“仍有未完成操作”。同上下文检查/保存不是跨worker/进程原子性或断电保证。[完整接口](../reports/module-interfaces.md#stage145)、[记录格式](../reports/resource-formats.md#stage145)。

```sh
node tools/build-wechat-app.mjs --outdir build/wechat-app-stage145
node tools/build-wechat-app.mjs --config <local-config.json> --outdir build/wechat-app-configured
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

本轮默认/旧本地配置/原创HTTP+缓存工程各57输入/11输出，588157/589415/589126B，0外部导入；773Node及4生成工程检查通过，含真实本机原创测试文件在新JS环境恢复后与原创Python对端交换。实际设备存储/生命周期/配额/持久性、原生WXML/AppID/域名/官服与原游戏可玩均未验收，DevTools既有停止点没有重试；HTTP/裸IP、HTTPS与平台条件仍按[stage144](#stage144)。[验收](../reports/validation.md#stage145)。

<a id="stage144"></a>
## stage144：按本地字节加载已证初始化目录

仍支持下方stage143七字段本地XML配置，默认null不自动读文件/联网。新增可选bootstrap，配置字段如下；提供它时gameListXml/regionListXml可同时为null，混合null拒绝。以下地址只说明格式，不是可用服务或官方地址，不能直接用它验联机。

```json
{
  "allowedOrigins": ["https://example.invalid"],
  "endpoints": {
    "launcherDigest": "https://example.invalid/launcher-digest",
    "updateLocator": "https://example.invalid/update-locator",
    "catalogDigests": "https://example.invalid/catalog-marker",
    "gameList": "https://example.invalid/games",
    "regionList": "https://example.invalid/regions"
  },
  "encoding": "gb18030",
  "timeoutMs": 10000
}
```

bootstrap恰四own字段，endpoints恰上述五个；来源1..16，完整URL为HTTPS DNS/默认或443端口、ASCII URI/合法百分号，不接受用户信息/fragment/IP/HTTP。目录encoding为utf-8/gb18030，与旧textEncoding凭据编码分开。不能推导或代填现有官方HTTP/裸IP地址；真实服务的HTTPS/微信域名条件未解决时仍不能兼容访问。[网络条件](../reports/network-portability.md#stage144)。

点击“选择本地登录器并加载目录”后，使用者通过平台文件选择提供本地EXE的字节；程序仅stat/有界只读1..32MiB并核读后大小，不执行/写回，也不嵌入安装内容。选中文件阶段最长60秒，网络初始化按显式1..60000ms总期限；源摘要不同则下载校验候选并停止，不伪造摘要或在小程序运行EXE。目录成功后再显式选游戏/区域/分组、填写输入、逐页确认和会话；刷新/取消/隐藏撤销输入与确认，未完成/失败不恢复旧目录。目录原始缓存对目前为null，未实现持久缓存。

实际SDK须≥3.2.2，平台为ios/android/devtools；其他平台在选文件前拒绝。GET使用arraybuffer/手动重定向/有界分块，仍受微信正常域名、证书、配额和JS能力限制。choose/FS API没有abort，hide/cancel只停止后续逻辑并忽略迟到，不能保证关闭原生选择器；选择器是否触发App/Page hide及真机流程尚未验收。

```sh
node tools/build-wechat-app.mjs --outdir build/wechat-app-stage144
node tools/build-wechat-app.mjs --config <local-config.json> --outdir build/wechat-app-configured
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

构建继续保留urlCheck=true与未验收的游客AppID占位，不上传/发布。本轮空配置/原创本地/原创HTTP三个工程各54输入/11输出、564798/566056/565734B且0外部导入；751Node及4生成工程JS检查通过，后者用原创API形状/本机服务，无DOM的App/Page/CJS可走完整目录到独立Python交换。已有IDE服务关闭门槛保留，本轮原生尝试0，没有真实WXML/编译/设备/TLS/官方账号或可玩游戏证明。[测试](../analysis/launcher-wechat-bootstrap-v1/test-results.json)、[验收](../reports/validation.md#stage144)。

<a id="stage143"></a>
## stage143：目录、阅读、会话和候选接线

本目录是原创建源文件。控制器在`adapters/wechat/launcher-host.mjs`，复用既有目录/分组选择、显式文本编码、四页阅读和current登录flow；不包含游戏玩法或官方资源。将新生成的工程导入开发者工具，不直接导入这个源码目录。

```sh
node tools/build-wechat-app.mjs
# 明确提供本地配置，输出到另一目录：
node tools/build-wechat-app.mjs --config <configuration.json> --outdir build/wechat-app-configured
```

默认生成`build/wechat-app`，配置为null，不选择目标、读取账号或连接网络。project.config使用本地游客占位`touristappid`，并保持urlCheck=true；它不是实际AppID或可发布证明，本轮尚未验证当前工具是否接受该占位。构建器沿用项目build内esbuild0.25.12；输出含CommonJS、原始App/Page/WXML/WXSS和linked legal notice，全部留本地build，不上传/发布。

配置JSON仅接受以下字段：

| 字段 | 支持范围 |
| --- | --- |
| sourceProfile | 固定win32-current |
| gameListXml / regionListXml | 明确提供、非空的已解码XML字符串，各≤1048576字符；不是原字节/编码认证 |
| allowBareAmpersands | 明确布尔值，沿用现有XML兼容政策 |
| allowedEndpoints | 1..10个明确address/port；所选区域所有BIP均须匹配；实际连接还受stage142平台profile限制 |
| textEncoding | ascii、windows-936或utf-8，显式选择，不推测系统代码页 |
| textPages | 四份明确提供的非空文本，每份≤65536字符；也可null，此时不允许开始阅读/会话 |

不在配置中加入账号、密码、AppSecret、票据或其他字段。官方解包内容和完整条款不得加入成果；本地明确选择的私有配置只进入build。该配置不自动授权来源或建立发布者信任。

页面先明确选择游戏/区域；需要分组时保持过滤后的原source ordinal。关闭、缺失、同名歧义或未允许目标不能进入会话。输入按配置编码限1..16字节；逐页查看四份已提供文本后才能确认，输入或目标变化会撤销确认。确认仅当前内存有效，不写许可记录，也不代替官方协议的实际接受。

账号和密码不放入Page.data/setData、日志或存储。提交/取消/隐藏/卸载会替换输入控件并清空私有输入；App和Page的隐藏均取消活动会话，generation防止迟到结果恢复页面。候选排序/选择门槛沿用核心，标签按明确编码严格解码；不能解码时显示中性编号。选择后仍显示游戏交接未完成，不生成假游戏入口。

本地验证命令：

```sh
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
# 工程专项使用原创夹具配置；准备方式见测试文件与验收记录。
node --test analysis/launcher-wechat-host-v1/bundle-test.mjs
```

719项Node及2项生成工程专项通过；专项在无DOM VM里用Node提供wx API形状、固定本机原创Python对端，不是微信原生渲染。已用官方miniprogram-automator0.13.0/现有公开CLI尝试`build/wechat-app-fixture`，明确返回服务端口关闭，0连接/0渲染检查/0截图。项目规则禁止修改工具安全配置，未重试同请求、开启端口、传登录票据、信任标志或借用其他AppID。[操作记录](../reports/known-issues.md#stage143-wechat-cli)、[实际回执](../analysis/launcher-wechat-host-v1/native-ui-audit.json)。

后续仍需真正开发者工具/手机的WXML渲染、域名/JS能力/生命周期与账号验收，微信HTTP/目录更新/资源流程，以及原游戏业务消费者和可玩实现。[接口](../reports/module-interfaces.md#stage143)、[测试与构建](../analysis/launcher-wechat-host-v1/test-results.json)、[完整目标](../analysis/launcher-wechat-host-v1/goal-audit.json)。
