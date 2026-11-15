"""Independent numeric501a50 scheduling reference; original synthetic data only."""
from pathlib import Path
import json,hashlib
A=Path(__file__).resolve().parent
fade_path=A.parent/'game-battle-entry-v1/original-vectors.json'
fade=json.loads(fade_path.read_text())['fade']
rows=[dict(before=1,after=11,counter=0,render='retained',callbacks=0,capture=False)]
rows += [dict(before=11,after=11,counter=i+1,render='clear',callbacks=0,capture=False)for i in range(30)]
rows += [dict(before=11 if i==0 else 2,after=20 if f['complete']else 2,counter=30,render='captured-scene-fade',callbacks=int(i==0),capture=i==0,fade_call=f['calls'])for i,f in enumerate(fade)]
rows += [dict(before=20,after=3,counter=30,render='ordinary-frame',callbacks=1,capture=False,commit=True)]
value=dict(schema='moli.battle-return-original-v1',original_synthetic_only=True,authority='Derived numeric scheduling from501a50 normal-origin branch; retained independently generated505030/503330 type13 row arithmetic; not original runtime/full UI equivalence',source_sha256='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',steps=rows,fade_reference=dict(path=str(fade_path.relative_to(A.parent.parent)),bytes=fade_path.stat().st_size,sha256=hashlib.sha256(fade_path.read_bytes()).hexdigest()),counts=dict(steps=len(rows),retained=1,clear=30,fade=len(fade),ordinary_frames=2,captures=1))
(A/'original-vectors.json').write_text(json.dumps(value,indent=2)+'\n')
print(json.dumps(value['counts']))
