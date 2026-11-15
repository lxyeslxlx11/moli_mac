"""Actual indexed material in authored battlepool contexts; complete640x480 references."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json
import sys

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-battle-draw-style-v1'
M=ROOT/'build/analysis/game-legacy-resource-archive-v1/material-root'
old_path=ROOT/'build/analysis/game-vertex-color-v1/material-oracle.json'
old=json.loads(old_path.read_text())
proof=json.loads((ROOT/'analysis/game-vertex-color-v1/validation.json').read_text())['material']['oracle']
assert old_path.stat().st_size==proof['bytes'] and sha256(old_path.read_bytes()).hexdigest()==proof['sha256']
profile=json.loads((ROOT/'analysis/game-legacy-material-compat-v1/material-profile.json').read_text())
paths={r['path'].lower():M/r['path'] for r in profile['files']}
sys.path.insert(0,str(ROOT/'analysis/game-legacy-render-v1'))
spec=importlib.util.spec_from_file_location('moli_battle_argb_rd',ROOT/'analysis/game-legacy-render-v1/corpus_oracle.py')
rd=importlib.util.module_from_spec(spec);spec.loader.exec_module(rd)


def read(row,digest):
    with paths[row['file'].lower()].open('rb')as f:
        f.seek(row['offset']);b=f.read(row['length'])
    assert len(b)==row['length'] and sha256(b).hexdigest()==digest
    return b


palettes={}
for selector,r in old['carriers'].items():
    _w,_h,_pixels,bgr,_end=rd.decode(read(r['source'],r['input_sha256']))
    assert len(bgr)==r['palette_bytes'] and sha256(bgr).hexdigest()==r['palette_sha256']
    palettes[int(selector)]=rd.palette(bgr,'embedded-bgr')
floor=old['floor'];fw,fh,fpixels,embedded,_end=rd.decode(read(floor,old['floor_sha256']))
original,current=rd.base_rgb(paths[profile['palette'].lower()].read_bytes())
colors,_known=rd.palette(embedded,'embedded-bgr') if embedded else rd.palette(current,'default-rgb')
floor_rgba=rd.raster(fw,fh,fpixels,colors)
W,H=640,480;background=bytearray(W*H*4)
for y in range(min(fh,H)):
    n=min(fw,W)*4;background[y*W*4:y*W*4+n]=floor_rgba[y*fw*4:y*fw*4+n]
background_sha=sha256(background).hexdigest()
contexts=['raw','alpha0','alpha64','ghost','rgb-ghost','clear-additive']
rows=[]
for frame in old['frames']:
    raw=read(frame['source'],frame['input_sha256']);w,h,pixels,_embedded,_end=rd.decode(raw)
    colors,known=palettes[frame['selector']];assert all(known[p]for p in pixels)
    rgba=rd.raster(w,h,pixels,colors);assert sha256(rgba).hexdigest()==frame['own_rgba_sha256']
    x0,y0=(W-w)//2,(H-h)//2
    outputs={}
    for context in contexts:
        flags=frame['flags'];color=frame['color']
        if context=='alpha0':color&=0xffffff
        elif context=='alpha64':color=(color&0xffffff)|0x40000000
        elif context=='ghost':color=(color&0xffffff)|0x80000000
        elif context=='rgb-ghost':color=0x8080c040
        elif context=='clear-additive':flags&=~8
        alpha=color>>24;tint=[color>>16&255,color>>8&255,color&255]
        output=bytearray(background)
        for y in range(max(0,y0),min(H,y0+h)):
            sy=h-1-(y-y0) if flags&2 else y-y0
            for x in range(max(0,x0),min(W,x0+w)):
                sx=w-1-(x-x0) if flags&1 else x-x0
                source=(sy*w+sx)*4
                if not rgba[source+3]:continue
                at=(y*W+x)*4;rgb=[(rgba[source+i]*tint[i]+127)//255 for i in range(3)]
                if flags&8:
                    output[at:at+4]=bytes([min(255,output[at+i]+rgb[i]) for i in range(3)]+[255])
                elif alpha:
                    da=output[at+3];den=alpha*255+da*(255-alpha)
                    output[at:at+4]=bytes([(rgb[i]*alpha*255+output[at+i]*da*(255-alpha)+den//2)//den for i in range(3)]+[(den+127)//255])
        digest=sha256(output).hexdigest();outputs[context]=digest
        rows.append(dict(resource=frame['resource'],direction=frame['direction'],ordinal=frame['ordinal'],index=frame['index'],selector=frame['selector'],
            action_flags=frame['flags'],action_color=frame['color'],width=w,height=h,x=x0,y=y0,context=context,
            final_flags=flags,final_color=color,rgba_sha256=digest))
    if frame['flags']&8:
        assert outputs['alpha0']==outputs['raw']==outputs['alpha64']==outputs['ghost']
        assert outputs['clear-additive']!=outputs['raw']
    else:
        assert outputs['alpha0']==background_sha
    assert outputs['rgb-ghost']!=outputs['raw']
out=dict(stage=295,scope='All112selected actual non-defaultARGB frames in six explicitly authored battlepool contexts;not original native scenes orGPU.',
    width=W,height=H,contexts=contexts,rows=rows,floor=dict(source=floor,width=fw,height=fh,input_sha256=old['floor_sha256']),background_sha256=background_sha,
    source_oracle=proof,actual_frames=112,actions=25,named_carriers=17,source_material_unchanged=True,original_execution=False)
(P/'material-oracle.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(dict(stage=295,actual_frames=112,actions=25,contexts=len(contexts),complete_battle_frames=len(rows),alpha0_does_not_disable_additive=True)))
