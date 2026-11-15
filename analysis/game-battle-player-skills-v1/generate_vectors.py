"""Independent fixed37c4 receive, sort, MP and primary skill input equations. No product imports."""
from pathlib import Path
import importlib.util,json,random,copy
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('primary_skill_basic',A.parent/'game-battle-input-v1/generate_vectors.py');basic=importlib.util.module_from_spec(s);s.loader.exec_module(basic)
i32=basic.i32
def decimal(t):
 if not t:return -1
 t=t[:127].lstrip();sign=-1 if t.startswith('-')else 1
 if t.startswith(('-','+')):t=t[1:]
 v=0
 for c in t:
  if not'0'<=c<='9':break
  v=i32(v*10+ord(c)-48)
 return i32(v*sign)
def unescape(t):
 out='';at=0
 while at<len(t):
  c=t[at];at+=1
  if ord(c)>=128:
   out+=c
   if at<len(t):out+=t[at];at+=1
  elif c=='\\':
   if at==len(t):break
   out+={'n':'\n','c':',','z':'|','y':'\\'}.get(t[at],t[at]);at+=1
  else:out+=c
 return out
def split(t):
 t=t.split('\0')[0];out=[];at=0;start=0
 while at<len(t):
  if ord(t[at])>=128:at+=2;continue
  if t[at]=='|':out.append(t[start:at]);start=at+1
  at+=1
 out.append(t[start:]);return out
def bounded(t,n):
 t=unescape(t);return(t if len(t)<=n else'???').encode('latin1').hex()
def cost(a,b):
 n=i32(a*b);return n//100 if n>=0 else-((-n)//100)
def level():return dict(present=False,nameHex='',descriptionHex='',fields={str(k):0 for k in[0x7c,0x80,0x84,0x88,0x8c,0x90]})
def record():return dict(present=False,nameHex='',fields={str(k):0 for k in[0x19,0x1c,0x20,0x24,0x28,0x2c,0x30,0x34,0x38]},levels=[level()for _ in range(11)])
def ordered(records):
 rows=list(range(15))
 def compare(a,b):
  if not records[b]['present']:return-1
  if not records[a]['present']:return 1
  return-1 if records[a]['fields'][str(0x38)]<=records[b]['fields'][str(0x38)]else 1
 lo,hi=0,14;stack=[]
 def swap(a,b):rows[a],rows[b]=rows[b],rows[a]
 while True:
  count=hi-lo+1
  if count>8:
   swap(lo+(count>>1),lo);left,right=lo,hi+1
   while True:
    left+=1
    while left<=hi and compare(rows[left],rows[lo])<=0:left+=1
    right-=1
    while right>lo and compare(rows[right],rows[lo])>=0:right-=1
    if left>right:break
    swap(left,right)
   swap(lo,right)
   if(right-lo)*4-1<(hi-left)*4:
    if left<hi:stack.append((left,hi))
    if lo+1<right:hi=right-1;continue
   else:
    if lo+1<right:stack.append((lo,right-1))
    if left<hi:lo=left;continue
  else:
   for end in range(hi,lo,-1):
    maximum=lo
    for k in range(lo+1,end+1):
     if compare(rows[k],rows[maximum])>0:maximum=k
    swap(maximum,end)
  if not stack:return rows
  lo,hi=stack.pop()
