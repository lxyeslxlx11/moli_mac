import test from 'node:test';
import * as api from '../../shared/index.mjs';
import {createWeChatLegacyGameSession} from '../../adapters/wechat/legacy-game-session.mjs';
import {numericSkillTCPModes,runNumericSkillTCP} from '../../analysis/game-battle-numeric-skills-v1/tcp-flow.mjs';
for(const mode of numericSkillTCPModes)test('actual numeric/healing S/M/callback/round/return OS TCP '+mode,{timeout:40000},async()=>console.log('numeric-skills-source-tcp '+JSON.stringify(await runNumericSkillTCP({...api,createWeChatLegacyGameSession},mode))));
