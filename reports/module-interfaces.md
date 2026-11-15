## 补丁与目录恢复的接线

D1 复用现有退出解释和准备入口，保留每次尝试的实际错误及详情。D0 复用目录与候选绑定，D5 沿 UC-P12 将设置保存、读回和操作身份交回当前准备。晚到结果只归还该次尝试的资源；新的活动绑定由确认读回后的准备消费。 [既有入口与验收用例](launcher-static.md#f5a-patch-retry-directory)

## 游戏页的暂停、退役与重开

UC-P14 将可见性、退出和新页面创建交给已有网页或微信入口。普通网页场景隐藏后暂停绘制与场景输入，前台继续前核对原连接是否仍在。浏览器实际标签页用例使用可信的 `visibilitychange` 和当前连接的结束状态。EOF 后游戏会话和 ZIP 可以关闭，同时页面保留准备入口。微信见 Page/App 隐藏时退役旧会话和临时选择，回到页面后由新一次选择建立资源所有者。D0 复用共享客户端的暂停、取消和身份检查，D5 为各宿主接入实际回执。 [逐端对照](network-portability.md#target-game-page-lifecycle)

UC-P09 区分取消回执与在途读排空。持久化根的租约沿 UC-P08 才能释放和回收。UC-P11 保留同一连接的收包顺序，关闭后释放旧连接并拒绝其迟到回调。正常离页时资源读被宿主终止的结果与活动会话真实报错分别验收，前台继续前核对对端是否已关闭。 [共用规则与用例](../analysis/capability-first-v1/shared-update-host-design.json#/game_page_lifecycle)

准备中的 ZIP 在发起首次读取前归入 UC-P07 与 UC-P09。D0 复用现有解析器，用同一所有者核对后续读准入、在途缓冲的归还和 `closeAndDrain` 结果。D5 将页面序号、读取结束和 UC-P11 的实际关闭结果交还原调用方。新启动由 UC-P08 读回根及提交，UC-P10 在最终确认点重核活动发布和实际构建。 [接口复用与组合用例](../analysis/capability-first-v1/shared-update-host-design.json#/game_resource_reopen)

UC-P07 向共享归档提供绑定到当前内容与实际来源的读端口。UC-P09 收到宿主读完成后继续结算该读衍生的显示、解码和音频引用，再把排空回执交 UC-P08。缺段补选交给新的来源和读者，持久化提交按 UC-P08 核权威读回。 [读取及回收规则](../analysis/capability-first-v1/shared-update-host-design.json#/game_resource_reopen/reader_identity_and_publication/common_rules)

## 普通换图的交互、地图和帧

D2 沿 `legacy-game-local-movement` 和 `legacy-game-message` 复用交互序号及五参编码，沿 `legacy-game-protocol` 接收现有 `=xE` 和 `Ta>` 解码结果。地图缓存继续通过 `legacy-game-map` 保存现行身份和补片，由场景状态处理两版的等待解除和区域重读。D0 用原场景帧核同轮进入 205，D3 沿同一场景身份验收旧工作失效。 [共用来源与接线](../analysis/capability-first-v1/game-flow-functional-specification.json#/legacy_map_wait_patch_release)

`legacy-game-map` 的补片及范围读取沿用。D2 衔接活动平面和缓存读回，`legacy-game-navigation` 复用两种碰撞构建及方向扫描，`legacy-game-local-movement` 复用等待方向和已经准备的位移。两版普通帧在移动之后重读地图，续接由下一次合资格移动处理。 [接口与差异](../analysis/capability-first-v1/game-map-functional-specification.json#/legacy_map_movement_refresh)

D0/D2 从 `legacy-game-actors` 已产出的 `cacheVariant` 取得路径值，沿 `StableRangeSource` 与 `SnapshotStore` 接缓存准备和宿主确认。地图所有者分别传入写入文件的身份与坐标、活动窗口身份与坐标。 [复用入口及验收](../analysis/capability-first-v1/game-map-functional-specification.json#/legacy_map_cache_io)

校验通知沿现有定长校验与请求编码接线。D2 向地图所有者提供活动 A 和通知 B 的缓存结果，并保留通知原字段供补取。场景准备由匹配结果及活跃身份推进。 [文件选择与错误回执](../analysis/capability-first-v1/game-map-functional-specification.json#/legacy_map_notice)

游戏实例持有地图目录值，连接所有者负责退役旧解析缓冲。D0/D2 复用 `cacheVariant`，由地图所有者按适用的目录值与 A/B 选择持久缓存，再应用头复用规则。 [重新进入与缓存归属](../analysis/capability-first-v1/game-map-functional-specification.json#/legacy_map_context_reentry)

## 战后结果的发布和绘制

D4 让现有世界分派将两个已解码正文交给战斗与回场的共同状态所有者，复用人物、宠物及实际技能槽。D0 以既有待处理动作消费、窗口池和时钟实现两窗；初始化从已发布资料填控件，窗 30 的绘制另取当前图号。三端从共用帧结果获取窗口、关闭和音效请求。 [源规则、输入与用例](../analysis/capability-first-v1/game-entry-review-contract.json#/state_consumer_closure/fixed_se_battle_results)

## 出站请求的共享组包

`shared/legacy-game-message.mjs` 继续提供 18 条既有组包。D2 由已证地图和移动状态提供输入。D3 由名单所有者以视图及真实行生成 `;JE`，由物品所有者传 `6=L` 两槽，工艺所有者决定当次 `7ba` 使用的秒数及本地截止登记。共用的阶段准入由 D0 沿原帧规则验收。三端经已有宿主适配提交同一个请求。 [业务归属和边界](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_outgoing_admission)

## 场景特效和实体显示

`legacy-game-protocol` 已能解码 `CcL`。D2 复用 `legacy-game-state` 的嵌套字节和数值处理、`legacy-game-motion` 的资源换算及 `legacy-game-actors` 的远端记录。D0 沿场景帧消费所选图形和退役结果。结束时按外层字段的 ID 从活动实体表取记录，只有身体仍为空才参与构造。 [接口与差异](../analysis/capability-first-v1/game-actor-functional-specification.json#/fixed_se_ccl_scene_publication/implementation)

## 人物资料与窗口状态

人物明细用现有 `legacy-game-state` 的五项能力值。世界接收沿 `legacy-game-protocol` 补已解码的点数和阵位发布。个人称号使用 `legacy-game-actors` 现有 `Hr]` 原表及其待接排序副本，窗口动作交现有整型或字节编码。工具栏选项及人物窗保存点沿窗口生命周期交现有宿主保存入口。 [通信字段](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_window_wire) · [窗口所有者](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_classic_toolbar_status)

简介共用现有角色状态和世界入口。D2 保持活动草稿、已选角色缓存与目录记录的不同更新时间，并调 `legacy-game-message` 的现有编码。D0/D3 沿窗口帧及 `InputAndTextFocus` 提供编辑、行选择和返回。宿主的本地保存结果接已有存储入口。 [窗口接口与差异](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_classic_player_profile/implementation_deltas) · [通信入口](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire)

D2 沿 `legacy-game-protocol` 的有序世界事件消费两组目录更新，复用 `legacy-game-state` 的分隔与反转义及现有请求编码。D3 用同一份目录资料驱动窗 59 的可选行、他人简介资源查询和迷你邮件邮费提示。D0 沿 `createLegacyGameResourceArchive` 及既有存储端口读取初值、处理完整读回和失败。 [已有入口与待接差异](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire/directory_publication/implementation)

窗 64 沿 D0 共用经典窗口的重排和退役。D2 沿 `legacy-game-protocol` 发布现有解码器读出的 13 项资料，复用 `legacy-game-character-codes` 的已证外观换算，并在来包时计算类别图块。D3 沿现有地图右键和名单操作生成请求，渲染这一份资料视图。 [接口与用例](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire/other_player_profile/implementation)

## 报价行输入与现有核价接口

`quoteMapShop(revision, selections)` 与 `submitMapShop(revision, selections)` 继续消费原报价行及数量。D0 通过 `InputAndTextFocus` 和 `SharedUpdatePump` 提供本次命中、所存放置坐标与操作次序。D3 的报价所有者按当前选择映射转换显示位置，处理原位、换位和撤选，再交现有核价与确认入口。 [窗口及业务接口](game-static.md#legacy-shop-quote-drag) · [共享核价](../shared/legacy-game-map-shop.mjs)

待接的报价操作携带存活窗口身份。当前实例的放置、撤选与预览返回进同一个报价所有者。窗口整理或同步组关闭后，迟到结果只结算旧实例的操作状态，正式提交仍走现有修订号及原行号入口。 [归属与次序](../analysis/capability-first-v1/window-engine-contract.json#/kind9_shop_quote_drag/ordered_retirement)

## 交易的宠物位置与金币输入

`copyPlayerTrade` 和 `actOnPlayerTrade` 对应已有交易入口。D0 复用 `legacy-game-pets` 和 `legacy-game-protocol` 的当前宠物记录与持有值，按经典帧次序提供资料。D3 通过交易所有者处理稀疏位置、暂存值、实际提交的报价、相位和窗口退役。网页、移动网页及微信沿这一入口投影并传输用户操作。 [对应模块与差异](../analysis/capability-first-v1/game-trade-storage-contract.json#/classic_trade_pet_and_gold/implementation)

第二套窗的已证差异也归 `legacy-game-player-trade`，沿现有输入、共享时钟和窗口回调顺序处理。`legacy-game-message` 继续编码同一条三参命令。业务层按经过确认的窗口来源生成缓存槽列表、处理余额及相位，各宿主继续走同一交易端口。 [对应模块与条件](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_gold/implementation)

物品端口继续归并普通背包发布与 `'#Q` 组包。交易活动下的取放和数量作为由交易所有者验证的操作，按已证来源提供第三个参数。当前普通移动入口会拒绝活动交易状态，差异交 D0/D3。 [现有接口与待开发差异](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_selection/implementation)

## 登录候选与显示行的交接

现有 `launcher-replies` 和 `launcher-login` 提供解码、成组排序及状态检查。D1 在 `launcher-flow` 持有版本对应的候选与显示行映射，沿原确认入口向交接提供所选候选。D5 复用 UC-P12 取得编码和本地资料，按实际选择回执验证重建后仍可见、筛除和插入失败。 [实现差异](../analysis/capability-first-v1/launcher-callback-reentry-contract.json#/f5a_result_selection/profile_list_projection/implementation)

置顶命令使用处理时的当前候选。D1 将本地设置的成功和失败结果交给现有候选所有者，再由同一入口重建列表。D5 沿 UC-P12 核对保存与重开，沿现有确认入口消费实际行映射。 [实现差异](../analysis/capability-first-v1/launcher-callback-reentry-contract.json#/f5a_result_selection/profile_list_projection/pin_publication/implementation)

候选筛选和备注复用现有编码入口。移动、重置及撤销向同一设置接口传递必要写入和恢复回执。实际显示行仍通过原确认入口解析。D5 以各端返回的命中和读回结果执行原组合用例。 [接口与用例](../analysis/capability-first-v1/launcher-callback-reentry-contract.json#/f5a_result_selection/profile_list_projection/candidate_management/implementation)

D1 由现有登录流程持有备注打开时的有效候选索引。确认以当前候选槽和编码构造保存目标。D5 沿 UC-P12 接入设置结果，成功后才更新备注并请求重建，取消不发出写入。 [确认、取消和回执](../analysis/capability-first-v1/launcher-callback-reentry-contract.json#/f5a_result_selection/profile_list_projection/candidate_management/note_modal_admission)

## 登录器文件前检与路径发布

D1 复用目录、库存、启动命令及首次配置入口。目录准入、词法候选、文件系统关系、文件存在及写入回执分别供所选操作使用。普通启动在主程序检查通过后发布路径，首次配置持有临时路径，目录重选按写入回执发布。D5 沿 UC-P04、UC-P07、UC-P12 和 UC-P14 验证源字节、资源根、保存与各端可用能力。 [接口差异](../analysis/capability-first-v1/launcher-functional-specification.json#/current_game_process_producer/distribution_supplement/path_preflight/implementation)

D1 的普通确认持有活动候选索引、确认后的名称及本次回复字段。启动所有者分别读取目录条目、确认字段和仅刷新状态。D5 取得设置、映射发布、进程和托盘各自的结果，按已证次序驱动同一个启动流程。 [现有模块及接线差异](../analysis/capability-first-v1/launcher-functional-specification.json#/current_game_process_producer/distribution_supplement/ordinary_handoff/implementation)

## 自更新与启动确认

UC-P08 继续以发布读回核对活动根与更新编号。UC-P10 继续接收旧实例退役及新启动的实际宿主回执。D1/D5 沿已有端口处理待接管状态、关闭请求和 `bindNewBoot`。三端以各自的可观测结果完成 UF-T12、UF-T13 和 UF-T16。 [接口合同](../analysis/capability-first-v1/shared-update-host-design.json#/independent_design) · [原版完成条件](launcher-static.md#f5a-update-handoff-and-ack)

LS-D3 复用 `SessionTransport`、`OwnerLifecycle` 和 `ClockDomains`。编号和准备资格归提交所有者，解析结果归原任务，拒绝与关闭回执归各自会话尝试。普通输入按生成时的有效窗口和启用状态投递，提交所有者按消费时的阶段、忙态和有效表单准入。D1/D5 核焦点变化、旧消息和新连接。 [原规则与接口条件](launcher-static.md#f5a-ordinary-input-idok)

UC-P10 在写入 `BootReadinessReceipt` 时重新核对 UC-P08 的活动根、更新编号、修订和对应重启意图。已有后续版本时返回已取代，原提交继续可查。UC-P09 等旧读者排空后释放根租约，UC-P08 才能回收旧内容，保留该次提交的记录。 [共同规则和端口用例](architecture-and-milestones.md#portable-update-handoff-readback)

## 图形档位与文件写入结果

D0 复用 `prepareLegacyGameStartup` 的配置首行和命令尾合并，在来源上下文中派生并传递有符号请求低字节。配置工具的读写仍沿 1–4 档接口，`graphicsMode` 继续供原绘制判断。D3 由图形所有者维护实际档位及有效绘制能力，复用合成器。D5 沿原文件端口验收打开失败、空读、写入和关闭结果。新进程用启动输入产生本次请求，普通帧重建使用活动档位。 [来源与实现差异](game-static.md#legacy-render-startup-tier-input) · [现有配置接口](../shared/game-config.mjs) · [共用用例](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_render_device_preferences/startup_tier_input)

D0/D3 复用 `InputAndTextFocus`、`SharedUpdatePump` 和 `RenderAudioSurfaces`。图形所有者接收已知的绘制及呈现结果，输入端口保持所选消息各自的消费位置。窗口模式和图形上下文在前一次重建返回后重读。现有 Canvas 宿主的代次和资源取消继续用于退役。 [原版顺序与现有行为](game-static.md#legacy-render-system-key-rebuild)

## 持久化 ZIP 的范围和租约

UC-P07 以取得租约的根身份、ZIP 总长和分块清单提供稳定的范围读。现有 ZIP 适配器可从分块 Blob 读取跨 2 GiB 偏移和跨块区间。UC-P09 在对应资源库与读任务退役后释放租约，UC-P08 依据同根活动记录和回执决定回收或重开。 [桌面组合实测](architecture-and-milestones.md#desktop-persisted-resource-archive)

UC-P09 持有旧根租约直至已准入的宿主读取和消费任务返回。资源库关闭后，可继续等待迟到的 Blob 结果，旧绘制回执仍按已取消处理。UC-P08 接收租约释放后再核回收条件。 [版本隔离与排空用例](architecture-and-milestones.md#browser-resource-version-isolation)

UC-P06 从准备首笔读开始跟踪实际范围和分配，含新目录暂存、图块输入、绘制结果和音频样本。UC-P07 的读取回执和 UC-P09 的消费者结束共同结算。微信现有适配器可先拒绝 JS 调用，D5 从同一读请求继续追踪原生回调及晚到缓冲清理。成员头超时的重试沿已验证的同源范围重新发出，并复用实际结算。 [预算和宿主回执](../analysis/capability-first-v1/shared-update-host-design.json#/resource_budget_retirement)

Chrome 的联合场景沿现有 `startRender` 保留调色重绘所需的索引图像。UC-P06 核每项实际缓存与音频缓冲身份，UC-P09 在音频和图形关闭后继续等待已发图块，待晚到字节清零和渲染取消均有回执时结算。 [画布、声部和图块回执](validation.md#real-map-mixed-resource-budget-validation)

移动 Safari 复用相同的范围与租约接口。UC-P08 将以源 Blob 切片拼接的块读成连续字节后保存，按实际读回长度与摘要验证。UC-P06 用清单计入有效载荷和旧读者占用，并计入连续字节的暂存。 [移动组合实测](architecture-and-milestones.md#mobile-safari-persisted-resource-archive)

微信现有文件适配器沿 `readFile` 提交安全整数偏移和长度。UC-P06 计入未回收的候选块。UC-P08 按实际文件写入回执处理容量拒写，保留已验证根并等待候选满足准备条件。 [微信定位与容量实测](architecture-and-milestones.md#wechat-sdk-archive-files)

微信选择 ZIP 时以文件项的可读路径、大小及实际 `stat` 结果确定输入是否可用。复制失败的文件项即使出现在成功回调里，也作为候选获取失败处理，现有活动资源继续使用。D5 用小 ZIP 成功、选大 ZIP 时无路径和等待超时三组案例复核入口。 [选择器实测](architecture-and-milestones.md#wechat-sdk-archive-selection)

分段候选按清单绑定顺序、起点、长度及归档身份，仍向 UC-P07 提供同一个 `size` 和范围读接口。跨段读取按各自区间取字节后按序拼接。持久化按实际存储回执进入 UC-P08，沿用旧根保留和失败恢复。UC-P06 计入已保存和待回收的候选块。第 13 个普通写入块被拒的用例沿 UH-T01、UH-T03 验收，等读写结束后由 UC-P09 回收未发布的自有块。 [分段实测](architecture-and-milestones.md#wechat-sdk-segmented-archive) · [拒写与清理](architecture-and-milestones.md#wechat-sdk-archive-ordinary-quota)

重开时按清单验证各段的路径、长度与身份，再向 UC-P07 交付通过验证的候选。缺段时保留已有验证根，按原入口补选。UC-P08 按完整持久副本的写入与读回结果更新活动根。 [重开与缺失回执](architecture-and-milestones.md#wechat-sdk-selection-lifetime)

完整分段可在所测 DevTools 新进程中从已存选择清单取回路径，逐段检查后按原顺序和内容摘要重开。只缺第 2 段时，保留第 1 段的候选路径并补选第 2 段。UC-P07 交付已复核的当前归档，UC-P08 按其原发布条件处理可持久化来源，UC-P10 据活动根与实际启动确认。 [完整素材跨进程重开与补选](architecture-and-milestones.md#wechat-sdk-segment-process-reopen)

正常重开后，UC-P08 沿活动槽、历史和持久根取得可验证的范围入口。UC-P10 在新宿主确认当前提交、对应启动意图和实际载入的构建，再给出本次就绪结果。原启动记录随旧提交保留，仍以活动提交判断其归属。本机小 ZIP、双槽和历史文件已有跨工具进程读回，正式产品按同一合同验收。 [接口设计与证据](architecture-and-milestones.md#wechat-devtools-process-reopen)

## 构建身份的读取与绑定

UC-P10 使用生成清单及实际宿主读回所选构建，再同 UC-P07/UC-P09 的准备、资源所有者和退役回执衔接。微信资源只由对应的导航尝试取得或释放。最终写入沿 UC-P08 复核当前活动版本和该次提交。 [接口与阶段](../analysis/capability-first-v1/shared-update-host-design.json#/portable_boot_entry_identity)

UC-P10 的 `bindNewBoot` 继续接收 `BootReadinessReceipt`。生成产物提供 `buildId`，宿主提供实际 `bootId`，活动内容由 UC-P08 的权威读取确认。微信分包进入游戏前读取包内身份并与 App 已绑定值核对。内容重绑继续沿同一次宿主启动。 [数据来源与计划](architecture-and-milestones.md#reconstructed-build-identity)

## 补丁结果与准备状态

D1 在现有退出码解释之后发布有效所选条目的准备标记。控制器持有补丁等待阶段与待处理位，成功时消费该位，再由登录所有者按现行准备编号续接。子视图任务槽及窗口、表单准入沿同一个提交入口核对。D5 的通知端口接收提示文本与临时清理请求。 [F5A 的结果合同](launcher-static.md#f5a-patch-completion)

## 登录表单的编辑事件

D1 由现有登录所有者维护准备编号、已尝试位、待处理位和账号资格。F5A 密码改动只清待处理。D5 将输入变化、焦点和按钮动作分别映射到既有表单与宿主入口，沿同一组用例验证晚到提交和提示恢复。 [两版来源与用例](launcher-static.md#launcher-edit-focus)

## 注销回包与角色升级结果

D0 按 Item 的 `VKW` 条件记录就绪结果及待切换状态。D2 由现有会话所有者分别维护注销请求起点和选服刷新后的会话起点，并按结果与确认阶段退役连接。 [注销规则](game-static.md#legacy-item-logout-clock)

D2 沿现有角色会话处理 `WDM` 的结果低字节。类别 7 的 `5[B` 字节串由有来源的资料所有者提供，资料来源未明时当前共享入口报告 `LEGACY_CHARACTER_UPGRADE_MATERIAL`。固定样本在实际字串为空时仍追加字段分隔符并进入等待，D0/D2 共用该条件用例。 [两版编码及目标差异](game-static.md#legacy-upgrade-empty-material)

D0 保留先接收、再发布待切换状态、再派发活动状态的顺序。D2 使用活动状态和来源配置解释结果，验收发送前收到结果、同一轮两条结果和待切换覆盖。 [原帧顺序与本机差异](game-static.md#legacy-item-upgrade-result-flow)

D0 在共用发送所有者中保留入队回执与字节裁减。D2 的升级阶段按原版提交返回和等待窗分配顺序推进，升级结果仍从 `WDM` 分派。 [发送与等待的来源约束](game-static.md#legacy-item-upgrade-submit)

## 经典窗口的状态入口与保存请求

UC-P01、UC-P05、UC-P09 复用现有状态、帧和退役所有者。调用者按已发布状态请求捕获、析构、清指针或重开，窗口所有者按调用返回后的活动状态决定后续。UC-P12 接收图鉴及邮件保存效果。D2/D4 沿现有回场和战斗阶段调度。 [规则与归属](../analysis/capability-first-v1/alternate-window-contract.json#/item_classic_window_reentry/rebuild_modes/implementation)

固定 SE 战斗指令窗按关窗请求、当帧标记和下一次整理推进。D0/D4 复用现有帧入口处理阶段 5 等待与阶段 6 回放。输入所有者传递事件位和当前模式，关闭态仍更新呈现，窗口从各控件当时的参与标志产生绘制。 [原版顺序与用例](game-static.md#battle-266-window-control-writes)

D0/D4 沿同一帧入口排图形和频道文字，模式 3/4 在本次提交后更新窗体持有的文字，供下一次合资格绘制读取。窗口待退役时按类型释放控件数据，最后移出活动表。BF-T36 沿现有 `SourceValueContext` 的逐字来源消费所核顺序，输入续接的实际写入按其准入条件验收。 [绘制、文字和回收](game-static.md#battle-266-window-draw-retirement)

窗体退役先以窗口身份检查拖放持有者及回调，再以控件数据身份核默认编辑目标。复用现有输入事件和帧边界，宿主指针取消只走对应端口的原始按键清理。默认文字目标随实际焦点发布回执更新。 [拖放、按键和文字焦点](game-static.md#battle-266-window-input-retirement)

商店输入携带当前窗口修订号。有效撤选依次更新显示偏移、可见两段行文本及价格、数量和按钮参与状态、合计。结算仍沿现有原报价顺序。游戏窗口按实际活动实例核迟到操作，共用帧写入范围由 BF-T36 消费。 [窗口回写和对照](game-static.md#fixed-se-shop-retirement-refresh)

组合状态按当前编辑目标代次绑定。使用现有字节量宽，按频道提交组合串、候选编号及候选文字，矩形随同一帧队列处理。实际提交内容由编辑端口消费，活动呈现和候选关闭各有回执。 [源队列与目标用例](game-static.md#battle-266-ime-presentation)

经典场景提示复用共享 `Ta>` 解码、场景返回、时钟和帧入口。创建回执分别观察过渡指针和活动指针。到期由窗口回调提交待退役状态，下一次窗口整理才清活动指针。 [调用和回执条件](game-static.md#legacy-scene-label-window)

## 普通按键事件与窗口槽位

D0/D3 在现有窗口与普通业务入口区分启用输入、标记关窗、真正析构和新资料发布。窗 45、46 复用一套呈现，提交和释放取各自业务归属。D2 让换场结束旧操作，仍按原格式接收资料。 [来源和接线边界](game-static.md#fixed-se-item-target-retirement)

D0 按所处子状态在经典帧之前、之后或两侧检查 End 的首次触发位。工作计时及经典回调的重复或跳过也由该分支确定。关闭请求先保存旧副槽并清槽，符合源条件时同一调用内请求恢复窗口 1。D3 沿既有窗口所有者使用该顺序。 [帧分派](game-static.md#legacy-item-classic-frame-dispatch) · [按键与恢复](game-static.md#legacy-item-normal-slot-producers)

固定 Item 的 `9/252` 要求调度方在同一外层更新内两次调用对象与窗口所有者。每遍从当前对象、输入和工作上下文读值，第一次留下的过渡和退役标记供第二次处理。用同一个输入所有者管理外层的首次事件清理，并由帧时钟接收绘制后的新样本。D2 在完成两遍后发布状态 20。 [恢复帧的调用约束](game-static.md#legacy-item-double-window-frame)

D0/D2 沿同一窗口所有者处理两版状态 11 的首次清槽、创建和确认。游戏流程持有提示及选服状态，UC-P03 提供本次按下，UC-P11 提供绑定活动会话的读结果，UC-P09 收尾旧资源。普通入场沿现有角色、资源和呈现接口分别核 ACK、逻辑准备及有效首帧回执。 [组合规格](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition)

D0/D2 复用现有角色字段与会话入口，按实际发送返回后采样超时，在同一入场实例中处理失败确认、地图与本机角色就绪。UC-P13 沿 GF-A07 记录真正提交的首帧。 [入场用例与差异](game-static.md#fixed-item-world-entry)

D0/D2 沿 GF-A05 把当前选择、旧角色运行资料、缓存读回及经典窗初始化交各现有所有者。入场前按来源核清除范围和仍可读的角色记录。UC-P03 处理适用的宿主输入，UC-P09 核旧资源退役。 [状态 5 规则](game-static.md#fixed-item-state5-reset)

D0/D2 在现有草稿和角色会话中连接 `profile.dat` 的资料准备与一次创建提交，按回执核计时、提示、字段更新和两槽名单刷新。现有角色选择在刷新后消费可选记录。 [创建及刷新顺序](game-static.md#fixed-item-character-creation)

D0/D2 按共用角色规格复用 `legacy-game-characters` 的名单和 `legacy-game-character-codes` 的预览数值。角色会话处理真实名单结果，输入和显示端口核空槽与已有角色的激活时点、维护提示、取消和返回选服。D5 记录实际预览提交与有效动作。 [角色名单及输入接口](game-static.md#fixed-item-character-roster)

D0/D2 复用 `legacy-game-character-options` 和 `legacy-game-character-codes`。在角色会话区分外观字段、请求样式、准备后的样式及实际预览对象。三张表沿资源持有者接帧查询，D5 核旧对象退役、分配失败、控件反馈和选中槽入场。 [外观及预览接口](game-static.md#fixed-item-character-appearance)

D0/D2 由选角会话持有两槽预览，复用 `legacy-game-animation` 逐次调用及资源库的几何和绘制计划。首次准备与共用帧按实际顺序调用。图块读回失败、对象退役和最终画面由同一角色预览用例核回执。 [选角与资源接口](game-static.md#fixed-item-character-preview-frame)

D0/D2 复用绘制计划和资源库任务。选角会话在本次动作处理和旧对象退役后提交当前两槽，保持对象申请顺序和相同优先级的排序条件。替换或关闭时取消在途旧绘制，沿 CH-T14 核旧任务回执及新帧实际提交。 [绘制提交与取消端口](game-static.md#fixed-item-character-preview-draw)

D0/D2 在建角会话管理两份预览和方向。沿同一资源库、动画与绘制计划输出直接记录和对象收集记录，详情往返时按来源退役和重建。各端接入方向输入和实际提交回执，共用草稿恢复用例。 [建角预览接口](game-static.md#fixed-item-character-creation-preview)

D0/D2 由草稿统一验证对向属性加点和可用转移，再输出详情及肖像投影。D5 将各端一次按下、重复和取消接入同一状态语义。确认取消保留草稿，接受后沿已有资料和创建请求所有者处理。 [详情控制和输出](game-static.md#fixed-item-character-creation-details)

D0 在现有输入所有者分别保存移动点和各键事件点，按控件消费者取用。D5 由画布适配层提供尺寸和事件位置，按宿主实际输入处理初次触点、拖动、释放及捕获取消。调整尺寸后的第一条事件与绘制重建共用 PR-A10。 [位置和事件接口](game-static.md#legacy-item-pointer-position)

D0 从普通帧发布依据移动点的选中格和一次按下。D2 将该格交给现有转向、拾取及活动角色查询入口，分别核时钟、窗口活动值和实体掩码。D5 以实际投递的移动、按下和释放验输入归属。 [右键输入与业务接口](game-static.md#fixed-se-ordinary-right-click-position)

D0/D3 将启动时的图鉴按钮描述符、工具栏偏移及物品槽匹配后的清除归入现有窗口和输入所有者。局部更新先发布偏移再检查命中，绘制引用同一描述符。图鉴按钮读取活动槽决定请求目标，切换沿缓存检查，选中态沿活动槽。键盘回调复用窗口 23 请求。普通帧接线待实际调用证据。 [初始化、输入和回包顺序](game-static.md#legacy-item-album-toolbar-and-slot-reset)

D0/D3 在已有窗口所有者里保留槽位选中、图形逻辑值、缓存指针和一次性退役标记。训练沿预览指针所有者和活动模式处理清理，工艺按实际槽检查配对关闭，图鉴详情先保存再清预览。 [共用窗口合同](game-static.md#alternate-window-selection-and-cleanup)

D0 在既有经典帧按当时的控件参与值分派输入。D3 由 `legacy-game-map-dialog` 和 `legacy-game-map-pet-training` 持有等待页、零基栏位和待退役状态。确认使用当前对话字段沿原 `/1I` 入口提交，宿主复用现有局部确认交互。 [接口差异及用例](../analysis/capability-first-v1/game-training-services-contract.json#/classic_pet_training_wait_owner/controls)

D0 将经典快捷键接在窗口控件遍历之后、外层首次按下位清除之前。D3 将工具栏和键盘接到同一个列表 19 开关，按当前指针提交创建或标记退役。有效行先发布选择，详情 20 复用该选择。无记录的点击沿现有控件反馈规则处理。 [帧顺序与选择合同](game-static.md#legacy-item-classic-album-ingress)

D0 按同一窗口合同处理刷新、控件分派和实际退役。D3 在 SF-D7 复用现有 `createBattleFriendRoster` 的字节输入和分类投影，补按角色槽的记录、列表与详情投影。详情在下一次相应刷新时按当时选择处理发现标记，原有战斗匹配继续读取当时的资料。 [现有入口与差异](../analysis/capability-first-v1/game-social-family-album-functional-specification.json#/legacy_se_classic_album_ingress/entry_admission/implementation_handoff)

D0 沿现有输入所有者管理一次性事件和长按重复位。普通帧后段先更新事件，再组装并排序绘制列表，随后发布文字或绘制命中。D3 复用共享绘制排序，按来源处理 3 或 4 个标记槽预留及同级命中。 [帧顺序和命中规则](game-static.md#legacy-item-frame-hit-selection)

## 登录器资源尾部与历史游戏的路径输入

D1 继续由目录快照提供有序资源行。D0 用 `mergeLegacyGameResourceParameters` 将可见配置首行放在命令尾前，再经 `createLegacyGameResourcePlan` 生成七组路径。固定 Item 的有效数字参数、默认名和别名与现有 SE 路径模型对齐，原生文件打开及当前同版消费继续沿对应来源验收。 [共享入口](../shared/legacy-game-resource-paths.mjs) · [Item 参数和发布](game-static.md#legacy-item-resource-handoff)

固定 Item 的同一启动上下文保存两项解析字段，选服再次读取后再发布有界工作副本。D0/D1 复用现有交接和生命周期端口，保留字段清零、缺前缀时的沿用及选服后的发布顺序。 [两处读取与写入](game-static.md#legacy-item-startup-handoff)

## 资源库的代表色与精灵解码

`createLegacyGameResourceLibrary` 已持有 65,536 项代表色和已知标记，并按需经 `minimapColorTable(ids)` 计算。D0 复用这个资源版本的所有者。仅在掌握对应来源身份和时间值时接受原 `auto.dat` 快照，缺少可信时间时沿现有计算入口重建。D2 将代表色、命名调色板和精灵路径各自的输出范围纳入解码规格。精灵复用判断同时核对该路径所需的尺寸、色表长度与资源归属。 [现有资源库](../shared/legacy-game-resource-library.mjs) · [原版读写顺序](game-static.md#legacy-graphics-scratch-provenance)

图形缓存部分成功由现有资源库与绘制任务接收。D0/D2 沿 UC-P06、UC-P13 提供真实块覆盖、占用释放和呈现回执。恢复以当前已生成的计划为准，已产出的游戏请求由现有帧所有者维护。 [部分链与接线](game-static.md#legacy-graphics-partial-cache)

UC-P13 的呈现回执包含与本次画面实际对应的颜色结果。D0/D2 用现有图形缓存保存已提交的颜色及标签，达到限额后保持旧块可绘，下一次再按新计划的标签核对。 [限额和现有入口](game-static.md#legacy-graphics-deferred-upload)

启动标识沿 UC-P07 用当前素材身份读取当次请求的调色资料。D0/D2 由共享帧推进已取到的颜色状态，旧读结果只按其来源和当次选择接收。跳过绘制的逻辑轮也可更新颜色，UC-P13 仅对实际画面提供呈现回执。 [选材与帧顺序](game-static.md#fixed-se-startup-palette-publication)

场景标签沿现有解码入口复用 `code`，普通场景在同一所有者消费待选值和时段跟随。用 UC-P13 核内层背景、当轮外层颜色与当前场景的实际呈现。已有 `presentOrdinaryFrame` 与换图输入用例用于核对当前画面的归属和输入恢复。 [普通捕获与提交](game-static.md#fixed-se-scene-palette-follow)

D0/D2 在现有精灵和资源库入口复用 RD 的字节索引，保留实际来源位深、掩码和已发布的颜色。UC-P13 按画面实际使用的调色编号、修订、命名选择和步幅核所选上传回执，缓存标签与表面结果各按实际分支确认。 [默认表入口](game-static.md#fixed-se-palette-output-depth) · [显式表及标签](game-static.md#fixed-se-explicit-palette-upload)

Item 的重建准备沿同一个颜色所有者提供实际位深、通道掩码及默认表。D0/D2 复用 SE 的命名映射和现有 RD 索引，按各位深的写宽及步幅接实际上传结果。UC-P13 按块记录颜色号、修订、选择和实际呈现，沿共用用例核空槽及延期。 [重建与默认表](game-static.md#fixed-item-palette-output-depth) · [显式表和标签](game-static.md#fixed-item-explicit-palette-upload)

城市控制器 `present(frame, paint)` 已在 `paint` 成功后保留该帧。D0/D2 沿 UC-P06、UC-P13 和战斗画布已有作业回执接入普通回场提交。由当前场景的成功呈现推动交互恢复，失效或失败的任务按已有代次释放，独立记录准备、提交与排空。 [接口对照与用例](game-static.md#legacy-transition-background)

D0/D2 沿 `presentOrdinaryFrame` 和现有 Canvas 提交入口接换图结果，给过渡末帧回执绑定对应的场景身份与绘制作业。普通首帧仍经该图的实际帧入口报告。现有资料就绪用于安排绘制及资产读取，有效提交后才开放目标端交互。 [换图状态及回执](game-static.md#fixed-se-ordinary-map-fades)

共用过渡控制器仍负责逻辑推进。`advanceCityReturn()` 已准备且尚待 `presentCityReturn()` 提交的帧，交由场景所有者在宿主替换时核对来源和代次后续接。UC-P06、UC-P13 同时覆盖重新准备、旧作业释放及提交失败。 [画布替换和故障的复现](game-static.md#legacy-transition-graphics-rebuild)

## 微信 TCP 适配器的建连阶段

`createWeChatLauncherTransport` 使用现有端点校验和连接白名单。符合两项校验的同机私有地址在所测基础库 3.18.0 返回 `STREAM_CONNECT`。四组回调注册和移除已分别观察到正常返回，连接建立后的实际读写、取消和关闭继续按 D5/D6 验收。 [接口实测](network-portability.md#wechat-devtools-local-tcp)

## 11 月分发版的游戏创建边界

D1 将带引号的命令行、显式应用名及映射载荷交给既有交接所有者。路径引号可复用现有更新器的字节规则，映射复用已有首个 NUL 和无符号数字格式。F5A 的命令输入沿分发版绑定选中记录和可选参数段。数字输入明确区分回调原值与已保存值，32 位调整在写入时执行一次。历史进程计划沿用各自的应用名规则。 [字段与顺序](launcher-static.md#f5a-handoff-number-origin)

游戏目录、显式 EXE 和可写命令行沿同一次前检交给原版进程创建接口。普通 CG 路径还选中 `CGSharedMem` 并传入七个资源模板。D1 继续沿现有路径、参数与启动端口归并这一来源，D6 验证实际宿主枚举、游戏读取和联合交接。 [创建参数和范围](launcher-static.md#f5a-official-launcher)

D1 复用交接编码与当前对象所有者。宿主发布处理同名覆盖及首次视图准入，按名移除和整对象退役走既有生命周期端口。发布回执、进程结果和界面返回分别来自对应的实际完成点。 [现有编码](../shared/launcher-handoff.mjs) · [映射生命周期](launcher-static.md#f5a-mapping-lifecycle)

D1 的资源快照沿现有有序 `entries` 传入 `fileNameBytes` 和文件属性。宿主提供匹配行的长文件名，包括由短名命中的行。保留枚举顺序和最后已发布的记录，首次查找失败时传空组。11 月分发版从小写后的标题缓冲区倒扫末个 `0x5F`，涵盖索引 0 和双字节尾部。非 ASCII 需绑定宿主实际区域设置。 [文件枚举与标题](launcher-static.md#f5a-resource-title-bytes)

实际 Windows 七组快照的六组顺序与小写名称排序输入不同。D1 直接沿宿主序号处理，长名原字节用于生成标题，短名可供核对匹配来源。该 Windows 进程的 ANSI 代码页实测为 936，F5A 自身的 CRT locale 继续按原规格验证。 [顺序与代码页](launcher-static.md#windows-installed-resource-enumeration)

D1 的登录输入沿现有显式编码配置，按保存后的 ANSI 字节校验各 16 字节。资源标题使用快照中的原始字节和本次操作实际选定的表。F5A 先按 `GetACP` 初始化，构造器再次选择时保留相同代码页的表。变更后的线程表按共享条件刷新，小写、原字节下划线替换及词族搜索依次处理。 [来源与用例](launcher-static.md#f5a-normal-startup-locale-selection)

## 登录错误提示与会话退役

现有会话所有者负责候选期限、提交获接纳和回复期限。D0/D1 沿来源处理计时器下的就绪与截止先后，复用本地尝试标识拒绝迟到的旧事件。D5 交付调度结果、确认返回值和关闭回执，确认后由所有者读取此刻的忙态。 [两版计时器和退出规格](launcher-static.md#launcher-login-timer-dispatch)

D1/D5 的普通退出沿现有尝试身份管理确认结果、F5A 排队编号和关闭请求。现有取消交换端口继续承接已决定的取消。宿主单独报告页面退役与旧通道关闭结果。 [共用验收](launcher-static.md#launcher-ordinary-exit-confirmation)

C82 所选错误回调先清忙标记，再展示主窗拥有的错误提示。实际显示模态提示的宿主需按该提示的生命周期管理普通提交。提示结束后的控件恢复与会话注销各有明确完成点。现有会话标识继续承接迟到事件的拒绝，预设选择沿成功回包和候选列表的准入。 [登录错误规则](launcher-static.md#c82-owned-login-error)

对于 F5A 的排队提交，宿主交付编号后，所有者在匹配时先消费待处理项，再读取此刻的窗口准入状态。Windows 原生夹具在提示期间仍派发消息，主窗恢复启用后由控件所有者恢复独立禁用的按钮。 [消息与控件实测](launcher-static.md#windows-launcher-modal-dispatch)

11 月版将准备编号、已尝试和待处理状态归到同一主窗。D1 沿现有会话所有者处理合资格预设引起的编号变化，以及同编号重新准备时保留的已尝试位。D5 提供窗口启用与投递回执，匹配编号才消费当前待处理项。 [11 月版提交接口](launcher-static.md#f5a-login-owner) · [编号与预设规则](launcher-static.md#f5a-preparation-generation)

列表激活沿现有阶段确认入口，按同一会话所有者核对阶段、当前选择和忙状态。列表选择变更走原资料投影，F5A 的待处理位由阶段 3 确认消费。 [两版列表入口](launcher-static.md#launcher-list-activation)

D1 的会话所有者分别保留收到回复、停止返回与获准更新选择的结果。同步步骤分派和控件恢复请求先于选择更新。正常阶段 3 的非空结果先保存交接数字，再由选择所有者核对唯一候选和显示行。自动选择与手动选择沿同一个确认入口重读选择，交给启动所有者。 [回复准入](launcher-static.md#f5a-status-zero-admission) · [确认与交接](launcher-static.md#f5a-result-selection)

D1 沿现有启动所有者处理创建返回和任务槽。D5 接收托盘、窗口和提示请求，提示返回后才走所选准备。会话所有者按同一编号和收到消息时的阶段消费排队提交，回复借用在正常尾部归还。 [调用与所有权](launcher-static.md#f5a-start-return)

现有 `remoteClosed(attemptId, now)` 将等待中的完整流断线结为 `FLOW_REMOTE_CLOSED`。D1 需表达 11 月版无回复断线先记录待重试、再由登录定时器推进候选的规则，沿用 `closeRequested.attemptId` 退役原尝试及忽略迟到事件。所选错误结果在提示前请求停止，提示返回后恢复控件和焦点，接收回调归还自己的借用。 [断线及错误结果](launcher-static.md#f5a-disconnect-retry)

D0/D1 以原尝试标识关联接收借用、关闭请求和宿主回执。D5 沿现有 `SessionTransport` 和 `OwnerLifecycle` 提交实际退役结果。旧读、关闭成功或失败的迟到回执只更新原所有者。用同一组案例核对取消立即返回、旧流待回执和新尝试已启动的组合。 [来源和共用用例](launcher-static.md#f5a-pump-retirement)

F5A 的候选和回包等待期限由现有登录会话所有者管理。宿主解析完成回执随尝试标识返回，取消与到期将当前任务从前台退役。所选成功解析保留期限，提交成功后续期。 [候选解析及期限](launcher-static.md#f5a-candidate-lifecycle)

D1 的首次配置沿现有配置字节与子进程所有者。F5A 的活动观察需要保存启动时钟、提醒位和捕获的配置节与键，分别接收查询失败、活动、加载失败及其它退出的结果。内存完成记录和持久化回执分别报告，结束后恢复主窗步骤处理。 [观察与续接依据](launcher-static.md#f5a-first-config)

设置编辑继续使用 `createDefaultGameConfig`、`decodeGameConfig` 和 `encodeGameConfig`。D1 将默认写入、用户确认写入及窗口关闭按来源阶段提交。D5 提供独立的文件提交、窗口结果和进程或宿主退役回执，D0 将实际已保存设置交给启动上下文。 [设置字节接口](../shared/game-config.mjs) · [流程用例](validation.md#first-config-outcome-validation)

目录和设置的提交、重开沿 UC-P12 与现有资源绑定。复用原始 Code 的设置键及目录条目身份，配置读取按活动根选择文件。D0/D1 补共用任务准入和来源版本的配置策略，D5 给三端接实际文件、存储及重开回执。 [控制顺序及交接](launcher-static.md#first-config-directory-composition)

D1 的目录恢复沿现有配置所有者，排队上下文携带条目索引及阶段，选择器持有共用操作标记。两个路径检查和写入回执通过后发布目录。排队成功交回既有登录准备，右键成功交回列表刷新。D5 沿原宿主端口核提示和写入结果。 [目录恢复依据](launcher-static.md#f5a-directory-recovery)

恢复候选沿 UC-P01 绑定本次尝试，沿 UC-P07 与 UC-P08 核根身份、内容和可读性。UC-P12 保存路径设置并返回提交结果。状态未知时沿已有提交号或可核对的修订与绑定读回，确认后才续接当前操作。旧目录仍可用时保留到替换成功。 [端口与用例](launcher-static.md#launcher-directory-host-handoff)

失败提示沿现有主窗所有者保存提示标记并接收关闭或重选结果。主窗恢复后，处理重选结果时才为目录恢复读取当前条目和阶段。D5 用现有提示和消息端口验收嵌套派发及普通关闭。 [提示与排队顺序](launcher-static.md#f5a-recovery-prompt)

## 普通关窗与补丁跟踪的接口

D1 沿现有会话和宿主生命周期端口，记录 Stop、后续关窗投递和实际窗口退役的完成点。F5A 忙态路径先消费延后字，再尝试异步投递。补丁任务的进程退出及备份结果由任务生命周期报告，子视图回收时释放该任务的跟踪句柄。 [消息和句柄顺序](launcher-static.md#f5a-close-ownership)

## 补丁器回退与备份启动的接口

D1 按来源版本解释登录器模块目录与原始 Code。F5A 的回退源以模块目录构造，目标仍沿游戏安装目录和 `PatchEXE` 生成。现有 `packagedSourceRelativeBytes` 仍是旧版目录形状。复刻时分别接收回退复制与备份启动的结果，退出 102 沿原尝试计数重建备份并再次启动。 [补丁回退路径](launcher-static.md#f5a-patch-fallback)

C82 的 `createWin32LauncherPatchPlan` 已提供显式应用路径和加引号的命令行。F5A 的所选启动入口沿相同参数次序。固定安装补丁器在 `argc < 3` 时返回 102，现有 `interpretWin32LauncherPatchExit` 已表达前两次重试和第三次耗尽。 [共享接口](../shared/launcher-patch-current.mjs) · [参数核验](validation.md#installed-patcher-argument-handoff-validation)

F5A 的备份启动应记录属性检查、旧备份清理、复制、定时器和进程创建的结果。退出 102 后重读备份属性。定时器错误 8 和进程创建错误按各自的原始回执报告，同时记录本次备份清理是否成功。 [备份检查与失败回执](launcher-static.md#f5a-installation-and-backup-preflight)

<a id="fixed-se-battle-selection-interface"></a>

## 战斗技能选择与提示的帧接口

`chooseInputPetSkill`、`chooseInputTarget` 和现有组包继续提供语义输入。D0/D4 由同一窗体和战斗输入所有者接窗 26 的参与状态、窗 10 的待开与活动实例、回调实参及序号重置。文字先提交条目 12 的当时字串，再按当时技能复制新值。用同一组案例核本轮控件重置、窗体遍历后的重置及实际再绘制。 [来源与用例](game-static.md#fixed-se-battle-window-target-selection)

在窗 10 的真实控件入口，按可见行检查资格、按所选技能及实际角色检查 MP，再把查到的技能序号交现有输入所有者。资格位拒绝和 MP 不足分别沿原版反馈，活动窗在回调返回后按当前指针标记退役。十行资料由现有宠物收包入口提供。 [两种模式的共同规则](game-static.md#fixed-se-battle-skill-list-admission)

## SKL266 的结果队列暂存

`planBattlePhysicalFamily` 已用最后一条外部 RID 的后两项构造所选自身尾部，外部上下文缺失时返回 `physical-family-self-RID-prior-context`。D4 的 BF-D7 补普通外部元组的第四格。首个有效外部 RID 将循环暂存替换为转换后的第一项。多目标投射物可沿现有四格复制接收该值，命中继续用结果标志判定 RID 后缀。原始值未知时保留来源条件。 [RID 暂存](game-static.md#battle-266-rid-frame) · [投射物复制](game-static.md#battle-266-projectile-row)

同一 BF-D7 复用角色登记和动作队列，按飞行物实际动作消费当前护卫槽。动作 24 空槽推进自身，71 分别推进已登记角色与自身，217 的转向、测距与释放沿有效目标及当前槽核对。实际槽替换及缺少有效目标时的处理沿 BF-T36。 [槽消费及本机差异](game-static.md#battle-266-guard-slot-consumption)

登记入口保留槽号与对象身份，沿同一回调完成 A 的替换。BF-T36 对照普通动作 49 按槽清零的原指令与现有 `detach` 的身份判定，覆盖旧 B 晚于新登记退场时的消费结果。 [登记与退场顺序](game-static.md#battle-slot-publication-order)

首次暂存的来源归现有 BF-D7。D0 提供按实际帧顺序得到的来源上下文，D4 从同一上下文取三个暂存字。普通帧可清零三个字，404 自身换身及 405 目标附件可更新其中的 `+0x14`。404 的普通第四格取 `+0x38`，附加 RID 行沿原标志门槛处理。 [技能写入](game-static.md#battle-result-scratch-writers) · [帧内覆盖](game-static.md#battle-receive-scratch-overlap)

沿用 `createLegacyGameBattleCommands` 的合并、游标和倒计时，并通过 `SourceValueContext` 提供接收初值与 404、405 的逐字写入。D0/D4 依实际顺序交给 266 的读取点。清零覆盖已知范围，跳过清零时沿已证写入决定各字来源。 [同帧规则](game-static.md#battle-266-same-frame-producers) · [相邻帧与共用验收](game-static.md#battle-266-adjacent-frame)

固定 SE 的所选曲目保存按同一来源上下文记入接收之后和主状态分派之前。D0/D4 用普通入战的首次背景捕获作为旧请求失效点，用 BF-T36 对照适用的帧内编码、接收清零和后续对象逐字替换。 [音频保存的写入](game-static.md#battle-266-audio-map-save) · [普通入战次序](game-static.md#battle-entry-audio-request)

所选对象排序、绘制提交及键盘输出均与三个来源字分开。已有帧调度可沿用这些已核步骤，后续按活动窗口和接收分派记录可能改变的最后写入。 [指令核验和适用分支](game-static.md#battle-266-frame-intervening-writes)

复用 `wallSeconds` 的宿主采样及已有会话基准，保留游戏日期的 32 位投影。真实时区异常按宿主返回核对，日期发布与战斗计时和逐字来源各沿已有接口。 [时区缓存和本机回执](game-static.md#battle-266-host-calendar)

D4 复用战斗回放的对象顺序和 105 共享游标。106 仍以分身自己的一行结果进入动作 14，按命中时点和反射标记选择源查找，并保持提示前后两次读取的时点。原指针消费的实际结果仍沿 BF-U1 验收。 [调用与用例](game-static.md#battle-105-106-callback-order)

现有共享解码继续提供施法者、结果角色和自身护卫的依赖计数。D4 对所选有无护卫的仅自身 RID 命令沿原预检条件准入。现有 `ContextOwner` 和 `SourceValueContext` 提供已证清零帧的暂存值。先按角色对象和游标保留三字段行的第四格，再向已发布的结果对象追加常规行和附加行。同槽的两组写入共用一个对象，实际回放沿既有命令所有者处理等待与退役。 [原预检](game-static.md#battle-266-source-admission) · [护卫写入与本地差异](game-static.md#battle-266-self-guard-context)

动作 22 和 217 继续复用 `legacyGameBattleDistance`、角色查表和元组／动作游标。BF-D7 在同一角色上保持 `+0xFF0` 所对应的延迟计数，动作 23 消费该值。飞行物的交接、标记退役和实际释放分别通过既有回调与对象遍历核对。 [两次测距和计数归属](game-static.md#battle-266-return-order)

## Item 的普通按键状态与帧边界

D0 由现有输入所有者在逻辑帧前接收平台消息，区分按住、首次按下、松开和持续按下。在该帧完成业务与经典窗口回调后清除瞬时位。Item 来源的窗口激活清理和输入模式切换有独立顺序。图鉴局部匹配沿同一状态表，正常帧准入继续追证。 [状态位与调用顺序](game-static.md#legacy-item-keyboard-frame)

## Item 鼠标事件和窗口恢复

D0 将原版按下、双击和事件清理映射到既有共享输入端口。延后动作与计时恢复共用另一套窗口的打开请求，并各自按源顺序消费恢复字。经典窗口帧循环沿活动对象及其附属记录取回调。D3 的训练、工艺、图鉴继续按相应窗口的已证准入绑定。 [源状态与调用顺序](game-static.md#legacy-item-window-admission)

经典窗口所有者处理活动表、当前窗口与附属记录的发布。D0 依次调用初始化、普通回调和退役入口，按命中结果和回调返回值传递输入值。D3 将训练收包的组关闭作为同步操作，沿相同退役入口处理匹配的窗口。 [创建与两条关闭路径](game-static.md#legacy-item-classic-callback-order)

经典图鉴将控件和快捷键映射到现有窗口所有者。每次动作读取实际活动槽，创建请求由窗口过渡消费。现有协议入口和 `shared/legacy-game-battle-friends.mjs` 可复用记录投影。SF-D7 仍须提供角色 bank、选择和详情所需的资料。 [窗口及资料依据](../analysis/capability-first-v1/game-social-family-album-functional-specification.json#/legacy_se_classic_album_ingress)

D0 在经典帧调用后重读控件参与值，由同一个窗口所有者保留待退役状态。D3 复用对话模型的治疗行、实时金币和回复入口，将选择提示与现有页面的输入、绘制和关闭绑定。 [帧与治疗合同](game-static.md#legacy-classic-dialog-frame-hook)

OS-D2 复用 `shared/legacy-game-protocol.mjs` 的 `Q?m` 接收和 `shared/legacy-game-actors.mjs` 的身体所有权。普通分派返回后按来包角色 ID 查当时的身体和记录类型，使用现有场景状态和身体位置决定朝向。重合位置沿对应来源档判定。 [接线依据](game-static.md#legacy-dialog-actor-facing)

D0 让 `createLegacyGameWorldProtocol` 的地图动作读取当前对话活动值。D3 复用 `createLegacyGameMapDialog` 的解码、回复和本地修订，在经典窗所有者统一处理等待与退役。本地修订识别控件所属窗口，入站关闭根据模式和角色匹配。地图动作、控件清值和真正的窗整理使用已证帧顺序。 [接线及验收条件](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/fixed_se_ordinary_dialog_lifecycle/implementation)

## 桌面浏览器流的回执和关闭

`createBrowserLauncherTransport` 与 `createBrowserGameTransport` 共用回环桥写入回执。`written.ordinal` 关联该连接内的本机写入。所选超时从桥 `BRIDGE_TIMEOUT` 映射到浏览器 `STREAM_READ`。待处理读的取消返回 `STREAM_ABORTED`，底层关闭由实际 TCP 回执验证。替换连接独立处理队列和 EOF。 [实测与适用范围](network-portability.md#desktop-stream-lifecycle)

## C82 游戏创建的接口差异

现有 `createLauncherProcessPlan` 产生旧版原始命令及空 `applicationName`。D1 的 C82 生产端需要已发布的目录与显式 EXE 路径，复用当前版路径加引号规则。共同七组仍由资源枚举快照承接。创建结果、映射退役、关闭句柄、托盘显示及游戏接受由相应生命周期与宿主接口承接。 [创建来源与差异](launcher-static.md#c82-game-process-producer)

`snapshotLauncherDirectory` 按调用者提供的长名顺序生成七组快照。共享参数转换可以复用，C82 分支需接受索引 0 的下划线替换。Win32 搜索适配按完整模式的 ANSI 字节数处理 260 字节边界，初次失败输出空组，推进结束保留已缓冲的当前项。 [枚举与标题规则](launcher-static.md#c82-resource-arguments)

固定历史资源链已实际串接 `createLauncherResourceArguments`、`mergeLegacyGameResourceParameters` 和 `createLegacyGameResourcePlan`。`createBrowserLegacyGameResourceArchive` 提供范围端口，现有资源库按选定路径初始化。退役时先关闭资源库，再关闭其 ZIP 端口并释放所有者引用。 [消费路径](game-static.md#legacy-resource-handoff) · [共存测量](architecture-and-milestones.md#desktop-resource-working-set)

## 资源范围和动画数据持有量

移动 Safari 的实际 ZIP 夹具经 `createBrowserLegacyGameResourceArchive` 的 `slice(start, end).arrayBuffer()` 取得同源范围数据。底层按精确长度回传，并在每个资源库退役后关闭自己的 ZIP 端口。D0 保持 StableRangeSource 的安全整数偏移和 BudgetAndLease 的所有者顺序。 [范围与关闭实测](architecture-and-milestones.md#mobile-safari-resource-archive)

资源库对同一坐标成员只读一次，`createLegacyGameAnimationCatalog` 当前按组保留七份。D0 沿这两个所有者落实每根一份的私有快照。最终动画记录仍用所属组的 `graphicBase` 和坐标数据源查找。索引应用独立沿原版同名数据的句柄准入。UC-P06 计实际分配，UC-P07 与 UC-P09 按根结算失败和关闭；本机试次已核一次清理和新根首次读取。 [坐标来源](game-static.md#animation-coordinate-alias) · [资源租约和用例](architecture-and-milestones.md#animation-coordinate-storage)

资源库准备以实际成员及组的必要性核缺档。已验证的索引末尾兼容由固定来源的导入处理，通用目录校验沿原边界。首次查找保留覆盖后的所属组，数据缺失沿动画加载错误，未登记编号仍为空。坐标装载保留数据可用性和索引标记各自结果，宿主短读继续走资源端口错误。 [来源及目标规则](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_animation_coordinate_source/load_and_first_lookup)

网页端的预算同时计入仍占用的旧载荷。范围读取完成后，读取层释放可控 Blob 引用和读缓存，再排空根租约。清单删除回执更新目录状态，下一次预算根据宿主用量重新核算。 [双版本实测](architecture-and-milestones.md#browser-full-resource-budget)

所选地图视口复用 `createLegacyGameMapState` 的已核原字节输入和 `createLegacyGameSceneFrameController` 的绘制计划。资源库报告图片缓存及解码计数，归档端口报告物理读数，音频宿主以实际缓冲数和声源启动作为回执。D0/D5 复用这些既有所有者核对该根的缓存、输出和关闭。 [实际数据和适用范围](architecture-and-milestones.md#real-map-resource-budget)

UC-P13 `cue` 沿现有音效 ID 缓存及声部身份报告共享样本与独立输出。`retireAndDrain` 需要声源停止或自然结束的回执、槽归还和实际文件读结算。关闭时已经发出的读仍携原租约，清理回传数据后交还。现有 `wx.createWebAudioContext` 在所测 SDK 支持 `copyToChannel`、`getChannelData` 和可等待的关闭，音频与读取结算复用同一接口。 [微信 SDK 与待接边界](architecture-and-milestones.md#wechat-sdk-audio-voice)

UC-P13 在移动网页沿可信触摸的同步处理申请恢复上下文，并记录实际 `running` 或等待状态。UC-P14 的 `unloadOrClose` 在所测 Safari 导航中能确认关闭要求与晚到读结算，关闭 Promise 随实际回执结算。 [移动宿主回执](architecture-and-milestones.md#mobile-safari-audio-lifecycle)

网页现有单记录缓存以事务终态确认写入，D0 的 UC-P08 多记录端口沿用此规则。配额中止后可按活动根和更新标识查询结果。逐块准备时，已经提交的块归候选根持有，完整清单核验通过后取得发布资格。 [现有存储代码](../web/launcher-resource-store.mjs) · [配额与重试证据](architecture-and-milestones.md#browser-update-quota)

UC-P08 与 UC-P10 重开时核对活动根、回执和重启意图。已有待核对的发布结果时，缺失权威记录进入待恢复，打开后端失败时保留结果待查。重建后的写入沿已有发布标识、活动根和修订比较，覆盖旧根与新根修订号相同的情况。 [现有缓存实测](architecture-and-milestones.md#browser-cache-receipt-recovery)

`commit()` 返回后若发布上下文中断，UC-P08 按更新编号读取提交回执，UC-P10 接续该次发布的重启意图。Chrome 与移动 Safari 模拟器的严格事务夹具均已在重开后按原编号取得已有结果。 [桌面回执](architecture-and-milestones.md#browser-explicit-commit-interruption) · [移动回执](architecture-and-milestones.md#mobile-safari-explicit-commit)

浏览器适配层按打开事件记录版本、结构和等待结果。超时或取消返回后，清理仍在排队的请求。晚到成功时关闭连接，晚到升级时中止事务。Chrome 与 Safari 模拟器已按同一顺序核对。 [打开与迟到处置](architecture-and-milestones.md#browser-cache-open-outcomes)

移动 Safari 模拟器在短时后台保留旧根租约，重开进程可读活动版本与原回执。D0 沿实际读者排空决定释放租约。UC-P11 允许绘制暂停时实际桥接继续交付字节，并按连接标识区分取消、旧 TCP 关闭与替换连接 EOF。 [移动存储恢复](architecture-and-milestones.md#mobile-safari-resource-lifecycle) · [实际桥接](network-portability.md#mobile-safari-stream-lifecycle)

烟雾首帧的图形目录槽 16681 保留有符号高度。后续复刻需推进帧索引与计时，并在普通绘制的有符号裁剪处结束该帧。几何查询需表达原尺寸，像素缓冲仍按实际绘制需要创建。当前正尺寸检查差异列入 D0/D4。 [动画与绘制规格](../analysis/capability-first-v1/resource-corpus-budget.json)

[资源测量与源规则](../analysis/capability-first-v1/resource-corpus-budget.json)

<a id="launcher-startup-functional-specification"></a>

## 当前登录器补证：嵌套退出hook的安装与所选分支已成规（2026-11-11）

QH沿固定C82 App Init的正向OLE初始化调用补齐EA-F13：45C46F在所证mode/HRESULT条件下把45C570写入44FD1F所得对象+3c；alternate mode可返回1而不走本体setter。45A8A6实际以(1,1)调用，再在正常返回后投递退出消息，不能把所有nonzero初始化结果或quit请求当作资源/登录通道已退役。

所选45C502(1)先执行条件OleFlushClipboard、factory链遍历和先移除再虚槽0调用，然后跳过本地零参filter删除/COM-uninitialize分支。实际module flag、资源成员/间接效果保来源条件；不据所选代码报告必现重绑/死锁或完整Windows关闭接受。普通modal期间形成替换binding的合法producer/投递准入、LS-U3实际消息/销毁和Host drain仍待。

新增7必要完整native/477B，复用App Init与quit两完整体；9窗1679B/531指令核原PE，REA已导出关闭。形成9事实、2推导、5操作、3组开发差异和8项未执行接受案例。停止已答OLE/MFC库存扩张，仅沿原必要正向对象/producer或Host证据继续。

原40/81/37/10/6、owner/依赖/批次/profile及14端口62方法保持；19项固定来源本域规格就绪不变，L03/L06/L08及统一A1..A4不提升。产品仍stage306，本轮无产品修改、目标测试/构建、VM/SDK/网络/账号操作。原GP补丁五组与UH三端发布/恢复方案直接复用，先全部能力成规再按D0–D6开发。

继续复用shared/launcher-login.mjs和shared/launcher-flow.mjs、原UC-P09/P14与LR/EA退役合同。后续目标端应让资源回调与已持调用排空可追踪；当前只列QH-D01..03，未增接口或写产品实现。

[quit hook合同](../analysis/capability-first-v1/launcher-quit-hook-contract.json) · [源核验](../build/analysis/launcher-quit-hook-v1/source-review.json) · [本轮核验](../build/analysis/launcher-quit-hook-v1/validation.json) · [原补丁规格](../analysis/capability-first-v1/launcher-game-patch-functional-specification.json)

<a id="launcher-exit-admission"></a>

## 沿既有owner接关闭准入与最终销毁（2026-11-10）

源接口区分E141关闭请求、Frame许可/延迟、窗口DestroyWindow请求、外层App退出、owner Release和borrow归还；这些阶段不合并为一个立即完成布尔值。固定AAChannel槽0删除与槽+4通知分清，源无期限Sleep排空不能成为跨端同步API。

现有distinct-session cancel/late-I/O四例复用，整host关闭/退出及modal准入还须原D1/D5/D6统一组合。没有新API/14端口或62方法变更；LS-U3与真实SDK/三端接受保持未完成。

[退出准入合同](../analysis/capability-first-v1/launcher-exit-admission-contract.json) · [源核验](../build/analysis/launcher-exit-admission-v1/source-review.json) · [既有端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-exit-admission-v1/validation.json)

<a id="launcher-callback-reentry"></a>

## 复用会话端口所有权，modal准入仍属host合同（2026-11-10）

现有createLauncherSession每实例持active/raw/attempt/timer/control；closeActive在调用raw.close之前清本实例active，取消后的迟到open另走dispose。LR-T01..04实测迟到open/read/write及同步close回调启动B，A退役不误关B；测试端口明确由不同实例独占。

该结果不覆盖多个session共用raw、不建立原CChannel registry或Windows modal保证。目录恢复game/step不是请求代次，业务latch也不统一保护MainSubmit；沿原L03 owner补host准入/退役合同。接口和产品代码未改，14端口/62方法及完整三端/SDK接受保持原状态。

[回调入口合同](../analysis/capability-first-v1/launcher-callback-reentry-contract.json) · [源核验](../build/analysis/launcher-callback-reentry-v1/source-review.json) · [端口结果](../build/analysis/launcher-callback-reentry-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-callback-reentry-v1/validation.json)

<a id="launcher-legacy-failure"></a>

## flow失败输入与源typed catch边界（2026-11-10）

现有createLauncherLoginFlow.openFailed只在connecting阶段准入，轮转按有效first/count；取消后旧attempt结果忽略。129原创例验证55顺序/54取消/10deadline/10无效ordinal。源Exp/state11及数字send、无局部deadline的容量wait不直接等于每个host错误，失败分类须由既有adapter/owner明确传入，不能凭源所有异常均可重试。

source wrapped-last和unwrapped initial-1分开，目标统一立即exhaust清理仍有10组对照差异；源flag依实际timer/callback写入。保留14端口/62方法、已闭DM材料与L03原owner；本轮无API/产品代码修改，LS-U3与完整平台接受仍待。

[旧版失败合同](../analysis/capability-first-v1/launcher-legacy-failure-contract.json) · [源核验](../build/analysis/launcher-legacy-failure-v1/source-review.json) · [纯目标对照](../build/analysis/launcher-legacy-failure-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-legacy-failure-v1/validation.json)

<a id="launcher-derived-material"></a>

## 材料拒绝、旧版零尾部与现有接口的差异（2026-11-10）

现有answerLauncherHandshake/answerLauncherCurrentHandshake均在派生材料不足8字节时抛HANDSHAKE_SHORT_KEY；current与源完成阶段拒绝相符。旧版所选零初态方向buffer能保留未写零尾，七原创例被现有generic拒绝，归DM-D1待统一开发；不在本轮改变API或全局放宽current。

来源合同保留current reset/state/getter/connection key的先后及旧版完整清理后才能声明可复用的条件；本地错误名不等于源-5外部调用返回码。14端口/62方法和L03原owner保持，目标send/retire/clock仍沿既有共享合同。

[材料合同](../analysis/capability-first-v1/launcher-derived-material-contract.json) · [来源核验](../build/analysis/launcher-derived-material-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-derived-material-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-derived-material-v1/validation.json)

<a id="launcher-session-functional-specification"></a>

## L03既有接口的profile、deadline与退役合同（2026-11-10）

createLauncherLoginFlow({handshakeProfile})继续选generic/current字节分支；snapshot.deadlineAtMs当前从start保留，总期限不因openFailed/answerChallenge重设。882纯模块检查实际确认此行为；LS-D2待统一开发时接入明确来源阶段时钟，不在本轮声称已修复。

createLauncherRecordCodec/CurrentRecordCodec及相应stream、reply流、login投影继续复用；UI输入16字节与type10每字段18/正文45分别校验。local attemptId仅目标发布资格，不新增线上字段；DNS释放、registry删除、已取得borrow、异步传输关闭分别沿原owner合同，14端口/62方法保持。

[双来源操作规格](../analysis/capability-first-v1/launcher-session-functional-specification.json) · [来源核验](../build/analysis/launcher-session-functional-specification-v1/source-authentication.json) · [纯模块结果](../build/analysis/launcher-session-functional-specification-v1/focused-probe.json) · [本轮核验](../build/analysis/launcher-session-functional-specification-v1/validation.json)

<a id="wechat-sdk-host-probe-preparation"></a>

## WH原生SDK探针与既有端口边界（2026-11-10）

微信开发者工具基础库 3.18.0 的定位读取回传原 ArrayBuffer。D0/D5 的读取端口按实际回调和读到的字节范围处理缓冲，逻辑退役后的完成继续走原所有者排空。Page 返回后读回的 App 事件与文件回执可作本机组合核验。 [本机模拟器实测](architecture-and-milestones.md#wechat-devtools-offline-sdk)

探针直接计划调用真实wx FileSystem/Canvas/TCP和Page事件，不mock API；9原创文件不导入产品核心，语法检查只证明准备。pending I/O buffer在探针所有者保留，逻辑退役不冒充物理停止；未知callback不清空而伪造完成。

已有 StableRangeSource、BudgetAndLease、OwnerLifecycle 和 HostCapabilitiesAndLifecycle 承接后续产品端口。完整宿主用例、App 级写入所有权、真机和 TCP 继续验证。 [原准备档案](../analysis/capability-first-v1/wechat-host-profile.json)

原资源缓存 `commitResources(resources, {expectedRevision})` 已在同一 App 的主包和普通分包上核对。重叠操作返回 `RESOURCE_CACHE_BUSY`，已落定后的旧修订返回 `RESOURCE_CACHE_CONFLICT`，新 App 启动能读回有效槽并修复受控短槽。回执的 `durability` 仍为 `unverified`。产品 App 所有者与通用 SnapshotStore 的历史回执待接入。 [双槽核验](architecture-and-milestones.md#wechat-sdk-slot-store)

UC-P08 的候选发布上下文绑定读取时的根身份与修订。提交时由发布所有者核对两项。已发出写入超时后，所有者保持该次调用待结算，通过实际回调及发布身份读回决定结果。UC-P10 使用同一权威记录恢复，不重复发出仍待核对的提交。 [宿主回执](architecture-and-milestones.md#wechat-sdk-cache-recovery)

UC-P08 的微信发布沿同一 App 写入者检查存储代际、父提交与修订。旧槽历史先完整读回。查询以代际和更新编号定位提交，并附当前内容可用性。`inspectCommit` 只有在覆盖和写入结算足以判定时才允许重试。UC-P10 的 `bindNewBoot` 在同一写入权威内比较活动提交、所取得的根、意图和实际构建，历史确认继续可读。D0 维护共用决议，D1 接原操作，D5 接真实宿主。 [接口与两次 App 核验](architecture-and-milestones.md#wechat-publication-history)

<a id="game-battle-functional-specification"></a>

## BF接口复用及十二组开发差异（2026-11-10）

[BF](../analysis/capability-first-v1/game-battle-functional-specification.json)保留battle/input/loop/friends、commands/physical-family/sequence-playback、body/playback/attached-rid及exit/return/city-return原所有者。C scanner/partial P-A/四槽/ACK、目标mask/code及实际return已通过有限纯核心对照，直接复用；旧profile字段不代表全项目缺实现。

BF-D2/3补真实29/32生命周期、transform资格/附件/记忆及特殊技能先写状态后早退；D5补12/267专用队列与动作、generic135 seed和共享overlay。双读序/原cursor、98FF/ITM continuation和107 raw-word分别有来源与政策边界；foreign/scratch/alias原来源未给前不零填。源mark继续执行、身体解绑与资源物理退役不能用独立revision替代。

独立结果身体继续沿现有队列与角色所有者。固定来源的非反射 106 查找读到共享动画游标，低等级 116 的索引 200 与状态字段重叠。现有共享入口对两类上下文在扣费和角色写入之前返回拒绝。原版异常与恢复仍按 D4 验收。 [来源与边界](game-static.md#battle-detached-rid-context)

三端使用原14端口，未新增产品API或报文字段。本轮只有规格/来源及纯模块核验，依赖整合、44完整案例、产品流程及实际平台/同版接受待统一D批次。

<a id="game-work-functional-specification"></a>

## WK复用现有核心，只登记有来源的开发差异（2026-11-10）

[WK](../analysis/capability-first-v1/game-work-functional-specification.json)保留player-skills、craft、work-context、work-targets原所有者，recipe字节核心作为既有依赖。需补recipe reset ctx0及相应旧测试、共享outer/byte/phase ledger、同帧移动与due优先顺序；初始byte0不能作为完整生命周期实现。

D0/D3 复用工作上下文和时间所有者。`advanceFrameFollowingLocal` 与 `advanceCraft` 的同一普通更新需要让到期检查读到本次扣时前的值。已有解除请求和配方查询按先后送入原会话。 [帧接口差异](game-static.md#legacy-work-context-frame-order)

固定 SE 的既有状态入口独立发布字段 15、剩余毫秒及模式。共用调度按原主子状态先调用所选经典解除检查，再推进时钟。背包回调读当前资料、时间及活动位，预览标记交对象池。配方归属和工作占用仍由各自的已有入口处理。 [工作状态与回调契约](game-static.md#fixed-se-work-context-publication)

物品交换先发布两端活体，同步把原槽号交给已证业务回调。共享占用使用业务调整后的计数和当时工作活动位，最后发布普通选择及缓存通知。制造计时到期读取当前有效材料位置。 [槽占用与材料用例](game-static.md#fixed-se-work-slot-seven)

D0 复用经典帧末快捷键和控件派发。D3 将打开、技能槽、选定等级和配方归属交给同一工作状态。窗口退役回调先处理计数、解除和可能的重查，随后由窗口所有者清除活动指针。 [经典工艺状态与顺序](game-static.md#legacy-item-classic-work-recipe)

D0 把 Ctrl 快捷键、点击及当前活动槽交给共用调度。D3 在 `prepareCraft` 所用工作所有者补普通开关和模式 0、1、2 的退役差异，D4 复用 `legacy-game-battle-input` 处理战斗分支。输入通过对应门槛后，才由各业务处理实际技能槽。 [实现差异和现有接口](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_skill_entry/implementation_handoff)

D0 由现有输入状态提供 Ctrl 及左键按下或重复，配置给出活动堆叠偏好。D3 复用 `moveInventoryItem` 和 `prepareItemMove` 的槽修订、数量校验和发送入口，将打开、确认和取消留在原窗口持有者。D5 沿现有配置端口返回保存与重开结果。 [字段与共用用例](../analysis/capability-first-v1/game-trade-storage-contract.json#/stack_quantity_input_preference)

另一套背包数量窗提交使用既有 `'#Q` 编码。D0 提供窗口参与、预选端点和文本目标，D3 处理确认先于本帧夹限这一分支。现有普通移动入口在送出前会重核槽修订、空目标与数量，继续沿所选动作规则确定准入。 [现有入口对照与开发交接](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_inventory_quantity/implementation)

D0 在活动槽仍可读取时运行析构，随后清活动槽和池槽。图形队列按合资格访问推进，在途请求与窗口实例各由自己的活动归属校验。D3 按实际工作回调释放最后持有者并复用解除格式器。D2/D4 给出实际子状态及活动场景，D5 返该场景的绘制回执。 [帧时序、用例和接口归属](game-static.md#fixed-se-shared-scene-frame)

D2 从现有动作解码取得参与者身份，通过角色所有者登记控制器。场景选路在旧对象退役前取五槽快照。D0 的更新循环分别处理退役标记、实际资源回收和活动帧提交，窗口所有者按选定分派消费共用退役。 [共享选路和快照规则](game-static.md#fixed-se-scene-controller-route)

连续场景回复按现有接收和场景接口提交，逻辑分派读取当前登记、预选标记和场景计数。读取素材所需的活动身份由场景所有者提供，迟到的读取和补片各在提交前核对。现有窗口端口继续接所选分派的退役与重建。 [连续回复的顺序](game-static.md#fixed-se-251-completion)

经典窗口重建由现有窗口与状态所有者协调。关闭和占用清理完成后，工作上下文所有者沿现有 `+5D` 请求执行解除。窗口恢复后由状态所有者读取当前子状态并按来源规则更新计数。 [重建接口依据](game-static.md#legacy-item-classic-window-reentry)

窗口状态所有者提供窗口 1 的活动判断与恢复标记。普通帧动作和所选入场回复按标记为零时的副槽值登记。恢复入口按自己的条件保留标记或在打开请求返回后清除，表行 40、41 的主状态 10 分支保留该标记。 [状态接口依据](game-static.md#legacy-item-window-one-restore)

D0 由帧状态所有者处理 16 位延后动作字，结果接收和战斗入场向该字发布。D4 的退场状态发布 `9/1` 后，窗口所有者在后续普通分派先处理延后动作，再读取此刻的恢复标记及计时字段，按条件请求另一套窗口 1 或经典索引 39 的过渡。 [接口与调用顺序](game-static.md#battle-window-restore-order)

现有材料关联、全56产品查找、16字节刻印、压缩本地pet ordinal/外部wire ordinal、暂停晚到只展示、装饰无CRT和ride child只略MP经纯模块保留。源部分写、当前atomic/revision/closed-late政策分列，不新增报文字段。另一套按实际正向准入后保自己的slot/计时/资格/移交，接口与真实三端接受待D0/D3/D5/D6；本轮产品API未改。

<a id="game-social-family-album-functional-specification"></a>

## SF复用接口及真正实现差异（2026-11-10）

[SF](../analysis/capability-first-v1/game-social-family-album-functional-specification.json)保留party、family、map-family-pet、battle-friends/protocol的原所有者和正确算法。新联系人模型、32称号编辑事务、完整图鉴与缓存上下文沿已有端口设计，不改历史API名称或把图鉴表当社交名片。

当前家族ID变化清roles/members、重复称号原子拒绝、revision/pending与动作准入是独立政策；源增量体只写指定字段，确认可读取当前全局，不能反写成源也有同样校验。现有空白名称拒绝、喂食例外、严格时钟及队伍退役重绑经纯模块保留。图鉴目前仍只单bank名称/四布尔，完整128B语义、发现与UI/存储由SF-D7..9补齐。

默认NUL字串值由SourceValueContext显式提供；迷你清理的20次地址规则和目标有界政策单列。30完整接受未执行，本轮无产品接口或代码修改；统一A1..A4之后才集中开发。

<a id="game-ordinary-services-functional-specification"></a>

## OS接口复用与源规则/目标政策的界线（2026-11-10）

[OS操作与差异](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json)保留items/protocol、map-dialog/graphics/appearance、map-shop、npc-services/pet-training、player-trade及map-bank原所有者。只在统一A1..A4后补共享选择占用、数量、源端点、窗口准入/退役与平台效果，不为每个业务重建缓存或数量框。

现有bag-only目标、六组外观循环、四种商人菜单映射及包字段经纯模块对照保留。人物学习的额外严格拒绝、交易发布推进自己的时钟和阶段2确认拒绝列为差异；revision、原子解析、pending、容量上限和所有者过滤仍是独立政策，不能默认为源已有检查。源提交读取当前全局、回调可能继续执行，接口设计须显式承接，不静默套用快照或早退。

31项完整流程及宿主输入/资源/关闭接受未执行；本轮没有产品接口或代码修改。跨端效果沿既有14端口与D5/D6验收，原需求和依赖不变。

<a id="game-presentation-functional-specification"></a>

## PR复用接口与目标文字/表面政策（2026-11-10）

PR-O25 由 SourceValueContext 保留历史来源的请求档位、有效档位、绘制准入和上下文代。RenderAudioSurfaces 按该来源的普通或缩放分支及自身声明的取样政策执行。恢复流程经 HostCapabilitiesAndLifecycle 核对宿主就绪，再由 OwnerLifecycle 释放旧代并发布新代。 [原呈现与恢复准入](game-static.md#legacy-render-recovery-probe)

保留resource-library、graphics、render、animation、named-palette、water、text/text-render、vitals、minimap及其owner的正确实现。[PR-D1..8](../analysis/capability-first-v1/game-presentation-functional-specification.json)只登记共享接线与差异：完整资源身份/预算、非4倍scratch、调用时钟、颜色后端、天气/水面、严格字节输入与glyph身份、业务HUD和生命周期。

现有RD解码可保留非4倍宽度，prepareLegacyGameSprite仍返回LEGACY_RENDER_STRIDE_UNPROVEN；不把这个实现门槛声明为格式限制。文字有源指标/布局，composeLegacyGameTextFrame仍要求显式mask端口并返回host-port-unverified。独立RGBA/编解码/字体/焦点合同不等于原Windows结果。本轮没有产品接口变更，统一A1..A4之后再开发。

<a id="game-actor-functional-specification"></a>

## G05复用边界与GA实现差异（2026-11-10）

保留legacy-game-actors、motion、actor-context、attachment、ride、spin、presentation、text/vitals和party既有正确接口。现有decodeLegacyGameActorActions已保留七coordinatedFields，后续仅补消费者；C0 attachment目前只保留列17，需完整可变尾部与aux30独立所有者。本地30当前重置phase=-1，与源restart0有命令字段差异，尚无视觉回归结论。

[GA-D1..7](../analysis/capability-first-v1/game-actor-functional-specification.json)只用既有14端口，不发明协议字段、默认源值或第二套协调时钟。共享最新p2/p3、参与者登记、重试/预算/退役、条件hook与平台效果分别归原所有者。本轮没有新增/修改产品接口或功能，统一A1..A4后再开发。

<a id="game-flow-functional-specification"></a>

## G03的GF接口与所有者组合（2026-11-10）

[GF33操作](../analysis/capability-first-v1/game-flow-functional-specification.json)沿原shared/legacy-game-client.mjs、legacy-game-state.mjs、legacy-game-city-return.mjs所有者引用既有characters/protocol与CT/RP合同。主状态/子状态/延后恢复、ACK/场景/capture/present、逻辑mark/物理release分别输入/输出；无新增线路字段或新的角色/会话模型。

GF-D1..6依次归共享状态/reset、内容模式与输入、主9场景组合、返回/连接、lease/持久退役和平台效果。原InputAndTextFocus、SourceValueContext、RenderAudioSurfaces、SessionTransport等14端口不改写；本轮没有实现接口或修改产品代码。当前main5 fullNativeReset=unmodeled边界明确保留。

<a id="game-communication-functional-specification"></a>

## 通信接口按source状态组合，不重写现有字节模块（2026-11-10）

[CF-D1..5](../analysis/capability-first-v1/game-communication-functional-specification.json)复用envelope/payload/message/login/module-digest核心；新增需求是组合可选版本预检、完整连接、active pump、时钟和队列/关闭。source错误DWORD不等于一概fatal，10035/0/高位结果与signed判断保留；partial send的进度与完成、idle入队与实际发送分开。

资源与版本字、端点记录、不同connected/keyready标志、计数/时钟及辅助回复事件是显式上下文，未知来源不填0。辅助405620边界保留原detail和pipe位置，不猜业务字段。已有目录66唯一发送/104接收语义字段与原证据元数据分离，后者留分析层。现有reset保留旧key、binary优先及低16/全32判定正确；全原流程、14端口实现和三端接受仍待统一门槛后的整合，未新增产品接口。

<a id="launcher-config-path"></a>

## 路径观察合同已具体化，尚未改产品接口（2026-11-10）

[LP-D1..3](../analysis/capability-first-v1/launcher-config-path-contract.json)要求区分原字节/比较上下文、API能力、逐前缀属性、最终路径结果、缺失后缀及元数据存在。两个关系通过仅发布词法候选，创建进程/游戏消费另判。缺API与API存在但失败不合并；输出包装函数false时可能已经改写临时字符串，调用方不得提前发布。

已有local-paths是4096字符、drive-only、ASCII-fold/NFC的独立保守政策；install-inventory只核明确元数据，不能声称提供最终句柄路径。后续依既有14端口设计接目标效果，未新增接口或运行Windows；统一分析门槛后再按原D0/D1/D5实现。旧LF路径子谓词缺口由本合同关闭，其余原范围保留。

<a id="launcher-functional-specification"></a>

## 待实现接口：按来源区分Config与patch策略（2026-11-10）

[LF-D1..4](../analysis/capability-first-v1/launcher-functional-specification.json)只定义后续差异，尚未改shared接口。现有launcher-first-config是601b同步wait策略；launcher-patch-current是C82 patch30min策略，两者均不能直接承担C82 Config。新策略输入须显式提供原版本、raw Code/账号字节、profile整数、seen keys、路径/OS谓词、timer/create/query结果、uint32 ticks和捕获的section/key；不提供虚构默认成功。

创建成功仅延后普通生产，pending/提醒/退出/写入失败/恢复分开。退出先释放观察handle，普通退出先cache后profile写0，写失败不撤回cache；三特殊退出跳过写入并按低字节恢复。销毁不是外部进程终止。4329B0三参/布尔ABI已澄清，子谓词434610/4349B0不以猜测实现。复用既有14宿主端口和LO/MP差异，统一A1..A4后按D0/D1接核心、D5/D6接薄适配。没有新增模块或平台能力声明。

<a id="map-functional-specification"></a>

## 纠正输入必须携带接收前窗口（2026-11-10）

MF-D1只补旧snapshot和原发布顺序；MF-D2沿StableRangeSource/SnapshotStore保留原key/多cache/commit；MF-D3复用现有输入/party/clock核心接实际源上下文；MF-D4为薄平台/预算/lease。没有新增独立寻路器或端口。

=X#的x/y/facing、场景12字段、校验通知9字段及补丁first6+bytes保持原格式。缺来源context明确needs-context；逻辑缓存更新、持久commit、缺块wait解除和场景ready分别回执，未知提交不能重放写入后当成功。

[地图操作规格](../analysis/capability-first-v1/game-map-functional-specification.json) · [来源核验](../build/analysis/map-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/map-functional-specification-v1/validation.json)

<a id="audio-functional-specification"></a>

## 音频端口已有完整操作输入/结果边界（2026-11-10）

UC-P13仍只有prepare/render/cue/retireAndDrain；34操作按源状态产生有序意图，由既有ContextOwner、SharedUpdatePump、ClockDomains/SourceValueContext及BudgetAndLease提供上下文和生命周期。普通cue、ambient、MIDI与stream共享控制合同，各自输出能力和错误不能互相替代。

prepared/played/blocked/failed、逻辑失效、worker停止确认和DrainReceipt分别消费；源ready不保证首填成功、caller忽略的返回也不是物理成功。缺GM/源数值上下文明确unavailable/needs-context，不填零、不静默跳过音效。8组差异未实现，无新增产品API或并行owner。

[音频操作规格](../analysis/capability-first-v1/game-audio-functional-specification.json) · [来源核验](../build/analysis/audio-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/audio-functional-specification-v1/validation.json)

<a id="browser-surface-observations"></a>

## 编码与音画端口的观测和约束（2026-11-10）

browser-surface-profile逐事实引用实际receipt节点和hash，AS-D1..D6映射UC-P12/P13及关联时钟/预算/生命周期端口。新profile与原shared-target-contract/AH档案分开，保留两个已引用文件的原hash及14接口/62方法原义。

明确区分CP936声明域/浏览器GBK、逻辑width/host glyph、canonical RGBA/readback、source PCM/host WAV decode，以及resume请求/running回执。ImageBitmap关闭和Offscreen transfer是所测破坏性宿主效应，不能代替source callback-tail/drain验收。

[实测档案](../analysis/capability-first-v1/browser-surface-profile.json) · [来源与约束](../build/analysis/browser-surface-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-surface-conformance-v1/validation.json)

<a id="browser-host-observations"></a>

## 实测档案补充端口，不改原共同合同（2026-11-10）

browser-host-profile.json逐项引用运行回执和JSON节点hash，关联UC-P02/P03/P06/P07/P08/P09/P10/P14的所选原语。保留shared-target-contract.json原hash及14端口/62方法/原22完整验收，避免元数据追加使既有证据身份失效。

实际观测分开表达：请求成功/事务complete/abort、旧源元数据/读失败、值复制/lease、命令接受/真实生命周期、新fixture boot/产品restart intent。profile中的未测budget/源clock origin为null，不以0或固定配额默认补齐。

桌面浏览器的隔离夹具核验了 UC-P08 对应的事务发布与恢复、同根共享锁和独占回收。UC-P06、UC-P07 与 UC-P09 仍按共同合同接入资源预算、读取及物理排空。发布后到达的旧读请求需在取得锁后重新核验清单。 [换版与恢复证据](architecture-and-milestones.md#browser-update-recovery)

[宿主档案](../analysis/capability-first-v1/browser-host-profile.json) · [本轮约束](../build/analysis/browser-host-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-host-conformance-v1/validation.json)

<a id="required-entry-admission"></a>

## 入口处置台账的引用契约（2026-11-10）

entry-admission.json逐根保存来源角色、primary binding IDs、原record和capability声明索引、source-anchor及使用条件。worker的230原record/406 typed位置和377登录器原record作为可回读导航；会变动的原合同身份固定到本轮before，避免引用循环。

related文件域不是逐记录业务继承，机制域G01/G07/X02不是完整功能映射；所有业务全量准入保持false。14端口/62方法合同未改，台账不新增产品API或协议字段。

固定 F5A 的 D1 接入复用当前登录、补丁、更新、启动及关闭所有者。补丁结果先完成进程槽结算再发布目录标记，准备编号按主对话框的当前代消费。D5 从现有应用、通知及计时器端口观察回执和实际页面状态，再沿既有关闭端口结算。 [登记和调用顺序](launcher-static.md#fixed-f5a-entry-business-admission)

游戏页沿 UC-P07/P09 关联真实读发起、旧页关闭和读结束。UC-P11 收连接退役回执，UC-P14 提供可观察的导航意图与新页状态。活动页面的资源失败继续由原资源库和页面发布；已归属旧页的完成独立结算。 [宿主回执和三端接口边界](network-portability.md#safari-navigation-resource-read)

固定 SE 的三组操作沿同一台账指向原根、描述符或报文登记。D0 共用构造时的 −1、控件前更新、参与控件、后置绘制与实际析构次序。业务模块按登记位置声明用途，供 D2/D3/D4 接材料发布、草稿及战后显示。窗 31 与 46 的共有绘制及窗 11 控件 6、23 的共用处理器沿各自条件调用。 [入口和接口差异](game-static.md#fixed-se-entry-business-admission)

[入口台账](../analysis/capability-first-v1/entry-admission.json) · [来源与规格](../build/analysis/required-entry-admission-v1/specification.json) · [本轮核验](../build/analysis/required-entry-admission-v1/validation.json)

<a id="required-context-contract"></a>

## 共同端口的参数与权威回执（2026-11-10）

统一机器合同已发布到shared-target-contract.json。每方法明确输入/回执；SourceProfile、OperationContext、Outcome、CommitReceipt、DrainReceipt、Lease、SourceContextValue和HostCapabilityReceipt八类型贯穿14端口。内部operation/epoch/snapshot键属于本地所有权，不能加到原协议；SourceContextValue缺失时返回精确needs-context，不填0/换actor。

InvocationLease允许source已准入回调按规则执行标删后的尾部，禁止未来准入并不截断当前callback。CommitReceipt区分not_committed/committed/unknown及durability，DrainReceipt区分逻辑closed和物理drained/draining/unknown。Input/focus/composition绑定目标epoch，classic/alternate mask不同，SourceClock/monotonic/wall/update sequence不同。

SnapshotStore给出prepare/publish(expectedRevision)/inspect/recover/acquire及仅自有无引用清理；更新单列quiesce、commit、restart intent、真实new boot绑定。大文件offset须无损，预算覆盖完整manifest，宿主能力不足保留原要求未完成。无产品API/代码变化，后续按原D0-D6接线与验收。

[共同接口合同](../analysis/capability-first-v1/shared-target-contract.json) · [47行范围复核](../build/analysis/required-context-contract-v1/reconciliation.json) · [本轮核验](../build/analysis/required-context-contract-v1/validation.json)

<a id="mail-operation-composition"></a>

历史 Item 的角色状态持有当前槽，配置持有目录映射，缓存所有者持有图鉴和两份邮件的完整缓冲。D0/D2/D3 在入场、创建和回包时沿既有所有者落实清除、读回及保存回执。晚到回包的目标归属沿会话身份验收。 [所选来源顺序](game-static.md#legacy-item-album-mail-lifecycle)

CF-D3 沿 `SessionTransport`、`ContextOwner` 和 `OwnerLifecycle` 交接已读取数据、断线状态及关闭回执。业务分派从角色状态读取当时的槽，迷你邮件沿自己的联系人查找。保留现有会话对已关闭连接的回调拒绝和迟到数据清理。 [规格与当前接口对照](game-static.md#legacy-receive-retirement-order)

现有 `world.next()` 已提供 `discard` 及推进的字节数。网页会话收到该结果会等下一次流读取，CF-D3 沿此入口验收游标推进后当轮继续检查。需要更多字节时保留有效余留。BF-D7 从已证原始区写入取得暂存来源，按 `M` 的战斗队列消费点核结果。 [现行入口与共用用例](game-static.md#battle-266-long-receive)

BF-D7 复用共享回放的阶段、标记及对象排序，以及已有角色结果队列。投射物入口按两次距离检查决定是否进入护卫等待或标记，后续遍历按相位摘链，角色结果入口从自己的游标及当时角色表取接收者。 [来源与接口约束](game-static.md#battle-266-relay-retirement)

邮件缓存负责插入和移位，未读投影读取活动联系人顺序并发布类别与页。提交入口按所选接收者和消息类型发请求，再追加本地发件历史。持久端口记录个人和家族缓存保存结果，服务端结果沿会话事件规格处理。 [收发所有权](game-static.md#legacy-item-mail-history)

## 邮件开发差异与既有模块复用（2026-11-10）

D0 的共同窗口及编辑器接口按实际初始化发布活动窗和输入目标。D3 沿 MM-D3/MM-D7 接同一草稿、群发表与活附件状态。群发列表保留字由实际初始化回调消费，附件释放由实际退役或已有窗交接触发。MAIL-CASE-41 至 MAIL-CASE-44 用同一组事件验普通重建、战斗入口与父子窗顺序。 [接口与预期](../analysis/capability-first-v1/game-mail-data-contract.json#/fixed_se_classic_mail_reopen/implementation)

现有 `legacy-game-protocol.mjs` 分派 `?l)` 和 `@Y)`，由 `legacy-game-items.mjs` 提供槽变化和修订号。本机对照中 `?<E` 已解码，效果为空。D0/D3 将全量发布接入该物品状态。邮件沿三套表单各自的提交入口读槽，家族编码可复用，个人编码按已核 `4F6E30` 补入既有命令目录。 [具体差异与用例](../analysis/capability-first-v1/game-mail-data-contract.json#/inventory_refresh_and_attachment_selection/implementation)

现有 `prepareCharacterEntry` 设置外观、本机角色准备和两位等待。加入物品重置时复用同一角色/世界所有者。全量解码需要保留有终止分隔符、读到边界、空值和缺值的区别，归共享物品状态消费。 [字段与实现差异](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/full_inventory_publication/implementation)

接线时复用 `legacy-game-items.mjs` 和 `legacy-game-craft.mjs`。交换通知向制造所有者提供两个原槽，供移动或释放引用，后续再交换共享占用。编辑回调按当时已发布的背包字段重查。`copyCraft` 的材料投影由制造所有者提供缓存绘制数据，实时槽供提示读取。保留 `actOnCraft` 的控件修订检查。 [制造接口与差异](../analysis/capability-first-v1/game-work-functional-specification.json#/inventory_material_selection/implementation)

`legacy-game-player-trade.mjs` 复用同一双槽事件，按经典窗资格更新交易源槽。`copyPlayerTrade` 的目标投影需要保留稀疏位置、是否绘制和本地及对方阶段。`actOnPlayerTrade` 复用已有发送命令，由共用帧和控件给出发布、主确认或独立撤回，宿主输入修订继续处理界面请求新鲜度。 [交易接口与差异](../analysis/capability-first-v1/game-trade-storage-contract.json#/inventory_confirmation/implementation)

本轮未改产品API。限定292源码路径中24文件的44片段和6条catalog声明已定位；family/family-pet、通用消息/状态、文本及world/session/Page钩子分别复用，:+(的catalog存在只证明字节格式，不自动证明完整邮件接线。

未来共同模型保留view/可见映射/实际目标ID、当前bank与映射目录身份，显式处理草稿、预留计数、六选择和资料变化。经典提交有状态3复核，现代所选提交没有同一复查，另一个家族form用个人附件包装/家族历史/仅个人保存的差异不擅自改写。

返回/清理、排队/历史/写出尝试、最终投递和附带对象归属采用各自状态及回执；同连接晚到按源live bank规则与目标独立政策分别审定。G20原最终结果要求缺证，整域ready保持false。

[邮件操作规格](../build/analysis/mail-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/mail-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/mail-operation-composition-v1/validation.json)

<a id="chat-operation-composition"></a>

## 聊天共同规则与现有API差异（2026-11-10）

未改产品API。既有map-chat已实现六字段发送、名单/环、系统两路公告和body speech连接；当前flags=null、lastAttempt=null、setParty要求inParty、始终名单过滤、whole-character长度/宽度、elapsed气泡和world.close全部清空是需审定的独立政策。

原469A10保存bit8不要求已组队，实际旁路同时看party与设置；4F2AE0已在协议路由至receiveTimer，但不能当发送禁言重置。source60FF18模式跳过过滤/日志仍可呈现body，新增显式共同所有者需在统一门槛后实现，不能仅因35模块未出现地址字面量宣称全项目没有对应能力。

名单group/date/file、64编辑历史与512日志、公告保持tick、body绝对到期和文件失败/排空回执按CM-D1..D8合并原合同；实现一次，再分别接web/mobile/WeChat，不为页面重复造状态。

[操作规格](../build/analysis/chat-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/chat-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/chat-operation-composition-v1/validation.json)

<a id="game-application-exit"></a>

## 日志所有者与收尾回执的设计边界（2026-11-10）

本轮未改产品API。实际35模块关闭/返回/应用钩子已定位；纯聊天/文本/角色状态退役、可选真实日志I/O和资源物理排空分别判定。FEEF30清0不是60FF20状态更新，512槽日志环也不是64槽输入历史。

拟定日志owner按source身份/日期与角色/连接上下文持有工作，保持原逐条append/close/reopen顺序；目标宿主的失败/预算/排空回执是独立合同。同步close、Promise结算或Page隐藏都不自动表示文件关闭成功。渲染标志只携带已证默认/条件，不增加未证设置或协议字段。

[退出规格](../build/analysis/game-application-exit-v1/specification.json) · [原件与来源](../build/analysis/game-application-exit-v1/source-views.json) · [本轮核验](../build/analysis/game-application-exit-v1/validation.json)

<a id="character-operation-composition"></a>

## 角色操作合同与现有接口差异（2026-11-10）

本轮未改API。现有character flow、creation/options、session、网页picker/upgrade及微信Page路径已按实际文件定位。字段+24/+36/+80保持不同职责；正常入场仍发送已有field15/17/2，升级仍用已有kind与marker，不新增线字段。

CH-D1沿CT补完整重置/持久化；CH-D2接预览资源/对象；CH-D3明确原生宽回包门槛与宿主pending、空槽menuArmed、非法索引拒绝的政策差异；CH-D4补已证删除警告/确认/等待呈现。工作服务端删除及类别7材料来源保持未证，不能用独立本地状态代替。

[操作规格](../build/analysis/character-operation-composition-v1/specification.json) · [已有源视图](../build/analysis/character-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/character-operation-composition-v1/validation.json)

<a id="capability-specification-audit"></a>

## 当前能力合同与实现边界（2026-11-10）

本轮未改变产品API。G17功能合同接收原页字段/资格，发帖/删帖/翻页产生既有reply并关闭，后续页面仍由接收数据决定；C20280字节编辑与通用窗口焦点/延迟清理共用，当前revision和非法输入拒绝明确属于独立宿主政策。

4E1CF0六项全局写入已有完整来源，不能把函数重复恢复当新接口工作。后续先把每项实际用户操作的输入/资格、请求或即时结果、状态owner/时钟、关闭退役和重入接到现有shared模块；统一规格后再补差异。

[当前逐能力审定](../build/analysis/capability-specification-audit-v1/specification.json) · [来源补充](../build/analysis/capability-specification-audit-v1/supplemental-source-views.json) · [本轮核验](../build/analysis/capability-specification-audit-v1/validation.json)

<a id="capability-first-source-interfaces"></a>

## 当前规格阶段：过渡入口与窗口构造接口

**2026-11-11接口整理顺序**：先由全部能力规格确认共同输入、状态、结果、错误、取消与所有权，再复核既有共享端口，只登记必要差异。本轮未新增API或第二套平台业务核心；接口设计闭合与SDK/设备实际符合性按[统一门槛](development-plan.md#capability-first-workflow)分别验收。

**MP-D1/2进入已有更新批次（API未改）**：createWin32LauncherPatchPlan仍spread旧Code\PatchEXE metadata并标legacy-derived-unverified-for-current；它未接module source context。来源新规格要求显式module filename/directory和CopyFile观察，三态结果不归一为boolean；目的已存在可跳过源准备，copy成功/start失败不能报无改动。现有quoted backup命令、poll/exit和422E20继续复用。 [缺文件准备规格](../build/analysis/launcher-missing-patcher-v1/specification.json) · [核验](../build/analysis/launcher-missing-patcher-v1/validation.json)

**操作合成不改API**：LO-D1字节XML/目录发布、D2候选与回复期限、D3预设/ID元数据共同owner、D4各业务取消/commit边界、D5更新/补丁资源提交恢复、D6编码/首次Config版本边界进入既有D0/D1/D5依赖。当前web/login-app→catalog/session/patch/launch真实产品入口和旧launcher-app核验页分开登记；原矩阵owner列表保留，不能据其遗漏新入口断言产品无实现。 [操作规格](../build/analysis/launcher-operation-composition-v1/specification.json) · [核验](../build/analysis/launcher-operation-composition-v1/validation.json)

**新增来源合同，不改接口**：BE-D1要求接29/条件观战驱动而非local>=20一概unsupported；BE-D2以实际pending/live/retirement生命周期替代构造时冻结entryWindowPresent；BE-D3保留0x7FD4/0x7FD5且main30==0x62的mode4/page0早退及调用者确认。具体字段/条件和未执行案例见本批规格；源内状态顺序不等于现有独立host revision/epoch政策。 [来源合同](../build/analysis/battle-observer-entry-contract-v1/specification.json) · [核验](../build/analysis/battle-observer-entry-contract-v1/validation.json)

**当前需求路由（未改API）**：40能力行通过current_frontier_review关联原packet及所选覆盖链，较早remaining保留为历史范围；SO/OW有效下一项另有effective_followup。已有输入/工作规则不因旧未决再次开函数任务；A/B业务关联、B01具体窗口与条件另一套继续按正向来源处理，不新造协议字段或请求ID。 [当前前沿](../build/analysis/current-frontier-supersession-v1/specification.json) · [核验](../build/analysis/current-frontier-supersession-v1/validation.json)

**接收/构造/释放接口（未改API）**：接收准入、同步468F00、延后8000与动画ID、实际468190初始化及共享清零分别保留。交易按源槽映射逐项释放，商店析构按当前signed mode减28byte；只在已列条件下推算合成效果。当前map-dialog的已有替换序列/关闭匹配继续复用，revision/即时clear/最终重查仍是独立语义。 [组合规格](../build/analysis/shared-occupancy-composition-v1/specification.json) · [核验](../build/analysis/shared-occupancy-composition-v1/validation.json)

**数量prompt接口（未改API）**：移动输入初值0，提交上限与数字盘上限来自打开时数量；正常再调用先覆盖C3B2CC/C43F58，延后才发布callback/max/value。当前41→38后备/无owner返回及tag41关联关闭保持；取消不发送-1，实际析构仅在仍匹配输入payload和默认owner时恢复焦点。QP-D1接既有D0/SW-D2/IC-D1，薄端口共用规则。 [数量框规格](../build/analysis/quantity-prompt-lifecycle-v1/specification.json) · [核验](../build/analysis/quantity-prompt-lifecycle-v1/validation.json)

**输入/退出接口差异（未改API）**：当前shared profile与web按钮均列7个主命令；原所选来源有第8个transform行动，IE-D1需把资格、R|1/R|0及计数接至共享输入/实际状态和薄端口。重复escape和宠物技能弹窗不是额外主命令；原9个flag也不是控件索引。ordinary、city和server返回各保持业务owner/异步提交边界。 [整链规格](../build/analysis/battle-input-exit-contract-v1/specification.json) · [核验](../build/analysis/battle-input-exit-contract-v1/validation.json)

**准备/运行与兼容事件接口（未改API）**：435000返回principal并按byte增加所选依赖，72的nested recipient不计数而nested guard计数，113没有该准备分支；260 chainFF仍先处理main guard。当前motion/pair plan保留读序和私有raw context。selfRID无foreign context不填零；98FF discard/complete、ITM unavailable及107逻辑值事件不假装native等价，具体输入/结束/显示接口仍须按原合同兑现。 [本批规格](../build/analysis/battle-preflight-boundaries-v1/specification.json) · [核验](../build/analysis/battle-preflight-boundaries-v1/validation.json)

**12/267接口设计补充（未改API）**：12为code/cost/ignored/principal/amount，135用1AE64+tier与原sound261/Y偏移，155复用signed32 HP上界及35当前计数。267为flags/amount/RID列表，235先动画再读信号；236保留信号逐条创建结果，237同回调排空反射。结果body不注册进22槽，visual parent指向该结果owner。generic135 seed须沿原目标顺序接现有owner；数值/资源验证、取消/晚到资料和真实端口仍按旧共享合同。 [本批规格](../build/analysis/battle-utility-consumers-v1/specification.json) · [核验](../build/analysis/battle-utility-consumers-v1/validation.json)

**战斗接口对照（未改API）**：status经upper.classes包含107/108/109/112/114/117；108的amount在flags之前。98的15变体分为flags、slot、位置交换和assist，不能统一payload。12/267目前经queueStrike回退，字段/RID/类别门槛拒绝；不制造成功回合。146条所选字面拒绝须按source规则、缺资源/身份或独立平台政策分类，不据字符串数扩展需求；D4复用现有body/效果/队列边界。 [本批对照](../build/analysis/battle-variant-coverage-v1/crosswalk.json) · [核验](../build/analysis/battle-variant-coverage-v1/validation.json)

**当前接口差异（仅规格）**：SW-D1集中位置/源槽/占用的逻辑owner，SW-D2归并资料、资格、数量端点和抑制/关闭，SW-D3复用现有serializers并保留入口clock差异。当前trade核心按数组连续编号、revision/canTrade/宠物version和余额做确认检查，offerStale显示不等于发送撤回。接口尚未改；独立安全/重入政策须保留明确身份。[本批规则](../build/analysis/inventory-selection-ownership-v1/specification.json)

**前组接口复核边界（未改接口）**：20个规则复用组按原owner和D批次引用，不新增20个模块。P05集中核资料变化/报价选择/占用退役，P08核命令到既有消费者；其它输入/时钟/资源/音频沿CT/IC/RP/CA/AR/AL/AO/MS/EF/PL合同共享。未实现设计、所选源行为与真实端口验收分栏，依赖和协议字段保持。[逐项对账](../build/analysis/capability-source-reconciliation-v1/reconciliation.json)

**状态接口纠正（独立设计未实现）**：465270原void伪码实际由EAX返回free首指针；Q[j仍是int32/int32/bytes，opaque只在caller转发。停生成、单节点回收、重建和6/7/8专用退役分别接owner；投影基线与步计数独立。正有限域幂曲线按原指令及[Microsoft x87约定](https://learn.microsoft.com/en-us/cpp/c-runtime-library/cipow?view=msvc-170)解释为推测，精度/异常与物理接受另验。产品API未改。[合同](../analysis/capability-first-v1/game-entry-review-contract.json) · [核验](../build/analysis/particle-lifecycle-contract-v1/validation.json)

普通用物由现有物品入口准备动作，世界分派交付两级资料，窗口取得及实际退役沿共同所有者处理。保留一级保存序号、用物来源槽及窗口占用槽三项。`*~/`、`$gW`、`*pT` 复用现有编码，经典 45 使用初始化时复制的回调，经典 46 运行时读取全局回调。迟到、返回后等待和取值时点沿同一组界面用例检验。`/1I` 回复仍使用既有六字段。 [接口差异与所查规则](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_item_target_menus)

目录和迷你邮件由现有世界入口提供公共对话上下文。D3 复用 `/1I` 外层及内层转义表，按各消费层传入预算，发信组包使用两段已转义文本。提交、历史插入和待退役标记沿同一操作的实际次序。D0 共用控件的输入占用及焦点恢复。 [接口、来源及用例](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_classic_directory_mini_mail/implementation)

所选收包接口沿现有消息解码、世界及窗口所有者接线。`Q=[` 的低 16 位进入阵位资料，`Or@` 的 32 位值供人物窗的可用点数。`W(y` 沿同一游戏实例保留收到的地址文本，按旧串匹配结果交文字呈现。连接退役及迟到回执继续由现有会话处理。`Kh>` 仍按未命名的低 16 位状态记录，等待消费证据。35 个已归属入口各沿原业务规格处理字段、准入和时序。 [当前收包合同](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/receive_operation_admission) · [提示的适用生命周期](game-static.md#legacy-address-notice-retention)

两版的 `Ok?` 共用现有四整型解码和本地文字入口，提示只以完整首项为零触发。两版的 `Kh>` 共用单整型解码，低 16 位的写入和初始化清零已有规格，实际消费接口待证。 [两个收包规格](game-static.md#legacy-unassigned-receive-outcomes)

前序接收接口仍按原规格保留零参数 `GC` 的业务效果、报文中未被消费的整数和 `EF365C` 的 32 位写入。标准客户端回调交付解码及效果通知，物品、联系人和邮件的专用更新各按所属规格接线。 [既有发布规则](../analysis/capability-first-v1/game-entry-review-contract.json#/receive_publication_review)

`.>3` 继续接宠物原槽和已按当前窗口准备的昵称字节，`-X}` 接按称号原规则准备的文字。外层编码共用 `encodeLegacyGameCommand`。交易候选保留原索引，对话回复沿既有六字段。 [发送入口及源码](game-static.md#fixed-se-send-operation-admission)

经典窗沿当前对象调用控件后更新，共用有符号滚动换算。参与值及来源字段仍由对应窗提供，标题列表先读现用偏移再写新偏移。说明的选择写回沿仓库与交易帧的实际边界提交。 [控件、滚动和选择写入](game-static.md#fixed-se-classic-post-control-frames)

经典窗的构造接口在初始化前登记到池，初始化返回后发布编号活动指针。随后恢复调用者的当前对象。普通帧先处理对应回调的 32 位参数，再取控件当时的参与值。 [构造与控件前接口](game-static.md#fixed-se-classic-pre-control-callbacks)

经典关窗沿同一个窗口退役入口执行业务回调，再更新编号记录并清活动对象。业务模块分别提供位置同步、偏好快照、占用释放或条件回复。用物两级窗口把 `(-1, 0)` 交给各自当时有效的回调。 [关闭接口和业务归属](game-static.md#fixed-se-classic-destructor-callbacks)

经典工作由当前窗口向控件提供序号、完整事件掩码、当时的选择和阶段。工艺编辑与工作中的材料显示共用来源槽，由运行绑定选择是否重查。战斗略过沿打开时保存的回调，在退役标记前交接 `-1`。 [技能与工作接口](game-static.md#fixed-se-classic-work-controls)

共用确认框接当前业务的确认和取消回调，先按输入设置退役标记，再交动作。黑名单保存沿既有资料所有者。日志查看把所选日期交现有文件端口，分别保留缺档、成功读回和显示偏移。 [三窗接口](game-static.md#fixed-se-classic-modal-blacklist-log)

名单所有者分别维护布局、名单种类和偏移。详情使用当前有效条目的槽或 ID，后续窗口按当时操作保存对应资料。共用窗口入口接通信记录、写信、删除确认与称号。 [窗 21 的接口差异](game-static.md#fixed-se-classic-contact-list-controls)

家族详窗独立维护两段名称及 32 项称号草稿，以当时权限控制输入和提交。既有单项准备入口继续提供资料及组包，批量确认沿原预检和差异顺序调用。成员称号以选定成员 ID 和所选索引交提交。 [家族草稿与成员接口](game-static.md#fixed-se-classic-family-edit-controls)

家族兽由当前窗口保存占用槽和输入焦点，确认环节把当时的槽或名称交已有对话编码。饲料箱共用仓储和数量入口，按实际标签与输入回执收尾。 [家族兽与饲料箱的接口](game-static.md#fixed-se-classic-family-pet-feed-controls)

银行窗以当前页签决定两侧运行回调及金额输入参与。交易窗将各自阶段和当时的报价交给面板，并让现有资料入口分别处理新物品、宠物和金币。数量窗、滑块和退役沿同一组窗口接口。 [银行与交易接口](game-static.md#fixed-se-classic-bank-trade-controls)

邮件窗口向共用编辑器提供正文和当前焦点。邮件状态维护当前收件人、投递宠物位置和附件物品槽，窗池回执决定草稿恢复与占用释放。群发列表接当前选择映射及控件遍历后的可见行。 [写信、附件与群发接口](game-static.md#fixed-se-classic-mail-compose-controls)

**当前接口盘点边界**：40域中声明的实现所有者路径与静态导出可定位代码，不能证明完整业务API已实现。文本解码元数据、世界效果guard、登录/选角会话处理和实际产品入口分别核对；G20完整产品owner未声明不等于整个仓库没有相关代码。11个共用依赖组用于后续合同归并，不在本批新增接口、消息字段或产品模块。[矩阵](../analysis/capability-first-v1/capability-matrix.json) · [有限代码检查](../build/analysis/capability-readiness-review-v1/protocol-routing-static-review.json)

源级46c6b0的EAX传递已由原指令和调用者核对；它返回过渡图形句柄，分配失败仍尝试窗口构造并返回0。过渡回调稍后请求468190，返回值、申请和实际构造结果须分别建模。同布局+1d0在不同回调中可为owner槽指针或tile模式；这是来源约束，尚未新增或修改产品接口。既有接口及stage306全部保留。[规则/未决](../analysis/capability-first-v1/game-dispatch-findings.json)

固定 Item 的 D0/D3 合同由图形对象推进过渡，由经典活动槽发布实际窗口。普通控件和快捷键在图形对象更新后提交请求。第 11 次回调调用创建器，按业务组同步退役或复用同号窗口。分配失败时尝试同步创建，过渡结果返回空。 [时序、返回与组规则](game-static.md#legacy-item-classic-open-transition)

第二套窗口由行缓存持有图形对象。D0 的窗口辅助行为按第 12 次合资格图形回调发布就绪，活动路径以逻辑值大于 0 为命中处理的门槛。分配失败保留声音、初始化和重读顺序。失活清缓存时标记图形对象退役，D3 依据一次性结果 2 执行业务收尾。 [图形就绪与接口用例](game-static.md#legacy-item-alternate-window-graphics)

固定 Item 的所选登记将外层活动首参直接传给共同助手。D0 以首参及当前缓存决定建立或退役，在活动初建时按顺序处理可选初始化和重读。D3 单独消费局部控件命中结果。训练、工艺和图鉴的外层调用与首参取值沿同一组用例验收。 [三个候选及参数证据](game-static.md#item-alternate-dispatch-candidates)

D0 由输入焦点所有者提供默认目标比较，由窗口所有者筛选主副槽。D3 保持局部动作的原顺序，先按焦点条件筛选，再请求打开窗口或写入文本焦点。控件回调返回 0 时继续扫描，图形与业务退役沿既有非活动回调。 [焦点及槽位交接规格](game-static.md#alternate-window-focus-slots)

<a id="stage306-work-context"></a>

## stage306 上下文、配方归属和直接请求接口

新增 LEGACY_GAME_WORK_CONTEXT_PROFILE、LegacyGameWorkContextError、legacyGameWorkContextSlot(slot,mode=0)、legacyGameWorkContextAvailable(tier,remainingMilliseconds)、legacyGameWorkDuration(milliseconds,tier,mode=0,unsigned=false)。slot限0..14、mode限0／1；启用时只接受表内tier0..6运算，界面开关要求正tier1..6和正剩余时间；越界不静默套倍率。[规格](../analysis/game-work-context-v1/specification.json)

playerSkills 增加 setCraftContext(mode)／craftContext()；applyCraft沿当前上下文标记回复。createLegacyGameCraftRecipes.apply(slot,bytes,contextMode=0) 保留原二参调用，copy／apply结果返回真实归属；删除仍只按原来源重置id等已证字段。world通过只读workContext与setWorkContext端口借用同一所有者。

craft动作增加context和levels-back；开关仅在levels且条件允许时生成61／62。copy增加contextMode、contextTier、contextRemainingMilliseconds、canToggleContext、recipesCurrent、directRequestSent。制造配方失配先重查并拒绝选择；type5选择等级直接发送，不进入材料、计时或虚构结果界面。现有 revision、关闭、场景／战斗失效契约保留。生成API现475导出；Page继续沿原onCraft／host处理。

<a id="stage305-work-targets"></a>

## stage305 目标列表、采集与接收契约

createLegacyGameCraft 在原有动作上新增 person（一级可见 index）、subject（二级可见 index）、people-back 和 pause。选择已证 type3 等级会请求角色，选 type4 等级即按源等待进入采集；不额外要求 begin。动作仍验证 revision、阶段和当前技能。一级／二级提交均通过既有 actOnCraft；二级由所有者映射到保存的 wireIndex。[规格](../analysis/game-work-targets-v1/implementation-spec.json)

receivePeople(bytes) 和 receiveSubjects(bytes) 返回 craft-targets 效果；仅匹配当前等待阶段才接收。receive(status,kind,bytes,receivedTick=null) 增加 kind3／4；采集优先采用明确接收时钟，否则采用最近普通帧 tick。copy 保留旧形状，目标模式补 people／subjects／canRetry，采集补 gatherContinuing／canRetry／canPause。结果文字均复制，关闭释放列表／目标／结果。采集 retry 只允许 paused 阶段，结果期间不可跳过源展示期限。

work-targets 导出 profile／error、legacyGameTargetWorkMode、legacyGameGatherPose、legacyGameGatherDeadline、decodeLegacyGameWorkPeople、decodeLegacyGameWorkSubjects、decodeLegacyGameTargetWorkResult 和 decodeLegacyGameGatherResult。State 增加 copyBytes(recordId,fieldId) 的只读复制；world.targetContext 读取人物字段、现有队伍绑定与宠物字段，不新增线上协议字段。

共享控制模型补目标／明细、模式结果文字、暂停与重试可用性；Page onCraft 接收 person／subject 数字 dataset。Web session 正常转发已进入场景后的 craft-targets 姿势请求；原制造和物品工作入口保持。[验收](validation.md#stage305-work-targets)

<a id="stage304-work-actions"></a>

## stage304 工作模式、目标和刻印接口

Item 的所选非活动回调按工作上下文、主副活动槽和各自的一次性状态决定是否解除。D0/D3 沿同一所有者保存表行、局部图形对象和工作上下文的状态。退役时先消费表行标记，局部对象回收标记及关闭窗口 27 的请求各走对应规则。 [八个回调的条件](game-static.md#legacy-item-work-retirement)

窗口 29 返回 19 时，窗口所有者只切换主槽。后续非活动回调消耗表行标记后再请求关闭副槽 30，并按所选源规则处理窗口 1 的恢复。 [配对窗口接口](game-static.md#legacy-item-work-window-pair)

createLegacyGameCraft 保留既有动作、revision 和 uint32 tick 契约；选择已知 type2／217..220 或 type1／255 的可用等级后直接进入对应工作选择。新增 target（绝对 slot 与物品 revision）、remove-target、mark（编码后 Uint8Array）动作；decorate 复用 assign／remove／swap 六位动作但使用独立分类与先移除规则。begin 在当前 MP、物品与文字条件满足后才生成请求。[规格](../analysis/game-work-actions-v1/implementation-spec.json)

新增 legacy-game-work-actions 导出 LEGACY_GAME_WORK_ACTION_PROFILE、LegacyGameWorkActionError、legacyGameWorkMode、legacyGameWorkItemEligible、legacyGameDecorationItemGroup、legacyGameWorkMark、decodeLegacyGameItemWorkResult。技能 workRecords 提供已知工作技能，knowsCraftProduct 与配方 containsProductId 扫描全部 56 项；旧 craftRecords 和普通配方前缀菜单保持。物品 craft 专用复制读取增加 qualification，原 copySlots／battle 形状保持。

copyCraft／actOnCraft 接口继续共用原 client。快照包含 mode／label、目标和 canClearMark、workEligible、复制的 mark/result 与当前阶段；当前背包范围仍为 8..27。mark 不借出调用方缓冲。kind2 receive 和 kind1 decoration 沿同一所有者退役、重试、关闭与失效。

网页刻印表单及 Page onCraftMark 经现有编码端口提交；Page target dataset 交 host.craftAction。UI 的确认动作只更新已验证文字，开始才发请求；16 字节、禁用物品、空刻印清除和本地错误提示由同一模型驱动。[验收](validation.md#stage304-work-actions)

<a id="stage303-craft-input"></a>

## stage303 制造核心、客户端与呈现契约

`createLegacyGameCraft(ports)` 借用 `skills/skill/recipes/items/mp/location`，持有一个普通上下文活动。`prepare(action,revision,value,tick)` 返回既有协议 requests；动作包括 open、skill、level、recipe、assign、remove、swap、begin、retry、close。assign 需 position、绝对 slot、当前物品 revision；tick 为 uint32。过期 revision、不可用材料和未齐材料／MP 不生成请求。

`tick(tick)` 只由已接受普通逻辑帧推进，等待提交后不重发；`receive(status,kind,bytes)` 消费 kind1 结果；`copy/inspect/active/refresh/invalidate/close` 管理只读复制与生命期。world／client 增加 `copyCraft()` 和 `actOnCraft(action,revision,value)`，既有 `copyPlayerCraftRecipes(slot)` 保留。关闭后的 world 只读状态仍可检查释放结果。

Items 增加 craft 专用复制读取，记录 description 首行就绪、exchangeCode、category、quantity、graphicIndex 和原来收到的 level。旧 copySlots／battle item 形状保持。`createLegacyGameCraftControls` 将字节转换为同一网页／Page 语义模型，Page 通过 onCraft→host.craftAction 使用实际共享 client。build 将 craft.wxml 随 Page 输出。[规格](../analysis/game-craft-input-v1/implementation-spec.json) · [验证](validation.md#stage303-craft-input)

<a id="stage302-craft-recipes"></a>

## stage302 配方所有者与只读投影

shared/index 新导出 LEGACY_GAME_CRAFT_RECIPE_PROFILE、LegacyGameCraftRecipeError 与 createLegacyGameCraftRecipes。所有者提供 apply(slot,bytes)、reset(slot)、copy(slot)、close()，槽为 0..14；copy 返回 profile／slot／version／contextMode 及 56 行 recipes，每行有原偏移 fields、自有 nameBytes／descriptionBytes 和 5 行 materials。材料 fields 使用相对 +0／4，名称为自有字节，不猜测其他数值含义。[规格](../analysis/game-craft-recipes-v1/implementation-spec.json)

PlayerSkills.applyCraft／copyCraft 使用同一所有者，原 apply 主列表删除分支执行 reset。Battle.applyPlayerCraftRecord 供既有消息分派使用；Battle／World／Client.copyPlayerCraftRecipes(slot) 提供只读访问，客户端关闭后拒绝读取。apply 不改变技能主列表版本，也不修改其他槽；reset 保留非编号字段和文字。当前 contextMode 固定 0，版本为独立 32 位接收／重置计数。新增接口尚未接入网页／Page 的制造界面。[验证](validation.md#stage302-craft-recipes)

<a id="stage301-battle-item-dispatch"></a>

## stage301 ITM 接口保持与复现入口

本轮不新增或修改运行 API。decodeLegacyGameBattleMotion 与 createLegacyGameBattleCommands 继续使用既有 0／6／7 生产者，其他值保留 item-variant-handler 返回；该结果是当前独立实现范围，不是原生默认回调等价声明。[规格](../analysis/game-battle-item-variants-v1/implementation-spec.json)

分析入口为 `python3 analysis/game-battle-item-variants-v1/verify_source.py`：核对固定 PE、原始窗口、派生指令账本与分派方程，仅读取本地材料。源码及生成包回归使用原有五个 motion／commands／mp-items／shared-storage／item-input 测试文件。生成验证将 shared/index 解析到既有 stage300 同一包导出，不混用所有者。[记录](../analysis/game-battle-item-variants-v1/validation.json)

<a id="stage300-city-water"></a>

## stage300 回城步进、场景模式与共享导出

shared/index导出createLegacyGameCityReturn(previous,render,origin='map',onStep=()=>{})。render(tick,mode)的mode为awaiting或capture；onStep(tick,ordinaryPrepared)每接受一逻辑步调用一次，ordinaryPrepared为true时普通计划已经完成水面advance／present。作业和待呈现帧保持原所有权，retarget取消旧作业、释放旧图，过期图不绘制。

world.captureCityReturn(tick,request,route='boundary')接受awaiting／scene／boundary／battle；scene不强制创建角色，boundary／battle采用正常重建。advanceCityReturnWater(request)只在回城状态更新空外层及位置。Actors.beginScene第3可选localMode为normal／retain／clear，默认normal保留旧行为，回城显式选择后两者。copySceneTileCenter在回城角色缺失时读取保留场景坐标。等待回复使用现有只读普通呈现投影，不作为完整运动调度接口。[规格](../analysis/game-city-water-v1/implementation-spec.json) · [验收](validation.md#stage300-city-water)

<a id="stage299-battle-water"></a>

## stage299 水面消费、位置快照与战斗上下文

createLegacyGameWater新增consume(requested,mapId,position,camera,center,nativeGate=0)：执行原水面条件／相位修正／振幅处理，不保存前次位置；savePosition(position)保存两个有限float32数值；present保持consume→savePosition兼容行为。copyState的passes计consume调用，不是原生渲染次数。

createLegacyGameBattleState新增第4可选waterOwner参数，传入真实所有者时借用，否则创建自有实例；close不关闭借用对象。configureWaterContext接受严格数据{mapId,position,camera,center,nativeGate,localPresent}，copyWaterState只读。无显式配置时可从ordinary.waterContext()取得来源；裸所有者特殊队列缺上下文报LEGACY_BATTLE_WATER_CONTEXT_REQUIRED，提供后可重试。数据访问器和重入被原门槛拒绝。

SceneFrame.step新增第9参数waterMode，默认ordinary，capture只消费嵌套pass；延迟preparePresentation保留相同模式且重复调用幂等。正常world内部提供该模式及实际角色位置；激活帧不重复advance。createLegacyGameBattleFrameController标记waterRequested但不猜地图／门槛，完整状态由拥有它的BattleState应用。[规格](../analysis/game-battle-water-v1/implementation-spec.json) · [验收](validation.md#stage299-battle-water)

<a id="stage298-ordinary-water"></a>

## stage298 水面所有者及显式呈现接口

新增公共createLegacyGameWater：advance()推进一次相位，present(requested,mapId,position,camera,center,nativeGate=0)返回冻结的{phase,amplitude}或null，copyState()返回只读诊断，close()结束。snapshotLegacyGameWater要求phase整数0..63、amplitude偶数0..100；legacyGameWaterRows返回60个源Y。isLegacyGameWaterGraphic仅接受数值索引3096..3105。

DrawPlan新增{waterStrip:{phase,amplitude},priority:2}，无图像、坐标或外部资源句柄。createLegacyGameSceneFrameController现从shared/index导出；step的第7参数deferPresentation默认false，第8参数waterPosition默认camera，实际world单独提供玩家位置；preparePresentation只接受当前自身帧，重复调用不推进；copyWaterState只读。world.advanceFrameFollowingLocal的第2参数可显式延迟准备，prepareFramePresentation消费当前所选帧；runtime自动使用它，copyWaterState便于检查所有者。重入和关闭门槛保留。[规格与范围](../analysis/game-special-graphics-v1/implementation-spec.json) · [验收](validation.md#stage298-ordinary-water)

<a id="stage297-body-draw-flags"></a>

## stage297 身体绘图开关消费者

运行时API形状不变。身体回调164设drawFlagMask=255，165设0，再调用现有pop；drawFlagValue保持。copyPlayback继续暴露原动画与独立颜色覆盖，帧控制器消费最终样式。原动画翻转偏移不会因覆盖开关重新计算。[字段规格](logic-protocol-spec.md#stage297-body-draw-flags)

新增三项测试覆盖32队列／160整帧、substate／慢帧和未知样式恢复；生成API运行同一三项。原创分析工具portable-test.mjs可追加generated。既有实际材料product-test.mjs新增可选 `MOLI_MATERIAL_QA` 截图目录参数，默认路径保持；本轮使用stage297目录，保留stage296图像证据。该参数不进入产品接口。[验收](validation.md#stage297-body-draw-flags)

<a id="stage296-actual-battle-product"></a>

## stage296 实际材料验收工具

未新增或修改运行时接口。`analysis/game-actual-battle-product-v1/preflight.mjs [generated]`以显式材料配置打开实际ZIP，核对完整SHA256、角色动作／原信号及背景元数据；源码与生成API输出一致。`product-test.mjs`通过现有网页控件或Page事件完成角色选择、防御、结果、退出和移动。

`actualBattlePeer`只在临时原创对端副本中选取CUT59510／59526、角色100010和背景300653，保留请求断言；普通场景使用实际图块，布局由原创夹具提供。Node vm诊断使用同一API产物和实际背景进行完整RGBA对照，不改变产品代码或全局工具配置。[规格](../analysis/game-actual-battle-product-v1/implementation-spec.json) · [验收](validation.md#stage296-actual-battle-product)

<a id="stage295-battle-draw-style"></a>

## stage295 最终样式、颜色覆盖与动画alpha

`legacyGameBattleDrawStyle(value)`接收drawFlags、color、paletteSelector、actorFlags、drawFlagMask、drawFlagValue，可选drawColorOverride `{mask,color}`，返回冻结的 `{flags,color,paletteSelector}`。标志／mask为uint8，颜色／actorFlags为uint32，编号为uint16；颜色mask的低四个位按R／G／B／A选择，其他位不改变颜色。拒绝访问器、非法数值和不完整覆盖对象。[数值顺序](logic-protocol-spec.md#stage295-battle-draw-style)

`copyPlayback().nodes[].animation`保留原动画，当前对象覆盖单独以drawColorOverride暴露，启用alpha255也会保留覆盖；诊断opacity不再增加帧指令的opacity。帧控制器接受已支持0..15绘图样式、完整ARGB和16位命名编号，最终值通过资源库消费；特殊图形检查保留。

`animationPlayer.setColorAlpha(uint8)`只更新颜色高字节，保留RGB与其他状态，克隆独立，后续原动画帧可重写。对象分配／复制及当前GMN、shape、element、field回调维护独立mask；六项新测试含2048整帧、GMN开关与原flag、首次副本、alpha克隆和边界。旧128份半透明失败使用新独立正例，历史原夹具未改。[验收](validation.md#stage295-battle-draw-style)

<a id="stage294-vertex-color"></a>

## stage294 准备指令color与部分命名颜色

`composeLegacyGameFrame` 准备精灵指令新增可选 `color:uint32`，默认ffffffff；超界、非整数、undefined显式值和访问器拒绝。RGB调制与有效透明度由每条命令决定，加色优先；initialRGBA与输出仍独立。`composeLegacyGameTextFrame`保留color，所有高层图片直接合成到已有文字／背景副本。[数值规则](logic-protocol-spec.md#stage294-vertex-color)

`createLegacyGameDrawPlan` 的image.color接受完整uint32；范围库在提交时传递，缓存身份不增加color。animation.drawPlan／drawCommand及普通场景图像携带颜色；drawCommand仍要求paletteSelector为0，命名编号由延迟资源库处理。既有style位0..15限制保留，战斗专用计划的限制待另核。

命名调色板可为3..768字节的完整BGR前缀；prepareLegacyGameSprite既有颜色掩码负责拒绝缺色。真实645字节／最高213索引及原创12字节／0..3索引均验证，空、不完整项和索引缺色另测。七项新测试检查完整帧、遍历通道与alpha、文字、缓存隔离、部分调色板、动画与借入所有权；四份历史alpha拒绝像素改为新增独立正例，历史原夹具不改。[验证](validation.md#stage294-vertex-color)

<a id="stage293-additive-render"></a>

## stage293 合成器、文字与样式接口

`composeLegacyGameFrame(width,height,commands,initialRGBA?)` 新增可选初始帧，接受与尺寸一致的借入RGBA8并复制，不修改调用者内存；返回RGBA始终独立。准备精灵指令新增可选 `blend:'additive'|'source-over'`，默认source-over，其他值或访问器拒绝。加色保持源掩码、忽略opacity、RGB逐分量饱和；已有坐标／裁片／缩放／优先级合同不变。

`composeLegacyGameTextFrame` 保留blend，在高层存在加色时以已绘文字和背景为初始帧，所有高层命令按顺序合成，临时帧在成功／失败时清理。范围库从image.flags自动确定blend，不把混合模式写进精灵缓存身份；同图像不同混合可共用调色板后的源像素。

`createLegacyGameDrawPlan`、地图普通动画和animation.drawPlan支持样式0..15、colorffffffff及16位命名编号。`drawCommand` 仍拒绝未绑定的非零命名编号，已准备的编号0精灵可带additive。旧“不支持8位”的两个单元断言已移到未证实16位，历史动画4份失败像素被本轮独立正例替换；其余未知样式检查保留。[规格](logic-protocol-spec.md#stage293-additive-render) · [验证](validation.md#stage293-additive-render)

<a id="stage292-animation-named-palette"></a>

## stage292 命名调色板接口与边界

新增 `LEGACY_GAME_NAMED_PALETTE_PROFILE` 和 `legacyGameNamedPalette(uint16)`；返回 `{selector,resourceId}`。0及1495..65535规范为 `{selector:0,resourceId:0}`，1..1494按固定源表查图形资源；大于16位或非整数输入拒绝。绘制描述保留原编号，由资源库按来源规范化并选择颜色。

`createLegacyGameDrawPlan` 允许16位选择器，仍拒绝标志7之外的位及任意颜色。延迟场景的普通动画指令保留选择器；非延迟、没有范围资源绑定的提供者维持原拒绝边界。资源库的准备缓存key包含规范化选择器，新增有界命名调色板LRU；使用后inspect可见namedPaletteEntries，stats可见namedPalettesDecoded。缺载体为 `LEGACY_ASSET_NAMED_PALETTE_REQUIRED`，非完整768字节为 `LEGACY_ASSET_NAMED_PALETTE_LENGTH`。

没有新增会话或平台命令。素材读后检查取消／关闭，载体图像和临时颜色清零；clearCache仍清理准备图像，命名原颜色按有界LRU保留至淘汰／关闭。[规格](logic-protocol-spec.md#stage292-animation-named-palette) · [针对测试](validation.md#stage292-animation-named-palette)

<a id="stage291-legacy-minimap"></a>

## stage291 小地图核心与主机接口

共享入口新增 `legacyGameMinimapWindow`、`legacyGameMinimapColor`、`createLegacyGameMinimapGrid`、`renderLegacyGameMinimap`、`overlayLegacyGameMinimap`、`createLegacyGameMinimapBlink`。窗口和格网输入显式提供地图尺寸、中心／起点、三平面及原调色板／AUT；格网与RGBA是调用者所有的副本，叠加只修改调用者提供的主画面。像素仅允许透明或完全不透明，错误不留下部分叠加。

资源库新增 `minimapColorTable(ids)` 返回调用者所有的65536字节色表副本，按需读取所需RD并去重并发；`readMinimapAUT(selector)` 读固定PUK2路径及最多477603字节。世界／客户端 `copyMinimapSource(zoom)` 返回有界条带组成的独立三平面，key包含地图身份、模式、尺寸、选择器、更新次数、中心和范围，客户端另加sceneRevision。

`createLegacyGameMinimapOwner({client})` 提供inspect／toggle／cycleRange／decorate／close。状态包括hidden／loading／ready／unavailable／closed，失败保留明确错误，不重复同一key请求；切换或新key可重试。资源异步准备，decorate保持同步。Canvas可选 `decorateFrame(layer,tick)` 必须同步返回undefined；关闭／停止后的代次不提交Canvas，异步返回被明确拒绝。

网页主机和wx主机新增toggleMinimap／cycleMinimapRange；Page为onMinimap／onMinimapRange，显示已存在的可交互场景范围。小地图失效独立显示“资源不可用”，不更改游戏请求。返回对象、原调色板平均和实际材料边界见[规格](logic-protocol-spec.md#stage291-legacy-minimap)与[测试](validation.md#stage291-legacy-minimap)。

<a id="stage290-legacy-material-compat"></a>

## stage290 实际材料验收入口

产品接口不变：启动材料内的 `resourceParametersHex` 经现有资源计划明确数字后缀；同一资源所有者供启动、资源库、图形和音频读取。`material-profile.json` 记录本轮参数、七槽顺序和27个文件身份，是核验配置，不是新的认证或自动版本选择接口。[配置](../analysis/game-legacy-material-compat-v1/material-profile.json)

新增 `corpus_oracle.py` 产生私有独立摘要，`compare-corpus.mjs [generated]` 比较共享源码／既有生成API；`audio_oracle.py` 和 `compare-audio.mjs` 比较Python wave与生产PCM读取器。`product-test.mjs` 从实际ZIP走页面流程，`peer.mjs` 仅复用原创对端并显式选择场景模式。所有核验器在现有本机材料工作区运行，原图／音频不写入分析成果。[验收命令](validation.md#stage290-legacy-material-compat)

<a id="stage289-legacy-resource-archive"></a>

## stage289 资源ZIP所有者与打包工具

`createLegacyGameResourceArchive({size,read(offset,length),close()}, options?)` 接收精确安全整数大小及返回Uint8Array的范围读取端口，接管有效输入的生命周期，包括初始化失败。返回 `{count,port:{stat(path),read(path,offset,length)},inspect(),close()}`；缺文件及范围错误沿用资源错误合同，返回字节由调用者所有。`options.rootPrefix` 可明确指定安装根；`inspect()` 提供根、ZIP64、目录大小、物理读取和缓存计数。关闭幂等，清空索引与缓存，迟到字节清空并拒绝。[核心](../shared/legacy-game-resource-archive.mjs)

`createBrowserLegacyGameResourceArchive(file,options?)` 包装显式File，`createBrowserLegacyGameClient` 新增可选 `resources` 所有者；未提供时仍走文件夹。`createWeChatLegacyGameResourceArchive({wx,signal,clock,timeoutMs=60000})` 选择一个ZIP、核实普通文件及大小，再读受限范围；支持中止、超时及迟到缓冲清理。游戏宿主JSON仍使用原读取器。[浏览器](../web/legacy-game-resource-archive.mjs) · [wx](../adapters/wechat/legacy-game-resource-archive.mjs)

`python3 tools/pack-game-resources.py --root GAME_ROOT --output NEW_ZIP [--receipt JSON]` 生成确定性的存储型ZIP／ZIP64，固定条目时间及权限并记录逐文件SHA-256。ZIP与回执都须位于输入根之外，二者不能重合或覆盖已有输出；冲突在创建ZIP前拒绝，输入保持原样，打包前后核对文件身份／长度／修改时间。中途失败的候选文件不等于可用产物。[工具](../tools/pack-game-resources.py) · [验证](validation.md#stage289-legacy-resource-archive)

<a id="stage288-legacy-battle-audio"></a>

## stage288 共享音效选择器与帧输出端口

新增 `legacyGameSound(id)` 返回明确目录的不可变元数据；不在表内的编号返回undefined。`legacyGameSoundPan(x,enabled=true)` 返回表索引、百分之一dB与左右声道增益。`createLegacyGameBattleAudio().advance(frame)` 接收正整数generation／steps及既有事件，返回有序cue、0..63播放槽和更新序号；重复／旧输出返回null，`close()` 清理抑制存储。[核心](../shared/legacy-game-battle-audio.mjs)

`createLegacyGameBattleCanvasHost` 新增可选 `onFrame(out)`；两端宿主接到现有音频所有者的 `battle(out)`。音频失败不写游戏状态。PCM缓存在文件所有者关闭时释放，晚到结果按预留槽、generation、暂停及更新序号复核。[输出实现](../web/legacy-game-audio-host.mjs) · [验证](validation.md#stage288-legacy-battle-audio)

<a id="stage287-legacy-battle-detached-rid"></a>

## stage287 106 RID预检与消息所有者

既有 `planBattleImpactSkill` 与 `queueImpactSkill`接口保持；私有回调的预检允许带2000的106 RID，要求当前登记槽0存在。混合列表含任何不满足条件的RID时仍整体返回不可用；预检不扣MP、不改动作或动画状态。[共享回调](../shared/legacy-game-battle-impact-skills-playback.mjs)

零数值消息按元数据处理后的当前元组槽号查找接收者。缺槽0返回 `impact-skill-detached-RID-slot0`，排队后槽0消失则抛出 `LEGACY_BATTLE_IMPACT_MESSAGE_TARGET_REMOVED`；晚删除属于运行错误边界。已有 `battle-vital` 继续报告登记角色的源扣费和后续普通命中；分身独立于22槽，105删除各自节点。[验收](validation.md#stage287-legacy-battle-detached-rid)

<a id="stage286-legacy-battle-impact-skills"></a>

## stage286 冲击规划与私有回调接口

公开 `LEGACY_GAME_BATTLE_IMPACT_SKILLS_PROFILE` 与 `planBattleImpactSkill(command,get,localSlot,resourceCode,recoverMissing)`；规划返回 `impact-skill-plan`、缺施法者或不可用结果，复用四格RID追加和缺目标恢复行。`queueImpactSkill`先检查字段、资源、容量与运行上下文，再交既有队列所有者；命令阶段1等待原依赖后调用 `finishImpactSkill`。[共享规划器](../shared/legacy-game-battle-impact-skills.mjs)

私有 `createBattleImpactSkillsPlayback`处理68／85／101／106／110／111／112及独立生命周期；投射16、范围83／84、蓄唱135继续复用现有消费者。`battle-detached-vital`描述独立身体自身的HP变化；登记角色继续产生 `battle-vital`。

`impact-skill-detached-RID-storage`、`impact-skill-hidden-deflection-geometry`、`impact-skill-empty-target-runtime-unobserved`分别说明当前缺口。拒绝时的完整身体／播放状态保持，getter不执行，资源和合并容量错误均在排队前验证。源码与生成API结果一致。[验收](validation.md#stage286-legacy-battle-impact-skills)

<a id="stage285-legacy-battle-upper-skills"></a>

## stage285 上位规划与回调接口

`LEGACY_GAME_BATTLE_UPPER_SKILLS_PROFILE`公开六类、十等级及信息printf边界。`planBattleStatusSkill`总类别变为49项；上位规划器返回既有状态计划，`interruptionTail`保留各类独立收尾。`queueStatusSkill`继续使用统一容量、资源及所有权检查。[共享规划器](../shared/legacy-game-battle-upper-skills.mjs)

`createBattleUpperSkillsPlayback`由私有身体访问器创建分身、推进103／108／109并处理烟雾。`finishUpperSkill`对应源完成分支，112只对存活施法者重定向并清残影开关。`battle-information`仅由本地施法者产生：成功带已有C值及 `boxed-varargs-unmodeled`，失败名字观察为 `name-only`；尚未承诺产品提示文本等价。源码／生成版和24条产品入口均核对。[验收](validation.md#stage285-legacy-battle-upper-skills)

<a id="stage284-legacy-battle-skill99"></a>

## stage284 状态规划、图标与清理接口

`planBattleStatusSkill` 增加99–104，完整状态类别清单为43项，仍不声明完整SKL。新类别的 `rows[].tuples` 长度3表示只写三字段；中断尾沿用相同写入。`statusSkill.modifier` 投影图标类别与横纵偏移，保留既有回调／绘制所有权。[规划器](../shared/legacy-game-battle-status-skills.mjs)

C读取新增 `0xfc000` 的已证消费；图标是否已存在决定是否需要新资源。缺少必要动画、畸形字段或合并容量不足，在排队变更前拒绝。解码命令冻结字段副本，使错误清理能缩短工作数组并保留原错误；这43类之外的语法和其他C依赖继续单独核对。[验收](validation.md#stage284-legacy-battle-skill99)

<a id="stage283-legacy-battle-self-flags"></a>

## stage283 完整结果字与既有边界

`planBattlePhysicalFamily` 对普通成对自身记录保留完整32位结果字。既有角色、字段边界、RID资源、真实元组存储及总容量检查继续执行；类别5首条仅清位4。`rows[].tuples` 的长度3仍表示只写三字段，259类等级9瓦片标记使用这一既有接口。[规划器](../shared/legacy-game-battle-physical-family.mjs)

新增公共输入矩阵6,800组和旧第四格 `0x11223344` 回归，38种真实命令／身体回调覆盖部分动画信号、旋转、蓄力、不透明位和组合。SKL99负例与原有访问器、缺失角色、畸形记录、容量拒绝保留。[验收](validation.md#stage283-legacy-battle-self-flags)

<a id="stage282-legacy-battle-self-guard"></a>

## stage282 自身护卫接口与原子边界

`planBattlePhysicalFamily` 的普通自身范围扩展为 `0x13f8f77b`，类别5首条为 `0x13f8f77f`。护卫、元组、资源与回调接口保持原样；缺少护卫身体或RID元组存储时仍拒绝，不合成上下文。[规划器](../shared/legacy-game-battle-physical-family.mjs)

测试额外检查缺失角色、访问器字段及三个角色合并后的总容量：拒绝前后身体与播放状态相同，访问器未调用。公共M载入与回调接口驱动49种场景，蓄力保留冻结与效果完成，恢复后无身体忙碌或冻结残留。[验收](validation.md#stage282-legacy-battle-self-guard)

<a id="stage281-legacy-battle-self-metadata"></a>

## stage281 自身元数据复用现有接口

`planBattlePhysicalFamily` 对普通20类自身记录采用 `0x13f8f57b`；类别5首条为 `0x13f8f57f`。RID解析、资源代码上下文、四元组展开及消息顺序未新增协议字段，消费者接口未改。仍未支持的自身标志和护卫上下文继续显式拒绝。[规划器](../shared/legacy-game-battle-physical-family.mjs)

原创夹具使用公开角色输入、M载入、回调和绘制接口，检查资源切换／骑乘／附属节点、状态、游标、费用与结束类型。实际入口新增三种测试场景；状态清除场景从真实C状态输入开始，再经M消费，保留原等待和心跳。[验收](validation.md#stage281-legacy-battle-self-metadata)

<a id="stage280-legacy-battle-reentry"></a>

## stage280 连续战斗测试接口

产品公共接口保持原样，重新入场由既有会话数据和战斗代次触发；回场以实际世界中的位置重建运行时。第二场使用新的角色数据和确认状态，测试未直接写入就绪、身体或回合。[来源](../analysis/game-legacy-battle-reentry-v1/source-check.json)

测试夹具新增可选 `reentry` 模式及 `nextBattle／verifySecondGuard／finishSecondBattle`，只协调原创 Python 回环测试端。`MOLI_BATTLE_REENTRY=1` 仅允许三种已核对首场；测试端确认两个退出请求后才接收第二次移动并结束。网页／Page 的实际产品入口均已参与。[验收](validation.md#stage280-legacy-battle-reentry)

<a id="stage279-legacy-battle-self-control"></a>

## stage279 自身控制规划与原有生命周期

`planBattlePhysicalFamily` 现接受普通 20 类自身记录的 `0xf17b` 位范围，类别 5 第一条为 `0xf17f`。仍输出原动作与元组；未核对的资源／状态元数据继续显式拒绝。[规划器](../shared/legacy-game-battle-physical-family.mjs)

蓄力、倒地和散开的消费者接口未改。`stopRequested` 表示动作244停止，不能转写为 `battle-round-drained` 或回合1。公共 `beginEntry` 重新初始化后，原命令所有者与资源端口可接收新角色数据和 M，结束下一回合。测试端新增仅读退出请求的 `waitNativeExit`，用于在结束测试前证明自动退出；该方法仅属于测试夹具。[验收](validation.md#stage279-legacy-battle-self-control)

<a id="stage278-legacy-battle-self-special"></a>

## stage278 规划器接受 E000 自身结果

`planBattlePhysicalFamily` 接受普通 20 类自身记录的 `0xe10b` 位范围，类别 5 首条为 `0xe10f`。返回的原动作、元组、类别、费用及额外数值仍由已有消费者使用；未核对的蓄力、散开等上下文继续显式拒绝。[规划器](../shared/legacy-game-battle-physical-family.mjs)

`createBattlePhysicalResultRoutes` 保留 `8000 → 4000 → 2000` 的优先顺序，反射分别调用施法者与目标推进，再前进元组。两者同一时依旧调用两次。类别 81 在原有后续队列中的动作 155 继续按保存的数字样式更新 HP，不恢复已清除的技能类别。[结果消费者](../shared/legacy-game-battle-physical-results.mjs) · [验收](validation.md#stage278-legacy-battle-self-special)

<a id="stage277-legacy-battle-self-family"></a>

## stage277 自身规划与数字资源预检

`planBattlePhysicalFamily` 对已核对的 20 类基础自身记录返回 `physical-family-plan`；类别、等级、费用、元组及消息动作仍按原生产者生成。类别 5 第一条记录清除`0x4` 标志位，类别 81 保留额外整数；结果位范围之外仍返回 `physical-family-self-pair-runtime-unobserved`。[规划器](../shared/legacy-game-battle-physical-family.mjs)

物理播放预检在 `actor === target` 时使用结果阶段已清除的类别 `-1` 选择数字资源，技能 6 因而验证 HP 样式 6，不误要求 MP 样式 3。动作 14 的实际状态写入及资源绘制接口不变。[播放消费者](../shared/legacy-game-battle-physical-playback.mjs) · [验收](validation.md#stage277-legacy-battle-self-family)

# 当前模块接口与数据边界

<a id="stage276-legacy-battle-self-pair"></a>

## stage276 物理规划器接受已核对的自身结果

`planBattlePhysicalFamily` 对类别 0／1／3、自身结果位在 `0x10b` 内的记录返回 `physical-family-plan`。输出仍按登记槽合并，动作及元组保留原序；特殊结果或未核对类别仍返回 `physical-family-self-pair-runtime-unobserved`。[规划器](../shared/legacy-game-battle-physical-family.mjs)

`queuePhysicalFamily` 和动作 14 沿用同一身体所有权，目标推进可以改变施法者自身状态。因此先自后他的连续记录不保证全部结果执行，既有等待恢复负责清理。费用、状态和超时继续由原有共享所有者驱动。[实际回放](../analysis/game-legacy-battle-self-pair-v1/fixture.mjs)

`weChatBattleView` 现透传共享 Canvas 真实的 `round`，包含 0 和 1。测试端的新 Page 路径在发送结束战斗前同时检查费用、血量和 `round===1`，避免把费用更新当成回合完成。Web 原有回合断言保留。[验收](validation.md#stage276-legacy-battle-self-pair)

<a id="stage275-legacy-battle-weather-targets"></a>

## stage275 重复天气目标返回可执行规划

`planBattleCasting` 对有效重复天气目标继续返回 `casting-plan`，同槽的动作和元组累积，取消 `skill401-repeated-effect-target`。`rows` 仍按身体去重，施法者结果列表仍保存每次出现的原序。`skill401-self-effect-tuple` 和目标上下文检查保留。[规划器](../shared/legacy-game-battle-casting.mjs)

动作 211 每次目标出现推进一个目标动作，207 每满 30 次才消费当前效果元组。两次效果可能只有首个效果组运行，后续等待由既有恢复处理；不合并效果次数，也不额外放行动作。容量核对在写身体队列和扣费前完成。[原创回放](../analysis/game-legacy-battle-weather-targets-v1/fixture.mjs) · [容量与自身边界](../shared/tests/legacy-game-battle-weather-targets.test.mjs)

本轮没有新增公开接口。自然排空和效果退休分别记录，五种回放的 JSON 在源码及生成核心逐字节相同。[验收](validation.md#stage275-legacy-battle-weather-targets)

<a id="stage274-legacy-battle-pursuit-linked"></a>

## stage274 联动规划、效果副本与隐藏帧

`planBattleCasting` 对完整 SKL400 联动组返回原有 `casting-plan`，不足三行后续上下文时返回 `skill400-linked-tuple-boundary`。原来的统一拒绝 `skill400-linked-result` 已移除；没有增加公开消息字段、平台接口或容量。[规划器](../shared/legacy-game-battle-casting.mjs)

施法播放的类型 31 副本在普通结果时为 8 个 int32，联动结果为 20 个 int32，其中四行结果后在索引 16 写入 -1。父游标推进三行后，动作 211 使用重读槽推进身体动作。帧控制器对 `animation.graphicIndex===0` 返回 `graphic-empty` 跳过项；正编号缺少几何仍报 `LEGACY_BATTLE_FRAME_GEOMETRY`。[播放](../shared/legacy-game-battle-casting-playback.mjs) · [帧控制](../shared/legacy-game-battle-frame.mjs) · [测试](../shared/tests/legacy-game-battle-frame.test.mjs)

既有独立向量没有改写。链式和序列夹具仅增加绘图前观察点，在原先中断点核对历史回调前缀，再独立核对当前隐藏绘图，不修改实际身体或注入就绪状态。[验收](validation.md#stage274-legacy-battle-pursuit-linked)

<a id="stage273-legacy-battle-pursuit-targets"></a>

## stage273 SKL400 重复目标返回可执行规划

`planBattleCasting` 对重复的有效登记目标返回 `casting-plan`，同槽只生成一行，但行内动作和速度元组按每次出现追加；`hits` 和施法者元组仍包含原始次序的每个条目。原有 `skill400-linked-result` 和目标上下文检查保留。[规划器](../shared/legacy-game-battle-casting.mjs)

身体所有者继续在应用规划前检查累计容量，不重复扣施法者 MP。普通重复目标和提示目标通过原有命令与身体回调完成；提示效果在回合排空后仍可由后续回调退休。没有新增产品接口或提前就绪标志。[场景夹具](../analysis/game-legacy-battle-pursuit-targets-v1/fixture.mjs) · [验收](validation.md#stage273-legacy-battle-pursuit-targets)

<a id="stage272-legacy-battle-round-ack"></a>

## stage272 A 接收结果的存在性来源

`receive(bytes, mainState)` 的 A 分支仍返回 `markedSlots`，但只报告当前登记的 0..19 身体；RID0 新身体不必先有 C 行。已有 C 行的缓存标志继续同步，身体层统一执行 `markInputReady(mask, false)`，不依赖输入所有者已配置。主状态、当前回合和待初始化检查保持原有门限。[共享接收器](../shared/legacy-game-battle.mjs)

P 的 `copyState().parameters[0]` 是候选席位，`copyEntry().localSlot` 是当前操作席位，两者可在阶段 6 不同。正常阶段 2 消费 C 后同步，输入 `beginMarks` 再按当前回合对齐 A。新增四项检查覆盖 RID0 登记、未来／过期 A 及计数环绕。[夹具](../analysis/game-legacy-battle-round-ack-v1/fixture.mjs) · [验收](validation.md#stage272-legacy-battle-round-ack)

<a id="stage271-legacy-battle-character-queue"></a>

## stage271 队列由入口所有者消费

`receive(bytes, 10)` 的 C 分支更新 `copyState().characters` 环，不调用角色应用接口。配置入口后，`advanceEntry` 的阶段 2 在回调和 `frame` 之后调用内部 `consumeCharacterOwned`；阶段 5、6 交给回合循环。已排队的未来 C 不阻止正常输入与当前 M 的执行。[接收与消费](../shared/legacy-game-battle.mjs) · [入口](../shared/legacy-game-battle-entry.mjs) · [循环](../shared/legacy-game-battle-loop.mjs)

新的正常入口夹具通过真实 guard 输入、投射物节点、回合排空和后续 C 消费检查时序，不直接调用 `applyCharacter` 或 `removeCharacter`。本地 TCP 夹具提前发送下一回合 C/A/M，核对两次 guard、一次退出、两次移动和总计 10 个请求。[夹具](../analysis/game-legacy-battle-character-queue-v1/fixture.mjs) · [验收](validation.md#stage271-legacy-battle-character-queue)

<a id="stage270-legacy-battle-exit-rid0"></a>

## stage270 停止信号与交接清理接口

`callCallbacks` 接收 244 的停止结果后，`callManager` 返回 `manager-stop` 与下一阶段 7。`prepareExit` 清空活动掩码并分离 22 个身体登记项，退出所有者在渐变完成时调用 `markExitDeleted`。下一次入场的身体回调清理会执行待处理 RID0 的释放。[命令所有者](../shared/legacy-game-battle-commands.mjs) · [退出所有者](../shared/legacy-game-battle-exit.mjs) · [生命周期测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

本地骑乘输入需要两次待机。网页按 `petCount` 和就绪状态等待第二次输入，Page 通过 `secondary`、就绪状态及已发请求观察第二次输入。自动死亡退出的本地对端核对两次 `W|FF`、一次退出和两次移动请求。[入口验收](validation.md#stage270-legacy-battle-exit-rid0)

<a id="stage269-legacy-battle-reflected-rid0"></a>

## stage269 已准备交接对象的暂存与恢复

`queue` 为附带 RID0 保存动作、元组索引和所有者。`suspendRider` 仅暂存仍属原身体、尚未登记 B 的交接对象，保存显示与回调标志并隐藏。`resumeRider` 复核身体归属后恢复同一节点。221 还需 `matchesQueuedRow` 核对完整元组及当前动作位置。普通重新骑乘可以复用已保留的节点。[交接回放](../shared/legacy-game-battle-attached-rid-playback.mjs) · [主体与子项](../shared/legacy-game-battle-playback.mjs)

快照仅在暂存期间提供 `suspendedRiderId`。源身体离场时，`discardPrepared` 将该节点标记回收，并释放未登记的 A、B 和容器。回归覆盖本地、远端和同槽交接及保留期间的主体离场。[专项测试](../shared/tests/legacy-game-battle-physical-missing.test.mjs) · [验收](validation.md#stage269-legacy-battle-reflected-rid0)

<a id="stage268-legacy-battle-casting-rid0"></a>

## stage268 尾随 221 的内部游标校验

`queue` 在同一主施法者的 `135,62,221` 相邻队列及已排入的终止元组上记录 `castTail`。内部记录含所有者、动作索引、元组索引和空列表标记。221 首帧核对这些值与 `[A,0,A,B]`，只接受当前行及规格允许的相邻终止行。校验失败产生 `LEGACY_BATTLE_ATTACHED_RID_CONTEXT`，发生在 B 登记之前。[交接回放](../shared/legacy-game-battle-attached-rid-playback.mjs) · [专项验证](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage267-legacy-battle-rid0-flight"></a>

## stage267 下降与落地的回放接口

`activeRider` 对已读取的 221 元组比对交接记录的 A、B，并按原父身体持有的骑乘对象维护生命周期。原有 222 的骑乘归属检查继续适用。221 每帧通过角色注册表取当前 B 的身体节点及动画，落地复用同一套 A 登记、显示状态恢复和容器清理。[身体回放](../shared/legacy-game-battle-playback.mjs) · [交接回放](../shared/legacy-game-battle-attached-rid-playback.mjs)

B 清空时，附带 RID0 路径检查原父身体是否仍占 A 槽。仍占 A 时只完成 A 的落地，A 也已清空时回收未登记的对象。测试覆盖分槽、同槽、B 移除和 B 替换。[专项验证](../shared/tests/legacy-game-battle-physical-missing.test.mjs) · [验收](validation.md#stage267-legacy-battle-rid0-flight)

<a id="stage266-legacy-battle-rid0-ownership"></a>

## stage266 空闲 A 与已登记 B

`planBattlePhysicalFamily` 从首对或后段缺席处检查 RID0 的实际偏移。身体层按各个尾随 A 预检资源、容量和队列状态。原主身体无返回动作或 A 属于另一具空闲身体时，追加 221 后保留其空闲状态。阶段 1 等待使用原掩码和组内计数。[规划](../shared/legacy-game-battle-physical-family.mjs) · [身体队列](../shared/legacy-game-battle-body.mjs)

`discardPendingAttachedRID` 在等待超限归位前回收尚未启动的交接，并在骑乘展示仍归该交接所有时恢复先前展示。实际删除父身体时，`discardPrepared` 根据尚未移交的 A、B 指针清理。B 已登记时只回收 A 和容器，待替换的其他身体各自保有注册与状态。[对象回放](../shared/legacy-game-battle-attached-rid-playback.mjs) · [专项验证](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage265-legacy-battle-rid0-interruption"></a>

## stage265 中断游标与待交接对象

`battlePhysicalAbortReachesRID` 以已解码主段和已接受的首个 RID0 偏移为输入边界。规划器传入缺席位置之前已消费的数值字段数。遇到未知中断词元且下一个词元恰好到达该偏移时，返回尾随可达。共享身体层预检返回队列、骑乘资源、动作和元组容量，管理器恢复原所有者的阶段 1 等待并扣去一个后继计数。[解析器](../shared/legacy-game-battle-motion.mjs) · [身体队列](../shared/legacy-game-battle-body.mjs) · [管理器](../shared/legacy-game-battle-commands.mjs)

父身体实际移出回放池时，`discardPrepared` 按该身体身份检查仍待注册的尾随交接，标记两具隐藏身体与容器并移除交接记录。此次回收覆盖当前交接尚未登记 B 的状态。写入 B 后的父身体离场待验证。[RID0 回放](../shared/legacy-game-battle-attached-rid-playback.mjs) · [专项验证](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage264-legacy-battle-rid0-receive"></a>

## stage264 RID0 追加与原身体身份

从真实 M 记录抽出的主段可生成 `lateReceiveSlots` 与 `followingStrikes`。在绑定原身体、命令所有者和动作位置后，附带记录把 221 和对应元组追加到原 A。用于安排等待的索引仍定位主段中的原位置。[规划](../shared/legacy-game-battle-physical-family.mjs) · [RID0 回放](../shared/legacy-game-battle-attached-rid-playback.mjs)

动作 221 首次写入 B 时，`cancelUnstartedPhysicalReceive` 检查被覆盖身体的所有者、尚未交付的受击记录和未起步的动作 24。满足条件时复用离场清理，解除其等待依赖。已起步身体保留原回调，替补身份由 221 的注册写入确定。[受击回放](../shared/legacy-game-battle-physical-guard-playback.mjs) · [专项验证](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage263-legacy-battle-following-results"></a>

## stage263 规划与回放的结算位置

`followingStrikes` 将起步 `action`、实际结果 `resultAction` 和取消范围末动作 `last` 分开。起始 `tuple` 到 `tupleEnd` 组成该结果占用的闭区间。无内联 RID 时占一位，含内联 RID 时占四位，`tupleEnd` 为结果副本的位置。回放提交时换算绝对索引。[规划](../shared/legacy-game-battle-physical-guard-plan.mjs) · [回放](../shared/legacy-game-battle-physical-guard-playback.mjs)

`recordEarlyPhysicalReceive` 核对同一个命令所有者、原发送者、原受击身体、实际结算动作及结果元组。命中前取消时跳到 `tupleEnd + 1` 并跳过该结果范围内的动作。反射已经结算时，攻击者的反应留在队列中，元组已越过该范围。[结果分支](../shared/legacy-game-battle-physical-results.mjs) · [专项回放](../analysis/game-legacy-battle-following-results-v1/validation.json)

<a id="stage262-legacy-battle-late-recipient"></a>

## stage262 受击等待的交付记录

普通嵌套物理计划可携带 `lateReceiveSlots`，用于登记具有先排攻击的空闲身体。发送者取得受击段后，交付检查核对身体、所有者、动作位置和攻击元组位置。记录随原受击身体重置或离场清除。发送者在交付前离场时释放该位置，交付后离场时保留该结果。动作 0 匹配已交付段时推进至原反应动作，继续使用既有动画和归位。[规划](../shared/legacy-game-battle-physical-family.mjs) · [受击登记](../shared/legacy-game-battle-physical-guard-playback.mjs) · [命中消费](../shared/legacy-game-battle-physical-playback.mjs)

<a id="stage261-legacy-battle-independent-following"></a>

## stage261 未起步攻击者的等待信息

普通嵌套物理计划可携带 `idleAttackerSlots`。身体容器以实际解码命令为键保存提交前的空闲身体和预约，检查队列首项 24 仍在原位置。物理命令的等待调用可以返回 `recovery: 'idle-attacker'` 及本次归位的槽集合。归位调用沿用原 11、38 队列。其他物理输入继续按各自已建立的等待路径执行。[规划](../shared/legacy-game-battle-physical-family.mjs) · [身体容器](../shared/legacy-game-battle-body.mjs) · [命令调度](../shared/legacy-game-battle-commands.mjs)

<a id="stage260-legacy-battle-missing-lookahead"></a>

## stage260 缺席前瞻的内部计划

`planBattlePhysicalFamily` 为已解码 SKL72 或 SKL113 的后续目标缺席返回 `missing`、`recoveryRows` 和可选的 `discardedPrefixMask`。前瞻的未绑定槽必须等于缺席目标，转向所在身体必须在清理掩码内，且处于非死亡和非动作 13 状态。命令的身体提交检查原队列容量，对符合清理条件的身体只应用赋值，随后仍走统一中断清理。缺席场景的护卫交接和后续攻击播放登记保持关闭。[规划](../shared/legacy-game-battle-physical-family.mjs) · [前瞻](../shared/legacy-game-battle-physical-guard-plan.mjs) · [身体提交](../shared/legacy-game-battle-body.mjs)

<a id="stage259-legacy-battle-following-strikes"></a>

## stage259 后续攻击范围与取消

`followingStrikes` 是嵌套普通配对规划的冻结记录，保存攻击者、目标、攻击动作范围、攻击元组和目标等待段。`guardHandoffs` 另外保存可选的转向元组。提交后，回调按绝对位置和原身体匹配。攻击者离场时逐段处理目标仍未消费的动作，目标离场时仅消费对应的攻击区间，关闭当前蓄力对象。已有身体重置和销毁入口清除两类登记。[规划](../shared/legacy-game-battle-physical-nested-plan.mjs) · [角色回调](../shared/legacy-game-battle-physical-guard-playback.mjs)

<a id="stage258-legacy-battle-repeated-protection"></a>

## stage258 重复保护和后续攻击的队列位置

内部 `guardHandoffs` 在重复保护时记录外层归位与内层起点。一个共享护卫又是唯一后续普通配对的攻击者时，条目可携带 `following`，绑定其转向元组、后续攻击段和目标的待激活动作。角色容器提交后以绝对游标和身体实例匹配。护卫离场时处理仍未激活的受击动作，目标离场时推进对应转向及后续攻击游标。原有队列中较早的动作按自己的回调运行。[规划](../shared/legacy-game-battle-physical-nested-plan.mjs) · [播放](../shared/legacy-game-battle-physical-guard-playback.mjs)

<a id="stage257-legacy-battle-guard-wait"></a>

## stage257 护卫规划和回调状态的内部交接

`planBattlePhysicalFamily` 的嵌套配对规划可携带冻结的 `guardHandoffs`。条目记录施法者等待、护卫靠近和返回、受保护角色队列，以及可用的退场和共享护卫结果位置。`queuePhysicalFamily` 提交动作和元组后登记实际身体实例、所有者和绝对游标。回调以同一实例的等待位置放行，移除时只失效相应的目标引用并保留队列中更早的动作。队列重置与对象销毁清除登记。[规划](../shared/legacy-game-battle-physical-nested-plan.mjs) · [角色容器](../shared/legacy-game-battle-body.mjs) · [护卫回调](../shared/legacy-game-battle-physical-guard-playback.mjs)

<a id="stage256-legacy-battle-skl113-wire"></a>

## stage256 SKL113 的执行位置交接

`decodeLegacyGameBattleMotion` 返回预读的 `nextOffset`、`dependencyCounts` 和数值字段。符合条件的 SKL113 保留私有的原数值字节及下一标记。规划器在较早结束时给出 `producerFieldCount`，角色容器核对同组标记后返回 `producerEnd`。独立记录仍由管理器按 `nextOffset` 分配。同组命令从对象的执行游标扫描，只跳过未知标记。[解码](../shared/legacy-game-battle-motion.mjs) · [命令所有者](../shared/legacy-game-battle-commands.mjs)

同组续接要求扫描到同一预约标记的字节位置。若碰到其他可识别标记、扫过目标或找不到目标，技能在队列提交前返回 `physical-family-grouped-command-boundary`。预读附带 RID 与较早执行结束共存时返回 `physical-family-attached-RID-boundary`。[角色容器](../shared/legacy-game-battle-body.mjs) · [专项](../shared/tests/legacy-game-battle-physical-missing.test.mjs)

<a id="stage255-legacy-battle-guard-alias"></a>

## stage255 已提交队列中的嵌套护卫位置

`planBattlePhysicalFamily` 为可独立定位的嵌套护卫返回内部 `nestedGuard`。位置相对于三个角色各自的本次追加段。角色容器在提交后换算为绝对动作及元组位置。动作 71 成功唤醒护卫时，将记录转为活动交接。移除、重置和清理以角色对象回收记录。[计划](../shared/legacy-game-battle-physical-nested-plan.mjs) · [交接](../shared/legacy-game-battle-physical-guard-playback.mjs)

退场时核对队列所有者、232 动作位置与原槽身份。尚未进入的等待使用 62 自行推进，受保护角色已有的前置动作按原序执行，交接段保留 72 以消费预留元组。原角色已进入等待时可直接推进受影响段。SKL266 返还在飞行物删除前放行待执行的 216。[角色容器](../shared/legacy-game-battle-body.mjs) · [飞行回放](../shared/legacy-game-battle-physical-projectiles.mjs)

<a id="stage254-legacy-battle-guard-departure"></a>

## stage254 护卫飞行与内部移除

`legacy-game-battle-physical-projectiles.mjs` 在第一趟返程从施法者终止元组接出第二趟，使用普通 24 等待及 71 推进护卫。217 放行后继续原对象的 21 和 22。若护卫身份失效，按原所有者、动作和元组位置释放施法者到 23。`legacy-game-battle-body.mjs` 的公开移除与回调移除共用注册表清理，活动嵌套护卫的放行只处理登记过的施法者和原目标。[实现](../shared/legacy-game-battle-physical-projectiles.mjs) · [验收](validation.md#stage254-legacy-battle-guard-departure)

<a id="stage253-legacy-battle-guard-release"></a>

## stage253 物理护卫的内部放行

`legacy-game-battle-physical-guard-playback.mjs` 在 `24 → 71 → 0 → 24` 交接实际唤醒护卫时登记对象身份。护卫按原目标对象执行 4、42、71，目标缺席时从第一处 71 放行原施法者。施法者需仍在注册表、同一所有者及原等待索引。角色队列重置、移除和释放会清理这份记录。SKL266 无飞行的独立护卫在规划时追加启动用 71，并从护卫末尾的 72 继续到 216。[实现](../shared/legacy-game-battle-physical-guard-playback.mjs) · [验收](validation.md#stage253-legacy-battle-guard-release)

<a id="stage252-legacy-battle-physical-boundaries"></a>

## stage252 物理技能的嵌套目标和发射边界

`planBattlePhysicalFamily` 以 `physical-family-unbound` 和 `missing.point=nested-target` 通知已有命令所有者。动作 232 对排队后缺席的接收方推进当前元组、清动作计数并出队。护卫的动作 4、42、71 各自释放缺席依赖。动作 15、18 在终止元组清理动画信号；变体 2 只有存在飞行目标时才为正常队列安排 41。[计划](../shared/legacy-game-battle-physical-family.mjs) · [嵌套回调](../shared/legacy-game-battle-physical-nested.mjs) · [发射回调](../shared/legacy-game-battle-physical-projectiles.mjs)

<a id="stage251-legacy-battle-physical-registry"></a>

## stage251 物理技能空槽结果

命令所有者为 `planBattlePhysicalFamily` 提供实时槽查找。来自 M 解码的记录返回 `physical-family-unbound` 时包含 `category`、`variant`、`principal` 与 `missing`。`missing` 包含槽、角色及读取点，覆盖配对护卫、串联护卫、嵌套护卫、保存的自身护卫和正变体施法者。命令回调返回 `command-strike-skipped` 并携带 `completion`。直接调用或复制的记录对实际缺席角色保持预检拒绝。[共享计划](../shared/legacy-game-battle-physical-family.mjs) · [命令所有者](../shared/legacy-game-battle-commands.mjs)

<a id="stage250-legacy-battle-assist-terminator"></a>

## stage250 协作者终止结果

`decodeLegacyGameBattleMotion` 在协作者 `FF` 后保持 `principalSlot` 为 255、`attachedRID` 为 0，并将后续 `RID` 保留为独立记录。命令所有者对有解码来源的该类记录返回 `command-status-skill`，以 `assistTerminator` 标记并给出 `completion`。直接计划调用仍沿用预检。[解码器](../shared/legacy-game-battle-motion.mjs) · [命令所有者](../shared/legacy-game-battle-commands.mjs)

<a id="stage249-legacy-battle-physical-missing"></a>

## stage249 物理队列中断结果

`planBattlePhysicalFamily` 在命令所有者启用恢复且具有已解码记录来源时，按读入位置生成前缀和 `recoveryRows`。首攻击者缺席直接完成命令。其他已支持的空槽由 `command-strike.missing` 的 `slot`、`role`、`point` 与 `completion` 表示。直接调用沿用原有预检。释放尾部复用共享容量预检与一次性所有者回执。[物理计划](../shared/legacy-game-battle-physical-family.mjs) · [命令所有者](../shared/legacy-game-battle-commands.mjs)

<a id="stage248-legacy-battle-family-missing"></a>

## stage248 技能计划与缺席命令结果

`planBattleStatusSkill`、`planBattleCasting`、`planBattleNumericSkill` 和 `planBattleSkill82` 在命令所有者启用缺席恢复时识别空槽。缺席目标返回 `missing` 和前缀 `rows`。数值与施法计划另以 `recoveryRows` 描述清理后的尾部。直接调用默认沿用既有预检。[角色体队列](../shared/legacy-game-battle-body.mjs)

`command-status-skill`、`command-casting`、`command-numeric-skill` 与 `command-skill82` 的中断结果用 `missing` 和 `completion` 分别标记缺席目标与所有者释放或续接。缺席施法者沿用直接完成命令的结果。尾部提交绑定同一所有者和一次性中断结果。[命令所有者](../shared/legacy-game-battle-commands.mjs)

<a id="stage247-legacy-battle-missing"></a>

## stage247 缺席参与角色的中断结果

共享命令所有者为 SKL98 启用缺席恢复。`planBattleStatusSkill` 在已解析的记录中返回缺席槽与角色类型，并保留该槽之前的队列和换位。`queueStatusSkill` 校验前缀与可能保留的收尾容量，再提交前缀。独立调用仍使用既有预检结果。

命令所有者以 `finish` 清理该所有者的依赖队列，返回 `command-status-skill`，其中 `missing` 指明缺席位置，`completion` 记录释放或下一条。同组续接使用干净的元组队列。释放时保留对应终止元组与协作者动作 72。已提交的 `swaps` 和 `localSlot` 通过现有回调交接。

[状态计划](../shared/legacy-game-battle-status-skills.mjs) · [命令所有者](../shared/legacy-game-battle-commands.mjs) · [角色体队列](../shared/legacy-game-battle-body.mjs)

<a id="stage246-legacy-battle-status-assist"></a>

## stage246 协作者计划与播放

`planBattleStatusSkill(command, get, localSlot, resourceCode)` 在变体 12、13 返回 `assistSlot` 和含 `amount` 的命中记录。施法者 `principal` 保存 `assistSlot`，协作者拥有结果元组及动作。变体 12 与 SKL82 共用附带资源元组的排列，变体 13 保存固定四字元组，第四字写 0。队列提交前校验参与角色、数字图元和容量。

`createBattleStatusSkillsPlayback` 的动作 135 从施法者读取协作者槽。命中回调复用 `createBattleSkill82Playback`，移动和飞行回调复用 `createBattleMovingNumericPlayback`。目标回复沿用动作 146、155。共享回合继续通过已有 244 退场分支处理本方协作者。

[技能计划](../shared/legacy-game-battle-status-skills.mjs) · [命中播放](../shared/legacy-game-battle-skill82-playback.mjs) · [飞行播放](../shared/legacy-game-battle-moving-numeric-playback.mjs)

<a id="stage245-legacy-battle-status-position"></a>

## stage245 变体 7 计划与提交

`planBattleStatusSkill` 的变体 7 结果带有 `position`。其中 `slotSources` 把预计完成后的槽映射到初始角色体，`swaps` 保留顺序和配对角色是否走位，`localSlot` 是当前本方槽。队列按初始角色体索引写入，施法元组按注册槽读回。附带 RID0 用同一份预计注册表和本方槽预检。

`queueStatusSkill` 在预检后提交队列和交换。`battleBodyFormation` 读取角色体保留的阵位或当前槽阵位，供走位和朝向回调使用。动作 135 通过实际元组槽推进种子并激活现存目标。命令结果带有 `swaps` 和 `localSlot`。战斗所有者按同一序列交换角色记录，既有入口所有者按回调汇总的 `localSlotUpdate` 更新当前本方槽。

[计划与队列](../shared/legacy-game-battle-status-skills.mjs) · [角色体注册表](../shared/legacy-game-battle-body.mjs) · [战斗所有者](../shared/legacy-game-battle.mjs)

<a id="stage244-legacy-battle-status-slots"></a>

## stage244 目标槽队列和角色体回调

`planBattleStatusSkill` 为变体 6、8 接受 FF 结尾的槽列表。变体 6 为每个目标生成 78、81、66、79、54，并分开保存两个声音编号。变体 8 为已有目标生成 78、51、49。死亡目标先重置旧队列，本方配对槽在此前插入 218 和缓存元组。施法者的元组仍以 `-1` 结束。

共享播放补齐动画 5 的完成与帧信号清理、第二音效和两轴单精度缩放。附带 RID0 沿用 `queueStatusSkill` 外层的容量、资源和骑乘上下文校验。

[队列](../shared/legacy-game-battle-status-skills.mjs) · [播放](../shared/legacy-game-battle-playback.mjs) · [通信规格](logic-protocol-spec.md#stage244-legacy-battle-status-slots)

<a id="stage243-legacy-game-stream"></a>

## stage243 游戏桥与共享计时

`createLauncherLoopbackServer` 的可选 `gameStream: true` 适用于 `legacy` 来源。两条升级路径沿用相同 Host、Origin、子协议、令牌、端点序号和八连接上限。`lifetimeMilliseconds` 对 `/game-stream` 约束授权及连接建立，默认 10,000 毫秒。游戏页读取运行配置后用 `createBrowserGameTransport` 打开此路径，单条二进制帧限 65,536 字节，待消费数据限 4 MiB 与 8,192 块。对端 EOF 后继续交付已排队字节。

`createLegacyGameSession` 的 `keepalive: true` 用既有 `clock`、`setTimer`、`clearTimer` 和串行写口调度保活，默认关闭。网页游戏长连接与微信游戏 Page 显式启用。角色流程的轮询可提前替换较迟的定时器。成功写入刷新出站计时，关闭会结算在途读写与回调。

[桥接](../adapters/node/launcher-loopback.mjs) · [浏览器流](../web/launcher-websocket.mjs) · [会话所有者](../web/legacy-game-session.mjs)

<a id="stage242-legacy-battle-status-variant"></a>

## stage242 状态技能和活体数值

`planBattleStatusSkill` 接受已解析的 SKL98 共用记录，返回变体、施法槽、效果资源和逐槽队列。队列应用前核对目标、数值资源和容量。共享回调执行前摇、施法信号及效果。动作 43 通过同一个角色体更新当前 HP 并产生数值事件。动作 199 保留继承来的数值样式，样式 4 增加 MP 并按最大 MP 封顶。

[队列](../shared/legacy-game-battle-status-skills.mjs) · [回调](../shared/legacy-game-battle-status-skills-playback.mjs)

<a id="stage241-legacy-battle-summon"></a>

## stage241 SKL93 的角色和队列

`queueSummon` 消费已由战斗运动解析器验证的命令。它核验施法者、目标、状态位、好友上下文和队列容量，再登记整批新体。调度器返回 `command-summon` 及替换元数据，战斗状态以 `SKL93` 更新每个槽的来源。画面、目标选择和后续技能继续读取当前角色体。完成信号、渐进放大和等待释放沿用现有的动作回调。

[实现](../shared/legacy-game-battle-body.mjs) · [通信规格](logic-protocol-spec.md#stage241-legacy-battle-summon)

<a id="stage240-legacy-battle-city-return"></a>

## stage240 战斗回城的所有权和提交

共享客户端的 `canReturnToCity` 同时覆盖可操作的地图和已初始化的战斗。回城所有者记录出发场景，推进捕获图像，验证宿主提交的当前帧。会话的 `completeCityBattleExit()` 在已提交的末帧释放战斗所有权并排队回包。

提前 `>HY` 使未提交帧失效，已收到的 `TfD` 继续经同一世界加载。重新进入地图时复用角色全局数据和地图缓存，解除普通输入限制。下一次战斗使用新世代。

[共享客户端](../shared/legacy-game-client.mjs) · [共享战斗](../shared/legacy-game-battle.mjs) · [会话](../web/legacy-game-session.mjs)

<a id="stage239-legacy-city-return"></a>

## stage239 回城会话与 Canvas 端口

`requestCityReturn()` 接收宿主交出的最近一次画面。共享会话登记回城标志，保留借用的世界，编码 `send-004f8840` 并暂停普通命令队列。`cityReturn` 报告当前路径和帧进度。宿主以时钟调用 `advanceCityReturn(tick)`，由 `presentCityReturn(frame, paint)` 验证帧的所有权并完成提交。

共享世界复用现有地图块、角色体和绘制计划，准备目标画面。旧作业被取消时，晚到的 RGBA 缓冲会释放。末帧提交后恢复普通运行时，原会话继续提供收发。

[共享回城](../shared/legacy-game-city-return.mjs) · [会话](../web/legacy-game-session.mjs) · [Canvas 端口](../web/legacy-game-city-return-canvas.mjs)

<a id="stage238-legacy-battle-alternate-exit"></a>

## stage238 回选服的客户端接口

`requestServerReturn()` 由共享客户端把已入场请求交给会话的 `beginServerReturn()`。客户端使用 `returning-server` 停止玩法输入，宿主读取 `session.manualReturn` 的 `fading` 与 `waiting` 区分画面和等待状态。宿主在最后一帧提交后调用 `completeServerReturnFade()`，重复调用幂等。

会话持有请求编码、排队、超时及结果。已交给传输端口的写入可完成，排队的普通命令被退回，接收路径继续解码封包以等待应答。结束原因 `manual-server-return`、`manual-return-rejected`、`manual-return-timeout` 区分握手结果。

[会话实现](../web/legacy-game-session.mjs) · [共享客户端](../shared/legacy-game-client.mjs) · [通信规格](logic-protocol-spec.md#stage238-legacy-battle-alternate-exit)

<a id="stage237-legacy-music-phases"></a>

## stage237 曲目选择与战斗指令

`legacyGameBattleMusic` 根据战斗模式、背景号、场景模式和地图号返回曲目。共享客户端的 `sceneMusicCode` 是最近一次生效的场景选曲，`battleMusic` 发布一次性 `play`、`fade` 或 `restore` 指令。服务器发来的待用选择由会话持有，到场景交接点应用。

音频适配器按指令身份去重。切换曲目时取消渐隐并释放旧节点，退出会话时释放读取和输出的所有权。

[共享音频](../shared/legacy-game-audio.mjs) · [会话所有者](../shared/legacy-game-client.mjs) · [输出适配器](../web/legacy-game-audio-host.mjs)

<a id="stage236-legacy-audio"></a>

## stage236 音频读取与输出

`legacyGameResourceAudio` 从资源计划的内部元数据读取两个开关。共享游戏客户端在场景资源就绪时发布 `sceneMusicCode`。音频适配器根据会话和场景状态选曲或播放退场。适配器通过已有文件端口读取本轮资源，并用 `AudioBuffer` 保存解码后的 PCM。

新曲目会终止旧的播放节点。尚在读取的曲目失效后会被丢弃。缺失或损坏的音频跳过播放，关闭时取消渐隐并释放音频上下文。微信 Page 使用基础库的 `wx.createWebAudioContext` 及 `AudioBuffer.copyToChannel`。

[共享音频](../shared/legacy-game-audio.mjs) · [输出适配器](../web/legacy-game-audio-host.mjs) · [Web Audio 规范](https://www.w3.org/TR/webaudio/) · [微信 API 类型声明](https://github.com/wechat-miniprogram/api-typings/blob/master/types/wx/lib.wx.api.d.ts)

<a id="stage235-legacy-server-return-fade"></a>

## stage235 画布退场所有权

`createLegacyGameCanvasResourceHost` 与 `createLegacyGameBattleCanvasHost` 可通过 `onImage` 在成功提交后移交新建的 `ImageData`。退场所有者仅保留一张 640×480 图像，按已有时钟周期推进源第 14 类，替换或关闭时释放缓存。

浏览器视图与微信 Page 暴露 `returnTransition.state` 和已提交帧数。`running` 时确认禁用，`complete` 时开放。`unavailable` 表示无匹配画面或画布无法提交，仍可确认。会话状态继续使用 `returning-server`。

[播放适配器](../web/legacy-game-server-return-canvas.mjs) · [验收](validation.md#stage235-legacy-server-return-fade)

<a id="stage234-legacy-server-return"></a>

## stage234 游戏会话的退出状态

`createLegacyGameSession` 和其共享客户端的状态视图新增 `returning-server`。客户端撤销普通帧和战斗画面调度。此时新的发送和已排队发送以 `LEGACY_SESSION_SERVER_RETURN` 结束，已交给传输层的写入可独立完成。读取停在当前通知，原连接由会话持有到关闭。

网页与微信的确认继续走现有 `close()`，会话 `done` 的 `reason` 为 `source-server-return`。确认后的资源释放沿用宿主所有权。

[共享客户端](../shared/legacy-game-client.mjs) · [会话接口](../web/legacy-game-session.mjs) · [验收](validation.md#stage234-legacy-server-return)

<a id="stage233-legacy-frame-startup"></a>

## stage233 普通入场的单字段选择

`snapshotLegacyGameClientContext`、`createLegacyGameStartup` 与 `prepareLegacyGameStartup` 接受固定字符串 `"legacy-se6000-37c4"` 作为整个 `context`。返回值仍是原有五字段的只读上下文。帧参数展开为 `runtimeStage = 3`、`soundScene = 9`、`ownGateByte = 0`、`movementScale = 1`、`sparseMode = 0`。角色体默认 `0x34`，冻结和特殊态为零，初始子动作为空。动态字段沿用收包和角色所有权。

显式五字段对象仍适用，包括既有的分项选择。字符串按固定来源校验，其他字符串或缺项会失败。源移动仍要求宿主提供 `wallSeconds()`。

[共享解析器](../shared/legacy-game-client-config.mjs) · [启动材料](resource-formats.md#stage233-legacy-frame-startup)

<a id="stage232-legacy-ordinary-context"></a>

## stage232 普通移动和输入上下文

`snapshotLegacyGameClientContext` 接受 `movement`、`input` 中任意一项或两项的源选项 `"legacy-se6000-37c4"`。它们也可各自使用完整显式对象。仍需提供帧、角色和显示上下文。

源移动会话要求 `createLegacyGameClient` 的 `wallSeconds()` 返回 UInt32 整数秒。其值传给共享协议以保存收包锚点和计算时段。网页使用浏览器时钟，微信使用宿主现有墙钟。普通输入的指针策略由帧更新读取，指针请求时间在场景运行时之间移交。

[共享客户端](../shared/legacy-game-client.mjs) · [资源材料格式](resource-formats.md#stage232-legacy-ordinary-context) · [验收](validation.md#stage232-legacy-ordinary-context)

<a id="stage231-legacy-display-startup"></a>

## stage231 源显示选择和相机端口

`snapshotLegacyGameClientContext` 接受明确的 `context.display = "legacy-se6000-37c4"`，展开为 640×480、中心 320×240、`graphicsMode: 2`、`forceRender: false`。展开后的 `initialCamera: null` 表示用场景位置初始化并同步服务端修正。显式显示对象也可用该值选择相机策略，或提供完整坐标对。

`createLegacyGameRuntime().synchronizeCamera(position)` 快照一个有限 float32 坐标对。共享客户端在接受位置修正后调用它，宿主仍通过原有 `readFrame()` 提供帧和输入参数。

[共享上下文](../shared/legacy-game-client-config.mjs) · [材料格式](resource-formats.md#stage231-legacy-display-startup)

<a id="stage230-legacy-config-startup"></a>

## stage230 启动材料从选定文件派生资源参数

`prepareLegacyGameStartup(value, files)` 的 v2 输入可在 `resourceParametersHex` 和 `commandTailHex` 中选一项。命令尾模式校验固定模块后，向同一端口查询 Config.dat，并读取至多 256 字节。句柄 `inspect().configFromSelectedFiles` 表明资源参数的求值依赖该次选择，包含文件缺失时采用命令尾的分支。

`mergeLegacyGameResourceParameters(configPrefix, commandTail)` 位于资源路径模块。输入前缀为已读字节，`null` 表示文件缺失。输出是独立的合并字节。微信成功替换 ZIP 时关闭相关句柄，导入失败保留已核验的选择。

PR-D4 复用此合并接口和配置器的 1–4 档编解码。游戏请求档位在合并后的启动参数阶段按样本读取，再交给图形所有者。留存发行配置、缺少配置和生成默认配置共用 PR-A10 的冷启动用例。 [档位接口和已测结果](game-static.md#legacy-render-startup-tier-input)

[共享入口](../shared/legacy-game-client-config.mjs) · [资源格式](resource-formats.md#stage230-legacy-config-startup)

<a id="stage229-legacy-startup-materials"></a>

## stage229 启动材料的文件端口

`prepareLegacyGameStartup(value, files)` 返回 Promise，成功值为现有 `copy/inspect/close` 句柄。v1 仍可直接使用同步 `createLegacyGameStartup(value)`。v2 省略 `moduleDigestHex`，并通过 `files.stat(name)` 与 `files.read(name, offset, length)` 核对选中的文件。共享层在等待文件前冻结上下文，计算期间使用独立字节副本。

网页读取所选根文件夹。微信 Page 的 `readWeChatGameStartup(bytes, files)` 接入已导入 ZIP 的端口并等待结果，过期导入会关闭所得句柄。文件读取失败保持当前选择可重试。

[输入格式](resource-formats.md#stage229-legacy-startup-materials) · [代码](../shared/legacy-game-client-config.mjs) · [验收](validation.md#stage229-legacy-startup-materials)

<a id="stage228-wechat-special-dialogs"></a>

## stage228 特殊对话和画布接口

**事实**。 `weChatMapDialog` 投影物品交接选项、输入数量、外观控件和图像描述。 `onDialogInput` 与 `onDialogSecondInput` 使用当前修订，`onDialog` 将按钮与已编码输入交给 `replyMapDialog`。两项的字节副本在提交后释放。

**事实**。 `legacy-game-dialog-graphics.mjs` 用共享图像解释器和资源库创建绘制计划。 `bindDialogCanvas` 接受当前图像代次的 Canvas 节点。绘制计划通过场景现有的 `renderMapDialogGraphics` 端口运行，帧数据写入 Canvas 后清除。

[适配目录](../adapters/wechat/README.md#stage228-wechat-special-dialogs) · [格式与编码](resource-formats.md#stage228-wechat-special-dialogs)

<a id="stage227-wechat-family-board"></a>

## stage227 家族与留言窗口的微信接口

**事实**。 `legacy-game-family.mjs` 将 `copyFamily()` 投影为身份、名单和编辑能力。 `onFamily` 传入操作、资料修订和显示版本，提交用 `actOnFamily`。可执行成员、目标称号和权限来自共享模型。

**事实**。 `onFamilyPet` 按窗口修订和物品槽修订调用 `actOnMapFamilyPet`。 `onBoard` 按窗口修订调用 `replyMapDialog` 或 `dismissMapDialog`。页面保留已解码的显示数据，读取和发送使用的文本字节副本在操作后清除。

[适配目录](../adapters/wechat/README.md#stage227-wechat-family-board) · [格式与编码](resource-formats.md#stage227-wechat-family-board)

<a id="stage226-wechat-storage-trade"></a>

## stage226 微信仓储和交易页面接口

**事实**。 `legacy-game-bank.mjs` 按模式投影持有与仓储记录。 `onBank` 将操作、窗口修订和选择器版本传给宿主。转移经 `actOnMapBank` 提交仓储、槽位、宠物或钱包的当前版本。关闭调用 `replyMapDialog`。

**事实**。 `legacy-game-trade.mjs` 投影候选、双方物品、宠物、技能和金币。 `onTrade` 将动作、窗口与显示版本，以及选中槽位的修订号交给宿主。提交使用共享 `actOnPlayerTrade`。适配器在更新投影时清除已消费的文本字节副本。

[适配目录](../adapters/wechat/README.md#stage226-wechat-storage-trade) · [格式与编码](resource-formats.md#stage226-wechat-storage-trade)

<a id="stage225-wechat-map-services"></a>

## stage225 微信治疗与技能窗口接口

**事实**。 `legacy-game-map-services.mjs` 从 `client.copyMapDialog()` 取当前治疗或训练模型，生成 `sceneService` 显示数据。同一窗口同步余额、容量与名单失效状态，重新打开的窗口使用新的修订号。

**事实**。 `services.wxml` 通过 `onService` 将动作、修订号和选择编号传给宿主 `serviceAction`。选择可直接回复或先进入本地确认。确认、返回选择和退出由同一窗口管理。技能师范的关闭调用 `dismissMapDialog`，治疗和宠物窗口依共享规则调用 `replyMapDialog`。

**事实**。Page 接收已解码的标题、说明、选项、余额、容量、状态与确认文字。适配层解码后清除各模型的文本字节副本。

**设计依据**。OS-D7 复用共享 `replyMapDialog`、`copyMapDialog` 和收包入口。由窗口所有者持有线路活动模式、页面模式与等待中的窗口。适配器从共享状态投影等待和就地更新，页面修订继续用于拒绝过期的本地操作。现有核心发送后会清页面，接线和 OS-A24 继续待实施。 [共享状态规格](game-static.md#legacy-pet-training-wait-owner)

[适配目录](../adapters/wechat/README.md#stage225-wechat-map-services) · [格式与编码](resource-formats.md#stage225-wechat-map-services)

<a id="stage224-wechat-inventory-shop"></a>

## stage224 微信物品和商店操作接口

**事实**。 `inventoryAction` 按槽位和版本管理选择，调用已有使用、定向使用、丢弃和移动接口。页面显示 8 个装备槽及 20 个背包槽。新回包使当前选择失效时，页面提示重新选择。

**事实**。 `shopAction` 以窗口修订号隔离草稿，支持填数量、选服务、核对、确认和离开。确认时再校验共享报价。 `weChatMapDialog` 复用已有 NPC 选择接口处理商人与兑换员。

**事实**。Page 的数据是显示用名称、描述、数量、余额、修订号和语义操作。物品与窗口的文本副本解码后释放。

[适配目录](../adapters/wechat/README.md#stage224-wechat-inventory-shop) · [资源和文本](resource-formats.md#stage224-wechat-inventory-shop)

<a id="stage223-wechat-creation"></a>

## stage223 微信建角表单端口

**事实**。角色视图提供槽位、是否有角色与是否可以建角。 `character('create', slot)` 进入既有共享建角状态。 `creation(action, value)` 转发外观、点数、返回和确认等操作。 `review` 编码输入名称后检查草稿， `confirm` 等待当次请求的结果。

**事实**。建角视图按外观、详情、确认、等待与错误阶段投影。Page 只持有可显示的名称文本、编号和点数。编码和读取产生的临时字节副本在适配层清空，共享草稿和会话管理自己的材料。

[微信适配](../adapters/wechat/README.md#stage223-wechat-creation) · [协议](logic-protocol-spec.md#stage223-wechat-creation)

<a id="stage222-wechat-page"></a>

## stage222 微信页面和游戏适配端口

**事实**。`createWeChatLegacyGameHost` 接收 `wx`、游戏连接配置、视图回调及可选独立资源副本。页面通过 `bindCanvas`、材料选择、连接、触控、角色、地图和战斗操作调用宿主。对话以修订号区分当前窗口，触控按主触点和画布显示尺寸映射。

**事实**。`readWeChatGameStartup` 验证启动结构，`ownWeChatGameResources` 接管文件字节并提供有界 `stat` 与 `read`，读取返回独立副本。Page 的 `setData` 接收状态、文本、选择项与语义操作视图。启动字节、网络帧和认证材料由会话侧持有。

**事实**。普通 Canvas 宿主可由调用方接管指针事件，文字栅格化可使用注入的离屏 Canvas。微信地图历史展示最近 24 条收到的记录。

[适配说明](../adapters/wechat/README.md#stage222-wechat-page) · [资源格式](resource-formats.md#stage222-wechat-page)

<a id="stage221"></a>

<a id="stage221-chat-presentation"></a>

## stage221 黑名单和地图聊天帧接口

**事实**。setMapChatBlockedName(bytes, enabled) 接收 1 至 16 字节的完整姓名并返回是否有变更。copyMapChatBlockedNames() 返回独立副本。上限 100，重复添加和移除不存在项返回无变更。

**事实**。普通帧在有内容时返回 mapChatPresentation，包含气泡位置、颜色、字号、文字行和两类公告的独立位置及进度。会话状态只公开黑名单版本和数量。接收时钟用来计算一秒气泡寿命。

**事实**。网页以当前浏览器来源和目标地址端口隔离名单。存储读取失败时从空名单开始，保存失败时显示会话内已更新。断开清除内存聊天与画面，下一次连接再读取已保存名单。

[本轮计划](../analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-chat"></a>

### 前序检查点 · 地图聊天的发送、设置和记录接口

**事实**。sendMapChat(bytes, options) 接收已编码的单行文字、颜色、范围及字号。setPartyChat(enabled) 复用收到的设置字和普通队伍上下文，只切换位 8。两者沿用正常游戏会话。

**事实**。copyMapChat() 返回有序的独立副本。inspect() 仅公开版本、计数及频道设置标志。历史与发送时间在会话结束时清理。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 家族邀请与成员操作接口

**事实**。copyFamily() 提供 canInvite，成员附带 canAssignRole、canRemove 和 self。actOnFamily(revision, action) 支持 invite、assign-role 和 remove-member，后两项带 memberId，分配另带 slot。发送前重新核对修订、会话、目标和权限。

**事实**。邀请沿用普通输入和快捷操作时钟。分配和移除沿用家族等待状态。分配等同成员的目标称号，移除等该成员消失，两者都可随匹配的家族重置而结束。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 家族状态和编辑接口

**事实**。copyFamily() 返回资料、角色、成员记录、修订号、管理资格和等待状态。actOnFamily(revision, action) 提交 name、hall 或 role。role 传槽位和五位权限掩码，省略名称时沿用原始称号字节。接口沿用普通游戏会话和命令发送器。

**事实**。等待期间拒绝再次提交。相应的资料字段或同槽称号更新解除等待。独立的名单更新照常应用，异步更新继续使用收到的资料。已知家族 ID 切换时清理资料、名单和角色投影。Y&3 未选中的家族兽权限保持原值。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 家族兽窗口所有者与操作入口

**事实**。copyMapDialog() 的 familyPet 提供标题、正文、当前可喂食及可改名权限和等待状态。actOnMapFamilyPet(revision, action) 接受背包槽位及槽修订，或已编码名称。

**事实**。同一 NPC 的新信息修订替换当前显示，回复仍使用初次打开序号。喂食等待相关背包槽更新或新信息，改名等待新信息。饲料箱沿用 actOnMapBank，只开放物品操作，关闭仍经普通对话入口。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 仓储对话状态和操作入口

**事实**。copyMapDialog() 提供 bank 的槽位、余额、修订号及待更新状态。会话 actOnMapBank(revision, action) 使用现有坐标和窗口，校验仓储修订、背包槽修订或宠物名单版本，以及金币操作的持有金额。

**事实**。成功提交等待对应仓储槽位、余额或 A 快照更新。玩家背包、携带宠物和钱包仍分别读取入站状态。用户离开仓储走普通对话回复并发送 C。服务端关闭匹配当前模式和 NPC 时，适配层转发同一关闭回复一次。

[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 地图专用窗口的共享输入和状态

**事实**。copyMapDialog() 返回交接 npcService、双项输入的 inputCount 和 inputByteLimit、外观草稿或图文的 graphicReply 和 illustration。旧单项输入的 API 维持单个字节数组。

**事实**。双项的 replyMapDialog(revision, button, null, text) 接收两个 Uint8Array。确认失败保留同一对话。外观使用按钮 0 和描述符控件序号编辑草稿，按钮 1 确认。过期窗口和不可见控件不能发送回复。

**事实**。外观起点从 F8% 字段 16 及已配置版本读取，组合只保存在地图对话拥有者中。确认仍等待入站权威状态更新。图文的编号来自窗口记录。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 宠物师范接口与失效规则

**事实**。copyMapDialog() 返回 petTraining 及步骤、原选择、报价和所选宠物资料。回复仍通过 replyMapDialog(revision, button, choice)，文本字段为独立副本。

**事实**。已选择的报价和宠物只在同一 NPC 的后继步骤有效。选宠期间的占用记录变化或选栏期间的相关技能身份变化会使旧选择失效，重复的技能记录和普通数值刷新可继续操作。

**事实**。金币、宠物资料和技能更新沿用 E(9、FBY、G:w、J_J 所有者。出站动作只提交选择，收到记录后更新状态。

固定 SE 的第二套窗沿同一份宠物资料保留物理槽顺序、存在计数与选中行的读取时点。资料页在箭头后取槽，加点页在箭头前取槽。报价提交用当时页号算全局行，再沿现有 `/1I` 组包。经典报价复用现有选择版本和课目，等待与替换沿 OS-D7。窗口及输入按 PS-A01 至 PS-A05 验收。 [宠物资料](game-static.md#fixed-se-pet-count-selection) · [报价取值和替换](game-static.md#fixed-se-training-quote-pages)

人物技能遗忘继续使用现有经典回复入口。第二套窗的索引规则由同一帧的命中结果和背包说明状态输入，限已核适用的窗口。Item 报价生产者在提交打开请求前发布页号、页数和行资料。 [接口条件与用例](game-static.md#historical-forget-return)

[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · 商店入口和师范接口

**事实**。copyMapDialog() 为五种服务返回 npcService，含窗口类型、标题、提示、图形资源号和回复选项。学习补充技能名、说明、栏位数和费用。遗忘补充原编号、技能槽位、名称及两个源数值。返回的文本是独立字节副本。

**事实**。replyMapDialog 继续使用活动窗口修订号与按钮 0。遗忘确认会再次核对 J<= 的占用技能记录，记录改变时返回 LEGACY_GAME_SKILL_LIST_STALE，返回按钮仍可用。收到相同技能记录可继续操作。

**事实**。skillUsed、skillCapacity 和 gold 来自共享拥有者。按有符号单字节累加技能占用栏位，容量由 F8% field-17 提供，金币由 E(9 field-27 提供。发送请求后由入站记录更新资料。

[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · 治疗和图文对话接口

**事实**。copyMapDialog() 对治疗返回原始选项、等级、伤势档位、费用、金币与总价。replyMapDialog 仍按活动窗口修订号处理，传入原选项或取消按钮。普通金币更新无需重建治疗选项。

**事实**。有图文时复制结果含 illustration 的窗口尺寸和资源、朝向、坐标。createLegacyGameMapDialogGraphics 按场景呈现步推进静态或空闲动画的绘制计划，复用已加载的资源目录。网页随对话关闭解除 Canvas 绑定及清除像素。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 玩家交易的状态与操作接口

**事实**。copyPlayerTrade() 返回候选、报价或结束状态的独立副本。报价包含双方阶段、对方物品与宠物、自有可报价槽、持有金币和 offerStale。结束返回原始 resultCode。

**事实**。actOnPlayerTrade(action, revision, value) 接受 request、select、publish、withdraw、confirm 与 close。发布使用物品和宠物的 {slot, revision} 数组与金币。选人和报价操作核对当前交易版本，物品按槽版本、宠物按名册版本复核。

**事实**。网页在任一宠物名册变更后要求重新选定宠物。物品失效时移除对应旧选择，保留其他有效选择。提交使用按勾选顺序连续排列的报价位置。

[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 留言板的拥有者与版本接口

**事实**。copyMapDialog() 返回 board.title 和 board.entries 的独立字节副本。每条记录保留 row、graphicResource、timestamp、canDelete、name 和 lines。空白占位不会改动后续 row。

**事实**。replyMapDialog 检查当前版本。发布用按钮 1 和编码后的字节，删除用按钮 0x40 和原行号，翻页受当前 buttons 限制。dismissMapDialog 负责本地关闭。

[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 单项给予的报价接口

**事实**。copyMapDialog() 返回 direction 为 conversion、单个数量行及 shop.conversion。该对象暴露 variant、itemCode、countLimit、quotaLimit、quotaCount 和按当前状态计算的 held。数量行提供 maximum 和不可用原因。

**事实**。quoteMapShop 计算折算值，submitMapShop 提交前重查持有物品和金币。关闭仍通过 replyMapDialog 的按钮 2。选择和核价阶段没有发包。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 兑换余额与容量接口

**事实**。`copyMapDialog()` 为兑换返回 `shop.currency`，含代码、拥有的标签字节和当前余额。`copyInventory()` 暴露 `exchangeCode`，仍由入站物品记录更新。

**事实**。`quoteMapShop` 返回兑换费用、所需空格与预计付款腾出的格数。`submitMapShop` 复核最新物品快照后提交。背包变化期间保留用户选择，重新进入核价。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 服务报价和背包说明的接口

**事实**。`copyMapDialog()` 返回方向 `appraise` 或 `repair`、报价原行号、槽位、费用与说明。`quoteMapShop` 和 `submitMapShop` 沿用已有修订号和 `{row, quantity}` 参数，服务行的数量为 1。

**事实**。`copyInventory()` 为有效槽提供拥有的 `descriptionBytes` 副本。`decodeLegacyGameDescriptionText` 在 767 字节范围内使用所选编码，背包选中物品后显示说明。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-shop"></a>

### 前序检查点 · 商店快照、核价和提交接口

**事实**。`copyMapDialog()` 在商店模式返回 `shop` 视图，含金币、背包空格、商品原行号、可选数量和拥有的标题及行文本。普通文本窗口保留原先的行与按钮形状。

**事实**。`quoteMapShop(revision, selections)` 接收包含 `row` 与 `quantity` 的列表，返回按源行排序的报价、合计与所需空格。`submitMapShop(revision, selections)` 在发送前重算，成功后消费修订号并清理窗口。`replyMapDialog(revision, 2)` 发送取消。

**事实**。出售绑定开窗时的槽位修订，变动后该报价需重开。空余额、无效数量、过期报价和资金或容量不足都会在现有连接内保留窗口。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 对话状态、回复与本地关闭

**事实**。共享会话通过 `copyMapDialog()` 返回拥有的行字节副本。`world.inspect().mapDialog` 提供窗口上下文和修订号。`replyMapDialog(revision, button, choice, text)` 核对当前窗口和按钮，取本机当前逻辑坐标，提交一次回复。`dismissMapDialog(revision)` 关闭本地窗口。

**事实**。普通对话开窗时重置地图按键，窗口打开期间暂停地图输入。回复、同模式同角色的服务器关闭以及场景或会话退出会清除本地窗口和字节。输入以 254 个内层转义字节为上限。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 共享右键和网页拾取模式

**事实**。普通 `createLegacyGameRuntime` 将右键按下送给世界的 `prepareMapRightClick`。请求由 `pump().requests` 按转身、拾取顺序交给既有会话。地面匹配读活动演员的逻辑格，发送后保留地面和背包记录直至收到回包。

**事实**。网页通过 `setPickupMode(boolean)` 将主键按下和释放映射到右键，真实右键沿用既有指针入口。画布保留按下时的映射直至松开。新场景宿主默认关闭拾取模式。

[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-targets"></a>

### 前序检查点 · 物品选择和发包前核对

**事实**。`copyInventory()` 给出 `canUseOnItem` 与 `canReceiveItemUse`。`useInventoryItemOnItem` 在普通场景核对来源及目标修订号，`dropInventoryItem` 核对来源修订号和当前逻辑格。

**事实**。战斗背包通过 `weaponRemoval` 返回武器数、空位数、不可用原因和库存修订号。`chooseBattleCommand` 的 `weapon-remove` 路径在排队和提交时核对修订。所有槽位变化仍由 `?l)` 和 `@Y)` 提交。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-items"></a>

### 前序检查点 · 普通和战斗共用物品槽

**事实**。`copyInventory()` 返回 28 个槽的副本，包含装备区标记、存在状态、修订号、名称字节、数量和直接使用资格。空槽也拥有修订号。

**事实**。`useInventoryItem` 接受槽号和修订号，`moveInventoryItem` 接受来源槽及修订号、目标槽及修订号、数量。只在未暂停的普通场景提交，使用时取当前逻辑坐标。`?l)` 和 `@Y)` 负责提交槽位变化。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-input"></a>

### 前序检查点 · 物品记录与选择所有权

**事实**。会话拥有 28 槽，跨战斗保留，断开时清理名称字节。共享输入读取物品类别、目标掩码和鉴定状态。网页用 chooseBattleItem 提交槽号与修订号。

**事实**。修改和交换都会刷新相关槽的修订号。队列中或正在选目标的旧选择在发包前重新校验。一次道具使用后的槽位变化由服务端消息提交。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-input-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-input-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-mp-items"></a>

### 前序检查点 · MP 更新与物品队列所有权

**事实**。CFP 从收到的 M 直接更新战斗本体的 MP，沿现有战斗数值事件同步消费者。ITM0 在准备阶段核对目标和数字图形，再写入使用者和目标队列。

**事实**。使用者动作 69 启动目标队列，现有子对象回调驱动回复和后续数字反馈。ITM7 复用角色动画播放器。服务器退出沿现有回收路径清理队列和 22 个槽位。

[本轮计划](../analysis/game-battle-shared-storage-v1/mp-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/mp-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-transitions"></a>

### 前序检查点 · 变身及退场状态的所有者

**事实**。战斗本体队列写入 REB 四元组，状态 158 共用元素过渡回调和子对象。元素序号与所需图形资源在入队前核验。

**事实**。PLV 退场目标由本体持有，12 和 13 消费，49 通过原有角色删除事件同步战斗列表。正常退出和服务器中断均使用现有清理路径，归还 22 个槽位。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-transitions-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-transitions-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-friend-roster"></a>

### 前序检查点 · 名单状态与动作拥有者

**事实**。world 持有 320 行会话名单。inspect 的 battleFriends 返回版本与活动行数。B8S 的正文供内部名称匹配，替换、删除或关闭时释放该行字节。

**事实**。战斗的 C 与 MON 路径复用匹配谓词。会话仅为已认证的 @t- 自动发送明细请求，分批保留顺序。普通调用仍沿原有选角门控。

[本轮计划](../analysis/game-battle-shared-storage-v1/friend-roster-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/friend-roster-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-effects"></a>

### 前序检查点 · 聊天快照、计时拥有者和清理回执

**事实**。copyBattleChat 返回带槽位、频道、样式和独立文本字节的快照。inspect 的 battle.sideEffects 提供聊天版本号及接收后的计时值。构建器可提供收包时钟，客户端复用同一个注入时钟处理播放。

**事实**。prepareExit 先收集可补处理的记录，阶段 7 返回聊天、时间和提示音计数。正文保存在会话的 512 条环内，网页采用 textContent 展示。正常战斗回调提供图标与字形，独立原生音频待接入。

[本轮计划](../analysis/game-battle-shared-storage-v1/side-effects-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/side-effects-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 队列和绘制接口

**事实**。planBattleCasting 输出 401 队列和逐目标记录，command-casting 经源 phase2 等待。207 复用现有影响对象与动画清理，206 只接入已证实的 type 1 模式。

**事实**。播放快照持有雨滴模式、方向和位置。雨滴绘制计划与地面、角色及文字按优先级合成，资源库使用当前调色板准备一次四像素图元。正常地图帧复用同一图元。

[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 共用施法接口

**事实**。planBattleCasting 提供主动作、目标动作和三类元组。command-casting 的 400 类进入源 phase2 的共用等待。播放重用全局 CRT、资源验证、动作 29、50、49、244 和退出所有者。

**事实**。播完的远端目标及其成对对象向战斗名单发出 battle-motion-body-removed。浏览器页面和生成包都验证实际名单结果。

[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL402 共享接口与边界

**事实**。planBattleCasting 支持 402，保留 sideTargets、施法队列与各目标的单条动作队列。command-casting 返回参与者，走 phase2 的共用完成条件。

**事实**。播放前检查咏唱、目标几何和固定效果资源。播放所有者通过 212 创建带父对象的效果，经 157 等待完成。复用战斗入口清理，四套构建继续共享接口。

[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · SKL405 元组、链接对象及背景接口

**事实**。planBattleCasting 接收 405 类，输出 [24,53,38,135,62] 与三个目标元组。回执仍通过 command-casting；正费用走动作 53。

**事实**。动作 135 使用现有骑乘和附件所有者。播放快照在发布后提供可选 backgroundResource，帧控制器以该值覆盖接收的背景资源。新战斗或关闭时释放派生对象。

### GMN 呈现与前序字段

**事实**。queueGMN 和 queueSkill404 消费解码器拥有的动作记录，并通过现有管理器等待和释放。battle-skill404-registered 提供登记顺序、名称、资源和生命值副本，battle-motion-body-removed 清理角色栏。

**事实**。播放快照以 gmnPaletteRequest 和 gmnWindowSubmissions 交付请求。战斗帧的 gmnPalette 暴露目标、步数、版本和资源可用性，gmnWindow 暴露图元、文字行及缺失资源。可选 drawPlan.palette 是 768 个 RGB 字节与 3 个色阶字节的快照。

**事实**。drawPlan 的 blackRectangle 复用实心绘制路径，类型 4 窗口图片使用裁剪命令，文字使用优先级 216 的批次。rasterText 仍由宿主提供，网页 0 号和 1 号字体分别采用 18 和 14 像素，缓存以字体和名称字节区分。

[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：合击执行与拥有状态

**事实**：新增planBattleCombination、queueCombination、copyCombination、resetCombinationCounter、activateNextCombination、releaseCombination；准备前完整核验字段、所需资源与容量。实际commands消费opcode8；copyPlayback暴露拥有的combination上下文与横幅整数盒快照。附带RID包装转发controlFlags，隐藏横幅和单人流程不依赖其图元。

**事实**：70与14更新实际所属命令计数器，125/126/127创建原结果光效后立即pop；不是119/120/121的157等待。最后E000保留4349e0写出的当前动作-1和原等待恢复。RID3仍插入两条元数据和原元组，附带RID0继续走4236d0/221的当前元组与注册槽位交接。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](../analysis/game-battle-combination-v1/source-check.json)、[源修正](../analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-combination-v1/test-results.json)、[验收边界](../analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](../analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](../analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：RID私有准备上下文

**事实**：实际解码命令通过私有WeakMap持有主字段结束位置和RID字段。既有queuePhysicalFamily/queueCasting/queueStatusSkill/queueSkill82/queueNumericSkill/queueStrike组合准备与容量核验，复制的命令不能伪造上下文；copyPlayback附加逻辑registry、交接与全部池内身体快照，名称字节为拥有副本。API包装不代表所有后续共用指针消费者已实现。

**事实**：新独立方程覆盖53场景、13,799帧状态、完整拥有存储及1,098帧RGBA；50条身体结算，same-a-multiple有界等待，same-a-b子对象移除与element159两条显式消费者边界分别保留。缺少骑手、当前槽位上下文及未覆盖角色标记原子拒绝；135等共用105c指针分支显式停止，未借独立chant/projectile映射伪造原生共享指针。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](../analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](../analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](../analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](../analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](../analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：73计划与私有前瞻上下文

**事实**：复用现有planBattlePhysicalFamily与queuePhysicalFamily，公开签名不变，未新增平台模块。内部沿用buildPhysicalGuardPairs，为真实解码的73命令扩展私有数值尾部；不向调用方暴露或构造伪造上下文。

**事实**：73初始分派selector7指向4294ac，variant0调用424310后以434a70重启主身体；完成分派selector6指向42912e，434b90(command,0)等待后，仅对仍存在且非死亡的599ba4主身体调用419f60，再释放命令。436c20前瞻只跳amount和RID三字，不跳后续guard；实际解码73命令私有持有原始数值尾部，只有真正NUL才反复返回0。复制命令缺少必要上下文时原子拒绝，不补写或归一化协议。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair73-v1/source-check.json)、[源修正](../analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair73-v1/test-results.json)、[验收边界](../analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：260计划与动作模块

**事实**：按固定37c4样本的424310与40a120接入260首对生产者、201/203移动朝向、204第二目标和14主命中，十个等级、守护、RID、普通后续记录及255结束标记均有独立证据。204在dead*14+24帧处理第二目标，先保存原攻击者再替换父关联；主攻击1af89朝向0，原攻击者仍为260/9时连击朝向1。202单独验证为“元组slot与flags坐标”，不是amount；260生产者并不发出202。

内部新增legacy-game-battle-chain-plan.mjs与legacy-game-battle-chain-playback.mjs。公开函数签名不改；原解码命令私有持有数值尾部，复制命令不伪造源上下文。

**事实**：435000前置计数先读连击再读主守护，424310运行生产者先读主守护再读连击，未发现归一化。4,608条原字段样例保持4,368条准备与240条边界拒绝，928条260运行记录闭合，336条保留角色顺序差异。解析字段顺序未改。为原始解码260命令私有保存数值尾部，436bb0在真正NUL才反复返回0；255后仍可前瞻下一条原始命令。复制命令缺少该上下文时明确拒绝。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](../analysis/game-battle-chain260-v1/source-check.json)、[源修正](../analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-chain260-v1/test-results.json)、[验收边界](../analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](../analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](../analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：105生产者和独立动作模块

**事实**：固定37c4旧样本的105首条pair/variant0及真实156/97/98已接入shared，保留前置蓄力、残影、速度25、逐次动画反应和声音，再由14统一结算HP/RID。游标属于同一客户端播放所有者，在两个施术者之间共享；自身反应中断后保留1，清理身体后下一次从动作8继续，完成时才按源重置。既有正变体105路径保持。

新内部模块legacy-game-battle-sequence-playback.mjs实现156/97/98；copyPlayback仅在使用后附带physicalSequence.cursor，无外部游标设置接口，普通身体清理不重置该状态。

**事实／范围**：原200字节观察不足以判断105高等级。REA扩展读取533940处512原字节，其中533968起472字节作为已观察窗口；十等级从零游标出发首次负值偏移依次9、10、163、143、123、103、83、63、43、23。高等级会读到相邻数据37/115/32及533a33的-126，缺少该动作时4fd5f0返回1。没有恢复出472字节的声明类型，不能把相邻数据叫作完整动画表；原生间接写入、整个进程生命周期和超出已观察窗口仍未验证，越界明确报LEGACY_BATTLE_SEQUENCE_CONTEXT。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-context-v1/source-check.json)、[源修正](../analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-context-v1/test-results.json)、[验收边界](../analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：94/257/262生产与真实动作接口

**事实**：固定37c4旧样本的94、257、262首条pair/variant0队列及真实消费者已接入shared。94使用额外104c标量、78声音与96前置动画，再由14按字面优先级分派条件和HP；257/262保留73/74、最高级tile2/3、额外效果及262的205冲刺和1af89朝向1。护卫、RID旧第四字、E000、别名自身与普通后续记录分别核对。0x106=262、0x10a=266的先前纠错保持；本轮没有新增平台专用功能。

**待验证**：105高等级动画表没有已观察到的负终止标记，共享58fac0游标的真实上下文未明；260主护卫与串联字段在435000前置解析和424310生产者间顺序不同。两类继续拒绝为未接入，不改已证前置解析；配对73关联路径及此前113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB仍未完整闭合。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](../analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](../analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：266修正与五类保留接口边界

**事实／纠错**：原424310的`0x106`是262，`0x10a`才是266。旧实现和独立模型曾把262的205冲刺、最高等级73/74套给266；本轮修正shared的配对生产者及护卫路径，266恢复普通9接近。此前stage209相关“266/205”结论已被新证据纠正；正变体和自身266的独立规则继续区分。其余五类特殊pair并未因此启用。

**事实／边界**：105使用533968处按等级步长20的有符号动画表与共享58fac0游标；已核200字节只有前两行带负终止标记，后八行全0，不能推定高等级正常完成。260带主护卫的串联字段在435000前置解析与424310实际生产者之间顺序不同。4608个原创字段流对照中，实际shared解析准备4368个、240个触发跨平台边界拒绝；4128个在两个源读取器都完整，336个已准备流呈现不同字段角色顺序。未把这些静态方程当作游戏执行或修改已证前置解析。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](../analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：真实置零、冻结与声音事件

**事实**：92复制目标float坐标，角度减180并单次归一，speed50移动一次后朝向目标。93只在counter0执行一次动作3动画，speed6移动16次，第17次结束并把目标HP设为0；执行到该分支时不按收到的amount扣血，也不被108/E000/RID直接改成通用伤害/治疗。临时零值盒只消耗一次rand，已与背景另外两次RNG区分验证。95/94写目标2d4冻结位；78/79/80分别发出62/210/133声音事件，消息为5783。

queuePhysicalFamily仍以同一M字段接收96 pair并返回有序只读计划；scriptSound/scriptAuxSound只作源内部101c/1020值，不新增网络字段。容量、实际5783消息资源在写入前检查，未使用的伤害数字不要求存在。

**事实**：96默认后端的4160组队列、80条轨迹、32959帧状态、11836帧双selector完整RGBA与实际共享核心一致。另两条替代渲染轨迹的927状态/578像素/50样式观察仅为独立源方程；实际公开配置仍报LEGACY_BATTLE_SKILL_CONFIGURATION，未放宽门禁、未计入运行或像素通过。当前仍无替代渲染/半透明后端的完整实现。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special96-v1/source-check.json)、[源修正](../analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special96-v1/test-results.json)、[验收边界](../analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：嵌套队列、结果及原子性

**事实**：232先移动并按距离/计数处理命中，HP位优先为108跳过正常处理、8000不改HP、4000治疗目标、2000反射伤害攻击者、普通伤害目标；全部先signed32运算再按源钳位。普通零值仅显示573b/57bb；反射会先弹自己与目标动作，组合位可在计数后重处理外层tuple。5实际移动16次，第17次才结束。未知嵌套RID旧存储上下文在写入前明确拒绝。

planBattlePhysicalFamily继续返回只读有序动作/tuple/assignments；新增scriptSound仅在源79脚本需要时赋值。嵌套RID未知上下文、容量、数字与消息资源都在写入前检查。

**事实**：原435000只给72读取嵌套记录，且不把嵌套目标本身标成依赖（护卫会标记）；424310运行时同时处理72/113。保留原解析边界：113嵌套的4480组队列/104条轨迹仅为运行时命令夹具；可经真实前置解析的部分为4640组队列/157条轨迹。真实TCP/页面只验证72嵌套及113无嵌套，不将113嵌套标成协议兼容。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](../analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：queuePhysicalFamily与双记录216

**事实**：216先消费攻击者记录，再消费自身/护卫结果记录与可选RID，随后推进动作与tuple游标。8000跳过HP、4000对HP作signed32加法并仅按maxHP上限截断、2000抑制数值；108与flags3不阻止该结果。非零治疗即使有10000000仍显示style5，只有零治疗改57bb；伤害有10000000时改57bb，否则含零也用style6。自身RID仅保存首字，后两字来自最后一条非自身RID；缺少此前可确定的RID尾部时提交前拒绝，不猜默认值。

内部applyBodyMetadata(node,ownerSlot=node.body.slot)保留默认调用；216显式传首条tuple命名的攻击者。容量、实际数字/消息资源与自身RID前序上下文均在写入前检验；忽略的scalar不要求5748。self-only拒绝原因是empty-after-self，不再泛称266生产者未实现。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-self-physical-v1/source-check.json)、[源修正](../analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：正变体结果、资源前检与父生命周期

**事实**：正变体结果与直接body14不同。body16/21在8000跳过HP、4000对实际目标HP做signed32加法并仅按maxHP上限截断、2000只抑制数值并释放目标，不在该回调扣攻击者HP；class6正变体也使用HP而非MP。RID仍独立按2000位写真实principal身体，不能写匿名投射物。单弹掩码为7e000/48000/24000/12000，多目标为e000/8000/4000/2000；skip→heal→suppress有先后。6000组合仍显示style5治疗数字；单弹30000与多目标30000保留各自源行为。

queuePhysicalFamily先校验实际使用的style5/6或57bb/57b6，skip/suppress不再要求不会显示的glyph；缺实际glyph/动作容量时写入前拒绝。结果目标标记为physicalFamily以接入119/120/121与157，旧效果不能通过slot复用写入新身体。

**待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](../analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](../analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：结果归属、充能完成与字段分离

body14值归属：8000不改HP；4000给实际目标HP做signed32加法后仅按maxHP上限截断；2000对攻击者HP做signed32减法后下限0。class6在8000/4000仍扣实际目标MP，在2000扣攻击者MP。84/85/87在E000同样参与HP；不能套用普通分支的HP排除规则。RID按2000位写攻击者，护卫则保留三角色与原生3字tuple旧第四格。反射弹出双方动作并推进攻击者tuple，后续cooldown重新读取新tuple。

119/120/121分别构造1ae1d/1ae25/1ae2d，复制世界坐标加trunc(drawOffsetY/2)，不跟随且不初次animate；actual41b640在有效父对象状态1时完成为2，157清自身冻结/状态。删除父对象并复用slot后，旧效果不能写入新身体。CMBtype8的command-owner阶段写入未实现，不能把106c命令指针当保存坐标；本轮只覆盖已支持SKL type0计划。

新增模块仅内部依赖，不增加平台全局。queuePhysicalFamily仍先校验producer、所需glyph/resource、owned tuple上下文与容量，失败前不改身体。

**待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。

[需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-results-v1/source-check.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：triplet、RID与冻结接口

436c20复制owner payload+64到栈上局部游标，只扫描连续0x1010记录，首条不匹配即停止，不改变主游标；跳过amount和可选3字RID，不额外跳过guard标量。434a90只写3格、保留旧第四格；436e60追加RID后复制之前的完整raw tuple，禁止清零或改复制来源。

planBattlePhysicalFamily的guard+RID计划需要get(slot)返回实际tupleWrite与800格tuples，用于复制旧第四格；缺失返回physical-family-tuple-storage-context。guard缺5748或角色不存在、容量溢出时，动作/tuple写入前拒绝。普通旧路径契约保持。

113先Action5/animate1，再构造(parent,-32,type0/3,filter0,parentlink1)，1000位选择1ae49，否则1adb9；效果复制世界坐标且不跟随，无初次animate。父状态1→2由实际效果完成回调产生，157清自身冻结并弹出。护卫蓄力的被保护者可能保留frozen=1直到队列重置，当前按原始脚本保留并验证nextC/reset，不擅自解除。

**待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：瞬时图、平铺、计数与tuple所有权

**事实**：固定37c4样本的258类variant1/3已接入71b1（最高等级71b2）瞬时叠图，variant2保留无叠图分支；258/259/266正变体最高等级240平铺前缀、259最高等级直接路径及命中平铺进入shared核心。瞬时图复制当次世界坐标，不跟随父节点。

41f5b0的pulse序列为1..15、14..0、1..，不重复端点；每次先提交10×10格点（X外层）再判断counter>=limit，最后仍加1。duration15实际提交16批；被标删除节点若遇慢放门控可暂留，但门控期间不重复提交。新的directSubmissions共用有序绘制队列，不以开启casting背景状态替代平铺。

整数盒子限值与计数器按limit→counter顺序构造，构造各调用rand一次；getter第21次读重置读次数并更换掩码，decoded值不变。比较先读参数limit、再读ECX counter，SETGE有符号；403410读、加1、写回，参数0不代表清零。只声明本地可观察调用顺序，未声明全局对象池和RNG已一致。

259直接路径最高等级保留原始结果A，动作72只跳过这一条raw tuple，240消耗平铺tuple，随后14读取重新追加的C；RID元数据位于C之后，不能由72提前跳过。正变体最高等级前缀selector分别258→3、259→5、266→0，命中259另创建selector0。

**待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。

[需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：probe、tuple和父子回收契约

**事实**：基于固定37c4样本，实现25个generic选择器及独立73类的有限variant1/2/3发射路径：真实动画probe、单弹、多目标回收、连续发射和28反应；73不使用generic耗蓝前缀。95/105/110前缀与6/84/85/87的正变体HP结果保留各自源规则。公共消息工厂改为当次世界浮点坐标，修复95移动后仍取旧屏幕缓存的问题。

15按真实action7信号探测，失败退回5；18按action5信号逐条发射。多目标20/21/22拥有复制tuple、转向与父41/23结束。父payload fd0是probe/impact cooldown，和body2d4动画冻结分开；静态箭头依fd0暂停。相关私有physical快照用于状态核验，不替代原生调度。

**待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。

[需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：reactionPuff与动画重绑定契约

**事实**：本轮依据固定37c4样本的41f310/41f2d0，修正公共26/160反应烟雾：使用身体当次移动前世界坐标、无父链接、不消耗模型随机数；12/13逃跑烟雾沿用独立随机工厂。没有新增正变体或特殊技能可用范围。

内部reactionPuff(node)按身体位置构造puff，drawPriority204，普通flags68000/替代160000；其screen取trunc(world)，不叠加body screenOffset。真实body/API回归覆盖26/160/12及非零offset，关闭全部owner。probe现有invalidate()+clearSignal()对应lastAction/signal重置；frame-reset语义另行保留。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：新增公共物理计划与播放接口

新增导出`LEGACY_GAME_BATTLE_PHYSICAL_FAMILY_PROFILE`、`planBattlePhysicalFamily(command,get,localSlot,resourceCode)`，计划携带principal/category/level/variant/hits/rows。身体拥有者新增`queuePhysicalFamily`，统一先验证capability和全部队列容量，再提交。无效记录或未实现消费者返回`physical-family-unavailable`；图形未配置在提交前报告。

已接入20类的有限pair/variant0直接结果（259的level9除外），保留29类选择器；MP6、84/85/87不扣HP、首击/后续actor、状态/RID、81额外回复、258移动和真实等待/结束拥有者分别处理。旧`planBattleStrike`/`queueStrike`仍是0/1/3有限接口，实际游戏公共族命令走新`queuePhysicalFamily`。

未新增平台依赖；strike仅内部开放message、casting仅内部开放physicalExtraImpact、status仅内部开放condition用于复用现有拥有者。完整族/游戏标志仍false。

正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：原生辅助接口来源已厘清，尚未新增API

本轮没有新增shared导出或调用接口。当前planBattleStrike仍仅支持0/1/3、variant0及有限结果掩码；来源分析不改变这一实现范围。

**事实**：原生41a550调用契约为(parent,originX,originY,targetX,targetY,resource)，目标两坐标取整后传419dd0；Ghidra C未展示参数用途时以ESP/x87原指令为准。419bd0读取有符号AL，不能把上位x87状态位当返回值。41a280真实动画信号探测、41a8c0/41ab20元组/RID复制及41a4e0父生命周期将分别成为消费者契约。

本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](../analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](../analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：SKL82接口与内部元组交接

`LEGACY_GAME_BATTLE_SKILL82_PROFILE`及`planBattleSkill82(command,get,localSlot,resourceCode)`公开固定样本82切面；只读计划含principal/level/cost/ignoredWord/hits/rows，rows持actions/tuples/assignments。midpoints为[[188,203],[449,336]]，完整技能/游戏标志仍false。

身体新增`queueSkill82`，在描述符/整数/角色/数字资源/动作及元组容量验证后统一提交；命令以phase1等实际身体结束。内部casting新增身体metadata入口，复用RID游标、消息/反馈及背景震动状态；8/6允许82与83，133/193/88仍限定类别83。

高层独立attachedRID尚不支持；记录内800000三资源已实际接入。空目标返回`skill82-empty-target-runtime-unobserved`，资源上下文缺失等在修改前拒绝。82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](../analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](../analysis/game-battle-skill82-v1/source-check.json)、[验证修正](../analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-skill82-v1/test-results.json)、[TCP](../analysis/game-battle-skill82-v1/network-validation.json)、[页面](../analysis/game-battle-skill82-v1/browser-validation.json)、[验收](../analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](../analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](../analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：83计划、移动播放与残影接口

`planBattleNumericSkill(command,get,localSlot)`现在覆盖61/62/63/83。83要求有效localSlot，返回chantResource=null并赋rememberedPosition=[318,270]；非本地未证反射在修改前返回`moving-numeric-removed-caster-reflection-runtime-unobserved`。旧61..63保持真实137目标推进，83的137只推进自身。

`LEGACY_GAME_BATTLE_MOVING_NUMERIC_PROFILE`公开classCode83、midpoint、afterImageVisits12，completeSKL/completeBattleGameplay仍false。内部moving播放器由现有身体/效果调度，afterBody接收本次回调前screen；身体新增afterImageEnabled/afterImageCounter，新分配为0、resetQueues按源保留。copyPlayback复制残影scale，使用现有点缩放策略。

非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](../analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](../analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](../analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](../analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](../analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](../analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](../analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：数值技能计划和效果完成接口

`legacy-game-battle-numeric-skills.mjs`公开`LEGACY_GAME_BATTLE_NUMERIC_SKILLS_PROFILE`及`planBattleNumericSkill(command,get,localSlot)`。只读numeric-skill-plan包含category/level/principal/cost/ignoredWord/chantResource/hits/reflectors/reflectedAmount和rows；每row含actions/tuples/assignments。独立attachedRID、描述符/getter、目标、字段边界与未拥有角色依赖均在修改前明确拒绝。

身体新增`queueNumericSkill`，在全部数字资源/动作与元组容量验证后写队列；内部numeric-skills-playback持有135/146/179/137及chant/charge/overlay节点。构造17的parent是16效果，不是身体。已有154/155的style0发57bb且无生命值事件；199的style0可显示字形但不扣血，负style仍跳过。

共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](../analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](../analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](../analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](../analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：状态技能计划与播放接口

`legacy-game-battle-status-skills.mjs`导出`LEGACY_GAME_BATTLE_STATUS_SKILLS_PROFILE`、`planBattleStatusSkill(command,get,localSlot)`和`battleStatusSkillEffect(type,level)`。计划返回只读`status-skill-plan`，含category/level/self/hits/rows；每row明确reset/actions/tuples/assignments。非法描述符、目标、独立attachedRID和边界返回带reason的unavailable，不读取getter或半写队列。

内部`createBattleStatusSkillsPlayback`使用身体拥有者注入的restart/pop/节点/动画/贴图方法；restart对应434a70，保持当前动作读指针。新增`applyCharacterFlags`/`characterFlags`由真实C头调用，拥有单一field节点；已有C逐角色路径拥有800覆盖与动态位。copyState只读暴露statusSkills和每节点statusSkill计数，未配置图形不能运行新消费者。

旧115/177构造器2的8000选择器标记已按原字节修正；199的numberStyle=-1跳过数字和生命值操作。原生43 HUD副作用仍未移植，便携四生命值拥有者不被伪造备份覆盖。其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](../analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-status-skills-v1/test-results.json)、[TCP](../analysis/game-battle-status-skills-v1/network-validation.json)、[页面](../analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：施法计划、播放及状态接口

`shared/legacy-game-battle-casting.mjs`导出`LEGACY_GAME_BATTLE_CASTING_PROFILE`、`battleCastingResources(category,level)`及`planBattleCasting(command,get,localSlot,resourceCode)`；类别19..31、等级0..9。返回`casting-plan`含只读rows/tuples/assignments/reflectors，或带精确reason的`casting-unavailable`，不直接改写HP/MP。

`legacy-game-battle-casting-playback.mjs`的内部`createBattleCastingPlayback`由既有播放拥有者注入节点、动画、随机和反馈操作；`legacyGameBattleHomingAngle`保留float32及截断后的角差判断。135、137、31/32/71等身体状态、四种投射节点、100格提交、子节点和状态更新由实际回调推进。只读copyState保留casting/background状态；绘制优先级提交先完整校验，不允许半写。

协议只读普通labelCatalog值经入战捕获，不能用人为label开关替代真实接收；缺对侧好友表时发送`battle-casting-feedback-unavailable`。`casting-self-drain-cursor`在队列/MP修改前拒绝。自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[规格](../analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](../analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](../analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-casting-v1/test-results.json)、[TCP](../analysis/game-battle-casting-v1/network-validation.json)、[页面](../analysis/game-battle-casting-v1/browser-validation.json)、[验收](../analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](../analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：人物技能记录、语义意图与查询接口

新增LEGACY_GAME_PLAYER_SKILL_PROFILE、LegacyGamePlayerSkillError、createLegacyGamePlayerSkills及legacyGamePlayerSkillCost。apply(consumer,slot,bytes)支持4f0210/4f0290/4f0510；主列表消费者不使用slot。record/battleRecords/copyState返回自有字节快照、原始偏移字段、排序和接收版本。kind1主记录返回send-004f6d00请求，普通上下文当前只支持已初始化0。craftResetSlots只记录实际删除义务，不冒充工艺配方实现。

chooseBattleCommand增加skill/skill-back/skill-close；chooseBattlePlayerSkill(slot0..14)、chooseBattlePlayerSkillLevel(index0..9)沿client/protocol/battle/input进入真实主指令，不与chooseBattlePetSkill混用。copyBattleInput().playerPopup包含opening/ready/closed、mode main/levels、introCalls、mainSlot、levelIndex、targeting及接收行/当前enabled和mpCost；无外部就绪或完成 setter。当前主槽记录及等级在回调时再核本源条件。

网页宿主仅映射收到的名称/说明、按钮与目标；只读battle快照新增playerSkills。完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-player-skills-v1/source-check.json)、[测试](../analysis/game-battle-player-skills-v1/test-results.json)、[TCP](../analysis/game-battle-player-skills-v1/network-validation.json)、[页面](../analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-player-skills-v1/goal-audit.json)。


<a id="stage196"></a>

## stage196：普通换宠、MON与呈现接口

chooseBattleCommand新增pet/pet-close/pet-recall；chooseBattlePet(slot0..4)沿client/protocol/battle/input路由，检查实际phase4/state1/menu0和自有popup就绪；不同于state4的chooseBattlePetSkill/pet-wait/pet-cancel。copyBattleInput().petPopup返回opening/ready/closed、introCalls、recallEnabled及实际记录/缓存值，只读且自有。网页宿主只排队语义意图。

新增LEGACY_GAME_BATTLE_PET_TRANSITION_PROFILE/planBattlePetTransition；body.queuePetTransition仅在已配置播放/实际角色/配对busy允许时排队。copyBattleState().petCache分开保存captured/activeIndex/values。MON元数据标记metadataOrigin，body保存value1d0/四status元数据/pairedTarget。旧applyCharacter新增尾部可选value1d0，原调用保持。

createLegacyGamePresentation提供capture/canPresent/present/invalidate/inspect/close，令牌只能由本owner签发。client提供copyPresentation/canPresentBattleFrame/presentBattleFrame及普通画布presentOrdinaryFrame；低层protocol持有对应所有权。battle-frame接受独立bufferSelector，createLegacyGameBattleFrameController现从index导出。draw-plan/render接受有限非负f32 scale二元组，保留零extent与明确工作量边界。完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](../analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pet-transition-v1/source-check.json)、[测试](../analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](../analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](../analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](../analysis/game-battle-pet-transition-v1/goal-audit.json)。


<a id="stage195"></a>

## stage195：宠物载体与技能意图接口

shared导出createLegacyGamePets/LEGACY_GAME_PET_PROFILE/LegacyGamePetError。apply(consumer,slot,bytes,resourceCode)只接受4f0aa0/4f1000/4f1420；record/copyState返回独立字节，findBattlePet按原槽顺序找present+mode2，close清理。battle的applyPetRecord/copyPets持久拥有数据；copyBattleState().pets可观察接收结果。

chooseBattlePetSkill(index0..9)沿client/protocol/battle/input；客户端检查会话/暂停/渲染忙，核心检查实际state4/menu0/petStage1/接收记录/P3/身体MP。chooseBattleCommand增加pet-wait/pet-cancel；chooseBattleTarget在petStage3通过原437080掩码编码发W。copyBattleInput增加inputMode/currentSkill/petStage/rememberedPet/petIndex/actingSlot/skills。未知技能flags保留数值，未猜测语义。

完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](../analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](../analysis/game-battle-mounted-input-v1/source-check.json)、[测试](../analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](../analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](../analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](../analysis/game-battle-mounted-input-v1/goal-audit.json)。


<a id="stage194"></a>

## stage194：applyCharacterChange与真实关联节点快照

shared/index导出LEGACY_GAME_BATTLE_CHARACTER_CHANGE_PROFILE。body.applyCharacterChange(command,owner,resourceCode)严格8个i32/slot/RID与普通依赖，归一化base并立即写4值；返回character-changed/absent/unavailable。commands返回command-character-change和实际完成结果，不排装备动画。节点快照新增当前resourceId；linked callback持有parentId、固定anchor与真实alternateY。

C传入linkedResources时由真实构造器建立13b4/13b0。CBC raw rider仅在13b4已存在且非0时调用更新；最后字段不归一化，正值建/更新attachment，其余删除。drawFlagMask/Value由C设置，CBC/EQU切换资源不会擅自重算。特殊输入依赖读取当前rider所有者，拒绝后仍为battle-pending，无伪造ready。完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-character-change-v1/source-check.json)、[规格](../analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-character-change-v1/test-results.json)、[TCP](../analysis/game-battle-character-change-v1/network-validation.json)、[验收](../analysis/game-battle-character-change-v1/validation.json)、[剩余目标](../analysis/game-battle-character-change-v1/goal-audit.json)。

<a id="stage193"></a>

## stage193：POS/EQU、localSlotUpdate与本地桥时长

shared/index导出LEGACY_GAME_BATTLE_CHANGE_PROFILE。body.queuePosition(command,owner)预检两侧动作容量及普通依赖后交换实际身体slot/指针，返回fromSlot/toSlot；queueEquipment(command,owner,resourceCode)记录nextResource、resource13a8并排源66/78/64。applyCharacter(slot,statusFlags,resourceId,linkedResources,vitalValues,resource13a8)第六参数默认0，实际C传入已解析aux资源。

commands.callCallbacks新增可空localSlotUpdate：null表示未变，0是合法实际位置。entry在实际回调之后应用；battle的C派生行移动slot与nameBytes拥有权，wireSlot保留为接收来源。copyState的resourceId/nextResource/resource13a8区分当前/待用/辅助；新C继续覆盖。

createLauncherLoopbackServer新增可选lifetimeMilliseconds（省略10000，显式整数1..60000；null、非整数和越界在监听前拒绝）。现有真实超时路径仍发送BRIDGE_TIMEOUT并关闭来宾本机流/WS；本轮测试显式30000。无新网络协议字段或装备选择UI。完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-change-v1/source-check.json)、[规格](../analysis/game-battle-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-change-v1/test-results.json)、[TCP](../analysis/game-battle-change-v1/network-validation.json)、[验收](../analysis/game-battle-change-v1/validation.json)、[剩余目标](../analysis/game-battle-change-v1/goal-audit.json)。

<a id="stage192"></a>

## stage192：queueStatus与PSN当前值接口

shared/index新增导出LEGACY_GAME_BATTLE_STATUS_PROFILE；实际写入由commands调用body.queueStatus(command,owner)。planner只读取数据属性，核5个i32/slot/selector、真实C数值与已配置catalog，附RID及未知选择值返回status-unavailable；目标不存在按源完成。动作容量和实际字形预检均在队列/数值修改前。

body新增numberValue/numberStyle，现有skillLevel承载PSN等级；0/1/2对应style6/5/3。算术在154/155真实回调执行，HP或MP事件来自该结果。129/157等实际子动画完成，155进入35等60次；不会提交调用者提供的ready或重复结果。当前M/输入/退出请求格式不变。完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-status-v1/implementation-plan.json)、[源核验](../analysis/game-battle-status-v1/source-check.json)、[规格](../analysis/game-battle-status-v1/implementation-spec.json)、[测试](../analysis/game-battle-status-v1/test-results.json)、[TCP](../analysis/game-battle-status-v1/network-validation.json)、[验收](../analysis/game-battle-status-v1/validation.json)、[剩余目标](../analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：战斗呈现端口与浏览器语义控件

shared client新增copyBattleState()，返回已拥有的战斗行/环/子状态快照，供薄适配读取，避免每帧复制整张world/map；结束后拒绝读取。configureBattleViewport({width:640,height:480})只允许真实native画幅，在playing/paused/battle-pending且无未完成准备帧时设置；拒绝访问器、额外字段与未证尺寸。旧组件默认仍按自己的普通显示尺寸裁剪，普通readFrame/context不改变。

web/createLegacyGameBattleCanvasHost借用canvas/client/decodeName和clock/schedule/cancel，提供start、pump、sync、pause、command、target、inspect、close。inspect.ready/eligible从真实entry/input读出；queued只是本适配的一次待提交意图，不是native就绪位。step/presentations是已成功呈现的适配计数，不能当作全部native callback数。像素取消、同一准备帧重试、真实G单发和timer释放有实际OS TCP/I/O故障测试。

createBrowserLegacyGameClient新增chooseBattleCommand/chooseBattleTarget，所有可用性仍由source验证。game-app读取battle快照显示控件，未接技能/道具/宠物；姓名和数值不写HTML。暂停/visibility/pagehide、缺资料、未支持动作、新战斗和最终返回由相应真实拥有者处理。所有completeMain10/completeBattleGameplay/设备与官方标记仍为false。

[来源核验](../analysis/game-battle-web-v1/source-check.json)、[规格](../analysis/game-battle-web-v1/implementation-spec.json)、[测试](../analysis/game-battle-web-v1/test-results.json)、[实际页面](../analysis/game-battle-web-v1/browser-validation.json)、[位图核验](../analysis/game-battle-web-v1/canvas-browser.json)、[网络](../analysis/game-battle-web-v1/network-validation.json)、[验收](../analysis/game-battle-web-v1/validation.json)、[目标审计](../analysis/game-battle-web-v1/goal-audit.json)。

<a id="stage190"></a>

## stage190：技能目录绑定与当前战斗数值

client.configureBattleSkills()从自身library借用真实graphics目录，应在configureBattlePlayback后、入场配置前调用。底层world.configureBattleSkills({graphics})、commands/bodies.configureSkills({graphics})校验真实目录身份，拒绝访问器、额外ready字段、重复绑定与替代渲染配置；不拥有或关闭调用者目录。缺端口的旧SKL组件返回strike-graphic-ports-unconfigured，不能当动作结束。

commands.applyCharacter/bodies.applyCharacter新增第五个可选四整数vitals参数；实际battle C消费者自动传入当前/最大HP/MP。copyBattleCommands().bodies.bodies[slot].vitals是当前值，last-C行保留接收快照；下一实际C覆盖，目标筛选用当前HP。实际回调events增加battle-vital（slot、HP/MP、before/value/delta），为本地观察值，不是新协议字段。

configure后现有advanceBattleEntry自动在5/6派发普通物理SKL；command-strike后必须等待真实busy/回位，未支持分支返回具体依赖且队列不变。queueStrike对整批动作/tuple容量、glyph和只读字段边界预检；animation.clearSignal仅供实际命中消费，保留其余动画状态。completeSKL/completeBattleGameplay保持false，不能用这些接口宣称完整技能或产品输入完成。

[源证据](../analysis/game-battle-skill-v1/source-check.json)、[规格](../analysis/game-battle-skill-v1/implementation-spec.json)、[测试](../analysis/game-battle-skill-v1/test-results.json)、[TCP](../analysis/game-battle-skill-v1/network-validation.json)、[验收](../analysis/game-battle-skill-v1/validation.json)、[目标审计](../analysis/game-battle-skill-v1/goal-audit.json)。

<a id="stage189"></a>

## stage189：配置普通返回与真实帧提交

client.configureBattleReturn()不接受参数，从已有真实context/library/world绑定普通返回；应在entry/input/loop/exit配置后且main10时调用一次，copyBattleReturn()查看waitCounter/captures/readyToCommit。world.configureBattleReturn(frameRequest)校验既有完整帧上下文和640×480尺寸，拒绝额外initialized/ready字段及访问器；来源初始化值由固定正常路径推导。组件级exit.inspect().ordinaryReturn仍描述该退出组件自身未包含main9，实际返回能力以独立return拥有者为准。

继续client.advanceBattleEntry()，返回return含实际main9子状态、phaseBefore、waitCounter、render、frame、capture、fade、readyToCommit。1保留呈现，11清30次后重建捕获，2淡入，20/3普通画面。只有实际资源帧完成才由client调用world.commitBattleReturn(同一准备帧)，克隆/旧generation不能提交；之后client.runtime/readFrame恢复，旧runtime保持closed。无返回配置时原LEGACY_BATTLE_RETURN_STATE_UNAVAILABLE仍成立。

依赖缺失为LEGACY_BATTLE_RETURN_DEPENDENCY_UNAVAILABLE，保持状态可重试；渲染依赖的其他已校验错误保留具体码，不假装返回成功。内部actors.beginBattle/leaveBattle/copyReturnSource/rebuildAfterBattle及actorFrames.resetForReturn负责真实记录与本体生命周期；world.copySceneTileCenter是可在帧回调内使用的只读投影，不读取正在处理的battle快照。completeMain10/completeNativeMain9/completeBattleGameplay继续false。[源证据](../analysis/game-battle-return-v1/source-check.json)、[规格](../analysis/game-battle-return-v1/implementation-spec.json)、[测试](../analysis/game-battle-return-v1/test-results.json)、[TCP](../analysis/game-battle-return-v1/network-validation.json)、[验收](../analysis/game-battle-return-v1/validation.json)、[目标审计](../analysis/game-battle-return-v1/goal-audit.json)。

<a id="stage188"></a>

## stage188：退出数值、像素与拥有接口

新增createLegacyGameBattleExitFade(type12|14)、composeLegacyGameBattleExitFade(captured,rowPositions,type,width,height)及两个profile。数值拥有480个可见位置/速度和counter241；type14只复制479..1，type12保留配对写入顺序。输入检查长度、数值与访问器；原生DirectDraw/x87全局等价未宣称。

battle.configureExit()/copyExit()及world/client.configureBattleExit()/copyBattleExit()须在entry已配置且主状态10、尚未超过7时调用，不允许重复或未完成像素任务中配置。继续advanceBattleEntry，返回exit.cleanup/capture/fade/requests及mainStateBefore/After；copyEntry增加mainState。普通分支使用源已支持的0状态，不提供伪控制位选择14。

到9/1后LEGACY_BATTLE_RETURN_STATE_UNAVAILABLE、pending仍true；CHT/BST含原始名称命中时LEGACY_BATTLE_EXIT_DEPENDENCY_UNAVAILABLE，清理未发生。requestsPrepared只代表已准备，不等于官服接受。ordinaryProjectionCleanup/ordinaryReturn明确未实现范围，completeMain10/completeBattleGameplay继续false。[源证据](../analysis/game-battle-exit-v1/source-check.json)、[规格](../analysis/game-battle-exit-v1/implementation-spec.json)、[测试](../analysis/game-battle-exit-v1/test-results.json)、[TCP](../analysis/game-battle-exit-v1/network-validation.json)、[验收](../analysis/game-battle-exit-v1/validation.json)、[目标审计](../analysis/game-battle-exit-v1/goal-audit.json)。

<a id="stage187"></a>

## stage187：显式配置自动M调度

新增LEGACY_GAME_BATTLE_LOOP_PROFILE。battle.configureLoop()/copyLoop()，world/client.configureBattleLoop()/copyBattleLoop()提供拥有链启用和只读统计；必须先configureEntry、尚未进入6且未重复配置，client禁止在未完成的像素任务期间配置。接口不接收phase、完成标记或执行句柄。既有仅entry/input的调用方式仍停在5边界。

配置后继续使用advanceBattleEntry任务；5/6返回motionLoop，含callbacks/frame/motion/nextSubstate/unavailable；copyBattleLoop含steps/motions/rounds，0阶段重入复位。收到下一M不推进6的未结束命令，缺失SKL不增加轮次；END/U到7后仍LEGACY_BATTLE_ENTRY_STATE_UNAVAILABLE。completeMain10/completeBattleGameplay=false，完整退出及产品控件未交付。[源证据](../analysis/game-battle-loop-v1/source-check.json)、[规格](../analysis/game-battle-loop-v1/implementation-spec.json)、[测试](../analysis/game-battle-loop-v1/test-results.json)、[TCP](../analysis/game-battle-loop-v1/network-validation.json)、[验收](../analysis/game-battle-loop-v1/validation.json)、[目标审计](../analysis/game-battle-loop-v1/goal-audit.json)。

<a id="stage186"></a>

## stage186：基础battle input与源发送端口

新增LEGACY_GAME_BATTLE_INPUT_PROFILE、legacyGameBattleTargetMask(rows,actingSlot,mask,controlFlags,localSlot)、legacyGameBattleTargetCode(slot,mask,eligibleMask)。20槽目标行严格检查value170/statusFlags/actorFlags，覆盖源单体/交叉/阵营/全体与前后排规则；这是源码数值规则，不宣称原生命中已实现。

battle.configureInput()须在entry拥有者已配置且尚未到4时调用；chooseInputCommand/chooseInputTarget/copyInput提供语义输入和只读状态。world/client对应configureBattleInput、chooseBattleCommand、chooseBattleTarget、copyBattleInput。P/C/A与内部body提供上下文；本地C角色缺失时拒绝输入更新及发送，phase4可选择attack/guard/position/escape，完整技能/道具/宠物/坐骑/观察及13b4依赖仍unavailable。输入窗口速度状态不由调用者注入。

advanceBattleEntry返回任务中的input含源requests/sounds/countdown及状态；sounds只是待接音频元数据。请求operationId=send-004f88f0，arguments只有bytes；client经真实session.sendCommands一次排队，完成/像素取消重试共享同一Promise。网络写失败任务终态为failed；手动暂停取消保持cancelled。源条件可将phaseAfter置5，后续M仍拒绝，不代表完整main10；nativeHitTesting/completeMain10/completeBattleGameplay继续false。[源证据](../analysis/game-battle-input-v1/source-check.json)、[规格](../analysis/game-battle-input-v1/implementation-spec.json)、[测试](../analysis/game-battle-input-v1/test-results.json)、[TCP](../analysis/game-battle-input-v1/network-validation.json)、[验收](../analysis/game-battle-input-v1/validation.json)、[目标审计](../analysis/game-battle-input-v1/goal-audit.json)。

<a id="stage185"></a>

## stage185：自动entry与可重试的捕获任务

新增LEGACY_GAME_BATTLE_ENTRY_FADE_PROFILE/createLegacyGameBattleEntryFade/composeLegacyGameBattleEntryFade，固定源13/8/2参数；step返回真实rowOffsets/complete，完成后再次step拒绝。compose借640×480实际捕获，按short行位移和目标尺寸复制到自有RGBA，不改源像素。

battle.configureEntry({entryWindowPresent})绑定真实playback/frame，advanceEntry(tick)内部驱动源入场0..4，copyEntry返回phase/steps/captures/deadline等。entryWindowPresent显式描述编号32窗口是否已存在；由46c6b0的表基址c101bc、84字节步长与4378d0的c10c3c检查推导，不是通用模态标记，完整窗口生命周期尚未恢复。world对应configureBattleEntry/advanceBattleEntry/copyBattleEntry。entry接管后，显式C/M/callback/basic-frame变更端口拒绝交错。

client.configureBattleEntry/advanceBattleEntry/copyBattleEntry使用自有world/library；advance返回{done,cancel,inspect}。私有捕获在close/reentry清零；未完IO取消后保留同一已算frame做像素重试，clock/逻辑/C均不重放。旧ordinary读或当前job未完先报busy且不推进。需要未实现popup或phase7时给出明确unavailable，实际资源失败按已有失败拥有链关闭。inspect在完成/取消/失败后返回终态，缓存渐变任务相同。输出nativeMain10Driver=partial-entry0..4、completeMain10=false、completeBattleGameplay=false；4不会消费M。[源证据](../analysis/game-battle-entry-v1/source-check.json)、[规格](../analysis/game-battle-entry-v1/implementation-spec.json)、[测试](../analysis/game-battle-entry-v1/test-results.json)、[TCP](../analysis/game-battle-entry-v1/network-validation.json)、[验收](../analysis/game-battle-entry-v1/validation.json)、[目标审计](../analysis/game-battle-entry-v1/goal-audit.json)。

<a id="stage184"></a>

## stage184：battle frame与client渲染任务接口

新增共享LEGACY_GAME_BATTLE_FRAME_PROFILE、sortLegacyGameBattleDepth；比较字段为id/y/alternateY/flags/depthKey，其中depthKey对应signed16字段270。实际battle.configureFrames({graphics})/stepFrame({width,height})读取commands拥有的playback，world对应configureBattleFrames/stepBattleFrame；不得注入节点、动画ready或busy完成位。

client.configureBattleFrames()从自身library借graphics；client.renderBattleFrame()只在未暂停battle-pending下返回{done,cancel,inspect}。done含基础frame元数据和真正RGBA；忙时先拒绝，不重复推进逻辑。pause/close取消当前job，resume早于IO返回仍保持取消与busy，错误读才按实际失败关闭拥有链。字段renderer=partial、nativeMain10Driver=unimplemented、completeBattleGameplay=false；battle.copyState的rendering=partial只表示配置了此基础控制器，completeRendererAvailable=false。现有普通readFrame/runtime不被当成战斗循环。

单位scale、opaque white、palette0、flip/neutral bit4为已验路径，其他样式和特殊渲染明确unavailable；背景/对象origin、int32加法及末端short投影、4093对象预算有独立核对。完整native renderer/input/exit仍未实现。[源证据](../analysis/game-battle-scene-v1/source-check.json)、[规格](../analysis/game-battle-scene-v1/implementation-spec.json)、[测试](../analysis/game-battle-scene-v1/test-results.json)、[TCP](../analysis/game-battle-scene-v1/network-validation.json)、[验收](../analysis/game-battle-scene-v1/validation.json)、[目标审计](../analysis/game-battle-scene-v1/goal-audit.json)。

<a id="stage183"></a>

## stage183：资源绑定和body回调接口

| 接口 | 合同 |
| --- | --- |
| bodies.configurePlayback(config) / commands.configureBodyPlayback(config) | 必须在创建C body之前。config含真实animations、geometry以及seed(uint32)、initialPhase(0..3)、alternativeRenderer/staticFlip(bool)、screenOffset(int32 pair)。player/effects自有，目录借用；不接受ready注入。 |
| world.configureBattlePlayback(config) | 同一源合同；资源绑定后，C会执行构造、强制队列初始化、条件死亡动画与末尾mode0辅助调用。复杂C/坐骑仍不支持。 |
| client.configureBattlePlayback(context) | 仅提供seed/phase/renderer/flip/offset；animations/geometry强制来自客户端自己的资源库。不是新线路字段或认证数据。 |
| bodies.stepPlayback({mainState,substate,slowEffects}) | 一次409fe0式body/效果遍历，23类基础type、动态插入、四拍门控与延迟释放。copyPlayback给自有数值/动画快照；没有绘制队列。 |
| world.advanceBattleCallbacks(context) / client.advanceBattleCallbacks(context) | context保留mainState/substate/controlFlags/localSlot/resourceCode，另需slowEffects(bool)。一次manager→command→body遍历，返回实际事件、停止和状态请求；客户端暂停时拒绝推进。 |
| world/client.copyBattleCommands() | 自有队列、body及playback快照。opaque handle不变；数组复制。已释放或复制伪造handle仍拒绝。 |
| animationPlayer.resetFrames() | 按源55只清nextFrame/delay，保留lastResource/lastAction/facing、signal与cycles。 |

23类type为0/1/2/11/12/13/35/38/45/48/49/50/55/62/63/66/78/82/139/141/208/231/244；208后的209仍unavailable。source49是脱槽而非删除；C清除则预标直接子对象，按pool门控物理释放。配置前旧端口继续标body回调unimplemented，配置后仅partial。ACT(type12)调用420750并完成命令记录；七类已有队列与END使用真实busy反馈，ESC2等后续分支仍缺。

画面、原生main10、完整C选择及退出返回仍unimplemented；nextSubstate不直接恢复地图。非法上下文不改状态，资源/provider故障则停止推进并需正常关闭；不保证一整个原生遍历事务回滚。[完整限定规格](../analysis/game-battle-body-v1/implementation-spec.json)、[测试](../analysis/game-battle-body-v1/test-results.json)。

<a id="stage182"></a>

## stage182：命令和队列调用接口

| 接口 | 合同 |
| --- | --- |
| createLegacyGameBattleBodies() | 自有22槽；applyCharacter/remove/resetQueues/appendActions/insertAction/activate/popAction/appendTuple/popTuple/appendValue/reface/wait/copy/close。队列最多199条+哨兵；pop只选下一type或231，不执行图形回调，也不清busy。 |
| createLegacyGameBattleCommands() | 自有body/32槽命令；load(bytes,context)、callManager(context)、callCommand(handle,context)、copyState/reset/close。handle严格身份校验，释放/重置后失效，不用原生指针。 |
| world.consumeBattleMotion(context) | 必须已入场且C重置/接收队列已消费；context.mainState=10、substate=5；成功解码/装载后才使M.read+1 mod4，返回nextSubstate=6。失败保留环。 |
| world.copyBattleCommands() | 自有快照，记录/labels/计数/队列均复制；handle为不可变能力，复制字段不能伪造。 |
| world.callBattleCommandManager(context) | 按源门控/预约/合并/延迟/EOF状态转换；正常耗尽可请求2并同步battle.roundCounter。 |
| world.callBattleCommand(handle,context) | ESC/CLR/SUP/ANR/PUE/PNO/PDN构造队列和等待；END完成等待后只请求7。未知handler返回command-unavailable，不释放或宣称完成。 |

context必须显式带mainState/substate/localSlot（int32）及controlFlags/resourceCode（uint32），拒绝getter，不从测试端伪造body-ready。nextSubstate是调用结果，不自动把真实world/main9改为10或恢复地图。bodyCallbacks/nativeDriver/exitReturn明确unimplemented；真实产品依旧battle-pending。来源为固定37c4的4365d0/4260b0/436930、4347e0..434b90及433cd0等，[规格](../analysis/game-battle-commands-v1/implementation-spec.json)、[测试](../analysis/game-battle-commands-v1/test-results.json)。

<a id="stage181"></a>

## stage181：M准备与静态导出接口

| 接口 | 合同 |
| --- | --- |
| decodeLegacyGameBattleMotion(bytes) | 自有4095B/NUL前缀；返回24类command字段、principal、22字节计数/mask、分组及offset；execution明确unimplemented |
| world.copyBattleMotionPlan / battle.copyMotionPlan | 显式预处理当前可读M槽；不消费、不缓存或执行；重复返回独立字节与计数 |
| battle-bytes内部读取器 | C/M共同严格typed-array所有权、hex32位、DBCS及内层反转义；原错误类出口兼容 |
| tools/ghidra/MoliExportCallbacks.java | 独立Ghidra分析副本中按源证明入口补建/导出；输出不得预存，原件不执行/改写，边界为派生元数据 |

[源证据](../analysis/game-battle-runtime-v1/source-check.json)、[规格](../analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](../analysis/game-battle-runtime-v1/test-results.json)、[TCP](../analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](../analysis/game-battle-runtime-v1/validation.json)、[完整目标](../analysis/game-battle-runtime-v1/goal-audit.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：battle记录与显式消费接口

| 接口 | 已实现合同 |
| --- | --- |
| LEGACY_GAME_BATTLE_PROFILE / SLOT_LAYOUT | 固定37c4、22槽entry/target数表；renderer/commands明确unimplemented |
| decodeLegacyGameBattleCharacters(bytes) | C头、slot/name/10整数；大写hex、回绕、NUL前缀、有界自有bytes、28B名字及内层反转义；无身体特效执行 |
| createLegacyGameBattleState | 普通applyEntry；按C/P/A/second-U/M次序receive；两四槽ring；P/A部分赋值保留；copy/inspect/close |
| consumeCharacters / world.consumeBattleCharacters | 显式而非自动tick；资源上下文先验，原子应用重复/未见槽、end保留；新generation身体清理后应用 |
| world.copyBattleState / copyGameState().battle | 自有字节快照；不暴露native指针或假定当前屏幕位置 |
| client battle-pending | 实际入场撤销旧runtime，session继续收包；普通移动/组队/frame受阻；关闭释放全部owner |

[源证据](../analysis/game-battle-transition-v1/source-check.json)、[规格](../analysis/game-battle-transition-v1/implementation-spec.json)、[测试](../analysis/game-battle-transition-v1/test-results.json)、[TCP](../analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](../analysis/game-battle-transition-v1/validation.json)、[完整目标](../analysis/game-battle-transition-v1/goal-audit.json)。

**阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：badge与普通party动作合同

| 接口 | 合同 |
| --- | --- |
| planLegacyGameActorBadge | 严格primary/mode15/value16/dirty/present；create/remove/advance/absent；仅create重置dirty |
| planLegacyGameActorBadgeAnchor | 当前offset/origin、源人物高度、signed-short queue anchor；无先帧偏移 |
| planLegacyGamePartyCommand / legacyGamePartyNeighbor | 源三个guard、strict uint32 cooldown、8方向与join/leave选择；不写成员状态 |
| world.preparePartyCommand(tick) | 实际自有本机DISPLAY、f536ac和邻格body索引；成功准备才消费timer；返回已有*Cc描述符 |
| actors.applyPartyReply(mode,result) | 普通Kk0已证两组合；join不置mode，leave复用真实解散；其余不变成员 |
| session自动/Re | 仅真实entered角色/确定leave成功；有序写入TARGET与符号扩展朝向；缺actor显式无确认数据 |
| client/view.toggleParty | playing/paused；调用真实session，反馈sent/blocked/accepted/rejected；不乐观加入 |

[源证据](../analysis/game-party-actions-v1/source-check.json)、[规格](../analysis/game-party-actions-v1/implementation-spec.json)、[测试](../analysis/game-party-actions-v1/test-results.json)、[TCP](../analysis/game-party-actions-v1/network-validation.json)、[验收](../analysis/game-party-actions-v1/validation.json)、[完整目标](../analysis/game-party-actions-v1/goal-audit.json)。

完整队伍控制/其他快捷键/modal、战斗/宠物/特效/复合转场、其余纠偏/输入/reset/生产启动/资源/玩法、微信原生gamePage和设备、现行及官方兼容仍未完成。无真实测试账号。完整目标active，本轮无VM/CUA/WER/CDB/原程序/账号/官方操作；stage131已执行恢复的诊断不重放。


<a id="stage178"></a>

## stage178：普通队伍上下文与步进接口

| 接口 | 合同 |
| --- | --- |
| classifyLegacyGamePartyInput(mode,flags) | signed mode/uint16 flags；mode0普通，非0+100队长，否则队员；目的输入许可同源门限 |
| legacyGamePartyQueueScale(count) | 0..10；出队前长度1/1.2/1.6/2的float32源倍率 |
| legacyGamePartyTargetsNear(ax,ay,bx,by) | int32相减及原NEG/比较语义；两轴<2抑制转移 |
| world.copyPartyInputContext() | 观测源进入或HFs后返回自有mode/本机primary低16位，否则null；快照只读 |
| localMovement内部party端口 | 开始本帧、源队员target/velocity、碰撞显示回退、按全局scale前进；不直接发送网络 |
| motion.startPartyQueue/advanceParty | 队长按队列倍率建速、队员按leader身体速度建速，再独立前进；不隐式消耗其他队列 |
| actors.party.coordinateTransfer | source-ordinary/slot0-unbound/leader-busy/already-near/next-unbound及queued；未模拟原生空指针崩溃 |

[源证据](../analysis/game-party-follow-v1/source-check.json)、[合同](../analysis/game-party-follow-v1/implementation-spec.json)、[测试](../analysis/game-party-follow-v1/test-results.json)、[网络](../analysis/game-party-follow-v1/network-validation.json)、[验收](../analysis/game-party-follow-v1/validation.json)、[完整目标](../analysis/game-party-follow-v1/goal-audit.json)。

完整队伍UI/加入离开响应、aux04队长/模式图标、战斗/宠物影子/活跃复合转场、其他文字/UI与完整纠偏/输入/reset/生产启动/玩法、微信原生gamePage及设备、现行和官方兼容仍未完成；原生x87与非法重复身体/空指针行为未复现。完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage177"></a>

## stage177：值条、五槽更新与通用坐标接口

| 接口 | 合同 |
| --- | --- |
| legacyGameActorValueWidth(current,max) | int32左移5/signed除法/int16，max0返回null；IDIV溢出显式拒绝 |
| planLegacyGameActorVitals(input) | enabled/local/bodyFlags/primary/parent screen/四值；fill3bdf0/3bdef及背景3bdee，priority207/style4 |
| decodeLegacyGameActorValues(bytes) | ]_g的最多5个ID+4值平铺组；空ID结束，单token2047B，缺数字为0 |
| decodeLegacyGamePartyUpdate(slot,bytes) | 槽0..4，base62 mask及原顺序decimal字段；255前缀内转义姓名，>16B改??? |
| actors.applyValues/applyParty/observeVitals | 实际]_g/HFs/E(9桥接；自有行与值，快照复制，释放身体后行指针清理 |
| client.setBarsVisible/toggleBars | playing/paused本机显示选项，不新增网络命令；scene保留，close归false |
| drawPlan command.coordinateMode | 可省略的实现字段；int32保留generic目的坐标，旧锚点仍signed-short，不是官方线路字段 |

[源证据](../analysis/game-actor-vitals-v1/source-check.json)、[合同](../analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](../analysis/game-actor-vitals-v1/test-results.json)、[网络](../analysis/game-actor-vitals-v1/network-validation.json)、[验收](../analysis/game-actor-vitals-v1/validation.json)、[完整目标](../analysis/game-actor-vitals-v1/goal-audit.json)。

队伍跟随/本机输入上下文同步、aux04队长/模式图标、宠物影子及战斗条源、其他文字/UI、完整纠偏/输入/reset/生产启动与玩法、微信原生gamePage/设备、现行与官方兼容仍未完成。HFs已存状态尚未动态桥接f5f170/f536b2到现有显式输入上下文；完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage176"></a>

## stage176：普通标签与rasterText接口

| 接口 | 合同 |
| --- | --- |
| measureLegacyGameText(bytes,font) | NUL前的源字节，当前高位字节跨2；font越界夹0，悬空高位字节显式拒绝 |
| planLegacyGameActorLabel(input) | 显式local/mode/bodyFlags/resourceId/screenX/Y、5个raw labels及selectedLabel，输出short x/y、font1/color/bytes或null |
| createLegacyGameTextBatch(runs) | 最多4096条、C字符串最多255B；不可变自有字节数组，font0..13、color低7位0..11 |
| createLegacyGameDrawPlan(w,h,images,text?) | 可选lane0批次；存在记录（含空字符串）时最多4095 image命令 |
| rasterText(request) | client/library可选借用回调，可异步；request为font/raw bytes/metrics/nativeFont提示，返回width/height/originX/Y/alpha；每mask≤4MiB，每job≤16MiB |
| composeLegacyGameTextFrame(...) | 预解码精灵+同步mask端口；priority210同档image先于批次，批次内部保持源插入顺序 |
| client.setLabelMode(0..5)/cycleLabels() | 仅playing/paused，本地选项，无协议写入；scene重建保留，close清零 |
| actors.applyLabelList / observeLabelSelection | Hr]原顺序48行与E(9 field28；有效目录label≤19B原子检查，越界选中只在使用时拒绝 |

11个Chrome156.0.8078.80桌面/触屏流程通过，37张唯一最终截图已查，0应用错误/警告/外部请求；4条QA读Canvas性能提示单列。网页新增显式ASCII/Windows936选择和实际标签切换按钮；宿主字体为可替代端口，未证明Windows原生GDI字形像素或线路默认编码。 详细getter/额外键/掩码长度/所有权拒绝范围见测试。

[源证据](../analysis/game-actor-text-v1/source-check.json)、[合同](../analysis/game-actor-text-v1/implementation-spec.json)、[验收](../analysis/game-actor-text-v1/validation.json)、[测试](../analysis/game-actor-text-v1/test-results.json)、[网络](../analysis/game-actor-text-v1/network-validation.json)、[完整目标](../analysis/game-actor-text-v1/goal-audit.json)。

HP/队伍、其他文字通道/聊天/头顶气泡/aux04/菜单、完整本机纠偏/输入/reset/生产启动与中文语义、战斗及其余玩法、微信原生gamePage/设备、现行消费者和官方兼容仍未完成；整体goal active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage175"></a>

## stage175：presentation接口与实际所有者

新增纯字节模块shared/legacy-game-actor-presentation.mjs：applyLegacyGameActorPresentationControl严格读取八个自有数字/布尔字段；planLegacyGameActorPresentation选择资源/遮挡/原位清除mask；planLegacyGameActorPresentationAnchor使用前帧drawOffset/origin和高度；legacyGameActorPresentationGate只覆盖已有源写入证明的80位。输入访问器不执行，未知表索引及int32加法越界显式拒绝。

actor快照presentation含primary/secondary/secondaryKnownMask/variant/forced/parameterValue/body duration及三子对象状态；数字字不暴露原生指针。内部frame access拥有prepare/finish、child phase和门控投影，world.resolveOwnGateByte供实际runtime指针及移动使用。counter>600当帧清raw4/shadow10，下个普通hook释放；隐藏子对象照计时，门控和特殊路径暂停。

27项新增、1355项全量Node通过；546组控制、1540组图标选择/拒绝、1003组高度/旧偏移，共3089个独立例。720帧完整场景/224种SHA、12帧预解码/延迟精灵像素对比、6条实际原创TCP的1660帧一致；7neutral/7生成工程通过。四份新构建App116输入/11输出、API91输入，均0external，原生game Page仍未实现。 [源证据](../analysis/game-actor-presentation-v1/source-check.json)、[合同](../analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](../analysis/game-actor-presentation-v1/validation.json)、[测试](../analysis/game-actor-presentation-v1/test-results.json)、[网络](../analysis/game-actor-presentation-v1/network-validation.json)。

姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：source60计划、attached快照与普通钩子回执

[纯模块](../shared/legacy-game-actor-attachment.mjs)的planLegacyGameActorAttachment读取parentAction、screenPosition、bodyAttachment和可空mountAttachment，返回附属action及完整锚点。严格自有字段/二元整数数组，拒绝getter、未知字段、int32加法溢出；输出数组冻结。

演员快照新增 `attached:{rawResourceId,resolvedResourceId,action,phase}|null`；内部身份不公开。它与C0的attachmentBytes及ride.child不同。source60结果为resource或resource-with-source-attachment，nativeAttachments明确为source60-supported;other-unmodeled，不宣称其他附属/UI完成。

普通frame演员回执的attachment包含animation/plan/code/reason/queued/command；queued表示源子队列入队，隐藏位图可queued=true但command=null，根resource1还会在后续归并过滤整个组合。特殊状态无此回执，缓存仍在。childPlayers包括所有已创建自有子播放器。预解码精灵与deferImages路径均验收。[合同](../analysis/game-actor-attachment-v1/implementation-spec.json)、[验证](../analysis/game-actor-attachment-v1/test-results.json)。


<a id="stage173"></a>

## stage173：ride纯规则、演员快照与复合根

[纯模块](../shared/legacy-game-actor-ride.mjs)导出资源映射、动作映射、静止动作、进入/退出planner及完成判定。输入是严格自有数值字段，拒绝getter、未知字段及源整数运算溢出域；counter支持0..46340且要求乘积/高度可用int32表达。没有原程序对象、计时器或网络依赖。

演员快照新增 `ride:{state,counter,child,effect}` 与 `normalResolvedResourceId`；远端也公开正常raw资源。子快照只有raw/resolved资源、action、phase，不暴露内部身份。frame内部通过拥有者访问子身份，`inspect().childPlayers`分别计数；复合根新增只读commands，scene在既有根顺序中展开。单个演员可能提交多条绘制命令，因此submittedActorIds可重复。[合同](../analysis/game-actor-ride-v1/implementation-spec.json)。

state1/2返回handler=source-ride，普通骑乘source-mounted；未证的source60附属/队伍等仍明确报未建模。没有新增包字段或认证旁路。6neutral/7生成与1301Node通过，微信原生gamePage未实现。


<a id="stage172"></a>
## stage172：spin状态与本机正常源接口

新纯模块经index导出`planLegacyGameActorSpin({counter,initialFacing,facingCode})`和`legacyGameActorSpinOutcome(counter,probeCode)`。counter限定0..2147483646，朝向-1..7；首帧initialFacing必须null，后续为已知首向。输出拥有冻结的offset；未知字段、访问器、非法阶段及不安全源溢出域明确拒绝。finish仅probeCode1成功，完成counter1；x87位级同一性未宣称。[合同](../analysis/game-actor-spin-v1/implementation-spec.json)。

演员快照新增specialSpin（初始null；实际80后state/counter/initialFacing，完成后仍state0/counter1），本机专属normalRawResourceId/normalFacingCode，及已观察到未实现附属/骑乘操作的sourceControlUnmodeled。非本机normal字段为null。applyLocalMovement末尾可选facingAssigned默认true保持显式setter旧语义；world传入真实运动/转向写入事实。内部桥另传实际body朝向供462410资格比较，公共movement结果形状未改。

纯frame plan可选sourceSpin；实际client绑定只在拥有真实源状态时启用。动态probe的plan helperCalls为null，帧结果报告实际1/2次，actors行handler为source-spin。事件用原身体屏幕坐标，深度flag0；普通门控在前，特殊分支内无普通运动/裁剪。未实现复合处理器保持显式失败。重启、单位刷新、场景、移除、关闭和租约变化检查见[测试](../analysis/game-actor-spin-v1/test-results.json)。


<a id="stage171"></a>
## stage171：实体源绑定与物件过滤接口

新模块legacy-game-actor-context.mjs经shared/index导出纯函数`legacyGameActorRecordTypeFlags(category)`、`legacyGameActorRecordDrawFlags(category,value7)`与`legacyGameActorInitialFacing(category,resource,sceneMode,facing)`；输入有符号32位整数。`resolveLegacyGameActorFrameSource(actor,baseline)`读取自有、无访问器的sourceFrame描述，替换已证type/draw/motion掩码并OR body，其余显式字段保留，返回冻结结果。

演员`configureSceneMode(mode)`只影响后续构造；`prepareCharacterEntry()`设已证mode0，实际世界scene.fields[8]在beginScene前更新。快照新增sourceSceneMode及sourceFrame。未知mode下类别>3构造保持facingBound=false，绑定拒绝`LEGACY_ACTOR_CONTEXT_SCENE_MODE_REQUIRED`；mode0所需归一化未知会在分配前拒绝，非零mode不依赖该短路后的资源条件。没有新增world外部runtime setter或startup/wire字段。

内部帧配置可选`bindActorSource`，纯plan可选`graphicCulling`，默认旧显式路径保留。`createLegacyGameGraphicActorFilter(localCoordinates)`拥有稠密两坐标副本，submit接收{local,graphicIndex,coordinates}并返回visible/remove/reason；close清除最多100键。缺本机逻辑坐标时不猜零点，复合未知处理器仍显式失败；越界移除用内部frame key，重复仅跳绘制。[形状、生命周期及范围](../analysis/game-actor-context-v1/implementation-spec.json)、[测试](../analysis/game-actor-context-v1/test-results.json)。


<a id="stage170"></a>
## stage170：本机准备、场景构造与等待接口

演员所有者新增`prepareCharacterEntry()`，只初始化已证的普通raw投影；`beginScene(coordinates=null,recreateLocal=false)`接收有界、稠密、无访问器的两坐标并拥有其副本。旧无参模式保持。已知身份/真实场景允许建立逻辑本机；ready普通场景可换新key/motion。`setContext(fields4)`只消费未完成的首次场景身份等待，重复通知不回卷现有运动，也不复活删除对象。

`copyState().localBootstrap`返回准备/场景/身份已知、materializations与有限scope；actor快照的materialization区分unit-record/source-main9。世界`prepareCharacterEntry(code)`仍绑定appearance field16，并建立sourceEntryWaitMask=3；copyGameState暴露该保守投影，copyLocalSceneReadiness和移动所有者同时检查等待。等待时后者抛`LEGACY_GAME_LOCAL_ENTRY_WAIT`。已接受地图清bit0，本机单位清bit1；未知或拒绝材料不能释放宿主等待。

坐标、朝向、标签与资源更新均由现有已证消息驱动；没有新网络字段、平台端口或隐式party/body/runtime默认值。新旧函数、证据与所有权边界见[合同](../analysis/game-local-bootstrap-v1/implementation-spec.json)，19项新增和跨端检查见[验收](../analysis/game-local-bootstrap-v1/test-results.json)。


<a id="stage169"></a>
## stage169：startup/context、client与固定页面接口

`createLegacyGameStartup(value)`、`snapshotLegacyGameClientContext(value)`及profile/error从shared/index导出。startup严格要求schema/sourceProfile/sourceSha256/mappingHex/moduleDigestHex/resourceParametersHex/context，副本拥有三份字节，close清内部材料；inspect仅profile/长度。context严格要求movement/runtime/actor/input/display，逐项使用既有source快照校验，冻结副本，不填缺省零。display为width/height/center/initialCamera/graphicsMode0..2/forceRender；未支持的复合actor分支拒绝。sourceSha为声明，不鉴定本地所选文件。

`createLegacyGameClient({plan,files,context,createSession,clock,onState,onInvalidate})`拥有world/library/session/runtime/CUT，files端口借用；所有观察hook必须同步。createSession接同身份world/graphics及onPacket/onState，返回实际session。start返回认证后或终结快照；ready为首次材料就绪或终结快照；done为终结。ready也可为已暂停状态，调用者检查实时state。inspect无人物/凭据字节；copyWorldState有拥有副本，调用者清；session()/runtime()/library()是借用句柄。

client状态含idle/loading-resources/connecting/characters/choosing/preparing-scene/playing/paused/closed/failed。pause停输入和画面但保流；resume重置clock；close/fail使异步epoch失效并清独立所有者。cleanupErrors记录清理hook异常。world新增`copyLocalSceneReadiness()`，要求真实world/非重入，读取scene/map/local actor/速度与当前格0x4000标记，只返回ready/missing元数据并清临时副本；它是宿主策略，不是完整native UI phase。

browser client消费startup拥有副本，正常构造session后清mapping/digest，File适配和Canvas/picker归自己。完整有序`endpoints`从runtime传给browser client及createBrowserLegacyGameSession（新增可选endpoints）；选定endpoint在桥里必须保持同一序号，省略仍兼容原单目标。没有放宽回环地址或安全规则。

web/game.html由game-app直接加载上述模块，正常File输入和控件推进，没有测试状态/场景注入。inspectGamePage为只读元数据；copyGamePageWorld返回调用者拥有的世界副本。pagehide关闭，隐藏时暂停，断开后必须重选材料。CLI仅提供明确原创回环端点页面，不生产认证材料。[精确合同](../analysis/game-browser-owner-v1/implementation-spec.json)、[验收](validation.md#stage169)。


<a id="stage168"></a>
## stage168：外观、升级与入场字段API

shared/index新增`legacyGameCharacterOptionPolicy(category,present,variant)`、`transformLegacyGameCharacterOption(record148B,category,action3..6)`及options profile/error。变换返回拥有recordBytes及changed/previewPrepared/normalizedCode/requestedPreviewVariant/nativeAction；调用者清拥有副本。失败不改原输入，实际逆表越界为LEGACY_CHARACTER_CODE_TABLE。classify临时+36不作为wire字段；3/4保留原normalizedPreviewCode，5/6才更新。

`legacyGameVersionUpgradeCapability(category,generation)`返回available/reason/requestKind；`createLegacyGameVersionUpgradeCommand`只产生已知kind/拥有marker。类别7材料未知、gen<2分别拒绝。flow新增changeAppearance(slot,action)、beginVersionUpgrade/retryVersionUpgrade/acknowledgeVersionUpgrade；copySlots.options显示门槛，inspect.lastAppearanceAction/versionUpgrade仅数值元数据。源main13独立结果和phase，无猜测deadline。

session新增同步`changeCharacterAppearance(slot,action)`；`beginVersionUpgrade()`与`retryVersionUpgrade()`各返回该次结果或终结快照Promise，**不等刷新、不自动进入**。成功后同步acknowledgeVersionUpgrade启动重新查询；charactersReady仍仅首次菜单，后续观察state回choosing。sourceReplies为历史计数，须检查实时状态。notify期间重试不能覆盖尚待结算的等待者；close清在途帧并结算Promise，手工升级重放拒绝。默认login-only不变。

world新增`prepareCharacterEntry(int32 code)`，要求真实world、key、fresh scene/map/actors、非frame推进与未准备过；只写state4f0000/field16。session在main5边界自动调用；不把人物field15当actorID。borrowed world在session.close后仍由外层拥有，后续F8%更新正常覆盖field16。

picker将原生3/4/5映为上一外观/下一外观/切换样式（6与5同算法）；有证据门槛才显示控件，保持外观按钮焦点。version view由父render驱动，成功显示“返回人物列表”，失败“重试升级”，不自动重发。close移除DOM/listeners，晚到Promise不复活。[精确合同](../analysis/game-character-options-v1/implementation-spec.json)、[验证](validation.md#stage168)。


<a id="stage167"></a>
## stage167：创建草稿与可选会话API

`createLegacyGameCharacterDraft(category)`及creation profile/error由shared/index导出。`update(action,value,names=[])`接appearance/family/color/continue/back/name/detail/mode/stat/element/request-confirmation/cancel-confirmation；stat/element为own `{index,delta:±1}`。inspect仅数值/长度；copy返回拥有nameBytes，调用者清零。prepare(slot,names)只准确认态，返回13字段命令和nativeVariant，名称参数拥有；编码者清零。close清内部材料，无平台I/O。

character flow新增beginCreation(slot)、creationAction、confirmCreation、copyCreation；空槽/武装/源阶段受检。已有session新增beginCharacterCreation、editCharacterCreation、copyCharacterCreation和confirmCharacterCreation。前三个控制操作同步抛规范错误；confirm返回Promise，**resolve源结果或终结快照，不等新列表/不进入游戏**。charactersReady仍是首次菜单Promise；创建后观察characters.state回choosing再选择。sourceCreateCompletions为历史，须同时检查live state。名称/原始detail不进观察器。

begin/commit/创建profile边界要求fresh borrowed world；编码后clear移交name，close清draft、待发参数/在途帧并结算commit，晚到结果无效。手工create与owned list/entry重放拒绝；默认login-only不变。拒绝/600001ms后进入creation-error，edit('dismiss-error')回main3sub10；保持流且无自动retry。

picker可选encodeName才显示空槽创建按钮；creator使用稳定输入、两组约束、确认/修改/取消/错误返回。encodeName移交拥有Uint8Array，core复制后widget清；decodeName显式返回字符串，DOM仅textContent/value。render仍由父观察器调用，close移除自身DOM/listeners并清输入。原生preview/profile.dat、标签语义和正式编码绑定未验。[完整合同/动作值](../analysis/game-character-lifecycle-v1/implementation-spec.json)、[验收](validation.md#stage167)。


<a id="stage166"></a>
## stage166：人物记录、流程、会话与控件API

shared/index新增character profile/error与`decodeLegacyGameCharacterList(bytes)`、`detectLegacyGameCharacterContent(graphics)`、`legacyGameCharacterPolicy(category,generation)`、`prepareLegacyGameCharacterPreview(recordBytes)`、`createLegacyGameCharacterFlow({graphics})`。解码返回两份拥有的148B记录；预处理返回新记录与normalizedCode，previewPixels明确unmodeled。流程借用同一模块身份的graphics，begin一次，advance(uint32,connected=true)逐次返回commands/effect/snapshot；observe接typed operation args，select只准已武装的非空槽0/1。copySlots移交record/name/field16副本和数值field-id，调用者清；inspect不含名称/原始detail，close清内部记录。

既有`createLegacyGameSession`可选`postLogin:{graphics}`，browser/WeChat透传。默认未启用维持旧合同；启用后自动查询与源轮询，业务sendCommand在源入场前拒绝，手工list/entry重放也拒绝。ready仍只表示登录。新增charactersReady/characterEntered（未启用时resolve null），copyCharacters及enterCharacter(slot)。所有ready类Promise都resolve阶段或终结快照；选择无效reject规范错误。**动作前须检查state仍ready且sourceCharacterEntered，历史成功不等于连接仍活跃。**

初次选择及main5边界要求borrowed world的scene/map/localActor为null、remoteCount0，否则LEGACY_SESSION_CHARACTER_WORLD，不隐式重置。已知category绑定资源策略；field15仍是无新增语义的请求字段。列表/入场600001ms与源连接/ack检查顺序独立于20001ms登录时限。终结清character字节、已有排队/回调包并结算全部等待Promise；world/library仍由外层关闭。

`createLegacyGameCharacterPicker({element,session,decodeName,onEntered})`只添加自身section。render为显式void刷新，名称通过decoder与textContent，按钮对应真实select；复制数据用后清零。close移除自身DOM/listeners并使晚到callback失效，onEntered只在live ready/source entry成功触发。调用者在实际首帧准备/显示后关闭控件。完整native UI/reset/创建/删除/预览像素与正式页面仍未实现。[完整合同](../analysis/game-post-login-v1/implementation-spec.json)、[验收](validation.md#stage166)。


<a id="stage165"></a>
## stage165：纯登录与字节会话API

`shared/index.mjs`新增`readLegacyGameHandoff`、`createLegacyGameLogin`、profile/error。构造显式`{mappingBytes,moduleDigestBytes}`，复制字段；`start(uint32)`建立时基，`connected()`表示post-connect边界，`bootstrap()`移交拥有三数组的send-004f83d0描述符并清内部字段。调用者编码后清移交数组。`observeReply(int32,bytes)`只收ack1的一次回复，`poll(uint32)`推进源阶段，分别公开nativeResult/nativeOuterResult；phase99返回1只代表下一主阶段3。`copyReply()`为拥有副本，close清内存。无digest自动生产、账号、平台时钟或I/O。

`createLegacyGameSession`要求sourceProfile=`legacy-se6000-37c4`、fresh genuine world（open、无key/待bootstrap/无积压）及显式endpoint/openStream/clock/setTimer/clearTimer/createControl/pollMilliseconds。端口为plain函数，clock返回uint32，poll间隔1..1000ms是宿主政策；stream为own read/write/close方法，read移交非空Uint8Array或EOF null，write完成返回void。constructor不连接；start幂等，ready/done均**resolve元数据快照**，sendCommand/sendCommands失败reject规范错误。ready仅源登录阶段完成。ready前禁止业务发送；显式登录重放拒绝，不自动重试/重连。

每次读≤65536B、待写≤1MiB、每批≤256命令；按调用顺序拥有编码帧，终结时清排队/在途帧。onPacket可异步，包仅借到回调完成或close，认证detail被截获，不进入观察回调；onState是同步void元数据观察器，不保存真实字段。close在done/ready结算前同步清当前包并取消I/O，晚到open关闭一次，晚到read清零，stale timer不执行。world/key/cache仍由外层关闭，截断EOF不会偷偷销毁借用world。

`createBrowserLegacyGameSession`复用显式loopback桥；`createWeChatLegacyGameSession`复用TCP/control/deadline端口。微信独立入口`adapters/wechat/game.mjs`同时导出核心和适配，**world须由同一bundle实例建立**。两端均无默认官方目标。完整签名/合同、错误与边界见[implementation-spec](../analysis/game-session-runtime-v1/implementation-spec.json)，本地示例使用原创字段，不代表可把current交接交给旧游戏。[验证](validation.md#stage165)。


<a id="stage164"></a>
## stage164：资源计划、drawPlan与异步宿主

| 接口 | 契约 |
| --- | --- |
| createLegacyGameResourcePlan(ASCIIbytes) | 源七组默认/数字参数/别名顺序，输出调用者已拥有文件根内的相对路径；无效scanf/int32/路径拒绝 |
| legacyGameCutPath({checksumMode,resolvedSelector}) | mode1返回硬编码bin/PUK2/cutdat/selector.cut；其他mode必须selector=null并返回null |
| createLegacyGameDrawPlan(width,height,commands) | 4096命令/4M像素上限，image={index,paletteSelector,flags,color}及数值坐标/优先级/可选flip、origin、sourceRectangle、expectedDimensions；不可变、没有RGBA；flip省略为0 |
| player.drawPlan / actorFrames与sceneFrames.deferImages | 可选延迟图像，sprite提供器可省略；同一次源motion/helper/merge后返回drawPlan，不调用sprite或生成像素；旧配置/返回形状保持 |
| createLegacyGameResourceLibrary({plan,files,paletteMode,cacheBytes?,cacheEntries?}) | files精确stat/read端口，paletteMode必须neutral；initialize→catalogs/geometry；目录/缓存由库拥有，文件端口借用 |
| library.startRender(drawPlan) | 返回{done,cancel,inspect}；done得独立RGBA，只读实际GraphicInfo指定范围；同一库同一时刻一job，pin预算不足显式失败，取消/关闭归一错误并释放pin |
| library.readCut(summary) | 异步得到调用者拥有的CUT或null；库close不代替CUT.close；源码模式1缺文件明确拒绝，不用空白图片顶替 |
| world.copyScene / runtime.copyScene | 读取不可变scene身份，用于异步呈现前核对；未增加wire字段 |
| createLegacyGameSelectedFiles(iterable,{rootPrefix?}) | 已选File.slice/arrayBuffer端口，无自动picker/文件系统访问；显式Unicode外层根可剥离，source-relative路径仍ASCII；大小写/父子别名与范围检查，65536句柄上限 |
| createLegacyGameCanvasResourceHost({...oldHost,library}) | pump为Promise；onRequests先接已产出描述符，I/O后原deadline剩余等待，整帧Canvas提交；cancelled/sourcePresent区分宿主取消，旧同步Canvas工厂继续可用 |

默认64MiB与1024图像可配置到有界范围；持有当前帧的条目不能被淘汰。expectedDimensions延迟到实际RD读取后验证。色表限定中性：普通当前表/168黑；flag4原始表+黑1；embedded BGR黑1。命名palette/未知style明确拒绝。source状态可能在图像错误前已推进；已返回请求由调用者负责恰好发送一次，retry同一drawPlan不会再推进世界，不宣称回滚或全网重试策略。[合同](../analysis/game-resource-runtime-v1/implementation-spec.json)。

<a id="stage163"></a>
## stage163：输入、时钟、runtime、Canvas接口

| 接口 | 契约 |
| --- | --- |
| shared.unprojectLegacyGamePosition(screen,camera,center) / pickLegacyGameTile | 有限float32/显式int32中心，返回world、偏置ftol和C截断tile；超出已定义ftol/int32范围拒绝 |
| createLegacyGamePointer | move([x,y])，press(0或2,doubleDown?)，release，step({tick,camera,center,display,context})；保留raw边沿/持续auto，endUpdate(mode)仅非0模式清边沿 |
| snapshotLegacyGameInputContext | 精确13字段hitIndex/dialogIndex/inputOverride/cursorOverride/overlayA/overlayB/leftBlock/ownGateByte/nativePartyMode/nativePartyFlags/nativeCoordinationGuard/nativeActionGuard/actionResetEligible；全部显式原生上下文 |
| createLegacyGameClock(initialTick) | begin→finish(now,{graphicsMode,forceRender})；严格wait、最多19skip；reset只重置clock，不是原生全设备重建 |
| world.copyLocalMovement / setLocalMovementContext | 懒初始化/读取controller；更新context保留position/route/queued/frames |
| world.advanceFrameFollowingLocal | 源local更新后跟随camera；ownGate保留传入camera，返回camera；旧advanceFrame由调用者提供camera，形状不变 |
| createLegacyGameRuntime({world,initialTick,initialCamera}) | 只接收真正world，借用其资源，拥有pointer/clock/camera；pump({tick,runtime,center,width,height,input,graphicsMode,forceRender})返回更新数、全部已产出requests、inputUpdates、选中frame、present/wait/error；最多20更新 |
| web.createLegacyGameCanvasHost | canvas/runtime/readFrame，onRequests/onState，显式tick/schedule/cancel可注入；start/stop/pump/close；CSS换算逻辑坐标，mouse/touch快点保留，正常lostcapture不抹掉press |

右键只返回unmodeled效果；cursorStyle不是wire命令。provider重入、accessor、稀疏和共享门矛盾均显式拒绝，close取消不提交陈旧像素。正常绘制失败保留已返回请求；终止/取消可能已部分推进，不保证恢复尚未返回描述符。场景错误需修复并重新configure，不称完整事务回滚。[合同](../analysis/game-input-runtime-v1/implementation-spec.json)、[验收](validation.md#stage163)。

**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

<a id="stage162"></a>
## stage162：CUT、源场景根与world可选场景接口

`createLegacyGameCutCatalog(bytes)`拥有输入，提供`entry(tileId)`、`inspect()`、`close()`；输入上限900012B，头为已知`CUT `＋headerSize12，三signed16计数非负、合计≤50000，记录18B，允许边界内尾随字节并报告。tileId1000..50999；返回`{tileId,index,resourceId,kind,clip:[x,y,w,h],anchor:[x,y],present}`，未填记录kind65535、其他0。getter/shared memory/截断/超预算明确失败，返回元数据冻结。此严格头检查是独立输入契约，原生loader自身未做该检查。

`legacyGameSceneRectangle(width,height,tileCenter)`复现−30/−20/+21/+31及边界裁剪；普通安全域width/height1..32767、中心每轴0..32736且在地图内、窗口≤2601格。`legacyGameSceneTileOrder(width,height)`输出每格一次的源对角顺序，格数≤2601。`graphics.metadataAt(index)`/`legacyGameGraphicMetadataAt`按ordinal返回`{resourceId:null,index,tileWidth,tileHeight,rawFlags,collisionClass}`，不误用resource查找；它不要求includeImages，scene仍需要图像目录和声明ID表。

`compareLegacyGameSceneDepth(actorRoot,mapRoot)`与`mergeLegacyGameSceneRoots(actors,objects,tails)`的根精确字段为`graphicIndex,declaredResourceId,position,screenPosition,footprint,sortFlag,ordinal`：index−1..849999，声明ID uint32，position有限float32且±2^31，screen为signed16二元，footprint byte二元，flag0/1，ordinal每队列唯一0..1023。三队列各≤1024，actor先用原生排序，再按世界同XY相邻组与物件比较，只过滤actor队列的声明ID1。输出冻结`{queue,ordinal}`顺序；type3尾部直接追加。

world新增`configureSceneFrames({graphics,cut,animations,context,geometry,sprite})`，目录与sprite借用，mode1需CUT，其他mode可cut=null。`context(request,scene)`返回精确`{tileCenter:[x,y],drawPrimitives:boolean}`，是原生上下文而非新wire字段；`geometry(query,mapDescriptor)`给地图动画实际RD几何；`sprite({index,paletteSelector,flags,color})`给拥有的prepared sprite。地图描述符含kind/map coordinates，无账号或标签。需已有actor帧配置；既有`advanceFrame(request)`在配置scene后另返回`sceneLayer/sceneFrameError`，未配置时返回结构保持原样。

sceneLayer拥有RGBA、rectangle、三队列数量、mergeOrder、提交/绘制来源、事件、创建/更新地图物件坐标、helperCalls与丢弃计数。动画物件首次只创建、后续可见一次helper；资源/锚点捕获于创建，隐去保留，scene消息/close释放，最多399²实例。roots/objects/tails各1024、draw4096、像素4194304；空背景透明，事件只描述。特殊primitive/未支持样式明确失败；失败可能已部分推进，scene播放器释放、需重新配置，但保留actor输出、移动请求与协议。whole-frame重入门与错误码读取后的active检查允许close取消，不回传提供器message。

`composeLegacyGameFrame`命令新增可选`sourceRectangle:[signed16x,y,w,h]`，相交图像边界，负起点移动目的坐标；flip位置遵从完整图像维度的原生规则，不能当作通常裁剪后局部翻转。无该字段行为保持。160原创用例由独立64×48纹理块参考核对，含132×100跨块图像。[合同](../analysis/game-legacy-scene-frame-v1/implementation-spec.json)、[回执](../analysis/game-legacy-scene-frame-v1/test-results.json)。

<a id="stage161"></a>
## stage161：源回调计划、深度排序与world帧API

`shared/legacy-game-frame.mjs`公开`planLegacyGameActorFrame({local,action,queueLength,sceneMode,enginePhase,runtime,source})`与`sortLegacyGameActorDepth([{position,sortFlag,ordinal}])`。runtime精确字段为`runtimeStage,ownGateByte,movementScale,soundScene,sparseMode`；source精确字段为`unindexed,recordGateFlags,recordMotionFlags,recordTypeFlags,recordDrawFlags,bodyFlags,specialState,frozen,childAction`。它们是显式原生调用上下文，不能当作已证实网络字段。非零specialState、childAction非null或bodyFlags&400的未建模处理明确失败；blocked门仍先于这些分支。排序输出根ordinal，最多1024，ordinal唯一0..1023，位置float32限±2^31，flag0/1。

`createLegacyGameWorldProtocol().configureActorFrames({animations,graphics,source,geometry,sprite,initialPhase})`借用真实拥有目录/资源，graphics须`includeImages:true`。`source(actorSnapshot)`返回上文source；`geometry(query,actorSnapshot)`返回匹配ordinal及actualRD宽高/原点；`sprite({index,paletteSelector,flags,color},actorSnapshot)`返回已有prepared sprite。initialPhase为0..3。内部live token/版本戳仅用于控制器所有权，不扩大公开actor快照字段。

`advanceFrame({tick,runtime,camera,center,width,height})`仅world且scene/帧配置就绪可用；tick uint32、camera float32二元、center int32二元、像素上限4194304。返回`{kind:'world-frame',movement,actorLayer,actorFrameError,scope,currentVersionCompatibility:'unverified'}`。movement含既有待编码请求；actorLayer含拥有RGBA、每实体motion/animation/屏幕位置、事件、helperCalls、queueOrder与提交/绘制actor IDs。scope为普通实体层，不含地形/物件完整合并。请求与上下文拒绝getter、稀疏/额外字段；提供器期间禁止world写入/递归帧，close仍可取消。

绘制失败返回受限`LEGACY_…`代码或通用代码，不复制提供器message；帧系统failed、播放器释放，协议继续可next/编码移动/重新configure。失败可能已推进实体，不承诺回滚。catalog/sprite由调用方关闭；world关闭只释放借用者。新`graphics.resourceIdAt(index)`/`legacyGameGraphicResourceIdAt`返回文件+36的声明ID，关闭/禁用图像/越界检查与其他图形接口一致。初始animation.graphicIndex修正−1，motion.phase仍是cached lastAction，非动画帧号。[合同](../analysis/game-legacy-frame-v1/implementation-spec.json)、[测试](../analysis/game-legacy-frame-v1/test-results.json)。

<a id="stage160"></a>
## stage160：动画catalog、player和ordinal图形桥接

createLegacyGameAnimationCatalog(groups)：1..7个精确对象，必需index/animation字节与graphicBase，AP可选attachmentIndex/attachmentData须成对。只接受拥有ArrayBuffer/Uint8Array，拒绝SharedArrayBuffer/accessor/稀疏组。index12B、资源100000..120499、后ID覆盖、version>1归0；安全临时唯一资源≤10000、action≤10000/frame≤9999、单animation≤32MiB、总拥有≤128MiB、总解码frame≤1Mi。animation(resource)返回冻结数值metadata（group/version/offset/consumed/actions/frames/AP），不存在null；惰性解析，失败不占已解frame预算。AP未知ID忽略，已用count>1000或区间异常在加载拒绝。inspect只统计，close幂等清拥有缓冲/缓存。

createLegacyGameAnimationPlayer(catalog)：借用catalog；step(sourceContext,resolveGraphic)必需9源字段resourceId/action/facing/speedPercent/mode/frozen/staticFlip/soundScene/actorFlags，除staticFlip为bool其余为source整数。resolveGraphic({kind:'index'|'resource',value})同步返回精确index/originX/originY/width/height，origin signed16、实际解码positive signed16尺寸；index查询必须同ordinal，不使用未经证实的索引尺寸。重入关闭/错误geometry不提交player状态。

step返回code/reason/frameChanged/event/state，state含lastResource/lastAction/lastFacing、nextFrame/delay/cycles/signal/mode、graphicIndex/drawOffsetX/Y/AP坐标、selector/flags/color/geometry。每次只模拟4fd0d0一次调用：freeze==1不改mode，changed复位，countdown递减，duration/(frames×16)再32位乘percent/unsigned100，至少1；出帧再减。单次到尾返回1＋delay255/cycles1，随后依源仍会周期再检查；缺resource/action返回1且保留旧图，0actions返回−1，空frame循环独立拒绝。static ID走resource geometry和0x7fffffff延迟，可选facing2..4翻X；signal>=10000保留，声音仅给ID描述符并按scene9/flags80200抑制，不执行audio。

invalidate()对应同动作强制重启，把lastAction设−1；copyState返回冻结数值快照；close幂等。旧motion.phase字段是actor+2b4 cached previous action，不是frame/time；本轮不自动把所有wire/actor/reset路径连接到player。实际callback可能每次update调用多次helper，caller必须源绑定，不猜一step＝16ms/一RAF。

drawCommand(sprite,x,y)校验拥有prepared sprite与actual几何一致，普通源priority10、flip0..3，坐标为screen＋drawOffset（原点在源getter减后入队加回）；geometry空或graphicIndex<1000返回null。selector非0、flags超0..7或color非FFFFFFFF明确拒绝，named/effects后续；palette/LUT选择仍由caller按源metadata准备。新graphicCatalog.imageAt(index)返回resourceId:null的直接ordinal descriptor，decodeLegacyGameGraphic接受该null而保留其他验证；image(resource)原合同保持。内部renderer尺寸查询只验证已有sprite handle。[测试](../analysis/game-legacy-animation-v1/test-results.json)。


<a id="stage159"></a>
## stage159：RD/CGP/palette/sprite/frame API

新增LEGACY_GAME_RENDER_PROFILE/LegacyGameRenderError，及decodeLegacyGameRD(bytes)：完整source flags/commands，安全限制输入32MiB、像素4Mi、palette≤768、精确展开；返回拥有handle的inspect/copyPixels/copyPalette/close。inspect保留flags/headerByte3/headerWord12/consumed/ignored/stats、bottom-up顺序及graphic metadata。raw允许尾随且word12 opaque，compressed合法end可小于input；零run允许。输入只ArrayBuffer/Uint8Array，拒绝SharedArrayBuffer，不运行getter。

decodeLegacyGameCGP(bytes)消费前672B BGR，返回inspect/copyOriginalRGB/copyCurrentRGB/close；32固定色、snapshot先于current168清黑。createLegacyGamePalette32(bytes,mode,transforms?)：mode为default-rgb或explicit-rgb（精确768B RGB），或embedded-bgr（0..768B BGR）；返回inspect/copyColors(Uint32Array256)/copyKnownMask/close。默认表黑色0，显式表非首黑色1、首色0。partial只有完整triples已知（entry0总已知）；无静默补色。transforms须完整red/green/blue Uint8Array256；explicit-rgb只改16..239，embedded改全部完整色，default不接受LUT；调用者提供源context，不推断night/fade。

prepareLegacyGameSprite(image,palette)须本模块有效handle、positive signed16缓存尺寸/4对齐width且所有引用色已知；转换bottom-up索引为top-down RGBA8，color word0透明。返回inspect/copyRGBA/close，拥有转换结果，上游关闭不影响。composeLegacyGameFrame(width,height,commands)返回拥有rgba、drawOrder和rasterOperations；command精确sprite/x/y/priority及可选originX/originY/flip0..3，最终坐标signed16，priority0..255升序同值提交ordinal降序，普通full sprite翻转/viewport裁剪/零色key。最多4096commands/4Mi target pixels/64Mi raster operations；新frame透明背景是独立adapter选择，不声称原场景清屏；其他scale/blend/crop/effects字段拒绝。描述符trap关闭前项也在绘制前重新检查。

createLegacyGameGraphicCatalog(groups,{includeImages:true})可选扩展：image(resource)沿同一源lookup给resourceId/index/group/byteOffset/byteLength/originX/Y/width/height/present，origin/size截取源runtime16位；default index0/last mapping和alias保持。默认不分配图形表，image调用明确拒绝。decodeLegacyGameGraphic(archive,descriptor)验证范围，只取该RD区间；RD尺寸是decoder真源，index尺寸只保留，archive对应group由caller明确选择。metadata不证明资源可用/版本，缺record或越界拒绝。[向量/验证](../analysis/game-legacy-render-v1/test-results.json)。


<a id="stage158"></a>
## stage158：碰撞元数据、导航与本机移动API

新增`LEGACY_GAME_GRAPHIC_PROFILE`/`LegacyGameGraphicError`、`resolveLegacyGameMapGraphic(uint32)`、`createLegacyGameGraphicCatalog(groups)`。groups为1..7个拥有Uint8Array/ArrayBuffer的完整40B记录串，按source index+先前组record数写入850000槽；总record+10必须<850000。读取28/29占格、30LE16 flags%100、36LE32 resource ID；保留default index0/duplicate-last及四conditional alias。`lookup(resource)`给index/tileWidth/tileHeight/rawFlags/collisionClass，`inspect`只统计，`close`幂等清表；不解图或证明asset可用。越界native指针/畸形/残条/共享缓冲拒绝。[目录](../analysis/game-legacy-local-movement-v1/navigation-catalog.json)。

新增`LEGACY_GAME_NAVIGATION_PROFILE`/`LegacyGameNavigationError`、`legacyGameCollisionWindow(width,height,center)`，按源−30/−20/+21/+31裁剪，signed-short危险算术拒绝、最多2601 cells。`createLegacyGameCollisionGrid(cacheBytes,width,height,center,mode,graphics=null)`核实际MAP尺寸；`createLegacyGameCollisionGridFromRectangle(width,height,rect,planes3,mode,graphics=null)`用于已拥有矩形，3个Uint16平面精确cell数。返回inspect/isBlocked(x,y)/cellValue/copyCells/close；mode1 bit100，其他mode使用resource metadata/footprint/override。只有cell1阻挡，外部阻挡，cells拥有拷贝；metadata分支缺有效catalog拒绝，不能伪造walk表。

`planLegacyGamePath(grid,origin,destination)`返回source steps(direction/coordinates)、finalFacing/reached/preservePreviousRoute/reason；原生候选/角检查/正交合并/axis fallback，signed16坐标和100路径预算；outer-capacity reset与危险fallback拒绝不同。`findLegacyGameMissingMapRectangles(grid,origin,direction)`满51窗口按source leading strips找raw plane2零，输出最多2个裁剪rect；`classifyLegacyGameTileEventContext(raw)`是451b60原值分支，不猜游戏名称。[合同](../analysis/game-legacy-local-movement-v1/implementation-spec.json)。

新增`LEGACY_GAME_LOCAL_MOVEMENT_PROFILE`/`LegacyGameLocalMovementError`、`createLegacyGameLocalMovement(origin,speed,facing,sourceContext,initialPhase=0,initialAnimation=0,initialMoving=false)`；context精确11字段：nativeInputGuard(bff2f8)、nativeMovementGuard(9257f8)、nativeCoordinationGuard(978a4e)、nativePartyMode(f5f170)、nativePartyFlags(f536b2)、nativeTurnGuard(614882)、nativeActionGuard(bff33c)、nativeEventSelector(7283f8+0xc)、nativeInteractionSequence(bff338)、nativeArrivalCountdown(f5369c)、lastTurnTick(bff358)。普通profile拒绝partyMode非0和正arrival countdown；不推断这些值来自认证/其他wire字段。提供requestDestination/setSpeed/setContext/observeAnimation/restorePosition/synchronizeNetwork/step/copyState/close；restore/sync是源状态桥接，验证所有输入后提交。

`step(grid,tickUint32,mapIdentity2,sceneFlag)`无实际时钟：返回local-movement-frame、advanced/waiting-map/interaction、拥有request描述符及event。两步批次只生成send004f6470、缺块发004f6610并冻结，完整补图后继续；地块2停前、其他已证分支停后，序号/guard和004f6530字段有源；UI/audio/响应未知。scaled位置逐帧float32，display到达才更新，snap后下一帧idle，network阻挡仅回滚display；严格turn tick使用source unsigned wrap。copyState包含target/velocity/display/route/queued/wait/interaction/context，不自动联网。

world新增`configureLocalMovement(graphics|null,sourceContext)`（借用catalog/明确重置controller）、`requestLocalDestination(destination)`、`advanceLocalMovement(tick)`及copyGameState.localMovement/localMovementUnavailable；要求已有scene/map/own actor/已知speed/display。mapState.readRectangle为小窗口服务，actor.copyLocalActor/applyLocalMovement和motion.synchronizePosition完成拥有source bridge；masked/own速度和动画更新观察到controller。scene重置预测但条件本机生命周期仍未验；unknown local/coordinated动作失效，显式新context后才能继续。next错误/EOF/close清理，raw world helper拒绝；请求仍由现有encodeCommand封装，host负责发送/帧调度，实际UI/renderer绑定未完成。[测试](../analysis/game-legacy-local-movement-v1/test-results.json)。

<a id="stage157"></a>
## stage157：实体、单步移动与world API

index新增`LEGACY_GAME_ACTOR_PROFILE`/`LegacyGameActorError`、`decodeLegacyGameActorList(bytes)`、`decodeLegacyGameActorActions(bytes)`、`decodeLegacyGameActorRemovals(bytes)`和`createLegacyGameActors()`。输入为拥有Uint8Array/ArrayBuffer，32760B、首NUL和高字节对；tab list空项继续，comma action空项停止。list按11/6/4列非空顺序选择17列character、7列graphic-object、4列value-object；action为id/x/y/action/facing/p1/p2/p3，81/82保留coordinated元数据。解码器保留signed32全域，实体数学限非溢出<<6网格。[列定义](../analysis/game-legacy-actors-v1/actor-catalog.json)。

实体对象提供`setContext(args4)`、`configureResources(uint32|null)`、`observeGlobals(value15,label0,label1,speed)`、`applyUnits(bytes)`、`applyActions(bytes)`、`remove(bytes)`、`applyNetworkPosition(x,y,facing)`、`beginScene()`、`advance()`、`copyState()`、`close()`。own ID显式未知至context；本机独立于1000远端。变更effect含localStateUpdates供源槽桥接；快照区分creationKind/announcedKind和公告坐标/body motion。初始本机速度、非grade0资源缺模式时为null；标签拥有拷贝，超长保留旧值；未知附件/条件flags/frame/local reset显式标记。容量/坐标整批先验，独立拒绝原生危险分配域。

新增`LEGACY_GAME_MOTION_PROFILE`/`LegacyGameMotionError`；`createLegacyGameActorMotion(origin,facing=0,speed=100)`提供enqueue/teleport(point,clearQueue=true)/setSpeed/setFacing/setAnimation(value,resetPhase=false)/clearQueue/step/copyState/close，queue10满后下一目标清队列teleport；step单帧、float32存储、到达后下一帧idle，display为C式有符号截断整数。非溢出网格范围[-33554432,33554431]；不声称native x87逐位或真实时钟。`legacyGameFacingCode(x,y)`用65项查表；`projectLegacyGamePosition(position,camera,center)`显式中心；`classifyLegacyGameActorResource(id)`/`resolveLegacyGameActorResource(id,code)`有序范围且code必须明确；`encodeLegacyGameStepDirections(bytes)`逐byte+97 modulo256，`createLegacyGameMovementCommand(origin,codes,sceneFlag)`为空返回null，否则send-004f6470描述符。[合同](../analysis/game-legacy-actors-v1/implementation-spec.json)。

world新增context/list/action/removal effects、`configureActorResources(code)`、`advanceActors()`、`encodeMovement(origin,codes)`和`copyGameState().actors`。encodeMovement须已选scene，使用scene.fields[11]，空路径无请求；拒绝重入更换scene/关闭，仍经既有field/payload/envelope。mask状态的已证globals同步到actor；本机unit/action反写state-A15/29/30、B18，后者仅-1→100，不借用masked非正clamp。场景清远端，本机guard未实现；position同步target/scaled/facing，本机display碰撞依赖为null。raw模式actor为null且world helper拒绝；错误/EOF/close清理。[测试](../analysis/game-legacy-actors-v1/test-results.json)。

<a id="stage156"></a>
## stage156：场景准备与状态增量API

index新增`LEGACY_GAME_SCENE_PROFILE`/`LegacyGameSceneError`、`prepareLegacyGameSceneTransition(args12,previousIdentity=null,previousCacheBytes=null)`。参数为完整getter-free signed-int32数组：[identityA,identityB,width,height,x,y,headerWord4,headerWord8,mode,positiveConditionalValue,resourceSelector,wireField12]。返回scene冻结元数据、cacheAction及拥有cacheBytes；同身份/20B头匹配复用，A2重建，B0跳过。尺寸要求正值并沿MAP01预算；匹配头但短body拒绝，未知原生危险域不仿真。scene保留原字段、×64 float32位置、mode/selector及条件正值，其他单位/enum未赋义。[合同](../analysis/game-legacy-scene-v1/implementation-spec.json)。

新增冻结`LEGACY_GAME_STATE_CATALOG`（30/18槽）、`LEGACY_GAME_STATE_PROFILE`/`LegacyGameStateError`。`decodeLegacyGameStateRecord(operationId,bytes)`只认两source receive-id；flags从首pipe字段base62（空=-1）读取，bit0-all及各位按顺序消费，返回masked-state-update/updates/ignoredFields/缺失与额外计数。numeric截取127B按default-C ASCII十进制前缀/32位折返，空或缺失-1；byte截255B后inner-unescape，>16B保留旧值。末recordB槽非正改100，actor副写未模拟。`createLegacyGameState()`的apply/copyState/close保留未选槽、初始null、拥有字节与幂等清理，字段只有source-id/nativeStorage，没有猜测属性名。[目录](../analysis/game-legacy-scene-v1/state-catalog.json)。

`decodeLegacyGameSceneLabel(bytes)`返回labelBytes/code/fallbackApplied；整串inner解码后首pipe字段再解码，≥25B换为三个问号，第二字段截31B十进制空/负为-1。输入上限32760B、首NUL为界，无字符编码推断。

`createLegacyGameWorldProtocol()`启用上述scene/label/masked-state effect，场景自动配置/替换当前缓存及mode并更新坐标、保留原facing（初始null）；copyGameState新增scene/label/records。`inspect.worldStateEnabled`区分world与raw，原入口的类型目录语义及显式地图API保持。reset仅等材料，world状态保留；next错误/finish/close清投影和材料。场景数据effect不执行native guard/viewport/actor/renderer或自动发请求。[测试](../analysis/game-legacy-scene-v1/test-results.json)。

<a id="stage155"></a>
## stage155：旧版地图缓存接口

index新增`LEGACY_GAME_MAP_PROFILE`/`LegacyGameMapError`和五个函数：`readLegacyGameMapRectangle(cacheBytes,[x1,y1,x2,y2])`返回请求尺寸及三个拥有的Uint16Array；`checksumLegacyGameMapRectangle(cacheBytes,rectangle,mode)`返回三整数；`decodeLegacyGameMapPatch(byteData,rectangle)`返回三层cell及ignoredOuterBytes；`applyLegacyGameMapPatch(cacheBytes,rectangle,byteData)`返回拥有bytes、writtenCells、矩形及忽略尾字节。输入只认有界Uint8Array/ArrayBuffer；矩形为四signed-int32、正尺寸、面积≤2601。返回数组拥有数据，平面角色未赋义。[规格](../analysis/game-legacy-world-v1/implementation-spec.json)。

`createLegacyGameMapState(identityA,identityB,cacheBytes,mode)`要求显式int32身份对和mode；`applyNotice(args9)`比较源校验，返回`map-cache-notice`/matches/checksums/expected，失败附`request={operationId:'send-004f6610',arguments:first6}`。notice读取active identityA/message identityB，保留message identityA用于请求。`applyPatch(args7)`需匹配已装身份对，验证三层后更新；缺缓存返回`map-cache-unavailable`，不会创建地图。`copyBytes`独立复制，`inspect`只元数据/updates和未建模标记，`close`清缓存且幂等。

`createLegacyGameProtocol`新增`configureMapCache(identityA,identityB,bytes,mode)`、`copyMapCache()`；`copyGameState().map`给缓存元数据或null，scope按配置包含map-cache-projection。仅配置后地图消息产生上述effect，没有自动请求或原生场景执行；其他消息行为保持。无效配置保留旧缓存，next中无效补丁终止并清材料/队列/缓存，finish/close也清。native场景guard、viewport、角色与绘制均unmodeled；独立拒绝缺层/少cell/截断或过长域。[测试](../analysis/game-legacy-world-v1/test-results.json)。

<a id="stage154"></a>
## stage154：旧版消息目录与协议对象

index新增冻结`LEGACY_GAME_MESSAGE_CATALOG`（outgoing60/incoming104）、`LEGACY_GAME_MESSAGE_PROFILE`及`LegacyGameMessageError`。`encodeLegacyGameInteger(number)`支持-2147483647..2147483647，拒绝源INT32_MIN不安全域；`decodeLegacyGameInteger(bytes)`保留C前缀、32位折返、非法/空0。`encodeLegacyGameTextField`/`decodeLegacyGameTextField`只接字节，分别限32760/65520B，首NUL后不读，保留有损反斜线/高字节规则，dangling高字节拒绝。不是Unicode或通用无损codec。[合同](../analysis/game-legacy-message-v1/implementation-spec.json)。

`encodeLegacyGameCommand(operationId,values)`只认目录send-id、精确位置参数数目/类型，数据数组描述符读取不触发accessor，输出tag+空格及各field+空格，聚合≤32760B；拒绝超长，不截断。`decodeLegacyGameMessage(bytes)`返回profile/kind/operationId/consumer/arguments与C边界、token/缺失/额外计数；只空格建立token，CR/LF终止其内容，tag副本≤1023B。缺失数值/bytes为0/empty，额外计数保留，未知tag返回opaque；参数bytes独立拥有，元数据冻结，不赋业务字段名。`decodeLegacyGameBinary(bytes)`按]^i四个或]Pk一个signedLE16长度返回拥有segments、consumer与trailingBytes，负值/超范围拒绝，含义尚未实现。

`createLegacyGameProtocol()`无账号/端口/初始密钥选项：append复制，next返回need-more/discard/bootstrap/binary/message。首次需有效112B材料；binary前缀优先，ready阶段112B仍普通正文，reset标记等待但保留旧codec给非112B正文及encodeCommand，成功更新清旧材料。`inspect`只profile/state/keyAvailable/awaitingBootstrap/pendingBytes及unverified身份/当前兼容；可用旧材料和等待新材料可同时为true。`encodeCommand`组合消息/正文/外帧，输入期间close/替换后不能按变化状态加密。`finish`先要求排空，close幂等，失败/终止清拥有key、队列及投影。

`copyGameState()`只给scope=network-position-projection及pose：coordinates整数对、scaledCoordinates按×64 float32、facingCode原第三码、motion零对；nativeActorSynchronization明确unmodeled，其他业务unimplemented。它不是完整actor/玩法状态或屏幕/方位解释。next的message.effect仅在4ef840消费者产生该投影，其他业务未执行；snapshot独立冻结，关闭后内部投影清空。[来源](../analysis/game-legacy-message-v1/source-check.json)、[测试](../analysis/game-legacy-message-v1/test-results.json)。

<a id="stage153"></a>
## stage153：来源固定的payload codec与初始材料工厂

index导出`LEGACY_GAME_PAYLOAD_PROFILE`、`LegacyGamePayloadError`、`createLegacyGamePayloadCodec(keyBytes)`和`createLegacyGamePayloadCodecFromBootstrap(payloadBytes)`。profile固定完整37c4 SHA，key恰64非NUL字节，输入只接附着的Uint8Array/ArrayBuffer；构造复制key，拒绝shared/detached/proxy等非法输入。没有编码名称、字段名或对端认证推断。[规格](../analysis/game-legacy-transform-v1/implementation-spec.json)。

codec冻结接口：`encode(bytes)`接0..32760B，返回按源8B重排/XOR的独立wire bytes，空输入输出空；源0字节不XOR，未对齐补0x11，对齐不加块。`decode(bytes)`要求8..32760B且整8，返回逆变换后最多去8尾0x11的独立字节；实际NUL/尾0x11不保证往返，调用者不得把它当通用无损byte codec。无字符串/账号/schema处理。`close()`幂等清内部材料并关闭，`inspect()`仅state/profile/officialPeerIdentity/currentVersionCompatibility；后两者一直unverified。验证失败抛固定code、不改已有codec，错误不带输入或密钥。

bootstrap工厂只接112B，要求头末低nibble0（结果64B分支）；seed头16+零16，经固定参数128/8192 SHA256，先校验ciphertext HMACSHA256，再AES256-CBC禁用通用填充解块，检查64非NUL结果并复制成codec。原生先写候选后验tag，本实现失败不输出候选，finally清内部副本；不对外给中间派生值。同步CPU工作有界，未验host取消/调度/设备性能，也不覆盖完整握手/特殊前缀流程。[源核对](../analysis/game-legacy-transform-v1/source-check.json)、[测试](../analysis/game-legacy-transform-v1/test-results.json)。

<a id="stage152"></a>
## stage152：旧版外帧接口

`LEGACY_GAME_ENVELOPE_PROFILE`固定`legacy-se6000-37c4-envelope-v1`及完整样本SHA；`encodeLegacyGameEnvelope(Uint8Array|ArrayBuffer)`复制已经转换的opaque wire payload，允许0..32767B，返回新独立封包。`LegacyGameEnvelopeError.code`给确定错误，不包含原始输入。没有正文编码/加密、账号或发送副作用。[实施规格](../analysis/game-legacy-network-v1/implementation-spec.json)。

`createLegacyGameEnvelopeReader()`返回冻结接口：`append(bytes)`复制并返回pendingBytes；`next()`每次只返回`need-more {reason,pendingBytes}`、`discard {discardedBytes}`或`frame {profile,payload,wirePayloadBytes,wireBytes,discardedBytes}`。frame payload独立拥有；256KiB为队列容量，不是进程总内存预算。原生8B候选门槛保持，0/1B正文的6/7B帧须等后续字节才可提取。调用方反复next直至need-more，处理事件后自行释放输出。

`finish()`要求先显式排空，否则`LEGACY_GAME_INCOMPLETE`并清空；`close()`幂等清空，`inspect()`只返回state/pendingBytes/queueBytes。非法输入/append预算失败不改变原队列；完整坏尾/高位长度终止清空，后续操作报CLOSED。reject detached/shared/proxy及非字节view，非零offset按intrinsic读取，不执行调用方getter。终止政策是独立实现选择，非原生行为仿制。24Python向量和12新增测试通过。[测试回执](../analysis/game-legacy-network-v1/test-results.json)、[源核对](../analysis/game-legacy-network-v1/source-check.json)。

<a id="stage151"></a>
## stage151：旧版消费端合同，尚非新运行时接口

新分析合同限SHA37c4旧版SE：45cc90的Config.dat文本读取/参数拼接与启动映射，45cfd0的配置/资源参数，457c30的选择路径映射，44eba0的七家族路径组装。Config文本reader已追至51b1ed，255B/首换行/NUL边界明确；不能用配置器Read256接口直接代替游戏启动输入。[首批静态合同](../analysis/game-release-current-v1/static-contract.json)、[REA与源字节核对](../analysis/game-release-current-v1/source-check.json)。

命名映射静态前缀gid:/glt:和%s扫描已见，实际字段身份/会话、完整本地ABI/生命周期与当前协议仍未证实。没有新增宿主IPC执行、凭据保存或游戏消息API；当前shared/Web/微信接口代码保持，后续实现须声明绑定样本和有界替代政策。[完整目标审计](../analysis/game-release-current-v1/goal-audit.json)。

<a id="stage150"></a>
## stage150：RD压缩命令结构API

`decodeRDRunModel(input, options?)`接附着、非共享的Uint8Array/ArrayBuffer，只在≤32MiB后复制；可选own-data `record`的byteLength/width/height必须与所选记录一致。拒绝shared/detached/proxy、accessor记录、无效头/尺寸/长度/palette及命令；错误为 `RDRunError.code`，完整代码表见[实施合同](../analysis/game-rd-runs-v1/implementation-spec.json)。

返回profile/scope/version/width/height、inputBytes/consumedBytes、`pixels`与`pixelKnown`，以及opaque下的headerByte3/headerWord12/paletteBytes/paletteKnown和统计。四份数组各自拥有独立buffer；输入不变，临时副本在完成/失败时清理。known=1仅指literal或显式repeat，known=0指C/D/E，零值存储没有颜色/透明语义；流顺序也没有自动翻行。

新API只支持v1/v3结构模型，原 `decodeRD` 仍只解raw v0/v2。8种已见命令、48原创向量和27,785条压缩记录差分不证明原游戏解码器等价；无文件IO、EXE/游戏执行或renderer效果。[源与限制](../analysis/game-rd-runs-v1/source-check.json)、[测试回执](../analysis/game-rd-runs-v1/test-results.json)。

<a id="stage149"></a>
## stage149：Config.exe来源配置codec

shared入口导出GAME_CONFIG_PROFILE、GameConfigError、createDefaultGameConfig、encodeGameConfig、decodeGameConfig。固定profile config-exe-9389add9-v1，仅指配置器来源，所有接口无IO/凭据/会话/renderer行为。

- 默认：每次返回独立冻结`{deviceCode:1,windowMode:false,onlyActive:false,soundOff:false,musicOff:false}`，对应缺文件/默认源值，不创建文件，解析错误不回退默认。
- encode：精确五个own data字段，deviceCode整数1..4，四flag严格Boolean，拒getter/额外或继承字段；返回独立Uint8Array，固定顺序空格ASCII12..52B，不含结尾NUL/换行。模型Boolean为明确API策略，已覆盖源非零flag的全部64种输出；不接收原生radio控件或选择renderer。
- decode：实际attached非shared Uint8Array/ArrayBuffer，允许大输入但只复制前min(length,256)B，首NUL截断，否则明确bounded-end-as-terminator策略。首次大小写敏感3Ddevice:，C-ASCII空白/可选正负号/十进制前缀；拒缺失、失败、Int32溢出及1..4外值。四flag仍独立大小写敏感子串，包含在其他文本也算；不按词分割或后者覆盖前者。
- 返回冻结settings、offsets、inputBytes/readBytes/textBytes/unreadBytes/ignoredAfterNul/boundary、scope configuration-helper-only/gameEffects unverified。没有保存或返回输入原文；临时读取副本最后清理，caller storage不改。错误GAME_CONFIG_INPUT/DEVICE_MISSING/DEVICE_PARSE/DEVICE_OVERFLOW/DEVICE_RANGE。

源读取段缺少终止/返回值/范围保障，本实现不声称重现其越界、栈值、失败sscanf或locale依赖。规范重写舍弃未知文本，和源固定字段writer一致，不自动覆盖文件。[合同](../analysis/game-config-v1/implementation-spec.json)、[原创建/边界测试](../analysis/game-config-v1/test-results.json)。

<a id="stage148"></a>
## stage148：资源封套、微信存储与宿主API

shared入口新增`LAUNCHER_RESOURCE_CACHE_FORMAT/LauncherResourceCacheError/encodeLauncherResourceCacheRecord/decodeLauncherResourceCacheRecord`。encode输入精确own `{revision,resources}`，resources先按既有strict v1/v2校验；返回owned Uint8Array。decode接受实际attached非shared Uint8Array/ArrayBuffer，完整封套检查后返回`{format,revision,resources,trust:'unverified'}`并独立持有文件字节。revision为1..2^53-2，元数据≤1MiB，总记录≤68157488B；每文件/数量/总payload保留旧预算。[完整格式](resource-formats.md#stage148)。

`createWeChatLauncherResourceStore({wx,profile,clock?})`：profile为1..32 ASCII字母数字下划线/减号；read(options)返回revision/resources/recovered/corruptSlots/trust；commitResources(snapshot,{expectedRevision,timeoutMs?,signal?})返回revision/committed/recovered/verification/durability/trust，其中持久性未验证。options精确own data，期限1..60000ms，默认10000ms；预期revision在第一次await前复制，错配不写。错误前缀RESOURCE_CACHE_：INPUT/UNAVAILABLE/BUSY/ABORTED/TIMEOUT/STORAGE/CANDIDATE/CORRUPT/CONFLICT/COMMIT_UNKNOWN。

内部`launcher-slot-store.mjs`共用旧目录状态机；目录公开API/格式/错误前缀CACHE_保留。两份完整记录选择最高有效revision；另一份坏可报告恢复，两份坏拒绝写入，同revision异内容冲突。只写非当前slot并完整回读；同JS上下文同root/目录/profile互斥。native writeFile已发出后失败/超时/取消均结果未知，数据/锁到其callback才释放；原子性、跨上下文和断电持久性均无保证。late read及回调先返回后时间检查超时的交付缓冲均清理。

宿主配置可选root `resourceCacheProfile`，需已有patch配置；默认null，无启动IO。新增checkResourceCache/restoreResourceCache/saveResourceCache，以及resourceCacheEnabled/Status/Revision/Phase、canCheck/Restore/SaveResourceCache视图标志。保存必须先明确选择并检查revision；恢复精确比对既有绑定后先为候选，再选择。恢复base与candidate共享一个page owner，丢candidate不清仍持有的base；下一准备器复制base。来源/选择/目录变化或隐藏释放preview/base/candidate并使revision失效，晚写只提示重新检查，不恢复视图。清除按钮仍只清本页，不删除持久文件。

缓存不保存操作历史，恢复视图明确提示；MD5/来源选择/本地恢复均不认证或说明游戏已安装/可玩。初始化自摘要所选登录器、账号、密码及会话不进入资源封套。[测试/限制](../analysis/launcher-wechat-resource-cache-v1/test-results.json)。

<a id="stage147"></a>
## stage147：当前补丁调用数据API

`shared/launcher-patch-current.mjs`及shared入口导出`WIN32_LAUNCHER_PATCH_PROFILE`、`Win32LauncherPatchError`、`encodeWin32LauncherPatchCommand`、`createWin32LauncherPatchPlan`、`interpretWin32LauncherPatchPoll/Exit`。均无IO或进程句柄；输入是精确own data字段，拒getter/额外字段，字节拒shared/detached/proxy，输出独立持有。

- formatter：`{backupPathBytes,addressBytes,portBytes}`，分别≤8193/4096/4096B非NUL Uint8Array，返回加结尾NUL的命令字节；始终引用路径并按源转义，地址/端口原文追加。它不检查实际原生路径或端点可用性。
- plan：原有七字段`alreadyPatched,caseProfile,directoryBytes,patcherBytes,codeTextBytes,addressBytes,portBytes`；保留独立Code0..14/ASCII case/4096B预算，只支持规范ASCII盘符目录+basename、完整路径≤259B，根目录只一个分隔符。请求补丁时地址1..255个已证ASCII字符，端口1..5数字且1..65535。返回当前profile、applicationNameBytes、quoted command、timer元数据，nativePathValidation/execution/fileOperations均not-performed。
- poll：`{hasProcess,querySucceeded,exitCode,startTick,nowTick,warningShown}`；flag严格boolean，三个数字UInt32。无handle停timer；查询失败继续；259按UInt32差值计算，≥1800000ms只警告一次并继续；最终退出描述停timer/关handle/清槽/分发。250ms为原生请求间隔，不是实际计时精度保证。
- exit：`{exitCode,attempt,selectionValid}`；最终UInt32退出码（非259）、attempt1..3、boolean选择状态。100且选中有效才标完成，无效result0x585；101来源失败；102前两次返回retry，第三次exhausted；其他unexpected。返回清理/结果请求数据，不执行重试，不认证或核验文件完整性。

`createLauncherCatalogPatchPlan`纯核心第二参数及preparer端口可选callerProfile（默认legacy或win32-current）；Web包装器从own输入callerProfile读取并提前复制，当前页面从已有runtime配置提供，微信端口固定current，无新配置项。缓存绑定不增加调用者profile：固定资源解释、摘要和sourceOrdinal相同，只有进程计划元数据变化。[合同/限制](../analysis/launcher-current-patch-v1/implementation-spec.json)、[测试](../analysis/launcher-current-patch-v1/test-results.json)。

当前计划保留的`packagedSourceRelativeBytes`只属旧格式派生声明，`packagedSourceStatus`明确标为当前未证；当前缺失补丁程序的完整准备来源仍待核对。

<a id="stage146"></a>
## stage146：纯补丁端口、来源route、资源ZIP与微信宿主

shared/game-patch-data导出原GAME_PATCH_LIMITS/GamePatchError，game-patch-paths承接原path/key/tree策略；原game-patch重新导出类型/预算且候选消费者不改。shared/launcher-game-patch导出createLauncherCatalogPatchPlan(input,{decodeText})、createLauncherGamePatchPreparer(ports)、LauncherGamePatchError；ports必须提供decodeText/now/setTimer/clearTimer/createAbortController/readSignal/clientForSource七个own函数。clientForSource(selectedSource,input)同步给urlForPath/getBytes，所有配置/本地文件在首请求前拥有副本；prepare沿用input字段、非负signed32 epoch、1..60000ms总期限/外部取消，顺序取清单与每个所需ZIP，不自动重试。getBytes是有界bytes响应，来源权限不是元数据声明。[源码](../shared/launcher-game-patch.mjs)。

Web原createLauncherCatalogPatchPlan/prepareLauncherGamePatch包装保留native fatal TextDecoder、performance/AbortSignal、明确allowedOrigins/fetchImpl及原HTTP源；no-patcher/already-patched分支仍不请求。纯准备器增加独立总期限race，永不返回部分结果；current/skip/ZIP/MD5/路径与预算语义沿用固定PUK3消费者，不能据PatchEXE任意名字推定其他补丁器兼容。

shared/launcher-patch-route只描述本项目桥接合同：snapshotLauncherPatchSource收恰own address/portText，受限ASCII DNS/IPv4声明及1..5十进制位1..65535，原大小写/前导零不改；launcherPatchSourceKey按原文本匹配。id为1..32 ASCII字母数字_-。inspectLauncherPatchResourcePath仅接受/cg50/Update.TXT?t=epoch或/cg50/path/name.bz2?time=epoch，保留空目录的双slash，拒fragment/percent/额外query/非法路径；epoch为规范非负signed32数字。

createLauncherPatchRelayHandler({routes,allowedBrowserOrigins=[],fetchImpl})的routes为1..16份{id,source}，启动即复制。按固定HTTP来源取资源，客户端没有target URL或上游头输入；GET以外405，未知route404，非法路径400，未允许Origin403，资源失败502。CORS只回显明确来源、不允许credentials；客户端Cookie/Auth/Referer不转发。每个上游请求固定10秒及既有HTTP预算，response finish/close后释放owned body，close未完成则abort。createLocalLauncherPatchRelay(options)仅监听127.0.0.1随机端口，返回origin/port/close；无公网/TLS/账户部署。[实现](../adapters/node/launcher-patch-relay.mjs)、[网络条件](network-portability.md#stage146)。

snapshotWeChatLauncherPatchConfig的patch恰四own字段：directoryText（旧Windows drive-rooted目录元数据，不是手机路径）、pathEncoding（ascii/windows-936/utf-8）、patchSourceProfile（configured-only或puk3-195f3afd）、routes（1..2）。route恰{source,origin,id}，origin是既有HTTPS DNS/443 profile；重复来源或相同origin/id拒绝。createWeChatLauncherPatchPreparer按选中source原文本匹配route，然后调用origin/moli-patch/v1/id+原资源路径；缺映射不请求，不替换成另一来源，不证明桥接上游真实性。

importLauncherResourceArchive(zipBytes,files)只读既有ZIP消费者，opaque名字按原ASCII路径/树规则校验后与基础资源合并；冲突不覆盖，返回独立files。ZIP每包原64条/32MiB压缩与输出，合并仍1024文件/64MiB。readWeChatLauncherFile新增extension:'exe'|'zip'（默认exe），仅过滤所选文件，原有32MiB/有界read/stat/逻辑取消不变；不执行或修改文件。

host新增可选patch（默认null），方法choosePatchSource(index)、importResourceBase、prepareResources、clearResources、selectResources、copySelectedResources。视图只含patchStatus/state、source显示/原序号、base/candidate计数及选择门槛，没有原始文件字节或路径/账号。source picker0为占位，事件减1，过滤备用显示index0也必须传原ordinal1。必须先有HTTP/缓存来源raw目录及完整游戏/区域/Galaxy选择，资源连接权限与billing独立，不能据可准备资源打开未允许的会话；复制既有资源snapshot保留source/目录绑定及unverified。输入变化可保留同绑定候选，目标/来源变化和隐藏清掉候选；恢复显示来源列表但不自动选，迟到结果不复活。[配置/运行](../wechat/README.md#stage146)、[验收](validation.md#stage146)。

<a id="stage145"></a>
## stage145：可移植目录记录、微信双slot和宿主缓存入口

`shared/launcher-catalog-data.mjs`直接导出原CATALOG_CANDIDATE_BYTES/LauncherCatalogError/ownLauncherInputBytes/snapshotLauncherCatalogCandidate；纯snapshot要求{decodeText}函数，复用原字节/摘要/XML函数体。Web原模块重导出前三项并以旧fatal native TextDecoder包装snapshot；新增共享模块不依赖DOM或平台默认codec。

`shared/launcher-catalog-cache.mjs`导出LAUNCHER_CATALOG_CACHE_FORMAT、LauncherCatalogCacheError、snapshotPortableLauncherCatalogs、encodeLauncherCatalogCacheRecord、decodeLauncherCatalogCacheRecord。encode收恰own revision/catalogs，revision为1..2^53−2；snapshot仅选择原目录字节、显式codec/兼容开关及摘要，再解析。decode从有界实际字节检magic/版本字段、长度/整记录MD5和XML，返回冻结{format,revision,catalogs,trust:unverified}及独立原始字节。raw每份≤1MiB、容器≤2097196B，同时保留XML256KiB字符/节点/字段等更严门槛；不是任意上限字节都可解析。[布局](resource-formats.md#stage145)。

`createWeChatLauncherCatalogStore({wx,profile,clock})`位于adapters/wechat/launcher-catalog-store，profile为1..32 ASCII字母数字_-。只在USER_DATA_PATH/moli-launcher-catalog-v1下读写profile.a.bin/profile.b.bin；构造不读写，依赖readdir/stat/readFile/mkdir/writeFile。read(options)返回{revision,catalogs,recovered,corruptSlots,trust}；无文件为0/null，单份损坏/超预算但另一完整时返回完整并标记；全损坏拒绝，同revision内容不同冲突，未知目录/文件错误不当缺失。

commitPair(catalogs,{expectedRevision,signal?,timeoutMs?})开始时复制已知own data选项，拒getter/继承期望值/额外字段，候选也在首await前拥有副本；timeout1..60000ms。当前JS上下文同实际目录/profile互斥，过期revision拒绝；向非当前slot写revision+1，回读并按完整字节确认，返回committed:true、verification:readback-in-this-context、durability:unverified。只改这两文件，不删除/清理其他profile或未知文件；目录枚举最多4096项、单名≤512字符，读取显式长度且前后stat核大小。

文件API没有abort。写已发出后错误/取消/期限为CACHE_COMMIT_UNKNOWN：无法推断未提交，保留native引用的payload及该profile互斥至回调；期间CACHE_BUSY，不自动回滚/重试。callback后释放/清零，下一次明确read才能判定完整结果；原生回调永久不来时该上下文不能再次使用该profile。读取消可立即逻辑退出，迟到回调不写入；mkdir可能留下空的专用目录。不同JS上下文/worker/进程及断电不在一致性保证内。

host新增可选catalogCacheProfile:null或上述profile（默认null）。checkCatalogCache/saveCatalogCache返回异步snapshot；restoreCatalogCache同步返回boolean，不触发会话。新增cacheEnabled/cacheStatus/cacheRevision/cachePhase/canCheckCatalogCache/canSaveCatalogCache/canRestoreCatalogCache及catalogComparison；视图没有路径/原始字节/账号/密码。检查不自动恢复，保存须实际原始字节与已检查revision；恢复须codec/amp符合配置，清输入/确认/区域选择。当前已载入/恢复字节传入下一次bootstrap比较，失败清原始候选；隐藏/取消清输入/检查副本/确认，已发出保存显示重新检查结果。[构建/使用](../wechat/README.md#stage145)、[测试](../analysis/launcher-wechat-cache-v1/test-results.json)。

<a id="stage144"></a>
## stage144：微信初始化、HTTP、本地文件和纯目录文本

`createWin32LauncherBootstrap({httpClient,cacheTick,platform})`与旧`createLauncherBootstrap({httpClient,platform})`可传完整六函数platform：now、setTimer、clearTimer、createAbortController、readSignal、decodeText。own函数/accessor门槛、单调非负时钟、signal读口/返回控制器检查在IO前；异常取消器仍不阻止期限拒绝/清理。readSignal返回null或{aborted(),add(fn),remove(fn)}，decodeText接(bytes,encoding)返回有界字符串。省略仍为浏览器实现，旧工厂不消费cacheTick。`snapshotLauncherCatalogCandidate(value,{decodeText})`沿用摘要/解析，只允许显式文本端口，默认仍fatal TextDecoder。

`adapters/wechat/launcher-http.mjs`导出createWeChatLauncherHttpClient、snapshotWeChatHttpUrl/Origins及相同HTTP错误/预算。只支持显式HTTPS DNS、默认/443端口、ASCII URI/合法百分号路径与查询，拒绝用户信息、fragment、IP、非规范/其他协议。来源1..16；实际getAppBaseInfo.SDKVersion≥3.2.2且getDeviceInfo.platform为ios/android/devtools；其他平台在request前拒绝。GET arraybuffer、manual重定向、enableCache=false、enableChunked=true；保留原生域名/证书规则，无Cookie/Auth头输入。不能将此描述为浏览器credentials:omit的原生等价证明。

HTTP只接受2xx，拒绝观察到的3xx/Location；headers缺status可延后至success（官方类型说明DevTools暂可能缺失），最终必须有整数状态。元数据4096B、目录1MiB、包32MiB，chunk≤65536次，期限1..60000ms；声明/实得超预算均拒绝。分块结果允许success空buffer或完全相等的完整buffer，不重复拼接；最终buffer-only也验预算。监听移除、owned块清零、失败abort与迟到回调忽略均有检查。预算约束应用接受/复制的字节，不证明原生内部缓冲分配上限或网络真实性。

`createWeChatLauncherBootstrap({wx,allowedOrigins,clock})`绑定同一current工厂、纯解码及私有signal，不依赖URL/TextDecoder/AbortSignal/performance全局。`readWeChatLauncherFile({wx,signal,clock,timeoutMs=60000})`仅chooseMessageFile的单个临时文件：1..32MiB、stat.isFile/size、显式readFile position0/length、实际buffer长度及后续stat size。返回owned Uint8Array，不返回路径；不执行/写入，不保证同大小内容在读取期间不变；摘要针对实际读到字节。选择和FS调用没有abort任务，取消/期限只能停止后续逻辑，不能保证关闭原生UI或停止底层读。

host七个旧字段兼容，新增可选bootstrap={allowedOrigins,endpoints,encoding,timeoutMs}四own字段，endpoints恰五个launcherDigest/updateLocator/catalogDigests/gameList/regionList完整受限URL。目录encoding仅utf-8/gb18030，与凭据textEncoding分开；有bootstrap时XML可双null，混合null拒绝。新增loadCatalogs及loadingCatalogs/hasBootstrap/canLoadCatalogs/catalogsReady状态；加载不自动发起，完成前不可选目标。刷新清输入/确认/目标，完整pair才提交；候选更新不执行；目前每次原始缓存对传null。所有旧game/region/Galaxy、review和session门槛保持。[配置/运行](../wechat/README.md#stage144)、[测试](../analysis/launcher-wechat-bootstrap-v1/test-results.json)。

纯`shared/launcher-catalog-text.mjs`直接导出decodeLauncherCatalogText(bytes,{encoding})、LAUNCHER_CATALOG_TEXT_LIMITS、LauncherCatalogTextError；支持ArrayBuffer/Uint8Array，复制用intrinsic，不读子类iterator/length，最多1MiB，可空（XML解析仍拒绝空目录），显式utf-8/gb18030/fatal，不替换畸形字节。[表与BOM](resource-formats.md#stage144)。

<a id="stage143"></a>
## stage143：微信宿主配置/状态/生命周期

`snapshotWeChatLauncherHostConfig`接受null（未配置）或恰七own data字段：sourceProfile固定win32-current；gameListXml/regionListXml非空各≤1048576字符；allowBareAmpersands布尔；allowedEndpoints1..10；textEncoding为ascii/windows-936/utf-8；textPages为null或四份非空各≤65536字符。JS文本不是原编码/字节完整性证明；账号/额外字段/accessor拒绝。返回冻结的解析目录/端点/页面，来源信任不提升。

`createWeChatLauncherHost({wx,config,render})`返回冻结snapshot/chooseGame/chooseRegion/chooseGalaxy/inputUsername/inputPassword/beginReview/nextPage/decide/login/selectProfile/cancel/hide。显式目录及区域/BIP全匹配允许表，Galaxy过滤后传原source ordinal，game request子集1..14；输入经配置codec限1..16字节，标签严格roundtrip或中性编号。review恒forcePrompt/recorded0，不存write intent；只有最后一页可确认，输入/目标变化撤销确认。

render/snapshot只含可显示状态/目录/候选、布尔门槛及输入控件key，不含账号、密码、username digest或会话字节；输入留私有闭包，构造session的字节副本随即清零，提交/取消/隐藏/卸载清除输入。generation校验旧异步结果不复活；App和Page hide均调用清理，unload退订生命周期。选择不返回假游戏或改变authentication:unverified。

`tools/build-wechat-app.mjs [--config JSON] [--outdir build/subdir]`生成原创建工程/standalone CommonJS与输入/输出hash报告；不改旧module构建，不上传/发布。原生WXML/游客标识/AppID/域名/设备尚未验收；SDK服务关闭的失败回执单列。[配置/运行](../wechat/README.md#stage143)、[测试](../analysis/launcher-wechat-host-v1/test-results.json)、[工具](../analysis/launcher-wechat-host-v1/native-ui-audit.json)。

<a id="stage142"></a>
## stage142：微信会话/字节流与取消控制器端口

`adapters/wechat/launcher.mjs`导出`createWeChatLauncherSession`、`createWeChatLauncherTransport`和`WECHAT_LAUNCHER_STREAM_LIMITS`。会话input为own字段wx/endpoints/firstEndpointOrdinal/requestCounter/gameCode/usernameBytes/passwordBytes，可选setTimer/clearTimer；额外字段拒绝，不允许替换crypto/协议profile，固定current。返回冻结snapshot/cancel/start/getChoices/selectProfile，`start()`不收外部DOM signal，调用方生命周期用cancel。账号输入沿用原字节长度/所有权，结果始终authentication:unverified。

TCP构造接wx、显式allowedEndpoints，openStream按地址/端口匹配；只支持规范域名/RFC1918 IPv4子集，拒绝localhost/公网裸IP、平台禁用端口和非规范地址。输入总量/排队与保留输出各4MiB，读块≤65536B，native messages≤4096；owned输出缓冲保留到close，因为write返回void不提供消费/送达确认。read/write/close沿用驱动合同；close/error/cancel清理监听与缓冲，remote EOF可先排空，但之后主动close丢弃剩余。原生域名/配额不绕过。

现有`createLauncherSession`新增可选own函数`createAbortController`，须返回可用signal.aborted和abort方法；构造/返回不合法或抛出为SESSION_CONTROL，abort抛出计cleanupErrors且继续清理，默认仍new AbortController。WeChat使用模块私有brand信号，不改全局/旧web start(signal)语义。独立本地deadline clock将Date差值单调化、timer触发推进到调度floor、取消后忽略晚到timer；不假设官方Performance.now或作为服务器时钟。

[支持格式/来源](../analysis/launcher-wechat-v1/implementation-spec.json)、[构建与使用](../adapters/wechat/README.md#stage142)、[新增23/完整709与1bundle检查](../analysis/launcher-wechat-v1/test-results.json)。完整微信宿主/HTTP资源、真实设备/官方认证及游戏仍未完成。

<a id="stage141"></a>
## stage141：日志header接口不承担文件状态与恢复

`parseWin32LauncherUpdateJournalHeader`保持精确16B、stage1..5、历史recordedPhase和not-inspected/not-proven/not-performed语义，无新导出。原生读取器stage0来自GetFileAttributesW无效分支，不是header内新值，不能把缺失/拒绝访问/坏文件输入统称阶段0。新恢复合同依赖外部文件查询/删除/移动，不扩展现有纯字节API。[源与限制](../analysis/launcher-recovery-state-v1/source-check.json)、[状态/动作合同](../analysis/launcher-recovery-state-v1/static-contract.json)。

当前`web/launcher-bootstrap.mjs`的current prepare分支确实调用`decodeWin32LauncherUpdatePackage`并返回update对象，stage140所选声明校验已在现有候选链；该结果仍未执行或取得运行ACK。本轮接口/产品未改，无新测试/构建或设备/官方验收。[验收](validation.md#stage141)。

<a id="stage140"></a>
## stage140：现行候选解码返回启动协议声明

既有`decodeWin32LauncherUpdatePackage(bytes, {expectedMd5, expectedArchiveBytes})`新增冻结的`startupAcknowledgement:{declaration:'v1'|'absent',languageCount,validation:'resource-declaration-only',acknowledgement:'not-observed'}`。声明v1表示所选资源值合法；缺少声明返回absent/0语言，未模拟原生资源加载器。原`executable.validation:'header-profile-only'`及trust/authentication/replacement维持原语义，payload仍是独立可变字节；没有新export或事件/进程API。

type10精确UTF16命名资源下，所有numeric语言叶必须为21B固定ASCII或22B末尾NUL。畸形值抛`UPDATE_ACK_RESOURCE`；所选结构/重复/歧义/循环/映射错误抛`UPDATE_ACK_RESOURCE_FORMAT`；超过64 section、2048所访目录项或256WCHAR名称预算抛`UPDATE_ACK_RESOURCE_BUDGET`。所选映射须唯一且在raw/virtual及文件范围内；声明相同名字的大小写变体拒绝，不静默当legacy。无声明的旧最小头profile保留。错误时既有decoder清零其候选输出，输入副本不受影响；32MiB总预算不改。[格式](resource-formats.md#stage140)、[23原创用例及测试](../analysis/launcher-startup-ack-v1/test-results.json)。

<a id="stage137"></a>
## stage137：现行更新器参数编码

`encodeWin32LauncherUpdateArguments(input)`、`WIN32_LAUNCHER_UPDATE_ARGUMENT_PROFILE`及`LauncherUpdateArgumentError`由shared/index导出。input恰五个own data字段：`parentPid`为1..0xffffffff整数；`urlBytes`1..255B；`launcherPathBytes`4..259B且ASCII盘符绝对前缀；`archiveSizeBytes`1..10位数字、数值1..268435456；`launcherMd5Bytes`恰32hex。字节字段接受实际Uint8Array/ArrayBuffer并独立复制，拒绝共享/分离存储及字节Proxy；容器拒绝accessor/继承/额外字段，不信任可覆盖length/buffer/iterator。

明确ASCII子集；URL/路径不接控制/DEL/双引号/管道符及首尾SP，内部SP编码为管道符。URL保留所选native有限前缀规则，不做完整语法、来源或文件检查。返回冻结record：`profile,argumentBytes,fields:5,archiveBytes,trust,authentication,execution`；argumentBytes是独立可变Uint8Array，≤570B，五字段单SP连接，保留原包长前导零和MD5大小写，无逻辑NUL。后三状态为unverified/unverified/not-performed。

sourceSha256只绑定算法。256MiB只限参数值，既有ZIP/HTTP32MiB预算不变。无IO、原生执行/事件/页面接线或来源认证；13新/88相关/663全Node通过。[源](../analysis/launcher-update-arguments-v1/source-check.json)、[范围](../analysis/launcher-update-arguments-v1/implementation-spec.json)、[测试](../analysis/launcher-update-arguments-v1/test-results.json)。

<a id="stage136"></a>
## stage136：来源选择与当前页面/回环合同

`snapshotLauncherSourceProfile(input)`由shared/index导出。输入须非null非数组对象；own sourceProfile缺失默认为legacy，显式值只接受`legacy`/`win32-current`。undefined/null/别名/大小写变体/继承值/accessor拒绝，getter不作字段值执行；冻结结果`{id, bootstrapProfile, handshakeProfile}`分别映射legacy/generic或win32-current-metadata-v1/current。它是本地政策，不是自动哈希/发布者验证，不增加协议参数。[实现规格](../analysis/launcher-current-page-v1/implementation-spec.json)。

`createLauncherLoopbackServer({...existing, sourceProfile})`在listen前核对选择；runtime v3和bootstrap v1描述增加sourceProfile。`snapshotLauncherBootstrapSource(input, sourceSettings={})`沿用原bytes预算；current下localGameListBytes/localRegionListBytes可明确null，描述对应localInputs URL为null且无该本地路由，页面不请求；catalogDigestBytes可为空。当前locator第二token为实际archive字节数，legacy100仍原进度元数据，包候选只校验/不安装执行。

仅current的`/bootstrap/self`、`update-locator`、`catalog-digests`、`games`、`regions`接受单`?rtm=0..4294967295`规范十进制；前导0、重复、额外字段、编码键、负数/越界、其他路径查询均404。package/localInputs/runtime/静态源没有查询授权；无query的旧路径仍可读，无远程目标/来源新增。

`bindLoginCatalogControls`核对runtime与bootstrap来源匹配后选已有factory；`login-app`把同一冻结选择的handshakeProfile传给会话。原10秒总时限、取消/迟到结果丢弃、候选明确选择、origin/endpoint及账号不存储保持。新增独立Python实际WS/TCP核对当前48B/旧40B密文及错误组无账号请求，650全Node和6页面场景见[测试](../analysis/launcher-current-page-v1/test-results.json)。真实认证和游戏消费者仍未知。

<a id="stage125"></a>
## stage125：保留工具失败回执，不新增业务接口

现有 `text-observer.exe game-installed PID` 对实际PID5136执行一次，打印 `MOLI_TEXT_OBSERVER_V1 stopped code=TEXT_ZERO`，立即读取exit1；未创建 `game-text.bin`。该分支不含基址/页面表/快照摘要，不能按成功回执解析或触发固定传输器。[完整运行](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)。shared/web/native接口及工具源码未改；事件详情尚未回读。

<a id="stage122"></a>
## stage122：产品接口未改，纠正历史启动信息的字符串表示

新增选取的授权、输入恢复与恢复点复核记录；没有新 shared/web/native API、网络字段或读取器 CLI。历史 StartInfo 记录的路径在 JSON 解码后误含双分隔符，实际 Windows 显示为单分隔符，已用[纠正回执](../analysis/game-text-observer-runtime-v1/command-path-correction-stage122.json)明确；旧文件不改，来宾值不改，也不据该回执宣称新前检或启动。

本次游戏执行确认已取得，当前 Mac 锁定；触发块未加载，游戏启动和固定读取均为 0。[授权](../analysis/game-text-observer-runtime-v1/authorization-stage122.json)、[输入](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)。

<a id="stage119"></a>
## stage119：固定反向传输实测闭合，接口范围未放宽

已有receive-fixture模式已实际接收同一来宾文件一次：6624B/SHA25613da500e…146a9d9、original_fixture_received、closed success=true、host exit0，最终端口检查无listener。客户端返回长度0并Dispose。不要重放，原固定实现及限制不变。[返回](../analysis/game-text-observer-runtime-v1/snapshot-return-stage119.json)、[完整字节比较](../analysis/game-text-observer-runtime-v1/host-oracle-stage119.json)。

游戏observer接口仍为`text-observer.exe game-installed <规范十进制PID>`，当前仅准备了[独立启动/观察命令](../analysis/game-text-observer-runtime-v1/game-startup-commands-stage119.txt)，未执行。现有传输器不接受游戏1753452B；只有产生实际捕获、核元数据后才另行准备受限返回。产品模块接口无新增。

<a id="stage118"></a>
## stage118：固定原创文件传输接口及实际调用结果

分析工具`fixed_transfer.py send-observer|receive-fixture --bind … --port 65378 --ttl 600 [--base ACTUAL]`固定两种模式：GET `/text-observer.exe`仅送146798B/16386482…83732f5；POST `/fixture-text.bin`只收固定6624B且必须同时匹配原fixture在实际基址下的SHA和全部预期字节。绑定只允许127.0.0.1同端或当前私有10.211.55.2/3；固定输出CreateNew，禁止任意路径、认证/Cookie、分块或未知长度，一次成功后关闭。TTL是循环/套接字尽力约束，不是所有同步API的硬期限。

实际只执行一次send-observer并完成来宾身份核对/主机exit0；receive-fixture未启动。读取器fixture CLI的一次Windows实测返回6624B/基址00da0000/hash13da500e…146a9d9/exit0，原始快照未传回。产品API未改，该传输器不是游戏服务或跨平台网络适配器。[工具与边界](../analysis/game-text-observer-runtime-v1/README.md)、[运行记录](../analysis/game-text-observer-runtime-v1/fixture-runtime.json)。

<a id="stage115"></a>
## stage115：分析专用固定 `.text` 只读CLI

`text-observer.exe fixture|game-installed PID`只接受规范十进制PID和两套链接固定配置。先核路径/最终文件路径/SHA256/x86/创建时间/模块大小，再完整检查代码页所属主映像及可读可执行属性，单次读取6624或1753452B；不启动或控制目标。固定普通实验目录以CREATE_NEW写profile对应文件，存在即停。成功只报数值/实际基址/长度/SHA256；失败报固定状态及必要区域元数据。[源码和构建](../analysis/game-text-observer-v1/README.md)、[链接配置](../analysis/game-text-observer-v1/host-validation.json)。

`fixture_oracle.py --base ACTUAL --snapshot PRIVATE`只对固定原创fixture离线验证，245个HIGHLOW处理后与6624B逐字节比较；不支持游戏或执行/改写PE。当前39C/6Python只验主机层，真实Windows接口、读出和生命周期待验。[计划](../analysis/game-text-observer-v1/windows-qualification-plan.json)、[oracle检查](../analysis/game-text-observer-v1/fixture-oracle-validation.json)。

<a id="stage114"></a>
## stage114：来源缓存接口增加实际浏览器证据，签名未变

`launcherResourceBindingKey`、`create/readLauncherResourceSnapshot`、`createLauncherResourceStore`与`createLauncherPatchState`均按现有源hash运行。真实Chrome原生IndexedDB读写、完整记录CAS、正常重启、来源绑定拒绝、匹配恢复后明确选择和旧v1兼容通过83项；v2来源0另有页面重载及读副本变异验证。[源审计](../analysis/launcher-cache-source-browser-v1/implementation-source-check.json)、[浏览器回执](../analysis/launcher-cache-source-browser-v1/browser-results.json)。

本轮接口/产品源无变更，79Node属于stage113已有回执，不作为本轮新运行。当前证据是Chrome桌面及手机尺寸原创夹具；物理设备、微信、原站传输/认证/游戏消费者和官方可玩仍未验收。

<a id="stage113"></a>
## stage113：固定Patcher来源计划与显式传输选择

| 接口 | 输入/结果 | 约束与证据 |
| --- | --- | --- |
| `createPuk3PatchSourcePlan` | own `address,portText`→冻结`profileId,sourceSha256,sources` | profile `puk3-195f3afd`；精确主地址221.122.108.10；原portText保留，备选221.122.119.156:80；纯数据 |
| `createLauncherCatalogPatchPlan` | 新可选`patchSourceProfile,patchSourceOrdinal`；新增`patchSources,selectedPatchSource`及binding选择字段 | 默认configured-only/0；ordinal1要求显式固定profile、精确PatchEXE元数据与地址；原processPlan的PIP不改写 |
| `prepareLauncherGamePatch` | 所选来源的清单/所需ZIP→owned候选 | 每个origin另需allowedOrigins；一次准备固定一个origin，失败不自动切换/重试；原取消/完整deadline/事务仍有效 |
| `GAME_PATCH_LIMITS.operations` | 512 | 与blocks512共同约束；manifest256KiB及其他文件/包/路径预算不变；257/512通过、513拒绝 |

`launcherResourceBindingKey`现在保留固定profile/ordinal，默认configured-only/0仍归一到原键；`create/readLauncherResourceSnapshot`对默认写读原resources.v1，对固定来源写读resources.v2（`LAUNCHER_RESOURCE_FORMAT.sourceSchema`），严格校验版本和字段配对。已有IndexedDB envelope不变，浏览器V2持久化尚未实际运行。

profile指明已分析195f…aaa8样本的算法，不是对元数据、已安装文件或远端发布者的身份认证；支持范围窄于native通用ANSI/substring路径。[实现规格](../analysis/launcher-current-entry-v1/implementation-spec.json)、[模块](../shared/launcher-patch-sources.mjs)、[79项测试](../analysis/launcher-current-entry-v1/test-results.json)。本轮不新增游戏业务字段，真实认证/原游戏消费者/移动网页及微信适配待验。

<a id="stage112"></a>
## stage112：沿用opaque控制接口，绑定当前源码范围

现有`encodeLauncherRequest1({wordA,wordB})`对应当前5890c0的tag1+两UInt32BE、9B应用体；词名仅代表原始字节，业务意义/真实调用值待证。type2解析保留两词，flow有界累计preliminary notices，认证仍`unverified`。当前握手/record选择与type10提交契约沿用；本次源链没有要求新增版本前置API。[源规格](../analysis/launcher-current-control-v1/implementation-spec.json)。

无产品源或公共API修改；相关replies/flow/current-record/web-session四测试文件45项通过，未增加复述实现的测试。已有game-installed观察器要求显式profile/PID，仅读8B及区域元数据，尚无原游戏PID/运行资格。[测试](../analysis/launcher-current-control-v1/test-results.json)、[使用说明](../shared/README.md#launcher-stage112)、[游戏能力](../analysis/launcher-current-control-v1/game-capability.json)。

<a id="stage111"></a>
## stage111：现行record API与版本选择

新增冻结LAUNCHER_CURRENT_RECORD_PROFILE：sourceSha256=6d459…c987，key/block8，outgoing<=32712/cipher<=32760/chunk<=65536B，minimumCiphertext0，padding='ceil(n/8)*8+8'。createLauncherCurrentRecordCodec(key8)返回与generic同形encode/decode/close/closed；encode加额外完整零块，decode精确单记录、允许0/0空记录、输出声明前缀而不剥末尾零/不校验padding。createLauncherCurrentRecordStream(key8)同push/finish/close/pending/failed契约，空记录消耗8B并发出空字节块，分片/组合保持顺序。[源与工程差异](../analysis/launcher-current-record-v1/implementation-spec.json)。

现有createLauncherLoginFlow/createLauncherSession选项handshakeProfile='current'统一选择现行握手、编码与解码stream；省略/generic仍走原floor记录/最低cipher8B。类型/状态/cleanup等既有契约保持，快照认证仍unverified。超过单条发送上限按工程错误拒绝，不复制原生队列部分消费；压缩及其他selector不支持。无当前浏览器/真实账号或游戏验收。[测试](../analysis/launcher-current-record-v1/test-results.json)、[使用与复现](../shared/README.md#launcher-stage111)。

<a id="stage110"></a>
## stage110：现行握手源组选择

新增冻结LAUNCHER_CURRENT_CHANNEL_PROFILE（sourceSha256=6d459…c987、公开g/p、三字段各<=256B/总784B）。decodeLauncherCurrentHandshakeChallenge(bytes)检查BE状态/三字段、字面生成元2、逐字节固定模数及1<peer<p，返回与generic同形只读字符串对象；answerLauncherCurrentHandshake(bytes,exponent20B)复用数学/原8B派生规则并保留原生p-1边界。通用decode/answerLauncherHandshake不改既有数学范围，公开参数不作身份认证。[原始依据/支持政策](../analysis/launcher-current-channel-v1/implementation-spec.json)。

createLauncherLoginFlow与createLauncherSession新增可选handshakeProfile:'generic'|'current'，省略为generic，未知值拒绝。current在receive到完整挑战后先校验，再进入challenge-ready/请求熵，answer沿同profile；flow快照新增非敏感handshakeProfile。web以own data读取并传递，getter拒绝，格式失败仅close/hello8B、熵请求0。公开状态仍authentication=unverified。其余record、请求/回复和lease接口不改，不把旧generic自动当现行源等价。[测试](../analysis/launcher-current-channel-v1/test-results.json)、[shared使用](../shared/README.md#launcher-stage110)。

本轮Node观测器是任务专用能力：固定计划端点/一次额度/10秒、只8B hello、最多保留784B输入、关闭等close，仅元数据输出；不提供账号字段或挑战回答。真实529B响应通过源组校验，仍无完整登录/游戏/设备/官方验收。[回执](../analysis/launcher-current-channel-v1/network-observation.json)。

<a id="stage109"></a>
## stage109：profile与handoff状态门槛修正

createLauncherProfileChoices/decodeLauncherProfileChoices/selectLauncherProfile与encodeLauncherHandoffWrite/createLauncherHandoffLease接口不变。stateWord仍为原UInt32，state为signed低16；只允许该16位值0/-4，并继续拒绝billingWord!=0且expiredWord!=0。0x0000fffc/0x1234fffc投影为-4，0x10000投影为0，原word保留；并非规范扩展错误。PROFILE_STATE_ENCODING不再由该路径发出，旧v8/v22此限制已覆盖。手工提供selectionGate不能改变原始字段复核。[原汇编/契约](../analysis/launcher-current-login-v1/implementation-spec.json)。

请求type10/45B/<=18B字段、回复type11五列/双尾word继续复用，W0由原中间适配丢弃；伪代码参数缺失不改变完整尾字段。ownership、UInt32/名称/opaque/列界限、lease清理及authentication/gameAcceptance=unverified保持。[48组原创新向量](../analysis/launcher-current-login-v1/state-vectors.json)、[78相关Node结果](../analysis/launcher-current-login-v1/test-results.json)。没有OS映射/执行或新平台API，剩余限制仍不等于原生完整验证。

<a id="stage108"></a>
## stage108：补齐运行取证与依赖，产品模块接口未变

shared、web、薄适配层及native没有源码/公开接口变化。本阶段新增analysis中的首次正常启动、REA旧更新器、依赖来源/导出资格、只读介质、app-local无覆盖拷贝/四文件备份、第二次独立正常运行及版本桥接回执；不是新增Windows更新服务或浏览器执行EXE能力。[REA](../analysis/game-install-context-v1/rea-updater-stage108.json)、[修复方案](../analysis/game-install-context-v1/vc71-remediation-plan-stage108.json)、[实际结果](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)。

两次临时事件订阅/队列分别归零、两个专用管理员终端正常关闭。原19项键盘菜单保留，第二次未新增键盘项。实际更新/再启动为原厂流程证据，独立实现的事务、适配及官方兼容继续单列验收。[版本对应](../analysis/game-install-context-v1/updated-source-bridge-stage108.json)、[阶段验收](validation.md#stage108)。

<a id="stage107"></a>
## stage107：无产品接口变更，新增安装/REA证据记录

shared、adapters、web与保留native接口均未改。本轮新增的是原安装器退出0、两视图/两关键文件身份与旧版REA对应记录，以及尚未执行的正常目录启动方案；这些JSON不是运行适配器、游戏消费者或平台能力。本轮未重跑既有产品测试，原验证范围不外推。[安装回读](../analysis/game-install-context-v1/platform-installed-stage107.json)、[REA对应](../analysis/game-install-context-v1/rea-bridge-stage107.json)、[需求与门禁](development-plan.md#stage107)。

<a id="stage106"></a>
## stage106：仅增加正常平台安装的证据记录

新增平台方案、前检、运行及许可字段身份JSON；完整正文只留私有build供当前用户审阅，不作为产品资源或接口。当前安装器仍停在拒绝选中的新许可页。shared/web/微信/native接口及原创观察器CLI均未改，新game-installed配置没有原游戏执行。[实际边界](../analysis/game-install-context-v1/platform-runtime-stage106.json)、[许可身份](../analysis/game-install-context-v1/platform-license-stage106.json)。

<a id="stage105"></a>
## stage105：观察工具增加真实安装目录的固定配置

新增原创构建入口 `python3 analysis/game-entry-v1/probe/build_installed_probe.py`，使用现有编译工具及已核fixture，不安装全局依赖；私有产物放 `build/analysis/game-entry-v1/probe-stage105/`，历史产物保留。当前观察器两个位置参数为 `fixture|game|game-installed` 三选一及规范十进制PID，没有任意路径/地址/hash参数。新配置固定真实中文安装路径、原9baa…d3126身份、ImageSize0x103b000和RVA0xe65db8的一次8B读取；其余门禁函数未变。[构建/三行值](../analysis/game-entry-v1/observer-build-stage105.json)、[工具接口](../analysis/game-entry-v1/probe/README.md#stage105)。

新二进制已获来宾完整hash及原创fixture成功案例；新game-installed配置尚未在原游戏上执行。此为分析工具接口，未新增shared/web/微信/native产品API或网络协议。[运行边界](../analysis/game-entry-runtime-v1/windows-observer-stage105.json)。

<a id="stage103"></a>
## stage103：静态读取能力的构建与复核入口

新增原创 `analysis/game-install-context-v1/test_ifps_reader.py --source-dir <私有refinery-source> --deps-dir <私有deps>`。本次固定轮包要求CPython3.12/macOS ARM64（本机workspace工具提供3.12.14，上游源码最低3.11），以 `-I` 运行；先核ifps.py固定SHA，再只对内存原创字节执行Parse/disassembly，7方法全部通过。实际解释器、目录及完整argv可直接从[运行记录](../analysis/game-install-context-v1/reader-qualification-stage103.json)复核；依赖获取来源/版本/摘要与隔离位置见[依赖记录](../analysis/game-install-context-v1/ifps-dependency-stage103.json)。不依赖系统Python3.9，不调用VM、目标API或注册表。

选定厂商IFPS静态输出与完整代码均留私有build，公开仅摘要/偏移/少量锚点及解释。[表/体边界](../analysis/game-install-context-v1/install-conditions-stage103.json)。这项开发能力未进入shared/web/adapters/native；未新增游戏协议接口或更改观察器profile。

<a id="stage102"></a>
## stage102：固定安装介质开发接口

`analysis/game-install-context-v1/prepare_media.py`只接受两份固定原件身份，复制到新私有目录、制作无autorun/boot的ISO并回读精确三成员及hash。已有输出不覆盖；本轮初次仅卷标NUL填充判定失败，修正解码后以`--verify-existing`只读重验同一ISO，未重建或放宽成员门禁。[介质与历史](../analysis/game-install-context-v1/media-stage102.json)。

`transfer_media.py --bind {127.0.0.1,10.211.55.2} --ttl 10..600`只流式提供固定1.1GB ISO的精确URL，NAT GET只接受10.211.55.3，HEAD可回主机元数据；无任意路径、目录、上传或执行。1MiB分块、固定hash/长度、独占一次GET（中断也消费）、socket5秒及应用期限后退出；期限不是全局硬终止保证。来宾CreateNew独占写且完整hash匹配、服务端退出/端口拒绝均实际取得。[7项原创检查](../analysis/game-install-context-v1/transfer-host-validation-stage102.json)、[实际来宾](../analysis/game-install-context-v1/transfer-session-stage102.json)。

Inno debug CLI只读取元数据，无产品安装/注册API新增。shared/web/adapters/native未改，观察器game profile未改；正常安装尚未执行，不开放任意路径/hash/地址/权限覆盖。

<a id="stage101"></a>
## stage101：开发用构建与固定文件传输接口

`analysis/game-entry-v1/probe/build_probe.py`现在输出到私有`probe-stage101/`，加入原创BSS汇编/链接脚本与`pe_layout.py`的窄x86 PE门禁。fixture槽仍`e65db8`、ImageSize改为`e82000`；生成hash/header后构建观察器。旧PE/ISO不覆盖，观察器C源/整个`.text`相等，仅原创身份数据变化。[构建](../analysis/game-entry-v1/observer-build-stage101.json)、[字节对照](../analysis/game-entry-v1/observer-equivalence-stage101.json)。

开发工具`analysis/game-entry-runtime-v1/fixture_transfer.py --bind {127.0.0.1,10.211.55.2} --ttl 10..600`仅缓存两份固定路径/长度/SHA的当前原创PE；NAT GET只接受来宾`10.211.55.3`，无目录/任意路径/上传。每文件一次GET、两响应或期限后关闭，单连接3秒超时不是严格全局硬期限。传输响应不等于来宾落盘或执行通过。[当前19项检查](../analysis/game-entry-runtime-v1/transfer-host-validation-stage101-r2.json)、[实际来宾](../analysis/game-entry-runtime-v1/windows-observer-stage101.json)。

产品shared/web/adapters接口未改。观察器game profile尚不可用：固定路径不存在，须先确定正常安装身份；不能加地址/hash/路径任意覆盖开关或取消权限门禁。

<a id="game-stage96"></a>
## stage96：固定回调元数据开发工具接口

原创 `analysis/game-entry-v1/probe/callback_probe.c`仅接受 `fixture|game`和一个规范十进制PID，拒绝0/前导零/非十进制/UINT32_MAX及更大值；无调用者路径、地址、范围/hash配置。固定profile先核进程身份/架构、路径/最终文件句柄路径、只读磁盘SHA，再开QUERY_INFORMATION|VM_READ|SYNCHRONIZE句柄并核创建时间，以真实模块基址+RVAe65db8一次读8B。index0 cleanup/index1 entry，非零值只VirtualQueryEx页元数据。[先行契约](../analysis/game-entry-v1/observer-plan.json)。

输出固定状态和数值，不输出路径、命令行/窗口、代码/字符串/IPC/凭据；不启动、附加调试器、注入/修改/终止目标，不调整权限。`ok`仅读完成，不证明原子快照、调用、目标业务语义或兼容；磁盘hash不证明运行页身份。拒绝/目标变化即停，无回退更广访问。[源码与构建/Windows待验步骤](../analysis/game-entry-v1/probe/README.md)。

fixture是原创30秒自然退出x86进程，槽同RVA，预期cleanup14c0/entry14b0。26主机PID/地址断言和PE静态核验已过，Windows真实生命周期/guard/ASLR未过；这些工具不进入shared/web/native产品接口。本轮无游戏协议字段或产品API新增。

<a id="launcher-stage95"></a>
## stage95：parseWin32LauncherUpdateJournalHeader

shared/index.mjs新增导出WIN32_LAUNCHER_UPDATE_JOURNAL_PROFILE、LauncherUpdateJournalError、parseWin32LauncherUpdateJournalHeader。纯函数接收精确16B的attached/nonshared Uint8Array（含子视图）或ArrayBuffer；使用内建属性检查和副本，不调用输入迭代器/可覆盖元数据，不进行I/O。[先行契约](../analysis/launcher-update-recovery-v1/implementation-spec.json)。

冻结结果包括profile/headerBytes/version、recordedStage、recordedPhase、integrity=xor-consistency-only；authentication=unverified、fileState=not-inspected、startupAcknowledgement=not-proven、recovery=not-performed。阶段1..5的英文名依次before-replacement、backup-moved、replacement-installed、awaiting-startup-ack、commit-recorded，均表示已记录阶段而非当前事实。

错误码JOURNAL_INPUT、JOURNAL_HEADER_LENGTH、JOURNAL_MAGIC、JOURNAL_VERSION、JOURNAL_CHECKSUM、JOURNAL_STAGE；没有读取失败/文件缺失到阶段0的隐式映射，也没有恢复动作。校验顺序为长度→magic→version→xor→stage，诊断码是独立接口细分。原生前16B读取与精确header的尾随差异、ownership/shared/detached/代理/类型边界均有意义测试。[实际验收](../analysis/launcher-update-recovery-v1/validation.json)。

<a id="launcher-stage94"></a>
## stage94：createWin32LauncherCatalogRefresh

web/launcher-catalog-refresh.mjs新增 `createWin32LauncherCatalogRefresh({httpClient,store,cacheTick})`，返回只含 `refresh(input)` 的冻结控制器。store使用现有candidate-store的read/commitPair契约；输入为own data字段launcherBytes、五项endpoints、encoding、allowBareAmpersands，以及可选timeoutMs/signal。字节先快照，拒绝shared/detached输入；1..60000ms为整条读取/HTTP/提交的总预算，同一控制器只运行一项。[先行规格](../analysis/launcher-current-refresh-v1/implementation-spec.json)。

返回 `launcher-update-candidate` 时只含已校验候选且committed=false；目录分支返回 `catalogs-unchanged` 或 `catalogs-committed`、catalogs、comparison、revision与committed。字节和解码选项相同时重读revision，冲突报REFRESH_CONFLICT；需变化时一次commitPair(expectedRevision)，保存整对。迟到取消/预算后真实已提交回执仍为committed=true，另给cancellationTooLate/deadlineExceededAfterCommit。若适配器的commit回执畸形或异常未知，REFRESH_COMMIT_UNCONFIRMED要求读回，不能称回滚。

其他错误为REFRESH_INPUT/BUSY/CACHE/DATA/ABORTED/TIMEOUT，消息不回显底层错误或地址。所有成功结果保留trust/authentication未验证和execution未执行。encoding/allowBareAmpersands变化可单独更新缓存元数据，为独立政策；页面/旧bootstrap默认不变，无进程/账号/游戏功能。[22定点与真实浏览器验收](../analysis/launcher-current-refresh-v1/validation.json)。

<a id="launcher-stage92"></a>
## stage92：显式新版元数据和 HTTP 工厂

shared/index.mjs新增三个导出：parseWin32LauncherDigestResponse(bytes)返回规范小写md5与保留大小写的comparisonText、修边/截断计数；parseWin32LauncherUpdateLocatorResponse(bytes)返回保留原文的locator/archiveBytesText、数值archiveBytes和忽略token数；createWin32LauncherMetadataPlan(input)仅接受own data字段launcherBytes、launcherDigestResponseBytes及按需locatorResponseBytes。后者当前分支不读取闲置locator，返回catalog-pair-needed及固定请求顺序；不匹配返回launcher-candidate-needed。新纯API拒绝shared/detached/proxy字节、访问器和多余输入，输出冻结且保持trust/authentication未验证。[原创边界向量](../analysis/launcher-current-metadata-v1/original-vectors.json)。

WIN32_LAUNCHER_MANIFEST_LIMITS：metadata4096B、local file32MiB、locator255B、archive256MiB、archive文本10位；token独立上限128。locatorValidation=native-prefix-only不表示完整URL有效，完整请求还需HTTP适配器验证。LauncherManifestError提供有界错误码。

web/launcher-bootstrap.mjs新增createWin32LauncherBootstrap({httpClient, cacheTick?})，默认cacheTick取独立浏览器performance.now的uint32，不冒充Windows uptime。prepare(input)要求own data的launcherBytes、gameListBytes、regionListBytes、endpoints、encoding、allowBareAmpersands；旧配置两字段允许明确null表示无可用快照，另可有timeoutMs/signal。端点仍需五个own bounded字符串；编码只能显式utf-8或gb18030，整个异步调用共享截止/取消。

main元数据/配置GET依原字符串是否含?追加?rtm=或&rtm=，不去重已有rtm；cacheTick必须uint32，package不加该查询。更新返回launcher-update-candidate及严格stage88 update；配置返回catalogs-prepared、initialPlan、完整catalogs、stage91 containers/comparison和catalogDigestMetadata的长度/use=request-success-only。32MiB声明预算在包GET前检查；局部计算配置MD5只供候选一致性。所有输出都是准备结果，不写入/替换/执行/认证。旧createLauncherBootstrap与页面默认调用保留。[运行用法](../web/README.md#launcher-stage92)、[验证](../analysis/launcher-current-metadata-v1/validation.json)。

<a id="launcher-stage91"></a>
## stage91：新版配置对的纯检查接口

`inspectWin32LauncherCatalogContainers(gameListText, regionListText, options={})`接已经解码的文本。options仅可有own boolean `allowBareAmpersands`，缺省false；复用既有256K字符、节点/深度/实体等XML子集，返回冻结的`gameList`/`regionList`/`containersPresent`和`validation='containers-only'`、`gameSemantics='unverified'`。名字大小写精确、直接子容器存在即可，空容器/未知字段不在此验证；完整`parseGameCatalog`/`parseRegionCatalog`保持严格。内部处理指令明确不支持，语法/预算错误抛LauncherError。

`compareWin32LauncherCatalogPair(input)`要求恰好四个own data字段：`currentGameListBytes`、`currentRegionListBytes`、`gameListBytes`、`regionListBytes`。输入是实际Uint8Array/ArrayBuffer，各限1MiB；两个current可明确null，表示字节不可用，不推定文件缺失原因。拒绝detached/shared/proxy及accessor/额外字段；先拥有副本，再比较长度和所有字节。冻结结果分别为`identical/different/unavailable`，任一非identical则`requiresReplacement=true`，`replacementUnit='catalog-pair'`。不解析XML、不做I/O/提交/恢复或来源认证，使用LauncherCatalogPairError区分输入/预算失败。

两个检查应由适配层分别按明确的字节与文本来源调用，不能把容器存在当完整游戏配置或原生提交成功。默认页面/旧bootstrap未接新导出。[证据和限制](../analysis/launcher-current-catalog-v1/implementation-spec.json)、[实际验收](../analysis/launcher-current-catalog-v1/validation.json)。

<a id="launcher-stage88"></a>
## 新版Win32 GUI更新候选接口（stage88）

| 接口/字段 | 输入或输出 | 范围 |
| --- | --- | --- |
| decodeWin32LauncherUpdatePackage | archive Uint8Array/ArrayBuffer，options恰有own data `expectedMd5`与`expectedArchiveBytes` | 大小写hex32；声明1..32MiB且等于真实包长；不读属性getter/继承值，不强转 |
| 解析顺序 | 既有ZIP结构→声明大小→恰1普通条目→ASCII无路径.exe名称→膨胀预算→CRC/MD5→PE头 | 新接口另限可打印ASCII/32MiB；原生更大/非ASCII未覆盖；底层ZIP错误保留 |
| executable | peOffset/machine/optionalHeaderMagic/subsystem/headerBytes/validation | e_lfanew64..1048575，NT248字节，14c/10b/2；validation=`header-profile-only` |
| candidate | 既有archive/entry/payloadBytes/actualMd5/digestMatches/crcVerified，新增profile/expectedArchiveBytes/archiveSizeMatches/executable | 拥有bytes、冻结元数据对象；profile=`win32-gui-single-exe-v1`，trust/authentication仍unverified，replacement=not-performed |

新增错误 `UPDATE_PROFILE_INPUT`、`UPDATE_ARCHIVE_SIZE`、`UPDATE_ENTRY_COUNT`、`UPDATE_ENTRY_NAME`、`UPDATE_EXPANSION_BUDGET`、`UPDATE_EXECUTABLE_HEADER`；保留 `UPDATE_DIGEST_MISMATCH`及原ZIP错误。失败自有输出会清理，不承诺整个JS堆或调用者副本擦除。头字段通过不代表完整PE、签名、加载/运行成功；名称只作元数据，未用作文件路径。旧接口行为不改。[规格](../analysis/launcher-current-updater-v1/implementation-spec.json)、[本轮548项Node/真实包验收](../analysis/launcher-current-updater-v1/validation.json)。


<a id="game-consumer-v1"></a>
## 当前游戏消费者接口边界（stage76）

本阶段只补静态证据，不新增产品API。已保留的命令/cwd/resource/映射prefix及lease属于登录器生产端；不得用`1194850`的注册类开关为游戏消费接口命名，也不把空xref定义为拒绝/成功行为。真实gameconsumer的输入长度、终止、字段/状态/认证契约仍待证。[证据与覆盖](../analysis/game-consumer-v1/static-spec.json)。shared/web/native源码与现有接口保持原字节，未重跑产品测试。

<a id="launcher-v30"></a>
## 当前首次Config与onlyRefresh接口（stage75）

| 接口 | 输入→输出 | 边界 |
| --- | --- | --- |
| createLauncherFirstConfigPlan | own username/codeText/directory/configurer bytes及firstConfigWord:uint32→lookup/可选command/cwd/条件 | username0..16B、其他4096B、Code1..10位/0..14、非NUL/非共享；原bytes不猜ACP/quote；lookup accountDerived，不认证、不I/O |
| lookup | MD5(raw当前username)→NUL section；Game+原Code+_Config→NUL key | default1；section/key次序与license不同；不保存真实账号标记或输出到页面 |
| interpretLauncherFirstConfigOutcome | planDisposition及相关路径的processCreated/waitReturned布尔→等待/继续/写0意图 | skip不读created，失败不读wait；wait未返不继续，返回后原分支不检wait码/exit/写结果；全程not-performed/unverified |
| parseGameCatalog.configurerText | ConfigEXE解码后正文→原斜杠/空格 | files.configuration仍为原规范路径元数据；无文件执行 |
| createLauncherCatalogFirstConfigPlan | 核验pair/选择/目录/编码+明确用户bytes/标记快照→binding+firstConfig计划 | ordinal/可选Galaxy重核；binding无username/lookup；资源字段不读取，真实Profile/账号不自动获取 |
| createLauncherCatalogProcessInput.onlyRefreshWord | 可选own uint32（缺省0）→既有process字段 | CG0/1/2/4/11且非零不读resourceGroups；其他分支按原规则；getter/强转拒绝 |
| login-launch onlyRefresh | owned checkbox→明确重准备/资源跳过/失效 | 锁定伪造change还原，目录仍必需；已选补丁保留；reset/pagehide清，不持久化 |
| login-app反馈 | lease.clientCreationRequested→普通或仅刷新交接说明 | 不增加wire字段，不请求原游戏或宣称票据/认证有效 |

FIRST_CONFIG_INPUT/BUDGET/NUL/STATE错误不回显数据；web边界仍LAUNCH_DATA。输出含账号派生section，消费者应私有持有并按ownership清理；本轮只用原创输入，无真实Profile或账号持久化。原Config消费者/游戏/实际ACP/EH/平台仍未验。[契约](../analysis/launcher-v30/implementation-spec.json)、[源](../analysis/launcher-v30/static-spec.json)、[验收](../analysis/launcher-v30/validation.json)。

<a id="launcher-v29"></a>
## 保留资源快照与本机事务接口（stage74）

| 接口 | 输入→输出 | 边界 |
| --- | --- | --- |
| snapshotLauncherResourceBinding / launcherResourceBindingKey | catalog patch binding→冻结准确字段／固定顺序JSON key | 只取两XML摘要、原三个ordinal/Code/目录/路径编码/可选Galaxy；无display/账号字段；不是官方格式 |
| createLauncherResourceSnapshot | own binding/files→schema/binding/files{path,bytes,md5}/trust | 拥有bytes；现有相对ASCII路径/树与1024文件/32MiB各/64MiB总；空值支持；无I/O |
| readLauncherResourceSnapshot | 存储模型→全格式/规范绑定/所有文件MD5重核后的own snapshot | 准确keys，拒绝新schema/trust、非规范路径、undefined Galaxy、共享/假byte对象和坏摘要 |
| createLauncherResourceStore | 显式profile/可选IDBfactory→databaseName/read/commitResources | DBversion1/sole snapshots/key selected；空读revision0，写前snapshot，expectedRevision CAS，readwrite单完整record |
| read/commitResources options | 可选真实signal/timeoutMs，写必需expectedRevision→owned resources或committed/revision/迟到标志 | 默认10s/max60s总时限；完成事件才提交；取消已晚/完成确认过时不假报回滚 |
| patch-state.copySelectedResources / restore | 已明确选择→独立资源快照；快照+expectedBinding→ready/cache | 无私有payload别名，恢复先清旧状态，严格绑定/摘要，失败不留就绪；再次choose才能继续 |
| login-patch-cache | 当前binding/selected snapshot/restore/onBusy→明确检查/保存/读入/取消 | profile login-patch-local；只元数据入DOM；局部代次/锁/受控错误，不自动保存或迁移 |

资源错误RESOURCE_INPUT/FORMAT/BINDING/BUDGET/FILES/DIGEST；存储错误RESOURCE_CACHE_INPUT/UNAVAILABLE/CANDIDATE/TIMEOUT/ABORTED/BLOCKED/STORAGE/SCHEMA/CORRUPT/CONFLICT。存储返回trust=unverified；未知/坏/冲突记录保留，无delete/清库接口。IDB get先产生浏览器clone再做自有校验，不承诺流式、quota、断电或浏览器驱逐耐久性。[完整契约](../analysis/launcher-v29/implementation-spec.json)。

Node501、Python2参考、真实IDB12/页面13和旧流程19项通过；交付示例保存/重载/恢复后实际原创交换通过。[验收](../analysis/launcher-v29/validation.json)。原生安装提交/恢复、完整数据容量、真实服务与游戏/设备/官方接受仍未完成。

<a id="launcher-v28"></a>
## 保留补丁页面、文件读取与选择接口（stage73）

| 接口 | 输入→输出 | 边界 |
| --- | --- | --- |
| readLauncherPatchFiles | 显式entries{relativePath,file:Blob/File}、signal/timeoutMs→拥有的files{path,bytes} | 先快照/路径校验/预算再读；剥一个共同目录根，1024文件/32MiB各/64MiB总；调用内建Blob方法；空文件/空输入支持 |
| createLauncherPatchState | 可注入prepare/readFiles/onChange→prepare/choose/cancel/reset/snapshot/selectedPaths | 固定10秒总时限，配置先于首await快照；代次隔离；ready且无skip才可choose；snapshot仅名字/计数/绑定，无payload别名 |
| bindLoginPatchControls | runtime、getSelection/createInput/onChange→refresh/setLocked/invalidate/end/required/ready/selectedPaths | 条件面板、实际FileList读取、取消/选择/放弃；未选完整候选不放行账号；不读取账号或写安装目录 |
| login-catalog.patchSelection/createPatchInput | 当前pair/原ordinal/用户目录和编码→所需补丁元数据或绑定输入 | 当前selection与操作锁重核；PIP/PPort不从BIP继承许可 |
| login-launch.selectedPaths | 所选候选path strings或null→既有七组资源参数 | 有候选时覆盖原目录名字；只传元数据，空候选显式空组；prepare与field通知区分，避免选择后自失效 |
| snapshotLauncherPatchOrigins/Runtime | 可选配置→冻结精确来源列表/运行描述 | 1..16个canonical http://127.0.0.1:port，拒绝路径/主机名/凭据/重复/非回环；undefined保持默认无能力 |
| createLauncherLoopbackServer新增gamePatchOrigins | 明确本机来源数组→可选runtime.gamePatch与CSP来源 | 默认shape/CSP不增项，无代理/新路由；原4173离线CSP不变 |

文件读取错误PATCH_FILE_INPUT/PATH/BUDGET/READ/ABORTED/TIMEOUT；路径及HTTP/ZIP核心错误code保留，UI只显示受控文字。reset/cancel释放自有候选和待用进程字节，清旧交接；外部copy/JS堆不承诺擦除。候选/选择不持久化，XML缓存恢复清选。完整政策和新旧职责见[契约](../analysis/launcher-v28/implementation-spec.json)，Node491/Chrome13新+6默认回归及独立示例通过，[验收](../analysis/launcher-v28/validation.json)。没有原生文件提交、游戏消费或官方认证。

<a id="launcher-v27"></a>
## 保留补丁入口、迭代与下载接口（stage72）

| 接口 | 输入→输出 | 边界 |
| --- | --- | --- |
| parseGameCatalog新增patcherText | PatchEXE的解码后正文 | 保留原斜杠/边缘空格；files.patcher规范路径仍独立，原调用契约保持 |
| createLauncherPatchPlan | own Uint8Array directory/patcher/codeText/address/port Bytes、alreadyPatched布尔、caseProfile=ascii → command/cwd/原及备份路径/Code复制源bytes | 原始未引用命令，各字符串需NUL结尾者显式补NUL；4096B字段/32767B构造预算；不执行复制/属性/进程/删除 |
| interpretLauncherPatchExit | exitCode无符号32位、attempt1..3 → disposition/markPatched/retry/nextAttempt | 100完成；101失败；102有限重试；其余异常；完整性/认证仍unverified |
| createGamePatchCandidateRun | manifestBytes、files → generator | 创建时快照；next()仅给下一包描述，next(bytes)推进，done.value才含最终files；return()丢待处理计算 |
| createLauncherCatalogPatchPlan | catalogs、gameOrdinal/referenceOrdinal、可选galaxyOrdinal、directoryText/pathEncoding、alreadyPatched → binding/processPlan/patchEndpoint | 重核摘要和结构、保留重复Code和原正文；来源未授权、未执行 |
| prepareLauncherGamePatch | 同上+files/allowedOrigins/epochSeconds，可选signal/timeoutMs/fetchImpl → candidate/requests/binding/plan或明确skip | 一个总1..60000ms时限；显式非负signed32秒；只选中来源，按顺序只取所需包；异常无部分候选 |

新HTTP错误GAME_PATCH_INPUT/ENDPOINT/URL_PROFILE/TIMEOUT/ABORTED；下层CATALOG/LauncherText/LauncherPatch/GamePatch/HTTP/ZIP错误保留code。HTTP清单最多1MiB后再经256KiB语法预算、包各32MiB/总64MiB；URL名含?/#/%或空白拒绝，不猜测转义。不自动请求硬编码后备或模拟Win32错误重试。原BIP许可不扩成PIP许可；全输出trust/authentication=unverified、replacement/execution/fileOperations=not-performed。[完整契约](../analysis/launcher-v27/implementation-spec.json)。

配置和files在首个await前快照；generator未完成时不返回files，但不承诺JS堆清零。旧同步包API缺失/多余/CRC/MD5/路径错误政策保持。Node478与Chrome11流程、固定配置8命令通过；原生文件/进程、页面补丁选择/存储及官方兼容未验。[验收](../analysis/launcher-v27/validation.json)。

<a id="launcher-v26"></a>
## 保留游戏补丁字节接口（stage71）

| 接口 | 输入与输出 | 范围 |
| --- | --- | --- |
| parseGamePatchManifest | bytes → blockCount、operations、skippedBlocks、trust | operations含原blockOrdinal/operation/有序keyBytes与valueBytes、ignoredLineCount、duplicateFieldCount；忽略未知命令，重复key保留首次；新NUL/预算拒绝政策 |
| decodeGamePatchArchive | ZIP bytes → archive metadata、entries(entry/payloadBytes)、crcVerified | 所有条目校验CRC/严格Deflate；目录首项允许且payload必须为空；ZIP错误仍LauncherUpdateError |
| applyGamePatchCandidates | own manifestBytes、files(path/bytes)、archives(blockOrdinal/bytes) → owned files、操作报告、manifest | 支持create/append/replaceto；current、updated、skipped-base-missing、skipped-missing-fields分别报告；无I/O |
| GamePatchError | code/message | PATCH_INPUT/BUDGET/NUL/PATH/PATH_ALIAS/DIGEST_POLICY/ARCHIVE_INPUT/MISSING/UNUSED/APPEND_CHUNK/DIGEST_MISMATCH；ZIP结构错保持原ZIP错误 |
| GAME_PATCH_LIMITS | 固定预算 | manifest256KiB、512块、512操作、每块256行、字段4096B；1024文件/单文件32MiB/总64MiB；包单32MiB/总64MiB；路径259B |

files与archives必须是显式数组，字段必须own data；清单/文件/包输入先复制。档案必须与实际消费操作一一对应，未用包拒绝。所有候选要求小写完整MD5，路径为相对ASCII、斜杠归一化，拒绝大小写别名/遍历/保留名和文件目录冲突。append只推广named chunk；replaceto成功候选移除old_name且源目标不可别名。当前文件摘要相等时create/replaceto跳过；append缺基文件明确跳过。[逐项政策与原行为差别](../analysis/launcher-v26/implementation-spec.json)。

输出trust/authentication=unverified、replacement=not-performed；Object.freeze不冻结typed bytes，调用者拥有输出，不能把其变成原生更新/执行授权。没有Windows属性/时间/DBCS、原三次重试或shell删除仿真。Node457与实际Chrome同向量通过，示例实际运行，[验收](../analysis/launcher-v26/validation.json)。

<a id="launcher-v25"></a>
## 保留Galaxy配置与选择接口（stage70）

| 接口 | 输入→输出 | 边界 |
|---|---|---|
| parseRegionCatalog | Galaxylist/Galaxy Name/Gamecode/叶正文→可选冻结galaxies{ordinal,gameCode,name,text} | max15独立预算、槽0..14、非空Name；空/不存在保持旧shape，未知子节点/非结构正文拒绝 |
| listGameGalaxies | 游戏/区域两个ordinal→匹配game的原galaxyOrdinal、Name/正文、available或ambiguous-name | XML源次序、保留过滤后的原序号；跨整个区域exact同名禁选，不宣称原widget排序/locale全等 |
| selectLauncherRegion | 第五options own galaxyOrdinal→可选galaxyOrdinal/galaxyName/galaxyArgs | 有匹配必须明确选，无匹配跳过且拒绝旧ordinal；不存在/其他game/重名拒绝，不coerce/getter |
| createOfflineRegionLaunchPlan | 原目录options+galaxyOrdinal→file/region计划 | 同步传递选择，不读实际设置、文件或执行 |
| bindLauncherSessionTarget | 明确galaxyOrdinal+原catalog/allowlist→可选分组标识 | 不改GameCode原文/数值、BIP或许可身份；无连接授权提升 |
| createLauncherCatalogProcessInput | 当前绑定分组→额外原正文按路径profile编码 | 既有producer在base/region后加非空Galargs，映射/auth独立 |
| login-catalog | 条件分组下拉→明确选择/当前target | 初始空、重名项禁选；变化清旧数据，缓存不恢复选择；无匹配控件隐藏 |

[完整契约](../analysis/launcher-v25/implementation-spec.json)、[源码锚点](../analysis/launcher-v25/galaxy-anchor-audit.json)、[验收](../analysis/launcher-v25/validation.json)。独立实现不仿原inclusive-loop/atoi越界或按名回退；没有原Windows、游戏消费或官方认证操作。

<a id="launcher-v24"></a>
## 当前统一交接与页面资源端口（stage69）

| 接口 | 输入→输出 | 边界 |
|---|---|---|
| createLauncherLaunchLease | own processInput+selected.profile/opaque/tail→snapshot/takeContext/close | 先process验证，再同gameCode映射；只借出一次，失败/关闭清command/cwd/pattern/mapping，auth/game未知、未执行 |
| close擦除 | 固定Uint8Array.prototype.fill作用于真实owned views | 不调用消费者改写的fill，已转移/分离view不阻断其余清理；外部copy/转移目标非保证 |
| encodeLauncherProcessField | string+明确ascii/windows936/UTF8→owned bytes | 可空、HT/LF/CR保留、max4096code units/bytes；不推断ACP/quote/trim，credential原规则保留 |
| snapshotLauncherDirectory | own ordered{relativePath}数组→七组snapshot/计数 | 32768文件/每组4096，单root、无路径穿越/ASCII大小写别名；匹配Bin/Puk2/Puk3固定长名规则，只读元数据，属性32不代表真实Windows属性 |
| createLauncherCatalogProcessInput | 新校验pair/两个ordinal+明确目录/路径编码/七组→processInput | 使用现有保守local path policy与选中EXE/base/regionArgs，CG分支必须资源snapshot；无HKCU/INI自动查找，Galaxy继续拒绝 |
| login-catalog.createProcessInput | 当前candidate/selection与本地选项→绑定输入 | locked/operation/无selection时拒绝，不能按重复Code或UI+1推算 |
| login-launch控件 | 原生File.webkitRelativePath→metadata适配/显式准备 | 无file.arrayBuffer/text读取或上传；修改使旧交接失效，尝试但未准备不能映射fallback；config/pagehide重置 |

[完整契约](../analysis/launcher-v24/implementation-spec.json)、[共享例子](../shared/examples/launcher-launch.mjs)、[验收](../analysis/launcher-v24/validation.json)。snapshot无raw payload；冻结metadata不冻结bytes或擦整个JS堆。尚无实际game-entry调用/Windows映射或官方认证。

<a id="launcher-v23"></a>
## 命令/cwd与枚举结果快照（stage68）

| 接口 | 输入→输出 | 边界 |
|---|---|---|
| createLauncherResourceArguments | caseProfile ascii、state find-failed或enumerated、ordered entries{attributes:uint32,fileNameBytes}→bytes/rows/计数 | 失败不读entries；非共享真实U8/AB、ASCII basename1..259、title≤255；directory位10h，末条/重复/原序保留 |
| 标题转换 | 去末扩展名→ASCII lower→最后index>0下划线改冒号→首命中info/graphic/anime/coordinate家族全替换→前导空格 | 不推断实际CRT locale、DBCS或Windows匹配；提供者负责枚举来源 |
| createLauncherProcessPlan | own gameCode0..14、uint32 onlyRefreshWord、directory/executablePath/argsLine/regionArgs/galaxyArgs各Bytes→commandLineBytes/workingDirectoryBytes | 五字段已解析、非NUL/≤4096B/可空；EXE+space+base+[space+非空region]+[space+非空galaxy]+资源+NUL，无quote/trim/编码转换 |
| resourceGroups | 仅Code0/1/2/4/11且refresh0需exact7原序ID和显式caseProfile→patterns/rows | 其他分支不读资源字段；每组4096条，最终命令含NUL≤32767B；pattern为rawdir+原suffix+NUL |
| cwd/context | Code3加Bin、Code5加GBrowser后缀，其余原dir；applicationName null/inheritHandles false/flags0/environment inherit | clientCreationRequested在refresh非零时仅0/1/2/4/11为false；是局部分支，upstream/auth/game均unverified，execution not-performed |
| ownership/errors | 输入真实byte复制；finally清临时自有copies，输出bytes归调用者 | 冻结metadata不冻结bytes；拒绝共享底层、getter/继承/数组洞/descriptor异常，受控错误不回显；无全堆擦除承诺 |

[完整契约](../analysis/launcher-v23/implementation-spec.json)、[原创例子](../shared/examples/launcher-process.mjs)、[验证](../analysis/launcher-v23/validation.json)。本轮没有文件系统/进程/IPC适配或新UI，实际消费与目标平台未验。

<a id="launcher-v22"></a>
## 映射写入数据与借出生命周期（stage67）

| 接口 | 输入→输出 | 边界 |
|---|---|---|
| encodeLauncherHandoffWrite | own gameCode0..14、selected.profile{nameBytes,stateWord,billingWord,expiredWord}/opaqueByteField/tailWordA→冻结metadata+owned bytes | name1..41B非NUL、opaque0..32B，实际非共享U8/ArrayBuffer复制；原UInt32保留/低16 state0/-4及billing gate复核（stage109修正），错误不回显 |
| 原生产格式 | 原标签/raw name/opaque到首NUL/调整word的小写base32/尾空格/NUL | ≤92B写入前缀、容量256，未写尾部不清零；没有编码推断、escaping、OS mapping或argv |
| createLauncherHandoffLease | 同上→snapshot/takeWrite/close | ready→taken一次或closed；无名字分支not-required不能take；snapshot只元数据，close清自有及借出view，外部copy不受控 |
| login-app pendingHandoff | actual session selection→本页private lease/映射名和长度显示 | 原返回name/opaque copy随后清除，不写DOM payload/Storage/下载，不调用游戏消费者 |
| clearResult/pagehide | 输入/配置/文本/模式/编码/生命周期变化→关闭lease/清候选与就绪显示 | 模式取消保留；pagehide同时重置输入/文本/确认和状态，受控事件测试不等于完整BFCache |

名字分支0/1/2/4/11=CGSharedMem，3/5/6/7/9分别KOH/ZZ/FE/CGC/CG2SharedMem；其余支持槽位为空映射。映射名/字节正确仍不证明业务身份/游戏接受。[规格](../analysis/launcher-v22/static-spec.json)、[契约](../analysis/launcher-v22/implementation-spec.json)、[运行](../web/README.md#launcher-v22)、[验收](../analysis/launcher-v22/validation.json)。

<a id="launcher-v21"></a>
## 非秘密模式记录与浏览器存储（stage66）

| 接口 | 输入→输出 | 边界 |
|---|---|---|
| shared/launcher-preferences:encodeLauncherUserModePreference | primitive数字1/2→canonical JSON string | 固定schema/userMode两key，拒绝强转/其他字段；无账号或I/O |
| decodeLauncherUserModePreference | ≤128字符的own-format string→冻结schema/userMode | 先限长、严格JSON与规范回编码一致；未知/额外/重复/非规范记录拒绝，错误不回显 |
| LAUNCHER_PREFERENCE_FORMAT / LauncherPreferenceError | schema/key/maxChars、固定code/message | 无DOM/Node/Storage/wx；错误只给PREFERENCE_MODE或PREFERENCE_RECORD |
| web:createLauncherPreferenceStore({storageProvider}) | 默认懒取localStorage→readMode/saveMode | 只用固定同源key；每次固定owner/get/set方法，其他key不读写，无自动删除/回退 |
| readMode() | 无账号参数→missing/loaded/invalid/unavailable | loaded才给userMode；未知/坏记录保留、不自动写 |
| saveMode(1或2) | 数字→saved/unavailable/unconfirmed及writeAttempted | 验输入后访问provider；set后原端口get完全相等才saved，已调用写但异常/不一致均未确认；不承诺CAS/持久耐久 |
| login-app / save-input-mode | 已选模式→明确保存状态/刷新恢复 | 账号/勾选/账号编码/文本/确认不传store。读取合法mode后按原初始化默认重建标志，字段空/编码ASCII |

模式变更确认绑定当前target/mode，取消保留原输入，确认清输入/确认/候选；配置/文本I/O、review、modal、exchange全锁，合成锁定事件还原owned值，隐藏确认不能切换。[契约](../analysis/launcher-v21/implementation-spec.json)、[运行](../web/README.md#launcher-v21)、[验收](../analysis/launcher-v21/validation.json)。原26字面引用清单不是账号持久化的全局证明。

<a id="launcher-v20"></a>
## 显式文本字节与UI所有权（stage65）

| 接口 | 输入→输出 | 边界 |
|---|---|---|
| shared/launcher-text:encodeLauncherCredential | primitive string + own `{encoding}`→新Uint8Array | ascii/windows-936/utf-8显式选；≤64 UTF16单元、结果1..16B；拒绝控制/孤立代理项/不可映射；不回显输入 |
| decodeLauncherProfileName | 实际Uint8Array/ArrayBuffer + own `{encoding}`→string | 1..41B、复制后严格解码/逐字节回编码；调用者不变；失败受控，排序由既有原bytes模块负责 |
| LAUNCHER_TEXT_ENCODINGS/LIMITS/LauncherTextError | 固定profiles/16B及41B等边界/固定受控错误 | 不含DOM/Node/TextEncoder/Decoder或存储/网络；error只给code/message和byteLength/null |
| web/launcher-ascii:encodeLauncherASCII | 旧ASCII调用→共享encoder | 保留旧INPUT_ASCII受控错误契约 |
| login-app编码控件 | 明确选择→owned profile/计数/请求捕获 | 切换清输入/确认/候选；异步I/O/确认锁定，锁定change还原；名字不可读或旧session禁止选择 |
| loopback runtime | 支持能力→moli.loopback.v3/credentialEncodings数组 | 精确三项，不宣称机器ACP；原传输字段/白名单/预算保持 |

936固定Unicode/Microsoft2.01映射/80=Euro，UTF-8严格canonical/BOM不剥离；三者无trim/规范化/替换。用户名同bytes用于许可MD5和请求。XML/cache编码独立、无profile或账号持久化。[契约](../analysis/launcher-v20/implementation-spec.json)、[运行](../web/README.md#launcher-v20)、[验收](../analysis/launcher-v20/validation.json)。实际ACP/IME与真实服务语义仍待证；历史证据事故见[记录](../analysis/launcher-v20/artifact-output-incident.json)。

<a id="launcher-v19"></a>
## 配置选择与初始化合流（stage64）

| 接口 | 输入→输出 | 边界 |
|---|---|---|
| web/launcher-target.mjs:bindLauncherSessionTarget | own catalogs/gameOrdinal/referenceOrdinal/allowedEndpoints→冻结目标 | 重验原pair/MD5/结构；原Code文本与数值分开，原BIP顺序/tuple全量允许检查；不读账号/连接 |
| web/login-catalog.mjs:bindLoginCatalogControls | runtime、onTarget/onBusy→setLocked/cancel/无秘密snapshot | File/显式缓存/HTTP候选统一；只输出校验目标，变更清旧状态，busy/review锁控件；File取消只阻止应用，不能强制终止原生Promise |
| adapters/node/launcher-bootstrap-source.mjs:snapshotLauncherBootstrapSource | 显式本地参考/remote目录/摘要bytes、选项、可选package→describe/read/dispose | own数据/复制/固定路由，单main或package32MiB、XML1MiB、metadata4KiB、合计36MiB，无fs/上游 |
| createLauncherLoopbackServer | 原端点/端口/标签，可选bootstrap与旧gameCode元数据→runtime v2 | UI Code只取所选XML；bootstrap只给固定同源描述符，原Host/Origin/token/端点限制保持 |
| makeSyntheticSessionLauncher | 明确1..10回环端点→原创XML/初始化源bytes | 仅示例/测试，含重复Code11、闭区/缺失/拒绝目标；没有官方配置或资产 |

HTTP参考输入与prepare共同一个10000ms截止，剩余值逐次传递，应用前复核绝对时间；更新候选无catalog/会话目标、不执行。缓存仍用launcher-local自有pair，显式检查/CAS保存/恢复，确认晚提交时报告已保存。请求计数是独立当前页政策；Code0..14低层范围不保证各许可槽位UI可用。[契约](../analysis/launcher-v19/implementation-spec.json)、[运行](../web/README.md#launcher-v19)、[验收](../analysis/launcher-v19/validation.json)。

<a id="launcher-v18"></a>
## 浏览器登录与回环桥接（stage63）

| 接口 | 输入 → 输出 | 边界 |
|---|---|---|
| `web/launcher-ascii.mjs:encodeLauncherASCII` | 明确1..16个U+0020..U+007E字符→独立Uint8Array | 无trim/case/隐式ACP；其他输入抛受控INPUT_ASCII，不回显内容 |
| `web/launcher-websocket.mjs:createBrowserLauncherTransport` | own origin/token/endpoints，可选WebSocket构造器→openStream | 规范http://127.0.0.1:port、32B hex capability、1..10回环目标；只开列表内端点，无默认账号/地址 |
| `openStream/read/write/close` | 既有v17端口契约 | 等TCP ready，read owned bytes/null EOF；write复制并等本地TCP写回执；单read/write、AbortSignal、迟到/EOF/受控失败 |
| `adapters/node/launcher-loopback.mjs:createLauncherLoopbackServer` | 显式endpoints/gameCode及可选port/label→origin/snapshot/close | 只绑定127.0.0.1；源码/运行设置白名单，精确Host/Origin/路径/subprotocol；token先验后TCP |
| `server.snapshot/close` | 无参→三个无内容计数/幂等关闭Promise | 仅自有套接字，无capability/账号/原始异常；peerEOFs仅TCP EOF，不等同认证 |
| `web/login-app.mjs` | 用户明确输入/四文件或原创文本/决定→会话与候选交互 | 当前页决定/保留，无账号/文本持久化；显式输入或文本变化释放旧候选，不打印opaque/key/请求正文 |

服务端单块64KiB、每向累计4MiB、8192入站消息、最多8连接、10秒总时限/禁压缩；客户端入站累计及队列4MiB、16384消息、块64KiB。bridge JSON控制是独立协议，二进制保留原字节。UI计数从0递增是本地政策，四页resource slot按gameCode+1且未配置时阻断；实际非ASCII/条款/账号/服务身份仍未知。[完整契约](../analysis/launcher-v18/implementation-spec.json)、[运行](../web/README.md#launcher-v18)、[验收](../analysis/launcher-v18/validation.json)。

## 字节流会话执行器与Node端口（stage62）

| 接口 | 输入 → 输出 | 边界 |
|---|---|---|
| `web/launcher-session.mjs:createLauncherSession` | 显式端点/原请求bytes、openStream及可选平台函数→单次会话控制器 | 构造不连接/取随机数；不查账号/接受条款，snapshot固定未认证 |
| `session.start/snapshot/cancel` | 可选AbortSignal→冻结状态/choices/受控error | start幂等，10s总截止覆盖await，迟到端口关闭，opened后不重放；取消也可释放候选 |
| `session.getChoices/selectProfile` | 显示序号→既有独立候选/opaque选择副本 | 只在core对应状态有效，不生成游戏IPC/认证结论；调用者管理返回副本 |
| 注入stream `read/write/close` | 非空≤64KiB bytes或null、按序写入/关闭 | 验收时保存三个own方法；累计入站4MiB。write完成只是本地完成，close计数不证明对端关闭 |
| `adapters/node/launcher-stream.mjs:createNodeLauncherTransport` | 显式allowedEndpoints→openStream | ASCII主机名/IP与端口tuple白名单、无隐含目标；AbortSignal/Socket/noDelay、高水位64KiB，单个待处理read/write |

完整输入、结果、错误code和熵/时钟端口见[web v17](../web/README.md#launcher-v17)。`web/launcher-session-data.mjs`仅共享契约/字节与受控错误工具。shared纯核心、原字节格式和依赖本轮未改；Node是开发验证适配，浏览器尚无实际TCP端口。[实际TCP/浏览器验收](../analysis/launcher-v17/validation.json)。

## UserMode非秘密计划（stage61）

| 接口 | 输入 → 输出 | 边界 |
|---|---|---|
| `planLauncherUserModeInitialization` | recordedMode(-1或UInt32)、初始用户名勾选、显式settingsSection、可选choice → 模式/retention/写入意图 | 已存1/2无写入；未知需明确1/2，缺省/null等待，cancel无写；mode2保留传入用户名勾选，不清已有bytes |
| `planLauncherUserModeChange` | currentMode/requestedMode、settingsSection、2→1独立确认 → 保留/等待/拒绝或clearInputs及写入意图 | 只有接受后才发效果，同模式重选也清输入；cancel独立；retention null表示不应用状态变化 |

own数据属性快照、section1..256字符且无控制/DEL/方括号；未需choice/确认不读。冻结writeRequested只含section/UserMode/整数，不接受用户名/密码bytes、不执行存储/擦除。稳定错误及retention字段见[shared v16](../shared/README.md#launcher-v16)，[实际验收](../analysis/launcher-v16/validation.json)。此接口无平台I/O，模式UI尚未接入；原账号持久化和服务会话不由计划验证。

## 本机配置页面与原字节File适配（stage60）

| 接口/状态 | 输入 → 结果 | 边界 |
|---|---|---|
| `web/launcher-file-io.mjs:readLauncherCatalogBytes(file)` | File/Blob → 自有Uint8Array | 非空safe-integer size≤1MiB，读前快照，一次slice；原生ArrayBuffer长度/读后size一致，非buffer/Proxy/短读拒绝 |
| `readLauncherText(file,encoding)` | 同一原字节读取 → 文本 | 保留UTF-8/GB18030 fatal解码接口；不改变raw digest输入 |
| 页面候选/generation | raw双XML→已有snapshot验证→显示配置/区域 | 独立候选所有权；示例明确UTF-8/严格裸&，旧读取不能覆盖新选择 |
| 缓存信息/版本 | `read`结果→revision/hasPair/状态 | 启动检查与手动重新检查都不应用缓存模型；首次read可创建自有空schema |
| 保存/恢复/取消 | 当前候选/已知期望revision或显式restore→原生事务回执/页面模型 | save/restore锁数据控件，AbortSignal可取消；恢复先清旧状态/目录，来源未验证，晚取消成功不得说回滚 |

页面固定profile `launcher-local`；不保存文件名、目录、选中项、账号、条款决定或会话。冲突/失败/取消令已知revision失效，重新检查成功后才允许保存/恢复。冲突/写失败保留当前模型；恢复失败保持清空。坏缓存/未知schema不自动删除。UI只显示受控错误及中文状态，不回显缓存内容或底层异常。[使用/错误语义](../web/README.md#launcher-v15)、[实际页面验收](../analysis/launcher-v15/ui-validation.json)。HTTP bootstrap不在本页调用，CSP仍`connect-src none`。

## 保留初始化与候选缓存（stage59）

| 接口 | 输入/输出 | 边界 |
|---|---|---|
| shared `computeLauncherFileMd5` | 实际bytes → 原始MD5小写32hex | 32MiB，原生长度/所有权，不解码或规范化换行；沿用清单内部实现 |
| web `createLauncherBootstrap().prepare` | 显式client、3份local bytes、5个own端点、解码选项/时限 → 自更新或完整目录候选 | 首请求前快照；self优先/按变化获取XML；raw digest+显式decode/XML；失败无部分候选，不自动commit/认证/执行 |
| `snapshotLauncherCatalogCandidate` | 两XML bytes及预期MD5/encoding/compatibility → 独立bytes及解析投影 | 各1MiB，非空、精确摘要/显式解码/结构；不是来源认证 |
| `createLauncherCandidateStore().read/commitPair` | 一个显式profile；候选/期望revision → 已校验pair或提交回执 | 单record事务、版本比较防覆盖、complete确认；abort保留旧pair，晚取消已提交标志；仅自有浏览器库 |

prepare与缓存分开；缓存不保存凭据、条款决定或真实会话，不修改原文件。`revision/profile/schema`仅本地存储，不能加入线上包。完整参数、错误code、取消与迟到提交语义见[web v14](../web/README.md#launcher-v14)，[实际运行](../analysis/launcher-v14/validation.json)。

## HTTP薄适配（stage58）

| 接口 | 输入/输出 | 边界 |
|---|---|---|
| `web/launcher-http.mjs:createLauncherHttpClient` | 显式1..16 origin、可选平台fetch → 冻结client | 仅初始长度内own项形成私有Set，无默认端点或自动请求 |
| `client.getBytes` | 完整URL、kind、AbortSignal、1..60000ms → 独立Uint8Array/实际长度/status/声明长度hint/trust | GET、2xx、无重定向/凭据/referrer；metadata4KiB/catalog1MiB/package32MiB、65536read、总单调截止；失败无部分结果 |
| `LauncherHttpError/LAUNCHER_HTTP_LIMITS` | 稳定code/预算 | 不回显URL、取消reason或原provider错误；取消/释放best effort，不等于对端已关 |

与清单/ZIP核心的组合已实际跑本机原创HTTP服务；现有资源UI仍不请求网络，详见[使用与错误契约](../web/README.md#launcher-v13)。官方CORS/信任、实际存储/更新事务、账号会话及手机/小程序尚未验收。

## 当前共享核心与平台边界

当前主实现为[shared/index.mjs](../shared/index.mjs)，纯ESM，无DOM、Node文件系统、AppKit、wx或网络依赖。资源API接收调用者传入的ArrayBuffer/Uint8Array；启动配置API接收已解码文本和显式目录快照，平台决定如何取得合法本地输入。详细类型和错误代码见[shared/README](../shared/README.md)。

| API/模块 | 输入 → 输出 | 约束 |
|---|---|---|
| `inspectIndex(bytes,{pairedByteCount?})` | 40B完整索引 → 记录数、边界、连续/重叠观察 | 64MiB，配对大小可选；无配对大小不能证明数据范围有效 |
| `getRecord(bytes,ordinal,options)` | 0起始序号 → ID、范围、宽高、opaque字节 | ID可重复；opaque独立副本；校验ordinal/配对范围 |
| `frameRange(record,options)` | 记录 → `{start,end,byteLength}` | end排他；读取前检查32MiB、4Mi像素、整数安全及范围 |
| `decodeRD(bytes,{record?})` | 单帧 → version/width/height/pixels/opaque | 仅v0/v2；精确长度；可核对索引尺寸和长度；byteOffset正确；输出独立副本 |
| `parseGameCatalog(text,options)` | 已解码GameList → 有界冻结目录 | 重复Code保留ordinal；Argsline原文；未知字段只列名；DTD/实体/歧义有界拒绝 |
| `parseRegionCatalog(text,options)` | 已解码RegionList → 冻结区域/地址/原始Args | 固定40区域/10BIP；Code与ordinal分开；地址不解析/访问；非空Galaxy未实现 |
| `listGameRegions(games,gameOrdinal,regions)` | GameList名称引用 → available/missing/ambiguous/closed | 精确保留解码名称/空白、按引用顺序；不推断认证或可达性 |
| `selectLauncherRegion(...)` / `createOfflineRegionLaunchPlan(...)` | 引用序号 → 区域参数；或组合原目录文件计划 | Gamecode0..14数值槽；歧义/闭区/未知Galaxy拒绝；认证固定unverified |
| `encode/decodeLauncherRequest10` / `encode/decodeLauncherRequest10Frame` | 显式UInt32/byte字段 ↔ 已证类型10字节布局 | 两字段各≤18B、正文≤45B/封装≤47B；大端字序；无文本转换/完整传输或认证，UI子集见下一行 |
| `encodeLauncherLoginRequest` / `encodeLauncherLoginRequestFrame` | 显式counter/Gamecode/usernameBytes/passwordBytes → UI路径类型10正文/封装 | 各1..16B、无NUL，Gamecode0..14；不猜代码页、不加变换，低层18B能力保留 |
| `createLauncherProfileChoices` / `decodeLauncherProfileChoices` | decoded type11或明文body → 候选/关联列/来源与显示ordinal | 原byte排序/换位；严格列覆盖、signed16规范值、无空/NUL标签；完整reply保留 |
| `selectLauncherProfile(decodedReply,displayOrdinal)` | 选择显示行 → 复制profile/opaqueByteField/两tail word | 非零结果/空表/受限行拒绝；通过仅表示已证选择条件，authentication仍unverified |
| `LAUNCHER_LOGIN_LIMITS` | 冻结输入预算 | 错误/输出所有权见[共享v8](../shared/README.md#launcher-v8) |
| `createLauncherLoginFlow(config)` / `LAUNCHER_FLOW_LIMITS` | 显式输入、端点数量/起点、时钟/代次事件 → 连接/关闭/有序写入意图与候选 | 10s总deadline、预请求开启失败有限轮换、不重发、陈旧事件隔离、取消/断流清理；无socket/系统时钟/随机源，见[共享v9](../shared/README.md#launcher-v9) |
| `createLauncherLicenseIdentity` / `createLauncherLicenseReview` / `LAUNCHER_LOCAL_LIMITS` | 原Code/用户名bytes、版本/force/四页availability快照 → lookup identity、审阅页/明确决定/写入意图 | 用户名1..16B无NUL、资源槽1..15、版本5；不写配置、不接受真实条款或认证，见[共享v10](../shared/README.md#launcher-v10) |
| `resetLauncherLoginInputs(...)` | 两显式boolean复选框、各0..16B字段 → 保留/清空后的独立bytes | 会话内重置，无持久化；原生长度先校验，防子类/Proxy元数据替换 |
| `inspectLauncherUpdateArchive(bytes)` | 有界经典ZIP → 中央目录顺序/首条/前缀/范围metadata | 名字为opaque bytes，不是输出路径；metadata检查不代表payload CRC已校验 |
| `decodeLauncherUpdatePackage(bytes,{expectedMd5})` / `LAUNCHER_UPDATE_LIMITS/LauncherUpdateError` | 首中央条目Stored/raw Deflate → 候选bytes及CRC/MD5匹配 | 32MiB、64条目、16KiB回调、精确消费/输出/CRC/摘要；trust未验证、无文件事务/执行，见[共享v11](../shared/README.md#launcher-v11) |
| `parseLauncherDigestResponse` / `parseLauncherCatalogDigestResponse` / `parseLauncherUpdateLocatorResponse` | ASCII bytes → 特定trim/cut主摘要、XML二摘要、locator与进度分母 | 4KiB/128token；XML不cut；NUL/非ASCII/非正全十进制拒绝，属独立profile |
| `createLauncherMetadataPlan` / `LAUNCHER_MANIFEST_LIMITS/LauncherManifestError` | 原文件bytes/显式响应 → self候选或两XML刷新计划 | self先于XML、未用输入不读取、正常启动分支；无请求/写入/来源信任/ready，见[共享v12](../shared/README.md#launcher-v12) |
| `encodeLauncherRequest1` / `decodeLauncherReply` / `decodeLauncherReplyFrame` | 两word请求；类型2/11明文回包 → 冻结位置字段 | reply≤8KiB，32B单字段、64×41B列表、5×64个UInt32；不作业务接受判断 |
| `createLauncherReplyStream()` | 已处理明文分段 → 完整回包数组 | BE16内层封装、每chunk≤64KiB；坏流终止，close可主动清pending且不新增解析错误，不含解密/socket |
| `encodeLauncherHandshakeHello` / `decodeLauncherHandshakeChallenge` / `answerLauncherHandshake` | 固定hello；完整挑战＋显式20B指数 → 公值消息/8B材料 | 严格ASCII hex、有界模幂；短派生材料拒绝，无随机源、peer身份或认证证明 |
| `createLauncherRecordCodec(key)` / `createLauncherRecordStream(key)` | 显式8B测试材料/密文分段 ↔ 未压缩记录/明文片段 | 固定Blowfish LE32分支；发送≤32712B、接收密文8..32760B/8倍数；finish/close清理，不去零、不判断会话 |
| `LAUNCHER_REPLY_LIMITS` / `LAUNCHER_CHANNEL_LIMITS` | 固定预算；错误复用`LauncherMessageError` | 类型、所有权、关闭状态与错误码见[使用契约](../shared/README.md#launcher-v7) |
| `REGION_LIMITS`、`LAUNCHER_MESSAGE_LIMITS/LauncherMessageError` | 预算与稳定错误码 | 详见[共享接口](../shared/README.md#launcher-v6)，不放宽调用范围 |
| `parsePathOverrides(text)` | INI → Path/Game目录值列表 | 严格子集、重复拒绝、无插值/系统读取 |
| `resolveGameDirectory(game,options)` | 显式HKCU结果/INI文本 → 来源与路径 | 匹配选中引用；registry优先；Path/Game回退；无默认cwd或旧键迁移 |
| `createOfflineLaunchPlan(catalog,ordinal,options)` | 选中目录 → client/patch/config/special文件元数据 | 路径仅字符串；无命令执行、文件存在性、认证或完整启动就绪判断 |
| `LAUNCHER_LIMITS` / `LauncherError` | 字符/节点/路径预算与稳定错误码 | 新接口与原ResourceError隔离；详见shared使用说明 |
| `verifyInstallInventory(plan,snapshot,{expected?})` | 显式目录/文件metadata → 冻结的要求检查、缺失/歧义/不匹配结果 | 无扫描/读取/哈希计算；同root绑定；仅快照一致性，非ready |
| `parseMAP01(bytes)` | 有界MAP01 → 候选尺寸、8B opaque头及6wh opaque体副本 | 20B头/精确长度；32MiB/4Mi单元；不解释平面、碰撞或坐标 |
| `INVENTORY_LIMITS/InventoryError`、`MAP01_LIMITS/Map01Error` | 固定预算和独立稳定错误码 | 底层local-paths仅内部复用；不增加平台权限 |
| `LIMITS` / `ResourceError` | 固定预算 / 稳定code,message,details | 不以调用参数放宽预算；未知版本不等于文件损坏 |
| `web/file-io.mjs` | 浏览器File/Blob → 索引或单帧bytes | 仅slice指定范围；短读拒绝；不整份读取Graphic |
| `web/app.mjs` | 选择/序号/缩放 → 原始灰度检查 | generation使旧请求失效，读取时禁用序号，错误清旧图；无上传/存储 |
| `web/launcher-file-io.mjs` / `launcher-app.mjs` | 显式双XML原字节→GB18030/UTF8解码→区域/计划与可选本机缓存 | 1MiB/文件、fatal解码、generation隔离旧读取；缓存显式保存/恢复，无凭据/进程/网络接口 |
| `web/pixel-view.mjs` | 解析像素 → Canvas灰度 | 每边≤4096，颜色/方向不解释；不导出官方图 |
| `scripts/serve_web.py` | loopback GET → web/shared指定源码 | 只监听127.0.0.1，backlog64承接模块突发读取，禁止目录/上传，CSP connect-src none |

小程序仅设计了替换本地文件、Canvas、触控和生命周期适配的边界，未提供wx适配或真机产物。游戏状态/游戏消息codec及游戏Session/Transport未实现；登录器字节流执行器不能替代这些模块。当前资源bytes接口不得隐式增加远程读取；vendor仅处理显式bytes，未引入网络或文件系统依赖。

## 保留的第一阶段 Swift 接口

以 `native/Package.swift` 和 `native/Sources/` 为实现依据。没有网络依赖或第三方 Swift 包；最低声明 macOS 13，已验证环境是本机 Apple Silicon / Swift 6.4。尚未做 macOS 13 实机或 Intel Mac 验证。

| 模块/API | 输入 → 输出 | 当前边界 |
|---|---|---|
| `MoliCore.PEInspector.inspect(url:hash:)` | 用户显式选择的普通本地文件 → `PEIdentity` | 有界读取 PE 头/节表；默认不读全部载荷，可选分块 SHA256；不加载/执行代码、不验签 |
| `PEInspector.inspect(data:fileName:)` | 内存中的合成或授权 bytes → 同一摘要 | 用于边界测试；规范化 Data slice 索引 |
| `PEIdentity` / `PESection` | 可 Codable/Sendable 的结构化摘要 | 文件大小、Machine、架构、PE32/PE32+、ImageBase、入口 RVA、Subsystem、节表；SHA256 可为空 |
| `GraphicIndex40.inspect(url:pairedByteCount:)` | 40 B 变体索引、可选配对大小 → `GraphicIndexSummary` | 最大 64 MiB；只解释 +0/+4/+8，不读取 Graphic payload；剩余 28 B 不解释 |
| `GraphicIndex40.inspect(data:pairedByteCount:)` | 合成记录 → 同一摘要 | 空文件、非40倍数、超限、配对越界拒绝；重复/空洞/重叠作为观察，不臆造通用格式规则 |
| `OfflineWorld` / `GridPoint` / `Direction` | 四方向输入 → 玩家位置/步数 | 自制网格及阻挡，移动与重置可独立测试；无官方地图/战斗规则 |
| `InspectionError` | 失败原因 → 可显示错误 | 区分非法数据与超出当前检查范围；不能把“支持范围外”当作文件必然损坏 |
| `moli-inspect` CLI | 明确路径与选项 → JSON / stderr、退出码 | `--sha256`、`--graphic-index`、`--paired-bytes`；不会扫描目录或跟随网络 URL |
| `MoliOffline` SwiftUI App | NSOpenPanel/键盘/按钮 → 摘要、原创 Canvas | 文件检查在后台 Task；AppKit 捕获方向键/WASD；显示明确离线状态 |

PE 检查预算：PE header offset ≤ 1 MiB；section count 1…96；optional header ≤ 4096 B；节原始范围不得越过文件末尾。它是实验性结构检查器，不是完整 Windows loader、恶意软件检测器或官方签名认证器。文件发生变化时部分检查会拒绝，但没有对任意并发写入提供原子快照保证；分析固定副本更易复现。

索引中的 `id`、`offset`、`byteLength` 是按观察映射的候选字段，配对长度由调用者提供；输入“合适的大小”并不证明配对文件内容正确。不连续/相邻重叠的统计定义见实现，不能把统计当作所有范围对的完整几何关系枚举。

当前已有纯数据的启动配置/目录计划API，但不存在实际进程 Launcher/Updater/Authenticator/Transport/Session 服务，架构文档中这些是后续设计方向，不能称为已完成模块。添加它们时须明确依赖注入、联网开关、数据来源、错误状态及其验收证据，并同步本文件。


## 第三阶段分析工具接口（不属于游戏运行核心）

`analysis/protocol-v3/`新增离线核验器：输入显式本地PE路径、必要的临时REA dossier或固定锚点JSON；输出样本SHA256、VA/file offset、导入身份、短锚点比对及拒绝结果。它们不加载PE、不运行目标、不建立网络或创建共享内存。部分PE审计helper只面向固定合法样本，不能复用为产品任意文件安全加载器；异常行为在测试和报告中明确。

原有纯资源核心、Web适配与Swift原型接口保持不变。本轮没有认证、会话、游戏帧或网关API；更新器5槽与CGSharedMem字面标签不足以制定这些接口。复核命令及限制见[阶段验收](validation.md)。

## 隔离环境只读核验工具

`scripts/check_vm_isolation.py <bundle.utm>` 是开发侧Python3.9+工具，不属于shared协议核心或产品启动器。只读最多64KiB的config.plist和文件元数据；特定空白配置检查通过返回0，否则1，并输出有界JSON。未知键/版本、缺字段、网络/共享、自定义参数和外部磁盘等会拒绝；不自动修复、不启动VM、不读取磁盘内容。当前策略至多143项检查，受控目录下使用，不抵抗祖先目录符号链接或并发替换。许可/安装后修改配置必须重新评估，不能把文件配置检查当运行时安全证明。用法及结果见[环境记录](vm-environment.md)。

`analysis/vm-install-v1/verify_media_config.py --bundle <固定项目VM> --baseline <before-install.json>` 是独立的双盘版本审计：输入上轮配置哈希及系统盘身份基线，按固定根/节键、CPU/UEFI/TPM、无网络/共享、两枚内部磁盘ID、只读CD角色和路径进行30项检查。输出JSON和0/1退出码；只读配置/元数据，不读取磁盘载荷或自动修复。它不证明客户机或运行时隔离，不抵抗祖先链接或并发替换。4项负例测试覆盖隔离改变、未知/缺失字段、错误介质角色/路径/只读、链接及畸形/错基线。旧空白策略有意拒绝CD，不被替换。ISO与CD载荷相等由单独qemu-img逻辑比较证明；游戏模块接口未变化。

`analysis/vm-install-v2/verify_nvme_config.py --bundle <固定项目VM> [--baseline <before-interface.json>]` 是独立NVMe政策入口，复用v1的有界读取、严格类型比较和固定schema，不修改v1。核对旧配置结构与记录的hash、仅接口差分、相同系统盘/CD身份、固定无共享/网络配置及元数据，实际38项通过。仅把基线hash作为来源声明，不声称从JSON独立重算旧plist原始bytes；不读取载荷、不证明guest盘识别或安装成功。4项合成测试覆盖旧VirtIO拒绝、CD/网络/额外设备/外部路径/链接/共同篡改基线与坏输入。旧策略仍按设计拒绝NVMe；游戏API没有变化。

**历史v3 UI证据：** v2结束时“NVMe客户机识别未验收、停在许可页”是历史状态。v3开始重新观察时已越过许可页，唯一Disk 0显示未分配80.0GB；未重试此前被拒绝的接受动作，也不归因中间操作由谁完成。同一VM/原盘身份及配置hash仍为`f93fc4e4da000f9738212ef6cd1ba1ee5968bcea441fd273b81c8d2324231d16`。安装确认页明确为Windows 11家庭版、不保留任何内容；执行安装后出现进度，随后自动通过系统盘Windows Boot Manager启动并进入OOBE。见[目标盘截图](../analysis/vm-install-v3/nvme-disk-visible.png)、[安装确认页](../analysis/vm-install-v3/install-ready-home.png)及[过程记录](../analysis/vm-install-v3/progress-observations.json)。这项UI证据支持目标盘识别、系统盘启动及到达OOBE，不改变只读审计器的能力范围。

**历史v3 OOBE停止关口：** 已按正常界面选择中国、微软拼音并跳过第二键盘；OOBE停在[“让我们为你连接到网络”](../analysis/vm-install-v3/oobe-network.png)，提示需要Internet才能继续，“下一步”灰色，无可见离线选项。当时无网卡，未联网、创建或登录账号、运行游戏，也未绕过联网/账号要求。该阶段通过Shift+F10打开的`C:\Windows\system32\cmd.exe`实际显示版本`10.0.26300.9457`，见[版本画面](../analysis/vm-install-v3/oobe-system-version.png)；这是系统命令窗口的直接观察，不等于桌面、激活、架构或最终版别全部验收。

**v3终态：** 随后通过UTM“虚拟机→电源→请求关闭电源”正常关机，播放按钮可用、停止操作禁用，见[停止状态](../analysis/vm-install-v3/stopped-after-oobe.png)。强制停止警告曾打开但已取消，未强制停止；命令行键入未见生效，不能归因为执行了shutdown命令。关机后[固定配置复核](../analysis/vm-install-v3/final-config-audit.json)38/38通过，原配置hash不变。OOBE完成、桌面、许可证适用性、激活及基线恢复启动尚未验收；没有新增游戏运行或协议接口。

### 历史v4：驱动介质已准备，网卡添加未执行

用户已授权仅本项目VM临时NAT及必要官方ARM64驱动，主机目录/剪贴板/USB共享继续关闭，到微软账号页停下由用户亲自处理。该阶段未产生联网结果：UTM“设备→新建…”入口首次被自动审查拒绝且未执行；重查截图与AX后仅重试一次，仍因审查认为可能新增显示设备而被拒绝。已停止并取消设置，未换路径绕过，见[入口截图](../analysis/vm-install-v4/device-menu-blocked.png)。v4结束时VM仍为正常关机状态，`Network=[]`，原盘/固件配置及共享关闭状态未变；当时没有新增显示设备、网卡或挂载驱动介质。

官方滚动ISO已实际下载HTTP200，最终发行地址为`utmapp/qemu`的`v10.0.12-utm/utm-guest-tools-0.1.274.iso`，143,898,624字节，SHA256为`ab6add47a4ed992f5920f14e96f68d60566e6f731e2cf816c3d38ab2b78f407a`，见[介质来源](../analysis/vm-install-v4/driver-media.json)。只读提取的NetKVM `w11/ARM64`包，INF DriverVer为`01/13/2025,100.100.104.27100`，SYS/EXE/DLL的PE Machine均为`0xaa64`。已生成本地只读`build/drivers/netkvm-w11-arm64-0.1.274.iso`，3,006,464字节、9文件含原许可材料，无autorun、SPICE或图形组件；v4结束时尚未挂载到VM或安装，逐文件和最小介质hash见[驱动包记录](../analysis/vm-install-v4/netkvm-package.json)。

CAT中可解析签名者身份`Microsoft Windows Hardware Compatibility Publisher`，但Windows信任链与catalog成员验证未做；OpenSSL CMS因CTL编码报错不能判为签名无效。此阶段交付是静态介质准备，不是驱动加载、NAT、OOBE或账号验收；不得放宽旧无网络审计策略来伪造NAT通过。跨平台游戏接口及官方兼容状态不变。

### 历史v5：NAT与驱动光盘已配置，网络连接已观察

用户针对设备入口再次具体确认后，同一“设备→新建…”菜单重试成功。已保存一枚`virtio-net-pci`，`Mode=Shared`、`PortForward=[]`；相对[修改前基线](../analysis/vm-install-v5/before-network.json)仅Network节变化，见[NAT配置](../analysis/vm-install-v5/nat-config.json)。目录、剪贴板、USB共享保持关闭；`IsolateFromHost=false`，因此这些文件/输入共享限制不等于网络服务与宿主完全隔绝。

最小NetKVM ISO已通过UTM导入为第三块内部只读USB CD：`netkvm-w11-arm64-0.1.274.qcow2`，ImageType=CD、Interface=USB、ReadOnly=true。UTM转换后的容器为3,342,336字节；qemu-img compare已确认它与原ISO的逻辑内容一致，不能比较两种容器hash来宣称字节相同。在已保存NAT配置上仅追加驱动CD，原两盘及其余配置未变，见[三盘配置与介质身份](../analysis/vm-install-v5/driver-cd-config.json)。当前配置SHA256为`97cb2df7e4554cb742d6026ab02388f4333b847c75620a7c5798e2de585c3ce8`；旧无网卡/双盘策略对该配置的拒绝是预期差异，不能把历史38项通过套用于本阶段。

项目VM已启动；用户打开另一新建VM流程导致的UI协调暂停已解除，该向导的x86_64/ARM64镜像警告不是项目VM架构变更。回到原VM后，Windows正常“安装驱动程序”入口选择实际`E: MOLI_NETKVM`目录，出现搜索/安装进度，随后[网络显示已连接、下一步可用](../analysis/vm-install-v5/oobe-network-connected.png)。这项UI观察支持网络功能已出现，不独立验证设备实际驱动版本、完整信任链或CAT成员；没有绕过签名校验。继续后通过正常“稍后更新”及重启，先到微软密钥登录，后续获准核对正常离线入口时已到验证码页，停止UI避免干扰；本版本本地账户入口未确认，没有填写/提交认证数据或运行游戏。NAT仍临时开启供系统设置，完整更新、OOBE、桌面及恢复离线均未完成，见[交接记录](../analysis/vm-install-v5/account-handoff-config.json)。用户已撤销旧VM清理并自行处理，助手未删除或取消注册任何旧VM，也不再读取Trash。

新增[ARM客户端静态复核](../analysis/vm-install-v5/arm-client-compatibility.md)/[JSON](../analysis/vm-install-v5/arm-client-compatibility.json)是分析证据接口，不是运行时检测器或游戏API：输入固定已有PE、清单和证据，记录12个PE身份/架构、7处旧API字节锚点及d3drm导入。游戏/登录器为x86 PE32；未检出`.sys`文件名仅限两份清单，`DeviceIoControl`导入和未解出的`ApexClient.Dat`保留未知，不能推导完整内核依赖结论。必需的x86/x64内核组件没有合法ARM64版本是明确驱动架构停止门槛；其他仿真失败须提供具体证据，旧API、OOBE、签名问题分别核查。未新增游戏会话、协议编解码或平台专用模块，x86整机模拟仍只是取证备选。

### v6：三盘离线审计与系统证据

`python3 analysis/vm-install-v6/verify_offline_config.py --bundle <固定项目VM>`是新的固定三盘策略：只接受v5已知配置把Network改为空，其余字段和三盘ID/角色/路径不变。期望值写入代码，不信任外部receipt授予设备权限；只打开一个最多64KiB的config.plist，其余读取限文件元数据。拒绝网卡/转发、目录/剪贴板/USB共享、未知键、类型混淆、额外设备、可写CD、外部/替换盘、重复plist键、叶层链接和部分读取竞态。输出JSON及0/1退出码，不改变VM，不读取磁盘/EFI/TPM载荷。

10项合成测试通过，根任务独立重跑；本轮第一次真实配置仍有NAT，21项中仅`config.Network`失败，退出1是正确拒绝，并非已恢复离线。见[核验器](../analysis/vm-install-v6/verify_offline_config.py)、[测试](../analysis/vm-install-v6/test_offline_config.py)、[负向结果](../analysis/vm-install-v6/current-config-negative-audit.json)和[审查边界](../analysis/vm-install-v6/offline-config-review.md)。历史v1/v2不变；新策略不证明运行中/全局覆盖、客户机健康、祖先目录安全、介质内容或恢复可启动。

系统观察字段、命令及限度见[本轮客户机记录](../analysis/vm-install-v6/guest-observations.json)。CIM家庭版/ARM64、完整版本和NetKVM实际签名元数据是环境证据；异常设备、更新及最终离线状态各自验收，不增加游戏API。下一次加载观察仍是[待授权固定样本计划](../analysis/vm-install-v6/client-experiment-plan.md)。

## v7环境核验接口增量

`analysis/vm-install-v7/verify_offline_four_drive.py --bundle <本项目VM路径>`只读固定四盘/无NIC规则，输出`passed/checks/failed_checks/config_sha256/disk_metadata`，失败退出1。不从可编辑回执授权新设备，拒绝未知/外部/可写光盘、网络、共享、链接和歧义配置；12项测试覆盖新增光盘及既有边界。历史v6策略保持三盘规则。

`analysis/vm-install-v7/create_cold_baseline.py`为本机固定路径恢复准备工具，默认只检查，`--apply`才复制。输入需近期`final-ui-state.json`绑定名称、UUID、时间、配置hash及正常关机/无网络/无共享；目标固定项目build/baselines新目录，存在即停止。17项合成测试（含-O）覆盖拒绝条件与复制后验证；当前真实副本未创建。它不启动VM、读取guest文件系统/凭据或建立网络。所有产品shared/web/native接口未变。

## v8私有冷副本执行接口

[create_cold_baseline.py](../analysis/vm-install-v8/create_cold_baseline.py)沿用固定v7四盘policy哈希，仅将目标及回执改为v8；默认preflight、`--apply`实际复制，19项合成测试通过。工具固定本机路径，目标存在即拒绝，不用于覆盖恢复或启动副本。本轮真实执行已通过，7文件逐项hash相同；[回执](../analysis/vm-install-v8/windows-cold-baseline.json)列出权限、容量与恢复启动未运行限制。关机UI/无打开文件/目录链接/容量等前置检查不替代Windows健康检查。所有shared/web/native产品接口未变，执行脚本不能自动重跑覆盖已建立副本。

## v9独立恢复克隆接口

[create_restore_test_clone.py](../analysis/vm-install-v9/create_restore_test_clone.py)固定v8冷源、7文件hash和新目标，默认preflight，--apply才复制。只允许克隆Name/UUID改变，不注册、启动或登录。原VM允许已运行：只保护其config/路径身份，不读取运行盘内容，不强求guest可变状态静止；冷源仍须全hash匹配和无打开句柄，跨文件inode及外部依赖检查防止共享写入。失败保留残留不覆盖。实际[复制回执](../analysis/vm-install-v9/restore-clone.json)及25项普通/优化测试已形成，UI引导证据单独记录。旧v8脚本/回执和产品接口未改。


## stage36纯配置核心的实现契约

详见[可运行使用说明](../shared/README.md#offline-launcher-core)。没有Node/DOM/wx、注册表、文件系统或网络依赖；返回对象及嵌套数据冻结。Windows路径是旧配置数据表达，不代表网页/小程序可直接访问本机安装目录。真实Windows Profile/XML库语义、旧键迁移、路径存在性、完整argv/IPC与认证仍未实现；不能把文件计划当运行许可或ready状态。31个新测试及相关56 Node/8 Python/16 Swift回归见[本轮回执](../shared/evidence/launcher-validation.json)。


## stage38：安装快照与MAP01边界

[完整接口与例子](../shared/README.md#inventory-and-map01)。Inventory输入只用显式root/file列表及预期大小/SHA256，核心既不探测kind也不计算摘要；present或knownRequirementsSatisfied不能当真实磁盘、PE、完整资源或官服证明。重复/规范化别名全局标歧义，SHA明确要求但未提供为unverified。共用本地路径政策与旧启动计划保持一致，新增完整连接路径4096字符门槛。

MAP01只按四样本已证20B+6wh布局读原始字节，@4…11保留，body不分平面/对象/碰撞。所有typed数组为独立副本，窗口byteOffset与恶意维度有测试。Node文件读取适配器只位于`shared/tests/validate-local-map01.mjs`，平台无关核心没有Node/DOM/文件/网络依赖；真实四样本只读4/4通过，无新增Web/手机/小程序接入或运行能力。
