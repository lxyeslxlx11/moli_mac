#!/usr/bin/env python3
"""Reconcile retained/static REA records, actual source bytes and seeded child callback."""
from pathlib import Path
import hashlib,json,struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-character-change-v1'
def read(p):return json.loads(p.read_text())
def info(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
 old=read(R/'analysis/game-battle-change-v1/source-check.json');source=R/old['source']['path'];assert info(source)==old['source'];raw=source.read_bytes();pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];optional=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
  _,va,count,at=struct.unpack_from('<IIII',raw,pe+24+optional+i*40+8);sections.append((base+va,at,count))
 def offset(va,n):
  for start,at,count in sections:
   if start<=va and va+n<=start+count:return at+va-start
  raise AssertionError('Original file range absent')
 retained=R/'build/analysis/game-battle-status-v1/functions-complete.json';assert info(retained)==next(v for v in old['artifacts']if v['path']==str(retained.relative_to(R)));functions=read(retained);assert len(functions)==679
 evidence=[];checks=[];new={}
 for address,n in [('419820',27),('4232e0',94),('423220',179),('422ca0',179),('422a60',528),('423070',426)]:
  ev=read(P/f'function-{address}.json');v=ev['normalized_result'];assert v['procedure']['address']=='0x'+address and v['procedure']['body']['total_bytes']==n
  rb=read(P/f'read_bytes-{address}.json');fb=read(P/f'address_to_file_offset-{address}.json');r=rb['normalized_result'];f=fb['normalized_result'];at=offset(int(address,16),n)
  assert r['requested_bytes']==r['returned_bytes']==n and r['complete']and f['file_offset']==at and bytes.fromhex(r['bytes_hex'])==raw[at:at+n]
  for e in [ev,rb,fb]:assert e['subject']['digest']['sha256']==old['source']['sha256'];evidence.append(e['evidence_id'])
  key='0x'+address;assert key not in functions;new[key]=dict(id=ev['evidence_id'],**v);checks.append(dict(address=key,evidence_id=ev['evidence_id'],read_evidence_id=rb['evidence_id'],offset_evidence_id=fb['evidence_id'],file_offset=at,bytes=n,original_sha256=hashlib.sha256(raw[at:at+n]).hexdigest(),original_match=True))
 assert len(evidence)==len(set(evidence))==18 and sum(v['bytes']for v in checks)==1433
 derived=read(P/'derived-callbacks.json');assert not derived['originalExecution']and not derived['originalBytePatches'];callback=derived['entries'][0];assert callback['requestedEntry']=='00422a40'and callback['status']=='derived-static-export';count=0
 for row in callback['instructions']:
  b=bytes.fromhex(row['bytesHex']);at=offset(int(row['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
 assert count==callback['derivedBodyBytes']==32
 # Callback pointers in both complete constructors directly establish the seeded entry.
 assert all('LAB_00422a40'in new['0x'+a]['pseudocode']for a in ['423220','422ca0'])
 dispatcher=R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json';assert info(dispatcher)==next(v for v in old['artifacts']if v['path']==str(dispatcher.relative_to(R)));d=next(v for v in read(dispatcher)['entries']if v['requestedEntry']=='004260b0');total=0
 for row in d['instructions']:
  b=bytes.fromhex(row['bytesHex']);at=offset(int(row['address'],16),len(b));assert raw[at:at+len(b)]==b;total+=len(b)
 assert total==54685
 asm={v['address']:v['text']for v in d['instructions']}
 destinations={'00428dee':'0x170','00428e44':'0x180','00428e98':'0x1b0','00428eec':'0x1c0'};assert all('ADD ECX,'+value==asm[key]for key,value in destinations.items())
 initial=read(P/'session-initial.json')['result'];final=read(P/'session-final.json')['result'];assert not initial['open']and not initial['cleanup_pending']and not final['open']and not final['cleanup_pending']
 closed=read(P/'close-result.json')['result'];assert closed['evidence_records']==18 and closed['primitive_entries']==6
 snapshot=read(P/'rea.snapshot.json');assert snapshot
 functions.update(new);assert len(functions)==685
 complete=P/'functions-complete.json'
 if not complete.exists():complete.write_text(json.dumps(functions,ensure_ascii=False,separators=(',',':'))+'\n')
 else:assert read(complete)==functions
 files=[retained,complete,dispatcher,P/'derived-callbacks.json',P/'derived-process-receipt.json',P/'rea.snapshot.json',P/'session-initial.json',P/'session-final.json',P/'close-result.json',P/'function-422a40.json']+[P/(kind+'-'+a+'.json')for a in ['419820','4232e0','423220','422ca0','422a60','423070']for kind in ['function','read_bytes','address_to_file_offset']]
 out=dict(schema='moli.battle-character-change-source-stage194.v1',classification='fact: immutable retained and new REA dossiers/bytes; seeded callback32B is independent static derivation; reconstructed logical ownership is derived',source=old['source'],rea='6.7.0',provider='Ghidra12.1.4',canonical_functions_before=679,canonical_functions_after=685,new_canonical_functions=checks,retained_records_before=2222,retained_record_union_after=2240,new_primitive_records=18,new_operations=dict(analyze_function=6,read_bytes=6,address_to_file_offset=6),typed_unsupported_function='422a40 is an evidenced callback label with no canonical Ghidra procedure; typed invalid_request retained, source-pointer seeded independent analysis used without canonical profile change',checked_new_bytes=1433,provider_byte_checks=checks,derived_command=dict(entry='0x4260b0',original_instruction_bytes=54685,all_original_bytes_match=True,CBC_vital_destinations=destinations),derived_child_callback=dict(entry='0x422a40',bytes=32,original_bytes_match=True,pointer_sources=['0x422cd1','0x423251']),source_contract=info(A/'implementation-spec.json'),source_evidence=[info(R/'analysis/game-battle-change-v1/source-check.json')],artifacts=[info(p)for p in files],snapshot_saved=True,current_snapshot_records=18,session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,limitations=['The2240 record union includes retained prior snapshots/dossiers; this new18-record snapshot is not the entire union','Static/independent local acceptance is distinct from original runtime, whole-application RNG and device/current/official acceptance','Remaining body/skill/handler/native UI/audio/render/global cadence and platform requirements stay in the full goal'],phase_complete=False,full_goal_complete=False,goal_status='active')
 (A/'source-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(functions=685,record_union=2240,new_functions=6,new_bytes=1433,new_callback_bytes=32,dispatcher_bytes=54685,snapshot_records=18,closed=True)))
if __name__=='__main__':main()
