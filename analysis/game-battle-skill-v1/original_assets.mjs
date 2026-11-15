/** Four original synthetic asset files; source/delivery contains no shipped sprites or animations. */
export function skillAssets(base,vectors){const patch=new Map(vectors.files.map(r=>[r.path,r.bytesHex]));return{...base,files:base.files.map(r=>patch.has(r.path)?{...r,bytesHex:patch.get(r.path)}:{...r})};}
