/** Pure original numeric image/map fixture factory; no shipped bytes or platform APIs. */
export function resources(api,v,animationVectors){
 const bytes=hex=>Uint8Array.from(hex.match(/../g)??[],x=>parseInt(x,16)),graphics=api.createLegacyGameGraphicCatalog([bytes(v.graphicBytesHex)],{includeImages:true}),cut=api.createLegacyGameCutCatalog(bytes(v.cutHex)),
  animations=api.createLegacyGameAnimationCatalog(animationVectors.groups.map(g=>Object.fromEntries(Object.entries(g).map(([k,x])=>[k.endsWith('Hex')?k.slice(0,-3):k,k.endsWith('Hex')?bytes(x):x]))));
 const rgb=new Uint8Array(768);rgb.set([13,31,61],3);rgb.set([97,127,151],6);rgb.set([173,193,223],9);const palette=api.createLegacyGamePalette32(rgb,'explicit-rgb'),sprites=new Map();
 const geometry=q=>{const g=q.kind==='index'?graphics.imageAt(q.value):graphics.image(q.value);return{index:g.index,originX:g.originX,originY:g.originY,width:g.width,height:g.height};};
 const sprite=({index})=>{if(!sprites.has(index)){const g=graphics.imageAt(index),raw=new Uint8Array(16+g.width*g.height),d=new DataView(raw.buffer);raw.set([82,68]);d.setInt32(4,g.width,true);d.setInt32(8,g.height,true);d.setUint32(12,raw.length,true);
   for(let i=0;i<g.width*g.height;i++)raw[16+i]=(i+index)%5===0?0:1+(i+index)%3;const image=api.decodeLegacyGameRD(raw);try{sprites.set(index,api.prepareLegacyGameSprite(image,palette));}finally{image.close();}}return sprites.get(index);};
 return{graphics,cut,animations,geometry,sprite,close(){sprites.forEach(x=>x.close());palette.close();animations.close();cut.close();graphics.close();}};
}
export function mapBytes(width,height,planes){const raw=new Uint8Array(20+width*height*6),d=new DataView(raw.buffer);raw.set([77,65,80,1]);d.setUint32(12,width,true);d.setUint32(16,height,true);
 for(let p=0;p<3;p++)for(let i=0;i<width*height;i++)d.setUint16(20+(p*width*height+i)*2,planes[p][i],true);return raw;}
export function actorRoots(rows,res){return rows.map(row=>{const command=row.command;if(command){const{index,...c}=command;return{...row,command:Object.freeze({sprite:res.sprite({index}),...c})};}return{...row,command:null};});}
