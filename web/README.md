<a id="stage306-work-context"></a>

## stage306 技能等级中的精灵变身和直接请求

进入场景点“生产技能”，选择技能后，在资料与剩余时间满足条件时可于等级界面“进行／解除精灵变身”。选择制造等级后，如需重查则等待当前配方；配方页可“返回技能等级”。启用状态显示剩余秒数，工作耗时及修理／鉴定的物品条件由共享核心处理。[接口](../reports/module-interfaces.md#stage306-work-context)

收到的type5技能选择等级后直接发请求，界面保留等级并显示“等待角色状态同步”，不提前显示成功或扣魔力。桌面键盘／鼠标与390×844触屏各完成34请求的新实际资源流程，并各保留制造13、物品工作26、目标／采集37请求；没有控制台错误／警告和横向溢出。[验收](../reports/validation.md#stage306-work-context)

范围是固定旧版已证上下文0／1及表内tier，不是实际手机或官方服务器验收。

<a id="stage305-work-targets"></a>

## stage305 网页两级目标和连续采集

点“生产技能”，选择变装／变身／急救／治疗和可用等级后等待角色列表，再点角色；需要二级目标时选择本人或宠物，选择即发送技能请求。明细显示等级、生命与魔力；可返回角色列表重查。结果显示恢复／恶化等实际模式信息，魔力不足时不能重试。[接口](../reports/module-interfaces.md#stage305-work-targets)

选择挖掘／打猎／伐木等级后进入连续工作；结果期间重启禁用，稍后检查魔力和背包再继续。可暂停、继续或关闭。桌面键盘／鼠标和 390×844 触屏实际验证每条新流程 37 请求，并各复测制造 13 与物品工作 26 请求；无错误／警告和横向溢出。[验收](../reports/validation.md#stage305-work-targets)

以上是固定旧版普通上下文 0 的本地功能；其他分支、完整原生工作表现、真实手机及官方接受仍待完成。

<a id="stage304-work-actions"></a>

## stage304 网页普通工作与刻印操作

进入场景点“生产技能”，选择技能及可用等级。武器／防具修理和鉴定选择可用物品后开始；刻印选择物品、输入并“确认刻印文字”后开始，编码后最多 16 字节；已有刻印可确认空文字清除。装饰在六位中选择一件基材和一件附加品，满足条件后开始。[接口](../reports/module-interfaces.md#stage304-work-actions)

状态、魔力检查、结果、重试与关闭共用共享核心；长内容在面板内滚动，标题和关闭操作保持可见。实际 1,072 文件 ZIP 的桌面键盘／鼠标及 390×844 触屏各核对 26 请求，另各复测旧制造 13 请求，无页面错误／警告或横向溢出。[验收](../reports/validation.md#stage304-work-actions)

范围仍是固定旧版普通上下文 0；其余普通技能、非零上下文、完整原生工作动画、真实手机和官方接受待完成。装饰不等于完整合成系统。

<a id="stage303-craft-input"></a>

## stage303 网页制造操作与本地验证

进入场景后点“制造”，选择技能、可用等级与配方；先选材料位，再点背包材料，材料齐全且魔力足够后开始。面板显示计时、等待结果、成功／失败、经验／升级／属性／受伤；可再次制造或关闭。网页与移动网页共享普通制造核心，长内容在面板内滚动，标题与关闭按钮始终保留。[规格](../reports/module-interfaces.md#stage303-craft-input)

用实际 1,072 文件 ZIP 与原创本地服务，桌面键盘／鼠标及 390×844 触屏均验证成功、失败、MP 不足和取消；各核对 13 请求，无页面错误／警告或横向溢出。资源只读，背包和 MP 沿服务器数据更新。[验收](../reports/validation.md#stage303-craft-input)

目前为固定旧版普通上下文 0，未覆盖修理／合成／非零上下文或完整原生工作动画；不代表真实手机和官方接受。

<a id="stage302-craft-recipes"></a>

## stage302 共享配方接收与后续制造界面

网页使用的共享客户端已支持既有工艺查询回复、56×5 配方状态及 copyPlayerCraftRecipes(slot) 只读访问；删除技能执行源部分重置。配方选择、材料分配、提交和结果界面尚未接入，本轮没有新增网页交互或截图。[接口](../reports/module-interfaces.md#stage302-craft-recipes)

源码／生成 API 的完整状态与客户端回路已验证，完整回归 3,744 项通过。实际浏览器／手机与完整制造玩法仍待验；既有页面验收保持原证据层。[结果](../reports/validation.md#stage302-craft-recipes)

<a id="stage301-battle-item-dispatch"></a>

## stage301 ITM 来源复核，网页保持当前版本

本轮确认旧版 ITM 只有 0／6／7 效果分支，不新增无来源的道具效果。网页运行代码和界面保持 stage300；本轮没有新的网页产品流程或截图，既有前端验收按原回执查看。[来源](../analysis/game-battle-item-variants-v1/source-check.json) · [本轮验证](../reports/validation.md#stage301-battle-item-dispatch)

源码及既有生成 API 的道具相关检查各 63 项通过。下一步继续工艺配方、普通上下文与其他游戏消费者，真实手机和完整游戏接受仍单列。

<a id="stage300-city-water"></a>

## stage300 回城等待期间继续绘制

等待回城回复时现在继续使用普通地图帧；服务器改变场景后按来源清除或保留角色，地图捕获后再推进外层水面相位与位置。原角色资料未到时保持等待。五种回城路径各覆盖桌面1100×850和触屏模拟390×844，同一连接恢复移动；10流无error／warning／页面异常。[验收](../reports/validation.md#stage300-city-water)

实际素材未改，原创地图／对端与截图位于本机分析环境，46份图在/tmp/moli-stage300-qa。Browser插件未提供，当前采用Playwright1.64.1／Chrome；手机尺寸为触屏模拟，真机和官方接受仍待验收。[范围](../analysis/game-city-water-v1/goal-audit.json)

<a id="stage299-battle-water"></a>

## stage299 战斗水面进入网页与触屏流程

共享战斗现接受特殊图形，按来源处理首次背景捕获和后续缓存复制；回场地图捕获与相位／位置按原顺序运行。原创地图40000／59000用实际特殊背景5000和角色100010，各完成桌面1100×850、触屏模拟390×844的入场、防御、结算、退出与两次移动。四条浏览器流error／warning／页面异常均0，20份截图留/tmp/moli-stage299-qa。[验收](../reports/validation.md#stage299-battle-water)

运行复用既有本机原创对端和实际资源ZIP；prepare-product.mjs见analysis/game-battle-water-v1。Browser插件未提供，当前采用Playwright1.64.1／Chrome。手机尺寸为触屏模拟，真实手机、完整玩法和官方接受继续单列。[范围](../analysis/game-battle-water-v1/goal-audit.json)

<a id="stage298-ordinary-water"></a>

## stage298 普通水面进入网页与触屏模拟

普通world／runtime现将水面相位更新与呈现振幅分开；相同绘图计划的资源重试不回放状态。实际两个原创水面地图在桌面1100×850和触屏模拟390×844完成选人、战斗、退出、移动与断开，4条浏览器流无error／warning。截图在/tmp/moli-stage298-qa，实际图形不加入源码成果。[验收与复现](../reports/validation.md#stage298-ordinary-water)

原生缓存、固定临时面与较小视口策略、战斗特殊队列、完整原场景和物理手机仍待验；目标范围保持。

<a id="stage297-body-draw-flags"></a>

## stage297 共享身体开关与实际素材回归

共享身体回调接通164／165绘图覆盖开关，保持原动画和颜色。没有新增网页事件或协议字段，正常协议生产者仍待确认；消费者由32组原创队列和160完整帧验证。

实际CUT59510／59526的桌面与触屏模拟共4条回归完成防御、结果、退出和移动。截图放stage297目录，历史证据保留；真实手机和完整游戏继续验收。[结果与命令](../reports/validation.md#stage297-body-draw-flags)

<a id="stage296-actual-battle-product"></a>

## stage296 实际素材的入场、战斗与回场

以未修改的实际ZIP和显式资源参数，在CUT59510／59526上各完成桌面及触屏模拟，共4条产品流程。原角色动作／信号和640×480实际背景经共享实现消费，防御、SKL106数值、回合、退出和继续移动通过；网页运行时代码保持stage295状态。

页面身份、首屏、错误遮罩和控制台检查通过，截图为实际素材加原创地图／战斗配置。完整原场景和真实手机继续验收。[结果与复现](../reports/validation.md#stage296-actual-battle-product)

<a id="stage295-battle-draw-style"></a>

## stage295 战斗颜色、透明与加色

游戏页通过共享最终样式消费原动画ARGB、命名编号、对象颜色覆盖和ghost半透明。原创普通透明／加色两组桌面与触屏模拟共4条流程通过，完成技能、回合与数值、退出和回场移动，无新会话字段。

页面身份、首屏、按钮和console验证通过；截图为原创测试素材，实际材料另做672份完整帧比较。完整原场景／特殊图形和真实设备继续验收。[QA与复现](../reports/validation.md#stage295-battle-draw-style)

<a id="stage294-vertex-color"></a>

## stage294 普通动画颜色与透明度

游戏页复用共享ARGB合成，实际CUT59510透明物件与CUT59526带alpha加色物件均已进入本机流程。命名颜色、文字前后层、小地图、移动和场景重建一起验证，没有新增页面参数或会话命令。

桌面与触屏模拟共4条流程通过，完整像素另由独立112帧材料比较证明。12×12布局为原创，完整原版地图、战斗样式和真实设备仍待验证。[QA与复现](../reports/validation.md#stage294-vertex-color)

<a id="stage293-additive-render"></a>

## stage293 加色动画显示

真实CUT59663／动画113685的加色效果已通过已有游戏页显示，使用本次资源ZIP中的命名颜色和地面。小地图、移动、切图及断开继续工作，没有新增页面参数或会话命令。

桌面和触屏模拟完成本机流程，已查看关闭小地图后的发光物件截图。ONE+ONE以共享软件帧缓冲实现，原生驱动精度、其他样式及完整官方地图仍未验收。[QA、命令与截图](../reports/validation.md#stage293-additive-render)

<a id="stage292-animation-named-palette"></a>

## stage292 实际非零调色板地图动画

网页范围资源库已支持固定历史配置的命名调色板，59529物件1116／动画113058／编号320通过实际材料流程。原编号选择内嵌BGR载体后绘制，不需新增页面配置；小地图显隐与三档范围继续通过。

桌面和触屏模拟各完成7请求／2移动的原创本机流程，并补看关闭小地图后的动画物件。标志8、其他动画上下文和完整素材版本仍保留边界；当前内容不是完整官方地图。[QA、复现和截图](../reports/validation.md#stage292-animation-named-palette)

<a id="stage291-legacy-minimap"></a>

## stage291 小地图显隐和范围

进入场景后使用“小地图”按钮显示，再点“关闭小地图”隐藏；“范围”在54／27／107格间切换。资源来自本次所选材料，模式1需要实际选择器对应的AUT，普通模式按原CGP及最终图形槽生成颜色。加载或缺材料会显示相应状态。[接口](../reports/module-interfaces.md#stage291-legacy-minimap)

实际材料的两种地图模式均通过桌面和触屏模拟网页的显隐、三档范围、移动与场景重建。仍使用原创本机对端和显式启动材料，不是完整官方地图；非零调色板动画仍有失败边界。[完整QA、命令和截图](../reports/validation.md#stage291-legacy-minimap)

<a id="stage290-legacy-material-compat"></a>

## stage290 网页实际素材的场景验收

现有游戏页已使用实际资源ZIP完成显示人物、地面和物件，鼠标／触屏输入后移动并重建场景。启动材料明确提供文件版本参数；本轮所选27个文件与参数记录在[材料配置](../analysis/game-legacy-material-compat-v1/material-profile.json)。这组配置只适用于本轮材料，不自动判断其他资源包的最新版本。

桌面1100×850与触屏模拟390×844均完成原创本机对端的7请求／2移动流程，控制台和页面错误0，截图已检查。模式0场景通过；模式1请求的CUT23在当前材料中缺失，另有失败验收。实际手机、完整地图和官方对端仍未验。[完整QA、命令与截图位置](../reports/validation.md#stage290-legacy-material-compat)

<a id="stage289-legacy-resource-archive"></a>

## stage289 选择大型资源ZIP

游戏页可选择游戏根文件夹或一个资源ZIP，选择其中一个会清空另一项。随后选择本机启动JSON并准备连接；v2启动材料会从同一个资源所有者读取固定模块和可选Config.dat。ZIP只建立目录索引，图形／音频按需读取，断开或离开后需重新选择。[接口](../reports/module-interfaces.md#stage289-legacy-resource-archive)

从仓库根目录生成适合大型图形库随机读取的资源包：

```sh
python3 tools/pack-game-resources.py --root /path/to/game-root --output /path/to/new-resources.zip --receipt /path/to/pack-receipt.json
```

ZIP及回执需放在输入根目录之外，各自使用不同的新文件名。根目录可包含 `cg_se_6000.exe` 和Bin；唯一外层包装目录可自动识别。存储型包按范围直接读取，大Deflate条目每次冷读取仍需扫描完整内容。原文件保持只读，资源内容不随网页成果分发。[格式](../reports/resource-formats.md#stage289-legacy-resource-archive)

实际Chromium桌面／触屏模拟验证三种约2.55GB原创ZIP场景及旧文件夹流程；非空、标题、选择、战斗后移动和控制台通过。Browser插件不可用，使用已有Playwright；截图及环境见[验收](../reports/validation.md#stage289-legacy-resource-archive)。实际手机与资源版本兼容尚未验收。

<a id="stage288-legacy-battle-audio"></a>

## stage288 网页战斗音效

战斗身体、动画和菜单音效现从本次选择目录的WAV读取，沿用启动材料的音效开关。位置音效保持原单侧衰减；静音、缺文件或输出不可用不改变回合。音频宿主与页面一起关闭，不播放已暂停或过期读取的声音。[接口](../reports/module-interfaces.md#stage288-legacy-battle-audio)

桌面及触屏模拟Chromium各验证有声／静音一次，使用实际AudioContext节点及原创PCM标记；两种模式均结算并恢复移动。没有物理手机或听感验收。[记录](../reports/validation.md#stage288-legacy-battle-audio)

<a id="stage287-legacy-battle-detached-rid"></a>

## stage287 网页106 RID流程

带2000的106 RID分别以自然结束和原等待恢复两种记录，经实际桌面Chromium与移动触摸仿真完成本机TCP入场、回合1、退出及后续移动，共4条流程。核对HP／MP与等待中的保活请求。[规格](../reports/logic-protocol-spec.md#stage287-legacy-battle-detached-rid)

上述为本机浏览器证据；真实物理手机、现行客户端与完整游戏继续验收。[验收](../reports/validation.md#stage287-legacy-battle-detached-rid)

<a id="stage286-legacy-battle-impact-skills"></a>

## stage286 网页五类冲击技能路径

五类SKL4／97／106／111／116各经桌面与移动网页测试主机完成本机TCP入场、技能结算、回合1、退出与后续两次移动，共10条流程。施法者HP70／MP5，目标HP58；箭矢、火花、分身及抛物投射由共享核心处理。[规格](../reports/logic-protocol-spec.md#stage286-legacy-battle-impact-skills)

网页测试主机、真实浏览器与物理手机证据分别记录；完整玩法及未覆盖上下文继续验收。[验收](../reports/validation.md#stage286-legacy-battle-impact-skills)

<a id="stage285-legacy-battle-upper-skills"></a>

## stage285 网页上位技能路径

六类上位技能各经桌面与移动网页完成本机TCP入场、回合、退出与移动，共12条流程。108数值恢复、112目标离场、114图标及其余限定回调均由共享核心处理；网页运行层未新增专用实现。[规格](../reports/logic-protocol-spec.md#stage285-legacy-battle-upper-skills)

107原版成功提示文本、剩余玩法和真实手机仍待验收。[验收](../reports/validation.md#stage285-legacy-battle-upper-skills)

<a id="stage284-legacy-battle-skill99"></a>

## stage284 网页状态技能与持续图标

SKL99–104进入共享状态路径。99类、104类和既有图标场景各经桌面／移动网页运行，共六条本机TCP流程；核对HP70、MP5、回合1、退出与继续移动。[规格](../reports/logic-protocol-spec.md#stage284-legacy-battle-skill99)

网页运行代码未改。完整状态／RGBA和声音事件另有共享核心证据，真实手机及完整玩法仍待验收。[验收](../reports/validation.md#stage284-legacy-battle-skill99)

<a id="stage283-legacy-battle-self-flags"></a>

## stage283 网页自身结果字与局部反应

正常命中、局部反应、不透明位反射组合各在桌面／移动网页运行，共六条本地TCP流程。核对HP58／70／58、MP5、回合1、退出和移动；需要恢复的场景保留原时限与心跳。[规格](../reports/logic-protocol-spec.md#stage283-legacy-battle-self-flags)

网页运行代码未改，共享规划器保留完整结果字并修复瓦片第四格。真实手机与完整玩法继续验收。[验收](../reports/validation.md#stage283-legacy-battle-self-flags)

<a id="stage282-legacy-battle-self-guard"></a>

## stage282 网页自身护卫与角色重合

普通自身护卫、三个角色同体和带蓄力的自身护卫，在桌面／移动网页各运行一次，共六条本地TCP流程。核对真实等待与心跳、回合1、HP70／MP5、退出和移动；网页运行代码未改。[规格](../reports/logic-protocol-spec.md#stage282-legacy-battle-self-guard)

独立队列／回调／RGBA和源码／生成完整回调另有证据，真实手机与完整玩法继续验收。[验收](../reports/validation.md#stage282-legacy-battle-self-guard)

<a id="stage281-legacy-battle-self-metadata"></a>

## stage281 网页自身元数据

消息反射、RID资源反射和状态清除在桌面／移动网页各完成一次，共六条本地TCP流程，核对数值、回合、退出与移动。网页产品文件未改，复用共享规划与既有消费者。[规格](../reports/logic-protocol-spec.md#stage281-legacy-battle-self-metadata)

67种核心源码／生成回放另检查资源、消息、状态和动画信号；真实手机与完整玩法继续验收。[验收](../reports/validation.md#stage281-legacy-battle-self-metadata)

<a id="stage280-legacy-battle-reentry"></a>

## stage280 网页连续两场战斗

三种首场各在桌面／移动网页完成第二场，共六条本地 TCP 流程。核对代次1→2、不同角色与数值、回合重置、第二场伤害／费用、再次退出及移动，复用原连接。[规格](../reports/logic-protocol-spec.md#stage280-legacy-battle-reentry)

产品代码未改，测试按实际摄像机与到达时机计算第二段移动字节。手机真机、现行交接和完整玩法继续验收。[验收](../reports/validation.md#stage280-legacy-battle-reentry)

<a id="stage279-legacy-battle-self-control"></a>

## stage279 网页自身控制与自动回场

三种新增自身控制场景分别在桌面和移动网页运行，共六条本地 TCP 流程。蓄力保持原等待时钟，蓄力后反射自然结束，主控散开由动作244主动退出；测试先接收退出请求，再结束观察并验证回场移动。网页产品文件未改。[规格](../reports/logic-protocol-spec.md#stage279-legacy-battle-self-control)

161 种源码／生成核心回放及同一组件的新回合已验证；产品第二场与手机真机尚未验收。[验收](../reports/validation.md#stage279-legacy-battle-self-control)

<a id="stage278-legacy-battle-self-special"></a>

## stage278 自身特殊结果进入网页收包路径

共享核心现可执行普通自身反射、治疗及结果优先顺序。三种新增场景分别在桌面和移动网页走实际本地 TCP 收包、回合 1、费用、退出及恢复移动，共六条；反射自然结束，另两类沿用正常等待恢复。网页产品文件未改。[规格](../reports/logic-protocol-spec.md#stage278-legacy-battle-self-special)

161 种核心源码／生成回放与全量测试通过，后续命中和 81 类额外治疗由共享所有者执行。本地证据不代表手机真机或完整玩法完成。[验收](../reports/validation.md#stage278-legacy-battle-self-special)

<a id="stage277-legacy-battle-self-family"></a>

## stage277 普通自身家族进入网页收包路径

网页通过共享核心获得 20 类基础自身记录支持。新增类别 5 首条`0x4` 标志位、类别 6／84 先他后己场景，各在桌面和移动网页走实际本地 TCP 收包、绘制、回合 1、费用、退出及移动，共六条；未改变网页产品文件。[规格](../reports/logic-protocol-spec.md#stage277-legacy-battle-self-family)

32 种核心回放及全量测试通过，长自身场景仍由原有等待恢复。网页本地证据不代表手机真机或完整玩法完成。[验收](../reports/validation.md#stage277-legacy-battle-self-family)

# 浏览器登录器与资源核验台

<a id="stage276-legacy-battle-self-pair"></a>

## stage276 网页接收普通自身结果

纯自身与先他后自两种物理记录均通过桌面／移动网页本地 TCP。各流程检查回合计数1、血量／费用、退出及地图移动，每条13个请求含4个心跳，最终自身HP58、MP5。原有Web回合断言保留，产品网页文件未改。[验收](../reports/validation.md#stage276-legacy-battle-self-pair)

<a id="stage275-legacy-battle-weather-targets"></a>

## stage275 重复天气目标经过完整地图入口

先普通后效果、两次带效果两种 SKL401 记录均通过桌面／移动网页本地 TCP。前者自然完成，后者保留真实等待恢复；每条均核对 guard、CFP、退出及同连接移动。请求分别为 9 个和含 4 个心跳的 13 个。网页产品文件未改。[验收](../reports/validation.md#stage275-legacy-battle-weather-targets)

<a id="stage274-legacy-battle-pursuit-linked"></a>

## stage274 联动结果经过真实等待返回地图

SKL400 联动 M 记录已通过桌面和移动网页本地 TCP 入口。各流程完成现有等待恢复、回合、CFP 扣费、退出及同连接移动；各核对 4 个心跳和合计 13 个请求，最终施法者 HP 70、MP 5，目标 HP 70。网页产品文件未改。[验收](../reports/validation.md#stage274-legacy-battle-pursuit-linked)

<a id="stage273-legacy-battle-pursuit-targets"></a>

## stage273 重复目标的追踪效果

普通和提示两种 SKL400 重复目标 M 记录已通过桌面／移动网页的本地 TCP 入口。各流程完成一回合、后续 MP 扣费、退出及同连接移动；最终施法者 HP 70、MP 5，目标 HP 70。网页产品文件未改。[验收](../reports/validation.md#stage273-legacy-battle-pursuit-targets)

<a id="stage272-legacy-battle-round-ack"></a>

## stage272 下一回合切换操作席位

网页桌面和移动视口通过本地 TCP 提前接收 P/A/C/M、将当前操作席位从 0 切换到 5、完成第二回合并在同一连接退出后移动。第二回合操作槽 5 的 MP 9→8，槽 0 保持 MP 9。共享 A 接收器也修正了 RID0 新登记槽的标记结果漏报。[验收](../reports/validation.md#stage272-legacy-battle-round-ack)

<a id="stage271-legacy-battle-character-queue"></a>

## stage271 施法执行期间提前接收下一回合

桌面和移动视口通过本地 TCP 的提前 C/A/M：下一回合角色更新后只保留槽 0、2，两者 HP 90、MP 9；第二回合槽 0 再扣 1 点 MP，随后退出并在同一连接移动。每条流程核对 10 个客户端请求。网页运行代码未改。[验收](../reports/validation.md#stage271-legacy-battle-character-queue)

<a id="stage270-legacy-battle-exit-rid0"></a>

## stage270 本地骑乘角色的致死退出

桌面和移动视口已通过两次骑乘待机、致死反射自动退出及同连接移动。该退出保持回合计数为 0。B 占用远端施法槽的路径完成一回合后再退出，最终 A 为 HP 41、MP 8。[验收](../reports/validation.md#stage270-legacy-battle-exit-rid0)

<a id="stage269-legacy-battle-reflected-rid0"></a>

## stage269 反射卸载后的角色交接

桌面和移动视口的本地 TCP 路径已覆盖远端槽 2 的内联反射回程与尾随 RID0。最终为 `AfterCast`、HP 41、MP 6，反射者槽 10 HP 70，槽 0 HP 70、MP 10，退出战斗后同连接恢复移动。真机与官服待验收。[验收](../reports/validation.md#stage269-legacy-battle-reflected-rid0)

<a id="stage268-legacy-battle-casting-rid0"></a>

## stage268 远端施法后的交接与移动

桌面和移动视口 Chrome 的本地 TCP 路径中，远端槽 2 完成 SKL19 后由 RID0 登记为 `AfterCast`，最终 HP 41、MP 6。目标槽 10 HP 从 70 变为 58，槽 0 数值保持初值，退出战斗后同一连接恢复移动。手机真机与官服待验收。[验收](../reports/validation.md#stage268-legacy-battle-casting-rid0)

<a id="stage267-legacy-battle-rid0-flight"></a>

## stage267 网页的多帧同槽 RID0

桌面和移动视口 Chrome 各通过一条新增本地 TCP 路径。同槽下降后原 A 完成交接，HP 41、MP 8，战斗退出后在同一连接恢复移动。真机和下降中真实网络刷新待验收。[验收](../reports/validation.md#stage267-legacy-battle-rid0-flight)

<a id="stage266-legacy-battle-rid0-ownership"></a>

## stage266 网页共享核心的 RID0 回收

桌面网页与移动视口各通过四条既有 TCP 路径，验证交接后的数值、名称和同连接移动恢复。本阶段新增的首配、异槽 A 与中途离场用例由共享回调验证。真机与实际中途离场的网络时序待验收。[验收](../reports/validation.md#stage266-legacy-battle-rid0-ownership)

<a id="stage265-legacy-battle-rid0-interruption"></a>

## stage265 网页的中断交接

桌面和移动视口 Chrome 各验证两条本地 TCP 路径。后段目标或攻击者缺席时，远端骑乘角色完成 RID0，HP 为 41，单后继与双后继场景的 MP 分别为 8 和 6。本地角色与另一目标数值保持原值，首轮结束后同一连接恢复移动。手机真机待验收。[验收](../reports/validation.md#stage265-legacy-battle-rid0-interruption)

<a id="stage264-legacy-battle-rid0-receive"></a>

## stage264 网页的尾随 RID0 回合

桌面和移动视口 Chrome 各验证普通受击后分离、内联结果与尾随 RID0 共存、同槽交接三条本地 TCP 路径。测试核对交接后的名称、所有在场角色的 HP 和 MP、首轮结束以及同连接移动恢复。手机真机待验收。[验收](../reports/validation.md#stage264-legacy-battle-rid0-receive)

<a id="stage263-legacy-battle-following-results"></a>

## stage263 网页的后续物理结果

桌面和移动视口 Chrome 分别通过反射内联 RID、治疗内联 RID 后续击及免伤三条本地 TCP 路径。测试核对全部在场角色 HP、MP、首轮完成以及同一连接上的移动恢复。手机真机待验收。[验收](../reports/validation.md#stage263-legacy-battle-following-results)

<a id="stage262-legacy-battle-late-recipient"></a>

## stage262 网页回合的先到受击

桌面和移动视口 Chrome 各验证单发送者和双发送者回合。浏览器读回首轮完成、在场角色 HP、MP 与同连接恢复移动。手机真机待验收。[验收](../reports/validation.md#stage262-legacy-battle-late-recipient)

<a id="stage261-legacy-battle-independent-following"></a>

## stage261 网页未起步攻击者的回合恢复

桌面和移动视口 Chrome 各验证两种回合。浏览器读回首轮完成和每个身体的 HP、MP，退出战斗后沿同一连接恢复移动。手机真机待验收。[验收](../reports/validation.md#stage261-legacy-battle-independent-following)

<a id="stage260-legacy-battle-missing-lookahead"></a>

## stage260 网页回合中的后续目标离场

桌面与移动视口 Chrome 各验证两种 PLV 离场输入。浏览器读回首轮结算、在场角色数值和扣除 2 点 MP 后的施术者，战斗退出后沿同一连接恢复移动。手机真机待验收。[验收](../reports/validation.md#stage260-legacy-battle-missing-lookahead)

<a id="stage259-legacy-battle-following-strikes"></a>

## stage259 网页多击回合

桌面及移动视口 Chrome 各验证两条本机 TCP 路径，覆盖同一护卫连续攻击和两名护卫攻击同一角色。浏览器读回首轮完成和逐角色 HP、MP，同一连接退出战斗后恢复移动。手机真机待验收。[验收](../reports/validation.md#stage259-legacy-battle-following-strikes)

<a id="stage258-legacy-battle-repeated-protection"></a>

## stage258 网页重复护卫回合

桌面和移动视口 Chrome 各验证三条本机 TCP 路径，分别覆盖同一护卫、两名护卫和零结果后的后续攻击。浏览器读回首轮完成和预期 HP、MP，同一连接退出战斗后恢复移动。手机真机待验收。[验收](../reports/validation.md#stage258-legacy-battle-repeated-protection)

<a id="stage257-legacy-battle-guard-wait"></a>

## stage257 网页护卫回合

桌面和移动视口 Chrome 各验证两条新增本机 TCP 路径，覆盖 SKL113 的外层护卫和 SKL72 的共享护卫。浏览器读回首轮完成和预期 HP、MP，经同一连接退出战斗并继续移动。手机真机待验收。[验收](../reports/validation.md#stage257-legacy-battle-guard-wait)

<a id="stage256-legacy-battle-skl113-wire"></a>

## stage256 SKL113 的网页回合入口

本机 TCP 在桌面及移动视口 Chrome 验证三种 SKL113 嵌套结果与后续指令。浏览器读回首轮完成，在同一连接退出战斗并恢复移动。手机真机仍待验收。[验收](../reports/validation.md#stage256-legacy-battle-skl113-wire)

<a id="stage255-legacy-battle-guard-alias"></a>

## stage255 施法者兼任护卫的网页入口

本机 TCP 在桌面和移动视口 Chrome 验证 SKL266 同槽有飞行目标及仅自身两种流程。施法者最终 HP 77、MP 5。外部角色分别为 HP 63 和 70。两条路径均读取首轮完成，并经原连接退出战斗和继续移动。手机真机待验收。[验收](../reports/validation.md#stage255-legacy-battle-guard-alias)

<a id="stage254-legacy-battle-guard-departure"></a>

## stage254 有飞行目标的护卫入口

桌面和移动视口 Chrome 通过 SKL266 的两种护卫安排。独立护卫 HP 为 77、受击角色为 63。受击角色兼任护卫时先受伤再回复，最终 HP 为 70。两种场景均读回首轮完成、退场及恢复移动。[验收](../reports/validation.md#stage254-legacy-battle-guard-departure)

<a id="stage253-legacy-battle-guard-release"></a>

## stage253 护卫回合入口

桌面和移动视口 Chrome 从实际登录、入场和防御走到护卫结算。嵌套目标退场时护卫 HP 为 63，无飞行目标的自身回复使护卫 HP 为 77。两种场景均读回首轮完成、退场及恢复移动。[验收](../reports/validation.md#stage253-legacy-battle-guard-release)

<a id="stage252-legacy-battle-physical-boundaries"></a>

## stage252 嵌套缺席与自身结果回合

本地连接可验证缺席的嵌套目标如何结束本条，以及 SKL266 三种正变体的动画、耗魔与最终自身结算。沿原入口核对目标 HP、战斗退出和普通移动。[本地启动](#stage243-legacy-game-stream) · [验收](../reports/validation.md#stage252-legacy-battle-physical-boundaries)

<a id="stage251-legacy-battle-physical-registry"></a>

## stage251 物理技能与退场续接

共享战斗逻辑按当前角色表处理普通 C 换表和 PLV 退场后的空护卫或空施法者。沿现有本地连接可查看后续施法的 MP、目标 HP、回合和退场后的普通移动。[本地启动](#stage243-legacy-game-stream) · [验收](../reports/validation.md#stage251-legacy-battle-physical-registry)

<a id="stage250-legacy-battle-assist-terminator"></a>

## stage250 协作者 FF 后继续战斗

桌面与移动视口 Chrome 通过两种协作者终止场景的本机 TCP 测试，其中一条含独立 `RID0`。后续施法、退场和移动均已核验。[本地启动](#stage243-legacy-game-stream) · [运行验收](../reports/validation.md#stage250-legacy-battle-assist-terminator)

<a id="stage249-legacy-battle-physical-missing"></a>

## stage249 物理中断后续接

桌面和移动视口 Chrome 已用本机 TCP 对端核验五种物理中断场景，包含首攻击者、首目标、后续攻击者、链目标及正变体目标。各场景均完成后续施法、退场和移动。[本地启动](#stage243-legacy-game-stream) · [运行验收](../reports/validation.md#stage249-legacy-battle-physical-missing)

<a id="stage248-legacy-battle-family-missing"></a>

## stage248 技能中断后继续战斗

桌面及移动视口 Chrome 均通过常规状态技、数值技、施法技和 SKL82 的缺席目标场景。共享命令续接后完成后续施法、退场及移动。本阶段使用本机 TCP 对端。[本地启动](#stage243-legacy-game-stream) · [运行验收](../reports/validation.md#stage248-legacy-battle-family-missing)

<a id="stage247-legacy-battle-missing"></a>

## stage247 战斗缺席恢复

桌面和移动视口 Chrome 已经本机 TCP 核验缺席目标后的同组续接，以及保留换位后本方槽并处理独立后续。两种场景均可退场和继续移动。

[本地启动](#stage243-legacy-game-stream) · [运行验收](../reports/validation.md#stage247-legacy-battle-missing)

<a id="stage246-legacy-battle-status-assist"></a>

## stage246 协作者命中与回复

桌面和移动视口 Chrome 从本地 TCP 游戏连接接收变体 12、13。防御后可看到施法、协作者命中或回复、非本方协作者离场。两条路径都已核验退出战斗和移动。

[本地启动](#stage243-legacy-game-stream) · [运行验收](../reports/validation.md#stage246-legacy-battle-status-assist)

<a id="stage245-legacy-battle-status-position"></a>

## stage245 旧版战斗换位

本地网页入口通过同一 TCP 游戏连接消费 SKL98 变体 7。桌面和移动视口 Chrome 在首次防御后的回合看到本方从槽 0 移到槽 5，下一份角色记录将本方切回槽 0。随后可再防御、退场并移动。

[本地启动](#stage243-legacy-game-stream) · [运行验收](../reports/validation.md#stage245-legacy-battle-status-position)

<a id="stage244-legacy-battle-status-slots"></a>

## stage244 SKL98 目标放大与退场

本地游戏长连接收到固定旧版的变体 6、8 后，在现有战斗画布播放放大或缩小退场。桌面及移动视口 Chrome 已用独立回环对端核验防御、回合完成、退出与移动。

[本地启动](#stage243-legacy-game-stream) · [运行验收](../reports/validation.md#stage244-legacy-battle-status-slots)

<a id="stage243-legacy-game-stream"></a>

## stage243 持续游玩的本地网页

启动原创回环对端后，将下例端口换成它的实际端口。打开命令输出的 `/web/game.html`，选择对应的本地启动文件和资源目录，然后连接并选人。

```sh
node web/examples/legacy-game-browser-local.mjs --endpoint 127.0.0.1:32123
```

此命令启用 `/game-stream`。连接建立后，游戏页可跨过 10 秒建立期，并按源协议维护出站空闲连接。桌面和移动视口均通过两次保活后继续移动及断开。

[模块边界](../reports/module-interfaces.md#stage243-legacy-game-stream) · [运行验收](../reports/validation.md#stage243-legacy-game-stream)

<a id="stage242-legacy-battle-status-variant"></a>

## stage242 SKL98 战斗结果

旧版战斗画面由共享层播放 SKL98 的施法和状态结果，击倒与复活时同步角色列表和数值。本轮本机测试使用显式 45 秒桥接时限覆盖完整战斗和退场。

[运行验收](../reports/validation.md#stage242-legacy-battle-status-variant)

<a id="stage241-legacy-battle-summon"></a>

## stage241 SKL93 角色入场

旧版战斗收到 SKL93 结果后，在场角色列表显示新角色名称和数值，画面按施法动画信号启动入场。桌面及移动尺寸 Chrome 已用独立本机对端验证结算、退场和恢复移动。

[运行验收](../reports/validation.md#stage241-legacy-battle-summon)

<a id="stage240-legacy-battle-city-return"></a>

## stage240 战斗内回城

战斗画面初始化后可在操作栏点击“注销回城”。页面暂停战斗输入，使用本轮连接进入普通地图，入场转场完成后恢复移动。[运行验收](../reports/validation.md#stage240-legacy-battle-city-return)

<a id="stage239-legacy-city-return"></a>

## stage239 地图内注销回城

在普通地图操作栏点击“注销回城”，页面保留连接，在收到重建或换图数据后播放转场并恢复移动。桌面和移动尺寸 Chrome 已使用独立本机 TCP 对端覆盖两条路径。[运行验收](../reports/validation.md#stage239-legacy-city-return)

<a id="stage238-legacy-battle-alternate-exit"></a>

## stage238 游戏中返回选服

普通地图和战斗的操作栏提供“返回选服”。退场后页面显示等待服务器确认，收到成功应答会回到连接设置，重新选择本轮启动材料即可再次连接。桌面和移动尺寸 Chrome 均已通过本机 TCP 验收。[运行验收](../reports/validation.md#stage238-legacy-battle-alternate-exit)

<a id="stage237-legacy-music-phases"></a>

## stage237 选服与战斗音乐

选择含对应 WAV 的资源目录后，连接时开始播放选服曲。人物入场、战斗开场及战斗返回地图分别触发渐隐或切曲。服务端待用选择会在场景重建时生效。

[文件布局](../reports/resource-formats.md#stage237-legacy-music-phases) · [运行验收](../reports/validation.md#stage237-legacy-music-phases)

<a id="stage236-legacy-audio"></a>

## stage236 旧版游戏音频

游戏页在连接按钮的点击处理期间启动音频上下文。若本轮所选文件含对应 WAV，场景会播放所选曲目，服务端退场会触发一次音效和音乐渐隐。桌面和移动尺寸 Chrome 的音频图已用合成 PCM 和本机对端验证。

[文件布局](../reports/resource-formats.md#stage236-legacy-audio) · [运行验收](../reports/validation.md#stage236-legacy-audio)

<a id="stage235-legacy-server-return-fade"></a>

## stage235 退出通知的画面过渡

游戏页收到退出通知后用最近一次全幅画面播放退场。播放结束后，“返回连接设置”按钮恢复可用。桌面和移动尺寸 Chrome 已验证末帧与确认后的连接关闭。

[运行验收](../reports/validation.md#stage235-legacy-server-return-fade)

<a id="stage234-legacy-server-return"></a>

## stage234 服务端退出提示

游戏页在本轮角色会话收到已证实的退出通知后停用移动、战斗和对话控制。点击“返回连接设置”释放连接与本轮材料。桌面及移动尺寸 Chrome 已用本机原创对端验证整条入口。

[通信规格](../reports/logic-protocol-spec.md#stage234-legacy-server-return) · [验收](../reports/validation.md#stage234-legacy-server-return)

<a id="stage233-legacy-frame-startup"></a>

## stage233 选择旧版普通入场

在游戏页导入固定旧版启动 JSON 时，可把整个 `context` 写成 `"legacy-se6000-37c4"`。游戏根文件夹和启动材料选择方式沿用现有入口。桌面鼠标与移动尺寸触控已接本机原创对端完成入场、移动和换场。

[材料格式](../reports/resource-formats.md#stage233-legacy-frame-startup) · [验收](../reports/validation.md#stage233-legacy-frame-startup)

<a id="stage232-legacy-ordinary-context"></a>

## stage232 启用旧版普通移动与输入

在 [游戏页](game.html) 导入固定旧版启动 JSON 时，将 `context.movement`、`context.input` 各设为 `"legacy-se6000-37c4"` 可选择普通配置。所选材料和本机对端流程沿用既有入口。桌面鼠标与 390×844 移动尺寸触控已完成入场、移动和换场。

[材料格式](../reports/resource-formats.md#stage232-legacy-ordinary-context) · [验收](../reports/validation.md#stage232-legacy-ordinary-context)

<a id="stage231-legacy-display-startup"></a>

## stage231 启用旧版画幅和相机

[游戏页](game.html) 可从启动 JSON 选择固定旧版显示。设置 `context.display` 为 `"legacy-se6000-37c4"` 后，场景画布使用 640×480。显示尺寸由当前页面适配，游戏输入按画布坐标换算。

桌面和 390×844 移动尺寸 Chrome 已通过入场并绘制源画幅。实体手机运行待验。

[材料格式](../reports/resource-formats.md#stage231-legacy-display-startup) · [验收](../reports/validation.md#stage231-legacy-display-startup)

<a id="stage230-legacy-config-startup"></a>

## stage230 从所选游戏文件夹读取 Config.dat

在 [游戏页](game.html) 选择 v2 启动 JSON 和对应的游戏根文件夹。将配置文件放在旧版模块所在层，启动 JSON 选用 `commandTailHex`。网页会用合并后的资源参数定位文件。已准备好完整参数的材料仍可使用 `resourceParametersHex`。

[材料格式](../reports/resource-formats.md#stage230-legacy-config-startup) · [桌面和移动尺寸验收](../reports/validation.md#stage230-legacy-config-startup)

<a id="stage229-legacy-startup-materials"></a>

## stage229 使用本地旧版模块的启动材料

在 [游戏页](game.html) 选择 v2 启动 JSON 和游戏根文件夹。文件夹根目录应包含固定旧版 `cg_se_6000.exe`。通过身份核对后，本机连接会按源格式使用计算的摘要。v1 启动 JSON 继续使用已有显式摘要字段。

桌面与 390×844 触屏尺寸已通过文件选择、错误文件拒绝、角色列表与断开。本机浏览器验收覆盖桌面和移动尺寸，实体手机文件选择待验。

[材料格式](../reports/resource-formats.md#stage229-legacy-startup-materials) · [验收](../reports/validation.md#stage229-legacy-startup-materials)

<a id="stage221"></a>

<a id="stage221-ordinary-chat"></a>

## stage221 桌面和触屏的地图聊天

**事实**。进入地图后可输入一行文字、选择范围、颜色与字号。收到频道设置且在小队中时可切换小队，聊天记录由对端消息更新。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 23 条网页流程，页面错误、警告和外部请求均为零。

**待验证**。手机真机、当前版本与官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 桌面和触屏的家族邀请与成员管理

**事实**。面向相邻玩家后可从「家族资料」发送邀请。成员面板根据权限开放称号选择、移除和退出，移除与退出需再确认。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 22 条网页流程，页面错误、警告和外部请求均为零。

**待验证**。手机真机、当前版本和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 桌面和触屏的家族资料及成员名单

**事实**。游戏页打开「家族资料」后可查看家族名、会馆、称号及名单，管理者可以提交家族名、会馆名和称号变更。当前显示随对应的资料或称号回包更新。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 21 条网页流程，页面错误、警告和外部请求均为零。

**待验证**。手机真机、当前版本和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 桌面和触屏的家族兽与饲料箱

**事实**。网页从家族兽窗口读取可滚动信息，选择背包物品喂食，在收到权限时提交名称。饲料箱可选择物品槽位存取。收到新的状态后界面更新。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 20 条网页流程，页面错误、警告和外部请求均为零。

**待验证**。手机真机、当前版本和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 桌面和触屏的银行与仓储

**事实**。网页可选槽存取物品和宠物，输入金币金额，看到当前持有金额、仓储余额和可操作上限。收到仓储更新前会暂缓下一笔提交，关闭后可继续地图移动。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 19 条网页流程，页面错误、警告和外部请求均为零。

**待验证**。手机真机、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 桌面和触屏的地图专用对话

**事实**。网页可选择给予或接受物品、提交或取消两项文字输入、调整脸型眼睛与嘴型、确认或取消指定图文。原有地图移动在关闭窗口后恢复。

**事实**。Chrome 与 Playwright 在 1100×850 桌面和 390×844 触屏模拟各通过 18 条网页流程，页面错误、警告和外部请求均为零。

**待验证**。完整组合外观、手机真机、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 桌面和触屏的宠物技能师范

**事实**。选择技能和宠物后，网页显示可用技能栏，支持空栏学习和替换预览。收到相关技能更新时，旧确认失效。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过 17 条网页流程，页面错误、警告和外部请求均为零。

**待验证**。手机真机、原版布局、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · 桌面和触屏的 NPC 服务

**事实**。通过 NPC 菜单进入买卖、兑换或技能师范。学习面板显示当前金币与容量，遗忘先审阅选中的技能，技能表更新后需重新打开。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过 16 条网页流程。页面错误、警告和外部请求均为零。

**待验证**。手机真机、原版窗口图形、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · 桌面与触屏的治疗和图文对话

**事实**。玩家可选择一个治疗对象、完整治疗或取消，显示费用及服务端更新的金币。图文菜单显示本地资源提供的图像和动画，缺少图形时仍可使用菜单。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十五条网页流程。页面错误、警告和外部请求均为零。

**待验证**。手机真机、原版窗口图形、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 桌面和触屏的玩家交易

**事实**。普通场景可面向玩家发起交易或接收邀请。双方可核对物品、宠物和金币，随后发布、撤回、确认或退出。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十四条网页流程。页面错误、警告和外部请求均为零。

**待验证**。手机真机、原版交易详情、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 桌面和触屏的留言板

**事实**。收到留言板后，可按当前页面权限翻页、发帖和确认删除。正文以文本显示，发送结果随服务端返回的新板面更新。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十三条网页流程。页面错误、警告和外部请求均为零。

**待验证**。手机真机、原版留言板图形、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 桌面和触屏的单项给予

**事实**。在单项给予窗口中填写数量，核对折算值并确认。服务端金币和物品回包会刷新可选数量。取消和离店后的移动通过本机对端验收。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十二条网页流程。页面错误、警告和外部请求均为零。

**待验证**。手机真机、原版商店图形、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 桌面和触屏的物品兑换

**事实**。收到兑换窗口后选择数量，核对兑换物余额、费用和空格，再确认。背包变动时会重新核价。回包后在背包查看得到的商品。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十一条网页流程。页面错误、警告和外部请求均为零。

**待验证**。手机真机、原版商店图形、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 鉴定、修理和背包说明

**事实**。在鉴定或修理窗口勾选物品，核对费用后确认。收到物品更新后，选中背包槽可查看最新说明。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过十条网页流程。页面错误、警告和外部请求均为零。

**待验证**。手机真机、原版商店图形、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-shop"></a>

### 前序检查点 · 地图商店的桌面与触屏入口

**事实**。收到普通商店窗口后选择数量，点击核对订单，再确认购买或出售。返回修改可继续调整数量。离开商店会恢复地图操作。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过九条网页流程。页面错误、警告和外部请求均为零。

**待验证**。手机真机、原版商店图形、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 桌面右键、触屏交互和普通对话

**事实**。桌面在地图上右键角色。触屏开启交互模式后轻触角色，也可用该模式拾取附近物品。服务器发送普通窗口后可点选回复，或输入一行文字。关闭窗口后可继续移动。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过八条流程。页面错误、警告和外部请求均为零。

**待验证**。手机真机、原版图文、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 网页右键与触屏拾取模式

**事实**。桌面在地图上右键拾取。触屏先开启拾取模式，再轻触目标。退出该模式可继续用轻触移动。两种方式均等服务端确认后更新地面与背包。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过七条流程，页面错误、警告和外部请求均为零。

**待验证**。手机真机、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-targets"></a>

### 前序检查点 · 网页选择目标、确认丢弃和卸下武器

**事实**。地图背包选中特殊道具后点使用，再选可用目标。丢弃需要点独立确认按钮。战斗背包在满足空位条件时可卸下武器。

**事实**。Chrome 156 与 Playwright 1.64.1 在 1100×850 桌面和 390×844 触屏模拟各通过六条流程，页面错误、警告和外部请求均为零。

**待验证**。手机真机、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-items"></a>

### 前序检查点 · 地图背包的点击和触屏操作

**事实**。使用既有本机服务打开 `web/game.html`，选择本地启动材料和资源文件夹，完成人物选择后打开背包。选中物品可使用，或再选择目标槽后移动。空背包目标允许输入移动数量。

**事实**。Chrome 156 与 Playwright 1.64.1 在桌面 1100×850 和触屏模拟 390×844 各跑五条流程。页面错误、警告和外部请求均为零。 包含地图背包和修正后的四条战斗路径。

**待验证**。手机真机、原版图标及提示、现行版和官服。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 浏览器画布回执

**事实**。桌面 1100×850 与触屏模拟 390×844 分别复核两种退场，留存 16 张原创素材截图。页面错误、警告和外部请求均为零。 普通地图余滴和提前退场清理均有实际画布采样。

**待验证**。手机真机、现行版及官服。

[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 桌面与触屏回执

**事实**。桌面 1100×850 和触屏模拟 390×844 各完成搬运与成对离场。四条真实页面流程各捕获至少 512 个原创特效像素，共留存 12 张截图。页面错误、警告和外部请求均为零。 页面名单复核了成对远端对象离场。

**待验证**。手机真机、现行版本和官服。

[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL402 两侧和触屏回执

**事实**。桌面 1100×850 与触屏模拟 390×844 各覆盖两侧。实际 Canvas 捕获到原创效果，四条页面流程共留存 12 张截图。页面错误、警告和外部请求均为零。 画面经普通登录、战斗输入、回合结束和地图返回流程核对。

**待验证**。手机真机、现行版本和官服。

[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · SKL405 桌面与触控画面

**事实**。桌面 1100×850 和触控模拟 390×844 均验证 SKL405 的背景、MP 10 → 7、结算和返回地图。共 6 张原创素材截图，页面错误、警告和外部请求均为 0。 GMN 名称窗的早期页面证据见同一验证记录。

**待验证**。手机真机、现行版本和官服。

[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：真实合击HUD与移动回归

**事实**：当前77个战斗文件1,076/1,076项、当前neutral生成包64/64项通过；四套构建核对687个输入和34个输出，外部导入0。当前物理族主验收本机TCP397次（源码337、生成52、页面8）；新增CMB为14源码、14生成、8页面，调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共46截图，全部正常回合、返回地图与准确后续移动；页面错误、警告、外联0。Browser插件不可用，使用已有Playwright1.64.1。触控HUD核对Hero MP10、替换的OriginalRider HP40/MP8、目标HP51；nextC中的MP7来自新C包，不是合击扣费。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](../analysis/game-battle-combination-v1/source-check.json)、[源修正](../analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-combination-v1/test-results.json)、[验收边界](../analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](../analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](../analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：RID替换后的实际HUD

**事实**：当前75个战斗文件1,058/1,058项、当前neutral生成包46/46项通过；四套构建核对679个输入和34个输出，外部导入0。当前物理族主验收本机TCP369次（源码323、生成38、页面8）；新增RID为10源码、10生成、8页面，额外调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共42截图，全部完成回合、返回地图及准确后续移动；页面错误、警告、外联0。实际HUD显示替换后的OriginalRider HP40/100、MP8/10。原创小像素夹具不代表完整游戏画面。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](../analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](../analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](../analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](../analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](../analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：73实际桌面与触控流程

**事实**：当前73个战斗测试文件完整回归1,046项全部通过；neutral生成包完整34项全部通过。四种构建核对671个输入与34个输出，外部导入0。357次主物理家族本机TCP回执（源码313、生成28、页面16）均校验正常启动、准确指令和清理。桌面1100×850与触控模拟390×844各8条实际game.html流程，共82截图；15条返回地图并继续准确移动，1条保留有界等待后断开。页面错误、警告、外联均为0。

**待验证**：自身、守护别名、缺少结束信号及RID后跟守护的16条轨迹仍有界等待，不能称为自然回合完成。已有7201恢复是独立机制，未注入ready或清理动画信号。20/21号施法者的73击倒收尾按原指令不补11/44；其他通用类别同类边界尚未纳入本轮实现验收。attachedRID消费者4236d0仍原子拒绝，不能以元数据RID三字已支持推定该消费者已完成。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair73-v1/source-check.json)、[源修正](../analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair73-v1/test-results.json)、[验收边界](../analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：实际双目标回合和错误清理

**事实**：71文件完整战斗回归初轮1,012项中1,011通过、1条压力资源重入的“应正常回合”预期失败；生成包初轮33项中31通过，另有同一重入预期及跨VM对象原型比较失败。只修正3个测试辅助文件，源码与生成包各定向复验2项通过，最终分别覆盖1,012与33个检查；未声称修正后重跑完整两套。932个其他输入及产品运行代码保持相同。四种构建671输入/34输出、外部导入0；328次主物理家族TCP回执（源码285、生成27、页面16）。桌面与触屏模拟各8流程、83截图，15条正常返回移动及1条预期上下文错误/清理通过，页面错误、警告、外联0。

**待验证**：两条主守护/RID在205/207帧选择图形0，保持现有几何拒绝；两条次级2041在124/126帧的201读取下一元组哨兵-1，明确报目标上下文错误，失败回调之后不声称状态/像素等价。100110是带非攻击命中信号的原创压力资源，实际入口和重入会重复主命中并等待；不擅自清信号。保留失败与有界等待，普通守护/RID/重入使用已独立建模的100114资源。这些不是原程序或官服验收。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](../analysis/game-battle-chain260-v1/source-check.json)、[源修正](../analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-chain260-v1/test-results.json)、[验收边界](../analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](../analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](../analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：实际页面的正常流程和明确失败

**事实**：当前69文件战斗979/979、当前neutral生成包34/34、四套构建663输入/34输出通过，0外部导入。当前物理族主验收本地TCP301次（源码258、生成27、实际页面16），另4次实际98动作内暂停/重入定向核对不计入主总数；暂停的重试不重复消耗游标，重入保留2，两次已发生的M消耗按两次计算。桌面/触屏模拟各8流程、83张截图，15条返回移动及1条预期错误提示/清理通过，页面异常/警告/外联0。921个运行/测试/对端输入稳定，含58个Python对端。未重跑全仓或历史生成包全套。

**事实／待验证**：护卫后的RID后续记录在原创场景中令角色资源变为0；实际核心与独立方程在帧264/311一致进入当前帧控制器的LEGACY_BATTLE_FRAME_GEOMETRY。两个案例保留为渲染边界，未当作像素或正常回合通过。初始新模型未保留失败帧中新建残影的旧优先级17，曾错误地保留计算值16，现仅修正该边界快照；全部场景输入、队列、资源、geometry、拥有存储和成功RGBA保持，只有一条边界轨迹的最后状态改变。未放宽原渲染器或改旧golden。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-context-v1/source-check.json)、[源修正](../analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-context-v1/test-results.json)、[验收边界](../analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：桌面与触屏模拟验证三类配对

**事实**：当前67文件战斗945/945、当前neutral生成包33/33、四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP272次（源码231、生成27、实际页面14）；桌面/触屏模拟各7流程、74张截图，页面错误/警告/外联均为0。907个运行/测试/对端输入稳定，含57个Python对端。未重跑全仓或历史生成包全套。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](../analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](../analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：桌面与触屏验证类别纠错

**事实**：当前65文件战斗912/912、当前neutral生成包27/27和四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP227次（源码204、生成21、实际页面2）；桌面/触屏各一次266反射、回合、返回及精确移动流程通过，共10张截图，页面错误/警告/外联0。895个运行/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成包全套。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](../analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：网页实际HP置零、KO与返回

**事实**：当前战斗912/912（65文件）、当前neutral生成包25/25、四套构建（659输入、34输出、0外部导入）通过。当前物理族本地TCP共241次：保留源码184、新源码20、生成20、实际页面17；17条桌面/触屏流程、106张截图，页面错误/警告/外联均为0。893个源码/模型/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成套件。

实际game.html资源/启动文件→正常连接/升级/人物→技能等级/S→M真实耗蓝/瞬移/HP归零→KO移除或下一C重建/暂停/244→普通返回/准确移动/断开。桌面1100×850和触屏模拟390×844，Playwright1.64.1/Chrome156.0.8078.80；无ready/状态注入。已目视复核KO与零数值护卫的置零截图；触屏护卫卡在纵向视口下方，其数值由DOM回执验证，不冒称截图可见。

**事实**：96默认后端的4160组队列、80条轨迹、32959帧状态、11836帧双selector完整RGBA与实际共享核心一致。另两条替代渲染轨迹的927状态/578像素/50样式观察仅为独立源方程；实际公开配置仍报LEGACY_BATTLE_SKILL_CONFIGURATION，未放宽门禁、未计入运行或像素通过。当前仍无替代渲染/半透明后端的完整实现。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special96-v1/source-check.json)、[源修正](../analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special96-v1/test-results.json)、[验收边界](../analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：实际页面嵌套HP、双护卫与返回

**事实**：当前战斗887/887（63文件）、当前neutral生成包25/25、四套构建（651输入、34输出、0外部导入）通过。当前物理族本地TCP共220次：保留源码164、新源码20、生成20、实际页面16；16条桌面/触屏流程、84张截图，页面错误/警告/外联均为0。879个源码/模型/测试/对端输入稳定，含55个Python对端。未重跑全仓或历史生成套件。

实际game.html文件输入/连接/升级/人物→收到技能/等级→S→M真实耗蓝/嵌套HP/双护卫→下一C或244/暂停→普通返回/准确移动/断开。桌面1100×850与触屏模拟390×844；Playwright1.64.1与当前报告中的Chrome。无ready/状态注入，使用原创微型素材，非官方视觉验收。

**事实**：原435000只给72读取嵌套记录，且不把嵌套目标本身标成依赖（护卫会标记）；424310运行时同时处理72/113。保留原解析边界：113嵌套的4480组队列/104条轨迹仅为运行时命令夹具；可经真实前置解析的部分为4640组队列/157条轨迹。真实TCP/页面只验证72嵌套及113无嵌套，不将113嵌套标成协议兼容。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](../analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：真实网页自身HP与返回

61个当前shared/web战斗文件共862项单次全绿；当前生成包27项通过；四套构建643输入/34输出身份一致、无外部导入。当前物理族203次本机TCP：既有源码142、新源码22、生成22、实际页面17。17条桌面/触屏流程、89张截图，页面错误/警告/外联均为0；865个源码/模型/测试/对端输入稳定，含54个Python对端。未重跑全仓或历史486项生成套件。

实际game.html资源/启动文件→连接/升级/人物→收到技能/等级→S选择→M真实耗蓝/自身216/目标HP/RID→下一C或244/暂停→返回→准确移动→断开。Playwright1.64.1/Chrome156.0.8078.80，桌面1100×850、触屏模拟390×844；Browser插件不可用，无ready或状态注入。已目视复核heal-round（自身HP82/MP6）与RID-composite-round（HP79/MP6）截图，目标HP63/MP10。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-self-physical-v1/source-check.json)、[源修正](../analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：真实桌面/触屏正变体结果

59个当前shared/web战斗测试文件共835项单次全绿，当前生成包33项通过；四套构建643输入/34输出核验通过，0external。当前物理族189次本机TCP（既有源码115、新结果源码27、生成27、页面20），20条实际桌面/触屏流程、104张截图，页面错误/警告/外联均为0。853个源码/模型/测试/对端输入身份稳定，包含53个Python对端。本轮未重跑全仓或历史486项生成包全套。

实际game.html资源/启动文件→连接/版本/人物→收到技能与等级→S目标→M真实耗蓝/目标HP/RID→正常或244离场/nextC/暂停→返回→精确移动→断开。桌面1100×850、触屏模拟390×844；Playwright1.64.1/Chrome156.0.8078.80，Browser插件不可用；无ready或游戏状态注入。repeat/self73长等待不在本轮20条页面流程中，另有实际源码/生成TCP与管理器证据。

**待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](../analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](../analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：桌面和触屏真实结果验收

57个当前shared/web战斗测试文件共802项通过，当前生成包27项通过；四套构建643输入/34输出身份核验通过。当前物理族150次本机TCP执行（既有源码94、新结果源码21、生成21、页面14）。14条真实桌面/触屏流程、74张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。

实际game.html资源/启动文件→正常连接/版本/人物→接收技能→S目标→M真实耗蓝/结果→回合/nextC/暂停→返回→精确移动→断开。桌面1100×850、触屏模拟390×844；Playwright1.64.1/Chrome156.0.8078.80，Browser插件不可用。无ready或游戏状态注入；原创小图不是正式游戏美术。

**待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。

[需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-results-v1/source-check.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：真实桌面和触屏护卫流程

当前55个shared/web战斗测试文件共775项通过；当前生成包17项通过；四套构建639输入/34输出身份核验通过。当前物理族117次本机TCP执行（既有源码81、新护卫源码13、生成13、页面10）。10条实际桌面/触屏流程、54张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。

路径：game.html实际资源/启动文件选择→连接/版本/人物→收到技能和等级→S目标→M耗蓝/护卫结果→回合/nextC/暂停→返回→精确移动→断开。桌面1100×850、触屏模拟390×844，Playwright1.64.1/Chrome156.0.8078.80；Browser插件不可用。无ready或游戏状态注入；使用原创小图，非正式游戏美术。

**待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：真实桌面与触屏结算

2243项源码测试通过（188文件）；486项当前生成包检查单次全绿（479 neutral API、7 App/Page）。四套构建631输入/34输出身份核对通过，无外部导入。物理族177次本机TCP执行（源码81、生成81、真实页面15）；14种桌面/触屏流程共15次执行、80张独立截图，页面错误/警告/外联均为0。

验证路径：实际game.html文件选择→连接/人物/收到技能→S目标→M真实耗蓝/结果→回合/nextC/暂停→返回→精确移动→断开。桌面1100×850，手机触摸模拟390×844；Browser插件不可用，使用Playwright1.64.1/Chrome，不注入ready或游戏状态。合成图像用于验证行为。

**待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。

[需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：实际技能选择、回合与返回

2223项源码全量测试通过（186文件）。生成包全量运行469项，3项因验收器跨realm数组原型比较失败；只修正测试比较后，4项相关检查复跑通过，469个不同检查均有通过证据，原失败运行保留，未称单次全绿。四套构建的623输入/34输出身份一致；物理族161次本机TCP执行（源码69、生成69、页面23）完成，页面21种桌面/触屏流程、105张独立截图，错误/警告/外联均为0。

已看图核对单发、95的HP58/63及73保持MP10，真实控件与Canvas沿既有页面运行。手机尺寸390×844为触摸模拟；桌面1100×850。合成方格贴图只承担行为核验。

**待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。

[需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：实际桌面/触屏流程回归

**事实**：本轮依据固定37c4样本的41f310/41f2d0，修正公共26/160反应烟雾：使用身体当次移动前世界坐标、无父链接、不消耗模型随机数；12/13逃跑烟雾沿用独立随机工厂。没有新增正变体或特殊技能可用范围。

全量2194项源码测试（184文件）、440项生成检查（433 neutral＋7 App/Page）、四套构建通过；615输入和34输出身份一致。108条本机OS TCP流程及18条实际桌面/触屏页面流程通过，92截图逐个hash，页面错误/警告/外联均为0。新增源码与生成回归各1项；本轮没有新增TCP场景。

已看图核对零结果MP、RID后HP61、反击双方HP64/58和pending脚本明确不可用。原创合成贴图仅作行为核验；页面沿既有真实控件和Canvas运行，未注入ready或游戏状态。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：实际页面收到公共物理结果后的显示与返回

页面沿用既有HP/MP、Canvas和真实技能/等级/目标控件，新能力进入shared命令/播放链，没有增加演示面板。

本轮2193项Node测试/183文件、439项生成检查（432 neutral+7 App/Page）、四套构建615输入/34输出均通过。独立15995队列、75场景、17488完整建模状态、2358完整RGBA帧（双selector）；108条实际本地TCP流程验证540次正常启动请求、553包技能、110次查询、113条S、101次退出及202次战后移动。实际game.html桌面/触屏18流程、92截图，Chrome156.0.8078.80/Playwright1.64.1，页面错误/警告/外部请求均0。

已人工看图核对MP0、84保留HP70/MP10、RID后HP61、普通返回与96明确不可用。390px触屏模拟及1100px桌面均无横向溢出；合成贴图只验证行为。

正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：网页运行范围不因新静态证据扩大

网页运行代码本轮未改，当前仍以stage202实际game.html验收为准；公共物理新类别/变体尚未接入，不能把已有数字显示当成新的动作消费者。后续需要通过真实文件选择、正常进入、主技能/等级/目标、S/M与实际Canvas/数值/返回验证。

本轮新运行源码测试0、生成检查0、页面流程0；运行模块/导出/适配器/测试及native/vendor未改。已复核stage202构建607输入/34输出和日志身份；此前2142项Node、393生成检查、15页面流程是历史验收基线，本轮未重跑，未重复累计。只运行并通过当前来源核验脚本。

本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](../analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](../analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：实际页面的82放大、资源和结果

沿game.html现有本地文件、正常升级/人物进入与接收技能/P/C的主技能/等级/目标发送S；返回M由82真实回调更新画布、HP与资源。支持放大/冲击、目标或施术者RID、初始1.3缩放、状态移除、双方、下一C、本地目标停止与普通返回/移动，空目标显示未支持并保持数值。

15实际桌面/触摸流程、81源码外截图；4个只读像素探针跨度20/22px，超过12px原帧并通过17px门槛。0浏览器错误/警告/外部请求；合成点阵不是原游戏美术，触摸模拟不等同真实手机。

82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](../analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](../analysis/game-battle-skill82-v1/source-check.json)、[验证修正](../analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-skill82-v1/test-results.json)、[TCP](../analysis/game-battle-skill82-v1/network-validation.json)、[页面](../analysis/game-battle-skill82-v1/browser-validation.json)、[验收](../analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](../analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](../analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：实际技能页面播放83移动并停止/返回

沿game.html已有文件选择、正常升级/人物进入、接收技能/P/C和主技能/等级/目标发S，再由真实M启动83。画布显示合成移动残影，目标真实激活后更新数字/HP；本地244自动退出、非本地删除后实际回合/下一C/普通返回与移动，不靠测试注入完成状态。

13桌面/触摸实际流程、69源码外截图，3个移动路径ROI证据与治疗/扣血/KO/等待分别保存。3条Canvas读回性能提示来自验证器，0页面错误/0其他警告/0外部请求。触摸模拟不等同真实手机。

非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](../analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](../analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](../analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](../analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](../analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](../analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](../analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：技能控件接入数值与治疗结果

现有game.html经实际本地文件、正常升级/人物进入和接收技能/P/C开启主技能、等级与目标。新数值技能返回M后由效果/数字回调更新生命值与HUD；反射和特殊槽保持各自源语义，S不乐观改值。实际回合、下一C、普通返回和移动沿原拥有者运行。

15实际桌面/触摸流程覆盖三类、扣血、反射、多目标、20/21、tier0次级效果、style0、重复、下一C、暂停、零和等待和KO。78源码外截图来自原创合成资源；0错误/警告/外部请求，未进行真实手机验收。35新增/2061全量Node、四套构建/326生成检查（319neutral/7App/Page）通过；595输入/34输出身份一致，0external。独立3类十等级、2317队列、157场景16447完整状态、3250完整RGBA帧（两选择器）一致；154场景身体结束、151场景命令结束，6个源phase2等待单独保留。71条最终验收用真实本机TCP（28来源/28生成/15实际页面），核355启动、368技能包、73自动查询、76个S请求、60正常返回/120移动；初始观察不重复计入。78次独立截图在源码外，对应43个不同图像文件哈希；均为原创合成资源，浏览器0错误/0警告/0外部请求。

共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](../analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](../analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](../analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](../analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：已有技能控件接入状态与辅助结果

game.html仍经真实本地文件、升级/人物进入和接收技能/P/C开启主技能、等级及目标控件。新增状态/辅助结果使用各自M元组和回调，S不乐观扣费/改HP；源自身68 reset与无信号等待保留。实际回合、下一C、普通返回和移动不由演示状态驱动。

13实际桌面/触摸流程涵盖状态、管理器field、切换/清除、特殊槽、32/128粒子、86第六全屏表、下一C和暂停；71源码外截图均为原创合成资源。3条粒子截图按真实ROI像素补验，整体0控制台错误/警告/外部请求。59新增/2026全量Node、四套构建/297生成检查（290neutral/7App/Page）通过；587输入/34输出身份一致，0external。独立36类十等级、2912队列、416场景12775状态、6384完整RGBA帧（两选择器）一致。115条最终验收用真实本机TCP（51来源/51生成/13实际页面），核575启动、591技能包、117自动查询、123个S请求、109正常返回/218移动；初始观察不重复计入。71张原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](../analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-status-skills-v1/test-results.json)、[TCP](../analysis/game-battle-status-skills-v1/network-validation.json)、[页面](../analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：现有技能控件驱动真实施法结果

正常打开现有game.html、选择原创/合法本地资源并走升级和人物进入后，收到技能/P/C才启用相应主技能、等级与目标。S输入和M费用各有真实拥有者；新增13类十等级的已证施法回调，动画信号/几何命中/HP/KO/下一C/普通返回可观察。未知自身31保持明确拒绝，不增加假成功界面。

实际页面验收覆盖10条桌面/触摸流程、暂停/下一C/反射/三资源；45000ms桥只用于本机原创对端。52张源码外截图来自合成资源；它们证明该切面产品流程和绘制可见，不代表原游戏美术、真实手机或官服。38新增/1967全量Node、四套构建/245生成检查（238neutral/7App/Page）通过；579输入/34输出身份一致，0external。独立4686队列、213回调场景25917状态、6078完整RGBA帧（两呈现选择器）、294寻向和180个有符号CRT边界通过。60新真实本机TCP含10实际网页鼠标/触摸流程，核300启动、313技能包、2个1101标签包、62自动查询、65个S请求、53次正常返回/106移动；52张验收用独立原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[规格](../analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](../analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](../analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-casting-v1/test-results.json)、[TCP](../analysis/game-battle-casting-v1/network-validation.json)、[页面](../analysis/game-battle-casting-v1/browser-validation.json)、[验收](../analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](../analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：人物技能、等级、MP与重选

game.html普通指令增加“技能”；主列表展示收到的原槽名，按P2禁用，等级展示收到的名称/说明与计算MP、可用标记。支持返回主列表、关闭、选目标前重新选择等级；当前身体MP/HP由服务器回包后的真实回调更新。主界面按钮没有setter注入就绪或结算。

实际鼠标和触屏仿真覆盖关闭/返回/重选、等级禁用、目标、组目标双队列、下一C自动记忆及新名称/MP、暂停、普通返回移动。未实现类19在页面明确等待并保持连接，不伪造伤害。列表是15记录以内的语义控件，原生10行翻页/命中/像素和音频不宣称等价。31新增/1929全量Node、四构建/218生成检查（211neutral/7App/Page）通过；571输入/34输出身份一致，0external。45独立完整接收状态、14输入场景781状态、110个有符号MP计算边界通过。32新真实本机TCP含6实际页面，核160启动、177技能接收包、34自动查询及37个S请求；25次正常返回、25退出/50移动，27张原创夹具截图在源码外。

完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-player-skills-v1/source-check.json)、[测试](../analysis/game-battle-player-skills-v1/test-results.json)、[TCP](../analysis/game-battle-player-skills-v1/network-validation.json)、[页面](../analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-player-skills-v1/goal-audit.json)。


<a id="stage196"></a>

## stage196：更换/收回宠物与实际Canvas呈现

game.html普通指令新增“更换宠物”，列表由实际present/mode及战斗缓存HP构建，mode2/零HP条目禁用；收回、返回指令与原技能/重选/待机区分。内核拥有intro与完成门限，按钮不会提前写接收mode或MON身体。真实MON更新名称/数值，网页显示当前body；等待下一C保留连接。

普通与战斗Canvas在实际putImageData后提交呈现一次，暂停/取消/旧任务不提交；源39/65/51/52/49与效果绘制通过共享库资源，缩放为明确point策略。实际6页面/25外部截图，鼠标与触屏仿真经过M、MON、下一C/W、正常返回与恢复移动；未支持对侧好友匹配时按实际依赖停等。51新增/1898全量Node、四构建/203生成检查（196neutral/7App/Page）通过；567输入/34输出身份一致，0external。16独立MON场景1864状态、13输入场景673状态、240独立缩放策略像素用例通过；MON同时核两呈现选择器，共3628个像素结果，100个alternate未支持结果。32新真实本机TCP含6实际页面，核160启动、210宠物接收包、42输入（27 M|1、8 M|FF、3 W|FF、4 N）、25退出/50移动及25次正常返回；25张独立原创夹具截图在源码外。

完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](../analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pet-transition-v1/source-check.json)、[测试](../analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](../analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](../analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](../analysis/game-battle-pet-transition-v1/goal-audit.json)。


<a id="stage195"></a>

## stage195：真实技能、目标、待机和重选按钮

game.html新增从接收记录呈现的宠物技能与MP费用、待机/重选按钮；inputMode按实际owner切换普通/骑乘/宠物界面。当前MP不足、P3不允许、缺技能或菜单未就绪时不可选，目标只使用源掩码/编码。动作经过原菜单动画与会话请求，不注入游戏状态；原先过时的“宠物操作仍在开发”提示已更新为操作说明。

实际文件输入、升级、OriginalB入场、技能/目标点击与触摸、两次骑乘行动、下一C普通宠物、未实现CFP停止、正常返回及场景移动均已运行。6页面/24独立截图，390×844模拟无横向溢出；不代表实体手机/微信实机。36新增/1847全量Node、四构建/173生成检查（166neutral/7App/Page）通过；555输入/34输出身份一致，0external。15独立场景833输入状态、53完整接收记录状态通过。38新真实本机TCP含6实际页面，核190启动、120宠物接收包、86输入（34 W|FF、28 W|0|A、5 W|1|0、3 W|2|29、10 G、6 N）、31退出/62移动与31次正常返回；24张独立原创夹具截图在源码外。

完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](../analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](../analysis/game-battle-mounted-input-v1/source-check.json)、[测试](../analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](../analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](../analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](../analysis/game-battle-mounted-input-v1/goal-audit.json)。


<a id="stage194"></a>

## stage194：真实CBC数值、关联画面与下一C

沿既有game.html/本机原创对端进入后，真实CBC会更新HP/MP与资源画面，子对象按父动画附点和深度排列。8实际页面验证普通/附着、骑乘对手、0保留、连续CBC、混合物理PSN/EQU、下一C及CFP停止；7次退出返回和准确移动，未注入ready或游戏状态。

`node --test web/tests/legacy-game-battle-character-change.test.mjs`为14真实源TCP，包括当前操作者骑乘输入仍不可用的负向流程。网页控件未伪造原生骑乘/装备选择菜单；3触屏仿真不是实机验收。24张原创夹具截图在源码外。完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-character-change-v1/source-check.json)、[规格](../analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-character-change-v1/test-results.json)、[TCP](../analysis/game-battle-character-change-v1/network-validation.json)、[验收](../analysis/game-battle-character-change-v1/validation.json)、[剩余目标](../analysis/game-battle-character-change-v1/goal-audit.json)。

<a id="stage193"></a>

## stage193：实际换位标记、下一C与资源回调

沿既有game.html和显式本机原创对端/启动材料，真实换位按钮会使名字与“你”的标记跟随身体，只有收到下一C才应用最新服务器P0。现有防御/攻击输入分别驱动原创对端返回实际EQU或混合动作；网页不提供尚未实现的装备选择菜单。未支持CBC明确等待，回合不伪造完成。

7实际桌面/触屏仿真流程含换位、单人、EQU、混合、下一C反馈、P单独不改当前、CBC停止，6次完成普通返回/准确移动。`node --test web/tests/legacy-game-battle-change.test.mjs`为12新真实源TCP；Playwright1.64.1/Chrome156，0控制台错/警告/外部请求，21原创夹具截图在源码外。本机桥需要更长本轮观察时可显式lifetimeMilliseconds:30000，省略仍10秒，上限60秒；实际手机与官服不等于这些本机证据。完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-change-v1/source-check.json)、[规格](../analysis/game-battle-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-change-v1/test-results.json)、[TCP](../analysis/game-battle-change-v1/network-validation.json)、[验收](../analysis/game-battle-change-v1/validation.json)、[剩余目标](../analysis/game-battle-change-v1/goal-audit.json)。

<a id="stage192"></a>

## stage192：实际页面显示PSN结果与下一轮值

沿既有本机启动入口和显式原创对端/启动材料进入game.html后，真实PSN会更新现有HP/MP栏。7次实际页面验证扣血、回血、扣魔、三类串联、下一轮C覆盖、KO删除和未知分支停止；6次正常流程完成退出、恢复原320×240场景和移动。实际文件选择和升级/选人均未注入ready状态。

源TCP可运行`node --test web/tests/legacy-game-battle-status.test.mjs`。浏览器以既有Playwright1.64.1/Chrome156执行，桌面和触屏仿真0控制台错/警告/外部请求；20张原创夹具截图在源码外。手机为仿真，实际资源选择/跨设备网络和设备未验。完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-status-v1/implementation-plan.json)、[源核验](../analysis/game-battle-status-v1/source-check.json)、[规格](../analysis/game-battle-status-v1/implementation-spec.json)、[测试](../analysis/game-battle-status-v1/test-results.json)、[TCP](../analysis/game-battle-status-v1/network-validation.json)、[验收](../analysis/game-battle-status-v1/validation.json)、[剩余目标](../analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：实际游戏页新增基础战斗画面和操作

沿已有入口运行`node web/examples/legacy-game-browser-local.mjs --endpoint 127.0.0.1:<明确的原创对端端口>`，打开输出的`/web/game.html`，选择本轮启动文件和资源根后按正常升级/选人流程进入。实际战斗数据会显示640×480画布，提供攻击/真实目标、防御、换位请求和逃跑；当前HP/MP与倒计时来自核心，回合等待实际服务器C/M。点击/触屏按钮不直接制造命中或完成。

普通Canvas在入战时释放指针监听，战斗由真实异步资源任务呈现；暂停/继续、不可用动作、依赖等待、再次入战、断开/pagehide与正常返回分别有验收。返回后恢复原显示尺寸与移动。14次产品、7次普通回归、2次基线通过；真实Canvas完整位图有2次独立核验，45张截图在源码外，相关7条HTTP路径字节/MIME均核。

本机原创对端和显式启动材料仍是当前入口边界；手机为390×844触屏仿真，实际手机目录选择/跨设备网络/设备未验。技能/道具/宠物与完整菜单/命中/音频、完整其他玩法、原生微信和现行/官方尚未完成，不能标三个平台完整可玩。

[来源核验](../analysis/game-battle-web-v1/source-check.json)、[规格](../analysis/game-battle-web-v1/implementation-spec.json)、[测试](../analysis/game-battle-web-v1/test-results.json)、[实际页面](../analysis/game-battle-web-v1/browser-validation.json)、[位图核验](../analysis/game-battle-web-v1/canvas-browser.json)、[网络](../analysis/game-battle-web-v1/network-validation.json)、[验收](../analysis/game-battle-web-v1/validation.json)、[目标审计](../analysis/game-battle-web-v1/goal-audit.json)。

<a id="stage190"></a>

## stage190：共享物理攻击已验，产品战斗控件仍待接

共享client的configureBattleSkills绑定真实资源目录，可通过已有语义attack和目标输入驱动普通物理攻击、当前HP/MP、反应/倒地和普通返回。28新源/生成TCP和3137独立动作状态/RGBA验的是共享核心；网页战斗页面、图形菜单/命中、鼠标/触屏和完整其他玩法仍未接通，不能据此标完整可玩。

网页UI未改，无新产品浏览器流程或截图；实际本地HTTP服务核对6条相关模块的字节与JavaScript MIME并关闭。构建/API和当前值接口见模块文档；设备和现行/官方兼容未验收。

[源证据](../analysis/game-battle-skill-v1/source-check.json)、[规格](../analysis/game-battle-skill-v1/implementation-spec.json)、[测试](../analysis/game-battle-skill-v1/test-results.json)、[TCP](../analysis/game-battle-skill-v1/network-validation.json)、[验收](../analysis/game-battle-skill-v1/validation.json)、[目标审计](../analysis/game-battle-skill-v1/goal-audit.json)。

<a id="stage189"></a>

## stage189：共享返回和移动已验，产品战斗页面继续待接

共享client新增configureBattleReturn/copyBattleReturn；已配置的普通来源战斗可通过真实资源任务恢复playing，新的runtime/readFrame接受输入，旧runtime保持closed。5390战斗/返回帧、936返回后普通帧和36准确移动请求来自源/生成实际本机TCP，不是网页完整可玩证明。

网页UI未改，无新增浏览器流程/截图；本地服务已核四条模块路由字节/MIME。game.html既有战斗提示和产品战斗页面、鼠标/触屏、完整技能/菜单/音频/命中与其他玩法仍需完成。[源证据](../analysis/game-battle-return-v1/source-check.json)、[规格](../analysis/game-battle-return-v1/implementation-spec.json)、[测试](../analysis/game-battle-return-v1/test-results.json)、[TCP](../analysis/game-battle-return-v1/network-validation.json)、[验收](../analysis/game-battle-return-v1/validation.json)、[目标审计](../analysis/game-battle-return-v1/goal-audit.json)。

<a id="stage188"></a>

## stage188：共享退出到9/1，产品页面继续待接

client新增configureBattleExit/copyBattleExit；普通退出捕获/渐变与源请求已到共享拥有链，main9/1仍返回明确未实现，旧普通runtime不会因渐变完成而复用。网页UI未改，game.html既有战斗提示仍在，无新增浏览器流程或截图。

1008独立退出RGBA和22新本地TCP仅证明所列共享像素/协议/生命周期，不能当作网页已可完整游玩。实际战斗页面、鼠标/触屏、完整技能/菜单/音频/命中和普通返回均需完成。[源证据](../analysis/game-battle-exit-v1/source-check.json)、[规格](../analysis/game-battle-exit-v1/implementation-spec.json)、[测试](../analysis/game-battle-exit-v1/test-results.json)、[TCP](../analysis/game-battle-exit-v1/network-validation.json)、[验收](../analysis/game-battle-exit-v1/validation.json)、[目标审计](../analysis/game-battle-exit-v1/goal-audit.json)。

<a id="stage187"></a>

## stage187：共享M调度已通，网页战斗页仍待接

共享client新增configureBattleLoop/copyBattleLoop；配合既有advanceBattleEntry可按真实M推进已有命令/body并进入下一轮，缺失SKL和退出继续明确不可用。没有改网页产品UI，现有game.html战斗提示仍保留，没有新增浏览器流程或截图。

1581 Node、18新本地TCP及四构建/77生成检查仅证明所列共享核心/字节/资源拥有链；网页实际战斗画面、按钮/鼠标触屏、完整技能/菜单/音频/命中和退出仍需完成。[源证据](../analysis/game-battle-loop-v1/source-check.json)、[规格](../analysis/game-battle-loop-v1/implementation-spec.json)、[测试](../analysis/game-battle-loop-v1/test-results.json)、[TCP](../analysis/game-battle-loop-v1/network-validation.json)、[验收](../analysis/game-battle-loop-v1/validation.json)、[目标审计](../analysis/game-battle-loop-v1/goal-audit.json)。

<a id="stage186"></a>

## stage186：共享client基本输入可用，产品战斗控件待接

client提供configureBattleInput/chooseBattleCommand/chooseBattleTarget/copyBattleInput；入口与真实session可以发送已证实的基本字节命令，菜单状态与连续行动/超时按源推进。现在仍是共享核心语义端口，没有改网页UI，game.html依旧显示既有battle-pending提示，没有新增浏览器流程或图片。

实际战斗画面/按钮/鼠标触屏、技能/道具/宠物等菜单、音频/命中、M执行与退出返回继续待实现。不能把1565测试、26本地TCP和四构建/67生成检查称为网页已可完整游玩；旧stage180浏览器证据仅保留历史。[源证据](../analysis/game-battle-input-v1/source-check.json)、[规格](../analysis/game-battle-input-v1/implementation-spec.json)、[测试](../analysis/game-battle-input-v1/test-results.json)、[TCP](../analysis/game-battle-input-v1/network-validation.json)、[验收](../analysis/game-battle-input-v1/validation.json)、[目标审计](../analysis/game-battle-input-v1/goal-audit.json)。

<a id="stage185"></a>

## stage185：核心入场已自动消费C，网页战斗流程尚未接入

实际client新增configureBattleEntry/advanceBattleEntry，自动驱动部分源入场状态并产生捕获渐变/基础battle RGBA；真实P/C和资源链、804独立入场帧与1390实际源/生成TCP帧有证据。本轮没有改网页UI，game.html仍保持现有battle-pending提示，未增加浏览器流程或截图。

产品页面的战斗显示/输入、popup/选择/菜单、M与退出返回仍需接入和验收，不能把这些核心端口称为网页已可玩。旧stage180两流程/6图仅为历史。1546测试和四构建/53生成检查的范围见本轮验收。[源证据](../analysis/game-battle-entry-v1/source-check.json)、[规格](../analysis/game-battle-entry-v1/implementation-spec.json)、[测试](../analysis/game-battle-entry-v1/test-results.json)、[TCP](../analysis/game-battle-entry-v1/network-validation.json)、[验收](../analysis/game-battle-entry-v1/validation.json)、[目标审计](../analysis/game-battle-entry-v1/goal-audit.json)。

<a id="stage184"></a>

## stage184：基础frame已到client，网页战斗页面尚未接入

共享client新增configureBattleFrames()/renderBattleFrame()，内部使用真正body/child状态与RD/CGP资源，并核对1835独立RGBA及10条源/生成API实际OS TCP的422帧；这些是核心与资源链运行证据。本轮没有改game.html或网页UI，未增加浏览器流程/截图，页面仍保持已有battle-pending提示和普通操作禁用。

完整主循环、网页实际战斗绘制/输入/退出返回仍未验收；不把显式frame接口称为网页可玩。原stage180浏览器两流程/6图仅保留历史。四构建、1527测试与41生成检查结果见本轮入口。[源证据](../analysis/game-battle-scene-v1/source-check.json)、[规格](../analysis/game-battle-scene-v1/implementation-spec.json)、[测试](../analysis/game-battle-scene-v1/test-results.json)、[TCP](../analysis/game-battle-scene-v1/network-validation.json)、[验收](../analysis/game-battle-scene-v1/validation.json)、[目标审计](../analysis/game-battle-scene-v1/goal-audit.json)。

<a id="stage183"></a>

## stage183：客户端资源拥有链上的动作回调

真实client/session/world可通过客户端自己的资源库配置body回调，并显式推进动画、运动和效果；源模块与生成API的14条本地TCP已验证状态反馈及关闭。此调用级端口尚未接到网页主循环，不自动切换游戏状态。

本轮网页代码/布局未改，继续显示battle-pending，普通地图停止、连接保留；未新增浏览器流程/截图。完整战斗画面/输入/退出仍未完成，不把数值/动画元数据和构建成功称网页战斗可玩。1514 Node、四构建及35生成检查通过。[进度](../reports/development-plan.md#stage183)、[回执](../analysis/game-battle-body-v1/network-validation.json)。

<a id="stage182"></a>

## stage182：真实会话中的命令队列调用核验

当前网页沿用stage180的battle-pending提示，普通地图停下后会话继续；本轮没有页面改动、战斗按钮或新浏览器截图。源client/session/world的实际本地TCP已验证C角色→M消费→队列/END/耗尽三路，调用来自显式测试端口，不代表产品已驱动main10或画出战斗。

21项新增/1495全量Node通过，另四构建及28生成检查通过。完整动作、战斗图像/输入和退出返回仍未实现；没有现行/官方或原生微信验收。详见[本轮网络验证](../analysis/game-battle-commands-v1/network-validation.json)和[下一步](../reports/development-plan.md#stage182)。

<a id="stage181"></a>

## stage181：M准备端口通过实际会话

当前游戏页保持stage180的battle-pending提示和旧地图停止行为，本轮没有新增战斗按钮或画面。实际client/session的新OS TCP验证M字节进入world后，可经显式copyBattleMotionPlan取得与源参考一致的准备结果；不自动把它当已执行动作。

11项新增/1474项全量Node通过；582条原创独立用例覆盖24token、131个SKL类别和55别名，另验RID回退、原始槽区别、字节计数回绕与1023命令边界。源模块/中立生成API各2条实际OS TCP，共4新路径，核正常五请求、M字段/名字/依赖一致、环未消费及关闭。18neutral/7生成检查和四构建通过；三App各126输入11输出，API101输入，0external。

运行：`node --test shared/tests/legacy-game-battle-motion.test.mjs web/tests/legacy-game-battle-motion.test.mjs`；参考：`python3 analysis/game-battle-runtime-v1/generate_vectors.py`。

[源证据](../analysis/game-battle-runtime-v1/source-check.json)、[规格](../analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](../analysis/game-battle-runtime-v1/test-results.json)、[TCP](../analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](../analysis/game-battle-runtime-v1/validation.json)、[完整目标](../analysis/game-battle-runtime-v1/goal-audit.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：真实战斗入场后的网页状态

既有[游戏页](game.html)收到真正入场后显示“已收到战斗数据，战斗画面尚不可用，连接保持”，停止普通场景并隐藏旧地图，暂停/标签/组队/值条禁用，保留断开。后续战斗消息仍被session接收；C end不会假定战斗完成或恢复地图。

Chrome156.0.8078.80/Playwright1.64.1实测桌面1100×850和触屏390×844两条game.html流程，真实Files/正常人物升级选择/入场/持续收包/断开通过，6张原尺寸截图全部复核，0应用错误、警告、外部请求和横向溢出。Browser插件缺席，复用现有Playwright。stage179的15浏览器流程证据保留，本轮未重跑，不能合计为本轮17条。

运行核验：`node --test shared/tests/legacy-game-battle.test.mjs web/tests/legacy-game-battle.test.mjs`；原创参考：`python3 analysis/game-battle-transition-v1/generate_vectors.py`。

[源证据](../analysis/game-battle-transition-v1/source-check.json)、[规格](../analysis/game-battle-transition-v1/implementation-spec.json)、[测试](../analysis/game-battle-transition-v1/test-results.json)、[TCP](../analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](../analysis/game-battle-transition-v1/validation.json)、[完整目标](../analysis/game-battle-transition-v1/goal-audit.json)。

**阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：实际加入/离开按钮

既有[游戏页](game.html)新增加入/离开队伍。进入普通场景后，面向合格相邻人物可发送加入；受到状态或时间门限会给反馈。按钮、提示由真实回复和HFs更新；join已接受但未到队伍行时仍提示等待，离队成功后自动发送源位置确认。桌面鼠标与手机触屏都走同一client/session。

Chrome156.0.8078.80/Playwright1.64.1共15桌面/触屏流程通过，75张截图经7联系表与新原尺寸图复核。实际game.html/Files/正常人物流程/按钮/暂停/关闭验证；0应用错误、警告或外部请求，4条QA Canvas读回提示单列。Browser插件缺席，使用现有Playwright；无浏览器安全覆盖。

运行核验：`node --test shared/tests/legacy-game-party-actions.test.mjs web/tests/legacy-game-party-actions.test.mjs`；独立参考：`python3 analysis/game-party-actions-v1/generate_vectors.py`。

[源证据](../analysis/game-party-actions-v1/source-check.json)、[规格](../analysis/game-party-actions-v1/implementation-spec.json)、[测试](../analysis/game-party-actions-v1/test-results.json)、[TCP](../analysis/game-party-actions-v1/network-validation.json)、[验收](../analysis/game-party-actions-v1/validation.json)、[完整目标](../analysis/game-party-actions-v1/goal-audit.json)。

完整队伍控制/其他快捷键/modal、战斗/宠物/特效/复合转场、其余纠偏/输入/reset/生产启动/资源/玩法、微信原生gamePage和设备、现行及官方兼容仍未完成。无真实测试账号。完整目标active，本轮无VM/CUA/WER/CDB/原程序/账号/官方操作；stage131已执行恢复的诊断不重放。


<a id="stage178"></a>

## stage178：接收队伍状态后的移动行为

继续使用既有[游戏页](game.html)和正常本机服务/资源输入。接收到普通队伍信息后，队长点击仍可寻路，队员由队列跟随；队员点击不新增自主移动命令。收到解散后恢复普通输入，正在进行的插值按源规则继续。没有新增未经证实的组队按钮或网络字段。

13个Chrome156.0.8078.80桌面/触屏流程通过；新2条实际game.html路径含正常选人/升级、实际Files、队员点击禁自主路径、收到解散、暂停/继续/关闭。65张唯一截图经6联系表复核，新桌面/手机跟随图另读原尺寸；0应用错误/警告/外部请求，4条旧QA Canvas读回提示单列。

局部核验：`node --test shared/tests/legacy-game-party.test.mjs web/tests/legacy-game-party-tcp.test.mjs`；独立参考：`python3 analysis/game-party-follow-v1/generate_vectors.py`。

[源证据](../analysis/game-party-follow-v1/source-check.json)、[合同](../analysis/game-party-follow-v1/implementation-spec.json)、[测试](../analysis/game-party-follow-v1/test-results.json)、[网络](../analysis/game-party-follow-v1/network-validation.json)、[验收](../analysis/game-party-follow-v1/validation.json)、[完整目标](../analysis/game-party-follow-v1/goal-audit.json)。

完整队伍UI/加入离开响应、aux04队长/模式图标、战斗/宠物影子/活跃复合转场、其他文字/UI与完整纠偏/输入/reset/生产启动/玩法、微信原生gamePage及设备、现行和官方兼容仍未完成；原生x87与非法重复身体/空指针行为未复现。完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage177"></a>

## stage177：实际状态条显示开关

按既有本机服务打开[游戏页](game.html)，选择来源已核对的启动材料和资源目录，连接并进入场景后使用“显示/隐藏状态条”。开关仅影响显示，可在暂停时改；继续后重新绘制，换场景保留选择，关闭释放。原文字编码/标签入口继续使用。资源来自所选目录；验收截图使用原创合成图像。

11个Chrome156.0.8078.80桌面/触屏流程通过，61张最终唯一截图以6张联系表及2张原尺寸复查；0应用错误/警告/外部请求，4条QA读Canvas性能提示单列。按钮实际改变状态条显示，原有中文标签、暂停、换场景与关闭继续通过。

复现局部：`node --test shared/tests/legacy-game-vitals*.test.mjs web/tests/legacy-game-actor-vitals-tcp.test.mjs`；独立整数参考用`python3 analysis/game-actor-vitals-v1/generate_numeric.py`，完整原创场景用该目录generate_vectors.py。

[源证据](../analysis/game-actor-vitals-v1/source-check.json)、[合同](../analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](../analysis/game-actor-vitals-v1/test-results.json)、[网络](../analysis/game-actor-vitals-v1/network-validation.json)、[验收](../analysis/game-actor-vitals-v1/validation.json)、[完整目标](../analysis/game-actor-vitals-v1/goal-audit.json)。

队伍跟随/本机输入上下文同步、aux04队长/模式图标、宠物影子及战斗条源、其他文字/UI、完整纠偏/输入/reset/生产启动与玩法、微信原生gamePage/设备、现行与官方兼容仍未完成。HFs已存状态尚未动态桥接f5f170/f536b2到现有显式输入上下文；完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage176"></a>

## stage176：文字编码、显示标签与宿主字体

按既有本机服务打开[游戏页](game.html)，选择来源已核对的启动材料和根文件夹，按材料选择ASCII或简体中文（Windows936），连接和入场后点击“显示标签/切换标签”。每次循环0..5，仅改本机显示选项；暂停时也可切换，继续后绘制。编码在会话中锁定，断开后可重新选择。

网页借用已选解码器，将普通font1请求交给本机SimSun/Songti SC/serif字体生成mask；没有下载或内置厂商字形。姓名仍按源字节宽度居中，实际字形像素依宿主字体。

11个Chrome156.0.8078.80桌面/触屏流程通过，37张唯一最终截图已查，0应用错误/警告/外部请求；4条QA读Canvas性能提示单列。网页新增显式ASCII/Windows936选择和实际标签切换按钮；宿主字体为可替代端口，未证明Windows原生GDI字形像素或线路默认编码。 32项新增、1387项全量Node通过；187宽度、2304标签选择、24文字合成，共2515个独立例（含预期拒绝），120帧完整场景/96种SHA、12帧预解码/延迟精灵相符。6条实际原创TCP核460帧，标签循环不增加5次既定客户端请求；8neutral/7生成检查通过。三App118输入11输出、API93输入、0external。

复现：`node --test shared/tests/legacy-game-text*.test.mjs web/tests/legacy-game-text-raster.test.mjs web/tests/legacy-game-actor-text-tcp.test.mjs`。完整TCP是原创本机对端，非官方登录。

[源证据](../analysis/game-actor-text-v1/source-check.json)、[合同](../analysis/game-actor-text-v1/implementation-spec.json)、[验收](../analysis/game-actor-text-v1/validation.json)、[测试](../analysis/game-actor-text-v1/test-results.json)、[网络](../analysis/game-actor-text-v1/network-validation.json)、[完整目标](../analysis/game-actor-text-v1/goal-audit.json)。

HP/队伍、其他文字通道/聊天/头顶气泡/aux04/菜单、完整本机纠偏/输入/reset/生产启动与中文语义、战斗及其余玩法、微信原生gamePage/设备、现行消费者和官方兼容仍未完成；整体goal active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage175"></a>

## stage175：固定网页的真实状态图标路径

入口web/game.html经正常Files、startup、人物升级/列表/进入后，直接消费源状态包并在既有Canvas绘primary/transient/side，无注入场景或新演示按钮。网页薄层继续借shared所有者与library；暂停、切场景、断开和pagehide沿现有生命周期。

11个Chrome156.0.8078.80桌面/触屏流程通过，32张最终唯一截图已查看，0应用错误/警告/外部请求。4条性能提示来自QA反复读取Canvas，单列保留。浏览器只验证实时状态/遮挡/门控/暂停/场景/关闭；601次回调的精确超时由核心/TCP/neutral证明。 精确720帧及601回调、前偏移/返回码由独立参考与实际TCP核对；浏览器截图SHA是实时观察，不能等同固定tick参考。[源证据](../analysis/game-actor-presentation-v1/source-check.json)、[合同](../analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](../analysis/game-actor-presentation-v1/validation.json)、[测试](../analysis/game-actor-presentation-v1/test-results.json)、[网络](../analysis/game-actor-presentation-v1/network-validation.json)。

姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：附属对象的实际网页流程与构建

固定[game.html](game.html)经真实Files导入、选角/升级/进入后使用共享60附属对象逻辑。附属随普通人物/坐骑AP绘制，骑乘与旋转暂停、结束恢复；空/缺动作资源、移除与重建均在实际拥有者处理。

Chrome156/Playwright1.64.1：1100×850桌面、390×844移动网页，7既有+4附属流程通过，18图已查；0应用警告/错误/外部请求，2条QA反复读取Canvas提示单列。只读inspection用于状态核验，不注入场景逻辑。浏览器时点与精确源帧分开，540帧预期见核心/TCP/neutral。[网页](../analysis/game-actor-attachment-v1/browser-attachment.json)、[全部验收](../analysis/game-actor-attachment-v1/test-results.json)。

当前build/wechat-app-stage174-final、wechat-app-local-stage174-final、wechat-app-resources-stage174-final及wechat-game-stage174-final已构建并核对输入/输出。截图为原创合成资源，不能当作官方画面或完整UI；其余玩法、生产启动/中文、现行、原生微信与官方仍待验。


<a id="stage173"></a>

## stage173：实际网页骑乘路径与当前构建

固定入口仍为[game.html](game.html)，按既有运行流程选择资源目录和startup，再选角/升级/进入。已在实际客户端接入70的进入、普通骑乘、退出与再次进入；普通图层/地图顺序保持，临时效果和坐骑在根归并后展开。

Chrome156/Playwright1.64.1：1100×850鼠标及390×844触摸，7既有+4骑乘流程通过，16张最终截图已查。0应用警告/错误/外部请求；3条QA反复读取Canvas提示单列。文件输入、选角、暂停/恢复、换场景和关闭均走真实页面控件；只读inspection用于验收，不注入场景逻辑。[网页回归](../analysis/game-actor-ride-v1/browser-validation.json)、[骑乘](../analysis/game-actor-ride-v1/browser-ride.json)。

本轮构建位于build/wechat-app-stage173-final、wechat-app-local-stage173-final、wechat-app-resources-stage173-final和wechat-game-stage173-final。[命令与哈希](../analysis/game-actor-ride-v1/test-results.json)。本机原创夹具不是官方素材或完整游戏界面；完整UI/玩法/生产启动/中文/现行/微信原生/官方仍待验收。


<a id="stage172"></a>
## stage172：固定游戏页的源80旋转与恢复

固定web/game.html沿真实startup/资源文件夹、源选人/升级进入，同一client会处理80的旋转、完成与普通帧恢复；暂停/继续保持源计数，中途换场景释放旧对象并用正常资源/朝向重建，关闭释放全部所有者。入口仍为`node web/examples/legacy-game-browser-local.mjs --endpoint 127.0.0.1:<明确的原创对端端口>`；没有生产票据、协议字段或上下文默认值的扩展。

7既有/4旋转Chrome流程与12图核验通过，0应用错误/警告、0external。Browser不可用，使用既有Playwright；2条QA像素读回性能建议单独记录。画面是原创合成图案，状态及像素回执证明逻辑差异，不是原版美术或完整可玩验收。[页面](../analysis/game-actor-spin-v1/browser-validation.json)、[旋转](../analysis/game-actor-spin-v1/browser-spin.json)、[测试与缺口](../analysis/game-actor-spin-v1/test-results.json)。完整中文/启动、玩法/current/设备/官方仍待完成。


<a id="stage171"></a>
## stage171：同一游戏页面使用逐实体来源

固定web/game.html的实际client现在绑定角色各自的已证标志和构造朝向；普通图形物件使用真实本机范围与每帧100键过滤，重复对象继续更新但不绘制，越界远端释放。页面仍由真实startup文件/资源文件夹、源选人流程进入，暂停、换场景和关闭由既有所有者处理。

运行入口仍为`node web/examples/legacy-game-browser-local.mjs --endpoint 127.0.0.1:<明确的原创对端端口>`；本轮未新增生产票据、启动字段或隐式上下文。构造mode来自实际场景第8项；动画声音context来源独立。中文/生产启动与完整玩法的现有限制保留。

7既有及4混合实体Chrome流程通过，桌面/触屏共10张截图实看，无控制台错误/外部请求，使用真实File输入和原创TCP、无场景逻辑注入。6条实际TCP及120帧独立混合像素见[测试](../analysis/game-actor-context-v1/test-results.json)、[页面回归](../analysis/game-actor-context-v1/browser-validation.json)、[混合场景](../analysis/game-actor-context-v1/browser-mixed.json)。这些证据不代表原版美术、真实设备或官方可玩。


<a id="stage170"></a>
## stage170：页面遵守真实单位/地图等待

固定web/game.html继续通过本地startup文件和资源文件夹进入源人物流程。shared本机对象可在第一条单位前预构造，但页面会保持“正在读取场景…”，暂停禁用、没有活动Canvas；只有真实本机单位与已接受地图/速度/地块具备才播放。提前坐标/朝向保留，普通换场景用新坐标与动画所有者。

启动入口仍为`node web/examples/legacy-game-browser-local.mjs --endpoint 127.0.0.1:<明确的原创对端端口>`，不会自动连接或生成生产票据/启动材料。startup的显式context和来源声明要求不变，名称仍是明确ASCII子集。源码hash声明不是所选资源鉴定或官方认证。

11Chrome包含既有选人/升级/外观回归、暂停/重连/退出及4个新增等待/位置/换场景边界，使用真实File输入与原创TCP，无注入场景逻辑；0console/0external，10图实看。[页面回归](../analysis/game-local-bootstrap-v1/browser-validation.json)、[初始化边界](../analysis/game-local-bootstrap-v1/browser-boundaries.json)、[运行与测试](../analysis/game-local-bootstrap-v1/test-results.json)。完整玩法、生产中文/启动链、当前及官方仍未验。


<a id="stage169"></a>
## stage169：固定游戏页面与本地启动

[game.html](game.html)是固定项目入口，由game-app直接加载实际shared client、browser session、选人/创建/外观/升级控件和Canvas。读取用户明确选择的启动JSON/根文件夹，连接后收起准备区并清File输入；断开再展开重选。pagehide关闭，隐藏时暂停；暂停保流、恢复重置clock。没有测试脚本注入世界、自动fixture或保存账号材料。

先启动你拥有的原创回环对端，再运行 `node web/examples/legacy-game-browser-local.mjs --endpoint 127.0.0.1:<对端端口>`，打开输出的 `/web/game.html`。CLI必须给明确端点，不会生产票据/默认连接；正常HTTP和退出已验。选择与该轮对应的派生startup和资源根，格式见[启动schema](../reports/resource-formats.md#stage169)；[原创材料生成器](../analysis/game-browser-owner-v1/original_startup.mjs)仅供开发夹具，不能代替真实启动生产链。不要在聊天或仓库保存真实材料。

当前限定旧37c4/原创本机桥，名称限ASCII。startup源hash只是声明，完整native上下文/生产摘要与编码仍未绑定；桥每条连接10秒/4MiB未改。完整游戏、native微信和current/官方继续未验。

7真实Chrome流程经正常File输入验证桌面/触屏、源升级/刷新/外观/入场、Canvas两移动/重载保暂停、pagehide/入场前关闭、同页重新选材料/第二目标重连和错误bridge profile。0console/0external，5图已看。双目标ordinal必须保持runtime完整顺序，可选endpoints已修复该问题。[回执](../analysis/game-browser-owner-v1/browser-validation.json)、[接口](../reports/module-interfaces.md#stage169)、[目标](../analysis/game-browser-owner-v1/goal-audit.json)。


<a id="stage168"></a>
## stage168：实际外观按钮与升级结果视图

legacy-game-character-picker按已知门槛显示上一外观/下一外观/切换样式，并保持外观按钮焦点。源主阶段13由legacy-game-version-upgrade接真实session：成功“返回人物列表”，失败“重试升级”；不自动重发或进入、不推定官方权益。所有文本用DOM textContent，父render驱动，关闭清DOM/listeners，晚到Promise不复活。

session新增changeCharacterAppearance、beginVersionUpgrade/retryVersionUpgrade/acknowledgeVersionUpgrade；每次等待者不能被重入retry覆盖。编码后清marker，关闭清在途帧并结算。main5先绑定selected appearance→world field16，再既有入场；source真实更新可覆盖，完整reset未模拟。[API](../reports/module-interfaces.md#stage168)。

普通HTTP原创harness /web/tests/fixtures/legacy-game-session.html验证5条Chrome流程：桌面、手机触控、失败明确retry三次各53帧/两移动/校正/EOF，另两次晚答复关闭无复活。0console/0external，5截图实际查看；这是临时原创核验界面，正式产品game owner/page仍未建成。[回执](../analysis/game-character-options-v1/browser-validation.json)、[目标](../analysis/game-character-options-v1/goal-audit.json)。


<a id="stage167"></a>
## stage167：创建人物表单与列表刷新

picker显式提供encodeName时，空槽显示创建按钮；新增`legacy-game-character-creator.mjs`拥有稳定输入、外观/配色、两组点数、名称校验、确认/修改/取消及错误返回。名称使用明确encoder/decoder并清字节副本；数值标签中性，不猜HP/职业，不提供无证原画。close清自身DOM/listeners/名称输入，晚到commit回调无效。

session新增begin/edit/copy/confirmCharacterCreation，commit只等源结果或终结，不等列表；source成功后先refresh再选人。错误保留连接等待显式返回，未自动重试；fresh world与手工重放限制保持。Chrome156普通HTTP/本地桥实际创建→刷新→选人→File.slice/Canvas，两视口各53摘要、两移动/校正/EOF；另拒绝返回与两种晚到关闭，共5流程，0console/外部请求，4图已查看。[浏览器证据](../analysis/game-character-lifecycle-v1/browser-validation.json)。

18新/1179Node与构建产物回归通过。`node build/analysis/game-character-lifecycle-v1/browser-check.mjs`复现本地原创验证。生产游戏中文编码、语义标签、正式login→game页面与完整owner、删除/look/aux、native微信/设备/current/官方仍未完成；测试HTML不是成品游戏页。[接口](../reports/module-interfaces.md#stage167)、[验收](../reports/validation.md#stage167)、[后续](../analysis/game-character-lifecycle-v1/goal-audit.json)。


<a id="stage166"></a>
## stage166：可选选人会话与可访问人物控件

`legacy-game-session.mjs`新增显式`postLogin:{graphics}`。ready仍是登录；charactersReady表示可选菜单，enterCharacter(slot)/characterEntered表示源入场或终结。入场前业务发送拒绝，借用world要求首次空scene/map/actors，列表与入场使用独立600001ms源时限，旧login-only默认保持。[接口](../reports/module-interfaces.md#stage166)。

`legacy-game-character-picker.mjs`与css提供已有角色按钮/名称/空槽/等待，显式decodeName配textContent，不造人物属性或图像。render由宿主状态观察调用；close只移除自身DOM、清监听并抑制晚到入场回调。首帧实际呈现后父宿主关闭控件。完整login.html→正式game页面仍未接线，临时原创建证文档不算产品游戏页。

Chrome156实际本地auth→list→产品picker选择→entry→File.slice/Canvas，两视口各53摘要/两移动/校正/EOF、暂停断开通过；另拒绝、控件关闭晚答复、成功观察器关会话，共5流程，console/外部请求0，4张截图已查看。28新/1161Node及原有生成App回归通过。原生微信/物理手机/生产网络/current/官方未验。[浏览器证据](../analysis/game-post-login-v1/browser-validation.json)、[验收](../reports/validation.md#stage166)、[后续](../analysis/game-post-login-v1/goal-audit.json)。


<a id="stage165"></a>
## stage165：游戏字节会话和浏览器端口

`legacy-game-session.mjs`拥有login/stream/control/timer/queued frames，借用fresh genuine world；`legacy-game-browser.mjs`复用明确的原创loopback桥。constructor不连接，start/ready/done与sendCommands/close契约见[接口](../reports/module-interfaces.md#stage165)。ready只完成旧37c4源登录轮询；正式login.html→game页面尚未接线，不自动将current交接送入旧版。

Chrome156通过实际WS→TCP→源登录→File.slice资源→Canvas点击/触控→两移动→位置校正/EOF/close。桌面1000×800和390×844各53独立摘要；busy拒绝也通过，console/外部请求0。`tests/fixtures/legacy-game-session.html`是普通HTTP提供的原创测试宿主，未写演示游戏当作成品。截图在系统临时目录，路径记录于[浏览器验收](../analysis/game-session-runtime-v1/browser-validation.json)。新增真实浏览器timer receiver修复及终结前包清理。

现有桥仍有loopback/同源/token/4MiB/10s开发限制，不能当生产游戏网络方案。用户资料/票据/原始错误不进日志或文档；同一上下文持有world和codec，结束时外层须关闭。1133Node/25新与完整回归通过；当前消费者/正式页面/真实设备/官服未验。[完整验收](../reports/validation.md#stage165)、[后续](../analysis/game-session-runtime-v1/goal-audit.json)。


<a id="stage164"></a>
## stage164：File范围读与异步 Canvas 宿主

createLegacyGameSelectedFiles接已经选择的File句柄，不自动打开picker/读取目录。rootPrefix明确剥离外层目录，支持Unicode根名，原生资源相对键仍ASCII并按Windows大小写折叠/检查别名；stat/read只在所选句柄内切片。createLegacyGameCanvasResourceHost接真实runtime/library的drawPlan，onRequests先交付源描述符，图像齐备后一次提交；停止/取消/新scene/旧timer/clock关闭都不会回写旧像素。旧createLegacyGameCanvasHost同步工厂保留。[模块](../reports/module-interfaces.md#stage164)。

Chrome156桌面1000×800与触控390×844各53像素摘要、7交互/异步检查通过；旧同步宿主另2视口通过。0console/外部请求，截图为原创合成文件场景，已查看布局无溢出。Browser插件未提供，按技能使用既有Playwright1.64.1。[浏览器证据](../analysis/game-resource-runtime-v1/browser-validation.json)。

现有launcher网页尚未连接完整游戏/会话/资源切换主流程；这里交付可调用的资源与Canvas模块，不标完整游戏页面。完整登录页→游戏接线、微信游戏Canvas与原生文件/调度、真实runtime/record/UI上下文、动态LUT/命名调色板/效果、骑乘组队/primitive/小地图、战斗/其余业务及认证、现行与实际三端/官方可玩仍未完成。旧版37c4源码与当前安装资源能按格式组合验证，不构成9baa/6e2ff消费者或官方接受证明。

<a id="stage163"></a>
## stage163：普通游戏 Canvas 适配

web/legacy-game-canvas.mjs导出createLegacyGameCanvasHost，接调用者已配置的真实world/runtime；readFrame提供显式原生上下文，onRequests接本地已产出的发送描述符。start/stop/pump/close、mouse/touch逻辑坐标换算和source clock调度已接；只呈现真正sceneRGBA，不自动猜资源、认证或官方连接。runtime要求明确initialCamera，先pick旧camera再按源local结果跟随。[模块合同](../reports/module-interfaces.md#stage163)。

Playwright1.64.1/Chrome156桌面1000×800与移动触控390×844实际快点/轻触、52移动更新/2描述符、各53独立像素摘要及stop/resume通过；page身份/非空/无overlay/无横溢出，0console/外部请求。Browser插件未提供，使用已安装Playwright。测试HTML/截图为原创数值夹具，未替代完整产品游戏页面；全部记录见[浏览器回执](../analysis/game-input-runtime-v1/browser-validation.json)。

**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

完整资源与原生 runtime/record/UI 上下文绑定、右键交互、小地图/primitive/特殊角色/特效、战斗/其余业务及认证、现行版本、实际三端与官方可玩仍未完成。旧版37c4不等同9baa/6e2ff；本轮没有VM、WER、CDB、账号、官服或原生IDE新操作，也未重放已消费停止点。

<a id="stage162"></a>
## stage162：world普通地图场景输出已具备

shared现把源CUT、地图缓存地形、静态/动画物件和实体合并为拥有RGBA的普通场景，world.advanceFrame在显式配置后返回sceneLayer；源矩形裁剪与地图动画生命周期有独立证据。浏览器现有界面仍是核验流程，实际游戏Canvas、点击/输入、帧时钟及资源宿主尚未接通，没有用演示背景代替协议场景。[接口](../reports/module-interfaces.md#stage162)。

1067完整Node/2neutral/7生成工程及3微信构建通过，真实本地TCP验证52场景帧/2移动请求；341CUT只证明数值格式覆盖，不等同网页/手机设备或现行官服可玩。下一步先接源输入/时钟与资源/Canvas宿主，完整UI、效果、战斗/认证和三端/官方目标继续保留。[验收](../reports/validation.md#stage162)。

<a id="stage161"></a>
## stage161：world已具备普通实体层输出

shared的world帧接口现接实际动作重播、位移、动画与源深度排序，返回拥有RGBA的普通实体层；调用方提供source上下文、camera/viewport与真实资源geometry/sprite。绘制失败仍返回移动请求，网络协议保持可继续处理。浏览器界面仍是已有核验流程，Canvas输入/时钟/资源宿主与完整地形物件场景尚未接通。[接口](../reports/module-interfaces.md#stage161)。

1050完整Node/2neutral/7工程及3微信构建通过，独立Python本地TCP验证52帧和2条实际请求；不等于网页/手机设备或现行官服可玩。下一步完整场景与输入/资源接线，再补特殊回调、特效/战斗/认证与三端接受。[验收](../reports/validation.md#stage161)。

<a id="stage160"></a>
## stage160：可移植动画到普通RGBA帧

shared具备source动画目录/player与ordinary frame定位桥接；原点、实际RD尺寸、flip和source priority10有端到端证据。模块不使用DOM/Canvas/时钟/网络，caller显式提供源context/geometry与palette准备；目前web仍为已有核验流程，尚未接完整游戏scene/input/frame/resource host。[接口](../reports/module-interfaces.md#stage160)。

1033完整Node、2neutral、7工程及3新微信构建通过；1250状态/1235原创RGBA步和396本地动画metadata相符，不代表原游戏视觉/移动设备/当前官方可玩。下一步实际actor/network重启和callback场景调度，再补named palettes/特效与完整玩法/auth。[验收](../reports/validation.md#stage160)。


<a id="stage159"></a>
## stage159：可移植图像帧核心已具备

shared新增source RD/CGP/native32与普通RGBA sprite/frame，无DOM/Canvas/网络依赖，支持拥有数组、源透明/倒序行、翻转/viewport/priority顺序。当前web界面仍为资源核验与已有流程；没有用无源动画或演示scene替代游戏host，Canvas/frame clock/实体资源绑定尚未接线。[核心接口](../reports/module-interfaces.md#stage159)。

1012Node/2neutral/7生成工程及三个微信构建为本地证据；27854资源记录摘要与288RGBA抽样匹配不代表原程序视觉对照、移动设备或官方可玩。下一步source动画→scene/input/frame host，再补实际跨平台/官方验收。[验收](../reports/validation.md#stage159)。


<a id="stage158"></a>
## stage158：普通本机移动与导航核心

shared world已可在明确源context下，按真实collision/path/batch/float运动/补图等待/地块事件生成请求并同步actor/pose。网页/移动网页仍需实际游戏host输入/帧/renderer和完整生命周期接线，现有页面仍为登录器/资源流程。[接口](../reports/module-interfaces.md#stage158)。

984完整Node含Web、2neutral/7工程、4轮原创TCP通过；没有实际浏览器游戏/手机/账号/官服新增接受。原生x87/时序性能、完整renderer/战斗/auth、现行和官方可玩仍未完成。[验收](../reports/validation.md#stage158)。

<a id="stage157"></a>
## stage157：实体/普通移动协议核心

shared world已能按源context/list/action/remove建实体与状态，显式推进远端并编码移动消息；数学投影不是完整renderer。网页/移动页仍需游戏host输入/时钟/碰撞路径/资源绘制/战斗接线，原登录器/资源流程保持。[接口](../reports/module-interfaces.md#stage157)、[合同](../analysis/game-legacy-actors-v1/implementation-spec.json)。

947完整Node（含Web）、2neutral、7生成工程及原创TCP通过；没有实际手机/浏览器/账号/官服或原程序新增接受。完整auth、当前游戏与官方可玩仍未完成。[验收](../reports/validation.md#stage157)。

<a id="stage156"></a>
## stage156：场景自动缓存与状态消息核心

shared/index的world工厂可自动准备场景当前地图、投影标签和48源槽，组合补图与位置；网页/移动页仍需游戏host缓存持久/场景/actor/renderer接线，现有登录器/资源流程保持。[接口](../reports/module-interfaces.md#stage156)、[合同](../analysis/game-legacy-scene-v1/implementation-spec.json)。

914完整Node（含Web）、2neutral、7生成工程及原创12消息对端通过。完整认证/传输、资源绘制/移动战斗、实际手机/浏览器与当前官服可玩仍未验，未新增真实会话或原生动作。[验收](../reports/validation.md#stage156)。

<a id="stage155"></a>
## stage155：地图数据核心可移植验证

shared提供显式地图缓存读取/校验/补丁，协议可给source-bound补取命令并消费地图回复；网页/移动页尚未接入缓存初始化、场景或renderer。既有登录器/资源流程与端口保持。[接口](../reports/module-interfaces.md#stage155)、[规格](../analysis/game-legacy-world-v1/implementation-spec.json)。

898完整Node（含Web）、2无平台API检查及原创TCP闭环通过。缓存平面角色、actor/移动战斗、完整认证/浏览器传输、实际手机与当前官方可玩仍待验；无新原生/真实会话动作。[验收](../reports/validation.md#stage155)。

<a id="stage154"></a>
## stage154：消息/协议核心与网络位置投影

shared/index可导入固定37c4的消息目录与协议对象，纯byte流可从初始材料推进至类型消息和网络位置意图。既有网页/移动网页登录器、资源流程与网络端口保持，尚无完整游戏认证/业务/地图/renderer/移动战斗页面接线，也没有新增浏览器原生TCP能力。[接口](../reports/module-interfaces.md#stage154)、[规格](../analysis/game-legacy-message-v1/implementation-spec.json)。

883完整Node（含Web回归）、2neutral与7新生成工程通过，下一步为实际业务消费者/host集成。8192轮派生调度/取消、浏览器/手机真机和当前官方可玩仍未验；本轮无VM/原生IDE/真实会话动作。[验收](../reports/validation.md#stage154)、[完整审计](../analysis/game-legacy-message-v1/goal-audit.json)。

<a id="stage153"></a>
## stage153：正文核心可用，游戏连接/业务尚未接线

shared/index可导入固定旧版37c4的payload codec与bootstrap工厂，纯JS基础算法不依赖浏览器crypto或文本API。网页/移动网页现有登录器和资源流程保持，新增能力还没有完整游戏控制/认证/消息/玩法接线，也不赋予浏览器原生TCP。[接口](../reports/module-interfaces.md#stage153)、[合同](../analysis/game-legacy-transform-v1/implementation-spec.json)。

866完整Node（含Web回归）、2neutral和7新生成工程通过；bootstrap8192轮为同步工作，neutral批次耗时已记录，实际网页host调度/取消与手机性能仍需验收。未运行原游戏、原生IDE或官方会话。[验收](../reports/validation.md#stage153)、[完整审计](../analysis/game-legacy-transform-v1/goal-audit.json)。

<a id="stage152"></a>
## stage152：旧版封包字节能力进入shared导出

新`legacy-se6000-37c4-envelope-v1`编码/分片读取可通过shared/index导入，payload保持opaque。网页/移动网页的既有登录器与资源核验流程未改，当前没有游戏连接/玩法页面接线，浏览器也未获得原生TCP能力；正文转换/业务合同完成后才做游戏薄适配。[接口](../reports/module-interfaces.md#stage152)、[规格](../analysis/game-legacy-network-v1/implementation-spec.json)。

850完整Node（含Web回归）、2neutral和7新生成工程检查通过；不是浏览器/手机真机或官方游戏验收。本轮没有VM/原程序/原生IDE操作。[验收](../reports/validation.md#stage152)、[完整目标审计](../analysis/game-legacy-network-v1/goal-audit.json)。

<a id="stage151"></a>
## stage151：新旧版静态游戏证据，网页运行范围保持

已取得两份完整旧版EXE并由REA追到配置/资源名/CGSharedMem消费者，完整载体未下载完、与当前游戏不默认等价。网页没有新增游戏字段、IPC执行或页面；资源核验仍受既有raw/压缩结构范围约束。[材料与范围](../analysis/game-release-current-v1/legacy-acquisition.json)、[首批静态合同](../analysis/game-release-current-v1/static-contract.json)。

本轮没有产品测试/构建或真实浏览器/手机运行新增，stage150测试范围保持；正式渲染、游戏通信/玩法和官方接受仍待证。[验收](../reports/validation.md#stage151)、[完整目标审计](../analysis/game-release-current-v1/goal-audit.json)。

<a id="stage150"></a>
## stage150：新增压缩命令核心，网页查看范围保留

shared新增独立RD v1/v3结构API与未知位置mask；当前资源页面仍使用原raw v0/v2灰度核验，不自动把C/D/E占位渲染为色号或透明。没有新增无协议游戏页面、移动/战斗或官方网络字段。[接口](../reports/module-interfaces.md#stage150)、[格式](../reports/resource-formats.md#stage150)。

完整838Node及2portable/7生成工程通过，结构核验27,785条与独立Python一致；原真实浏览器/移动设备记录不因本轮JS测试扩大。颜色、原主游戏业务和三端可玩/官方接受仍未完成。[验收](../reports/validation.md#stage150)、[完整目标审计](../analysis/game-rd-runs-v1/goal-audit.json)。

<a id="stage149"></a>
## stage149：可复用游戏配置字节核心

shared/game-config纯模块已可从入口导入，设置字节可进入既有来源绑定资源快照/缓存；无DOM配置bundle已验证。尚未新增设置页面、文件覆盖、游戏renderer选择或可玩原型。829Node/3portable/7生成工程不代表游戏接受。[接口](../reports/module-interfaces.md#stage149)、[验收](../reports/validation.md#stage149)。

<a id="stage148"></a>
## stage148：资源格式复用与微信文件端口

原Web IndexedDB资源存储与严格v1/v2绑定保持原hash，新微信封套/双slot复用同一资源快照，不改变HTTP消费者或缓存身份。独立Python/822Node及7生成工程验证新本机文件层，原浏览器格式不迁移。[接口](../reports/module-interfaces.md#stage148)。

本轮新JS工程环境不等同浏览器/设备渲染或实际微信持久性，真实平台和官方/游戏接受仍未完成。[验收](../reports/validation.md#stage148)。

<a id="stage147"></a>
## stage147：Web当前配置绑定当前补丁调用者

Web包装器新增可选own callerProfile：默认legacy，或显式win32-current；preparer创建时复制。当前登录页面的createPatchInput取已有runtime sourceProfile，不由表单猜测。命令路径引用及timer/exit元数据变化，资源绑定/缓存格式及单来源请求保留。[接口](../reports/module-interfaces.md#stage147)。

实际API与本机HTTP/relay回归通过；本轮无新浏览器页面渲染，完整路径/locale、手机与官方接受仍待验。[验收](../reports/validation.md#stage147)。

<a id="stage146"></a>
## stage146：原Web补丁API包装共享无平台执行器

web/launcher-game-patch保留createLauncherCatalogPatchPlan/prepareLauncherGamePatch入口、native codec/clock/signal和明确allowedOrigins/fetchImpl；原plan与顺序消费者移至shared，增加完整期限race/cleanup。原Web页面/资源缓存/运行方式未改，ZIP与路径预算/错误导出保留，所有原有补丁回归及完整792Node通过。[接口](../reports/module-interfaces.md#stage146)、[提取核验](../analysis/launcher-wechat-patch-v1/source-check.json)。

adapters/node/launcher-patch-relay新增固定来源handler及loopback便利server，CORS只接受启动时明确来源，匿名只读资源不带账号头；本轮只用于原创本机链路，没有部署桥接或修改现有页面源权限。微信5项生成工程通过不等于浏览器渲染/手机/官方验证。[网络](../reports/network-portability.md#stage146)、[验收](../reports/validation.md#stage146)。

<a id="stage145"></a>
## stage145：纯目录校验提取，浏览器默认包装保留

web/launcher-catalog-data现在包装shared同名纯模块；原预算/字节复制/MD5/XML函数体保留，Web仍默认fatal native TextDecoder，错误类/own字节入口重导出。shared新本地记录及微信缓存直接调用纯模块/显式codec；旧Web缓存/HTTP/页面没有新增自动读写或模式切换。[接口](../reports/module-interfaces.md#stage145)、[源提取比较](../analysis/launcher-wechat-cache-v1/source-check.json)。

完整773Node与4生成工程检查通过，覆盖原Web候选/初始化回归；本轮没有新浏览器渲染或手机/微信/官方证明。微信缓存的配置与一致性边界见[宿主](../wechat/README.md#stage145)及[验收](../reports/validation.md#stage145)。

<a id="stage144"></a>
## stage144：现有bootstrap支持完整平台端口

bootstrap可注入时钟/期限/取消/解码六端口，默认仍原浏览器行为；HTTP错误/预算移到无DOM数据模块，原launcher-http导出身份保留。catalog snapshot仅增加可选decodeText。三个原创浏览器HTTP服务的精确ESM列表已补新依赖并实测，未改Web页面或全局DOM对象。[接口](../reports/module-interfaces.md#stage144)。

完整751Node通过，另4生成微信工程无DOM检查通过；本轮没有新浏览器渲染/移动设备或官方接受。微信HTTP/文件接线及配置见[宿主](../wechat/README.md#stage144)，原生SDK关闭门槛保留。[验收](../reports/validation.md#stage144)。

<a id="stage143"></a>
## stage143：微信宿主复用现有流程，Web源码不改

新增WeChat host/App/Page工程复用目录、文本/阅读及session；既有Web页面、HTTP/缓存与运行命令保持。完整Node719及2生成工程JS专项通过，本轮没有浏览器重渲染或手机/官方接受；微信SDK明确服务关闭，未连接原生模拟器。[微信配置/运行](../wechat/README.md#stage143)、[验收](../reports/validation.md#stage143)。

<a id="stage142"></a>
## stage142：同一会话驱动可由微信薄端口使用

`createLauncherSession`新增可选createAbortController，浏览器默认与start的原生AbortSignal保持。WeChat组合入口提供private取消/时钟/定时器/随机数/TCP端口，复用current flow；没有修改默认网页、HTTP目录或资源流程，不新增页面演示。[接口](../reports/module-interfaces.md#stage142)、[微信构建/接入](../adapters/wechat/README.md#stage142)。

完整Node709通过，另1项无DOM CommonJS交换通过；本轮未重跑浏览器页面/移动尺寸、真手机或微信，不能以构建/API形状夹具替代这些验收。浏览器既有运行命令保持；普通Node测试不依赖build生成物，bundle专项才先执行构建命令。[测试](../analysis/launcher-wechat-v1/test-results.json)。

<a id="stage136"></a>
## stage136：现行来源已接入实际本地登录页

从项目根运行：

```sh
node web/examples/launcher-current-browser-local.mjs
# 旧默认模型的同一页面回归：
node web/examples/launcher-current-browser-local.mjs --source-profile legacy
```

示例依赖Node、Python3和PyCryptodome；本机已核实Node26.9.0、Python3.9.6、PyCryptodome3.23.0，无需新增安装。打开输出的`http://127.0.0.1:4176/`→检查并准备配置→填写公开原创`SyntheticU1` / `SyntheticP1`→使用原创测试文本→逐页阅读四页并确认→开始本地交换→明确选择可选候选。独立Python只核这组原创输入，完成一次或600秒截止后退出；Ctrl+C走正常stop，实际启动/中断exit0已验。不是官方条款、账号或游戏连接，不输入真实凭据。

current示例明确选择sourceProfile，把当前bootstrap/握手/record同时接入页面，允许空marker和明确null旧XML；legacy示例/省略服务端sourceProfile仍旧模型。服务只连启动时声明的loopback列表，无远程代理。当前rtm仅固定初始化路由有界允许，包/静态源/runtime仍不接受query；更新只准备候选不执行。[API](../reports/module-interfaces.md#stage136)。

完整650Node通过；Chrome156/Playwright1.64.1实际页面6场景含桌面1100×820、手机尺寸390×844、旧版、取消迟到、错误组、未知/不一致profile通过，截图观察无溢出/重叠。Browser插件未提供，复用已装Playwright/独立Chrome，未装新依赖。初轮runner预期错误和CLI信号问题均保留记录，后者仅改原创对端并重跑8项/实际stop，不称重跑全browser。[测试](../analysis/launcher-current-page-v1/test-results.json)、[页面/截图](../analysis/launcher-current-page-v1/browser-audit.json)。

手机尺寸不是真手机或微信；真实认证/来源身份、完整原生更新/游戏交接和游戏消费者/可玩仍未验，goal active。[需求](../reports/development-plan.md#stage136)。

<a id="stage125"></a>
## stage125：游戏诊断已执行，网页实现未增加验收范围

原游戏一次无账号诊断得到 `TEXT_ZERO`，未生成代码快照，随后以 `0xc0000005` 退出；没有新增认证或游戏消费者证据。网页/移动网页代码和浏览器历史测试保持原范围，本轮无产品构建、微信或官方可玩验收。[运行回执](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)、[持续需求](../reports/development-plan.md#stage125)。

<a id="stage122"></a>
## stage122：网页与移动网页实现未改，等待游戏诊断恢复访问

本次具体游戏启动/读取确认已取得；普通搜索字符和关闭已验证，随后 Mac 锁定，未启动原游戏或取得消费者。现有网页、浏览器缓存与测试保持历史范围；本轮无新产品构建、设备/微信或官方可玩验收。[当前需求](../reports/development-plan.md#stage122)、[实际状态](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)。

<a id="stage119"></a>
## stage119：分析依赖资格补齐，浏览器产品范围保持

同一Windows原创6624B快照已返回并全字节比较相等。新游戏前检/恢复点与限定诊断方案已准备，游戏尚未执行或读取；没有新消费者、认证或消息字段，也没有本轮产品源码、构建或浏览器测试变更。网页/移动网页/微信/官方可玩仍未完成。[需求](../reports/development-plan.md#stage119)、[验收](../reports/validation.md#stage119)。

<a id="stage118"></a>
## stage118：产品模块未改，分析依赖取得Windows读取实证

本轮只增加analysis固定传输工具与原创fixture的实际6624B读取/摘要/自然退出证据；原始文件直接比较仍待普通输入恢复。没有新增游戏字段或重复运行旧产品测试，三平台/官方可玩仍未完成。[当前范围与下一步](../reports/development-plan.md#stage118)、[验收](../reports/validation.md#stage118)。

<a id="launcher-stage114"></a>
## stage114：资源存储与页面恢复链实际运行通过

通过常规Playwright1.64.1/Chrome156、独立本机原创夹具和专用持久配置，验证原生IndexedDB保存→页面重载/浏览器重启→读取→拒绝错误来源→恢复匹配候选→明确选择。桌面1100×820与手机尺寸390×844合计83项，6会话及服务收尾，零页面网络/控制台异常。[全部检查](../analysis/launcher-cache-source-browser-v1/browser-results.json)、[截图与审计](../analysis/launcher-cache-source-browser-v1/evidence-audit.json)。

首轮夹具漏nested vendor路由造成三404，保留失败后仅修夹具，生产源未改。工具只在build补固定Playwright包、核完整性并复用现有Chrome；没有构建新平台安装包或重复执行79Node。物理手机、微信、原站CORS/账号/游戏消费者及可玩验收仍待完成。[工具](../analysis/launcher-cache-source-browser-v1/tooling.json)、[阶段验收](../reports/validation.md#stage114)。

<a id="launcher-stage113"></a>
## stage113：游戏更新可显式选择固定Patcher备选来源

`createLauncherCatalogPatchPlan/prepareLauncherGamePatch`新增可选`patchSourceProfile`（默认configured-only，或显式puk3-195f3afd）与`patchSourceOrdinal`（默认0，固定profile可选1）。计划返回冻结patchSources/selectedPatchSource与binding选择；固定profile要求精确PatchEXE元数据和已证地址，原CLI过程计划仍保留配置PIP。[接口](../reports/module-interfaces.md#stage113)。

所选origin必须单独在allowedOrigins中，清单与包在同一来源准备，失败/取消不会换源或重试。已有完整deadline/ZIP/MD5/owned候选规则保留；来源选择通过原创注入传输，既有loopback GET等合计79Node通过。主机另有6次公开HTTP200，但没有原站浏览器CORS、移动网页/微信或官方可玩验收；当前UI未新增自动联网行为。[实测](../analysis/launcher-current-entry-v1/test-results.json)、[主机证据](../analysis/launcher-current-entry-v1/plan.json)。

缓存所有者原先投影丢失profile/ordinal，导致键相同、不同来源可误恢复；3项新回归已实际失败再修复。现在固定来源进入资源键并使用resources.v2，默认/旧缓存仍为v1；79项回归包含键、格式、页面恢复和旧缓存路径，浏览器V2持久化仍待验。

<a id="launcher-stage112"></a>
## stage112：会话控制字段保持opaque，页面入口范围保持

当前源证明request1的9B双词格式及type2两参数回调，现有shared codec/flow与web session沿用；本轮无新的页面入口、网络发送或公共API。认证仍unverified，字段业务含义与真实调用值待证。[接口](../reports/module-interfaces.md#stage112)、[源规格](../analysis/launcher-current-control-v1/implementation-spec.json)。

相关四文件45Node通过，复现见[shared说明](../shared/README.md#launcher-stage112)。Windows只读前检返回游戏身份/Win7标记，尚无原游戏消费者或真实账号验收；网页、移动网页、微信与官方可玩保持未完成。[测试](../analysis/launcher-current-control-v1/test-results.json)、[前检](../analysis/launcher-current-control-v1/guest-preflight.json)。

<a id="launcher-stage111"></a>
## stage111：current会话同时采用现行record

既有createLauncherSession({...,handshakeProfile:'current'})现经shared flow统一采用当前握手和record；无需新增web模块参数。当前writer为ceil(n/8)*8+8，receiver允许0/0空record，generic/default仍原契约；页面默认入口本轮未改，认证快照仍unverified。[接口](../reports/module-interfaces.md#stage111)。

3原创交换校验实际三个写入和空record+type11读取，连同13独立ECB向量/最大摘要、3接收边界/65分片与旧回归，相关7文件78Node全通过。复现见[shared说明](../shared/README.md#launcher-stage111)。本轮无新外部连接/账号/原Windows或浏览器运行，用户暂无测试账号；继续无账号正常连接控制，网页/手机/微信与原游戏/官方可玩仍待验。[源规格](../analysis/launcher-current-record-v1/implementation-spec.json)、[测试](../analysis/launcher-current-record-v1/test-results.json)。

<a id="launcher-stage110"></a>
## stage110：会话可显式采用现行固定组

createLauncherSession新增可选handshakeProfile:'current'，own data读取后透传共享flow；省略为generic，getter拒绝，未知值拒绝。当前失败组仅已有hello8B写出，取熵0/账号写0并close。页面默认入口未在本轮改为此选项，没有浏览器/设备或真实账号验收。[接口](../reports/module-interfaces.md#stage110)。

```js
import { createLauncherSession } from './web/launcher-session.mjs';
const session = createLauncherSession({ ...explicitSessionInputs, handshakeProfile: 'current' });
```

3有效/8无效Python向量、530分片与最终相关78Node全通过，包含current session传递和旧session回归。复现命令见[shared说明](../shared/README.md#launcher-stage110)；不运行已用的单次真实观察CLI。独立Node真实前置8B→529B源组匹配/实际close不代表浏览器TCP、对端身份或账号/游戏兼容；authentication仍unverified。当前加密record完整等价与网页/移动网页/微信可玩仍待验证。[源合同](../analysis/launcher-current-channel-v1/implementation-spec.json)、[测试](../analysis/launcher-current-channel-v1/test-results.json)、[前置回执](../analysis/launcher-current-channel-v1/network-observation.json)。

<a id="launcher-stage95"></a>
## stage95：新增共享日志头 API，网页流程不变

shared/index.mjs已导出parseWin32LauncherUpdateJournalHeader，调用者可显式传入精确16B观测头；它没有浏览器文件读取、journal清理或执行恢复功能，也不改变页面默认profile、缓存或账号流程。[核心使用](../shared/README.md#launcher-stage95)。

实际ChromeESM验证27Python向量与6组断言，另1条SharedArrayBuffer可用性记录为false，Node已独立覆盖该边界；29本地GET无错误/失败。复现：从项目根运行 `node analysis/launcher-update-recovery-v1/browser-check.mjs /absolute/path/to/playwright`，使用已安装Playwright和Chrome，新建独立headless上下文/原创loopback fixture，不接官方账号或真实journal。[验收](../analysis/launcher-update-recovery-v1/validation.json)。完整615Node通过，手机/微信/可玩游戏和官方验收仍待完成。

<a id="launcher-stage94"></a>
## 显式刷新并提交配置对（stage94 / 2026-10-29）

新增工厂将当前bootstrap准备结果提交至现有IndexedDB候选缓存。页面默认入口保留；由调用方明确选择已核对的五端点、允许origin、解码选项和本地launcher字节：

```js
import { createWin32LauncherCatalogRefresh } from './web/launcher-catalog-refresh.mjs';
import { createLauncherCandidateStore } from './web/launcher-candidate-store.mjs';
import { createLauncherHttpClient } from './web/launcher-http.mjs';

const refresh = createWin32LauncherCatalogRefresh({
  httpClient: createLauncherHttpClient({ allowedOrigins }),
  store: createLauncherCandidateStore({ profile: 'launcher-current' }),
});
const result = await refresh.refresh({
  launcherBytes, endpoints, encoding: 'utf-8', allowBareAmpersands: false,
  timeoutMs: 10000, signal,
});
```

result.disposition区分launcher-update-candidate（不写缓存或EXE）、catalogs-unchanged、catalogs-committed。读取revision后先下载并完整验证双XML，再一次commitPair；同字节/解码选项重查revision后跳过写入。冲突不覆盖，已提交后的取消仍如实报committed及迟到标志；REFRESH_COMMIT_UNCONFIRMED需读回确认，不能视作自动恢复。[完整接口](../reports/module-interfaces.md#launcher-stage94)、[先行规格](../analysis/launcher-current-refresh-v1/implementation-spec.json)。

本轮22新定点与完整605Node通过。复现Node：`node --test web/tests/launcher-catalog-refresh.test.mjs`；完整为`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`。浏览器使用已安装Playwright目录：`node analysis/launcher-current-refresh-v1/browser-check.mjs /absolute/path/to/playwright`，从项目根运行，创建全新headless Chrome上下文/本地原创fixture，实际ESM/IndexedDB11项73GET最终通过；首轮网络审计失败留档。[验收与日志hash](../analysis/launcher-current-refresh-v1/validation.json)。

此模块只组合声明的HTTP/配置缓存能力；不提供Win32文件/进程更新、真实账号/游戏或手机/微信验收。新主程序的选定配置分支由REA核对，全部新HTTP与内嵌updater语义尚未完成。

<a id="launcher-stage92"></a>
## 显式使用新版 HTTP 候选准备（stage92）

现有页面的启动命令和旧默认profile保持。新版是可由调用者选择的模块工厂，不自动替换页面流程。调用者提供端点、明确允许的origin、本地原始字节及编码：

    import { createLauncherHttpClient } from './web/launcher-http.mjs';
    import { createWin32LauncherBootstrap } from './web/launcher-bootstrap.mjs';
    const httpClient = createLauncherHttpClient({ allowedOrigins: selectedOrigins });
    const loader = createWin32LauncherBootstrap({ httpClient });
    const candidate = await loader.prepare({
      launcherBytes, gameListBytes, regionListBytes, endpoints: explicitEndpoints,
      encoding: 'utf-8', allowBareAmpersands: false,
    });

gameListBytes/regionListBytes可明确为null表示没有可比较的旧字节。元数据/配置GET追加rtm；自摘要匹配时总是请求marker、GameList和RegionList，后两份检查完整独立字段并比较实际字节。marker正文不当摘要凭证；本地MD5只证明候选一致性。自摘要不匹配时先核声明包长的32MiB独立预算，再下载严格Win32候选；包URL不推定追加main-worker查询。

只准备candidate，不写文件、启动更新器、认证或自动提交缓存。网络仍受显式origin、2xx/无重定向与整个prepare截止限制；不是WinInet全行为兼容。浏览器需要原生ESM/Fetch/TextDecoder；若服务端无CORS，仅模块存在并不代表浏览器可联机。

实际执行了node --test shared/tests/*.test.mjs web/tests/*.test.mjs，共583/583；现有Playwright1.62.1创建独立Chrome155上下文，以实际ESM和回环HTTP检查63向量/9组检查、69GET、0错误/失败。该验证没有改页面/渲染UI，不提供视觉、Safari/移动设备/微信或官方游戏兼容结论。[验收](../analysis/launcher-current-metadata-v1/validation.json)、[接口](../reports/module-interfaces.md#launcher-stage92)。

<a id="launcher-v30"></a>
## stage75：“仅刷新通行证”与不同交接反馈

运行`node web/examples/launcher-browser-game-patch-local.mjs`，准备配置/目录/补丁并明确选择后，勾选“仅刷新通行证”→重新准备完整参数→按原流程输入公开原创账号、逐页确认四份原创文本、交换并选候选。魔力分支显示0项资源、映射17字节和“当前分支不请求游戏进程”；未勾选时原资源准备和完整交接保持。实际4174示例已这样跑通并正常退出；没有刷新真实官方通行证。[示例](../analysis/launcher-v30/ui-example-browser.json)。

该值只进入进程计划，未添加到登录请求或当作认证条件。更改清旧交接并要求重准备，已选补丁文件保持；勾选时不枚举FileList或候选资源名，但仍需有效目录，不能静默退回映射流程。review/交换锁定时受控伪造change也会还原值；配置变化/pagehide重置，不持久化。非CG分支仍按既有producer规则判断是否请求客户端。首次Config的新API只是选中目录/ConfigEXE/明确快照的字节计划，无UI配置程序或Profile访问。[接口](../reports/module-interfaces.md#launcher-v30)。

Chrome155/Playwright1.62.1（Browser插件未提供），1280×1100/390×844：9项新流程186请求、5次独立核对原创交换通过；24生产/9结果向量在实际浏览器通过。缓存13项304请求、补丁13项204请求、无补丁Galaxy6项120请求回归通过，0相关console/page错误。截图重验使用新目录及`open(wx)`排他写入，碰撞拒写/原bytes保留已验证。[新流程](../analysis/launcher-v30/refresh-browser-verified.json)、[视觉](../analysis/launcher-v30/visual-review.json)、[验收](../analysis/launcher-v30/validation.json)。两张初始首屏路径被后续回归同名重写，初始精确PNG无法比对，原回执保留，[事故](../analysis/launcher-v30/artifact-output-incident.json)；不把重采集当初始原件。Safari/真机/微信/完整BFCache、原程序和官方/游戏接受未验。

<a id="launcher-v29"></a>
## stage74：明确保存、核验与恢复资源候选

运行`node web/examples/launcher-browser-game-patch-local.mjs`，打开输出的4174本机地址。准备配置/目录→准备补丁→审阅并选择→展开“本机资源缓存”→检查资源缓存→保存所选资源。可在同一服务中重载页面，重新准备相同配置/目录/编码，检查缓存→读入资源候选→再次明确选择→按原流程确认原创文本、交换并选候选。实际示例已沿此路径通过；一次原创交换后服务关闭，故保存/重载/恢复安排在交换之前。[示例回执](../analysis/launcher-v29/ui-example-browser.json)。

不自动保存或读取资源；保存会替换已检查版本，一个浏览器origin/profile只保留一个绑定快照。缓存复制文件bytes及当前XML摘要对、原game/reference/region序号、原Code、目录/编码和可选Galaxy；不含账号/文本确认或原进程对象。恢复重新核对全部文件MD5与精确绑定，有不符、损坏、未来数据库版本或并发冲突时保留记录并说明。恢复只进审阅，不自动选择或认证。[契约](../analysis/launcher-v29/implementation-spec.json)。

已有页面候选在缓存失败时仍可继续使用；取消/配置/目录/编码/基文件变化/pagehide会丢当前缓存操作引用，迟到完成不能恢复旧就绪状态。事务已提交后取消不能撤销，返回结果和页面提示区分这种情况；不把put请求成功当提交完成。原补丁许可、安装目录与网络边界保持。数据库属于此浏览器origin，清站点数据/容量或浏览器回收会影响它，不承诺安装耐久性；重启原创示例会改变临时端口和XML摘要，旧绑定不会自动迁移。

Chrome155/Playwright1.62.1（Browser插件未提供），1280×1100/390×844：真实IDB12项/51模块请求、页面13项/299请求、原补丁13项/201请求、无补丁Galaxy6项/118请求通过，0pageerror/console警告或错误。含两页面CAS、原生put成功后abort回滚、提交后取消/迟到截止点、明确注入的put失败、坏记录/未来schema保留、重载/恢复/取消等待open/pagehide与原创交换。首屏/保存/恢复截图已观察，六项浏览器检查通过。[存储回执](../analysis/launcher-v29/resource-store-browser.json)、[页面](../analysis/launcher-v29/ui-cache-browser.json)、[视觉](../analysis/launcher-v29/visual-review.json)、[验收](../analysis/launcher-v29/validation.json)。真实quota耗尽、全安装规模/流式读取、Safari/真机/微信/完整BFCache和官方/游戏仍未验。

<a id="launcher-v28"></a>
## stage73：实际登录页补丁审阅与明确选择

运行`node web/examples/launcher-browser-game-patch-local.mjs`，打开输出的`http://127.0.0.1:4174/`。先检查并准备配置，填写`C:\Original`，点击“检查并准备补丁”；原创夹具先创建再追加，无需基文件。审阅`Bin/GraphicInfo_8.bin`的58字节候选，再点“选择此候选”；页面会自动准备1项资源。随后使用公开原创输入`SyntheticU1`/`SyntheticP1`、逐页确认四份原创测试文本，开始交换并选择候选。独立Python对端核验一次请求后退出，服务正常关闭；重跑示例可开始新一轮。[实际示例回执](../analysis/launcher-v28/ui-example-browser.json)。

补丁面板仅在本机服务明确配置`gamePatchOrigins`且当前游戏有PatchEXE时显示。许可只接受1..16个精确`http://127.0.0.1:port`来源，与XML所选PIP/PPort另行匹配；默认服务不新增此能力，也无代理/官方端点。已配置且需要补丁时，未明确选择完整候选前账号和文本流程锁定；有跳过项不能选择。来源、失败、取消与候选列表均有实际状态反馈。[接口](../reports/module-interfaces.md#launcher-v28)。

“本轮补丁的基文件夹”会读取所选文件内容，限1024文件、单个32MiB、合计64MiB；只在本页计算，不上传、不写安装目录。所选候选的路径替代原安装文件夹元数据供资源参数使用。原“安装文件夹”在无补丁选择时仍只读名字。修改目录/路径编码/基文件、切换配置或缓存恢复、放弃及pagehide会清除旧候选；缓存仅存XML/选项，不存补丁bytes或选择。[完整契约](../analysis/launcher-v28/implementation-spec.json)。

Chrome155/Playwright1.62.1（Browser插件未提供），1280×1100/390×844：13项补丁流程192请求、6项默认无补丁/Galaxy回归112请求通过，0pageerror/console警告或错误；取消只产生预期ERR_ABORTED。实际FileList追加、来源拒绝前零更新GET/零会话、缓存恢复和交接已核验，首屏/审阅截图已检查，六项浏览器检查通过。[补丁回执](../analysis/launcher-v28/ui-browser-verified.json)、[默认回归](../analysis/launcher-v28/plain-regression-browser.json)、[视觉](../analysis/launcher-v28/visual-review.json)、[验收](../analysis/launcher-v28/validation.json)。Safari/真机/微信/完整BFCache、原生提交及官方/游戏仍待验。

<a id="launcher-v27"></a>
## stage72：配置绑定的补丁HTTP准备

运行`node web/examples/launcher-game-patch-local.mjs`，启动原创回环服务，按实际GET清单→创建包→追加包生成候选后正常关闭；已实际跑通。入口是新的`launcher-game-patch.mjs`，登录页面尚无补丁上传/准备/取消/候选选择控件，本次不宣称这些UI已接通。[接口](../reports/module-interfaces.md#launcher-v27)。

`createLauncherCatalogPatchPlan`重新核对原XML摘要/结构和所选ordinal，保留重复Code记录、原PatchEXE正文及区域PIP/PPort；`prepareLauncherGamePatch`只请求明确allowedOrigins中的该补丁来源，BIP许可不会扩成补丁许可。清单`/cg50/Update.TXT?t=`和所需`.bz2?time=`包按当前候选状态顺序读取；一个总deadline、真实AbortSignal、已有HTTP预算/拒绝重定向规则，失败不返回部分files。不自动使用原硬编码后备站点或重试，不执行计划中的EXE/复制/删除。[完整契约](../analysis/launcher-v27/implementation-spec.json)。

Chrome155/Playwright1.62.1实际11流程，13更新GET/346模块和HTTP总请求，0外部请求、0page/非预期console错误；独立服务记录与路径序列核对，含三操作、顺序依赖、current、拒绝来源、取消、跳过及坏清单。32生产/21退出码和旧31语法/10候选也在浏览器通过。Browser插件未提供，复用现有Playwright；无新视觉或物理设备验收。[回执](../analysis/launcher-v27/browser-qa-verified.json)、[验收](../analysis/launcher-v27/validation.json)。

<a id="launcher-v26"></a>
## stage71：浏览器复用补丁纯核心

本轮新增的是shared补丁字节API；现有登录页面没有新增补丁上传/替换按钮。`node shared/examples/game-patch.mjs`可核验原创候选；网页适配器后续需显式关联清单blockOrdinal与包、提供独立候选存储和取消/错误交互，不能把这次核心验收写成页面更新功能完成。[接口](../reports/module-interfaces.md#launcher-v26)。

实际Chrome155/Playwright1.62.1从现有4173回环服务导入index/game-patch/Pako，在`connect-src none`下通过31语法、10候选场景和8坏包；30同源请求、0console/page错误、0外部请求。Browser插件未提供，复用已装Playwright；本次没有新视觉或移动尺寸验收，前轮UI证据不冒充本轮重验。[浏览器回执](../analysis/launcher-v26/core-browser.json)、[总验收](../analysis/launcher-v26/validation.json)。候选仍unverified且未写安装目录/联网/执行，完整平台与官方兼容未完成。

<a id="launcher-v25"></a>
## stage70：配置驱动的分组（Galaxy）

入口仍是`node web/examples/launcher-browser-local.mjs`。默认原创配置和固定安装包都无Galaxy，原流程与隐藏控件保持；读取含已证Galaxylist/Galaxy结构的本地配置后，当前游戏有匹配项才显示分组。先选区域→明确选分组→准备目录/编码→文本确认→实际交换→选候选。尚未选或同名歧义时账号/交换不可继续；分组不会给XML中的地址额外许可。

分组值使用原记录ordinal，过滤其他Gamecode后仍可为0/2/3等；不按显示位置重新编号，不自动取首项。名称重复（含其他游戏的同名记录）禁选，正文按当前路径/参数编码进入额外参数。变化重置旧候选、输入、文本确认和目录数据；明确缓存保存仅存原XML/选项，恢复后重新选分组。[接口](../reports/module-interfaces.md#launcher-v25)、[契约](../analysis/launcher-v25/implementation-spec.json)。

Chrome155/Playwright1.62.1（Browser插件未提供），1280×1100/390×844：6分组流程98请求/3独立核对完整请求，9无分组流程98请求/4独立请求通过，0非预期console/page错误。包括混合Gamecode、跨游戏重名禁选、参数byte数变化、缓存重解析/选择清空、Windows936中文分组正文与ASCII账号独立；六项浏览器检查/图像复核通过。只用原创6条分组/文件名夹具，不冒称固定样本含此数据或真实服务接受。[新流程](../analysis/launcher-v25/galaxy-browser.json)、[旧流程](../analysis/launcher-v25/plain-config-regression.json)、[视觉](../analysis/launcher-v25/visual-review.json)、[验收](../analysis/launcher-v25/validation.json)。游戏/官方/真机/微信仍待验。

<a id="launcher-v24"></a>
## stage69：目录准备→实际会话→完整生产端数据

运行`node web/examples/launcher-browser-local.mjs`并打开其输出地址。准备配置→展开“准备游戏文件参数”→填写配置对应的Windows目录→单独选择路径与参数编码→选择安装文件夹→准备完整参数→公开原创账号`SyntheticU1`/`SyntheticP1`→逐页确认原创四页说明→交换→选beta。页面显示命令bytes/资源项数/映射bytes；无游戏消费或OS启动。目录只是你提供的参数来源，不是浏览器定位Windows路径/读HKCU的证明；文件名目前限ASCII。[接口](../reports/module-interfaces.md#launcher-v24)。

资源适配只读原生File.webkitRelativePath，不读文件内容/上传。明确的浏览器长名匹配：Bin/Puk2/Puk3下anime/graphic*.bin与Bin/coordinate*.bin，保留FileList次序；不模拟Win32 wildcard/8.3/属性/实际枚举完整性。路径/参数编码与账号/XML分别选择；已尝试却未准备的目录不能静默退回映射流程。没有目录输入时原映射流程保留。目录/资源/编码变化清旧交接，配置/区域变化还重置目录字段；pagehide关闭统一lease并清字段，取消模式切换保留。

Node421，Chrome155/Playwright1.62.1（Browser插件未提供），1280×1100/390×844：9项新流程98请求，8项原流程147请求通过；独立Python核4新+7旧完整请求。原生目录选择、中文CP936/UTF8路径与ASCII账号独立、重复Code11序号、失效/关闭通过。六项浏览器检查通过、截图已观察；0非预期console/page错误。两个QA输入/断言假设的初始回执及修复前回归保留，本轮未重写历史产物。[新流程](../analysis/launcher-v24/launch-browser.json)、[回归](../analysis/launcher-v24/handoff-regression.json)、[视觉](../analysis/launcher-v24/visual-review.json)、[验收](../analysis/launcher-v24/validation.json)。Safari/真机/微信/实际Windows枚举与官方游戏仍未验。

<a id="launcher-v23"></a>
## stage68：浏览器可运行的参数核心

本轮增加shared纯ESM命令/cwd/资源参数生成，未修改网页UI，也未接入文件系统或游戏执行。原配置/会话页面与运行命令沿用v22；另可`node shared/examples/launcher-process.mjs`查看原创参数数据。不得把clientCreationRequested或已有“交接就绪”显示当实际游戏已启动。[核心契约](../analysis/launcher-v23/implementation-spec.json)、[接口](../reports/module-interfaces.md#launcher-v23)。

Chrome155实际导入shared/index：48进程向量、4枚举向量与5个既有资源文件名对照通过，30本机源码请求，0控制台warn/error/pageerror。仅验证当前核心在浏览器运行；没有重做整页视觉/交互、Safari或真机验收。Browser插件未提供，复用Playwright1.62.1，不新增依赖。原4173服务/CSP保持；此前4174示例会话48946现已exit1且端口未监听，未据此标通过或重启。需要运行示例时按下方命令正常新建。[当前浏览器核验](../analysis/launcher-v23/browser-core.json)、[验收](../analysis/launcher-v23/validation.json)。

<a id="launcher-v22"></a>
## stage67：选择候选后准备交接写入

命令保持`node web/examples/launcher-browser-local.mjs`。准备配置→输入公开原创`SyntheticU1`/`SyntheticP1`→四页说明→实际交换→选beta，显示CGSharedMem/17字节/尚未交给游戏。字节由原回包选择结果生成，payload不显示、不存储、不下载；页面只持有可关闭的private lease，当前没有游戏消费者入口。中文原始字节与三种账号profile保持，不能从编码或候选可选推定认证。

[`shared/launcher-handoff.mjs`](../shared/launcher-handoff.mjs)输出原标签/原name bytes、opaque到首NUL、调整后的unsigned32低word转小写base32、尾空格/NUL。只给最多92B写入前缀和256B容量；不把未写尾部清零，不创建原Windows映射，也不生成argv。lease可一次takeWrite，close清其自有/借出view；消费者自行复制的数据归消费者负责。[契约](../analysis/launcher-v22/implementation-spec.json)、[接口](../reports/module-interfaces.md#launcher-v22)。

输入/编码/配置/文本/确认模式变化清交接；模式取消保留。pagehide现统一清候选/显示/输入/确认/内存，修复只清内存却残留“就绪”的错误。专门PageTransitionEvent验证处理器，不宣称完整BFCache或真机验收。Node390，Chrome155/Playwright1.62.1（Browser插件未提供），1280×1100/390×844：8交接检查/135请求、9编码/262请求、17配置会话+1测量/473请求通过；0非预期错误，1预期取消单列，总10039ms含5500ms前段。7个新交接实际请求由Python独立核对；原编码/配置链继续通过。[交接](../analysis/launcher-v22/handoff-browser.json)、[编码](../analysis/launcher-v22/encoding-regression.json)、[回归](../analysis/launcher-v22/config-session-regression.json)、[验收](../analysis/launcher-v22/validation.json)。

原EXE/VM/实际IPC/真实账号/官方服务均未操作；游戏读取、argv/资源、真实认证/opaque寿命、Safari/手机真机/微信小程序与官方兼容未验。历史回执事故保留原限制，本轮失败回执/日志/截图先保留再重跑，没有重写历史输出。

<a id="launcher-v21"></a>
## stage66：单独保存输入保留方式

入口与命令保持：`node web/examples/launcher-browser-local.mjs`，或增加`--text-profile windows-936`/`utf-8`运行原创中文对端。打开输出URL→准备配置→选择保留方式→2切1时确认清空→“保存保留方式”→刷新观察恢复。账号与名称编码依旧明确选择，ASCII默认；中文公开夹具见下方stage65。普通回环服务、Code/BIP允许列表、原4173离线页与CSP保持。

| 操作/状态 | 实际行为 |
|---|---|
| 初次/刷新读取 | 仅服务runtime合法后读取同源固定非秘密设置key；有效1/2按既有模式默认初始化，缺失/无效/不可用默认2，不自动写入 |
| 切换保留方式 | 只影响本页；2→1先确认，确认后清输入/文本确认/候选，取消或Escape保留；需要另点保存才改变刷新恢复值 |
| 明确保存 | 只存schema和UserMode，原生Storage setItem后回读完全一致才显示已保存；不接收账号、勾选、编码或文本确认 |
| 刷新恢复 | 只恢复模式值；账号空、密码勾选false，用户名勾选由模式默认重新初始化，账号编码ASCII、配置/文本确认不自动恢复 |
| 异常/并发 | 缺失/无效/未知版本只读保留；用户明确保存可替换自有key。不可用或写入/回读失败给受控状态，不回显异常、不自动回滚/另存副本 |
| 锁定 | 配置/文本I/O、逐页确认、模式对话框与交换期间不能保存/改模式；伪造锁定change回原值，取消后隐藏确认按钮事件无效 |

[`launcher-preferences.mjs`](launcher-preferences.mjs)是薄浏览器Storage适配，调用[`shared/launcher-preferences.mjs`](../shared/launcher-preferences.mjs)严格codec。固定key`moli.launcher.preferences.v1`，canonical JSON恰好schema/userMode两项、≤128 UTF16字符，拒绝额外/重复/未知/非规范记录；无账户、checkbox、编码或许可摘要。只证明本机原创页面实际保存/回读/刷新，普通Storage后写覆盖不是原子CAS、原INI映射或断电耐久性；其他标签页修改不自动应用当前会话。[接口](../reports/module-interfaces.md#launcher-v21)、[契约](../analysis/launcher-v21/implementation-spec.json)。

Node380（新11）；Chrome155.0.8059.85/已有Playwright1.62.1，桌面1280×1100/390×844：12设置检查/495请求、9编码回归/256请求、17配置会话流程+1测量/462请求通过，0非预期错误/console警告，1预期取消单列。总deadline10041ms含5500ms前置读取；恢复模式后另一个实际请求由Python独立核对。初始QA错误selector失败已保留，改测试后通过；未放宽生产门禁。[设置](../analysis/launcher-v21/preferences-browser.json)、[编码](../analysis/launcher-v21/encoding-regression.json)、[回归](../analysis/launcher-v21/config-session-regression.json)、[复核](../analysis/launcher-v21/review-corrections.json)、[验收](../analysis/launcher-v21/validation.json)。Browser插件未提供，使用现有Playwright，无新依赖。

此设置不同于真实账号落盘；原EXE/VM/真实账号/官方端点均未操作。实际ACP/IME、账号/服务/opaque寿命、可信更新事务、游戏、Safari/手机真机/小程序与官方兼容仍未验收。历史v19详细回执事故继续按stage65记录限制阅读，v21没有重写历史回执。

<a id="launcher-v20"></a>
## stage65：明确编码、中文请求与名称

```sh
node web/examples/launcher-browser-local.mjs --text-profile windows-936
node web/examples/launcher-browser-local.mjs --text-profile utf-8
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

两条示例择一运行，打开其输出URL；先准备配置，再在“账号与候选名称编码”明确选择对应profile，使用公开原创输入`合成用户甲` / `测试口令甲`，四页说明确认后交换。Windows-936两项各10B，UTF-8各15B；示例提供四个原创中文名称、保留原数值状态，仅两项可选。默认无参数继续ASCII/SyntheticU1/SyntheticP1。`--text-profile unknown`在启动资源前受控退出1。

| 规则 | 实际行为 |
|---|---|
| 默认与选择 | 初次/刷新显式回ASCII；zh-CN、XML UTF-8与缓存均不推断账号编码，不持久化profile或账号 |
| 字节限制 | 每项编码后1..16B；936的8汉字16B可用、9汉字18B拒绝；UTF-8五汉字15B/四emoji16B可用，超限拒绝 |
| 严格编码 | 无trim、大小写变换、规范化、替换或best-fit；拒绝控制字符、孤立代理项、936不可映射字符。错误不回显输入 |
| 状态所有权 | 编码变化清两项输入、确认、候选；配置/文本I/O、确认和交换期间锁定，异步请求捕获自身编码，伪造锁定change恢复原选项 |
| 候选 | 原始名称1..41B，严格解码再逐字节回编码；按原bytes排序，不改状态配对。失败只显示有界占位，不允许选择或猜测编码 |

runtime升级为`moli.loopback.v3`，`credentialEncodings`准确列出三种独立实现能力，不能当作目标Windows代码页。原字节协议、Code/BIP/Origin/Host/capability和预算保持；[纯核心](../shared/README.md#launcher-v20)、[契约](../analysis/launcher-v20/implementation-spec.json)。Windows-936使用固定Unicode/Microsoft2.01表，含80=Euro、21791双字节映射，拒绝2149未分配组合及GB18030四字节扩展；未宣称现代Windows PUA/best-fit等价。

验收：Node369（新11）；Chrome155.0.8059.85/Playwright1.62.1，1280×1100及390×844，9编码检查/244请求和17回归流程+1时限测量/440请求通过；0非预期错误与console警告，回归中1次预期取消另列，总deadline10043ms。中文936/UTF-8实际请求均由Python独立编码/解密核对；交付936示例另实际跑通并正常退出。[编码](../analysis/launcher-v20/encoding-browser.json)、[回归](../analysis/launcher-v20/config-session-regression.json)、[示例](../analysis/launcher-v20/example-browser.json)、[验收](../analysis/launcher-v20/validation.json)。Browser插件未提供，使用已有Playwright，无新增浏览器依赖。

本轮误用旧脚本覆盖历史v19详细回执及3个临时PNG，精确原件不可恢复；当前结果单独保存，[事故与历史证据限制](../analysis/launcher-v20/artifact-output-incident.json)。实际ACP/IME、真实条款/账号持久化/服务身份、官方更新和游戏、Safari/真机/微信小程序仍未验收；下面按历史范围阅读。

<a id="launcher-v19"></a>
## stage64：配置准备、缓存和会话合流

新入口仍为`/web/login.html`，普通启动与自包含示例：

```sh
node web/examples/launcher-browser-local.mjs
node scripts/serve_launcher.mjs --target 127.0.0.1:YOUR_PORT --port 4174
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

把YOUR_PORT替换成已明确启动的原创本地TCP对端端口；普通服务没有初始化源，需手动选择配置文件/缓存。示例提供原创双XML/摘要/参考bytes和Python对端：打开输出URL→“检查并准备配置”→选择游戏/区域→输入`SyntheticU1`/`SyntheticP1`→原创测试文本四页确认→开始交换→候选选择。最多一次连接或10分钟；Ctrl+C只正常关闭自有服务。原4173配置/资源页与CSP保留。v18的固定运行槽位/+1许可示例政策由当前配置绑定替代，旧结果不追认为原Code已验证。

| 页面操作 | 实际行为 |
|---|---|
| 检查并准备配置 | 从启动时显式注入的本地源加载launcher/双XML参考bytes，再执行已有bootstrap：先主摘要/自更新，否则准备完整双XML。全过程一个10s剩余时限；成功仅应用内存候选，不自动缓存 |
| 读取本地配置文件 | 两份各≤1MiB，明确UTF-8/GB18030和裸&选项，保留原bytes、校验MD5/整体结构；失败没有部分模型 |
| 检查/保存/恢复缓存 | 使用既有launcher-local自有pair库；不在页面加载时打开/恢复。检查只读信息；按已知revision保存，显式恢复才应用pair；冲突/损坏不自动覆盖或删除，不保存账号/文本/选中项 |
| 游戏/区域选择 | 以记录ordinal区分重复Code，显示闭区/缺失；绑定整个BIP列表与启动白名单，任何一项未批准均拒绝，不静默过滤/改写 |
| 取消配置操作 | AbortSignal取消HTTP/缓存，代次/信号阻止晚结果；原生File Promise不能强制中断，读取结束后丢弃。事务已提交的晚取消仍明确报告已保存 |

[`bindLauncherSessionTarget`](launcher-target.mjs)重新校验原bytes/摘要/结构并调用已有选择器，返回冻结的Code原文/数值、游戏/区域ordinal、名称、原顺序端点和摘要身份。Code11请求word为11，许可键为Game11_License；0011保留Game0011文本，数值仍11。没有UI索引/+1换算。账号区只在有效目标且无配置操作时启用；配置/区域变化清旧输入、文本确认和候选会话。低层消息仍支持0..14；没有已证许可页的槽位会阻止确认，不能把低层范围当完整UI覆盖。

[`login-catalog.mjs`](login-catalog.mjs)只编排已有File/HTTP/bootstrap/cache与选择器，不读取账号。服务[`launcher-bootstrap-source.mjs`](../adapters/node/launcher-bootstrap-source.mjs)只快照调用者明确给的bytes，固定本机路由，无任意文件读取/上游代理；local main/package各32MiB、XML各1MiB、元数据4KiB、合计36MiB。runtime更新为moli.loopback.v2，给同源描述符；旧可选gameCode元数据不再驱动UI。原Bridge绑定、Host/Origin/capability/BIP与字节预算不变。[完整契约](../analysis/launcher-v19/implementation-spec.json)。

自更新候选只做ZIP/CRC/MD5字节验收，显示“未安装或执行”，没有可用catalog/会话目标。手动文件/缓存属于独立开发入口，不证明通过原在线初始化或官方信任。实际ACP/非ASCII、真实适用条款/账号存储、服务身份/opaque寿命、游戏与远程手机/小程序仍未完成。

Node358（新11）通过；Chrome155/已有Playwright1.62.1、独立临时上下文1280×1000/390×844，17流程+1时限测量通过。429回环请求，1次持有响应取消/超时负例ERR_ABORTED单列、0非预期错误/warn；实际总时限10052ms（含前段5500ms等待）。IndexedDB原生保存/刷新/显式恢复/CAS冲突/坏记录保留、HTTP自更新/摘要失败、原生WS/TCP及Python5完整请求/1取消均通过。[回执](../analysis/launcher-v19/browser-validation.json)、[修正](../analysis/launcher-v19/review-corrections.json)、[验收](../analysis/launcher-v19/validation.json)。Browser插件不可用，仍用已有Playwright，无新依赖。Safari、真机/微信小程序与官方服务未测。以下阶段按当时范围保留。

<a id="launcher-v18"></a>
## stage63：可操作的本地登录流程

新入口[`login.html`](login.html)通过专用回环服务运行。它使用原生浏览器WebSocket，经Node薄适配把已验收的会话字节送到启动时明确指定的原创本地TCP对端。没有默认官方地址，适配器只允许数字`127.0.0.1`，不接受域名/远程地址；远程手机访问尚未提供。原4173离线服务/两页CSP不变。

```sh
# 自包含原创服务：默认4174，最多处理一次连接或10分钟后结束
node web/examples/launcher-browser-local.mjs
# 已独立启动原创TCP对端时，必须明确给出目标与槽位
node scripts/serve_launcher.mjs --target 127.0.0.1:YOUR_PORT --game-code 0 --port 4174
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

将`YOUR_PORT`换成已启动的原创对端端口。`--target`可重复1..10次，页面按既有策略只在尚未打开连接的失败时有限轮换；打开后不自动重发。槽位0..14，四页资源未配置的槽位会阻止文本确认。启动后访问输出的URL，根入口302到`/web/login.html`以确保相对资源解析正确。Ctrl+C正常关闭此服务自有端口，原离线服务继续可用。

自包含示例的公开原创用户名/密码为`SyntheticU1` / `SyntheticP1`。选择“使用原创测试文本”→“开始逐页阅读”→三次“下一页”→单独确认→“开始本地交换”。四页说明明确标为原创测试内容，不提供真实服务条款；也可选择四份非空UTF-8本地文本，每份≤64KiB，fatal解码、拒绝NUL、用textContent展示。读取/来源由用户核对，决定只保留当前页面，丢弃原Profile写意图；不写账号、密码、文本或确认到存储。

输入由[`encodeLauncherASCII`](launcher-ascii.mjs)明确限定1..16个U+0020..U+007E字符，保留大小写/空格；实际Windows ACP/IME未知，XML的GB18030选项不用于账号。默认“每次清空”；切到“本页可保留”先明确确认并清空输入/确认，初始化用户名勾选true、密码false，之后分别由用户选择。默认密码在构造会话后清空，默认用户名在本次结束后清空；选择当前页保留不代表磁盘记忆。刷新/关闭丢失输入和决定。显式编辑输入或重新准备/阅读文本会释放旧会话、候选和选择；程序为默认清理字段时仍展示刚完成的本次结果。

[`createBrowserLauncherTransport`](launcher-websocket.mjs)使用显式`{origin,token,endpoints}`（可选测试WebSocket构造器），origin只允许规范`http://127.0.0.1:port`；返回与v17相同的openStream/read/write/close。开启等待Node实际TCP打开后的ready；write复制视图并等待独立桥接written序号，证明Node本地write完成，不是远端认证。每次最多一个read与write，二进制块≤64KiB、入站累计/队列≤4MiB、最多16384个消息；明确EOF先排空已收队列，异常关闭/无效控制受控失败，AbortSignal关闭连接并结算等待。

Node工厂[`createLauncherLoopbackServer`](../adapters/node/launcher-loopback.mjs)只绑定127.0.0.1，默认临时端口；GET源码白名单与runtime、Host/Sec-Fetch-Site、精确Origin/路径/subprotocol均核验。每次启动新32B capability，只由同源runtime提供、不写日志；在TCP打开前验证capability和端点序号。最多8连接、每消息64KiB、每向4MiB、8192入站消息/10秒；禁压缩，无上传/代理任意地址能力。关闭仅清理自有端口。JSON桥接控制是独立本地协议，原hello/挑战/请求/回包bytes不变。[完整契约](../analysis/launcher-v18/implementation-spec.json)。

按用户授权直接补入固定`ws8.22.0`/MIT，来源与19文件摘要见[依赖记录](../analysis/launcher-v18/dependency.json)，无安装脚本/原生插件/全局设置变更。浏览器仍用原生WebSocket；依据[上游说明](https://github.com/websockets/ws/blob/8.22.0/README.md)。

最终Node347/347（新增12）、Chrome155/Playwright1.62.1独立临时上下文10项/167源码回环GET通过，含4次Python完整请求独立解密、取消关闭、桌面/390px、UTF-8拒绝/文本字面渲染、输入/决定/候选失效与刷新。Browser插件不可用，使用已有Playwright。初次根资源404、旧候选残留两处实现问题已修，6候选误期望另列；[浏览器](../analysis/launcher-v18/browser-validation.json)、[修正](../analysis/launcher-v18/review-corrections.json)、[验收](../analysis/launcher-v18/validation.json)。

未验收：真实账号/条款/存储、非ASCII、配置/bootstrap合流、服务身份/官方接受、游戏交接、Safari、手机真机/远程HTTPS与微信小程序。页面的候选/选择始终显示认证未验证。下方各阶段按原范围保留。

<a id="launcher-v17"></a>
## stage62：实际字节流会话执行器

[`createLauncherSession(input)`](launcher-session.mjs)把既有REA字节/交换控制器接到显式`openStream`端口。构造只校验/快照输入，不联网、不请求随机数或查账号；调用`start()`才执行。无默认服务器、条款决定、账号读取/保存、游戏执行或UI登录按钮。现有两页保留`connect-src none`，未自动调用会话模块。

| 参数 | 契约 |
|---|---|
| `endpoints` / `firstEndpointOrdinal` | 1..10个own条目的`{address,port}`及明确起点；地址为非空≤253字符ASCII且无URL/控制字符，端口1..65535。按原顺序快照，可从已核实区域billingEndpoints显式映射，不自动访问XML目标 |
| `requestCounter/gameCode/usernameBytes/passwordBytes` | 既有类型10输入：UInt32计数、支持的0..14槽、各1..16B无NUL。只接显式原bytes、不猜代码页，构造时复制并清临时副本 |
| `openStream(endpoint,{signal})` | 返回带own `read/write/close`函数的端口或Promise；验收时保存三个函数，后续修改原对象不替换已接受方法 |
| 可选`randomBytes(20)` | 返回实际20B Uint8Array，可异步；默认调用平台`crypto.getRandomValues`，每次到达挑战才获取一份。覆盖值标记caller-provided，不冒称平台熵；调用者bytes不改写 |
| 可选`now/setTimer/clearTimer` | 默认`floor(performance.now())`、平台定时器；明确null/非函数拒绝。时钟须非递减安全整数毫秒，setTimer返回可清除handle |

`read({signal})`返回非空实际Uint8Array/ArrayBuffer≤64KiB或null EOF；空块拒绝，防止无进展循环。`write(bytes,{signal})`按顺序完成本地写入，不代表对端接受。缓冲在write Promise完成或取消后尽力清理；端口应在Promise完成前复制/消费参数。`close()`幂等、尽力关闭；拒绝/不响应不会无限挂住会话，cleanupErrors/closeCallsCompleted记录调用结果，不当作远端关闭证明。

| 方法/结果 | 行为 |
|---|---|
| `start({signal?})` | 单次Promise；重复调用返回同一Promise。返回`{snapshot,choices,error}`，error为冻结的受控code/message或null；不返回provider异常、URL、随机数或密钥 |
| `snapshot()` | state、原flow快照、本地I/O计数、熵来源和受控错误code；authentication始终unverified。写入计数表示调用/本地完成，不冒充远端回执 |
| `getChoices()/selectProfile(displayOrdinal)` | 关闭字节流后保留可重新复制的候选，显式选择才产生既有opaque选择副本；不执行IPC/游戏或推断认证 |
| `cancel()` | 中止连接/read/write/熵等待并清理；候选阶段也可取消释放内部候选。返回给调用者的副本由调用者管理 |

总截止点沿用core的10000ms，覆盖连接、字节I/O、随机数及处理，成功/拒绝后均复核绝对时间。仅尚未opened的开启失败有限轮换，打开后不重发凭据；取消/超时后迟到端口关闭，不应用旧结果。单块64KiB、累计入站4MiB是独立资源政策，拒绝块不交给协议解析。取消/清理是best effort，不承诺撤回已经提交给OS的bytes或强制JS秘密擦除。

错误复用`LauncherSessionError`。输入/端口为SESSION_INPUT、SESSION_ENDPOINTS、SESSION_STREAM、SESSION_BYTES，平台为SESSION_CLOCK、SESSION_TIMER、SESSION_RANDOM，运行为SESSION_READ、SESSION_WRITE、SESSION_BUDGET、SESSION_INTERNAL；Node端口为STREAM_INPUT、STREAM_DENIED、STREAM_CONNECT、STREAM_READ、STREAM_WRITE、STREAM_ABORTED、STREAM_CLOSED、STREAM_BUSY。原协议错误仍保留在flow/errorCode。输入错误在构造/启动校验时抛出；运行失败经start结果返回受控元数据。真实Profile/条款/账号生命周期不由这些状态推导。

Node验证端口位于[`adapters/node/launcher-stream.mjs`](../adapters/node/launcher-stream.mjs)，仅显式allowedEndpoints的地址/端口tuple可打开；规范化ASCII主机名或无方括号IP，不隐式增加来源。原生Socket有AbortSignal、noDelay和64KiB highWaterMark，逐块复制读取/写入，一次最多一个read和一个write；未把此文件作为浏览器TCP适配。依据[Node TCP API](https://nodejs.org/api/net.html)与[WebCrypto API](https://nodejs.org/download/release/v26.8.2/docs/api/webcrypto.html)，实际Node26.9.0验证另记。

```sh
node web/examples/launcher-session-local.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

示例只启动原创127.0.0.1 Python/PyCryptodome对端，执行候选/空候选/拒绝三组真实TCP，打印状态/计数/核对结果；不打印nonce/key/请求正文。无需新包，使用已存在Node26.9.0/Python3/PyCryptodome3.23.0。Node335/335（新35）通过，含真实10s超时、候选生命周期、4MiB预算、迟到连接/完成、取消和方法/错误所有权。Chrome6项/27源码回环GET通过；其中三组向量用原创注入流，另实测浏览器WebCrypto，不宣称浏览器真实TCP。[示例回执](../analysis/launcher-v17/example-output.json)、[浏览器](../analysis/launcher-v17/browser-session-smoke.json)、[验收](../analysis/launcher-v17/validation.json)。

未完成：会话UI、网页/小程序实际传输、服务身份/官方接受、代码页/真实条款/账号存储、游戏交接；Safari、真机和小程序未测。以下按对应阶段保留。

## stage61：UserMode核心浏览器核验

页面未增加模式/账号控件；新增共享核心的模式初始化/切换计划只接受明确非秘密设置，参数与独立取消政策见[shared v16](../shared/README.md#launcher-v16)。Chrome155/Playwright1.62.1新临时上下文5项/48回环GET通过：实际配置页标题/内容/CSP、54独立政策向量、冻结效果/显式输入清理/受控错误、现有本机缓存保存/恢复/离线计划，以及原创图形夹具渲染；0console warn/error、pageerror、requestfailed。[回执](../analysis/launcher-v16/browser-mode-smoke.json)、[验收](../analysis/launcher-v16/validation.json)。

仍为已有工具，无新下载。未重跑stage60完整14项/窄视口/GB18030流程；那些证据保留在下方对应阶段。模式UI、Profile实际持久化、真实账号/条款/会话、Safari/手机/小程序与游戏均未验收，HTTP初始化仍独立。

<a id="launcher-v15"></a>
## stage60：本机配置缓存页面

打开`http://127.0.0.1:4173/web/launcher.html`。页面复用既有v6配置规格和v14候选缓存，不增加账号或网络控件。启动时显示原创UTF-8示例，同时检查自有缓存；检查可建立空schema，但不自动保存XML或用缓存替换显示配置。保存前需先成功读取两份文件，或使用明确标记的原创示例。

| 控件 | 实际行为 |
|---|---|
| 保存当前配置 | 当前已校验双XML的原始bytes、摘要、编码/裸&选项整体提交；按已知版本比较，再次保存替换该pair |
| 恢复缓存配置 | 重新读取并验证缓存；清空旧模型/计划/目录，恢复编码与兼容选项，文件框清空并标记缓存来源；目录需另填 |
| 重新检查缓存 | 读取并验证最新pair，只更新缓存信息和版本，不替换页面当前配置 |
| 取消缓存操作 | AbortSignal取消在途操作；事务已完成时明确显示已保存，不能承诺回滚 |

固定profile为`launcher-local`，只操作`moli-mac.launcher.candidates.launcher-local`。缓存无文件名、安装目录、选中游戏/区域、条款决定、账号或会话。保存/恢复期间锁定数据控件并保留取消入口；版本冲突不自动覆盖，保留当前配置并要求重新检查。失败或取消后版本变为未知，重新检查后才可保存/恢复；缓存不可用、坏记录或未知schema不自动删除，也不妨碍读取文件和离线计划。恢复开始即清旧状态，失败不会继续展示旧计划。

`readLauncherCatalogBytes(file)`在读取前快照非空安全整数size≤1MiB，只调用一次`slice(0,size).arrayBuffer()`；核原生ArrayBuffer实际长度和读取后size，返回独立Uint8Array。候选按显式UTF-8/GB18030进行fatal解码/XML解析，摘要/缓存都保留原bytes，不规范化换行。`readLauncherText`保留原接口。更换文件/选项或载入示例使旧异步读取失效；缓存信息检查不应用配置。

Node288/288（新3）通过。Chrome155.0.8059.85/Playwright1.62.1、独立临时上下文的实际页面14项/125源码回环GET通过，含原生写入失败/取消/晚提交、双页冲突与旧异步结果；另从初次导航开始的390×844流程25 GET和GB18030文件保存→重载→恢复50 GET通过。最终三组0控制台warn/error及pageerror；仅原创数据。Browser插件不可用，使用已有Playwright，无新依赖下载。[页面](../analysis/launcher-v15/ui-validation.json)、[窄屏](../analysis/launcher-v15/mobile-validation.json)、[编码](../analysis/launcher-v15/encoding-validation.json)、[完整验收](../analysis/launcher-v15/validation.json)。

并发ESM模块读取曾出现连接重置；相同Handler的16请求对照中队列5仅6成功，队列64全部成功。本地服务仅把backlog改为64，核对原进程后SIGINT正常退出/同端口启动，再测16/16；路径白名单、127.0.0.1绑定和`connect-src none`不变。[诊断](../analysis/launcher-v15/server-burst-check.json)。初次窄截图多余顶栏条带原因未定；最终新上下文DOM/截图正常，[视觉记录](../analysis/launcher-v15/visual-review.json)。

HTTP bootstrap仍为独立API，未接入本页；Safari、实际手机/小程序、官方来源/连接、条款/账号/会话与游戏均未验收。以下记录保留其当时范围。

<a id="launcher-v14"></a>
## stage59：初始化prepare与独立候选缓存（保留）

`createLauncherBootstrap({httpClient}).prepare(input)`接既有GET客户端；input包括已载入的`launcherBytes/gameListBytes/regionListBytes`、显式`encoding`（utf-8/gb18030）、boolean `allowBareAmpersands`及5个own数据属性端点`launcherDigest/updateLocator/catalogDigests/gameList/regionList`。字节/端点在首个请求前快照；本地XML每份最多1MiB，主文件32MiB，允许空本地bytes供后续比较，成功候选XML必须非空并可解析。默认10s、最多60s单调总截止点覆盖多次GET与校验，可传AbortSignal。

主摘要不同：self→locator→package，完整URL仍受客户端显式来源/协议政策约束，不推断前缀或新增来源；ZIP/CRC/MD5成功只返回`launcher-update-candidate`，不碰XML、不执行或替换。主摘要相同：self→两摘要，只按GameList/RegionList顺序获取变化项，重新核raw MD5并对完整pair做显式decode/XML，返回`catalogs-prepared`及`catalogs`。`launcher-catalog-data.mjs`集中校验候选原始字节和结构；摘要匹配不等于可解析，更不等于来源可信/认证。失败不返回部分候选。

`createLauncherCandidateStore({profile,indexedDB?})`是另一个显式调用，profile为1..32位ASCII字母/数字/下划线/连字符。只使用`moli-mac.launcher.candidates.<profile>`库、version1、pairs store内一个pair record；初始化factory不访问库，首次read可建立这个自有schema，不扫描其他库。`read({signal?,timeoutMs?})`返回revision与已重新校验的catalogs，空库revision0/catalogs null。`commitPair(catalogs,{expectedRevision,signal?,timeoutMs?})`快照候选和期望版本，在单readwrite事务内比较版本后整体put；complete才报告committed，版本冲突不覆盖另一写入。

缓存错误code为CACHE_INPUT/UNAVAILABLE/CANDIDATE/CORRUPT/SCHEMA/CONFLICT/BLOCKED/STORAGE/TIMEOUT/ABORTED（均带`CACHE_`前缀）；消息不含数据库内容或底层异常。被中止事务保留旧pair。已进入committing/finished时取消可能太晚，此时成功回执有`cancellationTooLate`或`deadlineExceededAfterCommit`，不能把已提交结果说成已回滚。两个阶段不自动相接：prepare不写缓存，commit也不登录/接受条款/启动程序；所有结果来源仍未验证。

```sh
node web/examples/launcher-bootstrap-local.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

示例仅建立并关闭原创回环HTTP服务，4次GET准备2游戏/3区域候选，不提交缓存。Node285（新22）通过；Chrome原生12项/51回环GET通过，包含真实候选缓存write failure/abort/CAS/晚取消/重载，正例0console错误和requestfailed，HTTP500负例各1另存。[浏览器回执](../analysis/launcher-v14/browser-bootstrap-smoke.json)、[完整验收](../analysis/launcher-v14/validation.json)、[REA规格](../reports/launcher-static.md#launcher-v14)。未安装新依赖，Node未用fake IndexedDB替代浏览器证据。

stage59时配置/资源页面尚未调用这些模块，harness只验证原创数据和独立临时浏览器存储，不包含官方材料、账号或原文件更新。stage60已接入本地候选缓存，bootstrap/HTTP仍未接入页面；官方CORS/信任、原生替换回滚、Safari/手机/小程序和游戏仍未验收。

<a id="launcher-v13"></a>
## stage58：HTTP GET薄适配

[`launcher-http.mjs`](launcher-http.mjs)提供`createLauncherHttpClient({allowedOrigins, fetchImpl?})`，初始化不请求网络；返回冻结client的`getBytes(absoluteUrl,{kind?,signal?,timeoutMs?})`才发送GET。origin列表必须有1..16个own项，按初始校验长度构建私有Set；完整URL限4096字符，HTTP(S)、无用户密码/fragment且必须匹配所选来源。没有官方默认端点、自动重试、认证头、文件写入或执行。

响应使用平台Fetch与流式reader，保留原始Uint8Array/NUL/高位字节，返回独立`bytes`、`byteLength`、`status`、`declaredLength`及`trust:'unverified'`。kind默认metadata=4096B，catalog=1MiB，package=32MiB，均按实际解码后bytes计；最多65536次read。Content-Length仅作提前预算hint，不能当作Fetch解码后精确长度。默认10s、1..60000整数ms总截止点包含响应头和全部read；单调时钟在成功/拒绝/最终复制后复核。不能抢占JS同步执行，取消/释放best effort，不保证对端已关闭。

使用GET/credentials omit/redirect error/cache no-store/no-referrer，严格可检查2xx。它是独立平台政策，不复现原WinINet状态查询失败仍读取、重定向或缓存规则；浏览器CORS/CSP仍需满足。[Fetch规范](https://fetch.spec.whatwg.org/#fetch-method)、[流取消规范](https://streams.spec.whatwg.org/#default-reader-cancel)。`AbortSignal`按宿主getter校验，不承诺所有运行环境都拒绝透明Proxy。

| 错误code | 含义 |
|---|---|
| HTTP_INPUT / HTTP_SCHEME / HTTP_ORIGIN | 输入、协议或显式来源未满足 |
| HTTP_RESPONSE / HTTP_REDIRECT / HTTP_STATUS / HTTP_LENGTH | 不可检查响应、重定向、非2xx或声明长度格式 |
| HTTP_BODY_LIMIT / HTTP_READ_LIMIT | 实际/声明字节或read次数超预算 |
| HTTP_TIMEOUT / HTTP_ABORTED / HTTP_NETWORK | 总截止、主动取消、请求/读取失败 |

失败不返回部分内容，不把URL、取消reason或provider原错误拼进消息。GET到的bytes仍须交现有清单/ZIP等核心；成功读取不是可信来源、更新、就绪或认证。原始rtm数值规则未证，不在适配器中猜造查询参数。[固定样本规格](../reports/launcher-static.md#launcher-v13)。

从项目根运行自包含本地示例；它建立并关闭原创回环服务，进行3次GET/内存比较，文件写入0：

```sh
node web/examples/launcher-http-local.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

Node263（新18）通过。Chrome独立临时headless会话6项/36回环GET通过：清单→候选目录、raw/空/gzip、ZIP→CRC/MD5、十项负例、来源/阻塞截止及原生cookie/referrer/auth省略；正例0console错误/请求失败，负例预期4条console消息/9次请求失败分别保留。另18次native与adapter/有无Playwright拦截对照均通过。前两次合并smoke的CDP ERR_ABORTED未计通过，根因未定，详见[运输诊断](../analysis/launcher-v13/browser-transport-diagnostic.json)及[验收](../analysis/launcher-v13/validation.json)。

**页面边界：** 本轮只在原创test harness接通传输，现有资源/配置页面保留`connect-src none`且不调用此模块。未重跑旧两页UI/真实文件/窄视口；Safari、手机、小程序、官方HTTP/CORS/信任及存储/更新事务仍未验收。无需新依赖安装。

## stage57清单与元数据核心运行核验

现有共享入口加载`launcher-manifest.mjs`，无新增页面控件。Chrome155/Playwright1.62.1独立临时headless会话最终6项通过：原配置计划、15原创主摘要投影、4目录计划/分支优先级、固定本地文件与历史摘要重建、更新ZIP回归及原资源页；46回环GET、0warn/error。[回执](../analysis/launcher-v12/browser-manifest-smoke.json)、[共享API](../shared/README.md#launcher-v12)。

首次检查因按钮等待超时停止，随后独立诊断观察到4个本地模块连接重置；现有服务存活、直接GET200，根因未定。保留[失败记录](../analysis/launcher-v12/browser-first-failure.json)，新上下文完整复核通过；没有重启服务、修改产品或放宽断言。前次失败不计成功。

历史66B XML摘要重建匹配保留SHA256，主摘要为明确合成本地值；离线结果仅RegionList需刷新，不是新服务器状态或实际下载。所有文件只作bytes，未执行、替换或建立会话。Safari/手机/小程序、真实文件UI和窄视口完整流程本轮未重跑。下列为保留记录。

## stage56更新包核心运行核验

新`launcher-update.mjs`/内部MD5模块由现有共享入口加载，页面未新增下载或安装按钮。Chrome155/Playwright1.62.1独立临时headless会话实际6项通过：15原创ZIP/输出SHA、固定真实ZIP的纯字节解码、CRC/MD5拒绝与子类、23个旧许可digest向量、原配置计划和资源页。44回环GET，0warn/error。[回执](../analysis/launcher-v11/browser-update-smoke.json)。

真实包只作为惰性bytes进入解压/摘要，未执行内容、发起官方请求或替换文件；结果来源仍未验证。Pako本地ESM无运行时获取依赖。实际下载/可信清单/存储事务及Safari/手机/小程序仍未验。[共享v11 API](../shared/README.md#launcher-v11)。以下为保留记录。

## stage55本地许可/输入核心运行核验

共享入口新增`launcher-local.mjs`，页面未新增许可/账号/连接控件。Chrome155/Playwright1.62.1独立临时headless会话6项通过：23独立digest向量、四页＋单独决定意图、版本/force/缺页/拒绝/取消/子类、四组合reset所有权及既有两页；38回环GET，0warn/error。[回执](../analysis/launcher-v10/browser-local-smoke.json)。

运行仅使用公开原创输入和availability快照；没有展示或接受实际条款，没有真实用户数据或存储写入。实际显示/决定/存储适配、代码页、手机/小程序/Safari未验。[共享v10 API](../shared/README.md#launcher-v10)。以下为历史运行记录。

## stage54离线交换流程运行核验

共享入口新增`launcher-flow.mjs`，页面未新增账号或连接控件。Chrome155/Playwright独立临时headless会话实际6项通过：原配置计划、3组完整原创交换字节/结果、有限轮换/陈旧代次、deadline/晚到事件、候选副本隔离/显式选择、原资源夹具启动；36观察请求仅回环GET，0控制台warn/error。[回执](../analysis/launcher-v9/browser-flow-smoke.json)。

控制器输出的连接/关闭意图没有被执行，尚无真实socket/平台时钟/CSPRNG或代码页适配；始终未验证认证。示例/调用契约见[共享v9](../shared/README.md#launcher-v9)。本轮未重跑Safari、手机/小程序、真实文件导入/390px全套；下方阶段记录保留。

## stage53输入/候选核心运行核验

页面未新增账号/密码或联网控件，共享入口新增`launcher-login.mjs`。Chrome155/Playwright独立临时headless会话6项通过：既有配置计划、3组原创新输入字节、6组候选与重复排序、受限行拒绝/来源绑定、加密分段→候选完整组合、原资源夹具启动。34观察请求均回环GET、0控制台warn/error。[回执](../analysis/launcher-v8/browser-login-smoke.json)。

本轮只用公开原创测试常量；不输出请求/opaque内容的Node示例见[v8接口/运行](../shared/README.md#launcher-v8)。真实代码页/认证、Safari、手机/小程序和旧真实文件/390px完整流程均未在本轮验收。下方stage52/51记录保留为对应阶段证据。

## stage52共享核心运行核验

页面仍为本地配置/资源工具，未增加账号或连接控件。共享入口新增回包、模幂和固定未压缩Blowfish记录模块，固定MIT依赖随`shared/vendor/`本地ESM加载，无新构建/远程依赖。Chrome155/Playwright实际运行6项通过：3组密钥计算、9组记录、最大记录独立摘要、内外层分段组合，以及原配置计划和资源页启动；32个观察请求均为回环GET、0控制台warn/error。[回执](../analysis/launcher-v7/browser-core-smoke.json)。

新增浏览器smoke曾误将原创资源夹具的控件/计数提示写成真实文件状态断言；按`web/app.mjs:loadFixture`的实际契约修正，保留[失败与修正](../analysis/launcher-v7/browser-smoke-test-correction.json)，没有改产品来满足错误测试。下方stage51的真实文件导入/390px完整流程本轮未重跑；Safari、手机和小程序仍未验收。共享接口/命令见[v7使用说明](../shared/README.md#launcher-v7)。

<a id="launcher-v6"></a>
## 登录器本地配置页（2026-10-27）

从图形页顶部“登录器配置”或`http://127.0.0.1:4173/web/launcher.html`进入。复用下方回环服务，无新构建依赖。新增页面基于[REA区域规格](../reports/launcher-static.md#launcher-v6)，不是无证据的游戏演示；认证、自动更新、执行游戏和官方联网尚未实现。

选择合法本地GameList/RegionList、明确GB18030或UTF-8，每份最多1MiB；默认严格裸&，需兼容时显式勾选并报告计数。文件经slice与fatal TextDecoder解码，读取仅进入页面内存、不上传；stage60起可另行点击保存到本机缓存。更换文件/编码/兼容选项清空旧目录数据与计划；异步generation防止旧读取覆盖新选择/原创示例。名称只用textContent显示。启动原创示例明确设置UTF-8/严格裸&；真实文件编码由用户选择。

游戏按ordinal选择，Code可重复；区域缺失、重名或关闭可见且不能选用。原配置安装目录只作Windows路径metadata，不读取磁盘；“生成离线计划”显示本地数据，认证固定未验证，不生成shell命令或IPC。默认两Code11与维护/缺失区域均为原创夹具；页面没有账号、密码、登录或下载按钮。

新增模块：`launcher.html/launcher.css`、`launcher-app.mjs`、`launcher-file-io.mjs`、`launcher-fixture.mjs`。File适配新增4项Node测试；共享区域/消息另36项，总125/125。现有图形入口保留。

本轮用已有Playwright1.62.1及已安装Chrome155的独立headless临时会话验收：1280×1000、390×844、12项检查，真实旧XML导入5游戏/12区域及5处裸&兼容、同Code切换、错误/陈旧读取清理、安全文字及原图形页导航通过。无控制台warn/error，页面所有请求均为回环GET源码加载。[浏览器回执](../analysis/launcher-v6/browser-validation.json)、[完整回执](../analysis/launcher-v6/validation.json)。截图仅原创示例，保存于回执列出的本机临时路径；不是Safari、手机真机或小程序验收。普通依赖已具备，没有安装/操作原登录器或VM。

本目录把已有离线实验室的海军蓝/薄荷色工具界面移植为静态 HTML、CSS 和 ESM，无框架、构建依赖、CDN 或外部字体。目标是**有证据的资源核验工具**，不是可游玩的跨平台游戏，也不是微信小程序成品。

## 图形资源页功能与边界

- 显式选择用户有权读取的 `GraphicInfo*.bin` 和配对 `Graphic*.bin`。
- 索引限制为 64 MiB、完整 40 B 记录；图形文件仅通过 `File.slice(start,end)` 读取选定记录，单帧上限由共享核心限制为 32 MiB。
- 核验记录范围、RD 头与索引尺寸，并只显示共享核心支持的 v0/v2 原始索引字节。v1/v3 压缩版本明确拒绝，不显示缓存图或占位官图。
- 像素按 0–255 映射为灰度，按头部尺寸逐行排列；**调色板通道、官方颜色、显示方向、透明色与游戏绘制规则未确认**。画布额外限制每边最多 4096 像素。
- 默认展示本工程原创的 64×48 合成夹具，清楚标记来源。它只验证解析和显示，不冒充官方资源。
- 记录序号和图像 ID 分开；提供上一条、下一条、直接序号选择与显示比例。
- 文件更换立即清除画面和旧摘要；异步请求使用递增 generation，防止旧文件读取完成后覆盖新选择。
- 图形资源页没有登录、更新、游戏通信、上传、下载导出、遥测、Service Worker、持久化文件内容或自动扫描目录。本地配置页的显式双XML候选缓存见stage60；两页CSP均设置 `connect-src 'none'`。

## 模块

| 文件 | 职责 |
|---|---|
| `index.html` / `styles.css` | 语义化控件、桌面左右布局、720px以下堆叠、44px以上触控按钮、焦点和状态反馈 |
| `app.mjs` | 文件选择、记录导航、异步状态和摘要；只通过共享解析API核验 |
| `file-io.mjs` | 浏览器 File/Blob 有界读取适配，无整份 Graphic 文件读入 |
| `pixel-view.mjs` | Canvas 灰度显示、缩放、可滚动查看；不解释游戏渲染语义 |
| `fixture.mjs` | 原创合成数据生成器；不包含官方文件字节 |
| `../shared/index.mjs` | 与浏览器无关的结构解析核心，可供后续其他平台适配 |

## 运行与测试

ESM 需要同源本地 HTTP 服务，不能依赖直接双击 `file://`。服务应仅暴露 `web/` 与 `shared/`，不要把含安装包的项目根目录开放给网络。从项目根执行以下命令，然后在本机打开 `http://127.0.0.1:4173/web/`。Ctrl-C停止；固定回环地址，不能从手机远程访问，未部署。

```sh
python3 scripts/serve_web.py --port 4173
```

从项目根运行文件适配测试：

```sh
node --test web/tests/*.test.mjs
```

本轮 7 项文件适配测试通过，见 [测试日志](evidence/file-io-tests.log)。测试涵盖索引预算/整记录、短读、范围溢出、5 GiB 图形文件只读选定范围、禁止整文件读取和原创夹具解析。独立只读审查及 Node DOM 桩复核确认：读取时记录输入禁用，载入夹具/更换文件后旧请求不会覆盖新状态，非法检查意图也会取消旧请求。真实资源的独立验证、桌面/手机尺寸浏览器验收由项目报告分别记录；手机尺寸适配不等于实际手机或微信小程序验收。

后续小程序应复用 `shared/`，替换 File/Blob、DOM/Canvas 与输入适配；不能把此网页直接宣称为小程序或认为 WebSocket/TCP 适配即可连接官方服务器。
