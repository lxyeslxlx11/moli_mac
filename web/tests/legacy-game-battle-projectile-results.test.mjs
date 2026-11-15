import test from 'node:test';
import * as api from '../../shared/index.mjs';
import {createWeChatLegacyGameSession} from '../../adapters/wechat/legacy-game-session.mjs';
import {positiveTCPModes,positiveRecoveryModes,runPositiveTCP} from '../../analysis/game-battle-projectile-results-v1/tcp-flow.mjs';
for(const mode of positiveTCPModes)test('positive actual source OS TCP '+mode,{timeout:positiveRecoveryModes.includes(mode)?240000:40000},async()=>console.log('positive-results-source-tcp '+JSON.stringify(await runPositiveTCP({...api,createWeChatLegacyGameSession},mode))));
