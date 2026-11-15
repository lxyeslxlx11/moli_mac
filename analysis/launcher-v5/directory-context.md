# 启动目录的静态来源（v5）

范围：只读复用 REA 6.7.0/Ghidra 12.1.4 的目录函数 dossier 与 GNU objdump 2.47.20260726 缓存；独立 Python 3.9.6 核对磁盘字节及 IAT。没有运行目标、读取来宾注册表/INI、网络或凭据。固定解压 PE SHA256 `601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31`，GameList SHA256 `be8f1213d77bd294fbb79b2fb51a5e7fecdc9aa3c0854db7a6d821fad20ef85a`。完整地址→文件偏移、短字节锚点及上游 Evidence ID 见 [JSON](directory-context.json)。

## 已闭合的链（事实，高置信度）

1. `Code` 的文本写入每游戏记录 `+0x1b80`；`RegKey/RegValue` 分别写入 `+0x1b6c/+0x1b70`；`OldRegKey/OldRegValue` 才是 `+0x1b64/+0x1b68`。记录步长0xa4。不能混用两组。
2. `0x403c24` 压入 HKEY_CURRENT_USER（0x80000001），`0x403c29` 调用 RegOpenKeyExA，权限掩码0xf003f；`0x403c82` RegQueryValueExA读取目录值。Code11两条目录记录均指定 `Software\SECN\PlayOnline\CrossGatePUK3` 的 `Path`，因此静态主来源为 **HKCU\Software\SECN\PlayOnline\CrossGatePUK3 → Path**。这不是已确认当前VM存在此值。
3. 读取成功在 `0x403c9f/0x403ca6` 写入每条目录 `this+0x6c34+ordinal*4`，并标记已找到路径。RegKey为空或打开失败可进入旧键分支；**打开成功但查询失败不会进入旧键分支**，而是转到最终状态检查。两种失败在路径未就绪时均可能使用INI回退。
4. 通用旧键分支 `0x403d2b/0x403d88` 读取旧值；随后 `0x403dce/0x403e25` 创建并写入当前键，再保存目录。**本样本Code11两项没有OldRegKey/OldRegValue标签**，所以不能将通用迁移描述为Code11必经步骤。
5. 未找到注册表路径时，`0x403f69` 调用 `0x424b60`，后者 `0x424bd8` 是 GetPrivateProfileStringA。参数栈明确为 **lpAppName="Path"、lpKeyName="Game"+Code文本、默认值空**，即 Code11读 `[Path]` 节的 `Game11` 键。`0x424bbd/0x424bc6/0x424bcf` 分别从EBP+0x14/+0x10/+0xc取默认值/键/节。不是 `[Game11]` 的 Path。注册表已得到路径的对应分支 `0x4040ae → 0x424ed0` 用 WritePrivateProfileStringA缓存相同位置。
6. INI对象构造 `0x401227 → 0x424a20`：GetModuleFileNameA在 `0x424a84` 得到框架模块路径，向后找反斜线保留目录，拼接 `PlayOnline.ini`（VA0x4b7338，文件0xb6538），存入对象+4。**推测，正常主模块装载布局下**为启动器同目录；不声称已观察实际路径或排除其他模块装载条件。
7. 选中目录在 `0x404c3a/0x404c40`（另一拼接分支0x404d30）进入当前 `+0x1b18`，EXE路径进入 `+0x1b1c`；选择回调的0x4055c8/0x405676也更新相同cwd字段。后者在v4已证实的 `0x407e3e` 复制到CreateProcess工作目录参数；`0x408589`为游戏创建调用。两个Code11条目共享注册表位置及INI键，不等于目录模型可以按Code去重。

## 可用边界与未证实项

这是数据来源和局部控制流，不是一次运行轨迹。路径字符串非空、函数有调用、同名文件存在，都不能证明完整资源/配置有效或登录已成功。没有检查用户当前注册表、INI或其文件内容；没有写入这些位置。未穷尽所有UI目录编辑和后续写入，也未证明环境变量完全不改。GameList之外的运行选择、认证/更新前置条件、游戏侧argv/共享内存消费仍待验证。

新的目录选择器可按这些可追溯规格独立设计，但本阶段没有移植Windows注册表读取器、伪造目录值或认证会话，更没有改变VM。正常启动应先保留原目录布局并确认资源来源；不能仅复制五个文件就认定正常启动前提已齐全。

## 验证

```sh
python3 analysis/launcher-v5/verify-directory-context.py --pe /tmp/moli-analysis/polcn/POLCN_Launcher.unpacked.exe --catalog /tmp/moli-analysis/polcn/app/XML/GameList.xml
```

[实际字节核验](directory-validation.json)：54/54锚点、9个IAT调用点、8个固定短字符串及2条Code11目录元数据通过。脚本先固定hash再解析XML，仅内存转义已知5处裸&；无外部实体处理或联网。[负例](directory-negative-validation.json)：截断/修改PE、截断目录、错误API、错误跳转目标、错误字符串6/6均拒绝。没有运行Windows或产品测试；产品代码未变。
