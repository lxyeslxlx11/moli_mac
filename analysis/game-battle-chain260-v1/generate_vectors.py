#!/usr/bin/env python3
"""Independent retained424310 first260 producer and actual201..204 equations;no product imports."""
from pathlib import Path
from types import SimpleNamespace
import copy,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-chain260-v1'
s=importlib.util.spec_from_file_location('pair_prior',A.parent/'game-battle-special-context-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
anime=prior.anime;skill=prior.skill;f=prior.f;digest=prior.digest;signed=prior.signed;lookahead=prior.lookahead
def words(c):
 out=[c['category']*100+c['level'],c['cost'],0];ends=[]
 for i,h in enumerate(c['hits']):
  a,t,flags,value=h[:4];out.extend([mapped(a),mapped(t),signed(flags),value])
  if flags&0x800000:out.extend(h[4])
  if flags&512:out.append(mapped(h[5]))
  if i==0 and flags&0x80000:
   n=c['nested'];out.append(mapped(n['target']))
   if n['target']==255:ends.append(len(out));return out,ends
   out.extend([signed(n['flags']),n['amount']])
   if n['flags']&0x800000:out.extend(n['resources'])
   if n['guard']is not None:out.append(mapped(n['guard']))
  ends.append(len(out))
 out.append(255);return out,ends
mapped=lambda n:50 if n==20 else 51 if n==21 else n

def queues(c):
 rows={};principal=c['hits'][0][0];wire,ends=words(c)
 def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={}))
 def act(s,*v):row(s)['actions'].extend(v)
 def raw(s,t,flags,amount,fourth=0):row(s)['tuples'].append([t,signed(flags),amount,fourth])
 def triple(s,t,flags,amount):row(s)['tuples'].append([t,signed(flags),amount])
 def own(s):row(s)['assignments']['physicalFamily']=1
 def guard(a,t,g,flags,amount):
  own(t);own(g);act(a,72);triple(a,g,flags,amount);act(a,24,71,0,24)
  act(g,0);triple(g,t,flags,amount);row(g)['assignments'].update(pairedTarget=t,effectResource=0xfc,messageResource=0x5748);act(g,39,78,67,34,73,7,4,42,71,10,74,72);triple(g,t,flags,amount)
  act(t,0,27);triple(t,a,flags,amount);act(t,71,72,62,1)
 def metadata(a,t,flags,rid):
  if rid is None:return
  saved=row(a)['tuples'][-1][:]
  if len(saved)==3:
   i=len(row(a)['tuples'])-1;old=c.get('initialFourths',{}).get(str(a),[]);saved.append(old[i]if i<len(old)else 0)
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
 def following(i,t):
  # The end-of-message NUL yields0 without advancing for each numeric call.
  found=lookahead(wire,ends[i],t)
  return -1 if found is None and ends[i]==len(wire)else found
 row(principal)['assignments'].update(classCode=260,skillLevel=c['level'],mpCost=c['cost']);act(principal,38,147,53);dead=False
 for i,h in enumerate(c['hits']):
  a,t,flags,amount=h[:4];rid=h[4]if flags&0x800000 else None;g=h[5]if flags&512 else None;kind=260 if i==0 else-1
  own(a);act(a,24)
  if flags&0x1010:act(a,3,113)
  elif i==0:act(a,203)
  elif a!=principal:act(a,7,9,10)
  else:act(a,3)
  if i==0:act(a,201)
  act(a,242);raw(a,t,flags,amount,rid[0]if rid else 0)
  if g is not None:guard(a,t,g,flags,amount);act(t,11);t=g
  n=c.get('nested')if i==0 and flags&0x80000 else None;nt=n['target']if n else-1
  if n and nt!=255 and n['guard']is not None:
   guard(a,nt,n['guard'],n['flags'],n['amount']);act(nt,11);nt=n['guard'];raw(a,t,flags,amount,rid[0]if rid else 0);act(a,72)
  if i==0 and c['level']==9:act(a,72);triple(a,1,0,15);act(a,240);raw(a,t,flags,amount,rid[0]if rid else 0)
  metadata(a,t,flags,rid);act(a,14);own(t);act(t,0)
  if not flags&0x108:
   if flags&0x40:
    if flags&3:
     moving=a if flags&0x2000 else t;act(moving,32)
     if flags&0x2000:act(t,119)
     elif g is not None:act(t,71,72)
     act(moving,*([244]if moving==c['local']else[50,49]))
   elif amount!=0 and flags&3:
    if flags&0x8000:act(t,121)
    elif flags&0x4000:act(t,120)
    elif flags&0x2000:act(a,160 if flags&2 else 26);act(t,119)
    elif n and nt!=255:
     nf=n['flags'];nv=n['amount'];nn=following(i,nt);act(t,204);raw(t,nt,nf,nv,n['resources'][0]if n['resources']else 0);metadata(t,nt,nf,n['resources']);own(nt);act(nt,0)
     if not nf&0x40:
      if nf&0x8000:act(nt,121)
      elif nf&0x4000:act(nt,120)
      elif nf&0x2000:act(nt,119)
      elif not nf&0x10000108:act(nt,160 if nf&2 else 26)
     elif nf&3:
      moving=t if nf&0x2000 else nt
      if nf&0x2000:act(t,201,32);act(nt,119)
      else:
       act(nt,32)
       if n['guard']is not None:act(nt,71,72)
      act(moving,*([244]if moving==c['local']else[50,49]))
     if n['guard']is not None:release(nt,nf,nv,nn)
     if nv!=0 or nf&0x108:
      if not nf&0x10000000:
       if n['guard']is None or nn<0:act(nt,11)
       else:toward(nt,nn)
      if nf&0x100:act(nt,74)
     if nf&0x20:
      if not nf&0x2000:
       if nt==principal:dead=True
       else:act(nt,44)
      elif nt==principal:act(nt,44)
      else:dead=True
    else:act(t,160 if flags&2 else 26)
  next_slot=following(i,t)
  if next_slot is None:raise ValueError('native local-cursor frontier')
  if g is not None:release(t,flags,amount,next_slot)
  if(amount!=0 or flags&0x108)and not flags&0xc000:
   if not flags&0x2000:
    if t!=principal:act(t,11 if next_slot<0 else 243)
    if flags&0x100:act(t,74)
   elif a!=next_slot:act(a if t==principal else t,11)
  if flags&0x20:
   if not flags&0x2000:
    if t==principal:dead=True
    else:act(t,44)
   elif t==principal:act(a,44)
   else:dead=True
 if principal<20:act(principal,*([11,44]if dead else[7,11,10]))
 return dict(principal=principal,rows=list(rows.values()))

