import test from 'node:test';
import {runActorVitalsCase} from './helpers/legacy-game-actor-vitals-runner.mjs';
for(const platform of ['node','wechat'])for(const mode of ['vitals-full','vitals-reload','vitals-close'])test('actual original TCP '+platform+' source ordinary vitals '+mode,async()=>{await runActorVitalsCase(mode,platform);});
