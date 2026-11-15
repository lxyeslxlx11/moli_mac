/** Original resource fixture extension: one unused source lookup probe; existing image/animation ordinals stay unchanged. */
export function characterAssets(base) {
 const bytes=hex=>Uint8Array.from(hex.match(/../g)??[],x=>parseInt(x,16)),hex=b=>[...b].map(x=>x.toString(16).padStart(2,'0')).join('');
 return{...base,files:base.files.map(row=>{
  if(row.path!=='Bin/GraphicInfo.bin')return{...row};
  const before=bytes(row.bytesHex),after=new Uint8Array(before.length+40);after.set(before);after.set(before.subarray(0,40),before.length);const view=new DataView(after.buffer);view.setInt32(before.length,before.length/40,true);view.setUint32(before.length+36,0x3c39f,true);return{...row,bytesHex:hex(after)};
 })};
}
export function contentGraphics(api,generation,atZero=false) {
 const probes=[0x3c39f,0x3bd9f,0x5727,0x56c4,0x55f2],count=generation<0?1:atZero?1:2,raw=new Uint8Array(count*40),view=new DataView(raw.buffer);
 if(generation>=0){const at=atZero?0:40;view.setInt32(at,atZero?0:1,true);view.setUint32(at+36,probes[4-generation],true);}
 return api.createLegacyGameGraphicCatalog([raw]);
}
