#!/usr/bin/env python3
"""Fixed37c4 source equations; original synthetic bytes, no product imports.

207 adds420170/420130,41f660/41f5b0 and4032f0 integer boxes to the retained
independent206 equations. The native raw tuple skip in259/9 is intentional.
"""
from pathlib import Path
import copy,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-physical-specials-v1'
s=importlib.util.spec_from_file_location('specials_prior',A.parent/'game-battle-physical-projectiles-v1/generate_vectors.py')
prior=importlib.util.module_from_spec(s);s.loader.exec_module(prior)
anime=prior.anime;skill=prior.skill;f=prior.f;digest=prior.digest;signed=prior.signed
ROWS=[
 [28881,28881,28882,28882,28883,28883,28884,28884,28885,28885,28886,28886,28887,28887,28888,28888],
 [28889,28889,28890,28890,28891,28891,28892,28892,28893,28893,28894,28894,28895,28895,28896,28896],
 [28897,28897,28898,28898,28899,28899,28900,28900,28901,28901,28902,28902,28903,28903,28904,28904],
 [28905,28905,28906,28906,28907,28907,28908,28908,28909,28909,28910,28910,28911,28911,28912,28912],
 [28895,28904,28895,28904,28895,28904,28895,28904,28895,28904,28895,28904,28895,28904,28895,28904],
 [28913,28913,28913,28913,28914,28914,28914,28914,28915,28915,28915,28915,28916,28916,28916,28916]]

