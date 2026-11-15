"""Original independent signed bit-shift/division cases, no product or target execution."""
from pathlib import Path
import json
A=Path(__file__).resolve().parent
rows=[]
def s32(x):return((x+2**31)%2**32)-2**31
def s16(x):return((x+2**15)%2**16)-2**15
for n in[-2147483648,-1073741824,-67108865,-67108864,-100,-1,0,1,17,31,32,50,100,1024,65535,67108864,1073741823,2147483647]:
 for d in[-2147483648,-100,-32,-1,0,1,3,32,64,100,2147483647]:
  row=dict(current=n,maximum=d);v=s32(n*32)
  if v==-2147483648 and d==-1:row['error']='LEGACY_VITALS_DIVIDE_OVERFLOW'
  else:row['expected']=None if not d else s16((abs(v)//abs(d))*(-1 if(v<0)!=(d<0)else 1))
  rows.append(row)
(A/'numeric-vectors.json').write_text(json.dumps(dict(schema='moli.actor-vitals-numeric-original-stage177.v1',original_synthetic_only=True,authority='independent Python bit-wrapping/truncation rules from sourceSHL/IDIV/int16; no product import',cases=rows),indent=2)+'\n')
print(json.dumps(dict(cases=len(rows))))
