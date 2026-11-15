"""Independent complete named-color pixels for every action/frame of actual animation113058."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json
import struct
import sys

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-animation-palette-source-v1'
M=ROOT/'build/analysis/game-legacy-resource-archive-v1/material-root'
profile=json.loads((ROOT/'analysis/game-legacy-material-compat-v1/material-profile.json').read_text())
paths={r['path'].lower():M/r['path']for r in profile['files']}
sys.path.insert(0,str(ROOT/'analysis/game-legacy-render-v1'))
spec=importlib.util.spec_from_file_location('moli_named_palette_rd_reference',ROOT/'analysis/game-legacy-render-v1/corpus_oracle.py')
rd=importlib.util.module_from_spec(spec)
spec.loader.exec_module(rd)
bases=[]
base=0
for g in profile['groups']:
    bases.append(base)
    info=paths.get(g['graphicInfo'].lower())
    if info:
        base+=info.stat().st_size//40
selected=None
for g in profile['groups']:
    info=paths.get(g['animationInfo'].lower())
    if info is None:
        continue
    raw=info.read_bytes()
    for at in range(0,len(raw),12):
        resource,offset,count,version=struct.unpack_from('<IIHH',raw,at)
        if resource==113058:
            selected=(g['group'],offset,count,version,g['animation'])
assert selected
group,offset,count,version,file=selected
assert version in (0,1)
data=paths[file.lower()].read_bytes()
cursor=offset
frames=[]
actions=[]
for action in range(count):
    direction,kind,duration,n=struct.unpack_from('<HHII',data,cursor)
    selector,flags,color=struct.unpack_from('<HHI',data,cursor+12)if version else(0,0,0xffffffff)
    cursor+=20 if version else 12
    ids=[]
    for ordinal in range(n):
        index,x,y,event=struct.unpack_from('<Ihhh',data,cursor)
        cursor+=10
        frames.append(dict(action=action,ordinal=ordinal,index=bases[group]+index,selector=selector,flags=flags))
        ids.append(bases[group]+index)
    actions.append(dict(direction=direction,action=kind,selector=selector,flags=flags,frames=n))
assert len(frames)==54 and all(row['selector']==320 for row in frames)
wanted={r['index']for r in frames}
indices={}
carrier=None
for g in profile['groups']:
    info=paths.get(g['graphicInfo'].lower())
    if info is None:
        continue
    raw=info.read_bytes()
    for at in range(0,len(raw),40):
        index,offset,length=struct.unpack_from('<III',raw,at)
        resource=struct.unpack_from('<I',raw,at+36)[0]
        row=dict(index=bases[g['group']]+index,group=g['group'],file=g['graphic'],offset=offset,length=length,resource=resource)
        if row['index']in wanted:
            indices[row['index']]=row
        if resource==113058:
            carrier=row
assert carrier and wanted<=indices.keys()


def read(row):
    with paths[row['file'].lower()].open('rb')as f:
        f.seek(row['offset'])
        return f.read(row['length'])


carrier_raw=read(carrier)
_w,_h,_p,named,_c=rd.decode(carrier_raw)
assert len(named)==768
colors,_known=rd.palette(named,'embedded-bgr')
for row in frames:
    source=indices[row['index']]
    raw=read(source)
    w,h,pixels,_own,_end=rd.decode(raw)
    row.update(width=w,height=h,input_sha256=sha256(raw).hexdigest(),rgba_sha256=sha256(rd.raster(w,h,pixels,colors)).hexdigest(),source=source)
out=dict(stage=292,resource=113058,selector=320,actions=actions,frames=frames,carrier=carrier,carrier_sha256=sha256(carrier_raw).hexdigest(),palette_sha256=sha256(named).hexdigest(),original_execution=False)
(P/'material-oracle.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(dict(stage=292,resource=113058,selector=320,actions=len(actions),frames=len(frames),palette_sha256=out['palette_sha256'])))
