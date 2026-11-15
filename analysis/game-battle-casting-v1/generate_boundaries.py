#!/usr/bin/env python3
"""Original CRT signed-division boundary oracle, independent of the product."""
from pathlib import Path
import json
signed=lambda n:((n+2**31)%2**32)-2**31
rows=[]
for initial in[0,1,12345,0xffffffff]:
 seed=initial;steps=[]
 for _ in range(5):
  for low,high in[(0,-1),(99,-1),(0,-2),(0,-3),(9,3),(-10,10),(0,0),(-2147483648,2147483646),(2147483647,-2147483648)]:
   before=seed
   if high==-1:value=0
   else:
    divisor=signed(high-low+1);assert divisor;seed=(seed*214013+2531011)&0xffffffff;value=signed(((seed>>16)&32767)%abs(divisor)+low)
   steps.append(dict(low=low,high=high,before=before,value=value,after=seed))
 rows.append(dict(initial=initial,steps=steps))
Path(__file__).with_name('original-boundaries.json').write_text(json.dumps(dict(schema='moli.casting-numeric-boundaries-stage198.v1',source='466a20/CRT positive rand and signed IDIV; high=-1 exits before rand; int32 arithmetic',rows=rows),indent=2)+'\n')
print('CRT boundaries',sum(len(r['steps'])for r in rows))
