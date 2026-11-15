#!/usr/bin/env python3
"""Independent address-based fade and source entry reference; only original synthetic resources."""
from pathlib import Path
import hashlib,importlib.util,json,math,struct
A=Path(__file__).resolve().parent

def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
body=module('entry_body_reference',A.parent/'game-battle-body-v1/generate_vectors.py');_,_,ANIMATIONS,_,_=body.fixtures()
pixels=module('entry_pixel_reference',A.parent/'game-battle-scene-v1/generate_vectors.py')
f=lambda n:struct.unpack('<f',struct.pack('<f',n))[0]

class Fade:
 def __init__(self):self.mem={0xf5f3ec+i*4:0. for i in range(960)};self.initial=False;self.calls=0
 def pair(self,index):return [(0xf5f3ec+index*4,0xf5fb6c+index*4),(0xf5fb6c-index*4,0xf602ec-index*4)]if index&1 else[(0xf5f3ec+index*4,0xf5fb6c+index*4),(0xf5fb64-index*4,0xf602e4-index*4)]
 def step(self):
  if not self.initial:
   count=0
   while True:
    for index in range(count):
     for velocity,position in self.pair(index):
      temporary=self.mem[velocity]+(2 if index&1 else-2);self.mem[velocity]=f(temporary);self.mem[position]=f(self.mem[position]+temporary)
    count=min(240,count+8)
    if not -640<=self.mem[0xf5ff30]<=640:break
   self.initial=True
  for index in range(240):
   for velocity,position in self.pair(index):
    if self.mem[position]>1 if index&1 else self.mem[position]<-1:
     self.mem[position]=f(self.mem[position]-self.mem[velocity]);self.mem[velocity]=f(self.mem[velocity]+(-2 if index&1 else 2))
    else:self.mem[position]=0.
  self.calls+=1
  offsets=[self.mem[0xf5fb6c+i*4]for i in range(480)];velocities=[self.mem[0xf5f3ec+i*4]for i in range(480)]
  return dict(calls=self.calls,counter=240,complete=offsets[0]==0,offsets=offsets,velocities=velocities,rowOffsets=[int(n)for n in offsets])

def capture():
 out=bytearray(640*480*4);image=next(v for v in pixels.IMAGES.values()if v['resource']==1000);x0,y0=320+image['origin'][0],240+image['origin'][1]
 for y in range(image['height']):
  for x in range(image['width']):
   color=pixels.rgba_color(image['pixels'][(image['height']-1-y)*image['width']+x],False,image['embedded'])
   if color:
    at=((y+y0)*640+x+x0)*4;out[at:at+4]=color
 return bytes(out)
CAPTURE=capture()
def fade_pixels(rows,width=640,height=480):
 out=bytearray(width*height*4)
 for y,shift in enumerate(rows[:min(height,480)]):
  left,right=max(0,shift),min(width,640+shift)
  if left>=right:continue
  source=(y*640+left-shift)*4;destination=(y*width+left)*4;out[destination:destination+(right-left)*4]=CAPTURE[source:source+(right-left)*4]
 return hashlib.sha256(out).hexdigest()

def snapshot_refs(refs):
 out=[]
 for ref in refs:
  for n in ref.nodes:
   out.append(dict(id=n['global'],kind=n['kind'],deleted=n['deleted'],position=ref.position[:]if n['kind']=='body'else n['position'][:],screen=n['screen'][:],actorFlags=ref.actor_flags if n['kind']=='body'else n['flags'],animation=n['q'].copy(),scale=ref.scale[:]if n['kind']=='body'else[1.,1.],priority=n['priority']))
 return sorted(out,key=lambda n:(n['priority'],n['id']))
def body_snapshot(refs):
 return [dict(slot=r.slot,state=r.state,dynamicFlags=r.flags,position=r.position[:],facing=r.face,angle=r.angle)for r in refs]

