import test from 'node:test';
import {runActorPresentationCase} from './helpers/legacy-game-actor-presentation-runner.mjs';
for(const platform of ['node','wechat'])for(const mode of ['presentation-full','presentation-reload','presentation-close'])test('actual original TCP '+platform+' source status '+mode,async()=>{await runActorPresentationCase(mode,platform);});
