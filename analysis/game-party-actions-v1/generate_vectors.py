#!/usr/bin/env python3
"""Independent Python badge/party policy and full-scene reference. No product imports."""
from pathlib import Path
import importlib.util,json,math
A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('party_actions_prior',A.parent/'game-actor-presentation-v1/generate_vectors.py');prior=importlib.util.module_from_spec(spec);spec.loader.exec_module(prior)
scene=prior.scene
def badge(r):
 p=r['primary'];action='absent'
 if r['dirty'] and p&256:action='create'
 elif not p&256:action='remove' if r['present'] else 'absent'
 elif r['present']:action='remove' if p&1024 else 'advance'
 elif not(p&1024 and p&16384 and not p&32768):action='create'
 return dict(action=action,dirty=False if action=='create' else r['dirty'],resourceId=(r['value16'] if r['mode15'] in[1,2] else 103100)if action=='create'else None)
def party(r):
 reason=None
 if any(r[k]for k in['inputGuard','movementGuard','coordinationGuard']):reason='guard'
 elif((r['lastTick']+500)&0xffffffff)>=r['tick']:reason='cooldown'
 elif r['mode']==0:
  if not 0<=r['facing']<8:reason='facing'
  elif not r['neighborEligible']:reason='neighbor'
  elif r['flags']&256:reason='leader'
 return dict(allowed=reason is None,reason=reason,join=1 if r['mode']==0 else 0)
