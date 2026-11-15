#!/usr/bin/env python3
"""Validate fixed PE source spans, retained REA contracts and entry-fade constants."""
from pathlib import Path
from datetime import datetime,timezone
import collections,hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=R/'analysis/game-battle-entry-v1';P=R/'build/analysis/game-battle-entry-v1';OLD=R/'build/analysis/game-battle-scene-v1'
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
 prior=read(OLD/'rea-final.json');current=read(P/'rea-final.json');old={r['evidence_id']:r for r in prior['records']};records={r['evidence_id']:r for r in current['records']};assert len(old)==1863 and len(records)==1915 and all(records[k]==v for k,v in old.items())
 new=[r for k,r in records.items()if k not in old];counts=collections.Counter(r['operation']for r in new);assert counts==dict(analyze_function=6,read_bytes=14,address_to_file_offset=32)
 before=read(P/'functions-before.json');after=dict(before);functions=[]
 for r in new:
  assert r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
  if r['operation']!='analyze_function':continue
  n=r['normalized_result'];address=n['procedure']['address'];assert address==r['parameters']['procedure']and address not in before
  after[address]={'id':r['evidence_id'],**{k:n[k]for k in ['procedure','pseudocode','assembly','callees','callers']}};p=P/(address[2:]+'-new.json');write(p,r);functions.append(dict(address=address,evidence_id=r['evidence_id'],body=n['procedure']['body'],dossier=info(p)))
 assert len(before)==613 and len(after)==619 and sum(r['body']['total_bytes']for r in functions)==478;write(P/'functions-complete.json',after)
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,start+40*i+8)for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def offset(address):
  rva=int(address,16)-base
  for vs,va,rs,rp in sections:
   if va<=rva<va+min(vs,rs):return rp+rva-va
  raise AssertionError(address)
 maps={r['normalized_result']['address']:r for r in records.values()if r['operation']=='address_to_file_offset'};checks=[]
 spans=[]
 for address in ['437b30','503330','505030','433cd0','433b70','437890','437920','4f36d0','4f3430','44ce40','40a0c0','501a10','501a30','403320','46c6b0']:
  body=after['0x'+address]['procedure']['body'];assert body['available']and len(body['ranges'])==1;spans.append((body['ranges'][0]['start'],body['total_bytes']))
 spans += [(n,4)for n in ['0x52ef44','0x52d3f4','0x52d3e4','0x52ef58','0x52d400']]
 scalars={}
 for address,size in spans:
  r=next(r for r in records.values()if r['operation']=='read_bytes'and r['normalized_result']['address']==address and r['normalized_result']['requested_bytes']==size);n=r['normalized_result'];content=bytes.fromhex(n['bytes_hex']);end=hex(int(address,16)+size-1);at=offset(address)
  assert n['complete']and n['returned_bytes']==size==len(content)and raw[at:at+size]==content
  assert maps[address]['normalized_result']['file_offset']==at and maps[end]['normalized_result']['file_offset']==at+size-1
  checks.append(dict(address=address,end=end,file_offset=at,bytes=size,sha256=hashlib.sha256(content).hexdigest(),evidence_id=r['evidence_id'],retained_evidence_reused=r['evidence_id']in old,original_bytes_equal=True))
  if size==4:scalars[address]=struct.unpack('<f',content)[0]
 assert scalars=={'0x52ef44':-640.0,'0x52d3f4':640.0,'0x52d3e4':1.0,'0x52ef58':-1.0,'0x52d400':0.0}
 assert len(checks)==20
 reused=[]
 for address in ['437b30','503330','505030','433cd0','433b70','437890','437920','4f36d0','4f3430','419930','506e80','506ac0','5059f0','409e70','409fe0','4347e0','4348e0','434b90','437460']:
  r=old[before['0x'+address]['id']];p=P/(address+'-retained.json');write(p,r);reused.append(dict(address='0x'+address,evidence_id=r['evidence_id'],dossier=info(p)))
 close=read(P/'session-closed.json')['result'];state=read(P/'final-session-status.json');assert close['evidence_records']==1915 and close['bytes']==498783001 and state==dict(open=False,cleanup_pending=False)
 guard=after['0x4378d0'];helper=after['0x46c6b0'];assert guard['id']in old
 assert 'DAT_00c10c3c == 0'in guard['pseudocode']and 'FUN_0046c6b0(0x20,1,0,0)'in guard['pseudocode']
 assert '[EDX*0x8 + 0x0]'in '\n'.join(helper['assembly'])and 'SHL EAX, 0x2'in '\n'.join(helper['assembly'])and 'dword ptr [EAX + 0xc101bc]'in '\n'.join(helper['assembly'])
 window=dict(classification='derived',table_base='0xc101bc',stride_bytes=84,index=32,pointer_slot='0xc10c3c',observer_index=29,observer_pointer_slot='0xc10b40',guard_function='0x4378d0',guard_evidence_id=guard['id'],table_function='0x46c6b0',table_evidence_id=helper['id'],meaning='existing window32 pointer guard; full window lifecycle remains unimplemented')
 assert int(window['table_base'],16)+window['stride_bytes']*window['index']==int(window['pointer_slot'],16)
 assert int(window['table_base'],16)+window['stride_bytes']*window['observer_index']==int(window['observer_pointer_slot'],16)
 table=dict(schema='moli.battle-entry-constants-stage185.v1',fade_type=13,source_case=6,width=640,height=480,stride=8,acceleration=2.0,source_constant_values=scalars,completion='stored float rowOffset[0] ==0 after the return-motion update; no fixed-duration completion',initialization='480 velocity and480 offset cells zeroed by503330; symmetric alternating row ramps until offset[241] leaves[-640,640]',window_table=window)
 write(A/'source-tables.json',table)
 out=dict(schema='moli.battle-entry-source-stage185.v1',source=info(source),tool='REA6.7.0/Ghidra12.1.4',analysis_profile=PROFILE,records=1915,new_records=52,new_operations=dict(counts),known_functions_before=613,known_functions_after=619,new_functions=functions,reused_dossiers=reused,byte_checks=checks,original_bytes_verified=sum(r['bytes']for r in checks),new_read_record_bytes=sum(r['normalized_result']['returned_bytes']for r in new if r['operation']=='read_bytes'),source_tables=info(A/'source-tables.json'),
 observed_facts=['437b30 case0/1 invokes505030(13,8,float2) and completes from503330 case6 state, not elapsed wall time','503330 zeroes480 velocity/offset cells, initializes symmetric alternating ramps and updates offset/velocity per call; completion checks first row offset','503330 renders each source row[0,y,640,y+1] at trunc(offset[y]),y through44ce40 clipping/copy','40a0c0 marks pool nodes deleted; it does not free them immediately;433b70 resets tables and disables quarter throttling','Native case2 advances callbacks/sorts/submits before consuming one C record, then applies entry-facing and changes to3','437890 checks only the first20 slots, requests body state2 for arrivals still missing flag1, and is called after frame submission in case3','P fields0/1 are source local-slot/control flags; M is only consumed in source case5, not immediately upon receive','437920 reorients opposing halves from entry-target and calls animation mode1 when control flag bits0/1 request it','Entry popup46c6b0/46c560 and C selection/input/other UI are separate dependencies; no synthetic popup handle or input completion is established','501a10 stores actual main/substate while501a30 stores a separate request; this distinction is preserved for future full exit'],
 derived_facts=[window],coverage_limits=['Only source entry fade13 and main10 entry/C/arrival scheduling are the current port; full native main10/input/M/exit remains incomplete','Popup/menu/observer UI, audio, selection and actual product battle page remain unimplemented','Whole source pool includes ordinary objects outside the current battle owner; native heap/address identity is not claimed','Original game/official/device execution not performed; fixed-profile call/pixel evidence is separate from original runtime acceptance'],artifacts=[info(P/n)for n in ['rea-final.json','rea.snapshot.json','functions-complete.json','session-closed.json','final-session-status.json']],session_closed=True,VM_actions=0,original_execution=0,official_sessions=0,phase_complete=False,full_goal_complete=False,goal_status='active',recorded_utc=datetime.now(timezone.utc).isoformat())
 write(A/'source-check.json',out);print(json.dumps(dict(records=1915,new_records=52,new_canonical=6,canonical_total=619,read_spans=20,original_bytes_verified=out['original_bytes_verified'],new_read_bytes=out['new_read_record_bytes'],closed=True)))
if __name__=='__main__':main()
