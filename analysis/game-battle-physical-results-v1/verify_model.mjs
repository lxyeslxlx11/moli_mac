import {verifyGuardModel} from '../game-battle-physical-guard-v1/verify_model.mjs';
export const verifyResultModel=(api,v)=>verifyGuardModel(api,v,{queueCost:4,mismatchDirectory:new URL('../../build/analysis/game-battle-physical-results-v1/',import.meta.url)});
