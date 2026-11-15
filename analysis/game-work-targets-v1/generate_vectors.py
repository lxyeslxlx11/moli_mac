"""Original independent reference for ordinary work choices, outcomes and clocks."""
from pathlib import Path
import json
def i32(n):return (n+2**31)%2**32-2**31
def cost(main,level):
 n=i32(main*level);return (abs(n)//100)*(-1 if n<0 else 1)
modes={221:'disguise',222:'transform',223:'first-aid',224:'treatment',225:'mine',251:'mine',226:'hunt',253:'hunt',227:'wood',250:'wood'}
mode_cases=[dict(identifier=k,kind=3 if k<225 else 4,mode=v) for k,v in modes.items()]
mode_cases += [dict(identifier=999,kind=4,mode=None),dict(identifier=223,kind=2,mode=None)]
costs=[dict(main=a,level=b,cost=cost(a,b)) for a,b in [(100,20),(125,17),(-125,17),(2147483647,2),(-2147483648,2),(0,100),(100,0),(2147483647,2147483647)]]
clocks=[dict(tick=t,initial=first,deadline=(t+(6500 if first else 4500))%2**32) for t in [0,1000,2**32-6500,2**32-1000] for first in [True,False]]
outcomes=[]
for mode in ['disguise','transform','first-aid','treatment']:
 for status in [0,1,-1]:
  for value in [0,1,2,3,4,17]:
   outcome='success' if status else 'failure'
   if mode=='first-aid':outcome='restored-hp' if status else 'unneeded' if value==0 else 'failure'
   if mode=='treatment':outcome=('restored-health' if value==4 else 'improved-health') if status else {0:'unneeded',2:'worsened',3:'lost-soul'}.get(value,'failure')
   outcomes.append(dict(mode=mode,status=status,value=value,outcome=outcome))
# The skipped slot and excluded mode3 pet must not turn the wire ordinal into slot+1.
subjects=[dict(mode=m,indices=([0,1,2] if m!='transform' else [0,1]),wire=([0,1,2] if m!='transform' else [1,2]),names=(['Local hero','Fox','Bird'] if m!='transform' else ['Fox','Bird'])) for m in ['disguise','transform','first-aid','treatment']]
result=dict(stage=305,origin='Original independent Python reference,not original game data.',modeCases=mode_cases,costs=costs,clocks=clocks,outcomes=outcomes,localSubjects=subjects)
(Path(__file__).parent/'original-vectors.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:len(v) for k,v in result.items() if isinstance(v,list)}))