def fixtures():
 animations,records,source=prior.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in source}
 info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin']);known={r['resourceId']for r in records};index=max(r['index']for r in records)+1
 for resource in [0x71b1,0x71b2,*sorted(set(x for row in ROWS for x in row))]:
  if resource in known:continue
  width,height=8,7;paint=bytes(0 if(i+resource)%5==0 else 17+(i+resource)%3 for i in range(width*height));raw=b'RD\0\0'+struct.pack('<iiI',width,height,len(paint)+16)+paint
  row=bytearray(40);struct.pack_into('<IIIiiii',row,0,index,len(pixels),len(raw),-3,-4,width,height);struct.pack_into('<I',row,36,resource);info.extend(row);pixels.extend(raw)
  records.append(dict(index=index,resourceId=resource,originX=-3,originY=-4,width=width,height=height));skill.scene.IMAGES[index]=dict(index=index,resource=resource,origin=[-3,-4],width=width,height=height,pixels=paint,embedded=None);index+=1
 files.update({'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels)})
 return animations,records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]

def queues(c):
 if c.get('variant',0)==0:
  p=prior.prior.queues(c)
  if c['category']==259 and c['level']==9:
   own=next(r for r in p['rows']if r['slot']==p['principal']);at=own['actions'].index(242)+1;own['actions'][at:at]=[72,240]
   own['tuples'][0:0]=[own['tuples'][0][:],[0,0,15,0]]
  return p
 p=prior.queues(c);own=next(r for r in p['rows']if r['slot']==p['principal'])
 if c['category']==258:
  own['assignments']['rememberedPosition']=[318,270];at=own['actions'].index(147)+1;own['actions'][at:at]=[8,6,10]
 if c['category']in[258,259,266]and c['level']==9:
  own['tuples'].insert(0,[3 if c['category']==258 else 5 if c['category']==259 else 0,0,15,0]);own['actions'].insert(own['actions'].index(53),240)
 return p

class Box:
 def __init__(self,value,random):self.mask=random.next();self.encoded=(value^self.mask)&0xffffffff;self.reads=0
 def peek(self):return signed(self.encoded^self.mask)
 def read(self,random):
  self.reads+=1
  if self.reads>20:
   value=self.peek();self.reads=0;self.mask=random.next();self.encoded=(value^self.mask)&0xffffffff
  return self.peek()
 def increment(self,random):self.encoded=(signed(self.read(random)+1)^self.mask)&0xffffffff
 def snapshot(self):return dict(value=self.peek(),encoded=self.encoded,mask=self.mask,reads=self.reads)

class Body(prior.Body):
 def metadata(self):
  super().metadata()
  if self.category==259 and self.level==9:self.w.tile(0,15)
 def body_step(self):
  if self.state==240:
   selector,_,duration,_=self.tuples[self.tuple_read];self.w.tile(selector,duration);self.tuple_read+=1;self.pop();return
  if self.state==67:
   self.w.transient(self,self.message)
   if not self.flags&0x60:self.animate(self.body,1)
   self.pop();return
  return super().body_step()

class World(prior.World):
 def __init__(self,animations,records,c):
  self.direct=[];self.direct_used=False;super().__init__(animations,records,c)
  for b in self.bodies.values():b.__class__=Body
  self.plan=queues(c)
  names={'classCode':'category','skillLevel':'level','mpCost':'cost','physicalVariant':'variant','afterImageEnabled':'after_image_enabled','rememberedPosition':'remember','messageResource':'message','numberValue':'number_value','numberStyle':'number_style','effectResource':'effect'}
  for row in self.plan['rows']:
   b=self.bodies[row['slot']];b.actions=row['actions']+[-1]if row['actions']else[0,-1];b.read=0;b.write=len(row['actions'])-1;b.busy=int(bool(row['actions']));b.tuples=copy.deepcopy(row['tuples'])+[[-1,0,0,0]]+[[0,0,0,0]for _ in range(199-len(row['tuples']))];b.tuple_read=0
   for key,value in row['assignments'].items():
    if key!='physicalFamily':setattr(b,names[key],copy.deepcopy(value))
  b=self.bodies[self.plan['principal']];b.state=b.actions[0]
 def anonymous(self,parent,role,flags,priority):
  b=super().anonymous(parent,role,flags,priority);b.__class__=Body;return b
 def transient(self,parent,resource):
  n=self.node(parent,'physical-transient',resource=resource,flags=0x40000,position=parent.position[:],screenSpace=True);n.update(height=-8.,special=dict(kind='transient',lifetime=30));self.animate(n,1);parent.screen(n);return n
 def single(self,parent,base):
  if parent.category==258:self.transient(self.bodies[parent.tuples[parent.tuple_read][0]],0x71b2 if parent.level==9 else 0x71b1)
  return super().single(parent,base)
 def tile(self,selector,duration):
  if duration<1:return None
  n=self.node(self.manager,'physical-tile',flags=0x40002,position=[0.,0.],screenSpace=True);n.update(drawPriority=0,state=selector)
  limit=Box(duration,self.random);counter=Box(0,self.random);n['special']=dict(kind='tile',pulse=0,descending=0,limit=limit,counter=counter);return n
 def overlay(self,group):
  start=len(self.submissions);super().overlay(group);self.direct.extend(self.submissions[start:])
 def step_effect(self,n):
  if n['kind']=='physical-transient':n['counter']+=1;n['deleted']|=n['counter']>=n['special']['lifetime'];return
  if n['kind']=='physical-tile':
   s=n['special']
   if s['descending']==0:
    s['pulse']+=1
    if s['pulse']>=15:s['descending']=1
   else:
    s['pulse']-=1
    if s['pulse']<=0:s['descending']=0
   self.direct_used=True;self.direct.extend(dict(resourceId=ROWS[n['state']][s['pulse']],x=32+64*x,y=24+48*y,priority=3)for x in range(10)for y in range(10))
   limit=s['limit'].read(self.random);counter=s['counter'].read(self.random)
   if counter>=limit:n['deleted']=True
   s['counter'].increment(self.random);return
  return super().step_effect(n)
 def step(self):self.direct=[];return super().step()
 def project_casting(self):
  p=super().project_casting()
  for row,n in zip(p['nodes'],self.nodes):
   if 'special'in n:
    s=n['special'];row['physicalSpecial']={k:v.snapshot()if isinstance(v,Box)else v for k,v in s.items()}
  if self.direct_used:p['directSubmissions']=copy.deepcopy(self.direct)
  return p

def render_reference(w,selector):
 p=w.project_casting();scene=skill.scene;depth=scene.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=n['alternateY'],flags=n['actorFlags'],depthKey=0)for n in p['nodes']if n['actorFlags']&0x20000]);priorities={n:(i+9)&255 for i,n in enumerate(depth)};commands=[];skipped=[]
 for d in w.direct:
  g=next(g for g in scene.IMAGES.values()if g['resource']==d['resourceId']);commands.append(dict(id=None,kind='casting-overlay',index=g['index'],flags=0,x=d['x']+g['origin'][0],y=d['y']+g['origin'][1],priority=3))
 for n in p['nodes']:
  q=n['animation'];flags=n['actorFlags'];reason='renderer-filter'if(flags&0x8000 and selector==0 or flags&0x10000 and selector==1)else'graphic-missing'if q['graphicIndex']==-1 else'deleted'if n['deleted']else'hidden'if flags&2 else None
  if reason:skipped.append(dict(id=n['id'],reason=reason));continue
  scale=n['scale'];commands.append(dict(id=n['id'],kind=n['kind'],index=q['graphicIndex'],flags=(q['drawFlags']&~n['drawFlagMask'])|(n['drawFlagValue']&n['drawFlagMask']),x=n['screen'][0]+int(q['drawOffsetX']*scale[0]),y=n['screen'][1]+int(q['drawOffsetY']*scale[1]),priority=priorities.get(n['id'],n['drawPriority']),**({'scale':scale}if scale!=[1.,1.]else{})))
 bg=next(g for g in scene.IMAGES.values()if g['resource']==1000);commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0]+w.offset[0],y=240+bg['origin'][1]+w.offset[1],priority=0))
 plan=dict(depthOrder=depth,commands=commands,skipped=skipped,drawOrder=[commands[i]['id']for i in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))]);return dict(planDigest=digest(plan),rgbaSha256=scene.raster(commands))

