#!/usr/bin/env python3
"""Independent source-address reference. No product imports or game resources."""
from pathlib import Path
import json,random
ORDER=[14,12,10,11,13,19,17,15,16,18,9,7,5,6,8,4,2,0,1,3]
def u32(n):return n&0xffffffff
def i32(n):return (n+0x80000000)%0x100000000-0x80000000
def targets(table,actor,word,control,local):
 selected={i for i,r in enumerate(table)if r and r['actorFlags']&8}
 if not word&1:return dict(enabled=False,mask=sum(1<<i for i in selected))
 partner=actor+5 if actor in list(range(5))+list(range(10,15))else actor-5
 def enable(i):
  if table[i]and(table[i]['value170']>0 or word&2):selected.add(i)
 if word&4:enable(partner)
 if word&8:enable(actor)
 if word&0x810:
  for i in range(0 if actor<10 else 10,10 if actor<10 else 20):
   if i not in [actor,partner]and(word&16 or(table[i]and table[i]['statusFlags']&4)):enable(i)
 if word&32:
  for i in range(10 if actor<10 else 0,20 if actor<10 else 10):enable(i)
 if word&0x400 and(control&0x80 or actor!=local):
  rank,col=divmod(ORDER.index(actor),5)
  if rank in [0,3]:
   same=ORDER[(5 if rank==0 else 10)+col]
   for k in range(5):
    front=ORDER[(10 if rank==0 else 5)+k];back=ORDER[(15 if rank==0 else 0)+k]
    if table[same]and same in selected and table[front]and front in selected and table[back]:selected.discard(back)
 return dict(enabled=True,mask=sum(1<<i for i in selected))
def pick(slot,word,eligible):
 if not eligible>>slot&1:return None
 others=[]
 if word&64:code=slot
 elif word&128:
  rank,col=divmod(ORDER.index(slot),5);code=slot+20
  others=[ORDER[(rank+1 if rank%2==0 else rank-1)*5+col]]
  if col<4:others.append(ORDER[rank*5+col+1])
  if col>0:others.append(ORDER[rank*5+col-1])
 elif word&256:code=40 if slot<10 else 41;others=[i for i in range(0 if slot<10 else 10,10 if slot<10 else 20)if i!=slot]
 elif word&512:code=42;others=[i for i in range(20)if i!=slot]
 else:return None
 return dict(code=code,slot=slot,highlights=[i for i in others if eligible>>i&1])

class Reference:
 """437460/489ea0/48b810/48b5b0 plus direct command callbacks; basic source branch only."""
 def __init__(self,control,begin):
  self.control=control;self.begin=begin;self.deadline=u32(begin+30000);self.active=True
  self.state=self.human=self.pet=self.action=self.first=self.second=self.limited=self.last=0
  self.menu=3;self.kind=None;self.y=self.v=0;self.mask=0;self.bits=0;self.steps=0;self.gate=True
 def step(self,tick,event):
  sounds=[];sent=[];main=4;countdown=None
  # Window26 init callback runs before48b810, using actual offset and velocity updates.
  if self.menu==1:
   self.y+=self.v;self.v-=1
   if self.v<1:self.v=0;self.menu=0
  elif self.menu==2:
   self.v+=1;self.y-=self.v
   if self.v>16:self.v=17;self.menu=3
  if event:
   if event.get('command')=='attack':self.action=0;self.mask=0x475;self.bits=1<<10;sounds.append(0x33);self.gate=False
   elif 'command'in event:
    name=event['command'];self.action=6 if name=='position'else 0;self.bits=0;sent.append({'guard':'G','escape':'E','position':'P'}[name]);sounds.append(0x39)
   elif 'target'in event:sent.append('H|'+format(event['target'],'X'));self.bits=0;sounds.append(0x39)
  if self.state==0:
   if self.control&4:
    sent.append('N');self.human+=1
    if self.control&32:self.state=3;self.hide()
    elif self.control&16:sent.append('N');self.human+=1;main=5;self.hide()
    else:self.control&=~4;self.hide()
   else:
    self.action=self.first if self.human==0 else self.second;self.mask=0x475;self.bits=1<<10
    self.state=1;self.kind=0 if self.control&16 else 1 if self.human==0 else 2
    self.y=-153;self.v=17;self.menu=1;sounds.append(0x38)
  elif self.state==1:
   if sent:self.state=2;self.human+=1;self.bits=0;self.hide()
   self.gate=True
  elif self.state==2:
   if self.menu==3:
    if self.human==1:
     if self.control&16:self.first=0 if self.action==6 else self.action;self.state=3
     else:
      self.state=0;self.first=self.action
      if self.action==6:self.limited=1;self.first=self.second=0
      elif 1<self.action<7:self.limited=1;self.second=0
    else:self.second=0 if self.action==6 else self.action;main=5
  elif self.state==3:
   assert not self.control&32,'native pet submenus are outside this reference';main=5
  else:raise AssertionError(self.state)
  if (self.control&0x1c)!=0x1c and self.active:
   remaining=i32(self.deadline-tick)
   if remaining<1:
    remaining=0;self.active=False;self.bits=0;self.hide();advance=False
    if self.control&32:
     if self.human==0 and not self.control&4:sent.append('N');advance=True
     if self.pet==0:sent.append('W|FF');advance=True
    elif not self.control&4:
     if self.human==0:sent+=['N','N'];advance=True
     elif self.human==1:sent.append('N');advance=True
    if advance:sounds.append(0x37);main=5
   sec=remaining//1000;base=0x5690 if remaining>9999 else 0x569a
   if remaining<=9999 and sec!=self.last:sounds.append(0xca);self.last=sec
   countdown=dict(remaining=remaining,seconds=sec,glyphs=[None if c==' 'else base+int(c)for c in f'{sec:2d}'[:2]])
  self.steps+=1
  return dict(phaseAfter=main,requests=sent,sounds=sounds,countdown=countdown,state=self.state,primaryCount=self.human,petCount=self.pet,selected=self.action,limitedSecondary=self.limited,primaryMemory=self.first,secondaryMemory=self.second,
              deadline=self.deadline,timerActive=self.active,lastSecond=self.last,gate=self.gate,selectionMask=self.mask,eligibleMask=self.bits,menu=dict(state=self.menu,mode=self.kind,offset=self.y,velocity=self.v,x=341,y=self.y),controlFlags=self.control)
 def hide(self):
  if self.menu!=3:
   self.y=min(self.y,0);self.v=max(self.v,0);self.menu=2

