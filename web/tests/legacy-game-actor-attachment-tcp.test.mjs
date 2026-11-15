import test from 'node:test';
import {runActorAttachmentCase} from './helpers/legacy-game-actor-attachment-runner.mjs';
for(const platform of ['node','wechat'])for(const mode of ['attachment-full','attachment-reload','attachment-close'])test('actual original TCP '+platform+' source60 '+mode,async()=>{await runActorAttachmentCase(mode,platform);});
