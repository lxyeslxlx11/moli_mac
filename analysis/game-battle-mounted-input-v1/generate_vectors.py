#!/usr/bin/env python3
"""Independent equations transcribed from fixed37c4 source addresses; original synthetic bytes only."""
from pathlib import Path
import importlib.util,json
A=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('basic_input_reference',A.parent/'game-battle-input-v1/generate_vectors.py');basic=importlib.util.module_from_spec(spec);spec.loader.exec_module(basic)
FULL=[0x6a0,4,0x10,0x20,0x30,0x40,0x50,0x60,8,0x84,0x88,0x8c,0x90,0x94,0x98,0xc4,0xc8,0xcc,0xd0,0x6a4,2,0x6ac,0x6bd,0x6aa,0xd4]
STATS=[0x70,0x74,0x78,0x7c,0x80,0xb4,0xb8,0xbc,0xc0,0x9c,0xa0,0xa4,0xa8,0xac,0xb0,0x6d0]
ALPHABET='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
def b62(n):
 out=''
 while n:n,d=divmod(n,62);out=ALPHABET[d]+out
 return out or'0'
def decimal(token):
 if not token:return -1
 token=token[:127].lstrip();sign=-1 if token.startswith('-')else 1
 if token.startswith(('-','+')):token=token[1:]
 out=0
 for c in token:
  if c not in'0123456789':break
  out=basic.i32(out*10+int(c))
 return basic.i32(sign*out)
def unescape(s):
 out='';i=0
 while i<len(s[:255]):
  c=s[i];i+=1
  if c=='\\':
   if i>=len(s[:255]):break
   c={'n':'\n','c':',','z':'|','y':'\\'}.get(s[i],s[i]);i+=1
  out+=c
 return out
def blank_skill():return dict(present=False,id=0,flags=0,targetMask=0,mpCost=0,sortKey=0,nameHex='',descriptionHex='')
def blank():return dict(present=False,fields={},nameHex='',nicknameHex='',skills=[blank_skill()for _ in range(10)])
def update(r,kind,text):
 tokens=text.split('|')
 if kind=='0x4f1420':
  if not r['present']:return
  r['skills']=[blank_skill()for _ in range(10)]
  for i in range(0,len(tokens),8):
   index=decimal(tokens[i])
   if index<0:break
   t=tokens[i:]+['']*8;name=unescape(t[2]);desc=unescape(t[3]);assert 0<=index<10 and name
   r['skills'][index]=dict(present=True,id=decimal(t[1])&65535,flags=decimal(t[5])&65535,targetMask=decimal(t[6])&65535,mpCost=decimal(t[4]),sortKey=decimal(t[7]),nameHex=(name if len(name)<25 else'???').encode().hex(),descriptionHex=(desc if len(desc)<97 else'???').encode().hex())
  return
 mask=0
 for c in tokens[0]:mask=basic.u32(mask*62+ALPHABET.index(c))
 if mask==0:
  if kind=='0x4f0aa0':r.clear();r.update(blank())
  else:r.update(present=False,nameHex='',nicknameHex='')
  return
 r['present']=True;at=1
 for ordinal,offset in enumerate(FULL if kind=='0x4f0aa0'else STATS):
  if not mask&(1|(2<<ordinal)):continue
  token=tokens[at]if at<len(tokens)else'';at+=1
  if offset in [0x6ac,0x6bd]:
   value=unescape(token)
   if len(value)<=16:r['nameHex'if offset==0x6ac else'nicknameHex']=value.encode().hex()
  else:
   value=decimal(token)
   if kind=='0x4f0aa0'and offset in [2,4,0x6aa]:value&=65535
   if kind=='0x4f0aa0'and offset==0x6aa:r['fields'][str(0x6d4)]=int(bool(value&16));value&=~16
   r['fields'][str(offset)]=value
SKILLS=[dict(index=i,id=100+i,name=name,description='Original '+name,mpCost=cost,flags=i,targetMask=mask,sortKey=9-i)for i,(name,cost,mask)in enumerate([('Bite',3,0x61),('Call',0,0),('Wave',4,0x121),('Costly',11,0x61),('Masked',0,0x61),('Self',1,0x49),('Pair',2,0x45),('Wide',1,0x221),('Signed',0,0x8061)])]
def skill_text(skills=SKILLS):return ''.join('|'.join(str(s[k])for k in ['index','id','name','description','mpCost','flags','targetMask','sortKey'])+'|'for s in skills)+'-1|'
def pet_text(mode=18):
 vals=[100020,12,70,100,10,10,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,'Buddy','Friend',mode,25]
 return'1|'+'|'.join(str(v)for v in vals)+'|'
