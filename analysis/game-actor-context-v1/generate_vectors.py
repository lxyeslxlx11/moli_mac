#!/usr/bin/env python3
"""Independent original category flags, source constructor facing and per-frame key filtering."""
from pathlib import Path
import itertools,json,hashlib,importlib.util,math
A=Path(__file__).resolve().parent
def main():
 categories=[-2147483648,-1,0,1,2,3,4,6,13,27,32,71,72,2147483647];values=[0,64,256,320,-1,2147483647]
 flags=[]
 for c,v in itertools.product(categories,values):
  t={1:8,6:17,13:17,27:17,32:33,71:257}.get(c,1);d=256 if c in [1,32]else 512 if c==3 else 4096
  if d==4096 and v&320==320:d+=4194304
  flags.append(dict(category=c,value7=v,typeFlags=t,drawFlags=d,bodyOrMask=52|d))
 facing=[]
 for c,res,mode,face in itertools.product([-1,1,3,4,6,71],[99999,100000,199999,200000,-1],[0,1,-1],[-1,0,7]):
  facing.append(dict(category=c,resource=res,sceneMode=mode,facing=face,expected=0 if c>3 and mode==0 and not 100000<=res<200000 else face))
 entries=[]
 for x,y in itertools.product([-17,-16,-1,0,1,16,17],repeat=2):entries.append(dict(local=False,graphicIndex=1024,coordinates=[x,y]))
 entries.extend([dict(local=True,graphicIndex=1024,coordinates=[99,99])]*2)
 # Explicit overflow:100 distinct stored keys; 101st/its repeat must both remain visible.
 overflow=[dict(local=False,graphicIndex=1000+i,coordinates=[0,0])for i in range(101)];overflow.extend([overflow[100],overflow[0]])
 def filtered(rows):
  seen=[];out=[]
  for r in rows:
   x,y=r['coordinates'];key=[r['graphicIndex'],x,y]
   if not r['local'] and not(-16<=x<=16 and -16<=y<=16):result=dict(visible=False,remove=True,reason='outside-local-range')
   elif key in seen:result=dict(visible=False,remove=False,reason='duplicate-graphic-cell')
   else:
    result=dict(visible=True,remove=False,reason='visible')
    if len(seen)<100:seen.append(key)
   out.append(dict(input=r,expected=result))
  return out
 # Reuse the independently checked original animation/map composition, never production JavaScript.
 def load(name,path):
  s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
 scene=load('actor_context_scene_reference',A.parent/'game-legacy-scene-frame-v1/generate_vectors.py');clock=load('actor_context_clock_reference',A.parent/'game-input-runtime-v1/generate_vectors.py')
 old=json.load(open(A.parent/'game-legacy-scene-frame-v1/original-vectors.json'))
 definitions=[dict(id=100,kind='local',coordinates=[2,3],facing=4,resource=100001,body=0xb4,staticFlip=False),
  dict(id=200,kind='character',category=0,coordinates=[3,3],facing=4,resource=80002,body=0x1034,staticFlip=True),
  dict(id=201,kind='character',category=1,coordinates=[4,3],facing=4,resource=80002,body=0x134,staticFlip=False),
  dict(id=202,kind='character',category=71,coordinates=[5,3],facing=4,resource=100001,body=0x1034,staticFlip=True)]
 for i,resource,xy in [(300,80002,[4,4]),(301,80002,[4,4]),(302,80004,[4,4]),(303,80002,[20,3]),(304,80002,[18,3])]:definitions.append(dict(id=i,kind='graphic-object',coordinates=xy,facing=0,resource=resource,body=0x434,staticFlip=False))
 def base62(n):
  text=''
  while n or not text:text='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+text;n//=62
  return text
 unit_rows=[]
 for d in definitions[1:]:
  if d['kind']=='character':r=[d['category'],base62(d['id']),*d['coordinates'],d['facing'],d['resource'],0,0,'OriginalActor','OriginalGuild',0,0,0,'OriginalTail',0,0,'']
  else:r=[base62(d['id']),*d['coordinates'],d['resource'],0,'OriginalGraphic',0]
  unit_rows.append('|'.join(map(str,r)))
 plain=bytes.fromhex(old['protocol']['beforePlainHex'][3]).rstrip(b' ')+b'\t'+'\t'.join(unit_rows).encode()+b' '
 states={d['id']:scene.anime.initial()for d in definitions};live={d['id']for d in definitions};animations=scene.anime.parse(scene.anime.groups());model=scene.Scene();planes=scene.planes(1);frames=[]
 for step in range(120):
  seen=[];roots=[];culled=[];submitted=[]
  for d in definitions:
   if d['id']not in live:continue
   state,_=scene.anime.step(states[d['id']],scene.anime.ctx(resourceId=d['resource'],action=0,facing=d['facing'],staticFlip=d['staticFlip'],soundScene=old['runtime']['soundScene'],actorFlags=d['body']),animations);states[d['id']]=state;index=state['graphicIndex'];x,y=d['coordinates']
   if d['body']&0x400:
    if not(-14<=x<=18 and -13<=y<=19):live.remove(d['id']);culled.append(dict(id=d['id'],reason='outside-local-range'));continue
    key=[index,x,y]
    if key in seen:culled.append(dict(id=d['id'],reason='duplicate-graphic-cell'));continue
    if len(seen)<100:seen.append(key)
   position=[x*64,y*64];screen=[math.trunc(v+0.5)for v in scene.project(position,[128,192],[160,120])];g=state['geometry'];at=[scene.short(screen[i]+state[['drawOffsetX','drawOffsetY'][i]]-(g[['originX','originY'][i]]if g else 0))for i in [0,1]]
   command=scene.ordinary(index,*at,10,state)if index>=1000 and g and scene.graphic(index)['resourceId']!=1 else None
   roots.append(dict(graphicIndex=index,position=position,screenPosition=at,sortFlag=1 if d['id']==100 else 0,ordinal=len(roots),id=d['id'],command=command))
   if command:submitted.append(d['id'])
  order=scene.frame.source_sort([{k:r[k]for k in ['position','sortFlag','ordinal']}for r in roots]);submitted=[roots[i]['id']for i in order if roots[i]['command']]
  request=dict(camera=[128,192],center=[160,120],width=320,height=240,runtime=old['runtime'],tick=1000+math.ceil(step*clock.PERIOD))
  rendered=model.step(12,12,planes,1,dict(tileCenter=[2,3],drawPrimitives=False),request,roots)
  frames.append(dict(update=step+1,tick=request['tick'],rgbaSha256=rendered['rgbaSha256'],culled=culled,submittedActorIds=submitted,liveActors=len(live)))
 v=dict(schema='moli.actor-context-original-vectors-stage171.v1',original_synthetic_only=True,authority='independent Python source branch/bit/range arithmetic and original animation/scene raster, no product imports or vendor runtime',flags=flags,facing=facing,range=filtered(entries),overflow=filtered(overflow),mixed=dict(definitions=definitions,unitRows=unit_rows,plainHex=plain.hex(),frames=frames),unsupported_native_context_remains_explicit=True)
 raw=(json.dumps(v,indent=2)+'\n').encode();(A/'original-vectors.json').write_bytes(raw);print(json.dumps(dict(flags=len(flags),facing=len(facing),range=len(entries),overflow=len(overflow),mixed_frames=len(frames),mixed_unique_rasters=len({r['rgbaSha256']for r in frames}),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())))
if __name__=='__main__':main()
