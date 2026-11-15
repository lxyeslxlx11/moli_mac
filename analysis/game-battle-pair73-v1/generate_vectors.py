#!/usr/bin/env python3
"""Independent retained424310class73first pairs and40a120consumer equations;no product imports."""
from pathlib import Path
from types import SimpleNamespace
import copy,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-pair73-v1'
s=importlib.util.spec_from_file_location('pair_prior',A.parent/'game-battle-chain260-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
anime=prior.anime;skill=prior.skill;f=prior.f;digest=prior.digest;signed=prior.signed;lookahead=prior.lookahead
def lookahead(words,start,actor):
 at=start
 def number():
  nonlocal at
  n=words[at]if at<len(words)else 0;at+=1;return n
 def mapped(n):return 20 if n==50 else 21 if n==51 else n
 for _ in range(1024):
  current=mapped(number())
  if current==255:return -1
  target=mapped(number());flags=number()&0xffffffff
  if not flags&0x1010:return -1
  if current==actor:return target
  for _ in range(1+(3 if flags&0x800000 else 0)):number()
 return None
CHARGE=set()
mapped=lambda n:50 if n==20 else 51 if n==21 else n
def words(c):
 out=[c['category']*100+c['level'],c['cost'],0];ends=[]
 for i,h in enumerate(c['hits']):
  a,t,flags,value=h[:4];out.extend([mapped(a),mapped(t),signed(flags),value])
  if flags&0x800000:out.extend(h[4])
  if flags&512:out.append(mapped(h[5]))
  if i==0 and c['category']==94:out.append(c.get('scalar',0))
  ends.append(len(out))
 out.append(255);return out,ends

def queues(c):
 rows={};principal=c['hits'][0][0];wire,ends=words(c)
 def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={}))
 def act(s,*v):row(s)['actions'].extend(v)
 def put(s,t,flags,amount,extra=None):row(s)['tuples'].append([t,signed(flags),amount]+([]if extra is None else[extra]))
 def own(s):row(s)['assignments']['physicalFamily']=1
 def guard(a,t,g,flags,amount):
  own(t);own(g);act(a,72);put(a,g,flags,amount);act(a,24,71,0,24)
  act(g,0);put(g,t,flags,amount);row(g)['assignments'].update(pairedTarget=t,effectResource=0xfc,messageResource=0x5748);act(g,39,78,67,34,73,7,4,42,71,10,74,72);put(g,t,flags,amount)
  act(t,0,27);put(t,a,flags,amount);act(t,71,72,62,1,11)
 def raw(s,t,flags,amount,fourth=0):put(s,t,flags,amount,fourth)
 def metadata(a,t,flags,rid):
  if rid is None:return
  saved=row(a)['tuples'][-1][:]
  if len(saved)==3:
   index=len(row(a)['tuples'])-1;old=c.get('initialFourths',{}).get(str(a),[]);saved.append(old[index]if index<len(old)else 0)
  raw(a,t,flags,rid[0],rid[1]);raw(a,t,flags,rid[2]);row(a)['tuples'].append(saved)
 def toward(t,n):act(t,3);raw(t,n,0,0);act(t,72)
 def release(t,flags,amount,n):
  own(t)
  if amount==0:act(t,35)
  act(t,71,72)
  if flags&0xe000:
   if n<0:act(t,11)
   else:toward(t,n)
  if not flags&0x20:act(t,38)
  if amount==0:
   if n<0:act(t,11)
   else:toward(t,n)
 row(principal)['assignments'].update(classCode=c['category'],skillLevel=c['level'],mpCost=c['cost']);act(principal,38)
 if c['category']==105:act(principal,156);row(principal)['assignments']['afterImageEnabled']=1
 if c['category']==257 or c['category']==262 and c['level']==9:act(principal,73)
 if c['category']==258:row(principal)['assignments']['rememberedPosition']=[318,270];act(principal,8,6,10)
 act(principal,53);dead=False
 for i,h in enumerate(c['hits']):
  a,t,flags,amount=h[:4];kind=c['category']if i==0 else-1;rid=h[4]if flags&0x800000 else None;g=h[5]if flags&0x200 else None
  if kind==5:flags&=~4
  own(a);act(a,24)
  if flags&0x1010:act(a,3,113)
  elif i==0 or a!=principal:act(a,7,205 if kind==262 else 9,10)
  else:act(a,205 if kind==262 else 3)
  act(a,242);raw(a,t,flags,amount,rid[0]if rid else 0)
  if g is not None:guard(a,t,g,flags,amount);t=g
  if kind in[5,84,87]:row(principal)['assignments']['messageResource']={5:0x5745,84:0x5747,87:0x5746}[kind];act(principal,66)
  if kind==105:act(a,97,98)
  if kind==94:row(a)['assignments'].update(statusScalar=c.get('scalar',0),effectResource=260);act(a,78,96)
  if kind in[257,259,262]and c['level']==9:act(a,72);put(a,{257:2,259:0,262:3}[kind],0,15);act(a,240);raw(a,t,flags,amount,rid[0]if rid else 0)
  metadata(a,t,flags,rid);act(a,14);act(t,0)
  if not flags&0x108:
   if flags&0x40:
    if flags&3:
     moving=a if flags&0x2000 else t;act(moving,32)
     if flags&0x2000:act(t,119)
     elif g is not None:act(t,71,72)
     act(moving,*([244]if moving==c['local']else[50,49]))
   elif(amount!=0 or kind==6)and flags&3:
    if flags&0x8000:act(t,121)
    elif flags&0x4000:act(t,120)
    elif flags&0x2000:act(a,160 if flags&2 else 26);act(t,119)
    else:act(t,160 if flags&2 else 26)
  n=lookahead(wire,ends[i],t)
  if n is None:raise ValueError('native local-cursor frontier')
  if g is not None:release(t,flags,amount,n)
  if(amount!=0 or kind==6 or flags&0x108)and not flags&0xc000:
   if not flags&0x2000:
    if t!=principal:act(t,11 if n<0 else 243)
    if flags&0x100:act(t,74)
   else:
    if a!=n:act(a if t==principal else t,11)
    if kind==257 or kind==262 and c['level']==9:act(principal,74)
  if flags&0x20:
   if not flags&0x2000:
    if t==principal:dead=True
    else:act(t,44)
   elif t==principal:act(a,44)
   else:dead=True
  if kind==81 and not flags&0xc108 and(not flags&0x2000 or not flags&0x20):act(a,62,78,155);row(a)['assignments'].update(effectResource=0x10f,numberValue=c.get('extra',7),numberStyle=5)
  if flags&0xe000:own(t)
  if(kind==257 or kind==262 and c['level']==9)and i+1<len(c['hits']):act(principal,74)
 if dead:
  if principal<20:act(principal,11,44)
 else:
  if principal<20:act(principal,7,11,10)
  if(c['category']==257 or c['category']==262 and c['level']==9)and len(c['hits'])==1:act(principal,74)
 return dict(principal=principal,rows=list(rows.values()))

