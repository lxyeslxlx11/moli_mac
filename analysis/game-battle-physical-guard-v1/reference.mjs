/** Authored pair-mode wire fixtures; fixed37c4 word order including RID and guard scalar. */
const slot=n=>n===20?50:n===21?51:n;
export function guardMotion(c){
 const fields=[c.code??c.category*100+c.level,c.cost??3,0];
 for(let i=0;i<c.hits.length;i++){
  const h=c.hits[i];fields.push(slot(h[0]),slot(h[1]),h[2]|0,h[3]);
  if(i===0&&c.category===81)fields.push(c.extra??7);
  if(h[2]&0x800000)fields.push(...h[4]);if(h[2]&0x200)fields.push(slot(h[5]));
 }
 fields.push(255);return Uint8Array.from('M|SKL|'+fields.map(n=>(n>>>0).toString(16).toUpperCase()).join('|')+'|',ch=>ch.charCodeAt(0));
}
