/** Exact optional local patch capabilities, shared by the local server and rendered browser controls. */
export function snapshotLauncherPatchOrigins(input){
  if(input===undefined)return null;
  if(!Array.isArray(input)||input.length<1||input.length>16)throw new TypeError('Expected explicit loopback patch origins.');
  const origins=[];
  for(const value of input){
    if(typeof value!=='string'||!/^http:\/\/127\.0\.0\.1:[1-9][0-9]{0,4}$/.test(value))throw new TypeError('Expected exact loopback patch origins.');
    const parsed=new URL(value);if(parsed.origin!==value||Number(parsed.port)<1||Number(parsed.port)>65535||origins.includes(value))throw new TypeError('Expected unique loopback patch origins.');origins.push(value);
  }
  return Object.freeze(origins);
}
export function snapshotLauncherPatchRuntime(input){
  if(input===undefined)return null;
  if(!input||input.schema!=='moli.local-game-patch.v1')throw new TypeError('Unsupported local patch settings.');
  return Object.freeze({schema:input.schema,allowedOrigins:snapshotLauncherPatchOrigins(input.allowedOrigins)??(()=>{throw new TypeError('Patch origins missing.');})()});
}
