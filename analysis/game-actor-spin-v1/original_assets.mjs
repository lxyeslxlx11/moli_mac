/** Extend only two original synthetic animation files with the independently encoded source-spin fixture. */
export function spinAssets(base,vectors){
  const replacements=new Map(vectors.files.map(r=>[r.path,r.bytesHex]));
  return {...base,files:base.files.map(row=>replacements.has(row.path)?{...row,bytesHex:replacements.get(row.path)}:{...row})};
}
