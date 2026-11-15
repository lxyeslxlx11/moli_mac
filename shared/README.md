# 跨平台离线解析与目录计划核心

<a id="stage221"></a>

<a id="stage221-ordinary-chat"></a>

## stage221 共享地图聊天与小队模式

**事实**。共享核心处理 K0c、Cz> 和 DMK 的普通记录，校验文字、显示参数和本机聊天时钟，并构造 )bX 与 *(2。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-chat-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-chat-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-members"></a>

### 前序检查点 · 共享家族邀请和成员操作

**事实**。家族模块从名单和称号表确定允许操作，普通世界检查邀请目标。三个消息通过现有会话编码与发送路径，成员状态由入站更新。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-members-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-members-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-management"></a>

### 前序检查点 · 共享家族资料、权限和成员名单

**事实**。共享层处理六条入站消息，维护资料、称号和名单。用收到的自己称号权限检查 7nu 与 80i，并保留旧家族兽的选字段行为。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-management-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-management-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-family-pet"></a>

### 前序检查点 · 共享家族兽与饲料箱

**事实**。共享地图对话读取 Y&3 权限和 Q?m 0x20、0x22 窗口，校验当前槽位和修订，分开构造喂食、改名、物品存取与关闭。

[本轮计划](../analysis/game-battle-shared-storage-v1/family-pet-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/family-pet-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-bank-storage"></a>

### 前序检查点 · 共享仓储窗口

**事实**。共享地图对话解析 0x17 与 0x21 的 A/I/P/G 记录，并校验物品、宠物、金币操作与窗口归属。适配层沿用普通地图协议回复。

[本轮计划](../analysis/game-battle-shared-storage-v1/bank-storage-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/bank-storage-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-special-dialogs"></a>

### 前序检查点 · 共享地图专用窗口

**事实**。地图对话状态包含交接入口、双项回复、外观草稿及指定图形。共享层完成校验和命令构造，画布、输入控件及文件选择由平台拥有。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-special-dialogs-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-special-dialogs-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pet-training"></a>

### 前序检查点 · 共享宠物训练

**事实**。三个窗口分开解析和回复。同一 NPC 的前一步选择绑定后续流程。原宠物槽和技能栏的编号独立，只有服务器记录变更金币和技能。

[本轮计划](../analysis/game-battle-shared-storage-v1/pet-training-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pet-training-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-npc-services"></a>

### 前序检查点 · 共享 NPC 入口与技能师范

**事实**。共享对话状态解析五种 NPC 窗口。金币、栏位与技能排序复用现有状态拥有者，遗忘按原占用槽位序号回复并核对技能表修订。

[本轮计划](../analysis/game-battle-shared-storage-v1/npc-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/npc-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-dialog-services"></a>

### 前序检查点 · 共享治疗与对话图形

**事实**。共享对话拥有者按原始位置返回治疗选项，绘制计划从当前资源目录解出对话图形和动画，不需要浏览器 API。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-dialog-services-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-dialog-services-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-player-trade"></a>

### 前序检查点 · 共享玩家交易与报价复核

**事实**。玩家交易由共享世界状态持有，发布前读取背包、宠物和金币记录。物品报价按槽版本校验，宠物报价按名册版本校验。

[本轮计划](../analysis/game-battle-shared-storage-v1/player-trade-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/player-trade-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-message-board"></a>

### 前序检查点 · 共享留言板与操作版本

**事实**。模式 0x15 的条目、翻页许可和删除权限保留在地图对话状态，发布、翻页和删除走原回复队列。

[本轮计划](../analysis/game-battle-shared-storage-v1/message-board-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/message-board-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-conversion"></a>

### 前序检查点 · 共享单项给予与限量规则

**事实**。模式 0x1f 的单个数量行采用配额或持有物品和金币约束，通过地图商店拥有者发送带固定前缀的数量。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-conversion-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-conversion-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-exchange"></a>

### 前序检查点 · 共享物品兑换与容量规则

**事实**。兑换模式使用入站物品代码与数量计算余额和容量，通过商店拥有者发送原行号和数量。付款腾格按照背包槽序计算。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-exchange-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-exchange-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-shop-service"></a>

### 前序检查点 · 共享鉴定、修理和物品说明

**事实**。共享核心用现有商店和物品拥有者处理鉴定、修理和物品说明。每槽一次，费用检查和发送前的槽位复核与普通商店复用。

[本轮计划](../analysis/game-battle-shared-storage-v1/shop-service-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/shop-service-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-map-shop"></a>

### 前序检查点 · 纯字节商店解析与核价

**事实**。共享核心解析 Q?m 的普通买卖窗口，从现有状态读取金币和背包，核对后通过 /1I 发送。有效购买按商品原行号，出售按绝对背包槽。金币与背包继续由各自的入站消费者更新。

[本轮计划](../analysis/game-battle-shared-storage-v1/map-shop-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/map-shop-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-interaction"></a>

### 前序检查点 · 共享角色查找与对话会话

**事实**。世界根据活动身体的逻辑格与掩码 8 查找角色。收到普通 `Q?m` 后，由拥有者处理菜单或文本回复，检查窗口修订和当前坐标再发送 `/1I`。

**事实**。地图交互、拾取和服务器对话使用同一普通场景与会话。原版专用图文和其余模式继续追踪。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-interaction-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-interaction-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ground-pickup"></a>

### 前序检查点 · 共享普通转身和地面拾取

**事实**。普通右键按下可产生大写方向转身和 `&?S` 拾取请求。各自使用独立 500 毫秒冷却，目标资格由活动演员记录和逻辑格决定。

**事实**。`H#|` 中图形物品和数值物件的类型分别为 2 与 4。`IZL` 删除地面记录，`?l)` 继续负责背包。

[本轮计划](../analysis/game-battle-shared-storage-v1/ground-pickup-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ground-pickup-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-targets"></a>

### 前序检查点 · 共享特殊用物、丢弃与卸武器

**事实**。普通客户端支持 `useInventoryItemOnItem` 与 `dropInventoryItem`。战斗 `weapon-remove` 使用同一会话物品状态和正常人物动作完成路径。

**事实**。95 个文件的 1,267 项源码回归与生成核心 80 项测试通过。四套构建核对 739 个输入和 34 个输出，外部导入为零。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-targets-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-targets-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-ordinary-items"></a>

### 前序检查点 · 地图与战斗的共享物品槽

**事实**。地图直接使用和本地槽移动接入 `createLegacyGameClient`。战斗使用第 12 字段分类，普通使用第 5 字段编码与第 6 字段资格，拆分读取第 13 字段数量。

**事实**。95 个测试文件的 1,264 项源码回归和生成包 78 项测试通过。四套构建核验 739 个输入和 34 个输出，外部导入为零。

[本轮计划](../analysis/game-battle-shared-storage-v1/ordinary-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/ordinary-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-item-input"></a>

### 前序检查点 · 共享战斗物品记录与输入

**事实**。共享 28 槽接收 ?l) 与 @Y)，使用修订号约束待发送选择。输入复用目标计算和原版 I/Q 编码。94 个测试文件的 1,250 项源码回归和生成包 76 项测试通过。四套构建核验 739 个输入和 34 个输出，外部导入为零。

**待验证**。普通场景背包、卸下武器和完整平台行为。

[本轮计划](../analysis/game-battle-shared-storage-v1/item-input-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/item-input-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-mp-items"></a>

### 前序检查点 · 战斗 MP 与物品队列

**事实**。共享收包核心执行 CFP 的 MP 减法和 ITM0/7 的实际动作序列。回复使用现有的目标回调与数值反馈，ITM7 使用角色动画。93 个测试文件的 1,244 项源码回归和生成包 73 项测试通过。四套构建核验 735 个输入和 34 个输出，外部导入为零。

**待验证**。物品输入及其余战斗与平台行为。

[本轮计划](../analysis/game-battle-shared-storage-v1/mp-items-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/mp-items-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-actor-transitions"></a>

### 前序检查点 · 共享战斗变身及退场

**事实**。REB 共用元素回调、四元组和既有跟随对象。PLV 用两个 CRT 随机取值确定退场点，并在动作 49 完成时从战斗中删除角色。92 个测试文件的 1,238 项源码回归和生成包 67 项测试通过。四套构建核验 735 个输入和 34 个输出，外部导入为零。

**待验证**。原版其他渲染后端、对象引用重叠及其余命令。

[本轮计划](../analysis/game-battle-shared-storage-v1/actor-transitions-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/actor-transitions-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-friend-roster"></a>

### 前序检查点 · 好友名单及 C/MON 标记

**事实**。共享核心读取 @t- 与 B8S，维持会话内 320 行，明细请求按槽号升序准备。C、MON 和既有元数据回调共用对侧匹配。

**待验证**。原生文件缓存和切换角色后的名单区。91 个测试文件的 1,232 项战斗回归及生成包 61 项专项通过。四套构建核验 735 个输入及 34 个输出，外部导入为零。

[本轮计划](../analysis/game-battle-shared-storage-v1/friend-roster-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/friend-roster-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-effects"></a>

### 前序检查点 · CHT/BST、共享计时和退场收尾

**事实**。共享核心消费聊天、时间和退出尾部记录。Xz@ 使用注入时钟。copyBattleChat 返回独立字节快照，结束会话时清零共享环。

**待验证**。其余共享状态、原生音频和替代渲染。90 个测试文件的 1,228 项战斗回归及生成包 58 项专项通过。四套构建核验 731 个输入及 34 个输出，外部导入为零。

[本轮计划](../analysis/game-battle-shared-storage-v1/side-effects-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/side-effects-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-weather"></a>

### 前序检查点 · SKL401 共享天气和目标效果

**事实**。SKL401 已接入正常战斗收包。带结果位 0x80000 的目标按源队列产生 30 次效果。雨开启时逐帧生成，归零后已有雨滴继续移动。提前退场会清掉仍开启的雨。 89 个测试文件的 1,223 项战斗回归及生成包 53 项专项通过。四套构建核验 727 个输入和 34 个输出，外部导入为零。

**待验证**。剩余共用消费者、完整独立状态模型与替代渲染。

[天气实现计划](../analysis/game-battle-shared-storage-v1/weather-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/weather-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-pursuit"></a>

### 前序检查点 · SKL400 共享追踪和离场

**事实**。SKL400 已接入普通 M 收包。施法中途信号启动追踪，目标按结果位闪避、显示提示、随追踪对象移动后归位或离场。离场时同步更新战斗登记与名单。 88 个测试文件的 1,216 项战斗回归和生成包 46 项专项通过。四套构建核验 723 个输入及 34 个输出，外部导入为零。

**待验证**。SKL401 天气及完整独立对象模型。

[追踪与离场计划](../analysis/game-battle-shared-storage-v1/pursuit-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/pursuit-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage221-side-casting"></a>

### 前序检查点 · SKL402 共享施法和目标效果

**事实**。SKL402 已接入共享战斗流程。选择器为零时扫描 0–9 槽，非零时扫描 10–19 槽。登记中的倒地角色也参与。施法自然完成后放行目标，各自等到效果结束才释放。 87 个测试文件的 1,209 项战斗回归与生成包 39 项专项全部通过。四套构建核验 723 个输入和 34 个输出，外部导入为零。

**待验证**。SKL400、401 剩余消费者和完整独立对象模型。

[侧选施法计划](../analysis/game-battle-shared-storage-v1/formation-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/formation-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

### 前序检查点 · 同槽恢复与 SKL405 共享核心

**事实**。SKL404 同槽交接保留两次登记，在第 7,201 次忙碌检查时追加 11、38 归位动作，随后释放命令并结算。技能等级取编号个位，40491 走等级 1。 SKL405 已接入施法回调。真实动画信号按序更新目标的 1d0、主体资源和链接对象，背景图元完成 255 次透明度递增后交给下一次背景刷新。 86 个文件的 1,204 项回归及生成包的 34 项专项全部通过。四套构建核验 723 个输入与 34 个输出，外部导入为 0。

**待验证**。完整独立对象模型、原生后端和设备验收。

[恢复与变形计划](../analysis/game-battle-shared-storage-v1/recovery-plan.json) · [REA 字节核验](../analysis/game-battle-shared-storage-v1/recovery-source-check.json) · [阶段验证](../analysis/game-battle-shared-storage-v1/validation.json)

<a id="stage220"></a>

## stage220：无平台CMB与六状态横幅

**事实**：固定37c4旧样本的CMB（opcode8）已接入shared实际四阶段命令执行。依次准备参与者、等待动作70到齐、按源计数器放行、再由434b90等待归位与释放；普通结果先累计32位有符号伤害，1038标记让前序命中只产生反馈，最后一次扣累计HP。没有生成动作53或MP扣费。

**事实**：合击横幅按最后参与者所在队侧选择方向，人数上限10，创建9或10个原始静态字块及每块两个整数盒，保留六状态速度、延迟、隐藏标记、读取/重编码、寿命和第十块声音。controlFlags的404掩码或单人合击不创建横幅，也不要求横幅资源。420c50与4210e0为canonical；420e50是独立分析副本中恢复并核验617B/171条指令的derived回调，未升级为canonical或新增Evidence。

**待验证**：CMB首个RID3之前的原生第四元组字来自未初始化栈，本实现使用明确标记的portable0，不宣称原字节为0；空参与者、缺身体及超过20人会触及未证实上下文或原生命令存储重叠，显式拒绝。完整原生CMB、对象池/指针/全局RNG/x87/调度/声音/完整渲染、其余共用105c/13b4消费者和159、好友表423500及完整游戏仍须继续。网页截图使用原创小像素夹具，不代表完整游戏画面；手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮无VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-combination-v1/implementation-plan.json)、[规格](../analysis/game-battle-combination-v1/implementation-spec.json)、[源核验](../analysis/game-battle-combination-v1/source-check.json)、[源修正](../analysis/game-battle-combination-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-combination-v1/test-results.json)、[验收边界](../analysis/game-battle-combination-v1/validation.json)、[完整剩余目标](../analysis/game-battle-combination-v1/goal-audit.json)、[交付审计](../analysis/game-battle-combination-v1/delivery-audit.json)。



<a id="stage219"></a>

## stage219：附带RID纯字节与逻辑交接

**事实**：固定37c4旧样本的附带RID0生产者4236d0及动作221已进入shared。每条21字段，名称上限28字节、两组有符号HP/MP、状态与资源按源保留；创建两个隐藏且暂不回调的身体、8个整数盒及16字节逻辑交接对象，再向旧身体追加221和[a,0,a,b]。它与结果RID三资源字属于不同语义。

**事实**：新独立方程覆盖53场景、13,799帧状态、完整拥有存储及1,098帧RGBA；50条身体结算，same-a-multiple有界等待，same-a-b子对象移除与element159两条显式消费者边界分别保留。缺少骑手、当前槽位上下文及未覆盖角色标记原子拒绝；135等共用105c指针分支显式停止，未借独立chant/projectile映射伪造原生共享指针。

**待验证**：本轮为附带RID的有限逻辑交接切面，完整attachedRID/CMB、其他共用105c/13b4状态和159元素分支、好友表423500、原生对象池/指针/全局RNG/x87/调度/声音/渲染、其他处理者及完整游戏仍须继续。页面/TCP验证使用普通本地玩家加独立骑乘受击者；本地玩家骑乘时保留实际骑宠菜单。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未验收，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-attached-rid-v1/implementation-plan.json)、[规格](../analysis/game-battle-attached-rid-v1/implementation-spec.json)、[源核验](../analysis/game-battle-attached-rid-v1/source-check.json)、[源修正](../analysis/game-battle-attached-rid-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-attached-rid-v1/test-results.json)、[验收边界](../analysis/game-battle-attached-rid-v1/validation.json)、[完整剩余目标](../analysis/game-battle-attached-rid-v1/goal-audit.json)、[交付审计](../analysis/game-battle-attached-rid-v1/delivery-audit.json)。



<a id="stage218"></a>

## stage218：73共有字节核心

**事实**：固定37c4样本的73类variant0已接入共有近战生产者424310；十个等级都以38/53开始，不加入147，按实际M记录扣一次MP。护卫、RID元数据、反射/治疗/跳过、击倒、普通后续记录与自身目标保留原始动作顺序。73没有14专用资源映射，普通命中使用1adb1～1adb3随机效果。原先73的variant1/2/3仍走独立远程路径，不增加近战MP扣费。

**事实**：4,640组独立队列、136条轨迹、50,158帧状态与10,580帧完整RGBA对照通过，118条身体自然结算、2条本地244退出、16条有界等待分别记录。22条实际管理器流程为17条自然回合、4条既有7201恢复和1条退出。额外回归旧73远程变体7,680队列、15轨迹、4,108状态、310帧RGBA；132份旧生成器与金样文件均未改变。

**待验证**：本轮只闭合有限73近战切面。完整共有物理家族/所有消费者、113嵌套与前置差异、radial238、attachedRID/CMB、其他游戏处理者、原生指针/全局RNG/x87/渲染/UI/声音/调度，以及完整游戏仍须继续。手机真机、微信原生gamePage/DevTools/设备、当前版本及官服兼容尚未验收，仍无测试账号。本轮没有VM、原程序、账号或官服操作；完整目标保持active。

[需求计划](../analysis/game-battle-pair73-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair73-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair73-v1/source-check.json)、[源修正](../analysis/game-battle-pair73-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair73-v1/test-results.json)、[验收边界](../analysis/game-battle-pair73-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair73-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair73-v1/delivery-audit.json)。



<a id="stage217"></a>

## stage217：260共享字节与回调

**事实**：按固定37c4样本的424310与40a120接入260首对生产者、201/203移动朝向、204第二目标和14主命中，十个等级、守护、RID、普通后续记录及255结束标记均有独立证据。204在dead*14+24帧处理第二目标，先保存原攻击者再替换父关联；主攻击1af89朝向0，原攻击者仍为260/9时连击朝向1。202单独验证为“元组slot与flags坐标”，不是amount；260生产者并不发出202。

**事实**：独立模型4,640组队列、191条轨迹、66,189个状态和21,374帧受支持RGBA比较通过；167条身体结算、2条本地244、18条有界等待、2条保留图形0错误与2条201上下文错误分开记录。21条真实管理器路径为18条自然回合、2条既有7201恢复及1条退出。130份旧生成器/金样未改；原188条本轮轨迹也完整保留，另增3条普通信号资源轨迹。

**待验证**：260正常原生指针/全局上下文、前置与运行顺序差异、压力信号与自身/守护别名正常完成、保留图形0仍未闭合；配对73、113嵌套/RID、radial238、attachedRID/CMB、其他处理者、完整渲染/UI音频/RNG/x87/调度及完整游戏继续 required。手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容尚未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标保持active。

[需求计划](../analysis/game-battle-chain260-v1/implementation-plan.json)、[规格](../analysis/game-battle-chain260-v1/implementation-spec.json)、[源核验](../analysis/game-battle-chain260-v1/source-check.json)、[源修正](../analysis/game-battle-chain260-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-chain260-v1/test-results.json)、[验收边界](../analysis/game-battle-chain260-v1/validation.json)、[完整剩余目标](../analysis/game-battle-chain260-v1/goal-audit.json)、[交付审计](../analysis/game-battle-chain260-v1/delivery-audit.json)。



<a id="stage216"></a>

## stage216：105动作序列与共享状态

**事实**：固定37c4旧样本的105首条pair/variant0及真实156/97/98已接入shared，保留前置蓄力、残影、速度25、逐次动画反应和声音，再由14统一结算HP/RID。游标属于同一客户端播放所有者，在两个施术者之间共享；自身反应中断后保留1，清理身体后下一次从动作8继续，完成时才按源重置。既有正变体105路径保持。

**事实**：4640组队列、158条轨迹、63158帧状态、可渲染部分42058帧完整RGBA及两selector/拥有存储一致。141条身体结束、3条244退出、12条1800帧等待、2条渲染拒绝分别记录。七组真实交错游标流程通过，护卫延迟触及相对偏移209；十等级763次动画完成只在随后14结算一次HP。22条命令管理器流程含19次自然回合结束、2次现有超时恢复、1次退出，没有注入ready、游标或手动弹队列。此前128个生成器/golden字节不变。

**事实／待验证**：护卫后的RID后续记录在原创场景中令角色资源变为0；实际核心与独立方程在帧264/311一致进入当前帧控制器的LEGACY_BATTLE_FRAME_GEOMETRY。两个案例保留为渲染边界，未当作像素或正常回合通过。初始新模型未保留失败帧中新建残影的旧优先级17，曾错误地保留计算值16，现仅修正该边界快照；全部场景输入、队列、资源、geometry、拥有存储和成功RGBA保持，只有一条边界轨迹的最后状态改变。未放宽原渲染器或改旧golden。

**待验证**：260主护卫与串联字段在435000前置解析和424310生产者间的顺序差异、201..204完整链条，配对73、113嵌套前置/RID、自身别名正常等待、radial238、attachedRID/CMB和其他处理者仍未闭合。原生全局内存与竞态、保留图形0区域及完整渲染/对象池/RNG/x87/调度/UI音频、完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未操作VM、原程序、账号或官服；完整目标继续active，原32条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-context-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-context-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-context-v1/source-check.json)、[源修正](../analysis/game-battle-special-context-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-context-v1/test-results.json)、[验收边界](../analysis/game-battle-special-context-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-context-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-context-v1/delivery-audit.json)。



<a id="stage215"></a>

## stage215：94/257/262首条配对流程

**事实**：固定37c4旧样本的94、257、262首条pair/variant0队列及真实消费者已接入shared。94使用额外104c标量、78声音与96前置动画，再由14按字面优先级分派条件和HP；257/262保留73/74、最高级tile2/3、额外效果及262的205冲刺和1af89朝向1。护卫、RID旧第四字、E000、别名自身与普通后续记录分别核对。0x106=262、0x10a=266的先前纠错保持；本轮没有新增平台专用功能。

**事实**：41760组队列、307条轨迹、71230帧状态、32260帧完整RGBA及两selector/完整拥有存储与实际共享核心一致；286条身体结束、6条244退出、15条1200帧等待分开记录。18条真实命令管理器流程含12次自然回合结束、5次现有超时恢复、1次退出，未注入ready或手动弹队列。初始新模型遗漏44对子效果的清理，已按既有源码修正；37440组原队列、289条原轨迹输入、原创资源和geometry保留，8条预期轨迹改变，另增18条优先级轨迹。此前126个生成器/golden文件字节不变。

**待验证**：完整原生对象池、全局RNG/x87/调度/UI音频/渲染及其他处理者和完整游戏、手机真机、微信原生gamePage/DevTools/设备、当前版本与官服兼容仍未完成，仍无测试账号。本轮未执行VM、原程序、账号或官服动作。完整目标继续active，原31条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-special-pairs-v1/implementation-plan.json)、[规格](../analysis/game-battle-special-pairs-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special-pairs-v1/source-check.json)、[源修正](../analysis/game-battle-special-pairs-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special-pairs-v1/test-results.json)、[验收边界](../analysis/game-battle-special-pairs-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special-pairs-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special-pairs-v1/delivery-audit.json)。



<a id="stage214"></a>

## stage214：266配对生产者回归原始普通路径

**事实／纠错**：原424310的`0x106`是262，`0x10a`才是266。旧实现和独立模型曾把262的205冲刺、最高等级73/74套给266；本轮修正shared的配对生产者及护卫路径，266恢复普通9接近。此前stage209相关“266/205”结论已被新证据纠正；正变体和自身266的独立规则继续区分。其余五类特殊pair并未因此启用。

**事实**：三套受影响独立模型完整重跑，原场景、队列输入、原创资源和geometry保持一致；仅266预期队列和21条轨迹改变。当前三套合计211195队列、603轨迹、138928状态、13600完整RGBA帧，两selector经实际核心核对。旧126个生成器/golden文件中6个发生本次明确修正，其余120个字节不变；历史修改前原件及源核验视图均保留。

**待验证**：94/105/257/260/262完整生产者与消费者仍须接入；105高等级/共享游标的真实上下文、260主护卫读取差异、113嵌套前置/RID、自身与别名等待、radial238、attachedRID/CMB、完整原生对象/RNG/x87/调度/UI音频/渲染及完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服兼容仍未完成；仍无测试账号。完整目标继续active，原30条剩余要求逐字保留并追加本轮结果。

[需求计划](../analysis/game-battle-pair-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-pair-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pair-specials-v1/source-check.json)、[源修正](../analysis/game-battle-pair-specials-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-pair-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-pair-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-pair-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-pair-specials-v1/delivery-audit.json)。



<a id="stage213"></a>

## stage213：96实际脚本与默认后端

**事实**：固定37c4旧样本的96首条pair/variant0生产者及75/76/80/89/90/92/93/94/95真实动作已进入shared，包含可见性/瞬移/冲刺、源HP置零、冻结、护卫及普通后续记录；正变体1/2/3仍沿用先前普通发射路径。

**事实**：92复制目标float坐标，角度减180并单次归一，speed50移动一次后朝向目标。93只在counter0执行一次动作3动画，speed6移动16次，第17次结束并把目标HP设为0；执行到该分支时不按收到的amount扣血，也不被108/E000/RID直接改成通用伤害/治疗。临时零值盒只消耗一次rand，已与背景另外两次RNG区分验证。95/94写目标2d4冻结位；78/79/80分别发出62/210/133声音事件，消息为5783。

**事实**：公开默认配置下72条轨迹自然收敛、2条244退出、6条保留1200帧等待。16条真实管理器验证得到9个自然回合、6个源超时恢复回合、1个退出；各命令与最终管理器分别计数，7201次忙等待触发恢复，纯回位等待不加计数。自身、护卫别名和连续反击的正常原生完成仍未闭合；未注入ready或手动弹动作来强行结束。

**事实**：96默认后端的4160组队列、80条轨迹、32959帧状态、11836帧双selector完整RGBA与实际共享核心一致。另两条替代渲染轨迹的927状态/578像素/50样式观察仅为独立源方程；实际公开配置仍报LEGACY_BATTLE_SKILL_CONFIGURATION，未放宽门禁、未计入运行或像素通过。当前仍无替代渲染/半透明后端的完整实现。

**待验证**：替代渲染配置/原生半透明像素、6条等待的正常前提、此前自身护卫正常完成、113嵌套前置解析和RID旧存储、其他特殊pair94/105/257/260/262、radial238、attachedRID、CMB、完整物理族及原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服兼容仍未完成；仍无测试账号。原29条剩余要求逐字保留并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-special96-v1/implementation-plan.json)、[规格](../analysis/game-battle-special96-v1/implementation-spec.json)、[源核验](../analysis/game-battle-special96-v1/source-check.json)、[源修正](../analysis/game-battle-special96-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-special96-v1/test-results.json)、[验收边界](../analysis/game-battle-special96-v1/validation.json)、[完整剩余目标](../analysis/game-battle-special96-v1/goal-audit.json)、[交付审计](../analysis/game-battle-special96-v1/delivery-audit.json)。



<a id="stage212"></a>

## stage212：嵌套纯核心与原始边界

**事实**：固定37c4旧样本的72/113首条嵌套生产者及真实232、5、56/57/58/61/79动作已进入shared，包含主目标/嵌套目标的双护卫、反射/治疗/跳过/组合位、游标和普通后续记录；24等待忙目标时的动画遗漏已按原始代码修正。

**事实**：232先移动并按距离/计数处理命中，HP位优先为108跳过正常处理、8000不改HP、4000治疗目标、2000反射伤害攻击者、普通伤害目标；全部先signed32运算再按源钳位。普通零值仅显示573b/57bb；反射会先弹自己与目标动作，组合位可在计数后重处理外层tuple。5实际移动16次，第17次才结束。未知嵌套RID旧存储上下文在写入前明确拒绝。

**事实**：独立9120组队列、261条轨迹、58154帧状态、4812帧双selector完整RGBA及前后200动作/800tuple存储一致；256条自然收敛、1条244退出、4条等待1200帧。13条真实管理器中8个自然回合、4个超时恢复回合、1个退出；各命令与最终管理器分别计数，7201次忙等待触发恢复，纯回位等待不加计数。双护卫自然完成不等于此前211自身护卫正常完成已解决。

**事实**：原435000只给72读取嵌套记录，且不把嵌套目标本身标成依赖（护卫会标记）；424310运行时同时处理72/113。保留原解析边界：113嵌套的4480组队列/104条轨迹仅为运行时命令夹具；可经真实前置解析的部分为4640组队列/157条轨迹。真实TCP/页面只验证72嵌套及113无嵌套，不将113嵌套标成协议兼容。

**待验证**：113嵌套前置解析差异的原生/当前官方有效上下文、嵌套RID旧存储、四条等待的正常前提、此前自身护卫正常完成、其他特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及全部原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收仍未完成；仍无测试账号。完整目标继续active，保留原28条剩余要求并追加本阶段结果。

[需求计划](../analysis/game-battle-nested-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-nested-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-nested-physical-v1/source-check.json)、[源修正](../analysis/game-battle-nested-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-nested-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-nested-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-nested-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-nested-physical-v1/delivery-audit.json)。



<a id="stage211"></a>

## stage211：保存自身结果与元数据slot

**事实**：固定37c4旧样本的266正变体2已接入“保存最后一条自身记录→独立216结果”共享核心；通用正变体可解析并忽略自身护卫标量。原有网页、移动网页、微信薄适配沿用同一核心，未增加Swift/AppKit功能。

**事实**：216先消费攻击者记录，再消费自身/护卫结果记录与可选RID，随后推进动作与tuple游标。8000跳过HP、4000对HP作signed32加法并仅按maxHP上限截断、2000抑制数值；108与flags3不阻止该结果。非零治疗即使有10000000仍显示style5，只有零治疗改57bb；伤害有10000000时改57bb，否则含零也用style6。自身RID仅保存首字，后两字来自最后一条非自身RID；缺少此前可确定的RID尾部时提交前拒绝，不猜默认值。

2880组队列、175条轨迹、98543状态、6294帧完整RGBA及初末200动作/800tuple存储一致。92条身体收敛、2条244离场、81条等待链在1000帧内未自然收敛。13个实际管理器场景中9个正常回合、3个等待恢复后回合、1个离场。普通护卫观察在7204恢复、7208结束；自身别名为7203/7207。阈值是7201次busy调用，归位等待不递增，不能把恢复称作正常护卫命中。

**待验证**：源护卫脚本的原生正常完成仍未观测；自身-only发射目标与缺少前序RID的输入保持明确边界。nested72/113、其余特殊pair（含96）、radial238、attachedRID、CMB、完整物理族及所有原生对象池/x87/RNG/调度/UI音频/后端像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服验收均未完成；仍无测试账号。保留原27条剩余要求并追加本阶段结果，完整目标继续active。

[需求计划](../analysis/game-battle-self-physical-v1/implementation-plan.json)、[规格](../analysis/game-battle-self-physical-v1/implementation-spec.json)、[源核验](../analysis/game-battle-self-physical-v1/source-check.json)、[源修正](../analysis/game-battle-self-physical-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-self-physical-v1/test-results.json)、[验收边界](../analysis/game-battle-self-physical-v1/validation.json)、[完整剩余目标](../analysis/game-battle-self-physical-v1/goal-audit.json)、[交付审计](../analysis/game-battle-self-physical-v1/delivery-audit.json)。



<a id="stage210"></a>

## stage210：27类正变体字面结果

**事实**：固定37c4样本的27类正变体1/2/3接入字面E000结果动作与119/120/121实际完成，包含目标HP、RID归属、组合位、单弹/多目标返回及回合/离场。非自身目标的10/1000/200位按原始生产者作为普通标志处理，不套用pair护卫/113脚本。

**事实**：正变体结果与直接body14不同。body16/21在8000跳过HP、4000对实际目标HP做signed32加法并仅按maxHP上限截断、2000只抑制数值并释放目标，不在该回调扣攻击者HP；class6正变体也使用HP而非MP。RID仍独立按2000位写真实principal身体，不能写匿名投射物。单弹掩码为7e000/48000/24000/12000，多目标为e000/8000/4000/2000；skip→heal→suppress有先后。6000组合仍显示style5治疗数字；单弹30000与多目标30000保留各自源行为。

207360组独立队列、495条轨迹、57686个状态、7388帧完整RGBA及实际200动作/800tuple初末存储一致。486条身体收敛、3条预期244离场、6条重复治疗/自身73链在1000帧内未自然收敛。27个实际管理器场景中18个正常回合、6个在7203恢复后于7207结束、3个离场；不能把恢复当作正常播放闭合。

**待验证**：self266 variant2、带guard scalar的自身记录、nested72/113、特殊pair（含96）、radial238、attachedRID、CMB与完整物理族仍继续开发。6条重复/自身链只证明有源等待恢复，原生实际运行结果未观测。完整原生对象池/x87/RNG/调度/音频/后端像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。原26条剩余要求逐字保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-projectile-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-projectile-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-projectile-results-v1/source-check.json)、[源修正](../analysis/game-battle-projectile-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-projectile-results-v1/test-results.json)、[验收边界](../analysis/game-battle-projectile-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-projectile-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-projectile-results-v1/delivery-audit.json)。



<a id="stage209"></a>

## stage209：平台无关物理结果核心

**事实**：固定37c4样本的20类有限pair/variant0路径接入E000反射、治疗、跳过，真实119/120/121效果完成、HP/MP、护卫、RID、tuple游标及回合/离场所有权进入shared跨平台核心。值优先级为8000→4000→2000；producer及RID独立判断2000，保留组合位的源行为。

body14值归属：8000不改HP；4000给实际目标HP做signed32加法后仅按maxHP上限截断；2000对攻击者HP做signed32减法后下限0。class6在8000/4000仍扣实际目标MP，在2000扣攻击者MP。84/85/87在E000同样参与HP；不能套用普通分支的HP排除规则。RID按2000位写攻击者，护卫则保留三角色与原生3字tuple旧第四格。反射弹出双方动作并推进攻击者tuple，后续cooldown重新读取新tuple。

**事实／修正**：native1004是afterImageEnabled，1000是残影计数器，FD4才是attackFinishCounter；73/74、defense100和positive105现使用正确字段，8优先于100。266首段应使用205，level9使用147→73及源74清理；205每次回调恰调用一次rand并选择1adb4..7烟尘。共同body尾部生成冻结副本，队列重置清FD4但保留1004/1000。此结论更新stage204～208相关旧字段/266描述；历史本地绿色测试不构成原生等价证明。精确修改前3275文件副本与历史源核验均保留；12组旧模型重新生成，仅5个预期文件改变，所有旧场景输入、资源字节及geometry不变。

**待验证**：正变体1/2/3的E000/F210仍在提交前拒绝；nested72/113、特殊pair（含96）、self266、radial238、attachedRID、CMB及完整物理族继续开发。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本与官服均未完成；仍无专用测试账号。25条旧剩余要求逐字保留，再追加本阶段进展；完整目标保持active。

[需求计划](../analysis/game-battle-physical-results-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-results-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-results-v1/source-check.json)、[源修正](../analysis/game-battle-physical-results-v1/source-corrections.json)、[测试与构建](../analysis/game-battle-physical-results-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-results-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-results-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-results-v1/delivery-audit.json)。



<a id="stage208"></a>

## stage208：平台无关护卫与蓄力核心

**事实**：固定37c4样本的20类已支持pair路径接入三角色护卫、连续0x1010 look-ahead和113状态的0/3蓄力；护卫者承担真实结果，被保护者保留受击移动。RID与三字tuple保留原有第四字，113按源逻辑冻结自身与当前tuple目标。

436c20复制owner payload+64到栈上局部游标，只扫描连续0x1010记录，首条不匹配即停止，不改变主游标；跳过amount和可选3字RID，不额外跳过guard标量。434a90只写3格、保留旧第四格；436e60追加RID后复制之前的完整raw tuple，禁止清零或改复制来源。

独立原创方程与实现对照16000组队列、227条轨迹、58109帧状态、5124帧完整RGBA（双selector），初始/最终原始200动作格和800tuple格也相同。223条身体收敛，1条预期244退出，3条别名/RID链在3000帧内未收敛；真实管理器在7203次回调触发已有恢复后结束，不能把恢复算作正常播放闭合。

**待验证**：E000反射/治疗/跳过等结果路由、nested72/113、其余特殊pair生产者（含96）、正变体F210/self266、radial238、attachedRID及完整物理族仍未闭合。完整原生对象池/x87/RNG/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成；仍无专用测试账号。原24条剩余要求完整保留并追加本轮进展，完整目标继续active。

[需求计划](../analysis/game-battle-physical-guard-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-guard-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-guard-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-guard-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-guard-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-guard-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-guard-v1/delivery-audit.json)。



<a id="stage207"></a>

## stage207：特殊效果进入共享核心

**事实**：固定37c4样本的258类variant1/3已接入71b1（最高等级71b2）瞬时叠图，variant2保留无叠图分支；258/259/266正变体最高等级240平铺前缀、259最高等级直接路径及命中平铺进入shared核心。瞬时图复制当次世界坐标，不跟随父节点。

41f5b0的pulse序列为1..15、14..0、1..，不重复端点；每次先提交10×10格点（X外层）再判断counter>=limit，最后仍加1。duration15实际提交16批；被标删除节点若遇慢放门控可暂留，但门控期间不重复提交。新的directSubmissions共用有序绘制队列，不以开启casting背景状态替代平铺。

独立原创Python模型与实现对照64800正变体队列、132条新轨迹、19294帧状态、3664帧完整RGBA，双selector一致；132条均在观察内身体收敛。旧206的61920队列/879轨迹输出逐字节不变。原作程序本轮未执行，方程匹配不等于原生运行证据。

**待验证**：guard/redirect/look-ahead/charge、nested72/113、特殊直接生产者（含96）、266 variant2 self、radial238、attachedRID和完整物理族仍在开发；全局原生x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、原生微信/DevTools/设备、当前版本和官服均未完成。没有专用测试账号。原有23条剩余要求逐条保留并追加本轮进展；历史“258/平铺待实现”已由本轮有限实现更新，完整目标继续active。

[需求计划](../analysis/game-battle-physical-specials-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-specials-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-specials-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-specials-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-specials-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-specials-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-specials-v1/delivery-audit.json)。



<a id="stage206"></a>

## stage206：正变体发射核心

**事实**：基于固定37c4样本，实现25个generic选择器及独立73类的有限variant1/2/3发射路径：真实动画probe、单弹、多目标回收、连续发射和28反应；73不使用generic耗蓝前缀。95/105/110前缀与6/84/85/87的正变体HP结果保留各自源规则。公共消息工厂改为当次世界浮点坐标，修复95移动后仍取旧屏幕缓存的问题。

独立原创Python源方程生成61920队列、879轨迹、134538状态和16606帧完整RGBA，两种selector均逐项匹配；873轨迹身体收敛。自身73及重复目标各3条在3000次观察内保持未收敛，不能算成功回合；实际源码/生成包管理器均由wait counter>7200恢复这6条，未注入ready。原作可执行文件未运行，本机方程匹配不等于原生运行证明。

**待验证**：258发射overlay420170、259/266的level9平铺240、266 variant2 self、radial238、guard/redirect/look-ahead/charge、nested72/113、direct96、attachedRID及完整物理族仍在开发。原生全局x87/RNG/对象池/调度/音频/像素、完整游戏、手机真机、微信原生/DevTools/设备、当前版本和官服仍须验收；没有专用测试账号。原有22条剩余要求逐条保留并追加本轮进展，完整目标保持active。

[需求计划](../analysis/game-battle-physical-projectiles-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-projectiles-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-projectiles-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-projectiles-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-projectiles-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-projectiles-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-projectiles-v1/delivery-audit.json)。



<a id="stage205"></a>

## stage205：共享reactionPuff修正

**事实**：本轮依据固定37c4样本的41f310/41f2d0，修正公共26/160反应烟雾：使用身体当次移动前世界坐标、无父链接、不消耗模型随机数；12/13逃跑烟雾沿用独立随机工厂。没有新增正变体或特殊技能可用范围。

独立Python模型按同一源证据修正并重跑11个生成器，4份期望状态JSON改变；原创资源字节、geometry、队列输入、场景数、状态帧与RGBA帧覆盖均保持。旧失败日志和历史验收保留；旧模型关于反应烟雾的随机偏移假设由本轮纠正，旧历史通过不代表该假设正确。

新增源码和实际neutral包属性回归各1项；有限物理族15995队列/75场景/17488状态/2358完整RGBA覆盖不减，两个body-only有界未收敛观察继续明示。

**待验证**：完整物理族仍在开发中。244-case全函数索引包含其他处理器；117-case/93-group机械候选图未计算一般fallthrough，14个动态动作及1个动态状态写入未闭合。正变体、guard/redirect/charge/nested/self/attachedRID/特殊脚本、原生全局RNG/音频/像素/调度、完整游戏、手机真机、微信原生/DevTools/设备、当前版本与官服仍须验收。原有21项剩余要求逐条保留并追加本轮进展；目标保持active。

[需求计划](../analysis/game-battle-physical-consumers-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-consumers-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-consumers-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-consumers-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-consumers-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-consumers-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-consumers-v1/delivery-audit.json)。



<a id="stage204"></a>

## stage204：公共物理计划与直接播放核心

已接入20类的有限pair/variant0直接结果（259的level9除外），保留29类选择器；MP6、84/85/87不扣HP、首击/后续actor、状态/RID、81额外回复、258移动和真实等待/结束拥有者分别处理。旧`planBattleStrike`/`queueStrike`仍是0/1/3有限接口，实际游戏公共族命令走新`queuePhysicalFamily`。

新增两个纯字节模块，按source producer/direct14区分；对未证consumer保持原子不可用，内部复用既有结果、RID和状态能力。全量15995计划/17488状态/2358完整RGBA及实际source/generated/浏览器通过；75场景中两条body-only流仍是有界未收敛观察。

正变体投射物、护卫/转移/前瞻/蓄力/嵌套/自身/attached RID、72/73/94/96/105/113/257/260/262及259-level9特殊脚本仍需实现，当前均在提交该分支动作、元组与数值结果前明确拒绝。完整族、原生窗口/音频/后端/全局RNG与节奏、其他游戏业务、手机实机和原生微信/DevTools/设备、当前版本及官服兼容仍未验收；没有测试账号。本轮没有VM/CUA、原程序执行或官服会话。全部20条旧剩余需求逐字保留，完整目标继续active。

[需求计划](../analysis/game-battle-physical-family-runtime-v1/implementation-plan.json)、[规格](../analysis/game-battle-physical-family-runtime-v1/implementation-spec.json)、[源核验](../analysis/game-battle-physical-family-runtime-v1/source-check.json)、[测试与构建](../analysis/game-battle-physical-family-runtime-v1/test-results.json)、[验收边界](../analysis/game-battle-physical-family-runtime-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-runtime-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-runtime-v1/delivery-audit.json)。



<a id="stage203"></a>

## stage203：公共物理族消费者规格继续

本轮未新增shared模块或导出。当前普通物理0/1/3 variant0、其他已验收技能范围保留；公共族28类别及相关73的扩展仍待生产者/实际播放拥有者接入。

新源规格、十组消费者义务及分层规范函数来源供后续实现使用，不能视作可游玩范围扩展。来源复核：`python3 analysis/game-battle-physical-family-v1/verify_source.py`。

本轮新运行源码测试0、生成检查0、页面流程0；运行模块/导出/适配器/测试及native/vendor未改。已复核stage202构建607输入/34输出和日志身份；此前2142项Node、393生成检查、15页面流程是历史验收基线，本轮未重跑，未重复累计。只运行并通过当前来源核验脚本。

本轮是来源证据进展；公共物理族的完整分析、生产者与播放实现仍进行中，未把新类别标为可玩。原19条剩余要求逐字保留并追加第20条，其他SKL/处理者/玩法/原生窗口、命中、音频、数值容器、RNG与全程序节奏/后端、真实手机、原生微信gamePage/DevTools/设备、现行及官方兼容继续未完成，暂无测试账号；完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-physical-family-v1/implementation-plan.json)、[来源规格](../analysis/game-battle-physical-family-v1/implementation-spec.json)、[消费者义务](../analysis/game-battle-physical-family-v1/consumer-obligations.json)、[源核验](../analysis/game-battle-physical-family-v1/source-check.json)、[验收边界](../analysis/game-battle-physical-family-v1/validation.json)、[完整剩余目标](../analysis/game-battle-physical-family-v1/goal-audit.json)、[交付审计](../analysis/game-battle-physical-family-v1/delivery-audit.json)。



<a id="stage202"></a>

## stage202：共享SKL82、资源结果与背景震动

新增skill82纯计划和内部播放模块，由现有身体/命令/动画/帧/背景拥有者调度。新API支持82十等级、双方中点、float32放大、逐值目标结果和RID3交接；已有8/6和震动接口复用，无新增Swift/AppKit或平台依赖。

针对性运行：`node --test shared/tests/legacy-game-battle-skill82.test.mjs web/tests/legacy-game-battle-skill82.test.mjs`。独立Python参考不导入产品，失效条件保持显式拒绝。

新增48项，全量181文件2142项Node通过。四套当前构建核607输入/34输出身份、0external；393生成检查（386neutral/7App/Page）通过。独立1463队列、63场景16706完整建模状态和2404完整RGBA帧（两选择器）一致；47源停止、15身体结束与1空目标未证边界分开。97条最终真实本机TCP（41来源/41生成/15实际页面）核485启动、498技能包、99自动查询、102个S请求、90返回/180移动。81次独立截图、53个不同图像文件哈希位于源码外，均为原创合成资源；浏览器0错误/警告/外部请求。

82空目标会进入未加哨兵检查的目标循环，原生结果未证，当前修改前明确拒绝。另两处震动全局引用没有Ghidra规范函数边界，未冒充已恢复的其他技能消费者。此前83删除后反射、其他技能/变体/独立attachedRID、自身31/好友表、完整连接/骑乘/状态和其他处理者、工艺上下文及玩法、原生HP数值容器与全程序RNG/窗口/命中/音频/整体节奏、43 HUD/完整199非不透明效果/完整DDRAW/D3D等后端、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-skill82-v1/implementation-plan.json)、[规格](../analysis/game-battle-skill82-v1/implementation-spec.json)、[源核验](../analysis/game-battle-skill82-v1/source-check.json)、[验证修正](../analysis/game-battle-skill82-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-skill82-v1/test-results.json)、[TCP](../analysis/game-battle-skill82-v1/network-validation.json)、[页面](../analysis/game-battle-skill82-v1/browser-validation.json)、[验收](../analysis/game-battle-skill82-v1/validation.json)、[完整剩余目标](../analysis/game-battle-skill82-v1/goal-audit.json)、[交付审计](../analysis/game-battle-skill82-v1/delivery-audit.json)。



<a id="stage201"></a>

## stage201：共享83移动数值与残影核心

numeric计划扩展83，新moving-numeric-playback由既有身体/命令/帧拥有者调度；公开固定样本profile。移动、真实目标启动、冻结复制/12访问清理、本地停止和非本地回合均为无平台字节/状态逻辑，无新增Swift/AppKit功能。

针对性运行：`node --test shared/tests/legacy-game-battle-moving-numeric.test.mjs web/tests/legacy-game-battle-moving-numeric.test.mjs`。新测试9核心+24来源TCP，独立Python方程不导入产品代码。

新增33项、全量179文件2094项Node通过。四套当前构建覆盖599输入/34输出身份，0external；生成验收共351项（344neutral/7App/Page），由326既有、24新TCP及1修正后的队列检查构成，初始验证脚本错误与重测日志单独保留。独立939队列含737支持/202明确拒绝边界；59场景核9387完整状态和1828完整RGBA帧（两选择器），区分31源停止、22身体结束、4特殊槽身体等待和2未证边界；phase2未交接4例，其中3已被源停止抢先结束、1仍在等待。最终61条真实本机TCP（24来源/24生成/13实际页面）核305启动、318技能包、63自动查询、66个S请求、48返回/96移动。69次独立截图、46个不同图像文件哈希在源码外，均为原创合成资源。浏览器0错误/0外部请求；3条Canvas读回性能提示来自验证器反复读像素，无其他警告。

非本地83删除施术者后，非零反射或自身反射者的原生运行结果仍未证实，修改前明确拒绝；零和反射与特殊20/21等待按源保留，不标回合成功。其他技能/变体/独立RID、自身31、对侧423500好友表、完整连接/骑乘/缩放/状态与其他处理者、工艺上下文和其他玩法、原生43 HUD/完整199非不透明效果/窗口/命中/音频/整体节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备和现行/官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-moving-numeric-v1/implementation-plan.json)、[规格](../analysis/game-battle-moving-numeric-v1/implementation-spec.json)、[源核验](../analysis/game-battle-moving-numeric-v1/source-check.json)、[验证修正](../analysis/game-battle-moving-numeric-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-moving-numeric-v1/test-results.json)、[TCP](../analysis/game-battle-moving-numeric-v1/network-validation.json)、[页面](../analysis/game-battle-moving-numeric-v1/browser-validation.json)、[验收](../analysis/game-battle-moving-numeric-v1/validation.json)、[完整剩余目标](../analysis/game-battle-moving-numeric-v1/goal-audit.json)、[交付审计](../analysis/game-battle-moving-numeric-v1/delivery-audit.json)。



<a id="stage200"></a>

## stage200：无平台数值与治疗技能消费者

新增numeric-skills纯计划与内部播放模块，公开profile/plan、三类十等级、有符号三元组/特殊槽/反射队列已接共享身体与命令拥有者。动画父完成、真实137目标推进和16/17父子删除驱动进度；无DOM、Swift或AppKit依赖。

针对性验证：`node --test shared/tests/legacy-game-battle-numeric-skills.test.mjs web/tests/legacy-game-battle-numeric-skills.test.mjs`。独立Python方程使用原创资源，未导入产品代码。35新增/2061全量Node、四套构建/326生成检查（319neutral/7App/Page）通过；595输入/34输出身份一致，0external。独立3类十等级、2317队列、157场景16447完整状态、3250完整RGBA帧（两选择器）一致；154场景身体结束、151场景命令结束，6个源phase2等待单独保留。71条最终验收用真实本机TCP（28来源/28生成/15实际页面），核355启动、368技能包、73自动查询、76个S请求、60正常返回/120移动；初始观察不重复计入。78次独立截图在源码外，对应43个不同图像文件哈希；均为原创合成资源，浏览器0错误/0警告/0外部请求。

共同分支83的8/6/10移动、133/88/193/死亡与local244、其他技能/变体/独立RID、自身31游标、对侧423500好友表、完整连接/骑乘/缩放/状态和其他处理者、工艺上下文及其他玩法、原生43 HUD备份/完整199非不透明效果/窗口/命中/音频/整体阻塞节奏、完整DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。零和/重复反射是保留的源等待，不标回合成功。全部原始要求保留，完整目标active、phase_complete=false。

[需求计划](../analysis/game-battle-numeric-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-numeric-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-numeric-skills-v1/source-check.json)、[证据纠正](../analysis/game-battle-numeric-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-numeric-skills-v1/test-results.json)、[TCP](../analysis/game-battle-numeric-skills-v1/network-validation.json)、[页面](../analysis/game-battle-numeric-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-numeric-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-numeric-skills-v1/goal-audit.json)、[交付审计](../analysis/game-battle-numeric-skills-v1/delivery-audit.json)。



<a id="stage199"></a>

## stage199：纯核心状态/辅助技能

新增`legacy-game-battle-status-skills.mjs`及内部播放模块，公开profile/plan/effect描述，36类十等级及不同元组/自身/特殊槽/重置覆盖顺序已接命令和身体拥有者。真实父完成、32/128粒子计数、状态/覆盖和C/M管理器field驱动进度；无DOM、Swift或AppKit依赖。

针对性命令：`node --test shared/tests/legacy-game-battle-status-skills.test.mjs shared/tests/legacy-game-battle-casting.test.mjs web/tests/legacy-game-battle-status-skills.test.mjs`。独立Python参考只导入既有原创方程，不导入产品模块。59新增/2026全量Node、四套构建/297生成检查（290neutral/7App/Page）通过；587输入/34输出身份一致，0external。独立36类十等级、2912队列、416场景12775状态、6384完整RGBA帧（两选择器）一致。115条最终验收用真实本机TCP（51来源/51生成/13实际页面），核575启动、591技能包、117自动查询、123个S请求、109正常返回/218移动；初始观察不重复计入。71张原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

其他技能/变体/独立RID、数值类61..63、自身31游标、零和/重复反射等待、对侧423500好友表、完整连接/骑乘/缩放/状态与其余处理者、工艺上下文和其他玩法、原生43 HUD备份字段/窗口/命中/音频/整体阻塞节奏、完整199透明度及DDRAW/D3D/alternate/tint/additive像素、真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。所有原始要求保留，完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-status-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-status-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-status-skills-v1/source-check.json)、[旧参考修正](../analysis/game-battle-status-skills-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-status-skills-v1/test-results.json)、[TCP](../analysis/game-battle-status-skills-v1/network-validation.json)、[页面](../analysis/game-battle-status-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-status-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-status-skills-v1/goal-audit.json)。



<a id="stage198"></a>

## stage198：纯字节核心施法切面

新增`legacy-game-battle-casting.mjs`和内部`legacy-game-battle-casting-playback.mjs`；计划在提交前核元组/目标/容量/资源和未知自身路径，播放由真实动画/几何回调持有。类别19..31十等级、四投射家族、反射、三资源、C元素、局部反馈、HP/MP/KO及返回已接入已有身体/命令/帧拥有者。无DOM/Swift/AppKit依赖。

针对性运行：`node --test shared/tests/legacy-game-battle-casting.test.mjs web/tests/legacy-game-battle-casting.test.mjs`；独立Python参考不导入产品代码，完整源测试为1967项。38新增/1967全量Node、四套构建/245生成检查（238neutral/7App/Page）通过；579输入/34输出身份一致，0external。独立4686队列、213回调场景25917状态、6078完整RGBA帧（两呈现选择器）、294寻向和180个有符号CRT边界通过。60新真实本机TCP含10实际网页鼠标/触摸流程，核300启动、313技能包、2个1101标签包、62自动查询、65个S请求、53次正常返回/106移动；52张验收用独立原创夹具截图在源码外，浏览器0错误/0警告/0外部请求。

自身31吸取游标在FF之后的原运行结果、零和/重复反射等待、对侧423500好友属性表、独立附RID消费者、其他技能/变体/处理者/角色/状态/连接/骑乘/缩放、工艺上下文、原生窗口/命中/音频/整体调度、原DDRAW/D3D/alternate/tint/additive及非不透明像素、其他玩法，真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-casting-v1/implementation-plan.json)、[规格](../analysis/game-battle-casting-v1/implementation-spec.json)、[源核验](../analysis/game-battle-casting-v1/source-check.json)、[旧参考修正](../analysis/game-battle-casting-v1/source-corrections.json)、[测试/构建](../analysis/game-battle-casting-v1/test-results.json)、[TCP](../analysis/game-battle-casting-v1/network-validation.json)、[页面](../analysis/game-battle-casting-v1/browser-validation.json)、[验收](../analysis/game-battle-casting-v1/validation.json)、[完整剩余目标](../analysis/game-battle-casting-v1/goal-audit.json)。



<a id="stage197"></a>

## stage197：无平台人物技能记录和主指令

新增legacy-game-player-skills纯字节owner：15主记录/11子等级、部分更新/删除、顺序、词法/转义和边界；source字段按偏移保留，费用使用真实imul32/idiv100方程。主输入状态拥有技能/等级/目标/intro及记忆；实际已有物理SKL消费M、MP/HP与身体生命周期保持独立。

31新增/1929全量Node、四构建/218生成检查（211neutral/7App/Page）通过；571输入/34输出身份一致，0external。45独立完整接收状态、14输入场景781状态、110个有符号MP计算边界通过。32新真实本机TCP含6实际页面，核160启动、177技能接收包、34自动查询及37个S请求；25次正常返回、25退出/50移动，27张原创夹具截图在源码外。 核心不依赖DOM/Node/隐式编码/网络全局；neutral生成通过实际原始字节和原生端口接口进相同所有者。完整其他SKL/魔法/variant/RID/自身或死亡目标/状态/连接及骑乘分支、工艺配方与普通非零上下文、特殊地图/原生窗口/翻页/命中/悬浮提示/音频、其余角色/动作/对象池/全局RNG与调度、原DDRAW/D3D像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行和官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-player-skills-v1/implementation-plan.json)、[规格](../analysis/game-battle-player-skills-v1/implementation-spec.json)、[源核验](../analysis/game-battle-player-skills-v1/source-check.json)、[测试](../analysis/game-battle-player-skills-v1/test-results.json)、[TCP](../analysis/game-battle-player-skills-v1/network-validation.json)、[页面](../analysis/game-battle-player-skills-v1/browser-validation.json)、[验收](../analysis/game-battle-player-skills-v1/validation.json)、[完整剩余目标](../analysis/game-battle-player-skills-v1/goal-audit.json)。


<a id="stage196"></a>

## stage196：普通宠物缓存/队列与无平台呈现核心

新增battle-pet-transition/battle-pet-cache/presentation纯逻辑模块。接收宠物mode与战斗缓存/activeIndex独立；普通pet意图与已有W技能意图区分，MON队列由真实动画/身体/子效果完成。呈现选择器独立于图形配置，draw-plan/render的scale是有限非负f32二元组，point采样策略与原驱动像素等价分开声明。

完整169文件1898 Node，新增38核心+13来源TCP；16场景1864 MON状态、13场景673输入状态、240策略像素用例独立生成。neutral生成API196检查无DOM/Node/编码全局依赖，含13新实际TCP及16完整MON逐帧参考。完整其他技能/动作/附RID、对侧召唤423500好友匹配、其余角色/骑乘分支、原生弹窗/命中/音频/对象池/全局RNG与调度、完整DDRAW/D3D及alternate/tinted/additive像素等价、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容仍未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-pet-transition-v1/implementation-plan.json)、[规格](../analysis/game-battle-pet-transition-v1/implementation-spec.json)、[源核验](../analysis/game-battle-pet-transition-v1/source-check.json)、[测试](../analysis/game-battle-pet-transition-v1/test-results.json)、[TCP](../analysis/game-battle-pet-transition-v1/network-validation.json)、[验收](../analysis/game-battle-pet-transition-v1/validation.json)、[剩余目标](../analysis/game-battle-pet-transition-v1/goal-audit.json)。


<a id="stage195"></a>

## stage195：无平台宠物接收与骑乘输入

新增legacy-game-pets纯字节模块，按固定37c4载体拥有5宠物/10技能、精确部分更新/替换/清空与独立字节；已有battle/input读取该owner、真实P/MP/rider执行技能/目标/待机/重选/超时。没有DOM/Node/TextEncoder依赖，neutral生成上下文中实际TCP验证通过。

验证可运行node --test shared/tests/*.test.mjs web/tests/*.test.mjs；本轮完整164文件1847项，新增20核心+16来源TCP。独立参考为53完整载体状态及15场景833输入状态；不是产品函数生成的预期。完整其他技能/动作/附RID、未移植角色与骑乘分支、原生弹窗/命中/音频/缩放渲染/对象池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；暂无测试账号。整个原始目标active，phase_complete=false。

[需求计划](../analysis/game-battle-mounted-input-v1/implementation-plan.json)、[规格](../analysis/game-battle-mounted-input-v1/implementation-spec.json)、[源核验](../analysis/game-battle-mounted-input-v1/source-check.json)、[测试](../analysis/game-battle-mounted-input-v1/test-results.json)、[TCP](../analysis/game-battle-mounted-input-v1/network-validation.json)、[验收](../analysis/game-battle-mounted-input-v1/validation.json)、[剩余目标](../analysis/game-battle-mounted-input-v1/goal-audit.json)。


<a id="stage194"></a>

## stage194：CBC与实际骑乘/附着节点

共享body/playback/commands实现普通CBC即时4值/资源，以及C/命令的真实13b4/13b0构造和父回调。父slot身份、固定节点优先级、动作/facing/动画mode、屏幕附点、flags、alternateY和清理均由owner推进；C来源行不伪改。CBC与EQU保留C设置的draw mask。

`node --test shared/tests/legacy-game-battle-character-change.test.mjs`为36新检查；32场景1010状态/完整RGBA。全量1811Node、四构建157生成通过；核心无DOM/网络/全局时钟新依赖。完整其他技能/动作/附RID、原生骑乘输入及未移植角色分支、菜单/命中/音频/缩放渲染/池与全局RNG调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成；无测试账号。完整目标active，phase_complete=false。

[需求计划](../analysis/game-battle-character-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-character-change-v1/source-check.json)、[规格](../analysis/game-battle-character-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-character-change-v1/test-results.json)、[TCP](../analysis/game-battle-character-change-v1/network-validation.json)、[验收](../analysis/game-battle-character-change-v1/validation.json)、[剩余目标](../analysis/game-battle-character-change-v1/goal-audit.json)。

<a id="stage193"></a>

## stage193：普通POS与EQU进入共享owner

battle-change的严格规划经body实际交换身体指针/slot与队列、commands反馈current-local、entry应用，battle同步原C行/名字；对象池ID与优先级保留，P数组不变，下一C再对齐。EQU区分nextResource/resource13a8/current resourceId并实际执行64/action5/完成信号。共用完成标签补齐PSN物理后角度恢复。

`node --test shared/tests/legacy-game-battle-change.test.mjs`为56新核心检查；50原创独立场景1917状态/完整RGBA。全量1761Node、四构建142生成通过。无DOM/网络/全局时钟新依赖；所有旧场景帧断言继续保留。完整其他技能/动作/附RID、链接/骑乘/缩放等角色分支、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-change-v1/implementation-plan.json)、[源核验](../analysis/game-battle-change-v1/source-check.json)、[规格](../analysis/game-battle-change-v1/implementation-spec.json)、[测试](../analysis/game-battle-change-v1/test-results.json)、[TCP](../analysis/game-battle-change-v1/network-validation.json)、[验收](../analysis/game-battle-change-v1/validation.json)、[剩余目标](../analysis/game-battle-change-v1/goal-audit.json)。

<a id="stage192"></a>

## stage192：共用PSN回调与实际数值

commands/body/playback经新status模块支持普通PSN三类结果，numberValue/numberStyle和现有skillLevel由已解码记录设置；真正数值变化、动画反馈与等待在源回调执行。三种字型、十级回血附层、源KO位、新C覆盖与已准备像素帧的取消重试均有证据。shared/index导出profile，核心保留无平台依赖。

`node --test shared/tests/legacy-game-battle-status.test.mjs`为27新检查；独立735算术、21场景2152状态/完整RGBA另列。全量1691Node与四构建129检查通过。完整其他技能/动作/附RID、原生菜单/命中/音频/渲染与池调度、其他玩法，以及真实手机、原生微信gamePage/DevTools/设备、现行与官方兼容继续未完成，无测试账号。原完整目标active，phase_complete=false。

[需求与计划](../analysis/game-battle-status-v1/implementation-plan.json)、[源核验](../analysis/game-battle-status-v1/source-check.json)、[规格](../analysis/game-battle-status-v1/implementation-spec.json)、[测试](../analysis/game-battle-status-v1/test-results.json)、[TCP](../analysis/game-battle-status-v1/network-validation.json)、[验收](../analysis/game-battle-status-v1/validation.json)、[剩余目标](../analysis/game-battle-status-v1/goal-audit.json)。

<a id="stage191"></a>

## stage191：真实浏览器使用已有战斗核心

shared client新增copyBattleState和受限configureBattleViewport({width:640,height:480})，真实浏览器借用已有目录/entry/input/loop/exit/return来驱动Canvas与按钮。普通显示上下文保留，未配置的新旧组件仍使用原裁剪；C当前数值和动作结算继续属于既有source owner。核心没有新增DOM/网络/时钟全局依赖。

1653 Node、四构建/117检查、539输入/34产物核身份；真实页面与独立Canvas/I/O取消测试在适配层记录。完整其他技能、原生调度/渲染/音频、实际手机/微信设备和现行/官方继续未完成，不增加Swift专用功能。

[来源核验](../analysis/game-battle-web-v1/source-check.json)、[规格](../analysis/game-battle-web-v1/implementation-spec.json)、[测试](../analysis/game-battle-web-v1/test-results.json)、[实际页面](../analysis/game-battle-web-v1/browser-validation.json)、[位图核验](../analysis/game-battle-web-v1/canvas-browser.json)、[网络](../analysis/game-battle-web-v1/network-validation.json)、[验收](../analysis/game-battle-web-v1/validation.json)、[目标审计](../analysis/game-battle-web-v1/goal-audit.json)。

<a id="stage190"></a>

## stage190：普通物理技能与实时数值

client.configureBattlePlayback后绑定configureBattleSkills，再配置frame/entry/input/loop/exit/return；普通物理SKL由现有advanceBattleEntry推进实际队列和资源任务。C的四值进入当前body.vitals，动画结果信号处更新HP、正费用扣MP，下一实际C覆盖；无需调用者准备就绪标志。

19核心+14源TCP新测试，全量1650、四构建/115生成检查通过，13组3137独立状态与完整RGBA一致。完整其余技能/人物分支、旧未配置49的统一、其他动作/渲染/产品/设备与官方仍待完成，不新增Swift专用功能。

[源证据](../analysis/game-battle-skill-v1/source-check.json)、[规格](../analysis/game-battle-skill-v1/implementation-spec.json)、[测试](../analysis/game-battle-skill-v1/test-results.json)、[TCP](../analysis/game-battle-skill-v1/network-validation.json)、[验收](../analysis/game-battle-skill-v1/validation.json)、[目标审计](../analysis/game-battle-skill-v1/goal-audit.json)。

<a id="stage189"></a>

## stage189：普通来源返回与新运行循环

在entry/input/loop/exit配置后调用client.configureBattleReturn()，继续advanceBattleEntry可走9/1→11等待→真实场景捕获/13淡入→20/3。普通首帧资源任务成功才恢复playing并建立新runtime；老移动/动画实例已关闭。新unit来自退出后消息，本地可用保留全局重建，不需要新own-unit或伪就绪字段。

1617 Node、四构建/101检查、22新本机TCP、1004独立返回RGBA及36准确移动请求通过；此为固定37c4 normal-origin逻辑移植，完整战斗/原生普通池UI音频/其他玩法/产品平台/官方未完成，不增加Swift。[源证据](../analysis/game-battle-return-v1/source-check.json)、[规格](../analysis/game-battle-return-v1/implementation-spec.json)、[测试](../analysis/game-battle-return-v1/test-results.json)、[TCP](../analysis/game-battle-return-v1/network-validation.json)、[验收](../analysis/game-battle-return-v1/validation.json)、[目标审计](../analysis/game-battle-return-v1/goal-audit.json)。

<a id="stage188"></a>

## stage188：源退出复制和9/1边界

在entry/input/loop之后显式configureBattleExit，advanceBattleEntry可推进普通分支7/8，捕获实际战斗帧并按源发送$!~ int0，到9/1仍保持待返回。pure exit12/14的105步、32裁剪有独立参考；原始CHT/BST依赖不丢弃。main9普通重建和完整其他动作/控件仍待完成，不增加Swift。

1599 Node、四构建/89生成检查、22新TCP/16退出请求及1008独立退出RGBA通过；它们不替代完整战斗、平台或官方验收。[源证据](../analysis/game-battle-exit-v1/source-check.json)、[规格](../analysis/game-battle-exit-v1/implementation-spec.json)、[测试](../analysis/game-battle-exit-v1/test-results.json)、[TCP](../analysis/game-battle-exit-v1/network-validation.json)、[验收](../analysis/game-battle-exit-v1/validation.json)、[目标审计](../analysis/game-battle-exit-v1/goal-audit.json)。

<a id="stage187"></a>

## stage187：自动M5/6与回合反馈

在entry和基础input之后显式configureBattleLoop，继续advanceBattleEntry即可按源5图后取M、6回调并反馈下一轮2。7核心/9源TCP新增、1581 Node、四构建/77生成检查通过；18新OS TCP/30请求核多轮、PNO实际动作结束、回绕和M像素重试不重放。

新增pure battle-loop不接收完成标记或原生句柄；copyBattleLoop明确局部覆盖。完整SKL/其余动作、退出、UI/命中/音频及其他玩法仍待实现；不增加Swift功能。[源证据](../analysis/game-battle-loop-v1/source-check.json)、[规格](../analysis/game-battle-loop-v1/implementation-spec.json)、[测试](../analysis/game-battle-loop-v1/test-results.json)、[TCP](../analysis/game-battle-loop-v1/network-validation.json)、[验收](../analysis/game-battle-loop-v1/validation.json)、[目标审计](../analysis/game-battle-loop-v1/goal-audit.json)。

<a id="stage186"></a>

## stage186：基础战斗输入与目标规则

新增battle-input纯核心：拥有源菜单运动/计数/期限，读取实际P/C/A与body，提供基本命令和槽目标意图；目标资格、单体/交叉/阵营/全体编码有独立参考。client将$T5请求排队一次，像素重试不重放发送或clock。M执行仍在未实现phase5/6，完整输入/菜单/命中/音频/退出与其他玩法要求保留。

1565 Node、四构建/67生成检查、240掩码/180编码、10场景392步骤及26新TCP/42请求通过。正的首C链接映射13b4子对象依赖，未完成完整拥有链时明确不可用；不增加Swift功能。[源证据](../analysis/game-battle-input-v1/source-check.json)、[规格](../analysis/game-battle-input-v1/implementation-spec.json)、[测试](../analysis/game-battle-input-v1/test-results.json)、[TCP](../analysis/game-battle-input-v1/network-validation.json)、[验收](../analysis/game-battle-input-v1/validation.json)、[目标审计](../analysis/game-battle-input-v1/goal-audit.json)。

<a id="stage185"></a>

## stage185：源入场0..4与逐行捕获

新增battle-entry及entry-fade纯核心；拥有源phase、float32行状态、真实P/C调度，按源2图后C、3图后到位和4等待输入推进。旧body节点先标记删除，实际遍历时回收。client绑定真实资源、捕获和可取消任务，像素重试不重放逻辑；新native状态不由测试完成回调注入。

1546 Node、四构建/53生成检查、独立804完整入场像素帧及22新TCP/1390帧通过；54次源fade与25920行状态/16裁切另验。完整native input/M/exit、popup/其他UI、所有body/特效/缩放、产品页面/平台/官方验收继续未完。[源证据](../analysis/game-battle-entry-v1/source-check.json)、[规格](../analysis/game-battle-entry-v1/implementation-spec.json)、[测试](../analysis/game-battle-entry-v1/test-results.json)、[TCP](../analysis/game-battle-entry-v1/network-validation.json)、[验收](../analysis/game-battle-entry-v1/validation.json)、[目标审计](../analysis/game-battle-entry-v1/goal-audit.json)。

<a id="stage184"></a>

## stage184：纯字节基础战斗frame与资源像素

新增legacy-game-battle-frame.mjs，源pointer-depth排序与owned pool提交生成不可变drawPlan；实际world/client经已有library读取RD/CGP，原始资源不进入交付。通过1835独立完整像素帧、36排序边界及源/生成API422帧；159缩放/混色案例按已知范围明确未支持。绘图与动画/命令推进分离，不凭绘制成功消耗C/M或触发busy归零。

client.configureBattleFrames/renderBattleFrame使用自身资源、任务和取消生命周期。当前仅partial renderer，完整main10、原捕获/缩放后端、其他动作/输入/退出仍未实现。1527全量Node和四构建/41生成检查通过，0平台全局依赖被引入。[源证据](../analysis/game-battle-scene-v1/source-check.json)、[规格](../analysis/game-battle-scene-v1/implementation-spec.json)、[测试](../analysis/game-battle-scene-v1/test-results.json)、[TCP](../analysis/game-battle-scene-v1/network-validation.json)、[验收](../analysis/game-battle-scene-v1/validation.json)、[目标审计](../analysis/game-battle-scene-v1/goal-audit.json)。

<a id="stage183"></a>

## stage183：基础body回调、源数学与真实动画绑定

新增battle-playback、battle-math及360项源数值表；body拥有C资源ID/队列，playback拥有借目录创建的player和效果节点。23类基础type的限定动画/运动/counter、五类效果、FIFO/四拍/脱槽/清busy反馈已接入，ACT有源indicator新增。208后209及其他分支仍unavailable，不伪造完成。

client.configureBattlePlayback只给本地源上下文，真实目录/geometry来自自己library；world/client.advanceBattleCallbacks仍是显式调用级端口，不自动运行原生main10。animationPlayer.resetFrames只清帧和延迟。每个owner正常关闭，目录仍由资源库负责；上下文/geometry重入与关闭有测试。

19新增/1514 Node、1994独立步、四构建/35生成检查、14条实际本地TCP/1238回调通过。画面、完整main10/C选择/其余动作和退出返回未完成。[接口](../reports/module-interfaces.md#stage183)、[验收](../analysis/game-battle-body-v1/validation.json)。

<a id="stage182"></a>

## stage182：自有body队列与命令调用核心

新增无平台依赖的legacy-game-battle-body.mjs和legacy-game-battle-commands.mjs。源C记录同步body，M在显式状态5成功加载后消费；32槽manager/预约/合并/延迟/回收、七类队列构造与END等待均可独立调用。199条+sentinel、7201恢复、UINT32掩码/轮次和严格handle已核验，未实现body callback会继续保留busy，不伪造成功。

公共导出为createLegacyGameBattleBodies/createLegacyGameBattleCommands及profile；实际world新增copyBattleCommands、consumeBattleMotion、callBattleCommandManager、callBattleCommand。上下文必须显式包含mainState/substate/controlFlags/localSlot/resourceCode。nextSubstate只是源函数请求，不自动运行产品战斗。copyBattleState.actionExecution仍标unimplemented。

18核心+3源TCP新增、1495全量Node、四构建/28生成检查及6新真实本地TCP通过。完整main10、其余handler、人物动作/特效、渲染/输入/退出返回仍未完成。[接口](../reports/module-interfaces.md#stage182)、[测试](../analysis/game-battle-commands-v1/test-results.json)。

<a id="stage181"></a>

## stage181：M准备器与共享字节层

M的24类token、字段消费、22槽字节计数/掩码、principal及groupAdvance、SKL类别/状态分支、55条顺序别名与可选RID前看已独立实现。新增共享字节/字段读取器保留C原行为；显式world.copyBattleMotionPlan返回自有预处理结果，不消费环、不运行main10或动作回调。32个原生对象槽是并发容量，4095B包内1023条短命令已验证。

新增legacy-game-battle-bytes/motion/motion-data.mjs，仍为无平台依赖纯字节核心；世界端口在有读槽时生成自有计划，未知安全profile输入不改队列。`node --test shared/tests/legacy-game-battle-motion.test.mjs web/tests/legacy-game-battle-motion.test.mjs`通过11项；全套1474项通过。

[源证据](../analysis/game-battle-runtime-v1/source-check.json)、[规格](../analysis/game-battle-runtime-v1/implementation-spec.json)、[测试](../analysis/game-battle-runtime-v1/test-results.json)、[TCP](../analysis/game-battle-runtime-v1/network-validation.json)、[进行中核验](../analysis/game-battle-runtime-v1/validation.json)、[完整目标](../analysis/game-battle-runtime-v1/goal-audit.json)。

**原战斗阶段及stage181仍在进行，phase_complete=false。** 动作预处理不等于动作执行；main10调度/渐变/C真实循环、完整manager/body状态/特效/宠物/影子/渲染、输入与退出/返回仍未实现。其他完整玩法、微信原生gamePage/设备、现行和官方兼容未完成，没有真实测试账号。本轮无新网页交互；未重跑浏览器或增加截图，stage180两流程/6图证据保留，不能计成本轮新验收。整体目标active，0 VM/CUA/WER/CDB/原程序/账号/官方会话，旧诊断不重放。


<a id="stage180"></a>

## stage180：战斗接收与角色记录核心

真正的战斗分派为main10→437b30，不是普通场景main9的250..252。现已把>HY/4f3430普通入场、?+e/4f36d0的C/P/A/M/U分支、两个四槽环、P/A部分字段保留和显式C角色记录消费接入共享核心与world。真实客户端收到入场后关闭旧地图runtime、保持session接收，网页/移动网页隐藏旧地图、禁用普通操作并显示“已收到战斗数据，战斗画面尚不可用，连接保持”。

新增legacy-game-battle.mjs和legacy-game-battle-data.mjs；只自有字节/整数/源表，无平台依赖。`node --test shared/tests/legacy-game-battle.test.mjs web/tests/legacy-game-battle.test.mjs`验证17项；全套1463项通过。消费端口与接收端口分离，未知资源上下文拒绝时不消费队列或部分写入。

[源证据](../analysis/game-battle-transition-v1/source-check.json)、[规格](../analysis/game-battle-transition-v1/implementation-spec.json)、[测试](../analysis/game-battle-transition-v1/test-results.json)、[TCP](../analysis/game-battle-transition-v1/network-validation.json)、[进行中核验](../analysis/game-battle-transition-v1/validation.json)、[完整目标](../analysis/game-battle-transition-v1/goal-audit.json)。

**阶段180仍在进行，phase_complete=false。** C消费目前是显式world接口，尚未接入真实战斗主循环；画面、M完整执行、动作/输入、特效/宠物/影子、渐变与退出/返回未完成。普通队伍其余控制、完整纠偏/input/reset/生产启动及其余玩法、微信原生gamePage和设备、现行与官方兼容也未完成。没有真实测试账号，整体目标active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方会话，stage131已执行恢复的诊断未重放。


<a id="stage179"></a>

## stage179：普通leader badge与party切换核心

实际人物aux04队长/模式图标按源规则创建、重建、移除和推进：创建当帧无动画/绘制，保留帧用当前偏移/原点与人物高度，NULL样式固定palette0/flags0/白色。共享核心拥有并回收子图像。网页/移动网页新增加入/离开按钮；*Cc发本机display及1/0，Kk0仅按真实回复改源状态，HFs到达才显示已加入；离队成功自动经真实session队列发送/Re，使用target及朝向低字节符号扩展。

新增legacy-game-actor-badge.mjs及index出口；party纯策略无I/O，actors拥有实体状态，world和真实session联动已有operation。严格数值/字段/时钟检查；未知ordinary上下文保持错误/显式无数据。

18新增/1446全量Node通过。独立Python覆盖960图标、5376命令、3009锚点及128完整场景/65种RGBA SHA。源模块和中立生成API各2条实际原创OS TCP，共4新路径/256帧，并核对延迟回复、精确出站字节和关闭。14neutral/7生成检查、四构建通过；三App各121输入11输出，API96输入，均0external。

[源证据](../analysis/game-party-actions-v1/source-check.json)、[规格](../analysis/game-party-actions-v1/implementation-spec.json)、[测试](../analysis/game-party-actions-v1/test-results.json)、[TCP](../analysis/game-party-actions-v1/network-validation.json)、[验收](../analysis/game-party-actions-v1/validation.json)、[完整目标](../analysis/game-party-actions-v1/goal-audit.json)。

完整队伍控制/其他快捷键/modal、战斗/宠物/特效/复合转场、其余纠偏/输入/reset/生产启动/资源/玩法、微信原生gamePage和设备、现行及官方兼容仍未完成。无真实测试账号。完整目标active，本轮无VM/CUA/WER/CDB/原程序/账号/官方操作；stage131已执行恢复的诊断不重放。


<a id="stage178"></a>

## stage178：普通队伍纯核心和实际拥有者

实际HFs/进入初始化的队伍mode与本机primary标志已驱动pointer、localMovement、world/runtime和client；队长普通寻路向第一队员送旧显示格，队员按紧凑有效槽位队列依次跟随。移除成员按461f40的slot0队列/对齐/前驱距离门限级联旧target；会员200位抑制普通人物重复步进。

新增legacy-game-party.mjs并经index导出；world.copyPartyInputContext是只读源状态入口。普通队员由内部本机端口及拥有的body FIFO驱动，单独.localMovement.step不会猜测缺失的队列。外部输入不能覆盖已观测队伍上下文，其他guard仍核对。

16项新增、1428项全量Node通过；160距离用例、11个队列长度/速率、16分支组合及3场景224帧完整图像/195种RGBA SHA通过。源模块与实际中立API各3条原创OS TCP，共6条/448帧，独立peer核对队长两条源移动命令、队员零自主命令和关闭归属。12neutral/7生成检查通过；三App各120输入11输出、API95输入，均0external。

[源证据](../analysis/game-party-follow-v1/source-check.json)、[合同](../analysis/game-party-follow-v1/implementation-spec.json)、[测试](../analysis/game-party-follow-v1/test-results.json)、[网络](../analysis/game-party-follow-v1/network-validation.json)、[验收](../analysis/game-party-follow-v1/validation.json)、[完整目标](../analysis/game-party-follow-v1/goal-audit.json)。

完整队伍UI/加入离开响应、aux04队长/模式图标、战斗/宠物影子/活跃复合转场、其他文字/UI与完整纠偏/输入/reset/生产启动/玩法、微信原生gamePage及设备、现行和官方兼容仍未完成；原生x87与非法重复身体/空指针行为未复现。完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage177"></a>

## stage177：普通值条、远端值与五槽队伍数据

普通人物状态值条已进入actor/world/scene/resource与网页开关：本机E(9前四槽、远端]_g最多五组四值、源32位SHL/IDIV及16位宽、零分母跳过、资源原点裁剪、中性调色板4和priority207均有来源。HFs五槽掩码记录、成员/队长标志及普通解绑/解散已接；这仍不等于完整队伍玩法。

新增legacy-game-vitals.mjs纯API，经index导出；源generic207图像进入真实scene/resource路径。`coordinateMode:int32`是实现描述，不是猜测协议字段。源四值/48B行数据、引用清理、值宽和3种资源路径均见[接口](../reports/module-interfaces.md#stage177)。

25项新增、1412项全量Node通过；198个独立整数用例、120帧完整图像/107种SHA、12帧预解码/延迟资源相符。1001人物/3003值条全局图像与文字共用4096槽（文字存在时4095图像）的边界已验。6条实际原创TCP核460帧、每条5次既定客户端请求；9neutral/7生成检查通过。三App119输入11输出、API94输入、0external。

[源证据](../analysis/game-actor-vitals-v1/source-check.json)、[合同](../analysis/game-actor-vitals-v1/implementation-spec.json)、[测试](../analysis/game-actor-vitals-v1/test-results.json)、[网络](../analysis/game-actor-vitals-v1/network-validation.json)、[验收](../analysis/game-actor-vitals-v1/validation.json)、[完整目标](../analysis/game-actor-vitals-v1/goal-audit.json)。

队伍跟随/本机输入上下文同步、aux04队长/模式图标、宠物影子及战斗条源、其他文字/UI、完整纠偏/输入/reset/生产启动与玩法、微信原生gamePage/设备、现行与官方兼容仍未完成。HFs已存状态尚未动态桥接f5f170/f536b2到现有显式输入上下文；完整目标active。本轮无VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage176"></a>

## stage176：纯字节普通标签和显式mask端口

普通人物姓名与选中标签已进入实际actor/world/client/scene/resource链：六档显示、源字节宽度居中、font1/lane0、priority210、插入顺序/黑影、48行Hr]与E(9字段28均有静态来源。局部全局label2/3跨身体重建保留；重复根和resource1过滤不吞已排队文字，离屏/门控及state1/2/3跳过普通名字。

新增legacy-game-text.mjs、legacy-game-text-render.mjs。公开接口见[模块合同](../reports/module-interfaces.md#stage176)；rasterText可由资源job等待，也可供预解码同步合成。未提供非普通lane或原生字体atlas。默认mode0保留此前图像路径；空文字记录仍占全局一个slot。

32项新增、1387项全量Node通过；187宽度、2304标签选择、24文字合成，共2515个独立例（含预期拒绝），120帧完整场景/96种SHA、12帧预解码/延迟精灵相符。6条实际原创TCP核460帧，标签循环不增加5次既定客户端请求；8neutral/7生成检查通过。三App118输入11输出、API93输入、0external。

[源证据](../analysis/game-actor-text-v1/source-check.json)、[合同](../analysis/game-actor-text-v1/implementation-spec.json)、[验收](../analysis/game-actor-text-v1/validation.json)、[测试](../analysis/game-actor-text-v1/test-results.json)、[网络](../analysis/game-actor-text-v1/network-validation.json)、[完整目标](../analysis/game-actor-text-v1/goal-audit.json)。

HP/队伍、其他文字通道/聊天/头顶气泡/aux04/菜单、完整本机纠偏/输入/reset/生产启动与中文语义、战斗及其余玩法、微信原生gamePage/设备、现行消费者和官方兼容仍未完成；整体goal active。本轮0 VM/CUA/WER/CDB/原程序/账号/官方操作。


<a id="stage175"></a>

## stage175：无平台状态图标核心

已将真实45..49/63/64/99和远端40/41/42/44的状态字写入接入actor/world/frame；primary、transient、side图标按前帧偏移、人物高度、资源覆盖顺序、声音、601回调计时及type1队列绘制。源99的raw80门控同步实际指针/移动/镜头/回调；状态全局字与人物31c时长分开，重建时仅时长和自有子对象归零。 新增legacy-game-actor-presentation.mjs并从index导出，规则不依赖DOM、Swift或微信。actors持有源数字状态，frame持有图标player，world/runtime把有证据的80门控接入实际输入；其他显式上下文保留。

27项新增、1355项全量Node通过；546组控制、1540组图标选择/拒绝、1003组高度/旧偏移，共3089个独立例。720帧完整场景/224种SHA、12帧预解码/延迟精灵像素对比、6条实际原创TCP的1660帧一致；7neutral/7生成工程通过。四份新构建App116输入/11输出、API91输入，均0external，原生game Page仍未实现。 [源证据](../analysis/game-actor-presentation-v1/source-check.json)、[合同](../analysis/game-actor-presentation-v1/implementation-spec.json)、[验收](../analysis/game-actor-presentation-v1/validation.json)、[测试](../analysis/game-actor-presentation-v1/test-results.json)、[网络](../analysis/game-actor-presentation-v1/network-validation.json)。

姓名/文本/HP及队伍成员、custom图标生产者、完整本机纠偏/输入/reset/生产启动/中文、战斗与其余玩法、微信原生gamePage/设备、现行消费者及官方兼容仍未完成；整体goal active/incomplete。无测试账号，不重问；本轮0 VM/CUA/WER/CDB/原程序/官方操作，不重放stage131诊断。


<a id="stage174"></a>

## stage174：source60独立附属核心

新增[纯AP/动作计划](legacy-game-actor-attachment.mjs)，actors持有attached，frame在实际普通钩子更新与提交type1。当前人物/坐骑AP只加一次，特殊回调暂停缓存；helper非零不画旧图。复合队列、去重/离屏、1024子槽及所有权沿既有纯核心，无新平台API。

`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`：27新增/1328全量通过；1760独立计划/540完整场景、6实际原创TCP/1300帧、12预解码/延迟路径对比均通过。API90输入，7neutral/7生成检查通过。[合同](../analysis/game-actor-attachment-v1/implementation-spec.json)、[测试](../analysis/game-actor-attachment-v1/test-results.json)。

保留C0 attachmentBytes的独立语义及native/。其他姓名/状态/队伍/UI、完整玩法/现行/原生微信/官方仍未完成。


<a id="stage173"></a>

## stage173：source70骑乘纯核心

新增[ride模块](legacy-game-actor-ride.mjs)：人物资源映射、人物/坐骑动作、AP插值、退出快进及完成判定。actors/frame/scene实现自有子对象、临时效果和复合根队列；实际本机动画写入通过内部桥传递，特殊移动结果同步拥有者。80旋转保留坐骑，结束后恢复普通骑乘；场景/移除/关闭释放全部自有播放器。

`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`：24新增/1301全量通过；5262独立规则、110完整场景、6实际原创TCP/380帧通过。生成API89输入、6neutral/7生成检查通过。[合同](../analysis/game-actor-ride-v1/implementation-spec.json)、[测试](../analysis/game-actor-ride-v1/test-results.json)。

没有新增平台API、官方包字段或官方素材。完整source60附属、队伍、输入/UI/其余玩法/现行/原生微信/官方仍未完成。


<a id="stage172"></a>
## stage172：拥有源状态的旋转回调

legacy-game-actor-spin.mjs提供无平台算术与返回码投影；实际动作80、frame player、源深度排序和场景合成共同拥有状态生命周期。演员快照specialSpin保留counter/首向/完成状态；本机正常资源/朝向与身体不同，真正写入事实及实际body转向比较通过内部所有者桥传递。[接口](../reports/module-interfaces.md#stage172)、[合同](../analysis/game-actor-spin-v1/implementation-spec.json)。

`python3 analysis/game-actor-spin-v1/verify_source.py`核对原PE/26项字节映射与已保留来源；`python3 analysis/game-actor-spin-v1/generate_vectors.py`生成3309原创算术/返回值例和400场景帧。20新增/1277全Node、6实际TCP、5neutral/7工程与11Chrome通过。[验收](../analysis/game-actor-spin-v1/test-results.json)。native历史原型未改，未知state1/2/复合与x87、生产启动/中文/微信宿主/current/官方仍未完成。


<a id="stage171"></a>
## stage171：来源绑定的实体上下文与物件过滤

新增legacy-game-actor-context.mjs纯模块，提供固定源类别/type/draw/初始朝向、已证字段合并及100键普通物件过滤。演员快照sourceFrame/sourceSceneMode由实际注册、单位和场景驱动；明确入场准备时mode初值0有源。world直接读取scene.fields[8]，client启用bindActorSource，未知门控与复合状态继续显式传入。[接口](../reports/module-interfaces.md#stage171)、[合同](../analysis/game-actor-context-v1/implementation-spec.json)。

`python3 analysis/game-actor-context-v1/verify_source.py`核对样本、表、来源链及74字节/映射和1xref；`python3 analysis/game-actor-context-v1/generate_vectors.py`生成508原创独立例/120混合帧。18新增/1257全Node、6新增实际TCP、4neutral/7生成检查及11Chrome通过，初稿mode/声音误接已有真实client红绿回归。[测试与更正](../analysis/game-actor-context-v1/test-results.json)。

所有新增功能位于无平台依赖核心；native历史原型未改。普通逻辑过滤不等于完整原生UI/party/复合状态或当前/官方兼容，生产启动、中文、原生微信宿主与玩法继续开发。


<a id="stage170"></a>
## stage170：源字段驱动的本机对象与入场等待

演员核心新增prepareCharacterEntry及带真实坐标/可选重建的beginScene；世界入口保持appearance field16，另接已证raw本机初值、身份与main9逻辑构造。当前资源、外观、身份、坐标/朝向分别保存，早到位置不会被首个C0回卷。ready普通场景使用新local key，旧动画player失效。

sourceEntryWaitMask从3开始，只在已支持本机单位/地图验收后清位；copyLocalSceneReadiness和移动所有者遵守等待。元数据不是新wire字段或全量原生UI镜像。其余runtime/actor/input context仍显式传入。[接口与范围](../reports/module-interfaces.md#stage170)、[合同](../analysis/game-local-bootstrap-v1/implementation-spec.json)。

`python3 analysis/game-local-bootstrap-v1/verify_source.py`核对源身份/字节；`python3 analysis/game-local-bootstrap-v1/generate_vectors.py`生成288原创独立例。19新增/1239全部Node、8新增实际原创TCP、3neutral/7生成工程与11Chrome通过。[验收](../analysis/game-local-bootstrap-v1/test-results.json)。完整游戏、原生微信/current/官方未完成。


<a id="stage169"></a>
## stage169：可移植client与明确启动配置

新增legacy-game-client-config/client，从shared/index导出。startup/context严格校验并拥有mapping/digest/resource parameter字节，context全部明确、无缺省零。sourceHash是调用者配置声明，不验证所选资源/官方身份；派生schema不是厂商文件。client通过显式文件/clock/session factory/观察端口拥有world/library/session/runtime/CUT，没有DOM/Node或平台全局依赖。

材料就绪看真实入场/scene/map/local actor/速度/当前格，不看收包数。world新增copyLocalSceneReadiness只返回元数据。场景变化、丢就绪和关闭立刻失效旧输入/画面；resume重置clock；共享文件端口仍借用，晚I/O不得重建所有者。完整native UI/phase并未模拟。

22新/1220全Node、240独立idle与各52场景摘要、7TCP/实际双目标WS/7Chrome、2neutral/7工程均通过。固定web Page已落地，原生微信与生产context/启动/文本/current/官方仍未验。[API](../reports/module-interfaces.md#stage169)、[合同](../analysis/game-browser-owner-v1/implementation-spec.json)、[验收](../analysis/game-browser-owner-v1/test-results.json)。native/与vendor原件未修改。


<a id="stage168"></a>
## stage168：共享外观与升级、纠正预览常量

新增无平台I/O的legacy-game-character-codes/options：四数值换算被preview/creation/options共用，纯148B拥有变换实现action3..6及源门槛；14项逆表之外原子拒绝。原生默认值是0x814c=33100，旧33000参考修正24行，合法33000输入仍保留。变换不生成网络请求、未知预览像素或标签。

flow新增changeAppearance、begin/retry/acknowledgeVersionUpgrade，source WDM低字节独立结果、无源deadline，成功ack后重查名单。已知kind2/4与marker拥有/清零，未知category7及gen1停滞分支明确拒绝。world.prepareCharacterEntry只一次写已证明field16，不零化未知字段或推actorID。

19新增/1198全Node、15296外观/1566升级/1128修正预览，以及新构建2neutral/7工程、6TCP/5Chrome验证通过。native/维持保留，无Swift/AppKit新增。[精确接口](../reports/module-interfaces.md#stage168)、[合同](../analysis/game-character-options-v1/implementation-spec.json)、[验收](../analysis/game-character-options-v1/test-results.json)。full runtime/Page/current/官方继续未完成。


<a id="stage167"></a>
## stage167：纯创建控制、数值与源握手

新增`legacy-game-character-creation.mjs`并由index导出draft/profile/error；已有characters flow扩创建确认/ack/轮询与成功后刷新。名称拥有副本、16B宿主范围、默认CRT与两种字节对规则，外观数值和30/10点守恒；inspect不含名称，copy/prepare的byte副本由接收者清，close清内部材料。没有DOM/socket/平台时钟/文本编码/文件写入，不自动填入样本身份。

8400外观/6000控制/306名称独立参考、18新/1179全Node、neutral实际bundle与完整原创流通过。复现：`node --test shared/tests/legacy-game-character-creation.test.mjs web/tests/legacy-game-character-creation-session.test.mjs web/tests/legacy-game-character-creation-tcp.test.mjs`。源成功触发真实列表查询，不构造本地新人物；default login-only/已有选人保持。删除、native preview/reset/profile与current/官方仍未验。[合同](../analysis/game-character-lifecycle-v1/implementation-spec.json)、[接口](../reports/module-interfaces.md#stage167)、[回执](../analysis/game-character-lifecycle-v1/test-results.json)。


<a id="stage166"></a>
## stage166：纯字节人物列表与已有角色入场

新增`legacy-game-characters.mjs`，index导出两槽148B解码、内容探测/门槛、选择前数值预处理与拥有状态的character flow。字段按源id/偏移表示，不猜测等级/HP；typed bytes由core复制/清零，copySlots为调用者拥有副本，genuine graphics借用不关闭。无DOM/socket/平台时钟/文本API；sourceEnterComplete只证nextmain9握手。

211记录/1566门槛/1128预处理独立参考及实际641666图形记录探测一致；28新增/1161完整Node、2neutral实际bundle和TCP/浏览器链通过。复现：`node --test shared/tests/legacy-game-characters.test.mjs web/tests/legacy-game-characters-session.test.mjs web/tests/legacy-game-characters-tcp.test.mjs`。previewPixels、native完整重置/创建删除/aux、完整/current/官方未验。[合同](../analysis/game-post-login-v1/implementation-spec.json)、[API](../reports/module-interfaces.md#stage166)、[回执](../analysis/game-post-login-v1/test-results.json)。


<a id="stage165"></a>
## stage165：纯字节post-connect登录核心

新增`legacy-game-login.mjs`并从index导出。显式NUL交接与模块摘要输入，拥有副本、C空白/首子串规则、单次源命令/回复、uint32 deadline、82..99延迟完成与close清零。模块摘要只收明确字段，不自动计算或假定原样本身份；sourceLoginComplete不表示游戏或官服接受。新文件没有DOM、socket、平台时钟/文本/crypto API。

24交接/131轨迹4315状态匹配独立Python；25新/1133全Node、2neutral和实际流/浏览器验证通过。fresh world仍由外层创建/关闭，API打包须保持同一模块身份。复现：`node --test shared/tests/legacy-game-login.test.mjs web/tests/legacy-game-session.test.mjs web/tests/legacy-game-session-tcp.test.mjs`。[接口](../reports/module-interfaces.md#stage165)、[源合同](../analysis/game-session-runtime-v1/implementation-spec.json)、[验收](../analysis/game-session-runtime-v1/test-results.json)。完整/current/官方目标继续active。


<a id="stage164"></a>
## stage164：源资源计划与无像素 drawPlan

新导出createLegacyGameResourcePlan、legacyGameCutPath、createLegacyGameDrawPlan、createLegacyGameResourceLibrary。actor/scene可选deferImages后只做source motion/helper/merge并返回数值计划，实际呈现再用library.startRender；skip不读图，失败可retry同一计划而不重跑逻辑。旧同步路径保留。library拥有目录/中性色表/缓存，File端口借用，readCut的CUT由调用者拥有。[完整接口](../reports/module-interfaces.md#stage164)。

复现：node --test shared/tests/*.test.mjs web/tests/*.test.mjs，1108通过（21新）；node --test analysis/game-resource-runtime-v1/portable-test.mjs，2neutral通过。209路径、4palette、160裁剪、52场景与两实际TCP请求一致。主机实际目录641666记录/2520动画，36个像素摘要一致；不当作版本或官方接受。[验收](../reports/validation.md#stage164)。

完整登录页→游戏接线、微信游戏Canvas与原生文件/调度、真实runtime/record/UI上下文、动态LUT/命名调色板/效果、骑乘组队/primitive/小地图、战斗/其余业务及认证、现行与实际三端/官方可玩仍未完成。旧版37c4源码与当前安装资源能按格式组合验证，不构成9baa/6e2ff消费者或官方接受证明。

<a id="stage163"></a>
## stage163：源输入、clock与运行核心

新公开接口：unprojectLegacyGamePosition/pickLegacyGameTile/createLegacyGamePointer、createLegacyGameClock、createLegacyGameRuntime({world,initialTick,initialCamera})；world新增advanceFrameFollowingLocal/copyLocalMovement/setLocalMovementContext。runtime无平台API，借用真正world/resources并拥有pointer/clock/明确camera。native context门精确校验，旧advanceFrame接口不变；右键effects仍unmodeled，cursor不是wire。详见[接口](../reports/module-interfaces.md#stage163)。

运行node --test shared/tests/*.test.mjs web/tests/*.test.mjs；本轮1087通过（20新），另node --test analysis/game-input-runtime-v1/portable-test.mjs为2neutral；独立1213pick/33input/1800clock及52scene/实际TCP两发送请求相符。source double16⅔正常节奏、19skip、严格等待，input先用旧camera后跟随，server修正和ownGate有单独回归。[验收](../reports/validation.md#stage163)。

**更正：** stage162 对“渲染窗口不同于碰撞窗口”的表述有误；45f1c0/45f250 同输入使用相同矩形公式，100 组跨模块比较通过。旧数值代码未改，旧阶段正文作为历史保留，以本节与更新后的 source-check 为准。

完整资源与原生 runtime/record/UI 上下文绑定、右键交互、小地图/primitive/特殊角色/特效、战斗/其余业务及认证、现行版本、实际三端与官方可玩仍未完成。旧版37c4不等同9baa/6e2ff；本轮没有VM、WER、CDB、账号、官服或原生IDE新操作，也未重放已消费停止点。

<a id="stage162"></a>
## stage162：源普通地图/物件/实体场景核心

新增legacy-game-scene-frame.mjs：拥有CUT12/18B目录、源渲染窗口与对角遍历、普通地形、静态/动画地图物件、多格比较/三队列合并；world可选configureSceneFrames接已有地图/actor/移动输出RGBA。renderer新增sourceRectangle，graphics新增ordinal占地元数据；借用资源、地图播放器拥有权、部分失败/取消边界明确。[接口](../reports/module-interfaces.md#stage162)、[合同](../analysis/game-legacy-scene-frame-v1/implementation-spec.json)。

17新/1067完整Node、2neutral、7工程和3构建通过；144原创/52TCP场景帧、160裁剪及341CUT/401103记录相符。现仍是普通场景核心，实际输入/帧时钟/资源/Canvas宿主、UI/小地图/特殊效果/战斗/认证/现行/三端与官服未完成。[验收](../reports/validation.md#stage162)。

<a id="stage161"></a>
## stage161：实体回调到拥有RGBA的世界帧

新增legacy-game-frame.mjs，world通过`configureActorFrames`/`advanceFrame`连接已有wire实体、本地/远端移动、动画phase重播与写回、创建FIFO/源门/重复次数、原生深度排序和普通实体RGBA。图形目录新增声明ID ordinal查询，初始player图形纠正−1。源上下文/资源提供器显式借用，移除/场景/关闭释放播放器；绘制失败保留待发请求和协议可用性。[接口](../reports/module-interfaces.md#stage161)、[合同](../analysis/game-legacy-frame-v1/implementation-spec.json)。

17新/1050完整Node、2neutral、7生成工程通过；1064计划/44排序/448耦合帧与52真实本地TCP帧相符。无平台API核心可携带，完整scene/ground/object/特殊回调/input/resource host、战斗/认证/现行/实际三端及官方可玩仍未完成。[测试](../analysis/game-legacy-frame-v1/test-results.json)。

<a id="stage160"></a>
## stage160：源动画目录、计数与普通帧桥接

新增legacy-game-animation.mjs：拥有group index/animation/AP字节、惰性解12/20/10/8B数据、source每helper调用cached action/方向/资源/延迟/loop/once/freeze/event。imageAt ordinal→archive→actualRD geometry→player drawOffset→prepared sprite→priority10 RGBA有原创端到端测试；不按文件名或16ms猜上下文。[接口](../reports/module-interfaces.md#stage160)。

21新/1033完整Node、2neutral、7工程，35组1250状态/1235普通RGBA步及396本地资源16034动作58146帧metadata相符。自动actor/network same-action restart、完整callback/scene时钟/资源input host与named palette/特效/音频/战斗/auth/current/官方未完成；motion.phase仅澄清为last action，未悄然改旧API值。[合同](../analysis/game-legacy-animation-v1/implementation-spec.json)、[测试](../analysis/game-legacy-animation-v1/test-results.json)。


<a id="stage159"></a>
## stage159：拥有图像、native32颜色与普通帧

新增legacy-game-render.mjs：真实RD flags/全命令别名/零填、CGP672B、default/explicit/partial native32 palette、bottom-up→RGBA sprite、源priority/ordinal排序的翻转/视口帧。image/palette/sprite拥有缓冲并copy/close，frame拥有rgba；显式LUT/context与所有安全域见[接口](../reports/module-interfaces.md#stage159)。graphic catalog opt-in includeImages接archive byte range/origin，默认碰撞表行为保留；旧rd-runs结构API不变。

28新/1012完整Node、2neutral和315RD/23palette/100frame原创参考通过；本地27854记录摘要/288RGBA抽样匹配（34安全拒绝）。普通图像软件路径已实现，动画与真实scene/input/clock/host、特效/战斗/auth/current/三端官方仍未完成。[合同](../analysis/game-legacy-render-v1/implementation-spec.json)、[测试](../analysis/game-legacy-render-v1/test-results.json)。


<a id="stage158"></a>
## stage158：实际碰撞、导航与普通本机状态

新增graphics/navigation/local-movement，按固定37c4源40B图形元数据、两mode碰撞、方向路径/合并、batch2/float运动/缺块等待、地块事件与turn请求实现。world组合current map/actor/pose，map.readRectangle避免逐帧全cache拷贝；source context显式绑定，无新依赖/平台API。[接口](../reports/module-interfaces.md#stage158)、[合同](../analysis/game-legacy-local-movement-v1/implementation-spec.json)。

37新增/984完整Node、2neutral/7工程及4轮原创TCP通过。native/vendor保持；完整input/scene/party/UI上下文、renderer/动画/战斗/auth、现行与三端/官方未完成。[验收](../reports/validation.md#stage158)。

<a id="stage157"></a>
## stage157：实体与普通远端移动核心

新增actor/motion/data模块及index导出；实体三型/归属/动作/删除和1000容量、10目标插值队列、65方向表/投影/资源ID映射、源移动描述符有证据。world集成source globals与scene清理，显式tick/资源模式；原raw入口保留。未知本机速度/碰撞/条件生命周期及复合效果不猜测。[接口](../reports/module-interfaces.md#stage157)、[合同](../analysis/game-legacy-actors-v1/implementation-spec.json)。

33新增/947完整Node、2neutral/7工程通过，原创Python TCP验证实际移动请求和10消息实体链。native/vendor保持，无新依赖。完整游戏host/绘制/战斗/auth、现行与三端/官方仍未完成。[验收](../reports/validation.md#stage157)。

<a id="stage156"></a>
## stage156：场景/状态核心和world工厂

index新增scene准备、冻结30/18状态目录、掩码增量/标签解码及拥有状态对象，另加`createLegacyGameWorldProtocol()`自动按场景准备当前缓存。原raw协议入口保留；无新依赖/平台API。字段高层名字、native guard/actor/renderer及持久cache路径未推定。[接口](../reports/module-interfaces.md#stage156)、[合同](../analysis/game-legacy-scene-v1/implementation-spec.json)。

16新/914完整Node、2neutral/7工程通过，21场景/119状态/20标签和隔离原创12消息TCP闭环有证据。native/vendor字节保持，完整游戏/当前版本与三端/官方未完成。[验收](../reports/validation.md#stage156)。

<a id="stage155"></a>
## stage155：源绑定地图缓存核心

index新增`LEGACY_GAME_MAP_PROFILE`/error、矩形读取/固定校验/区域decode与apply及显式map state；协议新增configureMapCache/copyMapCache和地图effect。源为37c4三连续LE16缓存，mode mask/固定1458B、pair-aware列表与第三层OR0xc000有证据。无平台API/新依赖；没有缓存/场景/绘制来源推定。[接口](../reports/module-interfaces.md#stage155)、[规格](../analysis/game-legacy-world-v1/implementation-spec.json)。

`node --test shared/tests/legacy-game-map.test.mjs`及neutral通过；15新/898完整Node、2neutral/7工程及原创TCP补取/补丁闭环通过。既有native/vendor字节保持；实际场景、actor/玩法、完整认证、当前版本和三端/官方仍未完成。[验收](../reports/validation.md#stage155)。

<a id="stage154"></a>
## stage154：消息目录与有界协议状态

index新导出冻结`LEGACY_GAME_MESSAGE_CATALOG`、profile/error、整数/byte field编解码、command编码/消息和binary解码及`createLegacyGameProtocol`。60发送/104接收是明确37c4来源，key-readiness/更新与网络位置意图可由字节流驱动；没有执行原生handler或完整actor/业务状态。[接口](../reports/module-interfaces.md#stage154)、[目录](../analysis/game-legacy-message-v1/dispatch-catalog.json)、[源合同](../analysis/game-legacy-message-v1/implementation-spec.json)。

`node --test shared/tests/legacy-game-message.test.mjs`与`node --test analysis/game-legacy-message-v1/portable-test.mjs`通过；17新/883完整Node、2neutral/7工程及隔离原创PythonTCP每轮62回复/104分支有证据。字节有损/不安全域、身份/当前版本unverified、actor/其他95业务和平台/官方未验均保持，既有crypto依赖原字节未改。[测试](../analysis/game-legacy-message-v1/test-results.json)、[完整审计](../analysis/game-legacy-message-v1/goal-audit.json)。

<a id="stage153"></a>
## stage153：旧版正文与初始材料codec

index新增`LEGACY_GAME_PAYLOAD_PROFILE`、`LegacyGamePayloadError`、`createLegacyGamePayloadCodec`和`createLegacyGamePayloadCodecFromBootstrap`。固定37c4，前者拥有64非NUL材料并做8B重排/循环XOR、有损NUL/0x11规则；后者只验112B/64B结果分支，再返回codec。close清内部材料，inspect不含key，身份/当前兼容仍unverified。[接口](../reports/module-interfaces.md#stage153)、[源规格](../analysis/game-legacy-transform-v1/implementation-spec.json)。

补入两个MIT纯JS2.4.0闭包，原源码/许可及包SRI/文件hash见[noble-hashes来源](vendor/noble-hashes/2.4.0/provenance.json)和[noble-ciphers来源](vendor/noble-ciphers/2.4.0/provenance.json)。`node --test shared/tests/legacy-game-payload.test.mjs`、`node --test analysis/game-legacy-transform-v1/portable-test.mjs`通过；16新/866完整Node、2neutral/7工程及原创Python/OpenSSL/隔离TCP均有证据。bootstrap同步8192轮的UI/设备性能未验；text/认证/玩法与官方接受仍未完成。[测试](../analysis/game-legacy-transform-v1/test-results.json)、[完整审计](../analysis/game-legacy-transform-v1/goal-audit.json)。

<a id="stage152"></a>
## stage152：独立旧版游戏外帧

index新增`LEGACY_GAME_ENVELOPE_PROFILE`、`LegacyGameEnvelopeError`、`encodeLegacyGameEnvelope`及`createLegacyGameEnvelopeReader`。固定37c4旧版，格式AFEF/LE16/opaque/EFAF；payload是已转换的wire字节，不接明文业务/账号。reader提供append/next/finish/close/inspect，一次一事件，复制输入及输出、256KiB队列、0..32767载荷，保留原候选8B门槛。[接口](../reports/module-interfaces.md#stage152)、[源规格](../analysis/game-legacy-network-v1/implementation-spec.json)。

`node --test shared/tests/legacy-game-envelope.test.mjs`与`node --test analysis/game-legacy-network-v1/portable-test.mjs`通过；原创Python24向量、新12/完整850Node、2portable及7生成工程有本机回执。正文/key/认证/玩法和现行版本、平台/官方接受不由封包测试证明。[测试](../analysis/game-legacy-network-v1/test-results.json)、[完整审计](../analysis/game-legacy-network-v1/goal-audit.json)。

<a id="stage151"></a>
## stage151：新主游戏来源进入静态合同，接口代码未改

新取得的37c4旧版SE提供Config/资源名/命名映射实际消费者，可为后续跨平台实现建立来源；本分析标识与现有launcher sourceProfile=legacy不同。255B一行+NUL的游戏读取不能简单套用配置器Read256，也不能将gid:/glt:前缀直接当已证明的认证协议。[首批静态合同](../analysis/game-release-current-v1/static-contract.json)、[REA与源字节核对](../analysis/game-release-current-v1/source-check.json)。

shared产品代码及已有raw/压缩结构模型保持；本轮新原创代码只是离线成员/源锚点核验器，1正/6负通过。JS838/portable2/工程7为stage150记录，本轮未重跑。后续由完整业务/资源消费者合同推进独立游戏实现。[原创核验器](../analysis/game-release-current-v1/verify_source.py)、[完整目标审计](../analysis/game-release-current-v1/goal-audit.json)。

<a id="stage150"></a>
## stage150：RD v1/v3结构模型（独立于raw解码）

index新增导出 `RD_RUN_MODEL`、`RDRunError`、`decodeRDRunModel(bytes, {record}?)`；一个≤32MiB压缩记录按模型精确展开到≤4Mi像素+p。返回pixels/pixelKnown与opaque.paletteBytes/paletteKnown，各自独立buffer；known=0的零存储不可当恢复色号或alpha。C/D/E含义、色彩/方向/原点仍未知，原decodeRD v0/v2不变。[接口](../reports/module-interfaces.md#stage150)、[格式](../reports/resource-formats.md#stage150)。

可运行 `node --test shared/tests/rd-runs.test.mjs` 和 `node --test analysis/game-rd-runs-v1/portable-test.mjs`；原创48向量、新9/完整838Node、2portable通过。完整本地语料差分须显式指定用户自己的材料路径，脚本只输出摘要/计数，官方像素不附带。27,751结构接受、34模型拒绝不等于游戏/颜色兼容。[测试回执](../analysis/game-rd-runs-v1/test-results.json)、[完整目标审计](../analysis/game-rd-runs-v1/goal-audit.json)。

<a id="stage149"></a>
## stage149：游戏配置器字节模块

GAME_CONFIG_PROFILE/GameConfigError/createDefaultGameConfig/encodeGameConfig/decodeGameConfig已导出，来源固定Config.exe9389add9。支持全部规范保存组合及明确的前256B/首NUL或bounded EOF读取；无文件、renderer或通信API，不将历史deviceCode映射成平台图形后端。[接口](../reports/module-interfaces.md#stage149)、[源与测试](../analysis/game-config-v1/test-results.json)。

<a id="stage148"></a>
## stage148：资源二进制缓存封套

新增LAUNCHER_RESOURCE_CACHE_FORMAT、LauncherResourceCacheError及encode/decodeLauncherResourceCacheRecord，shared入口导出。原创MOLIRES1绑定既有v1/v2 snapshot，canonical ASCII JSON+原文件字节；完整1024/32MiB每文件/64MiB总预算保留。无IO、凭据/初始化所选登录器或平台文本codec；摘要不认证来源。[格式](../reports/resource-formats.md#stage148)、[接口](../reports/module-interfaces.md#stage148)。

<a id="stage147"></a>
## stage147：当前补丁命令与轮询数据

新增当前profile、引用/转义字节API、规范ASCII路径计划、UInt32轮询和退出策略，shared入口导出。legacy API/默认保留；当前计划≤259B且root分隔符一次，不进行Windows路径/文件存在性或进程操作。formatter的370原创向量与计划覆盖范围分开说明。[完整接口](../reports/module-interfaces.md#stage147)、[源与测试](../analysis/launcher-current-patch-v1/test-results.json)。

当前计划保留的`packagedSourceRelativeBytes`只属旧格式派生声明，`packagedSourceStatus`明确标为当前未证；当前缺失补丁程序的完整准备来源仍待核对。

<a id="stage146"></a>
## stage146：纯补丁执行、相同路径策略和ZIP基础资源

game-patch-data/game-patch-paths承接原预算/错误/路径/树策略，game-patch运行体保留并重导出旧接口。直接导入launcher-game-patch的显式decoder目录计划或七端口prepare factory，Web包装保留原默认；launcher-resource-import把用户ZIP只读转owned基础files，复用同路径/树和1024文件/64MiB预算。launcher-patch-route为本项目桥接合同，不是新官方字段。[接口](../reports/module-interfaces.md#stage146)、[格式](../reports/resource-formats.md#stage146)。

原创建Python ZIP和完整792Node验证基础资源、冲突/树/原始内容、1024边界与补丁回归；新5生成工程为平台适配层的本地证据。固定PUK3消费者与旧caller分别绑定样本，未证明任意PatchEXE或当前主程序所有producer等价。未新增game协议/业务状态、原生执行或可玩证明。[源与材料边界](../analysis/launcher-wechat-patch-v1/source-check.json)、[验收](../reports/validation.md#stage146)。

<a id="stage145"></a>
## stage145：纯目录候选校验和原创缓存记录

直接导入launcher-catalog-data的原字节/摘要/XML接口（snapshot要求显式decodeText）；Web原入口保留native解码默认。launcher-catalog-cache导出portable snapshot、encode/decode及格式/错误类，用既有纯UTF8/GB18030解码。原shared/index、协议和native代码保持，独立缓存不定义官方通信字段。[接口](../reports/module-interfaces.md#stage145)。

MOLICAT1记录44B头及两份raw目录，各≤1MiB，仍受原XML256KiB字符等上限；revision/编码/兼容政策及全部payload受整记录MD5校验，trust固定unverified。独立Python struct/hashlib向量、JS反向读取、BOM/行尾、高revision/畸形/预算和完整773Node通过。[布局](../reports/resource-formats.md#stage145)、[原创实现/向量](../analysis/launcher-wechat-cache-v1/original_cache.py)、[验收](../reports/validation.md#stage145)。

<a id="stage144"></a>
## stage144：新增纯目录文本解码入口

直接导入`shared/launcher-catalog-text.mjs`的decodeLauncherCatalogText(bytes,{encoding})：ArrayBuffer/Uint8Array各≤1MiB，显式utf-8/gb18030，畸形fatal，无DOM/平台API/locale推断。UTF-8只去一枚开头BOM；GB18030用固定WHATWG完整表/范围并保留BOM。旧index/协议/凭据编码未改，windows-936不可替代此目录格式。[格式/许可](../reports/resource-formats.md#stage144)、[接口](../reports/module-interfaces.md#stage144)。

源表按provenance中的固定URL/hash准备后，`python3 tools/generate-gb18030.py --source-dir <local-source-dir>`可离线重生成；不从网络或游戏提取映射。表23940项/207范围，保留WHATWG BSD许可和linked构建声明。[来源](vendor/whatwg-gb18030/provenance.json)、[生成器](../tools/generate-gb18030.py)。完整751Node包括全部有效UTF-8标量/GB四字节指针及双字节与当前Node/ICU对照，实际微信/官方/游戏未验。[验收](../reports/validation.md#stage144)。

<a id="stage142"></a>
## stage142：已有current flow通过微信薄适配复用

shared协议核心/导出没有改变；新微信入口与端口在adapters/wechat，调用同一flow和session驱动。原生API形状/独立Python与无DOM构建专项已验证，完整709Node通过；真实微信/设备/官方会话及游戏仍未验。[构建与接入](../adapters/wechat/README.md#stage142)、[接口](../reports/module-interfaces.md#stage142)、[验收](../reports/validation.md#stage142)。

<a id="stage140"></a>
## stage140：当前候选解码器增加启动协议声明元数据

既有`decodeWin32LauncherUpdatePackage`增加`startupAcknowledgement`冻结字段，声明为v1或absent，确认状态固定not-observed；畸形所选资源拒绝。它只读候选字节，不执行EXE、创建事件或替换文件；旧header-profile/32MiB预算和unverified语义保留。[接口](../reports/module-interfaces.md#stage140)、[支持格式](../reports/resource-formats.md#stage140)。

运行`node --test shared/tests/launcher-update-ack.test.mjs`测试23项独立Python合成PE/ZIP用例；本阶段相关72及完整shared/web686项实际通过，桌面/手机尺寸浏览器ESM各23项通过。Node26.9.0；不新增依赖安装或构建步骤，现有适配层照常调用原decoder。真手机/微信、原生事务与官方接受未验证。[测试](../analysis/launcher-startup-ack-v1/test-results.json)、[浏览器](../analysis/launcher-startup-ack-v1/browser-audit.json)。

<a id="stage137"></a>
## stage137：当前更新交接参数encoder

`encodeWin32LauncherUpdateArguments`接收恰五个own字段`parentPid,urlBytes,launcherPathBytes,archiveSizeBytes,launcherMd5Bytes`，输出独立`argumentBytes`及明确unverified/not-performed状态。它只按已证当前formatter生成数据；内部SP转管道，保留数字前导零与MD5大小写，ASCII范围≤570B；无Node/DOM/wx/网络/文件/进程依赖，未接原生执行或页面。[完整输入/错误边界](../reports/module-interfaces.md#stage137)、[源/政策](../analysis/launcher-update-arguments-v1/implementation-spec.json)。

运行`node --test shared/tests/launcher-update-arguments.test.mjs`验证新13项；本轮相关88和完整shared/web663项实际通过。256MiB只描述参数文字上限，ZIP/HTTP32MiB预算不变。浏览器/设备/原生事务和游戏接受未新增验收。[测试](../analysis/launcher-update-arguments-v1/test-results.json)。

<a id="stage136"></a>
## stage136：明确来源选择仍是纯核心政策

新增`shared/index.mjs`导出的`snapshotLauncherSourceProfile(input)`，仅从own data选择legacy或win32-current，并返回冻结{id,bootstrapProfile,handshakeProfile}；省略默认legacy，继承/accessor/未知/显式undefined值拒绝。无Node/DOM/wx/网络/存储依赖，不是协议wire字段或认证结果。原有握手/record/metadata字节实现不改。[接口](../reports/module-interfaces.md#stage136)。

Node/runtime/实际页面现在按同一选择串起已有当前factory，不因当前网页功能而扩展游戏字段。650完整Node与6浏览器有限流程通过，随后仅原创对端signal修正并重跑8相关项/CLI stop；真实认证、游戏与目标设备仍未验。[验收](../reports/validation.md#stage136)。

<a id="stage125"></a>
## stage125：游戏一次读取为零，核心合同未新增

安装版游戏一次普通启动与固定 `.text` 读取已执行；读取器 `TEXT_ZERO` / exit1、未生成文件，游戏随后 `0xc0000005` 退出。未取得可支撑新业务字段的消费者，shared API、解析器及rev30未改，本轮未重跑产品测试。[运行事实](../analysis/game-text-observer-runtime-v1/game-runtime-stage125.json)、[下一步](../reports/development-plan.md#stage125)。

<a id="stage122"></a>
## stage122：跨平台核心未改，游戏消费者仍待真实代码

本次具体游戏观察已获确认；普通输入恢复后 Mac 锁定，未启动或读取原游戏。纯字节核心、接口、rev30 和历史测试未改；正常恢复后先执行已审阅的一次诊断，再由 REA 消费者证据驱动实现。[当前需求](../reports/development-plan.md#stage122)、[实际输入边界](../analysis/game-text-observer-runtime-v1/input-recovery-stage122.json)。

<a id="stage119"></a>
## stage119：原创分析工具资格通过，核心合同保持原范围

同一Windows原创6624B快照已返回并全字节比较相等，分析依赖的正向资格补齐。游戏静态前检/新恢复点/独立诊断方案已准备，游戏尚未执行或读取；没有新消费者或字段，产品源码与rev30（7 observed / 13 unknown）未改，也未重复运行旧产品测试。三平台/官方可玩未完成。[当前需求](../reports/development-plan.md#stage119)、[验收](../reports/validation.md#stage119)。

<a id="stage118"></a>
## stage118：产品模块未改，分析依赖取得Windows读取实证

本轮只增加analysis固定传输工具与原创fixture的实际6624B读取/摘要/自然退出证据；原始文件直接比较仍待普通输入恢复。没有新增游戏字段或重复运行旧产品测试，三平台/官方可玩仍未完成。[当前范围与下一步](../reports/development-plan.md#stage118)、[验收](../reports/validation.md#stage118)。

<a id="launcher-stage114"></a>
## stage114：来源缓存格式已通过真实浏览器验证

既有binding/资源快照格式与模块hash未变。真实Chrome156原生IndexedDB验证v2来源1与默认v1跨浏览器正常重启；v2来源0跨重载与副本变异、错误来源拒绝、明确选择和旧CAS均通过。两尺寸合计83项，35实际加载模块匹配旧交付；不把阶段113的79Node当本次新运行。[浏览器证据](../analysis/launcher-cache-source-browser-v1/browser-results.json)、[源审计](../analysis/launcher-cache-source-browser-v1/implementation-source-check.json)。

当前是原创缓存数据资格，未新增游戏协议字段。游戏原.text、正常消费者、认证、物理设备/微信及官方可玩仍未验收。

<a id="launcher-stage113"></a>
## stage113：固定Patcher来源数据与512操作容量

新增`PUK3_PATCH_SOURCE_PROFILE`、`LauncherPatchSourceError`、`createPuk3PatchSourcePlan({address,portText})`。精确地址221.122.108.10与decimal1..65795产生冻结两来源：配置host/原portText，及native备选221.122.119.156:80；profileId/sourceSha256说明195f样本算法，不认证远端或安装文件。无I/O，支持范围是明确的地址子集。[模块](launcher-patch-sources.mjs)、[规格](../analysis/launcher-current-entry-v1/implementation-spec.json)。

`GAME_PATCH_LIMITS.operations=512`，与blocks512共同约束，其他字节/文件预算保持。两份真实378操作清单已解析；11项原创新增测试与相关既有回归合计79Node通过。官方输入留私有build；真实认证、游戏协议消费者/玩法和目标平台可玩未验。[测试](../analysis/launcher-current-entry-v1/test-results.json)、[真实重解析](../analysis/launcher-current-entry-v1/manifest-reanalysis.json)。

缓存所有者原先投影丢失profile/ordinal，导致键相同、不同来源可误恢复；3项新回归已实际失败再修复。现在固定来源进入资源键并使用resources.v2，默认/旧缓存仍为v1；79项回归包含键、格式、页面恢复和旧缓存路径，浏览器V2持久化仍待验。

<a id="launcher-stage112"></a>
## stage112：opaque控制接口已有现行源码对应

现有`encodeLauncherRequest1({wordA,wordB})`的tag1+两UInt32BE、9B体与当前5890c0对应；词的业务含义/真实值待证。type2有界notice保留两词与unverified认证，current握手/record选择保持。已追踪正常提交段没有建立必须新增的版本控制步骤，本轮公共API及产品代码不变。[接口与边界](../reports/module-interfaces.md#stage112)、[源规格](../analysis/launcher-current-control-v1/implementation-spec.json)。

实际相关45Node通过，可复现：

```sh
node --test --test-reporter=tap shared/tests/launcher-replies.test.mjs shared/tests/launcher-flow.test.mjs shared/tests/launcher-current-record.test.mjs web/tests/launcher-current-record.test.mjs
```

这是已有原创字节/状态回归，未运行真实加密账号或原游戏，字段意义与三平台/官方可玩仍待验。[测试记录](../analysis/launcher-current-control-v1/test-results.json)。

<a id="launcher-stage111"></a>
## stage111：现行record与旧契约分开选择

新增LAUNCHER_CURRENT_RECORD_PROFILE、createLauncherCurrentRecordCodec(key8)、createLauncherCurrentRecordStream(key8)。现行发送ceil(n/8)*8+8补零，接收0/0空record合法并仅取声明前缀；generic的floor规则/最低cipher8B保留。current flow/session的handshakeProfile='current'同时选择现行握手和record，默认仍generic。[接口/覆盖范围](../reports/module-interfaces.md#stage111)。

```js
import { createLauncherCurrentRecordCodec } from './shared/index.mjs';
const codec = createLauncherCurrentRecordCodec(keyBytes);
try { const recordBytes = codec.encode(plainBytes); } finally { codec.close(); }
```

源/汇编与4区间、1042 Pi字对应；PyCryptodome3.23.0独立13 ECB记录+最大摘要、3接收/3原创交换和65分片通过。最终实际执行：

```sh
node --test --test-reporter=tap shared/tests/launcher-current-record.test.mjs web/tests/launcher-current-record.test.mjs shared/tests/launcher-channel.test.mjs shared/tests/launcher-flow.test.mjs shared/tests/launcher-current-channel.test.mjs web/tests/launcher-session.test.mjs web/tests/launcher-current-session.test.mjs
```

7文件78项通过。复现原创夹具用 `python3 analysis/launcher-current-record-v1/build_vectors.py`；需要当前已安装的PyCryptodome3.23.0。本轮没有新增外部网络/账号或浏览器/设备验收，用户暂无测试账号；真实加密/游戏/官方可玩未证。[源规格](../analysis/launcher-current-record-v1/implementation-spec.json)、[测试](../analysis/launcher-current-record-v1/test-results.json)。

<a id="launcher-stage110"></a>
## stage110：显式采用现行固定组握手

新增LAUNCHER_CURRENT_CHANNEL_PROFILE、decodeLauncherCurrentHandshakeChallenge(challengeBytes)、answerLauncherCurrentHandshake(challengeBytes,exponentBytes20)。字段各1..256B、总缓冲784B，g必须字面2、p必须源中256B字符串、1<peer<p含p-1；原generic API的数学范围保留。[源与工程政策](../analysis/launcher-current-channel-v1/implementation-spec.json)。

```js
import { createLauncherLoginFlow } from './shared/index.mjs';
const flow = createLauncherLoginFlow({ ...explicitFlowInputs, handshakeProfile: 'current' });
```

省略选项为generic，未知值拒绝；快照新增非敏感handshakeProfile。current在挑战就绪/取熵/公钥回答和加密账号写出前校验组；明文请求仍在本地flow构造时准备，失败时清理。authentication仍unverified，此选项不认证对端，也不证明现行完整record等价。

复现原创向量：`python3 analysis/launcher-current-channel-v1/build_vectors.py`。最终已执行的相关命令：

```sh
node --test --test-reporter=tap shared/tests/launcher-current-channel.test.mjs shared/tests/launcher-channel.test.mjs shared/tests/launcher-flow.test.mjs web/tests/launcher-session.test.mjs web/tests/launcher-current-session.test.mjs analysis/launcher-current-channel-v1/preauth-probe.test.mjs
```

3有效/8无效Python向量、530分片及上述78项全通过。6个本机TCP资格检查先通过后，独立Node仅8B hello得到实际529B源组匹配并close，未回答/认证；一次计划已用，不重放观察CLI。浏览器/设备/账号/游戏/官方可玩未验收。[测试](../analysis/launcher-current-channel-v1/test-results.json)、[实际前置回执](../analysis/launcher-current-channel-v1/network-observation.json)。

<a id="launcher-stage109"></a>
## stage109：按现行原生低16位投影状态

profile/选择/handoff公开接口不变；stateWord保留raw UInt32，state是signed低16，仅允许该16位值0/-4，并继续执行billing!=0且expired!=0限制。去除此前额外canonical32扩展要求，PROFILE_STATE_ENCODING不再从这些路径发出。其余UInt32/字节/ownership/lease界限保留，authentication/gameAcceptance仍unverified。新版type10/type11字节和丢W0适配有同hashREA对应，不能由伪签名省略尾word。[源规格](../analysis/launcher-current-login-v1/implementation-spec.json)。

48原创Python struct报文及6文件78Node通过；复现 `python3 analysis/launcher-current-login-v1/build_state_vectors.py`，再运行 `node --test shared/tests/launcher-current-login.test.mjs shared/tests/launcher-login.test.mjs shared/tests/launcher-handoff.test.mjs shared/tests/launcher-launch.test.mjs web/tests/launcher-session.test.mjs web/tests/launcher-launch.test.mjs`。固定PE32源/5锚点核验命令为 `python3 analysis/launcher-current-login-v1/verify_source.py --sample build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe`。只做读取、不执行目标；没有浏览器/设备或真实账号/游戏验收。[本轮结果](../analysis/launcher-current-login-v1/test-results.json)。

<a id="launcher-stage95"></a>
## 只读解析更新事务日志头（stage95）

```js
import { parseWin32LauncherUpdateJournalHeader } from './shared/index.mjs';
const recorded = parseWin32LauncherUpdateJournalHeader(headerBytes);
```

调用者提供精确16B Uint8Array（可为子视图）或ArrayBuffer；shared/detached/代理/非字节与非16B输入拒绝。四个uint32le为POLU标记、version1、stage1..5和stage XOR0xf016ea0b，结果冻结且只含标量。recordedStage/recordedPhase是历史标记；authentication未验证、fileState未检查、ACK未证明、recovery未执行。函数没有读取文件、网络或恢复副作用。[完整接口](../reports/module-interfaces.md#launcher-stage95)。

27份独立Python向量、10定点和完整615Node/45文件通过。原生只读前16B可接受尾随，而该函数解析精确header，差异两例保留；空/缺失/读取失败不自动作为stage0。复现：项目根运行 `python3 analysis/launcher-update-recovery-v1/make_vectors.py`，再运行 `node --test shared/tests/launcher-update-journal.test.mjs` 或完整 `node --test shared/tests/*.test.mjs web/tests/*.test.mjs`。Chrome实际ESM也通过。[验收](../analysis/launcher-update-recovery-v1/validation.json)。

<a id="launcher-stage94"></a>
## stage94：核心未改，新增浏览器配置刷新组合

shared本轮没有产品修改。现有纯Win32候选校验已与新1666048B公开payload的Python解码逐字节相同；不将大小/CRC/MD5当来源认证。[真实包对照](../analysis/launcher-current-runtime-v4/new-candidate-core.json)。

web新增显式refresh工厂，组合既有shared字节/目录检查与浏览器IndexedDB事务，不把平台存储塞入纯核心。完整605Node及Chrome ESM/IndexedDB通过，游戏/原生恢复/目标设备和官方验收仍未完成。[接口与使用](../web/README.md#launcher-stage94)。

<a id="launcher-stage92"></a>
## 新版元数据纯 API（stage92）

    import { computeLauncherFileMd5, createWin32LauncherMetadataPlan } from './shared/index.mjs';
    const launcherBytes = new TextEncoder().encode('Original local identity');
    const launcherDigestResponseBytes = new TextEncoder().encode(computeLauncherFileMd5(launcherBytes));
    const plan = createWin32LauncherMetadataPlan({ launcherBytes, launcherDigestResponseBytes });
    // plan.disposition === 'catalog-pair-needed'; no I/O or authentication occurs.

同时导出parseWin32LauncherDigestResponse、parseWin32LauncherUpdateLocatorResponse及WIN32_LAUNCHER_MANIFEST_LIMITS。新版摘要保留comparisonText大小写，SP/CR/LF集合修边；locator返回archiveBytes/archiveBytesText，原生范围1..256MiB。纯计划只接own data字段，闲置locator不读取；输入采用有界、附着且非shared的字节快照。URL只通过原生前缀子集，不承诺可下载；已有旧解析API行为保持。[完整接口及错误](../reports/module-interfaces.md#launcher-stage92)。

运行node --test shared/tests/*.test.mjs web/tests/*.test.mjs。本阶段63份原创Python向量、25新增定点与完整583Node及Chrome实际ESM/HTTP均已执行通过；没有原版程序、原生文件替换、真实认证或游戏验收。[记录](../analysis/launcher-current-metadata-v1/validation.json)。

<a id="launcher-stage91"></a>
## 新版配置容器检查与字节比较（stage91）

```js
import { inspectWin32LauncherCatalogContainers, compareWin32LauncherCatalogPair } from './shared/index.mjs';
inspectWin32LauncherCatalogContainers('<Gamelist><Games/></Gamelist>', '<Regionlist><Regions/></Regionlist>');
// containersPresent:true，validation:'containers-only'；不证明完整游戏/区域字段。
compareWin32LauncherCatalogPair({
  currentGameListBytes: Uint8Array.of(1), currentRegionListBytes: null,
  gameListBytes: Uint8Array.of(1), regionListBytes: Uint8Array.of(2),
});
// gameList:'identical', regionList:'unavailable', requiresReplacement:true；无文件操作。
```

文本需明确预先解码；容器检查复用既有XML子集，精确根和直接容器存在即可，空容器与未知业务字段可通过。现有完整字段解析保持严格；内部PI、DTD、多个根等不支持。字节比较仅四个own data字段，每份1MiB；current null表示不可用字节，不表示已知缺文件，SharedArrayBuffer/detached/accessor等拒绝。无DOM、Node、文件、网络或wx依赖，默认页面/bootstrap未接新导出。

从根目录运行`node --test shared/tests/launcher-catalog.test.mjs`（10项）或`node --test shared/tests/*.test.mjs web/tests/*.test.mjs`（本轮558项）。原创Python24XML/29比较向量及Chrome实际ESM检查通过，1内部PI差异明确profile排除；不宣称原生文件事务、手机/微信真机或完整登录器/游戏完成。[接口](../reports/module-interfaces.md#launcher-stage91)、[验收](../analysis/launcher-current-catalog-v1/validation.json)。

<a id="launcher-stage88"></a>
## stage88：新版单EXE更新候选校验

新增纯函数 `decodeWin32LauncherUpdatePackage(archiveBytes, { expectedMd5, expectedArchiveBytes })`，从index导出。调用者须明确给真实包长及32位hex摘要；新profile要求恰1普通EXE、无路径的可打印ASCII名称、解压预算及MZ/PE32/i386/GUI头。保留原首条目解码函数，沿用32MiB包/输出上限；原生更大/非ASCII与完整PE/签名未覆盖。[完整接口](../reports/module-interfaces.md#launcher-stage88)、[先建规格](../analysis/launcher-current-updater-v1/implementation-spec.json)。

输出拥有的payloadBytes及executable元数据，`profile=win32-gui-single-exe-v1`、`validation=header-profile-only`；CRC/MD5不认证来源，未替换文件/执行进程或模拟ACK。28份独立Python原创向量、4项新边界及真实新包对照通过；完整Node本轮548项。此新导出没有接页面默认启动路径，浏览器/移动/小程序真机未重验。

从项目根运行 `node --test shared/tests/*.test.mjs web/tests/*.test.mjs`；仅看本分支可运行 `node --test shared/tests/launcher-update-current.test.mjs shared/tests/launcher-update.test.mjs`（本轮49项）。重建向量脚本 `analysis/launcher-current-updater-v1/make_vectors.py`拒绝覆盖已有输出，未提供官方二进制/图片/账号会话。[验收](../analysis/launcher-current-updater-v1/validation.json)。


`index.mjs` 是纯 JavaScript ESM：不引用 DOM、Node、fs、Buffer、wx 或网络接口。登录器使用随源码提供的固定Blowfish及Pako字节算法依赖与Windows-936映射数据，保留各自许可，无运行时下载或安装步骤。网页、移动网页和小程序适配器负责各平台的文件选择、有界读取和渲染；资源API处理调用者提供的 `Uint8Array` / `ArrayBuffer`；启动配置API处理已解码文本和显式目录快照，不读取文件、注册表或系统状态。

这不是可游玩客户端或完整官方图像解码器。当前切片依据本地安装包静态观察，读取 RD v0/v2 的原始索引像素字节；不解释 RGB/BGR、透明索引、行方向、坐标原点或绘制偏移。RD v1/v3 压缩布局尚未证实，明确拒绝。

<a id="launcher-v30"></a>
## stage75：首次Config纯计划与刷新分支

新增`launcher-first-config.mjs`和index导出。`createLauncherFirstConfigPlan`接明确username/codeText/directory/configurer原bytes及Profile读取的uint32快照，返回独立拥有的查询section/key和可选命令/cwd；section为当前用户名bytes的MD5，key为`Game{原Code}_Config`，默认读取1。零或空ConfigEXE跳过；其余原命令为目录+反斜杠+原ConfigEXE+NUL，无quote/Argsline。账号派生查询身份不是匿名标识或认证，不进入页面/资源缓存。[源事实](../reports/launcher-static.md#launcher-v30)。

`interpretLauncherFirstConfigOutcome`只解释显式created/waitReturned观察：创建失败继续且不写；已创建但wait未返回则等待；wait返回后发出写0意图并继续。原观察分支未检查wait码/进程退出码/写回结果；不会把配置程序创建当配置有效。username限0..16B，其余字段4096B，原Code为1..10位数字/数值0..14，NUL/共享/假byte对象拒绝；这些是明确实施范围。所有I/O/执行未做，owned临时copies清理不保证整个JS堆。[完整契约](../analysis/launcher-v30/implementation-spec.json)。

`parseGameCatalog`新增`configurerText`保留解码后ConfigEXE正文，原`files.configuration`规范路径契约不变。现有process producer的onlyRefreshWord规则不改，web适配与控件已接该字段。516Node（新15）、Python24生产/9结果、固定XML24条件及Chrome同向量通过；实际Config设置消费者与游戏仍未验。[验收](../analysis/launcher-v30/validation.json)。

<a id="launcher-v29"></a>
## stage74：拥有资源字节的独立缓存格式

新增纯`launcher-resources.mjs`及index导出：`snapshotLauncherResourceBinding`只复制配置摘要/三个原ordinal/原Code正文/规范目录/明确路径编码及可选Galaxy序号；`launcherResourceBindingKey`固定这些字段的顺序。`createLauncherResourceSnapshot({binding,files})`生成独立拥有的相对路径/bytes/MD5，`readLauncherResourceSnapshot`严格复核格式/规范绑定/路径树/每文件摘要，并返回新copies。它们无IDB/DOM/Node/fs依赖，不含账号、确认或认证状态。[接口](../reports/module-interfaces.md#launcher-v29)。

格式`moli.launcher.resources.v1`是独立政策，文件预算继承1024个、单32MiB、总64MiB；空文件/空快照支持。真实attached Uint8Array/ArrayBuffer，拒绝共享内存和无效byte对象，getter不作字段值执行。存储格式须有准确key集合，非规范路径、显式undefined Galaxy、未知trust/schema或MD5不符拒绝；摘要只作损坏检查。没有磁盘/原生恢复或整安装规模支持。[完整契约](../analysis/launcher-v29/implementation-spec.json)。

Node501（新10）、两份Python独立MD5/绑定key向量和真实浏览器存储/恢复流程通过。`web/launcher-patch-state`仅在明确选择后提供own snapshot，缓存恢复进入审阅状态，仍需选择；外部copy和JS堆不承诺清除。[验收](../analysis/launcher-v29/validation.json)、[运行](../web/README.md#launcher-v29)。

<a id="launcher-v28"></a>
## stage73：纯核心与页面候选所有权边界

本轮`shared/`产品代码保持原字节契约。页面通过已验`prepareLauncherGamePatch`驱动顺序候选；新`web/launcher-patch-files.mjs`负责明确选取的Blob/File内容与预算，`launcher-patch-state.mjs`私有持有候选，审阅只暴露文件名/字节计数。明确选择后只把路径列表交给现有资源参数适配，候选bytes不进入DOM/Storage或账号交换。[接口](../reports/module-interfaces.md#launcher-v28)、[完整政策](../analysis/launcher-v28/implementation-spec.json)。

新UI要求无跳过项才可选择，固定10秒涵盖基文件读取与HTTP准备；取消/新代次/目录或配置变化丢旧结果。已证语法/ZIP/三操作、最终MD5和相对ASCII边界保持；页面选择不是原Patcher成功标志、来源认证或文件系统提交。Node491/491（新13）与真实浏览器流程通过；没有新增shared平台依赖。[验收](../analysis/launcher-v28/validation.json)、[运行](../web/README.md#launcher-v28)。

<a id="launcher-v27"></a>
## stage72：补丁生产端与顺序候选迭代器

新增`launcher-patch.mjs`和index导出：`createLauncherPatchPlan`接own原字节directory/patcher/codeText/address/port、alreadyPatched布尔和ASCII caseProfile，先对PatchEXE作ASCII大写与全部`.EXE→.BAK.EXE`替换，再按原顺序生成未加引号、NUL结尾的command/cwd、原/备份路径和Code目录复制源。全部是数据，原CopyFile/属性2/CreateProcess/wait/delete只有观察说明，不执行。`interpretLauncherPatchExit`表达100完成、101失败、102最多三次、其他异常；不证明文件完整性或身份。[契约](../analysis/launcher-v27/implementation-spec.json)。

`parseGameCatalog`新增解码后原始`patcherText`，保留斜杠和边缘空格；原`files.patcher`仍是经过安全校验的规范路径。配置适配器以正文生成生产字节，避免用规范路径改写原命令。PatchEXE非ASCII大小写/原ACP和Win32命令歧义仍未验；目录可用已有明确Windows936/UTF8 profile编码，不能据此推定运行ACP。

新增`createGamePatchCandidateRun({manifestBytes,files})`：创建时立即快照，`next()`只给下一所需包的冻结描述，`next(packageBytes)`解码并推进，所有操作成功后done.value才含最终files；`return()`丢待处理计算，不保证JS堆擦除。旧`applyGamePatchCandidates`驱动同一迭代器，包缺失/多余、MD5/路径/预算政策保持。这样后续操作能看见前一步状态，下载适配器无需重复实现文件操作。[接口](../reports/module-interfaces.md#launcher-v27)。

Node478（新21）、32独立生产/21退出码、旧31语法/10候选与Chrome新流程通过；原始安装配置8命令独立对照通过。本轮无原生文件/进程操作。[验收](../analysis/launcher-v27/validation.json)。

<a id="launcher-v26"></a>
## stage71：游戏补丁清单、ZIP与内存候选

新增`game-patch.mjs`，经index导出`parseGamePatchManifest(bytes)`、`applyGamePatchCandidates({manifestBytes,files,archives})`、`GamePatchError`和`GAME_PATCH_LIMITS`。清单保留原blockOrdinal/字段bytes和首次重复值，逐块报告跳过原因；候选输入为显式文件数组`{path,bytes}`与按blockOrdinal关联的ZIP数组，输出独立拥有的files、操作报告与unverified信任状态。字节输入不会变成系统路径、下载或执行权限。[完整契约](../analysis/launcher-v26/implementation-spec.json)、[接口](../reports/module-interfaces.md#launcher-v26)。

`decodeGamePatchArchive`复用已有ZIP结构/Deflate/CRC核心，按Patcher已证路径解所有中央目录条目，允许首项空目录；原`decodeLauncherUpdatePackage`仍只取首个普通条目。create/replaceto匹配当前MD5时跳过；需要更新时解到目标父目录，replaceto成功候选中移除old_name。append取ZIP中name对应的chunk拼到old_name字节尾部并改成name，其余暂存条目不进入结果；缺基文件明确跳过。

严格政策：NUL拒绝；清单256KiB/512块/512操作/每块256行/字段4096B；相对ASCII路径259B、无遍历/盘符/保留设备名/大小写别名或文件目录冲突；1024文件、单文件/包32MiB、总文件/总包各64MiB。所有操作要求小写完整MD5并验证最终目标，append这项及事务候选是新增政策；原create/replaceto下载后只记录MD5的行为不照搬。没有原生文件事务或来源认证。[格式覆盖](../reports/resource-formats.md#launcher-v26)。

运行`node shared/examples/game-patch.mjs`，只读项目内原创Python夹具，打印三种操作的候选元数据；已实际成功。Node457（新21）、Chrome31语法/10候选/8坏包通过；移动设备/Safari/微信和原Windows行为未验。[验收](../analysis/launcher-v26/validation.json)。

<a id="launcher-v25"></a>
## stage70：Galaxy模型与显式选择

`parseRegionCatalog`现解析Galaxylist/Galaxy的Name/Gamecode/正文，保留原ordinal、Gamecode原文、名称和文本，非空时增加冻结galaxies模型；空/不存在时旧模型/流程保持。独立预算15条、槽0..14、非空Name、叶正文，未知子节点/无结构正文拒绝。Galaxylist已是已知字段，不再只标unhandled。这个预算及严格错误政策不复现原atoi/越界访问。[来源](../analysis/launcher-v25/static-spec.json)。

新增`listGameGalaxies`：按当前游戏数值Code筛选并保留原序号，跨整个区域的同名行标ambiguous-name。`selectLauncherRegion`第五参数own data galaxyOrdinal：有匹配必须选、无匹配跳过且拒绝旧ordinal、重名不可选；只在选中时输出galaxyOrdinal/galaxyName/galaxyArgs。离线file plan同一options可携目录与分组选择。Gal正文仍与base/region分开，process producer依原空格顺序追加；不改变BIP、请求Code或认证。[完整契约](../analysis/launcher-v25/implementation-spec.json)、[接口](../reports/module-interfaces.md#launcher-v25)。

15新/436总Node、63Python独立XML/筛选/选择向量、26锚点/3负例通过；固定旧配置与Chrome6新/9旧流程通过。原widget排序/locale/Windows保存选择和真实服务器Galaxy未验；独立实现保留XML次序、要求明确选择，不能把新UI当原Windows全等价。[验收](../analysis/launcher-v25/validation.json)。

<a id="launcher-v24"></a>
## stage69：统一交接对象与独立字段编码

新增[`launcher-launch.mjs`](launcher-launch.mjs)，index导出`createLauncherLaunchLease`/`LauncherLaunchError`。接own processInput与原选择结果，先验process，再以同一gameCode生成映射；构造失败清已建process bytes。snapshot仅冻结元数据，takeContext一次借出process/mapping，close幂等清command/cwd/pattern/mapping。无映射分支mapping null，局部clientCreationRequested仍不代表启动就绪/授权；身份、游戏接受始终unknown，未执行。[契约](../analysis/launcher-v24/implementation-spec.json)。

`encodeLauncherProcessField`复用三种明确严格编码，空串允许、HT/LF/CR保留，4096UTF16 code units与4096编码bytes双预算；NUL/其他不支持控制/损坏标量/不可表示字符拒绝，不quote/trim/推断ACP。原credential1..16B及控制规则不变。修复原handoff.close调用借出view.fill的所有权缺陷：固定内建fill且转移/分离的view不阻止其余清理；外部复制/转移目标不保证擦除，metadata冻结不冻结bytes或整个JS堆。[复现与修复](../analysis/launcher-v24/review-corrections.json)。

`node shared/examples/launcher-launch.mjs`打印原创数据的准备/关闭元数据，不访问文件/网络/账号或执行进程。17新/421总Node、45组独立process+mapping联合向量、旧回包选择投影、Chrome9新流程/8旧流程通过。[验收](../analysis/launcher-v24/validation.json)。

<a id="launcher-v23"></a>
## stage68：原字节命令与七组资源参数

新增[`launcher-process.mjs`](launcher-process.mjs)，index导出`createLauncherResourceArguments`、`createLauncherProcessPlan`、错误类及常量。前者接`caseProfile:'ascii'`及`find-failed`/`enumerated`快照；后者接gameCode0..14、uint32 onlyRefreshWord、已解析的directory/executablePath/argsLine/regionArgs/galaxyArgs五个Bytes字段。Code0/1/2/4/11且refresh0要求七组原序ID；其他分支不读取资源字段。只用own数据属性/实际非共享U8或ArrayBuffer，复制输入，固定错误不回显。[完整契约](../analysis/launcher-v23/implementation-spec.json)、[接口](../reports/module-interfaces.md#launcher-v23)。

命令为原EXE+空格+base，非空region/Galaxy各加空格，再直接追加七组结果与NUL；cwd仅Code3加`\Bin\`、Code5加`\GBrowser\`，保留原斜线/引号/高字节，不自动quote/trim/编码。枚举保留顺序/重复/末行，directory位10h排除；标题去末扩展名、ASCII lower、最后非首位下划线改冒号，按info/graphic/anime/coordinate首匹配家族全量替换，加每条前导空格。结果标记upstream/auth/game未验证；局部clientCreationRequested不是可执行或授权判断。

独立边界：字段4096B、最终命令含NUL32767B、每组4096条、basename259B、title255B。只接受显式ASCII/C标题profile，实际CRT locale/DBCS、Win32通配符/8.3/顺序和异常均未等价；返回bytes可变、由调用者持有，metadata冻结不代表全堆擦除。无文件/进程/IPC/网络访问。`node shared/examples/launcher-process.mjs`仅打印原创数据。14新/404总Node、49锚点、Python48+4与Chrome同向量/5既有文件名通过；[验收](../analysis/launcher-v23/validation.json)。

<a id="launcher-v22"></a>
## stage67：交接写入生产端与内存lease

新增[`launcher-handoff.mjs`](launcher-handoff.mjs)，index导出`LAUNCHER_HANDOFF_LIMITS`、`LauncherHandoffError`、`encodeLauncherHandoffWrite`和`createLauncherHandoffLease`。只接own数据的gameCode0..14、选择结果原name1..41B/opaque0..32B/unsigned32 tailWordA；重新核原state0/-4与billing/expired gate，不相信传入passes。真实非共享U8/ArrayBuffer复制，拒绝getter/继承/伪装/越界，固定错误不回显。纯核心无平台I/O。

格式是原标签与raw bytes、opaque首NUL截断、uint32(tailA-80000000h)小写base32、尾空格/NUL；只输出≤92B前缀和256B容量，不构造清零后的完整映射。已证名字分支0/1/2/4/11=CG，3=KOH、5=ZZ、6=FE、7=CGC、9=CG2；其余支持槽位为空写入。lease ready→takeWrite一次，close清其自有及借出view；snapshot只有元数据，外部copy/JS GC不在擦除保证内。无Windows映射、argv或认证动作。[契约](../analysis/launcher-v22/implementation-spec.json)。

REA4新函数/7记录至274，21源锚点、Python94标量/126写入向量/42旧回包投影独立对照通过。10新测试/Node总390，Chrome8交接+9编码+17配置流程/1测量通过。[静态](../analysis/launcher-v22/static-spec.json)、[原创oracle](../analysis/launcher-v22/handoff_oracle.py)、[验收](../analysis/launcher-v22/validation.json)。游戏消费者和opaque语义/有效期仍未知，字节格式不证明身份或游戏可用。

<a id="launcher-v21"></a>
## stage66：非秘密UserMode记录

新增[`launcher-preferences.mjs`](launcher-preferences.mjs)，index导出`LAUNCHER_PREFERENCE_FORMAT`、`LauncherPreferenceError`、`encodeLauncherUserModePreference(mode)`与`decodeLauncherUserModePreference(record)`。只编码primitive数字1或2，记录为固定schema/userMode两key的canonical JSON；最大128 UTF16字符，先限长再parse，拒绝未知版本、额外/重复/转义key、非规范空白、无效mode和隐式强转，错误不回显数据。纯核心没有DOM/Node/fs/Buffer/wx/Storage或网络接口。

它是独立平台记录格式，不是原INI账号文件：依据v16已证UserMode读写/默认复选框规则，不能接收账号/密码/checkbox选择/编码/条款确认，也不证明认证或持久性。浏览器薄适配另负责明确保存、回读和刷新应用；普通Storage非原子CAS，不自动把跨标签页改动套入现有会话。[接口](../reports/module-interfaces.md#launcher-v21)、[契约](../analysis/launcher-v21/implementation-spec.json)。

5个核心新测试与6个适配新测试、Node总380通过；Chrome12设置检查+9编码回归+17配置会话回归/1测量通过。原账号字段直接偏移26处和2析构CALL/4异常JMP由原文件独立核验，释放不等于安全擦除或全局无账号存储。[REA](../analysis/launcher-v21/static-spec.json)、[核验器](../analysis/launcher-v21/audit_credential_fields.py)、[验收](../analysis/launcher-v21/validation.json)。没有新数据/算法依赖；既有936/ws/Pako/Blowfish许可保持。

<a id="launcher-v20"></a>
## stage65：严格的显式文本字节适配

新增[`launcher-text.mjs`](launcher-text.mjs)，由index导出`LAUNCHER_TEXT_ENCODINGS`、`LAUNCHER_TEXT_LIMITS`、`LauncherTextError`、`encodeLauncherCredential(value,{encoding})`和`decodeLauncherProfileName(bytes,{encoding})`。encoding必须是own数据属性，明确ascii/windows-936/utf-8；核心不默认ACP。账号仅primitive string、最多64个UTF-16单元、结果1..16B；名称实际Uint8Array/ArrayBuffer1..41B，复制后严格解码/回编码，调用者bytes不变。错误只含固定code/message及有界byteLength/null，不回显输入。

纯ECMAScript实现，不依赖DOM/Node/fs/Buffer/wx/TextEncoder/TextDecoder/网络。ASCII限20..7E；936固定Microsoft/Unicode2.01表的ASCII、80=Euro及21791双映射，拒绝未分配、GB18030四字节/未支持扩展；UTF-8严格canonical1..4B，拒绝overlong/截断/代理项/越界，保留BOM标量。三者均拒绝C0/DEL/C1、孤立代理项，无trim/normalization/best-fit/替换。原名称排序继续使用bytes，codec不重新排序。

[`table.mjs`](vendor/windows-936/table.mjs)与[`LICENSE.txt`](vendor/windows-936/LICENSE.txt)是新增公开数据依赖，源表SHA256`b86f601c575e9ab457380b6f7abef03c75499cc6075bdc8b4b27f3f2de74bf6a`，生成表SHA256`cb9d3482a1264abe3cbe4876ba1d88d6161780394f0e855786299717e85ba1dd`。[依赖/来源/许可](../analysis/launcher-v20/dependency.json)、[固定源生成器](../analysis/launcher-v20/generate_cp936_table.py)。源原文在私有build；生成器检查固定hash后可`--check`重现，无运行时下载或安装脚本。

11项新测试/Node总369通过；Python gbk独立逐项比较21791映射/2149未分配，80=Euro按微软源单列；1037原创UTF-8标量及畸形序列另验。浏览器9编码检查及17配置会话回归/1测量通过。[参考](../analysis/launcher-v20/encoding-reference.json)、[验收](../analysis/launcher-v20/validation.json)。这些是可选择的跨平台profile，实际Windows ACP/IME及官方接受条件仍未知。历史回执限制见[事故记录](../analysis/launcher-v20/artifact-output-incident.json)。

<a id="launcher-v19"></a>
## stage64：已证核心串入配置与会话

本轮shared产品源仍未改变：原双XML解析/区域选择、MD5/元数据/ZIP、许可/模式和交换/候选由薄适配编排。新增web/launcher-target重新校验pair后把所选BIP与显式传输允许列表绑定，保留Code原文供许可、数值供请求，重复Code保留ordinal；新UI连接File、缓存、HTTP/bootstrap与真实流执行器。没有平台接口进入纯核心，也没有新增协议字段。

配置绑定、单10s编排、当前页计数/失效与拒绝未授权目标均为独立实现政策；事实依据继续绑定601b…样本及REA v6/v7/v10/v14证据。[证据复用](../analysis/launcher-v19/reused-native-spec.json)、[接口](../reports/module-interfaces.md#launcher-v19)、[运行](../web/README.md#launcher-v19)。Node358与Chrome17流程/1时限测量通过，只连原创回环对端；非ASCII、真实账号/服务、游戏及官方兼容未验收。

<a id="launcher-v18"></a>
## stage63：浏览器流程接入，纯核心保持

本轮没有修改任何shared产品源文件。现有许可四页/显式决定、UserMode计划、类型10、交换控制器及候选规则由新[`web/login-app.mjs`](../web/login-app.mjs)调用；浏览器原生WebSocket与Node回环TCP均在薄适配层。新增依赖ws仅位于adapters/node，不进入shared或浏览器入口；平台熵仍在v17会话执行层，纯字节核心不访问DOM/Node/fs/网络。

UI的ASCII输入子集、仅当前页文本决定/保留、从0递增请求计数、输入变化后丢弃候选属于独立交互政策，不补写为原Windows完整行为。实际ACP、Profile持久化和服务会话仍未知。[证据](../analysis/launcher-v18/static-spec.json)、[使用/边界](../web/README.md#launcher-v18)、[接口](../reports/module-interfaces.md#launcher-v18)。Node347（新12）通过，Chrome实际回环流程10项通过；小程序/官方兼容仍未验收。

## 会话执行器的分层边界（stage62）

本目录纯字节核心/算法依赖本轮未改。`web/launcher-session.mjs`执行既有`createLauncherLoginFlow`的连接/写入意图，注入字节流端口，使用平台随机数/时钟/定时器；`adapters/node/launcher-stream.mjs`提供显式白名单Node TCP验证端口。上述I/O均在shared外，不把Socket/系统状态加入核心。[运行/API](../web/README.md#launcher-v17)、[335项Node/浏览器验收](../analysis/launcher-v17/validation.json)。

实际原创Python对端独立核对hello、公值派生与加密请求原始frame；仅本机回环，来源/认证仍未验证。浏览器使用同一执行器和原创注入流，尚非真实浏览器TCP；实际文本编码/条款/账号/游戏仍需继续。

<a id="launcher-v16"></a>
## UserMode与输入清理计划（stage61）

新增两项纯API，不接受账号/密码bytes或访问系统配置。输入须为own数据属性；返回对象及嵌套retention/writeRequested均冻结，`authentication:'unverified'`、`persistence:'unconfirmed'`。`settingsSection`是调用者已解析的完整section，1..256字符、不含ASCII控制/DEL/方括号，保留Unicode与空白；不推断原prefix或实际INI映射。预算字段`LAUNCHER_LOCAL_LIMITS.settingsSectionChars=256`。

| API | 显式输入 | 返回与边界 |
|---|---|---|
| `planLauncherUserModeInitialization` | `recordedMode`（-1缺失哨兵或UInt32）、boolean `initialRememberUsername`、`settingsSection`；可选`choice` | 已存1/2直接initialized，无写入；其他值等待明确1/2，才输出UserMode整数写入意图。mode1勾选用户名、mode2保留输入勾选快照；两者密码勾选false、可见性按模式 |
| `planLauncherUserModeChange` | `currentMode`1/2、`requestedMode`1/2或cancel、`settingsSection`；2→1时可选boolean `confirmMode1` | 2→1未决定为confirmation-required，false为declined，均无效果；接受后changed，即使同模式也发clearInputs=true与整数写入意图，用户名勾选仅mode1=true，密码勾选false |

初始化`choice`缺省/null为choice-required；`'cancel'`为cancelled。切换`requestedMode:'cancel'`也无写入/清理，保留currentMode。这是独立严格政策，**不复制原modal非1都写2**的回退。未需的choice/confirmMode1不读取；被使用字段若缺失/继承/accessor或provider trap失败为INVALID_INPUT。其余错误：LOCAL_MODE_VALUE（记录值范围）、LOCAL_MODE_CHOICE（必须明确1/2）、LOCAL_FLAG（boolean）、LOCAL_SETTINGS_SECTION（section边界）。

返回`retention`为新的复选框/密码控件状态，null表示不要应用这些效果；`clearInputs`只表示先清两项输入的意图，不擦除调用者内存。应用层若需清现有bytes，应显式用`resetLauncherLoginInputs`且两remember参数均false，再采用新的复选框状态。写入意图只含`{section,key:'UserMode',value}`，不能当实际写盘、账号记忆、许可接受或认证。

```js
import { planLauncherUserModeChange } from './shared/index.mjs';
const plan = planLauncherUserModeChange({
  currentMode: 2, requestedMode: 1, confirmMode1: true,
  settingsSection: 'Original.Settings',
});
// plan.clearInputs === true; plan.writeRequested只描述非秘密整数设置。
```

固定样本REA/29操作数、独立Python54政策向量与Node300通过；Chrome54向量及旧配置缓存/资源页5项通过。[规格/差异](../reports/launcher-static.md#launcher-v16)、[向量生成器](../analysis/launcher-v16/make_mode_vectors.py)、[验收](../analysis/launcher-v16/validation.json)。当前无模式UI或实际存储适配，账号持久化/真实条款/服务会话仍待证明。

## 保留本机配置缓存页面边界（stage60）

现有纯核心与固定算法依赖本轮未改。`web/launcher-app.mjs`已调用现有raw MD5、候选pair验证与IndexedDB适配，提供显式保存/恢复/重新检查/取消；新`readLauncherCatalogBytes`仅在web层读取1MiB以内File原始字节。恢复后目录需重新输入，来源与认证仍未验证；本地revision不进入协议。[使用](../web/README.md#launcher-v15)、[验收](../analysis/launcher-v15/validation.json)。Node288（原285＋3文件读取边界）、Chrome实际页面14项、独立窄视口与GB18030原字节往返通过；不增加网络、DOM或存储副作用到shared。

## 保留登录器HTTP与候选缓存平台边界（stage58..59）

stage59新增公开`computeLauncherFileMd5(bytes)`，沿用原32MiB预算和原生字节所有权校验，只计算原始文件MD5，不解码/归一化换行，供异步编排先选分支。3项crypto/边界回归通过；现有清单计划仍用同一实现。[初始化与候选缓存](../web/README.md#launcher-v14)位于web薄适配，纯核心不加入Fetch/IndexedDB/TextDecoder或存储副作用。[当前验收](../analysis/launcher-v14/validation.json)。

GET属于薄适配层，新增在[`web/launcher-http.mjs`](../web/launcher-http.mjs)，未把Fetch/URL/网络副作用放入本目录纯核心。显式原始bytes继续交既有清单计划/ZIP校验；Node263及本地Chrome运行已串联，结果仍未认证/未替换。[使用契约](../web/README.md#launcher-v13)、[REA](../reports/launcher-static.md#launcher-v13)、[验收](../analysis/launcher-v13/validation.json)。实际官方传输、原生文件事务、其余平台UI、会话及游戏仍待继续。

## 证据与实现范围

来源为用户提供安装包 SHA256 `e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983` 的本地解包样本。分析材料见 [`analysis/resources-v2/`](../analysis/resources-v2/) 与 [`reports/resource-formats.md`](../reports/resource-formats.md)。官方字节没有加入本目录；所有自动测试夹具是自制数据。

已观察结构：

| 文件布局 | 本核心读取 | 未作出的解释 |
|---|---|---|
| 40 字节 GraphicInfo 候选记录 | +0 ID、+4 payload offset、+8 byteLength、+20 width、+24 height，全部 UInt32LE | +12…19 和 +28…39 保留为 opaque bytes；ID 可以重复，不当作 ordinal |
| RD 公共头 | magic `52 44`、byte2 version、+4 width、+8 height、+12 opaque UInt32 | byte3、word12 原样保留；word12 **不是**本解析器的长度字段 |
| RD v0 | 16 字节头 + `width × height` 个原始索引字节 | 不判断颜色、透明或图像上下方向 |
| RD v2 | 20 字节头；+16 是候选 palette 长度 p；像素后跟 p 个 opaque bytes | p 必须正数、3 整除且 ≤768；已观察 p 为516/711/759/768，三通道顺序未证实 |

长度严格等于上述公式，多余尾字节与截断均报错。宽高与选择的索引记录不符时报错。索引中间空洞、重复 ID、共享范围、零长度只是元数据观察；选中零长度记录进行 frame 读取会被最小头长度检查拒绝。

## 接口

```js
import {
  LIMITS, ResourceError,
  inspectIndex, getRecord, frameRange, decodeRD,
} from './shared/index.mjs';
```

`LIMITS`：`indexBytes` = 64 MiB、`frameBytes` = 32 MiB、`pixels` = 4 Mi 像素、`paletteBytes` = 768、`recordBytes` = 40。它是冻结对象。核心中的上限不会被调用者参数放宽。

### `inspectIndex(input, { pairedByteCount } = {})`

返回：

```js
{
  recordCount, minimumOffset, maximumEndOffset,
  contiguousAdjacentPairs, noncontiguousAdjacentPairs,
  zeroLengthRecords, overlappingAdjacentRanges,
  pairedByteCount // 未提供时为 null
}
```

只统计元数据，不解码全部图像。重叠数是“按开始偏移排序后相邻范围相交的对数”，不是全部相交区间组合数。64 MiB 索引的排序只分配 UInt32 ordinal 数组，避免每条记录常驻一个 JS 对象。通过结构检查不能证明任意40字节倍数文件就是官方索引。

### `getRecord(input, ordinal, { pairedByteCount } = {})`

输入是完整但有界的索引字节。`ordinal` 是 0 起始的记录序号，必须为有效整数，不能用可能重复的图像 ID 替代。

```js
{
  ordinal, id, byteOffset, byteLength, width, height,
  opaque: {
    indexBytes12to19: Uint8Array,
    indexBytes28to39: Uint8Array
  }
}
```

提供 `pairedByteCount` 时校验记录末尾不超过配对文件长度。不提供时，不能宣称已核对实际配对文件范围。

### `frameRange(record, { pairedByteCount } = {})`

返回 `{ start, end, byteLength }`，`end` 为排他终点，直接用于 `File.slice(start, end)`。读取前检查最小16字节头、每帧预算、正数尺寸、像素数量预算和配对文件范围。宽×高先以除法检查上限，再相乘，避免攻击性 UInt32 维度的非精确乘法。

### `decodeRD(input, { record } = {})`

返回：

```js
{
  version, width, height,
  pixels: Uint8Array, // 平坦的 width × height 原始索引字节
  opaque: {
    headerByte3,
    headerWord12,
    paletteBytes: Uint8Array // v0 为长度0；v2保留原始候选palette
  }
}
```

推荐传入 `record`，这样额外核对索引宽高和 payload 字节数。返回的像素与 opaque 字节都是独立副本。输入带非零 `byteOffset` 的 `Uint8Array`（例如 `subarray`）会正确解析，既不误读其前缀，也不把底层大 buffer 全部载入。

`ResourceError` 含稳定的 `code`、人类可读 `message` 及结构化 `details`。主要错误为 `INVALID_INPUT`、`INDEX_LENGTH`、`INDEX_BUDGET`、`ORDINAL_BOUNDS`、`PAIRED_BOUNDS`、`FRAME_TRUNCATED`、`FRAME_BUDGET`、`RD_MAGIC`、`UNSUPPORTED_VERSION`、`ZERO_DIMENSION`、`PIXEL_BUDGET`、`DIMENSION_MISMATCH`、`RECORD_LENGTH_MISMATCH`、`PALETTE_LAYOUT`、`FRAME_LENGTH`。

## 浏览器有界读取示例

以下是适配器示例，DOM File I/O **不属于核心实现**：

```js
if (indexFile.size > LIMITS.indexBytes) throw new Error('Index too large');
const indexBytes = new Uint8Array(await indexFile.slice(0, indexFile.size).arrayBuffer());
const record = getRecord(indexBytes, ordinal, { pairedByteCount: graphicFile.size });
const { start, end } = frameRange(record, { pairedByteCount: graphicFile.size });
const frameBytes = new Uint8Array(await graphicFile.slice(start, end).arrayBuffer());
const result = decodeRD(frameBytes, { record });
```

不得对数百 MB / GB 的 Graphic 调用无界 `graphicFile.arrayBuffer()`。灰度调试可以把每个原始索引值写成相同的 R/G/B 值，标签必须说明它是字节可视化，不代表已还原官方颜色、透明或方向。小程序需要独立的本地文件适配器与打包接入；纯核心无平台依赖不等于已完成小程序运行验证。

## 测试与复核

```sh
node --test shared/tests/*.test.mjs
```

原有18项资源合成测试覆盖 v0/v2、四种已观察 palette 长度、ArrayBuffer与非零offset、独立输出副本、重复ID、ordinal、配对边界、32位加法回绕、嵌套重叠范围、索引与payload尺寸/长度匹配、空/截断/超大输入、未知版本、零或巨大维度、尾随字节及错误palette布局。Node依赖仅出现在测试与显式本地样本验证适配器中。

已对 V3 的62条与 Joy 的7条、合计69条实际 v0/v2 记录进行逐字节结果摘要对照：像素 SHA256、opaque palette SHA256、宽高、版本和 opaque 头字段，全部匹配独立 Python oracle。证据：[`real-v3-comparison.json`](evidence/real-v3-comparison.json)、[`real-joy-comparison.json`](evidence/real-joy-comparison.json)、[`node-test.log`](evidence/node-test.log)。这些结果证明该两个固定样本的已支持布局读取一致，不证明其他版本、正确官图显示或游戏协议兼容。

有合法本地样本时可重跑，所有路径须显式传入：

```sh
node shared/tests/validate-local-samples.mjs \
  /path/to/oracle.json /path/to/GraphicInfo.bin /path/to/Graphic.bin
```

适配器先核对 index SHA256 和 graphic 字节长度，再按 oracle 列出的 ordinal 逐帧有界读取；输出仅元数据和摘要。本轮也重跑现有 Swift 16项测试，全部通过，见 [`swift-regression-web-transition.log`](../native/evidence/swift-regression-web-transition.log)。Swift源码未改动。

## 待验证

RD v1/v3压缩、palette颜色/透明、坐标/方向、动画、地图语义、音频、游戏规则、完整认证和游戏通信协议仍不在此实现范围。登录器的已证字节子集见下文。浏览器与微信小程序真实设备兼容性由各端适配层另行验收；本核心不联网或读取系统凭据，登录输入byte字段由调用者显式提供。

<a id="launcher-v12"></a>
## 登录器上游清单与元数据计划（stage57）

[REA与字段绑定](../reports/launcher-static.md#launcher-v12)、[Node245/浏览器与历史重建验收](../analysis/launcher-v12/validation.json)。`launcher-manifest.mjs`接显式bytes，不访问URL/文件/账户或写入更新，不把元数据相等当可登录。

| API | 输入 → 输出 |
|---|---|
| `parseLauncherDigestResponse(bytes)` | 原ASCII响应 → md5/inputBytes/trimmedBytes/normalizedBytes/truncatedBytes/truncated/trust |
| `parseLauncherCatalogDigestResponse(bytes)` | 两个前置token → gameListMd5/regionListMd5/ignoredTokenCount/trust；不截断XML token |
| `parseLauncherUpdateLocatorResponse(bytes)` | 前两个token → 原locator/progressText/数值progressDenominator/ignoredTokenCount/trust |
| `createLauncherMetadataPlan(inputs)` | launcherBytes/launcherDigestResponseBytes；根据分支再读locatorResponseBytes或catalogDigestResponseBytes/gameListBytes/regionListBytes → 冻结元数据计划 |
| `LAUNCHER_MANIFEST_LIMITS` / `LauncherManifestError` | 固定预算和稳定错误码；不允许调用参数放宽 |

主摘要依次对首尾单个匹配集空格、LF、CR修剪，再取前32字符；随后要求32hex，返回小写便于比较，保留修剪/截断计数。不是泛用trim：前置TAB不被移除，混合边界的顺序会影响结果。XML前两token分别绑定GameList/RegionList，必须各32hex，无主摘要的截断；多出的token只计数，不命名为版本或签名。

token分隔仅采用六类经典ASCII空白09/0a/0b/0c/0d/20；限定可打印ASCII/这些空白，嵌入NUL、非ASCII或其他控制明确拒绝。响应4096B、128token、locator1023B、原文件每份32MiB，均为独立预算。原locale、嵌入NUL和不完整流错误不全模拟。locator原文不作URL规范化、路径或请求；progressText原文保留，但数值必须完整十进制1..INT_MAX，拒绝符号/junk/溢出/零。这是比原atoi更严格的策略；它只是进度分母，不能称为下载长度校验。

计划先对原launcher bytes计算MD5：不等→`launcher-candidate-needed`，只解析定位文本，update含locator/progress与前一摘要的expectedMd5，catalogs=null且不读取其输入。相等才处理两XML的原bytes摘要：得到`metadata-current`或`catalog-refresh-needed`，catalogs下有gameList/regionList的localMd5/remoteMd5/requiresRefresh、按GameList后RegionList的refreshOrder和ignoredTokenCount；此分支不读取locator输入。

所有计划固定trust/authentication=unverified、execution=not-performed；metadata-current不是XML解析、文件就绪、认证或可游玩证明。只有外部完整读取器提供的原bytes被hash，不先解码/改换行。结果及嵌套记录/序列冻结，无保留的可变输入；未读分支的getter不访问。

错误为`INVALID_INPUT/MANIFEST_BUDGET/MANIFEST_NUL/MANIFEST_CHARACTER/MANIFEST_DIGEST/MANIFEST_TOKENS/MANIFEST_LOCATOR/MANIFEST_PROGRESS`。错误不打印正文或locator；示例只用原创常量、输出状态/顺序，实际locator可能带未分类信息，不应加入日志。

```sh
python3 analysis/launcher-v12/build_manifest_vectors.py
node shared/examples/launcher-metadata.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

15个独立Python主摘要投影/4目录计划、新13/总245测试、Chrome最终6项/46回环GET通过。历史66B XML摘要正文由保留公开值重建并匹配原SHA256；主摘要仍为合成本地值，绝非新的服务状态。首次本地模块连接重置未计通过，失败/诊断单列保留；同源新上下文复核通过，产品代码未因该故障改动。未验实际下载/存储、任意locale、手机/小程序/Safari或官方兼容。

<a id="launcher-v11"></a>
## 登录器更新包字节处理（stage56）

[REA规格/政策差异](../reports/launcher-static.md#launcher-v11)、[Node232与浏览器/真实包验收](../analysis/launcher-v11/validation.json)。`launcher-update.mjs`是离线候选解码，不发请求、不替换/启动文件、不判断来源可信或官方兼容。

| API | 输入 → 输出 |
|---|---|
| `inspectLauncherUpdateArchive(bytes)` | Uint8Array/ArrayBuffer → 冻结metadata：entries/firstEntryOrdinal=0/prefixBytes/centralDirectoryOffset/centralDirectoryBytes/endRecordOffset/commentBytes/trust |
| `decodeLauncherUpdatePackage(bytes,{expectedMd5})` | 有界ZIP及显式32个ASCII hex（不trim，大小写均可）→ archive/entry/payloadBytes/actualMd5/digestMatches/crcVerified/trust/replacement/authentication |
| `LAUNCHER_UPDATE_LIMITS` / `LauncherUpdateError` | 冻结预算和稳定错误码；不允许参数放宽预算 |

条目字段为ordinal/method/flags/crc32/compressedBytes/uncompressedBytes/localHeaderOffset/dataOffset/descriptorBytes/nameBytes/directory。顺序以中央目录为准，首条不一定是磁盘local顺序第一条。名字保持独立opaque bytes，**不作为文件输出路径**。inspect只核对metadata；decode仅解出首中央条目并核对它的CRC和MD5，其余payload未解码/校验。

范围：经典单盘ZIP，method0/8、受限flag（descriptor、UTF8及Deflate选项），版本needed≤20；支持前缀、归档comment、bounded extra TLV和12/16B descriptor。CRC本身也可等于0x08074b50，故按central CRC/size分别匹配两种descriptor、要求唯一，不能只看首word。局部/目录header、name、size/CRC关系、目录长度、local范围/重叠均检查；不接受ZIP64、加密、多盘、未知方法/flags、歧义EOCD/尾随/未解释间隙或特殊文件/首目录。这些约束是独立政策，不宣称原库的所有ZIP变体都支持。

固定32MiB输入与所有条目声明输出总量、64条目、1024B名字、4096B entry extra/comment；归档comment遵守16bit长度。先核对预算/布局，再分配首条输出。Pako3.0.2仅用于raw Inflate，固定16KiB回调，复制前检查实际输出预算；要求完整流、无未消费压缩bytes、精确输出长度，再算CRC与MD5。错误不返回部分候选。返回payload/name bytes可由调用者修改，与输入独立；修改后先前摘要结果不随之重算。

结果始终`trust:'unverified', replacement:'not-performed', authentication:'unverified'`。显式expectedMd5只是兼容比较值，不形成认证来源或更新信任；外部文件事务/回滚/重启仍需独立适配和验收。`md5.mjs`是内部复用实现，不扩张公开用户名长度边界或提供安全信任接口。

错误包括`INVALID_INPUT/UPDATE_DIGEST_INPUT/UPDATE_DIGEST_MISMATCH`，`ZIP_INPUT_LENGTH/ZIP_EOCD/ZIP_UNSUPPORTED/ZIP_ENTRY_BUDGET/ZIP_DIRECTORY/ZIP_TRUNCATED/ZIP_METADATA_BUDGET/ZIP_OUTPUT_BUDGET/ZIP_LOCAL_MISMATCH/ZIP_DESCRIPTOR/ZIP_LAYOUT/ZIP_ENTRY_TYPE/ZIP_OUTPUT_LENGTH/ZIP_DEFLATE/ZIP_CRC_MISMATCH`。不在错误中打印输入正文、包内容或存储路径。

```sh
python3 analysis/launcher-v11/build_update_vectors.py
node shared/examples/launcher-update.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

15组原创Python/zlib/zipfile向量和17项新测试（总232）通过。现有真实ZIP在Node/Chrome解出同一599,040B内容；原EXE只作字节比较，未执行。Chrome6项/44回环GET，旧许可摘要23向量同浏览器回归通过。固定[Pako3.0.2 provenance](vendor/pako/3.0.2/provenance.json)记录registry SHA512与未改发布文件，MIT/Zlib许可完整保留；没有npm安装/脚本/运行时下载或传递依赖。实际下载/来源信任、文件事务、Safari/手机/小程序及官服未验。

<a id="launcher-v10"></a>
## 登录器本地许可与输入重置（stage55）

[REA链/独立政策](../reports/launcher-static.md#launcher-v10)、[215项Node与Chrome验收](../analysis/launcher-v10/validation.json)。`launcher-local.mjs`不读取或写入配置，不执行真实条款接受、账号访问或登录。条款正文不随源码提供；页面载入/显示和用户决定、存储回执仍需薄适配层。

| API | 显式输入 → 输出 |
|---|---|
| `createLauncherLicenseIdentity({gameCodeText,usernameBytes})` | 原Code文本1..8位十进制且数值1..15、用户名1..16B非NUL → 冻结section/key/version/resourceIds/authentication |
| `createLauncherLicenseReview({...identityInputs,recordedVersion,forcePrompt,pageAvailability})` | UInt32版本、boolean force、四个own boolean availability → 带snapshot/advance/decide/cancel的独立审阅模型 |
| `resetLauncherLoginInputs({usernameBytes,passwordBytes,rememberUsername,rememberPassword})` | 各0..16B非NUL、两boolean快照 → 保留或清空后的独立bytes，persisted=false/authentication=unverified |

许可section精确保留`Game${gameCodeText}_License`（含Code前导0），key是当前用户名原bytes的MD5小写32hex，版本5；大小写/空格/高位bytes均不转换。只实现这个最多单MD5 block的兼容键用途，不提供通用密码处理或可信更新摘要。资源槽1..15来自许可表，与消息Gamecode0..14上界分别维护；未配置槽的四ID均0。

Review初态为：force=false且版本5→recorded；否则无配置→not-configured；否则任一页不可用→unavailable；其余reviewing/页0。pageAvailability不是资源ID存在性的推测，调用者必须提供实际页面载入快照；四页全可用是本实现比原程序更严格的政策。

`snapshot()`仅给state/pageOrdinal/resourceId/canConfirm/authentication/persistence，不带用户名或存储键。`advance()`推进0→1→2→3；到页3仍须单独`decide(true)`才进入accepted并返回`writeRequested:{section,key,value:5}`，不写存储、不触发连接。用户明确拒绝可在任意页`decide(false)`，`cancel()`也不产生写入；终态cancel幂等忽略，其他终态advance/decide拒绝。每步为冻结`{snapshot,writeRequested,ignored}`；persistence始终unconfirmed。recorded是调用者传入的旧快照，不证明当前条款适用性或已合法接受。

两个输入复选框仅对应原`412b10`返回登录页的字段清空；reset不模拟磁盘账号记忆或UserMode对话框。返回bytes可由调用者修改且不影响输入。原生长度在复制前校验，随后从TypedArray内部槽复制，忽略子类buffer/offset/length/iterator伪装；availability固定读四个own索引，拒绝空洞/继承值。其他无效输入不静默修正。

错误复用`LauncherMessageError`：`LOCAL_INPUT_LENGTH/LOCAL_GAME_CODE/LOCAL_FLAG/LOCAL_VERSION/LICENSE_AVAILABILITY/LICENSE_STATE/LICENSE_PAGE/LICENSE_PAGES_REMAIN`，以及`INVALID_INPUT/LOGIN_NUL`。输入字符串不隐式编码，平台代码页仍未实现。实际identity/writeRequested含关联摘要，不能把真实用户材料打印到日志；示例只用公开原创常量。

```sh
python3 analysis/launcher-v10/build_local_vectors.py
python3 analysis/launcher-v10/verify_md5_schedule.py build/analysis/launcher-v10/rea-evidence.json
node shared/examples/launcher-local.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

第二条需要本地私有REA bundle；示例用四份占位页模拟纯模型，打印页ID、状态/长度和意图值，不接受实际条款。新增15项测试/总215通过，Python23向量及4080个Node crypto对照，Chrome6项/38回环GET。没有新增平台运行依赖，未重跑Safari/手机/小程序或旧Python/Swift资源套件。

<a id="launcher-v9"></a>
## 登录器v9：离线交换控制器

[REA规格/独立政策](../reports/launcher-static.md#launcher-v9)、[200项Node与浏览器验收](../analysis/launcher-v9/validation.json)。`createLauncherLoginFlow`将已有bytes模块接成一次可取消、可处理分段/错误的交换。它只返回连接/关闭/写入意图；调用者负责后续适配，当前没有socket、随机数、系统时钟、平台定时器或账号存储。

```js
import { LAUNCHER_FLOW_LIMITS, createLauncherLoginFlow } from './shared/index.mjs';
// 显式配置：endpointCount, firstEndpointOrdinal,
// requestCounter, gameCode, usernameBytes, passwordBytes。
// const flow = createLauncherLoginFlow(config);
// const intent = flow.start(monotonicMilliseconds);
// 后续适配必须按当前attemptId传递事件；本模块不执行intent。
```

配置复用v8输入字节校验，端点数量1..10、起点必须在范围内；不保存主机/路径，也不代替本地许可、更新和文本编码前提。`LAUNCHER_FLOW_LIMITS`冻结：endpoints10、timeoutMs10000、chunkBytes65536、noticeReplies64。一次实例只提交一次应用请求，取消/完成后新用户尝试须新建实例。

| 方法 | 输入/作用 |
|---|---|
| `start(nowMs)` | 启动一次总deadline并请求首端点连接；重复调用不重置 |
| `opened(attemptId,nowMs)` | 当前connecting转awaiting-challenge，输出8B hello |
| `openFailed(attemptId,nowMs)` | 仅connecting阶段按圆环有限一轮，先关旧代次再请求下一端点；deadline不重置 |
| `receive(bytes,attemptId,nowMs)` | 增量挑战或加密记录/内层回包；完整挑战转challenge-ready；type11产生profiles/no-profiles/rejected并发关闭意图 |
| `answerChallenge(exponentBytes,attemptId,nowMs)` | 当前challenge-ready显式接受20B指数，依次输出公值消息、加密类型10请求；不返回派生key或明文请求 |
| `remoteClosed(attemptId,nowMs)` | 未完成时处理断流，先校验残片；无最终回复也结束，不自动重发 |
| `tick(nowMs)` | 检查活动阶段总deadline，不Sleep/开定时器；完成后的tick无效应 |
| `getChoices()` | 仅profiles时返回独立候选副本，否则null |
| `selectProfile(displayOrdinal)` | 执行v8已证行检查，返回`{snapshot,selection}`，转selected并释放内部候选；无游戏执行 |
| `cancel()` | idle/活动/profiles时尽力清理，活动连接发关闭意图；已结束时幂等忽略 |
| `snapshot()` | 仅状态/代次/序号/deadline/计数/resultWord/errorCode及未验证标志，不含输入、key、挑战或opaque bytes |

除构造/选择方法外，动作返回冻结`{snapshot,connectRequested,closeRequested,writes,notices,ignored,error}`。连接意图为`{attemptId,endpointOrdinal}`，关闭为`{attemptId}`，writes按发送顺序给`{attemptId,bytes}`，typed arrays由调用者拥有。适配层须先处理旧代次close，再处理新connect；实际操作结果需各自回报，意图不是外部成功回执。notices仅为已解析type2位置字段；type11候选须显式getChoices读取。error是无输入回显的`{code,message}`或null；rejected的服务结果在snapshot.resultWord，与本地error不同。

状态为idle→connecting→awaiting-challenge→challenge-ready→awaiting-reply，随后profiles/no-profiles/rejected；profiles可显式选择到selected。failed/timed-out/cancelled为本地结束。所有状态的authentication始终unverified；没有认证成功或ready状态。

**独立控制政策：** 活动事件要求安全整数、非负、非递减毫秒值，start后总预算10000ms；到达边界先超时，轮换不重新计时。opened后的错误不轮换/重发；非当前代次在读取bytes/clock前忽略。挑战必须是有界精确记录，不能夹带应答前密文；type2全流程≤64，type11后同批不得还有消息或半帧/记录。结果返回后网络事件忽略，避免晚到事件改写结果。它不是Windows WM_TIMER/EH全部调度的等价实现。

构造参数错误抛稳定异常；活动状态/包/时钟错误返回failed step及对应关闭意图，清内部请求/流/候选，底层`LauncherMessageError` code保留，未知内部错误转通用`FLOW_INTERNAL`。选择无效/受限行仍抛v8异常，保留profiles供改选。候选副本变更不会影响内部选择。清理是尽力释放/清数组，不保证JS所有内存副本擦除，返回给调用者的数据由其管理。

新增本地错误码：`FLOW_ENDPOINTS/FLOW_INTERNAL/FLOW_CLOCK/FLOW_TIMEOUT/FLOW_ATTEMPT/FLOW_STATE/FLOW_ENDPOINTS_EXHAUSTED/FLOW_CHUNK_BUDGET/FLOW_HANDSHAKE_TRAILING/FLOW_REPLY_ORDER/FLOW_NOTICE_BUDGET/FLOW_REMOTE_CLOSED`，以及既有输入/握手/记录/回包/候选错误。attemptId只用于本地路由，不是协议字段或请求计数器。

```sh
node shared/examples/launcher-flow.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
python3 analysis/launcher-v9/build_flow_vectors.py
```

示例仅用公开原创常量，演示首开启失败后换端点、完整交换与显式选择，打印状态/长度/计数/序号。200项Node、3组独立PyCryptodome全流程字节/结果、15处静态指令和Chrome6项通过；真实socket/平台CSPRNG/时钟/代码页、本地许可/会话、更新/交接及官方兼容仍未验收。小程序/手机/Safari不是本次运行环境。

<a id="launcher-v8"></a>
## 登录器v8：UI输入与游戏ID候选

[REA规格](../reports/launcher-static.md#launcher-v8)、[参数ABI修正](../analysis/launcher-v8/reply-abi.json)、[179项Node及运行验收](../analysis/launcher-v8/validation.json)。新增`launcher-login.mjs`把已证用户名/密码输入边界与候选列表消费接到现有byte核心，不提供网络、账号读取、保存密码、注册或执行动作。

```js
import {
  LAUNCHER_LOGIN_LIMITS, encodeLauncherLoginRequest, encodeLauncherLoginRequestFrame,
  createLauncherProfileChoices, decodeLauncherProfileChoices, selectLauncherProfile,
} from './shared/index.mjs';
// 平台已取得显式bytes后：
// const model = createLauncherProfileChoices(decodedReply11);
// const selection = selectLauncherProfile(model.reply, displayOrdinal);
// selection.authentication始终为'unverified'。
```

`encodeLauncherLoginRequest({requestCounter,gameCode,usernameBytes,passwordBytes})`返回类型10正文，`encodeLauncherLoginRequestFrame`加原BE16封装。counter为显式UInt32，不自动递增；gameCode为数值0..14支持槽。用户名/密码各1..16B、无NUL，只接受ArrayBuffer/Uint8Array，不接收字符串，不改变大小写/空白或加hash。高位bytes保留而不证明编码有效；Windows A版API的实际活动代码页仍未知。`LAUNCHER_LOGIN_LIMITS`冻结。原18B低层codec保持不变；新UI子集最大正文43B/封装45B。

`createLauncherProfileChoices(decodedReply11)`可直接消费reply stream输出，重新验证/复制UInt32、byte/list预算，返回冻结的`{disposition,resultWord,resultSigned,rows,remainingPointsWord,remainingPointsSigned,reply,authentication}`。只接受type11；有符号视图从实际word推导，不信任调用者提供的signedWordB。`decodeLauncherProfileChoices(bodyBytes)`为原明文body解码后的便利入口，不接收外层加密记录或内层长度头。

disposition为`nonzero-result`、`no-profiles`或`profiles`。只有wordB为0且byteList非空才投影rows；其他两类没有可选行，remainingPoints为null。每行含`sourceOrdinal,displayOrdinal,nameBytes,stateWord,state,billingWord,expiryWord,expiredWord,selectionGate`。W1..W4依次对应上述四word，W0不参与行投影，完整reply与额外列值保留原输入顺序。nameBytes仍为不透明bytes，expiryWord不作日期/时区推断；tailWordB的signed视图只来自原点数显示格式，非真实余额证明。

名称按原`strcmp`的无NUL无符号byte顺序做逐对交换，同步交换全部关联列及来源序号。算法不是稳定排序：两个同名Echo后有Alpha时，来源序号变为2/1/0；不使用localeCompare、Unicode排序或大小写折叠。显示序号与来源序号分开，不能按名称去重或把它当跨回复的持久身份。

原选择条件为signed低16状态必须0/-4，同时不得`billingWord!=0 && expiredWord!=0`；`selectionGate:{passes,blockedReason}`按此计算，blockedReason为`state`、`billing-expired`或null。**独立严格政策：** W1..W4必须覆盖名称数量；stateWord为原UInt32并按原signed低16判断（stage109已取消额外规范扩展要求）；名称1..41B且无NUL。原UI会丢count、截低16位和按C字符串截断，本工程仍拒绝短列/空或NUL标签，状态按原生截位规则；不推断多余值或原校验完整性。

`selectLauncherProfile(decodedReply11,displayOrdinal)`再次投影并验证序号/行检查，返回冻结`{profile,opaqueByteField,tailWordA,tailWordB,authentication:'unverified'}`，不产生argv/IPC、自动前进或游戏就绪。容器冻结，typed arrays是调用者拥有的独立普通副本；rows与reply的名称数组也相互独立。新reply到来时应用须重新展示/选取，不复用旧选择假定身份。

新增错误码：`LOGIN_USERNAME_LENGTH/LOGIN_PASSWORD_LENGTH/LOGIN_NUL/LOGIN_GAME_CODE`；`PROFILE_REPLY_TYPE/PROFILE_BUDGET/PROFILE_LAYOUT/PROFILE_COLUMNS/PROFILE_NAME/PROFILE_RESULT/PROFILE_ORDINAL/PROFILE_RESTRICTED`。沿用`LauncherMessageError`及`INVALID_INPUT/INVALID_WORD`，不回显输入或opaque材料。

```sh
node shared/examples/launcher-login.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
python3 analysis/launcher-v8/build_login_vectors.py
python3 -m unittest discover -s analysis/launcher-v8 -p 'test_*.py' -v
```

示例只读原创公开向量，输出请求长度、行数和序号，未输出请求/opaque内容。3组独立请求、6组候选（含64行/重复标签/高位bytes/受限与空结果）、179项Node、DIALOG4测试/13固定模板和Chrome6项通过。实际代码页、完整认证/会话/更新与游戏交接、Safari/手机/小程序仍未验。

<a id="launcher-v7"></a>
## 登录器v7：回包、密钥计算与未压缩记录

[REA规格与身份](../reports/launcher-static.md#launcher-v7)、[60函数台账](../analysis/launcher-v7/static-spec.json)、[161项Node及独立验收](../analysis/launcher-v7/validation.json)。本模块只做显式bytes操作，不打开连接、不读取凭据或产生认证决策；类型10、配置及资源API保留。

```js
import {
  LAUNCHER_REPLY_LIMITS, LAUNCHER_CHANNEL_LIMITS,
  encodeLauncherRequest1, decodeLauncherReply, decodeLauncherReplyFrame, createLauncherReplyStream,
  encodeLauncherHandshakeHello, decodeLauncherHandshakeChallenge, answerLauncherHandshake,
  createLauncherRecordCodec, createLauncherRecordStream,
} from './shared/index.mjs';
```

| API | 输入 → 输出 |
|---|---|
| `encodeLauncherRequest1({wordA,wordB})` | 显式UInt32 → 9B正文；不自动加内层长度 |
| `decodeLauncherReply(bytes)` | 精确明文正文 → 冻结类型2或11对象 |
| `decodeLauncherReplyFrame(bytes)` | 精确`u16BE length + body` → 同一对象 |
| `createLauncherReplyStream()` | `.push(bytes)`接收已处理明文片段 → 冻结的完整回包数组；`.finish()`验证流结束，`.close()`主动丢弃残片 |
| `encodeLauncherHandshakeHello()` | 无输入 → 独立8B副本，`u32BE(1),u32BE(8)` |
| `decodeLauncherHandshakeChallenge(bytes)` | 精确成功挑战 → 冻结`{generatorHex,modulusHex,peerPublicHex}`；不跟随网络或把peer当作可信身份 |
| `answerLauncherHandshake(challengeBytes,exponentBytes)` | 精确挑战＋20B显式指数 → 冻结`{publicMessage,keyBytes}`；公值BE32长度+大写ASCII，材料为共享hex左端8B，不返回私有指数或共享hex文本 |
| `createLauncherRecordCodec(keyBytes)` | 显式8B材料 → `.encode(plainBytes)`/`.decode(exactRecord)`；`.close()`幂等关闭，`.closed`可读 |
| `createLauncherRecordStream(keyBytes)` | `.push(encryptedChunk)` → 冻结的完整明文片段数组；`.finish()`验证结尾，`.close()`主动丢弃残片并关闭 |

输入只接受ArrayBuffer/Uint8Array；非零byteOffset和子类按实际范围处理，输出typed arrays均为独立普通数组。对象/列表容器冻结，typed array内容由调用者拥有。错误复用`LauncherMessageError`，不回显不透明字段、指数或材料。

类型2返回`{type:2,wordA,wordB}`。类型11返回`{type:11,wordA,wordB,signedWordB,byteField,byteList,wordLists,tailWordA,tailWordB}`；signedWordB仅表示同一32位位型的有符号视图，不命名错误/成功状态。byteField为Uint8Array，byteList为Uint8Array列表，wordLists为5个Uint32Array；全部保留位置语义，不转换为账号/密码/服务器或票据。

回包计数：`<FD`单字节；`FD+u32BE`；`FE+high32BE+low32BE`要求high为0；`FF`拒绝，扩展小计数接受。`LAUNCHER_REPLY_LIMITS`冻结：正文8192B、chunk65536B、byteField32B、byteList64项/每项41B、wordLists5组/每组64个UInt32。精确消费、不接受未知类型/尾随；原槽中的NUL不作为协议字节。

挑战为`result:u32BE=0`加三段`u32BE length + ASCII hex`，字段上界62/1022/1022，总2122B。独立政策严格拒绝前缀0x、符号、空白、NUL、非hex、尾随、零长度；计算要求奇数modulus>3和非平凡base/peer、指数至少2。它们不证明prime/order或服务身份。共享hex不足16位时拒绝，原函数没有可靠的短材料填充规则。所有指数/材料用例都是公开原创测试常量；以后真实平台适配须提供新鲜CSPRNG输入并另行验证，当前没有该适配。JavaScript BigInt计算及清理也不提供恒定时间/强制秘密擦除保证。

固定记录分支为Blowfish、8B材料、未压缩；`cipherBytes:u32BE | plainBytes:u32BE | encryptedBlocks`。块输入/输出是LE32词，不可直接套用标准BE字节接口。发送最多32712B，始终零补至下一8B边界；接收密文8..32760B且为8倍数、plainBytes≤cipherBytes，解密后按声明前缀返回，**不去零、不要求padding为零或恰好最小补齐**。独立策略拒绝0B密文，原接收器允许0/0而原发送器至少8B；压缩/其他模式明确不支持。

record stream输出的一个明文片段可含半帧或多帧，须再交reply stream；两层各自处理分段/粘包。单次输入最多64KiB，pending仅保留未完成的有界帧/记录。坏输入使该stream永久failed/closed、清pending，同一次push不返回部分成功；finish截断也终止。正常finish关闭；两stream另有幂等close，用于主动丢弃残片，保持既有failed状态而不新增截断错误。新连接必须创建新实例。record codec的单次API错误不自动关闭；close尽力清P/S schedule，但不承诺JS运行时没有其他内存副本。

新增稳定错误码：`REPLY_TRUNCATED/REPLY_TAG/REPLY_LENGTH/REPLY_BUDGET/REPLY_COUNT_WIDTH/REPLY_COUNT_ENCODING/REPLY_FIELD_BUDGET/REPLY_FRAME_TRUNCATED/REPLY_FRAME_LENGTH/REPLY_CHUNK_BUDGET/REPLY_STREAM_CLOSED`；`HANDSHAKE_BUDGET/HANDSHAKE_TRUNCATED/HANDSHAKE_REJECTED/HANDSHAKE_HEX_BUDGET/HANDSHAKE_HEX/HANDSHAKE_LENGTH/HANDSHAKE_EXPONENT/HANDSHAKE_GROUP/HANDSHAKE_SHORT_KEY`；`RECORD_TRUNCATED/RECORD_LENGTH/RECORD_PLAINTEXT_LENGTH/RECORD_KEY_LENGTH/RECORD_CODEC_CLOSED/RECORD_BUDGET/RECORD_CHUNK_BUDGET/RECORD_STREAM_CLOSED`；输入/word错误继续使用`INVALID_INPUT/INVALID_WORD`。

新增依赖原样存于`vendor/egoroof-blowfish/4.0.3/`，含MIT许可及npm SHA512/文件SHA256[来源记录](vendor/egoroof-blowfish/4.0.3/provenance.json)。只调用该固定版本受测试的原始块方法，未用其自动padding/string接口；无运行时下载、npm脚本或其他包依赖。核心无DOM/Node/fs/Buffer/wx/网络使用；已有Python PyCryptodome3.23.0仅供开发侧oracle。没有引入新的构建步骤。

```sh
node shared/examples/launcher-reply-pipeline.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
# 已具备Python/PyCryptodome时，重建公开原创对照向量：
python3 analysis/launcher-v7/build_vectors.py
python3 analysis/launcher-v7/build_channel_vectors.py
```

示例仅用原创公开常量在本地编码/分段/解码两条记录并得到一个类型2回包，不连接或认证。Node161/161、7组回包/3组模幂/9组记录与最大记录独立摘要、Chrome6项通过；Safari、手机/微信小程序、真实密钥协商/登录/更新/游戏交接和官服仍未验收。

<a id="launcher-v6"></a>
## 登录器v6：区域计划与请求类型10

规格与REA身份见[登录器调查](../reports/launcher-static.md#launcher-v6)、[静态函数台账](../analysis/launcher-v6/static-spec.json)。新增代码无DOM/Node/fs/Buffer/wx/网络依赖，原始XML与官方可执行文件不进入测试夹具。

```js
import {
  parseGameCatalog, parseRegionCatalog, listGameRegions,
  selectLauncherRegion, createOfflineRegionLaunchPlan,
  encodeLauncherRequest10Frame, decodeLauncherRequest10Frame,
} from './shared/index.mjs';
```

`parseGameCatalog`每游戏新增冻结`regions:string[]`，已处理的Regions不再列入`unhandledFields`。`parseRegionCatalog(text,{allowBareAmpersands=false})`返回冻结`{regions,declaredVersion,diagnostics}`；每记录含ordinal/code/name、billingEndpoints、patchEndpoint或null、statusAddress、args、closed/closedMessage、hasGalaxyList和unhandledFields。端点为address/port/portText；Args为ordinal/gameCode/text。未知业务字段不跟随为URL或执行动作。

`listGameRegions(games,gameOrdinal,regions)`按游戏引用顺序返回`{referenceOrdinal,name,status,regionOrdinal,matchedOrdinals}`，status为available/missing/ambiguous/closed。名称精确保留解码Unicode文字、大小写及空白，不作NFC别名；不是全部代码页的等价性声明。重复Code仍按游戏ordinal选取。`selectLauncherRegion(...,referenceOrdinal)`拒绝缺失/歧义/关闭区域、重复规范化Args槽和非空Galaxylist，返回选中区域metadata、baseArgs、regionArgs及`authentication:'unverified'`。Gamecode按0..14数值槽匹配（如11/011同槽），缺少该槽时regionArgs为空；不仿制原加载器的越界钳制。

`createOfflineRegionLaunchPlan(...,options)`在原`createOfflineLaunchPlan`结果上添加`region`，目录快照/INI政策保持不变，不检查真实文件或游戏就绪。地址只接受无URL/路径/凭据的受限文字与1..65535端口；这不验证DNS/IPv4数值或可达性。Closed元素存在即保守关闭（包括空），文字中的字面`\\n`转为换行。`REGION_LIMITS`冻结：regions40、referencesPerGame40、billingEndpoints10、argumentsPerRegion64、gameCodeMax14；XML/字段预算沿用LAUNCHER_LIMITS。

新增区域错误码：`REGION_BUDGET`、`REGION_MISSING`、`REGION_AMBIGUOUS`、`REGION_CLOSED`、`AMBIGUOUS_ARGUMENTS`、`UNSUPPORTED_GAME_CODE`、`UNSUPPORTED_GALAXY_LAYOUT`、`UNSUPPORTED_ENDPOINT`、`ENDPOINT_PORT`、`ENDPOINT_FIELDS`；仍使用LauncherError及原XML/目录错误。目录或配置错误不会生成认证或执行命令。

`launcher-message10.mjs`只处理固定样本`46d810`已证布局：`10:u8 | wordA:u32be | lenA:u8 | fieldA:bytes | lenB:u8 | fieldB:bytes | wordB:u32be`。字段各≤18B，正文总长`11+a+b≤45`；`encode/decodeLauncherRequest10Frame`额外处理2B大端正文长度，封装≤47B。接口接受显式`{wordA,fieldA,fieldB,wordB}`，bytes为ArrayBuffer/Uint8Array，**不接收字符串或猜测凭据编码/密码变换**。解码器返回冻结容器及独立plain Uint8Array副本；正确处理非零byteOffset，严格拒绝截断、尾随、错类型、溢出字数和错长度。

该封装是连接队列之前的观察边界，不是完整线上会话或游戏codec。v7已追wordA为提交前计数器、wordB为Gamecode；v8进一步确认两byte字段对应用户名/密码的直接字节提交及UI16B子集。低层API继续保留位置名，实际代码页/平台文本转换未验证。记录层见v7、UI子集见v8，均未扩展为认证成功。`LAUNCHER_MESSAGE_LIMITS`冻结，`LauncherMessageError.code`为`INVALID_INPUT/INVALID_WORD/MESSAGE_FIELD_BUDGET/MESSAGE_BUDGET/MESSAGE_TRUNCATED/MESSAGE_TAG/MESSAGE_LENGTH/FRAME_BUDGET/FRAME_TRUNCATED/FRAME_LENGTH`；错误不回显字段内容。

```sh
node shared/examples/launcher-region-plan.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
node shared/tests/validate-local-launcher.mjs \
  analysis/launcher-v6/configuration-oracle.json analysis/launcher-v6/request10-vectors.json \
  /explicit/path/GameList.xml /explicit/path/RegionList.xml
```

真实对照适配器先核对两个固定SHA256，再与Python独立结果比对；只读取显式普通文件，不扫描目录。125项Node、真实5游戏/12区域/8可选关联/1缺失引用及5组原创struct向量通过。[回执](../analysis/launcher-v6/validation.json)。网页本地导入另验，Safari/手机/小程序、真实认证/更新/交接和官服仍未通过。


<a id="offline-launcher-core"></a>
## 离线启动配置与文件计划

`launcher.mjs`是独立原创的纯文本核心，由`index.mjs`重导出。它把已证实的GameList字段、重复Code记录及目录来源接入可运行数据流程，不实现启动器UI、真实进程执行、更新、游戏认证或协议。规格来自[配置观察](../analysis/launcher/config-summary.json)、[目录来源与地址](../analysis/launcher-v5/directory-context.md)和[启动上下文](../analysis/launcher-v4/launch-context.md)。

**证据事实：** GameList中`Gamelist/Games/Game`及Code/Name/EXE/Argsline/RegKey/RegValue等字段、重复Code按记录顺序保留；HKCU目录优先，缺失/读取失败时采用`[Path] Game{Code文本}`；静态Argsline可能带空格。**独立实现政策：** 以下有界XML/INI子集、歧义拒绝、路径约束和冻结输出是本工程的输入契约，不宣称完整复制原XML库或Windows Profile/命令行语义。

### 导入与运行

```js
import {
  LAUNCHER_LIMITS, LauncherError,
  parseGameCatalog, parsePathOverrides,
  resolveGameDirectory, createOfflineLaunchPlan,
} from './shared/index.mjs';

const catalog = parseGameCatalog(decodedGameListText);
const plan = createOfflineLaunchPlan(catalog, 0, {
  iniText: '[Path]\nGame11=C:\\Synthetic Assets\\Demo\n',
});
// plan.files.client.windowsPath、plan.directory.source、plan.argsLine均为数据。
// 不提供命令行字符串或任何下载/执行函数。
```

不带外部输入的原创合成示例：

```sh
node shared/examples/launcher-plan.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

[示例源码](examples/launcher-plan.mjs)只打印JSON，[实际输出](evidence/launcher-example.json)可核对。网页/小程序适配器以后负责合法本地文本解码、用户文件选择与目录引用映射；本模块不依赖TextDecoder/DOM/Node/fs/Buffer/wx。浏览器不能据这个API读取Windows注册表，也不能直接把windowsPath当本地文件句柄。

### API契约

| API | 输入 → 输出 | 约束 |
| --- | --- | --- |
| `parseGameCatalog(text,{allowBareAmpersands=false})` | 已解码文本 → 冻结的`{games,declaredVersion,diagnostics}` | 不是bytes解码器；固定大小/深度/节点预算；DTD/外部实体/命名空间/其他PI拒绝 |
| `parsePathOverrides(text)` | INI文本 → 冻结的`{code,key,path}[]` | 仅section、key=value、分号整行注释；只返回Path/Game条目；不保存其他节值 |
| `resolveGameDirectory(game,{registry?,iniText?})` | 选中记录与查询结果 → 冻结的目录来源数据 | 找到有效HKCU值时不解析备用INI；不存在默认cwd；不迁移旧键 |
| `createOfflineLaunchPlan(catalog,ordinal,options)` | 目录及配置 → 冻结文件计划 | 按0起始ordinal选择，不按Code去重或当数组下标；没有执行/存在性/就绪检查 |

`games`每项含`ordinal,code,name,files,registry,argsLine,unhandledFields`。`code`保留十进制文本（含前导0）；`files`含client、patcher、configuration、special相对路径，后三者可为null；未知字段只列名称，不解释URL或嵌套业务。`argsLine`保留文本空格，literal CRLF按XML处理成LF，数字字符引用按其字符保留；它不是已经恢复的操作系统argv规则或认证参数。PatchEXE只是配置路径，不推导其BAK转换、执行顺序或更新状态。

目录快照示例（由调用者显式提供，核心不发起查询）：

```js
const registry = {
  status: 'found', // 或missing、unreadable；省略表示not-provided
  hive: 'HKCU', key: 'Software\\ExampleGames\\Offline', valueName: 'Path',
  value: 'C:\\Local Games\\Demo',
};
const plan = createOfflineLaunchPlan(catalog, 0, { registry, iniText });
```

快照必须与选中记录的HKCU键/值匹配；错误hive或引用报错，不悄悄切到别的游戏。found但路径为空/非法时报错，不以INI掩盖。missing/unreadable/省略查询时，回退`[Path]`的`Game`+原Code文本；section/键按ASCII大小写兼容，重复Path节或键报错。旧RegKey/RegValue迁移不实现，只有当前引用已找到时可正常使用，否则明确报`UNSUPPORTED_LEGACY_REGISTRY`。INI不插值、不展开环境变量、不写缓存，也不读当前账号。

计划返回`{ordinal,code,name,directory,files,argsLine}`。目录含`source,path`及所选HKCU或INI引用；文件角色对应`{relativePath,windowsPath}`或null。路径为**遗留Windows安装元数据**：当前只接收本地盘符绝对目录，拒绝UNC、URL、POSIX、相对盘符；配置文件名必须相对，拒绝穿越、ADS、设备名、空组件、尾随点/空格和歧义引号。仅将斜杠统一成反斜杠并连接字符串，不触碰文件系统、不解析链接、不宣称目录/文件存在。POSIX/浏览器目录映射未实现，不把不支持的表示当作安装损坏。

### 预算、拒绝和兼容边界

`LAUNCHER_LIMITS`被冻结：XML最多256Ki UTF-16 code units、INI64Ki、单字段4096、Game记录128、XML节点4096、深度8、每节点属性16；XML声明另限256字符。输入必须为合法Unicode文本；未知命名实体、坏数字实体、NUL/孤立代理项、截断/错配标签、重复属性/关键字段均拒绝。

裸`&`默认拒绝。仅调用者显式设置`allowBareAmpersands:true`时保留普通裸符号，并在`diagnostics.literalAmpersands`计数；未知命名实体和坏数字实体仍拒绝。这是兼容读取政策，不改写源文件，不声称与官方XML解析器等价。未默认读取任何官方XML，自动测试与示例只用原创合成输入。

`LauncherError`含稳定`code`及可读message，不带原始配置/路径秘密的details。主要类别：`INVALID_INPUT`、`INVALID_CHARACTER`、`CATALOG_BUDGET`、`INI_BUDGET`、`FIELD_BUDGET`、`XML_SYNTAX`、`XML_ENTITY`、`XML_UNSUPPORTED`、`XML_DEPTH`、`XML_NODE_BUDGET`、`XML_ATTRIBUTE_BUDGET`、`XML_DUPLICATE_ATTRIBUTE`、`XML_SCHEMA`、`DUPLICATE_FIELD`、`MISSING_FIELD`、`GAME_CODE`、`GAME_COUNT`、`REGISTRY_REFERENCE`、`REGISTRY_RESULT`、`REGISTRY_MISMATCH`、`UNSUPPORTED_LEGACY_REGISTRY`、`INI_SYNTAX`、`INI_DUPLICATE`、`NO_DIRECTORY`、`UNSUPPORTED_DIRECTORY`、`UNSAFE_PATH`、`ORDINAL_BOUNDS`。

stage36时31个新测试和原有25个Node资源/Web测试合计56/56通过，Python资源8/8、保留Swift16/16回归通过；[实际命令与范围](evidence/launcher-validation.json)、[Node日志](evidence/launcher-node-tests.log)。这是离线数据逻辑验收，不证明真实目录、游戏启动、认证、手机/小程序或官服兼容。


<a id="inventory-and-map01"></a>
## 显式安装inventory与MAP01原始解析

stage38新增`install-inventory.mjs`和`map01.mjs`，由原`index.mjs`导出；`local-paths.mjs`仅为内部共享路径政策，使旧计划器与inventory对路径的拒绝一致。没有文件扫描、注册表访问、下载/执行、认证或游戏就绪判断。

```js
import { verifyInstallInventory, InventoryError, INVENTORY_LIMITS,
         parseMAP01, Map01Error, MAP01_LIMITS } from './shared/index.mjs';

// plan来自createOfflineLaunchPlan；以下都是调用者显式提供的元数据。
const result = verifyInstallInventory(plan, {
  rootPath: plan.directory.path,
  files: [{ relativePath: 'demo.exe', byteLength: 100, kind: 'file' }],
}, { expected: [{ relativePath: 'demo.exe', byteLength: 100 }] });
const map = parseMAP01(userSelectedBytes);
```

无需外部资源的组合示例与回归：

```sh
node shared/examples/install-and-map.mjs
node --test shared/tests/*.test.mjs web/tests/*.test.mjs
```

[示例](examples/install-and-map.mjs)及[实际输出](evidence/install-map-example.json)明确标明runtimeReadiness未验证。

### `verifyInstallInventory(plan, inventory, { expected=[] }={})`

只接受已有计划及**同一显式目录的metadata快照**。`inventory.rootPath`须与plan目录匹配；files每项为`{relativePath,byteLength,kind:'file',sha256?}`。非file种类（包括link/junction/directory）拒绝，但这仅验证声明，**不会探测真实文件类型、读取文件或计算SHA256**。byteLength必须非负安全整数，sha256如提供必须64位hex。`expected`每项是`{relativePath,byteLength?,sha256?}`，至少提供大小或摘要，可声明额外资源；没有任一官方完整安装清单被默认加载。

configured client/patcher/configuration/special变为requirements（null略过）；多个角色指向同一文件可合并roles。期望值绑定相同相对路径，不允许重复/别名期望。相对路径和目录沿用已有本地Windows元数据子集；组合后的完整路径也限4096字符。ROOT不匹配、穿越、绝对/网络路径、ADS、设备名、歧义分隔/结尾点空格等拒绝。对匹配和冲突使用明确的**ASCII大小写折叠＋NFC**政策，不宣称等价于所有Windows/其他文件系统的Unicode规则。

返回冻结数据：`scope,casePolicy,ordinal,code,rootPath,fileCount,snapshotConsistent,knownRequirementsSatisfied,summary,requirements,ambiguities`。每个requirement含relativePath、roles、expected、actual、status、checks。status为`present`、`missing`、`ambiguous`、`mismatch`、`unverified`；checks分别报告byteLength和sha256的match/mismatch/not-requested，缺少明确要求的摘要为unavailable→unverified。大小与摘要不匹配会分别保留，不隐藏其他检查。快照内即使未要求的路径重复也使snapshotConsistent/knownRequirementsSatisfied为false。

**knownRequirementsSatisfied只表示这份快照满足这些显式要求**：未给摘要/大小预期时相应检查为not-requested；0字节文件可满足单纯存在性要求，不意味着有效PE或资产。调用者提供的伪造/陈旧metadata无法由纯函数识别。这里没有readyToPlay/认证/官方兼容布尔值。

`INVENTORY_LIMITS`冻结：files16384项、expected4096项、参与匹配的路径文字合计4Mi字符；每路径/完整组合路径4096。`InventoryError.code`包含`INVALID_INPUT`、`INVALID_PLAN`、`ROOT_MISMATCH`、`PLAN_PATH_MISMATCH`、`INVALID_SIZE`、`INVALID_DIGEST`、`UNSUPPORTED_ENTRY_KIND`、`DUPLICATE_EXPECTATION`、`EMPTY_EXPECTATION`、`INVENTORY_BUDGET`、`EXPECTATION_BUDGET`、`METADATA_BUDGET`及共用路径错误。元数据不匹配返回负结果；非法输入抛稳定错误。

### `parseMAP01(bytes)`

接受Uint8Array或ArrayBuffer，正确处理非零byteOffset。已证结构来自[四样本观察与身份](../analysis/game/map-observations.json)：magic为`4d415001`，20字节头，UInt32LE@12/@16为候选宽高，长度严格`20 + 6*w*h`。

返回冻结`{version:1,width,height,cellCount,byteLength,opaque:{headerBytes4to11,bodyBytes}}`。opaque两数组均为独立plain Uint8Array副本（调用者可修改自己的副本），不与输入共享；未知@4…11字节不强制为0。**不分命名平面，不提供cell/tile/collision/坐标/显示方向语义或渲染器**，原始body只是完整6wh字节。

`MAP01_LIMITS`冻结：20B头、32MiB输入、4Mi候选单元。乘法前先用除法核对宽高预算，避免UInt32乘积精度/溢出问题；零尺寸、短头、截断/多余body、超预算和未知版本明确拒绝。`Map01Error.code`：`INVALID_INPUT`、`MAP_BUDGET`、`MAP_TRUNCATED`、`MAP_MAGIC`、`UNSUPPORTED_MAP_VERSION`、`ZERO_DIMENSION`、`MAP_CELL_BUDGET`、`MAP_LENGTH`。

### 四个真实样本复核

仅在用户有权读取的显式四路径上运行，顺序对应旧观察1000、101、1011、40000；不会扫描目录或读取账号。Python oracle和Node适配器都限制普通文件大小/短读/部分变化并拒绝叶层链接（不承诺祖先链接或跨时刻原子快照）；oracle输出路径必须不存在。

```sh
python3 analysis/resources-v2/map01_oracle.py analysis/game/map-observations.json \
  /path/1000.dat /path/101.dat /path/1011.dat /path/40000.dat --output /tmp/new-map-oracle.json
node shared/tests/validate-local-map01.mjs /tmp/new-map-oracle.json \
  /path/1000.dat /path/101.dat /path/1011.dat /path/40000.dat
```

四样本300×300、200×200、30×30、100×80的完整SHA256、候选尺寸、头部和body摘要与独立Python结果4/4匹配，见[oracle元数据](evidence/map01-real-oracle.json)、[实际对照](evidence/map01-real-comparison.json)。成果不含地图body。新17项inventory＋12项MAP测试与原56项合计85/85 Node通过，Python8/8、Swift16/16回归通过；首轮缺摘要夹具错误及修复也记录在[验收回执](evidence/install-map-validation.json)。这些验证不证明完整安装、地图语义或游戏协议/官服兼容。