def scenario(name,control,actions,begin=896,expire=None):
 ref=Reference(control,begin);frames=[];action=0;attack_pending=False
 for index in range(160):
  tick=u32(begin+(30000 if expire==index else 16*(index+1)));event=None
  if ref.state==1 and ref.menu==0:
   if attack_pending:event={'target':10};attack_pending=False;action+=1
   elif action<len(actions):
    event={'command':actions[action]}
    if actions[action]=='attack':attack_pending=True
    else:action+=1
  result=ref.step(tick,event);frames.append(dict(tick=tick,event=event,expected=result))
  if result['phaseAfter']==5:break
 else:raise AssertionError(name+' did not reach source phase5')
 return dict(name=name,controlFlags=control,beginTick=begin,actions=actions,frames=frames)
def main():
 rng=random.Random(0x4374e0);cases=[];codes=[]
 for n in range(240):
  table=[None if rng.randrange(5)==0 else dict(value170=rng.choice([-1,0,1,100]),statusFlags=rng.choice([0,2,4,6]),actorFlags=rng.choice([0x60054,0x6005c]))for i in range(20)]
  actor=n%20;mask=[0,1,3,5,9,0x11,0x21,0x475,0x87,0x115,0x221,0x803,0x837,0x47f,0xc75,0xfff][n%16];control=0x80 if n%3 else 0;local=actor if n%2 else (actor+1)%20
  cases.append(dict(rows=table,actingSlot=actor,mask=mask,controlFlags=control,localSlot=local,expected=targets(table,actor,mask,control,local)))
 for mask in [0,64,128,256,512,192,384,768,960]:
  for slot in range(20):
   eligible=rng.randrange(1<<20);codes.append(dict(slot=slot,mask=mask,eligibleMask=eligible,expected=pick(slot,mask,eligible)))
 scenarios=[scenario('double-guard',0,['guard','guard']),scenario('single-guard',16,['guard']),scenario('attack-escape',0,['attack','escape']),scenario('position-guard',0,['position','guard']),scenario('skip-first',4,['guard']),scenario('skip-single',20,[]),scenario('timeout',0,[],expire=20),scenario('timeout-pet',32,[],expire=20),scenario('wrap-single',16,['guard'],begin=0xfffffff0),scenario('wrap-timeout',0,[],begin=0xfffffff0,expire=20)]
 out=dict(schema='moli.independent-basic-input-vectors-stage186.v1',sourceSha256='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',reference='independently authored source-address equations; no product imports, native execution or vendor assets',targetMasks=cases,targetCodes=codes,scenarios=scenarios,counts=dict(target_masks=len(cases),target_codes=len(codes),scenarios=len(scenarios),input_steps=sum(len(s['frames'])for s in scenarios)))
 (Path(__file__).parent/'original-vectors.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out['counts']))
if __name__=='__main__':main()
