import test from 'node:test';
import * as api from '../../shared/index.mjs';
import {createWeChatLegacyGameSession} from '../../adapters/wechat/legacy-game-session.mjs';
import {castingTCPModes,runCastingTCP} from '../../analysis/game-battle-casting-v1/tcp-flow.mjs';
for(const mode of castingTCPModes)test('actual casting S/M/projectile/result/round/return OS TCP '+mode,{timeout:30000},async()=>console.log('casting-source-tcp '+JSON.stringify(await runCastingTCP({...api,createWeChatLegacyGameSession},mode))));
