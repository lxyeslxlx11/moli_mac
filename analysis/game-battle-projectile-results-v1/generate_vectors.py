#!/usr/bin/env python3
"""Independent fixed37c4 positive-result equations;authored assets,no product imports."""
from pathlib import Path
import copy,importlib.util,json,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-projectile-results-v1'
s=importlib.util.spec_from_file_location('positive_result_prior',A.parent/'game-battle-physical-results-v1/generate_vectors.py');results=importlib.util.module_from_spec(s);s.loader.exec_module(results)
prior=results.prior.prior;anime=results.anime;skill=results.skill;f=results.f;digest=results.digest;signed=results.signed
CLASSES=[0,1,3,5,6,73,75,76,77,78,79,80,81,84,85,87,94,95,96,105,110,257,258,259,260,262,266]

def queues(c):
 caster=c['caster'];rows={};related=c['category']==73
 def row(slot):return rows.setdefault(slot,dict(slot=slot,actions=[],tuples=[],assignments={}))
 def act(slot,*values):row(slot)['actions'].extend(values)
 own=row(caster);own['assignments'].update(classCode=c['category'],skillLevel=c['level'],physicalVariant=c['variant'],physicalFamily=1)
 if not related:own['assignments']['mpCost']=c['cost'];act(caster,38)
 if c['category']not in[73,94,96]:act(caster,147)
 if c['category']==105:own['assignments']['afterImageEnabled']=1
 if c['category']==258:own['assignments']['rememberedPosition']=[318,270];act(caster,8,6,10)
 if c['category']in[258,259,266]and c['level']==9:own['tuples'].append([3 if c['category']==258 else 5 if c['category']==259 else 0,0,15,0]);act(caster,240)
 if not related:act(caster,53)
 act(caster,24,*([18]if c['variant']==3 else[15,41,23]if c['variant']==2 and related else[15,41]if c['variant']==2 else[15]))
 for _,target,flags,value,*rest in c['hits']:
  if target==caster and not related:continue
  packed=[target,signed(flags),value,rest[0][0]if flags&0x800000 else 0];own['tuples'].append(packed)
  if flags&0x800000:
   a,b,d=rest[0];own['tuples'].extend([[target,signed(flags),a,b],[target,signed(flags),d,0],packed[:]])
  act(target,0)
  if flags&0xe000:row(target)['assignments']['physicalFamily']=1
  if not flags&0x108:
   if flags&0x40:act(target,32,*([244]if target==c['local']else[50,49]))
   elif value!=0 and flags&3:
    if flags&0x8000:act(target,121)
    elif flags&0x4000:act(target,120)
    elif flags&0x2000:act(target,119)
    elif related or not flags&0x20000000:act(target,28 if c['category']==95 and not flags&0x20 else 160 if flags&2 else 26)
  if(value!=0 or flags&0x108)and not flags&(0xe000 if related else 0x2000e000)and(c['category']!=95 or flags&0x20):
   act(target,11)
   if c['category']!=95 and flags&0x100:act(target,74)
  if flags&0x20:act(target,44)
 if not related:own['tuples'].append([-1,0,0,0]);act(caster,72,*([23]if c['variant']==2 else[]))
 return dict(principal=caster,rows=list(rows.values()))

class Body(prior.Body):
 def metadata(self):
  target,flags,_,_=self.tuples[self.tuple_read];flags&=0xffffffff;recipient=self.w.bodies[self.slot if flags&0x2000 else target]
  if flags&0x200000:self.w.message(recipient,0x5739)
  if flags&0x400000:self.w.message(recipient,0x573a)
  if flags&0x800000:
   rid0,rid1=self.tuples[self.tuple_read+1][2:4];rid2=self.tuples[self.tuple_read+2][2];self.tuple_read+=3;self.w.message(recipient,0x5738);recipient.rider(rid0,rid1);recipient.attachment(rid2)
  if flags&0x1000000:self.w.message(recipient,0x573a)
  if flags&0x2000000:self.w.message(recipient,0x5738)
  if self.category==259 and self.level==9:self.w.tile(0,15)
 def body_step(self):
  if self.state in[119,120,121]:
   kind=self.state-119
   if not self.flags&0x60:self.animate(self.body,0)
   if self.skill==0:self.w.result_charge(self,kind)
   self.state=157;return
  return super().body_step()

