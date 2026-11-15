import test from 'node:test';
import * as api from '../../shared/index.mjs';
import {createWeChatLegacyGameSession} from '../../adapters/wechat/legacy-game-session.mjs';
import {statusSkillTCPModes,runStatusSkillTCP} from '../../analysis/game-battle-status-skills-v1/tcp-flow.mjs';
for(const mode of statusSkillTCPModes)test('actual status/utility S/M/callback/round/return OS TCP '+mode,{timeout:40000},async()=>console.log('status-skills-source-tcp '+JSON.stringify(await runStatusSkillTCP({...api,createWeChatLegacyGameSession},mode))));
