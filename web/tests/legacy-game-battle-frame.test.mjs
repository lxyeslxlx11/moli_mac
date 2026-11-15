import test from 'node:test';
import * as api from '../../shared/index.mjs';
import {createWeChatLegacyGameSession} from '../../adapters/wechat/legacy-game-session.mjs';
import {runBattleFrameTCP} from '../../analysis/game-battle-scene-v1/tcp-flow.mjs';
for(const mode of ['status','escape-other','pause','close','read-fail'])test('actual source battle frame TCP/resources/ownership: '+mode,{timeout:30000},async()=>{
  console.log('battle-frame-tcp '+JSON.stringify(await runBattleFrameTCP({...api,createWeChatLegacyGameSession},mode)));
});
