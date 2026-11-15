#!/usr/bin/env python3
"""Local byte-only format comparison; writes metadata/digests, never asset pixels."""
from pathlib import Path
from collections import Counter
import sys,json,struct,hashlib
from generate_vectors import base_rgb,palette,raster,sha
ROOT=Path(__file__).resolve().parents[2]
def decode(raw):
 if len(raw)<16:raise ValueError('LEGACY_RD_TRUNCATED')
 if raw[:2]!=b'RD':raise ValueError('LEGACY_RD_MAGIC')
 flags=raw[2];w,h,end=struct.unpack_from('<iiI',raw,4);head=20 if flags&2 else 16
 if len(raw)<head:raise ValueError('LEGACY_RD_TRUNCATED')
 if w<1 or h<1 or w*h>4194304:raise ValueError('LEGACY_RENDER_INTEGER')
 pal=struct.unpack_from('<I',raw,16)[0] if flags&2 else 0
 if pal>768:raise ValueError('LEGACY_RD_PALETTE_BUDGET')
 expected=w*h+pal
 if not flags&1:
  if len(raw)-head<expected:raise ValueError('LEGACY_RD_TRUNCATED')
  out=raw[head:head+expected];cursor=head+expected
 else:
  if end<head or end>len(raw):raise ValueError('LEGACY_RD_LENGTH')
  out=bytearray();cursor=head
  while cursor<end:
   c=raw[cursor];cursor+=1;n=c&15;literal=c<128;value=0
   if not literal and c<192:
    if cursor==end:raise ValueError('LEGACY_RD_TRUNCATED')
    value=raw[cursor];cursor+=1
   extensions=2 if not literal and c&32 else int(bool(c&16))
   if cursor+extensions>end:raise ValueError('LEGACY_RD_TRUNCATED')
   for _ in range(extensions):n=n*256+raw[cursor];cursor+=1
   if len(out)+n>expected:raise ValueError('LEGACY_RD_OVERRUN')
   if literal:
    if cursor+n>end:raise ValueError('LEGACY_RD_TRUNCATED')
    out+=raw[cursor:cursor+n];cursor+=n
   else:out.extend(bytes([value])*n)
  if len(out)!=expected:raise ValueError('LEGACY_RD_UNDERRUN')
 return w,h,bytes(out[:w*h]),bytes(out[w*h:]),cursor

def main():
 directory=Path(sys.argv[1]).resolve();dest=Path(sys.argv[2]);cgppath=directory/'pal/palet_00.cgp';cgp=cgppath.read_bytes();_,current=base_rgb(cgp);basecolors,_=palette(current,'default-rgb');pairs=[]
 for graphic,index in [('Graphic_Joy_22.bin','GraphicInfo_Joy_22.bin'),('GraphicV3_18.bin','GraphicInfoV3_18.bin')]:
  g=(directory/graphic).read_bytes();idx=(directory/index).read_bytes();rows=[];flags=Counter();align=Counter();errors=Counter();render=Counter()
  for ordinal,at in enumerate(range(0,len(idx),40)):
   ident,offset,length=struct.unpack_from('<III',idx,at);raw=g[offset:offset+length];row=dict(ordinal=ordinal,id=ident,offset=offset,bytes=length)
   try:
    w,h,pixels,tail,consumed=decode(raw);flags[str(raw[2])]+=1;align[str(w%4)]+=1
    row.update(status='accepted',width=w,height=h,flags=raw[2],consumed=consumed,ignored=len(raw)-consumed,pixelsSha256=sha(pixels),paletteSha256=sha(tail),paletteBytes=len(tail))
    color,known=palette(tail,'embedded-bgr') if tail else (basecolors,[1]*256)
    reason='LEGACY_RENDER_DIMENSIONS_UNPROVEN' if max(w,h)>32767 else 'LEGACY_RENDER_STRIDE_UNPROVEN' if w%4 else 'LEGACY_RENDER_UNKNOWN_COLOR' if any(not known[i] for i in set(pixels)) else 'available'
    row['render']=reason;render[reason]+=1
    if reason=='available' and ordinal%97==0:row['rgbaSha256']=sha(raster(w,h,pixels,color))
   except ValueError as e:row.update(status='rejected',code=str(e));errors[str(e)]+=1
   rows.append(row)
  pairs.append(dict(graphic=graphic,index=index,sources=[dict(path=str((directory/n).relative_to(ROOT)),bytes=len(b),sha256=sha(b)) for n,b in [(graphic,g),(index,idx)]],recordCount=len(rows),flags=dict(flags),widthModulo4=dict(align),errors=dict(errors),render=dict(render),rows=rows))
 result=dict(schema='moli.legacy-render-private-corpus-stage159.v1',official_pixels_exported=False,source_executable_executed=False,cgp=dict(path=str(cgppath.relative_to(ROOT)),bytes=len(cgp),sha256=sha(cgp)),pairs=pairs)
 dest.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(pairs=[{k:v for k,v in p.items() if k not in ['rows','sources']} for p in pairs])))
if __name__=='__main__':main()
