#!/usr/bin/env python3
"""Verify retained REA identity, source spans and separately seeded callback instructions."""
from pathlib import Path
from datetime import datetime,timezone
import collections,hashlib,json,re,struct
R=Path(__file__).resolve().parents[2];A=R/'analysis/game-battle-input-v1';P=R/'build/analysis/game-battle-input-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def read(p):return json.loads(p.read_text())
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
def info(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=source.read_bytes();assert len(raw)==1569280 and hashlib.sha256(raw).hexdigest()==SHA
 previous=read(R/'build/analysis/game-battle-entry-v1/rea-final.json');current=read(P/'rea-final.json');old={r['evidence_id']:r for r in previous['records']};records={r['evidence_id']:r for r in current['records']}
 assert len(old)==1915 and len(records)==2074 and all(records[k]==v for k,v in old.items())
 new=[r for k,r in records.items()if k not in old];counts=collections.Counter(r['operation']for r in new)
 assert counts==dict(read_bytes=45,address_to_file_offset=87,analyze_function=23,resolve_containing_procedure=3,inspect_native_instruction=1)
 before=read(P/'functions-before.json');after=dict(before);functions=[];known=[]
 for r in new:
  assert r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
  if r['operation']!='analyze_function':continue
  n=r['normalized_result'];address=n['procedure']['address'];p=P/(address[2:]+'-'+r['evidence_id'][3:11]+'.json');write(p,r)
  row=dict(address=address,evidence_id=r['evidence_id'],body=n['procedure']['body'],dossier=info(p))
  if address in before:known.append(row)
  else:
   assert address not in after;after[address]={'id':r['evidence_id'],**{k:n[k]for k in ['procedure','pseudocode','assembly','callees','callers']}};functions.append(row)
 assert len(before)==619 and len(after)==639 and len(functions)==20 and len(known)==3;write(P/'functions-complete.json',after)
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,start+40*i+8)for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def offset(address):
  rva=int(address,16)-base
  for vs,va,rs,rp in sections:
   if va<=rva<va+min(vs,rs):return rp+rva-va
  raise AssertionError(address)
 maps={r['normalized_result']['address']:r for r in records.values()if r['operation']=='address_to_file_offset'};checks=[];memory={}
 for row in read(P/'read-plan.json'):
  address=row['address'];size=row['length'];r=next(r for r in records.values()if r['operation']=='read_bytes'and r['normalized_result']['address']==address and r['normalized_result']['requested_bytes']==size);n=r['normalized_result'];content=bytes.fromhex(n['bytes_hex']);end=hex(int(address,16)+size-1);at=offset(address)
  assert n['complete']and len(content)==n['returned_bytes']==size and raw[at:at+size]==content
  assert maps[address]['normalized_result']['file_offset']==at and maps[end]['normalized_result']['file_offset']==at+size-1
  checks.append(dict(**row,end=end,file_offset=at,bytes=size,sha256=hashlib.sha256(content).hexdigest(),evidence_id=r['evidence_id'],retained_evidence_reused=r['evidence_id']in old,original_bytes_equal=True));memory[(address,size)]=content
 assert len(checks)==45 and sum(r['bytes']for r in checks)==17405
 callbacks=[];instruction_bytes=0
 for filename,receipt_name in [('callbacks-derived.json','callback-export-receipt.json'),('command-callbacks-derived.json','command-callback-export-receipt.json')]:
  v=read(P/filename);receipt=read(P/receipt_name);assert receipt['exit_code']==0 and not receipt['target_executed']and not v['target_executed']and not v['source_written']
  assert v['source']['sha256']==SHA and v['tool']['version']=='12.1.4'
  for f in v['functions']:
   assert f['analyst_defined_entry']and f['body_bytes']==sum(q['bytes']for q in f['ranges'])
   size=0;seen=set()
   for instruction in f['instructions']:
    address=instruction['address'];b=bytes.fromhex(instruction['bytes']);at=offset(address);assert raw[at:at+len(b)]==b
    positions=set(range(int(address,16),int(address,16)+len(b)));assert not seen&positions;seen|=positions;size+=len(b)
   assert size==f['body_bytes'];instruction_bytes+=size;callbacks.append(dict(entry=f['entry'],classification='derived-static-function-from-observed-code-pointer',body_bytes=size,instructions=len(f['instructions']),source_spans=f['ranges'],export=info(P/filename)))
 assert len(callbacks)==13 and instruction_bytes==4446
 descriptor=struct.unpack('<12I',memory[('0x52e298',48)]);assert descriptor[7]==14 and descriptor[8:11]==(0x54af30,0x489ea0,0x48a060)
 widgets=[]
 for i in range(14):
  q=struct.unpack_from('<8I',memory[('0x54af30',448)],i*32);widgets.append(dict(index=i,type=q[0],x=q[1],y=q[2],width=q[3],height=q[4],visible=q[5],data_pointer=hex(q[6]),callback=hex(q[7])))
 seeds={r['entry']for r in callbacks};assert {w['callback']for w in widgets[:9]}<=seeds
 literals={int(s,16)for line in before['0x48b810']['assembly']for s in re.findall(r'0x[0-9a-fA-F]+',line)}
 assert {0x48a7d0,0x48b170,0x48b2e0}<=literals
 assert struct.unpack('<I',memory[('0x559a60',4)])[0]==0x52e298 and memory[('0x567bfc',8)].split(b'\0')[0]==b'$T5'
 table=dict(schema='moli.battle-input-source-tables-stage186.v1',window_id=26,descriptor_address='0x52e298',definition_stride=32,runtime_widget_stride=36,widgets=widgets,formation=[14,12,10,11,13,19,17,15,16,18,9,7,5,6,8,4,2,0,1,3],action_operation=dict(id='send-004f88f0',tag='$T5',fields=['bytes']),menu_motion=dict(open_offset=-153,open_velocity=17,close_velocity_limit=16,completion='source velocity/menu state, not elapsed duration'),derived_context=[dict(classification='derived',rule='C values[0] maps object numeric carrier0x170;4374e0 uses signed decoded value>0 unless dead-target bit2 is allowed',sources=['0x433cd0','0x4374e0','0x4033d0','0x4034f0']),dict(classification='derived',rule='A positive resolved first C link is422d60 param3 and creates source child13b4; this owner remains unavailable for basic input',sources=['0x433cd0','0x422d60','0x48b810'])])
 write(A/'source-tables.json',table)
 close=read(P/'session-closed.json')['result'];state=read(P/'final-session-status.json');assert close['evidence_records']==2074 and close['bytes']==506614267 and state==dict(open=False,cleanup_pending=False)
 out=dict(schema='moli.battle-input-source-stage186.v1',source=info(source),tool='REA6.7.0/Ghidra12.1.4',analysis_profile=PROFILE,records=2074,new_records=159,new_operations=dict(counts),known_functions_before=619,known_functions_after=639,new_functions=functions,known_function_queries=known,derived_callbacks=callbacks,derived_callback_instruction_bytes=4446,byte_checks=checks,original_bytes_verified=17405,new_read_record_bytes=sum(r['normalized_result']['returned_bytes']for r in new if r['operation']=='read_bytes'),source_tables=info(A/'source-tables.json'),
 observed_facts=['48b810 owns input states0..5 and only later requests native main10/5; received M is not an input-complete signal','4899c0 plus489ea0 uses source window26 offset/velocity/state; close completion waits for native menu state3','4374e0 owns target actor flags, paired slots, signed value170 checks and front/back restrictions;437080 prioritizes single/cross/side/all selection bits','Source command callbacks emit H|target,G,P,E through4f88f0, with $T5 carrying one byte field;48b5b0 emits N and W|FF under precise counter/control conditions','436fa0/436f50 reset then accumulate actor flag40; repeated A only adds current acknowledged bits','REA retained three not_in_procedure lookups; all13 source code-pointer entries required explicit definition in the independent Ghidra project, a separate derived analysis'],
 coverage_limits=['Basic semantic command/owned-slot input is ported, not original native hit indices, full menu pixels, audio or a product battle page','Skill/item/pet/mount/observer and special13b4 owners remain required; no dependency-ready booleans or fake handles are supplied','Native M5/6, exit7/8/9, other body/mount/effects and complete gameplay remain incomplete','Original program, VM, account, device and official execution are not established by these static/local checks'],
 recovery=['Initial attempt to open a snapshot as an executable was format-rejected; correct source+snapshot input used afterward','Interruption closed the target and discarded three unexported results; live closed state was checked, saved1945-record bundle imported, and the three results reacquired with matching IDs','Original script helper adds functions only to expendable independent projects; no REA/global configuration or target code changed'],
 artifacts=[info(P/n)for n in ['rea-final.json','rea.snapshot.json','functions-complete.json','callbacks-derived.json','command-callbacks-derived.json','callback-export-receipt.json','command-callback-export-receipt.json','session-closed.json','final-session-status.json']],callback_exporter=info(A/'ExportCallbackDossiers.java'),session_closed=True,VM_actions=0,original_execution=0,official_sessions=0,phase_complete=False,full_goal_complete=False,goal_status='active',recorded_utc=datetime.now(timezone.utc).isoformat())
 write(A/'source-check.json',out);print(json.dumps(dict(records=2074,new_records=159,canonical=639,new_canonical=20,derived_callbacks=13,derived_instruction_bytes=4446,source_spans=45,source_bytes=17405,new_read_bytes=out['new_read_record_bytes'],closed=True)))
if __name__=='__main__':main()