def fixtures():
 _,records,source=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in source};index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin'])
 blocks=[anime.action(d,a,96,[(g,-1,1,[0,10002,0][i]if a==5 else 0)for i,g in enumerate([1002,1004,1005])])for d in range(8)for a in range(20)]
 index.extend(struct.pack('<IIHH',100114,len(data),len(blocks),0));data.extend(b''.join(blocks));files.update({'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data)})
 return anime.parse([dict(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0)]),records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]

class SourceContextBoundary(Exception):
 def __init__(self,code,slot,target):self.code=code;self.slot=slot;self.target=target

class Body(prior.Body):
 def body_step(self):
  if self.state==201:
   target=self.tuples[self.tuple_read][0]
   if target not in self.w.bodies:raise SourceContextBoundary('LEGACY_BATTLE_PHYSICAL_TARGET_REMOVED',self.slot,target)
   self.aim(self.w.bodies[target].position);self.pop();return
  if self.state==202:
   self.remember=self.tuples[self.tuple_read][:2];self.tuple_read+=1;self.state=6;return
  if self.state==203:
   x,y=self.w.bodies[self.tuples[self.tuple_read][0]].position;upper=y>=480-.75*x;self.remember=[int(x)+(-44 if upper else 44),int(y)+(-30 if upper else 40)];self.state=6;return
  if self.state==204:
   self.action=9 if self.reaction_flags&0xc04 else 8;self.percent=50;self.reaction_count+=1;count=self.reaction_count;dead=(self.flags>>1)&1;start=(dead+1)*14
   if count<start:self.speed=5;self.flip();self.move();self.aux=1 if dead else self.aux;self.w.slow=True if dead else self.w.slow
   elif count<dead*14+34:
    if self.reaction_flags&2:self.face=(self.face+1)&7
    if count==start:
     self.speed=5;self.counter=0
     if dead:
      if sum(b.aux==1 for b in self.w.bodies.values())<2:self.w.slow=False
      self.aux=0
    self.reaction_puff();self.speed=max(0,f(self.speed-f(.3)));self.move()
    if count==dead*14+24:
     original=self.attacker;other=self.w.bodies[self.tuples[self.tuple_read][0]];other.attacker=self;other.reaction_flags=self.tuples[self.tuple_read][1]&0xffffffff;other.reaction_count=other.skill=0;self.metadata();_,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff
     if not flags&8:
      if not flags&0x100:
       if not flags&0xc000 and value!=0:
        if not flags&0x2000 and flags&0x100000:other.remove_link('status');other.flags&=~0x20
        if flags&2:self.w.impact_node(other.body,0x1adb8)
        face=0
        if flags&4:resource=110000
        elif flags&0x400:resource=0x1ae12
        elif original.category==260 and original.level==9:resource=0x1af89;face=1
        else:resource=0x1adb1+self.w.random.range(0,2)
        self.w.impact_node(other.body,resource,face)
        if flags&0x20:other.flags|=2;other.aux=1;self.w.slow=True
       if not flags&0xe000:
        if value==0:self.w.message(other,0x57bb if flags&0x10000000 else 0x573b)
        elif self.category not in[84,85,87]:other.vital(0,value);self.w.number_style(other,value,6);self.w.message(other,0x57b6)if flags&2 else None
       other.pop()
      elif other.after_image_enabled==0:other.after_image_enabled=1;other.state=29
     else:other.state=29
     other.aim(self.position);self.tuple_read+=1
   elif count>=dead*14+54:
    self.reaction_count=0;self.speed=1 if dead and not self.reaction_flags&0x3010 else 6;self.percent=250 if dead and not self.reaction_flags&0x3010 else 100;self.pop()
    if not dead and self.state==11:self.speed=4;self.percent=100
   self.animate(self.body,1);return
  if self.state!=14:return super().body_step()
  self.action=5;self.percent=100;signal=self.body['q']['signal']
  if signal>9999:
   target,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff;other=self.w.bodies[target];face=0
   if flags&4:resources=[110000]
   elif flags&0x400:resources=[0x1ae12]
   elif self.category==257:resources=([0x1adbe]if self.level==9 else[])+[0x1af8c]
   elif self.category==262:resources=[0x1af89];face=1
   elif self.category==260:resources=[0x1af89]
   elif self.category==105:resources=[0x1ae37]
   else:resources=[0x1adb1+self.w.random.range(0,2)]
   other.frozen=0;other.category=-1;other.attacker=self;other.reaction_flags=flags;other.aim(self.position);full=signal<20000 or bool(flags&0x2000)
   if full:self.metadata();_,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff
   if flags&0x108:
    if flags&8:other.state=29
    elif not full or other.after_image_enabled==0:other.after_image_enabled=1;other.state=29
   else:
    if not flags&0xc000 and value!=0:
     other.position=other.remember[:]
     if full and flags&0x2000:
      if flags&2:self.w.impact_node(self.body,0x1adb8)
      self.reaction_flags=0x2000
      if flags&0x20:self.flags|=2;self.aux=1;self.w.slow=True
     else:
      if flags&0x100000:other.remove_link('status');other.flags&=~0x20
      if flags&2:self.w.impact_node(other.body,0x1adb8)
      if not full:other.state=25
     for resource in resources:self.w.impact_node(other.body,resource,face)
     if not flags&0xe000 and signal<20000 and flags&0x20:other.flags|=2;other.aux=1;self.w.slow=True
    if full:
     if flags&0x8000:other.pop();self.condition(other,flags)
     elif flags&0x4000:other.pop();self.condition(other,flags);other.vital_style(5,value);self.number_result(other,value,5,flags)
     elif flags&0x2000:
      self.pop();other.pop();self.condition(self,flags);self.vital(0,value)
      if value==0 and flags&0x10000000:self.w.message(other,0x57bb)
      else:self.number_result(self,value,6,flags)
      self.tuple_read+=1
     else:
      self.condition(other,flags);other.pop()
      if value==0:self.w.message(other,0x57bb if flags&0x10000000 else 0x573b)
      else:other.vital(0,value);self.w.number_style(other,value,6);self.w.message(other,0x57b6)if flags&2 else None
   _,fresh_flags,fresh_value,_=self.tuples[self.tuple_read]
   if not fresh_flags&8 and fresh_value!=0:self.cooldown=(((other.flags>>1)&1)+1)*14
   self.body['q']['signal']=0
  if self.cooldown>0:self.cooldown-=1
  if self.cooldown==0:
   if self.finish==0:
    if self.animate(self.body,1)!=1:return
   elif self.finish>10:self.pop();self.tuple_read+=1;self.cooldown=self.finish=0;return
   self.finish+=1

class World(prior.World):
 def __init__(self,animations,records,c):
  self.sequence_cursor=0;self.sequence_used=False;self.direct=[];self.direct_used=False;self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=c.get('offset',[0,0])[:];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
  self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None);self.character_flags(c.get('C_flags',0));all_hits=[h for scenario in[c]+c.get('parallel',[])for h in scenario['hits']];slots={s for h in all_hits for s in h[:2]}|{h[5]for h in all_hits if h[2]&512}|({c['nested']['target']}|({c['nested']['guard']}if c['nested'].get('guard')is not None else set())if c.get('nested')and c['nested']['target']!=255 else set())
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
def case(name,level=0,mask=1,value=12,caster=0,target=10,guardian=None,nested_target=11,nested_flags=1,nested_amount=7,nested_guard=None,chain=True,**extra):
 flags=mask|(0x80000 if chain else 0)|(512 if guardian is not None else 0);hit=[caster,target,flags,value,[100040,100041,100050]if flags&0x800000 else None]
 if guardian is not None:hit.append(guardian)
 n=dict(target=nested_target,flags=nested_flags|(512 if nested_guard is not None else 0),amount=nested_amount,resources=[100040,100041,100050]if nested_flags&0x800000 else None,guard=nested_guard)if chain else None
 return dict(dict(name=name,category=260,variant=0,level=level,caster=caster,cost=4,local=0,resource=100110,scalar=0,hits=[hit],nested=n),**extra)
