"""Independent Python model of signed multiplication/division and file table."""
from pathlib import Path
import json
def i32(n):return (n+2**31)%2**32-2**31
def trunc(n,d):return (abs(n)//d)*(-1 if n<0 else 1)
rows=[]
for tier,factor in enumerate([100,95,90,85,80,75,70]):
 for base in [6500,4500,13000,8000,0,-13000,2147483647,-2147483648]:
  for unsigned in [False,True]:
   product=i32(base*factor)
   rows.append(dict(tier=tier,base=base,unsigned=unsigned,duration=(product%2**32)//100 if unsigned else trunc(product,100)))
out=dict(authority='original independent Python arithmetic reference',source_table=[100,95,90,85,80,75,70],durations=rows,
 gates=[dict(tier=t,remaining=r,enabled=isinstance(t,int) and 0<t<7 and isinstance(r,int) and r>0) for t in [-1,0,1,3,6,7,None] for r in [-1,0,1,600000,None]])
path=Path(__file__).with_name('original-vectors.json');path.write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(dict(durations=len(rows),gates=len(out['gates']))))
