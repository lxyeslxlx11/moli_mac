import test from 'node:test';
import {runActorTextCase} from './helpers/legacy-game-actor-text-runner.mjs';
for(const platform of ['node','wechat'])for(const mode of ['text-full','text-reload','text-close'])test('actual original TCP '+platform+' source ordinary text '+mode,async()=>{await runActorTextCase(mode,platform);});