class World(prior.World):
 def __init__(self,animations,records,c):
  super().__init__(animations,records,c);self.plan=queues(c)
  for b in self.bodies.values():b.__class__=Body;b.actions=[0,-1];b.read=0;b.write=-1;b.busy=0;b.state=0;b.tuples=[[-1,0,0,0]for _ in range(200)];b.tuple_read=b.tuple_write=0;b.frozen=b.pairedTarget=0;b.message=b.effect=0
  names={'classCode':'category','skillLevel':'level','mpCost':'cost','physicalVariant':'variant','afterImageEnabled':'after_image_enabled','rememberedPosition':'remember'}
  for row in self.plan['rows']:
   b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuple_write=len(row['tuples'])
   for i,t in enumerate(row['tuples']):b.tuples[i]=copy.deepcopy(t)
   for key,value in row['assignments'].items():
    if key!='physicalFamily':setattr(b,names[key],copy.deepcopy(value))
  b=self.bodies[self.plan['principal']];b.state=b.actions[0]
 def anonymous(self,parent,role,flags,priority):
  b=super().anonymous(parent,role,flags,priority);b.__class__=Body;return b
 def result_charge(self,b,kind):
  self.node(b,'physical-result-charge',resource=0x1ae1d+8*kind,flags=0x48000,position=[b.position[0],f(b.position[1]+int(b.body['q']['drawOffsetY']/2))],parent=b.body,screenSpace=True);b.skill=1
 def step_effect(self,n):
  if n['kind']=='physical-result-charge':
   if self.animate(n,1)==1:
    if not n['parent']['deleted']and n['owner'].skill:n['owner'].skill=2
    n['deleted']=True
   return
  return super().step_effect(n)
 def project_casting(self):
  p=super().project_casting()
  for row in p['bodies']:
   b=self.bodies[row['slot']];row.update(frozen=b.frozen,actionRead=b.read,actionWrite=b.write,tupleWrite=b.tuple_write,pairedTarget=b.pairedTarget,messageResource=b.message,effectResource=b.effect)
  return p
 def owned(self):
  return [dict(slot=b.slot,actions=b.actions+[0]*(200-len(b.actions)),actionRead=b.read,actionWrite=b.write,tuples=[x for t in b.tuples for x in t],tupleRead=b.tuple_read,tupleWrite=b.tuple_write)for b in self.bodies.values()if not b.detached]

def case(name,category=0,variant=1,level=0,flags=0x2001,value=12,caster=0,hits=None,**extra):
 return dict(dict(name=name,category=category,variant=variant,level=level,caster=caster,cost=4,local=0,resource=100090,hits=hits or[[caster,10 if caster<10 else 0,flags,value]+([[100040,100041,100050]]if flags&0x800000 else[])]),**extra)
