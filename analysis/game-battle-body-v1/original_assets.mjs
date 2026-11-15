/** Patch four independently authored fixture files; no shipped game bytes or platform IO. */
export function battleBodyAssets(base,vectors){
  const replacements=new Map(vectors.files.map(row=>[row.path,row.bytesHex]));
  return {...base,files:base.files.map(row=>replacements.has(row.path)?{...row,bytesHex:replacements.get(row.path)}:{...row})};
}
