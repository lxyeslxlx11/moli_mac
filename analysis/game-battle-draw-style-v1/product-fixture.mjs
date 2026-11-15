/** Extend only authored fixture action headers; preserve durations,frames andall wire fields. */
export function battleDrawStyleFiles(files,style){
 if(!['alpha','additive'].includes(style)||!Array.isArray(files))throw Error('Original drawstyle fixture selection');
 const indexRow=files.find(r=>r.path.toLowerCase()==='bin/animeinfo.bin'),dataRow=files.find(r=>r.path.toLowerCase()==='bin/anime.bin');
 if(!indexRow||!dataRow)throw Error('Original animation pair required');
 const index=Buffer.from(indexRow.bytesHex,'hex'),data=Buffer.from(dataRow.bytesHex,'hex'),chunks=[data],resources=[];let length=data.length,actions=0;
 if(index.length%12)throw Error('Original index alignment');
 for(let at=0;at<index.length;at+=12){const resource=index.readUInt32LE(at);if(![100010,100114].includes(resource))continue;let cursor=index.readUInt32LE(at+4);const count=index.readUInt16LE(at+8),version=index.readUInt16LE(at+10),out=[];resources.push(resource);index.writeUInt32LE(length,at+4);index.writeUInt16LE(1,at+10);
  for(let i=0;i<count;i++){const head=version===1?20:12;if(cursor+head>data.length)throw Error('Original header range');const frames=data.readUInt32LE(cursor+8),end=cursor+head+frames*10;if(end>data.length)throw Error('Original frame range');const next=Buffer.alloc(20);data.copy(next,0,cursor,cursor+12);if(head===20)data.copy(next,12,cursor+12,cursor+16);next.writeUInt16LE((next.readUInt16LE(14)&7)|(style==='additive'?8:0),14);next.writeUInt32LE(0x8090c0ff,16);out.push(next,data.subarray(cursor+head,end));cursor=end;actions++;}
  const bytes=Buffer.concat(out);chunks.push(bytes);length+=bytes.length;
 }
 if(!actions)throw Error('No selected original fixture actors');
 const replacement=new Map([[indexRow.path,index.toString('hex')],[dataRow.path,Buffer.concat(chunks).toString('hex')]]);
 return{files:files.map(r=>replacement.has(r.path)?{...r,bytesHex:replacement.get(r.path)}:r),receipt:{stage:295,originalSyntheticOnly:true,style,resources,actions,color:0x8090c0ff,newHeaders:20,wireFieldsUnchanged:true}};
}
