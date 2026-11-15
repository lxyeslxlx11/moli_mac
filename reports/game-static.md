<a id="fixed-se-entry-business-admission"></a>

## 固定 SE 战后、邮件与工艺的登记和实际分派

**事实**。固定 SE 样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。构造在活动指针发布前，以 −1 调用描述符第一个函数。普通 `46AB90` 遍历也在参与控件之前调用该登记，控件后另调用绘制登记。实际析构走原退役入口。制造窗 11 的第一项 `476170` 在 −1 初始化与普通推进间分支，后置绘制为 `4767E0`。 [原登记、指令和 REA 范围](../build/analysis/fixed-se-entry-business-v1/source-review.json)

| 原操作 | 所选判定 |
| --- | --- |
| 战后结果窗 30、31 | 两类字节回复各发表待处理字和资料。主状态 9 的子状态 3 与 20 在所查分派会合于 `5024B5`，由 `4EADC0` 按当时结果请求对应窗。同一登记的构造与控件前更新分别写、读共同截止。窗 31 后置绘制与窗 46 共用，具体数据仍沿各窗初始化。 |
| 经典邮件重开 | 普通重建的 22 和 23，以及战斗 10/1 合为一次 22 的调用已接回状态登记。22、23 的共用析构在实际退役保存草稿并按活槽释放。窗 49 按父窗与群发状态处理初始化、绘制和关窗。 |
| 工艺和槽 7 | `@Y)` 的交换先于材料关联和占用换位。经典窗 10 控件 6 与到期、实际析构各有作用，窗 11 先更新资格，再分派材料和开始控件。普通制造开始用控件 23，共用处理器也登记在控件 6。另一套 14、19 的局部分支已归属，活动实参及普通帧调用待证。 |

**待验证**。实际原版回包、材料和结果时序、邮件投递与附件结算、另一套窗口活动分派、三端和当前同版，继续沿 EA-U1、EA-U2、MM-R1、WK-U1 和 ST-GAP-01。 [原台账与实现用例](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations) · [本机核验](validation.md#fixed-se-entry-business-validation)

<a id="fixed-se-classic-pre-control-callbacks"></a>

## 固定 SE 经典窗口的构造与控件前回调

**事实**。固定 `cg_se_6000.exe` SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。42 个经典窗描述符的 `+0x24` 指向 41 个所选回调。新对象先进入活动池并置 `0x2000`，其编号记录先置 `0x80`。`4685F8` 暂绑新对象，以 `−1` 调用 `+0x30`。正常返回后发布编号活动指针，再恢复先前的当前对象。普通 `46AC09` 用实际帧参数调同一槽，随后重读当前对象及控件参与值。 [窗口、回调和原始指令](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_pre_control_callbacks)

**事实**。主状态 10 下，窗 1 的 `467860` 先为自身置待退役位，再请求窗 2，返回后继续原更新。此分支在构造和普通帧中走相同条件。工艺 `4712A0(-1)` 先选初始化模式，继续到共用技能有效性检查。当模式 1、2、4 的当前技能名为空时，按各自释放及回退顺序执行。简介目录 59 的父窗 58 缺席时先请求关窗，再执行当前更新。 [嵌套打开](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_pre_control_callbacks/common_order) · [模式表和父窗条件](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_pre_control_callbacks/selected_effects)

窗 47、65、66 的业务入口已接到删除确认、黑名单管理和冒险者日志。**待验证**。实际嵌套开窗、初建缺失技能和已标记窗口的当轮表现随原用例验收。 [后续业务归属](#fixed-se-classic-modal-blacklist-log) · [构造核验](validation.md#fixed-se-classic-pre-control-callbacks-validation)

<a id="fixed-se-classic-destructor-callbacks"></a>

## 固定 SE 经典窗口的关闭与业务收尾

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。18 个所选描述符在 `+0x2C` 登记各自的析构，运行对象由 `467FC0` 经 `+0x38` 调用。回调执行后才保存当前窗位置、更新旁表并清该窗活动指针。分组同步关闭和延后标记关闭共用这一步。 [登记、原指令和共用规则](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_destructor_callbacks)

**事实**。人物窗 7、8、9 用本窗位置同步另外三页，简介窗 58 检查的是窗 9 的活动槽，读取的是窗 58 的位置。工艺窗 10 重读模式后决定是否继续释放，窗 11 释放槽 0 至 6，窗 11、12、13 各按计数到零及本窗对应姿态决定是否归零。背包窗 14 按当前模式还原背包控件并清占用，归入背包退出。窗 24 先取偏好快照再保存。 [回调逐项规格](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_destructor_callbacks/destructor_roots)

**事实**。用物窗 45、46 在相应业务回调有效时传 `(-1, 0)`。家族兽窗 51 释放资料和选中槽后，仅在 `C22360` 非零时发关闭正文 `C`。目录和迷你邮件 60、61、62 在复位后分别调用组 2/3/4、3/4、4。**待验证**。实际同步关闭时的回调交错、重开读回及服务响应沿原用例，第二套窗口实际帧分派沿其具名入口。 [用例与静态范围](validation.md#fixed-se-classic-destructor-callbacks-validation)

<a id="fixed-se-classic-work-controls"></a>

## 固定 SE 经典技能与工作控件

**事实**。固定 SE 样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。43 个所选控件登记归入 27 个入口。窗 10 的一行滚动使用事件 `0x0400`，十行翻页使用 `0x02`，拖动沿 `0x21` 和现有滑块。选行仍检查排序槽的有效性。返回按模式恢复列表、等级或上一步，并在相应分支释放计数。 [登记与逐项来源](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_work_controls)

**事实**。战斗技能窗的“略过此回合”按模式 5、6 取实际技能来源。原条件计数不满足时清控件参与。合资格的 `0x02` 路径先调用已存非空回调 `C22544(-1)`，返回后才标记关窗。D4 沿技能窗现有的打开回调和参与条件接入。 [原指令与标签](../build/analysis/fixed-se-classic-work-controls-v1/source-review.json)

**事实**。制造窗普通提交沿控件 23 读取当前材料和费用，工作中六个材料位置改绑展示。刻印控件 4 在有有效目标时才允许点击进入编辑。分隔字符和空白错误提示各自命中并读到 `C5FB2C` 位 0 后解除参与和窗标志。采集的暂停、重启与目标技能的名单重查各沿当前阶段和资源条件。**待验证**。原版输入及提示效果、关联回包、第二套窗口实际分派和三端完整验收分别沿 WK-U1 与 WK-U3。 [工艺规格与本机证据](validation.md#fixed-se-classic-work-controls-validation)

<a id="fixed-se-classic-modal-blacklist-log"></a>

## 固定 SE 的删除确认、黑名单和冒险者日志

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。两套键位布局都用 End 首按切换黑名单窗 65、F9 首按切换日志窗 66。空活动槽请求打开；已有活动窗时置 `0x8000`，由共用退役路径关闭。 [两套键位、调用和登记](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_modal_blacklist_log_controls)

**事实**。窗 47 共用名片、家族名单、迷你邮件和清空黑名单四种确认。各入口先装当次确认和取消回调。确认控件需点击并按住 Ctrl，确认和取消都先标记窗 47 退役，再调用对应回调。清空黑名单复用 `402D50`。取消清空时，窗 65 的活动槽为空才请求打开。黑名单十行使用偏移 0 至 90，每个物理记录为 17 字节，逐行操作读取当时的行与模式。 [操作规格与旧存储规则](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_modal_blacklist_log_controls/window_operations)

**事实**。窗 66 按选定日期格式化 `Log` 目录下的 `chat_YYMMDD.txt`。读取入口先检查 `rt`，成功后再打开 `a+t`。换日按原日期分支重置行偏移，缺档走原错误标记。日期控件和文件重开入口都检查原句柄并调用关闭例程，两处之间无显式清槽。**待验证**。源 CRT 回执、日期边界、三端读写及关闭后的恢复随日志用例验收。 [原字节与来源](../build/analysis/fixed-se-classic-window-operations-v1/source-review.json) · [核验范围](validation.md#fixed-se-classic-modal-blacklist-log-validation)

<a id="fixed-se-classic-contact-list-controls"></a>

## 固定 SE 的名片、家族与迷你邮件名单控件

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。窗 21 的 71 处控件登记指向 14 个共用或业务回调。本批核定其中 41 处原待定登记。源回调以描述符给出的控件序号、事件掩码、当前布局及名单状态决定行为。 [完整登记、分派表和操作](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_contact_list_controls)

**事实**。布局 0 显示三行，布局 1 显示九行。控件 1、2 切换布局时，仅清当前名单的两份滚动偏移。五种排序写回当前选择和配置。按行使用 `0x0400`，翻页使用 `0x02`，滑块沿 `0x21`。名片、迷你邮件的滚动量分别以 60、20 为基数，家族取实际人数与 100 的较大值，再扣除本布局的行数。 [原分支及用例](validation.md#fixed-se-classic-contact-list-controls-validation)

**事实**。查看资料的 `0x04` 路径沿 `495EB0` 取实际条目并验证当前记录，分别传名片槽、家族成员 ID 或迷你邮件联系人 ID。通信记录先保存当时映射行和名单种类，再请求窗 40。群发在窗 22 空槽时先保存群发状态再开窗，已活动时标记关闭。删除沿窗 47，家族详情与称号操作分别接窗 48 和 55。**待验证**。实际交错输入、服务结果和三端显示沿原名单与邮件用例验收。 [名单与回包规格](../analysis/capability-first-v1/game-social-family-album-functional-specification.json#/classic_contact_detail_request)

<a id="fixed-se-classic-family-edit-controls"></a>

## 固定 SE 的家族详情与成员称号

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。窗 48 和 55 的 34 处文件登记对应 13 个回调。48 初建复制家族名称、会馆和 32 项称号草稿。构造及控件后更新根据当时的管理位 `0x80` 决定编辑参与。具备权限时，`4A1500` 为控件 18 至 52 安装 `4A0EE0`，覆盖七行、每行五个权限项。权限撤销后进入清编辑参与及回调的分支。 [源登记、回调与指令](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_family_edit_controls)

**事实**。权限勾选按当时的页偏移和控件号修改草稿。名称、会馆及称号分别用控件 64、65、72。`4A2150` 汇总 32 项称号差异并控制对应保存按钮。称号保存先检查所有待变更项，再依顺序发送差异。普通关闭标记当前窗，重开从实际资料复制。家族 ID 匹配的撤族消息走 `516C40` 整理资料和缓存，再经 `4A21B0` 标记家族详窗退役。 [原指令和用例](validation.md#fixed-se-classic-family-edit-controls-validation)

**事实**。55 的十行选择更新当前索引，确认时用保存的成员 ID 和索引加一发送 `8MV`，随后标记关窗。普通关闭直接走退役标记。D3 复用现有名称校验、家族资料和命令，补齐整批草稿和窗口交接。**待验证**。原版权限变化、晚到资料及三端实际操作沿 SF-A16、SF-A19、SF-A20。 [现有家族规格](../analysis/capability-first-v1/game-social-family-album-functional-specification.json#/fixed_se_classic_family_edit_controls)

<a id="fixed-se-classic-family-pet-feed-controls"></a>

## 固定 SE 的家族兽与饲料箱控件

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。窗 51 和 38 的 18 处登记已对应喂食、改名、存取、提示、滚动和关闭。家族兽拖入按当前来源类别及背包槽检查，槽号至少为 8。权限 `0x04` 或物品类别 `0x35` 允许接受。原版随后按旧槽计数、新槽写入及新占用的顺序处理，喂食按钮读取当时选中的槽号。 [登记、条件和指令](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_family_pet_feed_controls)

**事实**。改名参与取权限 `0x80`，通过原输入焦点进入编辑。点击或回车后按原名称字节及转义规则生成提交。家族兽析构先释放选择和说明，按 `C22360` 决定是否发送 `C`。模式变化先更新该值。饲料箱清模式 `0x22`，数量窗已活且其共享标签为 `0x29` 时标记数量窗退役，再按输入清理回执恢复焦点。存取继续使用现有 20 槽与数量规则。 [两窗收尾及实测边界](validation.md#fixed-se-classic-family-pet-feed-controls-validation)

**待验证**。实际原版拖入与确认的交错、旧选择为 `-1` 时对应的占用字节、数量窗归属和三端回执沿 SF-A21 至 SF-A23。 [相关用例和原证据](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_family_pet_feed_controls/acceptance)

<a id="fixed-se-classic-bank-trade-controls"></a>

## 固定 SE 的银行与交易控件

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。银行窗 41 和交易窗 43 的 40 处登记对应 26 个回调。银行切换物品页时将运行控件 30、31 分别绑定到 `49C090`、`49C740`，宠物和金币页恢复为通用回调。存金和提金入口分别启用控件 26、27，均将 `C2A97C` 的当前仓储金额复制到 `C4438C` 后调用 `49B890`。物品或宠物转移沿当时的来源和目标槽处理，堆叠数量沿既有窗 42 规格。 [登记和转移规则](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_bank_trade_controls)

**事实**。交易控件 8 和 14 分别读 `C444FC` 和 `C21BA4`，各自在对应阶段为 2 时修改本轮面板参数。控件 11 向同一面板助手传入当前持有金币。主按钮的确认和撤回均检查当前时钟值是否严格大于上次值加 500，独立撤回控件按点击直接调用撤回处理。撤回将本方阶段置 0，在对方为阶段 2 时降到 1。 [交易收包与确认规格](../analysis/capability-first-v1/game-trade-storage-contract.json#/inventory_confirmation) · [指令和本机核验](validation.md#fixed-se-classic-bank-trade-controls-validation)

**待验证**。原版在确认同时收到新报价、数量窗与仓储刷新交错及真实结算回执，继续沿 OS-A27、OS-A28、SW-AC7、SW-AC8、SW-AC12 核验。三端沿同一用例检查页签、数量、存取和确认。 [验收条件](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_bank_trade_controls/acceptance)

<a id="fixed-se-classic-mail-compose-controls"></a>

## 固定 SE 的写信、附件与群发控件

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。窗 22、23、49 的 30 处控件登记对应 13 个回调。22、23 共用正文编辑控件，回复沿已有名单写入实际收件上下文。22 的控件 2 先复制正文，再依次请求附件窗 23 和背包 14。23 首次初始化时，如 22 已活动则标记其退役。23 的控件 2 返回时先标记自身，再请求 22。草稿恢复仍按当前视图及目标。 [邮件规格及登记](../analysis/capability-first-v1/game-mail-data-contract.json#/fixed_se_classic_mail_compose_controls)

**事实**。23 的控件 8、9 循环选择投递宠物的位置，提交按表映射为实际宠物槽。控件 5 单独处理附件物品槽及占用，合资格拖入先释放旧槽，再登记新槽，按下可清除当前附件。控件 3 按当时的个人或家族收件状态和正文提交。所选宠物状态为 3 时可消耗点击并跳过提交。22 的控件 3 沿普通文本及群发各自的已有格式。 [附件前提与提交](../analysis/capability-first-v1/game-mail-data-contract.json#/fixed_se_classic_mail_compose_controls/attachment) · [静态与本机核验](validation.md#fixed-se-classic-mail-compose-controls-validation)

**事实**。49 的行滚动和翻页分别以一行和七行为步长。它们先经 `4A6F80` 写偏移，人数低于七时可写入负值。控件 20 至 26 在自身分派时取当前偏移。控件遍历后，`4A6D60` 先以非负上限重新换算，再更新可见行与绘制。**待验证**。原版短名单中实际同帧参与与选择、消息最终投递和附件结算，以及三端组合操作。 [帧次序与验收条件](../analysis/capability-first-v1/game-mail-data-contract.json#/fixed_se_classic_mail_compose_controls/acceptance)

<a id="fixed-se-classic-post-control-frames"></a>

## 固定 SE 经典窗口的控件后回调

**事实**。固定样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。24 个经典窗口描述符的第 11 个字指向 20 个所选回调。`46ACA4` 在控件之后调用当前窗口 `+0x34`，将返回值交给后续遍历。窗口 29、32、39 共用 `4911B0`，31、46 共用 `492440`。两段正规化指令只差底图编号。 [登记、原字节和业务归属](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_post_control_frames)

**事实**。交易候选 44、用物目标 45、家族兽 51 共用 `46AF80` 换算滚动位置。44 按候选数减 5 设置控件 0 的参与值，45 按目标数减 5 设置控件 0 至 5，51 按说明行数减 9 设置控件 14。各窗按自身数据低位发布滚动值并刷新。家族称号 55 先按旧偏移刷新十行，再写入新偏移。 [边界、控件及读写次序](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/classic_post_control_frames/selected_behaviors/scroll_conversion)

**事实与待验证**。仓库 41 与交易 43 的绘制分支会在取说明前写回换算后的选择值。D0/D3 沿实际帧顺序处理此写入，正式物品和确认字段继续由对应业务所有者提供。名单窗 21 将当时的帧参数传给 `495EF0`，再更新布局和资料。原版输入与刷新重叠、各目标端实际画面、同版适用性仍沿原用例验收。 [所选指令与本机核验](validation.md#fixed-se-classic-post-control-frames-validation)

<a id="fixed-se-stack-quantity-input-preference"></a>

## 固定 SE 的堆叠数量框开启方式

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。经典设置窗 24 的第 11 个控件在 `487A30` 按左键按下位 `0x02` 将 `C5E940` 更新为 `(旧值-1)&1`，同次请求音效 `0x33`。另一套设置行 9 的 `4E4C60` 按命中和左键重复位分派零基控件 5。该控件的 `4E53F0` 作相同更新并返回零，局部扫描继续。首次左键按下会设置该重复位。第 10 行的 `4E5330` 有独立的参与与退役入口。 [原字节、回调与偏移](../build/analysis/legacy-stack-input-preference-v1/validation.json)

**事实**。`47B931`、`4C8AA6`、`4CED46`、`4E16DA` 都读取 `7286AD` 的 Ctrl 按住位 `0x02` 与该偏好。**推测**。沿所选放置的指令，偏好为 `0` 时普通左键开数量框，偏好为 `1` 时 Ctrl 加左键开框。另一种点击继续各自的直接放置路径。开框还需相异端点、源有正量且目标为空，经典路径与另一套普通背包还检查槽号至少为 8。经典合资格的直接放置传 `-1`，已核另一套三种直接放置传 `0`。数量框开启方式和技能、工作状态各有自己的来源。 [四处条件及对应发送](../analysis/capability-first-v1/game-trade-storage-contract.json#/stack_quantity_input_preference)

**事实**。`505840` 把已接受配置记录的 `+0x312` 一字节零扩展读回。设置控件当场修改偏好，经典窗析构或另一套的一次性退役分支再由 `5057F0` 取低字节，沿 `505450` 保存。值 `0` 与 `1` 的另一套设置标签分别为 `Ctrl+鼠标左键` 与 `鼠标左键`，描述的是直接移动所用动作。**待验证**。异常设置记录读回和另一套普通帧的外层调度。 [设置记录](resource-formats.md#fixed-se-stack-quantity-preference-byte) · [复用与本机对照](validation.md#fixed-se-stack-quantity-input-preference-validation)

<a id="fixed-se-alternate-inventory-quantity"></a>

### 另一套背包数量框的确认、返回和退役

**事实**。固定 SE 表的背包 14 和数量窗 16 都属第 1 组。`4E173E` 保存实际两槽，暂存数量置零，按当前文字焦点决定是否先清掉其它窗口槽，然后请求 16 并清普通选取。新建或正常退役背包也清普通选取。`?<E`、`?l)` 和 `@Y)` 的所选资料发布更新活体，普通选取通知保留数量窗持有的两个槽号。 [原件及槽号读写](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_inventory_quantity/facts)

**事实**。已登记回调 `4D7610` 按当前源槽读取本帧上限，依次检测确认、返回、全选、归零、除十和十个数字键。合资格确认用保存的槽号和当时的非零数量发 `'#Q`，清暂存并请求返回背包 14。零值确认只提示。返回按钮请求 14 后仍走当次键盘和上限处理，两者均在鼠标分支之后。标题关闭经公共帮助体处理，一次性退役时，只有输入目标仍为空才恢复默认文字输入。 [分支、焦点和发送顺序](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_inventory_quantity/facts) · [指令与重用档案](../build/analysis/legacy-alternate-inventory-quantity-v1/validation.json)

**推测**。源量由 6 变 3 时，所选回调若当帧确认，会先提交此前输入的 5。如果先经过一帧的数量调整，下一次确认改发 3。**待验证**。两套窗口的普通帧实际调度、回包和焦点变化的真实交错，以及同版服务结果和三端交互。另由实际 PE 启动链绑定设置行 9 的初始化回调，控件登记与实际普通帧仍沿各自调用取证。 [验收条件](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_inventory_quantity/acceptance) · [本机对照](validation.md#fixed-se-alternate-inventory-quantity-validation)

<a id="fixed-se-scene-controller-route"></a>

## 固定 SE 的换场选路与角色快照

**事实**。在 SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的 `cg_se_6000.exe` 中，`!DS` 发送后预选 200 并调用 `502810`。合资格的 `TfD` 仅在 `BFF328` 为零时重走选路，预选标记尚在时保留原子状态。两条合资格路径都接着退役本地身体、清该标记，再发布目标场景。 [调用入口和读写顺序](../analysis/capability-first-v1/game-flow-functional-specification.json#/fixed_se_scene_controller_route/facts/callers)

**事实**。`502810` 在城市标志为零时，从登记头查找五个槽中含本地 ID 的首个控制器。命中且计数为零，选 250，复制控制器与五组角色槽后加一。命中且计数非零，选 252 并加一。查找失败或城市标志非零时清计数并保留已选子状态。最后逐个标记旧子对象和控制器退役，清登记头。正 ID 但无身体的槽只保存 ID，资源保持零。 [选路和原字节](../analysis/capability-first-v1/game-flow-functional-specification.json#/fixed_se_scene_controller_route/facts) · [文件偏移与复用来源](../build/analysis/legacy-scene-controller-route-v1/validation.json)

**事实**。250 先处理窗口，按快照尝试创建过渡对象，写 251 并同次进入该分派。暂写 204 供音频选择，普通淡入由其原入口调度。251 读取保存方向并按 64×48 的步长提交 100 次铺片请求。252 清计数并重建窗口，完成两次对象更新后选 20，下一次分派再走普通场景交接。 [过渡规则与共用用例](../analysis/capability-first-v1/game-flow-functional-specification.json#/fixed_se_scene_controller_route/acceptance)

stage306 本机以同一客户端观察普通换图和动作 82 的基线差异。 [本机回执](validation.md#fixed-se-scene-controller-route-validation)

<a id="fixed-se-251-completion"></a>

### 251 的重入与连续场景回复

**事实**。上述固定样本的 `44FC66` 先处理接收，`44FC7A` 才派发游戏状态。`4EE091` 每处理一条合资格记录便清临时区，`4EE1AF` 回到队列及解码状态检测。多条完整就绪的 `TfD` 可以在外层 250 分派前依次调用 `4EF870`。预选标记仍在时，回复保留子状态、清该标记，并通过 `440450` 更新普通远端对象。控制器登记由独立链维护。 [接收与场景规则](../analysis/capability-first-v1/game-flow-functional-specification.json#/fixed_se_scene_controller_route/completion_251/facts)

**事实**。`43B520` 是 250 重建时安装的对象回调，在 251 的 `409FE0` 遍历中处理呈现与计数。未发现该回调按计数自行结束 251。根对象登记后，正数参与者 ID 在其身体申请前写入。后续合资格 `TfD` 重走选路时，以登记里的 ID 判断。`=xE` 和 `=mJ` 沿原等待及缓存规则处理。 [指令与调用核验](../build/analysis/legacy-scene-251-completion-v1/validation.json)

**推测**。若 `!DS` 已选 250 并退役旧链，两条合资格 `TfD` 在重建前先后到达且没有新的登记，第一条保留 250，第二条清计数并选择普通 200。若 250 已登记含本地 ID 的过渡对象，非零计数且城市标志为零时，后续合资格回复会选 252，即使该槽身体申请失败。**待验证**。实际回复数量、协同角色回包顺序及原版显示需匹配版本的运行记录。 [条件与验收](../analysis/capability-first-v1/game-flow-functional-specification.json#/fixed_se_scene_controller_route/completion_251/conditional_orders)

<a id="fixed-se-work-transition-retirement"></a>

## 固定 SE 的经典工作窗返回、退役与重建

**事实**。固定 `cg_se_6000.exe`（SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`）中，经典窗 10 的返回按钮在模式 1 先恢复技能列表，再减工作持有计数。模式 2 先恢复等级页，再减两个独立计数字节。关窗只先标记。实际析构在模式 1 或 2 先减持有计数，并重读模式决定是否另减两个字节。制造和采集按各自的阶段处理材料、辅助窗和姿势。 [返回与析构](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_work_transition_retirement/facts)

**事实**。`468E50` 逐窗执行析构，再清本窗活动槽及池槽。遍历结束后清共用占用，重读工作上下文，仍启用时调用解除动作 62，调用返回后清上下文。最后一个工作持有者先归零时也可调用 62。该路径清上下文后仍能检查活动中的配方，按实际普通技能槽重查。兜底路径只负责解除。 [两种调用顺序](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_work_transition_retirement/facts/last_work_owner)

**事实**。`4EA1B0` 的 `9/250`、`9/252` 均先同步清理，再重建。重建后仍为 `250` 时将八个占用字节各加一。`9/204` 的本处分派直接重建。`10/1` 转入按标记恢复的重建入口。三个重建入口直接调用同一工作计数清零函数。 [分派与清零](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_work_transition_retirement/facts/transition_dispatch) · [REA 与原字节](../build/analysis/fixed-se-work-retirement-v1/validation.json)

**推测**。同一次完整清理中，最后持有者先清上下文且后续未重新发布时，遍历末尾无需再请求解除。**待验证**。间接计数别名、原版回调交错、另一套工作窗实际分派、当前同版及三端运行。两处 204 的前序退役见下方规格。 [先前工作窗核验](validation.md#fixed-se-work-transition-retirement-validation)

<a id="fixed-se-shared-scene-frame"></a>

## 换图、战斗回场与工作窗的帧顺序

**事实**。固定 SE 在实际进入 9/200 时先取得旧画面，再保存已登记窗口的恢复标记并执行同步析构。窗口仍登记时运行析构回调，再清登记。最后一个工作持有者若已清工作上下文，扫描结束时读到零便跳过兜底的动作 62。9/205 计数到 5 后先推进在途图形对象，随后捕获新画面并进入 204。204 淡入完成后，重建器先清 68 个池指针和 68 个活动指针，再建默认窗和恢复所选标记。两个清零循环均直接写表。 [来源、状态与核对](../build/analysis/fixed-se-shared-scene-frame-v1/validation.json)

**推测**。若 45/46 的在途请求恰在最后一次 205 遍历建成，且在 204 完成前一直留在窗口池，重建器会清除它的登记，该处清零循环不调用旧窗的析构。已标记退役、未到期及已建成的请求各沿原来的处理入口。用 GF-A10、WT-A02、SC-T17 和 WK-T23 核对活动槽、业务释放及原版实际资源结果。 [在途创建、清表和用例](../analysis/capability-first-v1/game-flow-functional-specification.json#/shared_scene_frame_handoff/source_rules/pending_window_before_rebuild)

**事实**。SE 的 204 完成当轮先调用重建，写恢复时间并发布 20。随后 `501F47` 调用 `4EA5B0(100)` 清另一套窗口两个活动槽。旧副槽为 1 时直接返回，其余所选条件下可尝试恢复窗口 1。随后 `501F4F` 进入 `4EA400`，继续处理到期工作及经典窗口。后续普通输入由 20 同轮落入 3 或直接进入 3 的 `5024BF` 处理，仍受具体业务守卫约束。外层 `44FE3B` 负责呈现，追帧路径可以先回到逻辑更新。 [完成帧的调用与输入入口](../analysis/capability-first-v1/game-flow-functional-specification.json#/shared_scene_frame_handoff/source_rules/map_completion_tail)

**事实与推导**。固定 SE 与 Item 均先从 9/1 进入 11，等待 30 次计数更新，第 31 次先写回子状态 1 并重建。SE 在 `50220C` 读 `F5F18C`，Item 在 `58D547` 读 `11D4CC4`。取值为 1 时，准备 13/15 类淡入后经共用尾部推进到 2。其余路径先置准备字并递增一次，共用尾部再读取及递增一次。两次读取之间保持该子状态时，同一轮写出 1→2→3，下一次直接进入普通更新。走 2 的路径则等淡入返回 1，再发布 20。 [两版偏移、字节及组合用例](../build/analysis/fixed-se-shared-scene-frame-v1/validation.json)

**本机对照与待验证**。stage306 在新地图首次绘制挂起时已经接收按下，普通战斗回场的运行时已重建而呈现序号仍为 236，所测换图工作释放未发动作 62。D0/D2/D3/D4 共用场景、窗口及图形入口，按各自实际条件接入。原版在途窗与重建交错、当前同版和三端产品继续沿现有用例。 [本机输入与回执](validation.md#fixed-se-shared-scene-frame-validation)

<a id="fixed-se-classic-scene-window-queue"></a>

## 固定 SE 换图时的旧窗退役与开窗请求

**事实**。普通换图实际进入 `9/200` 时，`501CAE` 在写 201 前调用 `4EA1B0`。它先保存活动标记，再同步析构经典池中的窗口。尚登记的工作窗 10 和目标窗 45/46 随各自回调释放。池清理完成后，工作上下文若仍启用则尝试动作 62。固定样本沿用上节 SHA-256。 [原始分派及窗口槽](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_work_transition_retirement/classic_scene_and_window_queue)

**事实**。普通路径等待子状态 202 的门释放，再从计数 0 进入 205。低于 5 的访问每次增一，第六次按所查路径先推进图形队列，再写 204。淡入函数报告完成才走 `4EA209 → 467760` 重建，清经典池和活动指针的循环只写零，外层呈现随后按其调度执行。另一处写 204 在 `9/250` 已同步清理及重建后发生，同次正常返回前覆写为 251 并推进图形帧。两处写入后均调用 `502950`，由它读取待选调色值。 [两条路径与读写时点](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_work_transition_retirement/classic_scene_and_window_queue/facts) · [调色值来源](#fixed-se-scene-palette-follow)

**事实**。尚未创建的窗请求由类型 3 的图形对象持有，按列表推进。分配失败时同步尝试创建。成功分配从计数 0 开始，第 11 次合资格回调尝试创建，返回后标退役并清非空输出槽。此前已标记退役的请求，在允许回收的帧直接摘除，跳过开窗回调。45/46 构造均先按组掩码退役活动窗，二级实际析构仍取当时共用回调。 [图形队列、工作及用物规则](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_work_transition_retirement/classic_scene_and_window_queue/facts/3)

**推测**。若过渡仍在队列，且在 205 的图形遍历进入时计数为 10，它会先于可能发生的 204 重建尝试创建。若两个同号组 2 请求都在这一帧到期，第一个成功建窗后，第二个会先调用该窗的退役。实际普通报文和多请求交错继续沿 WT-A02、SC-T17、GF-A10 验收。 [原字节及本机对照](validation.md#fixed-se-classic-scene-window-queue-validation)

<a id="fixed-se-map-change-readiness"></a>

## 固定 SE 普通换图的等待与解除

**事实**。同一固定样本在 `461D00` 发送 `!DS`，先保存发送序号的低 16 位，再发送完整的递增前序号。随后选择 200 并调用选路函数，返回时置换图等待字 `BFF32C`。`9/202` 只读该字，非零时处理有限界面并等待，为零则清帧计数后进入 205。另一交互入口 `461E00` 保存独立的低 16 位。 [发送、取值和状态分派](../analysis/capability-first-v1/game-flow-functional-specification.json#/fixed_se_map_change_readiness/facts)

**事实**。`=xE` 的首字段与符号扩展后的本地序号字比较，主序号优先。主序号匹配时先清短等待字。回复第二项为零则调用 `460180` 并清换图等待，非零则在 `BFF330` 为零时清等待。次序号匹配且第二项为零时清次序号的等待字。`TfD` 发布目标地图身份。`Ta>` 在等待字为 1 时另置 `BFF334`。 [回复与地图身份](../analysis/capability-first-v1/game-flow-functional-specification.json#/fixed_se_map_change_readiness/facts/acknowledgement) · [场景与标签](../analysis/capability-first-v1/game-flow-functional-specification.json#/fixed_se_map_change_readiness/facts/scene_and_label)

**事实**。地图校验通知 `=]M` 使用已证校验入口和入场标志。补片 `=mJ` 先处理缓存和初始化，再用两段身份及坐标设重读标志。最后在 `BFF330` 为 1 且第二段身份匹配时清换图等待及两个辅助字。补片落在中心正负 10 格边界内时可置重读标志，坐标等于边界也合格。 [各段条件与写入顺序](../analysis/capability-first-v1/game-flow-functional-specification.json#/fixed_se_map_change_readiness/facts/notice_and_patch)

**推测**。低字回绕或同身份消息重复到达时，仅靠所查值无法区分先后。**待验证**。`BFF330` 的五处绝对引用中三个写入均为零，置 1 的生产者仍待具名写入或适用原版状态记录。原版交错、现行同版行为和三端组合沿 GF-A10 等用例验收。 [本机行为与证据范围](validation.md#fixed-se-map-change-readiness-validation)

<a id="legacy-map-wait-patch-release"></a>

### SE 与 Item 的换图回复、补片和续帧

**事实**。固定 Item `ce3fd800…26a9` 的 `4A5AB9` 在 `!DS` 发送前保存序号低 16 位。发送后先更新 32 位计数，再写 200 并选路。固定 SE 的 `461D00` 在计数写回前先写 200。两版都在选路返回后置普通等待字并清补片开关。Item 的等待字和开关为 `C9C4B4`、`C9C4B8`。 [两版发送及写入顺序](../build/analysis/legacy-map-wait-patch-release-v1/source-review.json)

**事实**。Item `57897C` 的 `=xE` 与 SE 共用符号扩展、主序号优先及状态条件。主序号命中先清短等待。状态为零时调用地图重置并清普通等待，非零时补片开关为零才清。次序号命中且状态为零时清对应次等待。Item 的 `TfD` 先置初次地图准备字，`=]M` 校验返回非零且身份 B 匹配时清该字。`Ta>` 所选路径在等待字为 1 时另置标签标志。 [Item 分派与原件范围](../build/analysis/legacy-map-wait-patch-release-v1/source-review.json)

**事实**。Item 的 `=mJ` 尾部 `572CCC` 与 SE `4EF800` 都要求补片开关等于 1 且身份 B 匹配，才清等待字、开关和标签标志。身份 A、B 都匹配且补片在中心正负 10 格内时，Item 另置区域重读字。范围条件失败的所核分支仍进入尾部。两版开关在文件映像中均零填充，各有五个直接引用，其中三个写零。置 1 的来源仍待具名写入或适用原版记录。 [比较和写入证据](../build/analysis/legacy-map-wait-patch-release-v1/source-review.json)

**事实与本机对照**。9/202 看到等待为零，两版均在同轮清计数后进入 205。Item 同轮另写一次 203，SE 的所选路径直接写 205。stage306 在等待期间已更新地图名，身份 A、B 都匹配的补片到达后恢复普通场景。D0/D2 复用地图解码与确认，GF-A10 分别检验尾部清等待、活动缓存和首个普通帧。 [共用实现与验收规格](../analysis/capability-first-v1/game-flow-functional-specification.json#/legacy_map_wait_patch_release) · [本机验收](validation.md#legacy-map-wait-patch-release-validation)

<a id="fixed-se-ordinary-map-fades"></a>

## 固定 SE 普通换图的淡出、淡入与画面提交

**事实**。用 SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的 `cg_se_6000.exe`。旧图捕获后，9/201 在普通换图选第 16 类，每次增加 32 行的推进范围。分支 `502F72` 以行号初始化目标位置，逐次将合资格的行向下移。第 479 行目标位置严格大于 600 才标记完成。先清画面，再把来源行 479 至 1 降序逐行绘制。报告完成后由 201 写 202，等待条件与补片沿原规则。城市标志为 1 时选择 14、步长 8。 [指令及派发表](../build/analysis/legacy-map-fade-v1/validation.json) · [等待与解除](#fixed-se-map-change-readiness)

**事实**。9/205 的第六次访问先绘制、捕获新图，再同次进入 204。普通分支 17 从底部开始准备行，直到顶部目标小于零，随即进行第一次回移。随后每次还在顶部小于零时缩小下一次推进范围。第 479 行回到 479 即置完成。每次先按原填充值清绘制面，再沿来源行 0 至 479 升序尝试复制，使用既有裁剪。**推测并对照**。固定步长 32、加速度 2 的条带计算给出淡出第 26 次完成，淡入内部准备 16 次，显示计算第 16 次完成。该末次绘制的目标行 445、446 沿用填充色。实际显示帧数取决于外层调度和设备返回。 [固定输入与原指令](../analysis/capability-first-v1/game-flow-functional-specification.json#/fixed_se_map_fade_presentation) · [两种显示尺寸的原创条带对照](../build/analysis/legacy-map-fade-v1/synthetic-frames.json)

**事实**。204 收到完成值后仍在 204 内调用 `4EA1B0 → 467760` 重建经典窗口，更新 `614888`，选择 20 并清城市标志。实际呈现由外层轮次在 `44FE3B` 调 `446740`，设备失败可登记恢复。下次分派 9/20 时再取新画面，随后同轮进入 9/3，所选普通输入从 `5024BF` 进入。追帧可能连续推进逻辑，原设备返回与输入守卫按各自入口判断。 [窗口、呈现与普通更新](../build/analysis/legacy-map-fade-v1/validation.json)

**本机对照**。在现有客户端中，匹配补片一到，新运行时即恢复 `playing`。实际 Canvas 函数接入可控绘制端口，挂起新图第一次图形读取期间成功接收了一次按下。此时只画过旧图，释放读取后才画新图。D0/D2 复用现有场景、绘制及回执接口，把本轮准备、最后一张过渡画面提交、下一次普通更新及首张完整普通画面加入 GF-A10。 [应用对照与回归](validation.md#fixed-se-ordinary-map-fades-validation)

<a id="fixed-se-map-region-refresh"></a>

## 固定 SE 地图重读与普通移动续接

**事实**。沿用 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的 `cg_se_6000.exe`。补片按两段消息身份定位缓存。若进入第三平面写入循环，先以按位或设置 `0xC000`。第二段身份匹配且格子落在活动窗口内时，`45FBB0` 同步更新当前窗口的第三平面。收包分支在第二段身份匹配且移动等待或初始化标志非零时，还会将上次地图帧的中心设为 -1。 [缓存、活动平面及重读条件](../analysis/capability-first-v1/game-map-functional-specification.json#/fixed_se_map_region_refresh/facts)

**事实**。地图中心任一坐标变化，或补片范围标志 `96BA30` 置位，两种模式都从活动缓存重读。模式 1 和其他模式各有碰撞构建函数。读取返回负值时，重读标志、移动等待和上次中心保持。成功读入后，按保存方向检查第三平面前缘，返回零才解除移动等待。任一窗口维度低于 51 时，扫描直接返回零。所查普通帧先尝试移动，再调用地图重读。该次重读解除等待后，下一次合资格移动调用才继续。 [原帧顺序与失败条件](../analysis/capability-first-v1/game-map-functional-specification.json#/fixed_se_map_region_refresh/facts/read_and_recheck)

**待验证**。固定原版的文件异常、同一地图补片与帧的实际交错，以及同版和三端组合结果。stage306 已有按修订重建碰撞网格和检查等待方向的实现，当前每次移动按已发布地图检查，帧顺序及同 B 异 A 的原版活动格行为交 D0/D2。 [对照与开发差异](validation.md#fixed-se-map-region-refresh-validation)

<a id="legacy-map-movement-refresh"></a>

### SE 与 Item 的普通移动缺格续接

**事实**。固定 Item `ce3fd800…26a9` 的 9/3 普通帧先调用移动入口 `4A46D8`，后经 `4A2C5D → 4A99DC` 重读地图。该函数按 `9F5010` 等于 1 或其他值，从 `4A9A50`、`4AA105` 取区域字 `A08BB8`，并分别构建对应碰撞。独立函数 `4A2C6C` 的 `4A2CB9` 也读同一字。所核样本无该入口的直接调用或绝对地址字节，实际外部调用待具名执行或计算跳转证据。 [帧字节、函数范围及调用](../build/analysis/legacy-map-movement-refresh-v1/source-review.json)

**事实**。Item 三个读点均在中心变化或区域字非零时调用 `4A25F5`。负返回跳过碰撞更新、缺格复查及完成中心提交。成功时更新碰撞，等待字 `A08B60` 非零才按保存方向调用 `4A3F7C`。复查返回零清等待，成功重读仍清区域字。任一维小于 51 时复查直接返回零，所核前缘按第三平面原始字等于零判断缺格。 [三路分支和字节锚点](../build/analysis/legacy-map-movement-refresh-v1/source-review.json)

**事实与条件推导**。Item `4A5C76` 在发现缺格时，经 `57CE29` 提交 `!hM`，随后置等待并保存方向。普通移动入口观察等待时跳过当前步。Item 与 SE 在所核普通帧都先移动后重读，因此该轮重读成功解除等待后，下一次合资格移动才续接。正常读、失败及重试沿 MF-D2/MF-D3 复用。 [两版共用规格与本机核验](validation.md#legacy-map-movement-refresh-validation)

<a id="legacy-map-cache-io"></a>

### SE 与 Item 的地图缓存读写

**事实**。固定 Item `ce3fd800…26a9` 的 `5780E5` 与 SE `37c4dfd2…13bd` 的 `4F2BFC` 都保存 `@Qu` 的第 3 个整数。两版的缓存路径构造 `4A1C7E` 和 `45F4E0` 分别使用这两个存储位置。A 为零时路径是 `map/0/B.dat`，其余按 `map/A/上下文/B.dat`。场景准备、区域读取和补片写入共用该构造。 [两版调用和文件字节](../build/analysis/legacy-map-cache-io-v1/source-review.json)

**事实**。Item `4A2075` 与 SE `45F850` 按消息 A/B 写文件。第三平面各所写值先 OR `0xC000`。活动地图只比较 B，再以原矩形起点加裁剪循环的列行偏移检查半开窗口。命中时两版分别在 `4A25C0` 和 `45FBB0` 更新活动值，再写该行的第三平面。左侧或上侧越界可使活动格与磁盘格错开。 [坐标与读写顺序](../analysis/capability-first-v1/game-map-functional-specification.json#/legacy_map_cache_io/facts/region_io)

**事实**。两版区域读取打开失败时先投递 `PostQuitMessage(0)`，再返回负值，三个输出平面此时尚未清零。补片打开失败返回负值，跳过写入及活动格更新。收包调用者仍按原地图身份、等待和范围决定重读。打开成功后，所查区域入口不检查各次寻址、读写和关闭的返回。**待验证**。实际短读、部分写入及同版结果。 [文件头与创建条件](resource-formats.md#legacy-map-cache-layout) · [本机核验](validation.md#legacy-map-cache-io-validation)

<a id="legacy-map-notice"></a>

### 地图校验通知的缓存选取和补取

**事实**。固定 Item `ce3fd800…26a9` 的 `572A22 → 4A38A2` 与固定 SE `37c4dfd2…13bd` 的 `4EF510 → 460240` 处理 `=]M`。所核分支在准入字为零时按活动 A、通知 B 和路径上下文读缓存。当三项完整通知整数分别等于校验值时返回 1。任一不符，带通知自身的 A/B 和原矩形发 `!hM`，随后返回 0。 [调用、文件选择和比较](../build/analysis/legacy-map-notice-v1/source-review.json)

**事实**。两版校验均对每平面累积固定 1458 字节，第三平面依活动模式掩 `0x1FF` 或 `0xFFF`。匹配后，仅通知 B 等于活动 B 才清场景首次准备字。独立区域失效位为 1 时，标记上次中心失效并清这一位。 [共享规格与状态次序](../analysis/capability-first-v1/game-map-functional-specification.json#/legacy_map_notice)

**待验证**。两版校验调用者忽略区域读取返回值。打开失败时三块输出尚未清零，后续比较结果需适用原版回执。stage306 已支持同 B 异 A 时用通知身份补取。当前单缓存遇到不同 B 即返回不可用，复刻按实际存在的缓存和宿主错误验收。 [两模式及现有差异](validation.md#legacy-map-notice-validation)

<a id="legacy-map-context-reentry"></a>

### 返回选服与再次入场的地图目录

**事实**。Item `ce3fd800…26a9` 的 `9FA6DC` 与 SE `37c4dfd2…13bd` 的 `95D554` 分别占可写映像零填充区的四字节。全文件直接绝对引用分别是七处和五处，各自唯一直接写入来自 `@Qu` 的第 3 个整数。 `TfD` 处理器分别在 `572DA7` 和 `4EF8E0` 取当时的值，交给场景缓存准备。 [地址、指令和样本](../build/analysis/legacy-map-context-reentry-v1/source-review.json)

**事实**。Item 的主状态 11 从 `58CAA1` 退役连接，最终进 2/0。选服后的 `48FC5D` 所查分支从 `48FDFE` 退役旧连接，再分配解析缓冲并继续连接。SE 主状态 11 的确认在 `501901` 退役、`50196D` 发布 2/0。所查 `455500` 分支在重新配置缓冲后推进连接。两版所查退役及初始化均未直接改写地图目录值。 [所选状态和调用范围](../analysis/capability-first-v1/game-map-functional-specification.json#/legacy_map_context_reentry)

**静态推导**。在上述同进程路径且尚未收到新 `@Qu` 时，先到的 `TfD` 使用已保存的值。新进程此前使用零。A 为零时路径省略该值。本机确认当前共享端的新目录值不会改变同 A/B 及同头的复用结果，已登记到 MF-T01。**待验证**。其他间接写入、原版和当前同版回包时序、实际磁盘和三端流程。 [本机对照](validation.md#legacy-map-context-reentry-validation)

<a id="historical-forget-return"></a>

## 历史遗忘返回与 Item 报价页数

**事实**。固定 SE 的 `4AF910` 在普通 `Q?m` 模式 `0x12` 处理中写 15 组技能资料，再请求经典训练窗 54。第一个数值表止于 `C1DF74`。固定 Item 的 `529468` 为第二套窗 57 写同样上限的资料，第一值表止于 `CBB13C`。两个表的首数值控制普通技能行是否可提交。 [两版来源范围](../analysis/capability-first-v1/game-service-selection-contract.json#/historical_forget_return_and_quote_pages)

**事实**。第二套窗 57 先处理返回动作 99，再扫描 15 行。没有命中时扫描索引为 15，发送门槛实际读取 SE 的 `C1DF78` 或 Item 的 `CBB140`。所查写入属于经典背包的物品说明切换，打开背包及所选变更置零，后续合资格事件使说明索引回绕。原版经典训练窗 54 的返回直接使用整数 99 格式化正文，提交后标记退役。stage306 的经典返回在空列表和技能失效后均已实测。 [已证读取与写入](../analysis/capability-first-v1/game-service-selection-contract.json#/historical_forget_return_and_quote_pages/facts) · [本机对照](validation.md#historical-forget-return-validation)

**事实**。固定 Item 的 `529E48` 先清两组报价，各读最多八条。发布当前页 0 和 `trunc((记录数-1)/8)+1` 后请求打开窗 58。0、1、8、9、16 条对应 1、1、1、2、2 页。**待验证**。SE 的 `C07F8C` 实际发布、两版第二套窗口的业务准入及同帧输入可达性。 [规则与恢复条件](../analysis/capability-first-v1/game-service-selection-contract.json#/historical_forget_return_and_quote_pages)

<a id="fixed-se-pet-count-selection"></a>

## 固定 SE 的宠物数量、翻页与训练报价

**事实**。`FBY` 与 `G:w` 更新记录后调用 `4FF000`，在 `4FF021` 发布五个宠物槽中的存在数，再复制五行物理槽映射并置刷新。映射保留空槽。另一套宠物资料页 `4DEB40` 在翻页后据更新的行值取实际槽。加点页 `4DF420` 在箭头前快照槽位，当次加点和资料读取仍用该槽，两页的页标均使用当时的行号加一与存在数。 [发布来源与页内顺序](../analysis/capability-first-v1/game-service-selection-contract.json#/fixed_se_pet_count_and_selection)

**事实**。报价窗 58 的有效点击先比较金币，再检查宠物存在数。余额不足与零宠物分别置提示 1、2。成功时保存页内行号，将每页 8 行算得的全局零基号作为 `/1I` 的十进制文本发送，再请求关闭。后续 59、60、61 的标题用当时页号和保存行重算。报价翻页的总页数另取 `C07F8C`。 [报价指令和来源](../analysis/capability-first-v1/game-service-selection-contract.json#/fixed_se_pet_count_and_selection/facts/3)

**待验证**。第二套宠物资料及加点窗的普通运行和零宠物准入。D0/D2/D3 共用 PS-A01 至 PS-A03。经典训练的占用行、金额及失效保护已作本机对照。报价空表及同号替换见下方规则。 [本机对照与验收范围](validation.md#fixed-se-pet-count-selection-validation)

<a id="fixed-se-training-quote-pages"></a>

## 两版宠物训练报价的空表、翻页与替换

**事实**。固定 SE 的另一套窗 58 回调 `4BDCF0` 把活动首参交给 `4E94D0`。返回 0 时跳过报价，返回 2 时另清活动模式和预览。返回 1 后，距离检查可请求关窗，当前回调仍扫描八行，只对首字非零的记录做命中和绘制。点击行先于翻页。提交、提示拒绝及取消都跳过箭头，继续本帧绘制。前箭头减一为负时写总页数减一，后箭头加一达到总页数时归零。页标和绘制读取处理后的页。 [回调和原字节](../analysis/capability-first-v1/game-service-selection-contract.json#/fixed_se_pet_count_and_selection/quote_page_and_replacement)

**事实**。固定 SE 页号、总页数和第二套行表在 PE 虚拟区初始为零。若总页数和页号均为零且已经通过窗口准入，前箭头会写 −1，随后按新页计算记录地址。相同初始值下的后箭头则回到 0。固定 Item 的 `529E48` 清两页报价、重置页号和发布总页数后再请求打开，空表也发布一页。主槽已选窗 58 时，`56BB80` 返回 0 并保留该槽。已发布的资料仍生效。窗 59 用当时页号和旧存局部行重算，所查发布体未改该选中值。 [两版静态核验](validation.md#fixed-se-training-quote-pages-validation)

**事实**。固定 SE 经典 `Q?m` 的 0x18、0x2A 填窗 54 的独立行表，重置窗内偏移。原活动模式非负时，六个指定替换序号且来包模式非 0x20 先执行两次窗口组清理并复位。代码随后按窗 54 的活动对象及转换字选择重建或重开。D0/D3 沿原 OS-D7 处理经典替换与等待，D2 复用余额和五槽宠物资料。 [经典等待规格](../analysis/capability-first-v1/game-training-services-contract.json#/classic_pet_training_wait_owner)

**待验证**。固定 SE 第二套窗的实际总页数写入、两版常规帧对窗 58–61 的活动参数和旧选择实际可达性。取得对应写入、调用或同版实证时继续 SC-GAP-04。 [用例与恢复条件](../analysis/capability-first-v1/game-service-selection-contract.json#/fixed_se_pet_count_and_selection/quote_page_and_replacement/proposed_acceptance)

<a id="fixed-se-battle-results"></a>

## 固定 SE 的战后结果窗 30 和 31

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`>_U` 和 `>xG` 各携一个字节串，合资格时分别写同一待处理动作字的 1 和 2，再写各自资料。`4EADC0` 在所证帧路径读取最新动作，请求各自窗口，再清两处暂存值。动作 1 的声音由四个角色标志和十五个技能标志中是否有值恰为 1 决定。 [字节、帧条件与关闭](../analysis/capability-first-v1/game-entry-review-contract.json#/state_consumer_closure/fixed_se_battle_results)

**事实**。窗 30 初始化读取四行角色、三项名称和所选技能。技能沿现有十五项排序表，以实际槽取结果，最多呈现十行。角色槽 `-1` 隐藏，`-2` 显示本地人物，其余读宠物。`48C990` 每帧重读三项图号，仅绘制非负项。窗 31 初始化将两个 base62 值投影为 `DP` 和 `Total`，再由通用帧绘制已有控件。每次初始化重写两个窗口共用的 32 位截止值。当前时间无符号比较严格超过截止才自动标记关闭。 [初始化与图号用例](../analysis/capability-first-v1/game-entry-review-contract.json#/state_consumer_closure/fixed_se_battle_results/frame_rules)

**推测**。若同类结果在已排定过渡、尚未创建窗时再到达，创建会读取较晚发表的资料。已创建的窗 30 仍绘制时，图号可能先于文字变化。以实际帧顺序复核此交错和两窗共享期限。 [组合用例](../analysis/capability-first-v1/game-entry-review-contract.json#/state_consumer_closure/fixed_se_battle_results/acceptance)

**待验证**。原版实际结算、服务返回与三端呈现。所测 stage306 在入场前、已有场景、已收到入战消息时均解码两类正文，六组输入的世界视图和结果窗状态均未变化。 [本机核验](validation.md#fixed-se-battle-results-validation)

<a id="fixed-se-classic-directory-mini-mail"></a>

## 固定 SE 的目录检索、玩家资料和迷你邮件

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`` _&` `` 经过三道原接收条件后依序交给 `4902A0`。类型 `0x26`、`0x27` 和 `0x28` 分别先写资料，再请求经典 60、61 和 62。窗 60 从已有三张目录读取真实类别、行号和活动位。窗 61 支持关键词查找、前后翻页与选中玩家，选中行读取真实字段。 [消息、控件和资料布局](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_classic_directory_mini_mail)

**事实**。窗 62 的控件 0 读取本机金币与当前迷你邮件费。余额等于费用也能打开窗 63，余额不足只走本地提示。进入前保存收件人编号和名称，随后同步请求窗 63。两个窗均为组 1，按现有共同构造与销毁规则处理。所选新建路径把正文输入接到 `C15880`，活动同号窗口可以复用。 [打开条件、静态提示及输入字节](../build/analysis/fixed-se-classic-directory-confirm-v1/source-review.json)

**事实**。窗 63 的控件 2 在正文非空时提交已有 `/1I`，按钮值为 8。请求使用当时坐标、对话编号和参与者 ID，正文含已保存的收件人编号、已转义名称和内容及末尾 0。请求调用之后才查迷你联系人，存在时插入方向 1 的本地历史。随后标记窗 62、63，播放反馈并清编辑首字节与当前编号。取消控件只标记当前窗并播放反馈，焦点恢复沿通用控件实际销毁。 [转义、回调及退役次序](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_classic_directory_mini_mail/facts)

**推测**。余额或费用在开窗后改变时，所查提交路径仍按当时正文决定是否发出。重复打开同号窗时，收件人暂存和窗体的 `-1` 初始化可以发生在不同的操作。 [交错和用例](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_classic_directory_mini_mail/source_inferences)

**待验证**。查询与实际回复的配对，发信后的真实扣款、拒绝与投递，三端的输入法组合、重复打开和关窗。stage306 已有外层编码及内层转义规则，所查回包尚未发布这些业务效果，迷你邮件的分层预算仍需接入。 [基线与待验范围](validation.md#fixed-se-classic-directory-mini-mail-validation)

<a id="fixed-se-item-target-menus"></a>

## 固定 SE 经典普通用物的两级目标

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。经典背包回调 `47C880` 用格号加 8，装备回调 `47CFE0` 使用实槽。通过普通使用条件后，两处先记来源槽 `C1E6D0` 再发 `$fa(X,Y,槽,0)`。物品代码 `0x67C9` 走独立的物品选物品操作，提交 `6=L`。NPC 模式 `0x1D` 也能写同一暂存槽。 [地址与取值](../build/analysis/fixed-se-item-target-menus-v1/source-review.json)

**事实**。`LC=` 和 `LHm` 各解码一段字节，读取 `9250C8` 为零才委派 `4CB050` 和 `4CA810`。窗 45 最多 10 行，依次为本人、有效且非本人的队员及正文资料。选择时发 `*~/` 并保存一级行序号。二级到达时按该序号读取当前一级类别。本地分支用本人和合资格的宠物，后者取过滤后的选择值。远端分支依次读取最多六行，每行一名六数。窗 46 确认发 `$gW`，取点击时的坐标、`C1E6D0` 和二级选择值。返回发零参数 `*pT` 并等待，取消请求退役，实际析构才退还占用。 [完整字段、条件和窗回调](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_item_target_menus)

**事实**。`5009B0` 交换两条槽记录后调用 `47F200`。菜单占用槽 `C1F684` 在匹配交换端点时随之移动。`C1E6D0` 只有在任一端点物品代码为 `0x67C9` 时才按同样方式调换。两个经典窗均为组 2，请求前加占用。构造前走共用组清理，先调用匹配旧窗的析构，再清活动槽。另一套注册 77/78 有独立的选择次序和 `$gW` 来源槽。 [槽交换、新旧窗及另一套注册](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_item_target_menus/facts)

**推测**。若第二次 `LC=` 在 `LHm` 到达前改变了已选序号的行类型，原客户端将按新类型构造二级资料。若旧窗 45 仍活动，窗 46 的取得先于旧窗 45 析构退还。两例均由已核指令顺序推导。 [复现条件](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_item_target_menus/inferred_from_selected_order)

**待验证**。服务何时送这两种回复、最终用物结果、合法输入域、另一套窗的正常调度和三端接线。stage306 可解码两个回包和发送所需请求，本机测试中两个回包均未向业务状态发布。 [验收边界](validation.md#fixed-se-item-target-menus-validation)

<a id="fixed-se-item-target-retirement"></a>

### 两级用物的资料替换、取消及换场

**事实**。固定 SE 的所选回包入口在同一门槛为零时委派构造。`LC=` 先重建并发布一级资料，`LHm` 用保存序号读当前一级类别，再发布二级资料。两级窗在实际构造前写入共用行资料。窗 45 初始化时复制回调，可以在滚动中再填五行。窗 46 初始化时填六行，普通绘制沿用控件，点击重新取当前行数和回调。 [资料与输入时点](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_item_target_menus/classic_replacement_and_invalidation/facts)

**事实**。固定样本用物和急救、治疗等工作分支均调用窗 45、46 的打开入口，分别登记业务回调。取消先锁住本次输入并请求退役，实际析构才调用 `-1`。一级读取初始化时保存的回调，二级读取当时全局登记的回调。若继续走用物析构，则先减槽占用，再减共用计数。换场进入 `9/200` 时按池顺序同步退役。`9/250`、`9/252` 同步退役后再重建，并在重建中清占用槽和计数。 [分派与退役用例](../analysis/capability-first-v1/game-service-invalidation-contract.json#/service_receiver_consumers/fixed_se_item_target_menus/classic_replacement_and_invalidation/proposed_acceptance)

**推测**。若工作或用物的新资料在同号窗 46 的旧实例真正析构前到达，旧实例会读取后到的业务回调。若 `LC=` 缩表后所存序号仍在十个物理槽内，`LHm` 可读到已清尾行的类别 0。**待验证**。同号请求的实际执行顺序、间接别名、服务回复配对、另一套窗口正常分派和三端产品。 [来源及边界](validation.md#fixed-se-item-target-retirement-validation)

<a id="fixed-se-ccl-scene-publication"></a>

## 固定 SE 的场景特效与延后显示

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`4F98CF` 将 `CcL` 的七个整型和一个字节串交给 `4F4080`。`924F30` 非零时直接返回，为零才读取 `9250C8`，读取值为零才换算图形资源。外层字段 6 为 0 时直接申请特效，对 0–3 的字段 7 依次选模式 2、8、4、0。 [REA 原档案、地址与字节](../build/analysis/fixed-se-ccl-scene-publication-v1/source-review.json) · [外层字段与模式](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_ccl_scene_publication)

**事实**。外层字段 6 非零时，先解析竖线分隔的 12 个正文位置。`43FA10` 按正文第 2 项的 base62 ID 查活动远端表。有同 ID 或 1000 槽用满时直接结束。成功时登记类型 2，身体指针初为空，再按字段 7 选择模式 3、9、5、1。选择超出范围或特效分配失败时已登记记录仍保留。位置、方向、资源和文字沿正文各自的字节或数值规则处理。 [正文字段、记录与边界](../analysis/capability-first-v1/game-actor-functional-specification.json#/fixed_se_ccl_scene_publication)

**事实**。`441F50` 注册 `441D70` 为帧回调。八个可达模式各有结束条件，涉及本机距离、创建时钟、帧计数或场景相位。终止分支先调用 `440730`，再标记特效对象退役。直接分支传 `−1`，扩展分支传外层字段 1。`440730` 按该值重查活动记录，有记录且身体为空才尝试构造。 [模式和生命周期](../analysis/capability-first-v1/game-actor-functional-specification.json#/fixed_se_ccl_scene_publication/record_and_effect_lifecycle)

**待验证**。实际服务发送条件、各模式的逐帧画面及三端实装。stage306 已能解码这些报文，本机三组输入均无对应的场景发布。 [本机对照与边界](validation.md#fixed-se-ccl-scene-publication-validation)

<a id="fixed-se-other-player-profile"></a>

## 固定 SE 的他人简介与窗 64

**事实**。固定 SE 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`4F74E0` 有五处直接调用。`;JE` 的第一字段为 0、1、2、3 时，第二字段分别来自经典名片槽、家族成员 ID、迷你联系人 ID、地图右键命中的合资格实体 ID。`4FA1B7` 分派 `^=0` 的 13 字段至 `4F56F0`，八段文字各进 256 字节副本再反转义内层。 [REA 6.7.0、Ghidra 12.1.4 和原指令](../build/analysis/fixed-se-other-player-profile-v1/source-review.json) · [字段与调用](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire/other_player_profile)

**事实**。`4F56F0` 先更新公共简介，按每次收包时的目录查购买、贩卖和描述图块。`5180F0` 取物理顺序中第一条活动字节为 1 且编号匹配的记录，返回 `−1` 时保留 `0x3C0F0`。随后 `5180E0` 请求窗 64。窗 64 登记 21 个控件，`4B8070` 写入其中的文本与图块。肖像依外观档位换算，自由简介按每行 28 字节取前四行。 [控件、行长及肖像分支](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_other_player_profile)

**事实**。窗 64 属组 1，请求时先清理组掩码 2 的窗口。已有窗继续使用原对象并请求移到前面，下一常规帧读新资料。若它已标记关闭，新包更新资料后仍由 `46A0E0` 优先按关闭处理。`467FC0` 保存坐标并清活指针，退役后的下一份有效资料才请求新窗。 [通用窗口顺序](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_other_player_profile/open_and_reuse)

**待验证**。四类查询各自对应的实际服务回复、字段 2 的语言标签、原版输入边界及三端窗口操作。现有 stage306 可组包、解码和复用已有外观换算，待接入世界资料发布和窗 64。 [本机对照和后续用例](validation.md#fixed-se-other-player-profile-validation)

<a id="fixed-se-player-directory"></a>

## 固定 SE 目录版本、行发布与恢复

**事实**。固定 SE SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`4F5640` 收到 `]op` 后先写邮费提示值与当前角色的迷你历史比较值。前两字段和已存版本不等时分别置掩码 1、2，掩码非零才调用 `4F7370` 送 `:_d`。通知不推进版本。`4F5540` 和 `4F5B80` 从各自列表的第一个字段写版本。前者写贩卖及购买表，后者写描述表。 [REA 6.7.0、Ghidra 12.1.4 与原字节](../build/analysis/fixed-se-player-directory-v1/source-review.json) · [字段与调用顺序](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire/directory_publication)

**事实**。收到列表先清对应表的活动字，然后至少发布一行。空列表体或只有版本时发布编号和资源编号为 `−1`、名称为空的活动行。尾随竖线可增加一行，名称达到 255 字节则停止。目录窗 59 每帧控件分派前读取十行，收包本身不重置该窗偏移。查看他人简介的 `^=0` 经 `5180F0` 找前三项资源，再请求显示窗 64。匹配使用活动位 1 与真实编号，未匹配时保留 `0x3C0F0`。 [行与窗口规则](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire/directory_publication/row_publication)

**事实**。`450555` 的启动调用经 `4673D9` 转到 `518710` 读取公共目录。所查主状态 7、11 清理路径先调用 `518570` 写 `profile.dat`，再经 `467599` 转到 `5186A0` 写目录。文件打开成功便返回 1，实际读写与关闭结果须另验。与该原件同包保存的目录为 81,620 字节，三张表有 29、29、11 个活动行。 [公共目录格式](resource-formats.md#fixed-se-player-category-format) · [本机读回](validation.md#fixed-se-player-directory-validation)

**待验证**。目录短读和缩表后同帧点击的原版现场结果、保存失败后的三端行为、迷你邮件实际扣款与投递，以及当前同版目录发布。窗 64 的显示与目录查找共用已证规则，实际查询与回复配对继续沿简介用例。 [目录用例](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire/directory_publication/proposed_acceptance) · [他人简介](#fixed-se-other-player-profile)

<a id="fixed-se-classic-player-profile"></a>

## 固定 SE 经典简介和分类目录

**事实**。样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。简介窗 58 有 34 个控件，目录窗 59 有 32 个。58 的控件 19/20/21 分别回 7/8/9，目标活指针为空才创建并继承坐标。控件 16 与目录的控件 0 请求通用关闭。58 的析构以窗 9 活指针非空为位置同步条件，读取的是 58 的坐标。所查返回和关闭路径均未调用简介发送。 [REA 6.7.0、Ghidra 12.1.4 与 PE 字节](../build/analysis/fixed-se-classic-player-profile-v1/source-review.json) · [窗口规则](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_classic_player_profile)

**事实**。控件 5–8 的活动编辑器经 `46FA10` 更新四处草稿。逐字节比较四段文本及三个目录编号的 `517900` 决定控件 29 是否参与。窗口 59 沿三种模式显示十行；点击活动行只改草稿的目录编号和展示字。确认先尝试恢复当前聊天焦点，再组包发草稿并复制已选角色的对应字段。手动公开先送 `=Nd(1)` 再送已存简介；入场两种公开位均先送已存简介再送 `=Nd`。缓存编号和当前草稿编号在公开路径分别用于编号和文本选择。 [编辑、选择和组包规格](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_profile_wire)

**事实**。`5185F0` 读取 `profile.dat` 的 `0x1050` 字节块后把当前角色的 `0x828` 字节复制到活动区。打开失败才由已证入口走初始化。所查游戏清理的 `467594` 调 `518570` 写同一块。函数返回反映文件能否打开，读写长度和关闭结果需要单独核验。 [读写位置和容量](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_classic_player_profile/persistence)

**待验证**。简介保存短读时的实际显示、输入法最后一次组合与点击时序、三端实装和当前同版结果。公共目录的版本与读写沿对应规格。 [目录后续来源](#fixed-se-player-directory) · [本机对照](validation.md#fixed-se-classic-player-profile-validation)

<a id="fixed-se-receive-operation-admission"></a>

## 固定 SE 收包入口与业务操作

**事实**。`cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。核对 `4F8A40` 的 37 个所选分派、报文标记和消费函数。场景特效、玩家简介、阵位、全量背包、工作、名片、家族和战后显示等 34 个入口已有可用的业务规则。入口台账按实际操作引用，每个共用规则沿原所属模块继续维护。 [报文、分派和操作对账](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/receive_operation_admission)

**事实**。`W(y` 的 `4F49E0` 处理收到的地址文本。旧串为空时只保存。旧串非空时 `51BB40` 在旧串中查找新串。找到即返回，保留旧串。找不到时先按 `5679B0`、`567994` 的模板显示地址变化及可能重连的提示，再保存新串。D0/D2 沿既有本地提示入口交接，实际连接状态由传输回执决定。 [原指令、模板位置及用例](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/receive_operation_admission/source_supplements/address_notice)

余下两个入口已与 Item 的同标签分支对照。一条决定通用失败提示，一条写入 16 位状态。业务归属仍沿各自具名来源核对。35 个已归属入口的旧版运行、当前同版及三端效果继续沿各自用例验收。 [两版对照](#legacy-unassigned-receive-outcomes)

<a id="legacy-unassigned-receive-outcomes"></a>

### 两版通用失败提示和低 16 位状态

**事实**。固定 SE `37c4dfd2…13bd` 与 Item `ce3fd800…26a9` 均从 `Ok?` 的四项位置读整数，分别在 `4FB589` 和 `581F77` 调消费者。首项以完整 32 位与零比较。为零时以参数 4、3 发布相同的通用失败文字，非零时直接返回。后三项仍由分派解码，两份消费者的所选路径只读首项。 [两份原件及指令](../build/analysis/legacy-unassigned-receive-v1/source-review.json)

**事实**。两版的 `Kh>` 只解一项整数。SE `4F36C5` 写 `F5F16E`，Item `578DDE` 写 `11D4CA6`，均取低 16 位。SE `4FF160` 内的 `4FF39D` 写零。Item 的 9/0 分支在 `58CCA7` 调 `5893CA`，沿 `58969A` 写零。两版所见精确地址引用各有两处，均是上述写入。相邻字的读取各有独立地址。 [分派、初始化和引用](../build/analysis/legacy-unassigned-receive-v1/source-review.json)

**待验证**。`Ok?` 的业务触发仍需同版具名请求和对应回复，`Kh>` 仍需直接、间接或重叠读取的正向证据。D0/D2 可沿现有解码和文字呈现复用通用提示的已证条件，16 位状态的业务用途等实际读者确定。两版固定样本的原版执行和三端接受尚待验收。 [本机对照与适用范围](validation.md#legacy-unassigned-receive-validation)

<a id="legacy-address-notice-retention"></a>

### 两版历史游戏的地址变化提示与重开

**事实**。固定 SE `37c4dfd2…13bd` 的 `4FC338` 和固定 Item `ce3fd800…26a9` 的 `582C26` 分派同一个 `W(y` 标签，各带一个字节串字段，分别进入 `4F49E0`、`57A4B6`。两版的两个提示模板字节相同。旧串为空时只保存。新串在旧串中命中时均保留旧值。未命中时先显示带旧值和新值的提示，再显示重连提示，最后复制新串及第一个 NUL。 [样本、REA 档案与原指令](../build/analysis/fixed-se-address-notice-retention-v1/source-review.json)

**事实**。旧串位于两版可写段的零填充区。从 `D1D030`、`F92B10` 到各自下一个已证独立工作区 `D1D134`、`F92C14` 都相隔 260 字节。固定 SE 的 `4EE290 → 4FC5C0` 给解析器传入 65,536 字节，所选字段复制保留一个字节给 NUL。这个参数约束解析器的临时输出。提示回调本身按实际 NUL 位置复制，原数组大小和实际业务最大长度仍待证。 [地址边界与解析来源](../build/analysis/fixed-se-address-notice-retention-v1/source-review.json)

**静态推导**。两版所选退役辅助 `4EE2F0 → 4FC650`、`57132F → 583057` 清连接状态并释放解析缓冲。固定 SE 的 `455500` 普通重开链重新初始化这些缓冲并进入连接阶段。所核退役及重开操作未清提示文本，因此同进程在这条路径上保留旧值，新进程从零填充初值开始。实际重连、其他外层退役和同版行为仍按用例核验。 [退役证据](../analysis/capability-first-v1/game-communication-functional-specification.json#/legacy_address_notice_retention)

**本机对照**。现有共享客户端在七个原创短文本输入中均正确解码并返回该操作，文字视图没有产生记录。D0/D2 复用现有解码与文字呈现，补旧值所有者及按序提示。D5 核同实例重开、全新实例和退役连接的迟到回执。 [本机对照](validation.md#legacy-address-notice-retention-validation)

<a id="legacy-receive-retirement-order"></a>

## 历史 SE 与 Item 的缓存收包、断线和换角顺序

**事实**。固定 SE SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，固定 Item 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。普通帧分别在 `44FC66`、`4874A5` 轮询接收，随后在 `44FC7A`、`4874B9` 派发游戏状态。两版所选接收返回 0 后继续检查缓存。返回 −1 时，错误 10035 转为 0，归类值按有符号比较大于 0 才关闭套接字并写断线标记 1。 [REA 6.7.0、Ghidra 12.1.4 与原 PE 核验](../build/analysis/legacy-receive-retirement-order-v1/source-review.json)

**事实**。接收写标记 1 的当轮分别继续到 SE `4EE04C` 和 Item `57103B`。有缓存且解码就绪时，帧消费返回 0 后各调用 `4F8A40`、`57F79E`，随后清临时解析区并重新检查队列。两版普通写出前另查断线标记，非零时跳过。下一次在入口见到标记 1 且协议和网络活动位满足时，发布主状态 11、子阶段 0 并写标记 2。Item 状态分派仍会先应用独立的待切换值。 [两轮分支及状态引用](../build/analysis/legacy-receive-retirement-order-v1/source-review.json)

**事实**。两版 `]gQ` 分支只写解码就绪位为零，返回后本轮可再次检查缓存。有余量且就绪为零时，先提交控制请求，再尝试消费一条记录。成功返回 0 后退出本轮的接收分派。消费返回非零时，当轮发布主状态 11、子阶段 0，并直接写标记 2。这个分支的记录未进入普通消息分派。 [就绪位、消息常量及分支](../build/analysis/legacy-receive-retirement-order-v1/source-review.json)

**事实**。两版图鉴摘要和详情各自使用消费时的有符号角色槽。Item 的 `587BEE` 和 SE 的 `4FE0F3` 在合格详情中读取该槽，Item `58806A` 和 SE 摘要尾部按该槽写版本。Item 个人、家族邮件的 `588882`、`588AD1` 分别读取当时槽及各自的有效联系人。迷你邮件按独立联系人查找定位。 [接收绑定和读槽指令](../build/analysis/legacy-receive-retirement-order-v1/source-review.json) · [邮件业务准入](#legacy-item-mail-history)

**静态推导**。在选角更新槽之前执行的合格消息写旧槽。若同一连接仍处于可接收状态，选角发布后才进入消费者的合格消息读取新槽。Item 所选已有角色在 `4999AD` 写槽后发布主状态 5，后续主状态 5 的帧仍先接收，再读回两份邮件和图鉴缓存。因此验收需分别核对当时的写槽及读回后可见的记录。消息实际由何时发出、同一连接内是否有迟到回包及读回结果仍待运行观察。 [槽发布与缓存读回](#legacy-item-album-mail-lifecycle) · [合用规格](../analysis/capability-first-v1/game-communication-functional-specification.json#/receive_retirement_order)

**本地对照**。现有共享解码可在一个输入块中处理重置及随后 48 字节的图鉴详情，详情更新本地投影，解码仍等待替换材料。旧连接关闭后的迟到读已有本地保护。D0/D2 需补来源所选的当轮收包及断线状态，D3 沿当前槽和联系人处理记录，D5/D6 验收真实宿主及当前版本。 [本地对照及验收](validation.md#legacy-receive-retirement-order-validation)

<a id="legacy-item-disconnect-recovery"></a>

## 历史 Item 的断线提示与返回选服

**事实**。固定 `cg_item_6000.exe` 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。普通帧在 `4874A5` 轮询接收，再在 `4874B9` 派发主状态。所选错误路径调用 `5AE37C` 后将 `F8E916` 置 1。轮询入口在两个准入字节均非零时消费值 1，发布主状态 11、清子阶段，再把标记置 2。该入口标记非零时跳过普通接收。当轮刚写 1 时仍检查已有缓存。派发器仍先处理独立的待切换状态。 [原 PE 核验](../build/analysis/legacy-item-disconnect-recovery-v1/source-review.json) · [两轮分支](#legacy-receive-retirement-order)

**事实**。主状态 11 从表项 `58CBCC` 进入 `58C9DC`，经子阶段准备后在 `58CA85` 调用 `484AE3`。提示对象为空时，沿已有槽位规则检查并请求 `close(100)`，随后创建对象并将返回指针写入 `6B1694`。已有对象时直接复用。原文件中的提示和按钮分别写作“与服务器的联机被切断了。”和“回到服务器选择画面”。 [原槽位规则](#legacy-item-normal-slot-producers) · [文字、函数及调用](../build/analysis/legacy-item-disconnect-recovery-v1/source-review.json)

**事实**。对象存在、`406346` 的返回低字节非零、`56C893` 命中按钮且 `ED560C` 位 0 置位时，提示调用 `40F289` 将对象 `+0x1C` 标记为待回收，清除提示指针并返回 1。分配失败、对象尚未就绪、按钮未命中或缺少本次按下位时返回 0，所选主状态分支继续等待确认。 [命中与退役指令](../build/analysis/legacy-item-disconnect-recovery-v1/source-review.json)

**事实**。确认分支先依次调用 `591A60`、`58973B`、`4689AB`、`57132F`。连接活跃字节非零时，`57132F` 先清 `F8E918` 和三个连接字节，再调用 WSOCK32 序号 3、116 及本地收尾。随后选服准备继续执行。原版的时钟分支可能先处理 Windows 焦点和按键，两条分支最终均发布主状态 2、子阶段 0。 [顺序与导入表](../build/analysis/legacy-item-disconnect-recovery-v1/source-review.json)

**待验证**。其它断线入口与普通帧回调、当前同版适用性和各目标平台的实际恢复。D0/D2 复用现有对象、输入和连接退役所有者，按照已证顺序补出等待确认的产品状态。 [共享规格](../analysis/capability-first-v1/game-flow-functional-specification.json) · [核验范围](validation.md#legacy-item-disconnect-recovery-validation)

<a id="fixed-se-disconnect-recovery"></a>

## 固定 SE 的断线确认与返回选服

**事实**。固定 `37c4dfd2…13bd` 的主状态 11 从 `501865` 进入。子阶段 0 准备场景捕获并推进。子阶段 1 在淡出未完成时仍调用 `5018E5 → 44E800` 核提示。提示指针 `61488C` 为空时查两活动槽，有占用时请求 `close(100)`，再保存创建返回。分配失败或对象就绪比较失败时返回零。 [状态表、函数和原指令](../build/analysis/capability-launch-entry-recovery-v1/source-review.json)

**事实**。`4EAC80` 命中且 `C5FB2C` 位 0 置位后，`44E800` 标记提示对象回收，清槽并返回 1。`5018F2` 起依次执行原清理，在 `501901` 退役连接，随后 `50196D` 发布状态 2、子阶段 0。固定 Item 使用相同的确认条件及归属。SE 的 `58510C` 为零选断线及返回选服两行，非零选人数已满及尝试其它服务器。实证直接引用包括提示读取和连接初始化清零。**待验证**。人数提示实际收到非零状态的来源。 [Item 对应入口](#legacy-item-disconnect-recovery) · [文本、读取与清零](../build/analysis/capability-launch-entry-recovery-v1/source-review.json)

**本机对照与设计**。成功入场 ACK 后继续等场景及角色资料。场景准备中正常 EOF 会结束旧实例。另一次将 EOF 排在已有场景资料之后，等 CUT 读结束，现有共享层先发布逻辑 `playing` 再消费 EOF 并退役运行层。GF-A06/A16/A19 围绕同一活动实例核输入、首次呈现回执、确认和结束。选服后的地图目录沿原会话规则处理。 [共用规格](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition) · [本机核验](validation.md#capability-launch-entry-recovery-validation)

<a id="fixed-item-character-creation"></a>

## 固定 Item 的角色创建、结果确认和刷新

**事实**。固定 `ce3fd800…126a9` 从 `58C850 → 49B1A1` 进入主状态 4。外观阶段有初始化与退回两种入口，资料页的起始预算分别为 30 与 10。内容类别决定初始模式 0、1、2，主状态 4 所选确认分支把零和非零模式转换成变体 0、1。确认后先清当时选中槽的 148 字节记录，再初始化并尝试写该配置目录的 `profile.dat`。资料写入调用返回后进入阶段 31。 [函数、模式与文件字节](../build/analysis/legacy-item-character-creation-v1/source-review.json)

**事实**。`495E6F` 尝试创建等待窗，再经 `5728C2 → 57EFE0` 提交一次 `/qW`。十二个整型和名字的编码顺序沿已有 SE 规格。发送返回后写等待标记 1 并采样时钟。`U_s` 在等待为 1 时发布 2，成功按 `successful` 及 NUL 判断，随后将返回值和本次变体写到选中槽字段 15、17。`572949` 先消费已有回复，再用无符号流逝量严格大于 600,000 毫秒判超时。 [请求、回复和边界](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_creation)

**事实**。拒绝与超时结果在 `495E6F` 汇成返回 2。状态 4 以同一条重名提示进入 100/101，确认后回 3/10。创建成功后进入 3/0，名单准备清两个角色记录再发 `1?v`。名单成功才进入 3/9 的后续准备。两条请求共用等待标记，当前共享会话按实际操作过滤重复回复。**待验证**。原版真实会话的迟到回复次序、文件存储与当前同版行为。 [共用验收用例](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_creation/cases) · [本机核验](validation.md#fixed-item-character-creation-validation)

<a id="fixed-item-character-roster"></a>

## 固定 Item 的角色名单与选角条件

**事实**。固定 `ce3fd800…126a9` 在主状态 3 经 `491D5D → 5720AC` 清两槽后请求 `1?v`。`VK0` 经 `582A03 → 5724CC` 解出状态和字节串，在 `FD3268` 为 1 时发布 2。状态为零，按 `|` 取前四段组成两组名字与转义记录，每段最多 1,023 字节。`58ADBE` 解开内层记录，用字段 1 选槽 0 或 1，清该槽的 148 字节后再写字段。同一槽重复时以后组为准。名字超过 16 字节使用 `???`。存在性按名字首字节判断。 [回包、字节布局与 PE 核验](../build/analysis/legacy-item-character-roster-v1/source-review.json)

**事实**。非零状态仅在文本恰为 `OUTOFSERVICE` 时设结果 2。`572107` 优先消费回复，分别返回 1、-3 或 -2。仍在等待时，无符号流逝量严格大于 600,000 毫秒返回 -1。主状态 3 将 -3 交给停机维护提示，将 -2 与 -1 交给角色数据读取失败提示。确认后回选服。源码还保留 -4 的分支，所选名单等待路径中只找到初始值 0 和 `572107` 的结果。 [结果及状态表](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_roster)

**事实**。名单成功进入 3/9。`Wb^` 写实时类别低字节，3/9 查询固定五个素材 ID 并锁存代际，沿 SE 的类别阈值及附加操作条件进入 3/10 或版本提示。3/10 发布 11 并依序准备两个预览。`498F0F` 清旧预览指针，按名字首字节判空。已有角色的字段 2 小于 30,000 时写 33,100，再经两个数值变换决定预览编号及字段 17。两版共用这组数值规则。 [类别来源](#legacy-item-startup-handoff) · [预览指令和字段](../build/analysis/legacy-item-character-roster-v1/source-review.json)

**事实**。`49922C` 每次进入时将控制参数设为 1，执行 3/11 时将它清零。`49A25D` 按空槽和已有角色调用各自的控件。已有角色的按钮还要求该参数为零，空槽路径直接检查命中位。`496E25` 在命中区域内按 `ED560C` 位 0 提供本次激活位。有效已有角色选择写槽号并进入主状态 5，空槽创建动作写槽号并进入主状态 4。**本机对照**。当前共享会话在完成两槽数值准备后统一放行选择和创建。D0/D2 复用两槽解析及准备，D5 继续核按钮命中、预览呈现和维护提示的真实回执。 [共用规格与用例](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_roster) · [本机核验](validation.md#fixed-item-character-roster-validation)

<a id="fixed-item-character-appearance"></a>

## 固定 Item 的已有角色外观与样式

**事实**。固定 `ce3fd800…126a9` 的 `49A25D` 按存在的角色、实时类别至少 5、控制参数为零及命中位开放动作。样式字段 17 为 0 或 1 时可用动作 3 至 6。类别至少 7 时，其他样式仍可用动作 3/4。两路跳转目标依次为 `499B55` 和 `49A034`。 [准入、跳转和原指令](../build/analysis/legacy-item-character-appearance-v1/source-review.json)

**事实**。动作 3/4 按类别和区间更新偏移 36 的本地分类，再计算字段 2 的外观。33,100 和 33,101 直接进入反馈调用。命中其他区间按既有 SE 的正反映射，实际直接调用只有数值变换和反馈。共用帧从记录读更新后的外观值，同时继续推进已有预览对象。逆向编号 242,800 会算出超出 14 项表的索引 14。现有共享模块以 `LEGACY_CHARACTER_CODE_TABLE` 拒绝该值。**待验证**。原版边界值的实际结果。 [对应 SE 规格及实现差异](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_appearance)

**事实**。动作 5/6 将字段 17 在 0、1 间切换，先把所请求样式写 `9C1D40`，再调 `498F0F` 退役旧预览并准备新对象。重新准备可把记录里的最终样式改为 2。此时请求值和最终记录值各有读点。分配成功后，33,100 和 33,101 取固定预览编号 100,900 和 100,901，其余按最终样式、规范编号和三张表取键。两版三张表各 14 项逐字节一致。`498F0F` 写新对象偏移 `+0x2B0` 为零，然后调 `586640`。选角帧将此字段改为 1，再调同一入口。 [表和对象读写](../build/analysis/legacy-item-character-appearance-v1/source-review.json)

**事实**。四个动作的结束路径请求 `5A0C0C(0x33, 320, 240)`。后续正常选角登记槽号及当时的外观，入场发 `0X@` 时从该槽读取字段 15、17、2。**本机对照**。现有共享模块已覆盖这些记录变更与入场取值。D0/D2 继续接实际预览对象、反馈和刷新，D5 验两槽动画帧、控件效果与真实入场。 [共用用例](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_appearance/cases) · [本机记录](validation.md#fixed-item-character-appearance-validation)

<a id="fixed-item-character-preview-frame"></a>

## 固定 Item 的选角预览帧与素材读取

**事实**。固定 `ce3fd800…126a9` 的 `498F0F` 准备已有角色时，用方向 5、动作 0 调 `586640`。3/10 先写子阶段 11，再依次准备两槽。重读阶段后的共用分派，在同次调用里对有效预览对象执行 `49A25D`，将动作改为 1 再推进。两个调用均按百分比 100、循环模式 0。固定 SE 的 `4588F1` 与 `45980B` 分别使用对应的准备和活动入口。 [状态表和原指令](../build/analysis/legacy-item-character-preview-frame-v1/source-review.json)

**事实**。`586640` 在动画编号、方向或动作改变时清帧索引、等待和循环次数。有等待时每次调用减一。到期按动画编号减 100,000 搜索活动 36 字节条目，经 `48BE4D` 取动作。查不到编号或动作返回 1，资源装载失败返回 −1。装载检查缓存节点、动作和帧数量、分配及附属资料结果。命中缓存更新其队列位置。所核读点没有用实际读取长度决定返回，原版短读结果仍待证。 [读取与返回路径](../build/analysis/legacy-item-character-preview-frame-v1/source-review.json)

**事实**。动作按文件顺序取第一个方向和动作均匹配的条目。装载时把时长换成按帧数和 16 计算的基础计数，再由播放器做 32 位乘法和无符号除以 100，最短一次调用。发布帧后递增索引并减去本次计数。循环模式到末尾从帧 0 继续。绘制偏移用帧坐标加图块原点，翻转在几何可用时按实际宽、高重算。附属坐标取同图块的首个命中，另外保留调色、标志、颜色和帧事件。 [共用帧规格](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_preview_frame)

**本机对照**。按相同参数驱动现有资源库。五个留存编号的两个动作均产生软件像素。编号 100,900 的准备帧和活动帧分别使用图块 252,985 和 252,989，计数分别为 23 和 8。受控图块读取失败有明确回执，重试成功。实际画面何时接收预览、样式切换后的对象退役和三端呈现继续验。 [对照与边界](validation.md#fixed-item-character-preview-frame-validation)

<a id="fixed-item-character-preview-draw"></a>

## 固定 Item 的选角预览入队与退役

**事实**。固定 `ce3fd800…126a9` 的主状态 3 依次执行选角 `49922C`、对象遍历 `40F15E`、绘制收集 `5947D5`。固定 SE 的 `5016FC` 至 `501706` 具有对应顺序。首次准备两槽时，先执行动作 0，再由同次共用选角分派尝试动作 1。成功更新时，收集读取动作 1 写入的图块。 [主状态、对象池和两版指令](../build/analysis/legacy-item-character-preview-draw-v1/source-review.json)

**事实**。切换样式前，当前槽先经过通常的动作 1 更新。随后 `49A099 → 498F0F` 标记旧对象并清槽，再分配和准备新对象，最后回到两槽循环的后续位置。新对象当轮可供收集的是动作 0，下一轮才通过共用分派切动作 1。分配失败后该槽为空。`5947D5` 跳过回收标记等于 1、图块等于 −1 或隐藏位 2 置位的对象。合资格遍历可在收集前摘除旧对象，延迟摘除也会被收集入口排除。正常选角进入状态 5 前标记对象池并清两槽指针。 [分支及回收顺序](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_preview_draw)

**事实**。类型 2 对象沿申请顺序进入同类型队列。`5947D5` 将优先级 10、图块、位置和样式写入绘制记录，位置为对象锚点加按缩放取整的帧偏移。预览默认两轴缩放均为 1。队列容量 4,096，所查尾部阶段按条件预留三至四项并排序，先按优先级升序，同优先级按入队序号降序。普通显示分支由 `48769B → 593524` 消费当前记录，按原图块和设备条件进入绘制。 [绘制记录与消费者](../build/analysis/legacy-item-character-preview-draw-v1/source-review.json)

**本机对照**。现有动画和资源库输出首次收集、样式替换、下一活动帧及模拟分配为空四种软件帧。挂起的旧图块读在样式替换后被取消，绘制任务返回 `LEGACY_ASSET_CANCELLED`。实际客户端画面提交、对象分配和三端界面沿 CH-T14 继续验。 [用例与软件帧摘要](validation.md#fixed-item-character-preview-draw-validation)

<a id="fixed-item-character-creation-preview"></a>

## 固定 Item 的建角双预览及详情往返

**事实**。固定 Item `ce3fd800…126a9` 的主状态 4 依次处理建角、对象遍历和绘制收集。初次由 `49B381(1)` 设族和草稿选择，随后在 `(517,243)` 与 `(517,396)` 各申请一份类型 2 预览，方向 5，动作初值 0。固定 SE `37c4dfd2…013bd` 有对应分派。两版的 56 个编号、两处转向矩形、16 行动作表和 28 个低类别选择值逐字节一致。命中任一矩形时，输入位 0 使现有对象方向编号各减 1，位 1 各加 1，按 0 至 7 回绕。 [REA 与两版原字节](../build/analysis/legacy-item-character-creation-preview-v1/source-review.json)

**事实**。每轮先更新下方再更新上方。上方更新返回非零时，`492BE7` 按表驱动现有对象复播或换行动作，并使上次动作请求失效。下轮重新从草稿取编号。上方总是尝试直接绘制，下方在类别至少为 5 且族为 0 时也尝试直接绘制。直接记录和对象收集共用优先级 10，分别取锚点加图块原点和已有对象帧坐标规则。进入详情当轮，先有直接记录，`49BCE5` 随后标记两份对象并复位预算，后续收集会排除这两份对象。返回外观时，下一轮保留族、序号和颜色，重新从方向 5 建立预览。 [操作、状态和用例](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_creation_preview)

**本机对照**。类别 7 的初始、转向、进入详情和返回外观得到 3、4、2、4 条预览绘制记录。当前软件结果只覆盖预览层。原版完整界面、单对象失败和实际三端呈现仍按用例验收。 [预览层与验收边界](validation.md#fixed-item-character-creation-preview-validation)

<a id="fixed-item-character-creation-details"></a>

## 固定 Item 和 SE 的建角详情、肖像与确认

**事实**。固定 Item `ce3fd800…126a9` 的 `49BDD6` 与固定 SE `37c4dfd2…013bd` 的 `45A970` 共用详情布局和数值条件。内部状态为 1 时处理步进。Item 的箭头用可重复的按下位，检查和返回用一次按下位。两项肖像细节在 0 至 4 回绕，外观族等于当前模式上界时省去模式箭头。四项属性加点要求对向为零。此条件通过且预算用尽时，从首个其他正值项转移一点。若对向有值，按原版条件该行两个增减图形均隐藏。 [控件、重复和属性分支](../build/analysis/legacy-item-character-creation-details-v1/source-review.json)

**事实**。两版共用 28 个肖像基本编号，三种模式复用既有换算。实时类别降低后，若原选模式超出新上界，界面改用占位肖像。在合法外观序号内占位编号为 33,100。确认输出仍沿当前所选模式算肖像、动画和变体。 [图形与提交规格](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_character_creation_details)

**事实**。检查依次核名字长度、两项预算、重名和两层字节过滤。各项提示确认后回到详情编辑。有效检查进入确认窗口。固定 Item `492201 → 491F54` 的两处命中区重叠时以后一个为准，窗口已就绪且一次按下才接受选择。取消和接受均先退役确认窗。取消保留草稿。接受返回后写各字段，外层同轮可进入资料保存与一次发送的入口。详情页直接返回仍按外观预览重建规则处理。 [确认窗口字节和分支](../build/analysis/legacy-item-character-creation-details-v1/source-review.json) · [提交与刷新](#fixed-item-character-creation)

**本机对照**。当前共享草稿收到对向已有点数的加点动作时，两种预算条件下仍会转移。网页的按钮另有禁用状态。本次复核修订 stage167 对转移条件的描述，转移要求对向为零且预算已用尽。三端沿共用准入及回执验收。 [早期记录](../analysis/game-character-lifecycle-v1/source-check.json#/wizard/allocation_four) · [差异与用例](validation.md#fixed-item-character-creation-details-validation)

<a id="fixed-item-state5-reset"></a>

## 固定 Item 选角后的角色和场景复位

**事实**。固定 `ce3fd800…126a9` 的主状态 5 从 `58C8BA` 进入，先清两项帧状态，再执行所核的 21 次直接调用。`489C5B` 检查当前键盘布局。`ImmIsIME` 返回 1 时，先后以 0 和 1 调用 `ImmSetOpenStatus`。`4A15BF` 将地图和本机角色等待位设为 3。 [调用、导入项和原 PE](../build/analysis/legacy-item-entry-reset-v1/source-review.json)

**事实**。`589278` 清六段临时资料，旧本机角色指针 `11D4414` 位于其中。随后恢复两个保存值，给 48 项记录各写一个 `-1`，再初始化 15 项记录。48 项记录末端是选中角色槽 `11D4B80` 的地址。槽自身和两份角色记录的三个 `0X@` 字段在已核清除范围外。`4689AB` 随后复位 1,000 项远端记录的指定字段。 [清除范围与保留的选择](../build/analysis/legacy-item-entry-reset-v1/source-review.json) · [角色字段与请求](#fixed-item-world-entry)

**事实**。`58C920` 和 `58C925` 清两份邮件缓冲后尝试依次读回。个人文件缺失时尝试写回并提前结束邮件载入。`5880B9` 直接返回，随后 `587ACC` 读图鉴。`56B866` 当时仍按状态 5 处理，清恢复标记和两组各 68 项的经典窗指针，按偏好创建默认窗。 [缓存条件](#legacy-item-album-mail-lifecycle) · [经典窗口](#legacy-item-classic-window-reentry)

**事实与设计**。`58C96F` 发布主状态 6、子阶段 0。调用 `59FDC8` 后，从 `ED41C0` 起清 28 字节，随后结束当轮。两份固定样本可共用 GF-A05 的缓存失败、默认值、清除边界和下一轮入场字段用例。宿主输入法、实际窗口及完整换角继续验收。 [规格和用例](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_state5_reset) · [本机对照](validation.md#fixed-item-state5-reset-validation)

<a id="fixed-item-world-entry"></a>

## 固定 Item 的入场确认与首个普通场景

**事实**。固定 `ce3fd800…126a9` 的主状态 6 由 `58C9AF → 496065` 进入。`4961BD` 首次尝试创建登入中提示，再调用 `5725EF` 提交请求。该函数从当前角色记录取字段 15、17、2，经 `57F212` 发送 `0X@`，随后写等待标记 1 并采样时钟。三项字段写入点为 `58B035`、`58B054`、`58AEA0`，与固定 SE 发包顺序一致。 [样本、字段和指令](../build/analysis/legacy-item-world-entry-v1/source-review.json)

**事实**。`V?S` 在等待标记 1 时才进入回复消费，并用 `successful` 的十个字符及 NUL 判定成功。`57265C` 先看连接，再核已有回复，最后按无符号流逝量严格大于 600,000 毫秒判超时。成功推进主状态 9。拒绝时优先显示非空详情，超时有自己的提示。两条失败均经子状态 100、101，确认后回选服。 [结果、文字及等值边界](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_entry/facts)

**事实**。状态 5 将 `9BFA54` 置 3。通过校验的 `=]M` 或进入已证尾部的 `=mJ` 清位 0。`H#|` 的本机角色分支清位 1。主状态 9 的 101 等整个字节清零，再经 102、104 完成 5 次准备并捕获。类型 15 淡入在 103 返回 1 后进 20，过渡收尾后写 3 并落入同次普通帧。 [位来源及跳转表](../build/analysis/legacy-item-world-entry-v1/source-review.json) · [补片尾部范围](#legacy-map-wait-patch-release)

**设计与待验证**。GF-A06/A07 共用两版字段、连接、回复与就绪顺序。D0/D2 在现有角色会话中核发送与计时、失败确认及首场景准入。实际窗口、有效首帧、当前同版和完整三端行为沿原用例。 [组合规格](../analysis/capability-first-v1/game-flow-functional-specification.json#/launch_entry_recovery_composition/item_entry) · [本机回归](validation.md#fixed-item-world-entry-validation)

<a id="legacy-render-device-preferences"></a>

## 两个历史样本的图形档位与降档写入

**事实**。固定 SE `37c4dfd2…13bd` 在 `45D8BA–45D938`、固定 Item `ce3fd800…26a9` 在 `49FC70–49FD18` 初始化请求档位，并将请求字段首地址交给 `3Ddevice:` 后的 `%d` 扫描。设备选择读取有符号低字节。SE 的 `6122E8` 和 Item 的 `6AF0F0` 在非零时覆盖请求，两处均位于映像的零填充区。 [两份完整 SHA-256、指令与 PE 范围](../build/analysis/legacy-render-device-preferences-v1/source-review.json)

**事实**。SE `445E6C` 与 Item `47181A` 在请求小于 1 时显示提示，再将实际和请求档位置 1。显示标志位 `0x1` 也将两档位置 1。两版随后检查表面 `(+0x60 & 0xE0001) == 0`、`+0x64 == 0` 及 `+0x68` 等于选定的位深。任一条件失配，SE 从 `445F08` 跳到提示，Item 在 `4718F2` 显示相同提示。两条路径均将两档位置 1、返回 0，且跳过文件写入。该检查也覆盖请求档位 1。 [两版分支与原字节](../build/analysis/legacy-render-admission-v1/source-review.json)

**事实**。设备已接受且实际档位与请求不同的所选路径，分别在 SE 的 `44651F` 和 Item 的 `4720D3` 请求写 `data\update.dat`。打开成功时以 `%d` 生成实际档位文本，按字符串长度写出并关闭句柄。打开失败直接进入同一个内存写入点。写入调用返回后也沿该点将请求档位改为实际档位。 [写入、关句柄及状态更新](../build/analysis/legacy-render-device-preferences-v1/source-review.json)

**事实**。请求大于 1 且表面合格时进入 Direct3D 接口查询。查询失败与所选设备准备失败进入同一收尾，释放并清除已有设备和接口，清除绘制能力，再尝试写单字节 `1`。SE 在 `44600B`、Item 在 `47227C` 将实际档位置 1，随后将请求档位置 1。打开失败和完成写调用后的路径均到达这些写入，最后按档位 1 返回 0。 [软件回退分支](../build/analysis/legacy-render-device-preferences-v1/source-review.json)

**事实**。Item 普通帧的档位比较在 `4873A8` 开始，失配时经 `4873BF` 调用 `49FF0E`。另一个分支在 `6B1154` 非零且 `TestCooperativeLevel` 返回 0 时，经 `4727A2` 返回 1，于 `487418` 进入同一重建。`49FF1C` 先释放旧上下文并清 `6AD470`，再调用 `471042` 初始化。所选调用者遇返回 2 时翻转窗口模式并重试一次，遇返回 1 或重试仍非零时请求关窗。 [帧与重建调用](../build/analysis/legacy-render-admission-v1/source-review.json) · [启动与重试](../build/analysis/legacy-render-device-preferences-v1/source-review.json)

<a id="legacy-render-startup-tier-input"></a>

### SE 与 Item 的新进程档位输入

**事实**。固定 SE `37c4dfd2…13bd` 与 Item `ce3fd800…26a9` 的 PE 入口分别是 `51DDA5`、`5B39C9`。两版从 `GetCommandLineA` 取得字节串，经 `523B0A`、`5BA153` 跳过程序名及其后分隔空白，再以第三个参数交给 `45CC90`、`49EC00`。两版从进程工作目录尝试打开相对 `Config.dat`。打开失败保留原命令尾。成功时清 5,120 字节缓冲，用 256 字节容量读一次，最多 255 个文本字节并保留读到的行尾。随后从第一个 NUL 接上命令尾，中间没有插入分隔。读到零字节时仍走合并。 [两份完整 SHA-256、入口和文件偏移](../build/analysis/legacy-render-next-startup-v1/source-review.json)

**事实**。到达所选参数分支后，SE `45D8BA`、Item `49FC70` 将请求低字节置 1，只查合并输入中第一次出现的大小写敏感 `3Ddevice:`。该键可跨拼接点。SE `45D8EA`、Item `49FCBD` 的 `%d` 读取冒号后的十进制前缀。找不到数字时保留 1，后续同名键不再尝试。对已核的 32 位范围，转换写四字节，图形端以有符号低字节消费。`258` 得到 2，`255` 得到 −1，`256` 得到 0，`−253` 得到 3。两个独立覆盖字节若非零，最后覆盖低字节。 [原指令和用例](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_render_device_preferences/startup_tier_input)

**静态推导**。以既往降档写出 `1`、新进程读到配置档位 `4`、命令尾带档位 `2` 为例，沿已证输入链得到请求 `4`。文件的四个已证引用均走写入。覆盖的实际生产者、其他读回路径、实际设备返回和当前同版仍待验证。 [文件写入证据](../build/analysis/legacy-render-override-producers-v1/source-review.json)

**本地对照**。stage306 的启动入口在 14 个成功样例中保留正确的合并文本，输出的 `graphicsMode` 均为独立的绘制模式 2。另一个样例在合成文件端口拒绝访问时返回 `EACCES`。PR-D4 接入固定来源的请求档位并处理文件打开结果，沿 PR-A10 共用冷启动和重建验收。 [本地对照和验收范围](validation.md#legacy-render-startup-tier-input-validation)

**事实**。固定 SE 与 Item 在历史安装脚本中与根配置器、配置文件同列。配置器归档与原文件字节复核确认，`401480` 在工作目录缺少 `Config.dat` 时尝试写 12 字节默认档位 1，`401180` 的确认路径写同名文件。F5A 的所选首次配置路径以安装目录启动该角色的辅助程序。两款历史游戏读取各自工作目录中的同名配置。 [安装脚本、留存样本和档案](validation.md#legacy-render-startup-tier-input-validation) · [配置器规则](launcher-static.md#first-config-dialog-outcomes)

**静态推导及本机对照**。以留存的 23 字节档位 4 配置加命令尾档位 2、缺少配置加同一命令尾、生成的默认档位 1 配置加命令尾档位 4 为输入，覆盖字节取零时，已核两版读取规则分别得到 4、2、1。stage306 的三个合并结果均与输入规则一致，三组所选范围只查询模块及 `Config.dat`。PR-D4 复用文件与文本合并，PR-A10 再验图形档位交付。取得非零覆盖生产者或降档文件的实际读取及绑定后复核该输入链。 [三组调用回执](../build/analysis/legacy-render-config-reload-v1/config-reload.json)

<a id="legacy-render-device-preparation"></a>

### 两版的设备创建、准备与文件输出

**事实**。所选 Direct3D 接口查询成功后，SE 在 `44604D`、`446084`、`4460BF`，Item 在 `4719A7`、`4719FA`、`471A4C` 按 4、3、2 尝试合资格设备。两版传入相同的三组 GUID。`CreateDevice` 返回非零时才继续较低的合资格候选。创建成功就写入实际档位并进入准备。第一次 `GetCaps` 要求返回 0。缺能力位 `0x400` 时跳过状态 `0x29=1`，绘制能力保持关闭并继续准备。能力位存在时，状态调用成功才启用绘制能力。 [两版指令、GUID 与 SDK 槽位](../build/analysis/legacy-render-override-producers-v1/source-review.json)

**事实**。八次必要 `SetRenderState`、三次第 0 层 `SetTextureStageState` 和 `SetViewport` 均要求返回 0。第二次 `GetCaps` 只对负返回回退。所选准备失败直接进入 SE `445F46` 或 Item `472152`，清理设备、接口及绘制能力，然后尝试写 `1`。探测表面构造返回空时继续比较档位。取得临时表面后，绑定或查询第 0 层纹理返回非零时先释放临时表面，再走相同回退。查询成功且返回非空时释放两个引用，再比较档位。两版的成功但输出为空分支在递增计数前解引用空指针，实际设备是否产生该组合待验。 [准备及探测分支](../build/analysis/legacy-render-override-producers-v1/source-review.json)

**事实**。两份历史 PE 的 `data\update.dat` 精确字面量在 SE 有两个直接引用，在 Item 的两份字面量上各有一个。四处均沿 `CreateFileA` 以 `GENERIC_WRITE`、`CREATE_ALWAYS` 请求打开。`WriteFile` 返回后直接关闭句柄，两版均继续更新内存档位。文件打开失败也到达同一更新点。两版精确覆盖地址的直接引用均为读取，原有启动路径读取 `Config.dat` 可见首行并接上命令尾。 [原路径引用](../build/analysis/legacy-render-override-producers-v1/source-review.json) · [已证启动输入](#legacy-item-resource-handoff)

**待验证**。`update.dat` 的后续读取和覆盖字节的非零写入来源。当前固定 `cg_se_3000.exe` 仍只提供该路径的字面量，原 `.text` 无文件字节。间接地址、动态路径、实际设备返回和当前同版继续按相应证据核对。D0/D3 共用设备候选、准备失败和文件回执用例。 [共用规格](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_render_device_preferences/device_preparation) · [核验](validation.md#legacy-render-device-preparation-validation)

<a id="legacy-render-presentation-recovery"></a>

### 两版的呈现选路与恢复条件

**事实**。SE `446740` 与 Item `4725BF` 在窗口模式 1 使用换算到屏幕坐标的客户区做 `Blt`。另一模式读取上下文 `+0x9C`，存在接口时整面 `Blt`，其余调用 `Flip`。非零结果登记待恢复，所选返回均翻转独立呈现字段。所选 `Blt` 前的扫描线循环遇 `0x88760219` 即退出到呈现，或在其它非零结果累计 10,000 次后退出。零结果不计入次数。窗口模式另有跳过扫描的条件。 [函数、SDK 槽位及指令](../build/analysis/legacy-render-admission-v1/source-review.json)

**事实**。Item 窗口消息 `0x6` 的 `4A02B1` 在 `wParam` 为 1 或 2 且上下文存在时，经 `47F824` 检查各已登记非空表面、独立表面及上下文 `+0xC`、`+0x8`。任一 `IsLost` 调用结果非零即汇总为 1，`4A02D5` 登记待恢复。普通帧收到就绪结果后重建，`4710A9` 清标记。 [消息表与帧入口](../build/analysis/legacy-render-admission-v1/source-review.json)

**事实**。SE 的呈现判断只读取接口 `+0x9C`，普通 `446E00` 和缩放 `447330` 另要求 `+0xBC`。设备已接受且缺 `0x400` 能力位时仍可保留档位，所选 DirectDraw 精灵路径跳过加色。用已有原创像素夹具调用共享合成器，直接传入普通和缩放加色命令时分别改动 70 和 104 个 RGBA 字节。D0/D3 在现有图形所有者处理源准入，复用已有合成器。 [静态分支](../build/analysis/legacy-render-admission-v1/source-review.json) · [本地对照](../build/analysis/legacy-render-admission-v1/focused-probe.json)

<a id="legacy-render-system-key-rebuild"></a>

### 两版绘制表面忙与输入消息重建

**事实**。固定 SE 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，固定 Item 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。所选绘制调用返回 `0x887601AE` 即 `DDERR_SURFACEBUSY` 时，SE 的三个写入点将 `F8F204` 置 1，Item 的五个写入点将 `1204D44` 置 1。呈现和激活登记使用各自的 `61434C` 与 `6B1154`，沿普通帧的设备就绪判断消费。 [返回值声明、写入点与来源](../build/analysis/legacy-render-system-key-v1/source-review.json)

**事实**。注册的窗口过程分别为 `45DD80` 与 `4A01BD`。普通键按下 `0x100`、抬起 `0x101` 和系统键按下 `0x104` 先检查绘制待重建字。恰为 1 时先清零再调用重建，随后处理原键分支。鼠标移动 `0x200` 先按当时尺寸换算位置，再走光标与待重建检查。 [注册、消息表和顺序](../build/analysis/legacy-render-system-key-v1/source-review.json)

**事实与推导**。系统 Enter 在第一次可能的重建返回后读取当前上下文和状态。上下文存在且状态不等于 2 时，原模式等于 1 则改为 0，其余改为 1。随后调用重建、调整窗口并采样时钟。两版的所选路径因此都允许同一消息调用重建两次。每次调用内仍适用原返回值 2 的初始化重试规则。 [重建和窗口调用](../build/analysis/legacy-render-system-key-v1/source-review.json)

**事实**。重建先退役旧上下文，再初始化并调用调色板准备。准备返回 0 时，SE 在 `45DBE6`、Item 在 `4A000D` 以 `PostMessageA` 投递同窗 `0x104`、键值 `0x0D`、参数 0，然后继续当前重建尾部。原消息泵逐条取消息并分派。投递调用返回、提示期间的嵌套派发和后续窗口尺寸仍待实际运行证据。 [调色板与消息泵](../build/analysis/legacy-render-system-key-v1/source-review.json)

**本地对照**。所测 Canvas 宿主遇到合成呈现故障会停下来并记录错误。再次手动推进能用同一上下文和游戏状态绘制。D0/D3 将来源所需的输入消费、模式切换及旧上下文退役归入现有图形所有者，PR-A10 沿已证顺序补验。 [共用规格](../analysis/capability-first-v1/game-presentation-functional-specification.json#/backend_selection_review/input_driven_rebuild) · [本机核验](validation.md#legacy-render-system-key-validation)

<a id="legacy-item-pointer-position"></a>

### 两版的窗口尺寸、鼠标位置和后续命中

**事实**。固定 Item `ce3fd800…126a9` 和固定 SE `37c4dfd2…013bd` 处理尺寸消息时，将参数的低、高两个无符号 16 位段分别写入宽、高。处理移动和左右键的按下、释放、双击时，各自从对应消息取同类坐标。640×480 直接传值。其它正尺寸下，横、纵分别乘 640、480 后除以当时宽、高并向零截断。移动已写入位置后才检查绘制重建。同一消息在返回前沿这一次的换算结果继续。 [两版消息表、宽高写点和换算指令](../build/analysis/legacy-item-pointer-position-v1/source-review.json)

**事实**。Item 的 `56EE88` 和 SE 的 `4EC960` 写移动位置。左右键各保存按下和释放的位置，双击更新相应的按下点。Item 常规矩形 `56C893`、帧末所选文字命中，以及 SE 的对应矩形均读取移动位置。按下和双击要求输入模式为 2。释放清当前按住及重复位并记录释放边沿，双击保留通常按下位并加独立双击位。帧末重复仍沿已经核验的 500 与 100 毫秒条件。 [坐标、事件和验收用例](../analysis/capability-first-v1/game-presentation-functional-specification.json#/backend_selection_review/pointer_position_admission)

**本机对照**。缩放后按下和松开的样本，按原版规则分别保存两点，常规矩形仍读上次移动点。现有 Canvas 接收相同事件时，按下和松开会依次更新同一个位置。微信本机 Page 和宿主在逆序的尺寸回调下接入最新矩形，实际触控经本机回环命中目标。原版重建期间的消息交付和三端设备输入仍待验。 [本机条件和回执](validation.md#legacy-item-pointer-position-validation)

<a id="legacy-render-backend-selection"></a>

## 历史 SE 的绘制选路与上下文重建

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。沿 `45CC90` 合并的 Config.dat 首行和命令尾，`45CFD0` 以 `windowmode` 置窗口模式。请求档位 `613924` 默认 1，`3Ddevice:` 后按十进制扫描，非零的 `6122E8` 字节可覆盖请求。 [原输入顺序](#stage230-legacy-config-startup) · [原件、偏移与指令](../build/analysis/legacy-render-backend-selection-v1/source-review.json)

**事实**。启动经 `44FB8D → 450250 → 4457D0`。初始化取得显示深度，准备 DirectDraw 上下文。通过表面位深、掩码和格式位检查，且请求档位至少为 2 时，依次尝试满足请求阈值的 4、3、2 档。接受的设备档位写 `6122F0`。能力字含 `0x400` 且设置状态 `0x29=1` 成功时，上下文 `+0xBC` 置 1。普通 `446E00` 与缩放 `447330` 都先检查 `+0x9C`，再用 `+0xBC` 决定绘制分支。原回退分支按既有规则省略加色绘制。 [既有颜色规则](../analysis/capability-first-v1/game-entry-review-contract.json) · [来源核验](../build/analysis/legacy-render-backend-selection-v1/source-review.json)

**事实**。进入 `445F46` 的设备准备失败先释放并清除 `+0xA0` 和 `+0x9C`，再清 `+0xBC`，随后以档位 1 返回成功。较低档被接受且与请求值失配时，`44651A` 所在分支尝试将实际档位的十进制文本写到 `data\update.dat`，并将请求值更新为实际值。独立的初始化返回值 2 让调用者翻转窗口模式并再试一次。返回值 1 或重试失败会投递关窗消息。 [回退分支与调用者](../build/analysis/legacy-render-backend-selection-v1/source-review.json)

**事实**。普通帧在请求与实际档位不一致时进入 `45DB10`，设备探测的所选通过分支也调用该入口。系统键消息 `0x104` 见到值为 1 的重建标志时，先清标志再重建。若键值为 Enter、上下文存在且状态 `727360` 不为 2，则再翻转窗口模式、重建并调整窗口。重建先调 `446590` 释放旧资源，于 `446728` 清旧上下文指针，再调初始化。 [普通帧与系统键指令](../build/analysis/legacy-render-backend-selection-v1/source-review.json)

**待验证**。`6122E8` 的生产者、设备探测的实际返回域、原设备的 16/24 位输出、非对齐暂存尾部和当前版本适用性。D0/D3 沿既有颜色后端合同复用所选来源规则。 [验收范围](validation.md#legacy-render-backend-selection-validation)

<a id="fixed-se-palette-output-depth"></a>

## 固定 SE 的默认位深调色与精灵上传

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`445CDB` 取得表面格式成功后保存三项通道掩码。`44D680` 分别数每个掩码的置位数，右移量为 8 减该数。低位先放 B，G 左移 B 的位数，R 左移 G 与 B 的位数之和。`44A430` 随实际输出深度调用对应表转换。 [原指令、字节与映射](../build/analysis/fixed-se-palette-output-depth-v1/source-review.json)

| 输出 | 默认调色表更新 |
| --- | --- |
| 16 位 | `449CF0` 初始转换建立 256 项。`44AA10` 动态重写 `614148` 的 16–239 号 WORD，保留 1–15 与 240–255。量化结果为零时写 1，索引 0 清零。 |
| 24 位 | `449CF0` 初始转换与 `44AB00` 动态转换均向 `613624` 写 256 组 BGR。全零颜色写 `01 00 00`，索引 0 的三字节清零。 |
| 32 位 | `44AAA0` 写 `611EC8` 的 256 个 `00RRGGBB`，清索引 0。遇到全零颜色时，`44AAD4` 另向同号的 16 位表写 WORD 1，32 位表当前位置为零。 |

**事实**。`449C80` 的所选默认分支经 `449CDB → 4497C0`。16 位循环在 `4498F0` 取 `614148 + 2 × index` 并写两字节。24 位在 `449945` 取 `613624 + 3 × index`，依次写两个字节和第三个字节。两条路径均从 RD 读取同一个单字节索引，以源行宽和目标表面步幅推进。所选颜色键设置继续沿 `4468B0` 的零值。显式表非空时经 `449CA8 → 449A10` 读传入的表。 [分派表与上传循环](../build/analysis/fixed-se-palette-output-depth-v1/source-review.json)

**本机对照与设计**。按原指令推导，两种给定掩码下，索引 18 的 `[129,127,63]` 分别得到 RGB565 `0x83E7` 和 RGB555 `0x41E7`。同值的 24 位 BGR 字节为 `3F 7F 81`。本机经现有 CGP、RD 与 RGBA 入口核了八个索引。D0/D2 复用现有解码和 32 位颜色，补来源位深下的输出和缓存。实际原版表面掩码和三端对应呈现仍待验。 [规格及用例](../analysis/capability-first-v1/game-presentation-functional-specification.json#/fixed_se_palette_output_depth) · [显式表](#fixed-se-explicit-palette-upload) · [本机核验](validation.md#fixed-se-palette-output-depth-validation)

<a id="fixed-item-palette-output-depth"></a>

## 固定 Item 重建后的默认调色与上传

**事实**。固定 Item `ce3fd800…26a9` 于 `4710CF` 保存 `GetDeviceCaps` 索引 12 的返回，所查全屏分支在 `471494` 另写 16。表面 `GetPixelFormat` 成功后，`47162B–471648` 保存 R、G、B 掩码。两个来源的所查掩码计算都按通道置位数确定位移。 [样本、PE 导入与指令](../build/analysis/legacy-item-palette-output-v1/source-review.json)

**事实**。Item 重建从 `49FFF5` 调 `479BE0`。首次准备读 `palet_00.cgp` 的 224 组三元组，保存原表，再清现行索引 168。表准备按所选深度转换，16 位初始写 256 组、动态只写 16–239 并清索引 0；24 位写 256 组 BGR，全零变最低非零值再清索引 0。32 位全黑仍为零，同时向同索引的 16 位表写 1。准备返回零时，重建走已核的系统 Enter 投递。 [两版共用规格](../analysis/capability-first-v1/game-presentation-functional-specification.json#/fixed_item_palette_output_depth)

**事实**。包装 `479B7E` 见空显式表调用 `479403`。锁定成功后，以 RD 单字节索引读所选的 2、3、4 字节表，按源行与目标步幅推进。传入非空表转 `4797C0`。本机原创 CGP 的 32 个固定色和默认 RGBA 已核。**待验证**。实际锁定、表面位深和像素。 [显式表规格](#fixed-item-explicit-palette-upload) · [本机回执](validation.md#fixed-item-palette-output-depth-validation)

<a id="fixed-item-explicit-palette-upload"></a>

## 固定 Item 命名与内嵌色表的上传和缓存

**事实**。固定 `ce3fd800…126a9` 在 `593524` 的所查精灵路径调用 `596DF9`。1495 槽接受有符号选择值 1–1494，其余写回零。`604A98` 的 5,980 个映射字节与固定 SE 的 `568310` 一致。槽首两个 WORD 核颜色号和修订。需要转换且槽记录的加载字节为零时，`596699` 按映射找 RD 载体。解码失败清 `+0x804` 的 768 字节后继续转换。非零选择从槽 `+4` 取原色表，或在旗标 `0x04` 清除时从 `+0x404` 取变换表，经 `5933AF` 上传。 [样本、槽和调用证据](../build/analysis/legacy-item-explicit-palette-v1/source-review.json)

**事实**。零选择处置图像记录 `+8` 的颜色对象。对象颜色状态失配时退役旧对象。内嵌色段从像素宽乘高之后开始，以类型 2 交给 `4759F4`。无内嵌色段且 `0x04` 已设时用类型 0 取 `6B002C` 原色快照。`5934D8` 传对象 `+0x10` 或空值。`4797C0` 在锁定返回零后，按 16、24、32 位用 RD 单字节索引读 2、3、4 字节表，8 位复制源索引。24 位命名表对全零 BGR 写 `01 00 00`。所查原色及内嵌分支对非零 BGR 把 B 写为 1。两路清索引 0。 [显式与默认分派](../analysis/capability-first-v1/game-presentation-functional-specification.json#/fixed_item_explicit_palette_upload)

**事实**。`59312B` 以颜色号、修订和选择值判定命中。命中直接返回 1，`0x04` 将两个预期颜色值置零。`593524` 进入时清处理计数。限制已启用、图像色段标记非零且旧色号非负时，第 11 个合资格失配块返回 1 并保留旧色和标签。解码失败返回 0。非零选择遇空槽时跳过上传并发布标签，调用上传后同样发布标签。 [两版共用的延期规则](#legacy-graphics-deferred-upload)

**本机对照与设计**。8 项原创用例覆盖 65,536 个选择值、旗标、缓存命中及缺载体行为。G06/X03 的 D0/D2 复用现有 RD、命名选择器、RGBA 和图块所有者。D5 沿 PR-A09/A10 一次核两版共同的像素、实际上传、标签、失败和下一轮补色。**待验证**。短色段尾部、空槽实际裁切、位深与物理表面、当前同版及三端产品。 [本机核验](validation.md#fixed-item-explicit-palette-upload-validation)

<a id="fixed-se-explicit-palette-upload"></a>

## 固定 SE 命名与内嵌色表的上传和缓存

**事实**。同一固定 SE 在普通绘制前调用 `507B20`，检查有符号 16 位选择值。所核 1495 槽表接受 1–1494，范围外归零。命名表根据调色编号和修订复用，也可经 `5076A0` 从载体 RD 重建。命名槽已有内存且载体解码失败时，所查路径记失败并清 `+0x804` 起的 768 字节，再继续转换。槽内 `+4` 是原色表，`+0x404` 是经过通道查表的颜色。 `505D70` 按旗标 `0x04` 选择这两个表。 [原函数、字节与调用](../build/analysis/fixed-se-explicit-palette-upload-v1/source-review.json)

**事实**。选择值为零时使用图像的内嵌颜色，或在无内嵌且旗标 `0x04` 已设时使用原颜色快照。 `447B10` 生成的对象非空时将 `+0x10` 的表交给 `449C80`。该出口随后通过 `449A10` 按输出位深用 RD 字节索引查表。所选 16 位转换把三个通道的 WORD 合并。所查 24 位命名表映射全零 BGR 为 `01 00 00`，保留其余蓝值。 `447B10` 的八个 24 位循环保留全零组合，在组合非零时把 B 写成 1。两路清透明索引 0。 [原字节、分支方向与表布局](../build/analysis/fixed-se-explicit-palette-upload-v1/source-review.json)

**事实**。块按调色编号、修订及选择值比较三项 WORD 标签。所选限额条件同时读取 `FAB228`、图像记录 `+0x0E` 和旧颜色编号。达到 10 时沿早退继续用先前块和标签。非零选择遇空槽时，`505EEE` 直接跳到 `505FFB` 写三标签并返回，跳过上传。较小表面的裁切路径可在此前处理表面。精灵自身的 RD 解码失败从较早路径清暂存并返回 0。 [标签、限额和失败时点](../analysis/capability-first-v1/game-presentation-functional-specification.json#/fixed_se_explicit_palette_upload)

**本机对照与设计**。九组原创夹具经过现有 RGBA 入口，复用同一 RD 字节索引、有效色段及旗标。去掉夹具的命名载体后，所测选择返回 `LEGACY_ASSET_NAMED_PALETTE_REQUIRED`，此前使用的内嵌图仍可绘制。D0/D2 沿同一颜色与图块所有者，按实际上传和颜色标签验 PR-A09、PR-A10。 [本机核验与回归](validation.md#fixed-se-explicit-palette-upload-validation)

**待验证**。原版表面实际读写、短色段的运行时尾部、空槽裁切后的可见结果及换色延期后的设备像素仍需适用回执。当前同版及三端按原验收用例。 [用例及继续条件](../analysis/capability-first-v1/game-presentation-functional-specification.json#/fixed_se_explicit_palette_upload/acceptance_cases)

<a id="legacy-render-recovery-probe"></a>

### 历史 SE 的呈现、恢复和纹理探测

**事实**。沿同一固定 SE，`44596C` 以空 GUID 参数调用 `DirectDrawCreateEx`，失败后在 `445987` 用 `DDCREATE_EMULATIONONLY` 重试。输出的 `IDirectDraw7` 位于上下文 `+4`。所选表面创建和附属表面查询把 `IDirectDrawSurface7` 放入 `+8`、`+0xC`。查询 `IDirect3D7` 的输出位于 `+0x9C`，创建的设备位于 `+0xA0`。档位 4、3、2 的设备标识依次是 TnL HAL、HAL、RGB。 [原 PE 指令和 GUID](../build/analysis/legacy-render-recovery-probe-v1/source-review.json) · [DirectDraw 声明](https://github.com/microsoft/win32metadata/blob/15fc870a5e96df7c560877ff30136c0fb5a21e9b/generation/WinSDK/RecompiledIdlHeaders/um/ddraw.h) · [Direct3D 声明](https://github.com/microsoft/win32metadata/blob/15fc870a5e96df7c560877ff30136c0fb5a21e9b/generation/WinSDK/RecompiledIdlHeaders/um/d3d.h)

**事实**。`446740` 在窗口模式 1 将客户区转成屏幕坐标后用 `Blt` 呈现。另一模式按 `4457B0` 的结果选全表面 `Blt` 或 `Flip`。呈现返回非零时，`446867` 将 `61434C` 置 1。所选 `45DDED` 路径调用 `44CF60`，其中上下文两处表面用 `IsLost` 检查。该汇总函数返回 1 时，`45DDF6` 也置标记。初始化在 `445833` 清零。 [三处标记写入与表面检查](../build/analysis/legacy-render-recovery-probe-v1/source-review.json)

**事实**。普通帧在 `44FBF9` 读到非零标记后，经 `446890` 调 `TestCooperativeLevel`。返回值为 0 才从该分支调用 `45DB10`。请求档位与实际档位失配仍沿独立入口重建。D0/D3 的 PR-A10 同时覆盖重建请求、宿主就绪和退役旧上下文的顺序。 [帧入口指令](../build/analysis/legacy-render-recovery-probe-v1/source-review.json) · [微软协作级别检查说明](https://learn.microsoft.com/en-us/windows/win32/api/ddraw/nf-ddraw-idirectdraw7-testcooperativelevel)

**事实**。`44641A` 向表面构造传入 `(256, 256, 0, 0x800)`，实际描述符由构造分支决定。构造返回空时继续到 `4464C2` 比较档位。有表面时依次调用 `SetTexture(0, surface)`、`GetTexture(0, &out)`。任一调用返回非零，释放临时表面后进入 `445F46` 的档位 1 回退。两次成功且输出非空时，释放返回的引用及临时表面，再写 `61392C`。成功却输出空时，`446483` 在计数递增前解引用空输出。 [纹理探测指令](../build/analysis/legacy-render-recovery-probe-v1/source-review.json)

**待验证**。实际设备的协作、表面和纹理调用返回值，16/24 位呈现结果，`6122E8` 的生产者，必要的非对齐暂存尾部，以及当前同版的对应行为。 [本机与宿主验收范围](validation.md#legacy-render-recovery-probe-validation)

<a id="legacy-graphics-scratch-provenance"></a>

## 固定 SE 的小地图颜色缓存与图形暂存

**事实**。样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。所选启动分支在 `450359` 将路径数组 `616524` 用于初始化，在 `450476` 将同一数组传给 `452900`。`452BC0` 核对 `data\auto.dat` 的版本、文件时间和颜色表。命中直接返回。失配经 `452939` 调用 `452960` 重算，再调用 `452A50` 写出。 [缓存布局](resource-formats.md#legacy-minimap-auto-dat) · [启动与文件字节](../build/analysis/legacy-graphics-scratch-provenance-v1/source-review.json)

**事实**。重算代表色 `44B610`、命名调色板 `5076A0`、冷缓存 `5074D0` 和按需重解码 `505D70` 共用 `453030`，以 `81D118` 读取压缩记录，以 `7287BC` 作为解码区，并使用同一个索引标记 `F8F200`。代表色解码发布独立的指针与宽高 `6122CC/613928/612504`，调色板长度参数为空。命名调色板解码发布绘制用指针与宽高 `F8F1E0/F8F1F4/F8F1F0`，长度写到调用栈。普通两条解码路径把长度写到 `F8F1F8`。 [实参、写入和引用](../build/analysis/legacy-graphics-scratch-provenance-v1/source-review.json)

**事实**。所选普通绘制在 `5060CB` 先调用 `507B20` 准备命名调色板，再于 `5060DC` 调用 `5074D0` 查询精灵缓存。`505E28` 在标记等于所需索引时跳过解码。320 号命名调色板映射到资源 113058 的 48×54 载体。实际 1,747 字节记录用现有共享解码器展开出连续的 2,592 字节像素索引和 768 字节色表。 [素材位置和摘要](../build/analysis/legacy-graphics-scratch-provenance-v1/material.json)

**待验证**。非四字节对齐的必要素材及其尾部、实际渲染后端的交错路径、当前同版适用性和三端效果。D0/D2 按各调用路径的输出集合和顺序复核。 [本轮证据范围](validation.md#legacy-graphics-scratch-provenance-validation)

<a id="legacy-graphics-partial-cache"></a>

## 固定 SE 的图形分块、部分链与再次绘制

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。对正尺寸图，`507230` 以 64×48 为逻辑分块，沿环形游标按无符号严格小于当前盖章值减 2 选槽。遇到占用槽，先清被替换图的链首并清原链的归属字段。首块写到图像记录，后续块从上一块的 `+0x10` 串联。达到计数时 `50747E` 将末块链接置零。扫描回起点时从 `507465` 到 `50749F`，保留已经发布的链，返回前未清末块的下一块指针。全程没有选到槽时，图像的链首保持为空。 [原指令和文件偏移](../build/analysis/legacy-graphics-partial-cache-v1/validation.json)

**事实**。`5074D0` 会在链首非空时直接返回 1。冷路径解码成功也返回 1，原尺寸已发布，分配结果由链首及链接反映。`506030` 的普通和缩放分支在几何检查后取链首，按次序触碰已链接块，逐块判断相交和上传结果。两条循环在下一块为零时结束。重建成功时 `507B80` 依次重置全局槽和图像链首。 [核对字节与函数档案](../build/analysis/legacy-graphics-partial-cache-v1/validation.json)

**推导**。末块链接为零时，普通和缩放只处理已经链接的块。同一图像下一次请求且链首仍在时继续命中该链，空头或重建清除后才能走冷分配。若部分链的尾块保留先前的非零链接，所查循环会继续读该链接。是否在真实运行中产生这些内存状态及对应画面，仍按原版和设备用例核验。 [完整规则与用例](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_graphics_partial_cache)

**本机对照**。stage306 的共享资源库在两幅图超过一条占用预算时拒绝整帧、释放当帧占用，之后可继续画符合预算的计划。其现有 Canvas 入口遇到该错误会停止调度。D0/D2 复用资源和帧的现有所有者，补有效块覆盖、受控恢复，以及沿已准备绘制计划继续的准入。D5 核三端实际呈现。 [本机对照与回归](validation.md#legacy-graphics-partial-cache-validation)

<a id="legacy-graphics-deferred-upload"></a>

## 固定 SE 图形块的调色板失配与延后上传

**事实**。同一固定 `37c4dfd2…13bd` 样本的 `505D70` 检查块内两个颜色状态字和绘制选择器。全匹配直接返回 1。发生失配时，同时满足启用限额、图像的色表标记已设和当前块第一颜色状态非负，才进入计数。计数小于 10 时先加一，再进入颜色处理。达到 10 后提前返回 1，块的颜色数据和三个标记仍取原值。 [原代码、字节及工具回执](../build/analysis/legacy-graphics-deferred-upload-v1/validation.json)

**事实**。普通和缩放循环均先触碰块。颜色处理返回 1 时继续提交，返回 0 时跳过该块，处理后沿原链继续。上传支路调用 `449C80` 后写三个块标记。`506030` 每次进入清处理计数。所选收尾分支计数为零时才将当前颜色状态写入 `568308`。背景捕获和改变描绘模式提示各在调用前关闭限额，之后写 1。所查重建调用在临时关闭后恢复进入时的值。 [关键入口与归档](../build/analysis/legacy-graphics-deferred-upload-v1/validation.json)

**静态推导**。已持有有效表面的 12 个可见块依次进入三个限额条件时，前 10 个进入颜色处理，后两块沿旧颜色提交，下一次绘制清计数后可以重试仍然失配的块。真实设备的调用结果和各画面条件仍待验。 [定序用例](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_graphics_partial_cache/deferred_upload/acceptance_cases)

**本机对照**。stage306 的 12 幅合成嵌入色表图像在一次计划中全数更新，没有新增资源读取。同一调色板再画一次没有新增换色。后续复用现有缓存图像、颜色转换和呈现端口，沿 PR-D2 处理绘制次序及旧颜色保留。 [本机回执](validation.md#legacy-graphics-deferred-upload-validation)

<a id="fixed-se-startup-palette-publication"></a>

## 固定 SE 的启动标识与调色发布

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`44FB60` 在普通循环前调用 `450250`。后者经 `450440` 进入 `4506A0` 的启动标识循环，返回零时沿初始化失败路径。循环先写入 `4544E0` 的资源版别，随后按 `450E98` 的表项派发。四组检测位可让所选早期阶段改走状态 25。 [分支、表项和原字节](../build/analysis/fixed-se-startup-palette-publication-v1/source-review.json)

| 选定状态 | 请求与流转 |
| --- | --- |
| 0 和 1 | 先请求黑场 `19/1`，下一逻辑轮选择标识资源 `0x3C41D` 并请求 `23/60`。两次均调用共用请求入口 `44A3F0`。 |
| 2 和 3 | 等 `6122F4` 清零时采样 `GetTickCount`，再等本次无符号值严格大于样本加 2,000 毫秒的 32 位结果。到时请求黑场 `19/30`。 |
| 4 | 等 `6122F4` 清零，发出 `19/0`。共用入口将步数归为 1，再按 `0x560B` 查询的有符号首值进入状态 17 或 13。 |
| 25 | 请求基础色 `0/1` 并调用 `44AB50`，随后沿当次资源版别继续。 |

**事实**。同一个 `44A430` 由启动的 `450D59` 和普通循环的 `44FC96` 调用。启动路径在输入清理与绘制时限检查前消费颜色请求。超过帧目标而追赶计数小于 20 的路径可跳过 `506030`，本轮已处理的过渡步仍生效。新目标成功读入、步数保持时，消费次数严格超过步数才复制目标色并清忙标志。 [发布次序和当前帧](../build/analysis/fixed-se-startup-palette-publication-v1/source-review.json)

**事实与设计**。资源表的 19、23 分别指向 `Bin/pal/palet_black.cgp` 和 `Bin/pal/palet_logo02J.cgp`，最小版本均为 0。版本不合格或打开失败时，发布例程在改变活动索引及过渡进度前返回。D0/D2 复用现有插值、CGP 与资源范围读，补按表选材和逻辑帧发布。现有战斗入口的合成对照接受 0、13，拒绝 19、23。 [共用规格及验收用例](../analysis/capability-first-v1/game-presentation-functional-specification.json#/fixed_se_startup_palette_publication) · [本机回执](validation.md#fixed-se-startup-palette-publication-validation)

**待验证**。实际启动画面、适用的普通地图与战斗回场、原设备及当前同版。 [下一批取证](development-plan.md#capability-first-next-analysis)

<a id="legacy-transition-background"></a>

## 固定 SE 的过渡背景捕获、复用与退役

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`5059F0` 预留 4096 个队列位置的末尾三项，有水面标记时预留四项。类型 8、6、7、9 的优先级依次为 2、5、6、20。类型 6、7 各自检查 `BFF320` 非零。6 将 `FAB22C` 的 640×480 临时面按横纵有符号偏移读到当前绘制面，7 整面反向复制。两处以 `BltFast` 的等待标志 `0x10` 调用，随后直接推进队列。 [字节、指令与文件偏移](../build/analysis/legacy-transition-background-v1/validation.json) · [Microsoft 的 BltFast 文档](https://learn.microsoft.com/en-us/windows/win32/api/ddraw/nf-ddraw-idirectdrawsurface7-bltfast)

**事实**。`501674` 和普通 9/3 清队列拷贝准入字。9/20 在内部绘制时临时清零该字节，恢复后直接复制当前绘制面。9/200 开始淡出前捕获旧画面，9/205 经过五次等待并绘制后捕获新画面，9/11 满足三十次等待与初始化条件后另从绘制面捕获。上述入口直接指定来源和目的面。`437A90` 捕获战斗背景后记录当前图号，子状态 2 至 6 的已选分支读到图号变化才重建。选定战斗绘制由 `423340` 按战斗尺寸及偏移重放。 [拷贝入口和门标记](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_transition_background/facts)

**事实**。具备水面条件的类型 8 也写 `FAB22C`，再从该面回读 60 条。渲染初始化优先申请一种 640×480 临时面，失败后再尝试已证后备参数。`446590` 在图形重建中释放并置空该面的指针。**推测**。合资格类型 8 与满足门槛的类型 6 同队列时，6 会读到 8 刚写入的像素。原版正常流程中准入非零、非零位移的实际来源、设备结果和像素仍待验证。 [优先级、表面分配与释放](../build/analysis/legacy-transition-background-v1/validation.json)

**本机对照**。城市过渡从上次成功绘制的表面准备，并清理被替换任务的迟到输出。战斗回场的实际 Canvas 函数接入可计数绘制端口时，普通 `runtimeRevision` 先从 1 增至 2，绘制和呈现序号均停在 236。宿主切换使战斗画布放弃提交该帧。D0/D2 沿现有资源、场景、城市和战斗帧入口接入有代次的呈现回执，纳入 PR-A11、PR-A12、GF-A10、GF-A11 同组验收。 [复现及适用范围](validation.md#legacy-transition-background-validation) · [规则与用例](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_transition_background)

<a id="legacy-transition-graphics-rebuild"></a>

## 固定 SE 过渡期间的图形重建与背景重获

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`45DB10` 先保存调色板限额值，再经 `446590` 释放并清旧临时面和上下文。`507B80` 沿原顺序尝试分配 640×480 临时面，双失败返回零。重建调用者继续进调色板准备。准备返回零时投递系统 Enter，投递返回后仍执行当前重建。两处后续直接拷贝就地没有检临时面指针或拷贝结果。 [固定样本、工具与原指令](../build/analysis/legacy-transition-rebuild-v1/validation.json) · [进入重建的条件](#legacy-render-recovery-probe)

**事实**。主状态 9 直接调用 `5028A0`，以当时活动地图重排并绘制，复制到新临时面后将调色板限额设为 1。主状态 10 取当时战斗背景图号，以中心 `(320,240)` 和优先级 200 入队，复制后恢复进入重建时的限额值。该战斗路径没有更新已登记背景图号，普通战斗仍按当前与登记图号是否匹配决定再捕获。其它主状态走共用收尾。收尾重建图形记录、清两处输入字段，再以当前时钟重设截止。 [状态分支和回执](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_transition_background/graphics_rebuild)

**推测**。已核重建链上的直接引用没有重置条带初始化字或两套推进范围。若仍在原过渡且期间没有其它状态写入，下一次条带沿原进度取新捕获。普通淡出中重建时，当前绘图资料可能已切为目标地图。原版实际像素、分配失败后的运行结果和消息再入待验证。 [来源范围与组合用例](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_transition_background/graphics_rebuild/acceptance_cases)

**本机对照**。读图挂起时关闭原回城画布，释放读取后共享控制器准备出首个淡入帧。接手画布推进四次均未绘制，过渡停在淡入。独立的第四次淡入绘制失败用例使客户端退出并关闭世界和资源库。D0/D2 在现有过渡和帧所有者补接有效待呈现帧的交接，以及按当前场景重获背景的条件。 [复现、回归与边界](validation.md#legacy-transition-graphics-rebuild-validation)

<a id="fixed-se-scene-palette-follow"></a>

## 固定 SE 的场景调色、时段跟随与恢复帧

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`Ta>` 的一个字节字段经 `4FBBB6 → 4EF9D0` 处理。内层第二项最多取 31 字节，空值或转出的负数发布 `F5F188=-1`，非负值照原值发布。第一项继续用于场景标签，原有等待条件仍可置 `BFF334`。 [标签与调色值的原件证据](../build/analysis/fixed-se-scene-palette-follow-v1/source-review.json)

**事实**。两处调色调用 `502962`、`502986` 均属 `502950`，该函数的 13 处已核直接调用均在 `501A50`。`F5F188=-1` 时请求当前时段默认色并启用跟随。非负时请求显式色并禁用跟随。两者均传 0 步，`44A3F0` 将其归为 1，调用方随后消费待选值并写 `-2`。即使显式色被索引或版本门槛拒绝，消费和跟随切换仍执行。值低于 `-1` 时直接返回。 [有符号选择与调用点](../analysis/capability-first-v1/game-presentation-functional-specification.json#/fixed_se_scene_palette_follow/pending_selector)

**事实**。`451BA0` 在分类变化时更新时段默认色 `7283F0`。跟随字 `7283EC` 恰为 1 时才请求新色，以 3,600 步过渡。`501B01`、`501B06` 相邻调用先消费场景请求再更新分类。恢复跟随的同一轮内，时段变化可提交后一个合格请求。显式色生效时默认色仍随分类变化，恢复时读取当时的默认色。 [时段生产者与先后](../build/analysis/fixed-se-scene-palette-follow-v1/source-review.json)

**事实**。`9/20` 的 `5028A0` 先内部绘制并尝试复制到临时面，返回后写子状态 3。普通路径随后消费调色请求、处理移动和更新时段。主循环在状态分派返回后经 `44FC96` 发布调色，进入外层绘制时才调用 `506030` 和 `446740`。素材打开失败沿共用发布入口保留已发布色和有效待选。 [内层和外层顺序](../analysis/capability-first-v1/game-presentation-functional-specification.json#/fixed_se_scene_palette_follow/ordinary_capture_and_present)

**本机对照与设计**。stage306 的六组原创 `Ta>` 经现有世界入口保留解码值，普通画面摘要一致。D0/D2 复用标签解码、时钟与颜色算术，补调色状态及外层帧接线。异步目标端沿既有场景回执用例核合格输入与成功呈现的先后。原版的实际设备像素及同版三端产品待验。 [对照与范围](validation.md#fixed-se-scene-palette-follow-validation)

<a id="battle-266-rid-frame"></a>

## 固定 SE 的 SKL266 变体 2 与 RID 暂存

**事实**。样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。命令管理器在 `4367F1` 调用构造函数 `436880`。`4368AD` 将 `4260B0` 写到命令对象回调槽，构造时将内部阶段置 0。活动位已设且延时小于零时，类型 0 和阶段 0 进入类别解析。类别 266 在 `43395C` 的字节索引 149 取选择器 1，`43394C` 的第 1 项指向 `42F098`。

**事实**。以 `42F54A` 的 ESP 为基准，`42F53E` 从 +0x38 载入 EDI。合资格外部 RID 在 `42F61A` 用转换后的第一项替换 EDI，在 `42F628`、`42F63A` 分别写 +0x3C、+0x14。普通外部结果也经 `42F64F`、`42F65B` 将当前 EDI 交给 `434AF0`，后者在 `434B3D` 写入第四格。所选循环中，后续普通结果继续沿用 EDI。

**事实**。自身 RID 仅把第一项写入 +0x24，随后两项的转换结果未写入上述两个槽。变体 2 的自身尾部在 `42FB82`、`42FB86` 取 +0x14、+0x3C。尾部将两项交给 `436E60`，该函数按 `0x800000` 决定是否添加 RID 记录。不同外部 RID 连续到达时，该尾部读取最后一次有效写入。

**静态推导与待验证**。所选入口、循环和尾部均已核对显式栈访问。首个外部 RID 前的 +0x38、无外部 RID 时自身尾部使用的 +0x3C 和 +0x14 仍缺该次回调内的已证写入。跨回调的同址写入和调度约束见下文。 [暂存与调度](#battle-rid-callback-reuse) · [预检与共享对照](#battle-266-source-admission) · [投射物复制](#battle-266-projectile-row)

REA 6.7.0 与 Ghidra 12.1.4 取得回调注册引用及两个字节窗口。复用已有派生回调，以 Apple LLVM 21.0.0 和 PE 原字节核对所选 905 条指令、3,357 字节。原创混合序列确认当前共享计划的普通第四格为 0，自身尾部已使用最后一条外部 RID。D4 将原规则与现有差异一并处理。 [来源核验](../build/analysis/battle-266-rid-frame-v1/source-review.json) · [共享入口对照](../build/analysis/battle-266-rid-frame-v1/focused-probe.json)

<a id="battle-rid-callback-reuse"></a>

### 固定 SE 的 SKL404 暂存写入与 SKL266 调度间隔

**事实**。同一 `37c4` 样本的普通战斗子状态 5 在 `438062`、子状态 6 在 `438135` 调用对象遍历 `409FE0`。`40A024` 以固定栈深度调用 `object+8`，`40A026` 回收对象参数后读取下一节点。`4368AD` 为命令对象登记同一 `4260B0`。对 `409FE0` 的同一入口 ESP，两种命令的所选栈位置相同。 [分派与地址对照](../build/analysis/battle-rid-callback-reuse-v1/source-review.json) · [子状态表复核](#battle-receive-scratch-overlap)

**事实**。404 的表项 `433A04` 指向 `431118`。所选活动施法者与不同的有效结果槽进入 `431F20`。标志 `0x800000` 置位时，`431F51`、`431F61`、`431F73` 分别存三个经 `500A70` 转换的 RID 字。扣除已压入的参数后，三处对应 266 在 `42F53E`、`42FB86`、`42FB82` 读取的 +0x38、+0x3C、+0x14。 [字节与栈偏移](../build/analysis/battle-rid-callback-reuse-v1/source-review.json)

**静态推导**。两条所选预检到达 `435DDC` 时将相位推进标记置 1。管理器先以当时相位构造对象，随后在 `43685D` 推进相位。`436924` 将倒计时设为相位乘 22，`426362` 每次合资格回调减 1。回调进入时倒计时小于零才解析。两条独立命令同批连续创建且回调准入节奏相同时，首次解析相差 22 次。起始相位为 0 时，分别是各自的第 2 次和第 24 次合资格回调。 [预检、构造和调度](../build/analysis/battle-rid-callback-reuse-v1/source-review.json)

**待验证**。SKL266 首次读取前的最后写入及三个字的实际值。已绑定技能写入和普通帧接收清理两类来源。 [验收范围](validation.md#battle-rid-callback-reuse-validation) · [普通帧清理](#battle-receive-scratch-overlap)

<a id="battle-result-scratch-writers"></a>

### 固定 SE 的换身、附件与结果暂存

**事实**。同一 `37c4` 样本的 SKL404 自身换身分支在 `4318C4` 读附属资源，经 `500A70` 转换后在 `4318D0` 写 `ESP+0x40`。扣除该处已压入的参数，位置是回调暂存基准 `+0x14`。SKL405 的目标分支读取主体、骑乘和附件，第三个资源在 `43255E` 转换，`432569` 写 `ESP+0x30`，同样落在 `+0x14`。`4325A1` 重新读取该值并经 `4325C1` 写入附件结果行。 [栈偏移与原字节](../build/analysis/battle-result-scratch-writers-v1/source-review.json)

**事实**。SKL404 普通外部结果在 `431F42` 跳过 RID 写入后，仍于 `431F8C` 读取 `+0x38`，经 `431FA5` 写结果第四格。带 RID 的分支先更新三个暂存字再进入同一提交。`431FC7` 另调用 `436E60`，由 `0x800000` 控制是否生成附加 RID 行。 [结果参数与源规则](../build/analysis/battle-result-scratch-writers-v1/source-review.json)

**静态推导**。SKL405 预检在读到行结束时经 `4362C6` 写相位推进标记。404、405、266 同批依序独立创建、起始相位为 0 且回调准入节奏相同时，首次解析分别在第 2、24、46 次合资格回调。此例的 405 在 266 首次解析前写入第三个槽。已核的普通倒计时分支只走自身更新和返回，三个暂存字均保持当时值。**待验证**。期间其余对象与帧处理的写入，以及原版实际首次读值。D4 按三个字各自的生产和读取顺序处理 BF-D7。 [调度与验收范围](validation.md#battle-result-scratch-writers-validation)

<a id="battle-receive-scratch-overlap"></a>

### 固定 SE 普通帧的收包清理与战斗暂存

**事实**。同一固定 SE 的普通帧 `44FC66` 先调用 `4EDEF0`，再在 `44FC7A` 派发主状态。主状态 10 经表 `50199C` 进入 `437B30`。原表 `43865C` 将子状态 5、6 分别分派到 `43805D`、`438130`，各自在其下一条指令调用 `409FE0`。前一次记录把 `438062` 标成了子状态 6，本次按表项纠正。 [两张分派表与调用](../build/analysis/battle-receive-scratch-overlap-v1/source-review.json)

**事实**。收包轮询经 `51BAC0` 保留 `0x48210` 字节栈空间。连接条件满足、计数增一后模 8 为零、所选就绪检查返回非零时，`4EDFEE` 将 262,144 字节接收缓冲清零，随后请求接收至多 262,143 字节。另一个 `4EE0A7` 清理的是相邻的 32,768 字节解码缓冲。 [清理分支、指令和导入槽](../build/analysis/battle-receive-scratch-overlap-v1/source-review.json)

**静态推导**。以 `44FC66` 调用前的 ESP 为基准，所选普通帧的战斗回调暂存基址为 −0x68C。暂存 `+0x14`、`+0x38`、`+0x3C` 分别落在接收缓冲的 `0x3F98C`、`0x3F9B0`、`0x3F9B4`，都在 `4EDFEE` 的清零范围内。接收前缀从缓冲起点写入，达到某个字节后即可覆盖它。解码缓冲的清理在接收缓冲开始处结束。 [栈深度和字节边界](../build/analysis/battle-receive-scratch-overlap-v1/source-review.json)

**规格与待验证**。D0/D4 在 BF-D7 共用跳过清理、清理后短前缀、前缀跨字和同帧后续写入的用例。实际读值取决于该次清理后至回调前的最后写入。所选短前缀路径的静态推导见下节。 [验收范围](validation.md#battle-receive-scratch-overlap-validation)

<a id="battle-266-cleared-frame-read"></a>

### 固定 SE 清零帧的 SKL266 首次读取

**事实**。固定 SE 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。接收已清零、拼接区为空且解码模式活动时，所选 1–7 字节片段以 `AF` 开头。`4EE330` 只复制该前缀，`4EE470` 按不足 8 字节返回，`4EE07D` 跳过本次消息分派。三个暂存字位于前缀之外。SKL266 命令已在对象队列等待。 [原指令与帧条件](../build/analysis/battle-266-initial-read-v1/source-review.json)

**事实**。管理对象和命令对象的优先级同为 1。`409E70` 只在遇到更大优先级时插到前面，先创建的管理对象先执行。在所选子状态 5 且 `599C44 != 1` 时，或子状态 6 有活动命令且 `599C40 != 0` 时，`4365D0` 提前返回。 [插入与分派证据](../build/analysis/battle-266-initial-read-v1/source-review.json)

**静态推导**。在上述路径上，发送队列为空且周期发送被跳过，音频按非零禁用标记提前返回，光标与背景状态保持，普通宿主调用按其参数写入，且此前对象都保留三个字。所选等级 9、变体 2、类型 0 的活动命令在延时小于零、记录阶段为 0 时进入首次解析。`42F53E` 读 `+0x38` 为零，首条普通外部结果经 `434B3D` 将零写入第四格。仅自身 RID 且无护卫时，`42FB82`、`42FB86` 读到的 `+0x14`、`+0x3C` 均为零。RID 位准入 `436E60`，它在已有两行之后追加三行。前两格沿用所选目标槽和标志，后两格依次为「转换后的自身首字、0」「0、0」「结果数值、转换后的自身首字」。 [读取与追加](../build/analysis/battle-266-initial-read-v1/source-review.json)

**实现差异与待验证**。共享计划的普通结果已写零，同一入口在仅自身 RID 用例返回 `physical-family-self-RID-prior-context`。BF-D7 按已证帧来源处理该差异。带护卫的写入见下节。跳过清理、较长前缀、其他帧调用或对象写入、原版实读和当前同版仍待证。 [共享对照](../build/analysis/battle-266-initial-read-v1/focused-probe.json) · [验收范围](validation.md#battle-266-cleared-frame-read-validation)

<a id="battle-266-audio-map-save"></a>

### 固定 SE 曲目配置保存对 SKL266 暂存的写入

**事实**。固定 SE 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。接收从 `44FC66` 返回后，`44FC72` 在主状态分派 `44FC7A` 前调用音频维护。声音可用时，`510B76` 在环境音维护返回后调用 `5104C0`。音乐相位 `FBA3CC` 为 0、请求 `FBA3C8` 非零、目标 `FBA3D0` 与当前曲目 `56A918` 不同，才进入所选保存路径。它把相位置 1，按有符号地图槽写曲目低 16 位，经 `510507` 保存配置，返回后清请求。曲目相同时直接清请求。 [固定样本、调用及分支证据](../build/analysis/battle-266-audio-map-save-v1/source-review.json)

**静态推导**。把 `44FC66` 调用前的 ESP 记为 `S`。`505450` 将 `F62D50` 的 1024 字节复制到局部缓冲，清其中偏移 `[0x37,0x6A)`，经 `5111C0` 将 1025 字节写入 `[S−0x814,S−0x413)`。三个暂存字 `+0x14`、`+0x38`、`+0x3C` 分别落在编码结果的 `[0x19C,0x1A0)`、`[0x1C0,0x1C4)`、`[0x1C4,0x1C8)`。打开 `save.dat` 发生在编码之后，打开失败时三个字已写。随后如果所选 404 同帧执行，它会再写三个字。如果只有所选 405 的目标附件随后写入，它会再写 `+0x14`。BF-T36 在各读取点核对最后一次实际写入。 [区间、格式和用例](../analysis/capability-first-v1/game-battle-functional-specification.json#/result_tuple_storage_lifecycle/rid_frame_266/callback_stack_reuse/audio_map_save) · [后续命令的写入](#battle-266-same-frame-producers)

**事实**。战斗子状态 2 至 6 的所选路径发现背景编号变化时，`437A90` 传 0 调用 `463EA0`。`463ED3` 清曲目请求，两处有参置位分支都跳过。普通地图包装 `45FFD0` 传 1。 [请求引用和入参](../build/analysis/battle-266-audio-map-save-v1/source-review.json) · [本机验证范围](validation.md#battle-266-audio-map-save-validation)

<a id="battle-entry-audio-request"></a>

### 固定 SE 普通入战的换曲请求时序

**事实**。同一固定 SE 样本经 `4F35C0` 将所选入战等待字 `599E0C` 置 1。`9/3` 的 `5024E4` 先做允许发布曲目请求的普通地图绘制，`50250C` 再检查等待字。准入后 `502638` 调用 `50F500`，其两条正常返回均清淡出标志和音乐相位，曲目请求字保持原值。所选路径依次到 `9/4`、`9/5`。`9/5` 等过渡返回 1，在 `502688` 调用 `5019F0` 发布 `10/0`。下一帧先经 `44FC72` 做音频维护，再派发 `10/0`。 [状态表、调用和相位引用](../build/analysis/battle-entry-audio-request-v1/source-review.json)

**事实**。`10/0` 在 `437C07` 捕获背景，参数 0 到达 `463EA0` 后先清请求，再跳过地图曲目的两处置位。`10/1` 的过渡返回 1 时再用同样的参数捕获。所查主状态 10 里的另一条直接绘制调用 `45DC14` 也传 0。支持参数 1 的六个包装调用均位于普通地图状态处理 `501A50` 内。 [绘制调用及参数](../build/analysis/battle-entry-audio-request-v1/source-review.json)

**静态推导**。当目标曲目和当前不同且声音持续可用，所选 `9/3` 发布的请求在 `9/4` 维护中触发编码。中间关闭声音时，维护早退并保留请求，最迟可在 `10/0` 的维护触发编码。若到这次捕获仍未消费，捕获会清除它。所选 `10/5`、`10/6` 的当帧保存因而没有这个旧请求来源。接收已经清零的用例会先覆写较早的编码字。跳过清零时，较早字节能保留多久、其它音频和宿主写入及原版实际首读继续沿 BF-U1 核验。 [复算与验收用例](validation.md#battle-entry-audio-request-validation)

<a id="battle-266-same-frame-producers"></a>

### 固定 SE 合组接续与 SKL266 同帧前序写入

**事实**。同一固定 SE 样本的主状态 10、子状态 6 在 `438135` 调用 `409FE0`。管理者在依赖准入后将同施法者的后续 SKL 并入原命令对象，更新记录数及依赖掩码。`CHT` 的预检保留分组相位，所选 404 或 405 推进相位，后续独立 266 的初始倒计时为 22。聊天完成后 `436930` 把下一记录的阶段和倒计时重置为零，并重新允许管理者检查输入。输入已结束而命令仍活动时，管理者返回，对象遍历继续读下一节点。 [REA 引用、原指令和分派表](../build/analysis/battle-266-same-frame-v1/source-review.json)

**静态推导**。在选定的合资格遍历中，聊天第 2 次开始。时长字段为 20 时，第 22 次切换到组内技能，第 23 次把该技能的倒计时从 0 减到 -1，第 24 次解析。独立 266 同在第 24 次首次解析。两个对象同优先级，先插入的对象先调用。时长 19 或 21 时，前序技能的解析分别提前或推后一次。此前的第 2、24、46 次例子适用于同批独立构造及相同准入节奏。 [调度复算](../build/analysis/battle-266-same-frame-v1/source-review.json)

**事实与静态推导**。选定外部 RID 的 SKL404 在 `431F51`、`431F61`、`431F73` 更新三个字。SKL405 的附件仅在 `432569` 更新 `+0x14`。从所选入口跟到返回，直接栈写入和读取位置一致。按短前缀清零且其余回调保持这些字的条件，404 的首项进入 266 普通结果第四格，后两项进入仅自身 RID 的附加行。405 只改变自身附加行里的第三个资源字。原版实际读值、其它回调及跨帧保留继续取证。 [前序写入及读取点](../analysis/capability-first-v1/game-battle-functional-specification.json#/result_tuple_storage_lifecycle/rid_frame_266/callback_stack_reuse/same_frame_producers)

**本地对照**。现有命令所有者复现第 23、24、25 次的组合顺序。普通结果第四格仍写 0，仅自身 RID 仍提前返回。本机 404 夹具使用已支持的自身交换后接外部 RID，固定源静态路径使用单个外部 RID。D0/D4 按 BF-D7、BF-T36 在现有帧上下文和结果队列中处理这项差异。 [用例与限制](validation.md#battle-266-same-frame-validation)

<a id="battle-266-adjacent-frame"></a>

### 固定 SE 的 SKL266 相邻帧读取

**事实**。样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。固定主状态 10、子状态 6 在 `438135` 进入对象遍历。命令与状态派发正常返回后，`44FB60` 可由 `44FD4C` 或 `44FDAF` 进入下一轮。对下一次 `44FC66` 复算出相同的调用前 ESP。以此为基准，`+0x38`、`+0x3C`、`+0x14` 分别位于 `[-0x654,-0x650)`、`[-0x650,-0x64C)`、`[-0x678,-0x674)`。所选空消息、无调色板变化路径的局部写入已核，窗口回调及实际呈现的间接分支仍沿具体入口验。 [原指令、栈范围与分支](../build/analysis/battle-266-adjacent-frame-v1/source-review.json)

**事实**。接收准入连续成立时，`4EDF69` 读 `D19020`，`4EDF72` 保存递增后与 7 取与的结果。非零从 `4EDF77` 直接返回。归零时，如果就绪返回零，`4EDFDD` 跳过清理。返回非零时，`4EDFEE` 清 262,144 字节并覆盖三个暂存字。按归零后就绪且其余条件满足的短前缀用例，三个字均以零进入 266 的所选读取点。长前缀从长度 `0x3F98D`、`0x3F9B1`、`0x3F9B5` 开始覆盖 `+0x14`、`+0x38`、`+0x3C`。 [清理与所选首读](#battle-266-cleared-frame-read) · [长前缀与分派](#battle-266-long-receive)

**事实与静态推导**。所选聊天时长 19 使 404 或 405 在第 23 次合资格回调写入，266 在第 24 次首次解析。前序命令在下一帧的阶段 1 先检查角色就绪。若 `434B90` 见依赖方还在等待且次数未超过 7,200，所选返回为零，`4293A4` 或 `432650` 直接走公共返回，三个字在这段保持。上述两帧若从计数 6 开始得到 7、0，266 所在帧进入就绪判断。若从 7 开始得到 0、1，前序帧判断就绪，266 所在帧跳过清理。其余 0–5 的起值均使两帧从非零计数分支返回。 [等待分支与八种计数](../build/analysis/battle-266-adjacent-frame-v1/source-review.json)

**实现差异与待验证**。BF-D7、BF-T36 按字核对最后一次有证写入。跳过清理且中间写入均保持时，404 的三个字段可作为 266 的前值。405 只给出 `+0x14`，另外两字各沿自身前值。经典指令窗与所选长接收分派已有写入范围，条件回调、其它对象和实际首读仍按具体来源核验。现有共享对照仍读到普通第四格为 0，仅自身 RID 返回缺上下文。 [用例与本机对照](validation.md#battle-266-adjacent-frame-validation)

<a id="battle-266-long-receive"></a>

### 固定 SE 长接收、余留与战斗消息分派

**事实**。同一固定样本在 `4EE004` 请求最多 262,143 字节。正返回先写原始区，再由 `4EE330` 追加到 `CD8E28` 全局队列，合计容量为 262,144。超容量时旧队列保持，调用者仍在 `4EE04C` 检查缓存。就绪返回零会跳过原始区清理和接收，也可从该处消费旧队列。普通非负帧正文最多 32,767 字节，单帧含 6 字节开销。较长读取能带多帧，也可由首个有效起始标记前的字节占据大部分。 [样本指纹、原字节和条件](../build/analysis/battle-266-long-receive-v1/validation.json)

**事实**。活动解码时，`4EE470` 在全局队列找首个 `AF`，从该字节起至少有 8 字节才检查头。正常帧由 `4EE3D0` 消费并把余留前移到同一全局队列首。缺包、未找到起始标记或坏尾返回 −1，所选正常路径结束当轮普通分派。满 8 字节但 `AF` 后无 `EF` 时消费到该 `AF` 并返回 0。第一条正常消息已成功分派并清解码区的条件下，之后遇到这一分支仍回到 `4EE04C` 并检查后续完整消息。 [接收、消费及复查规格](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_long_receive_dispatch)

**事实与静态推导**。所选 `?+e` 进入 `4F36D0` 的内层 `M` 时，把正文复制到每槽 4,096 字节的全局四槽队列。收包解析使用 32,768 字节的解码区，回到接收循环前清解码区及独立的解析器内存。以 `44FC66` 前为零，解码区 `[−294916, −262148)` 与原始接收区 `[−262148, −4)` 相邻。可选解析回调及日志未启用时，所核追加、前移、普通 `M` 分派和清理保持原始区。三个暂存字在这个阶段由实收字节与先行清零决定。命令仍随战斗状态帧推进，二进制旁路、可选解析效果、其他业务分派和原版随后实读继续按 BF-U1 验证。 [两区范围与战斗写入](../build/analysis/battle-266-long-receive-v1/validation.json)

**本机对照**。用原创数据经现有协议入口，完整和拆分的 262,143 字节流均顺序发布两条 `M`。网页会话夹具按 65,536 字节上限分四次读并发布两条消息。第一条消息后插入无效起始标记时，现有会话先推进游标，第二条完整消息等下一次读取才发布。CF-D3 复用现有流和队列交接这项差异，BF-T36 沿同一用例核原始接收区和战斗首次读取。 [本机对照及验收范围](validation.md#battle-266-long-receive-validation)

<a id="battle-266-frame-intervening-writes"></a>

### 固定 SE 战斗相邻帧的对象、绘制和输入写入

**事实**。固定 SE SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。主状态 10、子状态 6 的对象回调遍历返回后，依次调用排序、绘制提交、历史键、光标、经典窗口、键盘和帧尾更新。在所选链上，以 `44FC66` 调用前为零，这些调用发出前的 ESP 为 `-0x64`。排序读对象字段，写全局指针表及对象序号。绘制提交的队列及文本缓冲在全局区，所选数值转换的局部写入也与三个暂存字分开。 [原地址、指令及复用档案](../build/analysis/battle-266-frame-intervening-writes-v1/validation.json)

**事实**。默认编辑焦点下，所选无按键路径按提示活动标志决定后续绘制。已核历史键的局部复制和一层分割。键盘状态调用在 `451D9E`，导入为 `GetKeyboardState`，调用方缓冲为相对区间 `[-0x168,-0x68)`。非输入法分支所选固定文本进入已有绘制队列。下一帧的日历输出写至 `7283F8`，直接时间和时区输出指针及所核一级帧也与三字分开。 [源规格与地址](../analysis/capability-first-v1/game-battle-functional-specification.json#/result_tuple_storage_lifecycle/rid_frame_266/callback_stack_reuse/adjacent_frame_producers/frame_intervening_writes)

**推测**。若其余中间调用也保留各字，跳过接收清零后，下一次 SKL266 可以沿用逐字写入所得前值。**待验证**。绘制和退役的所选内部写入已定位。输入回调、时区深层调用、长前缀及其他前序对象仍按实际分派核对。共享本机夹具在第 23 次运行前序操作，第 24 次消费时普通第四格仍为 0，仅自身 RID 仍返回缺上下文。 [绘制与回收写入](#battle-266-window-draw-retirement) · [本机用例与验收条件](validation.md#battle-266-frame-intervening-writes-validation)

<a id="battle-266-host-calendar"></a>

### 固定 SE 时区缓存与游戏日期发布

**事实**。固定 SE 的 `51B669` 先取本地时间，再取 UTC。缓存比较 UTC 的年、月、日、时、分。命中时从 `FF1108` 取标志。失配时通过 `GetTimeZoneInformation` 刷新，返回 `-1` 时也保存当次 UTC 与 `-1`。返回 2 且夏令时月份和偏移均非零时保存 1，其余保存 0。每次按刚取的本地时间继续转换。 [源字节、宿主导入及缓存写入](../build/analysis/battle-266-host-calendar-v1/validation.json)

**事实**。`520B61` 处理本地年 1970–2038，范围外返回 `-1`。常规路径用月份表、闰日及运行库标准偏移转换，标志 1 再加夏令时偏移。所查冷初始化可从 Windows 时区结构取得偏移，映像初始值另有记录。宿主时区查询标志 `-1` 且运行库启用夏令时时走 `52074A`，切换日比时分秒。所选调用只写该记录的年、月、年内天序和小时。实际边界回退用到的分和秒待适用运行值。 [时区换算和回退条件](../analysis/capability-first-v1/game-entry-review-contract.json#/shared_clock_input_review/fixed_se_host_calendar)

**事实**。`44FC4F` 调 `451A80` 时，结果发布到 `7283F8` 的六个 DWORD。它使用 `51B669` 返回的 32 位值以及服务器秒、会话基准和偏移。年越界时的 `-1` 仍沿原 32 位加减进入该投影。 [发布入口与原指令](../build/analysis/battle-266-host-calendar-v1/validation.json)

**推测（静态推导）**。所选直接转换和已缓存的失效回退内层，局部栈最低到 `-344`。最近的 SKL266 暂存区间结束于 `-1612`。所核区域与三字分开，时区冷初始化、运行库锁、宿主回写和其它前序调用继续沿适用证据。 [相对栈与覆盖范围](../build/analysis/battle-266-host-calendar-v1/validation.json)

**本机对照与待验证**。现有客户端在原创游戏日尾夹具中将事件时槽从 23 更新到 0，宿主秒数从 `0xFFFFFFFF` 到 0 继续沿用该结果。有符号值 `-1` 返回 `LEGACY_GAME_CALENDAR_CLOCK`。D0 复用秒数输入、会话基准和实际投影，D4 沿 BF-T36 核逐字来源。 [本机结果与用例](validation.md#battle-266-host-calendar-validation)

<a id="battle-266-ime-presentation"></a>

### 固定 SE 组合文字和候选的帧写入

**事实**。沿同一固定 SE，`45DD80` 收到消息 `0x10F` 时经 `45E252` 调 `452200`。已确认的组合结果逐字节交 `444B80`。另外的标志分别更新 `728488` 组合串与 `728588` 属性。消息 `0x10E` 清组合串首字节。消息 `0x282` 的子事件 3、5 通过 `ImmGetCandidateListA` 查询第 0 组并更新 `728694`。准备新表前退役旧表。长度为零与子事件 4 清表。 [消息、导入及原字节](../build/analysis/battle-266-ime-presentation-v1/validation.json)

**事实**。`451E59` 要求键盘布局的 `ImmIsIME` 返回非零、组合串首字节非零、编辑目标非空。`C4BFD0` 控制更早的状态说明。组合串进频道 0，首项优先级 210。高位为 1 的源字节跨两字节计宽，度量取活动字号的单、双字宽。首个属性 1/3 建立高亮起点，属性 2/0 结束所选范围。 [共用文本规格](../analysis/capability-first-v1/game-text-editing-contract.json#/fixed_se_active_ime_presentation)

**事实**。候选使用页起点加页内下标，实际索引小于总数才读字符串。显示编号为页内下标加 1。编号与候选文字进频道 4，首项优先级 226。每项推进至少一个布局单元，累计取字节长度的一半并截断，终点再取实际字宽。绝对选择索引决定矩形背景。原版 `5070E0` 在下层图形队列满返回 `-2` 后仍执行类型写入。该分支与正常入队输出分别记录。 [候选、队列和边界](../build/analysis/battle-266-ime-presentation-v1/validation.json)

**推测（静态推导）**。以 `44FC66` 调用前为零，所选候选编号写入 `[-372, -360)`，所核矩形提交的局部栈最低到 `-516`。正常文字、矩形和排队记录写入全局表。最近的 SKL266 暂存字结束于 `-1612`，所核写入与三字分开。 [相对地址和覆盖范围](../build/analysis/battle-266-ime-presentation-v1/validation.json)

**本机对照与待验证**。现有共享量宽与原表 14 个字号匹配，优先级 210 可建立，226 返回 `LEGACY_TEXT_BATCH`。D0 复用量宽和帧队列，补实际频道的排序入口，D4 复用逐字上下文。原版实际候选、消息重入、SKL266 实读和三端输入法按对应组合用例。 [本机测试与差异](validation.md#battle-266-ime-presentation-validation)

<a id="battle-classic-input-window-frame"></a>

### 固定 SE 的战斗指令窗跨阶段关闭

**事实**。沿同一固定 SE 样本，子状态 4、5、6 分别在 `437FBC`、`438080`、`43814E` 调用窗口更新。所选普通路径进入 `46AB90`。成功创建指令窗时，`4899E3` 请求 26 号，`4685AE` 登记到窗口池。描述符 `52E298` 绑定前置更新 `489EA0`、控件后的绘制 `48A060` 和析构槽 `4678A0`。每次窗口遍历先整理待退役对象，处理窗口本体和前置更新，再按当前控件参与标志分派，最后调用绘制。 [原字节、表项和 REA 引用](../build/analysis/battle-266-classic-window-frame-v1/source-review.json)

**事实与静态推导**。所选普通确认等待菜单状态 3 才切到子状态 5。所选倒计时分支调用 `489DF0` 请求关窗，把仍活动的菜单设为状态 2，随后在 `48B6F4` 切到子状态 5。此时子状态 4 的窗口更新已结束，后续窗口帧才推进关窗。由初始速度和位移均为零、窗口仍有效且期间未重开推导，关窗第 17 次更新达到速度 17、位移 −153、标记退役并设为状态 3。该次窗口遍历仍能分派控件和绘制，下一次整理移除此窗。若第一帧等待时已有回放记录，第 2 至 17 次更新可随连续回放帧完成。 [分支、位移和窗口次序](../build/analysis/battle-266-classic-window-frame-v1/source-review.json)

**本地对照**。现有入口在超时进入阶段 5 后，分别推进 18 帧等待与很快转入回放的两种原创输入。两组菜单均停在状态 2、速度与位移均为零。D0/D4 在既有窗口与输入所有者内处理跨阶段关闭，用一组案例覆盖已等到关窗、超时加速、待退役时绘制和再进一帧释放。

**待验证**。已核的 `489EA0` 为无调用的叶函数，写入目标为窗口及关联状态。其它控件、绘制下层及对象是否改写 SKL266 所读的三个字，沿 BF-U1 的具名写入及其与首读的先后继续核对。原版读值及实际产品界面继续沿原验收。 [本机及来源核验](validation.md#battle-classic-input-window-frame-validation)

<a id="battle-266-window-control-writes"></a>

### 固定 SE 战斗指令窗的关闭当帧

**事实**。在固定 SE 的窗 26 中，`54AF30` 有 14 条控件定义。创建时把源记录 `+0x14` 的参与标志复制到运行记录 `+0x18`，普通回调保存在 `+0x20`。窗口本体和 `489EA0` 先运行，随后 `46AC33 → 46A1F0` 对参与标志为 1 的控件计算事件位，在 `46A484` 交控件序号和事件位给回调，事件位可为零。`46AC91` 经窗口本体命中及拖放状态准入调用拖放续接。 [原件偏移、回调表和指令](../build/analysis/battle-266-window-control-writes-v1/validation.json)

**事实**。关闭阶段 2 和标记后的当帧 3 均继续使用当前菜单模式。以零为首项，经 `4899C0` 设模式后，模式 0–2 选择 0–7 和 13，模式 2 在 `599D8C` 非零时排除 2–5。模式 3 选 8、10–13，模式 4 选 8–13，保持 7 在设模式时写入的零值。控件 7 的回调 `48AF90` 可在本轮清自己的参与位，后置绘制依更新后的标志筛选。关闭态的所选按钮分支返回零，按条目更新图号或保持。阶段 2 达到速度 17 后完成当次分派与绘制。下一次整理调用的窗 26 析构槽 `4678A0` 直接返回 1，共用析构继续按条目类型回收。 [各模式、关闭分支与析构入口](../analysis/capability-first-v1/game-battle-functional-specification.json#/result_tuple_storage_lifecycle/rid_frame_266/callback_stack_reuse/adjacent_frame_producers/classic_window_frame/control_and_draw)

**事实**。`48A060` 先走 `469670` 的共用绘制，模式 3 和 4 随后更新条目 12 自持的文本。关闭态跳过活动目标标签段，调用 `44F890(3)` 清 `61734C`。以相邻帧的 `44FC66` 调用前为零，所核按钮回调局部范围最低为 `-0xC0`，绘制的两处描述符写入同一段 `[-0xA4, -0x94)`。这两种局部写入和清头地址与 SKL266 的三个暂存字分开。 [指令位置与相对地址](../build/analysis/battle-266-window-control-writes-v1/validation.json)

**待验证**。BF-D1 按模式、事件位和第 17/18 次更新使用共用关窗用例。本机两组超时夹具在 18 次等待或回放更新后仍处于 2，速度和位移均为零。BF-T36 复用下层写入的静态范围，继续核对触发条件、其他对象的实际写入与运行读值。 [本机对照与用例](validation.md#battle-266-window-control-writes-validation) · [下层写入](#battle-266-window-draw-retirement)

<a id="fixed-se-battle-window-target-selection"></a>

### 固定 SE 战斗窗的技能选择与提示顺序

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。所选骑乘路径在 `48BA2D` 传模式 4，普通宠物路径在 `48BF8C` 传模式 3。`4899C5` 先写模式字节 `C10A54`，再创建或复用窗 26。模式 3 关闭条目 9 的参与，模式 4 开启该条目。条目 9 经 `48AE90` 在窗体开闭值为零且事件含 `0x02` 时提交 `E`，并置本地完成字 `599D98`。 [写入、控制表和正文](../build/analysis/fixed-se-battle-window-target-selection-v1/source-review.json)

**事实**。条目 8 仅在窗体开闭值和待开请求 `C21BBC` 均为零时处理切换。控件事件或 `C5FB2C` 的 `0x02` 可触发。若窗 10 已登记活动实例则标记退役。若活动窗为空，则清已有目标状态、将技能序号 `5340E0` 置 −1，并按模式 3 或 4 登记 `48B170` 或 `48B2E0`。窗 10 的模式 5/6 分别把选行改绑到 `473AB0`、`473E00`，合资格按下时传所选的有符号序号给当前 `C22544`，随后标记窗口。非负序号在回调中写入 `5340E0`，略过入口单独传 −1。 [请求和回调规格](../analysis/capability-first-v1/game-battle-functional-specification.json#/result_tuple_storage_lifecycle/rid_frame_266/callback_stack_reuse/adjacent_frame_producers/classic_window_frame/control_and_draw/target_selection_input_order)

**事实与静态推导**。`48A060` 先调用 `469670`，后在模式 3/4 更新条目 12 的文本。成功入队时 `44F1B0` 将当时字串复制到频道记录，后置复制更新的内容由下一次合资格共用绘制读取。技能序号非负时，文本表的宠物索引来自 `437430`，模式 6 的选行另取 `599D5C`。负序号读取 `5849C8`，REA 静态载入首字节为零。实际运行期的回退字串待核。 [原字节与回执](validation.md#fixed-se-battle-window-target-selection-validation)

**静态推导**。窗 26 的控件如果在本轮先重置技能序号，随后共用绘制仍提交先前文本，再复制当下的回退字串。若 `48B810` 在窗体更新之后才重置，下一次窗体后置更新才复制该值。窗 10 的选择回调按实际遍历次序决定在哪一次后置更新被看见。D0/D4 将这些用例并入 BF-D1。实际窗体交错、当前同版服务和三端联动继续验收。 [共用帧接口及用例](module-interfaces.md#fixed-se-battle-selection-interface)

<a id="fixed-se-battle-skill-list-admission"></a>

### 固定 SE 战斗技能窗的行、资格与反馈

**事实**。SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的样本中，窗 10 的模式 5、6 开启时清滚动值。有对应宠物时，将宠物技能数减 10 写到 `C1570C`，并把控件 17–26 改绑为 `473AB0` 或 `473E00`。两路绘制及选择以控件序号减 17 取可见行，从每只宠物的 8 字节条目读 `+2` 的有符号技能序号。两路都以可见行查 `599C9C` 的资格位。通用滚动值 `C439F4` 由原滚动控件维护，两路查行式均使用可见行。`4F1420` 在所核 `J_J` 处理路径末尾调用 `4FDE60`，按原槽 0–9 将索引写入对应的十个条目。 [源码核验](../build/analysis/fixed-se-battle-skill-list-admission-v1/source-review.json) · [前置窗体规则](#fixed-se-battle-window-target-selection)

**事实**。技能名首字节为零时，行处理立即返回。名称非空且资格位清零时，点击位 `0x02` 请求提示音 `0x37`。资格位成立后，模式 5 按首个模式 2 宠物取技能，并用配对角色的 MP。模式 6 按当前骑乘宠物取技能，用当前角色的 MP。`4033A0` 有符号比较允许等额。MP 不足的行继续保留。资格与 MP 均满足且收到点击时，若安装了 `C22544` 回调就重查行索引并调用。随后两路都给当时的窗 10 活动实例置 `0x8000`、请求 `0x33` 并返回 1。 [来源与本机对照](validation.md#fixed-se-battle-skill-list-admission-validation)

**待验证**。D0/D3/D4 复用已有行、目标、组包和回包入口，沿 BF-D1 核滚动、空行、资格位、等额和不足 MP、回调为空、资料更新与实际退役。运行态窗口交错、两版资料和三端结果沿原验收。 [共用规格](../analysis/capability-first-v1/game-battle-functional-specification.json#/result_tuple_storage_lifecycle/rid_frame_266/callback_stack_reuse/adjacent_frame_producers/classic_window_frame/control_and_draw/target_selection_input_order/pet_skill_list_admission)

<a id="battle-266-window-draw-retirement"></a>

### 固定 SE 指令窗的绘制提交与下帧回收

**事实**。SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的固定 SE 中，`469670` 的类型 1 两路使用相同的 16 字节描述符位置。`452FE0` 和 `452E40` 写调用点提供的值及两项短坐标。`505BD0` 在全局 `F631D8` 的 40 字节队列项内复制描述符，由 `F8F1D8` 计数决定提交。类型 3 在文本指针非空时调用 `44F1B0`，由 `727358` 计数及 `617358` 的 272 字节记录提交频道 3，`5069E0` 把首项交同一个呈现队列，后项沿已有频道链接。复制按首个零终止符结束。`4699A9` 清频道 3。随后 `46D0A0` 仅在覆盖层对象存在时处理倒数，倒数及格数为正时以图号 3、队列顺序字节 100 和空描述符提交。模式 3/4 的 `48A0E2`、`48A0E9` 在共用绘制后改写条目 12 已分配的 256 字节文本区。 [取证、字节偏移与写入地址](../build/analysis/battle-266-window-draw-retirement-v1/validation.json)

**事实**。下一次 `46A0E0` 整理走 `467FC0`，窗 26 描述符的 `4678A0` 直接返回 1。`467FC0` 将位置和标志写到步长 84 字节的保存表，第 26 项始于 `C10A38`。类型 1 回收数据块。类型 3 先释放自有文字，再回收数据块。完成后释放控件数组及窗口实例，窗口表整理再移走该项。本机反汇编核对了 `51BD85` 的池入口，以及导入表 `52D1B8` 的 `KERNEL32!HeapFree` 分支。以 `44FC66` 调用前为零，所核绘图、队列和回收路径最低到 `−280`。最接近的 SKL266 暂存区结束于 `−1612`，所核写入落在这些局部地址、全局表或窗体持有区。 [相对地址和回收边界](../build/analysis/battle-266-window-draw-retirement-v1/validation.json)

**待验证**。拖放和文字焦点的所选退役规则已补证。分配器深层回写、活动输入法、其他对象及实际读到的跨帧值仍按具名来源核对。BF-D1 与 BF-T36 共用同一关窗用例。D4 的暂存值沿实际最后写入及接收清零决定。 [焦点与拖放规则](#battle-266-window-input-retirement) · [本机对照](validation.md#battle-266-window-draw-retirement-validation)

<a id="battle-266-window-input-retirement"></a>

## 固定 SE 战斗指令窗的拖放取消与文字焦点恢复

**事实**。沿上节同一 `cg_se_6000.exe` 固定样本，`467FC0` 调窗体析构并清登记记录的活动指针。窗口 ID 匹配 `5599E8` 时先调 `46CE30`。随后扫描运行控件。析构表把类型 1 和类型 5 分别交给 `468051`、`4680D7`，数据指针与 `C4BE9C` 相等时均调 `49A130`，包括指针均为零的情况。窗 26 的 14 项固定描述符中，11 项为类型 1，三项为类型 3。 [原文件偏移、描述符和分派表](../build/analysis/battle-266-window-input-retirement-v1/validation.json)

**事实**。所查拖放登记 `46C7C0`、`46CEB0` 分别写模式 1、3，把当前窗口 `C5E870` 保存为持有者。已核 20 处直接调用，17 处传入非空回调，合计八个入口。所查重绑 `47BA8B → 46CDD0` 写窗口 14、控件 0。取消时模式 0 早退。非零模式有回调时，`46CE64` 对模式 1 传 `(1, 0, 保存参数)`，其余传 `(4, 0, 保存参数)`。回调返回后重读模式，再清持有者与参数，控件置 `-1`，按当时模式是否为 1 写 2 或 6。所核 `474550` 的事件 4 可经 `474380` 合资格分支提前调用 `49A130`。 [登记、重绑和取消入口](../build/analysis/battle-266-window-input-retirement-v1/validation.json)

**事实**。`49A130` 按 `C5DCE4` 读取窗 35（`0x23`）或窗 57（`0x39`）的活动指针。默认窗缺席或模式超出 0/1 时返回 0。窗 35 先尝试初始化，失败则恢复 348 字节模板并重试。窗 57 路径尝试一次。所选类型 3 调 `4552D0` 写编辑器字段。发布时取默认窗口首控件的数据更新 `C4BE9C`，再经 `445220` 将默认目标 `60FDA8` 写入 `60FF08`。 [活跃记录、模板和发布](../build/analysis/battle-266-window-input-retirement-v1/validation.json)

**推测（静态推导）**。以 `44FC66` 前为零，所核 `474550 → 474380 → 49A130` 的模板重试路径中，编辑器字段例程入栈位置为 `−292`。最近的 SKL266 暂存字结束于 `−1612`。所核路径写局部栈、全局登记或已知编辑器字段。窗 53 合资格取消的直接帧沿后续共用规格。窗 26 实际取得的回调及其它实写继续按对应条件验收。 [相对地址和覆盖范围](../build/analysis/battle-266-window-input-retirement-v1/validation.json) · [报价刷新](#fixed-se-shop-retirement-refresh)

**本机对照与设计**。现有 Canvas 端口在活动指针失去捕获或收到取消时清原始按键。失去其他指针的捕获保留当时按键。D0/D4 复用现有输入端口和 `SourceValueContext`，按实际退役顺序处理窗体拖放与默认编辑目标。BF-D1 和 BF-T36 共用关闭夹具。 [用例](../analysis/capability-first-v1/game-battle-functional-specification.json#/result_tuple_storage_lifecycle/rid_frame_266/callback_stack_reuse/adjacent_frame_producers/classic_window_frame/control_and_draw/lower_draw_and_retirement/input_retirement/acceptance) · [本机验证](validation.md#battle-266-window-input-retirement-validation)

<a id="battle-266-self-guard-context"></a>

### 固定 SE 的 SKL266 自身护卫与结果队列

**事实**。同一固定 SE 的等级 9、变体 2、类型 0 首次解析中，自身结果的 `0x200` 准入护卫字段。`42F5CD` 将槽 50、51 映射到 20、21，`42F5D5` 保存规范化后的护卫槽。最后保存结果进入 `42F8EF` 时，以该位决定是否走护卫分支。所选路径从同一角色表 `58FAC4` 读取施法者与护卫。 [原指令和 REA 引用](../build/analysis/battle-266-self-guard-context-v1/source-review.json)

**事实**。`42F923` 在护卫对象追加指向施法者的三字段行，第四格保留该对象该行的旧值。`42FAFC` 清本次结果标志的护卫位。`42FB16` 在施法者队列追加指向护卫的交接行，`42FB1E` 再把护卫槽发布为结果槽。`42FB61` 和 `42FB7D` 在结果对象追加两条四格行，目标分别为施法者和护卫。RID 位存在时，`436E60` 按该对象当前写游标保存前一行位置，追加两条附加行，再复制刚保存的第二条常规行。`42FBBD` 给结果对象追加动作 216。 [角色、标志和游标核验](../build/analysis/battle-266-self-guard-context-v1/source-review.json)

**静态推导**。在已证的清零短前缀帧及前序条件下，只有自身 RID 的所选护卫分支保留暂存 `+0x14` 和 `+0x3C` 的零值。三条附加行的后两格依次为「转换后的自身首字、0」「0、0」「结果数值、转换后的自身首字」。护卫与施法者同槽时，护卫、施法者等待和结果动作按原顺序写同一对象。动作 41 在所选变体前段和护卫尾部各写一次。所选原版的动作实际推进和退场时序继续待验。 [暂存与队列推演](../build/analysis/battle-266-self-guard-context-v1/source-review.json)

**本地对照**。独立护卫已有外部 RID 时，现有共享计划的三条附加行匹配原字节投影。清零帧的仅自身 RID 输入仍在规划时提前返回。同槽且无 RID 的本地方案会清护卫位并合并等待，属于现有恢复策略。D0/D4 复用角色队列，按 BF-D7 和 BF-T36 验收来源队列、实际推进和恢复。 [本地比较](../build/analysis/battle-266-self-guard-context-v1/focused-probe.json) · [完整核验范围](validation.md#battle-266-self-guard-context-validation)

<a id="battle-266-return-order"></a>

### 固定 SE 的 SKL266 返程、护卫交接与退役

**事实**。固定 `cg_se_6000.exe` SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。动作 22 在 `40C3B4` 取对施法者的整数距离，小于 60 时先处理仍处于动作 15 的施法者，再重读动作。动作 23 直接进入第二次测距。其余路径先执行施法者动画及动作推进，类别 266 在 `40C423` 清施法者的 `+0xFF0`，然后检查当前结果行的 `0x200`。 [动作表、原字节和分支](../build/analysis/battle-266-return-order-v1/source-review.json)

**事实**。护卫位命中时，`40C449`、`40C452` 依次推进施法者元组和动作。新行首格是护卫槽。`40C46C` 给同一飞行物追加 `[槽,0,0,0]`，随后追加 71、24、217。护卫此时动作非零时再前置 24。所选分支直接读取当前角色表。静态用例可传同槽身份，或让推进后的施法者停在动作 62，仍沿相同护卫位分支。 [队列与条件](../build/analysis/battle-266-return-order-v1/source-review.json)

**事实**。交接后落入 `40C4C9`，经 `40C4CE` 对施法者重新测距。小于 20 时在 `40C4F1` 再清施法者的 `+0xFF0`，只在下一动作是 216 时推进施法者，然后标记飞行物退役并请求声音 `0xD8`。本回调的移动和动画尾部仍执行。标记由对象遍历在其准入时处理实际释放。 [第二次距离与退役](../build/analysis/battle-266-return-order-v1/source-review.json)

**事实**。到达动作 217 的飞行物按当前注册护卫测距。类别 266 在小于 20 时清该护卫的 `+0xFF0`，推进其动作及飞行物元组，再设飞行物动作 21、转向施法者并将速度减半。动作 23 递增同一角色的 `+0xFF0`，超过 20 后清零并推进。 [到达和延迟规则](../build/analysis/battle-266-return-order-v1/source-review.json)

**本地对照**。现有共享回放在交接成功后跳过第二次距离检查。在固定距离 19 的用例中，共享回放保留飞行物，原指令推演已标记退役。共享入口另外要求动作 72、终止行和独立护卫。所选无护卫返程在距离 20 仍保留施法者延迟，动作 217 到达时清的是通用 `counter`。D4 沿 BF-D7、BF-T36 核对原延迟计数、队列推进和恢复。已证调度与原版仍待验的行为见下一节。 [共享回放边界](validation.md#battle-266-return-order-validation)

<a id="battle-266-relay-retirement"></a>

### 固定 SE 的护卫交接、对象摘链与角色结算

**事实**。在 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的 `cg_se_6000.exe` 中，普通战斗子状态 6 经 `438135` 调用 `409FE0`。对象在 `409FAA` 按 `+0x14` 的无符号字节排序，相同优先级保持登记次序。普通角色 `433A10` 使用 `10 × 槽 + 2`，所选飞行物 `41AB20` 使用 2。两者均登记 `40A120`，并带标志 `0x40000`。 [对象构造、遍历与原字节](../build/analysis/battle-266-relay-retirement-v1/validation.json)

**事实**。第二次测距小于 20 时，`40C501` 只在施法者的下一动作为 216 时推进一次。`40C51B` 经 `40A090` 设置飞行物的 `+0x1C`，当次声音、移动和动画尾部继续。回调返回后遍历直接读后继。下次遇到已标记飞行物时，带 `0x40000`、慢速值为 1 且相位非零时跳过，在其余合资格访问中摘链。摘链后缓存后继，依次释放非空上下文及对象，再从缓存继续遍历。相位按 0–3 循环。排队的 71、24、217 均失去本飞行物的推进。 [标记、慢速和摘链条件](../analysis/capability-first-v1/game-battle-functional-specification.json#/result_tuple_storage_lifecycle/rid_frame_266/projectile_return/relay_retirement)

**事实**。仍存活的飞行物在动作 24 会重查当前护卫槽。同槽跳过忙态检查，独立且忙时继续等待。动作 71 令护卫及飞行物各推进一次动作，保留角色元组游标。动作 217 到达所选距离时清当前护卫的 `+0xFF0` 并推进护卫动作。动作 216 则由角色回调分派到 `415027`，先保存首行的槽，再推进元组并按新行的槽解析结果接收者。所选普通结果在 `4151E9` 应用数值，尾部再推进行动和元组。 [动作表和结果调用](../build/analysis/battle-266-relay-retirement-v1/validation.json)

**推测**。在已注册的普通优先级及其余回调条件满足时，槽 0 已在飞行物前访问，同槽角色因此最早在下一次合资格遍历执行新进入的 216。槽 1–21 位于飞行物后，可在本次执行已进入的 216。独立护卫已在 216 时可由自己的回调结算，仍等待本飞行物的 71 或 217 时，则不能由已标记的飞行物解除等待。 [所选相位与角色条件推演](../build/analysis/battle-266-relay-retirement-v1/validation.json)

**本地对照**。三组 stage306 回放中，同槽与普通自身分支的动作和数值一致。标记后的飞行物在后续非零相位保持位置及状态，角色能在摘链所在遍历结算。独立护卫的回放走 71、24、217，其 216 先于飞行物最终标记结算。距离 19 的原有夹具再次复现成功交接后漏做第二次测距。D0/D4 共用 BF-D7 和 BF-T36。**待验证**。原版实际间距、完整等待恢复、角色离场或替换、跨帧暂存及当前同版。 [本机对照及回归范围](validation.md#battle-266-relay-retirement-validation)

<a id="battle-266-guard-slot-consumption"></a>

#### 护卫退场与同槽替换时的动作消费

**事实**。固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的动作 49 在 `40EA4A` 清角色槽，随后在 `40EA56` 标记旧对象退役。所选飞行物动作 24 从当前元组读槽。空槽沿 `40A6CF → 410279` 推进飞行物自己的动作，再到通常的回调尾部。有角色时走原同槽与忙态规则，合资格才复制当前角色坐标并推进。 [原指令及证据](../build/analysis/capability-batch-readiness-v1/guard-source-review.json)

**事实**。动作 71 重新从当前槽取对象，先把该指针传给 `434A30`，再推进飞行物。`434A30(NULL)` 直接返回。动作 217 分别为转向和测距读取当前槽。转向 `419E90` 对空目标直接返回，紧接的 `419FD0` 要求有效对象并直接读取坐标。有有效对象时，距离低于 20 的 SKL266 分支清当前槽中角色的计数，再依既有动作处理推进。三路均以当时槽里登记的对象为准。 [静态分支与本机对照](validation.md#battle-266-guard-slot-consumption-validation)

**待验证**。原版动作 49、原登记对象替换与飞行物回调实际重叠的帧次序，以及空槽经 217 时的运行结果。D0/D4 复用 BF-D7 与 BF-T36 核动作 24、71 的推进、217 的有效目标前提、替换对象及实际副作用。 [下一批具名写入](development-plan.md#capability-first-next-analysis)

<a id="battle-slot-publication-order"></a>

#### 场上角色的成对登记与独立退场

**事实**。固定 SE 样本 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的动作 221 和 222 分别在 `41674A` 和 `416B1A` 首次登记准备好的 B，装入 `40A120`。所核登记当处未标记旧 B。221 把新 B 的当前动作设为 1，222 设为 0。回落条件成立且 A 已有对象时，先经 `40A090` 标记当时登记的旧 A，再清槽，取准备的 A 指针并登记。两段清槽至写回分别为 `41696E` 至 `41697F` 和 `416F62` 至 `416F73`。中间各只有两条取值指令。A 原为空时，分支直接写回。 [三条分派、字节和指令核验](../build/analysis/battle-slot-publication-v1/source-review.json)

**事实与推测**。`409FE0` 在 `40A024` 调完当前对象才于 `40A029` 读取后继。按该顺序，正常对象回调在 A 换人前读旧登记，在写回后读新登记。清槽到写回的两条取值指令之间没有对象调用。动作 49 经 `40EA47` 读退场对象自己的槽号，在 `40EA4A` 直接将该槽清零，再标记对象。若不同槽的旧 B 仍在链内、未被标记且能执行 49，它在新 B 登记之前执行时会先留下空槽，在新 B 登记之后执行时会清掉新登记。 [护卫槽的消费条件](#battle-266-guard-slot-consumption) · [排程和原指令](../build/analysis/battle-slot-publication-v1/source-review.json)

**本机对照**。两个原创用例在动作 221 获得回调前，向已存在的 B 追加动作 49。A 为 0、B 为 5 时先执行登记，调换槽号后先执行退场。stage306 在两种顺序均保留新 B。D0/D4 沿 BF-D7 与 BF-T36 使用当前登记与回调顺序分别检验动作 24、71、217。**待验证**。原版实战触发该旧 B 退场组合、当前同版适用性和三端完整流程。 [实测和适用范围](validation.md#battle-slot-publication-validation)

<a id="battle-266-projectile-row"></a>

## 固定 SE 的 SKL266 普通结果如何进入投射物

**事实**。沿同一 `37c4` 样本的 SKL266 变体 2，`42F15A` 写变体，选定分支依次提交动作 24、15、41。普通外部结果仍从 `42F65B` 将当前 EDI 送入第四格。动作 15 从 `40A120` 的分派表进入，在变体 2 且动画信号为 10000 至 19999 时调用 `41AB20`，返回对象写到施法者的 `+0x10`。 [动作与投射入口](../build/analysis/battle-266-projectile-row-v1/source-review.json)

**事实**。`41AB20` 为多目标投射物分配独立上下文，保存施法者指针。分配失败返回 0。成功路径以施法者读游标定位每条结果，`41AC12` 读取第四格，`41AC23` 连同前三格提交给 `434AF0`。复制后推进父游标，到下一行的首格 −1 时结束。投射物先以动作 20 执行初始化回调，再复制技能类别、变体和等级。 [复制与初始化字节](../build/analysis/battle-266-projectile-row-v1/source-review.json)

**事实**。命中动作 21 经 `40BE1B` 调用 `41A030`。RID 后缀由结果标志位 `0x800000` 决定。该位在普通结果中为 0 时，构造与命中路径均越过后缀读取，已复制的第四格随该结果保留。 [命中调用与标志](../build/analysis/battle-266-projectile-row-v1/source-review.json)

**本地验证**。给同一共享投射入口传入当前生产的 `[12,1,3,0]` 和按源规则填入前一条外部 RID 的 `[12,1,3,100040]`，两种第四格均随原顺序复制。D4 沿已有的四格存储和复制处理生产差异。首次外部 RID 前的栈值、原版完整回放及当前版适用性仍待。 [本地核验](validation.md#battle-266-projectile-row-validation)

<a id="battle-266-source-admission"></a>

## 固定 SE 的 SKL266 变体 2 预检准入

**事实**。同一固定 SE 样本中，`436500` 按 `533E54` 的 `SKL` 项进入 `4351D0` 类型 0。类别 266 经 `43644C` 索引 149 取选择器 1，从 `436440` 分派到 `435CF2`。变体 2 先记录施法者，然后逐条记录结果角色，遇 `FF` 结束。标志 `0x800000` 置位时额外读三个 RID 字。自身结果的 `0x200` 置位时还记护卫槽。所选后接另一条 `SKL` 时，`434E60` 恢复前看游标。 [源表、指令及调用](../build/analysis/battle-266-source-admission-v1/source-review.json)

**事实与静态推导**。预检用这些计数检查角色占用。所选命令只有普通外部结果、或只有自身 RID 时，槽位条件满足即可返回 1。无前一个合并对象且有空命令槽的所选分支继续读标签，并在 `4367F1` 尝试构造。 [准入与构造核验](../build/analysis/battle-266-source-admission-v1/source-review.json)

**本地验证**。五个原创用例的角色计数与现有共享解码一致。两个仅含自身 RID 的用例分别有无护卫，现有计划均返回 `physical-family-self-RID-prior-context`。首条普通外部结果先于任何外部 RID 时，现有计划仍写第四格 0。D4 在 BF-D7 记录这两处生产边界，首次暂存的实际值、原版完整播放和当前版适用性继续取证。 [用例回执](../build/analysis/battle-266-source-admission-v1/focused-probe.json) · [验收范围](validation.md#battle-266-source-admission-validation)

<a id="legacy-item-window-admission"></a>

## 历史 Item 的鼠标事件与战斗窗口恢复

**事实**。历史 Item 样本 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。`49EC00` 在 `49EE60` 将 `4A01BD` 注册为窗口过程。输入模式 2 时，`WM_LBUTTONDOWN` 经 `56EEEE` 写 `ED560C` 的位 0，`WM_LBUTTONDBLCLK` 经 `56F067` 先写位 4，再写位 0。所选 `0xA0` 分支及 `56F37F` 清事件字。

**事实**。`483841`、`483997`、`483C1F` 的命中判断读取位 0。在各自的局部条件满足时，分别请求窗口 42、2 或 21、2 或 20。这三个局部判断的正常调用者仍待证。

**事实**。主状态 9 在 `58C9D2` 调用 `58CC52`。子状态 3 依次调用 `56CA8F`、`484EC5`，随后经 `56BB20` 到经典窗口帧循环。延后动作 3 在 `56CB2A` 检查恢复字 `CBAF5C`，合资格时请求打开另一套窗口 1，调用返回后清恢复字。`484EC5` 在计时字 `6B1690` 和恢复字均非零时发出同一打开请求，返回后清两个字。所选转换分支可先记录窗口 1 的活动状态，再清计时字并第二次进入 `484EC5`，此时走计时字为零的分支。

**事实**。`4B34C4` 从经典窗口指针序列取活动对象，按窗口 ID 选择 `CAD378` 起的 84 字节附属记录，并调用对象偏移 `+0x30`、`+0x34` 的回调。选宠和技能栏回复已用到的经典窗口 54 记录也落在这套布局中。

**待验证**。另一套 99 行窗口表的实际回调消费者、训练 55–59 和 67 的正常构造入口、工艺的活动与非活动分派、图鉴主循环入口及当前同版适用性。此次为固定历史样本的静态取证，三端与实际游戏验收待执行。 [来源和字节核验](../build/analysis/legacy-item-window-admission-v1/source-review.json) · [原训练规格](../build/analysis/legacy-item-training-ingress-v1/source-review.json)

<a id="legacy-item-normal-slot-producers"></a>

## 历史普通帧的窗口开关与恢复

**事实**。固定 Item `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9` 的主状态 9 子状态 3 和主状态 10 所选路径，在 `58D8A2`、`45C1F8` 调用 `48A650`。两处都在各自的经典帧 `56BB20` 前。该函数读取键表索引 `0x23` 的首次位 `0x04`，置位时进入 `405498`。两槽均空时请求打开第 2 组窗口 99，写主槽及该行标记。任一槽非空时调用 `56BD22(100)`，随后请求音效 `0x39`。固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的 `4523D9 → 403200` 也有这两个请求分支。 [两份原文件核验](../build/analysis/legacy-item-window-input-route-v1/source-review.json) · [Windows 键码表](https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes)

**事实**。Item 的 `56BD22(100)` 保存原副槽后清两槽。原副槽不为 1 且 Escape 首次位为 1 时调用 `56CB2A`。恢复标记 `CBAF5C` 非零时，同步请求打开窗口 1，返回后清标记。主状态 10 的打开器拒绝窗口 1，恢复标记仍按该路径清除。 [关闭与恢复指令](../build/analysis/legacy-item-window-input-route-v1/source-review.json)

**事实**。主状态 11 在 `58CA85` 进入 `484AE3`。对象指针 `6B1694` 为空且任一窗口槽非空时，先走上述 `close(100)`，再经 `484BD2` 创建本分支对象并保存返回指针。已有对象时沿复用分支。 [主状态表与调用顺序](../build/analysis/legacy-item-window-input-route-v1/source-review.json)

**待验证**。Item 的窗口 29 局部回调能先关 29 再请求打开 19，实际业务入口仍待证。普通帧对槽位的更新和同步恢复已绑定，另一套窗口表的活动与非活动回调分派、各业务正常准入及当前版适用性继续待证。 [窗口合同与待验用例](../analysis/capability-first-v1/alternate-window-contract.json) · [来源核验](validation.md#legacy-item-normal-slot-validation)

<a id="legacy-item-classic-frame-dispatch"></a>

## 历史 Item 经典窗口帧的子状态分派

**事实**。固定 Item 样本 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。`58C6B0` 从主状态表将 9、10 分别派给 `58CC52`、`45BBD8`。两者从 `11D4CD8` 取子状态，各自用有界跳转表选路。固定样本的 15 处 `56BB20` 直接调用均位于这两个函数。`56BB20` 先处理其工作上下文解除条件，再调用经典帧 `4B34C4`。 [调用点与表项核验](../build/analysis/legacy-item-frame-dispatch-v1/source-review.json)

| 主状态与子状态 | 选定调用顺序 |
| --- | --- |
| 9 的 3、20、250、251 | 20 先写子状态 3 并落入同帧。四条路径均先检查 End，再更新经典窗口，最后调用含工作计时的 `489A8A`。3、20 在 End 前还处理延后动作和恢复请求。 |
| 9 的 11、204、205 | 11、205 的工作时钟入口先执行。204 在 `591192` 返回 1 时先清槽并更新经典窗口，随后检查 End；其他返回值直接走 End 检查。205 的所选过渡分支沿同一 204 尾部。 |
| 9 的 252 | 同一次状态处理依次执行两组图形对象遍历与经典窗口帧，中间处理绘制列表、重采帧时钟并清绘制计数。见[恢复帧的两次更新](#legacy-item-double-window-frame)。 |
| 10 的 1 | `591192` 返回 1 时先检查 End，经 `45BEE4` 更新经典窗口，再到共同尾部 `45BF1D` 检查 End。其他返回值经 `45BF0E` 更新窗口，再走共同尾部。 |
| 10 的 4、5、6 | 先检查 End，再更新经典窗口，然后直接调用 `489AD7` 执行工作时钟。 |

**规格**。D0 按所处主状态与子状态执行对应序列。D3 共用窗口、输入及工作时钟所有者，按分支验证单次、重复和跳过更新，以及每次检查时的活动槽。**待验证**。另一套 99 行表的实际回调消费者、相应业务准入、当前同版和三端运行。 [经典图鉴入口](#legacy-item-classic-album-ingress) · [共用合同](../analysis/capability-first-v1/alternate-window-contract.json) · [复核范围](validation.md#legacy-item-classic-frame-dispatch-validation)

<a id="legacy-item-double-window-frame"></a>

### 历史 Item 的恢复帧内两次经典窗口更新

**事实**。固定 Item 在主状态 9、子状态 252 经 `58D37E` 重建经典窗口，再于 `58D3D3 → 40F15E` 和 `58D3EC → 56BB20` 依次推进对象、处理窗口。中间调用 `58D3FB → 593524` 读取 `1200D18` 的绘制索引与 `1204D18` 的计数。调用前后将 `1220D68` 分别置 0、1。所选设备检查提前返回时，父级仍置 1 并继续。随后 `58D40A` 重新采样 `GetTickCount`，按无符号值转换并写帧时钟 `7C5170`。清绘制计数、`7C4160` 及 `6B4148` 的六个暂存字后，`58D440` 与 `58D454` 执行第二次对象和窗口更新。返回前发布子状态 20。 [样本身份、跳转表及指令](../build/analysis/legacy-item-double-window-frame-v1/source-review.json)

**事实**。两遍经典更新各自先检查工作上下文，再整理活动表、处理控件，最后调 `517E95` 读取所选键位和活动槽。外层 `48733E` 在状态分派返回后才于 `4874C7` 按条件清指针事件，并于 `4874E9` 清键盘事件。工作解除由 `56BB20` 在当前上下文非零且剩余时长小于等于零时发起，调用返回后清标记并按条件重查配方。重建本身也能先解除工作上下文。 [输入与调用顺序](../build/analysis/legacy-item-double-window-frame-v1/source-review.json) · [重建和解除](#legacy-item-classic-window-reentry)

**推导**。第一遍经典帧新排入的过渡对象，若到第二遍仍合资格，可在同一轮推进一次。若过渡在进入第一次遍历前计数为 9，两遍合资格推进后在第二次尝试创建。计数为 10 时在第一次尝试创建并标记，第二次合资格遍历可回收该对象。第二遍的活动表整理也能消费第一遍留下的窗口关闭标记。图鉴按 SF-A27 用首次按下位仍有效的 D 或 Y 核对两种结果。若第一遍只登记延后请求且第二遍仍读到空活动槽，可再次登记。若分配回退已经同步建窗，第二遍可标记该窗关闭。两遍都读取调用时的输入与槽。 [延迟创建](#legacy-item-classic-open-transition) · [图鉴键位及准入](#legacy-item-classic-album-ingress)

**规格**。D0 在现有运行时和时钟所有者保留一轮内的对象、窗口、绘制和输入清理顺序，D2 在尾部发布状态，D3 让训练、工艺和图鉴引用同一规格，各自沿业务准入验收。工艺用例从重建后当前上下文开始，覆盖重建已解除、首次检查解除及仍有时长。**待验证**。实际恢复帧、另一套窗口分派、当前同版和三端产品。 [共用规格](../analysis/capability-first-v1/alternate-window-contract.json#/item_classic_frame_dispatch/double_window_update) · [本机对照](validation.md#legacy-item-double-window-frame-validation)

<a id="legacy-item-classic-callback-order"></a>

### 历史 Item 的经典窗口创建、回调与关闭

**事实**。同一固定 Item 映像中，`4AF678` 从 `5F1568` 取描述符，将其 `+0x24`、`+0x28`、`+0x2C` 的函数分别装入窗口对象 `+0x30`、`+0x34`、`+0x38`。新建成功分支在 `4AFE82` 先写活动指针表，临时把当前窗口指针指向新对象，再以 `-1` 调用其 `+0x30`。返回后恢复原当前指针，在 `4AFF1D` 发布附属记录 `+0x0C`。 [创建指令与四个描述符](../build/analysis/legacy-item-classic-callback-order-v1/source-review.json)

**事实**。`4B34C4` 先处理当前输入模式，再经 `4B268D` 整理 `CA525C` 的 68 格指针表。空格由之后首个非空格补入。对象带 `0x8000` 时先调用 `4AF2C5`，再移走指针并重新处理该位置。退役函数先执行对象 `+0x38` 回调，再清附属记录的活动指针，释放控件和对象。带 `0x2000` 的活动对象按有符号 `+0x08` 值向前插入，遇相等值也越过前项，随后清标记。其余活动对象沿原列表处理。 [整理与退役](../build/analysis/legacy-item-classic-callback-order-v1/source-review.json)

**事实**。普通帧以 1 作为首个 `+0x30` 回调的输入值。每个窗口先经 `4B1E1D` 取窗口命中或拖动结果，再调 `+0x30` 并保存返回值。随后遍历 36 字节控件记录，仅在 `+0x18` 等于 1 时调用 `4B2816`。先前的命中或拖动结果非零时，控件遍历完成后把传给 `+0x34` 的值清为零。`+0x34` 的返回值传给下一个窗口的 `+0x30`。所选普通点击可为对象置 `0x2000`，下一次列表整理消费该标记。 [命中、控件和回调顺序](../build/analysis/legacy-item-classic-callback-order-v1/source-review.json)

**事实**。所选 `Q?m` 训练关闭消息在活动模式和角色匹配后，从 `579EFA` 调用 `4B0C9D(3)`。扫描读取 `5C4A48 + 窗口 ID` 的组字节，匹配掩码时同步调用同一个退役函数，然后清该格。训练窗 37、52、54 的组字节为 2，工艺窗 10 为 4。后者在这条扫描中保留。 [收包入口、组字节与调用](../build/analysis/legacy-item-classic-callback-order-v1/source-review.json)

**待验证**。回调重入时的实际运行效果、另一套窗口表的活动和非活动分派及当前版适用性。D0/D3 共用列表、启动回调、输入传递和退役用例。 [验收范围](validation.md#legacy-item-classic-callback-order-validation)

<a id="legacy-classic-dialog-frame-hook"></a>

### 两版经典对话的帧钩子、治疗提示与退役

**事实**。固定 SE 的 `4910E7 → 48F0A0` 将治疗帧函数 `490B80` 保存到 `C1E868`，控件动作仍由 `4903E0` 处理。固定 Item 的 `4E6D5A → 4E4398` 将 `4E657D` 保存到 `CBBA30`，控件动作使用 `4E5B46`。两版所选普通文本、双栏输入及图形确认传入空帧钩子。Item 另一个构造器 `4E426B` 从同一参数位置写入钩子槽并请求窗口 36。两份 PE 的完整 SHA-256、偏移、REA 6.7.0 及 Ghidra 12.1.4 记录见来源核验。 [调用者、写入及原字节](../build/analysis/legacy-window-dispatch-gates-v1/source-review.json)

**事实**。经典帧入口 SE `46AB90` 和 Item `4B34C4` 先调用窗口的 `+0x30`，再读取控件的当前参与值，最后调用 `+0x34`。所选对话帧在已初始化且置 `0x8000` 时提前返回。其余合资格分支以当前窗口、提示条件、显示行和所选行调用非空帧钩子。治疗函数返回零，继续本帧绘制。通用分支在钩子返回非零时标记待退役并清初始化标记，随后继续绘制尾部。实际回收沿窗口整理或同步关闭入口。 [回调和退役规则](../analysis/capability-first-v1/window-engine-contract.json#/classic_dialog_frame_hook)

**事实**。治疗帧绘制费用、伤势图形和实时金币。满足取消条件时先写取消提示，后续合资格的单人或全部选择按伤势是否为零改写提示。空行或越界行保留此前提示。SE 写 `C5F878`，Item 写 `ED5358`。所选回复由控件动作入口产生。 [提示来源与治疗用例](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/classic_dialog_frame_hook)

**事实**。两版窗口 36、37 分别共用各自的 19 项描述符。索引 18 的原记录类型、宽度、参与值均为零，回调字为 1。所选初始化的按钮写入覆盖 0–5，输入分支可写 7，图形循环覆盖 8–17。关闭保护清 0–18。外层读取运行控件 `+0x18`，仅等于 1 时分派。**推测**。沿上述初始化、治疗钩子及关闭路径，末项保持禁用。**待验证**。其它会改变参与值的具体写入、另一套窗口的分派及当前同版适用性。 [描述符、循环和原字节](../build/analysis/legacy-window-dispatch-gates-v1/source-review.json)

**本地对照**。现有核心已输出治疗行、汇总及实时金币，选择和取消会生成原格式请求并清本地页面。D0/D3 在现有窗口与对话所有者补选择提示和帧退役顺序，复用现有编解码。 [本地结果](validation.md#legacy-classic-dialog-frame-hook-validation)

<a id="legacy-item-classic-open-transition"></a>

### 历史 Item 经典窗口的延迟打开与同步回退

**事实**。固定 Item 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。`4B5D64` 先读经典活动指针，非空时标记旧对象 `0x8000` 并取旧位置，空时取保存位置。`4B5B8E` 申请 800 字节的类型 3 图形对象和 36 字节附属块，登记窗口号与回调 `4B5AC0`。分配失败时清除调用方提供的过渡输出槽，立即调用 `4AF678` 并返回 0。实际活动窗口从经典槽读取。 [请求、分配及回退证据](../build/analysis/legacy-item-classic-open-transition-v1/source-review.json)

**事实**。`40EF57` 将对象插入首个类型字节大于请求值的节点前，连续入队的类型 3 对象按申请顺序遍历。所选主状态 9 子状态 3、主状态 10 子状态 5 都先更新图形对象，再处理经典窗口帧。控件与帧末快捷键提交的成功请求从下一次对象更新开始。`4B5AC0` 从计数 0 开始，先提交矩形并更新尺寸，第 11 次回调进入经典创建器，再标记回收并清除调用方提供的过渡输出槽。`40F15E` 在后续合资格的遍历中摘除节点，先释放附属块，再释放对象。 [帧与计数来源](../build/analysis/legacy-item-classic-open-transition-v1/source-review.json)

**事实与推导**。经典创建器先按组关闭，再查同号实例。工艺窗 10 的组字节为 4，图鉴窗 19、20 为 1，训练窗 37、52、54 为 2。组 1 先按掩码 2 关闭，组 2 先按掩码 3 关闭。两次同号过渡均到达创建器、首次已建成且中间无其他变更时，工艺和图鉴的第二次创建复用同号实例，训练的第二次创建先同步退役首次实例，随后尝试新建。仅有过渡对象时，经典组关闭扫描仍为空。图形清理入口 `40F2C9` 则可将过渡对象标记回收。 [组字节、掩码与退役](../build/analysis/legacy-item-classic-open-transition-v1/source-review.json)

**规格**。D0/D3 用以下同一组用例验收 X02 的经典窗口规则，以及 G12、G18、G19 的接入。各业务在此基础上验证自己的入口、资料和结果。预期来自固定 Item 的已核路径。 [帧分派](#legacy-item-classic-frame-dispatch) · [关闭与退役](#legacy-item-classic-callback-order)

| 用例输入 | 可观察结果 |
| --- | --- |
| 在状态 9/3 或 10/5 所选路径中，普通控件或帧末快捷键成功登记过渡 | 从下一次图形对象更新开始计数。第 11 次合资格回调尝试创建，随后标记回收并清过渡输出槽。实际活动实例由经典槽发布。 |
| 两个同号请求已登记，首次创建成功，其间无外部变更或退役 | 工艺 10、图鉴 19/20 的第二次创建复用实例。训练 37/52/54 先按掩码 3 同步退役首次实例，再尝试创建。 |
| 无法分配过渡对象或附属块 | 清过渡输出槽，立即尝试创建并返回空过渡指针。已有窗口若在请求时被标记，仍按经典退役顺序处理。 |
| 只有过渡对象时收到经典组关闭，或另由图形清理标记该对象 | 经典组关闭只扫描已经发布的实例。图形清理标记过渡对象后，后续合资格遍历先释放附属块，再释放对象。 |

**共用验收**。在 `9/252` 重建返回后，令两个已登记的同号过渡按申请顺序进入第一遍，起始计数分别为 10 和 9。第一遍成功创建窗口后标记首个过渡，第二个推进到 10。中间的经典帧若保留首个活动窗口，第二遍会回收已标记的过渡，再让第二个过渡尝试创建。所选工艺、图鉴保留首个活动窗口，训练先同步退役再尝试新建。该次序是固定 Item 静态规则的组合预期。D0 沿 `SD-CASE-09` 至 `SD-CASE-11` 共用过渡输入和断言，D3 以 `OS-A24`、`WK-T23`、`SF-A27` 分别核对训练等待、工艺解除和图鉴选择。 [恢复帧的两遍更新](#legacy-item-double-window-frame) · [开发批次与用例引用](../analysis/capability-first-v1/implementation-plan.json#/execution_review/next_analysis_group)

**待验证**。这些用例尚待实际运行。另一套窗口的正常帧分派、当前版本适用性和三端接受继续沿各能力复核。 [验收范围](validation.md#legacy-item-classic-open-transition-validation)

<a id="legacy-item-alternate-window-graphics"></a>

### 历史 Item 第二套窗口的图形就绪与退役

**事实**。固定 Item SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。`5F1F58` 的 99 行中，97 个非空回调在各自函数体内都有指向 `56A1C2` 的直接调用，含训练 55–59、67、图鉴 23/24 和工作窗 19、25、26、28、31、33、38、39。辅助函数按描述符 `+0x10` 查行。活动且行缓存为空时，它用无符号小于 1000 的样式原值或 `-2` 调用 `56C20F`，保存结果，再播放音效并调用可选初始化，最后重读缓存。分配失败也沿该次序。 [表项、调用和指令核验](../build/analysis/legacy-item-alternate-window-graphics-v1/source-review.json)

**事实与推导**。`56C20F` 把图形回调 `56C47F` 写入类型 3 对象的 `+0x08`，由 `40F15E` 的对象遍历调用。新对象的计数和逻辑值为 0。在分配成功、回调持续合资格且期间没有其他写入或退役时，第 11 次回调切换图形阶段，第 12 次发布逻辑值 1。辅助函数通过 `406391` 读取对象 `+0x170` 对应的逻辑值，大于 0 时继续处理命中。固定 SE 的对应规则已有独立核验。 [Item 来源](../build/analysis/legacy-item-alternate-window-graphics-v1/source-review.json) · [SE 来源](../analysis/capability-first-v1/game-graphics-lifetime-contract.json)

**规格**。非活动调用先标记缓存对象退役并清指针。行标记非零时清字节并返回 2，后续标记为零时返回 0。图形遍历在之后符合条件时回收。D0/D3 共用回调次数、分配失败与初始化、一次性退役结果用例。**待验证**。从普通业务帧进入表回调及活动参数的来源、各业务准入、当前版本和实际平台运行继续待证。 [共用规格](../analysis/capability-first-v1/alternate-window-contract.json) · [核验范围](validation.md#legacy-item-alternate-window-graphics-validation)

<a id="alternate-window-selection-and-cleanup"></a>

### 第二套窗口的槽位查询、缓存切换与退役

**事实**。固定 Item 的 `56BEA4` 与固定 SE 的 `4EA6B0` 查询槽是否有值。参数 2 检查任一槽。`56BFFE` 和 `4EA6F0` 按登记 ID 的组比较当前槽，第 2 组查主槽。Item 的 End 动作和状态 11 的首次提示使用占用查询，窗口 1 恢复标记及图鉴工具栏使用按 ID 查询。Item 的 `56C078` 另外要求行缓存存在，图形的有符号逻辑值至少为 1。`56BEE2(2)` 在主槽非零时只检查主槽，主槽为空才检查副槽。两个就绪函数的普通调用者继续待证。 [两版身份、函数和原字节](../build/analysis/legacy-item-alternate-dispatch-v1/source-review.json)

**事实**。`56C15A` 和 `4EA740` 依据缓存指针请求打开或关闭。打开请求后返回 1，缓存仍在时请求关闭和音效后返回 0。Item 的关闭分支二次读取缓存，读到空值时返回 −1。两版第 2 组主槽命中时，关闭会清两槽并按条件恢复，最后返回 0。主槽失配后按组索引读相邻资料字，匹配时有写零分支。行缓存继续由非活动回调处理。Item 的 97 个表回调均从 `[EBP+8]` 取值作为 `56A1C2` 的首参。共同函数在非活动时先标记并清缓存，再按行标记返回一次 2。关闭按钮产生请求的活动调用仍可返回 1。 [窗口合同](../analysis/capability-first-v1/alternate-window-contract.json#/alternate_window_selection_and_cleanup)

**事实**。两版训练窗 55、56、57 的初始化分别写同一预览指针，Item 为 `ED42B0`，SE 为 `C5E9F8`。58、59 各有独立指针。55–59 与 67 收到共同函数返回 2 时都将活动模式置 −1。55–59 读取当时的预览指针并在非空时标记回收、清指针。58、59 随后请求音效 `0x39`。**推导**。新旧窗之间交换初始化和清理顺序时，旧窗可能清掉新窗刚发布的预览。 [训练写入和用例](../analysis/capability-first-v1/game-training-services-contract.json#/legacy_item_producer_evidence)

**事实**。Item 工艺窗 29、30 在各自的非活动清理中请求关闭对方，已有主槽 19 时仍按当时的窗口 ID 检查。两版图鉴详情 24 先写恢复标记再请求列表 23。列表缓存为空时初始化器按标记计算页，缓存仍在时跳过初始化。24 非活动返回 2 时先请求保存，再标记并清详情预览。 [工艺与图鉴用例](validation.md#alternate-window-selection-and-cleanup-validation)

**待验证**。普通帧如何读取 99 行表的回调列、由何处提供活动参数、各业务的实际调用顺序、当前同版及三端运行。D0/D3 复用既有训练编解码与工艺所有者，沿共用窗口合同补这些边界。 [待证入口与排程](development-plan.md#capability-first-scheduling)

<a id="item-alternate-dispatch-candidates"></a>

#### 固定 Item 三个窗口候选的用途

**事实**。固定 `cg_item_6000.exe` 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。`5F1668` 为经典窗 64 取描述符 `5C4988`。描述符 `+0x20` 指向控件 `5F0330`，经典构造从 32 字节原记录准备 36 字节运行记录，类型 3 从原记录 `+0x18` 取明细。明细内 `5F0324` 的 4 字节指针指向 `5F1F44` 的 NUL 结尾文本。第二套表从 20 字节后的 `5F1F58` 开始，`56C1F6` 所选引用读取每条起始的窗口 ID。 [文件偏移、表及指令](../build/analysis/item-alternate-candidate-review-v1/source-review.json)

**事实**。窗 5 的局部处理将控件基址 `ED44D8` 和条数 18 传给 `56A0A5`。所选命中含 `0x10` 且控件 `+0x1C` 非空时，`56A14E` 以 40 字节步长索引并调用。索引 9 的启动赋值写入 `5622DA`。`56A3A1` 则出现在共同助手 `56A1C2` 内，活动初建尝试写缓存和请求音效后调用第三个栈参数，随后重读缓存。登记窗 55 的 `5288F9` 传入初始化器 `5288CB`。 [局部调用与初始化值](../build/analysis/item-alternate-candidate-review-v1/source-review.json#/candidate_roles)

**事实**。训练 55–59、67，工艺和背包 14、19、29、30，图鉴 23、24 都从各自回调的 `[EBP+8]` 直接把活动首参传给 `56A1C2`。其为零时走非活动清缓存及一次性退役。**待验证**。普通帧的外层调用点、首参实际值和新旧窗顺序。继续取证以可绑定该表的正向调用点、同一样本的运行记录或可配对模块为准，沿 OS-A26、WK-T27、SF-A28 核各次创建与退役。 [共用规格和恢复条件](../analysis/capability-first-v1/alternate-window-contract.json#/alternate_window_selection_and_cleanup/item_dispatch_candidates) · [本机核验](validation.md#item-alternate-dispatch-candidates-validation)

<a id="alternate-window-focus-slots"></a>

### 第二套窗口的文本焦点与槽位交接

**事实**。固定 Item `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9` 的 `56B84C` 比较 `[6ACD10]` 与默认文本目标 `6ACBB0`。固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的 `4EA190` 对应比较 `[60FF08]` 与 `60FDA8`。两版各有六处先做这项比较。焦点为默认目标时跳过筛选，其余情况调用 `56BE45` 或 `4EA660`，清除与指定 ID 不同的主副槽。ID 32、22、15、16、6 随后请求打开对应窗口。窗口 2 的所选分支随后将本窗保存的文本目标写入全局焦点。筛选的返回值没有参与后续分派。 [两版调用及原字节](../build/analysis/alternate-window-focus-slots-v1/source-review.json)

**事实**。Item 启动表 `5C9084` 经 `5614A1 → 5614AB`，在 `56196B` 将 `5622DA` 写入窗口 5 第 10 个控件的 `+0x1C`。所选活动路径在 `561E3E` 调用 `56A0A5`，以 18 个控件为扫描上限。命中结果含 `0x10` 且该记录回调非空时，经 `56A14E` 调用。`5622DA` 请求打开窗口 6 后返回 0，扫描进入下一条记录。窗口 21 的合资格索引 0 路径经 `55B49B` 调用 `55B5D9`。 [局部注册与分派](../build/analysis/alternate-window-focus-slots-v1/source-review.json)

**规格**。D0/D3 以同一组用例核对默认焦点保留原槽、其他焦点先清不匹配槽、筛选后单独发布文本焦点，以及请求打开后继续控件扫描。活动槽更新和图形退役沿各自的回调顺序。**待验证**。普通业务帧如何调用 99 行表并给出活动参数、训练六个构造入口的正常调用、当前同版及实际平台结果。 [共用规格](../analysis/capability-first-v1/alternate-window-contract.json) · [核验范围](validation.md#alternate-window-focus-slots-validation)

<a id="legacy-item-work-retirement"></a>

## 历史 Item 的工作窗口非活动清理

**事实**。固定 Item 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。经典窗口 10 的描述符 `5C3FC8` 在控件索引 6 绑定 `4BCED0`。其选定启用分支调用 `+5D` 的 61 动作，随后将共享上下文字节 `67F580` 置 1。另一套窗口 31 的两条选定 `+>L` 请求路径在调用发送函数后将一次性标记 `ED42A0` 置 1。 [控件表及发送入口](../build/analysis/legacy-item-work-retirement-v1/source-review.json)

**事实**。另一套表 `5F1F58` 的八个工作窗口均调用 `56A1C2`。非活动输入为 0 时，若当前表行有图形对象，共同函数先标记回收并清指针。表行标记非零时清标记并返回 2，下一次标记仍为零时返回 0。八个回调根据该返回值执行各自的非活动清理。 [共同函数及回调位置](../build/analysis/legacy-item-work-retirement-v1/source-review.json)

**事实**。八个回调读取主槽 `CBD738`，窗口 19 和 31 还读取副槽 `CBD73C`。各回调保留或解除工作上下文的条件如下。

| 窗口 | 活动槽条件 | 该条件下的上下文效果 |
| --- | --- | --- |
| 19 | 主槽为 25、29、34、38，或副槽为 31 | 保留 |
| 25 | 主槽为 19 或 26 | 保留 |
| 26 | 主槽为 25 | 保留 |
| 31 | 主槽为 19 或副槽为 32 | 保留 |
| 38 | 主槽为 19 | 保留 |
| 28、33、39 | 主槽分别为 25 或 29、31、38 | 有符号剩余毫秒 `11C9074` 大于 0 时保留。剩余为 0 或负数时发解除请求，随后清上下文字节 |

**事实**。活动槽不满足表列条件时，19、26、31、38 先检查 `ED42A0`。非零时只清该标记，零时依 `67F580` 的非零状态发送解除请求。25、28、33、39 在其余分支直接查 `67F580`。解除请求沿既有 `+5D` 的 62 动作，发送调用后清上下文字节。26、28、31、33、38、39 的局部对象仍分别标记回收并清指针。26 随后请求关闭窗口 27。 [各分支与收尾](../build/analysis/legacy-item-work-retirement-v1/source-review.json)

**待验证**。外层正常帧如何向另一套回调传活动状态，以及真实关闭重入和当前版本适用性。D0/D3 复用既有工作上下文和请求字段，按来源补齐这一组退役条件。 [工作规格](../analysis/capability-first-v1/game-work-functional-specification.json) · [核验](validation.md#legacy-item-work-retirement-validation)

<a id="legacy-item-work-window-pair"></a>

### 历史 Item 的工艺窗口配对与副槽退役

**事实**。固定 Item 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。表 `5F1F58` 的窗口 19、25、29 属于主槽，窗口 1、30 属于副槽。窗口 19 的回调 `564E93` 在所选活动分支检查选中项索引 `[EBP-4]` 非负、业务行标志等于 1，以及事件 `ED560C` 的位 0。业务行用独立的 `[EBP-0x198]` 和步长 `0x49FC` 定位，标志与分流字的基址分别为 `1123B08` 和 `1123B0C`。通过后保存选择低字节、清 `ED4364`，并用初值为 19 的字段 `5FB0E8` 请求关闭。分流字等于 255 时依次请求打开 29、30，其余值请求打开 25。 [表行与所选分支](../build/analysis/legacy-item-work-window-pair-v1/source-review.json)

**事实**。窗口 29 的回调 `56E0BF` 在所选命中分支先按初值为 29 的字段 `603748` 请求关闭，再请求打开 19。此处两个操作都使用主槽。另一个分支在共同函数 `56A1C2` 返回 2 后，先处理 `ED5304` 的局部对象，再于 `56E320` 请求关闭窗口 30。非活动输入下，表行标记非零才消费该标记并返回 2。 [返回和非活动分支](../build/analysis/legacy-item-work-window-pair-v1/source-review.json)

**推导**。沿所选调用顺序，槽位从 `(19, 0)` 变为 `(29, 30)`，返回时为 `(19, 30)`，之后窗口 29 的非活动清理才请求关闭副槽 30。若打开 30 前的副槽是 1 且恢复标记原为零，打开器保存恢复标记。关闭 30 时同步请求恢复 1，随后清标记。主状态 10 拒绝打开 1，此时副槽保持为空。 [槽位和恢复条件](../build/analysis/legacy-item-work-window-pair-v1/source-review.json)

**待验证**。外层帧实际传入活动与非活动的次序，训练与图鉴的对应分派，以及当前同版适用性。D0/D3 将主槽返回和后续副槽退役作为两次操作验收。 [核验范围](validation.md#legacy-item-work-window-pair-validation)

<a id="legacy-work-context-frame-order"></a>

## 固定 Item 与 SE 的工作上下文到期顺序

**事实**。Item `580169 → 577FC4` 处理 `Xz@` 的秒数与模式。门槛字 `9C1D38` 为零时，负秒数取零，乘 1000 后存低 32 位到 `11C9074`，另存模式和 `GetTickCount` 样本。`489AD7` 在主状态 9 额外检查 `11D4414`，主状态 10 直接取样。模式非零时扣除经过的计数。结果为负则将时长及模式清零，恰好为零时保留模式。 [回包和计时来源](../build/analysis/legacy-work-context-frame-order-v1/source-review.json)

**事实**。Item `56BB20` 在上下文字节非零且有符号剩余毫秒小于等于零时发送 `+5D` 动作 62，返回后清该字节、将 `ED41C7` 的低字节减一，再进 `4BB6F4` 检查所选配方的上下文。所选配方归属与当前状态不同且窗口条件成立时，经 `'<4` 查询，解除后的参数是普通槽号。随后处理经典窗口回调。 [解除及配方查询](../build/analysis/legacy-work-context-frame-order-v1/source-review.json)

**事实**。Item 主状态 9 子状态 3 的 `58D8AC`、主状态 10 所选分支的 `45C21B`，均在后面的 `58D8C0`、`45C22A` 计时调用前执行解除检查。固定 SE 主状态 10 子状态 5 的 `438080` 和 `43808F` 也是这个顺序。**推测**。这次扣时把剩余 1 毫秒扣到零时，在无其他写入的条件下，解除最早由下一次符合条件的检查发出。 [两版调用和原文件字节](../build/analysis/legacy-work-context-frame-order-v1/source-review.json)

**事实**。现有共享运行时用本机夹具在一次更新内把剩余 1 毫秒扣到零，同时生成动作 62 及普通槽配方查询。D0/D3 以两份固定样本的所选帧为依据记录差异。**待验证**。另一套窗口的帧分派、当前版本适用性和实际设备验收。 [本机实测](validation.md#legacy-work-context-frame-order-validation)

<a id="fixed-se-work-context-publication"></a>

### 固定 SE 的工作资料发布、计时与解除

**事实**。固定 SE 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`F8%` 进入 `4F0000`，共用门槛字为零且掩码选中 `0x8001` 中任一位时，将紧凑字段 15 写入 `F53538`。位未选时保留原字段。`Xz@` 经 `4F2AE0` 发布剩余毫秒、模式和系统时钟样本，并清除已证聊天抑制标记。两条回复在状态分派前处理。模式非零时计时更新使用 32 位有符号结果。恰零保留模式，负结果清剩余量和模式。 [原文件偏移、字节及工具](../build/analysis/fixed-se-work-context-publication-v1/validation.json)

**事实**。固定 SE 的普通 `9/3` 先由 `5024F8` 进 `4EA400`，随后 `502507 → 451BA0 → 451BE0` 推进计时。战斗 `10/5` 在 `438080` 和 `43808F` 保持同序。活动上下文且剩余量小于等于零时，经典检查发 `+5D` 动作 62，清活动位、扣工作占用字节，并在活动配方归属失配时用 `'<4` 重查普通槽。**推测**。若首次扣到零且没有其他写入，下一次符合条件的经典检查才解除。 [共用 WK-T23](../analysis/capability-first-v1/game-work-functional-specification.json#/fixed_se_work_context_publication)

**事实**。另一套背包 14 的 `4E12C0` 在活动处理时还读取 `F53538`。上下文活动时，资料为零或剩余量小于等于零均触发 62。随后清活动位、标记并清旧预览，沿当前人物图形尝试新建。所选分支只执行这组解除和预览动作，经典计数与配方仍沿经典路径处理。非活动返回 2 的分支清普通选择并退役已有预览。 [两种回调及预览复用](../analysis/capability-first-v1/game-work-functional-specification.json#/fixed_se_work_context_publication/facts)

**待验证**。另一套背包回调的实际普通调度位置、与经典检查的相对顺序及当前同版和三端执行。D0/D2/D3 共用既有解码、时钟及请求格式，按跨帧归属、配方、预览和直接放置用例落实接线差异。 [本机规格对照](validation.md#fixed-se-work-context-publication-validation)

<a id="fixed-se-work-slot-seven"></a>

### 固定 SE 的槽 7 占用及工作中物品交换

**事实**。固定 SE SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。装备槽 7 的占用就是 `C5E94C` 起 28 字节表的第八字节 `C5E953`。经典启停动作在 `472044` 加一或减一，经典到期和最后持有者退役也减一。第二套技能与背包已核的局部开关分支只写活动位及各自状态。动作 81 的所选本地参与分支先在活动时清工作并扣槽 7，再把八个装备占用各加一。 [固定来源和原字节](../build/analysis/fixed-se-work-slot-seven-v1/validation.json)

**事实**。`@Y)` 先换两端活体。活动制造窗的材料换入装备时先清已选位置、扣旧背包槽的材料引用。随后 `47F29E` 调 `4707C0`，若仍活动且一端是槽 7，就加槽 7、减另一端，再交换两个字节。占用运算按低八位保存。经典装备扫描用占用是否为零决定参与。另一套背包的所选直接放置在活动时排除槽 7，回包仍沿自己的准入处理。 [制造和交易共用规格](../analysis/capability-first-v1/game-work-functional-specification.json#/fixed_se_work_slot_seven)

**推测**。在其他计数不变且经典确实办理一次解除时，交换回包先到与解除先执行可得到不同的两个占用值。制造材料实际移除时，先从被释放的背包端扣一份，再换位。该位置在所选制造到期发送中省略。**待验证**。原版实际帧的回包时机、第二套窗口的普通调用，以及当前同版、三端和真机用例。 [结果式、边界和 WK-T08/WK-T23](../analysis/capability-first-v1/game-work-functional-specification.json#/fixed_se_work_slot_seven/conditional_results)

<a id="legacy-item-classic-work-recipe"></a>

## 历史 Item 经典工艺的打开、配方与关闭

**事实**。固定 Item 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。普通经典帧的工具栏 6 控件 2 与帧末快捷键共用 `4BBC3F` 的打开入口。快捷键要求按住 Ctrl，键位 0 读 E，键位 1 读 W，均要求技能键的首次按下位。主状态 10 的三个所选分支转入 `4DDCC3`。满足普通条件后读取 `CAD6CC`。窗口 10 未活动时将 `ED3924` 置 0 并提交创建请求。已活动时设置退役位 `0x8000`。创建回调 `4BBE0F(-1)` 清滚动值，模式 0 初始化技能列表。 [普通帧与窗口](../build/analysis/legacy-item-classic-work-recipe-v1/source-review.json) · [快捷键与主状态核验](#legacy-se-classic-work-entry)

**事实**。活动窗 10 的十行控件 17–26 初始使用 `4BD7E2`，按滚动位置和排序表选择有记录的技能。普通技能选择经 `4BB09D` 发布技能槽、进入模式 1，再把十行的回调改为 `4BDC90`。等级点击要求名称首字节非零、可选字段非零，等级序号为控件号减 17。普通制造分支（kind 1，技能 ID 非 255）先比较配方归属与当前工作上下文的非零状态。两者不一致时调用 `'<4`，参数为技能槽加 `100 × bool(上下文)`。随后发布等级，进入模式 2 并安装配方回调 `4BE585`。配方回调再次检查归属和有效行，归属失配时直接返回。 [控件改写、查询与资格](../build/analysis/legacy-item-classic-work-recipe-v1/source-review.json)

**事实**。普通配方回复 `@_i` 在 `580103` 调用 `577B81`。收包门槛 `9C1D38` 为零时，先把此刻 `67F580` 的有符号字节保存到回包技能槽 `+0x49F8`，再按 56 条配方处理。经典窗口退役时，模式 1 和 2 先走 `4BACE0`。计数减至 0 且上下文仍启用时，请求 `+5D` 动作 62，返回后清上下文，再按窗口和配方状态检查重查条件。模式 2 可在活动指针清除前按普通槽重查，随后完成计数字节和窗口清理。 [收包与退役证据](../build/analysis/legacy-item-classic-work-recipe-v1/source-review.json)

**规格**。D0/D3 共用已有窗口、配方和工作上下文所有者，按打开与标记退役、首次按键与按住、有效等级与禁用等级、归属一致与失配、最后一个窗口关闭等用例验收。**待验证**。另一套工作窗的实际帧分派、现行版本适用性和三端运行。 [核验范围](validation.md#legacy-item-classic-work-recipe-validation)

<a id="legacy-se-classic-work-entry"></a>

## 固定 SE 经典技能窗的普通操作与战斗入口

**事实**。固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的工具栏 6 控件 2 经 `46A6AC` 检查点击位 `0x02`。帧尾 `4B4170` 在所选布局下检查 Ctrl 的 `0x02` 和 E 或 W 的 `0x04`。普通条件下，两条入口都读取窗 10 的活动槽。空槽经 `471110` 先清模式和选择回调再提交创建。已有窗时标记 `0x8000` 并请求音效 `0x39`。创建复用原过渡、同步回退和发布活动指针的顺序。**推测**。同帧两个输入分别读取当时活动槽，按是否同步发布或仍处于过渡决定是标记关窗，还是再提交一次打开。 [原指令、表项和调用](../build/analysis/legacy-se-classic-work-entry-v1/source-review.json)

**事实**。新窗的 `4712A0(-1)` 在模式 0 清滚动并接 `470820`。显示回调在十行可见范围内按当前排序表投影。`472610` 先查对应排序行是否有效，选择分支同时要求 `0x02` 和 `0x21` 中至少一位。`470920` 在普通分支发布实际技能槽，并把十行回调换成 `472A10`。地图 `0x7FD4` 或 `0x7FD5` 且技能主字段 `+0x30` 为 `0x62` 时，已写模式 1 和偏移 0，随后早退，调用者仍增加外层计数。 [选择、重绑及边界](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_skill_entry/ordinary)

**事实**。关闭按钮只先标记当前窗。实际退役回调 `471DD0` 在模式 1 或 2 才减外层计数。减至零且上下文仍启用时，先请求解除，再清上下文。析构重读模式仍为 2 时另减两个相邻的独立字节。随后共用整理清活动槽。本地 `stage306` 的工作列表重复打开返回阶段错误，关闭列表时若上下文启用则直接提交解除。D0/D3 沿 WK-T02 和 WK-T23 验收上述差异。 [本机对照](../build/analysis/legacy-se-classic-work-entry-v1/local-comparison.json)

**事实**。主状态 10 的已证点击和按键统一进入 `48A310`，以窗 26 的活动槽、旁表、玩家槽和锁存判定能否打开。接受后写当前命令 2，经 `471140` 将同一窗 10 以模式 3 打开，并交 `48A7D0` 处理后续技能选择。工具栏点击即使在打开条件失败时也返回 1。固定 Item 亦由三个入口转到本版战斗技能处理。D4 复用原 BF-F07 与 BF-T07。**待验证**。原版组合运行、另一套工作窗的实际帧分派、当前同版及三端产品。 [战斗分派和用例](../analysis/capability-first-v1/game-work-functional-specification.json#/se_classic_skill_entry/battle_route) · [验收范围](validation.md#legacy-se-classic-work-entry-validation)

<a id="legacy-item-classic-window-reentry"></a>

## 固定 Item 的经典窗口退役与恢复

**事实**。`cg_item_6000.exe`（SHA-256 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`）的 `572D47` 在主状态 9 的所选分支于恢复字为空时保存窗口 1 的活动标记，随后写子状态 200，再调用 `58DBF1`。该入口在 `ED44D0` 为零且角色记录查询成功时，依据 `11D4CE8` 为零或非零进入 250 或 252。两条子状态路径都调用 `56B866` 的重建分支。所选主状态 5 的初始化先清恢复字，再进入主状态 6、子状态 0，随后清从 `ED41C0` 起的 28 字节。 [窗口原字节核验](../build/analysis/legacy-item-classic-window-reentry-v1/source-review.json) · [状态 5 清除范围](#fixed-item-state5-reset)

**事实**。`4B0C5C` 扫描 68 个经典窗口记录，在活动字段 `+0x0C` 非零时写 `+0x50=1`。`4B0AD4` 关闭已有窗口，先调用对象 `+0x38` 的回调，再保存坐标、清活动字段并退役资源。关闭后清空 28 个占用字节。若工作上下文字节仍非零，经 `4B0B6E → 57E580` 发送 `+5D` 动作 62，调用返回后清上下文。 [来源核验](../build/analysis/legacy-item-classic-window-reentry-v1/source-review.json)

**事实**。`4AE70A` 重置指针、活动和计数，按偏好请求默认窗口，再由 `4B16EB` 按编号扫描标记为 1 的记录。21、22、23、40 组按 21、40、22、23 的顺序处理组内非零标记。窗口 40 打开期间保存和恢复 `EB906C`，窗口 22 打开前写 `EBA87C=1`。33、34 各在其扫描位置按标记请求。重建后重读子状态，仍为 250 时将前八个当前计数字节逐个加一并取低字节。 [重建与计数](../build/analysis/legacy-item-classic-window-reentry-v1/source-review.json)

**推测**。这条生命周期可供 G03、G12、G18 和 X02 的经典窗口合同共用。**待验证**。另一套窗口在正常帧里的业务回调及当前同版适用性。 [验收范围](validation.md#legacy-item-classic-window-reentry-validation)

<a id="legacy-item-classic-rebuild-modes"></a>

### 历史 Item 的经典窗口初始化、关闭与重开

**事实**。固定 Item 分析样本 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。`56B866` 读取当前主状态和子状态，按原 PE 三张表选择下列窗口操作。状态写入与调用的先后由各入口决定。 [原字节和五处分派](../build/analysis/legacy-item-classic-rebuild-modes-v1/source-review.json)

| 调用时的状态 | 所选经典窗口操作 |
| --- | --- |
| 5 | `4AE406` 清 21、22、23、40 的恢复标记。随后 `4AE4A0` 分别清 68 个池指针及 68 个附属记录活动指针，再按偏好创建默认窗口。 |
| 7、11 | 捕获仍活动的窗口标记并依次析构，随后 `4AE47D` 依次请求保存图鉴、个人邮件和家族邮件，接着执行原流程的其他调用。 |
| 9/1 | 仅按 21、40、22、23 当时的活动指针捕获标记，之后析构并经 `4AE70A` 重建。 |
| 9/4、9/200 | 捕获活动标记后析构。 |
| 9/204 | 经 `4AE70A` 重建。 |
| 9/250、9/252 | 捕获、析构、重建。重读子状态仍为 250 时，前八个计数字节逐个加一并保留低八位。 |
| 10/1 | 经 `4AF15D` 选择性重开。 |

**事实**。普通帧 9/3 在后段读取 `636C18`，为 1 时先请求关闭另一套窗口的槽位 100，再调用经典窗口处理并递增子状态。状态在回调中保持时，经典捕获和析构发生在下一次 9/4。战斗返回 9/11 达到等待计数 30 后先写子状态 1，再调用 `56B866`。战斗内 10/1 的转换调用返回 1 时先处理经典帧，再调用 `56B866`。此时仍为 10/1 就执行选择性重开。随后重读并递增子状态。其他返回值沿原帧处理继续。 [入口及分支核验](../build/analysis/legacy-item-classic-rebuild-modes-v1/source-derived-cases.json)

**事实**。`4AF15D` 先请求窗口 6 和 2，再按偏好请求 35 或 57。非零的 21、40 标记依序发出创建请求，窗口 40 的调用前后保存和恢复 `EB906C`。22、23 任一标记非零时只请求 22，调用返回后清两项标记。重读两项活动指针均为零时调用 `4F30C4`。固定 SE 的 `467EC0` 也将这两个标记合并为一次 22 的请求。普通重建按原顺序分别处理这两项。 [两版复用规则和用例](../analysis/capability-first-v1/alternate-window-contract.json#/item_classic_window_reentry/rebuild_modes)

**本地对照**。已有 SE 来源的战斗返回入口在 30 次等待后请求场景重建，淡入完成后请求普通激活。D0/D2/D3/D4 复用这条调度和现有所有者，按 Item 的已发布状态接入经典窗口、缓存保存和战斗切换。**待验证**。第二套窗口表的回调调度、原版存储和重入结果、当前同版及三端运行。 [共享入口核验](validation.md#legacy-item-classic-rebuild-modes-validation)

<a id="legacy-item-window-one-restore"></a>

## 固定 Item 的窗口 1 恢复标记

固定历史 Item 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。窗口 1 属于第 1 组，`56BFFE(1)` 比较副槽 `CBD73C`。普通帧、另一套窗口的非零组打开、`TfD` 和 `>HY` 所选分支共有七处调用该判断并写入 `CBAF5C`。七处都先检查标记为零。**事实**。 [指令与引用核验](../build/analysis/legacy-item-window-one-restore-v1/source-review.json)

主状态 9 子阶段 3 经 `58D873 → 4A46D8` 进入所选普通帧。`4A55F0` 从路径检查登记待办和剩余步数。`4A57B5` 在有进度且剩余为正时扣一，剩余小于等于零时调用所选动作，再清待办和剩余。模式 1 和 3 都在各自合资格分支先保存恢复标记，再调用 `!DS` 发送入口。模式 1 还写子阶段 200 并进入 `58DBF1`，模式 3 在收尾写 `B7FD24=1`。**事实**。 [普通帧与入场来源](../build/analysis/legacy-item-window-one-restore-v1/source-review.json)

`56CB2A` 的延后动作 3 在恢复标记非零时请求打开 1，返回后清标记。`484EC5` 在计时字和标记均非零时发同一请求，随后清两个字段。`>HY` 的一条分支与普通帧的所选迟发转换先清计时字再调用 `484EC5`，该次调用保留标记。表行 40、41 的回调在公共函数返回 2 时另查主状态，状态 10 保留标记，其余合资格状态请求打开 1 后清除。**事实**。 [回调、分支与验收用例](../analysis/capability-first-v1/alternate-window-contract.json)

**待验证**。普通帧向 99 行表分派活动和非活动回调的入口、当前同版行为和实际设备结果。 [静态核验](validation.md#legacy-item-window-one-restore-validation)

<a id="battle-window-restore-order"></a>

## 两版历史游戏的战斗入场与窗口恢复顺序

**事实**。固定 Item `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9` 的战斗 `10/0` 在 `45BCC2` 向 `11D4B88` 写入 16 位值 3。固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的对应写入为 `437BF8 → F5F050`。两处都先写动作，再请求设置默认文本焦点。`>_U` 和 `>xG` 的合资格接收也写同一字，分别写 1 和 2。主状态 5 的所选初始化会清该字和窗口 1 的恢复标记。 [跳转表、接收及写入](../build/analysis/battle-window-restore-order-v1/source-review.json)

**事实**。战斗子状态 8 的所选淡出返回值为 1 时，Item `45C5C4`、SE `43838E` 发布 `9/1`。该状态接下来写子状态 11。普通 `9/3` 以及 20 写入 3 后的共用路径中，Item `58D869` 先消费延后动作，`58D884` 再查定时恢复。SE 的对应调用为 `5024B5`、`5024D0`。 [原状态与调用次序](../build/analysis/battle-window-restore-order-v1/source-review.json)

**推导**。D0/D2/D3/D4 共用下列用例。预期以两次调用实际读到的值为准，调用正常返回且期间无其他写入时可按表组合。 [阶段与条件核验](validation.md#battle-window-restore-order-validation)

| 输入 | 可观察的调用和状态 |
| --- | --- |
| 动作 3 消费前收到合资格 `>_U` 或 `>xG` | 后一次写入决定延后动作。值 1、2 请求经典索引 30、31，随后定时入口单独检查其条件。 |
| 动作 3 仍在，窗口 1 恢复标记非零 | 请求打开另一套窗口 1，调用返回后清恢复标记和动作字。 |
| 定时入口读到计时字非零、恢复标记为零，且经典准入字段和过渡指针均为零 | 请求经典索引 39 的过渡，保存返回指针并请求音效 `0x38`。此前的动作 3 清标记后也可进入此分支。 |
| 定时入口读到计时字和恢复标记均非零 | 请求打开另一套窗口 1，调用返回后清标记和计时字。 |

**待验证**。两次调用之间的实际写入、另一套 99 行表的业务回调分派、当前同版和三端效果。 [共用合同](../analysis/capability-first-v1/alternate-window-contract.json)

<a id="legacy-scene-label-window"></a>

### 历史 Item 与 SE 的场景提示打开、计时和退役

**事实**。两版主状态 9 的所选 `103`、`204` 转换完成后，先将 `GetTickCount` 存入恢复计时字，再发布子状态 20。`252` 在经典窗口重建返回后采样。Item 的写入位于 `58CEC9`、`58D1AF`、`58D389`，SE 对应 `501C6F`、`501EE5`、`502074`。普通 `9/3` 或 `20` 落入的同一帧先执行定时入口，再遍历图形对象和经典窗口。两份固定 PE 的完整哈希、状态表和导入见核验。 [来源](../build/analysis/legacy-window-restore-overlay-v1/source-review.json)

**事实**。计时字为零时，Item `484EC5` 和 SE `44EB10` 将仍登记的过渡对象标记待退役并清其指针，保留窗口 1 的恢复标记。计时字与恢复标记均非零时请求另一套窗口 1，正常返回后清两字。计时字非零而标记为零时，读取经典 39 的活动指针及单独的过渡指针。两者均为空才请求经典 39。通用过渡请求在分配前请求音效 `0x38`，定时入口保存返回指针后再次请求 `0x38`。过渡在第 11 次合资格回调尝试创建，分配失败时同步尝试创建并返回零过渡指针。 [两版入口、调用和字段](../analysis/capability-first-v1/alternate-window-contract.json#/battle_action_and_timed_restore/classic_scene_label_window)

**事实**。两版 `Ta>` 的已解码标签最多保留 24 字节，超长写 `???`。经典 39 的描述符 `+0x24` 分别登记 Item `4E6D68` 和 SE `491100`，创建器将其装入对象 `+0x30`。首次传入 `-1` 时复制当时保存的标签，以窗宽减文字宽后算术右移一位写控件横坐标。第二套窗口 1 的所选绘制也读取该标签，其共同回调返回 0 或 2 时跳过绘制。该支路的外层帧分派仍待证。 [字节、回包和描述符](../build/analysis/legacy-window-restore-overlay-v1/source-review.json)

**事实**。经典 39 的后续回调以无符号比较检查当前 `GetTickCount` 是否达到 `(恢复采样值 + 2000)` 的低 32 位。达到时标记窗口 `0x8000`、清计时字、请求 `0x39`，回调返回 1。下一次合资格的经典窗口整理先执行退役回调再清活动指针。**推测**。过渡耗时计入这段期限，所选 32 位回绕输入可提前满足比较。**待验证**。原版同帧绘制、真实音效、当前同版及三端运行。 [来源用例与本机核验](validation.md#legacy-scene-label-window-validation)

<a id="legacy-resource-handoff"></a>

## 历史游戏资源参数与实际 ZIP

**事实**。固定 37c4 的 `45CFD0` 负责资源参数、默认文件名与坐标别名，`44EBA0` 组装七组路径。按已核的启动输入规则，`Config.dat` 的可见首行在命令尾之前。随包长名生成的 480 字节资源尾部经现有共享入口解析，配合随包配置、反向文件顺序和无配置输入，三种情况均选出已留存材料规格中的路径。 [原资源规则](../analysis/game-resource-runtime-v1/implementation-spec.json) · [启动输入](logic-protocol-spec.md#stage230-legacy-config-startup)

**事实**。Chrome 使用现有 ZIP 范围读取端口和共享资源库初始化目录。第 1000 号索引的 64×48 画面在首份初始化后，以及首份关闭后的第二份目录中，均与历史参考像素摘要相符。**待验证**。当前游戏进程的资源消费和其余素材、场景及设备。 [运行记录](../build/analysis/legacy-resource-handoff-v1/runtime.json)

**事实**。固定 SE 的 `40A090` 标记图形对象，`409FE0` 到合资格帧才解除链接，由 `40A0A0` 释放对象。所选流式声音退役在 `50F4A0` 调用停止，等状态字节后释放数据。跨端用来核准各自的实际关闭条件，浏览器和微信由本机回执定下资源租约及预算。 [源字节与新规格](architecture-and-milestones.md#resource-budget-retirement)

<a id="animation-coordinate-alias"></a>

### 固定 SE 的坐标文件别名与动画组

**事实**。固定 SE 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`453720` 顺序装七组动画索引，`4538C4` 保存最终动画记录的组。其成功路径在 `4504C5` 调用 `453BB0`。坐标数据句柄先由 `453AEC` 写入，再校验索引标记。标记 1 的行可更新已有动画的坐标偏移和数量。 [固定样本与指令](../build/analysis/animation-coordinate-sharing-v1/source-review.json)

**事实**。`453C24` 只比较坐标数据文件名。`51D030` 在 `[FF12EC]==0` 时折叠 ASCII A–Z。匹配后复制本组数据名、索引名和句柄到后续组。轮到已有非零句柄的组时，`453BEF` 跳过加载和索引写入。`453CC0` 按最终动画记录的组取句柄与 `graphicBase`，读坐标行并将同组基址加到图形编号。 [来源与规格](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_animation_coordinate_source)

**推测**。在数据成功打开的所选 ASCII 路径，原创 `a.bin, b.bin, A.BIN` 的同一附件在固定 SE 按指令推导为图形 2099，stage306 本机实得 2088。另一组同数据名、异索引的输入推导为 2032，本机实得 2033。实际 ZIP 的七组索引与数据文件均相同，两种应用次数得到相同的 1,518 条附件元数据。缺档与索引错误沿同一装载顺序另有用例。 [分支投影与本机结果](../build/analysis/animation-coordinate-sharing-v1/runtime.json) · [加载与首次读取](#animation-load-and-first-lookup)

<a id="animation-load-and-first-lookup"></a>

### 固定 SE 的动画缺档与首次读取

**事实**。组 0 的动画索引或数据打开失败时，`453720` 返回 2。`450497` 检查该结果，退出启动分支。可选组没有索引会跳过对应数据。`453848` 在写入索引行前查看 EOF 标记，正常读到末尾时保留此前已经登记的完整行。可选组有索引却缺数据时，`45393B` 写零句柄，仍发布其动画记录及所属组，可能覆盖前组同号记录。 [原指令与复刻规则](../analysis/capability-first-v1/game-presentation-functional-specification.json#/legacy_animation_coordinate_source/load_and_first_lookup)

**推测**。在有空的加载槽且需要冷读时，`45343D` 会把上述零句柄交给 seek。`51E104` 走低地址分支，传 `0x20` 给 PE 导入的 `EnterCriticalSection`。这条分支未取得原版运行回执。stage306 同样保留覆盖条目，读取时返回 `LEGACY_ANIMATION_TRUNCATED`，另一主组编号仍可正常读。 [取流与导入证据](../build/analysis/animation-load-failure-v1/source-review.json) · [本机首次查找](../build/analysis/animation-load-failure-v1/runtime.json)

**事实**。坐标数据先开，数据缺失即跳过索引。索引缺失或读到非 1 标记时，仍保留已经发布的数据句柄。`453BB0` 继续按数据名处理后续组。`453CC0` 在组句柄为空或附件数量为零时返回成功。坐标索引读行后才查看 EOF，无法从该路径确认残行的有效字段。stage306 对有数据的坏标记拒绝整个候选。D0 将坏标记归入该索引的跳过路径，空索引、标记 1 后的残行及无效数据范围仍按有界解析处理。 [读取边界与用例](validation.md#animation-load-failure-validation)

<a id="legacy-item-resource-handoff"></a>

## 历史 Item 的资源参数读取与路径发布

**事实**。历史 `cg_item_6000.exe` 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。`49EC00` 保存命令尾指针，以 `r` 打开 `Config.dat`。成功打开时清零 5,120 字节缓冲，经 `49EC6D` 用大小参数 256 读一行，在首个零字节处追加命令尾，再发布合并指针。打开失败时沿原命令尾进入后续判断。所选正常分支在 `49EF56` 调用 `49F122` 解析。 [输入与原字节](../build/analysis/legacy-item-resource-handoff-v1/source-review.json)

**事实**。`49F122` 经 `5B1050` 取每个前缀的首个匹配。`binfolder:` 读取一个词。资源序号使用 `%d`。V2 图形先处理 `graphicbiv2x:`，再用 `graphicbinv2:` 的匹配覆盖。坐标两表先处理默认值为实路径的槽，再把 `*3` 槽替换为索引 3 的结果。六类表共 42 个默认值、40 个普通前缀和 40 个格式，与固定 SE 的共享表相符。 [资源表与别名](resource-formats.md#legacy-item-resource-path-tables)

**事实**。`49EF5B` 紧接解析调用 `484F70`，对七组各拼接六类完整路径。正常初始化经 `49F0A6 → 48733E → 487B87`，在 `487CBE`、`487E9C`、`487EDD` 将对应的两张路径表分别交给图形、动画和坐标加载。 [路径发布与初始化调用](../build/analysis/legacy-item-resource-handoff-v1/source-review.json)

**本地核验**。现有计划通过 40 个逐前缀输入及四个合并与别名输入。用随包 28 个长名生成 480 字节资源尾部，对代码 4 与 11 各核三种输入，42 条路径均与留存材料匹配。另用 Windows 安装目录的实际返回顺序及随包配置复核，同样得到 42 条历史参考路径。**待验证**。Item 实际文件打开条件和当前同版游戏接收。 [原验收](validation.md#legacy-item-resource-handoff-validation) · [Windows 输入核验](validation.md#windows-installed-resource-enumeration-validation)

<a id="legacy-item-startup-handoff"></a>

## 历史 Item 的两次交接读取与角色类别

**事实**。固定 `cg_item_6000.exe` 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。初始化 `49EC00` 在 `49EF70–49EF8A` 分别清零 `9C03A4` 的 40 字节及 `9C03D4` 的 80 字节。正常读取 `CGSharedMem` 时先复制含 NUL 的文本到本地，再清映射前 256 字节。随后查找 `gid:` 与 `glt:`，各用 `%s` 写入对应的本地字段。固定 SE 的初始化 `45CC90` 与选服 `457C30` 也有两处同名映射读取。 [样本、导入和原件偏移](../build/analysis/legacy-item-startup-handoff-v1/source-review.json)

**事实**。主状态 2 经 `58C81E` 进入 `49803C`。所选服务器行的条件成立时再次读取同名映射，并向同一对本地字段解析。缺少某个前缀时保留该字段已有值。空字段会触发提示及关窗投递，所选调用仍向后执行本地发布。 `592281` 和 `5921E8` 分别将两字段复制到 `11D88F2` 与 `11D88BF`，每项最多 51 字节，遇 NUL 停止。之后回读到 `FD3194` 与 `F93014`，另一个本机模块字段进入 `FD3154`。同一所选调用随后推进阶段 2 的启动和阶段 3 的轮询。 [选服分支和字段写入](../build/analysis/legacy-item-startup-handoff-v1/source-review.json)

**事实**。固定 Item 的 `582C35` 匹配含 NUL 的 `Wb^`，解码一个整数，再于 `582C6D` 调用 `57A574`，保存低八位到实时类别 `9C1D48`。选角初始化在 `4992B3` 清该类别。类别 7 的 `5[B` 仍通过 `49ADBC` 传入 `9C0A48` 字节串。 [回包和升级读点](../build/analysis/legacy-item-startup-handoff-v1/source-review.json)

**待验证**。类别 7 资料的实际写入者和所有者、映射异常后的实际 Windows 行为及当前同版游戏消费者。 [验收范围](validation.md#legacy-item-startup-handoff-validation)

<a id="legacy-item-character-operations"></a>

## 历史 Item 的角色升级与删除等待

**事实**。历史 Item 样本 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。`48733E` 的初始化调用 `487B87`，后者在所选路径由 `48AB28` 分配并填充资源 ID 到记录索引的反向表。主状态 3 的 `49922C` 在子状态 9 经 `48D7BB` 查询五个探测 ID，锁存内容代。索引 0 在该判断中不算命中。类别 7 在内容代 4 时开放升级选项，普通选角的合资格输入将主状态设为 13 并清子状态。

**事实**。主状态 13 按内容代小于 3 选择 `492601`，否则选择 `49AD2B`。两者在阶段 2 要求内容代大于 1，再按实时类别选择请求。类别 7 由后者传 kind5 和 `9C0A48` 指针。`57F5BA` 按 `5[B`、整数及字节串组织请求。`WDM` 经 `582CB4` 到 `57A581`，保存结果低字节。主状态 13 中低字节 0 进入 100，其余进入 200。确认成功回选角初态，确认失败或不可用后回阶段 1。

**事实**。删除动作检查所选 148 字节记录的偏移 32。零进入子状态 21，其他值进入确认。确认和界面条件满足时还检查输入掩码 `0x02`。`491BBB` 清等待初始化标志，`491BC9` 初始化或绘制等待界面。后者的返回局部量初始化为 0，正常返回读取同一局部量。所选链保持等待。

**待验证**。`9C0A48` 位于映像零填充区，运行期升级资料的生产和归属仍待证。固定 SE 的 `923C40` 保留同一来源问题。实际服务器删除及当前版本等价仍待证。 [原角色规格](../build/analysis/character-operation-composition-v1/specification.json) · [来源核验](../build/analysis/legacy-item-character-operations-v1/source-review.json)

<a id="legacy-item-upgrade-buffer-provenance"></a>

## 历史 Item 的注销提示与升级资料

**事实**。固定 Item `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9` 的主状态 7 经 `58C9C3` 进入 `49637C`。四段实际提示分别向 `9C0944` 复制含终止符的 142、97、15、15 字节。升级资料 `9C0A48` 在起点之后 260 字节。相邻 `9C0A44` 的所选初始化写入四字节，恰好在资料地址之前结束。`48DF56` 先把提示复制到栈上，再在副本中处理换行。 [写入范围与显示调用](../build/analysis/legacy-item-upgrade-buffer-provenance-v1/source-review.json)

**事实**。`572758` 先清注销结果字 `FD3262`，再经 `57F2FD` 发送 `1^t`，之后进入状态 1。`VKW` 经 `582AA0 → 572813` 读取解码文本。状态为 1 时先转 2，再比较包含终止符的 `successful`，匹配时写结果 1。其余状态下匹配成功时写状态 2、结果 2，并经 `58CC25` 登记待切换的主状态 7 和子状态 0。主循环在 `58C771` 发布该主状态。 [注销发送、回包和状态发布](../build/analysis/legacy-item-upgrade-buffer-provenance-v1/source-review.json)

**事实**。类别 7 的升级发送仍沿 `49ADBC → 57F5BA` 传入 kind 5 和 `9C0A48`。`58379C → 584050` 读取该输入，按 NUL 结束，并写入编码器自己的暂存区。`WDM` 在主状态 13 使用结果低字节决定升级结果。**待验证**。类别 7 资料的实际生产与所有者、当前版适用性。 [发送和已知边界](../build/analysis/legacy-item-upgrade-buffer-provenance-v1/source-review.json) · [本机回归](validation.md#legacy-item-upgrade-buffer-validation)

<a id="legacy-item-logout-clock"></a>

## 历史注销结果与返回选服的计时

**事实**。固定 Item `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9` 的主状态 7 完成退场后进入等待页。已有结果 2 时跳过再次发送。其余路径先清结果字、调用零字段 `1^t` 发送，再写等待状态和保存本次计时。轮询 `5727A2` 优先消费已就绪的回复，清就绪状态并返回 1、2 或 −2。无就绪回复时，32 位无符号差严格大于 600,000 毫秒才返回 −1。固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的显式发送、等待写入和采样顺序相同。 [两份原文件与 REA 核验](../build/analysis/legacy-item-logout-clock-v1/source-review.json)

**事实**。返回选服另用会话时长。Item 在初始化的 `49EF6B` 保存 `GetTickCount`，在选服 `49803C` 的所选分支开启接收后，经 `4985A8` 再保存到 `7C516C`。固定 SE 的 `45CE7E`、`458018` 向对应字 `728364` 写入，原文件中也核到相同的两个返回阈值。 [原件中的写入和比较](../build/analysis/legacy-item-logout-clock-v1/source-review.json) · [Windows 时钟定义](https://learn.microsoft.com/en-us/windows/win32/api/sysinfoapi/nf-sysinfoapi-gettickcount)

| Item 轮询结果 | 连接与界面动作 |
| --- | --- |
| 1 手动注销成功 | 先调用连接退役。会话时长不超过 15,000,000 毫秒时立即回主状态 2，超过时显示登录超时提示，确认后再回选服。 |
| 2 服务端通知 | 显示维护提示并清结果字，确认时才调用连接退役，再回选服。 |
| −1 注销超时 | 先调用连接退役，显示注销超时提示，确认后回选服。 |
| −2 注销失败 | 先调用连接退役，显示失败提示，确认后回选服。 |

**事实**。两个确认分支都以会话时长 1,500,000 毫秒为界。超过时向 Windows 请求桌面焦点，发出 `VK_CONTROL`、`VK_MULTIPLY` 按下，等待 100 毫秒后按逆序释放，然后仍进入主状态 2。所核代码明确了本机调用顺序，实际宿主效果仍待验。 [调用和导入槽](../build/analysis/legacy-item-logout-clock-v1/source-review.json) · [Windows 键码](https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes) · [键事件参数](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-keybd_event)

**实现差异**。现有网页和微信共用的会话在手动 `VKW` 结果到达时直接结束，等待计时在提交调用前开始。D0/D2 按实际来源补齐发送与采样顺序、长会话成功提示和按结果退役的确认阶段。 [现有会话与本地核验](validation.md#legacy-item-logout-clock-validation)

<a id="legacy-item-upgrade-result-flow"></a>

## 历史 Item 的升级回包与帧状态

**事实**。固定 Item `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9` 在普通帧先经 `4874A5 → 570E2A` 处理接收，再经 `4874B9 → 58C6B0` 派发主状态。所选正常接收分支在 `ED6008` 非零且仍有缓存字节时调用 `5714DC`。返回 0 时把记录交给 `57F79E`，随后回到轮询头。所选 `Wb^` 回包立即更新类别低字节，之后的升级发送阶段读取该类别。

**事实**。`WDM` 经 `582CB4 → 57A581` 保存结果低字节到 `603B88`。活动主状态为 13 时，低字节为 0 写子阶段 100，其余写 200。原函数的分支只读取活动主状态和结果字节。随后 `58C763` 检查待切换主状态，非负时发布该主状态及对应子阶段，再派发。选角中的两条所选升级输入分别在 `499880` 和 `49A0E7` 调用 `58CBF8(13)`，立即切到 13 并清子阶段。

在活动主状态 13 保持且没有待切换状态覆盖时，发送前的有效结果可以直接进入结果阶段。同一轮依序派发的两条有效结果由后一条决定当前子阶段。现有共享实现的本机夹具在发包前忽略结果，并在发包后保留第一条结果。D0/D2 按来源配置核对这两个用例和待切换覆盖的情况。

**事实**。Item 的线性写入索引中，`4AAA73` 的向前清零范围为 `[A15BF0, B09E3C)`，类别 7 资料位于 `9C0A48`。

**待验证**。类别 7 资料的实际写入和当前版本适用性。 [原 PE 核验](../build/analysis/legacy-item-upgrade-result-flow-v1/source-review.json) · [本机对照](validation.md#legacy-item-upgrade-result-flow-validation)

<a id="legacy-item-upgrade-submit"></a>

### 历史 Item 的升级提交与等待窗

**事实**。同一固定 Item 映像在 `571310` 向 `582F84` 传入 `5713D6`，非空分支将它保存到 `6043D8`。`5[B` 的 `57F61F` 和注销 `1^t` 的 `57F338` 都调用 `58468C`。该函数组织帧后经 `584757` 把连接值、帧地址和长度交给已登记的函数。 [初始化与两条普通提交边](../build/analysis/legacy-item-upgrade-submit-v1/source-review.json)

**事实**。`5713D6` 的发送可用字节为零时返回 −100。所选合法帧的长度加上待发字节数超过 262,144 时返回 −1。其余路径将整帧追加到缓存尾部，更新待发字节数并返回 0。`570E2A` 的合资格收发分支在处理接收记录后调用套接字写出。返回 −1 时走错误分支，其余返回值交 `571489` 裁减前缀。`571489` 对达到 262,144 的返回值拒绝裁减。**推导**。恰好填满缓存且一次报告写出全长时，这次调用保留待发计数。实际套接字返回及完整恢复待验。 [缓存边界及原导入](../build/analysis/legacy-item-upgrade-submit-v1/source-review.json)

**事实**。内容代至少为 3 时，主状态 13 的所选子阶段 2 路径调用升级发送函数，随后直接写阶段 3。阶段 3 经 `56C20F` 创建“版本升级中···”等待窗，保存返回指针并写阶段 4。分配失败返回零，阶段 4 在指针为空时跳过等待提示绘制。指针存在时，按对象 `+0x170` 的查询低字节决定是否绘制提示。主状态 13 的 `WDM` 仍按结果进入 100 或 200，结果阶段仅在等待窗指针存在时请求退役。 [阶段表、分配和绘制](../build/analysis/legacy-item-upgrade-submit-v1/source-review.json)

**待验证**。类别 7 资料实际来源、Windows 中队列与等待窗运行效果，以及当前同版和三端验收。D0/D2 分别记录传输回执、界面阶段和升级结果，复用注销与升级的发送所有者。 [静态核验](validation.md#legacy-item-upgrade-submit-validation)

<a id="legacy-upgrade-empty-material"></a>

## 两版历史游戏的类别 7 空资料提交

**事实**。固定 Item `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9` 在 `49ADBC → 57F5BA` 传入 `9C0A48` 和整数 5。固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 在 `459C4A → 4F8880` 传入 `923C40` 和整数 5。两处资料地址均在可写段的零填充尾部。 [原映像和调用边](../build/analysis/legacy-upgrade-empty-material-v1/source-review.json)

**推导**。已进入主状态 13、阶段 2 的类别 7 普通提交，且缓冲区已初始化、容量足够时，若资料首字节为零，Item 的 `584082` 落入空字串返回，SE 的 `4FCB51` 跳到相同语义的返回。字符串包装器各追加一个空格，整数 5 由两版字母表索引 5 生成字节 `35`，其后也有空格。传给 `58468C` 和 `4FCE00` 的帧前缓冲为 `35 5B 42 20 35 20 20 00`。 [编码、字母表和原指令](../build/analysis/legacy-upgrade-empty-material-v1/source-review.json)

**事实**。提交正常返回后，`49ADC4` 和 `459C52` 直接写阶段 3。下次仍按阶段 3 分派时，两版各调用等待窗创建并写阶段 4。`WDM` 继续沿主状态 13 的结果路径处理。 [阶段表和等待调用](../build/analysis/legacy-upgrade-empty-material-v1/source-review.json) · [回包时序](#legacy-item-upgrade-result-flow)

**实现差异与待验证**。现有共享角色流程在类别 7 的资料来源未明时报告 `LEGACY_CHARACTER_UPGRADE_MATERIAL`，由阶段 202 准备错误提示。CH-U1 仍需发送时的实际资料和生产者证据。空字串用例描述固定样本的条件路径，实际入队、服务端结果和当前版本适用性继续验收。 [共享入口](../shared/legacy-game-character-options.mjs) · [本机核验](validation.md#legacy-upgrade-empty-material-validation)

<a id="legacy-item-frame-hit-selection"></a>

## 历史 Item 的帧末输入和绘制命中

**事实**。固定 Item `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9` 在主状态派发返回且 `5D4498` 非零时，依次调用 `56F37F`、`5926C0`、`56F787`。`56F37F` 先清一次性鼠标事件字 `ED560C`，再计算两路按下的时长。时长以 32 位差值作无符号比较。超过 500 毫秒且无上次重复记录时置对应重复位，之后每次与上次记录相差至少 100 毫秒时再次置位。未到边界的更新清对应位，时长回到 500 毫秒以内时还清对应的重复记录。

**事实**。`5926C0` 为优先级 5、6、20 的标记各预留一槽，`1204D3C` 非零时另预留优先级 2 的一槽。当前行数加预留数达到 4,096 时，先把当前行数截到 4,096 减预留槽数，再追加标记。四字节列表项由 `5950F9` 按无符号优先级升序、同级按有符号记录号降序排序。现有共享绘制计划匹配这条排序，本机 4,096 行夹具保留全部输入行。

**事实**。`56F787` 在所选路径先按升序检查有资格的文字热区，命中时写 `ED545C` 并结束该次选择。未命中文字时清该结果，再从排序后的绘制列表末尾检查有资格的记录。所选普通矩形比较含边界等号。命中绘制项时先写记录号 `ED5FDC`，再按条件追加反馈，随后调用 `5926C0`。`EC1808` 为零且 `5FB334` 非零时才进入后续对象提示分支。两个局部选择帮助函数 `48EBDD`、`48EC2B` 分别读取一次性事件位、重复位，再从传入列表中返回首个匹配命中记录号的位置。

**待验证**。两处选择帮助函数的普通调用者、99 行窗口表的实际帧回调及当前版本适用性。 [来源核验](../build/analysis/legacy-item-frame-hit-selection-v1/source-review.json) · [本机对照](validation.md#legacy-item-frame-hit-selection-validation)

<a id="legacy-item-album-toolbar-and-slot-reset"></a>

## 历史 Item 的图鉴工具栏与物品槽重置

**事实**。固定 Item 的 PE 入口 `5B39C9` 经 `5B58AB` 在主程序 `49EC00` 之前遍历启动表 `[5C9000, 5C9164)`。迭代器按四字节递增，跳过零项，调用其余 88 项。`5C90A0` 登记的包装入口初始化窗口 1 的 `ED4EC0`，写入 ID 1、248×220 尺寸和来自映像的横坐标 392。窗口表行 1 的回调 `569327` 将同一描述符交给 `56A1C2`。 [启动入口与注册行](../build/analysis/legacy-item-window-startup-v1/source-review.json)

**事实**。启动表依次计算工具栏基准纵坐标、收起偏移及当前偏移，再初始化图鉴按钮 `ED5080`。按映像默认宽高 640、24，基准纵坐标为 456，收起偏移为 24。图鉴按钮左侧为 `ED4F88 + 480`，尺寸 80×24。`569D95` 的命中与 `56A01B` 的绘制接收同一描述符。 [初值、命中与绘制](../build/analysis/legacy-item-window-startup-v1/source-review.json)

**事实**。局部更新 `569ADB` 在准入有效、偏移非负且底部条带命中时将偏移减 2，至零后清增量。其他所选准入分支恢复收起偏移。准入为零时先恢复收起偏移并清增量，随后返回。准入有效时，偏移等于收起值则发布 `EC1808=0`，其余发布 1。图鉴按钮命中前将更新后的偏移写入描述符 `+0x20`。**推导**。默认值下，连续十二次合资格的局部更新将偏移从 24 降到 0。 [分支与推演](../build/analysis/legacy-item-window-startup-v1/source-review.json)

**事实**。历史 Item `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9` 的图鉴按钮在独立函数 `569ADB`。窗口 1 登记 `569327`，其所选入口调用 `56A1C2`。工具栏输入读取 `5FB334 != 0`，更新 `ED5080 + 0x20` 后于 `569D95` 测试按钮。矩形命中时 `56B1A1` 将 `ED560C & 1` 映射到返回位 `0x01`。按钮优先请求切换活动的窗口 23，其次请求切换活动的窗口 24。两者皆未活动时请求切换 23。两窗共用 group0，活动查询读该组的槽。绘制函数 `569E22` 读取同一准入字段，并将任一窗活动的结果用作按钮选中态。

**事实**。固定 Item 的 `5D0170 → 56B600 → 56C15A` 与固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的 `538FA8 → 4E9F90 → 4EA740` 都在键盘表索引 9 登记键状态索引 `0x11`、`0x44`，两处回调均传入窗口 23。Item 的切换按图形缓存决定请求打开或关闭。初读缓存为空时发起打开并返回 1。初读非空时再次检查，仍非空才关闭并请求声音 `0x39`。

**事实**。Item 的三条物品回包都在 `9C1D38 == 0` 时核对受影响的槽。`?<E` 处理 28 个槽，在读取各条资料前核对当前序号。`?l)` 先读显式槽号再核对，随后读取该槽资料。`@Y)` 调用双槽操作，再依参数顺序核对两槽。`55FB08` 在当前槽非负且相等时调用 `55FAC7`，将 `5FA83C` 写为 `-1`，清除 `ED437C`、`CBF448`、`CBF44C`、`CB33DC`，然后将工具栏准入 `5FB334` 写为 1。

**待验证**。工具栏输入、绘制和表内回调的普通帧调用者、SE 索引 9 的实际匹配及当前版本适用性。原版运行未执行。 [共用合同](../analysis/capability-first-v1/alternate-window-contract.json) · [原 PE 核验](../build/analysis/legacy-item-album-menu-v1/source-review.json) · [核验记录](validation.md#legacy-item-album-toolbar-validation)

<a id="legacy-item-classic-album-ingress"></a>

## 历史 Item 的经典图鉴键盘、按钮与详情

**事实**。固定 Item 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。普通帧 `4B34C4` 在活动窗口和控件遍历后，于 `4B3635` 调用 `517E95`。所选主状态 9、子状态 3 的路径在外层清理按键事件前执行该调用。`517E95` 按 `EB0E48` 选键，值为 0 时检查索引 `0x44`（D），值为 1 时检查 `0x59`（Y），均读首次按下位 `0x04`。经典设置窗 24 的控件 12 在点击路径递增该值，到 2 时回到 0。 [帧、设置及按键来源](../build/analysis/legacy-item-classic-album-ingress-v1/source-review.json)

**事实**。经典重建在 `4AE782` 请求创建工具栏 6。其控件 6 的源回调为 `4B2BD1`。创建器把描述符的回调字段 `+0x1C` 装入运行控件 `+0x20`。普通帧在 `4B35C0` 调用 `4B2816`，后者在所选命中与事件分支将鼠标事件位 `0x01` 映射为控件点击位 `0x02`，再调用活动控件的回调。键盘和按钮都读取列表 19 的活动指针 `CAD9C0`。空指针时请求创建，已有对象时置 `0x8000` 并请求音效 `0x39`，由经典退役流程消费标记。 [创建、事件与退役](../build/analysis/legacy-item-classic-album-ingress-v1/source-review.json)

**事实**。列表 19 的控件 58–67 绑定 `4D7786`。点击索引为列表偏移加控件编号减 58，按当前 bank 检查对应 128 字节记录的有效标记。有效时先写选择 `CBCC58`。详情 20 未活动时提交创建请求，已活动时更新选择并请求音效 `0x38`。无有效记录时保留选择和详情状态，所选点击回调仍返回 1。 [控制登记与详情分支](../build/analysis/legacy-item-classic-album-ingress-v1/source-review.json)

**规格**。D0 复用经典活动槽和控件调度，键位设置在控件遍历时更新，快捷键在遍历后读取。D3 复用同一份列表开关与选择规则，按两个键位、按住、标记退役、空行及已有详情验收。**待验证**。窗口 23、24 的主循环调用与回调消费、当前同版适用性和三端运行。 [验收范围](validation.md#legacy-item-classic-album-ingress-validation)

<a id="legacy-se-classic-album-ingress"></a>

## 历史 SE 的经典图鉴键盘、按钮与详情

**事实**。固定 SE 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。主状态 9、子状态 3 的所选普通帧在 `5024D5` 更新图形对象，随后进入经典窗口帧 `46AB90`。该帧先整理窗口，再处理各窗回调和合资格控件，最后在 `46ACC8` 调快捷键函数 `4B4170`。外层在状态处理返回后于 `44FCA8` 清理按键的瞬时位。经典设置 24 的控件 12 在点击时循环合法布局 0、1。快捷键在布局 0 检查 D，在布局 1 检查 Y，均读首次按下位 `0x04`。 [REA 6.7.0 和 Ghidra 12.1.4 来源复核](../build/analysis/legacy-se-classic-album-ingress-v1/source-review.json)

**事实**。重建请求创建经典工具栏 6。控件 6 的登记回调 `46A4D0` 使用点击位 `0x02`。它与快捷键各读取列表 19 的活动指针 `C107F8`。空槽请求创建，非空置 `0x8000` 并请求音效 `0x39`，随后由经典整理流程退役。成功分配的过渡对象从计数零开始，第 11 次合资格回调尝试创建。分配失败时 `46C595` 同步尝试创建，成功的新实例在 `4685FE` 发布。 [控件登记、创建及退役](../build/analysis/legacy-se-classic-album-ingress-v1/source-review.json)

**推测**。按所选帧的两处分支推导，按钮和快捷键同帧触发时，若后一步读取时活动槽仍空，两处各提交一次创建请求。若按钮已同步创建，后一步标记当时的窗口退役。两个延后请求分别进入创建器，第二次若仍找到同号窗口，就进入 `468203` 的复用分支。组合时序待在运行用例中核对。 [过渡和同号分支](../build/analysis/legacy-se-classic-album-ingress-v1/source-review.json)

**事实**。列表 19 的控件 58–67 共用 `485780`。点击按当前角色 bank 和页偏移查询有效标记。每 bank 有 320 行，每行 128 字节。有效时先发布 bank 内的行号，再请求详情 20，或复用已有详情并请求音效 `0x38`。无效行保留原选择和详情，所选点击回调仍返回 1。D0/D3 与固定 Item 共用 SF-A27。 [Item 对照](#legacy-item-classic-album-ingress) · [规格与用例](../analysis/capability-first-v1/game-social-family-album-functional-specification.json#/legacy_se_classic_album_ingress)

**事实**。另一套 99 行表末端外的首个四字节值为 392。SE 的 `4E8CB0` 与 Item 的 `5692BE` 分别把它读入各自工具栏描述符的横坐标初始化。**待验证**。另一套窗口 23、24 的正常帧回调和活动参数来源、当前同版适用性与三端运行。 [两版表尾和初始化位置](../analysis/capability-first-v1/alternate-window-contract.json#/table_end_and_classic_album) · [验收记录](validation.md#legacy-se-classic-album-ingress-validation)

<a id="legacy-classic-album-entry-admission"></a>

## 固定 SE 经典图鉴的列表、详情和关窗准入

**事实**。沿上节的固定 SE 普通帧，`46AC09` 先调用当前窗的 `+0x30`，`46AC2B` 检查控件 `+0x18` 等于 1，`46A484` 才分派运行时回调 `+0x20`。`46A4D0` 由工具栏八个控件共用，只有控件 6 的 `46A920` 分支读取图鉴列表槽。经典设置 24 的控件 12 和后续键位读取沿同一帧。当前 A1 在既有入口记录上增加窗口和控件级归属。 [固定样本、登记和原字节](../build/analysis/legacy-classic-album-admission-v1/source-review.json) · [27 个登记位置](../analysis/capability-first-v1/game-social-family-album-functional-specification.json#/legacy_se_classic_album_ingress/entry_admission)

**事实**。新列表 19 以 `485740(-1)` 将偏移置 0。`485FD0` 按当时角色槽刷新十行。有效记录以 `+0x7F` 决定发现标记，空记录将该显示控件的参与值置 0。发现标记使用控件 38–47，刷新保留选行控件 58–67 的参与值。后者的点击按当时偏移和有效字节决定是否发布选择，空行点击返回 1。列表单行用 `0x400`，十行用 `0x02`，偏移限 0 至 310。拖动与滚轮沿共用滚动入口。 [控件角色和刷新规则](../analysis/capability-first-v1/game-social-family-album-functional-specification.json#/legacy_se_classic_album_ingress/entry_admission)

**事实**。新详情 20 在 `485760(-1)` 设方向 5。有效记录在 `486416` 先清 `+0x7F`，随后更新文本和预览。控件 9–12 以 `0x400` 步进 −10、−1、+1、+10，选中索引限 0 至 319。步进可停在空记录，刷新清相应显示参与位，仍输出一基索引和总数 320。控件 80 先处理 `0x400` 加一，再处理 `0x800` 减一，分别在 0 至 7 环绕并请求音效 `0x33`。 [详情分支与指令](../build/analysis/legacy-classic-album-admission-v1/source-review.json)

**事实**。两窗的关窗控件 0 经 `49FDD0` 给当前窗写 `0x8000`，并请求音效 `0x39`。随后合资格的经典整理调用 `4678A0` 后清活动指针。仍活动的列表保留偏移，重新创建列表才从 0 开始。Item 已对照两窗初始化的 0 和 5，以及当前对象的关窗标记。**待验证**。所选组合的原版运行、第二套窗口 23/24 的实际普通帧、当前同版和三端产品验收。D0/D3 沿 SF-D7 和 SF-A27 交接。 [适用范围和用例](validation.md#legacy-classic-album-entry-admission-validation)

<a id="legacy-item-album-key-registration"></a>

## Item 图鉴输入表与正常准入的边界

**事实**。历史 Item SHA256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。`5D0128` 是八字节记录的输入回调表，`48A9D9` 扫描 64 项，普通匹配器 `48A93D` 接受索引 0–59。第 9 项位于 `5D0170`，取状态索引 `0x11` 的掩码 `0x02` 及索引 `0x44` 的掩码 `0x04`；两者非零才调用 `56B600`，再于 `56B605` 向 `56C15A` 传入窗口 23。

**事实**。四个方向回调走持续位的特例，调用后继续扫描。普通匹配项调用后执行固定反馈并返回，更早匹配项可阻止本次到达第 9 项。图鉴开关缺缓存时请求 open，再直接返回 1；这个返回值没有传播 open 的成功与否。两张图鉴表项 23、24 均为 group0，已有页初始化和详情恢复规则保持。`48A754` 清除 256 状态字节的掩码 `0x01`、`0x04`、`0x10`；本轮未解释新运行事件。

**待验证**。REA、限定地址常量和直接 E8/E9 扫描尚未定位 `48A9D9` 的普通调用者。相邻 `48AB28` 是图形文件加载器，`5D0328` 为它的 `rb` 字串。普通键状态的生产和清理已在后续核对。主循环对图鉴分派器的准入、另一套窗口帧回调及当前版本等价仍待，G19 保持未就绪。 [按键状态来源](#legacy-item-keyboard-frame)

本次使用 REA 6.7.0、Ghidra 12.1.4 和 Apple LLVM 21.0.0。复用 95 条记录，新增 10 条；5 个新增函数及 3 个已有函数共 2,585 字节、708 条指令核对原 PE，其中相邻加载器单列排除。实际游戏或目标输入未运行。没有新正向边前停止该分支扩展。 [原 G19 规格](../analysis/capability-first-v1/game-social-family-album-functional-specification.json) · [来源核验](../build/analysis/legacy-item-album-key-ingress-v1/source-review.json)

<a id="legacy-item-keyboard-frame"></a>

## 历史 Item 的普通按键消息与帧末清理

**事实**。固定历史 Item 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。`48733E` 在 `487461` 调用 `4A0178`，用 `PeekMessageA` 取出消息，再翻译并派发。遇到退出消息时返回 0，主循环结束本次路径。正常返回后，`4874B9` 进入状态分派。主状态 9、子状态 3 在 `58D8A2` 读按键，再在 `58D8AC` 进入经典窗口帧。 [帧入口和表项](../build/analysis/legacy-item-keyboard-frame-v1/source-review.json)

**事实**。已注册的窗口过程 `4A01BD` 以虚拟键索引写 `7C54A4` 的 256 个状态字节。普通输入模式 2 下，按下置 `0x02` 和 `0x10`。只有 `0x08` 未置时同时置首次按下 `0x04` 和锁存位 `0x08`。松开清 `0x02` 与 `0x08`，置 `0x01`。窗口激活消息走 `48A7B8`，清 `0x02`、`0x01`、`0x04`、`0x10`，保留 `0x08`。 [窗口消息](https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-keydown) · [激活消息](https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-activate) · [写入位置](../build/analysis/legacy-item-keyboard-frame-v1/source-review.json)

**事实**。`4874E9` 在状态分派返回后、帧末时钟判断前调用 `48A754`，清全表的 `0x01`、`0x04`、`0x10`，留下按住位和首次按下锁存位。所选帧末分支在此后将输入模式 1 改为 2。恢复首帧若仍处于模式 1，普通按下消息尚未写入上述状态。 [帧末调用与字节](../build/analysis/legacy-item-keyboard-frame-v1/source-review.json)

**推导**。图鉴局部输入表第 9 项读同一张状态表。Ctrl 按住且 D 首次按下时匹配。在锁存位有效期间，D 的后续重复按下只有持续脉冲，帧末清掉首次位后，局部匹配不再成立。图鉴分派器进入正常帧的调用边、另一套窗口表的实际消费者及当前版适用性仍待对应证据。 [虚拟键码](https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes) · [按键序列推演](../build/analysis/legacy-item-keyboard-frame-v1/source-derived-cases.json) · [阶段核验](validation.md#legacy-item-keyboard-frame-validation)

<a id="battle-result-tuple-lifecycle"></a>

## 战斗角色结果队列的第四格

**事实**。固定 SE 样本 SHA256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。普通角色处理 `433CD0` 在空槽经 `433A10`、`409E70` 分配并清零 `0x13B8` 字节。它先发布对象，再调用 `4348E0` 初始化队列。已有角色走同槽更新。所选名单清退分支标记旧对象退役，随后清槽位。

**事实**。角色上下文位于对象 `+0x0C`，结果区从 `+0x1C` 起，每行 16 字节。第四格位于 `+0x28+16×行索引`。`4348E0` 清读写游标并置前两行首格哨兵。`4347E0` 在对象条件允许时清游标并置 200 行首格哨兵。两者所选存储写入均保留第四格。`434A90` 写三格及下一行首格哨兵。`434AF0` 另写传入的第四格。259 等级 9 的所选标记使用三字段调用。

**事实**。所选护卫处理按角色槽从同一表获取对象，相同对象共用写游标。RID 位 `0x800000` 置位时，`436E60` 保存写游标减一，追加两行，再读取该对象所保存行的四格并追加副本。第四格随同一对象和行传播。

**本地验证**。已有共享核心从实际解码的原创 105 指令得到第四格 100041。两种重置和同槽更新后，护卫结果及其复制行均保留该值。移除并在同槽重新创建后，两行第四格均为零。生产者局部暂存、其它角色上下文、原版运行及完整目标验收仍待。 [战斗规格](../analysis/capability-first-v1/game-battle-functional-specification.json) · [来源核验](../build/analysis/battle-result-tuple-lifecycle-v1/source-review.json) · [本地核验](../build/analysis/battle-result-tuple-lifecycle-v1/focused-probe.json)

<a id="battle-detached-rid-context"></a>

### 固定 SE 的独立结果身体与 RID 查找

**事实**。动作 101 为每个父结果行新建清零上下文，只复制该行四格，下一行首格写 −1。`436EE0` 推进三次，从索引 1、2 取后缀，最后停在索引 3。106 在 RID 位 `0x800000` 置位且 `0x2000` 清除时，`41A146` 和 `41A157` 以该后缀槽 −1 计算 `58FAC4−4`，读取 `58FAC0`。这是动作 98 实际读写的 105 共享动画游标。`420080` 分配提示对象成功后，按这个值读取 `+0x40`、`+0x44`。提示函数返回后，`41A030` 重读该字再访问 `+0x34`、`+0x30`。反射路径使用传入的角色槽。

**事实**。116 的动作 110 在等级小于 9 时向新前景身体复制一行。动作 112 调用元数据处理后重读结果游标，随后通过 `434B60` 再推进。结果索引从 0 开始。如果先前处理继续到索引 200，首格与读游标同址，另外三格与写游标及动作区前两格重叠。`434B60` 先写入 200，再从同址读取 200。接下来的循环回边以 200 计算角色表地址 `58FDE4`。

**待验证**。原生到达时的实际游标与指针值、所选分支的异常和恢复，以及其余生产者暂存。现有共享入口对两类未支持上下文的提交前处理由既有测试核对。 [来源核验](../build/analysis/battle-detached-rid-context-v1/source-review.json) · [回归记录](validation.md#battle-detached-rid-context-validation)

<a id="battle-105-cursor-lifecycle"></a>

## 技能 105 的游标与进出战斗

**事实**。固定 SE 的 `58FAC0` 与历史 Item 的 `62C8C8` 均为映像零填充位置。动作 97 重置对象帧状态。动作 98 从等级乘 20 加共享游标的地址读动作，推进游标。动画完成后检查下一有符号字节，遇负值才清游标。两份样本从表起点开始的 204 字节相同，覆盖十个等级从零游标出发的首次负终止。

**事实**。入场和两种退出的直接清表都从游标之后四字节开始，清空 22 个对象指针。退出先遍历对象，子状态 7 的战斗回调在动作表之前返回。子状态 9 保留动作分派，合资格的 98 回调可在清表前推进游标，遇到结束条件时也可清零。已核两份 PE 的真实跳转表。

**本地验证**。原创夹具通过现有命令所有者达到动作 98、游标 1，普通退出清表后仍为 1，再次入场也为 1。下一轮首次读取动作 8，游标到 2。其它间接写入、原版进程完整生命周期和目标端子状态 9 验收仍待。 [来源核验](../build/analysis/battle-105-cursor-lifecycle-v1/source-review.json) · [本地探针](../build/analysis/battle-105-cursor-lifecycle-v1/focused-probe.json)

<a id="battle-105-106-callback-order"></a>

### 固定 SE 的 105 游标与 106 分身的命中顺序

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。主状态 10 的子状态 5 和 6 分别经 `438062`、`438135` 遍历对象。所选独立技能在施法者不同且依赖槽互不重叠时各自登记。105 的所选分支将 97、98 排入注册角色队列，106 的施法者经动作 101 分配独立分身，分身从动作 24 开始，命中走动作 14。 [命令准入、回调表和来源](../build/analysis/battle-105-106-callback-order-v1/source-review.json)

**事实**。注册身体初始优先级取槽号乘 10 加 2 的低字节，`421140` 给分身优先级 2，并登记 `40A120`。同优先级保留插入先后。遍历调用对象后才读后继。**推测（静态推导）**。对象仍有效且队列未重排时，槽 0 的父对象创建分身后，遍历可在当次执行分身。其它注册槽按初始优先级创建时，分身插在已走过的位置，下次合资格遍历再执行。 [分配和遍历](../build/analysis/battle-105-106-callback-order-v1/source-review.json)

**事实**。在所选动画信号 10001、活目标和分身 `+0x1038=0` 的条件下，动作 14 经 `40CBE6` 调用 `41A030`。结果有 `0x800000` 且 `0x2000` 清除时，已核的后缀槽 −1 使 `41A146` 读 `58FAC0`，提示调用正常返回后 `41A157` 再读。提示分配成功时读取该值所指的 `+0x40/+0x44`，后续读取 `+0x34/+0x30`。 [命中准入与读点](../build/analysis/battle-105-106-callback-order-v1/source-review.json)

**推测（静态推导）**。两条回调在同一次遍历均合资格且前一条正常返回时，槽 0 的 105 先于 106 分身执行。106 读取动作 98 返回时的值，可能已经递增，也可能在同次回调清零。105 在其它初始优先级的注册槽时，分身先执行，读取当时的游标。实际合帧还取决于命令倒计时、动作与动画信号。 [游标生命周期](#battle-105-cursor-lifecycle) · [共同用例](../analysis/capability-first-v1/game-battle-functional-specification.json#/result_tuple_storage_lifecycle/detached_rid_context/callback_order)

现有共享入口用原创反射夹具观测到两个回调方向和分身的两种首帧表现。非反射输入现在在命令入口返回未支持，施法者数值和分身发布均未改变。**待验证**。两个原版回调的实际合帧、指针访问结果、异常与恢复，以及当前同版和三端效果。 [本机对照](validation.md#battle-105-106-callback-order-validation)

<a id="legacy-item-window-producers"></a>

## Item 训练资料与两份样本的图鉴页恢复

**事实**。固定历史 Item 样本 SHA256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。其 `5F1F58` 与固定 SE 的 `559C10` 均有 99 行，按行核对 ID 和 group 一致。Item 的 55–59、67 有六个直接调用 `56BB80` 的资料构造函数。每个函数先写对应回调读取的数据，再请求打开 group 2 窗口。新选择设置主槽与 dirty，清副槽。

**事实**。Item 图鉴 23 回调发布选择后请求 24，详情返回写恢复标记再请求 23。固定 SE 的 `4DD2A0` 给 `4E94D0` 传入初始化函数 `4DD260`，活动且缺缓存对象时调用。普通初始化写页 0，恢复分支用所选序号除以 15 并向零截断。列表收到共用回调结果 2 时清恢复标记。Item 的 `5591BF` 有同样页规则，固定 SE 容量内的 320 个序号已逐个核算。

**待验证**。这六个 Item 构造函数各自的正常调用入口、对应窗口表的实际帧分派、固定 SE 与当前版本的另一套入口及实际设备验收。 [训练规格](../analysis/capability-first-v1/game-training-services-contract.json) · [图鉴规格](../analysis/capability-first-v1/game-social-family-album-functional-specification.json) · [来源核验](../build/analysis/legacy-item-window-producers-v1/source-review.json)

<a id="legacy-item-album-mail-lifecycle"></a>

## 历史 Item 的角色槽、图鉴和邮件缓存

**事实**。固定 `cg_item_6000.exe` 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。选角循环 `49922C` 把当前角色槽写入 `11D4B80` 的有符号字。所选创建分支清该槽的图鉴并尝试保存整份，再清该槽的个人及家族邮件并尝试保存两份，随后进入主状态 4。所选已有角色发布角色槽后进入主状态 5。 [原文件、选角及缓存调用](../build/analysis/legacy-item-album-mail-lifecycle-v1/source-review.json)

**事实**。主状态 5 经 `58C920 → 58814A` 清两份邮件的完整缓冲，再由 `588177` 先读 `mail.dat`，后读 `guildmail.dat`。个人邮件打不开时尝试保存该缓冲并结束邮件载入，家族邮件打不开时尝试保存家族缓冲。两份邮件使用 `123AFCC[123AFF4]` 映射出的配置目录。该主状态随后经 `587ACC` 读取全局 `data\album.dat`，只有解码长度恰为 81932 字节才复制两槽图鉴，然后继续入场并发布主状态 6。 [载入与发布顺序](../build/analysis/legacy-item-album-mail-lifecycle-v1/source-review.json)

**事实**。`57F79E` 的 `@t-` 经 `57A3B2` 到 `587F1F`。容量为 320 时逐组扫描十个 32 位值，零位清对应行有效字节。置位且资料缺失或版本更高时，经 `57D68F` 以从 1 起的序号发 `'q=` 详情请求。空组使解码帮助函数返回 2，扫描结束后仍写当前角色槽版本。`B8S` 经 `57A3C7` 到 `587BC4`，按消费时的槽和有效序号写 128 字节行的对应字段。名称至少 17 字节时写 `???`，新发现标记取决于写入前的有效字节，随后尝试保存整份图鉴。 [回包常量与字节用例](../build/analysis/legacy-item-album-mail-lifecycle-v1/source-review.json)

**事实**。主状态 1 的所选子状态 9 把映射后的目录索引交给 `5AC326`，在该配置目录内依次请求删除 `save.dat`、`mail.dat` 和 `guildmail.dat`。两份历史样本的角色槽与缓存规则各有原文件依据。 [目录操作与 SE 对照](../build/analysis/legacy-item-album-mail-lifecycle-v1/source-review.json)

**待验证**。真实换角后迟到回包的到达与准入、另一套窗口帧回调、原文件互操作及当前版适用性。D0/D2/D3 共用选角、收包和缓存所有者处理所选顺序。 [验收范围](validation.md#legacy-item-album-mail-lifecycle-validation)

<a id="legacy-item-mail-history"></a>

## 历史 Item 的来信、未读提示与本地发件历史

**事实**。固定 `cg_item_6000.exe` 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。分派器 `57F79E` 的 `@iV`、`ZV'`、`^Q^` 各解码一个整数、字节串及第二个整数，分别进入 `579955`、`57B5B0` 和 `57BDD6`。这三个消费函数使用首个整数和字节串，保留外层末尾整数的线格式。个人、家族来信按竖线取前两个内层字段，给解析器的上限分别是 31 和 299。第三字段等于 −1 时选普通提醒，其余值选宠物提醒，两种分支均写类型 0。迷你邮件先找活动联系人，查无匹配即返回。所选解析上限为 31 和 511，记录写入见 `5AD15A`。 [分派、字段及提醒原字节](../build/analysis/legacy-item-mail-history-v1/source-review.json)

**事实**。`588882`、`588AD1` 和 `5AD15A` 依次后移九条旧记录并写第 0 条。每条 320 字节，头两个字节为未读与类型，所选字符串从偏移 2 和 20 写入。个人写入检查联系标记，以实时有符号角色槽定位每槽 60 组十条记录。家族写入要求名册成员有效，以当前槽定位 200 行成员缓存。已有有效重复项取最后匹配，首次写入取首个空行，满时结束该次写入。迷你邮件的 20 组记录使用独立联系人表寻址。 [存储布局](resource-formats.md#legacy-item-mail-records) · [写入核验](../build/analysis/legacy-item-mail-history-v1/source-review.json)

**事实**。未读重算 `588281` 依次查个人映射次序、家族名册次序和迷你联系人次序。个人和家族按记录索引 0 到 9 查找，迷你按 9 到 0。首个匹配设置类别 1、2 或 3，页号取联系人序号整除 4。无匹配时类别清零并恢复保存的页。个人接收尝试保存后重算未读，迷你接收写入后重算。所选两条路径还在活动联系人匹配且光标小于 9 时递增光标。家族接收尝试保存并提醒。`GC` 无业务字段，在 `9C1D38` 等于 0 时清当前家族槽并尝试保存。 [页、光标及清槽核验](../build/analysis/legacy-item-mail-history-v1/source-review.json)

**事实**。普通发送选中路径 `4F02FA` 先提交请求，再以类型 1 插入本地发件记录。所选个人和家族路径随后尝试保存两个缓存。迷你路径写本地迷你记录并清草稿。宠物发送选中路径 `4F13A0` 在 `4F17D7` 或 `4F19E9` 提交请求，随后写对应的个人或家族发件历史并尝试保存两个缓存。发件记录未读字节为 0。 [发件调用顺序](../build/analysis/legacy-item-mail-history-v1/source-review.json) · [收发字段](logic-protocol-spec.md#legacy-item-mail-wire)

**待验证**。长迷你正文与未知家族成员的原版运行边界、缓存实际持久化、服务端投递及附件结算、当前同版适用性。MM-R1 沿可关联同一请求的发送者结果或附件状态变化继续补证。 [原邮件操作缺口](../build/analysis/mail-operation-composition-v1/specification.json) · [本批核验](validation.md#legacy-item-mail-history-validation)

<a id="legacy-item-training-ingress"></a>

## 历史 Item 的普通训练入口与经典窗口

**事实**。固定 Item 的 `58207A` 比较 `Q?m` 和终止字节，解码四个整数及一个字节串，经 `579EAF` 交给普通业务分派 `4E5313`。关闭消息按活动模式及角色 ID 匹配，执行经典组掩码 3 清理并清活动模式。按原 PE 的字节选择表与跳转表核对了十种训练模式，实际调用九个资料处理函数。

**事实**。师范选择进入经典窗口 52，治疗进入 37，人物学习、遗忘及宠物报价进入 54。选宠、选技能栏和扩展回复共四条路径，以 `CAE53C` 的 54 号窗口指针作为资料处理前提。该指针由经典创建器 `4AF678` 发布。三条描述符均来自 `5F1568`。所选控件经注册的回调发送 `/1I`，字段为五个整数和一个字节串。

**适用范围**。经典师范处理 `4E9072` 和另一套构造函数 `5287D0` 均写 `CBD740`。两条源调用分别打开经典 52 和另一套 55，按实际调用确定窗口所有者。另一套 55–59、67 的正常激活和帧分派、当前同版消费者及真实设备验收仍待。 [训练规格](../analysis/capability-first-v1/game-training-services-contract.json) · [来源核验](../build/analysis/legacy-item-training-ingress-v1/source-review.json)

<a id="legacy-pet-training-wait-owner"></a>

## 两份历史样本的宠物训练等待与同窗更新

**事实**。固定 Item 的 SHA-256 为 `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`，固定 SE 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。Item 的 `5166D9`、`516404` 和 SE 的 `4B2F60`、`4B2D00` 由报价及选宠控件注册。合资格的选择调用 `/1I` 发送入口。返回后在 `516943`、`51658F` 与 `4B3131`、`4B2E50` 写活动模式 `-2`，保留窗口 54 与当前页。 [控件登记与原指令](../build/analysis/legacy-training-wait-owner-v1/source-review.json)

**事实**。掩码 `-1` 的关闭路径按当时的有符号模式和角色匹配，序号不参与比较。等待时的模式为 `-2`，旧正模式与其失配。通过外层门槛且两字段匹配时同步执行经典组掩码 3 清理，再清活动模式。普通资料路径在活动模式为负时先写来包的模式、掩码、序号和角色，再更新距离基准并分派。所选四种选宠或选栏模式在活指针存在时重建同一窗口，保存新页面模式并清转换字。指针为空时解析体直接返回，外层已写字段保留。 [分派表、收包与指针](../build/analysis/legacy-training-wait-owner-v1/source-review.json)

**事实**。报价页返回仅标记关闭。选宠或选栏返回发送按钮 2，保留窗口并置活动模式 `-2`。这几种返回的共同尾部写转换字 1。其后进入报价处理时，活窗口且转换字非零会就地重建，活窗口且转换字为零会标记旧窗并请求重新打开。普通窗口回调仍先处理距离检查，随后才用 `-2` 跳过页面模式失配检查。退役时只有转换字非 2 且页面模式仍匹配才清活动模式，最后清转换字。 [返回、报价与退役证据](../build/analysis/legacy-training-wait-owner-v1/source-review.json)

**本地对照**。共享核心发送选择后立即移除页面，正常回复用新修订号打开下一页。等待时的旧正模式关闭会清掉进度，不同角色的选宠回复被过滤。选宠或选栏的按钮 2 发空文本并移除当前页。OS-D7 在一个共享所有者内复用编解码与选择逻辑，按 OS-A24 验证上述状态差异。 [训练规格](../analysis/capability-first-v1/game-training-services-contract.json#/classic_pet_training_wait_owner) · [本地对照](validation.md#legacy-pet-training-wait-validation)

**待验证**。返回请求的字节参数来自初始零填充区，实际发送值、等待期间的再输入及发送异常需运行证据。再输入的静态准入见下节。另一套窗口的正常激活和帧分派、当前同版和三端验收继续按原范围核对。

<a id="legacy-pet-training-controls"></a>

## 两份历史样本的训练再输入与技能栏确认

**事实**。固定 Item `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9` 和 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的经典帧先清输入消费，再整理窗口。窗口回调执行后按运行控件的参与值处理。两版普通命中分支都检查消费字，实际调用前重读 `+0x18`。回调返回非零可消费本次点击。下一次经典窗口遍历重新判断输入和活动表。 [两版帧与指令](../build/analysis/legacy-pet-training-controls-v1/source-review.json)

**事实**。两版报价或选宠成功发送后将活动模式置 `-2`。所选提交函数仍按行与输入条件执行。报价页 2、12 的右栏可提交，选宠页 3、13 同一栏只绘制已选报价。**推导**。页面仍活动且下一次点击再次合资格时，报价或选宠可重新发送。距离检查和新的回包都可改变届时的准入。 [控件登记、用例与待证条件](../analysis/capability-first-v1/game-training-services-contract.json#/classic_pet_training_wait_owner/controls)

**事实**。技能栏点击先按左侧偏移和控件序号保存零基栏位，再启用本窗控件 0。经典帧从索引 0 起依序遍历。**推导**。选栏时本次遍历已越过控件 0，确认层从后续合资格遍历开始参与。**事实**。确认层按当前原始鼠标事件与实际矩形命中处理。取消只关该层。确认先停用该控件，再发 `/1I` 按钮 0 及所存栏位，正常返回后标记窗口 `0x8000`。后续合资格的活动表整理才执行退役，宠物技能和扣款沿原回包更新。 [确认控件及发送顺序](../build/analysis/legacy-pet-training-controls-v1/source-cases.json)

**本地对照**。现有共享入口在报价或选宠发送时清页，第二次操作返回失效。网页和微信已有局部确认交互。D0/D3 沿 OS-D7 接入共用输入、等待和待退役状态。**待验证**。原版输入与回包实际交错、另一套窗口的正常调用和分派、当前同版及三端产品流程。 [本地核验](validation.md#legacy-pet-training-controls-validation)

<a id="legacy-dialog-actor-facing"></a>

## 两份历史样本的对话收包与角色朝向

**事实**。固定 Item 的 `579EAF` 和固定 SE 的 `4F4410` 各有三项接收门槛。掩码为 `-1` 时，匹配当前模式和角色 ID 才同步关闭经典组 3 并清活动模式，随后直接返回。普通来包分别调用 `4E5313` 和 `48FCE0`。两版的六个强制替换序号相同，活动模式存在且新模式非 `0x20` 时依次关闭组 2、组 3，再处理新资料。普通重复治疗保留原活动窗。 [两版函数、样本摘要和分派表](../build/analysis/legacy-dialog-actor-facing-v1/source-review.json)

**事实**。普通分派返回后，Item 经 `579F2E → 46870E` 查本次来包的角色 ID，再调用 `45CCC2`。SE 经 `4F4485 → 440250` 查相同字段，再调用 `4387C0`。窗口分派的返回值没有参与这项准入。两个身体均存在、场景字恰为 1、目标记录类型字恰为 1 时，写入目标身体的 `+0x2B8`。SE 的场景字沿已有场景字段 8 来源。 [调用顺序与字段](../build/analysis/legacy-dialog-actor-facing-v1/source-review.json) · [SE 场景字来源](../analysis/game-actor-context-v1/implementation-spec.json)

**静态推导**。先将两个身体的坐标分量各自向零取整，再取本机减目标的低 16 位有符号差。横差为负时，纵差从负到零到正对应 7、6、5。横差为零时，纵差负或正对应 0、4。横差为正时依次为 1、2、3。双差均为零时，Item 读该路径未写入的栈字节，SE 的 `4388B4` 读取目标指针低字节。两版都对读出的字节做符号扩展。 [指令和符号组合](../build/analysis/legacy-dialog-actor-facing-v1/source-review.json)

**实现差异与待验证**。现有共享收包在打开治疗和保留已有窗口的两例都保持目标朝向 2。固定 SE 在对应条件下分别写 6 和 0。D0/D3 沿 OS-D2 在既有对话及角色所有者之间补这一步。重合时的实际值、之后的原版身体消费、第二套窗口分派和当前同版继续验收。 [本地对照](../build/analysis/legacy-dialog-actor-facing-v1/focused-probe.json) · [核验范围](validation.md#legacy-dialog-actor-facing-validation)

## 烟雾动画首帧与普通绘制

**事实**。固定 37c4 战斗 109 分支的 `41105B` 循环 40 次请求创建 110004。成功创建的对象用 `41F160` 调用 `4FD5F0(mode=1)`，返回 1 时调用 `40A090`。已选素材的四条同 ID 记录由最后一条覆盖，朝向 0、动作 0 的四帧依次为 16681、16676、16677、16678。首帧记录宽 4、高 -15，帧事件为 0。该动作的旗标为 0，帧更新读取图形原点，写入帧索引和计时。

**推导**。按普通可见对象的队列条件，`506E80` 可以提交该帧，`506030` 先准备缓存。type 0 从 `(0,0)` 按有符号尺寸裁剪，在 `50614E` 跳过负底边。type 1 若通过源 Y 上界检查，负 Y 归零后裁到负高度，最迟在 `5061F5` 跳过。普通绘制由此在上传前结束。固定速度 100、未冻结、模式 1 的推导序列为第 1、5、9、13 次调用发布帧，第 17 次完成。

**待验证**。完整画面、实际驱动和三端验收沿原 G06/B03 范围推进。 [资源与动画规格](../analysis/capability-first-v1/resource-corpus-budget.json) · [来源核验](../build/analysis/smoke-animation-clip-v1/source-review.json)

<a id="wechat-sdk-host-probe-preparation"></a>

## WH工具身份与游戏来源分别记录（2026-11-10）

[WH档案](../analysis/capability-first-v1/wechat-host-profile.json)记录工具就绪、原创探针与当前门槛，SDK实际运行0；准备检查不能当微信平台接受。

**事实**：本机工具package2.02.2609250、Electron壳36.6.0、随附技能0.3.11分列；严格bundle签名通过，安装诊断compatible=true。没有把Electron版本或类型声明写成微信基础库SDKVersion。

**待验证**：SDK探针未运行，原game-current消费者、37c4 RID/scratch/alias/cursor、另一套准入等游戏必要源条件不因工具安装而关闭。无新REA分析查询、原游戏/VM/账号/官方会话或产品代码修改。

<a id="game-battle-functional-specification"></a>

## BF战斗来源、完整输入条件与退出链（2026-11-10）

**事实**：固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd；原生profile=7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb。75完整native记录/74入口/122401B与24旧派生/23入口/62998B分列，358规则节点、24读窗、2689直接call、51变体规格核验。REA6.7.0、历史Ghidra12.1.4；无新分析查询/引擎。

**事实**：48B810六state及48B5B0保实际body/13B4/控制位/记忆/MP前提；local>=20不能全局早抛，1C条件可无N而phase5。29/32、先mode/page后特殊0x62早退、R|1/R|0及8主行动沿已留存来源。487860/487930从既有正向表复用，回城4}o/flag/main10-7与注销main10-9/main7不同。

**事实与待验证**：[BF57事实/91操作](../analysis/capability-first-v1/game-battle-functional-specification.json)只提升B01/B04固定本域规格。435000旧28B过程Evidence保持，既有461B/138指令完整CFG作为补充；113/260双读序、98FF/ITM default/107 ABI不归一化。BF-U1所需native foreign/scratch/alias/cursor原来源仍未证，B02/B03整域false；旧37c4不作现行游戏或官方接受证明。

<a id="game-work-functional-specification"></a>

## G18工作来源、配方reset与两族规则（2026-11-10）

**事实**：固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd；原生profile=7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb。复用95完整原生记录31751B、61旧派生观察/59入口/48697B和54规则节点；REA6.7.0、历史Ghidra12.1.4身份分列，本批0新分析查询/0新静态引擎进程。

**事实**：4FF030的77B原生体将主槽+0x49F8保存ctx置0，并清56配方/五材料ID，其它字段保留。当前recipe.reset保留ctx1，已由原创向量确认差异。3经典描述符和16另一套20B行的回调位置核原PE；470650/492B20两个7B指令视图分别证明outer增量和三槽byte读取，不冒充完整native Evidence。

**事实与待验证**：[WK26事实/60操作](../analysis/capability-first-v1/game-work-functional-specification.json)分别保经典同帧发送/析构、采集晚到以及另一套byte写入/门槛/换算/严格elapsed。505840读取的是config+0x312；键位、style和技能ctx不同。实际另一套callback列消费仍未证，不重做已闭word候选或97项零结果。旧37c4不移作当前受保护游戏的同版证明。

<a id="game-social-family-album-functional-specification"></a>

## 队伍、家族和图鉴的SF证据与新确认路径（2026-11-10）

**事实**：样本cg_se_6000.exe，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd，1569280B；原生profile=7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb。171完整原生记录72772B、66旧派生观察/63入口、58规则节点和186读窗分别核验。六次REA“No procedure exists”没有新增原生Evidence，不代表缺字节。

**事实**：现有Ghidra12.1.4/JDK21.0.13在一份私有工程及四个readOnly后续中，仅按原业务读窗/具名正向边取得25派生体3394B/1067独立LLVM指令。26次种子请求中4A2080被拒重叠，实际位于4A1FA0；不重试、不改原REA元数据或PE。九个旧读窗也归回既有父体。

**事实**：495A90/B50/C10分别安装个人/家族/迷你确认，495CD0/D30/D80各自发送和清理；495E30取消无业务发送。4A1FA0先预检32项再发送差异，4A2150汇总未保存项。518280按20次320B步进清flag并复制当前默认NUL字串，而5181C0插入使用十条逻辑历史；两者不相互改写。**推测/静态推导**：该地址跨度与逻辑分区不同，未据此声称真实故障或默认字串运行值。

**事实与待验证**：[SF30组事实/72操作](../analysis/capability-first-v1/game-social-family-album-functional-specification.json)闭合G14/G16固定本域规则；G19另一套实际激活/page上下文仍未闭合。原依赖、目标政策、30完整案例和真实三端/当前同版/官方接受保持独立，旧37c4不移作当前受保护客户端证明。

<a id="game-ordinary-services-functional-specification"></a>

## 普通业务操作合成与新增静态派生的证据级别（2026-11-10）

**事实**：固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd；原生profile=7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb。复用202份完整REA原生记录77508B、43规则节点，另列180条旧派生观察/167不同入口及470650的7B操作码视图，不混作新增原生Evidence。

**事实**：REA对47D6F0/47F430/4B3F30三次查询返回“No procedure exists”，原PE对应字节仍存在。依有证回调/调用，用现有Ghidra12.1.4/JDK21.0.13在独立私有工程补10份派生视图7351B；2169条指令逐字节匹配原件并由LLVM独立解码。47F430由47F5F0工厂登记，47DEE0由47C880安装；没有修改原件或REA元数据，目标已closed/cleanup=false。

**事实**：47D6F0完成背包定向/给予与取消，47DEE0只绘制装备目标态；保留bag-only目标限制。4B3F30按非零按钮发送存储图形ID；外观三轴按原上下界循环。4A2CF0发布不写共享614884，主按钮local2可撤回；现有实现的发布时间戳/阶段拒绝与人物学习额外拒绝是具名差异。全部规则/来源见[OS30组事实与78操作](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json)。

**推测/静态推导**：OC-U7/U8只在列明的pending动画条件下预测；held=-1后回调余部的索引读不能写成已发生崩溃。**待验证**：G12另一套55..59/67实际激活/资料生产/需求关联、OS实现差异、31完整案例及真实三端/当前同版/官方接受。旧37c4行为不移作当前受保护客户端证明。

<a id="game-presentation-functional-specification"></a>

## G06/G07操作合成的来源与具名边界（2026-11-10）

**事实**：固定cg_se_6000.exe SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd，REA6.7.0/Ghidra12.1.4保留证据；224份完整原生记录163193B，35个精确规则节点。另6个旧派生视图2554B（含4F4950的34B）单列，未提升为原生Evidence；实际配置接收体为保留的4F44A0。本轮未新增分析查询/派生工程，REA实际状态closed/cleanup=false。

**事实**：453030指定7287BC为解码目的地，81D118为独立fread目的地；511470的所选raw分支写像素加调色板前缀，不清无关尾部。5074D0/507230/505D70保留原尺寸、冷align4/热tight和目标pitch区别；5×2冷读[8,13)/[0,5)，热读[5,10)/[0,5)。13B已知像素/调色前缀可决定该示例，只有10B像素时不足。**推测/静态推导**：PE虚拟初始零不证明运行时复用后的scratch内容；完整必要生产/别名上下文仍未闭合。

**事实**：命名selector320、CUT/动画和341 CUT/337 AUT材料说明复用后续已证规则，不继续沿旧“未知/全族缺失”取证。字体14组源指标、4096条/272B文字记录、源字节编辑/IME布局、姓名/值条、小地图已合表为[PR20组事实/52操作](../analysis/capability-first-v1/game-presentation-functional-specification.json)。**待验证**：G06整域条件、PR-D1..8、24完整案例及真实字体/后端/三端/同版/官方接受。

<a id="game-actor-functional-specification"></a>

## G05对象整链的固定来源与证据级别（2026-11-10）

**事实**：cg_se_6000.exe SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd，REA6.7.0/Ghidra12.1.4。复用179完整原生记录、新增13，192体65756B；原43BA10、两个已注册但原未定义的回调及两个释放叶共5个派生视图3518B，不提升为原生Evidence。17范围1694条独立解码另核原字节；旧回调484条单列。

**事实**：4F16D0→438C00从列17解析归一化mask，位1/2/4分别消费附属、骑乘和五字段影子；全7消费至列24，空尾仅清aux30。43B1F0提前消费81/82；43B190实际五个参与者参数，439BE0负责登记而非初始化，439C50跨全部控制器查本地成员。几何52D548的960B/120对和浮点常量已绑定。510E50空整数返回FFFFFFFF，与C0直接atoi区分。

**事实**：普通4F2010在找目标前写共享D5D7A8/AC，协同路径跳过。4FF720(action1)传restart0，包含本地30映射；43BA10先检查raw substate250..252与secondary80。43D150自定义aux1C规则保留其条件上下文，不强制99图标/计时，也不宣称全局不可达。详见[18组事实/42操作](../analysis/capability-first-v1/game-actor-functional-specification.json)。

**待验证**：GA-D1..7实现、原依赖整合、25完整案例和实际三端/当前同版/官方接受。72原创样例及纯模块差异检查不能证明原程序运行行为；本轮没有执行原程序、Windows API或联网。

<a id="game-flow-functional-specification"></a>

## G03固定旧版主流程与所有显式主9状态（2026-11-10）

**事实**：固定cg_se_6000.exe为37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd，REA6.7.0/Ghidra12.1.4。66份完整原生记录共30961B，其中新3体3761B来自5015A0三条已核E8正向调用；其余63体复用。45CFD0末段明确F5F17C=1；450250另外设F5F1A8=-1，不使用虚拟BSS零作为运行初态。

**事实**：主1的0/1、2、3、4内容分支分别有自己的intro/input/error/close次序；主9原22个case保留fallthrough与return。TfD只有922C4C==0/main9时进入普通切换门，BFF328决定是否设200；主10期间仍可更新场景数据。主动1^t、非主动successful、mainB与程序退出不同；40A0C0只标记，不同步释放整池。详见[13组事实与33操作](../analysis/capability-first-v1/game-flow-functional-specification.json)。

**待验证**：GF-D1..6及依赖上下文的目标实现、实际源API/呈现与当前同版三端/官方接受。现有纯模块对照只验证已实现边界/31次等待/取消旧capture；20条完整接受案例未执行。旧的本链缺体/主2初态推测以本节为准，服务器调度与外部接受仍未证明。

<a id="game-communication-functional-specification"></a>

## 事实：固定37c4游戏通信原范围已合成（2026-11-10）

样本cg_se_6000.exe 1569280B，SHA37c4dfd2…74013bd；REA6.7.0/Ghidra12.1.4/profile7810ea94…0180cb。复用134完整原生记录并新查7体，合计141/66345B；完整ID/原carrier/节点/PE范围在[主来源](../build/analysis/game-communication-functional-specification-v1/source-authentication.json)与[补充来源](../build/analysis/game-communication-functional-specification-v1/supplement-source-authentication.json)。6个后续发送窗口及callback/cleanup/free三视图保留派生权威，不冒充完整dossier。两会话已导出/快照关闭。

新4EE6A0/6E0各64B将10035映射0，其他保留DWORD；调用方仅signed>0关socket置错，recv0并非立即关闭。新4F5ED0/60C0/61A0/6200/63B0闭合可选版本预检：WinINet2048预读保留/16384限制与备用HTTP16383截断不同；前者EOF探测也受保留量限制。endpoint子串命中先置fastflag，再查EXE token；备用EOF EXE缺失返回-2，原父只处理1/-1，因此继续pending，未有网络阶段20s超时兜底。原历史地址未连接。

模块文件摘要完整生产链覆盖旧阶段未知；首包module/glt/gid、ack/full32状态与low16、99优先于外层20001ms、内层600001ms和按调用次数延迟均已绑定。二进制优先于112B初始化；重置只清ready、保留旧材料；active ready0与初始71的等待/错误不同。AF/EF帧、文本/字段、104分派/66当前发送与164标签字已核，GC不是三字节标签。普通XOR的“byte0”指NUL值，不指首位置。

G01本域完整规格就绪；SourceValue上下文/其它业务consumer和当前C82/9baa等配对不由本轮证明。当前host elapsed与源unsigned绝对截止点在环绕附近两处不同，CF-D1..5保留实际差异；产品仍stage306，原程序/API/设备/官方会话未运行。

<a id="map-functional-specification"></a>

## 地图/移动固定来源整链及两项修正（2026-11-10）

固定样本SHA-256 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd；REA6.7.0/Ghidra12.1.4/profile7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb。复用26组既有规则、19个共同合同节点、102份完整native来源和220项映射/字节检查，没有新增REA函数查询。

事实：header word4/8与尺寸12/16由reader/writer及45F530/45F760确认；4EF840顺序45F1C0→4FF580→4FF5A0→4FF700，463E20不重建窗口。源窗口外纠正显示回退、target/scaled仍新值；原创纯helper加当前调用层源码验证了窗口选择差异，原游戏/完整协议未运行。BFF358键盘/BFF354鼠标时钟各自500ms，当前鼠标调用层已有限流。

[地图操作规格](../analysis/capability-first-v1/game-map-functional-specification.json) · [来源核验](../build/analysis/map-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/map-functional-specification-v1/validation.json)

<a id="audio-functional-specification"></a>

## 固定37c4音频功能操作规格（2026-11-10）

样本SHA-256为37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd，Ghidra12.1.4/profile7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb。42组已有规则、67完整native/11派生绑定的节点身份和原PE范围已复核，新增REA函数查询0。45组来源规则（含三组旧WAV/音乐资料）构成34操作。

事实：维护网络后/主分派前、音乐四阶段、环境两距离/两表/ID偏移、MIDI第二word、流式ready后loopEnd发布与停止确认保持各自顺序。FPU特殊域、16字节MIDI loader、GM音色和物理声部仍待对应上下文/实测。4567A0完整700字节证明所列固定复制最长142，不能写到目标923C40；不据此宣称全程序无生产者或运行材料为空。

[音频操作规格](../analysis/capability-first-v1/game-audio-functional-specification.json) · [来源核验](../build/analysis/audio-functional-specification-v1/source-authentication.json) · [本轮核验](../build/analysis/audio-functional-specification-v1/validation.json)

<a id="browser-surface-observations"></a>

## 本轮没有新的原程序语义结论（2026-11-10）

本轮零REA原函数查询、零原游戏/登录器/VM/账号/官方动作；使用已有项目CP936表与原创WAV/像素/文本夹具。表内一致不证明原始ACP，Songti SC的DOM命中不证明原生GDI/GMN像素，手动PCM一致不证明原生硬件声学等价。

保留CH-U1类别7材料923C40的实际producer/owner缺口，仅已知459BC0 reader。不能重做唯一literal检索来推无writer，也不填空/猜值。UC-U1上下文、G20最终关联及当前同版交接继续保留；原stage306产品未改。

[实测档案](../analysis/capability-first-v1/browser-surface-profile.json) · [来源与约束](../build/analysis/browser-surface-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-surface-conformance-v1/validation.json)

<a id="browser-host-observations"></a>

## 本轮为独立宿主实验，没有新增游戏源结论（2026-11-10）

本轮零REA原函数查询、零原游戏/登录器执行、零VM/账号/官方连接。固定源规则仍复用入口台账和共同合同；Chrome输入/存储行为不被当作37c4/C82的游戏通信或正常当前交接证据。

A1业务准入及A3的真实RID/foreign/scratch/105 origin、G02材料923C40、G20最终结果与当前同版consumer/handoff仍保留；不以本轮宿主通过删除源缺口或提升G02/G20规格。

[宿主档案](../analysis/capability-first-v1/browser-host-profile.json) · [本轮约束](../build/analysis/browser-host-conformance-v1/specification.json) · [本轮核验](../build/analysis/browser-host-conformance-v1/validation.json)

<a id="required-entry-admission"></a>

## 647限定来源的事实和条件（2026-11-10）

固定游戏37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd及C82分析镜像分别核hash。647根的656声明区间全部匹配原件；保留原REA6.7.0/Ghidra12.1.4/LLVM21.0.0来源，不把当前字节重核称为新反编译。

104接收含一个无consumer的内联reset；main14目标是5015A0内部支路，8/12为default。经典36/37同54C298字段值1两次出现不是代码；动态注册的两个正向补充也不证明全程序动态入口穷尽。未运行原件/VM/网络/设备。

[入口台账](../analysis/capability-first-v1/entry-admission.json) · [来源与规格](../build/analysis/required-entry-admission-v1/specification.json) · [本轮核验](../build/analysis/required-entry-admission-v1/validation.json)

<a id="required-context-contract"></a>

## 原37/10变体的有效处置（2026-11-10）

原10组pairs/caster、redirect/1010、结果metadata、projectile、charge0/3、72/113、96脚本、高阶/self、related73与实际接受逐项保留原义。原37累积需求未被当前110 parser类和局部测试结果截断。BU/BP/IE/BE已知源规则及后补关系复用，无新函数/反编译查询。

435000完整461B独立CFG与28B旧规范元数据并列；113/260准备/运行读序不重排，RID foreign/第四scratch与105共享cursor观察窗不补zero。98FF源提前返回、default ITM后续rawcursor和107原type-word/payload格式有明确规则，当前discard/结束/逻辑vitals不是成功等价，改归D4实现差异。其它实际缺失origin/准入及原范围仍保留。

本轮只审定原条款/有效源/差异/接受边界和共同接口，未把历史source/generated/product证据标为本轮运行，也未重启原程序或打开新REA目标。

[共同接口合同](../analysis/capability-first-v1/shared-target-contract.json) · [47行范围复核](../build/analysis/required-context-contract-v1/reconciliation.json) · [本轮核验](../build/analysis/required-context-contract-v1/validation.json)

<a id="legacy-full-inventory-publication"></a>

## 全量背包的字段、短尾与入场等待

**事实**。固定 SE 样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 留存的 `4F2310` 由 `?<E` 进入，首个名称在正文第 2 个 token。处理 28 个隐式槽，每槽 13 个字段。每个活记录步长 `0x65C`。两种回包共用十个数值栏的宽度与存储偏移，逐槽另带一个实际槽号。图形代码、业务类别与数量分别是全量每行第 4、11、12 栏。 [原字节、字段和调用](../build/analysis/full-inventory-publication-v1/source-review.json)

**事实**。全量按固定槽数处理。空名称和缺失的尾槽名称均清存在字和名称首字节。已定位且非空的终止前缀仍可发布，后续数值缺项由原读器给出 `-1`，首个数值栏再夹到零。逐槽名称在读取上限内遇管道才继续该组，未遇管道就保留此前已处理的记录并终止。两版表明全量循环、清空及背包投影一致于所核范围。 [读取器与字段表](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/full_inventory_publication)

**事实**。主 5 先写入场等待位 3，再清包含所有 28 槽的原数据区，随后打开资料接收门。主 9 的阶段 101 等待 `922C4C` 清零。地图通知或补丁解除位 0，所选本机角色资料解除位 1。全量背包以另一个状态 `924F30` 准入，在等待期间可以发布。 [入场与资料门](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/full_inventory_publication/entry)

**待验证**。首 token 的服务端含义、当前发行版及三端完整接线继续沿原范围验收。 [本机对照与用例](validation.md#legacy-full-inventory-publication-validation)

<a id="legacy-se-craft-inventory-selection"></a>

## 固定 SE 制造材料在背包变化后的显示与提交

**事实**。固定 SE SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。经典窗 11 的活动槽为 `C10558`。描述符 `52DFC8` 将初始化兼控件前更新、控件后绘制及析构分别绑定到 `476170`、`4767E0`、`4760F0`。编辑态的六个材料控件用 `478220`，开始后 `4748E0` 将这些位置改用 `478F30`。两种材料绘制均读取选入时保存的图标，鼠标提示沿相对槽加 8 读取当前槽的描述资料。`C5DCEC` 保存 `4DAC70` 以其当时技能及配方选择查到的值。 [REA 6.7.0、Ghidra 12.1.4 及指令核验](../build/analysis/craft-inventory-selection-v1/source-review.json) · [调用核验](#fixed-se-entry-business-admission)

**事实**。`?<E` 和 `?l)` 自身更新背包记录。编辑态 `478664` 起的六位置重查读取当前交换编号与数量，零数量按 1。附材读取类别并核技能 215/216 排除。空名清除保留的编号、数量及类别可令材料继续符合条件，因为重查读取这些栏。失配调用 `474380` 清关联和占用。合资格编辑遍历的材料控件在 13 至 18 号，23 号开始按钮随后读取五个关联标记和当前 MP。 [背包格式](#legacy-full-inventory-publication) · [窗口条件](../analysis/capability-first-v1/game-work-functional-specification.json#/inventory_material_selection/window_and_phase)

**事实**。`@Y)` 经 `5009B0` 完成活体交换，再到 `47F200`、`474420`。两个背包槽交换时，活动窗的六位用料引用跟随各自物品，原材料位置、组和图标保留。交换进装备栏时，`474380` 在共享计数交换前从旧背包槽释放该材料。随后 `47F200` 交换两个槽余下的占用字节，外层再发普通选择通知。 [交换与编辑规则](../analysis/capability-first-v1/game-work-functional-specification.json#/inventory_material_selection/receive_and_frame_order)

**事实**。普通制造计时已进入阶段 1 后，材料绘制停用编辑重查。`476170` 在无符号绝对时钟到期时读取当前配方和六位已存关联，先要求项，后附材，按各自的位置次序生成 `+>L` 的绝对槽号文本。计时中背包交换会改变上述槽号，装备交换会移除该槽。所选 Lor kind1 回调对六位逐项释放，后续清理读取有效位置才更改计数。 [提交、结果和用例](../analysis/capability-first-v1/game-work-functional-specification.json#/inventory_material_selection/deadline_and_retirement)

**待验证**。本节覆盖所选历史普通制造、合资格经典窗与正常 0–27 槽。单物品目标、装饰、另一套窗口、实际原版提示画面和当前同版仍各沿原规格取证。 [本机对照](validation.md#legacy-se-craft-inventory-selection-validation)

<a id="legacy-se-trade-inventory-confirmation"></a>

## 固定 SE 交易报价在背包变更后的确认与撤回

**事实**。固定 SE 样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。经典交易窗 43 的描述符 `52E748` 将控件 2、3、4、8 分别登记为发布、确认、独立撤回和本方报价面板。`46AB90` 先调用活动窗的 `4A2540`，再按索引分派参与的控件。初始化只启用这四个控件中的 2 和 8，发布及布局滑动结束后改用 3、4 和右移的 8，撤回沿相反过渡。 [REA 6.7.0、Ghidra 12.1.4 和原文件字节](../build/analysis/trade-inventory-confirmation-v1/source-review.json)

**事实**。`?<E` 和 `?l)` 发布后，`4CBCE0` 刷新本方交易缓存。经典窗口的 `4A5760` 调 `4A49D0` 检查和绘制本方物品，再按非负映射统计选择数量。面板展开时，存在且交易资格位 0 变为零的项会被释放。清空活槽时，所选分支跳过释放和该项绘制，非负映射仍可计数。同槽恢复合格时按当时记录再次绘制。`4A49D0` 的折叠分支早返，重查也就延后。 [资料发布、绘制与占用](../analysis/capability-first-v1/game-trade-storage-contract.json#/inventory_confirmation/offer_panel)

**事实**。`@Y)` 完成活体记录交换后，活动窗的 `4A22B0` 先改写匹配的绝对源槽并交换槽标记，报价位置保留。`47F200` 在其他业务回调后交换占用，外层再通知两槽并尝试搬交易和仓储缓存。经典报价映射可随物品移至装备槽，两个缓存搬移函数各自仍要求背包端点。占用交换前还有 `5E2778` 非零且端点为 7 的调整，普通静态用例以该开关为零为前提。 [交换入口及范围](../analysis/capability-first-v1/game-trade-storage-contract.json#/inventory_confirmation/inventory_publication)

**事实**。合资格的发布以当时的 20 个物品位、5 个宠物位及报价金币组包，保留 `源槽|报价位置` 及空洞。确认取双方阶段和严格的共享 500 毫秒时钟条件，发送 `,ua 1` 后才置本地阶段 2。再次按确认可经同一时钟发 `,3K`，独立撤回按其控件条件直接发送。所选资料刷新和资格释放本身均不发 `,3K`。 [命令与结果](../analysis/capability-first-v1/game-trade-storage-contract.json#/inventory_confirmation/command_order)

**推测**。由控件顺序可推导，回包已处理且发布或确认点击合格时，按钮可能先执行，面板才因丢失资格释放选择。若更早已释放，确认仍以双方阶段和时钟为准。具体原版回包和鼠标输入是否同轮到达、服务器如何处理旧报价、当前同版及实际结算待验。 [验收条件](validation.md#legacy-se-trade-inventory-confirmation-validation)

<a id="legacy-se-trade-pet-gold"></a>

## 固定 SE 经典交易的宠物、持有金币和报价金额

**事实**。固定 SE 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`FBY` 和 `G:w` 更新五槽活体并发布 `D72FB0` 的行映射，`J_J` 沿已证的同槽技能发布。窗 43 打开时，`4CBAB0` 复制当时的宠物到本方交易缓存，`4A47A0` 按五个 `0x5FC` 缓存的存在字计数。个人列表的绘制和选取仍读取行映射与活体资料。 [REA 6.7.0、Ghidra 12.1.4、原件字节](../build/analysis/trade-pet-gold-v1/source-review.json) · [宠物接收规则](../analysis/capability-first-v1/game-pet-publication-contract.json)

**事实**。`4A5220` 通过 `4A23A0` 读取五个报价位置的源槽。宠物存在时，`49CED0` 读取当前名称、昵称和等级等显示值。清槽时所选绘制分支画空，随后 `4A5760` 仍计入该非负映射。显式移除或替换使用 `4A2340` 清位置及宠物选中标记。 [宠物显示、映射和统计](../analysis/capability-first-v1/game-trade-storage-contract.json#/classic_trade_pet_and_gold/pet_publication_and_selection)

**事实**。`E(9` 将持有金币写入 `F53624`。个人面板 `4A4720` 在每次办理该帧时传入当时的持有值和金额编辑上限。普通数字盘 `46B530` 的录入和最大值动作使用该上限。提交由 `4A47A0` 将暂存值写入 `C43838` 并清暂存。两个报价栏分别读取本方 `C43838` 与对方 `C3B2A0`。发布按钮在个人面板之前处理，取已存金额和五个非负宠物映射组包。 [金额、控件与发布](../analysis/capability-first-v1/game-trade-storage-contract.json#/classic_trade_pet_and_gold/wallet_and_amount)

**事实**。本地撤回保留现有宠物映射及已存金额。`O#3` 清对方缓存和金币，并按已有条件把本地阶段 2 降为 1。`Ofl` 的 0/2 关闭沿抑制路径，`4A24B0` 退役时清残留宠物位置和选中标记。开新交易由 `4CBE20` 清本方报价。实际持有宠物及金币由普通资料接收方更新。 [发布、撤回、清理及重开](../analysis/capability-first-v1/game-trade-storage-contract.json#/classic_trade_pet_and_gold/publication_and_retirement)

**推测**。在当前窗与参与条件保持且未显式释放时，恢复同一槽会以原报价位置显示新资料。余额下降后若沿经典路径直接确认或撤回再发布，所选控件仍沿阶段、时钟和此前存入的值处理。原版同轮输入和同版结算继续验收。 [验收条件](validation.md#legacy-se-trade-pet-gold-validation)

第二套窗口的金额编辑、发布及回调顺序见[下节](#legacy-se-alternate-trade-gold)。

<a id="legacy-se-alternate-trade-gold"></a>

## 固定 SE 第二套交易窗的发布与金额回调

**事实**。固定 SE 样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。表 `559C10` 的第 49 行登记组 2、窗 52、回调 `4CC5F0`。活动检查 `4E94D0` 返回 0 时跳过当前调用，返回 2 时处理焦点、释放缓存并发送关闭值 0。活动帧以原始输入位选第二组标签。索引 2 通过 `4CCE42` 调 `4CC70F` 登记的 `4CF270`，第一组回调如参与则先执行。 [REA 6.7.0、Ghidra 12.1.4 和 LLVM 21 核验](../build/analysis/alternate-trade-gold-v1/source-review.json)

**事实**。发布条件为控件事件低位、本方阶段 0、无符号 `now > (last+500)`。从存在且选择字大于零的缓存生成两段，物品为 20 个缓存中匹配的序号加 8，宠物为五槽中匹配的原槽号。依次用十进制和 `|` 拼接。例如物品 8、10 和宠物 1、4 对应 `8|10` 与 `1|4`。`4CCC20` 读取已存金额，`4CCC3E` 调用 `+oj` 已有格式器，随后设置本方阶段 1、记录时钟，再分派标签回调。 [发布、确认与撤回条件](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_gold/offer_fields_and_order)

**事实**。`4CF270` 依序检查鼠标最大值、清零、退位、数字。一次按钮动作在本方已发布时发 `,3K`，即使金额相同。随后 `4E8EF0` 处理键盘，退格优先于数字，操作真正改值且本方仍已发布时才发 `,3K`。两条编辑路径均将本方回到 0，只把对方 2 降到 1。最后以有符号比较截低到当前余额，用 `%7d` 画出持有与报价。仅余额截低时该回调没有相位或撤回写入。 [控件与键盘来源](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_gold/amount_callback)

**推测**。若同一活动帧符合发布及金额回调的条件，已有报价 19、持有 7，且当帧没有金额编辑，发送取 19，随后显示 7，本方保持阶段 1。同帧键盘改值时则按先发布、再撤回、最后检查余额的次序处理。 [静态条件用例](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_gold/conditional_examples)

**待验证**。所选 `M6c` 接收和候选确认均建立经典 43。第二套窗仍需正向普通激活、实际输入和结算的证据。两个本方选择回调的缓存刷新和撤回见[下节](#legacy-se-alternate-trade-selection)。 [本机对照](validation.md#legacy-se-alternate-trade-gold-validation)

<a id="legacy-se-alternate-trade-selection"></a>

## 固定 SE 第二套交易窗的选择、搬移和资料刷新

**事实**。样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。`4CC6F9`、`4CC704` 登记本方 `4CEB80` 物品和 `4CF0C0` 宠物。物品查四行五列，宠物查五行。数量框活动时，两者抑制命中。合资格双击由原始输入位 `0x10` 准入，要求存在字非零、选择字非负，再异或 1。已发布时发一次 `,3K`，本方回到 0，只把对方 2 降到 1。宠物右键切换详情，离开该行重置详情，选择与阶段保持。 [REA 6.7.0、Ghidra 12.1.4、LLVM 21 字节核验](../build/analysis/alternate-trade-selection-v1/source-review.json)

**事实**。物品单击先选起缓存槽和图形，已发布时也会撤回。再次点同槽、点空白或沿所选右键取消分支可清选起状态。放置目标允许时，直接移动经 `4CEE1A` 发送 `'#Q`，槽号各加 8，第三个参数为 0。源有量、目标空且修饰键合资格时，进入数量框，初值为 0。`4CE020` 先处理确认和取消，再运行键盘编辑及按实时源数量截低。确认使用此前已存的非零数量，取消可恢复普通焦点。 [取放与数量框](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_selection/item_move_and_quantity)

**事实**。经典 43 的既有开窗入口清两侧缓存，再初始化本方 20 个物品及五个宠物缓存。全量和逐槽物品资料重建对应缓存，存在且符合资格时选中字清为 0，失去资格时写 −1。正常背包换位先换活体并通知，再交换完整缓存，选择字随记录转移。普通宠物接收的所选写入更新活体，已核第二套宠物显示和发布使用开窗缓存。第二组回调处理后重算计数，当前帧的发布先取处理前的缓存。 [读写及计数](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_selection/cache_refresh)

**待验证**。相邻窗 51 在其所选点击中发 `+i@` 后进入已经核实的经典 43。普通 `LsH` 入口建立经典 44。第二套 52 的普通打开和帧调用仍待正向来源。三端真实操作、数量框跨窗口退役及同版结算按原用例继续。 [候选与剩余条件](../analysis/capability-first-v1/game-trade-storage-contract.json#/alternate_trade_selection/activation) · [本机对照](validation.md#legacy-se-alternate-trade-selection-validation)

<a id="legacy-se-mail-attachment-refresh"></a>

## 背包刷新后的普通选择和邮件附件

**事实**。历史 SE 样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。编号 14 的窗口表登记 `4E12C0`，有效背包槽的左键分支写 `561AEC` 并置活动字。移动和丢弃沿该普通选择。槽变化通知 `4E1D20` 在当前值非负且等于来槽时尾跳 `4E1CF0`，重置普通选择及相关字段。 [REA 6.7.0 与原件字节](../build/analysis/mail-inventory-selection-v1/source-review.json)

**事实**。三条回包处理均检查 `924F30`。全量先通知每个槽再读名字，逐槽先读槽号再通知，后者的尾部组可在名称提取失败前使普通选择失效。交换先交换活记录及两槽的共用占用字节，再依包内参数顺序通知并刷新服务缓存。三条所选路径中的普通清除都保留邮件表单持有的附件槽号。在有效的两个背包槽之间交换后，该槽号仍指原位置，位置上的内容随交换变化。 [接收和缓存顺序](../analysis/capability-first-v1/game-mail-data-contract.json#/inventory_refresh_and_attachment_selection/receive_order)

**事实**。经典 23 号窗的提交控件读取 `C44DE4`。家族和个人发送分支先查正文与当前宠物，宠物状态为 3 可使本次控件处理结束。可提交时读取已选的物品槽。实际析构递减当前所存槽的占用字节，同一上下文重开可恢复正文，附件由本次窗口重新选择。另一套个人选号入口为 45，48 选宠后请求 49 表单及 50 网格。家族对应 88、87、86。两个网格采用原始左键双击位和实时存在、资格检查，两个表单按各自准入读已保存槽号。活动缓存可继续持有选择，尝试创建新网格之后才调用相应初始化清附件。 [表单窗口、发包和重开](../analysis/capability-first-v1/game-mail-data-contract.json#/inventory_refresh_and_attachment_selection/forms)

**待验证**。另一套窗口普通帧的实际调度、同版发送者最终结果和附件结算仍待有效证据。 [共用验收](validation.md#legacy-se-mail-attachment-refresh-validation)

<a id="fixed-se-classic-mail-reopen"></a>

## 固定 SE 的经典邮件草稿、群发列表和重开

**事实**。样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。经典 22 和 23 退役时共用 `497D10`。回调先保存当前视图、目标、群发模式、两个附件位置及正文，然后释放仍占用的物品槽。只有实际持有物品时，该退役回调才将当前宠物位置一同置为 −1。新建 22 若遇到活动 23，标记 23 并可先释放其附件。后续的退役读取当前槽。整批旧窗退役后按普通重建规则重置 28 个占用字节。 [原版规则和来源](../analysis/capability-first-v1/game-mail-data-contract.json#/fixed_se_classic_mail_reopen)

**事实**。重开比较当前视图与目标是否同时等于草稿的两项值。匹配时经 `55BCB0` 将原字节正文交给编辑器。原描述符指向 `C5DB88`，编辑器处理最多 287 字节的 NUL 前缀，再发布输入目标并清暂存的首字节。描述符校验拒绝时，22 写入默认指针并继续绑定焦点，该次没有重新装入。所查分支按当前目标、群发模式及活附件字段继续。 [编辑器顺序](../analysis/capability-first-v1/game-mail-data-contract.json#/fixed_se_classic_mail_reopen/draft_and_focus)

**事实**。普通重建经 `469590` 分别请求 22 和 23，22 的帮助体先写恢复字。战斗状态 10/1 经 `467EC0` 将两者的非零标记合成一次 22 调用，并沿当时已有的恢复字执行。22 的群发分支可设置 49 的列表保留字，49 新初始化时读取并清除。父窗自身的恢复字在编辑器绑定后清。满池、主分配失败及同号实例返回都未经新窗初始化。 [两条重建及子窗条件](../analysis/capability-first-v1/game-mail-data-contract.json#/fixed_se_classic_mail_reopen/group_list)

**推测**。父窗重开成功后列表保留标记可继续留到子窗初始化。在所查同步回退路径，已有子窗可在标记退役后再被同号构造返回。其实际退役仍按届时父窗与群发模式判断是否标记父窗。**待验证**。上述交错的运行结果、第二套窗口实际分派、同版邮件投递和附件结算、网页和微信完整操作。 [验收条件](../analysis/capability-first-v1/game-mail-data-contract.json#/fixed_se_classic_mail_reopen/acceptance_extensions) · [字节及本机对照](validation.md#fixed-se-classic-mail-reopen-validation)

<a id="fixed-se-classic-toolbar-status"></a>

## 固定 SE 工具栏、人物状态及称号窗口

**事实**。固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的两种工具栏均按左键事件切换，回调先标记旧窗、请求另一窗，随后写 `C15B40`。所查重建读 0、1 分别请求窗 4、5。保存经 `4B5960` 写保存记录、`4B57C0` 提交 `data/WinSaveDate`。读取成功沿 `4B5800` 恢复，默认及回退沿 `4B58D0` 归零。工具栏 4 的八个操作已对应对战、观战、组队、交换名片、交易、家族邀请、情绪动作及小地图。对战及观战沿各自原目标选择。 [描述符与具名调用](../build/analysis/fixed-se-classic-toolbar-status-v1/source-review.json)

**事实**。工具栏 6 控件 1 在四个人物窗都未打开时请求状态窗 7。窗 7、8、9 的页内切换复用当前坐标。关窗由 `0x8000` 请求，实际析构在活指针清除前把位置同步给同组其它窗口。`0x2000` 由另一控件请求重排。进入简介 58 另检查 `924F40` 的下限 8。 [窗口规则与验收](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_classic_toolbar_status/player_window_lifecycle)

**事实**。状态窗的两种阵位点击读取 `Q=[` 已发布的低 16 位。明细窗显示 `Or@` 的未分配点数，按当前五项值与点数总和的一半判断可加项。所选提交 `-gR` 只携带 0 至 4 的索引。称号窗从排序副本选择编号，反查原表首项后以现有 `-0]` 设定或以 `->#` 删除。自定义按已有 `-X}` 字节字段，窗口先做自身的文本变换。 [字段规格](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_player_window_wire) · [窗口与资料条件](../analysis/capability-first-v1/window-engine-contract.json#/fixed_se_classic_toolbar_status)

**待验证**。另一套窗正常入口、实际保存恢复和三端接线。同版服务器对加点、阵位及称号的权威发布继续沿相应用例。简介窗 58 的回程和编辑已有固定样本规格。 [本批静态与本地边界](validation.md#fixed-se-classic-toolbar-status-validation) · [简介窗口](#fixed-se-classic-player-profile)

<a id="fixed-se-outgoing-admission"></a>

## 固定 SE 的出站格式器与业务入口

**事实**。固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的 18 份格式器范围共核对 2,427 字节。REA 6.7.0、Ghidra 12.1.4 的函数档案与 Apple LLVM 21.0.0 解码及原字节对照，核出文件映射 `.text` 范围的 69 处直接调用。每条记录保留原业务、字节格式和 stage306 所有者。间接调用与实际可达性有各自的证据边界。 [逐条取证](../build/analysis/fixed-se-outgoing-admission-v1/source-review.json#/assignments)

**事实**。固定普通移动的地图扫描在 `4619FD` 调用 `4A31B0`，原三字节函数返回零。`461A8B` 写入类型 2 要求非零。挂起标记、剩余步数及类型均满足时，`461B05` 可进入 `461BF0`，以逻辑 X、Y 发送 `#Mi`。**待验证**。其它合资格的类型 2 写入或适用运行路径。D2 保留已证普通移动与现有组包。 [标记引用与载荷](../build/analysis/fixed-se-outgoing-admission-v1/source-review.json#/type2_movement)

**事实**。经典窗 21 的 `4945C0` 与 `496090` 共核对 18 个控件登记。所查发送分支依事件位 `0x04` 和实际名单读取 `;JE` 的参数。名片传类型 0 和真实槽，家族传类型 1 和成员 ID，迷你传类型 2 和联系人 ID。地图右键传类型 3 和场景实体 ID。D3 沿原名单边界补可见行映射与发送入口。 [名单规则和用例](../analysis/capability-first-v1/game-social-family-album-functional-specification.json#/classic_contact_detail_request)

**事实**。第二套 79 号窗的所查分支和经典物品路径共用 `6=L`。第二套窗于 `4CFD3E` 先送目标槽和已保存源槽，随后请求音效及关窗。离队成功的 `/Re` 沿已有来源编码目标 X、Y 和有符号朝向。所选制造先通知 `7ba` 的秒数，再登记截止时间。**待验证**。79 号窗的实际帧和退役、原版与 stage306 的阶段及发布差异，以及三端实际业务和同版结果。 [共用规格及批次](../analysis/capability-first-v1/game-communication-functional-specification.json#/fixed_se_outgoing_admission) · [本次核验](validation.md#fixed-se-outgoing-admission-validation)

<a id="fixed-se-send-operation-admission"></a>

## 固定 SE 的 17 个发送入口与实际业务

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。17 个所选格式器的 149 处直接调用与文件 `.text` 的相对位移一致。移动、拾取、用物、配方查询、交易、称号和对话回复沿同一条记录核对格式、操作及现有编码。交易 `+BQ` 继续共享原 500 毫秒准入，`+i@` 以原候选行号发送后进入报价流程。 [报文、调用和业务规则](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/send_operation_admission)

**事实**。宠物昵称 `.>3` 的三处经典提交先调用 `511180`，再由 `C218E4` 所选项取得 `D72FB2` 的原宠物槽。第二套 `4E05F0` 读 `C5E934` 所选项，确认且比较字节有变化时复制昵称。原样本的 `507690` 仅有返回指令，`4E080E` 把未作这一步文字变换的副本交给同一格式器。两处称号 `-X}` 直接调用前均执行 `511180`。 [指令、来源和开发差异](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/send_operation_admission/selected_text_producers)

**待验证**。第二套宠物窗的实际正常帧、确认和重开，`4E8726` 对应界面及其实际确认、`/1I` 的各业务有效回复，以及当前同版服务结果。D3 复用统一编码，按实际窗口入口保留昵称字节准备和目标原槽。 [本机编码对照](validation.md#fixed-se-send-operation-admission-validation)

<a id="fixed-se-mail-entry-admission"></a>

## 固定 SE 的邮件登记与所选操作归属

**事实**。固定 SE `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的经典 22 与 23 通过描述符挂 `497D10`，分别位于 `52E5C4`、`52E5F4`。22 的控件 2 与 3 在 `550224`、`550244` 挂 `498030`，分别进入附件窗和提交正文。49 的控件 20 至 26 共用 `4A7720`，由实际控件序号和滚动偏移选择一行。23 的控件 5 挂物品选择 `4989B0`，投递宠物由控件 8、9 切换。 [表项与原 MAIL 规则](../build/analysis/target-game-lifecycle-v1/mail-entry-source-review.json) · [控件分支核对](#fixed-se-classic-mail-compose-controls)

**事实**。经典 22、23 的正文控件共用 `497FA0`，在 `497FA7` 查输入 `0x02`，仅当所存目标变化时重新绑定 `C5DB88`，尾部另查焦点。经典 49 的控件 4 由 `46ADB0` 以 `0x08` 处理拖动，按实际控件记录修正位置及偏移。其它窗口共用该函数的 16 处登记仍按各自调用条件审定。 [原字节和控件登记](../build/analysis/target-game-lifecycle-v1/mail-entry-source-review.json)

**事实**。六条消息入口分为名片更新、三类来信与家族缓存清理，沿已有标签、外层字段和各自业务规则。另一套窗的十个已登记回调归属附件选择、群发、家族列表和排序。D0/D3 复用原邮件和窗口规格。**待验证**。另一套窗口正常帧分派与活动参数、同版可见结果，以及 MM-R1 的最终投递和附件结算。 [原邮件规格](../analysis/capability-first-v1/game-mail-data-contract.json#/fixed_se_entry_admission) · [核验范围](validation.md#fixed-se-mail-entry-admission-validation)

<a id="mail-operation-composition"></a>

## 选择重置交点与回复路径的原件规则（2026-11-10）

复用13份完整native（7,117字节/2,031条LLVM指令）及21个明确旧派生视图（13,338字节/3,688指令）；合计495个直接E8调用，派生不升级为REA规范体。没有新REA函数/引用查询，当前session open=false/cleanup_pending=false。

4E1CF0六写为561AEC=-1、C5EAC4/C221C8/C221CC/C16214=0、5625E4=1，不直接写C44DE0/C44DE4、C20F00/C1FC28、FBA960/FBA958。4E1D20匹配时4E1D2F的E9是尾跳，即使旧引用管理器标签为CALL也以opcode为准。4FF080已核bulk范围亦不覆盖六选择，但未外推全部间接写/别名。

经典496E80回复复制实际view/目标，条件释放保留物品并开22；497D10保存草稿和上下文，非统一丢弃。现代阅读/表单的活动、初始化、重复帧和一次inactive清理各异。所选提交/收件规则不提供发送者最终投递关联，不能由第三整数、FBY、Cz>/DMK或声音补造ACK。

[邮件操作规格](../build/analysis/mail-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/mail-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/mail-operation-composition-v1/validation.json)

<a id="chat-operation-composition"></a>

## 聊天初值、重置与原范围操作闭合（2026-11-10）

固定37c4/profile7810复用38份完整native及1个旧派生体，39个native范围18,128字节/5,384条LLVM指令；旧派生1122字节/345指令另计。补5组全局精确引用、54条有类型指令，21处写/RMW；没有新analyze_function查询。F5F170按实际指令为WORD，不能因早期请求DWORD而扩大其状态。

五字段在.data虚拟尾部，按[微软PE格式](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format)装载填零规则推导初值，不声称读取真实进程或证明首次调用状态。精确xref不覆盖所有别名；本轮另外核4FF080六个bulk范围，已发现F536BC的批量清零。D5D790/794/7A0不在这些范围，发送与接收重置分开。

443B60→445490→443AB0初始化公告X640/pass/active，所查体不清60FF30/34；替换亦保留X/tick。系统标记可交叠、气泡39/40分行保留余文，原绝对deadline和目标elapsed有明确差异。36项操作足以支撑G15原范围规格，未知全局别名和没有正向入口的新设置不再扩成无限必需前置。

[操作规格](../build/analysis/chat-operation-composition-v1/specification.json) · [原件与来源](../build/analysis/chat-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/chat-operation-composition-v1/validation.json)

<a id="game-application-exit"></a>

## 真实应用返回到CRT的所选链（2026-11-10）

51DDA5→45CC90，45DD10见0x12返回0，44FB60按该结果4505F0/4054F0后返回，WinMain调用5188B0处理FEEF30。51FCB8把参数和0,0交51FCDA，先动态反序回调，再固定正序表；其中51E0F0走mode1标准流刷新，52B24C按两槽值调用CloseHandle，52420B恢复异常处理器。未把没有Ghidra定义的三个回调/辅助冒充规范体；其独立原件指令和失败结果分别保留。

最终ExitProcess的句柄关闭含义取自[微软API文档](https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-exitprocess)，本轮未运行原程序、验证实际写盘或推断60FF20必被显式清0。普通角色返回与突然/重入/异常终止保持各自条件。534354的别名发布未因此被证明存在或不存在。

[退出规格](../build/analysis/game-application-exit-v1/specification.json) · [原件与来源](../build/analysis/game-application-exit-v1/source-views.json) · [本轮核验](../build/analysis/game-application-exit-v1/validation.json)

<a id="character-operation-composition"></a>

## 角色资料到入场的所选源规则（2026-11-10）

固定37c4的G02五项原范围已组合为24行操作，33份完整记录全部复用：32份角色/创建/选项体及后来family-members阶段已有的459920。后者的短文本明确为“无法删除家族负责人”，其按钮、输入忙碌和分配失败返回已核。删除确认后的455820完整体始终返回0，仍无可用服务端删除链。

预览字段与三条可行表路径已绑定，不把不可行的variant0/selector5组合中空表当运行故障。升级按锁存内容代和实时类别选请求；WDM完整体只有main13门槛。类别7读取923C40材料的生产仍未证，一处精确字面引用不是全局无写者证明。REA6.7.0/Ghidra12.1.4旧记录与Apple LLVM21.0.0字节核验分列，无原版执行。

[操作规格](../build/analysis/character-operation-composition-v1/specification.json) · [已有源视图](../build/analysis/character-operation-composition-v1/source-views.json) · [本轮核验](../build/analysis/character-operation-composition-v1/validation.json)

<a id="capability-specification-audit"></a>

## 当前游戏功能规格审定（2026-11-10）

G17原六项功能已用直接留言板来源、四个既有派生回调和共用输入/窗口规则形成固定37c4功能规格。另核C20280编辑目标可复用Enter插CR，提交清草稿/动作后关闭，以及4A7D30仅在mode0x15时重置。原头像投影、Windows编辑运行、依赖整合、真实服务端权限/结算及设备/现行接受仍未验。

G02删除等待的源限制不能当可用服务端删除；G20的4E1CF0完整43字节记录和六项重置已存在，仅具体选择器/上下文交点待合成。气泡配置534354必要发布/退出仍是具名来源问题；另一套激活及247byte片段按条件保留。

[当前逐能力审定](../build/analysis/capability-specification-audit-v1/specification.json) · [来源补充](../build/analysis/capability-specification-audit-v1/supplemental-source-views.json) · [本轮核验](../build/analysis/capability-specification-audit-v1/validation.json)

<a id="capability-first-research"></a>

## 当前：完整体归并、两套窗口规则与业务静态调用图

**29/32的用途与真实顺序**：5341B8/5341C8短字节指定GBK分别为“观战结束／结束观战。”，5341C4是ASCII U；32两载荷分别指562BD0“偷袭”和562BC8“被偷袭”。48E860是创建和每帧的cb30，低位1优先于2；4378D0的599E08是intro handle，437B30 ready时只在它非0才清低位。473370调用470C90的特殊早退后仍sound33/token1，原字节已核；无原版运行推断。 [来源合同](../build/analysis/battle-observer-entry-contract-v1/specification.json) · [核验](../build/analysis/battle-observer-entry-contract-v1/validation.json)

**既有来源前沿核对**：SO→OW→AW与BV→BU→BP→IE、QP→OC等10条所选关系已指向原文及规则；没有新native语义或原版运行观察。145份限定战斗元数据有17字面字段，其中4个hash偶然命中、2个observer词指程序观察接口。入口清单绑定29/32描述符及各4个已有根候选；只提供下一来源，不能据旧observer_index命名判观战UI。 [当前前沿](../build/analysis/current-frontier-supersession-v1/specification.json) · [核验](../build/analysis/current-frontier-supersession-v1/validation.json)

**共享占用实际准入**：复用21完整规范记录与5旧派生体/13,123B，冷核4156指令/295直接E8；6个窗口group/descriptor绑定匹配原件。48FCE0活动六shop默认不重解析，0x146/147/171/184/185/186替换序列先468F00(2)/(3)再发布新mode。43/53均group2；46C6B0请求与46C4E0第11合资格调用实际构造分开。无新REA查询/反编译或原程序运行。 [组合规格](../build/analysis/shared-occupancy-composition-v1/specification.json) · [核验](../build/analysis/shared-occupancy-composition-v1/validation.json)

**所选数量prompt来源**：复用12完整规范记录和13旧派生体/10,440B，冷核3225指令/168直接E8。42析构叶4678A0独立原PE核6B/2指令，排除10NOP；38/41/42共48控件定义匹配。九/七PUSH证明移动初值0；经典bank30/31、group2与prompt group4/命中规则形成条件正向重开链。无新REA查询/反编译，不把条件静态组合称原版运行。 [数量框规格](../build/analysis/quantity-prompt-lifecycle-v1/specification.json) · [核验](../build/analysis/quantity-prompt-lifecycle-v1/validation.json)

**B01/B04所选静态链**：复用7完整规范记录及13旧派生回调共12,047字节，LLVM独立核3265指令/268条直接E8；14条窗口定义及6条短字节串匹配原件。48AF90明确变身/解除的请求及scene、一次标志、普通资料、signed计时门槛；48B810与433CD0绑定计数/附件。退出/返回/城市/注销/重入复用原合同；无新REA查询/反编译，不声称同版或原程序运行。 [整链规格](../build/analysis/battle-input-exit-contract-v1/specification.json) · [核验](../build/analysis/battle-input-exit-contract-v1/validation.json)

**435000部分范围纠正**：复用5份完整REA记录，其中435000规范范围仅435000..43501B/28B；JNZ435018→43501C进入未纳入范围的尾体。原文件直接CFG闭合435000..4351CC/461B、138指令/38E8/2RET，排除3NOP，不修改规范库或私有Ghidra项目。其它既有体与主派生回调共17,766冷指令，新增完整闭包与旧28B重叠另列，唯一原字节67,329；三条107格式头匹配原件。旧完整伪代码复用，无新反编译。 [本批规格](../build/analysis/battle-preflight-boundaries-v1/specification.json) · [核验](../build/analysis/battle-preflight-boundaries-v1/validation.json)

**本批12/267必要源语义**：15完整旧REA记录通过现装工厂，另2派生明列；17体/124,931字节由33,035冷指令与3,340 E8逐项核原件，13个40A120动作表槽绑定实际入口。41DC00/41FE20从旧293MB载体流读2210原记录后按原ID保留，其它用独立小记录，无新查询/反编译。135 seed、155当前计数、235事件门槛、236/237发射区别、267结果counter2同回调递减及子体删除后继续成规；全体字节身份不代表全部业务语义已审。 [本批规格](../build/analysis/battle-utility-consumers-v1/specification.json) · [核验](../build/analysis/battle-utility-consumers-v1/validation.json)

**当前战斗源复用边界**：51份旧规格和49份后续source-check的选定metadata均保留身份；当前parser显式110类/专用108路由分栏。复用完整派生4260B0的54,685字节/14,120指令，逐指令原PE匹配；仅3个所选冷读窗776字节支持12的producer和267比较/JZ/前置。未新反编译，完整体字节身份不表示全体语义已审。12按53/38/135/62及78/155生产，267按24/53/38/235/62；其必要身体/效果和恢复语义待复核。 [本批对照](../build/analysis/battle-variant-coverage-v1/crosswalk.json) · [核验](../build/analysis/battle-variant-coverage-v1/validation.json)

**当前选择/数量所选源规则**：37完整视图/21,459字节、6,540冷指令/443 E8匹配原件；25旧、2新规范、10独立派生保留不同权威。20/5位置是signed8，物品释放按byte减少共享占用，宠物仅清自身标记；数量callback读当前from/to。4CCC20处于旧4CC5F0另一套52回调的发布分支，未在内部种函数；实际另一套激活仍条件未证。[本批规则](../build/analysis/inventory-selection-ownership-v1/specification.json) · [来源核验](../build/analysis/inventory-selection-ownership-v1/validation.json)

**前组复用规格对账（非新原生观察）**：40能力逐项关联246处保留事实/设计声明；当前21个共享层82条历史未决不等于82个新需求。所选结果/恢复、工作byte、bank、资源/声音/效果/粒子规则已记录，不再按旧泛化缺口重取。当前24个战斗token可定位源码分派，但token存在不证明全部payload、变体、身体或恢复等价；只为具名缺证补源。[逐项对账](../build/analysis/capability-source-reconciliation-v1/reconciliation.json) · [战斗命令对照](../build/analysis/capability-source-reconciliation-v1/battle-command-crosswalk.json)

**前组状态消费者事实（固定旧37c4）**：29规范体/13,821字节/3,780冷指令/443 E8，24旧/5新增；整段main/battle记录只作所选天气上下文语义审查。54 typed refs、552字节辅助数学/截断、96字节descriptor、10字节文件初值与68字节float字面另核，未读BSS运行值。133 Evidence/70 primitive、114导入保持且已关闭，无新种子/派生体。[合同](../analysis/capability-first-v1/game-entry-review-contract.json) · [核验](../build/analysis/particle-lifecycle-contract-v1/validation.json)

**当前三委派与普通菜单链（固定37c4事实）**：45视图/8817字节含8完整旧记录、31旧派生与6必要新规范；1506派生指令、167 E8、5经典描述符和130控件核原件。两级目标选择已连到47E740/47E880，实际-1析构、-2取消、-3返回不混用；类型0x26..28的经典60..62数据/失效条款另列。31旧派生保留其分析权威，所选条款不等于全部辅助体/全局重入。REA导出/快照各23，17导入记录未变，已关闭。[事实/剩余](../analysis/capability-first-v1/game-service-invalidation-contract.json)

**当前37接收源规则（事实，限定旧37c4样本）**：20份原REA完整记录及17个旧派生体，37范围/7421字节、721派生指令和148字节标签存储核原件，无新反编译/原生查询。9类规则保留门槛、16/32位、部分写入和不同缓存/通知顺序。`?<E`实为28物品槽/0x65c全量发布，旧G15候选不作业务事实；GC虽无线路参数仍有清理/保存效果。所读标准world/session/client链尚无这37项的专用业务更新，外部自定义回调不在结论范围。[规则/证据](../analysis/capability-first-v1/game-entry-review-contract.json) · [标准代码边界](../build/analysis/receive-publication-review-v1/code-reconciliation.json)

**当前源目录与代码差异（静态事实，限定范围）**：固定旧版文本目录的104接收项逐字段对应既有字面目录（96分派、7 no-op、1 reset/bootstrap）；原60发送之外，现有代码已另含6个来源核对过的发送入口，共66项，本批未新增序列化器。对世界状态、登录、选角和网页会话代码的AST检查得到52个效果赋值guard、7个其他operation-id guard、8个解码控制及37个未在选定范围找到主guard的待核项。guard存在不证明完整消费者；37项均有留存入口来源，应先确认其他所有者或无效果含义，不能称37个缺失功能。此37与历史37条复合要求无关。未执行产品模块。[静态结果](../build/analysis/capability-readiness-review-v1/protocol-routing-static-review.json) · [可重放脚本](../build/analysis/capability-readiness-review-v1/inspect-protocol-routing.mjs)

**本批重建来源事实**：15完整原记录/2,170字节逐份验收，5复用、10必要新观察；671个Listing边界、64处CALL、4处尾JMP、1处MOV回调指针及四个sidecar坐标均核原件。无新函数种子或派生；REA导出/快照各17条（7导入、10本批）并关闭。过渡对象回调才尝试实际窗口构造，失败后备及marker筛选/消费按源保留。[来源](../analysis/capability-first-v1/dispatch-binding-source-check.json) · [规则](../analysis/capability-first-v1/game-dispatch-findings.json)

**本批共用状态事实**：18限定视图共10,901字节，含12份完整原记录/8,286字节（8复用、4新增）、5旧派生/2,596字节/756指令，以及1份19字节缩减投影；后者不计完整记录。12份原记录逐份工厂验收；128候选均核原字节，20辅助CALL和36个有限MOV目的已绑定。导出/快照各7条，其中3条来自既有快照、4条是本批观察，REA已关闭。整个97回调集合没有直接E8/E9命中不证明不可达；当前实际接入经典帧。[来源](../analysis/capability-first-v1/dispatch-binding-source-check.json) · [规则](../analysis/capability-first-v1/game-dispatch-findings.json)

**当前来源复用事实**：同一名片/邮件规格累计138个限定视图/56,176字节；原122视图保持，追加8完整原记录与8派生视图（四个旧体复用）。累计71原记录逐份工厂验收，9,553派生指令、996处E8 CALL及69恢复锚，尾JMP与CALL分开。四字段34处字面引用、四个现代行/描述符与当前保存栈均核原件；字面引用不等于写者/别名闭合。两批REA各4/3导出和关闭，新规范7条，复用原记录1条。旧513bb0前缀不提升为完整体，局部字幕渲染编码仍待证；未运行原程序或产品。[来源](../analysis/capability-first-v1/game-mail-data-source-check.json) · [当前合同](../analysis/capability-first-v1/game-mail-data-contract.json)

**当前回调覆盖事实**：真实指针4f63e0给出91字节数字格式化/发送，4df420的旧函数元数据仅502字节，原生Listing在4df616未解码；不能据更长伪代码声称全体已核。独立副本仅清理该处15字节Listing标记后，正向流覆盖903指令/3,211字节，并核五项20字节跳转表。另复用6份完整规范及1份投影/1,567字节、7个旧派生体/3,288字节；规范函数归属未改。1,703旧证据全记录保持，3个新指令观察后导出1,706并关闭；原程序未运行。[来源](../analysis/capability-first-v1/game-ui-producers-source-check.json) · [合同](../analysis/capability-first-v1/game-ui-producers-contract.json)

**当前来源结果**：21发送前沿已有上下文。复用12个旧规范根/14份完整记录观察、9个旧派生根/4,022条指令/13,799字节；9个缺失规范体共6,628字节新取。完整引用补得8个CALL，6处对应旧派生所有者，所选图另有2个正向CALL；原生owner=null仍保持。eadf88已有传统/另一套界面的文本复制、排版/绘制和整块清零来源；4个ef35e0命中仅为数组结束CMP，不能当低字节读者。REA旧1,676记录不变，新导出1,703并关闭；本轮未运行样本。[来源](../analysis/capability-first-v1/game-producer-context-source-check.json) · [合同/剩余链](../analysis/capability-first-v1/game-producer-context-contract.json)

**本组生命周期事实**：同版快照的原40a0a0/40a0c0/464c70正文经9个完整分页恢复；8个已有规范体/1,899字节及旧派生4ea9b0的250指令/720字节核原PE。对象+8的实际消费者409fe0、三组逻辑1复制到+174/+178/+17c及+170读取门槛已绑定。单个和批量清理先标记；循环符合flag/相位条件后摘链，再处理附加区/主体。1667旧记录保持，新增9个view后导出1676；无新反编译/样本执行。[来源](../analysis/capability-first-v1/game-graphics-lifetime-source-check.json) · [合同](../analysis/capability-first-v1/game-graphics-lifetime-contract.json)

**分派边界**：现代表99行/1,980字节重新核原件，97个非空业务回调均无经典/控件/主槽精确地址交集，且在647根/3,506目标项的现有CALL索引内无入边；图外/间接/完整跳转覆盖仍未知。4ea9b0是泛型对象回调，不能冒充这97个业务回调的消费者。后续按具体新边补证，不重复相同零结果。[核验与范围](../analysis/capability-first-v1/game-graphics-lifetime-validation.json)

**本组事实**：固定37c4的72个无旧候选标签根已逐项复核，全部为已有规范REA体。113个记录选择器包含41个同ID重复根，逐根核心身份相同；72范围/12,617字节和68 tag/272字节核原PE，无新反编译/原程序执行。39发送、29接收及4个非协议根的角色与缺口逐项登记；18发送有复用业务证据，21仍待具体调用路径。4f36d0按实际C/P/A/U/M分支归战斗，不能按旧引用文档标题归角色选项。[来源锚点](../analysis/capability-first-v1/game-entry-review-source-check.json) · [归属层](../analysis/capability-first-v1/game-entry-review-contract.json)

**覆盖边界**：保留dossier没有incoming_references/relationship_coverage，不视为完整调用覆盖。8个发送的caller列表为空，其中3个有其他正向业务证据；48a060也无直接caller而存在窗口帧表归属。5015a0独立数得15条非立即数CALL，旧provider unresolved_calls=0是不同指标，不推导其全部已解或全部未知。旧647根图及历史验收回执保持原哈希；本组是额外语义层。[本组审计](../analysis/capability-first-v1/game-entry-review-validation.json)

2026-11-08 按用户新顺序，先完成[全部需求能力的 REA 与规格](development-plan.md#capability-first-workflow)，不继续逐小分支编码。现有旧版分析和实现保留；当前能力初表为[40 个域](requirements-index.md#capability-first-inventory)，发现边界与分析门槛仍未关闭。

**入口事实**：REA 确认另一套窗口表 559c10..55a3cc 的边界和步长 20，99 行中 97 个非空回调；传统两张 67 指针表分别位于 5599f8/559b04，指向 66 个连续 48 字节描述符，其中 36/37 号共用描述符。2,309 控件出现位置对应 2,290 个不同原文件记录；其原始步长为 32，运行对象副本为 36。5015a0 的 14 项主跳表有 12 个明确状态，8/12 指向默认分支。104/60 文本接收/格式化发送目录直接复用并核对标记字节。[表与入口](../analysis/capability-first-v1/entry-inventory.json)

**入口事实**：2,768 处引用去重为 647 函数。175 份同源检查和 572 份留存 native dossier 元数据用于定位复用；索引没有引用的 480 个入口由源表/调用者锚定，在独立 Ghidra 副本批量恢复，全部 73,645 指令/258,651 字节匹配原 PE，原件未执行或改写。这些为派生分析，不冒充新增规范 REA 函数；33 个间接调用点仍待闭合。[派生范围、调用目标与核验](../analysis/capability-first-v1/entry-source-check.json) · [证据索引](../analysis/capability-first-v1/entry-evidence-index.json)

**当前归并事实**：647根的登记地址集/视图已定位为143规范留存、503已有派生、1伪代码/调用者范围/原字节组合证据，无需重新反编译这些根。84,910条派生指令/298,021字节均匹配原件；规范体的33,810字节范围另核原文件哈希，不将其混称为本轮新provider内存读取。所选图有3,506条静态边，160根具有到既有格式化发送函数的路径；图外函数和路径条件不外推，72根暂无旧能力候选。[登记范围及静态图](../analysis/capability-first-v1/business-entry-map.json) · [来源检查](../analysis/capability-first-v1/business-map-source-check.json)

**本组事实**：46ab90 的顺序为操作状态→池整理→绑定窗口→body/拖动→cb30→参与控件事件→body 消费→cb34；cb30 还在创建时以 -1 调用。469670 是绘制器，46a1f0 才分发控件输入；参与值必须等于 1，即使事件 mask0 仍会调用回调。bit400/800 是重复脉冲，不是松开；2000 是按有符号顺序键重排，8000 是下次整理销毁。468f00 接收组掩码并同步销毁；业务析构可发送回复，49aa00 的 C 回复是反例，不能全局默认静默。[完整来源规则与未决](../analysis/capability-first-v1/window-engine-contract.json)

**本组事实/待验证**：7 处 current-window 直接写均绑定来源；4 处位于新恢复的 4a8e20，它经 4a8f70→46c7c0 动态登记，phase2/4 暂绑 id53 缓存对象后恢复。它不在此前 647 表/协议根入口统计内；不由直接写搜索排除别名。36/37 的 type0/值1 记录初始 participation0、width0，初始化未见启用；但通用事件没有类型保护，动态 c1e868 钩子的后续写入未闭合，不能宣称始终不可达。[注册锚点及字节核验](../analysis/capability-first-v1/window-engine-source-check.json)

**另一套窗口事实**：4ea460/4ea5b0操作两活动槽，并按group/旧secondary条件保存和恢复id1；4ea6f0是活动查询，不是分配器。4e94d0的inactive路径调用40a090并清图形缓存，dirty非零时清位并一次返回2；active路径先尝试创建并调用可选初始化，再检查缓存及图形对象+0x170的逻辑值。4033d0的SETLE和4e9623的ECX绑定证明该值<=0时跳过，不能当作鼠标已消费条件。4ea170仅比较60ff08文本焦点。4e9d00的事件编码也不同于传统46a1f0。[16体/2,392字节核验及合同](../analysis/capability-first-v1/alternate-window-contract.json)

**本组分发补证**：可执行文件节内到lookup4ea7a0的E8/E9候选共6处，5个规范指令/1个独立派生指令均绑定CALL，归入5个函数体。最后一个4ea740为82字节/29指令toggle：按row图形缓存是否为0选择open/close，返回1/0而不转发其结果，不能以此证明打开成功。461d00/461e00会在restore flag0时保存id1活动；4eadc0延期action3调用恢复，action1/2另推进经典命令。3个规范体/460字节与派生82字节均核原件，只有4eadc0为新规范分析。[来源及严格搜索边界](../analysis/capability-first-v1/game-dispatch-findings.json)

**前序研究**：固定旧版 `cg_se_6000.exe`，1,569,280 字节，SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA 6.7.0/Ghidra 12.1.4。此前另一套技能/工作窗口共 27 个派生入口的 31,250 指令字节逐项匹配原 PE；属于独立分析副本补建的入口，不是规范函数清单。`0x559c64` 的回调指针指向 `0x4e5a50`；`0x4e5e51/0x4e5ef4/0x4e5f9a/0x4e5fcc` 分别显式把 BL 写入工作等级字节 `0xc5bd1b`。初值不能代表其全部生命周期。[来源、文件偏移与核对结果](../analysis/game-work-lifetime-v1/research-summary.json)

**留存状态**：入口1,578/native快照1,577、传统规则各1,619、前序归并各1,656按原范围保留。本组游戏导出/快照各1,667；登录器249属另一目标，分开记账。独立派生不是规范REA函数。会话已关闭且cleanup_pending=false，没有原程序执行、产品功能或构建变更。[本组验收](../analysis/capability-first-v1/dispatch-bindings-validation.json) · [前序归并验收](../analysis/capability-first-v1/business-map-validation.json)

**待验证/下一步**：逐组关闭业务条件及收发/共享状态，定位另一套表callback列的实际消费者/active生产者，补图形+0x170/40a090/4ea9b0、键盘/IME/RNG、钩子/type0激活和全部恢复。有限xref/字面常量/E8搜索未找到直接分发，不证明回调不可达或框架无用，不据此删需求。登录器类/构造/继承及其他版本/子模块也继续补证。以上归入完整能力范围，统一分析门槛未通过；下方各阶段按当时已证范围保留。

<a id="stage306-work-context"></a>

## stage306 精灵变身开关、配方上下文与 type5 来源

**事实**：REA6.7.0／Ghidra12.1.4，固定 cg_se_6000.exe SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。19 个正式函数／8,758 字节和 11 个派生入口／13,688 指令字节均与 PE 原文件核对；1,514 记录导出，REA 已关闭。[函数、偏移、哈希与证据](../analysis/game-work-context-v1/source-check.json)

**事实**：普通 xrefs 没有识别正向写入；字节搜索和文件内 0x54164c／0x54168c 的回调指针分别指向 471e00／471f00。独立 Ghidra 副本播种后逐指令复核：471f00 检查 gate 位7、43b420、f53538 非0、f5353c>0、技能 kind 非0及 c5e948==0，发送4f7b50(displayX,displayY,61／62)，立即写上下文1／0。472a10 进入制造配方时获取子窗口计数，471e00 返回等级时释放，因此开关只在当前等级界面开放。

**事实**：4f0290 按当前上下文给制造配方查询槽加100；4f28b0 在回复时标记当前上下文；472a10 重查失配的配方，4731a0 拒绝失配选择。55b024 的7字节为100／95／90／85／80／75／70；4748e0／475360 用 signed32 乘积截断，475e50／4799d0 对乘积按 unsigned32 除100。MP成本不随开关额外缩放，修理／鉴定 rank 加布尔上下文。

**事实**：type5 的472a10分支发送当前槽（启用时+100）、选中等级、-1和空字节；只有本机附属区+38子体为空时检查MP。该子体复用既有坐骑来源。Lor 分派4f2b30仅处理1..4，未证明type5结果；不能展示虚构成功或预扣MP。

**待验证**：7字节表之外的tier、全部原生窗口计数／全局刷新交错、c5bd1b全部动态写入和现行版本／官方接受。派生入口是分析者播种的静态证据，不冒称正式 REA 函数或动态执行。

<a id="stage305-work-targets"></a>

## stage305 目标列表、结果和连续采集来源

**事实**：REA6.7.0／Ghidra12.1.4 分析固定 cg_se_6000.exe，SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。核对 21 个正式函数／8,585 字节，其中 12 个为本轮新函数，9 个复用父阶段；13 个另行派生入口／5,659 指令字节也已逐字节复核。保留 1,407 证据记录，REA 已关闭。[入口与哈希](../analysis/game-work-targets-v1/source-check.json)

**事实**：4d5d90 将 221／222／223／224 映射到变装／变身／急救／治疗。472a10 发 *[c；4f4640／4d6890 消费 KxC，47aa90 安装角色列表；47a960 可直接提交或发 *^X。4f4660／4d5dd0 消费 L<%，47acd0 安装角色／宠物明细，47abc0 发送源序号。两回调由正式函数中的指针明确播种，不冒称正式 REA 函数。4d5110／47aed0 的 kind3 属性使用同组结果全局。

**事实**：window12／13 描述符与模板均经 REA 读字节并与 PE 原字节核对，导出各工作回调。479670／4799d0 的普通初始等待为 2,000＋4,500ms；479f80 用严格无符号 now>deadline，479b70 展示结果后超过 2,000ms 再检查 MP 和空位。479b70 禁用重启按钮，479880 暂停后启用；不是结果期间可提前重启。

**待验证**：非零上下文、其他 id／分支、完整原生动画／控件和动态共享别名。原生目标名槽为 17 字节，越界名字不据此推定合法协议或完整溢出行为；独立实现限于已证名字范围。

**补核事实**：另核对 5 个函数／4,412 字节，联合已核 26 函数／12,997 字节，最新导出 1,426 记录并关闭。480ac0 将宠物 0x6aa 的 signed16 值复制到 C1FC14 临时表；47ffa0 正常宠物列表刷新调用该复制。当前共享核心使用已接收记录，原生所有全局编辑／刷新交错等价仍待验证。[宠物模式对应证据](../analysis/game-work-targets-v1/pet-mode-check.json)

<a id="stage304-work-actions"></a>

## stage304 物品工作、刻印与装饰来源

**事实**：REA6.7.0／Ghidra12.1.4 分析固定 cg_se_6000.exe，SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。本轮核对 28 个正式函数／11,974 字节；另复核父阶段 14 个派生入口／14,129 指令字节，不将它们冒称正式函数。保留导出 1,359 条记录，REA 已关闭。[入口、字节与证据](../analysis/game-work-actions-v1/source-check.json)

**事实**：472a10 将 type2／217..220 引向 474100（window11/state3），type1／255 引向 474240（state6，原文“装饰”）。475360 计算修理／鉴定耗时；475e50 固定装饰 8 秒；476170 分别提交既有 +>L。4eb150 扫描任一主技能 identifier200..214 的全部 56 个产品 id，不能复用普通制造遇负 id 停止的前缀扫描。475c40／4756d0 与 4d7ec0 消费 kind2；装饰沿既有 kind1 结果。

**事实**：443ab0／444b80 与 55b24c 描述符证明刻印是一行 16 字节；55b030 的 12 为字号。提交等级读取 c5bd1b 的有符号字节，静态加载初值为 PE 虚拟零填充 0，并非所选等级。相邻三字节提示选项表的有界写入也已核对。

**待验证**：该共享字节所有动态别名生命周期、完整原生窗口／动画／全局 RNG、非零上下文。kind3→4d5110／47ae00 和 kind4→4d3e50／479f60／479b70 仅完成分支定位；437410 是空背包槽计数，不据此推定队友目标。

<a id="stage303-craft-input"></a>

## stage303 制造选择、材料与结果证据

**事实**：REA6.7.0／Ghidra12.1.4 分析固定 cg_se_6000.exe，SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。核对 30 个正式函数／7,597 字节、15 个另行派生静态入口／14,373 原始指令字节及 1,252 字节窗口；导出共保留 1,287 条记录，REA 已关闭。[哈希、入口与出处](../analysis/game-craft-input-v1/source-check.json)

**事实**：4731a0、472a10、478220、476170 等入口由已记录指针／调用点另行播种导出，不冒称正式 REA 函数。470a20／473f90 选择配方，4746a0 初始化，4748e0 计算成本／耗时，501160 发送工作姿势，4da060／4f2b30 消费 Lor 制造结果。首行说明标志与 qualification 分离；所需材料先按关联顺序装配，再接可选附加品。

**待验证**：原生全局 RNG 交错、窗口别名和动画完整等价、修理／合成／非零上下文、当前版本和真实平台。派生源码仅存本地 build；公开证据只有元数据与独立原创夹具。

<a id="stage302-craft-recipes"></a>

## stage302 配方布局、文本保留和部分重置

**事实：** 固定 cg_se_6000.exe 为 1,569,280 字节，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0／Ghidra 12.1.4 复核 10 个规范函数／1,939 字节：4f28b0、4ff030、4f6d00、4f0290、4ff080、470dc0、510d80、510e50、5111a0、510de0。1,153 条证据导出、快照保存，会话关闭；47176f 未找到规范函数，不据此补造配方显示条件。[来源](../analysis/game-craft-recipes-v1/source-check.json)

**事实：** 每技能 0x49fc 字节，配方从 +0x698 起，共 56×0x134 字节；每份有 7 个字段和 5 个材料三元组。配方数字落在 +0x00／0x04／0x08／0x0c／0x10，名称 +0x14 最大 28 字节，说明 +0x31 最大 56 字节；材料从 +0x6c 起、步长 0x28，名称在材料 +0x08。名称和说明以反转义后的字节长度判断，超长保留原目标。4ff030 只把配方和材料编号置 -1、+49f8 上下文置 0，其他字段和文字保留。4ff080 初始清零后对 15 槽执行该重置。

**事实／待验证分界：** @_i 接收者为 4f28b0，kind1 主技能请求由 4f6d00 生产；470dc0 会在已存上下文与当前上下文不同时重查。本轮只接通初始化为 0 的上下文，制造输入、结果与其他上下文继续追踪。

<a id="stage301-battle-item-dispatch"></a>

## stage301 ITM 默认返回与游标

**事实：** 样本 cg_se_6000.exe 为 1,569,280 字节，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0／Ghidra 12.1.4 核对五段 2,251 字节；434670 与 436930 两个规范函数共 407 字节。既有派生 4260b0 的 14,120 条／54,685 字节逐条重核，其中本轮窗口覆盖 1,844 字节。当前规范模型仍未把 432616 纳入函数体，不把逐指令证据称为新规范函数。1,121 条证据导出，会话关闭。[机器记录](../analysis/game-battle-item-variants-v1/source-check.json)

**事实：** phase0 在 432678 读取编号，保存 58fb44，分别以零、减 6、再减 1 分派；其他值到 4335a3。公共返回保存 object+84 的编号状态，不调用 436930；读取游标在 object+64，未改变命令 phase。**待验证：** 下一次 phase0 会从已前移的原字节游标再次读取，不能据此断言永久等待或成功空操作。预先猜测的 43261e 不是指令边界，该负面观察保留；工艺查询仅是后续定位，不算已移植。

<a id="stage300-city-water"></a>

## stage300 回城场景与外层循环的来源顺序

**事实：** 固定cg_se_6000.exe，SHA256＝37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd，REA6.7.0／Ghidra12.1.4。4ef870在922c4c为0且main9时切200并经4ff430清本地指针；main10收到同一场景消息不进入这段。main9/205捕获地图但不调用4ff160；边界main9/11先4ff160／4ff3b0重建再捕获。4f16d0的真实本地角色资料可独立触发创建。17函数／15,221字节匹配原件，旧请求菜单253字节沿stage239原证据重新比对；1,090条证据与快照留build，REA关闭。[原字节核验](../analysis/game-city-water-v1/source-check.json)

**事实与推导：** 外层44fb60依次分派状态、442f20、506030、505b50。442f20只在本地指针存在时调用505b70加0.25；嵌套捕获不保存前次位置。结合请求菜单未切换main9，可推导等待回复期间仍执行普通更新／绘图；不由此推定完整原对象、移动、RNG与音频调度等价。[限定规格](../analysis/game-city-water-v1/implementation-spec.json)

<a id="stage299-battle-water"></a>

## stage299 正常战斗门槛与嵌套捕获

**事实：** 固定cg_se_6000.exe，SHA256为37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd；REA6.7.0／Ghidra12.1.4。4f3430仅设置待处理战斗，501a50的main9/3调用4ff430清除f5e8dc并写9250c8=1，之后进入main10。442f20只有本地指针非空才调用505b70增加0.25；506820在门槛非0时归零振幅并返回，普通纹理照常绘制。24函数／14,881字节逐字节匹配原件，1,059条证据及快照留build，REA已关闭。[原字节核验](../analysis/game-battle-water-v1/source-check.json)

**事实：** 437a90经506ac0以优先级200排队背景，再嵌套5059f0／506030，所以特殊背景会触发水面处理；423340后续直接复制缓存面，不重新排队。437b30退出写门槛0；main9/11通过4ff160／4ff3b0重建本地对象，地图嵌套捕获先于外层442f20；main9/2虽只呈现捕获画面，相位仍按本地对象存在推进。505b50只在外层呈现后保存位置，嵌套506030不保存。

**来源修正与待验证：** stage298的生命周期门槛推测由本次main9/3证据限定补齐；不能只看战斗函数或将ordinaryGate所有业务用途等同9250c8。提前own unit可在等待结束前恢复本地对象，须按实际存在判断。其他main9／城市／错误／停止与原驱动／缓存仍待验证。[限定规格](../analysis/game-battle-water-v1/implementation-spec.json)

<a id="stage298-ordinary-water"></a>

## stage298 水面标记与原始条带分派

**事实：** 固定37c4模块，REA6.7.0／Ghidra12.1.4。505bd0／506ac0／506d50／506e80在3096..3105索引提交时置标记；5059f0在裁减前选择3／4辅助项，追加优先级2的type8；506030调用506820。506820快照640×480后发出60条8像素带，源Y＝目标Y＋12＋trunc(table[(phase+i)&63]×amplitude／100)，完成后振幅每次加2至100。相位由505b70每更新加0.25，506970减去前后玩家投影Y差／8，505b50在呈现后保存位置。地图门槛为40000..41999及59000／59001／59100。22函数／15,352字节和268字节表逐字节匹配原件，1,026证据及快照留build，REA关闭。[原字节核验](../analysis/game-special-graphics-v1/source-check.json)

**推测与待验证：** 9250c8为生命周期／停止门槛，观察的初始化／返回路径写0、退出路径写1；不据此新增用户偏好或协议字段。BltFast不能裁剪，源码忽略返回值；越界条带保留和视口补零属于明确的可移植策略，原驱动行为及type6/7缓存未测。[规格](../analysis/game-special-graphics-v1/implementation-spec.json)

<a id="stage297-body-draw-flags"></a>

## stage297 309掩码与队列推进

**事实**：固定模块SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0／Ghidra12.1.4；4完整函数／63,230字节与原文件一致，另核对其中4136d0起84字节。913条证据及快照留build，REA已关闭。[证据](../analysis/game-battle-gmn-flags-v1/source-check.json)

40a120动作164在4136fb写actor309=ff，165在413710写309=0；两者各调用434a30一次。没有在这两个分支写310、308、300或30f。434a30推进fc4，读取ca4动作；尾标记或索引200选择身体状态231。506e80保留独立颜色覆盖、309／310绘图覆盖和最后的ghost alpha顺序。

**待验证**：正常协议生产者。已初始化.text的两项完整PUSH imm32搜索均无匹配，不能排除MOV、表驱动或其他生产方式；较宽a4初搜未穷尽，大函数value-flow仍截断。本阶段未重复大函数分析，也未把搜索无匹配当作不可达证明。[规格](logic-protocol-spec.md#stage297-body-draw-flags)

<a id="stage296-actual-battle-product"></a>

## stage296 复用来源证据核验实际消费者

**事实**：本阶段复用既有战斗入场、动画／绘制及CUT来源证据，没有新增二进制分析或执行。固定模块仍为37c4；所用证据与材料配置的完整身份见[规格](../analysis/game-actual-battle-product-v1/implementation-spec.json)。不得把材料文件后缀当作该模块或服务器的版本声明。

实际角色100010有160个动作，8个方向均有0／1／2／5／6，原始信号帧24个；背景300653对应group4／index618381，640×480。素材和信号未改，原创本机对端仅选择既有C角色值、入场背景、TfD的CUT及补丁图块编号，编解码和请求断言保持。完整ZIP在源码／生成API预检中均核对原SHA256。[验证记录](validation.md#stage296-actual-battle-product)

<a id="stage295-battle-draw-style"></a>

## stage295 最终战斗队列的颜色覆盖顺序

**事实**：固定模块SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0／Ghidra12.1.4，12函数／73,349字节全部与原文件相同；保留902条证据，REA已关闭。完整反编译材料只留build，公开文件为索引、摘要与原创实现。[证据](../analysis/game-battle-draw-style-v1/source-check.json)

`506e80` 先复制对象的300颜色、304／305绘图样式和306编号。308是颜色字节覆盖mask：1取30e红、2取30d绿、4取30c蓝、8取30f alpha；随后309／310覆盖绘图flags，最后actorFlags的100000位令alpha为128。308的8与305的加色8是独立字段；`446e00/447330` 仍由动画加色位优先选择ONE／ONE。

`409e70` 初始化308／309／310为0、30c..30f为ffffffff；`41f740/41f7a0`复制对象字段。`40a120` 的162／163写mask8／0，158／159与213..215有具体alpha及mask生命周期；部分分支直接写303重置动画alpha。`421a10` 更新链接对象alpha后按255与否写mask0／8，`422080`静态场景对象从mask8／alpha0开始。

**工具边界**：40a120的分析已完成并留存，但完整MCP响应超过传输预算；本轮用保留证据投影、完整导出与62,225字节核对继续，没有重复分析或把传输限制当函数缺失。大函数value-flow仍截断；所述字段存取／分支有完整伪代码和原字节，未据此推定整个程序别名闭合。[规格](logic-protocol-spec.md#stage295-battle-draw-style)

<a id="stage294-vertex-color"></a>

## stage294 ARGB生产、纹理调制与透明分支

**事实**：固定SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0／Ghidra12.1.4；9个函数的12,101字节均与原文件匹配，887条保留证据及快照在build，REA已关闭。公开文件仅留索引、摘要及原创代码。[来源](../analysis/game-vertex-color-v1/source-check.json)

`4533c0 → 4fd0d0` 将action颜色写到状态+300；`505bd0` 将样式第2字复制到队列+1c，省略样式时为ffffffff；`506030` 传给普通446e00与缩放447330。两种绘制均把该字写入四个顶点的diffuse字段，alpha为ff时取ONE／ZERO，其余为SRCALPHA／INVSRCALPHA，标志8的ONE／ONE优先。`4457d0` 显式设置第0层alpha操作MODULATE、参数TEXTURE及DIFFUSE。

**文档推导**：微软[SDK头](https://github.com/microsoft/win32metadata/blob/main/generation/WinSDK/RecompiledIdlHeaders/um/d3dtypes.h)核对ARGB布局与枚举；[纹理状态默认值](https://learn.microsoft.com/en-us/windows/win32/direct3d9/d3dtexturestagestatetype)和[CURRENT参数](https://learn.microsoft.com/en-us/windows/win32/direct3d9/d3dta)支持纹理RGB与顶点RGB调制。已查路径未显式设置颜色操作；匹配的vtable+94指令仅见三处alpha设置，但该字节模式不能排除所有其他间接写入。因此默认颜色状态仍是依据文档的推导，未声称原生运行观察。

**事实与独立边界**：`5076a0` 复制实际声明的调色板前缀再转颜色。实际编号567的645字节有215个完整BGR颜色，十帧最高索引213；实现保留已知色掩码。原函数尾部清理的指针算式不作为缺色补值规则。[规格与未验证项](logic-protocol-spec.md#stage294-vertex-color)

<a id="stage293-additive-render"></a>

## stage293 原版加色分支与设备状态

**事实**：固定模块SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0／Ghidra12.1.4；8个函数／11,232字节和 `52f0cc` 的16字节IID_IDirect3D7已与原文件匹配。880条保留证据和快照在build，公开索引不含原图像／EXE／反编译正文，REA已关闭。[来源](../analysis/game-additive-render-v1/source-check.json)

`4457d0` 使用该GUID创建D3D7设备，设置render state27=1启用混色，并依能力设置state41颜色键。`446e00` 的普通绘制和 `447330` 的缩放绘制遇到标志8时先设置state19=2和20=2；该分支在顶点alpha判断之前。`506030` 传入队列标志，`4533c0/4fd0d0` 从action头保留标志，`505d70` 在绘制前处理命名／中性／通道调色板。

**事实与推导**：微软原版[SDK接口](https://github.com/microsoft/win32metadata/blob/main/generation/WinSDK/RecompiledIdlHeaders/um/d3d.h)证明x86 vtable+50为SetRenderState、+64为DrawPrimitive；[SDK枚举](https://github.com/microsoft/win32metadata/blob/main/generation/WinSDK/RecompiledIdlHeaders/um/d3dtypes.h)与[混色说明](https://learn.microsoft.com/en-us/windows/win32/direct3d9/alpha-blending-state)确定19／20为源／目标因子、2为ONE。由此恢复分量相加规则。原DDRAW回退省略标志8绘制；共享实现选择模拟D3D效果，未声称等价重放该省略行为。

**待验证**：原生驱动边界／滤波、16／24位量化、任意顶点颜色与完整游戏。一次立即数字节搜索命中无关UI函数，已用GUID交叉引用纠正；不把该搜索命中或未定义内部地址当作设备证据。[规格](logic-protocol-spec.md#stage293-additive-render)

<a id="stage292-animation-named-palette"></a>

## stage292 非零动画调色板的REA链路

**事实**：固定模块SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0／Ghidra12.1.4。16个函数的7,426字节完整匹配原文件，包含 `4533c0` 的20字节action头、`4fd0d0` 的actor+306选择器、`463120/506d50` 的普通队列，以及 `507580/507b20/5076a0/505d70/449c80/449a10` 的调色板准备和提交。[字节与证据索引](../analysis/game-animation-palette-source-v1/source-check.json)

`507580` 定义1,495槽，`507b20` 仅保留有符号编号1..1494，其余写0。`568310` 的5,980字节固定表把320映射到图形资源113058；`5076a0→452fe0→453030` 读取这个图形的RD尾部BGR调色板，`505d70` 优先使用命名颜色，标志4选未变换版本，其他走已有通道变换。映射表可压成29个连续数值段，公开实现不携带EXE或图像。

**事实与待验证**：实际113058图形索引616882，RD含完整768字节调色板，SHA256 `abbe672337ddce1b1c6287487aaf7a26f24f417db913e099bc1f0ffbe04e3cc1`；对应动画2动作／54帧完整RGBA已比对。`446e00` 另把标志8交给图形设备的加色分支，本轮仍拒绝该样式。原生硬件、16／24位、完整资源版本和其他动画上下文仍未验证；REA会话已关闭，原程序未执行。[验证](validation.md#stage292-animation-named-palette)

<a id="stage291-legacy-minimap"></a>

## stage291 REA小地图消费者与实际材料

**事实**：固定cg_se_6000.exe为1,569,280字节，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA6.7.0／Ghidra12.1.4恢复已保留快照后完成21个函数／9,427字节的完整原文件匹配；新证据和快照留在build，公开索引仅含身份、偏移及摘要，REA会话已关闭。[索引](../analysis/game-legacy-minimap-v1/source-check.json)

`463780` 的反编译因栈探针失真；原指令证明三个参数为缓存身份B、中心X、中心Y，地图宽高从20字节缓存头12／16读取。`4636a0`、常量表 `53d58c` 给出107／54／27格；`4649b0→464bc0` 以显式选择器或身份B读取固定 `bin/PUK2/cutdat/%d.aut`，上限477603字节。AUT按RGB三字节及地图宽度寻址。

`452960` 按最终运行时索引顺序建立16位地块颜色表；组0／1／2允许1000..19999及220000..265535映射，后记录覆盖先记录。`44b610/44b720` 排除像素索引0后平均原CGP颜色，只在0及16..239找最近色。`463780` 按loaded位4000和物件占地生成格网；`448bb0/4494a0` 完成32位四像素菱形及先取色再翻转的标记时钟。[规格](logic-protocol-spec.md#stage291-legacy-minimap)

**事实与待验证**：实际材料有341个CUT、337个AUT，59529配对存在；23.cut缺失只属于原创测试选择器。真实动画113058可解析54帧，非零调色板320在现有绘制处拒绝，尚未证明其选择语义和完整资源版本对应。当前未执行原程序；独立UI位置、异步调度、16／24位和完整原生后端不能由本轮32位静态证据证明。[验证](validation.md#stage291-legacy-minimap)

<a id="stage290-legacy-material-compat"></a>

## stage290 固定来源与实际资源的交叉核验

**事实**：固定 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。复用REA6.7.0／Ghidra12.1.4的资源、图形、动画和声音合同，重新核对31处原PE字节／文件映射、42个默认名称及保留证据哈希；本轮未新增REA会话或原程序执行。[来源核对](../analysis/game-legacy-material-compat-v1/source-check.json)

**事实**：明确后缀选中27个本机文件，V2可选槽为空。实际GraphicInfo共641,666行，其中510次覆盖同组已有索引，没有跨组覆盖。示例Ex索引5504对应全局259166，最终偏移943,307,559、长度244,878；同索引早期物理图像与最终槽位图像不同。Python与核心的完整850,000位元数据和查找表一致，未把记录序号当索引。[材料选择](../analysis/game-legacy-material-compat-v1/material-profile.json)

**待验证**：这些命名与结构比较不证明完整发行版本相同。材料没有模式1场景所需CUT23；完整地图、原生应用调度及官方会话仍未验收。[验证范围](validation.md#stage290-legacy-material-compat)

<a id="stage289-legacy-resource-archive"></a>

## stage289 沿用原文件合同，独立实现ZIP传输

**事实**：固定历史 `cg_se_6000.exe` 为1,569,280字节，SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。沿用既有REA及启动材料来源核对，不新增REA会话或执行原程序。原来源合同读取模块和相对资源文件，本轮ZIP是跨平台传输适配，未据此声称原游戏读取ZIP。[来源身份与原合同](../analysis/game-legacy-resource-archive-v1/source-check.json)

**事实**：私有材料Bin有1,071个文件、2,547,446,075字节，最大图形库943,552,437字节；加固定模块后打包1,072文件。Python3.9.6／系统zlib1.2.12独立全内容校验通过。源码／生成API取得一致的3,216段字节和模块／v2字段。**待验证**：这些材料与固定历史图形、地图及其他消费者的整体版本匹配。[结果](validation.md#stage289-legacy-resource-archive)

**设计**：新传输按PKWARE APPNOTE6.3.10实现标准容器；元数据、偏移和压缩读取属于原创文件适配，没有新增游戏协议字段。[格式](resource-formats.md#stage289-legacy-resource-archive)

<a id="stage288-legacy-battle-audio"></a>

## stage288 固定音效目录与播放入口

**事实**：样本 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0／Ghidra12.1.4。15条保留证据中，本轮规格绑定4个完整函数共1,100字节及8段读取共33,283字节。`0x507dfa..0x50eb87` 的4,802条常量复制指令与188段只读输入重新匹配原PE；仅求值数据定义，没有执行样本。REA已关闭。[来源与偏移](../analysis/game-legacy-battle-audio-v1/source-check.json)

**事实**：70字节记录恢复270个明确编号、260个文件路径及FFFF结束标记。`0x510000` 使用64个非保护播放槽，单次播放后给编号设置5次更新的重复抑制；`0x510b50` 逐次递减。`0x50f5a0` 建立声像对数表；x/5有符号截断并夹在0..127，关闭声像时用64，y不参与。270项音高偏移均为0。

**推测／移植选择**：当前共享所有者在每个不同的已呈现战斗输出前推进一次抑制，再按既有身体／动画、输入顺序消费事件。完整原生应用调度与其他声音所有者尚未闭合，不能将本地帧次视为整机时序证明。[规格](logic-protocol-spec.md#stage288-legacy-battle-audio)

<a id="stage287-legacy-battle-detached-rid"></a>

## stage287 RID读指针、零存储与实际消息接收者

**事实**：固定历史 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0／Ghidra12.1.4。10个完整函数共1,844字节、5段读取共9,230字节，15条证据；既有派生主分派重新匹配14,120条指令、54,685字节。REA已关闭。[来源清单](../analysis/game-legacy-battle-detached-rid-v1/source-check.json)

**事实**：101对父元组的每一行调用 `0x421140`，每个分身只经 `0x434af0` 复制一行。`0x409e70` 清零载荷；追加器在下一行槽号写−1。`0x436ee0` 连续推进三次，得到后缀槽−1、资源0／0／0及第三行零元组。`0x41a030` 的2000分支使用登记施法者；`0x422d60`／`0x4232e0` 清除实际骑乘／附属并将施法者资源设0。

**事实**：14随后按当前零元组向登记槽0调用 `0x420080`，消息573b。该工厂读取传入身体40／44世界位置；预检要求槽0存在。`0x434a30` 的读取边界是200格，未用动作写指针裁剪；四次推进可能越过新结束标记而执行旧动作尾，或停在零格且仍忙碌。

**待验证**：无2000时RID消息使用后缀槽−1；低等级116的112可越过200行库；401自身效果把1adfa效果行作为身体索引。相应原查找内容与动态结果仍未观察，保留既有拒绝。登记槽0与空图像索引0是两个独立概念；本轮未验证原保留图像的几何或原程序运行。[规格](logic-protocol-spec.md#stage287-legacy-battle-detached-rid)

<a id="stage286-legacy-battle-impact-skills"></a>

## stage286 分身、独立火花与抛物投射

**事实**：固定历史 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0／Ghidra12.1.4。11个完整函数共5,689字节，11段读取共20,575字节，22条证据；既有派生主分派重新匹配14,120条指令、54,685字节。REA已关闭，`open=false`、`cleanup_pending=false`。[来源清单](../analysis/game-legacy-battle-impact-skills-v1/source-check.json)

**事实**：`0x41a2d0` 创建资源0的隐藏16结果身体，另由 `0x41a550` 创建父指针指向它的 `0x1adc0` 可见箭矢。`0x41b5b0` 创建独立固定屏幕火花，完整工厂未写actor+10；85从 `0x5338b0` 或其−160字节区域取十个位置，推进270次。`0x421140` 的新身体只复制选定身份字段；106的101将每条记录交给独立身体，动作24／75／89／9／90／14／105。

**事实**：116的110先推进动画再选动作；`0x565a` 后层保持普通0回调，`0x666c` 前层的父指针指向后层。111沿高度100、时长60的曲线推进61次后删除后层；等级9再经83缩放旋转、34等待与112结算。`0x41a000` 只检查 `[0x58fac4,0x58fb1c)` 的22个指针。

**事实与待验证**：109工厂 `0x41f1a0` 的actor+2cc由 `0x4fd5f0` 写入动画drawOffsetY，已修正旧高度解释。隐藏资源0偏转所需几何、分身RID后缀存储、原程序动态和现行样本仍待验证。[规格](logic-protocol-spec.md#stage286-legacy-battle-impact-skills)

<a id="stage285-legacy-battle-upper-skills"></a>

## stage285 上位分派、独立身体与信息输出

**事实**：固定历史 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0／Ghidra12.1.4。新增完整函数 `0x4032f0`39、`0x403530`15、`0x41f160`60、`0x41f1a0`176、`0x421140`200字节，共490字节；9段读取共4,236字节。既有派生主分派重新匹配14,120条指令、54,685字节，仍不计为新规范函数。[来源清单](../analysis/game-legacy-battle-upper-skills-v1/source-check.json)

**事实**：107的信息回调在 `0x410321`；103环绕在 `0x4104b2`，计数旧值大于119时释放。112由107动作调用 `0x421140` 新分配身体，资源 `0x18aa7`、槽−1、动作24／108／105；1004为残影开关，1040才是技能等级，ff4另为物理变体字段。109回调产生40个 `0x1adb4` 烟雾；533c54属于背景震动上限。114复用图标参数15，设置 `0x100000`，资源 `0x1926a`。

**事实与边界**：IAT `0x52d218` 为 `USER32.dll!wsprintfA`；107成功LP／FP提示的两个 `%d` 实际读取对象表指针和编码载荷字。字节中的格式按CP932解码。独立实现只输出明确标记的C缓存观察，不声称原版成功文字一致。原程序动态、原版渲染后端及现行版本仍待验证；REA已关闭。[验收](validation.md#stage285-legacy-battle-upper-skills)

<a id="stage284-legacy-battle-skill99"></a>

## stage284 六类分派与图标帮助函数

**事实**：固定旧版 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0／Ghidra12.1.4。本轮2个完整函数为 `0x420840`297字节、`0x420970`358字节，另有12段原字节读取。旧派生主分派重新匹配14,120条指令、54,685字节；它仍是既有静态派生，不计为新规范函数。[来源清单](../analysis/game-legacy-battle-skill99-v1/source-check.json)

**事实**：99–104以目标／标志列表生产153效果，位 `0x80000` 追加140／78／35。153选择 `0x1ae6d`，140经 `0x420970` 创建 `0x1926a` 至 `0x1926f` 的单个持续图标，78的253／274为声音键。已有 `+0x1064` 图标阻止替换，C消息保留原有成对低位清除顺序；移除身体时删除图标。动作37在 `0x40e947`、`0x40e94f`、`0x40e957` 有三次动画调用。

**推导与待验证**：按这些来源实现逻辑与原创档案表现。完整RGBA使用已有本地近邻采样策略，未证明原版GPU采样、原程序动态或现行版本等价；REA已关闭。[验收](validation.md#stage284-legacy-battle-skill99)

<a id="stage283-legacy-battle-self-flags"></a>

## stage283 结果标志、旋转朝向与三字段元组

**事实**：固定旧版 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0／Ghidra12.1.4。本轮有1个完整425字节函数、8段读取、8段原范围复核，以及保留完整生产者和动作14／26／29／160组。`0x40c82e` 以位4选择110000；`0x40d9ba`、`0x40d9be` 选择反应动画9；`0x40de60` 的动作29以 `0x08000000` 每偶数次旋转，退出在 `0x40df23` 调用 `0x4199b0` 按当前角度定朝向。[来源清单](../analysis/game-legacy-battle-self-flags-v1/source-check.json)

**事实与限定结论**：整幅反汇编有42处FE4至FE7直接位移引用，16读／26写；这是直接位移库存，不能证明所有间接指针使用。生产者／动作14／反应及相关帮助函数的消费者位并集为 `0x1bf8ff7f`，其余 `0xe4070080` 在该范围内保留不解释，不称全程序无用途。`0x424e20` 调用三字段帮助函数 `0x434a90`，当前元组第四格不写零。

**推断与待验证**：依据限定消费者与原字段保留行为，实现允许完整字透传。独立方程的15种160调用前缀均未结算，完整本地回调另保留原恢复逻辑；不据此推定原程序动态、现行版本或实际平台等价。[验收](validation.md#stage283-legacy-battle-self-flags)

<a id="stage282-legacy-battle-self-guard"></a>

## stage282 护卫追加顺序与重合角色

**事实**：固定旧版 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA6.7.0／Ghidra12.1.4 核对 `0x423fa0`577字节和 `0x4241f0`287字节的完整函数，另有3段读取、8段保留范围、7个操作数及8个调用。重定向函数按施法者、护卫、被保护者追加24个动作和4个三字段元组，没有角色相等分支；释放函数保留E000、零值、倒地及后续目标条件。[来源清单](../analysis/game-legacy-battle-self-guard-v1/source-check.json)

**事实与范围**：成对模式保留护卫位；既有正变体保存自身记录的归一化属于另一条路径。独立方程验证四种场景各320次回调和完整RGBA，末尾均仍等待；完整独立实现另经原等待恢复结束回合。未将有限前缀写成原版动态或整个游戏完成；REA已关闭。[验收](validation.md#stage282-legacy-battle-self-guard)

<a id="stage281-legacy-battle-self-metadata"></a>

## stage281 自身元数据的目标及游标

**事实**：固定旧版 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA6.7.0／Ghidra12.1.4 核对 `0x41a030`526字节和 `0x436ee0`109字节的完整函数，另取4段字节并重核8段保留范围、20个操作数、9个调用。元数据通常指向目标，反射时指向施法者；自身共用同一身体。RID辅助函数连续三次推进元组，读取基础／骑乘／附属资源。[来源](../analysis/game-legacy-battle-self-metadata-v1/source-check.json)

**事实**：自身目标清除类别后，类别专属条件不会被凭空创建；普通非零命中才清除已有状态，未命中、治疗与反射保留状态。**推测与验证范围**：独立实现据此允许所选标志，并经实际回放验证；原版动态、其他护卫别名和整个游戏仍待验证。REA已关闭。[验收](validation.md#stage281-legacy-battle-self-metadata)

<a id="stage280-legacy-battle-reentry"></a>

## stage280 新入场与回场的原版所有者

**事实**：固定旧版 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA6.7.0／Ghidra12.1.4 新读取 `0x501a50`164字节、`0x437b30`240字节、`0x433b70`82字节，独立重核既有完整范围3171／2858／82字节。入口 `0x437bd1／0x437bd6` 调用池删除／战斗表重置；重置清除停止工作，新入场重新设置首个确认状态。原普通场景进入战斗仍删除旧身体，由既有回场流程重建及捕获。[来源清单](../analysis/game-legacy-battle-reentry-v1/source-check.json)

**推测与验证范围**：由这些所有者推导连续战斗应隔离旧数据；12条独立实现的实际本地 TCP 流程已验证该有限行为。REA 会话已关闭。原版动态、整个程序间接写入及现行样本等价仍待验证。[验收](validation.md#stage280-legacy-battle-reentry)

<a id="stage279-legacy-battle-self-control"></a>

## stage279 自身控制状态的原始分派

**事实（静态）**：固定 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 新取 6 段字节；另复核 8 段保留范围、20 个操作数、7 个直接调用及 4 个原 PE 分派表项，并补核一段原文件范围。生产者 `0x424726／0x42475a` 检查蓄力两位并排入动作113；`0x411ef2／0x411ef8` 分别冻结目标和施法者，自身时两者共用身体。效果在 `0x41b669` 发布完成值2。[来源清单](../analysis/game-legacy-battle-self-control-v1/source-check.json)

原分派表把 32／44／113／244 指向 `0x40e28d／0x40dfdb／0x411e8f／0x41937e`。动作244在 `0x41937e` 清就绪、`0x419388` 置停止；不能视为回合计数已递增。**事实（本地实现）**：已验证主控退出、远端移除及同一组件的新入场。**待验证**：原版动态、其余元数据、完整玩法和真实平台。[验收](validation.md#stage279-legacy-battle-self-control)

<a id="stage278-legacy-battle-self-special"></a>

## stage278 E000 优先顺序与同一身体的双次推进

**事实（静态）**：固定 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 新取 6 段字节，与原 PE 比对；复核 8 段保留范围、19 个操作数和 10 个调用。动作 14 的 `0x40ce62／0x40d04f／0x40d320` 依次检查 `0x8000／0x4000／0x2000`。反射在 `0x40d32a` 推进施法者、`0x40d330` 推进目标，随后 `0x40d5a1` 前进施法者元组。目标与施法者同一时，不能合并这两次推进。[来源清单](../analysis/game-legacy-battle-self-special-v1/source-check.json)

**事实（静态及独立实现）**：类别 81 的生产者在 `0x425e55` 排入动作 155，并保存额外数值。原分派表 `0x4196a0` 指向 `0x41283b`；动作 155 按已保存的数字样式 5 调用加值路径。自身反射释放后续队列时，12 点结果后仍执行额外 7 点治疗，原创回放 HP 为 `70 → 58 → 65`。**待验证**：原版动态、其余结果位、完整玩法与真实平台。[验收](validation.md#stage278-legacy-battle-self-special)

<a id="stage277-legacy-battle-self-family"></a>

## stage277 普通自身记录的类别重读

**事实（静态）**：样本 `cg_se_6000.exe` SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 新取 5 段字节，并重核原件中的 8 段保留范围。生产者 `0x424310` 在 `0x4246f7` 清除类别 5 首条记录的`0x4` 标志位；类别 81 额外读取一字。动作 14 在 `0x40c9cc` 通过共用表解析目标，在 `0x40ca00` 清除目标类别；自身别名使此写入同时改变施法者。`0x40d769` 重读类别，`0x40d827` 的普通数字样式为 6。[逐项字节核验](../analysis/game-legacy-battle-self-family-v1/source-check.json)

**事实（独立实现本地验证）**：普通 20 类、200 个类别／等级组合和 32 种实际回放已验证；技能 6 自身结果需要普通 HP 数字。**待验证**：原版动态、其余特殊结果、完整玩法、现行版交接及真实设备。静态来源与原创回放不等同原版运行观察。[验收](validation.md#stage277-legacy-battle-self-family)

# CrossGate 主安装包静态调查

<a id="stage276-legacy-battle-self-pair"></a>

## stage276 自身与目标指向同一原版身体

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 的 12 条字节记录、7 个既有范围、15 处操作数及 11 个调用与 PE 一致。两个会话关闭；原 PE 的 `0x41946c` 指向动作 14 入口 `0x40c7e8`，该分支读取范围至 `0x40d939`。[来源核验](../analysis/game-legacy-battle-self-pair-v1/source-check.json)

**事实**。共用成对生产器 `0x424310` 为 0／1／3 等类别追加动作。动作 14 在 `0x40c9c8` 取当前目标槽，`0x40c9cc` 查共享身体表；`0x40ca00` 清目标类号。普通结果的 `0x40d86d → 0x434a30` 推进目标动作，辅助函数 `0x434a88` 写目标身体状态。自身槽位指向当前施法者，因此会修改同一身体的当前状态。[字节与调用](../analysis/game-legacy-battle-self-pair-v1/source-check.json)

**事实**。动作 14 的末尾在 `0x40d91b/0x40d921` 推进施法者动作／元组；自身结果提前把状态改成等待头后，后续调用不再走该末尾。原创先自身后他人的记录因此停在自身等待，后续他人结果未执行，待 `0x434b90` 的既有恢复清理。[验收](validation.md#stage276-legacy-battle-self-pair)

**事实／待验证**。已解码附加 RID 的入口由现有身体封装拆分，底层未拥有输入的拒绝继续保留。SKL402 生产器跳过不存在身体，但动作 135 先启动当前目标，再检查下一元组；空侧原版运行时查表上下文未验证，未据生产器的空循环推断可执行行为。[分析与边界](../analysis/game-legacy-battle-self-pair-v1/source-check.json)

<a id="stage275-legacy-battle-weather-targets"></a>

## stage275 SKL401 逐目标追加与效果读取

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 的 4 条新字节记录、6 个既有辅助函数窗口、19 处操作数及 26 个直接调用与 PE 相符，会话已关闭。生产器为 `0x430cac..0x430f8c`，按连续文件范围取证，不宣称该内部入口是完整独立函数。[来源核验](../analysis/game-legacy-battle-weather-targets-v1/source-check.json)

**事实**。`0x430e2d → 0x434af0` 每次向施法者追加目标结果元组，`0x430e42 → 0x434990` 向目标追加动作 0。标志含 `0x80000` 时，`0x430e68/0x430e81` 追加 35、207，`0x430e9e` 追加 `[0x1adfa,30,0,23]`。`0x430ea6` 返回读取下一目标，没有已出现槽位去重。两种追加辅助函数分别递增同一身体的写指针。[调用与字节](../analysis/game-legacy-battle-weather-targets-v1/source-check.json)

**事实**。动作 211 的 `0x414a1c` 每次推进非自身目标的一个动作，再经 `0x414a25` 推进施法者元组。动作 207 从当前目标元组取效果资源，在 `0x4146bf` 创建效果；计数达到元组 count 后，`0x414733/0x414739` 才推进目标元组和动作。因此重复效果元组并不等于全部都会被播放。[来源核验](../analysis/game-legacy-battle-weather-targets-v1/source-check.json)

**推测／保留边界**。目标是施法者且带效果时，两类元组进入同一队列；释放循环随后将效果资源号当作目标槽。该值不在 0..21 身体范围内，共享规划器保留写入前拒绝。**待验证**：原版实际执行此上下文的行为，以及当前版本是否会发送它。[验收](validation.md#stage275-legacy-battle-weather-targets)

<a id="stage274-legacy-battle-pursuit-linked"></a>

## stage274 SKL400 联动元组与动画隐藏标记

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 的 11 条字节记录、既有等待辅助函数窗口、13 处操作数与 16 个直接调用均与当前 PE 核对。两个分析会话关闭；内部入口按具体范围取证，不宣称均为自动发现的完整函数。[来源核验](../analysis/game-legacy-battle-pursuit-linked-v1/source-check.json)

**事实**。`0x430954..0x430cab` 继续按槽／标志对生成 `[slot,flags,0,0]`。类型 31 在 `0x41e77e` 复制当前元组，经 `0x41e7b2` 调用 `0x436ee0`，三次调用 `0x434b60` 推进父游标；读取下一行的槽、amount、extra 以及再下一行的 amount。`0x41e7cd → 0x436e60` 将两行元数据及原始元组副本追加到子效果，形成四行结果。[字节与调用](../analysis/game-legacy-battle-pursuit-linked-v1/source-check.json)

**事实**。动作 211 在 `0x414a00` 重新读取推进后的父元组，再于 `0x414a1c` 推进此时目标的动作。命中时 `0x4225ad → 0x41a030` 再消费子效果元数据，`0x2000` 将资源更新对象改为施法者；资源更新调用为 `0x41a12f/0x41a186 → 0x422d60`。[来源核验](../analysis/game-legacy-battle-pursuit-linked-v1/source-check.json)

**事实**。动画辅助函数 `0x4fd5f0` 的 `0x4fd693..0x4fd6a5` 在资源不大于 999 时写图形编号 0 并返回 0。**推测／实现策略**：共享绘图层按既有隐藏标记跳过该节点，保留身体所有权，不替换资源。**待验证**：原版图形 0 绘图后端的像素与实际游戏动态，不能由静态动画分支推定像素等价。[验收](validation.md#stage274-legacy-battle-pursuit-linked)

<a id="stage273-legacy-battle-pursuit-targets"></a>

## stage273 SKL400 逐目标追加与重复列表

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 的 8 个新字节窗口、3 个既有辅助函数窗口、20 处操作数和 24 个直接调用与原 PE 相符。生产器和身体回调均按具体字节范围取证，不宣称这些内部入口均被 Ghidra 发现为独立完整函数。[来源核验](../analysis/game-legacy-battle-pursuit-targets-v1/source-check.json)

**事实**。`0x430954..0x430cab` 的生产器逐条读取槽位和结果位，255 结束。在 `0x430b0d` 向施法者追加目标元组；非自身分支的 `0x430b2f` 追加 0，公共分支 `0x430b47` 再追加 0，随后 `0x430b70` 追加速度元组、`0x430b89` 追加 241。结果分支再追加返回、回避或离场动作，`0x430c56` 回到下一条目标读取。这个循环不按已出现槽位去重。[字节与调用](../analysis/game-legacy-battle-pursuit-targets-v1/source-check.json)

**事实**。`0x434990` 递增动作写指针，`0x434af0` 递增四元组写指针。动作 211 在 `0x4149e0` 按当前目标重新播种随机序列，`0x4149f8` 创建类型 31 效果；目标不是施法者时才经 `0x414a1c` 推进目标动作，然后推进施法者元组继续遍历。[原文件核验](../analysis/game-legacy-battle-pursuit-targets-v1/source-check.json)

**事实**。既有 `0x434b90` 等待函数在 `0x434c46` 比较 7200，超限后清队列并追加 11、38。原创重复自身场景确实走到该恢复分支，记录与自然完成分开。[验收](validation.md#stage273-legacy-battle-pursuit-targets)

<a id="stage272-legacy-battle-round-ack"></a>

## stage272 A/P 接收、登记表和输入清标

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 的 7 个新字节窗口、1 个既有主流程完整窗口、30 处操作数及 7 个直接调用与原 PE 相符。[来源坐标](../analysis/game-legacy-battle-round-ack-v1/source-check.json)

**事实**。`0x4f36d0` 以六个 `%X` 目标读取 P，分别保存候选席位、控制标志及其余四个字。A 保存掩码 `0x599ce4` 和回合字段 `0x599c98`；首 A 清除 `0x599d90` 并将回合字段复制到当前回合 `0x599d2c`，随后调用 `0x436f50`。该函数只在主状态 10、回合相等时遍历 `0x58fac4..0x58fb14` 的 20 个登记项，按掩码给存在的对象 `+0x24` 置 `0x40`。[字节与调用](../analysis/game-legacy-battle-round-ack-v1/source-check.json)

**事实**。阶段 2 在 C 消费后于 `0x437e78` 将候选席位复制为当前席位 `0x599dc4`。输入初始化 `0x437460` 经 `0x437495` 清除 20 个身体的 `0x40`，再经 `0x43749a` 按当前 A 重标。管理器在 `0x436682` 递增 32 位回合号，`0x436685` 写回。[核验](../analysis/game-legacy-battle-round-ack-v1/source-check.json)

**待验证**。原版动态、完整消息排序及全部玩法仍未完成；原创夹具的帧号单独作为共享实现结果记录。[验收](validation.md#stage272-legacy-battle-round-ack)

<a id="stage271-legacy-battle-character-queue"></a>

## stage271 C 生产环与阶段 2 消费门限

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0／Ghidra 12.1.4 的 9 个新字节窗口、3 个既有完整函数窗口、29 处操作数和 9 个直接调用与原 PE 相符。[字节核验](../analysis/game-legacy-battle-character-queue-v1/source-check.json)

**事实**。`0x4f36d0` 按首字节 C 选择接收分支，将字符串复制到 `0x594b64 + write*0x1000`，递增 `0x598b94`，到 4 归零。主流程分发表 `0x438664` 将阶段 2 指向 `0x437d9e`；该分支先回调、排序并提交绘制，再比较 `0x598b6c` 与写指针。非空时复制一条，递增并环绕读指针，经 `0x437e49` 调用 `0x433cd0`。结束位 `0x20` 使主流程进入 7。[来源坐标](../analysis/game-legacy-battle-character-queue-v1/source-check.json)

**事实**。阶段 6 指向 `0x438130`，该完整分支没有 C 消费调用。管理器在 `0x43668a` 写入阶段 2；本次已选的分派分支继续完成，下一次主流程调用才进入阶段 2。C 消费者末尾按出现位图清理缺席槽。接收器另以第二字节 U 设置 `0x599dd0`，不经过 C 环。[原文件与调用](../analysis/game-legacy-battle-character-queue-v1/source-check.json)

**待验证**。上述为固定样本的静态控制流；原创资源回放的帧数和局部 TCP 结果单独记录，未观察原版动态执行。[验收](validation.md#stage271-legacy-battle-character-queue)

<a id="stage270-legacy-battle-exit-rid0"></a>

## stage270 动作 244 与退出对象池清理

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 13 个新窗口和 1 个既有反射窗口与原 PE 相符。致死反射的本地分支排入 244，远端分支排入 50、49。动作表 `0x419804` 指向 `0x41937e`，将 `0x599c40` 清零并将 `0x599c44` 置为 1。[字节与直接调用](../analysis/game-legacy-battle-exit-rid0-v1/source-check.json)

**事实**。管理器 `0x4365d0` 读取停止标志，在 `0x436635` 将主流程子状态设为 7。分发表 `0x438678` 的阶段 7、8 入口分别为 `0x43828f`、`0x43834b`。阶段 7 清空命令掩码，调用回调遍历与剩余副作用处理，并在 `0x4382bb` 清空 22 个身体登记项。退出渐变完成后，经 `0x43838e` 请求主状态 9、子状态 1，`0x438396` 标记整个对象池删除，再经 `0x4383d7` 发出退出请求。[原文件核验](../analysis/game-legacy-battle-exit-rid0-v1/source-check.json)

**事实**。`0x40a0c0` 遍历对象池，向每个对象的 `+0x1c` 写入删除标志。状态 47 在 `+0x1024` 为 2 时进入 49，状态 49 清空槽位并标记身体删除。合成 B 占用施法槽的路径在第 446 个回调进入 49，447 回收，448 排空回合。[回放验收](validation.md#stage270-legacy-battle-exit-rid0)

**待验证**。原程序动态执行与真实 C 到达时序继续取证。上述回调数由原创资源与独立共享实现产生。[开发顺序](development-plan.md#stage270-legacy-battle-exit-rid0)

<a id="stage269-legacy-battle-reflected-rid0"></a>

## stage269 反射回程与骑乘指针清空

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 17 个新窗口和 4 个既有窗口均与原 PE 相符。`0x42a70f` 累计反射量，`0x42a729` 保存最后反射槽。`0x42ad25`、`0x42ad3e` 为最后反射者排入 1、137，`0x42ad53` 为施法者排入 0。`0x42af2b` 和 `0x42af5c` 写回程及扩展元组，`0x42af71` 排入 72。[文件偏移、操作数和直接调用](../analysis/game-legacy-battle-reflected-rid0-v1/source-check.json)

**事实**。phase2 的分发表 `0x4336c0`、`0x4336cc` 将 SKL19–31 路由到 `0x428fb1`。前面的反射者须为状态 0，最后一个须为 1，施法槽须为 0 或 1，才在 `0x4290f0` 推进最后反射者的动作。137 在 `0x41263b` 创建投射物后推进动作，72 在 `0x40f4df` 先推进元组再推进动作。[原文件核验](../analysis/game-legacy-battle-reflected-rid0-v1/source-check.json)

**事实**。回程内联元数据在 `0x41a0de` 消费扩展行，按 `0x2000` 选择资源接收者，并在 `0x41a12f` 或 `0x41a186` 调 `0x422d60`。第二资源不大于零时，后者清理骑乘对象并在 `0x422e02` 将 `+0x13b4` 置零。221 在 `0x41671e` 读取该指针，随后在 `0x41673c` 直接读取对象计数。[读取链](../analysis/game-legacy-battle-reflected-rid0-v1/source-check.json)

**推测与待验证**。同一主体收到卸载资源后再执行已排入的 221，会触及已清空的骑乘指针。原版动态结果尚未观测。共享实现保留隐藏交接对象并完成 RID0，属于独立恢复策略。[本地验收](validation.md#stage269-legacy-battle-reflected-rid0)

<a id="stage268-legacy-battle-casting-rid0"></a>

## stage268 动作 135 的施法终止元组

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 24 个窗口和原 PE 一致。分发表 `0x42949f` 使用 `0x4338a8`，SKL19–31 经 `0x433884` 到 `0x42a495`。生产器排入动作 `[24,53,38,135,62]`，在 `0x42a767` 排目标元组，带内联字段时经 `0x42a78e` 追加三行。`FF` 进入 `0x42ac77`，`0x434a90` 写终止元组前三格及下一行首格 `-1`。无反射分支经 `0x42b00a` 调 `0x4236d0`，在 `0x423e7a` 排 221，在 `0x423e93` 排 `[A,0,A,B]`。[字节、文件偏移和交叉引用](../analysis/game-legacy-battle-casting-rid0-v1/source-check.json)

**事实**。动作 135 从 `[ebx+0x2d0]` 读取动画信号，范围为 10000 至 19999。有信号时 `0x412544` 逐元组建立投射物，`0x41254a` 前进，读到 `-1` 后 `0x41231e` 再前进一次。动画完成仍持有吟唱子对象时，`0x412344` 清理对象，`0x41237a` 从当前行先前进再检查下一行，停在首个 `-1`。动作 62 经 `0x40f5d4` 只推进动作游标。221 在 `0x416736` 取当前元组第三、四格作为 A、B。[原文件核验](../analysis/game-legacy-battle-casting-rid0-v1/source-check.json)

**推测**。按无反射队列推演，无信号的普通或内联列表在 RID0 前一行停下，空列表第一次前进到 RID0 行，再停在后一行。共享回放的旧结果出现 `[0,0]`，源于合成终止行余格的值。原版终止行第四格与原版无信号交接结果待验证。[回放验收](validation.md#stage268-legacy-battle-casting-rid0)

<a id="stage267-legacy-battle-rid0-flight"></a>

## stage267 动作 221 的父指针和 B 槽重读

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 和 Ghidra 12.1.4 的 14 个窗口与原 PE 逐字节匹配。动作表 `0x4197a8` 指向 `0x416718`。对象遍历器 `0x40a023` 用链表中的原对象调用回调，`0x40a14b` 从该对象读取载荷。动作 221 的骑乘对象取自这个载荷的 `+0x13b4`。[源核验](../analysis/game-legacy-battle-rid0-flight-v1/source-check.json)

**事实**。首帧在 `0x41674a` 登记 B，在 `0x416792` 清除容器的待登记 B 指针。后续帧在 `0x41687e` 取原父身体的骑乘对象，并分别在 `0x4168aa`、`0x4168ca`、`0x416904`、`0x416930` 读取当前 B，用于位置、动画及附着点。下降值为截断的计数平方除以 5，再加 B 的附着点 Y。值为负时进入 `0x41636e`，使用原骑乘指针继续动画。[读取与算式](../analysis/game-legacy-battle-rid0-flight-v1/source-check.json)

**事实**。落地在 `0x416966` 标记当前 A，`0x41697f` 登记新 A。随后清除父身体的骑乘和交接指针，`0x416a94` 和 `0x416aba` 再从当前 B 槽读取待恢复状态及队列的身体。[注册写入](../analysis/game-legacy-battle-rid0-flight-v1/source-check.json)

**推测**。A、B 同槽时，原骑乘对象跨过 B 的临时登记继续下降，落地后同槽最终登记 A。B 换人时，位置和附着点会随当前 B 变化。两项由静态指令和独立合成回放支持。所审计的 B 读取紧接着访问字段，空槽后的原版动态结果及网络到达时序待验证。[独立回放](../analysis/game-legacy-battle-rid0-flight-v1/reference.json) · [验收](validation.md#stage267-legacy-battle-rid0-flight)

<a id="stage266-legacy-battle-rid0-ownership"></a>

## stage266 首配中断、空队列与 B 槽移交

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 和 Ghidra 12.1.4 的 24 个读取窗口与 PE 文件逐字节匹配。首攻击者缺席在 `0x42435b` 进入中断。首目标缺席在 `0x42461e` 进入中断，此前 SKL72 已排入 38、147。两处分支的数值游标都停在缺席槽字段之后。[源核验](../analysis/game-legacy-battle-rid0-ownership-v1/source-check.json)

**事实**。掩码内可重置的身体在 `0x43487a` 将动作读索引和首动作清零。调用方先在 `0x42988f` 激活原主身体，再在 `0x429898` 读尾随 RID0。尾随在 `0x423e7a` 追加 221，追加器写入动作及忙标志。动作 0 的 `0x40a19a` 比较 161。等待 `0x434b90` 在掩码内的忙计数超过 7,200 后重置并追加 11、38，再激活归位队列。[动作与等待](../analysis/game-legacy-battle-rid0-ownership-v1/source-check.json)

**推测**。首目标后未读 `0|F|FF|`，或首攻击者后未读 `1|0|F|FF|` 时，合成游标先读到 `F|F`，再命中 `RID`。若首攻击者后的目标写为 `A`，两次读取分别为 `A|0` 和 `F|F`。能到达尾随的空闲 A 会持有待执行的 221，阶段 1 的等待提供归位边界。原版动态结果待验证。[游标对照](../analysis/game-legacy-battle-rid0-ownership-v1/source-check.json)

**事实**。动作 221 在 `0x41674a` 写入 B 槽，设 B 状态为 1，并在 `0x416792` 清除容器里的待登记 B 指针。随后每次下降重新读取 B 槽。正常落地写入 A 后，`0x416ac2` 激活 B。普通 C 清理未列出的槽时，`0x4345da` 标记父身体的交接容器，`0x434642` 标记父身体，`0x43464a` 清空当前槽。B 的注册由自己的槽位决定。原版未登记 A 的完整释放路径及主动中途离场的动态时序待验证。[注册与清理](../analysis/game-legacy-battle-rid0-ownership-v1/source-check.json)

<a id="stage265-legacy-battle-rid0-interruption"></a>

## stage265 缺席中断的扫描和对象生命周期

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 25 个读取窗口逐字节匹配 PE。后段攻击者的 `0x425ece` 和后段目标的 `0x425f3a` 都进入 `0x425fb9 → 0x436930`。两个分支各自在缺席槽被读取后中断，后续字段仍在原游标之后。[源核验](../analysis/game-legacy-battle-rid0-interruption-v1/source-check.json)

**事实**。`0x436930` 减少 `+0x5c` 的组内剩余计数。有剩余时扫描至首个大写字节，比较三字节词元并推进四字节。词元无匹配时保留原分派类型，随后重置阶段、等待和掩码覆盖的队列。调用方在 `0x42988f` 激活主身体，再调用 `0x4236d0`。尾随读取同样按四字节推进，类型需匹配索引 22、变体需为 0。词元不匹配时在 `0x423f4d` 恢复本次尾随检查前的游标。类别 72 的阶段 1 进入 `0x42933b`，等待结束时 `0x4293f7` 再次扣减剩余计数。[指令与分派](../analysis/game-legacy-battle-rid0-interruption-v1/source-check.json)

**推测**。从未读字段 `0|F|FF|` 开始的合成输入会先得到 `F|F`，尾随检查到达 `RID`。改成 `0|2|FF|` 时，第一次前进会跨过 `R`，尾随检查读到 `ID|`。在 `FF` 后多一个分隔符可使相同扫描到达 `RID`。同组一个后继时，物理等待后剩余计数为零。同组两个 `CFP` 时，只有第一个后继获执行。静态分支与七条独立游标回放提供依据，原版动态结果待验证。[扫描回放](../analysis/game-legacy-battle-rid0-interruption-v1/source-check.json)

**事实**。`0x40a090` 设置当前对象的删除标志。遍历器经过 `0x40a02e` 的相位检查后，在 `0x40a05c` 调用单对象析构。读取的 `0x40a0a0` 析构体仅释放当前对象的数据与对象本身。原版在动作 221 前离场时对交接对象的完整处置路径待验证。[对象释放](../analysis/game-legacy-battle-rid0-interruption-v1/source-check.json)

<a id="stage264-legacy-battle-rid0-receive"></a>

## stage264 配对生产者与动作 221

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 12 个读取窗口逐字节匹配 PE。类别 72 在 `0x42f0af` 进入配对路径，`0x42987d` 生成动作与元组，`0x42988f` 激活主身体，随后 `0x429898` 调用 `0x4236d0` 处理尾随记录。[源核验](../analysis/game-legacy-battle-rid0-receive-v1/source-check.json)

**事实**。`0x423868` 查找 A 槽原身体，`0x423e61` 给它写入交接指针，`0x423e7a` 追加动作 221，`0x423e93` 追加 `[a, 0, a, b]`。动作写入使用尾索引。动作 14 在 `0x40c9bf` 查找当前登记的目标，最终分支推进受击身体的当前动作。[指令与调用](../analysis/game-legacy-battle-rid0-receive-v1/source-check.json)

**事实**。动作 221 入口 `0x416718` 读取当前元组中的 A、B。首帧在 `0x41674a` 安装 B，分支保留此前的 B 对象。回落完成后 `0x416966` 处理 A 槽旧对象，`0x41697f` 安装新 A 并在 `0x416a42` 激活。之后 `0x416ac2` 激活当时登记的 B，`0x416ac8` 标记旧父身体删除。[分派与写入](../analysis/game-legacy-battle-rid0-receive-v1/source-check.json)

**推测与待验证**。尚未起步的旧 B 被覆盖后，依赖该身体的等待失去可达的命中来源。共享客户端据此解除受追踪的等待，已起步的旧 B 则继续原队列。这两种时序已在本地回放复现，原版实际帧序仍待核验。[回放](../analysis/game-legacy-battle-rid0-receive-v1/validation.json)

<a id="stage263-legacy-battle-following-results"></a>

## stage263 后续物理配对的结果与资源元组

**事实**。固定旧版 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 14 个窗口逐字节匹配 PE。两组交叉引用核实 `0x424f2f` 到生产者 `0x436e60` 以及 `0x40cbe6` 到消费者 `0x41a030`。[源核验](../analysis/game-legacy-battle-following-results-v1/source-check.json)

**事实**。生产者在 `0x424f41` 排入动作 14，在 `0x425294` 为目标排入等待 0。生产者 `0x4253dc`、`0x4253e8`、`0x4253fe` 依次测试 `0x8000`、`0x4000`、`0x2000`。最终结果在 `0x40ce6c`、`0x40d059` 或 `0x40d330` 推进受击身体，反射分支先在 `0x40d32a` 推进攻击者动作，再在 `0x40d5a1` 消费其结果元组。[调用核验](../analysis/game-legacy-battle-following-results-v1/source-check.json)

**事实**。标记 `0x800000` 存在时，`0x436e60` 调三次元组写入，追加两条资源元组和一条结果副本。`0x436ee0` 按三次元组推进读取资源并停在副本。`0x41a0e6` 独立使用 `0x2000` 选择元数据归属，优先级更高的免伤或治疗可同时命中目标队列。`0x4fd632` 比较动画当前资源和缓存资源，改变时从 `0x4fd642` 重置帧和延迟。[操作数与调用](../analysis/game-legacy-battle-following-results-v1/source-check.json)

**推测与待验证**。原版资源切换可以重新起播。同一结果副本上的第二个动画信号已经在原创夹具中复现，原版如何经历该组合仍缺运行记录。尾随 RID0 的同类受击等待继续单独追踪。[回放](../analysis/game-legacy-battle-following-results-v1/validation.json)

<a id="stage262-legacy-battle-late-recipient"></a>

## stage262 命中时的目标动作推进

**事实**。固定 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 13 个窗口逐字节匹配 PE，另复核原身体回调整段的文件哈希。生产者在 `0x42471a` 排入攻击者的 24，在 `0x424f41` 排入 14，并在 `0x425294` 为目标排入等待 0。动作 24 在 `0x40a6da` 检查目标当前身体类型，条件满足时由 `0x40a70c` 推进攻击者。[源核验](../analysis/game-legacy-battle-late-recipient-v1/source-check.json)

**事实**。普通动作 14 从攻击者当前元组定位目标。最终信号路径在 `0x40d86d` 传入该身体并调用 `0x434a30`，后者递增当前动作指针，读取下一项作为身体类型。攻击者自己的动作与元组在 `0x40d91b` 和 `0x40d921` 分开推进。[回调与交叉引用](../analysis/game-legacy-battle-late-recipient-v1/source-check.json)

**推断**。合成输入的目标当前动作类型为 0，动作表首项为 24。一次普通受击推进可进入该身体的下一条攻击动作，而对应的等待 0 位于攻击之后。共享实现为这次已交付的结果保存队列位置，原版运行时序待对照。[回放](../analysis/game-legacy-battle-late-recipient-v1/validation.json)

<a id="stage261-legacy-battle-independent-following"></a>

## stage261 物理配对队列的起步与等待兜底

**事实**。固定 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 15 个窗口逐字节匹配 PE。`0x42987d` 调用配对生产者 `0x424310`，`0x42988f` 从主施术者槽调用 `0x434a70`，把队列当前位置的动作复制到身体类型。生产者 `0x42471a` 将 24 写入后续攻击者队列，写入函数设置所有者和忙碌字段。生产者范围内未发现直接调用动作推进 `0x434a30` 或激活 `0x434a70` 的交叉引用。[源核验](../analysis/game-legacy-battle-independent-following-v1/source-check.json)

**事实**。身体回调以当前类型分派，动作 0 的特例检查队列中的 161。动作 71 通过当前元组查找具体身体并推进它与自身，动作 72 推进自身元组。动作 24 检查目标的身体类型，后续普通受击推进也指向该次结果的具体身体。`0x434c46` 检查 7,200 的等待阈值，超过后逐一重置依赖身体，排入 11、38 并激活。[回调与交叉引用](../analysis/game-legacy-battle-independent-following-v1/source-check.json)

**推断**。两条合成输入中，动作 24 在独立身体的队列首项，且没有会推进该身体的其他元组。该攻击没有已证实的启动来源。共享客户端本地原流程经 7,200 次等待兜底结束，原版的实际运行结果待验证。[回放](../analysis/game-legacy-battle-independent-following-v1/validation.json)

<a id="stage260-legacy-battle-missing-lookahead"></a>

## stage260 后续目标查找与队列清理

**事实**。固定 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 12 个窗口逐字节匹配 PE，并复核 4 个已有窗口。`0x4257b4` 和 `0x425cdf` 调用 `0x436c20`，后者用复制的游标扫描 `0x1010` 连续段，匹配攻击者后直接返回目标槽。`0x4242c2` 至 `0x4242ef` 在零结果路径追加动作 3、四字段转向元组和动作 72。[源核验](../analysis/game-legacy-battle-missing-lookahead-v1/source-check.json)

**事实**。`0x425f1c` 消费后续目标字段，`0x425f30` 访问身体表，空槽从 `0x425f3a` 跳往 `0x425fb9`。组内清理 `0x436930` 按预约调用 `0x4347e0`，清除普通身体的动作和元组索引，死亡或当前动作 13 的身体保留队列。常规返回段在 `0x426012` 至 `0x42603a` 写入 7、11、10。写动作设置忙碌，清理保留忙碌字段，等待兜底阈值为 7,200。[源核验](../analysis/game-legacy-battle-missing-lookahead-v1/source-check.json) · [既有等待证据](../analysis/game-legacy-battle-missing-v1/source-check.json)

**事实（静态字节推导）**。原版有组内后继时从中断游标扫描首个大写字节，取 3 字节并推进 4 字节。`0x533e54` 的 24 项表中没有两条原创输入对应的候选 `A|1` 与 `FF|`。共享客户端的组内 CFP 沿已解码边界继续，原版对此输入的运行结果待验证。[游标核对](../analysis/game-legacy-battle-missing-lookahead-v1/source-check.json)

<a id="stage259-legacy-battle-following-strikes"></a>

## stage259 固定旧版的后续配对循环与蓄力完成

**事实**。固定 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 33 个字节窗口匹配原 PE。`0x425ea6` 与 `0x425f1c` 读取后续攻击者和目标，`0x425ecc` 与 `0x425f37` 检查身体，`0x425fb3` 跳回 `0x42470d` 追加下一组。普通支路在 `0x424f41` 写攻击动作 14，在 `0x425294` 写受击等待 0。动作 24 的 `0x40a6da` 读取目标当前动作。[源核验](../analysis/game-legacy-battle-following-strikes-v1/source-check.json)

**事实**。动作 113 在 `0x411ed6` 创建蓄力对象，给双方设置冻结状态并进入 157。创建器 `0x41dc82` 绑定回调 `0x41b640`，动画完成后在 `0x41b669` 将父身体蓄力状态置为 2。动作 157 在 `0x412a0a` 后清理状态并推进自身。共享实现的逐击等待和蓄力取消顺序已通过原创夹具，原版运行顺序待比对。[源核验](../analysis/game-legacy-battle-following-strikes-v1/source-check.json) · [通信规格](logic-protocol-spec.md#stage259-legacy-battle-following-strikes)

<a id="stage258-legacy-battle-repeated-protection"></a>

## stage258 固定旧版的重复写入与后续目标

**事实**。固定 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 24 个读窗匹配原 PE。外层调用 `0x4248da` 返回后在 `0x4248ec` 向原受保护槽追加 11，内层在 `0x424ff7` 仍调用同一追加例程。动作 11 从 `0x40a325` 执行，普通角色在 `0x40a438` 检查归位距离 5，再由 `0x40a44a` 推进。动作 4 与 42 从当前元组定位目标。[源核验](../analysis/game-legacy-battle-repeated-protection-v1/source-check.json)

**事实**。`0x4257b4`、`0x425cdf` 调用 `0x436c20` 查找后续目标。它复制游标，依次读取攻击者、目标和标记，按 `0x1010` 连续段扫描，匹配攻击者后返回目标。`0x4234e0` 把 50、51 映射到 20、21。`0x4242b3` 起的零结果分支在目标有效时追加动作 3、四字段转向元组和动作 72。重复保护的共享回放顺序与原版动态调度仍待比对。[源核验](../analysis/game-legacy-battle-repeated-protection-v1/source-check.json) · [通信规格](logic-protocol-spec.md#stage258-legacy-battle-repeated-protection)

<a id="stage257-legacy-battle-guard-wait"></a>

## stage257 固定旧版的护卫动作和元组

**事实**。固定 x86 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 23 个读窗逐字节匹配 PE。`0x4248da` 与 `0x424ff7` 调用 `0x423fa0`，每次调用从 `0x42403e` 和 `0x424154` 写入护卫的靠近与返回元组，并给受保护角色写入 `[0,27,71,72,62,1]`。动作和元组追加分别使用 `0x434990`、`0x434a90`。`0x4241f0` 在数量为零时先追加动作 35，随后追加 71、72。[源核验](../analysis/game-legacy-battle-guard-wait-v1/source-check.json)

**事实**。动作 71 从 `0x40f505` 读取当前目标槽，并在 `0x40f51a`、`0x40f520` 依次推进目标和自身。动作 72 分别推进元组和动作，62 推进自身到下一动作，1 进入站立动画。动作 232 在 `0x417e59` 读取当前结果，包含 16 回调和距离 20 的判定。共享回放的延迟和元组安排属于本地实现决策。固定旧版的动态回调顺序及同一角色重复受保护仍待验证。[源核验](../analysis/game-legacy-battle-guard-wait-v1/source-check.json) · [规格](logic-protocol-spec.md#stage257-legacy-battle-guard-wait)

<a id="stage256-legacy-battle-skl113-wire"></a>

## stage256 固定旧版的 SKL113 预读与执行分派

**事实**。固定 x86 样本 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 49 个窗口与原 PE 文件字节一致。预读表 `0x436434` 导向 `0x435cf2`，类别 113 强制进入配对读入器 `0x435000`。该读入器在 `0x435106` 只对类别 72 读取嵌套段，113 在同一位置按后续配对预约槽位。[源证据](../analysis/game-legacy-battle-skl113-wire-v1/source-check.json)

**事实**。执行表 `0x433944` 导向 `0x42f098`，类别 113 在 `0x42f0b8` 进入配对生产者 `0x424310`。该生产者在 `0x424b91` 和 `0x424f54` 分别检查类别与外层结果位，再读取嵌套目标、标记和数量，并于 `0x425123` 追加动作 232。管理器由 `0x436844` 提交预读端位置，`0x4368db` 为回调对象保存独立参数游标。回调的 `0x42625e` 继续扫描未知标记，附带 RID 在 `0x4236d0` 只查执行端紧接的标记。[源证据](../analysis/game-legacy-battle-skl113-wire-v1/source-check.json)

**推测**。按已核指令建立的有限字节回放表明，带双 FF 的记录可以让两读者分别停止，紧接的三个大写字符由原版标记扫描决定是否仍能抵达同组后续命令。原版实战及现行版数据分布待验证。[验收](validation.md#stage256-legacy-battle-skl113-wire)

<a id="stage255-legacy-battle-guard-alias"></a>

## stage255 固定旧版的同槽队列与近距离返还

**事实**。固定 x86 样本 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0、Ghidra 12.1.4 的 20 段内存投影已与该 PE 文件字节核对。变体与类别检查位于 `0x42f882` 和 `0x42f88d`。生产者在 `0x42f8ef` 测试护卫位，先由 `0x42f8f8` 选择护卫体，随后由 `0x42fa75` 选择施法者体，两处均访问 `0x58fac4` 注册表。结果槽写在 `0x42fb1e`，两个结果元组由 `0x42fb61`、`0x42fb7d` 追加，`0x42fbbd` 追加 216。[源证据](../analysis/game-legacy-battle-guard-alias-v1/source-check.json)

**事实**。动作 71 先按当前元组取角色并于 `0x40f51a` 推进，再于 `0x40f520` 推进本体。两次调用均进入 `0x434a30`，单次将动作游标加一。动作 22 返还到距离小于 20 时，类别 266 分支在 `0x40c4f1` 清计数，在 `0x40c501` 检查下一动作 216，命中则先推进父角色再移除飞行物。动作 23 的计数备用路径在 `0x40c540`。嵌套交接由 `0x424ff7` 调用 `0x423fa0` 构造，`0x42510e` 和 `0x425123` 分别追加嵌套结果元组和 232。[源证据](../analysis/game-legacy-battle-guard-alias-v1/source-check.json)

**推测**。施法者与护卫解析到同一槽时，两组动作进入同一队列，动作 71 引用自身时可对同一游标推进两次。静态路径支持这个推导，原版同槽实战的时序与最终结果待验证。[验收](validation.md#stage255-legacy-battle-guard-alias)

<a id="stage254-legacy-battle-guard-departure"></a>

## stage254 固定旧版护卫飞行的返程

**事实**。REA 6.7.0 和 Ghidra 12.1.4 核对固定 `cg_se_6000.exe`，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。动作 22 在 `0x40c3bc` 判断距施法者小于 60，`0x40c412` 检查类别 266，`0x40c43c` 检查施法者当前元组的 `0x200`。随后推进施法者的元组和动作，在 `0x40c46c` 为同一飞行物附上护卫槽。护卫处于非零状态时先排 24，随后固定排 71、24、217。[源证据](../analysis/game-legacy-battle-guard-departure-v1/source-check.json)

**事实**。动作 217 由 `0x415369` 进入，距护卫小于 20 时由 `0x4153f8` 放行护卫。飞行物推进元组，切回 21，重设朝向并减半速度，随后由返程继续放行施法者。源动作 22 在近距离捕获时还有 `0x40c501` 的后续 216 检查，该时序留待无护卫样本单独核对。[源证据](../analysis/game-legacy-battle-guard-departure-v1/source-check.json)

**事实**。动作 49 在 `0x40ea4a` 清空注册槽后回收对象。完成检查 `0x434baa` 跳过空槽，对仍忙碌角色累加等待，`0x434c46` 超过 7200 后重置其预约队列。嵌套护卫槽在 `0x43515b` 参与预读预约。**待验证**。原版护卫异常退场、同槽施法者护卫及第二趟飞行的实际运行结果。[源证据](../analysis/game-legacy-battle-guard-departure-v1/source-check.json)

<a id="stage253-legacy-battle-guard-release"></a>

## stage253 固定旧版的护卫放行与自身 RID 栈槽

**事实**。样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核对 `0x423fa0` 的三条队列。施法者的动作 71 启动护卫，随后停在 0。护卫的动作 71 指向原目标，原目标的动作 71 再指回施法者。动作 71 在 `0x40f51a` 推进元组所指角色，在 `0x40f520` 推进自己。帮助函数 `0x434a30` 遇空对象直接返回。嵌套生产者 `0x424ff7` 使用护卫返回槽，`0x425123` 排动作 232，`0x425d11` 接护卫尾部。[源证据](../analysis/game-legacy-battle-guard-release-v1/source-check.json)

**事实**。SKL266 变体 2 带护卫的尾部在 `0x42f903` 为护卫排初始 0，在 `0x42fa69` 排末尾的 0，再由 `0x42fbbd` 排 216。施法者的两个等待分别来自 `0x42fa7e` 与 `0x42fabf`。动作 72 只推进本角色的元组和动作，23 只延迟后推进本角色。源样本无飞行目标时的实际护卫收尾待验证。[源证据](../analysis/game-legacy-battle-guard-release-v1/source-check.json)

**事实**。以 `0x42f54a` 的 ESP 为基准，`0x42fb86` 与 `0x42fb82` 读取 +0x3c 和 +0x14。对应写入为外部 RID 的 `0x42f628`、`0x42f63a`。自身 RID 只将第一个解析值写到 +0x24，第二、第三个解析结果在该分支被丢弃。**待验证**。没有外部 RID 时这两个栈槽进入该分支之前的内容。预读 `0x435106` 仅按类别 72 进入嵌套读取，类别 113 的对应网络输入仍需独立证据。[源证据](../analysis/game-legacy-battle-guard-release-v1/source-check.json)

<a id="stage252-legacy-battle-physical-boundaries"></a>

## stage252 固定旧版物理技能的嵌套与终止边界

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核实 `0x435106` 仅为 SKL72 消费嵌套段，`0x43511e` 保留槽值，`0x43515b` 只增加护卫的预约计数。SKL72、113 的执行分支共用 `0x424f4e`，`0x42510e` 写入目标元组，`0x425123` 排动作 232。带护卫时用 `0x423fa0` 返回的槽作为该动作的接收方。[源证据](../analysis/game-legacy-battle-physical-boundaries-v1/source-check.json)

**事实**。动作 232 在 `0x417eac` 用目标指针计算距离，并在 `0x417ee6` 读取角色体。护卫动作 4 也经 `0x419fd0` 取距离。动作 42、71 分别经有空值分支的 `0x419e90`、`0x434a30` 处理转向与放行。[源证据](../analysis/game-legacy-battle-physical-boundaries-v1/source-check.json)

**事实**。通用正变体在 FF 后写终止元组和动作 72，变体 2 另排 23。SKL266 变体 2 可从最后一个自身结果排动作 216。SKL73 的 FF 直接激活已有队列。动作 15、18 会略过终止元组的瞄准，但后续动画信号仍可进入单发或多发构造。动作 41 只读取子对象指针并驱动姿态，自身没有出队调用。[源证据](../analysis/game-legacy-battle-physical-boundaries-v1/source-check.json)

**待验证**。原版处理这些空指针与终止索引后的运行结果，以及没有外部 RID 时 `0x42fb82`、`0x42fb86` 所读临时字段的来源。[源证据](../analysis/game-legacy-battle-physical-boundaries-v1/source-check.json)

<a id="stage251-legacy-battle-physical-registry"></a>

## stage251 固定旧版物理技能的角色槽

**事实**。`cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 和 Ghidra 12.1.4 核实普通 C 的 `0x433dcb` 登记列出的角色，`0x43464a` 清空未列出的现有槽。C 的 `0x20` 标志提前返回。PLV 在 `0x428d4f` 排动作 49，该动作的 `0x40ea4a` 将当前槽置零。[源证据](../analysis/game-legacy-battle-physical-registry-v1/source-check.json)

**事实**。`0x4350da`、`0x435d30`、`0x435d93` 写依赖计数，`0x436599` 至 `0x4365b3` 按计数预约。`0x436880` 按依赖掩码建立命令对象并调用 `0x4347e0`，后者跳过空槽。完成检查 `0x434b90` 在 `0x434baa` 跳过空槽。[源证据](../analysis/game-legacy-battle-physical-registry-v1/source-check.json)

**事实**。配对、SKL260 串联和 SKL72、113 嵌套的护卫调用到 `0x423fa0`，`0x42404c` 直接取护卫对象的 `+0x0c`。SKL73 和通用正变体分别在 `0x4294f4`、`0x42f0fa` 先取施法者对象的 `+0x0c`，随后才检查空值。通用正变体的自身结果会覆盖前一条，`0x42f5d5` 只保存槽号。SKL266 变体 2 在最终保存结果的 `0x200` 置位时，经 `0x42f936` 取护卫角色体。[源证据](../analysis/game-legacy-battle-physical-registry-v1/source-check.json)

**待验证**。空槽进入上述解引用后原版进程的实际结果。SKL113 嵌套生产者与 M 预读的字段边界另见既有对照。[源证据](../analysis/game-legacy-battle-physical-registry-v1/source-check.json) · [嵌套字段](#stage212)

<a id="stage250-legacy-battle-assist-terminator"></a>

## stage250 固定旧版协作者 FF 与换位清理

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核实 `0x435925` 先保留施法者依赖计数，变体 12、13 的协作者 `FF` 由 `0x435a1a`、`0x435a83` 跳到 `0x4362c6`。该返回保留主槽 255 和分组递增标志，跳过正常目标列表末尾的附带 RID 检查 `0x435dcd`。[源证据](../analysis/game-legacy-battle-assist-terminator-v1/source-check.json)

**事实**。执行侧已由 `0x42c727` 至 `0x42c7be` 排入施法者准备动作。协作者 `FF` 在 `0x42ce88` 或 `0x42d3b3` 进入 `0x4335a3` 返回段，未走激活、清理或阶段推进。阶段 0 再次进入时从当前数值游标读字段。按 `0x434670` 的静态规则投影，后接的 `SKL|` 会读作 0 并移动四字节。原版运行时是否再次执行及后续效果仍待验证。[源证据](../analysis/game-legacy-battle-assist-terminator-v1/source-check.json)

**事实**。变体 7 在 `0x42cad1` 跳过状态 32 伙伴的阵位改写，仍执行 `0x42cb6c` 与 `0x42cb73` 的注册表交换。后续缺席目标触发 `0x42cd0f` 的清理。变体 12 有有效协作者但目标列表为空时，动作 84 会先索引首目标再读取其角色体，实际原版运行结果待验证。[源证据](../analysis/game-legacy-battle-assist-terminator-v1/source-check.json)

<a id="stage249-legacy-battle-physical-missing"></a>

## stage249 固定旧版物理技能中断

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核实 `0x42987d` 调用 `0x424310`，PE 三组分发表中共有 29 类到达物理配对入口。首攻击者在动作 38 前清理。首目标在技能类别、等级、MP 代价和动作 53 写入前清理。SKL105 的残影标记和 SKL258 的中点在首目标检查之前写入。[源证据](../analysis/game-legacy-battle-physical-missing-v1/source-check.json)

**事实**。后续攻击者、后续目标及 SKL260 链目标缺席到达 `0x425fb9`，清理后依据前缀的击倒结果安排 11、44 或 7、11、10。首段后续目标缺席时，257 与满级 262 可在清理前排 74。清理后 262 在 `0x42605e` 重读等级，`0x4348b6` 会重置普通角色的等级。链目标的查找晚于动作 242 与外层元组的写入。SKL73 正变体缺席目标走 `0x429839`，通用正变体走 `0x42f87a`，后者可排 72、23，或继续 SKL266 的保存自身结果。[源证据](../analysis/game-legacy-battle-physical-missing-v1/source-check.json)

**待验证**。护卫入口 `0x423fa0` 与正变体初始施法者存在先解引用的路径。其空值触发条件及原版运行结果需要独立证据，当前继续预检。原版清理后会尝试附带 RID0 并写阶段，该游标组合待核验。[源证据](../analysis/game-legacy-battle-physical-missing-v1/source-check.json)

<a id="stage248-legacy-battle-family-missing"></a>

## stage248 固定旧版技能族缺席路径

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核验了 `0x433878` 的跳转表与 `0x4338a8` 的选择表。54 类分别进入状态列表 `0x42b022`、状态自身 `0x42b5fc`、数值 `0x429c15`、施法 `0x42a495` 和 SKL82 `0x42b947`。五个缺席施法者分支均调用 `0x436930` 后返回。自身状态技没有目标列表。[源证据](../analysis/game-legacy-battle-family-missing-v1/source-check.json)

**事实**。缺席目标在读取本目标结果字段前触发清理。状态列表 `0x42b5b3` 清理后追加施法者终止元组。SKL82 `0x42be25` 清理后直接进入激活与 RID0 前瞻。数值 `0x42a305` 与施法 `0x42ac6f` 清理后写终止元组，再按 `0x58fb48` 的非零反射累积值排队。SKL31 在 `0x42ae44` 与 `0x42aeba` 用当前缺席槽选反馈动作。施法的动作 74 在 `0x42afcd` 指向该槽，`0x434990` 遇空体直接返回。[源证据](../analysis/game-legacy-battle-family-missing-v1/source-check.json)

**待验证**。物理入口 `0x424310` 已定位首攻击者与首目标的两个早退，后续护卫与多段命中另有分支。原版异常游标下的 RID0 与阶段写入组合仍需独立运行证据。[源证据](../analysis/game-legacy-battle-family-missing-v1/source-check.json)

<a id="stage247-legacy-battle-missing"></a>

## stage247 固定旧版 SKL98 缺席分支

**事实**。固定样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 对 `0x436930` 返回 86 处交叉引用，其中 SKL98 生产分支有 8 处。缺席施法者或协作者时，生产分支调用清理后直接返回。缺席目标时，分支清理后继续写终止元组。变体 12、13 的尾部另给协作者排动作 72。[源证据](../analysis/game-legacy-battle-missing-v1/source-check.json)

**事实**。`0x436930` 递减组内记录数。在还有记录时从 `+0x64` 现有游标扫描大写字节，清阶段、延迟和等待计数。最后一条清除活动掩码与命令槽。两条路径都用 `0x4347e0` 重置依赖队列，跳过缺席、死亡及动作 13 的角色体。忙碌字段由 `0x4349ce` 设置，重置后仍可能保留。`0x434c46` 检查 7,200 次阈值，超过后重排动作 11、38。[源证据](../analysis/game-legacy-battle-missing-v1/source-check.json)

**事实**。晚期缺席分支还可调用 `0x4236d0`，随后由 `0x42da02` 增加阶段。未读完的目标字段会参与上述扫描。**待验证**。原版异常游标下的附带 RID、实际续接以及其他技能族的对应边界。[源证据](../analysis/game-legacy-battle-missing-v1/source-check.json)

<a id="stage246-legacy-battle-status-assist"></a>

## stage246 固定旧版 SKL98 变体 12、13

**事实**。固定样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 和 Ghidra 12.1.4 对 `0x599bbc` 返回 39 处交叉引用，均在两个队列生成分支。`0x42cebc`、`0x42d3e4` 将协作者槽写入施法者 `+0x100c`，动作 135 的 `0x412248` 在信号后启动该槽。[源证据](../analysis/game-legacy-battle-status-assist-v1/source-check.json)

**事实**。变体 12 从 `0x42d128` 读目标，`0x42d1eb` 按 `0x800000` 扩展资源元组。协作者执行动作 84，由 `0x40efb6` 起消费命中和角色资源，动作 87 关闭震动。变体 13 从 `0x42d56f` 读固定三字段，`0x42d688` 给目标写数字样式 5。动作 88 经 `0x40f403` 启动目标的 146、155，使用 `0x4128f1` 的 HP 回复分支。[源证据](../analysis/game-legacy-battle-status-assist-v1/source-check.json)

**事实**。两种协作者在等于当前本方槽时排 244，否则排 50、49。`0x42d36e`、`0x42d6af` 写终止元组，之后排 72。**待验证**。缺席目标 `0x436930` 的清理与后续记录、原版渲染和现行版本对应关系。[源证据](../analysis/game-legacy-battle-status-assist-v1/source-check.json)

<a id="stage245-legacy-battle-status-position"></a>

## stage245 固定旧版 SKL98 变体 7

**事实**。样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 和 Ghidra 12.1.4 的 18 个读取窗口与原 PE 字节一致。`0x4359a2` 的分支经 `0x419840` 为目标及配对槽登记依赖，直到 FF。[源证据](../analysis/game-legacy-battle-status-position-v1/source-check.json)

**事实**。`0x42c976` 起按目标出现顺序读取注册表。当前本方槽与施法槽只在等于本次目标槽时分别由 `0x42c9d9`、`0x42ca09` 改为配对槽。`0x42c9f2` 在施法槽改写前追加目的槽元组。`0x42cb6c` 交换注册表项，随后更新 `+0x13b4` 和 `+0x13b0` 的关联对象锚点。目标进入动作 78、11，配对角色在状态值 32 时保留原阵位并跳过其动作 11。[源证据](../analysis/game-legacy-battle-status-position-v1/source-check.json)

**事实**。动作 135 的 `0x412570` 从元组槽推进随机种子，`0x434a70` 对此时为空的目的槽返回。共同末尾 `0x42d9da` 排入终止元组，`0x42d9f6` 接续 RID 消费。下一份 C 在 `0x437e78` 将已收 P 的槽写回当前本方槽。**待验证**。缺席选中角色的 `0x436930` 清理分支、原版绘制和现行版本对应关系。[源证据](../analysis/game-legacy-battle-status-position-v1/source-check.json)

<a id="stage244-legacy-battle-status-slots"></a>

## stage244 SKL98 放大、退场及附带 RID0

**事实**。固定旧样本 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 28 个读取窗口均与原 PE 相符。另核验五条独立分支、33 条调用、31 处操作数和九项动作表映射。[原 PE 偏移及 REA 编号](../analysis/game-legacy-battle-status-slots-v1/source-check.json)

**事实**。变体 6 从 `0x42c831` 为目标排列 78、81、66、79、54。动作 81 在 `0x40f6da` 选择动画 9，两轴每次各加 `0x52d3e0` 的单精度 0.005。第一轴达到 `0x52d3dc` 的单精度 1.3 时进入下一动作并置 `0x1000`。动作 54 用动画 5，完成后清空帧与信号字段。78 和 79 分别从角色体的 `+0x1018` 和 `+0x101c` 读音效编号。[动作表和写入](../analysis/game-legacy-battle-status-slots-v1/source-check.json)

**事实**。变体 8 从 `0x42cd38` 读取目标槽，遇死亡位 2 调用 `0x4348e0` 重置。等于本方当前配对槽时先追加 `[-2, 0, 0]` 与动作 218。随后排列 78、51、49。两支在 `0x42d9da` 追加终止元组，在 `0x42d9f0` 激活施法者，再调用 `0x4236d0` 读取附带 RID。[队列和消费者](../analysis/game-legacy-battle-status-slots-v1/source-check.json)

**事实**。变体 7 经 `0x419840` 计算配对槽，并在 `0x42c9d9`、`0x42ca09` 条件写入本方槽与施法者槽。变体 12、13 分别在 `0x42ce83`、`0x42d3ae` 保存额外槽到 `0x599bbc`。**待验证**。这三支完整状态变化、缺席目标清理、原版画面及音效输出。[后续工作](development-plan.md#stage244-legacy-battle-status-slots)

<a id="stage243-legacy-game-stream"></a>

## stage243 游戏网络泵与空闲发包

**事实**。固定旧样本 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 提取的 14 个读取窗口全部与原 PE 文件字节相符，另核验 22 处操作数、12 条调用及两段函数观察。[原 PE 偏移和 REA 编号](../analysis/game-legacy-game-stream-v1/source-check.json)

**事实**。`0x44fc66` 调用网络泵 `0x4edef0`。泵首次在 `0x4edf13` 写入 `GetTickCount` 至 `0xd18e30`。激活条件通过后，每八次检查一次。套接字发送返回正数时，`0x4ee218` 更新同一单元。接收分支更新另一单元 `0xd1901c`。从 `0x4ee251` 到 `0x4ee25a` 的无符号比较在当前 tick 严格大于最后发送 tick 加 30000 时通过。套接字状态为 1 时，`0x4ee271` 用 `0x567678` 的 `nr\0` 调用 `0x4f8760`，格式化标签取自 `0x567be8` 的 `3$}\0`。[指令与分派证据](../analysis/game-legacy-game-stream-v1/source-check.json)

**推测**。依据空闲发送条件和反复发包行为，将该记录用作连接保活。**待验证**。原版运行节奏、服务端如何处理这条记录及现行版本的对应行为。[通信规格](logic-protocol-spec.md#stage243-legacy-game-stream)

<a id="stage242-legacy-battle-status-variant"></a>

## stage242 SKL98 目标结算与动作 43

**事实**。固定旧样本 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 31 个窗口与 PE 一致，并核对 54 条调用。预读 `0x435902` 与队列 `0x42c67b` 均把 0 至 5、9、10、11、14 导入共同记录。施法队列为 24、53、37、38、135、62。动作 37 在 `0x40e7fd` 以递减的除数控制 270 次回调，在第 36、70、102、132、160、186、210、232、252、270 次切换动画。[源证据](../analysis/game-legacy-battle-status-variant-v1/source-check.json)

**事实**。动作 135 在动画信号 10000 至 19999 到达后，在 `0x412570` 按动作记录长度、普通角色数及两个槽号之和重置随机流，再启动目标。动作 138 在类别 98 下使用变体编号选状态资源。变体 10 可进入特殊槽的 178 和 199，后者读取已有数值样式和金额。变体 11 读取额外金额，复活路径排入 77、155 和 38。[分派和回调](../analysis/game-legacy-battle-status-variant-v1/source-check.json)

**事实**。动作 43 在 `0x40df95` 包装零后写入角色的 `+0x174`、`+0x178`、`+0x17c`，与 `C` 首个生命字段在 `0x433e3d` 至 `0x433e4d` 写入的单元相同。包装零消耗一次随机数。该证据修正阶段 199 对动作 43 的解释。历史夹具保留，13 条受影响轨迹已按独立模型重新计算。[重算轨迹](../analysis/game-legacy-battle-status-variant-v1/hp-zero-traces.json)

**待验证**。独立变体 6、7、8、12、13、附带 RID、原版运行时节奏与素材输出。

<a id="stage241-legacy-battle-summon"></a>

## stage241 SKL93 角色登记与动作释放

**事实**。固定旧样本 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 24 个读取窗口与原 PE 一致，独立核对 39 条调用和三张类别分派的目标。预读在 `0x435895` 消费费用、附加字、施法槽及以 FF 结尾的角色记录。命令在 `0x42c243` 将目标槽原对象标记删除，再经 `0x433a10` 构造新对象，设置位置、零缩放和各字段。四个数值分别写入对象的 `+0x170`、`+0x180`、`+0x1b0`、`+0x1c0`。[`source-check.json`](../analysis/game-legacy-battle-summon-v1/source-check.json)

**事实**。施法者排入 24、53、66、65，提示资源为 `0x5742`。动作 53 经 `0x419860` 扣除正的费用，负结果归零。动作 65 在 `0x4125a0` 检查 10000 至 19999 的动画信号，按元组逐个启动当时的目标槽对象。目标动作 78、52 播放音效 `0xcc` 并逐步放大。命令在 `0x432e51` 检查忙碌与位置状态，恢复施法者朝向并释放。 [调用与动作表](../analysis/game-legacy-battle-summon-v1/source-check.json)

**待验证**。施法者自身作为替换目标、原版运行时的资源与画面，以及现行客户端的对应分支。

<a id="stage240-legacy-battle-city-return"></a>

## stage240 战斗内回城的两个边界

**事实**。固定历史样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 28 个窗口与原 PE 一致。菜单 `0x4878c6` 发送 `4}o`，主状态 10 时 `0x4878d8` 置子状态 7，随后播放音效 60 并置回城标志 `0xc5ec18`。两处未形成标准 Ghidra 函数的回调和序列化入口以原文件字节核实。[源证据](../analysis/game-legacy-battle-city-return-v1/source-check.json)

**事实**。跳表把子状态 7、8 指向 `0x43828f`、`0x43834b`。7 在 `0x4382a0` 清理战斗，在 `0x4382bd` 渐隐音乐并捕获屏幕，随后直接落入 8。回城标志为 1 时 `0x43837b` 调用 type14。完成后 `0x43838e` 进入主状态 9 子状态 1，清除普通角色门并在 `0x4383d7` 发送 `$!~ 0`。[跳表与调用](../analysis/game-legacy-battle-city-return-v1/source-check.json)

**事实**。已置回城标志时，`>HY` 的 `0x4f3445` 分支不依赖当前主状态。该分支能直接进入 9/1 并在 `0x4f3574` 另发 `$!~ 0`，也能在战斗转场已经发过一次后再次进入。清标志仍在地图入场结束点。[两处发送](../analysis/game-legacy-battle-city-return-v1/source-check.json)

**事实**。`TfD` 在 `0x4ef886` 仅对主状态 9 检查进入子状态 200 的条件，`0x4ef8ce` 之后的场景数据更新可以在主状态 10 运行。因此战斗退场中的换图先供 9/1 重建使用，9/1 之后的新换图才进入 200 系列。两条地图路径都可因回城标志选择 type15。[收包条件](../analysis/game-legacy-battle-city-return-v1/source-check.json)

**待验证**。实际服务器的包间时序、原版系统画面及现行版本对应行为。[未决范围](known-issues.md#stage240-legacy-battle-city-return)

<a id="stage239-legacy-city-return"></a>

## stage239 注销回城的普通重建和 type15

**事实**。本轮复用 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的固定历史 `cg_se_6000.exe`。REA 6.7.0 与 Ghidra 12.1.4 的 46 个读取窗口与 PE 文件一致。菜单在 `0x4878c6` 发送零字段 `4}o`，在 `0x4878fb` 置回城标志 `0xc5ec18`。[源证据](../analysis/game-legacy-city-return-v1/source-check.json)

**事实**。普通主状态 9 的 `TfD` 在 `0x4ef886` 至 `0x4ef8ba` 检查换图条件并设置子状态 200。`0x501cf2` 在回城标志为 1 时使用 type14。后续有 `0xbff32c` 门，子状态 205 在 `0x501d5b` 等待五次，再经 `0x501e2e` 捕获目标画面。子状态 204 在 `0x501ece` 执行 type15，完成时清标志并转回普通场景。[跳表与调用](../analysis/game-legacy-city-return-v1/source-check.json)

**事实**。带回城标志的 `>HY` 在 `0x4f3445` 分流，早于普通战斗模式判断。它清理旧角色体，经 `0x4f352b` 进入主状态 9 子状态 1，并在 `0x4f3574` 回送 `$!~ 0`。子状态 11 等待三十次后重建，子状态 2 用 type15。回城期间普通对话分支受标志位限制，`M6c` 在 `0x4f470a` 直接回送 `,ua 0`。[跳表与调用](../analysis/game-legacy-city-return-v1/source-check.json)

**事实**。`0x5051a0` 把 type15 分派到 `0x503330` 的 case 7。预处理到第 241 行超出 −640 至 640，再反向回卷。当第 240 行回到 240 后，每次减少八行的活动范围。第 0 行到达零时结束。`0x503d46` 以 0 至 479 的顺序复制行，独立向量对固定参数得出 49 帧。[逐帧参考](../analysis/game-legacy-city-return-v1/original-vectors.json)

**待验证**。战斗主状态 10 的同一标志还会改变子状态 8 的退场类型。战斗发包与场景刷新在同一连接上的交接、完整原生执行和现行版仍待验证。[未决范围](known-issues.md#stage239-legacy-city-return)

<a id="stage238-legacy-battle-alternate-exit"></a>

## stage238 两个注销菜单及主状态 7 握手

**事实**。固定历史样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 38 个读取窗口和 PE 文件字节一致。菜单描述表 `0x548304`、`0x548324` 分别指向 `0x487860`、`0x487930`，两个回调在悬浮分支分别读取回城与回选服的提示字符串。REA 未识别部分描述表回调的函数边界，调用与条件以物理字节核实。[源证据](../analysis/game-legacy-battle-alternate-exit-v1/source-check.json)

**事实**。回选服的点击分支 `0x487986` 在主状态 10 时把子状态设为 9。跳表项 `0x438680` 指向 `0x438162`，其清理路径经 `0x43827f` 请求进入主状态 7。普通地图的回调由 `0x4879dd` 直接请求主状态 7。两条分支都经 `0x4879f1` 播放音效 60。[跳表及调用](../analysis/game-legacy-battle-alternate-exit-v1/source-check.json)

**事实**。主状态 7 在 `0x456bdd` 完成 type14 后进入握手。若结果字 `0xd5d782` 已为 2，`0x456b00` 跳过发包。其余情况由 `0x456b02` 经 `0x4ef1e0` 调用零字段序列化器 `0x4f8720`，发送 `1^t`。等待中的 `VKW` 由 `0x4ef290` 匹配首字段 `successful`，结果分别为 1 或 0。轮询 `0x4ef230` 将结果 0 归为拒绝，使用无符号差严格超过 600000 毫秒判定超时。主状态 7 对成功、拒绝与超时分别调用 `0x4ee2f0`。[返回结果证据](../analysis/game-legacy-battle-alternate-exit-v1/source-check.json)

**事实**。注销回城在 `0x4878c6` 即调用 `0x4f8840` 发送零字段 `4}o`。`0x4878fb` 置 `0xc5ec18`，主状态 10 时由 `0x4878d8` 置子状态 7。主状态 10 子状态 8 和主状态 9 的 `0x502438` 根据该标志分别选择 type14 和 type15。普通地图的 `>HY` 接收分支也检查该标志，随后可请求主状态 9 子状态 1 并发出 `$!~ 0`。[回城分支](../analysis/game-legacy-battle-alternate-exit-v1/source-check.json)

**待验证**。注销回城的服务端应答和地图、角色、转场之间的重建顺序。原生运行及现行版的对应行为继续跟踪。[未决范围](known-issues.md#stage238-legacy-battle-alternate-exit)

<a id="stage237-legacy-music-phases"></a>

## stage237 选服与战斗音乐消费者

**事实**。固定样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 的 28 个读取窗口和 PE 文件字节一致。主状态 2 经 `0x5016e1` 进入 `0x457c30`，在 `0x457ca1` 播放编号 17。人物选择的 `0x458f28` 开始渐隐，主状态 9 子状态 104 的普通重建可从初始为 0 的 `0xfba3d0` 取得场景曲。[源证据](../analysis/game-legacy-music-phases-v1/source-check.json)

**事实**。`>HY` 的两个数值经 `0x4f8f94` 写到 `0x599e10` 与 `0x58fb30`。`TfD` 第 2、第 9 个数值分别成为地图号与场景模式。`0x437c17` 按场景模式、背景范围和六种战斗模式查表，`0x437cb4` 在地图号 1457–1480 时最终选编号 16。模式 1 下背景编号 238607–238618 有独立表。[查表及边界](../analysis/game-legacy-music-phases-v1/source-check.json)

**事实**。主状态 10 子状态 7 在 `0x4382bd` 启动渐隐。阶段 238 的跳表核对将 `0x438196` 定位到子状态 9。主状态 9 子状态 11 在等待 30 次后，于 `0x50223b` 停止战斗曲，根据待用选择或保存的场景曲在 `0x502283` 或 `0x5022b2` 播放。`S)B` 由 `0x4fb901` 交给 `0x4f4610`，在已证实的普通接收条件下将 200–249 写到 `0xf5f198` 并置待用标志。[调用及数据流](../analysis/game-legacy-music-phases-v1/source-check.json) · [跳表](#stage238-legacy-battle-alternate-exit)

**待验证**。主状态 1 的前置音乐分支、主状态 10 子状态 9 的实际进入条件、子状态 8 的另一条退场与现行版行为。[范围](known-issues.md#stage237-legacy-music-phases)

<a id="stage236-legacy-audio"></a>

## stage236 固定旧版音频消费者

**事实**。固定样本为 SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd` 的 `cg_se_6000.exe`。REA 6.7.0 和 Ghidra 12.1.4 的 23 个读取范围与 PE 文件字节一致。`0x4ef386` 调用 `0x510000` 播放编号 60。`0x508d01` 从 `0x56bae0` 取相对路径 `se\cgsys09.wav`，`0x508d66` 设置同一条栈记录的编号，`0x50edf6` 建立编号到声音缓冲的索引。[源证据](../analysis/game-legacy-audio-v1/source-check.json)

**事实**。`0x4fbd0d` 将 `TfD` 的第 10 个数值作为含连接参数的第 11 个参数传给 `0x4ef870`。正值写到 `0xf5f198`，`0x501ba1` 调用 `0x510570` 查表，再于 `0x501bbf` 交给 `0x50fa10`。`0x5107d4` 的 45 个跳转项指向 44 条曲目记录及停止码 218。曲目表从 `0x569c08` 开始，记录宽 76 字节。[选曲表与调用](../analysis/game-legacy-audio-v1/source-check.json)

**事实**。`0x50fa10` 把循环起止帧乘以 PCM 块对齐值后交给填充器，`0x50f7c5` 计算距结束偏移的剩余长度，`0x50f7ff` 取循环起点。`0x456c18` 设置退场渐隐，`0x44fc72` 的主循环调用链到 `0x510af0` 每次减一档，到零后的下一次停止。默认音乐档位为 90，帧周期来自 `0x538a90`。[函数与常量](../analysis/game-legacy-audio-v1/source-check.json)

**待验证**。固定样本的原生实际输出、战斗与标题音乐的独立入口、主状态 7 其他结果的声音及现行客户端对应关系。[剩余范围](known-issues.md#stage236-legacy-audio)

<a id="stage235-legacy-server-return-fade"></a>

## stage235 主状态 7 的画面捕获和第 14 类过渡

**事实**。固定旧版 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。用 REA 6.7.0、Ghidra 12.1.4 分析，并复核原 PE 字节。[证据索引](../analysis/game-legacy-server-return-fade-v1/source-check.json)

**事实**。`4567a0 → 456bc0` 首次调用 `5029b0`，把游戏工作表面 `610668+0xc` 拷入 `fab22c`，置显示状态 2 和初始化标记。后续调用 `505030(14,8,2.0) → 5029f0(7,8,2.0)`。完成后恢复显示状态 0，主 7 继续退出提示。

**事实**。`5029f0` 分派 7 以每步 8 行扩展更新，夹在 241。第 241 行超出 ±640 时完成。每步调用 `44ab50` 清表面，经 `5031e0–503227` 从源行 479 递减到 1，交 `44ce40` 做裁剪复制。`44fea9` 读取 `538a90` 的默认 16.666666666666668 毫秒周期。独立第 14 类夹具据此得到 50 帧，最后一帧没有可复制的行。

**待验证**。`4ef386` 调用声音 60，`456c18` 调用音乐渐隐准备 `50f550`。本阶段验证 Canvas 的行像素与连接时序。实际音频、设备帧调度和原生表面填充仍需单独验收。[共享行为](logic-protocol-spec.md#stage235-legacy-server-return-fade)

<a id="stage234-legacy-server-return"></a>

## stage234 服务端退出和主状态 7

**事实**。固定旧版 `cg_se_6000.exe` 为 1,569,280 字节，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 和 Ghidra 12.1.4 的证据已与 PE 文件偏移核对。[证据索引](../analysis/game-legacy-server-return-v1/source-check.json)

**事实**。`4fc0bc` 引用 `567c34` 的 `VKW`。两个字段分别从槽 `+4` 与 `+8` 解码。`4fc149` 起按第二字段、第一字段、连接的顺序压栈，随后调用 `4ef290`。该函数从入口栈 `+8` 读取第一字段，按字节与 `5678c8` 的 `successful` 比较。等待中的回复路径写结果 1，其他已成功通知写结果 2 并经 `501a30(7)` 请求主状态 7、子状态 0。

**事实**。`5015a0` 接管请求后进入 `4567a0`。`456bc0` 使用 `505030(14,8,2.0)`，`456a70` 发现结果 2 后跳过 `4ef1e0 → 4f8720` 的 `1^t` 请求。`4ef230` 返回 2，`4567a0` 进入提示状态 200/201，确认后在 `4568c7` 调用连接清理 `4ee2f0`，并进入主状态 2。

**待验证**。主 10 子状态 9 也请求主 7，其来源及子状态 8 的 `c5ec18` 条件仍需继续取证。主 7 的画面与音效分别见阶段 235 和 236。[共享行为](logic-protocol-spec.md#stage234-legacy-server-return) · [画面](#stage235-legacy-server-return-fade) · [音效](#stage236-legacy-audio)

<a id="stage233-legacy-frame-startup"></a>

## stage233 普通帧与新角色的初值

**事实**。样本为 1,569,280 字节的旧版 `cg_se_6000.exe`，SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 和 Ghidra 12.1.4 的反汇编地址已与原始 PE 文件偏移核对。[证据索引](../analysis/game-legacy-frame-startup-v1/source-check.json)

**事实**。`437b30 → 501a10(9,1)` 分别写入 `f5f17c` 和 `f5f1a0`。主状态 9 由 `5015a0` 进入 `501a50`。子状态 20 经 `5028a0` 写子状态 3，再由 `460c40` 推进移动和 `409fe0` 推进角色。`43b420` 读取子状态并屏蔽 250 至 252，`4fd0d0` 读取主状态，在主 9 且角色体带 `0x80200` 中任一位时抑制帧音效。场景字段 8 仍单独写 `957e88`。

**事实**。主 5 的 `4ff080` 清零范围包含 `f536b6`，`4403f0` 按 `0x128` 步长清角色记录的 `59a34a` 与 `59a428`。`440280` 回收单条远端记录时也清这两处。`433b70` 写稀疏模式 `58f6b4 = 0`，该模式下普通回调不依赖四相位的具体初值。`460f20` 写移动倍率 1，`4610f0` 在队伍跟随分支按队列长度更新。

**事实**。`43c000` 通过 `409e70 → 51bcf8` 分配清零的角色体与 0x44 字节附属区，写体标志 `0x34` 和特殊分派 `+0x2c = 0`。`4ff3b0` 为本机体再 OR `0x80`。`4fd0d0` 的冻结槽 `+0x2d4` 和 `43ba10` 读取的附属区 `+0x38` 子体指针均从清零分配取得初值。远端类型与绘制标志来自各自的登记处理。

**待验证**。其余特殊态的生产端和原程序每个过渡帧的时序仍需单独验证。当前封装样本的消费者和官方会话尚无新证据。[共享行为](logic-protocol-spec.md#stage233-legacy-frame-startup)

<a id="stage232-legacy-ordinary-context"></a>

## stage232 普通移动重置、动作锁和地砖时段

**事实**。固定样本 `37c4dfd2…13bd` 的状态 5 从 `0x5015a0` 调用 `0x461940`、`0x45eef0`、`0x4ff080`、`0x44e740`，清空等待计数、移动门、动作锁和队伍状态。包装状态比较 `0x403330` 在 `0x460c43` 使用 `0xbff2f8`。它等于零且 `0x9257f8/0x978a4e` 为零时，`0x460c67` 清动作锁。点击节流 `0x53d8a4` 的文件初值为 `0xffffffff`。事件序号 `0xbff338` 与转向节流 `0xbff358` 的零值属于虚拟初始化，另核对对应读写引用。

**事实**。`@Qu` 分派至 `0x4f2bb0`。已证四列中的索引 1 和 3 分别写入时钟秒与偏移。普通帧在 `0x44fc4f` 调用 `0x451a80`，使用墙钟秒差、固定基准 `0x3ae805e7` 和偏移，按 UInt32 求值。每 7,200 秒划为 24 个时段。地砖消费者 `0x461c60` 调用 `0x451b60` 使用这个时段。

**待验证**。动态原生叠层、其他包装状态及完整角色和帧生产端。现行样本仍需单独绑定消费者。

[REA 6.7.0、Ghidra 12.1.4 和文件偏移](../analysis/game-legacy-ordinary-context-v1/source-check.json)

<a id="stage231-legacy-display-startup"></a>

## stage231 初始画幅、投影与相机

**事实**。固定旧版 `37c4dfd2…13bd` 中，WinMain 在 `0x45ce73` 调用 `0x45d980`。建窗函数的初始客户区为 640×480，窗口分支读取 `0x53cb8c/0x53cb90` 中的同样数值。窗口分支调用的 `0x507690` 在此样本中为单条返回。正逆投影 `0x463d70/0x463dc0` 共同读取 `0x53d578/0x53d57c` 的 320 与 240。

**事实**。`0x45eef0` 将零坐标传给 `0x45f2f0`。入场 `0x4ef870` 与修正 `0x4ef840 → 0x4ff580` 调用同一坐标写入。源函数将整数坐标乘以 64 后写成 float32，并复制至 `0xbf22c8/0xbf22c4` 相机全局。普通渲染字段 `0x53cb88` 初始为 2。强制绘制位 `0x728380` 的虚拟初始值为零，`0x44fb50` 可置位，`0x44fb60` 读取和清除。

**待验证**。完整 Win32 动态窗口与设备表现、强制绘制事件完整映射，以及现行游戏的对应消费者。固定 SE 的所选切换及重建顺序见后续核验。 [绘制选路与重建](#legacy-render-backend-selection)

[REA 6.7.0、Ghidra 12.1.4 和文件偏移](../analysis/game-legacy-display-startup-v1/source-check.json)

<a id="stage230-legacy-config-startup"></a>

## stage230 WinMain 命令尾和 Config.dat 的首行

**事实**。固定旧样本 `37c4dfd2…13bd` 中，`0x51dda5` 取 `GetCommandLineA`，`0x523b0a` 跳过程序名和其后空白，`0x51de80` 调用 `0x45cc90`。后者在进程工作目录中以 `r` 打开 Config.dat，`0x45ccfa` 以 256 字节容量调用 `0x51b1ed`。先读最多 255 个文本字节，再在首行的第一个 NUL 处接入命令尾。缓冲区清零指令位于 `0x45ccdc–0x45ccf7`，容量 5,120 字节。

**事实**。CRT 读取函数 `0x520faa` 在普通文件的文本模式下折叠 CRLF，并将 Ctrl+Z 处理为结束。默认模式的全局初值在 `.data` 虚拟范围，证据单列。WinMain 调用 `0x45cfd0` 解析 `binfolder:` 及资源名等文本参数，`0x45d0e7` 调用对应的扫描函数。

**待验证**。后续显示、音频、地图及原生启动上下文的完整效果，现行游戏的同版本消费者。

[REA 6.7.0、Ghidra 12.1.4 与原始文件偏移](../analysis/game-legacy-config-startup-v1/source-check.json)

<a id="stage229-legacy-startup-materials"></a>

## stage229 旧版模块摘要的读取与首包消费

**事实**。固定旧版 `cg_se_6000.exe` 的 SHA‑256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 记录 `0x505540` 的当前模块路径读取、`0x404c40` 的文件读取、`0x404150/0x404230/0x404310/0x4041a0` 的 MD5 路径，以及 `0x404d30` 的小写十六进制输出。程序每次最多读 32,768 字节，提交实际读取数。核对了 64 轮常量、字选择和旋转。

**事实**。`0x458013` 指定摘要缓冲 `0xd5d674`，`0x45801d` 调用摘要生产函数。首包 `0x4eeb2c` 将该缓冲交给后续序列化。REA 的 7 个文件字节窗口与 PE 一致。另一个零值落在旧样本的 `.data` 虚拟初始化区域。

**待验证**。保留的现行 3000 和 6000 样本各自原 `.text` 的文件长度为零。其游戏入口、票据与摘要消费待查。

[样本、工具版本与偏移](../analysis/game-legacy-startup-materials-v1/source-check.json) · [协议规格](logic-protocol-spec.md#stage229-legacy-startup-materials)

<a id="stage228-wechat-special-dialogs"></a>

## stage228 交接、双字段、外观和图文的固定样本复核

**事实**。REA 6.7.0 与 Ghidra 12.1.4 对固定旧样本 `cg_se_6000.exe`（SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`）保留 70 条记录。独立 PE 映射复核 27 个函数范围、43 个字节窗口及 37 条直接调用。

**事实**。 `Q?m` 的 `0x1e` 调用 `0x492f60`，`0x1f` 调用 `0x4a99b0`。双字段模式 `0x23` 在 `0x48ff13` 调用 `0x4908e0`，宽窗口分支 `0x48ff38` 也走该解析器。外观与图文确认模式 `0x24/0x25` 分别调用 `0x4b3780/0x4b4010`。

**事实**。复核外观窗口描述符 `0x52e838` 与箭头回调，图文指令扫描器 `0x490760` 与图形位置读取，以及双字段、外观和图文确认经 `0x4f8240` 发送的分支。

**待验证**。现行安装样本的对应消费者、原版复合外观绘制及其他 NPC 图像。

[分派、函数及字节](../analysis/game-wechat-special-dialogs-v1/source-check.json) · [逻辑规格](logic-protocol-spec.md#stage228-wechat-special-dialogs)

<a id="stage227-wechat-family-board"></a>

## stage227 家族、家族兽与留言板的固定样本复核

**事实**。REA 6.7.0 与 Ghidra 12.1.4 对固定旧样本 `cg_se_6000.exe`（SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`）保留 91 条记录。独立 PE 映射复核 27 个函数范围、64 个字节窗口和 44 条直接调用。

**事实**。家族资料与成员名单是原版窗口 `0x30` 和 `0x15`，关闭回调为 `0x4678a0`。六条资料与名单分派和五个发送器已逐一复核。相邻邀请回调 `0x4673e0` 在 `0x4674a2` 调用 `0x4f7140`，移除确认与分配称号的调用位置为 `0x495d4a` 和 `0x496ab7`。

**事实**。 `Q?m` 模式 `0x20` 从 `0x4900a9` 进入，在 `0x4900ac` 调用家族兽解析器 `0x49f380`，同类刷新走 `0x48fe92`。模式 `0x15` 从 `0x48ffe3` 进入，在 `0x48ffe5` 调用留言板解析器 `0x4a8b40`，同类刷新走 `0x48fe71`。两类窗口的回复经 `0x4f8240`。

**待验证**。现行安装样本的对应消费者、入站邀请确认和原版图像。

[分派、函数及字节](../analysis/game-wechat-family-board-v1/source-check.json) · [逻辑规格](logic-protocol-spec.md#stage227-wechat-family-board)

<a id="stage226-wechat-storage-trade"></a>

## stage226 仓储和玩家交易的固定样本复核

**事实**。REA 6.7.0 与 Ghidra 12.1.4 对固定旧样本 `cg_se_6000.exe`（SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`）保留 83 条记录。独立 PE 映射复核 30 个函数范围、53 个字节窗口和 39 条直接调用。

**事实**。银行、仓储和饲料箱分别从 `0x490001`、`0x4900bb`、`0x4900e6` 调用解析器 `0x49aad0`。核对了记录分派表、数量与槽位常量、`I/P/G/D/C` 字面量及调用 `0x4f8240` 的路径。窗口 `0x29` 的销毁指针指向 `0x49aa00`。

**事实**。玩家交易复核了 9 条接收分派、候选列表入口 `0x4f46c0`、直接开窗入口 `0x4f46f0`、五个发送器与报价失效关联的槽位筛选字节。

**待验证**。现行安装样本的对应消费者、仓储其他专用窗口及真实交易结算。

[模式、字节与证据 ID](../analysis/game-wechat-storage-trade-v1/source-check.json) · [逻辑规格](logic-protocol-spec.md#stage226-wechat-storage-trade)

<a id="stage225-wechat-map-services"></a>

## stage225 治疗、人物师范与宠物训练的固定样本复核

**事实**。REA 6.7.0 与 Ghidra 12.1.4 对固定旧样本 `cg_se_6000.exe`（SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`）保留 41 条记录。独立 PE 映射核对 19 个函数的范围、22 个字节窗口和 22 条不同的直接调用。

**事实**。消费入口 `0x4f447f` 调用 `0x48fce0`。两个跳转表在 `0x49026c` 和 `0x4901f8`。治疗模式 `0x13` 从 `0x48ffa0` 进入，在 `0x48ffb7` 调用 `0x490db0`。人物技能的三条调用分别指向 `0x492d50`、`0x4af7d0`、`0x4af910`。宠物栏位模式 `0x1a` 和 `0x2c` 共享 `0x490174 → 0x4b0490`。

**事实**。治疗和技能回调调用 `0x4f8240`，其 `0x4f8245` 引用 `0x567bcc` 的 `/1I`。原字节复核还覆盖治疗的行序号转换、人物学习与返回字面量，以及两套宠物目标选择的调用与标志。

**待验证**。现行安装样本的对应消费者、原版 NPC 图像和实际服务端结算。

[函数、分派表与字节](../analysis/game-wechat-map-services-v1/source-check.json) · [逻辑规格](logic-protocol-spec.md#stage225-wechat-map-services)

<a id="stage224-wechat-inventory-shop"></a>

## stage224 背包、拾取和六类商店的固定样本复核

**事实**。固定旧样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 保留 35 条记录，独立核对 21 个函数范围、14 个 PE 字节窗口、12 条直接调用及 6 个出站字面量。

**事实**。背包更新和交换入口在 `0x4f25a0` 与 `0x4f2c40`。 `0x47b80b` 调用移动发送器 `0x4f6c70`，拾取分支 `0x50099b` 调用 `0x4f6a30`。 `0x4f447f` 调用地图窗口分派器 `0x48fce0`，确认分支 `0x4ac0fd` 调用 `0x4f8240`。商人与兑换员的实际调用点分别为 `0x48ff74` 和 `0x49005f`。

**待验证**。现行版本的对应消费者、完整原版窗口与服务端行为。

[原字节与 REA 证据 ID](../analysis/game-wechat-inventory-shop-v1/source-check.json) · [逻辑规格](logic-protocol-spec.md#stage224-wechat-inventory-shop)

<a id="stage223-wechat-creation"></a>

## stage223 建角确认、发包与应答复核

**事实**。固定旧样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 保留 22 条证据，独立核对 11 个函数范围、11 个 PE 窗口和 15 条直接调用。

**事实**。主状态 4 由 `0x459f30` 调度，调用 `0x45a1a0` 与 `0x45a970` 处理外观与确认。确认分支经 `0x456390 → 0x4ef3a0 → 0x4f8460` 发送 `/qW`，请求字面量在 `0x567bd8`。应答字面量 `U_s` 在 `0x567c48`，消费者 `0x4ef480` 检查 `successful`。 `0x4ef430` 先检查应答，再判断无符号经过时间是否超过 600,000 毫秒。

**待验证**。现行版本的对应消费者及完整本地 profile 与外观渲染。

[原字节与证据 ID](../analysis/game-wechat-creation-v1/source-check.json) · [逻辑规格](logic-protocol-spec.md#stage223-wechat-creation)

<a id="stage222-wechat-page"></a>

## stage222 小程序接入前的固定样本复核

**事实**。旧样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。用 REA 6.7.0 和 Ghidra 12.1.4 保留 36 条证据，独立核对 18 个函数范围、18 个 PE 原字节窗口、17 个直接调用及 `successful` 字面值。REA 会话已关闭。

**事实**。`0x456650 → 0x4ef060 → 0x4f8650` 连接选角与 `0X@`。成功应答经 `0x4ef130`、`0x4ef0c0` 进入主状态 9。普通场景初始化在 `0x4ef870` 和 `0x4f16d0`，本机对象路径含 `0x4ff160 → 0x4ff3b0`，移动路径含 `0x4f2c10 → 0x4f6470`，战斗路径含 `0x4f3430`、`0x4f36d0` 和 `0x4f67f0`。

**待验证**。现行样本对应消费者、票据交接及官方运行。

[独立字节核验](../analysis/game-wechat-page-v1/source-check.json) · [逻辑规格](logic-protocol-spec.md#stage222-wechat-page)

<a id="stage221"></a>

<a id="stage221-chat-presentation"></a>

## stage221 聊天过滤、气泡和公告的固定样本路径

**事实**。旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 26 个文件窗口、52 个函数范围、34 个直接调用和 16 个指令位置。121 条证据已导出，分析会话已关闭。

**事实**。0x4f2df0 在聊天历史可用时解析冒号空格前的姓名，剥掉 [GP] 或 [MIC] 后于 0x4f2feb 检查黑名单。命中后跳过 0x444f20 的历史和后续气泡。0x402910 从当前服务器索引读取名单，0x402a80 写回，0x402b50 和 0x402bd0 分别添加和移除。

**事实**。0x4f307f 与 0x4f30af 分别把气泡交给本机和已查到的其他角色。两处分支传入 1,000 毫秒。0x43d5a2 检查气泡位，0x43d5b4 比较到期时间，0x43d5ca 按角色标志选择文字框或图标。

**事实**。0x4f30d0 分开判断历史和公告。0x4f31fb 进入 0x445530，0x4456d0 分别推动 0x445610 与 0x445670，二者重置阈值和循环次数独立。

[本轮计划](../analysis/game-battle-shared-storage-v1/chat-presentation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/chat-presentation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-chat"></a>

### 前序检查点 · 普通聊天输入、设置与收包的固定样本路径

**事实**。旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 38 个文件字节窗口、55 个函数范围、35 个直接调用和 22 个指令位置。104 条证据已导出，分析会话已关闭。

**事实**。0x4523cb 把输入提交给 0x444930。0x444a1e 读取 0x60fda8 的文字及颜色，调用 0x4f2c80。该函数依序使用 0x511180、0x5678f8 的 P 前缀和 0x4f7680。坐标由 0x4034d0 读取本机逻辑 X、Y。

**事实**。0x4fa4ca 和 0x4fa546 分派玩家聊天和系统文字。两者均有调用 0x444f20 的历史分支。0x4f307f 和 0x4f30af 是独立气泡分支，0x4f31fb 进入 0x445530 的滚动公告路径。

**待验证**。补查 _&` 的 0x26 至 0x28 入口及消费者，当前证据为记录表处理，尚未绑定家族邀请应答。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 邀请、除名和称号分配的固定样本路径

**事实**。旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 42 个文件字节窗口、40 个函数范围、40 个直接调用和 27 个指令位置。126 条证据已导出，分析会话已关闭。

**事实**。0x4673e0 在 0x467418 核对正对相邻格的角色类型 8，在 0x467464 读自己的称号权限位 1，于 0x4674a2 调用 0x4f7140。0x46748a 和 0x467495 从 0x96b9e0、0x96b9c8 读本机逻辑坐标。

**事实**。名单 0x15 的除名控件 0x4959b0 经 0x495b50 打开确认，肯定回调 0x495d30 取成员 ID，调用 0x4f71b0。称号控件 0x494c00 经 0x495f90 保存成员 ID，并打开 0x37。0x496a30 提交所选称号槽，调用 0x4f70d0。

**事实**。0x51444b 保存旧布局的已存在名单索引，0x516943 据此读取成员名。0x516853 的 -1 分支仍待核对对应的称号清除流程，独立入会审批缺少证据。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 家族资料、称号与成员的固定样本路径

**事实**。旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 60 个文件字节窗口、40 个函数范围、40 个直接调用和 19 个指令位置。130 条证据已导出，分析会话已关闭。

**事实**。菜单指令 0x49530c 打开 0x30 家族资料，描述符 0x52e718 调用 0x4a0d90。成员名单使用本地窗口 0x15、描述符 0x52e508、初始化 0x493080。两者的关闭函数 0x4678a0 直接返回。

**事实**。0x4f4af0 和 0x4f4de0 分别接收家族资料、称号权限。0x4f4ef0、0x4f5150、0x4f53d0 处理全量名单、单员更新和按 ID 移除。0x4f552d 在家族 ID 匹配后跳到 0x516c40 重置。0x4931cf 以名单第八字段索引称号。

**事实**。0x496025 调用 0x496030 检查自己称号的 0x80 位。编辑回调在 0x4a1e7d、0x4a1f6d、0x4a208b 调用 0x4f6fd0 和 0x4f7040。输入守卫位于 0x46d160、0x456330。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 家族兽、饲料箱与权限的固定样本路径

**事实**。旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 84 个文件字节窗口、38 个函数范围、34 个直接调用和 26 个指令位置。140 条证据已导出，分析会话已关闭。

**事实**。Q?m 0x20 的初始分支 0x4900ac 调用 0x49f380，建立窗口 0x33。同模式分支 0x48fe92 调用 0x49f670 更新标题和正文。0x551938 的控件 21 和 22 分别指向 0x4a01f0 改名和 0x4a0420 喂食。0x4a0699 检查 0xfbb064 的喂食权限位，0x4a06b1 比对物品类别 0x35。0x4f9b29 将 Y&3 交给 0x4f4af0，后者在 0x4f4c87 写入权限。

**事实**。Q?m 0x22 经 0x49aad0 共用仓储解析，由 0x49f080 和 0x49e180 建立窗口 0x26。两处仓储区域回调与快捷存入调用 0x47b900。0x47b879 检查窗口对象，0x47b8b3 从 0xc10e40 和 0xc10e3c 读取打开对象和序号。

**事实**。窗口 0x33 的 0x49f980 释放滚动记录，关闭标志有效时发送 C。窗口 0x26 的 0x49e1b0 执行本地收尾。未被 Ghidra 登记为函数的控件回调用文件字节与指令范围核对。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 银行和仓储的固定样本分派与销毁回调

**事实**。旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 45 个文件字节窗口、24 个函数范围、28 个直接调用和 26 个指令位置。新会话保留 82 条记录，证据导出后已关闭。

**事实**。0x49026c 的 Q?m 0x17 和 0x21 分支先调用 0x49aad0，再由 0x49dfb0 按变体 0 和 1 建立窗口 0x29。0x49aad0 的 A、I、P、G 分支分别落在 0x49b0ac、0x49ab44、0x49ad1c、0x49b08d。0x47b7e0 构造物品移动，0x47f330 与 0x49da64 有宠物回复，0x49dd96 和 0x49de09 调格式化函数生成存取金币文本。

**事实**。0x52e688 描述符的销毁项为 0x49aa00，经 0x468190 安装在 +0x38。匹配的服务端关闭在 0x4f4456 调 0x468f00，随后 0x467fc0 调销毁项。0x49aa7a 以 C 调用 0x4f8240。

**待验证**。0x22 虽共用记录解析，后续由 0x49f080 和 0x49e180 建立窗口 0x26，销毁项 0x49e1b0 独立。0x46e192 引用六位数字提示，实际认证与存取之间的完整链路待核。

[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 四类地图对话的固定样本分派与回调

**事实**。固定旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 50 个文件字节窗口、23 个函数范围、27 个调用和 23 个指令位置。快照保存返回校验错误，原会话的证据包已正常导出，共 1,696 条，新增 60 条，会话已关闭。

**事实**。0x49026c 把 Q?m 0x1e、0x23、0x24、0x25 分派到 0x492f60、0x4908e0、0x4b3780、0x4b4010。0x492cd0 接受行号 0 和 1，按 1 和 2 回复。0x4903e0 的双项分支用 0x46d160、0x456330 验证确认，0x4905ac 对拼接结果做第二次转义。

**事实**。窗口 0x38 的描述符和控件表位于 0x52e838 与 0x5556e0。0x4b3840 使用 0xf536a4 外观及 0x924f40 版本字节，三个箭头回调改写草稿。0x4b3be0 确认时发送外观编号。0x4b4010 注册图形后，0x4b3f30 以当前按钮发送相同图形编号。

**待验证**。组合式外观渲染、固定样本实际运行以及其他版本的消费者。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 宠物师范的报价、选宠与技能栏

**事实**。固定旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 39 个文件字节窗口和 21 个函数范围，新增 52 条保留证据，共 1,636 条。会话已关闭。

**事实**。0x49026c 分派 0x18、0x2a 给 0x4afaa0、0x4afd60。两者设置窗口 0x36 的子类型 2 和 12。0x4b2f60 验证余额和是否持有宠物，发送原报价编号。

**事实**。0x19、0x2b 使用 0x4b0020、0x4b0200，0x4b0ed0 依据原始宠物占用槽位生成紧凑编号，0x4b2d00 判断候选数值和种族。0x1a 与 0x2c 共用 0x4b0490，0x4b2ea0 设置预览，窗口描述符 0x554854 的 0x4b31d0 发送所选技能栏。

**待验证**。原版窗口图形、其余 Q?m 消费者、真实服务端回复和结算。

[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · 商店入口与普通技能师范的原版分支

**事实**。固定旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 51 个文件字节窗口和 13 个函数范围，新增 70 条保留证据，共 1,584 条。会话已关闭。

**事实**。0x49026c 把 Q?m 的 0x05、0x10、0x1b 分别分派给 0x492b90、0x492d50、0x492ea0，三者共用窗口 0x34。0x492b10、0x492cd0、0x492e10 在各自的原显示行范围内发出 /1I。

**事实**。0x11 和 0x12 由 0x4af7d0 和 0x4af910 解析，使用窗口 0x36。学习回调 0x4b1e70 发 1，0x4b1f60 的对应返回分支发 2 或 99。0x4f04ed 重建并排序技能投影，0x4b08fa 写入占用槽位序号，0x4b2be5 读取对应的显示行，0x4b2c9c 发送序号加一。

**待验证**。宠物与其他师范分支，原版窗口图形和真实服务行为。

[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · 治疗窗口与图形指令的原版分支

**事实**。固定旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 35 个文件字节窗口和 15 个函数范围，新增 40 条证据，保留 1,514 条并关闭会话。

**事实**。0x49026c 将 Q?m 模式 0x13 映射到 0x48ffa0，0x48ffb7 调用 0x490db0。解析器以 0x20 字节步长填入六个角色位。0x490b80 绘制费用与 0xf53624 金币，0x4fee60 选择伤势图标。0x4910e7 绑定 0x4903e0 处理选择和取消。

**事实**。文字窗口 0x4908e0 先解码再查找图形指令，0x490a39 调用 0x490760。0x48efb0 保存十个图形记录。0x48f42d 和 0x48f445 将资源和朝向写入窗口图元，0x4fd5f0 按资源选择静态或动画路径。

**待验证**。模式 0x23 的独立输入回调与其余专用分支。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 玩家交易的入口、报价和关闭

**事实**。固定旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 60 个文件字节窗口和 23 个函数范围，新增 85 条证据，保留 1,474 条并关闭会话。

**事实**。0x467290 经 0x43f100 查找面前一至两格内类型掩码为 8 的角色，并存在队伍模式分支。0x46738b 发出 +BQ。LsH 经 0x4cb680 打开 0x2c，0x4919a9 读取原行号，0x4cb66c 发 +i@。M6c 经 0x4f472d 同样进入 0x4cbe20，打开窗口 0x2b。战斗标志置位时 0x4f470a 发 ,ua 0。

**事实**。0x4a2f09 将两组槽位对与金币交给 0x4f7dc0。该函数在 0x4f7ddf 和 0x4f7e02 格式化两段字节，在 0x4f7e25 格式化整数。0x4a3e8c 核对物品资格位，0x4a44ba 核对宠物存在。

**事实**。0x4f4757 将对方置为阶段 1，0x4f489b 置为 2。0x4f484d 清空对方报价，并将本方确认退回到已发布。Ofl 值 0 与 2 都跳转到 0x4a2480，关闭时抑制退出回包。**待验证**。服务端两个关闭值的结算语义。

[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 留言板的窗口、字段和控件

**事实**。固定旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 54 个文件字节窗口和 12 个函数范围，新增 98 条证据，保留 1,389 条并关闭会话。

**事实**。0x49026c 的模式 0x15 选择索引 10，经 0x48ffe5 调用 0x4a8b40 并打开窗口 0x32。相同模式的 0x48fe41 路径更新序号和角色后重新装载。窗口描述符 0x52e7a8 将展示和操作交给 0x4a7ca0 和 0x4a7e10。

**事实**。解析器在 0x4a8b5e 对整个正文解码一次，按 0x40c 步长读取四条记录，再分别解码作者和留言。0x4a8480 用每条记录的标志控制删除，用按钮掩码的 0x10 和 0x20 控制翻页。

**事实**。交易提示附近的原始字节另行锚定 0x4f7dc0、0x4f7e50 与 0x4f7e90，标签依次为 +oj、,3K 和 ,ua。**待验证**。交易报价字段和入站状态。

[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 单项给予的入口、限量和确认

**事实**。固定旧样本 cg_se_6000.exe 的 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 37 个文件字节窗口和 8 个函数范围，新增 47 条证据，保留 1,291 条并关闭会话。

**事实**。0x49026c 的模式 0x1f 选择索引 20，经 0x4901f8 到 0x49008b，调用 0x4a99b0 后设内部模式 3。0x4ab4c0 读取服务器数量或按 0x65c 步长统计 28 个物品槽。0x4adfbc 与 0x4ae047 分别执行两套增量判断，0x55e964 存储共同上限 999。

**事实**。0x4ac7d3 构造确认窗口，0x4abfa3 读取数量并使用 0x56499c 的 1|%d 格式。0x4ac0fd 调用 0x4f8240，取消在 0x4acc63 使用同一发送器。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 物品兑换的入口、货币和容量

**事实**。固定旧样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核对 26 个文件字节窗口和 11 个函数范围，新增 27 条证据，保留 1,244 条并关闭会话。

**事实**。0x49026c 的模式 0x1c 映射到索引 17，经 0x4901f8 跳到 0x49006d，调用 0x4a96b0 并设内部模式 2。模式 0x1f 经 0x4a99b0 进入另一套字段。

**事实**。0x4f27b3 和 0x4f27e8 写入物品的兑换代码与数量。0x4abaff 按 0x65c 步长查 28 槽，0x4adb66 从背包槽 8 扫到 27。0x4adb77 在首个部分付款的堆叠处停止。0x437410 返回现有空格，0x4adf65 计算商品堆叠所需格数。

**事实**。确认表的内部模式 2 到 0x4ac63d，接受确认后到 0x4abed2。0x4abf35 取原行号和数量，0x4ac0fd 调原发送器。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 鉴定、修理与物品说明的源路径

**事实**。固定旧样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核对 23 个文件字节窗口和 11 个函数范围，新增 37 条证据，保留 1,217 条并关闭会话。

**事实**。0x48ffc6 调用鉴定入口 0x4a9c80，0x48ffd5 调用修理入口 0x4aa0b0。0x564940 和 0x564964 的 CP936 提示区分两种服务。0x4acf12 计算费用，0x4acf17 计算所选数量，两个模式在 0x4ac90f 检查余额。

**事实**。确认表 0x4ac11c 的内部模式 4 和 5 都到 0x4ac00b。0x4ac059 取绝对槽号，0x5331ac 的格式是单个十进制数。共用 0x4ac0fd 发送，取消分支是 0x4acc63。

**事实**。0x4f26d7 读取物品行的第 4 字段，0x4f26f1 解除内层转义，0x4f2703 进入 0x4fee90 保存物品说明。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="legacy-shop-quote-drag"></a>

### 固定 SE 的商店报价行换位与撤选

**事实**。固定 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。窗口 53 的五个报价选择行，创建时由 `4AB510` 在出售、鉴定、修理模式 1、4、5 切到运行回调 `4AE4C0`。`4AE683` 只在普通命中、左键按下且行已有映射时登记 kind 9。传入位置为当前滚动起点加控件序号减 52。相邻背包使用 kind 2，加入报价选择时取第一个空位置。 [档案与 PE 偏移](../build/analysis/shop-quote-drag-v1/source-review.json)

**事实**。持有后下一次左键按下保存放置坐标。同一轮先把操作推进到 mode 4，再分派命中的报价行。换到另一行交换两个选择映射，落到空行则移动到空位，原位只完成本次操作。确认遍历原报价记录，显示换位未改变出售的槽和数量序列或鉴修的槽序列。 [窗口规则](../analysis/capability-first-v1/window-engine-contract.json#/kind9_shop_quote_drag) · [业务规则](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/classic_shop_quote_interaction)

**事实**。持有阶段的右键走 phase 1 并保留选择。放置未被报价行处理时，所选帧路径由 phase 2 或 phase 4 调用 `4AE3E0`。若一次性抑制字节为零，它清选择数量及背包选择位，将原位置写 −1，然后约束滚动并刷新。非零只清该字节。已选行的双击走另一条直接撤选路径。 [结束分支](../analysis/capability-first-v1/window-engine-contract.json#/kind9_shop_quote_drag/completion)

**待验证**。原版实际鼠标消息与关闭重叠的运行结果、抑制字节非零来源，以及当前版本和三端交互。现有核价以原行号和数量处理，D0/D3 沿 OS-D6 补共用显示映射和分阶段退役。 [现有入口对照](validation.md#legacy-shop-quote-drag-validation) · [关闭顺序](#fixed-se-shop-entry-admission)

<a id="fixed-se-shop-entry-admission"></a>

#### 窗 53 的报价确认、放置与实际退役

**事实**。同一样本中，所选 12 处静态登记对应 8 个已有入口。包括三个窗口回调、五个报价行，以及预览、预览确认与返回、背包、选择区各一个控件。0 基控件 2 的出售、鉴定、修理路径把 `4ABD10` 装入确认槽。控件 0 的两条预览路径分别传 0 和 1。传 0 进入原报价记录的确认分派，传 1 跳过该分派。五个报价行的运行回调替换和 `4A8E20` 的操作钩子都已附到原条目。 [样本、表项和原字节](../build/analysis/fixed-se-shop-entry-admission-v1/source-review.json) · [A1 入口台账](../analysis/capability-first-v1/entry-admission.json#/selected_fixed_se_operations/shop_quote_controls)

**事实**。帧内距离或商人身份条件可令 `4AB510` 置待关闭位，随后继续帧内处理。普通帧先由 `46AA50` 处理持有与放置，再由 `46A0E0` 整理待关闭窗口，最后分派池中剩余窗口的控件。固定收包的同步组关闭也可经 `468F00` 进入 `467FC0`。该处先调用析构，再清活动槽，并且仅在保存窗口 ID 等于被关闭窗口时请求取消。 [帧顺序与同步关闭边](../analysis/capability-first-v1/window-engine-contract.json#/kind9_shop_quote_drag/ordered_retirement)

**推测**。若拾取后在下一普通帧首完成放置登记，`46CEB0` 保存的窗口和控件值已是 0 和 −1。因此随后整理窗 53 时跳过该次归属取消。若本帧放置仍未消费，下一次帧首用 phase 2。另一条关闭路径若仍保存 ID 53 且处于 mode 3 或 4，则在清槽后发 phase 4。两条钩子在抑制字节为零、映射有效且继续执行到 `4AE485` 时，所绑的活动槽若仍为空，会以零基址形成控件读取。原版可达的输入序列和实际结果待验。 [静态条件与独立核验](validation.md#fixed-se-shop-entry-admission-validation)

**设计**。D0/D3 复用现有窗口与报价所有者，分别处理仍存活窗口的取消和已退役报价的结算。迟到放置对新实例无业务副作用。D5 用同一组 OS-A18、OS-A20、OS-A21 核对三端换位、确认、预览返回、同步关闭与替换。 [操作和用例](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/classic_shop_quote_interaction)

<a id="fixed-se-shop-retirement-refresh"></a>

#### 窗 53 取消后的滚动、可见行和报价合计

**事实**。固定 SE `37c4dfd2…013bd` 的 `4A8E20` 在 phase 2/4 临时借用当前活动槽 `C11320`，`4AE3E0` 正常返回后恢复上层窗口。抑制字节非零时只清字节。原映射有效时先清一行数量和对应背包位，写入空映射，再夹取滚动位置。随后依次更新滑块、五个可见行、五行数量和按钮、20 项映射的总价及总件数。原确认顺序仍取原报价记录。 [原版地址、全部写入条件及用例](../analysis/capability-first-v1/window-engine-contract.json#/kind9_shop_quote_drag/active_window_refresh)

**推测**。若旧取消在有效映射及零抑制条件下抵达新槽，会读取新窗口和当时的映射。槽空时，所查映射和滚动写入先发生，随后在 `4AE485` 读控件字段。按所选战斗帧入口计算，直接格式化调用最低入栈位置为 `−356`，最近的 SKL266 暂存区间结束于 `−1612`。实际取消投递、深层写入和暂存字实读沿对应验收。 [原指令、相对范围及限制](../build/analysis/fixed-se-shop-retirement-refresh-v1/validation.json)

**本机对照与设计**。现有商店对话在出售、鉴定、修理的替换、关闭和重开后拒绝旧修订号，保留替换后报价。D0/D3 沿 OS-D6 复用修订号与原报价顺序，补撤选后的显示写回。D4 沿 BF-T36 使用相同帧顺序和所选写入范围。实际输入和下一次合资格绘制沿 OS-A18、OS-A20、OS-A21 验收。 [本机结果](validation.md#fixed-se-shop-retirement-refresh-validation)

<a id="stage221-map-shop"></a>

### 前序检查点 · 普通商店的源分支、容量与确认

**事实**。固定旧样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核对 25 处文件字节窗口、17 个函数范围及一处 PE 补零地址，新增 86 条记录，共保留 1,180 条并关闭会话。

**事实**。0x48fce0 将模式 6、7 分别交给 0x4a8fd0、0x4a92a0。0x4a9c80 是模式 0x14 的鉴定入口。0x4aa910 按每种商品的堆叠数计算空格，0x4ac28b 与 0x437410 比较。0x4aa795 引用 0x5637b0 的装备限制提示，0x4addcb 的购买加量按商品存在与 20 件上限处理。

**事实**。0x4efee7 识别掩码 0x08000001，0x4efefa 写入 0xf53624。0x4abbe0 附近的出售确认检查 1,000,000 上限。0x4abd10 的两个确认分支汇入 0x4ac0fd，0x4acc63 发送取消。取消正文指针 0x5849c8 位于 PE 的虚拟补零区。

**待验证**。模式 0x14 及其他交易路径、实服触发和回包。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 右键角色查找、对话分发和回调

**事实**。固定旧样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核对 25 处字节窗口和 19 个函数范围，新增 79 条证据，共保留 1,094 条并关闭会话。

**事实**。`0x460c9f` 调 `0x43f190`，按记录槽从低到高查活动身体、逻辑坐标与掩码 8。`0x43f211` 返回记录 ID，`0x460cb6` 调 `0x4f74e0`。`0x4400e0` 分配最低空槽，`0x4403b4` 允许复用较低的空槽。

**事实**。`0x4fb795` 把 `Q?m` 分发给 `0x4f4410`，普通模式经 `0x48fce0` 进入 `0x4908e0`。按钮、菜单行和窗口销毁分别由 `0x48f90c`、`0x48fc94`、`0x48f81a` 间接调用 `0x4903e0`。该回调没有 Ghidra 函数定义，本轮使用 REA 读取和独立 PE 字节核验。

**事实**。`0x4fb792` 推入第二个整数，`0x4f4430` 从包含连接参数的栈读取它。比较 -1 的字段是按钮掩码，模式与角色分别用第一和第四个整数匹配。

**待验证**。实服对 `;JE` 的业务响应归属和其余窗口分支。普通 `Q?m` 返回后 `4387C0` 的写入条件及所选方向已补静态规格，原版实际朝向仍待核验。 [后续两版对照](#legacy-dialog-actor-facing)

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 右键转身与拾取的原始字节

**事实**。固定旧样本 `cg_se_6000.exe` 的 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核对 18 处字节窗口和 16 个函数范围，新增 66 条记录，共保留 1,015 条并关闭会话。

**事实**。`0x5024bf` 进入 `0x460c40`。`0x4667d1` 从 `0xc5fb2c` 取右键新按下位，`0x4667e5` 写 `0xc078c0`。通过 `0xf536b6` 位 7 检查后，`0x460c86` 先调 `0x4622d0` 转身，`0x460c8b` 再调 `0x500860` 拾取。

**事实**。`0x500908` 以掩码 7 调 `0x43f100`。它在步长 `0x128` 的活动记录里查身体坐标 `+0x1e0/+0x1f0` 及记录类型位。`0x43fd43` 写图形物品类型 2，`0x43ff60` 写数值物件类型 4。`0x4fa854` 和 `0x4faa57` 分别分发地面公告与删除。

**待验证**。原版同版服务器如何将 `;JE` 对应到实际回包，以及其余窗口状态。普通选格、掩码 8 查询及已有独立收包路径见后续核验。 [普通右键复核](#fixed-se-ordinary-right-click-position)

[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="fixed-se-ordinary-right-click-position"></a>

### 固定 SE 的普通右键选格与三项业务条件

**事实**。固定 SE `37c4dfd2…013bd` 的所选普通帧，在 `5024B0` 调 `4665B0`，从移动位置 `C5FA88/C5FA98` 逆投影并发布所选格 `C078A0/A4`。后续依次调 `4EADC0`、`44E7E0`、`460C40`。按键判定要求移动点纵轴小于 456，并核控件、对话和三处覆盖条件。右键一次按下产生 `C078C0`。通过本机状态位 7 检查后，转向、拾取、角色查询均读这对格坐标。 [选格、准入与帧顺序](../build/analysis/fixed-se-right-click-position-v1/source-review.json)

**事实**。转向先查本机身体、静止、两处状态、不同格和独立时钟。拾取随后查 `55E4D4 == -1`、每轴相邻、掩码 7 和另一只时钟。再后按掩码 8 从低槽到高槽查所选格第一个活动角色，命中发 `;JE [3, ID]`。查询独立于转向与拾取的资格。目录、名单及资料的所选接收先写 `55E4D4`，再请求窗 60 至 62。普通对话所查关闭路径在类型和参与者匹配后清值。 [独立条件及窗口写点](../analysis/capability-first-v1/game-map-functional-specification.json#/fixed_se_ordinary_right_click_position)

**本机对照**。一次快点包含移动、按下和释放三个坐标。按原选位规则输入现有运行时得到格 `(3,3)` 和角色 200。现有 Canvas 入口使用释放点，得到格 `(5,3)` 和角色 201。另核三项合资格时的输出顺序、两个截止等号、受到转向条件限制和远格角色。 [本机输入和请求](validation.md#fixed-se-ordinary-right-click-position-validation)

<a id="fixed-se-ordinary-dialog-lifecycle"></a>

### 固定 SE 的普通对话替换、关闭与拾取恢复

**事实**。固定 SE `37c4dfd2…013bd` 的 `4F4410` 在通过三项外层条件后，以模式和角色比较关闭消息，序号可以不同。匹配即同步清理掩码 3 的窗，再把活动值写为 `−1`。`48FCE0` 的六个已证替换序号和模式 `0x20` 例外沿已有规则。替换先关闭旧组，随后发布新模式、角色及序号。普通文本经 `4908E0 → 48F0A0` 请求经典窗 37。发布在新窗绘制和范围分派之前。 [原字节、序号表和窗组](../build/analysis/fixed-se-ordinary-dialog-lifecycle-v1/source-review.json)

**事实**。普通按钮和选行调用 `4903E0`。已获准的回复先走 `/1I`，返回后清活动值。控件按回调结果标记 `0x8000` 并清 `C21248`，后续析构跳过负选择回调。距离关闭在位置已稳定且任一轴离基准达到两格时仅标记；实际整理时经 `48F81A → 490402` 清活动值，所选析构不发回复。 [控件、距离及析构](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/fixed_se_ordinary_dialog_lifecycle/facts)

**静态推导**。普通轮先收包，再做地图动作，随后才处理窗整理与控件。合资格的同步关闭可在该轮地图动作前清值，控件选择发生在拾取判断之后。距离关闭在第 N 轮标记时，N+1 轮的拾取仍先读占用，之后才由窗整理清理。恢复要求新按下、合资格目标及独立时钟。训练选择写入的 `−2` 同样阻止拾取。 [普通帧、时钟与训练等待](../analysis/capability-first-v1/game-ordinary-services-functional-specification.json#/fixed_se_ordinary_dialog_lifecycle)

**本机对照**。现有客户端保留普通重复，拒绝替换前的旧控件修订。相同模式和角色的旧序号关闭了新窗，错角色关闭保持当前窗。关闭先进入该轮时，恰到截止仍只发角色查询，冷却期过后可拾取。训练提交后现有视图移除并能发出拾取请求，需补活动值与窗口实例的共用状态。原版实际投递及三端输入待验。 [现有入口与回归](validation.md#fixed-se-ordinary-dialog-lifecycle-validation)

<a id="stage221-item-targets"></a>

### 前序检查点 · 三条物品分支的原始字节

**事实**。固定旧样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核对 22 处字节窗口和 10 个函数范围，新增 55 条记录，共保留 949 条并关闭会话。

**事实**。`0x47cb58` 和 `0x47d2e9` 安装 `0x47d6f0`。模式 1 在 `0x47d864` 以第 10 字段为基点扫描背包，再用类别和数量筛选。`0x47d9c7` 调 `0x4f7ae0`。

**事实**。`0x47cc62` 和 `0x47d3f4` 为普通背包与装备槽设置 `0x47f430`。事件 2 的 `0x47f4b6` 调 `0x4f6ac0`。战斗回调 `0x48cf50` 的 `0x48d069` 调 `0x4f88f0`，`0x48d07a` 设置动作完成位，`0x48bd51` 据此转入状态 2。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-items"></a>

### 前序检查点 · 地图物品栏的取值与发送分支

**事实**。固定旧样本 SHA-256 为 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。REA 6.7.0 与 Ghidra 12.1.4 核对 16 处字节窗口和 13 个函数范围，新增 53 条证据，共保留 894 条并关闭会话。

**事实**。`0x4f2740` 写第 5 字段到 `0xf53d04`，普通用物与 `0x67c9` 比较。`0x4f27c2` 写第 12 字段到 `0xf53d14`，`0x48d309` 以槽偏置 8 读取该值并比较类别 0 至 7。第 13 字段写 `0xf53d10`，移动路径在 `0x47b955` 读作数量。

**事实**。`0x47cbec` 和 `0x47d37f` 调 `0x4f68b0`，用 `0x4034d0` 读取逻辑坐标。`0x461370` 写单独的目标格，`0x461660` 在到达时更新逻辑格。`0x47c9c1` 和 `0x47d12e` 调 `0x47b900`，经 `0x47b7e0` 发送本地两槽移动。

**待验证**。`0x67c9` 的特殊选目标、商店槽、丢弃及原版鼠标和数量窗口的完整运行。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-input"></a>

### 前序检查点 · 背包收包与战斗物品发包

**事实**。固定旧样本 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 12 个字节窗口和 15 个函数范围，新增 62 条观察，共保留 841 条并关闭会话。

**事实**。0x4f9184 把 ?l) 交给 0x4f25a0。原版记录基址 0xf536cc、步长 0x65c，0x437410 扫描背包槽 8 至 27。0x4f9297 把 @Y) 交给 0x4f2c40，经 0x5009b0 交换两条记录。

**事实**。命令索引 3 指向回调 0x48aa80，打开窗口 0x1b。物品动作读取原网格索引加 8 得到的实际槽号，经 0x48d454 计算目标。0x48d4ca 与 0x48bd2d 发送 I，0x48d3af 发送 Q，三处均调用 0x4f88f0。

**待验证**。原版窗口坐标、提示和 0x48d069 的卸下武器快捷操作仍需接入。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-input-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-input-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-mp-items"></a>

### 前序检查点 · MP 字段与物品动作分派

**事实**。固定旧样本 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核对 21 个字节窗口和 15 个函数范围，新增 43 条观察，共保留 779 条并关闭会话。

**事实**。C 在 0x433e8e 读取当前 MP，写入角色 +0x1b0 的整数存储。CFP 入口 0x4289bc 调用 0x403470 做有符号减法，再以 0x4033e0 比较零，最后释放命令。

**事实**。ITM 入口 0x432616。变体 0 从 0x432a35 入队。0x40ef88 启动目标列表，0x411f0a 经 0x41dc00 创建效果，0x41b640 回报动画完成，0x41283b 结算 HP。变体 7 的 0x413e0c 播放动作 16 并清零帧游标与延时。

**待验证**。原版整数存储更换掩码时的全局随机序列，以及目标缺失时原版释放路径的完整调度。

[本轮计划](../analysis/game-battle-shared-storage-v1/mp-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/mp-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-transitions"></a>

### 前序检查点 · REB 和 PLV 的队列及回调

**事实**。固定旧样本 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核验 21 个字节窗口和 9 个函数范围，新增 30 条观察，共保留 736 条并关闭会话。

**事实**。REB 的 0x432bd2 经 0x500a70 归一化资源，0x434af0 写四元组。0x412bed 执行状态 158 的变身或解除。状态 158 使用原有 FD4 计数，0x41b0e0 通知过渡对象完成，0x506e80 读取 +309 掩码和 +310 值。

**事实**。PLV 的 0x428c2e 按映射槽号设置 CRT 随机种子。两次取值分别索引 0x533808 表中的横坐标与纵坐标。两条命令均通过 0x434b90 等待本体动作完成。

**待验证**。其他渲染后端、原版运行时序和对象引用重叠的边界。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-transitions-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-transitions-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-friend-roster"></a>

### 前序检查点 · 好友表读取、写入和调度

**事实**。固定旧样本 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核验 25 个字节窗口和 21 个函数范围。保留 706 条会话记录并关闭，新增 65 条。

**事实**。423500 按 F5F048 选择两个 0xA000 字节的角色区之一，每区 320 行、每行 0x80 字节。活动位、名称与四个标记在行内。4235f0 写 FE0 的最低位，C 的 434564、入场 437e92 与 MON 的 428099 均调用它。

**事实**。4f48b0 经 4fe290 读位图并经 4f6de0 请求明细。4f48d0 经 4fe0d0 写一行。450250 路径初始化表，5015a0 路径另读文件缓存。当前可追溯实现从空会话开始。

[本轮计划](../analysis/game-battle-shared-storage-v1/friend-roster-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/friend-roster-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-effects"></a>

### 前序检查点 · CHT、BST 和两条退场扫描

**事实**。固定旧样本 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核验 19 个字节窗口和 14 个函数范围。保留 641 条会话记录并关闭，新增 55 条，累计有限证据 2,932 条。

**事实**。533e54 与 433650 的 14、20 索引分别到 428a7f 与 432d0e。444f20 写入 512 项聊天环。420170 生成 573f 图标，420130 计数并删除。BST 使 4134cd 的动作 161 消费一个数值，并调用 421210 生成时间数字。

**事实**。437b30 的阶段 7 先调用回调，再经 436cf0 扫描全局剩余记录。423660 使用当前命令游标，434770 扫描全局原字节。阶段 9 也有 436cf0 调用。451be0 在 main10 的 4、5、6 阶段扣除实际时差，普通 main9 要有本机身体。

**待验证**。924f30 的其他运行上下文、声音选项写入和原生计时提示。

[本轮计划](../analysis/game-battle-shared-storage-v1/side-effects-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/side-effects-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 队列、天气池与绘制

**事实**。固定旧样本 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核验 19 个字节窗口和 21 个函数范围。保存 586 条会话记录后关闭，新增 58 条有限证据，累计 2,877 条。

**事实**。430cac 生成施法及两次 206。414966 的动作 211 在动画信号时以 41a240 重置随机流并放行目标。414616 的 206 检查当前元组的模式位。4146ae 的 207 调用 41b4a0，再加目标元组的绘制偏移。

**事实**。438564 调用 4653d0，465410 管理 type 1 的生成与移动。4651d0 初始化 500 个节点，465310 加入 461660 所写移动方向偏移。5059f0 以优先级 20 加入类型 9，5067e9 经 4653b0 和 44ce10 绘制。44c0d0 使用由 449cf0 写入的调色板第 143 项。

**事实**。437b30 在天气仍开启时清模式并快进 160 次。已归零的余滴没有进入这条快进分支。**待验证**。其余天气类型、替代后端和快速再次入场的原生池连续性。

[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 队列、信号与追踪回调

**事实**。固定旧样本 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 核验 15 个 PE 字节窗口、19 个函数范围，并保存 528 条会话记录后关闭。新增 30 条有限证据，累计 2,819 条。

**事实**。430954 创建主队列 241、24、53、38、211、62。4192b3 将元组第三字乘以 52d3a0 的 0.01 后作为移动速度。414966 的动作 211 使用 41dc00 的咏唱类型 30，并在施法中途信号逐目标调用 41a240 和 41dc00 类型 31。41e73e 将回调写为 422500。

**事实**。422500 的 385 条派生指令共 1,332 字节，与 REA 读取及 PE 原件一致。以 320、260 为起点，距离截断值小于 9 时按结果位选择动作。搬运持续到越过 52d404、52d408、52d40c 的范围。52d544 的 35 参与目标 Y 偏移，41f450 发出尾迹。

**待验证**。重复目标及 RID 扩展的可靠原件上下文、替代渲染完整行为和 SKL401。

[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL400–402 分派与侧选目标

**事实**。固定旧样本 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 对照 PE 原件核验 11 个字节窗口，保留 498 条会话记录后关闭。新增 20 条有限证据，累计 2,789 条。

**事实**。4339f4 依次分派至 430954、430cac、430f8d。三类等待索引均为 2，427a0c 经 434b90 等待后调用 436930。SKL402 在 4121b3 动作 135 的中途信号分支绕过提前释放，到 41234f 自然完成分支才逐目标调用 434a70。212 经 41dc00 的类型 23 分支装入 1af8a，41b640 完成时将父对象 1024 写成 2，由 157 继续。

**事实**。SKL400 的 422500 由独立 Ghidra 静态派生，385 条指令共 1,332 字节均与原件一致。已看到追踪、位置与提示分支，消费者仍待核对。

**事实**。SKL401 的动作 206 写入 C07884 的天气控制短整数，465410 与 465870 消费这两路值，437b30 存在清零路径。动作 207 另有目标效果。**待验证**。天气池的逐帧绘制、寿命和全部退出上下文。

[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · SKL404 恢复和 SKL405 源指令

**事实**。固定样本 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 保存 478 条会话记录后关闭。本轮新增 20 条有限证据，累计 2,769 条。

**事实**。429396 进入 434b90。FD8 为 1 的分支递增命令计数，超过 7200 后通过 4348e0、434990、434a70 重排相关登记槽。动作 222 写入同槽时，后一次登记按当前槽指针移除第二具身体。

**事实**。433a08 指向 SKL405 生产者 4323b6。433877 的等待索引 4 经 4337e0 到 432642。4123fb 的动作 135 分支依次访问 422080、422d60、4232e0。421f90 的派生证据覆盖 219 字节，437b30 经 437a90 刷新背景缓存。

### GMN 呈现与前序字段

**事实**。固定样本 SHA-256 为 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA 6.7.0 与 Ghidra 12.1.4 增加 21 条有限证据和 4 个 canonical 函数，累计 2,749 条与 758 个。保存 458 条会话记录后关闭。

**事实**。44fb60 在对象回调后、506030 绘制前调用 44a430。44a712 的蓝色 FST 保存 f32 并保留栈顶之和给 51b4a8 取整，红绿重新读取 f32 存储。44aaa0 更新默认 RGB，505d70 和 447b10 决定内嵌调色板的色阶及 flag4 分支。

**事实**。422320 使用最长名称行及 53890c 的 0 号字体字节度量。4ea7c0 建立窗口对象，4ea9b0 提供展开和 4032f0 门闩，422280 读取门闩。4ea9b0 为独立分析副本的派生回调，核对 720 字节与 250 条指令，未计入 canonical。48e8d0 提交类型 4 图块，44f0a0 和 44f8b0 分配并绘制 lane2。

**事实**。生产者的 GMN 表项 4336a4 指向 432e0c，SKL404 的 433a04 指向 431118。222 表项 4197ac 指向 416ad5，负责替换身体的登记。前一检查点的 14,120 条派生指令与 54,685 字节仍保留。

[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：CMB生产者、1038与横幅回调

**事实**：70与14更新实际所属命令计数器，125/126/127创建原结果光效后立即pop；不是119/120/121的157等待。最后E000保留4349e0写出的当前动作-1和原等待恢复。RID3仍插入两条元数据和原元组，附带RID0继续走4236d0/221的当前元组与注册槽位交接。

**事实**：合击横幅按最后参与者所在队侧选择方向，人数上限10，创建9或10个原始静态字块及每块两个整数盒，保留六状态速度、延迟、隐藏标记、读取/重编码、寿命和第十块声音。controlFlags的404掩码或单人合击不创建横幅，也不要求横幅资源。420c50与4210e0为canonical；420e50是独立分析副本中恢复并核验617B/171条指令的derived回调，未升级为canonical或新增Evidence。

**事实**：REA6.7.0/Ghidra12.1.4/profile7810，新增14条不同Evidence，有限累计2,696；canonical745，新增两个函数共595B。102个保留函数重新核对105,376原始字节；当前16B解码指令、268B重叠代码读取、168B数据读取去重为277B代码加168B数据。原有derived主循环14,120指令/54,685B与CMB区间538指令/1,919B均重核；72B原始读取开头可能位于指令中间，不声明整段解码。REA已关闭、无待清理。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](../analysis/game-battle-combination-v1/source-check.json)、[源修正](../analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-combination-v1/test-results.json)、[验收边界](../analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](../analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](../analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：RID生产者与221指针交换

**事实**：221按当前旧身体元组的a/b替换角色，先安装第二身体，用counter平方的32位有符号结果除5并加动画attachmentY（actor+2f4）控制旧骑手落下；达到地面后安装第一身体、恢复状态和额外挂件，删除旧身体/骑手/交接对象。保留覆盖而未删除的旧B、重复RID遗留隐藏身体，以及body.slot与全局槽位可不同的原始别名，不把它们归一化。逻辑对象ID不是原生内存地址。

**事实**：REA6.7.0/Ghidra12.1.4/profile7810，本轮11条新Evidence、有限累计2,682；canonical743，新增422e20为590原始字节。77个保留函数重新核对101,674原始字节；当前41B解码指令、144B重叠代码读取和4B表，去重为161B代码加4B数据。REA已关闭且无待清理；既有derived4260b0、422a40及435000的28B/独立461B不改级。

**事实／纠错**：40c7a1的动作10读取actionRead-1，检查前一个动作11；40c7ca再取global[body.slot]进行朝向恢复，空指针由419f60忽略。旧核心与独立模型都误查下一个动作，本轮同时纠正。23套旧模型完成重算，134份旧生成器/金样中12份有意改变、122份不变；1,648条轨迹、50,731帧状态摘要改变，输入、动作队列、资源/geometry、帧数与RGBA记录不变。三个最终附件动画的nextFrame变化均伴随lastFacing变化。历史218只在完整before视图重验，未改写旧验收事实。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](../analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](../analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](../analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](../analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](../analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：73分派表与完成所有者

**事实**：73初始分派selector7指向4294ac，variant0调用424310后以434a70重启主身体；完成分派selector6指向42912e，434b90(command,0)等待后，仅对仍存在且非死亡的599ba4主身体调用419f60，再释放命令。436c20前瞻只跳amount和RID三字，不跳后续guard；实际解码73命令私有持有原始数值尾部，只有真正NUL才反复返回0。复制命令缺少必要上下文时原子拒绝，不补写或归一化协议。

**事实**：REA6.7.0/Ghidra12.1.4/profile7810，本轮11条新Evidence，有限累计2,671，canonical函数仍为742。64个选定函数重新核对98,490原始字节；当前14B解码指令、177B含重叠代码读取和10B表数据，去重为131B代码加10B数据。55B完成分支读取尾部落在指令中间，不作为完整指令范围证明；61B补充范围单独核验。既有derived4260b0与435000的28B/独立461B材料不改级；REA已关闭且无待清理。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair73-v1/source-check.json)、[源修正](../analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair73-v1/test-results.json)、[验收边界](../analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：260字段与父关联证据

**事实**：435000前置计数先读连击再读主守护，424310运行生产者先读主守护再读连击，未发现归一化。4,608条原字段样例保持4,368条准备与240条边界拒绝，928条260运行记录闭合，336条保留角色顺序差异。解析字段顺序未改。为原始解码260命令私有保存数值尾部，436bb0在真正NUL才反复返回0；255后仍可前瞻下一条原始命令。复制命令缺少该上下文时明确拒绝。

**事实**：REA6.7.0/Ghidra12.1.4/profile7810保留742个canonical函数，本轮8次查询中6条新Evidence、2条复用，累计2,660。63个选定函数范围重新核对96,241原始字节；当前4条解码指令共17B，其中新身份的指令5B，另完整核对436bb0的100B。3个非指令边界观察不作代码证明。原derived4260b0与435000的28B/独立461B证据不改级、不补写；REA已关闭且无待清理。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](../analysis/game-battle-chain260-v1/source-check.json)、[源修正](../analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-chain260-v1/test-results.json)、[验收边界](../analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](../analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](../analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：105扩展字节窗口和原始动作证据

**事实／范围**：原200字节观察不足以判断105高等级。REA扩展读取533940处512原字节，其中533968起472字节作为已观察窗口；十等级从零游标出发首次负值偏移依次9、10、163、143、123、103、83、63、43、23。高等级会读到相邻数据37/115/32及533a33的-126，缺少该动作时4fd5f0返回1。没有恢复出472字节的声明类型，不能把相邻数据叫作完整动画表；原生间接写入、整个进程生命周期和超出已观察窗口仍未验证，越界明确报LEGACY_BATTLE_SEQUENCE_CONTEXT。

**事实**：REA6.7.0/Ghidra12.1.4复用742个canonical函数，新增8条不同观察，有限Evidence并集2654。62段96141原字节、既有18动作组及已保留44组核对；新增指令11字节、数据读取512字节。派生4260b0仍是14120指令/54685原字节的非canonical观察；435000仍是28字节partial加独立461字节续段。REA已关闭，无待清理项；3463份修改前文件与历史215源核验均保留。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-context-v1/source-check.json)、[源修正](../analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-context-v1/test-results.json)、[验收边界](../analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：复用特殊配对消费者证据

**事实**：复用REA6.7.0/Ghidra12.1.4固定37c4源证据：742个canonical函数、有限Evidence并集2646，本轮新增记录0；59段93763原字节、既有18动作组及另一个已保留44清理组核对。派生4260b0仍按14120指令/54685原字节核对，非canonical或原程序运行；435000仍为28字节partial加独立461字节续段。原阶段214证据及3436份修改前文件已核验、保留。

**事实**：固定37c4旧样本的94、257、262首条pair/variant0队列及真实消费者已接入shared。94使用额外104c标量、78声音与96前置动画，再由14按字面优先级分派条件和HP；257/262保留73/74、最高级tile2/3、额外效果及262的205冲刺和1af89朝向1。护卫、RID旧第四字、E000、别名自身与普通后续记录分别核对。0x106=262、0x10a=266的先前纠错保持；本轮没有新增平台专用功能。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](../analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](../analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：剩余pair生产者与消费者证据

**事实**：REA6.7.0/Ghidra12.1.4复用固定37c4旧样本742个canonical函数；有限Evidence并集2646，新增46个不同记录（43条新指令记录、2次数据读取、1次xref；另1条指令记录复用）。44条指令228原字节、216原始数据字节、59段93763字节和18个完整动作组核验。派生4260b0仍按14120指令/54685原字节核对，非新canonical或原程序运行；435000仍是28字节partial及独立461字节续段，未冒称修复。REA已关闭。

**事实／边界**：105使用533968处按等级步长20的有符号动画表与共享58fac0游标；已核200字节只有前两行带负终止标记，后八行全0，不能推定高等级正常完成。260带主护卫的串联字段在435000前置解析与424310实际生产者之间顺序不同。4608个原创字段流对照中，实际shared解析准备4368个、240个触发跨平台边界拒绝；4128个在两个源读取器都完整，336个已准备流呈现不同字段角色顺序。未把这些静态方程当作游戏执行或修改已证前置解析。

**事实／纠错**：原424310的`0x106`是262，`0x10a`才是266。旧实现和独立模型曾把262的205冲刺、最高等级73/74套给266；本轮修正shared的配对生产者及护卫路径，266恢复普通9接近。此前stage209相关“266/205”结论已被新证据纠正；正变体和自身266的独立规则继续区分。其余五类特殊pair并未因此启用。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](../analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：96脚本、原始字段和零值构造

**事实**：REA6.7.0/Ghidra12.1.4，样本SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。742个canonical函数不变，有限Evidence并集2600（新增24条指令、135原字节）；47段保留范围92063字节、22个完整动作组。另核验原始52d420处4字节float180。435000仍是28字节partial函数，461字节续段未冒称边界修复；派生4260b0仍按14120指令/54685原字节核对，非新canonical或原程序运行。REA已关闭。

**事实**：92复制目标float坐标，角度减180并单次归一，speed50移动一次后朝向目标。93只在counter0执行一次动作3动画，speed6移动16次，第17次结束并把目标HP设为0；执行到该分支时不按收到的amount扣血，也不被108/E000/RID直接改成通用伤害/治疗。临时零值盒只消耗一次rand，已与背景另外两次RNG区分验证。95/94写目标2d4冻结位；78/79/80分别发出62/210/133声音事件，消息为5783。

**事实**：96默认后端的4160组队列、80条轨迹、32959帧状态、11836帧双selector完整RGBA与实际共享核心一致。另两条替代渲染轨迹的927状态/578像素/50样式观察仅为独立源方程；实际公开配置仍报LEGACY_BATTLE_SKILL_CONFIGURATION，未放宽门禁、未计入运行或像素通过。当前仍无替代渲染/半透明后端的完整实现。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special96-v1/source-check.json)、[源修正](../analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special96-v1/test-results.json)、[验收边界](../analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：424310、232与435000差异

**事实**：REA6.7.0/Ghidra12.1.4，样本SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`。742个canonical函数不变，有限Evidence并集2558→2576；18条新指令77原字节，38段保留范围89281字节，12个完整动作组。435000的canonical函数体仍只有28字节，其461字节续段独立按原文件反汇编核验，不冒称边界已修复。4260b0仍是明确标注的分析者派生主函数，14120指令/54685原字节复核；REA已关闭。

**事实**：原435000只给72读取嵌套记录，且不把嵌套目标本身标成依赖（护卫会标记）；424310运行时同时处理72/113。保留原解析边界：113嵌套的4480组队列/104条轨迹仅为运行时命令夹具；可经真实前置解析的部分为4640组队列/157条轨迹。真实TCP/页面只验证72嵌套及113无嵌套，不将113嵌套标成协议兼容。

**事实**：232先移动并按距离/计数处理命中，HP位优先为108跳过正常处理、8000不改HP、4000治疗目标、2000反射伤害攻击者、普通伤害目标；全部先signed32运算再按源钳位。普通零值仅显示573b/57bb；反射会先弹自己与目标动作，组合位可在计数后重处理外层tuple。5实际移动16次，第17次才结束。未知嵌套RID旧存储上下文在写入前明确拒绝。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](../analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：源216与保存的最后自身记录

**事实**：REA6.7.0/Ghidra12.1.4新增28条指令观察、128B核原件，复核32个保留函数范围76223B和27状态条目/25完整case组；742规范函数不变、有限Evidence并集2558。既有analyst-seeded4260b0的14120条指令/54685B再次核原件，非新增规范函数或原始源码。REA已关闭且cleanup=false；样本SHA256为37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。

**事实**：216先消费攻击者记录，再消费自身/护卫结果记录与可选RID，随后推进动作与tuple游标。8000跳过HP、4000对HP作signed32加法并仅按maxHP上限截断、2000抑制数值；108与flags3不阻止该结果。非零治疗即使有10000000仍显示style5，只有零治疗改57bb；伤害有10000000时改57bb，否则含零也用style6。自身RID仅保存首字，后两字来自最后一条非自身RID；缺少此前可确定的RID尾部时提交前拒绝，不猜默认值。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-self-physical-v1/source-check.json)、[源修正](../analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：投射物实际HP盒与完整分支优先级

**事实**：REA6.7.0/Ghidra12.1.4新增31条指令观察，117B与原件逐字节相同；复核28个保留函数范围75627B、19状态条目/17完整case组。另复核既有analyst-seeded主生产者14120条指令/54685B及三处完整词法跨度；它不是新增规范函数，默认库中其procedure仍未定义。规范函数742、有限Evidence并集2530；REA关闭且cleanup=false。原件SHA256为37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。

**事实**：正变体结果与直接body14不同。body16/21在8000跳过HP、4000对实际目标HP做signed32加法并仅按maxHP上限截断、2000只抑制数值并释放目标，不在该回调扣攻击者HP；class6正变体也使用HP而非MP。RID仍独立按2000位写真实principal身体，不能写匿名投射物。单弹掩码为7e000/48000/24000/12000，多目标为e000/8000/4000/2000；skip→heal→suppress有先后。6000组合仍显示style5治疗数字；单弹30000与多目标30000保留各自源行为。

**事实／修正**：旧实现与独立模型把heal和suppress独立判断，导致6000及单弹30000组合错误隐藏治疗数字；现按原始分支优先级处理，且只校验实际会使用的数字/消息资源。4组受影响旧模型已重新生成，输出、输入、资源、geometry均逐字节不变。119/120/121使用工厂kind7/8/9，不代表body animationAction7/8/9。stage209的“正变体E000仍拒绝”在本轮有限范围内被更新；其1004/1000/FD4与266205修正继续保留。

**待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](../analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](../analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：body14数值归属与原件指令核验

**事实**：REA6.7.0/Ghidra12.1.4新增30条指令观察，155B与原件逐字节相同；复核33个保留函数范围82359B、24个状态条目/22个完整相邻case组。规范函数仍742，有限Evidence并集2499，REA已关闭且cleanup=false。原件SHA256为37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。

body14值归属：8000不改HP；4000给实际目标HP做signed32加法后仅按maxHP上限截断；2000对攻击者HP做signed32减法后下限0。class6在8000/4000仍扣实际目标MP，在2000扣攻击者MP。84/85/87在E000同样参与HP；不能套用普通分支的HP排除规则。RID按2000位写攻击者，护卫则保留三角色与原生3字tuple旧第四格。反射弹出双方动作并推进攻击者tuple，后续cooldown重新读取新tuple。

**事实／修正**：native1004是afterImageEnabled，1000是残影计数器，FD4才是attackFinishCounter；73/74、defense100和positive105现使用正确字段，8优先于100。266首段应使用205，level9使用147→73及源74清理；205每次回调恰调用一次rand并选择1adb4..7烟尘。共同body尾部生成冻结副本，队列重置清FD4但保留1004/1000。此结论更新stage204～208相关旧字段/266描述；历史本地绿色测试不构成原生等价证明。精确修改前3275文件副本与历史源核验均保留；12组旧模型重新生成，仅5个预期文件改变，所有旧场景输入、资源字节及geometry不变。

**待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。

[需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-results-v1/source-check.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：局部游标和113构造ABI

**事实**：REA6.7.0/Ghidra12.1.4新增14条指令观察，53B与原件逐字节相同；复核24个保留函数范围15825B、31个状态条目对应27个完整相邻case组及5个goto所有者。规范函数仍742，有限Evidence并集2469；REA已关闭、cleanup=false。原件SHA256为37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。

436c20复制owner payload+64到栈上局部游标，只扫描连续0x1010记录，首条不匹配即停止，不改变主游标；跳过amount和可选3字RID，不额外跳过guard标量。434a90只写3格、保留旧第四格；436e60追加RID后复制之前的完整raw tuple，禁止清零或改复制来源。

113先Action5/animate1，再构造(parent,-32,type0/3,filter0,parentlink1)，1000位选择1ae49，否则1adb9；效果复制世界坐标且不跟随，无初次animate。父状态1→2由实际效果完成回调产生，157清自身冻结并弹出。护卫蓄力的被保护者可能保留frozen=1直到队列重置，当前按原始脚本保留并验证nextC/reset，不擅自解除。

**待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：指令级复核整数盒子与生产者

**事实**：REA6.7.0/Ghidra12.1.4新增10条精确指令观察（原件35B逐字节一致）；29个既有函数范围17465B复核。规范函数仍742，有限Evidence并集2455。4033b0先读limit再读counter并作有符号>=；403410的参数0不是重置值，而是读取后加1；4034f0第21次读取更换掩码。原件与历史源证据未改，REA已关闭、cleanup=false。

整数盒子限值与计数器按limit→counter顺序构造，构造各调用rand一次；getter第21次读重置读次数并更换掩码，decoded值不变。比较先读参数limit、再读ECX counter，SETGE有符号；403410读、加1、写回，参数0不代表清零。只声明本地可观察调用顺序，未声明全局对象池和RNG已一致。

**事实**：266直接路径漏147的既有差异已按424310的257≤class<406分支修正；独立204模型同时修正，仅802组队列和class266两条轨迹变化，原输入/原创素材/几何未变。历史206生成器身份账本针对唯一已修正204源码读取精确改动前备份，当前修正另有回执；没有改写旧源证据或制造旧验收全绿。

**待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。

[需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：复用33个helper的源证据

**事实**：复用REA6.7.0/Ghidra12.1.4保留证据，分层742规范函数、有限2445条Evidence均未增加。33个既有helper范围6634B映射至未改原件，12个完整case组及历史源核验以只读比较复核；Apple LLVM21.0.0独立核对419bd0双减法和420080世界坐标读。REA会话已关闭、cleanup=false。

**事实**：基于固定37c4样本，实现25个generic选择器及独立73类的有限variant1/2/3发射路径：真实动画probe、单弹、多目标回收、连续发射和28反应；73不使用generic耗蓝前缀。95/105/110前缀与6/84/85/87的正变体HP结果保留各自源规则。公共消息工厂改为当次世界浮点坐标，修复95移动后仍取旧屏幕缓存的问题。

**待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。

[需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：14个规范函数与两处独立派生回调

**事实**：REA6.7.0/Ghidra12.1.4新增14规范函数（2991B），分层总数742；21个原件范围5189B逐字节吻合，有限Evidence并集2445（新增58），当前154条快照已关闭、cleanup=false。421f90/41a660在独立分析副本恢复为219/224B派生回调，不计规范函数，原件未改未运行。

**事实**：41a280重置2b4 lastAction与2d0 signal，不是清空frame游标；419fd0以EAX返回截断距离，不能按void伪代码认定无返回值。41a740方向常量52d4f0实际为float32 135.0；41f5b0是100格平铺视觉而非通用震屏。原始指令与文件映射见源核验。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：源命中分支与实际直接结果实现

**事实/来源**：固定旧样本37c4（`cg_se_6000.exe`，1569280B，SHA-256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`）沿用REA6.7.0/Ghidra12.1.4来源。本轮只读重核原PE、分层728个规范过程、2387条有限Evidence及最新95记录已关闭快照；没有新查询、没有重写历史证据。完整公共族来源仍未闭合。

40a120 action14对class6使用目标+1b4/数字style3，即MP；0/1/3/5等使用+174/style6，即HP。84/85/87的非零普通直接结果不进入HP/数字/反馈分支，效果与反应仍执行。普通amount0/flag20不设置dead/aux/slow；只有class6强制进入零数值结果块。

**事实/本地实现观察**：434b90原有counter>7200恢复在zero-KO真实经理流程被观察到：第7447次回调恢复0/10，7592帧流程完成、HP不变。此为便携客户端本地证据，不是原EXE运行时测量。

**待验证**：正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：公共物理族新增10个规范辅助过程

**事实**：固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增10规范函数3679B及44B常量核原件，重核公共生产者8618B、身体/构造67615B及分派器54685B指令。规范函数由718到728；本次95记录含54复用/41新增，有限快照并集由2346到2387，不能把规范缓存算成完整Evidence。45个旧大快照核完整哈希和身份并沿用逐对象JSON证明，另解析29/42/54三个小快照。会话已关闭、cleanup=false。

新增41a280、41a8c0、41ab20、41a2d0、41a550、41a4e0、419bd0、420170、420130和51b4a8。41a440查询是41a2d0内部地址，仅计一次；41b910候选没有规范过程，已排除、不重试、不计作恢复。batch结果只含C，不冒充完整规范档案。

**事实**：后续pair把类别改为-1，81/94首记录额外字段不能在后续pair重复读；200护卫改变拥有者，2000/4000/8000各走不同结果链。419bd0只以AL返回-1/0/1；41a550目标参数被Ghidra表达式遗漏，ESP/x87指令证实目标坐标。

**待验证**：本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](../analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](../analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：技能82与动作83的不同语义

**事实**：固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4复用718规范函数，本轮0新增；核298B冲击辅助/回调、72B常量、352B中点表、70074B身体/构造/C原字节及54685/682B分派器/管理器指令。45个历史快照核完整哈希和身份集合并沿用逐对象JSON解析证明，另解析后续29/42记录快照；本轮54记录为11新增/43复用，有限快照并集从2335到2346。规范缓存和快照记录分开计数；会话关闭、cleanup=false，旧封存证据保留。

4260b0 case0x52消费有符号三元组，800000追加三资源字；施术者24/53/147/8/6/10/78/83/34/89/84/35/87，随后本地244或非本地50/49。这里的动作83是放大/转向，不能和技能类别83的移动数值分支混用。

原始5337b0/c4/d8/ec索引2/7/12/17及533810位置表给出前侧188/203、后侧449/336。40f79b/40f7a7用float32常量0.009999999776482582递增缩放，40f7d0比较2.0；41b4a0生成1ae4a，422120以真实动画完成删除。58fb2c/533c54属于现有423340震动状态。

**待验证**：82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](../analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](../analysis/game-battle-skill82-v1/source-check.json)、[验证修正](../analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-skill82-v1/test-results.json)、[TCP](../analysis/game-battle-skill82-v1/network-validation.json)、[页面](../analysis/game-battle-skill82-v1/browser-validation.json)、[验收](../analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](../analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](../analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：83、冻结演员副本与244控制证据

**事实**：固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增41f740/41f7a0共1598B，规范缓存由716到718；436530解析到已知436500，其202B只按复核。保留41f280的70B、独立播种41f250的33B、54685B分派器和682B管理器原指令、70074B身体/构造/C消费者均核原PE。45个历史快照核完整哈希和身份集合，沿用上轮逐对象JSON解析证明，另核上轮29记录无新增；本轮42记录为12新增/30复用，并集2335。独立播种不改规范计数；函数缓存与有限快照记录分开，旧封存证据未改写，会话已关闭且无待清理项。

**推导并本地核验**：4260b0 case83与429eb1..42a30d共享三元组，施术者24/53/38/8/6/10/62/133/88或193，随后本地244、非本地50/49。40a120的88在距离小于20时以434a70重启当前目标动作；没有135咏唱，也不制造咏唱资源赋值。整数中点为318/270，与其他field效果的浮点中点区分。

41f280/41f740/41f7a0复制演员与13b8数据，保留新分配的链表链接及数据所有权；复制当前浮点/动画但保留本次屏幕整数写入前的位置。41f250独立回调到第12次访问删除。既有244结果沿命令拥有者到下一管理回调的phase7，不是空操作。

**待验证**：非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](../analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](../analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](../analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](../analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](../analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](../analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](../analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：三元组、反射与构造16/17证据

**事实**：固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4复用716规范函数，本轮无新增规范函数；重新查询41b6a0并核其62B，另复核70074B身体/构造/C消费者及54685B分派器原指令。45个历史快照逐条JSON解码并核完整哈希，再与流式身份检索交叉核验，实际不同Evidence记录并集为2323；历史累计2400多计77，首次引入位置尚未查明。当前29记录均已复用，无新增不同记录。函数缓存数和有限快照记录数分开，旧封存证据未改写；会话已关闭且无待清理项。

**推导并本地核验**：61..63共同分支为target/flags/signed amount；普通目标先146，优先40000吸收、再20000扣血、再10000反射，否则155治疗。20施术者对前侧目标、21对后侧目标先179/72；137在此类直接推进目标动作，不走19..31投射物。16使用1ae05+tier，tier0创建17/1ae68；41b640完成回写父1024，41b6a0在该效果父删除后清次级节点。

**待验证**：源83额外移动/死亡与local244，以及完整原生运行/后端/当前官方。共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](../analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](../analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](../analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](../analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：共用状态分支、原始表与回调证据

**事实**：固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增3规范函数595B，另1个105B函数已在旧缓存、按复用核验；3个独立播种回调1170B、400B常量、额外64B第六组贴图表、70074B既有身体/构造/C消费者、133B贴图助手及54685B分派器指令核原PE。累计716规范函数/2400条有限快照记录并集；当前26记录为22新增/4复用，44个历史快照核身份。函数缓存与快照记录是两种计数，会话已关闭且无待清理项。 新规范函数为420b30、4203d0、41ba10；41b6e0已在713函数缓存。41ba70/41bcb0/420ae0独立播种，不增加规范函数数。

**推导并本地核验**：4260b0共用32..49/54..60/64..68/86与自身50..53/88；135使用434a70激活当前目标动作，和434a30推进不同。41ba70逆序栈表必须从实际指令恢复，不能照抄负索引伪代码。420b30取原排列位置表的7/17项(418,313)/(218,228)，中心318,270.5；不能替换成逻辑槽7/17。86调用41f520第六表70f1+(counter>>2)，共享三角计数。

**待验证**：原生运行、界面备份/阻塞时间、完整后端及其他消费者。其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](../analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-status-skills-v1/test-results.json)、[TCP](../analysis/game-battle-status-skills-v1/network-validation.json)、[页面](../analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：135与四类投射回调的来源闭合

**事实**：固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增8规范函数2645B，另核5个独立播种回调7520B、400B常量和16B原文件常量，并复核4260b0分派器54685B指令；累计713规范函数/2378不同记录并集。当前40记录全部新增，43个历史快照核身份；REA会话已关闭且无待清理项。40记录快照不是完整并集。 原字节/文件偏移、工具画像、快照和关闭回执均列入source-check。41bec0/41c3e0/41ca90/41d330与41b1b0为独立播种回调，明确不把它们计作新增规范函数。

**推导**：由4260b0的19..31队列、41f520的100格直接提交、423340背景和四类回调重建独立方程，再与原创实现逐状态/像素比对。确认actor+2cc是动画drawOffsetY，44fb60在506030队列前复制背景，466a20使用有符号余数且high=-1不消耗rand；旧参考与向量已按这些证据重算，历史清单保留。

**待验证**：初个RID之前的栈字未观测且本切面不读取，便携投影0不等于原内存身份；自吸取/反射等待与原后端仍无运行结论。自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[规格](../analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](../analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](../analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-casting-v1/test-results.json)、[TCP](../analysis/game-battle-casting-v1/network-validation.json)、[页面](../analysis/game-battle-casting-v1/browser-validation.json)、[验收](../analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](../analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：J:@、J<=、JUA及真正的技能/道具入口

**事实：** 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增10规范函数2175B；19个独立播种回调6651B、1032B常量及既有4260b0分派器54685B指令核原PE。累计705规范函数/2338记录并集；当前48记录含3复用/45新增，42个历史快照核身份，会话已关闭。48记录快照不是完整并集。 新函数4f0210/4f0290/4f0510/4ff030/4fdea0/470b20/470c90/4ea400/4033a0/437410；4f6d00是复用已存档函数。559a20→52df98/window10→5415b0/item表；473370/473510来自470b20/470c90实际代码指针。471140请求mode3，471180请求mode4；48a8b0为普通命令2技能，48aa80为普通命令3道具I。

**事实：** 等级473510使用身体+1b0经4033a0/4034f0读MP；消耗是imul32(等级7c,主34)后idiv100，8c!=0才可选。48a7d0调用4374e0；目标模式禁用时立即发S，否则48b810在437080返回真实目标代码后发S。534160为无尾分隔符的S|%X|%X|%X。

**推导：** 独立收到的15主技能/11子等级及10可点行重建、精确S与已有真实物理SKL结算。**待验证：** 普通非零工艺上下文、特殊地图62分支、ID48无队员提示、原生翻页/窗口/命中/音频与原运行行为。原470b20的翻页计数确读相邻c45d4c[15]，网页语义列表不猜该内存值。完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-player-skills-v1/source-check.json)、[测试](../analysis/game-battle-player-skills-v1/test-results.json)、[TCP](../analysis/game-battle-player-skills-v1/network-validation.json)、[页面](../analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-player-skills-v1/goal-audit.json)。


<a id="stage196"></a>

## stage196：window28、MON与真正的缓冲翻转

**事实：** 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增4规范函数647B；独立播种回调1745B、既有4260b0分派器54685B指令及320B不重复常量核原PE。累计695规范函数/2293记录并集；本次31记录中2条复用、29条新增，会话已关闭，31记录快照不代表完整并集。 新函数489880/4898e0/446740/446890；44686d位于446740，446890是VBlank/status方法，不能冒充缓冲getter。559a68→52e388的48B窗口记录引用54bdd0八项表；初始化48e160、收回48e530、列表48e620及显示48e1a0按独立工程播种、逐指令核原字节，不计为规范函数。53416c为M|%X，52d3e8为f32(.02)。

**事实：** 433b70调用489880；每次非结束C由437b30设置当前操作者/437430索引并调用4898e0。4260b0 case5消费MON，40a120处理39/51/52/65/218，41dc00类型20/21资源1ae11/1ae10，由41b6a0跟随实际父对象生命周期。446740在呈现后翻转6122d0，4457b0读的是另一图形配置。

**更正：** MON第三字仅作!=-1缓存重置门限，未证实为宠物索引；4235f0设置savedFE0的友方bit1，转向在52通过419f60执行。对侧分类需423500实际好友名称/四元数据，不能假定无好友。**推导：** 共享逻辑所有者和语义按钮重建已证路径；point采样为独立策略。**待验证：** 原程序运行/驱动像素及全部剩余玩法、设备和官方兼容。完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](../analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pet-transition-v1/source-check.json)、[测试](../analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](../analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](../analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](../analysis/game-battle-pet-transition-v1/goal-audit.json)。


<a id="stage195"></a>

## stage195：宠物接收者与48b810的实际骑乘/宠物分支

**事实：** 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增6规范函数2770B及20B常量核原PE，重核721B已播种回调；累计691规范函数/2264记录并集，新快照24记录，会话已关闭。 新函数4f0aa0/4f1000/4f1420/4ff000/4fde20/4fde60；P消费者4f36d0和48b810/48b5b0/437460/437430/4374e0/437080/403560复用已核档案。EF35F0表5×6d8，每宠物10×8c技能；P3是599c9c允许技能掩码，P5是599d5c骑乘宠物索引。

**事实：** 5340e0四初值为-1/1/-1/-1；输入开始只在rememberedPet与首个present且mode2宠物不同时重置技能。真实13b4优先进入mode4；flag8强制N，20000再N。普通flag20进入mode3或flag8发送W|FF；target-mask按signed16扩展，配对身体MP比较采用403560。48b170/48b2e0分别359/362B为既有独立播种派生，全部重核原指令。

**推导：** 独立字节/逻辑所有者与语义按钮重建这些分支，不等于原生弹窗/命中/RNG/全程序执行。**待验证：** 其余字段语义/技能flags含义、原生UI全局门限与完整游戏、现行/官方/设备兼容。完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](../analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](../analysis/game-battle-mounted-input-v1/source-check.json)、[测试](../analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](../analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](../analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](../analysis/game-battle-mounted-input-v1/goal-audit.json)。


<a id="stage194"></a>

## stage194：CBC四值写入、子对象构造和父回调

**事实：** 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增419820、4232e0、423220、422ca0、422a60、423070六规范档案，1433B均经provider读字节/文件偏移核原PE；旧派生4260b0的54685B重核。685函数/2240记录为跨既有证据并集，新有效快照仅18记录，会话已关闭。

**事实：** CBC case17读slot/归一化base/HP/maxHP/MP/maxMP/raw rider/raw attachment；428dee/428e44/428e98/428eec对应170/180/1b0/1c0，419820复制编码临时值。立即436930完成；13b4存在且raw rider非0才调用422d60，正值更新、负值移除，0跳过，缺子对象时正值也不创建。末字段经4232e0大于0建/更新13b0，小于1移除。

**事实/推导：** 422ca0/423220同以priority2、flags860040建子对象，回调指针422a40只检查原slot仍属于父对象。该地址不是规范过程，REA返回typed invalid_request；在独立Ghidra副本按已证指针播种，32B全核原件，不改REA分析profile/原程序。父40a120尾部才调用422a60/423070，驱动动作、flags、动画附点、parent screen与备用深度Y。逻辑数字未复刻编码存储及整程序RNG。完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-character-change-v1/source-check.json)、[规格](../analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-character-change-v1/test-results.json)、[TCP](../analysis/game-battle-character-change-v1/network-validation.json)、[验收](../analysis/game-battle-character-change-v1/validation.json)、[剩余目标](../analysis/game-battle-character-change-v1/goal-audit.json)。

<a id="stage193"></a>

## stage193：POS、EQU及共用完成标签的保留源核验

**事实：** 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。保留证据工具REA6.7.0/Ghidra12.1.4，本轮复用679函数/2222记录并集，无新查询/新快照/新打开目标；重新核12规范函数范围与派生4260b0全部54685B原指令。192快照及190独立档案仍分开保留。

**事实：** 4260b0 case4以419840配对，交换58fac4身体指针并更新slot/entry/target；599dc4当前操作者在命中原位时立即改变，P接收4f36d0写599dc8，437b30在下一C后才重新取它。20→15、21→16再次配对会到10/11，不能假设配对为对合。固定对象池ID/优先级随原对象。case6经500a70归一化两个资源、写1014/13a8，排66/78/64；40a120 type64设置动画5和当前2a8，真实动画完成后出队并清信号。

**事实与推导：** case9完成跳入共用case4完成标签；旧实现遗漏PSN朝向恢复，真实原创资源复现先物理后PSN得到30.486719131469727而源预期45（离散facing均4）。本轮修复源角度，不把该数值差异称作已证可见方向变化。链接、32状态和缩放等分支保持未完成；独立参考不是原程序运行等价证明。完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-change-v1/source-check.json)、[规格](../analysis/game-battle-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-change-v1/test-results.json)、[TCP](../analysis/game-battle-change-v1/network-validation.json)、[验收](../analysis/game-battle-change-v1/validation.json)、[剩余目标](../analysis/game-battle-change-v1/goal-audit.json)。

<a id="stage192"></a>

## stage192：PSN源分派、数值辅助函数和最高级回血附层

**事实：** 固定cg_se_6000.exe为1569280B，SHA256=37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4新增4033f0、403560、403530、41b6a0四个规范档案，126B与原PE一致；既有派生4260b0的54685B指令再次逐条核原件。复用675函数，累计并集679/2222记录。新有效快照2146记录源于189+12新记录，190的76记录与24规范档案另保留，不能把快照数说成完整并集。

**事实：** 4260b0 case9的PSN五整数为selector/level/slot/flags/amount。0经78/154/30及flags&0x20的44/45，1经129/155，2经78/155；154出队，155转35等60次回调。三种算术均先按有符号32位运算：HP/MP减法只限下界0，HP加法只限最大HP。KO由源位控制，不从剩余HP推断。129调用41dc00 kind14，级9另建kind17；41b640自然完成后反馈，41b6a0按真实父对象删除标志释放附层。

**推导与待验证：** 独立逻辑值没有复刻原编码存储或读取引发的整程序RNG序列；2152独立参考RGBA并非原程序动态运行一致证明。完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-status-v1/implementation-plan.json)、[源核验](../analysis/game-battle-status-v1/source-check.json)、[规格](../analysis/game-battle-status-v1/implementation-spec.json)、[测试](../analysis/game-battle-status-v1/test-results.json)、[TCP](../analysis/game-battle-status-v1/network-validation.json)、[验收](../analysis/game-battle-status-v1/validation.json)、[剩余目标](../analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：原生证据复用与产品实际行为分开核验

**事实：** 固定cg_se_6000.exe 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd、1569280B重核；REA6.7.0/Ghidra12.1.4既有675规范函数、2210记录及6组战斗证据身份保持。本轮native query=0、没有新样本/原程序执行；复用已证grammar与消费者，不把网页按钮当新协议恢复。190新快照失败的情况不变，675档案/完整导出及有效189快照仍是后续复用依据。

**事实/推导：** Source菜单状态/eligibleMask/gate决定语义输入，G、E、P、H|A由真实session发送；网页独立按钮是已证消费者的适配，不是原生菜单素材/命中等价。640×480是实际已证战斗画幅，普通context可为320×240，两者不能混作同一呈现裁剪。修改前2次产品观察证实缺配置/隐藏画布，修改后14次真实页面与OS TCP验证实际输入、C数值、返回和释放。

**待验证：** 完整native UI/音频/交替渲染/全局RNG与调度、其余动作/业务、真机/现行/官方均未证明。局部视觉CRT种子来自本轮client时钟、呈现间隔16ms属于独立平台选择，不能宣称全原程序时序相同。独立位图参考只用源阵型表与原创合成资源，无厂商图片或反编译全文交付。

[来源核验](../analysis/game-battle-web-v1/source-check.json)、[规格](../analysis/game-battle-web-v1/implementation-spec.json)、[测试](../analysis/game-battle-web-v1/test-results.json)、[实际页面](../analysis/game-battle-web-v1/browser-validation.json)、[位图核验](../analysis/game-battle-web-v1/canvas-browser.json)、[网络](../analysis/game-battle-web-v1/network-validation.json)、[验收](../analysis/game-battle-web-v1/validation.json)、[目标审计](../analysis/game-battle-web-v1/goal-audit.json)。

<a id="stage190"></a>

## stage190：普通物理队列、命中与粒子完成的证据

**事实：** 固定37c4/1569280B，REA6.7.0/Ghidra12.1.4；24新规范入口、675总数、2210记录。424310明确构造蓄力/扣费/接近/命中和目标反应队列，436c20为后续动作查找；419860只对正cost扣当前MP并下限0。40a120/14读取实际2d0动画信号：10000..19999结算，>=20000前置受击，消费后清信号；21/22等反射或扩展分支未据此扩大支持。

41b4a0/422120拥有短命中效果；41fe20/41fd90拥有逐字数字、延迟/弹跳/50调用停留。52d450的128B为8×4字体表，style6索引24、base243760，不能把早期32B中243811误作该字体；53890c证实ASCII居中宽9与style2间距11，52d518/51c保留浮点7.2/0.8。41dc00/19与41b640以真实蓄力动画完成更新父1024。

**事实/派生：** 40a120普通倒地44/46先8次闪烁，41dc00/32创建代码指针41b7f0；该入口非REA规范函数，独立临时Ghidra导出536指令字节全核。它生成50子粒子，41b6e0逐个完成后增加父58，达到50才通知父1024=2；不是等待50帧。49清全局槽并标记删除，物理回收仍依池遍历门控。27新增read共19781B和复用8B常量核原件；导出2210记录已保留，新快照校验失败如实记录，会话已关闭。

**推导/待验证：** 仅所列物理类/variant/结果位、普通存活C本体进入本次消费者；其余类、RID/状态/挂件等仍属完整原目标，不能从通用分支推定。原生x87逐位、完整UI/混色/音频和现行/官方运行未验证。

[源证据](../analysis/game-battle-skill-v1/source-check.json)、[规格](../analysis/game-battle-skill-v1/implementation-spec.json)、[测试](../analysis/game-battle-skill-v1/test-results.json)、[TCP](../analysis/game-battle-skill-v1/network-validation.json)、[验收](../analysis/game-battle-skill-v1/validation.json)、[目标审计](../analysis/game-battle-skill-v1/goal-audit.json)。

<a id="stage189"></a>

## stage189：进入战斗的记录清理与main9正常返回证据

**事实：** 固定37c4，REA6.7.0/Ghidra12.1.4；2134记录/19新增、651规范函数。3新入口45ffd0、4f2b30、506820；3旧查询440280（内部地址440397）、440850、463ea0。新457B与PE映射一致；20保留函数14699B留源跨度。43ba10为显式代码指针，REA查询不可用；独立Ghidra导出1515指令字节全核，不计规范函数。直接xrefs分别追踪f5f18c、9250c8/9250cc及59a33c，间接写入完整性未宣称。

501a50/3的4ff430和440450分别清本地本体、远端记录；4ffba0在本体不存在时清leader100。9250c8的非零值阻止4f16d0/4f2010读取内层记录，汇编保留ECX基址与call/test/branch。59a33c是待转向，非资源缓存。440570清本体指针/待转向，4405a0只重建缺本体的现存记录；正常战斗已清旧记录，退出后新记录与新本体不可被旧快照覆盖。

**事实/实现：** 正常9/1→11：30次clear后4ff160→4ff3b0从本地全局重建/刷新，实际场景捕获并调用第一步13淡入，2完成后20→3。4ff3b0对已有本体经4ff510/580/5a0刷新资源/坐标等，不能仅改位置。**推导：** 这条ordinary0来源f5f18c=1，非调用者就绪条件。**待验证：** 其他main9分支、原生完整池/UI/音频调度、退出9/type14、完整其他业务及现行/官方兼容。[源证据](../analysis/game-battle-return-v1/source-check.json)、[规格](../analysis/game-battle-return-v1/implementation-spec.json)、[测试](../analysis/game-battle-return-v1/test-results.json)、[TCP](../analysis/game-battle-return-v1/network-validation.json)、[验收](../analysis/game-battle-return-v1/validation.json)、[目标审计](../analysis/game-battle-return-v1/goal-audit.json)。

<a id="stage188"></a>

## stage188：退出分支和剩余字节扫描的证据

**事实：** 固定37c4，REA6.7.0/Ghidra12.1.4；2115记录/27新增、648规范函数。6新入口4f4410/4f46f0/4f5c30/502810/502950/50f550，另复查44ab50及重复解析502810内部地址；12段7055B含新561B核原件。C5ec18有15条直接引用；4f3430仅在0分支正常入战，非0走另一路，不能宣称穷尽间接写入。

5029f0/6的counter上限241，row240会经配对索引再次更新238，不能改成240；/7从479倒序画到1，不包含0。原边界padding480不参与已复制行或row241完成谓词。423660/434770扫描原始大写triplet，436cf0在退出处理剩余CHT/BST，不能用解析opcode清单代替。主状态 9 的普通重建归 `501A50` 的对应分支。后续复核已将 `502950` 更正为待选调色的消费入口，`50F550` 继续属于音量状态。**待验证：** 完整普通池/数值/运行时、退出9和14控制及真实运行兼容。[调色复核](#fixed-se-scene-palette-follow)、[源证据](../analysis/game-battle-exit-v1/source-check.json)、[规格](../analysis/game-battle-exit-v1/implementation-spec.json)、[测试](../analysis/game-battle-exit-v1/test-results.json)、[TCP](../analysis/game-battle-exit-v1/network-validation.json)、[验收](../analysis/game-battle-exit-v1/validation.json)、[目标审计](../analysis/game-battle-exit-v1/goal-audit.json)。

<a id="stage187"></a>

## stage187：M执行与退出消费者的静态证据

**事实：** 固定37c4样本、REA6.7.0/Ghidra12.1.4；2088记录/14新增，3新规范函数440570/5029f0/44f3e0，旧439c80/501a50复查，规范总数642。6段10104B原件相符，最终会话已关闭。源437b30的5/6、独立派生4365d0管理器及4260b0命令回调确定绘制、取M、执行和轮次反馈顺序；已有派生证据单独引用，不重新计为规范入口。

7先清mask/stop回调、436cf0排CHT/BST、清22指针、5029b0捕获后落入8；8经505030的12/14渐变，结束才501a10(9,1)、删除/去投影并4f67f0(0)。9则501a30请求主状态7，不能与实际9/1混用。main9由501a50处理，其1请求11，随后仍有等待/场景重建与入场渐变；44f3e0是文字队列，不能推定地图就绪。**待验证：** 完整退出/普通运行时拥有链及渐变实现；本轮没有将这些静态观察写成运行或兼容证明。[源证据](../analysis/game-battle-loop-v1/source-check.json)、[规格](../analysis/game-battle-loop-v1/implementation-spec.json)、[测试](../analysis/game-battle-loop-v1/test-results.json)、[TCP](../analysis/game-battle-loop-v1/network-validation.json)、[验收](../analysis/game-battle-loop-v1/validation.json)、[目标审计](../analysis/game-battle-loop-v1/goal-audit.json)。

<a id="stage186"></a>

## stage186：48b810输入消费者与遗漏回调的离线恢复

**事实：** 固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4；2074记录/159新增，23条新函数记录对应20新规范入口+3旧入口，规范总数639。45段17405B及新read15450B核原件。4374e0目标资格、437080目标编码、48b810输入0..5、48b5b0期限和4899c0/489df0菜单建立/关闭规则已跟进。

原样本含这些代码指针；REA对48a7d0、48b170、48b2e0保留了not_in_procedure结果，独立Ghidra工程中489ea0与这三个选择回调及9个widget回调均需显式定义。补充[原创离线导出脚本](../analysis/game-battle-input-v1/ExportCallbackDossiers.java)，只在可抛弃独立工程内定义这些已知入口，Ghidra12.1.4导出13个派生dossier；4446字节逐指令核原件。这些是显式种子后的派生分析，不计入REA规范入口639。脚本以新绝对输出、固定hash及逗号入口列表为参数；源码/日志/完整伪码私留build，未执行或改写原程序。

窗口26定义表32字节/行、运行widget36字节/行；14定义和初始化指针已核。489ea0按速度更新offset，开闭由速度/menu状态决定。**推导：** 433cd0中C values[0]落0x170数值载体，4374e0读取其有符号值；首个已解析链接为正时422d60创建13b4子对象，完整拥有链尚未实现。$T5一bytes字段及H/G/P/E/N/W|FF从源字符串、生产者和独立字节对端核对。完整窗口/命中/音频、M/退出和真实运行仍未验收。[源证据](../analysis/game-battle-input-v1/source-check.json)、[规格](../analysis/game-battle-input-v1/implementation-spec.json)、[测试](../analysis/game-battle-input-v1/test-results.json)、[TCP](../analysis/game-battle-input-v1/network-validation.json)、[验收](../analysis/game-battle-input-v1/validation.json)、[目标审计](../analysis/game-battle-input-v1/goal-audit.json)。

<a id="stage185"></a>

## stage185：437b30入场顺序与503330逐行渐变

**事实：** 固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4；52新记录、6新规范入口，613→619，复用19完整dossier，20段10668B及5项float常量核原件。40a0c0仅标记池对象删除；433b70清全局槽/管理表并关闭四拍节流。main10 case2先409fe0/419930/506e80，再消费一条C并转3；case3先绘图，再由437890检查前20槽的动态flag1并设置下一次body state2。P的local/control字段已有源消费者，M仅在5消费。

505030(13,8,float2)走503330 case6；480速度/偏移单元按交替镜像初始化，中心行离开[-640,640]后返回运动，完成依赖stored row0==0；本固定输入独立参考为54调用，不是实现中的固定时间。源每行[0,y,640,y+1]由44ce40以trunc(offset[y]),y复制和裁切。客户端实际捕获资源像素并保持该数值推进。

**推导：** 46c6b0的窗口表指针槽由c101bc+84×编号取得，32对应c10c3c、29对应c10b40；4378d0用编号32检查已有入场窗口，非通用modal标记。表算术与证据ID保存在source-tables/source-check，完整窗口生命周期未恢复。

**已实现/待验证：** 部分入场0..4自动调度及真实像素已移植；46c6b0/46c560弹窗、C选择/输入与完整后续M/退出未恢复，所需弹窗没有假句柄。501a10直接写main/substate与501a30单独请求字段不同，留作退出链证据，未宣称退出已完成。原程序、设备和官方兼容仍未验收。[源证据](../analysis/game-battle-entry-v1/source-check.json)、[规格](../analysis/game-battle-entry-v1/implementation-spec.json)、[测试](../analysis/game-battle-entry-v1/test-results.json)、[TCP](../analysis/game-battle-entry-v1/network-validation.json)、[验收](../analysis/game-battle-entry-v1/validation.json)、[目标审计](../analysis/game-battle-entry-v1/goal-audit.json)。

<a id="stage184"></a>

## stage184：419930深度与506e80提交链的证据范围

**事实：** 固定37c4样本、1,569,280B，REA6.7.0/Ghidra12.1.4，本轮33记录、7新规范函数及447330既有函数复查，规范606→613。8段4014B与原PE相符，复用20dossier和重新核验的派生4198d0/96指令B。419930收所有0x20000池对象，包括之后会被隐藏/删除/renderer过滤的对象；比较screenY（0x800000选alternateY）、signed16字段270，完全相等返回+1。409e70 calloc与各构造函数把当前270设0，不是slot。byte(rank+9)会回绕。

506e80先按8000/10000与renderer上下文过滤，再排除graphic-1/deleted==1/hidden bit2；其汇编在ftol前将动画偏移乘对象scale。子效果通过309/310覆盖drawFlags bit4。437a90用真实resource中心320,240捕获背景；5059f0插入priority5复制、6捕获、20鼠标，特殊记录的2不是背景优先级。当前基础frame直接投影同一背景资源，未恢复捕获/渐变生命周期。447330将缩放采样交给DirectDraw/D3D，几何来源不证明跨后端采样一致；当前显式拒绝缩放/混色，未用猜测填充。614390的零为分析内存初始化观察，无文件映射、非运行时色值。

**已实现/待验证：** 基础body/child真实资源frame和client任务已实现，1835独立RGBA帧及422实际TCP帧通过；完整主循环、UI、输入/退出、其他动作/特效和官方兼容仍待实现与验收。[源证据](../analysis/game-battle-scene-v1/source-check.json)、[规格](../analysis/game-battle-scene-v1/implementation-spec.json)、[测试](../analysis/game-battle-scene-v1/test-results.json)、[TCP](../analysis/game-battle-scene-v1/network-validation.json)、[验收](../analysis/game-battle-scene-v1/validation.json)、[目标审计](../analysis/game-battle-scene-v1/goal-audit.json)。

<a id="stage183"></a>

## stage183：实际body完成条件与子回调静态证据

**事实：** 40a120的62225B完整范围经原字节核验，native value flow仍截断。419dd0保存朝向，419ba0用466860/466880与53da08的360个double移动；419fa0伪代码丢失参数/数学，汇编证实差平方和开方后ftol，不能照伪代码当空函数。51b4dc为32位LCG，466a20取区间余数；seed及全应用干扰未从运行时恢复。

420080→420010为浮动message，41f3b0→41f2d0为puff，420220→420370为status，420750→420690为indicator；420570写入4204c0 death回调。后者默认不在函数内，独立静态播种得169指令B，原件一致，不是provider规范入口。420010先比较并用未舍入x87高度更新位置，再分别存float；C最后还会调用一次mode0动画。409fe0在回调后读取next，故同优先级新对象可能当次执行，较早优先级则下一次；删除同样受四拍门控。

本轮74新记录/21新规范/1已知重查，585→606，复用30dossier。17段67476B、360sin和旧65方向值、新169/旧55491派生指令B均绑定原PE；1830记录快照已保存关闭。**待验证：** 原生完整main10、C选择、剩余动作/坐骑/变形、渲染/输入/退出与现行/官方兼容。[证据与边界](../analysis/game-battle-body-v1/source-check.json)。

<a id="stage182"></a>

## stage182：命令生命周期、队列与等待的静态事实

**事实：** 固定37c4、1,569,280B，REA6.7.0/Ghidra12.1.4。436930以recordCount决定下一记录或清除32槽占用位/指针并标记对象删除，逻辑释放与409fe0稍后的原生物理释放分开。4347e0只重置存在、非死亡、type≠13的body；4348e0强制重置。两者不清busy或body type，不能把reset当作动作完成。

434990/4349e0/434a30/434a70为动作写入/插入/弹出/激活；434a90/434af0/434b60为tuple；436a60为value。200单元还要容纳下一项-1哨兵，安全移植限定199条，超出原件将涉及相邻计数器覆盖，安全实现拒绝该分支。434b90从拥有的busy/位置和死亡条件判断等待，counter>7200后为所有依赖body重置并排入11/38，当次仍返回未完成。

复用stage181独立播种的4365d0/4260b0；其边界仍为派生元数据。本轮27新记录/10新规范入口/1已知入口复查、25旧dossier；5段1109B、旧520B方向表及55491派生指令B与原件一致，575→585，记录1756，会话已关闭。source-check保留函数范围、Evidence ID、截断状态及完整私有材料身份。**待验证：** 完整244外层body case、自动main10/画面/输入/退出与现行/官方兼容。[详细证据](../analysis/game-battle-commands-v1/source-check.json)。

<a id="stage181"></a>

## stage181：M字段、依赖与缺失回调

**事实：** 固定旧样本SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`、1,569,280B，REA6.7.0/Ghidra12.1.4。新增48记录/24规范函数，551→575，复用18份旧dossier；9段1944B与原件相符。1729记录/478576202B快照留build，open=false、cleanup_pending=false。 533e54的24指针对应SKL/ESC/CLR/SUP/POS/MON/EQU/ITM/CMB/PSN/ANR/PUE/ACT/CFP/CHT/PNO/PLV/CBC/PDN/REB/BST/GMN/RID/END。434770/434df0从大写首字节拷3字节并+4；434cf0/434670/436bb0为各自游标的大写hex32位读取。4351d0给22字节计数、principal与分组标志；434e60仅在RID variant0且任一两个状态&2时前吞，并使用raw槽。

**推导/边界：** 默认未识别的4365d0/4260b0/4198d0在独立分析副本补建入口，导出682/54685/96B；另435000仍报告28B。四体55491指令字节全部等于原件，属于分析者播种的派生边界，不计入24个规范REA函数。435000另以461B原始范围和LLVM21核对所有非调用分支闭合，未宣称修好provider边界。 任意未初始化/越界原生行为不重现；字节预算及未知token/截断/非法槽显式拒绝。

[源证据](../analysis/game-battle-runtime-v1/source-check.json)、[规格](../analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](../analysis/game-battle-runtime-v1/test-results.json)、[TCP](../analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](../analysis/game-battle-runtime-v1/validation.json)、[完整目标](../analysis/game-battle-runtime-v1/goal-audit.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：main10、C/P/A/M/U及22槽记录

**事实：** 固定37c4样本SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`、1,569,280B，REA6.7.0/Ghidra12.1.4。复用18份旧dossier，新增56记录/28规范函数，523→551；8段5946B与原PE逐字节相符。1681记录/451623812B快照留build；会话已关闭，open=false、cleanup_pending=false。 >HY为receive-00567d94/4f3430的两个int32；?+e为receive-00567c38/4f36d0的bytes。普通入场mode>0置599e0c并重置两环；非正mode不会清除已有pending。4f36d0先按首字节C/P/A分支，再判第二字节U，最后M；四次写会与read索引相等，不能虚构count。433cd0从byte2消费C，20位早退；slot非法归0，重复依次写，普通C结束清未见22槽。433bd0是大写十六进制/32位回绕扫描，非外层base62。

**推导及未决：** 40a120回调62,225B已保留完整伪代码/汇编，但native value flow截断；M管理回调4365d0未被Ghidra识别为函数，1808B原字节及LLVM21静态COFF逐指令核验不构成完整CFG。P/A初始零来自PE .data零填充推导，不是运行时观测。原生越界copy/指针不复现，安全profile限制C/M最多4095B；完整C身体/特效副作用未声称实现。 普通main9的250..252不能仅凭旧错误名解释为战斗。

[源证据](../analysis/game-battle-transition-v1/source-check.json)、[规格](../analysis/game-battle-transition-v1/implementation-spec.json)、[测试](../analysis/game-battle-transition-v1/test-results.json)、[TCP](../analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](../analysis/game-battle-transition-v1/validation.json)、[完整目标](../analysis/game-battle-transition-v1/goal-audit.json)。

**阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：aux04、467060和4f3310源消费者

**事实：** 固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4。复用28份dossier，新增14记录/1规范函数43f2d0，522→523；4段1031B与原PE逐字节相符，复用32B方向表另以PE头核对。614884位于.data零填充尾部，初始化零是推导，非原文件字节或运行时观测。1625记录/387120057B快照留build；会话已关闭、cleanup_pending=false。 43d150+43e210分离aux04与原三个图标；body2ec来自C0旧body2e8对raw value16比较，不是mode变化或强制字节。保留400/4000/8000特殊创建/移除顺序。43f2d0以indexed body DISPLAY、type&28和primary400查邻格，无须邻人leader100。4f3310由Kk0分派，mode1/result1仅OR200，mode0/result1清会员、置mode0、500500并经4f8340发送/Re。

**实现边界/推导：** 零填充初始timer与安全自有handle是明确独立重构，未做原生运行或指针泄漏复现。普通entered-world路径不等于924f30未知modal路径。

[源证据](../analysis/game-party-actions-v1/source-check.json)、[规格](../analysis/game-party-actions-v1/implementation-spec.json)、[测试](../analysis/game-party-actions-v1/test-results.json)、[TCP](../analysis/game-party-actions-v1/network-validation.json)、[验收](../analysis/game-party-actions-v1/validation.json)、[完整目标](../analysis/game-party-actions-v1/goal-audit.json)。

**待验证：** 完整队伍控制/其他快捷键/modal、战斗/宠物/特效/复合转场、其余纠偏/输入/reset/生产启动/资源/玩法、微信原生gamePage和设备、现行及官方兼容仍未完成。无真实测试账号。完整目标active，本轮无VM/CUA/WER/CDB/原程序/账号/官方操作；stage131已执行恢复的诊断不重放。


<a id="stage178"></a>

## stage178：460c40两分支与461f40完整普通门限

**事实：** 固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4；本阶段31新记录、13个函数查询，其中12新规范函数、1次已知461370查询（完整已缓存facet相符），510→522；23旧dossier复用。3段1193B及6端点映射与原件相符。1611记录/386815720B快照留build，会话已关闭并复核open=false、cleanup_pending=false。 460c40先检查ownGate128，再依f5f170/f536b2 leader100选择普通460f20或队员4610f0。4618f0紧凑active+nonnull槽位；461550/4618a0为队长队员，4610f0/461370/43c540/43cb40为本机队员分支。原43ba10仍无Ghidra函数身份，43ba98的原始字节证明primary200跳过43c700；未伪造反编译函数。461f40的4034a0是包裹整数相减，不是对世界坐标直接abs。

**推测/独立边界：** 普通安全逻辑值替代包裹字段与原生对象指针；没有原程序执行/x87逐位观测。重复身体、battle、活跃复合动作明确拒绝；缺身体转移保留显式原因。

[源证据](../analysis/game-party-follow-v1/source-check.json)、[合同](../analysis/game-party-follow-v1/implementation-spec.json)、[测试](../analysis/game-party-follow-v1/test-results.json)、[网络](../analysis/game-party-follow-v1/network-validation.json)、[验收](../analysis/game-party-follow-v1/validation.json)、[完整目标](../analysis/game-party-follow-v1/goal-audit.json)。

**待验证：** 完整队伍UI/加入离开响应、aux04队长/模式图标、战斗/宠物影子/活跃复合转场、其他文字/UI与完整纠偏/输入/reset/生产启动/玩法、微信原生gamePage及设备、现行和官方兼容仍未完成；原生x87与非法重复身体/空指针行为未复现。完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage177"></a>

## stage177：438a30值条、]_g与HFs实际消费者

**事实：** 固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4；30条新记录、11个新规范函数，499→510，23份旧dossier复用；3段1583B及6端点映射与原件相符。1580记录/378372484B快照留build，session已关闭并复查open=false、cleanup_pending=false。 438a30读身体170/180、1b0/1c0，SHL5→signedIDIV→int16；max0不提交该填充，随后提交背景。普通43d150给offset(-10,3)，原值宽不做百分比钳位；59a2d8由4b4170切换、4b5800/5960与profile交换。]_g/receive-00567cf4→4f1240只查440250索引远端；HFs/receive-00567cec→4f07d0为int32槽位+bytes，五行48B，mask0删除，bit0全选。

**推测/实现选择：** pair0/pair1按源地址命名；并未由惯例认定HP/MP语义。安全域拒绝slot越界与IDIV溢出，不模拟原生任意内存或除法陷阱。

**待验证：** 队伍跟随/本机输入上下文同步、aux04队长/模式图标、宠物影子及战斗条源、其他文字/UI、完整纠偏/输入/reset/生产启动与玩法、微信原生gamePage/设备、现行与官方兼容仍未完成。HFs已存状态尚未动态桥接f5f170/f536b2到现有显式输入上下文；完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。

[源证据](../analysis/game-actor-vitals-v1/source-check.json)、[合同](../analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](../analysis/game-actor-vitals-v1/test-results.json)、[网络](../analysis/game-actor-vitals-v1/network-validation.json)、[验收](../analysis/game-actor-vitals-v1/validation.json)、[完整目标](../analysis/game-actor-vitals-v1/goal-audit.json)。


<a id="stage176"></a>

## stage176：43d150姓名分支与实际TextOutA消费者

**事实：** 固定37c4/1,569,280B，REA6.7.0/Ghidra12.1.4：32新记录含12函数查询（11新规范入口、已知505840单列），15份旧dossier复用；规范目录488→499，1550记录及364943731B快照留build，session已关闭。3段1163B和6端点映射与原件相符，其中534598的8字节读取复用旧记录。 43d150按5e2770选择本机f53630/41/52/73或f5eb10[f53628]、远端c4/e1/144/102/123；534598是%s，font1宽度7/14、parentX减半宽及parentY-98进入signed-short文字队列。44f2c0为4096个0x110记录，44f8b0在lane0按插入顺序逐条黑影/前景绘制。538908的font表24字节，538a58颜色是12条3字节RGB；538a7c字面字节cbcecce5与CreateFontA(height14,charset1)已核。

**事实：** Hr]单bytes参数→4f06f0，48×28字节原顺序记录；4fef80/4fefb0只排序另一副本，选中标签仍取原数组。

**推测/实现选择：** 安全域拒绝超过19字节有效目录标签、悬空高位字节和越界索引；独立初始mode0不等于native profile默认。宿主mask的alpha合成是独立重建，非原GDI运行像素证明。

**待验证：** HP/队伍、其他文字通道/聊天/头顶气泡/aux04/菜单、完整本机纠偏/输入/reset/生产启动与中文语义、战斗及其余玩法、微信原生gamePage/设备、现行消费者和官方兼容仍未完成；整体goal active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方操作。

[源证据](../analysis/game-actor-text-v1/source-check.json)、[合同](../analysis/game-actor-text-v1/implementation-spec.json)、[验收](../analysis/game-actor-text-v1/validation.json)、[测试](../analysis/game-actor-text-v1/test-results.json)、[网络](../analysis/game-actor-text-v1/network-validation.json)、[完整目标](../analysis/game-actor-text-v1/goal-audit.json)。


<a id="stage175"></a>

## stage175：43d150状态与图标消费者

**事实：** 固定旧版37c4（1,569,280B），REA6.7.0/Ghidra12.1.4；50条新记录，37次函数查询中36个新规范入口、1个已知45f2f0（伪码与指令相同），规范目录452→488；35份旧dossier复用，2446B原字节及8映射一致，1518记录与358988573B快照留build，session已关闭。 local/unindexed读f536b2/b6/b8；remote读59a34a/59a428/59a42c、stride128。shadow body80000把primary掩码到8400，secondary8/10/40映到1/4/20。45/46/47/48/49/63/64/99 setter及远端40/41/42/44已核对；C0 mode1/default仅在force0时清100。

aux40优先级400→110401、8000→110402、4000→110403；aux0c=110413，aux10=110414。43e210为flags20、动作/朝向0；452e40在unsigned越界时输出origin0。43d150用旧drawOffset-origin算存储屏幕位置，helper后OR4并无条件type1入队，非当前drawOffset再次相加。高度表534224，variant采样前缀534314。

**边界：** 普通回调raw80提前返回，99不能直接推导custom图标可见；仅一条已观察直接xref43bfeb，不排除未知间接调用。43dd96在primary存在且aux0c为空时仍解引用，独立实现给typed unsupported，不宣称观察到原程序崩溃；variant只支持已提取0..15前缀，不声称完整原表长度。[源证据](../analysis/game-actor-presentation-v1/source-check.json)、[合同](../analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](../analysis/game-actor-presentation-v1/validation.json)、[测试](../analysis/game-actor-presentation-v1/test-results.json)、[网络](../analysis/game-actor-presentation-v1/network-validation.json)。

姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：aux34附属尾段与普通钩子的静态闭合

**事实：** 样本1569280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4/profile7810ea94…18cb。20份dossier复用、0重复新函数；3段223字节与6首尾文件映射逐字节一致，另有1条retained view，总记录1468。182768721B导出、355301746B快照只留build，session已关闭。[证据ID、文件范围与SHA](../analysis/game-actor-attachment-v1/source-check.json)。

43bfeb的原CALL字节指向43d150。其入口取身体+2f0/+2f4，并加aux38坐骑的当前AP。43e14d尾段读取aux34：身体action8时附属action3，否则0；复制身体朝向，调用4fd0d0(100,0,0)，非零返回跳过队列。返回0才把身体未偏移屏幕+上述AP+附属drawOffset挂入462fc0的type1链。附属自身事件坐标仍为构造时的0/0。

43ba10的状态1/2/3早返跳过43d150；重复图形路径仍以根-1到达钩子，离屏移除直接返回。source60的归一化/构造/复用/移除与438bc0/40a090事实沿用已证函数。

**推测/待验证：** 本轮只闭合60尾段，不把43d150其他姓名/状态/队伍分支算作已实现。原生分配器、静态aux34/38零谓词的运行后果、完整x87/溢出、现行9baa/6e2ff与官方兼容仍未证。


<a id="stage173"></a>

## stage173：70号骑乘与子对象的静态闭合

**事实：** 固定1569280B `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0/Ghidra12.1.4/profile7810ea94…18cb。本轮3份新函数5013b0/438bc0/40a090，复用24份既有dossier；另读52d91c的4字节并核对首尾原文件映射。6新记录/1458总记录，452个固定样本规范入口；182726961B导出与355259986B快照只留build，session已关闭。[ID、范围、hash和事实](../analysis/game-actor-ride-v1/source-check.json)。

4ffe10/43e610 case70以参数1正负区分进入/退出。本机重复state2不重启，远端重置计数。坐骑aux38归一化资源，人物从正常资源经5013b0映射，进入state1。439080先投影屏幕，再调用43c700移动，根深度取更新后位置并加原float32 epsilon。插值用上一次AP，进入完成比较本次AP；退出首帧快进仍以原计数算X，声音463不是无条件的收包事件。

439a70映射人物/子动作；普通回调的同一mode传给坐骑。462fc0将type1挂在+2c链、type0挂在+30链，463120按type1、人物、type0提交，底层同优先级逆序覆盖。40a090只设删除标记。438bc0虽反编译为void，汇编EAX实际保留分配指针；这里只证明60的构造，尚不代表附属绘制完成。

**推测/待验证：** 4ff430对aux34/38的零谓词异常已核对汇编，尚无执行证据证明泄漏。独立实现释放自有对象；完整原生分配器、x87/溢出、其余消费者及当前9baa/6e2ff等价性不作推定。


<a id="stage172"></a>
## stage172：动作80与439080状态3的静态证据

**事实：** 样本1569280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4/profile7810ea94…18cb。复用28份既有dossier，26新记录为4 read_bytes/4 file-offset/18指令，全部与原PE相符，没有重做449个已知入口。最终1452记录、181774650B导出、353371441B快照只留build，session关闭。[地址、Evidence与hash](../analysis/game-actor-spin-v1/source-check.json)。

4ffe10本机/43e610远端的case80设body+2c=3、归一化参数1写body+2a8、辅助+3c=0；不写正常f536a0/远端正常记录资源，不消费参数2或包坐标/朝向。439080计数0..360用action3、保存首帧身体朝向，按八向角表和52d908..52d927浮点常量计算旋转屏幕偏移。超过360先action4/mode1；返回1清状态/计数并改action0，随后仍执行mode0，最后计数加1，因此成功结束留counter1。

特殊回调使用无偏移的截断身体投影作为事件坐标，绘制投影另加0.5截断与旋转偏移；462cc0使用真实逻辑深度坐标，local也无普通flag1。43ba10收到439080非零立即退出，故不执行普通远端运动、范围/去重及local flag。461660/4ff5a0仍同步本机运动；462110/462410的真正朝向写入与4ff700相关，462410比较body+2b8。正常资源/朝向用于4ff160场景重建，不能从旋转身体反推。[完整有限合同](../analysis/game-actor-spin-v1/implementation-spec.json)。

**待验证：** x87位级同一性、原生溢出/越界行为、state1/2及骑乘/子对象、全部上下文生产者和现行9baa/6e2ff未闭合。43ba10仍无provider procedure，复用旧精确回调反汇编，不猜边界；静态证据不代表原程序执行。


<a id="stage171"></a>
## stage171：类别、逐实体标志与普通图形物件的源证据

**事实：** 样本1569280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4/profile7810ea94…18cb。复用28份dossier，新分析440850、440860、4fdb40、403580，新增79记录，74项原字节/映射/表与59a2dc数据xref通过。总1426记录；181651183B导出与353247974B快照仅留build，provider已关闭。[Evidence、偏移与校验](../analysis/game-actor-context-v1/source-check.json)。43ba10仍是provider procedure之外的已解码回调，复用旧objdump，不猜边界。

43f380参数13来自C0列1；4f19f8尚未弹出的归一化参数使远端4f1baa的ESP+20对应旧ESP+1c，而本机4f1a0c已清该槽。4401b0的类别1→8、6/13/27→17、32→33、71→257，其余→1；注册后类型不随刷新重写。440180的1/32→0x100、3→0x200，其余→0x1000；43f380在value7同时含0x100/0x40时再加0x400000。43fcd0图形物件type2、43fef0数值物件type4，均保留draw/body0x400投影。[地面记录复核](#stage221-ground-pickup)。43c000初始body0x34，本机4ff3b0再加0x80。value8写低16位，flag11/12写record+42的0x40/0x80。

构造朝向条件是类别>3、957e88=0且4fdb40不命中100000≤资源<200000。957e88由场景wire8经4ef870/45f2a0/4649b0写入，45eef0显式准备设0；声音条件另读f5f17c。43ba10的body0x400普通分支在本机逻辑X/Y±16之外移除非本机对象，边界保留。440860按当前graphicIndex/X/Y去重，只存100项；第101个未存键的再次出现也不抑制。501a50 case3先440850清计数再调用409fe0。[有限合同](../analysis/game-actor-context-v1/implementation-spec.json)。

**派生与待验证：** 独立实现只绑定已证字段/掩码与普通图形过滤，逻辑坐标不重建封装物理存储。完整门控/party/special/frozen/child生产者、原生全UI和当前9baa/6e2ff继续未证；静态函数及原创对端结果不代表原程序或官服运行。


<a id="stage170"></a>
## stage170：本机构造参数与等待位的源证据

**事实：** 样本为1569280B、SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4/profile7810ea94…18cb。31份既有dossier、69新增记录中含4034d0一个新入口；57项字节/映射与7数据xref通过。最终1347记录、181124775B导出和352542560B快照仅留build，provider已关闭。[身份、Evidence与偏移](../analysis/game-local-bootstrap-v1/source-check.json)。

`4ff160`在4ff174先PUSH朝向，再以ECX=96b9e0/96b9c8调用无栈参数getter4034d0，把Y、X结果与f536a0资源压栈后于4ff191调用4ff3b0。反编译显示的getter“参数”实际是为后续构造准备的栈槽；没有把它当角色身份。43c000将资源写actor+2a8、朝向写+2b8。身份来自@Qu→4f2bb0→4ff570的f536a8，所选外观则是f536a4；4ef840→4ff700另证ac为朝向。

5015a0 main5→45eef0设922c4c=3，4ff080已知raw范围清理后将ac设-1；main9→501a50 case100经4ff160构造，101等待位为0。4f16d0已有本机对象分支只调4ff510(resource,currentFacing)，不把C0行坐标覆盖当前源坐标，并清bit1；4ef510地图成功/4ef580补丁处理清bit0。主9 ready场景条件下4ef870→4ff430释放本机，后续4ff160从全局重建。[完整有限合同](../analysis/game-local-bootstrap-v1/implementation-spec.json)。

**待验证：** callback43ba10有83ec14指令及43c03a DATA引用，provider却没有procedure，故复用旧objdump片段而不伪造函数边界。封装数值的物理存储、完整raw reset、party/child/UI/模态条件及现行9baa/6e2ff仍未恢复；本轮静态观察不代表原程序运行结果。


<a id="stage169"></a>
## stage169：主9初始化片段与运行上下文边界

**事实：** 固定cg_se_6000.exe为1569280B、SHA256`37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4，profile`7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb`。1278记录中新增42/6新函数/18指令+18映射；7主dossier复用。原PE检查36项相符，快照350369862B保存、会话关闭。[地址/Evidence/hash](../analysis/game-browser-owner-v1/source-check.json)。

**事实：** 5015a0 case9在50185a调用501a50。后者sub0置100并清部分flags；100依次调用4ff160、44e7d0、4405a0、4b9a10、4ea1b0、439c80、4fe580、445220后置101，101等922c4c为0再转104。普通case20经5028a0后进3，3执行既有逻辑/UI/绘制路径；还有多种modal/战斗分支，不能将runtimeStage任意默认为0。

**事实：** 4ff160读state4f0000的f536a0/f536ac等，经已知4ff3b0/4ff750处理本机对象/标签与关联槽；没有把人物field15直接认作world actorID，也未为反编译未恢复的参数补零。4405a0遍历0x128B记录并物化对象/标签；4fe580扫描记录并写614634/c1ec14；44e7d0清614888，44e7e0清614628/6145e8并调用466a80；5028a0重置绘制相关状态并写728368计时槽。以上是静态调用/赋值，不是执行观察或完整上下文证明。

**派生实现/待验证：** portable client按已证world投影和实际地块数据决定宿主就绪，非原生922c4c的等价替代。地块补丁OR0xc000沿既有world合同，要求本机格bit0x4000是明确宿主策略。完整原生对象构造、UI/party/profile等producer仍未绑定，runtime/actor/input/movement取显式验证配置。固定网页与原对端验收不推当前9baa/6e2ff/官方可玩。[合同](../analysis/game-browser-owner-v1/implementation-spec.json)、[验收](validation.md#stage169)。


<a id="stage168"></a>
## stage168：角色选项、main13升级和main5单字段同址

**事实：** 固定cg_se_6000.exe为1569280B，SHA256`37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4，profile`7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb`。复用12主dossier，新增111记录/25规范入口，82字节/映射检查相符。1236完整记录与347002042B纠正快照保留且会话关闭；不将旧37c4推为现行9baa/6e2ff。[Evidence/偏移/hash](../analysis/game-character-options-v1/source-check.json)。

**事实：** 458900 action3..6与4593b0门槛对应148B记录+24(field2)、+36临时分类、+80(field17)。类别低8位>4才有选项；3/4要求variant0/1或类别>6，5/6仅variant0/1。3/4跳过33100/33101，依旧/新两类算法调用500e90/500dd0/5012d0/501200，不再运行预览；5/6均0↔1再4586f0，可最终变为2。四换算与边界见[合同](../analysis/game-character-options-v1/implementation-spec.json)。

**事实及纠错：** 0x45874c→文件359244，字节`c787f8e9f5004c810000`实际写0x814c=33100；旧33000换算与参考错误已纠正24条。501200的14项stack逆表与外层包含242800的分类不一致，实际访问index14或任意保留分类导致越界时，独立实现拒绝。这里只是静态范围事实，未动态观察原程序崩溃。

**事实：** 5015a0 main13依内容代际调用455f90/459bc0，固定文案识别为版本升级。4f8880发送5[B(kind,marker)：gen2类0/2为2+abcdefg，gen3/4类0/2为2+20031229_20，类5/6为4+20031229_30。WDM→4f4a80取AL，只main13写success100/failure200；没有源deadline或共享登录ack。成功对话确认回main3sub0重查询；失败确认phase1可重试。类别7的kind5需要923c40运行字节，已知reader459c14，生产者仍待验证；gen1可显示入口但phase2停滞，独立实现明确禁止该请求。

**事实/待验证：** main5→4ff080将selected appearance ef582c写f536a4，同址为state4f0000/field16，故只绑定此字段。18个直接callee与两个profile getter显示UI/IME、chat文件、移动默认值、player raw记录、profile和mail/guildmail等副作用；嵌套初始化、wrapped存储、全部UI/runtime上下文仍未闭合，不照搬全量清零或推定actorID。[验收](validation.md#stage168)。


<a id="stage167"></a>
## stage167：main4创建消费者与固定删除等待分支

**事实：** 旧`cg_se_6000.exe`1569280B，SHA256`37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0/Ghidra12.1.4。1044旧记录保持，新81记录/21唯一函数、10主dossier复用，60字节/映射与原PE相符，最终1125记录/快照保存并关闭。内地址4ef4a0由provider规范为4ef480，已有4f8a40分发证实该消费者。[具体Evidence/偏移/hash](../analysis/game-character-lifecycle-v1/source-check.json)。

**事实：** main3空槽action0→main4/459f30，45a0f0默认family=category>4，45a1a0提供14造型/四配色；45a8a0清名称、五项30点/四项10点及细节，45a970处理单步和确认。默认CRT名称过滤、两种多字节跳过规则、精确重名、raw空格/8140/a140/[GP]已核对。53c1e4的28资源值与52d9b0的56数值表已与原文件比对；500dd0/501200用于两外观数值，未赋预览像素含义。

**事实：** 456370/456390先本地profile重置/写入，再4ef3a0→4f8460发/qW的13字段。U_s→4ef480仅ack1接受精确successful，写selected字段15与mode0→0/非零mode→1的字段17；4ef430先ack2再600001ms。成功main3sub0重取列表；拒绝/超时经main4错误对话回main3sub10，连接仍在。独立实现未写profile.dat，不把返回字段15当world actorID。

**事实/未决：** 删除确认字符串与458900 sub12..14对应455810/455820；455820完整体绘制等待窗并恒return0，已观察调用者非零成功/错误分支缺少可达返回依据；catalog中V)b为507690 no-op。此结论仅覆盖固定分支，不推及其他构建。删除发送/look/aux、完整UI/reset/preview、locale变化、current/官方仍未知。[合同](../analysis/game-character-lifecycle-v1/implementation-spec.json)、[验收](validation.md#stage167)。


<a id="stage166"></a>
## stage166：主阶段3人物记录与主阶段5/6入场消费者

**事实：** 固定旧版`cg_se_6000.exe` SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，1569280B，REA6.7.0/Ghidra12.1.4。955旧记录保留，新增89条，其中28次dossier只含27新入口（5111a0重复一次）；17份旧结果复用，60字节/映射与原PE相符。最终1044记录/快照保存且provider关闭。[证据与hash](../analysis/game-post-login-v1/source-check.json)。

**事实：** 5015a0 main3→458900，455910/455920→4eed10发送无参1?v并清两份148B记录。VK0→4eef20仅接ack1，完整status0经500630消费前四个外层字段：名称/转义记录各两组，每字段上限1023B。5111a0/511000反转义后510e50读取字段；槽非0/1忽略，重复槽后者覆盖，名称>16B改为???。非零status的精确OUTOFSERVICE→poll-3，其他失败-2，未答复elapsed≥600001→-1；ack2先于超时。源子阶段0/1/9/10/11保留。

**事实：** Wb^→4f4a70仅写AL，后续unsigned比较。4544e0按3c39f/3bd9f/5727/56c4/55f2探测resource→index，第一个非零索引给4..0代际，无则-1；索引0不算命中。category1绕过本内容门槛，其他按源四组阈值判断，aux选择位在sub9锁存。4586f0对现有记录先将field2<30000修为33100，再以5012d0(500e90)规范code，并按区间修field17；仅复制此分配对象前的数值行为，不声称人物预览像素已实现。实际641666条元数据探测为generation4，不证明当前执行文件与旧源等价。

**事实/边界：** 458900选择现有人物后main5→main6/456520/456650→4ef060发送0X@，参数是field15@76、field17@80、field2@24，不发送槽号/名字。V?S→4ef130只在ack1接受精确C串successful；4ef0c0先看连接，再ack2，最后600001ms超时；成功请求main9。完整main5 UI/global reset、创建/删除/look/aux、预览对象/回调、后续业务/current/官方仍未恢复。首次空world是独立宿主政策，field15的actorID语义未证。[合同](../analysis/game-post-login-v1/implementation-spec.json)、[验收](validation.md#stage166)。


<a id="stage165"></a>
## stage165：旧版登录发送、回复及后续轮询

**事实：** 固定旧版`cg_se_6000.exe` SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0/Ghidra12.1.4。913旧记录完整保留，新增42条/10新函数，11份dossier复用，30字节/映射检查全部与原PE相符。457c30的CGSharedMem按首个gid:/glt:子串及%s读取；505610写f62d87、505670写f62dba，再由505640/5056a0分别复制到d1d534/d5d6b4。4eeb22/27/2c三处PUSH与4f83d0 serializer交叉核对，字段顺序为d5d674模块摘要、glt、gid。[证据](../analysis/game-session-runtime-v1/source-check.json)。

**事实：** 505540调用404c40读取本执行文件，再404d30把16B格式化为32小写hex，失败产生空串。404150/4041a0只补初始化/收尾观察，404c40的恢复签名/循环变量有反编译局限；完整update/transform未分析，不能声称已实现完整文件摘要生产。4eec00仅在ackState1处理UJt，将ack置2并保存低16状态字；完整int32 status0才置成功，非零且C字符串恰为busy时改字1234。成功detail首个|之前写128B缓冲，405620后续作用未知。4ee730成功后进82、逐次到99，再返回1；455500先判断返回1，再检查20001ms外层期限，内部另有600001ms。主阶段跳3；未把其命名为游戏可玩/角色阶段。

**独立实现/待验证：** 新模型拒绝NUL缺失、超过50B字段及成功前缀超过127B等原生不安全情况，保留字节语义/uint32时钟。stream宿主是明确拥有/借用政策，连接底层0..70以成功连接边界替代；不模拟未证OS轮询。full digest、aux/时间全局副作用、下一阶段、current票据绑定/消费者和官方认证仍未知。4f6440只证独立UI/effect调用，不作认证推断。无样本执行，REA已关闭。[合同](../analysis/game-session-runtime-v1/implementation-spec.json)、[目标](../analysis/game-session-runtime-v1/goal-audit.json)。


<a id="stage164"></a>
## stage164：资源文件与真正呈现时的按需加载

**事实：** 仅绑定1569280B、SHA256 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd。REA6.7.0/Ghidra12.1.4，新34记录/3dossier（2新入口）、31原字节/映射核对，20旧dossier复用，913记录/快照已关闭。[偏移/证据ID](../analysis/game-resource-runtime-v1/source-check.json)、[路径表](../analysis/game-resource-runtime-v1/resource-path-catalog.json)。535d10零字节读没有确认的资源意义，未据此推断运行时缺失；507d70是音频启动，44b610是非透明像素平均色消费者，未错作资源所有者。

45cfd0/44eba0：Bin、%s\%s、%d及七组128B默认名字；V2拼写graphicbiv2x和graphicbinv2为两次查找，正常分支后写覆盖。Crd的*3在参数处理后复制组3最终路径，AP加载按重复路径共享句柄。452460对图形archive/index的0/3/6组为必需；453720动画第一组必需。453030按GraphicInfo的group/offset/length读取RD。4649b0/45f2a0/4ef870的CUT选择已在scene.resolvedSelector表达，实际路径硬编码bin/PUK2/cutdat/%d.cut，不随binfolder更改。

506030在选中呈现后调用5074d0/505d70，后者才通过453030/511470解码并经449c80或447b10上传。故frame可先保留数值队列，异步I/O不必重播逻辑。中性上下文中，无embedded且无flag4使用当前CGP（168置黑、零色透明）；flag4改用原始CGP快照和显式黑色1替代；embedded BGR也走显式黑色1。动态LUT/UI全局未闭合，库要求明确paletteMode=neutral，不默认为全状态兼容。

**待验证：** 完整登录页→游戏接线、微信游戏Canvas与原生文件/调度、真实runtime/record/UI上下文、动态LUT/命名调色板/效果、骑乘组队/primitive/小地图、战斗/其余业务及认证、现行与实际三端/官方可玩仍未完成。旧版37c4源码与当前安装资源能按格式组合验证，不构成9baa/6e2ff消费者或官方接受证明。 实际资源语料属于既有安装内容，不据读取成功推定与37c4执行文件同版本。本轮无原程序执行。

<a id="stage163"></a>
## stage163：输入、逆投影、正常帧时钟

**事实：** 本轮只绑定SHA256 37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd（1569280B）。REA6.7.0/Ghidra12.1.4，新96记录/23唯一函数，53字节映射相符，另2个BSS数据观察不声称文件字节核验；879记录和快照保存，session open=false/cleanup_pending=false。[原件位置、文件偏移与证据ID](../analysis/game-input-runtime-v1/source-check.json)。

463dc0：逆投影比例52dd94=abaaaa3f，输出float32，中间乘积不强制fround。4665b0的反编译漏去两次ftol前的double0.5，已以汇编和52d920原字核对；+32后用有符号C截断/64，screenY<456。原始down/up/double-down位为1/4/17和2/8/34，快速按下再抬起仍保留press。460c40含250ms unsigned比较、500ms长按进入自动行走，抬起不取消、下次press取消；4eceb0只改cursor，不是发包。44fb60正常period/lag均为16.666666666666668，逻辑与边沿清除先于skip，19次skip后必须呈现，呈现先于严格now>deadline等待。forced分支可在graphicsMode0呈现，且不把mode1改2。

**更正/待验证：** 450640/451a80是heartbeat/calendar；405510涉及完整性检查，只观察正常计时常量，不重实现原保护/系统检查。原WndProc、UI和右键业务选择仍未闭合；一次采样tick不声称复刻原多次GetTickCount调用或x87逐bit结果。**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

完整资源与原生 runtime/record/UI 上下文绑定、右键交互、小地图/primitive/特殊角色/特效、战斗/其余业务及认证、现行版本、实际三端与官方可玩仍未完成。旧版37c4不等同9baa/6e2ff；本轮没有VM、WER、CDB、账号、官服或原生IDE新操作，也未重放已消费停止点。

<a id="stage162"></a>
## stage162：CUT、地图物件和场景合并的静态证据

**事实（固定样本）：** 旧SE `cg_se_6000.exe`，1,569,280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4，profile `7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb`。新39记录/14唯一dossier、13解码指令、5xref、3读取/3映射、1新增resolve；19字节/映射相符，744旧记录保留，783记录/快照存盘并关闭。完整278B比较器463240与CUT/AUT格式路径原字节已核对；复用22个既有函数分析。507200是已保留的非procedure比较器，未重跑函数分析；本轮一次本地误按函数查找无结果，改读已保留506030真实消费者。[核验](../analysis/game-legacy-scene-frame-v1/source-check.json)。

**事实：** 464a30读CUT头12B，+6/+8/+10三个signed16计数之和决定记录数；每条fread为4B＋七个2B，共18B，存储步长20。464b90清12＋50000×20B并把未填kind设FFFF。文件头观察为`CUT `及headerSize12，原生loader自身未验证magic/短读；独立目录严格检查已知头/长度/50000上限。记录为resource32、kind16、clip四个signed16、anchor两个signed16。464bc0读取AUT最多477603B；463780/4636a0消费小地图颜色，未作为地图tile替换实现。

**事实：** 45f1c0以原生格中心计算X[-30,+21)、Y[-20,+31)，45f250裁到地图；不同于碰撞窗口。45ff20取project(0,0)向零截断，不加actor的0.5。463ea0按x−y递增的对角线遍历，普通地形priority5，resource5000..5009为1；普通负边界含−32/−24，atlas含−64/−48，右/下均小于672/504。mode1按CUT切片，object kind0静态、1动画、其他忽略；ground不按object kind分支。

**事实：** 462db0把声明ID1送actor根，rawFlags/100==3送尾队列，其余正常物件；三队列各1024，合并最多3072。463240对1×1/声明ID1用worldX−worldY，其他还用世界交叉位置、signed16屏幕坐标与24×(1−占地宽高)。463410按相邻同世界坐标根成组消费，只过滤actor队列声明ID1，最后追加type3。464d80首次只创建动画物件；464cc0后续一次helper，忽略动画帧XY偏移，投影＋创建锚点再走图像原点；464f20直接入正常物件队列，不能套用静态type3/ID1路由。

**实现/待验证：** 普通场景与506030源矩形裁剪已独立重建并接world，341CUT/401103数值相符；来源包资源格式相符不证明版本等同。小地图/primitive/特殊效果、输入/时钟/资源宿主、战斗/认证、现行9baa/6e2ff消费者及真实平台/官方仍未完成。[合同](../analysis/game-legacy-scene-frame-v1/implementation-spec.json)、[回执](../analysis/game-legacy-scene-frame-v1/test-results.json)。

<a id="stage161"></a>
## stage161：普通回调、创建顺序与深度排序证据

**事实：** 样本仍为旧SE `cg_se_6000.exe`，1,569,280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4，profile `7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb`。新增31记录/9唯一dossier，14字节/映射核对、完整43ba10回调1520B复核，最终744记录及快照已关闭。957e98不可解码、957e88/58f6ac为数据观察，不算新指令或函数。[可复核证据](../analysis/game-legacy-frame-v1/source-check.json)。

**事实：** 409dd0建优先级0/255哨兵，409e70同层插在首个更大优先级之前，普通body level2因此按创建FIFO；分配器actor+20明确−1。409fe0遇bodyFlags&40000且global sparseMode=1、phase非0时跳过回调，phase模4递增。43ba10的stage250..252、ownGateByte&80或indexed recordGateFlags&80000000继续阻止普通处理；439080特殊状态0才进入本次普通切面。motion-suppressed记录&02000000按movementScale>=1.2f/1.6f额外调用，否则按出队后的queueLength>=2/4；helper percent100。sceneMode来自已有scene.fields[8]，冻结与声音上下文仍显式提供。

**事实：** 462cc0创建52B根记录，上限1024；463380先比worldX−worldY，同XY有own flag分支，最后比创建ordinal，比较器非自反，不能以JS稳定排序替代。移植51c1a2分区、51c2f6短段选择排序与51c344交换，短段阈值8、栈30。453000读取runtime+28，来自GraphicInfo文件+36声明resource ID；463410排序后跳过ID=1。完整地形/物件合并消费者463410仍未实现。投影先源float32输出，再double0.5偏置、向零截断。

**待验证：** indexed record位域的完整来源、特殊状态/ride/party/child/culling、地形物件合并、实际输入与资源宿主、战斗/业务/认证及现行样本。旧37c4结果不外推9baa或6e2ff。[常量目录](../analysis/game-legacy-frame-v1/frame-catalog.json)、[合同](../analysis/game-legacy-frame-v1/implementation-spec.json)。

<a id="stage160"></a>
## stage160：动画记录、helper时序与实际原点回加

**事实/身份：** fixed37c4 SE，1,569,280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4/profile7810ea94…180cb。658旧记录完整保留，新55含20dossier/19唯一，26字节/映射匹配，4数据观察；保存713导出/新快照并关闭。旧43ba10不是Ghidra函数，复用bounded GNU并逐段匹配完整1520B；新4531c0亦无procedure，仅32B原件与GNU说明unsigned升序比较，不制造函数边界。[核验](../analysis/game-legacy-animation-v1/source-check.json)。

**事实：** 453720读12B index（ID32/offset32/actionCount16/version16），ID−100000，临时唯一表10000、runtime20500、7组；后记录覆盖，version>1归0。4533c0每action读12或20B：direction16/action16/duration32/frameCount32，extended另selector16/flags16/color32；运行action24B，period为duration/(frames<<4)，非空不足1取1。frame10B转12B，graphic32加group graphicBase，x/y signed16，event16。AP index version1＋10B记录，data每项8B，先匹配graphic；runtime group决定数据文件，首个同graphic偏移生效。

**事实：** 4fd0d0以resource/action/facing变化复位last、nextFrame、delay、cycles；actor+2b4是cached action，非时间phase。freeze==1不改mode；delay非0减一即回，period先int32乘再unsigned/100，出帧后再减1。mode1末尾delay255/cycles1返回1，其余循环；空action加载失败−1，空frame非once原程序会越界，不伪造一帧。event1..9999为声音（scene9且flags&80200抑制），>=10000写signal，均只作描述符。4fd5f0另读actor+2a4 percent，独立player明确模拟4fd0d0参数版本。

**事实/推导：** Frame offset与图形原点相加，flip变−(actualRD维度＋offset)，AP坐标翻转仅取负。4fdaf0先减origin；462fc0→463120普通分支进506d50再加回origin，priority10、graphicIndex<1000不入队。因此普通单精灵RGBA用drawOffset。新imageAt给ordinal descriptor，actualRD尺寸由caller解码提供。完整layer排序/合并463230/463360/463410已观察但不冒充单sprite adapter已实现。[目录](../analysis/game-legacy-animation-v1/animation-catalog.json)。

**待验证：** callback各条件/多次helper调度、party/ride/scene与same-action wire restart/lifecycle、named palette、全部特效/audio执行、实际resource/input/frame host、战斗/其他业务/auth及当前版本/三端/官方可玩。数值metadata和原创像素比较不是原程序视觉或版本等价证据。


<a id="stage159"></a>
## stage159：实际图像加载、RD、CGP与native32绘制链

**事实/身份：** 固定1,569,280B旧版37c4 SE，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4/profile7810ea94…180cb。566旧记录完整保留，新92含36唯一dossier，49字节/映射核对；658完整导出及新快照保存，REA关闭。2数据观察和4499a5非边界未冒充指令；507200未定义procedure，用完整48B及独立GNU disassembly闭合比较器，不修改分析数据库。[源核对](../analysis/game-legacy-render-v1/source-check.json)。

**事实：** 453030按runtime group/file offset/byte length读Graphic，再交511470。flag bit1压缩、bit2 palette/20B头，其他位忽略；raw无视word12，compressed仅到word12；literal0..7忽略20/40位、fill8..B读值而C..F零填，20优先双扩展/否则10单扩展，允许零run。源无output精确边界，安全实现拒绝过/不足展开。507230把width上调4，4497c0/449a10从(height−1−tileY)*stride+tileX开始逐行减stride；只在4对齐/正short cache尺寸域做可证绘制。

449cf0用literal32色保留首尾16、fgetc BGR填16..239（672B），先snapshot再置current168为黑。默认32表以00RRGGBB写611ec8，零时实际写入16bit表614148（44a293/44a29b原字节核对），不能套用显式palette的黑色→1规则。447b10显式32保护零、entry0清0；partial尾部不能把旧scratch读取当已知颜色。4468b0的surface key range等于调用第三参0；446e00翻转/viewport使用signed16位置。507200按priority unsignedbyte升序，同值signed16 ordinal降序。[字段/常量](../analysis/game-legacy-render-v1/render-catalog.json)。

**推导/待验证：** 独立RGBA软件投影覆盖普通完整sprite，对当前资源只作格式/摘要比较，未运行原游戏或证明现行等价。native16/24、D3D采样/混色、scale/crop/special commands/night/fade、动画与actor/scene资源绑定及真实host仍未闭合；449cf0全value-flow截断、上传函数formal参数错误以原汇编限制结论。完整业务/战斗/auth、实际三端与官方可玩未完成。


<a id="stage158"></a>
## stage158：碰撞、图形元数据、原生路径与本机帧

**事实/来源：** 固定37c4 SE SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，1,569,280B；REA6.7.0/Ghidra12.1.4/profile7810ea94…180cb。449记录上新增117/52唯一函数；52指令/32B读取/1映射共54源检查匹配，5data/undecodable引用只作引用元数据，不当零内存；新快照/导出566记录保存并关闭。[核验器](../analysis/game-legacy-local-movement-v1/verify_source.py)、[回执](../analysis/game-legacy-local-movement-v1/source-check.json)。

**事实：** 4607c0只把window内cell1当阻挡，外部true；4648f0 mode1取第三层0x100，mode0的4603a0按ground/object的primitive与资源class、向北/右footprint、cell2 override、empty/低byte1最终分支生成。45f1c0窗口[x−30,y−20,x+21,y+31]经45f250裁剪。452460把7份40B GraphicInfo转32B runtime：原+28/+29占格、+30ushort%100 class、+36资源ID，group base按既读record数；450100容量850000，文件总record+10须严格小于容量。四conditional ID alias有源；463e60使primitive<20000原值、20000..65535加200000。[字段/常量目录](../analysis/game-legacy-local-movement-v1/navigation-catalog.json)。

**事实：** 462650采用初始方向±1限制、候选0/+1/−1、奇方向corner及462520正交合并，再xy fallback；不是A*。same-point清finalFacing但保留旧route，outer到100未到goal清route，fallback无原生容量保护（独立拒绝危险域）。461b30每批2步；462110/461660本机float32速度/坐标、到达更新grid、下一帧idle；4ff5a0只回滚blocked display而保留scaled/target。460820在满51window扫leading23项第三层原word0，最多2矩形请求后等待；463ea0刷新完整后才清wait。低byte2停在地块前，3/9/10/11/13及6/7/8 selector分支停后，再发4f6530；turn使用大写byte+65、严格unsigned last+500<now。[完整合同](../analysis/game-legacy-local-movement-v1/implementation-spec.json)。

**推导/待验证：** source context必须显式绑定，测试为原创合成普通值，不把gates/selector/序号推为认证或wire字段。wrapped存储、x87逐位、全场景本机生命周期、party/骑乘/附件、正arrival counter/UI/audio/响应、实际renderer/战斗/其他业务/auth、现行9baa/6e2ff和三端/官方可玩仍未闭合。463ea0完整value-flow已标截断，仅读源collision/wait调用链，不扩大为渲染完成。

<a id="stage157"></a>
## stage157：实体、移动、方向与资源ID消费者

**事实/来源：** 固定SE6000原件SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，1,569,280B；REA6.7.0/Ghidra12.1.4、profile7810ea94…180cb。复用340记录，新增109记录/48dossier/47唯一函数；56指令/读/映射检查匹配PE。4ff560选中已有4ff510，随后provider-resolve到实际setter4ff570；保留此重复，不计成两个唯一函数。43ba10无Ghidra函数，现有GNU2.47.20260726范围反汇编与REA1520B核对484指令/479可达，call之外控制流在范围内。[源核验](../analysis/game-legacy-actors-v1/source-check.json)。

**事实：** f5e8dc创建/销毁与f536a8唯一setter闭合本机指针/ID。4f2bb0四整数首项own ID；4f16d0三种tab记录，2047B前缀及127/255/1023B子字段，高字节对/inner语法沿源。character字段13解析但此消费者不使用；本机字段7/标签写state-A15/29/30。4f2010→4ffe10/43e610，action列4/facing列5，ordinary action1排目标并设置速度；本机-1→100、其他负值不使用masked-state非正clamp。4ff720动画1不重置相位。移除440280及场景440450远端清理闭合；local scene guard尚未模拟。[目录](../analysis/game-legacy-actors-v1/actor-catalog.json)、[合同](../analysis/game-legacy-actors-v1/implementation-spec.json)。

**事实/限制：** 43c1b0队列10溢出清队列并teleport；43c360按队列长度取1/1.2f/1.6f/2、速度百分比和×4，43c700逐步/snap并下一tick idle。463d30/4668a0使用65项double角度表、float32 spill及112.5偏移；463d70投影32/24、native默认中心320/240，host中心显式。500a70/b00/c40是有序资源级别/替换范围，运行模式未知时不猜。461b70→462c80把路径byte加0x61并经4f2c10发送origin/方向串/scene字段11。原生x87逐位、frame调度、碰撞路径/本机预测、party/ride/附件/条件flags、资源像素/绘制/战斗和其他业务仍待验证；不能外推现行9baa/6e2ff或官方兼容。

<a id="stage156"></a>
## stage156：场景、标签与掩码状态消费者

**事实/来源：** 固定37c4 SE 1,569,280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0/Ghidra12.1.4在293记录上增47记录/17唯一函数；17指令/7读取/6映射匹配原件，完整导出/快照保存且会话关闭。default-C分类256表词、inner转义4对和fallback3字节核对。[源核验](../analysis/game-legacy-scene-v1/source-check.json)。

**事实：** 4ef870→45f530/45f760写MAP01头与三层零值，按全部20B头复用；identityA2即便匹配仍重建，identityB0跳过准备。12字段的尺寸/头字/坐标与checksum mode通过cdecl推入顺序核对；45f2a0→4649b0把wire8写957e88。4ef9d0先全串inner-unescape，再取首pipe字段并再次inner-unescape；长度≥25用三个问号，第二十进制字段空/负为-1。4efad0/4f0000按bit0-all和字段独立位更新30/18槽；空数值-1，默认C十进制前缀/32位折返，末槽非正改100；两byte槽只在解码≤16B更新。[规格](../analysis/game-legacy-scene-v1/implementation-spec.json)、[可重提目录](../analysis/game-legacy-scene-v1/state-catalog.json)。

**推导/待验证：** 独立world只实现已证缓存、位置、标签和源槽投影，槽不命名HP/MP等属性。原生wrapped表示、actor指针+0x284副写、场景guard/viewport/资源加载/renderer均未模拟；原始条件正值保留为未知单位元数据。剩余89业务、移动/战斗/完整控制认证与当前9baa/6e2ff、真实三端/官方可玩仍未完成。[完整审计](../analysis/game-legacy-scene-v1/goal-audit.json)。

<a id="stage155"></a>
## stage155：MAP缓存消费者与反编译校正

**事实：** 固定37c4 SE 1,569,280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`；REA6.7.0/Ghidra12.1.4在247保留记录上新增46记录/19函数。17指令/4读取/6映射匹配原件，256反位序字节及256个0x1021多项式表字均可独立生成匹配。导出/快照保存且会话已关闭。[源核对](../analysis/game-legacy-world-v1/source-check.json)、[核验器](../analysis/game-legacy-world-v1/verify_source.py)。

**事实：** 45fbf0从20B头取宽高后，分别读取三个连续row-major LE16平面，矩形半开、保留请求步长并以零补范围外。460240清5202B/层scratch，第三层mode1掩0x1ff、其他掩0xfff；依次固定校验每层1458B。4601f0实际为16位移位/表与输入反位序累积，伪代码误呈空循环，不能据此用0或猜标准CRC。4ef580经510d80/510d50/510de0按pipe/comma取三列表、510f00数值转换，再45f850更新既有缓存；第三层写入OR0xc000。两个大栈帧参数/平面顺序以ESP账而非失真签名确定。[完整合同](../analysis/game-legacy-world-v1/implementation-spec.json)。

**推导/待验证：** 独立模型只投影既有缓存及source command。native场景guard/viewport刷新、平面图形/碰撞角色与路径所有权未赋义。518c30四slot通向BMP14B头后DIB/StretchDIBits路径，5187c0仍为间接回调；高层UI目的未明，不将其认作地图。剩余93业务、actor/renderer/移动战斗、完整认证、现行9baa/6e2ff与官方可玩仍未完成。[完整审计](../analysis/game-legacy-world-v1/goal-audit.json)。

<a id="stage154"></a>
## stage154：文本分发、key-readiness与位置消费者

**事实/来源：** 固定37c4 SE 1,569,280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0/Ghidra12.1.4复用129记录，新118记录/86dossier/85唯一入口。4fcea0全部60已保留调用者为顺序typed serializer；4f8a40完整保留文本中104分支的字段序列和消费者已提取。15指令/11读/5映射、164标签字相符。4ff680内址返已有4ff5a0，只计一次唯一入口；大dispatcher不重查。[源核对](../analysis/game-legacy-message-v1/source-check.json)、[可复核提取器](../analysis/game-legacy-message-v1/extract_catalog.py)。

**事实：** 4fcf80字母表0..9/a..z/A..Z，原NEG的INT32_MIN会负索引，独立writer拒绝；4fcf00按32位机器运算折返，非法字母返回0。4fcb40/4fcc50保留ASCII转义及高字节成对行为，第二保护字节变0x66、未知反斜线对只留下反斜线；不推断编码。4fcd30仅空格创建新token，CR/LF只终止内容；主4edef0清指针表，缺失参数可0/empty。7个handler为无效果RET，`]gQ`清ready flag，旧材料未清；4ee470的两种binary在bootstrap/普通解码前匹配。[收发目录](../analysis/game-legacy-message-v1/dispatch-catalog.json)、[完整子合同](../analysis/game-legacy-message-v1/implementation-spec.json)。

**推测/模型：** `=X#`三整数经4ef840→4ff580→45f2f0、4ff5a0、4ff700；整数getter转float、×64并清motion，第三码也由向量角度路径461370/463d30产生。独立代码只保存网络位置意图（坐标对/float32比例对/原方向候选码），不指认为屏幕像素、方位枚举或完整actor状态。原生条件回写、95其他业务、binary实质处理/地图/renderer/移动战斗、完整认证与当前版本/官方接受待验。[验收](validation.md#stage154)、[完整审计](../analysis/game-legacy-message-v1/goal-audit.json)。

<a id="stage153"></a>
## stage153：旧版payload及初始材料真实消费者

**事实/身份：** 固定cg_se_6000.exe 1,569,280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0/Ghidra12.1.4复用86记录、新增43记录/16dossier。14指令、8读和4映射与原件匹配；`5335cc`/`5335ec`两表与`53360c`固定128B派生参数逐字节核对。源码字节仅作协议参数，不含用户或真实会话材料。[源核对](../analysis/game-legacy-transform-v1/source-check.json)。

**事实/推导：** 405110重排目的`[7,2,5,1,6,3,0,4]`，64B循环key XOR，正文零值直写0，补齐0x11但对齐时不加块；4051f0逆表`[6,3,1,5,7,2,4,0]`后XOR，最多剥8个0x11。404db0取16B头/块体/32B尾，seed为头+16零，8192轮SHA256(seed+参数128)，AES256-CBC使用同派生32B与头作为IV，HMACSHA256仅覆盖块体。低nibble指定末块有效长度；4ee470只在112B分支结果64B时安装材料。SHA64轮常量顺序、BE摘要及旋转/状态对应，AES GF0x1b/0x63、256位14轮/逆块流对应为静态推导，未运行原程序。[规格](../analysis/game-legacy-transform-v1/implementation-spec.json)。

**工具与未决：** SHA大dossier完整保留，首7000/44068字符分页查看，完整文本作常量/尾状态扫描，截断value-flow仍未知。另定位4fcb40字节escape、4fcf00 base62消费及4fcea0/4fca20标签/追加，但未以此补猜消息字段。正常控制/特殊binary前缀生命周期、完整认证、业务/移动/战斗、renderer及现行9baa/6e2ff等价仍未闭合；完整目标未完成。[验收](validation.md#stage153)、[完整审计](../analysis/game-legacy-transform-v1/goal-audit.json)。

<a id="stage152"></a>
## stage152：旧版主游戏收发与外帧消费者

**事实/身份：** cg_se_6000.exe 1,569,280B，SHA256 `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，REA6.7.0/Ghidra12.1.4复用原快照，新47记录/17dossier。4edef0收发循环、4ee330追加/4ee3d0消费、4ee470接收分帧、4fce00发送及4fc5c0回调设置有实际调用/字节证据。15项WSOCK32原件序号独立重核；recv/send/connect/close名称对照[Wine ABI表](https://raw.githubusercontent.com/wine-mirror/wine/master/dlls/wsock32/wsock32.spec)，没有加载Windows DLL或运行游戏。[指令/读/映射核对](../analysis/game-legacy-network-v1/source-check.json)。

**事实/实现边界：** 4fce00先调用405110，将返回AX写小端word，header AFEF、payload、trailer EFAF，回调长度payload+6。4ee470首AF起至少8B再检查，长度MOVSX16；完整帧消耗前导噪声和整帧，错误第二字节消耗至AF、无AF保留。独立实现0..32767/256KiB队列，坏尾/高位长度报错清空，不模拟负长度指针、native错误阻塞或正文转换。[实施规格](../analysis/game-legacy-network-v1/implementation-spec.json)。

**推测/待验证：** 405110/4051f0及候选key缓冲尚不能指认为具体算法或认证；特殊正文前缀也没有玩法语义。4f8a40大函数完整导出，但本轮只读首6400/81694字符，原生value-flow有截断；4ee380无函数定义，未伪造函数或重复同查询。字节封包/原创TCP不能证明现行9baa/6e2ff、登录、业务/移动/战斗、渲染或官方接受。下一步沿这些已有代码追消费者，不恢复受保护负载或重放VM诊断。[完整审计](../analysis/game-legacy-network-v1/goal-audit.json)。

<a id="stage151"></a>
## stage151：可读旧版.text与首批原生消费者

**事实/来源：** 主站关联的FTP历史包元数据为1,582,593,033B/20130427023541；载体仅保留30,343,168B前缀，另外按Wise脚本仅读1,457,157B范围，所选两成员均通过精确raw DEFLATE/大小及双CRC。旧版SE1,569,280B/SHA `37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd`，Item2,213,376B/SHA `ce3fd80064d647e76bfc4cf2e34e148c6fff260f7d4b507941feb9f7673126a9`。两者.text有文件字节；COFF时间字段对应2007，不能将FTP日期当编译或协议版本证明。[材料与范围](../analysis/game-release-current-v1/legacy-acquisition.json)。

**事实/消费者：** SE来源下45cc90读取Config.dat（模式r），51b1ed至多255B/换行/EOF并加NUL，再追加输入字符串；45cfd0按子串处理设备/窗口/音效等与七家族资源参数。45cc90及457c30读取CGSharedMem、复制至NUL、清前256B，用gid:/glt:与%s扫描；不把清零跨度当安全容量。39记录/8dossier、8指令/4读/4映射逐项匹配，快照导出并关闭。[REA与源字节核对](../analysis/game-release-current-v1/source-check.json)、[首批静态合同](../analysis/game-release-current-v1/static-contract.json)。

**推测/待验证：** 45cc90为启动入口类消费者，其完整调用者/ABI未闭合；旧版主游戏消费者不等于现行9baa消费者。身份/票据、实际IPC、网络帧/业务、移动/战斗及渲染语义尚未恢复；本轮不运行原程序、不改变现有保护或宽松处理未知字段。新材料解除的是旧版静态读取障碍，完整游戏实现仍未完成。[完整目标审计](../analysis/game-release-current-v1/goal-audit.json)。

<a id="stage150"></a>
## stage150：压缩资源的结构模型，不扩大主游戏消费者结论

**事实：** 四文件重新匹配原Graphic Joy/V3与Info的完整SHA，27,854个索引范围/头部维度对应，其中27,785条v1/v3按已保留模型读取。新Python/JS对每条展开值占位、known mask、候选palette及命令统计逐项相同；27,751条接受，34条与旧实验同ordinal越界拒绝。只交付摘要/计数，不包含官图像素。[源与限制](../analysis/game-rd-runs-v1/source-check.json)、[完整差分摘要](../analysis/game-rd-runs-v1/corpus-comparison.json)。

**推测/实现：** C/D/E的计数位置可以按结构保留，实际值仍未知，不能把原实验填0或第三方工具自选标记当官方透明色。接受记录中未知位置也进入候选palette，进一步限制颜色推导。新纯模型不改raw v0/v2、主游戏或保护内容；第三方查看器只是作者工具的参考，没有新的REA游戏函数或业务字段。[实施合同](../analysis/game-rd-runs-v1/implementation-spec.json)。

**待验证：** 固定主游戏的argv/IPC/网络/认证、状态/移动/战斗消费者，以及资源颜色/方向/绘制/动画效果均未闭合。838Node/2portable/7生成工程不能补齐这些证据；无原程序、VM、转储或官方会话动作。[验收](validation.md#stage150)、[完整目标审计](../analysis/game-rd-runs-v1/goal-audit.json)。

<a id="stage149"></a>
## stage149：配置器消费者闭合，主游戏消费者仍缺证

**事实/身份：** Config.exe61440B/SHA256 `9389add9c04cbc6bd313a34098ed94aef11a866ba721c6ccf7f984973efa0f7d`；Config.dat23B/SHA `57d6c1cfa1601d14fb478b2c58732338024831de212910e63a46c1efb7a20391`。REA6.7.0/Ghidra12.1.4、既有GNU objdump静态查询得到34记录；原件在查询后相同，会话已关闭，没有执行任何原程序。[证据/偏移](../analysis/game-config-v1/source-check.json)。

**事实/读写：** 401180在UpdateData后将radio1000/1001/1002映为4/3/2，其余分支写1；从一个空格起，按windowmode、onlyactive、soundoff、musicoff顺序追加非零flag和空格，再写strlen字节，无NUL/换行。401480缺文件时写device1/all-off；已有文件则Read256B，用strstr首个3Ddevice:和sscanf%d，再以1004-device选择radio，并独立子串查四flag。可见读取段没有检查实际read长度、追加终止或检查sscanf/档位范围；不据此断言实际崩溃或完整原生效果。

**事实/控件与覆盖：** constructor401330选择dialog102。REA资源5/102/2052的792B按标准DIALOGEX解析13控件；GNU静态401140清flag并选1003，401420把1004..1007绑定+7c/+80/+84/+88，43指令逐条对原件。Ghidra未给这些callback建立函数，成功的raw读/objdump不能冒称其dossier；无效选择记录保留。[资源结构](../analysis/game-config-v1/dialog-structure.json)。

**实现/待验证：** 纯配置codec覆盖全部64规范输出及有界前缀读取；无NUL输入采用明确EOF替代，不模拟越界/未初始化/溢出或实际locale。23B模板无NUL但匹配规范writer，不能由此证明主游戏读取/渲染效果。主游戏认证、帧、状态/移动/战斗仍缺消费者，Config.exe不能替代它们。[接口](module-interfaces.md#stage149)、[验收](validation.md#stage149)。

<a id="stage138"></a>
## stage138：初始化候选未捕获，故障指纹与任意delta参考不符

**事实/身份：** 固定原件2904064B、SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126`重新匹配；两段.text1参考偏移449728/450898及摘要与stage137相同。既有PID5304第二份16924391B转储完整SHA在查询前后相同；微软x86 CDB完整SHA及Valid签名实际核对，版本沿用同哈希stage131记录，未新读版本。本轮未打开REA或新增静态反编译。[身份与查询](../analysis/game-text-observer-runtime-v1/code-fingerprint-stage138.json)。

**事实/读数：** 一次离线CDB以空本地符号/映像路径、-sins/-snul/-noshell/-nosqm及-z仅读既定64B，退出0。0x0b7c7cc0的32B全??；0x0b7c8152的32B可读，主机转录摘要为`9df6ca27bb03f774a997f2204dba253e2cffb987468b0e7b128a6b46e4ba6c1e`，与原文件0x011bd152的`a466c64d…32407`有31/32字节不同。原件内完整32B和26B后缀的精确搜索均0；不覆盖其他模式、变换或其他材料。原始8880B/74行日志与完整转储仅留来宾，私有build保存有限hex投影，不加入源码交付。

**推导/待验证：** 缺失初始化字节无法确认包装器；故障字节不匹配使本次固定指纹验证不能支持候选delta `0x0a60b000`。不能把未捕获当0或把不匹配升级为代码不存在、已损坏、ARM/依赖/保护根因。主模块历史基址仍0x00400000，地址差值未绑定所有者；栈展开警告继续有效。没有新增argv/CGSharedMem、通信/状态/移动/战斗消费者或可实施字段，不对未知代码猜架构/函数、跟随指针、扩大转储读取或重建映像。[完整边界与接续](development-plan.md#stage138)、[验收](validation.md#stage138)。

<a id="stage137"></a>
## stage137：固定原文件指纹已准备，运行时字节未读

**事实：** 原件9baa…9d3126/2904064B的0x011bccc0及0x011bd152各32B有文件字节，位于.text1，偏移449728/450898；本轮主机建立参考摘要。后一地址仅由候选delta算术选取，不是经运行时映射验证的故障所有者。历史主模块仍记录在0x00400000，单个指针对与任意差值不证明整映像重定位。

**待验证：** 计划只比较已有PID5304第二份dump的0x0b7c7cc0/0x0b7c8152各32B；普通来宾输入未恢复，实际0命令、0CDB及0dump字节，未重新运行游戏或采集/提取新内存。本轮不能得出匹配/不匹配、根因、代码架构/归属或业务消费者结论。[参考摘要、输入及后续前检](../analysis/game-text-observer-runtime-v1/access-stage137.json)。

登录器另完成新的有限参数字节合同，游戏消费者/玩法仍未知，不能以该进展代替游戏实现。[完整目标](../analysis/launcher-update-arguments-v1/goal-audit.json)、[验收](validation.md#stage137)。

<a id="stage136"></a>
## stage136：回到登录器独立缺口，游戏消费者状态保持

本轮新增的是当前登录器初始化子链REA证据及实际页面接线，未重新运行/解保护/读取原游戏，也没有新增游戏业务合同。原`.text`/候选栈/gzip与直接名称边界保持，不能由成功的原创登录器对端推导游戏认证、状态、移动或战斗。[本轮完整目标](../analysis/launcher-current-page-v1/goal-audit.json)。用户恢复goal active；此前对整个目标“无独立步骤”的解释已因新登录器实现证据纠正，不代表原游戏消费者已恢复。[需求](development-plan.md#stage136)。

<a id="stage135"></a>
## stage135：源边界未变，没有可实施的游戏业务合同

**事实：** 两个安装原件及已知app根12文件SHA与当前材料记录一致；三游戏原.text文件大小0，仍保留其他节/自定义格式未知。stage40 gzip事实、133工具/普通格式拒绝、134四DLL直接名称检查均没有恢复实际业务消费者。REA当前无目标、待清理或存活分析句柄；本轮没有新反编译、目标执行、解压、代码/转储或网络读取。[当前材料和三轮审计](../analysis/game-material-gzip-v1/blocked-audit-stage135.json)。

**结论/未决：** 当前可用证据不能支持认证/帧/状态/移动/战斗字段实现；独立游戏和完整验收未完成。goal已标记为blocked，按[回执](../analysis/game-material-gzip-v1/goal-status-stage135.json)停止重复检查，等待能绑定实际行为的匹配材料/格式/协议合同，不把静态RawSize0或字面量无命中升级为穷尽不存在证明。[接续](development-plan.md#stage135)。

<a id="stage134"></a>
## stage134：既有gzip事实对照与四DLL直接名称边界

**事实：** [stage40原记录](../analysis/diagnostic-preparation-v1/apex-static.json)与stage133回执的外/内层SHA、500154/706686B、CRC32/ISIZE一致。stage133“首次发现”失实，已纠正；实际新增工具/测试、私有文件REA拒绝和候选头检查保留。四个随包DLL完整SHA匹配旧记录，16项ASCII/UTF16LE大小写归一后的ApexClient.Dat/ApexClient精确搜索均0。[对照及新检查](../analysis/game-material-gzip-v1/continuation-audit-stage134.json)。

**待验证：** 该搜索未覆盖间接/拼接/编码引用，不证明没有自定义加载，也未绑定架构、入口或游戏通信/状态/移动/战斗消费者。REA当前无目标/待清理/存活分析句柄，不能称verified wait。本轮无新的解压、目标执行、反编译、转储读取或服务器请求；无可实施的游戏合同。[接续](development-plan.md#stage134)、[验收](validation.md#stage134)。

<a id="stage133"></a>
## stage133：Apex DAT普通gzip外壳与未知成员边界

**事实/来源：** 现有两个安装原件完整哈希重新核对：CrossGate仍`e593e47f…1982f983`（1104268439B），POLCN仍`dc90bb88…6b0fb11`（2192044B）。已知解包app根12个文件中，三游戏完整哈希和原`.text`文件大小0再次核对；不推论其他节没有代码。`ApexClient.Dat`500154B、SHA256`89fe1c4a907a06c68630b326c339240048272c927599f4e35aeaac8a39ca213c`匹配原解包记录；stage40已记录同一gzip外壳、展开哈希与完整性，stage133是在旧事实上的工具和格式检查补充。[原件/成员身份和头部](../analysis/game-material-gzip-v1/material-audit.json)。

**事实/普通容器核验：** 项目内新有界gzip工具采用Python3.9.6/zlib1.2.12；实际完整单成员解压得到706686B，SHA256`668a1ab9143b9142c9e05b62ce6714131d7eb35fdf021b4ee69410962c29fb60`，CRC32`0xfe667921`与ISIZE一致，无未消费或尾随数据，原件仍相同。完整成员仅留私有build，不执行或加入交付。[格式回执](../analysis/game-material-gzip-v1/inspection.json)、[格式与工具](resource-formats.md#stage133)。

**事实/REA边界：** REA6.7.0普通open_binary对该成员返回`target_unavailable` / `unsupported_target` / `file_format_rejected`，retryable=false；没有建立native目标，最终open=false/cleanup_pending=false。成员不以MZ起始，macOS file只报data。19处MZ字样无完整MZ/PE头配对；9处PE签名候选没有通过有界PE32/PE32+头检查。列明的9种ASCII/UTF16LE字面量均未匹配，只是精确文字搜索，不证明不存在代码/编码数据或消费者，也不能由文件名推断反作弊/安全组件职责。

**推测与待验证：** gzip外壳已经建立可追溯格式事实，但其内部格式、架构、入口、职责和与原游戏消费者的关系均未知。没有强行raw解释、重写头、恢复受保护映像或新的反编译/协议函数。本轮新增的是有界辅助工具及既有成员的REA格式/候选头检查，未发现新游戏材料或取得游戏业务合同；启动/栈旧结果仍限于stage132的解释。[完整目标与现有路线审计](../analysis/game-material-gzip-v1/completion-audit.json)。

当前没有可证的无账号正常业务请求：stage112的type1字值/调用来源仍未绑定，不能发送猜测控制；旧stage110仅8B hello的实测不作认证，游戏/WER/CDB运行均不重放。后续须以新的可分析业务材料、权威协议/脱敏向量或有来源的成员格式/读取源接续，不能把工具可用或原始数据中出现PE字样当完整游戏分析。[验收](validation.md#stage133)。

<a id="stage132"></a>
## stage132：注册回填、回调包装器及56B初始化记录

**事实/样本与工具：** 原安装文件2904064B，SHA256`9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126`；REA6.7.0/Ghidra12.1.4、profile`7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb`。取得5份函数调查、10处指令和1份引用列表，共16条，15个ID不在已核stage96/131包；10处指令均按PE映射与原文件字节核对一致。完整5415008B工具包留本地build，摘要含记录ID、偏移和哈希；REA会话已关闭、无待清理资源。[证据](../analysis/game-text-observer-runtime-v1/indirect-flow-stage132.json)。

**事实/指针来源：** `0x1195fe0`消费带长度源，经缓冲区生产函数读取PE形状的头、申请VirtualAlloc、复制节、调用重定位/导入辅助并设页权限；`0x11963f3`将分配基址写入`0x1265ed0`。`0x1196710`按导出目录形状和名称查找，调用方用`SetFunctionAddresses`及该基址取得注册指针，存入`[EBP-0x70]`。`0x1195908`调用时有21个栈实参、调用后清理0x54B；按逆推PUSH顺序，第11项为包装器`0x11bccc0`，第16/17/18项为初始化/入口/清理的输出槽地址。注册后`0x119590e–0x1195911`将`[EBP-0x54]`复制到`[EBP-0xd4]`，供`0x1195a3f`间接调用。注册链本身在stage96已观察，不把本次来源细化计为新游戏逻辑。

**事实/包装器和记录：** `0x11bccc0`含SEH处理器设置；正常分支在`0x11bccf6`只写第二指针首字节0，在`0x11bccfc`写第二指针+4的DWORD为0，然后`0x11bcd0e`以第二指针为参数调用第一指针。没有证明字节1–3清零，空直接调用者列表也不能否定PUSH回调引用。另一调用方在`[EBP-0xac]`写14个DWORD，共56B，包含三处固定地址、局部地址、模块句柄及初始哨兵；全部写入点/来源表达式见摘要。这是Win32本地初始化记录，未证为通信帧、跨平台游戏ABI或账号结构。

**事实/已有转储有限读数：** 同PID5304第二份16924391B转储重新核SHA256`1568b7ca899f80a656aa1541bae95a35e6c45fc876c08f19e86f352a6339820e`一致；既有微软x86 CDB哈希与Valid签名新核。21:24:19.4881799（+08:00）离线`-z`一次读取四个固定栈范围76B，退出0，七行共19个DWORD完整取得。候选父帧EBP=`0x001af55c`时，记录+0/+4/+0x2c为`0x01265edc/0x01265ee0/0x01266000`，+0x18/+0x28为帧内地址`0x001af524/0x001af494`，+0x20为已列主映像基址`0x00400000`，+0x34为`0xffffffff`。[读取、数值和局部核对](../analysis/game-text-observer-runtime-v1/cdb-stack-stage132.json)。

| 候选槽（基于上述EBP） | 读值 | 静态来源解释 |
| --- | --- | --- |
| `[EBP-0xd4]`与`[EBP-0x54]` | 同为`0x0b7c7cc0` | 初始化回调副本与注册输出槽对应 |
| `[EBP-0x70]` | `0x0b7fe670` | 已解析注册指针候选 |
| `[EBP-0x6c]` | `0x0b7c7960` | 清理输出候选 |
| `[EBP-0x50]` | `0x0b7d6fe0` | 入口输出候选 |

**推测：** 三处固定地址、两处帧内地址及重复指针共同支持候选栈帧与静态初始化路径的对应。**待验证/限制：** 原栈明确警告后续帧可能有误；上述局部一致不证明整链真实展开、所有运行时字节一致或四个候选指针指向有效代码。没有读取分配基址/目标内容，静态映射器不能证明两处异常属于其分配区，也不能据此诊断ARM、保护或依赖根因。未解码、提取、模拟或重建受保护负载。

**工具证据限制：** `0x1195380`的高层pcode仅保留3000操作且标截断，至少另省略1操作；完整汇编已保留，但不宣称完整def-use/别名闭包。`0x1195c30`默认反编译签名为void，实际指令在匹配/未匹配路径将候选VA/0送EAX，调用方`0x11953d8`读取EAX；按指令保留差异，不将默认签名当权威API。本轮没有游戏协议字段或产品实现，rev30未知项不变。[验收](validation.md#stage132)、[后续准入](development-plan.md#stage132)。

<a id="stage131"></a>
## stage131：转储异常与原文件静态调用边界取得对应

**事实/样本：** 固定安装版2904064B，SHA256`9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126`；前后完整哈希一致。普通无参数游戏PID5304于2026-11-02 18:50:22.6669501–18:50:29.1332491（+08:00）自然运行6.466299秒，退出`0xc0000005`。新生成两份小型转储的PID/时间/稳定长度及完整哈希均已核；只留来宾。[生命周期](../analysis/game-text-observer-runtime-v1/wer-lifecycle-stage131.json)、[文件资格](../analysis/game-text-observer-runtime-v1/wer-dumps-stage131.json)。

微软x86 CDB文件版本`10.0.26100.9457 (WinBuild.160101.0800)`、SHA256`6ca9dd8ee2d764087c4a561ecfee05cdf17751dfd9c2f21700211a897cd68129`、签名Valid新核；两次只用本地`-z`及`.exr -1; .ecxr; k 0n20; lm; q`，均退出0。第一份16926131B记录`0xc00001a5 @ 0x0b86db30`，第二份16924391B记录`0xc0000005 @ 0x0b7c8152`。两份39个模块记录的大小写敏感集合比较差异0；主程序范围为`0x00400000–0x0143b000`（右端不含），两处异常VA都不在所列模块内，不能转成主程序故障RVA。[CDB选定摘要](../analysis/game-text-observer-runtime-v1/cdb-summary-stage131.json)。

**事实/静态核对：** REA6.7.0/Ghidra12.1.4对同哈希原文件取得24条新记录；六个候选返回值落在完整函数体内，均为解码指令起点，且与前一条CALL的结束地址相等。原始`.text`的RawSize仍为0；这些地址按PE布局都属于`.text1`。

| 候选返回VA | 文件偏移（布局相同前提） | Ghidra函数入口 | 前一条静态CALL | 目的地 |
| --- | --- | --- | --- | --- |
| `0x011bcd11` | `0x6dd11` | `0x011bccc0` | `0x011bcd0e` / 3B | `[EBP+8]`间接，目标未知 |
| `0x01195a45` | `0x46a45` | `0x01195380` | `0x01195a3f` / 6B | `[EBP-0xd4]`间接，目标未知 |
| `0x01197009` | `0x48009` | `0x011967d0` | `0x01197004` / 5B | `0x01195380` |
| `0x011970f8` | `0x480f8` | `0x011970f0` | `0x011970f3` / 5B | `0x011967d0` |
| `0x0117907c` | `0x2a07c` | `0x01179000` | `0x01179077` / 5B | `0x011970f0` |
| `0x011e6ccb` | `0x97ccb` | `0x011e6bb1`（`___tmainCRTStartup`） | `0x011e6cc6` / 5B | `0x01179000` |

[布局算术](../analysis/game-text-observer-runtime-v1/stack-file-boundary-stage131.json)、[REA记录ID/函数体/指令摘要](../analysis/game-text-observer-runtime-v1/rea-stack-correlation-stage131.json)。完整指令清单与REA bundle留在本地build，不把大段反编译或汇编加入交付；分析会话已关闭，最终open=false/cleanup_pending=false。

**推测：** 静态直接调用为启动路径候选提供了文件依据，两处间接调用是当前明确边界。**待验证：** 两份CDB各给9/8行`x86`候选栈，都警告后续帧可能有误；没有验证真实展开、运行时字节一致性、间接目的地或异常所有者，不能证明全链实际执行、保护/架构/依赖根因或游戏协议消费者。没有新协议字段、游戏实现、账号会话或官方兼容验收。后续仅沿原文件可证的数据流定位职责，缺口不足时不扩大运行取证。[验收](validation.md#stage131)。下方旧阶段保留当时状态。

<a id="stage129"></a>
## stage129：前检未提供新的游戏函数或故障上下文

**事实：** 精确安装路径与2904064B已重新回读，同名进程0；最近完整哈希是stage128的 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126`，本轮没有再次读取哈希。两个逻辑视图的LocalDumps父/游戏子键不存在，AeDebug Auto值缺失，实验目录不存在；仅是[只读前检](../analysis/game-text-observer-runtime-v1/wer-preflight-stage129.json)。

**推测限制/待验证：** 不由键不存在推断共享/重定向关系，不由Auto缺失保证WER采集。没有新游戏/读取器/CDB执行、转储、REA操作或消费者；异常根因与正常认证后交接仍待证，协议rev30未变。[原方案](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)仍待执行时确认，不能用前检替代函数、通信和玩法证据。[验收](validation.md#stage129)。

<a id="stage128"></a>
## stage128：两份 WER 文本与失效附件已核

**事实：** 固定游戏SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126` 本轮来宾重新读取一致。事件2160/2162实际引用的归档只剩44628/44632B的Report.wer，两份摘要、签名及38个模块基名已记录；十个实际临时引用均不存在。报告EventTime整数换算为09:36:48.5655105Z及09:36:53.6346914Z，不能替代1000记录时间或读取器时刻。[材料/换算](../analysis/game-text-observer-runtime-v1/wer-artifacts-stage128.json)。

**推测限制：** AcLayers/AMSI/MpOav及五个直接导入库出现在清单中，只证明报告列出它们；未取得地址/栈/故障所有者，不据此修改兼容或防护。StackHash/PCH仍为不透明签名。临时路径不存在不证明从未生成附件或全盘没有副本。

**待验证：** [新小型转储方案](../analysis/game-text-observer-runtime-v1/game-wer-plan-stage128.md)仅已准备，未启用、启动或采集；既有微软x86 CDB哈希与Valid签名新核。没有新REA操作、反编译、消费者或协议/玩法实现；继续以真实函数/数据流作为实现条件，rev30不变。[准备](../analysis/game-text-observer-runtime-v1/diagnostic-readiness-stage128.json)、[验收](validation.md#stage128)。

<a id="stage126"></a>
## stage126：unknown模块故障偏移没有给出新的静态入口

**事实：** 固定样本2904064B/SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126` 的运行后身份未变；两条1000均绑定上次PID5136/创建时刻。记录2159为17:36:48.4586914 +08:00、`0xc00001a5`/`FaultOffset=0x0b88db30`；2161为17:36:53.5436468、`0xc0000005`/`0x0b7e8152`，模块均unknown。两份1001的APPCRASH签名仍无可定位模块。[事件](../analysis/game-text-observer-runtime-v1/events-stage126.json)。前者的微软状态定义是无效异常处理程序，定义不能解释本游戏根因。[选取的一手来源](../analysis/game-text-observer-runtime-v1/status-reference-stage126.json)。

**事实/静态：** REA `ev_cf3e5ba7e26d0bb865730c76714fafe462337a54644bc96a07bcb8dfc7c6fee8` 的objdump -h完成、前后hash一致；独立PE32解析确认ImageBase0x400000、SizeOfImage0x103b000、原.text RVA0x1000/VirtualSize1753452/RawSize0。两个原始故障值都不落入文件偏移、映像RVA或首选VA范围；未知实际加载基址/映射，不能反推出函数。LoadConfig RVA/长度均0，仅描述文件声明。REA provider.version=null，独立探针GNU Binutils 2.47.20260726另记；objdump Size不代替VirtualSize。[REA回执](../analysis/game-text-observer-runtime-v1/rea-fault-layout-stage126.json)、[独立范围](../analysis/game-text-observer-runtime-v1/fault-layout-stage126.json)。

**推导：** 按记录时钟和已回读脚本，首条错误记录早于最早读取时点0.9647291秒；没有读取器精确调用时刻或指令轨迹，不判断后续错误因果。**待验证：** 既存WER附件是否还在、可用堆栈/映射、根因、正常登录交接和游戏消费者。本轮没有新代码快照或保护/权限改动，不以异常码推出ARM、缺库、SafeSEH/SEHOP或保护结论。

<a id="stage125"></a>
## stage125：实际固定读取全零，异常退出尚无故障归属

**事实：** 安装版2904064B/SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126` 与读取器身份、`~ WIN7RTM`、五个直接DLL、StartInfo均新鲜核对。普通无参数游戏PID5136实际运行9.123410秒；读取器一次固定1753452B读取返回 `TEXT_ZERO`/exit1，未创建输出；同一进程以 `0xc0000005` 退出。[前检](../analysis/game-text-observer-runtime-v1/game-guest-preflight-stage125.json)、[运行/限制](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)。

**推导：** 按固定读取器源码，TEXT_ZERO表示本次完整读取通过既有身份/区域检查后缓冲区全零；它没有输出实际基址、页面表或快照摘要，不能补造这些值。**待验证：** 故障模块/偏移、调用栈、正常认证后交接及游戏通信/玩法消费者。事件详情尚未回读，不能据异常码确定ARM、缺库或保护为根因；无新REA消费者记录，也没有可供REA分析的新代码文件。原单次方案已用，后续先核本次错误记录，保留无账号/PDB的既有答复。

<a id="stage122"></a>
## stage122：本次运行观察已获确认，仍无新的游戏消费者

已取得原一次无账号诊断的具体执行确认；同一 PVM/新恢复点只读复核通过，但输入恢复后 Mac 自动锁定。当前没有新的来宾 hash/Win7/依赖前检结果、原游戏启动或内存读取，也没有新的 REA 游戏记录；旧静态证据和 rev30 未变。[授权](../analysis/game-text-observer-runtime-v1/authorization-stage122.json)、[实际输入边界](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)。

正常解锁后仍先完成精确身份与无输出/无进程前检，执行已审阅一次方案；取得实际代码后才用 REA 追溯消费者。不把原创夹具的 6624B 正向资格当作游戏代码、稳定解包或认证/玩法/官方兼容证明。

<a id="stage119"></a>
## stage119：安装版前检与新的 REA 文件头证据

**事实：** 来宾安装文件 2904064B、完整 SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126` 与固定样本一致。REA 新证据 `ev_b89a0eb5df785f745442c82cd0ebea341c2310b2e7056b639d45dd28a90c1682` 确认 pei-i386/i386、入口0x011e6d1e、读取前后 hash 不变；不是运行或消费者恢复。[REA 回执](../analysis/game-text-observer-runtime-v1/rea-preflight-stage119.json)。

独立 GNU `objdump -p` 列出 KERNEL32/USER32/GDI32/COMDLG32/SHELL32 五个直接库，来宾 SysWOW64 对应文件存在。动态/传递依赖与 Win7 效果待验，当前游戏进程数 0、未执行/读取。原创工具正向资格已通过，后续按独立方案推进。[导入](../analysis/game-text-observer-runtime-v1/game-static-preflight-stage119.json)、[前检](../analysis/game-text-observer-runtime-v1/game-guest-preflight-stage119.json)、[方案](../analysis/game-text-observer-runtime-v1/game-startup-plan-stage119.md)。

<a id="stage118"></a>
## stage118：原创读取依赖已有Windows实测，原游戏消费者仍未知

**事实：** 固定原创fixture PID260的一次6624B读取、实际基址00da0000、观察器exit0及同一fixture30秒自然exit0均已回读。独立245个HIGHLOW计算的预期SHA256与观察器输出相同；原文件未传回，直接逐字节比较仍待完成。这些是原创工具资格的部分运行证据，不是9baa原游戏内存或反编译结果。[实际运行](../analysis/game-text-observer-runtime-v1/fixture-runtime.json)。

**待验证：** 原游戏本轮未启动/读取，没有新增消费者、字段或玩法证据，矩阵rev30保持7 observed/13 unknown。先沿当前会话完成原创快照传回；再新鲜核依赖、Win7、恢复条件及具体有界无参数诊断方案，和认证后的正常入口分别验收。[接续顺序](development-plan.md#stage118)、[当前验收](validation.md#stage118)。

<a id="stage115"></a>
## stage115：游戏清单声明已核，原 `.text` 消费者仍未取得

事实：REA对9baa…d3126/2904064B原件完整解析31资源目录项/12资源；类型24/名称1/语言1033的清单位于文件2901080、822B、SHA256 3e9fb184…fc862e9。直接XML解析为asInvoker/uiAccess=false；只证明声明，不证明实际运行。原.text RVA1000/1753452B的RawSize/RawPtr仍0。[源记录](../analysis/game-text-observer-v1/source-check.json)。

为后续正常运行代码取证准备独立固定范围/PID读取器，读取整个原.text前检查MEM_IMAGE、分配基址、提交/可读可执行及无guard/noaccess；不启动目标或修改保护。39C/6Python及相同构建属于主机准备，Windows输入被锁屏阻断，没有原游戏执行/内存字节或消费者新增。矩阵rev30保持7observed/13unknown。[边界](../analysis/game-text-observer-v1/README.md)、[验收](../analysis/game-text-observer-v1/validation.json)。

<a id="stage114"></a>
## stage114：原件CodeView身份与公开符号查询，原.text缺口未闭合

事实：固定9baa…d3126/2904064B原件的文件偏移0x26a00有24B RSDS头，GUID ce363f7c-dd81-45c7-9944-f0402388bd13、age1、文件名CrossGate.pdb。其文件映射VA5d3a00和声明CodeView VA426a00不同；不能把声明地址当当前文件映射。REA首个头部读为330000ms启动超时（非成功读取），之后原.text和声明地址返回0B/complete=false，快照已关闭。[源记录](../analysis/launcher-cache-source-browser-v1/game-source-check.json)。

依[微软公开符号源](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/microsoft-public-symbols)和[存储规则](https://learn.microsoft.com/en-us/windows/win32/debug/using-symstore)，精确GUID/age目录的CrossGate.pdb/CrossGate.pd_各GET一次均404，没有下载到可核验PDB；结论不扩展到其他来源。游戏消费者/字段/玩法未恢复，后续仍需正常运行的可分析代码或适当调试材料，不补造协议或绕过保护。[查询回执](../analysis/launcher-cache-source-browser-v1/symbol-observation.json)。

<a id="stage113"></a>
## stage113：更新清单确认当前3000身份，另检6000静态可用性

事实：两份新取的378操作清单均声明`cg_se_3000.exe`长2904064B、MD5`206807c582f3ead650c95918260d6c93`，与保留9baa…d3126原件的长度和MD5一致；本轮未重复下载3000。此为HTTP内容与已有样本对应，不是来源认证或服务器版本接受。[重解析与身份](../analysis/launcher-current-entry-v1/manifest-reanalysis.json)。

清单中的`cg_se_6000.exe`单独下载为分析输入，ZIP1578707B经现有CRC解码得到1757184B/MD5`580251052e71d1e24dc620e5ac84b20a`/SHA256`6e2ff83274561047129ef61cbda8b718e3806f68aeb5d36f3a9b5cd08df60a4a`。它与3000是不同样本，不能默认沿用其RVA、结构、版本或协议；取回后又与已持有6000逐字节比较相同，因此不是新游戏版本。两源的五个EXE声明也都与保留副本长度/MD5一致。[下载与PE记录](../analysis/launcher-current-entry-v1/variant-observation.json)。

REA实证其原.text的RawSize0、VA401000静态读16B返回0且complete=false，无包含函数；原.rdata/.data也没有文件字节。推测打包逻辑可能在正常运行时恢复代码，机制及消费者待验证，本轮未尝试保护绕过或执行该程序。游戏通信/玩法仍缺原消费者证据，暂无账号/PDB/调试版本，矩阵7/13不提升。[REA与能力边界](../analysis/launcher-current-entry-v1/game-capability.json)。

<a id="stage112"></a>
## stage112：原游戏身份新鲜核对，观察器范围已复核

**事实：** Windows当前安装路径`C:\Program Files (x86)\PlayOnline\魔力宝贝\cg_se_3000.exe`实际SHA-256为9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126，HKCU Layers返回`~ WIN7RTM`。本轮仅只读查询，没有启动原游戏或读取其进程；该标记的实际效果未验。[前检](../analysis/launcher-current-control-v1/guest-preflight.json)。

**事实：** 已有观察器5项源码和已链接构建hash重核通过。game-installed配置要求固定路径/hash、x86、进程创建时间和映像大小，单次读取RVA e65db8处8B，再查询两个指针的区域元数据；不跟随读取代码、IPC或参数内容。历史Windows资格是在fixture profile下观察原创fixture，原游戏profile尚未实跑。[能力复核](../analysis/launcher-current-control-v1/game-capability.json)。

**待验证：** 正常入口目标PID、当前依赖/恢复状态、原游戏消费者及通信/玩法。原.text RawSize0的缺口仍在，8B槽位元数据本身不足以恢复业务消费者。登录器本轮155条REA和45Node结果只对应登录器；暂无测试账号，原游戏与三平台/官方可玩未验。[下一步](development-plan.md#stage112)。

<a id="stage111"></a>
## stage111：现行登录器record已对齐，游戏消费仍未知

当前登录器源/汇编确认ceil补齐和原生0/0接收，与旧独立核心有差异，已新增现行codec/stream/profile并接入current flow/session。139 REA记录、4源区间、独立向量/65分片、78Node通过；本轮无原游戏或真实加密账号运行。[源合同](../analysis/launcher-current-record-v1/implementation-spec.json)、[测试](../analysis/launcher-current-record-v1/test-results.json)。

用户暂无专用测试账号，继续正常连接控制/版本消息的无账号源链。游戏.text RawSize0、原消费者/通信/玩法和三平台/官方可玩缺口仍在，不能把登录器record算法外推游戏。矩阵rev27补登录器子范围、20状态保持7/13；不重复索取已答没有的PDB、伪造启动票据或重放旧计划。[下一步](development-plan.md#stage111)。

<a id="stage110"></a>
## stage110：已证登录前置，游戏消费者仍未恢复

继续用户原顺序。当前登录器REA新增17记录/累计123，固定组profile已进入shared/flow/web session，78相关Node通过；单次配置BIP只8B hello→529B源组匹配并关闭，未回答/认证/执行游戏。不能把这个前置结果当游戏服务器连接或启动接受。[现行源合同](../analysis/launcher-current-channel-v1/implementation-spec.json)、[真实前置](../analysis/launcher-current-channel-v1/network-observation.json)。

stage109的type10/11与启动生产者低16修正仍保留；本轮没有填补原游戏.text文件RawSize0、消费者/协议/玩法或三平台可玩缺口。矩阵rev26仍7/13，LCH下一步清掉过期夹具/锁屏前提，后续需正常认证启动取得真实游戏消费者证据，不重放旧计划/假票据，也不重复索取已答“没有”的PDB材料。[矩阵](../analysis/protocol-v2/spec-matrix.json)、[下一步](development-plan.md#stage110)。

<a id="stage109"></a>
## stage109：补齐现行登录器的游戏启动生产者对应

REA已将更新版6d459…c987（分析c82fc…c152）的AAChannel、type10/type11、候选选择与42d830/410c00/40b750的256B映射及CreateProcessA生产路径对应。原生状态只读低16位，两shared模块已修正额外canonical拒绝；不是修改原游戏/票据或实际启动。[源事实](../analysis/launcher-current-login-v1/implementation-spec.json)。

48组合成字节链与78相关Node通过，只证明独立producer投影。本轮未开VM或执行游戏，既有固定游戏.text RawSize0的文件字节缺口仍未解决，未取得正常游戏消费者、参数/IPC实际消费、通信与玩法证据；无新游戏hash/运行结论。网页/移动网页/微信及官方可玩目标继续未完成，后续沿真实消费者推进。[验收范围](../analysis/launcher-current-login-v1/test-results.json)。

<a id="stage108"></a>
## stage108：登录器更新已推进，原游戏仍未启动

**事实：** 实际安装游戏的Win7路径配置已回读，固定游戏hash仍沿此前9baa…d3126核验；本阶段原游戏启动0。两正常父登录器观察及补库后的V2.01列表只证明平台流程，不是游戏.text、回调、IPC或消息消费者。[配置](../analysis/game-install-context-v1/compatibility-stage108.json)、[实际平台运行](../analysis/game-install-context-v1/vc71-remediation-runtime-stage108.json)。

固定游戏.text的RawSize/RawPtr均0之缺口未被正常安装或平台自更新消除；继续先恢复正常游戏消费者证据，未知字段不凭演示/地址补造。游戏协议、玩法及官方可玩均未验。[阶段验收](validation.md#stage108)。

<a id="stage107"></a>
## stage107：平台安装已核，原游戏消费者没有新增证据

本轮复核的是平台旧登录器及其内嵌更新器；未启动或读取原游戏进程，也未重读游戏文件hash。游戏安装身份沿用stage105已核记录，不能由平台安装退出0或原创夹具成功推出原游戏消费者、帧/认证/状态或可玩兼容。原游戏文件.text缺少原始字节的既有边界未因本轮UPX登录器分析而改变。[平台对应与限制](../analysis/game-install-context-v1/rea-bridge-stage107.json)、[后续正常上下文](../analysis/game-install-context-v1/normal-launcher-plan-stage107.json)。

<a id="stage106"></a>
## stage106：已安装游戏身份保留，平台许可等待独立处理

平台启动前再次读取正常游戏文件完整SHA256，与9baa…d3126相同；本轮没有游戏启动/读取或新REA消费者。正常平台安装器已到新许可页、保持拒绝，安装完成及后续启动链尚未取证。正常游戏安装结果仍保留，原.text缺少文件字节的边界未改变。[新鲜前检](../analysis/game-install-context-v1/platform-preflight-stage106.json)、[平台实际运行](../analysis/game-install-context-v1/platform-runtime-stage106.json)。

<a id="stage105"></a>
## stage105：正常安装目录与四文件身份取得运行证据

**事实：** 固定e593e47f…1982f983安装包获本次确认后正常完成，默认目录及HKCU CrossGatePUK3/Path的32/64视图一致；结束取消平台安装，安装器exit0。CG5Reg、cg_se_3000、MFC71及msvcr71四个完整hash与留存源相同；2369文件/总字节仅聚合一致，未做全文件hash。[实际安装](../analysis/game-install-context-v1/guest-installed-context-stage105.json)。

**待验证：** 同一9baa0d26…d3126游戏文件仍有原.text RawSize0边界，安装未恢复其消费者代码。新增绑定真实目录的原创观察配置经主机三行/中文路径核对和Windows原创fixture验证；原游戏没有被本轮启动/读取，不把夹具回调当游戏逻辑。[固定配置构建](../analysis/game-entry-v1/observer-build-stage105.json)、[原创运行](../analysis/game-entry-runtime-v1/windows-observer-stage105.json)。

<a id="stage103"></a>
## stage103：正常安装条件函数已有可追溯静态解释

**事实：** 固定 e593e47f…82f983 游戏包经上游只读头提取，IFPS位于解压header0偏移578，长3778B、SHA-256 `c9b7e7bbd40c6dcf8bfd8b50b712ac29940a95e226d132e27f537c596185bec1`；平台包为3416B/IFPS23。偏移不是原EXE压缩区或运行VA。[提取身份](../analysis/game-install-context-v1/compiled-extraction-stage103.json)。

**推测（静态解释）：** GetLauncherPath 向 RegQueryStringValue 传入HKCU、SOFTWARE\SECN\Launcher、InstallDir，输出指向函数返回值；CheckPolCNSetup 将该返回值交给 Length，再比较大于0。完整选定函数体仅有这三类直接调用，无文件存在判断；非空旧路径可满足该谓词。8原字节锚点/两体hash和7项原创读取测试支持该解释，不等于运行结果。[语义与边界](../analysis/game-install-context-v1/install-conditions-stage103.json)。

**待验证：** 实际安装求值/registry view/提权后用户及最终目录；本次来宾两视图查询只取得缺项/值与exit1。[实际回执](../analysis/game-install-context-v1/guest-platform-context-stage103.json)。来源执行确认仍待答，没有安装/游戏/脚本执行。游戏原.text字节缺口及argv/CGSharedMem、帧/认证/状态仍未补齐。

<a id="stage102"></a>
## stage102：正常安装声明和 CG5Reg 注册链

**事实：** 原 `CrossGate_Setup.exe` 为1104268439B，SHA-256 `e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983`；原件/只读介质/来宾成员完整hash一致。Inno6.1 Unicode元数据声明 `{autopf}\PlayOnline\魔力宝贝`、管理员权限、HKCU `SOFTWARE\SECN\PlayOnline\CrossGatePUK3` 的 Path={app}，2369文件项、两项有条件postinstall。`CheckPolCNSetup`/`GetLauncherPath`编译辅助逻辑未解释，不把静态条件当实际结果；CG5Reg不在两项声明中。[元数据与UTF16解释边界](../analysis/game-install-context-v1/installer-metadata-stage102.json)。

**事实：** 固定CG5Reg SHA `c3baedb2…e7e228a9`，Init401410取模块目录，消息映射402498绑定control1到4011d0。**推测：** REA精确字节、导入与独立反汇编支持所选处理器向HKCU写模块目录字符串；默认Ghidra并未定义该处理器函数，推测不伪装为REA伪代码或实际注册成功。[25记录/4锚点](../analysis/game-install-context-v1/cg5reg-static-stage102.json)。

**待验证：** 新快照、E:MOLIINST102和两安装包身份已就绪，两包均NotSigned，游戏原件与当前官方发布字节的对应仍未证。当前未执行安装器/CG5Reg/原游戏；正常安装及真实目录/registry view回读仍待本次来源执行确认。[具体方案](../analysis/game-install-context-v1/normal-run-plan-stage102.json)、[回执](../analysis/game-install-context-v1/transfer-session-stage102.json)。固定游戏原.text缺文件字节的问题不变，argv/CGSharedMem、帧、认证和状态语义未补；不会搬样本、伪造Path/IPC或放宽观察器来取得通过。

<a id="stage101"></a>
## stage101：原创槽观察通过，原游戏消费者尚未观察

**事实：** 已修正原创fixture PE布局并在现有Windows读到其cleanup/entry RVA`14c0/14b0`，observer exit0；另一次仅验证fixture自然exit0。数值属于原创fixture，不能写入CrossGate消费者规格。[完整结果、身份及两个PID区别](../analysis/game-entry-runtime-v1/windows-observer-stage101.json)。

固定游戏SHA256仍`9baa0d…3126`，其原`.text`缺少文件字节与已有入口/注册边界结论不变。来宾样本位于client-probe，观察器game路径却不存在；本轮未运行原游戏、未使用game profile。注册表/INI只读查询尚未解析出正常完整目录，主机仍保有安装器解包材料。[上下文](../analysis/game-entry-runtime-v1/game-context-stage101.json)。下一步正常安装上下文与消费者观察；argv/CGSharedMem、资源调用、socket、帧/认证/状态仍待验证，不恢复受保护代码或猜测字段。

<a id="stage100"></a>
## stage100: Mac access blocked (2026-10-29)

电脑控制在连续3个 goal turn 均报告 Mac locked、自动解锁失败；未取得新来宾状态、提交新命令或运行观察器/原游戏。三轮阻塞审计已通过，goal 工具实际返回 blocked，完整目标尚未完成。

仅已有一次正常解锁请求保留，无需重复授权或再点击终端。解锁后先看未提交的哈希查询，核文件/备份/journal/原创目录，再验原创工具；旧脚本/Restore/启动不重放。22项临时菜单因锁屏尚未撤回，精确清单保留。不改锁屏/安全或使用已禁止控制路径。下列旧“当前”均为各阶段历史。

[stage100 audit](../analysis/game-entry-runtime-v1/access-blocked-stage100.json), [stage100 delivery](../analysis/delivery-manifest-stage100.json).

<a id="stage98"></a>
## 当前：指定进程查询完成，游戏消费者仍未取得（stage98 / 2026-10-29）

无新游戏REA或原程序执行；既有40记录/7锚点仍只支持入口和注册边界。D=MOLICUR89、Restricted及两组指定进程计数0是实际前检，不提供回调值、帧、认证或状态字段。[实证](../analysis/game-entry-runtime-v1/guest-preflight.json)。

哈希查询前半段未Return，之后CUA报新Mac锁定/自动解锁失败。仅一次正常解锁请求待答；不再要求终端点击。新ISO/fixture/observer主机hash一致，Windows挂载/传输/执行仍0。先核当前文件、备份与原创目录并验工具，再判断正常游戏路径/来源/运行门槛。不重问已确认没有的PDB，不发明协议。新锁屏第2轮，完整目标active/未完成。[访问](../analysis/game-entry-runtime-v1/access-observation.json)、[范围](../analysis/game-entry-runtime-v1/run-plan.json)、[目标](../analysis/game-entry-runtime-v1/goal-audit.json)。

stage99 复查：CUA 仍在 Mac locked／自动解锁失败处停止，未取得新来宾状态或提交命令。同一新锁屏已连续2个 goal turn；上一轮有实际前检进展，本轮无开发进展。已有一次解锁请求保持，不追加终端操作或重复授权。完整目标 active，恢复后先看未提交的哈希查询，再核文件/目录并验原创工具。[本次复查](../analysis/game-entry-runtime-v1/access-recheck-stage99.json)。

<a id="stage97"></a>
## 当前：入口证据保留，正常运行消费者仍待验证（stage97 / 2026-10-29）

固定游戏9baa0d26…d3126/2904064B及stage96全部交付再次核验相同；本轮无新REA或游戏执行。既有40游戏记录中的入口/注册边界仍只支持静态事实，不能把两个零槽当运行值或把维护开关当游戏协议。原创观察器/fixture/数据CD也逐一重核身份，Windows尚未实测。[前检](../analysis/game-runtime-access-v1/preflight.json)。

CUA新鲜结果仍为Mac锁定，连续第三轮同一条件；前两轮独立分析/准备已完成，当前业务消费者路径需要正常运行证据。完整argv/CGSharedMem/资源/socket/帧/认证/状态与可玩/平台/官方验收仍缺，当前20规格状态未升级。阻塞审计通过后提交goal blocked，完整目标保留；不以保护绕过、另版样本、猜测实现或重复扫描替代。[七要求与当前路线](../analysis/game-runtime-access-v1/blocked-audit.json)。

<a id="game-stage96"></a>
## 当前：源入口到运行时回调边界（stage96 / 2026-10-29）

**事实：** 固定样本2904064B、SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126`；REA6.7.0/Ghidra12.1.4复用7条匹配快照，新增33记录/6伪代码函数，导出40条后关闭。7处指令均对应原文件字节。[函数/证据ID/私有导出hash](../analysis/game-entry-v1/static-audit.json)。

| 源位置 | 已证控制转移 | 限制 |
| --- | --- | --- |
| entry `0x11e6d1e` | 初始化安全cookie后，`0x11e6d23`编码为JMP `0x11e6bb1` | Ghidra标作CALL_TERMINATOR，保留与编码差别 |
| CRT `0x11e6bb1` | `0x11e6cc6`调用既有 `0x1179000` | 这条静态路径不证明实际执行 |
| `0x1179000→0x11970f0→0x11967d0` | 先调用维护解析 `0x1194850`，后有间接回调 | 不能把维护开关解释为游戏协议 |
| setter `0x1195380` | 接收运行时 `SetFunctionAddresses` 输出，`0x119591a/0x1195923`写入entry/cleanup槽 | 输出实际目标没有静态解析值 |
| `0x1197031/0x1197056` | 分别经 `0x1265dbc/0x1265db8`调用 | 实际归属/调用结果仍未知 |

**事实：** `0x1265db8`连续8字节（RVA `0xe65db8`）在静态已初始化块内均零；原 `.text/.data`部分块未初始化。owner还存在调试器相关分支，未修改/强制/规避，也未解密、模拟、导出或重建保护负载。**推测：** 此处可能是正常业务入口交界，需运行证据确认。**待验证：** 槽实际值、正常调用与argv/CGSharedMem→资源/socket/帧/认证/状态消费者；静态零不能当运行值。

原创固定槽观察器已编译并经REA/字节核验，但只完成主机准备；它不附加调试器、不启动或修改目标，不读取代码/IPC/字符串。先验收原创fixture，再观察获授权的正常现有游戏PID；保护/访问拒绝即停。[工具先行范围](../analysis/game-entry-v1/observer-plan.json)、[Windows待办](../analysis/game-entry-v1/probe/README.md)。本轮Mac锁定、0来宾命令/0游戏启动，完整游戏与平台/官方验收继续未完成，不再索要用户已确认没有的PDB/调试材料。

## 当前：材料身份复核与消费者边界（stage95 / 2026-10-29）

本轮只重新读取既有cg_se_3000.exe缓存的hash/PE头，仍为2904064B、SHA2569baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126；原.text rva4096/virtual1753452/raw0、entry_rva14576926。其他.text1/.pdata等节有文件字节，这不是全局无法分析结论，也不是已恢复游戏消费者。[材料前检](../analysis/launcher-update-recovery-v1/game-material-preflight.json)。

本阶段主线仍补登录器更新/恢复格式，未新启动游戏或新增游戏REA/未知协议字段。Mac锁定使当前正常来宾观察未进行，已发一次解锁请求；游戏消费者、认证/帧/移动/战斗及可玩实现继续未完成，用户已确认没有的PDB/调试/协议材料不再索取。[要求与下一步](../analysis/launcher-update-recovery-v1/goal-audit.json)。

## 当前：登录器首屏已推进，游戏消费者仍缺（stage94 / 2026-10-29）

本轮实际运行的是登录器正常更新链和无凭据主界面，未启动游戏、采集游戏会话或补写未知帧。新hash6d459ddbdf…属于POLCN_Launcher，不替换下方cg_se_3000.exe样本身份。游戏原.text raw_size0的stage93源检查继续保留，没有新游戏反编译或全局不可分析断言。[独立运行边界](../analysis/launcher-current-runtime-v4/ui-observation.json)。

配置对的浏览器提交入口已通过605Node及Chrome验证，仍不提供argv/CGSharedMem→实际消费者→socket/帧/认证、移动、战斗或恢复规则。先完成必要登录器新版更新/恢复边界，再按原四步顺序观测正常游戏消费者；不重问已确认没有的调试/PDB/协议材料。[完整要求审计](../analysis/launcher-current-runtime-v4/goal-audit.json)。

## 当前游戏证据边界复核（stage93 / 2026-10-28）

本轮未进入新游戏运行/REA，也未实现未知游戏字段。旧临时路径已失效，实际复用项目build中的既有cg_se_3000.exe缓存，SHA256仍为9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126，2904064字节；独立读PE节表再次得到原.text virtual_size1753452、rva4096、raw_size0。只读检查未执行/修改文件，不是解保护或全局无法分析的断言。[文件身份与边界](../analysis/launcher-current-runtime-v3/observation.json)。

原argv/CGSharedMem→游戏消费者→socket/帧仍未闭合；库存与MAP01的既有纯解析不供应认证、会话、移动/战斗等规则。用户已经说明没有匹配调试/PDB/协议材料，不重复索取。当前Windows普通终端可操作，但有效策略实测Restricted；必要的正常启动观察仍待此前具体临时策略回复，旧stage78的locked描述仅为历史。[完整要求/路线审计](../analysis/launcher-current-runtime-v3/blocked-audit.json)。

## 当前游戏运行时准备依赖（stage78）

用户明确没有调试/PDB/协议材料，随后批准本项目联网与工具操作。现已编译、用REA和独立字节核验原创x86观测目标，并完成host模拟与只读介质；它用于验证将来的ARM64/x86观察器，不是游戏实现或原CGSharedMem消费端。原游戏固定hash与缺失业务消费者结论保持。[原创目标来源/证据](../analysis/runtime-observer-v2/static-spec.json)。

主机更新摘要显示原启动器无需变化，RegionList需要刷新；来源身份/来宾连通性尚未验。当前普通GUI访问被工具报告locked阻断，未执行原游戏或获取账号/命令行/映射内容/通信负载。下一步是Windows工具和原创目标实际验收，再定位正常游戏消费者；不继续索要用户没有的PDB，也不把元数据定位当协议恢复。


<a id="game-consumer-blocked"></a>
## 当前普通静态路线阻塞审计（stage77）

**事实：** 新核原CrossGate_Setup.exe SHA256仍为`e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983`，innoextract只列清单的2,368项路径逐项等于旧清单，无显式新增脚本/PDB/MAP或业务模块。首次误加`--silent`导致无列表，未作为阴性证据；去掉后重列成功。[元数据留痕](../analysis/game-consumer-blocked-v1/inventory-revalidation.json)。四个既有DLL的ASCII/UTF16LE交接词/映射API/PDB字面检查均未命中，仅是有界直接线索检查，不排除隐藏/编码/间接数据。

**待验证：** 游戏argv/命名映射/会话/socket/帧与状态规则仍无消费者证据。连续三轮同一缺口已满足blocked审计；现有工具可用，没有可借普通依赖安装补出的协议证据。未增加猜测字段或以小界面/资源预览代替游戏。[完整目标逐项状态、已排查路线、材料条件](../analysis/game-consumer-blocked-v1/blocked-audit.json)。

公开发行方定向查询未取得匹配协议/调试材料；所开的[官方安装说明](https://www.crossgate.com.cn/_private/setupgame.htm)仅支撑普通安装/平台流程，不能作为字节协议或样本版本证明。搜索非穷尽，没有下载新程序、联系他人、账号或游戏服务操作。等待合法提供的版本匹配可分析构建或权威规格/去敏向量；PDB单独不恢复缺失代码。

<a id="game-consumer-v1"></a>
## 当前Code11命令行消费者核验（stage76 / 2026-10-27）

**事实：** 固定`cg_se_3000.exe` SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126`已重新核验。REA6.7.0/Ghidra12.1.4当前无该hash留存记录，新增两份函数dossier、4次xref及1次所属函数查询，共7记录导出/快照后关闭。`1179000..1179193`在`1179053`取GetCommandLineW、`1179059`存`1265d9c`；`1194850..11952a4`在`119489e`读取，`11948a7`构造文本、`11948be`调用文本helper`11943b0`。[完整证据ID、私有导出hash和覆盖范围](../analysis/game-consumer-v1/static-spec.json)。

**事实：** 后一函数引用13个UTF16LE开关，包括REGISTER、UNREGISTER、FIXCLOCK、SERVER、ARMDEBUG=；13个PUSH目标及13个字符串、5个指令锚点和3个ASCII交接常量共34项源字节核验通过。[可重跑审计](../analysis/game-consumer-v1/verify_source.py)、[结果](../analysis/game-consumer-v1/source-audit.json)。SERVER/TRANSFER字面量不证明游戏服务器/传送语义。该函数high-pcode截断，至少省1个operation；599条assembly保留于私有导出，不作完整数据流结论。

**推测：** 这一路与载入器/许可维护相容，不足以认作游戏argv解析；没有识别具体保护器，也没有继续分析、实现或改变许可/保护算法。**待验证：** 原`.text`无文件字节；Ghidra对`CGSharedMem@5b1874/gid:@5b1880/glt:@5b1888`返回空的已解析引用，不能排除间接/编码/重建引用。匿名4096B映射仍不能替代命名256B消费者。

本阶段不新增猜测的游戏接口，不重跑原程序/旧失败探针。需合法提供的匹配可分析构建、权威协议或去敏参考向量；CrossGate.pdb应先核GUID `ce363f7c-dd81-45c7-9944-f0402388bd13`/age1，PDB本身不能恢复缺失代码，当前REA也不支持调用者指定PDB。已询问本地材料路径，未扫描私人目录或下载符号。现有工具可正常工作，未补装无关依赖。[验收与未运行项](../analysis/game-consumer-v1/validation.json)。

调查日期：2026-10-24 UTC。范围仅限用户提供的 `moli/CrossGate_Setup.exe` 及其中离线解出的少量文件。没有执行安装包或任何 PE，没有连接内嵌地址，没有登录或读取账号会话，没有脱壳、补丁修改或绕过认证/保护。官方文件只解到 `/tmp/moli-analysis/crossgate`，本交付只含分析元数据、工具输出与自行编写的扫描脚本。

## 已证实的安装内容

- 安装包 SHA256：`e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983`；1,104,268,439 bytes，PE32/i386。
- `innoextract 1.9 --list` 报告 Inno Setup 6.1.0 Unicode，产品标题“魔力宝贝”。清单为 2,368 项：42 `.bin`、1,286 `.dat`、309 `.wav`、38 `.cgp`、341 `.cut`、337 `.aut`、7 `.exe`、4 `.dll` 等。完整证据：[安装内容清单](../analysis/crossgate-inventory.txt)。
- 7 个 EXE 中 6 个位于 `app/`，另一个为 `tmp/POLCN_Setup.exe`。这证实主安装包内嵌平台安装包，不证实安装时具体执行顺序。
- `app/` 内客户端为 `cg_item_6000.exe`、`cg_se_3000.exe`、`cg_se_6000.exe`，另有 `Patcher_PUK3.exe`、`Config.exe`、`CG5Reg.exe`。不能仅凭命名认定它们对应当前哪一个官方区服或版本。
- `innoextract` 的 `--include` 在本机使用精确路径成功；最初的 `app/*.exe`/`app/*.dll` 没匹配文件，已改为精确名称再次提取。未做全包安装、完整资源解包或联网补齐。

## PE 模块与原生迁移证据

10 个选中的 PE 都是 Machine `0x14c`、Optional Header `0x10b`（x86 PE32）。[模块大小/哈希/入口/证书目录](../analysis/game/modules.json)、[节头与偏移](../analysis/game/pe-sections.json)。

| 模块 | bytes | SHA256 |
|---|---:|---|
| cg_se_3000.exe | 2,904,064 | `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126` |
| cg_se_6000.exe | 1,757,184 | `6e2ff83274561047129ef61cbda8b718e3806f68aeb5d36f3a9b5cd08df60a4a` |
| cg_item_6000.exe | 2,625,536 | `06447ec8e108ffc4153a1720e729d74cc37c39aee0da268ab7b144ba17d9a7e2` |
| Patcher_PUK3.exe | 578,560 | `195f3afda41f342147b0616a4c005a4cb308ae6869b52c4a558fded5f5d9aaa8` |
| Config.exe | 61,440 | `9389add9c04cbc6bd313a34098ed94aef11a866ba721c6ccf7f984973efa0f7d` |
| CG5Reg.exe | 13,824 | `c3baedb2f82a2da785e8d27e5d49560175f09f5a38319edb935995b8e7e228a9` |

**观察：**三个游戏 EXE 的原始 `.text` 节 `SizeOfRawData=0`，均另有 `.text1`、`.adata`、`.data1`、`.pdata`；例如 `cg_se_3000.exe` 的 entry RVA 为 `0xde6d1e`，并非原 `.text` 中。原导入表只列 KERNEL32/USER32/GDI32（另两个还含 COMDLG32/SHELL32）。

**推测与限制：**结构符合打包/保护后的载荷布局；未确认具体打包器，不能将静态导入表当作全部运行依赖，也没有恢复被打包的原函数。任何后续运行或绕过保护都不在本次授权内。

`cg_se_3000.exe` 可见 `.rdata` 字符串提供了下列可复核线索。偏移均为原文件 byte offset，证据文件为 [选取的字符串](../analysis/game/cg_se_3000.exe.strings.json)：

| 能力 | 文件偏移与观察 | 能下的结论 |
|---|---|---|
| 2D 渲染 | `0x3428` DIRECT_DRAW 错误；`0x3d84` `DDRAW.DLL`；`0x3db0` `DirectDrawCreate` | 存在 DirectDraw 初始化相关字符串；未验证哪条渲染分支正在使用 |
| 输入 | `0x3e20` `DINPUT.DLL`；`0x3e4c` `DirectInputCreateA` | 存在 DirectInput 动态加载相关字符串 |
| 音频 | `0xd915` `initDSound() Start`；`0xeb9a` `DirectSoundCreate Start`；`0x290d6` `DSOUND.dll`；`0x29142` `WINMM.dll` | 存在 DirectSound/WinMM 线索；WAV 资产与音频配置另有实物清单支持 |
| IME | `0x290c0` `IMM32.dll` | 存在 Windows 输入法库名称，不等于已恢复文字输入逻辑 |
| 网络 | `0x290ca` `WSOCK32.dll`；`0xd1d0` `RECV ERROR=%d`；`0xd270` `CONNECT ERROR=%d`；`0xd2a4` `CONNECT OK` | 存在套接字接收/连接线索；未得出帧格式、加密、状态机或认证算法 |
| 资源寻址 | `0x55c4` `graphic_%d.bin`；`0x56a4` `graphicInfo_%d.bin`；`0x58f4` `anime_%d.bin`；`0x59c0` `animeinfo_%d.bin` | 与安装包内带版本编号的图形/动画文件命名一致 |
| 文件路径 | `0x35c4` `data\update.dat`；`0x5344` `Update.TXT` | 两条文件名字面量。固定旧版已证前者用于图形档位写入。该样本对两路径的具体操作仍待证。 [旧版写入依据](#legacy-render-device-preparation) |

安装包还附带 `d3drm.dll`、`d3dx9_43.dll`、`MFC71.dll`、`msvcr71.dll`。`d3drm.dll` 的实际 PE 导入包含 `DDRAW.dll!DirectDrawCreate`。这些库的存在不能证明三个游戏 EXE 都使用 Direct3D 9。macOS 原生迁移应把具体 API 替换为原生渲染/输入/音频模块，而非把 Windows DLL 包装称为原生。

PE 证书目录：六个应用 EXE 均为 `(0,0)`；`d3dx9_43.dll` 有证书目录（offset 1,992,192 / length 5,976）。这里只识别目录，未验证信任链、签名有效性或官方真实性。

## 更新与启动关系

`Patcher_PUK3.exe` 未表现为相同的零长度 `.text` 布局，常规导入包含 `WS2_32.dll`、`WININET.dll`、`WLDAP32.dll`；实际导入可见 `InternetOpenA`、`InternetConnectA`、`HttpOpenRequestA`、`HttpSendRequestA`、`HttpQueryInfoA`、`InternetReadFile`、`ShellExecuteA`/`ShellExecuteExA`，以及 CryptoAPI。证据：[GNU objdump 的导入表](../analysis/game/Patcher_PUK3.exe.objdump.txt)。

下列为**静态引用，不是当前可访问或正确的官方服务端确认**，没有向这些地址发送请求。证据：[更新相关字符串](../analysis/game/patcher-update-strings.json)。

- `Patcher_PUK3.exe:0x760fc`：`221.122.108.10`
- `Patcher_PUK3.exe:0x7610c`：`221.122.119.156`
- `Patcher_PUK3.exe:0x76124`：`/cg50/Update.TXT?t=`；`0x77f60`：`/cg50/`
- `Patcher_PUK3.exe:0x75c28`：`Update_Log.htm`；`0x76048/0x76050/0x76058`：`create` / `append` / `replaceto`
- `Patcher_PUK3.exe:0x75f98/0x75fc4`：公开网站 `https://www.polchina.com.cn` / `https://www.crossgate.com.cn`
- `cg_se_3000.exe:0xd4b4`：历史 HTTP 模板 `http://211.132.255.228%s`；`0xd518`：`EXE:Cg_%d%d.exe:`。

**推测：**补丁程序可能获取文本更新清单后执行创建/追加/替换操作。尚未恢复完整清单语法、完整性校验、签名策略、断点续传状态、最终游戏启动参数。字符串 `cmd.exe /c rd...` 和 `cmd.exe /c del...` 也存在，不能据此认定其具体删除范围；任何原生更新器都必须重新设计路径边界及事务恢复。

`Patcher_PUK3.exe` 包含大量 curl 风格 HTTP/FTP/SMTP/NTLM/SASL 等诊断文本；这些是通用库支持痕迹，不能据此声称游戏使用 Basic、NTLM、OAuth、FTP 或某种具体登录协议。未得到可游玩官方服务器的认证兼容性证据。

## 离线资源格式证据

### MAP01 结构

4 个独立样本都满足：

| 文件 | byte 长度 | u32le @12 | u32le @16 | 检验 |
|---|---:|---:|---:|---|
| map/0/1000.dat | 540,020 | 300 | 300 | `20+6×300×300` |
| map/0/101.dat | 240,020 | 200 | 200 | `20+6×200×200` |
| map/0/1011.dat | 5,420 | 30 | 30 | `20+6×30×30` |
| map/0/40000.dat | 48,020 | 100 | 80 | `20+6×100×80` |

- `offset0..3 = 4d 41 50 01`（`MAP` + `01`）；`u32le@4 = u32le@8 = 0`。
- 头部 20 字节后精确剩下 `6×w×h` 字节。无尾部多余字节。
- 将剩余数据按 3 个 `w×h` UInt16 平面观察时，第三平面常见 `0xc000` 附近数值；这是结构假说的支持，不是碰撞语义结论。
- 当前可以实现：固定 magic、保守尺寸上限、溢出检查、严格长度验证、只读原始数据。可以标记 width/height 为候选维度，但不应把三个平面直接宣称为“地面/对象/碰撞”或认定字序/空间坐标方向已确认。
- [四样本头部、SHA256、长度与统计证据](../analysis/game/map-observations.json)。

### GraphicInfo 结构

- `GraphicInfoV3_18.bin`：781,840 bytes，19,546×40 bytes。每记录 `u32le@4 + u32le@8 == 下一记录u32le@4` 的检查为 **19,545/19,545**；第一个 offset 为0，最后一条结束位置68,321,498。
- `GraphicInfo_Joy_22.bin`：332,320 bytes，8,308×40 bytes。相同相邻检查为 **8,303/8,307**，存在4处不连续，因此**不能把相邻记录无空洞作为通用格式规则**。
- 两者记录 `u32le@8` 均大于0。`i32le@12/@16` 常为负数，`i32le@20/@24` 常为合理像素尺寸，支持“偏移/宽高”猜测，仍未通过图形 payload 或渲染验证字段语义。
- 没有提取巨大 Graphic payload 做完整压缩解码，因此目前仅足以实现实验性只读索引检查，不足以实现正确贴图显示。
- [两种索引元数据](../analysis/game/resource-observations.json)、[V3 严格连续性观察](../analysis/game/graphic-index-observations.json)。

### 调色板与音频

- `palet_00.cgp` 为708 bytes（236×3）；`palet_logo02cn.cgp` 为768 bytes（256×3）。仅支持三字节颜色项猜测；RGB/BGR顺序、固定保留色/透明色规则仍未证实。
- `bgm.cf` 含行式 BGM 编号、相对 WAV 路径及数值字段；`soundaddr_1.txt` 含 `offset:length:filename.wav` 形状。例如前两记录从 offset0 长48,624、接着 offset48,624 长10,738；包内有 `sound_1.bin`。支持音效归档索引猜测，未解析完整 RIFF 内容及播放参数。
- 不能将这些事实推导为已完成官方资源授权或完整资源兼容。交付不包含任何官方图像、地图、声音或二进制。

## 工具结果与限制

- **成功：**`innoextract` 两轮精确选择解包（退出0），4个 MAP 与2个 GraphicInfo 结构检查，10个 PE 静态头/哈希/导入读取。
- **成功：**REA 6.7.0 `inspect-pe-resources` 对6个应用 EXE 返回完整 Evidence。比如 `cg_se_3000.exe` 的 Evidence ID `ev_02bc121cd9b693146fdacd042fa5a4d4457aae97086e5055ec62f834eada1d0a`；Patcher 为 `ev_848a39644dffe724730bf722e7b1626af3b0cc013b401d0c962e97ab850940e0`。记录包含资源类型、文件偏移、长度及SHA256，未导出资源内容。
- **失败/受环境限制：**REA `inspect-with-objdump` 与 `execute-rizin-command` 返回 `capability_unavailable`、`Unable to run configured command (unknown error)`；保存了原始失败JSON，没有改变审批/工具安全设置，也没有重复相同失败请求。独立 GNU objdump 2.47 静态读取成功，可作为补充工具证据，不能标成 REA 成功。
- **失败/受环境限制：**REA capabilities 触发 provider readiness，Ghidra 的编译缓存权限问题仍在该输出中；完整函数分析未在本分支完成。未因此运行游戏或执行脱壳。
- **未运行：**安装、启动游戏、GUI、实际图像解码、声音播放、联网更新、登录认证、任何官服通信、官方会话抓包、反作弊兼容。

复核入口：[自写只读 PE/字符串扫描脚本](../analysis/game/scan_game.py)。它只读取 `/tmp/moli-analysis/crossgate/app` 并调用 objdump，不执行被分析模块。其结果不是正式协议规范。

## 可推进与尚缺

可立即推进离线原生包：MAP01 受限结构读取、实验性 GraphicInfo 只读索引、使用自制图像/地图的渲染与输入、独立模拟会话状态机。原生更新、资源解码与会话层应接口隔离。

官方联机仍缺：确定合法授权条件；当前客户端/区服与最新资源版本；平台到游戏的完整启动参数与票据交接；当前协议帧/编码/压缩/认证与版本协商；游戏状态与战斗规则；服务端完整性要求；官方允许的测试方式。静态 DLL 名和内嵌地址不能填补这些缺口。


## 第三阶段补充：真实导入和游戏侧停止边界

三游戏的原`.text` SizeOfRawData均为0；13个真实导入descriptor/651个符号中没有WinSock/WinINet网络导入。se3000中的网络词串、CGSharedMem/gid:/glt:是保留字面量，不是已恢复的消费者/网络链。所检查MapViewOfFile局部链为匿名0x1000映射，不能与登录器的命名0x100映射混同。静态未见网络导入不证明程序没有联网能力。

Patcher单独确认了入口/Update.TXT构造和HTTP函数，但两者间虚分派选择未完全闭合；更新网络不能代替游戏数据协议。完整样本哈希、节/入口/IAT与置信度见[游戏边界](../analysis/protocol-v3/game-network/packed-boundary.md)，集成关系见[逻辑/协议规格](logic-protocol-spec.md#第三阶段消费者启动与网络边界)。没有执行游戏、动态脱壳或访问运行共享内存。

## Windows ARM取证环境的兼容边界补充（2026-10-25）

v5在未执行客户端的前提下，对既有10个游戏EXE/DLL及登录器原/已解压副本共12个PE重新核对hash和头字段，均为x86 PE32（Machine 0x14c、Magic 0x10b），与原证据一致。三枚游戏不是ARM64原生程序；Windows 11 ARM用户态仿真只使其成为可调查候选，不证明可运行或连接官方服务器。

两份安装清单未列.sys/.inf/.cat，但两枚游戏导入DeviceIoControl；另有清单中的ApexClient.Dat尚未在明确临时目录解出。没有穷尽嵌入内容、动态载荷或后续更新，不能排除内核依赖，也不能凭文件名或设备API推断反作弊。7处旧DirectDraw/DirectInput/DirectSound/WinMM字节锚点及随包d3drm的DirectDrawCreate真实导入已复核。完整样本hash、文件/导入偏移、证据与架构停止门槛见[ARM客户端兼容性证据](../analysis/vm-install-v5/arm-client-compatibility.md)和[JSON](../analysis/vm-install-v5/arm-client-compatibility.json)。

当前VM只安装必要网卡驱动流程，显示仍为virtio-ramfb，无实验图形驱动；Windows联网不替代旧API和游戏验收。确认只有x86/x64内核驱动且无合法ARM64版本时停止该ARM尝试，另评估合法环境；普通OOBE、来源/签名问题和一般DLL错误须各自记录，不自动归因架构。未新建x86 VM、运行游戏或改变既有静态协议结论。


## 首次有界动态补充（v20，不替代静态链）

固定hash `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126` 的cg_se_3000.exe在断网Windows11Pro24H2 ARM64中完成一次普通无参数进程创建，PID600，约16秒观察窗口内退出；同PID两条Application Error1000，c00001a5/c0000005、模块unknown。未取得调用栈、模块、数值退出码或协议，不能判定ARM、缺资源或交接为根因，更不能说明可游玩。下一证据仍是GetCommandLineW消费者和登录器交接如何进入游戏网络层；不补造参数、不补装后重试。[有限观察与边界](vm-environment.md#v20-first-client-probe)。


## stage37：游戏消费者的最后有界静态可行性核验

**样本/方法：** 固定`cg_se_3000.exe` SHA256 `9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126`，只复用既有PE/导入边界并补查文件后备的命令行指针、导入跳板和符号/TLS元数据。14/14短字节/字符串/CodeView锚点通过。[完整偏移、方法与边界](../analysis/protocol-v3/game-network/static-feasibility-20261026.json)。没有恢复/仿真/解密保护载荷，不读运行内存，不运行样本或联网。

**事实：** `1179053`通过GetCommandLineW IAT取指针，`1179059`缓存到`1265d9c`；`119489e`读该指针并进入文本helper。`11d8458`另有同API跳板，所查文件后备执行节未见到它的E8直接调用候选。它们是可继续定位的静态候选，不是已识别游戏argv/票据消费者。已读启动区的间接派发槽`1265dbc/1265db8/1265ed4`磁盘初值为0，不能当真实运行目标。

原`.text`仍无磁盘字节，既有CGSharedMem/gid:/glt:字面量仍未连到socket；匿名4096B映射不能充当命名256B消费者。当前无文件overlay/COFF符号/CLR/延迟导入；TLS磁盘回调表首项为0，不代表所有运行初始化不存在。CodeView只给出`CrossGate.pdb`，GUID `ce363f7c-dd81-45c7-9944-f0402388bd13`、age1；清单没有显式.pdb/.map项，没有扫描用户其他目录、查服务器或保留厂商原始路径。

**调试风险事实与限制：** 可见函数`1197100`能通过LoadLibraryA(`Kernel32`)/GetProcAddress(`IsDebuggerPresent`)形成检测调用。没有证明正常入口是否执行这条分支，更不命名为特定反作弊；没有修改检查、隐藏调试器或强行附加。未来观测若因保护/访问限制受阻应停止，不能把此分析当绕过授权。

**本路线停止：** 本次普通静态核验未能可靠闭合`argv/CGSharedMem→socket`。这不证明所有静态分析永远不可能；但不能将可读启动helper或文件无后备区域补造成协议。可在取得合法、匹配GUID/age的PDB、可分析构建或权威规格后继续离线；当前材料没有该证据，不进行解保护或重复全量扫描。

**最小动态证据提案（未批准/未执行）：** 只可能在正常合法完整启动路径下定位元数据：固定启动器109b…（requireAdministrator）、固定游戏9baa…（asInvoker但可继承父令牌），以及已知潜在Updater4c46…必须逐项界定执行/联网/自动改写风险。先明确完整资源、恢复隔离与当前更新前提，不重复已知离线失败探针。若官方支持正常诊断，可考虑进程/模块身份、生命周期和API调用点/返回地址；不读命令字符串、映射内容、认证数据、缓冲、全内存或包。附加权限、联网、登录、额外程序/驱动/条款、检测告警或拒绝即停；不复用旧批准、不伪造参数。仅有元数据仍不能恢复帧与认证，下一步还需要合法授权的规格/去敏向量。

**授权内真正可实现的依赖：** (1) 消费现有文件计划与显式inventory快照，检测已知配置文件缺失/歧义；不扫描用户目录、不宣称全安装ready。(2) 把四样本已证MAP01的20B头/尺寸/精确6wh不透明体移入shared，只读边界和恶意合成向量，不猜平面/碰撞语义。这两项支持安装与资源链，但不替代当前网络消费者主阻碍，均未在本轮另起实现。


## stage40：ApexClient.Dat容器与直接引用边界

**事实：** 固定500154B样本SHA256 `89fe1c4a907a06c68630b326c339240048272c927599f4e35aeaac8a39ca213c`，偏移0为`1f8b0800`标准gzip/deflate，尾8字节@500146的CRC32为`fe667921`、ISIZE706686。Python3.9.6/zlib1.2.12在16MiB输出/100倍宣告膨胀预算内只处理一个完整标准流，EOF、无尾部及CRC/长度校验通过；内层SHA256 `668a1ab9143b9142c9e05b62ce6714131d7eb35fdf021b4ee69410962c29fb60`，首4字节`d6f83fe7`不是普通PE/ZIP头。内层未落盘，未继续解码/解保护/执行。[完整方法、身份及结果](../analysis/diagnostic-preparation-v1/apex-static.json)。

六个源EXE（se3000、se6000、item6000、Patcher_PUK3、Config、CG5Reg）按各自hash绑定搜索ASCII/UTF16LE大小写不敏感的`apexclient.dat`及`apexclient`直接字面量，均无命中。**待验证：** 具体加载者/内层格式、是否代码及架构/签名仍未知；负结果不能排除间接/组装/编码/重建引用或DLL消费者，不能命名反作弊或判为无害数据。此有界路线到此停止，不通过解码保护或运行补齐未知。

