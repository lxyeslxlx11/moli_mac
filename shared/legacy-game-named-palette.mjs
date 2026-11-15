/** Fixed37c4 ordinary named-palette resource map,derived from verified1495slot table568310. */
import {assetInteger} from './legacy-game-resource-values.mjs';
export const LEGACY_GAME_NAMED_PALETTE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-named-palette-v1',slots:1495,paletteBytes:768,cacheEntries:64,
 sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',tableSha256:'e840afd5967889eed59ef3445e7ba47cfef465b973df5d5d59e407e32875e150'});
const resources=Uint32Array.from([[0,1],[110300,74],[110380,16],[110400,15],[110420,49],[110500,2],[110600,36],[110650,36],[110700,16],[110750,17],[113000,1000],[110401,12],[110414,1],[110504,1],[110376,4],[110469,9],[110520,66],[114165,35],[110767,3],[110505,4],[110396,4],[110509,6],[110586,14],[110770,30],[114200,25],[110599,1],[120001,6],[120029,1],[120043,11]].flatMap(([first,count])=>Array.from({length:count},(_,i)=>first+i)));
export function legacyGameNamedPalette(value){assetInteger(value,0,65535);const selector=value>0&&value<1495?value:0;return Object.freeze({selector,resourceId:resources[selector]});}
