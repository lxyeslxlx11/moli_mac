/** Independent address-oriented row copy; no product fade/compositor imports. */
import {readFileSync}from'node:fs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
export const returnVectors=read('./original-vectors.json');
export const returnFade=read('../game-battle-entry-v1/original-vectors.json').fade;
export function originalReturnPixels(capture,rows,width,height){const out=new Uint8Array(width*height*4);
 for(let y=0;y<Math.min(height,480);y++){const shift=rows[y];for(let x=Math.max(0,shift);x<Math.min(width,640+shift);x++){const to=4*(y*width+x),from=4*(y*640+x-shift);out.set(capture.subarray(from,from+4),to);}}
 return out;
}
