"""Verify the fixed-source keyboard, byte text and explicit focus chains.

This is an offline evidence verifier, not a runtime or official acceptance test.
Canonical REA records and independently seeded bodies retain separate authority.
"""
import hashlib
import json
from pathlib import Path
from extract_entry_inventory import PE

ROOT=Path(__file__).resolve().parents[2]
PUBLIC=Path(__file__).resolve().parent
PRIVATE=ROOT/'build/analysis/capability-game-input-lifecycle-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='7cea09fcf09840fc43ad3f3f6796ade27a685b11b3d7c6d25a9b44fc9aea8e99'
def load(p):return json.loads(p.read_text())
def stable(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def digest(b):return hashlib.sha256(b).hexdigest()
def identity(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=h.hexdigest())
def pointer(v,p):
 for k in p.split('/')[1:] if p else []:
  k=k.replace('~1','/').replace('~0','~')
  v=v[int(k)] if isinstance(v,list) else v[k]
 return v
def evidence(v):
 if 'content' in v:v=v.get('structuredContent') or json.loads(next(c['text'] for c in v['content'] if c['type']=='text'))
 return v.get('result',v)
def build():
 manifest_path=PRIVATE/'source-inputs.json'
 assert identity(manifest_path)['sha256']==MANIFEST_SHA
 manifest=load(manifest_path)
 for r in manifest['files']:assert identity(ROOT/r['path'])==r,r['path']
 pe_path=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
 pe=PE(pe_path,SHA)
 selection=load(PRIVATE/'source-body-selection.json')
 native=[];derived=[];bodies={};record_by_id={}
 def ranges(spans):
  out=[]
  for s in spans:
   a,b=int(s['start'],16),int(s['end'],16);raw=pe.read(a,b-a+1)
   assert pe.executable(a) and pe.executable(b)
   out.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=digest(raw)))
  return out
 cache={}
 for row in selection['native']:
  path=ROOT/row['file']
  if str(path) not in cache:cache[str(path)]=load(path)
  r=evidence(pointer(cache[str(path)],row['pointer']))
  assert r['operation']=='analyze_function'
  assert r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
  n=r['normalized_result'];entry=hex(int(n['procedure']['address'],16))
  assert entry==row['entry'] and n['procedure']['body']['available'] and n['procedure']['body']['contains_entry']
  rr=ranges(n['procedure']['body']['ranges'])
  assert sum(s['bytes'] for s in rr)==n['procedure']['body']['total_bytes']
  native.append(dict(entry=entry,role=row['role'],authority='complete-canonical-REA-record',
   evidence_id=r['evidence_id'],original_parameters=r['parameters'],source=identity(path),record_pointer=row['pointer'],
   record_sha256=digest(stable(r).encode()),profile_digest=PROFILE,ranges=rr,
   pseudocode_sha256=digest(n['pseudocode'].encode()),semantic_scope=row['semantic_scope']))
  bodies.setdefault(entry,n);record_by_id[r['evidence_id']]=r
 for row in selection['derived']:
  path=ROOT/row['file']
  if str(path) not in cache:cache[str(path)]=load(path)
  r=pointer(cache[str(path)],row['pointer']);entry=hex(int(r['requestedEntry'],16))
  assert entry==row['entry'] and r['status']=='derived-static-export' and r['decompileCompleted']
  rr=ranges(r['derivedBody']);total=0
  for ins in r['instructions']:
   raw=bytes.fromhex(ins['bytesHex']);assert pe.read(int(ins['address'],16),len(raw))==raw;total+=len(raw)
  assert total==sum(s['bytes'] for s in rr)==r['derivedBodyBytes']
  derived.append(dict(entry=entry,role=row['role'],authority='analyst-seeded-derived-static-not-canonical-REA',
   native_evidence_id=None,source=identity(path),record_pointer=row['pointer'],record_sha256=digest(stable(r).encode()),
   native_profile_digest=None,ranges=rr,instructions=len(r['instructions']),
   pseudocode_sha256=digest(r['pseudocode'].encode()),semantic_scope=row['semantic_scope']))
  bodies.setdefault(entry,r)
 # These anchors locate reviewed rules; token matches alone do not prove semantics.
 expected={
 '0x4523e0':['0xea','0x100'],
 '0x452400':['0xe8','0x100'],
 '0x452430':['DAT_0072869c','0x10'],
 '0x452440':['DAT_007286ad & 2','0x10','return 1'],
 '0x452420':['DAT_0072869c','& 4'],
 '0x445220':['DAT_0060ff08 = param_1'],
 '0x445230':['0x70','DAT_007286ac & 2','DAT_007286ad & 2','0x15c','FUN_00443f20'],
 '0x45dd80':['param_2 == 0x100','DAT_0053cb88 == 2','bVar2 | 0xe','bVar2 & 8',
              'case 0x101:','& 0xf5 | 1','case 6:','FUN_00452400','case 0x102:',
              'GetAsyncKeyState(0x12)','FUN_00444b80','case 0x10e:','DAT_00728488 = 0','FUN_00452200'],
 '0x452200':['param_1 & 0x800','param_1 & 8','param_1 & 0x10','param_1 & 0x80',
             'ImmGetCompositionStringA','DAT_00728488','DAT_00728588','DAT_00728688','0xff','FUN_00444b80'],
 '0x443f20':['DAT_0060ff08 != 0','0x11f','FUN_00444b80'],
 '0x443ab0':['FUN_00445220','FUN_00443f20','DAT_0060ff08'],
 '0x445530':['DAT_0060ff08','DAT_005e4820','DAT_0060fc38','0x11f','FUN_00443f20'],
 '0x444b80':['DAT_0060ff08','0x128','DAT_0060ff08 + 300','0x11f','FUN_004450a0','FUN_00445060','DAT_0060ff2c','DAT_0060ff10 = 0x14'],
 '0x445060':['bVar2 & 0x80','return 3','param_1 + 2'],
 '0x4450a0':['& 0x80','return 3','pbVar1 + 2'],
 '0x49a130':['DAT_00c5dce4 == 0','DAT_00c10d38 != 0','DAT_00c5dce4 == 1',
             'DAT_00c11470 != 0','FUN_00445220(&DAT_0060fda8)','return 0'],
 '0x443f70':['DAT_0060ff08 != &DAT_0060fda8','0x3f','0x121','FUN_00443f20'],
 '0x44fb60':['FUN_0045dd10','FUN_005015a0','FUN_004523e0'],
 '0x469670':['DAT_0060ff08 == &DAT_0060fda8','FUN_00499ba0'],
 '0x4994b0':['DAT_00c1016c == 0','FUN_00445220(&DAT_0060fda8)','DAT_00c4be9c'],
 '0x49b890':['DAT_0060ff08 == &DAT_00c15718','FUN_0049a130','FUN_00445220'],
 '0x4a2c80':['DAT_0060ff08 == &DAT_00c203e8','FUN_0049a130','FUN_00445220'],
 '0x4884d0':['0x5e277f < DAT_0060ff08','DAT_0060ff08 < 0x5e46c5','FUN_0049a130'],
 '0x45c420':['FUN_00452430(9)','FUN_00452430(0xd)','FUN_00445220((&PTR_DAT_0053962c)'],
 }
 for entry,tokens in expected.items():
  text=bodies[entry]['pseudocode']
  for token in tokens:assert token in text,(entry,token)
 # Bind the exact registered callback; do not equate the message pump with it.
 store=evidence(load(PRIVATE/'window-proc-registration-store.json'));n=store['normalized_result']
 assert n['address']=='0x45cdb5' and n['bytes']=='c705f44f920080dd4500'
 assert pe.read(0x45cdb5,10)==bytes.fromhex(n['bytes'])
 assert any(r['target_address']=='0x45dd80' and r['type']=='DATA' for r in n['references'])
 assert any(r['target_address']=='0x924ff4' and r['write'] is True for r in n['references'])
 assert pe.read(0x45ce3b,6)==bytes.fromhex('ff1560d25200')
 owner=evidence(load(PRIVATE/'window-proc-owner.json'))['normalized_result']
 assert not owner['found'] and owner['reason']=='not_in_procedure'
 entry=evidence(load(PRIVATE/'window-proc-native-entry.json'))['normalized_result']
 assert entry['status']=='decoded' and entry['procedure'] is None and entry['bytes']=='83ec10'
 reg=next(r for r in record_by_id.values() if int(r['normalized_result']['procedure']['address'],16)==0x45cc90)
 for filename,expected_exhausted in [('reused-window-registration-pseudocode.json',False),('reused-window-registration-pseudocode-full.json',True)]:
  view=evidence(load(PRIVATE/filename))['normalized_result']
  assert view['parent_evidence_id']==reg['evidence_id'] and view['parent_operation']=='analyze_function'
  assert view['item']['text']==reg['normalized_result']['pseudocode'][:view['coverage']['examined']]
  assert view['coverage']['exhausted'] is expected_exhausted
 pump=bodies['0x45dd10']
 assert {c['name'].split('::')[-1] for c in pump['callees']}=={'PeekMessageA','TranslateMessage','DispatchMessageA'}
 assert all(int(s['end'],16)<0x45dd80 for s in pump['procedure']['body']['ranges'])
 focus=evidence(load(PRIVATE/'native-data-60ff08.json'))
 refs=focus['normalized_result']['incoming_references']
 assert focus['normalized_result']['status']=='data' and len(refs)==106
 writes=[r for r in refs if r['write'] is True]
 assert {r['source_address'] for r in writes}=={'0x445224','0x4455b2','0x4455db'}
 index=load(PRIVATE/'selected-input-symbol-occurrences.json')
 small=load(PRIVATE/'focus-selected-lines.json')
 assert small['summary']['selected_roots']==13 and small['summary']['445220_direct_CALL_sites']==5
 assert len(small['roots'])==13
 assert len([r for r in derived if r['role']=='reused-selected-focus'])==13
 anchors=load(PRIVATE/'input-lifecycle-call-anchors.json')
 anchor_rows=anchors['anchors']
 for a in anchor_rows:
  raw=bytes.fromhex(a['instruction_hex']);address=int(a['source'],16);target=int(a['target'],16)
  assert raw[0]==0xe8 and len(raw)==5 and pe.read(address,5)==raw
  assert address+5+int.from_bytes(raw[1:],'little',signed=True)==target
 assert {int(a['target'],16) for a in anchor_rows}>={0x45dd10,0x4523e0,0x452400,0x444b80,0x452200,0x445220,0x49a130,0x443f20,0x452430}
 member=load(PRIVATE/'evidence-membership-audit.json')
 assert member['passed'] and member['previous_records_unchanged']==1726 and member['current_records']==1746
 assert member['new_operations']['analyze_function']==10
 closed=load(PRIVATE/'rea-final-closed.json')
 assert closed['open'] is False and closed['cleanup_pending'] is False
 assert closed['server_identity']['server']['version']=='6.7.0'
 success=load(PRIVATE/'derived-window-proc-jdk-receipt.json')
 assert success['exit_code']==0 and success['source_sha256_before']==success['source_sha256_after']==SHA
 assert success['independent_analysis_copy'] and not success['original_execution'] and not success['original_byte_patches']
 assert not success['canonical_REA_metadata_changed']
 new_native=[r for r in native if r['role']=='new-native']
 reused_native=[r for r in native if r['role']=='reused-native']
 def unique_bytes(rows):
  spans={(s['start'],s['end'],s['sha256']):s['bytes'] for r in rows for s in r['ranges']}
  return sum(spans.values())
 new_derived=[r for r in derived if r['role']=='new-derived']
 old_derived=[r for r in derived if r['role']!='new-derived']
 assert len(new_native)==10 and unique_bytes(new_native)==2153
 assert len(reused_native)==13 and unique_bytes(reused_native)==11849
 assert len(new_derived)==1 and new_derived[0]['instructions']==891 and unique_bytes(new_derived)==2877
 assert len(old_derived)==16 and unique_bytes(old_derived)==8856
 summary=dict(new_native_records=10,new_native_body_bytes=2153,reused_native_records=13,
  reused_native_unique_entries=len({r['entry'] for r in reused_native}),reused_native_unique_body_bytes=11849,
  new_derived_entries=1,new_derived_instructions=891,new_derived_bytes=2877,
  reused_derived_entries=16,reused_derived_instructions=sum(r['instructions'] for r in old_derived),
  reused_derived_bytes=8856,source_anchored_CALLs=len(anchor_rows),literal_focus_reference_edges=len(refs),
  literal_focus_write_sites=3,selected_roots_searched=647,selected_literal_focus_roots=13,
  previous_REA_records_unchanged=1726,current_REA_records=1746)
 result=dict(schema='moli.capability.game-input-lifecycle-source-check.v1',source=identity(pe_path),
  native_profile=PROFILE,tools=dict(REA='6.7.0',Ghidra='12.1.4'),input_manifest=identity(manifest_path),
  native_bodies=native,derived_bodies=derived,source_anchored_calls=anchor_rows,
  window_callback_registration=dict(store_evidence_id=store['evidence_id'],address='0x45cdb5',
   instruction_hex=n['bytes'],callback='0x45dd80',registration_parent=reg['evidence_id'],
   indirect_API_call_address='0x45ce3b',indirect_API_call_bytes='ff1560d25200',
   API_reference_evidence_id=evidence(load(PRIVATE/'incoming-register-class.json'))['evidence_id'],
   default_native_owner_absent=True,derived_body_not_canonical_REA=True),
  focus_literal_references=dict(evidence_id=focus['evidence_id'],edges=106,write_sites=writes,
   scope='Provider-reported references to this exact symbol;register aliases/other modules are not exhaustively covered.',
   no_zero_write_proof=False,all_aliases_closed=False),
  selected_focus_index=dict(source=identity(PRIVATE/'selected-input-symbol-occurrences.json'),
   roots=13,literal_pseudocode_lines=19,literal_instruction_lines=19,
   source_body_bytes=8578,source_body_instructions=2482,all_program_lifecycle_closed=False),
  semantic_review=dict(method='Reviewed complete relevant source and branch/order/byte anchors;token tests locate it only.',
   entries=sorted(expected,key=lambda v:int(v,16)),rule_contract='analysis/capability-first-v1/game-input-lifecycle-contract.json'),
  evidence_membership=identity(PRIVATE/'evidence-membership-audit.json'),summary=summary,
  original_execution=False,VM_execution=False,real_keyboard_or_account_observed=False,
  runtime_features_changed=False,independent_runtime_memory_capture=False,all_capability_analysis_complete=False)
 (PUBLIC/'game-input-lifecycle-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(summary,ensure_ascii=False))
if __name__=='__main__':build()
