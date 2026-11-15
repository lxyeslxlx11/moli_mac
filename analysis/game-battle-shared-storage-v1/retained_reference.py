"""Independent current continuation of two immutable stage219 traces;no product imports."""
from pathlib import Path
import hashlib,importlib.util,json,sys
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('retained219',R/'analysis/game-battle-attached-rid-v1/generate_vectors.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class CurrentBody(m.Body):
 def body_step(self):
  state=self.state
  if state==159:
   # Immutable219 element trace has newly born13a8=0 and no property bits.
   # 159 executes once and reaches graphic0; do not invent a fallback resource.
   assert self.flags&0x10000000 and not self.flags&0xf000000 and self.finish==0
   self.action=0;self.animate(self.body,1)
   for i in range(4):self.remove_link('element'+str(i))
   self.resource=0;self.flags&=~0x10000000;self.body['alpha']=0
   self.animate(self.body,1);self.actor_flags|=0x10000;self.finish=1
   return
  result=super().body_step()
  # Source44 reaches this change only after its actual end signal and cleanup.
  if state==44 and self.state==46 and self.flags&0x1000:
   self.scale=[1.,1.];self.flags&=~0x1000
  return result
m.Body=CurrentBody

def generate():
 original=R/'analysis/game-battle-attached-rid-v1/original-vectors.json';v=json.loads(original.read_text());animations,records,files=m.fixtures();assert files==v['files'];out=[]
 for name,prefix in [('B-status',121),('element',116)]:
  old=next(t for t in v['traces']if t['case']['name']==name);c=old['case'];w=m.World(animations,records,c);initial=w.project_casting();states=[];rasters=[];boundary=None;completed=[]
  for i in range(700):
   w.step();frame=w.project_casting();states.append(m.digest(frame))
   if any(n['animation']['graphicIndex']==0 and not n['deleted']and not n['actorFlags']&2 for n in frame['nodes']):boundary=dict(frame=i+1,code='LEGACY_BATTLE_FRAME_GEOMETRY');break
   if i==0 or i<4 or i%43==0 or any(h['complete']and not was for h,was in zip(w.handoffs,completed)):
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**m.render_reference(w,selector)))
   completed=[h['complete']for h in w.handoffs]
   if w.stopped or all(not b.busy for b in w.bodies.values())and all(n['kind']in['body','status','rider','attachment','indicator','status-skill-overlay','status-skill-field']for n in w.nodes):break
  assert states[:prefix]==old['states'][:prefix];assert initial==old['initial']
  out.append(dict(case=c,initial=initial,states=states,rasters=rasters,boundary=boundary,final=w.project_casting(),settled=all(not b.busy for b in w.bodies.values()),preserved_original_prefix_states=prefix,old_state_count=len(old['states'])))
  print(name,len(states),boundary,flush=True)
 result=dict(schema='moli.retained-rid-continuation-stage221.v1',authority='independent source44/159 continuation;original219 inputs/assets immutable;not complete shared-storage model',base_original=dict(path=str(original.relative_to(R)),sha256=hashlib.sha256(original.read_bytes()).hexdigest()),source_sha256='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',traces=out)
 (A/'retained-current-vectors.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
if __name__=='__main__':generate()
