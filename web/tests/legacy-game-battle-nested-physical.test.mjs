import test from'node:test';
import*as api from'../../shared/index.mjs';
import{createWeChatLegacyGameSession}from'../../adapters/wechat/legacy-game-session.mjs';
import{nestedPhysicalTCPModes,runNestedPhysicalTCP}from'../../analysis/game-battle-nested-physical-v1/tcp-flow.mjs';
for(const mode of nestedPhysicalTCPModes)test('nested actual source OS TCP '+mode,{timeout:40000},async()=>console.log('nested-physical-source-tcp '+JSON.stringify(await runNestedPhysicalTCP({...api,createWeChatLegacyGameSession},mode))));