class Records:
 def __init__(self):self.rows=[record()for _ in range(15)];self.version=0;self.code=0;self.name='';self.order=list(range(15))
 def update(self,consumer,slot,text):
  rows=split(text);number=lambda i:decimal(rows[i])if i<len(rows)else-1;token=lambda i:rows[i][:255]if i<len(rows)else'';pending=copy.deepcopy(self.rows);queries=[];changed=[];reset=[]
  if consumer=='0x4f0210':self.code=slot&255;self.name=bounded(text.split('\0')[0],23)
  elif consumer=='0x4f0290':
   for at in range(0,len(rows),11):
    n=number(at)
    if n<0:break
    assert n<15
    r=pending[n];r['nameHex']=bounded(token(at+2),24);r['present']=bool(r['nameHex']);a,b=number(at+3),number(at+4)
    if not r['present']and a<0 and b<0:r['fields']['28']=r['fields']['36']=0;r['levels']=[level()for _ in range(11)];reset.append(n)
    else:
     for offset,index in[(0x19,7),(0x1c,3),(0x20,5),(0x24,4),(0x28,6),(0x2c,8),(0x30,1),(0x34,9),(0x38,10)]:r['fields'][str(offset)]=number(at+index)&255 if offset==0x19 else number(at+index)
     if r['fields']['44']==1:queries.append(n)
    changed.append(n)
   self.rows=pending;self.order=ordered(self.rows)
  else:
   assert 0<=slot<15;r=pending[slot];r['levels']=[level()for _ in range(11)]
   for index,at in enumerate(range(0,len(rows),6)):
    if at==len(rows)-1 or len(rows[at])>=255:break
    assert index<11
    name=bounded(token(at),24);assert name
    packed=number(at+4);r['levels'][index]=dict(present=True,nameHex=name,descriptionHex=bounded(token(at+1),96),fields={str(k):v for k,v in[(0x7c,number(at+2)),(0x80,number(at+3)),(0x84,packed&4095),(0x88,1),(0x8c,number(at+5)),(0x90,(packed>>12)&15)]})
   self.rows=pending;changed.append(slot)
  self.version+=1
  return dict(headerCode=self.code,headerNameHex=self.name,version=self.version,records=[dict(slot=i,**r)for i,r in enumerate(self.rows)],order=self.order[:],queries=queries,changed=changed,craftResetSlots=reset)
