#!/usr/bin/env python3
"""Recheck immutable native evidence and retained callback; no target execution."""
from pathlib import Path
from collections import Counter
import hashlib,json,re,struct
R=Path(__file__).resolve().parents[2];A=Path(__file__).resolve().parent;P=R/'build/analysis/game-legacy-frame-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 path=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=path.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];at=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,at+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def locate(address,n=1):
  rva=int(address,16)-base;found=[offset+rva-start for start,size,offset in sections if start<=rva and rva+n<=start+size];assert len(found)==1;return found[0]
 records=json.loads((P/'rea-final.json').read_text())['records'];previous=json.loads((R/'build/analysis/game-legacy-animation-v1/rea-final.json').read_text())['records'];old={x['evidence_id']:x for x in previous};now={x['evidence_id']:x for x in records};assert len(old)==713 and all(now[k]==v for k,v in old.items())
 new=[x for x in records if x['evidence_id'] not in old];checks=[];noncode=[];functions=[];reads={}
 for e in new:
  assert e['subject']['digest']['sha256']==SHA and e['provider']['id']=='ghidra' and e['provider']['version']=='12.1.4' and e['analysis_profile']['digest']==PROFILE
  op=e['operation'];n=e['normalized_result']
  if op=='inspect_native_instruction' and n['status']!='decoded':
   assert n['status'] in ['data','undecodable'];noncode.append(dict(id=e['evidence_id'],address=n['address'],status=n['status']));continue
  if op in ['read_bytes','inspect_native_instruction']:
   if op=='read_bytes':assert n['complete'] and n['requested_bytes']==n['returned_bytes'];reads[n['address']]=n['bytes_hex']
   b=bytes.fromhex(n['bytes_hex'] if op=='read_bytes' else n['bytes']);offset=locate(n['address'],len(b));assert raw[offset:offset+len(b)]==b;checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=offset,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),matched=True))
  elif op=='address_to_file_offset':assert n['file_offset']==locate(n['address']);checks.append(dict(id=e['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
  elif op=='analyze_function':functions.append(dict(id=e['evidence_id'],entry=n['procedure']['address'],body=n['procedure']['body'],value_flow_truncated=bool((n.get('native_value_flow') or {}).get('truncated'))))
 ops=dict(Counter(e['operation'] for e in new));assert len(records)==744 and len(new)==31 and ops==dict(analyze_function=9,inspect_native_instruction=13,resolve_containing_procedure=5,read_bytes=2,address_to_file_offset=2)
 assert len(functions)==9 and len({x['entry'] for x in functions})==9 and len(checks)==14 and len(noncode)==3
 assert len(bytes.fromhex(reads['0x463380']))==144
 constants=bytes.fromhex(reads['0x52d920']);assert struct.unpack_from('<d',constants)[0]==0.5 and struct.unpack_from('<f',constants,20)[0]>1.2 and struct.unpack_from('<f',constants,16)[0]>1.6
 callback=R/'build/analysis/game-legacy-actors-v1/callback-objdump.txt';assert info(callback)['sha256']=='806c3d47eec59fbe494bd2cd0adbd95d09374d1e41d4aae111a70f74b028a83f';ranges=[]
 for line in callback.read_text().splitlines():
  m=re.match(r'^\s*([0-9a-f]+):\s*((?:[0-9a-f]{2}\s+)+)',line)
  if not m:continue
  b=bytes.fromhex(m[2]);offset=locate('0x'+m[1],len(b));assert raw[offset:offset+len(b)]==b;ranges.append((int(m[1],16),len(b)))
 covered={a+i for a,n in ranges for i in range(n)};assert covered==set(range(0x43ba10,0x43c000))
 contract=json.loads((A/'implementation-spec.json').read_text());assert contract['source']==info(path) and contract['functions']==functions and contract['reused_callback']==info(callback)
 c=json.loads((A/'frame-catalog.json').read_text());assert c['engine']['phase_modulus']==4 and c['depth']['record_bytes']==52 and c['depth']['short_partition_maximum']==8 and c['graphics']['declared_resource_file_offset']==36
 assert json.loads((P/'session-closed.json').read_text())==dict(open=False,cleanup_pending=False)
 result=dict(schema='moli.legacy-frame-source-stage161.v1',source=info(path),tools=dict(rea='6.7.0',ghidra='12.1.4',analysis_profile=PROFILE),artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')],restored_records=713,total_records=744,new_records=31,new_operations=ops,
  function_dossiers=9,unique_function_entries=9,functions=functions,byte_and_mapping_checks=checks,noninstruction_observations=noncode,reused_functions=contract['reused_functions'],reused_callback=dict(**info(callback),byte_ranges_checked=len(ranges),unique_bytes_checked=len(covered)),session_closed=True,target_execution=False,real_credentials_or_sessions=False,
  source_corrections=contract['source_corrections'],limitations=contract['remaining'],goal_status='active',full_goal_complete=False)
 (A/'source-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(new=31,dossiers=9,unique=9,checks=14,noninstructions=3,callback_bytes=len(covered))))
if __name__=='__main__':main()
