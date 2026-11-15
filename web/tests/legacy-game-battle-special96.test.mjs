import test from'node:test';
import*as api from'../../shared/index.mjs';
import{createWeChatLegacyGameSession}from'../../adapters/wechat/legacy-game-session.mjs';
import{special96TCPModes,runSpecial96TCP}from'../../analysis/game-battle-special96-v1/tcp-flow.mjs';
for(const mode of special96TCPModes)test('class96 actual source OS TCP '+mode,{timeout:40000},async()=>console.log('special96-source-tcp '+JSON.stringify(await runSpecial96TCP({...api,createWeChatLegacyGameSession},mode))));
