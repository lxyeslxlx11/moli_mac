/** Only original synthetic animation descriptors; all prior fixture file ordinals remain stable. */
export function rideAssets(base,vectors){const replacements=new Map(vectors.files.map(r=>[r.path,r.bytesHex]));return {...base,files:base.files.map(row=>replacements.has(row.path)?{...row,bytesHex:replacements.get(row.path)}:{...row})};}
