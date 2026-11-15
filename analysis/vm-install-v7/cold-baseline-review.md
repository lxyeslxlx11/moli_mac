# v7 私有 Windows 冷基线准备审查

日期：2026-10-25 UTC。这里只检查项目交付材料和原创脚本，并用临时合成文件测试。**未操作 UI、改变 VM、运行真实 lsof/cp/chmod、复制真实虚拟机或读取虚拟磁盘内容。** 根任务负责实际UI，先前报告已正常关机、移除NAT并导入第四只读CD；本分支仅核对其[配置证据](offline-driver-cd-config.json)。随后根任务报告真实四盘审计22/22通过、29项测试独立重跑通过，当前VM已再次启动并停在PIN页，**现在不能按已关机状态运行冷基线脚本**。本分支未独立复核实时客户机状态，也不把历史报告当新鲜关机证据。PIN设置及旧VM清理分支继续取消，游戏仍未执行。

## 阶段10交付身份

**事实：** 阶段10 manifest的285个payload文件，在暂存目录和项目目录均与记录SHA256相同；两处manifest自身也一致，SHA256 `7fe3c52c97319be136a5dca91acd1eec03b0e44446f1cdfa809e97aaad75388a`。只按manifest限定读取交付代码/报告/证据，拒绝build、moli或穿越路径；没有扫描或读取虚拟盘、镜像、账号目录。此为检查时快照，不阻止根任务后续合法修改。[只读对照回执](stage10-delivery-readonly-review.json)

## 旧准备脚本发现及修正

旧脚本`/tmp/moli_v6_cold_baseline.py`的审查SHA256为`f4afc4235b097e05a8eb0f86198caf7f028c447a28810258a5fe792bf7a17e5f`，没有执行。源代码语法解析通过并不代表可安全运行。[静态回执](cold-baseline-static-review.json)

| 具体位置/问题 | v7处理 |
|---|---|
| 第6–7、23行仍写v6输出与`final-ui-state.json`；该UI文件当时不存在 | 改为新的v7目标/回执；不改写v6历史结果，不代写已关机记录 |
| 第24行仅校验名称及布尔值，却在结论称“fresh UI receipt” | 绑定VM名称、UUID、配置hash、带时区观察时间及明确关机/无网卡/共享关闭状态；只接受0–600秒内记录 |
| 第18、22–30、37–42行以assert承担安全停止条件 | 改为显式异常与非零退出；`python -O`不能移除门槛 |
| 第30行只看复制前40GiB，未计`cp -c`退回普通复制 | 复制前按七文件逻辑字节合计加40GiB保守预算；每文件前后及收尾复查余量 |
| 第35、43行把`cp -c`直接描述为成功APFS克隆 | 本机macOS 27.0 `man cp`明确可能退回copyfile。v7只称请求克隆，实际共享extent未独立确认；不把st_blocks当独占物理使用量 |
| 第25、44行存在性检查后普通写回执 | `lexists`拒绝含悬空链接在内的既有输出；新回执以O_EXCL/O_NOFOLLOW创建，拒绝覆盖 |
| 模式0700/0600未涵盖继承ACL；失败可能留下半成品 | 仅对新目标移除继承ACL再核对权限/所有者；原盘不改权限。失败保留部分私有输出，不自动删除、覆盖或重试，也不写成功回执 |

可审查实现：[create_cold_baseline.py](create_cold_baseline.py)；同字节操作副本放在`/tmp/moli_v7_cold_baseline.py`，SHA256 `eedb424823b60c094811239977dd71f29c641b91cf93c68be9c65bff6c68b731`。根任务当前不执行冷基线，待系统检查结束、正常关机及下列条件重新满足后再决定。脚本内固定SOURCE/TARGET/UI/receipt路径，无来源路径CLI覆盖、无常驻服务。默认只做preflight；必须明确传`--apply`才进入复制。没有执行该脚本的真实preflight或apply。

## 根任务执行前必须实际满足的条件

