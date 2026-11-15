"""Independent actual named/additive pixels above a selected opaque CUT floor patch."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json
import struct
import sys

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-additive-render-v1'
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
        if resource==113685:
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
assert len(frames)==12 and all(row['selector']==947 for row in frames)
wanted={r['index']for r in frames}
floor=None
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
        if resource==113685:
            carrier=row
        if resource==300653:
            floor=row
assert carrier and floor and wanted<=indices.keys()


def read(row):
    with paths[row['file'].lower()].open('rb')as f:
        f.seek(row['offset'])
        return f.read(row['length'])


carrier_raw=read(carrier)
_w,_h,_p,named,_c=rd.decode(carrier_raw)
assert len(named)==768
colors,_known=rd.palette(named,'embedded-bgr')
floor_raw=read(floor)
fw,fh,fpixels,fembedded,_end=rd.decode(floor_raw)
original,current=rd.base_rgb(paths[profile['palette'].lower()].read_bytes())
fcolors,_known=rd.palette(fembedded,'embedded-bgr')if fembedded else rd.palette(current,'default-rgb')
cut_path=M/'Bin/Puk2/cutdat/59663.cut'
cut=cut_path.read_bytes()
rid,kind,cx,cy,cw,ch,_ax,_ay=struct.unpack_from('<IH6h',cut,12+18*(1099-1000))
assert rid==300653 and kind==0 and cw==64 and ch==48
for row in frames:
    source=indices[row['index']]
    raw=read(source)
    w,h,pixels,_own,_end=rd.decode(raw)
    own=rd.raster(w,h,pixels,colors)
    width,height=w+8,h+8
    background=bytearray(width*height*4)
    for y in range(height):
        for x in range(width):
            value=fpixels[(fh-1-(cy+y%ch))*fw+cx+x%cw]
            color=fcolors[value]
            at=(y*width+x)*4
            background[at:at+4]=bytes((color>>16,color>>8&255,color&255,255 if color else 0))
    output=bytearray(background);normal=bytearray(background)
    saturated=changed=0
    for y in range(h):
        for x in range(w):
            before=(y*w+x)*4;at=((y+4)*width+x+4)*4
            if not own[before+3]:
                continue
            for channel in range(3):
                value=background[at+channel]+own[before+channel]
                saturated+=value>255
                output[at+channel]=min(255,value)
            output[at+3]=255
            normal[at:at+4]=own[before:before+4]
            changed+=output[at:at+4]!=normal[at:at+4]
    assert changed>0
    row.update(width=w,height=h,frame_width=width,frame_height=height,input_sha256=sha256(raw).hexdigest(),own_rgba_sha256=sha256(own).hexdigest(),rgba_sha256=sha256(output).hexdigest(),normal_sha256=sha256(normal).hexdigest(),changed_pixels=changed,saturated_channels=saturated,source=source)
out=dict(stage=293,resource=113685,selector=947,actions=actions,frames=frames,carrier=carrier,carrier_sha256=sha256(carrier_raw).hexdigest(),palette_sha256=sha256(named).hexdigest(),floor=floor,floor_patch=[cx,cy,cw,ch],floor_tile=1099,CUT=dict(path=str(cut_path.relative_to(ROOT)),bytes=len(cut),sha256=sha256(cut).hexdigest()),original_execution=False)
(P/'material-oracle.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(dict(stage=293,resource=113685,selector=947,actions=len(actions),frames=len(frames),changed_pixels=sum(r['changed_pixels']for r in frames),saturated_channels=sum(r['saturated_channels']for r in frames))))
