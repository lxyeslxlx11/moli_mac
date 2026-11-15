import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {verifyBattleWater} from './reference.mjs';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage299-api-final/game.js')):await import('../../shared/index.mjs');
console.log(JSON.stringify(await verifyBattleWater(api,JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url))))));
