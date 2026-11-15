import test from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../../shared/index.mjs';
import {createWeChatLegacyGameSession} from '../../adapters/wechat/legacy-game-session.mjs';
import {runCommandTCP} from '../../analysis/game-battle-commands-v1/tcp-flow.mjs';
for(const mode of ['queues','end','eof'])test('source client/world M command calls over actual OS TCP '+mode,async()=>{
  const result=await runCommandTCP({...api,createWeChatLegacyGameSession},mode);
  assert.equal(result.battleGameplayAccepted,false);assert.equal(result.closedOwners,true);console.log('battle-command-tcp '+JSON.stringify(result));
});
