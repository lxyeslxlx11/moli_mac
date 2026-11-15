"""Original synthetic call scenarios; independent numeric expectations, no production imports."""
import json, math
from pathlib import Path

root=Path(__file__).resolve().parent
cases=[]
def case(text,actions,flags=0,local=0,message=0,effect=0,state=None):
    cases.append(dict(text=text,actions=actions,flags=flags,local=local,message=message,effect=effect,
                      state=actions[0] if state is None else state))
case('M|ESC|0|0|',[66,12,48,35,38],message=0x5730)
case('M|ESC|0|1|',[66,12,78,50,13,244],message=0x5730,effect=0xd3)
case('M|ESC|0|1|',[66,12,78,50,13,49],local=1,message=0x5730,effect=0xd3)
case('M|ESC|0|2|',[66,12,208,78,50,13,244],message=0x5730,effect=0xd3)
case('M|ESC|0|3|',[66,12],message=0x5730)
case('M|CLR|0|FF|',[66,12,13,49],message=0x5730)
case('M|SUP|0|FF|',[66,78,55,62],message=0x5733,effect=0xce)
# 433cd0 forces4348e0 on every new body before applying its dead flag.
case('M|SUP|0|FF|',[66,78],flags=2,message=0x5733,effect=0xce)
case('M|ANR|0|',[139])
case('M|PUE|0|',[141])
case('M|PNO|0|',[66,63],message=0x573e)
case('M|PDN|0|',[78,82],effect=0xcd)

scenario=dict(text='M|ANR|0|PUE|0|ANR|1|PNO|1|END|',
    initial=dict(kind='manager-conflict',commandIndex=4,cursor=26,preflightCursor=30,
                 masks=[1,2],records=[['ANR','PUE'],['ANR','PNO']],activeMask=3,groupIndex=1),
    initial_delay=[0,0],final_token='END')
capacity_text='M|'+''.join('CLR|FF|' if i%2==0 else 'SKL|C350|0|' for i in range(32))
capacity=dict(text=capacity_text,slots=32,activeMask=2**32-1,delays=[22*i for i in range(32)],
              types=[2 if i%2==0 else 0 for i in range(32)],inputEnded=False)
result=dict(schema='moli.original-battle-command-vectors-stage182.v1',origin='independently authored synthetic bytes and source-derived expectations',
            queue_cases=cases,coalescing=scenario,capacity=capacity,
            packet_limit=dict(actions=199,tuples=199,values=199,sentinel=199),
            timeout=dict(before=7199,boundary=7200,recovery=7201,queue=[11,38],return_ready=False),
            lifecycle=dict(normal_eof_substate=2,end_substate=7,round_wrap=[2**32-1,0]),
            character_history=dict(flags=[2,3,2,0,0],positions=['target','entry','entry','entry','target']))
root.joinpath('original-vectors.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(dict(queue_cases=len(cases),capacity_slots=capacity['slots'])))
