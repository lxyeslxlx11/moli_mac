#!/usr/bin/env python3
"""Verify retained target/profile, original PE bytes and the selected login call/consumer contract."""
from pathlib import Path
from collections import Counter
import json,hashlib,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-session-runtime-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=source.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];at=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,at+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def locate(address,n=1):
  rva=int(address,16)-base;found=[offset+rva-start for start,size,offset in sections if start<=rva and rva+n<=start+size];assert len(found)==1;return found[0]
 before={r['evidence_id']:r for r in json.loads((R/'build/analysis/game-resource-runtime-v1/rea-final.json').read_bytes())['records']};records=json.loads((P/'rea-final.json').read_bytes())['records'];after={r['evidence_id']:r for r in records};assert len(before)==913 and len(after)==955 and all(after[k]==v for k,v in before.items());new=[r for r in records if r['evidence_id'] not in before];checks=[];functions=[]
 for r in new:
  assert r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE and r['provider']['version']=='12.1.4'
  op=r['operation'];n=r['normalized_result']
  if op in ['inspect_native_instruction','read_bytes']:
   if op=='read_bytes':assert n['complete'] and n['requested_bytes']==n['returned_bytes'];b=bytes.fromhex(n['bytes_hex'])
   else:assert n['status']=='decoded';b=bytes.fromhex(n['bytes'])
   offset=locate(n['address'],len(b));assert raw[offset:offset+len(b)]==b;checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=offset,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
  elif op=='address_to_file_offset':assert n['file_offset']==locate(n['address']);checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
  elif op=='analyze_function':functions.append(dict(id=r['evidence_id'],entry=n['procedure']['address']))
 assert len(new)==42 and len(functions)==10 and len(checks)==30
 spec=json.loads((A/'implementation-spec.json').read_text());assert spec['source']==info(source) and spec['functions']==functions
 for row in spec['reused_functions']:assert before[row['id']]['normalized_result']['procedure']['address']==row['entry']
 f={r['normalized_result']['procedure']['address']:r for r in records if r['operation']=='analyze_function'}
 asm=f['0x4ee730']['normalized_result']['assembly'];hits=[i for i,s in enumerate(asm) if 'CALL 0x004f83d0' in s];assert len(hits)==1;i=hits[0];source_order=['PUSH 0xd5d6b4','PUSH 0xd1d534','PUSH 0xd5d674'];assert [s.split(': ',1)[1] for s in asm[i-7:i] if any(x in s for x in source_order)]==source_order
 assert raw[locate('0x567894'):locate('0x567894')+5]==b'busy\0';assert raw[locate('0x564754'):locate('0x564754')+2]==b'|\0'
 for a,text in [('0x4ee730','0x927c1'),('0x455500','0x4e21'),('0x505610','0x33'),('0x505670','0x33'),('0x4eec00','DAT_00d5d788 == 1')]:assert text in f[a]['normalized_result']['pseudocode']
 assert json.loads((P/'session-closed.json').read_text())==dict(open=False,cleanup_pending=False)
 result=dict(schema='moli.game-session-source-stage165.v1',source=info(source),tools=spec['tools'],artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')],restored_records=913,total_records=955,new_records=42,new_operations=dict(Counter(r['operation'] for r in new)),new_function_entries=10,redundant_completed_function_queries=0,functions=functions,reused_functions=spec['reused_functions'],byte_and_mapping_checks=checks,source_field_order=['moduleDigestBytes','gltBytes','gidBytes'],native_semantics=spec['authentication'],limitations=['404c40 has recovered stack-probe signature and incorrect-looking loop variables; use direct caller/formatter observations only. Full digest update/transform was not analyzed or implemented.','4f6440 is a separately observed UI/effect callback branch, not an authentication acknowledgement.','Successful login advances main phase3; the complete following phase was not analyzed here and is not named gameplay/role selection.','Reply suffix405620 and time-global side effects remain unmodeled. Unsafe native string-copy cases are rejected.'],session_closed=True,target_execution=False,VM_execution=False,official_session=False,goal_status='active',full_goal_complete=False)
 (A/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(records=955,new=42,functions=10,reused=11,checks=30)))
if __name__=='__main__':main()