class Input:
 """437460,48b810,48b5b0 and actual callback semantics independent from JS."""
 def __init__(self,mounted,control,local=0,begin=896):
  self.mounted=mounted;self.control=control;self.local=local;self.deadline=basic.u32(begin+30000);self.timer=True;self.last=0;self.state=0;self.human=0;self.pet=0;self.action=0;self.mode='primary';self.skill=-1;self.stage=1;self.remembered=-1;self.menu=3;self.kind=None;self.y=self.v=0;self.mask=self.bits=0;self.gate=True
 def target(self,mask):
  self.mask=mask;table=[dict(value170=70,statusFlags=1,actorFlags=8 if self.bits>>i&1 else 0)if i in [0,5,10]else None for i in range(20)];actor=(self.local+5 if self.local<5 or 10<=self.local<=14 else self.local-5)if self.mode=='pet'else self.local
  out=basic.targets(table,actor,mask,self.control,self.local);self.bits=out['mask'];return out['enabled']
 def hide(self):
  if self.menu!=3:self.y=min(0,self.y);self.v=max(0,self.v);self.menu=2
 def open(self,kind):self.menu=1;self.kind=kind;self.y=-153;self.v=17
 def step(self,tick,event):
  sent=[];sounds=[];main=4;countdown=None;done=False;callback=False
  if self.menu==1:
   self.y+=self.v;self.v-=1
   if self.v==0:self.menu=0
  elif self.menu==2:
   self.v+=1;self.y-=self.v
   if self.v>16:self.v=17;self.menu=3
  def finish(remembered):
   nonlocal callback
   self.bits=0;self.pet+=1;self.state=5;self.remembered=remembered;self.hide();callback=True
  if event:
   if event=='wait':
    self.stage=0
    if self.mode=='mounted':self.action=0
    sounds.extend([0x39,0x39]);sent.append('W|FF');finish(0)
   elif event=='cancel':self.bits=0;self.skill=-1;self.stage=1
   elif isinstance(event,dict)and'skill'in event:
    self.skill=event['skill']
    if self.mode=='mounted':self.action=0
    if not self.target(SKILLS[self.skill]['targetMask']):sent.append(f'W|{self.skill:X}|0');sounds.append(0x39);finish(0)
    sounds.append(0x33);self.stage=2
   elif isinstance(event,dict)and'target'in event:
    choice=basic.pick(event['target'],self.mask,self.bits);assert choice;sent.append(f'W|{self.skill:X}|{choice["code"]:X}');self.bits=0;sounds.append(0x39);done=True
   elif event=='guard':sent.append('G');self.action=0;self.bits=0;sounds.append(0x39);done=True
  if self.state==0:
   if self.mounted:
    if self.control&8:
     sent.append('N');self.human+=1
     if self.control&0x20000:sent.append('N');self.human+=1;main=5
     else:self.control&=~8
     self.hide()
    else:
     self.mode='mounted'
     if self.skill<0 or self.action!=0 or not self.target(SKILLS[self.skill]['targetMask']):self.skill=-1;self.stage=1
     self.state=4;self.open(4);sounds.append(0x38)
   elif self.control&4:
    sent.append('N');self.human+=1;self.state=3 if self.control&32 else 0;self.hide()
   else:self.mode='primary';self.state=1;self.target(0x475);self.open(0 if self.control&16 else 1);sounds.append(0x38)
  elif self.state==1:
   if done:self.state=2;self.human+=1;self.bits=0;self.hide()
   self.gate=True
  elif self.state==2:
   if self.menu==3:self.state=3
  elif self.state==3:
   if self.control&32:
    if self.control&8:sent.append('W|FF');self.pet+=1;main=5
    else:
     self.mode='pet'
     if self.skill<0 or not self.target(SKILLS[self.skill]['targetMask']):self.skill=-1;self.stage=1
     self.state=4;self.open(3);sounds.append(0x38)
   else:main=5
  elif self.state==4:
   if self.stage==2:self.stage=3
   if done:finish(0)
  elif self.state==5:
   if not callback and self.menu==3:
    if self.mounted and self.pet<2:self.state=0
    else:main=5
  if self.control&0x1c!=0x1c and self.timer:
   remaining=basic.i32(self.deadline-tick)
   if remaining<1:
    remaining=0;self.timer=False;self.bits=0;self.hide();advanced=False
    if self.mounted:sent.append('W|FF');advanced=True
    elif self.control&32:
     if self.human==0 and not self.control&4:sent.append('N');advanced=True
     if self.pet==0:sent.append('W|FF');advanced=True
    elif not self.control&4:
     if self.human==0:sent+=['N','N'];advanced=True
     elif self.human==1:sent.append('N');advanced=True
    if advanced:main=5;sounds.append(0x37)
   sec=remaining//1000;base=0x5690 if remaining>9999 else 0x569a
   if remaining<=9999 and sec!=self.last:sounds.append(0xca);self.last=sec
   countdown=dict(remaining=remaining,seconds=sec,glyphs=[None if c==' 'else base+int(c)for c in f'{sec:2d}'[:2]])
  return dict(phaseAfter=main,requests=sent,sounds=sounds,countdown=countdown,state=self.state,primaryCount=self.human,petCount=self.pet,selected=self.action,inputMode=self.mode,currentSkill=self.skill,petStage=self.stage,rememberedPet=self.remembered,selectionMask=self.mask,eligibleMask=self.bits,deadline=self.deadline,timerActive=self.timer,lastSecond=self.last,gate=self.gate,controlFlags=self.control,menu=dict(state=self.menu,mode=self.kind,offset=self.y,velocity=self.v,x=341,y=self.y))
