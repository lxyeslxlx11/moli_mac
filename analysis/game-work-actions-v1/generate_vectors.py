#!/usr/bin/env python3
"""Original independent integer/predicate reference for item work and decoration."""
import json
from pathlib import Path

def signed(n):
    n &= 0xffffffff
    return n if n < 0x80000000 else n-0x100000000
def trunc(n,d):
    return abs(n)//d*(-1 if n<0 else 1)

cases=[]
for mode in ['repair-weapon','repair-armor','appraise','engrave']:
    for category,level,description,quantity,q in [
        (0,1,True,0,0),(6,2,True,0,0),(7,2,True,0,0),(14,1,True,0,0),
        (15,1,True,0,0),(22,1,False,0,0),(22,3,False,0,0),
        (22,1,True,1,0),(22,1,True,-1,0),(47,1,True,0,0),
        (22,1,True,0,0x100),(22,1,True,0,0x200),(22,1,True,0,0x300),
        (22,1,True,0,0x700),(0,-1,True,0,0)]:
        if mode=='repair-weapon':ok=description and 0<=category<=6 and level<=2
        elif mode=='repair-armor':ok=description and 7<=category<=14 and level<=2
        elif mode=='appraise':ok=not description and level<=2
        else:ok=description and quantity<=0 and category!=47 and (not(q&0x300) or bool(q&0x400))
        cases.append(dict(mode=mode,item=dict(present=True,slot=8,category=category,level=level,
                           hasDescription=description,quantity=quantity,qualification=q),rank=2,eligible=ok))

timers=[]
for level,now in [(0,1000),(1,1000),(2,1000),(-1,1000),(2147483647,1000),(-2147483648,1000),(1,0xffffff00)]:
    milliseconds=signed(signed(41%6+5+signed(level*3))*1000)
    timers.append(dict(level=level,now=now,cost=signed(level*10),duration=milliseconds,
                       seconds=trunc(milliseconds,1000),deadline=(now+milliseconds)&0xffffffff))
marks=[]
for text,empty in [('Original mark',False),('abcdefghijklmnop',False),('abcdefghijklmnopq',False),('',False),('',True),(' @ ',False),('Keep @',False),('a|b',False),('a\\b',False)]:
    raw=text.encode('ascii');ok=len(raw)<=16 and (bool(raw) or empty)
    skip=False
    for b in raw:
        if skip:skip=False
        elif b>=0x81:skip=True
        elif b in (124,92):ok=False
    if raw and not any(b not in (32,0x81,0x40) for b in raw):ok=False
    marks.append(dict(hex=raw.hex(),allowEmpty=empty,accepted=ok))
for raw,ok in [(bytes([0x81,124]),True),(bytes([0x81,92]),True),(bytes([0x80,124]),False),(bytes([0x81,64]),False)]:
    marks.append(dict(hex=raw.hex(),allowEmpty=False,accepted=ok))
out=dict(stage=304,origin='original independent Python source-equation reference',
         itemCases=cases,timers=timers,marks=marks,
         decoration=dict(cost=100,duration=8000,wireLevel=0,target=-1,baseSlot=11,extraSlot=12,payload='11|12'))
Path(__file__).with_name('original-vectors.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(dict(item_cases=len(cases),timer_cases=len(timers),mark_cases=len(marks))))
