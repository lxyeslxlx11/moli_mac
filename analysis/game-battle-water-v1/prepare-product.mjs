/** Reuse the original stage296 product checks with this stage's explicitly authored water-map peer. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../../',import.meta.url)),base=resolve(root,'analysis/game-actual-battle-product-v1'),target=resolve(root,'build/analysis/game-battle-water-v1/product-test.mjs');
let source=readFileSync(resolve(base,'product-test.mjs'),'utf8');
assert.ok(source.includes("from './peer.mjs'"));
source=source.replaceAll('actualBattlePeer','battleWaterPeer').replaceAll('stage:296','stage:299').replaceAll('CUT','MAP').replace("MOLI_MATERIAL_MAP??59510","MOLI_MATERIAL_MAP??40000").replace('/tmp/moli-stage296-qa','/tmp/moli-stage299-qa');
// The old CUT scene loads a named-palette animation; these authored mode0 water
// tiles use the ordinary palette. Require actual image decoding for this scene.
assert.equal(source.split('assert.ok(scene.client.library.namedPaletteEntries>0);').length-1,1);
source=source.replace('assert.ok(scene.client.library.namedPaletteEntries>0);','assert.ok(scene.client.library.stats.imagesDecoded>0);');
source=source.replace(/(?:from\s*|import\()\s*['"](\.[^'"]+)['"]/g,(match,path)=>{
 const absolute=path==='./peer.mjs'?resolve(root,'analysis/game-battle-water-v1/peer.mjs'):resolve(base,path);
 return match.replace(path,pathToFileURL(absolute).href);
});
source=source.replace("new URL('../game-legacy-material-compat-v1/material-profile.json',import.meta.url)","new URL('"+pathToFileURL(resolve(root,'analysis/game-legacy-material-compat-v1/material-profile.json')).href+"')");
mkdirSync(resolve(root,'build/analysis/game-battle-water-v1'),{recursive:true});writeFileSync(target,source);
console.log(JSON.stringify({stage:299,output:target,sourceHelper:'analysis/game-actual-battle-product-v1/product-test.mjs',mapIds:[40000,59000],newProtocolFields:false}));
