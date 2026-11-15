import{specialPairsProjection}from'../game-battle-special-pairs-v1/projection.mjs';
export{specialPairsDigest as sequenceDigest,specialPairsOwned as sequenceOwned}from'../game-battle-special-pairs-v1/projection.mjs';
export function sequenceProjection(owner){const p=specialPairsProjection(owner),s=owner.copyPlayback().physicalSequence;if(s)p.physicalSequence={...s};return p;}
