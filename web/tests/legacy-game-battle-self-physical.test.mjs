import test from'node:test';
import*as api from'../../shared/index.mjs';
import{createWeChatLegacyGameSession}from'../../adapters/wechat/legacy-game-session.mjs';
import{selfPhysicalTCPModes,runSelfPhysicalTCP}from'../../analysis/game-battle-self-physical-v1/tcp-flow.mjs';
for(const mode of selfPhysicalTCPModes)test('self actual source OS TCP '+mode,{timeout:40000},async()=>console.log('self-physical-source-tcp '+JSON.stringify(await runSelfPhysicalTCP({...api,createWeChatLegacyGameSession},mode,{sourceGuardReturn:true}))));
