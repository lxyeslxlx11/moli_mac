// Original local examples. No official configuration, assets, endpoints or account data.
import { computeLauncherFileMd5 } from '../shared/index.mjs';
export function makeSyntheticLauncher() {
  return {
    games: '<Gamelist><Head><Version>original-demo-1</Version></Head><Games>'
      + '<Game Code="11"><Name>经典示例</Name><EXE>demo.exe</EXE><PatchEXE>patch.exe</PatchEXE><ConfigEXE>config.exe</ConfigEXE><SpeFile>data/manifest.bin</SpeFile><Argsline> demo </Argsline><Regions><Region>晨光</Region><Region>维护示例</Region><Region>缺失示例</Region></Regions></Game>'
      + '<Game Code="11"><Name>测试示例</Name><EXE>test.exe</EXE><Argsline> test </Argsline><Regions><Region>星河</Region></Regions></Game>'
      + '</Games></Gamelist>',
    regions: '<Regionlist><Head><Version>original-demo-1</Version></Head><Regions>'
      + '<Region Code="71"><Name>晨光</Name><BList><BIP Port="9030">192.0.2.10</BIP></BList><PIP>patch.example.invalid</PIP><PPort>80</PPort><Arglist><Args Gamecode="11"> IP:0:192.0.2.20:9013 </Args></Arglist></Region>'
      + '<Region Code="72"><Name>维护示例</Name><Closed>本地维护状态示例</Closed></Region>'
      + '<Region Code="73"><Name>星河</Name><BList><BIP Port="9031">192.0.2.30</BIP></BList><Arglist><Args Gamecode="11"> IP:0:192.0.2.40:9014 </Args></Arglist></Region>'
      + '</Regions></Regionlist>',
    directory: 'C:\\Synthetic\\Classic',
  };
}

/** Original configuration and HTTP metadata for the opt-in loopback session example. */
export function makeSyntheticSessionLauncher(endpoints) {
  if (!Array.isArray(endpoints) || endpoints.length < 1 || endpoints.length > 10
      || endpoints.some(endpoint => endpoint?.address !== '127.0.0.1' || !Number.isInteger(endpoint.port) || endpoint.port < 1 || endpoint.port > 65535)) {
    throw new TypeError('Supply explicit original loopback fixture endpoints.');
  }
  const bips = endpoints.map(endpoint => `<BIP Port="${endpoint.port}">127.0.0.1</BIP>`).join('');
  const games = '<Gamelist><Head><Version>original-session-2</Version></Head><Games>'
    + '<Game Code="11"><Name>经典本地示例</Name><EXE>original-demo.exe</EXE><Regions><Region>本地测试区</Region><Region>维护示例</Region><Region>缺失示例</Region><Region>未授权示例</Region></Regions></Game>'
    + '<Game Code="11"><Name>重复编号示例</Name><EXE>original-other.exe</EXE><Regions><Region>本地测试区</Region></Regions></Game>'
    + '</Games></Gamelist>';
  const regions = '<Regionlist><Head><Version>original-session-2</Version></Head><Regions>'
    + `<Region Code="71"><Name>本地测试区</Name><BList>${bips}</BList><Arglist><Args Gamecode="11"> original-local </Args></Arglist></Region>`
    + '<Region Code="72"><Name>维护示例</Name><Closed>原创维护说明</Closed></Region>'
    + '<Region Code="73"><Name>未授权示例</Name><BList><BIP Port="9030">192.0.2.10</BIP></BList></Region>'
    + '</Regions></Regionlist>';
  const utf8 = value => new TextEncoder().encode(value), launcher = utf8('Original web launcher metadata reference1\n');
  const gameBytes = utf8(games), regionBytes = utf8(regions);
  return Object.freeze({ games, regions, bootstrap: Object.freeze({ encoding: 'utf-8', allowBareAmpersands: false,
    localLauncherBytes: launcher, localGameListBytes: utf8(games.replace('original-session-2', 'original-session-1')),
    localRegionListBytes: utf8(regions.replace('original-session-2', 'original-session-1')),
    launcherDigestBytes: utf8(computeLauncherFileMd5(launcher)),
    catalogDigestBytes: utf8(`${computeLauncherFileMd5(gameBytes)}\n${computeLauncherFileMd5(regionBytes)}\n`),
    gameListBytes: gameBytes, regionListBytes: regionBytes }) });
}
