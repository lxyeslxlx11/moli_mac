"""Independently decode every selected non-default action over an actual opaque floor."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json
import struct
import sys

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-vertex-color-v1'
M=ROOT/'build/analysis/game-legacy-resource-archive-v1/material-root'
profile=json.loads((ROOT/'analysis/game-legacy-material-compat-v1/material-profile.json').read_text())
paths={r['path'].lower():M/r['path'] for r in profile['files']}
census=json.loads((P/'material-census.json').read_text())
sys.path.insert(0,str(ROOT/'analysis/game-legacy-render-v1'))
spec=importlib.util.spec_from_file_location('moli_argb_original_rd',ROOT/'analysis/game-legacy-render-v1/corpus_oracle.py')
rd=importlib.util.module_from_spec(spec);spec.loader.exec_module(rd)
table_proof=json.loads((ROOT/'analysis/game-animation-palette-source-v1/source-check.json').read_text())
source=(ROOT/table_proof['source']['path']).read_bytes()
assert sha256(source).hexdigest()==table_proof['source']['sha256']
proof=table_proof['palette_table'];table=source[proof['offset']:proof['offset']+proof['bytes']]
assert sha256(table).hexdigest()==proof['sha256']
named_table=struct.unpack('<1495I',table)
bases=[];base=0;infos={}
for group in profile['groups']:
    bases.append(base)
    path=paths.get(group['graphicInfo'].lower())
    if path:
        infos[group['group']]=path.read_bytes();base+=len(infos[group['group']])//40
frames=[]
for action in census['nonwhite']:
    data=paths[profile['groups'][action['group']]['animation'].lower()].read_bytes()
    cursor=action['header_offset']+20
    for i in range(action['frames']):
        index,x,y,event=struct.unpack_from('<IhhH',data,cursor+10*i)
        frames.append(dict(resource=action['resource'],action=action['action'],direction=action['direction'],ordinal=i,
            index=bases[action['group']]+index,selector=action['selector'],flags=action['flags'],color=action['color']))
assert len(census['nonwhite'])==25 and len(frames)==112
resource_ids={named_table[r['selector']] for r in frames}|{300653}
resource_slots={}
for group,raw in infos.items():
    for at in range(0,len(raw),40):
        index=struct.unpack_from('<I',raw,at)[0];resource=struct.unpack_from('<I',raw,at+36)[0]
        if resource in resource_ids:
            resource_slots[resource]=bases[group]+index
assert resource_ids<=resource_slots.keys()
wanted={r['index'] for r in frames}|set(resource_slots.values())
slots={}
for group,raw in infos.items():
    for at in range(0,len(raw),40):
        index,offset,length=struct.unpack_from('<III',raw,at)
        index+=bases[group]
        if index in wanted:
            slots[index]=dict(index=index,group=group,file=profile['groups'][group]['graphic'],offset=offset,length=length,
                resource=struct.unpack_from('<I',raw,at+36)[0],physical_row=at//40)
assert wanted<=slots.keys()


def read(row):
    with paths[row['file'].lower()].open('rb')as f:
        f.seek(row['offset']);data=f.read(row['length'])
    assert len(data)==row['length']
    return data


carriers={};palettes={}
for selector in sorted({r['selector'] for r in frames}):
    row=slots[resource_slots[named_table[selector]]]
    raw=read(row);_w,_h,_p,embedded,_end=rd.decode(raw)
    assert 0<len(embedded)<=768 and len(embedded)%3==0
    palettes[selector]=rd.palette(embedded,'embedded-bgr')
    carriers[selector]=dict(source=row,input_sha256=sha256(raw).hexdigest(),palette_sha256=sha256(embedded).hexdigest(),palette_bytes=len(embedded))
floor=slots[resource_slots[300653]];floor_raw=read(floor)
fw,fh,fpixels,fembedded,_end=rd.decode(floor_raw)
original,current=rd.base_rgb(paths[profile['palette'].lower()].read_bytes())
fcolors,_known=rd.palette(fembedded,'embedded-bgr') if fembedded else rd.palette(current,'default-rgb')
cut_path=M/'Bin/Puk2/cutdat/59663.cut';cut=cut_path.read_bytes()
rid,kind,cx,cy,cw,ch,_ax,_ay=struct.unpack_from('<IH6h',cut,12+18*99)
assert (rid,kind,cw,ch)==(300653,0,64,48)
for row in frames:
    record=slots[row['index']];raw=read(record)
    w,h,pixels,_own,_end=rd.decode(raw)
    colors,known=palettes[row['selector']]
    assert all(known[p] for p in pixels),'Actual frame requires unavailable named color'
    own=rd.raster(w,h,pixels,colors)
    assert w%4==0
    width,height=w+8,h+8;background=bytearray(width*height*4)
    for y in range(height):
        for x in range(width):
            value=fpixels[(fh-1-(cy+y%ch))*fw+cx+x%cw];color=fcolors[value];at=(y*width+x)*4
            background[at:at+4]=bytes((color>>16,color>>8&255,color&255,255 if color else 0))
    assert all(background[i]==255 for i in range(3,len(background),4))
    output=bytearray(background);opaque=bytearray(background);alpha_reference=bytearray(background)
    alpha=row['color']>>24;changed=0
    for y in range(h):
        for x in range(w):
            sx=w-1-x if row['flags']&1 else x;sy=h-1-y if row['flags']&2 else y
            before=(sy*w+sx)*4;at=((y+4)*width+x+4)*4
            if not own[before+3]:
                continue
            for channel in range(3):
                src=own[before+channel];dst=background[at+channel]
                alpha_reference[at+channel]=(src*alpha+dst*(255-alpha)+127)//255
                output[at+channel]=min(255,src+dst) if row['flags']&8 else alpha_reference[at+channel]
            output[at+3]=255;alpha_reference[at+3]=255;opaque[at:at+4]=own[before:before+4]
            changed+=output[at:at+4]!=opaque[at:at+4]
    assert changed>0
    if row['flags']&8:
        assert output!=alpha_reference
    row.update(width=w,height=h,frame_width=width,frame_height=height,input_sha256=sha256(raw).hexdigest(),own_rgba_sha256=sha256(own).hexdigest(),
        rgba_sha256=sha256(output).hexdigest(),opaque_sha256=sha256(opaque).hexdigest(),alpha_reference_sha256=sha256(alpha_reference).hexdigest(),changed_pixels=changed,source=record)
out=dict(stage=294,actions=census['nonwhite'],frames=frames,carriers=carriers,floor=floor,floor_patch=[cx,cy,cw,ch],floor_tile=1099,
    floor_sha256=sha256(floor_raw).hexdigest(),CUT=dict(path=str(cut_path.relative_to(ROOT)),bytes=len(cut),sha256=sha256(cut).hexdigest()),
    actual_RGB='All selected non-default action words have whiteRGB;the actual evidence verifies alpha andits additive precedence.',original_execution=False)
(P/'material-oracle.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(dict(stage=294,actions=len(out['actions']),frames=len(frames),named_carriers=len(carriers),changed_pixels=sum(r['changed_pixels'] for r in frames),additive_frames=sum(bool(r['flags']&8) for r in frames))))
