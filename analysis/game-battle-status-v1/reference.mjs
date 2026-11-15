/** Original Python reference and source-only projections; no shipped assets. */
import {readFileSync} from 'node:fs';
import {skillProjection} from '../game-battle-skill-v1/reference.mjs';
export const statusVectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
export const statusMotion=row=>new TextEncoder().encode('M|PSN|'+[row.selector,row.level,row.slot,row.flags,row.amount].map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|');
export function statusProjection(bodies){const p=skillProjection(bodies),state=bodies.copyState();return{...p,bodies:p.bodies.map(b=>{const r=state.bodies[b.slot];return{...b,skillLevel:r.skillLevel,numberValue:r.numberValue,numberStyle:r.numberStyle};})};}
