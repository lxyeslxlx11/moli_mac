/** Original numeric/indexed-image fixtures. No platform API or shipped asset. */
export function resources(api,animationVectors){
 const {createLegacyGameAnimationCatalog,createLegacyGameGraphicCatalog,createLegacyGamePalette32,decodeLegacyGameRD,prepareLegacyGameSprite}=api;
 const bytes=hex=>Uint8Array.from(hex.match(/../g)??[],x=>parseInt(x,16)),animations=createLegacyGameAnimationCatalog(animationVectors.groups.map(g=>Object.fromEntries(Object.entries(g).map(([k,x])=>[k.endsWith('Hex')?k.slice(0,-3):k,k.endsWith('Hex')?bytes(x):x]))));
 const indices=[1002,1003,1004,3000],raw=new Uint8Array(indices.length*40),v=new DataView(raw.buffer),cache=new Map();
 for(let row=0;row<indices.length;row++){const i=indices[row],at=row*40;v.setInt32(at,i,true);v.setInt32(at+12,i%7-3,true);v.setInt32(at+16,i%5-2,true);v.setUint32(at+20,4*(i%3+1),true);v.setUint32(at+24,i%4+2,true);v.setUint32(at+32,0xabcdef01,true);v.setUint32(at+36,i===1003?1:i===3000?30000:i+20000,true);}
 const graphics=createLegacyGameGraphicCatalog([raw],{includeImages:true}),rgb=new Uint8Array(768);rgb.set([13,31,61],3);rgb.set([97,127,151],6);rgb.set([173,193,223],9);const palette=createLegacyGamePalette32(rgb,'explicit-rgb');
 const geometry=q=>{const g=q.kind==='index'?graphics.imageAt(q.value):graphics.image(q.value);return{index:g.index,originX:g.originX,originY:g.originY,width:g.width,height:g.height};};
 const sprite=({index})=>{if(!cache.has(index)){const g=graphics.imageAt(index),raw=new Uint8Array(16+g.width*g.height),v=new DataView(raw.buffer);raw.set([82,68]);v.setInt32(4,g.width,true);v.setInt32(8,g.height,true);v.setUint32(12,raw.length,true);
   for(let i=0;i<g.width*g.height;i++)raw[16+i]=(i+index)%5===0?0:1+(i+index)%3;const image=decodeLegacyGameRD(raw);try{cache.set(index,prepareLegacyGameSprite(image,palette));}finally{image.close();}}return cache.get(index);};
 return{animations,graphics,geometry,sprite,close(){cache.forEach(x=>x.close());palette.close();graphics.close();animations.close();}};
}