fixtures=prior.fixtures
Body=prior.Body

class World(prior.World):
 def __init__(self,animations,records,c):
  self.sequence_cursor=0;self.sequence_used=False;self.direct=[];self.direct_used=False;self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=c.get('offset',[0,0])[:];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
  self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None);self.character_flags(c.get('C_flags',0));all_hits=[h for scenario in[c]+c.get('parallel',[])for h in scenario['hits']];slots={s for h in all_hits for s in h[:2]}|{h[5]for h in all_hits if h[2]&512}
  for slot in sorted(slots):
   b=Body(self,slot,c['resource']);self.bodies[slot]=b;b.after_image_enabled=b.after_image_counter=0;b.raw=c.get('flags',{}).get(str(slot),0);b.condition_scalar=0
   if b.raw&0x1000:b.scale=[f(1.3),f(1.3)]
   if b.raw&0x3f0:self.condition(b,0x1adfb+(b.raw&0x3f0).bit_length()-5)
   if b.raw&0x800:self.toggle(b,True)
   for t in b.tuples:t[0]=-1
   for i,fourth in enumerate(c.get('initialFourths',{}).get(str(slot),[])):b.tuples[i][3]=fourth
  self.plans=[queues(scenario)for scenario in[c]+c.get('parallel',[])];self.plan=dict(principal=self.plans[0]['principal'],rows=[row for plan in self.plans for row in plan['rows']]);names={'classCode':'category','skillLevel':'level','mpCost':'cost','messageResource':'message','effectResource':'effect','statusScalar':'condition_scalar','afterImageEnabled':'after_image_enabled','pairedTarget':'pairedTarget','numberValue':'number_value','numberStyle':'number_style'}
  for row in self.plan['rows']:
   b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuple_read=0;b.tuple_write=len(row['tuples'])
   for i,t in enumerate(row['tuples']):b.tuples[i][:len(t)]=t;b.tuples[i+1][0]=-1
   for key,value in row['assignments'].items():
    if key!='physicalFamily':setattr(b,names[key],copy.deepcopy(value))
  for plan in self.plans:
   b=self.bodies[plan['principal']];b.state=b.actions[0]
 def step(self):
  self.callback_priorities=None;self.capture_callback_priorities=True;super().step();self.capture_callback_priorities=False
  if self.callback_priorities is not None:
   for n in self.nodes:n['drawPriority']=self.callback_priorities[n['id']]
  return self.project_casting()
 def project_casting(self):
  p=super().project_casting()
  # Portable frame failure does not commit computed depth priorities. This is not native pixel acceptance.
  if getattr(self,'capture_callback_priorities',False)and self.callback_priorities is None and any(n['animation']['graphicIndex']==0 and not n['deleted']and not n['actorFlags']&2 for n in p['nodes']):self.callback_priorities={n['id']:n['drawPriority']for n in self.nodes}
  for row in p['bodies']:row['statusScalar']=self.bodies[row['slot']].condition_scalar
  if self.sequence_used:p['physicalSequence']=dict(cursor=self.sequence_cursor)
  return p

