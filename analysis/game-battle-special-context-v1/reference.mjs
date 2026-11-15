import{specialPairsMotion}from'../game-battle-special-pairs-v1/reference.mjs';
export function sequenceMotion(c){const parts=[c,...(c.parallel??[])].map(specialPairsMotion),size=parts.reduce((n,b,i)=>n+b.length-(i?2:0),0),out=new Uint8Array(size);let at=0;for(let i=0;i<parts.length;i++){const b=i?parts[i].subarray(2):parts[i];out.set(b,at);at+=b.length;}return out;}