def cases(quick):
 out=[case('level-'+str(level),level)for level in range(10)]
 if quick:return out+[case('chain255',nested_target=255),case('no-chain',chain=False),case('secondary-RID',nested_flags=0x800001),case('primary-guard',guardian=12),case('secondary-guard',nested_guard=13)]
 for level in[0,9]:
  for flags in MASKS:out.append(case(f'main-{level}-{flags:x}',level,mask=flags));out.append(case(f'secondary-{level}-{flags:x}',level,nested_flags=flags))
 for name,kwargs in[
  ('no-chain',dict(chain=False)),('chain255',dict(nested_target=255)),('main-zero',dict(value=0)),('secondary-zero',dict(nested_amount=0)),('secondary-zero-miss',dict(nested_flags=0x10000001,nested_amount=0)),('primary-guard',dict(guardian=12)),('primary-guard-RID',dict(guardian=12,mask=0x800001)),('secondary-guard',dict(nested_guard=13)),('secondary-guard-RID',dict(nested_guard=13,nested_flags=0x800001)),('secondary-RID-messages',dict(nested_flags=0x3e00001)),('self',dict(target=0)),('secondary-self',dict(nested_target=0)),('same-victim',dict(nested_target=10)),('secondary-guard-caster',dict(nested_guard=0)),('secondary-guard-primary',dict(nested_guard=10)),('secondary-guard-target',dict(nested_guard=11)),('opposite',dict(caster=10,target=0,nested_target=1,local=10)),('slot20',dict(caster=20)),('slot21',dict(caster=21)),('critical-KO',dict(mask=0x23,nested_flags=0x23)),('negative',dict(value=-7,nested_amount=-11)),('min',dict(nested_amount=-2147483648)),('max',dict(nested_amount=2147483647)),('offset',dict(offset=[11,-7])),('scaled',dict(flags={'0':0x1000,'10':0x1000,'11':0x1000})),('existing-status',dict(nested_flags=0x100001,flags={'11':32})),('preview',dict(resource=100112)),('no-final-signal',dict(resource=100113)),('suffix',dict(hits=[[0,10,0x80001,12,None],[0,12,1,5,None]])),('counter',dict(hits=[[0,10,0x80001,12,None],[11,0,0x11,5,None]])),('secondary-RID-counter',dict(nested_flags=0x800001,hits=[[0,10,0x80001,12,None],[11,0,0x11,5,None]]))]:
  for level in[0,9]:out.append(case(name+'-'+str(level),level,**kwargs))
 out.extend([case('pipeline-primary-guard',9,guardian=12,resource=100114),case('pipeline-secondary-guard',9,nested_guard=13,resource=100114),case('pipeline-secondary-guard-RID',9,nested_guard=13,nested_flags=0x800001,resource=100114)])
 assert len({c['name']for c in out})==len(out);return out