def cases(quick):
 out=[case('%s-variant%d'%(name,variant),variant=variant,flags=mask|1)for variant in[1,2,3]for mask,name in[(0x2000,'suppress'),(0x4000,'heal'),(0x8000,'skip'),(0x6000,'heal-suppress')]]
 if quick:return out
 for category in CLASSES:
  for variant in[1,2,3]:
   for flags,name in[(0x2001,'suppress'),(0x4001,'heal'),(0x8001,'skip'),(0x6001,'heal-suppress')]:out.append(case('class%d-%s-variant%d'%(category,name,variant),category,variant,flags=flags))
 for category in[258,259,266]:
  for variant in[1,2,3]:
   for mask in[0x2000,0x4000,0x8000,0xe000]:out.append(case('class%d-level9-mask%x-variant%d'%(category,mask,variant),category,variant,9,flags=mask|1))
 edges=[('suppress-zero',0,0x2001,0),('heal-zero',0,0x4001,0),('skip-zero',0,0x8001,0),('heal-critical',0,0x4003,12),('suppress-critical',0,0x2003,12),('skip-critical',0,0x8003,12),('heal-negative',0,0x4001,-7),('heal-min',0,0x4001,-2147483648),('heal-max',0,0x4001,2147483647),('heal-clamp',0,0x4001,90),('suppress-RID',0,0x802001,9),('heal-RID',0,0x804001,9),('composite-RID',0,0x806001,9),('ignored10',0,0x11,12),('ignored1000',0,0x1001,12),('ignored200',0,0x201,12),('ignored-combined',0,0x1201,12),('priority-a003',0,0xa003,12),('priority-c003',0,0xc003,12),('priority-e003',0,0xe003,12),('extended-heal-suppress',0,0x30001,12),('extended-all',0,0x70001,12),('heal-no-number',0,0x10004001,12),('composite-no-number',0,0x10006003,12),('deflect-before-heal',0,0x20004001,12),('condition110-heal',110,0x84001,12),('condition259-heal',259,0x84001,12),('heal-class6',6,0x4001,12),('suppress-class6',6,0x2001,12),('skip-class6',6,0x8001,12),('heal-dodge-before-defense',0,0x4108,12),('heal-defense',0,0x4100,12),('heal-KO-flag',0,0x4021,12),('suppress-scatter',0,0x2041,12)]
 for variant in[1,2,3]:
  for name,category,flags,value in edges:out.append(case(name+'-variant'+str(variant),category,variant,flags=flags,value=value))
  out.extend([case('multi-result-variant'+str(variant),variant=variant,hits=[[0,10,0x6003,9],[0,11,0x2001,7],[0,12,0x8001,6]]),case('repeat-heal-variant'+str(variant),variant=variant,hits=[[0,10,0x4001,7],[0,10,0x4003,9]]),case('RID-followup-variant'+str(variant),259,variant,9,hits=[[0,10,0x806001,9,[100040,100041,100050]],[0,11,1,8]]),case('self73-ignored200-variant'+str(variant),73,variant,hits=[[0,0,0x201,12]]),case('opposite-heal-variant'+str(variant),variant=variant,caster=10,flags=0x4001),case('local-scatter-variant'+str(variant),variant=variant,caster=10,flags=0x2041),case('heal-offset-variant'+str(variant),variant=variant,flags=0x4001,offset=[11,-7])])
 assert len({c['name']for c in out})==len(out)
 return out
def main(quick=False):
 animations,records,files=results.fixtures();qs=[]
 if not quick:
  for category in CLASSES:
   for level in range(10):
    for variant in[1,2,3]:
     for caster,target in[(0,10),(10,0)]:
      for mask in[0,0x2000,0x4000,0x8000,0x6000,0xa000,0xc000,0xe000]:
       for suffix in[1,3,8,0x100,0x108,0x20,0x21,0x41,0x800001,0x100001,0x80001,0x10000001,0x11,0x1001,0x201,0x1201]:
        flags=mask|suffix;c=case('queue',category,variant,level,caster=caster,flags=flags);qs.append(dict(input=[category,level,variant,caster,target,flags],expected_digest=digest(queues(c)['rows'])))
 traces=[]
 for c in cases(quick):
  w=World(animations,records,c);initial=digest(w.owned());states=[];rasters=[];old_vitals=None
  for i in range(1000):
   frame=w.step();states.append(digest(frame));vitals=[b.vitals[:]for b in w.bodies.values()]
   if i<4 or i%43==0 or vitals!=old_vitals:
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**prior.render_reference(w,selector)))
   old_vitals=copy.deepcopy(vitals)
   if w.stopped:break
   if all(b.detached or not b.busy for b in w.bodies.values())and not any(n['kind']=='physical-arrow'or n['kind']=='body'and n['owner'].role for n in w.nodes)and all(n['kind']in['body','status','rider','attachment','status-skill-overlay','status-skill-field','moving-numeric-afterimage']for n in w.nodes):break
  traces.append(dict(case=c,initialOwnedDigest=initial,states=states,rasters=rasters,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),finalOwnedDigest=digest(w.owned()),final=frame));print(c['name'],len(states),traces[-1]['bodySettled'],w.stopped,flush=True)
 out=dict(schema='moli.projectile-results-reference-stage210.v1',authority='Independent retained native source equations and authored bytes;no product imports or original execution',files=files,geometry=records,queues=qs,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces));destination=P/'quick-vectors.json'if quick else A/'original-vectors.json';destination.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(path=str(destination.relative_to(R)),queues=len(qs),scenarios=len(traces),states=out['frames'],RGBA=out['rgbaFrames'])),flush=True)
if __name__=='__main__':main('--quick'in sys.argv)
