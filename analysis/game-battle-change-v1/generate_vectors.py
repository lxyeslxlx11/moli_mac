#!/usr/bin/env python3
"""Independent POS/EQU body/pool/pixel reference using only original synthetic resources."""
from pathlib import Path
import importlib.util, json, struct
A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('change_existing_reference',A.parent/'game-battle-status-v1/generate_vectors.py');status=importlib.util.module_from_spec(spec);spec.loader.exec_module(status)
skill=status.skill;anime=skill.anime;f=skill.f;layout=skill.layout
def pair(slot):return slot+5 if 0<=slot<=4 or 10<=slot<=14 else slot-5
def fixtures():
 _,_,prior=status.fixtures();files={r['path']:bytes.fromhex(r['bytesHex'])for r in prior};index=bytearray(files['Bin/AnimeInfo.bin']);data=bytearray(files['Bin/Anime.bin']);known={struct.unpack_from('<I',index,at)[0]for at in range(0,len(index),12)}
 info=bytearray(files['Bin/GraphicInfo.bin']);pixels=bytearray(files['Bin/Graphic.bin'])
 if 0x5731 not in {struct.unpack_from('<I',info,at+36)[0]for at in range(0,len(info),40)}:
  raw=b'RD\0\0'+struct.pack('<iiI',8,8,80)+bytes(0 if i%5==0 else 17+i%3 for i in range(64));row=bytearray(40);struct.pack_into('<IIIiiii',row,0,6000,len(pixels),len(raw),-2,-2,8,8);struct.pack_into('<I',row,36,0x5731);info.extend(row);pixels.extend(raw)
 files.update({'Bin/GraphicInfo.bin':bytes(info),'Bin/Graphic.bin':bytes(pixels)})
 for resource in [100030]:
  if resource in known:continue
  blocks=[anime.action(direction,action,96,[(graphic,0 if action==0 else -1,0,([10001,20001,0][i]if action==5 else 0))for i,graphic in enumerate([1005,1002,1004])])for direction in(range(8)if resource==100030 else[0])for action in(range(20)if resource==100030 else[0])]
  index.extend(struct.pack('<IIHH',resource,len(data),len(blocks),0));data.extend(b''.join(blocks))
 files.update({'Bin/AnimeInfo.bin':bytes(index),'Bin/Anime.bin':bytes(data)})
 info=files['Bin/GraphicInfo.bin'];records=[]
 for at in range(0,len(info),40):
  n,offset,size,ox,oy,w,h=struct.unpack_from('<IIIiiii',info,at);resource=struct.unpack_from('<I',info,at+36)[0];records.append(dict(index=n,originX=ox,originY=oy,width=w,height=h,resourceId=resource));raw=files['Bin/Graphic.bin'][offset:offset+size];head=20 if raw[2]==2 else 16;skill.scene.IMAGES[n]=dict(index=n,resource=resource,origin=[ox,oy],width=w,height=h,pixels=raw[head:head+w*h],embedded=raw[head+w*h:]if raw[2]==2 else None)
 def geo(kind,value):
  r=next(r for r in records if r['index'if kind=='index'else'resourceId']==value);return{k:r[k]for k in ['index','originX','originY','width','height']}
 anime.geo=geo;groups=[dict(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0)]
 return anime.parse(groups),records,[dict(path=p,bytesHex=b.hex())for p,b in files.items()]

class Body(skill.Body):
 def __init__(self,world,slot,dead=False):
  super().__init__(world,slot,100020 if slot%2==0 else 100021);self.next_resource=0;self.aux_resource=0
  if dead:
   self.flags|=2;self.saved|=2;self.vitals[0]=0;self.action=10;self.category=0
   while self.animate(self.body,1)!=1:pass
   geometry=self.body['q']['geometry'];n=self.w.node(self,'death',resource=0x1ae59,flags=0x40000,parent=self.body,position=[f(int(geometry['width']/2)+self.body['q']['drawOffsetX']+self.position[0]),f(int(geometry['height']/2)+self.body['q']['drawOffsetY']+self.position[1])]);n['drawPriority']=200;self.animate(n,1);self.screen(n);self.animate(self.body,0)
 def body_step(self):
  if self.state==66:
   node=self.w.node(self,'message',resource=0x5731,flags=0x40000,position=self.position,parent=self.body);node['height']=-8.;self.animate(node,1);self.screen(node)
   if not self.flags&0x60:self.animate(self.body,1)
   self.pop()
  elif self.state==78:self.pop()
  elif self.state==64:
   self.action=5;self.resource=self.next_resource
   if self.animate(self.body,1)==1:self.pop();self.body['q']['signal']=0
  else:super().body_step()
 def project(self):return dict(super().project(),resourceId=self.resource,nextResource=self.next_resource,resource13a8=self.aux_resource)

