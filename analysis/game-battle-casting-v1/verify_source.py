#!/usr/bin/env python3
# coding: utf-8
"""Verify exact original mappings, retained identities, derived instructions and canonical evidence union."""
from pathlib import Path
import json,hashlib,struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-casting-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def unwrap(d):return d.get('structuredContent',{}).get('result')or d.get('result')or json.loads(next(c['text']for c in d['content']if c['type']=='text'))['result']
def main():
 old=read(R/'analysis/game-battle-player-skills-v1/source-check.json');source=R/old['source']['path'];assert info(source)==old['source'];raw=source.read_bytes();pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];optional=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
  _,va,n,at=struct.unpack_from('<IIII',raw,pe+24+optional+i*40+8);sections.append((base+va,at,n))
 def offset(va,n):
  for start,at,count in sections:
   if start<=va and va+n<=start+count:return at+va-start
  raise AssertionError('Original mapped bytes unavailable')
 retained=R/'build/analysis/game-battle-player-skills-v1/functions-complete.json';assert info(retained)==next(x for x in old['artifacts']if x['path']==str(retained.relative_to(R)));functions=read(retained);assert len(functions)==705
 profile='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
 def evidence(path):
  e=read(path);assert e['subject']['digest']['sha256']==old['source']['sha256']and e['analysis_profile']['digest']==profile;return e
 checks=[];files=[retained];new={}
 for address,n in [('41f520',133),('436ee0',109),('41f450',194),('423340',405),('421a10',1405),('41f1a0',176),('41b1f0',163),('41f160',60)]:
  ev=evidence(P/f'function-{address}.json');v=ev['normalized_result'];assert v['procedure']['address']=='0x'+address and v['procedure']['body']['total_bytes']==n
  rb=evidence(P/f'read_bytes-{address}.json');fb=evidence(P/f'address_to_file_offset-{address}.json');b=rb['normalized_result'];at=offset(int(address,16),n);assert b['complete']and b['requested_bytes']==b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]and fb['normalized_result']['file_offset']==at
  key='0x'+address;assert key not in functions;new[key]=dict(id=ev['evidence_id'],**v);checks.append(dict(address=key,bytes=n,file_offset=at,evidence_id=ev['evidence_id'],original_match=True));files.extend(P/name for name in[f'function-{address}.json',f'read_bytes-{address}.json',f'address_to_file_offset-{address}.json'])
 assert sum(r['bytes']for r in checks)==2645
 constants=[]
 for name,address,n in [('533a74',0x533a74,320),('casting-constants',0x52d3c8,76),('guard-threshold',0x52d510,4)]:
  ev=evidence(P/f'read_bytes-{name}.json');b=ev['normalized_result'];m=evidence(P/f'address_to_file_offset-{name}.json');at=offset(address,n);assert b['complete']and b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]and m['normalized_result']['file_offset']==at;constants.append(dict(address=hex(address),bytes=n,file_offset=at,evidence_id=ev['evidence_id'],original_match=True));files.extend(P/x for x in[f'read_bytes-{name}.json',f'address_to_file_offset-{name}.json'])
 table=struct.unpack_from('<80I',raw,offset(0x533a74,320));assert list(table)==[0x70d1+g*8+i//2 for g in range(4)for i in range(16)]+[0x70df,0x70e8]*8
 for address,value in[(0x52d3c8,0.1),(0x52d3fc,0.5),(0x52d404,680),(0x52d408,840),(0x52d40c,-200),(0x52d510,50)]:assert struct.unpack_from('<f',raw,offset(address,4))[0]==struct.unpack('<f',struct.pack('<f',value))[0]
 for address,value,fmt in[(0x52d420,180,'<f'),(0x52d3a8,-180,'<f'),(0x52d448,360,'<d')]:assert struct.unpack_from(fmt,raw,offset(address,struct.calcsize(fmt)))[0]==value
 derived=[]
 for name,expected in [('derived-callbacks.json',4),('derived-element-callback.json',1)]:
  d=read(P/name);assert not d['originalExecution']and not d['originalBytePatches']and len(d['entries'])==expected
  for e in d['entries']:
   count=0;assert e['decompileCompleted']and e['status']=='derived-static-export'
   for ins in e['instructions']:
    b=bytes.fromhex(ins['bytesHex']);at=offset(int(ins['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
   assert count==e['derivedBodyBytes'];derived.append(dict(entry='0x'+e['requestedEntry'],bytes=count,canonical=False,all_original_bytes_match=True))
  files.append(P/name)
 assert sum(r['bytes']for r in derived)==7520
 for name in['derived-process-receipt.json','derived-element-process-receipt.json']:
  d=read(P/name);assert d['exit_code']==0 and d['source_sha256_before']==d['source_sha256_after']==old['source']['sha256']and d['original_unchanged']and not d['original_executed']and d['canonical_REA_profile_unchanged'];files.append(P/name)
 ctor=functions['0x41dc00']['procedure']['body'];ctorbytes=b''.join(raw[offset(int(r['start'],16),int(r['end'],16)-int(r['start'],16)+1):offset(int(r['start'],16),int(r['end'],16)-int(r['start'],16)+1)+int(r['end'],16)-int(r['start'],16)+1]for r in ctor['ranges'])
 for address in[0x41bec0,0x41c3e0,0x41ca90,0x41d330]:assert struct.pack('<I',address)in ctorbytes
 assert struct.pack('<I',0x41b1b0)in raw[offset(0x41b1f0,163):offset(0x41b1f0,163)+163]
 # Explicit assembly defeats two misleading decompiler recoveries: turn delta and element arrays.
 assert any('FSUB float ptr [ESI + 0x50]'in s for s in functions['0x419e90']['assembly'])
 for address,value in[(0x421464,0x1af5f),(0x421472,0x1af6b),(0x42147c,0x1af77),(0x421484,0x1af83),(0x42148c,0x1af5e),(0x421494,0x1af6a),(0x42149c,0x1af76),(0x4214a4,0x1af82)]:assert struct.pack('<I',value)in raw[offset(address,8):offset(address,8)+8]
 assert '0x2cc'in functions['0x41b4a0']['pseudocode']and'0x2cc'in functions['0x41dc00']['pseudocode']and'0x2cc'in functions['0x4fd5f0']['pseudocode']
 dispatcher=R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json';entry=next(e for e in read(dispatcher)['entries']if e['requestedEntry']=='004260b0');count=0
 for ins in entry['instructions']:
  b=bytes.fromhex(ins['bytesHex']);at=offset(int(ins['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
 assert count==54685;files.append(dispatcher)
 prior=read(P/'prior-record-check.json');snapshot=read(P/'rea.snapshot.json');assert prior['queried_records']==40 and prior['new_distinct_records']==40 and prior['cumulative_after']==2378 and len(prior['verified_prior_snapshot_files'])==43 and not prior['missing_referenced_snapshots'];assert len(snapshot['evidence_bundle']['records'])==40 and set(e['evidence_id']for e in snapshot['evidence_bundle']['records'])==set(prior['new_ids'])and snapshot['binding']['analysis_profile']['digest']==profile
 closed=unwrap(read(P/'close-result.json'));assert closed['evidence_records']==40 and closed['primitive_entries']==8
 for name in['session-initial.json','session-final.json']:
  v=unwrap(read(P/name));assert not v['open']and not v['cleanup_pending']
 files.extend(P/n for n in['rea.snapshot.json','prior-record-check.json','session-initial.json','session-final.json','close-result.json','queried-evidence-ids.txt'])
 functions.update(new);assert len(functions)==713;complete=P/'functions-complete.json'
 if complete.exists():assert read(complete)==functions
 else:complete.write_text(json.dumps(functions,ensure_ascii=False,separators=(',',':'))+'\n')
 files.append(complete);out=dict(schema='moli.casting-source-stage198.v1',classification='fact: fixed PE instructions/data/pointers; derived: independent seeded callbacks and reconstruction; native runtime/backend/current/official equivalence unverified',source=old['source'],rea='6.7.0',provider='Ghidra12.1.4',profile_digest=profile,canonical_functions_before=705,canonical_functions_after=713,new_canonical_functions=checks,checked_new_function_bytes=2645,current_snapshot_records=40,new_distinct_records=40,retained_records_before=2338,retained_record_union_after=2378,prior_snapshot_files_verified=43,reused_record_ids=[],constants=constants,checked_constant_bytes=400,direct_original_constant_bytes=16,derived_callbacks=derived,reverified_derived_callback_bytes=7520,reverified_command_instruction_bytes=54685,source_contract=info(A/'implementation-spec.json'),artifacts=[info(p)for p in dict.fromkeys(files)],session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,limitations=['Five independently seeded callbacks are static derivations, not canonical procedure-count increments','Self31 drain71 target cursor passes the explicit terminator; original runtime behavior unmeasured, port is unavailable before mutation','Opposite-team friend roster423500 remains unimplemented; gated feedback reports that precise unknown while ordinary numeric callbacks remain owned','Source draw offsets, negative CRT divisor behavior and background-copy-before-queue correct earlier independent baselines; previous bytes retained and source-correction receipt records them','Native DDRAW/D3D/alternate/tint/additive/scaled-backend pixels and whole-application scheduling remain unverified','Separate attached RID, other SKL/handler/gameplay/platform/current/official requirements remain active'],phase_complete=False,full_goal_complete=False,goal_status='active');(A/'source-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(functions=713,record_union=2378,canonical_bytes=2645,callback_bytes=7520,constant_bytes=400,session_closed=True)))
if __name__=='__main__':main()
