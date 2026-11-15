"""Independent fixed37c4 self flag references;no product imports or target execution."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
path=HERE.parent/'game-battle-physical-guard-v1/generate_vectors.py'
spec=importlib.util.spec_from_file_location('self_flags_native_reference',path)
native=importlib.util.module_from_spec(spec);spec.loader.exec_module(native)
OPAQUE=0xe4070080

# Native40de60/29 consumes spin08000000 and charge1010;the older reference
# predates these branches. This private interpreter retains the original body
# equations and adds the complete29 branch from the selected original bytes.
class Body(native.Body):
    def body_step(self):
        if self.state!=29:return super().body_step()
        self.percent=100;self.reaction_count+=1
        spin=bool(self.reaction_flags&0x8000000)
        if spin and self.reaction_count%2==0:self.face=(self.face+1)%8
        if self.reaction_count<14:self.action=1;self.speed=-4.;self.move()
        elif self.reaction_count<28:self.action=0
        elif self.attacker is None or self.attacker.state!=14:
            if spin:
                # 4199b0 selects from the current angle;the older reface()
                # helper recomputes the formation angle and is a different call.
                if self.angle>=360:self.angle=native.f(self.angle-360)
                elif self.angle<0:self.angle=native.f(self.angle+360)
                a=self.angle
                self.face=3 if a<15 or a>=345 else 4 if a<60 else 5 if a<120 else 6 if a<165 else 7 if a<195 else 0 if a<240 else 1 if a<300 else 2
            self.action=0;self.speed=6. if self.reaction_flags&0x1010 else 4.;self.reaction_count=0;self.pop()
        self.animate(self.body,1)

native.Body=Body


def main():
    bits=[1<<n for n in range(32)if OPAQUE&(1<<n)]
    flags=[4|1,0x800|1,0x8000000|1,*[b|1 for b in bits],OPAQUE|1,OPAQUE|0x805,OPAQUE|0x8000008]
    queues=[]
    for category in native.CLASSES:
        for level in range(10):
            for flag in flags:
                c=native.case('queue',category,level,hits=[[0,0,flag,12]])
                queues.append(dict(input=[category,level,flag],expected_digest=native.digest(native.queues(c)['rows'])))
    animations,records,_=native.fixtures()
    cases=[native.case('baseline',hits=[[0,0,1,12]]),native.case('impact4',hits=[[0,0,5,12]]),
           native.case('reaction800',hits=[[0,0,0x801,12]]),native.case('spinDodge',hits=[[0,0,0x8000008,12]]),
           native.case('opaqueBlend',hits=[[0,0,OPAQUE|0x805,12]]),
           native.case('partial800',hits=[[0,0,0x801,12]],resource=100081),
           native.case('partialOpaque',hits=[[0,0,OPAQUE|0x801,12]],resource=100081)]
    cases.extend(native.case('opaque-'+hex(bit),hits=[[0,0,bit|1,12]])for bit in bits)
    traces=[]
    for c in cases:
        w=native.World(animations,records,c);initial=native.digest(w.owned());states=[];rasters=[]
        for i in range(160):
            frame=w.step();states.append(native.digest(frame))
            if i in [0,31,63,159]:
                for selector in [0,1]:rasters.append(dict(frame=i+1,selector=selector,**native.prior.render_reference(w,selector)))
        traces.append(dict(case=c,initialOwnedDigest=initial,states=states,rasters=rasters,stopped=w.stopped,
            bodySettled=all(b.detached or not b.busy for b in w.bodies.values()),finalOwnedDigest=native.digest(w.owned()),final=frame))
    out=dict(schema='moli.self-flags-native-reference.stage283.v1',authority='Independent original source equations and authored archives;no product imports',
        reference=dict(path=str(path.relative_to(ROOT)),sha256=sha256(path.read_bytes()).hexdigest()),
        opaque_mask=hex(OPAQUE),queues=queues,traces=traces,frames=sum(len(t['states'])for t in traces),rgbaFrames=sum(len(t['rasters'])for t in traces))
    (HERE/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
    print(json.dumps(dict(queues=len(queues),scenarios=len(traces),states=out['frames'],RGBA=out['rgbaFrames'])))


if __name__=='__main__':main()
