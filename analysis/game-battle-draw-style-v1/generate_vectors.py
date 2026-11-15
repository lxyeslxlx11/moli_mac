"""Independent source byte-mask projection andoriginal full-frame references; no product imports."""
from pathlib import Path
from hashlib import sha256
from itertools import product
import importlib.util
import json
import math

A=Path(__file__).resolve().parent
ROOT=A.parents[1]
spec=importlib.util.spec_from_file_location('moli_original_battle_pointer_pixels',ROOT/'analysis/game-battle-scene-v1/generate_vectors.py')
old=importlib.util.module_from_spec(spec);spec.loader.exec_module(old)
named=json.loads((ROOT/'analysis/game-animation-palette-source-v1/original-vectors.json').read_text())
pixel_rows={r['selector']:list(bytes.fromhex(r['rgbaHex'])) for r in named['palette_cases'] if r['selector']in (0,320) and r['tint']is None}
multiply=lambda x,y:(x*y+127)//255


def style(r):
    # Project bytes independently, in native R/G/B/A override order.
    rgb=[r['color']>>16&255,r['color']>>8&255,r['color']&255,r['color']>>24]
    q=r.get('drawColorOverride',dict(mask=0,color=0))
    replacement=[q['color']>>16&255,q['color']>>8&255,q['color']&255,q['color']>>24]
    for channel,bit in enumerate((1,2,4,8)):
        if q['mask']&bit:
            rgb[channel]=replacement[channel]
    if r['actorFlags']&0x100000:
        rgb[3]=128
    flags=sum((r['drawFlagValue']if r['drawFlagMask']&(1<<bit) else r['drawFlags'])&(1<<bit) for bit in range(8))
    return dict(flags=flags,color=(rgb[3]<<24)|(rgb[0]<<16)|(rgb[1]<<8)|rgb[2],paletteSelector=r['paletteSelector'])


