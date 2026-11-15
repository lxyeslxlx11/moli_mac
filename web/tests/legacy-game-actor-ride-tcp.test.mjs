import test from 'node:test';
import {runActorRideCase} from './helpers/legacy-game-actor-ride-runner.mjs';
for(const platform of ['node','wechat'])for(const mode of ['ride-full','ride-reload','ride-close'])test('actual original TCP '+platform+' source70 '+mode,async()=>{await runActorRideCase(mode,platform);});
