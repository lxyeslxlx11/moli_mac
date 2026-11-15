/** Original bytes and controlled read ports; no platform or shipped material. */
export function originalFiles(v){const files=new Map(v.files.map(r=>[r.path.toLowerCase(),Uint8Array.from(r.bytesHex.match(/../g)??[],x=>parseInt(x,16))])),calls=[],pending=[];let closed=false;
 const controls={hold:null,short:false,fail:false};
 const port=Object.freeze({async stat(path){if(closed)throw Error('closed fixture');calls.push({kind:'stat',path});return files.get(path.replace(/\\/g,'/').toLowerCase())?.length??null;},
  async read(path,offset,length){if(closed)throw Error('closed fixture');calls.push({kind:'read',path,offset,length});const raw=files.get(path.replace(/\\/g,'/').toLowerCase());if(!raw||controls.fail)throw Error('private fixture read detail');const result=raw.slice(offset,offset+length-(controls.short?1:0));
   if(controls.hold&&path.toLowerCase()===controls.hold.toLowerCase()){controls.hold=null;return new Promise((resolve,reject)=>pending.push(()=>controls.fail?reject(Error('private fixture read detail')):resolve(result)));}return result;}});
 return {port,files,calls,controls,pending,close(){closed=true;for(const b of files.values())b.fill(0);files.clear();}};
}
