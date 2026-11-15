"""Independent source-address scheduling oracle for ACT, END and unsupported SKL.

No product imports, observed JS outputs or execution of shipped code. The narrow
ACT subset avoids treating missing physical-action/body handlers as completed.
"""
from pathlib import Path
import json
A=Path(__file__).resolve().parent
def scenario(name,tokens,initial=0):
 text='M|'+''.join(t+'|'+(''if t=='END'else f'{slot:X}|'if t=='ACT'else '0|7|0|0|A|0|A|FF|')for t,slot in tokens)
 rows=[dict(phaseBefore=5,phaseAfter=6,manager='manager-gated',commands=[],activeMask=0,ready=0,inputEnded=False,round=initial,Mread=1)]
 objects=[]
 for token,slot in tokens:
  if objects and objects[-1]['slot']==slot:objects[-1]['records'].append(token)
  else:objects.append(dict(slot=slot,records=[token],delay=0,index=len(objects)))
 mask=(1<<len(objects))-1;ready=1;ended=True;round=initial;phase=6
 for call in range(8):
  if call==0:manager='manager-input-ended'
  elif mask and ready:manager='manager-busy'
  elif mask:manager='manager-draining';ready=1
  else:manager='battle-round-drained';ready=0;ended=False;round=(round+1)&0xffffffff;phase=2
  outcomes=[]
  for obj in objects:
   if not(mask&(1<<obj['index'])):continue
   if obj['delay']>=0:obj['delay']-=1;outcomes.append('command-delay');continue
   token=obj['records'][0]
   if token=='SKL':outcomes.append('command-unavailable');continue
   ready=0;obj['records'].pop(0)
   if obj['records']:obj['delay']=0;outcomes.append('command-effect')
   else:mask&=~(1<<obj['index']);outcomes.append('battle-exit-requested'if token=='END'else 'command-effect')
   if token=='END':phase=7
  rows.append(dict(phaseBefore=6,phaseAfter=phase,manager=manager,commands=outcomes,activeMask=mask,ready=ready,inputEnded=ended,round=round,Mread=1))
  if phase!=6 or call==3 and any(t=='SKL'for t,s in tokens):break
 return dict(name=name,motion=text,initialRound=initial,frames=rows,terminal=phase)
cases=[scenario('empty',[]),scenario('act-local',[('ACT',0)]),scenario('act-remote',[('ACT',10)]),scenario('act-coalesced',[('ACT',0),('ACT',0)]),scenario('act-parallel',[('ACT',0),('ACT',10)]),scenario('round-wrap',[('ACT',0)],0xffffffff),scenario('end',[('END',-1)]),scenario('unsupported-skl',[('SKL',0)])]
out=dict(schema='moli.original-battle-loop-stage187.v1',authority='independent synthetic source-state oracle, not captured original execution',sources=['437b30/5/6 switch selection and draw-before-M','derived4365d0 EOF/round and32slots','derived4260b0 ACT/END and434b90 wait; known idle bodies'],scenarios=cases,counts=dict(scenarios=len(cases),loop_steps=sum(len(c['frames'])for c in cases),wrap_cases=1,unsupported_cases=1))
(A/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out['counts']))
