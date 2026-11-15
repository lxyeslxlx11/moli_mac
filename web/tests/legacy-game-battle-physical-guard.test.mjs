import test from 'node:test';
import * as api from '../../shared/index.mjs';
import {createWeChatLegacyGameSession} from '../../adapters/wechat/legacy-game-session.mjs';
import {guardTCPModes,runGuardTCP} from '../../analysis/game-battle-physical-guard-v1/tcp-flow.mjs';
for(const mode of guardTCPModes)test('actual guard/charge S/M/result/round/return OS TCP '+mode,{timeout:40000},async()=>console.log('guard-source-tcp '+JSON.stringify(await runGuardTCP({...api,createWeChatLegacyGameSession},mode))));