def unit(mode,value):return f'H#| 1|1C|2|3|4|100010|0|0|Hero|Guild|1|0|0|Tail|{mode}|{value}| '
def main():
 plans=[];commands=[];anchors=[]
 for flags in range(16):
  p=sum(bit for i,bit in enumerate([256,1024,16384,32768])if flags&(1<<i))
  for mode in[-1,0,1,2,3]:
   for value in[-5,0,110401]:
    for dirty in[False,True]:
     for present in[False,True]:
      r=dict(primary=p,mode15=mode,value16=value,dirty=dirty,present=present);plans.append(dict(input=r,expected=badge(r)))
 for mode in[0,1,-1]:
  for flags in[0,256,512,768]:
   for guards in range(8):
    for last,tick in[(0,500),(0,501),(1000,1500),(1000,1501),(0xffffff00,100),(0xffffff00,245),(0xffffffff,500)]:
     for face in[-1,0,7,8]:
      for eligible in[False,True]:
       r=dict(mode=mode,flags=flags,facing=face,inputGuard=guards&1,movementGuard=(guards>>1)&1,coordinationGuard=(guards>>2)&1,lastTick=last,tick=tick,neighborEligible=eligible);commands.append(dict(input=r,expected=party(r)))
 for resource in[99999,*range(100000,101001),110401]:
  for x,y in[(160,120),(32766,-32766),(2147483647,-2147483648)]:
   r=dict(parentResource=resource,screenX=x,screenY=y,offsetX=7,offsetY=-4,originX=-3,originY=2);anchors.append(dict(input=r,expected=[scene.short(x+10),scene.short(y+prior.height(resource)-6)]))
 old=json.load(open(A.parent/'game-actor-presentation-v1/original-vectors.json'));files={r['path']:bytes.fromhex(r['bytesHex'])for r in old['files']};gs=scene.anime.groups();gs[0].update(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0,attachmentIndex=files['Bin/CrdInfo.bin'],attachmentData=files['Bin/Crd.bin']);animations=scene.anime.parse(gs)
 events=[dict(at=i,plain=p)for i,p in[(10,unit(2,110401)),(18,unit(1,110401)),(25,unit(0,110401)),(32,unit(0,110401)),(40,unit(1,110402)),(48,'Kk0 1 0 '),(55,'Kk0 0 1 '),(65,unit(2,110403)),(80,unit(2,110403)),(100,unit(0,0))]]
 primary=0x340;forced=True;mode=2;value=103100;dirty=True;child=None;body=scene.anime.initial();model=scene.Scene();model.animations=animations;planes=scene.planes(1);base=scene.raster;frames=[];before=json.load(open(A.parent/'game-legacy-scene-frame-v1/original-vectors.json'));cache={}
 for i in range(128):
  for e in events:
   if e['at']!=i:continue
   if e['plain'].startswith('H#|'):
    cols=e['plain'].split(' ',1)[1].strip().split('|');raw=int(cols[15]);dirty=dirty or value!=raw;mode=int(cols[14]);mode=mode if mode in[1,2]else 0;value=raw if mode else 0
    if mode==2 and not primary&512:primary|=256
    elif mode!=2 and not forced:primary&=65535^256
   elif e['plain']=='Kk0 0 1 ':primary&=65535^512;forced=False;primary=primary if mode==2 else primary&~256
  at=[160,120];sounds=[];body,result=scene.anime.step(body,scene.anime.ctx(resourceId=100010,action=0,facing=4,mode=0,staticFlip=False,actorFlags=0xb4,soundScene=before['runtime']['soundScene']),animations)
  if result['event']:sounds.append(dict(**result['event'],actorId=100,screenPosition=at[:]))
  plan=badge(dict(primary=primary,mode15=mode,value16=value,dirty=dirty,present=child is not None));dirty=plan['dirty'];command=None;badge_row=dict(plan=plan,helperCalls=0,queued=False)
  if plan['action']=='create':child=dict(resource=plan['resourceId'],state=scene.anime.initial())
  elif plan['action']=='remove':child=None
  elif plan['action']=='advance':
   q,result=scene.anime.step(child['state'],scene.anime.ctx(resourceId=child['resource'],action=0,facing=0,mode=0,staticFlip=False,actorFlags=0x20,soundScene=before['runtime']['soundScene']),animations);child['state']=q;g=q['geometry'];anchor=[scene.short(at[0]+q['drawOffsetX']-(g['originX']if g else 0)),scene.short(at[1]+prior.height(100010)+q['drawOffsetY']-(g['originY']if g else 0))]
   if g and q['graphicIndex']>=1000:
    command=scene.ordinary(q['graphicIndex'],*anchor,10,q);command.update(flags=0,paletteSelector=0,color=0xffffffff,flip=0)
   if result['event']:sounds.append(dict(**result['event'],actorId=100,child='badge',screenPosition=at[:]))
   badge_row.update(helperCalls=1,queued=True,screenPosition=anchor,code=result['code'],graphicIndex=q['graphicIndex'],nextFrame=q['nextFrame'])
  g=body['geometry'];anchor=[scene.short(at[j]+body[['drawOffsetX','drawOffsetY'][j]]-(g[['originX','originY'][j]]if g else 0))for j in range(2)];body_command=scene.ordinary(body['graphicIndex'],*anchor,10,body)if g and body['graphicIndex']>=1000 else None;children=[x for x in[command,body_command]if x]
  root=dict(graphicIndex=body['graphicIndex'],position=[128,192],screenPosition=anchor,sortFlag=1,ordinal=0,id=100,command=dict(composite=True))
  def raster(commands,w,h):
   expanded=[];owners=[]
   for j,c in enumerate(commands):
    for d in children if 'composite'in c else[c]:expanded.append(d);owners.append(j)
   key=json.dumps([expanded,w,h],sort_keys=True)
   if key not in cache:
    r=base(expanded,w,h);r['drawOrder']=[owners[j]for j in r['drawOrder']];cache[key]=r
   return cache[key]
  scene.raster=raster;tick=1000+math.ceil(i*prior.clock.PERIOD);request=dict(camera=[128,192],center=[160,120],width=320,height=240,runtime=before['runtime'],tick=tick)
  try:rendered=model.step(12,12,planes,1,dict(tileCenter=[2,3],drawPrimitives=False),request,[root])
  finally:scene.raster=base
  frames.append(dict(tick=tick,primary=primary,mode15=mode,value16=value,dirty=dirty,badgeResource=child['resource']if child else None,badge=badge_row,events=sounds,submitted=0 if scene.graphic(body['graphicIndex'])['resourceId']==1 else len(children),rgbaSha256=rendered['rgbaSha256']))
 out=dict(schema='moli.party-actions-original-stage179.v1',original_synthetic_only=True,authority='independent Python scalar and complete scene reference; no product imports',plans=plans,commands=commands,anchors=anchors,files=old['files'],full=dict(initial=[unit(2,103100),'HFs 0 1|100|0|0|0|0|Hero '],events=events,frames=frames))
 (A/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(plans=len(plans),commands=len(commands),anchors=len(anchors),frames=len(frames),unique_rasters=len({r['rgbaSha256']for r in frames}))))
if __name__=='__main__':main()
