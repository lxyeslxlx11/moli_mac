"""Replace only source109 smoke coordinates; retained stage285 observations stay immutable."""
from pathlib import Path
from hashlib import sha256
from runpy import run_path
import json

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
PARENT=HERE.parent/'game-legacy-battle-upper-skills-v1'

def main():
    m=run_path(str(PARENT/'generate_vectors.py'));original=json.loads((PARENT/'original-vectors.json').read_text())
    f=m['f']
    def smoke(w,b):
        percent=w.random.range(10,200);angle=float(w.random.range(0,359));speed=float(w.random.range(5,20))
        w.node(b,'upper-skill-smoke',resource=0x1adb4,flags=0x40000,
            position=[b.position[0],f(b.position[1]+int(b.body['q']['drawOffsetY']/2))],
            parent=b.body,manual=True,percent=percent,angle=angle,speed=speed,face=0)
    m['World'].smoke=smoke
    animations,records=m['fixtures']();traces=[]
    for old in original['traces']:
        if old['case']['name']not in['class112','rush-reflect']:continue
        w=m['World'](animations,records,old['case']);states=[];rasters=[]
        for i in range(len(old['states'])):
            frame=w.step();states.append(m['native'].digest(frame))
            for selected in old['rasters']:
                if selected['frame']==i+1:rasters.append(dict(frame=i+1,selector=selected['selector'],**m['render_reference'](w,selected['selector'])))
        assert frame==old['final']and states!=old['states']
        traces.append(dict(case=old['case'],states=states,rasters=rasters,settled=old['settled'],final=frame))
    result=dict(schema='moli.upper109-smoke-coordinate-correction.stage286.v1',
        reason='41f1a0 reads actor2cc/2;4fd5f0 writes animation drawOffsetY there,distinct from graphic height',
        reference=dict(path=str(Path(__file__).relative_to(ROOT)),sha256=sha256(Path(__file__).read_bytes()).hexdigest()),
        retained_vectors=dict(path=str((PARENT/'original-vectors.json').relative_to(ROOT)),sha256=sha256((PARENT/'original-vectors.json').read_bytes()).hexdigest()),
        traces=traces,frames=sum(len(r['states'])for r in traces),rgbaFrames=sum(len(r['rasters'])for r in traces))
    (HERE/'upper-smoke-traces.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
    print(json.dumps(dict(traces=len(traces),frames=result['frames'],RGBA=result['rgbaFrames'])))

if __name__=='__main__':main()
