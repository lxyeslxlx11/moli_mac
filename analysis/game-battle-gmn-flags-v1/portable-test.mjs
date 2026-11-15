import{readFileSync}from'node:fs';
import{createRequire}from'node:module';
import{resolve}from'node:path';
import{verifyControlModel}from'./reference.mjs';
const api=process.argv[2]==='generated'?createRequire(import.meta.url)(resolve('build/wechat-game-stage297-api-final/game.js')):await import('../../shared/index.mjs');
const vectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
console.log(JSON.stringify(await verifyControlModel(api,vectors)));