class World(skill.World):
 def __init__(self,animations,records,row):
  self.animations,self.records=animations,records;self.nodes=[];self.next_id=1;self.random=skill.old.Random(12345);self.phase=self.passes=0;self.slow=row['slow'];self.events=[];self.bodies={}
  slots=[row['slot']]
  if row['kind']=='POS'and row['pairPresent']:slots.append(pair(row['slot']))
  for slot in sorted(slots):self.bodies[slot]=Body(self,slot,slot in row.get('deadSlots',[]))
  self.local=row['localSlot'];self.original_ids={str(slot):b.body['id']for slot,b in self.bodies.items()}
  if row['kind']=='POS':
   old=row['slot'];new=pair(old);primary=self.bodies[old];other=self.bodies.get(new)
   if self.local==old:self.local=new
   primary.slot=new
   if other:other.slot=old;self.bodies[old]=other
   else:self.bodies.pop(old)
   self.bodies[new]=primary
   primary.actions=[78,11,-1];primary.read=0;primary.write=1;primary.busy=1;primary.state=78;primary.speed=3.;primary.percent=100
   if other and other.action!=10:other.actions=[11,-1];other.read=0;other.write=0;other.busy=1;other.state=11;other.speed=3.;other.percent=100
  else:
   body=self.bodies[row['slot']];body.actions=[66,78,64,-1];body.read=0;body.write=2;body.busy=1;body.state=66;body.next_resource=row['resource'];body.aux_resource=row['auxResource']
 def step_effect(self,node):
  if node['kind']=='death':
   if node['parent']['deleted']:node['deleted']=True
   else:
    body=node['owner'];body.animate(node,0);geometry=body.body['q']['geometry'];node['position']=[f(int(geometry['width']/2)+body.body['q']['drawOffsetX']+body.position[0]),f(int(geometry['height']/2)+body.body['q']['drawOffsetY']+body.position[1])]
  else:super().step_effect(node)
 def project(self):
  p=super().project();p['bodies'].sort(key=lambda b:b['slot']);return p

def main():
 animations,records,files=fixtures();rows=[]
 for slot in range(22):
  for present in [True,False]:rows.append(dict(name=f'POS-{slot}-'+('pair'if present else'single'),kind='POS',slot=slot,pairPresent=present,localSlot=slot if slot%2==0 else 21,deadSlots=[],slow=False))
 for name,dead in [('dead-primary',[0]),('dead-pair',[5])]:rows.append(dict(name=name,kind='POS',slot=0,pairPresent=True,localSlot=0,deadSlots=dead,slow=False))
 rows.append(dict(name='quartered-position',kind='POS',slot=10,pairPresent=True,localSlot=10,deadSlots=[],slow=True))
 for slot,resource,slow in [(0,100030,False),(10,100021,False),(5,100030,True)]:rows.append(dict(name=f'EQU-{slot}',kind='EQU',slot=slot,resource=resource,auxResource=100031,localSlot=slot,slow=slow))
 traces=[]
 for row in rows:
  w=World(animations,records,row);states=[];renders=[]
  for _ in range(1800):
   states.append(w.step());renders.append(skill.render_reference(w))
   if all(not b.busy for b in w.bodies.values())and all(n['kind']in['body','death']for n in w.nodes):break
  assert all(not b.busy for b in w.bodies.values()),row['name']
  traces.append(dict(row,currentLocalSlot=w.local,originalNodeIds=w.original_ids,states=states,renders=renders))
 out=dict(schema='moli.original-battle-change-reference-stage193.v1',authority='Independent Python static-source POS/EQU body/pool and original indexed raster; no product imports or original execution',files=files,geometry=records,traces=traces,frames=sum(len(t['states'])for t in traces))
 (A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(cases=len(traces),frames=out['frames'])))
if __name__=='__main__':main()
