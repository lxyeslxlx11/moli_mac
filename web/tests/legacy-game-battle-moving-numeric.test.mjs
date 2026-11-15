import test from 'node:test';
import * as api from '../../shared/index.mjs';
import {createWeChatLegacyGameSession} from '../../adapters/wechat/legacy-game-session.mjs';
import {movingNumericTCPModes,runMovingNumericTCP} from '../../analysis/game-battle-moving-numeric-v1/tcp-flow.mjs';
for(const mode of movingNumericTCPModes)test('actual83 moving numeric/afterimage/stop/round/return OS TCP '+mode,{timeout:40000},async()=>console.log('moving-numeric-source-tcp '+JSON.stringify(await runMovingNumericTCP({...api,createWeChatLegacyGameSession},mode))));
