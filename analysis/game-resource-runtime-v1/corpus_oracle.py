#!/usr/bin/env python3
"""Read-only independent numeric/pixel digests for selected local installed resource ranges."""
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent;PRIVATE=ROOT/'build/analysis/game-resource-runtime-v1';SOURCE=ROOT/'build/analysis/diagnostic-material-20261026-_9d1ephh/source/app'
sys.path.insert(0,str(ROOT/'analysis/game-legacy-render-v1'));spec=importlib.util.spec_from_file_location('render_corpus',ROOT/'analysis/game-legacy-render-v1/corpus_oracle.py');ref=importlib.util.module_from_spec(spec);spec.loader.exec_module(ref)
ARGS='graphicbin:20 graphicinfobin:20 graphicbinex:4 graphicinfobinex:4 graphicbinv3:18 graphicinfobinv3:18 graphicbin_puk2:2 graphicinfobin_puk2:2 graphicbin_puk3:1 graphicinfobin_puk3:1 graphicbin_joy:22 graphicinfobin_joy:22 animebin:3 animeinfobin:3 animebinex:1 animeinfobinex:1 animebinv3:7 animeinfobinv3:7 animebin_puk2:4 animeinfobin_puk2:4 animebin_puk3:2 animeinfobin_puk3:2 animebin_joy:13 animeinfobin_joy:13'
def locate(path):
 current=SOURCE
 for part in path.split('/'):
  found=[p for p in current.iterdir() if p.name.lower()==part.lower()]
  if len(found)!=1:return None
  current=found[0]
 return current

def info(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  while True:
   b=f.read(1048576)
   if not b:break
   h.update(b)
 return dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
 # Explicit chosen numeric suffixes; source format acceptance does not identify a client version or official session.
 pairs=[('Graphic_20.bin','GraphicInfo_20.bin'),('GraphicEx_4.bin','GraphicInfoEx_4.bin'),('GraphicV2.bin','GraphicInfoV2.bin'),('GraphicV3_18.bin','GraphicInfoV3_18.bin'),('PUK2/Graphic_PUK2_2.bin','PUK2/GraphicInfo_PUK2_2.bin'),('PUK3/Graphic_PUK3_1.bin','PUK3/GraphicInfo_PUK3_1.bin'),('Graphic_Joy_22.bin','GraphicInfo_Joy_22.bin')]
 cgp=locate('Bin/pal/palet_00.cgp');original,current=ref.base_rgb(cgp.read_bytes());default,_=ref.palette(current,'default-rgb');neutral,_=ref.palette(original,'explicit-rgb');sources=[info(cgp)];rows=[];base=0;groups=[]
 for group,(graphic,index) in enumerate(pairs):
  path=locate('Bin/'+index);archive=locate('Bin/'+graphic)
  if path is None:groups.append(dict(group=group,present=False,base=base,records=0));continue
  metadata=path.read_bytes();assert len(metadata)%40==0;groups.append(dict(group=group,present=True,base=base,records=len(metadata)//40));sources.extend([info(path),info(archive)]);selected=0
  with archive.open('rb') as stream:
   for at in range(0,len(metadata),40):
    source_index,offset,length=struct.unpack_from('<iII',metadata,at);index=source_index+base
    if index<1000 or length>33554432:continue
    stream.seek(offset);raw=stream.read(length)
    try:w,h,pixels,tail,consumed=ref.decode(raw)
    except ValueError:continue
    if w%4 or max(w,h)>32767:continue
    for flags in [0,4]:
     colors,known=ref.palette(tail,'embedded-bgr') if tail else (neutral if flags else default,[1]*256)
     if any(not known[p] for p in set(pixels)):continue
     full=ref.raster(w,h,pixels,colors);out=bytearray(64*48*4)
     for y in range(min(48,h)):
      n=min(64,w)*4;out[y*256:y*256+n]=full[y*w*4:y*w*4+n]
     rows.append(dict(index=index,group=group,flags=flags,offset=offset,length=length,width=w,height=h,embeddedPaletteBytes=len(tail),crop=[64,48],rgbaSha256=hashlib.sha256(out).hexdigest()))
    selected+=1
    if selected>=3:break
  base+=len(metadata)//40
 result=dict(schema='moli.resource-library-private-corpus-stage164.v1',sourceRoot=str(SOURCE.relative_to(ROOT)),sourceClientEquivalence='unverified;resource samples are distinct from37c4 executable identity',arguments=ARGS,sources=sources,groups=groups,selectedImages=len(rows)//2,rows=rows,source_executable_executed=False,official_pixels_exported=False,official_session=False)
 (PRIVATE/'corpus-oracle.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(images=len(rows)//2,cases=len(rows),records=base,sources=len(sources))),flush=True)
if __name__=='__main__':main()
