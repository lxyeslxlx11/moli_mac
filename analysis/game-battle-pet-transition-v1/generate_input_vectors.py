"""Independent normal pet-window input/cache model, composed with prior source primary-state equations."""
from pathlib import Path
import importlib.util,json
A=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('pet_input_prior',A.parent/'game-battle-mounted-input-v1/generate_vectors.py');old=importlib.util.module_from_spec(s);s.loader.exec_module(old)
basic=old.basic
RECORDS=[dict(slot=i,mode=[2,1,1,3,1][i],hp=[5,61,0,80,42][i],name='Pet'+str(i))for i in range(5)]
def text(row):
 v=old.pet_text(row['mode']).split('|');v[3]=str(row['hp']);v[22]=row['name'];v[23]='Alias'+str(row['slot']);return'|'.join(v)
class Input(basic.Reference):
 def __init__(self,row):
  super().__init__(row['control'],896);self.records=[dict(r)for r in RECORDS]
  if row.get('noActive'):self.records[0]['mode']=1
  self.cache=[[r['hp'],100,10,10]for r in self.records];self.activePet=next((r['slot']for r in self.records if r['mode']==2),-1)
  if self.activePet>=0:self.cache[self.activePet]=[row.get('pairedHP',70),100,10,10]
  self.popup=None;self.paired_hp=row.get('pairedHP',70)
 def step(self,tick,event):
  if self.popup is not None and not self.popup['ready']:
   if self.popup['calls']>9:self.popup['ready']=True
   self.popup['calls']+=1
  before=self.state;event=event or{};accepted=None;sound=None
  if 'updateHP'in event:self.records[event['updateHP'][0]]['hp']=event['updateHP'][1]
  if 'pet'in event:
   r=self.records[event['pet']]
   if r['mode']==1 and self.cache[r['slot']][0]>0:accepted='M|'+format(r['slot'],'X')
   else:sound=0x37
  if event.get('command')=='pet-recall'and self.activePet>=0:accepted='M|FF'
  result=super().step(tick,{'command':'guard'}if accepted else event if event.get('command')in['guard','attack','escape','position']else None)
  if before==0 and self.action==0:self.bits=(1<<10)|((1<<5)if self.paired_hp>0 else 0)
  if before==0 and self.action==4:self.bits=0;self.popup=dict(calls=0,ready=False)
  if accepted:self.action=4;result['requests']=[accepted];self.popup=None
  elif event.get('command')=='pet':
   toggle=self.action==4 and self.popup is not None;self.action=4;self.bits=0;self.popup=None if toggle else dict(calls=0,ready=False);result['sounds'].append(0x33)
  elif event.get('command')=='pet-close':self.popup=None
  elif event.get('command')in['guard','attack','escape','position']:self.popup=None
  if sound is not None:result['sounds'].append(sound)
  if not result['timerActive']:self.popup=None
  result.update(selected=self.action,eligibleMask=self.bits,petPopup=dict(state='closed'if self.popup is None else'ready'if self.popup['ready']else'opening',introCalls=self.popup['calls']if self.popup else 0,recallEnabled=bool(self.popup and self.popup['ready']and self.activePet>=0),records=[dict(slot=r['slot'],mode=r['mode'],name=r['name'],values=self.cache[r['slot']],enabled=r['mode']==1 and self.cache[r['slot']][0]>0)for r in self.records if r['mode']in[1,2]]if self.popup else[]))
  return result

def main():
 rows=[]
 for slot in[1,4]:rows.append(dict(name='choose-slot-'+str(slot),control=16,actions=[dict(command='pet'),dict(pet=slot)]))
 rows.extend([dict(name='reject-current-and-zero',control=16,actions=[dict(command='pet'),dict(pet=0),dict(pet=2),dict(pet=4)]),dict(name='recall',control=16,actions=[dict(command='pet'),dict(command='pet-recall')]),dict(name='recall-zero-HP',control=16,pairedHP=0,actions=[dict(command='pet'),dict(command='pet-recall')]),dict(name='close-reopen',control=16,actions=[dict(command='pet'),dict(command='pet-close'),dict(command='pet'),dict(pet=1)]),dict(name='toggle-popup',control=16,actions=[dict(command='pet'),dict(command='pet'),dict(command='pet'),dict(pet=4)]),dict(name='change-command',control=16,actions=[dict(command='pet'),dict(command='guard')]),dict(name='cache-not-live-persistent-HP',control=16,actions=[dict(command='pet'),dict(updateHP=[1,0]),dict(pet=1)]),dict(name='cache-zero-not-live-recovery',control=16,actions=[dict(command='pet'),dict(updateHP=[2,99]),dict(pet=2),dict(pet=4)]),dict(name='no-active-pet',control=16,noActive=True,actions=[dict(command='pet'),dict(pet=0)]),dict(name='double-human-limits-second',control=0,actions=[dict(command='pet'),dict(pet=1),dict(command='guard')]),dict(name='timeout-open-popup',control=16,timeout=True,actions=[dict(command='pet')])])
 for row in rows:
  ref=Input(row);frames=[];at=0
  for i in range(180):
   event=None
   if ref.state==1 and ref.menu==0 and at<len(row['actions']):
    a=row['actions'][at]
    if a.get('command')in ['pet','guard']or ref.popup and ref.popup['ready']:event=a;at+=1
   tick=basic.u32(896+(30000 if row.get('timeout')and i>=40 else 16*(i+1)));result=ref.step(tick,event);frames.append(dict(tick=tick,event=event,expected=result))
   if result['phaseAfter']==5:break
  assert at==len(row['actions'])and result['phaseAfter']==5,row['name'];row.update(frames=frames,records=[dict(r,wire=text(dict(r,mode=1 if row.get('noActive')and r['slot']==0 else r['mode'])))for r in RECORDS])
 out=dict(schema='moli.original-normal-pet-input-stage196.v1',authority='independent fixed source window/cache equations composed with original primary-state reference; no product imports',scenes=rows,counts=dict(scenes=len(rows),frames=sum(len(r['frames'])for r in rows)));(A/'input-vectors.json').write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps(out['counts']))
if __name__=='__main__':main()
