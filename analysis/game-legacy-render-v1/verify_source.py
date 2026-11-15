#!/usr/bin/env python3
"""Verify retained immutable native source, byte anchors and palette constants."""
from pathlib import Path
from collections import Counter
import hashlib,json,struct,re
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-legacy-render-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 path=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=path.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];at=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,at+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def locate(a,n=1):
  rva=int(a,16)-base;found=[offset+rva-start for start,size,offset in sections if start<=rva and rva+n<=start+size];assert len(found)==1;return found[0]
 records=json.loads((P/'rea-final.json').read_text())['records'];prior=json.loads((R/'build/analysis/game-legacy-local-movement-v1/rea-final.json').read_text())['records'];old={e['evidence_id']:e for e in prior};now={e['evidence_id']:e for e in records};assert len(old)==566 and all(now[k]==v for k,v in old.items())
 new=[e for e in records if e['evidence_id'] not in old];checks=[];not_code=[];functions=[]
 for e in new:
  assert e['subject']['digest']['sha256']==SHA and e['provider']['id']=='ghidra' and e['provider']['version']=='12.1.4' and e['analysis_profile']['digest']==PROFILE
  op=e['operation'];n=e['normalized_result']
  if op=='inspect_native_instruction' and n['status']!='decoded':not_code.append(dict(id=e['evidence_id'],address=n['address'],status=n['status'],use='reference metadata only; no executable instruction claim'));continue
  if op in ['read_bytes','inspect_native_instruction']:
   if op=='read_bytes':assert n['complete'] and n['requested_bytes']==n['returned_bytes']
   b=bytes.fromhex(n['bytes_hex'] if op=='read_bytes' else n['bytes']);off=locate(n['address'],len(b));assert raw[off:off+len(b)]==b;checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=off,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
  elif op=='address_to_file_offset':assert n['file_offset']==locate(n['address']);checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
  elif op=='analyze_function':functions.append(dict(id=e['evidence_id'],entry=n['procedure']['address'],body=n['procedure']['body'],assembly_rows=len(n['assembly']),pseudocode_characters=len(n['pseudocode']),value_flow_truncated=bool((n.get('native_value_flow') or {}).get('truncated'))))
 assert len(new)==92 and len(records)==658 and len(functions)==len({x['entry'] for x in functions})==36
 ops=dict(Counter(e['operation'] for e in new));assert ops==dict(analyze_function=36,inspect_native_instruction=50,read_bytes=1,resolve_containing_procedure=4,address_to_file_offset=1)
 catalog=json.loads((A/'render-catalog.json').read_text());f=next(e['normalized_result'] for e in new if e['operation']=='analyze_function' and e['normalized_result']['procedure']['address']=='0x449cf0');v={int(i,0):int(x,0) for i,x in re.findall(r'local_280\[([^]]+)\] = (0x[0-9a-f]+|[0-9]+);',f['pseudocode'])};assert all(i in v for i in range(128));colors=[[v[i+k] for k in range(3)] for i in range(0,128,4)]
 assert catalog['cgp']['fixed_first16']+catalog['cgp']['fixed_last16']==colors
 asm=f['assembly'];assert '0x44a293: MOV dword ptr [ECX + 0x611ec8], ESI' in asm and '0x44a29b: MOV word ptr [EDX], AX' in asm
 upload=next(e['normalized_result'] for e in new if e['operation']=='analyze_function' and e['normalized_result']['procedure']['address']=='0x4497c0');assert '0x4499b8: SUB EAX, EDX' in upload['assembly']
 comparator=next(e for e in new if e['operation']=='read_bytes')['normalized_result'];assert comparator['address']=='0x507200' and comparator['returned_bytes']==48
 assert bytes.fromhex(comparator['bytes_hex'])==bytes.fromhex('8b542404568b74240c8a42028a4e023ac17607b8010000005ec3730583c8ff5ec30fbf0a0fbf062bc15ec39090909090')
 contract=json.loads((A/'implementation-spec.json').read_text());assert contract['source']==info(path) and contract['functions']==functions
 closed=json.loads((P/'session-closed.json').read_text());assert closed==dict(open=False,cleanup_pending=False)
 result=dict(schema='moli.legacy-render-source-stage159.v1',source=info(path),tools=dict(rea='6.7.0',ghidra='12.1.4',analysis_profile=PROFILE),artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')],restored_records=566,total_records=658,new_records=92,new_operations=ops,functions=functions,byte_and_mapping_checks=checks,non_instruction_observations=not_code,palette_constants_regenerated=32,comparator_bounded_bytes=48,session_closed=True,target_execution=False,full_goal_complete=False,goal_status='active',limitations=['449cf0 full value flow is truncated; only retained literal initialization/copy loops and verified32-bit branch are used.','4497c0/449a10/4468b0 decompiler signatures confuse stack slots. Raw assembly binds sourceX/Y/stride,source rows descend,key range equals third argument0.','Native malformed output has no safe bound check. Independent codec rejects under/overrun; no stale scratch/padding colors invented.','Ordinary32-bit full-sprite path only. Actual native/visual gameplay,current-version comparison,animation/effects/input/host and official acceptance incomplete.'])
 (A/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(new_records=92,functions=36,checks=len(checks),non_instruction_observations=not_code)))
if __name__=='__main__':main()
