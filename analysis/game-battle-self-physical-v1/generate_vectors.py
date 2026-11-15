#!/usr/bin/env python3
"""Independent fixed37c4 saved-self/216 equations;authored bytes,no product imports."""
from pathlib import Path
from types import SimpleNamespace
import copy,importlib.util,json,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-self-physical-v1'
s=importlib.util.spec_from_file_location('self_physical_prior',A.parent/'game-battle-projectile-results-v1/generate_vectors.py');positive=importlib.util.module_from_spec(s);s.loader.exec_module(positive)
guard=positive.results.prior;anime=positive.anime;skill=positive.skill;f=positive.f;digest=positive.digest;signed=positive.signed

def queues(c):
 p=positive.queues(c)
 if c['category']!=266 or c['variant']!=2:return p
 caster=c['caster'];saved=None;first=0;foreign=None
 for h in c['hits']:
  if h[1]==caster:
   saved=h
   if h[2]&0x800000:first=h[4][0]
  elif h[2]&0x800000:foreign=h[4]
 if saved is None:return p
 rows={r['slot']:r for r in p['rows']}
 def row(slot):return rows.setdefault(slot,dict(slot=slot,actions=[],tuples=[],assignments={}))
 def act(slot,*values):row(slot)['actions'].extend(values)
 def raw(slot,target,flags,amount,extra=None):row(slot)['tuples'].append([target,signed(flags),amount]+([]if extra is None else[extra]))
 own=row(caster);assert own['actions'][-2:]==[72,23];del own['actions'][-2:];own['tuples'].pop()
 flags,amount=saved[2:4];recipient=caster;raw(caster,-1,flags,0,0);act(caster,72)
 if flags&0x200:
  recipient=saved[5];g=row(recipient);g['assignments'].update(physicalFamily=1,pairedTarget=caster,effectResource=252,messageResource=22344)
  act(recipient,0);raw(recipient,caster,flags,amount);act(recipient,39,78,67,34,73,7,4,42,71,10,74,62,24,71,72,0)
  act(caster,0,27,62,0,72,41);flags&=~512;raw(caster,recipient,flags,0,first)
 act(caster,23);row(recipient)['assignments']['physicalFamily']=1;raw(recipient,caster,flags,amount,first);raw(recipient,recipient,flags,amount,first)
 if flags&0x800000:
  if foreign is None:raise ValueError('self RID requires defined foreign RID tail')
  raw(recipient,recipient,flags,first,foreign[1]);raw(recipient,recipient,flags,foreign[2],0);raw(recipient,recipient,flags,amount,first)
 act(recipient,216);raw(caster,-1,0,0);act(caster,72)
 if flags&64:act(recipient,32,*([244]if recipient==c['local']else[50,49]))
 elif flags&32768:act(recipient,121)
 elif flags&16384:act(recipient,120)
 elif flags&8192:act(recipient,119)
 elif amount!=0:act(recipient,160 if flags&2 else 26,11)
 if flags&32:act(recipient,44)
 return dict(principal=caster,rows=list(rows.values()))

class Body(positive.Body,guard.Body):
 def body_step(self):
  if self.state!=216:return super().body_step()
  attacker=self.tuples[self.tuple_read][0];self.tuple_read+=1;target,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff;victim=self.w.bodies[target]
  primary=110000 if flags&4 else 110098 if flags&1024 else 110014 if self.level==9 else-1
  if not flags&4 and flags&1024:self.w.impact_node(self.body,110014)
  victim.attacker=attacker;victim.reaction_flags=flags;recipient=self.w.bodies[attacker if flags&8192 else target]
  if flags&0x200000:self.w.message(recipient,0x5739)
  if flags&0x400000:self.w.message(recipient,0x573a)
  if flags&0x800000:
   rid0,rid1=self.tuples[self.tuple_read+1][2:4];rid2=self.tuples[self.tuple_read+2][2];self.tuple_read+=3;self.w.message(recipient,0x5738);recipient.rider(rid0,rid1);recipient.attachment(rid2)
  if flags&0x1000000:self.w.message(recipient,0x573a)
  if flags&0x2000000:self.w.message(recipient,0x5738)
  if not flags&32768:
   if flags&16384:
    victim.vital_style(5,value)
    if value==0 and flags&0x10000000:self.w.message(victim,0x57bb)
    else:
     self.w.number_style(victim,value,5)
     if flags&2:self.w.message(victim,0x57b6)
   elif not flags&8192:
    victim.vital_style(6,value)
    if value!=0:
     if flags&2:self.w.impact_node(victim.body,0x1adb8)
     if primary>=0:self.w.impact_node(victim.body,primary)
    if flags&0x10000000:self.w.message(self.w.bodies[self.tuples[self.tuple_read][0]],0x57bb)
    else:
     self.w.number_style(victim,value,6)
     if flags&2:self.w.message(self,0x57b6)
    if flags&32:self.flags|=2;self.aux=1;self.w.slow=True
  self.pop();self.tuple_read+=1