1. **完成系统收尾或准确记录缺口。** 设备、更新后构建/剩余更新、重启后桌面等按实际证据记录。保存关机副本可以保留一个明确的未完成状态，但不能因此称系统全面健康。用户已登录Windows，副本可能含Windows身份/会话状态，只能私有本地保存，不能称无账号镜像或分发。
2. **安全关机与明确离线。** 通过正常UI确认本项目VM已停止，再移除临时网卡并复核主机目录、剪贴板、USB共享关闭。不得以暂停、锁屏、用户登录页或旧关机回执替代。整个复制期间不启动该VM，也不同时启动同UUID副本。
3. **固定四盘策略匹配。** 新增[四盘离线核验器](verify_offline_four_drive.py)，代码SHA256为`b72b8234cd52625552a6df95afacffe9a011af233cd7cc1ae09014051bbfcc87`；以独立固定常量只接受原三盘加ID `897A5D83-11BC-44A2-AEE4-F0B510C006DE`、文件`moli-base-drivers-w11-arm64-0.1.274.qcow2`的只读USB CD，Network仍空，所有共享仍关闭。固定值与根任务[实际配置证据](offline-driver-cd-config.json)完全一致，配置hash为`c7c980a646028c867429f2bc047361bcc92e9e396d871c1b438f1e58c14f8743`。源Data只允许原系统盘、三张CD、EFI、TPM六文件；加上config.plist恰好复制七文件。原[v6核验器](../vm-install-v6/verify_offline_config.py)hash `cffbd08e6ca1fbb9dbce0cc0e42085453b8b2c54e1fcd3b8643e12058ba37d10`保持不变，其三盘通过仅是导入新CD前历史状态；四盘不能套用该通过记录。其他设备/介质变更必须另行审查。
4. **新鲜、可绑定的UI回执。** 根任务在`analysis/vm-install-v7/final-ui-state.json`写入实际观察，必需字段为下表；本分支没有生成该成功记录。脚本还要求七个源文件的限定`lsof`查询返回1且stdout/stderr均空；工具不可用、权限警告、打开文件或不确定结果均停止。UI与lsof是互补观察，不是不可变锁。
5. **完整性和空间边界。** 不打开/复制thumbnail或账号内容进行检查；七个文件用普通只读流计算SHA256，复制后源/目标hash与元数据复核，成功前再次检查源无打开文件。脚本只读源而不写源，目标必须全新、同一卷、路径祖先无链接；预留最坏普通复制空间和40GiB余量。qcow2 backing chain不在配置核验器中，应有独立的无外部依赖证据；若尚未核实，只能称七文件关机副本，不能声称已证明完整恢复能力。

| UI回执字段 | 必需实际值/约束 |
|---|---|
| `schema_version` | 整数1，拒绝布尔替代 |
| `vm`、`uuid` | `MoliOffline-ARM64-20261025`、`087A27D7-88CC-4E08-8FB7-0FE852DAA3C8` |
| `observed_utc` | 实际正常关机/最终配置观察的带时区ISO时间；preflight时不得未来、不得早于10分钟 |
| `config_sha256` | 当前无网卡配置的实际hash，与核验器当场读取完全相同；不能填旧NAT hash |
| `normal_shutdown_confirmed` | 仅在UI已实际正常停止后记为true |
| `network_absent`、`sharing_disabled` | 只有实际复核后才能分别记为true |

执行入口（准备说明，不表示已经执行）：

```sh
# 默认仅检查门槛，不创建目标或读取磁盘完整内容
PYTHONDONTWRITEBYTECODE=1 python3 /tmp/moli_v7_cold_baseline.py
# 根任务确认实际条件后才运行；会只读hash并复制固定七文件
PYTHONDONTWRITEBYTECODE=1 python3 /tmp/moli_v7_cold_baseline.py --apply
```

## 测试与未运行项

**事实：** [四盘策略原创测试](test_offline_four_drive.py)12/12、[冷基线原创测试](test_cold_baseline.py)17/17，在普通Python3.9.6和`-O`模式均通过。所有lsof/cp/chmod命令由测试替身替代，只读写原创临时小文件，没有触碰真实VM。四盘策略覆盖原边界及旧三盘拒绝、新CD身份/类型/路径/只读字段；冷基线覆盖默认不复制、七文件集合/权限/源不变、UI时间/身份/hash绑定、既有输出/链接、NAT/额外Data、lsof歧义、空间预算、中途失败/并发写入、ACL失败和独占回执，另验证新增第七文件进入lsof清单、修改policy代码hash后不会执行。普通与优化模式均通过，门槛不依赖assert；不证明macOS真实cp克隆、ACL命令或真实关机环境通过。[当前测试回执](cold-baseline-tests.json)。导入第四CD前的三盘准备15/15结果另保留为[历史回执](cold-baseline-tests-three-drive-preparation.json)，不作为现行七文件实现结果。

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s analysis/vm-install-v7 -p 'test_offline_four_drive.py' -v
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover \
  -s analysis/vm-install-v7 -p 'test_cold_baseline.py' -v
PYTHONDONTWRITEBYTECODE=1 python3 -O -m unittest discover \
  -s analysis/vm-install-v7 -p 'test_cold_baseline.py' -v
```

**本分支未运行/待验证：** 真实preflight、真实复制、完整虚拟盘hash、实际克隆/普通复制结果、恢复启动、最终无网卡验收。v6核验器历史10项测试仍保留，本次只核对其源码/交付hash；新策略12项测试独立记录。根任务负责真实四盘配置核验和新增介质的qemu-img离线逻辑内容对比，本分支未执行。真实基线成功仍只能证明所记录文件的复制/hash一致；同卷副本不是独立灾备，不等于guest健康或游戏兼容。中断后必须检查现有目标及回执，不执行自动清理或盲目重试。