def blend(out,at,source,color,flags):
    if not source[3]:
        return
    rgb=[multiply(source[i],(color>>(16-8*i))&255) for i in range(3)]
    if flags&8:
        out[at:at+4]=bytes([min(255,out[at+i]+rgb[i]) for i in range(3)]+[255])
    else:
        alpha=color>>24
        if not alpha:
            return
        da=out[at+3];den=alpha*255+da*(255-alpha)
        out[at:at+4]=bytes([(rgb[i]*alpha*255+out[at+i]*da*(255-alpha)+den//2)//den for i in range(3)]+[(den+127)//255])


def matrix_frame(q,scale):
    width,height=12,8;out=bytearray(width*height*4)
    for x in range(4):
        blend(out,((3*width)+2+x)*4,pixel_rows[0][x*4:x*4+4],0xffffffff,0)
    pixels=pixel_rows[320 if q['paletteSelector']==320 else 0]
    dw,dh=int(2+4*scale[0])-2,int(3+scale[1])-3
    for y,x in product(range(dh),range(dw)):
        sx=x*4//dw
        if q['flags']&1:
            sx=3-sx
        blend(out,(((y+3)*width)+x+2)*4,pixels[sx*4:sx*4+4],q['color'],q['flags'])
    return sha256(out).hexdigest()


patterns=[(0,0,0,0x80a16fc3,0x12f10b27),(3,4,4,0x00ffffff,0xff001122),
          (8,8,0,0x00abcdef,0xfedcba98),(15,15,9,0xff7f80fe,0x00aaff01)]
cases=[]
for mask,ghost,p in product(range(256),[False,True],range(4)):
    flags,fm,fv,color,override=patterns[p]
    r=dict(drawFlags=flags,color=color,paletteSelector=[0,320,65535][(mask+p)%3],actorFlags=0x100000 if ghost else 0,
        drawFlagMask=fm,drawFlagValue=fv,drawColorOverride=dict(mask=mask,color=override))
    q=style(r);scale=[1.5,2] if p==3 else [1,1]
    cases.append(dict(input=r,expected=q,scale=scale,rgbaSha256=matrix_frame(q,scale)))


def raster(commands,width=640,height=480,images=None):
    images=old.IMAGES if images is None else images
    out=bytearray(width*height*4)
    for ordinal in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i)):
        c=commands[ordinal];image=images[c['index']]
        x0,y0=old.short(c['x']),old.short(c['y']);iw,ih=image['width'],image['height'];scale=c.get('scale',[1.,1.])
        dw,dh=int(x0+iw*scale[0])-x0,int(y0+ih*scale[1])-y0
        for y in range(max(0,y0),min(height,y0+dh)):
            sy=(y-y0)*ih//dh;sy=ih-1-sy if c['flags']&2 else sy
            for x in range(max(0,x0),min(width,x0+dw)):
                sx=(x-x0)*iw//dw;sx=iw-1-sx if c['flags']&1 else sx
                pixel=old.rgba_color(image['pixels'][(ih-1-sy)*iw+sx],bool(c['flags']&4),image['embedded'])
                if pixel:
                    blend(out,(y*width+x)*4,pixel,c.get('color',0xffffffff),c['flags'])
    return sha256(out).hexdigest()


def frame_reference(trace,frame):
    nodes=frame['nodes'];depth=old.pointer_sort([dict(id=n['id'],y=n['screen'][1],alternateY=0,flags=n['actorFlags'],depthKey=0) for n in nodes if n['actorFlags']&0x20000])
    priorities={node:(i+9)&255 for i,node in enumerate(depth)};commands=[];skipped=[]
    for node in nodes:
        flags=node['actorFlags'];animation=node['animation'];reason=None
        if flags&0x8000:reason='renderer-filter'
        elif animation['graphicIndex']==-1:reason='graphic-missing'
        elif animation['graphicIndex']==0:reason='graphic-empty'
        elif node['deleted']:reason='deleted'
        elif flags&2:reason='hidden'
        if reason:
            skipped.append(dict(id=node['id'],reason=reason));continue
        scale=frame.get('scale',[1.,1.]) if node['kind']=='body' else [1.,1.]
        override=node['kind']!='body' or 0x1af0d<animation['lastResource']<0x1af26
        q=style(dict(drawFlags=animation['drawFlags'],color=animation['color'],paletteSelector=animation['paletteSelector'],actorFlags=flags,drawFlagMask=4 if override else 0,drawFlagValue=4))
        assert q['paletteSelector']==0 and q['flags']&~15==0
        priority=priorities.get(node['id'],9 if node['kind']in ['body','status'] else 200 if node['kind']in ['death','indicator'] else 204)
        commands.append(dict(id=node['id'],kind=node['kind'],index=animation['graphicIndex'],flags=q['flags'],
            x=node['screen'][0]+int(animation['drawOffsetX']*scale[0]),y=node['screen'][1]+int(animation['drawOffsetY']*scale[1]),priority=priority,
            **({'color':q['color']} if q['color']!=0xffffffff else {}),**({'scale':scale} if scale!=[1.,1.] else {})))
    bg=next(image for image in old.IMAGES.values() if image['resource']==1000)
    commands.append(dict(id=None,kind='background',index=bg['index'],flags=0,x=320+bg['origin'][0],y=240+bg['origin'][1],priority=0))
    return dict(depthOrder=depth,commands=commands,skipped=skipped,rgbaSha256=raster(commands),
        drawOrder=[commands[i]['id'] for i in sorted(range(len(commands)),key=lambda i:(commands[i]['priority'],-i))])


def main():
    previous=json.loads((ROOT/'analysis/game-battle-scene-v1/original-vectors.json').read_text())
    promoted=[]
    for trace in old.B['traces']:
        before=next(t for t in previous['traces'] if t['name']==trace['name'])
        for i,frame in enumerate(trace['frames']):
            if before['frames'][i].get('unavailable')=='LEGACY_BATTLE_FRAME_DRAW_STYLE':
                promoted.append(dict(trace=trace['name'],step=i,expected=frame_reference(trace,frame)))
    out=dict(stage=295,original_synthetic_only=True,authority='Independent original byte-mask/ghost/finalqueue equations andportableRGBA;not nativeGPU observation.',
        matrix=cases,promotedBattleFrames=promoted,width=12,height=8,source_fixture='game-animation-palette-source-v1/original-vectors.json')
    (A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
    print(json.dumps(dict(stage=295,style_matrix=len(cases),complete_matrix_frames=len(cases),promoted_battle_frames=len(promoted))))


if __name__=='__main__':
    main()
