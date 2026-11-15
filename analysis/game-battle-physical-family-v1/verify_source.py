#!/usr/bin/env python3
"""Verify fixed-source identities, layered canonical functions and precise native observations.

This checks original file bytes and source evidence. It does not execute the game,
prove native timing, or accept the unimplemented common-family product consumers.
"""
from pathlib import Path
import hashlib,json,re,struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-physical-family-v1'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def info(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(8*1024*1024),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
 previous_path=R/'analysis/game-battle-skill82-v1/source-check.json';previous=read(previous_path);source=previous['source'];profile=previous['analysis_profile'];assert info(R/source['path'])==source;raw=(R/source['path']).read_bytes();artifacts=[previous_path]
 for row in previous['artifacts']:assert info(R/row['path'])==row,row['path']
 base_path=R/previous['canonical_cache']['path'];base=read(base_path);assert info(base_path)==previous['canonical_cache']and len(base)==718;artifacts.append(base_path)
 pe=struct.unpack_from('<I',raw,60)[0];assert raw[pe:pe+4]==b'PE\0\0'and struct.unpack_from('<H',raw,pe+24)[0]==0x10b
 image=struct.unpack_from('<I',raw,pe+52)[0];optional=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
  _,va,n,at=struct.unpack_from('<IIII',raw,pe+24+optional+i*40+8);sections.append((image+va,at,n))
 def offset(va,n):
  for start,at,count in sections:
   if start<=va and va+n<=start+count:return at+va-start
  raise AssertionError('not a contiguous original-file range')
 snapshot=read(P/'rea.snapshot.json');records=snapshot['evidence_bundle']['records'];byid={r['evidence_id']:r for r in records};assert len(records)==len(byid)==95 and snapshot['binding']['analysis_profile']['digest']==profile
 for r in records:
  assert r['subject']['digest']['sha256']==source['sha256']
  if r['provider']['id']=='ghidra':assert r['analysis_profile']['digest']==profile
  else:assert r['operation']=='batch_decompile'and r['analysis_profile']['parameters']['upstream_analysis_profile']['digest']==profile
 lookup={(r['operation'],r['parameters'].get('address')):r for r in records}
 overlay_path=P/'functions-added.json';overlay=read(overlay_path);assert len(overlay)==10 and not(set(base)&set(overlay));new=[];checks=[]
 def check_range(address,n):
  e=lookup['read_bytes',address];m=lookup['address_to_file_offset',address];b=e['normalized_result'];at=offset(int(address,16),n);got=bytes.fromhex(b['bytes_hex']);assert b['complete']and b['requested_bytes']==b['returned_bytes']==len(got)==n and m['normalized_result']['file_offset']==at and got==raw[at:at+n]
  checks.append(dict(address=address,bytes=n,file_offset=at,sha256=hashlib.sha256(got).hexdigest(),read_id=e['evidence_id'],mapping_id=m['evidence_id']));return got
 for address,d in sorted(overlay.items()):
  e=byid[d['id']];assert e['operation']=='analyze_function'and d==dict(id=e['evidence_id'],**e['normalized_result'])and d['procedure']['address']==address;body=d['procedure']['body'];assert body['available']and body['contains_entry']and not body['non_contiguous']and len(body['ranges'])==1
  assert int(body['ranges'][0]['start'],16)==int(address,16)and int(body['ranges'][0]['end'],16)+1==int(address,16)+body['total_bytes'];check_range(address,body['total_bytes']);new.append(dict(address=address,body=body,evidence_id=e['evidence_id'],direct_callees=[c['address']for c in d['callees']]))
 assert sum(x['body']['total_bytes']for x in new)==3679
 merged={**base,**overlay};assert len(merged)==728 and not{c for r in new for c in r['direct_callees']if c not in merged}
 for address,n in [('0x52d3a8',4),('0x52d3fc',8),('0x52d41c',8),('0x52d448',8),('0x52d4f8',16)]:check_range(address,n)
 spec=read(A/'implementation-spec.json')
 for fmt,constants in spec['constant_inputs'].items():
  for address,value in constants.items():assert struct.unpack_from('<f'if fmt=='float32'else'<d',raw,offset(int(address,16),4 if fmt=='float32'else 8))[0]==value
 assert sum(c['bytes']for c in checks)==3723
 # Original instructions, rather than undefined x87 C temporaries, prove the argument and return contracts.
 asm=lambda address:'\n'.join(overlay[address]['assembly'])
 for expected in ['0x41a582: FLD float ptr [ESP + 0x14]','0x41a5ab: PUSH EDI','0x41a5c0: FLD float ptr [ESP + 0x1c]','0x41a5c4: MOV dword ptr [ESP + 0x20], EAX','0x41a5cf: MOV dword ptr [ESP + 0xc], EAX','0x41a5e2: FILD dword ptr [ESP + 0x2c]','0x41a5eb: CALL 0x00419dd0']:assert expected in asm('0x41a550')
 for expected in ['0x419ccd: XOR AL, AL','0x419cfb: XOR AL, AL','0x419d29: XOR AL, AL','0x419d4b: MOV AL, 0x1','0x419d54: MOV AL, 0x1','0x419d58: OR AL, 0xff']:assert expected in asm('0x419bd0')
 for expected in ['0x41a972: FADD double ptr [0x0052d500]','0x41a982: FMUL double ptr [0x0052d4f8]','0x41a988: CALL 0x0051b4a8','0x41a997: ADD EAX, 0x10','0x41a9ab: ADD EAX, -0x10','0x41a9be: ADD EDX, 0x10']:assert expected in asm('0x41a8c0')
 assert 'OR AH, 0xc'in asm('0x51b4a8')and'FISTP qword ptr [EBP + -0xc]'in asm('0x51b4a8')
 # Reuse the previous original-byte proof for common producers; verify it against the current PE.
 skill=read(R/'analysis/game-battle-skill-v1/source-check.json');retained=[]
 for address in ['0x424310','0x423fa0','0x4241f0','0x436c20']:
  c=next(c for c in skill['provider_byte_checks']if c['address']==address);at=offset(int(address,16),c['bytes']);assert at==c['file_offset']and hashlib.sha256(raw[at:at+c['bytes']]).hexdigest()==c['sha256'];retained.append(c)
 assert sum(c['bytes']for c in retained)==8618;artifacts.append(R/'analysis/game-battle-skill-v1/source-check.json')
 for address,n in [('40a120',62225),('41dc00',5390)]:
  path=R/f'build/analysis/game-battle-status-skills-v1/read_bytes-{address}.json';e=read(path);b=e['normalized_result'];at=offset(int(address,16),n);assert b['complete']and b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n];artifacts.append(path)
 derived=R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json';entry=next(e for e in read(derived)['entries']if e['requestedEntry']=='004260b0');instruction_bytes=0
 for ins in entry['instructions']:
  b=bytes.fromhex(ins['bytesHex']);at=offset(int(ins['address'],16),len(b));assert raw[at:at+len(b)]==b;instruction_bytes+=len(b)
 assert instruction_bytes==54685;artifacts.append(derived)
 # Keep the finite historical Evidence union separate from normalized function dossiers.
 prior_path=R/'build/analysis/game-battle-skill82-v1/prior-record-check.json';prior=read(prior_path);exact=prior['prior_exact_JSON_proof'];assert info(R/exact['path'])==exact;artifacts.extend([prior_path,R/exact['path']]);ids=set();verified=[];pattern=re.compile(rb'"evidence_id"\s*:\s*"([^"]+)"')
 for row in prior['verified_prior_snapshot_files']:
  path=R/row['path'];h=hashlib.sha256();tail=b'';local=set()
  with path.open('rb')as f:
   for b in iter(lambda:f.read(8*1024*1024),b''):
    h.update(b);data=tail+b;local.update(m[1].decode()for m in pattern.finditer(data));tail=data[-256:]
  assert path.stat().st_size==row['bytes']and h.hexdigest()==row['sha256']and len(local)==row['exact_Evidence_records'],row['path'];ids.update(local);verified.append(row)
 assert len(verified)==45 and len(ids)==2323;small=[]
 for name,n in [('game-battle-numeric-skills-v1',29),('game-battle-moving-numeric-v1',42),('game-battle-skill82-v1',54)]:
  path=R/'build/analysis'/name/'rea.snapshot.json';rows=read(path)['evidence_bundle']['records'];local={r['evidence_id']for r in rows};assert len(rows)==len(local)==n;ids.update(local);small.append(dict(**info(path),exact_Evidence_records=n));artifacts.append(path)
 assert len(ids)==2346;current=set(byid);newids=sorted(current-ids);reused=sorted(current&ids);write(P/'prior-record-check.json',dict(schema='moli.physical-family-evidence-stage203.v1',verified_prior_snapshot_files=verified,prior_small_snapshots_verified=small,prior_exact_JSON_proof=exact,prior_union=len(ids),current_records=95,new_ids=newids,reused_ids=reused,new_distinct_records=len(newids),cumulative_after=len(ids|current),scope='45 whole-file hashes and streaming identity sets checked against the retained exact per-object JSON proof; three later29/42/54-record snapshots and current95 parsed as full objects. Normalized canonical dossiers are a different scope.'))
 close=read(P/'close-result.json')['result'];assert close['evidence_records']==95 and close['primitive_entries']==18 and close['workflow_entries']==1;s=read(P/'session-final.json')['result'];assert not s['open']and not s['cleanup_pending']and s['server_identity']['package']['version']=='6.7.0'
 diagnostics=read(P/'query-diagnostics.json');assert diagnostics['invalid_input']['isError']and'0x41b910'not in overlay and diagnostics['interior_query']['canonical_entry']=='0x41a2d0';assert diagnostics['batch']['succeeded']==5 and diagnostics['batch']['failed']==1
 artifacts.extend([overlay_path,P/'rea.snapshot.json',P/'open-result.json',P/'close-result.json',P/'session-initial.json',P/'session-final.json',P/'query-diagnostics.json',P/'prior-record-check.json'])
 out=dict(schema='moli.physical-family-source-stage203.v1',source=source,tool='REA6.7.0/Ghidra12.1.4',analysis_profile=profile,canonical_cache_layers=[info(base_path),info(overlay_path)],canonical_functions_before=718,canonical_functions_after=728,new_canonical_functions=new,new_original_function_bytes=3679,new_original_constant_bytes=44,original_range_checks=checks,retained_common_producer_checks=retained,retained_common_producer_bytes=8618,retained_body_constructor_bytes=67615,retained_dispatcher_instruction_bytes=54685,retained_records_before=2346,retained_record_union_after=len(ids|current),new_distinct_records=len(newids),current_snapshot_records=95,reused_record_ids=reused,prior_snapshot_files_hash_verified=45,prior_small_snapshots_verified=3,normalized_cache_is_not_full_Evidence=True,interior_query_not_new_entry=diagnostics['interior_query'],invalid_candidate_not_a_native_procedure=True,selected_new_helper_direct_callees_resolved=True,complete_common_family_closure=False,source_contract=info(A/'implementation-spec.json'),consumer_obligations=info(A/'consumer-obligations.json'),artifacts=[info(p)for p in dict.fromkeys(artifacts)],session_closed=True,cleanup_pending=False,runtime_source_files_modified=0,new_runtime_tests=0,new_generated_tests=0,new_browser_flows=0,original_execution=0,VM_actions=0,official_sessions=0,limitations=spec['unknowns'],runtime_implementation_complete=False,source_investigation_complete=False,phase_complete=False,full_goal_complete=False,goal_status='active')
 write(A/'source-check.json',out);print(json.dumps(dict(canonical_functions=728,new_functions=10,function_bytes=3679,constant_bytes=44,retained_common_producer_bytes=8618,current_records=95,record_union=len(ids|current),new_records=len(newids),reused_records=len(reused),session_closed=True)),flush=True)
if __name__=='__main__':main()
