/** Independently authored synthetic RD/animation files. No shipped sprites or program bytes. */
export function castingAssets(base,vectors){const replacements=new Map(vectors.files.map(r=>[r.path,r.bytesHex]));return{...base,files:base.files.map(r=>replacements.has(r.path)?{...r,bytesHex:replacements.get(r.path)}:{...r})};}
