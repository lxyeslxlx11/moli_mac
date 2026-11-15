import test from 'node:test';
import {runActorContextCase} from './helpers/legacy-game-actor-context-runner.mjs';
for(const platform of ['node','wechat'])for(const mode of ['mixed','mixed-reload','mixed-close'])test('actual '+platform+' TCP source actor context: '+mode,{timeout:20000},()=>runActorContextCase(mode,platform));
