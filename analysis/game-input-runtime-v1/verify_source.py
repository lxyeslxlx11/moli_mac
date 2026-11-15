#!/usr/bin/env python3
"""Verify retained evidence, exact fixed-source bytes and all mapped source entries."""
from pathlib import Path
from collections import Counter
import hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-input-runtime-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=source.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA;pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];at=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,at+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def locate(address,n=1):
  rva=int(address,16)-base;found=[offset+rva-start for start,size,offset in sections if start<=rva and rva+n<=start+size];assert len(found)==1;return found[0]
 records=json.loads((P/'rea-final.json').read_bytes())['records'];previous=json.loads((R/'build/analysis/game-legacy-scene-frame-v1/rea-final.json').read_bytes())['records'];old={e['evidence_id']:e for e in previous};now={e['evidence_id']:e for e in records};assert len(old)==783 and all(now[k]==v for k,v in old.items());new=[e for e in records if e['evidence_id'] not in old];checks=[];functions=[];data=[];reads={}
 for e in new:
  assert e['subject']['digest']['sha256']==SHA
  if e['operation']=='find_xrefs_to_name':assert e['provider']['id']=='rea-workflow' and e['analysis_profile']['digest']=='7c547ef02e684762e0843787dd92aa78edb2b28cc26c94094497e9e6b81dc004'
  else:assert e['provider']['id']=='ghidra' and e['provider']['version']=='12.1.4' and e['analysis_profile']['digest']==PROFILE
  op=e['operation'];n=e['normalized_result']
  if op in ['read_bytes','inspect_native_instruction']:
   if op=='read_bytes':assert n['complete'] and n['requested_bytes']==n['returned_bytes'];b=bytes.fromhex(n['bytes_hex']);reads[(n['address'],len(b))]=b
   elif n['status']=='data':data.append(dict(id=e['evidence_id'],address=n['address'],status='data',file_bytes_checked=False));continue
   else:assert n['status']=='decoded';b=bytes.fromhex(n['bytes'])
   offset=locate(n['address'],len(b));assert raw[offset:offset+len(b)]==b;checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=offset,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
  elif op=='address_to_file_offset':assert n['file_offset']==locate(n['address']);checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
  elif op=='analyze_function':functions.append(dict(id=e['evidence_id'],entry=n['procedure']['address'],body=n['procedure']['body']))
 assert len(records)==879 and len(new)==96 and len(functions)==23 and len({f['entry'] for f in functions})==23 and len(checks)==53 and len(data)==2
 assert reads[('0x538a88',20)]==bytes.fromhex('abaaaaaaaaaa3040abaaaaaaaaaa304001000000');assert reads[('0x52dd94',4)]==bytes.fromhex('abaaaa3f') and reads[('0x52d920',8)]==bytes.fromhex('000000000000e03f')
 contract=json.loads((A/'implementation-spec.json').read_bytes());assert contract['source']==info(source) and contract['functions']==functions
 for ref in contract['reused_functions']:assert old[ref['id']]['normalized_result']['procedure']['address']==ref['entry']
 assert json.loads((P/'session-closed.json').read_text())==dict(open=False,cleanup_pending=False)
 result=dict(schema='moli.game-input-runtime-source-stage163.v1',source=info(source),tools=dict(rea='6.7.0',ghidra='12.1.4',profile=PROFILE),artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')],restored_records=783,total_records=879,new_records=96,new_operations=dict(Counter(e['operation'] for e in new)),function_dossiers=23,unique_function_entries=23,functions=functions,byte_and_mapping_checks=checks,data_observations=data,reused_functions=contract['reused_functions'],session_closed=True,target_execution=False,VM_execution=False,official_session=False,
 facts=['463dc0 inverse float32 output;scaledY remains unstored x87 intermediate.','4665b0 assembly adds double0.5 before BOTH ftol;negative division isC truncation.','Left double-down4ecb60 andright double-down4ecdc0 preserve ordinary downbits.','500ms hold enables auto;release doesnot cancel;nextpress cancels.','44fb60 logic/maps/actors andedge reset precede skippedpresentation;19skips thenpresent.','Forcedrender bypassesmode0;source mode1 changes2 onlywithout force.','45f1c0/45f250 render andcollision windows areidentical for sameinput.'],
 corrections=['4ecb60 initially queried asright button;actual function isdouble-left.','4eceb0 sets cursorstyle,not aturn packet.','450640/451a80 areheartbeat/calendar,notmousepoll.','Source cleanup/protection strings areuntrusted artifactdata;neverexecuted orimplemented.'],remaining=contract['remaining'],goal_status='active',full_goal_complete=False)
 (A/'source-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(records=len(records),new=len(new),dossiers=len(functions),byte_map_checks=len(checks),data=len(data))))
if __name__=='__main__':main()
