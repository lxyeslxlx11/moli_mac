"""Independent full-RGBA native-size pass between unchanged opaque material layers."""
from pathlib import Path
from hashlib import sha256
import gzip
import json
import sys
P=Path('build/analysis/game-special-graphics-v1');mode='generated'if sys.argv[1:]==['generated']else'source'
report=json.loads((P/('material-'+mode+'.json')).read_text());d=P/('material-'+mode)
table=json.loads(Path('analysis/game-special-graphics-v1/source-check.json').read_text())['tables'][1]['values']
aggregate=sha256()
for r in report['cases']:
    low=gzip.decompress((d/(str(r['frame'])+'-low.rgba.gz')).read_bytes());high=gzip.decompress((d/(str(r['frame'])+'-high.rgba.gz')).read_bytes());full=gzip.decompress((d/(str(r['frame'])+'-full.rgba.gz')).read_bytes())
    assert len(low)==len(high)==len(full)==640*480*4
    assert all(sha256(b).hexdigest()==r[k]for k,b in [('low',low),('high',high),('full',full)])
    out=bytearray(low)
    if r['water']:
        p=r['water']['phase'];a=r['water']['amplitude']
        for i in range(60):
            source=i*8+12+int(table[(p+i)&63]*a/100)
            if 0<=source<=472:out[i*8*640*4:(i+1)*8*640*4]=low[source*640*4:(source+8)*640*4]
    for i in range(0,len(high),4):
        assert high[i+3]in[0,255]
        if high[i+3]:out[i:i+4]=high[i:i+4]
    assert out==full,r['frame'];aggregate.update(full)
result=dict(stage=298,mode=mode,completeFrames=len(report['cases']),waterPasses=sum(r['water']is not None for r in report['cases']),resources=len(report['graphics']),rgbaDigest=aggregate.hexdigest(),artworkUnchanged=True,independent_water_equations=True,native_driver_observed=False)
(P/('material-'+mode+'-verification.json')).write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
