import test from'node:test';
import * as api from'../../shared/index.mjs';
import {createWeChatLegacyGameSession}from'../../adapters/wechat/legacy-game-session.mjs';
import {projectileTCPModes,runProjectileTCP}from'../../analysis/game-battle-physical-specials-v1/tcp-flow.mjs';
for(const mode of projectileTCPModes)test('actual positive physical S/M/probe/flight/result/round/return OS TCP '+mode,{timeout:40000},async()=>console.log('projectile-source-tcp '+JSON.stringify(await runProjectileTCP({...api,createWeChatLegacyGameSession},mode))));