def main(quick=False):
 animations,records,files=fixtures();qs=[]
 if not quick:
  for level in range(10):
   for caster,target in[(0,10),(10,0),(20,10),(21,0)]:
    for flags in MASKS:
     for guard in[None,12,caster,target]:
      c=case('queue',level,nested_flags=flags,caster=caster,target=target,guardian=guard,nested_target=11,nested_guard=13 if guard is not None else None);qs.append(dict(case=c,fields=words(c)[0],expected_digest=digest(queues(c)['rows'])))
 traces=[];rgba=0
 for c in cases(quick):
  w=World(animations,records,c);initial=digest(w.owned());states=[];rasters=[];old_vitals=old_flags=None;boundary=consumer_boundary=None;last_owned=initial
  for i in range(1800):
   try:w.step()
   except SourceContextBoundary as e:
    consumer_boundary=dict(frame=i+1,code=e.code,slot=e.slot,target=e.target,native_runtime_context_observed=False,reason='Literal201 reads the next tuple after204;its target is outside the modeled actor slots');break
   frame=w.project_casting();last_owned=digest(w.owned());visible_zero=[n for n in frame['nodes']if n['animation']['graphicIndex']==0 and not n['deleted']and not n['actorFlags']&2]
   if visible_zero:boundary=dict(frame=i+1,code='LEGACY_BATTLE_FRAME_GEOMETRY',native_renderer_observed=False,reason='Portable reserved-graphic renderer remains unimplemented')
   states.append(digest(frame));vitals=[(b['slot'],b['vitals'])for b in frame['bodies']];flags=[n['actorFlags']for n in frame['nodes']]
   if boundary is None and(i<6 or i%37==0 or vitals!=old_vitals or flags!=old_flags):
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**prior.prior.prior.prior.render_reference(w,selector)));rgba+=1
   old_vitals=copy.deepcopy(vitals);old_flags=flags[:]
   if w.stopped or boundary is not None:break
   if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in['body','status','rider','attachment','moving-numeric-afterimage','status-skill-overlay','status-skill-field']for n in w.nodes):break
  traces.append(dict(case=c,initialOwnedDigest=initial,states=states,rasters=rasters,renderBoundary=boundary,consumerBoundary=consumer_boundary,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),finalOwnedDigest=last_owned,final=frame));print(c['name'],len(states),traces[-1]['bodySettled'],w.stopped,flush=True)
 out=dict(schema='moli.chain260-reference-stage217.v1',authority='Independent retained native equations/authored assets;no product imports/original execution',files=files,geometry=records,queues=qs,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=rgba);dest=P/'quick-vectors.json'if quick else A/'original-vectors.json';dest.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(path=str(dest.relative_to(R)),queues=len(qs),scenarios=len(traces),states=out['frames'],RGBA=rgba)),flush=True)
if __name__=='__main__':main('--quick'in sys.argv)
