#!/usr/bin/env python3
"""Independent fixed37c4 424310 nested72/113,232 and native continuation equations."""
from pathlib import Path
from types import SimpleNamespace
import copy,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-nested-physical-v1'
s=importlib.util.spec_from_file_location('nested_prior',A.parent/'game-battle-physical-results-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
anime=prior.anime;skill=prior.skill;f=prior.f;digest=prior.digest;signed=prior.signed;guard=prior.prior

def fixtures():
 animations,records,source=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in source};info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);known={r['resourceId']for r in records};index=max(r['index']for r in records)+1
 for resource in[0x573c,0x573d]:
  if resource in known:continue
  w,h=8,7;paint=bytes(0 if(i+resource)%5==0 else 17+(i+resource)%3 for i in range(w*h));raw=b'RD\0\0'+struct.pack('<iiI',w,h,len(paint)+16)+paint;row=bytearray(40);struct.pack_into('<IIIiiii',row,0,index,len(pixels),len(raw),-3,-4,w,h);struct.pack_into('<I',row,36,resource);info.extend(row);pixels.extend(raw);records.append(dict(index=index,resourceId=resource,originX=-3,originY=-4,width=w,height=h));skill.scene.IMAGES[index]=dict(index=index,resource=resource,origin=[-3,-4],width=w,height=h,pixels=paint,embedded=None);index+=1
 files.update({'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels)})
 def geo(kind,value):
  row=next(r for r in records if r['index'if kind=='index'else'resourceId']==value);return{k:row[k]for k in['index','originX','originY','width','height']}
 anime.geo=geo;return animations,records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]

def words(c):
 raw=[c['category']*100+c['level'],c['cost'],c['variant']];ends=[];mapped=guard.mapped
 for i,h in enumerate(c['hits']):
  a,t,flags,value=h[:4];raw.extend([mapped(a),mapped(t),signed(flags),value])
  if flags&0x800000:raw.extend(h[4])
  if flags&512:raw.append(mapped(h[5]))
  if i==0 and flags&1:
   n=c['nested'];raw.extend([mapped(n['target']),signed(n['flags']),n['amount']])
   if n['flags']&0x800000:raw.extend(n['resources'])
   if n['flags']&512:raw.append(mapped(n['guard']))
  ends.append(len(raw))
 raw.append(255);return raw,ends

def queues(c):
 rows={};caster=c['hits'][0][0];wire,ends=words(c);first=c['hits'][0];a,t,flags,value=first[:4];n=c.get('nested');dead=False
 def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={}))
 def act(s,*v):row(s)['actions'].extend(v)
 def put(s,target,mask,value,extra=None):row(s)['tuples'].append([target,signed(mask),value]+([]if extra is None else[extra]))
 def own(s):row(s)['assignments']['physicalFamily']=1
 def protect(a,t,g,mask,value):
  own(t);own(g);act(a,72);put(a,g,mask,value);act(a,24,71,0,24);act(g,0);put(g,t,mask,value);row(g)['assignments'].update(pairedTarget=t,effectResource=252,messageResource=22344);act(g,39,78,67,34,73,7,4,42,71,10,74,72);put(g,t,mask,value);act(t,0,27);put(t,a,mask,value);act(t,71,72,62,1);return g
 def release(t,mask,value,following):
  own(t)
  if value==0:act(t,35)
  act(t,71,72)
  if mask&0xe000:
   if following<0:act(t,11)
   else:act(t,3);put(t,following,0,0,0);act(t,72)
  if not mask&32:act(t,38)
  if value==0:
   if following<0:act(t,11)
   else:act(t,3);put(t,following,0,0,0);act(t,72)
 def scatter(s):act(s,32,*([244]if s==c['local']else[50,49]))
 row(caster)['assignments'].update(classCode=c['category'],skillLevel=c['level'],mpCost=c['cost']);act(caster,38,147,53);own(a);act(a,24,*([3,113]if flags&0x1010 else[7,9,10]),242);put(a,t,flags,value,first[4][0]if flags&0x800000 else 0)
 if flags&512:original=t;t=protect(a,t,first[5],flags,value);act(original,11)
 nt=n['target']if n else 0
 if n and n.get('guard')is not None:
  nt=protect(a,nt,n['guard'],n['flags'],n['amount']);act(a,72);put(a,t,flags,value,first[4][0]if flags&0x800000 else 0)
 row(a)['assignments'].update(pairedTarget=t,effectResource=110)
 if n:
  if n.get('guard')is None:act(a,71)
  act(a,39,73,78)
  if n.get('guard')is not None:act(a,71)
  act(a,72);put(a,nt,n['flags'],n['amount'],0);act(a,232);put(a,t,flags,value,first[4][0]if flags&0x800000 else 0)
  if not n['flags']&0x2040:act(a,39,78,5)
 else:act(a,61,39,73,78,71,5,39,78,5)
 act(a,74);own(t);act(t,0)
 if not flags&0x108:
  if flags&64:
   if flags&3:
    if flags&8192:act(a,32);act(t,119);act(a,*([244]if a==c['local']else[50,49]))
    else:
     act(t,32)
     if flags&512:act(t,71,72)
     act(t,*([244]if t==c['local']else[50,49]))
  elif value!=0 and flags&3:
   if flags&32768:act(t,121)
   elif flags&16384:act(t,120)
   elif flags&8192:act(a,160 if flags&2 else 26);act(t,119)
 following=guard.lookahead(wire,ends[0],t)
 if flags&512:release(t,flags,value,following)
 if(value!=0 or flags&0x108)and not flags&0xc000:
  if not flags&8192:
   if flags&256:act(t,74)
  elif a!=following:act(a if t==caster else t,11)
 if flags&32:
  if not flags&8192:
   if t==caster:dead=True
   else:act(t,44)
  elif t==caster:act(a,44)
  else:dead=True
 if n:
  own(nt);act(nt,0);nf=n['flags'];nv=n['amount']
  if not flags&0x108 and nv!=0 and not nf&64 and nf&3:
   if nf&32768:act(nt,121)
   elif nf&16384:act(nt,120)
   elif nf&8192:act(a,160 if flags&2 else 26);act(nt,119)
   else:act(nt,160 if nf&2 else 26)
 else:act(t,30)
 row(a)['assignments'].update(scriptSound=257 if flags&0x80000 else 258,messageResource=22332 if flags&0x80000 else 22333);act(a,79,66)
 if not n or n['flags']&0x2040!=0x2040:
  if flags&0x80000:act(a,55)
  elif n:act(a,56,56)
  else:act(a,58,35)
 act(a,72)
 if n and not flags&0x108:
  nf=n['flags'];nv=n['amount']
  if nf&64 and nf&3:
   if nf&8192:act(a,32);act(nt,119);act(a,*([244]if a==c['local']else[50,49]))
   else:
    act(nt,32)
    if n.get('guard')is not None:act(nt,71,72)
    act(nt,*([244]if t==c['local']else[50,49]))
  following=guard.lookahead(wire,ends[0],nt)
  if n.get('guard')is not None:act(t,11);release(nt,nf,nv,following)
  if(nv!=0 or nf&0x108)and not nf&0xc000:
   if not nf&8192:
    if nt!=caster:act(nt,11)
    if nf&256:act(nt,74)
   elif nt==caster:act(a,11)
  if flags&32:
   if not flags&8192:
    if nt==caster:dead=True
    else:act(t,44)
   elif nt==caster:act(a,44)
   else:dead=True
 # Complete later pair ownership follows the same native loop after kind=-1.
 for i,h in enumerate(c['hits'][1:],1):
  a,t,mask,val=h[:4];own(a);act(a,24,*([3,113]if mask&0x1010 else[7,9,10]if a!=caster else[3]),242);put(a,t,mask,val,h[4][0]if mask&0x800000 else 0)
  if mask&512:old=t;t=protect(a,t,h[5],mask,val);act(old,11)
  if mask&0x800000:
   saved=row(a)['tuples'][-1][:]
   if len(saved)==3:saved.append(c.get('initialFourths',{}).get(str(a),[0]*200)[len(row(a)['tuples'])-1])
   put(a,t,mask,h[4][0],h[4][1]);put(a,t,mask,h[4][2],0);row(a)['tuples'].append(saved)
  act(a,14);own(t);act(t,0)
  if not mask&0x108:
   if mask&64:
    if mask&3:
     moving=a if mask&8192 else t;act(moving,32)
     if mask&8192:act(t,119)
     elif mask&512:act(t,71,72)
     act(moving,*([244]if moving==c['local']else[50,49]))
   elif val!=0 and mask&3:
    if mask&32768:act(t,121)
    elif mask&16384:act(t,120)
    elif mask&8192:act(a,160 if mask&2 else 26);act(t,119)
    else:act(t,160 if mask&2 else 26)
  following=guard.lookahead(wire,ends[i],t)
  if mask&512:release(t,mask,val,following)
  if(val!=0 or mask&0x108)and not mask&0xc000:
   if not mask&8192:
    if t!=caster:act(t,11 if following<0 else 243)
    if mask&256:act(t,74)
   elif a!=following:act(a if t==caster else t,11)
  if mask&32:
   if not mask&8192:
    if t==caster:dead=True
    else:act(t,44)
   elif t==caster:act(a,44)
   else:dead=True
 if caster<20:act(caster,*([11,44]if dead else[7,11,10]))
 return dict(principal=caster,rows=list(rows.values()))

