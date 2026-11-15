import{readFileSync}from'node:fs';
import{verifyGuardModel}from'../game-battle-physical-guard-v1/verify_model.mjs';
export async function verifySelfGuardModel(api){
  const assets=JSON.parse(readFileSync(new URL('../game-battle-physical-guard-v1/original-vectors.json',import.meta.url)));
  const vectors=JSON.parse(readFileSync(new URL('./original-vectors.json',import.meta.url)));
  return verifyGuardModel(api,{...assets,...vectors},{mismatchDirectory:new URL('../../build/analysis/game-legacy-battle-self-guard-v1/',import.meta.url)});
}