HEADERS=[(0,60,'Arc',4,70,10,100,257,0,50,40),(2,70,'Cut',4,70,10,100,3,0,150,10),(14,80,'Last',1,0,10,0,0,5,100,10),(3,90,'Craft',1,0,1,0,0,1,100,5),(4,91,'Other',1,0,1,0,0,2,100,0)]
def header_text(rows=HEADERS):return ''.join('|'.join(str(v)for v in r)+'|'for r in rows)+'-1|'
LEVELS=[('Cut I','Original hit',2,7,0x61,1),('Cut II','Original group',4,8,0x121,1),('Costly','Original disabled cost',1000,9,0x61,1),('Locked','Original disabled flag',0,10,0x61,0),('Call','Original no target',0,11,0,1),('Self','Original self target',1,12,0x49,1),('All','Original wide target',1,13,0x221,1),('Level 8','Original',1,14,0x8061,1),('Level 9','Original',1,15,0x61,1),('Level 10','Original',1,16,0x61,1),('Stored 11','Not a battle row',0,17,0x61,1)]
def level_text(rows=LEVELS):return ''.join('|'.join(str(v)for v in r)+'|'for r in rows)
class Input:
 def __init__(self,row,records):
  self.control=row['control'];self.begin=row.get('begin',896);self.mp=row.get('mp',10);self.skillmask=row.get('skillMask',0x7fff);self.local=row.get('local',0);self.records=records
  self.state=self.human=self.action=self.first=self.second=self.limited=self.last=0;self.menu=3;self.mode=None;self.y=self.v=0;self.gate=True;self.mask=self.bits=0;self.popup=None;self.main=self.level=-1;self.targeting=False;self.flag=False;self.timer=True;self.deadline=basic.u32(self.begin+30000)
 def target(self,mask):
  self.mask=mask;table=[dict(value170=70,statusFlags=1,actorFlags=8 if self.bits>>i&1 else 0)if i in[0,5,10]else None for i in range(20)];r=basic.targets(table,self.local,mask,self.control,self.local);self.bits=r['mask'];return r['enabled']
 def hide(self):
  if self.menu!=3:self.y=min(0,self.y);self.v=max(0,self.v);self.menu=2
 def open_popup(self,mode='main'):self.popup=dict(mode=mode,calls=0,ready=False)
 def step(self,tick,event):
  sent=[];sounds=[];phase=4;completed=False
  if self.menu==1:
   self.y+=self.v;self.v-=1
   if self.v<1:self.v=0;self.menu=0
  elif self.menu==2:
   self.v+=1;self.y-=self.v
   if self.v>16:self.v=17;self.menu=3
  if self.popup and not self.popup['ready']:
   if self.popup['calls']>9:self.popup['ready']=True
   self.popup['calls']+=1
  if event:
   if event.get('command')=='skill':
    if self.action==2 and self.flag:
     if self.targeting:self.open_popup('levels');self.targeting=False;self.bits=0
     elif self.popup and self.popup['ready']:
      if self.popup['mode']=='levels':self.popup['mode']='main'
      else:self.popup=None;self.flag=False
     elif not self.popup:self.open_popup()
    else:self.action=2;self.flag=True;self.targeting=False;self.bits=0;self.gate=False;self.open_popup();sounds.append(0x33)
   elif event.get('command')=='skill-back':self.popup['mode']='main';sounds.append(0x33)
   elif event.get('command')=='skill-close':self.popup=None;self.flag=False;sounds.append(0x39)
   elif event.get('command')=='guard':self.action=0;self.popup=None;self.targeting=False;self.bits=0;self.flag=False;sent.append('G');sounds.append(0x39);completed=True
   elif'main'in event:self.main=event['main'];self.popup['mode']='levels';sounds.append(0x33)
   elif'level'in event:
    self.level=event['level'];self.popup=None;l=self.records[self.main]['levels'][self.level]
    if not self.target(l['fields']['132']):sent.append(f'S|{self.main:X}|{self.level:X}|{self.local:X}');self.bits=0;sounds.extend([0x39,0x33]);self.state=2;self.human+=1;self.hide()
    else:self.targeting=True
    sounds.append(0x33)
   elif'target'in event:
    code=basic.pick(event['target'],self.mask,self.bits)['code'];sent.append(f'S|{self.main:X}|{self.level:X}|{code:X}');self.bits=0;self.targeting=False;sounds.append(0x39);completed=True
  if self.state==0:
   self.action=self.first if self.human==0 else self.second;self.flag=True;self.bits=0
   if self.action==2:self.open_popup()
   else:self.target(0x475)
   self.state=1;self.mode=0 if self.control&16 else 1 if self.human==0 else 2;self.menu=1;self.y=-153;self.v=17;sounds.append(0x38)
  elif self.state==1:
   if completed:self.state=2;self.human+=1;self.bits=0;self.hide()
   self.gate=True
  elif self.state==2 and self.menu==3:
   if self.human==1:
    if self.control&16:self.first=self.action;self.state=3
    else:
     self.state=0;self.first=self.action
     if 1<self.action<7:self.limited=1;self.second=0
   else:self.second=self.action;phase=5
  elif self.state==3:phase=5
  countdown=None
  if self.timer:
   remain=i32(self.deadline-tick)
   if remain<1:
    remain=0;self.timer=False;self.bits=0;self.hide();self.popup=None;self.targeting=False
    if self.human==0:sent+=['N','N'];sounds.append(0x37);phase=5
    elif self.human==1:sent.append('N');sounds.append(0x37);phase=5
   sec=remain//1000;base=0x5690 if remain>9999 else 0x569a
   if remain<=9999 and sec!=self.last:sounds.append(0xca);self.last=sec
   countdown=dict(remaining=remain,seconds=sec,glyphs=[None if c==' 'else base+int(c)for c in f'{sec:2d}'[:2]])
  return dict(phaseAfter=phase,requests=sent,sounds=sounds,countdown=countdown,state=self.state,primaryCount=self.human,selected=self.action,limitedSecondary=self.limited,primaryMemory=self.first,secondaryMemory=self.second,deadline=self.deadline,timerActive=self.timer,lastSecond=self.last,gate=self.gate,selectionMask=self.mask,eligibleMask=self.bits,menu=dict(state=self.menu,mode=self.mode,offset=self.y,velocity=self.v,x=341,y=self.y),playerPopup=dict(state='closed'if not self.popup else'ready'if self.popup['ready']else'opening',introCalls=self.popup['calls']if self.popup else 0,mode=self.popup['mode']if self.popup else None,mainSlot=self.main,levelIndex=self.level,targeting=self.targeting))
