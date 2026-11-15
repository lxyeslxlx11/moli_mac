"""Independent byte-field lifecycle and complete original RGBA references; no product imports."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json

A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('gmn_rgba_reference',A.parent/'game-battle-draw-style-v1/generate_vectors.py')
pixel=importlib.util.module_from_spec(spec);spec.loader.exec_module(pixel)


def raster(raw_flags,flags,color):
    out=bytearray(640*480*4);x=480-(4 if raw_flags&1 else 0);y=360-(1 if raw_flags&2 else 0)
    for i in range(4):
        sx=3-i if flags&1 else i
        pixel.blend(out,(y*640+x+i)*4,pixel.pixel_rows[320][sx*4:sx*4+4],color,flags)
    return sha256(out).hexdigest()


def main():
    traces=[]
    for raw_flags in range(16):
        for value in [0,4]:
            mask=value;color_mask=0;states=[]
            for step in range(5):
                if step==1:color_mask=8
                if step==2:mask=255
                if step==3:mask=0
                if step==4:color_mask=0
                flags=(raw_flags&(255^mask))|(value&mask);color=0xff90c0ff if color_mask else 0x4090c0ff
                states.append(dict(step=step,state=[162,164,165,163,231][step],actionRead=step,drawFlagMask=mask,drawFlagValue=value,colorMask=color_mask,
                    finalFlags=flags,finalColor=color,rgbaSha256=raster(raw_flags,flags,color)))
            traces.append(dict(rawFlags=raw_flags,value=value,resource=110350 if value else 100001,states=states))
    out=dict(stage=297,authority='Independent source309/310 and308lifecycle;inherited originalRGBA8 policy,not nativeGPU observation.',width=640,height=480,
        original_synthetic_only=True,queue=[162,164,165,163],traces=traces,complete_frames=sum(len(t['states'])for t in traces))
    (A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(dict(stage=297,traces=len(traces),complete_frames=out['complete_frames'])))


if __name__=='__main__':main()