class Body(prior.Body):
 def body_step(self):
  state=self.state
  if state==232:
   self.action=3;self.speed=10;self.percent=100;other=self.w.bodies[self.tuples[self.tuple_read][0]]
   if self.counter>15:self.nested_hit()
   else:
    self.move()
    if self.counter>15 or self.distance(other.position)<20:self.nested_hit()
   before=self.counter;self.counter=signed(before+1)
   if before>15:self.pop();self.counter=0
   self.animate(self.body,0);return
  if state==5:
   self.action=3;self.speed=8;self.percent=100;before=self.counter;self.counter=signed(before+1)
   if before>15:self.pop();self.counter=0
   else:self.move()
   self.animate(self.body,0);return
  if state in[55,56,57]:
   self.action=13 if state==55 else 14 if state==56 else 15
   if self.animate(self.body,1)==1:self.body['q']['nextFrame']=self.body['q']['delay']=0;self.pop()
   return
  if state==58:self.action=15;self.pop();return
  if state==61:
   self.action=0;before=self.counter;self.counter=signed(before+1)
   if before<70:
    if self.counter==20:self.face-=2
    if self.counter==50:self.face+=4
    if self.face>7:self.face-=8
    if self.face<0:self.face+=8
   else:self.pop();self.counter=0
   self.animate(self.body,0);return
  if state==79:self.pop();return
  if state in[0,231]and self.category in[72,113]and self.read>0 and self.actions[self.read-1]in[55,57]and not self.flags&2:
   if state==231:self.state=self.busy=0
   self.percent=100;return
  return super().body_step()
 def nested_hit(self):
  t,mask,val,_=self.tuples[self.tuple_read];mask&=0xffffffff;victim=self.w.bodies[t];victim.aim(self.position);victim.category=-1;victim.attacker=self;victim.reaction_flags=mask;self.metadata()
  if not mask&0x108:
   if not mask&0xc000 and val!=0:
    victim.position=victim.remember[:]
    if not mask&8192:
     if mask&0x100000:victim.remove('status');victim.flags&=~32
     if mask&2:self.w.impact_node(victim.body,0x1adb8)
     self.w.impact_node(victim.body,0x1adb1+self.w.random.range(0,2))
     if mask&32:victim.flags|=2;victim.aux=1;self.w.slow=True
    else:
     if mask&2:self.w.impact_node(self.body,0x1adb8)
     self.w.impact_node(victim.body,0x1adb1+self.w.random.range(0,2));self.reaction_flags=8192
     if mask&32:self.flags|=2;self.aux=1;self.w.slow=True
   if mask&32768:victim.pop()
   elif mask&16384:
    victim.pop();victim.vital_style(5,val);self.number_result(victim,val,5,mask)
   elif mask&8192:
    self.pop();victim.pop();self.vital_style(6,val)
    if val==0 and mask&0x10000000:self.w.message(self.w.bodies[self.tuples[self.tuple_read][0]],0x57bb)
    else:
     self.w.number_style(self,val,6)
     if mask&2:self.w.message(self,0x57b6)
   else:
    if val==0:self.w.message(victim,0x57bb if mask&0x10000000 else 0x573b)
    else:victim.vital_style(6,val);self.number_result(victim,val,6,mask)
    victim.pop()
  elif mask&8:victim.state=29
  elif victim.after_image_enabled==0:victim.after_image_enabled=1;victim.state=29
  if not mask&8 and val!=0:self.cooldown=(((victim.flags>>1)&1)+1)*14
  if not mask&8192 and self.counter<16:self.state=5
  self.tuple_read+=1