def scenario(spec,fade_rows):
 phase=0;refs=[];capture_count=0;callbacks=0;read=0;deadline=None;rows=[];local=0;notice=False
 c_available=spec.get('wait',0)==0;waits=0
 for index in range(400):
  tick=(spec.get('tickBase',0)+16*(index+1))&0xffffffff;before=phase;characters=None;arrival=None;reoriented=[]
  if spec.get('exitAt')==index:notice=True
  if phase==0:capture_count+=1;fade=fade_rows[0];phase=1;sha=fade['rgbaSha256']
  elif phase==1:
   fade=fade_rows[index];sha=fade['rgbaSha256']
   if fade['complete']:phase=2;capture_count+=1
  else:
   if phase==3 and spec['controls']&3 and not spec['entryWindowPresent']:
    rows.append(dict(phaseBefore=phase,unavailable='LEGACY_BATTLE_ENTRY_POPUP_UNAVAILABLE'));break
   for r in refs:r.step(substate=phase)
   callbacks+=1;frame=pixels.frame_reference({'alternativeRenderer':False},{'nodes':snapshot_refs(refs)});assert 'unavailable'not in frame;sha=frame['rgbaSha256']
   if phase==2:
    if not c_available:
     waits+=1;c_available=waits>=spec.get('wait',0)
    elif not spec.get('ringWrap')and read==0:
     read=1;characters=dict(end=bool(spec.get('end')),records=0 if spec.get('end')else len(spec['bodies']))
     if spec.get('end'):phase=7
     else:
      next_id=1
      for slot,flags in spec['bodies']:
       r=body.BodyReference(ANIMATIONS,slot,flags)
       for n in sorted(r.nodes,key=lambda n:n['id']):n['global']=next_id;next_id+=1
       refs.append(r)
      local=spec.get('localSlot',0)
      for r in refs:
       if r.slot<20 and spec['controls']&(2 if r.slot<10 else 1):
        row=body.layout[r.slot];r.angle=body.angle(row['entry'][0]-row['target'][0],row['entry'][1]-row['target'][1]);r.face=body.facing(r.angle);r.animate(r.body,1);reoriented.append(r.slot)
      phase=3
   elif phase==3:
    marked=[]
    for r in refs:
     if r.slot<20 and not r.flags&1:r.state=2;marked.append(r.slot)
    arrival=dict(ready=not marked,marked=marked)
    if not marked:phase=4;deadline=(tick+30000)&0xffffffff
  if notice and(before>=2 or before==1 and fade['complete']):phase=7;notice=False
  rows.append(dict(phaseBefore=before,phaseAfter=phase,captures=capture_count,callbackPasses=callbacks,Cread=read,characters=characters,arrival=arrival,reoriented=reoriented,localSlot=local,selectionDeadline=deadline,exitNotice=notice,bodies=body_snapshot(refs),rgbaSha256=sha))
  if phase==7 or phase==4 and sum(r['phaseBefore']==4 for r in rows)>=3 or spec.get('ringWrap')and len(rows)>=60:break
 return rows

def main():
 fade=Fade();fade_rows=[]
 while True:
  row=fade.step();row['rgbaSha256']=fade_pixels(row['rowOffsets']);fade_rows.append(row)
  if row['complete']:break
 assert len(fade_rows)==54
 specs=[dict(name='ready',bodies=[[0,0],[10,0]],controls=0,entryWindowPresent=False),dict(name='delayed',bodies=[[0,0],[10,0]],controls=0,entryWindowPresent=False,wait=3),dict(name='arrivals',bodies=[[0,1],[10,1]],controls=0,entryWindowPresent=False),dict(name='facing',bodies=[[0,0],[10,0]],controls=3,entryWindowPresent=True,localSlot=10),dict(name='status',bodies=[[0,16],[10,1040]],controls=0,entryWindowPresent=False),dict(name='dead',bodies=[[0,2],[10,0]],controls=0,entryWindowPresent=False),dict(name='extra-slot',bodies=[[0,0],[20,1]],controls=0,entryWindowPresent=False),dict(name='popup',bodies=[[0,0],[10,0]],controls=3,entryWindowPresent=False),dict(name='end',bodies=[],controls=0,entryWindowPresent=False,end=True),dict(name='exit-fade',bodies=[[0,0],[10,0]],controls=0,entryWindowPresent=False,exitAt=8),dict(name='ring-wrap',bodies=[[0,0],[10,0]],controls=0,entryWindowPresent=False,ringWrap=True),dict(name='timer-wrap',bodies=[[0,0],[10,0]],controls=0,entryWindowPresent=False,tickBase=0xfffffff0)]
 scenarios=[dict(**spec,frames=scenario(spec,fade_rows))for spec in specs]
 clips=[]
 for width,height in [(640,480),(320,240),(700,500),(1,1)]:
  for call in [1,18,36,54]:clips.append(dict(width=width,height=height,call=call,rgbaSha256=fade_pixels(fade_rows[call-1]['rowOffsets'],width,height)))
 out=dict(schema='moli.original-battle-entry-stage185.v1',original_synthetic_only=True,authority='independent address-based source fade/controller and prior independent body/indexed pixel references; no product imports or original game execution',captureSha256=hashlib.sha256(CAPTURE).hexdigest(),fade=fade_rows,clipCases=clips,scenarios=scenarios,counts=dict(fade_calls=54,row_states=54*480,clip_cases=len(clips),scenarios=len(scenarios),scenario_steps=sum(len(r['frames'])for r in scenarios),scenario_pixel_frames=sum('rgbaSha256'in f for r in scenarios for f in r['frames'])))
 (A/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out['counts']))
if __name__=='__main__':main()
