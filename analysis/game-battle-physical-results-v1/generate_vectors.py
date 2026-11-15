#!/usr/bin/env python3
"""Independent fixed37c4 E000 producer/result equations;authored bytes,no product imports."""
from pathlib import Path
import copy,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-physical-results-v1'
s=importlib.util.spec_from_file_location('results_prior',A.parent/'game-battle-physical-guard-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
anime=prior.anime;skill=prior.skill;f=prior.f;digest=prior.digest;signed=prior.signed;CLASSES=prior.CLASSES;words=prior.words;lookahead=prior.lookahead
CHARGE={0,1,3,5,6,75,76,77,78,79,80,81,84,85,87,258,259,266}
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
 if c['category']in CHARGE:act(principal,147)
 if c['category']==262 and c['level']==9:act(principal,73)
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
  if kind==259 and c['level']==9:act(a,72);put(a,0,0,15);act(a,240);raw(a,t,flags,amount,rid[0]if rid else 0)
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
    if kind==262 and c['level']==9:act(principal,74)
  if flags&0x20:
   if not flags&0x2000:
    if t==principal:dead=True
    else:act(t,44)
   elif t==principal:act(a,44)
   else:dead=True
  if kind==81 and not flags&0xc108 and(not flags&0x2000 or not flags&0x20):act(a,62,78,155);row(a)['assignments'].update(effectResource=0x10f,numberValue=c.get('extra',7),numberStyle=5)
  if flags&0xe000:own(t)
  if kind==262 and c['level']==9 and i+1<len(c['hits']):act(principal,74)
 if dead:act(principal,11,44)
 else:
  if principal<20:act(principal,7,11,10)
  if c['category']==262 and c['level']==9 and len(c['hits'])==1:act(principal,74)
 return dict(principal=principal,rows=list(rows.values()))

def fixtures():
 _,records,source=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in source};index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin']);known={struct.unpack_from('<I',index,at)[0]for at in range(0,len(index),12)}
 for resource in[0x1ae1d,0x1ae25,0x1ae2d]:
  if resource not in known:
   blocks=[anime.action(0,0,96,[(1002,0,0,0),(1004,1,-1,0),(1005,0,0,0)])];index.extend(struct.pack('<IIHH',resource,len(data),len(blocks),0));data.extend(b''.join(blocks))
 files.update({'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data)})
 return anime.parse([dict(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0)]),records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]

class Body(prior.Body):
 def metadata(self):
  target,flags,_,_=self.tuples[self.tuple_read];flags&=0xffffffff
  if not flags&0x2000:return super().metadata()
  if flags&0x200000:self.w.message(self,0x5739)
  if flags&0x400000:self.w.message(self,0x573a)
  if flags&0x800000:
   rid0,rid1=self.tuples[self.tuple_read+1][2:4];rid2=self.tuples[self.tuple_read+2][2];self.tuple_read+=3;self.w.message(self,0x5738);self.rider(rid0,rid1);self.attachment(rid2)
  if flags&0x1000000:self.w.message(self,0x573a)
  if flags&0x2000000:self.w.message(self,0x5738)
  if self.category==259 and self.level==9:self.w.tile(0,15)
 def condition(self,who,flags):
  if flags&0x80000:
   if 75<=self.category<=80:self.w.condition(who,110000+self.category)
   elif self.category==259:self.w.condition(who,0x1adfb)
 def number_result(self,who,value,style,flags):
  if value==0 and flags&0x10000000:self.w.message(who,0x57bb)
  else:
   self.w.number_style(who,value,style)
   if flags&2:self.w.message(who,0x57b6)
 def body_step(self):
  if self.state in[119,120,121]:
   state=self.state
   if not self.flags&0x60:self.animate(self.body,0)
   if self.skill==0:self.w.result_charge(self,state-119)
   self.state=157;return
  if self.state!=14 or not self.tuples[self.tuple_read][1]&0xe000:return super().body_step()
  self.action=5;self.percent=100;signal=self.body['q']['signal']
  if signal>9999:
   target,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff;other=self.w.bodies[target]
   if flags&4:resources=[110000]
   elif flags&0x400:resources=[0x1ae12]
   elif 75<=self.category<=80:resources=[0x1adfa]
   elif self.category in{0,1,3,5,6,81,84,85,87,258}:resources={0:[0x1ae35],1:[0x1ae36],3:[0x1ae37],5:[0x1ae3b],6:[0x1ae39],81:[0x1ae5e],84:[0x1ae5f],85:[0x1ae4f],87:[0x1ae50],258:[0x1af8d]}[self.category]
   else:resources=[0x1adb1+self.w.random.range(0,2)]+([0x1af86]if self.category==259 else[])
   other.frozen=0;other.category=-1;other.attacker=self;other.reaction_flags=flags;other.aim(self.position);full=signal<20000 or bool(flags&0x2000)
   if full:self.metadata();_,flags,value,_=self.tuples[self.tuple_read];flags&=0xffffffff
   if flags&0x108:
    if flags&8:other.state=29
    elif not full or other.after_image_enabled==0:other.after_image_enabled=1;other.state=29
   else:
    if not flags&0xc000 and(value!=0 or self.category==6):
     other.position=other.remember[:]
     if full and flags&0x2000:
      if flags&2:self.w.impact_node(self.body,0x1adb8)
      self.reaction_flags=0x2000
      if flags&0x20:self.flags|=2;self.aux=1;self.w.slow=True
     else:
      if flags&0x100000:other.remove_link('status');other.flags&=~0x20
      if flags&2:self.w.impact_node(other.body,0x1adb8)
      if not full:other.state=25
     for resource in resources:self.w.impact_node(other.body,resource)
    if full:
     if flags&0x8000:
      other.pop();self.condition(other,flags)
      if self.category==6:other.vital(2,value);self.number_result(other,value,3,flags)
     elif flags&0x4000:
      other.pop();self.condition(other,flags)
      if self.category==6:other.vital(2,value);self.number_result(other,value,3,flags)
      else:other.vital_style(5,value);self.number_result(other,value,5,flags)
     else:
      self.pop();other.pop();self.condition(self,flags)if self.category!=6 else None;self.vital(2 if self.category==6 else 0,value)
      if value==0 and flags&0x10000000:self.w.message(other,0x57bb)
      else:self.number_result(self,value,3 if self.category==6 else 6,flags)
      self.tuple_read+=1
   _,fresh_flags,fresh_value,_=self.tuples[self.tuple_read]
   if(not fresh_flags&8 and fresh_value!=0)or self.category==6:self.cooldown=(((other.flags>>1)&1)+1)*14
   self.body['q']['signal']=0
  if self.cooldown>0:self.cooldown-=1
  if self.cooldown==0:
   if self.finish==0:
    if self.animate(self.body,1)!=1:return
   elif self.finish>10:self.pop();self.tuple_read+=1;self.cooldown=self.finish=0;return
   self.finish+=1

class World(prior.World):
 def __init__(self,animations,records,c):
  super().__init__(animations,records,c);self.plan=queues(c)
  for b in self.bodies.values():b.__class__=Body;b.tuples=[[-1,0,0,0]for _ in range(200)]
  for slot,values in c.get('initialFourths',{}).items():
   for i,value in enumerate(values):self.bodies[int(slot)].tuples[i][3]=value
  names={'classCode':'category','skillLevel':'level','mpCost':'cost','rememberedPosition':'remember','messageResource':'message','effectResource':'effect','numberValue':'number_value','numberStyle':'number_style','pairedTarget':'pairedTarget'}
  for r in self.plan['rows']:
   b=self.bodies[r['slot']];b.actions=r['actions']+[-1]if r['actions']else[0,-1];b.read=0;b.write=len(r['actions'])-1;b.busy=int(bool(r['actions']));b.tuple_read=0;b.tuple_write=len(r['tuples']);b.state=0
   for i,t in enumerate(r['tuples']):b.tuples[i][:len(t)]=t;b.tuples[i+1][0]=-1
   for k,v in r['assignments'].items():
    if k!='physicalFamily':setattr(b,names[k],copy.deepcopy(v))
  b=self.bodies[self.plan['principal']];b.state=b.actions[0]
 def result_charge(self,b,kind):
  self.node(b,'physical-result-charge',resource=0x1ae1d+8*kind,flags=0x48000,position=[b.position[0],f(b.position[1]+int(b.body['q']['drawOffsetY']/2))],parent=b.body,screenSpace=True);b.skill=1
 def step_effect(self,n):
  if n['kind']=='physical-result-charge':
   if self.animate(n,1)==1:
    if not n['parent']['deleted']and n['owner'].skill:n['owner'].skill=2
    n['deleted']=True
   return
  return super().step_effect(n)

def case(name,category=0,level=0,flags=0x2001,value=12,guard=False,hits=None,**extra):return dict(dict(name=name,category=category,level=level,variant=0,caster=0,cost=4,local=0,resource=100080,hits=hits or[[0,10,flags|(0x200 if guard else 0),value,([100040,100041,100050]if flags&0x800000 else None),11]]),**extra)
def cases(quick):
 out=[case('reflect'),case('heal',flags=0x4001),case('skip',flags=0x8001),case('reflect-guard',guard=True),case('heal-guard',flags=0x4001,guard=True),case('skip-guard',flags=0x8001,guard=True),case('reflect-MP',6),case('heal-MP',6,flags=0x4001),case('skip-MP',6,flags=0x8001),case('reflect266',266,9),case('reflect-RID',flags=0x802001,guard=True),case('heal-preview',flags=0x4001,resource=100081)]
 if quick:return out
 for category in CLASSES:
  for level in[0,9]:
   for mask,name in[(0x2000,'reflect'),(0x4000,'heal'),(0x8000,'skip')]:
    for guard in[False,True]:out.append(case('%s-%s-class%d-level%d'%(name,'guard'if guard else'plain',category,level),category,level,flags=mask|1,guard=guard))
 for mask,name in[(0x2000,'reflect'),(0x4000,'heal'),(0x8000,'skip')]:
  for suffix,label,value in[(3,'critical',12),(1,'zero',0),(1,'negative',-7),(1,'min',-2147483648),(1,'max',2147483647),(0x21,'KO',90),(0x41,'scatter',12),(0x800001,'RID',9),(0x11,'charge0',12),(0x1001,'charge3',12),(0x108,'dodge-before-defense',12)]:out.append(case(name+'-'+label,flags=mask|suffix,value=value))
 for flags in[0x6001,0xa001,0xc001,0xe001]:out.append(case('priority-%x'%flags,flags=flags));out.append(case('priority-guard-%x'%flags,flags=flags,guard=True))
 out.extend([case('reflect-guard-preview',guard=True,resource=100081),case('heal84',84,flags=0x4001),case('reflect84',84),case('reflect-scatter-nonlocal',local=1,flags=0x2041),case('heal-clamp',flags=0x4001,value=90),case('reflect-then-plain',hits=[[0,10,0x2001,12],[0,11,1,7]]),case('reflect-guard-followup',hits=[[0,10,0x2201,12,None,11],[11,0,0x11,7]]),case('guard-RID-old-fourth',flags=0x802001,guard=True,initialFourths={'0':[0,0x11223344]})])
 return out
def main(quick=False):
 animations,records,files=fixtures();qs=[]
 if not quick:
  for category in CLASSES:
   for level in range(10):
    for actor,target,g in[(0,10,11),(10,0,1),(20,10,0),(21,0,10)]:
     for mask in[0x2000,0x4000,0x8000,0x6000,0xa000,0xc000,0xe000]:
      for suffix in[0,1,3,8,0x100,0x108,0x20,0x21,0x41,0x800001,0x100001,0x80001,0x10000001,0x11,0x1001,0x801001]:
       for guarded in[False,True]:
        flags=mask|suffix|(0x200 if guarded else 0);c=case('queue',category,level,hits=[[actor,target,flags,12,([100040,100041,100050]if flags&0x800000 else None),g]]);qs.append(dict(input=[category,level,actor,target,g,flags],expected_digest=digest(queues(c)['rows'])))
 traces=[]
 for c in cases(quick):
  w=World(animations,records,c);initial=digest(w.owned());states=[];rasters=[];old_vitals=None
  for i in range(1000):
   frame=w.step();states.append(digest(frame));vitals=[b.vitals[:]for b in w.bodies.values()]
   if i<4 or i%43==0 or vitals!=old_vitals:
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**prior.prior.render_reference(w,selector)))
   old_vitals=copy.deepcopy(vitals)
   if w.stopped:break
   if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in['body','status','rider','attachment','status-skill-overlay','status-skill-field','moving-numeric-afterimage']for n in w.nodes):break
  traces.append(dict(case=c,initialOwnedDigest=initial,states=states,rasters=rasters,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),finalOwnedDigest=digest(w.owned()),final=frame));print(c['name'],len(states),traces[-1]['bodySettled'],flush=True)
 out=dict(schema='moli.physical-results-reference-stage209.v1',authority='Independent retained native source equations and authored bytes;no product imports or original execution',files=files,geometry=records,queues=qs,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces));destination=P/'quick-vectors.json'if quick else A/'original-vectors.json';destination.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(path=str(destination.relative_to(R)),queues=len(qs),scenarios=len(traces),states=out['frames'],RGBA=out['rgbaFrames'])),flush=True)
if __name__=='__main__':main('--quick'in sys.argv)