case=prior.case;CLASSES=sorted([*prior.CLASSES,258])
def main(quick=False):
 animations,records,files=fixtures();cases=[];queue_vectors=[]
 # Existing206 runs all other810-path obligations separately. This trace set targets
 # every newly enabled level/variant plus native direct259/9 metadata and counters.
 for category in[258,259,266]:
  for level in(range(10)if category==258 else[9]):
   for variant in[1,2,3]:cases.append(case('class%d-level%d-variant%d'%(category,level,variant),category,variant,level))
 if quick:cases=[c for c in cases if c['level']in[0,9]]
 else:
  for category in[258,259,266]:
   for variant in[1,2,3]:
    for name,flags,value in[('RID',0x800001,9),('critical',3,12),('dodge',8,12),('guard',0x100,12),('immune',0x108,12),('zero',0,0),('KO',0x21,90),('condition',0x80001,12),('deflect',0x20000001,12)]:
     hit=[0,10,flags,value]+([[100040,100041,100050]]if flags&0x800000 else[]);cases.append(case('%s%d-variant%d'%(name,category,variant),category,variant,9,hits=[hit]))
   for variant in[1,2,3]:cases.append(case('offset%d-variant%d'%(category,variant),category,variant,9,offset=[11,-7]))
  for name,flags,value,resource in[('direct2599',1,12,100080),('direct2599-RID',0x800001,9,100080),('direct2599-counter',1,12,100081),('direct2599-dodge',8,12,100080),('direct2599-KO',0x21,90,100080),('direct2599-zero',0,0,100080)]:
   cases.append(case(name,259,0,9,hits=[[0,10,flags,value]+([[100040,100041,100050]]if flags&0x800000 else[])],resource=resource))
  for category in CLASSES:
   for level in range(10):
    for variant in[1,2,3]:
     for caster,target in[(0,10),(1,10),(10,0),(20,0),(21,10)]:
      for flags in[0,1,3,8,0x20,0x21,0x40,0x41,0x100,0x108,0x400,0x80000,0x100000,0x800000,0x20000000,0x10000000]:
       c=case('queue',category,variant,level,caster,[[caster,target,flags,12]+([[100040,100041,100050]]if flags&0x800000 else[])]);queue_vectors.append(dict(input=[category,level,variant,caster,target,flags],expected_digest=digest(queues(c)['rows'])))
 traces=[]
 for c in cases:
  w=World(animations,records,c);states=[];rasters=[];old_vitals=None;previous_tiles=0
  for i in range(3000):
   frame=w.step();states.append(digest(frame));values=[b.vitals[:]for b in w.bodies.values()];tiles=sum(n['kind']=='physical-tile'for n in w.nodes)
   if i<4 or i%29==0 or values!=old_vitals or tiles!=previous_tiles or any(n['kind']=='physical-tile'and n['deleted']for n in w.nodes):
    for selector in[0,1]:rasters.append(dict(frame=i+1,selector=selector,**render_reference(w,selector)))
   old_vitals=copy.deepcopy(values);previous_tiles=tiles
   if w.stopped:break
   if all(b.detached or not b.busy for b in w.bodies.values())and all(n['kind']in['body','status','rider','attachment','status-skill-overlay','status-skill-field']for n in w.nodes)and not any(n['kind']=='body'and n['owner'].role for n in w.nodes):break
  traces.append(dict(case=c,states=states,rasters=rasters,stopped=w.stopped,bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),final=frame));print(c['name'],len(states),flush=True)
 out=dict(schema='moli.physical-specials-reference-stage207.v1',authority='Independent original-source equations and authored synthetic archives;no product imports or original execution',files=files,geometry=records,queues=queue_vectors,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces))
 destination=P/'quick-vectors.json'if quick else A/'original-vectors.json';destination.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(path=str(destination.relative_to(R)),queues=len(queue_vectors),scenarios=len(traces),frames=out['frames'],RGBA=out['rgbaFrames'])),flush=True)
if __name__=='__main__':main('--quick'in sys.argv)