class World(prior.World):
 def __init__(self,animations,records,c):
  self.direct=[];self.direct_used=False;self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=False;self.offset=c.get('offset',[0,0])[:];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
  self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None);self.character_flags(c.get('C_flags',0));slots={s for h in c['hits']for s in h[:2]}|{h[5]for h in c['hits']if h[2]&512};n=c.get('nested')
  if n:slots.add(n['target']);slots.update([n['guard']]if n.get('guard')is not None else[])
  for slot in sorted(slots):
   b=Body(self,slot,c['resource']);self.bodies[slot]=b;b.after_image_enabled=b.after_image_counter=0;b.raw=c.get('flags',{}).get(str(slot),0);b.message=b.effect=b.script_sound=0
   if b.raw&0x1000:b.scale=[f(1.3),f(1.3)]
   if b.raw&0x3f0:self.condition(b,0x1adfb+(b.raw&0x3f0).bit_length()-5)
   if b.raw&0x800:self.toggle(b,True)
   for t in b.tuples:t[0]=-1
   for i,fourth in enumerate(c.get('initialFourths',{}).get(str(slot),[])):b.tuples[i][3]=fourth
  self.plan=queues(c);names={'classCode':'category','skillLevel':'level','mpCost':'cost','messageResource':'message','effectResource':'effect','scriptSound':'script_sound','pairedTarget':'pairedTarget'}
  for row in self.plan['rows']:
   b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuple_read=0;b.tuple_write=len(row['tuples'])
   for i,t in enumerate(row['tuples']):b.tuples[i][:len(t)]=t;b.tuples[i+1][0]=-1
   for key,value in row['assignments'].items():
    if key!='physicalFamily':setattr(b,names[key],copy.deepcopy(value))
  b=self.bodies[self.plan['principal']];b.state=b.actions[0]
 def project_casting(self):
  p=super().project_casting()
  for row in p['bodies']:row['scriptSound']=self.bodies[row['slot']].script_sound
  return p

