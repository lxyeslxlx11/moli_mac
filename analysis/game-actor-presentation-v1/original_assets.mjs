/** Replace only four original synthetic Anime/AP files; no vendor art or executable bytes. */
export function presentationAssets(base,vectors){const replacements=new Map(vectors.files.map(r=>[r.path,r.bytesHex]));return {...base,files:base.files.map(row=>replacements.has(row.path)?{...row,bytesHex:replacements.get(row.path)}:{...row})};}