def scenario(name,mounted,control,actions,local=0,timeout=None,begin=896):
 ref=Input(mounted,control,local,begin);frames=[];at=0
 for n in range(240):
  tick=basic.u32(begin+(30000 if timeout==n else(n+1)*16));event=None
  if ref.menu==0 and ref.state in [1,4]and at<len(actions):event=actions[at];at+=1
  out=ref.step(tick,event);frames.append(dict(tick=tick,event=event,expected=out))
  if out['phaseAfter']==5:break
 else:raise AssertionError(name+' never finished')
 return dict(name=name,mounted=mounted,control=control,local=local,begin=begin,frames=frames)
def main():
 r=blank();steps=[]
 def put(kind,text):
  update(r,kind,text);steps.append(dict(consumer=kind,text=text,expected=json.loads(json.dumps(r))))
 for ordinal,offset in enumerate(FULL):
  value='Name\\z'+str(ordinal)if offset in [0x6ac,0x6bd]else'18'if offset==0x6aa else'100020'if offset==0x6a0 else str(ordinal*173-999)
  put('0x4f0aa0',b62(2<<ordinal)+'|'+value+'|')
 for ordinal,offset in enumerate(STATS):put('0x4f1000',b62(2<<ordinal)+'|'+str(ordinal-8)+'|')
 put('0x4f0aa0',pet_text());put('0x4f1420',skill_text());put('0x4f1000','0|');put('0x4f0aa0',b62(2<<21)+'|'+'x'*17+'|');put('0x4f1420',skill_text([dict(SKILLS[0],name='x'*25,description='z'*97)]));put('0x4f1420',skill_text([dict(SKILLS[0],name='x'*24,description='z'*96)]));put('0x4f1420','-1|');put('0x4f0aa0','0|');put('0x4f1420',skill_text());put('0x4f1000','1|'+'|'.join(str(i)for i in range(16))+'|');put('0x4f0aa0',b62(2<<2)+'|4294967295junk|');put('0x4f0aa0',b62(2<<3)+'||')
 scenarios=[scenario('mounted-target-then-wait',True,0,[{'skill':0},{'target':10},'wait']),scenario('mounted-immediate-then-target',True,0,[{'skill':1},{'skill':0},{'target':10}]),scenario('mounted-reselect-side',True,0,[{'skill':0},'cancel',{'skill':2},{'target':10},'wait']),scenario('mounted-double-wait',True,0,['wait','wait']),scenario('mounted-forced-first',True,8,['wait','wait']),scenario('mounted-forced-both',True,0x20008,[]),scenario('mounted-timeout',True,0,[],timeout=20),scenario('ordinary-pet-target',False,0x30,['guard',{'skill':0},{'target':10}]),scenario('ordinary-pet-forced',False,0x38,['guard']),scenario('ordinary-pet-immediate',False,0x30,['guard',{'skill':1}]),scenario('ordinary-pet-timeout',False,0x20,[],timeout=20),scenario('mounted-self-pair',True,0,[{'skill':5},{'target':0},'cancel',{'skill':6},{'target':5}]),scenario('mounted-all',True,0,[{'skill':7},{'target':10},'wait']),scenario('ordinary-local5',False,0x30,['guard',{'skill':5},{'target':0}],local=5),scenario('mounted-wrap-timeout',True,0,[],timeout=20,begin=0xfffffff0)]
 out=dict(schema='moli.original-mounted-pet-reference-stage195.v1',authority='Independent Python source-address model; original synthetic carriers; no product imports/original execution',petText=pet_text(),skillText=skill_text(),skills=SKILLS,carrierSteps=steps,scenarios=scenarios,counts=dict(carrierSteps=len(steps),scenarios=len(scenarios),inputSteps=sum(len(s['frames'])for s in scenarios)))
 (A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(out['counts']))
if __name__=='__main__':main()