def case(name,category=72,level=0,mask=1,nested_flags=1,value=12,main_value=0,guardian=None,nested_guard=None,caster=0,target=10,nested_target=11,**extra):
 hit=[caster,target,mask|(512 if guardian is not None else 0),main_value,([100040,100041,100050]if mask&0x800000 else None)]
 if guardian is not None:hit.append(guardian)
 nested=dict(target=nested_target,flags=nested_flags|(512 if nested_guard is not None else 0),amount=value,resources=None,guard=nested_guard)if mask&1 else None
 return dict(dict(name=name,category=category,variant=0,level=level,caster=caster,cost=4,local=0,resource=100080,hits=[hit],nested=nested),**extra)
def cases(quick):
 out=[case('nested'),case('miss',mask=0),case('reflection',nested_flags=0x2001),case('heal',nested_flags=0x4001)]
 if quick:return out
 for category in[72,113]:
  for level in[0,9]:
   for mask in[0,1,3,0x80000,0x80001,0x80003]:
    for nf,label in[(0,'zero'),(1,'normal'),(3,'critical'),(8,'dodge'),(0x100,'defense'),(0x108,'both'),(0x2001,'reflect'),(0x4001,'heal'),(0x8001,'skip'),(0x6003,'heal-reflect'),(0xa001,'skip-reflect'),(0xc003,'skip-heal'),(0xe003,'all')]:
     if not mask&1 and nf!=0:continue
     out.append(case('class%d-level%d-outer%x-%s'%(category,level,mask,label),category,level,mask,nf))
 for mask,label in[(0,'zero'),(0x10000000,'zero-message'),(2,'critical-zero'),(0x4003,'heal-zero'),(0x10004003,'heal-zero-message'),(0x2003,'reflect-zero')]:out.append(case(label,nested_flags=mask,value=0))
 for val,label in[(-7,'negative'),(-2147483648,'min'),(2147483647,'max'),(90,'large')]:
  for nf,kind in[(1,'damage'),(0x4001,'heal'),(0x2001,'reflect')]:out.append(case(label+'-'+kind,nested_flags=nf,value=val))
 out.extend([case('main-guard',guardian=12),case('nested-guard',nested_guard=12),case('two-guards',guardian=12,nested_guard=13),case('nested-self',nested_target=0),case('same-target',nested_target=10),case('main-self',target=0),case('opposite',caster=10,target=0,nested_target=1),case('slot20',caster=20),case('slot21',caster=21),case('offset',offset=[11,-7]),case('main-dodge',mask=9),case('main-defense',mask=0x101),case('main-crit-reflection',mask=3,nested_flags=0x2001),case('main-plain-nestedcrit-reflection',mask=1,nested_flags=0x2003),case('main-KO',mask=0x21,main_value=3),case('nested-KO',nested_flags=0x21,value=90),case('scatter-local',nested_flags=0x41,nested_target=0),case('scatter-other',nested_flags=0x41),case('scatter-reflect',nested_flags=0x2041),case('main-RID-ignored',mask=0x800001),case('ordinary-followup',hits=[[0,10,1,0,None],[0,12,1,7,None]]),case('different-followup',hits=[[0,10,1,0,None],[1,12,1,7,None]]),case('guard-old-fourth',nested_guard=12,initialFourths={'0':[0,0x11223344],'12':[0x55667788]})])
 assert len({c['name']for c in out})==len(out);return out

