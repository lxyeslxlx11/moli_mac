#!/usr/bin/env python3
"""Independent original source80 arithmetic, animation calls and full scene rasters; no product imports."""
from pathlib import Path
import importlib.util,json,math,struct,hashlib
A=Path(__file__).resolve().parent
def load(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
scene=load('spin_scene_reference',A.parent/'game-legacy-scene-frame-v1/generate_vectors.py');clock=load('spin_clock_reference',A.parent/'game-input-runtime-v1/generate_vectors.py')
def plan(counter,origin,face):
 if counter==0:origin=face
 if counter>360:return dict(kind='finish-probe',action=4,facingCode=face,initialFacing=origin,offset=[0,0])
 radius=360-counter;direction=origin-int(((radius+8)%120)/15)
 if direction<0:direction+=8
 direction%=8;theta=([45,0,315,270,225,180,135,90][(origin+4)%8]+radius*3)*0.017453292519444445
 return dict(kind='rotation',action=3,facingCode=direction,initialFacing=origin,offset=[int(math.cos(theta)*radius*1.75),int(radius*-1.399999976158142)+int(-math.sin(theta)*radius*0.6000000238418579)])
def action_payload(definitions):
 def base62(n):
  out=''
  while n or not out:out='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+out;n//=62
  return out
 return ('Hx! '+','.join(f'{base62(d["id"])}|99|-99|80|7|{d["resource"]}|999|0'for d in definitions)+' ').encode()
def main():
 pure=[]
 for face in range(-1,8):
  for c in [*range(361),361,362,365,2147483646]:
   current=7 if face==-1 and c>360 else face;inputs=dict(counter=c,initialFacing=face if c else None,facingCode=current);pure.append(dict(input=inputs,expected=plan(c,inputs['initialFacing'],current)))
 outcomes=[]
 for c in [0,1,359,360,361,362,365,2147483646]:
  for code in ([None]if c<=360 else[-1,0,1,2,2147483647]):outcomes.append(dict(counter=c,probeCode=code,expected=dict(state=0 if c>360 and code==1 else 3,counter=1 if c>360 and code==1 else c+1)))
 blocks=[];disk_blocks=[]
 for d in range(8):
  for code,duration,n in [(0,144,3),(3,96,3),(4,96,2)]:
   frames=[([2,4,5][(d+i)%3],i-1,1-i,[31,10019,0][i]if code==3 else[41,0,0][i]if code==4 else[7,10004,0][i])for i in range(n)];blocks.append(scene.anime.action(d,code,duration,frames))
   # The reused independent catalog has graphicBase1000; physical group0 has base0.
   disk_blocks.append(scene.anime.action(d,code,duration,[(index+1000,x,y,event)for index,x,y,event in frames]))
 extra=b''.join(blocks);resource=json.load(open(A.parent/'game-resource-runtime-v1/original-vectors.json'));original={r['path']:bytes.fromhex(r['bytesHex'])for r in resource['files']};old=original['Bin/Anime.bin'];files=[dict(path='Bin/AnimeInfo.bin',bytesHex=(original['Bin/AnimeInfo.bin']+struct.pack('<IIHH',100006,len(old),24,0)).hex()),dict(path='Bin/Anime.bin',bytesHex=(old+b''.join(disk_blocks)).hex())]
 gs=scene.anime.groups();offset=len(gs[0]['animation']);gs[0]['index']+=struct.pack('<IIHH',100006,offset,24,0);gs[0]['animation']+=extra;animations=scene.anime.parse(gs)
 before=json.load(open(A.parent/'game-legacy-scene-frame-v1/original-vectors.json'));definitions=[dict(id=100,local=True,coordinates=[2,3],initialFacing=4,resource=100006,body=0xb4),dict(id=200,local=False,coordinates=[2,3],initialFacing=2,resource=100006,body=0x1034),dict(id=300,local=False,coordinates=[20,3],initialFacing=0,resource=80004,body=0x434)]
 states={d['id']:dict(state=3,counter=0,initialFacing=None,face=d['initialFacing'],action=0,anime=scene.anime.initial())for d in definitions};model=scene.Scene();planes=scene.planes(1);frames=[]
 for step in range(400):
  roots=[];actors=[];events=[]
  for d in definitions:
   s=states[d['id']];handled=s['state']==3;calls=0;probe=None;xy=[p*64 for p in d['coordinates']];projected=scene.project(xy,[128,192],[160,120]);screen=[int(v+0.5)for v in projected];event_screen=[int(v)for v in projected]
   def invoke(mode):
    nonlocal calls
    q,result=scene.anime.step(s['anime'],scene.anime.ctx(resourceId=d['resource'],action=s['action'],facing=s['face'],mode=mode,staticFlip=False,soundScene=before['runtime']['soundScene'],actorFlags=d['body']),animations);s['anime']=q;calls+=1
    if result['event']:events.append(dict(**result['event'],actorId=d['id'],screenPosition=event_screen if handled else screen[:]))
    return result['code']
   if handled:
    p=plan(s['counter'],s['initialFacing'],s['face']);s['initialFacing']=p['initialFacing'];s['face']=p['facingCode'];s['action']=p['action'];screen=[a+b for a,b in zip(screen,p['offset'])]
    if p['kind']=='finish-probe':
     probe=invoke(1)
     if probe==1:s.update(state=0,counter=0,action=0)
    invoke(0);s['counter']+=1
   else:invoke(0)
   q=s['anime'];g=q['geometry'];at=[scene.short(screen[i]+q[['drawOffsetX','drawOffsetY'][i]]-(g[['originX','originY'][i]]if g else 0))for i in range(2)];index=q['graphicIndex'];command=scene.ordinary(index,*at,10,q)if index>=1000 and g and scene.graphic(index)['resourceId']!=1 else None
   roots.append(dict(graphicIndex=index,position=xy,screenPosition=at,sortFlag=1 if d['local']and not handled else 0,ordinal=len(roots),id=d['id'],command=command))
   actors.append(dict(id=d['id'],state=s['state'],counter=s['counter'],initialFacing=s['initialFacing'],action=s['action'],facingCode=s['face'],handler='source-spin'if handled else'ordinary',helperCalls=calls,probeCode=probe,screenPosition=screen))
  order=scene.frame.source_sort([{k:r[k]for k in ['position','sortFlag','ordinal']}for r in roots]);submitted=[roots[i]['id']for i in order if roots[i]['command']];tick=1000+math.ceil(step*clock.PERIOD);request=dict(camera=[128,192],center=[160,120],width=320,height=240,runtime=before['runtime'],tick=tick);raster=model.step(12,12,planes,1,dict(tileCenter=[2,3],drawPrimitives=False),request,roots)
  frames.append(dict(update=step+1,tick=tick,actors=actors,events=events,submittedActorIds=submitted,rgbaSha256=raster['rgbaSha256']))
 def base62(n):
  out=''
  while n or not out:out='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[n%62]+out;n//=62
  return out
 remote='|'.join(map(str,[71,base62(200),2,3,2,100001,0,0,'OriginalSpin','OriginalGuild',0,0,0,'OriginalTail',0,0,'']));graphic='|'.join(map(str,[base62(300),20,3,80002,0,'OriginalSpinGraphic',0]));unit=bytes.fromhex(before['protocol']['beforePlainHex'][3]).rstrip(b' ')+b'\t'+remote.encode()+b'\t'+graphic.encode()+b' '
 actions=action_payload(definitions)
 result=dict(schema='moli.actor-spin-original-vectors-stage172.v1',original_synthetic_only=True,authority='independent Python source branch/integer/trig/animation/source-sort/scene model, no product imports or vendor execution; native x87 bit identity not asserted',purePlans=pure,outcomes=outcomes,files=files,full=dict(definitions=definitions,unitPlainHex=unit.hex(),actionPlainHex=actions.hex(),frames=frames,sourcePeriod=clock.PERIOD),reloadAt=137,closeAt=200)
 raw=(json.dumps(result,indent=2)+'\n').encode();(A/'original-vectors.json').write_bytes(raw);print(json.dumps(dict(pure_plans=len(pure),outcomes=len(outcomes),source_frames=len(frames),unique_rasters=len({r['rgbaSha256']for r in frames}),finish_updates=[r['update']for r in frames if any(a['state']==0 and a['handler']=='source-spin'for a in r['actors'])],bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())))
if __name__=='__main__':main()
