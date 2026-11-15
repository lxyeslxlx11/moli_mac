import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../../shared/index.mjs';
import {createWeChatLegacyGameSession} from '../../adapters/wechat/legacy-game-session.mjs';
import {runBodyTCP} from '../../analysis/game-battle-body-v1/tcp-flow.mjs';
for(const mode of ['sup','escape-failed','escape-other','escape-local','status','end','dead-sup'])test('actual source client/resource/C/M body callback TCP '+mode,async()=>{
  const result=await runBodyTCP({...api,createWeChatLegacyGameSession},mode);assert.equal(result.battleGameplayAccepted,false);assert.equal(result.closedOwners,true);
  console.log('battle-body-tcp '+JSON.stringify(result));
});
