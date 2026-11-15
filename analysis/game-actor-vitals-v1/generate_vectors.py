# -*- coding: utf-8 -*-
"""Independent original byte-label, synthetic glyph and complete-scene reference; no product imports."""
from pathlib import Path
import importlib.util,json,math,struct,hashlib
A=Path(__file__).resolve().parent
def load(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
prior=load('text_prior',A.parent/'game-actor-presentation-v1/generate_vectors.py');scene=prior.scene;clock=prior.clock;spin=prior.old.spin
tables=json.load(open(A.parent/'game-actor-text-v1/source-tables.json'));FONTS=tables['font_struct']['rows'];COLORS=tables['colors']['RGB'];MASKS={}
def sha(b):return hashlib.sha256(bytes(b)).hexdigest()
def cstring(b):return bytes(b or b'').split(b'\0')[0]
def width(b,font=0):
 b=cstring(b);font=font if 0<=font<14 else 0;m=FONTS[font];i=n=0
 while i<len(b):
  if b[i]&128:
   if i+1==len(b):raise ValueError('LEGACY_TEXT_DANGLING_BYTE')
   n+=m['double_width'];i+=2
  else:n+=m['single_width'];i+=1
 return n
def label(r):
 mode=r['mode'];flags=r['bodyFlags'];ls=r['labels']
 if mode<1:return None
 if r['local']:
  if mode>5:return None
  idx={1:0,2:1,4:2,5:3}.get(mode);b=cstring(r['selectedLabel']if mode==3 else ls[idx]);color={1:1,2:4,3:5,4:2,5:0}[mode]
 elif flags&0x100 and not flags&0x80000:
  if not r['resourceId']or mode>5:return None
  b=cstring(ls[{1:0,2:1,3:4,4:2,5:3}[mode]]);color={1:0,2:1,3:4,4:5,5:2}[mode]
 elif flags&0x80200:b=cstring(ls[1])if flags&0x200 and cstring(ls[1])else cstring(ls[0]);color=0
 else:return None
 return dict(x=scene.short(scene.short(r['screenX'])-width(b,1)//2),y=scene.short(scene.short(r['screenY'])-98),font=1,color=color,bytes=list(b))
def mask(font,b):
 b=cstring(b);key=str(font)+':'+b.hex()
 if key in MASKS:return MASKS[key]
 w=width(b,font)+2;h=10;alpha=bytearray(w*h);m=FONTS[font];at=1;i=0
 while i<len(b):
  two=bool(b[i]&128);seed=b[i]*17+(b[i+1]if two else 0)+font*23;cell=m['double_width']if two else m['single_width']
  if b[i]!=32:
   for y in range(1,9):
    for x in range(1,cell-1):alpha[y*w+at+x]=[0,64,160,255][((seed>>(x%5))^(y*13+x*3))&3]
  at+=cell;i+=2 if two else 1
 value=dict(font=font,bytesHex=b.hex(),width=w,height=h,originX=-1,originY=2,alphaHex=alpha.hex());MASKS[key]=value;return value
def blend(out,at,rgb,a):
 if not a:return
 da=out[at+3];inv=255-a;den=a*255+da*inv
 for c in range(3):out[at+c]=(2*(rgb[c]*a*255+out[at+c]*da*inv)+den)//(2*den)
 out[at+3]=(den+127)//255
def paint(out,w,h,run):
 b=bytes(run['bytes'])
 if not b:return
 m=mask(run['font'],b);a=bytes.fromhex(m['alphaHex'])
 for shift,color in([]if run['color']&128 else[(1,[0,0,0])])+[(0,COLORS[run['color']&127])]:
  for y in range(m['height']):
   oy=run['y']+m['originY']+shift+y
   if not 0<=oy<h:continue
   for x in range(m['width']):
    ox=run['x']+m['originX']+shift+x
    if 0<=ox<w:blend(out,(oy*w+ox)*4,color,a[y*m['width']+x])
def bitmap_rgba(commands,w,h):
 # Retain pixels from the already independent original map/native-chunk raster's SHA callback.
 original_sha=scene.sha;captured=[]
 def capture(b):captured.append(bytearray(b));return original_sha(b)
 scene.sha=capture
 try:result=scene.raster(commands,w,h)
 finally:scene.sha=original_sha
 assert len(captured)==1 and len(captured[0])==w*h*4
 return captured[0],result
CURRENT_BARS=[]
def s32(n):return((n+2**31)%2**32)-2**31
def bar_width(n,d):
 if not d:return None
 n=s32(n*32)
 if n==-2**31 and d==-1:raise ValueError('LEGACY_VITALS_DIVIDE_OVERFLOW')
 return scene.short((abs(n)//abs(d))*(-1 if(n<0)!=(d<0)else 1))
def bar_plan(actor,at,values):
 result=[]
 for i in range(2):
  width=bar_width(*values[i*2:i*2+2])
  if width is not None:result.append(dict(index=1600+i,x=s32(at[0]-22),y=s32(at[1]+[1,4][i]),priority=207,flip=0,coordinateMode='int32',sourceRectangle=[0,0,width,2],actorId=actor))
 result.append(dict(index=1602,x=s32(at[0]-26),y=s32(at[1]+2),priority=207,flip=0,coordinateMode='int32',actorId=actor));return result
def paint_bar(out,w,h,c):
 index=c['index'];iw,ih=(40,9)if index==1602 else(32,2);x,y=c['x'],c['y'];sx,sy,sw,sh=c.get('sourceRectangle',[0,0,iw,ih])
 if sx<0:x=s32(x-sx);sw+=sx;sx=0
 if sy<0:y=s32(y-sy);sh+=sy;sy=0
 sw=max(0,min(sw,iw-sx));sh=max(0,min(sh,ih-sy))
 for dy in range(sh):
  for dx in range(sw):
   ox=x+dx;oy=y+dy
   if not(0<=ox<w and 0<=oy<h):continue
   at=(ih-1-(sy+dy))*iw+sx+dx;pi=0 if(at+index)%5==0 else 1+(at+index)%3;color=[(0,0,0,0),(128,0,0,255),(0,128,0,255),(128,128,0,255)][pi]
   if color[3]:out[(oy*w+ox)*4:(oy*w+ox)*4+4]=bytes(color)
def text_raster(commands,w,h,runs):
 low=[c for c in commands if c['priority']<=207];mid=[c for c in commands if 207<c['priority']<=210];high=[c for c in commands if c['priority']>210];out,_=bitmap_rgba(low,w,h)
 for c in reversed(CURRENT_BARS):paint_bar(out,w,h,c)
 def overlay_images(rows):
  if not rows:return
  above,_=bitmap_rgba(rows,w,h)
  for i in range(0,len(out),4):blend(out,i,above[i:i+3],above[i+3])
 overlay_images(mid)
 for r in runs:paint(out,w,h,r)
 overlay_images(high)
 order=sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i));return dict(rgbaSha256=sha(out),rasterOperations=0,drawOrder=order)
def b62(n):return prior.old.b62(n)
def main():
 global CURRENT_BARS
 samples=[b'',b'A',b'AB',b'Original',b' Leading ',b'A\0Ignored',bytes.fromhex('c4a7c1a6'),bytes.fromhex('d6d0cec4'),b'X'+bytes.fromhex('d6d0')+b'Y',bytes.fromhex('81'),b'A'+bytes.fromhex('80')]
 widths=[]
 for f in[-3,*range(14),14,127]:
  for b in samples:
   row=dict(bytesHex=b.hex(),font=f)
   try:row['expected']=width(b,f)
   except ValueError as e:row['error']=str(e)
   widths.append(row)
 labels=[];sets=[[list(b)for b in[b'Hero',b'Group',b'Badge',b'Note',b'Extra']],[list(b)for b in['勇者'.encode('gbk'),'同伴'.encode('gbk'),'标签二'.encode('gbk'),'注记'.encode('gbk'),'外部'.encode('gbk')]],[None]*5]
 for own in[False,True]:
  for mode in[-1,0,1,2,3,4,5,6]:
   for flags in[0x34,0xb4,0x134,0x234,0x434,0x80034,0x80134,0x80234]:
    for rid in[0,100010]:
     for x,y in[(160,120),(32767,-32768),(-65537,65536)]:
      for ls in sets:
       r=dict(local=own,mode=mode,bodyFlags=flags,resourceId=rid,screenX=x,screenY=y,labels=ls,selectedLabel=list('选中'.encode('gbk')));labels.append(dict(input=r,expected=label(r)))
 for row in labels:
  if row['expected']and row['expected']['bytes']:mask(1,bytes(row['expected']['bytes']))
 rasters=[]
 for i in range(24):
  runs=[dict(x=-4 if i%3==0 else 4,y=-2 if i%4==0 else 3,font=1,color=(i%12)|(128 if i&1 else 0),bytes=list(b'AB'+('中文'.encode('gbk')if i&2 else b''))),dict(x=8,y=6,font=1,color=(i+3)%12,bytes=list(b'BA'))]
  commands=[]if i%3==0 else[dict(index=1002,x=1,y=1,originX=0,originY=0,priority=210 if i%3==1 else 211,flip=0)];rasters.append(dict(width=64,height=32,runs=runs,commands=commands,expected=text_raster(commands,64,32,runs)))
 base=json.load(open(A.parent/'game-actor-presentation-v1/original-vectors.json'));files={r['path']:bytes.fromhex(r['bytesHex'])for r in base['files']};gs=scene.anime.groups();gs[0].update(index=files['Bin/AnimeInfo.bin'],animation=files['Bin/Anime.bin'],graphicBase=0,attachmentIndex=files['Bin/CrdInfo.bin'],attachmentData=files['Bin/Crd.bin']);animations=scene.anime.parse(gs)
 def ls(*values):return[value.encode('gbk')for value in values]
 defs=[dict(id=100,local=True,category=1,resource=100010,face=4,coordinates=[2,3],flags=0xb4,labels=ls('勇者甲','同伴甲','标签甲','注记甲','尾甲')),dict(id=200,local=False,category=1,resource=100010,face=2,coordinates=[2,3],flags=0x134,labels=ls('勇者乙','同伴乙','标签乙','注记乙','尾乙')),dict(id=300,local=False,category=3,resource=100010,face=0,coordinates=[3,3],flags=0x234,labels=ls('角色甲','显示甲','','','尾丙')),dict(id=400,local=False,category=0,resource=80002,face=0,coordinates=[4,3],flags=0x434,labels=[b'Graphic',b'',b'',b'',b''])]
 def unit(d):
  if d['id']==400:return b'|'.join(str(x).encode()for x in[b62(400),4,3,80002,0,'Graphic',0])
  vals=[str(d['category']).encode(),b62(d['id']).encode(),*map(lambda n:str(n).encode(),d['coordinates']),str(d['face']).encode(),str(d['resource']).encode(),b'0',b'0',d['labels'][0],b'\\\\z'.join(d['labels'][1:4]),b'1'if d['local']else b'0',b'0',b'0',d['labels'][4],b'0',b'0',b''];return b'|'.join(vals)
 def packet(id,code,p):return f'Hx! {b62(id)}|99|-99|{code}|0|{p}|0|0 '.encode()
 catalog=[b'SelectedA','选中乙'.encode('gbk')]+[b'']*46
 catalog_packet=b'Hr] '+b'|'.join(v for i,name in enumerate(catalog)for v in[name,b'1'if i<2 else b'-1',str(i+10).encode()])+b' '
 changed=dict(defs[0],labels=ls('更新甲','更新同伴','保留标签','保留注记','外部更新'))
 masked=[s.encode('gbk')for s in['新姓名','新同伴']]
 newcomer=dict(id=500,local=False,category=3,resource=0,face=0,coordinates=[5,3],flags=0x234,labels=ls('后来者','','','',''))
 events=[dict(at=4,key='catalog',kind='packet',plainHex=catalog_packet.hex()),dict(at=8,key='mode2',kind='cycle',mode=2),dict(at=16,key='mode3',kind='cycle',mode=3),dict(at=20,key='selection',kind='packet',plainHex=f'E(9 {b62(0x10000000)}|1 '.encode().hex()),dict(at=28,key='mode4',kind='cycle',mode=4),dict(at=36,key='mode5',kind='cycle',mode=5),dict(at=44,key='mode0',kind='cycle',mode=0),dict(at=48,key='unit-labels',kind='packet',plainHex=(b'H#| '+unit(changed)+b' ').hex()),dict(at=52,key='mode1',kind='cycle',mode=1),dict(at=60,key='masked-labels',kind='packet',plainHex=(b'E(9 '+b62(0x60000000).encode()+b'|'+b'|'.join(masked)+b' ').hex()),dict(at=68,key='hidden-resource',kind='packet',plainHex=packet(200,60,0).hex()),dict(at=72,key='restore',kind='packet',plainHex=packet(200,60,100010).hex()),dict(at=80,key='gate',kind='packet',plainHex=packet(200,99,3).hex()),dict(at=84,key='spin',kind='packet',plainHex=packet(100,80,114001).hex()),dict(at=92,key='mode2-again',kind='cycle',mode=2),dict(at=100,key='remove-npc',kind='packet',plainHex=b'IZL 4Q '.hex()),dict(at=112,key='new-npc',kind='packet',plainHex=(b'H#| '+unit(newcomer)+b' ').hex())]
 # Catalog receive-00567ce0 pairs IZL with consumer4f2260.
 # Real source values and ordinary nonleader party membership; local options do not invent packets.
 initial=[b'E(9 u|50|100|75|100 ',b'HFs 1 1|200|77|100|25|100|MemberA ',b']_g 3e|25|100|50|100 ']
 extra=[(12,'remote-values',b']_g 3e|105|100|-1|100 '),(24,'zero-maximum',b'E(9 u|50|0|-10|100 '),(32,'npc-member',b'HFs 2 1|300|88|120|30|120|MemberB '),(33,'npc-values',b']_g 4Q|50|100|20|40 '),(40,'party-partial',b'HFs 1 4|99 '),(64,'wrapped-values',b'E(9 u|67108863|100|75|100 '),(76,'party-dissolve',b'HFs 1 0 '),(88,'party-rejoin',b'HFs 3 1|200|77|100|25|100|MemberA '),(114,'new-member',b'HFs 2 1|500|88|120|30|120|MemberC '),(115,'new-values',b']_g 84|100|100|40|100 ')]
 events.extend(dict(at=at,key=key,kind='packet',plainHex=data.hex())for at,key,data in extra);events.extend([dict(at=56,key='bars-off',kind='bars',visible=False),dict(at=72,key='bars-on',kind='bars',visible=True)]);events.sort(key=lambda e:e['at'])
 bar_visible=True;own_values=[50,100,75,100];actor_values={200:[25,100,50,100]};members={200};party={1:200}
 states={d['id']:dict(active=True,resource=d['resource'],face=d['face'],body=scene.anime.initial(),gate=False,spin=None,labels=d['labels'][:])for d in defs};globals_=defs[0]['labels'][:];selection=0;received=False;mode=1;model=scene.Scene();model.animations=animations;planes=scene.planes(1);frames=[];base_raster=scene.raster;source_scene=json.load(open(A.parent/'game-legacy-scene-frame-v1/original-vectors.json'))
 for index in range(120):
  for e in events:
   if e['at']!=index:continue
   k=e['key']
   if e['kind']=='bars':bar_visible=e['visible']
   elif k=='remote-values':actor_values[200]=[105,100,-1,100]
   elif k=='zero-maximum':own_values=[50,0,-10,100]
   elif k=='npc-member':party[2]=300;members.add(300)
   elif k=='npc-values':actor_values[300]=[50,100,20,40]
   elif k=='party-partial':pass
   elif k=='wrapped-values':own_values=[67108863,100,75,100]
   elif k=='party-dissolve':party.clear();members.clear()
   elif k=='party-rejoin':party[3]=200;members.add(200)
   elif k=='new-member':party[2]=500;members.add(500)
   elif k=='new-values':actor_values[500]=[100,100,40,100]
   elif e['kind']=='cycle':mode=e['mode']
   elif k=='catalog':received=True
   elif k=='selection':selection=1
   elif k=='unit-labels':globals_=changed['labels'][:];states[100]['labels']=changed['labels'][:]
   elif k=='masked-labels':globals_[0:2]=masked
   elif k=='hidden-resource':states[200]['resource']=0
   elif k=='restore':states[200]['resource']=100010
   elif k=='gate':states[200]['gate']=True;states[200]['face']=0
   elif k=='spin':states[100]['resource']=114001;states[100]['spin']=dict(counter=0,initialFacing=None)
   elif k=='remove-npc':states[300]['active']=False
   elif k=='new-npc':defs.append(newcomer);states[500]=dict(active=True,resource=0,face=0,body=scene.anime.initial(),gate=False,spin=None,labels=newcomer['labels'][:])
  roots=[];runs=[];actors=[];sounds=[];CURRENT_BARS=[]
  for d in defs:
   s=states[d['id']]
   if not s['active']:continue
   if s['gate']:actors.append(dict(id=d['id'],blocked=True));continue
   at=scene.project([n*64 for n in d['coordinates']],[128,192],[160,120],True);special=s['spin']is not None;action=0
   if special:
    p=spin.plan(s['spin']['counter'],s['spin']['initialFacing'],s['face']);s['spin']['initialFacing']=p['initialFacing'];s['face']=p['facingCode'];action=p['action'];at=[a+b for a,b in zip(at,p['offset'])];s['spin']['counter']+=1
   q,res=scene.anime.step(s['body'],scene.anime.ctx(resourceId=s['resource'],action=action,facing=s['face'],mode=0,staticFlip=not d['local']and not special,actorFlags=d['flags'],soundScene=source_scene['runtime']['soundScene']),animations);s['body']=q
   values=own_values if d['local']else actor_values.get(d['id'],[0,0,0,0]);bars=bar_plan(d['id'],at,values)if bar_visible and not special and(d['local']or d['id']in members)else[];CURRENT_BARS.extend(bars)
   if res['event']:sounds.append(dict(**res['event'],actorId=d['id'],screenPosition=scene.project([n*64 for n in d['coordinates']],[128,192],[160,120],not special)))
   run=None
   if not special:
    run=label(dict(local=d['local'],mode=mode,bodyFlags=d['flags'],resourceId=s['resource'],screenX=at[0],screenY=at[1],labels=globals_ if d['local']else s['labels'],selectedLabel=catalog[selection]if received else b''))
    if run:run['actorId']=d['id'];runs.append(run)
   g=q['geometry'];anchor=[scene.short(at[i]+q[['drawOffsetX','drawOffsetY'][i]]-(g[['originX','originY'][i]]if g else 0))for i in range(2)];command=scene.ordinary(q['graphicIndex'],*anchor,10,q)if g and q['graphicIndex']>=1000 else None
   roots.append(dict(graphicIndex=q['graphicIndex'],position=[n*64 for n in d['coordinates']],screenPosition=anchor,sortFlag=1 if d['local']and not special else 0,ordinal=len(roots),id=d['id'],command=command));actors.append(dict(id=d['id'],blocked=False,label=run,helperCalls=1,graphicIndex=q['graphicIndex'],values=values,barDraws=bars))
  # model.step invokes its independent raster; capture that function before installing the wrapper.
  def wrapper(commands,w,h):
   scene.raster=base_raster
   try:return text_raster(commands,w,h,runs)
   finally:scene.raster=wrapper
  scene.raster=wrapper;tick=1000+math.ceil(index*clock.PERIOD);req=dict(camera=[128,192],center=[160,120],width=320,height=240,runtime=source_scene['runtime'],tick=tick)
  try:result=model.step(12,12,planes,1,dict(tileCenter=[2,3],drawPrimitives=False),req,roots)
  finally:scene.raster=base_raster
  order=scene.frame.source_sort([{k:r[k]for k in['position','sortFlag','ordinal']}for r in roots]);submitted=[roots[j]['id']for j in order if roots[j]['command']and scene.graphic(roots[j]['graphicIndex'])['resourceId']!=1]
  frames.append(dict(update=index+1,tick=tick,mode=mode,actors=actors,runs=runs,events=sounds,submittedActorIds=submitted,barDraws=CURRENT_BARS[:],barsVisible=bar_visible,memberIds=sorted(members),rgbaSha256=result['rgbaSha256']))
 units=b'H#| '+b'\t'.join(unit(d)for d in defs if d['id']!=500)+b' '
 result=dict(schema='moli.actor-vitals-original-stage177.v1',original_synthetic_only=True,authority='independent Python source integers/masks/actors/map/native image order and original synthetic glyphs; no product imports or target execution',masks=list(MASKS.values()),files=base['files'],full=dict(unitPlainHex=units.hex(),initialPlainHex=[x.hex()for x in initial],initialMode=1,initialBarsVisible=True,events=events,frames=frames,sourcePeriod=clock.PERIOD),reloadAt=20,closeAt=90)
 (A/'original-vectors.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(masks=len(MASKS),frames=len(frames),unique_rasters=len({f['rgbaSha256']for f in frames}))))
if __name__=='__main__':main()
