#!/usr/bin/env python3
"""Verify the fixed original PE, retained profile/dossiers and post-login contract byte mappings."""
from pathlib import Path
from collections import Counter
import hashlib,json,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-post-login-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 p=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=p.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,start+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def locate(address,n=1):
  rva=int(address,16)-base;found=[offset+rva-first for first,size,offset in sections if first<=rva and rva+n<=first+size];assert len(found)==1;return found[0]
 previous=json.loads((R/'build/analysis/game-session-runtime-v1/rea-final.json').read_bytes())['records'];records=json.loads((P/'rea-final.json').read_bytes())['records'];before={x['evidence_id']:x for x in previous};after={x['evidence_id']:x for x in records};assert len(before)==955 and len(after)==1044 and all(after[k]==v for k,v in before.items());new=[r for r in records if r['evidence_id'] not in before];checks=[];functions=[]
 for r in new:
  assert r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE and r['provider']['version']=='12.1.4'
  n=r['normalized_result'];op=r['operation']
  if op in ['inspect_native_instruction','read_bytes']:
   if op=='read_bytes':assert n['complete'] and n['requested_bytes']==n['returned_bytes'];b=bytes.fromhex(n['bytes_hex'])
   else:assert n['status']=='decoded';b=bytes.fromhex(n['bytes'])
   offset=locate(n['address'],len(b));assert raw[offset:offset+len(b)]==b;checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=offset,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
  elif op=='address_to_file_offset':assert n['file_offset']==locate(n['address']);checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
  elif op=='analyze_function':functions.append(dict(id=r['evidence_id'],entry=n['procedure']['address']))
 assert len(new)==89 and len(functions)==28 and len(checks)==60
 spec=json.loads((A/'implementation-spec.json').read_text());assert spec['source']==info(p) and spec['functions']==functions
 for row in spec['reused_functions']:assert before[row['id']]['normalized_result']['procedure']['address']==row['entry']
 f={r['normalized_result']['procedure']['address']:r for r in records if r['operation']=='analyze_function'}
 old_entries={r['normalized_result']['procedure']['address'] for r in previous if r['operation']=='analyze_function'};assert len({r['entry'] for r in functions}-old_entries)==27
 assert f['0x4f4a70']['normalized_result']['assembly']==['0x4f4a70: MOV AL, byte ptr [ESP + 0x8]','0x4f4a74: MOV [0x00924f40], AL','0x4f4a79: RET']
 def string(address):
  at=locate(address);return raw[at:raw.index(0,at)]
 assert string('0x5678b8')==b'OUTOFSERVICE';assert string('0x5678c8')==b'successful';assert string('0x53459c')==b'???'
 for addr,parts in [('0x4eed10',['iVar1 < 2','FUN_004f86e0','DAT_00d5d788 = 1']),('0x4eed50',['600000 <','DAT_00d5d788 != 2']),('0x4eef20',['iVar3 < 6','0x3ff','FUN_00500630']),('0x500630',['0x94','0x10','0x3f','/ 10']),('0x4ef060',['FUN_004f8650','DAT_00f5ea2c','DAT_00f5ea30','DAT_00f5e9f8']),('0x4ef0c0',["DAT_00d18e35 != '\\0'",'DAT_00d5d788 == 2','600000 <']),('0x458900',['FUN_004544e0','FUN_005019f0(5)']),('0x456520',['FUN_005019f0(9)'])]:
  text=f[addr]['normalized_result']['pseudocode'];assert all(part in text for part in parts),(addr,parts)
 assert json.loads((P/'session-closed.json').read_text())==dict(open=False,cleanup_pending=False)
 result=dict(schema='moli.game-post-login-source-stage166.v1',source=info(p),tools=spec['tools'],artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')],restored_records=955,total_records=1044,new_records=89,new_operations=dict(Counter(r['operation'] for r in new)),function_dossiers=28,new_function_entries=27,redundant_completed_query=spec['redundant_completed_query'],functions=functions,reused_functions=spec['reused_functions'],byte_and_mapping_checks=checks,roster=spec['roster'],content=spec['content'],entry=spec['entry'],limitations=['Native main5 complete UI/global/object reset is not emulated; optional stream owner requires first-entry empty scene/map/entity projection.','Native preview animation/pointer-table/pixel callbacks, creation/deletion/look/auxiliary controls remain incomplete.','4ef130 recovered third parameter appears int but dispatcher supplies bytes and formatter treats it as a C string; use wire/assembly/call sites rather than recovered type.','5111a0 completed dossier was redundantly requested once. Different Evidence IDs do not imply artifact/version change.'],session_closed=True,target_execution=False,VM_execution=False,official_session=False,goal_status='active',full_goal_complete=False)
 (A/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(records=1044,new=89,dossiers=28,new_entries=27,checks=60,reused=17)))
if __name__=='__main__':main()
