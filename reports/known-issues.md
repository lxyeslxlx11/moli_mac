## 固定 Item 第二套窗口的外层分派

`5F0324`、`56A14E`、`56A3A1` 的局部用途已核。完整帧还需取得读取表 `+4` 回调并提供活动首参的正向路径，及调用新旧窗的顺序。WK-U1、OS-U1、SF-U1 共用该待证条件。 [已核路径和继续条件](game-static.md#item-alternate-dispatch-candidates)

当前留在等待材料的队列。取得匹配帧调用、运行回执或配对模块后回到同一份规格。 [恢复条件](../analysis/capability-first-v1/implementation-plan.json#/execution_review/waiting_alternate_frame_dispatch)

## 战斗技能窗的实际选行与关窗

当前共享语义入口在资格位拒绝时返回 `LEGACY_BATTLE_INPUT_DISABLED`，本机回执未产生 `0x37`。D0/D3/D4 在共用窗和输入所有者接空行、选行、声音及实际退役，原版运行态、当前同版和三端组合用例继续验收。 [规则及对照](game-static.md#fixed-se-battle-skill-list-admission)

## 护卫离场与飞行物动作

stage306 在撤离或替换时走统一退役。固定 SE 的动作 24、71 会在所选空槽条件推进飞行物。217 的测距需要有效角色。按实际登记写入和回调次序验证可发生的空槽及替换组合，再合入 BF-D7。 [条件与待验范围](game-static.md#battle-266-guard-slot-consumption)

动作 221、222 的首次 B 登记保留旧 B 的回调条件。若该旧对象在后续合资格回调到达动作 49，固定 SE 指令会清其原槽。现有引擎在受控组合中保留新 B。实战能否产生这一队列组合沿 BF-T36 取证。 [原版指令与受控对照](game-static.md#battle-slot-publication-order)

## 堆叠数量开框与另一套窗口调度

stage306 在所选槽更新后按修订撤选，固定 SE 的所选数量框回调先用保存槽号和数量确认，再处理上限。D0/D3 补点击、帧与焦点差异，D5 验实装三端及设置重开。WK-U1 仍需普通帧提供实际活动值的证据，真实收包、关窗与焦点交错留原验收。 [开启与保存](game-static.md#fixed-se-stack-quantity-input-preference) · [回调与复现](game-static.md#fixed-se-alternate-inventory-quantity)

## 换场期间的协同控制器与普通输入

stage306 能解码协同动作 81/82，所测 82 在普通场景会触发 `LEGACY_GAME_LOCAL_CONTEXT_STALE`。第一条场景回复的素材读取挂起时，第二条仍在队列。D2 沿原角色登记、快照和场景入口接线，按实际接收顺序更新逻辑场景。固定 SE 已证 251 的后续 `TfD` 选路条件，真实回复数量、登记来源及显示继续沿 GF-A18 核对匹配版本的运行记录。 [来源与复现](game-static.md#fixed-se-251-completion)

固定 SE 的 204 重建会清窗口登记。在途窗口若已创建且仍存活，按同一用例检查其登记与资源回收。两版的回场需覆盖准备字失配后同轮写 1→2→3，以及经完整淡入进入 20。stage306 的图层提交与普通输入差异已重现，当前同版、原版实际回收和三端产品仍待验收。 [现有差异和恢复用例](game-static.md#fixed-se-shared-scene-frame)

## 图形分块缓存不足时的恢复

固定 SE 的静态链路允许保留部分分块。真实尾链接、设备上传返回及像素输出继续核验。stage306 的一条缓存预算夹具使两幅图的帧失败。现有 Canvas 入口保留当轮请求并停止调度，显式切到较小计划后恢复。D0/D2 补部分覆盖、重新分配与不重放业务的绘制恢复，PR-A05、PR-A06 验三端。 [规则、对照和待验条件](game-static.md#legacy-graphics-partial-cache)

固定 SE 超出合资格颜色处理上限后仍提交旧颜色。stage306 的所测软件计划全数在同一次着色。原版实际调色板变化中的块顺序、上传失败与硬件像素沿 PR-A06、PR-A09、PR-A10。 [限额与后续用例](game-static.md#legacy-graphics-deferred-upload)

启动标识使用的 19、23 在 stage306 的现有战斗颜色入口被拒。后续按同一插值规则接入启动素材与逻辑轮。原版启动资源打开失败后继续用旧活动色，等待由当时的忙标志控制。实际标识画面、重试后的首帧和原设备输出待验。 [当前差异和用例](game-static.md#fixed-se-startup-palette-publication)

stage306 保留 `Ta>` 的第二个字段，所测六组普通帧的像素相同。固定 SE 随后经 `502950` 消费待选色，沿同一入口处理自动跟随。把该项纳入 GF-A10 的首帧用例，并在 PR-A09 核显式色、恢复与资源打开失败后的实际颜色。 [回执与下一步](validation.md#fixed-se-scene-palette-follow-validation)

固定 SE 的默认、命名和显式表已有所选原字节规格。本机 RGBA 已覆盖九组颜色方案，24 位样例仍为静态推导。实际表面结果、非零选择遇空槽后的裁切、短色段尾部和下一轮补色的像素沿 PR-A09、PR-A10 核验。 [默认表对照](validation.md#fixed-se-palette-output-depth-validation) · [显式表与缺载体对照](validation.md#fixed-se-explicit-palette-upload-validation)

固定 Item 的默认和显式表已核所选位深、颜色来源与标签。实际设备、锁定结果、空槽裁切和延期像素按两版共用的 PR-A09/A10 取得回执。短命名色段的实际尾部继续按适用素材和读值确认。 [默认表本机对照](validation.md#fixed-item-palette-output-depth-validation) · [显式表本机对照](validation.md#fixed-item-explicit-palette-upload-validation)

战斗回场的本机对照在首个普通回场帧写入前就切换为普通状态，原战斗画布放弃提交该帧。沿 GF-A11 复用城市过渡的成功绘制回执，验画布关闭、重试和新场景覆盖。固定 SE 队列背景拷贝的非零准入和位移来源取得原版正常事件证据后再核。 [复现与恢复条件](game-static.md#legacy-transition-background)

## 补丁重试与目录重新准备的待验条件

现有 C82 规划仍保留旧版派生的来源标记。D1 按固定 F5A 规格补回退路径、备份失败和新目录续接。实际备用制品、子进程身份及 Windows 计时与重选消息顺序沿 GP-U01、GP-U03。网页和微信所验本机入口可复用资源绑定及迟到结果清理，实际三端设置读回和重新准备沿 LP-A09、LP-A12 与 UC-P12。 [来源与差异](launcher-static.md#f5a-patch-retry-directory)

## 经典工作窗口的既有实现差异

stage306 在技能列表关闭时可直接清工作上下文并发 62，换场时会在本地关闭工作并拒绝旧选择。固定 SE 的普通换图在 200 同步析构，204 按淡入函数的完成值重建。未创建的过渡由图形队列处理。其余计数别名、第二套工作窗实际分派和三端组合继续验收。 [本机差异及待证条件](game-static.md#fixed-se-classic-scene-window-queue)

两版 202 的等待已核到发送后的置位和序号回复解除。地图补片尾部还要求 SE `BFF330` 或 Item `C9C4B8` 为 1。两份固定 PE 所查直接写入均置零。取得对应具名写入或原版状态记录后，核进入条件及与旧地图、同身份重复消息的实际交错。 [待证条件与本机差异](game-static.md#legacy-map-wait-patch-release)

stage306 在匹配补片后开放新图输入，Canvas 实际呈现要等资源读取返回。固定 SE 的条带完成发生在外层提交调用之前。图形重建时的背景生产路径已核，实际像素、填充值及设备失败交错继续验收。三端将用活动场景的呈现回执控制新的交互准入，并沿 GF-A10 核追帧、读失败和重新准备。 [复现与完成条件](game-static.md#fixed-se-ordinary-map-fades)

stage306 的回城画布在共享图形读取未返回时关闭，旧画布会跳过迟到绘制，共享控制器保留已准备的待呈现帧。新画布反复请求后依然等候。绘制端直接失败则由现有客户端终止。D0/D2 沿当前场景和过渡代次处理待呈现帧的接续及错误恢复。 [独立复现与来源规则](game-static.md#legacy-transition-graphics-rebuild)

两版普通移动先尝试移动，再在地图重读中复查缺格。stage306 当前在移动调用中按地图修订取网格并判断是否续接。D0/D2 沿已证帧次序接线。Item 独立读点的实际调用继续按具名证据核对。 [来源和验收范围](game-static.md#legacy-map-movement-refresh)

两版原版的活动第三平面写入按 B 和原起点偏移判定。stage306 的单缓存对同 B 异 A 直接返回不可用。D0/D2 将这项差异与路径值接到现有状态，D5 核实际读写与重试。原版短读和部分写入的可见结果待适用文件回执。 [磁盘与活动图差异](game-static.md#legacy-map-cache-io)

校验通知会查询通知 B 对应的文件。stage306 的单缓存对不同 B 返回不可用。两版原版在打开失败后仍进入比较，匹配、补取及退出的实际表现待适用文件回执。 [通知与补取核验](game-static.md#legacy-map-notice)

stage306 收到新目录值后，在 A/B 及头相同的情况下仍使用原缓存。固定两版在非零 A 的路径中使用新目录值。实际两条消息的先后、原文件和三端重开沿 MF-T01 核。 [目录变更的本机差异](game-static.md#legacy-map-context-reentry)

## 普通用物与工作目标的替换

固定 SE 的经典二级窗在析构时仍读取共用回调。已核同号过渡的消费资格，实际多请求、回包配对及释放归属沿 SC-T16、SC-T17 验收。另一套 77/78 的活动分派和三端用物仍待验。 [取值时点](game-static.md#fixed-se-item-target-retirement) · [过渡消费](game-static.md#fixed-se-classic-scene-window-queue)

## 第二套训练报价页数与宠物窗准入

固定 SE 已核窗 58 的局部准入和翻页，总页数 `C07F8C` 的发布仍等具名写入或适用的同版运行材料。Item 同号刷新先写报价，再请求打开。未知的是两版第二套窗口实际活动分派及旧选择能否在替换后被消费。两版第二套遗忘窗的无命中分支继续沿已证背包说明索引和实际输入验收。 [报价恢复条件](game-static.md#fixed-se-training-quote-pages) · [遗忘规则](game-static.md#historical-forget-return)

## 战后结果的实际结算和窗口消费

两类结果已核固定 SE 字段和窗 30/31 的所选消费者。stage306 的现有世界入口尚未发布这些结果窗口，后续沿 D0/D4 接实际调度，D5 核呈现与声音。物品图号与服务器结算的配对、真实同版结果及更多待处理字写入条件沿 ST-GAP-01/02。 [结果规则和本机证据](game-static.md#fixed-se-battle-results)

普通制造窗的 `476170` 同时接初始化和控件前计时，`4767E0` 负责后置绘制。实际产品需按两次回调分别验材料资格和当帧显示。另一套窗 14、19 的已登记回调仍待普通帧提供实际活动参数。 [原指令与待验条件](game-static.md#fixed-se-entry-business-admission)

## 目录检索、迷你邮件与服务回复

stage306 已能解码目录、检索、资料和迷你消息，业务发布及界面待接入。固定源中正文提交后可先写本地历史，实际扣款、投递与拒绝沿 MM-R1。取消与提交的标记范围不同，焦点释放和同号复用应按实际对象组织验收。目录缩表、过期回复及活动编辑切换仍用同一组用例。 [来源条件和用例](game-static.md#fixed-se-classic-directory-mini-mail)

## 经典两级用物目标的回复与退役

stage306 已解码 `LC=`、`LHm`，业务资料和选择界面待接入。原版一级会覆盖资料并保留行号，二级会使用当时一级表。实际服务配对及合法的覆盖、迟到、无主范围待核。窗口组替换的取得和实际析构各有时点，另需验构造失败与旧窗提前退役。另一套注册按其独立来源槽及实际调度验收。 [源规则与待验证条件](game-static.md#fixed-se-item-target-menus)

## 场景回包 `CcL` 的待验证条件

固定 SE 已核八个模式的入口、主要终止条件及按 ID 尝试补建身体的次序。stage306 已解码，仍需接入实体和场景帧。原版实际服务触发、尾迹和逐帧图形、同版行为及换场后三端结果沿 CCL-A01 至 CCL-A05。 [用例与待验证项](../analysis/capability-first-v1/game-actor-functional-specification.json#/fixed_se_ccl_scene_publication/proposed_acceptance)

## 人物窗口和工具栏的待验证条件

固定 SE 已核工具栏重开的读写链。文件提交成功、宿主恢复及各窗口实际退役仍沿原用例验证。阵位、点数和个人称号的本机结果覆盖字段解析、现有编码和资料投影，后续验收实际发送准入、权威状态更新及同版行为。 [固定范围与排程](game-static.md#fixed-se-classic-toolbar-status) · [本机回执](validation.md#fixed-se-classic-toolbar-status-validation)

简介草稿、按角色保存、目录版本与冷启动读写已具备固定样本静态规则。原版短读、保存失败、目录缩表后的同帧点击、输入法组合及三端目录发布仍待验。迷你邮件的通知值仅核到提示和历史方向，实际扣款和投递继续沿 MM-R1。 [简介待验证项](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_classic_player_profile/pending) · [目录待验证项](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire/directory_publication/pending)

他人简介的查询入参与窗 64 消费已按固定 SE 原件核对。四类查询实际返回的标签和配对仍待证。原版的边界字节、关窗与收包交错、窗口位置和肖像图块沿 PROFILE-A09 至 PROFILE-A12 验收。三端待接实际发布和呈现。 [规格与回执](validation.md#fixed-se-other-player-profile-validation)

## 固定 SE 出站分支的待证条件

普通移动所查类型 2 写入需要 `4A31B0` 返回非零，固定样本该函数返回零。保留已证构帧和消费端。后续有合资格的标记写入、间接调用或适用原版观测时，沿 G04 判定入口。经典名单的当前资料、交互与真实详情回复沿 SF-A09。另一套 79 号窗实际帧分派和关闭沿 EA-U2。 [来源及用例](game-static.md#fixed-se-outgoing-admission)

## 经典窗口重开与实际保存

Item 的经典窗口重开按调用时的状态决定。选择性重开时，22 和 23 的标记共用一次 22 请求，创建失败后的实际活动状态及保存失败回执仍须验收。第二套窗口表继续等待实际回调调用和活动参数。当前同版以及网页、移动网页和微信接线沿原要求验证。 [来源与本机回归](validation.md#legacy-item-classic-rebuild-modes-validation)

两版经典训练已核等待页再输入、取消确认和标记退役的静态分支。现有共享入口在报价或选宠发送时清页。继续沿 OS-A24 验原版真实鼠标事件、回包与发送失败交错及三端接线。OS-A26 需取得具名的正常调用、实际帧分派或适用运行材料，届时与工艺及图鉴一同核对活动参数及退役顺序。 [规格与对照](game-static.md#legacy-pet-training-controls) · [当前取证安排](development-plan.md#capability-first-next-analysis)

## 登录器文件前检的宿主回执

固定 F5A 已核对所选操作需要的文件，以及何时报告路径错误、文件缺失和写入失败。继续在原路径验收用例收集 Windows 的实际代码页、属性与最终路径结果。三端接线、GP-U01 的回退文件和子进程身份、L07/X07 的当前同版游戏读取各有待取的证据。 [来源与本机对照](validation.md#f5a-path-preflight-validation)

Chrome 的新文件夹选择会先清旧交接准备。微信本机夹具返回的选择取消与读入失败共用文件错误，基础内容保留，已选候选失效。按目录新旧内容、选择、保存与读回验收实际宿主。存在同 Code 两行时按各自行前提执行，并核设定键读回。 [复现和待验](validation.md#launcher-directory-host-handoff-validation)

## 自更新的实际关闭和清理

固定 F5A 在就绪后先清句柄槽，再请求关闭。该分支直接从投递调用返回。实际投递、窗口与进程退役、替换结果和清理失败继续沿 UF-T12/UF-T13 验收。三端的新启动与发布读回继续沿原宿主用例。 [来源和验收范围](launcher-static.md#f5a-update-handoff-and-ack)

正式三端需在实际启动准备后核对活动根和构建身份。微信现有双槽会覆盖旧提交，重建的整槽字节也可能与旧槽完全一致。本机 SDK 夹具已测历史截短后的 App 重开、历史读回后复用槽位及晚到确认。正常工具进程重开也已读回小型完整夹具。实际产品历史写失败、异常中断和陈旧回执沿 UH-U02/U03 验收。完整素材已有分段临时读回，普通写入及另存均遇容量边界。完整持久化与真机重开仍待验证。 [正常进程重开回执](validation.md#wechat-devtools-process-reopen-validation) · [实际配额](architecture-and-milestones.md#wechat-sdk-archive-ordinary-quota)

完整素材的选择清单可在所测 DevTools 新进程中读回。临时第 2 段受控移开后，清单及第 1 段仍在，只需补选第 2 段。普通复制和普通写入在该版共用配额检查，完整持久化沿 UH-U02 验收。 [临时段跨进程恢复](architecture-and-milestones.md#wechat-sdk-segment-process-reopen) · [普通复制](architecture-and-milestones.md#wechat-sdk-segment-resume)

旧归档关闭与在途读取的结算已有本机对照。受控微信回调中只中止外部信号会先拒绝读，外层归档仍显示 open，实际回调稍后可到。成员头读超时后再次读取同一成员仍报告首次超时，其它成员可读。D0/D5 补真实排空及按原来源重试的接线。 [问题回执与实现归属](architecture-and-milestones.md#resource-budget-retirement)

Chrome 游戏页在等待 ZIP 初始化时取消会立即退出准备。延迟旧归档的首段读取后，旧调用仍发出一次中央目录读。两段字节随后清零，下一次准备继续。D0/D5 需在首读前绑定所有者，取消后停止发起读取，并在实际完成时归还占用。Safari 已核到活动 `Graphic.bin` 范围读的失败。 [Chrome 复现和验收范围](validation.md#game-resource-reopen-composition-validation) · [Safari 读取](network-portability.md#safari-navigation-resource-read)

## 经典治疗提示和待退役状态

现有治疗视图提供费用、伤势等级、合计和实时金币，选择或取消生成本地请求时清页面。固定 SE 与 Item 的提示绘制返回后仍有当帧处理，窗口退役沿后续整理。第 19 项控件的所选保护已核，其它写入沿具名来源继续。另一套窗口的帧分派、当前同版与三端运行待验。 [原版规则与本地对照](game-static.md#legacy-classic-dialog-frame-hook)

## 图形覆盖值的运行时来源

固定 SE 和 Item 的覆盖字节位于加载时零填充区，精确地址引用均为读取。两份旧版对 `data\update.dat` 的四处直接路径引用均已绑定图形写入。下一次取证需要具名非零写入、后续读取调用或适用版本材料。原设备若出现纹理查询返回 0 但输出为空，静态分支会解引用空值，实际返回组合待验。16／24 位像素、三端恢复和当前版本继续按 PR-A10 验收。 [档位与文件](game-static.md#legacy-render-device-preparation) · [恢复条件](game-static.md#legacy-render-presentation-recovery)

当前启动规格已核到首个键、默认值和有符号低字节。现有本机入口会保留合并文本，配置查询 `EACCES` 直接返回失败，活动图形仍从独立上下文取绘制模式。PR-D4 处理档位传递和所选打开失败结果。潜在读回与覆盖来源沿新证据复核。 [启动用例与本机结果](validation.md#legacy-render-startup-tier-input-validation)

历史安装包的配置成员范围读取两次返回 FTP 421。已用安装脚本核长度及 CRC32，若得到同一档案的实际成员，再补完整摘要。当前游戏的同版消费需要可分析指令或适用的启动文件读入回执。 [样本和下载回执](validation.md#legacy-render-startup-tier-input-validation)

所测 Canvas 宿主在呈现抛错后停住。手动推进使用原上下文恢复绘制。绘制表面忙与输入消息触发的图形重建仍待实现，原版提示期间的消息送达及三端窗口模式调整待验。 [静态规则和本地对照](game-static.md#legacy-render-system-key-rebuild)

## 实际代码更新后的启动确认

Chrome 夹具混入不同版本的共享依赖后仍可配置。真实生成的微信入口在本机加载另一份有效配置，也可与之前的资源到达可连接状态。受控的旧导航失败可清空新待交接槽。D0/D1/D5 沿加载清单、对应导航和最终发布接入。实际微信代码更新、三端产品回执及同版游戏仍待验。 [复现与规格](architecture-and-milestones.md#portable-boot-entry-identity)

## 补丁完成的宿主验收

现有共享函数已覆盖退出分类。F5A 的阶段续接与托盘请求已核静态来源，真实 Windows 的提示、定时清理和关闭重入待验。回退文件身份与同版游戏读取继续各按原证据补齐。 [现有退出解释](../shared/launcher-patch-current.mjs) · [固定来源](launcher-static.md#f5a-patch-completion)

## 首次配置的文件异常与实际退出

现有共享启动计划覆盖旧版同步等待。F5A 的 9002 观察、写标记和续接待按 D1/D5 接入。固定配置器的原文件删除失败可能留下旧尾部，实际文件异常提示、普通关闭进程码和 F5A 同版配置器身份继续验收。用实际设置读回确认文件效果，用宿主退出回执推进启动。 [来源与待验用例](launcher-static.md#first-config-dialog-outcomes)

F5A 在首次配置进程仍被跟踪时，会挡住所查目录重选及普通启动入口。产品接入需核清活动进程或宿主任务、设置提交及重开的实际回执。当前通用配置计划按旧版同步语义，网页和微信的目录恢复已具局部回执，首次配置提交及重开待实现和验收。 [共用准入与本机差异](launcher-static.md#first-config-directory-composition)

## 登录提示返回后的输入通知

C82 与 F5A 已核所选编辑处理和恢复后的焦点请求。真实控件的通知送达顺序、合法的新绑定生产者和旧借用退役仍按 LS-U3 验证。网页和微信的输入事件映射由 D5 复用同一合同核对。 [来源与待验用例](launcher-static.md#launcher-edit-focus)

普通退出提示前清准备资格与 F5A 排队消费的前后顺序已核。LS-U3 继续沿能形成实际旧借用和新绑定的具名入口取证。实际定时器、Frame 关窗与通道排空由原 LS-T19 至 LS-T21 验收。 [固定样本范围](launcher-static.md#launcher-ordinary-exit-confirmation)

## 断线提示与选服的产品差异

现有网页会话收到 EOF 后进入终止流程。固定历史 Item 的所选断线会先等待一次提示确认，再发布选服状态。目标宿主 EOF 与其它断线来源的对应关系、完整恢复及同版适用性待验收。 [现有会话](../web/legacy-game-session.mjs) · [原版规则](game-static.md#legacy-item-disconnect-recovery)

## 图形暂存的非对齐尾部与宿主效果

320 号真实调色板载体已核前 3,360 个解码字节。所核九档的 664,162 个正尺寸记录均为四字节对齐。PR-U1 继续等待实际需要的非对齐记录、尾部来源和实际后端路径。缓存命中、失配重建及各自发布的元数据已入固定来源规格。 [来源规格](game-static.md#legacy-graphics-scratch-provenance) · [素材核验](validation.md#legacy-graphics-scratch-provenance-validation)

当前 Canvas 把移动、按下和松开写入同一位置，第二次按下在入口仍是普通按下。微信会将换算后的触控值夹在画布边界。本机已核逆序尺寸回调，实际宿主拖出、双击、零尺寸和重建期间的输入沿 PR-A10 继续验。 [输入差异及待验](validation.md#legacy-item-pointer-position-validation)

## 微信游客模拟器的 TCP 建连失败

基础库 3.18.0 在 `127.0.0.1` 的实际试次报 `-4 invalid address`。经现有适配器选择符合校验的同机私有地址，结果为 `STREAM_CONNECT`，私有地址的底层原因待证。两个本机监听器均零接入，四组回调注册和移除调用均正常返回。后续按具备连接条件的微信宿主验证收发及关闭。 [TCP 复现](network-portability.md#wechat-devtools-local-tcp)

## 登录错误提示显示期间的输入

固定 C82 的错误提示由主登录窗拥有。按 Win32 应用模态规则，其子按钮在提示显示期间禁用普通输入。原版实际投递的排队消息、后台生产者和销毁效果仍需具体回执。成功回包的预设入口另有忙标记检查，复现时需记录同一主对象的忙标记、会话绑定和回调是否仍在栈上。 [输入与恢复条件](launcher-static.md#c82-owned-login-error)

两版列表双击的普通来源已从模板和通知表绑定。该列表属于提示的主窗，适用同一应用模态规则。实际派发的程序消息与旧借用期间的新绑定仍待证。 [列表来源与提示边界](launcher-static.md#launcher-list-activation)

11 月版的 `0x8242` 只消费匹配编号的待处理项，随后检查根窗、主窗、提交按钮和表单条件。已核普通断线经定时器重试、所选错误结果在提示前请求停止、两条回调各自收尾。实际提示中何时派发、其它消息生产者、退出销毁和新绑定准入仍待。 [排队提交](launcher-static.md#f5a-login-owner) · [断线与错误结果](launcher-static.md#f5a-disconnect-retry)

Windows 夹具已证拥有者提示期间会派发预先排入和显示期间投递的消息。实际登录器的生产与投递、旧借用跨提示时的新绑定仍待证。 [宿主结果](launcher-static.md#windows-launcher-modal-dispatch)

固定 F5A 的所选错误结果在维护调用栈中显示提示时，再入的连接维护受计数门槛约束。本机受控会话在取消返回时仍可等待关闭回执，回执失败只记入原尝试。D0/D1/D5 用 LS-T20 核实际借用归还、退役和新绑定，C82 与 F5A 按各自来源验收。 [来源和本机结果](launcher-static.md#f5a-pump-retirement)

状态 0 回复已核收到标记、准入和选择更新顺序。实际 Windows 回调、关窗投递结果、步骤分派中的重入及同版接收继续验收。 [回复准入](launcher-static.md#f5a-status-zero-admission)

F5A 自动确认可在回复借用期间进入托盘失败提示。已定位普通预设命令的根窗启用检查，以及同编号再次准备时的已尝试检查。原版模态提示期间实际派发了哪些消息、接收时的阶段及能否形成新连接绑定仍待证。 [所选正常入口](launcher-static.md#f5a-start-return) · [编号与预设规则](launcher-static.md#f5a-preparation-generation)

F5A 的候选截止和任务引用退役已核对固定映像。定时器创建失败后的实际表现、消息派发与解析完成的先后、取消后重绑和同版会话继续验收。 [候选解析范围](launcher-static.md#f5a-candidate-lifecycle)

C82 与 F5A 均保存计时器申请结果并继续候选启动。收到编号 100 时，所选静态入口按当时忙态处理。原版实际申请失败后的消息、退出确认中的计时器派发、旧绑定退役及同版会话仍待核验。现有网页的调度异常和到期优先已有可复现用例。 [来源与对照](launcher-static.md#launcher-login-timer-dispatch)

<a id="current-game-handoff-evidence"></a>

## 当前同版游戏交接

F5A 的定时器、通道、配置及普通输入入口已有原字节证据。LS-U3 继续核普通 IDOK 的实际入队和送达、候选完成、新登记及旧借用的先后。GP-U01、GP-U03 仍需适用备用制品及进程退出回执。D5/D6 按对应原用例核实际关闭排空与联合接受。 [普通输入及取证范围](launcher-static.md#f5a-ordinary-input-idok) · [入口归属](launcher-static.md#fixed-f5a-entry-business-admission)

F5A 的首次配置缓存和三个加载失败分支已有固定映像依据。配置器实际启动、宿主轮询、写回失败后的重开以及返回游戏启动的结果继续验收。 [首次配置范围](launcher-static.md#f5a-first-config)

11 月 4 日分发版的普通创建调用和返回边已有静态来源。其对应的公开游戏更新清单仍匹配留存程序，三个游戏主程序的 `.text` 均无文件字节。游戏读取命令行和映射、实际创建与联合接受需要对应材料及运行证据。 [分发与交接来源](launcher-static.md#f5a-official-launcher)

组合复核已重核三份留存游戏主程序的哈希和节表。L07/X07 需匹配版本的启动输入读取与后续消费证据。固定 SE 的人数提示已核 `58510C` 的读取及清零，等待非零写入或适用运行记录后决定准入。 [组合复核](validation.md#capability-launch-entry-recovery-validation)

固定 Item 的入场拒绝和超时进入确认提示。现有角色模块进入 `failed` 后网页会话结束。D0/D2 沿 GF-A06 核实际发送时钟、失败提示及选服回调，首个有效呈现继续沿 GF-A07。 [来源及本机差异](validation.md#fixed-item-world-entry-validation)

当前网页会话遇到已有世界投影会拒绝再次选择。GF-A05 已核 Item 的清理、缓存读回和状态发布，后续沿共用角色和场景所有者实现并验收实际换角、输入法及首帧。 [复位来源与回归](validation.md#fixed-item-state5-reset-validation)

固定 Item 的创建拒绝和超时在提示阶段共用重名文字。本机共享层分开报告结果，并按实际操作过滤刷新时的旧回复。原版同一会话内的迟到次序及 `profile.dat` 的真实失败与重开继续验收。 [创建相关证据](game-static.md#fixed-item-character-creation)

固定 Item 名单的 `OUTOFSERVICE` 进入维护确认。所查名单等待返回值中，-4 的实际触发条件待证。当前共享会话共用选角与创建放行，原版两条输入条件的实际交互、预览呈现及返回选服沿共用用例验收。 [来源与本机边界](game-static.md#fixed-item-character-roster)

固定 Item 的逆向外观表有 14 项，输入 242,800 会在所选逆向路径算出索引 14。共享层保留边界拒绝用例，原版运行结果待证。预览分配、实际图块及控件反馈继续沿 CH-T12 至 CH-T14 验收。 [反向表与测试](validation.md#fixed-item-character-appearance-validation)

选角动画装载会检查分配和计数，所核原读点的短读结果待证。现有资源库已通过指定读失败和重试。准备帧与活动帧的实际窗口提交、对象退役及三端呈现仍沿 CH-T14 验收。 [帧来源与本机结果](validation.md#fixed-item-character-preview-frame-validation)

选角主状态已核扫除、收集和绘制消费。原版实际显示仍受时钟与设备条件影响，分配为空的结果已做本机组合对照。三端需核实际预览提交和换槽时的在途任务取消。 [证据和验收](validation.md#fixed-item-character-preview-draw-validation)

建角草稿已有数值和预算处理。实际界面仍需接预览对象、转向和详情返回，按原用例验两份预览、分配为空和素材失败。现有素材回执覆盖类别 7 的四次软件预览层。 [已核和待验范围](validation.md#fixed-item-character-creation-preview-validation)

两版原建角详情在对向属性有值时拒绝加点。当前共享草稿的直接动作仍可在两种预算条件下转移点数。需在共用准入补齐该条件，在三端验证跳过、隐藏和零预算正常转移。 [本机差异与验收条件](validation.md#fixed-item-character-creation-details-validation)

F5A 的候选到显示行映射已核对原指令。实际 Windows 中的多字节筛选、锚点组合、插入返回和重建后选择仍需按同一组用例核验。 [来源与验收条件](launcher-static.md#f5a-profile-list-projection)

F5A 置顶、备注、筛选、组内移动、重置和撤销已有固定来源。普通阶段 4 空闲时的回复准入和备注确认目标已核。实际备注窗口消息、能够使列表合资格替换的入口、拖动坐标、写入失败后的文件读回及三端重开待验。移动的反编译遗漏所选分支，规格采用 REA 指令与独立 PE 核验。 [候选操作](launcher-static.md#f5a-candidate-management) · [备注窗口待验条件](launcher-static.md#f5a-note-modal-admission)

F5A 的映射发布已核视图范围不足、准备记录的异常和两种退役入口。实际仅刷新值在投递期间的变更、视图释放结果及当前游戏读回，继续按原宿主接受验证。 [所选源路径](launcher-static.md#f5a-mapping-lifecycle)

F5A 的普通确认和启动已核设置保存失败、首次配置、映射失败及仅刷新各读取点的顺序。原版 ANSI 多字节名称、实际读回、刷新值变化的触发、提示期间的投递及同版游戏读取仍待验收。 [组合规则及用例](launcher-static.md#f5a-ordinary-handoff)

F5A 已核控制器 `+0x1764` 的构造清零、所选回复写入和启动读取。实际回复到达与调用顺序、数字的业务含义，以及当前游戏读取显式进程参数和映射内容，仍需对应运行或版本材料。 [字段与证据范围](launcher-static.md#f5a-handoff-number-origin)

11 月分发版的文件枚举及长名转换已有原字节证据。Windows 安装目录的七组搜索已采到原始顺序及 26 个非空短名，实际行均可由长名满足搜索式。默认初始化、普通构造器再次选择与线程表刷新已有启动链依据。仅短名命中、原启动器该次生效的代码页和更新后目录继续按实际用例验收。 [已观测顺序](launcher-static.md#windows-installed-resource-enumeration) · [启动选表与范围](launcher-static.md#f5a-normal-startup-locale-selection)

历史 Item 的参数读取和加载实参已定位。留存的三个当前游戏样本复核哈希和节表后，`.text` 文件字节仍为零。Windows 的实际匹配行已用于历史路径对照，当前同版游戏的交接读取仍需对应版本证据。 [Item 与当前样本](game-static.md#legacy-item-resource-handoff) · [来宾查询](#guest-resource-enumeration-access)

排查条件窗口时按对象的实际构造参数核对模板。C82 与 F5A 都用 130 构造更新窗口，析构分支另传尺寸 296。模板 296、30721、30734 的实际加载仍待具体业务调用证据。 [条件模板核验](launcher-static.md#conditional-template-scope)

## 普通关窗时的补丁进程观察

固定 F5A 的两次关窗都已绑定到同一 Frame。排查时核对忙态首轮、Stop 后投递、后续准入及实际窗口销毁。析构阶段的 `CloseHandle` 只提供跟踪句柄释放证据，实际补丁退出和备份状态需要独立的进程与文件回执。 [原版关窗及跟踪句柄](launcher-static.md#f5a-close-ownership)

## 浏览器生命周期命令与实际暂停

早期 Chrome 最小化和冻结命令返回后，页面仍可见并持续运行。自动化临时上下文的初次切换也保持可见。改用独立 Chrome 的普通配置，在同一窗口切换普通标签页后，实际游戏页收到可信隐藏和可见事件，已核短时暂停、原连接回复和后台 EOF。后续验收窗口最小化、系统切换或长后台时，仍按实际可见性、绘制和连接回执判断。 [底层连接和帧证据](network-portability.md#desktop-stream-lifecycle) · [实际标签页切换](network-portability.md#desktop-game-tab-visibility)

Safari 在同源替换导航和 `pagehide` 关闭处理之间可能把旧读的 `NotReadableError` 发布为 `LEGACY_ASSET_READ_FAILED`。同一类错误在旧所有者关闭后到达时，新页可独立开始。D0/D5 沿现有页面与资源接口接入导航归属。实际手机的其他离页路径、长时后台和中断后持久根读回待验。 [离页与受控读取回执](network-portability.md#safari-navigation-resource-read)

## 角色升级资料与删除结果

固定历史 Item 的 `9C0A48` 和固定 SE 的 `923C40` 都有类别 7 升级的读取证据。两版的空字串构帧和后续等待已核，发送时的资料值、生产与归属仍待正向来源。Item 的所选删除等待返回 0，实际服务器删除需要可核的请求及结果。 [角色操作来源](game-static.md#legacy-item-character-operations) · [空字串路径](game-static.md#legacy-upgrade-empty-material)

Item 的提示缓冲区和所选邻接四字节初始化均已核写入边界。`VKW` 的两条所选结果分支写检查状态。后续 CH-U1 沿能写入升级资料的实际来源取证。 [提示、检查及升级字段](game-static.md#legacy-item-upgrade-buffer-provenance)

Item 的 `4AAA73` 向前清零从 `A15BF0` 开始，类别 7 资料地址 `9C0A48` 仍待写入证据。现有共享流程在请求待回时接纳第一条升级结果。原版 Item 在活动状态 13 内处理结果，D0/D2 已登记帧顺序和接纳差异。 [写入范围与结果顺序](game-static.md#legacy-item-upgrade-result-flow)

已核 Item 两处启动交接写入及 `Wb^` 类别写入的归属。类别 7 的资料地址仍待实际写入来源。异常映射和选服时的异步关窗结果继续按 Windows 运行证据验收。 [交接和类别边界](game-static.md#legacy-item-startup-handoff)

## 普通帧到期时的解除顺序

本机夹具将工作上下文剩余时长推进到 1 毫秒，再进行一次 1 毫秒更新。stage306 当次生成解除和配方查询。固定 Item 与 SE 的所选调用在扣时前检查，依照该顺序，归零后应等到下一次符合条件的更新才解除。D0/D3 按源顺序调整后复跑同一边界。 [源码和本机证据](game-static.md#legacy-work-context-frame-order)

## 浏览器资源换版的剩余恢复条件

Chrome 已测原地图、单角色、动态调色与两路音效的所选联合占用。仍需完整普通场景和战斗回放、真实产品端口、其他宿主及自然工作集压力。实际存储和物理设备继续沿 UH-U01/U02/U04。 [联合占用的实测范围](architecture-and-milestones.md#real-map-mixed-resource-budget)

stage306 的动画目录按组重复应用坐标索引，A/B/A 的后一个 A 可重新覆盖 B。固定 SE 在同名文件已开的分支跳过该组索引。D0 在原目录构造处理别名，D5 共验覆盖和根释放。所选实际 ZIP 的七组指向相同索引，当前结果一致。 [差异与恢复条件](game-static.md#animation-coordinate-alias)

坐标索引读到非 1 标记且数据存在时，stage306 拒绝整个候选。固定 SE 保留数据句柄并继续。可选动画组有索引却缺数据时，现有目录保留覆盖，首读报截断。D0 处理索引降级与受控首读，D5 核同一根其他动画、旧根和补齐后的新根。原版低地址调用的运行回执与畸形坐标尾行继续沿来源条件验收。 [复刻用例](validation.md#animation-load-failure-validation)

Chrome 所测四个战斗音效自然结束后，声部槽仍持节点。D0 按槽和声部的当前归属归还独立 PCM，确认重复居中仍可复用解码缓冲。所测微信 SDK 的音频关闭早于内存夹具的晚到读归还，资源租约继续等待实际读取结算。真机手势、微信后台和设备输出沿 AF-T12、UH-U04。 [桌面回执](validation.md#browser-audio-voice-budget-validation) · [微信回执](validation.md#wechat-sdk-audio-voice-validation)

移动 Safari 模拟器已核可信触摸启动及离页的晚到读取。原文档只观测到关闭请求，实际结束后的上下文状态继续沿 AF-T10、AF-T12。手机后台与可闻输出按目标设备验收。 [移动 Safari 的触摸和离页回执](validation.md#mobile-safari-audio-lifecycle-validation)

桌面 Chrome 已实测事务保持打开、显式 `commit()` 返回后和完成事件后回执交付前的三种中断条件。移动 Safari 模拟器也已核到显式提交后、完成事件交付前退出及重开。显式提交试次采用 `strict` 事务，默认持久性、产品实际配额压力、系统淘汰和断电仍待验证。 [桌面证据](architecture-and-milestones.md#browser-explicit-commit-interruption) · [移动证据](architecture-and-milestones.md#mobile-safari-explicit-commit) · [配额核验](architecture-and-milestones.md#browser-update-quota)

现有网页单记录缓存在一次事务完成回调内中断后，重开读取返回空资源。五个新隔离目录均读回应有的新修订，异常原因待证。D0 按已知发布预期与活动根、回执和意图复核，覆盖重开时记录全部缺失的情况。 [实测条件](architecture-and-milestones.md#browser-resource-cache-interruption)

Chrome 157 的一次默认模式在重开后读取 IndexedDB 库元数据时报告 `UnknownError`，成因仍待查。受控打开的六组结果在 Chrome 和 Safari 模拟器一致。受控删除试次已复现同号旧修订覆盖，D0 按活动根身份和修订复核写入。 [旧打开回执](architecture-and-milestones.md#browser-cache-receipt-recovery) · [打开与排队实测](architecture-and-milestones.md#browser-cache-open-outcomes)

移动 Safari 模拟器已核约两秒真实隐藏、后台收包、旧租约读回及进程重开。实际产品分块、真机容量、长时后台与微信仍待验。 [存储恢复](architecture-and-milestones.md#mobile-safari-resource-lifecycle) · [连接时序](network-portability.md#mobile-safari-stream-lifecycle)

双版本实测中，旧根从索引删除后仍有部分文件占用。持有 Blob 的小夹具证实关闭旧页可在同进程释放该份占用。产品回收需覆盖实际读取排空、待处理意图、保留策略及仍占用的旧数据。 [资源预算与占用](architecture-and-milestones.md#browser-full-resource-budget)

**已复现的资源差异**。现有微信 ZIP 适配器依赖路径。旧读者缓存成员头后，同一路径换成等长新档时，读局部存储成员会返回新字节。复刻沿各次来源固定和实际排空处理，真实微信描述符及完整持久发布仍需验收。 [复现与规格](architecture-and-milestones.md#resource-reopen-reader-identity)

实际 ZIP 资源库关闭后，Chrome 的后备存储在即时采样点仍有占用。显式 GC 后两份目录回到接近基线。桌面分块夹具已核实际 ZIP 旧根回收和正常重开，产品回收、自然淘汰、突停与并发读排空仍待验。 [实际资源工作集](architecture-and-milestones.md#desktop-resource-working-set) · [持久化实测](architecture-and-milestones.md#desktop-persisted-resource-archive)

移动 Safari 模拟器从 IndexedDB 读回所测复合 Blob 时多出原 ZIP 结束记录的 22 字节。先读成连续字节再写入后，重开时 304 块逐一匹配。移动设备内存峰值、不同素材的版本共存和系统回收仍待证。 [移动读回与修正](architecture-and-milestones.md#mobile-safari-persisted-resource-archive)

## 战斗结果第四格与生产者暂存

新角色的结果区初值由分配时清零确定。队列重置后，同一行第四格仍由该对象的写入历史决定。所选 RID 复制读取该格。 [结果队列规则](game-static.md#battle-result-tuple-lifecycle)

固定 SE 的 SKL266 变体 2 会在普通外部结果沿用前一外部 RID 的第一项。当前共享计划写 0，投射入口按收到的值复制四格。无前序 RID 时，初次第四格和自身尾部读到的原版栈值仍待证。当前自身尾部缺少外部上下文时返回明确的未支持结果。其它生产者暂存及完整回放继续按 BF-U1 核对。 [RID 来源](game-static.md#battle-266-rid-frame) · [投射物与本地对照](game-static.md#battle-266-projectile-row)

固定 SE 的所选仅自身 RID 输入已核到预检和护卫写入。清零帧在静态条件下继续向结果对象追加，当前共享计划在无外部 RID 时提前返回。同槽恢复当前会合并护卫等待，原版入队保留这些动作。其它帧的暂存、原版同槽推进和角色退役继续按 BF-U1 核验。 [原输入](game-static.md#battle-266-source-admission) · [护卫顺序与本地差异](game-static.md#battle-266-self-guard-context)

本机已复现 404、405 与 266 同帧和相邻帧的所选调度。固定 SE 已绑定 `46AB90` 调用的经典指令窗 26。本机两组倒计时夹具在等待或回放阶段保持菜单状态 2，跨阶段推进差异归现有窗口所有者。所选长接收与 `M` 入队已绑定。BF-U1 继续核能与三个暂存字重叠的具名中间写入、其他实际业务分派和原版读值。 [窗口差异](game-static.md#battle-classic-input-window-frame) · [接收后的写入范围](game-static.md#battle-266-long-receive)

固定 SE 的音频维护在所选条件下会写满三个暂存字。所选入战旧请求最迟在 `10/0` 捕获前被消费，首次捕获清掉剩余请求。跳过接收清零时较早的编码字、其他音频和宿主写入及原版实际首读仍沿 BF-U1 核对。 [覆盖范围](game-static.md#battle-266-audio-map-save) · [入战时序与剩余证据](game-static.md#battle-entry-audio-request)

网页会话处理缓存时，第一条 `M` 后的 `discard` 会令第二条完整 `M` 等下一次流读取。共享协议入口可在推进后继续消费，本机夹具已复现两种入口结果。D0/D2 沿 CF-D3 补当轮重查，目标三端及同版实测沿原验收。 [现有用例](validation.md#battle-266-long-receive-validation)

战斗指令窗标记当帧仍更新并绘制。所选拖放、文字焦点、组合与候选的入队写入已核。stage306 的共享文字批次会拒绝优先级 226。窗 26 的实际动态登记、活动输入法和时区的宿主回写、其它前序对象及 SKL266 实读继续沿具名证据和对应验收。 [输入所有权](game-static.md#battle-266-window-input-retirement) · [候选差异及用例](game-static.md#battle-266-ime-presentation)

固定 SE 时区查询失败时保存该 UTC 分钟的失败标志。切换日回退读取的分和秒仍需适用运行记录。stage306 所用秒数端口收到 `-1` 会返回日历错误。原版年份越界后的 32 位投影、活动宿主回写及 SKL266 实读按已登记用例核对。 [日期边界与本机差异](game-static.md#battle-266-host-calendar)

技能 266 的护卫交接、相位摘链和角色动作 216 已核到固定 SE 指令。共享回放交接后跳过再次测距，且在护卫到达时清通用计数。BF-T36 已登记排序、距离及相位边界，原版实际同槽播放、独立等待恢复、离场或替换及数值变化仍待验。 [原版条件与本机差异](game-static.md#battle-266-relay-retirement)

非反射 106 所选查找已绑定 105 游标、动画准入和对象遍历顺序。原版两条回调实际合帧、读值及异常恢复仍待证，现有共享命令入口仍返回未支持。低等级 116 到达索引 200 时的队列重叠已有源字节证据，后续结果需要实际运行证据。 [同帧与命中条件](game-static.md#battle-105-106-callback-order) · [独立结果身体](game-static.md#battle-detached-rid-context)

## 游戏补丁缺文件分支的实际供应

固定安装分发的 `Patcher_PUK3.exe` 已与四条魔力配置和既有 REA 样本绑定。11 月版现已核到盘符根目录、`<Code>.pat` 回退复制、备份启动及重试。当前登录器分发和更新 ZIP 的成员已复核。旧 Code 子目录和新 `<Code>.pat` 的实际供应制品仍待从相应分发或正常文件读回确认。 [补丁回退规格](launcher-static.md#f5a-patch-fallback)

固定安装补丁器的参数不足会返回 102。排查真实重试时需同时确认被复制的制品、实际进程身份和传入的命令行，才能定位该次退出的来源。 [已核参数入口](launcher-static.md#installed-patcher-argument-handoff)

两份 Inno 安装脚本已定位向导及链接动作，安装后运行项只声明登录器入口。排查重复启动时按原版再次查询备份属性，核旧备份删除的实际回执。定时器或创建进程失败时也要核备份是否已清理。 [安装动作和备份检查](launcher-static.md#f5a-installation-and-backup-preflight)

## 另一套窗口的实际入口

固定 Item 和 SE 已绑定恢复分支到经典 39 的创建及退役，另一套窗口 1 的局部绘制也已绑定 `Ta>` 标签。两版仍需外层实际调用来确定另一套窗口的活动参数和逐窗次序。经典 39 的实际同帧呈现、音效与当前版适用性继续验收。 [来源和待验边界](game-static.md#legacy-scene-label-window)

Item 的表回调已确认会把首参传给共用函数。新材料应定位外层调用和参数值，才能判定旧训练清理与新窗口初始化、工艺配对及图鉴缓存处理的实际顺序。当前用例覆盖两种训练次序。 [共用规则与用例](game-static.md#alternate-window-selection-and-cleanup)

两版 99 行表尾的已知读取分别归到工具栏横坐标初始化。经典图鉴的普通帧入口已核，另一套窗口 23、24 继续从具名回调注册、实际调用或适用样本核对活动参数及顺序。 [表尾归属及经典帧](game-static.md#legacy-se-classic-album-ingress)

固定 SE 的经典图鉴列表、详情和关窗已有所选静态结果。原版组合运行继续验收刷新与点击次序、关窗回收及下一次列表投影。第二套图鉴和当前同版仍沿 SF-U1 核对入口和活动参数。 [经典规则与运行范围](game-static.md#legacy-classic-album-entry-admission)

普通帧后段的 `56F787` 已绑定文字热区、绘制行选择和提示门槛。D0/D3 复用该输入与排序规则。图鉴工具栏及 99 行表仍需实际回调分派证据。 [帧末实证](game-static.md#legacy-item-frame-hit-selection)

历史 Item 的 55–59、67 已有资料构造到打开请求的正向证据，仍需从普通输入追到构造函数，从帧循环追到表内回调。两份历史样本的图鉴页恢复规则已证，实际显示仍取决于外层分派和缓存状态。后续补证从新注册、调用或匹配样本进入。 [来源与适用范围](game-static.md#legacy-item-window-producers)

两版所选图鉴回包按处理时角色槽写入。固定 Item 还已核换角后的入场缓存顺序。实际同一连接内的迟到回包到达、读回后结果、原缓存短读短写及另一套窗口的帧回调继续验收。 [已证时序与范围](game-static.md#legacy-receive-retirement-order)

固定 Item 的本地发件历史已有调用顺序。发送者服务端结果、附件结算及当前同版适用性仍待核验。迷你正文的长输入和未知家族成员需有对应的原版运行证据。 [收发证据与边界](game-static.md#legacy-item-mail-history)

Item 的窗口过程已绑定鼠标事件位、普通按键生产和激活清理。主状态 9 的子状态 3 在经典帧回调前读按键，返回后主循环清本帧事件。下一条必要证据是另一套窗口表的实际帧消费者及相关业务调用者。 [窗口恢复](game-static.md#legacy-item-window-admission) · [按键状态](game-static.md#legacy-item-keyboard-frame)

Item 输入表第 9 项已绑定图鉴 23 的开关及 Ctrl 和 D 的状态位来源。分派器的普通调用者仍待正向注册、调用或匹配材料。 [来源与扫描边界](game-static.md#legacy-item-album-key-registration)

图鉴工具栏输入位于 `569ADB`，窗口 1 登记的回调是 `569327`。三条物品回包已证能重新置位工具栏准入。普通帧何时调用输入、绘制及窗口回调仍待，找到新的注册、调用或匹配样本后复查该路径。 [工具栏与回包](game-static.md#legacy-item-album-toolbar-and-slot-reset)

同一 Item 的普通 `Q?m` 已绑定经典 37、52、54。两套窗口共用部分资料字段，归属以实际调用和描述符确认。 [普通训练证据](game-static.md#legacy-item-training-ingress)

现有共享训练页发送选择或返回后立即移除。等待时的旧正模式关闭会清掉后续选宠所需进度。OS-D7 处理两份固定旧版的保留窗口及关闭规则。原版实际发送异常、等待时的再输入、另一套窗口及当前同版仍待验。 [已知差异和范围](game-static.md#legacy-pet-training-wait-owner)

普通 `Q?m` 已核两版的目标朝向。现有共享收包只更新窗口相关状态，符合条件时的目标朝向更新归 OS-D2。坐标重合的原版读值依赖当前栈或目标指针，实际读值与后续呈现待验。 [条件与差异](game-static.md#legacy-dialog-actor-facing)

Item 的八个工作窗口已明确共同函数返回 2 后的保留、解除和局部回收规则。外层正常帧何时传非活动状态、回调实际调用次序和当前版适用性仍待。 [工作窗口退役](game-static.md#legacy-item-work-retirement)

主状态 9 的子状态 250 和 252 已定位经典窗口的退役与恢复。现有共享运行时在本地夹具每次合资格更新推进一次场景并清指针事件。固定 Item 的 `9/252` 需要同一轮两遍对象和窗口更新，中间绘制后才到第二遍，外层返回后清理输入。D0/D2/D3 验收该差异。训练、工艺和图鉴的另一套窗口分派及当前版本行为仍待证。 [重建路径](game-static.md#legacy-item-classic-window-reentry) · [两遍更新与本机对照](validation.md#legacy-item-double-window-frame-validation)

窗口 1 恢复标记的七处保存已与 REA 精确引用核对。表行 40、41 的退役函数有明确的清除条件，正常帧的实际调用者及训练、工艺和图鉴的回调分派待证。 [来源与剩余边界](game-static.md#legacy-item-window-one-restore)

两版的战斗入场及所选普通帧恢复顺序已核。继续验收两次调用之间的实际标记写入、普通帧到另一套表回调的分派和当前同版效果。 [顺序与待证范围](game-static.md#battle-window-restore-order)

所选普通帧已确认 End 请求更新另一套窗口的槽位，并核到关闭时的 Escape 恢复。工艺窗口 19、29、30 已有配对打开和分阶段退役规则。后续沿实际调用或注册核对 99 行表如何派发活动和非活动回调。 [普通槽位调用](game-static.md#legacy-item-normal-slot-producers) · [工艺窗口退役](game-static.md#legacy-item-work-window-pair)

## 实际资源对齐与烟雾首帧差异

已核素材的正尺寸图形均为四字节对齐。原非对齐尾部规则留给有对应素材的情况。原创夹具给现有动画入口传入 `-15` 和无符号投影 `65521`，均得到 `LEGACY_ANIMATION_INTEGER` 且状态停在推进前。固定来源会推进对应的烟雾首帧，普通绘制在缓存准备后裁掉该帧。D0/D4 需修正动画几何及绘制的衔接，保留后续帧和完成回调。 [差异复现](../build/analysis/smoke-animation-clip-v1/focused-probe.json)

全量资源载荷约 2.61 GB。现有目录初始化同时持有的数组至少约 199 MB；同尺寸旧、新目录共存时所计数组至少约 323 MB。实际宿主限制及其它同时持有的缓冲区仍待验证。

[资源测量与源规则](../analysis/capability-first-v1/resource-corpus-budget.json)

<a id="launcher-startup-functional-specification"></a>

## 当前登录器补证：嵌套退出hook的安装与所选分支已成规（2026-11-11）

QH沿固定C82 App Init的正向OLE初始化调用补齐EA-F13：45C46F在所证mode/HRESULT条件下把45C570写入44FD1F所得对象+3c；alternate mode可返回1而不走本体setter。45A8A6实际以(1,1)调用，再在正常返回后投递退出消息，不能把所有nonzero初始化结果或quit请求当作资源/登录通道已退役。

所选45C502(1)先执行条件OleFlushClipboard、factory链遍历和先移除再虚槽0调用，然后跳过本地零参filter删除/COM-uninitialize分支。实际module flag、资源成员/间接效果保来源条件；不据所选代码报告必现重绑/死锁或完整Windows关闭接受。普通modal期间形成替换binding的合法producer/投递准入、LS-U3实际消息/销毁和Host drain仍待。

新增7必要完整native/477B，复用App Init与quit两完整体；9窗1679B/531指令核原PE，REA已导出关闭。形成9事实、2推导、5操作、3组开发差异和8项未执行接受案例。停止已答OLE/MFC库存扩张，仅沿原必要正向对象/producer或Host证据继续。

原40/81/37/10/6、owner/依赖/批次/profile及14端口62方法保持；19项固定来源本域规格就绪不变，L03/L06/L08及统一A1..A4不提升。产品仍stage306，本轮无产品修改、目标测试/构建、VM/SDK/网络/账号操作。原GP补丁五组与UH三端发布/恢复方案直接复用，先全部能力成规再按D0–D6开发。

原EA-F13把可选quit callback本体/普通安装留作未决；QH用App Init正向调用闭合所选setter与consumer。最小纠正是记录准确(1,1)、清理前缀与局部零参区别；不要改成(1,0)、假设callback无副作用或将其当登录通道排空。实际资源/普通重绑序列仍按原必要条件验证。

[quit hook合同](../analysis/capability-first-v1/launcher-quit-hook-contract.json) · [源核验](../build/analysis/launcher-quit-hook-v1/source-review.json) · [本轮核验](../build/analysis/launcher-quit-hook-v1/validation.json) · [原补丁规格](../analysis/capability-first-v1/launcher-game-patch-functional-specification.json)

<a id="launcher-exit-admission"></a>

## 退出路径与复用索引的本轮修正（2026-11-10）

已复现检索缺口：只查launcher前缀和retained_view会漏掉较早跨域dispatch的完整函数以及retained_dossier格式。最小修正为同时覆盖源检查两格式，再查精确地址文件并验固定hash；431620/45c22f两次重复逐字相同，不算新增覆盖。App一个3B常量槽不当作初始化写者，63c820空direct-xrefs不否定431000间接App+20写入。

生命周期误读也已拆开：AAChannel槽+4通知不是槽0删除；busy在错误提示前已清；quit helper可先执行对象callback。About/Exit源体问题已答，LS-U3普通重绑准入、必要callback与真实消息/销毁接受仍待，停止无具名要求的框架helper扩展。本轮无VM/电脑操作，不新增重复VM排障库。

[退出准入合同](../analysis/capability-first-v1/launcher-exit-admission-contract.json) · [源核验](../build/analysis/launcher-exit-admission-v1/source-review.json) · [既有端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-exit-admission-v1/validation.json)

<a id="launcher-callback-reentry"></a>

## LS-U3剩余入口与层次误判（2026-11-10）

可重复分析误判已拆开：8241不是托盘；热键/左键显示与右键E140/E141不同；borrow不持operation gate；engine counter不冻结全部Main消息；MessageBoxA不等同另一MFC DoModal；条件registry效果不是普通序列实测。最小修正是绑定真实producer、game/step与各自guard，禁止任意消息注入补准入证据。

仍待：原生modal内合法新binding的普通producer/投递条件、About/exit销毁及实际timer/DNS顺序。四个distinct-session目标例不能关闭LS-U3；没有原程序故障证明，也不声明全交错安全。private probe初次路径错误与LLVM LOCK前缀显示差异均已修复并保留执行说明；本轮未操作VM/电脑控制，不新增重复VM排障库。

[回调入口合同](../analysis/capability-first-v1/launcher-callback-reentry-contract.json) · [源核验](../build/analysis/launcher-callback-reentry-v1/source-review.json) · [端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-callback-reentry-v1/validation.json)

<a id="launcher-legacy-failure"></a>

## typed retry与initial0清理的常见误读（2026-11-10）

不要把41195e当catch-all，也不要按411bb9的伪代码自调用实现递归：原表指匹配Exp/state11，catch返回411bc0，69B共享tail用JNZ回parent41171b。原first/previous/current的Stack命名与EBP偏移不同，应沿实际槽核对。

源initial0最后失败跳过catch即时清理，414e90也不补杀login timer或Close；这不等于已测崩溃/挂起，后续timer未实测。Close的registry缺失可先抛Exp，数字send/非正容量也不自动触发typed retry。129目标例记录10清理差异，LS-U1规则已由LE覆盖；LS-U3及实际平台/同版接受仍待，无本轮VM/电脑控制操作。

[旧版失败合同](../analysis/capability-first-v1/launcher-legacy-failure-contract.json) · [源核验](../build/analysis/launcher-legacy-failure-v1/source-review.json) · [纯目标对照](../build/analysis/launcher-legacy-failure-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-legacy-failure-v1/validation.json)

<a id="launcher-derived-material"></a>

## 短材料结论修正与剩余条件（2026-11-10）

早期current batch反编译显示void且缺return，容易把peer区间允许误写成短材料被接受。正确最小核对是590f41不足分支、590fe1=-5、591042返回及state2/getter准入；现有current HANDSHAKE_SHORT_KEY无需按旧版补零。旧版全零初态则来自47a290池payload初始化和475100完成清理，不来自单个buffer首字节置0。

LS-U2所选普通规则已由DM覆盖；现有旧版generic仍拒绝7个源可产生的短材料样例，待原D1统一复刻。旧版归还pool早于全清零，中断/并发reuse不自动具备该初态；LS-U1必要异常/重试和LS-U3具名callback序列继续保留。未运行原程序/SDK/账号联网，不新增配置或审批变更。

[材料合同](../analysis/capability-first-v1/launcher-derived-material-contract.json) · [来源核验](../build/analysis/launcher-derived-material-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-derived-material-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-derived-material-v1/validation.json)

<a id="launcher-session-functional-specification"></a>

## 登录交换剩余来源与可复现恢复方式（2026-11-10）

旧REA所记/private/tmp/moli-analysis/polcn/POLCN_Launcher.unpacked.exe现已不存在；项目old-source副本实际c7ba，不能当601b使用。最小恢复已执行：对用户moli/POLCN_Setup.exe用innoextract1.9仅选app/POLCN_Launcher.exe，再用UPX5.2.1普通离线解压到本轮build私有目录；完整SHA-256等于601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31。原件未改、安装器/登录器未执行，解包EXE不进入公共成果。

仍开放LS-U1旧版必要异常/续体，LS-U2短派生hex的方向缓冲构造/重用，LS-U3具名正常callback/modal替换尾部。现有flow总deadline与c82f两阶段规则不同，归LS-D2待统一门槛后实现；不以882局部检查、普通Stop或解码成功证明完整接受。微信设置授权仍待原请求，SDK未运行；本轮无VM/电脑控制操作。

[双来源操作规格](../analysis/capability-first-v1/launcher-session-functional-specification.json) · [来源核验](../build/analysis/launcher-session-functional-specification-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-session-functional-specification-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-session-functional-specification-v1/validation.json)

<a id="wechat-sdk-host-probe-preparation"></a>

## WH首次工具授权门槛已具名（2026-11-10）

原准备档案保留当时的服务任务证据。本机图形界面后续已运行基础库 3.18.0。 [原准备档案](../analysis/capability-first-v1/wechat-host-profile.json) · [本机模拟器实测](architecture-and-milestones.md#wechat-devtools-offline-sdk)

状态检查的auth pending不是SDK/登录已就绪；两次同任务查询失败也不证明任务已失败/退出。服务端口/客户端授权变化已提出具体确认，未点击允许或改配置。准确UI、CLI回执、最小后续和禁忌已补入下方既有[操作排障节](#wechat-sdk-first-auth)，没有另建排障知识库。

<a id="game-battle-functional-specification"></a>

## BF必要来源前沿与已证开发差异（2026-11-10）

B02/B03仍需 native foreign、第四暂存字、指针和角色别名的实际来源。105 已核映像初值、动作 97/98 及所选清表和子状态 7/9 顺序。其它间接写入、所需观察窗和完整运行组合按实际来源继续核对。 [已证游标范围](game-static.md#battle-105-cursor-lifecycle)

固定 SE 的所选短前缀清零帧提供三个零值。当前共享入口对所选无护卫的仅自身 RID 返回缺上下文。已核跳过清理的条件及长前缀的字节覆盖边界。其它帧调用、前序对象写入、长前缀分派、原版实读及当前同版继续核验。 [条件与差异](game-static.md#battle-266-adjacent-frame)

B01/B04原范围已成规，当前observer先抛、冻结entryWindow、缺transform、特殊技能早抛，以及12/267/共享seed/overlay等差异归BF-D1..12；真实native生命周期/像素、44完整案例、原依赖和三端/同版接受仍待。原先仅局部profile的ordinaryReturn unimplemented不覆盖后续实际return实现。

stage306 在模式 3/4 的语义返回会清技能和目标，两种模式均拒绝 escape。固定 SE 已核条目 8 的技能窗开关、模式 4 条目 9 的逃离请求和条目 12 的后置文字复制。差异沿 BF-D1 接入。负序号文字运行值、真实窗体先后及同版回执继续验收。 [现有状态与来源对照](validation.md#fixed-se-battle-window-target-selection-validation)

本轮处理了旧派生entry/ranges/bytes与新schema差异；数据地址另列，normalized cache仅定位完整原记录；BV父facts与12/267 id-selector按实际格式验证。初始误查不存在fixture后直接使用已存在原创JSON向量和pure API，无厂商执行。[执行记录](../build/analysis/battle-functional-specification-v1/execution-record.json)保留检查停止及修正，旧VM知识库节完整保持。

<a id="game-work-functional-specification"></a>

## WK条件前沿、源/实现差异与检查修正（2026-11-10）

G18仍含两套窗口；另一套实际callback分派/活动选择、注册或模块与必要入口关联未证，整项不提升。只接受具名正向证据，不重做已闭等级byte写者、C5BD18 word候选或97项零扫描。三表描述符/16表行只能证明绑定，不能证明活动路径。

经典技能窗现有本机开关与原固定 SE 的活动槽和分模式退役有差异。所选模式 0 跳过外层解除，现有工作所有者关闭时会按启用的上下文立即解除。已列入 WK-T23，原版及三端组合待验收。 [源规则与本地对照](game-static.md#legacy-se-classic-work-entry)

当前recipe reset保留ctx1而4FF030写0；制造/采集移动与due同帧先退役、共享byte初始0和计数ledger未整合属于真实开发差异。暂停后晚到展示且不重启、装饰不耗CRT等现有正确行为保持。30完整案例、依赖及真实三端/同版接受均未完成。

来源预检首次在旧派生地址表示00476170/0x476170比较停下，按同一数值归一后继续；第二次发现案例映射漏菜单打开与制造重试，补齐相应输入/预期后核验。原来源未改，两次停止及修正在[执行记录](../build/analysis/work-functional-specification-v1/execution-record.json)保留。旧VM排障节不变，本轮没有VM操作或新增VM问题。

<a id="game-social-family-album-functional-specification"></a>

## SF具名条件与源/实现差异（2026-11-10）

G19原需求包括两套列表；另一套实际激活、page初始/恢复与必要异常域仍缺证，整域未就绪。仅在初始化21及页0..20条件下，该15行路径选择0..314；不能自行补22页或断言所有实际路径均不可达末五条。未准入家族516844等保留正向发现条件，不扩大候选helper扫描。

源家族增量/确认/角色bank与独立清表、原子/revision/pending政策仍有差异。新确认路径表明迷你插入十条历史而清理辅助走20次字段写；列实际地址与默认字串输入，不擅改计数、补零或声称运行崩溃。SF-D1..9、原依赖、30完整案例与真实三端/同版接受未完成。

本轮将九个内部读窗归回父体；4A2080新种子被拒重叠后复用4A1FA0。六次native元数据缺失与25静态派生分开。纯探针初始对空名称的预期错误，实际正确拒绝已保留；长UTF8声明格式及未选择的旧helper引用已在发布前修正。[执行记录](../build/analysis/social-family-album-functional-specification-v1/execution-record.json)记录完整尝试；旧VM排障节保持，本轮无VM或网络操作。

<a id="game-ordinary-services-functional-specification"></a>

## OS具名未决、元数据缺失与派生权威（2026-11-10）

G12经典十mode虽已成规，另一套55..59/67真实入口/分派、selector/资料生产及原需求关联仍缺证，整域未就绪；只在有必要正向证据时重开，不假定活动或全局无用。OC-U7/U8仍为未运行的条件时序推断；OS-D1..10、原依赖、31完整接受及真实平台/当前同版/官方接受未完成。

本轮初始收集未跟随helpers/source-views声明，现按完整原记录及哈希绑定，不能把元数据漏检称作缺函数。三次REA“No procedure exists”与原字节存在同时记录；十个手工种子派生视图经PE/LLVM核对，仍不是原生Evidence。回调登记先核47F5F0工厂及47C880父调用，再进行所需派生；不得猜直接嵌入关系或改原分析元数据。可变输入已冻结为等字节before快照，避免新增索引层污染自身来源哈希。

现有正确bag-only、外观循环、菜单映射保留；学习严格拒绝、交易发布时间戳/阶段2主按钮差异单列。完整尝试与修正见[执行记录](../build/analysis/ordinary-services-functional-specification-v1/execution-record.json)。旧VM排障节保持，本批没有VM、原程序或网络动作。

<a id="game-presentation-functional-specification"></a>

## PR具名未决与证据形态核验（2026-11-10）

固定 SE 已核所选启动、设备选路、呈现和重建准入。需继续查 `6122E8` 的实际写入者和设备返回值。第 0 层 `GetTexture` 成功却输出空时，`446483` 会解引用空输出。实际设备能否到达此分支、16/24 位设备输出及非对齐暂存尾部沿原条件验收。 [来源与范围](game-static.md#legacy-render-recovery-probe)

G06仍缺必要非4倍scratch尾部生产/别名/复用及所需后端/版本上下文。已知冷/热地址不能补成零尾；当前渲染拒绝非4倍宽度，不代表原格式禁止。G07固定本域规则成规，但宿主字形/IME/完整焦点、原G05/G06依赖和真实平台接受未完成。[PR-U1..4](../analysis/capability-first-v1/game-presentation-functional-specification.json)区分源条件、共享实现、外部接受和其它需求。

本轮私有证据收集遇到record_pointer/pointer及可选Evidence ID形态差异，现以完整原记录哈希必检、已声明ID附检；6个kind=derived视图单列。不能按receiver文件名猜函数：保留配置体实际为4F44A0，4F4950仍是另一个34B派生视图。修正发生在发布前，未改产品代码。执行细节见[记录](../build/analysis/game-presentation-functional-specification-v1/execution-record.json)。旧VM排障节保持，本轮无VM操作。

<a id="game-actor-functional-specification"></a>

## 角色对象的已知实现差异与分析停止条件（2026-11-10）

[GA差异](../analysis/capability-first-v1/game-actor-functional-specification.json)确认C0可变尾部/影子快照未实现、协同消费者仍coordinated-unmodeled；本地30源码restart0而现实现true，本地纠正、共享p2/p3/条件图标与完整退役需按原批次补。已有解码/插值/60/70/80/文本不整体重写。25项完整接受未执行，不把72纯样例成功标成真实平台或官方兼容。

本轮可重复工具问题：java_home未登记21时使用已有Homebrew21.0.13任务级JAVA_HOME；无需重装/改全局配置。完整Evidence选择先过滤operation和字典形态；不同profile同地址不可混用；Ghidra的FFFFFFFF与有符号-1表示需按真实指令核对。地址映射记录不带字节长度，按PE映射单独核验，不能误当字节读失败。详见[执行记录](../build/analysis/game-actor-functional-specification-v1/execution-record.json)。这些是私有分析/核验脚本修正，产品未变。

原VM排障节保持，本轮没有VM操作。对象辅助链到此停止；只有会改变必要操作的具名正向缺口再取证。其余能力、同版材料、账号及真实接受独立保留，统一门槛仍未通过。

<a id="game-flow-functional-specification"></a>

## G03完整流程规格已有，目标组合差异仍待开发（2026-11-10）

[GF](../analysis/capability-first-v1/game-flow-functional-specification.json)已关闭原主流程本域的泛化“其它主/子状态”来源盘点：实际主1、原各内容分支、22个main9 case与三类返回各有操作。G03本域source-ready不关闭G02升级来源/G01/X02依赖或当前同版/真实三端/官方接受。

**未实现**：完整CT入场reset、全部主9所有者组合、物理IO/资源drain与持久回执、平台效果决定，按GF-D1..6统一门槛后开发。现有角色模块仍报告fullNativeReset=unmodeled；源无关联ID，内部epoch不证明同连接旧回包可区分。桌面专属效果仅记录静态条件，本轮未运行任何源程序、Windows API或诊断命令。

**本轮工具问题**：旧canonical声明有裁剪记录，改选完整原导出后核验；初始化旧bundle同入口有多份观察，按原source-check Evidence ID选定。两者不是产品故障，禁止用裁剪视图冒充新完整记录或因索引未命中重复查询。来源与尝试记录留在build/analysis/game-flow-functional-specification-v1/。

<a id="game-communication-functional-specification"></a>

## G01已成规；空闲时钟与完整泵仍有实现差异（2026-11-10）

**事实**：[CF](../analysis/capability-first-v1/game-communication-functional-specification.json)闭合原六组通信源规则。旧“摘要算法未恢复”由后续生产源覆盖，两个错误分类/五个版本预检已补；不再为这些旧remaining重开REA。源idle为unsigned now>uint32(last+30000)，host为elapsed>=30001，静态 owning seam和纯算术在两个环绕情境不同，未修产品。

**待开发**：CF-D1..5按原D0/D2/D5批次组合版本/连接/pump/队列/租约。recv0、部分send、keyready0控制请求和初始bootstrap等待不是同一种策略；初始化/坏帧等严格独立政策不能标原版运行一致。现有材料保留/二进制优先/字节语法已验证的部分直接复用。

本轮私有夹具修正了API结果名、当前目录66而非65、runtime与分析元数据字段、GC标签宽度等核验假设，均未改产品源码，失败记录保留。G01本域ready不提升依赖、其它能力、当前同版/三端/官方接受；原VM排障和授权记录不变。

<a id="launcher-config-path"></a>

## 已解决：LF-U2路径谓词不能按名字或普通前缀推断（2026-11-10）

**事实**：[LP](../analysis/capability-first-v1/launcher-config-path-contract.json)现已补齐严格后代、最终路径、缺API属性扫描、已有祖先/缺失后缀与布尔返回链，关闭旧LF-U2。434100/4366A0的void伪代码是丢失返回值的投影；原记录保留，独立ABI视图引用原指令。不因此修改分析工具或全局规则。

**待实现/验证**：LP-D1..3并入原LF差异；现有drive-only路径和数据快照各有独立范围，不能拿文件存在或字符串startsWith替代源两层关系。5个纯模块情境仅说明这些合同区别，没有证明现有产品流程已调用错误模块。停止同路径族重复逆向；原多来源/当前游戏消费者/实际三端接受继续保留。没有VM/电脑控制操作，原排障知识库与授权状态不变。

<a id="launcher-functional-specification"></a>

## 当前Config不能复用legacy等待或patch提醒阈值（2026-11-10）

**事实**：[LF证据与对照](../analysis/capability-first-v1/launcher-functional-specification.json)确认C82为250ms异步poll/15min仅提醒，601b为同步无限wait，已有current patch为30min。当前两个纯模块本身保留其来源行为；不能按名字接入C82 Config。这里是待对应批次的策略差异，未证明现有产品页面已经调用了错误模块。

**待实现**：统一A1..A4后按LF-D1..4显式分策略，并保留捕获section/key、key-only缓存、先cache后写入及失败不撤回、三特殊退出和低字节恢复。CChildView销毁关观察handle不代表终止Config；catalog5000ms等待另属job。原伪代码4329B0的void/两参不可作接口依据，原字节已纠正为三参/布尔；434610/4349B0内部仍未闭合。

原L01–L08多来源整体和L07当前同版消费者仍未ready；MP已闭合LO-U1，不重查。条件入口无正向准入不扩大，不把任意callback交错列为无限缺口。没有虚拟机/电脑控制/官方网络动作，原VM排障知识库与授权状态不改。

<a id="map-functional-specification"></a>

## 位置纠正存在已定位的顺序差异（2026-11-10）

MF-D1：当前protocol.next以接收新点取grid，而原39字节receiver先45F1C0取旧全局点窗口。100×100/mode1、旧30/30→新80/80的纯helper对照中，显示格是旧/新两种结果，target/scaled相同；完整源运行/协议dispatch尚未验证。

暂未修改产品；全需求门槛后在D2修复并做受影响回归。不要从单个turn helper无tick参数判缺限流：当前调用层已有BFF354对应的500ms，键盘BFF358独立。header描述错误已在新合同修正；全局context/持久预算/设备和G02/G20缺口继续保留。本轮无VM/官方网络/账号操作。

[地图操作规格](../analysis/capability-first-v1/game-map-functional-specification.json) · [来源核验](../build/analysis/map-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/map-functional-specification-v1/validation.json)

<a id="audio-functional-specification"></a>

## 音频整合剩余条件与G02候选停止点（2026-11-10）

G08来源规格已合表，8组产品差异、X02/X03上下文/容量、实际GM、FPU特殊域、16字节loader、三端可闻输出/后台/取消/drain仍未验收。源worker首填失败也可能ready、双区跨end异常及原无界停止等待均有事实规则；独立host必须显式报告失败/timeout，不能据source标志当成功。

CH-U1材料仍未知：4567A0四个固定字符串复制最长142字节，目的923B3C至目标923C40相差260，不能成为该材料生产证据。停止重复此候选/精确字面扫描；只接受新的同源正向写入/别名/注册边。知识库查询缺mandatory requirement-index，当前仓库需求索引/计划是真源，未修改全局库。本轮无VM/账号/网络/设备操作。

[音频操作规格](../analysis/capability-first-v1/game-audio-functional-specification.json) · [来源核验](../build/analysis/audio-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/audio-functional-specification-v1/validation.json)

<a id="browser-surface-observations"></a>

## 避免把系统API默认行为当作源格式（2026-11-10）

浏览器windows-936 label报RangeError，ascii实际windows-1252，TextEncoder仍UTF-8；gbk接受四字节，BOM/替代错误/stream状态需要显式处理。未声明FontFace的虚构测试family的check为true而load返回0；requested font字符串不证明Canvas实际face。

保留两个实验失败：命令行诊断缺enable-automation而不可用（未改flags），随后“浏览器WAV样本等于当前PCM换算”的假设被数据否定。新增并精确验的是现有手动buffer路径；不抹去decoder差异。原生字形/可闻输出/设备/容量/异常恢复继续未验。

[实测档案](../analysis/capability-first-v1/browser-surface-profile.json) · [来源与约束](../build/analysis/browser-surface-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-surface-conformance-v1/validation.json)

<a id="browser-host-observations"></a>

## 命令接受、事件信任和源失效的实际区别（2026-11-10）

已测源变动使旧File读NotReadableError但其元数据不变；不根据同size/lastModified宣称稳定内容。两次CDP compositionend为isTrusted=false，focus转B后insertText进入B；模拟链不能代替真实OS IME或产品owner/epoch验收。

CDP frozen命令成功后本窗50帧最大间隔18.3ms，未出现所请求350ms停顿；不能当后台冻结/恢复证据。persisted=false和quota估计/strict hint也不证明防驱逐或断电可靠性。AH-U1..U6分别保留预算、其余宿主字段、异常恢复、真实设备、源和产品条件。

[宿主档案](../analysis/capability-first-v1/browser-host-profile.json) · [本轮约束](../build/analysis/browser-host-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-host-conformance-v1/validation.json)

<a id="required-entry-admission"></a>

## 避免从盘点计数制造开发任务（2026-11-10）

新台账显式区分406个登记但业务应用未定、30个仅source-anchor导航和其他选定规则角色。406不是“未反编译数”，436无primary不是“缺失能力数”；selected图无直接CALL不证明不可达。不得由这些计数自动递归追全别名或创建逐函数开发阶段。

A1 的经典商店 kind 9 已核一条普通业务登记。其他必要登记、另一套窗口的实际激活、三个模板用途及四个命令的焦点或视图路径，继续沿具名证据核对。UC-U1/U3、G02 的 `923C40`、G20 最终关联及当前同版消费者仍待证。 [已核报价入口](game-static.md#legacy-shop-quote-drag)

报价撤选的正常入口依赖窗口 53 和有效映射。若活动槽已替换，所查 phase 2 或 4 借用新槽。空槽、抑制为零且映射有效时，在前置选择写入后可静态推至控件读取。继续取证需要实际投递交错、`C5E9C8` 非零写入或适用版本材料。三端输入与退役沿 OS-A21 验收，原版战斗暂存字实读沿 BF-T36 验收。 [条件和本机回执](game-static.md#fixed-se-shop-retirement-refresh)

固定 SE 的 37 个历史待定收包根已有 35 个业务归属补充。两版的 `Kh>` 都已核低 16 位写入和初始化归零，继续等实际读者。两版的 `Ok?` 都按完整首项决定通用失败提示，继续等具名请求与对应回复。`W(y` 的两版存储邻接与通信退役已核到指令，实际业务文本长度、外层清理及同进程重连仍需补证。 [收包继续条件](game-static.md#legacy-unassigned-receive-outcomes) · [地址提示证据](game-static.md#legacy-address-notice-retention)

固定 SE 的 17 个历史待定发送根已有业务归属。`4E080E` 和 `4E8726` 的直接调用由文件字节复核，第二套界面实际调度及同版回复仍待证。`/1I` 及其它多入口格式的完整输入和退役条件沿各自用例。 [发送继续条件](game-static.md#fixed-se-send-operation-admission)

所选经典帧的滚动和说明写入已有原版指令依据。原版实际控制器输入、连续两帧的可见行和来源值、实际关窗重叠及当前同版适用性继续随对应业务用例验收。 [帧先后与范围](game-static.md#fixed-se-classic-post-control-frames)

所选 41 个经典构造及控件前回调的登记与源体已核。窗 47、65、66 已获实际业务归属。嵌套开窗、活动指针发布、原版 Ctrl 确认和日志句柄交接继续按真实帧及运行回执验收。 [构造时点](game-static.md#fixed-se-classic-pre-control-callbacks) · [三窗继续条件](game-static.md#fixed-se-classic-modal-blacklist-log)

所选经典析构已核对位置、偏好、工作与业务回调的关闭顺序。实际同步分组关闭中若回调另标记子窗，重开结果随实际池整理和对应业务用例验收。家族兽回复及第二套窗口的适用范围沿原证据核对。 [关闭与继续条件](game-static.md#fixed-se-classic-destructor-callbacks)

经典工作登记已归到具体操作。共享工具栏和滑块的其他位置沿各自能力复核。战斗略过的运行回调交接、刻印提示实际输入及另一套工作窗口的普通帧调度，分别沿已存回调、原版事件和 WK-U1 的具名调用继续。 [工作控件与待验条件](game-static.md#fixed-se-classic-work-controls)

窗 21 的列表范围、条目资格和后继窗口已接到各自原操作。保存布局与同时到达资料、群发与已有编辑窗交错、正式投递结果继续按各自用例验收。 [名单条件和用例](game-static.md#fixed-se-classic-contact-list-controls)

家族详情已取得编辑权限关停和撤族退役的静态入口。原版权限变化和同轮控件动作的交错、撤族后晚到资料及目标端草稿恢复继续沿 SF-A16、SF-A20。 [规则和待验结果](game-static.md#fixed-se-classic-family-edit-controls)

家族兽的旧槽占用和饲料箱的共享数量窗标签已有原指令。合成客户端用例覆盖提交和关闭，原版槽占用、当前焦点与同帧退役继续沿 SF-A22、SF-A23。 [关闭条件和验收](game-static.md#fixed-se-classic-family-pet-feed-controls)

银行的页签回调和交易两侧的阶段已有原指令。原版在当前报价变化时确认、复用数量窗时收到刷新，以及实际结算回执，继续沿 OS-A27、OS-A28、SW-AC7、SW-AC8、SW-AC12 验收。 [待验结果](game-static.md#fixed-se-classic-bank-trade-controls)

经典群发的短名单已核控件阶段写偏移、绘制前重算的顺序。原版当前参与的行、同帧输入和返回列表的实际选择继续沿 MAIL-CASE-47。发送者最终投递、拒绝及附件结算继续沿 MM-R1。 [邮件控件与待验条件](game-static.md#fixed-se-classic-mail-compose-controls)

[入口台账](../analysis/capability-first-v1/entry-admission.json) · [来源与规格](../build/analysis/required-entry-admission-v1/specification.json) · [本轮核验](../build/analysis/required-entry-admission-v1/validation.json)

<a id="required-context-contract"></a>

## 剩余问题按源、开发与宿主拆开（2026-11-10）

UC-U1保留必需native RID/foreign/第四scratch、105cursor观察窗和相关pointer/角色/RNG origin；UC-U2为必要入口准入；UC-U3为G02材料923C40、现行consumer/正常交接与G20最终结果。已知12/267、435000、29/32/0x62、4E1CF0及LO/MP辅助不再反复当缺体查。

UC-U4是budget/offset/并发/encoding/字体声音/后台等真实host profile参数与一致性，U5是已证差异开发，U6是设备/同版官方接受。[W3C IndexedDB3.0工作草案](https://www.w3.org/TR/2026/WD-IndexedDB-3-20261030/)区分request success和transaction complete；设计采用权威提交回执，实际durability仍另验。微信官方read/Page lifecycle两页本轮返回不可重试读取错误，未取得正文，未绕取或据类型声明承诺100M/大ZIP/quota/终止行为。

只做项目规格/原条款核对与官方文档读取；无VM/账号/设备/游戏网络操作，未修改全局规则/工具审批。整体目标未完成，A2台账审定不替代全局门槛。

[共同接口合同](../analysis/capability-first-v1/shared-target-contract.json) · [47行范围复核](../build/analysis/required-context-contract-v1/reconciliation.json) · [本轮核验](../build/analysis/required-context-contract-v1/validation.json)

<a id="mail-operation-composition"></a>

## 邮件已知交点停止重复取证（2026-11-10）

固定 SE 所选邮件重开已核草稿键、附件释放、父子窗口恢复标记的消费点。实际窗口交错沿 MAIL-CASE-41 至 MAIL-CASE-44，其他必要入口沿具名状态写入复核。第二套窗口调度及同版真实投递和附件结算继续沿 MM-R1/MM-R2。 [当前覆盖](game-static.md#fixed-se-classic-mail-reopen)

固定 SE 所选全量、逐槽和交换路径及三套附件表单已核。其余影响同一选择的别名和另一套外层调度，沿具名生产者或实际窗口入口补证。邮件本地请求与实际投递及附件结算仍依 MM-R1 验收。 [已核范围与剩余条件](game-static.md#legacy-se-mail-attachment-refresh)

全量背包的首 token 在两份所选历史消费者内跳过。其发送侧用途保留待证。现有共享入场对预置物品还缺原版重置，原件的两位等待已核，三端全量发布和当前版继续验收。 [重置与本地差异](game-static.md#legacy-full-inventory-publication)

现有制造编辑会在逐槽和换位后按旧槽校验，计时中也继续用旧槽提交。固定 SE 的所选路径沿窗口帧重查，活动制造的背包换位还会迁移用料引用。D0/D3 需补接顺序与占用，装饰和当前同版继续按原取证范围。 [材料差异和用例](game-static.md#legacy-se-craft-inventory-selection)

现有交易确认会因已发布选择的持有修订改变而被拒绝。固定 SE 的所选确认入口按控件参与、阶段和时钟判断，报价面板自行读取物品和释放资格失效项。D0/D3 需处理真实顺序、位置信息与占用。同版对端确认和实际结算继续待验。 [规则与本机对照](game-static.md#legacy-se-trade-inventory-confirmation)

stage306 的交易在未选宠物的资料变化后也会清除已选草稿，并标记已发报价失效。持有金币低于报价时会拒绝确认和再次发布。固定 SE 经典窗按活体、位置、已存金额及相位分别处理，差异沿 OS-D8 实现。 [取证与验收](validation.md#legacy-se-trade-pet-gold-validation)

固定 SE 第二套交易窗在内部核到了金额与发布回调。两次默认 REA 查询缺函数边界，在临时工程从已证调用位置补出回调并逐条匹配原片。当前独立静态查找覆盖 99 处解码的直接打开调用，84 处的紧邻立即数中没有 52。普通调度可能经中间参数或间接分派，仍需正向证据。三端实际输入、关闭和结算按原用例验收。 [剩余条件与来源](game-static.md#legacy-se-alternate-trade-gold)

新核的相邻窗 51 点击仍走经典 43。第二套窗的普通打开继续沿具名入口。现有微信投影在已发布时拒绝物品或宠物改选，活动交易也拒绝普通物品移动。固定 SE 的所选内部回调能先撤回并接续取放，数量框活动期跨窗口与真实设备输入沿原用例验证。 [差异与核验](validation.md#legacy-se-alternate-trade-selection-validation)

六个共用物品reset写者不是六个邮件选择清零；经典C44DDC是目标上下文，C44DE4才是物品槽。槽清理通知发生不证明选中附件已重检；所选现代提交也没有经典状态3复查。Ghidra引用分类可与原E9 opcode不一致，应保留两种证据并以原指令解释控制流，不改工具元数据。

原CA-N3/MR-PENDING-02的所选直接/区域交点已由MM规格承接；不为“所有别名/全部晚到”无限扩辅助。真正未闭合的是MM-R1发送者最终结果与附件结算同版关联，当前无测试账号不反复索取，不把本地提示/保存/回调1命名为成功。其它必要共享/变体合同继续推进，目标未标完成。

本轮无VM/设备/账号/网络运行，未修改全局规则或审批配置。未知另一套实际激活仍需要相关正向来源，不因窗口表有行或旧false标签自动扩大功能/查询。

[邮件操作规格](../build/analysis/mail-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/mail-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/mail-operation-composition-v1/validation.json)

<a id="chat-operation-composition"></a>

## G15不再重复分析已成规辅助链（2026-11-10）

精确xref会漏批量写：F536BC的登记标量写不足以代表其全部生产者，4FF080大范围清零另有来源；F5F170的字段宽度必须按指令WORD纠正。装载填零、初始化、首个实际发送与后续角色返回不能互相替代，发送节流与接收抑制也不共享同一个reset。

G15原范围现在已成36项操作，停止对已知formatter/decoder/CRT与渲染读者重复补证。8组实现差异属有限共同合同，G05/G07和三端文件/声音/输入/后台/联机验收另列；534354用户发布、247byte未激活片段及未知别名保留相关正向发现条件，不能据此永久冻结局部规格。

本轮仅静态材料/源码与REA查询，无VM/账号/网络运行操作，既有授权未重复索取或消费。现行对应消费者/交接来源仍是其它能力的真实缺口，不能用legacy37c4拼接证明当前接受。

[操作规格](../build/analysis/chat-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/chat-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/chat-operation-composition-v1/validation.json)

<a id="game-application-exit"></a>

## 退出和气泡来源的有效待办（2026-11-10）

“未定义procedure”不等于没有代码：51E0F0/51B7FE/52B24C有实际指针/调用边，工具失败结果原样分列，按原文件独立指令核规则；没有重复查询或修改工具/审批配置。固定表的最后回调实际恢复异常过滤器，IAT核对避免凭邻近代码推成堆销毁。

正常返回/CRT刷新和程序日志槽已有规则，停止同链补证；刷新、close和清槽都不证明落盘成功。534354只有默认/绘制来源，实际发布保留正向发现条件；247byte片段仍不注册UI。G15尚需已知发送/接收/上下文与时钟政策合成，物理收尾和真实设备/同版接受另列。

[退出规格](../build/analysis/game-application-exit-v1/specification.json) · [原件与来源](../build/analysis/game-application-exit-v1/source-views.json) · [本轮核验](../build/analysis/game-application-exit-v1/validation.json)

<a id="character-operation-composition"></a>

## 角色旧未决的有效边界（2026-11-10）

已有专门character-options规格、纯变换和升级界面，旧“look/auxiliary全部未实现”不能继续作为新REA依据。459920已在family-members来源找到完整记录，不因角色阶段无单独文件就补反编译。预览分支要先按控制流筛可行组合，不能把未可达空表推为运行错误。

当前G02必要源问题为CH-U1类别7材料生产/所有者；一处精确923C40字面读不证明全局无写者。家族负责人删除警告与固定等待0已证，后续工作删除仍未证。menuArmed、upgradePending、非法逆表输入拒绝及晚到promise处理属于独立宿主政策，source无请求ID/原生升级期限不因这些门槛改变。

[操作规格](../build/analysis/character-operation-composition-v1/specification.json) · [已有源视图](../build/analysis/character-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/character-operation-composition-v1/validation.json)

<a id="capability-specification-audit"></a>

## 当前剩余问题的处理规则（2026-11-10）

旧false、旧pending和单一索引漏项均不能证明缺原函数。4E1CF0已有完整记录且六项重置已核；4CCC20是既有内部片段；已证补丁来源/数量/占用及选定战斗边不再重复扩张。未知业务名不新增ACK/关联ID，未激活另一套窗口及247byte片段需新正向边。

实际必要未决：逐原范围操作/状态合成、534354配置发布/必要退出、入口需求准入、原战斗上下文与目标宿主合同，以及对应现行游戏消费者。G02删除等待为固定来源限制；G17功能规格就绪不代表依赖或真实权限/结算接受。本轮没有VM、联网、账号或设备操作。

[当前逐能力审定](../build/analysis/capability-specification-audit-v1/specification.json) · [来源补充](../build/analysis/capability-specification-audit-v1/supplemental-source-views.json) · [本轮核验](../build/analysis/capability-specification-audit-v1/validation.json)

<a id="capability-first-known-issues"></a>

## 当前流程问题：能力发现与规格尚未统一关闭

固定 SE 的两条工作解除路径已核对回包和局部效果。所选经典 `9/3`、`10/5` 先检查再扣时，stage306 在扣时当轮生成解除。另一套背包外层调度仍需实际调用边及活动参数。两处都参与时，优先顺序会改变占用、配方与预览的结果，沿原 WK-U1 和 WK-T23 收证。 [固定样本和本机对照](game-static.md#fixed-se-work-context-publication)

stage306 制造开始后收到槽 8 与装备槽 7 的交换，活体已换，提交仍带旧槽号 8。解除前后各复现一次。D0/D3 需要先沿原位释放制造引用，再提交共享占用及到期文本。第二套正常调度继续沿 WK-U1 取证。 [原版规则及本机回执](game-static.md#fixed-se-work-slot-seven)

**2026-11-11流程纠偏**：防止旧remaining/旧“下一步”触发重复取证，以及把未开发产品的完整设备/官方接受设为开工条件。以[当前流程](development-plan.md#capability-first-workflow)和能力矩阵为准；必要同版规则缺证仍阻塞对应分析门槛。当前同版游戏消费者材料与测试账号仍缺，分别影响规格和真实接受，尚不能可靠估计总工期。SE选择入口合同现已按本轮流程基线对账发布，仅关闭具名来源子范围；L01及统一门槛未提升，后续仍先查已有证据再补必要缺口。

**“current缺补丁器来源未定”已由实参和同版helper澄清**：旧伪代码遗漏433FB0第二输出与435AD0目的输出，不能按它的形参个数构造跨端API。source现在明确为moduleDir\rawCode.pat，旧product metadata依然待改；文档将源已知与实现未完分栏。CopyFile(FALSE)与后续backup fail-if-exists不是同一次复制，启动失败也不回滚前次copy；不通过重做泛化库分析弥补已知差异。 [缺文件准备规格](../build/analysis/launcher-missing-patcher-v1/specification.json) · [核验](../build/analysis/launcher-missing-patcher-v1/validation.json)

**重复待办已按后续来源解释**：旧预设目录身份、41C060/列表重建、备注排序、XML常规/clear、目录子谓词、App初值、普通channel/modal清理共9条所选关系已有后续合同，不能据原remaining再查同根。真实差异是当前flow只设一次总deadline，候选失败轮换及request后未重开期限。catalog消息无job身份、prepared pending和已获callback跨重入的原限制仍明确保留；不推成必现故障。 [操作规格](../build/analysis/launcher-operation-composition-v1/specification.json) · [核验](../build/analysis/launcher-operation-composition-v1/validation.json)

**两项可重复误判已澄清**：传统cb30既创建调用也每帧调用，不能把32生命周期写成一次性初始化；旧profile的unsupported不代表没有来源。另4A31B0旧完整dossier被当前bundle factory因environments/predicate_type结构拒绝，原记录及失败回执保留，未修补元数据；该零返回结论改以原PE的3B独立LLVM核定，和成功验证的6份完整native分开。 [来源合同](../build/analysis/battle-observer-entry-contract-v1/specification.json) · [核验](../build/analysis/battle-observer-entry-contract-v1/validation.json)

**旧未决驱动重复分析的纠正**：SO-GAP-01键位和SO-GAP-02五经典工作阶段早有OW后续规则，OW-GAP-02局部写者又有AW规则；本批把有效下一项链接到剩余业务/回复及条件激活。上一组OC-R3的SO驱动按该关系解释，原文字不销毁。再见旧remaining或false标记先查覆盖链，不能据其重做已证体，也不能将整个原需求标完成。 [当前前沿](../build/analysis/current-frontier-supersession-v1/specification.json) · [核验](../build/analysis/current-frontier-supersession-v1/validation.json)

**组合分析的准入边界**：仅连续调用两个报价parser会跳过48FCE0忙碌返回或同步清旧owner，不能当原正常流程证据。另一方面仅有开场动画时group关闭不等于取消该动画，实际构造读取当前全局mode；两类时序须分别保留。469540整表清零也不是逐位置归还。OC-U7/U8明确为条件推断，未报告原版bug或设备接受。本轮无VM/联网操作。 [组合规格](../build/analysis/shared-occupancy-composition-v1/specification.json) · [核验](../build/analysis/shared-occupancy-composition-v1/validation.json)

**数量初值与延后生命周期误判纠正**：旧“上限/初值取数量”混淆了两个上限和第六参数0；QP-COR1已同步当前trade合同，旧原记录/派生/阶段工件保留。反编译调用少显示参数时必须沿压栈/发布者核对。42 leaf析构不清callback，generic清sidecar和条件恢复焦点另有规则；关闭已存在prompt不能推成自动取消未发布动画。本轮没有VM/网络操作。 [数量框规格](../build/analysis/quantity-prompt-lifecycle-v1/specification.json) · [核验](../build/analysis/quantity-prompt-lifecycle-v1/validation.json)

**旧局部摘要与计数误判**：Array(9)不等于9项主命令，所选flag5无新增命令依据；第8主行动精灵变身实际早有旧派生来源。exit profile ordinaryReturn unimplemented、stage185输入/退出缺口和早期city pending均须结合后续实现/合同解释。索引未命中、局部false或当前未移植不得反推没有源规则；已证链停止重复追helper。本轮没有VM或网络操作。 [整链规格](../build/analysis/battle-input-exit-contract-v1/specification.json) · [核验](../build/analysis/battle-input-exit-contract-v1/validation.json)

**本批避免重复分析的纠正**：完整Evidence/schema通过不表示其函数范围完整；43500028B范围遗漏了JNZ尾体，现用461B冷CFG补齐而不改原记录。原伪代码与现行260 chainFF guard顺序相符，无须再次移植。RID先前scratch、98FF独立收尾、ITM default后续cursor和107 boxed-word显示分别保留当前不足；不能将静态已知的源异常写成永久等待/no-op，也不能把独立安全收尾当原版完成。无新VM/动态操作。 [本批规格](../build/analysis/battle-preflight-boundaries-v1/specification.json) · [核验](../build/analysis/battle-preflight-boundaries-v1/validation.json)

**本批已证源与实现问题**：12/267不再笼统记作缺身体来源。当前专用队列仍缺；现有135有class guard且部分正常目标循环缺源seed，numeric端口未传seedSource。当前casting.overlay以>15/<0 clamp，源以>14/<1换向，导致现有普通循环重复15/0。两处是已证实现差异，待D批次修复，不能继续拿它们作REA未知。原RID/scratch/alias、版本和设备接受边界保持；旧训练服务单载体13项未找到不推定全局无旧记录。 [本批规格](../build/analysis/battle-utility-consumers-v1/specification.json) · [核验](../build/analysis/battle-utility-consumers-v1/validation.json)

**本批旧清单/回退纠正**：46份game-battle规格并非全量旧规格，另有5份命名前缀不同；98旧remaining6/7/8/12/13、73/105/260及106 RID均须看较新合同与实际条件。status含upper108，不能只扫首层数组。当前显式110类中12/267无专用消费者、会回退拒绝；这与已具路由中的资源/身份/未证上下文拒绝不同。source旧body已保留，下一步只审必要135/155/235及恢复，不把每个helper/拒绝字符串新建开发阶段。 [本批对照](../build/analysis/battle-variant-coverage-v1/crosswalk.json) · [核验](../build/analysis/battle-variant-coverage-v1/validation.json)

**本批前沿/字段纠正**：57字节4CCC20读窗落在旧3705字节4CC5F0内，selected branch为发布；规范库无procedure/undecodable不证明没代码。六缺失完整辅助先按实际CALL在独立副本导出，两次native无procedure错误已保留，未修改规范库/原字节。C5E9C8的所选效果为消费一次抑制后返回，非对象回收；C3B2CC/C43F58是当前端点。不能把输入列表revision、数据更新或显示空项一律叫已撤回。[本批规则](../build/analysis/inventory-selection-ownership-v1/specification.json) · [来源核验](../build/analysis/inventory-selection-ownership-v1/validation.json)

**前组避免循环的纠正**：旧gap可同时包含已补源、条件项、代码差异和外部接受；必须按现行40域对账拆开。上轮49条只是12层metadata，本轮21层82条是盘点范围扩大而非新增82个任务。旧stage182/profile的unimplemented和“剩余15”不能替代当前代码路由；24token有分派也不证明全变体完成。新REA仅由具名必要正向边触发；不因无账号/真机或反复精确零结果再取已证helper。[逐项对账](../build/analysis/capability-source-reconciliation-v1/reconciliation.json) · [战斗命令对照](../build/analysis/capability-source-reconciliation-v1/battle-command-crosswalk.json)

**前组复用与语义纠正**：source-check零候选不代表没有旧观察；流读旧嵌套快照恢复465000，四组重复按原query/入口去重保权。465270的void签名与EAX实际返回、68/64字节池宽、READ_WRITE究竟INC或DEC都按opcode核对。停生成不清池/基线，通用回收不自动管关联图形；保留源部分失败和shader边缘条件。未做VM/游戏/设备操作。[核验](../build/analysis/particle-lifecycle-contract-v1/validation.json)

**本批生命周期纠正**：不能把菜单取消-2、返回-3或非负选择都当成计数退还；真实退还在析构回调-1。标8000后仍可继续刷新，过渡请求不保证立即构造或自动回滚计数。47E740/47E880旧载体是MCP外壳，完整Evidence在/structuredContent；先按声明身份解包，不能因raw root没有evidence_id就重取。三个旧filename-only入口已有本批实际来源，仍不把其它索引零结果当全局缺失。[来源与剩余](../analysis/capability-first-v1/game-service-invalidation-contract.json)

**本批复用与归属纠正**：原材料文件名/旧候选不是业务所有者：chat-presentation载体中的4F2310实际是28槽物品发布；旧图保持历史身份，现行归属单列。全量发布可部分修改、空名称不整行清零，不能照整表替换。37项在当前标准客户端的专用更新缺口已按所读链定位，通用回调及外部自定义端口另列。取证器也修正了“静态标签必须3字符”的假设：GC实际2字符，4字节存储按原字节/hash核对；未改产品解析器。[当前规则与剩余](../analysis/capability-first-v1/game-entry-review-contract.json)

**当前复核纠正**：旧摘要累加容易把已证普通规则反复列为待补，现以40域矩阵为单一当前入口，旧合同和历史段落保留。81项登记包含来源/协议/接受等异质主张，不是81条报文；历史37条是累积复合范围，不是37个新增任务。另有37项仅在选定代码范围未找到主接收guard，全部有旧源入口；先查其他owner/无效果含义，不能直接推定缺功能。空owner声明和导出数量同样不证明不存在或已完成。必要规则缺口、产品差异及后续外部接受分开。[现行复核](../analysis/capability-first-v1/capability-matrix.json)

**本批已修正的归属与时序**：46c6b0是过渡包装入口，反编译void也不能替代已核EAX传递；返回非零不表示窗口已构造，0仍可触发后备尝试。回调计数、待删与物理释放分开。捕获68项不表示全恢复，普通/另一重建路径及标记消费条件保留差异。源接口错误不能因未改产品而留在现行规格。[修正与剩余](../analysis/capability-first-v1/game-dispatch-findings.json)

**本批共用边界**：索引内存目的可能只有DATA引用，需结合原指令，不能只数WRITE。数值常量/范围终点不是自动写者；尾跳不是CALL。延后动作是可被后写覆盖的单槽，恢复尝试也不提供成功回执。相同的97表零结果只作为有限边界保存，后续以具体新边或实际经典所有者推进。[现行规格与未决](../analysis/capability-first-v1/game-dispatch-findings.json)

**2026-11-09 执行成本复核**：部分旧索引漏收家族阶段的辅助函数，不能用单一索引的零结果推定未分析。已建立限定历史 source-check 的候选绑定索引；它只帮助定位原载体，不代替完整证据或语义复核。后续新查询先核同样本/配置的已有绑定，按明确需求缺口补证，以能力组统一收尾，避免重复查询与逐函数交付。40域发现和必要规格仍开放，名片/邮件本轮补证尚未成完整合同。[规则与下一步](development-plan.md#capability-first-execution)

**当前来源/政策边界**：宠物/物品选择时资格不等于提交时保证，所选提交分支不再次检查，不据此称全框架无处理。家族FC1824与经典C5EA70分开；确认保存失败仍可返回父列表。当前保存目录用映射，517510缓存拷贝用直接索引，未证正常流程恒等不变量，不能擅自修正为同一目标。34处直接引用已定位，区域/别名和全局晚到仍待证。旧前缀与完整字节视图区分；尾跳不是CALL，能解码也不证明渲染编码，原字节问号不补字。[证据与剩余](../analysis/capability-first-v1/game-mail-data-contract.json)

**当前输入/资格纠正**：掩码六位计数独立，0不等于未输入；键查询不消费，退格检查在focus数字键门槛之外。445220立即置焦点，445230是F键槽服务；正常关闭只隐藏，不直接清焦点/回调。经典加点门槛已找到参与字段写者，剩余signed>0与另一套!=0不同，不能因共用报文合并全部条件。完整焦点恢复/其它输入生产、宠物服务与其他业务继续待证；四资料载体及经典刷新见本组合同。[合同与未决](../analysis/capability-first-v1/game-input-admission-contract.json)

**焦点清零的搜索边界**：指定1,708留存记录中的603规范体按字面零调用/零写规则未匹配；未覆盖全部派生体、寄存器传播和别名，不表示程序没有清理。后续从具体引用/别名边推进，不重复同一负搜索。[范围回执](../analysis/capability-first-v1/game-input-admission-source-check.json)

**当前函数范围陷阱**：4df420在旧分析副本中已有502字节函数，重新CreateFunction未扩展它；更长伪代码不能替代正文覆盖。4df616原生观察返回undecodable，但PE字节有效。最小补证是在独立副本沿已证fallthrough清理15字节Listing标记，再逐指令恢复并核原字节/跳转表；不改原件、规范函数元数据或工具规则，不据此提升97项全局分发。[证据与范围](../analysis/capability-first-v1/game-ui-producers-source-check.json)

**本轮分析启动问题**：独立headless首次未继承JAVA_HOME，复用现有JDK21的进程环境后运行，无安装/全局设置变化。另一次Java备份仍用.java扩展导致重复类编译失败，headless却返回0；已保留失败日志并将备份改为文本，必须核脚本输出文件、内容及原字节，不能只验退出码。[阶段核验](../analysis/capability-first-v1/game-ui-producers-validation.json)

**当前业务边界**：两套宠物界面不强行合并资格；数字提示的callback/requestID可被复用覆盖，隐藏位不等于回调已清或对象销毁。46de10/46b530在指定894快照缺正文，继续按实际调用补证，不能称全项目缺失。[合同与未决](../analysis/capability-first-v1/game-ui-producers-contract.json)

**当前调用/状态纠正**：5个空caller列表不等于无调用，完整incoming引用取得8个CALL；6处已有旧派生owner而原生owner仍为null。所选图还补2处，不把单一provider当全程序覆盖。ef35e0的4个CMP立即数是数组界限；eadf88有真实显示/重置链但业务名称仍待证。剩余4f6432/4df808沿实际代码指针4f63e0/4df420继续追，不按邻近地址猜函数。资料mode1的实时/缓存flag不同，五字段循环的第五值也非未初始化。[来源/未决](../analysis/capability-first-v1/game-producer-context-contract.json)

**REA大包导入恢复**：291MB旧包整包导入被内存预算拒绝，未通过扩大预算或改工具配置重试。最小恢复是复用同版1667记录快照，用REA自带规范bundle工厂选择12个完整记录（含父体及9个视图），保持原字段/ID，工具仅导入9个缺项，恢复1676记录基线。本组新导出逐项核对旧记录未变；会话已正常关闭。后续复用这份导出和明确记录选择，不裁剪字段伪装完整证据。[本组留存核验](../analysis/capability-first-v1/game-producer-context-validation.json)

**本组生命周期与留存纠正**：close选择不等于清图形缓存，40a090/40a0c0也不立即释放；回调内标记和受节奏门控的回收必须保留。4ea9b0-dossier.json为旧失败lookup，720字节派生体才是可用正文；不得按文件名当规范dossier。另两辅助体仅在旧索引有complete-record标识，已查battle-commands包无正文；最小恢复是加载已核同37c4快照，按精确入口/ID查保留项并读完整分页，再核父记录和原字节。本组三辅助体已这样取得，无重复反编译。97业务回调的限定图零结果不是无用证明；不重复负搜索冒充进展。物理元组/RNG、全恢复/平台和具体业务生命周期继续待证。[证据与剩余问题](../analysis/capability-first-v1/game-graphics-lifetime-contract.json)

**本组归属/覆盖纠正**：旧“72根无候选”是索引标签缺口，并非72项新需求或无分析。39发送包装可归并，18有业务上下文、21继续追实际调用；两个共享常量分别返回1/0，不能把36/1,464处引用算成独立功能。4f36d0按实际分支归战斗；4ef580/4f2010的坏栈伪代码及4f3310不全调用参数不能替代旧协议目录。8发送空caller及48a060帧表归属均不证明无用；incoming_references/relationship_coverage未留存，5015a0的15非立即数CALL与provider unresolved=0也不能互换。原程序/VM未运行。实际callback消费者、21发送业务路径、518d70与flag/text读者、图形/恢复/输入继续待证。[具体缺口](../analysis/capability-first-v1/game-entry-review-contract.json)

**模态/恢复补证边界**：45034f只有5字节JMP，不能把其展开伪代码计成另一份完整pump；44f59c/44f2ba依赖父函数保存寄存器。449c73的A/W FID冲突由MessageBoxA IAT与RET0xc解决。XML Load清旧子树不等于清诊断，Parse清诊断不等于清旧子树；取消也不统一回滚。已知消息继承链没有普通WM_CLOSE处理者，默认系统关闭规则引用平台文档，未冒充原程序运行结果。其他入口/所有者丢失/异常、动态菜单/3资源及游戏共享状态继续审查。[来源](../analysis/capability-first-v1/launcher-modal-recovery-source-check.json)

**连接来源排障**：588260的“jumptable”警告实际对应PE IAT中的InterlockedDecrement尾JMP；589e70伪代码扩入58bc00，结论仅取所核70字节体及其出边。588190的RET0xc不能被两参数伪代码覆盖。已证正常序号查找/引用排空，但注销先移除owner行、后条件清句柄，不能将后者扩写为所有旧回调重入均无影响；完整modal/并发、全局退出/异常仍待证。[来源/边界](../analysis/capability-first-v1/launcher-channel-source-check.json)

**当前静态分析边界**：401040规范dossier失败；已沿实际CRT表项和PE入口，用独立LLVM核对选定108字节，不修改REA规范项目或把401079内部存储当函数入口。定时器伪代码删去三块，成功Connect分支必须用完整体汇编核对。DNS正常引用/取消已有源证；busy门槛不能证明旧channel回复不会进入新尝试，内部排空/派发及完整modal/异常重入继续待证。本组未操作VM或原程序。[可复查来源](../analysis/capability-first-v1/launcher-lifecycle-source-check.json) · [剩余问题](../analysis/capability-first-v1/launcher-lifecycle-contract.json)

**事实**：此前分析/实现/验收按很小的分支持续推进，当前需求入口包含大量历史阶段；历史 37 条剩余复合记录并非全功能清单。协议矩阵 revision117 的 81 条登记也不是到 stage306 的全部功能覆盖。本轮已逐条关联这些来源到[38 个能力域初表](requirements-index.md#capability-first-inventory)，没有将旧 `unknown` 修改为通过，未删减旧要求/消费者组。

**最小调整**：当前顺序改为全入口盘点→复用/集中 REA 补证→统一规格→按依赖开发→分层验收。共享状态和关闭/恢复链先联合分析；已有模块按规格补差异。开发计划和需求索引承担当前入口，历史材料继续保留，避免再以细分支重复复制全套状态。[当前计划](development-plan.md#capability-first-workflow)

**入口盘点实绩**：固定来源中 2,768 处引用归为 647 函数入口。先索引留存证据，再批量恢复 480 个缺口入口，全部指令匹配原件；业务语义仍待逐组关闭。[核验](../analysis/capability-first-v1/entry-source-check.json)

**可重复工具问题**：有效窗口回调地址尚无 Ghidra 函数时，`procedure_pseudo_code` 的 file-offset fallback 可报无源映射；这不证明原文件缺少该地址字节。当前以完整源表指针锚定，在独立副本补建并逐指令核验，不改规范 REA 项目或原程序。首次分析器把空的 0 号描述符、259 控件窗口和 type0/值1 当作不可能数据，已修正为保留真实值/限定预算/记录未决；调用图还需保留 EXTERNAL 地址空间。[发现与边界](../analysis/capability-first-v1/entry-findings.json)

**证据复用最小顺序**：当前 REA cache 或文件名搜索未命中，不等于历史无证据。先查同 SHA 的公开 source-check，再按其 ID 定位对应小 bundle/快照；本组 467fc0/468f00 曾重复查询，ID 与历史相同，计入复用而非新增。46c7c0 从旧 bundle 直接复用；缺口 46ceb0 才新增取证。动态 PUSH 注册也不在静态表根入口内，新发现 4a8e20 已单列并核全部329字节。[本组核验](../analysis/capability-first-v1/window-engine-source-check.json)

**登记范围定位补充**：旧source-check中的地址/直接调用目标只定位线索，不代表完整函数体已读取。现647根已用143规范留存、503旧派生、1组合证据定位工具登记地址集/视图；表68补证证明范围齐备不等于业务路径完整；最后两份好友体从已知snapshot按精确ID提取，没有重新反编译。相同地址多个旧dossier时优先公开source-check绑定ID，不任取另一个；如4f4af0采用ev_db6f979f…对应记录。3,506静态边和能力候选不作完整业务闭合。[统一索引及未决](../analysis/capability-first-v1/business-entry-map.json)

**两套窗口与命令映射边界**：另一套输入mask不同，4ea6f0为活动查询、4ea170为焦点比较；4033d0隐式ECX指向图形对象+0x170，不能从无this伪代码误作输入锁。有限搜索未定位表callback消费者不证明框架无用。登录器同ID跨资源重复，不能全局join推断对话框；菜单ID0分隔项已从命令计数排除。实际类/继承、业务/图形生命周期及分发继续待证。[另一套规则](../analysis/capability-first-v1/alternate-window-contract.json) · [登录器候选](../analysis/capability-first-v1/launcher-message-map.json)

**本组类绑定修正**：415094/4164dc写同一主vtable，但完整体表明前者属415050构造、后者属4164b0析构；先解析规范函数与同对象参数再赋角色。主模板为133，基初始化/模态加载与vptr/RTTI/消息链联合支持，未凭名字猜ID。Surface共同基类的7900/7927调用者又写不同末级表，不把它们合成同一业务。11模板有源构造路径，3模板用途仍未闭合。[类/模板证据](../analysis/capability-first-v1/launcher-dialog-bindings.json)

**数字匹配禁忌**：0x128在42dfb0删除析构分支作参数，不是已观察模板加载；0x780e唯一LE16原始匹配邻近E8相对位移候选，指令边界未核，不当成模板实参。窗口常量可能是大小、偏移、消息或指令编码，必须追到参数/字段/资源API。此类限定负查不证明资源未使用，也不把所有库资源自动扩为需求。

**分发仍未闭合**：lookup六个直接CALL已绑定，其中4ea740仅为82字节派生体；它按cache返回1/0且忽略open/close结果。不能由返回1推定打开成功，也不由找不到callback列直接消费者推定框架无用。继续沿实际入口、别名和已纳入模块取证。[来源与未决](../analysis/capability-first-v1/game-dispatch-findings.json)

**共用规则的误读边界**：469670 是绘制，46a1f0 是控件事件；cb30 并非只初始化，2000 并非关闭，400/800 不是松开。源同步组销毁仍调用业务析构，不能默认静默。type0/值1 目前有初始不参与保护，但动态激活未排除；quick reset 与取消/恢复也不能合并。[统一规格及待证](../analysis/capability-first-v1/window-engine-contract.json)

**前序证据**：另一套工作窗口会写入经典工作消费者使用的共享等级字节；27 个派生入口的原文件字节已核对。入口可达前提、两套条件/计时、共享状态重置仍待关闭，不依据初值或单个 xref 列表推断完整生命周期。[研究](../analysis/game-work-lifetime-v1/research-summary.json)

**预设复刻的已证误读风险**：416380是析构，不是保存；414f60/416cf0按记录/字符串复制，不能当共享指针；成功的重命名/删除/排序先保存后发布，外层取消不回滚，单次撤销不是无限历史。旧UserMode-only偏好模块与LPS1不等价，64字节名称也不是64个Unicode字符。两处共享命令桥在规范Ghidra中未定义/不可解码，但REA完整15字节与源文件一致；只按MOV/MOV/CALL/JMP固定模式派生槽0x180/0x184，未补建规范函数或扩大为完整框架分发证明。部分bool帮助函数被反编译为void，已结合AL返回与调用者TEST AL确认，不能只读伪代码签名。[具体来源与未决](../analysis/capability-first-v1/launcher-presets-source-check.json) · [规格](../analysis/capability-first-v1/launcher-presets-contract.json)

**预设应用的已证边界**：不能把每个100ms定时器当自动登录；36a只提示键盘状态，100才推进普通交换。入场标记+0x10f0在回复后选择ID前已清，失败/歧义走手动且不代选ID；账号或启动选项变化取消预设，但普通密码登录仍可继续。目录预检失败与准备列表后失效的副作用不同，不统一回滚全部状态。

**可重复反编译问题与最小处理**：425790高层输出删去大量不可达块，而完整汇编仍含分组/循环/过滤指令；424cf0也有删除块警告。已保留完整AddressSet、分段字节和警告，不用短伪代码宣称全部排序/重试完成。组合复用的12体明确保留旧workflow profile、原请求内点/规范入口、旧伪代码和当前native范围/汇编；不得把组合记录标成新analyze_function。本组补证如下，规范旧记录保留，不改全局工具配置或原PE。[来源/限制](../analysis/capability-first-v1/launcher-apply-source-check.json) · [未决](../analysis/capability-first-v1/launcher-apply-contract.json)

**反编译缺块的复现与最小处理**：425790调用者警告32条，41cc70为102条；查询被调用者dossier再读伪代码仍未修复。仅在独立Ghidra副本为418db0/42b0a0补已由PUSH/ECX/RET核对的参数存储，两调用者警告降0，另3调用者保持0；五体1,624指令/6,267字节前后及原PE相同。此结果为分析者派生，不覆盖规范REA或证明所有分支正确；424cf0仍待处理。不得为消警告改原PE、全局分析配置或把本地派生结果伪称规范dossier。[可复核身份](../analysis/capability-first-v1/launcher-catalog-state-source-check.json)

**字段/版本的已证纠正**：+0x1694为游戏ID筛选词，不是账号缓存；前组生成器和合同已纠正标签，原来源/验收回执保留其历史哈希。同版Game.EXE才是预设字段2生产者，尚非安装路径。current-catalog/current-metadata文件名对应c7ba69…，不能因“current”或相同地址混用为c82f。准备pending标记只能支持该guard，不推断全部陈旧结果/关闭/重入已处理。[本组合同及未决](../analysis/capability-first-v1/launcher-catalog-state-contract.json)

**本地元数据角色与范围纠正**：+0x1998是排序撤销可用，不是未保存dirty；+0x1698快照仅含pin/move排序整数及锚点，不含备注/置顶。7209/720a实际重置/撤销，不能据旧候选开发导入导出或假定新排序对话框。已有目录组生成器/合同/源锚点标签已同步修正，原dossier/读取/历史验收回执保留。保存BOOL与恢复失败分支都需保留，不声明原子事务。

**返回值与桥接核验**：4182c0伪代码为void，实际AL由BL返回，调用者TEST AL；只读签名会丢失成功/失败。两15字节命令桥调用的帮助体也须读完整：它保存/恢复寄存器并含间接调用，不能由首字节猜成单RET。字节偏移0x200与DWORD索引0x80分别处理。本组仅静态派生/原创模型，未改规范REA、原PE或运行工具配置。[可复核来源与边界](../analysis/capability-first-v1/launcher-id-metadata-source-check.json)

**目录/路径/关闭的当前注意项**：40d4d0实际调用402000，40d4f0是字符串Replace；4355f0为目录规范化，40ba50才是注册表查询。不能由名称/邻址归属功能。手动选择的临时路径写入早于校验，不能标整个操作原子提交；注册表发现写INI未检查结果，和手动提交不同。静态恢复的42e370/4127f0分别以原消息表指针和95字节原件核验，不修改规范REA；App完整初始化器、所有晚到回调/重入及菜单附着仍未闭合，5000ms等待/CloseHandle不证明任务已停止。[限定合同](../analysis/capability-first-v1/launcher-catalog-install-contract.json) · [来源及边界](../analysis/capability-first-v1/launcher-catalog-install-source-check.json)

**已收窄的路径/菜单/忙碌问题**：FID把5a3725混标为ismbcalnum/ismbcalpha/ismbcgraph，应沿19字节包装核到5a3738及ctype0x103/多字节标志，不能按候选名实现图形字符规则。菜单128的创建请求现已有源，实际显示/禁用和动态目标继续分开；4个已知对象无handler的资源命令不得误报全局未用。409bf0只读+2b84/+2b88/+2b90，目录任务另外检查+2bc4/+2bc8；不以单一busy代替所有owner。无VM/运行程序或安全设置操作。[限定来源与未决](../analysis/capability-first-v1/launcher-host-routing-contract.json)

**XML反编译与复用边界**：4395b0规范范围缺少四路跳转的70字节，已依据原指针表以LLVM21独立解码34指令并逐字节核验，未改规范REA；不把其void伪代码或未恢复switch当完整数值结果。439de0的三处值复制被伪代码判为不可达，原汇编CMOVNZ仍在，按汇编保存条件。宽度表从原件提取（C0/C1宽1），不套用名称或标准表。现有解析器28项行为与静态推导有24个选定属性差异，不是原运行时差分；异常指针/容量/文件效果仍待验，不据此宣称所有非法XML可接受。[来源与未决](../analysis/capability-first-v1/launcher-xml-contract.json)

**当前未决**：清单发现与统一规格门槛均未通过，现行游戏消费/同版交接、真实微信/手机和官方会话仍缺证；暂无专用测试账号。外部知识库 requirement-index 角色缺失仍沿用仓库实时需求入口，本轮不修改外部知识库或全局规则。工作量节省为流程推断，尚无可信比例或全项目剩余工期。

<a id="stage306-work-context"></a>

## stage306 静态回调盲区和测试对端字段取错

常规Ghidra xrefs只列出已识别指令，空的正向写入列表不能证明开关不可达。本轮用完整字节搜索找到未识别引用，再核对0x54164c／0x54168c静态回调指针，在独立分析副本播种471e00／471f00并逐指令核对；没有补写原程序字节。回调表第二指针最初转录为54166c，在原文件核验时已纠正为54168c，实施前通过。[来源](../analysis/game-work-context-v1/source-check.json)

原始资源测试的首轮对端把H#|角色列表当成@Qu角色上下文，从错误字段取本机编号，导致Hx!70未作用于本机，后续请求未到达。已纠正对端并加编号格式校验，完整重跑四种界面；运行代码没有为此放宽输入条件。另纠正Page断言把序列化cost当成渲染文字，以及生成测试包装器缺失。收尾发现新回执的两个外层阶段编号沿用了305，已改为306；保留原记录并在最终版本重跑四条新流程和冻结回归，运行代码不变。网页、Page及标签修正前的已保存日志留在本地build，不计作最终版本通过。[验收与修复记录](../analysis/game-work-context-v1/validation.json)

已证表外tier、原生全部窗口计数／共享全局交错、c5bd1b动态写入和其余技能分支仍待追踪。当前Page证据是实际handler／Canvas与原生形状本地端口，DevTools／实际微信／真实手机及现行／官方接受没有被替代。

<a id="stage305-work-targets"></a>

## stage305 采集重启门禁已按来源修正

界面核验时发现采集结果期间可以显式 retry，可能跳过 2 秒展示。源 479b70 的重启控件禁用，479880 暂停后才启用；已将核心 retry 限为 paused，同时禁用结果按钮。补充检查并在最终构建重新跑四种新流程、八条旧流程及完整冻结回归；此前中断的回归保留日志，不计通过。[验证及修复记录](../analysis/game-work-targets-v1/validation.json)

网页产品测试首轮以 120 秒调用仅接受至多 60 秒的本地桥，被参数检查拒绝，尚未进入网页。测试参数已改回支持的 60 秒，并保留失败日志；正式网页流程均在该范围内完成，没有更改桥的限制。Browser plugin not available，使用现有 Playwright；网页实际控制台无错误／警告。

两级目标必须保留服务器侧选择上下文和源序号；本地宠物栏空位不是 wireIndex，重查后旧 revision 不可复用。目标名字超出已证 16 字节范围、非零上下文、其他普通分支、完整原生窗口／动画／动态别名仍待证；当前只证明固定旧版切面。本轮 VM、原程序执行、官方会话均为 0。

宠物过滤最初直接借用已接收 mode6aa；收尾已补证 480ac0→C1FC14 的实际复制关系。该关系成立，原生全局刷新和用户编辑的全部交错仍未证明等价，不能据此标记全局别名完成。

<a id="stage304-work-actions"></a>

## stage304 普通工作已证边界和未决

修理／鉴定／刻印和装饰没有复用普通制造的全部规则：说明条件在鉴定中取反，修理成本依物品等级；装饰全部 56 行成员查询不能受负 id 前缀截断，替换也须先清旧位。它们均已有独立模型、真实所有者和源码／生成检查。[验证](../analysis/game-work-actions-v1/validation.json)

源代码提交等级读取 c5bd1b，当前只证明虚拟零填充初值 0 和三个读取引用，没有证明所有原生共享别名生命周期。kind2 控制台使用本结果属性，原生结果控件引用较早制造全局属性；独立语义 UI 使用本结果值，完整原生控件等价仍待验证。刻印字号 12 与 16 字节行容量已区分。

旧制造产品复测的首轮测试加载器因 Node 重复注册被严格单次断言拦下，未进入产品执行；只修正 build 内 QA 输出路径重定向为幂等后复测通过，保留失败日志，未改旧测试逻辑或覆盖 stage303 证据。网页实际运行没有控制台错误／警告。

Lor kind3 治疗／急救／变身／变装、kind4 采集／发现、非零上下文、完整合成、原生动画／全局 RNG 和真实平台／现行／官方接受仍未完成。当前仅固定旧版普通上下文切面；本轮 VM、原程序执行和官方会话均为 0。

<a id="stage303-craft-input"></a>

## stage303 制造联调已复现问题与修复

人物进入确认和技能资料可能在同一读取批次抵达：角色轮询尚未完成时自动配方查询曾被 GAME_NOT_ENTERED 拒绝。修复仅对已接收技能产生的固定查询开放内部源操作发送；登录 ready、公开游戏动作的进入检查及既有好友查询限制继续验证。合并包专用回归证明查询可先发、用户工作姿势仍被拒绝。[测试与接收回执](../analysis/game-craft-input-v1/validation.json)

Page 原先只在首次呈现或小地图状态变化时发布画面状态，制造请求已送出但面板仍显示 working；活动制造现在随呈现采样并按内容去重。网页长面板已将内容独立滚动，标题和关闭控件保持可见。关闭 world 后的只读快照也已检查，避免调用已关闭制造所有者。

修理、合成、非零上下文、全局 RNG 交错、原生 work-pose 动画／窗口、真实平台／现行／官方接受仍未完成。当前只证明固定旧版普通制造切面；本轮 VM 操作和原程序执行均为 0，不重启历史 VM 分支。

<a id="stage302-craft-recipes"></a>

## stage302 配方更新不能整表清空

配方消费者现已接入，但制造 UI、材料分配／提交／结果和非零普通上下文仍未实现。源 4f28b0 对超长文本不覆盖，4ff030 后续重置只改编号和上下文；不能把这两个分支实现为整表清空。空回复仍循环全部 56 行，数值成为 -1、文字清空，与部分重置不同。[来源](../analysis/game-craft-recipes-v1/source-check.json)

当前快照使用独立配方版本，保留技能主列表的旧快照形状及版本语义；未来制造界面须读取配方版本并按已证实的源条件解释字段。本轮客户端检查使用原创受控端口和生成 API，不等于真实网络／微信设备接受。无 VM 或电脑控制操作，既有排障知识库保持。[验收](validation.md#stage302-craft-recipes)

<a id="stage301-battle-item-dispatch"></a>

## stage301 ITM 默认分支与验证入口经验

ITM 1–5 不能仅因当前代码返回 item-variant-handler 就列作待补的五类效果。原程序本次回调只读编号并返回，不调用完成函数；后续读取取决于剩余字节。当前独立实现保持拒绝，原生后继行为未验。[来源](../analysis/game-battle-item-variants-v1/source-check.json)

生成回归首次将 `build/.../generated-loader.mjs` 作为裸模块参数传入 Node，触发 ERR_MODULE_NOT_FOUND，五个测试文件均未加载。保留失败回执后改为绝对路径，同一五文件 63 项全部通过；未修改产品或测试。本轮没有 VM／电脑控制操作，既有 VM 排障记录保持。[验证](validation.md#stage301-battle-item-dispatch)

<a id="stage300-city-water"></a>

## stage300 回城时序与测试入口经验

已初始化回城水面及等待回复连续绘制已接通；其他初始／main9特殊／错误／停止、原DDRAW／D3D缓存、完整对象／移动／RNG／音频调度仍未验。真实本地角色尚未到达时保持preparing-scene，使用保留坐标绘地图；不能用动画完成提前创建角色。[来源](../analysis/game-city-water-v1/source-check.json)

新测试发现并修正：场景无角色时原绘图中心要求本地对象；生成夹具跨源码／构建WeakSet身份，现用同一包内会话；新产品helper遗漏原release命令、默认旧Page目录、等待超出55／80／105边界的额外空帧。资源未到且捕获返回null时不会增加Canvas绘图数，不能以不存在的额外画面作为等待条件。受影响私有运行中止并保留记录，修正后五路径×四入口全部通过；原资料／旧helper未改。[验收与复现](validation.md#stage300-city-water)

<a id="stage299-battle-water"></a>

## stage299 战斗水面边界与测试恢复

正常main9/3→main10→main9返回的水面已绑定，stage298的战斗特殊图形边界由当前正例替代。其他main9／城市／错误／停止与进程前缀、DDRAW／D3D精度、type6/7缓存仍未验；原RGBA8／越界带保留和非原视口策略不变。不能只看main10门槛赋值，不能把缓存背景当成重新排队，不能把返回等待帧数替代本地对象存在条件。[来源](../analysis/game-battle-water-v1/source-check.json)

旧拒绝测试只有修改后的索引、没有实际RD，现保留其底层缺图边界，并由全十索引正例检查成功路径。新TCP时序检查最初依赖私有生成helper，已改为直接从保留的原创源helper构造内存模块；运行共享测试不再要求先生成build文件。源码／生成10项与完整3,731项通过。先前普通水面的20份历史截图保留，本轮20份独立保存在/tmp/moli-stage299-qa。[验收与复现](validation.md#stage299-battle-water)

<a id="stage298-ordinary-water"></a>

## stage298 水面已知边界及复现经验

普通地图水面已局部实现，战斗特殊队列原显式边界仍保留。原生DDRAW／D3D错误、type6/7缓存、运行前缀、普通playing之外的相位／位置／9250c8绑定未验。当前策略为原640×480源带越界保留目标，较小视口向固定临时面补零后裁出，不能当作原驱动或完整原画面缩放证明。独立SceneFrame调用未传第8参数时以camera作位置默认；实际world必须分开传玩家位置。

新模式0夹具需同时匹配TfD与=mJ身份，并提供碰撞图形目录、匹配actor／scene延迟命令；初期缺项导致夹具失败，修夹具后8项通过。提前启动的两次整回归中止，未计验收；最终冻结回归3,721项通过。复用CUT产品检查时，该场景特有的命名调色板断言不适用水面地图，当前新helper检查实际解码，旧CUT检查保留。生成Page默认null配置按设计拒绝启动资料；本轮使用既有明确本机测试配置重建，未改输入门槛。[结果与复现](validation.md#stage298-ordinary-water)

<a id="stage297-body-draw-flags"></a>

## stage297 消费者接通与生产者边界

身体164／165此前进入未实现分支，现按原字节只写绘图掩码255／0并推进队列，保留原覆盖值和独立颜色掩码。165不会恢复旧掩码；原动画翻转偏移保持。未知样式位在关闭覆盖后继续触发原明确边界。

正常协议生产者仍未确认，未向GMN21或其他协议加新字段。PUSH常量搜索无匹配仅是限定扫描结果，不代表不可达；原大函数value-flow和较宽初搜的覆盖边界保留。初版门控测试错误地假定慢帧已到phase0，现按真实四相位推进再检查，未放宽产品门控。

实际材料测试新增截图目录参数，本轮使用 `/tmp/moli-stage297-qa`，保留stage296历史图像。Node vm计时差异沿stage296记录，不据此判断真实微信性能。特殊图形、其他控制、完整调度／UI、现行交接和真实平台仍待完成；外部requirement-index继续缺失。[后续](development-plan.md#stage297-body-draw-flags) · [范围](../analysis/game-battle-gmn-flags-v1/goal-audit.json)

<a id="stage296-actual-battle-product"></a>

## stage296 实际材料流程与测试环境边界

两组CUT的8条实际素材产品流程通过。初版验证器把保留的战斗诊断快照当作仍在战斗，导致浏览器回场等待；按实际普通Canvas控制器状态修正后通过，没有为测试清空产品诊断状态。对端背景替换已限制为status入场处，桥接使用既有60秒上限，原件和运行时代码未改。

生成Page在Node vm环境中约需更长时间，源码与生成Page的战斗帧数相近，未发现重复协议动作。同一CJS产物直接Node绘制明显更快，隔离vm绘制更慢，RGBA摘要完全相同；注入Math只部分改善，内部开销仍未细分，也未修改既有跨上下文测试环境。此证据不代表真实微信性能。[诊断与复现](validation.md#stage296-actual-battle-product)

完整特殊图形、GMN164／165等控制、调度／UI、现行交接和真实微信／手机仍待完成。当前地图格与战斗配置来自原创对端；实际素材截图不是完整原服场景。外部知识库仍缺requirement-index角色。[后续](development-plan.md#stage296-actual-battle-product) · [完整范围](../analysis/game-actual-battle-product-v1/goal-audit.json)

<a id="stage295-battle-draw-style"></a>

## stage295 透明度与加色混淆已修正

旧playback把对象透明度映射成动画flag8，帧控制器再删8并强制白色，无法表达真实动画加色／ARGB／命名编号。现按506e80把颜色覆盖mask与原动画分开，并保留最后的ghost alpha128。首次变形副本可能继承mask0，即使原alpha字节为0也应按原mask绘制；后续源分支才开启。alpha255覆盖与mask关闭分别验证。[接口](module-interfaces.md#stage295-battle-draw-style)

40a120完整MCP响应超过传输预算，保留投影／导出和原字节核验已完成，value-flow截断仍明确保留。首轮新测试误用命令所有者的不存在appendActions入口，已改用真实身体所有者的原回调路径，产品代码未为测试新增调用。 首轮全量3,710项有两处旧参考差异：元素延续把对象alpha合入原动画字段；宠物ghost渐显仍期望拒绝。新独立参考保留116份元素前缀状态和14帧、宠物82状态及64帧，分别修正末状态与提升100帧为正例，历史原夹具不改。两条路径18项测试及源码／生成178完整帧均通过。

原特殊图形、GMN164／165等未移植控制、全局调度／UI、RID／自身／混合／空目标／本地停止、现行交接及真实设备仍未完成。完整实际素材的产品战斗／回场覆盖继续扩大；本轮产品截图为原创材料，不能当作原版完整场景。外部知识库仍缺项目requirement-index角色。[后续](development-plan.md#stage295-battle-draw-style) · [完整目标](../analysis/game-battle-draw-style-v1/goal-audit.json)

<a id="stage294-vertex-color"></a>

## stage294 已闭合颜色与剩余消费者

普通ARGB与有效部分命名调色板已接通。实际113305的645字节载体此前被固定768字节检查拒绝，十帧实际只引用有效项，现按原复制前缀及已知色掩码验证。未提供的颜色仍为明确错误。stage292／293仅白色或全长载体的描述保留为历史状态，当前以本节及新接口为准。[接口](module-interfaces.md#stage294-vertex-color)

颜色调制采用微软文档默认纹理状态的推导；驱动实际状态、量化／滤波／边缘、原DDRAW分支及原生alpha未做运行验收。战斗专用计划仍会拒绝部分动画颜色／命名编号，对象opacity另有既有翻译；下一步先核其最终队列生产者。其他玩法、完整调度／UI、现行交接和真实设备仍未完成。

本轮原创QA脚本原先要求首144个AUT格至少一格非零，59526的这些格实际全黑，已按来源黑色1修正采样；与颜色功能故障分开记录。新测试曾误用未导出的内部天气工具，现用公开RD／调色板接口构造原创像素。浏览器每流保留一条getImageData性能warning，error／页面异常0。外部知识库仍缺项目requirement-index角色。[验证](validation.md#stage294-vertex-color) · [完整范围](../analysis/game-vertex-color-v1/goal-audit.json)

<a id="stage293-additive-render"></a>

## stage293 标志8已接通及剩余绘制边界

stage292的标志8边界在共享D3D效果模拟路径已接通，实际113685／947通过网页与源码／生成Page。原DDRAW分支会省略该效果，共享产品选择呈现来源D3D加色，不能宣称重现所有原生后端。硬件滤波／边缘、16／24位量化及任意顶点ARGB调制仍待验证。

检查文字时确认，高层加色若先画入透明层再source-over，会丢失文字／背景的参与；本轮改用初始帧副本保持逐命令顺序，4份独立文字层像素通过。初始RGBA、准备精灵和输出互不共享，读错参数不修改借入帧。

实际地图是12×12材料组合，所选不透明地面较暗；关闭小地图的桌面／触屏截图已确认发光物件可见。浏览器getImageData抽查产生一条性能warning，error和页面异常0。知识库仍缺项目需求索引角色；其余玩法、完整UI／调度、版本／现行交接、真机和官方验收继续保留。[后续](development-plan.md#stage293-additive-render) · [完整目标](../analysis/game-additive-render-v1/goal-audit.json)

<a id="stage292-animation-named-palette"></a>

## stage292 历史320失败已解决及剩余样式

stage291的113058／编号320失败在当前延迟地图路径已解决：原版表把该编号映射回图形资源113058，其RD含可用内嵌颜色。当前四种入口均能准备该真实动画并完成移动／切图；历史负例记录描述旧实现，不再是当前通过条件。[验证](validation.md#stage292-animation-named-palette)

标志8在 `446e00` 进入图形设备加色分支，当前仍明确拒绝；418个候选动画的历史探测不能当作418个正例。未绑定的直接精灵提供者和其他动画上下文也保留边界。本轮支持一条实际命名调色板消费者，不代表1,495份实际载体或整套资源版本均已验收。

原创12×12地图与其CUT裁片仍是材料组合测试。首次截图中，小地图叠层遮住了动画物件，因此补做关闭小地图后的桌面／触屏视觉复查；位置与原生窗口一致性仍未声称。浏览器像素抽查的readback性能warning保留，error／页面异常0。真实平台、完整玩法和原始37项／10组范围继续保留。[后续](development-plan.md#stage292-animation-named-palette)

<a id="stage291-legacy-minimap"></a>

## stage291 实际CUT范围修正与动画调色板缺口

stage290的23.cut确实不存在，但它是原创对端指定的测试地图。实际包已含341CUT／337AUT；不应再以“整套CUT缺失”作为恢复前提。本轮59529配对的模式1静态场景、小地图和移动已通过，未补造23.cut或修改原资源。[验证](validation.md#stage291-legacy-minimap)

实际113058动画解析54帧，但绘制遇到paletteSelector320返回 `LEGACY_SCENE_FRAME_DRAW_STYLE`。418个选取CUT动画候选均有非零编号，部分另含标志8；当前保留一条实际产品负例。下一步核对原生调色板选择和材料版本关系，不能忽略该字段或把当前材料视作完全匹配。

原创12×12场景只加载一小块地图；54／107格小地图大片黑色是来源定义的补0格栅格结果。59529的所选静态裁片也含透明区域，画面不是完整官方地图。独立界面位置、资源异步调度、16／24位和原生硬件后端尚未等价验证。浏览器像素抽查引发每条正向流程一条Canvas readback性能提示，控制台error／页面异常为0；提示与实际日志一并保留。

其余玩法、完整调度／UI、现行交接、实际微信／物理手机／设备音频及官方验收仍保留。知识库需求索引角色仍缺，沿用仓库真源。[后续](development-plan.md#stage291-legacy-minimap) · [完整目标](../analysis/game-legacy-minimap-v1/goal-audit.json)

<a id="stage290-legacy-material-compat"></a>

## stage290 实际素材、重复索引与缺失CUT

实际材料现已通过人物、地面、物件、移动和场景重建；四条本机流程各取得独立7请求／2移动回执。实际微信和物理手机仍未验收，Page证据为Node原生API形状端口。[验证](validation.md#stage290-legacy-material-compat)

**已确认缺口**：当前实际包没有 `bin/PUK2/cutdat/23.cut`，原创模式1地图因必需文件缺失失败；模式0地图有正向流程，两种结果分别保留。后续需定位真实CUT来源及版本，再验收该模式。缺少可选V2与整套版本对应仍不等于当前正式客户端可玩。

**核验器修正**：初版将低于1000的保留索引交给普通绘制计划，随后又将物理记录像素当作重复索引的最终像素，分别触发范围拒绝和像素不一致。现已按已有合同区分直接精灵与普通绘制、物理行与最终槽位；144份物理像素、136次库绘制均匹配，产品代码未改。实际表有510次同组覆盖，打包必须保留原文件字节及记录顺序。

其他RID／自身／混合／空目标／停止、完整调度和UI、现行交接、真实平台及官方验收继续保留。[后续](development-plan.md#stage290-legacy-material-compat) · [完整目标](../analysis/game-legacy-material-compat-v1/goal-audit.json)

<a id="stage289-legacy-resource-archive"></a>

## stage289 资源包入口修复与剩余适配

**已修复的本地路径**：游戏Page不再借用更新器64条目／32MiB整包读取；新增专用懒读取资源所有者。超过1,000文件、约2.55GB实际材料的全文件完整性和范围读取已通过。旧更新器仍保留原合同，不能将游戏新预算套用到更新包。[证据](../analysis/game-legacy-resource-archive-v1/source-check.json) · [验证](validation.md#stage289-legacy-resource-archive)

**仍待验证**：实际wx选择器、存储容量、临时文件寿命和大文件位置参数；目前只有Node形状端口和实际本机文件读取。官方wx文档页本轮工具访问不可用，没有据此推定设备上限。移动网页为触屏模拟，尚无物理手机验收。大Deflate图形库的冷读取需完整扫描；提供的存储型ZIP适合已验证的随机读取路径。

多份模块造成安装根不唯一时需显式rootPrefix，网页暂未提供多根选择；带前缀且ZIP64扩展记录超过尾部搜索窗的组合不在覆盖内。实际材料的整套版本匹配、完整调度、107提示语义、未闭合RID／混合／空目标／本地停止、其余玩法及现行交接仍在范围内，37项原始需求和10个未完成组未缩减。[后续](development-plan.md#stage289-legacy-resource-archive) · [目标](../analysis/game-legacy-resource-archive-v1/goal-audit.json)

<a id="stage288-legacy-battle-audio"></a>

## stage288 音频边界与整套资源ZIP缺口

战斗声音现已接入两端本地输出；固定目录、同编号去重及声道衰减已验证。完整原生应用的声音更新顺序、受保护环境循环声音、设置变更及真实设备听感仍未验收。当前适配层按已呈现战斗帧推进更新，慢读取的过期声音会被丢弃。[验证](validation.md#stage288-legacy-battle-audio)

**新确认问题**：小程序整套资源导入复用了更新器ZIP解码器，仍受 `LAUNCHER_UPDATE_LIMITS.entries=64` 约束。首次全目录合成音频包还含同路径别名，去重为260个文件后仍超出此配置；本轮产品验证只选择21个需要的音效文件，未修改旧解码器。后续应建立整套游戏资源的独立导入合同并验收，不将有限夹具通过写成完整资源包可用。[现有解码器](../shared/launcher-update.mjs) · [后续](development-plan.md#stage288-legacy-battle-audio)

107提示语义、未闭合RID／混合／空目标／本地停止、完整玩法与调度、现行交接及真实平台继续保留。37项原始需求、10个未完成消费者组没有缩减。[目标核对](../analysis/game-legacy-battle-audio-v1/goal-audit.json)

<a id="stage287-legacy-battle-detached-rid"></a>

## stage287 RID路由与等待边界

106带2000的RID已接入，前提为登记槽0存在。原结果会把元数据交给施法者、资源设0、向槽0显示573b，线上amount在此零元组分支不结算HP；原动作尾决定自然完成或继续等待。本轮29种轨迹有28种按原等待恢复，未将其列为自然完成。[规格](logic-protocol-spec.md#stage287-legacy-battle-detached-rid)

无2000的106 RID会使用后缀槽−1；低等级116 RID的循环可跳过结束项并超过200行存储；401自身效果仍把效果行作为身体索引。原查找内容／动态结果未观察，继续拒绝。槽0排队后被删除时会显式失败，不能当作已完成的回合。

新独立方程按原200格读取动作，验证结束标记之后的零格及旧50动作；历史生成器／向量保持。当前网页证据使用实际桌面Chromium及移动触摸仿真；Page为Node主机。stage286将网页概括为Node测试主机的措辞由此澄清，真实微信及物理手机仍待验收。[验收](validation.md#stage287-legacy-battle-detached-rid) · [后续](development-plan.md#stage287-legacy-battle-detached-rid)

<a id="stage286-legacy-battle-impact-skills"></a>

## stage286 分身存储、隐藏几何与原等待

106与低等级116的独立结果身体只复制基元组，RID后三行没有同样复制；当前以 `impact-skill-detached-RID-storage`拒绝。4的结果身体资源为0，特殊20000000偏转需要的图像几何未观察到，以 `impact-skill-hidden-deflection-geometry`拒绝。空列表运行上下文继续单列，均验证拒绝前后的身体和动画状态相同。[规格](logic-protocol-spec.md#stage286-legacy-battle-impact-skills)

自身4／111／116可进入原等待：独立模型保留540次前缀，真实管理器另在第7,207次回调恢复。97倒地目标沿源离场，有限轨迹延长到572次并自然完成，不列为等待恢复。401自身效果仍有已有未实现分支，旧负例已改为其准确语法，保留零HP／MP更新和回合0断言。

本轮修正两处来源解释：109烟雾用动画drawOffsetY/2，97火花工厂未写父指针。发现后者时主动中断首轮回归并保留回执，完成修正后重跑定向、构建、源码／生成回放和产品入口。随后完整回归3,566项中发现1条旧负例回执仍标116，修正为401后，三条真实TCP负例及最终全量重新通过。独立身体的辅助计数也已限定22个登记槽。[验收](validation.md#stage286-legacy-battle-impact-skills) · [后续](development-plan.md#stage286-legacy-battle-impact-skills)

<a id="stage285-legacy-battle-upper-skills"></a>

## stage285 信息格式与原等待边界

107的成功printf把整个装箱对象作为可变参数传入，两个数字读取的是对象表指针和编码字；不能将它宣称为已还原的正常生命／法力提示。当前成功只提供标记明确的已有C值观察，失败只提供名字，产品信息文本仍未验收。[来源](../analysis/game-legacy-battle-upper-skills-v1/source-check.json)

117对自身或重复目标的动作0可等待；独立模型保留520次等待前缀，真实管理器另验证第7,207次回调通过既有恢复完成。112的空目标、本地244停止及更多混合元数据组合仍待继续核对。1004是残影开关，533c54是背景震动上限；不按冷却或主状态解释。

首轮全量3,496项中有1个旧负例仍将108当作未实现；现已改为语法确认的116，并保留不扣费、不结算断言。六项相关负例和最终全量回归通过，首轮失败回执保留。完整玩法及实际平台继续推进，37项需求和10组保持。[验收](validation.md#stage285-legacy-battle-upper-skills) · [下一步](development-plan.md#stage285-legacy-battle-upper-skills)

<a id="stage284-legacy-battle-skill99"></a>

## stage284 状态语义、持久图标与清理修复

此前SKL99落入普通物理未实现分支。现已沿99–104状态生产者接入，不赋予伤害含义。原图标存在时不替换，C零值不保证清空高位或删除图标；按原清除掩码保留这些行为，不能按常见规则改成统一刷新。[来源](../analysis/game-legacy-battle-skill99-v1/source-check.json)

共有动作37原应推进三次动画，旧实现只推进两次，现已更正；46项既有状态测试与22项新增测试通过。上一轮无效变体解析的冻结数组清理问题已修复，返回原 `LEGACY_BATTLE_MOTION_OPCODE`。真实入口夹具继承完整资源基线及角色查询资源，不用局部档案替代入场材料。[回执](../analysis/game-legacy-battle-skill99-v1/validation.json)

剩余技能、完整玩法、现行交接与实际平台继续推进，37项需求和10个消费者组保持未整体完成。[下一步](development-plan.md#stage284-legacy-battle-skill99)

<a id="stage283-legacy-battle-self-flags"></a>

## stage283 标志范围、原等待与参考模型修正

此前自身位白名单拒绝了已存在的冲击／反应／旋转消费者及限定范围不透明位。现已按消费者掩码透传完整字，未扩大字段、资源或角色容量。同步修复259类等级9标记额外清零第四格的问题；独立比较在该场景首先检出差异。[来源](../analysis/game-legacy-battle-self-flags-v1/source-check.json)

原独立模型把动作29退出的 `0x4199b0` 误写成阵型角度重算，现按REA改为当前角度八方向映射。15种独立前缀仍未结算；38种完整实现回调中37种经7203次观察恢复，反射组合自然完成。真实入口按回合1和心跳验收，不能以HP／MP变化代替完成。[回执](../analysis/game-legacy-battle-self-flags-v1/validation.json)

新发现的待修问题：无效SKL变体4解析失败后，清理逻辑试图缩短已冻结字段数组，返回 `TypeError` 并遮盖原解析错误。已保存本机复现，本轮未改解析器；有效协议路径的全量回归另行通过。完整玩法、未实现类别、现行交接与实际平台继续推进；37项需求和10个消费者组保留。[下一步](development-plan.md#stage283-legacy-battle-self-flags)

<a id="stage282-legacy-battle-self-guard"></a>

## stage282 自身护卫等待与验证口径

此前入口统一拒绝普通自身护卫标志；现已按原重定向／释放顺序接入。独立原版方程中的四种角色重合场景在320次回调后仍忙碌，不能把它们强行写成正常命中、提前结算或自动停止。独立实现的49种场景均经原等待恢复，在第7203次观察恢复事件后完成回合。[来源](../analysis/game-legacy-battle-self-guard-v1/source-check.json) · [回调回执](../analysis/game-legacy-battle-self-guard-v1/validation.json)

产品本地测试保持真实等待和心跳，并等待回合1；HP未变化和费用已扣除本身不能作为完成条件。缺失角色、访问器与合并容量的原子拒绝另有断言。未改VM或重复原程序动态观察。[验收](validation.md#stage282-legacy-battle-self-guard)

剩余自身结果位、其他消费者、完整玩法、现行交接与真实平台仍待验收。37项原始需求与10个未完成消费者组保留；知识库查询缺需求索引角色，沿用仓库索引。[下一步](development-plan.md#stage282-legacy-battle-self-guard)

<a id="stage281-legacy-battle-self-metadata"></a>

## stage281 自身元数据与测试参考修正

普通自身元数据的统一拒绝已补齐所选范围。初始测试把RID命中时游标统一期待为4，并遗漏259类等级9的前置瓦片元组；原辅助函数只先推进3，反射才额外前进。期望已按原版来源修正，精确元组断言保留。[来源](../analysis/game-legacy-battle-self-metadata-v1/source-check.json)

连续RID的首个原创资源100041没有攻击信号，不能期待随后伤害或元数据自动执行。现同时覆盖无信号等待恢复、有信号继续结算两条路径，并独立解析全部八个方向证明信号差别。初始两组失败和旧负例回归失败分别保留。历史负例改用仍未支持的 `0x10000` 等标志；新增正例承担本轮已支持标志的验证。[回执](../analysis/game-legacy-battle-self-metadata-v1/validation.json)

自身护卫别名、其他特殊标志、完整玩法、现行交接与真实平台仍待验收。37项原始需求与10个消费者组未整体完成；知识库查询缺需求索引角色，本轮沿用仓库索引。[下一步](development-plan.md#stage281-legacy-battle-self-metadata)

<a id="stage280-legacy-battle-reentry"></a>

## stage280 第二次移动期望与到达时机

实际产品第二场本地 TCP 缺口已补齐，12条流程通过。最初两个 Page 探针均完成第二场数据更新、技能结算和退出，随后因移动期望失败；失败回执保留。第二次诊断确认测试端期待旧起点2,3，实际请求为4,3：首场虽已发送两条请求，角色尚在途中，新战斗便开始。[诊断回执](../analysis/game-legacy-battle-reentry-v1/validation.json)

最小修复只在测试：首场移动后等待64次实际帧更新，再使用独立坐标／移动参考确认下一次相同屏幕点击从5,3前往8,3，两条请求坐标5,3和7,3。不能把请求已发送视作移动已到达，也不能复用初始摄像机生成下一段期望；未放宽精确请求断言，产品代码无需更改。[来源与参考](../analysis/game-legacy-battle-reentry-v1/source-check.json)

剩余自身资源／状态元数据、护卫别名、完整玩法、现行交接和真实微信／手机仍待验收。37项原始需求与10个未完成消费者组保留，知识库查询缺需求索引角色，本轮沿用仓库索引。[下一步](development-plan.md#stage280-legacy-battle-reentry)

<a id="stage279-legacy-battle-self-control"></a>

## stage279 自身控制路径与测试等待条件

普通自身控制位的统一拒绝已扩展至已核对范围。普通倒地／散开可能仍等待恢复，反射可释放后续动作，主控244停止时回合不递增。不能把这些场景统一按自然结束处理；161 种回放的四类结果及下一场组件复用已核对。[来源](../analysis/game-legacy-battle-self-control-v1/source-check.json) · [验收](validation.md#stage279-legacy-battle-self-control)

自动退出场景保持 MP7，早于 HP 命中时便满足旧费用等待条件，首轮断言因此过早。已额外等待预期 HP，再检查完整快照。测试端还曾匹配提前退出请求却漏计 `battle_exits`，已在接受该请求处计数，保留原请求总数与退出断言。两次失败记录均保留；修正后四条自动退出流程在测试端发送结束指令前收到真实退出请求。[诊断与回执](../analysis/game-legacy-battle-self-control-v1/validation.json)

历史类别95拒绝夹具改用仍未支持的 `0x400`，新增正例承担本轮已支持的蓄力覆盖。资源／状态元数据、护卫别名、产品第二场、完整玩法、现行交接和真实平台仍待验收。37 项原始需求、10 个消费者组保留；知识库查询缺需求索引角色，本轮沿用仓库索引。[下一步](development-plan.md#stage279-legacy-battle-self-control)

<a id="stage278-legacy-battle-self-special"></a>

## stage278 自身反射不能合并推进

普通自身 E000 结果的统一拒绝已移除至有来源支持的位范围。反射对同一身体仍推进两次，并前进元组；去重会使后续命中、81 类额外治疗或自然结束消失。28 种原创场景自然结束，其余 133 种使用原有等待恢复，不能把两者写成同一种结果。[来源](../analysis/game-legacy-battle-self-special-v1/source-check.json) · [验收](validation.md#stage278-legacy-battle-self-special)

初次回放对 81 类只预期 HP 58，遗漏反射后可执行的额外治疗；已补查动作 155，预期改为 65，未修改其消费者。首轮反射产品测试的退出回执含心跳数 0，测试调用漏开对应检查；修正调用后四条反射入口通过，原有回合、费用和移动断言保留。首轮全量运行期间发生这一测试输入变化，因此未作为最终冻结输入验收；保留记录并重新运行全量。[诊断与回执](../analysis/game-legacy-battle-self-special-v1/validation.json)

自身蓄力、散开及资源元数据、完整玩法、现行交接和实际平台仍待验证。37 项原始需求、10 个消费者组保留。知识库查询缺项目需求索引角色，本轮沿用仓库索引，没有改动 VM 或知识库。[下一步](development-plan.md#stage278-legacy-battle-self-special)

<a id="stage277-legacy-battle-self-family"></a>

## stage277 自身预检修正及验证边界

技能 6 自身结果曾在预检阶段误要求 MP 样式 3 数字，实际结果却因目标别名清除类别而使用 HP 样式 6；已复现并修正。普通自身路径新增 17 类基础支持，特殊结果仍按具体证据处理；本轮 32 种回放均触发既有等待恢复，不能列为自然结束。[来源](../analysis/game-legacy-battle-self-family-v1/source-check.json) · [验收](validation.md#stage277-legacy-battle-self-family)

新验证发现，Page 主机筛选值写成 `wechat-page` 时，Node 仍可能给未注册场景的文件返回成功。六次空场景结果已剔除，改用 `wechat` 重跑；验收同时要求实际场景日志、回合 1、请求回执和恢复移动。另一次回放断言遗漏了读取 M 前的初始类别 `-1`，已按真实初始化补回断言，没有改运行状态。[诊断与回执](../analysis/game-legacy-battle-self-family-v1/validation.json)

37 项原始需求、10 个消费者组和完整玩法／现行交接／实际平台缺口仍保留。TalonBrain 查询缺项目需求索引角色，本轮复用仓库索引；没有改动知识库或 VM。[下一步](development-plan.md#stage277-legacy-battle-self-family)

# 已知限制与下一步

<a id="stage276-legacy-battle-self-pair"></a>

## stage276 普通自身结果的等待及 Page 回合证据

已开放 0／1／3 的基础自身结果，其他自身类别和特殊结果继续按现有能力边界处理。自身命中推进同一身体到动作 0，十种原创场景均经过既有 7200 计数恢复；这是本地源逻辑回放结果，未列为自然完成。先自后他的后续目标保持 70，初始“后续仍命中”的测试预期已按原版目标状态写入修正。[来源](../analysis/game-legacy-battle-self-pair-v1/source-check.json) · [验收](validation.md#stage276-legacy-battle-self-pair)

通用 Page 退出谓词此前检查血量和费用，未单独要求回合计数。新增断言进一步发现 `weChatBattleView` 漏传底层已有的 round 字段；修正显示适配器后，四条新 Page 流程已按 `round===1` 重跑并记录结果；其他历史 Page 的血量／费用记录不能单独当作回合计数证据。真实平台和原版动态仍待验证。[验收明细](../analysis/game-legacy-battle-self-pair-v1/validation.json)

施法附加 RID 的已解码入口继续由统一封装处理，未拥有输入的底层拒绝保留。SKL402 空侧的原版运行时查表仍未验证，继续拒绝；未把这些现有边界当作新的已实现能力。[开发顺序](development-plan.md#stage276-legacy-battle-self-pair)

<a id="stage275-legacy-battle-weather-targets"></a>

## stage275 重复效果拒绝已移除，自身元组边界保留

原版逐次追加到同一目标身体，旧 `skill401-repeated-effect-target` 统一拒绝现已移除。重复目标的播放数量取决于动作读指针：两次带效果只播放一个 30 次组，三次可能没有效果；这些排列的剩余等待走已有 7200 计数恢复，没有注入额外推进。[来源](../analysis/game-legacy-battle-weather-targets-v1/source-check.json) · [验收](validation.md#stage275-legacy-battle-weather-targets)

先普通后效果能自然完成，但排空时仍有四个效果，需要后续回调清理。自身带效果会把效果资源混入自身目标队列，现有静态路径缺少有效身体槽上下文，继续显式拒绝；不能将该边界描述为已完成的自身效果玩法。[规格](logic-protocol-spec.md#stage275-legacy-battle-weather-targets)

原版动态、现行版交接、完整玩法和真实平台仍待推进，37 项原始需求与 10 个未完成组均保留。[开发顺序](development-plan.md#stage275-legacy-battle-weather-targets)

<a id="stage274-legacy-battle-pursuit-linked"></a>

## stage274 图形零旧断点和长等待心跳

SKL400 的 `skill400-linked-result` 已由实际消费者替代，不完整组仍显式拒绝。隐藏资源使四种原创场景走既有 7200 计数恢复，不能称为自然完成。施法者的元数据赋值和动画隐藏相差一次调用，是实际遍历顺序，未强行同步。[来源](../analysis/game-legacy-battle-pursuit-linked-v1/source-check.json) · [验收](validation.md#stage274-legacy-battle-pursuit-linked)

初次全量检查有六项仍期待图形 0 抛错；按原文件核对动画分支后，更新为隐藏绘图。历史独立向量未重生成，原绘图前状态继续核对。首次新 TCP 流程漏计约两分钟等待产生的心跳；测试端现仅接受已知心跳字节并计入总数，四条均为 13 个请求。没有更改产品计时、等待阈值或会话策略。[实施及复现](../analysis/game-legacy-battle-pursuit-linked-v1/implementation-plan.json)

原图形 0 后端像素、原版动态、现行版交接和实际平台验收仍未完成。下一步核对 SKL401 的自身／重复效果消费者及其余需求。[开发顺序](development-plan.md#stage274-legacy-battle-pursuit-linked)

<a id="stage273-legacy-battle-pursuit-targets"></a>

## stage273 重复目标已支持，自身等待单独记录

原来的 `skill400-repeated-target` 拒绝分支已移除。原版逐次追加到同一身体，现有实现按此累积队列；重复远端和交错场景自然完成。重复自身留下等待头，经过既有 7200 计数恢复后返回原位，未标为自然结束。[来源](../analysis/game-legacy-battle-pursuit-targets-v1/source-check.json) · [验收](validation.md#stage273-legacy-battle-pursuit-targets)

提示分支在回合排空时可能仍有飞行效果，不能用回合计数推断效果已全部释放。本轮补齐后续清理及退出入口验证。`0x800000` 关联资源、完整玩法、原版动态、现行版和实际平台仍待推进。[开发顺序](development-plan.md#stage273-legacy-battle-pursuit-targets)

<a id="stage272-legacy-battle-round-ack"></a>

## stage272 已修正 RID0 新槽的 A 标记漏报

症状是 B 已登记到槽 5、C 行仍为空时，`A|20|0|` 的 `markedSlots` 返回空。根因为接收器以 C 元数据判断身体存在。失败用例已保存；改用当前身体查询后通过。原先已配置输入的路径会应用身体掩码，因此此次修正不宣称补回缺失的身体动画效果。[修正及复现](../analysis/game-legacy-battle-round-ack-v1/validation.json)

新 P 候选席位不立刻替换当前操作席位；未来 A 也不在旧回合立即打标。这两种等待均与原版来源和正常入口一致。完整 SKL／玩法、原版动态、现行版和实际平台仍待推进。[开发顺序](development-plan.md#stage272-legacy-battle-round-ack)

<a id="stage271-legacy-battle-character-queue"></a>

## stage271 C 在途时序的验证范围

已补齐正常消费者的 C 更新、移除、结束、三条排队记录顺序和环绕证据。此前直接修改身体的中途交接测试属于较低层合成干预；通常的 C 接收在当前回合完成后才改动身体。本轮未发现核心调度故障。[规格](logic-protocol-spec.md#stage271-legacy-battle-character-queue) · [验收](validation.md#stage271-legacy-battle-character-queue)

源码夹具明确观察到从槽 10 指向槽 2 的回程投射物节点后注入 C；TCP 夹具在施法的 MP 扣费状态提前发送下一回合消息，Page 未暴露原始投射物节点。两层证据分别记录。提前 A/P 的全部时序、无信号或零反射总量的阶段 2 等待、完整玩法、原版动态、现行版和实际平台仍需推进。[开发顺序](development-plan.md#stage271-legacy-battle-character-queue)

<a id="stage270-legacy-battle-exit-rid0"></a>

## stage270 致死反射与 B 占用施法槽的结论

上轮 B 占用施法槽的 440 次观察尚未覆盖回合末尾。延长回放后确认，B 在第 447 个回调回收，448 排空回合。本地致死反射进入 244 后，通过主流程退出并释放待处理 RID0，下一场可重新入场。远端致死主体离场时也会清理交接对象。[源证据](../analysis/game-legacy-battle-exit-rid0-v1/source-check.json) · [生命周期验收](validation.md#stage270-legacy-battle-exit-rid0)

原版动态、回程在途时的真实 C 更新和移除、现行版、手机真机、微信运行时与官服仍待验收。无信号反射与零反射总量的 phase2 等待继续保留已测边界。[开发顺序](development-plan.md#stage270-legacy-battle-exit-rid0)

<a id="stage269-legacy-battle-reflected-rid0"></a>

## stage269 反射资源卸载后的交接中断

合成回放的反射回程先在第 91 个回调卸载坐骑，旧共享实现随后在第 156 个回调报 `LEGACY_BATTLE_ATTACHED_RID_CHILD_REMOVED`。现在在卸载期间隐藏已准备的动画对象，第 156 个回调按有效元组恢复，随后完成 RID0。源身体离场的回收也已验证。该动画恢复属于独立实现，原版动态结果继续验收。[源证据](../analysis/game-legacy-battle-reflected-rid0-v1/source-check.json) · [回放验收](validation.md#stage269-legacy-battle-reflected-rid0)

无信号反射与总量为零时，phase2 在 440 个合成回调内持续等待。致死反射的本地夹具进入 244 后仍有待处理交接。RID0 的 B 占用施法槽时，回程读取当时登记的 B，有限回放尚未排空。这些分支继续核对。[开发顺序](development-plan.md#stage269-legacy-battle-reflected-rid0)

<a id="stage268-legacy-battle-casting-rid0"></a>

## stage268 无信号施法后的元组位置

旧共享回放在动作 221 从终止行读到 `[0,0]`，分槽场景第 14 个回调出现 `LEGACY_BATTLE_ATTACHED_RID_CHILD_REMOVED`。同槽场景读出的槽号恰好正确，游标对照才揭示错误。现按实际排入的 221 四元组与队列归属校验并恢复。无信号且有目标的合成回放仍需既有等待清理才能结束。[回放验收](validation.md#stage268-legacy-battle-casting-rid0)

原版无信号交接及反射中间队列待查。此前授权的 Windows WER 诊断已在 stage131 执行并恢复，后续离线栈核验保存在既有记录。当前旧版协议回放与现行版兼容分开验收。[WER 记录](vm-environment.md#stage131) · [开发顺序](development-plan.md#stage268-legacy-battle-casting-rid0)

<a id="stage267-legacy-battle-rid0-flight"></a>

## stage267 下降中 B 清空或换人

普通同槽 221 多帧下降现在可完成。B 在分槽时清空，仍登记的 A 在下一回调落地。A、B 同槽已清空时，回收旧父身体、骑乘对象和未登记的 A。B 换人且有有效登记时，读取替换者的附着点并按原落地顺序处理。[验收](validation.md#stage267-legacy-battle-rid0-flight)

中途槽位变更由共享回调层注入。真实 C 到达时序、SKL19 的尾随元组、已倒地或离场的原主体、原版动态、现行版、真机、微信运行时和官服待验收。当前缺测试账号。[开发顺序](development-plan.md#stage267-legacy-battle-rid0-flight)

<a id="stage266-legacy-battle-rid0-ownership"></a>

## stage266 移交后的槽位边界

父身体在 B 已登记且 A 待登记时移除，本地回放已释放待登记的 A 和容器。保留 B 的回放在等待超限后完成归位。同槽新 B 的回放保留替换身份和数值。首配或异槽 A 的空闲交接也经同一等待器收尾。[本地验收](validation.md#stage266-legacy-battle-rid0-ownership)

当前共享入口在阶段 2 消费 C，本轮在共享回调层注入父身体移除。B 槽在父身体仍执行 221 时先被移除或覆盖、倒地或离场的原主体、真实 C 到达时序仍待核验。原版动态、现行版、手机真机、微信运行时及官服待验收，当前缺测试账号。[入口](../shared/legacy-game-battle-entry.mjs) · [开发顺序](development-plan.md#stage266-legacy-battle-rid0-ownership)

<a id="stage265-legacy-battle-rid0-interruption"></a>

## stage265 交接开始前后的离场边界

父身体在 221 前离场时，本地回放已回收尚未注册的两具身体和容器。同槽替换后的 HP、MP 以及逐笔结算已复核。回收是共享实现的所有权处理，原版完整清理路径仍待核对。[源核验](../analysis/game-legacy-battle-rid0-interruption-v1/source-check.json) · [验收](validation.md#stage265-legacy-battle-rid0-interruption)

首配缺席、其他 A 槽、倒地或正在离场的原主体，以及动作 221 写入 B 后的离场仍待核验。原版动态、现行版交接、手机真机、微信运行时及官服待验收。当前缺测试账号。[开发顺序](development-plan.md#stage265-legacy-battle-rid0-interruption)

<a id="stage264-legacy-battle-rid0-receive"></a>

## stage264 交接覆盖与离场边界

RID0 提前覆盖一个尚未出手的受击身体时，已证实可解除该身体的后续等待。已起步的旧身体仍可在被覆盖后完成命中。主动移除准备交接的原身体时，本地回合可继续结束，已准备但未执行的 RID0 对象仍留在回放内。[本地探针](../analysis/game-legacy-battle-rid0-receive-v1/validation.json)

父身体提前离场的交接对象生命周期、缺席中断后的尾随游标和更多复合来源待核验。现行版交接、手机真机、微信运行时及官服待验收，当前缺测试账号。[开发顺序](development-plan.md#stage264-legacy-battle-rid0-receive)

<a id="stage263-legacy-battle-following-results"></a>

## stage263 资源重启信号和尾随 RID0

原创夹具在内联 RID 更换攻击者资源后观测到动作 14 重启。此前第二次读取会越过结果副本并丢失下一笔攻击。当前受追踪结果凭副本位置识别已交付的信号，回合可正常完成。该组合在原版的实际帧序仍待验证。[回放](../analysis/game-legacy-battle-following-results-v1/validation.json)

尾随 RID0、缺失身体、额外护卫和击飞等不同来源的交接需要各自的证据。真机、微信运行时、现行版交接及官服待验收，当前缺测试账号。[开发顺序](development-plan.md#stage263-legacy-battle-following-results)

<a id="stage262-legacy-battle-late-recipient"></a>

## stage262 后续受击与发送者离场边界

先排入攻击的角色收到有效命中后，普通回合可按已交付的受击位置完成。首个发送者在命中前离场，仍在场的第二个发送者可接续。唯一发送者在命中前离场的探针仍通过原超时归位结束。[回放](../analysis/game-legacy-battle-late-recipient-v1/validation.json)

带特殊结果标记、附带 RID 的同类交接、原版运行、手机真机、微信运行时、现行版交接及官服待验证。当前缺测试账号。[开发顺序](development-plan.md#stage262-legacy-battle-late-recipient)

<a id="stage261-legacy-battle-independent-following"></a>

## stage261 独立攻击队列的归位范围

前两条探针中，主施术者已经结束而独立攻击者仍停在动作 0、队列首项 24。共享客户端现可在相关队列都停止推进后提前归位，保留已结算的伤害与两笔 MP 扣减。存在后续受击引用的对照仍在第 7,507 个回调才结束。同槽替换的对照保留新身体数值和普通等待边界。[回放](../analysis/game-legacy-battle-independent-following-v1/validation.json)

独立攻击者后来成为受击者的起步顺序、特殊结果、原版运行、手机真机、微信运行时、现行版交接及官服待验证。当前缺测试账号。[开发顺序](development-plan.md#stage261-legacy-battle-independent-following)

<a id="stage260-legacy-battle-missing-lookahead"></a>

## stage260 提交前目标离场已恢复的范围

首段和后续护卫的前瞻目标被 PLV 移除后，本地探针分别在 247 和 208 个回调结束。两条输入的组内 CFP 都扣除 2 点 MP。计划仅允许已知会清理的身体暂时引用该缺席槽，保留队列的身体仍需有效前瞻目标。[回放](../analysis/game-legacy-battle-missing-lookahead-v1/validation.json)

独立攻击者队列首项为 24 而当前动作仍为 0 的路径继续待查。两条中断输入的原版组内游标与本地恢复有差异，原版运行、手机真机、微信运行时、现行版票据交接及官服还待验收。当前缺测试账号。[静态边界](game-static.md#stage260-legacy-battle-missing-lookahead) · [开发顺序](development-plan.md#stage260-legacy-battle-missing-lookahead)

<a id="stage259-legacy-battle-following-strikes"></a>

## stage259 执行中多击离场已恢复及提交前边界

一名护卫执行两次后续攻击时，护卫提前离场的原本地探针在第 1,050 个回调仍忙，修复后第 163 个回调结束。第一击落地后离场的探针第 688 个回调结束并保留第一击。两名护卫共用目标的常规回放也已结束。[验收](validation.md#stage259-legacy-battle-following-strikes)

原 M 中的 `PLV` 若先移除后续目标，SKL72 在提交前返回 `physical-family-lookahead-context`。含独立后续攻击者的探针仍停在当前动作 0，队列首项为 24。原版部分提交与首次激活路径、特殊结果标记、原版运行、真机、微信运行时、现行版交接及官服继续待核对，当前缺测试账号。[开发顺序](development-plan.md#stage259-legacy-battle-following-strikes) · [探针](../analysis/game-legacy-battle-following-strikes-v1/validation.json)

<a id="stage258-legacy-battle-repeated-protection"></a>

## stage258 重复保护已恢复及多击离场边界

同一角色先后被同一护卫或两名护卫保护时，修复前两个本地回合均在第 900 个回调仍忙。共享实现按归位后的动作 0 启动第二段，两种正数探针分别在第 538、530 个回调结束。带两次后续普通攻击的正常探针能结束，护卫在两击前离场时两个受击等待仍未释放。单条后续攻击的护卫或受击者离场已覆盖。[验收](validation.md#stage258-legacy-battle-repeated-protection)

特殊结果标记下的角色重合、无外部 RID 的旧版栈字段、原版运行、手机真机、微信运行时、现行版交接及官服仍待验证，当前缺测试账号。[开发顺序](development-plan.md#stage258-legacy-battle-repeated-protection)

<a id="stage257-legacy-battle-guard-wait"></a>

## stage257 已恢复的放行与剩余角色重合

槽 1 的正数外层护卫曾在受保护角色处于 62 时推进一次，使该角色留在 1。共享实现复测在下一回调放行，SKL113 外层护卫的本地探针于第 374 个回调自然结束。单护卫保护两个不同角色的普通 SKL72 已覆盖两次靠近、两次返回及一项数量为零的分支。同一角色被同一护卫重复保护的夹具在第 650 个回调仍忙，含后续护卫目标及特殊结果标记的共享组合仍待核对。[验收](validation.md#stage257-legacy-battle-guard-wait)

无外部 RID 的旧版栈字段、原版实战回调顺序、真机、微信运行时、现行版交接和官服仍待验证。当前缺测试账号。[开发顺序](development-plan.md#stage257-legacy-battle-guard-wait)

<a id="stage256-legacy-battle-skl113-wire"></a>

## stage256 SKL113 预读分界和外层护卫

一个 FF 的普通嵌套夹具在预读即截断，两个 FF 的夹具已有独立后续指令与可达同组续接。紧贴的同组标记会被吞掉首字节，预读尾部中更早出现的可识别命令也会触发提交前拒绝。较早结束时，预读附带 RID 与执行查找的位置存在冲突。[源证据](../analysis/game-legacy-battle-skl113-wire-v1/source-check.json) · [验收](validation.md#stage256-legacy-battle-skl113-wire)

正数外层结果与槽 1 护卫组合已触发嵌套 HP，受保护角色停在动作 1，回合经等待恢复结束。护卫在槽 12 的同数值对照自然完成。无外部 RID 的原版字段来源、原版动态、真实手机、微信运行时、现行版交接和官服仍待验证，目前缺测试账号。[开发顺序](development-plan.md#stage256-legacy-battle-skl113-wire) · [验收](validation.md#stage256-legacy-battle-skl113-wire)

<a id="stage255-legacy-battle-guard-alias"></a>

## stage255 同槽及提前退场复现与范围

旧实现的同槽自身结果和嵌套护卫启动前退场探针，在第 550 个回调仍等待。槽位复用探针曾推进新角色的动作游标。本轮在共享核心按原角色身份与已提交队列位置续接，复测确认新角色保有 HP 51，施法者 MP 为 5。真实 PLV 前置动作另行回归。[源证据](../analysis/game-legacy-battle-guard-alias-v1/source-check.json) · [验收](validation.md#stage255-legacy-battle-guard-alias)

原版同槽动态结果、护卫同时承担外层角色的所有组合、通用 266 近距离计数、SKL113 嵌套预读及缺少外部 RID 的原版栈值继续待核。微信运行时、真机、现行版交接与官服仍待验收，目前缺测试账号。[开发顺序](development-plan.md#stage255-legacy-battle-guard-alias)

<a id="stage254-legacy-battle-guard-departure"></a>

## stage254 施法者兼任护卫与启动前退场

独立护卫和受击角色兼任护卫均已通过实际第二趟飞行。施法者兼任护卫的探针在第 550 个回调仍等待。护卫启动前退场、普通返程近距离推进 216 的时序、SKL113 嵌套预读与无外部 RID 的原版栈值待核对。微信运行时与真机、现行版交接及官服待验收。[源证据](../analysis/game-legacy-battle-guard-departure-v1/source-check.json) · [验收](validation.md#stage254-legacy-battle-guard-departure)

<a id="stage253-legacy-battle-guard-release"></a>

## stage253 护卫本体与外部飞行的剩余路径

SKL72 的原目标退场已通过完整本机回合。护卫自身在动作 4 前后被直接移除的场景另行跟踪，当前补偿使用仍在场护卫的动作 71。存在飞行物时的 SKL266 护卫收尾、护卫与施法者同槽、SKL113 嵌套预读和没有外部 RID 时的原版栈内容待验证。微信运行时与真机、现行版交接及官服待验收。[源证据](../analysis/game-legacy-battle-guard-release-v1/source-check.json) · [验收](validation.md#stage253-legacy-battle-guard-release)

<a id="stage252-legacy-battle-physical-boundaries"></a>

## stage252 嵌套保护的后续动作与自身 RID

已核对真实 PLV 移除原目标后护卫从 4 继续到 42、71 和 10。原目标所拥有的后续放行链与整个护卫序列的自然收尾仍待验证。另跟踪 SKL113 嵌套预读、只有自身 RID 时的字段来源、原版终止索引和空槽运行结果。微信运行时与真机、现行版交接及官服待验收。[源证据](../analysis/game-legacy-battle-physical-boundaries-v1/source-check.json) · [验收](validation.md#stage252-legacy-battle-physical-boundaries)

<a id="stage251-legacy-battle-physical-registry"></a>

## stage251 物理技能的空槽边界

空护卫或空施法者可在 C 换表或动作 49 后出现，M 预约仍可能通过。共享命令已对核对过的解引用路径按解析边界续接。原版直接解引用后的进程状态、嵌套目标、只含自身结果的正变体和其他未闭合组合继续跟踪。微信运行时、真机、现行版交接和官服仍待验证。[源证据](../analysis/game-legacy-battle-physical-registry-v1/source-check.json) · [验收](validation.md#stage251-legacy-battle-physical-registry)

<a id="stage250-legacy-battle-assist-terminator"></a>

## stage250 协作者终止的原版与本地边界

共享续接已在本地验收。原版执行侧在协作者 `FF` 直接返回后的动态游标和角色忙碌状态仍待验证。变体 12 的有效协作者配空目标列表继续停在动作 84 前的预检。变体 7 的状态 32 伙伴换位后缺席已核对队列和阵位，实际原版回放、微信运行时与真机、现行版交接和官服仍待验收。[静态分析](game-static.md#stage250-legacy-battle-assist-terminator) · [开发顺序](development-plan.md#stage250-legacy-battle-assist-terminator)

<a id="stage249-legacy-battle-physical-missing"></a>

## stage249 物理角色缺席的剩余边界

空护卫和正变体空施法者的原版路径存在先解引用，保持预检。SKL260 带主护卫时的前置读取顺序与原版生产顺序差异继续按原证据保留。本轮验证了无主护卫的缺席链目标，以及 SKL266 保存自身回复与带护卫尾部的队列。更多护卫、保留队列和运行时回放组合、原版游标、微信运行时及真机、现行版交接与官服仍待验收。[静态分析](game-static.md#stage249-legacy-battle-physical-missing) · [开发顺序](development-plan.md#stage249-legacy-battle-physical-missing)

<a id="stage248-legacy-battle-family-missing"></a>

## stage248 技能中断的待验证范围

四个技能族的本地续接已验证。原版从中断字段扫描后续记录的行为、更多反射资源与特效回放组合、SKL98 协作者 FF 和动作 32 组合、物理技能的护卫及后续命中路径仍待核验。微信运行时、真机、现行版交接及官服仍待验收。此前 WER 诊断已在阶段 131 执行并恢复设置，游戏崩溃根因仍未确定。[静态分析](game-static.md#stage248-legacy-battle-family-missing) · [开发顺序](development-plan.md#stage248-legacy-battle-family-missing) · [WER 回执](#stage131-wer)

<a id="stage247-legacy-battle-missing"></a>

## stage247 缺席恢复的证据边界

共享层从验证过的记录边界接续，原版中途扫描和增加阶段的组合单独保留为静态观察。协作者 FF、动作 32 与缺席换位组合、异常游标触发的附带 RID、其他技能族缺席分支、微信真机、现行版交接与官服仍待核验。变体 12 的空目标列表仍在提交前返回依赖未满足。[静态分析](game-static.md#stage247-legacy-battle-missing) · [开发顺序](development-plan.md#stage247-legacy-battle-missing)

<a id="stage246-legacy-battle-status-assist"></a>

## stage246 协作者及目标缺席边界

变体 12、13 的协作者或目标缺席时，共享层在提交前返回依赖未满足。原样本的对应分支调用 `0x436930`，后续等待和记录边界待继续核验。变体 12 的动作 84 先取首目标，当前空目标列表同样在提交前返回依赖未满足。附在施法记录后的其他 RID 组合、原版渲染与声音、微信运行时、真机、现行版交接和官服待验收。[静态分析](game-static.md#stage246-legacy-battle-status-assist) · [开发顺序](development-plan.md#stage246-legacy-battle-status-assist)

<a id="stage245-legacy-battle-status-position"></a>

## stage245 换位边界与仍待核验项

变体 7 只在已建模角色体及附带 RID0 范围内验收。源样本在选中槽缺席时调用 `0x436930` 进入清理分支。当前共享实现遇到缺席目标会在提交前返回依赖未满足。变体 12、13 的额外槽消费者、其他附带 RID 组合、原版资源输出、真机、现行版交接和官服兼容均待核验。[静态分析](game-static.md#stage245-legacy-battle-status-position) · [开发顺序](development-plan.md#stage245-legacy-battle-status-position)

<a id="stage244-legacy-battle-status-slots"></a>

## stage244 剩余独立变体和特殊目标

变体 7 需要核对配对换位对本方槽、施法者槽和附属角色的影响。变体 12、13 需要闭合额外槽与各自结果消费。缺席目标在原版进入 `0x436930` 的游标与等待清理。变体 8 在施法者同时占本方配对目标时，缓存元组与施法读头的交互仍待取证。已通过的 RID0 路径是单条附加记录作用在施法者，其他组合继续验证。

[开发顺序](development-plan.md#stage244-legacy-battle-status-slots) · [验收](validation.md#stage244-legacy-battle-status-slots)

<a id="stage243-legacy-game-stream"></a>

## stage243 持续连接边界

阶段 242 触及的 10 秒整段时限已由旧版网页游戏入口的建立期时限解决。首轮专项测试发现保活定时器会推迟选角轮询，随后按最早期限重新调度。全量回归另发现加速时钟的回放会收到额外的空闲记录，现由正常游戏入口显式启用保活，底层回放端口默认关闭。

本轮覆盖前台浏览器及本机 Page 适配。浏览器后台定时、真机网络休眠与恢复、现行版交接和官服继续待验。SKL98 的五个独立变体及附带 RID 保留在需求索引中。

[验收](validation.md#stage243-legacy-game-stream) · [接续](development-plan.md#stage243-legacy-game-stream)

<a id="stage242-legacy-battle-status-variant"></a>

## stage242 独立变体及本机会话时限

SKL98 的 6、7、8、12、13 各走独立生产者，附带 RID 和目标缺席时的退场顺序也需继续取证。网页入口首轮在较长的战斗回放中触及本机桥 10 秒默认时限，验收夹具通过现有参数将本轮时限设为 45 秒。持续游玩仍需独立验证会话生命周期。原版素材及渲染、微信模拟器及真机、现行版交接和官服待验收。

[验收](validation.md#stage242-legacy-battle-status-variant) · [开发顺序](development-plan.md#stage242-legacy-battle-status-variant)

<a id="stage241-legacy-battle-summon"></a>

## stage241 SKL93 取证和运行边界

已接入固定旧版的空槽、占槽与重复槽位。施法者自身替换和未知状态位会返回明确的不可用结果。备用渲染配置在技能设置处返回 `LEGACY_BATTLE_SKILL_CONFIGURATION`，本轮本机验收使用常规配置。当前仍需补足原生渲染、其他战斗分支、微信真机和官服验收。

首轮入口已完成 SKL93 和战斗退出，但复用战斗前的移动目标时没有收到预期的第二组移动。重跑把移动留到退场后，独立对端核对了全部预期请求。

[本轮证据](../analysis/game-legacy-battle-summon-v1/validation.json) · [后续顺序](development-plan.md#stage241-legacy-battle-summon)

<a id="stage240-legacy-battle-city-return"></a>

## stage240 战斗回城的验收范围

固定旧版已接入战斗内回城。场景重建仍需要可用的地图块和角色数据。战斗退出时保留已接入的子状态 7 清理，尚未覆盖的战斗动作、全量原生系统行为和真实服务器时序继续跟踪。微信模拟器及真机、现行交接与官服待验收。

首轮微信入口测试卡在合成资源 ZIP 的标准输入。Python 采样停在读取，Node 停在同步子进程等待。夹具现用临时文件传递输入和压缩结果，设定超时并在完成后清理。该问题及重跑结果归入本轮验收。[夹具](../analysis/game-wechat-page-v1/page-test.mjs)

[开发顺序](development-plan.md#stage240-legacy-battle-city-return) · [运行验收](validation.md#stage240-legacy-battle-city-return)

<a id="stage239-legacy-city-return"></a>

## stage239 回城剩余分支

本轮两条普通地图路径已通过本机对端。若目标地图或本机角色数据不足，回城停在重建阶段，用户仍可从会话操作栏断开。战斗回城及地图更新交接接续至阶段 240。微信模拟器与真机、现行版本和官服待验收。[战斗回城](#stage240-legacy-battle-city-return)

[开发顺序](development-plan.md#stage239-legacy-city-return) · [运行验收](validation.md#stage239-legacy-city-return)

<a id="stage238-legacy-battle-alternate-exit"></a>

## stage238 注销回城及运行验收

固定旧版的注销回城会先发 `4}o`，再根据场景及战斗状态进入重建。普通地图与战斗的应答、缓存、重建和 type15 画面顺序仍待闭合。本轮实现的主动回选服结束后落在网页或微信 Page 的连接设置。微信模拟器与真机、现行版交接和官服均待验收。

[静态链路](game-static.md#stage238-legacy-battle-alternate-exit) · [开发顺序](development-plan.md#stage238-legacy-battle-alternate-exit)

<a id="stage237-legacy-music-phases"></a>

## stage237 音乐的覆盖范围

页面在连接操作时开始播放旧版选服曲，音频切换跟随已完成的战斗开场、退出捕获和场景重建。主状态 1 的前置音乐、其他效果音和战斗退场分支继续取证。现行交接、微信模拟器与真机输出、官服仍待验收。

[阶段范围](development-plan.md#stage237-legacy-music-phases) · [验收](validation.md#stage237-legacy-music-phases)

<a id="stage236-legacy-audio"></a>

## stage236 音频覆盖范围

阶段 236 首先接入固定旧版的已知 `TfD` 曲目和 `VKW` 音效 60。默认音乐播放按 22,050 Hz 的源频率设置，分档音量转换为 Web Audio 增益，零档静音。当前将曲目解码到内存，渐隐由宿主定时推进。缺失文件、资源超过边界或平台音频接口不可用时，页面继续提供游戏与退场操作。

原生缓冲的播放时序、其他声音触发、微信模拟器和真机输出、现行交接及官服仍待验收。[阶段范围](development-plan.md#stage236-legacy-audio) · [验收](validation.md#stage236-legacy-audio)

<a id="stage235-legacy-server-return-fade"></a>

## stage235 退场画面覆盖范围

当前实现使用固定旧版的 640×480 游戏画面。尺寸不同或未取得画面时仍可直接确认退出。原生显示填充和其他退场结果仍需取证。微信模拟器、真机、现行交接和官服仍待验收。

[阶段范围](development-plan.md#stage235-legacy-server-return-fade) · [验收](validation.md#stage235-legacy-server-return-fade)

<a id="stage234-legacy-server-return"></a>

## stage234 退场覆盖范围

固定旧版服务端主动通知已进入真实会话关闭流程。原生主 7 的退场动画、音效和其他结果分支仍需接入，主 10 子状态 9 和条件退场的触发来源仍需验证。微信模拟器、真机、现行交接和官服仍待验收。

[阶段范围](development-plan.md#stage234-legacy-server-return) · [验收](validation.md#stage234-legacy-server-return)

<a id="stage233-legacy-frame-startup"></a>

## stage233 普通启动配置的证据范围

已覆盖固定旧版主状态 9 的普通地图帧及新角色初值。其他原生模态、复合动作与阶段切换仍按各自的证据判断。现行客户端交接、微信模拟器、实体设备和官服验收仍开放。

[阶段范围](development-plan.md#stage233-legacy-frame-startup) · [验收](validation.md#stage233-legacy-frame-startup)

<a id="stage232-legacy-ordinary-context"></a>

## stage232 普通输入的支持范围

普通源配置覆盖场景移动和已接入的对话及交易门。Win32 特有叠层、包装状态的其余写入、完整帧与角色上下文仍待分析。地砖时段依赖本次会话的 `@Qu` 时间锚点。

现行游戏交接、微信模拟器与真机、官服仍待验收。

[范围和验收](validation.md#stage232-legacy-ordinary-context)

<a id="stage231-legacy-display-startup"></a>

## stage231 显示选择的验收范围

源显示选择覆盖固定旧版普通画幅、投影、入场及位置修正。旧版窗口消息、渲染设备和动态强制绘制事件仍待核对。

微信真实运行、实体手机和官服继续等待各自验收。现行游戏交接仍需同版本消费者证据。

[运行验收](validation.md#stage231-legacy-display-startup)

<a id="stage230-legacy-config-startup"></a>

## stage230 配置读取与剩余启动上下文

命令尾模式中的 Config.dat 负责已支持的资源参数。显示设备、音频、原版窗口和其他启动状态仍待核对。微信换包后需要重新选择依赖资源配置的启动 JSON。

固定旧样本已完成本机入口验收。现行票据消费、微信模拟器与真机、官服仍待验证。

[范围与验收](validation.md#stage230-legacy-config-startup)

<a id="stage229-legacy-startup-materials"></a>

## stage229 启动材料与平台验收

v2 按长度和 SHA‑256 核对旧版模块。现行更新包里同名的 `cg_se_6000.exe` 为另一份样本，文件检查会拒绝。映射票据和上下文由启动材料提供，现行登录到游戏的交接仍待取证。

本轮完成网页和微信构建产物的本机验收，微信实际运行与真机待验。上轮 DevTools 自动化入口返回服务端口关闭。

[本机验收](validation.md#stage229-legacy-startup-materials) · [上轮 DevTools 状态](#stage228-wechat-special-dialogs)

<a id="stage228-wechat-special-dialogs"></a>

## stage228 特殊对话和图像的本机验收范围

**事实**。双字段输入按共享字节规则校验。外观预览使用当前资源包中可识别的图像。缺图时仍能阅读和回复，窗口关闭后旧绑定失效。

**运行检查**。本轮 DevTools 自动化入口返回服务端口关闭，生成包未进入模拟器。模板编译与本机页面测试均通过。

**待验证**。原版复合外观与 NPC 图像、入站邀请、微信模拟器游戏操作与真机、现行登录交接和官服。

[验收](validation.md#stage228-wechat-special-dialogs) · [此前 DevTools 导入](#stage222-devtools-import)

<a id="stage227-wechat-family-board"></a>

## stage227 家族与留言板的本机验收范围

**事实**。邀请只验收发出请求。名称、权限、名单、饲料数量和留言内容按回包更新。旧选择和确认受窗口或名单版本约束。

**待验证**。家族入站邀请、其他地图窗口、原版 NPC 与留言图像、微信模拟器与真机、现行登录交接和官服。最近一次 DevTools 导入的限制见既有回执。

[验收](validation.md#stage227-wechat-family-board) · [DevTools 记录](#stage222-devtools-import)

<a id="stage226-wechat-storage-trade"></a>

## stage226 仓储和交易的本机验收范围

**事实**。仓储与交易保留原槽位和余额，直到收到对应更新。旧槽位选择与已失效的报价受到版本校验。饲料箱只显示可移动物品。已确认的原版窗口 `0x29` 路径已接入，另有窗口 `0x26` 和数字密码控件待分析。

**待验证**。家族、留言板及其余地图窗口，原版 NPC 图像、微信模拟器与真机、现行登录交接和官服。最近一次 DevTools 导入的限制见既有回执。

[验收](validation.md#stage226-wechat-storage-trade) · [DevTools 记录](#stage222-devtools-import)

<a id="stage225-wechat-map-services"></a>

## stage225 治疗和技能窗口的本机验收范围

**事实**。已核对治疗单人、完整治疗和取消，人物学习、遗忘与返回，两套宠物训练。人物技能列表或宠物技能栏变化后，需要重新打开窗口才能选择。图文窗口已验证文字可用和文字选择。

**待验证**。仓储、玩家交易和其余地图窗口，原版 NPC 图像，微信模拟器与真机，现行登录交接及官服。模拟器仍待解决此前记录的 DevTools 服务端口和游客项目导入条件。

[验收](validation.md#stage225-wechat-map-services) · [DevTools 记录](#stage222-devtools-import)

<a id="stage224-wechat-inventory-shop"></a>

## stage224 物品和商店的本机验收范围

**事实**。本机对端已核对服务器更新期间的槽位和订单失效。商人、兑换员及六类商店已有页面，本轮验收使用微信 API 形状的本机端口。

**待验证**。原版界面、其余地图业务、实际微信设备和现行官服行为。模拟器运行仍待通过此前记录的 DevTools 服务端口和游客项目导入条件。

[验收](validation.md#stage224-wechat-inventory-shop) · [DevTools 记录](#stage222-devtools-import)

<a id="stage223-wechat-creation"></a>

## stage223 微信建角验证的计时与平台边界

**事实**。建角与入场在本机页面和独立对端通过。触控验证在页面出帧并达到共享输入的 250 毫秒门槛后进行。初版试跑只有 5 次写入，尚无移动帧，保留日志供对照。

**待验证**。原版外观预览、删角、其他地图服务窗口、微信真机的原生表单与 TCP，以及现行登录交接和官服。模拟器验收仍受上一阶段记录的自动化服务端口和游客导入限制。

[本机验收](validation.md#stage223-wechat-creation) · [DevTools 导入记录](#stage222-devtools-import)

<a id="stage222-wechat-page"></a>

## stage222 微信游戏页运行验收的边界

**事实**。微信页面及原生模板已生成。自动化服务端口关闭。默认构建在普通导入页显示游客 AppID 限制，向导仍在导入页，随后取消。当前取得的是模板编译、页面处理函数与独立本机 TCP 证据。

**待验证**。DevTools 模拟器运行、真机文件选择与原生网络和画布、中文字体与声音、完整角色创建和场景窗口、名单管理与持久化，以及现行登录和官服兼容。

[验收记录](validation.md#stage222-wechat-page) · [导入排障](#stage222-devtools-import) · [开发顺序](development-plan.md#stage222-wechat-page)

<a id="stage221"></a>

<a id="stage221-chat-presentation"></a>

## stage221 地图聊天显示的兼容边界

**事实**。普通角色气泡、两个公告位置和黑名单已有本机闭环。网页气泡需要已存在角色和与角色对应的姓名，保留无姓名行的历史投影。网页在较小画布中调整边界，并使用本机字体。

**待验证**。原版隐藏聊天开关、气泡素材和音效、特殊角色、战斗中公告、家族邀请应答、真实联机、手机真机及微信原生游戏页待验证。 继续查入站邀请、其它聊天来源和完整角色显示路径。官服兼容仍待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-chat"></a>

### 前序检查点 · 地图聊天的显示和验收边界

**事实**。地图历史与战斗历史采用独立显示。本地使用每会话首个发送尝试作为时钟基准，后续执行已证的普通限频和小队例外。

**待验证**。原版公告滚动、头顶气泡、黑名单、字体颜色和音效。发送反馈表示本机提交，真实服务和邀请应答仍待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 成员操作的确认边界

**事实**。上轮称号权限位 1 的网页文案更新为「邀请入会」，源于 0x467464 对邀请回调的实际检查。0x516844 一度作为审批候选，追到 0x51444b 和 0x516943 后确认该值是已有名单索引。

**待验证**。分配和移除缺少已证实的拒绝消息。等待只随匹配的名单变化、家族切换或会话结束解除。邀请提交与对方接受仍需分别取证。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 家族管理本机边界

**事实**。定向回归发现仅更新家族 ID 会误清家族兽权限，现已按 Y&3 掩码保留未选择的权限并复测。无效称号批次和重复或越界名单整批保留原投影。

**待验证**。已提交编辑如果一直缺少对应的入站字段或同槽更新，编辑保持等待，切换家族或结束会话可清理状态。真实拒绝消息和其他成员操作的发送序列待取证。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 家族兽窗口的本机边界

**事实**。网页采用选槽和滚动文本，提交后等待相关入站记录。饲料箱存取类别限制来自固定旧样本，家族兽权限来自 Y&3。

**待验证**。原版距离检测触发的退出、拖出窗口丢弃、首个空槽快捷存入、家族兽图形及其他家族界面。真实结算、六位数字提示和当前样本协议仍待取证。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 仓储的本机边界

**事实**。网页使用选槽表单。提交时校验当前上下文，成功写出后等待对应仓储更新，界面根据收到的记录显示内容。

**待验证**。窗口 0x26、六位提示的完整认证链、原版快捷键与全部宠物属性、服务端拒绝和真实结算。固定旧样本与现行样本分别取证。

[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 专用地图对话的本机边界

**事实**。外观草稿要求可映射的源外观编号和版本，超出归一化族的窗口记录不开放提交。页面使用文字控件和可用的直接精灵。

**事实**。累计 REA 快照保存返回证据校验错误，已导出完整证据包并核对前序记录集合。下一轮可按目标选用较小的新会话，旧快照保留。

**待验证**。组合式外观像素、其余地图窗口和银行协议、真实服务端结算、手机真机、微信原生游戏页及官服兼容仍待验证。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 宠物师范的本机验证边界

**事实**。共享解析对技能栏容量限制为十，缺失或负费用报价以及没有名称的报价不开放操作。网页仍保留源编号，不移动其他有效行。

**待验证**。宠物师范原版图形和提示布局、其余专用窗口、真实服务端结算、手机真机、微信游戏页和官服兼容仍待验。

[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · 师范原版布局和结算的验收边界

**事实**。网页保留服务端文字及原选择编号。技能列表在确认期间变化时可返回重开；原版两个遗忘数值以未命名字段保留。

**待验证**。NPC 窗口原版图形与遗忘数值栏名称、宠物技能和其余专用窗口、真实结算、手机真机、微信游戏页和官服兼容仍待验。

[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · 治疗和对话图形的验收边界

**事实**。缺少本地图形或动画时，仍显示文字并保留回复。网页把图形放在独立画布，按场景呈现步推进空闲动画。窗口结束后释放绑定与待完成图形作业。

**待验证**。原版伤势图标、图文窗口像素布局、其余专用窗口、真实治疗结算、手机真机、微信游戏页和官服兼容仍待验。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 玩家交易的版本和结算边界

**事实**。报价物品槽位变更、宠物名册变更或可用金币低于报价时，需撤回后重新报价。宠物使用整个名册的版本，因此无关宠物更新也会使已有宠物报价失效。网页按选择顺序分配报价位置。

**待验证**。Ofl 两种关闭值在真实服务器上的区别。原版队伍交易入口和交易详情、真实结算、手机真机、微信游戏页、现行版与官服兼容待验。

[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 留言板的编码、刷新与待验边界

**事实**。发布前检查编码及两行边界，超限时保留草稿供修改。收到有效新板面时重建编辑框及删除控件，旧版本拒绝发送。网页要求显式确认删除。

**待验证**。原版输入法编辑细节、图形、本地时区跨平台差异、实际权限、真机和微信游戏页。

[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 单项给予的本地实现边界

**事实**。网页直接输入数量，按原版逐次增加可达的范围进行核价。转换为非负的 32 位有符号折算值，提交前复核当前物品和金币。预览或确认期间仍由入站记录更新权威状态。

**待验证**。原版从零递减的快捷行为、完整提示和图形、真实结算、其他交易模式、手机真机和微信游戏页。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 兑换容量与待验边界

**事实**。网页允许直接输入数量，按原版的余额与容量方程核价。报价使用正数量的匹配物品，付款腾格的计算从第一个匹配背包槽开始。

**待验证**。原版加减按钮的逐次变化、特殊货币格式、服务端实际扣除与发货、其他店铺模式、玩家交易、手机真机和微信游戏页。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 商店服务的覆盖范围

**事实**。已覆盖普通购买、出售、鉴定和修理。商店服务绑定开窗时的背包槽位修订。网页显示收到的物品说明，其中的耐久文字由服务端提供。

**待验证**。其余店铺与玩家交易、原版图文与布局、物品耐久字段含义和真实服务器行为。手机真机、微信游戏页和设备仍待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-shop"></a>

### 前序检查点 · 普通买卖的覆盖范围与待验证项

**事实**。本轮覆盖模式 6、7。源样本的装备限制是显示提示，商品仍可进入核价。出售报价随槽位修订失效，未知金币或无效价格会阻止提交。网页用文字和数值输入呈现。

**待验证**。鉴定、修理、玩家交易、其他专用窗口、原版图形和实服接受。手机真机、微信游戏页与设备、现行版与官服验收仍待完成。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 普通对话覆盖范围

**事实**。普通文本路径覆盖模式 0、1、2、10、11，网页复用已有 ASCII 和 Windows-936 编解码。窗口停留期间，过期回复和不匹配的关闭包保留当前状态。

**待验证**。内嵌图形 `@g,…@`、原版控制序列、角色朝向副作用、商店和其他专用模式待实现。`;JE` 与 `Q?m` 的实服因果关系、微信游戏页和设备待验。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 地面拾取的覆盖边界

**事实**。旧测试把钱币类型写成 2。`0x43ff60` 的原始字节确认应为 4，已同时修正共享实现与测试预期。网页像素检查改在离屏副本读取，避免验证脚本本身触发 Chrome 画布读回提示。

**现有差异**。移动点与释放点分开时，现有网页可能请求另一角色。训练选择后的等待内，现有客户端可发拾取请求。固定 SE 已核等待 `−2`、普通窗关窗的释放时点及取格规则。原版实际帧投递、其它专用窗口、三端输入和同版业务回执继续按相应规格核验。 [右键位置](game-static.md#fixed-se-ordinary-right-click-position) · [对话活动值](game-static.md#fixed-se-ordinary-dialog-lifecycle)

[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-targets"></a>

### 前序检查点 · 物品操作的覆盖边界

**事实**。网页使用独立确认按钮提交丢弃，取消和选择期间发生的槽位变化均可阻止旧动作。战斗卸武器的不可用原因区分无武器和空位不足。

**待验证**。原版其他弹窗会维护独立物品标记，当前覆盖同一背包的一次选择。地面拾取、商店分支、原版指针和弹窗行为、手机真机、微信游戏页、现行版和官服兼容仍待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-items"></a>

### 前序检查点 · 普通背包的范围与字段纠正

**事实**。第 12 字段是战斗物品类别，第 5 字段是物品编码。上一轮原创夹具把类别放在第 5 字段，本轮已修正并重跑。 普通地图采用显式选择来源、目标和数量，两个选择槽都有修订检查。

**待验证**。特殊道具选目标、丢弃、战斗卸下武器快捷操作、原版图标和提示窗口、手机真机、微信游戏页与设备、现行版和官服兼容待完成。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-input"></a>

### 前序检查点 · 战斗物品栏的支持范围

**事实**。当前展示背包中已有记录。未鉴定或不满足资格的物品禁用。共享核心在发包前校验槽位修订号，换槽后要求重选。

**待验证**。普通场景背包、战斗卸下武器快捷操作、原版物品图标与说明、手机真机、微信游戏页与设备、现行版和官服兼容待完成。非空物品记录的字段不足会整包拒绝，原版对缺失尾字段的写入差异保留为边界。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-input-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-input-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-mp-items"></a>

### 前序检查点 · 物品结果的覆盖范围

**事实**。当前覆盖有符号 MP 变化、已注册目标的回复、自身、重复与空目标列表，以及回复期间提前中断。缺失目标在写入队列前进入未支持分支。

**待验证**。物品选择与发送、其他战斗行为、手机真机、微信游戏页与设备、现行版和官服兼容待完成。原版缺失目标释放、全局随机序列与对象引用重叠场景仍待核对。

[本轮计划](../analysis/game-battle-shared-storage-v1/mp-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/mp-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-transitions"></a>

### 前序检查点 · 变身与退场的覆盖范围

**事实**。当前覆盖四种元素、同资源变身、解除绘制掩码、22 个映射槽的退场位置、存活和倒地角色、以及服务器提前结束。默认绘制路径按共享直通透明度合成。

**待验证**。CFP 和其余 ITM 分支、原版其他渲染后端和对象引用重叠场景、手机真机、微信游戏页与设备、现行版和官服兼容待验证。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-transitions-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-transitions-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-friend-roster"></a>

### 前序检查点 · 好友名单的范围与边界

**事实**。当前以单会话冷启动名单为依据。对侧名称相同但任一标记不同会保持清除友方位。实际角色会在原有分类回调中采纳名单更新。

**待验证**。原生名片文件和角色切换的名单隔离、其余战斗消费者、手机真机、微信游戏页与设备、现行版与官服兼容待验收。

[本轮计划](../analysis/game-battle-shared-storage-v1/friend-roster-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/friend-roster-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-effects"></a>

### 前序检查点 · 聊天和计时的支持边界

**事实**。格式错误的嵌入 CHT/BST 在退场清理之前拒绝。该场景的 mask、聊天、回调和指针保留。正常 BST 缺少已解析的数字图形资源时显式报告依赖。输入处理继续使用独立的 30 秒选招计时。

**待验证**。原生聊天过滤、音效播放、替代渲染、其余退场分支、手机真机、微信游戏页和设备、现行版与官服兼容待验收。 会话文本驻留内存，断开时释放。

[本轮计划](../analysis/game-battle-shared-storage-v1/side-effects-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/side-effects-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 的模式和边界

**事实**。同槽的重复效果、缺目标及重复目标含效果位时会在入队前报告边界。无信号普通目标保持原等待，随后由忙碌恢复处理。

**待验证**。其余天气类型、原生池跨快速再次入场的连续性和普通直接像素路径。完整独立模型、替代渲染、手机真机、微信原生游戏页和设备、现行版及官服兼容待验收。

[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 上下文边界

**事实**。缺施法者可提前释放。缺目标、重复目标槽及结果位 0x800000 在写队列前报告边界。动画无发射信号时目标仍会经过共用忙碌恢复。

**待验证**。替代渲染、完整独立状态模型、手机真机、微信原生游戏页和设备、现行版及官服兼容待验收。

[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL402 边界与后续消费者

**事实**。指定侧无登记对象时显式返回 skill402-empty-side，保留原 MP。缺施法者的命令可正常释放。未知对象几何或缺失资源仍由既有边界报告。

**待验证**。SKL400 追踪、SKL401 天气效果及其清理。完整的独立状态模型、原生图形后端、手机真机、微信原生游戏页和设备、现行版及官服兼容待验收。

[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · 同槽恢复证据与剩余别名

**事实**。SKL404 同槽交接保留两次登记，在第 7,201 次忙碌检查时追加 11、38 归位动作，随后释放命令并结算。技能等级取编号个位，40491 走等级 1。 占用目标槽的本地用例中，原身体 HP 为 70，新登记身体受到命中后为 58。

**待验证**。其他别名、完整的独立状态模型、原生图形后端、手机真机、微信原生游戏页与设备、现行版和官服兼容仍待验证。 105c、13b4 的其他消费者仍由目标审计追踪。

[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：1038重置、冷却查找与工具依赖

**事实／纠错**：强重置4347e0同时清1038并将1040技能等级设为-1，弱重置4348e0也清1038；旧端口漏了等级重置。动作14的目标查找现置于命中信号>9999内，修正击散离场后冷却期提前查找已移除目标的问题；真正命中缺失目标仍报错。unknownFourthCells的源身体ID在RID替换后保持原身份。本轮136份旧生成器/金样均与改前一致，没有重做旧金样。首次完整源码为1075/1076、生成包63/64，唯一失败均是隐藏横幅TCP夹具漏带普通输入10位；仅将对端P控制位合并为410，保留初次记录，针对性源码/生成包复测及最终完整复跑均通过。

首次Ghidra静态副本分析因缺JAVA_HOME退出1，改为该进程指向已安装OpenJDK21后正常退出0；未改全局环境。REA缺420e50函数时仅独立恢复并逐字节核验，不伪造canonical。大工具结果使用已缓存结果分块落盘，不重复分析。

最小检查：固定hash/原始字节 → 当前命令owner与70计数 → 1038与命中信号 → 注册槽位是否仍存在 → 真实434b90忙计数及位置。禁止注入ready、清除源信号或把未初始化栈当确定的0。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](../analysis/game-battle-combination-v1/source-check.json)、[源修正](../analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-combination-v1/test-results.json)、[验收边界](../analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](../analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](../analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：原始动作索引与共享指针

**事实／纠错**：40c7a1的动作10读取actionRead-1，检查前一个动作11；40c7ca再取global[body.slot]进行朝向恢复，空指针由419f60忽略。旧核心与独立模型都误查下一个动作，本轮同时纠正。23套旧模型完成重算，134份旧生成器/金样中12份有意改变、122份不变；1,648条轨迹、50,731帧状态摘要改变，输入、动作队列、资源/geometry、帧数与RGBA记录不变。三个最终附件动画的nextFrame变化均伴随lastFacing变化。历史218只在完整before视图重验，未改写旧验收事实。

**事实**：新独立方程覆盖53场景、13,799帧状态、完整拥有存储及1,098帧RGBA；50条身体结算，same-a-multiple有界等待，same-a-b子对象移除与element159两条显式消费者边界分别保留。缺少骑手、当前槽位上下文及未覆盖角色标记原子拒绝；135等共用105c指针分支显式停止，未借独立chant/projectile映射伪造原生共享指针。

最小检查：固定样本/字节 → 前置RID与结果RID区别 → 当前tuple和registry身份 → 骑手仍在池内 → 共用105c消费者。禁止填入ready、跳过未覆盖消费者、回退动作10为旧next-index或用已消失的子对象继续画成功动画。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](../analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](../analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](../analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](../analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](../analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：原始前瞻、特殊槽位与等待

**待验证**：自身、守护别名、缺少结束信号及RID后跟守护的16条轨迹仍有界等待，不能称为自然回合完成。已有7201恢复是独立机制，未注入ready或清理动画信号。20/21号施法者的73击倒收尾按原指令不补11/44；其他通用类别同类边界尚未纳入本轮实现验收。attachedRID消费者4236d0仍原子拒绝，不能以元数据RID三字已支持推定该消费者已完成。

最小排查顺序：固定样本hash与class/variant → 比较字段游标和原始前瞻 → 查principal槽位及动作53/14 → 区分原始等待与7201恢复。不得跳过guard字、填补上下文、加ready或把恢复回合当自然完成。初轮模型EOF、73特殊槽位收尾、测试正变体编码器和浏览器预检文件名错误均保留失败证据，最终完整套件通过。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair73-v1/source-check.json)、[源修正](../analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair73-v1/test-results.json)、[验收边界](../analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：哨兵目标和非攻击动作信号

**待验证**：两条主守护/RID在205/207帧选择图形0，保持现有几何拒绝；两条次级2041在124/126帧的201读取下一元组哨兵-1，明确报目标上下文错误，失败回调之后不声称状态/像素等价。100110是带非攻击命中信号的原创压力资源，实际入口和重入会重复主命中并等待；不擅自清信号。保留失败与有界等待，普通守护/RID/重入使用已独立建模的100114资源。这些不是原程序或官服验收。

最小排查顺序：先核对原始字段的两个游标，再检查当前元组/父关联与动画signal；不得清信号、补目标、归一化字段或放宽图形0门禁掩盖差异。跨VM检查比较数值而非原型；完整初轮失败与精确测试修正保留，不把定向复验写成全套重跑。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](../analysis/game-battle-chain260-v1/source-check.json)、[源修正](../analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-chain260-v1/test-results.json)、[验收边界](../analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](../analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](../analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：相邻数据读取与保留图形0的边界

**事实／范围**：原200字节观察不足以判断105高等级。REA扩展读取533940处512原字节，其中533968起472字节作为已观察窗口；十等级从零游标出发首次负值偏移依次9、10、163、143、123、103、83、63、43、23。高等级会读到相邻数据37/115/32及533a33的-126，缺少该动作时4fd5f0返回1。没有恢复出472字节的声明类型，不能把相邻数据叫作完整动画表；原生间接写入、整个进程生命周期和超出已观察窗口仍未验证，越界明确报LEGACY_BATTLE_SEQUENCE_CONTEXT。

**事实／待验证**：护卫后的RID后续记录在原创场景中令角色资源变为0；实际核心与独立方程在帧264/311一致进入当前帧控制器的LEGACY_BATTLE_FRAME_GEOMETRY。两个案例保留为渲染边界，未当作像素或正常回合通过。初始新模型未保留失败帧中新建残影的旧优先级17，曾错误地保留计算值16，现仅修正该边界快照；全部场景输入、队列、资源、geometry、拥有存储和成功RGBA保持，只有一条边界轨迹的最后状态改变。未放宽原渲染器或改旧golden。

最小处理是保留两个明确渲染拒绝和自然资源释放，不把图形0臆造为空白或放宽检查。定向重入必须区分发生在MP消耗前还是后；动作98内重入已有两条真实M消耗，不能沿用早期重入的一次费用预期。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-context-v1/source-check.json)、[源修正](../analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-context-v1/test-results.json)、[验收边界](../analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：新模型44清理遗漏和未闭合上下文

**事实**：41760组队列、307条轨迹、71230帧状态、32260帧完整RGBA及两selector/完整拥有存储与实际共享核心一致；286条身体结束、6条244退出、15条1200帧等待分开记录。18条真实命令管理器流程含12次自然回合结束、5次现有超时恢复、1次退出，未注入ready或手动弹队列。初始新模型遗漏44对子效果的清理，已按既有源码修正；37440组原队列、289条原轨迹输入、原创资源和geometry保留，8条预期轨迹改变，另增18条优先级轨迹。此前126个生成器/golden文件字节不变。

定向TCP检查曾漏传微信适配器，补齐测试调用后通过，未为此改产品；字段facing应从animation.lastFacing读取。完整失败材料保留在本轮测试结果。

**待验证**：105高等级动画表没有已观察到的负终止标记，共享58fac0游标的真实上下文未明；260主护卫与串联字段在435000前置解析和424310生产者间顺序不同。两类继续拒绝为未接入，不改已证前置解析；配对73关联路径及此前113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB仍未完整闭合。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](../analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](../analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：0x106误标与未闭合原生前提

**事实／纠错**：原424310的`0x106`是262，`0x10a`才是266。旧实现和独立模型曾把262的205冲刺、最高等级73/74套给266；本轮修正shared的配对生产者及护卫路径，266恢复普通9接近。此前stage209相关“266/205”结论已被新证据纠正；正变体和自身266的独立规则继续区分。其余五类特殊pair并未因此启用。

最小修复为生产者的两处共享模块与三套独立模型；禁止把旧绿色测试当原生等价证明。

**事实／边界**：105使用533968处按等级步长20的有符号动画表与共享58fac0游标；已核200字节只有前两行带负终止标记，后八行全0，不能推定高等级正常完成。260带主护卫的串联字段在435000前置解析与424310实际生产者之间顺序不同。4608个原创字段流对照中，实际shared解析准备4368个、240个触发跨平台边界拒绝；4128个在两个源读取器都完整，336个已准备流呈现不同字段角色顺序。未把这些静态方程当作游戏执行或修改已证前置解析。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](../analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：零值、移除、背景RNG和配置门禁

**事实**：HP先归零再经45/44/46/47/49移除目标；下一C会重建目标，已验证70→0、下一C58→0及最终移除，未把移除误记为HP缺失。44完成还会清理状态子节点，新独立模型继承时的该遗漏已修正；旧参考生成器与golden全部未改。两处旧“未实现96”的负向对端夹具改为仍未实现的262，独立Python对端与JS预期同步；历史证据不改写。初次完整源码912项中911通过，1个旧unsupported96对端失效；精确旧输入与日志已归档，修正为262后重跑完整912项。早期测试括号、seed字段/背景RNG及替代配置错误均保留日志。

**事实**：96默认后端的4160组队列、80条轨迹、32959帧状态、11836帧双selector完整RGBA与实际共享核心一致。另两条替代渲染轨迹的927状态/578像素/50样式观察仅为独立源方程；实际公开配置仍报LEGACY_BATTLE_SKILL_CONFIGURATION，未放宽门禁、未计入运行或像素通过。当前仍无替代渲染/半透明后端的完整实现。

**事实**：公开默认配置下72条轨迹自然收敛、2条244退出、6条保留1200帧等待。16条真实管理器验证得到9个自然回合、6个源超时恢复回合、1个退出；各命令与最终管理器分别计数，7201次忙等待触发恢复，纯回位等待不加计数。自身、护卫别名和连续反击的正常原生完成仍未闭合；未注入ready或手动弹动作来强行结束。

排障：零值盒只看回调结束时seed，不能把背景另外两次RNG当成构造次数；目标49移除后由下一C重建，不能凭空保留旧body。替代配置必须保留明确失败，不通过放宽门禁造像素成功。本轮无VM/CUA操作；外部KB仍缺requirement-index，仓库本地索引维护，未修改外部规则。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special96-v1/source-check.json)、[源修正](../analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special96-v1/test-results.json)、[验收边界](../analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：113解析差异、等待所有者与24遗漏

**事实**：原435000只给72读取嵌套记录，且不把嵌套目标本身标成依赖（护卫会标记）；424310运行时同时处理72/113。保留原解析边界：113嵌套的4480组队列/104条轨迹仅为运行时命令夹具；可经真实前置解析的部分为4640组队列/157条轨迹。真实TCP/页面只验证72嵌套及113无嵌套，不将113嵌套标成协议兼容。

**事实**：独立9120组队列、261条轨迹、58154帧状态、4812帧双selector完整RGBA及前后200动作/800tuple存储一致；256条自然收敛、1条244退出、4条等待1200帧。13条真实管理器中8个自然回合、4个超时恢复回合、1个退出；各命令与最终管理器分别计数，7201次忙等待触发恢复，纯回位等待不加计数。双护卫自然完成不等于此前211自身护卫正常完成已解决。

**事实**：24动画遗漏同时存在于产品和旧独立模型；15组旧参考全部重算，输入、队列、素材及几何不变，仅repeat-hit、repeat、reflect-guard-followup三条轨迹输出变化。3358份精确前修改工件已备份；211源核验在只读历史视图重验通过，原始与历史证据未改写。初期合成素材、独立模型对象/55动作、113前置解析、等待计数所属和跨realm数组断言问题均保留失败日志并按实际原因修正。

排障：command和最终manager的waitCounter不能混为一个；跨realm测试用显式Array.from归属本地比较，不能放宽产品字段。15组旧golden修改由原文件及备份绑定，不重写历史核验。无VM/CUA动作；外部KB仍缺requirement-index，仓库本地索引有效，未修改外部规则。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](../analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：自身护卫等待、源RID与旧断言

2880组队列、175条轨迹、98543状态、6294帧完整RGBA及初末200动作/800tuple存储一致。92条身体收敛、2条244离场、81条等待链在1000帧内未自然收敛。13个实际管理器场景中9个正常回合、3个等待恢复后回合、1个离场。普通护卫观察在7204恢复、7208结束；自身别名为7203/7207。阈值是7201次busy调用，归位等待不递增，不能把恢复称作正常护卫命中。

首次完整源码862项中859通过、3个旧“self266 producer pending”原因断言失败，原日志、865身份与3份精确旧输入已归档；仅修改3处旧断言，定点3项通过后完整862重跑通过。产品、构建及当前生成包输入未因此改变。专项早期wire索引、RID同值断言和固定恢复帧号也已修正；未放宽产品解析或注入ready/状态。

可重复边界：缺少非自身RID上下文时不能用输入自身尾部或0猜测；自身-only不能凭空造发射目标；已忽略的scalar不能索要未使用5748。新排障材料在本阶段源核验/模型/失败归档中；本轮无VM/CUA动作，不增添VM运行结论。外部KB仍缺requirement-index，仓库本地索引有效，未修改外部规则。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-self-physical-v1/source-check.json)、[源修正](../analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：组合位、恢复mask与旧验收断言

**事实／修正**：旧实现与独立模型把heal和suppress独立判断，导致6000及单弹30000组合错误隐藏治疗数字；现按原始分支优先级处理，且只校验实际会使用的数字/消息资源。4组受影响旧模型已重新生成，输出、输入、资源、geometry均逐字节不变。119/120/121使用工厂kind7/8/9，不代表body animationAction7/8/9。stage209的“正变体E000仍拒绝”在本轮有限范围内被更新；其1004/1000/FD4与266205修正继续保留。

207360组独立队列、495条轨迹、57686个状态、7388帧完整RGBA及实际200动作/800tuple初末存储一致。486条身体收敛、3条预期244离场、6条重复治疗/自身73链在1000帧内未自然收敛。27个实际管理器场景中18个正常回合、6个在7203恢复后于7207结束、3个离场；不能把恢复当作正常播放闭合。

初次完整回归835项中833通过，2项由同一旧验收器把已支持1011当异常引起；修改前完整日志/853输入快照保留。只把该测试替换为真实多余尾字段拒绝，2项定向通过后重跑全部835项自然退出0；生成包33项和四套构建的实际依赖未变。TCP恢复验收最初误以为只恢复busy身体，已按原始wait的完整命令依赖mask修正，未改产品恢复逻辑。本轮无VM/原程序/账号/官服操作。

首次独立模型遗漏frozen/strong-reset tuple哨兵，首次测试wire遗漏字节与大写hex约定，均先修正测试方程/输入再生成完整参考；未放宽产品解析器。历史证据和旧预期字节保留。本轮无VM控制，不新增VM排障结论。

**待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](../analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](../analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：旧字段/266假设修正与验收器问题

**事实／修正**：native1004是afterImageEnabled，1000是残影计数器，FD4才是attackFinishCounter；73/74、defense100和positive105现使用正确字段，8优先于100。266首段应使用205，level9使用147→73及源74清理；205每次回调恰调用一次rand并选择1adb4..7烟尘。共同body尾部生成冻结副本，队列重置清FD4但保留1004/1000。此结论更新stage204～208相关旧字段/266描述；历史本地绿色测试不构成原生等价证明。精确修改前3275文件副本与历史源核验均保留；12组旧模型重新生成，仅5个预期文件改变，所有旧场景输入、资源字节及geometry不变。

独立模型首轮漏反射RID写攻击者，按41a030修正，未改变已正确的产品metadata。管理器验收误用body-only copy，改为command copyState；手工TCP烟测漏显式WeChat session端口，补齐测试组合。原非通过日志保留，最终802/27自然退出0。源现场不执行VM/原程序，不新增动态崩溃或官方兼容结论。

**待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。

[需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-results-v1/source-check.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：源恢复、冻结残留与验收器设定

独立原创方程与实现对照16000组队列、227条轨迹、58109帧状态、5124帧完整RGBA（双selector），初始/最终原始200动作格和800tuple格也相同。223条身体收敛，1条预期244退出，3条别名/RID链在3000帧内未收敛；真实管理器在7203次回调触发已有恢复后结束，不能把恢复算作正常播放闭合。

113先Action5/animate1，再构造(parent,-32,type0/3,filter0,parentlink1)，1000位选择1ae49，否则1adb9；效果复制世界坐标且不跟随，无初次animate。父状态1→2由实际效果完成回调产生，157清自身冻结并弹出。护卫蓄力的被保护者可能保留frozen=1直到队列重置，当前按原始脚本保留并验证nextC/reset，不擅自解除。

独立模型首次缺reaction_puff和243；补入已有源方程。首次回调验收误认为蓄力总属slot0，改为读取真实parent/tuple；手工TCP烟测漏显式WeChat session端口，补齐端口而非改产品。首次源验收误把扩展索引字段当原始组字段，现逐字段核对原始范围、完整组hash及goto所有者；原证据未改，失败日志保留。当前775/17均自然退出0。本轮无VM操作，不新增VM排障结论。

**待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：403410并非清零、266漏147与慢放删除

整数盒子限值与计数器按limit→counter顺序构造，构造各调用rand一次；getter第21次读重置读次数并更换掩码，decoded值不变。比较先读参数limit、再读ECX counter，SETGE有符号；403410读、加1、写回，参数0不代表清零。只声明本地可观察调用顺序，未声明全局对象池和RNG已一致。

**事实**：266直接路径漏147的既有差异已按424310的257≤class<406分支修正；独立204模型同时修正，仅802组队列和class266两条轨迹变化，原输入/原创素材/几何未变。历史206生成器身份账本针对唯一已修正204源码读取精确改动前备份，当前修正另有回执；没有改写旧源证据或制造旧验收全绿。

41f5b0的pulse序列为1..15、14..0、1..，不重复端点；每次先提交10×10格点（X外层）再判断counter>=limit，最后仍加1。duration15实际提交16批；被标删除节点若遇慢放门控可暂留，但门控期间不重复提交。新的directSubmissions共用有序绘制队列，不以开启casting背景状态替代平铺。

首次聚焦测试误要求所有保留deleted快照都有100绘制项；改为仅检查首次删除转换，未改实现来迎合误设定。强制pair72/113的flag1需要nested记录，原拒绝测试改用合法flag0。原失败日志与全量通过分开记录。本轮无VM操作，不新增VM排障结论。

**待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。

[需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：消息坐标、realm断言和有界等待

**事实**：基于固定37c4样本，实现25个generic选择器及独立73类的有限variant1/2/3发射路径：真实动画probe、单弹、多目标回收、连续发射和28反应；73不使用generic耗蓝前缀。95/105/110前缀与6/84/85/87的正变体HP结果保留各自源规则。公共消息工厂改为当次世界浮点坐标，修复95移动后仍取旧屏幕缓存的问题。

最初比对在95第46帧发现消息X坐标用旧screen值；420080读取float40/44，修正公共工厂后完整模型吻合。独立模型未因该运行错误改成旧屏幕值。

neutral验收器曾用宿主deepStrictEqual直接比较VM数组，内容相同仍失败；改为Array.from仅归一断言输入，产品与构建字节未改。两种pending截图曾共用文件名，已分别重跑并保存独立路径。

独立原创Python源方程生成61920队列、879轨迹、134538状态和16606帧完整RGBA，两种selector均逐项匹配；873轨迹身体收敛。自身73及重复目标各3条在3000次观察内保持未收敛，不能算成功回合；实际源码/生成包管理器均由wait counter>7200恢复这6条，未注入ready。原作可执行文件未运行，本机方程匹配不等于原生运行证明。

本轮没有VM操作，既有VM排障知识库保持。

**待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。

[需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：反应烟雾RNG根因与源码解读纠正

**事实**：本轮依据固定37c4样本的41f310/41f2d0，修正公共26/160反应烟雾：使用身体当次移动前世界坐标、无父链接、不消耗模型随机数；12/13逃跑烟雾沿用独立随机工厂。没有新增正变体或特殊技能可用范围。

根因是26/160误用了逃跑烟雾工厂，随机偏移提前消费两次RNG并写入父链接。最小修复拆分工厂；独立模型同步纠正，11份生成链重跑。新测试最初误把body offset加到烟雾screen，按41f2d0修正断言后全量通过。

规范工具未识别421f90/41a660时不重复同一失败查询；先保留negative结果，再使用独立分析副本恢复并按原件逐字节核对。临时角度推测-45已被实际135.0原件值纠正，未启用相关飞行能力。4034f0周期性rand说明原生全局RNG仍是独立未决，不能由本轮局部修复宣称闭合。

本轮未操作VM，既有VM排障节保持。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：直接物理结果、长等待与夹具修正

源类别不能套用单一数值回调：6是MP，84/85/87保留非HP分支；pair40与正变体40条件不同。普通zero/20不置dead/aux；真实manager可能走已有7201恢复。1800步夹具不足以观察该路径，现明确验证第7447次恢复0/10、7592帧收敛；没有改生产等待阈值。

源码全量测试的旧bootstrap计时用例要求35ms预算内启动两次各20ms同步工作；高文件并发/额外CPU负载可使第一轮已超时。隔离16项通过后，最终完整回归使用--test-concurrency=2，未改截止策略或该测试。新字体夹具9px触发既有stride限制，修正为原创8px；type66参考占位resource0也已在新模型修正。完整纠正及初次日志见source-corrections。

本轮未操作VM，既有VM排障节保持原样。

正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：公共物理分析中的反编译与范围边界

Ghidra会把41a550目标浮点参数的实际用途隐藏在__ftol临时值中，也会把419bd0上位x87状态拼进int返回；必须核ESP/原指令和AL。41a440是41a2d0内部查询，41b910没有规范过程；不可虚增过程或反复查询不存在的候选。记录在本阶段query-diagnostics及source-check，

原生41a280同步探测和41ab20构造内身体推进尚未与便携帧调度等价；新消费者和异常边界仍待实现/验证。本轮没有VM/CUA操作，原VM排障节保持原样。

本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](../analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](../analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：空目标、其他震动引用与验证修正

**未证运行边界**：82的84动作进入未检查-1的目标循环。没有原始运行结果时不能推导为空操作或成功；当前修改前返回明确不可用，实际页面保持连接、数值不变并可断开。41d19b/41d2f2虽引用相同震动全局，但当前Ghidra未给规范函数；它们不是已核82分配闭环，仍留给其他原生消费者分析。

**已核语义**：82的动作83不是技能类别83；82的10000等标志也不是61..63/83数值类的反射/吸收。RID必须先推进三个元数据元组，再消费原数值。

**验证器修正**：新参考需从状态链接容器删除既有C状态，而非效果子项容器；新TCP测试需显式提供微信会话适配器；放大探针必须超过最大12px原帧，不能仅超过4px。初始失败/不充分观察保留；修正后完整状态、协议和页面验证通过，产品未为验证器改语义。本轮没有VM/CUA操作，原VM知识库不变。

82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](../analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](../analysis/game-battle-skill82-v1/source-check.json)、[验证修正](../analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-skill82-v1/test-results.json)、[TCP](../analysis/game-battle-skill82-v1/network-validation.json)、[页面](../analysis/game-battle-skill82-v1/browser-validation.json)、[验收](../analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](../analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](../analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：83未证反射、源等待与验证器修正

**待验证运行边界**：非本地83先50/49删除施术者，非零反射的phase2或自身反射者可访问已移除身体。无原始运行结果时不自行发明安全成功；当前在修改前明确拒绝。零和非自身反射及特殊193等待保留；7201恢复是不同的源管理流程，不能把短观察超时直接标回合成功。

**已核实控制**：244的局部switch体虽空，回调返回stop已由命令/管理器拥有；不得因局部为空新增伪HP0/C20/回合推进。本地KO也可能先停止返回，不能套普通回合后删除的验收条件。

**验证修正**：独立参考初次误用不存在距离助手；生成验证初次遗漏未证拒绝分支、随后误比JSON对象键序；浏览器初次误比关闭battle与普通world serial、KO误等普通回合清理。修正验证器后分别复验，产品未为验证器改语义。3条Canvas读回提示来自像素探针，记录原文且无其他警告。VM排障知识库原文保留，本轮0 VM/CUA操作。

非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](../analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](../analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](../analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](../analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](../analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](../analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](../analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：历史计数、style0和源等待

**已纠正的历史统计**：45个现存快照全部核哈希并逐对象解析，再独立流式核身份；实际并集2323，继承累计2400多77。首次引入点尚未查明，不能仅沿旧累计加新记录；本轮29记录全为复用、规范函数仍716。旧封存清单/源证据保持原样，最新页、源核验与纠正记录明确覆盖当前统计。

**已补真实消费者边界**：154/155 style0应发57bb且不改生命值；199 style0可画数字而不改值。原先只有3/5/6的消费者现在按源区分。旧未支持守卫从已实现61迁至已证三元组布局的未实现83，不能删守卫或用物理行为顶替。

**夹具与源行为**：首次像素对照被5宽新字形触发现有stride限制，改为8宽后通过，不改变产品门禁。重复目标会覆写数字字段；零和/重复反射仍可使phase2等待，身体busy清零不表示命令完成。VM知识库原文保留，本轮没有VM/CUA操作。

共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](../analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](../analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](../analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](../analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：能力掩码、动作激活与截图时机

**已修复真实门禁问题**：C800原掩码仍拒绝新覆盖消费者，首新核心6过/2失败；核4203d0/420370后将已拥有掩码扩至1f001fff，旧未支持守卫改用2000，新旧21核心与2026全量通过。不能改预期状态来掩盖门禁错误。构造器2遗漏8000也已修正产品和独立参考，编辑前留原身份，旧213场景重算。

**源行为必须保留**：434a70激活当前动作，不能替换为434a30推进；自身68 reset会抹掉先前53，不能补扣蓝。C动态位和状态图标分属不同生命周期，普通C0不删除1050，M139才删除。管理器field的C0删除与上述状态图标规则不同。

**验收纠正**：独立参考首次缺status和45回调方程，保留失败日志后按源补齐。去重发现41b6e0已缓存，仅3函数计新增。首13网页功能通过，但3个固定时刻截图过早；只补这3条ROI条件截图，无产品修改、无状态/就绪注入，0错误警告。VM知识库原文保留，本轮没有新VM/CUA操作。

其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](../analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-status-skills-v1/test-results.json)、[TCP](../analysis/game-battle-status-skills-v1/network-validation.json)、[页面](../analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：自身游标、反射等待与反馈缺口

**原子拒绝**：源135耗过最终FF后，自身31的71仍读取后续游标；未观测原运行结果，因此`casting-self-drain-cursor`在队列/MP修改前返回。**保留等待**：反射列表非空而有符号总和为0时，源不追加1/137却会进入phase2；busy清零也不意味着回合完成。重复反射亦需继续核源，不能据静态现象宣称原运行必崩。

**明确缺口**：1101/mode/本地和paired FE0规则已拥有；对侧423500好友属性表缺失时只给反馈缺口，不猜元素分类。初个RID之前的额外栈字、sourceByte303=150的精确后端意义与原alpha/tint/alternate绘制仍未验。

**已修复可重复问题**：actor+2cc误作高度、背景priority5代理盖住100格施法、负CRT除数和RID额外字延续；编辑前留基线，重算受影响原创参考，1967全量与245生成检查核回归。首次浏览器的9条Canvas探针性能警告通过离屏ROI读法消除，仅修改验收脚本；不修改产品进度或注入状态。VM操作知识库保持原记录，本轮没有新的VM/CUA动作。

自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[规格](../analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](../analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](../analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-casting-v1/test-results.json)、[TCP](../analysis/game-battle-casting-v1/network-validation.json)、[页面](../analysis/game-battle-casting-v1/browser-validation.json)、[验收](../analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](../analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：等级读终止、原生窗口与验收脚本边界

已修复实际竞态：技能点击排队后若先收到P2或等级MP变化，原回调只给37并保留菜单；之前抛异常会让网页断线。现按真实回调拒绝/保留连接，真实queued-update对端分别改变权限和费用、再恢复后核唯一S/实际结算/返回。

可重复源边界：4f0510读取名时510de0需要255B容量内的分隔符；读满/缺分隔符返回1终止，和内部空名不推进不同。按原读返回区分，内部空名及非法槽/超过11等级原子拒绝，不能保存无限循环或越界写入。470b20翻页计数读取c45d4c[15]相邻内存；网页采用有界语义列表，原生翻页身份未验，禁止猜全局字节。特殊地图7fd4/7fd5配主ID62、主ID48无队员提示和普通非零工艺上下文仍待移植。

测试纠正：旧未支持skill断言已换为仍未实现的item，并保留菜单/排队限制；KO回合后身体和池节点均已释放，应核实际HP事件和最终缺失，不能要求活体或已释放deleted节点。neutral跨VM数组原型须在验收边界归一化，独立数值/字节/顺序不改。旧生成脚本中断保留为未验收记录，后续只复用已核成功构建，重跑正确的完整生成检查。

文档脚本在本机Xcode Python3.9.6直接执行时两次报告Non-UTF-8，但严格UTF8解码和compile(bytes/text)均通过；加显式coding:utf-8头后正常执行，根因未定。仅改本地辅助脚本，不改全局解释器或配置，观察留在build/analysis/game-battle-player-skills-v1/docs-encoding-observation.json。

本轮未操作VM/CUA、未运行原始游戏或连接官服，未消费/扩大既有Windows诊断/UAC/联网授权，原VM操作知识库保留。完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-player-skills-v1/source-check.json)、[测试](../analysis/game-battle-player-skills-v1/test-results.json)、[TCP](../analysis/game-battle-player-skills-v1/network-validation.json)、[页面](../analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-player-skills-v1/goal-audit.json)。


<a id="stage196"></a>

## stage196：49纠正、MON边界与源/策略区分

可重复问题与最小处理：旧未配置技能图形的49分支误落入50；按40a120清全局槽并标记deleted，等待真实遍历回收。独立183身体/184画面参考与两个旧TCP末态断言同步更正，旧日志及全部编辑前哈希保留。不能以保留已删除活体来迁就旧测试。

4235f0曾在初稿误写成转向，已核实为savedFE0友方bit；对侧需423500好友名称/四元数据，不猜测空表。MON第三字只作!=-1门限，未命名为宠物索引。缺actor保留显式未支持；配对缺失的零mode源提前finish后可能保留busy1，测试要求真实等待，不当正常回合完成。原运行效果仍待验证。

51/52的8000滤层依赖6122d0呈现选择器，而非4457b0图形配置；已经分开所有者，实际Canvas后才翻转。原驱动采样无运行证据，point为独立策略。参考/夹具设置曾缺适配器、dead动画结尾或己方配对目标，修正独立预期并留失败日志，不注入就绪/状态。

本轮无VM/CUA/原始游戏执行或官方会话，未消费/扩大既有Windows诊断、权限、网络或登录授权；保留原VM操作知识库。完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](../analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pet-transition-v1/source-check.json)、[测试](../analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](../analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](../analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](../analysis/game-battle-pet-transition-v1/goal-audit.json)。


<a id="stage195"></a>

## stage195：源记录危险边界与本地排障结果

可重复问题与最小处理：源J_J越界slot无上界、空名称路径不推进游标；受限解析器原子拒绝，详见规格，不模拟不安全行为。三身体夹具曾把slot10写为小写a，C源语法需要大写A，错误会覆盖slot0而隐藏实际rider；修正原创字节后过验，不给核心加假挂载。普通目标参考需包含实际己方配对宠物，不能沿用两身体假设。

M|END是实际战斗结束处理者，不是空轮终止符；真实回合夹具改为远端普通CBC并等待manager drained。跨回合/reentry保留技能及petStage，测试/页面使用真实“重选技能”；禁止重置内部状态伪造可用菜单。旧194 local-rider-input负例现演进为真实两次W|FF，原194历史日志/验收未覆盖。最终截图使用互异名称，旧覆盖捕获仅作为历史观察。

本轮无VM/CUA/原始游戏执行或官方会话，未修改Windows诊断/权限/网络/登录状态。既有VM操作知识库与授权消费记录保留。完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](../analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](../analysis/game-battle-mounted-input-v1/source-check.json)、[测试](../analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](../analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](../analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](../analysis/game-battle-mounted-input-v1/goal-audit.json)。


<a id="stage194"></a>

## stage194：本地骑乘输入仍缺口；关联深度字段已修复

普通C/CBC的关联构造、更新、移除与父回调已接通，当前操作者的骑乘输入仍明确source-body-child13b4，连接保持。它不是资源层未创建身体，也不能用外部ready布尔值跳过；其他原生菜单/挂载动作仍要实现。未知操作回归夹具迁往CFP，历史193的CBC失败日志/JSON保持原样。

可重复问题：flags800000使4198d0选父备用Y，不能继续给新子对象统一alternateY=0；此次独立模型和产品初版同时遗漏，补参考后先观察10失败，再修owner并重验。真实挂载所有者需要有效动画，旧“资源1”夹具只适用于未实现时期的依赖检查，现用原创100020/100040/114003资源并验证实际rider。下一C更新双方max值，HUD期望必须按报文字段逐行核对。无VM/CUA操作，不重放旧安装/WER/账号分支。完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-character-change-v1/source-check.json)、[规格](../analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-character-change-v1/test-results.json)、[TCP](../analysis/game-battle-character-change-v1/network-validation.json)、[验收](../analysis/game-battle-character-change-v1/validation.json)、[剩余目标](../analysis/game-battle-character-change-v1/goal-audit.json)。

<a id="stage193"></a>

## stage193：普通换位/装备已通，真实两轮桥超时已定位

普通POS、EQU和PSN共用完成朝向已闭合，未支持的链接/骑乘/32/缩放、CBC及其他完整角色/技能仍为明确依赖。POS20/21配对不是对合；不得擅自按旧位置恢复方向。P数组与当前操作者是不同所有者，不能为匹配HUD改写P。

可重复问题：C flags1须等真实入场结束，固定帧数不可代替phase4。两轮网页反馈在旧本地桥固定10秒被BRIDGE_TIMEOUT关闭，WS失败帧和客户端/对端证据保留；现可显式选择1..60000ms，默认10秒不变，实际30000ms完成两轮及移动，真实超时清理仍验。5731走静态Graphic，不是动画；新index6000也须加入独立raster。历史夹具覆盖列表应为现支持集合的子集，旧逐帧断言保留；不能为增加64改历史夹具或删旧帧检查。

本轮0 VM/CUA/原程序/官方动作，不重放旧WER、安装或账号分支。377候选备份加桥原件1份，均对上192原hash；初次备份元数据脚本遇到已存在Web候选后停止，两份原件核对有效，未重建/反推备份。完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-change-v1/source-check.json)、[规格](../analysis/game-battle-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-change-v1/test-results.json)、[TCP](../analysis/game-battle-change-v1/network-validation.json)、[验收](../analysis/game-battle-change-v1/validation.json)、[剩余目标](../analysis/game-battle-change-v1/goal-audit.json)。

<a id="stage192"></a>

## stage192：普通PSN已通，附RID和完整战斗继续

普通selector0/1/2的真实结算/数字/等待已闭合；附RID、未知选择值、链接/缩放及未证角色分支仍返回明确依赖。逻辑值没有复刻编码存储和由读取触发的全局RNG，不能将独立RGBA比对说成原生整程序时序/像素等价。

候选备份清单问题：沿用旧清单漏了本轮要改的shared/legacy-game-battle-strike-playback.mjs。该文件在编辑前的2863文件整体验证中已与191基线一致；收尾仅在私有字符串逆向本轮精确改动，所得11131B/SHA256 ff0fc4e2…82d38380与原基线一致后保存私有副本，当前产品未回退。审计明确区分80事前备份与1后补重建基线，不能把后者说成事前备份。后续应从当前目标模块和完整交付清单生成候选表，覆盖新引入的依赖。

可重复夹具问题：新增字体与旧字体负号ID重叠时须保持每个resource唯一；RD原始像素仍按已证4字节行对齐，不得为通过测试放宽格式。人物资源扩展须放在四个动画/图像补丁之后，浏览器与成功的源TCP路径一致。错误日志和修正说明见测试记录。新REA快照保存成功且session已关闭，保留190独立档案，完整并集679/2222与快照2146分开记录。本轮无VM/CUA操作，不重放旧WER或安装分支。

完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-status-v1/implementation-plan.json)、[源核验](../analysis/game-battle-status-v1/source-check.json)、[规格](../analysis/game-battle-status-v1/implementation-spec.json)、[测试](../analysis/game-battle-status-v1/test-results.json)、[TCP](../analysis/game-battle-status-v1/network-validation.json)、[验收](../analysis/game-battle-status-v1/validation.json)、[剩余目标](../analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：基础网页战斗可操作，完整平台边界保留

已修复实际网页战斗被隐藏、未绑定核心的问题；独立战斗呈现必须取640×480，不能沿普通320×240裁剪。source意图不能在未完成帧上直接重复提交，适配最多保留一个，实际文件读取取消/暂停后重试仍只发一次G。返回缺坐标要等待真实消息，不将依赖缺失当完成；未知动作停住且不空转。phase2在已完成一轮后显示等待下一轮C。

页面状态文字只在变化时改写，以免每个回调重复触发live播报；目标DOM节点保持，姓名/HP/MP以文本呈现。终止后战斗面板确实隐藏，验证隐藏控件应使用DOM定位，不能以role默认可见搜索误报缺失；最初失败日志已保留。实际原创建字RD损坏会关闭该会话，不用替代图片掩盖错误。

完整其他技能/handler/人物分支、原生菜单/命中/音频/渲染与池调度、其他玩法和历史未配置49统一仍缺。手机仅Chrome触屏仿真；File目录选择、127.0.0.1之外跨设备网络及真实手机、原生微信Page/DevTools/设备/现行与官方未证明，无测试账号。本轮没有VM/CUA新操作，不回放历史安装或WER分支。

[来源核验](../analysis/game-battle-web-v1/source-check.json)、[规格](../analysis/game-battle-web-v1/implementation-spec.json)、[测试](../analysis/game-battle-web-v1/test-results.json)、[实际页面](../analysis/game-battle-web-v1/browser-validation.json)、[位图核验](../analysis/game-battle-web-v1/canvas-browser.json)、[网络](../analysis/game-battle-web-v1/network-validation.json)、[验收](../analysis/game-battle-web-v1/validation.json)、[目标审计](../analysis/game-battle-web-v1/goal-audit.json)。

<a id="stage190"></a>

## stage190：普通物理已接，完整技能与产品仍待完成

本次实际配置技能目录后，普通物理SKL能经动画驱动HP/MP、反应与KO；缺目录、缺真实C值、glyph或队列容量会在写队列前拒绝。其他类/变体/位、RID、自己/预先死亡/状态/挂件/坐骑/缩放仍是完整阶段依赖，不能默认为普通分支。已配置49按源清槽并标删；旧未配置body切片仍保留历史49行为，完整池移植时必须统一，不能据旧局部测试宣称完整生命周期。

源字体表按param4*4读取，32B不足以说明style6；需要128B确认base243760。倒地等待50粒子的实际完成，不能把源父58当通用elapsed。源11、角度float存储、意图消费时点与跨重入MP计数分别有独立参考/夹具修正，失败日志保留。字体宽8/12只代表本轮原创夹具；未证明步幅/混色/替代渲染仍未解决。

REA保存本轮新快照返回evidence_integrity_mismatch（Analysis snapshot validation failed），未改变工具/安全配置；2210记录导出和675规范函数档案已保存，之后正常关闭且无待清理资源。下次复用有效189快照与本轮档案，不重新问已闭合函数。完整菜单/页面/触屏/原生微信/设备、其他玩法及现行/官方继续缺，无测试账号。本轮未操作VM，未新增VM排障，不重放历史WER/安装分支。

[源证据](../analysis/game-battle-skill-v1/source-check.json)、[规格](../analysis/game-battle-skill-v1/implementation-spec.json)、[测试](../analysis/game-battle-skill-v1/test-results.json)、[TCP](../analysis/game-battle-skill-v1/network-validation.json)、[验收](../analysis/game-battle-skill-v1/validation.json)、[目标审计](../analysis/game-battle-skill-v1/goal-audit.json)。

<a id="stage189"></a>

## stage189：正常返回已接，完整战斗与产品仍有缺口

配置普通return后可从9/1真实推进等待、重建、捕获、13淡入及20/3首帧，成功后新runtime恢复移动。未配置时仍明确unavailable。上一阶段保留旧逻辑actors的理解已修正：源正常入战会清远端记录/本地本体，不能用旧快照恢复；9250c8基址而非仅9250cc载荷拥有unit/action限制。

本轮复现并修复scene回调读取完整world/battle快照导致重入，改只读实际网格中心。场景/CUT更新要保留私有淡入捕获，等待资源不能推进重建/激活；取消最终帧必须保留逻辑帧和提交资格，不能重复回调。独立源指令里的thiscall ECX可能在伪代码中被省略，字段归属须看汇编/xrefs。夹具显示中心与未发网络修正的错误另记，不放宽真实请求判断；原失败日志保留。

完整原生普通池/UI/音频调度、其他main9分支、退出9/type14控制、CHT/BST、完整技能/动作/命中/菜单、产品战斗页面、其他玩法、微信设备及官方仍未完成。没有测试账号。本轮0 VM/CUA，无新VM问题，不重放历史WER/安装许可或操作。[源证据](../analysis/game-battle-return-v1/source-check.json)、[规格](../analysis/game-battle-return-v1/implementation-spec.json)、[测试](../analysis/game-battle-return-v1/test-results.json)、[TCP](../analysis/game-battle-return-v1/network-validation.json)、[验收](../analysis/game-battle-return-v1/validation.json)、[目标审计](../analysis/game-battle-return-v1/goal-audit.json)。

<a id="stage188"></a>

## stage188：退出边界已通，普通返回仍明确未完成

配置exit后可到9/1并发送源请求，仍不能恢复普通runtime；原生440570去投影/9250cc数值、main9重建/捕获/入场渐变、退出9和14真实控制、完整CHT/BST与其他玩法待完成。原始字节名称能触发CHT/BST扫描，出现依赖时先报unavailable，不能静默清空或丢副作用。

本轮修复：world曾将全部battle确认固定按main9处理，现从entry主状态路由；清理参数先检再改状态。client必须保留完整呈现帧私有副本，不能借调用者RGBA或裁剪帧做源捕获；取消捕获/最终发送要复用同一帧与Promise。初次U夹具误用过期round0，已按真实轮次修正，未放宽A条件；原失败与复核前验证日志保留。无新VM/电脑控制问题或操作，不重放历史WER/安装授权。[源证据](../analysis/game-battle-exit-v1/source-check.json)、[规格](../analysis/game-battle-exit-v1/implementation-spec.json)、[测试](../analysis/game-battle-exit-v1/test-results.json)、[TCP](../analysis/game-battle-exit-v1/network-validation.json)、[验收](../analysis/game-battle-exit-v1/validation.json)、[目标审计](../analysis/game-battle-exit-v1/goal-audit.json)。

<a id="stage187"></a>

## stage187：M循环局部可用，退出和完整动作仍缺失

需要显式configureBattleLoop才能越过entry/input的5边界；它只执行已有已移植命令/body，SKL及其他缺失handler返回明确unavailable，不能靠不断调用或等待当作动作完成。END/U/C-end到7后仍拒绝，未实现退出渐变、main9重建和普通playing恢复。

本轮验证了两项跨轮拥有规则：case6回调改为2后仍须完成当前分支，下一次调用才能消费C；实际管理器轮次必须同步到battle接收者，旧A不能误标下一轮。M出队后的像素取消仍保留同一帧，重试不能再次回调/出队；重入与关闭必须丢弃旧帧。本轮没有新增VM/电脑控制操作或其可重复问题；不重放历史WER/安装授权。[源证据](../analysis/game-battle-loop-v1/source-check.json)、[规格](../analysis/game-battle-loop-v1/implementation-spec.json)、[测试](../analysis/game-battle-loop-v1/test-results.json)、[TCP](../analysis/game-battle-loop-v1/network-validation.json)、[验收](../analysis/game-battle-loop-v1/validation.json)、[目标审计](../analysis/game-battle-loop-v1/goal-audit.json)。

<a id="stage186"></a>

## stage186：基本语义输入已通，完整UI/M/退出继续缺失

基础phase4能够通过源条件推进到请求5，M仍未执行；技能/道具/宠物/坐骑/观察、13b4完整子对象、实际窗口/音频/原生命中与产品控件、退出返回及其他完整玩法未恢复。语义目标槽不是原生sprite hit-index，不把接口和基础资源帧计作完整UI。

本轮排障：native写失败会先使session/client关闭，并调用帧任务cancel；catch必须优先保留终端errorCode对应failed，否则误记cancelled。已用真实startup/incoming TCP加原创wx.write失败复现，源/生成两侧验过。像素取消后重试必须复用同一已算frame和发送Promise，不能重发G。中立夹具曾因跨Realm数组prototype导致空数组比较失败，改为host Array.from后严格比较字节，未放宽期望；首次中立失败完整日志被同名复跑覆盖，原失败回执仍在；源写失败完整日志与后续验证日志保留。

REA快照不能作为可执行文件open，需path=原件及snapshot_path；中断后先查open/cleanup状态，本次实际closed，随后导入保存记录、重取三项未落盘观察。代码指针缺FunctionManager入口时，用项目内独立Ghidra导出脚本显式定义；派生分析与REA规范入口分开。没有改全局工具/审批配置。旧登录器deadline测试在并行检查时约47ms返回预期TIMEOUT，但调用次数为1/预期2；源码与测试hash均未变。47ms是整个用例耗时，没有分段时标；调度负载影响仅为推测。保留失败日志，生成检查结束后的顺序全量1565项已通过；这不证明具体被抢占时段。无新VM/电脑控制问题，旧VM/WER不重放。[源证据](../analysis/game-battle-input-v1/source-check.json)、[规格](../analysis/game-battle-input-v1/implementation-spec.json)、[测试](../analysis/game-battle-input-v1/test-results.json)、[TCP](../analysis/game-battle-input-v1/network-validation.json)、[验收](../analysis/game-battle-input-v1/validation.json)、[目标审计](../analysis/game-battle-input-v1/goal-audit.json)。

<a id="stage185"></a>

## stage185：源入场可推进，真实操作与完整主循环仍缺

部分entry0..4、图后C、入场运动和捕获渐变已核，但phase4仍无实际输入/菜单/后续M，phase7/8/9退出未实现，客户端保持battle-pending。popup控制位需要未移植窗口且编号32窗口尚未存在时明确unavailable；完整普通对象池/音频/选择、其他动作/特效/缩放/混色、产品战斗页面仍缺。whole application RNG/UI及官方/设备验收未完成。

新可复现排障：取消初次捕获或C后画面读取后，下一次调用必须重试同一已算frame，不能再次推进fade或消费C；已加真正持有IO再暂停/早恢复的检查。进入新battle前旧ordinary job仍占library时，先busy且不读clock/推进phase；再入场清旧capture/pending。原创对端read-fail曾在end未接收完就关闭而观察到RST，夹具改为核实接收写游标再严格等EOF；reentry入站计数含重复entry/data。缓存渐变任务的inspect原先恒为排队，末轮审查已补完成/取消/失败终态及每个真实渲染job的断言；已重跑。独立Python条件空格错误在生成向量前修正，失败日志保留。

本轮无新VM/电脑控制问题，不重放旧VM/WER；全量1546与四构建/53检查通过不等于完整游戏/官方可玩。[源证据](../analysis/game-battle-entry-v1/source-check.json)、[规格](../analysis/game-battle-entry-v1/implementation-spec.json)、[测试](../analysis/game-battle-entry-v1/test-results.json)、[TCP](../analysis/game-battle-entry-v1/network-validation.json)、[验收](../analysis/game-battle-entry-v1/validation.json)、[目标审计](../analysis/game-battle-entry-v1/goal-audit.json)。

<a id="stage184"></a>

## stage184：基础像素已核，完整战斗仍缺

已证实的基础body/child帧可通过实际client/library任务生成RGBA；网页尚未接战斗frame，仍显示已有未就绪提示。自动main10/渐变/C/M调度、C选择、输入/退出返回、其余动作/坐骑/影子/特效和完整玩法仍未闭合。缩放/混色/特殊绘制返回明确错误，不用占位图或完成位掩盖；背景直接投影真实resource，捕获表面生命周期未恢复。临时basic调用遇到不支持样式会按client失败路径关闭，不声称任意战斗可运行。

排障修正：4198d0第二键为signed270初值0，不是slot；5059f0背景复制priority5，2属于另一个可选记录。447330已有规范证据，本次复查不加函数数。新TCP夹具先补显式session适配器，再用640×480源视口替换继承的320×240裁切视口；两类失败日志私留build。独立Python同键4096排序使用仅本进程10000递归预算。614390零填充无原文件映射，未当实测色值。暂停取消后早恢复仍不得使旧job变致命失败，已有实际IO持有测试。

无新VM/电脑控制问题，旧VM/WER分支不重放；没有真实测试账号，官方兼容未验收。[源证据](../analysis/game-battle-scene-v1/source-check.json)、[规格](../analysis/game-battle-scene-v1/implementation-spec.json)、[测试](../analysis/game-battle-scene-v1/test-results.json)、[TCP](../analysis/game-battle-scene-v1/network-validation.json)、[验收](../analysis/game-battle-scene-v1/validation.json)、[目标审计](../analysis/game-battle-scene-v1/goal-audit.json)。

<a id="stage183"></a>

## stage183：基础body执行已有源反馈，完整战斗尚未闭合

**仍缺：** client已可从真实资源库绑定基础回调，但主循环仍未自动运行main10，画面/输入/退出返回未实现，仍battle-pending。C选择FE0 bit1及复杂C/坐骑/变形/特效、剩余15类M opcode、ESC2/209等仍unavailable。23类分支是限定源码切面，不能称完整244 case或战斗可玩；微信游戏Page/设备和现行/官方尚未验收，无测试账号。

**本轮纠正：** C最后再次推进mode0动画不能漏；420010的x87临时高度先比较/加位置再舍入存储；C移除会预标所有直接子对象，而source49只脱槽不删pool body；231是下一次回调清busy。非法context不毒化owner，资源失败则关闭后续推进。已知466820在查询新callee时未先用目录拦截，产生一次复查；按旧Evidence保留，只计21新规范函数。后续每个新callee先核完整规范目录，不只核初始批次。

**分析能力：** 4204c0在默认provider中not_in_procedure，但420570保存了该指针；复用独立原创Ghidra导出工具得到169指令B并核原PE，未改原程序、全局provider或审批设置。x87任意位一致、原生堆/全应用RNG未恢复。无VM/CUA/原程序/官服新操作，旧WER等已消费诊断不重放。[源审计](../analysis/game-battle-body-v1/source-check.json)、[余下要求](../analysis/game-battle-body-v1/goal-audit.json)。

<a id="stage182"></a>

## stage182：调用级执行已接入，body与主循环仍缺

**仍未闭合：** 新manager与七类动作队列/END等待只能由显式source-context函数调用。244个外层body case的完整回调仍缺，不能清busy假装动画/移动完成；其他16类M handler返回unavailable。main10入场/渐变/自动C/M调度、渲染/输入/退出返回及其他完整玩法仍是原阶段必做项。客户端继续battle-pending，没有新增可玩战斗画面；微信游戏Page/设备及现行/官方无验收，没有测试账号。

**本轮纠正：** 433cd0新角色路径在433a10之后先调用4348e0再施加status，死亡角色也必须如此；已修正首条队列索引并补回归。C的target分支同时更新朝向，entry/之前死亡分支保持旧朝向。EOF处尾部标点需要用原token函数的扫描结果更新两个游标，但剩单字节提前返回；已有回归测试。原队列200cell需要结束哨兵，安全上限199，超出原件可能覆盖相邻计数器，不复现此写法。4347e0不清busy/type且会跳过死亡/type13，不能用reset代替执行完成。

**分析工具操作记录：** 内部地址434820解析到已知4347e0，已单列为一次复查，不冒充新规范函数；后续先查函数目录及规范入口。434a10归一到4349e0是另一个新入口。旧方向表读取为缓存复用，27新增记录实际为11函数查询/11映射/5读取。没有改REA配置或provider边界，没有VM/CUA/锁屏/联网/运行排障新动作；旧v20/23、stage131等已消费诊断不重放。[源审计](../analysis/game-battle-commands-v1/source-check.json)。

<a id="stage181"></a>

## stage181：补充静态函数入口能力与M执行缺口

**已处理的工具问题：** 默认provider缺少4365d0/4260b0/4198d0函数体，已用独立自写Ghidra脚本按原指针播种并逐指令核原件。REA两个invalid_input结果保留，未修改其安全/审批配置。系统无Java登记导致首启失败，复用已有Homebrew JDK21并仅设子进程JAVA_HOME/PATH即可，无需安装。

**仍有边界问题：** 435000两种Ghidra默认体仍28B，不能把延伸伪代码当完整provider体；461B原件/LLVM非调用分支检查单列。动作大回调代码可读不等于已实现执行；main10及图像仍未实现。

**实现纠错：** 测试不存在的incoming导出改为既有catalog+escape；GMN/RID计数按源修正；包内512上限移除，32是并发槽。

[源证据](../analysis/game-battle-runtime-v1/source-check.json)、[规格](../analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](../analysis/game-battle-runtime-v1/test-results.json)、[TCP](../analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](../analysis/game-battle-runtime-v1/validation.json)、[完整目标](../analysis/game-battle-runtime-v1/goal-audit.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：战斗接收已接入，执行与图像仍未实现

**已处理：** 真正入场现在会阻止旧地图继续运行，连接保留；C/P/A/M/U数据有自有状态和关闭路径。测试校验器误把相邻>_U作为入场tag，现按原catalog改为>HY；产品一直按正确4f3430分派。

**工具问题与最小修正：** 40a120响应超过stdio预算，完整记录已在REA保存，导出/读一次native procedure视图继续，未重查函数；summary视图不支持已记录。native value flow仍截断，不能宣称完整语义。4365d0没有provider函数体，使用已核原字节和现有LLVM静态反汇编，不能把它当完整函数/CFG。

[源证据](../analysis/game-battle-transition-v1/source-check.json)、[规格](../analysis/game-battle-transition-v1/implementation-spec.json)、[测试](../analysis/game-battle-transition-v1/test-results.json)、[TCP](../analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](../analysis/game-battle-transition-v1/validation.json)、[完整目标](../analysis/game-battle-transition-v1/goal-audit.json)。

**阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：普通aux04和加入/离开缺口有限闭合

stage178列出的aux04及普通加入/离开请求/回复/确认已有限实现。

**本轮纠错：** 旧3个队伍图像测试的helper数只含父体，现另断言badge增量，不改变原移动/像素参考。新参考未处理resource1整根过滤，已修；测试强制leader与严格controller字段已修。TCP传真实adapter，wait谓词须boolean。浏览器期望标题及人物选项已对齐；收到HFs后旧等待提示现显示已加入。PIL缺席时复用已有Chrome生成联系表。失败材料留build。

**未决：** 完整队伍控制/其他快捷键/modal、战斗/宠物/特效/复合转场、其余纠偏/输入/reset/生产启动/资源/玩法、微信原生gamePage和设备、现行及官方兼容仍未完成。无真实测试账号。完整目标active，本轮无VM/CUA/WER/CDB/原程序/账号/官方操作；stage131已执行恢复的诊断不重放。

[源证据](../analysis/game-party-actions-v1/source-check.json)、[规格](../analysis/game-party-actions-v1/implementation-spec.json)、[测试](../analysis/game-party-actions-v1/test-results.json)、[TCP](../analysis/game-party-actions-v1/network-validation.json)、[验收](../analysis/game-party-actions-v1/validation.json)、[完整目标](../analysis/game-party-actions-v1/goal-audit.json)。


<a id="stage178"></a>

## stage178：队伍输入/跟随缺口已有限闭合，完整队伍未完

stage177列出的f5f170/f536b2→实际pointer/localMovement桥接及461f40坐标候选缺口，现已在普通队伍域实现并验收。

**已纠正：** 首版参考给未收到速度的远端指定80/60/40，实际default100直到Hx，已改独立参考。解散后插值仍持续，测试须请求不同后续目的并等对齐。首次全量八条低层调用方仍传启动队伍flags0，runtime现读取world的source-owned值后核对其他guard，新专门回归通过。一次已知461370查询完整facet一致，规范函数只增12；一次私有ledger提取循环重复读取194MB文件，已只中断自建主机进程并修为单次读取，非VM/目标进程。

**未决：** 完整队伍UI/加入离开响应、aux04队长/模式图标、战斗/宠物影子/活跃复合转场、其他文字/UI与完整纠偏/输入/reset/生产启动/玩法、微信原生gamePage及设备、现行和官方兼容仍未完成；原生x87与非法重复身体/空指针行为未复现。完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。

[源证据](../analysis/game-party-follow-v1/source-check.json)、[合同](../analysis/game-party-follow-v1/implementation-spec.json)、[测试](../analysis/game-party-follow-v1/test-results.json)、[网络](../analysis/game-party-follow-v1/network-validation.json)、[验收](../analysis/game-party-follow-v1/validation.json)、[完整目标](../analysis/game-party-follow-v1/goal-audit.json)。


<a id="stage177"></a>

## stage177：队伍输入/跟随缺口与中性表参考

**未决：** HFs槽位和成员状态已存，但f5f170/f536b2尚未动态桥接到现有显式本机输入/预测上下文；461f40队列、aux04队长图标、battle250..252及宠物影子值源未实现，不能称完整队伍系统。源pair0/pair1未擅自命名HP/MP。

**已纠正：** 独立条值参考误用普通测试表；source flag4使用中性原表，按已核固定色项修正参考，未改产品迎合。TCP/浏览器草稿的命名替换污染context/rasterText/read_text或仍导入旧fixture，已修正原创验证脚本。失败bootstrap会清本轮自建temp，遗留7目录经精确realpath和非符号叶目录核对后清理；未动无关目标。初稿resource1测试标题还称duplicate，已拆出真实duplicate/outside/成员引用回归。

[源证据](../analysis/game-actor-vitals-v1/source-check.json)、[合同](../analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](../analysis/game-actor-vitals-v1/test-results.json)、[网络](../analysis/game-actor-vitals-v1/network-validation.json)、[验收](../analysis/game-actor-vitals-v1/validation.json)、[完整目标](../analysis/game-actor-vitals-v1/goal-audit.json)。

队伍跟随/本机输入上下文同步、aux04队长/模式图标、宠物影子及战斗条源、其他文字/UI、完整纠偏/输入/reset/生产启动与玩法、微信原生gamePage/设备、现行与官方兼容仍未完成。HFs已存状态尚未动态桥接f5f170/f536b2到现有显式输入上下文；完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage176"></a>

## stage176：文字覆盖范围、夹具转义及字形边界

**已实现的有限范围：** 普通姓名lane0，raw byte测宽、六档选择、Hr]列表与field28、显式文字端口。font1使用宿主字体时，GDI字体映射/ACP/ClearType和像素完全一致尚未证明；其他文字lane、气泡/菜单/aux04/HP/队伍仍待源证据闭合。

**可重复夹具问题及最小修正：** 全包C0复合标签少外层反斜杠时，线路解码提前产生分隔符，同伴标签为空；原创包改用既有两反斜杠z序列，直接owner测试消费真实decodeLegacyGameMessage参数。勿改产品语法迎合测试。resource1试验若覆盖80002唯一lookup，会影响另一静态物件；隔离该无关原创建模对象。骑乘完成由实际AP控制，不用未知74动作或另一夹具的16回调预期。

**工具/证据：** close响应是1550记录/364943731B等快照统计，不含literal closed；按结构核验。Pillow缺失时可用既有Playwright生成QA联系表。32新REA中505840是已知函数重查，534598读取是缓存复用。Chrome4条QA读回性能提示保留，0应用警告；产品字形Canvas的willReadFrequently用于真实反复mask提取，非为截图调参。失败首稿/日志在build保留。

[源证据](../analysis/game-actor-text-v1/source-check.json)、[合同](../analysis/game-actor-text-v1/implementation-spec.json)、[验收](../analysis/game-actor-text-v1/validation.json)、[测试](../analysis/game-actor-text-v1/test-results.json)、[网络](../analysis/game-actor-text-v1/network-validation.json)、[完整目标](../analysis/game-actor-text-v1/goal-audit.json)。

HP/队伍、其他文字通道/聊天/头顶气泡/aux04/菜单、完整本机纠偏/输入/reset/生产启动与中文语义、战斗及其余玩法、微信原生gamePage/设备、现行消费者和官方兼容仍未完成；整体goal active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage175"></a>

## stage175：状态图标边界与新排障记录

**已实现：** 已将真实45..49/63/64/99和远端40/41/42/44的状态字写入接入actor/world/frame；primary、transient、side图标按前帧偏移、人物高度、资源覆盖顺序、声音、601回调计时及type1队列绘制。源99的raw80门控同步实际指针/移动/镜头/回调；状态全局字与人物31c时长分开，重建时仅时长和自有子对象归零。 27项新增、1355项全量Node通过；546组控制、1540组图标选择/拒绝、1003组高度/旧偏移，共3089个独立例。720帧完整场景/224种SHA、12帧预解码/延迟精灵像素对比、6条实际原创TCP的1660帧一致；7neutral/7生成工程通过。四份新构建App116输入/11输出、API91输入，均0external，原生game Page仍未实现。

**仍未知：** 99的80位在普通lane先阻断回调，自定义图标globals/其他入口未闭合；variant仅16项采样前缀，不能接受任意索引；primary存在而transient未分配的43dd96是静态空指针条件，独立实现显式错误，不诊断原程序实际崩溃。本机纠偏及队伍生产者继续待证。

**可重复QA问题：** 浏览器在开发桥内静默等601回调，会先超过既有10秒idle，关闭后的copyWorldState报LEGACY_CLIENT_CLOSED。最小处理是用确定性core/真实TCP/neutral验证长计数、浏览器验证有限实时状态；不改桥时限、不发伪心跳。32张最终图以mode/viewport唯一命名；初稿重名和首次关闭错误留build。阶段结束已运行最终全量、构建和11条UI路径。[源证据](../analysis/game-actor-presentation-v1/source-check.json)、[合同](../analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](../analysis/game-actor-presentation-v1/validation.json)、[测试](../analysis/game-actor-presentation-v1/test-results.json)、[网络](../analysis/game-actor-presentation-v1/network-validation.json)。

姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：60尾段已实现，其他UI消费者仍待闭合

source60 aux34构造、更新、绘制与释放已有静态及独立客户端证据。其位置叠加身体与坐骑当前AP；只有helper0提交，返回1或负数即使保留旧图也不绘制。去重根-1仍更新动画/事件，离屏删除跳过；状态1/2/3暂停而非丢弃对象。[证据](../analysis/game-actor-attachment-v1/source-check.json)。

旧骑乘测试要求60非零参数必须报未建模已过期，已改成自有隐藏对象断言；本轮21新核心用例首跑全绿。随后补充预解码路径，最终1328全量通过。浏览器控制时点不冒充独立源帧，hash观察与逐帧验收分开，2条QA读Canvas提示单列。[测试/复核](../analysis/game-actor-attachment-v1/test-results.json)。

其他43d150姓名/状态/队伍/UI仍未实现；静态零谓词异常不等于原程序泄漏。无新VM/锁屏/设备/原程序观察，不改旧Windows故障结论，不重复消费历史诊断授权。现行/原生微信/官方仍待证，已有“无测试账号”信息继续有效。


<a id="stage173"></a>

## stage173：骑乘已闭合范围与未决

70/state1/2、普通骑乘、附着点驱动的完成、复合绘制、1024子队列及演员自有生命周期已有静态与独立客户端证据。source60附属绘制、队伍和其他消费者仍未闭合；不能因为438bc0构造返回指针已证就把附属绘制标完成。4ff430的aux34/38静态零谓词异常不等于运行泄漏。[证据](../analysis/game-actor-ride-v1/source-check.json)。

本轮修正：屏幕投影应在特殊运动之前、根深度在之后；普通骑乘动作映射须读取真实动画写入，不能将观察值反写为新动作。测试的前置坐骑、入口准备、geometry查询字段及镜头预期单独纠正。首稿移动端截图重名已改唯一名称并重跑，最终16图已查；QA读Canvas的3条性能提示与0应用警告/错误分开记录。[测试/纠错](../analysis/game-actor-ride-v1/test-results.json)。

没有新VM/锁屏/设备/游戏原程序观察，不更新历史Windows故障结论或重新消费诊断授权。原生微信、现行消费者、生产启动/中文与官方验收仍待实际证据；当前无测试账号，不重复索取。


<a id="stage172"></a>
## stage172：源特殊回调与正常/身体字段的可重复问题

**已修复：** 原80只换资源，真实client的action3断言0≠3；现接入源状态3/旋转/结束。初稿虽通过首批回归，结束后仍每帧把正常朝向写回身体，移动中旋转回归5≠4暴露了来源混淆。最小修复是仅按实际运动/转向写入更新身体，并让转向资格比较真实body；场景重建仍读正常源。20新增/1277全Node与所有最终v2构建、TCP、Chrome重验通过。[红绿和更正](../analysis/game-actor-spin-v1/test-results.json)。

**源边界：** 0..360旋转后不是直接结束；probe返回1才恢复，再执行mode0并留counter1。静态/冻结返回0不补成功。特殊分支本身无普通远端运动、culling/dedup或local flag1，事件坐标也不随旋转显示偏移。骑乘/附属普通处理器未实现时保持显式缺口，不借source80顺带宣称完成。

**夹具与QA：** 逻辑参考graphicBase1000不等于磁盘group0的0；动作逗号不等于C0 Tab。只更正合成编码，独立400帧期望未变。时钟reset包含立即首帧，17ms可能两更新；方向4用192,136，160,152为5；空路径没有finalFacing，转向测试复用已有独立非空部分路径。两条Chrome Canvas提示由QA读像素产生，0应用错误/警告，禁止为消除测量提示改产品context参数。失败与旧候选保留build。

**未决：** x87位级同一性、原生溢出域、state1/2/骑乘/party/child及全部输入/UI生产者、生产启动/中文、原生微信宿主、剩余玩法/current/官方仍在[下一步](../analysis/game-actor-spin-v1/goal-audit.json)。本轮无VM操作，既有VM排障知识库及stage131已恢复诊断不重放。


<a id="stage171"></a>
## stage171：源输入串接、100键边界与未闭合处理器

**已修复的产品问题：** 最终复核发现新远端初始朝向误用runtime.soundScene。实际scene mode1/sound0的client回归重现0≠4；源链wire8→45f2a0参数7→4649b0参数4→957e88已核对，主5显式准备0另有证据，声音消费者实际读f5f17c。最小修复是在真实场景处理时更新演员mode，保留现有朝向，非零mode按源短路不依赖归一化；禁止由相似命名或默认0补输入。18新/1257全Node及所有最终构建/TCP/Chrome重验通过。[源证据](../analysis/game-actor-context-v1/source-check.json)、[红绿回执](../analysis/game-actor-context-v1/test-results.json)。

**源边界：** 远端构造栈保留一个归一化参数，ESP+20不能按本机分支解释为mode15。record type是注册时的值，body是累积位，draw是当前值，不能全部覆盖或全部OR。普通物件只存100个去重键，第101个不同键及其重复仍显示；不能用无限Set“优化”改变源语义。包含±16边界，重复保活，远端越界需同时释放动画所有者。

**验证操作：** 59a2dc是data/xref而非指令；检查器分类后74字节/映射与1xref通过。独立参考的submittedActorIds曾按插入顺序记录，现使用既有独立源排序；像素模型原本已有排序，未改产品迎合夹具。frame测试需显式选graphics/animations，不能展开含额外句柄的catalogs。保留初轮失败与修正后回执，完整2384项前检和23备份已在编辑前完成。

**未决：** record gate/special/frozen/child、输入/party生产者、完整UI/native回调及生产启动/中文、微信原生宿主、剩余玩法/current/官方仍未完成。未知compound处理器继续失败，不默认普通路径。[下一步](../analysis/game-actor-context-v1/goal-audit.json)。本轮无VM操作，既有VM排障知识库和已执行恢复的stage131诊断不重放。


<a id="stage170"></a>
## stage170：本机初始化边界与可重复分析/测试问题

**已处理：** 提前位置/朝向不再因本机对象尚未建立而丢弃；普通ready换场景不沿用旧坐标/动画key。局部对象提前存在且已知速度时仍等真实本机单位/地图。重复@Qu不会回卷运动或复活删除对象。19新/1239Node、8新实际TCP与11Chrome通过。[复现与修复回执](../analysis/game-local-bootstrap-v1/test-results.json)。

**REA操作：** 43ba10由构造器DATA引用且可解码，却不属于provider的procedure。最小检查是resolve_containing_procedure及exact instruction，再复用已留objdump/原字节；不要猜近邻函数或重复失败的analyze。公开规格保留该缺口，未知边界不算新dossier。[证据](../analysis/game-local-bootstrap-v1/source-check.json)。

**验证操作：** 解析器状态可能先于异步client状态更新；TCP断言同时等待来源状态与所有者转移。碰撞未知时display仍未知，需显式已知碰撞/合法movement context。原始initialNotice故意不匹配，成功用例需updated cache/final checksum配对。固定页面预有隐藏Canvas节点；等待的验收应看零presentations、无活动host与stage隐藏。失败日志和具体更正均保留。

**未决：** sourceEntryWaitMask是已支持消息的保守宿主投影；完整native922c4c/场景条件、party/child/全reset仍未闭合，不能将普通子集推广为任意main9场景。生产启动/digest/中文、原生微信宿主与余下玩法/current/官方仍在[后续目标](../analysis/game-local-bootstrap-v1/goal-audit.json)。本轮无VM操作，不重开已执行恢复的stage131 WER或其他历史排障分支。


<a id="stage169"></a>
## stage169：真实生命周期修复与固定入口范围

**已复现修复：** scene context回调在frame推进中调用public copyLocalMovement触发FRAME_REENTRANT，改用既有只读world快照并清临时字节，保留重入保护。角色被移除后旧runtime曾保持open，现按实际丢就绪立即失效Canvas/input并关闭，收到真实角色记录再准备新runtime。metadata/CUT晚I/O、异常hook与close/EOF已覆盖，不以结果不明当清理通过。

**已复现修复：** 多目标browser game adapter只保留选中端点，使第二目标被发为ordinal0，重连在认证前IO失败。新增可选完整有序endpoints并逐层转交；实际WS第一目标0连接、第二目标5请求，以及同页两次独立owner/bootstrap均通过。禁止靠重排runtime、放宽桥规则或把bridge ordinal当游戏wire字段解决。[回执](../analysis/game-browser-owner-v1/test-results.json)。

**测试与观察：** 正常自动时钟会推进idle动画，不能强认旧固定首帧；独立240更新/13摘要验证后再比较。字符串Function被CSP拒绝属于测试脚本问题，改只读状态轮询，无unsafe-eval/bypassCSP。dependent测试必须等生成器真实终结；曾提前读旧无tick文件的失败记录保留。当前22新增/1220全Node、7Chrome通过，5最终图查看；手机准备表单已自动收起。

**仍未完成：** 固定web游戏入口已实现，但startup是派生配置，hash只作声明；context/启动摘要/中文编码生产链和完整原生UI未绑定，现页面名称限ASCII。当前桥仍原创回环10秒/4MiB，未变成持续官方游戏通道。native微信game Page/Canvas/file/scheduler、余下玩法/current/设备/官方继续未验。本轮未操作VM/CUA/WER/CDB/原程序；旧VM排障正文与授权执行历史原样保留。[目标](../analysis/game-browser-owner-v1/goal-audit.json)。


<a id="stage168"></a>
## stage168：默认值纠错、逆表边界与未决运行上下文

**已修正的真实问题：** 旧预览实现和独立参考共同把0x814c误算为33000，普通对照测试因此不能发现。原0x45874c/file359244字节c787f8e9f5004c810000证实33100；共24/1128预览行修正，其余集合不变。新增直接指令核对及真实TCP默认值入场链，当前1198全Node通过。禁忌是全局替换所有33000（合法输入仍保留）或把历史绿色测试当正确fallback证明。[修正](../analysis/game-character-options-v1/fallback-correction.json)。

**静态范围而非运行崩溃：** 501200只设14项逆表，外层classify包含242800可取index14；保留临时classifier也可使异常code进此支。独立实现原子拒绝实际越界、不改原记录、不发送命令；没有运行原目标验证崩溃，不编造stack值。15296参考用例含边界。

**升级未决：** 类别7的runtime923c40只有已知reader，生产者/材料含义未证；禁止伪marker。generation1源入口可停在phase2，宿主要求gen>=2单列。源无deadline，等待可由外层关闭；不借登录/创建超时，也不后台retry。成功仍需确认返回再取真实名单，不能本地改category或当官方许可证明。

**完整目标：** main5虽清点18直接callee，只闭合selected appearance→f536a4/field16；wrapped/raw初始化、UI/IME/chat/profile/mail副作用和main9上下文未完整。正式game/resource/Canvas owner/page、生产编码、删除/余下玩法、native微信/手机、current9baa/6e2ff/官方继续未验。本轮无VM/CUA/WER/CDB新动作，原操作排障知识库与授权执行历史原样保留，不新增虚构VM结论。[目标审计](../analysis/game-character-options-v1/goal-audit.json)。


<a id="stage167"></a>
## stage167：固定删除等待体、创建边界与编码范围

**已定位、未补造：** 37c4的删除确认进入455810/455820；后者完整体只绘制等待窗、恒返回0，458900所需非零返回在该体中没有依据。V)b已观察为no-op，但不能因此声称所有版本均不支持删除。删除发送消费者尚未闭合；不得用本地删行或猜报文宣称服务端删除。

**创建边界已验证：** commit成功后main3仍要重新取列表，charactersReady为首次菜单Promise；调用者必须等待新状态choosing再选人。错误/600001ms保持连接，显式ack返回旧记录菜单，没有自动重发。close历史可保留sourceCreateCompletions，但不可据此恢复控件/游戏；真实Chrome覆盖控件已关仍收到成功，以及成功观察器关闭会话，两者复活/入场回调均0。

**未决：** UI名称经显式编码端口；浏览器原创夹具仅用ASCII，生产中文编码尚未绑定。默认CRT空白/控制mask已核，locale变化与原生截断编辑器未模拟。分配项采用中性标签，属性语义未证；预览像素、profile.dat与main5完整reset未实现。外观/look/aux、正式页面/全runtime/current/官方仍未完成。18新增/1179Node、4TCP/5Chrome通过，本轮无新运行故障。[证据](../analysis/game-character-lifecycle-v1/source-check.json)、[验收](../analysis/game-character-lifecycle-v1/test-results.json)。

本轮没有VM/CUA/WER/CDB新动作，stage131已用诊断不重放；下方VM排障知识库历史正文保持不变。


<a id="stage166"></a>
## stage166：选人边界、晚到入场与测试夹具

**已覆盖的宿主限制：** native main5的完整UI/global/object reset未重建。可选postLogin仅允许首次进入空scene/map/local actor、remoteCount0的genuine borrowed world，选择及main5边界检查；已有世界拒绝，不静默清空或把field15当actorID。源preview只修数字，人物预览像素/对象仍unmodeled。creation/deletion/look/aux与正式页面继续待办。

**已验证生命周期：** characterEntered等Promise可在close后resolve保留sourceEntered历史的closed快照，消费者必须检查live ready；picker已检查结果和当前session，并用close代号抑制晚到callback。真实Chrome分别覆盖“只关控件，连接后续收到成功”和“观察器在成功轮询时关会话”，回调/控件复活均0。原有借用world/library关闭责任保持。

**测试问题已改正：** stats getter在测试对象spread后成为初始常量，导致两项计数断言误报；转发getter后28定向/1161全套通过。browser status-role同时匹配picker状态和测试output，定位限制到picker后5流程通过；产品无对应故障，也未关闭限制。原失败日志保留，见[回执](../analysis/game-post-login-v1/test-results.json)。REA的5111a0已分析却重复一次，不计新函数；后续查询过滤已知入口，保留两条记录及原因。

**未决：** 完整game owner/页面、原生UI/reset/其他人物生命周期、模块摘要/票据版本绑定、remaining party/battle/business/current与官方验收。本轮无VM/CUA/WER/CDB新操作，已消费stage131诊断不重放；下方VM排障知识库原文不变。


<a id="stage165"></a>
## stage165：会话生命周期与浏览器原生端口

**已修复，可复现：** source session的onPacket返回挂起Promise后close，初版done先结算、包在async finally才清零；现追踪activePacket并在终结快照/Promise前同步清零，晚到callback不再推进读流。定向回归及实际浏览器/完整1133Node通过。

**已修复，可复现：** 将window.setTimeout保存在options中再以options.setTimer调用，会在真实Chrome触发LEGACY_SESSION_TIMER、连接尚未打开；现所有函数端口无伪receiver，浏览器默认明确调用global timer方法。不能只用Node定时器验收browser端口。独立receiver测试和真实WS→Canvas验证通过。

**测试夹具问题：** 复用的native TCP夹具只接受fixture.invalid:12345，首次用了另一逻辑目标；修夹具参数，原平台限制未放宽。neutral测试的clearTimer未定义仅改为显式clearTimeout。不要据这两次失败推定游戏或WeChat原生不兼容。

**浏览器测试环境：** 直接替换活跃登录页DOM会与其late handler冲突；合成route.fulfill的导航响应还观察到ERR_BLOCKED_BY_LOCAL_NETWORK_ACCESS_CHECKS。专用`web/tests/fixtures/legacy-game-session.html`由正常HTTP提供后，两视口通过，安全flag/权限未改。响应合成与地址空间判定关联是推导，非完整浏览器根因诊断；[官方LNA地址空间说明](https://developer.chrome.com/docs/modern-web-guidance/guides/security/local-network-access)。原失败回执保留于本地build；[逐项记录](../analysis/game-session-runtime-v1/test-results.json)。

**未决：** next主阶段3尚未闭合；模块摘要完整算法/生产绑定、aux405620、完整UI/runtime/game owner/正式页面、自动心跳/重连、当前版本和官方仍未完成。borrowed world/key/cache必须由外层关闭，done不替所有者清它们；同一bundle创建genuine world。stage131 WER已执行和恢复，本轮未重放，也未更改下方VM排障历史。


<a id="stage164"></a>
## stage164：异步资源生命周期与尚未接入的应用边界

已连接真实路径/范围读/中性色表/拥有缓存、数值drawPlan和异步Canvas；21新增/1108完整、2neutral、7生成工程、双视口各53摘要与7异步检查通过。真实主机641666图形/2520动画目录、36像素分支与独立参考匹配。[回执](../analysis/game-resource-runtime-v1/test-results.json)。

实际修正：clipped命令的省略flip须按0，不能新增必填导致场景失败；source flag4不是普通default调色板，须用原始CGP快照和黑1；旧timer不能在stop/resume后再读源或调度，需generation/handle/once；I/O后按绝对deadline剩余等待，clock回调关闭也须再核对owner。已验证：取消后的读失败归一cancelled，释放pin，不提交陈旧像素；scene变化丢弃旧结果；retry原plan不重播逻辑或请求。

排查注意：4649b0曾在已读完整dossier后被多请求一次，不算新函数；507d70是音频、44b610是平均色，未按错误角色实现；535d10读零无运行时资源含义。缓存是独立LRU预算而非原生贴图池复制；显式neutral不代表动态LUT/命名palette。readCut返回调用者拥有的CUT；File端口借用，需由其owner关闭。实际Page/launcher会话的消息排队、重配scene/CUT与owner切换尚未接线，微信生成工程仍无游戏Canvas。

完整登录页→游戏接线、微信游戏Canvas与原生文件/调度、真实runtime/record/UI上下文、动态LUT/命名调色板/效果、骑乘组队/primitive/小地图、战斗/其余业务及认证、现行与实际三端/官方可玩仍未完成。旧版37c4源码与当前安装资源能按格式组合验证，不构成9baa/6e2ff消费者或官方接受证明。 本轮无VM/电脑控制新问题，不改既有VM排障知识库，不重放已消费WER/CDB/原生停止点或重复索取账号/PDB。

<a id="stage163"></a>
## stage163：输入/相机/clock与浏览器夹具边界

已实现源输入/正常clock/runtime/Canvas；20新增/1087完整、2neutral、7生成工程和双视口53像素摘要通过。复核修复了server位置修正导致提前用新camera拾取，以及ownGate时不应跟随的问题；原camera明确归runtime，初始值由host提供。[证据](../analysis/game-input-runtime-v1/source-check.json)、[测试](../analysis/game-input-runtime-v1/test-results.json)。

可复现夹具问题：普通capture在pointerup后触发lostcapture，不能清掉同轮press，现仅异常仍活跃pointer才reset；真实mouse/touch快点已验证。首次HTTP白名单漏vendor.js而404；读回像素性能提示仅在测试context启用willReadFrequently解决。REA composed workflow和Ghidra provider/profile不同，不能统一断言；分别严格校验。provider内fixture先读world会提前触发world门，测试runtime重入时应在外部预构造参数。

**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

当前输入UI/party/record仍显式本地上下文，右键业务只标unmodeled，cursorStyle不是packet。source auto在release后持续；stop仅停宿主调度/清raw按钮，resume不伪造auto取消。原uint32 clock wrap可长期等待，reset必须显式；单tick采样、x87逐bit/性能未验。异常可部分推进，需重配帧系统，不声称回滚。完整资源与原生 runtime/record/UI 上下文绑定、右键交互、小地图/primitive/特殊角色/特效、战斗/其余业务及认证、现行版本、实际三端与官方可玩仍未完成。旧版37c4不等同9baa/6e2ff；本轮没有VM、WER、CDB、账号、官服或原生IDE新操作，也未重放已消费停止点。 本轮无VM/电脑控制新问题，既有VM排障知识库和授权停止点保持。

<a id="stage162"></a>
## stage162：普通源场景已接通，宿主/UI仍缺

**已修正/实现：** CUT文件记录18B而非runtime20B，341资源/401103数值相符；渲染窗口不是碰撞窗口；多格物件不能统一按深度值排序，type3队列、ID1根分组/过滤与动画物件直接正常队列已区分。地图动画首次只创建、资源/锚点捕获、隐去保留/scene释放有144原创帧与实际TCP52帧。源裁剪/翻转经独立纹理块模型核对，整数ordinal不保留JS负零。[证据与回执](../analysis/game-legacy-scene-frame-v1/test-results.json)。

**复现过的验证问题：** 初次并行全量旧35ms截止测试出现1/2请求断言失败；隔离及最终同命令全量1067项通过。未改bootstrap实现/测试，负载影响为推测，首次失败和复测材料保留。不要为固定请求次数放宽总截止行为，也不据首次时序失败宣称网络产品回归。

**当前限制：** tileCenter/drawPrimitives及runtime/record仍显式上下文，真实输入/帧时钟/资源/Canvas宿主未接。原生UI/清屏/minimap/primitive、named palette/特殊效果、骑乘组队、战斗/其他业务/认证与现行/实际三端/官方仍未完成。scene错误可能已推进部分状态，需重新配置；actor输出/移动请求/协议保持可用，禁止写成事务回滚。337AUT仅盘点metadata，463780签名受大栈探测影响，不能把伪代码直接当可编译实现。优先继续源输入/时钟与游戏宿主，再补其余完整目标。本轮无VM/电脑控制新问题，不改旧VM排障记录，不重放已消费停止点或重复索要账号/PDB。

<a id="stage161"></a>
## stage161：普通实体层已连接，完整场景仍缺

**已修复：** wire同动作phase重置未接播放器、helper后cached action未回写、移除/重建播放器身份、延迟转向消费、同层创建顺序和原生深度比较器非自反问题。新分配器证据纠正初始图形索引0→−1；旧原创参考282标量仅该值变化。复核发现错误对象descriptor代理可在错误码读取期间关闭协议并导致陈旧返回，已以失败用例复现，补取码后的active检查并纳入回归。完整Node1050及448耦合/52TCP帧通过。[证据与回执](../analysis/game-legacy-frame-v1/test-results.json)。

**当前限制：** callback source/runtime依调用者明确提供，非已恢复的全部record语义；specialState/child/bodyFlags&400处理明确拒绝。普通实体RGBA不含完整地形物件、骑乘/组队、named palette/effects、实际输入与资源宿主。绘制失败可能已部分推进motion/phase，帧系统failed并释放播放器，保留当轮移动请求与协议；需修复提供器后重新configure，不宣称整帧回滚。禁止用JS稳定排序替换源非自反比较器，禁止把tick/step猜成16ms或把旧样本当现行兼容。[接口](module-interfaces.md#stage161)。

下一步复用已保存REA证据分析完整463410地形/物件合并、原生record上下文及特殊回调，继续完整scene/input/resource host和玩法/认证/现行/三端/官方验收。本轮没有VM或电脑控制操作、未重放已消费WER/CDB/原生停止点，也没有重复索要不可用账号/PDB；原VM排障记录保持原状。

<a id="stage160"></a>
## stage160：动画时序、phase含义和归档编码问题

**源约束：** actor+2b4是cached previous action，旧API名phase不代表frame/time；新player独立持有lastAction。同动作wire重启必须接invalidate，实际callback每update可能多次调helper，不猜一RAF/16ms一次。source动作count0是加载失败−1，empty frame loop会越界，独立拒绝；once空frame走complete/255。source duration先除frames×16、percent乘法先uint32 wrap后/100；flip的C整数0不得保留JS负0。actualRD尺寸与源origin、ordinal/resource身份明确区分。[合同](../analysis/game-legacy-animation-v1/implementation-spec.json)。

**可重复归档故障：** 本机Python3.9.6直接执行含中文的collect_results.py两次报告Non-UTF-8 line32；同一完整文件UTF8解码及compile(bytes/str)成功，根因未确认，不推断为产品错误或全局工具故障。最小已验恢复为只把该私有helper中文literal改成等价Unicode转义ASCII源，执行/输出成功，原件和错误记录保留；未改全局编码、工具安全配置或产品来规避。后续长中文归档helper优先用明确数据文件/转义并分步核验，不把未执行脚本当文档完成。

**未决：** source场景排序/合并与callback/actor/network lifecycle、named palette、非普通style与audio设备/资源host、完整game input/frame/scene/battle/auth/current/三端官方可玩。drawCommand只支持selector0、flags0..7、FFFFFFFF和已验证sprite尺寸，遇其他style明确拒绝；目录仍保留metadata供后续实现。本轮无VM操作，不重放旧停止点或再问已无账号/PDB。


<a id="stage159"></a>
## stage159：源图像安全域与未完成绘制

**已复核症状/原因：** Native511470对compressed无精确展开校验；两组27854记录中34条过展开，独立实现明确拒绝，与旧结构模型拒绝ordinal相同，不尝试猜修。507230上调width为4对齐但未重排字节；未对齐宽度及超过正signed16 cache尺寸只允许字节解码，绘制拒绝，不补零行或借用旧scratch。palette尾不足768B时仅完整triples为已知，引用未知色拒绝；实际接受样本使用色均可知。[源与范围](../analysis/game-legacy-render-v1/implementation-spec.json)、[比较](../analysis/game-legacy-render-v1/corpus-comparison.json)。

**可重复操作问题：** 资源oracle首轮把relative输入路径对absolute root做relative_to，生成metadata时失败；最小修复为resolve该输入目录，复跑oracle/JS比较通过，无产品改动，日志/exit1保留。449cf0大value-flow截断及surface/upload错误参数签名使用完整保留汇编/literal闭合；4499a5不是指令边界，不将其当源anchor。507200没有procedure，不强改Ghidra数据库，48B原字节＋GNU有界反汇编确认比较器。禁止为重读已完成dossier反复请求REA。

**未决：** 仅普通native32 full-sprite软件投影；animation/actor-resource/scene/input/frame实际host、special commands/scale/crop/GPU/blend/night/fade和完整业务/战斗/auth未完成。局部RGBA与构建不作当前/真实三端/官服可玩证明。本轮不操作VM，历史已用诊断/IDE停止点不重放，也不再索取已答无账号/PDB。


<a id="stage158"></a>
## stage158：原生路径前提与本机上下文边界

**已遇/修正：** 首turn测试只挡一个邻格，却留原生diagonal detour；正确得到移动请求导致35/36。改用独立部分路径、终点方向不同于末步方向的真实案例，先跑到arrival再断言strict500/uint32 wrap；仅改夹具，失败log/receipt保留。另加source graphics record+10容量边界，最终37/984/2neutral/7工程通过。[回执](../analysis/game-legacy-local-movement-v1/test-results.json)。

**源易错：** 403370是wrapped值>参数；unused lookahead算术返回值不能当coordinate赋值。GraphicInfo40B文件与32B runtime不同，28/29/30/36字段不能照runtime偏移读文件。地图collision用mode1bit100与mode0完整顺序，raw第三层零缺块不能掩码代替；cell2并非阻挡。planner不是A*，same-point/100outer reset和不安全fallback不同；本机display在arrival更新、phase在下一idle重置。[源合同](../analysis/game-legacy-local-movement-v1/implementation-spec.json)。

source context必须明确，缺own/speed/display/cache拒绝；unmodeled own/compound动作使预测失效。scene只重置controller，完整条件本机生命周期仍未建；party/ride/附件/正arrival countdown/UI效果与event response、renderer/战斗/auth仍待闭合，不能用本机数学通过当实际可玩。全renderer463ea0 value-flow截断已保留。本轮无VM/锁屏/桌面/设备/游戏动作，既有vm-troubleshooting/已用停止点保持，不重放。[目标](../analysis/game-legacy-local-movement-v1/goal-audit.json)。

<a id="stage157"></a>
## stage157：整数负零、跨realm比较与移动边界

**已遇/修复：** source ftol产生整数0，JavaScript Math.trunc在负数不足1时产生-0；首targeted32/33通过，独立Python轨迹定位差异，产品display归一signed-int32后33/947通过。首次neutral的比较器用sandbox Array.map导致原型不同，值一致而deepStrictEqual失败；只改测试Array.from规范化，2项通过。原失败与修正log/receipt均保留。[回执](../analysis/game-legacy-actors-v1/test-results.json)。

**源/实现边界：** 大stack probe会误导cdecl原型；action列4、facing列5以push/ESP账本为准。4ff560属于4ff510内部，不是own-ID setter，真正为provider确认的4ff570。43ba10有解码但无Ghidra函数，使用现有GNU范围/字节CFG补充，不改分析器安全设置或运行目标。队列满、idle与active velocity、到达下一tick idle、float32及查表不能用常见运动模型替代。[源合同](../analysis/game-legacy-actors-v1/implementation-spec.json)。

未知初始local速度/资源模式、local display碰撞回写及条件scene reset不假定；只推进普通远端，party/ride/附件/条件flags和完整renderer/战斗等保留缺口。本轮无VM/锁屏/桌面/设备/游戏动作，vm-troubleshooting及已用停止点保持。继续本机碰撞/路径/预测、资源/动画/绘制及完整控制auth/当前/平台/官方验收。[目标](../analysis/game-legacy-actors-v1/goal-audit.json)。

<a id="stage156"></a>
## stage156：零缓存测试前提、内层语法与状态范围

**已遇/修正：** 首TCP夹具以零远端校验对零缓存，本应一致却断言补取，得到15pass/1fail及0补取；产品正确，修复夹具为独立补丁后校验再重跑，原失败证据保留。后续先保证测试触发前提成立，不为满足断言改正确校验算法。[回执](../analysis/game-legacy-scene-v1/test-results.json)。

**源边界：** inner n/c/z/y与消息外层转义不同，标签需全串后首字段两次解码；bit0-all、numeric空-1/十进制折返与byte超长保留不能混同普通文本codec。场景mode来自wire8，+4/+8来源wire6/7，identityA2/B0有特殊缓存分支。只保留当前active cache，持久路径/variant待接；源状态槽不猜HP/MP，原生wrapped/actor+0x284和guard/viewport/renderer不模拟。default-C分类已证初值，动态locale未验。[源合同](../analysis/game-legacy-scene-v1/implementation-spec.json)。

本轮无VM/锁屏/桌面/设备/游戏动作，原vm-troubleshooting历史和已用诊断/IDE停止点保持。完整控制auth、剩余89业务/绘制/移动战斗及当前/三端/官方可玩未完成。[验收](validation.md#stage156)。

<a id="stage155"></a>
## stage155：反编译缺运算、大栈帧及缓存安全域

**可重复问题/最小处理：** 4601f0的Ghidra伪代码像空循环，但原汇编读字节、反位序及表并累积；只用伪代码会错判0校验。460240/4ef580的stack-probe导致签名/参数漂移。先读已保留assembly，以ESP/cdecl推入顺序核平面与字段，按原件验证指令及表，不重跑大dossier或猜标准CRC。源证明为第三平面mask和固定1458B，不能以任意区域长度替换。[源核对](../analysis/game-legacy-world-v1/source-check.json)、[规格](../analysis/game-legacy-world-v1/implementation-spec.json)。

**实现边界：** native缺层/少cell可能消费未初始化数据，超长会截断或越界；独立实现只接收精确有界三层。对完全不相交区域安全返回零/不写，避免原负IO尺寸域。需显式缓存身份和mode，缺缓存给不可用effect，不创建文件或模拟退出。只投影已证数据，原场景guard/viewport、平面角色与actor/renderer/移动战斗、剩余93业务/完整auth/当前和官方仍待验。本轮无VM/锁屏/桌面/设备/游戏动作，原vm-troubleshooting及已用停止点完整保留。[验收](validation.md#stage155)。

<a id="stage154"></a>
## stage154：字节语法有损域、ready更新及投影限度

**已证边界：** 高字节第二保护值变0x66、未知反斜线对丢跟随字节；编码不是通用无损/Unicode。INT32_MIN原writer负索引、dangling高字节和负binary长度等不安全域由独立实现拒绝。主循环清token表，缺失参数为0/empty；额外字段忽略计数。reset只清ready标记，旧材料仍可用于非112B正文/输出；特殊binary优先，ready时112B按普通正文，不可按长度一律判bootstrap。[合同](../analysis/game-legacy-message-v1/implementation-spec.json)。

**验证问题：** 4ff680内址query返回已分析4ff5a0，同一函数多一dossier，计86记录/85唯一，不再请求该址。首neutral检查脚本多括号导致模块加载失败，已拆成局部转换和独立断言，仅重跑受影响检查、保留失败回执；产品未改。targeted/full的对端从仅四原创文件目录运行，每轮62回复/104分支，避免把本机私有原件存在当对端前提。[回执](../analysis/game-legacy-message-v1/test-results.json)、[源核对](../analysis/game-legacy-message-v1/source-check.json)。

**未决：** 网络位置投影不模拟4ff5a0 actor条件回写/插值/绘制；方向只存原码，不赋方位/动画序。其余95业务、binary实际处理/地图/renderer/移动战斗、完整认证、现行版本及真实平台/官方仍待验，8192轮同步派生调度/取消/性能缺口沿用。本轮无VM/锁屏/桌面/设备/游戏动作，不覆盖旧恢复层或重放已用停止点。[完整目标审计](../analysis/game-legacy-message-v1/goal-audit.json)。

<a id="stage153"></a>
## stage153：有损正文、初始块与依赖/夹具检查

**协议边界：** 37c4 encoder零字节不XOR，decoder会XOR；最多去8尾0x11也会去掉真实内容。因此不承诺任意byte无损往返，不把0x11规则称通用填充。bootstrap仅112B/64非NUL结果，低nibble非0或tag不符拒绝；tag有效不证明官方对端，普通payload完整性未证。先验tag再解块及清内部副本是独立政策。同步8192轮有界，但neutral7次批次约8.0s不能当UI/设备性能接受，宿主接线时须处理调度/取消。[合同](../analysis/game-legacy-transform-v1/implementation-spec.json)、[测试](../analysis/game-legacy-transform-v1/test-results.json)。

**已修正检查问题：** 依赖闭包regex曾把注释中的示例import当真实外部依赖，停止写入后改为行首真实import/export，复用SRI匹配的缓存，无安装脚本。初专项15/16因NIST夹具key漏一hex位，Buffer静默截成31B后被AES正确拒绝；修正确64位并给测试hex加偶数检查，未改产品算法。失败回执保留；peer导入生成器原会在顶层读私有源，代码复核将读取移至生成函数，最终targeted/full均从不含私有游戏文件的独立目录通过。[回执](../analysis/game-legacy-transform-v1/test-results.json)。

**工具/未决：** SHA大dossier完成但传输超限，仅沿retained分页/私有导出扫描，不重查同分析；value-flow截断与未完整人工浏览覆盖仍明确。完整控制/特殊binary/text/业务、当前版本、renderer/移动/战斗与平台/官方接受待验。本轮没有VM、锁屏、桌面、设备、游戏或已用诊断重放；旧恢复层状态不由本轮字节测试覆盖。[源核对](../analysis/game-legacy-transform-v1/source-check.json)、[完整审计](../analysis/game-legacy-transform-v1/goal-audit.json)。

<a id="stage152"></a>
## stage152：旧版分帧边界与静态工具结果

**已证边界：** 37c4接收首AF后至少8B才解析；因此0/1B正文的6/7B帧单独到达会等待，EOF不强行接收。无AF噪声保留，假第二标记只消费至AF，完整坏尾不自动搜下一帧。独立reader对坏尾/高位长度终止清空；append超过256KiB拒绝但不丢原队列。不要把这一政策称原生恢复算法或把opaque正文当明文/认证消息。[源与政策](../analysis/game-legacy-network-v1/implementation-spec.json)、[测试](../analysis/game-legacy-network-v1/test-results.json)。

**工具处理：** 4ee380没有Ghidra函数定义，失败选择停止，不伪造函数；4f8a40分析已完成但MCP尺寸超限，沿retained Evidence分页读首6400/81694字符，完整私有导出存在，未读部分与截断value-flow仍标未知。早期私有key xref_connect实际查询ordinal3/closesocket，公共事实按原件IAT/ABI重新核对。报告聚合误将outputs.app.js按项目根读取，正确根为各build目录；该账务脚本修正未改产品，也不重复已通过测试。[源核对](../analysis/game-legacy-network-v1/source-check.json)。

**未决/接续：** 正文变换/key/text/business、现行9baa/6e2ff等价及真实玩法/平台/官服待验。只沿新旧版源继续静态与原创实现，本轮无VM/锁屏/桌面/设备/游戏操作；既有各层恢复状态不由本轮测试覆盖，不重放已用WER/CDB或禁用原生IDE动作。[完整目标审计](../analysis/game-legacy-network-v1/goal-audit.json)。

<a id="stage151"></a>
## stage151：旧版静态路径可用，载体与版本范围分开

已补齐专用Wise读取器，在部分载体中读到完整脚本，再按普通数据范围取得两个完整旧版游戏EXE；完整载体与当前版本等价仍未验证。不能将Inno拒绝或7-Zip内嵌gzip列表当全部游戏材料不支持，也不能将partial列表成功当整包完整。[唯一排障条目](known-issues.md#stage151-release-source)、[REA与源字节核对](../analysis/game-release-current-v1/source-check.json)。

当前9baa的既有保护/诊断边界保持，但新37c4旧版可继续实际消费者分析；不再把“所有现有游戏均无可读代码”当当前状态。无新VM/锁屏恢复、桌面/设备/游戏或原生IDE验收。[完整目标审计](../analysis/game-release-current-v1/goal-audit.json)。

<a id="stage150"></a>
## stage150：零占位不等于恢复色号，尾超出仍拒绝

新RD结构模型保留C/D/E未知mask；接受记录的未知位置也进入候选palette，不能把所有零填充当实际颜色/透明，或照第三方查看器裁掉原34条多余字节。838Node/2portable/7工程与27,785差分只验本机结构实现。[唯一排障条目](known-issues.md#stage150-rd-runs)、[验收](validation.md#stage150)。

主游戏消费者/玩法与实际设备/官方接受仍缺证；没有新增VM/锁屏/桌面/设备/游戏操作或验收，既有原生服务停止点和已消费诊断不重放。

<a id="stage149"></a>
## stage149：配置器可分析，游戏业务消费者仍缺证

已完成Config.exe的本地读写与配置codec；Ghidra未定义的callback改由既有REA GNU objdump加源字节核对，不改分析器设置或依赖。native Read256之后的C字符串终止/失败数值边界未证明，独立reader明确有界/拒错，不推导游戏根因。[唯一排障](#stage149-game-config)、[验收](validation.md#stage149)。

829Node/3portable/7生成工程只验配置器与本机独立实现；原游戏网络/玩法、实际GUI/renderer、设备和官方接受仍未完成，无新VM/锁屏/桌面/游戏状态证据。

<a id="stage148"></a>
## stage148：资源缓存本机恢复已验，原生存储仍待验

双slot资源与目录端口、显式恢复/保存和新JS环境文件恢复通过822Node/7工程。写已发出后不能宣称取消成功或回滚，保留缓冲/锁到native回调；隐藏/换来源不复活旧选择。[唯一排障条目](#stage148-resource-cache)、[验收](validation.md#stage148)。

本轮修复交付读取缓冲在“callback先到、时间检查后超时”时遗漏清理；计数字段错误和已完成rename迁移重放均为夹具问题，原路径冲突策略保留。两slot皆坏不自动覆盖；quota/内存/原生FS、跨进程/断电、设备/官方与游戏仍待验；没有新的VM/锁屏/桌面/设备/游戏状态证据。

<a id="stage147"></a>
## stage147：当前补丁调用者有独立字节与生命周期

旧601b raw命令不等于当前c82：当前始终引用备份路径、timer轮询，路径还经过Windows规范化。已分离formatter、规范ASCII路径计划和轮询/退出纯数据，并显式绑定Web current/微信；802Node/5生成工程通过。[唯一新增排障](#stage147-current-patch)、[源](../analysis/launcher-current-patch-v1/source-check.json)。

完整MBCS/非规范/嵌套路径、实际文件存在/原生执行与目标平台仍未验；当前计划会明确拒绝覆盖范围外的路径，无旧profile自动回退。原生工具停止点未重试，VM/锁屏/桌面/设备/游戏均无新运行或恢复声明。[边界](validation.md#stage147)。

<a id="stage146"></a>
## stage146：资源候选本地链路通过，桥接与游戏仍有验收条件

19新/792完整Node及5生成工程通过，固定PUK3共享执行器、微信明确来源/基础ZIP/资源选择和只读relay接通。真实域名/TLS/原生平台/设备、资源持久化、官方及原游戏业务仍未完成；桥接声明不是官方身份。候选缺base/忽略项继续按既有语义报告，不把候选或选择当安装成功。[范围](../wechat/README.md#stage146)、[验收](validation.md#stage146)。

隐藏后来源不可重选已复现修复；测试DNS响应URL不一致被正确阻止，修夹具并保留产品检查。旧/tmp材料失效有项目Patcher同hash副本，旧601b主程序未定位、不得用c7ba/c82代替。[唯一新增排障](#stage146-wechat-resources)。既有[原生工具停止点](#stage143-wechat-cli)未重试，不据本轮报告锁屏/桌面/设备/游戏恢复，不重放已消费游戏/CDB，完整目标保留。

<a id="stage145"></a>
## stage145：目录缓存已接入，真实存储与可玩目标未完成

**实际结果：** 新增原创目录记录、微信双slot和显式检查/恢复/保存，后续HTTP比较此前原字节；22新增/773完整Node及4生成工程通过，包含本机真实测试文件和新JS环境恢复→原创Python交换。缓存不自动读写，不含账号/密码/会话/EXE。[配置](../wechat/README.md#stage145)、[验收](validation.md#stage145)。

**已修/限制：** 可变expectedRevision在await后重读已复现并修为own data快照；XML字符预算边界夹具已纠正，未放宽解析器。不能把native写取消当撤销、将读取失败当缺失、或把readback当跨进程原子性/断电持久性。[唯一新增排障记录](#stage145-wechat-cache)。

真实微信/设备/AppID/网络/渲染及资源补丁/原游戏业务仍未验，既有[DevTools停止点](#stage143-wechat-cli)未重试；本轮没有新的锁屏/桌面/设备/游戏恢复声明，不重放已消费的游戏/CDB，完整目标未缩小。

<a id="stage144"></a>
## stage144：微信初始化本地通过，原生文件/网络与游戏仍待验

**当前结果：** 补齐HTTP/文件/GB18030/初始化宿主接线，32新/751完整Node与4生成工程检查通过。新程序只在自有原创HTTP/Python及API形状夹具上运行；原生微信、域名/TLS、文件选择生命周期、AppID/设备和官方会话仍无新增证据。[范围](../wechat/README.md#stage144)、[验收](validation.md#stage144)。

**已修/禁忌：** host配置快照丢失XML兼容开关已修；测试BOM指针/XML必需字段已纠正；HTTP数据模块抽离后的三个浏览器精确路由已补并实测。不要将windows-936当完整GB18030、把相同包success数据重复拼接、把文件选择逻辑取消当底层abort，或拿HTTPS配置当已核真实性。新可复现记录集中于[操作知识库](#stage144-wechat-http)。

**接续：** 继续已证资源/补丁与缓存端口，原生验收保留[stage143停止点](#stage143-wechat-cli)，本轮未重试服务关闭的请求或更改工具安全设置；没有新VM/锁屏/Windows/设备/游戏恢复声明，不重放已用游戏/CDB，完整目标未缩小。

<a id="stage143"></a>
## stage143：宿主已接入，SDK服务关闭使原生验收未执行

**当前范围：** 生成微信App/Page/WXML工程与实际host，719Node和2无DOM工程检查通过；默认空配置无IO，原创Python核正常/错误组及选择门槛。没有原生WXML/开发者工具渲染、手机、AppID/域名或官方账号证明。公网裸IP/HTTP资源与原游戏业务缺口保留。[配置与限制](../wechat/README.md#stage143)、[验收](validation.md#stage143)。

**已纠正：** 初次App/Page测试共用VM全局，发生重复const；改CJS函数作用域后通过，生产模块未为夹具放宽。新增断言复现输入变化后旧确认提示，产品改为重新确认提示，719全回归通过。Galaxy过滤传原ordinal、输入不进setData、generation阻迟到及App/Page hide/卸载均有用例。[测试](../analysis/launcher-wechat-host-v1/test-results.json)。

**操作与接续：** 官方SDK/CLI一次返回服务端口关闭，0连接/0渲染/0截图；不启用安全设置/传登录票据/换信任标志或借用其他AppID，不把此失败诊断为项目代码错误。唯一操作记录见[知识库](#stage143-wechat-cli)。继续独立HTTP/目录/资源接线，完整goal active/incomplete；旧游戏/CDB额度不重放。

<a id="stage142"></a>
## stage142：微信原生验收、宿主接线与游戏仍未完成

**当前范围：** 微信TCP/随机数/取消/期限端口已组合现有current session；23新增/709完整Node及1无DOM bundle通过，独立对端均为原创本机程序。没有完整小程序页面/HTTP目录资源、真实AppID/域名/配额/JS支持/设备或账号；公网裸IP不在支持profile，不能把Node API形状夹具当原生微信。平台最低接口版本不能保证BigInt/Object.hasOwn或宿主生命周期。[范围](../adapters/wechat/README.md#stage142)、[测试](../analysis/launcher-wechat-v1/test-results.json)。

**已纠正问题：** 直接开发者网页由web工具返回non-retryable不可用，改查官方api-typings。其Performance没有now，排除原假设，改本地逻辑时钟/timer floor并测墙钟回退/晚到timer。首轮控制器测试的断言失败遗留等待，已正常终止唯一自有Node进程，finally修夹具后在基线自然复现3失败；没有把中断当完整测试。写入检查漏Reflect.apply第三参数由测试定位修正；两次候选序号假设错误改按现有selectionGate选行，未放宽产品门槛。保留原失败和后续通过日志。[源与测试回执](../analysis/launcher-wechat-v1/source-check.json)。

**下一步：** 接实际微信宿主/目录资源与可运行工程，再对开发者工具/设备分层验收；宿主onHide/onUnload应取消会话，timer延迟/挂起仍待真实环境。游戏仍需绑定的业务消费者，保留无账号/PDB答复，不重放已用游戏/CDB或修改保护。VM排障节本轮无新操作，完整goal active/incomplete。

<a id="stage141"></a>
## stage141：属性查询哨兵不能当物理不存在，空错误输出仍可能失败

**新边界：** journal读取器和presence helper没有把GetFileAttributesW无效结果区分为物理缺失/其他错误；delete helper则只在allowMissing且错误2时容忍缺失。stage0清理成功甚至不要求target存在，stage1及stage5 fallback的最终presence检查也不是regular校验。恢复helper的AL1与实际启动、来源/账号认证分开。[逐分支合同](../analysis/launcher-recovery-state-v1/static-contract.json)。

**反编译注意：** 默认void伪代码省略AL返回，合并goto还可能让“没有错误输出”看似成功；17处指令与六段原件范围支持本轮解释，不依赖伪签名。新high-pcode完整仍带security-failure helper no-return假设，保留EH/竞态/文件身份未知。没有新工具审批拒绝或VM排障操作。[源](../analysis/launcher-recovery-state-v1/source-check.json)。

**实现与接续：** 现有16B header和current候选路径无需改格式，不添加未接入的恢复执行API。下一步只沿尚未闭合的正常安装/下载/异常消费或可绑定游戏材料推进，不重复本轮函数/哈希或重跑游戏/CDB；无账号/PDB答复保留。完整目标active/incomplete，未用本次分析或stage140历史测试代替设备/官方可玩验收。[需求](development-plan.md#stage141)。

<a id="stage140"></a>
## stage140：声明与启动确认分开，资源工具范围拒绝须保留

**实际结果/边界：** 当前所选启动ACK合同已追清，shared current decoder已校验声明，23新增/72相关/686完整Node与两种浏览器尺寸46项通过。ACK发生于frame-painted；声明存在、SetEvent静态调用、MD5或子进程退出码都不能当真实登录/游戏成功。完整原生异常/竞态/事务与设备/官方接受保留未决。[合同](../analysis/launcher-startup-ack-v1/static-contract.json)、[验收](validation.md#stage140)。

**工具问题/最小处理：** REA对packed6d459整表查询返回`Resource range leaves its section's virtual size.`，属于格式拒绝而非审批拒绝；保留回执，不反复同请求或改安全配置。对不同的c82fc98分析映像查询成功，再独立核对两件原文件的所选路径；只能证明该声明，不能推出packed其余资源或Windows加载器通过。更新器完整ledger58条、native replay57条的差别来自target-free资源inventory，不删除证据或补造条目。[源与导出](../analysis/launcher-startup-ack-v1/source-check.json)。

**接续：** 当前无Win32事件平台端口，继续核恢复/日志消费者及现有候选调用方；不加未接入执行API。游戏代码归属/业务消费者仍缺，保留无账号/PDB答复、不重放已用游戏/CDB诊断。没有本轮VM/电脑控制操作，历史排障节仅供后续实际VM操作前读取。

<a id="stage139"></a>
## stage139：就绪不等于更新完成；名称查询与默认签名须回到原指令

**边界：** 新追清的父100ms/60秒轮询与更新器置位/等父退出发生在后续恢复/下载/替换之前；只有事件就绪且更新器仍运行才请求父关窗，不能把就绪、WM_CLOSE请求、退出码0或日志stage当新登录器启动ACK/commit。没有厂商执行、VM、转储/联网/账号操作，本轮只新增静态分析规格。[两端合同](../analysis/launcher-handoff-ready-v1/static-contract.json)。

**可重复工具问题/最小处理：** updater的精确名称SetEvent查询返回name_not_found，但原PE导入表确有该项；显式IAT0x49a150的REA xrefs给出0x407838/0x47360e，再只追正常交接站点。名称别名未解析不等于没有API。parent/path helper伪代码默认void，实际调用方TEST AL，函数指令有AL=1/0返回；不依据恢复签名删除返回值语义，不修改元数据或强行给未知函数命名。[源证据及限制](../analysis/launcher-handoff-ready-v1/source-check.json)。

**未决与接续：** 更新器主入口高pcode截断和terminal假设保留，未穷尽EH/别名/竞态；父路径文字比较不证明同一最终文件/发布者。当前web/mobile/WeChat没有命名事件/进程执行端口，模块接口/产品保持。下一步追不同的startup ACK消费者；游戏真实消费者和完整平台/官方可玩门槛仍未完成，不重放已用游戏/CDB或重复索取账号/PDB。[需求](development-plan.md#stage139)、[完整目标](../analysis/launcher-handoff-ready-v1/goal-audit.json)。

<a id="stage137"></a>
## stage137：更新参数实现范围与游戏输入缺口

当前formatter的五字段/内部SP变换已补纯核心，ASCII/own数据为明确支持子集；参数编码不建立当前文件身份、事件/ACK、权限或原生事务。首轮13个新测试中的合成MD5误34B，正确长度门槛拒绝后仅修32B夹具；最终88相关/663完整Node通过。[实现与失败记录](../analysis/launcher-update-arguments-v1/test-results.json)。

游戏固定参考点不是运行时字节，原64B比对尚未执行；普通输入问题记录在[唯一VM排障节](#stage137-input)，没有要求用户再点击、改共享/权限或重放游戏。完整目标active/incomplete，游戏字段仍须由业务消费者驱动。[需求与接续](development-plan.md#stage137)。

<a id="stage136"></a>
## stage136：遗漏页面接线及原创示例中断处理已修复

**根因/修复：** 模块实现了现行bootstrap与current握手/record，登录页却固定旧factory；Node服务拒绝所有query，导致现行rtm请求404。新增同一明确sourceProfile贯穿Node/runtime/bootstrap/page/session，并只开放固定路由的有界rtm。新5项回归修复前4失败，最终含真实当前/旧WS-TCP和错误组的8项通过，650全Node/6页面通过。[规格](../analysis/launcher-current-page-v1/implementation-spec.json)、[证据](../analysis/launcher-current-page-v1/test-results.json)。

**判断纠正：** 旧135真实blocked回执保留，但“所有独立路线耗尽”结论过宽：游戏证据不足不能抹去登录器已有合同尚未接线的实现缺口。本轮已标注解释纠正并保持完整目标active，不复用旧计数；以后阻塞审计须覆盖原目标的所有未完成模块，而非只围绕最近的游戏材料路线。

**验证工具问题：** 首轮browser runner误预期一个游戏（原夹具两个）并读取未公开activeSockets字段，只修runner后在新目录6场景通过，失败记录/截图保留未覆盖。CLI首次Ctrl+C也到达Python子进程，引发KeyboardInterrupt和exit1；原创对端现在把SIGINT/SIGTERM当stop，实际重跑exit0/stoppedtrue、受影响8项通过；没有假称再次跑全650或浏览器。无新VM操作，原VM排障节不改。[浏览器审计](../analysis/launcher-current-page-v1/browser-audit.json)、[接续](development-plan.md#stage136)。

<a id="stage135"></a>
## stage135：同一游戏业务材料缺口停止自动重复核验

**已核事实：** 133的辅助能力、134的历史纠正/直接DLL线索检查均保留，但没有补出游戏业务消费者；135当前原件/12文件哈希和REA状态复核未改变缺口。没有活分析作业，不能以反复查询、空等待或旧运行重放当进展。[三轮审计](../analysis/game-material-gzip-v1/blocked-audit-stage135.json)。

**处理与恢复：** 当前同一条件连续133/134/135三轮，goal已标记为blocked；按[实际回执](../analysis/game-material-gzip-v1/goal-status-stage135.json)停止自动重复工作。需实质新匹配材料、可靠协议/脱敏向量或可绑定的成员读取源后接续；已有账号/PDB不可用答复和VM/联网/工具授权保留，不重复提问、猜字段或通过保护恢复补合同。完整目标未完成，无新VM操作，原VM操作知识库不改。[需求](development-plan.md#stage135)。

<a id="stage134"></a>
## stage134：重复材料核验被误写成首次发现

**症状和证据：** stage133沿“非PE头”叙述遗漏stage40的`apex-static.json`，将同一gzip的哈希/完整性核验写成新发现。两份记录外/内层身份完全相同；已修正README、计划、分析、格式、协议矩阵和解释性审计，保留原始回执及测试。[对照审计](../analysis/game-material-gzip-v1/continuation-audit-stage134.json)。

**最小修正与禁忌：** 先按完整哈希/问题范围对照历史，再区分新工具、新检查与新业务证据；不能以新文件落盘或新报告名宣称取得新游戏版本/协议。本轮四DLL直接名称检查均0且非穷尽，没有新增运行或消费者。完整目标仍未完成、同一当前材料缺口计2，goal保持active；账号/PDB答复和已有授权保留。无新VM操作，原操作知识库记录不变。[需求](development-plan.md#stage134)、[验收](validation.md#stage134)。

<a id="stage133"></a>
## stage133：普通gzip工具与成员格式边界（历史发现时间已纠正）

**事实/历史纠正：** stage40已核验既有ApexClient.Dat500154B及其706686B展开内容的哈希、gzip头/CRC32/ISIZE；stage133并非取得新成员身份。新增工具和普通格式检查仍有效，但不能忽略旧容器证据或由最外层MZ缺失、裸PE字样作完整分类。[材料](../analysis/game-material-gzip-v1/material-audit.json)。

**最小补充与边界：** 新辅助工具默认1MiB压缩/8MiB展开，完整单成员且无尾随、输入固定SHA/输出新目录/原件不变；10项原创测试覆盖CRC、截断、拼接/尾随、预算、错hash与既有输出保留。该成员仍被REA默认格式检测拒绝，9个PE签名候选均不是合格PE32/PE32+头；不把不支持格式叫引擎未安装，也不由此断言没有内部代码。内部角色、架构、入口及消费者关系未知，不能强行raw解释或重建受保护映像。[工具及复现](resource-formats.md#stage133)、[验收](validation.md#stage133)。

**当前接续：** 所有完整目标仍未完成；普通静态引擎可用，缺的是绑定实际游戏行为的材料/格式/协议合同。原账号/PDB不可用和VM/联网/工具授权保留，无重复授权/手动请求。本轮是真实能力/材料进展，新路线耗尽区间从133计1，目标仍active，未沿用旧阻塞计数；没有已确认live作业可作verified wait。[逐项审计和计数](../analysis/game-material-gzip-v1/completion-audit.json)。本轮无VM操作或新设备/游戏验收，现有操作知识库保持原记录。

<a id="stage132"></a>
## stage132：初始化层对应增强，游戏消费者仍缺

REA追清注册回填/56B初始化记录/SEH回调包装器；已有转储76B有限读取给出19个DWORD，局部固定地址、帧内指针及回填槽同值支持静态对应。仍无可靠整链、代码归属、崩溃根因或游戏通信消费者，不将这些Win32初始化字段移植为shared协议。默认void签名与EAX消费不一致、高层pcode截断已显式记录。[分析](game-static.md#stage132)、[验收](validation.md#stage132)。

现有VM正常Resume后普通终端和输入可用；没有新的游戏启动或WER变更，CDB离线一次退出0、收尾进程0。暂停恢复、异步输入和数值投影分别记在[唯一操作排障节](#stage132-stack)。下一步先核独立消费者证据是否实际可用，缺失则精确记录，不重放崩溃或扩展受保护负载恢复。

<a id="stage131"></a>
## stage131：限定诊断已完成，根因与游戏消费者仍未知

本次具体确认已收到并执行，旧stage130等待不再描述当前状态。两份小型转储和离线CDB读出异常、模块范围及候选栈，REA核实六个静态调用返回边界；没有可靠运行时调用链或消费者。临时WER设置已恢复，EXE运行后哈希一致、游戏/CDB进程0。输入恢复、双视图恢复所有权、`x86`栈投影及不可过度推断的边界统一见[唯一排障记录](#stage131-wer)。下一步只核两个间接调用的静态数据流；不重放本次已用启动或把候选地址当协议规格。[分析](game-static.md#stage131)、[验收](validation.md#stage131)。

<a id="stage130"></a>
## stage130：停止重复前检，等待既有执行时答复

129的前检实际结果保留；本轮只读重核交付与最近三轮状态，未见原具体问题答复。相同确认条件持续三轮，当前没有独立取证工作或已确认存活作业可等，按[阻塞审计](../analysis/game-text-observer-runtime-v1/blocked-audit-stage130.json)停止自动重复，状态见[工具回执](../analysis/game-text-observer-runtime-v1/goal-status-stage130.json)。操作边界及恢复入口统一维护在[排障记录](#stage130-wait)，没有新增Windows手动操作或重复问题。

<a id="stage129"></a>
## stage129：诊断前检已核，输入中断恢复后保留会话

两个逻辑视图均无LocalDumps父/游戏子键，AeDebug Auto缺失；实验目录False、磁盘余量/游戏进程0/文件元数据已回读。尚未启用诊断或重新启动，既有执行时问题仍待答复。[前检](../analysis/game-text-observer-runtime-v1/wer-preflight-stage129.json)。输入中断与同次实时菜单的恢复过程只维护在下方[唯一排障记录](#stage129-input)；稳定性、根因、消费者与可玩仍未验。

<a id="stage128"></a>
## stage128：既存崩溃附件失效，本轮普通输入恢复

两份实际WER归档只剩文本，10个临时引用均不存在，无法从此路线取得栈。普通输入通过本轮短查询验收；路径/正则构造与输入损字分开记录，未改安全或控制后端。[材料](../analysis/game-text-observer-runtime-v1/wer-artifacts-stage128.json)、[唯一排障](#stage128-input)。新小型转储方案只准备、未执行；根因、消费者和可玩目标未完成。

<a id="stage127"></a>
## stage127：可读搜索面板仍未接收普通输入

新鲜画面已恢复，原搜索与终端可见；有界文字/单键/点击/正常窗口选择/Escape没有可确认来宾响应，无Return、命令或附件读取。本轮没有实现进展，同一间歇性输入阻塞按125–127三个末态审计；已有运行/REA成果保留。最小恢复入口及禁忌仅维护在[唯一排障记录](#stage127-input)，不再向无响应画面重复输命令。[审计](../analysis/game-text-observer-runtime-v1/blocked-audit-stage127.json)。

<a id="stage126"></a>
## stage126：早期异常有记录，故障代码与后续输入仍待核

两条应用错误已由PID及精确创建时间对应到上次进程；首条为无效异常处理程序状态，后续为访问违例，模块均unknown。WER签名与REA节表尚不能定位函数或根因；没有新增游戏代码。后续输入未回显，正常菜单恢复后截图主体为空白，报告附件未核。症状、证据、最小接续与禁忌统一维护在[唯一排障记录](#stage126-input)；不把状态码当缺库、ARM或保护根因。

<a id="stage122"></a>
## stage122：来源确认已答复，输入恢复后再次遇到 Mac 锁定

本次具体游戏执行已获确认；新鲜来宾前检与游戏执行均未提交。正常窗口和实时菜单定位恢复了搜索中的普通字符与 Escape，随后工具明确报告 Mac 锁定、自动解锁失败。只保留一次正常解锁请求，已有本次执行确认有效；症状、最小处理与未决统一在[唯一排障记录](#stage122-input)。[选取证据](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)。

<a id="stage119"></a>
## stage119：原始快照已返回，游戏执行确认待答复

原创正向资格已通过：同一原文件返回、主机关闭/exit0、全部6624B比较相等。普通短行可用，一段长批量命令回读不一致已在提交前取消；根因未定。游戏前检与新恢复点已完成，原游戏尚未执行/读取。新症状、最小处理和分层未决统一维护在下方[唯一排障记录](#stage119-input)。[资格](../analysis/game-text-observer-runtime-v1/qualification-stage119.json)、[下一步](development-plan.md#stage119)。

<a id="stage118"></a>
## stage118：真实读取已取得，完整传回受普通输入问题阻挡

新读取器一次原创fixture读取/完整摘要/自然退出成功；原始快照文件未返回。普通来宾输入再次失效，原生Win+Q能开搜索不代表普通输入恢复；有限模式检查最后未改值，配置已正常关闭。处理、禁忌和分层验收只维护在下方[唯一排障记录](#stage118-input)，不重放已完成fixture。[实际运行](../analysis/game-text-observer-runtime-v1/fixture-runtime.json)。

<a id="stage117"></a>
## stage117：三轮访问阻塞已记录，目标工具返回blocked

正常访问连续115–117三个goal turn失败，完整目标未完成；现有准备、VM和授权保留。已有正常解锁请求不重复，不换控制/安全路径。按层验收和恢复顺序见[唯一排障记录](#stage117-blocked)、[实际状态](../analysis/game-text-observer-v1/goal-status-stage117.json)。

<a id="stage115"></a>
## stage115：可读窗口不证明可输入，主机读取器不证明游戏代码可取

已有Windows画面可读，但首次输入批次返回Mac locked/自动解锁失败；没有Return或来宾命令实证。只保留一次正常解锁请求，没有新控制渠道、网络/共享/保护改动。新固定.text工具通过39C/6Python主机检查，两次构建相同，Windows夹具和游戏读取均未执行。[访问](../analysis/game-text-observer-v1/access-observation.json)、[边界](../analysis/game-text-observer-v1/validation.json)、[唯一排障知识库](#vm-troubleshooting)。

<a id="stage114"></a>
## stage114：夹具嵌套模块路由已修，真实浏览器与符号缺口分开

首轮自建浏览器夹具漏三个既有vendor路径而404，仅修夹具的manifest限定嵌套模块路由；成功轮83项、6会话均关闭、服务关闭、35生产模块hash未变、控制台与页面请求无异常。两尺寸截图已检查，手机截图不单独证明所有折叠下方状态。[失败保留](../analysis/launcher-cache-source-browser-v1/browser-initial-failure.json)、[成功与审计](../analysis/launcher-cache-source-browser-v1/evidence-audit.json)。

游戏头部查询的Ghidra330000ms启动超时与原.text无文件字节不是同一结论；没有改全局分析器配置。公开PDB精确两名字404，仍缺游戏消费者。最小修复与禁忌见[唯一操作知识库](#vm-troubleshooting)。

<a id="stage113"></a>
## stage113：真实更新清单超过旧容量，游戏变体仍无原.text字节

公开配置和两条清单来源本轮均HTTP200，不能继续套用历史超时作为当前不可达结论。378条操作触发旧256上限，现已修正为512；原失败回执保留，离线重解析及257/512/513边界已验。备选来源须显式profile、ordinal和独立origin许可。[实际回执](../analysis/launcher-current-entry-v1/patch-network-observation.json)、[修复验证](../analysis/launcher-current-entry-v1/manifest-reanalysis.json)、[测试](../analysis/launcher-current-entry-v1/test-results.json)。

6000包通过CRC/长度/MD5，但REA仍读不到原.text文件字节；没有原游戏消费者或兼容性完成证据。本轮无VM/原程序操作，stage112的桌面/输入结果仅为历史层。最小诊断与禁忌已同步[唯一操作与排障知识库](#vm-troubleshooting)。

<a id="stage112"></a>
## stage112：控制词语义仍未知，游戏前检已有新证据

现行type1已证为9B/两BE32，实际词值、调用者和版本用途仍待验证；已追踪的正常提交段ready后调用type10。type2两参数ABI与本次回调不使用词值已核，现有opaque编码/notice保持，45相关Node通过。本轮没有构造新的真实控制请求。[源规格](../analysis/launcher-current-control-v1/implementation-spec.json)。

Windows输入经临时全屏、来宾点击和安全单字符/取消后恢复，6条赋值/只读命令完成；固定游戏hash和Win7标记已读到，窗口模式已还原。该过程只证明此次短输入链，根因、长行可靠性、原游戏消费者和兼容性仍未知；处理过程写入[唯一知识库](#vm-troubleshooting)。[前检](../analysis/launcher-current-control-v1/guest-preflight.json)、[观察器条件](../analysis/launcher-current-control-v1/game-capability.json)。

<a id="stage111"></a>
## stage111：当前record长度/空记录已补，账号暂缺

29B请求在旧独立核心下cipher32B，当前源应40B，已有exit1回归和ceil补齐修复；原生0/0接收也通过新current codec/stream覆盖。默认generic旧字节/最低8B独立政策保持。139 REA/4源区间、独立向量与78相关Node通过，本轮无新外部联网/Windows或账号执行。[证据](../analysis/launcher-current-record-v1/test-results.json)。

用户确认暂无专用测试账号；继续无账号正常连接控制，不重复请求聊天凭据/PDB。真实加密/账号/游戏与平台验收仍未完成。版本补齐与undefined3伪码stride问题写入下方[唯一知识库](#vm-troubleshooting)，不另建排障版本。[源范围](../analysis/launcher-current-record-v1/implementation-spec.json)。

<a id="stage110"></a>
## stage110：固定组约束已补，真实观察仅到认证前置

旧generic flow忽略版本组约束的问题已有失败回归与最小修复：新增显式current、原固定g/p/字段缓冲界限及原生p-1支持，78相关Node通过。当前配置端点只8B hello→529B源组匹配→实际close；无账号/游戏或Windows操作，完整record/账号/游戏与平台验收仍待验证。[规格](../analysis/launcher-current-channel-v1/implementation-spec.json)、[回执](../analysis/launcher-current-channel-v1/network-observation.json)。

新鲜XML声明UTF-8而byte147严格失败，显式GBK往返仅属分析决策，未给产品猜编码或账号ACP结论。复现、最小检查、一次额度与禁忌已写入下方[唯一操作知识库](#vm-troubleshooting)，不另建排障本。[配置证据](../analysis/launcher-current-channel-v1/catalog-acquisition.json)。

<a id="stage109"></a>
## stage109：原状态截位规则与工程严格政策分开

**已复现并修复：** 更新版原字节42444c/424450及41ea60..41ea86以低16位0/-4和计费/过期门槛选择；现有profile/handoff额外canonical扩展判断会拒绝原路径允许的raw UInt32。新回归修复前实际报PROFILE_STATE_ENCODING，两所有者修正后48组合成输入/78相关Node通过；原UInt32、门槛及未验证认证标志保留。[根因/源码](../analysis/launcher-current-login-v1/implementation-spec.json)、[测试](../analysis/launcher-current-login-v1/test-results.json)。

**分析可重复问题：** 更新版4316c0/423c30伪签名又少16/10中的末参数，按RET0x40/逐push核对；5878d0丢W0不等于wire少一列。0x401079无procedure用精确指令核实，不臆建函数。已保存新快照并关闭REA；本轮无VM操作，既有stage108输入/介质/收尾事实不重放。[记录](../analysis/launcher-current-login-v1/rea-audit.json)。账号、游戏消费者、恢复启动和目标平台/官方验收仍未完成。

<a id="stage108"></a>
## stage108：补库后自更新和主界面已观察，临时诊断已收尾

首次9732→2484早退后，用REA核旧更新器及三VC71依赖，官方来源/导出/Windows签名资格和精确app-local拷贝已验。新正常9280→10436→9012，V2.01主界面可见、EXE/RegionList实际更新；更新器退出、账号/游戏/官方兼容仍未知。两次临时订阅、队列和专用管理员终端分别收尾；原19项键盘菜单及顺序保留。本阶段问题统一记在下方[唯一操作知识库](#vm-troubleshooting)。[REA](../analysis/game-install-context-v1/rea-updater-stage108.json)、[修复与运行](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)。

<a id="stage107"></a>
## stage107：平台安装成功，来宾普通输入仍待恢复

原安装器PID3440退出0，InstallDir两视图及旧版登录器/更新器完整hash已核；旧许可页等待被实际安装状态取代，中间自动运行未观察。本轮普通来宾输入后续失效，具体对照、已试动作与唯一恢复顺序见下方[操作知识库](#vm-troubleshooting)。已有一次最小焦点请求待答，不重放安装、旧脚本或启动额度。[安装](../analysis/game-install-context-v1/platform-installed-stage107.json)、[输入实证](../analysis/game-install-context-v1/access-observation-stage107.json)。

<a id="stage106"></a>
## stage106：当前待答是实际新许可，不是普通Windows权限

平台包完整hash及现有InstallDir/默认父目录已新鲜核对；正常安装器启动/UAC各一次，实际许可页保持拒绝选中、Next禁用，未点Install。完整正文仅留私有build，首尾与UI相符，一次协议接受确认待答。不要重放启动命令、索取普通焦点操作或把提问工具accepted回执当用户同意。[许可](../analysis/game-install-context-v1/platform-license-stage106.json)、[运行](../analysis/game-install-context-v1/platform-runtime-stage106.json)、[唯一知识库](#vm-troubleshooting)。

<a id="stage105"></a>
## stage105：正常安装完成，原游戏消费者仍待取证

安装来源确认已答复并使用，实际游戏目录、Path两视图、四文件完整hash及安装器exit0已核。新固定目录观察配置在主机核表后，通过Windows原创夹具的一次8B观察；没有原游戏执行或消费者恢复。[安装](../analysis/game-install-context-v1/guest-installed-context-stage105.json)、[原创工具实证](../analysis/game-entry-runtime-v1/windows-observer-stage105.json)。下一操作仍先读下方[唯一知识库](#vm-troubleshooting)，不要把旧等待/旧目录缺失当当前结果。

<a id="stage102"></a>
## stage102：安装准备已核验，临时菜单已撤回

来宾镜像和两个安装包完整hash匹配，E卷只读，新快照元数据已核；两安装包NotSigned，游戏包官方字节对应未证，正常安装尚待一次来源执行确认。已撤回22项排障添加菜单，重开后精确保留原19项及顺序。当前没有解锁/焦点人工请求。[实际回执](../analysis/game-install-context-v1/transfer-session-stage102.json)、[撤回核验](../analysis/game-install-context-v1/keyboard-cleanup-stage102.json)。具体问题统一记录在下方[唯一操作知识库](#vm-troubleshooting)。

<a id="stage101"></a>
## stage101：访问恢复，原创工具通过所列 Windows 案例

本轮实际访问/逐字输入已恢复，无待回复人工步骤；旧stage100锁定不再是当前状态。已修复原创fixture加载布局，取得一次8B观察和独立自然exit0。当前待办是正常游戏安装上下文、完整消费者与原生更新验收；22项既有临时菜单仍待撤回。细节统一写在下方[唯一操作知识库](#vm-troubleshooting)，不另建排障版本。[实际回执](../analysis/game-entry-runtime-v1/windows-observer-stage101.json)。

<a id="stage100"></a>
## stage100: Mac access blocked (2026-10-29)

电脑控制在连续3个 goal turn 均报告 Mac locked、自动解锁失败；未取得新来宾状态、提交新命令或运行观察器/原游戏。三轮阻塞审计已通过，goal 工具实际返回 blocked，完整目标尚未完成。

仅已有一次正常解锁请求保留，无需重复授权或再点击终端。解锁后先看未提交的哈希查询，核文件/备份/journal/原创目录，再验原创工具；旧脚本/Restore/启动不重放。22项临时菜单因锁屏尚未撤回，精确清单保留。不改锁屏/安全或使用已禁止控制路径。下列旧“当前”均为各阶段历史。

[stage100 audit](../analysis/game-entry-runtime-v1/access-blocked-stage100.json), [stage100 delivery](../analysis/delivery-manifest-stage100.json).

<a id="stage98"></a>
## 当前：查询已返回，新锁屏仍需正常访问（stage98）

D=MOLICUR89、有效Restricted和两组指定进程计数0已实际返回；未改策略，分段查询成功仍不证明单一输入根因。哈希查询前半段未Return，后续CUA报新Mac锁定/自动解锁失败，尚无hash结果。已仅请求一次正常解锁，不再要求终端点击；恢复后先看未提交行。[实证](../analysis/game-entry-runtime-v1/guest-preflight.json)。

临时22项键盘菜单尚待精确撤回，因锁屏未操作；不恢复默认或改变锁屏/安全，不用禁止CLI/其他控制后端。优化/启动顺序/TPM均未应用，新CD与工具/原游戏执行0，旧脚本/Restore/已用启动不重放。新锁屏第2轮，完整目标active/未完成。[恢复](../analysis/game-entry-runtime-v1/input-recovery.json)、[计划](../analysis/game-entry-runtime-v1/run-plan.json)。

stage99 复查：CUA 仍在 Mac locked／自动解锁失败处停止，未取得新来宾状态或提交命令。同一新锁屏已连续2个 goal turn；上一轮有实际前检进展，本轮无开发进展。已有一次解锁请求保持，不追加终端操作或重复授权。完整目标 active，恢复后先看未提交的哈希查询，再核文件/目录并验原创工具。[本次复查](../analysis/game-entry-runtime-v1/access-recheck-stage99.json)。

<a id="stage97"></a>
## 当前：同一Mac锁定条件已达到阻塞审计门槛（stage97）

新鲜CUA绑定仍在Mac locked/自动解锁失败处停止，同一条件stage95/96/97连续三轮；旧策略blocked累计未复用。前两轮独立入口分析与观察工具准备已做完当前切面，本轮无可继续正常运行/业务规则的独立动作。交付回读后提交goal blocked，完整目标未完成或缩减。[访问](../analysis/game-runtime-access-v1/access-observation.json)、[逐项审计](../analysis/game-runtime-access-v1/blocked-audit.json)。

正常手动解锁是当前恢复条件，已有单次问题保持；无需重问Windows/联网/工具授权，不索取密码/PIN、不改变自动锁屏、安全/共享或保护决策。先核实际来宾路径/hash/备份/journal，再做原创fixture/observer的Windows验证；stage94未恢复/guard停止与旧启动额度已用事实保留。工具主机准备不等于Windows或游戏通过。

<a id="game-stage96"></a>
## 当前：游戏消费者仍在运行注册边界之外（stage96）

新REA已从PE入口追到动态注册的两个回调槽，静态槽均零；原.text无文件字节不等于其余节都不可分析，也不提供消费者地址。调试器相关分支保持原样，未解保护或重建代码。下一项证据是正常运行的槽归属/调用及实际游戏规则。[源证据](../analysis/game-entry-v1/static-audit.json)。

已准备原创固定8B只读观察器及fixture，26主机断言/确定性构建/工具REA和数据CD回读通过，**Windows未验**；不以准备完成代替游戏实现。当前Mac锁定是恢复后的第二轮同一条件，本轮仍有静态/工具进展，不复用旧策略blocked累计，不重复人工解锁问题。[验收](../analysis/game-entry-v1/validation.json)、[流程与边界](../analysis/game-entry-v1/probe/README.md)。stage94的恢复guard停止、备份保留及未恢复结论继续有效，解锁后先核实际状态，不重放旧脚本。

## 当前：新版差异已分类，真实事务状态仍待读回（stage95）

旧/新updater只有26B构建元数据不同；18函数体字节相同，新增REA35记录核实日志格式。日志stage5仅表示commit标记已写，不代表现在的文件、ACK或全链已成功；XOR只是一致性检查。[源与限制](../analysis/launcher-update-recovery-v1/static-audit.json)。

共享header解析器已实现，615Node和Chrome通过；独立API要求精确16B，原生前16B可忽略尾随，差异已写规格。当前Mac锁定发生在getApp前，未提交来宾命令或重放旧一次授权；人工解锁问题只发一次，既有Windows/网络/工具授权继续有效。[访问状态](../analysis/launcher-update-recovery-v1/access-observation.json)、[验收](../analysis/launcher-update-recovery-v1/validation.json)。

当前仍缺实际journal/原生故障恢复、游戏消费者及可玩/平台/官方验收。本轮有实际分析与实现进展，goal active；旧blocked累计不复用。

## 当前：启动首屏已观察，恢复保护按预期停止（stage94）

临时进程策略具体批准已收到，四模式各提交一次并返回；有效策略Restricted，五scope Undefined，无持久修改。初始父进程退出0后出现更新器与主界面，不再把“新版未启动”当现状。[实际运行](../analysis/launcher-current-runtime-v4/observation-readback.json)、[策略](../analysis/launcher-current-runtime-v4/policy-after.json)。

当前EXE1666048B/6d459ddbdf…与新公开包相同；Restore因不符合原两hash而停止，**未恢复、未重试或放松guard**，四备份保留。程序自动换版后，初始进程回执不能描述最后文件或完整子链；主窗口映像、更新器成功码、commit/ACK未捕获。新内嵌updater虽仍814080B，hash已不同，语义需另验。[恢复停止](../analysis/launcher-current-runtime-v4/restore-stopped.json)、[新样本](../analysis/launcher-current-runtime-v4/static-audit.json)。

配置刷新工厂已实现整对提交、CAS和迟到取消回执，但默认页面/Win32事务/游戏不因此完成。605Node最终通过；Chrome首轮11功能断言通过而网络审计有1次ERR_ABORTED，补逐用例networkidle/标签后11项73GET零异常，初次事件精确归属和根因未建立，原记录保留。[本轮验收](../analysis/launcher-current-refresh-v1/validation.json)。

## 当前：Restricted 已直接实测，具体策略回复仍缺（stage93）

现有Windows桌面/普通输入可用，一次Get-ExecutionPolicy返回Restricted；不再把“默认Restricted”只标推测。未重试脚本或执行原程序。四轮同一具体策略门槛审计通过，下一必要正常观察需此前仅进程RemoteSigned的具体回复；现有一般Windows/联网/工具授权保留。[新观察](../analysis/launcher-current-runtime-v3/observation.json)、[要求与路线审计](../analysis/launcher-current-runtime-v3/blocked-audit.json)。

inventory与MAP01已在stage38代码完成，旧建议不作为新待办；游戏源旧tmp路径缺失已用项目既有同hash缓存核实，非新增依赖阻碍。正常启动/更新恢复、游戏消费者与协议、可玩实现和平台/官方验收仍未完成。583项测试是stage92既有实跑，不在本轮重复执行。

## 当前：新版元数据入口通过，原生运行仍待具体策略确认（stage92）

本轮闭合新版摘要修边/大小写、locator声明包长及配置请求顺序，实现三项纯API和显式createWin32LauncherBootstrap。完整583Node、Chrome63向量/69实际回环GET及12源字节锚点通过；旧默认profile保留。[验收](../analysis/launcher-current-metadata-v1/validation.json)。

原生256MiB包上限与独立32MiB预算不同，原生前缀检查不证明完整URL有效；配置候选本地MD5不是服务端摘要认证。新入口只准备候选，当前原版启动/事务/恢复、页面新版选择、游戏协议及可玩和平台/官方验收仍缺。Windows stage90的RemoteSigned当次问题未答，本轮没有新UI读取、命令或策略变更；解锁/来宾输入最后实测仍在stage90。旧“当前”段落均为当时状态。

## 当前：新版容器门槛与字节比较已落地，Windows确认待答（stage91）

新增纯核心不做完整游戏字段验证、文件I/O或恢复。当前Win32源码的容器门槛允许空Games/Regions；逐字节比较不能由MD5规则替代。提交时GameList先于RegionList，pending marker只在原两文件都存在时创建，部分失败/清理结果未证明原子性。不得把独立候选或浏览器存储事务当成此原生分支的运行证据。[静态事实](../analysis/launcher-current-catalog-v1/static-audit.json)。

复用XML子集不支持内部处理指令；独立ElementTree对照的该差异明确排除，原向量未改。Node558及Chrome53向量/四组附加检查通过；未改页面、默认bootstrap或Windows策略。stage90的RemoteSigned当次问题仍待答，完整登录器/游戏/目标平台和官方验收未完成。[验收与初次失败](../analysis/launcher-current-catalog-v1/validation.json)。

## 当前：访问恢复，实际脚本策略拒绝待处理（stage90）

普通Windows输入及PowerShell5.1版本查询、数据CD九hash、只读Parser检查已通过；Verify脚本本体仍被Windows策略拒绝，返回UnauthorizedAccess/exit1。没有备份替换、新候选/UAC或游戏执行。全部策略作用域Undefined，默认Restricted为文档支持的推断；没有独立查询有效策略，也未改任何策略。[实际结果](../analysis/launcher-current-runtime-v2/guest-preflight.json)。

待确认[独立进程RemoteSigned方案](../analysis/launcher-current-runtime-v2/policy-proposal.json)后才能继续该路径；它允许该会话及子会话运行未签名本地脚本，不能描述为OS级单文件白名单。没有自动审批拒绝，本次是Windows实际策略拒绝。旧MFC依赖及ReadOnly仍不是已证故障根因；完整登录器/游戏及平台/官方验收未完成。

## 当前：运行工具/介质已验，Windows访问仍锁定（stage89）

工具本轮两次仍报告Mac locked/自动解锁失败，未取得来宾窗口。已有人工解锁请求与Windows/联网/工具授权保留；没有新审批拒绝，不改安全设置或换路径绕过。[前置](../analysis/launcher-current-runtime-v1/preflight.json)、[访问/验收](../analysis/launcher-current-runtime-v1/validation.json)。

新版运行介质9成员回读通过，12项主机原创文件/进程测试通过；原生Windows脚本、UAC、NTFS及目标EXE未运行/验收。若Windows执行政策阻止.ps1，停止报告，不改政策/不另换执行方式。观察90秒仍在跑时只记录PID，必须新鲜UI决定正常关闭；不强杀或当作已停止，子进程全链仍未追踪。旧MFC71及ReadOnly根因不由工具准备推定。[方案](../analysis/launcher-current-runtime-v1/run-plan.json)。


## 当前：新版候选校验通过，正常运行待恢复访问（stage88）

新共享接口仅验证单个普通EXE包及其有界PE头，32MiB/ASCII为明确实施子集；原生更新器允许更大范围，完整PE、签名、运行依赖、事务故障矩阵和游戏消费者仍未验。MD5/CRC和ACK标记均不认证来源。旧接口行为保留，548项Node本轮通过，真实新包与Python对照通过。[规格](../analysis/launcher-current-updater-v1/implementation-spec.json)、[验收](../analysis/launcher-current-updater-v1/validation.json)。

本轮电脑控制在来宾读取前报告Mac locked/自动解锁失败，无新来宾命令、传输或EXE执行。已请求本人正常解锁，既有授权保持；不能用此前“已就绪”或只读静态工具仍可用推定桌面当前可控。[访问记录](../analysis/launcher-current-updater-v1/access-observation.json)。旧MFC71依赖/ReadOnly原因仍为待验证候选，未盲装DLL、改属性或重启旧样本。


## 当前：原登录器进入更新交接，新样本已取得（stage87）

原固定登录器正常UAC一次、PID7684运行4秒/exit0，受控诊断日志与成功更新器交接分支一致。当前无匹配进程，不证明未曾有子进程；原主程序/两XML hash未改，Hidden更新器hash匹配。没有稳定登录窗口、更新器生命周期或更新替换成功证明。[运行后核对](../analysis/launcher-runtime-v2/postrun-files.json)。

当前摘要变更后已静态取得新包，现有核心CRC/MD5和Python逐字节对照通过；新旧REA分开并关闭。新样本/内嵌更新器均未运行，完整目标未完成。回车再次未生效，当前只读前缀hash命令仍待提交；Win7与现有授权继续沿用，下一步见[具体切面](../analysis/launcher-runtime-v2/next-slice.json)。下方旧“当前”按历史阶段理解。

## 当前状态：自动暂停已恢复，终端输入与清单取证仍未通过（stage86）

**最后访问复查：** 电脑控制在读取窗口前再次报告Mac locked且自动解锁失败，未提交原启动命令。需正常手动解锁并恢复既有终端焦点操作；当前Windows/联网授权保持。[最新工具结果](../analysis/launcher-patch-live-v1/access-recheck.json)。

最新画面明确“已自动暂停”，原生操作菜单选“恢复”一次后覆盖层消失；未改自动暂停策略、重启或还原。恢复后一次PowerShell图标点击仍未打开终端，不把暂停推定为此前全部输入故障的唯一原因。既有人工焦点请求保持，原登录器/UAC提交0。[观察](../analysis/launcher-patch-live-v1/vm-resume.json)。

当前目录HTTP无响应关闭、正常HTTPS握手EOF、历史快照中唯一怀旧首区域声明地址的单次15秒清单请求超时；均未取得正文，不能推断服务不存在、被拒权限或全网断网。三进程均已完成，无活动等待任务；现有独立路径结果已保存，完整目标仍未完成。[网络](../analysis/launcher-patch-live-v1/network-observation.json)、[HTTPS](../analysis/launcher-patch-live-v1/https-catalog-followup.json)、[历史源探测](../analysis/launcher-patch-live-v1/retained-source-probe.json)、[阻塞审计](../analysis/launcher-patch-live-v1/blocked-audit.json)。

## 当前状态：官网分发字节匹配，来宾输入尚未恢复（stage85）

官网实际href为HTTP，完整ZIP/安装器/三文件链已对应既有样本；原登录器仍未签名，HTTP不认证传输。先前执行问题未被当作自动批准；新来源事实使“未知来源”前提改变，按既有Windows/联网授权准备正常启动。[来源评估](../analysis/launcher-provenance-v1/source-assessment-and-run-plan.json)。

用户解锁后桌面已可读；中断后的旧绑定失效，重建后原生Win+Q菜单实际打开搜索。但普通鼠标/文本尚未到达来宾，已请求手动打开PowerShell并点击终端空白处恢复焦点。当前没有启动命令输入/提交或UAC接受，重绑后未重核文件/枚举进程，不能据旧成功继续执行。主机最新配置仍Shared/NAT Connected1/目录隔离1/共享磁盘和用户目录0。[最新访问](../analysis/launcher-provenance-v1/access-followup.json)覆盖较早[locked时点](../analysis/launcher-provenance-v1/access-observation.json)。

## 当前状态：原登录器哈希一致，来源确认待处理（stage84）

事实：来宾原登录器及两XML哈希匹配固定样本，Windows签名`NotSigned`；主机公开HTTP更新摘要200/33B，所称MD5仍匹配，但不认证发行者。已准备单次管理员联网观察方案并发出电脑控制工具要求的执行时确认；本轮原程序执行0次，未遇自动审批拒绝。[核对](../analysis/launcher-runtime-v1/guest-preflight.json)、[方案与门槛来源](../analysis/launcher-runtime-v1/normal-start-plan.json)。普通Windows/网络授权继续沿用；不将旧v23已用单次额度复用或以哈希代替来源核验。

## 当前状态：共享网络接通，固定x86观察链已跑通（stage83）

现有VM共享网络已直接接通，来宾HTTPS HEAD200；普通焦点/原生工具栏菜单可用，Mac文件共享隔离保持。原创目标普通退出0、x86 CDB实际7返回位点及目标退出事件code0已观察；ARM64工具WOW64上下文失败和脚本/输入错误保留。[联网](../analysis/runtime-observer-v3/network-observation.json)、[实际目标运行](../analysis/runtime-observer-v3/fixture-lifecycle.json)。

当前仍缺游戏业务消费者/协议与最终平台/官方验收。无计时及CDB默认寄存器输出意味着固定夹具记录不能充当通用采集器隐私证明；原登录器/游戏本阶段尚未执行，下一步进入正常联网启动链。具体复现、修复与禁忌已同步到下方[操作知识库](#vm-troubleshooting)。旧断网、SDK未安装或GUI不可用描述均是历史。[本轮验收](../analysis/runtime-observer-v3/validation.json)。


## 当前前置状态：Windows调试工具已安装、自检通过（stage82）

微软SDK26100.9457正式离线ISO与主机读取/验签工具已取得；19项选定签名/时间戳及15项双解码对照通过。两Redist独立摘要异常仍未定，未手动运行、改写或重签；SDK内部子包执行链未逐项采集，不称全包通过。人工焦点恢复、原生CD菜单键盘导航与精确介质选择已成功，网卡断开/Mac隔离保持，网络恢复请求仍保留。[核验](../analysis/runtime-tool-readiness-v1/validation.json)。

用户对当前SDK许可门槛回复后已接受本次协议；可选统计No、仅调试工具534.0MB、已核微软UAC及完成页依次确认，安装器正常关闭。ARM64 CDB摘要匹配、Windows签名Valid，版本命令返回10.0.26100.9457、退出0。跨架构调试、原创目标/采集器隐私及游戏仍未验；自身启动不替代这些证明。[安装](../analysis/runtime-tool-readiness-v1/sdk-installation-followup.json)、[自检](../analysis/runtime-tool-readiness-v1/cdb-windows-check.json)。早期JSON仍描述各自时间点，下方旧状态均按阶段理解。

## 当前环境问题：普通访问恢复，网络控件出现关键错误（stage81）

用户正常解锁后已读现有Windows桌面，并成功创建原生恢复点；stage80访问阻塞不再是当前事实。Source下拉未展开，一次设备/网络父菜单动作后Parallels报告关键错误；精确本机报告为QtWidgets combo/widget栈的EXC_BAD_ACCESS，根因与复现性未确定。正常关闭报告后Windows桌面仍可读，未发送报告或重试菜单，文件配置仍断网/隔离。[去敏摘要](../analysis/runtime-install-v1/parallels-error-summary.json)、[操作回执](../analysis/runtime-install-v1/gui-observation.json)。已请求用户手动设共享网络且保留Mac隔离；WinDbg/原创x86实测和完整游戏仍未完成。下方旧状态均是相应阶段历史。

## 当前阻塞：普通GUI连续三轮不可取得（stage80）

本轮一次正常CUA读取仍在应用绑定前报告Mac locked；不是实际屏幕状态的独立证明。该依赖在新授权后连续三轮出现，host准备已经完成，当前直接工具包获取路径也失败，满足blocked门槛。[审计与恢复条件](../analysis/runtime-access-blocked-v1/blocked-audit.json)。

用户联网/工具批准有效，正常手动解锁请求已发送；无需重复授权。当前无活跃观察进程/任务可等待，不重试拒绝包地址、不换控制通道或改锁屏/安全/信任/共享。普通访问恢复后续验Windows观察器与原创x86目标；游戏消费者/协议和完整实现仍未完成，已有源码/产物保留。


## 当前GUI与公开工具包状态（stage79）

当前普通CUA在应用绑定前报告Mac locked；实际屏幕状态未独立取得。微软公开固定包HEAD/正常GET都403、0字节，未取得包、验签或检查依赖/条款，该地址停止。[精确状态](../analysis/runtime-access-v1/access-status.json)。工具/联网授权已接受，无需重问；正常手动解锁请求已发送。恢复普通GUI后沿微软正式界面核工具并验原创x86目标，不改锁屏/代理/UA/TLS或重开已取消CLI；当前无来宾、原程序或游戏协议进展。


## 当前联网及观测工具前置状态（stage78）

用户新授权覆盖本项目联网测试与工具操作，已恢复目标，不再等待用户没有的PDB/调试材料。主机5个已证HTTP路径返回200，摘要/两份XML可核；DNS非全局、HTTPS EOF使来源身份仍未验。原启动器MD5已匹配，RegionList差异是已证刷新候选，不是未知新EXE已运行。[字节对照](../analysis/runtime-observer-v2/current-source-comparison.json)。

原创无CRT x86目标已编译及审阅，10项host模拟、16调用点原字节、两次构建和ISO回读通过，Windows实际API/ARMx86/采集器隐私仍待验。最新CUA列表读取在应用绑定前报告Mac locked；未重试/换通道、未执行来宾/原程序或修改VM网络，已请求用户正常解锁。[当前环境证据](../analysis/runtime-observer-v2/environment-observation.json)。新授权不是已执行记录；恢复普通GUI后推进工具安装/原创目标验收，再观察正常启动链。完整游戏/认证仍未恢复。


## 当前目标阻塞：缺少游戏业务材料（stage77）

同一游戏consumer/protocol缺口已连续三轮核实，满足blocked门槛；完整目标未完成。原包清单、四DLL直接线索与当前输入/关闭会话复核未提供新入口，定向公开资料查询没有取得版本匹配材料。**恢复条件：** 合法提供匹配可分析业务构建或权威协议/去敏参考向量的本地路径，先核身份与范围；PDB只能补名字/类型，不能单独恢复代码。普通REA/Ghidra依赖可用，不通过重复扫描、演示扩展、解保护或复用已消费运行批准维持假进展。[审计](../analysis/game-consumer-blocked-v1/blocked-audit.json)。现有代码/样本/证据保留，无VM或安全设置操作。

## 当前游戏消费者材料缺口（stage76 / 2026-10-27）

普通REA/Ghidra能力已可用；当前缺口是固定样本可见业务代码与权威规格，不是可通过安装普通依赖解决的工具故障。新增命令行缓存消费者含注册/维护开关，不证游戏argv；CGSharedMem/gid:/glt:仍无已解析引用，原.text无文件后备字节。**禁忌：** 不把SERVER/TRANSFER词、匿名4096B映射、空xref、PDB或资源预览当完整游戏消费/认证证明，不解保护或复用旧原程序运行额度。

需要版本匹配的合法可分析构建或权威协议/去敏向量；PDB应先核GUID/age且不单独恢复缺失代码，当前REA不接收指定PDB。已询问材料本地路径；没有下载/私人目录扫描。无新材料时不重复同一组查询或已知失败探针。[精确边界](../analysis/game-consumer-v1/static-spec.json)。本阶段没有VM/电脑控制，新问题不属于VM排障。

当前目标为网页、手机和小程序可游玩；暂按手机＝移动网页、小程序＝微信小程序，独立App/其他平台待确认。主线是**证据驱动的逻辑/协议规格 → 独立共享核心 → 平台适配 → 兼容性验收**。`native/`保留为历史原型和回归材料，不再增加Mac专用业务；`shared/`及`web/`目前提供有限离线配置/候选缓存与资源核验。

## 当前首次配置／刷新分支与截图输出保护（stage75 / 2026-10-27）

- **已修复遗漏：** process核心已支持onlyRefresh，web适配却固定0且无UI。现按own uint32/默认0接通、CG非零不读资源字段，控件锁定/重准备/失效/不同反馈通过；非CG不错误略过游戏。显式勾选却无目录不再允许映射fallback。
- **易错源语义：** 首次Config以用户名MD5为section、GameCode_Config为key，与license次序不同；GetAllocLength FID实际读data-12 logical length。创建配置程序、wait返回或标记写0均不证明配置有效/认证，原错误分支还会继续。lookup是账号派生身份，禁止当匿名值或随意日志化；本轮只用原创输入，不读写真实Profile。[源](../analysis/launcher-v30/static-spec.json)。
- **本阶段产物事故：** 复制QA时只换了receipt guard，缓存回归截图OUT仍是阶段根，重写新流程的两张同名首屏。代码/历史阶段产物不受影响；初始PNG无预先hash，不能证明精确原件恢复。原回执保留，新目录重验9项并记录最终hash；旧stage65事故不被这次重验抵消。[留痕](../analysis/launcher-v30/artifact-output-incident.json)。
- **最小输出保护：** 每个QA运行必须独立目录，receipt和每个截图都检查目标。截图用`fs.open(path,'wx')`预留，取得buffer后写同一handle并finally关闭；已有目标即拒绝，不能只给Playwright传path或只检查JSON。碰撞测试须确认截图未执行、既有bytes未改；最终各运行截图路径做交集检查。[视觉/保护证明](../analysis/launcher-v30/visual-review.json)。

516Node、26锚点/3反例、24+9参考/固定24、Chrome9新/32回归和示例通过。已证登录器自身契约可进入游戏消费者静态联合验证；完整Config/账号/服务/原生恢复/设备/游戏仍待验，不恢复旧VM或执行批准。[门槛](../analysis/launcher-v30/launcher-gate-audit.json)、[验收](../analysis/launcher-v30/validation.json)。

## 保留资源缓存事务与容量边界（stage74 / 2026-10-27）

- **已验取消口径：** IDB put成功仍可在提交前abort，旧完整记录保留；实际complete后取消不能回滚。实现返回committed及cancellationTooLate/deadlineExceededAfterCommit，UI取消保存也提示提交可能已完成，不假报未保存。真实Chrome两种时序与迟到deadline已分别通过。[存储回执](../analysis/launcher-v29/resource-store-browser.json)。
- **坏／未来／冲突记录：** 精确own-format和全部file MD5复核；不自动清库、迁移或覆盖坏记录。Future DB VersionError转受控schema提示；两个页面同revision仅一个写成功。恢复只接受当前完整配置/ordinal/目录/编码绑定，并要求再选；本页候选与已保存版本分开。
- **范围限制：** 一个绑定快照，1024文件/单32MiB/合计64MiB，非整安装库；无流式/跨XML版本迁移/配额预留/断电或浏览器驱逐保证。IDB get会先materialize浏览器clone，之后才做自有校验。重新运行原创服务的临时端口改变XML摘要，不能假称旧缓存自动跨新配置恢复。
- **验证区分：** 写失败是明确注入QuotaExceededError至真实事务，不是实际填满磁盘；390px是视口，pagehide为受控事件，未覆盖完整BFCache/Safari/真机/微信。原Windows文件恢复、可信来源与真实账号/opaque、游戏仍未知。[复核说明](../analysis/launcher-v29/review-notes.json)。

Node501、真实IDB12/页面13/旧回归19及交付示例通过，阶段新回执均成功；无新依赖/全局配置/VM/样本执行/官方请求。历史stage65产物事故仍保留原限制，本轮未重写历史产物。[验收](../analysis/launcher-v29/validation.json)。

## 保留补丁页面边界与验收纠正（stage73 / 2026-10-27）

- **已接通：** 明确基文件读取、准备/取消/审阅/选择与资源参数已进实际页面。候选有跳过条目不能选择；配置/目录/编码/基文件变化、缓存恢复、放弃和pagehide清旧数据。缺基文件的append显示跳过，提供实际基文件后已验58字节候选；不将跳过计为成功更新。
- **可重复QA误解：** Playwright isDisabled(fieldset)与DOM disabled不同，此次重复旧假设后已修正为DOM与实际流程断言。append缺基文件时应等跳过文案，不能用成功文案helper等30秒后判产品失败。两份初始失败回执及最终13项成功分开保留，未重写历史截图/回执。[纠正](../analysis/launcher-v28/review-corrections.json)。
- **尚未验：** 候选只在本页内存，资源适配只消费名字；不表示安装目录已更新或游戏可读。精确loopback来源许可只是开发能力，MD5不证明来源。原生事务/恢复、实际ACP/DBCS、真实服务/opaque、Safari/真机/微信和游戏仍未完成；pagehide事件检查不扩大为完整BFCache。

本轮491项Node、13补丁/6默认浏览器流程与交付示例通过。没有原EXE/VM/真实账号/官方请求或全局配置变更，既有单次执行批准不复用；stage65历史产物事故继续保留限制。[验收](../analysis/launcher-v28/validation.json)。

## 保留补丁入口与下载边界（stage72 / 2026-10-27）

1. **事实/易错字段：** game+1b80是原Code文本，缺失补丁器复制源为Code/PatchEXE；PatchEXE的大写helper虽有MakeLower/mbslwr标签，最终200h映射支持大写。应追callee与指令，不能按FID名或相邻槽位猜语义。[来源](launcher-static.md#launcher-v27)。
2. **实现复核修正：** optional文件元数据为null，原PatchEXE正文会被规范路径丢掉斜杠/边缘空格。已独立保留patcherText，用正文生成计划、用规范路径作文件元数据；旧文件路径契约保持。批处理迭代也只读一次清单快照。[修正](../analysis/launcher-v27/review-corrections.json)。
3. **仍未验：** 原复制/隐藏属性/进程/等待/删除与DBCS/权限/失败恢复；未加引号的原命令不是可安全直接执行的接口。新下载只有显式许可来源/总时限/取消/最终内存候选，没有登录页控件或安装目录提交；100完成标记不代表可信文件或认证。

REA在缓存检索结果尚未返回前，同批又查询了一次已有412b10；明确计为重复，不计新函数或独立结论，后续改用retained投影。当前原EXE/VM/账号/官方请求均为0，未使用旧执行批准或改变全局规则；旧stage65历史回执事故继续按原记录披露。Node478及Chrome11流程通过，不扩大成原生或官方验收。[总验收](../analysis/launcher-v27/validation.json)。

## 保留Patcher实现边界（stage71 / 2026-10-27）

1. **事实/格式误判风险：** URL以.bz2结尾，但已证消费者是ZIP。最小处理为沿下载→虚槽→档案打开→EOCD消费者核对，复用已装Pako；禁止据后缀补造bzip2或拿自更新首项规则替代全条目。[来源](launcher-static.md#launcher-v26)。
2. **事实/恢复缺口：** 原replaceto下载前shell删除、下载后MD5仅见日志；实际失败恢复未验。独立实现只在内存验证后移除旧项并强制最终摘要，既不运行原shell，也不把这项政策称为已还原原生回滚。原文件系统/权限/重试及信任仍待验。
3. **可重复测试问题：** `name:C:x`按原冒号切分得到3段，被忽略；最初1条路径测试预期错误，改为验证skip，不改生产语法绕过证据。首轮失败、最终38定向/457全量通过均保留。ZIP中file a与directory a/b也已加入祖先冲突拒绝及坏包用例。[测试](../analysis/launcher-v26/patch-tests.log)、[契约](../analysis/launcher-v26/implementation-spec.json)。

当前候选只支持严格相对ASCII路径，真实ANSI/DBCS、磁盘替换/属性/时间、官方包、页面补丁交互及目标平台未验。本轮未操作VM/原EXE/真实账号/官方服务，也不启用任何旧单次批准。既有stage65历史回执覆盖事故仍按原记录披露，本轮不重写历史回执。[总验收](../analysis/launcher-v26/validation.json)。

## 保留Galaxy边界与取证记录（stage70）

- **静态风险，未宣称运行复现：** 407880的index≤count多读一条，原加载器Gamecode用于无界计数下标；405f90在整个区域first exact name match后取参数，未再核game。独立实现严格0..14/15条预算、真实count范围、全区域重名禁选，不复制这些行为。[证据](../analysis/launcher-v25/static-spec.json)。
- **仍未知：** 固定RegionList无Galaxy，真实配置/Windows选择设置、widget排序、locale/ACP和错误路径未验。新UI/原创XML/本机对端不能提高官方认证或游戏兼容结论。缓存恢复需重新选，不复用旧分组；分组不能授予新连接端点。
- **取证复用纠正：** 一次本地retained查找遇None，410c80被重复查询；修正查找后定位旧记录，该份不算新函数或独立交叉验证。gobjdump/llvm-objdump不在PATH，直接复用Xcode的xcrun LLVM21，无新安装/配置/权限或目标重启。最终REA已关闭。

本轮436Node、26锚点/3负例和Chrome6新/9旧通过；原VM分支未恢复，历史stage65产物事故继续保留原限制，未重写历史回执。[验收](../analysis/launcher-v25/validation.json)。

## 当前统一交接的复核与边界（stage69）

- **已修复：** 生产lease借出实际typedarray，消费者可覆盖fill，使close后映射仍非零；单个分离buffer原可阻断后续擦除。最小修复捕获内建fill、对各owned view独立清理、关闭幂等。17新/421总Node及9新/8旧浏览器通过；外部copy/转移目标不受清理控制，不声明全堆抹除。[复现](../analysis/launcher-v24/review-corrections.json)。
- **QA假设纠正：** Playwright isDisabled(fieldset)与其DOM disabled字段不等价，改验DOM及实际子控件；webkitdirectory setInputFiles([])被工具拒绝，改选第二个实际原创目录。初始回执和像素先保留，未换输入方式绕过任何审批或运行原程序；这些是普通测试API契约问题。
- **仍有限制：** 浏览器目录为ASCII长名匹配/提供次序，属性32不是Windows真实属性；无内容完整性或安装身份验证。明确目录/编码不等于HKCU/INI/实际ACP；已尝试未准备不能fallback。Galaxy、真实会话/更新来源/事务、game consumer/官方及目标设备继续待验。[契约](../analysis/launcher-v24/implementation-spec.json)。

本轮无VM/电脑控制或新官方连接；历史stage65回执覆盖事故继续保留原限制，所有当前QA输出已核准至v24/新临时目录，未重写历史。后续VM/电脑操作仍先读本页原操作知识库。

## 当前启动参数核心的范围与已核验问题（stage68）

- **静态命名冲突已澄清：** CString的GetAllocLength和StringUppercase标签不能直接当语义；前者40bd50→40c910实际读data-12，后者经44e159/LCMapStringA flag100h进入lower。408a47预压title供第二次operator+消费，伪代码缺参不能当title未追加。以Listing/字节和调用链复核，不能修改原样本修“命名”。[证据](../analysis/launcher-v23/static-spec.json)。
- **独立范围：** 仅ASCII/C文件标题，raw字段不猜编码；实际CRT locale/DBCS、Win32 wildcard/8.3/顺序/路径与异常未等价。输入snapshot只证明本地生产算法；ready/auth/game均未知。参数空格/双斜线保持，未经证据不“修正”quote/trim。游戏消费者仍待后续阶段。
- **验证记录：** 首轮测试metadata投影含多余oracle字段，13/14；初始日志保留，移除仅该比较字段后404总测试通过，非产品缺陷。此前4174会话48946退出1且端口未监听，输出不支持归因或成功；本轮不重启该分支。仅核心Chrome核验，不虚报UI/真机。[检查](../analysis/launcher-v23/checks.json)、[验收](../analysis/launcher-v23/validation.json)。

历史回执覆盖事故继续保留原限制；本轮所有新输出只在v23、stage68及新临时目录，不重写历史。VM/电脑控制仍先读本页原操作知识库，本轮没有相关操作。

## 当前映射生产端与生命周期（stage67）

选择候选现在会准备本页内存交接前缀，显示映射名/字节数和“尚未交给游戏”；输入/编码/配置/文本/确认模式与pagehide会关闭它，模式取消保留。Node390、Chrome8交接/9编码/17配置流程+1测量通过。[规格](launcher-static.md#launcher-v22)、[运行](../web/README.md#launcher-v22)、[验收](../analysis/launcher-v22/validation.json)。

- **pagehide残留就绪显示已修复。** 初始Chrome7项通过后，受控persisted PageTransitionEvent观察selection-status仍可见；根因是只close内存lease。改用clearResult/closeModeDialog并重置文本/输入/确认/状态，同流程8项通过；不扩大成完整BFCache证明。[修复证据](../analysis/launcher-v22/review-corrections.json)。
- **共享copy函数边界有陷阱。** 44dc00只有7字节，JMP44dc75进入44dc10拥有的循环；按入口body或伪代码跨度推断所有代码会漏事实。原函数caller清单partial仍保留，未称全程序调用完整。[REA](../analysis/launcher-v22/static-spec.json)。
- **旧测试文案不是新需求。** 配置回归原断言“游戏交接待实现”，在6项后失败；现严格验证CGSharedMem17B生产已准备且尚未给游戏/认证未验证，其他门禁/交互断言保留。失败回执/像素先保留再重验，没有为过测试倒退产品。
- **写入前缀不是完整映射。** 只生成首NUL结尾的≤92B，256B剩余尾部不清零；无实际Windows映射或argv。lease.close只清自有及借出view，外部copy/JS GC不受控；身份/opaque有效期和游戏消费者未知。

现有17项native历史与原4173离线服务保留，没有VM/系统设置、原游戏或官服操作。下一步继续argv/资源/启动和交接消费缺口，完整登录器与游戏仍未完成。历史stage65事故仍有原限制，本轮新输出独立stage22。

## 保留模式存储与字段审计（stage66）

新增“保存保留方式”和刷新恢复，只写非秘密模式值。账号、复选框选择、账号编码、文本确认不保存；无效记录不自动覆盖，写入异常/回读不一致均显示未确认。Node380、Chrome12设置+9编码+17配置回归/1测量通过，总10041ms。[规格](launcher-static.md#launcher-v21)、[运行](../web/README.md#launcher-v21)、[验收](../analysis/launcher-v21/validation.json)。

- **字面偏移初查范围不完整，已补齐。** 初始22处只到4aafff；原文件完整.text发现额外4处，扩展REA搜索并查明4个异常展开释放函数，现26处和2析构CALL/4展开JMP一致。禁止把字面清单或释放函数当全局账号存储/清零证明；别名、编辑控件、间接回调和其他API仍未知。[证据](../analysis/launcher-v21/static-spec.json)。
- **首轮UI脚本selector错误，产品未失败。** #prepare-catalogs不在当前HTML，0流程完成/超时；确认旧handle退出1后改#prepare-session-catalogs，12项通过。保留错误元数据/日志，初始临时像素未独立保留，不冒称首轮成功。[复核](../analysis/launcher-v21/review-corrections.json)。
- **存储结果必须区分。** provider未取得为不可用；已调用写但异常或回读失败/不一致为未确认，不能宣称未写或成功。正向原生Storage/刷新通过；负例是明确受控hook，不当原生配额全面测试。后写覆盖无CAS/自动回滚保证，其他标签页设置不自动改变当前输入会话。
- **模式与账号分离。** 刷新恢复1时用户名勾选按模式默认重置为true，密码false；这不是恢复上次复选框或账号。未保存的模式改变仅本页有效，实际原账号持久化仍有全局未知路径。

无新原EXE/VM/真实账号/官方请求或系统设置动作，原4173服务保留。完整账号/服务/更新事务、游戏/目标设备/官方兼容仍需继续；下方stage65事故与历史限制保留，v21回执没有覆盖历史输出。

## 保留文本编码、候选与证据事故（stage65）

三种显式账号/名称profile已实现，中文936与UTF-8实际交换通过；默认ASCII且XML编码独立，切换清旧输入/确认/候选，无法无损解码的名字禁止选。Node369、9编码检查与17回归/1测量通过，整体10043ms。[规格](launcher-static.md#launcher-v20)、[运行](../web/README.md#launcher-v20)、[验收](../analysis/launcher-v20/validation.json)。

- **历史产物误覆盖，未恢复精确原件。** 直接运行含硬编码旧路径的v19 QA，覆盖旧详细回执及3个临时PNG；原manifest hash及既存汇总/日志保留。旧JSON改为明确事故指针，新观察/重验单独保存v20。之后先复制并核全部输出路径、固定stage20 receipt guard，再运行。禁止把新结果回填成历史原件或宣称hash恢复。[事故](../analysis/launcher-v20/artifact-output-incident.json)。
- **中文状态断言曾使用错误源行顺序。** 原夹具source顺序zeta/Alpha/beta/Beta，数值门禁仅source0/2可选；新中文名替换后排序不同，必须按原bytes/保留数值列核对。初次4项通过后失败保留；据Python独立解析修正预期，未改生产门禁。[复核](../analysis/launcher-v20/review-corrections.json)。
- **实际ACP仍未知。** profile是明确用户选择的适配能力，不能由zh-CN、XML UTF-8或GetACP导入推定。936固定旧表，不代表全部现代Windows PUA/best-fit；其他代码页/IME未验。编码失败不给替换/猜测回退，也不回显账号输入。
- **浏览器能力边界保持。** Chrome窄视口只证明响应布局；Safari、真实手机/微信小程序、官方服务/真实账号与游戏未验。原4173服务保留，本轮仅自有原创回环示例正常退出，无VM/系统安全设置动作。

仍须推进可证的账号/服务生命周期、实际条款、更新来源/原生事务与目标平台，再按顺序进入游戏。下方阶段按当时范围保留；v19详细回执引用须连同本次事故限制阅读。

## 保留配置与会话合流、排障（stage64）

文件、显式缓存恢复及HTTP候选准备已接入实际登录流程；Code原文/数值与BIP允许列表绑定，配置/区域变化清旧输入/确认/候选。Node358、Chrome17流程+1时限测量通过，整体10052ms。原生IDB冲突/坏记录和HTTP更新/失败、真实WS/TCP/独立Python请求均有回执。[规格](launcher-static.md#launcher-v19)、[运行](../web/README.md#launcher-v19)、[验收](../analysis/launcher-v19/validation.json)。

- **Code/索引不可混用。** v18独立示例的运行Code+1不能沿用到真实配置；Code11直接形成request11/许可Game11_License，前导零许可文本和重复Code记录身份保留。许可表索引Code-1只在许可核心内使用，不能改请求值。
- **浏览器断言与真实禁用状态不同。** Playwright1.62.1的fieldset.isDisabled观测为false，但DOM disabled属性/attribute为true，子输入isDisabled与:disabled也为true。修正断言为实际子控件/DOM属性，不修改生产门禁。[诊断](../analysis/launcher-v19/fieldset-diagnostic.json)。不能把该观测扩成所有浏览器/API结论。
- **两个单测假设错误已修。** Galaxy负例先用了未知空GList，版本字段误写.version；改为已支持的非空Galaxylist检测和declaredVersion，不放宽解析器。[修正](../analysis/launcher-v19/review-corrections.json)。
- **取消/时限必须分层。** 最终429请求含1次持有响应取消/超时负例ERR_ABORTED，预期项与非预期错误分开。HTTP参考加载与prepare共享一个10s，不各重置10s；取消后不应用晚结果。File底层Promise不能强制中断，缓存晚提交成功不能谎称回滚。
- **坏缓存不自动修复。** 信息读取失败保留当前合法内存配置，缓存仍留原样且版本未知；重新检查或显式读取文件/准备配置继续，不删除/覆盖未知record。手动入口只是开发路径，不替代原在线更新/官方认证。

当前仍缺非ASCII/实际条款与账号存储、服务身份/opaque寿命、官方更新信任/原生事务、游戏及Safari/真机/小程序。原4173离线服务不变；上一轮4174自有预览确认无连接后正常SIGINT退出再更新，没有VM/安全设置/真实账号动作。下方stage63及以前为当时范围。

## 保留浏览器登录切面与排障（stage63）

已实现独立本地页面、原生WebSocket与显式回环Node TCP薄适配；Node347及Chrome桌面/390px的10项最终通过，Python独立核对4个完整浏览器请求。没有官方默认地址/连接；只允许启动时明确列出的127.0.0.1对端。原4173离线服务/CSP保留，新服务默认4174，[使用](../web/README.md#launcher-v18)。完整登录器、配置/bootstrap合流、非ASCII/实际条款/账号与服务生命周期、游戏/小程序/官方兼容仍未完成。[验收](../analysis/launcher-v18/validation.json)。

可重复问题与最小修复：

- **根页面非空但资源404。** 新服务原先根路径直接返回HTML，浏览器把相对资源解析到根并404；改根302到/web/login.html，并验证Location、最终路径与实际渲染。不得靠放开源码/原件路由或CSP解决。[初次失败](../analysis/launcher-v18/browser-validation-initial.json)。
- **修改输入后旧候选仍可选。** 原流程保留4行/2可选；显式输入/文本准备或重读现在取消旧session并清候选/选择，用户名变化还清确认。默认程序清理刚完成请求输入时仍保留该次结果；两种动作分开。[前后复现](../analysis/launcher-v18/review-corrections.json)。
- **误期望候选数导致测试超时。** 原夹具是4行，测试写6；独立诊断确认请求/解密、4行与0活动连接正常，修正测试值，未改协议或弱化选择门槛。[诊断](../analysis/launcher-v18/browser-diagnostic.json)。
- **ACP仍未知。** ANSI控制路径和GetACP的CRT引用不决定运行时ACP；UI只接明确ASCII子集，拒绝非ASCII，不通过猜936/UTF-8或沿用XML编码消除错误。[REA](../analysis/launcher-v18/static-spec.json)。

ws8.22.0已按用户普通依赖授权补齐、固定并核完整性/保留许可；不需要运行安装脚本、原生插件或改全局工具/权限。回环bridge不是面向官方或远程手机的部署，不能把127页面/桌面窄视口当手机/小程序或官服验收。本轮没有VM/原生电脑控制/真实账号操作，不复用历史一次性执行额度；下方stage62与更早记录仅适用于其当时范围。

## 保留会话执行与实际传输边界（stage62）

已有实际字节流执行器、平台随机数/时钟/十秒截止、取消/迟到清理和显式白名单Node TCP开发端口。Node335及独立原创Python对端通过；浏览器6项使用注入流，并非浏览器TCP。现有配置页未加会话控件、CSP不变；网页/小程序传输与真实服务接受仍需解决。[规格](launcher-static.md#launcher-v17)、[验收](../analysis/launcher-v17/validation.json)。

复核已修复accepted close方法被重读、失败回执共享可变内部错误两处问题；端口方法和受控错误现在保持所有权边界。[精确复现](../analysis/launcher-v17/review-corrections.json)。测试曾误用一次事件循环等待推断对端accept/close，两个失败保留，改等实际事件；不得把本地调用返回当远端回执，[修正](../analysis/launcher-v17/test-corrections.json)。close拒绝/不响应只作受控计数与尽力释放，不承诺任意provider都可强制关闭或撤回已发bytes。

## 保留UserMode与账号记忆边界（stage61）

REA补核8函数/14记录，29固定操作数与54独立政策表通过；纯核心已实现初始化/切换的非秘密模式效果，Node300及Chrome旧页/核心5项通过。[当前规格](launcher-static.md#launcher-v16)、[验收](../analysis/launcher-v16/validation.json)。模式UI与实际持久化未接入；`clearInputs`/整数写入均为意图，不冒充系统动作。

初始化mode2只清密码勾选，不能套用切换模式清两项字段的规则。原modal非1都会写2，新计划用明确cancel保持不写，2→1未确认/拒绝也无效果。精确名称未解析不是能力或API缺失；按已知IAT/原始导入验证5处引用后继续，不重装REA或改其配置。所查Path/模式路径未给出真实账号写盘规则，注册表/其他API和间接调用仍未知，不把有限负结果当全程序不存在记忆账号。

## 保留本机配置缓存与服务排障（stage60）

- **已执行并验证：** 浏览器原生缓存已接配置页，显式保存/恢复/重检/取消；冲突或失败令版本未知，重新检查后才能继续保存/恢复。写失败/冲突保留当前模型，恢复开始即清旧模型/计划/目录。坏record/未知schema不自动删除或覆盖，当前无页面删除/修复缓存入口，可继续本地文件/示例。
- **可重复问题及最小修复：** 新窄上下文卡在初始提示，4个本机ESM模块`ERR_CONNECTION_RESET`；直接GET200、原服务存活。相同Handler的16并发对照，运行时默认队列5仅6成功，队列64为16成功。只把本机服务backlog设64，核对精确PID/cwd/命令后SIGINT正常退出并同端口启动；16/16、完整14项与独立窄屏流程通过。[证据](../analysis/launcher-v15/server-burst-check.json)。
- **禁忌/未决：** 不因超时就重复启动服务，不扩展绑定/路由/CSP，不把直接GET成功当模块突发成功或归因于未证实的日志阻塞；本轮修复不能追认旧v12/v13问题同因。初次缩放截图额外顶栏条带原因未定；最终新上下文header仅1、无横溢出，初始/缓存截图正常，[视觉记录](../analysis/launcher-v15/visual-review.json)。
- **尚未验收：** HTTP初始化仍未接页面；缓存来源/认证未验证、无原生文件事务/账号/条款或游戏。Safari/真机/小程序未测，当前390px只代表Chrome窄视口。VM历史执行额度/工具停止点不因本轮页面工作改变。

## 当前限制

- **官方联网未实现、未验证。** 没有账号登录、补丁下载、游戏服务器通信或协议兼容；历史原生画面为原创离线演示，网页灰度核验也不是游戏玩法。页面、socket、假会话或构建通过不能证明官方兼容。
- **许可缺口具体存在。** 公开及样本随附协议对衍生软件、逆向和通信协议模拟等有相关文字。短引文、精确字节偏移、样本/条款哈希见[条款核验证据](../analysis/terms-quote-verification.json)与[官方渠道核查](official-terms.md)。这些事实不等于对适用范围、合同效力或项目合法性的判断；换成网页/小程序或增加网关也不能推定获得许可。
- **样本来源未认证。** 只有本地 SHA256、下载应用元数据与官方同日期 ZIP 链接线索，没有官方哈希匹配或信任链验证。
- **游戏主体未完整恢复。** 三个 EXE 呈打包/保护候选布局；本阶段没有动态运行、脱壳或保护绕过。导入与字符串仅支持依赖线索。
- **格式覆盖有限。** 共享核心已读取40字节索引和RD v0/v2原始索引像素平面；69条固定真实记录在Node中与独立Python oracle逐项对照一致。当前只支持灰度核验，不证明正确官图颜色、透明索引、方向或绘制语义。RD v1/v3压缩版本仍明确拒绝；实验解压模型不是已验收格式。MAP平面/碰撞、动画、文字、战斗与声音播放等仍未完成。见[资源证据](../analysis/resources-v2/notes-graphics.md)、[V3 62条](../shared/evidence/real-v3-comparison.json)、[Joy 7条](../shared/evidence/real-joy-comparison.json)。
- **真实浏览器文件导入尚未验收。** 索引与图形配对文件的实际浏览器导入流程因工具返回 `Transport closed` 中断；环境恢复时两个文件输入均为空，没有成功导入与预览的闭环证据。结果应记为“中断后未验收”，不推断中断前曾成功。Node的69条真实记录对照、文件适配单元测试和原创夹具显示不能替代真实UI文件选择/读取/预览验证。此处是工具连接中断，不是用户拒绝或site-safety拒绝。
- **更新/认证缺完整规格。** 登录器字节/交换执行、许可/模式、更新ZIP/清单/GET、初始化/候选缓存、配置页及回环浏览器登录流程已限定实现；当前Node390、Chrome8交接/9编码及17回归/1时限测量通过，显式936/UTF-8中文请求已验。仍缺远程网页/小程序实际传输、官方HTTP/CORS/来源信任、实际ACP/IME/其他locale、原生事务/回滚、实际条款/账号存储和服务会话/opaque寿命。游戏相关矩阵状态未由登录器子集升级，见[逻辑/协议规格](logic-protocol-spec.md)。原创对端接受不能替代官方回执或真实认证。
- **更新器局部行为不能直接作为兼容实现模板。** ZIP与完整MD5现已静态闭合，但等待API参数/线程ID异常、删除/复制未检查返回、restart成功失败都可exit0、HTTP状态查询失败仍继续等边界保留。算法识别不证明来源信任、原子替换或回滚。见[消费者与生命周期](../analysis/protocol-v3/updater/findings.md)及[当前v14](launcher-static.md#launcher-v14)。
- **浏览器传输有边界。** 普通网页WebSocket不是原始TCP/UDP，WebTransport也不是任意原生端口转发；当前没有官方支持网页传输的证据。须先确定实际传输与消息规范，再选择适配方式；见[网络调查](network-portability.md)。
- **微信能力核查被拒绝、产品适配未验收。** 官方TCP文档此前被浏览器工具的site-safety policy拒绝，未重试或绕过；基础库、平台、域名/端口、并发、后台行为等仍待官方资料确认。不能断言微信没有TCP/UDP，也不能说这些能力已可用于本项目。当前无小程序产品及手机/小程序真机验收；桌面窄视口不是手机真机结果，H5 web-view也不等于原生小程序适配。
- **网关只是有条件方案。** 只有在实际协议和普通网页限制确认、且取得适当许可后，才评估官方接口或授权网关。必要性、账号/票据可见范围、加密终止、会话隔离、日志、出口限制、延迟和费用尚未闭合；网关不能消除许可和账号风险。stage63仅实现原创回环验证bridge；没有官方服务网关部署、购买服务或代管凭据。
- **原生包尚非发行版。** SwiftPM executable 默认没有签名、公证或安装器；只验证本机，未测试旧macOS、Intel、长时间运行或辅助技术全部行为。
- **分析工具局部失败保留。** 部分 REA 包装入口在受限环境不可用；直接后端成功不等同于包装入口成功。Ghidra 后续标准缓存写入后已完成登录器分析，详见[方法](analysis-methods.md)。
- **没有 Git 基线。** 原目录没有仓库，本次未初始化 Git、提交或推送。未来如建立版本管理，必须持续排除用户安装包与官方解出内容。

## 下一步优先级

2026-10-27用户指定先REA登录器、实现登录器，再REA游戏、实现游戏；优先级以[当前需求](development-plan.md)及[登录器v22](launcher-static.md#launcher-v22)为准。配置/bootstrap/缓存/模式偏好存储、浏览器回环会话及三种显式编码已限定验收；继续实际ACP/IME/其他代码页、实际条款/账号存储及服务生命周期，再处理远程/小程序传输、官方HTTP/CORS/来源信任与原生替换回滚。下列游戏优先/环境提案为此前历史，不能替代当前顺序。

1. 第三阶段已核对更新器消费者及非自更新启动分支；当前关键缺口是游戏侧argv/命名映射消费者到socket/分帧链。原.text无文件后备、网络导入不可见且同名字符串无已识别引用，需要合法且版本绑定的可读消费端证据。仍可离线研究更新摘要、pak变换及Patcher虚分派；不为绕过打包/访问限制而运行目标。
2. 浏览器真实文件流程继续未验收，第三阶段明确未重试。以后单独安排时从用户明确选择配对文件开始，检查记录范围、错误反馈与灰度结果；单独记录工具中断、实际成功和未运行项。继续用Node69条差分作为核心证据，不替代UI证据。
3. 扩充已支持资源格式的独立样本与坏输入；对压缩版本、调色板、MAP坐标/平面等先取得消费者或独立行为证据，再决定实现。不得把候选平面命名为已确认碰撞规则；官方资源留在本地，测试用原创夹具。
4. 基于GameList的实际编码、裸`&`与重复Code设计离线目录模型，绝不自动执行XML中的EXE、URL或参数。跨平台核心保持无DOM/Node/wx依赖，浏览器与将来的小程序适配分别验证。
5. 明确手机/小程序最终形态，并在可用官方资料条件下核实微信能力；遵守既有site-safety拒绝，不换渠道绕过。随后才安排目标设备/基础库的正式能力和生命周期验证。
6. 官方联机前先澄清运营方许可、当前版本、合法测试方式及具体用户授权，再提出动态、会话或联网任务的目标、数据范围、风险和停止条件。用户方法澄清、工具审批或网关方案都不能替代这些条件。

每项完成都需要代码或可复核证据、对应测试、文档更新以及明确剩余未知项。没有证据时保留“待验证”，不以功能占位或接口名称充当完成结果。

## v3历史环境边界（当时VM已停止）

- 首次2024年4月Windows条款接受已实际完成，随后一次接受被审查拒绝；本轮重新观察已越过许可页，没有重试被拒动作，不归因推进者。许可证适用性/激活仍未验证。
- 同一原盘改NVMe后，安装器已识别80GB目标盘，家庭版已从该盘启动到OOBE；当前系统盘已有Windows数据。停在必须联网的页面，未到桌面，正常请求关机后确认停止。配置未变化、38/38复核通过，网络/共享关闭；旧VM和空白基线保留。
- 不能把进度条、盘识别或配置审计当完整安装/环境就绪；实际最终阶段以环境与验收记录为准。首次设置联网/账号、内部隔离、TPM/Secure Boot、图形和x86模拟需分别验收。
- 微软公开要求家庭版首次设置联网及Microsoft账号；这不扩大授权，不绕过OOBE/激活/安全要求。游戏安装/执行、账号会话及官服通信仍未进行。

实际配置、镜像证据、回滚与最小离线观察计划见[环境记录](vm-environment.md)。

- 当前准确阻碍：OOBE“下一步”因未联网不可用，无可见离线选项。需具体临时联网授权并由用户处理可能的账号要求；未尝试该动作，没有工具审批挂起，不使用绕过。系统内banner已观察10.0.26300.9457，桌面/设备健康、激活与恢复启动仍未验收。证据见[环境末节](vm-environment.md)和[截图](../analysis/vm-install-v3/oobe-network.png)。


## v4历史边界（当时工具状态）

临时NAT及必要官方驱动**现已获用户授权**；当前阻碍改为UTM新增设备类型入口被自动审查两次拒绝，动作均未执行，不能换路绕过。VM已关机、Network仍空、共享关闭。官方NetKVM ARM64最小介质已准备，但Windows信任验收和安装未运行，OOBE/桌面仍未完成。CAT证书身份不是验签通过，不能因工具CTL格式失败就断言驱动损坏；任何正常Windows拒绝均不可绕过。[最新环境记录](vm-environment.md)。

清理候选五个注册项都显示停止及Trash路径；系统拒绝直接列举Trash，实际文件存在、占用和共享依赖未核实。没有删除或移除注册，不能把显示大小相加为可释放空间；当前VM、基线、ISO、驱动介质及项目均保留。[候选表](../analysis/vm-install-v4/cleanup-candidates.md)。

## v5历史边界

原设备菜单拒绝已由新的具体确认解决。Shared/NAT及最小只读网卡CD已接入，Windows正常驱动安装后OOBE显示“网络已连接”，经正常延后更新和重启后到微软账号流程；后续离线入口检查与人工账号操作相遇，最新为验证码页，UI已停止。不能据此推导桌面、全部设备、x86游戏或官方联网兼容性；完整驱动身份/信任验收仍须独立证据。先前界面接管中断已恢复；当前有人工账号操作，尚未到桌面；用户优先本地账户，但本版本正常离线入口尚未完成核验。NAT仍临时开启，恢复断网、正常系统更新与最终设备复核待设置完成；没有改建另一台VM。见[环境记录](vm-environment.md)和[联网观察](../analysis/vm-install-v5/oobe-network-connected.png)。

用户已经撤销旧VM清理并自行处理；助手无成功删除或取消注册，不再读取废纸篓、请求清理或把空间变化归为自己的成果。

## v6历史边界

桌面、家庭版ARM64、更新前完整构建10.0.26300.9457与NetKVM100.100.104.27100/Up/Windows已签名已核验。设备仍有36项非零问题记录，三项具名PCI设备已匹配官方候选；最小随机数和基础显示介质仅准备，未挂入或安装。Windows正常更新重启已到PIN页，当前待用户亲自登录；助手未修改其锁屏/PIN设置，相关修改分支已由用户结束。

NAT尚未关闭、Windows冷基线未创建；主机共享关闭。更新后构建/剩余更新、设备修复、TPM/Secure Boot、完整签名信任、重启后桌面、恢复断网和恢复启动均未验收。三盘离线核验器10项测试通过，但当前NAT配置正确被拒；不能把测试通过当作VM已离线。具体证据见[环境v6](vm-environment.md#v6实际桌面与驱动核验正常更新重启后的交接)。

[待授权客户端实验](../analysis/vm-install-v6/client-experiment-plan.md)明确固定文件/hash、来源缺口、已登录Windows身份风险、一次90秒加载和停止条件。游戏未导入/执行，Windows许可不等于游戏许可；网页/手机/小程序与官服兼容没有新增通过项。

## v7历史环境缺口

临时NAT已关闭，四盘保存配置22/22核验通过；旧“仍有NAT”是v6历史终态。当前系统已升级并观察到10.0.26300.9711桌面，但仍36项设备问题、可用更新未全部核实，激活提示存在。最小RNG/DOD光盘已挂入且比较一致，安装尚未开始；断网重启后的PIN登录须用户亲自完成，属于认证交接，无新的审批拒绝或不确定的驱动安装动作。

私有恢复副本仍未创建。脚本只完成准备与合成测试，不能将未来计划记为备份成功。恢复启动、TPM/Secure Boot、x86兼容和游戏协议缺口不变。详情以[v7环境记录](vm-environment.md#v7更新后桌面恢复断网和四盘驱动介质)及[系统观察](../analysis/vm-install-v7/guest-observations.json)为准。

## 当前v8环境缺口

本次一次性登录成功；输入捕获恢复，RNG/DOD两项驱动Windows均报告IsSigned=True且设备OK。当前VM已正常停止、断网且无共享，私有7文件冷副本已完成hash校验；旧“尚未复制/等待本次PIN”的文字仅为历史阶段。

仍34项设备问题，精确分类与必要性见[剩余设备研究](../analysis/vm-install-v8/remaining-device-research.md)；v6负搜索漏O已限缩。安全启动为True，但管理员Get-Tpm返回0x80284001，因此TPM及全部设备健康未通过。未清除TPM或改变安全控制，未为消除警告安装额外服务。更新是否全部完成、许可证/激活、安装后重启、冷副本恢复启动、x86/旧图形/游戏兼容仍未验收。副本含Windows身份状态且与源同卷，不能分发或当作异盘灾备。下一次登录不能复用本次代填授权。[最新环境](vm-environment.md#v8输入恢复必要驱动和私有windows关机副本)。

## v9剩余缺口

Mac控制连接已恢复，旧locked报告不是当前阻碍。独立恢复测试已到Windows锁屏，桌面及TPM只读查询仍需要用户亲自登录该克隆；不复用之前的凭据。TPM精确错误为TBS内部错误，PPI只是待验证线索；34项历史设备问题和未闭合更新仍保留。恢复可启动不等于全部健康或游戏可玩。[启动证据](../analysis/vm-install-v9/restore-boot-observations.json)、[调查](../analysis/vm-install-v9/tpm-and-device-investigation.md)、[下一步](../analysis/vm-install-v9/next-actions.md)。

## 输入复查仍未闭合

用户实体键盘持续失败尚未复现到可定位根因。工具在原VM捕获开启后能用空格打开空PIN页，但这不能代表实体键盘可输入，也未测试PIN字符。当前没有新的当次登录确认；未登录。若继续恢复桌面/TPM诊断，指定目标仍是已停止的MoliRestoreTest克隆，先启动核实当前页，再由用户自行登录或主会话取得当次明确确认。无需打开USB共享。[观察与限制](../analysis/vm-install-v9/input-focus-followup.json)。

本次克隆登录的具体确认已取得，但执行前两次工具观察均报主机locked，授权尚未使用；当前阻碍是电脑控制访问，实际主机屏幕无法独立观测。测试克隆最后实测为停止，本次未启动。没有凭据提交失败或未知登录结果。[准确状态](../analysis/vm-install-v9/login-access-blocker.json)。


<a id="vm-troubleshooting"></a>
## 本项目操作与排障知识库（操作前必读）

<a id="guest-resource-enumeration-access"></a>

### 当前资源查询的 Windows 来宾入口

前次 `prlctl exec --current-user` 的无害回显返回 255，提示无法开启来宾会话。窗口画面可读，先后出现激活提醒和更新重启计划。 [原回执](../build/analysis/legacy-resource-handoff-v1/windows-access.json) · [重启计划](../build/analysis/launcher-f5a-title-bytes-v1/source-review.json)

本次窗口显示自动暂停。把原窗口带到前台并用标准命令恢复后，Win+R 打开普通 PowerShell。中文组合用 Escape 取消，Ctrl+C 退回空提示符，Ctrl+Space 切到英。长行在提交前核对，出现组合时取消。以已核哈希的只读光盘和短命令完成枚举，采集文本与来宾摘要相符，原卷已核恢复。 [环境记录](vm-environment.md#guest-resource-access-recheck)

模态消息补测从现有 Windows 桌面用 Ctrl+Escape 搜索并打开普通 PowerShell。`7+5` 回显 12 后接入原创只读夹具。首条哈希输入触发中文组合，提交前取消。切换到英文后，核对完整 SHA-256 与调用行，再运行一次。原光盘及桌面均已回读。 [来宾复核](vm-environment.md#guest-launcher-modal-dispatch)

<a id="wechat-sdk-first-auth"></a>
### 2026-11-10：微信工具首次Codex授权与未启动server的任务查询

**症状/证据**：安装诊断compatible=true（工具2.02.2609250、技能0.3.11），check_wechatide_status返回auth任务pending。AX实际弹窗显示“Codex”“MCP 客户端授权”及“允许后将开启服务端口”。两次查询同task均exit1；准确错误为“Failed to connect to WechatIDE. Please run `wechatide auth -c <clientName>` to auth and start WechatIDE server.”[回执与当前状态](../analysis/capability-first-v1/wechat-host-profile.json)

**最小后续与禁忌**：先取得该Mac工具设置变更的具体范围；获准后按正常界面处理已有授权，再查同task及真实version/login/token状态。该授权门槛适用于 CLI/MCP 服务任务。查询失败不当终态，不重发未知auth/status任务。

**执行/未执行**：已完成签名/CLIhelp/安装诊断、只读AX及9文件原创探针静态核验；未授权、未开端口、未导入/运行SDK或启动peer，游戏/VM/账号/官服0。SDKVersion、手机/Canvas/文件/网络和完整生命周期仍未验；此记录不是锁屏恢复、Windows桌面或游戏兼容证明。

**2026-11-11 本机图形导入**。目录选择的 Return 回执超时，随后实际回读的目录已是目标。导入表单的背景点击未观察到效果，再次核对表单后用 AXPress 创建，出现独立工作区。模拟器首次报两页缺少 `index.json`，补齐后自动编译并写出回执。原服务任务状态独立保留。 [执行记录](../build/analysis/wechat-offline-sdk-v1/execution-record.json) · [实际运行范围](architecture-and-milestones.md#wechat-devtools-offline-sdk)

**双槽夹具补测**。新目录选择器停在路径确认，后续窗口盘点仍显示选择器。使用已运行的自有测试工作区临时加载夹具，结束后复核 11 个原文件。首次记录器的 `instanceof ArrayBuffer` 断言失败，模拟器槽文件已匹配两次提交。改用新的缓存配置、定位读取及 `byteLength` 内建检查后取得原始槽回执。同次 `navigateTo` 失败回调报告超时，实际分包加载、返回和文件回执齐全。使用具体生命周期和读回确定该次状态。 [执行记录](../build/analysis/wechat-sdk-slot-store-v1/execution-record.json) · [运行核验](architecture-and-milestones.md#wechat-sdk-slot-store)

**缓存重建补测**。双槽移除并重建后，现有微信适配器接收同修订号的旧请求。已发出的写入超时可返回结果未知，即使底层文件已写成。通用发布恢复按活动根、修订和发布身份核对。App 实际崩溃后的恢复待验证。 [复现与范围](architecture-and-milestones.md#wechat-sdk-cache-recovery)

**大资源拒写**。早期合成试验在同一 App 删除超大定位文件后写入 4,394,665,605 字节，可能受缓存计数影响。普通写入补测中，实际素材与移除候选后的新 App 合成对照均在第 13 个 8 MiB 块被拒。按 SDK 回执保留未发布状态，测试块和副本按已核身份移除。旧根留存和真机容量沿对应验收用例验证。 [旧定位回执](architecture-and-milestones.md#wechat-sdk-archive-files) · [普通写入对照](architecture-and-milestones.md#wechat-sdk-archive-ordinary-quota)

**选择大 ZIP 时的临时复制**。开发者工具 2.02.2609250 的 `chooseMessageFile` 对 2,549,171,845 字节文件返回成功回调，文件项报告超过 2 GiB 且缺少路径。以文件项和后续 `stat` 确认候选可用性。两个早期超时只说明选择尚未在适配器期限内返回。结束后恢复并核对 11 个原工程文件，移除自建试件和回执目录。小对照 ZIP 的 SDK 临时文件删除请求被拒，由 SDK 管理。 [复现与范围](architecture-and-milestones.md#wechat-sdk-archive-selection)

**分段读取与另存配额**。同版开发者工具可先后选择约 1.275 GB 的两段。已读回整包并核对摘要。8 字节对照经 `saveFile` 移入指定路径并删除，两段实际素材的 `saveFile` 均报告存储配额错误。读取完成并关闭探针资源后，宿主按本次文件的创建时段、大小和摘要识别并移除两份临时副本，恢复原游客工程。 [实测与清理](validation.md#wechat-sdk-segmented-archive-validation)

**分块探针自动刷新**。普通编译在探针仅创建目录后生成新实例，首次准备把空候选当作已发布目录，读取清单失败。补查目录清单和前置回执后只恢复空候选。有部分块时沿未发布路径处理。前往目录快捷键两次未弹出面板，之后从原生选择器文稿栏目打开私有测试目录，两份选中结果均由 SDK 回执确认。已恢复原游客工程 11 个文件。 [空候选回执](../build/analysis/wechat-sdk-archive-reopen-v1/resumed-empty-sdk-receipt.json) · [配额与清理](validation.md#wechat-sdk-archive-ordinary-quota-validation)

**微信原生选择器与重开**。一次“前往文件夹”确认报告目标窗口变化，选择等待超时。关闭该次面板后，从下一次面板当前目录选择唯一的原创 ZIP，确认以 SDK 文件回执为准。初次探针补齐范围端口关闭方法后通过 ZIP 检查。受控移开临时副本后，新 App 在 `stat` 阶段反馈文件缺失，用户目录副本仍可读。两份实际选择产生的探针临时副本均已按摘要移除。 [复现与清理](validation.md#wechat-sdk-selection-lifetime-validation)

**完整分段重开**。首次确认前往目录超时，但面板后续实际打开该目录。结束超时的旧选择后从同一目录重新选择，以文件行身份及 SDK 文件回执确认。文件行的 AXOpen 返回错误时也先核对面板已关闭及新回执，再处理下一段。首轮探针终态回执引用了错误的局部变量，修正后沿已保留清单完成全量复核。 [恢复证据](validation.md#wechat-sdk-segment-resume-validation)

**微信工具进程重开取证**。正常关闭当前工作区可先回到项目列表，使用工具退出菜单后再核主进程消失。新 PID、同一工程、不同 App 启动标识和 SDK 文件摘要共同确认跨进程读回。原生选择器的目录确认或 AXOpen 返回异常时，先查目标窗口和 SDK 回执，确认选择确实超时时从已定位目录重试。本机已完成小型持久文件和完整临时分段两种重开，异常退出及完整素材持久化继续验收。 [小型探针](validation.md#wechat-devtools-process-reopen-validation) · [完整分段探针](validation.md#wechat-sdk-segment-process-reopen-validation)

<a id="stage222-devtools-import"></a>

### stage222 微信开发者工具的导入和回执

**症状与证据**。自动化报告服务端口关闭。普通导入向导已回读最终默认构建路径，界面显示游客 AppID 限制，创建操作后仍显示导入页。界面已有“不使用云服务”选中状态。AX 无法操作的单选框以实际截图确认，导入取消后回到项目列表。

**处理边界**。本机只使用生成目录和默认游客 AppID。现有应用账号、服务端口、URL 校验和其他项目配置保持当时设置。微信运行、实机和游戏联机仍待验收。 [阶段回执](../analysis/game-wechat-page-v1/validation.json)

<a id="stage151-release-source"></a>
### stage151：完整载体、普通成员和版本证据分别核验

**症状/证据：** 1.58GB历史包下载约0.17MiB/s，不满足600秒预算，正常中止并保留30,343,168B，exit130。Inno不支持；7-Zip exit0只列内嵌gzip，不是完整Wise文件树。专用REWise本地源码构建后读出2369条目，按两个明确数据范围再取1,457,157B，精确DEFLATE/双CRC/完整成员SHA通过。[材料与范围](../analysis/game-release-current-v1/legacy-acquisition.json)。

**最小处理/禁忌：** 大包保留partial，不把缺失区补零当真实数据、不重下未变现行EXE；用固定源码/原许可的普通容器读取器，不执行安装包/游戏或恢复保护负载。只声明完整所选成员和独立版本，不将旧版37c4/ce3f与9baa/6e2ff同名文件合并。普通匿名FTP421后停止并发，关闭自有连接后才发新范围请求，不换IP/账号绕限。

**编码/工具：** 主站HTML按HTTP声明UTF-8离线重解，首次误用GB18030的错误保留；Wise日志不是完整UTF-8，选定ASCII条目改按字节匹配，不篡改中文路径。Codeberg网页抓取受robots限制，公开仓库API和固定源码归档正常可读；没有修改工具配置。REWise与同名无关Python包区分，源码/构建及39REA记录均只保留本项目私有目录。[REA与源字节核对](../analysis/game-release-current-v1/source-check.json)。

**实际状态：** 自有下载进程已终止、两成员完整、REA快照导出并关闭；当前版本/业务/渲染仍未验。本轮没有VM/锁屏、桌面、设备或游戏运行证据，不复用旧诊断额度或重试已关闭的原生服务。[验收](validation.md#stage151)。

<a id="stage150-rd-runs"></a>
### stage150：压缩run占位与真实颜色必须分开

**症状/证据：** 原原创实验对C/D/E输出零值；新的完整差分发现接受记录有142,343,812未知像素位置、1,163,863未知palette位置。第三方查看器采用自选F0并裁短v1超出，是其自身政策，非固定游戏消费者。[源与限制](../analysis/game-rd-runs-v1/source-check.json)、[完整差分摘要](../analysis/game-rd-runs-v1/corpus-comparison.json)。

**最小处理/禁忌：** 新API保留独立known mask，已知literal/repeat零值与未知位置不同；原34个ordinal继续RD_RUN_OVERRUN，不裁尾、不自动补色/透明、不开放未见0x2，也不修改原样本。新模型与raw API分开；无实机游戏根因判断。

**工具与状态：** 公开文件连接器返回Unknown tool github.fetch，未重复同请求，改用公开主站只读HTTPS并固定commit/hash，不改连接器或审批配置。其代码未保存/执行/作为依赖。无新VM/锁屏恢复、桌面、设备或游戏运行证据；原生IDE服务关闭未重试，当前设置未复核。[验收](validation.md#stage150)。

<a id="stage149-game-config"></a>
### stage149：配置callback未被Ghidra定义与原生读取边界

**现象/证据：** 对0x401000的猜测入口未命中，已弃用；已从源/引用取得的0x401140与401432亦无FunctionManager函数，前者Listing不可解码。它们不是不存在/损坏代码的证明。已有REA GNU objdump完整静态反汇编显示default401140和DDX401420正文，43条指令逐条匹配原件；没有补装工具、重开相同失败查询或改全局分析设置。[错误修正/源](../analysis/game-config-v1/source-check.json)。

**读取契约：** 原401480请求256B后直接strstr/sscanf；所见路径未检查实际长度、写NUL或验证数值结果。现有23B模板不含NUL，不能由静态结果推断原生崩溃、栈值或游戏行为。独立codec只读前256、首NUL/有界EOF，缺失/失败/溢出/范围外显式拒绝；默认状态只显式请求，不吞错写文件。

**验收/禁忌/未决：** 829Node/3portable/7工程通过；该消费者属于Config.exe，不能替代主游戏argv/IPC/socket/消息/移动/战斗消费者。无原程序/VM/WER/CDB或官方动作，保留已消费诊断和原生工具停止点；实际GUI、游戏读取及效果待证。

<a id="stage148-resource-cache"></a>
### stage148：资源缓存、已完成迁移重放与交付buffer清理

**症状/来源：** 首个恢复用例读metadata.stats.requests失败，实际夹具计数是metadata.requests；纠正后新宿主恢复/交换成功，下一准备仍被PATCH_PATH_ALIAS拦下。直接以恢复文件调用原preparer也得到Append rename destination already exists：夹具重放create first.bin→append/rename final.bin，但final.bin已存在。原消费者未错，不能为测试放开覆盖。

**最小修正/已执行：** 夹具下一清单核对恢复后的base.bin/final.bin MD5，只取manifest、零archive，证明恢复base未被清空。最终复核另外真实复现native read callback先到、timer未处理、续接check超时时未清交付buffer；泛型invoke在抛错前清理本次read结果，保留修前源码76f7a90b…520341f与失败回执。[三次失败、最终测试](../analysis/launcher-wechat-resource-cache-v1/test-results.json)、[源检查](../analysis/launcher-wechat-resource-cache-v1/source-check.json)。

**结果/禁忌/未决：** 最终822Node/7生成工程通过；同JS上下文两slot/CAS/损坏另一slot恢复与晚写结果未知已验。未发出写时可中止；发出后不自动回滚/重试或先清payload，必须等native callback释放锁。两份皆坏不自动删/覆盖；跨worker/进程、实际quota/内存/设备FS及断电未验。无新VM/游戏/CDB/原生工具尝试，不拿文件回读作设备或官方兼容证明。

<a id="stage147-current-patch"></a>
### stage147：旧补丁调用元数据不能代替当前版本

**症状/事实：** 当前跨平台补丁计划原先引用旧601b raw命令和wait描述；当前c82的40ec40/435a10/431f90却引用路径并经timer250ms查询，435ad0还规范化/检查目录。裸GetExitCodeProcess名查询未解析是名字范围问题；完整KERNEL32.DLL名/xrefs能定位40b010。并非导入不存在或游戏故障。[可追溯证据](../analysis/launcher-current-patch-v1/source-check.json)。

**最小修复/已执行：** 固定样本hash、复用匹配快照，跟踪调用/原件14指令及4映射后分离当前模块，路径formatter与规范ASCII计划分开；补root单分隔符、地址/端口前提和有效选择。10新/802Node及5工程通过；先前33/34项通过日志属于中间切面，最终802覆盖后加的存储防护。无VM、CDB或目标执行。

**禁忌/未决：** 不用新样本沿用旧命令，不把warning当timeout终止，不把退出100当认证，也不把retry动作数据变成HTTP重试。完整Windows/MBCS/FS/目录包含关系待验，超当前ASCII子集明确拒绝，不回退旧profile。原生IDE停止点/锁屏/桌面/设备/游戏均无新增状态证据；保留既有授权，不消费或重放旧诊断。

<a id="stage146-wechat-resources"></a>
### stage146：隐藏后的来源重选、测试DNS响应及旧源材料

- **已复现/根因/最小修复：** 目录/来源已选后hide，资源reset清掉sources但父级仍保留目录，导致picker被禁用且无法直接重选。新增用例修前1失败，04962368…源码快照/回执保留；hide改为清数据后重建当前可用来源，index仍−1需明确选择，最终19专项/792完整/5工程通过。[前后绑定](../analysis/launcher-wechat-patch-v1/source-check.json)。
- **夹具问题/禁忌：** 初次生成工程5项4过1失败：虚拟patch-source.invalid通过注入fetch映射至真实loopback，返回Response.url仍是loopback，被现有HTTP最终URL检查拒绝。改测试响应包装保留原body/status/headers，真实重定向仍reject；没有放宽产品URL、Origin、域名或安全配置。并加强资源选择必须持续到原创交换结束的断言。[失败与最终记录](../analysis/launcher-wechat-patch-v1/test-results.json)。
- **材料复核：** 旧/tmp两个原件不在，四份已知私有REA导出/快照hash仍相符；固定项目保留Patcher副本重新核578560B/195f3afd。旧601b/1735168B主程序原件在198个限定项目EXE/bin/unpack候选中无同size项；已知c7ba副本不等同601b/c82。只做已知项目目录读取，不恢复/重建保护内容，不以历史导出当新原生运行。[源审计](../analysis/launcher-wechat-patch-v1/source-check.json)。
- **已执行/未决：** 本机原创HTTP/relay/ZIP/JS及Python对端，未触及原生微信/VM/Windows/游戏/CDB/账号/官服。relay仅loopback或未部署handler，HTTPS/DNS/上游身份/设备及资源持久化仍需独立验；不跟随未知源、自动备用/重试或转发账号头，不用另一接口重放既有原生停止请求。

<a id="stage145-wechat-cache"></a>
### stage145：缓存版本参数必须在异步操作前固定；写取消不是撤销

- **已复现/根因/修复：** 初次771全回归未覆盖调用者修改options；新增用例先保存revision1，再以expected0调用并在首await期间改options.expectedRevision为1，旧实现错误放行并写revision2。修前专项1/1失败，源码/哈希/回执保留；改为开始时复制仅已知own data选项，拒accessor/继承expected/额外字段，最终22专项/773完整/4工程通过。[源与修前哈希](../analysis/launcher-wechat-cache-v1/source-check.json)、[失败与最终测试](../analysis/launcher-wechat-cache-v1/test-results.json)。
- **预算与夹具：** 1MiB raw上限不取消既有XML256KiB字符、节点/字段等更严预算；首轮19项中1个错误边界假设已纠正，产品未为夹具放宽。完整性摘要不是来源认证，MOLICAT1是原创缓存格式，不是厂商字段。
- **最小安全接续：** 原生writeFile无abort，写已发出后取消/期限/错误返回CACHE_COMMIT_UNKNOWN，保留payload和同上下文互斥直至回调；没有回调就不能再操作该profile。明确重新检查可读最新完整slot；不要自动重试/回滚、清空其他profile、把普通目录/文件错误当缺失或把回读当断电/跨进程保证。
- **已执行/未决：** 只在原创Node API形状/本机独立测试文件/新JS环境和Python对端运行，未使用真实微信存储。原生CLI/VM/Windows/CDB/游戏/官服0，旧服务关闭门槛未重放，锁屏/桌面/设备/游戏无新验收；实际native存储、JS上下文边界和持久性继续单列。

<a id="stage144-wechat-http"></a>
### stage144：独立微信初始化联调与原生验收边界

- **可复现症状/修复：** 新host文件读取已完成、HTTP调用0且目录未载入；根因是stage143配置快照只留解析结果，未保留allowBareAmpersands，传入bootstrap变undefined。补保留布尔值，false及raw-amp true路径均实际通过。首轮关联3失败全部消失；没有为适配器跳过bootstrap输入检查。[测试/保留失败](../analysis/launcher-wechat-bootstrap-v1/test-results.json)。
- **夹具与依赖：** GB18030 BOM用例误将U+FEFF当四字节pointer（该pointer位于禁止段），改用84319533；另一个目录夹具缺必需EXE，补原创建original.exe。HTTP错误类/预算抽离增加ESM依赖，同步补三处精确路由并以实际HTTP检查200/JS及未知路径404，不改通配/安全范围。
- **许可输出门槛：** 最初生成器在引言第一次出现BSD标题时截取，linked notice只有94B，交付检查正确拒绝。改为精确独立标题并检查许可条件/免责声明；原完整LICENSE保留，重新生成后三个notice各1529B且逐份含完整正文，751Node/4工程重新通过。不以存在LEGAL文件或标题作为完整许可声明证明。[前后哈希](../analysis/launcher-wechat-bootstrap-v1/source-check.json)。
- **交付校验顺序：** 累计矩阵已有以analysis/开头的根相对引用及矩阵相对引用两种格式，校验器须保留历史解析合同；当前manifest内链在检查前先生成明确candidate，再在全部通过后覆为最终清单。首次校验器的单一相对基准/先验文件存在假设已纠正，候选或检查失败都不算交付通过。
- **已执行与最小接续：** 最终751Node、4生成工程通过，三份新工程留本地build且0外部导入；全部使用原创数据/自有服务。本轮原生CLI/SDK/VM/游戏/CDB操作0，既有服务关闭回执未重放，不启用设置或传票据。[准确旧门槛](#stage143-wechat-cli)。
- **禁忌/未决：** native request缓冲上限/TLS/域名批准、文件选择是否触发hide、后台timer/渲染/手机和官服须各自验；FS/choose没有abort只做逻辑取消，不能声称停止原生UI/底层读。选中文件只读、size前后相等不证明内容期间不可变，实际摘要只绑定所读字节；不执行更新EXE，不重放旧诊断或绕过保护。

<a id="stage143-wechat-cli"></a>
### stage143：微信DevTools服务端口关闭，尚未连接原生模拟器

- **症状/实际执行：** 现有公开CLI帮助可用，官方miniprogram-automator0.13.0一次普通launch指向本项目新生成build/wechat-app-fixture；SDK错误明确包含服务端口关闭，约16秒后本次runner退出1。0连接、0页面/渲染检查、0截图；游客占位/AppID/WXML是否被工具接受未知。未为复现重复相同请求，也不把此错误当工程不兼容。[最小无敏感回执](../analysis/launcher-wechat-host-v1/native-ui-audit.json)。
- **边界/禁忌：** 项目AGENTS禁止修改工具安全/审批配置；此次未开启服务端口、传token/登录ticket/信任标志、重启IDE或改其他项目，不换接口绕过该关闭状态。没有新的MCP自动审批拒绝，不能把SDK设置错误写成MCP权限拒绝；这是已执行失败，非待批计划或verified wait。
- **最小接续：** 仅在安全设置有经明确允许的实际变化后重核并重试原生路线；保留当前生成工程及719Node/2工程JS证据。当前不要求用户操作，先推进独立的HTTP/目录/资源实现。Mac锁屏/Windows输入/设备/游戏均未新验收，没有本轮VM/CDB/游戏/网络共享状态变更或恢复完成声明。

<a id="stage138-fingerprint"></a>
### stage138：普通输入可用；未捕获字节和固定指纹不符须分开解释

- **症状/最小处理：** 已有终端实际输入1并输出1，普通输入本轮恢复；通过正常最大化按钮操作。长行内部损字在提交前Ctrl+C取消，改用短行、等完整回显后逐条Return；早期只有前缀不重发。cb128旧变量为空不当工具路径，显式设置正确路径、hash/Valid核实后才调用。[输入与前检](../analysis/game-text-observer-runtime-v1/access-stage138.json)。根因与长期稳定未证，无人工请求。
- **已执行：** 同次PID5304第二份已有dump，身份/空符号目录/无ntsd.ini/新日志/进程前检与12参数回读完成后，只一次离线CDB、两段共64B。退出0且日志8880B/74行/hash实际读数；原始日志留来宾，仅投影4行hex。结束时进程0、原dump SHA未变、空提示符。[查询及比较](../analysis/game-text-observer-runtime-v1/code-fingerprint-stage138.json)。
- **结果/禁忌：** 初始化候选32B的??表示未捕获，不填0；故障32B与候选delta参考31B不同，不强行映射函数或当保护/架构/依赖根因。主文件精确32B/26B搜索0不证明不存在变换/间接代码。无需为投影重跑CDB，不跟随指针、扩大读取、重建映像、改保护或重放已用游戏额度。
- **分层/未决：** 本轮桌面/有限输入与被动查询成立，token、VM UUID/设备/全部隔离配置未新核，恢复启动、真实游戏、消费者及三平台/官方接受仍未验。未新增游戏/读取器/夹具、新转储、附加、权限、WER/UAC/网络/共享/安全/输入配置/生命周期或控制后端变更。下一步须有独立源/模块/行为绑定，不再把任意delta作为归属依据；既有授权与账号/PDB答复保留。

<a id="stage137-input"></a>
### stage137：既有原生快捷键能响应，不代表普通输入已通

- **症状/已执行：** 现有Windows画面和历史stage132控制台可读；原生Keyboard索引点击AXError.failure后，按新画面坐标打开同一菜单并选既有Win+Q，搜索出现。普通文字/单键、200ms输入、Raise/窗口选择和来宾点击没有确认文字；查看Edit并Cancel后保留原搜索。未按Return，0来宾命令/0CDB/0游戏，未新查进程或dump身份。[回执](../analysis/game-text-observer-runtime-v1/access-stage137.json)。
- **最小处理/禁忌：** 普通输入无证即停止试键；不把菜单成功/指针移动/旧输出当命令执行，不用粘贴共享、快捷键配置、CLI/另后端、权限/安全变更、重启/恢复替代。没有审批拒绝或Mac locked，不新增人工请求；根因仍未隔离，长期稳定未证。
- **接续/分层：** 后续新观察确实恢复后，先验证焦点与清洁提示符，处理可能迟到输入，再核dump/CDB hash/Valid签名、进程、空符号目录、ntsd.ini及新日志不占用，只执行原两段32B被动查询。主机静态指纹/新的登录器encoder/663Node不能验收这次读取、游戏消费者或官服可玩。

<a id="stage132-stack"></a>
### stage132：正常Resume与既有转储的固定范围读取

- **现态与最小恢复：** 先核实际VM UUID/config，再从菜单区分普通“恢复”与“恢复到快照”；本轮已知VM原处暂停，普通Resume一次实际回到桌面。新终端经既有Win+Q打开，字符1执行输出1及目录/日期查询成立；没有重启/还原、新点、管理员启动选择或UAC。主体角色未另查，不能把普通启动选择当完整token验证。[访问](../analysis/game-text-observer-runtime-v1/vm-access-stage132.json)。
- **输入与投影：** typeText早期前缀须等完整回显，不重放。收尾长行内部损字在Return前已Ctrl+C取消，短哈希/进程行完整回读后成功。首批数值过滤只出六行，不能写成缺栈或零；从同一日志按固定001af4c0子串补读一行，七行19个DWORD齐全，未重新调用CDB；初次过滤/输入原因未扩大排查。Alt+Space未证窗口菜单时不追加x等潜在默认动作。
- **已执行范围：** 同次PID5304第二份dump重新核长度/哈希，微软CDB哈希/Valid签名成立；进程0、新日志False、空本地符号目录及cwd无ntsd.ini成立。十一项参数回读后仅一次-z，四段76B、不跟随指针/读代码或字符串，退出0。[数值与回执](../analysis/game-text-observer-runtime-v1/cdb-stack-stage132.json)。
- **证据边界：** 三个静态固定地址、两处候选帧内指针及回填槽同值加强初始化层对应，原栈“后续帧可能错误”的限制未解除。默认void签名不覆盖EAX消费事实；3000操作截断pcode不证明完整别名闭包。静态映射器不证明异常所有者，不提取或重建受保护负载。[分析](game-static.md#stage132)。
- **收尾/禁忌/未决：** 原始dump和8822B日志仅留来宾，日志哈希实际回读；21:33画面游戏/CDB进程0，空提示符。无新游戏/读取器/夹具、转储采集、WER/注册表/策略/权限/网络/共享/安全或控制后端修改，无新locked错误和人工请求。stage131 WER恢复是历史实测，本轮未重读；本轮桌面/有限输入/离线分析通过，不代表长期输入稳定、设备归属、恢复启动、正常游戏、根因或三平台官方可玩。

<a id="stage131-wer"></a>
### stage131：一次WER诊断完成；输入、投影和栈可靠性分别验收

- **现态/授权已用：** 用户对原问题明确答复“允许本次诊断及对应 UAC”。同一现有VM新建具名恢复点后，双视图只设本应用DumpFolder/DumpCount=2/DumpType=1；普通会话仅启动一次PID5304，6.466299秒自然退出`0xc0000005`。两份PID/时间/稳定长度/哈希合格小型转储共33850522B，两个CDB离线读取各退出0。旧125与本次运行均已用，不重放。[授权](../analysis/game-text-observer-runtime-v1/authorization-stage131.json)、[生命周期](../analysis/game-text-observer-runtime-v1/wer-lifecycle-stage131.json)。
- **恢复所有权：** 本轮前检两个LocalDumps父/游戏键均不存在，AeDebug Auto均缺失；写64视图后32仍不存在，再分别创建32。恢复前逐视图回读本轮三个值/类型及零子键一致，非递归撤销游戏键，再撤销原先不存在且仍空的父键；18:59双视图父/游戏键均False，句柄释放、管理员终端19:01正常退出。不得把两视图缺失预检当物理别名证明或覆盖其他所有者变化。[配置](../analysis/game-text-observer-runtime-v1/wer-configuration-stage131.json)、[恢复](../analysis/game-text-observer-runtime-v1/wer-restoration-stage131.json)。
- **输入最小处理：** 早期Return无回执，正常Window/既有Win+Q、搜索字符1/Escape/可见Ctrl+C后恢复；中IME及损坏的长行均在Return前取消。短分段完整回读后才提交一次；typeText早期截图只有前缀时，等后续完整截图，不补字、不重放。单独Shift返回不支持，不是审批拒绝，不据此改控制后端/共享/安全。没有新增用户手动操作请求。[输入回执](../analysis/game-text-observer-runtime-v1/input-stage131.json)。
- **投影错误与修正：** `$d131.Length=1`是数组元素数，文件长度须读`$d131[0].Length`。首批栈正则假定数字帧号而匹配0；实际前缀字符码120/56/54为`x86`，修正空白感知过滤后取得9/8行。先前0不能写成没有栈。两个输出都匹配一次“Following frames may be wrong”；数值列只算候选，不当真实调用链。[CDB摘要](../analysis/game-text-observer-runtime-v1/cdb-summary-stage131.json)。
- **地址与静态核对：** 两异常VA不在39个所列模块范围，不能减主程序基址当RVA。REA新24条记录核实六个`.text1`返回值都在函数体/指令边界并位于CALL之后，四个直接静态边、两个间接边界成立；未比较运行时字节、未确定间接目标或协议职责。完整汇编/原始CDB/转储不加入公开交付。[REA摘要](../analysis/game-text-observer-runtime-v1/rea-stack-correlation-stage131.json)。
- **收尾/禁忌/未决：** 19:56实际复查EXE完整哈希一致，游戏与CDB进程合计0；19:59两原始日志完整性和CDB版本回读，普通空提示符保留。恢复点结构及六个旧点保留已核，还原启动未测；未修改AeDebug/全局WER、策略、网络、共享、防护或兼容标记，未附加调试器、登录、读取原`.text`或扩大内存采集。桌面/本轮短输入/本次崩溃诊断通过；持续输入稳定、设备归属、正常游戏启动、根因、消费者与三平台/官方可玩未验。[收尾](../analysis/game-text-observer-runtime-v1/wer-postflight-stage131.json)。

<a id="stage130-wait"></a>
### stage130：前检不替代执行时确认，自动继续不构成答复

- **准确现态：** 128已提具体按应用小型转储/一次普通游戏运行问题，129继续限定只读前检并完成；130核最近三轮记录仍无答复。普通输入最后可用是129的实际区间，本轮未操作UI或重新验证，不把旧画面当新回执。[审计](../analysis/game-text-observer-runtime-v1/blocked-audit-stage130.json)。
- **停止依据：** 同一确认条件跨三轮持续；前两轮确有独立进展，本轮已无可独立推进的取证/实现工作。没有live job可轮询，不把等待聊天答复称为verified wait；不是旧锁屏/输入故障计数，没有自动审批拒绝。
- **禁忌与恢复：** 不重复输命令、重放125或新建无结果阶段，不改变安全/共享/控制后端来回避CUA的未知来源执行时确认。既有VM/联网/工具授权保留，不重问账号/PDB或要求Windows手动操作。原问题答复或新证据到来后，按[原方案](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)及真实状态接续；恢复后的blocked审计重新计数。实际状态以[工具回执](../analysis/game-text-observer-runtime-v1/goal-status-stage130.json)为准，目标仍未完成。

<a id="stage129-input"></a>
### stage129：跨调用菜单编号失效；同次实时定位恢复输入

- **症状与已执行：** 注册表键查询先有实际输出，首个Auto行完整可见后Return/Ctrl+C无确认响应；正常窗口选择、空白点击仅指针反馈。工具栏键盘AX返回failure，跨调用嵌套Win+Q编号返回invalidUIElement，均不是审批拒绝。[输入回执](../analysis/game-text-observer-runtime-v1/input-stage129.json)。
- **最小有效处理：** 同一CUA调用内读取全AX并唯一匹配设备菜单，打开后读取新AX、唯一匹配原有Win+Q并点击；实际Search出现、普通字符1可见、Escape关闭、原终端ctrl+c出现^C和空提示符。随后重输只读Auto行实际ABSENT/ABSENT，再查成员False/False。不要跨调用复用Qt嵌套编号，也不把指针/菜单关闭当键已送达。
- **前检与收尾：** 两逻辑视图身份已回读；LocalDumps父/游戏子键均不存在，Auto值缺失。目录False、C余量230298329088B、进程0、精确游戏路径/2904064B；4个只读句柄Dispose后空提示符。无读取拒绝、注册表写入、UAC、新恢复点或样本执行。[实际证据](../analysis/game-text-observer-runtime-v1/wer-preflight-stage129.json)。
- **禁忌与未决：** 保留stage128未答复的执行时问题；不把自动继续当许可，不重放125，不新增人工Windows操作。未改键盘定义、共享、网络、安全、权限、策略或控制后端；不由两视图缺失推断别名或由Auto缺失保证采集。此轮末尾普通短输入已证，持续稳定/设备归属/恢复启动/崩溃根因/正常登录/消费者及三平台官方可玩分别未验。

<a id="stage128-input"></a>
### stage128：普通输入与扩展路径、正则问题分开处理

- **已执行：** 正常Window/既有Win+Q后，搜索字符1、Escape、终端Ctrl+C/空提示符及`$wp126.Length`输出165成立；两份报告限定查询取得结果，不再把127输入阻塞当当前状态。无用户操作或新locked错误。[回执](../analysis/game-text-observer-runtime-v1/input-stage128.json)。
- **输入修复：** 字面反斜杠/caret缺失和长行内部损字均在完整回读发现后取消，未Return；改短StartsWith/like及`[char]92`构造。`pressKey('Ctrl+c')`返回keyNotFound、未发键，小写`ctrl+c`实际取消。早期前缀不是损字证据，须观察完整内部与尾部，不据此前缀补字。
- **独立构造错误：** 一次`-split [char]92`因正则尾反斜杠报ArgumentException，改`.Split([char]92)`；一次Join-Path对实际扩展长度前缀报空drive参数错误，不能写成变量为空或权限拒绝。原目录+`[char]92`+固定文件名成功，无权限变更。
- **附件路线结束：** 两目录含隐藏项的直接计数各1，报告44628/44632B；十个实际WER/Temp引用均False，包括两份.dmp。只证明此时这些路径的结果，不全盘搜索、不猜替代路径、不把模块清单当地址图或根因。[材料](../analysis/game-text-observer-runtime-v1/wer-artifacts-stage128.json)。
- **下一步/未决：** [新方案](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)拟一次普通启动和按应用临时小型转储；设置/新恢复点/采集未执行，CDB身份只证明准备层。执行时来源确认未取得，不重用125额度、不附加调试器或绕过保护。不改策略、共享、网络、快捷键、全局WER/AeDebug或取消的CLI。桌面/本轮短输入已证，持续稳定、设备归属、恢复启动、根因、认证及三平台/官方可玩分别未验。

<a id="stage127-input"></a>
### stage127：画面恢复不等于普通按键已进入来宾

- **事实/症状：** 新鲜AX及截图显示原Windows11、PowerShell和搜索面板，旧空白主体已不妨碍查看。typeText字符1、一次120ms按键1均未见回显；窗口AX点击、760/972及可见搜索位置1510/1945点击只见指针反馈，后续单键1仍未回显。不能据指针位置宣称点击、坐标缩放或来宾焦点已修复。[实际观察](../analysis/game-text-observer-runtime-v1/access-stage127.json)。
- **已执行的最小处理：** 实时AX匹配正常Window菜单中的唯一既存Windows11条目并选择一次，随后普通Escape；搜索面板仍在，终端恢复/取消未证。未按Return、发送新查询、重跑游戏/读取器/fixture、读取附件或更改VM设置；没有新locked错误/人工操作问题。
- **停止与恢复入口：** 125/126各有实际证据进展，但两个轮次末尾普通输入再次无可靠回执，127持续；按同一间歇性输入交付阻塞统计，不伪称三轮全程停滞，也不借旧锁屏/授权等待凑数。[审计](../analysis/game-text-observer-runtime-v1/blocked-audit-stage127.json)。停止自动反复尝试。实际普通输入恢复后，先检查/取消可能未提交的无害查询、验证短输入，再核原两报告实际路径和有限元数据；不据当前旧提示符判断空输入或文件不存在。
- **禁忌/分层未决：** 不通过CLI、共享、Ctrl+Break、快捷键/网络/保护/权限变更替代输入验证；不重复游戏、扩大读取或伪造认证。已有Windows/联网/工具授权不重问，无账号/PDB答复保留。画面可读成立，普通输入、报告附件、设备归属、恢复启动、根因、消费者/玩法及平台/官方可玩分别未验。

<a id="stage126-input"></a>
### stage126：普通输入短时恢复；错误偏移不能直接当原文件函数地址

- **已执行与证据：** 正常菜单中实时匹配原有Win+Q，搜索字符1实际可见，Escape回原终端，Ctrl+C实际出现^C/空提示符；短行完整回读后各提交一次，取得4条存量事件、两条1000详情/ISO时间及两个运行后完整哈希。随后两份1001在来宾内存解析，仅显示字段名与EventName/P1..P8，无日志/原始XML/内存导出。[输入](../analysis/game-text-observer-runtime-v1/input-stage126.json)、[事件](../analysis/game-text-observer-runtime-v1/events-stage126.json)。
- **诊断边界：** 1000的PID/创建FILETIME精确匹配，1001的选定字段只支持同窗、名称/版本/时间戳/状态关联。首个错误记录早于最早读取时点是按记录时钟与1500ms等待的推导；StackHash/PCH按不透明原值保存。模块unknown的FaultOffset不作为绝对VA/RVA；不减去猜测基址，不由空LoadConfig推断运行时缓解状态。[REA及独立检查](../analysis/game-text-observer-runtime-v1/rea-fault-layout-stage126.json)。
- **当前症状与最小接续：** 第二记录StorePath赋值完整回读、Return及空提示符成立；下一只读系统前缀查询两次观察无回显，未按Return。正常Raise、实时设备菜单Win+Q后，截图主体只见空白和顶部残条；一次Escape未恢复可读终端。当前焦点、未提交文本及取消状态未证，不称路径不存在或全面输入已修复。先恢复现有普通窗口画面，检查/取消可能未提交的只读行，再以短查询核实际报告路径和有限文件元数据；不要反复向空白画面输字。
- **禁忌与分层验收：** 不重放游戏、读取器、fixture或传输；不以Ctrl+Break、CLI、共享、快捷键/保护/权限/网络变更修复输入。无新locked错误，不重复要求用户解锁/授权。已证的桌面短命令、事件、哈希与当前失去回显分开；恢复启动、设备归属、根因、正常登录、游戏消费者与三平台/官方可玩分别未验。本轮无新的样本执行或内存读取，不能将旧单次执行方案当未用。

<a id="stage125-input"></a>
### stage125：完整回读后单次游戏执行；后续事件详情输入未证

- **实际结果：** 正常Window菜单选原Windows11后，1/Return/输出1和若干只读前检成立；原恢复点仍current。首个多行定义可见错漏已Ctrl+C取消并有^C/空提示符；第二定义分更短段输入，ToString全文与原方案一致后仅触发一次。游戏PID5136/9.123410秒/0xc0000005，读取器一次TEXT_ZERO/exit1、无输出，进程0已复查。[运行](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)。
- **输入边界：** typeText返回后仍有前缀/重绘不全；不要据此前缀补字。选中回读曾显示完整WaitForExit(5000)，Ctrl+End后定义尾部只保留到该行，已补回尾部并全文核对；不把这次选择/键行为当普遍修复或原始根因。菜单状态/编号变化须实时读取，坐标缩放/窗口匹配失败尚未修复。[输入记录](../analysis/game-text-observer-runtime-v1/input-resume-stage125.json)。
- **当前未决：** 精确进程时间、输出False/进程0有结果，Get-WinEvent赋值已返回提示符；目标详情投影没有可靠输出或新提示符，普通Return/Ctrl+C、Raise和窗口菜单尝试未证明恢复。取消结果不明，不称无事件/命令失败/终端清空；当前未返回Mac locked错误，也不要求用户重复解锁/授权。
- **最小接续与禁忌：** 先读当前只读行并取消未提交内容，再验普通输入、读取已存$ev125中目标事件和执行后hash。不要盲目Return、重放已用单次游戏/读取/fixture/传输，或用Ctrl+Break、CLI、共享、保护/权限/安全设置换输入。无新UAC/条款/账号、强杀/重启/还原。桌面与本次运行证据成立，设备归属/恢复启动/正常认证/游戏消费者/三平台分别未验。

<a id="stage122-input"></a>
### stage122：具体执行已获确认，实时菜单恢复输入后 Mac 锁定

- **症状与事实：** 原窗口画面可读，首次普通 Get-Date 未见回显，坐标点击返回 noWindowsAvailable。重绑/正常 Raise 未证普通输入；View > 退出全屏后普通窗口可操作，但字符仍未在终端显示。未按 Return，不把旧画面中的 hash/Win7/进程数当新前检。[选取记录](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)。
- **最小恢复与未决：** 菜单/设备条目会动态改变 AX 索引，出现 AX failure/invalidUIElement/app-change；先刷新完整状态，不跨截图复用编号。单次 CUA 调用内以实时文本匹配原有 Win+Q 再选取，实际打开搜索，普通字符 1 与 Escape 关闭成立。此顺序只成功一次，不证明全部输入稳定或原始根因。
- **目标与禁忌：** Windows 辅助应用的 bundle 在当前和冷副本中重复，按 bundle 选择被拒；只尝试精确当前 PVM 路径但超时，没有控制 handle，不选/启动冷副本。没有重启、恢复、工具/驱动重装、网络/共享/权限/安全或快捷键定义变更。旧 StartInfo JSON 分隔符错误用独立纠正回执接续，不改旧交付或来宾值。
- **当前门禁与分层验收：** 下一次 Get-Date 输入时工具明确返回 Mac locked / automatic unlock failed，未提交 Return；解锁后先检查可能未提交的短行，再验当前无害命令与实际前检。只保留一次正常解锁状态请求；本次来源执行确认已取得且启动/读取额度未用，不重复索取。恢复点 XML/current/身份已核，还原启动未测；桌面短输入部分通过，设备归属/新依赖/游戏/消费者/官方可玩均未新增验收。此为恢复后新锁定，不复用 stage115–117 或 stage119–121 的阻塞计数。

<a id="stage119-input"></a>
### stage119：普通短行恢复、长行取消及原快照返回闭合

- **事实与最小处理：** 原自身DBG中q完整回显；Return后仍未见普通提示符，普通Ctrl+C实际返回空PowerShell。后续短行回读→单次Return→实际输出可证。typeText返回时仍可能只出现前缀，不据此前缀补字。一段长批量检查出现内部缺失，两个独立画面仍不一致，已Ctrl+C取消，分短行取得全部结果；根因未定。[来宾前检](../analysis/game-text-observer-runtime-v1/game-guest-preflight-stage119.json)。另一次主机JavaScript字符串丢反斜杠在提交前发现并取消，改用String.raw核对后成功；不能把这个转义错误归成来宾输入根因。
- **回执与禁忌：** 同一既有fixture-text.bin经完整hash/长度复核，只返回一次；原文件、退出0、端口无listener及全量oracle闭合。不重放fixture、读取或接收器，不用主机预期字节替代来宾文件，不通过Ctrl+Break、共享、权限或安全设置恢复输入。[返回](../analysis/game-text-observer-runtime-v1/snapshot-return-stage119.json)、[比较](../analysis/game-text-observer-runtime-v1/host-oracle-stage119.json)。
- **恢复点与标识：** 新点原生创建完成，原会话仍在，旧点保留；还原启动未测。原生窗口AX ID与config.pvs的VmUuid不同，不能相互代用；首次回执脚本误把两者等同，写入前断言失败，已按实际字段更正。[精确元数据](../analysis/game-text-observer-runtime-v1/recovery-point-stage119.json)。没有强杀、重启、恢复或旧VM清理。
- **分层验收：** 正常访问和本次短行成立，不推定全面输入稳定或设备归属已验；原创正向资格通过，原游戏未执行/读取。游戏文件/Win7/五个直接库、读取器/输出/进程前检已证；动态/传递依赖、Win7效果、游戏消费者与官方可玩未验。新执行确认等待答复，没有新增人工操作请求。[独立方案](../analysis/game-text-observer-runtime-v1/game-startup-plan-stage119.md)。

<a id="stage118-input"></a>
### stage118：一次读取成功后普通输入失效，Ctrl+Break不是通用取消键

- **症状与证据：** 用户正常解锁后，短输入/fixture读出/自然生命周期均实证。后续元数据命令显示缺字，未提交；普通Ctrl+C/Escape/点击/短文字无可确认响应。原生Ctrl+Break实际进入PowerShell自身DBG，不是游戏调试器；q未见/未提交。原生Win+Q实际打开Windows搜索，但typeText与物理字符仍不出现。[回执](../analysis/game-text-observer-runtime-v1/input-observations.json)。
- **已执行与未执行：** 复用原窗口、短行完整回读、原生焦点/菜单和正常窗口模式。配置控件setValue返回notsettable；鼠标组合框的普通点击/Space/目标文本未观察到目标改值，最后鼠标/键盘仍自动检测。最终使用File > Close Window关闭配置，未更改后端、共享、权限、快捷键定义或VM生命周期。[模式检查](../analysis/game-text-observer-runtime-v1/input-mode-experiment.json)。
- **上下文问题：** AX与截图曾分别指配置/主窗口，初始截图也可能尚未呈现窗口动作结果；须读取新鲜目标并重取索引。折叠组合框的AX子文本不证明选项已实际展开，不以点击成功回执推定值已改。Command-W本次没有确认关闭，改用原生文件菜单后，主窗口和既有来宾会话才实际回读。
- **最小接续与禁忌：** 先恢复普通输入，只有在自身DBG里q完整可见时才单次Return；回到空提示符后短命令核原快照。不要再以Ctrl+Break取消、在未知行回车、重复fixture/读取器、重放旧传输或改共享/安全来换输入。原6624B文件按已观察基址00da0000传回即可；不用重做已完成的30秒进程。
- **按层验收：** 锁屏恢复和本次短命令成功；设备最终归属未新核，早期USB提示未选接Windows。原创工具读取/摘要/自然exit0成功，原文件传回/直接逐字节比较待完成；原游戏依赖/Win7/恢复前检、原游戏消费者/玩法及官方可玩未验。无新人工操作请求，不把新输入问题复用为旧stage115–117三轮锁屏计数。

<a id="stage117-blocked"></a>
### stage117：三轮正常访问失败，目标已标blocked

stage115准备工具时输入批次失败，stage116/117正常cua.listApps均返回Mac locked/自动解锁失败；这是连续3个goal turn的同一阻塞，不复用旧锁屏计数。第116/117轮无开发进展，当前无活跃进程/任务可作为verified wait。[审计](../analysis/game-text-observer-v1/blocked-audit-stage117.json)。

目标工具实际返回blocked。上一交付1639项hash及新观察器身份一致，仍不是Windows资格或游戏消费者验收。已有一次正常Mac解锁请求保留；现有Windows/联网/工具授权有效，无新密码/账号请求、CLI或共享/安全路径变更。恢复后先核未提交行、无害短输入、实际文件/目录/新PID，验真实fixture完整字节和自然生命周期，再另定游戏诊断方案。锁屏恢复、设备/依赖/恢复点及原游戏均未新验。[状态](../analysis/game-text-observer-v1/goal-status-stage117.json)。

### stage115：只读画面与输入锁定分离；新.text工具先验Windows字节

**症状与证据：** getApp/screenshot可读既有Windows/空提示符，首次输入批次却报告Mac locked/automatic unlock失败。没有Return、来宾命令、新PE或游戏执行；批次不提供各动作成功轨迹，不能把顺序推断当独立输入实证。[访问记录](../analysis/game-text-observer-v1/access-observation.json)。

**最小恢复与禁忌：** 已提出一次正常Mac解锁请求，保留现有VM/窗口；恢复后先核未提交行并用无害短输入验证。没有用户正常恢复证据前不重复同一输入、不换旧CLI/共享/安全路径；旧stage112输入成功和旧三轮阻塞都不能直接套用本轮。现有Windows/联网/工具批准仍有效，未消费新的原游戏观察额度或旧计划。

**工具问题已修：** 新构建先误用节表name键、DWORD指针及仅十进制objdump导入形状；分别改成真实布局字段/直接名称核对、uint32_t和实际<none>/hex形状，保留失败且未降低-Werror。最终39C/6Python、两次相同构建和链接配置通过。静态78导入名不是运行行为证明，CRT本进程VirtualProtect不等于目标VirtualProtectEx；同步API无全程硬期限。[审计](../analysis/game-text-observer-v1/evidence-audit.json)。

**按层验收：** 锁屏恢复未验；窗口画面可读/实际输入未验；设备/依赖/恢复点未新核；新工具Windows资格、原游戏代码消费者与玩法均未验。新工具先对原创fixture读6624B，按实际基址完整字节比对及自然生命周期通过后，另做新游戏诊断方案，不把39/6主机测试或旧8B夹具资格当成游戏证据。[具体方案](../analysis/game-text-observer-v1/windows-qualification-plan.json)。

stage116复查：正常`cua.listApps({emit:false})`再次返回Mac locked/自动解锁失败；同一阻塞连续2个goal turn，未取得app/guest、提交输入或启用替代路径。1637项前交付hash通过；已有正常解锁请求不重复，主机准备已完成，不以追加测试/计划当开发进展。[本次实证](../analysis/game-text-observer-v1/access-recheck-stage116.json)。

### stage114：夹具依赖路由与分析器启动超时分层

- 症状/证据：初始夹具三条shared/vendor嵌套模块404，页面未启动；[失败回执](../analysis/launcher-cache-source-browser-v1/browser-initial-failure.json)保留，已确认该次浏览器/服务终止后再跑。
- 最小修复/已执行：仅夹具静态服务器允许prior manifest已有的嵌套mjs，仍核hash和realpath根目录；不改产品模块、不扩大私有文件读取、不放宽CSP。成功轮83项、35模块hash一致、6会话与服务关闭；[审计](../analysis/launcher-cache-source-browser-v1/evidence-audit.json)。
- 游戏/工具：9baa头部读遇Ghidra330000ms启动超时，不算成功读取；原.text0B的另两条负面记录独立保留。未修改全局分析器/审批配置，已关闭provider并确认失败启动PID不存在。[源检查](../analysis/launcher-cache-source-browser-v1/game-source-check.json)。
- 材料/禁忌：RSDS按文件偏移核身份，声明RVA和文件映射不同；两个精确公开PDB名字均404，不推断其他来源没有PDB，不伪造会话/修保护检查来填缺口。
- 分层验收：本机原创浏览器缓存已验；本轮锁屏恢复、来宾桌面/设备、原程序与游戏消费者均未操作。下一观察需新目标/依赖/恢复前检与有界方案，不重放旧单次脚本。

### stage113：HTTP200清单超旧操作容量，来源和游戏变体不得混同

- 症状/证据：本轮两源均HTTP200、51700B，378操作使旧上限256报PATCH_BUDGET；原[网络失败记录](../analysis/launcher-current-entry-v1/patch-network-observation.json)保留。不同清单只有资源size一项差异，不能按客户端摘要一致推定全部相同。
- 最小修复/已执行：GAME_PATCH_LIMITS.operations改512，仍受512块/256KiB及原资源预算限制；257/512通过、513拒绝，最终79Node通过。原响应离线重解析各378成功；没有再发请求伪造一份“初次即通过”回执。[重解析](../analysis/launcher-current-entry-v1/manifest-reanalysis.json)、[回归](../analysis/launcher-current-entry-v1/test-results.json)。
- 来源/禁忌：只在显式puk3-195f3afd+ordinal1和独立origin允许时用备选；一次准备的清单/包始终来自同一所选来源。禁止截取前256条当成功、静默降级、把普通HTTP/MD5/CRC当发布者认证，或沿用历史超时作为当前不可达。
- 游戏/未决：新6000经CRC/MD5/长度核验但原.text RawSize0；REA读16B返回0/complete=false。禁止把虚拟段当文件代码、把不同hash的RVA/结构直接互用或补造会话绕过正常入口。[游戏证据](../analysis/launcher-current-entry-v1/game-capability.json)。
- 分层验收：主机源码/独立测试/6次GET已执行；本轮锁屏恢复、来宾桌面/设备、原程序和游戏消费者未操作/未验。旧Windows运行方案未重放，新恢复点/依赖/PID没有新证据；已有联网授权仅在本轮具体主机计划内使用。
- 缓存根因/已修：原binding投影丢掉新来源字段，3项回归实际出现同键/跨来源restore/版本缺约束；在shared/launcher-resources.mjs保留固定profile/ordinal，默认仍v1，固定来源v2且严格配对。页面模型回归通过，浏览器V2持久化未运行；禁止绕过绑定校验恢复缓存。

### stage112：原生菜单可用而来宾输入未确认时的最小恢复实证

- **症状与证据：** 当前Windows桌面时钟推进、Mac原生菜单可操作，初次普通输入没有来宾回显。临时切全屏后选择高亮消失，仍不能据此判定输入恢复；随后点击空PowerShell提示符，物理`g`可见，Ctrl+C取消，六条进程内赋值/只读命令完整回读后实际执行，取得固定游戏hash和`~ WIN7RTM`。[本轮前检](../analysis/launcher-current-control-v1/guest-preflight.json)。
- **已执行的最小处理：** 在新鲜画面识别目标后恢复来宾焦点；单字符仅用于已知空提示符且未回车，取消后才输入正常短命令。typeText早期只显示前缀时，等后续画面完整回读后再单次Return；没有补打未确认尾部。最终从查看菜单退出临时全屏、保留原窗口与空提示符，未修改键盘映射、共享、网络或安全配置，没有要求用户操作。
- **禁忌与未决：** 不把原生菜单响应当来宾响应、不在未知未提交行盲目Return、不靠剪贴板/共享或安全设置补输入。根因、长行和以后焦点可靠性未普遍验证；本轮没有原游戏/观察器执行、依赖或恢复启动验收，不能把这次短命令成功当游戏兼容结论。

### stage111：现行补齐、空record和反编译指针尺寸

- **实际差异：** 同现行源592300/59239f..3a8为ceil(n/8)*8+8，旧472e70历史hash核验后为floor；29B请求旧核心仅32B cipher/当前应40B。最小修复为新增current codec/stream并与现行握手统一选择，不把旧版golden强改成新版。0/0接收由当前592090确认，generic最低8B是其独立政策，不宣称这是原生新增功能。[源与旧版](../analysis/launcher-current-record-v1/table-check.json)、[失败/修复](../analysis/launcher-current-record-v1/test-results.json)。
- **伪码尺寸：** 591f20出现undefined3指针加法，不能机械当3B C类型推stride；汇编59200d明确ADD ESI,8。rounding/stride8/selector/Pi四原区间已核，1042 Pi字同标准；取实际指令和显式地址，不从伪码补参数或泛化其他selector/压缩。[源检查](../analysis/launcher-current-record-v1/source-check.json)。
- **证据边界/下一步：** 本轮78Node为原创字节/内存流适配，未新增外部连接、账号/原程序执行或Windows操作；真实网络仍只stage110 hello。用户已确认暂时无测试账号，继续不依赖账号的正常连接控制，不重复索取凭据/已答缺失材料。当前record源对应不等于真实加密、身份、游戏或设备/官方验收；旧一次网络/Windows方案不得重放。

### stage110：固定组、编码声明与只写hello观察

- **症状与根因：** 旧generic group只做通用数学检查，flow/session缺少现行版本选择，错误模数大小写也进入challenge-ready。590c80实际按字面g2/256B p比较，591100缓冲784B；最小修复为显式current解码/回答与flow/session传递，保留旧generic契约及原生1<peer<p边界。独立向量/530分片/78相关Node通过，不声称完整record或认证兼容。[失败/修复记录](../analysis/launcher-current-channel-v1/test-results.json)、[源范围](../analysis/launcher-current-channel-v1/implementation-spec.json)。
- **声明与字节冲突：** 新6421B/hash467e…cd58 XML宣称UTF-8，严格解码byte147失败；显式GBK且往返原字节后才作本次分析。禁止静默吞错/产品自动猜码或据此推账号ACP，BIP角色另按原消费者核对。[可重复字节证据](../analysis/launcher-current-channel-v1/catalog-acquisition.json)。
- **最小网络顺序/已用：** 源hello/端点角色→新配置→6个本机TCP资格检查→单个literal IPv4端点一次connect，只8B、10秒/保留<=784B、无回答/账号，截止destroy后等实际close。221.122.108.12:9030已收529B、源组匹配/1483.317ms关闭；计划用量1，禁止重放或把close当业务ACK/组当身份认证。仅记录长度/摘要，无原challenge/会话落盘。后续网络阶段另立具体方案，已有一般联网授权不重复索取。[已用方案](../analysis/launcher-current-channel-v1/plan.json)、[实际回执](../analysis/launcher-current-channel-v1/network-observation.json)。
- **VM状态分层：** 本轮无Windows/厂商执行、解锁/焦点或设备改动；下一次先核新鲜窗口/目标/权限/已用额度，不复用旧隐藏行、D脚本或恢复入口。桌面、恢复启动、游戏分别验收；账号仅在正常安全输入路径处理，不入聊天/报告/夹具。

### stage108：UAC焦点、短输入、依赖补齐和事件覆盖

- **焦点与输入事实：** 首个Microsoft PowerShell UAC曾不响应Alt+Y/Left/Enter，后台普通终端实际报`yy`不存在；正常切换全屏并待几何稳定后点击Yes取得管理员终端，但不认定全屏是根因修复。第二个Microsoft UAC在窗口模式正常Yes即通过。typeText返回时末尾可能仍在输入；本次147字符长行确实丢了中间DLL名，全文检查后Ctrl+C取消、实际^C/空提示符，未提交。改用较短单句且每次全文回读后Return一次；当前只验收实际命令，不称普遍稳定。[首次输入](../analysis/game-install-context-v1/input-runtime-stage108.json)、[第二次输入与结果](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)。
- **操作最小顺序：** 操作前核实际窗口、IME/选择模式、待提交全文与本次额度；坐标/索引从新鲜画面重取。原生CD菜单首次点击可仅释放鼠标，必须读新画面后再点；本次只读ISO到D挂载由实际卷标/清单/完整hash证明。旧隐藏1e行未证明清空，不盲目Return/关闭、不恢复禁用后端/共享或改全局安全设置。[介质回执](../analysis/game-install-context-v1/vc71-guest-media-stage108.json)。
- **NoProfile别名错误：** 本次助手使用不存在的`gfh`导致四次CommandNotFoundException，未取得hash；随后完整`Get-FileHash`回读四项完整Path/Hash。不添加别名、profile或持久策略来修复输入。[首次四文件](../analysis/game-install-context-v1/postrun-stage108.json)。
- **无事件不是根因证据：** 初次退出后Application/System指定时间窗查询均返回NoMatchingEventsFound及提示符，不是拒绝访问，也不能证明无加载错误。平台目录/SysWOW64/7项PATH均缺三VC71库；游戏目录只存在其中两项。该检查未穷尽DLL重定向/激活等路径，缺库初始仅为候选。[只读诊断](../analysis/game-install-context-v1/diagnostics-runtime-stage108.json)。
- **补依赖与备份最小修复：** 从官方Broadcom/VMware附件静态取出精确三DLL，架构/258导出核对；Mac签名链未完成，Windows外层包Valid分别记录，不改信任库强求结果。D四文件源hash相同；在新私有备份目录以File.Copy两参数无覆盖复制四原件，普通gci只列3项，-force查明更新器Hidden后全4项hash通过，不重复复制或改属性。再仅app-local无覆盖新增三DLL并核完整hash；未执行VMware安装器或改全局DLL/PATH。[来源](../analysis/game-install-context-v1/vc71-source-stage108.json)、[落盘/备份](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)。
- **事件订阅不等于覆盖：** 首次精确.exe名仅得9732/2484两start。第二次限定程序族、字面下划线用`[_]`的LIKE订阅实际得3start/2stop：9280→10436→9012，两登录器stop为无.exe名称/状态0，解释旧精确筛选不能命中这些值；仍无更新器stop，不能推定其实际名称/退出码或泛称截断根因。stop ParentProcessID=0保留原值，父子关联取start；provider相邻100ns值不当物理运行时长，点计数0不是完整事件覆盖。[首次事件](../analysis/game-install-context-v1/lifecycle-runtime-stage108.json)、[第二次事件](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)。
- **边界与结果分层：** 第二次使用模式/V2.01 UI及EXE/RegionList完整hash变化证实正常更新与再启动进展；52.325秒正常关窗，97.321秒才回读退出/点计数0，不标全部验证都在90秒内。两个独立方案各用一次，不重放旧额度/旧D脚本/Restore；更新后是新EXE、旧46080B磁盘更新器的过渡状态，不能混用814080B内嵌版本。账号认证、完整事务/ACK/崩溃恢复、游戏及官方兼容未验。[版本对应](../analysis/game-install-context-v1/updated-source-bridge-stage108.json)。
- **精确收尾：** 第一轮5临时键盘项逆序撤回，重开后原19项及顺序比较True、prefs关闭/窗口模式恢复；第二轮未新增键盘项。两轮各注销自己的两个订阅、移除自己的队列并实际0/0后正常关专用管理员终端；原普通终端/备份/恢复点保留，不用强杀/强关或Restore Defaults。桌面/选定命令/依赖拷贝/文件及部分生命周期已验，恢复启动和原游戏另验。[键盘](../analysis/game-install-context-v1/keyboard-cleanup-stage108.json)、[新会话收尾](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)。

本节是本项目唯一排障知识库；按实际证据增补，不另建互相冲突的经验表。上文标作“当前”的旧段落仍保留为相应阶段历史，不能直接当作下一次操作状态。**历史v10事实**：v10阶段在既有 `MoliRestoreTest-ARM64-20261025-v9` 克隆中完成一次授权登录并看到桌面；普通PowerShell已打开，管理员UAC点击被自动审批拒绝、未执行，已用Escape取消。普通权限查询已完成：TPM 2.0 PnP为OK，tpmtool退出0但部分标签/值缺失，仍有34项设备问题，TPM完整健康未验收。见[最新查询与设置观察](../analysis/vm-install-v10/guest-observations.json)。见[本次登录结果](../analysis/vm-install-v10/login-result.json)、[提权拒绝记录](../analysis/vm-install-v10/elevation-blocker.json)。

### stage107：安装完成核验与来宾输入对照

- **已执行事实：** 原平台PID3440退出0，InstallDir两视图同值/exit0、两关键hash相同；未重复安装/条款/厂商启动。用户结束自动运行未知，Updater文件与Log存在不能补齐子进程历史。[安装](../analysis/game-install-context-v1/platform-installed-stage107.json)。
- **症状与边界：** 只读进程查询未提交且末尾缺e，普通Ctrl+C/文字/鼠标尚无预期来宾回执。原有Win+Q实际打开搜索，Windows时钟后来持续更新，主机可编辑搜索栏的setValue+a实际成功；不是已证Windows死机或全局按键失效。[对照](../analysis/game-install-context-v1/access-observation-stage107.json)。
- **已试与未修复：** 重新绑定、窗口Raise、一次正常Pause/Resume和退出全屏未恢复普通来宾输入。Pause覆盖层/Resume与配置窗口正常关闭分别已验；Mouse/Keyboard均自动检测，未选中新优化值或改原19项菜单。官方鼠标误识别建议只作候选，未作为根因或修复结论，见[官方设置说明](https://docs.parallels.com/landing/pdfm-ug/v20-en-us/parallels-desktop-for-mac-20-users-guide/parallels-desktop-preferences-and-virtual-machine-settings/virtual-machine-settings/hardware-settings/mouse-and-keyboard-settings)。
- **最小恢复顺序：** 一次最小手动终端焦点请求待答；无需密码/命令/重新授权。答复后先看实际搜索/终端及未提交行、验证Ctrl+C与空提示符，再核当前进程/安装XML/hash/Win7新路径；不能盲目Return、重复补字符或启动原程序。
- **禁忌与未决：** AXError、noWindowsAvailable及状态新鲜度错误不等于自动审批拒绝或样本已更换；恢复绑定后仍核同一VM。未使用被禁CLI/其他控制后端，不改共享/保护/策略、不新建菜单或强制重启；原因及可靠自动修复仍未确认。当前桌面画面可读、普通输入未验、设备未新增验收、游戏未启动。

### stage106：平台许可页与本地全文复核

- **实际执行点：** 原平台包完整hash与既有官方归档对应，E:MOLIINST102/CD-ROM；当前InstallDir32/64均缺项/值、exit1，两个默认父目录False。正常启动/UAC各一次，精确E:\POLCN_Setup.exe路径已展开核对；PID3440初始HasExited=False，欢迎页Next一次后进入许可。未点Install、未接受协议，不能写为平台安装完成。[前检](../analysis/game-install-context-v1/platform-preflight-stage106.json)、[回执](../analysis/game-install-context-v1/platform-runtime-stage106.json)。
- **许可确认边界：** 电脑控制工具要求实际接受新协议前确认；普通Windows/联网/工具权限仍有效，既有游戏安装确认不能代替本次平台协议。一次问题已提交，工具accepted仅为提问接收，未收到用户接受。继续时看新鲜页面并沿同一向导，不重复启动/UAC或预先同意其他条款。
- **完整正文：** 固定header0的offset592、前置u32=2531字段，以GBK严格解码/回转，后接两个空字段和已核IFPS长度/偏移；实际页面首尾相符。完整文本只存私有build，不进交付清单；不是通用许可解析器或授权结论。公司名在同一正文重复，不应误当第二份字段。[所选字节/私有路径](../analysis/game-install-context-v1/platform-license-stage106.json)。
- **正文滚动：** 对正文发滚轮请求后没有可见移动；点击正文再Ctrl+End150ms实际到达末尾，拒绝选中与Next禁用保持。原因未定，此最小操作已可用，无需用户恢复焦点，不改映射/剪贴板/安全设置。
- **口径与下一步：** 文件查看请求返回queued，不代表已打开；本地全文文件及链接已实际准备。确认后检查默认目的地、取消结束自动运行，取得原安装器生命周期与真实InstallDir/hash/view。当前没有原游戏/登录器/更新器执行、消费者或平台/官方兼容验收，13未知项保留。

### stage105：正常安装与真实目录观察配置

- **授权与实际结果：** 先前待答来源确认已收到；固定游戏安装器显式启动/UAC各一次，正常向导完成，结束取消平台安装，PID6368实际exit0。观察路线没有新条款页；这不表示其他路线没有条款，也不批准新原游戏执行。[运行](../analysis/game-install-context-v1/install-runtime-stage105.json)。
- **安装上下文：** 默认中文目录及HKCU Path在32/64视图同值、各exit0。CG5Reg、游戏、MFC71和msvcr71四个完整hash与源相同。2369文件/总字节与2367源文件加两卸载文件相符，仅为聚合检查；没有运行CG5Reg或手写Path。[身份](../analysis/game-install-context-v1/guest-installed-context-stage105.json)。
- **旧工具目录不符：** 原game配置绑定临时launcher-probe目录，不能把正常安装文件搬过去。新增独立game-installed固定配置，保留旧配置值、身份/权限/单次8B门禁。编译后PE三行及中文UTF16精确核对，新产物放独立stage105目录，旧二进制/ISO保留。[构建](../analysis/game-entry-v1/observer-build-stage105.json)。
- **实际原创验证：** 新观察器来宾143326B/完整hash相同，fixture完整hash相同；PID804一次8B读取成功，槽RVA14c0/14b0、observer exit0。夹具自然WaitForExit=True、HasExited=True、结束计数0，但ExitCode再次回读为空，不能填0或借其他PID补齐；根因尚未验证，不为补字段重复启动。[Windows实证](../analysis/game-entry-runtime-v1/windows-observer-stage105.json)。
- **传输与当前操作：** 仅一次固定原创文件GET，CreateNew独占写并finally释放，服务exit0、端口65377已关闭；本次没有启用共享或改策略。当前空NoProfile提示符、相关进程点计数0，不等于完整子进程追踪。无人工焦点请求，不重放旧脚本/Restore、旧运行额度或被禁控制路径。
- **分层验收：** 正常安装/四文件身份与原创fixture观察已验；新game-installed配置尚未作用于原游戏，原.text文件字节缺口不变。平台正常路径/消费者、回调调用、登录器ACK/恢复、游戏协议与跨平台/官方验收仍待证；恢复点仅元数据保留，恢复启动未测。

### stage104：同一待答来源确认的三轮审计

- **准确阻塞：** 本次未核验来源游戏安装/UAC的执行时确认在stage102/103/104连续三轮仍待答。前两轮有独立准备和静态进展，本轮只读复核后已无新的消费者证据路线，goal实际返回blocked；不是Mac锁定、策略拒绝或Auto-review。没有确认live取证句柄，不能将待回复当verified wait。
- **恢复顺序：** 原问题保留，不重复一般Windows/联网/工具授权或终端操作；确认后核新鲜窗口/安装包hash/实际目的地，正常交互安装，实际新条款另行处理并取消结束自动启动，之后核目录/hash/view。旧快照/介质保留，未恢复或重建，不重放脚本/Restore或伪造Path/IPC。[完整范围/候选路线](../analysis/game-install-context-v1/blocked-audit-stage104.json)。
- **状态口径：** 本轮无电脑控制/来宾命令/厂商执行；不将stage103桌面和挂载当实时复测。1490交付项及固定游戏hash/.text边界相同，仅证明已有结果保留，不证明游戏或平台兼容完成。

- **对话元数据读取边界：** read_thread一次4轮超过读取大小限制；改为1轮及返回cursor分页后取得当前/前两轮的元数据。只用轮次/确认状态校验，不保存原始对话或将助手消息当授权。

### stage103：条件函数与路径判断的边界

- **读取依赖缺口：** 固定binary-refinery0.11.3要求Python3.11+，使用现有bundled3.12.14与私有目录。首次导入缺pure_magic_rs时未解码目标；随后核验可信PyPI的CPython312/ARM64轮包，补齐8文件，无全局安装或安全策略变化。817源文件/8依赖回读一致、7项原创静态输入通过。[依赖/初次失败](../analysis/game-install-context-v1/ifps-dependency-stage103.json)、[资格检查](../analysis/game-install-context-v1/reader-qualification-stage103.json)。
- **“已安装”不等于文件健康：** 选定CheckPolCNSetup只看HKCU Launcher/InstallDir的返回字符串长度；非空旧路径可通过。原字节/工具解释分层，当前用户32/64视图查询均缺项/值、exit1；不外推全系统、不写伪值、不从互补条件声明推定实际子链。[函数/锚点](../analysis/game-install-context-v1/install-conditions-stage103.json)、[来宾回执](../analysis/game-install-context-v1/guest-platform-context-stage103.json)。
- **当前执行点：** 正常桌面/输入可用，最后空提示符；只有已发出的一次未知来源安装/UAC确认待答，无解锁/焦点人工请求。厂商脚本/安装器/登录器/游戏本轮0次，快照/介质保留未还原，不重放旧额度；之后按正常安装结果核实际目录/hash/view。

### stage102：安装元数据、介质与原生菜单撤回

- **缺少元数据能力：** 发行CLI不能列全所选安装动作；核验上游1.9源码和三个兼容补丁后仅在项目私有build构建debug CLI。两包只读读取退出0，6.1仍属初步支持；不运行Pascal/安装器来补静态结果。处理器未定义时空xref不是无调用，以REA精确字节+导入+独立反汇编标明推测。[构建](../analysis/game-install-context-v1/tool-build-stage102.json)、[注册链](../analysis/game-install-context-v1/cg5reg-static-stage102.json)。
- **来源门槛：** 官方页所链网盘被CUA站点安全策略阻止，未发生用户审批或Auto-review，禁止换浏览器/传输绕过。游戏原件完整hash固定但当前官方字节对应未证；一般Windows/联网授权不代替CUA未知来源软件执行时确认。仅这次安装/UAC确认待答，新条款在实际展示时再处理。[来源](../analysis/game-install-context-v1/source-assessment-stage102.json)、[正常方案](../analysis/game-install-context-v1/normal-run-plan-stage102.json)。
- **ISO初次验证失败：** 所有成员hash已匹配，卷标解码只去空格漏了NUL填充。保留同一只读ISO，只修解码，以verify-existing模式完整重读成员/描述符和两原件；不重建覆盖、不忽略其他边界。[介质](../analysis/game-install-context-v1/media-stage102.json)。
- **设备菜单未换源：** 未展开的Qt子菜单项返回invalid，某些toolbar AX按钮failure；操作未确认不能写成挂入新镜像。实际D标签仍MOLICUR89。使用限定来宾的一次流式本地ISO复制后，Windows原生只读挂载成功为E:MOLIINST102，不改硬件/共享；此方法与被禁网盘访问无关，不用于绕过站点策略。[实际挂载](../analysis/game-install-context-v1/transfer-session-stage102.json)。
- **大型固定传输：** 1MiB分块而非缓存1.1GB；来宾CreateNew独占写、防覆盖，finally释放三对象。主机完成不等于落盘，必须分别读全镜像和两个成员hash。本次均相同，服务exit0/端口拒绝；7项原创检查初次夹具路径/时序失败修正在测试，未放宽生产guard。[7项检查](../analysis/game-install-context-v1/transfer-host-validation-stage102.json)。
- **签名提示口径：** Get-AuthenticodeSignature两包返回NotSigned，通用StatusMessage提及执行策略，不是本次启动失败、策略阻止或可据此要求放宽策略。安装器实际启动0，后续正常流程需按来源确认处理。[回执](../analysis/game-install-context-v1/transfer-session-stage102.json)。
- **临时菜单精确撤回：** 已观察的toolbar位置点击可开实际菜单；End在此菜单中选中“自定义”后打开编辑器。编辑器End只滚到底、Shift+Up只单选，不能据此假定多选22项。逐项选已观察末项并点minus，正常File/关闭窗口；重新打开实际菜单，精确保留原19项含Win+Q及顺序、22添加项全无。未Restore Defaults，未触发快捷键或改安全/网络。[清单/回读](../analysis/game-install-context-v1/keyboard-cleanup-stage102.json)。
- **分层验收：** 新快照创建进度结束、名称唯一及XML元数据通过；未还原/恢复启动或验收独立备份。桌面、输入、ISO/成员身份与菜单撤回已验；实际安装/注册、原游戏消费者、原生更新ACK/恢复和官方兼容均未验。[恢复点](../analysis/game-install-context-v1/recovery-point-stage102.json)。

### stage101：正常输入、原创PE加载与实际回执

- **访问/输入事实：** 用户回复继续后实际恢复同一桌面。菜单Cancel暴露时可取消离屏窗口菜单并恢复原窗口；不得猜测动作名或启动同名旧基线。150ms逐字按键可用，完整核对后只发一次Return；`=`变`+`的未提交行用Ctrl+C取消，改用sv。提示符可能在视口下方，滚动回读，不重复Return。普通焦点恢复自主完成，无待回复人工操作。[会话](../analysis/game-entry-runtime-v1/resume-stage101.json)。
- **原创PE症状/修复：** 旧fixture完整hash正确却报非有效Win32应用；主机检查漏了节间空洞。原件保留，以原创BSS/连续虚拟填充替换布局，并加节相邻/范围检查；GNU PE的NOLOAD试法未过门禁，不靠header修补或关闭检查。修正版Windows加载、一次8B读通过，ASLR base004b0000，槽RVA14c0/14b0。[布局回归](../analysis/game-entry-v1/layout-validation-stage101.json)、[运行](../analysis/game-entry-runtime-v1/windows-observer-stage101.json)。
- **生命周期口径：** Start-Process的PID8524 WaitForExit=True但ExitCode无输出，不能填0；独立同步PID1508才取得实际exit0及结束计数0。后者不再读内存，前者退出码仍未取得，不把第二PID的回执写给第一PID。只验收所列案例，不宣称全部门禁或回调实际调用。
- **传输/版本事实：** 两次固定文件NAT传输均已核来宾完整hash；旧两PE改名.stage96、新文件CreateNew独占写，无覆盖。两端点均在2响应后自然exit0、socket拒绝；源CD不变、新ISO未挂载。当前Updater实为旧22d561…e479，经26元数据差异/4锚点与新7eb173…0fe1桥接；候选journal精确False不代表ACK/提交/恢复。[路径证据](../analysis/launcher-update-recovery-v1/path-audit-stage101.json)。
- **下一步/禁忌：** game profile路径不存在，当前仅client-probe样本；Path键原生/32位未得目录、INI所选匹配未得路径，先核正常安装上下文。不得搬样本/伪造注册表IPC、放宽hash/权限、重放current.ps1/Restore、变更保护/审批或使用被禁控制路径。原程序本轮启动0，策略Restricted；22项临时键盘菜单尚待精确撤回，保留原19项，不Restore Defaults。[上下文](../analysis/game-entry-runtime-v1/game-context-stage101.json)。

### stage96：回调观察工具与本次锁定恢复

- **症状/证据：** 现有Parallels绑定仍在Mac锁定处停止，来宾输入0；本次恢复连续第二轮，stage95单次人工解锁请求保持。静态游戏owner含调试器相关分支，未知槽目标不能靠改分支推定。[访问/先行范围](../analysis/game-entry-v1/preflight.json)、[源证据](../analysis/game-entry-v1/static-audit.json)。
- **最小下一步：** 正常解锁后先核桌面/英输入/当前路径/hash/备份/journal；原策略与恢复仅按stage94实际回执。先以已核验原创fixture实测只读观察器，再决定正常现有游戏目标。固定8B读/页元数据不是代码恢复；拒绝、目标变化或无正常PID即停。[待执行流程](../analysis/game-entry-v1/probe/README.md)。
- **准备失败/修正：** 初次C构建以Werror拒绝DWORD*与uint32_t*，修正调用变量为uint32_t而非关闭告警；首次REA main选择结果无structured内容，改用实际nm的_main/402a00，未改配置。两PE各两次确定构建及工具13REA/5字节锚点通过。[留痕](../analysis/game-entry-v1/observer-static-audit.json)。
- **禁忌/未决：** 不重放current.ps1/Restore、不放松hash guard、不启用SeDebug/附加调试器或强制保护分支；不读IPC/代码/字符串/凭据。Windows fixture/guard/ASLR、真实回调调用、游戏/平台/官方验收未完成。新ISO未挂载/传输；主机检查不计Windows通过。

### stage97：同一Mac锁定连续三goal turn

- **新鲜结果：** getApp再次在Mac锁定/自动解锁失败处停止，来宾命令0。stage95/96/97连续三轮同一条件，前两轮独立准备已完成当前切面；没有活process/job/session等待，不复用旧执行策略blocked次数。[时间及逐轮证据](../analysis/game-runtime-access-v1/access-observation.json)。
- **最小恢复/禁忌：** 正常手动解锁；已有单次问题和Windows/联网/工具授权保留，不索取密码/PIN、不改锁屏/安全设置或另走控制通道。先核来宾实际状态，再验原创工具；不重放current.ps1/Restore/旧启动额度、不放松guard或强制保护分支。
- **状态边界：** 交付审计后提交goal blocked，完整四步/可玩/平台/官方目标保留；正常解锁或实际新增合法匹配业务材料后重新核验恢复。源码/准备未变，未有新Windows/游戏结果。[完整审计](../analysis/game-runtime-access-v1/blocked-audit.json)。

### stage98：原生按键菜单、新终端查询及新锁屏

- **实证路线：** 旧损字行清空并见空提示符后，原生Win+R、核对完整powershell -NoProfile、原生Enter，取得新终端。D=MOLICUR89、Restricted和两组指定进程计数0均实际返回。不能把搜索g或AX焦点当终端输入通过。[回执](../analysis/game-entry-runtime-v1/guest-preflight.json)。
- **输入限制：** 早期typeText前缀不是损字结论，须等完整尾部并核内部字符。一次主机操作后空提示符不收普通文字，原生Ctrl+A后完整文本又出现；这是观察路线，非根因结论。仅在确认空提示符时使用，不覆盖已有正确内容。最后hash前缀的工具输出被截断，未Return；恢复后先看当前行，不重复前缀或盲提交。
- **设置与撤回：** 22项临时菜单按精确清单撤回，当前因锁屏尚未撤回；不用恢复默认。Add坐标可能只聚焦，修饰键须核值；旧closure曾在保存前停止，核Win1/R后才保存。优化组合框未选值，End移动侧栏而非优化值，无启动顺序/TPM更改。设置窗从自身窗口共享菜单正常关闭，不关闭VM主窗。[过程与清单](../analysis/game-entry-runtime-v1/input-recovery.json)。
- **停止与禁忌：** CUA新报Mac锁定/自动解锁失败，已仅请求一次正常解锁，不再求终端点击。新锁屏第2轮，不复用历史blocked；新CD/工具/原游戏执行仍0。先核文件/备份/journal/目录，不改锁屏/共享/策略/保护，不重放旧脚本/Restore/启动，不用禁止CLI或其他控制后端。

- stage99: same Mac-lock condition confirmed in a second consecutive goal turn; no new guest command or implementation progress. One existing unlock request remains pending. See [fresh recheck](../analysis/game-entry-runtime-v1/access-recheck-stage99.json).

### stage100：新锁屏连续三轮，goal 已 blocked

- **新鲜证据：** stage98 的实际前检后新出现锁屏，stage99及stage100仍由CUA报告Mac locked/自动解锁失败；本轮没有来宾状态或新命令，没有活工具句柄可作 verified wait。当前累计3个连续goal turn，未复用stage95–97或旧策略次数。[全目标与阻塞审计](../analysis/game-entry-runtime-v1/access-blocked-stage100.json)。
- **状态与恢复：** update_goal实际返回blocked，完整四步/可玩/平台/官方目标未完成。只保留已有一次正常解锁请求，不再要求终端点击或新授权；正常恢复后先看未提交hash行再前检/工具验收。22项临时菜单因锁屏未撤回，按原精确清单移除，不恢复默认。
- **禁忌：** 不重放旧脚本/Restore/启动、放松guard、改锁屏/共享/策略/保护或使用禁止CLI/其他控制后端；不索取密码/PIN或已确认没有的PDB。主机文件hash/静态边界/文档更新不替代Windows或游戏验收。

### 操作前清单

1. 先读本节及对应阶段的非敏感证据，确认本次授权、停止条件、尚未使用的一次性动作；历史成功不代表再次授权。
2. 先按最新阶段确认当前虚拟化应用；当前为Parallels `Windows 11`、`/Users/lx/Parallels/Windows 11.pvm`。不要操作已移除的UTM历史环境。历史UTM原VM为 `MoliOffline-ARM64-20261025`，恢复测试目标为 `MoliRestoreTest-ARM64-20261025-v9`；v10是调查阶段号，没有创建名为v10的新VM。窗口不符或状态不可读时不输入。
3. 检查窗口置前（Raise）与输入捕获（Capture Input）；仅在非凭据界面用普通导航验证响应。执行英文命令前切英文输入模式，提交前核对完整命令未被IME组合或替换。
4. 按最新授权核对网络及共享：stage83后现有Shared/NAT联网，Mac目录共享隔离保留，不按旧离线记录擅自断网。涉及恢复复制时另外核对冷基线哈希、无打开句柄、独立磁盘/文件、可用空间与固定目标不存在。普通焦点故障不需要放开共享或安全控制。
5. 操作后记录目标、时间、实际动作、返回状态及验证层次。失败先分清执行结果再决定下一步；遇审批拒绝停止该动作。不得记录凭据、账号标识、凭据截图或原始敏感对话。

### stage83新增实测：原生菜单、短入口和x86调试

**症状与证据：** 配置Source组合框及旧Qt菜单不响应；原生工具栏网络/光驱菜单的实际`onActionTriggered:`选项可用，共享网络选择后配置Connected1且来宾HTTPS200。原生菜单打开时坐标点击报`Menu mouse action not supported`是API能力错误，用新AX索引选择实际选项成功；不混作审批拒绝。[联网](../analysis/runtime-observer-v3/network-observation.json)。

**输入最小修复：** 先观察来宾“英”，长`typeText`返回不等于全部落字，等完整全行可见后才Return。真实一次WorkingDirectory损字在参数绑定前失败，另一次CDB损字把脚本当EXE，错误193在目标创建前发生。停止反复长行输入，改用经过成员hash核验的原创只读CMD短入口。取消中文组合/未提交错误行后再切英文；不启用共享剪贴板或更改安全策略。[输入纠正](../analysis/runtime-observer-v3/guest-input-correction.json)、[真实失败](../analysis/runtime-observer-v3/cdb-interactive-failure.json)。

**调试最小修复：** 固定夹具启用了ASLR，基址从实际入口元数据推导并与模块表比较；不能固定400000或关闭ASLR。ARM64 CDB本次WOW64/EIP0观察失败，正常qd分离；同SDK x86 CDB的实际7位点与退出code0通过。CDB进制命令是`n 16`，`$$`注释避免分号，`.effmach`与后续命令分行。进程退出后没有可继续目标，生命周期回调多余g已报错；先确认退出，再q关闭调试器，不把调试器退出0代替目标退出码。[失败](../analysis/runtime-observer-v3/arm64-debugger-attempt.json)、[目标退出](../analysis/runtime-observer-v3/fixture-lifecycle.json)、[正常关闭](../analysis/runtime-observer-v3/fixture-session-close.json)。

**禁忌与未决：** 不修改原游戏、异常处理/防护策略、共享/全局工具权限来追求通过；不收集原程序凭据或全内存。CDB初/末默认通用寄存器、首条警告插入与扩展库初始化影响需在通用采集器中单独处理；本次仅去敏记录原创目标位点，未证明全程无外联或通用隐私。无每事件时间，计时契约未验；Qt根因、恢复启动与游戏消费者仍未解决。当前原生菜单与共享网络成功不追认旧失败步骤成功。

### stage84输入补充：反斜杠缺失

本轮短查询`Get-FileHash .\XML\* | fl Path,Hash`实际落字为`.XML*`，提交前截图发现后Ctrl+C取消，没有执行错误查询。改为实际可见的`Get-FileHash XML/* | fl Path,Hash`后，两份XML哈希读取成功。该路径语法只用于已知PowerShell文件命令；不推广至所有程序，不通过共享剪贴板处理。[现场记录](../analysis/launcher-runtime-v1/guest-preflight.json)。

### stage85补充：真实href、归档关闭与再次锁定

官网页面AX标签省略scheme，网页检索点击又尝试HTTPS；使用当前DOM `getAttribute(href)`取得实际HTTP，正常HTTPS失败/浏览器canceled（原因未知）各自保留。按官网实际链接静态获取ZIP并比对，不关闭TLS检查、绕过警告或把HTTP字节等同签名。当前包/三文件完全匹配属于新来源证据，不虚构此前已认证。[实际链接](../analysis/launcher-provenance-v1/browser-observation.json)、[分发链](../analysis/launcher-provenance-v1/installer-chain.json)。

REA纯归档无具体analysis profile，带snapshot close返回evidence_integrity_mismatch且会话未关闭；先已export bundle，再不带snapshot正常close成功，不能反复保存不支持的snapshot或漏关会话。原程序启动前CUA又报locked，属于当前访问失败，不能用较早已解锁或浏览器DOM仍可读推定原生桌面可控。[REA](../analysis/launcher-provenance-v1/rea-archive.json)、[访问](../analysis/launcher-provenance-v1/access-observation.json)。

### stage85解锁后补验：绑定与来宾输入分开验证

中断后原REPL变量已不存在，重新getApp绑定已运行的Parallels；AX窗口ID改变只代表UI标识，不当作VM UUID。较早旧绑定可读却click报noWindowsAvailable、Raise不证明键鼠可用；当前普通click/typeText返回正常也只见指针/悬停，未见Start或字符。遇user-changed-state先刷新完整AX，不能据旧索引发键。[补验](../analysis/launcher-provenance-v1/access-followup.json)。

当前工具栏Keyboard的AX click失败，按新截图坐标打开实际原生菜单，再选择实际Win+Q成功显示来宾搜索；普通鼠标/文本仍未通过。操作菜单仅查看后用暴露Cancel退出，未选电源/恢复/Tools重装。最小后续是人工点当前PowerShell/终端空白区恢复焦点，再重核guest文件和英文输入；不通过共享剪贴板、改安全权限或故障CLI代替。读屏、原生菜单与普通来宾输入须分别验收。

### stage85临时目录：保存回执不保证文件仍在

中断后发布前检查发现旧临时三文件已不存在；源ZIP/安装器hash仍匹配，缺失原因未知，未归因于用户、重启或清理。首次断言已在validation/manifest写入前停；用同一不变ZIP重新静态extract+test，三文件hash再次相同，旧回执保持历史原样。临时目录不当持久交付或活动进程证明，发布时实际回读，缺失时保留原因/重建记录，不伪造旧路径仍有效。[重核](../analysis/launcher-provenance-v1/installer-chain-followup.json)。

### stage86自动暂停与网络无响应分层

现有VM出现“已自动暂停”覆盖层时，先从原生操作菜单核实“恢复”并正常继续；与“恢复到快照”分开，不改策略或重启。覆盖层消失后仍需实际终端输入验收，本次点击PS未达成，不能把所有较早输入失败归因于暂停。[观察](../analysis/launcher-patch-live-v1/vm-resume.json)。

同一目录HTTP RemoteDisconnected、HTTPS握手EOF、历史声明PIP15秒超时属于不同层失败，没有HTTP拒绝状态或安全审批拒绝。各一请求即止，三工作进程均已终止；无正文不运行解析器或下载载荷，不猜当前目录、换地区扫描或放松TLS。正常可用guest输入及必要外部状态恢复后再推进。[审计与结果](../analysis/launcher-patch-live-v1/blocked-audit.json)。

### stage87补充：隐藏更新器、退出0与间歇输入

**症状/事实：** 全屏转换后能实际输入并运行普通PowerShell；后续焦点再丢失，普通Return、Raise及数字键盘Enter未使当前只读hash行出现结果。原生Keyboard按钮AX点击失败时，当前截图坐标能打开原生菜单；自定义入口仅打开快捷键偏好设置，未改动并关闭。退回窗口模式、标题栏与Escape后曾恢复只读文件命令，不证明永久修复或单一原因。禁止连续盲键或把工具返回成功当来宾已提交；保留当前无害命令，普通输入未恢复前不启新程序。[预检](../analysis/launcher-runtime-v2/preflight.json)、[后续](../analysis/launcher-runtime-v2/postrun-files.json)。

**文件与退出判断：** 普通ls/Get-FileHash wildcard不列Hidden；`-Force`发现46080B内嵌Updater，LiteralPath hash匹配。不要宣称此前不存在。主程序ReadOnly及旧Updater三MFC运行库是候选，缺库/写失败尚无来宾证据，不盲装、不清属性。旧CreateProcess成功/失败都可exit0，只有受控日志支持成功交接分支，仍缺子PID/退出/替换结果。[静态关联](../analysis/launcher-runtime-v2/rea-followup.json)。

**样本及收尾：** 当前公开摘要/ZIP已变化，必须新hash/新REA；完整URL与进度文本按两个token解析，不能对整个两行文本URL规范化。新包只静态验证/提取，未运行；不把真实候选解包通过称完整登录器。临时文件发布前回读，REA导出/快照关闭；首次摘要脚本类型错误在写前停止，纠正后写本阶段新回执，不改历史。[独立对照](../analysis/launcher-runtime-v2/candidate-independent-comparison.json)、[后续](../analysis/launcher-runtime-v2/next-slice.json)。

### stage88补充：锁定访问与静态工具可用分开

**症状/证据：** 用户较早“已就绪”后，本轮CUA仍在取得来宾窗口前报告Mac locked且自动解锁失败；静态REA/Node继续可用并不说明GUI能输入。[本轮访问](../analysis/launcher-current-updater-v1/access-observation.json)。

**最小恢复与禁忌：** 由本人正常解锁Mac，保留现有Parallels窗口；回复后先刷新目标并读清stage87待提交的只读日志hash行，再用可见英文输入/结果验证。当前未重发该行、未重新启动旧文件、未改共享/权限/网络或尝试其他控制路径。既有Windows/联网/工具授权保留；锁定不是审批拒绝，人工恢复前不将读取/输入标通过。新候选548Node和真实包校验也不替代Windows/游戏运行验收。

### stage89补充：工具typed-null与只读介质验收

**已复现/修复：** 主机原创夹具里File.Replace第三个普通$null被PowerShell转成空字符串，报ArgumentException而未替换；用NullString.Value明确传.NET null后，替换/恢复及ReadOnly测试通过。微软文档含Windows5.1适用并不等于来宾实测。首次官方hash表UTF8解码也在提取前失败；FFFE BOM后UTF16复核匹配，无重复下载。[12项测试](../analysis/launcher-current-runtime-v1/host-tests.json)、[来源/工具身份](../analysis/launcher-current-runtime-v1/tool-readiness.json)。

**范围/禁忌：** 新ISO9成员只读回读通过，尚未挂VM；不把准备工具当程序执行。恢复输入后先用parse.cmd和hash检查，再Verify；若.ps1被执行政策阻止，停止报告，不改政策或改输入形式绕过。Observe90秒仍跑时只记句柄/已知名称元数据，正常关窗前必须新鲜UI，不强杀、不把超时当已停止。无子进程全链/全VM回滚证明。当前CUA仍两次locked，原人工解锁请求待答，不重发泛化权限问题。

### stage90补充：访问恢复、解析通过与策略拒绝分层

用户正常解锁后，切全屏并再次点击终端/Return才出现实际结果，随后窗口模式也能输入；这是观察到的恢复顺序，不证明全屏是唯一根因。旧只读行只提交一次，未因输出上下文截断而重发。窗口模式原生光驱菜单完成新ISO挂载；Qt子菜单AXError.invalidUIElement、隐藏工具栏AXError.failure均未完成动作，不计作审批拒绝或挂载成功。[来宾核对](../analysis/launcher-current-runtime-v2/guest-preflight.json)。

新CD九成员hash与主机相同，parse.cmd返回MOLI_PARSE_OK，只证明Windows5.1语法及两个重复hash。verify.cmd随后被禁止运行脚本，主体未执行，不能把解析成功当原生工具验收。按原计划停止，不用Bypass、Unrestricted、Unblock-File或粘贴同等内联脚本绕过。仅进程RemoteSigned是新的具体待确认操作，不能复用概括授权悄悄实施。[方案与影响](../analysis/launcher-current-runtime-v2/policy-proposal.json)、[微软策略说明](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-5.1)。

旧运行库长查询在提交前发现损字并Ctrl+C取消；改用两个短只读查询，无对象返回不证明所有加载路径均不存在。日志前缀hash取自stage87已载入数组，并非本轮重新读盘；与最初619字节hash不同，不能宣称原文件完整保留后追加。原始敏感日志/画面不入交付。[限定诊断](../analysis/launcher-current-runtime-v2/readonly-diagnostics.json)。

### stage91补充：伪代码返回类型与解析子集差异

`0x4067c0`伪代码显示void，但原汇编`0x40695d MOV EBX,1`、`0x406994 MOV EAX,EBX`及成功EOF分支证实0/1返回；不能忽略比较结果或据伪签名复刻。另一个先前未命名helper`0x40fa80`实际为暂存文件写入/路径属性检查，不是MD5校验器，已纠正角色标签。14源字节锚点逐项按PE节映射核对，未把VA直接当文件偏移。[原字节](../analysis/launcher-current-catalog-v1/source-check.json)。

首轮新定点测试9/10，内部PI被现有解析器拒绝；ElementTree原向量支持该语法，不能改oracle掩盖差异。最小处理是记录明确profile-exclusions并保留严格解析器，重验10/10、全558及浏览器同向量。未据这些纯函数测试宣称原生恢复或新程序运行；本轮没有绕过stage90策略拒绝。[差异](../analysis/launcher-current-catalog-v1/profile-exclusions.json)、[验收](../analysis/launcher-current-catalog-v1/validation.json)。

### stage92补充：新版元数据差异与完整 URL 边界

**症状/根因：** 沿用旧三次单字符trim会错误拒绝新版混合SP/CR/LF边界；先把远端hex转小写再选分支会抹掉原版case-sensitive差异；把新版marker当旧两token摘要会提前拒绝正文或错误省略XML下载。**最小修复：** 新增显式profile并保留旧入口，分别暴露comparisonText/规范md5，下载两份实际XML后作字节比较。[可追溯规格](../analysis/launcher-current-metadata-v1/implementation-spec.json)。

**禁忌/未决：** 不把URL前缀通过等同完整URL有效或origin已授权；不把256MiB声明包上限当独立下载预算；不把本地MD5或HTTP200空marker夹具当服务端真实性或原WinInet空响应成功证明。63原创向量、25新增定点、完整583Node及Chrome69GET通过；本轮没有原生运行、策略变更或游戏执行。原生文件事务/恢复和具体策略待答状态保留。[结果](../analysis/launcher-current-metadata-v1/validation.json)。

**旧接口回归：** common factory曾在旧调用中读取新增cacheTick访问器，旧接口原本忽略该项。新用例先复现1项失败，再把该选项读取移至显式新版工厂；25定点、完整583及Chrome重跑通过。不要因为常规旧用例通过，就忽略被扩大的属性读取副作用。

**文档回读：** 测试数量批量替换曾触及两份报告旧样本hash中的相同数字，交付前按已核baseline恢复对应历史正文，新stage92段落保留。后续计数更新限定本阶段段落；不能对包含hash/偏移的整篇报告作数字全局替换，交付检查必须逐字保留旧章节。[纠正记录](../analysis/launcher-current-metadata-v1/validation.json)。

### stage93补充：有效策略与旧缓存路径分别核验

**症状/证据：** stage90五scope Undefined只能间接推断默认策略；本轮普通短查询Get-ExecutionPolicy实际返回Restricted，终端可控并空提示符。旧脚本SecurityError是Windows实际拒绝，不是本轮自动审批拒绝；没有重试或新的拒绝。**最小检查/后续：** 只读查询有效策略；维持停止，待此前具体RemoteSigned回复后再做既定前检。[观察](../analysis/launcher-current-runtime-v3/observation.json)。

**禁忌/未决：** 不用Bypass、Unrestricted、内联/其他工具或执行形式运行同等受阻主体；不重复问解锁、一般授权或没有的PDB。原版启动/恢复及游戏消费者仍未验。旧tmp样本读不到时不能宣称样本消失或重下新版本；本轮在项目build找到原缓存并重核hash/PE节，既有inventory/MAP01任务也以当前代码为准，禁止按旧提案重复实现。

### 按症状决定下一步

**1. 点错窗口、输入不响应或 `windowNotFound`。** 已观察原VM和恢复克隆窗口并存；原VM曾未捕获输入，选定准确窗口、Raise并启用捕获后，工具导航可将时钟页切到空登录页。见[v8输入观察](../analysis/vm-install-v8/input-observations.json)、[v9焦点复查](../analysis/vm-install-v9/input-focus-followup.json)。本轮一次坐标操作还返回 `windowNotFound`，这是工具/窗口定位错误，不是安全审批拒绝。最小检查是刷新窗口列表/状态、重新核对目标再Raise与捕获；过期坐标不继续点击。**未决**：焦点/捕获是有证据的影响条件，尚未证明是用户实体键盘故障的唯一原因；不得通过改PIN或开启USB共享代替诊断。

**2. 工具键盘有效，用户实体键盘仍失败。** v9只证明工具导航响应，没有验证实体键盘或实际凭据字符输入；v10一次登录成功也不证明用户实体键盘故障已修复。最小检查仍是指定目标、捕获状态及用户非敏感导航反馈。不得把“工具成功”写成“实体键盘已修复”，不得在凭据框输入测试字符。实体输入根因仍待验证。

**3. 英文命令被中文IME吞入组合。** 本轮观察到英文命令进入中文组合；用Escape取消组合、Ctrl+C取消整行，确认未执行后切英文模式、核对待提交文字，再执行普通只读命令成功。最小修复沿此顺序，提交前检查全行与预期一致；若已提交且结果不明，先查实际状态，不盲目重发。单独Shift工具调用曾报 `keyPressIncludedNoNonModifierKeys`，属于API参数限制，不等于Windows输入失效或安全拒绝；改用可见输入法的正常选择并核对状态，不能循环调用同一无效参数。上述为本轮工具观察，已固化[输入证据](../analysis/vm-install-v10/input-observations.json)；取消的非敏感命令及后续正确命令见[查询画面](../analysis/vm-install-v10/security-pnp-query.png)。不保存含凭据的画面。

**4. 显示 connected / attached / authorized，但电脑仍不可控。** [v9访问阻碍](../analysis/vm-install-v9/login-access-blocker.json)明确区分连接授权与交互会话：工具曾反复返回Mac locked，无法独立观察真实主机屏幕。这些访问状态曾恢复又再次失败；v10在用户新反馈后的观察最终恢复可控并完成登录，旧locked状态即失效。见[较早恢复观察](../analysis/vm-install-v9/connection-recheck.json)及[本次成功登录](../analysis/vm-install-v10/login-result.json)。最小检查是合法连接状态与一次新鲜UI读取；无新变化仍失败时停止循环并报告“工具报告locked，实际屏幕未核实”。不得断言用户电脑必然锁定、改主机安全设置或换控制路径绕过拒绝；连接标签本身不是可控证据。

**5. 工具失败、审批拒绝、授权未用容易混写。** 每次分开记录：已执行且已验证、已知未执行、结果不明，以及授权是否已使用。v9访问失败发生在输入前，当次授权尚未使用；v10登录已提交一次并成功，当次授权已使用。UAC点击被自动审批拒绝，已知未执行；Escape取消后只继续普通权限查询。最小下一步是先查不明动作的实际结果；只有新的相关具体证据且已知未执行时才按适用规则重试被拒动作。不得用另一输入方式/命令/进程绕过提权拒绝，不复用一次登录授权，不把API格式错误写成用户拒绝。见[拒绝动作、原因与范围](../analysis/vm-install-v10/elevation-blocker.json)。

**6. 服务查询失败就认定TPM不存在。** 本轮普通PowerShell执行 `Get-Service TBS` 返回 `NoServiceFoundForGivenName`；这只证明该查询未找到所请求服务，不证明TPM设备缺失、损坏或不受支持。v8管理员TPM查询错误、v9静态调查与本轮服务查询应分别保留，不能互相替代。最小检查是获授权的普通权限PNP/设备只读查询及完整错误状态；本轮PNP已返回TPM 2.0及Pluton命名设备均OK，tpmtool退出0；不因此证明硬件Pluton真实存在或所有TPM功能健康。[本轮设备观察](../analysis/vm-install-v10/guest-observations.json)。需要管理员权限时按[具体提权阻碍](../analysis/vm-install-v10/elevation-blocker.json)处理；禁止清TPM、改Secure Boot/PIN、安装无关服务或以消除警告为目标盲修。见[TPM与设备调查](../analysis/vm-install-v9/tpm-and-device-investigation.md)。

**7. 恢复到锁屏被当作环境/游戏通过。** [v9启动证据](../analysis/vm-install-v9/restore-boot-observations.json)仅验证独立克隆启动到锁屏并正常关闭；v10才新增一次登录后的桌面观察。恢复启动、登录桌面、设备健康、更新/激活、x86/旧图形、游戏加载、官方联机是各自独立验收层。只标记本次实际达到的一层，后续需要各自证据与授权；不能用Windows桌面、驱动签名或离线隔离证明游戏/官方服务器兼容。

**8. 为测恢复直接启动冷备份，或把原VM运行写盘当损坏。** v8冷基线保持不可变，仅从已校验基线创建独立测试克隆；克隆只改配置中的Name/UUID，保持无网络/共享、不共享inode、无backing或外部数据依赖。原VM运行中系统盘/EFI/TPM元数据变化是正常可变状态的观察，不能归因于助手修改或基线损坏；复制来源始终是关闭的基线。见[基线回执](../analysis/vm-install-v8/windows-cold-baseline.json)、[克隆回执](../analysis/vm-install-v9/restore-clone.json)、[运行中原VM观察](../analysis/vm-install-v9/connection-recheck.json)。操作前后检查基线完整性、目标独立性、容量及实际状态；目标存在或复制失败则停，保留结果，不覆盖/删除重试，也不为运行测试改基线TPM/安全设置。副本含Windows身份状态，必须私有保存；同卷副本不是异盘灾备。

**9. 只看成功样式JSON就宣告复制成功。** v9已知限制是回执写入后晚期flush/fsync失败可能留下成功样式JSON；不能以回执文字单独定成败。本次真实复制由退出码0、回执、实际哈希、最终元数据和独立性检查联合验收，见[复制进程结果](../analysis/vm-install-v9/copy-process-result.json)。后续如非0但已有回执，标记结果待核实并保留文件，不自动重跑；修复回执发布方式须使用新版本及失败测试，不改已经执行并绑定哈希的脚本来追认旧结果。

本节完成条件：新的可重复问题写明症状、证据、最小检查/修复、禁忌与未决；更新或过期时追加有时间/阶段的结论，不把历史阻碍当当前状态。UI可控性、真实磁盘操作及尚在进行的查询不能用文档检查代替验收。

### 10. 官方下载、证书字样和许可链接被混作运行验收

**症状与事实：** v11官方Autologon ARM64文件已下载、身份hash固定，介质3/3回读通过；已检查Mac工具缺少完整PE Authenticode验证器。证书存在和PE架构不能证明Windows信任、时间戳、吊销或当前构建兼容。随附Eula.txt与已展示网页有文本差异，不能称“官方来源所以条款相同”。见[下载](../analysis/vm-install-v11/download.json)、[静态摘要](../analysis/vm-install-v11/tool-static-metadata.json)、[介质](../analysis/vm-install-v11/media-validation.json)。

**最小步骤：** 固定文件/hash及准确源；在获准且不会不必要丢失会话的安全节点，把只读介质交给目标VM，用Windows内置Get-AuthenticodeSignature只读检查，记录Status和离线吊销限制；核实实际条款再决定运行。用户不在场、账户密码缺失时，完成准备即记录依赖停止，不能把“自动推进”解释为获取密码或复用PIN。

**禁忌与未决：** 不把证书主题、IsSigned或SHA256写成完整信任；不信任仅由EXE自带的根证书；不关闭吊销/签名检查消除错误；不为挂盘强关机、绕过登录或改密码。仍待Windows信任、实际许可差异处理及用户本人输入；不以当前准备证明自动登录、唤醒或游戏已通过。

### 11. 只读内部光盘不出现在热换盘菜单

**症状/证据：** v12克隆仍在桌面，UTM提示无空可移动驱动器，运行中编辑禁用；固定v5.0.8源码确认ImageName存在即内部盘，ReadOnly不等于isExternal。见[具体观察与源码](../analysis/vm-install-v12/media-mount-blocker.json)。

**最小步骤：** 先核对准确VM及每盘类型；没有标准可换入口就停止反复点击。原范围允许正常停机调整第四只读CD，但须先协调后续新一次Windows登录，避免无意义丢失已登录会话。不要自动新增第五盘、修改运行中映像、以暂停代替安全关机或用间接控制绕过限制。API变量失效需正常重新绑定；工具“应用已变化”先刷新当前状态，不把它当审批拒绝或继续用旧索引。

**未决：** 停机后的具体标准界面替换、Windows签名和工具实际窗口仍未验收；现有会话保留，原机与冷源不动。新登录未获具体代填确认前不复用历史PIN授权。

### 12. 更换虚拟化方向时避免继承旧动作或扩大扫描

**症状/事实：** v13用户表示以前Windows11+Parallels更顺利，并要求暂停UTM后续；暂停发生在关机前，新单次登录确认尚未使用。标准安装/登记位置未找到Parallels，不代表自定义位置、外置盘或其他Mac不存在。[只读盘点](../analysis/vm-install-v13/parallels-inventory.json)。

**最小步骤：** 先记录前一分支实际已执行与未执行，再冻结它；仅检查应用元数据、已知登记位置和明确正常项目目录。定位不到时请用户给准确位置/所在Mac，避免全盘搜、进入废纸篓或把授权扩大到新安装/试用/购买。旧体验只证明用户的Windows使用经历，不能当游戏测试结果。

**禁忌/未决：** 不启动未知PVM，不直接拷带TPM的PVM当完整恢复，不读取许可/TPM秘密、不自动续订激活，不因新平台没有CLI就说VM不存在。当前版本、许可、Windows架构及是否可复用仍未知；UTM新登录授权未消费，暂停期间不执行。

### 13. 整体移除与继续调优不可混用；占用数字不是可释放空间

**症状/证据：** v14用户改为整体移除UTM；两台项目VM依旧运行，UI原机锁屏/克隆桌面且各4盘有打开句柄。清单含稀疏QCOW2及APFS克隆，st_blocks求和可能重复计算共享extent。13盘无backing与跨bundle路径不证明全机没有其他反向引用。[精确清单](../analysis/vm-install-v14/removal-inventory.json)、[依赖](../analysis/vm-install-v14/dependency-check.json)。

**最小步骤：** 冻结旧登录/Autologon/调优分支；列精确路径、运行状态和未决依赖，先正常关机且确认无文件占用，再正常退出应用并按用户确认的清单移到废纸篓。未保存工作阻止或更新中须停止，不能强关。报告“已列清单”“已关机”“已移到废纸篓”和“释放空间”分别验收；移到废纸篓不代表立即释放空间。

**禁忌/未决：** 不遍历旧废纸篓、不清空、不永久删除，不广泛匹配UTM或删除整个Library容器；保留代码/样本原件/证据/知识库。应用全局容器可能关联其他VM，未核实就排除。当前只有清单完成，关机、可恢复移除/放回均未测试；本轮ps EPERM未重试，不以它推断VM已停止。

### 14. 工具长时间无返回与后续用户接管

**事实：** v15获取Finder窗口等待约47分钟，重试Parallels启动等待约16分钟后用户中止，System Settings读取等待约6分钟；设置10秒工具timeout未约束全部宿主/审批/交互等待。具体原因未确定，不能一律称“等待用户审批”或“电脑卡死”。[动作记录](../analysis/vm-install-v15/parallels-launch-blocker.json)。

**最小步骤：** 返回/中断后第一条消息先说准确工具、动作和结果是否未知；只读查app运行/精确原路径状态，确认之前未做才继续。恢复工具响应后按实际状态接管用户已启动的app，不再反复启动或创建替代任务。启动前读到false、后来用户启动为true属于时点不同，不篡改历史。Gatekeeper命令要求UI确认时，必须同时核验最终spctl状态，不能凭命令名称断言成功。

**禁忌/未决：** 不把旧关闭/暂停指令当永久状态，不把新的安全确认扩大为别的安全项；不为读不到窗口绕过拒绝。v15最终Gatekeeper仍启用，Parallels现有VM只见启动画面，签名无效与许可证状态仍独立未决。被拒UTM容器保留，不能写成完整无残留卸载。


### 15. “请稍等”与配置XML不能替代当前系统/隔离验收

**症状/证据：** v16持续等待，日志有Tools驱动安装/ARM引擎启动，磁盘持续写入。它们不证明正常更新、死机或桌面可用。[证据](../analysis/vm-install-v16/startup-and-isolation-observation.json)。

**最小步骤：** 核对准确VM，有限检查画面、具名日志状态行与磁盘元数据；实际配置页核对共享方向。HostSharing=0不能覆盖用户目录镜像/云/Mac卷勾选，USB控制器不等于外接设备直通。当前Parallels不套用旧UTM按钮/流程。

**禁忌/未决：** 不读Unattended.iso、凭据或内存诊断等待，不循环重启，不把磁盘活动当桌面/许可/游戏通过；只读范围不改共享。根因未定，先普通响应检查和最小隔离方案，避免强关机或重建环境。


### v17更新：桌面已出现，不再沿用黑屏与Ctrl+Alt+Delete分支

用户新报告后，当前桌面和Windows查看器已验证：专业版24H2/26100.4349、ARM64。此前被拒安全序列未发送，因不再需要已取消；不再次索取或使用该动作授权。原启动等待根因未知，不把自然完成/用户操作归因于助手修复。当前共享选项仍开启，既有文件图标不打开、不纳入文档截图；先明确隔离与恢复点再考虑样本执行。[实际观察](../analysis/vm-install-v17/desktop-and-isolation-observation.json)。


### v18更新：批准不消除当前屏幕访问阻碍

首次屏幕刷新报告locked；只记录工具状态，不重复断言用户已锁屏或绕路控制。完整有界实验批准已存在，后续无需再问相同范围。可独立准备固定只读介质，不能据文件稳定/lsof空输出猜正常关机或热拷PVM。标准/tmp本身是/private/tmp别名，路径guard应仅在核实该系统别名后使用真实路径，不能放开任意symlink。当前介质成功不等于客户机导入/恢复点/执行通过。[状态与修复记录](../analysis/vm-install-v18/execution-state.json)。


### v19更新：应用身份、IME与恢复点分层

**症状/事实：** 同bundle ID有安装目录和挂载卷两份应用，`getApp(bundle ID)`歧义；精确运行文件引用确认后仅绑定正在运行的安装路径。磁盘版本从20.4.2变为26.3.3，不沿用旧身份/签名结论。坐标输入曾报noWindowsAvailable或先激活残留配置窗口；原生AX菜单可正常关机。新界面需重新取索引、关闭已知残留配置页，列表/组合框可用正常键盘导航并核对实际结果，不能把无变化当完成。

**输入最小检查：** 来宾显示“中”时，先切英文并核对完整文本再提交；本轮PowerShell输入产生拼音候选和截断，未提交，取消回桌面。工具不接受单独Shift（modifier-only），不能反复发送/盲目用PIN或共享剪贴板修复。用户实体键盘是否正常未验证；当前最小依赖是英文输入与普通PowerShell窗口，不需新增样本授权。

**恢复分层：** ditto退出0不等于可恢复备份；真实副本20文件内容一致但系统扩展属性不一致，保留失败状态，不删/伪造安全元数据或放宽校验。改用正常关机原生快照后，管理器/落盘记录/完整内部链通过；仍未做还原启动，且快照依赖原PVM，不是独立备份。正常创建快照会改变源磁盘链，旧预检hash不能当快照后源不变证明。后续执行前核验当前隔离和确切快照，最后仍检查来宾哈希。[证据](../analysis/vm-install-v19/execution-state.json)。


### v20更新：IME按窗口核验、延迟输入和一次性运行记录

**症状/事实：** Run已切“英”不代表新PowerShell也为英文；长命令出现拼音候选，且typeText返回后的第一张图常只显示前缀，后续观察才完整。点击当前窗口任务栏输入指示切成“英”、返回焦点，短测试核对后逐段输入可完成本轮。长启动命令曾被改写，及一条cd短命令均在提交前Escape/Ctrl+C取消；最终完整命令只提交一次。延迟/切换的底层原因未确定，不宣称彻底修复用户实体键盘。

**操作前最小清单：** 确认精确VM/窗口、当前应用指示为英、焦点正确；输入不执行的短文本后检查，取消；分短段输入且等待全串可见，逐字核对再Return。看到前缀不要立即判丢字或重打；有候选/改写则取消未提交输入，重新观察。不要用共享剪贴板、提权、改PIN或安全设置替代。

**执行证据：** 命令提交一次、进程创建、已退出、数值退出码、故障事件、后代状态分别记录。空退出码不是0，未看到窗口不是从未创建窗口，根退出不是无子进程。WaitForExit只是等待；若要正常关窗需留出预算并复核退出。本次PID600已退出，匹配故障事件两条，未到超时，不重复样本。[记录](../analysis/vm-install-v20/run-observation.json)。


### 用户确认的正常流程前提（2026-10-25 23:20–23:21 UTC）

用户说明“需要打开兼容模式”“游戏需要通过启动器运行”，并要求先分析启动器再分析游戏。此为用户提供的操作经验和研究顺序，尚非已复现实验条件；随后用户于23:31明确为启动器和游戏均设Windows 7兼容模式；当前VM尚未验收，其他附加选项无证据。此前五文件无参数直启没有配置这些前提，不能据故障判定正常启动或游戏兼容失败。

最小检查：先核对原始POLCN_Launcher.exe身份、XML目录与游戏条目、CreateProcess工作目录/参数/环境/IPC，采用用户已明确的Win7双EXE前提，区分“用户经验”“当前实际设置”“兼容效果”三个层次。原始登录器manifest声明requireAdministrator，主程序asInvoker；supportedOS声明不等于兼容模式设置。不要重新猜版本或重复询问，不从Win7前提推导故障根因；不把“需要兼容模式”扩成管理员运行、改manifest、RunAsInvoker、关闭UAC或安全功能；不借旧单次授权再执行。[启动上下文证据](../analysis/launcher-v4/launch-context.md)、[清单身份](../analysis/launcher-v4/manifest-context.json)。


### 启动器控件字段与INI参数不可按名字猜（v5）

**症状：** Code11静态分支跳过CreateProcess，字段名未知；目录回退存在Game/Path两字面量，容易颠倒节/键。**已验证：** +1708通过子对象+11c/+15ec绑定“仅刷新通行证”控件405；SendMessageA(0xf0)返回值写字段，启动前数据交换；INI包装器参数栈证明[Path]节/Game11键。见[状态证据](../analysis/launcher-v5/state-field.md)、[目录证据](../analysis/launcher-v5/directory-context.md)。

**最小检查：** 先确认固定hash→字段别名/初始化→控件ID与资源→写入API→消费者条件；配置则核对调用参数顺序、主键/旧键映射、错误分支，再写规格。**禁忌：** 不把标签当协议定义，不称检查状态为认证成功，不交换INI节/键，不把通用旧键迁移当Code11必经步骤，不改来宾注册表伪造准备。**未决：** 当前控件/目录值、上游调度、游戏消费端与直启故障根因；本轮无运行证据。


### 阶段整数与IPC标签不等于协议语义

**症状：** 阶段≥5进入启动、回调推进流程，容易被误标为“已认证”；gid/glt标签容易被当作账号/票据规范。**证据：** +968绑定下一步/上一步阶段，亦有目录恢复置3及独立分派推进；IPC源仅闭合到列表和回调参数，且与argv缓冲不同。**最小验证：** 核对事件表、所有已识别写入、参数转交、通道去向及固定配置实际条目；对未闭合事件源停止命名。**禁忌：** 不读取真实值补猜测、不伪造阶段/票据、不把空配置分支当认证跳过，不以相似字面量跨模块拼接。**未决：** 回调生产者及游戏消费者；详见[有界总结](launcher-static.md#launcher-final-static-flow)。


### v21：ISO目录成员与未使用批准

**症状/证据：** bsdtar列表中的XML目录无尾斜杠，旧成员计数把它当文件；ISO已生成但回执未写。**最小解决：** 先检查既有输出，不重复制作；按目录/常规文件类型核对精确集合，3文件内存回读对比后记录通过。构建器修正但不重跑；[回执](../analysis/vm-install-v21/media-validation.json)。**禁忌：** 不把非零退出等同没有副作用，不自动覆盖、不放宽至任意成员。

**v21历史屏幕边界（v22已恢复）：** CUA报告locked且apps为空，VM步骤未执行；用户先暂停后立即更正权限，以最后明确的单次范围为准。批准未使用不代表环境门槛通过；保持一次性额度、先恢复合法UI访问并核对新恢复点。不得重复探测、绕过锁定、使用旧登录授权，或把配置文件NIC0/Mac隔离1当当前来宾已验收。是否真正锁屏/会话可控待新观察，见[执行状态](../analysis/vm-install-v21/execution-state.json)。


### v22：跨对话框按键、异步输入和执行不确定性

**症状/证据：** 属性页底部按钮不可见；Alt+Space未显示菜单后，Escape与Return被连续发送，随后Explorer选中EXE。重开属性确认Win7未保存，未见UAC或样本窗口，但无法排除Return激活EXE。助手的连续按键是已知操作错误，Windows是否执行为未知，不把推测写成根因。[完整有限证据](../analysis/vm-install-v22/execution-state.json)。

**最小步骤：** 对可能关闭对话框、返回文件列表或执行默认动作的按键逐次观察；确认当前窗口和可见目标后才能Enter。按钮不可见时先使用标准窗口布局/导航让目标可核实，不在未知焦点下盲按默认键。若已经不明，先普通权限查固定进程与精确目录；负结果不足以重获执行额度，停止再次启动并报告。

**输入复发：** typeText返回时只有前缀，后续字符继续输入；PS先显示英，较长事件查询仍出现中文组合和缺字。根因未证实（不能认定是Shift或Parallels本身），本次已取消未提交。每次提交前核对全行，不仅看输入前“英”；乱码时Escape取消组合再Ctrl+C，等新提示符。工具输入曾成功不证明实体键盘正常。

**介质与恢复：** 配置选择框焦点/菜单未响应不是审批拒绝；正常设备菜单经逐步观察后成功换只读CD。原生快照含旧CD路径，必须记录并保留外部介质依赖；不得把内部快照当独立备份或声称实测还原。

**禁忌/未决：** 不批量Escape+Enter，不因无当前进程/无错误就宣称从未运行；不重复样本、不扩大日志、提权、改输入安全设置或开共享剪贴板。当前Win7未保存、启动可能发生但未证实、初始流程仍未验收。


### v23：用户确认设置、UAC等待与运行计时分别记录

**症状/证据：** 用户完成两EXE Win7设置并明确不再复核后，继续该前提，不重复属性页。用户接管结束后初次工具输入仍未生效，后续普通文件选择/Explorer正常关闭与英文短命令均恢复；恢复的具体根因没有证明，不能写成“改某项配置已修复实体键盘”。[有限记录](../analysis/vm-install-v23/run-observation.json)。

**最小步骤：** 获取一次新鲜目标/输入状态，在非敏感窗口验证选择与正常关闭；遇用户接管先协调，不覆盖其他勾选。短命令核对全行后提交。此次UAC未知发布者的完整路径与固定样本相符，仅接受该一次；不把用户概括表达保存为无限规则。

**计时教训：** 从命令提交01:27:02.434到进程退出01:29:19约137秒，但Process寿命为74秒。两种口径并列保留；本次137秒明确违反90秒约定，不能用74秒标完整通过。运行结果回报延迟，也属于本次执行流程失败。后续观察必须把UAC和正常关窗时间纳入已约定的90秒；UAC等待占用较多时间时应取消尚未接受的请求；实际执行中尽早正常收尾，不能为满足数字强杀/重试。

**结果边界：** 断网下自动更新检查报12007及更新检查失败，可正常关窗退出；原三文件hash不变但新增Log.htm，不能说“没有文件变化”。不因此启网、跳过检查或认定ARM/Win7失败，日志正文/历史子进程/其他系统写入仍未验证。


### 公开更新ZIP与现有样本相同，不等于可信更新或兼容验收

**已验证：** 04:44 UTC下载ZIP的唯一EXE与原599040字节启动器逐字节相同，版本1.5.8.2；无PE嵌入式证书表，管理员manifest不变。ZIP路径/链接/膨胀/CRC通过。**最小处理：** 复用同SHA256的REA证据，避免重跑同版反编译或重建VM；保留公开HTTP来源、时间、ZIP和条目哈希与本地比较。**禁忌：** 不把CRC/MD5/版本字符串/HTTP200当作官方认证，不把下载批准当执行或联网更新批准，不推断首清单一定与载荷同步。**未决：** XML差异、真实就绪/游戏消费者/协议及官方许可；[本轮精确记录](../analysis/launcher/public-package-comparison.json)。


### stage36启动配置解析与计划的使用边界

**症状/事实：** Game Code可以重复，误当数组索引/去重会切错条目；本模块按ordinal选择，两个同Code可以共用Path/Game键。空/非法found快照不能悄悄用INI掩盖；错hive/键和值引用报错。XML/INI重复、穿越路径和预算负例均有测试，见[回执](../shared/evidence/launcher-validation.json)。

**最小处理：** 平台只传入显式合法本地文本/目录快照，先看LauncherError.code；不支持的DTD/命名空间、旧键迁移、UNC/POSIX路径应由新的可审阅规格处理，不能放宽预算后冒充完整兼容。不要将命名XML/INI字段与原Windows解析器的全部规则混为一谈；不要把windowsPath当网页文件句柄，或把Argsline拼进shell执行。**未决：** 真实配置适配/设备测试、文件存在性/完整资源、就绪/认证/协议与官方许可；模块没有实际下载/运行/认证能力。


### stage38：metadata满足不等于真实安装，原始地图可读不等于语义已还原

**已验证：** inventory会区分missing/ambiguous/mismatch/unverified；但kind、大小和SHA256来自调用者，本函数不读取或认证磁盘，0字节元数据也可满足未要求内容的单纯存在性。处理时看scope与checks，不把knownRequirementsSatisfied写成可玩。显式要求摘要但未提供必须保留unverified。路径匹配使用ASCII-fold+NFC的保守别名政策，不冒充全部文件系统规则；旧计划器也使用共用的完整路径字符预算。

**测试踩坑：** 首轮缺摘要负例把undefined传给有默认值的夹具参数，反而补回默认SHA256，导致29项中该项失败。修正为明确不含sha256属性的metadata对象，断言不降低，29及完整85测试通过。后续缺字段负例先确认字段真的省略，不用默认参数意外补齐。[回执](../shared/evidence/install-map-validation.json)。

**地图禁忌与未决：** @4…11和body保持不透明，不能把格式公式/CRC/摘要匹配写成碰撞、tile或坐标已知。四实际样本只证明结构和复制结果一致；真实安装、地图玩法/渲染、平台设备及游戏消费者/认证/帧仍未通过。


### stage39：不要把主机工具、配置标志或材料存在当成来宾可诊断

已知Mac LLDB/Frida安装历史不证明Windows ARM/x86观察器可用；当前PATH/已查REA-bin未找到Frida只表明该位置未核实，不能写成全机卸载或直接下载重装。`ps`权限拒绝后停止该查询，不用其他进程枚举绕过；文件配置的Connected/Isolated值不等于实时桌面/网络与共享已验，更不能按旧锁屏结果反复要求用户解锁。

完整2.626GB源已解出，但旧五文件不能代表完整正常安装；共享inventory对四配置要求匹配仍只说明源metadata，不证明全部资源、就绪或Apex未知组件行为。未来API元数据只能定位消费者候选，不能凭名字补帧/认证。未有验证过的停止和事前下载/子进程边界时，不启动原程序或承诺90秒。[已完成和未完成均有区分](../analysis/diagnostic-preparation-v1/diagnostic-plan.json)。


### stage40：屏幕访问失败和合成API元数据的验收边界

**症状与证据：** 当前普通目标状态读取报告“Mac is locked，automatic unlock could not unlock it”，见[06:09:48 UTC记录](../analysis/diagnostic-preparation-v1/guest-tool-check.json)。这是工具当前报告，不能从connected/attached或旧画面推出用户实际屏幕状态，更不能断言来宾没有工具。**最小步骤：** 等主会话取得正常主机解锁/控制恢复的新证据后读取一次现有窗口，检查具名来宾工具文件/帮助；若仍拒绝即报告并停止。**禁忌：** 不重新启动修改签名的应用、不重做被拒主机ps、不换路枚举、不凭旧PIN解锁或反复探测。**未决：** Windows API观察器及其ARM/x86兼容性尚无验证结果。

**合成准备的限制：** 原创x86目标只操作PID命名的64B映射且不访问缓冲；元数据schema6测试通过只证明输入契约，不证明真实采集器、编译/执行行为、自然退出时限或游戏协议。未来核实的PE SizeOfImage用于RVA边界，不能拿磁盘文件大小替代；没有二进制前不要伪造其hash。Apex标准gzip完整性也不证明内层功能/架构或无害，不因直接文件名搜索无命中扩大到解保护/执行。[准备入口](../analysis/diagnostic-preparation-v1/synthetic-readme.md)。


### stage41：help也可能触发包装器副作用，CLI不等于已验证免锁屏

**症状/已证：** 屏幕读取恢复但点击`windowNotFoundAtPosition`、typeText无可见变化；没有Enter，不能把查询文本当已执行。置前及菜单查看不证明键盘已路由到来宾。停止盲输，不复核用户Win7，不用旧PIN/共享剪贴板修复。[当前输入证据](../analysis/diagnostic-preparation-v1/guest-tool-followup.json)。

**本地CLI最小检查：** 先核对原项目/实际平台、入口符号链接、包装脚本、二进制签名和本机随附手册，再决定是否可运行help。当前prlctl的arm64签名完整性失败；标准入口先ps并可初始化服务，prlexec仍转调它且可能自动开机。help/version参数本身不能保证入口无副作用；不直接执行二进制、改签名、清隔离或另路重做被拒ps。硬件sysctl权限拒绝也单独停止，不换工具取同一受限信息。[行号/hash与结论](../analysis/diagnostic-preparation-v1/local-cli-feasibility.json)。

**未决/下一验证：** 手册给出的exec/current-user是正常管理通道候选，要求Tools，但当前许可/实际权限/锁屏兼容未测。先核实可信标准CLI及允许的前置动作，再就固定VM的无凭据回显/具名查询取得具体批准；不默认允许初始化服务、来宾提权、默认用户、密码参数或新的长期入口。不得声称已完全摆脱锁屏干扰。


### stage42：应用替换、CLI资格及整包PVM保留不能相互替代

官方允许更新应用并复用既有PVM，不要求重装Windows；先确认Pro/Business/Enterprise及覆盖版本，不能凭存在prlctl或26版本号假定CLI许可/27升级已具备。官方版本记录与本机字节完整性是不同证据，已修改签名不能靠版本文字修复。

保留PVM时包含快照树、NVRAM及全部磁盘层；三内部引用存在不证明已冷备份、运行已停止或恢复成功，vm.lock也不能替代状态核验。按官方建议正常关机后整包复制，不清快照、不只拷一层hds、不删除Keychain或安全配置。重装应用仍可能保留会ps/初始化的CLI入口，不能绕过旧拒绝或承诺自动摆脱锁屏；当前EULA/安装权限须按实际新范围处理，不打开试用购买。[最小步骤及官方链接](../analysis/diagnostic-preparation-v1/official-repair-assessment.json)。


**stage43补充：** 用户要求助手自行查许可时，先用普通关于信息或非敏感应用元数据；工具一次报告locked即停，不能改读许可证数据库、Keychain或异常CLI替代。静态26.3.3版本与未找到edition/license字段均不证明当前许可版别/有效性。无需用户发送密钥或自行研究，恢复屏幕访问后沿已有只读授权继续，仅报告版别/状态/到期等非敏感字段，不保存完整账户/许可画面。[本次阻断记录](../analysis/diagnostic-preparation-v1/license-check-blocker.json)。


**stage44补充：** 用户明确确认Business后接受该事实，不再因旧“版别未知”记录重新问或复核。把版别、有效期和升级覆盖分开：官方允许有效订阅升级不证明此用户当前有效，企业升级策略亦可能受管理。版别确认不是新的解锁证据，不恢复UI循环、异常CLI、许可证数据库或凭据读取；剩余字段安全不可得就记未知。[用户确认与边界](../analysis/diagnostic-preparation-v1/business-license-status.json)。


### stage45：消歧、REPL变量与来宾响应分别核验

同bundle ID安装目录/挂载卷冲突时，复用v19已证完整路径，并确认回到既有Windows11窗口身份；本轮该方式恢复读取，不重做旧进程查询、不弹卷/启动另一个副本。REPL绑定变量不存在时按已知完整路径做顶层绑定并观察；这是本轮可恢复症状，原因未定，不当成来宾输入或安全拒绝。

画面可读、指针移到按钮、click返回成功都不等于来宾导航成功。本轮用户打开面板后仅点击一次设置，随后未见设置窗口；结果未确认，停止不重试，不把它归因为虚拟机故障或宣布工具未安装。当前只走GUI，CLI/其修复分支已结束；不复核用户Win7/Business，不用安装或权限变更代替输入验证。[现有窗口与有限操作记录](../analysis/diagnostic-preparation-v1/gui-tool-presence-followup.json)。


### stage46：清单/包/离线依赖与安装资格分别核实

微软短链的appinstaller是更新/下载元数据，不能当完整离线工具包；本轮清单HEAD403后停止，不变请求方法、客户端/TLS、镜像或路径规避拒绝。公开旧版WinGet包URL和SHA不是当前包来源/大小/依赖/签名实测，也不自动选旧版。Windows App Installer支持本地MSIX不证明当前依赖已齐，许可Proprietary也不等于已接受实际EULA；未知条款/UAC/证书/策略要求停止，不导入信任或放开网络修复。截图显示Tools注册存在、WinDbg注册查询无匹配都不能代替API能力。合成C未编译、GUI继续/关闭未可靠时不开始调试，不用“自然退出”等待值承诺总墙钟时限。[本轮边界](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json)。


### stage47：可见焦点的物理按键已通，不能把不同输入方法混为一谈

**症状/事实：** 先前完整路径已解决应用身份歧义，但点击/typeText未见来宾变化。本次同一Windows11窗口、搜索框可见尾部光标下，只发一次`pressKey('x',{durationMs:120})`，读回`windbgx`及中文IME候选；再一次BackSpace读回`windbg`且候选消失。动作输出截断时先只读确认，未重发。说明当前焦点的普通键盘路由可用，无需先改权限或重装Tools。截图实际为JPEG3456×2010；把字节当PNG读取宽高是无效诊断，不用于DPI/坐标推断。未保存原始画面或账号内容。[操作与证据](../analysis/diagnostic-preparation-v1/gui-tool-presence-followup.json)。

**最小可用方式：** 保留准确完整路径绑定和可见焦点，使用已验证普通按键方法并读回变化；英文命令仍需先观察英文输入状态，不能把IME预编辑当已提交。**禁忌：** 不以这一个字符验收鼠标、typeText、完整调试器继续/关闭或用户实体键盘；不再重复无效点击，也不据此擅改TCC/辅助功能/网络/共享或安装组件。根因仍未隔离，输入方法/时长/焦点是候选差异，不写成确定原因。

**公开分发边界：** RFC9110将HEAD定义为无内容的元数据请求，403表示该请求被拒；不能从403证明HEAD不支持（405有相应语义），也不能断言所有官方分发不可用或GET一定成功。微软正式列出独立Store GUI与WinGet路线，未实际测试/安装；不重试受拒端点或用代理/换方法规避。严格离线包依赖/许可仍未齐，Store需要新的精确网络/安装范围。[核查来源](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json)。


### stage48: Verify each input surface and network outcome

120ms right-click opened the Windows taskbar menu;120ms left-click selected Task Manager, which only appeared on the next observation. Search words entered through Chinese IME were committed with Return and read back as Latin text before using results. Single-key or guest mouse success does not prove modifier chords or native popups. Current native Network Source failed to expand; exact configuration-window rebinding did not solve it. cannotClickOffscreenElement stopped the child selection. Do not equate pointer movement/tool completion with network enable; final Connected0 was read back. Do not write config, restore CLI or change permissions to work around GUI input. Minimal handoff: open the current dropdown without selecting or connecting. [Receipt](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json).


**stage49 focus limit:** A focused native combo in AX does not guarantee Tab navigation works: one120ms Tab left the same focus18/Disconnected. This bounded recovery was stopped; do not repeat hidden-item clicks or call it permission denial. Keep NIC disconnected because reliable connect/disconnect is not established. Guest-key/mouse success remains a separate limited result. [Evidence](../analysis/diagnostic-preparation-v1/windbg-offline-assessment.json).

### stage82：UDF、MSI差额与签名验证域不能混淆

**已核实的工具缺口与补充：** 本机bsdtar对微软SDK的UDF1.02只列`.`/README.TXT，退出0不能当完整镜像目录。按当前依赖授权通过Homebrew补入sevenzip26.04、msitools0.106_1、osslsigncode2.14_1及gcab/libgsf；未自动更新、清理旧包或改安全设置。7-Zip列出含archive记录的286项；原始微软ISO1173295104B完整私有保存。SDK_Debuggers表列1003文件/40外部CAB，msiextract退出0只生成1001文件；逐项对照缺的是两份非压缩Redist MSI，不能声称完整提取，也不把它误判为ARM64调试器缺失。[组件与提取边界](../analysis/runtime-tool-readiness-v1/sdk-audit.json)。

**签名事实与未决：** 默认`/etc/ssl/cert.pem`下主安装器/SDK/EULA MSI的内容摘要匹配但缺issuer；两Redist MSI则在链验证前报DigitalSignature摘要不匹配，MsiDigitalSignatureEx一致。后者原因未知，不推出恶意、传输损坏或工具bug。官方PKI页发布的Root2010指纹与HTTPS证书bytes匹配，作为每条命令的CA/TSA-CA文件后19项签名及时间戳通过；未导入系统/来宾、忽略时间戳/撤销或放松TLS。Redist的外层签名MSI FileHash MD5与原bytes一致仍不能替代它们自身签名核验，失败保留且未执行/编辑/重签。[完整范围](../analysis/runtime-tool-readiness-v1/signature-audit.json)。

**普通交互与最小处理：** Windows画面仍可读；两次Explorer点击、一次已暴露Raise、普通Ctrl+Esc、新绑定后的Start右键未看到Explorer/Start菜单。指针/hover与时钟变化不等于输入送达，也不据此归因Mac共享隔离。停止继续试键，已请求用户在现有设置空白区手动点一次捕获焦点；暂保留断网与共享隔离，网络恢复请求并未撤销。不重试stage81故障菜单、重启/强退/还原、旧CLI或改保护。[界面证据](../analysis/runtime-tool-readiness-v1/environment-observation.json)。

**同轮已观察的恢复方式：** 用户点击后，在空白PowerShell行单键x/退格可见，Ctrl+Space读回英文；Test-Path、Get-PSDrive、只读光驱识别、安装器Hash/Authenticode完整命令均先读回再提交。typeText早期前缀须等完整，不重输。SDK标准目录False仅限该路径，旧终端中的v23启动/哈希输出未当本次执行。原生菜单AX点击CD父项只关闭菜单；重新打开菜单后，Down/Right与每步selected读回成功进入CD/DVD/连接镜像，Mac GoTo路径字段原子设置、确认选中ISO后才Open。没有重试故障Network项。[后续证据](../analysis/runtime-tool-readiness-v1/gui-focus-and-media-followup.json)。

**原生窗口返回后的输入：** 文件框关闭后一次typeText未见进入，未提交；在已观察的来宾终端空白区一次120ms点击后，x显示/清除，再完整输入并执行原只读查询成功。这是本次切换的最小有效恢复，不证明统一根因、所有坐标或实体键盘。Next转成Accept时先新读并停在许可门槛，Privacy No单独确认；随后用户对该具体门槛回复，才接受本次SDK许可。[初始门槛](../analysis/runtime-tool-readiness-v1/sdk-installer-observation.json)、[后续安装](../analysis/runtime-tool-readiness-v1/sdk-installation-followup.json)。

**组件依赖与安装自检：** SDK默认14项勾选，按上到下取消会被后续仍选的依赖重新勾选；按依赖反向取消后新读，最终仅Debugging Tools for Windows、估算534.0MB。核微软发布者/安装器路径后一次安装UAC，完成页正常Close；安装器退出码和内部各子包执行链未采集。ARM64 CDB完整hash匹配、Windows签名Valid，`-version`返回10.0.26100.9457，紧接读退出0。该结果只验自身启动，不能写成ARM64观察x86或采集器隐私已验。[自检](../analysis/runtime-tool-readiness-v1/cdb-windows-check.json)。

**其他覆盖缺口：** 知识库3000预算双角色查询因本项目缺requirement-index失败，不能称加载成功；仓库现有需求文档仍为本次真源，未写其他项目/知识库或新增产品代码。SDK许可/安装和CDB自身启动已验，完整Windows信任/运行依赖、ARM64观察x86、采集器隐私与完整游戏仍未验。提取器对不存在MsiDigitalSignature表的失败输出未用作成功证据；源表名列表核实该表及MsiDigitalCertificate缺失。[本轮验收](../analysis/runtime-tool-readiness-v1/validation.json)。

### stage81：正常解锁、恢复点与Qt控件异常分别记录

**事实：** 用户回复已解锁后，普通列表/完整路径绑定成功，现有Windows桌面可读；由原v22快照名确认VM后，原生创建`Moli-before-observer-install-20261028-stage81`。进度结束且Snapshots.xml精确一项匹配；还原启动未测。AX窗口UUID变化不代表VM身份改变。来宾120ms点击与原始截图像素坐标打开Task Manager，下一观察才显示；关键词经IME提交、读回后才记结果。三关键词无结果不能代替完整进程清单。

**症状与证据：** 当前网络Source经AX点击/Space/坐标/Down/暴露的Raise与Alt+Down仍未展开，未点击隐藏Shared子项。一次“设备→网络”父菜单动作后出现关键错误；本机精确`.ips`摘要记录Parallels26.3.3、ARM64、EXC_BAD_ACCESS/SIGSEGV与QtWidgets的QWidget/QComboBox栈。它支持主机控件故障观察，不证明权限、签名、自动化或网络设置是根因，复现性未验。[错误摘要](../analysis/runtime-install-v1/parallels-error-summary.json)。

**已执行的最小处理：** 仅正常关闭错误报告；关闭调用输出截断时先新读确认，不重复点击。随后应用inventory、Windows画面及快照元数据仍可取得；Connected0/IsolatedVm1/共享磁盘与Home0仍在。没有发送报告、重试失败菜单、强退/重启/恢复VM、执行旧CLI、改权限/安全或安装/运行工具及目标。当前已请求人工通过正常配置设共享网络并保留Mac隔离；这是新恢复后的实际进展，不复用旧blocked计数。[完整操作](../analysis/runtime-install-v1/gui-observation.json)、[恢复点](../analysis/runtime-install-v1/recovery-point.json)。

**未决与禁忌：** 人工选择及来宾网络未验，工具/原创目标/游戏均未运行；快照不是还原成功证明。人工若同样关键错误即停；不依据旧CLI签名问题给这次Qt异常直接归因，不为扩大调查复制含账户、内存或寄存器的完整崩溃报告，不走遥测发送或保护降级路径。

### stage78：主机联网、文件配置与Windows观测分别验收

stage78已获新的项目联网/工具授权，主机5个HTTP200与XML摘要匹配不证明Windows已联网。config文件Connected0/隔离1只代表设置，当前普通GUI列表请求报告locked；正常手动解锁后才查真实来宾状态，不重试旧CLI/安全设置修复。原创x86构建、host模拟及ISO回读也不验收Windows API/调试器；先实际核验观察器和原创目标，再运行正常游戏链。[本轮环境与边界](../analysis/runtime-observer-v2/environment-observation.json)。

### stage79：远端HTTP状态与电脑访问分别记录

普通CUA报告locked不等于实际屏幕独立证明，不经其他通道或安全设置绕过。公开固定WinDbg包HEAD与正常GET各403，是远端请求结果，不等同客户端工具审批拒绝；本轮按明确工具/联网授权作公开正常GET，未改代理/身份/TLS，保留HEAD与GET失败，原因不推断。旧“尚未GET”仅描述历史，当前包实际未取得，该地址停止；正式Store路线需普通GUI恢复，清单或host模拟不能替代Windows实测。[本轮状态](../analysis/runtime-access-v1/access-status.json)。

### stage80：访问连续失败达到阻塞门槛时结束循环

新授权后正常入口连续三轮仍报告locked，普通访问未恢复；不把权限已给、host准备成功或旧Windows会话当可操作证据。当前无活跃观察任务可等，审计后将目标置blocked，保留代码/介质/证据，停止自动重复检查。用户正常手动解锁及普通工具访问恢复后再继续；代理不输入旧PIN/密码、不改变锁屏/安全或改用已取消通道。工具的automatic unlock失败消息与代理未发显式解锁命令分别记录。[审计](../analysis/runtime-access-blocked-v1/blocked-audit.json)。

### 登录器v6：名称、反编译类型与浏览器能力的边界

**已修问题：** XML名称引用和Region Name调用trim时，` Alpha `或NBSP会误匹配`Alpha`。仅关联名称改为trim:false，保留独立非空检查，新增26项区域测试含空白负例；其他旧目录/文件字段政策不改。该精确Unicode比较仍不是所有Windows代码页行为证明。[验收](../analysis/launcher-v6/validation.json)。

**静态分析可重复问题：** Ghidra FID将若干构造器命名为MFC/allocator类，不直接作为业务身份；按vtable数值4b5ca0、App+ac、虚槽和调用链定位。479690被推为void，但47974d…479753以EAX返回下一偏移；实现依据短汇编与调用者返回值检查。未知字段和队列后的变换保留未知，不把类型10或回调0当认证成功。

**证据读取：** 全包返回的包装取值曾无法存入store，未确认工具本身失败；后续用既有Evidence ID的native分页读取并导出完整bundle到私有build。不得把客户端截断/包装错误当作反编译无结果，或把大段源码加入交付。身份/19函数与bundle SHA见[静态规格](../analysis/launcher-v6/static-spec.json)。

**能力核验：** 普通开发依赖按用户新要求可直接补充，但本轮REA/Ghidra、Playwright库及Chrome已足够；缺少Playwright专用Chromium缓存时复用现有Chrome独立临时会话，无需重装。页面12项通过仅证明本地实现输入/渲染，不证明Parallels输入、旧Mac锁屏问题已解决、原程序运行或官服可用。本轮未操作VM/账号/原程序；这些运行依赖和具体授权均未消费。

**浏览器收尾：** 一次快照前smoke捕获`/favicon.ico`404，不能因为数据正常就忽略控制台错误。两页显式引用原创`web/favicon.svg`并在最终QA等待networkidle后通过12项；保留初次回执与[失败/修复过程](../analysis/launcher-v6/final-smoke-issue.json)，不把偶然未观察到favicon请求当完整静态资源验收。

### 登录器v7：传输层、第三方padding和测试契约

**已执行/结果：** REA恢复同样本快照，52个新增函数、60函数台账及4168B P/S数学常量对照完成，导出/新快照后会话已关闭。原回包18及新增连接18测试、完整161项Node与Chrome6项运行通过；全部为静态/原创离线输入，未使用原程序、VM、账号或官方联网额度。[验收](../analysis/launcher-v7/validation.json)。

**可重复边界：** Ghidra函数名/恢复签名会误导，CString长度与虚调用实参按汇编复核；`46cf90`为等待可写，不能当已完成握手。原32位word可递增但已经构造的P/S schedule不随之重建，不擅造逐包变钥。加密记录使用LE32块＋BE32双长度，解密出的片段须再交独立BE16内层流；两种边界不可合并。短共享hex的余下缓冲填充未知，本实现拒绝，不补零/读取真实key来弥补。

**最小实现与禁忌：** 新固定MIT依赖按公开包SHA512及文件SHA核验，原样许可随附，仅用受独立向量测试的原始块方法；不能使用vendor自动padding/string decode，因为会影响额外块或原文尾零。原接收器允许0/0，本实现拒绝，须保持为显式严格政策，不能写成全输入等价。原进程/时间伪随机生成器不移植；20B显式原创指数不代表真实随机源已验收，close清理也不证明JS秘密完全擦除。

**浏览器测试修正：** 新smoke把既有原创夹具误当无数据/真实文件状态，先错误期待序号禁用，再错误期待真实文件计数提示。先核对`loadFixture`源码与实际值，再改为准确来源/控件/夹具提示断言，移除catch假成功；不改应用迁就错误测试、不把两次失败计为通过。[过程](../analysis/launcher-v7/browser-smoke-test-correction.json)。

**v7当时未决：** 两byte字段UI语义/编码/变换、回包业务、重连/会话、可信更新/回滚和真实服务接受。字段/候选的后续进展见下方v8；数学相等、库安装、页面运行或本地解密均不是认证成功。

### 登录器v8：恢复签名遗漏、分支覆盖与数据检查

**已执行/结果：** REA复用同样本v7快照，新增9函数；UI用户名/密码、16B校验、候选列关联和选择门槛完成静态核验并实现。Node179、Python4、Chrome6项通过；原程序/VM/账号/官方联网操作为0。[验收](../analysis/launcher-v8/validation.json)。

**可重复签名问题：** `419fe0`伪代码少了第16参，`4133a0`少第10参，不能由其类型签名丢tailWordB。最小核对为调用点逐push与末尾RET0x40/RET0x28；`413641/413651`还证明最后参数实际用于点数格式。旧410df0 Listing在411959结束，后方case4只出现在恢复跳表/伪代码；本次以现有Apple LLVM21.0.0定点反汇编411be1..411c4e补核9处条件/跳转。不要把一个伪代码完整或高p-code截断统计当全部汇编已覆盖。[ABI](../analysis/launcher-v8/reply-abi.json)、[定点证明](../analysis/launcher-v8/case4-independent.json)。

**输入/模型的最小规则：** UI16B与协议字段18B是不同边界；A版WinAPI不能从XML编码推断代码页。名称按原byte strcmp及成对换位处理，稳定sort会在重复名时错配来源；保留source/display ordinal和所有关联列。原UI丢count/截state低16；列覆盖及无空NUL标签仍是工程支持范围。v8当时额外要求规范signed16的政策已由stage109按现行源证据替换：保留raw UInt32，按原低16门槛投影；不将选择通过当认证或执行权。[当前修正](../analysis/launcher-current-login-v1/implementation-spec.json)。

**工具状态漂移：** 旧报告的GNU工具版本不代表当前路径存在。猜测Homebrew gobjdump路径失败后，实际盘点发现`/usr/bin/objdump`为Apple LLVM21.0.0且支持本PE/x86，直接复用，无需安装或改安全配置。此前失败不是审批拒绝/目标执行失败，不换方式绕过任何拒绝。

**未决：** 真实代码页/输入通知、许可/账号记忆、连接失败/重试/会话、可信更新/回滚和真正交接/官方兼容。固定DIALOG helper仅用于同hash分析材料，不成为产品任意PE加载器；不保存标题、请求或opaque值的示例不应改为真实账号日志。

### 登录器v9：延续块、定时器与控制意图

**已执行/结果：** REA新增9函数，独立15指令锚点、Node200/200（新21）、3组独立全流程向量与Chrome6项通过。只输出离线字节/连接意图，没有执行原程序、VM、账号或官方连接；关闭意图不是实际资源关闭回执。[验收](../analysis/launcher-v9/validation.json)。

**可重复静态误读：** `411bb9`的69B非连续父栈延续块在伪代码里展开成自调用；实际普通提交JMP411bb9、重试标志为1再JMP41171b，不移植成递归。异常索引轮换不同于timer100；后者只清等待/关channel。原起点0的额外未取模`first-1`清理比较不能当完备路径证明。探索性反汇编起点41158b处于半条指令，已改到已知411594，只用正确边界作证明。[范围与限制](../analysis/launcher-v9/retry-independent.json)。

**最小控制规则：** 原SetTimer10000需消息分派，KillTimer不清已排队消息，局部可写循环也无明确截止；不把这些事实写成原程序可靠墙钟保证。新纯控制器显式单调时钟、总deadline和有限开启失败轮换，不Sleep、不重发已提交凭据；本地代次隔离陈旧事件、终包后残片拒绝、候选复制隔离。所有差异标为独立政策，不伪装原调度等价。

**清理与禁忌：** 新reply close可丢弃残片并保留原failed，取消不制造解析失败；错误step带当前正确关闭代次，私有请求/流/候选尽力清理，返回的副本由调用者管理。不得将代次写进协议、把连接意图当已连接、把profile/selected状态当认证/游戏ready，或用单调clock测试证明真实平台timer已适配。

**未决：** native EH类型/全部throw点、真实socket/CSPRNG/时钟/代码页、本地许可/记忆、服务会话及opaque生命周期、可信更新/回滚、游戏交接/官方兼容。本轮旧窗口/输入/VM/网络状态未重新观察，旧授权不因新离线控制器得到续用。

### 登录器v10：许可/字段清理与输入所有权

**已执行/结果：** 同601b…固定副本的许可消费者、MD564轮/长度/资源/页推进和两字段清空静态链；纯核心新增15项/总215 Node、23独立hashlib向量/4080个Node对照、Chrome6项通过。[验收](../analysis/launcher-v10/validation.json)。无原程序、VM、账号、真实条款接受、存储或官方连接动作。

**可重复问题与最小修复：** `Array.from`会服从自定义iterator，四false或空洞availability曾可能被当作可用；固定校验四个own索引。按可覆盖buffer/offset/byteLength建视图会截断子类隐藏的NUL或替换摘要输入；改为原生length预算先于内部TypedArray复制，并拒绝无内部槽的Proxy。两项复现及独立筛选回归已确认修复；新增负例保留。禁止通过类型名/可迭代性推定所有权或绕过字节预算。

**静态命名/流程禁忌：** `40bd50`虽被命名GetAllocLength，原字段+4及容量+8支持当前长度；不把分配容量带进MD5。四资源ID非零不证明已载入、显示或用户同意；新核心要求显式四页availability，三个advance后仍要独立决定，只给version5写入意图。原UserMode初始化/切换差异不得混同为磁盘账号持久化。兼容摘要不当成认证/安全更新信任。

**未决：** 实际页面/条款版本适用性与可信来源、代码页、INI/账号持久化、服务会话/opaque寿命、真实传输、可信更新/变换/回滚及游戏交接。本地accepted/recorded状态不升级为认证或官方兼容。未修改VM操作知识库中的当前执行点/授权记录。

### 登录器v11：ZIP描述符歧义与候选信任

**已执行：** 更新器62db…固定副本REA23函数/26记录、完整MD564轮/CRC表256项核对，离线解码器Node232/232和Chrome6项通过；真实ZIP/原EXE字节相同。[验收](../analysis/launcher-v11/validation.json)。无原执行/VM/账号/官方新请求或文件替换。

**可重复问题/修复：** descriptor不带可选签名且CRC=0x08074b50时，旧首word判断误选signed并拒绝合法数据。原创4B payload ac0a7ad5经Python zipfile确认；现在两种长度按central CRC/size分别匹配、16B先检查边界且要求唯一，12/16B精确复现及完整回归均通过。禁止用signature值替代CRC/size关系。

**原生误读：** MD5 transform非连续body中三字节缺口被入口JMP跳过；ESP+58临时复用不是新消息字。CFile虚调用的伪代码栈恢复部分错位，不照抄为ZIP schema。旧算法未知已由v11缩小，不据此补写上游清单/信任根。

**边界与禁忌：** 32MiB/64条目等是独立预算；完整raw流、实际长度/CRC/MD5都要检查。仅首中央条目payload已验证，其他仅metadata；opaque名字不能当输出路径。返回trust未验证/未替换，禁止把CRC/MD5相等或真实样本字节相同当可信下载/可安全执行，禁止沿用原未检查Delete/Copy或exit0作为成功回执。

**未决：** 可信清单/下载、原完整ZIP与异常行为、平台文件事务/回滚/重启、会话/传输及游戏联合交接。Pako3.0.2按固定registry完整性和原发行文件保存、许可保留；升级必须重核onStart/流消费与输出预算行为，不能因依赖可用就宣称手机/小程序或官方兼容。

### 登录器v12：文本归一化、预压实参与本地模块失败

**已执行：** 固定601b…主登录器REA新增19不同函数/24记录、专题26函数；清单/元数据13新测试、总245/245及Chrome最终6项通过。[验收](../analysis/launcher-v12/validation.json)。没有原程序、VM、账号、官方新请求或文件更新，VM当前执行点/授权记录未变。

**可重复误读与最小检查：** 4093a0虽标MakeLower，下游实际uppercase；4097a0虽标ReleaseAccessors，实际是CString长度/NUL。单字符空格→LF→CR边界修剪不能换成通用trim；主摘要cut32与XML超长仅log不可混用。两次提取的第二目标先压栈，按EBP槽和EAX回传追踪，不按伪代码变量顺序猜GameList/RegionList。40b158依赖父栈，不转写为递归。详见[消费绑定](../analysis/launcher-v12/manifest-bindings.json)。

**历史重建边界：** 66B XML摘要正文可由保留公开值重建且匹配当时完整SHA256；主摘要没有保留原正文，使用明确合成本地摘要进入XML分支。禁止把此结果写成当前HTTP状态、真实自更新或来源认证；metadata-current也不能替代XML解析和就绪条件。

**本地浏览器问题：** 首次按钮等待超时未产生通过结果，独立诊断出现4个ERR_CONNECTION_RESET；原服务存活、直接模块GET200。保留失败、核对服务后用新上下文复核最终6项/46回环GET通过，没有服务重启、产品修改或断言放宽。根因尚未确定；不能把日志读取或重试当已确认修复，不因一次失败重复启动已有服务。[失败记录](../analysis/launcher-v12/browser-first-failure.json)。

**未决/禁忌：** ASCII/六空白、预算、严格hex和正整数为独立有界政策；原locale、HTTP行为、atoi恶输入效果、实际下载/存储事务及可信来源仍需独立证据。进度分母不是已验证下载大小；locator保持opaque，解析成功不触发请求或执行。

### 登录器v13：总截止点、origin快照与浏览器传输事件

**已执行：** 固定601b…主登录器补证14函数/3短槽观察、14新+17旧字节锚点通过；GET薄适配总263 Node（新18）、Chrome原创服务6项及额外18次native/adapter对照通过。原程序/VM/账号/官方端点未操作，原离线页面CSP未改。[验收](../analysis/launcher-v13/validation.json)。

**可重复问题与最小修复：** 仅timer+race时，fetch同步阻塞30ms而timeout1ms仍可能成功；迟到抛错也会误报网络失败。现用单调绝对截止点覆盖成功、拒绝和最后副本，观察迟到拒绝Promise并丢弃迟到body；原精确复现及第17项独立复验通过。取消不能抢占JS，不能把HTTP_TIMEOUT当对端已关闭。origin数组getter可把初始16项增长至17，旧动态length循环会收纳新增origin；现固定初始校验长度，第18项及独立16+1精确复现通过。

**测试假设单列：** Node26允许透明AbortSignal Proxy通过宿主getter，不承诺普遍拒绝；原ZIP API为digestMatches，不能猜md5Verified后改产品迁就测试。两项只修正测试假设，不等同实现缺陷修复。[修正台账](../analysis/launcher-v13/test-review-corrections.json)。

**浏览器事件限制：** 两次合并smoke在bytes断言完成后分别出现binary/empty的CDP ERR_ABORTED，整次未计通过。独立native/native-signal/adapter ×三路由×有无拦截18次均无requestfailed；合并smoke增加networkidle排空观察后完整通过。根因未定，不能断言等待解决了产品或浏览器根因，也不能用字节成功抹去失败事件。[诊断](../analysis/launcher-v13/browser-transport-diagnostic.json)、[失败及最终记录](../analysis/launcher-v13/browser-smoke-investigation.json)。负例中的4条console消息/9次请求失败另按预期保留，不声称全程零错误。

**静态误读禁忌/未决：** QueryInfo的EDI/EAX返回保存与41aed9 JMP父栈延续按Listing解释；read+34/close+4c已证，不再保留为未知，但全EH/另一父对象、rtm/locale未闭合。原文本追加走strlen，新raw bytes、严格2xx及不跟随重定向均是独立政策。平台UI/存储事务、真实会话、官方CORS/来源信任、Safari/手机/小程序与游戏仍待继续；不改VM知识库当前授权和执行点。

### 登录器v14：无返回分支不等于无错误，缓存提交须区分完成点

**已执行：** REA补入6函数/239记录，31静态锚点；初始化prepare、公开raw MD5、整pair校验与浏览器候选缓存实现，Node285/Chrome原生12项通过。未执行原程序、写原文件、操作VM/账号或访问官方端点。[验收](../analysis/launcher-v14/validation.json)。

**可重复误读/最小检查：** 原主函数Delete/Open/Write/Close之后没有返回值条件分支，但CFile Write/短写和Close失败可抛CFileException；补查callee后必须区分异常和普通返回。Open3001算出OPEN_ALWAYS，不是必截断。原路径Game写闭后Region下载失败会退出、两个分支结束后才统一parse，局部未见pair回滚；这是静态可达推论，不能把它写成已经复现的磁盘半更新或全程序无恢复。[producer](../analysis/launcher-v14/catalog-producer.json)。

**新独立政策与验证：** prepare先快照输入，按self优先/变化顺序GET，每份hash和整pair显式decode/XML都通过才产生候选，不自动commit。缓存另以期望revision在一个record事务中整体put；真实Chrome验证注入写失败、put后abort、CAS与读回旧pair。期望revision也要在异步前快照，不能被调用者后续改值绕过冲突。

**提交/取消禁忌：** request成功不等于事务已提交，只在complete确认；相反，complete已发生后的取消不能再报“已回滚”。原生complete事件内的晚取消测试确认committed/cancellationTooLate，事务中止前后语义分开。新页重载恢复revision5已验；断电、磁盘持久性、所有blocked/崩溃场景及原生文件事务未验。坏记录/schema拒绝，不静默当空库或删除未知数据。

**未决：** 实际UI接线、官方CORS/来源信任、完整EH/原生替换回滚、真实条款/账号/会话、Safari/手机/小程序和游戏。缓存profile/schema/revision是本地bookkeeping，不发到游戏协议、不作认证；只在原创临时上下文验收，未存真实或官方材料。独立只读19项复核未运行IDB，浏览器证据由父线程提供；VM当前执行点和授权记录未变。

### stage94补充：临时策略、自动换版与普通输入恢复

- **执行与策略：** 当次RemoteSigned具体回复已收到；独立Verify/Install/Observe/Restore各一次，四进程结束后Get-ExecutionPolicy -List五scope Undefined、有效Restricted。不是持久降低策略，不能复用此次单次Observe额度；固定脚本和介质hash未改。[策略回读](../analysis/launcher-current-runtime-v4/policy-after.json)。
- **换版后的恢复停止：** early observation仍是71180e5b…，后来guest EXE已是1666048B/6d459ddbdf…；Restore以MOLI_UNRECOGNIZED_CURRENT_EXE停止，未写restored回执、未覆盖或重试。最小后续为只读hash/源包核对，确与新公开载荷相同；保留新文件与四备份。禁忌：放松guard、据原parent退出0宣称全部更新成功、把最初文件身份套给后续主窗口，或宣称全VM/应用恢复。[停止点](../analysis/launcher-current-runtime-v4/restore-stopped.json)、[独立新样本](../analysis/launcher-current-runtime-v4/new-candidate.json)。
- **Tools与输入：** 新鲜画面是既存倒计时→重装34%→Welcome→桌面，主机版本26.3.3/57507；未选Restart/Reinstall，发起者未知。普通窗口下安全空白点击及Ctrl+Escape、每个新终端核“英”后短命令成功；不能证明单个动作是根因。typeText可能迟到，必须读完整命令再Return，不因前缀画面重发或跨对话连续按键。[当前观察](../analysis/launcher-current-runtime-v4/access-preflight.json)。
- **分层验收：** 桌面/普通输入/CD九hash与Windows5.1脚本已实际验；正常首屏/普通退出已观察；原生快照恢复、自动子进程完整生命周期/ACK、游戏和官方兼容未验。保留现有网络/共享/Win7配置，没有强杀/重启/全局安全变化。

### stage95补充：当前锁屏、构建身份差异与 journal 阶段

本轮CUA在getApp读取桌面前即报告Mac locked，未发来宾命令或重新运行已消费的四模式脚本；仅发一次正常人工解锁请求。stage94桌面和文件记录不能视作本轮已验证状态，解锁后先只读固定目标/事务状态，不直接Restore或重新启动。[访问记录](../analysis/launcher-update-recovery-v1/access-observation.json)。

同大小/不同hash必须先完整比对：此次26B差异全部是COFF/debug时间戳与RSDS GUID，18已分析函数体及所有其他字节相同。新身份REA与源锚点已保留，不据hash差异重复所有工作，也不从源码相同推定运行/外部身份检查相同。[源比对](../analysis/launcher-update-recovery-v1/byte-comparison.json)。

16B journal头只有已记录stage及XOR一致性。stage5不能证明实际ACK、文件状态或完整恢复；解析API要求精确header，与原生只读前16B的尾随差异明确。禁忌为用解析成功触发文件清理/覆盖、把缺失/读取失败映射stage0、把XOR当认证。实际guest journal未读，原生故障矩阵与游戏仍待验。[接口与验收](../analysis/launcher-update-recovery-v1/validation.json)。