MASKS=[0,1,3,4,0x400,0x404,8,0x100,0x108,0x20,0x21,0x23,0x40,0x41,0x2041,0x4001,0x8001,0x6003,0xc003,0xe003,0x2001,0x10000000,0x10000001,0x800001,0x800021,0x11,0x1001,0x200001,0x100001]
def case(name,level=0,mask=1,value=12,caster=0,target=10,guardian=None,**extra):
 hit=[caster,target,mask|(512 if guardian is not None else 0),value,[100040,100041,100050]if mask&0x800000 else None]
 if guardian is not None:hit.append(guardian)
 return dict(dict(name=name,category=73,variant=0,level=level,caster=caster,cost=4,local=0,resource=100114,scalar=0,hits=[hit]),**extra)
def cases(quick):
 out=[case('level-'+str(level),level)for level in range(10)]
 if quick:return out+[case('guard',guardian=12),case('RID',mask=0x800001),case('reflect',mask=0x2001)]
 for level in[0,9]:
  for mask in MASKS:out.append(case(f'mask-{level}-{mask:x}',level,mask))
 for name,kwargs in[
  ('guard',dict(guardian=12)),('guard-RID',dict(guardian=12,mask=0x800001)),('guard-zero',dict(guardian=12,value=0)),('guard-reflect',dict(guardian=12,mask=0x2001)),('guard-heal',dict(guardian=12,mask=0x4001)),('guard-skip',dict(guardian=12,mask=0x8001)),('guard-alias-caster',dict(guardian=0)),('guard-alias-target',dict(guardian=10)),('guard-RID-stale-fourth',dict(guardian=12,mask=0x800001,initialFourths={'0':[0,0x11223344]})),('self',dict(target=0)),('self-zero',dict(target=0,value=0)),('self-KO',dict(target=0,mask=0x21)),('self-dodge',dict(target=0,mask=8)),('opposite',dict(caster=10,target=0,local=10)),('slot20',dict(caster=20)),('slot21',dict(caster=21)),('MP-zero',dict(cost=0)),('MP-negative',dict(cost=-7)),('MP-clamp',dict(cost=2147483647)),('zero',dict(value=0)),('zero-miss',dict(value=0,mask=0x10000001)),('negative',dict(value=-7)),('min',dict(value=-2147483648)),('max',dict(value=2147483647)),('offset',dict(offset=[11,-7])),('scaled',dict(flags={'0':0x1000,'10':0x1000})),('existing-status',dict(flags={'10':32})),('preview',dict(resource=100112)),('no-final-signal',dict(resource=100113)),('stress-signals',dict(resource=100110)),('suffix',dict(hits=[[0,10,1,12,None],[0,11,1,7,None]])),('counter',dict(hits=[[0,10,1,12,None],[10,0,0x11,7,None]])),('guard-followup-RID',dict(hits=[[0,10,0x201,12,None,12],[0,11,0x800001,7,[100040,100041,100050]]])),('RID-followup-guard',dict(hits=[[0,10,0x800001,12,[100040,100041,100050]],[11,0,0x211,7,None,12]]))]:
  for level in[0,9]:out.append(case(name+'-'+str(level),level,**kwargs))
 assert len({c['name']for c in out})==len(out);return out