class World(positive.World,guard.World):
 def __init__(self,animations,records,c):
  self.direct=[];self.direct_used=False;self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=c.get('offset',[0,0])[:];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
  self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None);self.character_flags(c.get('C_flags',0));slots={s for h in c['hits']for s in h[:2]}|{h[5]for h in c['hits']if h[1]==c['caster']and c['category']!=73 and h[2]&512}
  for slot in sorted(slots):
   b=Body(self,slot,c['resource']);self.bodies[slot]=b;b.after_image_enabled=b.after_image_counter=0;b.raw=c.get('flags',{}).get(str(slot),0);b.message=b.effect=0
   if b.raw&0x1000:b.scale=[f(1.3),f(1.3)]
   if b.raw&0x3f0:self.condition(b,0x1adfb+(b.raw&0x3f0).bit_length()-5)
   if b.raw&0x800:self.toggle(b,True)
   for t in b.tuples:t[0]=-1
   for i,fourth in enumerate(c.get('initialFourths',{}).get(str(slot),[])):b.tuples[i][3]=fourth
  self.plan=queues(c);names={'classCode':'category','skillLevel':'level','mpCost':'cost','physicalVariant':'variant','afterImageEnabled':'after_image_enabled','messageResource':'message','effectResource':'effect','rememberedPosition':'remember','numberValue':'number_value','numberStyle':'number_style','pairedTarget':'pairedTarget'}
  for row in self.plan['rows']:
   b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuple_read=0;b.tuple_write=len(row['tuples'])
   for i,t in enumerate(row['tuples']):b.tuples[i][:len(t)]=t;b.tuples[i+1][0]=-1
   for key,value in row['assignments'].items():
    if key!='physicalFamily':setattr(b,names[key],copy.deepcopy(value))
  b=self.bodies[self.plan['principal']];b.state=b.actions[0]
 def animate(self,n,mode):return guard.World.animate(self,n,mode)
 def anonymous(self,parent,role,flags,priority):
  b=super().anonymous(parent,role,flags,priority);b.__class__=Body;b.frozen=b.pairedTarget=0;b.message=b.effect=0;return b

def case(name,flags=1,value=12,guardian=None,level=0,caster=0,**extra):
 foreign=10 if caster<10 else 0;hit=[caster,caster,flags|(512 if guardian is not None else 0),value]
 if flags&0x800000 or guardian is not None:hit.append([100050,100040,100041]if flags&0x800000 else None)
 if guardian is not None:hit.append(guardian)
 before=[caster,foreign,0x800001 if flags&0x800000 else 1,7]+([[100040,100041,100050]]if flags&0x800000 else[])
 return dict(dict(name=name,category=266,variant=2,level=level,caster=caster,cost=4,local=0,resource=100090,hits=[before,hit]),**extra)
