#!/usr/bin/env python3
"""Independent fixed37c4 class96 producer and exact75/76/80/89/90/92..95 equations."""
from pathlib import Path
from types import SimpleNamespace
import copy,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-special96-v1'
s=importlib.util.spec_from_file_location('special96_prior',A.parent/'game-battle-nested-physical-v1/generate_vectors.py');prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
anime=prior.anime;skill=prior.skill;f=prior.f;digest=prior.digest;signed=prior.signed;guard=prior.guard

def fixtures():
 animations,records,source=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in source};info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);resource=0x5783;index=max(r['index']for r in records)+1;w,h=8,7;paint=bytes(0 if(i+resource)%5==0 else 17+(i+resource)%3 for i in range(w*h));raw=b'RD\0\0'+struct.pack('<iiI',w,h,len(paint)+16)+paint;row=bytearray(40);struct.pack_into('<IIIiiii',row,0,index,len(pixels),len(raw),-3,-4,w,h);struct.pack_into('<I',row,36,resource);info.extend(row);pixels.extend(raw);records.append(dict(index=index,resourceId=resource,originX=-3,originY=-4,width=w,height=h));skill.scene.IMAGES[index]=dict(index=index,resource=resource,origin=[-3,-4],width=w,height=h,pixels=paint,embedded=None);files.update({'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels)})
 def geo(kind,value):
  r=next(r for r in records if r['index'if kind=='index'else'resourceId']==value);return{k:r[k]for k in['index','originX','originY','width','height']}
 anime.geo=geo;return animations,records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]

def queues(c):
 rows={};caster=c['hits'][0][0];wire,ends=guard.words(c);first=c['hits'][0];a,t,mask,value=first[:4];dead=False
 def row(s):return rows.setdefault(s,dict(slot=s,actions=[],tuples=[],assignments={}))
 def act(s,*v):row(s)['actions'].extend(v)
 def put(s,target,flags,value,extra=None):row(s)['tuples'].append([target,signed(flags),value]+([]if extra is None else[extra]))
 def own(s):row(s)['assignments']['physicalFamily']=1
 row(caster)['assignments'].update(classCode=96,skillLevel=c['level'],mpCost=c['cost']);act(caster,38,147,53);own(a);act(a,24,*([3,113]if mask&0x1010 else[]),242);put(a,t,mask,value,first[4][0]if mask&0x800000 else 0)
 if mask&512:
  g=first[5];own(t);own(g);act(a,72);put(a,g,mask,value);act(a,24,71,0,24);act(g,0);put(g,t,mask,value);row(g)['assignments'].update(pairedTarget=t,effectResource=252,messageResource=22344);act(g,39,78,67,34,73,7,4,42,71,10,74,72);put(g,t,mask,value);act(t,0,27);put(t,a,mask,value);act(t,71,72,62,1,11);t=g
 row(a)['assignments'].update(effectResource=62,scriptSound=210,scriptAuxSound=133,messageResource=22403);act(a,78,75,34,89,34,92,90,34,76,34,73,79,93,74,62,80,66,95,35,94,71,72);own(t);act(t,0)
 if not mask&0x108:
  if mask&64:
   if mask&3:
    moving=a if mask&8192 else t;act(moving,32)
    if mask&8192:act(t,119)
    elif mask&512:act(t,71,72)
    act(moving,*([244]if moving==c['local']else[50,49]))
  elif value!=0 and mask&3:
   if mask&32768:act(t,121)
   elif mask&16384:act(t,120)
   elif mask&8192:act(a,160 if mask&2 else 26);act(t,119)
   else:act(t,160 if mask&2 else 26)
 following=guard.lookahead(wire,ends[0],t)
 if following is None:raise ValueError('look-ahead context')
 if mask&512:
  if value==0:act(t,35)
  act(t,71,72)
  if mask&0xe000:
   if following<0:act(t,11)
   else:act(t,3);put(t,following,0,0,0);act(t,72)
  if not mask&32:act(t,38)
  if value==0:
   if following<0:act(t,11)
   else:act(t,3);put(t,following,0,0,0);act(t,72)
 if(value!=0 or mask&0x108)and not mask&0xc000:
  if not mask&8192:
   if mask&256:act(t,74)
  elif a!=following:act(a if t==caster else t,11)
 if mask&32:
  if not mask&8192:
   if t==caster:dead=True
   else:act(t,45,44)
  elif t==caster:act(a,44)
  else:dead=True
 for index,h in enumerate(c['hits'][1:],1):
  actor,recipient,flags,amount=h[:4];rid=h[4]if flags&0x800000 else None;g=h[5]if flags&512 else None;own(actor);act(actor,24,*([3,113]if flags&0x1010 else[7,9,10]if actor!=caster else[3]),242);put(actor,recipient,flags,amount,rid[0]if rid else 0)
  if g is not None:
   own(recipient);own(g);act(actor,72);put(actor,g,flags,amount);act(actor,24,71,0,24);act(g,0);put(g,recipient,flags,amount);row(g)['assignments'].update(pairedTarget=recipient,effectResource=252,messageResource=22344);act(g,39,78,67,34,73,7,4,42,71,10,74,72);put(g,recipient,flags,amount);act(recipient,0,27);put(recipient,actor,flags,amount);act(recipient,71,72,62,1,11);recipient=g
  if rid:
   saved=row(actor)['tuples'][-1][:]
   if len(saved)==3:
    old=c.get('initialFourths',{}).get(str(actor),[]);i=len(row(actor)['tuples'])-1;saved.append(old[i]if i<len(old)else 0)
   put(actor,recipient,flags,rid[0],rid[1]);put(actor,recipient,flags,rid[2],0);row(actor)['tuples'].append(saved)
  act(actor,14);act(recipient,0)
  if not flags&0x108:
   if flags&64:
    if flags&3:
     moving=actor if flags&8192 else recipient;act(moving,32)
     if flags&8192:act(recipient,119)
     elif g is not None:act(recipient,71,72)
     act(moving,*([244]if moving==c['local']else[50,49]))
   elif amount!=0 and flags&3:
    if flags&32768:act(recipient,121)
    elif flags&16384:act(recipient,120)
    elif flags&8192:act(actor,160 if flags&2 else 26);act(recipient,119)
    else:act(recipient,160 if flags&2 else 26)
  following=guard.lookahead(wire,ends[index],recipient)
  if following is None:raise ValueError('suffix look-ahead context')
  if g is not None:
   if amount==0:act(recipient,35)
   act(recipient,71,72)
   if flags&0xe000:
    if following<0:act(recipient,11)
    else:act(recipient,3);put(recipient,following,0,0,0);act(recipient,72)
   if not flags&32:act(recipient,38)
   if amount==0:
    if following<0:act(recipient,11)
    else:act(recipient,3);put(recipient,following,0,0,0);act(recipient,72)
  if(amount!=0 or flags&0x108)and not flags&0xc000:
   if not flags&8192:
    if recipient!=caster:act(recipient,11 if following<0 else 243)
    if flags&256:act(recipient,74)
   elif actor!=following:act(actor if recipient==caster else recipient,11)
  if flags&32:
   if not flags&8192:
    if recipient==caster:dead=True
    else:act(recipient,44)
   elif recipient==caster:act(actor,44)
   else:dead=True
  if flags&0xe000:own(recipient)
 if caster<20:act(caster,*([11,44]if dead else[7,11,10]))
 return dict(principal=caster,rows=list(rows.values()))

class Body(prior.Body):
 def body_step(self):
  state=self.state
  if state in[75,76]:
   flag=0x100000 if self.w.alt else 0x8000;self.actor_flags=(self.actor_flags|flag)if state==75 else(self.actor_flags&~flag);self.pop();return
  if state in[89,90]:self.actor_flags=(self.actor_flags|2)if state==89 else(self.actor_flags&~2);self.pop();self.animate(self.body,0);return
  if state==92:
   other=self.w.bodies[self.tuples[self.tuple_read][0]];self.position=other.position[:];self.angle=f(other.angle-180)
   if self.angle>=360:self.angle=f(self.angle-360)
   elif self.angle<0:self.angle=f(self.angle+360)
   self.speed=50.;self.move();self.aim(other.position);self.pop();return
  if state==93:
   if self.counter==0:self.action=3;self.animate(self.body,0)
   self.speed=6.;previous=self.counter;self.counter=signed(previous+1)
   if previous<16:self.move()
   else:self.pop();self.counter=0;self.w.random.next();self.w.bodies[self.tuples[self.tuple_read][0]].vitals[0]=0
   return
  if state==44:
   self.action=10;self.percent=100
   if self.animate(self.body,1)==1:
    for key in['overlay','status','special','shadow']:self.remove(key)
    self.saved|=2;self.state=46
   return
  if state in[94,95]:self.w.bodies[self.tuples[self.tuple_read][0]].frozen=int(state==95);self.pop();return
  if state==80:self.pop();return
  return super().body_step()

class World(prior.World):
 def __init__(self,animations,records,c):
  self.direct=[];self.direct_used=False;self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=False;self.events=[];self.bodies={};self.local=c['local'];self.alt=c.get('alternative',False);self.offset=c.get('offset',[0,0])[:];self.overlay_counter=self.overlay_direction=0;self.submissions=[];self.shake=self.amplitude=self.limit=0;self.case=c;self.field=None;self.used=False;self.phase2=False;self.stopped=False
  self.manager=SimpleNamespace(slot=None,body=None,links={},screen=lambda n:None);self.character_flags(c.get('C_flags',0));slots={s for h in c['hits']for s in h[:2]}|{h[5]for h in c['hits']if h[2]&512}
  for slot in sorted(slots):
   b=Body(self,slot,c['resource']);self.bodies[slot]=b;b.alt=self.alt;b.after_image_enabled=b.after_image_counter=0;b.raw=c.get('flags',{}).get(str(slot),0);b.message=b.effect=b.script_sound=b.script_aux_sound=0
   if b.raw&0x1000:b.scale=[f(1.3),f(1.3)]
   if b.raw&0x3f0:self.condition(b,0x1adfb+(b.raw&0x3f0).bit_length()-5)
   if b.raw&0x800:self.toggle(b,True)
   for t in b.tuples:t[0]=-1
   for i,fourth in enumerate(c.get('initialFourths',{}).get(str(slot),[])):b.tuples[i][3]=fourth
  self.plan=queues(c);names={'classCode':'category','skillLevel':'level','mpCost':'cost','messageResource':'message','effectResource':'effect','scriptSound':'script_sound','scriptAuxSound':'script_aux_sound','pairedTarget':'pairedTarget','numberValue':'number_value','numberStyle':'number_style'}
  for row in self.plan['rows']:
   b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuple_read=0;b.tuple_write=len(row['tuples'])
   for i,t in enumerate(row['tuples']):b.tuples[i][:len(t)]=t;b.tuples[i+1][0]=-1
   for key,value in row['assignments'].items():
    if key!='physicalFamily':setattr(b,names[key],copy.deepcopy(value))
  b=self.bodies[self.plan['principal']];b.state=b.actions[0]
 def project_casting(self):
  p=super().project_casting()
  for row in p['bodies']:row['scriptAuxSound']=self.bodies[row['slot']].script_aux_sound
  return p

def case(name,level=0,mask=0x21,value=12,caster=0,target=10,guardian=None,**extra):
 hit=[caster,target,mask|(512 if guardian is not None else 0),value,[100040,100041,100050]if mask&0x800000 else None]
 if guardian is not None:hit.append(guardian)
 return dict(dict(name=name,category=96,variant=0,level=level,caster=caster,cost=4,local=0,resource=100080,hits=[hit]),**extra)
MASKS=[0,1,3,8,0x100,0x108,0x20,0x21,0x23,0x40,0x41,0x2041,0x4001,0x8001,0x6003,0xc003,0xe003,0x2001,0x10000000,0x10000001,0x800001,0x800021,0x11,0x1001,0x200001,0x80001]
def cases(quick):
 out=[case('KO'),case('ordinary',mask=1),case('guard',guardian=12),case('zero-input',mask=0,value=0)]
 if quick:return out
 for level in[0,9]:
  for mask in MASKS:out.append(case('level%d-mask%x'%(level,mask),level,mask))
 out.extend([case('negative',value=-7),case('min',value=-2147483648),case('max',value=2147483647),case('self',mask=0,target=0),case('self-KO',target=0),case('self-no-KO',mask=1,target=0),case('opposite',caster=10,target=0,local=10),case('slot20',caster=20),case('slot21',caster=21),case('guard-zero',mask=0,value=0,guardian=12),case('guard-heal',mask=0x4001,guardian=12),case('guard-reflect',mask=0x2001,guardian=12),case('guard-RID',mask=0x800021,guardian=12),case('guard-alias-caster',guardian=0),case('guard-alias-target',guardian=10),case('guard-old-fourth',guardian=12,initialFourths={'0':[0,0x11223344],'12':[0x55667788]}),case('offset',offset=[11,-7]),case('status',flags={'10':0x20}),case('scaled',flags={'0':0x1000,'10':0x1000}),case('alternative',alternative=True),case('alternative-guard',guardian=12,alternative=True),case('followup',hits=[[0,10,0x21,12,None],[0,11,1,7,None]]),case('counter',hits=[[0,10,0x21,12,None],[10,0,1,7,None]]),case('followup-RID',hits=[[0,10,0x21,12,None],[0,11,0x800001,7,[100040,100041,100050]]]),case('followup-guard-RID',hits=[[0,10,0x21,12,None],[0,11,0x800201,7,[100040,100041,100050],12]]),case('followup-guard-fourth',initialFourths={'0':[0,0x11223344]},hits=[[0,10,0x21,12,None],[0,11,0x800201,7,[100040,100041,100050],12]])])
 assert len({c['name']for c in out})==len(out);return out

def requires_alpha(w,selector):
 for n in w.project_casting()['nodes']:
  flags=n['actorFlags'];q=n['animation']
  if not n['deleted']and q['graphicIndex']!=-1 and not flags&2 and not(flags&0x8000 and selector==0 or flags&0x10000 and selector==1)and flags&0x100000:return True
 return False

def main(quick=False):
 animations,records,files=fixtures();qs=[]
 if not quick:
  for level in range(10):
   for caster,target in[(0,10),(10,0),(20,10),(21,0)]:
    for mask in MASKS:
     for guardian in[None,12,caster,target]:
      c=case('queue',level,mask,caster=caster,target=target,guardian=guardian);qs.append(dict(case=c,expected_digest=digest(queues(c)['rows'])))
 traces=[];rgba=style=0
 for c in cases(quick):
  w=World(animations,records,c);initial=digest(w.owned());states=[];rasters=[];old_vitals=old_flags=None
  for i in range(1200):
   w.step();frame=w.project_casting();states.append(digest(frame));vitals=[(b['slot'],b['vitals'])for b in frame['bodies']];flags=[n['actorFlags']for n in frame['nodes']]
   if i<4 or i%37==0 or vitals!=old_vitals or flags!=old_flags:
    for selector in[0,1]:
     r=dict(frame=i+1,selector=selector)
     if requires_alpha(w,selector):r['unavailable']='LEGACY_BATTLE_FRAME_DRAW_STYLE';style+=1
     else:r.update(guard.prior.render_reference(w,selector));rgba+=1
     rasters.append(r)
   old_vitals=copy.deepcopy(vitals);old_flags=flags[:]
   if w.stopped:break
   if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in['body','status','rider','attachment','moving-numeric-afterimage']for n in w.nodes):break
  traces.append(dict(case=c,initialOwnedDigest=initial,states=states,rasters=rasters,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),finalOwnedDigest=digest(w.owned()),final=frame));print(c['name'],len(states),traces[-1]['bodySettled'],w.stopped,flush=True)
 out=dict(schema='moli.special96-reference-stage213.v1',authority='Independent retained native equations and authored assets;no product imports/original execution',files=files,geometry=records,queues=qs,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=rgba,explicitUnavailableStyleFrames=style);dest=P/'quick-vectors.json'if quick else A/'original-vectors.json';dest.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(path=str(dest.relative_to(R)),queues=len(qs),scenarios=len(traces),states=out['frames'],RGBA=rgba,unavailableStyleFrames=style)),flush=True)
if __name__=='__main__':main('--quick'in sys.argv)
