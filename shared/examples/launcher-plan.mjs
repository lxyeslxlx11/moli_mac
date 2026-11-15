// Original synthetic input; this script only prints a data plan and performs no I/O other than stdout.
import { parseGameCatalog, createOfflineLaunchPlan } from '../index.mjs';
const catalog = parseGameCatalog(`<Gamelist><Games><Game Code="11">
  <Name>原创离线目录示例</Name><EXE>demo-client.exe</EXE><Argsline> demo </Argsline>
  <RegKey>Software\\ExampleGames\\Offline</RegKey><RegValue>Path</RegValue>
  <ConfigEXE>tools\\demo-config.exe</ConfigEXE>
</Game></Games></Gamelist>`);
const plan = createOfflineLaunchPlan(catalog, 0, { iniText: '[Path]\nGame11=C:\\Synthetic Assets\\Demo\n' });
console.log(JSON.stringify(plan, null, 2));
