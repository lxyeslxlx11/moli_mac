import test from 'node:test';
import * as api from '../../shared/index.mjs';
import {createWeChatLegacyGameSession} from '../../adapters/wechat/legacy-game-session.mjs';
import {resultTCPModes,runResultTCP} from '../../analysis/game-battle-physical-results-v1/tcp-flow.mjs';
for(const mode of resultTCPModes)test('E000 actual source OS TCP '+mode,{timeout:40000},async()=>console.log('results-source-tcp '+JSON.stringify(await runResultTCP({...api,createWeChatLegacyGameSession},mode))));
