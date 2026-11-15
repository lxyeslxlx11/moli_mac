# 其他虚拟机清理候选（待确认）

记录日期：2026-10-25。以下是主任务逐项查看 UTM 主界面的当前结果；没有打开这些 VM 的设置、启动、移除或删除。

| 名称 | UTM 注册路径 | UI 状态 | 架构 | UI 显示大小 |
|---|---|---|---|---|
| Win11CG | `/Users/lx/.Trash/moli-mac/build/utm/Win11CG.utm` | 已停止 | ARM64 | 28.12 GB |
| ImportTest | `/Users/lx/.Trash/moli-mac/build/utm/ImportTest.utm` | 已停止 | ARM64 | 28.12 GB |
| Bisect1 | `/Users/lx/.Trash/moli-mac/build/utm/Bisect1.utm` | 已停止 | x86_64 | 28.12 GB |
| Bisect4 | `/Users/lx/.Trash/moli-mac/build/utm/Bisect4.utm` | 已停止 | x86_64 | 33.76 GB |
| Win10CG | `/Users/lx/.Trash/moli-mac/build/utm/Win10CG.utm` | 已停止 | x86_64 | 38.38 GB |

**事实与限制：** 五条注册路径均指向 `.Trash`。这些是 UTM 界面显示，不能证明对应文件当前仍存在、实际分配空间或独占存储。已知废纸篓目录的只读列举被系统拒绝（PermissionError / errno 1），未重试或改变权限。候选配置和共享磁盘依赖仍未知，不能将上述大小相加后宣称可释放总量。

**待确认的操作范围：** 从 UTM 列表移除指定注册项/快捷方式，与删除废纸篓中的磁盘文件、清空废纸篓是不同操作。需先确认具体名称与目标；本清单不批准任何移除或永久清理，当前未执行删除。

**必须保留：** 当前 `MoliOffline-ARM64-20261025`、其磁盘与依赖、`build/utm/baselines`、所有 ISO/驱动介质及项目文件。不会因为名称是测试项就认定其可删除。

结构化证据及历史观察见 [cleanup-inventory.json](cleanup-inventory.json)。
