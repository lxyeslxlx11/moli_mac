<a id="launcher-startup-functional-specification"></a>

## 先完成全能力 REA 规格，再按依赖复刻（2026-11-15）

**换机入口**。从交接页核对产品基线、能力缺口、最近的战斗回放和迁移后的运行命令。文档保留原始证据入口和此次可随 Git 迁移的回执。 [换机交接](reports/project-handoff.md)

先用 REA 把登录器和游戏的全部需求操作落实到可实现、可验收的规格。40 个能力域中，19 项已有固定样本本域规格，其余 21 项按六组核对。每组先用已有证据判定哪些操作可交接，再把会改变实现或验收的缺口列清，按同版样本集中补证。A1–A4 通过后，从 stage306 按 D0–D6 补差异，桌面网页、移动网页和微信小程序共用业务核心。四批入口明确且已有材料的分析实测约 15–24 分钟一组，完整交付时间取决于剩余规则、开发差异和同版材料。 [开发流程](reports/development-plan.md#capability-first-workflow) · [当前排程](reports/development-plan.md#capability-first-next-analysis) · [估时依据](reports/development-plan.md#capability-first-estimation)

三端资源重开已补共用规格，覆盖同长错段、保持旧读者的素材版本、实际回调结束及持久发布。本机在微信适配器复现旧读者读到新档切片，73 项资源和存储回归通过。完整持久发布与真机继续验收。 [资源规则](reports/architecture-and-milestones.md#resource-reopen-reader-identity) · [本机对照](reports/validation.md#resource-reopen-reader-identity-validation)

第二套窗口的实际帧调用等待匹配证据。Chrome 已用同一实际地图、角色素材和调色表提交画面，同时运行一轨音乐和两路音效。三个复访画面匹配，未新增归档读或图像解码。关闭时先停声部，晚到图块清零后结算取消。71 项本机回归通过，D0/D5 共用该组用例。真正的产品场景、持久发布和真机继续验收。 [联合占用规格](reports/architecture-and-milestones.md#real-map-mixed-resource-budget) · [核验](reports/validation.md#real-map-mixed-resource-budget-validation)

桌面 Chrome、微信 SDK 和移动 Safari 模拟器已有音频宿主回执。移动 Safari 在可信触摸后恢复音频，离页后的迟到读取已清零，旧上下文的关闭完成独立核对。 [桌面](reports/validation.md#browser-audio-voice-budget-validation) · [微信 SDK](reports/validation.md#wechat-sdk-audio-voice-validation) · [移动 Safari](reports/validation.md#mobile-safari-audio-lifecycle-validation)

七组动画的坐标数据可在同一资源根内保留一份快照。本机对照遍历 2,520 个实际动画，每根可少保留 47,946,336 字节素材。REA 确认原版对同名数据复用已开句柄并跳过后续索引，两个有序输入显示现有目录的覆盖差异。D0/D5 共用这一份规则和用例，84 项现有回归通过。 [原版规则](reports/game-static.md#animation-coordinate-alias) · [本机核验](reports/validation.md#animation-coordinate-sharing-validation)

动画缺档规则已并入该规格。实际 ZIP 缺 V2 两个动画档，主组首次读取仍正确。固定 SE 对主组缺档中止启动，对可选组仅缺数据保留索引，对坐标索引的非 1 标记跳过该索引并继续。stage306 的坏标记使候选失败，差异和旧根可用性已纳入一组复刻用例。83 项本机回归通过。 [来源与差异](reports/game-static.md#animation-load-and-first-lookup) · [对照](reports/validation.md#animation-load-failure-validation)

固定 SE 的换曲配置编码会覆盖 SKL266 的三个暂存字。当前已核所选普通入战链。地图旧请求最迟可在 `10/0` 的音频维护触发编码，首次背景捕获随后清请求。`10/6` 的首次读值继续按接收清零和后续实际写入核对。33 项入战和音频本机回归通过，原版实际首读沿 BF-T36 验收。 [编码范围](reports/game-static.md#battle-266-audio-map-save) · [普通入战顺序](reports/game-static.md#battle-entry-audio-request) · [本轮核验](reports/validation.md#battle-entry-audio-request-validation)

启动交接、入场和恢复已核一组合用规格。两版历史游戏共用断线确认和选服退役条件。三个原创试次核入场等待、读结束顺序及新实例画面，88 项本机回归通过。当前同版游戏读取交接仍待对应材料。 [组合规格](reports/game-static.md#fixed-se-disconnect-recovery) · [核验结果](reports/validation.md#capability-launch-entry-recovery-validation)

固定 Item 和 SE 共用入场请求字段与回复准入。Item 已核首次等待窗、失败确认、地图和本机角色两项就绪位及淡入后的普通帧顺序。11 项相关本机回归通过，实际首帧待验。 [两版共用用例](reports/game-static.md#fixed-item-world-entry) · [核验记录](reports/validation.md#fixed-item-world-entry-validation)

固定 Item 的状态 5 已核角色和场景复位、缓存读回、经典窗初始化及发布状态 6 后的 28 字节清理。两版共用选角复位用例。20 项本机会话回归通过，实际换角和三端效果沿原验收。 [复位规格](reports/game-static.md#fixed-item-state5-reset) · [回归记录](reports/validation.md#fixed-item-state5-reset-validation)

固定 Item 的新建角色已与 SE 共用提交、回复和名单刷新用例。已核提交前的角色资料写入、拒绝和超时确认、成功后清两槽并重新取名单。14 项本机回归通过，实际持久资料和同版流程沿原验收。 [创建规格](reports/game-static.md#fixed-item-character-creation) · [核验记录](reports/validation.md#fixed-item-character-creation-validation)

固定 Item 与 SE 的角色名单共用两槽解析、内容代及预览数据规则。Item 已核维护与读取失败的提示，以及已有角色与空槽各自的输入条件。24 项本机回归通过，实际输入和呈现沿同一组用例验收。 [角色名单规格](reports/game-static.md#fixed-item-character-roster) · [回归记录](reports/validation.md#fixed-item-character-roster-validation)

固定 Item 与 SE 的已有角色外观操作已共用规格。切换外观更新角色记录，切换样式还会重建预览。两版三张预览表的 42 个编号一致，19 项本机回归通过。实际动画帧和三端控件效果待验。 [外观与样式规格](reports/game-static.md#fixed-item-character-appearance) · [回归记录](reports/validation.md#fixed-item-character-appearance-validation)

固定 Item 与 SE 的选角预览已共用动画查找与计时规则。留存素材的五个编号通过现有资源库生成十帧软件像素，指定读取失败后重试成功。29 项本机回归通过，页面实际提交沿同一用例验收。 [帧规则](reports/game-static.md#fixed-item-character-preview-frame) · [素材核验](reports/validation.md#fixed-item-character-preview-frame-validation)

选角预览已追到对象池、绘制记录和图块消费。两版先处理选角，随后清理并收集对象。留存素材核对四种软件帧及一次取消在途旧读，66 项本机回归通过。原版窗口和三端实际提交继续验收。 [绘制与退役规则](reports/game-static.md#fixed-item-character-preview-draw) · [本机核验](reports/validation.md#fixed-item-character-preview-draw-validation)

建角的两份预览已与固定 SE 对照编号表、转向区域和动作表。返回外观时保留选择，两份预览重新朝向 5。留存素材生成四次 640×480 软件预览层，18 项现有回归通过。完整建角画面和三端输入待验。 [双预览规格](reports/game-static.md#fixed-item-character-creation-preview) · [核验记录](reports/validation.md#fixed-item-character-creation-preview-validation)

建角详情已核两版加点、三种肖像模式和确认分支。共享草稿直接加点在两种对向已有点数的条件下与来源不同，已登记共用准入差异。18 项现有回归通过。三端实际按住、肖像和确认窗仍待验。 [详情规格](reports/game-static.md#fixed-item-character-creation-details) · [本机对照](reports/validation.md#fixed-item-character-creation-details-validation)

两版窗口缩放和鼠标位置写入已共用规格。原版移动位置独立于按下及松开，当前网页会在三种事件中更新同一位置。微信本机回环验证了最新尺寸生效后命中目标角色。37 项相关回归通过。 [输入规格](reports/game-static.md#legacy-item-pointer-position) · [核验记录](reports/validation.md#legacy-item-pointer-position-validation)

固定 SE 的普通右键已核选格及转向、拾取、角色查询的独立条件。本机让移动、按下和释放落在不同格，当前网页选中了与原规则不同的角色。88 项相关回归通过。 [右键规格](reports/game-static.md#fixed-se-ordinary-right-click-position) · [本机对照](reports/validation.md#fixed-se-ordinary-right-click-position-validation)

固定 SE 的普通对话已核替换、关窗顺序和拾取恢复。现有共享客户端在宠物训练等待期间可以拾取，固定样本在这段等待内仍占用。7 项本机回归通过，差异交 D0/D3 复用共用窗口与输入。 [对话与拾取规格](reports/game-static.md#fixed-se-ordinary-dialog-lifecycle) · [核验结果](reports/validation.md#fixed-se-ordinary-dialog-lifecycle-validation)

固定 SE 的普通宠物和骑乘技能窗共用一份选行规格。两路按可见行检查资格位，按对应角色的 MP 判定，并沿窗 26 的开关和提示顺序交接。两组本机对照确认等额 MP 可选，现有语义拒绝时缺原版资格位拒绝提示音。51 项相关回归通过。 [来源规则](reports/game-static.md#fixed-se-battle-skill-list-admission) · [本机核验](reports/validation.md#fixed-se-battle-skill-list-admission-validation)

六组需求已完成本轮对账。训练、工艺和图鉴共用经典帧规格及第二套窗口的分派取证。战斗已补核护卫空槽和替换后动作 24、71、217 的取值，六个本机对照及 67 项相关回归通过。 [六组交接](reports/development-plan.md#capability-first-scheduling) · [原版规则及本机结果](reports/game-static.md#battle-266-guard-slot-consumption)

固定 SE 的两种换人动作已共用登记规格。回落时清槽和登记新角色在同一回调完成。旧 B 若在新 B 登记后执行动作 49，所核指令仍按槽清零。本机两组对照及六项相关回归通过。 [取值与回调顺序](reports/game-static.md#battle-slot-publication-order) · [本机核验](reports/validation.md#battle-slot-publication-validation)

配置器和两版历史游戏已共用一份冷启动输入规格。留存发行配置和生成的默认配置通过三组本机对照，开发复用现有配置编解码与启动读取。降档输出的实际读者和当前同版仍待证。 [文件与档位规则](reports/game-static.md#legacy-render-startup-tier-input) · [本机对照](reports/validation.md#legacy-render-startup-tier-input-validation)

微信游客工程已在三个独立工具进程中核对 2.55 GB 分段素材。首次重开沿原临时路径完整读回，受控缺第 2 段后只补选该段。D0/D5 复用同一个资源恢复入口。 [跨进程回执](reports/validation.md#wechat-sdk-segment-process-reopen-validation)

固定 SE 的 37 个待定收包入口已逐项核对，35 个已归入具体操作，其中 34 个复用已有规格。一条 16 位状态和一条失败提示仍等业务触发证据。现有解析器通过 74 组原创输入。 [收包规格](reports/game-static.md#fixed-se-receive-operation-admission) · [本机核验](reports/validation.md#fixed-se-receive-operation-admission-validation)

两版历史游戏的地址变化提示已共用收包、比较和保存规则。固定 SE 的所选通信重开会保留旧值，结论来自静态路径。本机七组对照确认现有解码可复用，43 项相关回归通过。 [提示规格](reports/game-static.md#legacy-address-notice-retention) · [本机核验](reports/validation.md#legacy-address-notice-retention-validation)

两版历史游戏已共用 `Ok?` 的通用失败提示和 `Kh>` 的低字写入、入场清零规则。现有解码通过 10 组本机对照。两条消息的实际业务触发继续按具名证据核对。 [两个收包规则](reports/game-static.md#legacy-unassigned-receive-outcomes)

固定 SE 的 17 个待定发送入口均已归入具体业务，核对 149 处直接调用和 34 项编码对照。宠物昵称的两种文字准备规则已并入现有规格。 [发送规格](reports/game-static.md#fixed-se-send-operation-admission) · [本机核验](reports/validation.md#fixed-se-send-operation-admission-validation)

固定 SE 的 20 个控件后回调已核到 24 个经典窗口登记。共用滚动算法、各窗刷新先后及交易和仓库在绘制时更新的选择值已登记。该批 84 项本机回归通过。 [帧规格](reports/game-static.md#fixed-se-classic-post-control-frames) · [本机核验](reports/validation.md#fixed-se-classic-post-control-frames-validation)

固定 SE 的经典工作流程已核对 27 个控件入口及 43 个登记。列表选择、制作与刻印、采集重启、目标重查和战斗略过各有原版条件。通用输入和关窗继续用同一份规格。 [工作控件](reports/game-static.md#fixed-se-classic-work-controls) · [关闭规则](reports/game-static.md#fixed-se-classic-destructor-callbacks)

固定 SE 已确认黑名单的 End 入口、冒险者日志的 F9 入口，以及共用删除确认的 Ctrl 条件。三个窗口的 28 个待定控件登记均指向操作规格。 [开窗、控件与关闭规则](reports/game-static.md#fixed-se-classic-modal-blacklist-log)

固定 SE 的名片、家族和迷你邮件窗口已核对 71 处控件登记。三行与九行布局分别保存偏移，实际查看、写信、删除和称号操作按当前记录决定目标。 [名单操作规格](reports/game-static.md#fixed-se-classic-contact-list-controls)

固定 SE 已核家族详窗按权限安装 35 处运行回调、32 项称号草稿的保存条件，以及成员称号的选择和确认。 [家族详情与称号](reports/game-static.md#fixed-se-classic-family-edit-controls)

固定 SE 家族兽和饲料箱已核对喂食选择、改名、存取与各自的关闭路径。现有共享客户端的两条合成用例通过。 [规格与回执](reports/validation.md#fixed-se-classic-family-pet-feed-controls-validation)

固定 SE 的银行与交易已核对 40 处控件登记。银行切换物品、宠物和金币页时更新参与控件，交易分别读取本方和对方的阶段。四条既有共享客户端合成用例通过。 [操作规格](reports/game-static.md#fixed-se-classic-bank-trade-controls) · [本机核验](reports/validation.md#fixed-se-classic-bank-trade-controls-validation)

固定 SE 的经典邮件已核对三扇窗口的 30 处控件登记。正文进入附件窗的复制顺序、宠物与物品槽的选择，以及群发列表的逐帧滚动均已纳入邮件规格。现有家族附件编码和来信解码通过本机对照。 [操作规格](reports/game-static.md#fixed-se-classic-mail-compose-controls) · [本机核验](reports/validation.md#fixed-se-classic-mail-compose-controls-validation)

固定 SE 已核命名与内嵌色表的选用、24 位颜色规则和缓存标签。非零选择遇空槽时会跳过上传并更新标签。现有 RGBA 的九组原创夹具和 70 项本机回归通过，原设备像素待验。 [原版规格](reports/game-static.md#fixed-se-explicit-palette-upload) · [本机核验](reports/validation.md#fixed-se-explicit-palette-upload-validation)

固定 SE 的战斗窗 26 已核拖放取消和条件恢复文字焦点。窗体先按编号处理拖放，再按控件数据和默认活动窗恢复。五次本机指针事件和 96 项相关回归通过。原版实际回调和战斗暂存字继续按用例验收。 [原版规格](reports/game-static.md#battle-266-window-input-retirement) · [本机核验](reports/validation.md#battle-266-window-input-retirement-validation)

固定 SE 的出售、鉴定和修理共用撤选及报价刷新顺序。本机三组报价窗口通过旧修订号检查，104 项相关回归通过。下一批优先用已有规格核销待定收包入口。 [共用规格](reports/game-static.md#fixed-se-shop-retirement-refresh) · [本机核验](reports/validation.md#fixed-se-shop-retirement-refresh-validation) · [取证安排](reports/development-plan.md#capability-first-next-analysis)

固定 SE 的输入法组合串与候选已核到各自的文字队列。本机 14 个字号与原表一致，候选的优先级 226 已登记到共享呈现差异。53 项相关回归通过，原版实读和三端输入法待验收。 [原版规格](reports/game-static.md#battle-266-ime-presentation) · [本机核验](reports/validation.md#battle-266-ime-presentation-validation)

固定 SE 的 UTC 分钟缓存、时区查错与游戏日期发布已核。现有客户端通过原创日界、32 位环回及秒数错误用例，113 项相关本机回归通过。原版切换日失败回退待适用记录。 [原版规格](reports/game-static.md#battle-266-host-calendar) · [本机核验](reports/validation.md#battle-266-host-calendar-validation)

固定 SE 的默认 16、24 位调色已核到表面掩码、更新范围和实际上传。两种模式共用 RD 字节索引，分别写 WORD 和三字节 BGR。现有 RGBA 可复用，75 项本机回归通过。 [原版规格](reports/game-static.md#fixed-se-palette-output-depth) · [本机核验](reports/validation.md#fixed-se-palette-output-depth-validation)

Item 的重建调色与 SE 共用默认表转换。已核位深来源、动态更新范围和 16、24、32 位上传。现有 CGP 的 32 个固定色与 Item 原指令一致，36 项本机测试通过。 [两版共用规格](reports/game-static.md#fixed-item-palette-output-depth) · [核验范围](reports/validation.md#fixed-item-palette-output-depth-validation)

Item 和 SE 的命名色表映射逐字节一致，显式色来源、图块标签和延期共用 PR-A09/A10。现有共享选择器与资源库的 8 项本机用例通过。原版表面像素及短色段尾部待适用回执。 [共用用例](reports/game-static.md#fixed-item-explicit-palette-upload) · [本机核验](reports/validation.md#fixed-item-explicit-palette-upload-validation)

固定 SE 的 `Ta>` 已核到显式调色、时段跟随及换图首帧的共同顺序。`502950` 的职责已更正为消费待选颜色。现有客户端六组本机对照均保留字段，画面摘要一致，111 项相关本机回归通过。 [原版规则](reports/game-static.md#fixed-se-scene-palette-follow) · [本机核验](reports/validation.md#fixed-se-scene-palette-follow-validation)

固定 SE 的启动标识已核对黑场、标识、等待与退场的调色顺序。每个合资格的逻辑帧先处理调色，再决定是否绘制。共用颜色运算可复用，启动选材和帧接线待开发。121 项相关本机回归通过。 [原版规格](reports/game-static.md#fixed-se-startup-palette-publication) · [本机核验](reports/validation.md#fixed-se-startup-palette-publication-validation)

桌面 Chrome 实测游戏页在标签页隐藏时暂停绘制并继续使用原连接。原连接在另一次隐藏期间结束后，重选素材可建立新连接并入场。两种结果已并入桌面与移动共用的验收用例，102 项相关本机回归通过。 [宿主规格](reports/network-portability.md#desktop-game-tab-visibility) · [本机验收](reports/validation.md#desktop-game-tab-visibility-validation)

固定 SE 的出售、鉴定和修理共用 12 处已核报价窗登记。取证补齐帧首放置、待关闭窗口清除及同步组关闭的次序，已纳入同一个窗口与商店规格。52 项共享客户端回归通过，原版实际关窗重叠与三端验收待执行。 [入口及顺序](reports/game-static.md#fixed-se-shop-entry-admission) · [本机核验](reports/validation.md#fixed-se-shop-entry-admission-validation)

微信游客工程已在开发者工具正常退出并启动新进程后读回原创小 ZIP、双槽缓存及发布与启动历史。8 个原文件摘要一致，100 项已有本机回归通过。完整素材持久化、正式产品端口和真机继续按原用例验收。 [重开规格](reports/architecture-and-milestones.md#wechat-devtools-process-reopen) · [本机回执](reports/validation.md#wechat-devtools-process-reopen-validation)

固定 F5A 已找到两处普通 IDOK 投递。辅助输入窗的回车字符和鼠标确认都检查主窗及根窗启用，再向登录主窗排队发送。实际送达后沿当前阶段和忙态准入。5 项相关本机回归通过，原版投递和重绑时序仍待验。 [输入和连接规格](reports/launcher-static.md#f5a-ordinary-input-idok) · [当前排程](reports/development-plan.md#capability-first-next-analysis)

固定 SE 的护卫交接、飞行物摘链与角色结算已按同一遍历成规。复用 11 份完整函数档案，补读六段原字节。三组本机回放和 162 项现有回归通过。本批登记到同一战斗差异及用例，原版完整回放继续待验。 [战斗规格](reports/game-static.md#battle-266-relay-retirement)

固定 SE 已核长接收、拆帧和战斗消息入队。现有网页会话遇到无效起始标记后，会等下一次读取才处理已在缓存中的完整消息。通信和战斗共用这项差异及用例，本机 108 项相关测试通过。 [规格及本机对照](reports/game-static.md#battle-266-long-receive)

固定 SE 战斗窗 26 的绘制和回收共用同一份分析。已定位图形、文本及常规回收的写入，所核写入与 SKL266 的三个暂存字分开。146 项本机回归通过，实际跨帧读值继续沿 BF-T36 核验。 [原版规格](reports/game-static.md#battle-266-window-draw-retirement)

Safari 27.0 模拟器已定位离页失败读到 ZIP 中的 `Graphic.bin`。取消后同一类读取的迟到成功和失败已用两组用例验证，127 项本机回归通过。 [宿主规格](reports/network-portability.md#safari-navigation-resource-read)

固定 Item 的三处第二套窗口候选均已定位到各自用途。训练、工艺和图鉴的十二个登记回调会原样传递活动首参，普通帧的外层分派与首参生产仍待证。40 项本机回归通过。 [窗口规格](reports/game-static.md#item-alternate-dispatch-candidates)

固定 F5A 的自更新接管、补丁完成、普通确认与关闭已接回 A1。核对八行消息和一个启动虚槽，复用 23 个留存 REA 函数档案，124 项本机回归通过。 [登录器入口](reports/launcher-static.md#fixed-f5a-entry-business-admission)

固定 SE 的战后窗口、经典邮件重开和工艺槽交换已补回 A1 入口台账，共 39 处所选登记。经典制造窗的前置更新和后置绘制按各自入口入账，152 项相关回归已通过。 [游戏入口与规格](reports/game-static.md#fixed-se-entry-business-admission)

微信双槽重建、历史提交和迟到启动确认已合入共用规格。开发者工具的两个 App 实例核对了字节相同的旧修订重用、补齐历史后换槽及按活动发布写确认。135 项相关回归通过，实际产品与真机待验收。 [恢复规格](reports/architecture-and-milestones.md#wechat-publication-history)

启动规格已补构建身份、所选游戏配置与活动资源的核对。Chrome 的新版入口混入旧依赖仍能配置，微信生成包混入另一份有效配置仍能到达可连接状态。两端还需按对应启动尝试和最终发布记录确认。71 项相关回归通过。 [启动规格](reports/architecture-and-milestones.md#portable-boot-entry-identity)

资源换版已补读取、绘制和音频的预算规则。Chrome 在两笔旧读取仍挂起时完成新资源库初始化、参考帧和音乐。旧库关闭后，各笔迟到的读取独立结算。85 项相关本机回归通过。 [共用规格](reports/architecture-and-milestones.md#resource-budget-retirement)

固定 SE 的经典邮件重开已复用换场、窗口和编辑器证据。草稿按当前视图及目标恢复，群发列表由子窗首次初始化决定是否保留。四组验收用例覆盖普通重建、战斗入口、分配失败及附件释放。 [邮件规则](reports/game-static.md#fixed-se-classic-mail-reopen)

普通换图、战斗回场和工作窗已合入一份帧规格。两份历史样本的回场路径均有条件在同一轮从 1 经 2 直接写到 3。固定 SE 的普通换图完成帧会先重建登记表，再处理窗口及工作状态。四个本机夹具和 113 项相关回归通过。 [原版顺序](reports/game-static.md#fixed-se-shared-scene-frame) · [本机核验](reports/validation.md#fixed-se-shared-scene-frame-validation)

固定 SE 的战斗指令窗 26 在设为退役标记的当帧仍可更新合资格的控件并绘制。所选关闭态按钮更新呈现，下一次窗口整理处理退役。现有共享入口的两组超时夹具均复现关窗停滞，77 项相关本机回归通过。SKL266 的原版实读继续沿其三个暂存字的具名写入核验。 [原版规则](reports/game-static.md#battle-266-window-control-writes) · [本机核验](reports/validation.md#battle-266-window-control-writes-validation)

固定 SE 的装备槽 7 已核工作启停、交换回包与制造材料释放。现有客户端会交换物品，但制造已开始时仍会提交旧材料槽。背包、交易和工作沿同一组回包顺序验收，103 项相关本机回归通过。 [原版规格](reports/game-static.md#fixed-se-work-slot-seven) · [本机对照](reports/validation.md#fixed-se-work-slot-seven-validation)

背包、技能和工艺共用同一份工作上下文规格。固定 SE 的所选经典帧先检查解除，再推进计时。背包活动回调还会在工作资料清零时解除，并重新准备预览。已有解码和两条请求可复用，99 项相关本机回归通过。 [原版行为及差异](reports/game-static.md#fixed-se-work-context-publication) · [核验](reports/validation.md#fixed-se-work-context-publication-validation)

固定 SE 的背包、交易和设置共用堆叠数量规格。已核另一套背包保存槽号、先确认后按上限调整、取消回背包及实际关窗后恢复焦点。本机对照复现了库存更新时现有选择失效的差异，84 项相关回归通过。 [开启方式](reports/game-static.md#fixed-se-stack-quantity-input-preference) · [提交与退役](reports/game-static.md#fixed-se-alternate-inventory-quantity) · [本机核验](reports/validation.md#fixed-se-alternate-inventory-quantity-validation)

F5A 现已核对目录设置的写入、冷启动读回及失败恢复。两条同 Code 的记录按行更新，适用时共用保存键。Chrome 实际页面和微信宿主夹具已对照目录替换、缓存读回和旧资源的保留范围，相关差异归入同一复刻规格。 [目录规格](reports/launcher-static.md#launcher-directory-host-handoff) · [本机核验](reports/validation.md#launcher-directory-host-handoff-validation)

F5A 的首次配置、目录替换和普通启动共用同一组进程跟踪槽。已将这三条入口的准入、保存及重开归入同一规格。现有配置编解码和资源绑定可以复用，56 项相关本机测试通过。 [首次配置和目录衔接](reports/launcher-static.md#first-config-directory-composition) · [本机对照](reports/validation.md#first-config-directory-composition-validation)

F5A 的补丁备份重试与失败后的目录恢复已合入同一规格。现有退出判定、资源绑定和旧候选清理可复用，开发补齐备份错误续接及新目录读回后的重新准备。38 项相关本机回归通过。 [补丁与目录规则](reports/launcher-static.md#f5a-patch-retry-directory) · [核验](reports/validation.md#f5a-patch-retry-directory-validation)

固定 SE 的图形分块、耗尽恢复和调色板延后上传已合入同一规格。已有位图解码、颜色转换、缓存占用与场景身份可复用。开发补部分块绘制和达到限额后沿用旧色的时机。两组共 99 项本机回归通过。 [图形缓存规则](reports/game-static.md#legacy-graphics-partial-cache) · [上传规则](reports/game-static.md#legacy-graphics-deferred-upload)

换图、战斗回场和水面共用的临时面已核对写入与读取次序。现有城市过渡的帧提交可复用。本机复现战斗回场在新画面提交前恢复普通状态，已归入同一验收用例。58 项相关本机回归通过。 [背景与呈现规格](reports/game-static.md#legacy-transition-background) · [本机对照](reports/validation.md#legacy-transition-background-validation)

固定 SE 的普通换图已核淡出、淡入、窗口重建与画面提交。按原指令推导，淡入完成帧仍有两行未被条带覆盖。现有 Canvas 在新图首次绘制前已能接收输入。65 项相关本机回归通过。 [换图规则](reports/game-static.md#fixed-se-ordinary-map-fades) · [条带模型与本机对照](reports/validation.md#fixed-se-ordinary-map-fades-validation)

固定 SE 的图形重建已核普通地图和战斗背景各自的重新捕获路径。现有回城流程复现了读取期间更换画布后卡住，以及中途绘制失败后退出。已把两种情况加入同一组复刻验收。56 项相关本机回归通过。 [图形重建规格](reports/game-static.md#legacy-transition-graphics-rebuild) · [本机回执](reports/validation.md#legacy-transition-graphics-rebuild-validation)

固定 SE 已核普通换图及 250、252 的共用选路、五槽快照和窗口重建次序。stage306 本机夹具完成普通换图，随后收到携带本地角色 ID 的协同动作 82 时结束会话。换图、角色和工作窗共用一份实现差异及验收规格，112 项相关本机回归通过。 [选路规格](reports/game-static.md#fixed-se-scene-controller-route) · [本机核验](reports/validation.md#fixed-se-scene-controller-route-validation)

固定 SE 的过渡回调继续推进绘制，后续合资格场景回复按当时登记在普通 200 和 252 之间选路。本机已对照同批回复、素材读取挂起和最新地图补片，63 项相关回归通过。 [结束与重入规则](reports/game-static.md#fixed-se-251-completion) · [本机核验](reports/validation.md#fixed-se-251-completion-validation)

普通用物的两级目标已核到资料替换、旧选择、取消及换场。用物与治疗技能共用两扇经典窗，后续在共用窗口中接各自的提交及占用释放。现有客户端已确认收到两种回复，目标菜单的发布与交互待开发。 [操作规格](reports/game-static.md#fixed-se-item-target-retirement) · [本机对照](reports/validation.md#fixed-se-item-target-retirement-validation)

两版普通退出提示已沿现有 REA 证据核对到候选计时器、排队提交和确认后的关闭。F5A 按编号消费的排队提交会在准备资格为零时返回，候选计时器另按当时忙态处理。已有本机取消及迟到回执用例可复用。 [退出规格](reports/launcher-static.md#launcher-ordinary-exit-confirmation) · [取证与验收](reports/validation.md#launcher-ordinary-exit-confirmation-validation)

固定 SE 的普通换图已核到旧窗析构、延后开窗和场景重建的顺序。工作与用物共用一份窗口规格，现有工作选择、地图身份检查和旧输入拒绝可复用。102 项相关本机测试通过。 [操作规格](reports/game-static.md#fixed-se-classic-scene-window-queue) · [本机对照](reports/validation.md#fixed-se-classic-scene-window-queue-validation)

SE 与 Item 的普通换图共用序号匹配、补片和续帧规则。stage306 本机可在等待时更新地图名状态，身份对匹配的补片到达后恢复玩法。沿用 49 项同基线回归，两版的原版补片开关置 1 待证。 [等待与解除](reports/game-static.md#legacy-map-wait-patch-release) · [本机核验](reports/validation.md#legacy-map-wait-patch-release-validation)

固定 SE 与 Item 共用地图重读和缺格续接规则。普通帧先处理移动再重读，缺格补齐后在下一次合资格移动续接。stage306 两种模式的本机对照已重跑，沿用 85 项回归。 [地图重读与移动规格](reports/game-static.md#legacy-map-movement-refresh) · [本机核验](reports/validation.md#legacy-map-movement-refresh-validation)

两版地图缓存已共用一份读写规格。路径上下文来自 `@Qu` 的第 3 个整数，复刻可复用现有解码和三平面读写。已核磁盘与活动第三平面的坐标差异，15 项现有地图测试通过。原版短读和部分写入效果仍待实测。 [缓存规格](reports/game-static.md#legacy-map-cache-io) · [本机核验](reports/validation.md#legacy-map-cache-io-validation)

SE 与 Item 的地图校验沿同一算法。两版用活动 A 和通知 B 找文件，补取仍带通知原身份及矩形。两种模式的本机对照和五项相关测试通过。不同 B 的缓存选取与原版文件异常沿原用例验收。 [校验和补取规则](reports/game-static.md#legacy-map-notice)

两版所核同进程重开继续使用最近的地图目录值。再次入场按收到场景消息当时的值选缓存。本机已复现目录值改变时仍按旧缓存复用的差异，四项场景回归通过。 [目录与重开规格](reports/game-static.md#legacy-map-context-reentry) · [核验记录](reports/validation.md#legacy-map-context-reentry-validation)

固定 SE 和 Item 的第二套遗忘窗已核返回时实际读取的背包说明索引。经典窗继续走独立的返回请求。历史 Item 的报价总页数已核发布顺序及空表边界，固定 SE 的对应发布者待证。 [规则与用例](reports/game-static.md#historical-forget-return) · [本机对照](reports/validation.md#historical-forget-return-validation)

固定 SE 的宠物槽、加点取值和报价翻页已归入同一组规格。固定 Item 已核空表和同号刷新时的发布顺序。stage306 的经典报价、替换和失效保护通过本机对照，沿现有窗口和训练入口复用。固定 SE 第二套窗的总页数写入与实际激活待证。 [宠物资料](reports/game-static.md#fixed-se-pet-count-selection) · [报价规格](reports/game-static.md#fixed-se-training-quote-pages) · [本机核验](reports/validation.md#fixed-se-training-quote-pages-validation)

已把素材发布、游戏页关闭和重开读回合入同一份规格。Chrome 实测取消后旧 ZIP 仍发起一次目录读取，旧字节最终清零，新准备未受影响。开发将补准备阶段的读取取消与排空回执，并沿现有接口接入发布读回；实际产品组合、微信完整持久化及真机继续验收。 [组合规格](reports/architecture-and-milestones.md#portable-update-handoff-readback) · [本机核验](reports/validation.md#game-resource-reopen-composition-validation)

固定 SE 的两类战后结果已核字段、待处理动作、经典窗 30/31 的初始化和关闭。窗 30 的文字按创建时数据设置，图号由每帧重读。现有客户端两种接收均可解码，窗口接线与三端运行待验收。 [战后结果规格](reports/game-static.md#fixed-se-battle-results) · [本机核验](reports/validation.md#fixed-se-battle-results-validation)

固定 SE 的 18 个出站格式器已核到 69 处直接调用，stage306 的 18 个编码均可复用。名片、家族和迷你名单共用一条编码，开发补名单入口与实际取值。普通移动的所查路径没有产生 `#Mi` 的标记。 [出站规格](reports/game-static.md#fixed-se-outgoing-admission) · [本机回归](reports/validation.md#fixed-se-outgoing-admission-validation)

固定 SE 的经典工具栏、人物状态、明细和称号窗已核对 163 个控件记录。已查清工具栏重开、人物窗位置继承、前后排切换、加点和个人称号选删。两条新查出的请求格式和两项回包发布已列入开发差异。 [来源规格](reports/game-static.md#fixed-se-classic-toolbar-status)

同组简介与目录窗已核对 66 个控件记录、编辑、公开、离开和按角色保存。目录版本、两组列表发布与冷启动读取已成规，现有编码和素材读入口可复用。已有本机回执，三端接线待开发。 [简介规格](reports/game-static.md#fixed-se-classic-player-profile) · [目录规格](reports/game-static.md#fixed-se-player-directory)

查看他人简介已核四种查询入口、13 项回包字段和经典窗 64 的显示、重排与关闭规则。三端可共用请求编码、资料和窗口规则。查询与实际服务回复的配对及三端操作仍待验。 [来源规格](reports/game-static.md#fixed-se-other-player-profile) · [复用与本机核验](reports/validation.md#fixed-se-other-player-profile-validation)

场景回包 `CcL` 已核直接播放特效和先登记实体两条路径。两条路径共用现有解码、图形资源换算和场景帧规则。登记时查重用正文的实体 ID，特效结束时按外层字段重查要显示的实体。三端接线与实际播放待验。 [原版规则](reports/game-static.md#fixed-se-ccl-scene-publication) · [本机对照](reports/validation.md#fixed-se-ccl-scene-publication-validation)

经典普通用物的两级目标已核 `LC=`、`LHm` 的资料、窗口与提交规则。五条已有请求编码可直接复用，三端待补一套共同的资料发布和选择操作。实际回复配对及用物结果留待同版验收。 [规格与边界](reports/game-static.md#fixed-se-item-target-menus) · [本机对照](reports/validation.md#fixed-se-item-target-menus-validation)

目录检索、查看玩家资料和发迷你邮件已核到经典窗 60–63 的实际操作。查询与发信共用现有 `/1I` 编码，分别采用各自的按钮值及正文。迷你邮件的本地历史更新已成规，实际收费与投递结果待验。 [原版操作](reports/game-static.md#fixed-se-classic-directory-mini-mail) · [本机核验](reports/validation.md#fixed-se-classic-directory-mini-mail-validation)

固定 SE 的 30 条邮件入口已对应原操作。另一套窗口的运行分派和邮件最终投递继续沿原要求取证。 [邮件入口和条件](reports/game-static.md#fixed-se-mail-entry-admission)

微信游客模拟器已核 2.55 GB 完整素材在新 App 和独立工具进程中重开。清单提供仍可读的临时段，缺失一段时按摘要补选。产品发布、完整持久化及真机继续验收。 [重开和补选](reports/architecture-and-milestones.md#wechat-sdk-segment-process-reopen)

固定 SE 的战斗指令窗在所选倒计时结束后可继续随等待或回放帧推进。已核创建、关窗和退役时点，并在现有共享入口找到待实现差异。SKL266 的相邻帧实读仍沿具名写入和原用例核验。 [战斗窗口规格](reports/game-static.md#battle-classic-input-window-frame) · [相邻帧规格](reports/game-static.md#battle-266-adjacent-frame)

固定 SE 的全量背包、逐槽更新和交换已核到普通选择与邮件附件的不同状态。个人投递实际使用 49 号表单。三端将复用现有物品状态并补齐全量发布，邮件提交和重开沿同一组用例验收。 [背包与附件规格](reports/game-static.md#legacy-se-mail-attachment-refresh) · [本地核验](reports/validation.md#legacy-se-mail-attachment-refresh-validation)

全量背包已核 28 槽的 13 字段、缺尾处理和入场重置。地图与本机角色资料解除入场等待，背包可在等待期间或进入场景后发布。这组规则已归入现有物品和入场规格，三端接线待开发。 [原版规则](reports/game-static.md#legacy-full-inventory-publication) · [本地核验](reports/validation.md#legacy-full-inventory-publication-validation)

固定 SE 的制造材料已核到编辑重查、背包换位、计时提交及结果释放。开始后换位的材料会随物品移动，到期读取新槽号。现有共享实现的显示及槽号差异已归入同一份 D0/D3 规格，三端实装待开发。 [原版规则](reports/game-static.md#legacy-se-craft-inventory-selection) · [本地对照](reports/validation.md#legacy-se-craft-inventory-selection-validation)

固定 SE 的交易报价已核对背包刷新、换位和确认。所选原版窗口先处理确认按钮，随后处理报价面板重查和占用释放。现有客户端按物品修订拒绝已发报价的确认，差异已登记到 D0/D3。 [原版规则](reports/game-static.md#legacy-se-trade-inventory-confirmation) · [本机对照](reports/validation.md#legacy-se-trade-inventory-confirmation-validation)

固定 SE 经典交易的宠物选择和金币报价已补齐所选流程。宠物清槽后报价行可画空并保留位置。余额变化更新输入上限，已存报价继续单独持有。现有整表修订和余额拒绝策略的差异已合入 D0/D3。 [原版规格](reports/game-static.md#legacy-se-trade-pet-gold) · [本机对照](reports/validation.md#legacy-se-trade-pet-gold-validation)

固定 SE 第二套交易窗的内部回调已核到发布列表、金额输入、撤回和余额截低的顺序。两套窗共用已有发送格式器，各自的列表和阶段规则已登记到同一交易规格。第二套窗的普通激活仍待证。 [来源规格](reports/game-static.md#legacy-se-alternate-trade-gold) · [本机对照](reports/validation.md#legacy-se-alternate-trade-gold-validation)

已将第二套窗的物品与宠物改选、单击取放、数量确认和资料刷新并入同一交易规格。单槽重建与整条换位对选择字的影响已核到原指令。 [来源规格](reports/game-static.md#legacy-se-alternate-trade-selection) · [本机对照](reports/validation.md#legacy-se-alternate-trade-selection-validation)

固定 SE 的 NPC 出售、鉴定和修理共用一条报价行操作。已核对拾取、换位、早期右键取消和放置后的移除时序。现有共享核价可复用，报价选择及退役交 D0/D3，三端完整操作待验收。 [报价规格](reports/game-static.md#legacy-shop-quote-drag) · [来源和本地核验](reports/validation.md#legacy-shop-quote-drag-validation)

固定 SE 已核 105 游标更新与 106 分身命中的对象次序。优先级 2 的分身在既有槽 0 后、其余初始优先级的注册槽前。现有回放已对照两种同帧顺序，非反射 106 的原版实际读值和恢复仍待验。 [战斗规格](reports/game-static.md#battle-105-106-callback-order) · [核验记录](reports/validation.md#battle-105-106-callback-order-validation)

固定 F5A 选服备注已核对打开、迟到回复、确认及写回。普通阶段 4 空闲时迟到的状态 0 回复无法换表。确认用打开时的候选索引读取当时槽内名称，写入成功才发布备注。D1/D5 沿现有登录列表与保存用例接入，实际原版消息和三端写回继续验收。 [共用规格](reports/launcher-static.md#f5a-note-modal-admission) · [本地核验](reports/validation.md#f5a-note-modal-admission-validation)

两份历史样本的经典技能窗已核工具栏、Ctrl 快捷键、普通和战斗的打开条件。固定 SE 另核到普通选行与实际关窗。D0/D3/D4 共用窗口规格，沿现有工作和战斗所有者接入。 [技能窗规格](reports/game-static.md#legacy-se-classic-work-entry) · [核验](reports/validation.md#legacy-se-classic-work-entry-validation)

固定 SE 经典图鉴的打开、列表、详情和关闭已按 27 个登记位置接入同一份规格。复用 15 份 REA 函数档案，只补查两个刷新函数。D0/D3 沿原窗口帧与图鉴资料入口复刻。另一套窗口仍待取证，三端产品待验收。 [来源与规格](reports/game-static.md#legacy-classic-album-entry-admission) · [本机核验](reports/validation.md#legacy-classic-album-entry-admission-validation)

固定 SE 与 Item 已核到启动命令尾、`Config.dat` 首行和请求档位的取值顺序。现有共享入口能合并启动文本，档位传递和打开失败处理已归入图形共用规格。降档文件读回及当前同版仍待证。 [启动规则](reports/game-static.md#legacy-render-startup-tier-input) · [本机核验](reports/validation.md#legacy-render-startup-tier-input-validation)

桌面 Chrome 和 iOS Safari 模拟器用同一组资源更新夹具核对了后续版本接管、迟到启动确认与重开读回。微信现有适配器的本机文件对照明确了双槽覆盖时机，后续沿同一套用例实现并验证回执保留。 [共享规格](reports/architecture-and-milestones.md#portable-update-handoff-readback) · [本地核验](reports/validation.md#portable-update-handoff-validation)

固定 SE 已核到同施法者记录合并、接续倒计时，以及 SKL404 或 SKL405 与独立 SKL266 在同次遍历按序执行的条件。普通结果第四格和仅自身 RID 附加行按各自的同帧写入取值。现有调度通过 12 个本地组合用例，结果传递差异已登记到战斗规格。 [来源与规则](reports/game-static.md#battle-266-same-frame-producers) · [本地对照](reports/validation.md#battle-266-same-frame-validation)

11 月版登录器的候选确认、`GameID` 保存和游戏交接已归入同一份规格。D1/D5 沿原入口核对确认名称长度、文件失败、首次配置、映射失败及仅刷新在各读取点的结果。当前同版游戏读取仍待证。 [原版规则](reports/launcher-static.md#f5a-ordinary-handoff) · [核验](reports/validation.md#f5a-ordinary-handoff-validation)

两份历史游戏样本已核到场景恢复时的窗口选择、`Ta>` 提示文字及经典窗口的 2 秒到期和退役。场景、战斗返回和窗口调度共用一份规格。第二套窗口的普通帧回调及当前同版运行继续取证。 [原版规则](reports/game-static.md#legacy-scene-label-window) · [核验](reports/validation.md#legacy-scene-label-window-validation)

11 月版登录器的筛选、备注、上下移动、拖动、重置和单次撤销已归入候选列表规格。排序和恢复共用一份存储与列表重建规则，供三端接入。实际 Windows 事件、文件读回及三端操作仍待验收。 [候选操作规格](reports/launcher-static.md#f5a-candidate-management) · [本机核验](reports/validation.md#f5a-candidate-management-validation)

11 月版登录器的置顶和取消置顶已核对菜单准入、两次设置写入、失败恢复及列表重建。选服、偏好和宿主共用这份规格。专项用时已记录，实际三端和原版运行待验。 [置顶规格](reports/launcher-static.md#f5a-pin-publication) · [核验与用时](reports/validation.md#f5a-pin-publication-validation)

两份历史游戏样本的经典训练窗已核等待页再次提交、只读报价和技能栏确认。训练、工艺、图鉴共用经典控件的输入消费和退役顺序。 [来源规格](reports/game-static.md#legacy-pet-training-controls) · [本地对照](reports/validation.md#legacy-pet-training-controls-validation)

11 月版登录器的普通选服已核到回复中的候选排序、置顶与筛选、显示行映射及确认重读。现有共享代码可复用解码、字节排序和状态检查，按版本登记剩余差异。 [来源规格](reports/launcher-static.md#f5a-profile-list-projection) · [对照和回归](reports/validation.md#f5a-profile-list-projection-validation)

11 月版登录器的普通启动、首次配置、仅刷新和目录重选已核到各自的前检及路径发布顺序。补丁复用同一套路径解析。现有目录与启动规划已完成本机对照，当前同版游戏读取继续取证。 [规则和后续验收](reports/launcher-static.md#f5a-path-preflight)

固定 Item 已核经典窗口在初始化、换场、断线与战斗转换时的捕获、析构和重开次序。图鉴与邮件保存复用现有缓存规格，战斗返回复用既有计时和场景重建。 [来源与验收](reports/game-static.md#legacy-item-classic-rebuild-modes)

历史 Item 的恢复帧 `9/252` 已核到两次图形对象和经典窗口更新。第一次窗口更新登记的过渡可以在同一轮推进。D0/D2/D3 共用这条规格，训练、工艺和图鉴沿各自的业务准入验收。另一套窗口的实际分派仍待核。 [来源与共用用例](reports/game-static.md#legacy-item-double-window-frame)

固定 11 月版登录器已核到连接维护、同步回调和退役的顺序。登录、宿主退出和传输共用一份规格，分别核对关闭请求、旧回调结束与关闭回执。实际 Windows 提示期间的消息和新绑定仍待验证。 [来源与本机对照](reports/launcher-static.md#f5a-pump-retirement)

首次配置已核对固定配置器的默认写入、取消、确认及文件失败分支，并与 F5A 的退出续接规则对照。配置器的文件写入、窗口关闭和登录器的首次配置标记分别有可核对的结果。D0/D1/D5 共用现有配置编解码和同一组用例，实际同版配对仍待核验。 [来源和共用规格](reports/launcher-static.md#first-config-dialog-outcomes)

两份固定历史样本已核接收错误当轮的缓存分派、下一轮的断线状态，以及图鉴按执行时角色槽处理的条件。Item 的普通邮件也读取当时角色槽。通信、换角和缓存共用一份规格及现有验收用例。 [来源及本地对照](reports/game-static.md#legacy-receive-retirement-order)

两份固定历史样本的经典图鉴已共用键位、工具栏和详情规格。SE 证据补齐按钮与快捷键同帧触发、延后创建和同步回退的组合用例。另一套图鉴的普通帧回调继续取证。 [共用规格与适用范围](reports/game-static.md#legacy-se-classic-album-ingress)

11 月版登录器与内嵌更新器已核到旧窗口关闭请求、新主窗启动确认和事务清理的顺序。登录、补丁和游戏启动共用同一个待接管条件。本机留存更新 ZIP 已由现有解析器读出确认声明。实际文件替换、窗口关闭和三端产品启动仍待验。 [来源和复用规则](reports/launcher-static.md#f5a-update-handoff-and-ack)

固定 SE 的 SKL266 已核自身护卫的结果槽、第四格保留和同槽入队顺序。所选清零帧的仅自身 RID 会继续追加结果，现有共享计划会提前返回。这项差异和同槽恢复规则已写入原战斗规格。 [来源和本地对照](reports/game-static.md#battle-266-self-guard-context)

固定 SE 的 SKL266 投射物交接护卫后会在同一回调再次测距。小于 20 时即标记退役，即使刚排入下一段飞行。现有共享回放会在交接成功时跳过这次检查。返程、护卫等待和结果动作共用战斗验收用例。 [返程顺序与本地对照](reports/game-static.md#battle-266-return-order)

固定 SE 与 Item 都在设备创建失败后继续试较低档。创建设备后，必要的能力查询或设置失败会直接退至档位 1。两版的写入与内存更新共用一份规格，下一次启动的文件读取仍待证。 [设备准备和文件结果](reports/game-static.md#legacy-render-device-preparation)

固定 SE 与 Item 的经典治疗窗按当前选择绘制伤势提示，绘制回调返回零并继续本帧。所选普通文本与图形确认使用同一窗口分派，帧钩子为空。两版的第 19 项控件在所选初始化和关闭路径保持禁用。现有治疗回复可复用，提示与帧退役差异已纳入规格。 [原版规则与本地对照](reports/game-static.md#legacy-classic-dialog-frame-hook)

C82 与 11 月版登录器都在 DNS 阶段先判截止。通道满足条件时先尝试提交，获接纳后从新时钟样本计 10 秒。退出确认按返回时的忙态关闭。登录、选服和三端适配共用这份规格，现有核心的总期限差异已有本地用例。 [原版规则与本地对照](reports/launcher-static.md#launcher-login-timer-dispatch)

两份固定旧版的绘制表面忙会登记一次待重建。选定输入消息先处理该请求，符合切换条件的系统 Enter 再按重建后的状态切换窗口模式。图形与输入沿一份规格核对重建、窗口调整和排队消息。 [顺序与本地对照](reports/game-static.md#legacy-render-system-key-rebuild)

固定 Item 与 SE 的宠物训练在提交报价或选宠请求后保留原窗口。选宠或选栏回包更新同一窗口，等待时的旧模式关闭消息无法匹配。现有共享核心会移除页面并接受这条关闭消息。训练和窗口生命周期共用 OS-D7 的实现差异与 OS-A24 的验收用例。 [等待规则与本地对照](reports/game-static.md#legacy-pet-training-wait-owner)

固定 Item 与 SE 已核对话处理后的角色朝向。符合条件的普通来包会在分派返回后尝试更新来包指定的角色，即使已有窗口保留。现有共享入口尚缺这次更新，差异归入原窗口与角色接线。 [来源和本地对照](reports/game-static.md#legacy-dialog-actor-facing)

移动 Safari 模拟器已补本机桥接的后台收包、旧连接退役及提交回执丢失后重开的证据。 [移动宿主核验](reports/validation.md#mobile-safari-stream-commit-validation)

固定 F5A 已核到状态 0 回复后的候选选择。普通非空路径先写交接数字，预设唯一匹配且有显示行时进入与手动相同的确认。零候选和选择失败分别沿已证分支收尾。实际 Windows 投递、进程创建及当前同版游戏读取待验。 [结果与确认规格](reports/launcher-static.md#f5a-result-selection)

固定 F5A 的启动返回已核到托盘登记、窗口显示和重新准备。重新准备检查当时的编号，已尝试的编号不会再次自动投递。合资格的普通预设应用会换编号并清除两个提交标记。 [启动返回规格](reports/launcher-static.md#f5a-start-return) · [编号与预设规则](reports/launcher-static.md#f5a-preparation-generation)

固定 Item 和 SE 的类别 7 升级在资料首字节为零时，仍构造 kind 5 的空字段并进入等待。D0/D2 共用该用例，发送时的实际资料及其生产者仍待证。 [角色升级规格](reports/game-static.md#legacy-upgrade-empty-material)

第二套窗口的槽位选中、图形就绪和缓存切换已分别核对。两份历史样本的训练预览、Item 的工艺配对及图鉴返回沿同一份退役合同。外层逐窗调用顺序仍待证。 [共用规格](reports/game-static.md#alternate-window-selection-and-cleanup)

固定 Item 第二套窗口的 97 个表回调已绑定共用辅助函数。新图形对象第 11 次合资格回调切换阶段，第 12 次发布就绪。训练、工艺和图鉴共用就绪、创建失败及退役规格，普通业务帧对表回调的实际调用待证。 [窗口规格](reports/game-static.md#legacy-item-alternate-window-graphics)

固定 Item 和 SE 的战斗入场都写延后动作 3。普通帧先消费该动作，再处理定时恢复。动作清掉窗口 1 的恢复标记后，合资格的定时路径仍可请求经典窗口 39 的过渡。 [战斗与窗口恢复规格](reports/game-static.md#battle-window-restore-order)

固定 SE 已核所选清零帧中技能 266 的首次读取。普通第四格取零，仅自身 RID 的所选无护卫分支继续追加结果，现有共享计划会在该分支提前返回。其余帧条件和原版实际读值待验。 [首次读取规格](reports/game-static.md#battle-266-cleared-frame-read)

两份固定旧版的注销发送、等待状态和时钟采样已核对。Item 的四类结果分别决定连接退役、提示确认及返回选服的时点，D0/D2 共用一份状态与时钟规格。 [注销规格](reports/game-static.md#legacy-item-logout-clock)

固定 Item 的经典窗口帧已核到活动列表整理、回调间的输入值传递及两种关闭时点。训练窗 37、52、54 的组关闭在收包时退役，工艺窗 10 属于不同组。D0/D3 共用这份规格，另一套窗口表的实际分派仍待证。 [窗口生命周期](reports/game-static.md#legacy-item-classic-callback-order) · [子状态分派](reports/game-static.md#legacy-item-classic-frame-dispatch)

固定 Item 的普通控件和快捷键提交开场动画后，从下一次图形对象更新开始推进，第 11 次回调尝试创建。同号工艺和图鉴可复用已建实例，同号训练窗先退役原实例再尝试新建。过渡对象分配失败时改走同步创建。 [共用打开规格](reports/game-static.md#legacy-item-classic-open-transition)

桌面 Chrome 已从 IndexedDB 的两个资源根读取实际 ZIP。旧库在新根发布后仍能渲染，退役后才删除旧块。进程重开后新根 304 块校验通过，资源库再次输出参考画面。 [宿主实测](reports/architecture-and-milestones.md#desktop-persisted-resource-archive)

桌面 Chrome 的两个同名、等长 ZIP 含不同调色板。发布新根后，两页重新读到各自素材并输出相应画面。旧页关闭时仍有图块读取待返回，读任务排空后才释放租约和回收旧根。 [版本隔离与退役核验](reports/architecture-and-milestones.md#browser-resource-version-isolation)

移动 Safari 模拟器复现了复合 Blob 的读回长度异常。将末块先读成连续字节再写入后，双根换版、Safari 重开、304 块校验和 19 张参考画面全部通过。 [移动实测](reports/architecture-and-milestones.md#mobile-safari-persisted-resource-archive)

微信游客模拟器已核 4 GiB 以上的定位读写。早期合成容量试验发生在同一 App 删除超大定位文件之后，可能受目录计数影响。普通分块写入复核中，实际素材和新 App 的合成对照均在第 13 个 8 MiB 块遇到配额拒绝。完整持久化和真机仍待验。 [微信配额实测](reports/architecture-and-milestones.md#wechat-sdk-archive-ordinary-quota)

微信开发者工具已通过两次本机文件选择读回完整 2.55 GB 资源包。两段经范围接口交给原 ZIP 解析器，整包摘要、六张参考画面和 CUT 目录匹配。两段另存时各遇到 SDK 配额拒绝，正式产品的持久化接线和真机继续验收。 [分段导入实测](reports/architecture-and-milestones.md#wechat-sdk-segmented-archive)

微信开发者工具的小型 ZIP 对照已跨页面及新 App 实例读回。移开探针的临时副本后，重开能识别路径缺失，用户目录副本仍可读。 [文件重开实测](reports/architecture-and-milestones.md#wechat-sdk-selection-lifetime)

两版登录器已核输入通知与提示返回的焦点请求。11 月版密码变化清除待提交标记，保留同编号的已尝试标记。登录、表单和宿主接线共用这份规格。 [原版规则](reports/launcher-static.md#launcher-edit-focus)

历史 SE 和 Item 的图形规格已区分表面格式回退与设备准备失败。Item 的呈现及窗口激活会登记待恢复，普通帧在设备就绪后重建。D0/D3 共用档位、绘制准入和退役用例。 [图形档位](reports/game-static.md#legacy-render-device-preferences) · [呈现与恢复](reports/game-static.md#legacy-render-presentation-recovery)

微信构建身份可复用现有产物清单。同配置的两次生成与留存工程逐文件一致，游戏分包配置改变时身份随之改变。D0/D5 以这条规则落实新启动回执，实际代码更新待验。 [构建身份规格](reports/architecture-and-milestones.md#reconstructed-build-identity)

11 月分发版的补丁等待会切到阶段 1 或 2。成功回调清除等待标记后恢复阶段 3，再按当前准备编号及提交准入继续。补丁、登录与宿主复用这份续接规格。 [补丁结果与续接](reports/launcher-static.md#f5a-patch-completion)

历史 Item 的断线恢复已核到接收轮询、提示确认和回到选服的顺序。D0/D2 共用提示对象退役与连接清理规则，D6 继续核当前同版与实际运行。 [来源规格](reports/game-static.md#legacy-item-disconnect-recovery)

历史 Item 的工艺窗口已核到配对打开、主槽返回和副槽清理。D0/D3 共用这条顺序处理窗口 19、29 和 30。外层帧分派继续取证。 [工艺窗口规格](reports/game-static.md#legacy-item-work-window-pair)

历史 Item 的两条经典窗口重建路径已核到保存活动标记、关闭旧窗口、解除工作上下文及按标记恢复的顺序。状态切换、训练和工艺共用这份规格。 [重建规则](reports/game-static.md#legacy-item-classic-window-reentry)

历史 Item 的窗口 1 恢复标记已核到普通帧、入场回复和退役处理。场景切换与战斗入口可共用同一份窗口恢复规格。 [标记的保存与消费](reports/game-static.md#legacy-item-window-one-restore)

历史 SE 的图形选路已核到设备接口、呈现失败的重建标记和第 0 层纹理探测。G06 与 X02 共用呈现和恢复规格。实际设备结果、像素和当前同版继续验收。 [图形恢复规格](reports/game-static.md#legacy-render-recovery-probe)

Chrome 157 与 iOS 27.0 的 Safari 模拟器已核网页缓存打开、排队超时及晚到请求的处置。D0 恢复验收同时核对打开结果、活动根身份和修订号。历史打开错误的成因仍待定位。 [打开结果](reports/architecture-and-milestones.md#browser-cache-open-outcomes) · [发布与重建](reports/architecture-and-milestones.md#browser-cache-receipt-recovery)

两版登录器的三个条件模板已核对用途线索。后续沿关联魔力必要操作的实际加载或调用补证。 [条件模板核验](reports/launcher-static.md#conditional-template-scope)

11 月 4 日分发的登录器已核对安装包和更新通道。REA 已复核普通启动前检、七组资源的枚举和标题转换、命令行与进程创建。Windows ARM64 对已安装游戏执行这七组搜索，返回 28 行及 26 个非空短名。六组的顺序与网页按小写名称排序的输入不同，D1 保留宿主返回顺序。实际启动器的大小写环境和当前游戏读取交接数据待证。 [分发与启动来源](reports/launcher-static.md#f5a-official-launcher) · [Windows 枚举](reports/launcher-static.md#windows-installed-resource-enumeration) · [标题字节规格](reports/launcher-static.md#f5a-resource-title-bytes)

F5A 的普通启动在 CRT 默认初始化后，还通过 C++ 构造表再次以 `GetACP` 选择代码页。代码页相同时复用原表，重新建表成功后按线程状态与共享标记选择标题转换表。登录表单沿 Win32 ANSI 字节分别核对 16 字节上限。34 项既有本机回归通过。 [启动选表规格](reports/launcher-static.md#f5a-normal-startup-locale-selection) · [本机核验](reports/validation.md#f5a-normal-startup-locale-selection-validation)

11 月版的交接映射已核同名复用、新视图准入和异常回退。创建失败按名退役，普通析构遍历剩余记录。 [发布与退役规格](reports/launcher-static.md#f5a-mapping-lifecycle)

11 月版的状态 0 回复先检查形状和忙态，停止流程返回后才决定是否更新交接数据。D1 复用已核对的数字与命令格式，保留步骤推进和写入顺序。当前同版游戏读取继续待证。 [回复准入](reports/launcher-static.md#f5a-status-zero-admission) · [交接字段](reports/launcher-static.md#f5a-handoff-number-origin)

历史 Item 的资源参数已追到实际初始化入口。42 个默认名、40 个前缀和对应格式与固定 SE 的共享路径规则相符。用随包目录复核代码 4 与 11 的六种输入，所选 42 条路径均与留存材料一致。 [Item 读取规则](reports/game-static.md#legacy-item-resource-handoff) · [本机核验](reports/validation.md#legacy-item-resource-handoff-validation)

历史 Item 的初始化和选服均有启动交接读取。已核两处复制、清零和字段发布，以及 `Wb^` 写入角色类别的路径。类别 7 的升级资料仍需追溯实际来源。 [交接与类别规则](reports/game-static.md#legacy-item-startup-handoff)

历史 Item 的升级与注销共用发送队列。升级发送调用返回后进入等待，等待窗分配失败时仍保留该阶段。D0/D2 将提交、等待和 `WDM` 结果纳入同一份规格。类别 7 的资料来源仍待证。 [提交与等待规则](reports/game-static.md#legacy-item-upgrade-submit) · [升级结果规则](reports/game-static.md#legacy-item-upgrade-result-flow)

历史 Item 的帧末命中已核文字热区优先、绘制列表逆序和长按重复。共享绘制排序可复用，D0 补验标记槽容量和点击读取顺序。 [帧末规则](reports/game-static.md#legacy-item-frame-hit-selection)

历史 Item 已核到窗口 1 和图鉴按钮的启动初始化。图鉴的命中和绘制使用同一份按钮描述符，工具栏展开沿固定来源的偏移规则。所选 23、24 窗口的普通帧分派继续取证。 [启动、按钮与回包规则](reports/game-static.md#legacy-item-album-toolbar-and-slot-reset)

11 月版登录器已核对普通提交和消息 `0x8242` 的按编号准入。无回复断线先置重试标记，登录定时器再推进候选。所选错误结果仍走主窗提示及控件恢复，两个回调的收尾已分别写入规格。实际登录器的消息顺序与真实会话仍待验收。 [登录入口](reports/launcher-static.md#f5a-login-owner) · [断线与错误结果](reports/launcher-static.md#f5a-disconnect-retry)

Windows 原创夹具已核实主窗提示期间仍能收到投递消息。匹配编号在窗口启用检查前消费，提示返回后原先单独禁用的按钮仍需恢复。 [窗口消息与准入](reports/launcher-static.md#windows-launcher-modal-dispatch)

C82 与 11 月版的列表双击都进入确定按钮共用的阶段确认。列表普通选中变更按阶段刷新资料。11 月版确认时会消费待处理的自动提交标记，含阶段 3 的忙态返回。 [列表确认与阶段准入](reports/launcher-static.md#launcher-list-activation)

11 月版已核候选的环形遍历、解析截止和取消清理。D1 复用现有尝试标识，按原版规则在每次推进候选和提交成功时分别设置期限。 [候选解析规格](reports/launcher-static.md#f5a-candidate-lifecycle)

11 月版首次配置已核到配置器选择、按账号和游戏缓存、子进程轮询及返回启动流程。D1 按来源版本处理缓存键和进程结果。 [首次配置规格](reports/launcher-static.md#f5a-first-config)

11 月版的启动与准备失败在错误码 2、3、161 时提供“重新定位游戏目录…”。选择该按钮后，提示退出，随后按当时的条目和阶段排队恢复。两条路径检查及目录写入成功后，排队入口继续登录准备，右键入口刷新列表。 [提示准入](reports/launcher-static.md#f5a-recovery-prompt) · [目录恢复规格](reports/launcher-static.md#f5a-directory-recovery)

11 月版补丁器缺失时，从登录器目录构造 `<Code>.pat`。盘符根目录保留反斜杠。退出 102 的重试从备份启动继续，最多再试两次。已核随包的四条配置及当前分发文件清单，实际回退制品和子进程身份仍待验收。 [补丁回退与重试](reports/launcher-static.md#f5a-patch-fallback)

C82 与 11 月版都把加引号的备份路径放在补丁命令首项，接着传地址和端口。固定安装补丁器在业务参数少于两项时返回 102。两版的参数交接与重试共用这份规格。 [参数与退出规则](reports/launcher-static.md#installed-patcher-argument-handoff)

11 月安装器的脚本和安装后运行项已核验。F5A 每次准备补丁备份时重新查属性，已有备份须先删除，再进入复制和启动。定时器及进程创建失败各有明确的错误回执。 [安装动作与备份检查](reports/launcher-static.md#f5a-installation-and-backup-preflight)

11 月版登录忙时，首次关窗请求先触发停止，再向同一窗口异步投递关窗。子视图析构会撤销补丁定时器并释放进程句柄，补丁实际退出和备份处理沿轮询结果核验。 [关窗及补丁归属](reports/launcher-static.md#f5a-close-ownership)

固定 SE 的 SKL266 变体 2 已核普通结果第四格的生产和投射物复制。现有共享投射入口可保留传入的第四格，开发差异集中在结果生产。无前序 RID 时的实际栈值仍待证。 [RID 暂存](reports/game-static.md#battle-266-rid-frame) · [投射物复制](reports/game-static.md#battle-266-projectile-row)

固定 SE 的所选预检允许仅有自身 RID 的 SKL266 变体 2 继续构造。现有共享解码读出相同依赖，后续计划因缺前序外部 RID 上下文停止。D4 已记录这条结果生产差异。 [预检与共享对照](reports/game-static.md#battle-266-source-admission)

历史 Item 已核鼠标事件位、普通键盘消息和所选状态帧的清理顺序。主循环先派发消息，再执行经典窗口回调，最后清本帧按键事件。另一套窗口的实际帧分派及训练、工艺和图鉴的完整入口继续待证。 [窗口恢复](reports/game-static.md#legacy-item-window-admission) · [键盘与状态帧](reports/game-static.md#legacy-item-keyboard-frame)

固定 Item 与 SE 已核 End 首次按下如何请求打开 99 号窗口或关闭当前窗口。Item 所选状态 9、10 在经典窗口帧前发请求，状态 11 在首次创建局部对象前处理已有窗口。 [普通帧与槽位规则](reports/game-static.md#legacy-item-normal-slot-producers)

Item 的八个工作窗口已核到非活动清理时如何保留或解除工作上下文。切换到配对窗口、一次性标记及局部图形回收各按源条件处理。 [工作窗口退役](reports/game-static.md#legacy-item-work-retirement)

固定 Item 和 SE 的所选普通帧先检查工作上下文到期，再扣减时长。现有运行时在归零当次即解除，已复现并登记到 D0/D3 的帧顺序差异。 [到期规则与本机证据](reports/game-static.md#legacy-work-context-frame-order)

历史 Item 的经典工艺已从工具栏和两种键位追到技能、等级和配方。十行控件随视图换回调，配方查询及最后一个工作窗口关闭时的解除顺序已有来源。 [经典工艺规格](reports/game-static.md#legacy-item-classic-work-recipe)

固定 SE 已核对小地图颜色缓存的命中与重建，以及命名调色板和普通绘制共享的解码暂存。三端沿同一资源规格补实现差异。320 号调色板载体的像素与色表已用实际素材复核。 [来源规格](reports/game-static.md#legacy-graphics-scratch-provenance) · [核验](reports/validation.md#legacy-graphics-scratch-provenance-validation)

**桌面浏览器的本机连接已实测**

原生 WebSocket 经现有回环桥完成写入、到期关闭、待处理读取消及重连。浏览器读取了替换连接的完整尾部和 EOF。窗口最小化和冻结命令期间页面仍报告可见，真实后台恢复待验。 [传输证据](reports/network-portability.md#desktop-stream-lifecycle)

在 iOS 27.0 模拟器的 Safari 中，切到设置后页面实际隐藏约 2.1 秒，帧回调暂停，同一回环 WebSocket 仍收到数据。切回后旧资源租约有效，重开 Safari 也能读回活动版本和两版回执。 [移动网页宿主证据](reports/architecture-and-milestones.md#mobile-safari-resource-lifecycle)

同版本的移动 Safari 也已实测 2.55 GB 资源 ZIP 的范围读取。两份资源库均初始化成功，关闭第一份后，第二份生成的参考帧仍与桌面摘要相同。 [实际 ZIP 和参考帧](reports/architecture-and-milestones.md#mobile-safari-resource-archive)

微信开发者工具已用游客模式运行独立夹具。基础库 3.18.0 的八组定位读取、重命名后的描述符读取、Canvas 像素和页面切换均有实际回执。真机、大档和产品验收仍待。 [微信模拟器实测](reports/architecture-and-milestones.md#wechat-devtools-offline-sdk)

同一 App 的主包和普通分包已通过现有双槽缓存写入并读回。重叠写入被拒，过期修订触发冲突。人为写入 60 字节候选后，新 App 启动读回修订 2，再提交修订 3 修复槽文件。 [双槽核验](reports/architecture-and-milestones.md#wechat-sdk-slot-store)

微信模拟器复现了缓存重建后旧请求因修订号相同而覆盖新记录。真实写入的回调被延后时，适配器先返回结果未知，随后可读回已写入的数据。两项用例归入网页与微信共用的发布恢复规格。 [缓存重建与迟到回执](reports/architecture-and-milestones.md#wechat-sdk-cache-recovery)

微信基础库 3.18.0 已实测 TCP 接口和两次本机建连。回调注册和移除均正常返回，回环地址和同机私有地址均在建立连接时失败。真机收发与关闭仍待验收。 [微信 TCP 实测](reports/network-portability.md#wechat-devtools-local-tcp)

**已核对 C82 登录器的游戏进程创建**

固定 C82 在前检后发布游戏目录和 EXE，将带引号的命令行与显式 EXE 路径交给创建接口。创建返回、仅刷新、失败清理及托盘提示已有来源规则。七组资源搜索已成规，随包 28 个长名候选与现有网页和共享入口相符。Windows 实际枚举及同版游戏接收仍待验。 [启动器来源规格](reports/launcher-static.md#c82-game-process-producer) · [资源参数](reports/launcher-static.md#c82-resource-arguments)

**历史资源交接已在桌面 Chrome 实测**

现有网页和共享模块用随包长名生成参数，选到了历史规格中的资源路径。从同一个实际 ZIP 初始化两份目录时，第二份读调色板前的后备存储约为 402 MB。关闭第一份后，第二份仍得到匹配的参考画面。 [交接证据](reports/game-static.md#legacy-resource-handoff) · [工作集记录](reports/architecture-and-milestones.md#desktop-resource-working-set)

**已核对历史 Item 的角色升级入口与删除等待**

选角从已加载的图形目录计算内容代。类别 7 在内容代 4 时开放升级选项。删除确认后的等待函数固定返回 0。升级资料的生产者、实际服务器删除及当前版本等价仍待证。 [来源与适用范围](reports/game-static.md#legacy-item-character-operations)

历史 Item 的四段检查提示最多写 142 字节，升级资料位于缓冲区起点之后 260 字节。`VKW` 检查回包及 `WDM` 升级结果的去向已核对，类别 7 的实际写入仍待证。 [资料范围与回包](reports/game-static.md#legacy-item-upgrade-buffer-provenance)

**桌面网页已验证资源换版及中断恢复的所选路径**

本机 Chrome 以原创分块实测，新版发布后旧页仍能读取旧版资源，释放租约后可删除旧根记录。隔离浏览器在提交前后各中断一次，重开分别读回旧版和已提交新版。 [中断恢复证据](reports/architecture-and-milestones.md#browser-update-recovery)

本机 Chrome 在显式 `commit()` 返回、发布调用方收到完成事件前中断，四次重开均读到已提交的资源根、回执和重启意图。同一更新编号重试返回已有回执。 [显式提交中断](reports/architecture-and-milestones.md#browser-explicit-commit-interruption)

本机 Chrome 在受控配额下实际中止了资源准备和发布事务，旧版与原回执仍可读。恢复配额并重开后，原更新重试成功。逐块写入时，先前完成的块在重开后仍可读，候选根保持待准备。 [配额与重试证据](reports/architecture-and-milestones.md#browser-update-quota)

两份与安装包资源等量的原创载荷共存约 5.23 GB，两个版本均完整读回。旧页持有 Blob 会延迟空间释放，预算已计入这段占用。实际产品工作集、手机和微信验收仍待。 [等量存储与回收证据](reports/architecture-and-milestones.md#browser-full-resource-budget)

**历史 Item 的普通训练入口已核对**

同一 Item 样本的 `Q?m` 十种训练模式实际进入经典窗口 37、52、54。选宠和选技能栏的回复在已有 54 号窗口时更新资料。另一套窗口的触发和帧分派仍待证。 [来源规则](reports/game-static.md#legacy-item-training-ingress)

**已核战斗结果第四格的来源与复用**

固定 SE 的新角色分配会清零结果区。两种已核队列重置及三字段写入保留同一角色、同一行的第四格。已有共享核心通过原创 105 指令确认旧值跨重置和同槽更新传给护卫结果及其复制行，新建角色从零开始。生产者局部暂存及完整战斗接受仍待。 [来源规则与本地核验](reports/game-static.md#battle-result-tuple-lifecycle)

**四条魔力配置的已安装补丁器身份已核对**

从主安装包实际取出的 `Patcher_PUK3.exe` 与固定 REA 样本逐字节相符。随包游戏目录的四条魔力配置均引用这个文件，两份留存更新清单的相关声明也匹配。缺文件分支的回退制品和实际运行仍待证。 [来源与适用范围](reports/launcher-static.md#installed-patcher-association)

非反射 106 的所选 RID 查找会读取 105 的共享动画游标。低等级 116 若继续推进到结果索引 200，会读取与游标和动作区重叠的字段。实际运行值和恢复仍待。 [独立结果身体规则](reports/game-static.md#battle-detached-rid-context)

**技能 105 的游标与退场顺序已核对**

两份历史样本的入场和退出清表从游标之后开始。退出子状态 7 跳过动作分派，子状态 9 的合资格回调仍可在清表前推进。原创夹具确认现有共享核心普通退出后保留游标，再次入场从动作 8 接续。 [来源与验收](reports/game-static.md#battle-105-cursor-lifecycle)

**已核对安装包的资源范围**

2,367 个应用文件逐一匹配安装器清单。`bin` 与 `map` 共约 2.61 GB，等量双版本共存的载荷约 5.23 GB。烟雾动画首帧引用负高度 RD 记录。复用 9 个 REA 函数体确认该帧正常推进，普通绘制准备缓存后裁掉该帧。现有共享动画模块的正高度检查差异已用原创夹具复现，列入 D0/D4。 [资源测量与源规则](analysis/capability-first-v1/resource-corpus-budget.json)

**已补齐另一套图鉴的页恢复规则**

固定 SE 和 Item 样本的列表首次初始化为第 0 页，从详情返回时按所选记录序号除以 15 并向零取整。Item 还核到了六个训练窗口的资料构造和打开请求。正常输入及帧分派仍待证。 [来源与适用范围](reports/game-static.md#legacy-item-window-producers)

历史 Item 的图鉴和邮件已核到选角、缓存重载和回包入槽。入场先清两份邮件缓冲，再按配置目录读取。图鉴摘要和详情按消费时的角色槽更新。 [缓存与回包规格](reports/game-static.md#legacy-item-album-mail-lifecycle)

历史 Item 的个人、家族和迷你邮件已核到来信入槽、未读顺序及普通和宠物发件的本地历史。D0/D3 共用收发规格和缓存用例。服务端投递、附件结算及当前版适用性仍待证。 [收发规则](reports/game-static.md#legacy-item-mail-history)

**登录回调补证：嵌套退出hook来源已明确（2026-11-11）**

固定C82的App Init/OLE setter与quit callback已绑定，实际调用参数为(1,1)，所选资源清理前缀与本地零参分支分开。新增7完整native/477B，复用已有初始化/退出主体；普通modal替换binding、实际资源/消息/Host退役仍待，L03不提升。

19项固定来源本域规格就绪保持，产品仍stage306；全能力/统一门槛、真实三端与官方接受未完成。本批8项接受案例未执行，原GP补丁五组与UH三端更新方案继续复用。

[quit hook合同](analysis/capability-first-v1/launcher-quit-hook-contract.json) · [源核验](build/analysis/launcher-quit-hook-v1/source-review.json) · [本轮核验](build/analysis/launcher-quit-hook-v1/validation.json) · [补丁规格](analysis/capability-first-v1/launcher-game-patch-functional-specification.json) · [三端更新设计](analysis/capability-first-v1/shared-update-host-design.json)

<a id="launcher-exit-admission"></a>

## About/Exit源路径已补齐，普通重绑准入仍待（2026-11-10）

固定C82中，App+20的主Frame写者、E140 About与E141同步WM_CLOSE、Frame busy/延迟关闭及后续doc/save/recovery/window条件已归为8操作/16事实。错误提示前busy已清，不能单靠busy阻止提示期间的close；窗口销毁请求、外层App退出和通道slot0删除分别表达。

外层Run在pump返回0后才进App退出；嵌套modal返回quit另有helper，其对象+3c可选callback先于PostQuit。正常callback退役顺序因此保留前提，不宣称全路径安全。9个必要新完整体/1198B，另1个3B常量槽未用于覆盖、2个旧体重复查询单列；复用19完整与4派生，33窗4851B/1587规范指令、12指针核原件，REA两会话已关闭。

LS-U3普通modal重绑的合法producer/投递准入、必要quit hook与真实宿主接受仍待。原40/81/37/10/6及16本域就绪不变，产品stage306未改；本轮没有新目标测试、构建、SDK/VM或账号官服操作。原LR四例直接复用，继续按原矩阵合成其他能力规格，不扩展框架helper库存。

[退出准入合同](analysis/capability-first-v1/launcher-exit-admission-contract.json) · [源核验](build/analysis/launcher-exit-admission-v1/source-review.json) · [既有端口结果](build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](build/analysis/launcher-exit-admission-v1/validation.json)

<a id="launcher-callback-reentry"></a>

## 登录回调普通入口已归类，LS-U3仍待准入证据（2026-11-10）

本轮把current C82的借用、modal、热键/托盘、排队目录恢复、预设和timer组合为10操作/21事实/9入口。0x8241实际是捕获game/step的目录恢复消息；热键与托盘左键负责显示，右键另有E140/E141，不能混成一类。旧tail先删owner当前registry再比旧pointer/serial的效果仅是条件源结论，尚未证明所需普通重绑序列或真实故障。

复用22完整native与13派生视图，只新增5完整native/748B及1 containing查询；43窗14,671字节/4,248规范指令核到原PE，LLVM独立LOCK前缀行有明确归并记录。4项原创异步端口例通过，迟到open/read/write及close中启动另一会话不误关新会话；这不是Windows/SDK或官服测试。

LS-U1/LS-U2已闭范围保持，LS-U3的普通modal新binding准入、关于/退出销毁与实际消息顺序仍待；L03及统一门槛不提升。原40/81/37/10/6和16本域就绪不变，产品stage306未改。继续只查影响原需求的具名缺口，其他能力按既有矩阵推进；完整三端/SDK/账号官方接受未运行。

[回调入口合同](analysis/capability-first-v1/launcher-callback-reentry-contract.json) · [源核验](build/analysis/launcher-callback-reentry-v1/source-review.json) · [端口结果](build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](build/analysis/launcher-callback-reentry-v1/validation.json)

<a id="launcher-legacy-failure"></a>

## 当前登录器补证：旧版typed失败与重试frame已成规（2026-11-10）

L03 LS-U1具名源规则已闭合：实际EH表只接匹配cdll::Exp/state11，普通连接/context失败与数字send结果、容量等待分列；catch按wrapped最后候选终止，但即时清理另比未wrapped initial-1。首候选0的最后失败不走这组即时清理，414e90 UI刷新不补杀登录timer或Close。

复用16完整记录，仅新查2完整native/509字节和1直接caller；19窗口/1800指令核到原PE，69字节非连续tail与父frame回跳分清，REA已导出关闭。129原创目标例通过，55候选顺序相符、10组局部清理差异；770只是静态标量解释，不是原程序测试。

保留已闭LS-U2材料与原40/81/37/10/6、16本域就绪和owner/依赖/批次。LS-U3当前callback普通入口及真实三端/SDK/同版账号官方接受仍待，L03整项false；产品stage306未改，完整接受与构建未运行。以下旧LS-U1状态由本节覆盖，统一门槛前不新增功能。

[旧版失败合同](analysis/capability-first-v1/launcher-legacy-failure-contract.json) · [源核验](build/analysis/launcher-legacy-failure-v1/source-review.json) · [纯目标对照](build/analysis/launcher-legacy-failure-v1/focused-probe.json) · [本轮核验](build/analysis/launcher-legacy-failure-v1/validation.json)

<a id="launcher-derived-material"></a>

## 当前登录器补证：短派生材料的两版规则已分清（2026-11-10）

原L03 LS-U2所选普通流程已补证：旧601b连接池创建清零payload，正常475100清理结束前再清整条0x48d8记录；首次握手的短有效hex仅覆盖两个方向缓冲前部，尾部在所证零初态下保持零。c82f则在完成阶段要求至少16字符，不足返回-5，无法到达key写或state2。两版不能套用同一填充政策。

新增5份完整native/3600字节，复用5份完整记录与8派生视图；8个独立读窗/1122条指令核验通过，两REA会话已导出关闭。27项原创纯核心对照中current14项材料行为相符，旧版7项短材料被现有generic拒绝，列为待实现差异。旧LF/LS源档案不改，所选LS-U2/LS-F06由本合同覆盖。

L03仍因LS-U1必要异常续体、LS-U3准入callback等未整项就绪；pool归还先于清零，中断/并发复用不在已证普通序列内。原40/81/37/10/6、16项本域就绪和owner/依赖/批次保持。产品stage306未改，完整接受、三端/SDK及账号官方接受未执行；统一门槛前不开发新功能。以下历史LS-U2待证状态以本节为准。

[材料合同](analysis/capability-first-v1/launcher-derived-material-contract.json) · [来源核验](build/analysis/launcher-derived-material-v1/source-authentication.json) · [纯模块结果](build/analysis/launcher-derived-material-v1/focused-probe.json) · [本轮核验](build/analysis/launcher-derived-material-v1/validation.json)

<a id="launcher-session-functional-specification"></a>

## 当前能力规格：登录交换双来源八组已合表（2026-11-10）

L03原连接、挑战、提交、记录/消息分片、回复、取消、超时、错误，按601b/c82f分别合成16操作、20事实与6组开发差异。旧版原临时路径失效后，从用户原安装包离线选取登录器并普通解压UPX容器，完整SHA-256重新匹配601b；c7ba副本未替代。原件及安装器未运行。

复用78完整旧版记录和70当前来源行（46canonical行，派生/重复另列），关键窗口核到原PE；882项原创纯模块检查通过。保留两个正确record/handshake核心，明确现有总10秒deadline与current每候选/提交后各10秒差异。旧版必要异常续体、短材料key初态及conditional callback普通序列仍开放，L03不提升；25条完整接受未执行。

继续先全部需求成规、再统一A1..A4和D0–D6开发。原40/81/37/10/6、16项本域就绪及owner/依赖/批次保持；产品仍stage306，本轮无产品修改、完整构建/套件、SDK、VM、原程序或账号/官方联网。微信首次设置授权仍待原请求回复，不重发。以下历史下一步以本节及当前平台状态为准。

[双来源操作规格](analysis/capability-first-v1/launcher-session-functional-specification.json) · [来源核验](build/analysis/launcher-session-functional-specification-v1/source-authentication.json) · [纯模块结果](build/analysis/launcher-session-functional-specification-v1/focused-probe.json) · [本轮核验](build/analysis/launcher-session-functional-specification-v1/validation.json)

<a id="wechat-sdk-host-probe-preparation"></a>

## 当前平台分析：微信SDK探针已准备，工具设置待确认（2026-11-10）

本机微信开发者工具2.02.2609250签名/CLI安装检查通过，随附wechatide-skill0.3.11可用。9文件原创游客AppID探针及本机对端已准备，覆盖1MiB文件、8范围/零长/回调/rename、Canvas/字体度量/前台RAF、Page导航和257B本机TCP的计划样例。JSON/JS及原4769公共路径检查通过，尚未导入/运行SDK。

状态检查触发Codex首次授权，实际弹窗写明“允许后将开启服务端口”。同一auth任务两次查询因WechatIDE server未启动失败，未证明终态、未重发原操作；已提出具体工具设置确认。没有点击允许、改安全配置、读取令牌、启动peer/SDK或执行游戏。

高偏移计划只读小文件EOF，不能证明4GiB文件支持；Page导航也不是App/OS后台。原14端口/62方法/22完整用例及40/81/37/10/6保持，X03/X05/X06规格和平台就绪均不提升；产品仍stage306，统一门槛未过。不依赖该确认的静态规格工作继续。

[工具/探针档案](analysis/capability-first-v1/wechat-host-profile.json) · [原创探针](build/analysis/wechat-host-conformance-v1/probe-project/pages/probe/index.js) · [准备核验](build/analysis/wechat-host-conformance-v1/preparation-validation-v2.json) · [本轮核验](build/analysis/wechat-host-conformance-v1/validation.json)

<a id="game-battle-functional-specification"></a>

## 当前能力规格：战斗原十四组范围已合表（2026-11-10）

继续按“全部需求先REA成规 → 统一状态/接口与A1..A4 → D0–D6按依赖复刻 → 网页/移动网页/微信及真实环境验收”。B01入场/输入/回合、B02命令与全部已要求变体、B03身体/效果、B04退出/恢复合成91操作、57事实和12组开发差异；原24token、110显式class、14个SKL组及10消费者内容保持。

B01/B04仅固定37c4本域规格就绪；B02/B03必要foreign RID、第四scratch、role/pointer alias和105 cursor来源/生命周期仍待证。复用75完整native记录122401B、24旧派生62998B、358规则节点及51变体规格；435000旧28B记录与完整461B直接CFG分列，无新增REA分析查询/静态引擎进程。

纯核心通过240C/7数值/240目标mask/180目标编码/18环边界和ACK/调度；明确当前observer拒绝、transform缺项、窗口/特殊技能及12/267等差异，复用正确接收/目标/return所有者。44完整案例未执行，产品仍stage306，无产品修改、完整套件/构建、VM/原程序、网络/账号或实际三端运行。

原40/81/37/10/6、owner/依赖/批次保持，统一门槛未通过。下一批审定X01–X08及登录器剩余必要规格，已知战斗helper停止扩展；BF-U1只按正向来源补证。以下历史下一步以本节为准。

[战斗操作规格](analysis/capability-first-v1/game-battle-functional-specification.json) · [纯核心检查](build/analysis/battle-functional-specification-v1/focused-probe.json) · [核验](build/analysis/battle-functional-specification-v1/validation.json)

<a id="game-work-functional-specification"></a>

## 当前能力规格：普通技能与工作六组范围已合表（2026-11-10）

继续按“全部需求先REA成规 → 统一状态/接口与A1..A4 → D0–D6按依赖复刻 → 网页/移动网页/微信及真实环境验收”。本批将G18制造/装饰、鉴修/刻印、两级目标、采集、直接技能、上下文和两套窗口合成60操作、26组事实及7组实现差异。另一套窗口实际活动/不活动分派与必要入口仍缺证，G18整项保持未就绪。

复用95份完整原生记录31751B、61条旧派生观察（59入口、48697B）、54规则节点；3经典描述符、16另一套表行、14B小指令和7B因子表核原PE。本批没有新增REA分析查询或静态引擎进程。

纯模块对照保留正确的目标序号、暂停晚到展示、装饰无随机数及骑乘MP例外；确认配方reset上下文源0/当前保留1、移动与到期顺序和共享计数/byte生命周期差异，归WK-D1..7统一开发。30完整案例未执行，产品仍stage306；统一门槛未通过，无产品代码、VM/原程序、网络/账号或实际三端运行。

原40能力/81登记/37历史要求/10消费者组/6来源及所有者、依赖、批次保持。下一组转原B01–B04与公共能力必要规格，已证工作helper停止扩展。以下历史下一步以本节为准。

[工作操作规格](analysis/capability-first-v1/game-work-functional-specification.json) · [纯模块对照](build/analysis/work-functional-specification-v1/focused-probe.json) · [核验](build/analysis/work-functional-specification-v1/validation.json)

<a id="game-social-family-album-functional-specification"></a>

## 当前能力规格：队伍、家族、图鉴72项操作已合表（2026-11-10）

继续按“全部需求先REA成规 → 统一共享状态/接口 → A1..A4 → D0–D6按依赖复刻 → 网页/移动网页/微信及真实环境验收”。本批将G14队伍/好友、G16家族/称号/家族兽/饲料箱、G19图鉴的原12组范围合成72操作、30组事实和9组实现差异。G14/G16仅固定37c4来源本域规格就绪；G19另一套列表实际激活与page初始/恢复仍缺证，整域未就绪。

171份完整原生记录72772B、66条旧派生观察（63不同入口）、58个保留规则节点和186个原文件读窗复用。六次REA函数查询均无过程元数据、0新增原生Evidence；沿具名业务窗口/调用补25份静态派生3394B，1067条指令与原PE独立核对。一个重叠读窗归回父函数，未重试或改原分析元数据。

纯模块检查通过，保留正确的共享500ms、战斗退役/队伍重绑、有效名称拒绝、喂食例外和图鉴名称/分类。现有家族ID清表、原子/pending政策、单bank图鉴与源规则差异列入统一开发；迷你删除的20次字段写与十条逻辑历史分列，不宣称运行故障。30项完整接受未执行，产品仍stage306；无产品修改、完整构建、VM/原程序、网络/账号或真实三端运行。

原40/81/37/10/6、所有者/依赖/批次保留；统一门槛未通过。下一组转G18工作/工艺、战斗与公共能力，停止已知本业务helper扩张。以下历史下一步以本节为准。

[操作规格](analysis/capability-first-v1/game-social-family-album-functional-specification.json) · [纯模块结果](build/analysis/social-family-album-functional-specification-v1/focused-probe.json) · [核验](build/analysis/social-family-album-functional-specification-v1/validation.json)

<a id="game-ordinary-services-functional-specification"></a>

## 普通业务需求规格（2026-11-10）

执行顺序为“原40项需求能力 → REA分析至可实现规格 → 统一共享状态与接口 → A1..A4复核 → D0–D6按依赖开发 → 网页/移动网页/微信及真实环境验收”。每项规格写明输入、状态、输出、失败/取消、所有者和证据；已有正确核心与来源直接复用，只为会改变必要行为的具名缺口继续取证。这样减少重复分析、跨模块返工与三端重复实现；目前没有可核验的整体节时比例或剩余工期。

本批将背包/装备/拾取、交互/对话/外观、商店/给予、训练/治疗、交易/仓储的原18组范围合成78操作、30组事实和10组实现差异。G09/G10/G11/G13仅固定37c4来源本域规格就绪；G12经典十mode已成规，但另一套55..59/67实际激活与需求关联仍缺证，整域保持未就绪。原40/81/37/10/6、所有者、依赖与批次保持。

202份完整原生记录77508B、180条旧派生观察（167个不同入口）和43个保留规则节点复用。三次REA函数查询均返回无过程元数据，未新增原生Evidence；仅沿有证回调补10份静态派生视图7351B，2169条指令与原PE字节独立核对。纯模块对照通过，31项完整接受未执行。产品仍stage306，统一门槛未通过；本批无产品修改、完整构建、原程序/VM、网络、账号或真实三端运行。

下一步回原G14/G16/G18/G19、战斗与公共能力；本业务helper族停止扩张，训练只保留具名条件发现。以下历史下一步以本节为准。

[业务操作规格](analysis/capability-first-v1/game-ordinary-services-functional-specification.json) · [流程](reports/development-plan.md#game-ordinary-services-functional-specification) · [纯模块结果](build/analysis/ordinary-services-functional-specification-v1/focused-probe.json) · [核验](build/analysis/ordinary-services-functional-specification-v1/validation.json)

<a id="game-presentation-functional-specification"></a>

## 当前能力规格：图形与文字52项操作已合表（2026-11-10）

G06原五组范围合成30操作，G07原四组范围合成22操作；224份完整原生记录163193B、35个保留规则节点和6个派生视图2554B分别核验，没有新增REA分析查询。RD/CUT/AUT、动画、命名调色板、透明/加色、水面、字节布局/编辑/IME、姓名值条和小地图沿原所有者整合；PR-D1..8复用正确模块，只登记共享实现差异。

纯模块对照通过187组文字宽度、2304组标签、9网格/18小地图像素、20组颜色；合成5×2示例明确冷/热缓存行地址不同，当前非4倍渲染仍显式拒绝，宿主字体像素仍未验证。G06完整规格因所需scratch尾部生产/别名/复用与后端/版本上下文保持未就绪；G07仅固定来源本域规格就绪，原G05/G06依赖未整合。24项完整接受未执行。

产品仍stage306，统一A1..A4未通过。本轮只修改规格和文档，未构建、执行VM/原程序、联网或运行真实三端。原40/81/37/10/6与所有者/依赖/批次保留；下一组审定背包/交互等剩余业务，已知图形/文字helper停止扩张，G06具名条件等实际必要上下文再补。以下历史下一步以本节为准。

[图形与文字操作规格](analysis/capability-first-v1/game-presentation-functional-specification.json) · [scratch边界](build/analysis/game-presentation-functional-specification-v1/scratch-review.json) · [纯模块结果](build/analysis/game-presentation-functional-specification-v1/focused-probe.json) · [核验](build/analysis/game-presentation-functional-specification-v1/validation.json)

<a id="game-actor-functional-specification"></a>

## 人物和对象需求规格（2026-11-10）

执行顺序统一为“40项需求能力清单 → REA分析至可实现规格 → 共享核心与薄适配设计 → 按依赖分批补齐实现 → 网页/移动网页/微信与真实环境验收”。保留81登记、37历史要求、10消费者组和6来源，不用函数数量或局部就绪数估完成率。已有正确模块直接复用；只有会改变必要行为的具名证据缺口继续取证。账号/同版材料/实际设备接受分别记录。统一A1..A4通过前不增加产品功能。

G05固定37c4原六组范围已合成42操作/18组事实，新增明确的C0可变尾部、81/82控制器/子对象/登记链、共享显示槽与本地动作差异。179份完整原记录复用、13份必要正向查询；192体65756B与5个派生视图保留不同证据级别。72组原创样例对照通过；现有C0尾部、协同消费者、本地30重置差异登记GA-D1..7，25项完整接受未执行。

G01/G03/G04/G05/G08/G15/G17仅各自固定来源本域规格就绪，依赖与统一门槛仍未完成；产品仍stage306。本轮没有产品功能、构建、VM、网络或三端运行。下一步回原G06等未决能力，只补具名缺口；本对象辅助链停止扩张。节时收益来自证据与核心复用、减少返工，尚无可靠整体节时比例或剩余工期。以下历史下一步以本节为准。

[角色对象操作规格](analysis/capability-first-v1/game-actor-functional-specification.json) · [开发流程](reports/development-plan.md#game-actor-functional-specification) · [来源补充](build/analysis/game-actor-functional-specification-v1/source-supplement.json) · [核验](build/analysis/game-actor-functional-specification-v1/validation.json)

<a id="game-flow-functional-specification"></a>

## 当前能力规格：游戏主流程与返回整链已成规（2026-11-10）

G03固定37c4原五组范围已合成33项操作：实际初始化主1、内容模式分支、主5重置/主6握手、22个主9子状态、普通/战斗/回城重建、主动/服务端返回及程序退出。复用63份完整原生记录，只新增3个由主分派直接调用的初始分支；66体30961B与7体1908条独立指令已绑定原件。45CFD0明确写主1，不能从虚拟零或现有登录接口推初始主2。

原创纯模块检查确认现有main5仍明示完整reset未实现，入场成功回包/轮询与场景可用分离；回城边界保留1帧、清屏等待30次，取消后的旧capture被丢弃并清除。GF-D1..6登记完整reset、主9组合、返回/退役及平台效果差异，未修改产品代码。20条完整接受条件未执行。

G01/G03/G04/G08/G15/G17只各自固定来源本域规格就绪。原40/81/37/10/6和G02升级来源等缺口保留；统一A1..A4未通过，产品仍stage306。下一组审定对象/图形的原要求，复用本流程及已证辅助，不重复主状态/返回取证。以下旧下一步以本节为准。

[主流程操作规格](analysis/capability-first-v1/game-flow-functional-specification.json) · [来源](build/analysis/game-flow-functional-specification-v1/source-authentication.json) · [补充来源](build/analysis/game-flow-functional-specification-v1/supplement-source-authentication.json) · [核验](build/analysis/game-flow-functional-specification-v1/validation.json)

<a id="game-communication-functional-specification"></a>

## 当前能力规格：旧版游戏通信整链已成规（2026-11-10）

G01固定37c4原六组需求已归并为33条操作、13组事实与5组开发差异：资源/版本前置、模块摘要、连接与首包、外帧/正文/文本、收发队列和空闲维护。复用134份完整函数源，新增7个直接决定结果的函数；141体/66345B、6个后续发送窗口与3个小型机器码视图区分证据级别。104接收分派与当前66个唯一发送格式、164份原标签存储字校验已对齐；GC实际是两字节标签。

119个外帧拆分位置及初始化/重置保留旧材料/替换/首包顺序/完整状态字/阶段99优先检查通过。计时器环绕的两组对照确认当前elapsed宿主与源绝对截止时刻不同；另补出可选旧版版本目录预检及收发错误规则，均为待对应批次实现的差异。未运行原程序、Windows API或连接历史地址；16条完整接受案例未执行。

G01/G04/G08/G15/G17仅各自固定来源本域规格就绪；依赖整合、实际三端、当前同版游戏消费者和官方接受仍未完成，统一A1..A4未通过，产品仍stage306。接下来复用已有状态/对象/图形材料审定剩余能力，不重查本通信族；以下旧下一步以本节为准。

[通信操作规格](analysis/capability-first-v1/game-communication-functional-specification.json) · [源核验](build/analysis/game-communication-functional-specification-v1/source-authentication.json) · [新增来源](build/analysis/game-communication-functional-specification-v1/supplement-source-authentication.json) · [本轮验收](build/analysis/game-communication-functional-specification-v1/validation.json)

<a id="launcher-config-path"></a>

## 当前能力规格：Config路径的两层校验已补齐（2026-11-10）

已关闭下方LF-U2具名来源缺口：434610比较原字节的严格目录后代关系；4349B0按最终句柄路径或缺API的属性扫描分支校验。候选不存在时可能解析已有祖先、再拼回后缀；路径校验通过不证明目标存在。两层通过后输出仍是原词法完整路径，随后CreateProcess另有结果。

复用9份完整原生记录，新查8个直接决定结果的函数，17体/8282B/2883条独立指令绑定原PE；REA已导出关闭。5份原创情境运行既有纯路径/元数据模块，明确UNC、最终路径与文件存在的不同合同；源算法/Windows API未执行。新规格不改旧LF不可变证据，不提升L01–L08、当前同版游戏消费或实际三端接受。

全需求能力分析→统一A1..A4→共享能力成组开发的顺序保持，产品仍stage306。下一步离开已闭合路径族，审定原多来源必要操作与其余能力；不重复根函数或继续追系统内部。以下“两子谓词未闭合”由本节覆盖，其他未决保留。

[路径合同](analysis/capability-first-v1/launcher-config-path-contract.json) · [来源与ABI核验](build/analysis/launcher-config-path-v1/source-authentication.json) · [本轮核验](build/analysis/launcher-config-path-v1/validation.json)

<a id="launcher-functional-specification"></a>

## 当前能力规格：登录器原范围已对齐，当前首次配置已补证（2026-11-10）

流程保持“先 REA 覆盖全部需求能力 → 可追溯规格与统一 A1..A4 → D0..D6 共享能力成组开发 → 网页/移动网页/微信逐端验收”。分析已有答案即复用；只补会改变必要操作的证据，不逐函数开发或追完所有库函数。预期减少重复取证与跨端返工，尚无可靠的整体节时比例或剩余工期。

本轮按原范围、来源、所有者、依赖和批次审定L01–L08，保留19条已有操作，补8条C82首次配置操作；只新增40E900/4329B0两次REA查询，复用11份完整原记录。新旧首次配置不可互换：601b同步无限等待；C82以250ms轮询、15分钟提醒，并区分三种特殊退出码、捕获的section/key、缓存先行与写入失败。6组原创纯模块对照通过，确认现有legacy Config和30分钟patch策略不能直接充当C82 Config。路径ABI已纠正为三参数/布尔返回，两个具名子谓词内部仍未闭合。

L01–L08整体仍未就绪，尤其L07缺当前同版游戏消费者；不以这些选定操作宣告所有来源完整。G04/G08/G15/G17仅固定来源本域规格就绪，产品仍stage306，统一A1..A4和实际三端/官方接受未通过。下一步复用具名路径材料补必要谓词，并按原范围审定剩余能力；条件入口无正向准入不扩张。以下旧下一步以本节为准。

[登录器规格与原范围对照](analysis/capability-first-v1/launcher-functional-specification.json) · [来源核验](build/analysis/launcher-functional-specification-v1/source-authentication.json) · [本轮核验](build/analysis/launcher-functional-specification-v1/validation.json)

<a id="map-functional-specification"></a>

## 当前能力规格：地图与移动完整链已归并（2026-11-10）

G04原五组需求已形成36操作和4组开发差异。复用26组既有规则、19个共同合同节点、102份完整native来源和220项映射/字节检查，没有新增REA函数查询。

已修正缓存头说明（非尺寸word4/8，width12/height16），并确认位置纠正窗口顺序差异：原先按旧坐标取窗口，当前接收层先取新坐标。6份原创头夹具通过，纯helper对照显示差异，产品修复待对应开发批次。G04/G08/G15/G17仅固定来源本域规格就绪，产品仍stage306；统一A1..A4、真实三端/现行同版和官方接受未完成。下一步集中归并登录器现有19操作与L01–L08原范围，明确L07当前消费者缺口，再补其余必要规格；以下旧下一步以本节为准。

[地图操作规格](analysis/capability-first-v1/game-map-functional-specification.json) · [来源核验](build/analysis/map-functional-specification-v1/source-authentication.json) · [本轮核验](build/analysis/map-functional-specification-v1/validation.json)

<a id="audio-functional-specification"></a>

## 当前能力规格：音频整链已归并（2026-11-10）

固定37c4的G08原三组需求已合成34项操作和8组开发差异，复用42组规则、67份完整REA体及11份派生体绑定，没有新增函数反编译。音乐、事件/环境、MIDI、流式与退役沿同一套共享更新/资源/音频端口接线。

G08/G15/G17仅本域固定来源功能规格就绪；产品仍为stage306。X02/X03依赖、GM/FPU/16字节载体、真实三端及同版官方接受未完成，统一A1..A4仍未通过。G02最近复制候选已按固定长度排除，材料来源仍未知；不再重复此候选。下一项集中复核G04原地图/碰撞/移动完整操作，以下阶段旧下一步以本节为准。

[音频操作规格](analysis/capability-first-v1/game-audio-functional-specification.json) · [来源核验](build/analysis/audio-functional-specification-v1/source-authentication.json) · [本轮核验](build/analysis/audio-functional-specification-v1/validation.json)

<a id="browser-surface-observations"></a>

## 当前宿主实测：编码、字体、画布与音频

Chrome156/Playwright1.64.1完成10组定向观察。CP936表内21791映射全匹配、256单字节一致，但浏览器另接受2149个表外双字节位置及GB18030四字节；不能仅凭“gbk”标签替代项目声明的字节域。opaque640×480精确往返，半透明ramp在两组选项下有192/194像素差异；源逻辑字宽45/35与宿主48.222/37.506不同，native字形继续未验。

音频手势前suspended且resume未完成，点击后取得running/ended/suspend/closed回执。浏览器WAV解码与项目PCM换算不同，实际手动AudioBuffer路径的4类PCM/6声道值及gain精确，所测loop误差0；context44100解码把64帧变成128帧。两次失败实验保留，不把原始decoder假设改成兼容证明。物理可闻输出、手机/微信和完整容量未验；产品stage306、14端口合同与AH档案原hash保持。

[宿主表面档案](analysis/capability-first-v1/browser-surface-profile.json) · [证据与约束](build/analysis/browser-surface-conformance-v1/specification.json) · [本轮核验](build/analysis/browser-surface-conformance-v1/validation.json)

下一步回到CH-U1（459BC0读取923C40）的具名必要源问题，仅沿已有正向初始化/别名/注册材料推进；没有正向边就保留缺口并处理其他必要业务，不重跑精确指针搜索或已知helper。统一A1..A4仍未通过，原40/81/37/10/6不变。

<a id="browser-host-observations"></a>

## 当前宿主实测：范围读取、提交与重启

Chrome156.0.8078.80/Playwright1.64.1完成10组本地原语检查：13组File范围跨2^32及短读核字节，源改变后旧File元数据不变但读失败；IDB请求成功后abort保留旧版本、两个连接只一个提交，以及正常重开浏览器恢复提交记录。原创4GiB+8192稀疏夹具实占73728B，最大单读1MiB；不代表完整原资源容量。

CDP输入/390×844触控取消仅是桌面Chrome模拟。两次compositionend为untrusted；“冻结”命令接受后最大帧间隔仅18.3ms，未证明后台暂停。quota/deviceMemory/strict durability均不当内存预算、持久化保证或真实设备接受。14端口/62方法合同原hash保持，产品stage306未改，统一门槛仍未通过。

[宿主实测档案](analysis/capability-first-v1/browser-host-profile.json) · [来源与约束](build/analysis/browser-host-conformance-v1/specification.json) · [本轮核验](build/analysis/browser-host-conformance-v1/validation.json)

下一步补A4剩余codec/font/canvas/audio等具体宿主字段，并只推进具名必要A1/A3缺证；不重跑已知辅助链或据本轮启动游戏新功能。本节补充下方入口台账后的宿主实测进展。

<a id="required-entry-admission"></a>

## 需求入口审查

先覆盖全部需求的必要逻辑、协议、状态、错误和重入，再审定共享合同，按D0–D6复用stage306成组开发，最后分别验收网页、移动网页、微信及同版接受。达到可实现和可判定验收的深度就停止追辅助函数；没有实测依据，不给节时百分比或总工期承诺。

本轮完成限定入口处置台账：647根/2768次代码出现、72条既有审查及C82的14模板/84控件/6命令分别对应来源角色和使用条件。211根有原typed事实/赋值/上下文；其余436不代表436项缺失功能，也不能因有函数体就视作业务闭合。零新增REA查询，3301组声明字节与固定原件匹配。

A1限定台账已复核，完整业务准入和统一A1..A4仍未通过；原40/81/37/10/6、G15/G17局部就绪及产品stage306保持。下一步转向A4具体宿主参数/一致性测量，并只补具名必要源缺口；不再重包同一前沿或逐函数开发。本节覆盖下方历史“下一步入口准入”安排。

[入口与需求台账](analysis/capability-first-v1/entry-admission.json) · [本轮规格](build/analysis/required-entry-admission-v1/specification.json) · [静态核验](build/analysis/required-entry-admission-v1/validation.json)

<a id="capability-first-current"></a>

## 当前安排：先分析全部能力，再分组复刻开发

**当前共享接口与原范围复核**：原37条全文、10组完整行为及映射已逐项保留并形成47行有效处置表；已知12/267、435000双读序、29/32/特殊0x62等归源规则与开发差异，原RID/第四scratch/105共享cursor等实际上下文缺口没有被默认值替代。A2覆盖台账已审定；A1/A3、完整宿主参数与接受仍未通过。

共同开发合同已落为14组接口、62个方法、8类型、3状态表和14项失败边界：包括独立时钟域/输入焦点、源码callback尾部与物理排空、资源预算/稳定范围读取、权威提交/结果不明恢复、更新接管和真实重启绑定。[共享接口合同](analysis/capability-first-v1/shared-target-contract.json) · [47行原范围复核](build/analysis/required-context-contract-v1/reconciliation.json) · [本轮核验](build/analysis/required-context-contract-v1/validation.json)

这些是已审定的独立接口设计，尚未实现；22项验收未执行。原40/81/37/10/6、G15/G17局部就绪与stage306产品代码保持。下一步只完成必要入口准入台账（复用已有72条），按具名缺口取证；停止已知辅助链与同一规格的重复包装，统一门槛后按共同合同成组开发。

**当前邮件操作规格**：已把G20原范围合成50项客户端操作、14组规则、9组实现差异；选择/提交、回复/草稿、资料更新与重置、两bank/目录和关闭重入分别成规。4E1CF0六写清的是共用物品交互字段，未直接清六个邮件选择值；已核main5 bulk范围也不覆盖这些选择值。[邮件操作规格](build/analysis/mail-operation-composition-v1/specification.json) · [本轮核验](build/analysis/mail-operation-composition-v1/validation.json)

仍缺发送者最终投递/失败/拒收/撤销与附件结算的同版关联，G20整域规格保持未就绪，不把排队、本地历史、声音或通用消息改成成功回执。G15/G17局部就绪保持；原40/81/37/10/6与产品stage306不变，本轮未新增产品功能或执行VM/三端/联机。

复用13份完整REA体及21个明确派生视图，未新查函数/格式化器，REA保持关闭。后续按CA-N8集中审定原37历史要求/10消费者上下文的必要变体，以及D0所有者、时钟、输入、持久化、更新接管/重启共同合同；不为等待账号反复包装已知邮件辅助链。统一A1..A4仍未通过。

**当前流程与聊天规格**：先覆盖全部需求能力的必要逻辑、协议、状态和边界，形成可追溯规格；同一来源已有答案即复用，只补会改变实现的证据。所有能力通过A1..A4后，按共享状态/时钟/输入/文件所有者成组开发，再接网页、移动网页和微信适配及逐端验收。

G15原范围现已合成36项操作、12组规则和8组现实现差异，固定37c4局部功能规格就绪；G17既有就绪保留。发送节流三值与设置、队伍、接收抑制分别持有；main5批量重置覆盖设置而不覆盖已核发送状态范围。装载填零为PE规则推导，未当作真实首次发送快照。公告重入/时钟与气泡绝对到期政策已明确。[聊天操作规格](build/analysis/chat-operation-composition-v1/specification.json) · [本轮核验](build/analysis/chat-operation-composition-v1/validation.json)

复用38份完整REA体及1个明确旧派生体，没有重新查询函数；仅补5组精确引用和54条指令观察，完整会话214记录已导出并关闭。现有核心可复用，8组差异归D0/D3/D5与CT/IC/RP。G05/G07依赖、其余能力必要缺证和统一门槛仍未完成；产品仍stage306，未新增功能或运行三端/联机。后续只推进剩余必要操作规格与共享合同，停止已知聊天辅助链的重复深挖。当前结论覆盖下方历史G15待合表状态。

**当前正常退出与日志规则**：已接通消息泵→游戏清理→WinMain程序日志→CRT标准流刷新→最终退出的实际链。FEEF30程序日志与60FF20聊天文件分别处理；刷新/close调用不当写盘成功回执。6份新完整REA体、8份旧完整体及6个明确独立指令视图分别保存；3个未定义函数查询未充作dossier，REA已导出155记录并关闭。未改产品代码。 [退出规格](build/analysis/game-application-exit-v1/specification.json) · [核验](build/analysis/game-application-exit-v1/validation.json)

气泡534354的固定默认值和绘制分支已知；当前没有已准入的用户配置操作，发布/别名只在新正向入口出现时补证，不扩出新设置，也不宣称全局无写者。下一步用已有G15发送/接收/上下文与时钟规则合表，并继续邮件选择器及宿主合同。G15整体与统一门槛仍未通过；G17局部就绪、G02材料缺证和完整40/81/37/10/6范围保持。产品仍stage306。

**当前角色域操作规格**：G02原五项范围已归24行状态/操作表，复用33份完整REA记录，无新函数查询。外观、已知升级和现有网页/微信接线直接复用；删除前家族负责人警告已定位，后续固定体只返回等待0，不能宣称删除成功。类别7升级材料923C40的生产/所有者仍未证；其余所选源规则停止重复取证。4组差异并入既有D0/D2，未改产品代码。 [操作规格](build/analysis/character-operation-composition-v1/specification.json) · [核验](build/analysis/character-operation-composition-v1/validation.json)

G02整体规格仍因该具名材料来源保持未就绪；G17局部就绪及原40/81/37/10/6范围保持。接下来仅在出现正向来源时追材料生产，独立推进气泡配置534354发布/必要退出、其它必要状态组合与宿主合同，不再反复整理同一角色前沿。产品stage306，A1..A4及真实三端/同版接受仍未整体通过。

**当前逐项审定（2026-11-10）**：40项原范围、所有者、依赖、81注册、37复合要求、10消费者组和6来源profile保持。剩余工作已分为必要原始规则、操作/状态合成、宿主设计、实现差异、条件发现及外部接受；不再把旧未就绪标志当作缺函数。留言板六项功能规格在固定37c4下已就绪，依赖整合与真实接受仍未完成。4E1CF0已有完整REA和六项重置，不再重复反编译；角色删除仅证明等待，尚不能实现可用的服务端删除。 [逐能力审定](build/analysis/capability-specification-audit-v1/specification.json) · [留言板规格](build/analysis/capability-specification-audit-v1/G17-specification-review.json) · [核验](build/analysis/capability-specification-audit-v1/validation.json)

下一步先用已有来源合成角色操作与邮件选择器重置表，定位气泡配置534354的必要发布/退出规则，再完成入口准入、原战斗上下文与三宿主合同。现行同版消费者缺证与真实账号/设备接受分别保留。达到可实现规格深度即停止追辅助；A1..A4统一通过后按D0–D6只补stage306差异，三端共用核心。此流程预期减少重复取证和返工，尚无可证明的整体节时比例或项目剩余工期。

**固定C82补丁器缺文件来源已明确**：所选路径从启动器模块目录拼接“原Code文本.pat”，直接CopyFileA到游戏PatchEXE，再进入既有backup/start。旧Code\PatchEXE元数据不是该版来源。三态返回、busy owner、复制失败及启动失败后已复制文件保留均已成规；两项差异并入既有D0/D1。未改产品代码，统一门槛仍未整体通过。 [缺文件准备规格](build/analysis/launcher-missing-patcher-v1/specification.json) · [核验](build/analysis/launcher-missing-patcher-v1/validation.json)

**登录器完整操作组合**：现有同C82合同已合成19行操作表，涵盖成功/失败、取消关闭、晚到和重开；另保留legacy首次Config及更新器/patcher各自身份。预设外层取消保留已提交编辑、手动路径写成后发布、DNS旧job可迟完等边界明确。当前登录flow把候选和回复共用一次总期限，与源每候选/请求后分期开启期限有差异。6组差异归D0/D1，统一分析门槛仍未通过。 [操作规格](build/analysis/launcher-operation-composition-v1/specification.json) · [核验](build/analysis/launcher-operation-composition-v1/validation.json)

**战斗所选缺口已转为开发差异**：复用来源确认29是“观战结束”，点击发送U并进入phase7；32是“偷袭／被偷袭”，创建及每帧回调按phase/控制位更新、延迟退役。特殊场景main字段0x30==0x62先写菜单模式再早退，调用者仍确认音。三项当前差异已归D4，无新反编译/产品代码；40能力统一门槛仍未通过。 [来源合同](build/analysis/battle-observer-entry-contract-v1/specification.json) · [核验](build/analysis/battle-observer-entry-contract-v1/validation.json)

**当前前沿去重**：已对40能力行建立当前复核指向，10条“旧子问题→后续所选规则”关系保留原范围。较早SO键位/五工作计数已由OW覆盖，OW等级写者又有AW规则，不再按旧未决重复分析。窗口29/32的实际回调已有入口；旧observer字段名不是功能证明。无新REA查询/反编译或产品代码，统一门槛保持未通过。 [当前前沿](build/analysis/current-frontier-supersession-v1/specification.json) · [核验](build/analysis/current-frontier-supersession-v1/validation.json)

**当前共享占用组合**：真实接收准入已与交易/商店计数连接。活动商店普通再报价会返回，指定替换sequence先同步清旧窗口再改mode；group2实际构造、待关闭窗口及未完成动画分别登记。9条件行中两条pending动画组合为静态推断，未称原版运行或所有计数交错守恒。复用旧REA证据，无新反编译/产品代码，stage306与统一门槛保持。 [组合规格](build/analysis/shared-occupancy-composition-v1/specification.json) · [核验](build/analysis/shared-occupancy-composition-v1/validation.json)

**当前数量框规格纠正与生命周期**：移动提示的两个上限取来源数量，编辑初值应为0，已由九参数生产与七参数延后发布核对，替换旧“初值取数量”。正常重开、共享端点/回调、取消、所属窗口关闭和条件焦点恢复已有所选规则；静态条件路径与原版运行分开。复用旧证据，无新REA查询/反编译或产品代码，stage306/统一门槛保持。 [数量框规格](build/analysis/quantity-prompt-lifecycle-v1/specification.json) · [核验](build/analysis/quantity-prompt-lifecycle-v1/validation.json)

**当前输入与退出整链对照**：复用7份完整REA记录与13旧回调，区分控件/行动编号，确认精灵变身输入是具体开发差异。玩家/宠物/坐骑/物品、超时、普通退出、回城、注销及重入沿已有合同归并；旧局部未实现摘要不再重复扩大为缺源。无新REA查询/反编译或产品功能，stage306与统一门槛保持。 [整链规格](build/analysis/battle-input-exit-contract-v1/specification.json) · [核验](build/analysis/battle-input-exit-contract-v1/validation.json)

**当前战斗前置读者与特殊边界已归并**：把435000从旧28字节部分范围补充为461字节原文件直接CFG，保留两种权威，无新增REA函数查询/反编译。113/260读序、RID/scratch、98FF、ITM default和107信息ABI分成6行已知源/代码差异/必要上下文/接受；不再以旧partial28或未移植摘要重复追同一helper。下一步核完整输入、退出/重入与其它全能力必要规则。产品stage306，统一规格及三端/同版接受仍未完成。 [本批规格](build/analysis/battle-preflight-boundaries-v1/specification.json) · [核验](build/analysis/battle-preflight-boundaries-v1/validation.json)

**当前战斗必要规则已成所选规格**：12的吟唱/数值/等待，以及267的235/236/237、结果/视觉子体已从旧来源绑定；无新REA函数查询或反编译。发现generic135 seed接线和共享全屏特效转折计数的两处已有实现差异，与12/267专用消费者一起归BU-D1..D4，不再为已证helper循环补证。下一步复核剩余正常角色/RID/输入/退出及全40域必要规则，统一门槛后成组开发。产品stage306，三端及同版接受未完成。 [本批规格](build/analysis/battle-utility-consumers-v1/specification.json) · [核验](build/analysis/battle-utility-consumers-v1/validation.json)

**当前战斗差异已归并**：复用51份既有战斗规格（原46另补5份命名前缀漏项），并登记49份后续来源检查的选定metadata。24token及当前显式解析110类逐项对照：108类有专用路由，12/267仅回退拒绝；旧4260B0生产规则直接复用，无新REA函数查询/反编译。98十五变体、upper108及后续RID限定扩展不再按旧“待实现”摘要重做。下一步仅审12/267必要身体/效果和具名条件/恢复边，再归统一门槛；这些数量不是完成率。产品stage306，统一规格及三端/同版接受仍未完成。 [本批对照](build/analysis/battle-variant-coverage-v1/crosswalk.json) · [核验](build/analysis/battle-variant-coverage-v1/validation.json)

**当前共享选择规则**：已补交易选择/释放/重排、共享占用和数量提交端点的所选来源；复用25份旧完整视图，仅补2规范体和10独立派生导出。纠正了旧撤回前沿：4CCC20是已有另一套窗口内部的发布片段。当前核心的revision、连续位置编号及发布计时与源规则分开；下一步核完整战斗变体和数量框活动的具体owner组合。产品stage306、统一必要规格及完整目标仍未完成。[规格](build/analysis/inventory-selection-ownership-v1/specification.json) · [核验](build/analysis/inventory-selection-ownership-v1/validation.json)

**前组全能力对账**：40域已逐项区分既有规则、具体来源/范围复核、条件激活、实现差异与外部接受；21个共享层的82条历史未决原文保留，246处规格引用集中复用。当前24个战斗token均有可定位的源码分派，不能据旧“剩余15处理器”或profile标记推定全无实现；变体/身体/错误域仍需核。下一步按完整战斗命令覆盖和资料变化到选择/报价失效成组推进，已证XML/音频/粒子不再重复取证。产品stage306、统一必要规格及完整目标仍未完成。[对账](build/analysis/capability-source-reconciliation-v1/reconciliation.json) · [命令对照](build/analysis/capability-source-reconciliation-v1/battle-command-crosswalk.json) · [核验](build/analysis/capability-source-reconciliation-v1/validation.json)

**2026-11-09 流程复核**：先覆盖所有需求能力，再按共用状态和完整用户流程集中 REA 补证；统一规格通过后，复用 stage306，按 D0–D6 补差异。新查询先查同样本/分析配置的旧来源绑定，避免重复反编译；按能力组收尾和验证。当前40域仍是初表，规格门槛未通过。预期减少重复取证、跨端重复实现和返工，尚无整体节时比例。[执行约束与停止条件](reports/development-plan.md#capability-first-execution)

**前组所选天气规则**：所选天气池、配置、普通/风粒子生成与退役已补源规则；29体复用24规范、只补5规范，无新派生体。旧嵌套快照恢复已有配置入口，四组重复观察去重保留。当前产品雨滴切面可复用，列3组具体差异；该组的40域对账后续已由上方当前结果承接；来源规则和产品差异继续复用。产品仍stage306。[合同](analysis/capability-first-v1/game-entry-review-contract.json) · [核验](build/analysis/particle-lifecycle-contract-v1/validation.json)

**当前输入与宠物加点来源**：实际回调已连到经典窗口42的人工数字输入，以及两套宠物界面的五项加点请求。共同字段复用，界面资格分开；补出的903条宠物指令/3,211字节和数字回调91字节均核原件。输入掩码、提交后隐藏、动画失败回退及共享标识覆盖另列；数字编辑器、取消/重入和完整业务仍待证。本轮未改产品代码，运行基线保持stage306。[当前合同](analysis/capability-first-v1/game-ui-producers-contract.json) · [核验](analysis/capability-first-v1/game-ui-producers-validation.json)

**当前生产者归并**：此前21个发送入口已有逐项来源上下文，归入角色资料/入场、宠物、队伍、称号、阵形、菜单和连接所有者。5个空调用者列表补得8个实际调用点，6处复用旧派生体，另两处有具体待追入口。9个旧派生体/13,799字节核原件，仅9个缺失规范体新取；1,676条旧证据全部保持。全部业务条件仍未闭合，未新增运行功能，基线保持stage306。[当前合同](analysis/capability-first-v1/game-producer-context-contract.json) · [核验](analysis/capability-first-v1/game-producer-context-validation.json)

**当前游戏图形生命周期**：缓存图形的构造、动画到输入门槛、单个/批量待删、更新循环摘链及附加区→主体回收已归入[来源合同](analysis/capability-first-v1/game-graphics-lifetime-contract.json)。8个已有规范体/1,899字节及720字节旧派生回调均核原件；同版快照复用9个证据分页，无新反编译。97个业务表回调的实际分派继续待证；21发送入口后续来源上下文见当前生产者合同。运行基线保持stage306。[本组核验](analysis/capability-first-v1/game-graphics-lifetime-validation.json)

**当前游戏入口归并**：固定旧版37c4中，旧索引未贴能力标签的72根已逐项复核：39发送包装、29接收处理、两个常量回调、战斗窗口帧和主分派。全部复用规范REA体，72范围/12,617字节及68协议标记匹配原件；18个发送入口已有业务上下文，21个保留具体待查调用链。统一发送机制和已有规格可复用，不把72根当成72项新功能。完整业务/发现门槛仍未通过，运行基线保持stage306。[当前归属与缺口](analysis/capability-first-v1/game-entry-review-contract.json) · [核验](analysis/capability-first-v1/game-entry-review-validation.json)

**当前弹窗/恢复规格**：预设、备注和手动目录的共用模态所有者、返回/取消、消息循环与普通错误提示已补源；XML七类虚析构、子节点/属性释放、加载与直接Parse的恢复边界已绑定。57体/58范围22,705字节及12处表数据核原件；27新规范，其余复用。取消不统一回滚，弹窗也不冻结所有后台状态。完整发现/其他业务及真实平台仍待完成，运行基线保持stage306。[合同](analysis/capability-first-v1/launcher-modal-recovery-contract.json) · [本组核验](analysis/capability-first-v1/launcher-modal-recovery-validation.json)

**当前连接规格**：同C82的连接指针/序号、注册表查找、回调引用、独立主窗口pump、Stop关闭意图及正常析构等待已集中成规。43体/43范围16,770字节核原件；23新规范、4旧规范、16旧伪代码组合分开，其中1份新规范重复了已留存伪代码，单列而不算新增语义覆盖。已取得回调在modal/并发关闭重开时的完整顺序仍待证，未新增产品功能。[连接合同](analysis/capability-first-v1/launcher-channel-contract.json) · [本组核验](analysis/capability-first-v1/launcher-channel-validation.json)

**前组补证**：同C82的App自定义初值、普通登录候选、DNS任务引用、定时器、取消/关闭及回复忙碌门槛已形成[生命周期合同](analysis/capability-first-v1/launcher-lifecycle-contract.json)。27体/32范围11,768字节及三个CRT指针绑定的独立初始化视图108字节均核原件；12体新取，其余复用。候选计数不是请求代次，DNS取消也不等于终止后台解析。连接内部排空/旧回复重入、全部modal及游戏共同状态仍待补证；统一分析门槛未通过，运行基线仍为stage306。[本组核验](analysis/capability-first-v1/launcher-lifecycle-validation.json)

按 2026-11-08 用户要求，先统一盘点登录器与完整游戏能力，集中 REA 补齐协议、状态、资源、窗口/时序和生命周期规格；规格与依赖关闭后，再按共享模块分批实现和验收。既有代码和来源证据继续复用。

已整理 **40 个能力域初表（原38域保留，补入G19图鉴与G20邮件）**，关联现有 **81 项来源/协议/接受登记、37 条历史复合范围记录、10 个消费者组**。这些数量代表本轮归并范围；全部需求的发现和 REA 分析仍未完成，不表示全项目覆盖率。当前没有新增运行功能，上一实现基线为 stage306；普通工作另一套窗口的研究已保留并进入统一补证队列。

已核对固定样本的窗口/控件、主状态和文本协议入口，并登记分析登录器的 14 个对话框、84 个控件及 6 个菜单命令。2,768 处引用去重为 647 个限定来源函数入口，均已关联证据；480 个缺口入口在独立分析副本中批量恢复并匹配原字节。[入口清单](analysis/capability-first-v1/entry-inventory.json) · [入口核验](analysis/capability-first-v1/entry-source-check.json)

现已复用旧证据定位全部 647 个限定入口的已登记地址集/视图（范围完整不代表业务路径完整，表68遗漏另有补证），并整理静态调用/收发路径；这没有新增根入口反编译，也不表示业务条件闭合。[业务入口索引](analysis/capability-first-v1/business-entry-map.json)

传统与另一套窗口的共用规则分别成规格，输入编码、关闭及焦点条件保持区别；lookup直接调用和toggle/恢复路径另补源证，实际callback分发仍未关闭。登录器已把主对话框绑定到资源133，11个模板ID有构造路径，3个资源用途及完整业务条件仍待证。全部分析门槛未通过。[两套窗口规则](analysis/capability-first-v1/alternate-window-contract.json) · [游戏分发补证](analysis/capability-first-v1/game-dispatch-findings.json) · [登录器类/资源绑定](analysis/capability-first-v1/launcher-dialog-bindings.json) · [本组核验](analysis/capability-first-v1/dispatch-bindings-validation.json)

固定c82f的预设、普通密码登录、回复后ID选择、目录/筛选和准备恢复已归入统一规格。前组进一步补证备注、置顶、排序、重置与单次排序撤销；备注上限32字节，排序快照不包含备注/置顶标志，+0x1998纠正为撤销可用标记。运行时备注窗口另有四控件。完整XML语法、所有owner关闭/重入及游戏/实际平台接受仍待证，未增加产品功能。[预设/登录规格](analysis/capability-first-v1/launcher-apply-contract.json) · [目录/状态规格](analysis/capability-first-v1/launcher-catalog-state-contract.json) · [本地ID元数据规格](analysis/capability-first-v1/launcher-id-metadata-contract.json) · [本组核验](analysis/capability-first-v1/launcher-id-metadata-validation.json)

同c82f的XML字段/默认值/上限、安装发现与手动路径提交、App启动及选定关闭链现已集中成规。70体含50新规范、14旧规范、6旧伪代码组合，71范围34,417字节核原件；两个独立派生回调另计。手动路径先改临时缓冲，持久化成功后才发布游戏路径；发现安装与手动提交的条件分开。完整XML语法、全部异步重入、剩余菜单/资源及游戏/平台仍待补证。[目录/安装/宿主规格](analysis/capability-first-v1/launcher-catalog-install-contract.json) · [本组核验](analysis/capability-first-v1/launcher-catalog-install-validation.json)

本组进一步明确目录路径的点段/盘符/UNC条件，以及菜单128的创建/失败清理和Frame→CChildView/活动view/App命令路由。目录任务、进程句柄及登录忙碌是不同条件，不能合并。26体/27范围14,658字节核原件；13新规范，其他复用。4个菜单命令在已知对象继承链中无处理者，动态目标/实际可用性仍待证，不据资源新增游戏功能。[路径/宿主路由规格](analysis/capability-first-v1/launcher-host-routing-contract.json) · [本组核验](analysis/capability-first-v1/launcher-host-routing-validation.json)

同C82的XML文件/文档/节点/属性/文本/实体常规规则现已集中成规：它按字节处理，CDATA归Unknown、字段只取首个text子节点，legacy数字实体截低字节。现有Unicode字符串解析器不能直接作为同版实现。34体/35范围14,930字节及独立LLVM补核的70字节分支匹配原件；28个原创输入的现有解析器行为对照，与静态规则推导在24个选定属性上不同，未执行原程序。[XML规格与实现缺口](analysis/capability-first-v1/launcher-xml-contract.json) · [本组核验](analysis/capability-first-v1/launcher-xml-validation.json)

[能力与缺口清单](reports/requirements-index.md#capability-first-inventory) · [分析门槛、开发批次和验证安排](reports/development-plan.md#capability-first-workflow) · [共享架构](reports/architecture-and-milestones.md#capability-first-architecture) · [本轮核验](reports/validation.md#capability-first-validation)

下方各 stage 为历史阶段记录；当前下一步以以上入口为准。完整目标保持进行中，真实微信/手机及现行官方接受仍待验证。

<a id="stage306-work-context"></a>

## stage306 技能上下文与直接技能已接通

已按 REA 来源实现精灵变身上下文的切换、配方重查和归属校验、技能槽偏移、耗时倍率与修理／鉴定等级条件。type5 使用服务端提供的技能名称和可用等级，选择后只发送请求；角色状态与魔力继续由收到的数据同步。[来源](analysis/game-work-context-v1/source-check.json) · [规格](analysis/game-work-context-v1/specification.json)

新增 8 项源码与 102 项生成 API 检查通过；完整 3,779 项／271 文件，1,799 个冻结输入不变。实际 1,072 文件 ZIP 在桌面、触屏网页及源码／生成 Page 各完成新流程，每条核对 34 请求；制造、物品工作和目标／采集在同四种界面均保留复测，共 16 条本地产品流程。[验收](reports/validation.md#stage306-work-context)

当前覆盖固定旧版上下文 0／1 的已证切面和已证倍率表索引 1..6。原生全部窗口／动画／全局交错、剩余普通与战斗分支、真实微信／手机及现行／官方接受仍待完成。原始 37 项要求／10 个未完成组保持 active/incomplete。下方较早阶段的未实现清单是当时快照。

<a id="stage305-work-targets"></a>

## stage305 目标技能与连续采集已接通

已按 REA 证据接通普通上下文 0 的变装、变身、急救、治疗，以及已知挖掘／打猎／伐木分支。包括角色→角色或宠物的两级目标、原始目标序号、即时提交、模式各异的结果，以及连续采集、暂停／继续和条件复核。[来源](analysis/game-work-targets-v1/source-check.json) · [规格](analysis/game-work-targets-v1/implementation-spec.json)

新增源码 10 项、生成 API 94 项、完整 3,771 项／270 文件检查通过。实际 1,072 文件 ZIP 在桌面网页、触屏网页、源码 Page 和生成 Page 各完成新流程，原创本地服务每条核对 37 请求；制造与物品工作在同四种界面分别保留复测 13 和 26 请求，共 12 条本地产品流程。[验收](reports/validation.md#stage305-work-targets)

非零上下文、其他技能分支、完整原生动画／窗口／全局别名，以及真实微信／手机／现行／官方接受仍待完成。37 项原始要求／10 个未完成组保持 active/incomplete，不将本地切面等同于完整游戏。

<a id="stage304-work-actions"></a>

## stage304 修理、鉴定、刻印与装饰已接通

已继续按 REA 证据实现普通上下文 0 的武器／防具修理、鉴定、刻印／清除刻印和装饰。选择条件、魔力检查、计时或立即提交、服务器结果、重试与取消由网页和微信 Page 共用同一核心。[来源](analysis/game-work-actions-v1/source-check.json) · [规格](analysis/game-work-actions-v1/implementation-spec.json)

新增源码 8 项、生成 API 84 项和完整 3,761 项／269 文件检查通过。实际 1,072 文件资源 ZIP 在桌面网页、触屏网页、源码 Page 和生成 Page 各完成一条新流程，每条由原创本地服务核对 26 请求；原制造流程在同四种界面各复测 13 请求。[验收](reports/validation.md#stage304-work-actions)

尚未完成其余治疗／急救／变身／变装、采集／发现消费者、非零上下文、完整原生动画与共享别名，以及真实微信／手机／现行／官方接受。装饰不代表完整合成系统；37 项原始要求／10 个未完成组继续 active/incomplete。

<a id="stage303-craft-input"></a>

## stage303 普通制造流程已接通

已按 REA 实现普通上下文 0 的制造：选择技能／等级／配方、六个材料位、魔力检查、计时提交、成功／失败结果、再次制造与取消，网页和微信 Page 共用同一核心。[来源](analysis/game-craft-input-v1/source-check.json) · [规格](analysis/game-craft-input-v1/implementation-spec.json)

源码新增 9 项、生成 API 新增 8 项和既有 63 项检查通过；完整回归 3,753 项／268 文件通过。实际 1,072 文件资源 ZIP 在桌面网页、触屏网页、源码 Page 和生成 Page 分别走通制造流程，每条流程由原创本地服务核对 13 条请求。[验收](reports/validation.md#stage303-craft-input)

修复人物进入回复与技能资料合并到达时的自动查询时序，以及 Page 制造计时刷新。修理、合成、非零上下文、完整原生动画及真实微信／手机／现行与官方接受仍待实现和验收；37 项原始要求／10 个未完成组继续 active/incomplete。

<a id="stage302-craft-recipes"></a>

## stage302 工艺配方接收已接通

已按 REA 接通普通上下文 0 的工艺配方：技能自动查询的 @_i 回复现在进入对应技能所有者，保留 56 个配方及每个配方的 5 项材料。重复回复、超长文本保留、缺失字段和删除技能时的部分重置均按来源处理；world／client 提供复制后的只读访问。[来源](analysis/game-craft-recipes-v1/source-check.json) · [接口](reports/module-interfaces.md#stage302-craft-recipes)

新增 5 项源码／生成 API 检查通过，完整回归 3,744 项／266 文件通过；独立模型有 16 份完整期望状态，覆盖 896 配方行／4,480 材料。生成 API 的既有 63 项检查另行通过，API／Page 已重建。[验收](reports/validation.md#stage302-craft-recipes)

制造选择、材料分配、提交、结果界面及非零普通上下文继续实现；本轮没有新增页面功能或真实设备接受结论。37 项原始要求／10 个未完成组保持 active/incomplete。

<a id="stage301-battle-item-dispatch"></a>

## stage301 ITM 分派复核完成

REA 已确认固定 37c4 样本只有 ITM 0、6、7 三条效果路径。其他编号本次回调只读编号并返回，不调用分组完成函数；不能把 1–5 当作缺少的治疗或捕获效果实现。本轮为分析与既有消费者回归，运行代码保持 stage300。[来源](analysis/game-battle-item-variants-v1/source-check.json) · [规格](analysis/game-battle-item-variants-v1/implementation-spec.json)

源码和既有生成 API 的 63 项道具相关检查分别通过；重核 2,251 字节窗口和保留的 54,685 字节派生指令。完整回归仍是 stage300 的 3,739 项，本轮复核其 1,720 个输入未变。继续工艺配方、普通上下文及其余游戏消费者；37 项需求／10 个未完成组保持 active/incomplete。[验收](reports/validation.md#stage301-battle-item-dispatch)

<a id="stage300-city-water"></a>

## stage300 回城过渡与等待回复的水面已接通

已按REA修正普通回城与战斗中回城的水面顺序：等待服务器回复时继续绘制地图；切换场景、捕获地图和缓存淡入按来源分别推进相位与保存位置。场景返回没有角色资料时继续等待，不由动画提前重建角色。17函数／15,221字节及既有253字节菜单范围已核对。[规格](analysis/game-city-water-v1/implementation-spec.json) · [验收](reports/validation.md#stage300-city-water)

源码／生成API新增8项检查通过，独立12条轨迹／1,800状态及98完整画面一致；完整3,739项／265文件回归通过。五种回城路径分别覆盖桌面、触屏模拟、源码Page和生成Page，共20条实际材料流程，均保持同一连接并恢复移动。API192／Page250输入，13份文档同步。

原生完整对象／移动／RNG调度、其他初始／错误／停止分支、现行交接与实际微信／手机仍待验；完整37项需求／10个未完成组保持active/incomplete。

<a id="stage299-battle-water"></a>

## stage299 战斗与回场水面时序已接通

已按REA闭合正常战斗的水面生命周期：进入战斗清除普通本地对象并置门槛，特殊图形仍按普通纹理绘制；退出后清门槛，地图捕获、相位更新和位置保存按来源顺序执行。24函数／14,881字节与原件一致。新增10项源码／生成检查、完整3,731项／264文件回归通过。[规格](analysis/game-battle-water-v1/implementation-spec.json) · [验收](reports/validation.md#stage299-battle-water)

独立参考核对1,060张完整帧、1,200次顺序状态；实际10份特殊资源的30张捕获／缓存帧在源码和生成API一致。两个原创水面地图以实际特殊背景5000完成桌面、触屏模拟、源码Page、生成Page共8条战斗退出及移动流程。API192／Page250输入，13份文档同步。

其他main9／城市／错误／停止前缀、原驱动与缓存、完整玩法及实际微信／手机继续验证；37项原始需求／10个未完成组保持active/incomplete，native历史代码保留。

<a id="stage298-ordinary-water"></a>

## stage298 普通地图水面进入共享核心

已按REA完成普通地图的水面条带消费者：触发使用图形索引3096..3105，水面先绘、条带重绘、陆地与角色后绘；玩家实际位置与相机分开，追赶更新和呈现振幅分开，跨地图重配保留所有者。22函数／15,352字节及268字节表与原件相符。新增8项源码／生成检查通过，完整3,721项／263文件回归通过。

独立Python验证3,304份完整帧和650次状态；实际12资源的64份画面在源码／生成包各验证一次。两个原创水面地图在桌面、触屏模拟、源码Page和生成Page共8条路径完成入场、战斗、退出及移动。API191／Page249输入，13份文档同步。[验收](reports/validation.md#stage298-ordinary-water) · [规格](analysis/game-special-graphics-v1/implementation-spec.json)

原生缓存／驱动、非640×480视口策略、战斗特殊队列与离开阶段时序、实际微信／手机及现行交接仍待验证；完整37项需求／10个未完成组保持active/incomplete，native历史代码保留。

<a id="stage297-body-draw-flags"></a>

## stage297 身体绘图标志覆盖开关

共享身体回调已接通动作164／165：分别把绘图覆盖掩码设为255／0，保留原动画、覆盖值及独立颜色覆盖，再推进一次队列。32组真实所有者回调、128次动作和160份原创完整帧在源码／生成API一致。[来源](analysis/game-battle-gmn-flags-v1/source-check.json) · [接口](reports/module-interfaces.md#stage297-body-draw-flags)

这两个数字是身体动作编号；正常协议生产者仍未确认，没有新增GMN协议指令。3,713项／262文件回归和8条实际材料产品回归通过，13份文档同步。完整游戏继续按37项需求／10个未完成组推进。[验收](reports/validation.md#stage297-body-draw-flags) · [范围](analysis/game-battle-gmn-flags-v1/goal-audit.json)

<a id="stage296-actual-battle-product"></a>

## stage296 实际素材进入完整战斗流程

现有网页与Page实现已用未修改的实际素材完成入场、战斗、结算、退出和继续移动。CUT59510／59526各覆盖桌面、触屏模拟、源码Page和生成Page，共8条流程；角色100010的160个动作、24个原始信号帧与640×480实际背景均保留原字节。[规格](analysis/game-actual-battle-product-v1/implementation-spec.json) · [验收](reports/validation.md#stage296-actual-battle-product)

本阶段新增实际材料验收工具和证据，运行时代码保持stage295状态；API／Page重新构建并核对身份，13份文档同步。原创对端提供地图布局和战斗配置，真实微信、手机、现行交接及完整游戏继续按37项需求／10个未完成组推进。[完整范围](analysis/game-actual-battle-product-v1/goal-audit.json)

<a id="stage295-battle-draw-style"></a>

## stage295 战斗颜色与对象透明度绑定

战斗绘制已分别处理动画加色与对象颜色覆盖，接通任意ARGB、命名调色板、角色半透明标记及原动画样式。GMN、变形、元素与静态场景效果的透明度开关按原字段生命周期处理，复制对象保留原开关，绘制不推进回调。[来源](analysis/game-battle-draw-style-v1/source-check.json) · [接口](reports/module-interfaces.md#stage295-battle-draw-style)

源码／生成包的2,176份原创完整帧及672份实际材料战斗上下文一致；八条本机产品流程和261文件／3,710项回归通过，13份文档同步。完整特殊图形／调度／UI、现行交接及实际微信／手机仍在37项需求／10组范围中。[验收](reports/validation.md#stage295-battle-draw-style) · [完整目标](analysis/game-battle-draw-style-v1/goal-audit.json)

<a id="stage294-vertex-color"></a>

## stage294 顶点颜色、透明度与部分调色板

共享普通绘制已支持动画头的ARGB颜色与透明度，覆盖地图物件、角色动画、范围资源库和文字前后层；每次绘制独立调制颜色，同图像缓存继续复用。实际材料中25个动作／112帧及645字节的部分命名调色板已通过独立完整像素比较。[来源](analysis/game-vertex-color-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage294-vertex-color)

260文件／3,704项回归、源码／生成API的70,682份原创整帧参考及七项新测试通过；普通透明与带透明度加色两种材料场景共8条本机产品流程通过。完整战斗样式绑定、其他玩法／调度、现行交接及实际微信／手机验收继续推进，37项原始需求／10个未完成组保留。[验收](reports/validation.md#stage294-vertex-color) · [完整目标](analysis/game-vertex-color-v1/goal-audit.json)

<a id="stage293-additive-render"></a>

## stage293 加色效果接入共享渲染

已按REA证据实现标志8的D3D加色规则，并接入地图动画、延迟动画描述和已有范围资源库。普通裁切／翻转／缩放、命名调色板及文字前后层顺序均保留；真实CUT59663的动画113685／调色板947已通过网页和源码／生成Page流程。[规格](reports/logic-protocol-spec.md#stage293-additive-render) · [来源](analysis/game-additive-render-v1/source-check.json)

259个测试文件／3,697项回归通过，488份独立完整像素与12帧实际地面叠加结果在源码／生成API一致。4种入口均完成移动和场景重建；13份文档已同步。任意顶点颜色、完整资源版本、其他玩法／调度和真实平台仍未完成。[验收](reports/validation.md#stage293-additive-render) · [完整目标](analysis/game-additive-render-v1/goal-audit.json)

<a id="stage292-animation-named-palette"></a>

## stage292 非零调色板动画已接通一条实际路径

已按REA证据补上延迟地图动画的命名调色板读取：编号映射到图形资源，使用该资源内嵌的BGR颜色，而非直接套用默认CGP。stage291失败的59529物件1116／动画113058／编号320，现已通过网页与源码／生成Page流程。[来源](analysis/game-animation-palette-source-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage292-animation-named-palette)

258个测试文件／3,691项回归通过；全部65,536种16位编号、9份原创完整像素及实际动画54帧，在源码与生成API一致。4条平台变体产品流程和2条显露动画的视觉复查均通过。加色标志8、其他未绑定动画上下文、整套资源版本与真实平台仍未完成。[验证](reports/validation.md#stage292-animation-named-palette) · [完整目标](analysis/game-animation-palette-source-v1/goal-audit.json)

<a id="stage291-legacy-minimap"></a>

## stage291 小地图接入网页与小程序页面

已通过REA核对固定历史样本的小地图颜色、AUT读取和32位菱形绘制，在共享核心实现三档范围、位置标记及显隐，并接入网页和小程序Page。实际材料原本已有341个CUT、337个AUT；stage290缺失的23.cut只是原创测试选择器，不能推成整套CUT缺失。本轮使用真实59529配对材料完成模式1静态场景及小地图验证。[规格](reports/logic-protocol-spec.md#stage291-legacy-minimap) · [源码证据](analysis/game-legacy-minimap-v1/source-check.json)

257个测试文件／3,683项测试、8条实际材料本机产品流程通过。源码／生成API的49份独立结果、27个实际颜色和3幅完整RGB小地图一致。另保留动画113058因非零调色板编号320而失败的负例，完整模式1动画与资源版本适配仍未完成。[验证](reports/validation.md#stage291-legacy-minimap) · [完整目标](analysis/game-legacy-minimap-v1/goal-audit.json)

<a id="stage290-legacy-material-compat"></a>

## stage290 真实素材已通过进入、移动和场景重建

已用现有ZIP入口加载实际图形、动画和调色板，在桌面／触屏模拟网页，以及源码／生成小程序Page适配中完成选择人物、进入、移动及场景重建。人物、地面和物件由所选真实材料呈现，场景消息来自本机原创对端。[结果与截图位置](reports/validation.md#stage290-legacy-material-compat)

641,666条图形记录的850,000个索引位、144份图像像素、36个动画定义和260个WAV的14,451,010个PCM样本通过独立比较。产品代码及既有构建输入不变，复用已通过的3,657项回归；本轮新增4条实际素材正向流程与1条缺文件负向流程。材料缺少CUT23，完整版本匹配、真实微信／手机及完整游戏仍待验收。[完整目标](analysis/game-legacy-material-compat-v1/goal-audit.json)

<a id="stage289-legacy-resource-archive"></a>

## stage289 大型游戏资源ZIP按需读取

网页新增游戏资源ZIP选择，与原文件夹入口共用资源消费者；小程序适配改用所选文件的分段读取。独立ZIP／ZIP64核心支持存储和Deflate条目，避免将整个资源包或大型图形库装入内存。已提供 `tools/pack-game-resources.py`，可将本机游戏根目录打成便于随机访问的存储型ZIP。[使用方法](web/README.md#stage289-legacy-resource-archive) · [接口](reports/module-interfaces.md#stage289-legacy-resource-archive)

实际材料1,072文件、2,549,015,355字节全部通过独立SHA-256／CRC检查；源码与生成API比对3,216段资源并一致生成v2启动字段。254个测试文件／3,657项测试、14条本机TCP产品流程通过。实际微信、物理手机、整套资源版本兼容和完整游戏仍待验收。[验证](reports/validation.md#stage289-legacy-resource-archive) · [完整目标](analysis/game-legacy-resource-archive-v1/goal-audit.json)

<a id="stage288-legacy-battle-audio"></a>

## stage288 战斗音效已接入网页与小程序适配

已用REA核对固定历史样本的270条音效映射、声像和重复抑制，将既有命中、动画及菜单声音事件接入两端共用的音频层。声音从本次选择的WAV资源读取；静音、缺文件和输出不可用不改变战斗结算。[来源](analysis/game-legacy-battle-audio-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage288-legacy-battle-audio)

252个测试文件、3,616项测试、40组独立完整音效状态和8条本机TCP产品流程通过。桌面／触屏模拟网页使用实际Chromium AudioContext；源码／生成小程序Page使用Node下的wx形状端口。完整游戏、原生音频调度和真实平台仍未验收。[验证](reports/validation.md#stage288-legacy-battle-audio) · [下一步](reports/development-plan.md#stage288-legacy-battle-audio)

# moli-mac

<a id="stage287-legacy-battle-detached-rid"></a>

## stage287 带2000标志的106 RID已接通

已按REA证据接入106分身RID的一条明确路径：元数据交给登记的施法者，分身随后读取原零元组，向登记槽0显示提示，并保留资源0与实际动作尾的处理。非2000的106 RID、低等级116 RID及401自身效果继续保留明确缺口。[来源](analysis/game-legacy-battle-detached-rid-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage287-legacy-battle-detached-rid)

250文件、3,602项测试、720组独立队列、15,288个状态、1,030帧完整RGBA、29种源码／生成管理器和8条本机TCP产品流程通过。本轮29种轨迹中1种自然完成、28种经原等待恢复到回合1；完整游戏、现行交接与真实平台继续推进。[验收](reports/validation.md#stage287-legacy-battle-detached-rid) · [下一步](reports/development-plan.md#stage287-legacy-battle-detached-rid)

<a id="stage286-legacy-battle-impact-skills"></a>

## stage286 五类冲击技能与烟雾坐标修正

已按REA证据接入SKL4／97／106／111／116的限定共享消费者：独立箭矢、范围火花、分身命中及抛物投射。修正109烟雾起点为动画 `drawOffsetY/2`；分身和火花的生命周期按各自工厂处理。[来源](analysis/game-legacy-battle-impact-skills-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage286-legacy-battle-impact-skills)

249文件、3,566项测试、4,800组独立队列、14,251个状态、1,206帧完整RGBA、64种源码／生成管理器和20条本机TCP入口通过。61种自然完成，3种自身路径在第7,207次管理器回调恢复。分身RID、隐藏偏转等缺口仍单列；完整玩法、现行交接及真实平台继续推进。[验收](reports/validation.md#stage286-legacy-battle-impact-skills) · [下一步](reports/development-plan.md#stage286-legacy-battle-impact-skills)

<a id="stage285-legacy-battle-upper-skills"></a>

## stage285 六类上位技能消费者与显示边界

已依据REA接入SKL107／108／109／112／114／117的字段、队列及回调，包含目标环绕、数值恢复、独立分身、击退烟雾和强化图标。SKL108保留“数值在标志前”的顺序；SKL117自身与重复目标沿原等待恢复收尾。SKL107提供已有C值的结构化观察，原版成功提示的装箱整数格式仍单独待验收。[来源](analysis/game-legacy-battle-upper-skills-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage285-legacy-battle-upper-skills)

248文件、3,496项测试、4,320组独立队列、4,825个状态、474帧完整RGBA、26种源码／生成回调和24条本机TCP入口通过。完整玩法、剩余消费者、现行交接及真实平台继续推进。[验收](reports/validation.md#stage285-legacy-battle-upper-skills) · [下一步](reports/development-plan.md#stage285-legacy-battle-upper-skills)

<a id="stage284-legacy-battle-skill99"></a>

## stage284 六类状态技能与持续图标

已依据REA接入SKL99–104的原队列、蓄唱、状态效果、持续图标及声音事件。C消息沿原位清除顺序保留既有图标；三字段元组保留旧第四格。共享蓄唱动画由两次改为原版的三次推进，畸形变体清理也能保留原解析错误。[来源](analysis/game-legacy-battle-skill99-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage284-legacy-battle-skill99)

247文件、3,464项测试、2,520组独立队列、5,156个状态、352帧完整RGBA、15种源码／生成回调与12条新本机TCP流程通过。完整玩法、现行交接与实际平台仍继续验收。[验收](reports/validation.md#stage284-legacy-battle-skill99) · [下一步](reports/development-plan.md#stage284-legacy-battle-skill99)

<a id="stage283-legacy-battle-self-flags"></a>

## stage283 自身结果完整标志字与反应

普通20类自身记录保留完整32位结果字，已核对的消费者处理受击、旋转和元数据；八个在本次范围内没有消费者的位保留原值。同步修正259类等级9瓦片元组错误清零第四格的问题。[来源](analysis/game-legacy-battle-self-flags-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage283-legacy-battle-self-flags)

246文件、3,442项测试、2,800组独立队列、2,400个状态、120帧完整RGBA、38种源码／生成回调和12条新本地TCP流程通过。网页与Page入口验证包括正常命中、局部反应和不透明位组合；完整玩法、现行交接和实际平台继续验收。[验收](reports/validation.md#stage283-legacy-battle-self-flags) · [下一步](reports/development-plan.md#stage283-legacy-battle-self-flags)

<a id="stage282-legacy-battle-self-guard"></a>

## stage282 普通自身护卫与角色重合

共享规划器接入普通20类自身护卫 `0x200`。施法者、被保护者和护卫共用身体时，沿用原版追加顺序、元组存储、等待恢复及费用；未发生的命中不会写成伤害。[来源](analysis/game-legacy-battle-self-guard-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage282-legacy-battle-self-guard)

245文件、3,401项测试、14,000组独立队列、128组释放分支组合、49种源码／生成回调及12条新本地TCP流程通过。独立原版方程还核对1,280个回调状态和32帧完整RGBA；这属于有限前缀证据。完整玩法和真实平台继续验收。[验收](reports/validation.md#stage282-legacy-battle-self-guard) · [下一步](reports/development-plan.md#stage282-legacy-battle-self-guard)

<a id="stage281-legacy-battle-self-metadata"></a>

## stage281 自身资源切换、提示与状态元数据

共享规划器补齐普通20类自身记录的命中特效覆盖、条件状态、状态清除、零值提示，以及五种消息／资源元数据标志。沿用既有消费者处理资源更换、骑乘／附属图像、提示顺序和元组推进；不补造动画命中。[来源](analysis/game-legacy-battle-self-metadata-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage281-legacy-battle-self-metadata)

244文件、3,349项测试、67种源码／生成回放、12条新本地TCP流程及两套构建通过。实际回放包括资源更换后有／无攻击信号、连续RID、别名、状态清除条件和组合消息。完整玩法与真实平台继续验收。[验收](reports/validation.md#stage281-legacy-battle-self-metadata) · [下一步](reports/development-plan.md#stage281-legacy-battle-self-metadata)

<a id="stage280-legacy-battle-reentry"></a>

## stage280 实际产品连续两场战斗验收

已补齐退出后第二场的产品验证：自身蓄力等待恢复、蓄力反射、散开自动停止三种首场，分别经桌面网页、移动网页、Page 源码及生成版，共12条本地 TCP 流程、24场战斗。每条复用原连接，核对新角色与 HP／MP、回合重置、技能结算、两次退出和回场移动。[来源](analysis/game-legacy-battle-reentry-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage280-legacy-battle-reentry)

全量243文件、3,280项测试、1,541个冻结输入及两套构建通过。产品运行代码未改；修正测试未等待首场移动到达、却沿用旧起点的期望值。完整玩法与实际平台仍待验收。[验收](reports/validation.md#stage280-legacy-battle-reentry) · [下一步](reports/development-plan.md#stage280-legacy-battle-reentry)

<a id="stage279-legacy-battle-self-control"></a>

## stage279 自身蓄力、倒地、散开与下一场组件入场

共享规划器补齐普通 20 类自身记录的蓄力 `0x1010`、倒地 `0x20` 和散开 `0x40`。保留原队列的等待、角色移除及动作244自动退出；主控散开不会被改成普通回合完成。[来源](analysis/game-legacy-battle-self-control-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage279-legacy-battle-self-control)

243 个文件、3,280 项测试、161 种源码／生成回放、12 条新本地 TCP 流程及两套构建通过。161 种回放随后均复用同一组件所有者完成下一场入场与回合。完整玩法和真实平台继续验收。[验收](reports/validation.md#stage279-legacy-battle-self-control) · [开发顺序](reports/development-plan.md#stage279-legacy-battle-self-control)

<a id="stage278-legacy-battle-self-special"></a>

## stage278 自身反射、治疗与结果优先顺序

共享物理规划器补齐 20 类基础自身记录的 `0x2000／0x4000／0x8000` 结果及其组合。保留同一身体连续推进两次、元组前进和后续动作；自身反射可以自然结束，并继续执行后续命中或 81 类额外治疗。[来源](analysis/game-legacy-battle-self-special-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage278-legacy-battle-self-special)

242 个文件、3,117 项测试、161 种源码／生成回放、12 条新本地 TCP 流程及两套构建通过。回放中 28 种自然结束、133 种使用既有等待恢复；完整玩法与实际平台继续验收。[验收](reports/validation.md#stage278-legacy-battle-self-special) · [开发顺序](reports/development-plan.md#stage278-legacy-battle-self-special)

<a id="stage277-legacy-battle-self-family"></a>

## stage277 普通物理家族的自身记录与资源预检

共享核心新增 17 个类别的基础自身记录，连同既有 0／1／3 共覆盖 20 类。保留同一身体的原版类别清除、首条标志处理、费用及回调队列；修正技能 6 自身记录误要求 MP 数字的资源预检。[来源](analysis/game-legacy-battle-self-family-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage277-legacy-battle-self-family)

241 个文件、2,952 项测试、32 种源码／生成回放、12 条新本地 TCP 流程及两套构建通过。自身场景仍经既有等待恢复，完整玩法与实际平台继续验收。[验收](reports/validation.md#stage277-legacy-battle-self-family) · [开发顺序](reports/development-plan.md#stage277-legacy-battle-self-family)

<a id="stage276-legacy-battle-self-pair"></a>

## stage276 普通物理技能的自身结果

共享核心现在支持类别 0／1／3、结果位范围 `0x10b` 的自身成对记录，保留同一身体的动作及结果所有权，同时修正 Page 丢失真实回合计数的投影。REA 已核对目标查表、目标动作推进及源身体状态共用的原版路径。[来源](analysis/game-legacy-battle-self-pair-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage276-legacy-battle-self-pair)

全量 240 文件、2,916 项测试、8 条新本地 TCP 流程及两套构建通过。十种源码／生成回放一致；全部按既有等待恢复完成，新 Page 流程额外核对回合计数 1。其余自身类别、特殊结果、完整玩法及真实平台继续验收。[验收](reports/validation.md#stage276-legacy-battle-self-pair) · [开发顺序](reports/development-plan.md#stage276-legacy-battle-self-pair)

<a id="stage275-legacy-battle-weather-targets"></a>

## stage275 SKL401 重复效果目标

REA 已核对原版 SKL401 每次目标出现时的动作与效果元组追加。共享核心移除了重复效果目标的统一拒绝，保留顺序、同槽所有权、别名映射及容量检查。[来源](analysis/game-legacy-battle-weather-targets-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage275-legacy-battle-weather-targets)

全量 239 文件、2,904 项测试、8 条新本地 TCP 流程和两套构建通过。五种源码／生成回放一致，分别核对自然结束、既有等待恢复及回合后的效果清理；自身带效果的混合队列边界继续保留。[验收](reports/validation.md#stage275-legacy-battle-weather-targets) · [开发顺序](reports/development-plan.md#stage275-legacy-battle-weather-targets)

<a id="stage274-legacy-battle-pursuit-linked"></a>

## stage274 SKL400 联动结果与隐藏资源

REA 已核对 SKL400 结果位 `0x800000` 如何读取后续既有元组；共享核心据此补齐追踪效果的结果副本、施法者游标及目标重读。资源小于 1000 时保留原有隐藏标记，绘图层跳过编号 0，不创建替代资源。[来源](analysis/game-legacy-battle-pursuit-linked-v1/source-check.json) · [规格](reports/logic-protocol-spec.md#stage274-legacy-battle-pursuit-linked)

全量 238 文件、2,896 项测试和两套构建通过。四种源码／生成核心回放一致，网页双视口及 Page 源码／生成版的四条本地 TCP 入口均完成真实等待恢复、退出和移动；各有 4 个心跳、合计 13 个请求。完整玩法和实际平台验收继续推进。[验收](reports/validation.md#stage274-legacy-battle-pursuit-linked) · [开发顺序](reports/development-plan.md#stage274-legacy-battle-pursuit-linked)

<a id="stage273-legacy-battle-pursuit-targets"></a>

## stage273 SKL400 重复目标的追踪效果

共享核心现在保留 SKL400 中重复目标的每段动作和四元组，支持重复远端目标、交错目标及重复自身。REA 已核对原版生产器和追加函数，移除了此前对重复目标的统一拒绝。[源证据](analysis/game-legacy-battle-pursuit-targets-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage273-legacy-battle-pursuit-targets)

全量 237 文件、2,888 项测试、11 条本地 TCP 流程及两套构建通过。重复自身经既有等待恢复后完成；提示分支的效果可在回合完成后继续清理。关联结果位、完整玩法和实际平台继续验收。[验收](reports/validation.md#stage273-legacy-battle-pursuit-targets) · [开发顺序](reports/development-plan.md#stage273-legacy-battle-pursuit-targets)

<a id="stage272-legacy-battle-round-ack"></a>

## stage272 战斗确认消息与当前身体登记

修正 A 消息标记结果漏报 RID0 新登记身体的问题。接收器现在按当前身体登记判断槽位，覆盖尚无 C 元数据的 B。REA 已核对原版标记函数、回合号判断和输入初始化顺序。[源证据](analysis/game-legacy-battle-round-ack-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage272-legacy-battle-round-ack)

全量 236 文件、2,881 项测试通过，4 种源码／生成核心场景一致，7 条本地 TCP 流程及两套构建通过。完整玩法、原版动态、现行版、真机及微信运行时继续验收。[验收](reports/validation.md#stage272-legacy-battle-round-ack) · [开发顺序](reports/development-plan.md#stage272-legacy-battle-round-ack)

<a id="stage271-legacy-battle-character-queue"></a>

## stage271 战斗 C 消息的实际消费时机

REA 已核对四槽 C 队列、阶段 2 的消费门限和阶段 6 的回调路径。正常入口验证：投射物在途时收到角色更新或结束消息，会先完成当前回合，再于下一次阶段 2 调用消费；独立退出通知在下一次入口调用转入退出阶段。[源证据](analysis/game-legacy-battle-character-queue-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage271-legacy-battle-character-queue)

新增 4 种队列场景，相关 108 项测试、8 条本地 TCP 流程和两套构建通过。源码与生成核心结果一致，本轮核心运行代码未改。完整游戏、现行版、真机及微信运行时继续验收。[验收](reports/validation.md#stage271-legacy-battle-character-queue) · [开发顺序](reports/development-plan.md#stage271-legacy-battle-character-queue)

<a id="stage270-legacy-battle-exit-rid0"></a>

## stage270 致死反射的退出与再次入场

REA 已核实动作 244 的停止标志、主流程阶段 7 的登记清理及阶段 8 的对象池回收。共享生命周期验证覆盖致死反射留下的普通和隐藏 RID0 对象，退出后可重新进入战斗。B 占用施法槽的合成回放在第 448 个回调自然结束。[源证据](analysis/game-legacy-battle-exit-rid0-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage270-legacy-battle-exit-rid0)

本地 TCP 验收新增骑乘角色的两次待机、致死反射自动退战，以及 B 占用施法槽后的回合完成。原版动态、真实 C 到达时序、现行版、真机、微信运行时及官服继续验收。[验收](reports/validation.md#stage270-legacy-battle-exit-rid0) · [开发顺序](reports/development-plan.md#stage270-legacy-battle-exit-rid0)

<a id="stage269-legacy-battle-reflected-rid0"></a>

## stage269 反射回程卸载坐骑后的交接

REA 核对反射累计、动作 137、72、回程资源字段及动作 221 的骑乘指针。共享回放现在保留已准备的交接动画对象，卸载期间隐藏，并在队列和四元组相符时恢复，完成 RID0 指定的 A、B 注册。原主体离场时会释放保留对象及尚未登记的替换角色。[源证据](analysis/game-legacy-battle-reflected-rid0-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage269-legacy-battle-reflected-rid0)

该动画恢复属于独立实现。普通反射、多个反射者和内联资源通过本地回放对照，反射后的交接与战后移动通过本地 TCP 入口。原版动态、现行版、真机、微信运行时及官服继续验收。[验收](reports/validation.md#stage269-legacy-battle-reflected-rid0) · [开发顺序](reports/development-plan.md#stage269-legacy-battle-reflected-rid0)

<a id="stage268-legacy-battle-casting-rid0"></a>

## stage268 施法结束后的 RID0 交接

REA 核实旧版 SKL19 的两条施法结束路径。动画信号路径跨过施法终止元组，动画完成时仍无信号的路径停在终止标记。共享回放在动作 221 开始时，按当前动作和队列所有者校验已排入的 `[A,0,A,B]`，处理普通、空及内联目标列表的游标差异。[REA 证据](analysis/game-legacy-battle-casting-rid0-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage268-legacy-battle-casting-rid0)

四种本地测试入口通过有信号的远端施法交接与战后移动。无信号续接经源码与生成核心回放核验，属于共享恢复策略。原版动态、现行版、手机真机、微信运行时及官服待验收。[验收](reports/validation.md#stage268-legacy-battle-casting-rid0) · [开发顺序](reports/development-plan.md#stage268-legacy-battle-casting-rid0)

<a id="stage267-legacy-battle-rid0-flight"></a>

## stage267 RID0 的多帧同槽交接

动作 221 登记 B 后，骑乘对象继续由原父身体驱动，下降位置取自 B 槽当前登记的角色。A、B 同槽时，共享回放保留骑乘对象到落地。若 B 槽先清空，仍在原槽的父身体可以完成 A 的交接。同槽已清空时，回收剩余交接对象并保持槽位为空。[REA 证据](analysis/game-legacy-battle-rid0-flight-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage267-legacy-battle-rid0-flight)

桌面网页、移动视口、Page 源码及生成版通过四条新增同槽 TCP 路径。原版动态、真实 C 到达时序、现行版、真机、微信运行时及官服待验收。[验收](reports/validation.md#stage267-legacy-battle-rid0-flight) · [开发顺序](reports/development-plan.md#stage267-legacy-battle-rid0-flight)

<a id="stage266-legacy-battle-rid0-ownership"></a>

## stage266 RID0 的空闲等待与中途离场

旧版 SKL72 首对角色缺席，或尾随 A 指向另一具空闲骑乘身体时，共享客户端按实际游标决定是否准备交接。只排入动作 221 的空闲身体进入原有等待，归位时释放未启用的交接。若 B 已登记后父身体离场，回放释放待登记的 A 和容器，B 槽继续由已登记的角色占用。[REA 证据](analysis/game-legacy-battle-rid0-ownership-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage266-legacy-battle-rid0-ownership)

新路径已用共享源码与微信生成版核心对照。原版动态、现行版、手机真机、微信运行时及官服继续验收。[验收](reports/validation.md#stage266-legacy-battle-rid0-ownership) · [开发顺序](reports/development-plan.md#stage266-legacy-battle-rid0-ownership)

<a id="stage265-legacy-battle-rid0-interruption"></a>

## stage265 主段中断后的 RID0

旧版 SKL72 后段遇到缺席攻击者或目标时，共享客户端检查中断游标。游标到达尾随 RID0 时，原骑乘身体归位并完成交接，后继命令按组内剩余计数执行。动作 221 启动前若原身体离场，回放释放两具尚未注册的新身体及其容器。[REA 证据](analysis/game-legacy-battle-rid0-interruption-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage265-legacy-battle-rid0-interruption)

桌面网页、移动视口、Page 源码与生成版通过 8 条新增本地 TCP 路径。原版动态对照、现行版交接、手机真机、微信运行时及官服待验收。[验收](reports/validation.md#stage265-legacy-battle-rid0-interruption) · [开发顺序](reports/development-plan.md#stage265-legacy-battle-rid0-interruption)

<a id="stage264-legacy-battle-rid0-receive"></a>

## stage264 尾随 RID0 的受击和骑乘交接

旧版 SKL72 回合中，原骑乘身体可先接收命中、完成排队的攻击，再执行 RID0 交接。普通回放原先在第 7,507 个回调超时收尾，交接未执行。修复后第 951 个回调正常完成。槽位提前被覆盖时，未起步攻击的等待会解除，已经起步的旧身体可继续完成攻击。四种本地入口共通过 12 条新增 TCP 路径。[REA 证据](analysis/game-legacy-battle-rid0-receive-v1/source-check.json) · [验收](reports/validation.md#stage264-legacy-battle-rid0-receive)

下一步核对主段中断时的尾随 RID0 游标和交接对象生命周期。原版运行、现行版交接、微信运行时、手机真机及官服仍待验收。[开发顺序](reports/development-plan.md#stage264-legacy-battle-rid0-receive)

<a id="stage263-legacy-battle-following-results"></a>

## stage263 后续攻击的反射、治疗和免伤

共享客户端现在能在先受击再出手的旧版 SKL72 回合中接续反射、治疗、免伤及内联 RID。10 条本地探针从第 7,508 个回调缩短到第 860 至 898 个回调收尾，逐笔 HP 和 MP 一致。桌面网页、移动视口、Page 源码及构建版通过 12 条新增本地 TCP 路径。[静态证据](analysis/game-legacy-battle-following-results-v1/source-check.json) · [验收](reports/validation.md#stage263-legacy-battle-following-results)

下一步核对尾随 RID0 与同类受击等待的交接。原版运行、微信运行时、手机真机、现行版交接及官服仍待验收。[开发顺序](reports/development-plan.md#stage263-legacy-battle-following-results)

<a id="stage262-legacy-battle-late-recipient"></a>

## stage262 后续攻击者先受击再出手

共享战斗核心现在能处理攻击已经排队、随后又先收到命中的角色。命中推进该身体原来的攻击队列，身体稍后到达对应受击等待时，按已经收到的结果继续反应和归位。单发送者探针在第 898 个回调完成，双发送者探针在第 923 个回调完成。四种本地入口共通过 8 条新增 TCP 路径。[静态证据](analysis/game-legacy-battle-late-recipient-v1/source-check.json) · [验收](reports/validation.md#stage262-legacy-battle-late-recipient)

特殊结果标记和附带 RID 的同类交接仍待分析。原版运行、真机、微信运行时、现行版交接及官服待验收。[开发顺序](reports/development-plan.md#stage262-legacy-battle-late-recipient)

<a id="stage261-legacy-battle-independent-following"></a>

## stage261 未起步的后续攻击者

共享战斗核心能识别两类普通 SKL72 回合中始终停在动作 0 的独立后续攻击者。确认主施术者已结束、相关身体已停止推进后，复用原有归位流程。两条探针的回合完成位置从 7,210 和 7,507 个回调缩短到 759 和 989，逐笔 HP、MP 与原本地兜底结果一致。四种本地入口共通过 8 条新增 TCP 路径。[静态证据](analysis/game-legacy-battle-independent-following-v1/source-check.json) · [验收](reports/validation.md#stage261-legacy-battle-independent-following)

后续攻击者仍可能收到本轮后面的命中时，继续使用原有等待流程。原版运行、真机、微信运行时、现行版交接及官服仍待验收。[开发顺序](reports/development-plan.md#stage261-legacy-battle-independent-following)

<a id="stage260-legacy-battle-missing-lookahead"></a>

## stage260 后续目标在回合提交前离场

共享战斗核心可以处理 `PLV` 先移除 SKL72 后续目标的两种路径。已清理的攻击不会扣除技能 MP 或改变 HP，组内后续 `CFP` 正常扣除 2 点 MP，战斗结束后可在同一连接恢复移动。桌面和移动视口 Chrome、微信 Page 源码及构建版已通过 8 条新增本机 TCP 路径。[静态证据](analysis/game-legacy-battle-missing-lookahead-v1/source-check.json) · [验收](reports/validation.md#stage260-legacy-battle-missing-lookahead)

独立后续攻击者的首次激活、原版运行、真机、微信运行时、现行版交接和官服仍待验收。[开发顺序](reports/development-plan.md#stage260-legacy-battle-missing-lookahead)

<a id="stage259-legacy-battle-following-strikes"></a>

## stage259 多次后续攻击的结算与离场

共享客户端按每一击的受击等待推进普通 SKL72 回合。同一护卫的连续攻击、两名护卫对同一角色的攻击，以及受击者接续自己的攻击均有本地验证。执行中一方离场会释放属于该身体的待结算动作，已经落地的伤害和其余角色的回合继续保留。[REA 证据](analysis/game-legacy-battle-following-strikes-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage259-legacy-battle-following-strikes)

桌面及移动视口 Chrome、微信 Page 源码与构建版通过 8 条新增本机 TCP 路径。提交前的 PLV 缺席、独立后续攻击者的起步、原版运行、真机和官服仍有验收缺口。[验收](reports/validation.md#stage259-legacy-battle-following-strikes)

<a id="stage258-legacy-battle-repeated-protection"></a>

## stage258 同一角色的两次护卫交接

共享客户端可处理 SKL72 中同一角色被保护两次，覆盖同一护卫和两名护卫。零伤害时，护卫先消费转向元组，再处理下一次返回及后续攻击。单条后续攻击的任一方离场时，已排入的等待可以结束，同槽新角色保留初始队列与数值。[REA 证据](analysis/game-legacy-battle-repeated-protection-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage258-legacy-battle-repeated-protection)

桌面和移动视口 Chrome、微信 Page 源码与构建版通过 12 条新增本机 TCP 路径。多条后续攻击遇到护卫离场、原版运行、手机真机、微信运行时与官服仍待验证。[验收](reports/validation.md#stage258-legacy-battle-repeated-protection)

<a id="stage257-legacy-battle-guard-wait"></a>

## stage257 SKL72 和 SKL113 护卫回合

共享客户端修复了外层护卫过早推进动作、受保护角色卡在动作 1 的问题。SKL72 中同一护卫保护两个不同角色时，普通结果可按两次靠近、两次返回的顺序完成，含零伤害及离场后同槽替换的本地测试。[REA 证据](analysis/game-legacy-battle-guard-wait-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage257-legacy-battle-guard-wait)

桌面与移动视口 Chrome、微信 Page 源码及构建版通过八条新增本机 TCP 路径。两次保护落在同一个角色、原版运行、手机真机、微信运行时、现行版交接及官服仍待验证。[验收](reports/validation.md#stage257-legacy-battle-guard-wait)

<a id="stage256-legacy-battle-skl113-wire"></a>

## stage256 SKL113 嵌套结果进入实际 M 命令流程

共享客户端按固定旧版的两套游标处理 SKL113。预读保留自己的槽位预约，执行从原命令参数读取嵌套结果。已验证独立后续指令、可跳过尾部未知标记的同组续接，以及两个游标共用结束位置三种场景。[REA 证据](analysis/game-legacy-battle-skl113-wire-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage256-legacy-battle-skl113-wire)

桌面与移动视口 Chrome、微信 Page 源码及构建版均通过本机 TCP。原版实战、外层护卫组合、手机真机、微信运行时、现行版交接与官服仍待核验。[验收](reports/validation.md#stage256-legacy-battle-skl113-wire)

<a id="stage255-legacy-battle-guard-alias"></a>

## stage255 施法者兼任护卫与提前退场

SKL266 的施法者兼任护卫时，最后一条自身结果在动作 216 结算一次。有飞行目标时，近距离返还会提前放行动作 216。SKL72 的嵌套护卫在交接启动前离场时，已登记的回合可以继续，原有 PLV 动作和同槽新角色的队列均有回归覆盖。[REA 证据](analysis/game-legacy-battle-guard-alias-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage255-legacy-battle-guard-alias)

桌面与移动视口 Chrome、微信 Page 源码及构建版均已通过本机 TCP。原版同槽动态顺序、SKL113 嵌套预读、手机真机、微信运行时、现行版交接与官服仍待核验。[验收](reports/validation.md#stage255-legacy-battle-guard-alias)

<a id="stage254-legacy-battle-guard-departure"></a>

## stage254 护卫的第二趟飞行与退场续接

SKL266 变体 2 的飞行物已能完成外部命中、前往护卫、触发自身结果并返回施法者。护卫兼任受击角色也通过本机 TCP 验收。SKL72 已启动的嵌套护卫被移除时，仍在场角色可以结束原队列并结算后续指令。[REA 证据](analysis/game-legacy-battle-guard-departure-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage254-legacy-battle-guard-departure) · [验收](reports/validation.md#stage254-legacy-battle-guard-departure)

<a id="stage253-legacy-battle-guard-release"></a>

## stage253 嵌套护卫放行与自身护卫结算

SKL72 的原目标在护卫就位时退场，仍在场的护卫和施法者会完成当前技能及后续指令。SKL266 变体 2 没有飞行目标时，可由独立护卫结算最终自身结果。两种场景都已通过本机 TCP 入口。[REA 证据](analysis/game-legacy-battle-guard-release-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage253-legacy-battle-guard-release) · [验收](reports/validation.md#stage253-legacy-battle-guard-release)

<a id="stage252-legacy-battle-physical-boundaries"></a>

## stage252 物理技能的嵌套目标与自身结果

共享战斗核心已处理 SKL72 排队前缺席的嵌套目标和动作 232 中途失去目标。无飞行目标的正变体会播放施法动作并结算耗魔，SKL266 变体 2 仍结算最终自身结果。正常回合经本机 TCP 核对。[REA 证据](analysis/game-legacy-battle-physical-boundaries-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage252-legacy-battle-physical-boundaries) · [验收](reports/validation.md#stage252-legacy-battle-physical-boundaries)

<a id="stage251-legacy-battle-physical-registry"></a>

## stage251 物理技能读取实时角色槽

固定旧版的物理配对护卫、正变体施法者和 SKL266 自身护卫已接入实时角色槽检查。共享战斗核心在实际所需角色缺席时结束本条并继续回合，保留后续指令。正变体中被覆盖或未使用的护卫仍参与预读预约。[REA 证据](analysis/game-legacy-battle-physical-registry-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage251-legacy-battle-physical-registry) · [验收](reports/validation.md#stage251-legacy-battle-physical-registry)

<a id="stage250-legacy-battle-assist-terminator"></a>

## stage250 SKL98 协作者 FF 续接

变体 12、13 的协作者 `FF` 已按固定旧版的预读边界消费，后面的 `RID` 保留为独立命令。共享层从已解析边界结束该条技能，后续施法、退场和移动已在桌面与移动视口 Chrome、微信 Page 源码及构建版通过本机 TCP 验收。[REA 证据](analysis/game-legacy-battle-assist-terminator-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage250-legacy-battle-assist-terminator) · [验收](reports/validation.md#stage250-legacy-battle-assist-terminator)

<a id="stage249-legacy-battle-physical-missing"></a>

## stage249 旧版物理技能中断恢复

共享战斗已接入配对技能的首攻击者、首目标及后续命中缺席分支，也处理 SKL260 链目标和正变体的目标缺席。五种场景通过桌面与移动视口 Chrome、微信 Page 源码及构建版的本地 TCP 验收，后续施法、退场和移动均有回执。[REA 证据](analysis/game-legacy-battle-physical-missing-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage249-legacy-battle-physical-missing) · [验收](reports/validation.md#stage249-legacy-battle-physical-missing)

<a id="stage248-legacy-battle-family-missing"></a>

## stage248 旧版 54 类技能的缺席恢复

常规状态技、数值技、施法技和 SKL82 遇到缺席角色时，已能清理当前命令并继续回合。数值技与施法技保留缺席前已累积的反射规则。四类缺席目标场景均通过桌面与移动视口 Chrome、微信 Page 源码及构建版的本地 TCP 测试，后续施法、退场和移动均有回执。[REA 证据](analysis/game-legacy-battle-family-missing-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage248-legacy-battle-family-missing) · [验收](reports/validation.md#stage248-legacy-battle-family-missing)

<a id="stage247-legacy-battle-missing"></a>

## stage247 旧版 SKL98 缺席角色恢复

共享战斗在遇到缺席施法者、协作者或目标时清理当前命令。变体 7 在缺席前已完成的换位会保留。后续记录从已验证的字段边界开始，桌面和移动视口 Chrome、微信 Page 源码及构建版均通过续接、退出与退场后移动。[REA 证据](analysis/game-legacy-battle-missing-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage247-legacy-battle-missing) · [验收](reports/validation.md#stage247-legacy-battle-missing)

<a id="stage246-legacy-battle-status-assist"></a>

## stage246 旧版 SKL98 协作者

变体 12、13 已接入共享战斗。施法信号启动协作者，变体 12 结算命中，变体 13 逐个接近目标并触发回复。本方协作者进入停步退场，其他协作者离场后可继续战斗。桌面和移动视口 Chrome、微信 Page 源码及构建版通过两条变体的本机回环验收。

[REA 证据](analysis/game-legacy-battle-status-assist-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage246-legacy-battle-status-assist) · [验收](reports/validation.md#stage246-legacy-battle-status-assist)

<a id="stage245-legacy-battle-status-position"></a>

## stage245 旧版 SKL98 配对换位

变体 7 已接入共享战斗。角色和附属对象先换注册槽，施法信号到达后角色再走向新位置。被移动的本方槽用于当前回合，下一份角色记录按原有 P 参数重新选槽。桌面和移动视口 Chrome、微信 Page 源码和构建版已在本机回环验证两轮战斗及退场后移动。

[REA 证据](analysis/game-legacy-battle-status-position-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage245-legacy-battle-status-position) · [验收](reports/validation.md#stage245-legacy-battle-status-position)

<a id="stage244-legacy-battle-status-slots"></a>

## stage244 旧版 SKL98 目标放大与退场

旧版 SKL98 的变体 6 和 8 已接入共享战斗回合。变体 6 播放目标放大、提示图元和两段音效。变体 8 缩小并移除目标，命中本方配对槽时先更新宠物缓存。两种结果均在桌面和移动视口 Chrome、微信 Page 源码和构建版通过本机战斗及退场后移动验收。

[REA 证据](analysis/game-legacy-battle-status-slots-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage244-legacy-battle-status-slots) · [验收](reports/validation.md#stage244-legacy-battle-status-slots)

<a id="stage243-legacy-game-stream"></a>

## stage243 旧版持续游戏连接

本地网页游戏启动命令已接入 `/game-stream`。桥接在建立后维持同一条 TCP，游戏会话在出站空闲超过 30 秒时发送源协议的 `3$} nr`。桌面和移动视口 Chrome、微信 Page 源码和构建版均在本机通过两次空闲发包、继续移动、场景重载及断开验收。

[运行方式](web/README.md#stage243-legacy-game-stream) · [REA 证据](analysis/game-legacy-game-stream-v1/source-check.json) · [验收](reports/validation.md#stage243-legacy-game-stream)

<a id="stage242-legacy-battle-status-variant"></a>

## stage242 旧版 SKL98 状态与复活

固定旧版的 SKL98 已接入共用目标记录的十个变体。共享层按施法节奏和动画信号结算状态、清除、击倒和复活。动作 43 现在把当前 HP 置零，SKL86 的击倒也沿用这次修正。

[REA 证据](analysis/game-legacy-battle-status-variant-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage242-legacy-battle-status-variant) · [验收](reports/validation.md#stage242-legacy-battle-status-variant)

<a id="stage241-legacy-battle-summon"></a>

## stage241 旧版战斗角色入场与替换

固定旧版的 SKL93 已接到网页和微信小程序 Page。收到战斗结果后，场上角色按槽位登记，施法扣除 MP，动画信号启动新角色的入场。同一回合的后续指令会读取替换后的角色。桌面和移动尺寸 Chrome、微信 Page 源码和构建版均通过本机 TCP 验收。

[REA 证据](analysis/game-legacy-battle-summon-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage241-legacy-battle-summon) · [验收](reports/validation.md#stage241-legacy-battle-summon)

<a id="stage240-legacy-battle-city-return"></a>

## stage240 战斗内注销回城

桌面网页、移动网页和微信小程序 Page 在已进入战斗后提供“注销回城”。战斗退场和地图重建沿用当前角色连接，完成入场后恢复移动。现行版交接、微信设备和官服仍待验收。

[REA 证据](analysis/game-legacy-battle-city-return-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage240-legacy-battle-city-return) · [验收](reports/validation.md#stage240-legacy-battle-city-return)

<a id="stage239-legacy-city-return"></a>

## stage239 普通地图注销回城

网页和微信小程序 Page 的普通地图支持“注销回城”。原连接保留，页面按服务端的换图或重建通知准备场景，完成转场后可继续移动。战斗回城接续至阶段 240。[战斗内回城](#stage240-legacy-battle-city-return)

[REA 证据](analysis/game-legacy-city-return-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage239-legacy-city-return) · [验收](reports/validation.md#stage239-legacy-city-return)

<a id="stage238-legacy-battle-alternate-exit"></a>

## stage238 普通地图与战斗返回选服

网页和微信 Page 的游戏会话支持主动“返回选服”。页面先播放退场画面，发出一次旧版 `1^t`，再按 `VKW` 的结果结束连接。八条本机 TCP 路径已覆盖普通地图与战斗。注销回城的场景重建、微信设备、现行交接和官服仍待验收。

[REA 证据](analysis/game-legacy-battle-alternate-exit-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage238-legacy-battle-alternate-exit) · [验收](reports/validation.md#stage238-legacy-battle-alternate-exit)

<a id="stage237-legacy-music-phases"></a>

## stage237 选服、战斗与返回地图的音乐

网页和微信 Page 在连接及人物选择阶段播放选服曲。战斗开场根据旧版的场景模式、地图号和战斗参数选曲。普通战斗结束后渐隐战斗曲，在地图重建时恢复场景曲或应用待处理的选曲。

[REA 证据](analysis/game-legacy-music-phases-v1/source-check.json) · [通信规格](reports/logic-protocol-spec.md#stage237-legacy-music-phases) · [验收](reports/validation.md#stage237-legacy-music-phases)

<a id="stage236-legacy-audio"></a>

## stage236 旧版场景音乐与退场音效

网页和微信 Page 从所选资源读取旧版场景音乐。收到服务端退出通知时播放音效 60，并逐档降低正在播放的音乐。桌面和移动尺寸 Chrome 已验证 PCM 输出，微信 Page 的源码和构建产物已用本机 TCP 对端验证普通地图及战斗退场。

[REA 证据](analysis/game-legacy-audio-v1/source-check.json) · [资源格式](reports/resource-formats.md#stage236-legacy-audio) · [验收](reports/validation.md#stage236-legacy-audio)

<a id="stage235-legacy-server-return-fade"></a>

## stage235 旧版退出画面

收到服务端退出通知后，客户端从最后提交的 640×480 游戏画面播放第 14 类逐行过渡。50 帧结束后开放“返回连接设置”。桌面及移动尺寸网页和微信 Page 已用本机原创对端验证，微信同时覆盖普通地图和战斗退场。

[REA 证据](analysis/game-legacy-server-return-fade-v1/source-check.json) · [模块接口](reports/module-interfaces.md#stage235-legacy-server-return-fade) · [验收](reports/validation.md#stage235-legacy-server-return-fade)

<a id="stage234-legacy-server-return"></a>

## stage234 服务端退出通知

固定旧版会话收到 `VKW` 且首字段为 `successful` 时，网页与微信 Page 停止游戏操作并显示“返回连接设置”。确认后释放本轮游戏连接。桌面、移动尺寸网页及微信 Page 的源码和构建产物均通过本机原创对端验收。

[通信规格](reports/logic-protocol-spec.md#stage234-legacy-server-return) · [REA 证据](analysis/game-legacy-server-return-v1/source-check.json) · [验收](reports/validation.md#stage234-legacy-server-return)

<a id="stage233-legacy-frame-startup"></a>

## stage233 旧版普通入场配置

固定旧版的启动 JSON 可将整个 `context` 设为 `"legacy-se6000-37c4"`。共享客户端据此准备普通帧、角色、显示和输入。主状态 9 的音效条件以及收包后的角色门控已通过原创夹具验证。桌面网页、移动尺寸网页和微信 Page 已用本机对端完成入场、移动和换场。

[启动材料](reports/resource-formats.md#stage233-legacy-frame-startup) · [REA 证据](analysis/game-legacy-frame-startup-v1/source-check.json) · [验收](reports/validation.md#stage233-legacy-frame-startup)

<a id="stage232-legacy-ordinary-context"></a>

## stage232 旧版普通移动和输入

固定旧版的启动材料可将 `context.movement` 与 `context.input` 各设为 `"legacy-se6000-37c4"`。普通入场采用已核对的初值，地砖时段取自 `@Qu` 和宿主时钟，动作锁按当前移动门判断。网页和微信 Page 已用本机原创对端完成入场、移动和换场。

[材料格式](reports/resource-formats.md#stage232-legacy-ordinary-context) · [REA 证据](analysis/game-legacy-ordinary-context-v1/source-check.json) · [验收](reports/validation.md#stage232-legacy-ordinary-context)

<a id="stage231-legacy-display-startup"></a>

## stage231 旧版画幅和入场相机

启动材料可将 `context.display` 设为 `"legacy-se6000-37c4"`，使用固定旧版的 640×480 画幅和 320×240 投影中心。游戏入场后从角色位置建立相机，收到位置修正后在下一次取样点击前同步。

桌面、移动尺寸网页和微信 Page 均已在本机对端入场并绘出该画幅。

[材料格式](reports/resource-formats.md#stage231-legacy-display-startup) · [REA 核对](analysis/game-legacy-display-startup-v1/source-check.json) · [验收](reports/validation.md#stage231-legacy-display-startup)

<a id="stage230-legacy-config-startup"></a>

## stage230 从 Config.dat 加载旧版游戏资源

网页和微信游戏页可从所选资源的根目录读取 Config.dat。v2 启动 JSON 使用 `commandTailHex` 时，会将配置首行与命令尾合并，再定位资源。网页和微信 Page 已用移出默认 Bin 目录的原创资源完成角色列表往返。

[材料格式](reports/resource-formats.md#stage230-legacy-config-startup) · [网页运行](web/README.md#stage230-legacy-config-startup) · [微信运行](wechat/README.md#stage230-legacy-config-startup) · [验收](reports/validation.md#stage230-legacy-config-startup)

<a id="stage229-legacy-startup-materials"></a>

## stage229 从本地旧版模块生成启动摘要

桌面网页、移动尺寸网页与微信游戏页支持 v2 启动 JSON。选择包含固定旧版 `cg_se_6000.exe` 的文件夹或资源 ZIP 后，程序校验文件身份并生成首包需要的 32 字节摘要。现有 v1 材料仍可使用。

本机原创对端已收到预期的首包并返回角色列表。现行登录器到游戏的票据消费、微信模拟器和真机、官服兼容待验证。

[网页运行](web/README.md#stage229-legacy-startup-materials) · [微信构建](wechat/README.md#stage229-legacy-startup-materials) · [REA 证据](analysis/game-legacy-startup-materials-v1/source-check.json) · [验收](reports/validation.md#stage229-legacy-startup-materials)

<a id="stage228"></a>

<a id="stage228-wechat-special-dialogs"></a>

## stage228 微信物品交接、外观与图文对话

微信游戏页已接入给予与接受物品、双字段回复、外观调整和图文确认。物品给予沿用订单核对。外观箭头更新本地草稿，确认时提交选定编号。

普通和特殊图文窗口可从已选资源包绘制图像，缺图时保留文字和操作。外观窗口沿用共享外观逻辑及已有资源预览布局。

**待验收**。原版复合外观渲染、其余 NPC 图像、入站邀请、微信模拟器游戏操作与真机、现行登录交接和官服。

[运行与构建](wechat/README.md#stage228-wechat-special-dialogs) · [REA 字节核验](analysis/game-wechat-special-dialogs-v1/source-check.json) · [验收](reports/validation.md#stage228-wechat-special-dialogs)

<a id="stage227"></a>

<a id="stage227-wechat-family-board"></a>

## stage227 微信家族、家族兽与留言板

微信游戏页可查看家族和成员，按当前权限编辑家族名、会馆名和称号，邀请相邻玩家、分配称号、移除成员或退出家族。资料和名单随服务端回包更新。

家族兽已接入喂食、改名和关闭。留言板支持翻页、发帖与删帖。移除成员和删帖需要再确认，旧窗口或名单的确认会失效。

**待验收**。入站家族邀请、其他地图窗口、原版 NPC 图像、微信模拟器与真机、现行登录交接和官服。

[运行与构建](wechat/README.md#stage227-wechat-family-board) · [REA 字节核验](analysis/game-wechat-family-board-v1/source-check.json) · [验收](reports/validation.md#stage227-wechat-family-board)

<a id="stage226"></a>

<a id="stage226-wechat-storage-trade"></a>

## stage226 微信仓储与玩家交易

微信游戏页已接入银行、仓储和饲料箱。银行与仓储提供物品、宠物和金币存取，饲料箱提供物品存取。提交后等待回包更新槽位与余额。

玩家交易支持从附近候选列表选择，以及服务端直接打开交易窗口。可选物品和宠物、填写金币、发布和撤回报价。持有记录变化后，旧报价无法确认。

**待验收**。家族、留言板及其他地图窗口，原版 NPC 图像，微信模拟器与真机，现行登录交接和官服。

[运行与构建](wechat/README.md#stage226-wechat-storage-trade) · [REA 字节核验](analysis/game-wechat-storage-trade-v1/source-check.json) · [验收](reports/validation.md#stage226-wechat-storage-trade)

<a id="stage225"></a>

<a id="stage225-wechat-map-services"></a>

## stage225 微信治疗与技能训练

地图交互已接入单人和完整治疗、人物学习与遗忘技能，以及旧版两套宠物训练窗口。人物遗忘和宠物栏位选择要再确认。技能或宠物列表更新后，旧确认会关闭。

本机 TCP 验收覆盖费用和容量更新、技能遗忘、空栏位学习、覆盖已有技能、取消与恢复移动。使用固定旧样本和原创测试材料。

**待验收**。剩余地图窗口、NPC 图像、微信模拟器与真机、现行登录交接和官服。

[运行与构建](wechat/README.md#stage225-wechat-map-services) · [REA 字节核验](analysis/game-wechat-map-services-v1/source-check.json) · [验收](reports/validation.md#stage225-wechat-map-services)

<a id="stage224"></a>

<a id="stage224-wechat-inventory-shop"></a>

## stage224 微信背包与地图商店

**开发中。** 微信游戏页可查看装备和背包，使用物品、移动整组、拆分数量、交换槽位和确认丢弃。拾取与背包变化由服务端回包更新。

**本机验收。** 商人和兑换员可从地图交互打开。买入、卖出、鉴定、修理、兑换和折算可核对后提交。源码版与生成包各通过 14 项页面测试，五套构建和微信模板编译通过。

**待验收。** 微信模拟器、真机、完整地图服务、现行登录交接及官服兼容。

[操作与构建](wechat/README.md#stage224-wechat-inventory-shop) · [REA 字节核验](analysis/game-wechat-inventory-shop-v1/source-check.json) · [验收记录](reports/validation.md#stage224-wechat-inventory-shop)

<a id="stage223"></a>

<a id="stage223-wechat-creation"></a>

## stage223 微信新建人物与首次入场

**开发中。** 微信游戏页可从空槽创建人物，选择外观、输入名称、分配点数并核对后提交。创建成功后刷新角色列表，玩家从列表选择新角色入场。拒绝后可返回原列表。

**本机验收。** 源码适配与生成包各通过 7 项页面测试。独立 TCP 对端核对了双空槽建角、重复应答、名单刷新、入场、两条触控移动请求，以及拒绝和退后台清理。五套微信构建及微信自带的 WXML、WXSS 编译通过。

**待验收。** 微信模拟器和真机、原版外观预览、其他地图服务窗口、现行登录交接及官服兼容。

[构建与操作](wechat/README.md#stage223-wechat-creation) · [REA 字节核验](analysis/game-wechat-creation-v1/source-check.json) · [验收记录](reports/validation.md#stage223-wechat-creation)

<a id="stage222"></a>

<a id="stage222-wechat-page"></a>

## stage222 微信小程序游戏页

**开发中。** 登录页已有入口进入微信原生游戏分包。页面可选取本次启动 JSON 和资源 ZIP，或接收登录页已选资源，使用共享核心完成选角、地图触控、场景对话、聊天与已支持的战斗操作。

**本机验收。** 2,706 项源码回归、80 项生成核心测试、两套页面各 4 项测试、五套微信构建及微信自带的 WXML 与 WXSS 编译通过。桌面和触屏网页通过 48 条流程。

**待验证。** 本机 DevTools 自动化服务端口关闭，普通导入页提示游客 AppID 受限，模拟器运行与真机联机尚待验收。现行登录票据交接、其余玩法和官服兼容继续开发。

[构建与运行](wechat/README.md#stage222-wechat-page) · [REA 字节核验](analysis/game-wechat-page-v1/source-check.json) · [验收记录](reports/validation.md#stage222-wechat-page) · [需求与后续](reports/development-plan.md#stage222-wechat-page)

<a id="stage221"></a>

<a id="stage221-chat-presentation"></a>

## stage221 地图气泡、黑名单和滚动公告

**开发中。** 游戏页把普通聊天气泡附在发言角色上，分别滚动运营和玩家公告。聊天黑名单在同一浏览器内按本机目标保存，重新连接后生效。

**事实**。225 个测试文件的 2,706 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 783 个输入和 34 个输出，外部导入为零。 通过 48 条本机 TCP 流程和 48 条桌面及触屏网页流程。

**待验证**。原版隐藏聊天开关、气泡素材和音效、特殊角色、战斗中公告、家族邀请应答、真实联机、手机真机及微信原生游戏页待验证。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-chat"></a>

### 前序检查点 · 地图聊天和小队频道

**开发中。** 游戏页可发送普通和小队聊天，选择范围、颜色及字号，并显示收到的玩家聊天和普通系统消息。

**事实**。225 个测试文件的 2,703 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 783 个输入和 34 个输出，外部导入为零。 通过 46 条本机 TCP 流程和 46 条桌面及触屏网页流程。

**待验证**。原版头顶气泡、黑名单、滚动公告、家族邀请应答、真实联机、手机真机、微信原生游戏页及官服兼容待验证。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 家族邀请、成员管理和退出

**开发中。** 游戏页「家族资料」可邀请正对的相邻玩家，为可管理成员分配称号，按权限确认移除成员或退出家族。名单和称号由入站数据更新。

**事实**。225 个测试文件的 2,701 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 779 个输入和 34 个输出，外部导入为零。 通过 44 条本机 TCP 流程和 44 条桌面及触屏网页流程。

**待验证**。收到邀请后的应答、独立入会申请、旧布局中的称号清除、真实结算、手机真机、微信原生游戏页与官服兼容仍待验证。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 家族资料、成员名单和称号管理

**开发中。** 从游戏页的「家族资料」查看家族、会馆、自己的称号和成员名单。收到管理权限后可提交家族名、会馆名、称号名称与已核定的五项权限。

**事实**。225 个测试文件的 2,699 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 779 个输入和 34 个输出，外部导入为零。 通过 42 条本机 TCP 流程和 42 条桌面及触屏网页流程。上轮家族兽和饲料箱回归通过。

**待验证**。入会申请、邀请、成员移除和分配称号的出站流程，以及真实结算、手机真机、微信原生游戏页与官服兼容待验证。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 家族兽喂食、改名和饲料箱

**开发中。** 网页和移动网页可读取家族兽信息，按收到的权限喂食和改名，并在饲料箱中选槽存取物品。

**事实**。225 个测试文件的 2,697 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 775 个输入和 34 个输出，外部导入为零。 通过 40 条本机 TCP 流程和 40 条桌面及触屏网页流程。

**待验证**。原版拖放、近距关闭、其余家族窗口、真实结算、手机真机、微信原生游戏页和官服兼容仍待验证。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 银行和仓储存取

**开发中。** 网页和移动网页可在银行与仓储窗口选槽存取物品和宠物，并按持有金额和余额存取金币。提交后等待服务端更新。

**事实**。225 个测试文件的 2,695 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 771 个输入和 34 个输出，外部导入为零。 通过 38 条本机 TCP 流程和 38 条桌面及触屏网页流程。

**待验证**。六位数字提示与认证的关系、0x22 独立窗口、真实结算、手机真机、微信原生游戏页和官服兼容仍待验证。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 地图物品交接、双项输入、外观和图文确认

**开发中。** 网页和移动网页可从 NPC 选择给予或接受物品、填写双项回复、调整脸型眼睛和嘴型，以及确认带指定图形的对话。

**事实**。225 个测试文件的 2,693 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 767 个输入和 34 个输出，外部导入为零。 通过 36 条本机 TCP 流程和 36 条桌面及触屏网页流程。

**待验证**。组合式外观像素、其余地图窗口和银行协议、真实服务端结算、手机真机、微信原生游戏页及官服兼容仍待验证。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 宠物技能师范

**开发中。** 网页和移动网页可选择宠物技能、符合条件的宠物和实际技能栏位。可使用空栏或预览将被替换的技能，再确认学习。

**事实**。225 个测试文件的 2,690 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 763 个输入和 34 个输出，外部导入为零。 通过 34 条本机 TCP 流程和 34 条桌面及触屏网页流程。

**待验证**。宠物师范原版图形和提示布局、其余专用窗口、真实服务端结算、手机真机、微信游戏页和官服兼容仍待验。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · NPC 买卖、兑换与技能师范

**开发中。** 网页和移动网页可从 NPC 进入普通买卖与物品兑换窗口。技能师范显示学习费用、所需栏位及当前容量，支持学习、遗忘和返回。

**事实**。225 个测试文件的 2,688 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 759 个输入和 34 个输出，外部导入为零。 源码与生成核心共通过 32 条本机 TCP 流程，桌面与触屏模拟共通过 32 条网页流程。

**待验证**。NPC 窗口原版图形与遗忘数值栏名称、宠物技能和其余专用窗口、真实结算、手机真机、微信游戏页和官服兼容仍待验。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · NPC 治疗与图文对话

**开发中。** 网页和移动网页支持 NPC 治疗的单项选择、完整治疗和取消。可从选定的本地资源显示对话图形和动画，同时使用原来的文字菜单和回复。

**事实**。225 个文件的 2,686 项源码测试和生成核心的 80 项测试通过。四套微信构建核对 755 个输入和 34 个输出，外部导入为零。 源码与生成核心共通过 30 条本机 TCP 流程，桌面与触屏模拟共通过 30 条网页流程。

**待验证**。原版伤势图标、图文窗口像素布局、其余专用窗口、真实治疗结算、手机真机、微信游戏页和官服兼容仍待验。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 玩家交易

**开发中。** 网页和移动网页可面向附近玩家发起交易，也可接收邀请。双方报价支持物品、宠物和金币，可撤回、确认和退出。持有记录随对应的服务端回包更新。

**事实**。225 个文件的 2,684 项源码测试和生成核心的 80 项测试通过。四套小程序构建核对 751 个输入和 34 个输出，外部导入为零。 源码与生成核心共通过 28 条本机 TCP 流程，桌面与触屏模拟共通过 28 条网页流程。

**待验证**。原版队伍交易入口和交易详情、真实结算、手机真机、微信游戏页、现行版与官服兼容待验。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 地图留言板

**开发中。** 网页和移动网页支持 Q?m 模式 0x15，可阅读留言、按服务器给出的方向翻页、发布中文留言和确认删除有权限的条目。页面内容随服务器回包更新。

**事实**。225 个文件的 2,682 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。 源码与生成核心共通过 26 条本机 TCP 流程，桌面与触屏模拟共通过 26 条网页流程。

**待验证**。玩家交易、原版留言头像与编辑细节、手机真机、微信游戏页、现行版与官服兼容待验收。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 地图单项给予窗口

**开发中。** 网页和移动网页支持模式 0x1f 的两套数量规则。玩家选择数量、核对折算值后可确认或取消。金币或物品回包改变数量限制时，网页会重新核价。

**事实**。225 个文件的 2,680 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。 源码与生成核心共通过 24 条本机 TCP 流程，桌面与触屏模拟共通过 24 条网页流程。

**待验证**。其余交易模式、原版商店图形、手机真机、微信游戏页、现行版与官服兼容待验收。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 地图物品兑换商店

**开发中。** 网页和移动网页收到物品兑换窗口后，可选择数量、核对所需兑换物和背包空格，再确认或离店。付款完全用掉的背包堆叠可计入可用空格，背包随回包更新。

**事实**。225 个文件的 2,678 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。 源码与生成核心共通过 22 条本机 TCP 流程，桌面与触屏模拟共通过 22 条网页流程。

**待验证**。其余交易模式、原版商店图形、手机真机、微信游戏页、现行版与官服兼容待验收。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 商店鉴定、修理和背包物品说明

**开发中。** 网页和移动网页可在鉴定和修理窗口勾选背包物品，核对费用后确认或取消。收到物品更新后，背包显示最新名称与说明。

**事实**。225 个文件的 2,677 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。 源码与生成核心共通过 20 条本机 TCP 流程，桌面与触屏模拟共通过 20 条网页流程。

**待验证**。其他交易模式、原版商店图形、手机真机、微信游戏页、现行版与官服兼容待验收。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-shop"></a>

### 前序检查点 · 普通地图商店买卖

**开发中。** 网页和移动网页在收到商店窗口后可选择商品与数量，核对订单后购买或出售。金币与背包跟随服务端更新，出售报价在相应槽位变动后失效。

**事实**。225 个文件的 2,676 项源码测试和生成核心的 80 项测试通过。四套构建核对 747 个输入和 34 个输出，外部导入为零。 源码与生成核心共通过 18 条本机 TCP 流程，桌面与触屏模拟共通过 18 条网页流程。

**待验证**。鉴定、修理、其他交易模式、原版商店图形、手机真机、微信游戏页、现行版与官服兼容待验收。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 地图角色交互与普通对话

**开发中。** 桌面右键可与角色交互。触屏开启交互模式后可轻触角色或拾取物品。普通服务端对话支持文字、菜单选择和单行输入。

**事实**。225 个文件的 2,674 项源码测试与生成核心的 80 项测试通过。四套构建核对 743 个输入和 34 个输出，外部导入为零。 源码和生成核心共通过 16 条本机 TCP 流程，桌面和触屏模拟共通过 16 条网页流程。

**待验证**。原版图文及专用弹窗、商店、手机真机、微信游戏页、现行版和官服兼容仍待验收。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 地图转身与地面拾取

**开发中。** 桌面右键可拾取附近的地面物品或钱币。触屏先开启拾取模式，再轻触目标。地面与背包在服务端回包后更新。

**事实**。225 个文件的 2,673 项源码测试与生成核心的 80 项测试通过。四套构建核对 739 个输入和 34 个输出，外部导入为零。 源码和生成核心共通过 14 条本机 TCP 流程，桌面和触屏模拟共通过 14 条网页流程。

**待验证**。当时还剩原版角色交互、商店与弹窗、完整玩法、手机真机、微信游戏页、现行版和官服兼容仍待验收。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-targets"></a>

### 前序检查点 · 特殊道具、丢弃与战斗卸武器

**开发中。** 地图背包可为特殊道具选择另一件物品，也可确认丢弃。战斗背包有卸下武器入口，检查手位类别和背包空位。

**事实**。95 个文件的 1,267 项源码回归与生成核心 80 项测试通过。四套构建核对 739 个输入和 34 个输出，外部导入为零。 源码和生成核心共通过 12 条本机 TCP 流程，桌面与触屏模拟共通过 12 条网页流程。

**待验证**。当时还剩地面拾取、商店分支、原版指针和弹窗行为、手机真机、微信游戏页、现行版和官服兼容仍待验收。 阶段 221 保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-items"></a>

### 前序检查点 · 地图背包与战斗字段纠正

**开发中。** 网页进入地图后可打开背包，直接使用道具、装备和卸下装备、换槽或拆分堆叠。物品槽随服务端消息更新。

**事实**。第 12 字段是战斗物品类别，第 5 字段是物品编码。上一轮原创夹具把类别放在第 5 字段，本轮已修正并重跑。 95 个测试文件的 1,264 项源码回归和生成包 78 项测试通过。四套构建核验 739 个输入和 34 个输出，外部导入为零。 源码与生成包共通过 10 条本机 TCP 流程，网页通过 10 条点击与触屏流程。

**待验证**。特殊道具选目标、丢弃、战斗卸下武器快捷操作、原版图标和提示窗口、手机真机、微信游戏页与设备、现行版和官服兼容待完成。 阶段 221 仍保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-input"></a>

### 前序检查点 · 战斗物品栏、使用与装备

字段纠正和复测见[本轮记录](#stage221-ordinary-items)。

**开发中。** 网页战斗可打开服务端同步的背包，选择消耗品与目标，或选择装备。换槽或移除会取消对应的待发送选择，回合结算后可返回地图。

**事实**。94 个测试文件的 1,250 项源码回归和生成包 76 项测试通过。四套构建核验 739 个输入和 34 个输出，外部导入为零。源码和生成包共通过八条本机 TCP 流程，浏览器通过八条流程。

**待验证**。普通场景背包、战斗卸下武器快捷操作、原版物品图标与说明、手机真机、微信游戏页与设备、现行版和官服兼容待完成。阶段 221 仍保留 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/item-input-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/item-input-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-mp-items"></a>

### 前序检查点 · CFP 扣减 MP 与 ITM 物品结果

**开发中。** 战斗收包已接通 CFP 的 MP 变化、ITM0 的目标回复和 ITM7 的用物动作。角色栏随结算更新，服务器提前结束时清理未完成动作并返回地图。

**事实**。93 个测试文件的 1,244 项源码回归和生成包 73 项测试通过。四套构建核验 735 个输入和 34 个输出，外部导入为零。四条本机 TCP 流程和四条浏览器流程通过。

**待验证**。物品选择与发送、其他战斗行为、手机真机、微信游戏页与设备、现行版和官服兼容待完成。保留阶段 221 的 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/mp-items-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/mp-items-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-transitions"></a>

### 前序检查点 · REB 变身与 PLV 角色退场

**开发中。** REB 在原有战斗队列中切换或解除元素形态。PLV 让角色跑向退场点，随后移除战斗对象和列表对应行。服务器提前结束时清理两条动作并返回地图。

**事实**。92 个测试文件的 1,238 项源码回归和生成包 67 项测试通过。四套构建核验 735 个输入和 34 个输出，外部导入为零。 源码和生成包共通过四条本机 TCP 流程。桌面点击与触屏模拟各通过正常结算和服务器提前中断。14 张原创夹具截图已核对，页面错误、警告和外部请求均为零。

**待验证**。CFP 和其余 ITM 分支、原版其他渲染后端和对象引用重叠场景、手机真机、微信游戏页与设备、现行版和官服兼容待验证。 保留阶段 221 的 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/actor-transitions-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/actor-transitions-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-friend-roster"></a>

### 前序检查点 · 好友名单与对侧召唤

**开发中。** 已接通好友名单的收包、明细请求和刷新。C 入场与对侧 MON 召唤按原始名称和四项标记设置友方位。匹配后，符合条件的施法会走原有图形提示。

**事实**。91 个测试文件的 1,232 项战斗回归及生成包 61 项专项通过。四套构建核验 735 个输入及 34 个输出，外部导入为零。 源码和生成包各通过匹配、刷新后不匹配与施法提示三条本机 TCP 流程。桌面与触屏模拟各验证两条召唤流程，留存 12 张原创夹具截图。页面错误、警告和外部请求均为零。

**待验证**。原生名片文件和角色切换的名单隔离、其余战斗消费者、手机真机、微信游戏页与设备、现行版与官服兼容待验收。 保留阶段221的 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/friend-roster-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/friend-roster-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-effects"></a>

### 前序检查点 · 战斗聊天、计时和提前退场

**开发中。** 普通 M 收包已支持 CHT 战斗聊天和 BST 时间变化。玩家可以在画布看到发言图标及时间数字。网页返回地图后继续显示本轮会话的聊天与剩余时间，断开时清空。

**事实**。90 个测试文件的 1,228 项战斗回归及生成包 58 项专项通过。四套构建核验 731 个输入及 34 个输出，外部导入为零。 源码与生成包各通过正常回合和提前退场的本机 TCP 流程。桌面与触屏模拟各验证两条流程，留存 18 张原创夹具截图，页面错误、警告和外部请求均为零。

**待验证**。原生聊天过滤、音效播放、替代渲染、其余退场分支、手机真机、微信游戏页和设备、现行版与官服兼容待验收。 保留阶段221的 37 项要求和 10 个未完成消费者组。

[本轮计划](analysis/game-battle-shared-storage-v1/side-effects-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/side-effects-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 天气和目标效果

**开发中。** SKL401 已接入正常战斗收包。带结果位 0x80000 的目标按源队列产生 30 次效果。雨开启时逐帧生成，归零后已有雨滴继续移动。提前退场会清掉仍开启的雨。

**事实**。89 个测试文件的 1,223 项战斗回归及生成包 53 项专项通过。四套构建核验 727 个输入和 34 个输出，外部导入为零。 源码和生成包各完成普通回合与提前退场两条本机 TCP 流程。普通用例结算 30 次效果并在地图画面绘出余滴，提前退场的地图画面没有余滴。 桌面 1100×850 与触屏模拟 390×844 分别复核两种退场，留存 16 张原创素材截图。页面错误、警告和外部请求均为零。

**待验证**。其余共用消费者及重复效果的同槽别名。完整独立模型、替代渲染、手机真机、微信原生游戏页和设备、现行版及官服兼容待验收。

[天气实现计划](analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 追踪与离场

**开发中。** SKL400 已接入普通 M 收包。施法中途信号启动追踪，目标按结果位闪避、显示提示、随追踪对象移动后归位或离场。离场时同步更新战斗登记与名单。

**事实**。88 个测试文件的 1,216 项战斗回归和生成包 46 项专项通过。四套构建核验 723 个输入及 34 个输出，外部导入为零。 源码和生成包各完成本机搬运与成对离场两条流程。收到 M 后 MP 从 10 扣至 7，完成一轮、退场和两次地图移动。成对离场从对象与名单同时移除 10、15 槽。 桌面 1100×850 和触屏模拟 390×844 各完成搬运与成对离场。四条真实页面流程各捕获至少 512 个原创特效像素，共留存 12 张截图。页面错误、警告和外部请求均为零。

**待验证**。SKL401 天气、SKL400 重复目标及关联资源分支。替代渲染、完整独立状态模型、手机真机、微信原生游戏页和设备、现行版及官服兼容待验收。

[追踪与离场计划](analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL402 侧选施法

**开发中。** SKL402 已接入共享战斗流程。选择器为零时扫描 0–9 槽，非零时扫描 10–19 槽。登记中的倒地角色也参与。施法自然完成后放行目标，各自等到效果结束才释放。

**事实**。87 个测试文件的 1,209 项战斗回归与生成包 39 项专项全部通过。四套构建核验 723 个输入和 34 个输出，外部导入为零。 源码和生成包分别经本机 TCP 走完两侧用例。每次提交一条技能命令，收到 M 后从 MP 10 扣到 7，完成一轮战斗、退场和两次地图移动。 桌面 1100×850 与触屏模拟 390×844 各覆盖两侧。实际 Canvas 捕获到原创效果，四条页面流程共留存 12 张截图。页面错误、警告和外部请求均为零。

**待验证**。SKL400 和 SKL401 已定位到旧版生产者及部分回调，仍需实现。完整的独立状态模型、原生图形后端、手机真机、微信原生游戏页和设备、现行版及官服兼容待验收。

[侧选施法计划](analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · 同槽交接、SKL405 与 GMN 呈现

**开发中。** SKL404 同槽交接保留两次登记，在第 7,201 次忙碌检查时追加 11、38 归位动作，随后释放命令并结算。技能等级取编号个位，40491 走等级 1。 SKL405 已接入施法回调。真实动画信号按序更新目标的 1d0、主体资源和链接对象，背景图元完成 255 次透明度递增后交给下一次背景刷新。

**事实**。86 个文件的 1,204 项回归及生成包的 34 项专项全部通过。四套构建核验 723 个输入与 34 个输出，外部导入为 0。 源码和生成包各完成同槽 SKL404 与 SKL405 的本机 TCP 流程。同槽用例恢复后接收下一轮 C/M、再次发送技能请求并完成第二轮，最终目标 HP 为 65。 桌面 1100×850 和触控模拟 390×844 均验证 SKL405 的背景、MP 10 → 7、结算和返回地图。共 6 张原创素材截图，页面错误、警告和外部请求均为 0。

**待验证**。其他别名、完整的独立状态模型、原生图形后端、手机真机、微信原生游戏页与设备、现行版和官服兼容仍待验证。 GMN 名称窗与调色板的上一检查点证据及 37 项原始要求、10 个未完成消费者组由阶段记录继续追踪。

[恢复与变形计划](analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：CMB合击与真实命令收尾

**事实**：固定37c4旧样本的CMB（opcode8）已接入shared实际四阶段命令执行。依次准备参与者、等待动作70到齐、按源计数器放行、再由434b90等待归位与释放；普通结果先累计32位有符号伤害，1038标记让前序命中只产生反馈，最后一次扣累计HP。没有生成动作53或MP扣费。

**事实**：当前77个战斗文件1,076/1,076项、当前neutral生成包64/64项通过；四套构建核对687个输入和34个输出，外部导入0。当前物理族主验收本机TCP397次（源码337、生成52、页面8）；新增CMB为14源码、14生成、8页面，调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共46截图，全部正常回合、返回地图与准确后续移动；页面错误、警告、外联0。Browser插件不可用，使用已有Playwright1.64.1。触控HUD核对Hero MP10、替换的OriginalRider HP40/MP8、目标HP51；nextC中的MP7来自新C包，不是合击扣费。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](analysis/game-battle-combination-v1/implementation-plan.json)、[规格](analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](analysis/game-battle-combination-v1/source-check.json)、[源修正](analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](analysis/game-battle-combination-v1/test-results.json)、[验收边界](analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：RID角色交接与动作索引纠错

**事实**：固定37c4旧样本的附带RID0生产者4236d0及动作221已进入shared。每条21字段，名称上限28字节、两组有符号HP/MP、状态与资源按源保留；创建两个隐藏且暂不回调的身体、8个整数盒及16字节逻辑交接对象，再向旧身体追加221和[a,0,a,b]。它与结果RID三资源字属于不同语义。

**事实**：当前75个战斗文件1,058/1,058项、当前neutral生成包46/46项通过；四套构建核对679个输入和34个输出，外部导入0。当前物理族主验收本机TCP369次（源码323、生成38、页面8）；新增RID为10源码、10生成、8页面，额外调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共42截图，全部完成回合、返回地图及准确后续移动；页面错误、警告、外联0。实际HUD显示替换后的OriginalRider HP40/100、MP8/10。原创小像素夹具不代表完整游戏画面。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：73类近战路径

**事实**：固定37c4样本的73类variant0已接入共有近战生产者424310；十个等级都以38/53开始，不加入147，按实际M记录扣一次MP。护卫、RID元数据、反射/治疗/跳过、击倒、普通后续记录与自身目标保留原始动作顺序。73没有14专用资源映射，普通命中使用1adb1～1adb3随机效果。原先73的variant1/2/3仍走独立远程路径，不增加近战MP扣费。

**事实**：当前73个战斗测试文件完整回归1,046项全部通过；neutral生成包完整34项全部通过。四种构建核对671个输入与34个输出，外部导入0。357次主物理家族本机TCP回执（源码313、生成28、页面16）均校验正常启动、准确指令和清理。桌面1100×850与触控模拟390×844各8条实际game.html流程，共82截图；15条返回地图并继续准确移动，1条保留有界等待后断开。页面错误、警告、外联均为0。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](analysis/game-battle-pair73-v1/source-check.json)、[源修正](analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](analysis/game-battle-pair73-v1/test-results.json)、[验收边界](analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：260双目标链式攻击

**事实**：按固定37c4样本的424310与40a120接入260首对生产者、201/203移动朝向、204第二目标和14主命中，十个等级、守护、RID、普通后续记录及255结束标记均有独立证据。204在dead*14+24帧处理第二目标，先保存原攻击者再替换父关联；主攻击1af89朝向0，原攻击者仍为260/9时连击朝向1。202单独验证为“元组slot与flags坐标”，不是amount；260生产者并不发出202。

**事实**：71文件完整战斗回归初轮1,012项中1,011通过、1条压力资源重入的“应正常回合”预期失败；生成包初轮33项中31通过，另有同一重入预期及跨VM对象原型比较失败。只修正3个测试辅助文件，源码与生成包各定向复验2项通过，最终分别覆盖1,012与33个检查；未声称修正后重跑完整两套。932个其他输入及产品运行代码保持相同。四种构建671输入/34输出、外部导入0；328次主物理家族TCP回执（源码285、生成27、页面16）。桌面与触屏模拟各8流程、83截图，15条正常返回移动及1条预期上下文错误/清理通过，页面错误、警告、外联0。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](analysis/game-battle-chain260-v1/source-check.json)、[源修正](analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](analysis/game-battle-chain260-v1/test-results.json)、[验收边界](analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：105十等级与共享游标

**事实**：固定37c4旧样本的105首条pair/variant0及真实156/97/98已接入shared，保留前置蓄力、残影、速度25、逐次动画反应和声音，再由14统一结算HP/RID。游标属于同一客户端播放所有者，在两个施术者之间共享；自身反应中断后保留1，清理身体后下一次从动作8继续，完成时才按源重置。既有正变体105路径保持。

**事实**：当前69文件战斗979/979、当前neutral生成包34/34、四套构建663输入/34输出通过，0外部导入。当前物理族主验收本地TCP301次（源码258、生成27、实际页面16），另4次实际98动作内暂停/重入定向核对不计入主总数；暂停的重试不重复消耗游标，重入保留2，两次已发生的M消耗按两次计算。桌面/触屏模拟各8流程、83张截图，15条返回移动及1条预期错误提示/清理通过，页面异常/警告/外联0。921个运行/测试/对端输入稳定，含58个Python对端。未重跑全仓或历史生成包全套。

**事实／待验证**：护卫后的RID后续记录在原创场景中令角色资源变为0；实际核心与独立方程在帧264/311一致进入当前帧控制器的LEGACY_BATTLE_FRAME_GEOMETRY。两个案例保留为渲染边界，未当作像素或正常回合通过。初始新模型未保留失败帧中新建残影的旧优先级17，曾错误地保留计算值16，现仅修正该边界快照；全部场景输入、队列、资源、geometry、拥有存储和成功RGBA保持，只有一条边界轨迹的最后状态改变。未放宽原渲染器或改旧golden。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](analysis/game-battle-special-context-v1/source-check.json)、[源修正](analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](analysis/game-battle-special-context-v1/test-results.json)、[验收边界](analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：94/257/262特殊配对流程

**事实**：固定37c4旧样本的94、257、262首条pair/variant0队列及真实消费者已接入shared。94使用额外104c标量、78声音与96前置动画，再由14按字面优先级分派条件和HP；257/262保留73/74、最高级tile2/3、额外效果及262的205冲刺和1af89朝向1。护卫、RID旧第四字、E000、别名自身与普通后续记录分别核对。0x106=262、0x10a=266的先前纠错保持；本轮没有新增平台专用功能。

**事实**：当前67文件战斗945/945、当前neutral生成包33/33、四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP272次（源码231、生成27、实际页面14）；桌面/触屏模拟各7流程、74张截图，页面错误/警告/外联均为0。907个运行/测试/对端输入稳定，含57个Python对端。未重跑全仓或历史生成包全套。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：特殊攻击规格与266类别纠错

**事实／纠错**：原424310的`0x106`是262，`0x10a`才是266。旧实现和独立模型曾把262的205冲刺、最高等级73/74套给266；本轮修正shared的配对生产者及护卫路径，266恢复普通9接近。此前stage209相关“266/205”结论已被新证据纠正；正变体和自身266的独立规则继续区分。其余五类特殊pair并未因此启用。

**事实**：当前65文件战斗912/912、当前neutral生成包27/27和四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP227次（源码204、生成21、实际页面2）；桌面/触屏各一次266反射、回合、返回及精确移动流程通过，共10张截图，页面错误/警告/外联0。895个运行/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成包全套。

**事实／边界**：105使用533968处按等级步长20的有符号动画表与共享58fac0游标；已核200字节只有前两行带负终止标记，后八行全0，不能推定高等级正常完成。260带主护卫的串联字段在435000前置解析与424310实际生产者之间顺序不同。4608个原创字段流对照中，实际shared解析准备4368个、240个触发跨平台边界拒绝；4128个在两个源读取器都完整，336个已准备流呈现不同字段角色顺序。未把这些静态方程当作游戏执行或修改已证前置解析。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：96特殊攻击与真实HP生命周期

**事实**：固定37c4旧样本的96首条pair/variant0生产者及75/76/80/89/90/92/93/94/95真实动作已进入shared，包含可见性/瞬移/冲刺、源HP置零、冻结、护卫及普通后续记录；正变体1/2/3仍沿用先前普通发射路径。

**事实**：当前战斗912/912（65文件）、当前neutral生成包25/25、四套构建（659输入、34输出、0外部导入）通过。当前物理族本地TCP共241次：保留源码184、新源码20、生成20、实际页面17；17条桌面/触屏流程、106张截图，页面错误/警告/外联均为0。893个源码/模型/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成套件。

**事实**：96默认后端的4160组队列、80条轨迹、32959帧状态、11836帧双selector完整RGBA与实际共享核心一致。另两条替代渲染轨迹的927状态/578像素/50样式观察仅为独立源方程；实际公开配置仍报LEGACY_BATTLE_SKILL_CONFIGURATION，未放宽门禁、未计入运行或像素通过。当前仍无替代渲染/半透明后端的完整实现。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](analysis/game-battle-special96-v1/implementation-plan.json)、[规格](analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](analysis/game-battle-special96-v1/source-check.json)、[源修正](analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](analysis/game-battle-special96-v1/test-results.json)、[验收边界](analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：嵌套攻击、双护卫和源解析边界

**事实**：固定37c4旧样本的72/113首条嵌套生产者及真实232、5、56/57/58/61/79动作已进入shared，包含主目标/嵌套目标的双护卫、反射/治疗/跳过/组合位、游标和普通后续记录；24等待忙目标时的动画遗漏已按原始代码修正。

**事实**：当前战斗887/887（63文件）、当前neutral生成包25/25、四套构建（651输入、34输出、0外部导入）通过。当前物理族本地TCP共220次：保留源码164、新源码20、生成20、实际页面16；16条桌面/触屏流程、84张截图，页面错误/警告/外联均为0。879个源码/模型/测试/对端输入稳定，含55个Python对端。未重跑全仓或历史生成套件。

**事实**：原435000只给72读取嵌套记录，且不把嵌套目标本身标成依赖（护卫会标记）；424310运行时同时处理72/113。保留原解析边界：113嵌套的4480组队列/104条轨迹仅为运行时命令夹具；可经真实前置解析的部分为4640组队列/157条轨迹。真实TCP/页面只验证72嵌套及113无嵌套，不将113嵌套标成协议兼容。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：自身结算进入跨平台核心

**事实**：固定37c4旧样本的266正变体2已接入“保存最后一条自身记录→独立216结果”共享核心；通用正变体可解析并忽略自身护卫标量。原有网页、移动网页、微信薄适配沿用同一核心，未增加Swift/AppKit功能。

61个当前shared/web战斗文件共862项单次全绿；当前生成包27项通过；四套构建643输入/34输出身份一致、无外部导入。当前物理族203次本机TCP：既有源码142、新源码22、生成22、实际页面17。17条桌面/触屏流程、89张截图，页面错误/警告/外联均为0；865个源码/模型/测试/对端输入稳定，含54个Python对端。未重跑全仓或历史486项生成套件。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](analysis/game-battle-self-physical-v1/source-check.json)、[源修正](analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：正变体结果进入跨平台核心

**事实**：固定37c4样本的27类正变体1/2/3接入字面E000结果动作与119/120/121实际完成，包含目标HP、RID归属、组合位、单弹/多目标返回及回合/离场。非自身目标的10/1000/200位按原始生产者作为普通标志处理，不套用pair护卫/113脚本。

**事实**：正变体结果与直接body14不同。body16/21在8000跳过HP、4000对实际目标HP做signed32加法并仅按maxHP上限截断、2000只抑制数值并释放目标，不在该回调扣攻击者HP；class6正变体也使用HP而非MP。RID仍独立按2000位写真实principal身体，不能写匿名投射物。单弹掩码为7e000/48000/24000/12000，多目标为e000/8000/4000/2000；skip→heal→suppress有先后。6000组合仍显示style5治疗数字；单弹30000与多目标30000保留各自源行为。

59个当前shared/web战斗测试文件共835项单次全绿，当前生成包33项通过；四套构建643输入/34输出核验通过，0external。当前物理族189次本机TCP（既有源码115、新结果源码27、生成27、页面20），20条实际桌面/触屏流程、104张截图，页面错误/警告/外联均为0。853个源码/模型/测试/对端输入身份稳定，包含53个Python对端。本轮未重跑全仓或历史486项生成包全套。

**待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。

[需求计划](analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：物理结果路由与源逻辑修正

**事实**：固定37c4样本的20类有限pair/variant0路径接入E000反射、治疗、跳过，真实119/120/121效果完成、HP/MP、护卫、RID、tuple游标及回合/离场所有权进入shared跨平台核心。值优先级为8000→4000→2000；producer及RID独立判断2000，保留组合位的源行为。

57个当前shared/web战斗测试文件共802项通过，当前生成包27项通过；四套构建643输入/34输出身份核验通过。当前物理族150次本机TCP执行（既有源码94、新结果源码21、生成21、页面14）。14条真实桌面/触屏流程、74张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。

**事实／修正**：native1004是afterImageEnabled，1000是残影计数器，FD4才是attackFinishCounter；73/74、defense100和positive105现使用正确字段，8优先于100。266首段应使用205，level9使用147→73及源74清理；205每次回调恰调用一次rand并选择1adb4..7烟尘。共同body尾部生成冻结副本，队列重置清FD4但保留1004/1000。此结论更新stage204～208相关旧字段/266描述；历史本地绿色测试不构成原生等价证明。精确修改前3275文件副本与历史源核验均保留；12组旧模型重新生成，仅5个预期文件改变，所有旧场景输入、资源字节及geometry不变。

**待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。

[需求计划](analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](analysis/game-battle-physical-results-v1/source-check.json)、[源修正](analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：护卫、连续记录与蓄力

**事实**：固定37c4样本的20类已支持pair路径接入三角色护卫、连续0x1010 look-ahead和113状态的0/3蓄力；护卫者承担真实结果，被保护者保留受击移动。RID与三字tuple保留原有第四字，113按源逻辑冻结自身与当前tuple目标。

当前55个shared/web战斗测试文件共775项通过；当前生成包17项通过；四套构建639输入/34输出身份核验通过。当前物理族117次本机TCP执行（既有源码81、新护卫源码13、生成13、页面10）。10条实际桌面/触屏流程、54张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。

**待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。

[需求计划](analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：物理技能叠图、平铺与源修正

**事实**：固定37c4样本的258类variant1/3已接入71b1（最高等级71b2）瞬时叠图，variant2保留无叠图分支；258/259/266正变体最高等级240平铺前缀、259最高等级直接路径及命中平铺进入shared核心。瞬时图复制当次世界坐标，不跟随父节点。

2243项源码测试通过（188文件）；486项当前生成包检查单次全绿（479 neutral API、7 App/Page）。四套构建631输入/34输出身份核对通过，无外部导入。物理族177次本机TCP执行（源码81、生成81、真实页面15）；14种桌面/触屏流程共15次执行、80张独立截图，页面错误/警告/外联均为0。

**待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。

[需求计划](analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：物理技能发射路径进入跨平台核心

**事实**：基于固定37c4样本，实现25个generic选择器及独立73类的有限variant1/2/3发射路径：真实动画probe、单弹、多目标回收、连续发射和28反应；73不使用generic耗蓝前缀。95/105/110前缀与6/84/85/87的正变体HP结果保留各自源规则。公共消息工厂改为当次世界浮点坐标，修复95移动后仍取旧屏幕缓存的问题。

2223项源码全量测试通过（186文件）。生成包全量运行469项，3项因验收器跨realm数组原型比较失败；只修正测试比较后，4项相关检查复跑通过，469个不同检查均有通过证据，原失败运行保留，未称单次全绿。四套构建的623输入/34输出身份一致；物理族161次本机TCP执行（源码69、生成69、页面23）完成，页面21种桌面/触屏流程、105张独立截图，错误/警告/外联均为0。

**待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。

[需求计划](analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：修正共享烟雾随机数，继续物理消费者分析

**事实**：本轮依据固定37c4样本的41f310/41f2d0，修正公共26/160反应烟雾：使用身体当次移动前世界坐标、无父链接、不消耗模型随机数；12/13逃跑烟雾沿用独立随机工厂。没有新增正变体或特殊技能可用范围。

**事实**：REA6.7.0/Ghidra12.1.4新增14规范函数（2991B），分层总数742；21个原件范围5189B逐字节吻合，有限Evidence并集2445（新增58），当前154条快照已关闭、cleanup=false。421f90/41a660在独立分析副本恢复为219/224B派生回调，不计规范函数，原件未改未运行。

全量2194项源码测试（184文件）、440项生成检查（433 neutral＋7 App/Page）、四套构建通过；615输入和34输出身份一致。108条本机OS TCP流程及18条实际桌面/触屏页面流程通过，92截图逐个hash，页面错误/警告/外联均为0。新增源码与生成回归各1项；本轮没有新增TCP场景。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：普通物理公共族接入直接结果路径

已接入20类的有限pair/variant0直接结果（259的level9除外），保留29类选择器；MP6、84/85/87不扣HP、首击/后续actor、状态/RID、81额外回复、258移动和真实等待/结束拥有者分别处理。旧`planBattleStrike`/`queueStrike`仍是0/1/3有限接口，实际游戏公共族命令走新`queuePhysicalFamily`。

本轮2193项Node测试/183文件、439项生成检查（432 neutral+7 App/Page）、四套构建615输入/34输出均通过。独立15995队列、75场景、17488完整建模状态、2358完整RGBA帧（双selector）；108条实际本地TCP流程验证540次正常启动请求、553包技能、110次查询、113条S、101次退出及202次战后移动。实际game.html桌面/触屏18流程、92截图，Chrome156.0.8078.80/Playwright1.64.1，页面错误/警告/外部请求均0。

正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：公共物理分派族的来源分析继续

继续补齐普通物理公共族的类别、变体、护卫/反向结果和投射物拥有者，未新增游戏流程。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增10规范函数3679B及44B常量核原件，重核公共生产者8618B、身体/构造67615B及分派器54685B指令。规范函数由718到728；本次95记录含54复用/41新增，有限快照并集由2346到2387，不能把规范缓存算成完整Evidence。45个旧大快照核完整哈希和身份并沿用逐对象JSON证明，另解析29/42/54三个小快照。会话已关闭、cleanup=false。

本轮新运行源码测试0、生成检查0、页面流程0；运行模块/导出/适配器/测试及native/vendor未改。已复核stage202构建607输入/34输出和日志身份；此前2142项Node、393生成检查、15页面流程是历史验收基线，本轮未重跑，未重复累计。只运行并通过当前来源核验脚本。

本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：82类位移、放大、资源变更与震动

共享核心已接入固定样本82类十等级消费者：双方不同中点、真实蓄力/移动、逐次float32放大转向、冲击、资源元组与骑乘/附件变更、目标数字/HP和背景震动。本地244停止、非本地删除后的回合/下一C/普通返回均沿现有真实拥有者执行。

新增48项，全量181文件2142项Node通过。四套当前构建核607输入/34输出身份、0external；393生成检查（386neutral/7App/Page）通过。独立1463队列、63场景16706完整建模状态和2404完整RGBA帧（两选择器）一致；47源停止、15身体结束与1空目标未证边界分开。97条最终真实本机TCP（41来源/41生成/15实际页面）核485启动、498技能包、99自动查询、102个S请求、90返回/180移动。81次独立截图、53个不同图像文件哈希位于源码外，均为原创合成资源；浏览器0错误/警告/外部请求。

82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](analysis/game-battle-skill82-v1/source-check.json)、[验证修正](analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](analysis/game-battle-skill82-v1/test-results.json)、[TCP](analysis/game-battle-skill82-v1/network-validation.json)、[页面](analysis/game-battle-skill82-v1/browser-validation.json)、[验收](analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：移动技能、残影与真实停止返回

共享核心已接入固定样本83类十等级移动数值技能：整数中点移动、实际接近目标后激活、数字与HP回调、12次访问的冻结残影。已有技能页面和S/M链路支持本地244停止自动返回，以及非本地删除后的普通回合/下一C/返回。

新增33项、全量179文件2094项Node通过。四套当前构建覆盖599输入/34输出身份，0external；生成验收共351项（344neutral/7App/Page），由326既有、24新TCP及1修正后的队列检查构成，初始验证脚本错误与重测日志单独保留。独立939队列含737支持/202明确拒绝边界；59场景核9387完整状态和1828完整RGBA帧（两选择器），区分31源停止、22身体结束、4特殊槽身体等待和2未证边界；phase2未交接4例，其中3已被源停止抢先结束、1仍在等待。最终61条真实本机TCP（24来源/24生成/13实际页面）核305启动、318技能包、63自动查询、66个S请求、48返回/96移动。69次独立截图、46个不同图像文件哈希在源码外，均为原创合成资源。浏览器0错误/0外部请求；3条Canvas读回性能提示来自验证器反复读像素，无其他警告。

非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：数值与治疗技能接入实际游戏链路

共享核心已加入固定样本SKL61..63十等级的已证数值/治疗切面：普通与特殊目标、效果完成、数字/生命值、反射交接、KO以及下一C/普通返回。输入沿已有技能页面发送S，返回M和真实回调拥有费用与数值；不乐观扣蓝。

35新增/2061全量Node、四套构建/326生成检查（319neutral/7App/Page）通过；595输入/34输出身份一致，0external。独立3类十等级、2317队列、157场景16447完整状态、3250完整RGBA帧（两选择器）一致；154场景身体结束、151场景命令结束，6个源phase2等待单独保留。71条最终验收用真实本机TCP（28来源/28生成/15实际页面），核355启动、368技能包、73自动查询、76个S请求、60正常返回/120移动；初始观察不重复计入。78次独立截图在源码外，对应43个不同图像文件哈希；均为原创合成资源，浏览器0错误/0警告/0外部请求。

共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：状态与辅助技能接入实际游戏链路

共享核心已加入SKL32..60、64..68、86、88共36类十等级的已证状态/辅助切面：不同元组布局、咏唱后的目标激活、状态图标/覆盖效果、32/128粒子完成、管理器效果与下一C保留/更新/清除。现有技能页面直接驱动真实S/M与回合返回；原生特殊行为按源保留，不添加伤害字段或乐观费用。

59新增/2026全量Node、四套构建/297生成检查（290neutral/7App/Page）通过；587输入/34输出身份一致，0external。独立36类十等级、2912队列、416场景12775状态、6384完整RGBA帧（两选择器）一致。115条最终验收用真实本机TCP（51来源/51生成/13实际页面），核575启动、591技能包、117自动查询、123个S请求、109正常返回/218移动；初始观察不重复计入。71张原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](analysis/game-battle-status-skills-v1/test-results.json)、[TCP](analysis/game-battle-status-skills-v1/network-validation.json)、[页面](analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：已有技能入口接入施法与结算

网页、移动网页和微信薄适配共用的核心已加入固定样本SKL19..31十等级的已证切面：真实施术者队列、咏唱/投射物、目标/反射、服务器MP费用、动画或几何触发的HP/KO、下一C与正常返回。现有技能页面直接驱动这些消费者。自身31未知游标在修改队列/MP前明确拒绝；没有用物理攻击替代施法。

38新增/1967全量Node、四套构建/245生成检查（238neutral/7App/Page）通过；579输入/34输出身份一致，0external。独立4686队列、213回调场景25917状态、6078完整RGBA帧（两呈现选择器）、294寻向和180个有符号CRT边界通过。60新真实本机TCP含10实际网页鼠标/触摸流程，核300启动、313技能包、2个1101标签包、62自动查询、65个S请求、53次正常返回/106移动；52张验收用独立原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](analysis/game-battle-casting-v1/implementation-plan.json)、[规格](analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](analysis/game-battle-casting-v1/test-results.json)、[TCP](analysis/game-battle-casting-v1/network-validation.json)、[页面](analysis/game-battle-casting-v1/browser-validation.json)、[验收](analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：人物技能接收、等级与真实S行动链路

共享核心和实际游戏页面已接入人物技能/等级/目标选择。技能列表来自实际J<=/JUA接收记录，按P2与当前身体MP/等级可用标记禁用条目，支持返回、关闭和重选；发送精确S请求时不乐观扣蓝，后续实际M/SKL回调才按服务器数值结算。下一C保留普通命令2记忆，完成回合后按已有源路径返回场景并恢复移动。

31新增/1929全量Node、四构建/218生成检查（211neutral/7App/Page）通过；571输入/34输出身份一致，0external。45独立完整接收状态、14输入场景781状态、110个有符号MP计算边界通过。32新真实本机TCP含6实际页面，核160启动、177技能接收包、34自动查询及37个S请求；25次正常返回、25退出/50移动，27张原创夹具截图在源码外。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增10规范函数2175B；19个独立播种回调6651B、1032B常量及既有4260b0分派器54685B指令核原PE。累计705规范函数/2338记录并集；当前48记录含3复用/45新增，42个历史快照核身份，会话已关闭。48记录快照不是完整并集。

本次闭合人物主指令入口与已有实际物理SKL消费者；命令3是道具I，不能称为魔法入口。其他魔法/技能分支不借用物理结果，类19仍明确等待。完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](analysis/game-battle-player-skills-v1/source-check.json)、[测试](analysis/game-battle-player-skills-v1/test-results.json)、[TCP](analysis/game-battle-player-skills-v1/network-validation.json)、[页面](analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](analysis/game-battle-player-skills-v1/goal-audit.json)。

[本轮交付审计](analysis/game-battle-player-skills-v1/delivery-audit.json)、[累计清单stage197](analysis/delivery-manifest-stage197.json)。


<a id="stage196"></a>

## stage196：普通换宠、MON队列与呈现缓冲已接入

共享核心与网页/触屏现在支持普通指令中的“更换宠物”：按真实接收模式与缓存HP选择或收回，仅发送M请求；MON再驱动召回、创建/复用角色、名称/数值更新、动画信号、51次f32缩放及真实删除。下一C才更新出战索引，跨回合记忆和W输入保持源规则。呈现缓冲与图形配置已分开，实际Canvas呈现才翻转；缩放采样为明确的独立point策略，尚不等于原DDRAW/D3D像素。

51新增/1898全量Node、四构建/203生成检查（196neutral/7App/Page）通过；567输入/34输出身份一致，0external。16独立MON场景1864状态、13输入场景673状态、240独立缩放策略像素用例通过；MON同时核两呈现选择器，共3628个像素结果，100个alternate未支持结果。32新真实本机TCP含6实际页面，核160启动、210宠物接收包、42输入（27 M|1、8 M|FF、3 W|FF、4 N）、25退出/50移动及25次正常返回；25张独立原创夹具截图在源码外。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增4规范函数647B；独立播种回调1745B、既有4260b0分派器54685B指令及320B不重复常量核原PE。累计695规范函数/2293记录并集；本次31记录中2条复用、29条新增，会话已关闭，31记录快照不代表完整并集。

本节更新stage195的普通换宠/MON缺口，并纠正早期未配置49动作错误落入50的行为；保留所有早期历史证据。完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](analysis/game-battle-pet-transition-v1/source-check.json)、[测试](analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](analysis/game-battle-pet-transition-v1/goal-audit.json)。

[本轮交付审计](analysis/game-battle-pet-transition-v1/delivery-audit.json)、[累计清单stage196](analysis/delivery-manifest-stage196.json)。


<a id="stage195"></a>

## stage195：真实接收的宠物技能、骑乘输入与网页操作已接入

共享核心现在接收实际FBY/G:w/J_J宠物数据，并由P参数、当前身体MP与真实13b4骑乘子对象驱动技能、目标、重选、待机和超时。骑乘回合保留两次选择，普通宠物回合使用配对身体；网页/移动触摸经过实际菜单和网络发送，下一C、正常返回与恢复移动均已核验。

36新增/1847全量Node、四构建/173生成检查（166neutral/7App/Page）通过；555输入/34输出身份一致，0external。15独立场景833输入状态、53完整接收记录状态通过。38新真实本机TCP含6实际页面，核190启动、120宠物接收包、86输入（34 W|FF、28 W|0|A、5 W|1|0、3 W|2|29、10 G、6 N）、31退出/62移动与31次正常返回；24张独立原创夹具截图在源码外。

固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增6规范函数2770B及20B常量核原PE，重核721B已播种回调；累计691规范函数/2264记录并集，新快照24记录，会话已关闭。

本节更新stage194中的当前操作者骑乘输入缺口；保留该阶段及更早的历史证据。完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](analysis/game-battle-mounted-input-v1/source-check.json)、[测试](analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](analysis/game-battle-mounted-input-v1/goal-audit.json)。

[本轮交付审计](analysis/game-battle-mounted-input-v1/delivery-audit.json)、[累计清单stage195](analysis/delivery-manifest-stage195.json)。


<a id="stage194"></a>

## stage194：CBC真实数值和骑乘/附着对象已接入，完整游戏继续开发

共享核心已能立即执行普通CBC：更新当前资源和四个HP/MP数值，按原逻辑创建、更新或移除骑乘/附着子对象。父身体驱动真实子动画、坐标、深度排序与生命周期；原C记录和待用装备资源保持各自所有权。实际网页可显示本轮值、接收下一C并正常返回移动。

50新增/1811全量Node、四构建/157生成检查（150neutral/7App/Page）通过；551输入/34输出身份一致，0external。32独立场景1010状态/完整640×480RGBA通过；36新真实TCP含8实际页面，核180启动、39输入（36个G/3个H|A）、27退出/54移动、27次正常返回。24张原创夹具截图在源码外。

REA新增6规范函数、1433B辅助与32B独立回调均核原件，累计685函数/2240记录并集；新快照18记录，已关闭会话。当前操作者骑乘输入仍明确依赖原生菜单；已验收对手骑乘CBC，未绕过该依赖。

完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](analysis/game-battle-character-change-v1/source-check.json)、[规格](analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](analysis/game-battle-character-change-v1/test-results.json)、[TCP](analysis/game-battle-character-change-v1/network-validation.json)、[验收](analysis/game-battle-character-change-v1/validation.json)、[剩余目标](analysis/game-battle-character-change-v1/goal-audit.json)。

[本轮交付审计](analysis/game-battle-character-change-v1/delivery-audit.json)、[累计清单stage194](analysis/delivery-manifest-stage194.json)。

<a id="stage193"></a>

## stage193：换位、装备资源更新与混合动作朝向已接通，完整游戏继续开发

共享核心已接通普通POS换位：身体、名字与“你”的当前操作者一起移动，服务器P参数保留到下一次C再应用。EQU按真实回调切换资源；物理动作后接PSN会恢复源角度。网页沿既有真实控件显示当前对象与数值，并能结束战斗、返回场景移动。

70新增/1761全量Node、四构建/142生成检查、31条新真实OS TCP（含7次实际网页）通过；50场景1917状态与完整RGBA独立比对通过。复用679规范函数/2222记录并集，本轮0新REA查询，固定原件哈希不变。21张原创夹具截图在源码外。实际两轮流程暴露本地桥10秒上限，现可显式配置1..60000ms，本轮采用30000ms；默认仍10000ms，超时清理另验。

完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](analysis/game-battle-change-v1/implementation-plan.json)、[源核验](analysis/game-battle-change-v1/source-check.json)、[规格](analysis/game-battle-change-v1/implementation-spec.json)、[测试](analysis/game-battle-change-v1/test-results.json)、[TCP](analysis/game-battle-change-v1/network-validation.json)、[验收](analysis/game-battle-change-v1/validation.json)、[剩余目标](analysis/game-battle-change-v1/goal-audit.json)。

[本轮交付审计](analysis/game-battle-change-v1/delivery-audit.json)、[累计清单stage193](analysis/delivery-manifest-stage193.json)。

<a id="stage192"></a>

## stage192：网页已能显示真实PSN结算，完整游戏继续开发

已接入普通PSN的扣血、回血和扣魔：数值来自真实C与源回调，包含三种数字字型、十级回血等待和KO控制；新C覆盖旧值。像素读取取消后的重试不会重复结算，正常结束后继续返回场景移动。

38新增/1691全量Node、四构建/129生成检查通过；29条新真实OS TCP含7次实际产品页面流程，独立735整数边界及21场景2152状态/完整RGBA比对通过。新增4个REA规范函数，累计679函数/2222记录为跨既有证据的并集；原件哈希不变。20张原创夹具截图保留在源码外。

完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](analysis/game-battle-status-v1/implementation-plan.json)、[源核验](analysis/game-battle-status-v1/source-check.json)、[规格](analysis/game-battle-status-v1/implementation-spec.json)、[测试](analysis/game-battle-status-v1/test-results.json)、[TCP](analysis/game-battle-status-v1/network-validation.json)、[验收](analysis/game-battle-status-v1/validation.json)、[剩余目标](analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：网页已接入基础战斗画面和操作，完整游戏继续开发

实际game.html已接入已证实的战斗核心：显示完整640×480画面，提供攻击、防御、换位请求、逃跑和真实可选目标，显示C/动画驱动的HP、MP与倒计时。服务器实际C/M及退出返回驱动界面；返回后恢复普通场景原有尺寸和移动。未支持动作会停住说明，不伪造回合完成。

3新增/1653全量Node、四构建/117生成检查通过。14次实际页面流程（含2次独立Canvas像素核验）、7次普通页面回归及2次修改前基线通过；9个独立完整位图参考、45张原创夹具截图保留。手机为Chrome触屏仿真，真实手机的资源选择/网络与设备、完整技能/其他玩法和原生微信/现行/官方兼容仍未完成，整体active。[开发记录](reports/development-plan.md#stage191)、[验收](analysis/game-battle-web-v1/validation.json)、[交付审计](analysis/game-battle-web-v1/delivery-audit.json)、[累计清单](analysis/delivery-manifest-stage191.json)。

<a id="stage190"></a>

## stage190：普通物理攻击已接通，完整战斗继续开发

共享客户端已能执行固定旧样本中普通物理类SKL：蓄力、扣MP、接近、命中、HP变化、暴击/闪避、多段与反击，以及真实倒地效果。伤害由实际动画信号触发，倒地等待50个粒子各自完成；随后可正常结束回合、接收服务器新C数据并返回地图移动。

33新增/1650全量Node、四构建/115生成检查通过；13组3137独立动作状态及完整RGBA一致，28新本机TCP核对10726战斗/返回帧、1144普通帧与44准确移动请求。其他技能/动作、产品战斗页面、原生微信和设备、现行/官方兼容仍未完成，整体active。[开发记录](reports/development-plan.md#stage190)、[验收](analysis/game-battle-skill-v1/validation.json)、[交付审计](analysis/game-battle-skill-v1/delivery-audit.json)、[累计清单](analysis/delivery-manifest-stage190.json)。

<a id="stage189"></a>

## stage189：普通战斗返回已接通，可恢复移动，完整游戏继续开发

共享客户端已接通普通来源分支的战斗返回：清理旧角色、等待、按实际资料重建、捕获场景、淡入，普通首帧成功生成后建立新的运行循环并恢复输入。进入战斗时清空远端记录，退出后接收的新记录才是返回依据。

18新增/1617 Node、四构建/101生成检查通过；22新本机TCP流程核对5390战斗/返回帧、936返回后普通帧、1004独立淡入RGBA，以及36准确移动请求。完整技能/其他动作、产品战斗页面、设备和现行/官方兼容仍未完成，整体active。[开发记录](reports/development-plan.md#stage189)、[验收](analysis/game-battle-return-v1/validation.json)、[交付审计](analysis/game-battle-return-v1/delivery-audit.json)、[累计清单](analysis/delivery-manifest-stage189.json)。

<a id="stage188"></a>

## stage188：战斗退出渐变与源请求已接通，普通场景返回继续开发

共享客户端已能捕获实际战斗画面，推进普通分支的7/8清理和退出渐变，并按源发送一次$!~、int32参数0；达到主状态9/1后继续保持待返回，普通场景重建尚未实现。真实确认消息也已按拥有者当前主状态处理。

18新增/1599 Node、四构建/89生成检查和22新OS TCP通过；1008次独立退出RGBA比较、16准确退出请求核对通过。完整普通返回、SKL/其他动作、产品战斗页面和原生微信等仍在开发，整体active。[开发记录](reports/development-plan.md#stage188)、[验收](analysis/game-battle-exit-v1/validation.json)、[交付审计](analysis/game-battle-exit-v1/delivery-audit.json)、[累计清单](analysis/delivery-manifest-stage188.json)。

<a id="stage187"></a>

## stage187：M消费和回合反馈已接入共享客户端，完整战斗继续开发

配置共享客户端的战斗loop后，真实M会在源phase5绘制之后取出，phase6运行既有已移植命令和身体回调，实际结束才增加轮次、返回2并消费下一轮C。PNO动作队列/动画、ACT、轮次回绕和下一轮A确认已核验；未实现SKL保持明确缺口。

16新增/1581 Node、四构建/77生成检查和18新OS TCP通过；两侧共2518资源帧、30准确输入请求。退出7/8/9及地图返回、完整SKL/其他动作、产品战斗页面和微信原生平台仍未完成；整体active。[开发记录](reports/development-plan.md#stage187)、[验收](analysis/game-battle-loop-v1/validation.json)、[交付审计](analysis/game-battle-loop-v1/delivery-audit.json)、[累计清单](analysis/delivery-manifest-stage187.json)。

<a id="stage186"></a>

## stage186：基础战斗输入已接入共享客户端，完整游戏仍在开发

入场之后已能推进源phase4的基础命令、目标选择、连续行动和超时，并通过真实session发送源$T5字节请求；菜单滑入/收起由源速度和状态决定，取消像素读取不会重发已排队命令。当前是共享核心的语义输入接口，网页战斗控件、原生命中和完整菜单图像尚未接入。

19新增/1565 Node、四构建/67生成检查通过；240目标掩码、180目标编码、10场景392输入步骤及26新OS TCP/42输入请求核对通过。M5/6执行、退出返回、技能/道具/宠物/坐骑等完整输入与其他玩法、微信原生gamePage/设备和现行/官方兼容仍未完成；整体active。[开发进度](reports/development-plan.md#stage186)、[验收](analysis/game-battle-input-v1/validation.json)、[交付审计](analysis/game-battle-input-v1/delivery-audit.json)、[累计清单](analysis/delivery-manifest-stage186.json)。

<a id="stage185"></a>

## stage185：核心已接入入场渐变与自动C调度，完整战斗仍在开发

共享核心及实际client入口现按源main10的0/1渐变、2绘图后消费C、3绘图后检查入场推进，并在4等待尚未实现的输入；M保持排队。真正背景资源捕获、逐行位移、暂停取消后的像素重试、旧场景读取交接和再次入场已接入；没有注入完成布尔或固定等待时长。

19新增/1546 Node、四构建/53生成检查通过；54次渐变/25920行状态、12场景/804完整入场像素帧及22条新实际OS TCP/1390帧核对通过。网页战斗页面、弹窗/选择/操作、后续M与退出返回、完整其他玩法和微信原生gamePage/设备仍未完成；现行/官方兼容未验收，无测试账号，整体目标active。[开发进度](reports/development-plan.md#stage185)、[验收](analysis/game-battle-entry-v1/validation.json)、[交付审计](analysis/game-battle-entry-v1/delivery-audit.json)、[累计清单](analysis/delivery-manifest-stage185.json)。

<a id="stage184"></a>

## stage184：基础战斗像素链已接客户端，完整战斗仍在开发

已把自有body/子对象的源排序、可见性、调色板/翻转和背景资源投影接入共享核心与实际客户端的渲染任务。1835个独立完整像素帧一致，159个缩放/混色样式帧明确未支持；新增10条实际本地OS TCP验证422帧及暂停/取消/关闭/读失败。13新增/1527 Node、四构建、41生成检查通过。

这是显式基础frame端口；网页战斗画面、自动main10/渐变/C/M、完整动作、输入与退出返回仍未完成。客户端保持battle-pending，未把局部像素验收标成游戏可玩。微信原生gamePage/设备、现行与官方兼容仍未验收，无测试账号；0新VM/原程序/官方会话。[开发进度](reports/development-plan.md#stage184)、[验收](analysis/game-battle-scene-v1/validation.json)、[交付审计](analysis/game-battle-scene-v1/delivery-audit.json)、[累计清单](analysis/delivery-manifest-stage184.json)。

<a id="stage183"></a>

## stage183：基础战斗动作回调接入真实动画与运动（2026-11-04，整体仍在开发）

共享核心已接入23个基础body type分支的限定行为，使用真实拥有的动画目录、源三角查表、位置/计数/队列和五类子效果回调。命令、body和busy完成状态相互反馈；新增ACT指示对象处理，角色逃出时按源规则保留脱离全局槽的对象。客户端可借用自己资源库配置并显式推进回调，不再用假定时器清busy。

本轮19项新增/1514项全量Node、四个新构建及35项生成包检查通过；20组1994步原创独立状态/动画元数据轨迹、14条新增真实本地OS TCP/1238次回调核验通过。完整战斗主循环、画面、输入与退出返回仍未完成，客户端仍为battle-pending；原生微信游戏Page/设备、现行/官方兼容仍未验收。

原始目标及战斗阶段保持active、phase_complete=false。[开发进度](reports/development-plan.md#stage183)、[本轮验收](analysis/game-battle-body-v1/validation.json)、[交付清单](analysis/delivery-manifest-stage183.json)。

<a id="stage182"></a>

## stage182：接入战斗命令调度与动作队列（2026-11-04，战斗仍在开发）

固定旧样本37c4的32槽命令调度、依赖冲突/合并、延迟、回收及C角色拥有的动作队列已进入共享核心。ESC/CLR/SUP/ANR/PUE/PNO/PDN可构造有源队列并等待真实拥有的busy/位置状态；END只请求退出状态7，普通M耗尽等待后请求状态2。通过显式world函数调用验证，不自动运行尚缺的main10驱动或人物动作回调。

本轮21项新增、1495项全量Node、四个新构建及28项生成包检查通过；6条新增实际本地OS TCP覆盖源模块/生成API的队列、END、耗尽三路。REA新增27记录/10规范函数，575→585，1次已知函数复查单列；会话已保存关闭。

完整战斗动作、画面、输入、退出返回及其他完整玩法仍未完成，微信原生游戏Page/设备和现行/官方兼容仍未验收。原战斗阶段及整体目标继续active，phase_complete=false。详见[开发进度](reports/development-plan.md#stage182)、[本轮验收](analysis/game-battle-commands-v1/validation.json)与[累积交付清单](analysis/delivery-manifest-stage182.json)。

<a id="stage181"></a>

## stage181：M动作预处理与回调静态分析能力已补齐（2026-11-04）

M的24类token、字段消费、22槽字节计数/掩码、principal及groupAdvance、SKL类别/状态分支、55条顺序别名与可选RID前看已独立实现。新增共享字节/字段读取器保留C原行为；显式world.copyBattleMotionPlan返回自有预处理结果，不消费环、不运行main10或动作回调。32个原生对象槽是并发容量，4095B包内1023条短命令已验证。

默认未识别的4365d0/4260b0/4198d0在独立分析副本补建入口，导出682/54685/96B；另435000仍报告28B。四体55491指令字节全部等于原件，属于分析者播种的派生边界，不计入24个规范REA函数。435000另以461B原始范围和LLVM21核对所有非调用分支闭合，未宣称修好provider边界。

11项新增/1474项全量Node通过；582条原创独立用例覆盖24token、131个SKL类别和55别名，另验RID回退、原始槽区别、字节计数回绕与1023命令边界。源模块/中立生成API各2条实际OS TCP，共4新路径，核正常五请求、M字段/名字/依赖一致、环未消费及关闭。18neutral/7生成检查和四构建通过；三App各126输入11输出，API101输入，0external。

[源证据](analysis/game-battle-runtime-v1/source-check.json)、[规格](analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](analysis/game-battle-runtime-v1/test-results.json)、[TCP](analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](analysis/game-battle-runtime-v1/validation.json)、[完整目标](analysis/game-battle-runtime-v1/goal-audit.json)。 [需求索引](reports/requirements-index.md)、[开发计划](reports/development-plan.md#stage181)、[交付清单](analysis/delivery-manifest-stage181.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：战斗消息与角色记录已接入，战斗阶段仍进行中（2026-11-04）

真正的战斗分派为main10→437b30，不是普通场景main9的250..252。现已把>HY/4f3430普通入场、?+e/4f36d0的C/P/A/M/U分支、两个四槽环、P/A部分字段保留和显式C角色记录消费接入共享核心与world。真实客户端收到入场后关闭旧地图runtime、保持session接收，网页/移动网页隐藏旧地图、禁用普通操作并显示“已收到战斗数据，战斗画面尚不可用，连接保持”。

17项新增/1463项全量Node通过。原创独立240条C消息/820记录/7数字边界与22槽源表核对；源模块与中立生成API各2条实际OS TCP，共4条，验证正常五请求、实际入场/队列/显式消费/回绕与关闭，没有战斗图像或动作执行验收。16neutral/7生成检查、四构建通过；三App各123输入11输出，API98输入，均0external。 Chrome156.0.8078.80/Playwright1.64.1实测桌面1100×850和触屏390×844两条game.html流程，真实Files/正常人物升级选择/入场/持续收包/断开通过，6张原尺寸截图全部复核，0应用错误、警告、外部请求和横向溢出。Browser插件缺席，复用现有Playwright。stage179的15浏览器流程证据保留，本轮未重跑，不能合计为本轮17条。

[源证据](analysis/game-battle-transition-v1/source-check.json)、[规格](analysis/game-battle-transition-v1/implementation-spec.json)、[测试](analysis/game-battle-transition-v1/test-results.json)、[TCP](analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](analysis/game-battle-transition-v1/validation.json)、[完整目标](analysis/game-battle-transition-v1/goal-audit.json)。 [需求索引](reports/requirements-index.md)、[开发计划](reports/development-plan.md#stage180)、[交付清单](analysis/delivery-manifest-stage180.json)。

**阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：队长图标与实际组队交互已接入（2026-11-04）

实际人物aux04队长/模式图标按源规则创建、重建、移除和推进：创建当帧无动画/绘制，保留帧用当前偏移/原点与人物高度，NULL样式固定palette0/flags0/白色。共享核心拥有并回收子图像。网页/移动网页新增加入/离开按钮；*Cc发本机display及1/0，Kk0仅按真实回复改源状态，HFs到达才显示已加入；离队成功自动经真实session队列发送/Re，使用target及朝向低字节符号扩展。

18新增/1446全量Node通过。独立Python覆盖960图标、5376命令、3009锚点及128完整场景/65种RGBA SHA。源模块和中立生成API各2条实际原创OS TCP，共4新路径/256帧，并核对延迟回复、精确出站字节和关闭。14neutral/7生成检查、四构建通过；三App各121输入11输出，API96输入，均0external。 Chrome156.0.8078.80/Playwright1.64.1共15桌面/触屏流程通过，75张截图经7联系表与新原尺寸图复核。实际game.html/Files/正常人物流程/按钮/暂停/关闭验证；0应用错误、警告或外部请求，4条QA Canvas读回提示单列。Browser插件缺席，使用现有Playwright；无浏览器安全覆盖。

[源证据](analysis/game-party-actions-v1/source-check.json)、[规格](analysis/game-party-actions-v1/implementation-spec.json)、[测试](analysis/game-party-actions-v1/test-results.json)、[TCP](analysis/game-party-actions-v1/network-validation.json)、[验收](analysis/game-party-actions-v1/validation.json)、[完整目标](analysis/game-party-actions-v1/goal-audit.json)。 [需求索引](reports/requirements-index.md)、[开发计划](reports/development-plan.md#stage179)、[交付清单](analysis/delivery-manifest-stage179.json)。

完整队伍控制/其他快捷键/modal、战斗/宠物/特效/复合转场、其余纠偏/输入/reset/生产启动/资源/玩法、微信原生gamePage和设备、现行及官方兼容仍未完成。无真实测试账号。完整目标active，本轮无VM/CUA/WER/CDB/原程序/账号/官方操作；stage131已执行恢复的诊断不重放。


<a id="stage178"></a>

## stage178：队伍输入和普通跟随已接入（2026-11-04）

实际HFs/进入初始化的队伍mode与本机primary标志已驱动pointer、localMovement、world/runtime和client；队长普通寻路向第一队员送旧显示格，队员按紧凑有效槽位队列依次跟随。移除成员按461f40的slot0队列/对齐/前驱距离门限级联旧target；会员200位抑制普通人物重复步进。

16项新增、1428项全量Node通过；160距离用例、11个队列长度/速率、16分支组合及3场景224帧完整图像/195种RGBA SHA通过。源模块与实际中立API各3条原创OS TCP，共6条/448帧，独立peer核对队长两条源移动命令、队员零自主命令和关闭归属。12neutral/7生成检查通过；三App各120输入11输出、API95输入，均0external。 13个Chrome156.0.8078.80桌面/触屏流程通过；新2条实际game.html路径含正常选人/升级、实际Files、队员点击禁自主路径、收到解散、暂停/继续/关闭。65张唯一截图经6联系表复核，新桌面/手机跟随图另读原尺寸；0应用错误/警告/外部请求，4条旧QA Canvas读回提示单列。

[源证据](analysis/game-party-follow-v1/source-check.json)、[合同](analysis/game-party-follow-v1/implementation-spec.json)、[测试](analysis/game-party-follow-v1/test-results.json)、[网络](analysis/game-party-follow-v1/network-validation.json)、[验收](analysis/game-party-follow-v1/validation.json)、[完整目标](analysis/game-party-follow-v1/goal-audit.json)。 [开发计划](reports/development-plan.md#stage178)、[交付清单](analysis/delivery-manifest-stage178.json)。

完整队伍UI/加入离开响应、aux04队长/模式图标、战斗/宠物影子/活跃复合转场、其他文字/UI与完整纠偏/输入/reset/生产启动/玩法、微信原生gamePage及设备、现行和官方兼容仍未完成；原生x87与非法重复身体/空指针行为未复现。完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage177"></a>

## stage177：状态值条与五槽队伍记录已接入（2026-11-04）

普通人物状态值条已进入actor/world/scene/resource与网页开关：本机E(9前四槽、远端]_g最多五组四值、源32位SHL/IDIV及16位宽、零分母跳过、资源原点裁剪、中性调色板4和priority207均有来源。HFs五槽掩码记录、成员/队长标志及普通解绑/解散已接；这仍不等于完整队伍玩法。

25项新增、1412项全量Node通过；198个独立整数用例、120帧完整图像/107种SHA、12帧预解码/延迟资源相符。1001人物/3003值条全局图像与文字共用4096槽（文字存在时4095图像）的边界已验。6条实际原创TCP核460帧、每条5次既定客户端请求；9neutral/7生成检查通过。三App119输入11输出、API94输入、0external。 11个Chrome156.0.8078.80桌面/触屏流程通过，61张最终唯一截图以6张联系表及2张原尺寸复查；0应用错误/警告/外部请求，4条QA读Canvas性能提示单列。按钮实际改变状态条显示，原有中文标签、暂停、换场景与关闭继续通过。

[源证据](analysis/game-actor-vitals-v1/source-check.json)、[合同](analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](analysis/game-actor-vitals-v1/test-results.json)、[网络](analysis/game-actor-vitals-v1/network-validation.json)、[验收](analysis/game-actor-vitals-v1/validation.json)、[完整目标](analysis/game-actor-vitals-v1/goal-audit.json)。 [开发计划](reports/development-plan.md#stage177)、[交付清单](analysis/delivery-manifest-stage177.json)。入口为[游戏页](web/game.html)。

队伍跟随/本机输入上下文同步、aux04队长/模式图标、宠物影子及战斗条源、其他文字/UI、完整纠偏/输入/reset/生产启动与玩法、微信原生gamePage/设备、现行与官方兼容仍未完成。HFs已存状态尚未动态桥接f5f170/f536b2到现有显式输入上下文；完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage176"></a>

## stage176：中文姓名与标签已接入实际客户端（2026-11-04）

普通人物姓名与选中标签已进入实际actor/world/client/scene/resource链：六档显示、源字节宽度居中、font1/lane0、priority210、插入顺序/黑影、48行Hr]与E(9字段28均有静态来源。局部全局label2/3跨身体重建保留；重复根和resource1过滤不吞已排队文字，离屏/门控及state1/2/3跳过普通名字。

32项新增、1387项全量Node通过；187宽度、2304标签选择、24文字合成，共2515个独立例（含预期拒绝），120帧完整场景/96种SHA、12帧预解码/延迟精灵相符。6条实际原创TCP核460帧，标签循环不增加5次既定客户端请求；8neutral/7生成检查通过。三App118输入11输出、API93输入、0external。 11个Chrome156.0.8078.80桌面/触屏流程通过，37张唯一最终截图已查，0应用错误/警告/外部请求；4条QA读Canvas性能提示单列。网页新增显式ASCII/Windows936选择和实际标签切换按钮；宿主字体为可替代端口，未证明Windows原生GDI字形像素或线路默认编码。

[源证据](analysis/game-actor-text-v1/source-check.json)、[合同](analysis/game-actor-text-v1/implementation-spec.json)、[验收](analysis/game-actor-text-v1/validation.json)、[测试](analysis/game-actor-text-v1/test-results.json)、[网络](analysis/game-actor-text-v1/network-validation.json)、[完整目标](analysis/game-actor-text-v1/goal-audit.json)。 [开发计划](reports/development-plan.md#stage176)、[交付清单](analysis/delivery-manifest-stage176.json)。入口为[游戏网页](web/game.html)。

HP/队伍、其他文字通道/聊天/头顶气泡/aux04/菜单、完整本机纠偏/输入/reset/生产启动与中文语义、战斗及其余玩法、微信原生gamePage/设备、现行消费者和官方兼容仍未完成；整体goal active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage175"></a>

## stage175：状态动作与三类图标已接入实际客户端（2026-11-04）

已将真实45..49/63/64/99和远端40/41/42/44的状态字写入接入actor/world/frame；primary、transient、side图标按前帧偏移、人物高度、资源覆盖顺序、声音、601回调计时及type1队列绘制。源99的raw80门控同步实际指针/移动/镜头/回调；状态全局字与人物31c时长分开，重建时仅时长和自有子对象归零。

27项新增、1355项全量Node通过；546组控制、1540组图标选择/拒绝、1003组高度/旧偏移，共3089个独立例。720帧完整场景/224种SHA、12帧预解码/延迟精灵像素对比、6条实际原创TCP的1660帧一致；7neutral/7生成工程通过。四份新构建App116输入/11输出、API91输入，均0external，原生game Page仍未实现。 11个Chrome156.0.8078.80桌面/触屏流程通过，32张最终唯一截图已查看，0应用错误/警告/外部请求。4条性能提示来自QA反复读取Canvas，单列保留。浏览器只验证实时状态/遮挡/门控/暂停/场景/关闭；601次回调的精确超时由核心/TCP/neutral证明。

[源证据](analysis/game-actor-presentation-v1/source-check.json)、[合同](analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](analysis/game-actor-presentation-v1/validation.json)、[测试](analysis/game-actor-presentation-v1/test-results.json)、[网络](analysis/game-actor-presentation-v1/network-validation.json)、[开发计划](reports/development-plan.md#stage175)、[交付清单](analysis/delivery-manifest-stage175.json)。入口仍为[游戏网页](web/game.html)。

姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：60号附属对象已接入真实客户端（2026-11-04）

跨平台核心现在按固定旧版证据创建、复用和移除60号附属对象，并随人物动作/朝向和人物、坐骑动画附着点绘制。进入/退出骑乘及旋转期间暂停该动画，普通回调恢复缓存；去重、离屏、场景、暂停和关闭按各自源行为处理。

27项新增、1328项全量Node测试通过；1760组独立规则、540帧完整场景（200种SHA）、6条真实本机原创TCP路径的1300帧像素一致。预解码精灵与延迟资源绘制的12帧对比、7neutral/7生成检查、11个桌面/移动网页流程通过，18张最终截图已查看。[证据](analysis/game-actor-attachment-v1/source-check.json)、[合同](analysis/game-actor-attachment-v1/implementation-spec.json)、[验收](analysis/game-actor-attachment-v1/validation.json)、[开发计划](reports/development-plan.md#stage174)、[交付清单](analysis/delivery-manifest-stage174.json)。

固定入口仍是[游戏网页](web/game.html)。其他状态/姓名/队伍/UI消费者、完整输入/reset/生产启动/中文、战斗与剩余玩法、微信原生gamePage/设备、现行/官方兼容仍未完成，整体goal active。本轮无VM、原程序或官方账号操作。


<a id="stage173"></a>

## stage173：骑乘进入、退出和坐骑复合绘制已接入（2026-11-04）

跨平台客户端现在按固定旧版证据处理70号动作：建立坐骑子对象，按动画附着点完成进入/退出，普通骑乘使用映射后的人物动作和子层绘制。正常资源、临时人物、坐骑及转换效果分别持有；实际本机移动、80号旋转中断、换场景和关闭都有回归。

24项新增、1301项全部Node测试通过；5262组独立规则用例、110帧完整场景及6条实际原创TCP路径的380帧像素一致。6项中性环境、7项生成工程、11个桌面/手机网页流程通过；16张最终截图已查看。[证据](analysis/game-actor-ride-v1/source-check.json)、[合同](analysis/game-actor-ride-v1/implementation-spec.json)、[验收](analysis/game-actor-ride-v1/validation.json)、[开发计划](reports/development-plan.md#stage173)、[交付清单](analysis/delivery-manifest-stage173.json)。

入口仍为固定[游戏网页](web/game.html)，运行与构建见[说明](web/README.md#stage173)。完整附属60、队伍、输入/UI/reset、生产启动/中文、战斗及其余玩法、微信原生gamePage/设备、现行/官方兼容仍未完成。整项目goal保持active；本轮未运行原程序或操作VM，没有官方会话。


<a id="stage172"></a>
## stage172：80号动作的旋转、结束与恢复已接入（2026-11-04）

跨平台客户端现在按固定旧版源代码处理80号动作：进入状态3、逐帧旋转，随后探测action4是否结束并恢复普通回调。正常资源/朝向与身体临时值分别保存；结束朝向保留到真正的写入发生，换场景从正常源重建。旋转中的移动、重启、单位刷新、暂停和关闭均经过实际核心验证。

20项新增、1277项全部Node测试通过；3309组独立算术/返回值用例、400帧完整场景及6条实际原创TCP路径的1474帧像素一致。5项中性环境、7项生成工程、11个桌面/手机网页流程通过，12张最终截图已查看。[源证据](analysis/game-actor-spin-v1/source-check.json)、[合同](analysis/game-actor-spin-v1/implementation-spec.json)、[验收](analysis/game-actor-spin-v1/validation.json)、[开发计划](reports/development-plan.md#stage172)、[交付清单](analysis/delivery-manifest-stage172.json)。

继续使用固定[游戏网页](web/game.html)和[运行说明](web/README.md#stage172)。完整state1/2、骑乘/队伍/子对象、输入/UI、生产启动/中文、微信原生宿主、其余玩法和现行/官方兼容仍未完成。本轮未操作原程序或VM，没有官方会话。


<a id="stage171"></a>
## stage171：逐实体标志与普通物件裁剪已接入（2026-11-04）

跨平台客户端现在从真实单位记录和构造来源绑定各实体的类型、绘制与运动标志，保留未证实的门控输入。普通图形物件按本机坐标的包含边界±16格范围裁剪，每源帧最多记录100个“图形索引、X、Y”键以抑制重复绘制；远处对象及动画会释放，重复对象继续存活和更新。新远端角色的初始朝向直接读取场景包mode，第8项与声音上下文各有独立来源。

18项新增、1257项全部Node测试，508组独立向量、120帧混合场景，以及6条实际原创TCP路径的480帧像素核验通过。4项中性环境、7项生成工程和11个桌面/手机网页流程通过；10张最终截图已查看。四份构建均无外部导入，原生微信游戏Page仍未实现。[源证据](analysis/game-actor-context-v1/source-check.json)、[合同](analysis/game-actor-context-v1/implementation-spec.json)、[验收](analysis/game-actor-context-v1/validation.json)、[开发计划](reports/development-plan.md#stage171)、[交付清单](analysis/delivery-manifest-stage171.json)。

继续使用固定[游戏网页](web/game.html)和[运行说明](web/README.md#stage171)。完整游戏仍在开发：原生UI/队伍/子对象等上下文、生产启动与中文、微信原生宿主、战斗/特效、现行版本及官方兼容均未验收。本轮没有原程序、VM或官方会话操作。


<a id="stage170"></a>
## stage170：本机角色初始化与入场等待已接入（2026-11-04）

跨平台核心现在按已核对的源字段建立本机角色：角色身份、所选外观、当前身体资源、坐标和朝向各有来源。人物进入后可先建立逻辑对象；地图与本机单位记录到齐才启动移动和画面。提前到达的位置/朝向会保留，普通场景切换使用新坐标并释放旧动画对象。

19项新增、1239项完整Node、288组独立顺序用例、8条新增真实原创TCP、11个桌面/手机网页流程、3项中性环境和7项生成工程检查通过。10张最终截图已实际查看。3份微信App构建各111输入/11输出，独立游戏API86输入，均无外部导入；原生微信游戏Page与设备尚未验收。

继续使用固定[游戏网页](web/game.html)及[运行说明](web/README.md#stage170)。[源分析](analysis/game-local-bootstrap-v1/source-check.json)、[实现合同](analysis/game-local-bootstrap-v1/implementation-spec.json)、[验收](analysis/game-local-bootstrap-v1/validation.json)、[开发计划](reports/development-plan.md#stage170)和[交付清单](analysis/delivery-manifest-stage170.json)已更新。本轮没有运行原游戏、VM或官方会话。

整体仍未完成：完整原生main9/UI/队伍上下文、生产启动材料与中文编码、原生微信宿主、战斗/特效等玩法，以及现行版本与官方兼容继续保留在目标中。网页所需显式startup/context没有被隐藏默认值替代；初始化与本机原创对端验收不等于官方可玩。


<a id="stage169"></a>
## stage169：固定游戏网页与统一生命周期已接入（2026-11-04）

项目现有固定[游戏页面](web/game.html)：正常选择本地启动材料和资源文件夹，经旧版协议登录、人物列表/创建/外观/已知升级与入场，再进入Canvas场景。共享client统一拥有资源、世界、连接、运行时和CUT；支持暂停恢复、场景重载、断开、离页清理与同页重新选择材料连接。[运行说明](web/README.md#stage169)、[需求](reports/development-plan.md#stage169)、[接口](reports/module-interfaces.md#stage169)。

22项新增/1220项完整Node、2neutral/7生成工程、7条实际原创TCP、1条实际双目标WebSocket和7条Chrome页面流程通过。240个独立空闲源更新/13种画面及TCP成功链各52帧、两移动核对；桌面/触屏实际文件选择和重连完成，console/外部请求0，5张最终截图已查看。三App各111输入/11输出，API86输入，均0external。[验收](reports/validation.md#stage169)、[目标](analysis/game-browser-owner-v1/goal-audit.json)、[清单](analysis/delivery-manifest-stage169.json)。

本入口仍限定旧37c4与原创本机对端，使用显式派生启动配置；配置里的源hash是调用者声明，不证明资源版本、来源或官方授权。完整原生UI/上下文、生产启动/摘要/编码链、微信原生game Page、其余玩法、现行9baa/6e2ff及官方可玩继续未完成。既有桥的10秒/4MiB限制未改。本轮无VM、原程序、WER/CDB、账号或官方新操作；整体目标active。下方历史原样保留。


<a id="stage168"></a>
## stage168：外观选项、版本升级与进入前外观绑定（2026-11-04）

沿固定旧37c4的真实消费者，实现已有角色的外观切换、已知版本升级请求/回复、成功后重新取列表，以及进入前的单个外观状态绑定。浏览器选人控件已接入这些操作；失败保留连接并等待显式重试。[需求](reports/development-plan.md#stage168)、[源合同](analysis/game-character-options-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage168)。

**修正：** 原始指令`0x45874c`写入`0x814c=33100`；此前实现与参考夹具误用33000，现已修正24/1128条预览数据。历史测试通过描述当时夹具；本轮以指令字节、更新参考和实际TCP入场重新验证。[修正记录](analysis/game-character-options-v1/fallback-correction.json)。

19项新增/1198项完整Node、2neutral/7生成工程、6条原创实际TCP、5条真实Chrome流程通过。15296项外观、1566项升级门槛及1128项修正后预览与独立参考相符；桌面/触控及失败重试三条场景各53帧摘要、两移动/纠正/关闭核对。console/外部请求0，5张截图已查看。三App各109输入/11输出，独立API84输入，均0external。[验收](reports/validation.md#stage168)、[目标审计](analysis/game-character-options-v1/goal-audit.json)、[清单](analysis/delivery-manifest-stage168.json)。

完整游戏目标继续active：原生预览/完整重置、类别7升级材料生产者、删除消费者、正式game owner/page与游戏文本编码、微信设备Canvas/文件/调度、其余玩法、现行9baa/6e2ff及官方可玩仍未验。本轮无VM/原程序/WER/CDB、账号或官方会话操作。下方原样保留历史。


<a id="stage167"></a>
## stage167：创建人物、刷新列表与入场链已接通（2026-11-04）

固定旧37c4的创建控制、名称字节校验、两组点数和外观数值已追到真实13字段请求及回复。新增纯创建草稿、会话生命周期和浏览器表单；成功后重新取人物列表，再由用户选择入场。失败保留连接并显式返回选择，不自动重试。[需求](reports/development-plan.md#stage167)、[源合同](analysis/game-character-lifecycle-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage167)。

18项新增/1179项全Node、2neutral/7生成App/Page、4条原创TCP、5条真实Chrome流程通过。8400外观组合/6000分配操作/306名称与独立参考相符；桌面/触控创建后各53像素摘要、两移动/校正/关闭核对，console/外部请求均0，4张截图已查看。三App各107输入/11输出，游戏API82输入，均0external。[验收](reports/validation.md#stage167)、[目标审计](analysis/game-character-lifecycle-v1/goal-audit.json)、[清单](analysis/delivery-manifest-stage167.json)。

删除入口的固定等待体仅返回0，尚无可实现的发送消费者；没有补造删除报文。原生预览像素/完整重置、属性标签含义、正式游戏页面与编码绑定、微信设备Canvas/文件/调度、现行9baa/6e2ff和官方可玩仍未完成。本轮无原程序/VM/WER/CDB、账号或官方操作。下方保留历史结果。


<a id="stage166"></a>
## stage166：人物列表、已有角色选择与入场链已接通（2026-11-04）

沿固定旧版37c4真实消费者，确认两槽148B人物记录、内容代际门槛、选择前数值修正，以及已有角色进入下一主阶段9的请求/回复。新增纯字节角色流程、可选会话接线和可访问选人控件；浏览器与微信端口复用同一核心。[需求](reports/development-plan.md#stage166)、[源合同](analysis/game-post-login-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage166)。

28项新增/1161项完整Node、2项neutral、7项生成App/Page回归通过。211记录/1566门槛/1128数值修正与独立参考相符；实际本地641666条图形记录的内容探测一致。4条原创TCP场景、5条真实Chrome流程通过，桌面/触控各53像素摘要、两条移动及校正/关闭核对；控制台/外部请求均0。三份App各106输入/11输出，独立游戏API81输入，均0external。[验收](reports/validation.md#stage166)、[目标审计](analysis/game-post-login-v1/goal-audit.json)、[清单](analysis/delivery-manifest-stage166.json)。

本轮完成的是已有角色的源握手与本地场景链。创建/删除/外观、原生完整重置与UI上下文、正式游戏页面、微信设备Canvas/文件/调度、现行9baa/6e2ff消费者和官方可玩仍需继续；预览只实现数值修正。已有WER诊断未重放，原始程序/账号/官服无本轮新操作。下方保留历史结果。


<a id="stage165"></a>
## stage165：旧版登录状态机与跨平台连接宿主已接通（2026-11-04）

固定37c4的模块摘要/`glt`/`gid`发送顺序、`UJt`回复门槛及原生登录轮询已有源对应。新增纯字节登录所有者、拥有流/定时器/有序写入的会话宿主、浏览器和微信端口，以及同一模块身份的微信游戏API构建。[需求](reports/development-plan.md#stage165)、[源合同](analysis/game-session-runtime-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage165)。

25项新增/1133项完整Node、2项neutral、7项生成App/Page回归通过。24组交接输入和4315个独立源状态相符；原创Python实际TCP先核对登录请求，再核对52帧/两条移动消息，微信形状端口亦通过。Chrome桌面/触控各53像素摘要、位置校正、拒绝和关闭通过；控制台和外部请求均0。三份微信App构建各105输入/11输出，另有80输入的独立游戏API，均0外部导入。[验收](reports/validation.md#stage165)、[完整目标审计](analysis/game-session-runtime-v1/goal-audit.json)、[清单](analysis/delivery-manifest-stage165.json)。

正式游戏页面、完整后续阶段和runtime/UI上下文、模块摘要生产的完整绑定、微信游戏Canvas/文件/调度、现行9baa/6e2ff与官方可玩仍未完成。源码成功标记仅表示旧版原生登录阶段完成；截图来自原创测试夹具。已核实stage131的WER诊断已执行并恢复，本轮没有重放。下方保留历史结果。


<a id="stage164"></a>
## stage164：按需资源与异步场景呈现已接通（2026-11-04）

固定37c4的资源命名、七组加载与原生呈现调用顺序已核对。新增源资源计划、数值绘制队列、元数据/动画/CGP所有者、图像范围读取与有上限缓存；Canvas可在逻辑推进后异步准备整帧，跳绘期间不读取图像，也不因I/O重播移动/动画。支持已选择File切片、取消/关闭、场景切换与旧定时器抑制。[需求](reports/development-plan.md#stage164)、[源合同](analysis/game-resource-runtime-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage164)。

21新/1108完整Node、2neutral、7生成工程、3微信构建通过。209路径计划、160裁剪/翻转、4调色板分支、52实际本地TCP场景帧和2发送请求与独立参考相符；Chrome桌面/触控各53像素摘要及7项交互/异步生命周期检查通过。主机实际读取本地641666图形记录/2520动画资源，18张图像的36个中性绘制分支摘要全部一致；只保存数值/哈希。[验收](reports/validation.md#stage164)、[目标审计](analysis/game-resource-runtime-v1/goal-audit.json)、[清单](analysis/delivery-manifest-stage164.json)。

完整登录页→游戏接线、微信游戏Canvas与原生文件/调度、真实runtime/record/UI上下文、动态LUT/命名调色板/效果、骑乘组队/primitive/小地图、战斗/其余业务及认证、现行与实际三端/官方可玩仍未完成。旧版37c4源码与当前安装资源能按格式组合验证，不构成9baa/6e2ff消费者或官方接受证明。 现有窗口公式更正继续有效；下方保留历史结果。

<a id="stage163"></a>
## stage163：点击、长按、相机与 Canvas 运行链已接通（2026-11-04）

固定旧版37c4新增96条REA记录、23个唯一函数，53项源字节/映射核对。shared新增坐标拾取、原生点击/长按自动行走、源帧时钟与游戏运行核心；web新增薄Canvas宿主，将真实world/map/actor/scene像素接到鼠标与触控，保留跳过绘制期间的移动请求。[需求](reports/development-plan.md#stage163)、[源合同](analysis/game-input-runtime-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage163)。

20项新增/1087项完整Node、2项neutral、7项生成工程与3份微信构建通过；1213拾取、33输入更新、1800时钟调用、52真实本地TCP帧/2发送请求相符。Chrome156桌面1000×800与触控390×844各核对53个Canvas像素摘要，停止/恢复可用，控制台和外部请求均0；用原创合成资源核验链路。[验收](reports/validation.md#stage163)、[目标审计](analysis/game-input-runtime-v1/goal-audit.json)、[清单](analysis/delivery-manifest-stage163.json)。

**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

完整资源与原生 runtime/record/UI 上下文绑定、右键交互、小地图/primitive/特殊角色/特效、战斗/其余业务及认证、现行版本、实际三端与官方可玩仍未完成。旧版37c4不等同9baa/6e2ff；本轮没有VM、WER、CDB、账号、官服或原生IDE新操作，也未重放已消费停止点。

<a id="stage162"></a>
## stage162：普通地图、物件与实体场景已接通（2026-11-04）

固定旧版37c4新增39条REA记录、14个唯一函数分析，闭合 `.cut` 文件18B记录/运行时20B、原生渲染窗口、地形遍历、静态/动画地图物件、占地比较与实体合并。shared新增CUT目录和普通场景控制器，world可选配置后直接从已有地图缓存、实体与移动状态产出RGBA场景，支持源矩形裁剪。[需求](reports/development-plan.md#stage162)、[源合同](analysis/game-legacy-scene-frame-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage162)。

17项新增/1067项完整Node、2项neutral、7项生成工程及3个微信构建通过；144个原创场景帧、52个实际本地TCP场景帧及2条发送请求相符，本地341份CUT的401103条数值记录与Python摘要全部一致。首次全量中旧截止时间测试失败，隔离和最终同命令全量复测通过，原模块/测试未改，记录保留。当前仍缺实际输入/时钟/资源/Canvas宿主、小地图/特殊效果、战斗/认证、现行及三端/官服可玩；下方是历史结果。[验收](reports/validation.md#stage162)、[目标审计](analysis/game-legacy-scene-frame-v1/goal-audit.json)、[清单](analysis/delivery-manifest-stage162.json)。

<a id="stage161"></a>
## stage161：实体动作到普通画面的连接已实现（2026-11-04）

固定旧版37c4新增31条REA记录、9个唯一函数分析，接通网络动作重播、实体创建顺序、源回调条件、位移、动画缓存、原生深度排序与拥有独立字节的RGBA实体层。world新增`configureActorFrames`/`advanceFrame`；绘制失败时仍返回待发送的移动请求。[需求](reports/development-plan.md#stage161)、[源合同](analysis/game-legacy-frame-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage161)。

17项新增、1050项完整Node测试，2项neutral、7项生成工程回归及3个微信构建通过；1064个回调计划、44个排序用例、448个耦合帧与Python相符，本地TCP另验证52帧和2条实际发送请求。新分配器证据将初始图形索引纠正为−1；旧阶段记录保留。当前只完成普通实体绘制层，完整地形/物件/特殊角色、输入与资源宿主、战斗/认证、现行版本及三端/官方可玩仍未完成。[验收](reports/validation.md#stage161)、[目标审计](analysis/game-legacy-frame-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage161.json)。

<a id="stage160"></a>
## stage160：源动画时间线与普通帧定位已实现（2026-11-04）

固定旧版37c4新增55REA记录/20dossier（19唯一函数），闭合12B动画索引、12/20B动作、10B帧、附加偏移、每helper调用的播放计数与普通图像原点链。shared新增拥有动画目录/播放器，支持资源/动作/方向切换重置、循环/单次、freeze和声音/signal描述符；imageAt接图形ordinal，普通帧可交既有RGBA合成。[需求](reports/development-plan.md#stage160)、[合同](analysis/game-legacy-animation-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage160)。

21新/1033完整Node、2neutral、7工程及3个新微信构建通过；35组1250状态/1235普通RGBA步与原创Python相符，396本地资源/16034动作/58146帧数值metadata摘要相符。下一步接actor同动作重启、实际callback/场景时钟、资源与输入host；named palette/特效/战斗/auth、现行及三端/官方可玩仍未完成。[验收](reports/validation.md#stage160)、[审计](analysis/game-legacy-animation-v1/goal-audit.json)、[清单](analysis/delivery-manifest-stage160.json)。下方保留历史结果。


<a id="stage159"></a>
## stage159：真实索引图像解码与普通精灵绘制已实现（2026-11-03）

固定旧版37c4新增92条REA/36函数，闭合真实RD解码、CGP调色板、native32颜色与倒序行、透明色、翻转、视口裁剪和绘制排序。shared新增拥有字节的图像/调色板/精灵及帧合成核心，图形目录可选提供archive区间与原点；保留既有结构模型。[需求](reports/development-plan.md#stage159)、[源合同](analysis/game-legacy-render-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage159)。

28新/1012完整Node、2neutral、7工程检查和3个新微信构建通过。两组本地资源27854条摘要一致（34条越界安全拒绝），抽样288帧RGBA摘要一致；未导出官方像素。下一步为动画/实体资源绑定与实际scene/input/frame游戏host，特效/战斗/auth、现行及三端/官方可玩仍未完成。[验收](reports/validation.md#stage159)、[目标审计](analysis/game-legacy-render-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage159.json)。下方保留历史结果。


<a id="stage158"></a>
## stage158：碰撞、原生路径与普通本机移动已实现（2026-11-03）

固定旧版37c4样本新增117条REA记录/52唯一函数，闭合两种地图碰撞、40B图形索引的碰撞元数据、方向优先路径与合并、两步移动批次、缺块等待、地块交互和转向请求。shared新增graphics/navigation/local-movement纯核心，world协议接通当前缓存、源状态和拥有本机运动快照。[需求](reports/development-plan.md#stage158)、[合同](analysis/game-legacy-local-movement-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage158)。

37新增/984完整Node、2无平台API、7工程检查通过；独立原创TCP验证“两步＋一步”、位置校正及“补图→等待→补丁→继续移动”。三个新微信构建各93输入/11输出、0外部导入。当前仍需实际游戏host/输入时钟/绘制接线，完整场景/队伍生命周期、动画/战斗/auth、现行及三端/官方可玩未完成。[验收](reports/validation.md#stage158)、[目标审计](analysis/game-legacy-local-movement-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage158.json)。下方保留历史结果。

<a id="stage157"></a>
## stage157：实体生命周期、远端移动与移动消息已接入（2026-11-03）

固定旧版37c4样本新增109条REA记录（48个函数dossier、47个唯一入口），闭合本机实体ID、三种实体记录、动作/删除与普通远端移动。shared新增实体状态、10项移动队列、速度插值、方向查表、等轴投影和资源ID映射；world协议接通实体/状态槽，并能按源规则编码移动请求。[需求](reports/development-plan.md#stage157)、[规格](analysis/game-legacy-actors-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage157)。

33新增/947完整Node、2无平台API、7生成工程检查通过；独立原创TCP核对实际移动请求及前后10条消息。三个新微信构建各90输入/11输出、0外部导入。本机碰撞/寻路/预测、完整绘制/战斗/认证、现行版本和实际三端/官服可玩仍未完成，完整目标active。[验收](reports/validation.md#stage157)、[目标审计](analysis/game-legacy-actors-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage157.json)。下方保留历史结果。

<a id="stage156"></a>
## stage156：场景自动建缓存与状态增量已接通（2026-11-03）

REA新增47记录/17函数，闭合场景12字段、缓存创建/复用/重建、校验模式与位置链，以及标签和30/18个掩码状态槽。新的`createLegacyGameWorldProtocol`能从场景消息自动准备地图，再组合补取、区域更新和状态快照；原字节协议入口保持可用。[需求](reports/development-plan.md#stage156)、[规格](analysis/game-legacy-scene-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage156)。

16新增/914完整Node、2无平台API、7生成工程通过。原创TCP验证12消息、3次场景/3次状态增量及补图闭环；三个新微信工程各87输入/11输出、0外部导入。字段游戏名称、actor/资源/绘制/移动战斗、剩余89业务、完整认证和当前版本/三端/官方可玩仍未完成，完整目标active/incomplete。[验收](reports/validation.md#stage156)、[完整审计](analysis/game-legacy-scene-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage156.json)。下方保留历史阶段。

<a id="stage155"></a>
## stage155：地图缓存校验、补取与区域更新已接通（2026-11-03）

REA沿真实消费者新增46记录/19函数，核实旧版37c4地图缓存的三连续LE16平面、矩形裁剪、固定1458B校验及网络区域补丁。shared新增地图核心；显式安装缓存后，协议可在校验不符时给出已有补取命令，应用补丁后再次校验一致。[需求](reports/development-plan.md#stage155)、[规格](analysis/game-legacy-world-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage155)。

15新增/898完整Node、2无平台API和7生成工程检查通过；原创Python TCP验证补取与更新闭环，三个新微信工程均84输入/11输出、0外部导入。地图平面角色、场景/角色/绘制/移动战斗、完整认证、现行版本及三端官服可玩仍未完成。完整目标active/incomplete。[验收](reports/validation.md#stage155)、[完整审计](analysis/game-legacy-world-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage155.json)。下方保留历史阶段。

<a id="stage154"></a>
## 当前：旧版文本协议与网络位置投影已接通（2026-11-03）

REA新增118记录，86份dossier对应85个唯一函数；15指令/11读/5映射与原件匹配。固定37c4旧版已核60条文本发送路径、104接收分支和164标签原字，独立实现base62/字节转义、两种特殊binary形状及协议key-readiness。初始材料→正文→类型消息→网络位置投影可由原创流驱动，reset期间保留旧材料并在有效替换后清理。[需求](reports/development-plan.md#stage154)、[源核对](analysis/game-legacy-message-v1/source-check.json)、[收发目录](analysis/game-legacy-message-v1/dispatch-catalog.json)、[接口](reports/module-interfaces.md#stage154)。

新增17/完整883Node、2无平台API和7生成工程检查通过；隔离原创PythonTCP每次核62回复、104分支、更新材料/binary/位置投影。三新微信工程各83输入/11输出、0外部导入。投影只表示网络位置意图，原生actor同步、其余95业务分支、binary实际消费者、地图/renderer/移动战斗、完整认证和现行9baa/6e2ff、三端/官服可玩仍未完成。完整目标active/incomplete。[验收](reports/validation.md#stage154)、[完整审计](analysis/game-legacy-message-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage154.json)。下方为历史阶段。

<a id="stage153"></a>
## 当前：旧版游戏正文转换和初始材料校验已实现（2026-11-03）

沿37c4旧版主程序用REA取得43条新记录/16函数dossier，14指令、8处字节和4映射与原件匹配；两张重排表、128B派生参数和64个SHA256轮常量顺序核对通过。新增纯字节正文codec及112B初始材料校验：8B重排/64B循环异或保留源的有损边界，8192轮SHA256、AES256-CBC和HMACSHA256仅安装有效64B材料。补入两个固定2.4.0纯JS依赖，包SRI/文件摘要及MIT许可已核对。[需求](reports/development-plan.md#stage153)、[源证据](analysis/game-legacy-transform-v1/source-check.json)、[规格](analysis/game-legacy-transform-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage153)。

新增16项/完整866项Node、2项无平台API和7项生成工程检查通过，含独立Python/OpenSSL、与私有游戏材料无关的隔离原创TCP对端；三个微信工程各80输入/11输出、0外部导入。有效材料不证明官方对端身份，完整认证/控制、字段语法、状态/移动/战斗及渲染仍未完成；旧版与现行9baa/6e2ff保持独立，平台/官服可玩未验。完整目标active/incomplete。[验收](reports/validation.md#stage153)、[完整目标审计](analysis/game-legacy-transform-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage153.json)。下方为历史阶段。

<a id="stage152"></a>
## 当前：旧版主游戏封包核心已实现（2026-11-03）

REA在独立旧版主程序37c4中定位真实收发与外帧消费者：`AF EF | LE16长度 | 不透明数据 | EF AF`。新增47条REA记录、17函数dossier，10条指令/4次字节读取/3处映射与原件匹配。已独立实现纯字节封包编码及有界分片读取，保留原接收端8字节门槛，并明确拒绝有符号长度危险边界。[需求](reports/development-plan.md#stage152)、[源核对](analysis/game-legacy-network-v1/source-check.json)、[规格](analysis/game-legacy-network-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage152)。

24份原创Python向量、新增12项/完整850项Node、2项无平台API和7项生成工程检查通过，三个微信工程各71输入/11输出、无外部导入。帧内转换、认证、业务状态/移动/战斗与渲染仍未实现；旧版不等同现行9baa/6e2ff，网页/移动网页/微信可玩和官方接受尚未完成。规格矩阵另列旧版观察，现行未知项保持。完整目标active/incomplete。[验收](reports/validation.md#stage152)、[完整目标审计](analysis/game-legacy-network-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage152.json)。下方为历史阶段。

<a id="stage151"></a>
## 当前：取得可分析的旧版主游戏并定位首批消费者（2026-11-03）

从主站关联的历史6.0安装包取得两份完整旧版EXE，分别核SHA/普通DEFLATE精确大小及脚本、流尾双CRC；两者都有文件支持的.text。补齐的REWise读取器只在本项目build内按固定源码构建。已用REA取得39条记录、8函数dossier，定位旧版Config.dat、资源参数和CGSharedMem的实际消费；8条指令、4次字节读取和4源映射核对通过。[需求](reports/development-plan.md#stage151)、[材料与范围](analysis/game-release-current-v1/legacy-acquisition.json)、[REA与源字节核对](analysis/game-release-current-v1/source-check.json)、[首批静态合同](analysis/game-release-current-v1/static-contract.json)。

这是新的旧版代码分析路径，不能默认与现行9baa/6e2ff版本等价。当前补丁清单未变，没有重复下载现行游戏；完整历史安装包未下载完，所选两成员完整且独立绑定。本轮产品代码未改，游戏通信/状态/移动/战斗及三端可玩、官方接受仍未完成，完整目标active/incomplete。[验收](reports/validation.md#stage151)、[完整目标审计](analysis/game-release-current-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage151.json)。下方为历史阶段。

<a id="stage150"></a>
## 当前：压缩图形命令结构核心与未知位置标记已实现（2026-11-03）

新增纯字节 `decodeRDRunModel`，将RD v1/v3中的literal/repeat字节与C/D/E未知run位置分开保留；未知位置的零存储不是已恢复的色号或透明度。两个本地图形集合27,785条压缩记录与独立Python实现逐条一致，27,751条精确展开，原34条模型越界仍拒绝，不裁短。已有raw v0/v2解码器和页面行为保留。[需求](reports/development-plan.md#stage150)、[源与限制](analysis/game-rd-runs-v1/source-check.json)、[接口](reports/module-interfaces.md#stage150)。

新增9项、完整838项Node，2项无DOM bundle和7项生成工程检查通过；三个微信工程各70输入/11输出、0外部导入。C类位置也出现在候选调色板区，正式颜色/透明/方向/动画和主游戏业务消费者仍待证；本轮没有新增REA原生分析或游戏运行。实际平台、官服和可玩游戏未验收，完整目标active/incomplete。[验收](reports/validation.md#stage150)、[完整目标审计](analysis/game-rd-runs-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage150.json)。下方为历史阶段。

<a id="stage149"></a>
## 当前：游戏配置器已用REA核对并实现字节核心（2026-11-03）

新增对固定Config.exe的读写/对话框资源分析，确认Config.dat的显卡档位及窗口、后台跳帧、音效、音乐开关。已实现无平台依赖的默认状态、规范保存与有界读取；保留源的大小写/子串/前256B行为，并明确不模拟未终止缓冲、解析失败和非法档位的原生未知边界。[需求](reports/development-plan.md#stage149)、[源证据](analysis/game-config-v1/source-check.json)、[接口](reports/module-interfaces.md#stage149)。

新增7项、完整829项Node，3项无DOM配置bundle和7项生成工程检查通过；64种保存/31读取向量及资源v2/缓存接线有本机证据。配置器层的结果不证明主游戏已读取这些参数或渲染/玩法已实现。实际平台、官服和原游戏业务通信/可玩仍未验收，完整目标active/incomplete。[验收](reports/validation.md#stage149)、[完整审计](analysis/game-config-v1/goal-audit.json)、[交付](analysis/delivery-manifest-stage149.json)。下方为历史阶段。

<a id="stage148"></a>
## 当前：微信资源缓存与显式恢复已接通（2026-11-03）

可明确检查、保存已选择的资源，再从本机文件恢复为候选并重新选择；目录/游戏/区域/来源必须匹配。默认关闭、无启动读写，隐藏或换来源清空本页状态。资源和目录复用两份完整记录、版本检查和回读，写已发出后的取消准确提示结果需重新检查。[需求](reports/development-plan.md#stage148)、[接口](reports/module-interfaces.md#stage148)。

新增20项、完整822项Node及7项生成工程检查通过，含64MiB载荷、1024最长路径，以及真实原创文件在新JS环境恢复后不再下载便完成原创对端交换。三个工程各68输入/11输出、0外部导入。[验收](reports/validation.md#stage148)、[测试](analysis/launcher-wechat-resource-cache-v1/test-results.json)。

实际设备存储/内存/配额、跨进程/断电、原生平台及官服与原游戏可玩仍未验收；完整目标active/incomplete，矩阵rev45仍7 observed/13 unknown。[完整审计](analysis/launcher-wechat-resource-cache-v1/goal-audit.json)、[交付](analysis/delivery-manifest-stage148.json)。下方为历史阶段。

<a id="stage147"></a>
## 当前：当前登录器补丁调用按版本分离（2026-11-03）

REA补齐当前c82版本的命令、目录及定时器/退出分支：补丁路径始终加引号并转义；250ms查询进程，30分钟只提示一次；退出100还要求有效游戏选择，102最多三次。已实现纯数据模块，并将Web当前配置与微信接到当前策略。[需求](reports/development-plan.md#stage147)、[接口](reports/module-interfaces.md#stage147)、[源证据](analysis/launcher-current-patch-v1/source-check.json)。

10项新增、完整802项Node及5项生成工程检查通过，三个微信工程各65输入/11输出。进程计划限规范ASCII盘符目录和单文件名；转义器覆盖任意有界非NUL字节，不等于Windows路径接受。完整目标仍active/incomplete：原生平台、资源持久化、真实认证及原游戏业务/可玩未验收。[验收](reports/validation.md#stage147)、[完整审计](analysis/launcher-current-patch-v1/goal-audit.json)、[交付](analysis/delivery-manifest-stage147.json)。下方保留历史阶段。

<a id="stage146"></a>
## 当前：微信资源导入、补丁候选与明确来源接线已完成本地验收（2026-11-03）

微信宿主新增资源来源选择、本地ZIP基础资源导入、候选准备/选择，复用已证PUK3清单/ZIP/摘要规则；过滤来源保留原序号。共享补丁执行器同时供Web和微信调用，新增仅固定来源的Node只读转发端口；默认配置不请求资源，未部署公网/TLS服务。[配置与构建](wechat/README.md#stage146)、[接口](reports/module-interfaces.md#stage146)、[需求](reports/development-plan.md#stage146)。

新增19项、完整792项Node和5项生成工程检查通过。本机原创链路走通目录→ZIP导入→资源选择→原创登录对端，含1024基础文件边界、备用来源原序号、取消/迟到清理；隐藏后无法重选来源的问题已复现修复。[验收](reports/validation.md#stage146)、[测试证据](analysis/launcher-wechat-patch-v1/test-results.json)。

本轮没有真实微信/官服/游戏接受；实际HTTPS/AppID/设备/存储、资源持久化、原生更新事务和原游戏业务消费者仍未完成。资源候选不是可玩游戏，完整目标active/incomplete，rev43保持7 observed/13 unknown。[完整审计](analysis/launcher-wechat-patch-v1/goal-audit.json)、[交付](analysis/delivery-manifest-stage146.json)。下方为历史结果。

<a id="stage145"></a>
## 当前：微信原始目录缓存已接入，本地实现验收通过（2026-11-03）

新增明确的目录缓存检查、恢复、保存入口，保存已核验的原始目录字节，不把重新编码的文本当原文件。两份记录保留完整版本并回读核验；恢复后重新选区域和确认文本，再次HTTP刷新比较实际此前字节。默认关闭、无自动读写，账号/密码/会话不入缓存。[配置与构建](wechat/README.md#stage145)、[接口](reports/module-interfaces.md#stage145)、[需求](reports/development-plan.md#stage145)。

新增22项、完整773项Node及4项生成工程检查通过，含独立Python记录实现、本机真实测试文件、新JS环境恢复和原创登录对端。写已发出后的取消/超时准确显示结果需重新检查；复核发现的可变版本参数问题已复现并修复。[验收](reports/validation.md#stage145)、[测试证据](analysis/launcher-wechat-cache-v1/test-results.json)。

实际微信存储/渲染、跨进程与断电、AppID/设备/官方登录、资源补丁和原游戏业务消费者/可玩仍未验收。保留DevTools既有停止点，rev42仍7 observed/13 unknown，完整目标active/incomplete。[完整审计](analysis/launcher-wechat-cache-v1/goal-audit.json)、[交付](analysis/delivery-manifest-stage145.json)。下方保留历史阶段。

<a id="stage144"></a>
## 当前：微信目录初始化已接入，实际微信与游戏仍待验收（2026-11-03）

微信宿主新增“选择本地登录器并加载目录”：只读有界文件后复用已证 current 初始化/rtm/目录对校验，再接既有阅读、会话和候选选择。补齐原生 HTTP、私有取消/期限和纯 UTF-8/完整 WHATWG GB18030 解码；默认 null 配置无自动 IO，更新包只作候选校验。[配置与构建](wechat/README.md#stage144)、[接口](reports/module-interfaces.md#stage144)、[需求](reports/development-plan.md#stage144)。

新增32项、完整751项Node和4项生成工程检查通过，包含原创 HTTP、本地字节及独立Python交换。三个本地工程各54输入/11输出、约565–567KB，均无外部导入；这些是 JS 与本地构建证据。现有 DevTools 服务关闭的原生门槛保留，本轮未重试或改安全设置。[测试](analysis/launcher-wechat-bootstrap-v1/test-results.json)、[验收](reports/validation.md#stage144)。

实际微信编译/渲染、文件选择生命周期、AppID/域名/设备、官方账号、原生更新事务与原游戏业务消费者/可玩均未验收。rev41仍7 observed/13 unknown，完整目标 active/incomplete。[完整审计](analysis/launcher-wechat-bootstrap-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage144.json)。下方保留历史阶段。

<a id="stage143"></a>
## 当前：微信宿主工程已生成，原生渲染因工具服务关闭未验收（2026-11-03）

新增原创建App/Page/WXML工程及宿主控制器，接入本地XML目录/区域/分组选择、显式文本编码、四页确认、current会话和候选选择；私有输入不进入页面数据/日志/存储，提交/隐藏/卸载清空。默认配置null且不自动连接，原协议/纯核心未改。[构建与配置](wechat/README.md#stage143)、[接口](reports/module-interfaces.md#stage143)。

新增10项、完整719项Node及2项生成工程专项通过，含独立原创Python交换、实际App/Page模块和无DOM运行。现有微信工具CLI/官方SDK尝试明确返回服务端口关闭，连接/渲染检查/截图均0；未改安全设置，不能声称小程序编译渲染或真机通过。[测试](analysis/launcher-wechat-host-v1/test-results.json)、[原生回执](analysis/launcher-wechat-host-v1/native-ui-audit.json)、[验收](reports/validation.md#stage143)。

HTTP目录/更新/资源的微信接线、真实平台/账号/官方接受及原游戏消费者/可玩仍未完成。rev40仍7 observed/13 unknown，完整goal active/incomplete。[需求与接续](reports/development-plan.md#stage143)、[交付](analysis/delivery-manifest-stage143.json)。下方保留历史阶段。

<a id="stage142"></a>
## 当前：微信会话薄适配已接入现有协议驱动（2026-11-03）

新增`adapters/wechat`入口，复用已有REA证实的current握手/record/登录选择流程，接微信TCP、安全随机数和独立本地期限端口；现有session仅增加取消控制器注入，浏览器默认保留。没有另造游戏字段或协议状态机。[源码/平台依据](analysis/launcher-wechat-v1/source-check.json)、[接口](reports/module-interfaces.md#stage142)、[构建与接入](adapters/wechat/README.md#stage142)。

23项新增及完整709项Node通过，另1项CommonJS无DOM构建测试完成独立原创Python对端交换；构建器固定esbuild0.25.12于build。原生API形状由Node夹具提供，不能当微信开发者工具或真机结果。官方Performance类型未声明now，已改用本地逻辑时钟/timer floor；TCP write仅记录接受，确认状态不提升。[测试](analysis/launcher-wechat-v1/test-results.json)、[验收](reports/validation.md#stage142)。

微信完整页面、HTTP/资源入口、AppID/域名与设备、真实账号/官服以及原游戏消费者/可玩实现仍未完成；rev39保持7 observed/13 unknown，goal active/incomplete。[完整目标与接续](reports/development-plan.md#stage142)、[交付](analysis/delivery-manifest-stage142.json)。下方保留历史结果。

<a id="stage141"></a>
## 当前：恢复日志的消费分支已细化，文件恢复尚未执行（2026-11-03）

REA复用当前更新器材料，补6份函数调查/12条记录，6段2760B与原件相等。已区分无日志、stage1、stage2..4与stage5的恢复/清理条件；属性查询失败并非文件不存在，阶段号和AL成功也不是当前文件或账号/游戏成功证明。[源证据](analysis/launcher-recovery-state-v1/source-check.json)、[恢复分支合同](analysis/launcher-recovery-state-v1/static-contract.json)。

既有16B日志解析器及上一轮候选声明校验保持，当前网页初始化确实走该decoder。本轮没有新增产品代码、测试/构建或VM/厂商执行；686项Node与46项浏览器夹具是stage140结果。完整登录器、游戏消费者/可玩实现与设备/官方接受仍未完成，goal active/incomplete，rev38仍7 observed/13 unknown。[需求与下一步](reports/development-plan.md#stage141)、[验收](reports/validation.md#stage141)、[交付](analysis/delivery-manifest-stage141.json)。下方保留历史阶段。

<a id="stage140"></a>
## 当前：候选解码器已校验启动确认协议声明（2026-11-03）

REA追清当前登录器的`UPDATEACK:`消费、窗口绘制后的事件置位及更新器30秒确认/提交/恢复分支。新增7份函数调查、23条记录，9段5792B与原文件一致。启动确认只表示到达窗口绘制阶段，不代表账号登录或游戏可玩。[来源与限制](analysis/launcher-startup-ack-v1/source-check.json)、[静态合同](analysis/launcher-startup-ack-v1/static-contract.json)。

现有`decodeWin32LauncherUpdatePackage`新增所选PE资源声明校验：合法声明返回冻结的`startupAcknowledgement`元数据，畸形拒绝，缺失保留旧版分支；确认状态始终为`not-observed`。23项新增、72项相关及完整686项Node通过，桌面/手机尺寸浏览器测试页各23项通过；固定原候选仅离线解码验证，未执行。[接口](reports/module-interfaces.md#stage140)、[测试与浏览器](reports/validation.md#stage140)、[共享核心运行](shared/README.md#stage140)。

完整登录器、原游戏业务消费者及可玩实现、真手机/微信和官方接受仍未完成，goal active/incomplete；rev37仍7 observed/13 unknown。没有新增VM、游戏/CDB或账号操作。[完整目标与接续](reports/development-plan.md#stage140)、[交付](analysis/delivery-manifest-stage140.json)。下方为历史阶段结果。

<a id="stage139"></a>
## 当前：已追清更新器接管就绪与父进程退出的正常交接（2026-11-03）

REA对现行登录器/内嵌更新器补5份函数调查、19条新记录，7段11948B与各自原文件全部相等。父登录器100ms轮询、60秒等待，只有就绪事件已置位且更新器仍运行才请求关闭父窗口；更新器置位事件后须等父进程退出，才进入后续恢复与更新。此就绪阶段和新登录器启动确认分别保留。[两端源证据](analysis/launcher-handoff-ready-v1/source-check.json)、[静态合同](analysis/launcher-handoff-ready-v1/static-contract.json)、[分析](reports/launcher-static.md#stage139)。

本轮是分析进展，未增加产品代码、测试或构建；Win32命名事件/进程生命周期尚无网页/移动网页/微信执行端口，完整原生事务也未运行验收。游戏消费者缺口和完整可玩目标保留，goal active/incomplete；rev36仍7 observed/13 unknown。[完整目标与接续](reports/development-plan.md#stage139)、[验收](reports/validation.md#stage139)、[交付](analysis/delivery-manifest-stage139.json)。下方保留历史结果。

<a id="stage138"></a>
## 当前：已有游戏转储的固定字节已核对，代码归属仍未成立（2026-11-03）

普通来宾输入本轮恢复；核对转储完整哈希及微软CDB签名后，仅离线查询既有PID5304转储的两段共64B，退出0。候选初始化地址32B全部未捕获；故障地址32B可读，与按单个指针对差值选取的原文件参考有31B不同。不能据该差值认定重定位、函数或游戏消费者。[实际回执与比较](analysis/game-text-observer-runtime-v1/code-fingerprint-stage138.json)、[分析](reports/game-static.md#stage138)。

原转储查询前后SHA一致，结束时游戏/CDB进程0，未重跑游戏或采集新转储。登录器现有共享实现保留，663项Node是stage137历史结果，本轮没有产品代码、测试或构建变更。协议rev35仅更新证据，仍7 observed/13 unknown；完整登录、可玩游戏及网页/移动网页/微信和官方接受未完成。[需求与接续](reports/development-plan.md#stage138)、[验收](reports/validation.md#stage138)、[交付清单](analysis/delivery-manifest-stage138.json)。下方保留历史阶段。

<a id="stage137"></a>
## 当前：现行更新参数已补入共享核心，游戏指纹比对待执行（2026-11-03）

REA补核现行登录器的五字段更新交接：URL/路径内部空格转为管道符，保留包长前导零与MD5大小写。新增纯字节`encodeWin32LauncherUpdateArguments`，明确ASCII/长度/输入所有权边界；不增加原生执行或页面流程。[需求与结果](reports/development-plan.md#stage137)、[接口](reports/module-interfaces.md#stage137)、[源码](shared/launcher-update-arguments.mjs)。

5份新函数调查、14条新REA记录，7段4933B与原文件全部一致；13项新增、88项相关及完整663项Node测试通过。没有重跑浏览器/真手机/微信、构建native或验收原生更新事务。[源证据](analysis/launcher-update-arguments-v1/source-check.json)、[测试](analysis/launcher-update-arguments-v1/test-results.json)。

游戏仅完成两个32B主机参考点准备；普通来宾输入未恢复，未提交命令、未运行CDB/游戏、未取得转储字节或新消费者。既有授权/无测试账号答复保留，无新增手动操作请求。完整目标保持active/incomplete，rev34仍7 observed/13 unknown。[实际输入状态](analysis/game-text-observer-runtime-v1/access-stage137.json)、[完整目标](analysis/launcher-update-arguments-v1/goal-audit.json)、[本轮交付清单](analysis/delivery-manifest-stage137.json)。下方保留历史阶段。

<a id="stage136"></a>
## 当前：现行登录器已接到页面，原游戏与官方验收仍未完成（2026-11-03）

本轮修复此前遗漏的实现缺口：显式`sourceProfile: 'win32-current'`把现行HTTP初始化与握手/record成组接到本地登录页，默认legacy保留；空marker、缺少旧XML、rtm、取消与错误profile均有实际处理。REA直接核对当前c82fc98分析映像的初始化子链，未混用旧版地址。[需求与结果](reports/development-plan.md#stage136)、[接口](reports/module-interfaces.md#stage136)。

运行`node web/examples/launcher-current-browser-local.mjs`，打开其4176本机地址；只用公开原创输入`SyntheticU1`/`SyntheticP1`，逐页确认原创文本后交换和选候选。命令实际启动/正常中断退出已验。[运行说明](web/README.md#stage136)。新增8项、完整650Node和实际页面6场景通过；Chrome桌面1100×820/手机尺寸390×844含当前/旧分支及失败路径，均不作真实手机/微信或官方登录证明。[验收与截图](analysis/launcher-current-page-v1/browser-audit.json)、[测试](analysis/launcher-current-page-v1/test-results.json)。

目标已恢复active，旧135“所有独立路线耗尽”判断已纠正；游戏业务协议/可玩实现、真实账号、完整更新/交接和三平台/官方接受仍未完成。未执行厂商程序/VM或发起游戏服务器请求。rev33仍7 observed/13 unknown。[完整目标审计](analysis/launcher-current-page-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage136.json)。下方为历史阶段。

<a id="stage135"></a>
## 当前：游戏业务证据缺口达到阻塞门槛（2026-11-02）

完整四步目标仍未完成。现有登录器有限规格/实现与游戏启动、资源、崩溃和gzip证据保留；未取得版本匹配的游戏通信/状态/移动/战斗消费者，真实认证与网页/移动网页/微信/官方可玩均未验收。[逐项与三轮审计](analysis/game-material-gzip-v1/blocked-audit-stage135.json)。

本轮输入/已知文件哈希未变，REA没有目标或存活分析作业；133/134/135同一材料缺口连续三轮，无独立可行步骤。goal已标记为blocked，不把重复核验算进展；当前状态见[回执](analysis/game-material-gzip-v1/goal-status-stage135.json)。没有新产品代码、测试/构建或VM/游戏/网络操作，协议rev32仍7 observed/13 unknown。新的匹配业务材料/可靠协议或可绑定的读取源出现后再接续；既有授权和账号/PDB不可用答复保留，不重复索取。[需求](reports/development-plan.md#stage135)、[验收](reports/validation.md#stage135)、[交付](analysis/delivery-manifest-stage135.json)。下方为历史阶段。

<a id="stage134"></a>
## 当前：纠正gzip发现历史，仍缺游戏业务证据（2026-11-02）

同一Apex gzip的外/内层哈希和完整性在stage40已有记录；上一轮的“新发现”表述已纠正。stage133新增的有界工具、10项测试和REA格式拒绝结果保留。本轮四个随包DLL的16项直接Apex文件名/基名搜索均0，没有取得新的消费者。[历史核对与结果](analysis/game-material-gzip-v1/continuation-audit-stage134.json)。

完整登录、游戏业务/可玩实现与网页/移动网页/微信/官方接受仍未完成；没有重跑游戏、VM或网络实验，没有新产品代码/测试/构建。rev32仍7 observed/13 unknown，211项既有产品文件未变。当前材料缺口连续计2，goal保持active/incomplete；本轮纠正文档和负向线索检查不当游戏实现进展。[需求](reports/development-plan.md#stage134)、[验收](reports/validation.md#stage134)、[交付清单](analysis/delivery-manifest-stage134.json)。下方为历史阶段。

<a id="stage133"></a>
## 当前：补齐普通gzip材料检查，游戏消费者仍未取得（2026-11-02）

复核stage40已知的`ApexClient.Dat`标准gzip成员，新增有界检查工具并实际核验（不是新材料发现）：500154B原件展开为706686B，CRC32/ISIZE与完整流检查通过、原件未改。REA对展开成员返回不支持格式；标准嵌入PE头检查也未取得可绑定映像，内部格式、架构和职责仍未知。[材料证据](analysis/game-material-gzip-v1/material-audit.json)、[工具与格式范围](reports/resource-formats.md#stage133)。

本轮10项原创夹具/CLI保留测试通过；211项既有产品文件未变，协议矩阵升至rev31只同步证据和下一步，20项状态仍7 observed/13 unknown。无新VM、游戏/读取器/CDB运行或游戏服务器请求，没有新通信字段、玩法或平台兼容验收。[验证](reports/validation.md#stage133)、[分析](reports/game-static.md#stage133)、[交付清单](analysis/delivery-manifest-stage133.json)。

完整四步目标仍未完成：登录器的真实认证与完整交接、原游戏消费者及可玩实现、网页/移动网页/微信和官方接受均保留门槛。普通引擎可用；当前需要能绑定实际游戏行为的版本匹配材料或有来源的内部格式/协议合同。新材料路径耗尽后的当前计数从本轮开始，goal保持active/incomplete，不复用旧等待计数或要求重复授权。[逐项审计](analysis/game-material-gzip-v1/completion-audit.json)、[需求与接续](reports/development-plan.md#stage133)、[已知问题](reports/known-issues.md#stage133)。下方为历史阶段状态。

<a id="stage132"></a>
## 当前：启动回调来源与既有转储中的初始化记录已核对（2026-11-02）

REA对固定原文件完成5份函数调查、10处指令及1份引用记录，追清注册函数回填初始化指针、回调包装器转发参数和56B启动记录。10处指令均与原文件字节一致；注册链本身在stage96已有观察，本轮细化其来源与边界。[静态分析](reports/game-static.md#stage132)、[证据](analysis/game-text-observer-runtime-v1/indirect-flow-stage132.json)。

复用上一轮同PID5304的第二份转储，微软CDB离线一次读取四段固定栈范围共76B，退出0；19个DWORD全部取得。三处固定地址、两处候选帧内指针、模块句柄候选及哨兵均吻合，初始化回调槽与回填槽同值。它们支持启动记录对应，仍不能验证整条栈展开、间接代码归属、崩溃根因或游戏通信消费者。[有限读取结果](analysis/game-text-observer-runtime-v1/cdb-stack-stage132.json)、[验收](reports/validation.md#stage132)。

现有VM从暂停正常恢复，未重启游戏或改WER/安全/网络/共享；读取后游戏/CDB进程0，原始转储和日志保留来宾。无新产品实现、测试或构建，协议rev30不变，完整登录/玩法/网页、移动网页、微信及官方可玩未完成。下一步按[需求文档](reports/development-plan.md#stage132)核清剩余证据缺口，不把Win32初始化记录写成游戏协议。[排障](reports/known-issues.md#stage132-stack)、[证据入口](analysis/game-text-observer-runtime-v1/README.md#stage132)、[交付清单](analysis/delivery-manifest-stage132.json)。下方保留历史阶段状态。

<a id="stage131"></a>
## 当前：一次崩溃诊断及静态地址核对已完成（2026-11-02）

按用户本次确认执行了一次普通无参数游戏启动，PID5304运行6.466299秒后自然退出`0xc0000005`。两份小型转储分别取得`0xc00001a5`和`0xc0000005`的异常记录；微软CDB离线读取均退出0。临时WER设置已恢复，运行后EXE完整哈希一致，游戏/CDB进程数0，原始转储与调试输出保留在来宾。[运行与恢复](reports/vm-environment.md#stage131)、[验收](reports/validation.md#stage131)。

REA/Ghidra进一步核对六个候选返回地址：均在原文件`.text1`的已分析函数内，四处直接调用、两处间接调用的静态边界成立。两份CDB栈都有可能错误警告，异常地址又均不在所列39个模块范围内，因此仍未确定根因、真实调用链或游戏协议消费者。[分析与限制](reports/game-static.md#stage131)、[静态证据摘要](analysis/game-text-observer-runtime-v1/rea-stack-correlation-stage131.json)。

本阶段完成的是限定诊断及证据核对，完整登录/游戏/网页、移动网页、微信与官方可玩仍未完成；产品代码和协议rev30未改。下一步依据可证的静态调用和间接边界继续分析，不把候选栈写成协议规格，不重复本次运行。[需求与下一步](reports/development-plan.md#stage131)、[排障](reports/known-issues.md#stage131-wer)、[证据入口](analysis/game-text-observer-runtime-v1/README.md#stage131)、[交付清单](analysis/delivery-manifest-stage131.json)。下方旧阶段保留当时状态，stage130的确认等待已由本次实际答复解除。

<a id="stage130"></a>
## 当前：等待既有诊断执行确认，停止自动重复检查（2026-11-02）

上一轮129属于实际前检进展；本轮1709项交付哈希全部一致，最近三轮记录中未见对stage128具体诊断问题的新答复。既有键/目录/磁盘/进程检查已完成，再重复这些查询不会补出游戏消费者。没有新执行、REA操作、实现、测试或构建；完整登录/游戏/三平台及官方可玩未完成。

同一个执行时确认条件跨128、129、本轮持续，现已到达无独立工作可推进的阻塞点；按[审计](analysis/game-text-observer-runtime-v1/blocked-audit-stage130.json)停止自动重复，目标状态以[工具回执](analysis/game-text-observer-runtime-v1/goal-status-stage130.json)为准。已有VM/联网/工具授权保留，不重复提问或请求Windows手动操作。收到原问题答复后按[原方案](analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)核实时态再接续，不重放已用125运行。[需求](reports/development-plan.md#stage130)、[验收](reports/validation.md#stage130)、[交付](analysis/delivery-manifest-stage130.json)。下方旧阶段保留当时状态。

<a id="stage129"></a>
## 当前：转储配置与资源的只读前检已完成（2026-11-02）

Registry64/Registry32 两个逻辑视图的 LocalDumps 父键与游戏子键均不存在；AeDebug 键存在，但 Auto 值均缺失。实验目录不存在，C 盘实际余量230298329088B，同名游戏进程0，安装文件路径/2904064B已回读。查询没有修改配置，四个只读句柄已释放。[前检证据](analysis/game-text-observer-runtime-v1/wer-preflight-stage129.json)。

普通输入中途再次失去响应，实时菜单同次定位既有 Win+Q 后已恢复并完成查询；根因及持续稳定未证。[输入](analysis/game-text-observer-runtime-v1/input-stage129.json)。[原小型转储方案](analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)的执行时确认仍待答复，新恢复点、设置、启动和采集均未执行。无新游戏消费者、产品代码、测试或构建；完整登录/玩法及网页、移动网页、微信和官方可玩未完成。[需求](reports/development-plan.md#stage129)、[验收](reports/validation.md#stage129)、[排障](reports/known-issues.md#stage129-input)、[交付](analysis/delivery-manifest-stage129.json)。下方旧阶段保留当时状态。

<a id="stage128"></a>
## 当前：既存崩溃附件核验完成，尚无调用栈（2026-11-02）

普通 Windows 输入已实际恢复。两份既存 WER 归档分别只剩44628/44632字节的 `Report.wer`；十个临时附件引用目前全部不存在，包括两份 `.dmp`。报告各列38个模块，默认条目比较差异为0，未取得运行时地址或调用栈。[材料](analysis/game-text-observer-runtime-v1/wer-artifacts-stage128.json)、[输入](analysis/game-text-observer-runtime-v1/input-stage128.json)。这次结束了失效附件调查，不能据模块名称确定根因。

游戏当前完整哈希仍匹配；既有微软x86 CDB哈希匹配且签名Valid。已准备[一次本地小型转储方案](analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)，设置、采集及再次启动均未执行，执行时确认尚未取得。[准备层](analysis/game-text-observer-runtime-v1/diagnostic-readiness-stage128.json)、[需求](reports/development-plan.md#stage128)、[验收](reports/validation.md#stage128)、[排障](reports/known-issues.md#stage128-input)、[交付](analysis/delivery-manifest-stage128.json)。本轮无产品代码、测试或构建变更；消费者、认证/玩法及网页、移动网页、微信与官方可玩未完成。下方旧阶段仅描述当时状态。

<a id="stage127"></a>
## 当前：画面可读，普通来宾输入仍阻塞（2026-11-01）

**事实：** 原1694项交付哈希一致。本轮已重新看到同一Windows搜索面板和原PowerShell；文字、单键、窗口/搜索位置点击、正常窗口菜单选择及Escape均未取得可确认的来宾响应，没有按Return、执行新命令或读取崩溃附件。[实际观察](analysis/game-text-observer-runtime-v1/access-stage127.json)。画面恢复不代表输入恢复，附件是否存在仍未知。

同类输入问题在125、126、127连续三个工作轮次末尾复现；125/126先前取得的实际运行、错误与REA证据保留，本轮没有推进游戏实现。经[阻塞审计](analysis/game-text-observer-runtime-v1/blocked-audit-stage127.json)后停止自动重复输入，等待实际控制状态变化。恢复后沿原只读报告检查接续，不重新索取账号/PDB或重复授权。[需求](reports/development-plan.md#stage127)、[验收](reports/validation.md#stage127)、[唯一排障](reports/known-issues.md#stage127-input)、[本轮清单](analysis/delivery-manifest-stage127.json)。完整登录、游戏协议/玩法及网页/移动网页/微信/官方可玩仍未完成，产品源码与rev30未变。下方旧阶段描述其当时状态。

<a id="stage126"></a>
## 当前：异常记录已关联到游戏进程，尚无可分析的游戏代码（2026-11-01）

**事实：** 本轮恢复普通输入，读出上次 PID5136 的两条应用错误：先 `0xc00001a5`，后 `0xc0000005`；PID、安装路径和精确创建时间一致，故障模块均为 `unknown`。两份 WER 报告的选定签名也未给出模块地址；游戏与读取器运行后的完整哈希均匹配前检。[事件与时间线](analysis/game-text-observer-runtime-v1/events-stage126.json)、[运行后身份](analysis/game-text-observer-runtime-v1/postrun-identity-stage126.json)。

**推导：** 按记录时钟和脚本的1500ms等待顺序，首条错误记录早于读取器最早调用时点约0.965秒；这不是崩溃根因结论。REA 节表与独立 PE 检查表明两个原始故障偏移不能直接定位原文件函数，未取得调用栈或有效消费者代码。[REA](analysis/game-text-observer-runtime-v1/rea-fault-layout-stage126.json)、[范围检查](analysis/game-text-observer-runtime-v1/fault-layout-stage126.json)。

下一步只检查这两份既存报告引用的本地附件，先核存在性与类型。路径值与附件尚未读出；后续普通输入未回显，正常菜单恢复后截图主体为空白，当前终端状态未证。没有重新运行游戏或扩大内存读取。产品源码、rev30（7 observed / 13 unknown）未变，登录、玩法及网页/移动网页/微信/官方可玩仍未完成。[需求与接续](reports/development-plan.md#stage126)、[验收](reports/validation.md#stage126)、[本轮清单](analysis/delivery-manifest-stage126.json)。下方旧阶段描述各自当时状态。

<a id="stage125"></a>
## 当前：游戏单次诊断已执行，代码段仍未取得（2026-11-01）

**事实：** 已按本次确认的方案普通无参数启动安装版游戏一次，PID5136；原创读取器仅尝试一次固定1753452B `.text`，返回 `TEXT_ZERO` / exit1，未创建文件。进程实际17:36:47.9234205–17:36:57.0468305（+08:00），退出码 `0xc0000005`；整体开始/结束标记相隔15.634秒。输出不存在、同名进程数0已实际复查。[运行回执](analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)、[本次前检](analysis/game-text-observer-runtime-v1/game-guest-preflight-stage125.json)。

当前只是无账号诊断，尚未取得游戏消费者、正常登录器交接或玩法证据。错误事件查询赋值已返回提示符，随后目标详情回读遇到普通输入无可靠响应，尚无错误模块/偏移；不判定为无事件或 ARM/依赖根因。本次启动/读取方案已用，不重复运行。继续读取本次错误记录，再据精确故障位置选择 REA 问题；已有账号和PDB不可用答复保留。[接续计划](analysis/game-text-observer-runtime-v1/resume-plan-stage125.json)、[需求](reports/development-plan.md#stage125)、[验收](reports/validation.md#stage125)。

产品源码、解析器、构建和测试没有新增变更；rev30仍为7 observed / 13 unknown。网页、移动网页、微信小程序及官方可玩均未完成。下方旧阶段仅保留当时状态。

<a id="stage122"></a>
## 当前：本次游戏诊断已获确认，等待正常解锁（2026-11-01）

**事实：** 本次一次启动/一次固定代码段观察的执行确认已取得，目标已恢复 active；原 1671 项交付 hash 一致。现有新恢复点的精确 VM 标识、current 状态与 XML 摘要再次核对一致，没有新增快照或还原。[授权回执](analysis/game-text-observer-runtime-v1/authorization-stage122.json)、[恢复点复核](analysis/game-text-observer-runtime-v1/recovery-recheck-stage122.json)。

通过正常窗口与实时菜单定位，原生 Win+Q 打开搜索，普通字符 1 与 Escape 关闭均已实际回读；随后 Mac 自动锁定，工具报告自动解锁失败。已保留一次正常解锁请求，无需再次操作 Windows 或重复本次执行确认。[输入证据](analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)、[唯一排障记录](reports/known-issues.md#stage122-input)。

**待验证：** 新鲜来宾前检、游戏启动/读取及 REA 消费者仍未执行；源码、协议 rev30（7 observed / 13 unknown）、真实认证/玩法和网页、移动网页、微信、官方可玩均未新增验收。恢复正常访问后继续原有一次诊断。[当前需求](reports/development-plan.md#stage122)、[验收](reports/validation.md#stage122)、[交付清单](analysis/delivery-manifest-stage122.json)。下方保留各阶段当时状态，当前以本节为准。

<a id="stage119"></a>
## 当前：原创读取资格通过，游戏诊断前检就绪（2026-11-01）

**事实：** 同一份 Windows 原创快照已传回主机，按实际基址 `0x00da0000` 与 245 个 HIGHLOW 修正后的预期比较，6624 字节全部相等；接收器成功关闭并退出 0。本轮没有重新启动夹具或重读进程。[资格回执](analysis/game-text-observer-runtime-v1/qualification-stage119.json)、[直接比较](analysis/game-text-observer-runtime-v1/host-oracle-stage119.json)。

安装版游戏的完整 hash、Win7 标记、五个直接 DLL、读取器、输出不存在与同名进程数 0 均已新鲜核对；新原生恢复点已建立，旧点保留，还原启动未测。REA 新增 1 条 i386 文件头证据，导入表来源另记。[游戏前检](analysis/game-text-observer-runtime-v1/game-guest-preflight-stage119.json)、[恢复点](analysis/game-text-observer-runtime-v1/recovery-point-stage119.json)、[一次限定诊断方案](analysis/game-text-observer-runtime-v1/game-startup-plan-stage119.md)。

**待验证：** 原游戏尚未执行或读取，真实认证、消费者、玩法及网页/移动网页/微信/官方可玩仍未完成。产品源码与 rev30（7 observed / 13 unknown）未改。本轮补齐分析依赖验收，执行时来源确认正在等待答复。[当前需求](reports/development-plan.md#stage119)、[验收](reports/validation.md#stage119)、[本轮交付清单](analysis/delivery-manifest-stage119.json)。下方旧阶段保留其当时状态，当前以本节为准。


<a id="stage118"></a>
## 当前：原创读取器取得Windows实测，完整文件传回待恢复输入（2026-11-01）

**事实：** 用户正常解锁后，新原创读取器146798B/16386482…83732f5已传入现有Windows并核对完整SHA256。一次原创fixture PID260实际读出6624B、观察器退出0；按实际基址00da0000和245个HIGHLOW修正计算的预期SHA256与Windows输出一致。同一fixture在14:46:53–14:47:23自然运行30秒后退出0。[运行实证](analysis/game-text-observer-runtime-v1/fixture-runtime.json)、[传输与来源](analysis/game-text-observer-runtime-v1/transfer-runtime.json)。

**待完成：** 原始文件尚未传回主机做直接逐字节比较。普通点击/文字输入再次未获来宾响应，原生Win+Q可打开搜索；尝试的鼠标/键盘模式最后仍为自动检测。没有重跑fixture、执行原游戏或新增协议字段；游戏消费者、真实认证、玩法和网页/移动网页/微信/官方可玩均未完成，矩阵rev30保持7 observed/13 unknown。[当前需求与下一步](reports/development-plan.md#stage118)、[验收与限制](reports/validation.md#stage118)、[唯一排障记录](reports/known-issues.md#stage118-input)、[工具入口](analysis/game-text-observer-runtime-v1/README.md)、[交付清单](analysis/delivery-manifest-stage118.json)。

以下stage117及更早记录均为对应阶段历史；本轮已恢复访问并取得上述新运行证据。

<a id="stage117"></a>
## 当前阻塞：正常电脑访问连续三轮失败（stage117）

电脑控制连续三轮报告Mac locked/自动解锁失败，三轮审计后目标工具已返回blocked。完整游戏未完成，主机取证准备已保留。已有一次正常解锁请求；恢复正常访问后先做真实Windows夹具字节/生命周期验收，再继续游戏取证。[阻塞审计](analysis/game-text-observer-v1/blocked-audit-stage117.json)、[状态回执](analysis/game-text-observer-v1/goal-status-stage117.json)、[交付](analysis/delivery-manifest-stage117.json)。

<a id="stage115"></a>
## stage115：固定游戏代码段观察工具已准备，Windows实测待恢复输入（2026-10-31）

新增独立只读工具，固定身份与`.text`范围，单次读取，不启动或修改目标。39项主机边界断言、6项原创夹具字节oracle测试通过；两次PE构建一致，两套链接配置/中文路径与ASLR/NX已核对，REA独立检查了产物身份。[工具与构建](analysis/game-text-observer-v1/README.md)、[实际验收层](analysis/game-text-observer-v1/validation.json)。

电脑控制能读现有Windows画面，但首次输入批次报告Mac locked/自动解锁失败，未提交Return或执行来宾命令。一次正常解锁请求保留。Windows夹具及原游戏读取均未进行，游戏消费者、认证、玩法和三平台/官方可玩仍未完成；下一步先验新工具的真实Windows读出及完整字节，再进入具体游戏诊断方案。[访问](analysis/game-text-observer-v1/access-observation.json)、[Windows方案](analysis/game-text-observer-v1/windows-qualification-plan.json)、[需求](reports/development-plan.md#stage115)、[交付](analysis/delivery-manifest-stage115.json)。

stage116复查：1637项交付hash一致，正常电脑访问再次报告Mac locked/自动解锁失败；同一阻塞已连续2个goal turn。本轮无新开发、来宾操作或游戏证据，已有解锁请求保留；下一步仍为真实Windows夹具验收。[本次回执](analysis/game-text-observer-v1/access-recheck-stage116.json)。

<a id="stage114"></a>
## stage114：来源缓存真实浏览器验收通过，继续游戏代码取证（2026-10-31）

事实：现有生产模块在Chrome156/Playwright1.64.1下通过83项检查，桌面1100×820和手机尺寸390×844各40项。固定来源v2及默认v1跨浏览器正常关闭/重开保留；错误来源恢复被拒绝，匹配候选仍须明确选择，旧CAS写入没有替换当前记录。35份实际加载的生产模块hash与stage113一致，本轮没有产品代码修改。[浏览器回执](analysis/launcher-cache-source-browser-v1/browser-results.json)、[桌面证据](analysis/launcher-cache-source-browser-v1/desktop-v2-selected.png)、[手机尺寸证据](analysis/launcher-cache-source-browser-v1/mobile-v2-selected.png)。

对9baa游戏原件重新核对CodeView GUID/age，微软公开符号源对应普通/压缩PDB两次GET均404；原.text仍0文件字节，尚无原游戏消费者。暂无测试账号，完整登录器/游戏玩法、物理手机/微信及官方可玩仍未完成。下一步核对未改动程序自身启动的可观察阶段，继续寻找游戏代码证据。[游戏与工具边界](analysis/launcher-cache-source-browser-v1/game-source-check.json)、[符号回执](analysis/launcher-cache-source-browser-v1/symbol-observation.json)、[当前计划](reports/development-plan.md#stage114)、[验收](reports/validation.md#stage114)、[交付](analysis/delivery-manifest-stage114.json)。

<a id="stage113"></a>
## stage113：补齐显式备选更新源，真实378条清单可解析（2026-10-30 至 2026-10-31）

事实：现行登录器的正常选择路径在账号提交前进入补丁准备。REA新增48条，三个独立目标分别保留190/46/4条；10处源码字节核对通过。现有ASCII大写补丁命名与当前源码一致。[源码与版本台账](analysis/launcher-current-entry-v1/rea-audit.json)、[规格](analysis/launcher-current-entry-v1/implementation-spec.json)。

shared新增固定Patcher来源计划，web支持显式`patchSourceProfile/patchSourceOrdinal`；每次准备的清单和包都留在所选且单独允许的来源。实际更新清单有378条，已把操作容量从256补到512，保留512块及其余资源边界；11项新测试和既有回归合计79项通过。[接口](reports/module-interfaces.md#stage113)、[测试](analysis/launcher-current-entry-v1/test-results.json)。

本轮6次主机GET均HTTP200：3份公开配置、2份更新清单、1个独立游戏变体包。现有3000版与两份清单的长度/MD5一致；取回的6000版与既有固定样本字节相同，通过ZIP CRC/长度/MD5，但REA确认原`.text`仍无文件字节，游戏消费者未恢复。暂无测试账号，认证、游戏玩法、浏览器传输及移动网页/微信/官方可玩仍未验收；矩阵rev29保持7 observed/13 unknown。[清单重解析](analysis/launcher-current-entry-v1/manifest-reanalysis.json)、[游戏证据](analysis/launcher-current-entry-v1/game-capability.json)、[验收](reports/validation.md#stage113)、[交付](analysis/delivery-manifest-stage113.json)。

资源缓存同步保留所选来源：配置默认仍用原v1，固定profile使用v2；不同来源的缓存不能相互恢复。新增回归先实际复现3项失败，补齐缓存所有者后相关79项全部通过。

<a id="stage112"></a>
## stage112：连接控制源链已核对，游戏身份已前检（2026-10-30）

REA在同一现行登录器上新增16条、累计155条记录，本轮覆盖21个不同函数，7处原字节锚点通过。Type1为标记1加两个调用者提供的UInt32BE字，共9B；字段含义和实际调用值待验证。已追踪的正常待登录段在ready后提交type10；type2回调接收两个参数，本次回调未使用它们。现有opaque编码与flow符合这些已证范围，相关4文件45项Node测试通过，产品代码本轮无需修改。[源规格](analysis/launcher-current-control-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage112)。

Windows只读前检实际返回安装版游戏9baa…d3126和`~ WIN7RTM`，键盘输入经短命令验证恢复，临时全屏已还原。已有原创观察器源码与构建哈希已复核，其Windows历史资格仅为fixture profile；尚无原游戏进程或消费者观察。[游戏能力](analysis/launcher-current-control-v1/game-capability.json)、[前检](analysis/launcher-current-control-v1/guest-preflight.json)。

用户暂无测试账号；真实认证、原游戏通信/玩法及网页、移动网页、微信和官方可玩验收继续保留缺口。矩阵rev28仍7 observed/13 unknown，本轮无新外部探测或厂商程序执行。[开发计划](reports/development-plan.md#stage112)、[验收](reports/validation.md#stage112)、[交付](analysis/delivery-manifest-stage112.json)。

<a id="stage111"></a>
## stage111：现行加密记录已按源合同补齐（2026-10-30）

REA沿同现行6d459…c987/分析c82fc…c152，123复用+16新增=139记录、本轮34不同成功反编译入口；源/汇编确认当前发送补零是ceil(n/8)*8+8，旧版472e70为floor(n/8)*8+8，接收还允许0/0空记录。shared新增现行record codec/stream/profile，flow与web session的handshakeProfile='current'现在同时选择现行握手和record；generic保留原契约。[源规格](analysis/launcher-current-record-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage111)。

13独立ECB记录+最大摘要、3接收边界、3原创会话和65分片，相关7文件78Node全通过；4源区间及1042 Pi字一致。修复前29B请求只加密32B，现行源应为40B；已修正。无新外部网络/账号/原程序执行，真实网络仍只到stage110的8B hello→529B挑战。[测试](analysis/launcher-current-record-v1/test-results.json)、[验收](reports/validation.md#stage111)。

用户已确认暂时无专用测试账号；继续无账号的正常连接控制/版本消息，真实认证、原游戏消费者/玩法、网页/移动网页/微信与官方可玩保持未完成。矩阵rev27仍7 observed/13 unknown，native与原件保留。[开发计划](reports/development-plan.md#stage111)、[交付](analysis/delivery-manifest-stage111.json)。

<a id="stage110"></a>
## stage110：现行固定组握手已实现，并取得无账号联机证据（2026-10-30）

REA对更新版6d459…c987（分析c82fc…c152）复用106记录，新增17记录/本轮25不同成功反编译入口，累计123；确认客户端hello(版本1/key8)、字段<=256B/缓冲784B、字面生成元2及固定256B模数。shared新增现行握手解码/回答，flow与web session以显式handshakeProfile='current'接入；generic数学/原创旧夹具契约保留。[源规格](analysis/launcher-current-channel-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#stage110)。

新鲜公共配置BIP 221.122.108.12:9030的一次Node观察，仅请求写8B hello，收到529B挑战（1/256/256），通过现行源组校验并在1483.317ms观察到close。无公钥回答、账号请求、原游戏数据或原始challenge留存；公共组匹配不证明对端身份、登录或完整兼容。[联机回执](analysis/launcher-current-channel-v1/network-observation.json)。

3有效/8无效独立Python向量、530分片、web传递和6个TCP夹具检查，相关6文件78Node全通过；3原字节区间核验通过。矩阵rev26补证据仍7 observed/13 unknown。完整加密记录/账号/游戏消费者及网页、移动网页、微信和官方可玩仍未验收，继续原四步；native和原件保留。[验收](reports/validation.md#stage110)、[交付](analysis/delivery-manifest-stage110.json)。

<a id="stage109"></a>
## stage109：REA核对更新版登录契约，并修复状态字投影（2026-10-30）

沿“REA登录器→实现登录器→REA游戏→实现游戏”，目标继续为网页/移动网页/微信。更新版6d459…c987的同hash分析副本已由REA复用快照并新增59条查询记录（累计106，含一条未识别procedure的查询；本轮43个不同成功反编译入口）。type10/45B、大端字和type11五列布局可以复用；中间适配器丢W0，不是回复少一列。[规格/证据](analysis/launcher-current-login-v1/implementation-spec.json)、[REA台账](analysis/launcher-current-login-v1/rea-audit.json)。

shared两模块去除原工程额外的signed16规范扩展限制：保留完整UInt32 stateWord，按原程序低16位0/-4和计费/过期合取判断选择与交接。接口不变。48组原创Python合成报文覆盖完整字节链，修复前确实失败、修复后相关78项Node测试通过；5原字节锚点和错误身份拒绝通过。[验收](reports/validation.md#stage109)、[核心接口](reports/module-interfaces.md#stage109)、[交付](analysis/delivery-manifest-stage109.json)。

本轮无Windows/厂商执行、账号、真实IPC、联网或保护变更；未跑浏览器/设备。认证接受、原游戏消费者/协议/可玩、三平台和官方兼容仍未完成；矩阵7 observed/13 unknown不升级。保留native与moli原件，继续补实际游戏消费者证据。

<a id="stage108"></a>
## 当前：补齐运行库后，自更新和 V2.01 主界面已实证（stage108 / 2026-10-30）

先用REA复核旧更新器启动/五槽检查与MFC71依赖，88锚点、8区间hash通过。取得Broadcom/VMware官方附件后，Windows核验外层包签名Valid；只向平台目录新增三个x86 DLL，完整hash与源相同，原四文件备份也已核验。[REA](analysis/game-install-context-v1/rea-updater-stage108.json)、[来源与资格](analysis/game-install-context-v1/vc71-source-stage108.json)。

补库后的单次正常启动实证了原登录器9280→更新器10436→再启动登录器9012；V2.01主界面及游戏列表可见，约52秒正常关窗。安装目录EXE已由599040B/109b…ef0e变为1666048B/6d459…c987，RegionList也更新；新版与保留的已分析公开载荷完整hash相同。[补库、备份、事件及文件回执](analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)、[版本对应](analysis/game-install-context-v1/updated-source-bridge-stage108.json)。

本轮两个独立正常启动方案分别已用一次；未直接运行更新器或游戏。两个专用管理员会话和临时订阅已收尾，原19项键盘菜单/顺序保留。更新器退出码、运行映像hash、完整事务恢复和账号登录仍未验；产品源码未变，7 observed/13 unknown不变，网页/移动网页/微信及官方可玩仍未完成。[持续需求与下一步](reports/development-plan.md#stage108)、[阶段验收](reports/validation.md#stage108)、[唯一操作知识库](reports/known-issues.md#vm-troubleshooting)。以下“当前”均为相应阶段历史。

<a id="stage107"></a>
## 当前：平台安装已核验，运行取证待来宾输入恢复（stage107 / 2026-10-30）

用户自行完成安装后，原平台安装器PID3440实际WaitForExit=True、HasExited=True、ExitCode=0；InstallDir的32/64视图同值、各exit0，目录及登录器/更新器完整hash已回读。结束自动运行选项和中间生命周期未观察，不重复安装或接受条款。[实际安装](analysis/game-install-context-v1/platform-installed-stage107.json)。

重新从原安装包静态提取三文件，正常UPX解压登录器后hash与既有REA目标相同；REA确认BIN_DATA/143的46080B更新器与安装目录相同，7处源字节锚点通过。这是599040/46080旧版对应，不能套用1666048/814080新版事务规则。[版本与REA证据](analysis/game-install-context-v1/rea-bridge-stage107.json)。

普通来宾输入随后失效；同一会话正常暂停/继续、退出全屏未恢复，原生Win+Q与主机输入对照可用，根因未定。一次最小焦点请求待答，未盲目Return或启动原程序。产品源未改，规格仍7 observed/13 unknown，可玩与网页/移动网页/微信/官方验收未完成。[下一次正常启动方案](analysis/game-install-context-v1/normal-launcher-plan-stage107.json)、[持续需求](reports/development-plan.md#stage107)、[操作知识库](reports/known-issues.md#vm-troubleshooting)。以下“当前”均为相应阶段历史。

<a id="stage106"></a>
## 当前：游戏安装与原创工具验证完成，平台停在新许可页（stage106 / 2026-10-30）

stage105的1503项交付回读一致；已安装游戏hash保持9baa…d3126。平台包E:/POLCN_Setup.exe完整hash匹配此前核验的官方分发对应样本；当前HKCU InstallDir两视图均缺项/值、exit1，两默认父目录不存在。正常平台安装器启动/UAC各一次，原PID3440初始HasExited=False，进入实际许可协议页。[前检](analysis/game-install-context-v1/platform-preflight-stage106.json)、[运行](analysis/game-install-context-v1/platform-runtime-stage106.json)。

当前“我拒绝”仍选中、“下一步”禁用，未接受协议、未点击安装。已从同一固定包提取完整许可到私有本地文件，GBK严格回转且首尾与实际页面相符；已发出一次本次新许可确认，继续前等待答复。确认来自电脑控制工具的新协议接受时规则，Windows/联网/工具授权仍有效，无需人工操作Windows。[许可依据](analysis/game-install-context-v1/platform-license-stage106.json)、[完整许可正文](build/analysis/game-install-context-v1/stage106/platform-license-stage106.txt)、[持续需求](reports/development-plan.md#stage106)。

本轮没有原游戏/登录器/更新器启动或新消费者证据，规格仍7 observed/13 unknown，完整目标未完成。答复后先核新鲜页面，继续同一次向导，取消结束自动运行并回读真实平台目录/hash/view；不重放启动命令或旧脚本。

<a id="stage105"></a>
## 当前：正常游戏安装完成，观察工具通过原创夹具验证（stage105 / 2026-10-30）

本次来源执行及UAC确认已收到并使用一次。游戏正常安装到 `C:\Program Files (x86)\PlayOnline\魔力宝贝`，结束页取消“安装易玩通娱乐平台”，安装器PID6368退出0。HKCU游戏Path的32/64视图一致，四个关键文件完整hash与固定源相同；目录2369文件的数量/总字节与源内容加两项卸载文件相符，未做全目录逐文件hash验收。[实际安装与身份](analysis/game-install-context-v1/guest-installed-context-stage105.json)。

原创观察器新增绑定真实安装目录的 `game-installed` 固定配置，原配置值及全部只读门禁保留；26项主机断言、两次构建相同和编译后中文路径核对通过。新二进制在Windows原创夹具PID804上完成一次8B读取，observer退出0，夹具自然结束；夹具同PID退出码回读为空，保留未知。[构建](analysis/game-entry-v1/observer-build-stage105.json)、[Windows实证](analysis/game-entry-runtime-v1/windows-observer-stage105.json)、[构建接口](analysis/game-entry-v1/probe/README.md#stage105)。

安装及工具验证尚未取得原游戏消费者、完整登录器生命周期或游戏协议。下一步核实平台正常安装上下文，沿用户已指定的Win7兼容及登录器流程继续取证；规格仍7 observed/13 unknown，网页、移动网页、微信与官方验收均未完成。[持续需求](reports/development-plan.md#stage105)、[阶段验收](reports/validation.md#stage105)、[交付清单](analysis/delivery-manifest-stage105.json)。以下“当前”均为相应阶段历史。

<a id="stage104"></a>
## 当前：正常安装取证受阻，完整目标未完成（stage104 / 2026-10-30）

本轮回读stage103全部1490交付项相同，固定游戏原件派生样本hash相同、原.text RawSize仍0；只复核既有边界，没有新游戏消费者或产品实现。已按原四步及网页/移动网页/微信/官方目标逐项审计，13项unknown未升级。[完整范围与路线审计](analysis/game-install-context-v1/blocked-audit-stage104.json)。

同一个本次未知来源游戏安装/UAC确认在stage102、103、104三个连续goal轮次仍待答；前两轮的独立准备/静态工作已完成，本轮无可独立推进消费者的已证路线，也无确认存活的取证任务可等待。goal工具已返回blocked；这保留完整目标，不是完成。该确认来自电脑控制工具的执行时规则，一般Windows/联网/工具授权仍有效，不重复发送问题。

收到原确认后，从新鲜窗口、安装包hash和实际目的地前检继续正常安装，实际新条款另行处理、取消结束自动启动，再核真实目录/hash/view并继续REA消费者分析。无新增解锁/焦点请求；本轮未操作Windows，也不推定当前锁屏/桌面状态。[当前方案](analysis/game-install-context-v1/normal-run-plan-stage102.json)、[持续需求](reports/development-plan.md#stage104)、[本轮交付](analysis/delivery-manifest-stage104.json)。以下“当前”均为各阶段历史。

<a id="stage103"></a>
## 当前：安装条件函数已静态核对（stage103 / 2026-10-30）

沿 REA 已证安装链，补齐 IFPS23 静态读取能力：两个原安装包的编译脚本只读提取为3778/3416B；可信 PyPI 固定版本只在私有 build 加载，7项原创合成测试通过。完整厂商脚本/反汇编不进入交付。[提取](analysis/game-install-context-v1/compiled-extraction-stage103.json)、[依赖及摘要](analysis/game-install-context-v1/ifps-dependency-stage103.json)、[7项检查](analysis/game-install-context-v1/reader-qualification-stage103.json)。

**原字节事实与静态解释分开：** 8处锚点及两个函数体摘要相符；GetLauncherPath 读 HKCU `SOFTWARE\SECN\Launcher/InstallDir`，CheckPolCNSetup 只判断返回字符串长度大于零，没有在这两个函数内检查文件存在。实际安装分支、目录和启动链仍待正常运行验证。[函数偏移与推测边界](analysis/game-install-context-v1/install-conditions-stage103.json)。来宾对此值的显式32/64位查询均实际返回缺项/值、exit1；只代表本次用户/键的观察。[来宾回执](analysis/game-install-context-v1/guest-platform-context-stage103.json)。

当前仅已发出的本次未知来源安装及对应 UAC 执行时确认待答；无需用户解锁、点击终端或重复一般授权。本轮未执行厂商脚本、安装器、登录器或游戏。完整四步目标保持 active/未完成，20规格仍7 observed/13 unknown，可玩、网页/移动网页/微信及官方兼容未验收。[持续需求](reports/development-plan.md#stage103)、[本轮验收](analysis/game-install-context-v1/validation-stage103.json)、[交付清单](analysis/delivery-manifest-stage103.json)。以下“当前”均为各阶段历史。

<a id="stage102"></a>
## 当前：正常安装链已静态核验，安装介质就绪（stage102 / 2026-10-30）

REA 对固定 `CG5Reg.exe` 取得25条记录、4处原字节锚点，闭合模块目录到 HKCU `CrossGatePUK3/Path` 的注册辅助链；按钮处理器未被默认分析定义为函数，其语义明确标为原字节、导入表与独立反汇编共同支持的推测。[静态证据](analysis/game-install-context-v1/cg5reg-static-stage102.json)。补齐 Inno 安装动作读取能力：从核验的上游源码构建 debug CLI，两安装包只读元数据读取均退出0。游戏安装器自身声明登记 Path，并有条件地启动平台安装器/登录器；声明尚非运行结果。[安装表与限制](analysis/game-install-context-v1/installer-metadata-stage102.json)、[依赖构建](analysis/game-install-context-v1/tool-build-stage102.json)。

原件不变，约1.1GB只读 ISO 已经限定来宾的一次传输进入现有 Windows，完整镜像及两个安装包的来宾 SHA-256 均匹配；E: 实际为 `MOLIINST102`，三个成员均 ReadOnly，两安装包签名检查均为 NotSigned。传输已退出且端口关闭。新原生快照已创建并核元数据，未测试还原；此前22项临时键盘菜单已逐项撤回，原有19项及顺序完全相同。[来宾回执](analysis/game-install-context-v1/transfer-session-stage102.json)、[恢复点](analysis/game-install-context-v1/recovery-point-stage102.json)、[菜单回读](analysis/game-install-context-v1/keyboard-cleanup-stage102.json)。

当前未运行安装器、原登录器或游戏。游戏包尚缺当前官方发布字节对应证明，官方下载页所链网盘被浏览器站点策略阻止，未尝试绕过；只待本次未知来源安装及对应 UAC 的执行时确认，不重问一般 Windows/联网/工具权限。新条款到实际展示时处理。[具体正常安装方案](analysis/game-install-context-v1/normal-run-plan-stage102.json)、[来源状态](analysis/game-install-context-v1/source-assessment-stage102.json)、[持续需求](reports/development-plan.md#stage102)。[本轮验收](analysis/game-install-context-v1/validation-stage102.json)、[交付清单](analysis/delivery-manifest-stage102.json)。完整目标 active/未完成；20规格仍7 observed/13 unknown，完整登录器、游戏可玩、网页/移动网页/微信及官方验收均未完成。以下 stage101 等状态为历史。

<a id="stage101"></a>
## 当前：原创观察工具已取得 Windows 实证，游戏安装上下文待核（stage101 / 2026-10-30）

正常访问与逐字输入已恢复，无待回复的人工操作请求。已修复原创 fixture 的 PE 节空洞：修正版在现有 Windows 中实际启动，观察器一次读取固定 8B，返回预期 cleanup/entry RVA `14c0/14b0` 并退出0；另一次仅验证自然结束，退出0、结束后原创进程计数0。旧样本、旧ISO与来宾两份 `.stage96` 备份保留。[具体身份、输出及限制](analysis/game-entry-runtime-v1/windows-observer-stage101.json)、[构建与运行](analysis/game-entry-v1/probe/README.md#stage101)。这只验收所列原创工具案例，未观察原游戏消费者。

REA 新增14条路径证据、4处原字节锚点，区分原生 `.update.journal` 与普通 `LauncherUpdater.log`。来宾更新器实际为旧 `22d561…e479`，与新 `7eb173…0fe1` 的选定路径代码/字串经源字节比较；精确 journal 候选路径 Test-Path=False，不能推定提交/ACK/恢复成功。[分析与版本桥接](analysis/launcher-update-recovery-v1/path-audit-stage101.json)。

游戏固定样本仍在 `client-probe`；观察器规定的 `launcher-probe` 游戏路径不存在。已证安装 Path 键的原生/32位查询未取得目录，INI过滤未返回所选键；不因此宣称系统无任何安装。下一步核实原安装包与正常安装上下文，再做正常游戏消费者观察；不搬动游戏或伪造注册表/IPC来满足门禁。[上下文核验](analysis/game-entry-runtime-v1/game-context-stage101.json)、[持续需求](reports/development-plan.md#stage101)、[操作知识库](reports/known-issues.md#vm-troubleshooting)。

完整四步目标仍 active；20规格仍7 observed/13 unknown，网页、移动网页、微信及官方兼容未验收。22项既有临时键盘菜单尚待精确撤回；原脚本/Restore未重放，本轮原程序启动0、策略仍Restricted。[目标审计](analysis/game-entry-runtime-v1/goal-audit-stage101.json)。下列 stage100/98 等“当前”均为历史。

<a id="stage100"></a>
## stage100: Mac access blocked (2026-10-29)

电脑控制在连续3个 goal turn 均报告 Mac locked、自动解锁失败；未取得新来宾状态、提交新命令或运行观察器/原游戏。三轮阻塞审计已通过，goal 工具实际返回 blocked，完整目标尚未完成。

仅已有一次正常解锁请求保留，无需重复授权或再点击终端。解锁后先看未提交的哈希查询，核文件/备份/journal/原创目录，再验原创工具；旧脚本/Restore/启动不重放。22项临时菜单因锁屏尚未撤回，精确清单保留。不改锁屏/安全或使用已禁止控制路径。下列旧“当前”均为各阶段历史。

[stage100 audit](analysis/game-entry-runtime-v1/access-blocked-stage100.json), [stage100 delivery](analysis/delivery-manifest-stage100.json).

<a id="stage98"></a>
## 当前：实际查询已返回，新锁屏暂停 Windows 步骤（stage98 / 2026-10-29）

新系统 NoProfile 终端已实际返回 D=MOLICUR89、有效 Restricted，以及两组指定进程计数均0；未改策略。普通文本分段后整行核对、原生 Enter 的路线已通过这些查询。[来宾实证](analysis/game-entry-runtime-v1/guest-preflight.json)。

随后只输入登录器哈希查询前半段、未提交；电脑控制再次报告 Mac locked、自动解锁失败，尚无哈希结果。已仅请求一次正常解锁，不再要求终端点击。恢复后先看未提交行，不能重复前缀或盲按回车。22个临时键盘菜单项仍待按精确清单撤回。[访问与未提交行](analysis/game-entry-runtime-v1/access-observation.json)、[输入恢复与清单](analysis/game-entry-runtime-v1/input-recovery.json)。

新 ISO 未挂载/传输，fixture/observer/原游戏启动仍0；未改 VM 硬件/网络/共享/安全，游戏优化未切换。先核文件、备份、journal、原创目录，再验工具，不重放旧脚本/Restore/启动。完整登录器、游戏协议及可玩实现、手机/微信/官方验收未完成。新锁屏是第2轮条件，goal active，不复用历史 blocked。[计划](analysis/game-entry-runtime-v1/run-plan.json)、[完整目标](analysis/game-entry-runtime-v1/goal-audit.json)。

[stage98 validation](analysis/game-entry-runtime-v1/validation.json), [stage98 delivery](analysis/delivery-manifest-stage98.json).

stage99 复查：CUA 仍在 Mac locked／自动解锁失败处停止，未取得新来宾状态或提交命令。同一新锁屏已连续2个 goal turn；上一轮有实际前检进展，本轮无开发进展。已有一次解锁请求保持，不追加终端操作或重复授权。完整目标 active，恢复后先看未提交的哈希查询，再核文件/目录并验原创工具。[本次复查](analysis/game-entry-runtime-v1/access-recheck-stage99.json)。

<a id="stage97"></a>
## 当前：Mac锁定持续，进入阻塞状态审计（stage97 / 2026-10-29）

新鲜电脑控制再次在绑定Parallels时报告Mac locked/自动解锁失败，未取得来宾状态或提交命令。同一访问条件从stage95至97连续三轮存在；前两轮独立静态/工具工作已完成，当前未找到能继续正常运行验证或恢复业务消费者的独立动作。[实际访问](analysis/game-runtime-access-v1/access-observation.json)、[完整要求与路线审计](analysis/game-runtime-access-v1/blocked-audit.json)。

stage96的1421交付文件、固定游戏与已编译观察器/fixture/数据CD身份均重核未变。本轮无产品/游戏实现或Windows实测；615Node/Chrome与26主机边界检查保持各自历史范围。完整登录器、真实游戏消费者/协议、可玩游戏及移动网页/微信/官方验收仍未完成。[验收](analysis/game-runtime-access-v1/validation.json)、[交付清单](analysis/delivery-manifest-stage97.json)。

阻塞审计满足三轮门槛，交付回读后提交goal blocked，完整四步目标与既有Windows/联网/工具授权保留。已有单次人工解锁问题不重复发送；正常手动解锁后先核新鲜状态并做原创工具Windows验收，不重放current.ps1/Restore或旧启动额度。下方旧“当前”按对应阶段理解。

<a id="game-stage96"></a>
## 当前：游戏入口与回调注册边界已定位（stage96 / 2026-10-29）

**事实：** 对固定游戏 `cg_se_3000.exe`（SHA256 `9baa0d26…d3126`）新增 REA 33记录、6函数和7个源字节锚点，已追到 PE入口→CRT→既有命令行 helper→运行时回调注册/间接调用。两个回调槽静态均为零，实际消费者仍未知；未改保护或重建原 `.text`。[证据与限制](analysis/game-entry-v1/static-audit.json)。

已补充原创固定槽只读观察工具：26项主机边界检查、两份 x86 PE 各两次确定性构建、13条工具 REA记录/5字节锚点及4成员数据CD回读通过。**Windows fixture/工具与游戏观察尚未运行**，这些结果不计作游戏实现或兼容。[构建与待执行流程](analysis/game-entry-v1/probe/README.md)、[验收](analysis/game-entry-v1/validation.json)。

当前 Mac 仍锁定，本轮来宾命令/原程序启动/旧脚本重放均0，已有单次人工解锁问题保持。完整登录器、游戏协议/可玩实现、移动网页/微信/官方验收仍未完成；615 Node/Chrome 为 stage95 已有证据，本轮产品/native 未改。[完整目标与下一步](analysis/game-entry-v1/goal-audit.json)、[交付清单](analysis/delivery-manifest-stage96.json)。下方旧“当前”均按对应阶段理解。

## 当前：更新器差异核实与恢复日志解析（stage95 / 2026-10-29）

新内嵌更新器与上一版只差26字节，全部是PE/调试时间戳与PDB GUID；其余文件字节、代码/数据/资源/重定位均相同，已分析的18个函数体逐字节对应。对新hash独立REA取得9函数/35记录、8源锚点并导出关闭，未执行分析副本。[差异分类](analysis/launcher-update-recovery-v1/byte-comparison.json)、[静态证据](analysis/launcher-update-recovery-v1/static-audit.json)。

新增共享纯函数 `parseWin32LauncherUpdateJournalHeader`，读取16字节日志头，验证标记、版本、阶段1..5和XOR一致性。它只返回最后记录的阶段，不读取文件、执行恢复或证明ACK/认证成功。27份独立Python向量、10定点、完整45文件615项Node及Chrome27向量/6组断言通过。[先行规格](analysis/launcher-update-recovery-v1/implementation-spec.json)、[使用与接口](shared/README.md#launcher-stage95)、[验收](analysis/launcher-update-recovery-v1/validation.json)。

本轮电脑控制实际返回Mac锁定，已发送一次解锁请求，来宾命令/新原程序启动均0，没有重放已消费的临时策略授权或Restore。stage94新EXE和备份只作为最后已知状态，当前实际journal仍未读取。[访问记录](analysis/launcher-update-recovery-v1/access-observation.json)。完整登录器、游戏消费者/协议、可玩实现、手机/微信/官方验收仍未完成；goal当前active，解锁后继续实际事务和正常消费者核验。

## 当前：正常首屏、更新后新样本与配置对刷新（stage94 / 2026-10-29）

用户已批准当次仅进程 RemoteSigned，四个固定脚本入口各执行一次。Verify/Install 通过；一次显式启动的父进程退出0，随后观察到更新器、V2.01 网吧模式主界面及普通退出，无账号或游戏操作。退出后 EXE 已成为新公开包的相同字节；Restore 按哈希保护停止，**未还原 EXE**，四文件备份保留。四个子 PowerShell 均已返回，有效策略仍为 Restricted。[运行记录](analysis/launcher-current-runtime-v4/observation-readback.json)、[恢复停止与现状](analysis/launcher-current-runtime-v4/restore-stopped.json)、[策略回读](analysis/launcher-current-runtime-v4/policy-after.json)。

新 packed SHA256 为 `6d459ddbdf80a86cf7a1e41b99ab7fb575b42842d7163522efb3c9fa6e6ac987`，1666048B；独立 UPX 分析副本通过 REA/Ghidra 核对配置对路径，47证据、10源字节锚点已导出关闭。内嵌更新器与上一版同大小而不同hash，未沿用全部旧结论。窗口进程归属/子链/事务ACK未完整捕获。[新样本及静态边界](analysis/launcher-current-runtime-v4/static-audit.json)。

新增显式 `createWin32LauncherCatalogRefresh`，连接现有 HTTP 准备和 IndexedDB 整对提交，检查 revision、失败与取消时机；不改页面默认入口。22定点、44文件完整605项Node通过；Chrome真实ESM/IndexedDB的11项、73GET最终通过，首轮一次网络审计失败保留。[先行规格](analysis/launcher-current-refresh-v1/implementation-spec.json)、[接口与运行](web/README.md#launcher-stage94)、[验收](analysis/launcher-current-refresh-v1/validation.json)。

完整登录器、新版更新器/原生恢复故障矩阵、游戏消费者/协议、可玩游戏和手机/微信/官方验收仍未完成。继续按 REA登录器→独立实现→REA游戏→实现游戏推进；旧“当前”章节均为对应阶段历史。

## 当前：原版运行被脚本策略阻断，具体确认待答（stage93 / 2026-10-28）

当前Parallels Windows窗口与普通输入可用，实际执行一次只读Get-ExecutionPolicy，返回Restricted并回到空提示符。未重试被拒脚本，未改策略或运行新登录器/游戏。stage90的仅进程RemoteSigned具体问题仍未收到回复；概括Windows/联网/工具授权继续有效。[新鲜观察](analysis/launcher-current-runtime-v3/observation.json)、[具体方案](analysis/launcher-current-runtime-v2/policy-proposal.json)。

完整四步及网页/移动网页/微信目标未完成：登录器只完成已证契约子集；游戏消费者/协议、独立可游玩实现与平台/官方验收仍缺。旧待办中的inventory/MAP01已在真实代码实现；固定游戏缓存本轮重核hash，原.text的raw_size仍为0。此前583Node/Chrome结果仅按原范围保留，本轮未重跑或新增产品功能。[七项要求/二十项规格与路线审计](analysis/launcher-current-runtime-v3/blocked-audit.json)、[验收](analysis/launcher-current-runtime-v3/validation.json)。

同一具体策略确认条件从stage90至93连续存在四轮，独立配置/元数据工作已在中间两轮完成；本次阻塞审计满足门槛，[交付回读](analysis/delivery-manifest-stage93.json)后提交目标blocked状态。目标没有缩减、完成或取消。恢复时从既定Verify前检开始，不重问用户已确认没有的PDB或一般Windows/工具授权。下方各stage的“当前”均描述其历史时点。

## 当前：新版元数据与显式 HTTP 入口已实现（stage92 / 2026-10-28）

REA补查新版登录器12个函数和8处指令，确认摘要按空格/CR/LF集合修剪后截32字节、保留大小写比较，更新地址第二token为声明包长；配置分支把摘要文件请求成功作为继续条件，再下载两份XML并比较原始字节。共享核心新增三项新版元数据API，浏览器新增createWin32LauncherBootstrap，接入严格Win32更新候选校验和整对配置检查。[分析证据](analysis/launcher-current-metadata-v1/static-audit.json)、[接口](reports/module-interfaces.md#launcher-stage92)、[运行用法](web/README.md#launcher-stage92)。

63份原创Python向量、25项新增定点测试通过；完整Node实跑 **583/583**，Chrome实际ESM及回环HTTP共69个GET、0错误/失败。12个原字节锚点相符，51条REA证据已导出并关闭。[验收](analysis/launcher-current-metadata-v1/validation.json)、[交付清单](analysis/delivery-manifest-stage92.json)。

默认页面继续使用旧profile；本轮没有Windows操作或执行策略变更，stage90仅进程RemoteSigned具体问题仍待答。完整登录器的原生启动/更新事务、游戏消费者与协议、可游玩实现及移动网页/微信小程序/官方兼容验收均未完成。下方各stage描述当时结果，不代表当前再次核验。

## 当前：新版配置对的检查与比较已实现（stage91 / 2026-10-28）

REA补查新版主程序11个函数、17条证据，确认配置容器检查、逐字节比较和成对提交/恢复分支。共享核心新增`inspectWin32LauncherCatalogContainers`与`compareWin32LauncherCatalogPair`：前者只检查大小写精确的根/直接容器，后者比较调用者提供的原始字节；完整游戏/区域解析器保持严格。[静态审计](analysis/launcher-current-catalog-v1/static-audit.json)、[接口](reports/module-interfaces.md#launcher-stage91)。

原创Python提供24组XML及29组字节向量；内部处理指令是明确不支持的独立XML子集差异，原向量保留。完整Node实跑**558/558**；Chrome实际ESM同向量及四组附加检查通过，0错误/失败。14个原样本字节锚点核对通过，REA已导出关闭。[本轮验收](analysis/launcher-current-catalog-v1/validation.json)、[运行例](shared/README.md#launcher-stage91)。

Windows仅进程RemoteSigned确认仍待答，本轮没有策略、VM或原程序动作；新接口尚未接入页面默认初始化，也未实现原生文件提交/恢复。完整登录器、游戏消费者/可游玩游戏、手机/小程序和官方验收继续未完成。下方旧“当前”均按其阶段理解。

## 当前：来宾输入与介质核验通过，脚本被执行策略阻止（stage90 / 2026-10-28）

用户正常解锁后，实际终端输入已恢复，Windows PowerShell版本为5.1.26100.4202。已挂载`D: MOLICUR89`，九个成员SHA256均匹配主机清单；只读语法入口返回`MOLI_PARSE_OK`。随后`verify.cmd`在加载脚本时被Windows拒绝，退出1，尚未执行四文件前检、备份、替换或新版启动器。[来宾回执](analysis/launcher-current-runtime-v2/guest-preflight.json)。

五个执行策略作用域均为Undefined，按微软说明符合Windows客户端默认Restricted。已停止脚本路径，没有更改策略或把脚本改为内联执行；仅为固定脚本、独立进程使用RemoteSigned的[具体方案](analysis/launcher-current-runtime-v2/policy-proposal.json)等待当次确认。现有Windows/联网/工具授权保持。完整登录器、游戏消费者、可游玩游戏与目标平台/官方验收仍未完成；本轮产品及native未改，548Node仍为stage88实跑结果。下方旧“当前”仅描述各自时点。

## 当前：新版正常启动的只读介质与观察工具已准备（stage89 / 2026-10-28）

已准备固定新packed候选的只读数据CD及原创Verify/Install/Observe/Restore入口：先核旧文件/候选hash与空闲进程，再备份四文件，仅替换原路径EXE；普通UAC运行一次，单独记录UAC/父进程时间，返回后最多观察90秒，不强杀。恢复仅覆盖工具替换的EXE，不宣称全VM回滚。[具体方案](analysis/launcher-current-runtime-v1/run-plan.json)、[脚本](analysis/launcher-current-runtime-v1/current.ps1)。

缺少的PowerShell检查能力已用项目内微软签名便携版补齐；12项原创主机文件/进程测试通过，ISO9成员逐字节回读通过。发现的typed-null参数问题已修正。**这些是macOS工具/介质验证，Windows5.1/UAC/NTFS及原程序运行仍未验。**[工具来源与核验](analysis/launcher-current-runtime-v1/tool-readiness.json)、[测试](analysis/launcher-current-runtime-v1/host-tests.json)、[介质](analysis/launcher-current-runtime-v1/media-validation.json)。

电脑控制本轮两次仍报告Mac locked/自动解锁失败；未挂载新CD、提交来宾命令或运行新候选，原解锁请求保持。现有授权继续，需正常解锁并恢复实际输入后执行上述核对；游戏消费者、完整登录器/游戏和目标平台/官方验收均未完成。产品/native未改，548Node是stage88已实跑结果，本轮未重跑。[本轮验收](analysis/launcher-current-runtime-v1/validation.json)。


## 当前：新版候选校验已实现，更新器关键分支已定位（stage88 / 2026-10-28）

**已实现并实测：** 新增纯字节接口 `decodeWin32LauncherUpdatePackage`，对新版单EXE更新包检查声明长度、CRC/MD5、名称/解压预算及PE32/i386/GUI头字段。保留旧首条目解码行为；新接口采用明确的32MiB/ASCII子集，不进行文件替换或执行。[规格](analysis/launcher-current-updater-v1/implementation-spec.json)、[接口](reports/module-interfaces.md#launcher-stage88)。

本轮REA分析新版内嵌更新器的18个函数、29条证据，已导出并关闭；确认父进程等待、事务/回滚和启动ACK静态分支。当前包的ACK资源仅静态确认存在。28份原创Python向量与4项新边界测试通过，完整Node本轮实跑**548/548**；真实新包也通过新接口，与Python解包逐字节相同。[来源审计](analysis/launcher-current-updater-v1/static-audit.json)、[真实包](analysis/launcher-current-updater-v1/real-candidate-check.json)、[验收](analysis/launcher-current-updater-v1/validation.json)。

电脑控制本轮再次报告Mac锁定，已请求正常解锁；未提交来宾命令、传输或运行新EXE。解锁后先恢复可证明的终端输入，再验证可恢复的新版本正常启动、更新器实际结果和游戏消费者。完整登录器、游戏、浏览器/手机/小程序及官方兼容仍未完成。以下旧“当前”保留各自时点。


## 当前：旧登录器已进入自动更新交接，新包完成初步 REA 核验（stage87 / 2026-10-28）

当前 Windows 已恢复过实际终端输入，按既有授权普通 UAC 启动固定旧登录器一次。PID7684，来宾显示15:11:59启动、15:12:03退出、code0；未观察到稳定登录器窗口。退出确认晚于原90秒观察限，不能称实时监控全程通过。[启动记录](analysis/launcher-runtime-v2/startup-observation.json)。

受控日志尾部显示开始更新并结束主程序，与旧 REA 成功创建更新器的交接分支相符。`-Force`发现隐藏更新器，hash匹配原内嵌样本；登录器/两XML原hash不变。没有子进程PID/退出或文件替换成功证明，不把code0当登录成功。[运行后文件与诊断](analysis/launcher-runtime-v2/postrun-files.json)。

当前公开摘要已变为`b34278635899e7c1e4aa4cb67b48001a`；取得1469515B ZIP，现有shared解析器通过CRC/MD5，1496576B输出与Python标准库逐字节一致。新packed SHA256`71180e5b…07cb69a`、UPX分析副本`c7ba69f7…bb32384`分别建档；REA另做14条选定证据并导出关闭。新814080B内嵌更新器也不同；不套旧偏移/ABI，不认证HTTP来源或宣称完整兼容。[候选实测](analysis/launcher-runtime-v2/independent-candidate.json)、[独立对照](analysis/launcher-runtime-v2/candidate-independent-comparison.json)、[REA台账](analysis/launcher-runtime-v2/rea-followup.json)。

终端回车再次间歇无响应；现有输入行只是只读日志前缀hash，尚无结果。完整登录器、游戏、移动/小程序及官方验收仍未完成；产品代码未改，516Node仍为stage75历史。下一步按[具体切面](analysis/launcher-runtime-v2/next-slice.json)核来宾加载依赖/新版本正常入口，再推进消费者。[本阶段验收](analysis/launcher-runtime-v2/validation.json)。下方旧“当前”仅表示各自时点。

## 当前：VM已正常继续，公开清单未取得（stage86 / 2026-10-28）

**最后访问复查：** 电脑控制在读取窗口前再次报告Mac locked且自动解锁失败，未提交原启动命令。需正常手动解锁并恢复既有终端焦点操作；当前Windows/联网授权保持。[最新工具结果](analysis/launcher-patch-live-v1/access-recheck.json)。

发现既有Windows自动暂停后，已通过原生“恢复”正常继续，覆盖层消失；新的PowerShell图标点击仍未打开终端，原登录器/UAC提交0，既有人工终端焦点请求保持。[恢复观察](analysis/launcher-patch-live-v1/vm-resume.json)。

独立网络取证的三次请求均未取得正文：当前目录HTTP远端关闭、正常HTTPS握手EOF、历史已核验怀旧区域PIP的单次Update.TXT请求15秒超时。没有新目录/补丁清单、载荷下载、原程序/账号或游戏验证；不能据旧成功或旧地址宣称本次可达。[当前目录](analysis/launcher-patch-live-v1/network-observation.json)、[HTTPS](analysis/launcher-patch-live-v1/https-catalog-followup.json)、[历史地址](analysis/launcher-patch-live-v1/retained-source-probe.json)。

全目标未完成；连续来宾输入阻碍已做[阻塞审计](analysis/launcher-patch-live-v1/blocked-audit.json)。恢复可用终端输入后按既有授权重核guesthash并继续正常登录器→游戏消费者，保留全部源码/证据与网页、移动网页、小程序目标。[验收](analysis/launcher-patch-live-v1/validation.json)。

## 官网分发来源已对应，等待来宾输入恢复（stage85 / 2026-10-28）

已从当前官网实际HTTP链接取得1682288B ZIP，内含安装器与`moli/POLCN_Setup.exe`逐字节一致；重新静态解出的原登录器/两XML也均匹配来宾hash。REA独立清单确认同安装器，已导出并正常关闭。此前来源未对应的问题已补上分发链；HTTP传输及原程序未签名的限制仍保留。[来源链](analysis/launcher-provenance-v1/installer-chain.json)、[中断后重核](analysis/launcher-provenance-v1/installer-chain-followup.json)、[REA记录](analysis/launcher-provenance-v1/rea-archive.json)。

用户解锁后已重新绑定并读取当前Windows，Parallels原生键盘菜单Win+Q确实打开来宾搜索；普通点击和文字尚未在来宾中生效，已请求手动打开PowerShell并点终端空白处恢复焦点。启动命令未输入/提交、UAC接受0次；重绑后未重核来宾hash，完整目标未完成。最新主机配置仍Shared/NAT Connected1、Mac目录隔离1。[当前输入补验](analysis/launcher-provenance-v1/access-followup.json)、[启动方案](analysis/launcher-provenance-v1/source-assessment-and-run-plan.json)、[验收](analysis/launcher-provenance-v1/validation.json)。较早[locked记录](analysis/launcher-provenance-v1/access-observation.json)与下方旧“当前/等待”均按其时点理解。

## 原登录器联网启动前核对（stage84 / 2026-10-28）

现有Windows已联网；本轮只读核对原登录器及两份XML，三个SHA256均匹配固定样本。Windows返回`NotSigned`，发行者来源仍未核实。主机再次取得33B公开更新摘要，所称MD5匹配原登录器；HTTP摘要不能认证来源。[来宾核对](analysis/launcher-runtime-v1/guest-preflight.json)、[更新摘要](analysis/launcher-runtime-v1/update-metadata-preflight.json)。

下一步的[单次正常启动方案](analysis/launcher-runtime-v1/normal-start-plan.json)已准备，电脑控制工具要求在运行此来源未核实的软件时具体确认，问题已发出。本轮原登录器/游戏执行0次，尚未获得联网首屏；完整登录器、游戏与官方兼容仍未完成。沿用现有联网/普通工具授权，不重复泛化确认。[当前需求](reports/development-plan.md)、[验收](analysis/launcher-runtime-v1/validation.json)。

## 当前进展：Windows联网与原创x86调试实测（stage83 / 2026-10-28）

已按用户最新要求直接接通现有Parallels共享网络（NAT），来宾对微软文档站的正常HTTPS HEAD返回200。网络Connected1；Mac文件共享隔离保持，未设桥接或端口转发。[联网实测](analysis/runtime-observer-v3/network-observation.json)。

原创x86目标普通运行退出0；改用SDK随附x86 CDB后，实际观察到7个已审阅API返回位置，ASLR加载基址与模块表一致。补验明确看到目标退出事件code0，随后正常关闭调试器并返回终端。ARM64 CDB的WOW64上下文失败、输入损字、脚本语法及退出后多余g的错误均保留，没有据此判断游戏兼容。[正常运行](analysis/runtime-observer-v3/fixture-normal-run.json)、[7条记录及目标退出](analysis/runtime-observer-v3/fixture-lifecycle.json)、[会话关闭](analysis/runtime-observer-v3/fixture-session-close.json)。

这次通过的是固定原创目标的断点/继续/退出观察；未记录每事件时间，CDB默认打印过该原创目标的通用寄存器，不能宣称通用采集器隐私或既有计时契约通过。原登录器/游戏本阶段尚未执行，产品源码未变，516项Node仍为stage75历史。下一步进入原登录器正常联网流程，再恢复游戏消费者/协议证据；完整目标保持active且未完成。[本轮验收](analysis/runtime-observer-v3/validation.json)、[清单](analysis/delivery-manifest-stage83.json)。下方旧“当前”均按其阶段理解。


## 当前进展：Windows调试工具已安装并启动（stage82 / 2026-10-28）

已从微软正式SDK页取得26100.9457离线ISO，并补齐主机UDF/MSI读取及签名工具。19项选定组件签名/时间戳核验、15核心文件双解码字节对照通过；两Redist MSI在主机核验器中的摘要异常仍未定，保留失败，未手动运行、改写或重签。[组件](analysis/runtime-tool-readiness-v1/sdk-audit.json)、[签名范围](analysis/runtime-tool-readiness-v1/signature-audit.json)。

人工焦点恢复后，已用原生菜单接入D:只读介质。Windows安装器摘要匹配、签名Valid；用户对当前SDK许可页明确回复后已接受本次许可，关闭可选统计，仅选择Debugging Tools for Windows（页面估算534.0MB），核对微软发布者并批准安装UAC，安装器显示完成后正常关闭。来宾ARM64 CDB摘要匹配、签名Valid，`-version`实际返回10.0.26100.9457、退出0。[安装操作](analysis/runtime-tool-readiness-v1/sdk-installation-followup.json)、[来宾自检](analysis/runtime-tool-readiness-v1/cdb-windows-check.json)。

网卡断开与Mac共享隔离保持；SDK内全部子包执行链未逐项采集。原创x86目标、调试采集/隐私、游戏消费者与协议、平台和官方互操作仍未验，完整目标继续active。下一步验证原创测试程序及元数据采集，再推进原客户端正常链路。[本轮验收](analysis/runtime-tool-readiness-v1/validation.json)。以下旧“当前”及早期JSON是相应时间的历史，不能替代本段最新结果。


## 当前进展：普通GUI恢复，恢复点已建立（stage81 / 2026-10-28）

用户正常解锁后，已重新取得现有Parallels Windows11桌面，沿既有联网/工具授权继续。原生快照`Moli-before-observer-install-20261028-stage81`创建完成且元数据存在，尚未测试还原。[恢复点回执](analysis/runtime-install-v1/recovery-point.json)。来宾Task Manager的三个明确提交关键词无结果，仅作有限检查；WinDbg已安装应用查询仍无匹配。

网络Source下拉未展开，随后一次“设备→网络”父菜单动作出现Parallels关键错误；正常关闭报告后Windows桌面仍可读。仅保存去敏错误摘要，未发送报告、选择网络类型或重试该菜单；文件配置仍Connected0/IsolatedVm1。已请求用户手动设为共享网络并保留Mac隔离，完成后核实来宾网络，再验正式观察器和原创x86目标。[实际操作与边界](analysis/runtime-install-v1/gui-observation.json)、[错误摘要](analysis/runtime-install-v1/parallels-error-summary.json)、[操作知识库](reports/known-issues.md#vm-troubleshooting)。完整目标恢复active且未完成；未运行原程序或原创目标，产品代码未变。下方旧“当前/blocked”均保留为当时状态。

## 当前状态：普通界面访问阻塞（stage80）

同一CUA访问阻碍在恢复目标后连续三轮出现，本轮新读仍在应用列表前报告Mac locked，实际Mac/Windows画面未取得。已有联网/工具授权有效；主机准备已完成，官方固定工具包请求403，Windows工具/原创目标尚未实测，符合blocked门槛。完整游戏未完成。[逐项阻塞审计与恢复条件](analysis/runtime-access-blocked-v1/blocked-audit.json)。

停止重复检查或下载，不走其他控制/安全配置路径。恢复普通电脑控制访问后，可沿既有授权继续Windows工具及原创目标验收，再推进正常客户端消费者；现有代码、证据和介质保留。下方active描述为相应阶段历史。


## 当前卡点：Windows观察尚未开始（stage79）

普通电脑控制再次在应用列表前报告Mac locked，未取得Parallels界面。按已有工具/联网授权，对微软公开固定WinDbg包作HEAD及正常GET，均403、0字节；没有取得/验签/安装包，该地址停止请求。[实测与下一路线](analysis/runtime-access-v1/access-status.json)。原创x86目标和介质保留；正常手动解锁请求已发送，后续沿正式安装界面验工具和原创目标。无需重复授权，完整游戏仍未完成。


## 当前恢复：联网快照与原创观测目标（stage78 / 2026-10-27）

用户已批准联网测试及本项目工具操作，目标继续 active。五个已证更新/配置路径均返回 HTTP200，两份XML与响应MD5一致；原启动器及GameList与本次摘要/字节匹配，RegionList已变化，按已证规则需要单独刷新。DNS返回非全局地址，HTTPS握手失败，发行方身份/Windows联网/游戏兼容仍未证明。[当前字节对照](analysis/runtime-observer-v2/current-source-comparison.json)、[网络记录](analysis/runtime-observer-v2/network-observation.json)。

已复用现有MinGW编译原创freestanding x86观测目标：10项主机C模拟用例、16处REA/原字节调用核验及两次构建一致通过，只读ISO两文件回读匹配。尚未导入/运行Windows目标或安装WinDbg；电脑控制工具报告Mac locked，已请求正常手动解锁。[准备与验收](analysis/runtime-observer-v2/validation.json)、[现有运行入口](analysis/diagnostic-preparation-v1/synthetic-readme.md)、[交付清单](analysis/delivery-manifest-stage78.json)。完整登录器、游戏及官方/目标平台验收仍未完成；下方blocked记录是新授权前的历史状态。


## 当前状态：游戏业务材料缺口，目标阻塞（stage77 / 2026-10-27）

同一缺口已连续三轮核实：登录器已证契约有有限实现，游戏argv/CGSharedMem/会话与协议仍未恢复，完整目标未完成。原包2,368项路径与哈希未变，四DLL定点字面检查没有新增入口，REA会话已关闭；公开资料定向查询也未取得版本匹配的协议/可分析构建，不据此宣称此类材料不存在。[逐项审计与恢复条件](analysis/game-consumer-blocked-v1/blocked-audit.json)。

当前需要合法提供的版本匹配可分析构建或权威协议/去敏向量的本地路径。PDB只可能补名字/类型，不能单独恢复缺失代码。停止重复扫描和自动扩大范围，保留所有现有代码、样本、证据与报告；不把资源预览或本机登录测试改称游戏完成。

## 当前游戏消费者静态核验（stage76 / 2026-10-27）

已进入游戏侧REA分析，固定Code11样本哈希与历史一致。补出命令行缓存的读取函数及13个注册/维护类开关引用，34处源字节锚点通过；这些不能作为游戏argv或认证规格。`CGSharedMem/gid:/glt:`仍无已解析消费者，原`.text`无文件字节，游戏实现尚缺业务证据。[分析](reports/game-static.md#game-consumer-v1)、[验收](analysis/game-consumer-v1/validation.json)、[交付清单](analysis/delivery-manifest-stage76.json)。

REA/Ghidra已可用，本阶段没有缺失的普通工具依赖。需要版本匹配的可分析构建或权威协议资料；匹配PDB只可能补名字/类型，不能单独恢复缺失代码。现有登录器限定实现与资源核心保留，完整登录器、游戏及目标平台/官方兼容仍未完成。

《魔力宝贝》跨平台客户端研究工程，目标为**网页、手机与小程序游玩，最终实现经过授权和验证的官方服务器互操作**。当前可解析本地资源/配置、保存候选缓存，并通过网页对原创本机TCP对端执行登录器字节交换；不能登录或游玩官方服务器。暂按“手机＝移动网页、小程序＝微信小程序”规划；独立 iOS/Android App、微信小游戏和其他小程序形态待确认。目录保留原名。

工作主线是 **可追溯的逻辑/协议分析 → 规格 → 独立实现 → 兼容性验收**。`native/` 保留第一阶段 Swift 原型和测试，不再增加 Mac 专用功能；新增 `shared/` 为纯 JavaScript ESM 核心，`web/` 提供本地登录流程、配置、候选缓存与资源核验。没有 Wine/CrossOver、远程串流、官服代理或生产会话实现。

## 当前首次配置规格与“仅刷新”流程（stage75 / 2026-10-27）

登录器v30用REA闭合首次Config的查询身份、条件、原命令/cwd及等待/写标记意图，并保留原ConfigEXE正文。实际页面新增“仅刷新通行证”：更改后重准备，魔力分支不枚举资源、不请求游戏进程，交接反馈与普通分支区分；未提供目录不会静默退回映射流程。首次Config只实现纯数据计划，不执行程序或读写真实账号标记。[规格](reports/launcher-static.md#launcher-v30)、[接口](reports/module-interfaces.md#launcher-v30)、[运行](web/README.md#launcher-v30)。

516项Node（新15）、26源锚点/3反例、24独立字节/9结果向量及固定配置24项对照通过；Chrome9项新流程/32项回归及交付示例通过。门槛审计接受已证登录器自身契约的限定实现，下一步进入游戏侧argv/CGSharedMem静态联合验证；完整登录器、游戏、设备/官方兼容仍未完成。[门槛审计](analysis/launcher-v30/launcher-gate-audit.json)、[验收](analysis/launcher-v30/validation.json)、[清单](analysis/delivery-manifest-stage75.json)。本阶段两张初始首屏PNG发生同名重写，已保留回执并用独立目录/拒覆写保护重验，[留痕](analysis/launcher-v30/artifact-output-incident.json)。

## 保留所选资源的本机保存与恢复（stage74 / 2026-10-27）

登录器v29新增独立资源快照和浏览器事务缓存。明确选择补丁后，可检查版本、保存所选资源；重载后按当前配置/区域/目录/编码读取，核验文件摘要，再明确选择。并发版本冲突拒绝覆盖，取消及写入失败保留旧记录；提交完成后的取消如实报告已保存。缓存含资源bytes和非秘密绑定，不含账号/确认，也不写原安装目录。[来源与边界](reports/launcher-static.md#launcher-v29)、[接口](reports/module-interfaces.md#launcher-v29)、[运行](web/README.md#launcher-v29)。

Node501/501（新10）、真实Chrome IndexedDB12项、页面13项及原补丁13项/无补丁Galaxy6项回归通过；4174示例另经保存→重载→恢复→原创交换核验并正常退出。候选继承1024文件/单32MiB/总64MiB范围，不是完整安装库或可信来源证明；完整登录器、后续游戏与设备/官方兼容仍未完成。[验收](analysis/launcher-v29/validation.json)、[交付清单](analysis/delivery-manifest-stage74.json)。

## 保留登录页补丁准备与选择（stage73 / 2026-10-27）

登录器v28已接通实际页面：填写目录、选择可选基文件夹、检查补丁、取消、审阅文件列表、明确选择或放弃。所选候选的文件名进入资源参数；目录、编码、基文件、配置或页面生命周期变化会清除旧候选和交接。复用v26/27已证REA规格，本轮没有重复查询原函数。[来源与边界](reports/launcher-static.md#launcher-v28)、[接口](reports/module-interfaces.md#launcher-v28)、[运行说明](web/README.md#launcher-v28)。

运行`node web/examples/launcher-browser-game-patch-local.mjs`后打开其本机地址，可走原创补丁→选择→本地交换→完整交接流程。Node491/491（新13）、桌面/390px补丁13项和默认无补丁/Galaxy回归6项通过；交付示例另经实际浏览器和独立Python对端核验并正常退出。候选保留在页面内存，来源仍未认证；安装目录提交/恢复、完整登录器、后续游戏与目标设备/官方兼容仍未完成。[验收](analysis/launcher-v28/validation.json)、[交付清单](analysis/delivery-manifest-stage73.json)。

## 保留配置到补丁候选下载（stage72 / 2026-10-27）

登录器v27已把所选游戏/区域的原始Code、PatchEXE正文、PIP/PPort及显式目录绑定到补丁计划，闭合派生备份名、原始参数顺序和退出码规则；新增显式来源、总时限、可取消的实际HTTP候选准备。创建后追加会按操作顺序读取前一步候选，只在全部成功后返回最终文件。[来源](reports/launcher-static.md#launcher-v27)、[接口](reports/module-interfaces.md#launcher-v27)、[本机运行](web/README.md#launcher-v27)。

32源锚点/3负例、32独立生产向量/21退出码向量及固定配置8命令通过；Node478/478（新21），Chrome11流程/13次更新GET及原字节核心回归通过。候选仍未认证，没有写安装目录或执行补丁器；登录页面补丁交互、原生恢复、完整登录器、后续游戏及目标平台/官方兼容仍未完成。[验收](analysis/launcher-v27/validation.json)、[清单](analysis/delivery-manifest-stage72.json)。

## 保留游戏补丁器字节核心（stage71 / 2026-10-27）

登录器v26用REA追完固定Patcher的Update.TXT分块、三种操作工厂、字段消费者和ZIP解包链；独立核心新增create/append/replaceto内存候选。补丁URL虽以`.bz2`结尾，已证消费者实际读取ZIP；复用现有Pako，不新增猜测的bzip2依赖。最终摘要强制核对、相对ASCII路径及失败原输入不变是独立严格政策。[静态证据](reports/launcher-static.md#launcher-v26)、[接口](reports/module-interfaces.md#launcher-v26)、[运行示例](shared/README.md#launcher-v26)。

35函数/2短读取、28源锚点/3负例、31独立语法向量/10候选场景通过；Node457/457（新21），Chrome实际ESM同向量及8坏包通过。没有新增UI、安装目录写入或官方流量；内存候选仍未认证，原生替换/回滚、完整登录器、游戏和目标设备/官方兼容继续未完成。[验收](analysis/launcher-v26/validation.json)、[交付清单](analysis/delivery-manifest-stage71.json)。

## 保留Galaxy分组选择（stage70 / 2026-10-27）

登录器v25已用REA确认并实现Galaxylist/Galaxy的Name、Gamecode和参数正文。含对应分组的配置会显示“分组（Galaxy）”，必须明确选择；选中分组的原正文进入额外命令参数，原始记录序号保留，重名歧义拒绝。切换清旧候选/输入/确认/目录/交接，缓存恢复也不复用旧分组。[规格](reports/launcher-static.md#launcher-v25)、[运行](web/README.md#launcher-v25)、[验收](analysis/launcher-v25/validation.json)、[清单](analysis/delivery-manifest-stage70.json)。

REA新增6个不同函数/9记录（含1份已有helper重查，不计新函数），26源锚点/3负例、63独立Python向量通过。Node436/436（新15），Chrome6分组流程/9无分组回归通过，各98本机请求；固定安装配置5游戏/12区域/8可用选择与5消息向量也通过。原样本RegionList无Galaxy条目，真实服务器分组/原运行时仍未验证；完整登录器、游戏、官方及目标设备保持未完成，继续原顺序。

## 保留目录与实际会话到统一交接（stage69 / 2026-10-27）

登录器v24把配置/区域、明确选择的本地目录与路径编码、实际回包候选接成同一个交接对象，持有命令/cwd/资源模式与映射写入。浏览器“准备游戏文件参数”读取所选文件夹的相对名字，核验后选候选显示字节/资源计数；不读取资产内容，不执行游戏。目录/资源/编码/配置变化和pagehide清旧数据，未尝试目录准备时保留原映射流程。[运行](web/README.md#launcher-v24)、[接口](reports/module-interfaces.md#launcher-v24)、[验收](analysis/launcher-v24/validation.json)、[清单](analysis/delivery-manifest-stage69.json)。

复用已验REA固定样本证据；新17/总421项Node通过，Chrome9项新流程/98请求与8项原交接回归/147请求通过，实际请求由独立Python对端核对。已复现并修复借出typedarray的fill可覆盖导致清理失效；现用固定内建方法，单个转移buffer也不阻止其余清理。路径编码独立选择，文件名限ASCII长名匹配子集；实际Win32/ACP、游戏消费/官方认证、更新信任/事务、手机真机和微信小程序仍未验收，完整目标继续。

## 保留启动参数与资源生产端（stage68 / 2026-10-27）

登录器v23新增[纯字节进程计划](shared/launcher-process.mjs)：按固定样本的空格、字段和七组资源次序生成命令/cwd数据，保留原枚举顺序、重复项和末条记录。仅接明确提供的当前字段/枚举快照，文件标题先限定ASCII/C大小写规则；不推断实际ACP、Windows匹配或游戏接受。[事实与限制](reports/launcher-static.md#launcher-v23)、[接口](reports/module-interfaces.md#launcher-v23)、[验收](analysis/launcher-v23/validation.json)、[清单](analysis/delivery-manifest-stage68.json)。

REA新增24函数/7短读取，共31记录至305；49源锚点/3身份或字面负例通过。Node404/404（新14），独立Python48进程/4枚举向量及Chrome实际ESM执行、5个既有资源文件名对照通过。本轮无新UI，也未执行游戏。运行`node shared/examples/launcher-process.mjs`可查看原创数据示例；网页运行入口沿用下方说明。本轮闭合参数生产子集；完整登录器、游戏、真实手机/小程序与官方兼容仍未完成，继续登录器的会话、更新和平台缺口。

## 保留候选到交接写入（stage67 / 2026-10-27）

登录器v22已把实际回包候选选择接到**有证据的映射写入生产端**。选择后页面显示映射名/写入长度，字节只在当前页面内存中持有；输入、编码、配置、文本或确认后的模式变化及pagehide都会关闭交接。取消模式切换保留当前选择。没有调用游戏消费者、创建Windows共享映射或执行游戏。[规格](reports/launcher-static.md#launcher-v22)、[运行](web/README.md#launcher-v22)、[验收](analysis/launcher-v22/validation.json)、[交付清单](analysis/delivery-manifest-stage67.json)。

REA新增4函数/7记录，确认NUL复制、unsigned32转小写32进制、尾空格；源文件21锚点、126原创字节向量/42候选投影通过。Node390/390（新10），Chrome8交接流程/9编码回归/17配置会话流程+1测量通过。pagehide只清内存却残留“交接就绪”显示的问题已复现修复。生产端字节正确不证明身份/票据有效、游戏接收或官方兼容；完整登录器和游戏仍未完成。

```sh
node web/examples/launcher-browser-local.mjs
```

打开输出地址→准备配置→公开原创输入`SyntheticU1` / `SyntheticP1`→逐页确认原创说明→交换→选择beta，可见`CGSharedMem，17字节；尚未交给游戏`。中文示例仍可用`--text-profile windows-936`或`utf-8`并明确选对应编码。下一步继续启动参数/资源及交接消费缺口；argv转义、真实账号/服务生命周期、更新信任/原生事务、游戏与目标设备/官方兼容继续单独验收。

## 历史保留方式设置与字段生命周期（stage66 / 2026-10-27）

登录器v21新增“**保存保留方式**”：明确保存“每次清空/本页可保留”，刷新可恢复该设置。账号、密码、账号编码、复选框选择和文本确认仍只在本页使用。原生已证UserMode整数读写与账号字段分开；新存储是独立浏览器格式，不能当作原Windows账号持久化等价。[规格](reports/launcher-static.md#launcher-v21)、[运行](web/README.md#launcher-v21)、[验收](analysis/launcher-v21/validation.json)、[交付清单](analysis/delivery-manifest-stage66.json)。

```sh
node web/examples/launcher-browser-local.mjs --text-profile windows-936
```

先准备配置；切换保留方式时确认清空，再点“保存保留方式”。保存只写一个非秘密模式值；刷新后账号为空、账号编码回ASCII、密码保留勾选回默认关闭，文本需重新确认。使用中文原创对端时仍须明确选择Windows-936及公开输入`合成用户甲` / `测试口令甲`。保存失败或回读不一致会显示“尚未确认”，当前页面仍可用。

REA新增5个函数/9条记录，补齐原文件720384B `.text`内26个字面字段偏移及析构/异常释放核对；这只是直接偏移清单，不能推导全程序没有其他账号存储。Node380/380（新11）；Chrome12项设置流程、9项编码回归和17项配置会话回归/1时限测量通过。实际ACP、账号持久化/服务身份与opaque寿命、可信更新/原生事务、游戏、Safari/手机真机/微信小程序及官方兼容仍未完成。stage65历史回执事故及恢复限制继续保留；本轮新回执独立写入v21。

## 保留账号编码与中文候选（stage65 / 2026-10-27）

登录器v20已接入明确选择的**ASCII / Windows-936 / UTF-8**账号字节编码、16字节计数与候选名称严格解码。中文账号通过实际浏览器→WS/TCP→原创Python对端交换，名称按原字节顺序显示；不认识或无法无损解码的名称禁止选择。切换编码清输入、确认和旧候选，页面重载回ASCII；XML编码独立。实际原程序ACP/IME、Windows best-fit与其他代码页仍待验证。[规格](reports/launcher-static.md#launcher-v20)、[运行](web/README.md#launcher-v20)、[验收](analysis/launcher-v20/validation.json)、[交付清单](analysis/delivery-manifest-stage65.json)。

```sh
node web/examples/launcher-browser-local.mjs --text-profile windows-936
```

打开输出地址→“检查并准备配置”→明确选择Windows-936→输入公开原创夹具`合成用户甲` / `测试口令甲`→逐页确认原创四页说明→开始交换。UTF-8示例把参数改为`utf-8`并在页面明确选UTF-8；默认示例仍是ASCII。示例最多一次连接或10分钟，Ctrl+C正常结束。原4173离线页保留。

缺少的编码数据已从[Unicode官方CP936表](https://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP936.TXT)补齐，固定2.01映射、SHA256和Unicode License V3，运行时无需下载；[依赖记录](analysis/launcher-v20/dependency.json)。Node369/369（新11）、21791项双字节/2149项未分配/1037项UTF-8独立对照、Chrome9个编码检查及17个配置会话回归流程/1个时限测量通过。仍未完成真实账号/服务生命周期、可信官方更新与原生事务、游戏、Safari/手机真机/微信小程序及官方兼容。

**历史产物事故：** 本轮误运行旧QA脚本，覆盖v19一份详细浏览器回执和3张临时PNG；原始详细内容/像素未恢复。原哈希、既存汇总/日志及恢复限制已保留，新重验独立归入v20；不能把重跑结果冒充历史原件。[事故记录](analysis/launcher-v20/artifact-output-incident.json)。代码和原始样本未被该误操作改写。下方阶段保留当时结论，涉及旧详细回执须连同本次限制阅读。

## 保留配置与会话流程（stage64 / 2026-10-27）

登录器v19已把**配置准备/文件读取/显式缓存恢复→游戏与区域选择→四页文本确认→实际字节交换→候选选择**接成同一页面。游戏Code保留原文用于许可键，数值用于请求；区域BIP必须全部匹配启动时允许列表，闭区/缺失/未授权区域不打开连接。初始化只应用完整候选，自更新分支只展示候选、未执行或替换。[规格](reports/launcher-static.md#launcher-v19)、[运行说明](web/README.md#launcher-v19)、[验收](analysis/launcher-v19/validation.json)、[交付清单](analysis/delivery-manifest-stage64.json)。

```sh
node web/examples/launcher-browser-local.mjs
```

打开输出地址（默认4174），先点“检查并准备配置”，再用公开原创输入`SyntheticU1` / `SyntheticP1`，选原创测试文本、逐页确认后开始交换。示例最多一次连接或10分钟，Ctrl+C正常结束；原4173离线页保留。普通服务可仅指定`--target 127.0.0.1:PORT`，页面显式选XML/缓存，没有默认游戏目标或账号。

本轮复用已有REA证据并核样本/证据身份，未重复反编译或新增依赖。Node358/358（新增11）、Chrome桌面/390px的17个流程和1个时限测量通过；实际整体时限10052ms，覆盖先读取参考bytes再初始化。最终主浏览器流程的5次完整请求由Python独立解密/逐字节核对，另1次取消关闭；包含同页计数0→1。429个回环请求中1次负例ERR_ABORTED另列，0非预期错误。[浏览器](analysis/launcher-v19/browser-validation.json)。

仍未完成：非ASCII/实际代码页、适用条款/账号持久化和服务会话、可信更新/原生事务、游戏消费者/玩法、Safari与手机/小程序真机及官方兼容。文件/缓存是显式开发路径，不等于完成官方在线初始化；下一步保持登录器主线补这些可证模块，随后进入游戏阶段。下方stage63及更早记录保留其当时范围。

## 保留登录器页面（stage63 / 2026-10-27）

**登录器v18：** 已增加可操作的本地登录流程：输入保留方式→四份文本逐页确认→显式开始→浏览器WebSocket/Node TCP实际交换→候选及显式选择。原创Python对端独立解密并核对请求；最终Chrome桌面/390px的10项检查、347/347 Node（新增12）通过。页面只面向原创回环测试；官方登录、完整登录器与游戏仍未完成。[使用](web/README.md#launcher-v18)、[REA/规格](reports/launcher-static.md#launcher-v18)、[验收](analysis/launcher-v18/validation.json)、[交付清单](analysis/delivery-manifest-stage63.json)。

```sh
node web/examples/launcher-browser-local.mjs
```

打开输出的本地地址（默认4174）；使用公开原创输入`SyntheticU1` / `SyntheticP1`，点击“使用原创测试文本”，逐页阅读并明确确认，再开始交换。示例最多处理一次连接，或10分钟后结束；Ctrl+C正常结束自有服务。普通入口须显式指定回环对端和gameCode，见web说明。原4173离线配置/资源服务与`connect-src none`保持。

本轮先REA补查2个CRT代码页函数/3个IAT引用，复用已证ANSI控件路径；实际ACP仍未知，所以UI明确只接收1..16个可显示ASCII字符，不猜GB18030或静默替换。缺少的`ws8.22.0`已从主注册表固定版本补入，SHA512/SHA1及19文件核验、MIT许可保留，未运行安装脚本或安装原生插件。[依赖](analysis/launcher-v18/dependency.json)。根入口相对资源404与修改输入后旧候选残留已复现、修复并回归；候选数量6→4是测试假设修正，[记录](analysis/launcher-v18/review-corrections.json)。

下一步继续配置/bootstrap与会话页编排、非ASCII代码页及实际条款/账号存储和服务生命周期；游戏侧可读消费者、远程手机/小程序及官方兼容仍分别缺证据，不能因本地页面可操作而升级。下方stage62及更早段落保留其当时范围。

## 当前实际结果

2026-10-27 的阶段按当时的登录器优先顺序开展。当前以全能力分析、统一评审和按依赖复刻的计划为准。 [当前开发顺序](reports/development-plan.md#capability-first-workflow)

**保留登录器v17 / stage62：** 已将REA支持的交换控制器接入实际字节流执行器，补平台随机数、单调时钟、十秒总截止、取消和迟到连接清理；Node TCP适配只打开显式白名单端点。原创Python/PyCryptodome对端独立解密并逐字节核对请求，候选/空候选/拒绝与断流/截断/真实超时通过。Node335/335（新35）、浏览器6项/27回环源码GET通过。[契约](web/README.md#launcher-v17)、[证据/政策](reports/launcher-static.md#launcher-v17)、[验收](analysis/launcher-v17/validation.json)。现有页面尚未接入会话控件；浏览器测试使用注入流，不是浏览器TCP或官服登录。

运行`node web/examples/launcher-session-local.mjs`可完成三组真实回环TCP交换和候选选择，输出仅状态/计数/独立核对结果。没有默认官方目标、原程序执行或实际账号输入；节点端口是开发验证适配，网页/小程序仍需各自获授权传输路径。

**保留登录器v16 / stage61：** REA补查UserMode对话框与Profile写入路径，新增8份函数证据；实现非秘密的模式初始化/切换计划，区分2→1确认、同模式重选清输入、显式取消与整数写入意图。Node300/300（新12）、29个固定操作数及54组独立Python/Chrome向量通过；Chrome5项/48回环GET、0错误。[规格](reports/launcher-static.md#launcher-v16)、[API](shared/README.md#launcher-v16)、[验收](analysis/launcher-v16/validation.json)。模式计划尚未接UI或实际存储，不等于账号记忆或真实会话。

**保留登录器v15 / stage60：** 本地配置页已接入“保存当前配置、恢复缓存配置、重新检查缓存、取消缓存操作”。保存原始双XML与解析选项；显式恢复后清空旧计划和目录，缓存冲突保留当前配置，取消过晚会明确报告已保存。[规格](reports/launcher-static.md#launcher-v15)、[使用](web/README.md#launcher-v15)、[验收](analysis/launcher-v15/validation.json)。Node288/288（新3）；Chrome实际页面14项、独立390px流程及GB18030原字节往返通过，最终200个源码回环GET、0控制台错误。窄视口不代表手机真机。

本机服务并发模块读取重置已由同处理器队列5/64对照复现并修复为64，同端口16/16通过；路径白名单和CSP未变。可打开`http://127.0.0.1:4173/web/launcher.html`使用本机缓存。HTTP初始化仍为独立API，尚未接入该离线页；条款、账号、真实会话、游戏及官方兼容仍未完成。

**保留登录器v14 / stage59：** 已把清单、GET、ZIP与目录解析串成初始化流程：优先准备自更新候选，否则只获取摘要变化的XML，校验整对配置后返回。新增独立浏览器候选缓存，按期望版本把一对配置作为单record事务提交，失败/中止保留旧pair，已提交后的取消明确标记。[规格](reports/launcher-static.md#launcher-v14)、[API/运行](web/README.md#launcher-v14)、[验收](analysis/launcher-v14/validation.json)。Node285/285（新22）、Chrome12项/51回环GET通过，含原生IndexedDB失败/并发/重载。

运行`node web/examples/launcher-bootstrap-local.mjs`可准备原创本地配置；它不提交缓存或写游戏文件。缓存与prepare是分开的调用，来源和认证始终未验证；浏览器候选缓存不等于原EXE替换/回滚或完整登录器。stage59时页面未接线，当前缓存接线见上方stage60；HTTP初始化和会话仍为后续工作。

**保留登录器v13 / stage58：** REA闭合HTTP读取虚槽到InternetReadFile及正常关闭链。新增可实际执行GET的Fetch薄适配，显式来源/总截止点/取消/字节预算；本机原创服务已串联清单比较、候选目录和ZIP→CRC/MD5。[规格](reports/launcher-static.md#launcher-v13)、[接口/运行](web/README.md#launcher-v13)、[验收](analysis/launcher-v13/validation.json)。Node263/263（新18）；Chrome6项及18个独立native/adapter对照通过。两处实现边界由独立复核发现后修复，测试假设修正与浏览器初次失败单列保留。

运行`node web/examples/launcher-http-local.mjs`只启动并关闭本机原创服务，不写文件。现有离线页面保留`connect-src none`，尚未接入该适配器；官方HTTP/CORS/可信来源、存储事务/回滚、真实会话与游戏仍未验收。没有原程序、VM、账号或官方请求。

**保留登录器v12 / stage57：** REA闭合主摘要的三次边界修剪/32截断、两XML摘要绑定、更新定位文本的前两token和正常启动分支顺序。新增纯字节解析与元数据计划，原始文件直接做MD5，不把文本解码后的内容当摘要输入。[规格](reports/launcher-static.md#launcher-v12)、[接口](shared/README.md#launcher-v12)。

- **本轮验证：** Node245/245（新增13），Python15个主摘要投影/4种目录计划通过；66B历史XML摘要重建匹配保留SHA256，原本地文件得到仅RegionList刷新。Chrome最终6项/46回环GET/0错误通过；初次本地连接重置单列记录。[验收](analysis/launcher-v12/validation.json)、[离线历史重建](analysis/launcher-v12/local-metadata-comparison.json)。
- **stage57未完成：** 实际HTTP/locale错误路径、下载来源信任、事务替换/回滚、条款/账号存储、真实传输与完整会话、游戏交接及官方兼容。没有新官方请求、原程序/VM或账号操作，游戏阶段尚未开始。
- **保留stage56验收：** ZIP首中央条目/Stored/raw Deflate/CRC/MD5候选解码已实现，真实ZIP解出内容与原EXE逐字节相同；Node232/15原创ZIP/Chrome6项通过。[历史回执](analysis/launcher-v11/validation.json)。
- **保留stage55验收：** 许可键/四页明确决定与会话内输入清理已实现；Node215、23独立digest向量/4080对照、Chrome6项通过。[历史回执](analysis/launcher-v10/validation.json)。
- **保留stage54验收：** 离线交换控制器连接hello/挑战/加密请求/回包/候选，处理总deadline、连接代次、有限轮换、取消与断流。Node200、3组独立全流程、15指令锚点与Chrome6项通过。[历史规格](reports/launcher-static.md#launcher-v9)、[回执](analysis/launcher-v9/validation.json)。

- **保留stage53验收：** 用户名/密码16B输入子集、候选排序/关联/选择、回调尾参修正已完成限定验收；Python3请求/6候选、DIALOG4测试/13模板及Chrome6项通过。[历史回执](analysis/launcher-v8/validation.json)。
- **保留stage52验收：** 类型1/10请求、类型2/11回包、固定未压缩密钥/加密记录流已实现并经独立对照；固定MIT Blowfish依赖4.0.3已补齐并核验来源/完整性。[历史回执](analysis/launcher-v7/validation.json)。
- **保留stage51验收：** 双XML/区域计划及类型10已实现；真实5游戏/12区域、8可选关联/1缺失引用、5组原创消息向量，以及桌面/390px页面12项检查通过。本轮未重复真实文件/窄视口全套检查；Safari、手机和小程序真机仍未验。[历史回执](analysis/launcher-v6/validation.json)。

## 历史阶段记录（stage50及以前）

**Reconnect request (stage50):** Latest goal is restore network and leave connected, without installs. One exact-app read was blocked by tool-reported Mac lock; no network action. File config Connected0/IsolatedVm1, live Windows not observed. [Receipt](analysis/diagnostic-preparation-v1/windbg-offline-assessment.json).

**Store attempt (stage48, bounded follow-up stage49):** Recovery-point UI/disk references and isolation checked; Task Manager launcher/cg filters had no matches. Network dropdown failed with cannotClickOffscreenElement; final NIC Connected0. A single Tab focus-recovery follow-up left focus on the same native combo; stopped. No network enable, Store navigation or WinDbg installation. [Exact outcome](analysis/diagnostic-preparation-v1/windbg-offline-assessment.json).

**GUI 输入核验（stage47）：** 同一完整路径绑定、可见搜索框焦点下，`pressKey`持续120毫秒的单字符输入及清除均已读回；没有权限/工具/安全设置变化。鼠标、`typeText`及完整导航仍未验，不能宣布全面修复。[精确事实与未决](analysis/diagnostic-preparation-v1/gui-tool-presence-followup.json)。微软另列Store GUI与WinGet正式分发路线；此前HEAD403仅为该请求失败，原因未知，不证明所有官方分发不可用。本轮未重试端点或下载工具，[来源及下一边界](analysis/diagnostic-preparation-v1/windbg-offline-assessment.json)。

**WinDbg 离线方案（stage46）：** 微软确认Win11 ARM64支持和MSIX本地安装机制；官方短链已解析，但当前AppInstaller清单HEAD返回403，已停止，工具二进制下载为0。当前包大小、依赖/实际许可、已编译原创x86目标和可靠GUI仍未闭合，不能批准为已就绪安装演练；不以旧版候选或未知订阅到期代替这些阻碍。[精确官方来源、固定旧版元数据与有界范围](analysis/diagnostic-preparation-v1/windbg-offline-assessment.json)。

**GUI 工具检查（stage45）：** CLI及相关修复/重装路线已结束。按知识库用`/Applications/Parallels Desktop.app`完整路径绑定同一Windows11窗口成功，画面读取恢复；用户手动打开开始/搜索面板后，一次“设置”点击未取得可见导航结果，已停止不重试。具名API观察器及版本/能力仍未验证，不能写成未安装。[实际状态与排障区别](analysis/diagnostic-preparation-v1/gui-tool-presence-followup.json)。

**Business 版已确认（stage44）：** 接受用户“商业版”确认，不再重复辨认版别。官方说明有效Business订阅可升级最新版，企业管理员仍可限制大版本升级；当前有效期/覆盖版本未安全核实，不能据版别直接安装。没有新的解锁证据，本轮未再探测UI。[确认与剩余条件](analysis/diagnostic-preparation-v1/business-license-status.json)。

**许可查询（stage43）：** 已按用户要求自行查询；现有窗口读取仍被工具报告locked阻断，未进入关于/账户许可页，已停止且未重试。应用Info.plist仅确认26.3.3(57507)，所查版别/许可相关字段无命中，不能据此确定Standard/Pro、到期或升级资格；未读密钥或凭据文件。[精确状态与最小恢复动作](analysis/diagnostic-preparation-v1/license-check-blocker.json)。

**官方修复只读核查（stage42）：** 官方支持通过应用安装替换复用现有PVM；当前26.3.3(57507)应用/CLI位置及hash未变，v19/v22快照及三磁盘引用仍在。CLI要求Pro或Business/Enterprise版和来宾Tools，现有许可未核实，不能直接承诺重装即解决。没有下载/安装、关机/备份或启动VM；后续先确定合法适配版别，再批准冷备份和具体安装范围。[官方来源、保留方案与必要批准](analysis/diagnostic-preparation-v1/official-repair-assessment.json)。

**本地非GUI路线（stage41）：** 本地Darwin/ARM64及原工程路径已核实，随附手册列出需要Parallels Tools的`prlctl exec --current-user`。当前CLI ARM64签名完整性失败，标准入口还会调用已被拒的主机ps并可能初始化服务，因此没有执行CLI或来宾命令，不能承诺锁屏不影响。此前屏幕已恢复但输入路由失败，具名观察器仍未验证。[精确证据与边界](analysis/diagnostic-preparation-v1/local-cli-feasibility.json)、[界面检查结果](analysis/diagnostic-preparation-v1/guest-tool-followup.json)。

**诊断能力检查（stage40）：** 普通窗口只读访问被工具报告“Mac is locked”阻断，未执行来宾命令；没有证实观察器存在或缺失，未重做被拒的主机进程查询。ApexClient.Dat确认是校验有效的gzip，内层706686字节格式/加载者仍未知。新增原创Win32诊断目标源码及6/6主机元数据契约测试，尚未编译、导入或运行。[当前阻碍](analysis/diagnostic-preparation-v1/guest-tool-check.json)、[Apex证据](analysis/diagnostic-preparation-v1/apex-static.json)、[合成演练准备](analysis/diagnostic-preparation-v1/synthetic-readme.md)。

**动态诊断准备（stage39）：** 已将固定原安装包离线解出2367个非临时文件（2.626GB）至私有build材料目录，并用真实GameList/现有inventory核心核对Code11四配置文件身份；旧五文件模型缺3项。Windows观察器、无登录可达性、事前网络/子进程限制及可靠停止尚未验证，因此没有启动新样本或开放NAT。[具体计划与阻碍](analysis/diagnostic-preparation-v1/diagnostic-plan.json)、[材料核对](analysis/diagnostic-preparation-v1/material-assessment.json)。

**最新产品增量（stage38）：** 已新增显式安装inventory验证器和MAP01有界原始解析器。inventory核对同一目录的已声明文件、缺失/歧义、大小/摘要预期，不扫描或读取真实安装；MAP01只返回候选尺寸和不透明原始数据。四真实地图与独立Python对照4/4通过，Node85/85、Python8/8、Swift16/16回归通过。运行`node shared/examples/install-and-map.mjs`可验证合成用例。[接口/边界](shared/README.md#inventory-and-map01)、[本轮回执](shared/evidence/install-map-validation.json)。

**游戏消费者关键路径（stage37）：** 有界静态核验定位了命令行指针的缓存/读取和匹配PDB身份，但仍未连到游戏命名映射或socket；14个定点锚点通过。原.text无文件后备、符号未提供，普通静态恢复路线到此停止；没有运行、联网、读真实内存或绕过调试检测。下一关键依赖是合法可分析游戏代码/匹配符号或另行界定的正常诊断，不能把已完成的离线计划器当官服完成。[证据、最小动态范围及安全实现候选](analysis/protocol-v3/game-network/static-feasibility-20261026.json)。

**此前产品增量（stage36）：** 已把GameList解析、重复Code按序号选择、显式HKCU快照/INI目录回退和静态文件计划接入`shared/`纯ESM核心。没有新增UI、下载、执行或认证能力；Argsline保留原文。31项新测试＋原有25项Node回归＝56/56，Python8/8、Swift16/16通过。运行`node shared/examples/launcher-plan.mjs`可查看原创合成输入的完整计划。[接口/使用](shared/README.md#offline-launcher-core)、[验收](shared/evidence/launcher-validation.json)。

**最新执行点（2026-10-26 v23）：** 用户获知v22可能激活的不确定性后，另批准一次观察，并确认两EXE的Win7设置。此次明确启动原始启动器一次、核对路径并接受UAC：PID2132，01:28:05–01:29:19 UTC运行约74秒，退出码-1。初始自动更新检查依次显示“网络错误：12007”“更新检查失败”，经正常关窗退出；未到登录主界面。含UAC等待的提交至退出约137秒，**违反90秒观察约定**，且运行结果回报延迟，本轮不能记为完整通过。当前无指定进程/直接子进程，原三文件hash未变，新增619字节Log.htm仅记录元数据。断网/Mac隔离保持。[本次结果](reports/vm-environment.md#v23-launcher-initial-probe)、[有限证据](analysis/vm-install-v23/run-observation.json)。

**公开首清单补充（01:56 UTC）：** 一次主机侧简化GET返回HTTP200、text/plain、33字节，脱敏结构为单行32位十六进制值。无凭据/重定向/后续请求，不开VM网络、不执行程序；只证明该URL当时可达，不证明安全更新或官方兼容。[请求元数据](analysis/vm-install-v23/public-manifest-observation.json)。

**公开更新元数据补充（01:59 UTC）：** `launcher_url.dat`与`xml_md5.dat`各请求一次，均HTTP200。公开目标为同域`POLCN_Launcher.exe.zip`（未访问）；XML摘要GameList相同、RegionList不同，启动器EXE版本是否不同仍未知。无明确版本字段，未追踪下载目标/新域名或执行程序；本阶段联网边界已到达。[元数据与比较](analysis/vm-install-v23/public-update-metadata-observation.json)。

**更新器有界静态收尾：** 复用已有生命周期证据，补核再启动原启动器模块路径、`%s ID:%d`及两处NULL工作目录/环境；等待与退出码存在已记录异常，不能证明更新成功。8个定点锚点/2个样本身份通过；精确变换算法、可信更新与实际运行仍未知。本轮无网络/下载/执行/VM变化，到此停止。[总结与证据](analysis/protocol-v3/updater/lifecycle/lifecycle-summary.md)。

**公开ZIP离线比较（04:44 UTC）：** 经本次具体批准下载580477字节ZIP，唯一启动器599040字节与原样本逐字节相同（SHA256 `109b1338…c8ef0e`），版本资源1.5.8.2、无嵌入式Authenticode证书表，requireAdministrator不变。ZIP路径/链接/膨胀/CRC核验通过，未落盘解出EXE或运行；现有REA与启动链证据复用。HTTP来源及同字节不证明官服许可或可玩性。[完整比较与剩余缺口](analysis/launcher/public-package-comparison.json)。

- **启动器v5静态增量：** `+0x1708`已关联“仅刷新通行证”复选框，Code11非零会跳过游戏创建；目录来源已关联HKCU Path、`PlayOnline.ini`的`[Path] Game11`和CreateProcess工作目录。两条证据链共93个锚点通过；6项控件解析合成测试和6个目录负例通过。这些是固定样本静态规格，不是认证或运行成功证明。[启动器结果](reports/launcher-static.md#launcher-v5-prerequisites)

- 两份用户安装包已由 REA 6.7.0、Ghidra 12.1.4 和免费工具静态调查，均为 Inno Setup 6.1 Unicode / x86 PE32；样本哈希、来源线索与工具限制有记录，官方来源真实性未认证。
- [逻辑/协议台账](reports/logic-protocol-spec.md)保持20项（6事实、1推测、13待验证）。第三阶段已追踪更新器五槽消费者、四处非自更新进程启动及更新HTTP链；游戏侧交接到socket仍被具体静态缺口阻断，未实现认证或游戏帧。第二阶段29锚点及新增各链核验分别记录，不混作官服兼容测试。
- 两组配对图形共 27,854 条记录的范围、RD 标记和尺寸关系吻合；其中 **69 条 RD v0/v2 原始记录**通过独立 Python / JavaScript 摘要差分。产品只支持该有限布局，拒绝 v1/v3 压缩版本。
- 浏览器核验台可本地选择配对文件、有界读取、按记录序号查看灰度字节平面。默认图像是原创合成夹具，颜色、透明、方向、动画和官方地图语义尚未恢复。
- **25 项 Node、8 项 Python、16 项保留 Swift 测试通过**。浏览器桌面/390px窄视口的合成夹具与缩放通过；工具连接曾中断、现已恢复；真实资源的浏览器文件导入尚未验收。真实样本通过的是本地命令行差分，不是浏览器导入或手机真机验证。
- 官方公开及随附条款存在相关限制，第三方客户端许可、账号风险和当前服务兼容性必须另行确认。此前一次有界游戏主程序运行见下；v22按键激活仍不确定；v23另获批准的启动器运行与UAC已实际完成。没有运行官方游戏安装器、连接官方游戏服务、读取游戏凭据或凭据存储、上传或分发官方资产；没有提交、推送或发布。

**UTM可恢复清理已实际执行：** 应用、两台项目VM、两份冷副本及指定介质等9项，6个已知临时工件、4个另经核实的旧工件/空目录，以及3个只剩Finder元数据的build父目录，均通过Finder正常移到废纸篓；22个原路径复核不存在。未清空废纸篓，也不宣称已释放对应磁盘空间。UTM全局容器的Data列举被系统EPERM拒绝，无法排除其他VM/资料，保留整包；所以不是“所有残留已清零”。[清理与恢复记录](reports/vm-environment.md#v15-removal-and-parallels)、[逐项核验](analysis/vm-install-v15/final-removal-verification.json)。

删除后的核验确认：此前409个源码/分析/文档交付文件均保留且修改文档前哈希一致；42个产品文件未变，`moli/`原件元数据未变。历史UTM恢复/驱动证据保留，但本地原VM/冷副本已移出原路径，不能再按旧运行说明直接启动。Autologon没有运行或启用，不恢复PIN/旧VM清理分支。[项目排障知识库](reports/known-issues.md#vm-troubleshooting)。

**首次有界离线实验已完成（v20）：** 来宾断网、Medium普通权限，光盘及复制前后五文件哈希一致；2026-10-25 23:10:07 UTC仅启动一次 `cg_se_3000.exe`（无参数），PID600，23:10:23已退出，观察窗口约16秒。两条Application Error1000对应同一PID/实验路径，异常码 `c00001a5`、`c0000005`，故障模块均为 `unknown`。未观察到游戏/错误窗口，退出码未取得；**启动故障原因未定，不能标游戏可玩或ARM不兼容**。

运行后目录仍仅五文件、大小/hash未变，当前直接后代查询为空；不等于系统无其他写入或从未产生后代。VM保持NIC断开、Mac隔离及既定共享关闭；v19原生关机快照仍用于本地恢复，未实测还原；独立冷副本严格属性校验失败，保留且不采用。没有提权、输入凭据、联网、补组件或重试；单次执行额度已使用。[本次结果与边界](reports/vm-environment.md#v20-first-client-probe)、[有限观察](analysis/vm-install-v20/run-observation.json)、[既有方案](analysis/vm-install-v6/client-experiment-plan.md)。

当前磁盘应用已为Parallels26.3.3(57507)，不同于此前20.4.2；本阶段未安装/更新，严格签名检查报CSSMERR_TP_NOT_TRUSTED，原因未证实，未修签名或绕过。Gatekeeper仍启用。Windows激活/许可、原生恢复启动、设备/游戏/官服兼容均未验收；[v17桌面证据](reports/vm-environment.md#v17-desktop-confirmed)、[v18介质证据](reports/vm-environment.md#v18-bounded-probe-preparation)保留为历史。

此前静态阶段最后两组核验为**47/47与50/50锚点通过，8个篡改/截断负例拒绝**；没有新增产品实现或样本执行。阶段值来自“下一步/上一步”流程，不能命名登录成功；IPC只确认静态来源，不读取真实值。

## 运行与测试

需要 Python 3.9+、支持 ESM/BigInt 和 `node:test` 的 Node.js。网页运行使用随源码提供的 MIT Blowfish ESM。部分原创 TCP 回归和加密向量生成使用 PyCryptodome 3.23.0。 [换机依赖与命令](reports/project-handoff.md)

```sh
python3 scripts/serve_web.py --port 4173
```

打开 `http://127.0.0.1:4173/web/`。服务固定监听本机回环，只暴露 `web/` 与 `shared/` 的指定源码类型，禁止目录列举，不提供上传接口。Ctrl-C 停止。浏览器文件选择在页面内存中读取，不经 HTTP 发送，也不持久化；CSP 禁止页面建立网络连接。当前命令不能从手机远程访问，手机真机测试尚未安排。

登录器配置页为 `http://127.0.0.1:4173/web/launcher.html`，也可从图形页顶部进入。选择你有权读取的两份XML、明确编码；固定旧GameList需要显式开启裸&兼容。目录只作为配置元数据，不扫描磁盘，页面没有登录/下载/执行按钮。

```sh
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
node shared/examples/launcher-plan.mjs
node shared/examples/install-and-map.mjs
node shared/examples/launcher-region-plan.mjs
node shared/examples/launcher-reply-pipeline.mjs
node shared/examples/launcher-login.mjs
node shared/examples/launcher-flow.mjs
node shared/examples/launcher-local.mjs
node shared/examples/launcher-update.mjs
node shared/examples/launcher-metadata.mjs
python3 -m unittest discover -s analysis/resources-v2 -p 'test_*.py' -v
```

真实样本路径必须显式提供，操作方法及预算见 [共享核心](shared/README.md)；原生历史构建、运行和 16 项测试见 [native/README.md](native/README.md)。官方资源不随源码或测试提供。

## 文档索引

| 内容 | 入口 |
|---|---|
| 当前需求、顺序门槛与项目经验入口 | [需求与开发顺序](reports/development-plan.md) |
| 目标、保留成果、跨平台分层、规格门槛与里程碑 | [架构和验收路线](reports/architecture-and-milestones.md) |
| 客户端逻辑、帧/消息/会话/认证的已知未知与下一证据 | [逻辑与协议规格](reports/logic-protocol-spec.md)、[机器可读台账](analysis/protocol-v2/spec-matrix.json) |
| 浏览器/小程序网络差异与条件性网关风险 | [网络可移植性](reports/network-portability.md) |
| 工具、样本哈希、来源、REA方法及审批操作记录 | [分析方法](reports/analysis-methods.md)、[输入清单](analysis/input-manifest.json) |
| POLCN配置、启动、更新与认证线索 | [登录器调查](reports/launcher-static.md) |
| CrossGate模块、依赖、保护结构与协议线索 | [主程序调查](reports/game-static.md)、[实际客户端ARM兼容边界](analysis/vm-install-v5/arm-client-compatibility.md) |
| GraphicInfo/RD、MAP、palette、音频、动画边界 | [资源格式](reports/resource-formats.md)、[配对图形证据](analysis/resources-v2/notes-graphics.md) |
| 现有 API、平台适配、预算与未来接口 | [模块接口](reports/module-interfaces.md) |
| 核心构建/验证、本地网页和保留Mac原型 | [shared](shared/README.md)、[web](web/README.md)、[native](native/README.md) |
| 通过、失败、未运行及截图 | [验收记录](reports/validation.md) |
| 官方来源、条款短摘录与适用性边界 | [条款核查](reports/official-terms.md) |
| 隔离Windows环境、资源占用、许可关口与回滚 | [环境准备](reports/vm-environment.md)、[当前四盘离线核验器](analysis/vm-install-v7/verify_offline_four_drive.py)（22/22配置通过；[v8私有冷副本回执](analysis/vm-install-v8/windows-cold-baseline.json)，旧策略保留） |
| 兼容缺口、操作前清单、排障知识库和下一步 | [已知问题](reports/known-issues.md)、[VM排障知识库](reports/known-issues.md#vm-troubleshooting) |
| 每阶段文档同步与项目边界 | [AGENTS.md](AGENTS.md) |

`analysis/` 仅保留原创脚本、元数据、摘要、有限观察和失败证据。报告中的**事实 / 推测 / 待验证**不能混用；新样本必须重新建立身份。原目录没有既有源码或 Git，本次没有初始化 Git。`moli/` 原件保留，官方解包内容仅用于临时离线分析，不进入产品。

## 下一步

登录器和游戏共用一个取证排程，按完整操作收敛规格和现有实现差异。当前操作与缺口的恢复条件见开发计划。全部必要规格通过 A1–A4 统一复核后，开始 D0–D6。 [当前取证](reports/development-plan.md#capability-first-next-analysis) · [需求索引](reports/requirements-index.md#capability-first-inventory)

普通分析/开发依赖按用户最新要求直接补齐；已有REA6.7.0/Ghidra12.1.4、PyCryptodome3.23.0与Playwright1.62.1、Chrome155可用，新增固定版本的离线Blowfish ESM依赖。原程序执行、管理员权限、官方联网、账号及保护边界继续按具体范围处理；旧单次执行额度不复用，不恢复UTM/旧PIN/取消的CLI分支。
