"""Original synthetic palette carriers andindependent complete color/selector reference."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json
import struct
import sys

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-animation-palette-source-v1'
v=json.loads((ROOT/'analysis/game-resource-runtime-v1/original-vectors.json').read_text())
resources=json.loads((P/'palette-resources.json').read_text())
files={r['path']:bytearray.fromhex(r['bytesHex'])for r in v['files']}
info=files['Bin/GraphicInfo.bin']
graphic=files['Bin/Graphic.bin']
palettes={}


def add(index,resource,pixels,palette):
    offset=len(graphic)
    raw=b'RD\x02\x00'+struct.pack('<iiII',4,1,20+4+len(palette),len(palette))+pixels+palette
    graphic.extend(raw)
    row=bytearray(40)
    struct.pack_into('<III',row,0,index,offset,len(raw))
    struct.pack_into('<I',row,20,4)
    struct.pack_into('<I',row,24,1)
    struct.pack_into('<I',row,36,resource)
    info.extend(row)


carrier_selectors=list(range(1,66))+[320,1494]
for ordinal,selector in enumerate(carrier_selectors):
    palette=bytearray(c for i in range(256)for c in ((i+selector*3)&255,(i*5+selector)&255,(i*7+selector*11)&255))
    palette[8*3:9*3]=b'\0\0\0'
    palettes[selector]=palette
    add(2000+ordinal,resources[selector],bytes((0,1,2,3)),palette)
own=bytes((33,44,55))*256
pixels=bytes((0,8,168,255))
add(1600,81600,pixels,own)
cases=[]
for selector,flags,tint in [(0,0,None),(1,0,None),(320,0,None),(1494,0,None),(1495,0,None),(65535,0,None),(320,0,[64,128,255]),(320,4,[64,128,255]),(1,0,[255,64,96])]:
    selected=selector if 0<selector<1495 else 0
    palette=palettes[selected]if selected else own
    rgba=bytearray()
    for value in pixels:
        if not value:
            rgba.extend((0,0,0,0))
            continue
        b,g,r=palette[value*3:value*3+3]
        if tint and not flags&4:
            r,g,b=[min(255,n*t//128)for n,t in zip((r,g,b),tint)]
        if not(r or g or b):
            b=1
        rgba.extend((r,g,b,255))
    cases.append(dict(selector=selector,flags=flags,tint=tint,index=1600,width=4,height=1,rgbaHex=rgba.hex(),rgbaSha256=sha256(rgba).hexdigest()))
domain=sha256()
for selector in range(65536):
    n=selector if 0<selector<1495 else 0
    domain.update(struct.pack('<II',n,resources[n]))
out=dict(stage=292,original_synthetic_only=True,source_mapping_fact_count=1495,selector_domain=65536,selector_domain_sha256=domain.hexdigest(),palette_cases=cases,
    carrierSelectors=carrier_selectors,
    assets=dict(files=[dict(path=path,bytesHex=bytes(raw).hex())for path,raw in files.items()]))
(A/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(dict(stage=292,selector_domain=65536,palette_cases=len(cases),carriers=67)))