def main(quick=False):
 animations,records,files=fixtures();qs=[]
 if not quick:
  for category in[72,113]:
   for level in range(10):
    for caster,target,nt in[(0,10,11),(10,0,1),(20,10,11),(21,0,1)]:
     for mask in[0,1,3,0x80000,0x80001,0x80003,0x109,0x201,0x211,0x1001]:
      for nf in[0,1,3,8,0x100,0x108,0x2001,0x4001,0x8001,0x6003,0xa003,0xe003,0x41,0x2041]:
       if not mask&1 and nf!=0:continue
       c=case('queue',category,level,mask,nf,caster=caster,target=target,nested_target=nt,guardian=12 if mask&512 else None);qs.append(dict(case=c,expected_digest=digest(queues(c)['rows'])))
 traces=[]
 for c in cases(quick):
  w=World(animations,records,c);initial=digest(w.owned());states=[];rasters=[];old_vitals=None
  for i in range(1200):
   w.step();frame=w.project_casting();states.append(digest(frame));vitals=[(b['slot'],b['vitals'])for b in frame['bodies']]
   if i<4 or i%53==0 or vitals!=old_vitals:
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**guard.prior.render_reference(w,selector)))
   old_vitals=copy.deepcopy(vitals)
   if w.stopped:break
   if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in['body','status','rider','attachment','moving-numeric-afterimage']for n in w.nodes):break
  traces.append(dict(case=c,initialOwnedDigest=initial,states=states,rasters=rasters,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),finalOwnedDigest=digest(w.owned()),final=frame));print(c['name'],len(states),traces[-1]['bodySettled'],w.stopped,flush=True)
 out=dict(schema='moli.nested-physical-reference-stage212.v1',authority='Independent retained native equations and authored assets;no product imports or original execution',files=files,geometry=records,queues=qs,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces));dest=P/'quick-vectors.json'if quick else A/'original-vectors.json';dest.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(path=str(dest.relative_to(R)),queues=len(qs),scenarios=len(traces),states=out['frames'],RGBA=out['rgbaFrames'])),flush=True)
if __name__=='__main__':main('--quick'in sys.argv)
