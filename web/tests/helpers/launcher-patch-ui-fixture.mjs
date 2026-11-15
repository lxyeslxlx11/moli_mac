/** Original patch service + bootstrap configuration for the real login page. */
import {readFile} from 'node:fs/promises';
import {computeLauncherFileMd5} from '../../../shared/index.mjs';
import {makeSyntheticSessionLauncher} from '../../launcher-fixture.mjs';
import {createGamePatchFixture} from './launcher-game-patch-fixture.mjs';
const vector=JSON.parse(await readFile(new URL('../../../analysis/launcher-v28/original-ui-patch.json',import.meta.url)));
const bytes=hex=>Uint8Array.from(Buffer.from(hex,'hex')),utf8=text=>new TextEncoder().encode(text);
export async function createPatchUiSource(){
  const source=await createGamePatchFixture();source.set('/cg50/Update.TXT',{body:bytes(vector.manifest_hex)});
  for(const row of vector.packages)source.set(row.path,{body:bytes(row.hex)});
  return {...source,vector,expectedFiles:vector.expected_files.map(row=>({path:row.path,bytes:bytes(row.hex)})),
    bootstrap(endpoints){
      const fixture=makeSyntheticSessionLauncher(endpoints);
      const games=fixture.games.replace('<EXE>original-demo.exe</EXE>','<EXE>original-demo.exe</EXE><PatchEXE>patch.exe</PatchEXE>');
      const regions=fixture.regions.replace('</BList>',`</BList><PIP>127.0.0.1</PIP><PPort>${source.port}</PPort>`);
      const gameListBytes=utf8(games),regionListBytes=utf8(regions);
      return {...fixture.bootstrap,gameListBytes,regionListBytes,catalogDigestBytes:utf8(computeLauncherFileMd5(gameListBytes)+'\n'+computeLauncherFileMd5(regionListBytes)+'\n')};
    }};
}