def cases(quick):
 out=[case(name,flags=flags,guardian=guardian)for name,flags,guardian in [('self-damage',1,None),('self-heal',0x4001,None),('self-guard',1,11),('self-guard-heal',0x4001,11)]]
 if quick:return out
 for level in[0,9]:
  for guardian in[None,11]:
   for name,flags,value in [('ordinary',1,12),('critical',3,12),('no-hit-bit',0,12),('zero',0,0),('critical-zero',2,0),('heal-zero',0x4001,0),('heal',0x4001,12),('suppress',0x2001,12),('skip',0x8001,12),('heal-suppress',0x6003,12),('skip-heal',0xc001,12),('all-results',0xe003,12),('negative',1,-7),('min',1,-2147483648),('max',1,2147483647),('heal-negative',0x4001,-7),('heal-min',0x4001,-2147483648),('heal-max',0x4001,2147483647),('heal-clamp',0x4001,90),('dodge',8,12),('defense',0x100,12),('immune',0x108,12),('primary4',5,12),('primary400',0x401,12),('primary-priority',0x405,12),('heal-message',0x10004003,12),('heal-zero-message',0x10004003,0),('damage-message',0x10000003,12),('metadata',0x3600001,12),('RID',0x800001,9),('heal-RID',0x804001,9),('suppress-RID',0x802001,9),('composite-RID',0x806001,9),('KO',0x21,90),('scatter',0x41,12)]:
    out.append(case('%s-level%d-%s'%(name,level,'guard'if guardian is not None else'self'),flags,value,guardian,level))
 for category in[0,6,73,95,105,258,266]:
  for variant in[1,2,3]:
   if category==266 and variant==2:continue
   c=case('ignored-self-scalar-class%d-v%d'%(category,variant),0x201,12,11);c.update(category=category,variant=variant);out.append(c)
 out.extend([case('self-before-foreign',hits=[[0,0,3,9],[0,10,1,7]]),case('last-self-only',hits=[[0,0,3,9],[0,10,1,7],[0,0,1,5]]),case('self-saved-RID-first',hits=[[0,10,0x800001,7,[100040,100041,100050]],[0,0,0x800001,9,[100050,100040,100041]],[0,0,1,6]]),case('self-RID-last-foreign-tail',hits=[[0,10,0x800001,7,[100040,100041,100050]],[0,0,0x800001,9,[100050,100040,100041]],[0,11,0x800001,5,[100050,100040,100041]]]),case('self-guard-alias-caster',guardian=0),case('self-guard-alias-foreign',guardian=10),case('self-guard-opposite',guardian=1,caster=10),case('self-slot20',caster=20),case('self-slot21-guard',caster=21,guardian=11),case('self-offset',guardian=11,offset=[11,-7]),case('self-old-fourth',guardian=11,initialFourths={'11':[0x11223344],'0':[0,0,0,0x55667788]})])
 assert len(out)==len({c['name']for c in out});return out

def main(quick=False):
 animations,records,files=positive.results.fixtures();qs=[]
 if not quick:
  for level in range(10):
   for caster,foreign,g in[(0,10,11),(10,0,1),(20,0,10),(21,10,0)]:
    for guardian in[None,g]:
     for flags in[0,1,2,3,8,0x100,0x108,0x10,0x1000,0x40,0x41,0x20,0x21,0x2001,0x4001,0x8001,0x6003,0xa003,0xc003,0xe003,0x401,0x405,0x10000003,0x10004003,0x800001,0x804001,0x802001,0x806001]:
      c=case('queue',flags,12,guardian,level,caster);qs.append(dict(case=c,expected_digest=digest(queues(c)['rows'])))
  for category in positive.CLASSES:
   for variant in[1,2,3]:
    if category==266 and variant==2:continue
    for flags in[0x200,0x201,0x203,0x208,0x300,0x308,0x2201,0x4201]:
     c=case('queue',flags,12,11);c.update(category=category,variant=variant);qs.append(dict(case=c,expected_digest=digest(queues(c)['rows'])))
 traces=[]
 for c in cases(quick):
  w=World(animations,records,c);initial=digest(w.owned());states=[];rasters=[];old_vitals=None
  for i in range(1000):
   w.step();frame=w.project_casting();states.append(digest(frame));vitals=[(b['slot'],b['vitals'])for b in frame['bodies']]
   if i<4 or i%47==0 or vitals!=old_vitals:
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**positive.prior.render_reference(w,selector)))
   old_vitals=copy.deepcopy(vitals)
   if w.stopped:break
   if all(b.detached or not b.busy for b in w.bodies.values())and not any(n['kind']=='physical-arrow'or n['kind']=='body'and n['owner'].role for n in w.nodes)and all(n['kind']in['body','status','rider','attachment','status-skill-overlay','status-skill-field','moving-numeric-afterimage']for n in w.nodes):break
  traces.append(dict(case=c,initialOwnedDigest=initial,states=states,rasters=rasters,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),finalOwnedDigest=digest(w.owned()),final=frame));print(c['name'],len(states),traces[-1]['bodySettled'],w.stopped,flush=True)
 out=dict(schema='moli.self-physical-reference-stage211.v1',authority='Independent retained native source equations and authored bytes;no product imports or original execution',files=files,geometry=records,queues=qs,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces));dest=P/'quick-vectors.json'if quick else A/'original-vectors.json';dest.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(path=str(dest.relative_to(R)),queues=len(qs),scenarios=len(traces),states=out['frames'],RGBA=out['rgbaFrames'])),flush=True)
if __name__=='__main__':main('--quick'in sys.argv)
