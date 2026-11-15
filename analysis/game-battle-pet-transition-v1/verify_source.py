#!/usr/bin/env python3
"""Verify pet-menu/transition/presentation source facts, pointers and original instruction bytes."""
from pathlib import Path
import hashlib,json,struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-pet-transition-v1'
def read(p):return json.loads(p.read_text())
def unwrap(d):
 if 'result'in d:return d['result']
 if 'structuredContent'in d:return d['structuredContent']['result']
 return json.loads(next(v['text']for v in d['content']if v['type']=='text'))['result']
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def main():
 old=read(R/'analysis/game-battle-mounted-input-v1/source-check.json');source=R/old['source']['path'];assert info(source)==old['source'];raw=source.read_bytes();pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];optional=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
  _,va,count,at=struct.unpack_from('<IIII',raw,pe+24+optional+i*40+8);sections.append((base+va,at,count))
 def offset(va,n):
  for start,at,count in sections:
   if start<=va and va+n<=start+count:return at+va-start
  raise AssertionError('Original file range unavailable')
 retained=R/'build/analysis/game-battle-mounted-input-v1/functions-complete.json';assert info(retained)==next(r for r in old['artifacts']if r['path']==str(retained.relative_to(R)));functions=read(retained);assert len(functions)==691
 new={};checks=[];files=[retained]
 for address,n,name in [('489880',83,'function-489880.json'),('4898e0',219,'function-4898e0.json'),('446740',325,'function-containing-44686d.json'),('446890',20,'function-446890.json')]:
  ev=read(P/name);v=ev['normalized_result'];assert v['procedure']['address']=='0x'+address and v['procedure']['body']['total_bytes']==n
  rb=read(P/f'read_bytes-{address}.json');fb=read(P/f'address_to_file_offset-{address}.json');b=rb['normalized_result'];at=offset(int(address,16),n);assert b['complete']and b['requested_bytes']==b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]and fb['normalized_result']['file_offset']==at
  for e in [ev,rb,fb]:assert e['subject']['digest']['sha256']==old['source']['sha256']
  key='0x'+address;assert key not in functions;new[key]=dict(id=ev['evidence_id'],**v);checks.append(dict(address=key,bytes=n,file_offset=at,evidence_id=ev['evidence_id'],original_match=True));files.extend([P/name,P/f'read_bytes-{address}.json',P/f'address_to_file_offset-{address}.json'])
 assert sum(r['bytes']for r in checks)==647
 duplicates=[]
 for address in ['46c560','46c4e0']:
  ev=read(P/f'function-{address}.json');assert dict(id=ev['evidence_id'],**ev['normalized_result'])==functions['0x'+address];duplicates.append(ev['evidence_id']);files.append(P/f'function-{address}.json')
 constants=[]
 for address,n,name in [('559a68',4,'read_bytes-559a68.json'),('52e388',32,'read_bytes-52e388.json'),('52e388',48,'read_bytes-52e388-48.json'),('54bdd0',256,'read_bytes-54bdd0.json'),('53416c',8,'read_bytes-53416c.json'),('52d3e8',4,'read_bytes-52d3e8.json')]:
  ev=read(P/name);b=ev['normalized_result'];fb=read(P/f'address_to_file_offset-{address}.json');at=offset(int(address,16),n);assert b['complete']and b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]and fb['normalized_result']['file_offset']==at;constants.append(dict(address='0x'+address,bytes=n,file_offset=at,evidence_id=ev['evidence_id'],original_match=True));files.extend([P/name,P/f'address_to_file_offset-{address}.json'])
 assert struct.unpack_from('<I',raw,offset(0x559a68,4))[0]==0x52e388
 assert struct.unpack_from('<I',raw,offset(0x52e388+9*4,4))[0]==0x48e160
 assert struct.unpack_from('<I',raw,offset(0x54bdd0+32+28,4))[0]==0x48e530
 assert all(struct.unpack_from('<I',raw,offset(0x54bdd0+i*32+28,4))[0]==0x48e620 for i in [2,3,4])
 assert raw[offset(0x53416c,8):offset(0x53416c,8)+8]==bytes.fromhex('4d7c255800000000')and raw[offset(0x52d3e8,4):offset(0x52d3e8,4)+4]==bytes.fromhex('0ad7a33c')
 derived=[]
 for name,expected in [('derived-callbacks.json',{'0048e160':49,'0048e530':232,'0048e620':566}),('derived-display-callbacks.json',{'0048e1a0':898})]:
  d=read(P/name);assert not d['originalExecution']and not d['originalBytePatches'];assert {r['requestedEntry']:r['derivedBodyBytes']for r in d['entries']}==expected
  for row in d['entries']:
   total=0
   for instruction in row['instructions']:
    b=bytes.fromhex(instruction['bytesHex']);at=offset(int(instruction['address'],16),len(b));assert raw[at:at+len(b)]==b;total+=len(b)
   assert total==row['derivedBodyBytes'];derived.append(dict(entry='0x'+row['requestedEntry'],bytes=total,canonical=False,all_original_bytes_match=True))
  files.append(P/name)
 assert sum(r['bytes']for r in derived)==1745
 for name in ['derived-process-receipt.json','derived-display-process-receipt.json']:
  d=read(P/name);assert d['exit_code']==0 and d['original_unchanged']and d['source_sha256_before']==d['source_sha256_after']==old['source']['sha256']and not d['original_executed']and d['canonical_REA_profile_unchanged'];files.append(P/name)
 dispatcher=R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json';d=next(v for v in read(dispatcher)['entries']if v['requestedEntry']=='004260b0');count=0
 for instruction in d['instructions']:
  b=bytes.fromhex(instruction['bytesHex']);at=offset(int(instruction['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
 assert count==54685;files.append(dispatcher)
 assert 'DAT_00599d20 = FUN_00437430();'in functions['0x437b30']['pseudocode']and'FUN_00489880();'in functions['0x433b70']['pseudocode']
 assert 'DAT_006122d0 = (uint)(DAT_006122d0 == 0);'in new['0x446740']['pseudocode']and '0x9c'in functions['0x4457b0']['pseudocode']
 assert 'FUN_0040a090(param_1);'in functions['0x40a120']['pseudocode'].split('  case 0x31:',1)[1].split('  case 0x32:',1)[0]
 for name in ['function-48e160.json','function-48e1a0.json']:assert read(P/name)['error']['code']=='invalid_request';files.append(P/name)
 union=read(P/'prior-record-check.json');assert union['queried_records']==31 and set(union['reused_ids'])==set(duplicates)and union['new_distinct_records']==29 and union['cumulative_after']==2293 and len(union['verified_prior_snapshot_files'])==41 and not union['missing_referenced_snapshots'];files.append(P/'prior-record-check.json')
 initial=unwrap(read(P/'session-initial.json'));final=unwrap(read(P/'session-final.json'));assert not initial['open']and not initial['cleanup_pending']and not final['open']and not final['cleanup_pending'];closed=unwrap(read(P/'close-result.json'));assert closed['evidence_records']==31 and closed['primitive_entries']==6
 files.extend(P/n for n in ['session-initial.json','session-final.json','close-result.json','rea.snapshot.json','xrefs-c3b648.json','xrefs-599d20.json','xrefs-489880.json','xrefs-6122d0.json','search_procedures-4898.json','search_procedures-4468-4410.json'])
 functions.update(new);assert len(functions)==695;complete=P/'functions-complete.json'
 if complete.exists():assert read(complete)==functions
 else:complete.write_text(json.dumps(functions,ensure_ascii=False,separators=(',',':'))+'\n')
 files.append(complete);files=list(dict.fromkeys(files))
 out=dict(schema='moli.battle-pet-transition-source-stage196.v1',classification='fact: fixed source REA bytes and pointers; derived: independent seeded callbacks and reconstruction; portable sampling and original runtime/backend equivalence remain distinct',source=old['source'],rea='6.7.0',provider='Ghidra12.1.4',canonical_functions_before=691,canonical_functions_after=695,new_canonical_functions=checks,checked_new_function_bytes=647,requeried_existing_functions=2,reused_record_ids=duplicates,current_snapshot_records=31,new_distinct_records=29,retained_records_before=2264,retained_record_union_after=2293,prior_snapshot_files_verified=41,constants=constants,derived_callbacks=derived,reverified_derived_callback_bytes=1745,reverified_command_instruction_bytes=54685,source_contract=info(A/'implementation-spec.json'),artifacts=[info(p)for p in files],session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,limitations=['Window pointer/call-seeded callbacks are independent static derivations, not newly canonical procedures','31-record snapshot includes2 identical prior dossiers and is not the full2293 record union','DDRAW/D3D delegates pixel sampling; portable nearest rendering policy is not a measured original backend identity','Whole original game/platform/device/current/official objective remains active'],phase_complete=False,full_goal_complete=False,goal_status='active');(A/'source-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(functions=695,record_union=2293,queried=31,reused=2,new_records=29,new_function_bytes=647,callback_bytes=1745,session_closed=True)))
if __name__=='__main__':main()
