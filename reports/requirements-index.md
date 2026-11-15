## 游戏页离页和在途资源读取

X03–X06 和 X08 沿同一 UC-P07/P09/P11/P14 用例覆盖活动读错误、正常导航和迟到缓冲。现有 Safari 模拟器核过同源替换导航，移动设备的后退、系统离页、长后台与持久化恢复由 D5 继续验收。 [已测范围和接受用例](network-portability.md#safari-navigation-resource-read)

## 固定 Item 第二套窗口的共同准入

G12、G18、G19 和 X02 复用十二个登记对活动首参的消费。OS-A26、WK-T27、SF-A28 保留实际外层调用与新旧窗口次序，分别验证预览、配对关闭和回页。缺失来源仍沿 OS-U1、WK-U1、SF-U1。 [候选结论和条件](game-static.md#item-alternate-dispatch-candidates)

## 固定 SE 的两种战斗技能列表

B01、B02、G18 与 X02 共用窗 10 的行发布、按行资格、角色 MP、选择反馈及退役规则。D0/D3/D4 沿 BF-D1 用同一组用例核普通宠物及骑乘，沿现有目标与回包用例验选中后的结果。 [原版规格与验收范围](game-static.md#fixed-se-battle-skill-list-admission)

## 固定 F5A 登录入口的 A1 归属

L03、L05–L08、X01、X07、X08 的所选入口共用八行消息和一个启动虚槽。UF-T12、UF-T13、UF-T16 沿自更新的接管和新启动确认，GP-U01、GP-U03 沿补丁制品和退出结果，LS-U3 沿实际投递和提示重入，L07/X07 沿当前同版游戏读取。 [操作和原需求引用](launcher-static.md#fixed-f5a-entry-business-admission)

## 固定 SE 收包入口的 A1 归属

X01、X08 将 37 个所选根核对到报文、直接分派及原需求。35 个按场景、角色、物品、工作、社交、战斗结果和本地提示等已有操作交接。`W(y` 的地址文本提示沿 G01、G15、X02、X06 共用文案及会话范围用例。`Kh>` 继续追踪状态读者，`Ok?` 继续核对具名业务触发。 [入口与现有用例](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/receive_operation_admission)

两版 `W(y` 的显示及保留规则共用，D0/D2 接收一个已解码文字字段，D5 用同进程重开和冷启动区分状态寿命。 [地址提示与验收](game-static.md#legacy-address-notice-retention)

`Ok?` 和 `Kh>` 沿 X01/X08 复用同一解码目录。D0/D2 与 D5 对照完整首整数、低字边界、入场归零和本地提示。实际业务配对及 16 位读者仍等具名来源。 [两条消息的复用规格](game-static.md#legacy-unassigned-receive-outcomes)

## 固定 SE 发送入口的 A1 归属

G01、X01、X08 将 17 个所选发送根接回移动、物品、技能、社交和窗口操作。G05/G07 的昵称相同、改动和需转义用例共用 `.>3`，D3 按经典和第二套窗口提供各自已证的文字准备。交易、称号及 `/1I` 沿原操作用例。 [完整发送台账](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/send_operation_admission)

## 固定 SE 经典控件后回调的 A1 归属

X01、X02、X08 将 20 个回调及 24 个登记接回原窗口和业务。G09、G13、G16 共用旧偏移读回、控件参与和下一轮刷新用例。制造、人物、邮件、设置及战后结果沿各自帧入口，复用相同的窗口遍历条件。 [回调和业务引用](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_post_control_frames)

## 固定 SE 经典构造与控件前回调的 A1 归属

X01、X02、X08 核对 41 个构造与控件前回调及其 42 个登记。场景、人物、工作和战斗引用共用对象发布与当轮参与规则。D0/D3/D4 沿实际构造、已有窗口和嵌套创建，用已证模式检查同轮的刷新、退役标记和后续控件。 [登记与待证操作](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_pre_control_callbacks)

## 固定 SE 经典析构回调的 A1 归属

X01、X02、X08 将 18 个登记接回共用退役规则。G05/G10 的人物与外观、G09/G13 的用物与设置、G18 的工艺、G16/G17/G20 的家族兽、留言与迷你邮件各复用原业务规格。按现有用例核对关闭后的记录、占用和重开。 [登记及业务规格](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_destructor_callbacks)

## 固定 SE 经典工作控件的 A1 归属

G18 与 G09 共用技能、材料、刻印和占用，B01 复用技能页的选择及略过入口，X01、X02、X08 沿 27 个函数和 43 项控件登记对账。沿 WK-T02、WK-T07 至 WK-T08 与 WK-T17 至 WK-T19 核滚动、费用、材料和回到上一步。 [规则与验收归属](game-static.md#fixed-se-classic-work-controls)

## 固定 SE 的删除确认、黑名单和日志 A1 归属

G14、G16、G20 沿已有名片、家族和迷你邮件删除用例共享窗 47 的确认顺序。G15 核对 End、F9、本地名单操作及按日期查看日志。X01、X02、X08 记录 28 个待定控件和两处共用关闭。 [原入口和验收用例](game-static.md#fixed-se-classic-modal-blacklist-log)

## 固定 SE 经典名单控件的 A1 归属

G14、G16、G20 共用三行和九行的活动名单及窗口规则。41 处待定登记接到排序、布局、滚动、当前目标及相关窗口。D0/D3/D5 沿 SF-A09、SF-A10 和既有写信、群发、称号用例验证。 [窗 21 与应用条件](game-static.md#fixed-se-classic-contact-list-controls)

## 固定 SE 经典家族编辑的 A1 归属

G14、G16、X01、X02、X08 将家族详窗和称号窗的 33 处待定登记与 35 处运行绑定归入现有权限、编辑及成员操作。D0/D3/D5 沿 SF-A16、SF-A19、SF-A20 核权限变化、批量预检、选中成员身份及关闭重开。 [家族详窗和验收](game-static.md#fixed-se-classic-family-edit-controls)

## 固定 SE 家族兽与饲料箱的 A1 归属

G09、G13、G16、X01、X02、X08 将两个窗口的 14 个待定控件接到各自操作。D0/D3/D5 沿 SF-A21 至 SF-A23 核选中、数量、权限、过渡和退出。 [控件与业务条件](game-static.md#fixed-se-classic-family-pet-feed-controls)

## 固定 SE 银行与交易控件的 A1 归属

G09、G13、X01、X02、X08 将银行与交易的 23 处待定登记接到页签、物品和宠物槽、金额、确认和撤回。D0/D3/D5 沿 OS-A27、OS-A28、SW-AC7、SW-AC8、SW-AC12 共用数量、刷新和结果验收。 [控件及业务规则](game-static.md#fixed-se-classic-bank-trade-controls)

## 固定 SE 写信、附件与群发控件的 A1 归属

G09、G14、G16、G20、X02、X08 将三扇窗口的 30 处控件登记接到正文进入附件窗、投递宠物、物品占用、收件映射及群发滚动。D0/D3/D5 沿 MAIL-CASE-45 至 MAIL-CASE-47 共用草稿、实际退役和短名单用例。 [控件及验收条件](game-static.md#fixed-se-classic-mail-compose-controls)

## 固定 SE 战后、邮件和工艺的 A1 归属

战后窗、邮件重开和工艺槽交换的 39 处所选登记现已对应原根和调用，后续复用 ST-01、ST-04、ST-05、MAIL-CASE-41 至 MAIL-CASE-44、WK-T08 和 WK-T23。两条第二套窗登记保留普通分派条件，邮件服务结果沿 MM-R1，战后结果和当前同版沿原验收需求。 [入口和用例](game-static.md#fixed-se-entry-business-admission)

## G06、G08 与 X03–X05 的资源换版占用

图形、音频和三个目标宿主共用在途读取、候选准备、关闭和排空规则。D0/D5 沿 UC-P06 至 UC-P09 复用原归档、图形、音频及存储。G08 与 X04 沿 UC-P13、UC-P14、AF-T10 至 AF-T12 核触摸准入、声部退役、迟到读归还和宿主关闭。UH-U01/U02/U04 继续验收联合峰值、实际持久发布及设备预算。 [需求与复刻用例](architecture-and-milestones.md#resource-budget-retirement) · [移动 Safari 实测](validation.md#mobile-safari-audio-lifecycle-validation)

G06、G08、X03 与 X04 已补同一根的联合场景用例。D0/D5 验角色和调色的复访读量、同源音效的不同输出缓冲，以及关停后迟到图块清理。 [联合场景用例](architecture-and-milestones.md#real-map-mixed-resource-budget)

G06 与 X03 共用 PR-F06 的坐标别名及资源根占用规则。D0/D5 以同一组实际 ZIP、A/B/A 别名和两根并存用例核对最终组、附件覆盖、持有字节和关闭。 [原版规则](game-static.md#animation-coordinate-alias) · [用例与回执](validation.md#animation-coordinate-sharing-validation)

G06 与 X03 的启动及首读共用主组缺失、可选组索引覆盖、坐标索引降级和失败候选释放用例。L07 沿同一个必要文件准备边界收取结果，同版游戏交接继续按其原依据验收。 [原版与现有差异](game-static.md#animation-load-and-first-lookup)

## G09、G13 与 X02 的堆叠数量框偏好

背包、交易、仓储及两套设置共用所选的数量框准入。D0 在现有输入与设置入口维护一份偏好，D3 按各业务窗口使用当前端点、数量和对应直接移动参数。D5 共用两档点击、取消和保存重开的用例。WK-U1 与 OS-A26 继续核技能、工作及训练的实际窗口活动。 [原规格与验收](game-static.md#fixed-se-stack-quantity-input-preference)

另一套背包数量窗已核打开时保存槽号、鼠标确认先于本帧夹限，以及返回和实际退役各自的焦点规则。沿 SW-AC9 和 OS-A01 补库存下调、目标填充、换位和新一次开框。共享发送继续复用。 [来源与用例](game-static.md#fixed-se-alternate-inventory-quantity)

## X04、X05 与 X06 的游戏页暂停和退役

桌面 Chrome 的普通标签页和移动 Safari 模拟器都已核到短时隐藏期间同一连接收包，以及后台 EOF 后重新入场。微信按实际 Page/App 事件核对关闭旧会话与重选，持续来源和完整读回沿 X03。D0/D5 共用 UC-P09、UC-P11、UC-P14 的迟到读、远端 EOF、恢复及新会话用例。微信 SDK 成功建连和设备验收继续沿原需求。 [逐端证据和归属](network-portability.md#target-game-page-lifecycle)

## X01、X02、G14 与 G20 的固定邮件入口

固定 SE 的经典窗口、邮件或名片收包与另一套窗口表共 30 条入口已经对应原操作。D0/D3 沿 MAIL-06、MAIL-08、MAIL-17 至 MAIL-23 的既有用例核草稿、选择、发送和收起。另一套窗口实际帧分派继续沿 EA-U2，邮件最终投递与附件结算沿 MM-R1。 [来源归属与待验证条件](game-static.md#fixed-se-mail-entry-admission)

G10、G20 与 X01、X02、G01、G07 共用经典窗 60–63 的目录查询、玩家资料、输入及发信规格。SC-T05 至 SC-T08、SC-T12 至 SC-T15 覆盖三类发布、选择、费用条件、取消、历史和退役。实际服务收费与投递仍归 MM-R1。 [当前实现差异和场景](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_classic_directory_mini_mail)

## 固定 SE 的出站格式与业务触发

X01 和 G01 引用同一份 18 条格式器与直接调用对照。G04 沿 D2 复用原普通移动。G10、G14、G16、G20 共用 `;JE` 编码，名单由 D3 沿 SF-A09 验证真实行和目标。G09 的另一套窗 79 与 G18 的计时通知沿各自物品及工艺操作接线。返选服、升级和战斗复用原用例。 [逐条归属](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_outgoing_admission) · [名单用例](../analysis/capability-first-v1/game-social-family-album-functional-specification.json#/classic_contact_detail_request/acceptance)

## 固定 SE 的工具栏和人物窗

X01、X02 共用工具栏切换与人物窗退役。G01、G05、G07、G10、G13、G14、G16、B01 引用同批资料与窗口分派。D2 沿原字段核点数、阵位和称号副本，D3 用 SF-A07、PR-A17 和人物窗新增分支核可见行、加点、阵位和关窗。现有组队、交易与家族规则继续由各业务所有者使用。 [需求映射和用例](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_classic_toolbar_status)

X01、X02、G01、G03、G05、G07 共用简介窗 58 和目录窗 59 的规格。D0/D2/D3 沿 PROFILE-A01 至 PROFILE-A08 核窗口返回、三类目录、四项草稿、公开次序及按角色恢复。X03 共用公共目录文件的长度与读回用例，G20 共用同一通知中的邮费显示和迷你历史方向比较值。 [简介操作](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_classic_player_profile) · [目录和迷你邮件用例](game-static.md#fixed-se-player-directory)

X01、X02、G01、G05、G07、G10、G14、G16、G20 共用查看他人简介的规格。四类查询沿 SF-A09 核对真实目标及服务回复。PROFILE-A09 至 PROFILE-A12 补 13 字段映射、目录图块、换行及收包和关窗交错。 [共用验收用例](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire/other_player_profile/proposed_acceptance)

X01、X02、G01、G05、G06、G10 共用 `CcL` 的来源与场景规则。CCL-A01 至 CCL-A05 覆盖分支字段、远端记录、特效终止、对象退役与三端呈现。沿 D2 和 D0 接现有世界及场景所有者。 [共用验收用例](../analysis/capability-first-v1/game-actor-functional-specification.json#/fixed_se_ccl_scene_publication/proposed_acceptance)

G09 的经典普通用物两级目标与 X01、X02、G01、G05、G10 共用回包、队伍及宠物、窗组和退役规则。D3、D0、D5 沿 SC-T01 至 SC-T04、SC-T09 至 SC-T11 核实槽交换、两级显示、确认、返回及作用范围。物品选物品和普通 NPC 操作仍沿其已有验收。 [能力映射与用例](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_item_target_menus)

G03、G05、G09、G18、X02 引用同一份窗 45/46 替换与退役规格。SC-T10、SC-T11 补资料刷新、取消和实际退役，SC-T16、SC-T17 补工作与用物切换及换场。 [来源与验收](game-static.md#fixed-se-item-target-retirement)

G03、G09、G18、X02 共用 WT-A02、SC-T17、GF-A10。核普通换图何时同步析构、待开窗如何推进及新地图何时允许重开。已有场景身份、工作选择和迟到校验可复用。D0/D2/D3 交接实际分派及业务占用。 [窗口队列和换图](game-static.md#fixed-se-classic-scene-window-queue)

X02、G03、G04 共用两版 GF-A10 的换图等待、当前地图补片与区域发布。GF-D3 沿已有组包、解码和地图所有者接状态，WT-A02、SC-T17 沿相同场景身份核旧业务退役及新操作重开。 [原版规则和实现差异](game-static.md#legacy-map-wait-patch-release)

G03、G05、X02 共用 GF-A18 的换场选路、快照与过渡帧，沿 GF-A10 和 WT-A02 复用补片及窗口初始化。用一组用例核空链、当前角色命中、两条回复同批分派、重建前后选路、有 ID 无身体，以及恢复普通帧。 [共享规格与取证边界](game-static.md#fixed-se-251-completion)

G03、G06 与 X02 在 GF-A10、PR-A12 共用普通过渡的条带、204 逻辑完成、外层呈现和下一轮普通输入。城市 14/15、普通 16/17 各按已核规则取当前活动画面的回执。 [规则与共同用例](game-static.md#fixed-se-ordinary-map-fades)

G01、G03、G04、X02 复用 MF-T03、MF-T07、MF-T11 核地图补片、两个地图模式、活动窗口重读及下一次移动续接。两版帧次序与当前按修订重建网格的差异沿 MF-D2/MF-D3。 [地图和移动规格](game-static.md#legacy-map-movement-refresh)

G04、X03 共用 MF-T01 与 MF-T03，核 `@Qu` 路径上下文、缓存头复用、消息文件和活动第三平面的身份及裁剪坐标，沿 MF-T07 验实际读写回执。 [文件布局与行为](game-static.md#legacy-map-cache-io)

G03、G04、X03 共用 MF-T02 核校验通知的活动 A、通知 B、原身份补取和匹配后的场景准备条件。 [两版校验规格](game-static.md#legacy-map-notice)

G03/G04 与 X02/X03/X06 共用 MF-T01 的目录、同进程重开和新实例用例。相关接线沿 D0/D2 的缓存归属、会话退役和再次入场。 [目录与回到选服](game-static.md#legacy-map-context-reentry)

L01、L08、X03–X05 共用首次配置期间的目录和启动准入、设置保存及重开。原行选择、设置键和文件内容沿对应来源，D0/D1/D5 复用 SS-A19、SS-A20、LP-A09 至 LP-A12 及 UC-P12。 [规格和已有端口](launcher-static.md#first-config-directory-composition)

## L02、L03、L07 与 L08 的候选列表和确认

固定 F5A 的状态 0 回复、排序与筛选、显示行映射和手动或预设确认共用一份规格。D1 复用回复解码和普通确认，D5 沿 LS-T15、LS-T17 核对失效选择和实际列表回执。当前同版游戏消费继续按 L07/X07 验收。 [来源和用例](launcher-static.md#f5a-profile-list-projection)

L02、L04、L08 共用固定 F5A 的置顶与取消置顶。D1 核对当前候选、设置回执、失败恢复和撤销状态。D5 复用候选列表及 LS-T17 核对实际选择、重开及确认。 [共同规格和用例](launcher-static.md#f5a-pin-publication)

同一组需求共用 F5A 的筛选、备注、移动和一次撤销。D1 验证各操作的写入和列表变化，D5 按 SP-C07 及 SO-C04 至 SO-C11 核对三端输入、重开、恢复和确认。 [候选规则和验收](launcher-static.md#f5a-candidate-management)

L03、L04、L08 沿 LS-T17、LS-T20 共用选服备注、迟到回复、取消、写入失败和成功重建的用例。实际消息送达与合资格的新绑定沿原 LS-U3 继续取证。 [所选来源及验收](launcher-static.md#f5a-note-modal-admission)

## L01、L06、L07 与 L08 的文件前检

11 月版的目录选择、仅刷新、普通启动、首次配置及补丁共用一份路径来源。D1 按所选操作验收文件角色、错误码、写入回执与缓存发布。D5 复用 LP-A04、LP-A09 至 LP-A12、GP-T03 和 PR-A10，核对文件缺失、API 结果及继续启动的条件。GP-U01 与 L07/X07 仍需实际制品和游戏证据。 [共享规格](launcher-static.md#f5a-path-preflight)

## L05 自更新与 L03、L06、L07、L08 的准入

固定 F5A 的排队登录、游戏补丁和游戏创建共用自更新待接管条件。D1/D5 复用 UF-T12、UF-T13 和 UF-T16，验收关闭请求、实际退役、新启动确认、提交读回和恢复。L07/X07 的同版游戏交接继续沿原需求取证。 [共享规格](launcher-static.md#f5a-update-handoff-and-ack)

L05、L08、X03、X04 与 X05 共用活动版本、旧读者退役、按更新编号查询历史提交和新启动确认。D0/D1/D5 沿 UH-T11 至 UH-T13、UH-T17、UH-T18、UH-T23 和 UH-T24 核对槽位复用、迟到确认、旧根回收和重开。浏览器夹具和微信本机双槽对照已核，实际产品与 SDK 的组合用例仍待执行。 [共同规格与验证](architecture-and-milestones.md#portable-update-handoff-readback)

L05、L08、X03 与 X05 已对照微信基础库 3.18.0 的两次 App 启动。相同版本号与内容的重建用存储代际区分，发布和启动继续按同一个活动提交决议。UH-T11、UH-T15、UH-T17、UH-T18、UH-T23 和 UH-T25 共用两槽、历史读回与晚到回执用例。L08、X03、X05 的原创小型夹具另经独立工具进程重开。D0/D1/D5 继续验产品端口、异常退出、完整素材和真机，X08 沿原需求复核覆盖。 [历史规格](architecture-and-milestones.md#wechat-publication-history) · [正常进程重开](architecture-and-milestones.md#wechat-devtools-process-reopen)

## 收包、角色切换与断线恢复

G01、G02、G03、G19、G20、X02 和 X06 共用两版接收错误当轮、下一轮提示、选角发布和按槽写入的规格。CF-A09、CF-A12、CF-A15、GF-A19 与 SF-A29 复用同一事件顺序。邮件结果和附件结算继续按 MM-R1 验证。 [共用规格](game-static.md#legacy-receive-retirement-order)

G01、G03、B01、B04 与 X02 共用 `Ta>` 标签、恢复计时及经典 39 的生命周期。D0/D2/D3/D4 沿 GF-A11、GF-A18 与原窗口用例核过渡、同步回退、到期标记及实际退役。第二套窗口的帧回调及当前同版继续核验。 [规则与用例](game-static.md#legacy-scene-label-window)

## B02、B03 与 X02 的护卫返程和退役

BF-D7 与 BF-T36 共用固定 SE 的两次测距、按当前槽交接、动作 23 延迟、飞行物摘链及角色 216。D4 复用现有身体队列和距离计算，核对 19、20、59、60 的边界、同槽顺序和独立护卫各自的结果。实际等待恢复、角色替换和当前同版继续验收。 [护卫返程](game-static.md#battle-266-return-order) · [退役与结果](game-static.md#battle-266-relay-retirement)

B02、B03 与 X02 共用 BF-D7、BF-T36。D0/D4 按相邻帧清理准入、前序命令等待和同帧写入次序核对 404 的三字、405 的附件及 266 的普通与自身结果。跨帧继承沿具名中间回调继续核验。 [同帧调度](game-static.md#battle-266-same-frame-producers) · [相邻帧规格](game-static.md#battle-266-adjacent-frame)

B01、B02、B03 与 G08 共用所选曲目配置保存和入战清除的时序。BF-T36 核编码、接收清零和 404、405 的逐字写入。普通地图旧请求止于 `10/0` 的首次捕获，含此前已经保存、声音延后启用及捕获时直接清除的用例。 [编码范围](game-static.md#battle-266-audio-map-save) · [入战顺序与用例](game-static.md#battle-entry-audio-request)

G01、X06、B02 与 B03 共用固定 SE 的长接收、拆帧及余留处理。D0/D2 用 CF-D3 验组成完整记录、无效起始标记与当轮重查，D4 用 BF-T36 验三个区间的写入和战斗队列首读。 [共用来源及用例](game-static.md#battle-266-long-receive)

对象排序、绘制与所选键盘输出的地址已归同一 BF-T36。活动输入法复用 X02 的组合串、候选与两频道规则。按真实帧核回调、接收清零、普通第四格和自身附件的逐字来源。 [相邻帧写入](game-static.md#battle-266-frame-intervening-writes) · [组合与候选](game-static.md#battle-266-ime-presentation)

B02、B03 与 X02 共用宿主时间采样、分钟缓存和日期写入。D0 沿已有游戏秒数和基准，D4 按 BF-T36 使用相邻帧已核范围。 [日期投影与验收](game-static.md#battle-266-host-calendar)

B02/B03 的 105、106 复用 BF-D7、BF-T35、BF-T36。沿实际优先级核对分身创建后首帧、游标递增及清零、非反射读取和反射原角色查找。实际原版访问与恢复继续验收。 [条件与验收用例](game-static.md#battle-105-106-callback-order)

## G11、X01 与 X02 的报价行操作

OS-O40 与 OS-O47 共用窗口 53 的运行控件、报价行位置和操作退役规则。已将 12 处登记、模式回调替换及窗口池退役接回 A1，X08 沿原台账追溯。D0/D3 复用原 OS-D6，D5 沿 OS-A18、OS-A20 和 OS-A21 验收出售、鉴定和修理的换位、确认、撤选与关闭。 [来源与用例](game-static.md#fixed-se-shop-entry-admission)

G11、B02、B03 与 X02 共用报价取消的当前槽绑定及刷新次序。出售、鉴定、修理沿 OS-D6 和原用例复用同一显示映射，BF-T36 引用局部写入范围。下一次合资格绘制、空槽、替换及迟到取消沿同一套用例核对。 [共享规则](game-static.md#fixed-se-shop-retirement-refresh)

## G06 与 X02 的图形档位和重建

G06 与 X02 共用固定 SE、Item 的配置请求、表面准入、降档和呈现恢复规则。PR-A10 增补设备创建逐档尝试、创建设备后的直接回退、纹理探测及文件结果。原有提示、绘制、窗口退役和输入触发的重建用例共用图形所有者。实际设备输出、档位文件读取、覆盖来源和同版适用性继续取证。 [设备准备](game-static.md#legacy-render-device-preparation) · [呈现与恢复](game-static.md#legacy-render-presentation-recovery) · [输入触发重建](game-static.md#legacy-render-system-key-rebuild)

G06 与 X02 将两版新进程的首个 `3Ddevice:`、有符号低字节和覆盖顺序纳入 PR-A10。留存发行配置、配置器默认和命令尾共用一组冷启动输入。D0/D3 复用启动文本合并与图形所有者，D5 核配置文件打开失败、空读和重启。`update.dat` 的潜在读取及覆盖来源继续沿具名证据验证。 [启动规格和用例](game-static.md#legacy-render-startup-tier-input)

G06 与 X02 共用固定 SE 启动标识的选择、等待、素材打开及逻辑帧规则。D0/D2 沿 PR-D2 复用 CGP 和现有颜色运算，PR-A02、PR-A10 增补黑场、标识、跳过绘制和素材失败后继续。 [共用来源及用例](game-static.md#fixed-se-startup-palette-publication)

G03、G06 与 X02 共用固定 SE `Ta>` 的调色消费和时段跟随。D0/D2 复用已有标签、日历、颜色及场景所有者，沿 GF-A10、PR-A09、PR-A12 核地图显式色、恢复默认、内层捕获和外层提交。 [共用调色规格](game-static.md#fixed-se-scene-palette-follow)

G06 与 X02 共用固定 SE 的默认、命名和内嵌色表。PR-A09 与 PR-A10 复用同一 RD 索引输入，按来源和位深核颜色、透明、缓存标签及延期补色。 [默认表](game-static.md#fixed-se-palette-output-depth) · [显式表](game-static.md#fixed-se-explicit-palette-upload)

G06/X03 将 Item 的默认表、显式表和重建接入同一 PR-A09/A10。两版复用选择映射、块颜色标签和延期用例，按实际位深核 16 位保留项、24 位零规则、32 位旁表及呈现回执。 [Item 默认表](game-static.md#fixed-item-palette-output-depth) · [显式色与缓存](game-static.md#fixed-item-explicit-palette-upload)

## L05、L08、X01 与 X03–X05 的启动绑定

启动回执沿现有字段绑定实际加载的构建、配置、资源所有者和活动发布。UH-T20 至 UH-T25 增补入口加载失败、准备不匹配、旧导航回调、幂等读回及与新发布竞争。产品发布及实际小程序代码更新归原 UH-U03，网页和移动网页复用同一份规格。 [共用规则](architecture-and-milestones.md#portable-boot-entry-identity)

## L03、L06 与 L08 的补丁结果续接

L06 补入 F5A 退出 100 的所选条目发布和失效索引错误。L08 核对等待时的阶段 1、2、成功后的阶段 3 和托盘清理。L03 共用准备编号、待补丁位及任务槽的消费条件。实际回退制品、原版消息投递、三端运行和同版游戏交接继续验收。 [补丁完成规格](launcher-static.md#f5a-patch-completion)

L06 与 L08 共用两版备份命令、固定安装补丁器的最少参数及退出 102 重试规则。GP-U01 继续跟踪实际回退供应与进程身份。 [参数交接](launcher-static.md#installed-patcher-argument-handoff)

L06、L08 与 X03 共用同目录重试、实际备份错误、重选回执和新绑定准入。GP-T18 核重试及耗尽，LP-A09、LP-A12 和 UC-P12 核取消、未知保存及迟到结果。原三端和实际来源验收沿 D5/D6。 [共用规则](launcher-static.md#f5a-patch-retry-directory)

## G01、G03、X02 与 X06 的断线恢复

G01/X06 共用所选断线标记、收包暂停和连接退役规则。G03/X02 共用状态 11 的提示、槽位清理、一次性确认和返回状态 2。D0/D2 复用既有所有者，D6 继续验收当前同版和实际宿主。另一套窗口表的业务回调分派仍待取证。 [来源规格](game-static.md#legacy-item-disconnect-recovery)

## L01、L04、L07、L08 与 X01 的首次配置

固定 F5A 已将目录的 `ConfigEXE`、按账号和游戏的缓存、配置器观察及退出续接连成一条来源链。D0/D1 共用现有配置和进程所有者。D5 验收宿主调度、写回及实际返回，当前同版游戏消费沿 L07/X07 核验。 [首次配置规格](launcher-static.md#f5a-first-config)

所留配置器与 G06 共用一份设置文件规格。SS-A19、SS-A20 与 PR-A10 覆盖初始化写入后取消、已有文件取消、恢复默认后确认，以及文件异常和启动续接。实际配置器身份及三端实现按原批次验收。 [共用来源与用例](launcher-static.md#first-config-dialog-outcomes)

L01、L03、L06 与 L08 共用 F5A 的目录恢复规格。所选启动、补丁及准备失败按错误码开放重选，提示结果决定是否投递带条目与阶段的恢复请求。右键选择复用相同的目录校验与写入。D1/D5 分别验收恢复登录准备和列表刷新。实际提示、消息顺序与同版游戏读取继续按原范围核对。 [提示准入](launcher-static.md#f5a-recovery-prompt) · [目录恢复规格](launcher-static.md#f5a-directory-recovery)

L01、L03、L06 至 L08 与 X03 至 X05 共用目录选择、保存、读回和续接。D0/D1/D5 沿 LP-A09 至 LP-A12 核失败保持旧目录、同 Code 两行、迟到回执及重开。FR-U3 的其他宿主条件继续跟踪。 [共享规格](launcher-static.md#launcher-directory-host-handoff)

## L07 与 L08 的交接映射

L07/L08 补入 F5A 映射的同名复用、首次登记、错误 8 和两种退役。D1/D5 复用现有发布与对象所有者，D6 验收 Windows 创建、回调和当前同版游戏读取。 [映射规格](launcher-static.md#f5a-mapping-lifecycle)

L07 补入 F5A 映射数字的构造初值、所选状态 0 回复及 32 位调整。D1 可复用现有字节规则，按分发版保留显式 EXE 和数字来源。X07 继续核当前游戏读取。 [字段来源规格](launcher-static.md#f5a-handoff-number-origin)

L07 与 X01 共用 F5A 的标题字节规格及已安装 Windows 资源快照。七组 28 行及 26 个非空短名已有原始顺序和回执，D1 沿既有快照接口验收。F5A 实际 CRT 大小写环境及当前同版游戏读取仍待证。 [资源标题规格](launcher-static.md#f5a-resource-title-bytes) · [实际匹配行](launcher-static.md#windows-installed-resource-enumeration)

L04、L07 与 X01 已绑定 F5A 的默认初始化、普通构造器再次选择和标题线程表读取。D1 复用显式编码，按同一组来源用例验正常初值、建表失败、线程表保留及标题。登录表单仍按各自保存的 ANSI 字节验 16 字节。 [代码页及登录输入](launcher-static.md#f5a-normal-startup-locale-selection)

L03 与 L07 共用状态 0 回复的参数、忙态和停止准入。L08 共用普通确认。D1 先验收 `-6`、待关闭和正常更新，再覆盖零候选、唯一匹配、重名及候选无法映射到显示行。所选自动确认在本次交接数字写入后进入普通确认。 [回复准入](launcher-static.md#f5a-status-zero-admission) · [选择规格](launcher-static.md#f5a-result-selection)

L03/L07/L08 已核 F5A 的启动返回及下一次准备入口。D1/D5 共用托盘添加失败、窗口恢复、任务槽以及写入阶段 3 前后收到消息的验收条件。实际重绑和当前同版游戏消费继续取证。 [返回规格](launcher-static.md#f5a-start-return)

L03/L04/L08 共用 F5A 的普通预设准入与提交编号规则。通过应用前检才换编号，清除待处理位后仍保留本编号已尝试状态。D1/D5 验收根窗禁用、无效索引、回绕和旧编号迟到。 [编号来源与验收](launcher-static.md#f5a-preparation-generation)

## L06 与 L08 的安装声明和备份恢复

两份安装头及 IFPS 脚本已核。F5A 每次启动准备的备份属性、删除、复制、定时器及创建失败各有来源规则。D1 复用现有生命周期，实际回退制品和宿主接受继续按 GP-U01/U02。 [来源规格](launcher-static.md#f5a-installation-and-backup-preflight)

## G01 与 G02 的 Item 检查回包及升级输入

已核状态 7 的四段提示写入、`1^t/VKW` 的结果和待切换状态，以及状态 13 的 `5[B/WDM` 读写。类别 7 资料仍沿 CH-U1 补实际生产来源。D0/D2 可复用既有阶段和编码器合同。 [来源规格](game-static.md#legacy-item-upgrade-buffer-provenance)

G02/X02 已核 Item 在回包之后发布待切换状态。D0/D2 加入 `WDM` 发包前接纳、同轮后条覆盖和待切换覆盖的用例。 [升级结果规格](game-static.md#legacy-item-upgrade-result-flow)

G02、G03 与 X06 共用 Item 的提交队列规格。升级界面另按阶段核对等待窗和回包，继续沿 CH-U1 追类别 7 的有效资料来源。 [提交与等待规格](game-static.md#legacy-item-upgrade-submit)

G02 已核固定 Item 与 SE 的类别 7 空字串分支。D0/D2 用同一组用例验帧前的空字段、提交返回后的等待和实际回包。CH-U1 的发送时资料值与生产者仍待证。 [两版静态规格](game-static.md#legacy-upgrade-empty-material)

## G03、X02 的经典窗口恢复与战斗转换

固定 Item 的窗口捕获、析构、保存与重开由同一窗口规格维护。G03 按实际进入子状态验收，B01/B04 复用转换和等待条件，G12/G18/G19 复用窗口生命周期，G19/G20 接入已有缓存保存。沿 GF-A05、GF-A07、GF-A08、GF-A11、GF-A15、GF-A18 及原 SD 用例核对。 [来源与用例](game-static.md#legacy-item-classic-rebuild-modes)

固定 SE 的所选战斗确认与倒计时共用指令窗 26。B01、B02、B03 与 X02 共用关闭、等待、回放及回收的窗口规则。BF-D1 核合资格控件、当帧图文、拖放取消和文字焦点。BF-T36 引用同一份写入范围并核与 SKL266 首读同址的实际写入。 [窗口规则](game-static.md#battle-266-window-control-writes) · [输入退役](game-static.md#battle-266-window-input-retirement)

B01、B02、G07 和 X02 沿 BF-D1 共用两个技能模式、窗 10 的开关及回调、条目 12 的文字提交规则。D0/D4 共用按钮准入、技能序号重置、再绘制和模式 4 逃离的案例。 [规则与验收](game-static.md#fixed-se-battle-window-target-selection)

## X02、G12、G18 与 G19 的普通窗口槽位更新

两份历史样本的经典帧共用控件参与、输入消费和待退役规则。G12 的 OS-A24 增补原页有效再输入、只读报价列以及选栏后确认或取消。G18、G19 沿各自的工艺与图鉴用例复用帧顺序。另一套窗口仍沿 OS-A26、WK-T27 与 SF-A28 验实际准入。 [共用规则与训练规格](game-static.md#legacy-pet-training-controls)

两份历史样本的槽位查询、缓存切换和退役由 X02 共用。G12 的 OS-A26 核六个训练窗的预览所有权和模式清理，G18 的 WK-T27 核配对关闭，G19 的 SF-A28 核列表回页和详情保存。 [来源规格](game-static.md#alternate-window-selection-and-cleanup)

固定 Item 的键盘帧和主状态 11 已有另一套窗口管理的正向调用。复用固定 SE 的 End 请求规则，将 Item 的清槽、恢复和首次分配顺序纳入 D0/D3。同一管理器会处理训练、工艺或图鉴已有槽位，业务回调的实际分派及当前版适用性仍待。 [来源规格](game-static.md#legacy-item-normal-slot-producers) · [共用合同](../analysis/capability-first-v1/alternate-window-contract.json)

X02 已将固定 Item 的 15 处直接经典帧调用关联到主状态 9、10 的子状态。G12 与 G18 的经典窗共用创建、列表整理、输入值传递和退役规格，按窗口组区分训练消息的同步关闭范围。G19 另一套窗口的正常分派及各业务准入继续核对。 [经典窗口规则](game-static.md#legacy-item-classic-callback-order) · [分支规格](game-static.md#legacy-item-classic-frame-dispatch)

X02、G12、G18 和 G19 共用固定 Item 的开场对象更新、同步回退及活动槽规格。所选训练组先关闭同号活动窗再尝试创建，图鉴与工艺的同号重复创建复用活动窗。实际运行和另一套窗口的消费链继续验收。 [创建顺序](game-static.md#legacy-item-classic-open-transition)

G03、G12、G18、G19 和 X02 共用固定 Item `9/252` 的恢复帧规格。D0/D2/D3 验收同轮两次推进、绘制早返、第一遍请求或标记退役、工作上下文解除及状态发布。图鉴在 SF-A27 中复用当时的键位和活动槽条件。训练与工艺的实际入口仍按各自的来源核对。 [共用用例](game-static.md#legacy-item-double-window-frame)

G18 与 X02 共用 Item 工艺窗口的槽位规则。所选窗口 19 分支配对打开 29、30，返回时先更新主槽，后续非活动清理再关闭副槽。 [配对窗口规格](game-static.md#legacy-item-work-window-pair)

X02/G07 补入 Item 普通帧的长按阈值、绘制标记槽、排序和命中优先级。现有排序可复用，回调分派保留原待证项。 [帧末规格](game-static.md#legacy-item-frame-hit-selection)

## L07、G01 与 X01 的历史 Item 资源交接

固定 Item 已绑定配置合并、七组路径生成及六类加载入口。D0/D1 复用已有资源计划和有序参数行。Windows 安装目录返回的原序快照已通过 42 条历史路径对照，L07 继续核当前同版游戏接收。 [规格](game-static.md#legacy-item-resource-handoff) · [实际枚举输入](validation.md#windows-installed-resource-enumeration-validation)

L07/G02 已核固定 Item 的初始化、选服交接和 `Wb^` 类别回包。D0/D1 持有启动字段，D2 更新角色类别并保留升级资料来源条件。实际 Windows 生命周期、类别 7 资料及当前同版继续验收。 [读取和发布规格](game-static.md#legacy-item-startup-handoff)

## G06、G07 与 X03 的图形暂存及颜色缓存

固定 SE 已核缓存文件版本、三项来源时间和颜色表布局，以及四条共用暂存的输出集合。D0/D2 验收命中、失配重建、调色板准备顺序和绘制元数据。G06 的 PR-O25 与 X02 共用呈现返回、恢复请求和重建准入规则。必要非对齐尾部、实际设备和当前同版继续取证。 [暂存规格](game-static.md#legacy-graphics-scratch-provenance) · [后端及恢复规格](game-static.md#legacy-render-recovery-probe)

G06/X03 的 PR-O12 和 PR-O13 共用块覆盖、盖章和恢复规则。D0/D2 复用同一资源与帧所有者，D5 沿 PR-A05、PR-A06 验零块、部分块、完整块、清链重分配及晚到结果。 [来源和用例](game-static.md#legacy-graphics-partial-cache)

G06/X02/X03 共用颜色匹配、每次绘制的限额与捕获／重建准入。PR-A06、PR-A09、PR-A10 使用同一组有序块覆盖旧色绘制、下一次失配、无色表和实际设备失败。 [合成规格](game-static.md#legacy-graphics-deferred-upload)

G03/G06/X02/X03 共用过渡背景的捕获、重放与退役。PR-A11、PR-A12、GF-A10、GF-A11 分别覆盖共用临时面、普通换图和战斗回场，统一使用场景代次和成功呈现后恢复普通操作的用例。 [来源与共用用例](game-static.md#legacy-transition-background)

同四项能力在 PR-A10、PR-A12、GF-A10、GF-A11 共用过渡中的图形重建。用一次场景与呈现代次交接验普通和战斗重新捕获、原进度延续、失败回执及待帧交付。 [重建来源与用例](game-static.md#legacy-transition-graphics-rebuild)

## X05 与 X06 的微信 TCP 建连结果

基础库 3.18.0 的 TCP 方法和四组回调调用已核验。原生回环试次返回 `-4`，符合现有端点校验的同机私有地址试次返回 `STREAM_CONNECT`。实际字节收发、关闭和真机接受仍待。 [实测与适用范围](network-portability.md#wechat-devtools-local-tcp)

## L03、L06、L08 的关窗与补丁进程

固定 F5A 已核对普通菜单关窗、忙态 Stop、后续消息投递及子视图析构的进程句柄释放。对应原 LS-U3 和 GP-U03 的所选静态分支。实际投递、窗口销毁、补丁进程退出和回退制品仍待证，统一规格继续复核。 [来源规格](launcher-static.md#f5a-close-ownership)

L03/L08 共用 Windows 的拥有者提示实测。D1/D5 验收已排队消息的编号消费、模态禁用根窗和返回后恢复提交按钮。实际登录器的合法生产者及新旧绑定交接仍按 LS-U3 核对。 [宿主证据](launcher-static.md#windows-launcher-modal-dispatch)

L03、L08、X06 与 X08 共用 LS-T20 的错误提示、普通确认及新旧连接用例。两处 F5A 普通确认生产已核实际登记，检查主窗及根窗启用。实际消息送达、候选完成和连接退役仍沿 LS-U3。 [固定来源和用例](launcher-static.md#f5a-ordinary-input-idok)

## L02、L03、L08 与 X06 的候选解析和退役

固定 F5A 的普通提交已核到候选起点、单轮剩余次数、每候选期限、提交成功后的续期及取消时的前台引用释放。四项能力共用该规格。D0/D1 合并期限、迟到结果和连接退役用例，D5 沿真实宿主验收。 [来源规格](launcher-static.md#f5a-candidate-lifecycle)

C82 与 F5A 的提交准入、截止与普通退出确认已归入同一份会话规格。D0/D1 共用 LS-T06 到 LS-T08 的边界用例，D5 复用 LS-T19 到 LS-T21 的退役与关闭验收。实际计时器送达和提示中的新旧绑定继续核验。 [会话规格](../analysis/capability-first-v1/launcher-session-functional-specification.json#/login_timer_dispatch_and_exit)

L03、L08 与 X06 共用固定 F5A 的连接维护、同步回调和退役用例。LS-T20 覆盖提示中的维护准入、旧连接回执和替换连接的归属。实际提示期间的新绑定继续按同版和宿主证据验收。 [来源与范围](launcher-static.md#f5a-pump-retirement)

## G18 与 X02 的普通帧工作上下文

固定 Item 和 SE 的所选帧已补到期检查、配方重查与时间扣减的顺序。D0/D3 按剩余 1 毫秒归零用例验收。另一套窗口的实际分派及当前版本适用性仍待证，G18 和 X02 的完整规格继续复核。 [来源规格](game-static.md#legacy-work-context-frame-order) · [本机基线](validation.md#legacy-work-context-frame-order-validation)

G18 和 X02 已核固定 Item 经典工艺的普通入口。技能、等级、配方复用十行控件，配方回复按收到时的上下文写入指定槽。所选退役路径在外层计数归零且上下文启用时先处理解除和可能的重查，再清活动指针。原 WK-U1 继续跟踪另一套窗口。 [经典工艺规格](game-static.md#legacy-item-classic-work-recipe)

X01、X02、G18 和 B01 共用固定 SE 经典技能窗的 15 个登记位置。WK-T02 与 WK-T23 核普通输入、实际槽与分模式析构，BF-T07 核相同入口按战斗条件开窗。 [归属和共用用例](game-static.md#legacy-se-classic-work-entry)

G03、G12、G18 和 X02 共用固定 Item 的经典窗口重建规格。子状态 250 和 252 已核到保存活动标记、退役旧窗口、解除工作上下文和恢复请求。D0/D2/D3 共用窗口与工作上下文的用例。 [来源规格](game-static.md#legacy-item-classic-window-reentry)

G03、B01 与 X02 共用固定 Item 的窗口 1 恢复标记。D0/D2/D4 按普通动作、入场回复、延后恢复和表行退役的顺序验收。 [恢复标记](game-static.md#legacy-item-window-one-restore)

G01、G03、B01、B04 与 X02 已对齐两版战斗入场的动作 3、结果回包覆写、普通帧先后两个恢复入口。D0/D2/D3/D4 共用窗口 1 恢复和经典索引 39 过渡的条件用例。 [两版顺序](game-static.md#battle-window-restore-order)

## 登录器条件模板的需求归属

L01、L08、X01 的 CE-U1 已补两版资源内容及更新窗口的模板编号。实际赋值、加载或调用关联到魔力必要操作后，再确定具体能力规则。当前 19 项固定样本本域规格可复用，其余 21 项按原排程核对。 [条件模板核验](launcher-static.md#conditional-template-scope) · [能力矩阵](../analysis/capability-first-v1/capability-matrix.json)

## G02、G19、G20、X02 与 X03 的角色资料生命周期

历史 Item 的所选创建清当前角色槽，入场清两份邮件缓冲后按配置目录读回，再载入全局图鉴。摘要与详情经已核回包写当前槽。D0/D2/D3 共用角色、缓存和晚到事件用例，实际重入和当前同版继续验收。 [来源规格](game-static.md#legacy-item-album-mail-lifecycle)

G20、X02 和 X03 共用历史 Item 的来信入槽、未读分类、发件历史和保存次序。选中提交与服务端结果各有验收条件。MM-R1 仍需同版发送者结果或附件变化，G20 的完整规格继续复核。 [收发规格](game-static.md#legacy-item-mail-history)

## G19 的键盘注册、工具栏与回包重置（2026-11-11）

固定 Item 和 SE 的键盘表索引 9 都请求窗口 23。Item 已核图鉴按钮的启动登记、描述符和局部展开偏移，并按活动窗口在 23、24 间选择。三条物品回包可在槽匹配时恢复准入。G09、G19 与 X02 的 D0/D3 复用该状态规则。原 SF-U1 继续核普通帧调用，SF-A28 覆盖收起初值、展开、回退和按钮、键盘动作。原六组范围与 22 个操作保留，19 项本域规格就绪，G19 和统一门槛继续复核。

[图鉴工具栏](game-static.md#legacy-item-album-toolbar-and-slot-reset) · [按键匹配](game-static.md#legacy-item-album-key-registration) · [G19 规格](../analysis/capability-first-v1/game-social-family-album-functional-specification.json)

固定 SE 与 Item 的经典图鉴已核普通帧调用。G19 与 X02 共用 SF-A27，覆盖设置后同帧读取键位、按钮与快捷键依次读取活动槽、延后或同步创建，以及按当前 bank 选择或复用详情。窗口 23、24 的主循环准入继续沿 SF-U1 取证。 [来源与规格](game-static.md#legacy-se-classic-album-ingress)

X01、X02 与 G19 沿同一份入口规格登记固定 SE 经典工具栏、设置、列表和详情的 27 个位置。SF-D7 复用窗口帧与资料投影，SF-A27 核对活动槽、空记录、发现字节及关闭后偏移。 [入口与用例](game-static.md#legacy-classic-album-entry-admission)

<a id="launcher-startup-functional-specification"></a>

## 当前登录器补证：嵌套退出hook的安装与所选分支已成规（2026-11-11）

QH沿固定C82 App Init的正向OLE初始化调用补齐EA-F13：45C46F在所证mode/HRESULT条件下把45C570写入44FD1F所得对象+3c；alternate mode可返回1而不走本体setter。45A8A6实际以(1,1)调用，再在正常返回后投递退出消息，不能把所有nonzero初始化结果或quit请求当作资源/登录通道已退役。

所选45C502(1)先执行条件OleFlushClipboard、factory链遍历和先移除再虚槽0调用，然后跳过本地零参filter删除/COM-uninitialize分支。实际module flag、资源成员/间接效果保来源条件；不据所选代码报告必现重绑/死锁或完整Windows关闭接受。普通modal期间形成替换binding的合法producer/投递准入、LS-U3实际消息/销毁和Host drain仍待。

新增7必要完整native/477B，复用App Init与quit两完整体；9窗1679B/531指令核原PE，REA已导出关闭。形成9事实、2推导、5操作、3组开发差异和8项未执行接受案例。停止已答OLE/MFC库存扩张，仅沿原必要正向对象/producer或Host证据继续。

原40/81/37/10/6、owner/依赖/批次/profile及14端口62方法保持；19项固定来源本域规格就绪不变，L03/L06/L08及统一A1..A4不提升。产品仍stage306，本轮无产品修改、目标测试/构建、VM/SDK/网络/账号操作。原GP补丁五组与UH三端发布/恢复方案直接复用，先全部能力成规再按D0–D6开发。

原L03回复/取消/错误内的selected hook安装/consumer已回答；同项普通替换binding要求保留。没有新增OLE全库覆盖、任意全交错或修改原两版登录协议要求。

[quit hook合同](../analysis/capability-first-v1/launcher-quit-hook-contract.json) · [源核验](../build/analysis/launcher-quit-hook-v1/source-review.json) · [本轮核验](../build/analysis/launcher-quit-hook-v1/validation.json) · [原补丁规格](../analysis/capability-first-v1/launcher-game-patch-functional-specification.json)

<a id="launcher-exit-admission"></a>

## 退出准入与清理层次已成规，L03不提升（2026-11-10）

原L03八组/601b与c82f两来源、shared owner、L01/L02/L04/X06依赖和D1不变。EA对LR入口补About模板100/owner0、实际App主Frame正向写者、WM_CLOSE busy/deferred及fallback条件、外层/嵌套quit和通道slot0释放；8操作/16事实，不新增需求或线上字段。

原LS-U3保留：合法普通modal替换binding准入、必要quit callback安装/消费、真实宿主消息与销毁接受尚未完成。40/81/37/10/6、16本域就绪、L03=false及统一A1..A4=false保持，原25完整会话与EA八接受未执行。

[退出准入合同](../analysis/capability-first-v1/launcher-exit-admission-contract.json) · [源核验](../build/analysis/launcher-exit-admission-v1/source-review.json) · [既有端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-exit-admission-v1/validation.json)

<a id="launcher-callback-reentry"></a>

## L03必要回调要求细化，原范围不删减（2026-11-10）

原L03八组、601b/c82f两来源、shared owner、L01/L02/L04/X06依赖与D1批次保留。LR新增21源事实、10操作和9普通入口处置；已有LS-U1/LS-U2规则与原会话接受不改。当前仅LS-U3普通准入/销毁/消息序列未闭，不能用四个纯目标例或条件registry推导取消原要求。

原40能力/81登记/37历史要求/10消费者/6来源、16本域就绪不变。L03 specification_ready=false，所有能力发现/统一门槛及真实平台/官方接受仍未完成。

[回调入口合同](../analysis/capability-first-v1/launcher-callback-reentry-contract.json) · [源核验](../build/analysis/launcher-callback-reentry-v1/source-review.json) · [端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-callback-reentry-v1/validation.json)

<a id="launcher-legacy-failure"></a>

## LS-U1具名源frame闭合，不提升L03整项（2026-11-10）

原L03八组、601b/c82f两来源、shared owner、L01/L02/L04/X06依赖及D1批次不变。LE补齐typed匹配/保护区、普通throw与numeric return、stack槽和首序号/最后候选、正常失败/停止与直接UI尾部。LS-U1由LE选定覆盖，LS-U2由DM覆盖；current LS-U3的已获callback跨modal/替换保持。

原40能力/81登记/37历史要求/10消费者/6来源及16项本域就绪不变。其他异常/坏registry/无效随机ordinal及实际timer条件不能由所选静态frame充当接受，L03 specification_ready=false；原25完整案例与12补充案例未执行。

[旧版失败合同](../analysis/capability-first-v1/launcher-legacy-failure-contract.json) · [源核验](../build/analysis/launcher-legacy-failure-v1/source-review.json) · [纯目标对照](../build/analysis/launcher-legacy-failure-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-legacy-failure-v1/validation.json)

<a id="launcher-derived-material"></a>

## LS-U2所选普通材料语义关闭，L03原要求保持（2026-11-10）

原L03八组/两来源、原owner、L01/L02/L04/X06依赖和D1批次不变。LS-U2现在由DM选定覆盖：新建池或正常清理完成后的旧版零初态+partial prefix；current显式长度拒绝和state-gated发布。该闭合不移除LS-U1异常/重试、LS-U3普通callback准入、未完成清理/并发条件和真实平台/官方接受。

27原创纯模块例揭示7个旧版目标差异，源规则闭合不是实现完成。原40能力/81登记/37历史要求/10消费者/6来源及16项本域source-ready不变，L03整项specification_ready=false。

[材料合同](../analysis/capability-first-v1/launcher-derived-material-contract.json) · [来源核验](../build/analysis/launcher-derived-material-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-derived-material-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-derived-material-v1/validation.json)

<a id="launcher-session-functional-specification"></a>

## L03原八组与两原来源逐项追溯（2026-11-10）

原连接/挑战/提交/记录与消息分片/回复/取消/超时/错误，每组均保留601b与c82f两条操作。原shared owner、L01/L02/L04/X06依赖及D1批次不变；不借当前selected操作、882局部检查或源记录数替代两来源整项要求。

LS-U1旧版必要错误续体、LS-U2短材料方向缓冲、LS-U3conditional普通callback尾部仍待证；L03 specification_ready保持false。原40能力/81登记/37历史要求/10消费者/6来源与16项本域source-ready完整保留；SDK、三端、当前消费者和官方接受另列。

[双来源操作规格](../analysis/capability-first-v1/launcher-session-functional-specification.json) · [来源核验](../build/analysis/launcher-session-functional-specification-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-session-functional-specification-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-session-functional-specification-v1/validation.json)

<a id="wechat-sdk-host-probe-preparation"></a>

## WH只补工具准备，不提升原平台能力（2026-11-10）

原准备档案记录当时的工具状态。本机模拟器现已有文件、Canvas 和 Page 运行回执。 [原准备档案](../analysis/capability-first-v1/wechat-host-profile.json) · [本机模拟器实测](architecture-and-milestones.md#wechat-devtools-offline-sdk)

原X03资源/大文件预算、X05 Page与真实iOS/Android、X06原始流/桥接/取消后台范围、owner/依赖/批次/profile/登记不变。14端口、62方法及UC-T01..22完整原文保留；6组计划片段均未执行，完整case通过数0。其他37能力和40/81/37/10/6范围、已有16本域source-ready状态保持。

<a id="game-battle-functional-specification"></a>

## B01–B04原范围逐项映射与本域状态（2026-11-10）

[BF readiness](../analysis/capability-first-v1/game-battle-functional-specification.json)保留原owners、依赖、D4批次、game-legacy-37c4和全部原登记。B01原4组→20操作，B02原2组→37操作，B03原3组→18操作，B04原5组→16操作。24token/110class及10消费者原表完整保留，不按当前可运行子集删变体。

仅B01/B04本域规格提升；B02/B03因native foreign/fourth-scratch、role aliases、105 cursor等必要上下文保持false。原40能力/81登记/37历史全文/10消费者/6来源和其他能力状态保持；本域source-ready不表示依赖已整合或真实三端/当前同版接受，也不换算产品完成比例。

<a id="game-work-functional-specification"></a>

## G18六组原需求与两套窗口范围保持（2026-11-10）

[WK readiness](../analysis/capability-first-v1/game-work-functional-specification.json)逐项对应原“制造/装饰、鉴定/修理/刻印、两级目标、采集、直接技能、上下文和两套窗口”，关联60操作的适用子集。原四owner、G09/G10/X02依赖、D3批次、game-legacy-37c4及GAME-PLAYER-SKILL-INPUT-001登记不变。

两套已知回调/字段/换算/计时规则已成表；另一套实际活动/不活动分派及原需求准入未证，整项保持false。原40/81/37/10/6范围保留，G01/G03/G04/G05/G07/G08/G09/G10/G11/G13/G14/G15/G16/G17原本域source-ready不扩大，不能据此算产品完成率。

<a id="game-social-family-album-functional-specification"></a>

## G14/G16/G19原范围与SF就绪判定（2026-11-10）

[SF逐项对照](../analysis/capability-first-v1/game-social-family-album-functional-specification.json)保留原owners、依赖、D3批次、game-legacy-37c4和登记映射。G14原三组/24操作，G16原三组/26操作，G19原六组/22操作均有输入、规则、所有者和完成/失败/取消条件。

G14/G16仅固定来源本域规格就绪，依赖与实现/真实接受未提升。G19原需求明确含两套列表，另一套外层实际激活、page初始化/恢复及必要异常域仍缺证，保持false；21×15条件不擅自改22页。未准入家族分支保正向发现条件，不假定活动或删除范围。

当前G01/G03/G04/G05/G07/G08/G09/G10/G11/G13/G14/G15/G16/G17仅各自本域source-ready。L01–L08、G02/G06/G12/G18/G19/G20、B/X等原未决及统一A1..A4保持。40能力、81登记、37历史要求、10消费者和6来源未缩减；局部数目不换算完成率或三端/当前官方接受。

<a id="game-ordinary-services-functional-specification"></a>

## G09–G13原范围、局部就绪与未决（2026-11-10）

[OS逐项对照](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json)保留原owners、依赖、D3批次、game-legacy-37c4及登记映射；全部18组需求均有操作、源规则与完成/失败/取消条件。

| 能力 | 原范围组数 / 操作 | 固定来源本域规格 |
| --- | --- | --- |
| G09 背包、装备、用物与拾取 | 6 / 18 | 就绪；原依赖、实现与真实接受另核 |
| G10 角色交互、对话、图文与外观 | 4 / 14 | 就绪；A/B只保留有证源名称/键位，不猜业务名 |
| G11 商店、鉴修、兑换与给予 | 2 / 16 | 就绪；共享接收准入引用G10操作 |
| G12 NPC治疗、人物与宠物训练 | 3 / 14 | 固定 SE 与 Item 的普通十模式有来源，另一套实际激活及需求关联待证 |
| G13 玩家交易、银行与仓储 | 3 / 16 | 就绪；阶段/时钟/结算与独立政策分别列明 |

当前G01/G03/G04/G05/G07/G08/G09/G10/G11/G13/G15/G17仅各自固定来源本域就绪。L01–L08、G02/G06/G12/G20等保留原未决；40能力、81登记、37历史要求、10消费者组和6来源未缩减。统一A1..A4、原依赖整合、三端/当前同版/账号/官方接受均未通过；不按局部就绪数计算完成比例。

<a id="game-presentation-functional-specification"></a>

## G06五组、G07四组原范围与PR操作表（2026-11-10）

[PR readiness](../analysis/capability-first-v1/game-presentation-functional-specification.json)逐项保留G06“资源版本/文件家族、RD/CUT/AUT、动画、颜色/透明/加色、水面”和G07“字符编码、文本布局、姓名/值条/提示、地图投影”。原owner、依赖、D0/D2批次、四个G06注册项及固定37c4来源保持。

仅G07本域source-ready提升；G06原必要scratch/后端/版本条件未闭合，整域保持false。G01/G03/G04/G05/G07/G08/G15/G17各自本域就绪不等于完整产品或统一门槛。40能力、81登记、37历史要求、10消费者组和6来源未删减；真实平台、当前同版、账号与官方接受继续待证。

<a id="game-actor-functional-specification"></a>

## G05原六组需求的可实现规格（2026-11-10）

原“创建/更新/删除、动作、方向、附属对象、骑乘、姓名/状态”逐项映射[GA readiness](../analysis/capability-first-v1/game-actor-functional-specification.json)与42操作；原三个owner、G03/G06/X02依赖、D2批次、两个注册项及固定37c4来源保持。只提升G05本域source-ready，不提升依赖整合或完整接受。

原40/81/37/10/6范围保留。G01/G03/G04/G05/G08/G15/G17分别本域就绪，其余原能力、当前同版消费者、账号和真实平台接受继续各自审定。完整需求分析和统一A1..A4仍未通过；本域实现差异用GA-D1..7一次归入既有批次，不另建重复功能。

<a id="game-flow-functional-specification"></a>

## G03完整原范围的GF操作对照（2026-11-10）

原“初始主状态、普通地图、注销、服务端退出、回城与重建”分别映射[GF规格](../analysis/capability-first-v1/game-flow-functional-specification.json)的五个readiness行及33操作；原所有者、G01/G02/X02依赖、D2批次、固定37c4来源和5个注册协议项保持。G03本域source-ready提升，不提升任何依赖或完整接受。

G02升级材料来源、现行同版交接、真实平台/账号/官方接受继续待证；所选主1/主9/返回已有操作，不再保留“其他所有主/子状态未分析”的泛化缺口。必要上下文来自各原所有者，不默认零或猜业务名。原40/81/37/10/6范围不删减。

<a id="game-communication-functional-specification"></a>

## G01原六组功能规格就绪，保留原依赖和接受范围（2026-11-10）

[CF required_behavior_readiness](../analysis/capability-first-v1/game-communication-functional-specification.json)逐项对应原“资源就绪、摘要、启动首包、帧/正文/文字、收发队列、空闲维护”，并保留原owner、依赖、D2批次、固定37c4 profile和协议登记。33操作/5差异、141完整源及9个明确派生窗口/视图均可追溯；目录从最初60发送器加既有6后续格式对齐当前66，未借计数新增或删除能力。

仅G01固定来源本域ready=true。原40能力/81登记/37历史要求/10消费者/6来源不变，既有G04/G08/G15/G17就绪保留；L01–L08、G02/G20等仍false，统一A1..A4未通过。业务消费者语义、当前配对和真实三端/官方接受另按原范围，不被104/66或局部夹具代替。

<a id="launcher-config-path"></a>

## LF-U2选定来源关闭，原能力范围不缩减（2026-11-10）

[LP selected_supersession](../analysis/capability-first-v1/launcher-config-path-contract.json)绑定旧LF-U2/F03/C02节点及原哈希，补5条路径操作/8组事实。旧LF规格保持不可变，以下其“两子谓词内部待证”由LP覆盖；LF-U1当前消费者、LF-U3原多profile必要变体、LF-U4条件入口、LF-U5宿主接受保留。

L01/L06/L07/L08仅增加选定路径规则，不以17个函数代替原范围；L01–L08整体仍false。40能力、81登记、37历史要求、10消费者、6来源及owner/依赖/批次不变，G04/G08/G15/G17原本域就绪不扩大。

<a id="launcher-functional-specification"></a>

## L01–L08完整范围审定与来源对照（2026-11-10）

[登录器功能规格](../analysis/capability-first-v1/launcher-functional-specification.json)的original_capability_reviews逐项保留原范围、owner、依赖、D1/D5批次和全部原profile，关联19旧操作及8条新C82首次配置操作。关联代表相关选定规则，不代表整项覆盖；601b/C82/C7BA/旧游戏/现行未闭合/平台六身份不合并，关联updater/patcher保留各自哈希。

新增规则解决当前Config创建/轮询/退出/捕获字段/销毁的选定生产边，LO-U1已由MP处理；两个路径子谓词、必要正常组合、原跨来源审定及L07当前消费者仍保留。L01–L08全部ready=false；原40能力/81登记/37历史要求/10消费者组不删减，G04/G08/G15/G17原局部就绪不扩大。先全部能力规格及A1..A4，再共享能力批次开发；不以此次27操作计数给出完成百分比。

<a id="map-functional-specification"></a>

## G04原五组范围已逐项映射（2026-11-10）

原“地图/缓存、地形阻挡、点击逆投影、普通移动、位置修正”五组各有完整操作子集、源规则、结束/失败与依赖。G04/G08/G15/G17仅固定来源本域规格就绪，产品仍stage306；统一A1..A4、真实三端/现行同版和官方接受未完成。

原scope、owner、依赖、原批次、6协议关联与37全文/10消费者组/6来源保持。相邻A/B业务/必要回复、右键其它业务仍归原G09/G10/G14等完整范围；没有据本域ready删减。G02材料/G20最终关联仍未闭合。

[地图操作规格](../analysis/capability-first-v1/game-map-functional-specification.json) · [来源核验](../build/analysis/map-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/map-functional-specification-v1/validation.json)

<a id="audio-functional-specification"></a>

## G08原三组需求逐项成规（2026-11-10）

原“地图/选服/战斗音乐、事件音效、停止/切换/重复”逐项保留，分别关联34操作中的完整适用子集；源规则、依赖参数、结束/失败和8组开发差异可追溯。当前固定37c4本域规格ready为G08/G15/G17，不作为整体完成百分比。

原40能力、81登记、37历史全文、10消费者组、6来源及各owner/依赖/原批次保持。G02的四处提示串复制长度142/15/15/97，不能覆盖260字节外材料；仅排除此候选，G02/G20仍false。native数值上下文、GM和实际三端/同版接受没有被删减。

[音频操作规格](../analysis/capability-first-v1/game-audio-functional-specification.json) · [来源核验](../build/analysis/audio-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/audio-functional-specification-v1/validation.json)

<a id="browser-surface-observations"></a>

## 宿主事实不扩张或截短原能力（2026-11-10）

23940双字节/256单字节是固定表有限域比较，不能当原生ACP配置或全部文本需求关闭。两font样式、640×480画布、四PCM/六声道/单loop只覆盖所列原语；原40能力、81登记、37全文、10组、6源profile保持。

UC-T06/T12/T20新增局部证据及明确未覆盖部分，原22条完整端口/目标验收不提升。G15/G17局部规格就绪保持，G02材料/当前同版消费者、G20最终结果等仍按原要求保留。

[实测档案](../analysis/capability-first-v1/browser-surface-profile.json) · [来源与约束](../build/analysis/browser-surface-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-surface-conformance-v1/validation.json)

<a id="browser-host-observations"></a>

## 宿主原语与原22条完整验收分层（2026-11-10）

UC-T02/03/04/05/06/07/10/11/18/19/20已有局部宿主观察映射，逐条列出实际测试部分和剩余完整要求。原22条完整端口/目标用例没有被10组实验替代；其余域/依赖/profile及原37/10不变。

当前只证明指定Chrome的所选范围、事务、值复制、正常重启和CDP事件行为。完整业务/宿主/手机/微信/同版接受均保持原条件，不把viewport模拟或读取成功改写成游戏可游玩。

[宿主档案](../analysis/capability-first-v1/browser-host-profile.json) · [本轮约束](../build/analysis/browser-host-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-host-conformance-v1/validation.json)

<a id="required-entry-admission"></a>

## 入口角色与需求准入分开（2026-11-10）

原40能力、81登记、37全文、10消费者组、6profile保持。新增647行来源处置不增加647项功能；typed事实/赋值/上下文、source-anchor、历史candidate及文件级相关能力分别保留，未自动继承为完整业务语义。

11个登录器模板有同C82构造来源；296/30721/30734仅资源路径未闭，不删除也不据此加功能。实际另一套窗口激活、动态kind9业务归属、当前版本和最终结果仍具名待证；G15/G17局部ready与其他原标志保持。

[入口台账](../analysis/capability-first-v1/entry-admission.json) · [来源与规格](../build/analysis/required-entry-admission-v1/specification.json) · [本轮核验](../build/analysis/required-entry-admission-v1/validation.json)

<a id="required-context-contract"></a>

## 37/10原范围与A2台账分层（2026-11-10）

37条原文及10 required_behavior逐条hash/映射不变，47行处置保留其累积范围和所有实际条款；原primary mapping只作主题导航，不能缩成唯一范围。40能力/81异质登记/6profile与原所有者/依赖/批次/规格ready保持，G15/G17既有true不变，G20最终结果仍缺证。

源码已知、必要native context、已知实现差异与真实设备/当前官方接受分列。A2覆盖条件可审定不等于A1/A3/A4统一门槛通过；独立14端口合同也不自动提升任何业务规格或接受。原源/生成/产品历史本地结果保留时间与范围，本轮没有重跑或扩大成全原生/三端接受。

[共同接口合同](../analysis/capability-first-v1/shared-target-contract.json) · [47行范围复核](../build/analysis/required-context-contract-v1/reconciliation.json) · [本轮核验](../build/analysis/required-context-contract-v1/validation.json)

<a id="mail-operation-composition"></a>

## G20客户端操作成规，原最终结果要求保留（2026-11-10）

原“名片/家族/群组相关写信与回复、通信记录、普通/宠物投递及选择、发送/拒绝/结果、两bank/本地保存和关闭重入”完整保留。前49项客户端操作有规则与条件，第50项明确发送者最终投递/失败/拒收/撤销及附件结算仍缺同版关联；因此只标客户端操作规格就绪，G20整域仍未就绪。

原owners=[]、依赖G05/G09/G10/G14/X02、profile37c4与D3/登记映射均未改；现有通用字节/家族/所有者钩子是复用来源，不是完整邮件产品证明。40能力、81登记、37历史要求、10消费者组和6profile不缩减。旧选择/重置待办由本节承接，未知全局别名和未激活另一套布局保留正向发现条件。

G09、G20、X02 共用背包刷新后选择失效、已选附件及重开的预期。固定 SE 的普通选择按命中槽重置，三个邮件表单沿各自资格、保存槽、提交和析构处理。发送者最终结果与附件结算继续沿 MM-R1 取证。 [本次补充规格](game-static.md#legacy-se-mail-attachment-refresh)

G03、G09、X02 共用背包发布与入场清除规格。OS-O01/02 沿原 28 槽发布，OS-A01 增补 13 字段全量格式与终止尾组。GF-A05、GF-A07 共用地图、本机角色、全量背包以不同顺序到达的用例。 [原版入场与物品规则](game-static.md#legacy-full-inventory-publication)

G09、G18、X02 用同一组背包替换、清除和交换夹具。OS-A01 验发布，WK-T07 验材料控件和占用，WK-T08 验到期槽号、结果释放与重试。沿 WK-D4 交接 D0/D3。 [材料规则与用例](game-static.md#legacy-se-craft-inventory-selection)

G09、G13、X02 复用 OS-A01 的背包发布输入。OS-A27 验按钮和面板次序，OS-A28 验回包与退役，SW-AC7、SW-AC8、SW-AC12 覆盖已选物品的刷新、清除和换位。报价与本次资料变化按来源时点验收。 [完整用例](../analysis/capability-first-v1/game-trade-storage-contract.json#/inventory_confirmation/acceptance)

[邮件操作规格](../build/analysis/mail-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/mail-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/mail-operation-composition-v1/validation.json)

<a id="chat-operation-composition"></a>

## G15原范围功能规格就绪，接受状态另列（2026-11-10）

G15原“地图/小队/系统文字、黑名单、角色气泡和两路滚动公告”全部保留，36项操作覆盖提交/准入、发送/接收、过滤/文件、绘制/时钟、角色返回与应用终止。固定37c4局部功能规格就绪，不代表G05/G07依赖集成、产品实现或三端/现行官服接受。

原40能力、81登记、37历史复合要求、10消费者组和6profile均未缩减或重映射；只有G15的当前局部规格状态推进，G17既有true保留。8组源与现有实现差异进入原共享批次，534354新用户设置及未激活247byte片段仅在需求相关正向边出现时补证。旧段“G15操作尚待合表”由本节承接，不再作为重复任务。

[操作规格](../build/analysis/chat-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/chat-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/chat-operation-composition-v1/validation.json)

<a id="game-application-exit"></a>

## G15退出源问题与条件发现分开（2026-11-10）

G15原“地图/小队/系统文字、黑名单、角色气泡和两路滚动公告”不变。已补正常应用退出/CRT刷新链，区别程序日志、聊天文件与内存环/编辑历史；源写入/close的未检查结果仍不是落盘回执。

534354默认及图标/文字条件已有来源，实际用户设置入口未建立；配置发布保留条件发现，不新增该功能，也不删除今后正向发现。原输入→发送/接收→状态→绘制→返回/关闭的统一操作表与宿主时钟/I/O政策还须审定，G15整域未标规格就绪。

[退出规格](../build/analysis/game-application-exit-v1/specification.json) · [原件与来源](../build/analysis/game-application-exit-v1/source-views.json) · [本轮核验](../build/analysis/game-application-exit-v1/validation.json)

<a id="character-operation-composition"></a>

## G02五项原要求的当前判定（2026-11-10）

角色资料、创建确认、删除等待、升级/选项、选角入场均保留并有具体操作来源。外观转换和已知升级分支已有纯核心及网页/微信接线，不再把旧摘要当“全部待实现”。删除菜单先按原字段+32判定，零值走家族负责人警告；非零值确认后进入固定返回0的等待，不能制造删除请求或本地成功。

类别7升级会读取923C40材料，其生产/所有者仍为CH-U1。其它所选原始规则已成表，完整重置/持久化与预览、宿主输入/晚到差异归D0/D2；同版实际接受另验。G02局部规则推进，不提升整域specification_ready或全局门槛。

[操作规格](../build/analysis/character-operation-composition-v1/specification.json) · [已有源视图](../build/analysis/character-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/character-operation-composition-v1/validation.json)

<a id="capability-specification-audit"></a>

## 当前40项规格与剩余工作判定（2026-11-10）

40项原需求、依赖、所有者、来源profile和原注册/37复合/10消费者映射保持。每项已区分必要来源规则、操作/状态合成、宿主设计、实现差异、条件发现与外部接受；这些分类不是全部语义已经闭合。G17“列表/翻页、发帖、删除、刷新及关闭”的固定来源功能规格现已就绪，图形/输入等依赖整合与完整接受仍未完成。

G02删除的固定来源只到双确认后的等待：455820始终返回0，V)b是空处理，不能新增未证发送或把本地删除当服务端操作。G20的4E1CF0已有完整记录/六项写入，剩余是与选择器、角色/连接/bank的合成；发送者最终结算仍缺同版关联。

[当前逐能力审定](../build/analysis/capability-specification-audit-v1/specification.json) · [来源补充](../build/analysis/capability-specification-audit-v1/supplemental-source-views.json) · [本轮核验](../build/analysis/capability-specification-audit-v1/validation.json)

X03 与 X05 共用微信资源重开用例。固定 DevTools 的新进程已依原选择清单重开完整分段素材，受控缺第 2 段时只补选该段。D0/D5 沿同一入口接线，完整持久化来源与真机沿 UH-U02 验收。 [重开范围](architecture-and-milestones.md#wechat-sdk-segment-process-reopen)

X03–X06 共用内容摘要、原读者和发布身份。D0/D1/D5 沿同长错段、预算拒绝、真实排空和重开后的启动绑定验收。 [三端共用用例](../analysis/capability-first-v1/shared-update-host-design.json#/game_resource_reopen/reader_identity_and_publication/cases)

<a id="capability-first-inventory"></a>

<a id="capability-reconciliation"></a>

## 当前需求入口：40个能力域与共用缺口

全量复核逐条沿完整用户操作比对原版入口、必要规则、现有模块与验收用例。21 项尚待补齐的能力按原条目跟踪具体缺口。已有 19 项固定样本本域规格在同源适用的操作中直接引用，跨版本和跨端用例依各自证据核验。共用规则由负责模块维护，相关能力只补各自触发及结果。 [六组分析排程](development-plan.md#capability-first-scheduling) · [能力矩阵](../analysis/capability-first-v1/capability-matrix.json)

X08 的启动、入场与恢复复用三组条件。L07/X07 沿 F5A 的普通交接生产者及同版读取缺口。G01、G02、G03、X02 和 X06 引用 GF-A06/A07/A16/A19，验资料、实际首帧和确认退役。G04、X03 复用 MF-T01/T02 的重开目录用例。 [组合规格与归属](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition)

G01、G02、G03、G04 与 X02 共用 GF-A06/A07 的入场、地图和角色放行。Item 已核字段 15、17、2、拒绝确认及两个就绪位。D0/D2 用同一组用例处理 SE、Item 的顺序，D5 核实际首帧。 [来源规则与用例](game-static.md#fixed-item-world-entry)

G02、G03、G04 与 X02 复用 GF-A05 的角色和场景复位、缓存及提示窗口用例。选中槽保留、窗口初始化和状态 6 发布按两个固定来源的地址与顺序验收。 [来源与开发归属](game-static.md#fixed-item-state5-reset)

G01、G02、G03 与 X02 共用角色新建的提交、确认和名单刷新。`profile.dat` 资料、时钟和重名提示沿 Item 来源，成功后从刷新后的两槽资料重新选择。 [创建与重新选择](game-static.md#fixed-item-character-creation)

G01、G02、G03 与 X02 共用两槽名单、类别与预览数值。Item 的维护提示、共用帧内空槽与已有角色的输入条件随同一用例交给 D0/D2/D5。 [规格和验收入口](game-static.md#fixed-item-character-roster)

G02 与 X02 的已有角色外观复用 CH-T12 至 CH-T14。G06 共用预览编号和表项，首次对象准备、普通帧和入场分别沿已核读点继续验。 [对应操作与来源](game-static.md#fixed-item-character-appearance)

G02、G06 与 X02 共用 CH-T14 的选角动作、逐次调用计数、图块偏移和失败回执。留存素材已核准备及活动帧，实际队列与画面提交继续沿同一用例。 [帧规格和验收](game-static.md#fixed-item-character-preview-frame)

G02、G06 与 X02 将选角预览收集和对象退役并入 CH-T14。用同一组首次、样式替换、空分配及旧读取取消的用例验绘制顺序和实际提交。 [同帧顺序与回执](game-static.md#fixed-item-character-preview-draw)

G02、G06 与 X02 复用 CH-T14 的预览读取及绘制收集，补建角的两处转向、族和颜色查表、动作复播及详情往返用例，两版适用同一组条件。 [来源和验收用例](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_creation_preview/cases)

G02、G06 与 X02 的详情操作共用草稿加点准入、按住步进、肖像及确认用例。接受后的资料、发包与名单刷新复用已有建角链。 [详情验收条件](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_creation_details/cases)

X02 与 G06 沿 PR-A10 共用缩放、重建和命中用例。建角、普通矩形和帧末文字引用各自已证的移动点，触控和宿主移动沿实际事件验证。 [共用验收用例](../analysis/capability-first-v1/game-presentation-functional-specification.json#/backend_selection_review/pointer_position_admission/cases)

X02、G03、G05、G09 与 G10 共用普通右键的选格和独立准入用例。拾取回执和实体查询回复分别沿已有业务规格验收。 [普通右键规则及用例](../analysis/capability-first-v1/game-map-functional-specification.json#/fixed_se_ordinary_right_click_position/cases)

X02、G09、G10、G12 共用普通对话替换、同步关闭、控件退役及训练等待时的拾取条件。来包关闭与本地控件修订沿各自身份验收。 [共用验收用例](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/fixed_se_ordinary_dialog_lifecycle/cases)

本轮把窗口组的 OS-U1、WK-U1、SF-U1 接到同一条外层调用证据。B02、B03 的护卫离场与槽替换沿 BF-D7 和 BF-T36 共用动作 24、71、217 的三组条件。X08 沿六组的原规则、宿主证据和验收入口继续核 A1–A4。 [对应规则与本机对照](validation.md#capability-batch-readiness-validation)

B02、B03 在同一 BF-T36 对照两种更换身体的登记时点和独立动作 49。保留旧对象仍可执行、已标记退役、晚到动作 49 及当前登记可供飞行物读取的条件。 [来源与验收](game-static.md#battle-slot-publication-order)

G06、X03 和 X08 共用素材换版的预算与退役规则。D0/D2 复用现有归档和资源库，D5 在同一组用例核候选拒写、旧读者排空和活动版本重开。所测微信临时分段跨进程读回由 X03、X05 共用。 [共用规则与下一组](development-plan.md#capability-first-next-analysis)

L03、L08 共用普通退出、阶段 3 人工提交和 F5A 已排队提交的准入顺序，X06 沿原接口接 Stop 和通道回执。D1/D5 共用 LS-T19 至 LS-T21，继续核提示内实际消息、绑定变化与退役。 [必要规则与用例](launcher-static.md#launcher-ordinary-exit-confirmation)

L05、L08 与 X03–X06 共用素材发布、游戏页退役和新启动读回规格。D0/D1/D5 分别交接共用所有者、发布和宿主接线。Chrome 取消期间的旧目录读取已列入组合用例；微信完整持久化所需的实际宿主证据继续沿 UH-U02。 [组合规格](../analysis/capability-first-v1/shared-update-host-design.json#/game_resource_reopen) · [重开回执](architecture-and-milestones.md#wechat-sdk-segment-resume)

X02、G03、G09、G18 与 B04 共用一份经典窗口退役合同。窗口和选择状态沿 WK-D2，制造、采集、技能返回和回场沿 WK-T23、WT-A01 至 WT-A04。实际三端运行继续按原批次验收。 [需求和验收用例](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_work_transition_retirement)

G09、G18、X02 沿同一 WK-T23 核对 `F8%` 资料保留、`Xz@` 时钟、经典帧与背包回调。D0/D2/D3 共用接收和发送，沿实际帧补工作占用、配方重查和预览退役。另一套外层准入沿 WK-U1。 [规则及验收](../analysis/capability-first-v1/game-work-functional-specification.json#/fixed_se_work_context_publication)

G03、G09、G13、G18、X02 共用槽 7 的占用与回包顺序。WK-T08、WK-T23 沿现有材料和交易用例验证槽交换、工作解除、动作 81 的装备占用和制造提交。D0/D3 复用既有物品接收，按窗口实际准入执行业务副作用。 [槽 7 共用规则](../analysis/capability-first-v1/game-work-functional-specification.json#/fixed_se_work_slot_seven)

B01/B04 与 G01、G03、G05、G07、X02 共用两类结果回包和一份窗口时序规格。D0/D4 验收动作覆写、创建与重画不同取值、共用截止、关闭与退役。实际同版结算和三端呈现待验。 [来源及共用用例](game-static.md#fixed-se-battle-results)

G05、G10、G12、X02 共用 PS-A01 至 PS-A05。D2 复用五槽宠物资料，D0 核实际页内取值和窗口准入，D3 复用经典报价、回复和版本检查。固定 SE 第二套窗总页数的写入、两版实际活动调度及旧选择的可达性沿 SC-GAP-04。 [宠物资料与选择](game-static.md#fixed-se-pet-count-selection) · [报价空表和替换](game-static.md#fixed-se-training-quote-pages)

X02、G09、G10、G12、B01 共用遗忘返回、背包说明索引和 Item 报价发布的 FR-A01 至 FR-A04。D0/D3 按窗口的实际活动条件验收，与经典技能选择继续复用同一 `/1I` 编码。 [两版规则与用例](game-static.md#historical-forget-return)

先覆盖全部需求能力及必要规则，再通过统一分析门槛进入成组开发。每个能力登记输入、协议、状态、资源、失败、取消、重入、来源及验收案例。对照 stage306，在负责模块的原规格中记录一份共用规则、实现差异和验收用例，各能力记录其独有的触发条件与结果。必要缺口记录所影响的实现决定和恢复条件。当前矩阵收录 40 个能力域、81 项登记、37 条历史要求、10 个消费者组和 6 个来源。19 项具备固定版本的本域规格，其余 21 项按共享依赖排程。统一规格和产品验收仍待完成。 [当前执行顺序](development-plan.md#capability-first-workflow) · [缺口处理与排程](development-plan.md#capability-first-scheduling)

同组先核销旧证据足以判定的操作，明确要复用的现有入口，再集中补查剩余必要规则。已交接的操作沿原规格引用，排程跟踪仍影响实现或验收的缺口。 [当前取证与交接](development-plan.md#capability-first-next-analysis)

G03、G05、G09、G18、B04 与 X02 共用 GF-A10、GF-A11、GF-A18、WT-A02、WK-T23 及 SC-T17。所选用例覆盖旧窗析构、在途创建、204 完成当轮的重建、两版回场的实际子状态和普通输入。G20 复用 G03、G09 与 X02 的重建和占用合同，MAIL-CASE-41 至 MAIL-CASE-44 补两条入口的正文恢复、子窗初始化、失败及释放。 [共用规格与接线](game-static.md#fixed-se-shared-scene-frame) · [邮件分支和用例](game-static.md#fixed-se-classic-mail-reopen)

以完整用户操作核对覆盖。每项共用规则在负责模块的原规格中记录一次，相关能力引用同一组条件和用例。只有改变操作结果或接口的缺口进入 REA 补证。已知的 stage306 差异交对应开发批次，真机、账号和运行验收进入各自的用例。X02、G12、G18、G19 共用经典窗口规则，第二套窗口的外层回调入口和活动参数按 OS-U1、WK-U1、SF-U1 等原缺口等待适用材料。L01、L02、L03、L04、L07、L08、X01、X07 共用固定 F5A 的选服确认至启动交接规格。L05、L08、X03、X04、X05 共用资源发布与启动确认用例。 [当前交接与恢复条件](development-plan.md#capability-first-next-analysis) · [启动交接规则](launcher-static.md#f5a-ordinary-handoff) · [更新规格](architecture-and-milestones.md#portable-update-handoff-readback)

L03、L04、L08 共用两版登录器的编辑通知合同。F5A 密码变化影响排队状态，账号变化的资格影响后续消费，焦点和辅助窗按固定版本核验。实际通知顺序及重绑仍按 LS-U3 处理。 [共用规格](launcher-static.md#launcher-edit-focus) · [剩余能力排程](development-plan.md#capability-first-scheduling)

X02 已核历史 Item 的经典帧及第二套窗口的共用图形就绪与退役。G12、G18、G19 引用同一份图形规则。X02/G18 补入两版共享的文本焦点、主副槽筛选与后续请求顺序。G12 用已证十种经典模式复核三组训练操作，另一套 55–59、67 按正常调用确定需求归属。G18、G19 保留两套窗口要求，业务帧调用与活动参数来源仍待证。 [能力矩阵](../analysis/capability-first-v1/capability-matrix.json) · [训练入口](game-static.md#legacy-item-training-ingress) · [图形就绪规格](game-static.md#legacy-item-alternate-window-graphics) · [焦点交接](game-static.md#alternate-window-focus-slots)

G10、G12 与 X02 共用两版经典窗口 36、37 的分派、末项控件准入和退役规则。治疗提示按 OS-A25 验收，普通文本及图形确认沿原 OS-A12、OS-A13。 [共用来源及用例](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/classic_dialog_frame_hook)

X03/X04 已补桌面受控配额下的准备中止、发布中止、已提交分块保留及同标识重试。产品端口、设备与原 25 项完整宿主用例待验。 [运行范围](architecture-and-milestones.md#browser-update-quota)

X03/X04 已补实际 ZIP 的桌面持久化读取。D0/D5 复用跨块、大偏移、旧租约、回收和重开的共同用例。正式更新入口、全场景工作集和移动设备接受继续核验。 [组合实测](architecture-and-milestones.md#desktop-persisted-resource-archive)

X03/X04 的桌面夹具已覆盖同名等长的 ZIP 内容差异。换版后两页各自重新读取不同调色板，旧资源关闭时已准入的图块读取继续占用租约，排空后才回收。X05 沿同一组规则验收微信实际宿主。 [版本隔离与退役](architecture-and-milestones.md#browser-resource-version-isolation)

X03/X04 已核网页单记录缓存的同源双页竞争、调用方回执和进程重开。受控重建后，旧库的修订 1 可以命中新库的同号修订。原 D0 共用合同加入待恢复和同号旧根写入用例。 [浏览器核验](validation.md#browser-cache-receipt-recovery-validation)

X03/X04 已在四次私有 Chrome 进程中断和一次 Safari 模拟器进程退出后复核 `commit()` 的读回。D0/D5 共用同编号恢复和分块摘要用例。UH-U01 继续跟踪实际产品端口、默认持久性和真机。 [桌面核验](validation.md#browser-explicit-commit-interruption-validation) · [移动核验](validation.md#mobile-safari-stream-commit-validation)

X03/X04 的版本与对象仓结构错误、受控升级阻塞、删除排队超时和取消，已在 Chrome 与 Safari 模拟器通过同一组用例。D0 核对返回结果与晚到连接、升级事务的处置。 [桌面核验](validation.md#browser-cache-open-outcomes-validation) · [移动模拟器核验](validation.md#mobile-safari-cache-open-outcomes-validation)

X03/X04/X06 已补 iOS 模拟器 Safari 的短时后台、两版租约和活动版本读回。移动端实际浏览器适配器与回环桥已核登录到期、后台游戏收包、读取消、旧连接关闭及替换连接 EOF。真机、微信与产品端口仍按原能力范围验收。 [移动存储](architecture-and-milestones.md#mobile-safari-resource-lifecycle) · [移动传输](network-portability.md#mobile-safari-stream-lifecycle)

X03/X05 已补微信开发者工具游客模式的定位读取、文件重命名后读取、Canvas 和页面往返。现有双槽缓存已核同一 App 的主包与分包竞争、过期修订及新 App 启动的读回和修复。大档、通用发布与历史、真机及产品继续验收。 [微信模拟器实测](architecture-and-milestones.md#wechat-devtools-offline-sdk) · [双槽核验](architecture-and-milestones.md#wechat-sdk-slot-store)

X03/X05 共用重建后拒绝同号旧根，以及已发出写入超时后按身份查回执的用例。微信已拿到现有适配器的两个模拟器回执，UH-U02 继续核通用发布接线、进程崩溃恢复和真机。 [重建与迟到回执](architecture-and-milestones.md#wechat-sdk-cache-recovery)

**L01/L06/L08所选覆盖更新**：固定C82缺PatchEXE的source/目的、错误/保留、开始和重试已有引用；只是LO-U1子问题，未关闭整个L06/P02或40域统一门槛。原需求、owner、依赖、81登记/37复合/10消费者/6profile保留。legacy Code\PatchEXE和current Code.pat分别登记，实际产品旧字段仍待开发差异修正。 [缺文件准备规格](../build/analysis/launcher-missing-patcher-v1/specification.json) · [核验](../build/analysis/launcher-missing-patcher-v1/validation.json)

**L01–L08当前操作入口**：L01..L06/L08关联19行具名输入/门槛/owner/发布/失败/取消关闭/晚到/重开表；L07仅现有交接生产端与601b首次Config的边界引用。9旧子问题有后续合同覆盖，父需求和40/81/37/10/6不删不提升。未定项分别是40F430正向缺文件准备、条件调度/资源发现、宿主合同及外部接受；实现差异不作为缺原函数重复取证。 [操作规格](../build/analysis/launcher-operation-composition-v1/specification.json) · [核验](../build/analysis/launcher-operation-composition-v1/validation.json)

**B01/B04所选覆盖**：29创建/结束观战、32入场提示和特殊技能点击已把来源、状态、发送、结束及当前差异逐项相连。local20/21且flags0x1C的自动phase5仅为有条件静态路径，未推成任意观战输入已验收。B01/B04原范围、40/81/37/10/6与各父需求/统一分析状态保持；实现和实际平台/同版接受仍分栏。 [来源合同](../build/analysis/battle-observer-entry-contract-v1/specification.json) · [核验](../build/analysis/battle-observer-entry-contract-v1/validation.json)

**40行当前复核入口**：每行保留原requirement_scope、owner、依赖、profile、登记和原gap，新增指向后续覆盖关系及原12packet的单一引用。81登记/37复合记录/10消费者组/6profile未变；覆盖的是旧子问题，未提升整个父需求或统一A1..A4。P10实现/宿主、P11同版外部条件不重新解释成缺原函数。 [当前前沿](../build/analysis/current-frontier-supersession-v1/specification.json) · [核验](../build/analysis/current-frontier-supersession-v1/validation.json)

**当前G09/G11/G13/X02归并**：原40/81/37/10/6范围及依赖不变；共享字节占用、接收准入、窗口group和延后开场已形成9行条件表。当前shop/trade合同的原未决文字保留，并加具名已证子范围，避免原样重复分析。两条pending动画推断、条件另一套52/C5E9C8、异常域及真实接受仍单列；没有把本组事实数变为覆盖率。 [组合规格](../build/analysis/shared-occupancy-composition-v1/specification.json) · [核验](../build/analysis/shared-occupancy-composition-v1/validation.json)

该轮 G09/G13/X02 数量框归并了四条所选正常流程。QP-COR1 修正旧 SW-F9 和交易合同的初值描述，覆盖 SW-R1 的数量提示子范围。其余共用占用、条件窗口 52、C5E9C8 和验收随原规格维护。 [数量框规格](../build/analysis/quantity-prompt-lifecycle-v1/specification.json) · [核验](../build/analysis/quantity-prompt-lifecycle-v1/validation.json)

G05、G13 和 X02 按交易完整操作共用宠物活体与选择、当前余额与已存报价、发布和关闭规格。SW-F4、SW-F7、SW-F8 与 OS-F24 引用同一规则，现有 OS-A27、OS-A28、SW-AC7、SW-AC12 补清槽、同槽恢复、余额变化和重开。 [能力规格及案例](../analysis/capability-first-v1/game-trade-storage-contract.json#/classic_trade_pet_and_gold)

G13 和 X02 已关联第二套窗的缓存列表与金额，SW-F1、SW-F11 和 OS-F24 引用同一来源。OS-A27、OS-A28 和 SW-AC12 补列表、发布时钟、输入撤回与仅余额截低。 [能力规格及案例](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_gold)

G05、G09、G13 和 X02 共用第二套窗的本方物品与宠物选择、取放和回包刷新规格。OS-A01、OS-A27 与 SW-AC9 补回包不同写法、改选撤回和数量框用例。普通激活沿 SW-R2 验证。 [能力规格及案例](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_selection)

**当前输入/退出范围复核**：原40能力/81登记/37复合记录/10消费者组/6配置保留。B01/B04新增整链引用，控件数不当需求数；变身为已有来源的开发差异，flag5不擅自新增功能。普通退出、回城、注销和重入分别保留原条件，旧pending按后续合同解释。没有删范围或提升任何全能力/平台/同版完成标记。 [整链规格](../build/analysis/battle-input-exit-contract-v1/specification.json) · [核验](../build/analysis/battle-input-exit-contract-v1/validation.json)

**当前B02/B03边界复核**：原40/81/37/10/6范围/依赖保持。435000完整直接CFG补充了旧规范部分范围；113/260双读序等7组事实及6行条件分栏已登记。107成功原文、98FF/ITM正常continuation、RID真实scratch/别名等仍不等价或未验，不能因其静态行为已知标全部接受。下一步以输入/退出完整用户流程对账，不将这些已知行为再扩成笼统缺源或新需求。 [本批规格](../build/analysis/battle-preflight-boundaries-v1/specification.json) · [核验](../build/analysis/battle-preflight-boundaries-v1/validation.json)

**当前B02/B03具名规则收敛**：12/267的必要所选身体、值/计数/子体及结果来源已从完整旧记录绑定，更新两行当前缺口；仍不是整类所有别名/异常输入或完整战斗验收。11事实、7借用规则、4当前代码观察、4未实现差异、12未执行用例分开。未将146个拒绝字符串增加为需求；统一规格/共享实现/本地产品/三端设备/同版接受仍独立，40/81/37/10/6及原依赖保持。 [本批规格](../build/analysis/battle-utility-consumers-v1/specification.json) · [核验](../build/analysis/battle-utility-consumers-v1/validation.json)

**当前B02/B03进展**：24token和110个当前显式解析class已映射到既有规则/当前路由；108有专用分派，12/267缺专用消费者，旧producer已复用但必要身体/恢复仍须审。51规格和49后续source-check有限发现不等于全需求发现；146条当前字面拒绝是条件索引，不是新增146个需求。原40域、81登记、37历史复合、10消费者、6profile及依赖不变，未提升整类/统一规格和实际接受。 [本批对照](../build/analysis/battle-variant-coverage-v1/crosswalk.json) · [核验](../build/analysis/battle-variant-coverage-v1/validation.json)

**当前G09/G11/G13/X02来源进展**：所选选择位置/计数/抑制byte、资料刷新和数量提交规则已绑定，四行当前缺口同步。源/目标槽全局量、窗口身份、逻辑占用和revision分别处理；4CCC20不再列作独立撤回函数。保留40域、81登记、37历史复合、10消费者组和6profile；统一规格、实现与实际三端/同版接受仍分开。[本批规则](../build/analysis/inventory-selection-ownership-v1/specification.json) · [来源核验](../build/analysis/inventory-selection-ownership-v1/validation.json)

**前组缺口已分栏**：下表40行按最新保留合同改写当前问题，原范围/依赖/owner/版本及81登记、37历史复合、10消费者组不变。21个共享层82条历史未决保留身份；所选已证子问题、条件激活、实现和设备/同版接受分开。24个战斗token的源码路由已定位，尚不能支持完整战斗已实现声明。[逐项对账](../build/analysis/capability-source-reconciliation-v1/reconciliation.json) · [战斗命令对照](../build/analysis/capability-source-reconciliation-v1/battle-command-crosswalk.json)

**前组状态条款归并**：Q[j正向归G01/G06/X02，三字段/原位宽保持；所选粒子池、配置、生成和退役已补，G06/G08/X02当前缺口同步。全40域有逐行对账提案，49条旧缺口只是限定metadata盘点；保留81登记、37历史复合、10消费者组、6 profile与原依赖/未过门槛，静态规则/实现/外部接受分开。[合同](../analysis/capability-first-v1/game-entry-review-contract.json) · [核验](../build/analysis/particle-lifecycle-contract-v1/validation.json)

**当前所选正常链**：三接收委派的资料/列表/回调已补源；G10/G20/X02复用目标选择、名册/资料和占用规则，相关依赖仍分开。经典60..62的证据不提升另一套同编号窗口或任何整项规格/接受标志。[当前合同](../analysis/capability-first-v1/game-service-invalidation-contract.json)

**当前接收差异复核**：37个有限待核入口的包装规则已全部核源，按9类发布/委派共享；它们仍不能视为37个已完成用户流程。标准客户端专用业务更新缺口、未知辅助语义及原40域全部必要问题分别登记。`?<E`按实际物品发布纠正旧候选，邮件来信不当作投递成功。[来源与剩余](../analysis/capability-first-v1/game-entry-review-contract.json)

当前用户要求为先REA分析全部需求能力，再按能力分组复刻。保留40域原始scope、来源版本、依赖及现有代码；本轮完成引用/声明所有者与必要缺口归并，形成11个共用分析组，尚未完成全部需求发现或必要规则。[执行约束与停止条件](development-plan.md#capability-first-execution) · [唯一能力明细](../analysis/capability-first-v1/capability-matrix.json)

81项旧登记包含来源、协议及接受主张，不是81条报文；37条历史复合记录和10个消费者组继续保留，不按追加历史重复排期。104文本接收目录不等于104个业务已实现；代码guard有限检查中的37项待核路由与历史37条没有对应关系。空owner声明不等于仓库没有代码。原需求与旧缺口逐行留有冻结指针/哈希。[复核记录](../build/analysis/capability-readiness-review-v1/consolidated-review.json)

规格就绪、共享实现、本地产品、实际设备与同版官方接受分开；G17固定来源的本地功能规格现已就绪，其余必要规格及40域完整接受仍分别未完成，产品基线stage306。以下仅是当前缺口摘要，完整原要求及其证据以矩阵为准。

### 登录器

| ID | 需求能力 | 当前规则与必要缺口 |
| --- | --- | --- |
| L01 | 启动配置、目录及版本选择 | 把必要XML/目录输入与首次配置/失效恢复放入同版操作表；原OS故障和目标存储分栏。 [证据入口](../analysis/launcher-v7/static-spec.json) |
| L02 | 区域、服务器与认证候选选择 | 核候选刷新、可用ID关联、取消与下一阶段交接资格；不再把目录字段整体列缺。 [证据入口](../analysis/launcher-v7/static-spec.json) |
| L03 | 登录交换、记录流与认证回复 | 11 月版普通提交、`0x8242` 准入、无回复断线的定时器重试、所选错误结果恢复及两条回调的退役已成规。C82 的本地断线沿主窗错误提示。实际消息顺序、会话重绑、停止重开和同版接受继续核验。 [11 月版提交](launcher-static.md#f5a-login-owner) · [两版重试与退役](launcher-static.md#f5a-disconnect-retry) · [会话规格](../analysis/capability-first-v1/launcher-session-functional-specification.json) |
| L04 | 输入编码、偏好与本地决定 | 固定 601b/C82 的本域规格已审定。F5A 补入启动代码页选择和登录文本保存后的 16 字节边界，目标输入法、偏好存储及实际接受按原范围核对。 [既有规格](../analysis/capability-first-v1/launcher-preferences-functional-specification.json) · [F5A 输入](launcher-static.md#f5a-startup-code-page) |
| L05 | 自更新与目录刷新 | 自更新接管/重启/目录刷新按既有不同hash规格逐项对齐；不把c7ba当c82f来源。 [证据入口](../analysis/launcher-update-arguments-v1/source-check.json) |
| L06 | 游戏补丁与文件恢复 | 已安装补丁器与随包四条魔力配置、两份更新清单相符。11 月版补齐缺文件的回退目录、两次复制、备份启动和 102 重试。实际回退制品、运行中进程身份及三端事务、取消和恢复仍待。 [补丁规格](../analysis/capability-first-v1/launcher-game-patch-functional-specification.json) · [11 月版来源](launcher-static.md#f5a-patch-fallback) |
| L07 | 登录器到游戏的正常交接 | 11 月分发版已把普通确认字段、前检、首次配置、映射和进程返回接成同一规则。七组枚举按已证原序，安装目录的 28 行和 26 个非空短名沿 D1 用例核对。同版游戏读取、实际创建和联合接受待证。 [交接规则](launcher-static.md#f5a-ordinary-handoff) · [资源参数](launcher-static.md#windows-installed-resource-enumeration) |
| L08 | 登录器产品流程与宿主状态 | 11 月分发版已有普通创建返回、错误提示所有者、四个控件恢复与焦点的来源。排队提交已核根窗、主窗和 IDOK 启用条件。三模板、四条非 App 菜单和实际退出顺序继续按对应版本核验。 [创建返回](launcher-static.md#f5a-official-launcher) · [登录错误规则](launcher-static.md#f5a-login-owner) · [宿主规格](../analysis/capability-first-v1/launcher-modal-recovery-contract.json) |

L01、L03 和 L08 共用两版列表双击与阶段确认的规则。X01 登记模板 133 的两版绑定。普通选择变更及 F5A 阶段 3 的待处理位纳入 D1/D5，实际提示中的投递与重绑继续沿 LS-U3 验收。 [列表输入规格](launcher-static.md#launcher-list-activation)

### 普通游戏能力

| ID | 需求能力 | 当前规则与必要缺口 |
| --- | --- | --- |
| G01 | 游戏连接、首包与通信分发 | 保留104接收/37包装来源；精确业务流程/对应状态与现行连接分版核对，未知业务名不等于新报文字段。 [条件工作规则](../analysis/capability-first-v1/game-entry-review-contract.json) |
| G02 | 角色列表、创建、删除与选角 | 原五项范围已归24行操作。Item 补证内容代、类别 7 升级入口及删除等待。两份历史样本的升级资料生产和实际服务器删除仍待证。 [当前规格](../build/analysis/character-operation-composition-v1/specification.json) · [Item 来源](game-static.md#legacy-item-character-operations) |
| G03 | 主流程、进入、换场与断开 | 主状态 7 已核发送、请求采样、两类会话时长阈值和四种结果退役。主状态 5、B 与错误恢复按原规格继续验收。 [工作流规则](../analysis/capability-first-v1/game-entry-review-contract.json) · [注销计时与确认](game-static.md#legacy-item-logout-clock) |
| G04 | 地图、碰撞、寻路与移动 | 地图/碰撞/移动已有规则先对完整请求/回包及场景更新核对；键位和A/B参数已证部分复用。 [工作流规则](../analysis/capability-first-v1/game-entry-review-contract.json) |
| G05 | 普通人物、NPC、宠物与骑乘对象 | 按已要求动作/尺度/状态和对象失效核现有规格；全局生命期只沿具体业务交点扩展。 [证据入口](../reports/game-static.md) |
| G06 | 图像、地图物件、动画与调色板 | 已核素材的正尺寸图形均对齐。烟雾负高度首帧推进动画，普通绘制在缓存准备后裁掉该帧。历史路径选择和实际 ZIP 初始化已对照，同一参考帧已在桌面和移动 Safari 模拟器核验。D0 处理有符号几何和绘制，D4 验证战斗动画顺序。其他素材及后端按原范围核对。 [资源与动画规格](../analysis/capability-first-v1/resource-corpus-budget.json) · [移动端范围读取](architecture-and-milestones.md#mobile-safari-resource-archive) |
| G07 | 字体、文字、HUD与小地图 | 按必要字体/命中/编辑/IME和HUD条件对齐既有规格；结果声音比较器不再列未知。 [状态规则](../analysis/capability-first-v1/game-entry-review-contract.json) |
| G08 | 音乐、音效与播放生命周期 | MIDI/流式及环境初始化、维护、退役已补来源；剩余为所需调度/输出域整合，载体/GM/真实声部接受单列。 [当前规则](../analysis/capability-first-v1/game-entry-review-contract.json) |
| G09 | 背包、装备、用物与拾取 | 20/5 signed8选择映射、物品逐槽占用/释放/重排和具体UI资格、资料通知/缓存搬移已绑定；数量提交读当前端点，全资料/窗口交错仍按SW-R1核。SW-D差异未实现，原完整物品/装备/用物/拾取范围保留。 [条件工作规则](../analysis/capability-first-v1/game-entry-review-contract.json) |
| G10 | 角色交互、对话、图文与外观 | 已核交互 A/B 的键位与准入。固定 Item 和 SE 的普通对话分派返回后会尝试更新来包目标朝向，差异归 OS-D2。实际退役与当前同版继续验收。 [工作流规则](../analysis/capability-first-v1/game-entry-review-contract.json) · [对话与朝向](game-static.md#legacy-dialog-actor-facing) |
| G11 | 商店、鉴修、兑换与给予服务 | 28byte共享占用与逐槽选择账目、C5E9C8一次性抑制及所选报价移除角色已核；多窗口mode/owner和必要正常重开仍按SW-R1/R2。九入口/六报价规则复用，未实现SW-D及真实平台接受。 [证据入口](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) |
| G12 | NPC治疗、人物与宠物训练 | 固定 SE 和 Item 的普通 `Q?m` 十模式已绑定，归入人物训练、宠物训练和治疗三条操作，沿原 OS-D2、OS-D7 及 OS-A23 至 OS-A25 共用窗口和业务用例。另一套六个窗口的正常激活、帧分派和当前同版适用性仍待。 [操作与用例](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/classic_training_operation_coverage) · [等待与关闭](game-static.md#legacy-pet-training-wait-owner) · [对话与朝向](game-static.md#legacy-dialog-actor-facing) |
| G13 | 玩家交易、银行与仓储 | 20/5位置、选择/释放/交换、经典关闭抑制及金额/数量端点已绑定；4CCC20属条件另一套52发布片段，停止当独立撤回函数。完整数量框准入/owner丢失、其它版本/仓储与六位提示归属继续分开；当前revision/连续编号/clock策略是独立差异。 [证据入口](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) |
| G14 | 队伍与好友资料 | 队伍/好友资料与战斗复合归属、拒绝/结果及跨角色晚到按既有发布/缓存事实核对。 [当前接收规则](../analysis/capability-first-v1/game-entry-review-contract.json) |
| G15 | 聊天、过滤、气泡与公告 | 固定37c4原范围36操作/8组实现差异已成规，局部规格就绪；G05/G07依赖、三端I/O/时钟/后台及现行真实接受未完成。 [当前规则](../build/analysis/chat-operation-composition-v1/specification.json) |
| G16 | 家族、称号、家族兽与饲料箱 | 家族/称号/家族兽剩余已要求接收、邀请/审批、称号清除及权限/失效逐项对既有规则。 [证据入口](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) |
| G17 | 留言板 | 固定37c4六项功能规格就绪；图形/输入依赖整合、原头像/编辑运行和真实权限/结算及三端接受未完成。 [当前审定](../build/analysis/capability-specification-audit-v1/G17-specification-review.json) |
| G18 | 普通技能、工艺与工作上下文 | 经典工作计数、两族换算及关闭移交已证。Item 八个工作窗口的非活动回调已核主副槽、计数字、一次性标记和解除请求的条件。外层实际帧分派及当前版本适用性仍待。 [原工作规格](../analysis/capability-first-v1/game-work-functional-specification.json) · [Item 退役](game-static.md#legacy-item-work-retirement) |
| G19 | 魔物/宠物图鉴、目录与发现标记 | bank、容量 320、21 个常规分页及 main5 加载已证。另一套列表初始页为 0，详情返回按所选序号恢复页。Item 图鉴局部输入的按键生产和清理已有来源。正常帧准入、外层激活和必要异常仍待证。 [图鉴规格](../analysis/capability-first-v1/game-social-family-album-functional-specification.json) · [键盘状态](game-static.md#legacy-item-keyboard-frame) |
| G20 | 邮件、群发、宠物投递与通信记录 | 50 项客户端操作和 9 组差异已成规。本机流已核对写入回执。最终投递、拒收、撤销及附件结算仍缺同版关联。 [当前规则](../build/analysis/mail-operation-composition-v1/specification.json) · [本机写入](network-portability.md#desktop-stream-lifecycle) |

### 战斗能力

| ID | 需求能力 | 当前规则与必要缺口 |
| --- | --- | --- |
| B01 | 战斗入场、回合及玩家/宠物输入 | 把C/P/A/M/U与玩家/宠物/坐骑输入、等待/超时/下一回合逐项对现有源与产品菜单命中边界。 [证据入口](../analysis/game-work-context-v1/goal-audit.json) |
| B02 | 完整战斗命令与技能分派 | 24 token 分派已定位。105、259、106、116 和 SKL266 的所选规则沿原规格。已核固定 SE 清零帧的首条普通结果、仅自身 RID 和所选护卫写入。BF-D7 继续核其它生产者、完整变体和实际恢复。 [战斗规格](../analysis/capability-first-v1/game-battle-functional-specification.json) · [护卫写入](game-static.md#battle-266-self-guard-context) |
| B03 | 战斗身体、特效、投射及RID归属 | 十个消费者组按原规格核验。已核角色分配、重置、所选护卫 RID 复制、独立 106 查找及 116 重叠。SKL266 复用多目标投射物的四格复制，所选自身护卫沿角色队列追加，X02 共用同槽所有者与帧条件。其它帧写入、原版实读和护卫回放待验。 [投射物复制](game-static.md#battle-266-projectile-row) · [角色和结果归属](game-static.md#battle-266-self-guard-context) |
| B04 | 战斗退出、停止、回城与再次入场 | 普通结束/244/回城与恢复标记规则已证；所要求初始/错误/中断/结算/再次入场按具体源状态表核对。 [状态规则](../analysis/capability-first-v1/game-entry-review-contract.json) |

### 跨能力和平台条件

| ID | 需求能力 | 当前规则与必要缺口 |
| --- | --- | --- |
| X01 | 来源版本与需求发现边界 | 647 个入口和六个原来源档案按既有范围使用。11 月分发版的来源补充覆盖普通创建、普通提交和 `0x8242` 投递。已准入入口的需求归属和不适用说明仍待逐项核对。 [证据入口](../analysis/capability-first-v1/entry-inventory.json) · [11 月版登录](launcher-static.md#f5a-login-owner) |
| X02 | 共用状态、窗口、时钟、对象池与调度 | 所选 20／5 位置、28 字节占用、字节抑制和数量端点已成规。Item 普通帧的消息派发、状态更新、经典回调和按键清理已核。经典训练的等待和退役与 G12 共用一份规则。另一套工作窗口的表行标记、局部回收和上下文退役已有条件规则，外层分派及必要重开继续沿正向调用核对。D0 的输入、时钟、资源、音频与三端仍待验收。 [共用状态规则](../analysis/capability-first-v1/game-entry-review-contract.json) · [键盘帧](game-static.md#legacy-item-keyboard-frame) · [工作窗口退役](game-static.md#legacy-item-work-retirement) · [训练窗口](game-static.md#legacy-pet-training-wait-owner) |
| X03 | 跨端资源包、读取、缓存与预算 | 桌面 Chrome 与移动 Safari 模拟器已核实际 ZIP 分块、跨 2 GiB 偏移、旧根回收和重开。桌面另核同名等长 ZIP 的调色板差异与迟到读排空。微信 DevTools 已分段取得 2.55 GB 完整素材并通过现有解析器。两段另存遭拒。实际素材的普通分块写入及新 App 的合成对照均在第 13 块遇到配额，完整持久化待证。完整场景、移动与微信内容换版、产品持久化接线和真机继续验收。 [桌面版本隔离](architecture-and-milestones.md#browser-resource-version-isolation) · [移动持久化](architecture-and-milestones.md#mobile-safari-persisted-resource-archive) · [微信普通写入配额](architecture-and-milestones.md#wechat-sdk-archive-ordinary-quota) · [微信完整分段读取](architecture-and-milestones.md#wechat-sdk-segmented-archive) · [有序资源参数](launcher-static.md#f5a-resource-enumeration) |
| X04 | 桌面网页与移动网页可玩 | 桌面已核局部触屏、双根存储和普通标签页切换后的暂停与恢复。移动 Safari 模拟器已核实际 ZIP 换版、重开和参考画面。完整网页和移动网页的输入、UI、资源、传输与玩法依实际实现和宿主验收。 [桌面标签页](network-portability.md#desktop-game-tab-visibility) · [移动重开](architecture-and-milestones.md#mobile-safari-persisted-resource-archive) |
| X05 | 微信Page、开发者工具与真机 | DevTools 基础库 3.18.0 已核文件、Canvas、Page、双槽恢复和所选大偏移。同一 App 通过两次选择取得完整分段归档并输出参考画面。整包单次选择有临时复制限制。普通分块存储的拒写和未发布状态已有新 App 回执。产品导入、完整持久化重开和 iOS／Android 真机继续验收。 [文件实测](architecture-and-milestones.md#wechat-sdk-archive-files) · [单次选择回执](architecture-and-milestones.md#wechat-sdk-archive-selection) · [分段导入](architecture-and-milestones.md#wechat-sdk-segmented-archive) · [普通写入拒绝](architecture-and-milestones.md#wechat-sdk-archive-ordinary-quota) · [产品证据入口](../analysis/game-work-context-v1/validation.json) |
| X06 | 平台传输、错误与连接生命周期 | 桌面 Chrome 已测回环写入、登录桥超时、游戏读取消及替换连接 EOF。桌面标签页和移动 Safari 模拟器都观察到后台同连接收包、EOF 及新连接。长时后台、真机、微信实际连接及当前服务仍待验。 [传输证据](network-portability.md#desktop-stream-lifecycle) · [共同用例](network-portability.md#target-game-page-lifecycle) |
| X07 | 现行版本及官方联合兼容 | 11 月登录器的普通交接发送端和公开清单身份已有证据。同版游戏读取、真实业务与恢复、官方接受仍待核验。当前暂无测试账号。 [分发身份](launcher-static.md#f5a-official-launcher) · [协议矩阵](../analysis/protocol-v2/spec-matrix.json) |
| X08 | 规格、覆盖与验收文档 | 40 行需求共用台账，证据和规格差异按负责模块登记。已核桌面标签页的两个运行结果并并入共用用例。A1–A4、实现及外部验收的逐项证明仍待。 [覆盖流程](development-plan.md#capability-first-workflow) · [本机验收](validation.md#desktop-game-tab-visibility-validation) |

### 发现与关闭规则

- 先核对来源的主状态、窗口/控件、协议分派、资源家族和用户菜单，再确认完整能力边界；新发现入口纳入现有清单，不留在散落阶段记录中。
- 每项能力分开登记来源证据、规格闭合、共享实现、本地产品、实际平台/设备、同版官方接受。当前 40 项均保留未闭合条件，不表示它们需要全部重写。
- 固定旧游戏 `37c4…13bd`、旧登录器 `601b…6e31`、更新后分析登录器 `c82f…c152` 分开引用；更新后的分析样本不等于此刻官方最新版。现行游戏消费者缺口不能由旧版证据自动填充。
- 手机真机、原生微信/DevTools 和现行官方验收仍有缺口；没有测试账号是外部验收条件，不把本地原创对端升级为真实登录成功。
- 当前取证顺序由[开发计划](development-plan.md#capability-first-scheduling)维护。P08 的战斗载荷、类别、变体、动作及错误规则沿原战斗能力复核。P05 的选择、占用及数量规则由相关能力共用。统一 A1–A4 通过后按 D0–D6 成组复刻。

<a id="stage306-work-context"></a>

## stage306 上下文和直接技能的需求进展

原始 37 项要求及 10 个未完成消费者组的身份、来源与未完条件保持。已新增普通技能上下文 0／1 的正常选择、查询／回复归属、最终请求偏移、耗时及物品等级条件，以及 type5 的直接请求和坐骑子体条件；不把“请求已发送”记作施放成功。[规格](../analysis/game-work-context-v1/specification.json) · [逐项目标核对](../analysis/game-work-context-v1/goal-audit.json)

8 项新增源码、102 项生成 API、3,779 项完整检查与 16 条实际资源本地产品流程通过。原生所有全局交错、其他分支、真实平台及现行／官方接受仍未验收。知识库仍缺 requirement-index 角色；本轮依据仓库内需求真源推进，没有修改知识库或其他项目。

<a id="stage305-work-targets"></a>

## stage305 目标与采集进展及原始范围

新增已知 type3／221..224 的变装、变身、急救、治疗和 type4／225、226、227、250、251、253 的挖掘／打猎／伐木。接入角色及宠物列表、原始序号、结果、魔力检查、采集自动循环与暂停；不是全部普通技能或全上下文实现。[规格](../analysis/game-work-targets-v1/implementation-spec.json) · [逐项目标核对](../analysis/game-work-targets-v1/goal-audit.json)

新增 10 源码、94 生成 API、3,771 完整检查和 12 条实际资源本地产品流程通过。37 项原始要求／10 个未完成消费者组的来源、身份和未完条件保持。非零上下文、type5 等分支、完整原生表现、真实平台及现行／官方接受仍未验收。知识库缺失 requirement-index 角色的状态未由本轮修改。

<a id="stage304-work-actions"></a>

## stage304 普通工作进展与原始范围保留

新增 type2／217..220 的物品选择、修理／鉴定计时、刻印即时提交和 type1／255 装饰的双材料分类，以及结果、重试、取消与实际网页／Page 操作。8 项新增源码、84 项生成 API、3,761 项完整检查通过；四条新实际资源流程各核对 26 请求，四条旧制造流程各核对 13 请求。[规格](../analysis/game-work-actions-v1/implementation-spec.json) · [目标核对](../analysis/game-work-actions-v1/goal-audit.json)

原始 37 项要求和 10 个未完成消费者组的来源文件及身份不变。Lor kind3／4、非零上下文、完整合成／其他技能、真实平台和官方接受条件未删除；阶段本地进展不等于完整项目交付。外部知识库缺失 requirement-index 角色的状态未由本轮修改。

<a id="stage303-craft-input"></a>

## stage303 普通制造进展与原始范围保留

新增普通制造输入、六位材料、计时请求、服务器结果及网页／Page 操作；并非完整工艺系统。源码 9 项、生成检查 71 项、完整 3,753 项和 4 条实际资源本地产品流程已验证。[规格](../analysis/game-craft-input-v1/implementation-spec.json) · [逐项目标核对](../analysis/game-craft-input-v1/goal-audit.json)

原始 37 项要求与 10 个未完成消费者组的来源文件及身份保持，没有删除修理、合成、非零上下文、其他消费者和真实平台／官方接受条件。阶段本地制造进展为事实，完整目标仍 active/incomplete；外部知识库缺失 requirement-index 角色的状态未由本轮修改。

<a id="stage302-craft-recipes"></a>

## stage302 配方接收切面与保留范围

本轮填补此前自动工艺查询回复未消费的缺口：上下文 0 的 56 配方×5 材料接收、重复更新、删除部分重置及显式只读访问已接入。制造输入／结果／UI 与非零上下文仍未完成，不能把配方接收标为制造玩法完成。[规格](../analysis/game-craft-recipes-v1/implementation-spec.json) · [验证](validation.md#stage302-craft-recipes)

所有 37 项原始要求、10 个未完成消费者组及其来源身份保持。整体 active/incomplete，实际微信／手机／现行交接与官方接受继续单列，外部知识库缺失角色状态不变。[逐项目标](../analysis/game-craft-recipes-v1/goal-audit.json)

<a id="stage301-battle-item-dispatch"></a>

## stage301 ITM 需求判断纠正

本轮没有删减原始范围：37 项要求、10 个未完成消费者组及既有来源身份保持。ITM 的未识别值不是已证明缺失的五类道具效果；本样本的编号 0／6／7 继续由既有恢复／捕获／动画消费者处理，其余值的原生后继行为尚未观察。[来源](../analysis/game-battle-item-variants-v1/source-check.json) · [目标核对](../analysis/game-battle-item-variants-v1/goal-audit.json)

本轮交付来源复核和未改动消费者的 63×2 检查，不作为新增玩法或完整阶段完成。后续工艺配方／普通上下文、其余游戏逻辑和真实平台接受继续 active/incomplete；知识库缺失角色不替代当前索引。

<a id="stage300-city-water"></a>

## stage300 回城生命周期的限定验收

完成已初始化回城的场景、边界、战斗内转场、提前边界、延后边界五条已有路径；每条覆盖桌面、触屏模拟、源码Page、生成Page。等待回复、真实角色消息时机、地图缓存缺失、嵌套捕获、缓存淡入、同连接移动及资源取消边界已局部验证。[来源](../analysis/game-city-water-v1/source-check.json) · [验收](validation.md#stage300-city-water)

本轮没有新增wire字段，未用动画结束替代服务器角色资料。原始37项需求／10个未完成组逐项来源摘要已重核，完整玩法、原生调度、现行交接与实际平台没有改为complete。[范围审计](../analysis/game-city-water-v1/goal-audit.json)

<a id="stage299-battle-water"></a>

## stage299 战斗水面消费者的限定验收

完成普通特殊索引3096..3105进入战斗队列、裁减前标记、3／4项辅助预留及正常战斗／返回上下文绑定。覆盖实际背景嵌套捕获、缓存复制排除、main10无本地对象暂停相位、正常返回及较早own unit重建、回场地图捕获先于外层更新，以及只在外层保存位置。[来源](../analysis/game-battle-water-v1/source-check.json) · [验证](validation.md#stage299-battle-water)

原始37项需求和10个未完成消费者组的来源摘要已重核；完整玩法、其他生命周期、原驱动／缓存、实际平台和现行交接均未整体完成。没有新增协议字段或用原创对端代替官方接受。[范围审计](../analysis/game-battle-water-v1/goal-audit.json)

<a id="stage298-ordinary-water"></a>

## stage298 普通水面消费者验收范围

水面索引→队列标记→type8／优先级2→条带方程→普通world／runtime→资源库／产品路径已局部验收。测试包括全部相位／偶数振幅、地图与停止门槛、实际位置／相机区别、追赶更新、裁减前标记、过期及重复准备、prepared／deferred一致性，以及实际素材。

这不完成战斗特殊队列、原生缓存／驱动、真实微信／手机或完整游戏。原始37项需求和10个未完成消费者组逐项来源摘要保持；现有正常协议没有新增字段。[完整范围核对](../analysis/game-special-graphics-v1/goal-audit.json) · [验收](validation.md#stage298-ordinary-water)

---
title: moli-mac 需求索引
doc_role: requirement-index
project: moli-mac
task_domains: [development]
status: 持续维护
---

<a id="stage297-body-draw-flags"></a>

## stage297 两个身体动作的限定完成

原始37项需求、10个未完成组及身份保持。本阶段完成164／165身体消费者的来源核对、动作推进、独立绘图与回归；未把该消费者当作正常协议生产链或完整GMN玩法完成。[范围审计](../analysis/game-battle-gmn-flags-v1/goal-audit.json)

独立验证含原flags0..15、当前来源覆盖值0／4、162→164→165→163交错、原动画翻转偏移、暂停／慢帧和未知样式恢复边界。8条实际材料产品回归消费既有正常流程，不用于证明未确认的164／165协议生产者。[规格](logic-protocol-spec.md#stage297-body-draw-flags) · [验收](validation.md#stage297-body-draw-flags)

<a id="stage296-actual-battle-product"></a>

## stage296 实际材料验收范围

37项原始需求和10个未完成组保持原身份。本阶段证明已有实现能消费实际素材完成入场→SKL106结果→退出→继续移动；未把本机原创对端、触屏模拟或Node Page写成真实平台／完整游戏验收。[范围审计](../analysis/game-actual-battle-product-v1/goal-audit.json)

CUT59510与59526分别完成桌面、触屏、源码Page、生成Page，共8条；角色与背景来自未修改的实际ZIP，地图格布局和战斗角色配置来自原创对端。没有新增运行时API、协议字段或动画事件。[规格](logic-protocol-spec.md#stage296-actual-battle-product) · [验收](validation.md#stage296-actual-battle-product)

<a id="stage295-battle-draw-style"></a>

## stage295 战斗ARGB绑定的限定结果

原始37项需求、10个未完成消费者组及其来源身份保持。本轮完成已移植战斗对象的颜色覆盖、动画加色、命名编号、ghost半透明及复制／恢复生命周期；完整游戏和实际平台状态仍未改为complete。[完整范围](../analysis/game-battle-draw-style-v1/goal-audit.json)

2048组最终样式／完整帧、128份历史半透明拒绝正例，以及112幅实际素材乘六种原创战斗池上下文均通过源码／生成比较。产品普通透明与加色各完成四种本机入口；原特殊图形与其他未完成消费继续单列。[规格](logic-protocol-spec.md#stage295-battle-draw-style) · [验收](validation.md#stage295-battle-draw-style)

<a id="stage294-vertex-color"></a>

## stage294 普通绘制ARGB的证据与范围

37项原始需求、10个未完成消费者组及其来源身份保持。本轮完成普通地图／角色动画的颜色与透明度、文字上层的逐指令合成和有效部分调色板；战斗专用样式绑定、完整游戏和实际平台未整体完成。[完整范围](../analysis/game-vertex-color-v1/goal-audit.json)

25个实际动作／112帧、普通透明与带alpha加色两个实际材料场景的8条产品流程通过。任意RGB调制使用原创矩阵验证，实际25个动作的RGB均为白色；硬件默认状态／精度与真实设备继续单列。[规格](logic-protocol-spec.md#stage294-vertex-color) · [验收](validation.md#stage294-vertex-color)

<a id="stage293-additive-render"></a>

## stage293 加色绘制的限定验收

37项原始需求、10个未完成消费者组全部保留。本轮推进共享图像、动画样式和真实材料呈现；标志8进入既有网页／Page路径，完整游戏和真实平台状态未改为complete。[目标核对](../analysis/game-additive-render-v1/goal-audit.json)

完成普通／缩放／翻转／裁切加色、文字前后层、命名调色板组合和真实113685材料入口；任意顶点颜色、原生硬件精度、完整版本对应与未闭合玩法仍单列。[来源](game-static.md#stage293-additive-render) · [验证](validation.md#stage293-additive-render)

<a id="stage292-animation-named-palette"></a>

## stage292 实际命名调色板动画的限定进展

37项原始需求、10个未完成消费者组不变。本轮完成的是延迟地图动画和范围资源库的一条命名调色板路径：59529／1116→113058／320已通过真实材料入口，历史stage291的该失败边界被当前证据更新。未将完整动画、整套资源版本或完整游戏改为complete。[目标核对](../analysis/game-animation-palette-source-v1/goal-audit.json)

独立验证全部16位编号、9种原创颜色、实际54帧及四个平台变体。未绑定的直接精灵提供者、其他动画上下文与加色标志8继续保留。[规格](logic-protocol-spec.md#stage292-animation-named-palette) · [验证](validation.md#stage292-animation-named-palette)

<a id="stage291-legacy-minimap"></a>

## stage291 小地图的限定实现状态

原始37项需求、10个未完成消费者组全部保留。本轮推进共享游戏呈现、实际资源适配和跨平台薄适配，没有将完整游戏、整套资源版本对应或真实平台改为complete。[目标核对](../analysis/game-legacy-minimap-v1/goal-audit.json)

已实现来源明确的小地图窗口、普通／AUT颜色、物件占地、32位菱形栅格及位置闪烁；网页／Page显隐和三档范围通过本机验证。新增实际模式1静态CUT／AUT正例与非零调色板动画负例。后续继续调色板选择、完整消费者和实际平台。[分析](game-static.md#stage291-legacy-minimap) · [验收](validation.md#stage291-legacy-minimap)

<a id="stage290-legacy-material-compat"></a>

## stage290 真实资源的有限场景验收

实际材料已通过网页桌面／触屏模拟和源码／生成Page的四条进入、移动、重建场景流程；这些场景报文由原创本机对端提供，实际画面使用所选游戏图形与动画。模式1缺少CUT23另有明确失败验收，模式0正例没有代表所有地图。[规格](logic-protocol-spec.md#stage290-legacy-material-compat) · [记录](validation.md#stage290-legacy-material-compat)

原始37项需求和10个未完成消费者组身份、范围不变。完整资源版本对应、其他玩法／调度、现行交接、实际微信、物理手机及官方验收继续保留。[目标审计](../analysis/game-legacy-material-compat-v1/goal-audit.json)

<a id="stage289-legacy-resource-archive"></a>

## stage289 大型资源包的限定验收

新增独立整套资源ZIP入口，解决旧更新器64条目配置与游戏资源数量、体积不匹配的问题。文件夹入口继续保留，所选ZIP通过相同 `stat/read(path,offset,length)` 消费；生成v2启动材料仍绑定所选固定模块字节。[合同](logic-protocol-spec.md#stage289-legacy-resource-archive) · [验证](validation.md#stage289-legacy-resource-archive)

1,072个实际材料文件已做全内容校验，桌面／触屏模拟网页与源码／生成Page完成12条ZIP流程，另有2条文件夹流程。这里没有把素材版本兼容或实际微信验收标为完成；37项原始需求和10个未完成消费者组的身份、范围及未决项保持。[目标审计](../analysis/game-legacy-resource-archive-v1/goal-audit.json)

<a id="stage288-legacy-battle-audio"></a>

## stage288 战斗声音的限定验收

已将既有身体／动画和输入音效事件接入共享选择器及网页、wx适配音频端口。固定表包含270个编号、260个独立文件路径；原生声像采用单侧衰减，重复抑制按更新次数推进。[规格](logic-protocol-spec.md#stage288-legacy-battle-audio) · [验证](validation.md#stage288-legacy-battle-audio)

37项原始需求和10个未完成消费者组身份保持。原生应用的完整音频调度、环境循环声音、完整资源导入、实际小程序和设备仍在范围内。[目标清单](../analysis/game-legacy-battle-audio-v1/goal-audit.json)

<a id="stage287-legacy-battle-detached-rid"></a>

## stage287 106 RID2000的可追溯结果

106的RID记录带2000且登记槽0存在时，现按原分身存储与元数据路由执行。720组队列覆盖十等级、六种角色关系、十二种标志；29种回调覆盖外部施法者、宠物、自身、多次RID和后续普通命中。原有骑乘／附属清除、槽0晚删除和旧动作尾分别验收。[规格](logic-protocol-spec.md#stage287-legacy-battle-detached-rid) · [验收](validation.md#stage287-legacy-battle-detached-rid)

无2000的106 RID、低等级116 RID、401自身效果与其他未知上下文继续明确拒绝，保持37项原始需求与10个未完成消费者组身份。局部验证继续服务于完整游戏与平台验收。[目标清单](../analysis/game-legacy-battle-detached-rid-v1/goal-audit.json)

<a id="stage286-legacy-battle-impact-skills"></a>

## stage286 五类冲击消费者的证据与缺口

SKL4／97／106／111／116的共同字段、四格元组、分身与投射、目标反应及收尾已进入共享核心。4,800组队列覆盖五类、十等级、六种角色关系和十六种标志；64种轨迹覆盖普通／暴击／零值／闪避／抵挡／恢复／反射／自身／倒地／多目标及RID。[规格](logic-protocol-spec.md#stage286-legacy-battle-impact-skills) · [验收](validation.md#stage286-legacy-battle-impact-skills)

106与低等级116的RID、4的隐藏偏转、空目标仍以明确原因拒绝且不改变身体状态。三种自身等待按原恢复路径验收。37项原始需求、10个未完成组身份与范围保持；完整SKL、完整游戏和实际平台验收继续推进。[目标清单](../analysis/game-legacy-battle-impact-skills-v1/goal-audit.json)

<a id="stage285-legacy-battle-upper-skills"></a>

## stage285 六类上位消费者的可追溯结果

SKL107／108／109／112／114／117的限定字段与回调已接入。4,320组独立队列覆盖六类、十等级、六种角色关系和十二种标志；26种独立轨迹覆盖成功／失败、自身、宠物、等级9、反射、分身和等待。SKL107的成功文本与空112、本地244等其他组合仍有明确缺口。[规格](logic-protocol-spec.md#stage285-legacy-battle-upper-skills) · [验收](validation.md#stage285-legacy-battle-upper-skills)

37项原始需求、10个未完成消费者组及其来源身份保持；本轮局部消费者验证不表示全部SKL、完整游戏或实际平台完成。[目标清单](../analysis/game-legacy-battle-upper-skills-v1/goal-audit.json)

<a id="stage284-legacy-battle-skill99"></a>

## stage284 六类状态技能的可追溯结果

SKL99–104共用的生产者、153／140反应、持久图标和C消息更新已实现。2,520组独立队列覆盖六类、十等级、六种角色关系和七种标志；15种独立完整轨迹及真实管理器回调覆盖自身、重复、多个目标、宠物、既有图标和空列表。[规格](logic-protocol-spec.md#stage284-legacy-battle-skill99) · [验收](validation.md#stage284-legacy-battle-skill99)

37项原始需求和10个未完成消费者组身份与范围保持，不把六类局部结果写成全部SKL、整个游戏或实际平台完成。[目标清单](../analysis/game-legacy-battle-skill99-v1/goal-audit.json)

<a id="stage283-legacy-battle-self-flags"></a>

## stage283 自身结果标志与真实消费者

普通20类成对自身记录已从位白名单改为完整结果字保留。6,800组公共输入覆盖20类别、10等级、零值、32个单独位及全置位；独立原版方程另有2,800组队列、15种有限回调前缀及完整RGBA。38种完整回调及三种场景乘四个产品入口另行验收。[规格](logic-protocol-spec.md#stage283-legacy-battle-self-flags) · [验收](validation.md#stage283-legacy-battle-self-flags)

37项原始需求与10个未完成消费者组的身份及范围保留，未将该局部结果写成整个游戏或实际平台完成。[目标清单](../analysis/game-legacy-battle-self-flags-v1/goal-audit.json)

<a id="stage282-legacy-battle-self-guard"></a>

## stage282 自身护卫及重合角色

已接入普通20类自身护卫记录。14,000组队列输入覆盖20类别、10等级、5种角色关系和14种标志；128组释放检查涵盖E000、零值、倒地及后续目标。49种完整回调包含既有护卫别名回归，三种产品场景乘四种入口共12条本地TCP流程。[规格](logic-protocol-spec.md#stage282-legacy-battle-self-guard) · [验收](validation.md#stage282-legacy-battle-self-guard)

37项原始需求与10个未完成消费者组的身份和范围继续保留。剩余自身结果位、完整玩法、现行交接与实际平台仍待完成。[目标清单](../analysis/game-legacy-battle-self-guard-v1/goal-audit.json)

<a id="stage281-legacy-battle-self-metadata"></a>

## stage281 自身资源和状态元数据覆盖

新增9种元数据标志及选定组合，规划矩阵涵盖20类别×10等级×10种标志输入。67种实际回放核对消息顺序、RID游标、资源／骑乘／附属图像、状态清除与回合结果；网页及Page的12条本地TCP流程验证接入。[规格](logic-protocol-spec.md#stage281-legacy-battle-self-metadata) · [验收](validation.md#stage281-legacy-battle-self-metadata)

37项原始需求及10个未完成消费者组的身份和范围继续保留。自身护卫别名、其他特殊上下文、完整玩法、现行交接与真实平台仍待完成。[目标清单](../analysis/game-legacy-battle-self-metadata-v1/goal-audit.json)

<a id="stage280-legacy-battle-reentry"></a>

## stage280 连续战斗的产品验收补齐

实际产品退出后第二场本地 TCP 缺口已补齐。三种首场结果乘四种入口均完成两场，明确核对新角色和数值、回合重置、技能结果、退出与回场移动；同一连接和两次退出由独立 Python 测试端逐包确认。[验收](validation.md#stage280-legacy-battle-reentry)

37项原始需求与10个未完成消费者组及其文件身份继续保留，未整体标完成。剩余自身资源／状态元数据、护卫别名、完整玩法、现行交接与真实微信／手机继续验收。[目标清单](../analysis/game-legacy-battle-reentry-v1/goal-audit.json) · [开发顺序](development-plan.md#stage280-legacy-battle-reentry)

<a id="stage279-legacy-battle-self-control"></a>

## stage279 自身控制位、自动退出与组件复用

普通 20 类自身记录增加蓄力、倒地、散开控制，2,600 个类别／等级／标志组合与 161 种实际回放已验证。新增自身多角色冻结、反射释放后续动作、主控停止和远端移除的证据。[规格](logic-protocol-spec.md#stage279-legacy-battle-self-control) · [验收](validation.md#stage279-legacy-battle-self-control)

回放结果为 109 种等待恢复、24 种角色移除、24 种停止、4 种自然完成；每种随后通过公共入场接口复用同一命令所有者完成新回合。这是组件复用验收。12 条产品本地流程另外覆盖退出和回场移动，未据此声明产品第二场或真实平台完成。37 项原始需求、10 个消费者组保留。[目标核对](../analysis/game-legacy-battle-self-control-v1/goal-audit.json)

<a id="stage278-legacy-battle-self-special"></a>

## stage278 自身 E000 组合进入真实消费者

已补齐普通 20 类自身记录的三类结果位及七种非空组合，共 1,400 个类别／等级／标志组合。161 种实际回放覆盖优先顺序、零值、负值、有符号整数边界、槽 20 别名、连续自身及前后他人记录；费用与回合仍由原有所有者推进。[规格](logic-protocol-spec.md#stage278-legacy-battle-self-special) · [验收](validation.md#stage278-legacy-battle-self-special)

28 种回放自然结束，其余 133 种沿用既有等待恢复。十二条产品入口核对回合、费用、结果、退出和恢复移动。37 项原始需求、10 个消费者组与完整玩法／实际平台缺口均未缩减。[目标核对](../analysis/game-legacy-battle-self-special-v1/goal-audit.json)

<a id="stage277-legacy-battle-self-family"></a>

## stage277 自身记录扩展与预检一致性

普通成对家族的基础自身记录已扩展至 20 类，类别／等级矩阵共 200 个组合。新增实际回放覆盖类别 5／6、75–81、84／85／87、95／110、258／259／266，以及零值、别名和前后连续记录；保留未核对的特殊结果拒绝。[规格](logic-protocol-spec.md#stage277-legacy-battle-self-family) · [验收](validation.md#stage277-legacy-battle-self-family)

32 种回放均使用既有等待恢复；12 条产品入口核对回合 1、费用、退出及恢复移动。37 项原始需求、10 个消费者组、完整玩法及实际平台缺口均未缩减。[目标核对](../analysis/game-legacy-battle-self-family-v1/goal-audit.json)

<a id="stage276-legacy-battle-self-pair"></a>

## stage276 普通自身成对结果有实际消费者

类别 0／1／3 的普通命中、零值、闪避、回避、自身在连续列表前后及槽 20 别名已进入实际规划与回调。新增能力限定结果位 `0x10b`；特殊结果及其他未核对类别继续显式拒绝。[规格](logic-protocol-spec.md#stage276-legacy-battle-self-pair) · [验收](validation.md#stage276-legacy-battle-self-pair)

十种原创场景均触发原有等待恢复，未列为自然完成。八条产品本地入口核对回合、费用、退出及移动，Page 已增加显式回合计数断言。37 项原始需求、10 个消费者组与完整玩法／真实平台缺口均保留。[目标核对](../analysis/game-legacy-battle-self-pair-v1/goal-audit.json)

<a id="stage275-legacy-battle-weather-targets"></a>

## stage275 SKL401 重复效果进入实际队列

同一身体现在按每次目标出现累积 0、35、207 和效果元组，移除了 `skill401-repeated-effect-target` 的统一拒绝。100 个技能号、槽别名、66／67 次容量边界、五种实际回放和八条产品本地入口已验证。[规格](logic-protocol-spec.md#stage275-legacy-battle-weather-targets) · [验收](validation.md#stage275-legacy-battle-weather-targets)

先普通后效果可自然结束，其余四种原创排列走已有等待恢复。自身带效果的上下文仍显式拒绝；原版动态、现行交接、完整玩法与实际平台继续验收，37 项需求及 10 个消费者组未整体完成。[目标核对](../analysis/game-legacy-battle-weather-targets-v1/goal-audit.json)

<a id="stage274-legacy-battle-pursuit-linked"></a>

## stage274 SKL400 联动消费者进入共享核心

联动结果从已有槽／标志对形成的元组读取三个资源值，不新增消息字段。类型 31 副本、父游标推进后的目标重读、资源隐藏和不完整组的写入前拒绝已实现，并通过源码、生成核心及网页／Page 的本地收包入口。[规格](logic-protocol-spec.md#stage274-legacy-battle-pursuit-linked) · [验收](validation.md#stage274-legacy-battle-pursuit-linked)

四种原创联动场景均经既有等待恢复，未列为自然完成。原图形 0 后端像素、原版动态、完整玩法与实际平台仍待验证；37 项需求和 10 个消费者组未整体完成。[目标核对](../analysis/game-legacy-battle-pursuit-linked-v1/goal-audit.json)

<a id="stage273-legacy-battle-pursuit-targets"></a>

## stage273 SKL400 重复列表进入实际消费者

修正旧有重复目标拒绝：同一登记身体现在累积每次出现所需的动作及速度元组，施法者保留完整目标列表。来源、原创队列、实际回调、生成核心和网页／Page 本地收包路径均已核对。[规格](logic-protocol-spec.md#stage273-legacy-battle-pursuit-targets) · [验收](validation.md#stage273-legacy-battle-pursuit-targets)

重复自身使用已有等待恢复，未列为自然完成；关联位 `0x800000` 仍显式未支持。37 项原始需求和 10 个消费者组未整体完成，完整玩法与实际平台继续推进。TalonBrain 查询缺项目需求索引角色，仓库索引作为当前入口。[目标核对](../analysis/game-legacy-battle-pursuit-targets-v1/goal-audit.json)

<a id="stage272-legacy-battle-round-ack"></a>

## stage272 A 标记按当前登记身体判定

旧版战斗接收器修正 RID0 新槽没有 C 数据行时的 A 标记漏报。原版来源、失败复现、共享修正、生成核心和本地 TCP 已接通验证。未来 A 在下一回合输入初始化时重用；过期 A 不打标，P 中的候选操作席位经 C 消费后生效。[通信规格](logic-protocol-spec.md#stage272-legacy-battle-round-ack) · [验收](validation.md#stage272-legacy-battle-round-ack)

37 项原始需求和 10 个消费者组仍未整体完成。下一步继续明确缺失的 SKL 与产品玩法，实际平台独立验收。TalonBrain 查询缺项目需求索引角色，仓库需求索引继续作为入口。[目标核对](../analysis/game-legacy-battle-round-ack-v1/goal-audit.json)

<a id="stage271-legacy-battle-character-queue"></a>

## stage271 C 接收与实际消费者

旧版战斗消费者组新增正常入口与本地 TCP 证据：执行中的 C 更新先排队，回合排空后的阶段 2 才应用角色值、清理缺席槽，结束标志也经同一消费者处理。三条消息在三个回合中逐条消费并环绕。独立退出通知走即时标记路径。[通信规格](logic-protocol-spec.md#stage271-legacy-battle-character-queue) · [目标核对](../analysis/game-legacy-battle-character-queue-v1/goal-audit.json)

37 项原始需求和 10 个消费者组仍未整体完成；下一步核对提前 A/P 更新、其余玩法及实际平台。TalonBrain 查询的项目需求索引角色仍缺失，当前仓库索引作为需求入口。

<a id="stage270-legacy-battle-exit-rid0"></a>

## stage270 反射死亡与尾随交接的回收

旧版战斗消费者组补齐致死反射退出、待处理 RID0 回收和再次入场的证据。B 占用施法槽的路径也完成有限回放及本地入口验收。后续继续核对 C 更新和移除的实际消费时序、完整玩法、现行版及真实设备与官服。[通信规格](logic-protocol-spec.md#stage270-legacy-battle-exit-rid0) · [目标核对](../analysis/game-legacy-battle-exit-rid0-v1/goal-audit.json)

<a id="stage269-legacy-battle-reflected-rid0"></a>

## stage269 反射回程中的 RID0

旧版战斗消费者组补齐反射内联资源卸载坐骑后的交接。保留动画对象与普通角色外观分别更新，最终按已读取的 RID0 登记 A、B。原主体离场时回收未登记对象。致死反射、B 占用施法槽、原版动态与各真实环境继续追踪。[通信规格](logic-protocol-spec.md#stage269-legacy-battle-reflected-rid0) · [目标核对](../analysis/game-legacy-battle-reflected-rid0-v1/goal-audit.json)

<a id="stage268-legacy-battle-casting-rid0"></a>

## stage268 施法尾随 RID0

旧版战斗消费者组补齐普通 SKL19 施法尾随 RID0 的游标处理。普通、空和内联目标列表在共享回放中均可正确交接。远端施法者的有信号路径经桌面网页、移动视口及两种 Page 宿主验收。反射中间队列、倒地或离场主体、原版动态、现行版和外部环境仍在追踪。[通信规格](logic-protocol-spec.md#stage268-legacy-battle-casting-rid0) · [目标核对](../analysis/game-legacy-battle-casting-rid0-v1/goal-audit.json)

<a id="stage267-legacy-battle-rid0-flight"></a>

## stage267 RID0 多帧与 B 槽变更

旧版战斗消费者组补齐 A、B 同槽的多帧下降。原父身体仍在时，B 换人按当前槽位续接，B 清空按 A 的实际归属完成或回收。SKL19 尾随元组、倒地或离场主体、原版动态、现行版、真机、微信运行时及官服继续跟踪。[通信规格](logic-protocol-spec.md#stage267-legacy-battle-rid0-flight) · [目标核对](../analysis/game-legacy-battle-rid0-flight-v1/goal-audit.json)

<a id="stage266-legacy-battle-rid0-ownership"></a>

## stage266 RID0 的等待与对象移交

旧版战斗消费者组新增首对缺席及空闲异槽 A 的尾随准备与归位，并验证父身体在 B 登记后离场时的分段清理。父身体仍在时 B 先离场、倒地或退场的原主体、原版动态、现行版、手机真机、微信运行时与官服继续跟踪。[通信规格](logic-protocol-spec.md#stage266-legacy-battle-rid0-ownership) · [目标核对](../analysis/game-legacy-battle-rid0-ownership-v1/goal-audit.json)

<a id="stage265-legacy-battle-rid0-interruption"></a>

## stage265 主段中断后的 RID0

旧版战斗消费者组补齐 SKL72 后段缺席时的一类尾随交接，并验证父身体在动作 221 前离场后释放其尚未登记的交接对象。首配中断、其他 A 槽归属、交接中途离场，以及原版动态、现行版、手机真机、微信运行时和官服继续跟踪。[通信规格](logic-protocol-spec.md#stage265-legacy-battle-rid0-interruption) · [目标核对](../analysis/game-legacy-battle-rid0-interruption-v1/goal-audit.json)

<a id="stage264-legacy-battle-rid0-receive"></a>

## stage264 尾随 RID0

旧版 SKL72 双护卫主段的原身体可继续消费普通及特殊结果，然后使用尾随 RID0 提供的身份、资源和数值完成交接。专项验证包括内联 RID 共存、同槽及多交接记录、两个发送者和 B 槽提前被覆盖。主段缺席中断、原版运行、现行版交接、真机、微信运行时和官服待验收。[协议规格](logic-protocol-spec.md#stage264-legacy-battle-rid0-receive) · [目标核对](../analysis/game-legacy-battle-rid0-receive-v1/goal-audit.json)

<a id="stage263-legacy-battle-following-results"></a>

## stage263 后续物理结果

旧版 SKL72 普通双护卫前缀后的直达结果已覆盖普通、反射、治疗、免伤及其内联 RID。专项验证包含受击后续队列、组合标记优先级、重启信号和同槽替换。尾随 RID0 的受击交接、原版运行、现行版交接、手机真机、微信运行时及官服仍待验收。[规格](logic-protocol-spec.md#stage263-legacy-battle-following-results) · [目标核对](../analysis/game-legacy-battle-following-results-v1/goal-audit.json)

<a id="stage262-legacy-battle-late-recipient"></a>

## stage262 已排队攻击者的后续受击

旧版战斗消费者组新增一项本地验收。已排队角色可被先到的命中启动，完成自己的攻击后消费对应的受击等待。覆盖同一发送者的两次命中、两个发送者、原身体替换以及发送者离场。特殊结果、附带 RID 及原版运行对照继续跟踪。[协议规格](logic-protocol-spec.md#stage262-legacy-battle-late-recipient) · [目标核对](../analysis/game-legacy-battle-late-recipient-v1/goal-audit.json)

<a id="stage261-legacy-battle-independent-following"></a>

## stage261 普通物理回合中的未启动队列

旧版战斗消费者组增加未起步后续攻击者的本地归位验收。覆盖该攻击者面向独立目标，以及护卫在等候其结果时的两种输入。同槽换人和存在后续受击引用的输入保留原有等待流程。后续受击能否启动已有队列、特殊结果和原版运行对照继续跟踪。[协议规格](logic-protocol-spec.md#stage261-legacy-battle-independent-following) · [目标核对](../analysis/game-legacy-battle-independent-following-v1/goal-audit.json)

<a id="stage260-legacy-battle-missing-lookahead"></a>

## stage260 回合提交前的身体缺席

旧版战斗消费者组增加一项本地验收。M 中的 PLV 可以先移除首段护卫前瞻目标，或移除第二段护卫前瞻目标。两种输入都能释放未播放的前缀并继续同组 CFP。独立后续攻击者起步、保留队列的缺席转向、特殊结果与旧版运行对照仍为开放项。[协议规格](logic-protocol-spec.md#stage260-legacy-battle-missing-lookahead) · [目标核对](../analysis/game-legacy-battle-missing-lookahead-v1/goal-audit.json)

<a id="stage259-legacy-battle-following-strikes"></a>

## stage259 多次后续攻击的回合与身体身份

完成普通 SKL72 多击和两名护卫共用受击角色的本地验收，覆盖攻击者提前离场、第一击落地后离场、蓄力中替换以及受击者随后发起另一击。独立对端核对 8 条新增本机入口。原 37 项需求与 10 个消费者组继续跟踪。独立攻击者启动、提交前缺席、原版动态、真机和官服仍在清单中。[阶段计划](../analysis/game-legacy-battle-following-strikes-v1/implementation-plan.json) · [验收](validation.md#stage259-legacy-battle-following-strikes) · [目标审计](../analysis/game-legacy-battle-following-strikes-v1/goal-audit.json)

<a id="stage258-legacy-battle-repeated-protection"></a>

## stage258 同一角色受保护两次与后续命中

完成普通 SKL72 同一角色受保护两次的本地验收，包含同一护卫、两名护卫、零结果转向、单条后续攻击和角色替换。独立对端核对 12 条新增本机入口。原 37 项需求与 10 个消费者组继续跟踪，多条后续攻击的离场、原版动态、真机和官服验收仍在清单中。[阶段计划](../analysis/game-legacy-battle-repeated-protection-v1/implementation-plan.json) · [验收](validation.md#stage258-legacy-battle-repeated-protection) · [目标审计](../analysis/game-legacy-battle-repeated-protection-v1/goal-audit.json)

<a id="stage257-legacy-battle-guard-wait"></a>

## stage257 外层护卫和共享护卫的本机回合

外层 SKL72、SKL113 和普通 SKL72 单护卫保护两个不同角色的原创 M 回合已验收，护卫退场、同槽新角色及独立 CFP 另有断言。八条新增本机 TCP 路径覆盖两个 Web 视口及两个 Page 入口。原 37 项需求与 10 个消费者组继续跟踪。重复保护同一角色、原版运行、真机和官服验收仍在清单中。[阶段计划](../analysis/game-legacy-battle-guard-wait-v1/implementation-plan.json) · [验收](validation.md#stage257-legacy-battle-guard-wait) · [目标审计](../analysis/game-legacy-battle-guard-wait-v1/goal-audit.json)

<a id="stage256-legacy-battle-skl113-wire"></a>

## stage256 SKL113 的两种读法与本机回合

已验证固定旧版的预读和执行游标关系，三个原创 M 夹具经实际命令所有者和本机 TCP 触发嵌套结果及后续耗魔。另验收无法到达预约记录时的拒绝、内嵌护卫标记触及预读槽位边界及附带 RID 起点冲突。原 37 项需求及 10 个消费者组继续跟踪，原版动态、设备及官服验收仍待完成。[阶段计划](../analysis/game-legacy-battle-skl113-wire-v1/implementation-plan.json) · [验收](validation.md#stage256-legacy-battle-skl113-wire) · [目标审计](../analysis/game-legacy-battle-skl113-wire-v1/goal-audit.json)

<a id="stage255-legacy-battle-guard-alias"></a>

## stage255 同槽自身结果和嵌套交接边界

共享核心经本机测试完成 SKL266 变体 2 的同槽自身结果、有飞行目标的近距离返还及 SKL72 待启动嵌套护卫退场。验收覆盖独立护卫与受击角色兼任护卫的既有流程。原 37 项需求与 10 个消费者组继续追踪，设备、现行版及官服验收仍待完成。[阶段计划](../analysis/game-legacy-battle-guard-alias-v1/implementation-plan.json) · [验收](validation.md#stage255-legacy-battle-guard-alias) · [目标审计](../analysis/game-legacy-battle-guard-alias-v1/goal-audit.json)

<a id="stage254-legacy-battle-guard-departure"></a>

## stage254 飞行物放行与护卫退场

SKL266 的飞行物复用、受击角色的护卫等待及动作 216 均已核对。SKL72 护卫在动作 4 和 10 被命令所有者移除时，局部续接保留后续命令和同槽新角色。SKL266 第二趟飞行中护卫退场也已覆盖。施法者兼任护卫、启动前退场、源端动态验证及平台兼容继续跟踪。[阶段计划](../analysis/game-legacy-battle-guard-departure-v1/implementation-plan.json) · [验收](validation.md#stage254-legacy-battle-guard-departure) · [目标审计](../analysis/game-legacy-battle-guard-departure-v1/goal-audit.json)

<a id="stage253-legacy-battle-guard-release"></a>

## stage253 护卫的回合所有权

SKL72 真实 PLV 退场已覆盖跨角色放行、护卫命中与后续指令。回调开始后的同槽替换另经命令所有者验证。SKL266 变体 2 的无飞行目标及独立护卫已覆盖动作 216 和回合完成。进入正变体前的 RID 栈内容、SKL113 嵌套前置解析、原版动态结果和平台兼容仍需证据。[阶段计划](../analysis/game-legacy-battle-guard-release-v1/implementation-plan.json) · [验收](validation.md#stage253-legacy-battle-guard-release) · [目标审计](../analysis/game-legacy-battle-guard-release-v1/goal-audit.json)

<a id="stage252-legacy-battle-physical-boundaries"></a>

## stage252 嵌套目标与仅自身结果

SKL72 的嵌套目标缺席已覆盖排队前和动作 232 两个时点。正变体的空目标列表、通用自身列表和 SKL266 最终自身结果沿正常命令执行。带护卫的后段放行、SKL113 嵌套的预读兼容和缺少外部 RID 时的字段继续跟踪。[阶段计划](../analysis/game-legacy-battle-physical-boundaries-v1/implementation-plan.json) · [验收](validation.md#stage252-legacy-battle-physical-boundaries) · [目标审计](../analysis/game-legacy-battle-physical-boundaries-v1/goal-audit.json)

<a id="stage251-legacy-battle-physical-registry"></a>

## stage251 空护卫和空施法者

固定旧版的普通、串联、嵌套和 SKL266 自身护卫，以及 27 类正变体的空施法者已覆盖。保留预读预约、已验证的同组边界和后续命令。普通 C 换表与 PLV 动作 49 的空槽来源分别验收。原版空槽后的实际运行和真实平台继续跟踪。[阶段计划](../analysis/game-legacy-battle-physical-registry-v1/implementation-plan.json) · [验收](validation.md#stage251-legacy-battle-physical-registry) · [目标审计](../analysis/game-legacy-battle-physical-registry-v1/goal-audit.json)

<a id="stage250-legacy-battle-assist-terminator"></a>

## stage250 SKL98 协作者字段的回合边界

两种协作者 `FF` 已覆盖单条回合、同组后续、独立 `RID0` 与后续施法。变体 7 的状态 32 伙伴在换位后遇到缺席目标时保留角色注册和原阵位。空命中动作 84、原版执行游标和真实环境继续跟踪。[阶段计划](../analysis/game-legacy-battle-assist-terminator-v1/implementation-plan.json) · [验收](validation.md#stage250-legacy-battle-assist-terminator) · [目标审计](../analysis/game-legacy-battle-assist-terminator-v1/goal-audit.json)

<a id="stage249-legacy-battle-physical-missing"></a>

## stage249 物理技能的缺席参与者

固定旧版的 29 类配对技能均核验首攻击者与首目标缺席。专项还覆盖后续攻击者与目标、SKL260 链目标、SKL73 与普通正变体目标以及 SKL266 保存自身结果。缺席护卫、正变体空施法者、原版异常游标及真实平台验收继续跟踪。[阶段计划](../analysis/game-legacy-battle-physical-missing-v1/implementation-plan.json) · [验收](validation.md#stage249-legacy-battle-physical-missing) · [目标审计](../analysis/game-legacy-battle-physical-missing-v1/goal-audit.json)

<a id="stage248-legacy-battle-family-missing"></a>

## stage248 54 类技能缺席参与角色

36 类状态技、13 类施法技、4 类数值技和 SKL82 已在固定旧版共享战斗入口覆盖缺席施法者。49 类使用目标列表的技能另覆盖缺席目标，专项核对了反射结算和同组续接。物理技能族、原版异常游标的运行结果、现行版和官方验收继续跟踪。[阶段计划](../analysis/game-legacy-battle-family-missing-v1/implementation-plan.json) · [验收](validation.md#stage248-legacy-battle-family-missing) · [目标审计](../analysis/game-legacy-battle-family-missing-v1/goal-audit.json)

<a id="stage247-legacy-battle-missing"></a>

## stage247 SKL98 缺席参与角色

在已有变体 0 至 14 上增加缺席施法者、协作者和目标的清理与续接。核验了变体 7 已发生的换位、同组与独立后续命令及忙碌等待。其他技能族的缺席分支、原版异常游标、附带 RID 的其他组合继续跟踪。原 37 项要求和 10 个消费者组沿用目标审计。

[阶段计划](../analysis/game-legacy-battle-missing-v1/implementation-plan.json) · [验收](validation.md#stage247-legacy-battle-missing) · [目标审计](../analysis/game-legacy-battle-missing-v1/goal-audit.json)

<a id="stage246-legacy-battle-status-assist"></a>

## stage246 SKL98 协作者命中与回复

固定旧版的共享战斗队列现覆盖 SKL98 变体 0 至 14。本轮核验变体 12 的资源记录和命中、变体 13 的逐目标回复，以及两者的本方停步与非本方离场。缺席角色清理、其他附带 RID 组合和原版资源运行仍继续跟踪。原 37 项要求与 10 个消费者组沿用目标审计。

[阶段计划](../analysis/game-legacy-battle-status-assist-v1/implementation-plan.json) · [验收](validation.md#stage246-legacy-battle-status-assist) · [目标审计](../analysis/game-legacy-battle-status-assist-v1/goal-audit.json)

<a id="stage245-legacy-battle-status-position"></a>

## stage245 SKL98 配对换位

固定旧版 SKL98 已覆盖 13 个变体。本阶段完成变体 7 的配对槽、状态 32、重复换位、施法者 RID0 和下一轮角色记录。本轮覆盖了原有范围内的角色体及附属对象。变体 12、13、缺席目标清理和其他附带 RID 组合继续跟踪，原 37 项要求和 10 个消费者组沿用目标审计。

[阶段计划](../analysis/game-legacy-battle-status-position-v1/implementation-plan.json) · [验收](validation.md#stage245-legacy-battle-status-position) · [目标审计](../analysis/game-legacy-battle-status-position-v1/goal-audit.json)

<a id="stage244-legacy-battle-status-slots"></a>

## stage244 SKL98 放大与缩小退场

两条独立的目标槽列表已实现，连同阶段 242 共覆盖 SKL98 的十二个变体。已核验变体 6、8 的施法者附带 RID0。变体 7、12、13、其他 RID 组合、缺席目标及原 37 项要求和 10 个消费者组继续跟踪。

[阶段计划](../analysis/game-legacy-battle-status-slots-v1/implementation-plan.json) · [验收](validation.md#stage244-legacy-battle-status-slots) · [目标审计](../analysis/game-legacy-battle-status-slots-v1/goal-audit.json)

<a id="stage243-legacy-game-stream"></a>

## stage243 持续游戏连接

本地网页入口已跨过旧桥接时限，并在空闲发包后继续处理游戏操作。固定旧版共享会话的保活和关闭按本轮验收跟踪。原 37 项要求与 10 个未完成消费者组继续列入目标审计。

[阶段计划](../analysis/game-legacy-game-stream-v1/implementation-plan.json) · [验收](validation.md#stage243-legacy-game-stream) · [目标审计](../analysis/game-legacy-game-stream-v1/goal-audit.json)

<a id="stage242-legacy-battle-status-variant"></a>

## stage242 SKL98 状态、击倒与复活

已完成固定旧版共用目标记录的十个 SKL98 变体，并修正 SKL86 和 SKL98 共用的当前 HP 清零。原 37 项要求和 10 个未完成消费者组继续跟踪。

[阶段计划](../analysis/game-legacy-battle-status-variant-v1/implementation-plan.json) · [验收](validation.md#stage242-legacy-battle-status-variant) · [目标审计](../analysis/game-legacy-battle-status-variant-v1/goal-audit.json)

<a id="stage241-legacy-battle-summon"></a>

## stage241 SKL93 角色入场与替换

固定旧版 SKL93 已有共享实现及四条本机 TCP 入口验收。原 37 项要求和 10 组未完成消费者继续保留。下一步追踪其余玩法分支和现行版交接。

[阶段计划](../analysis/game-legacy-battle-summon-v1/implementation-plan.json) · [验收](validation.md#stage241-legacy-battle-summon) · [目标审计](../analysis/game-legacy-battle-summon-v1/goal-audit.json)

<a id="stage240-legacy-battle-city-return"></a>

阶段 240 在网页与微信 Page 接入固定旧版战斗回城，涵盖战斗退出、`>HY` 接管和 `TfD` 的主状态分流。原 37 项需求与 10 个消费者组继续跟踪。[阶段需求](development-plan.md#stage240-legacy-battle-city-return)

<a id="stage239-legacy-city-return"></a>

阶段 239 接入固定旧版普通地图的注销回城，覆盖换图、提前重建和转场后继续移动。战斗回城及其余 37 项需求和 10 个消费者组继续按原目标跟踪。[阶段需求](development-plan.md#stage239-legacy-city-return)

<a id="stage238-legacy-battle-alternate-exit"></a>

阶段 238 在网页与微信 Page 接入固定旧版的主动回选服。注销回城的生产者已确认，场景重建仍在原 37 项需求和 10 个消费者组的跟踪范围内。[阶段需求](development-plan.md#stage238-legacy-battle-alternate-exit)

<a id="stage237-legacy-music-phases"></a>

阶段 237 接入固定旧版选服与战斗音乐，覆盖普通战斗退出的渐隐和返回地图后的选曲。原 37 项要求与 10 个待完成消费者组继续跟踪。[阶段需求](development-plan.md#stage237-legacy-music-phases)

<a id="stage236-legacy-audio"></a>

阶段 236 接入固定旧版 `TfD` 场景选曲和 `VKW` 退场音效及渐隐。原 37 项要求和 10 个待完成消费者组继续跟踪。[阶段需求](development-plan.md#stage236-legacy-audio)

<a id="stage235-legacy-server-return-fade"></a>

阶段 235 实现固定旧版服务端退出的第 14 类画面过渡，并验证普通地图和战斗画面的移交。原 37 项要求及 10 个待完成消费者组继续跟踪。[阶段需求](development-plan.md#stage235-legacy-server-return-fade)

<a id="stage234-legacy-server-return"></a>

阶段 234 核对并实现固定旧版服务端退出通知、停用操作和确认后关闭连接。原 37 项要求及 10 个待完成消费者组继续跟踪。[阶段需求](development-plan.md#stage234-legacy-server-return)

<a id="stage233-legacy-frame-startup"></a>

阶段 233 将固定旧版普通帧和角色初值接到单字段启动配置。兼容性仍按来源和平台分别验收，原 37 项要求及 10 个待完成消费者组继续跟踪。[阶段需求](development-plan.md#stage233-legacy-frame-startup)

<a id="stage232-legacy-ordinary-context"></a>

阶段 232 将固定旧版普通入场的移动初值、时段与输入接入共享客户端。网页和微信的本机入口已完成实际移动请求和换场。继续追踪原 37 项要求和 10 个未完成消费者组。[需求和后续](development-plan.md#stage232-legacy-ordinary-context)

<a id="stage231-legacy-display-startup"></a>

阶段 231 从固定旧版文件核对初始画幅、投影中心和相机写入，并接入网页和微信的普通入场。继续追踪原 37 项要求和 10 个未完成消费者组。[需求和后续](development-plan.md#stage231-legacy-display-startup)

<a id="stage230-legacy-config-startup"></a>

阶段 230 闭合固定旧版 WinMain 的命令尾与 Config.dat 首行到资源消费者，网页和微信已验证选择带配置的本地资源。仍追踪原 37 项要求和 10 个未完成消费者组。[需求和后续](development-plan.md#stage230-legacy-config-startup)

<a id="stage229-legacy-startup-materials"></a>

阶段 229 核验现行登录器写入和固定旧版游戏读入的分别来源。旧版模块摘要可由选定文件自动生成，桌面网页、移动尺寸网页和微信 Page 已完成本机首包及角色列表验证。继续追踪原 37 项要求和 10 个未完成消费者组。[需求与后续](development-plan.md#stage229-legacy-startup-materials) · [验收](validation.md#stage229-legacy-startup-materials)

<a id="stage228-wechat-special-dialogs"></a>

阶段 228 补齐微信物品交接、双字段、外观和图文确认，接入共享对话图像绘制。固定旧样本的收发和本机 Canvas 写入已核验。完整外观与 NPC 图像、入站邀请、微信运行、真机、现行交接与官服仍待验证。原 37 项要求与 10 个未完成消费者组继续追踪。[验收](validation.md#stage228-wechat-special-dialogs) · [目标审计](../analysis/game-wechat-special-dialogs-v1/goal-audit.json)

<a id="stage227-wechat-family-board"></a>

阶段 227 补齐微信家族资料、称号权限、相邻邀请与成员管理，以及家族兽和留言板。固定旧样本的发包与回包已由独立本机对端核验。入站邀请、其他专用窗口、原版图像、模拟器、真机、现行交接与官服仍待验证。原 37 项要求与 10 个未完成消费者组继续追踪。[验收](validation.md#stage227-wechat-family-board) · [目标审计](../analysis/game-wechat-family-board-v1/goal-audit.json)

<a id="stage226-wechat-storage-trade"></a>

阶段 226 补齐微信银行、仓储、饲料箱和双入口玩家交易。固定旧样本的转移、关闭、报价与失效状态已由独立本机对端核验。家族、留言板、其他地图窗口、原版图像、模拟器、真机、现行交接与官服仍待验证。原 37 项要求与 10 个未完成消费者组继续追踪。[验收](validation.md#stage226-wechat-storage-trade) · [目标审计](../analysis/game-wechat-storage-trade-v1/goal-audit.json)

<a id="stage225-wechat-map-services"></a>

阶段 225 补齐微信治疗、人物技能学习和遗忘、两套宠物训练。固定旧样本的选择、回复和取消已由独立本机对端核验。仓储、交易及其他地图窗口、原版图像、模拟器、真机、现行交接和官服待验。原 37 项要求与 10 个未完成消费者组继续追踪。[验收](validation.md#stage225-wechat-map-services) · [目标审计](../analysis/game-wechat-map-services-v1/goal-audit.json)

<a id="stage224-wechat-inventory-shop"></a>

阶段 224 补齐微信背包操作、地图商人和兑换入口、六类商店及订单再核价。固定样本的本机帧与回包已由独立对端核验。剩余地图窗口、模拟器、真机、现行登录交接和官服仍待验证。原 37 项要求与 10 个未完成消费者组继续追踪。[验收](validation.md#stage224-wechat-inventory-shop) · [目标审计](../analysis/game-wechat-inventory-shop-v1/goal-audit.json)

<a id="stage223-wechat-creation"></a>

阶段 223 补齐微信游戏页的空槽建角、角色名单刷新、拒绝恢复及首次入场。本机已验证双空槽创建后移动，微信模拟器、真机、完整角色管理、现行交接和官方兼容仍待验收。原 37 项要求与 10 个未完成消费者组继续追踪。[验收](validation.md#stage223-wechat-creation) · [目标审计](../analysis/game-wechat-creation-v1/goal-audit.json)

<a id="stage222-wechat-page"></a>

阶段 222 已把固定旧样本支持的选角、入场、地图触控、场景对话、聊天与战斗操作接入微信游戏页，并完成本机页面和 TCP 验证。微信模拟器运行、真机、完整游戏交互、现行登录交接和官服兼容仍待验收。原 37 项要求和 10 个未完成消费者组逐项保留。[阶段验收](validation.md#stage222-wechat-page) · [目标审计](../analysis/game-wechat-page-v1/goal-audit.json)

阶段 221 已完成普通地图气泡、黑名单和滚动公告的 REA 核验、共享实现与网页本机验收。特殊角色、入站邀请、真实联机与平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成普通和小队聊天、显示参数及收包历史的 REA 核验、共享实现和网页本机验收。气泡、公告、入站邀请及应答、真实联机与平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成家族邀请、分配称号、移除和退出的 REA 核验、共享实现和网页本机验收。入站邀请及应答、真实结算、认证与平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成家族资料、成员名单和称号管理的 REA 核验、共享实现和网页本机验收。成员管理的出站流程、真实结算、认证与平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成家族兽信息、权限、喂食、改名与饲料箱的 REA 核验、共享实现和网页本机验收。其余家族窗口、真实结算、认证和平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成银行与仓储存取的 REA 核验、共享实现和网页本机验收。独立窗口、真实结算、认证和平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成物品交接、双项输入、外观和指定图文的 REA 核验、共享实现与网页本机验收。组合外观、其余消费者、真实结算及平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成宠物技能师范普通与扩展窗口的 REA 核验、共享实现和网页本机验收。其余消费者、真实结算和平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成 NPC 买卖与兑换入口、普通技能学习及遗忘的 REA 核验、共享实现和网页本机验收。原版布局、宠物技能、其余消费者及平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成 NPC 治疗与普通图文对话的 REA 核验、共享实现及网页本机验收。其余专用窗口、真实结算、真机与官服验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成玩家交易的 REA 核验、共享实现和双入口本机验收。其余消费者、交易真实结算、真机与官服验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成留言板模式 0x15 的共享实现、双向翻页、发布、删除及关闭的本机验收。玩家交易、其余消费者、真机与官服验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成单项给予模式 0x1f 的共享实现、数量边界、确认与取消的本机验收。其他交易模式、图文、其余消费者、真机与官服验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成物品兑换模式 0x1c 的共享实现、背包容量核对与本机验收。其他交易模式、图文、其余消费者、真机与官服验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成鉴定和修理的共享实现、背包说明显示和本机验收。其他交易模式、图文、其余消费者、真机与官服验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成普通地图商店的购买、出售、数量核对与取消的共享实现和本机验收。鉴定、其他交易模式、图文、其余消费者、真机与官服验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成地图角色右键、普通服务端对话、菜单和中文输入回复的共享实现和本机验收。商店、图文与专用弹窗、其他消费者、真机与官服验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成普通地图转身、地面物品与钱币拾取的共享实现和本机验收。角色交互、商店、其他消费者、真机与官服验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成特殊道具选目标、丢弃和战斗卸武器的共享实现与本机验收。地面拾取、商店和其他消费者、真机与官服验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成地图物品栏的使用、装备、卸下装备、拆分和换槽的本机验证。战斗物品类别已纠正并复测。特殊用物、其他消费者和平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

前序检查点。阶段 221 已完成固定样本的战斗背包更新、交换、物品和装备动作的共享实现及本机验收。普通物品栏、其他消费者和平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/item-input-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-input-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

阶段 221 已完成 CFP 的 MP 更新和 ITM0/7 的共享实现及本机验收。物品选择与发送、其余消费者和平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/mp-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/mp-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

阶段 221 已完成固定样本 REB 变身与 PLV 角色退场的共享实现及本机验证。CFP、其余命令、原版运行边界及平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/actor-transitions-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-transitions-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

阶段221已完成固定样本好友名单、C 入场标记、对侧 MON 和施法提示的本地验证。原生文件缓存、角色名单区、其余消费者及平台验收待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/friend-roster-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/friend-roster-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

阶段221的 CHT/BST 正常播放、Xz@ 计时和提前退场已通过本地验证。完整原生聊天和其他退场分支、其余消费者及平台验收仍待完成。保留 37 项要求和 10 个未完成消费者组。[本轮计划](../analysis/game-battle-shared-storage-v1/side-effects-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/side-effects-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

阶段221的 SKL401 已完成共享天气、目标效果、本机协议和浏览器画布验证。原版其他天气类型、剩余消费者和平台验收仍待完成。保留 37 项要求及 10 个未完成消费者组。[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

阶段221的 SKL400 追踪与离场已通过共享核心、本机 TCP 及浏览器验证。SKL401 天气、关联记录和跨平台验收仍待完成。保留 37 项要求与 10 个未完成消费者组。[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

阶段221继续推进。固定旧样本的 SKL402 已完成共享侧选施法和本地收包验收。SKL400 与 SKL401 已定位部分消费者，仍待实现。保留 37 项原始要求和 10 个未完成消费者组。[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

阶段221为开发中检查点。GMN 呈现、SKL404 同槽恢复和 SKL405 变形已有本地验证。37 项原始要求及 10 个未完成消费者组继续追踪。[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

阶段220继续同一完整目标：**事实**：固定37c4旧样本的CMB（opcode8）已接入shared实际四阶段命令执行。依次准备参与者、等待动作70到齐、按源计数器放行、再由434b90等待归位与释放；普通结果先累计32位有符号伤害，1038标记让前序命中只产生反馈，最后一次扣累计HP。没有生成动作53或MP扣费。 **事实**：当前77个战斗文件1,076/1,076项、当前neutral生成包64/64项通过；四套构建核对687个输入和34个输出，外部导入0。当前物理族主验收本机TCP397次（源码337、生成52、页面8）；新增CMB为14源码、14生成、8页面，调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共46截图，全部正常回合、返回地图与准确后续移动；页面错误、警告、外联0。Browser插件不可用，使用已有Playwright1.64.1。触控HUD核对Hero MP10、替换的OriginalRider HP40/MP8、目标HP51；nextC中的MP7来自新C包，不是合击扣费。 **事实**：256组独立队列、62条轨迹的81,918帧完整状态/拥有存储和3,918帧RGBA通过；59条身体结算、duplicate/self两条有界等待和1条本地退出分别记录。冷状态模型的反射/治疗等保留实际7201忙检查恢复；17条实际管理器入口为14个自然回合、2个等待、1个退出，不把不同初始上下文合并。immune两条结算后残留afterimage节点，9000帧观察不等于完整原生对象池收尾。 **待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。 [需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-combination-v1/validation.json)。

阶段219继续同一完整目标：**事实**：固定37c4旧样本的附带RID0生产者4236d0及动作221已进入shared。每条21字段，名称上限28字节、两组有符号HP/MP、状态与资源按源保留；创建两个隐藏且暂不回调的身体、8个整数盒及16字节逻辑交接对象，再向旧身体追加221和[a,0,a,b]。它与结果RID三资源字属于不同语义。 **事实**：当前75个战斗文件1,058/1,058项、当前neutral生成包46/46项通过；四套构建核对679个输入和34个输出，外部导入0。当前物理族主验收本机TCP369次（源码323、生成38、页面8）；新增RID为10源码、10生成、8页面，额外调试探针不计入。桌面1100×850与触控模拟390×844各4条真实game.html流程，共42截图，全部完成回合、返回地图及准确后续移动；页面错误、警告、外联0。实际HUD显示替换后的OriginalRider HP40/100、MP8/10。原创小像素夹具不代表完整游戏画面。 **事实**：新独立方程覆盖53场景、13,799帧状态、完整拥有存储及1,098帧RGBA；50条身体结算，same-a-multiple有界等待，same-a-b子对象移除与element159两条显式消费者边界分别保留。缺少骑手、当前槽位上下文及未覆盖角色标记原子拒绝；135等共用105c指针分支显式停止，未借独立chant/projectile映射伪造原生共享指针。 **待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。 [需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-attached-rid-v1/validation.json)。

阶段218继续同一完整目标：**事实**：固定37c4样本的73类variant0已接入共有近战生产者424310；十个等级都以38/53开始，不加入147，按实际M记录扣一次MP。护卫、RID元数据、反射/治疗/跳过、击倒、普通后续记录与自身目标保留原始动作顺序。73没有14专用资源映射，普通命中使用1adb1～1adb3随机效果。原先73的variant1/2/3仍走独立远程路径，不增加近战MP扣费。 **事实**：当前73个战斗测试文件完整回归1,046项全部通过；neutral生成包完整34项全部通过。四种构建核对671个输入与34个输出，外部导入0。357次主物理家族本机TCP回执（源码313、生成28、页面16）均校验正常启动、准确指令和清理。桌面1100×850与触控模拟390×844各8条实际game.html流程，共82截图；15条返回地图并继续准确移动，1条保留有界等待后断开。页面错误、警告、外联均为0。 **待验证**：自身、守护别名、缺少结束信号及RID后跟守护的16条轨迹仍有界等待，不能称为自然回合完成。已有7201恢复是独立机制，未注入ready或清理动画信号。20/21号施法者的73击倒收尾按原指令不补11/44；其他通用类别同类边界尚未纳入本轮实现验收。attachedRID消费者4236d0仍原子拒绝，不能以元数据RID三字已支持推定该消费者已完成。 **待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。 [需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-pair73-v1/validation.json)。

阶段217继续同一完整目标：**事实**：按固定37c4样本的424310与40a120接入260首对生产者、201/203移动朝向、204第二目标和14主命中，十个等级、守护、RID、普通后续记录及255结束标记均有独立证据。204在dead*14+24帧处理第二目标，先保存原攻击者再替换父关联；主攻击1af89朝向0，原攻击者仍为260/9时连击朝向1。202单独验证为“元组slot与flags坐标”，不是amount；260生产者并不发出202。 **事实**：71文件完整战斗回归初轮1,012项中1,011通过、1条压力资源重入的“应正常回合”预期失败；生成包初轮33项中31通过，另有同一重入预期及跨VM对象原型比较失败。只修正3个测试辅助文件，源码与生成包各定向复验2项通过，最终分别覆盖1,012与33个检查；未声称修正后重跑完整两套。932个其他输入及产品运行代码保持相同。四种构建671输入/34输出、外部导入0；328次主物理家族TCP回执（源码285、生成27、页面16）。桌面与触屏模拟各8流程、83截图，15条正常返回移动及1条预期上下文错误/清理通过，页面错误、警告、外联0。 **待验证**：两条主守护/RID在205/207帧选择图形0，保持现有几何拒绝；两条次级2041在124/126帧的201读取下一元组哨兵-1，明确报目标上下文错误，失败回调之后不声称状态/像素等价。100110是带非攻击命中信号的原创压力资源，实际入口和重入会重复主命中并等待；不擅自清信号。保留失败与有界等待，普通守护/RID/重入使用已独立建模的100114资源。这些不是原程序或官服验收。 **待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。 [需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-chain260-v1/validation.json)。

阶段216继续同一完整目标：**事实**：固定37c4旧样本的105首条pair/variant0及真实156/97/98已接入shared，保留前置蓄力、残影、速度25、逐次动画反应和声音，再由14统一结算HP/RID。游标属于同一客户端播放所有者，在两个施术者之间共享；自身反应中断后保留1，清理身体后下一次从动作8继续，完成时才按源重置。既有正变体105路径保持。 **事实**：当前69文件战斗979/979、当前neutral生成包34/34、四套构建663输入/34输出通过，0外部导入。当前物理族主验收本地TCP301次（源码258、生成27、实际页面16），另4次实际98动作内暂停/重入定向核对不计入主总数；暂停的重试不重复消耗游标，重入保留2，两次已发生的M消耗按两次计算。桌面/触屏模拟各8流程、83张截图，15条返回移动及1条预期错误提示/清理通过，页面异常/警告/外联0。921个运行/测试/对端输入稳定，含58个Python对端。未重跑全仓或历史生成包全套。 **事实／待验证**：护卫后的RID后续记录在原创场景中令角色资源变为0；实际核心与独立方程在帧264/311一致进入当前帧控制器的LEGACY_BATTLE_FRAME_GEOMETRY。两个案例保留为渲染边界，未当作像素或正常回合通过。初始新模型未保留失败帧中新建残影的旧优先级17，曾错误地保留计算值16，现仅修正该边界快照；全部场景输入、队列、资源、geometry、拥有存储和成功RGBA保持，只有一条边界轨迹的最后状态改变。未放宽原渲染器或改旧golden。 **待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。 [需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-special-context-v1/validation.json)。

阶段215继续同一完整目标：**事实**：固定37c4旧样本的94、257、262首条pair/variant0队列及真实消费者已接入shared。94使用额外104c标量、78声音与96前置动画，再由14按字面优先级分派条件和HP；257/262保留73/74、最高级tile2/3、额外效果及262的205冲刺和1af89朝向1。护卫、RID旧第四字、E000、别名自身与普通后续记录分别核对。0x106=262、0x10a=266的先前纠错保持；本轮没有新增平台专用功能。 **事实**：当前67文件战斗945/945、当前neutral生成包33/33、四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP272次（源码231、生成27、实际页面14）；桌面/触屏模拟各7流程、74张截图，页面错误/警告/外联均为0。907个运行/测试/对端输入稳定，含57个Python对端。未重跑全仓或历史生成包全套。 **待验证**：105高等级动画表没有已观察到的负终止标记，共享58fac0游标的真实上下文未明；260主护卫与串联字段在435000前置解析和424310生产者间顺序不同。两类继续拒绝为未接入，不改已证前置解析；配对73关联路径及此前113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB仍未完整闭合。 **待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。 [需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-special-pairs-v1/validation.json)。

阶段214继续同一完整目标：**事实／纠错**：原424310的`0x106`是262，`0x10a`才是266。旧实现和独立模型曾把262的205冲刺、最高等级73/74套给266；本轮修正shared的配对生产者及护卫路径，266恢复普通9接近。此前stage209相关“266/205”结论已被新证据纠正；正变体和自身266的独立规则继续区分。其余五类特殊pair并未因此启用。 **事实**：当前65文件战斗912/912、当前neutral生成包27/27和四套构建659输入/34输出通过，0外部导入。当前物理族本地TCP227次（源码204、生成21、实际页面2）；桌面/触屏各一次266反射、回合、返回及精确移动流程通过，共10张截图，页面错误/警告/外联0。895个运行/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成包全套。 **事实／边界**：105使用533968处按等级步长20的有符号动画表与共享58fac0游标；已核200字节只有前两行带负终止标记，后八行全0，不能推定高等级正常完成。260带主护卫的串联字段在435000前置解析与424310实际生产者之间顺序不同。4608个原创字段流对照中，实际shared解析准备4368个、240个触发跨平台边界拒绝；4128个在两个源读取器都完整，336个已准备流呈现不同字段角色顺序。未把这些静态方程当作游戏执行或修改已证前置解析。 **待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。 [需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-pair-specials-v1/validation.json)。

# 完整目标与需求入口

阶段213继续同一完整目标：**事实**：固定37c4旧样本的96首条pair/variant0生产者及75/76/80/89/90/92/93/94/95真实动作已进入shared，包含可见性/瞬移/冲刺、源HP置零、冻结、护卫及普通后续记录；正变体1/2/3仍沿用先前普通发射路径。 **事实**：96默认后端的4160组队列、80条轨迹、32959帧状态、11836帧双selector完整RGBA与实际共享核心一致。另两条替代渲染轨迹的927状态/578像素/50样式观察仅为独立源方程；实际公开配置仍报LEGACY_BATTLE_SKILL_CONFIGURATION，未放宽门禁、未计入运行或像素通过。当前仍无替代渲染/半透明后端的完整实现。 **事实**：当前战斗912/912（65文件）、当前neutral生成包25/25、四套构建（659输入、34输出、0外部导入）通过。当前物理族本地TCP共241次：保留源码184、新源码20、生成20、实际页面17；17条桌面/触屏流程、106张截图，页面错误/警告/外联均为0。893个源码/模型/测试/对端输入稳定，含56个Python对端。未重跑全仓或历史生成套件。 **待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。 [需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-special96-v1/validation.json)。

阶段212继续同一完整目标：**事实**：固定37c4旧样本的72/113首条嵌套生产者及真实232、5、56/57/58/61/79动作已进入shared，包含主目标/嵌套目标的双护卫、反射/治疗/跳过/组合位、游标和普通后续记录；24等待忙目标时的动画遗漏已按原始代码修正。 **事实**：原435000只给72读取嵌套记录，且不把嵌套目标本身标成依赖（护卫会标记）；424310运行时同时处理72/113。保留原解析边界：113嵌套的4480组队列/104条轨迹仅为运行时命令夹具；可经真实前置解析的部分为4640组队列/157条轨迹。真实TCP/页面只验证72嵌套及113无嵌套，不将113嵌套标成协议兼容。 **事实**：当前战斗887/887（63文件）、当前neutral生成包25/25、四套构建（651输入、34输出、0外部导入）通过。当前物理族本地TCP共220次：保留源码164、新源码20、生成20、实际页面16；16条桌面/触屏流程、84张截图，页面错误/警告/外联均为0。879个源码/模型/测试/对端输入稳定，含55个Python对端。未重跑全仓或历史生成套件。 **待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。 [需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-nested-physical-v1/validation.json)。

阶段211继续同一完整目标：**事实**：固定37c4旧样本的266正变体2已接入“保存最后一条自身记录→独立216结果”共享核心；通用正变体可解析并忽略自身护卫标量。原有网页、移动网页、微信薄适配沿用同一核心，未增加Swift/AppKit功能。 61个当前shared/web战斗文件共862项单次全绿；当前生成包27项通过；四套构建643输入/34输出身份一致、无外部导入。当前物理族203次本机TCP：既有源码142、新源码22、生成22、实际页面17。17条桌面/触屏流程、89张截图，页面错误/警告/外联均为0；865个源码/模型/测试/对端输入稳定，含54个Python对端。未重跑全仓或历史486项生成套件。 **待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。 [需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-self-physical-v1/validation.json)。

阶段210继续同一完整目标：**事实**：固定37c4样本的27类正变体1/2/3接入字面E000结果动作与119/120/121实际完成，包含目标HP、RID归属、组合位、单弹/多目标返回及回合/离场。非自身目标的10/1000/200位按原始生产者作为普通标志处理，不套用pair护卫/113脚本。 59个当前shared/web战斗测试文件共835项单次全绿，当前生成包33项通过；四套构建643输入/34输出核验通过，0external。当前物理族189次本机TCP（既有源码115、新结果源码27、生成27、页面20），20条实际桌面/触屏流程、104张截图，页面错误/警告/外联均为0。853个源码/模型/测试/对端输入身份稳定，包含53个Python对端。本轮未重跑全仓或历史486项生成包全套。 **待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。 [需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-projectile-results-v1/validation.json)。

阶段209继续同一完整目标：**事实**：固定37c4样本的20类有限pair/variant0路径接入E000反射、治疗、跳过，真实119/120/121效果完成、HP/MP、护卫、RID、tuple游标及回合/离场所有权进入shared跨平台核心。值优先级为8000→4000→2000；producer及RID独立判断2000，保留组合位的源行为。 57个当前shared/web战斗测试文件共802项通过，当前生成包27项通过；四套构建643输入/34输出身份核验通过。当前物理族150次本机TCP执行（既有源码94、新结果源码21、生成21、页面14）。14条真实桌面/触屏流程、74张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。 **待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。 [需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[最新验收](../analysis/game-battle-physical-results-v1/validation.json)。

阶段208继续同一完整目标：**事实**：固定37c4样本的20类已支持pair路径接入三角色护卫、连续0x1010 look-ahead和113状态的0/3蓄力；护卫者承担真实结果，被保护者保留受击移动。RID与三字tuple保留原有第四字，113按源逻辑冻结自身与当前tuple目标。 当前55个shared/web战斗测试文件共775项通过；当前生成包17项通过；四套构建639输入/34输出身份核验通过。当前物理族117次本机TCP执行（既有源码81、新护卫源码13、生成13、页面10）。10条实际桌面/触屏流程、54张独立截图，页面错误/警告/外联均为0。本轮未重跑全仓或历史486项生成包全套。 **待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。 [需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-physical-guard-v1/validation.json)。

阶段207继续同一完整目标：**事实**：固定37c4样本的258类variant1/3已接入71b1（最高等级71b2）瞬时叠图，variant2保留无叠图分支；258/259/266正变体最高等级240平铺前缀、259最高等级直接路径及命中平铺进入shared核心。瞬时图复制当次世界坐标，不跟随父节点。 2243项源码测试通过（188文件）；486项当前生成包检查单次全绿（479 neutral API、7 App/Page）。四套构建631输入/34输出身份核对通过，无外部导入。物理族177次本机TCP执行（源码81、生成81、真实页面15）；14种桌面/触屏流程共15次执行、80张独立截图，页面错误/警告/外联均为0。 **待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。 [需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-physical-specials-v1/validation.json)。

阶段206继续同一完整目标：**事实**：基于固定37c4样本，实现25个generic选择器及独立73类的有限variant1/2/3发射路径：真实动画probe、单弹、多目标回收、连续发射和28反应；73不使用generic耗蓝前缀。95/105/110前缀与6/84/85/87的正变体HP结果保留各自源规则。公共消息工厂改为当次世界浮点坐标，修复95移动后仍取旧屏幕缓存的问题。 2223项源码全量测试通过（186文件）。生成包全量运行469项，3项因验收器跨realm数组原型比较失败；只修正测试比较后，4项相关检查复跑通过，469个不同检查均有通过证据，原失败运行保留，未称单次全绿。四套构建的623输入/34输出身份一致；物理族161次本机TCP执行（源码69、生成69、页面23）完成，页面21种桌面/触屏流程、105张独立截图，错误/警告/外联均为0。 **待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。 [需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-physical-projectiles-v1/validation.json)。

阶段205继续同一完整目标：**事实**：本轮依据固定37c4样本的41f310/41f2d0，修正公共26/160反应烟雾：使用身体当次移动前世界坐标、无父链接、不消耗模型随机数；12/13逃跑烟雾沿用独立随机工厂。没有新增正变体或特殊技能可用范围。 全量2194项源码测试（184文件）、440项生成检查（433 neutral＋7 App/Page）、四套构建通过；615输入和34输出身份一致。108条本机OS TCP流程及18条实际桌面/触屏页面流程通过，92截图逐个hash，页面错误/警告/外联均为0。新增源码与生成回归各1项；本轮没有新增TCP场景。 **待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。 [需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-physical-consumers-v1/validation.json)。

阶段204继续同一完整目标：已接入20类的有限pair/variant0直接结果（259的level9除外），保留29类选择器；MP6、84/85/87不扣HP、首击/后续actor、状态/RID、81额外回复、258移动和真实等待/结束拥有者分别处理。旧`planBattleStrike`/`queueStrike`仍是0/1/3有限接口，实际游戏公共族命令走新`queuePhysicalFamily`。 本轮2193项Node测试/183文件、439项生成检查（432 neutral+7 App/Page）、四套构建615输入/34输出均通过。独立15995队列、75场景、17488完整建模状态、2358完整RGBA帧（双selector）；108条实际本地TCP流程验证540次正常启动请求、553包技能、110次查询、113条S、101次退出及202次战后移动。实际game.html桌面/触屏18流程、92截图，Chrome156.0.8078.80/Playwright1.64.1，页面错误/警告/外部请求均0。 正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。 [需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[最新验收](../analysis/game-battle-physical-family-runtime-v1/validation.json)。

阶段203继续同一完整目标：普通物理公共分派族的来源分析继续，未新增可游玩范围。固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增10规范函数3679B及44B常量核原件，重核公共生产者8618B、身体/构造67615B及分派器54685B指令。规范函数由718到728；本次95记录含54复用/41新增，有限快照并集由2346到2387，不能把规范缓存算成完整Evidence。45个旧大快照核完整哈希和身份并沿用逐对象JSON证明，另解析29/42/54三个小快照。会话已关闭、cleanup=false。 本轮新运行源码测试0、生成检查0、页面流程0；运行模块/导出/适配器/测试及native/vendor未改。已复核stage202构建607输入/34输出和日志身份；此前2142项Node、393生成检查、15页面流程是历史验收基线，本轮未重跑，未重复累计。只运行并通过当前来源核验脚本。 本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。 [需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[最新核验](../analysis/game-battle-physical-family-v1/validation.json)。

阶段202继续同一完整目标：固定82十等级双方位移/放大/转向/冲击、资源元组/目标HP/震动、真实停止与删除/回合/下一C/普通返回已接入；空目标运行未证明确拒绝。新增48项，全量181文件2142项Node通过。四套当前构建核607输入/34输出身份、0external；393生成检查（386neutral/7App/Page）通过。独立1463队列、63场景16706完整建模状态和2404完整RGBA帧（两选择器）一致；47源停止、15身体结束与1空目标未证边界分开。97条最终真实本机TCP（41来源/41生成/15实际页面）核485启动、498技能包、99自动查询、102个S请求、90返回/180移动。81次独立截图、53个不同图像文件哈希位于源码外，均为原创合成资源；浏览器0错误/警告/外部请求。 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4复用718规范函数，本轮0新增；核298B冲击辅助/回调、72B常量、352B中点表、70074B身体/构造/C原字节及54685/682B分派器/管理器指令。45个历史快照核完整哈希和身份集合并沿用逐对象JSON解析证明，另解析后续29/42记录快照；本轮54记录为11新增/43复用，有限快照并集从2335到2346。规范缓存和快照记录分开计数；会话关闭、cleanup=false，旧封存证据保留。 82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。 [最新验收](../analysis/game-battle-skill82-v1/validation.json)、[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[交付清单stage202](../analysis/delivery-manifest-stage202.json)。外部查询仍缺requirement-index，未改外部知识库。

阶段201继续同一完整目标：固定83十等级移动/目标/冻结残影、本地244真实停止与非本地删除/回合/下一C/普通返回已接入；未证删除后反射明确拒绝，源零和与特殊槽等待保留。新增33项、全量179文件2094项Node通过。四套当前构建覆盖599输入/34输出身份，0external；生成验收共351项（344neutral/7App/Page），由326既有、24新TCP及1修正后的队列检查构成，初始验证脚本错误与重测日志单独保留。独立939队列含737支持/202明确拒绝边界；59场景核9387完整状态和1828完整RGBA帧（两选择器），区分31源停止、22身体结束、4特殊槽身体等待和2未证边界；phase2未交接4例，其中3已被源停止抢先结束、1仍在等待。最终61条真实本机TCP（24来源/24生成/13实际页面）核305启动、318技能包、63自动查询、66个S请求、48返回/96移动。69次独立截图、46个不同图像文件哈希在源码外，均为原创合成资源。浏览器0错误/0外部请求；3条Canvas读回性能提示来自验证器反复读像素，无其他警告。 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增41f740/41f7a0共1598B，规范缓存由716到718；436530解析到已知436500，其202B只按复核。保留41f280的70B、独立播种41f250的33B、54685B分派器和682B管理器原指令、70074B身体/构造/C消费者均核原PE。45个历史快照核完整哈希和身份集合，沿用上轮逐对象JSON解析证明，另核上轮29记录无新增；本轮42记录为12新增/30复用，并集2335。独立播种不改规范计数；函数缓存与有限快照记录分开，旧封存证据未改写，会话已关闭且无待清理项。 非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。 [最新验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[交付清单stage201](../analysis/delivery-manifest-stage201.json)。外部查询仍缺requirement-index，未改外部知识库。

阶段200继续同一完整目标：固定61..63十等级数值/治疗三元组、真实效果/数字/反射/特殊槽和输入/回合/下一C/普通返回已接入；零和/重复反射源等待保留，身体与命令完成计数分开。35新增/2061全量Node、四套构建/326生成检查（319neutral/7App/Page）通过；595输入/34输出身份一致，0external。独立3类十等级、2317队列、157场景16447完整状态、3250完整RGBA帧（两选择器）一致；154场景身体结束、151场景命令结束，6个源phase2等待单独保留。71条最终验收用真实本机TCP（28来源/28生成/15实际页面），核355启动、368技能包、73自动查询、76个S请求、60正常返回/120移动；初始观察不重复计入。78次独立截图在源码外，对应43个不同图像文件哈希；均为原创合成资源，浏览器0错误/0警告/0外部请求。 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4复用716规范函数，本轮无新增规范函数；重新查询41b6a0并核其62B，另复核70074B身体/构造/C消费者及54685B分派器原指令。45个历史快照逐条JSON解码并核完整哈希，再与流式身份检索交叉核验，实际不同Evidence记录并集为2323；历史累计2400多计77，首次引入位置尚未查明。当前29记录均已复用，无新增不同记录。函数缓存数和有限快照记录数分开，旧封存证据未改写；会话已关闭且无待清理项。 共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。 [最新验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[交付清单stage200](../analysis/delivery-manifest-stage200.json)。外部查询仍缺requirement-index，未改外部知识库。

阶段199继续同一完整目标：36类十等级状态/辅助SKL共同对元组/自身标记/68额外字与reset、135真实激活、状态/覆盖、32/128粒子完成及M/C管理器field、输入/回合/下一C/普通返回已接入；源自身68无53路径与原生43 HUD缺口明确保留。59新增/2026全量Node、四套构建/297生成检查（290neutral/7App/Page）通过；587输入/34输出身份一致，0external。独立36类十等级、2912队列、416场景12775状态、6384完整RGBA帧（两选择器）一致。115条最终验收用真实本机TCP（51来源/51生成/13实际页面），核575启动、591技能包、117自动查询、123个S请求、109正常返回/218移动；初始观察不重复计入。71张原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增3规范函数595B，另1个105B函数已在旧缓存、按复用核验；3个独立播种回调1170B、400B常量、额外64B第六组贴图表、70074B既有身体/构造/C消费者、133B贴图助手及54685B分派器指令核原PE。累计716规范函数/2400条有限快照记录并集；当前26记录为22新增/4复用，44个历史快照核身份。函数缓存与快照记录是两种计数，会话已关闭且无待清理项。 其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。 [最新验收](../analysis/game-battle-status-skills-v1/validation.json)、[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[交付清单stage199](../analysis/delivery-manifest-stage199.json)。外部查询仍缺requirement-index，未改外部知识库。

阶段198继续同一完整目标：已证SKL19..31十等级施法队列、135/137及四类真实投射/命中回调、MP/HP/KO/三资源/反射和产品下一C/正常返回已接入；自身31未知游标原子拒绝，零和反射保留源等待。38新增/1967全量Node、四套构建/245生成检查（238neutral/7App/Page）通过；579输入/34输出身份一致，0external。独立4686队列、213回调场景25917状态、6078完整RGBA帧（两呈现选择器）、294寻向和180个有符号CRT边界通过。60新真实本机TCP含10实际网页鼠标/触摸流程，核300启动、313技能包、2个1101标签包、62自动查询、65个S请求、53次正常返回/106移动；52张验收用独立原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增8规范函数2645B，另核5个独立播种回调7520B、400B常量和16B原文件常量，并复核4260b0分派器54685B指令；累计713规范函数/2378不同记录并集。当前40记录全部新增，43个历史快照核身份；REA会话已关闭且无待清理项。40记录快照不是完整并集。 自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。 [最新验收](../analysis/game-battle-casting-v1/validation.json)、[本轮需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[交付清单stage198](../analysis/delivery-manifest-stage198.json)。外部查询仍缺requirement-index，未修改外部知识库。

阶段197继续同一完整目标：人物主技能/子等级真实接收、P2与当前MP/等级标记、主/等级/目标/重选与精确S，以及会话自动工艺查询已接入；后续实际已有物理SKL/服务器MP费用/HP/KO/下一C/正常返回保持源规则。31新增/1929全量Node、四构建/218生成检查（211neutral/7App/Page）通过；571输入/34输出身份一致，0external。45独立完整接收状态、14输入场景781状态、110个有符号MP计算边界通过。32新真实本机TCP含6实际页面，核160启动、177技能接收包、34自动查询及37个S请求；25次正常返回、25退出/50移动，27张原创夹具截图在源码外。 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增10规范函数2175B；19个独立播种回调6651B、1032B常量及既有4260b0分派器54685B指令核原PE。累计705规范函数/2338记录并集；当前48记录含3复用/45新增，42个历史快照核身份，会话已关闭。48记录快照不是完整并集。 完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。 [最新验收](../analysis/game-battle-player-skills-v1/validation.json)、[交付清单stage197](../analysis/delivery-manifest-stage197.json)。外部查询仍缺requirement-index，未修改外部知识库。

阶段196继续同一完整目标：普通window28/cache/M/MON0/2/1与真实队列/角色/效果生命周期、源49删除、独立呈现缓冲和明确point缩放策略已接入；下一C记忆/W及实际页面返回保持源规则。51新增/1898全量Node、四构建/203生成检查（196neutral/7App/Page）通过；567输入/34输出身份一致，0external。16独立MON场景1864状态、13输入场景673状态、240独立缩放策略像素用例通过；MON同时核两呈现选择器，共3628个像素结果，100个alternate未支持结果。32新真实本机TCP含6实际页面，核160启动、210宠物接收包、42输入（27 M|1、8 M|FF、3 W|FF、4 N）、25退出/50移动及25次正常返回；25张独立原创夹具截图在源码外。 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增4规范函数647B；独立播种回调1745B、既有4260b0分派器54685B指令及320B不重复常量核原PE。累计695规范函数/2293记录并集；本次31记录中2条复用、29条新增，会话已关闭，31记录快照不代表完整并集。 完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。 [最新验收](../analysis/game-battle-pet-transition-v1/validation.json)、[交付清单stage196](../analysis/delivery-manifest-stage196.json)。外部查询仍缺requirement-index，未修改外部知识库。

阶段195继续同一完整目标：真实FBY/G:w/J_J与P/MP/实际13b4骑乘对象已接入宠物技能/目标/重选/待机/超时，两次选择和跨回合记忆及普通宠物配对身体按源规则保留。36新增/1847全量Node、四构建/173生成检查（166neutral/7App/Page）通过；555输入/34输出身份一致，0external。15独立场景833输入状态、53完整接收记录状态通过。38新真实本机TCP含6实际页面，核190启动、120宠物接收包、86输入（34 W|FF、28 W|0|A、5 W|1|0、3 W|2|29、10 G、6 N）、31退出/62移动与31次正常返回；24张独立原创夹具截图在源码外。 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增6规范函数2770B及20B常量核原PE，重核721B已播种回调；累计691规范函数/2264记录并集，新快照24记录，会话已关闭。 完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。 [最新验收](../analysis/game-battle-mounted-input-v1/validation.json)、[交付清单stage195](../analysis/delivery-manifest-stage195.json)。外部经验/需求索引查询在本轮仍缺requirement-index，未修改外部知识库。

项目最初按“先使用 REA 分析登录器，再实现登录器，再使用 REA 分析游戏，实现游戏”启动。现行流程先分析全部需求能力，再按依赖复刻。目标平台为网页、移动网页及微信小程序。保留既有 `native/`，新功能进入 `shared/` 及薄适配层。 [当前执行顺序](development-plan.md#capability-first-workflow) · [项目说明](../AGENTS.md)

这是项目内的需求真源索引，用于补齐阶段开发的需求入口；未修改 TalonBrain 的外部登记、索引或规则。外部 `experience,requirement-index/development/3000` 查询在 stage194 前检仍报告缺少 `requirement-index`，不能把本文件创建说成外部查询已恢复。

当前stage194继续同一完整目标：普通CBC即时当前资源/四数值与真实13b4/13b0的C/命令构造、更新、移除和父动画/flags/附点/备用深度Y已到共享owner；源C来源/待用aux/P不伪改。50新增/1811全量Node、四构建/157生成检查（150neutral/7App/Page）通过；551输入/34输出身份一致，0external。32独立场景1010状态/完整640×480RGBA通过；36新真实TCP含8实际页面，核180启动、39输入（36个G/3个H|A）、27退出/54移动、27次正常返回。24张原创夹具截图在源码外。REA补6规范函数/1433B和32B独立回调，复核派生54685B，累计685函数/2240记录并集，新快照18记录且已关闭。当前操作者骑乘输入仍明确依赖原生控制；完整其他handler/技能/角色/原生渲染调度/玩法、真手机/微信/设备/现行官方均继续required，目标active、phase_complete=false。[最新验收](../analysis/game-battle-character-change-v1/validation.json)。

阶段193历史继续同一完整目标：普通POS真实对象/名字/当前操作者换位，收到P0与当前槽位独立、下一C再应用；EQU按64/action5/完成信号切换实际当前资源，物理后PSN完成恢复源角度。70新增/1761Node、四构建142生成、31新真实TCP含7实际页面、50独立场景1917状态/完整RGBA通过。固定37c4原件不变，复用679函数/2222记录并集、12规范范围与54685B派生指令，无新REA查询。两轮网页复现本地桥10秒BRIDGE_TIMEOUT后新增显式有界时长，本轮30000ms，默认10000ms、最大60000ms，实际到期清理另验。完整CBC/其他技能/角色/原生渲染调度/玩法、真手机/原生微信/设备/现行与官方继续未完成，目标active、phase_complete=false。[最新验收](../analysis/game-battle-change-v1/validation.json)。

阶段192历史继续同一完整目标：普通PSN扣HP/回HP/扣MP、三字型/十级回血附层、KO和等待已到实际共享消费者与网页HUD；新C覆盖与取消像素重试不重算分别核验。38新增/1691Node、四构建129检查，29新真实TCP含7页面流程、21独立场景2152状态/完整RGBA及735整数边界通过。4新REA规范函数、126B辅助与54685B派生指令核原件，累计679函数/2222记录并集；新有效快照2146记录与190独立档案分开保留。附RID、其他技能/角色/渲染/玩法、真手机/原生微信/设备/现行与官方继续未完成，目标active、phase_complete=false。[最新验收](../analysis/game-battle-status-v1/validation.json)。

阶段191历史继续同一原战斗阶段：实际game.html已接入有源战斗画面、语义攻击/目标/防御/换位请求/逃跑、当前C数值与正常返回移动，暂停/取消/未知动作/资源等待/重入和关闭分别核验。3新增/1653 Node、四构建/117检查，14产品+7普通回归+2基线页面流程、2独立Canvas比较和45原创夹具截图通过。完整技能/其他玩法/原生调度/UI音频及真手机资源选择/网络/设备、原生微信/现行/官方仍未完成，整体active、phase_complete=false。[最新验收](../analysis/game-battle-web-v1/validation.json)。

阶段190历史继续同一原战斗阶段：实际普通物理SKL（类0/1/3、variant0）已有真实队列/动画/HP-MP/反应和KO反馈，并经过新C覆盖、源/生成客户端回合、退出返回和恢复移动。33新增/1650 Node、四构建/115检查、28新OS TCP与13组3137独立状态/RGBA通过；完整其他技能/位/RID/人物分支、其他handler/UI/产品页面/触屏/微信设备/现行与官方仍未完成，整体active、phase_complete=false。[最新验收](../analysis/game-battle-skill-v1/validation.json)。

阶段189历史继续同一原战斗阶段：普通来源战斗已清旧记录/本体、拥有unit/action限制，并实际走main9等待、全局/新记录重建、捕获/13淡入和20/3首帧成功后的新runtime，恢复准确移动。18新增/1617 Node、四构建/101检查、22新OS TCP/1004独立返回RGBA/36移动请求通过；完整原生池/UI音频、其他分支/技能/玩法、产品页面/触屏/微信设备及现行/官方仍未完成，整体active、phase_complete=false。[最新验收](../analysis/game-battle-return-v1/validation.json)。

阶段188历史继续同一原战斗阶段：显式exit后，普通7/8清理、实际战斗帧捕获、退出渐变及准确$!~ int0已到client和main9/1边界；普通池去投影/数值与main9真实重建尚未实现，pending不清。18新增/1599 Node、四构建/89生成检查、22新OS TCP/16退出请求及1008独立退出RGBA通过；完整其他动作/输入/产品控件/玩法/平台/官方继续未完成，整体active、phase_complete=false。[最新验收](../analysis/game-battle-exit-v1/validation.json)。

阶段187历史继续同一原战斗阶段：显式配置后，5图后实际消费M、6回调真实命令/body结束并反馈下一轮C/A；PNO/ACT、多轮与回绕、取消不重放和重入/关闭已核。16新增/1581 Node、四构建/77生成检查、18新OS TCP/30输入请求通过；完整SKL/其他动作、退出7/8/9及普通返回、菜单/命中/产品控件、其他玩法/平台/官方仍未完成，整体active、phase_complete=false。[最新验收](../analysis/game-battle-loop-v1/validation.json)。

阶段186历史继续同一原战斗阶段：基础phase4菜单/语义输入、目标选择与源$T5发送已到client，源条件可请求5，M仍未消费。19新增/1565 Node、四构建/67生成检查、26新OS TCP/42输入请求和10独立场景392步通过；完整菜单/命中/产品控件、技能/道具/宠物/坐骑/观察、M/退出与其他玩法/平台/官方继续未完成，整体active、phase_complete=false。[最新验收](../analysis/game-battle-input-v1/validation.json)。

阶段185历史继续同一原战斗阶段：部分源entry0..4、真实捕获渐变、2图后C自动消费和3图后到位已接实际client任务，4仍等未实现输入且M排队。19新增/1546 Node、四构建/53生成检查、22新OS TCP/1390像素帧及独立12场景/804像素帧通过；popup/选择/输入/M/退出返回和实际网页/微信gamePage、完整其他玩法仍未完成。整体active、phase_complete=false。[最新验收](../analysis/game-battle-entry-v1/validation.json)。

阶段184历史继续同一原战斗阶段：自有池对象排序/可见性、真实背景与基础body/child资源像素、client渲染任务及取消生命周期已接入。13新增/1527 Node、四构建/41生成检查、10新实际OS TCP/422像素帧通过；1835独立完整RGBA一致，159缩放/混色帧显式未支持。自动main10/渐变/C/M、产品战斗画面/输入/退出、完整其他动作仍未完成，整体active、phase_complete=false。[最新验收](../analysis/game-battle-scene-v1/validation.json)。

阶段183历史继续同一原战斗阶段：23类基础body分支和真实动画/运动/效果、ACT及回调反馈已接客户端资源拥有链；19新增/1514 Node、四构建/35生成检查及14新OS TCP/1238回调通过。自动main10、完整其他动作、C选择、渲染/输入/退出返回未完成。整体active、phase_complete=false。[最新验收](../analysis/game-battle-body-v1/validation.json)。

阶段182历史继续同一未完成战斗阶段：32槽命令生命周期、自有body队列及七类队列/END等待已接显式调用；21新增/1495 Node、四构建/28生成检查及6新实际OS TCP通过。main10、其余handler、body完整回调、渲染/输入/退出仍缺。整体active、phase_complete=false。[最新验收](../analysis/game-battle-commands-v1/validation.json)。

| 需求 | 证明完成所需的证据 | 当前入口与缺口 |
| --- | --- | --- |
| 分析登录器 | 每个样本身份、流程/配置/更新/认证/启动消费者的可追溯证据 | [登录器分析](launcher-static.md)、[协议矩阵](../analysis/protocol-v2/spec-matrix.json)；现行/官方兼容仍有未知项 |
| 实现登录器 | 独立核心和平台适配，真实产品流程与源协议测试；受支持版本明确 | [模块接口](module-interfaces.md)、[网络与平台](network-portability.md)、[验收](validation.md)；本地原创对端验收不替代真实官方登录 |
| 分析游戏 | 通信、状态、地图、资源、人物、输入、交互、队伍、战斗及其他玩法的真实消费者 | [游戏分析](game-static.md)、[逻辑规格](logic-protocol-spec.md)；固定旧样本已有大量证据，战斗和多项业务消费者尚未闭合 |
| 实现游戏核心 | 实际消息驱动拥有的游戏状态；可操作并有反馈；资源、输入、交互、战斗等完整玩法均有兼容性证据 | [架构与里程碑](architecture-and-milestones.md)、[开发计划](development-plan.md)；当前普通场景/人物/移动/文字/值条/队伍跟随及普通加入/离开交互已接入，完整交互与战斗等仍未完成 |
| 网页和手机可玩 | 实际页面、实际文件/网络输入、鼠标/触屏、进入/游玩/退出及异常恢复 | [网页说明](../web/README.md)、[stage197验收](../analysis/game-battle-player-skills-v1/validation.json)；已验局部普通场景，完整玩法未验收 |
| 微信小程序可玩 | 原生游戏Page、Canvas/字体/文件/网络/调度端口，开发者工具和设备证据 | [微信说明](../wechat/README.md)、[适配层](../adapters/wechat/README.md)；当前为登录器Page和游戏API构建/中立环境测试，原生游戏Page及设备未完成 |
| 官方/现行兼容 | 适当授权、对应版本身份及真实登录、游戏启动、业务与断线恢复等外部证据 | [已知问题](known-issues.md)、[协议矩阵](../analysis/protocol-v2/spec-matrix.json)；没有真实测试账号，未完成 |
| 持续维护完整文档 | README入口及分析、架构、接口、资源、运行、验收、问题和下一步同步，历史保留 | [阶段计划](development-plan.md)与各阶段清单；每个阶段单独验收，不把局部完成写成完整目标完成 |
| 材料和实现边界 | 原件/历史native不改写；无厂商二进制/素材交付，无秘密/账号会话，无未经证实字段或保护绕过 | [AGENTS.md](../AGENTS.md)、[交付清单stage197](../analysis/delivery-manifest-stage197.json)；后续阶段继续逐文件校验 |

阶段181继续同一未完成战斗阶段：M的24类字段/依赖预处理已进入共享核心及显式world接口，三个默认未识别的回调取得独立静态导出和原字节核对。预处理不消费M环、不执行动作，原main10循环、图像、输入和退出要求完整保留；见[计划](../analysis/game-battle-runtime-v1/implementation-plan.json)与[核验](../analysis/game-battle-runtime-v1/validation.json)。

阶段180保持进行中：已证实真正的 main10 战斗与普通场景250..252不同，并接入 >HY 入场、?+e C/P/A/M/U 接收、显式C角色记录消费及真实客户端停止普通场景。战斗主循环、画面、动作/M执行、输入及退出仍未实现；[原始阶段计划](../analysis/game-battle-transition-v1/implementation-plan.json)与[核验记录](../analysis/game-battle-transition-v1/validation.json)保留未完成要求，不把记录基础缩写成战斗完成。

阶段179在开发前定位并完成的有限切面是队长/模式子图像，以及真实组队切换、回复和位置确认；[计划](../analysis/game-party-actions-v1/implementation-plan.json)、[验收](../analysis/game-party-actions-v1/validation.json)记录源证据及运行层级。完整队伍控制、战斗和其余玩法仍未完成，此切面不缩小上述完整目标。

协议矩阵的 `observed` 表示所列静态/局部规则有证据，不表示完整系统或三个平台已验收。`unknown`、原创对端、构建成功和历史快照均不能替代相应范围的完成证据。完整目标保持 active。
