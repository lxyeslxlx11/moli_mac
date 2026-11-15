/** Independent original Python POS/EQU reference and source snapshot projection. */
import{readFileSync}from'node:fs';import{skillProjection}from'../game-battle-skill-v1/reference.mjs';
export const changeVectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
export function changeMotion(row){return new TextEncoder().encode('M|'+row.kind+'|'+(row.kind==='POS'?[row.slot]:[row.slot,row.resource,row.auxResource]).map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|');}
export function changeProjection(owner){const p=skillProjection(owner),state=owner.copyState();return{...p,bodies:p.bodies.map(b=>{const a=state.bodies[b.slot];return{...b,resourceId:a.resourceId,nextResource:a.nextResource,resource13a8:a.resource13a8};})};}