def main():
 model=Records();events=[]
 def receive(c,slot,text):events.append(dict(consumer=c,slot=slot,bytesHex=text.encode('latin1').hex(),expected=model.update(c,slot,text)))
 receive('0x4f0210',262,'Original\\zSchool');receive('0x4f0510',2,level_text());receive('0x4f0290',None,header_text());receive('0x4f0510',0,level_text());receive('0x4f0510',14,level_text());initial=copy.deepcopy(model.rows)
 for n in[23,24,25,255,256]:receive('0x4f0210',-1,'H'*n)
 for n in[24,25,254,255,256]:receive('0x4f0510',1,level_text([('N'*n,'D'*97,2147483647,7,0xf123,1)]))
 receive('0x4f0510',1,'NoDelimiter');receive('0x4f0510',1,'Name|Description|-2|3|-1|-1|');receive('0x4f0510',1,'A\\zB|C\\nD|2|3|97|1|');receive('0x4f0510',1,'\x81\x7c|\x81\x5c|1|2|97|1|')
 receive('0x4f0290',None,header_text([(2,70,'',-1,-1,99,98,7,1,97,96)]));receive('0x4f0290',None,'-1|')
 rng=random.Random(0x4f0290)
 for n in range(24):receive('0x4f0290',None,header_text([(i,100+i,'R'+str(i),1,2,3,4,n,[0,1,2,5][(n+i)%4],rng.randrange(-500,501),rng.randrange(4))for i in range(15)if rng.randrange(4)]))
 scenarios=[]
 def add(name,actions,**kw):scenarios.append(dict(name=name,control=kw.pop('control',16),actions=actions,**kw))
 select=lambda slot=2,index=0,target=10:[dict(command='skill'),dict(main=slot),dict(level=index),*([dict(target=target)]if target is not None else[])]
 add('actual-slot-not-sorted-row',select());add('group-target',select(index=1));add('immediate-local',select(index=4,target=None));add('self-target',select(index=5,target=0));add('all-target',select(index=6));add('hex-main-slot',select(slot=14));add('coefficient-half',select(slot=0))
 add('back-close-reopen',[dict(command='skill'),dict(main=2),dict(command='skill-back'),dict(main=0),dict(command='skill-close'),*select(slot=14)])
 add('button-toggle',[dict(command='skill'),dict(main=2),dict(command='skill'),dict(command='skill'),*select()])
 add('target-reselection',[dict(command='skill'),dict(main=2),dict(level=0),dict(command='skill'),dict(level=1),dict(target=10)])
 add('change-to-guard',[dict(command='skill'),dict(main=2),dict(command='guard')]);add('limited-second',select()+[dict(command='guard')],control=0)
 add('timeout-open',[dict(command='skill')],timeout=True);add('wrap-target',select(),begin=0xfffffff0)
 for row in scenarios:
  ref=Input(row,initial);frames=[];at=0
  for index in range(220):
   event=None
   if ref.state==1 and ref.menu==0 and at<len(row['actions']):
    e=row['actions'][at]
    if e.get('command')in['skill','guard']or'target'in e and ref.targeting or ref.popup and ref.popup['ready']:event=e;at+=1
   tick=basic.u32(ref.begin+(30000 if row.get('timeout')and index>=40 else 16*(index+1)));result=ref.step(tick,event);frames.append(dict(tick=tick,event=event,expected=result))
   if result['phaseAfter']==5:break
  assert result['phaseAfter']==5 and at==len(row['actions']),row['name'];row['frames']=frames
 costs=[dict(main=a,level=b,expected=cost(a,b))for a in[-2147483648,-101,-100,-99,-1,0,1,99,100,101,2147483647]for b in[-2147483648,-101,-2,-1,0,1,2,99,100,2147483647]]
 out=dict(schema='moli.original-player-skills-stage197.v1',authority='independent source equations and original synthetic bytes; no product imports',sourceSha256='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',headerText=header_text(),levelText=level_text(),receives=events,initialRecords=initial,inputScenes=scenarios,costs=costs,counts=dict(receive_states=len(events),input_scenes=len(scenarios),input_states=sum(len(r['frames'])for r in scenarios),cost_cases=len(costs)))
 (A/'original-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(out['counts']))
if __name__=='__main__':main()
