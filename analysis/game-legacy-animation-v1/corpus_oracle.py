#!/usr/bin/env python3
"""Retained local numeric animation metadata only; no image/audio/resource export."""
from pathlib import Path
import json,struct,sys,hashlib
ROOT=Path(__file__).resolve().parents[2]
sha=lambda b:hashlib.sha256(b).hexdigest()
def canonical(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
def decode(index,raw):
 resource,offset,count,version=struct.unpack('<IIHH',index);version=version if version<=1 else 0
 if not 100000<=resource<120500:raise ValueError('LEGACY_ANIMATION_RESOURCE_BOUNDS')
 if count>10000:raise ValueError('LEGACY_ANIMATION_ACTION_BUDGET')
 cursor=offset;actions=[];total=0
 def require(n):
  if cursor>len(raw) or n>len(raw)-cursor:raise ValueError('LEGACY_ANIMATION_TRUNCATED')
 for i in range(count):
  head=20 if version==1 else 12;require(head);direction,code,duration,frames=struct.unpack_from('<HHII',raw,cursor)
  if frames>9999:raise ValueError('LEGACY_ANIMATION_FRAME_BUDGET')
  total+=frames
  if total>1048576:raise ValueError('LEGACY_ANIMATION_DECODED_BUDGET')
  selector,flags,color=struct.unpack_from('<HHI',raw,cursor+12) if version==1 else (0,0,0xffffffff);cursor+=head;require(frames*10);rows=[]
  for j in range(frames):
   graphic,x,y,event=struct.unpack_from('<IhhH',raw,cursor);cursor+=10
   if graphic>=850000:raise ValueError('LEGACY_ANIMATION_GRAPHIC_BOUNDS')
   rows.append(dict(graphicIndex=graphic,x=x,y=y,event=event))
  actions.append(dict(direction=direction,action=code,duration=duration,delayTicks=max(1,duration//(frames*16)) if frames else duration,frameCount=frames,paletteSelector=selector,flags=flags,color=color,frames=rows))
 return dict(resourceId=resource,group=0,version=version,actionCount=count,byteOffset=offset,consumedBytes=cursor-offset,actions=actions,attachments=[])
def main():
 root=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);pairs=[]
 for idx,anim in [('AnimeInfo_Joy_13.bin','Anime_Joy_13.bin'),('AnimeInfoV3_7.bin','AnimeV3_7.bin')]:
  index=(root/idx).read_bytes();data=(root/anim).read_bytes();rows=[];actions=frames=0;maximum=0
  for at in range(0,len(index),12):
   row=dict(ordinal=at//12,resourceId=struct.unpack_from('<I',index,at)[0]);record=index[at:at+12]
   try:
    d=decode(record,data);row.update(status='accepted',metadataSha256=sha(canonical(d)),actions=d['actionCount'],frames=sum(a['frameCount'] for a in d['actions']));actions+=row['actions'];frames+=row['frames'];maximum=max(maximum,max((a['frameCount'] for a in d['actions']),default=0))
   except ValueError as e:row.update(status='rejected',code=str(e))
   rows.append(row)
  pairs.append(dict(index=idx,animation=anim,sources=[dict(path=str((root/n).relative_to(ROOT)),bytes=len(b),sha256=sha(b)) for n,b in [(idx,index),(anim,data)]],rows=rows,recordCount=len(rows),actions=actions,frames=frames,maximumFramesPerAction=maximum))
 result=dict(schema='moli.legacy-animation-private-corpus-stage160.v1',image_or_audio_exports=False,source_game_executed=False,pairs=pairs);out.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps([{k:v for k,v in p.items() if k not in ['rows','sources']} for p in pairs]))
if __name__=='__main__':main()
