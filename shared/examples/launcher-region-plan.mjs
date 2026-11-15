import { parseGameCatalog, parseRegionCatalog, listGameRegions, createOfflineRegionLaunchPlan } from '../index.mjs';
// Original examples; this module performs no file, network, credential or process access.
const games = parseGameCatalog('<Gamelist><Games><Game Code="11"><Name>Original Classic</Name><EXE>demo.exe</EXE><Argsline> demo </Argsline><Regions><Region>Alpha</Region><Region>Missing</Region></Regions></Game></Games></Gamelist>');
const regions = parseRegionCatalog('<Regionlist><Regions><Region Code="71"><Name>Alpha</Name><BList><BIP Port="9030">192.0.2.1</BIP></BList><Arglist><Args Gamecode="11"> IP:0:192.0.2.2:9013 </Args></Arglist></Region></Regions></Regionlist>');
console.log(JSON.stringify({ scope: 'Original offline configuration; authentication and runtime readiness unverified',
  choices: listGameRegions(games, 0, regions),
  plan: createOfflineRegionLaunchPlan(games, 0, regions, 0, { iniText: '[Path]\nGame11=C:\\Synthetic\\Classic\n' }),
}, null, 2));
