/** Independent Python reference projections and original synthetic resources. */
import{readFileSync}from'node:fs';
export const skillVectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
const bodyFields=['slot','state','busy','position','angle','facing','animationAction','speed','speedPercent','counter','dynamicFlags','actorFlags','vitals','skillStatus','mpCost','classCode','rememberedPosition','reactionCounter','attackCooldown','attackFinishCounter','sourceTimer','auxFF8','tupleRead'];
const nodeFields=['id','kind','parentId','deleted','priority','drawPriority','position','screen','state','counter','height','actorFlags'],animationFields=['graphicIndex','drawOffsetX','drawOffsetY','nextFrame','delay','signal','lastAction'];
const pick=(s,fields)=>Object.fromEntries(fields.map(k=>[k,s[k]]));
export function skillProjection(bodies){const p=bodies.copyPlayback();return{phase:p.phase,seed:p.seed,bodies:bodies.copyState().bodies.filter(Boolean).map(b=>pick(b,bodyFields)),nodes:p.nodes.map(n=>({...pick(n,nodeFields),animation:pick(n.animation,animationFields)}))};}
export function skillMotion(row){const hex=n=>(n>>>0).toString(16).toUpperCase();return new TextEncoder().encode('M|SKL|'+[row.category*100+row.level,row.cost,0,...row.hits.flat(),255].map(hex).join('|')+'|');}
