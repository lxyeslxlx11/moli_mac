import{attachedRIDFixture}from'../game-battle-attached-rid-v1/fixture.mjs';import{combinationMotion}from'./reference.mjs';
export async function combinationFixture(api,v,c,{commands=false}={}){const base={...c,category:73,variant:0,level:0,caster:c.members[0][0],cost:4,hits:c.members.map(h=>[h[0],c.target,h[1],h[2],h[3]??null]),rids:c.rids??[],mounts:c.mounts??[]},f=await attachedRIDFixture(api,v,base,{commands});f.c=c;f.raw=combinationMotion(c);f.command=api.decodeLegacyGameBattleMotion(f.raw).commands[0];f.commandPhase=1;f.waitCounter=0;const bodyStep=f.step;
 if(!commands)f.step=()=>{const state=f.owner.copyCombination(1);
  if(f.commandPhase===1&&state.counter>=state.order.length){f.owner.resetCombinationCounter(1);f.commandPhase=2;}
  else if(f.commandPhase===2&&f.owner.activateNextCombination(1,c.controlFlags??0))f.commandPhase=3;
  else if(f.commandPhase===3){const result=f.owner.wait(f.command.dependencyMask,8,false,f.waitCounter,1,c.controlFlags??0);f.waitCounter=result.counter;if(result.ready){const b=f.owner.copy(c.target);if(b&&!(b.dynamicFlags&2))f.owner.reface(c.target);f.owner.releaseCombination(1);f.owner.resetQueues(f.command.dependencyMask,c.controlFlags??0);f.commandPhase=4;}}
  return bodyStep();};return f;}