def main(quick=False):
 animations,records,files=fixtures();qs=[]
 if not quick:
  for level in range(10):
   for caster,target in[(0,10),(10,0),(20,10),(21,0)]:
    for mask in MASKS:
     for guard in[None,12,caster,target]:
      c=case('queue',level,mask,caster=caster,target=target,guardian=guard);qs.append(dict(case=c,fields=words(c)[0],expected_digest=digest(queues(c)['rows'])))
 traces=[];rgba=0
 for c in cases(quick):
  w=World(animations,records,c);initial=digest(w.owned());states=[];rasters=[];old_vitals=old_flags=None;boundary=None
  for i in range(1800):
   w.step();frame=w.project_casting();visible_zero=[n for n in frame['nodes']if n['animation']['graphicIndex']==0 and not n['deleted']and not n['actorFlags']&2]
   if visible_zero:boundary=dict(frame=i+1,code='LEGACY_BATTLE_FRAME_GEOMETRY',native_renderer_observed=False,reason='Portable reserved-graphic renderer remains unimplemented')
   states.append(digest(frame));vitals=[(b['slot'],b['vitals'])for b in frame['bodies']];flags=[n['actorFlags']for n in frame['nodes']]
   if boundary is None and(i<6 or i%37==0 or vitals!=old_vitals or flags!=old_flags):
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**prior.prior.prior.prior.prior.render_reference(w,selector)));rgba+=1
   old_vitals=copy.deepcopy(vitals);old_flags=flags[:]
   if w.stopped or boundary is not None:break
   if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in['body','status','rider','attachment','moving-numeric-afterimage','status-skill-overlay','status-skill-field']for n in w.nodes):break
  traces.append(dict(case=c,initialOwnedDigest=initial,states=states,rasters=rasters,renderBoundary=boundary,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),finalOwnedDigest=digest(w.owned()),final=frame));print(c['name'],len(states),traces[-1]['bodySettled'],w.stopped,flush=True)
 out=dict(schema='moli.pair73-reference-stage218.v1',authority='Independent retained native equations/authored assets;no product imports/original execution',files=files,geometry=records,queues=qs,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=rgba);dest=P/'quick-vectors.json'if quick else A/'original-vectors.json';dest.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(path=str(dest.relative_to(R)),queues=len(qs),scenarios=len(traces),states=out['frames'],RGBA=rgba)),flush=True)
if __name__=='__main__':main('--quick'in sys.argv)
