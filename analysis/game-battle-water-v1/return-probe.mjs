import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {loadWaterReturnProbe} from './prepare-return-probe.mjs';
const {runWaterReturnTCP}=await loadWaterReturnProbe();
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage299-api-final/game.js')):await import('../../adapters/wechat/game.mjs');
for(const mode of ['normal','new-own-unit','reentry-return'])console.log(JSON.stringify({stage:299,surface:process.argv[2]==='generated'?'generated':'source',...await runWaterReturnTCP(api,mode)}));
