import test from'node:test';
import*as api from'../../shared/index.mjs';
import{createWeChatLegacyGameSession}from'../../adapters/wechat/legacy-game-session.mjs';
import{specialPairsTCPModes,runSpecialPairsTCP}from'../../analysis/game-battle-special-pairs-v1/tcp-flow.mjs';
for(const mode of specialPairsTCPModes)test('94/257/262 actual source OS TCP '+mode,{timeout:40000},async()=>console.log('special-pairs-source-tcp '+JSON.stringify(await runSpecialPairsTCP({...api,createWeChatLegacyGameSession},mode))));
