import test from 'node:test';
import {runActorSpinCase} from './helpers/legacy-game-actor-spin-runner.mjs';
for(const platform of ['node','wechat'])for(const mode of ['spin-full','spin-reload','spin-close'])test('actual original TCP '+platform+' source80 '+mode,async()=>{await runActorSpinCase(mode,platform);});
