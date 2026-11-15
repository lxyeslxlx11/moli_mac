"""Verify ordinary edit dispatch, its source owners and IME presentation.

No target, clipboard, keyboard or account session is executed or observed.
Whole native Evidence, source ranges and semantic review remain distinct.
"""
import hashlib,json,struct
from pathlib import Path
from extract_entry_inventory import PE
ROOT=Path(__file__).resolve().parents[2];PUBLIC=Path(__file__).resolve().parent
PRIVATE=ROOT/'build/analysis/capability-game-text-editing-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='6cc5a0c85799938617f779b57278444a23c21e5faab9d9fbebc5c985852469e2'
def load(p):return json.loads(p.read_text())
def stable(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def digest(b):return hashlib.sha256(b).hexdigest()
def identity(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=h.hexdigest())
def pointer(v,p):
 for k in p.split('/')[1:] if p else []:v=v[int(k)] if isinstance(v,list) else v[k]
 return v
def evidence(v):
 if 'content'in v:v=v.get('structuredContent') or json.loads(next(x['text'] for x in v['content'] if x['type']=='text'))
 return v.get('result',v)
def build():
 manifest=PRIVATE/'source-inputs.json';assert identity(manifest)['sha256']==MANIFEST_SHA
 for r in load(manifest)['files']:assert identity(ROOT/r['path'])==r,r['path']
 pe_path=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';pe=PE(pe_path,SHA)
 cache={};native=[];bodies={}
 for row in load(PRIVATE/'source-body-selection.json'):
  path=ROOT/row['file']
  if str(path) not in cache:cache[str(path)]=load(path)
  r=evidence(pointer(cache[str(path)],row['pointer']))
  assert r['operation']=='analyze_function' and r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
  n=r['normalized_result'];entry=hex(int(n['procedure']['address'],16));body=n['procedure']['body']
  assert entry==row['entry'] and body['available'] and body['contains_entry']
  spans=[]
  for s in body['ranges']:
   a,b=int(s['start'],16),int(s['end'],16);raw=pe.read(a,b-a+1)
   assert pe.executable(a) and pe.executable(b)
   spans.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=digest(raw)))
  assert sum(s['bytes'] for s in spans)==body['total_bytes']
  native.append(dict(entry=entry,role=row['role'],authority='complete-canonical-REA-record',
   evidence_id=r['evidence_id'],original_parameters=r['parameters'],profile_digest=PROFILE,
   source=identity(path),record_pointer=row['pointer'],record_sha256=digest(stable(r).encode()),
   body_metadata=body,ranges=spans,pseudocode_sha256=digest(n['pseudocode'].encode()),
   semantic_scope='本合同指定规则；完整记录/范围不等于所有被调用者和游戏状态均已闭合。'))
  bodies.setdefault(entry,n)
 tokens={
 '0x452350':['DAT_007286ad & 2','DAT_007286ac & 2','FUN_004443a0','FUN_004445a0','FUN_00444310','FUN_00444350','FUN_00444760','FUN_00444860','FUN_00507690','FUN_00444930','FUN_00403200','DAT_007286bf & 4'],
 '0x444310':['DAT_00728488','0x128','FUN_004450a0','*piVar1 - iVar2'],
 '0x444350':['DAT_00728488','DAT_0060ff08 + 300','FUN_00445120','*piVar1 + iVar2'],
 '0x4443a0':['DAT_00728488','0x144','0x148','FUN_004450a0','iVar8 == 3','local_484'],
 '0x4445a0':['DAT_00728488','0x144','0x148','FUN_004450a0','iVar4 == 3','local_480'],
 '0x444760':['0x128','FUN_004450a0','DAT_0060ff08 + 300','local_120','DAT_0060ff10 = 0x14'],
 '0x444860':['0x128','FUN_00445120','DAT_0060ff08 + 300','local_120','DAT_0060ff10 = 0x14'],
 '0x445120':['param_1 & 0x80'],
 '0x444930':['DAT_00728488','DAT_0060ff08 == &DAT_0060fda8','iRam0060fed4 == 0','0x3f','0x121','FUN_00443d60','FUN_004f2c80','FUN_00444b80(0xd)','DAT_00c081b8','FUN_00445220(&DAT_0060fda8)'],
 '0x443d60':['param_1 * 0x121','0x4840','FUN_0051c700(&param_1,4,1','return 0','return 1'],
 '0x4441e0':['DAT_00c1016c','0x13 < DAT_0060ff10','DAT_0060ff10 + 1','0x27 < DAT_0060ff10','DAT_00728588','DAT_00728688'],
 '0x451d60':['FUN_00451d10','GetKeyboardState','ImmGetDescriptionA','DAT_00728488','DAT_00728588','DAT_00728694'],
 '0x4456d0':['10 < DVar1 - _DAT_0060ff30','10 < DVar1 - _DAT_0060ff34','FUN_00445610','FUN_00445670'],
 '0x445610':['DAT_005e4950 + -1','3 < DAT_005e4984','DAT_005e4988 = 0'],
 '0x445670':['DAT_0060fd68 + -1','2 < DAT_0060fd9c','DAT_0060fda0 = 0'],
 '0x403200':['FUN_004ea6b0(2)','FUN_004ea5b0(100)','FUN_004ea460(99)'],
 '0x451a80':['0x278d00','param_1[5]','0x1c20'],
 '0x5015a0':['switch(DAT_00f5f17c)','FUN_00452350','FUN_00451d60','FUN_004441e0'],
 '0x4f2c80':['GetTickCount','< 1000','FUN_004f7680']
 }
 for entry,required in tokens.items():
  for t in required:assert t in bodies[entry]['pseudocode'],(entry,t)
 # The source return type is misrecovered as void; EAX is not overwritten after the API call.
 ime=bodies['0x451d10']
 assert ime['assembly']==['0x451d10: PUSH 0x0','0x451d12: CALL dword ptr [0x0052d274]','0x451d18: PUSH EAX','0x451d19: CALL 0x00518e4e','0x451d1e: RET']
 raw=pe.read(0x451d19,5);assert raw[0]==0xe8 and 0x451d19+5+int.from_bytes(raw[1:],'little',signed=True)==0x518e4e
 assert pe.read(0x451d1e,1)==b'\xc3'
 assert any('ImmIsIME' in c['name'] for c in ime['callees'])
 assert 'DAT_00728488' not in bodies['0x444760']['pseudocode'] and 'DAT_00728488' not in bodies['0x444860']['pseudocode']
 enter=bodies['0x444930']['pseudocode']
 assert enter.index('FUN_00443d60')<enter.index('FUN_004f2c80')<enter.index('DAT_0060ff08[0x4b] = 0')
 assert pe.read(0x507690,1)==b'\xc3'
 inventory=load(PUBLIC/'entry-inventory.json');row=next(r for r in inventory['modern_windows'] if r['id']==99)
 raw=pe.read(int(row['row_address'],16),20)
 assert struct.unpack('<II',raw[:8])==(99,0x402d90) and raw[8]==row['group']==2 and raw[16]==row['initial_dirty']==0
 anchor_rows=[]
 for filename in ['editor-call-anchors.json','editor-frame-call-anchors.json']:
  d=load(PRIVATE/filename)
  for a in d['anchors']:
   raw=bytes.fromhex(a['instruction_hex']);address=int(a['source'],16);target=int(a['target'],16)
   assert len(raw)==5 and raw[0]==0xe8 and pe.read(address,5)==raw
   assert address+5+int.from_bytes(raw[1:],'little',signed=True)==target
   anchor_rows.append(a)
 assert len(anchor_rows)==104
 incoming_counts={}
 for name in ['451d60','4441e0','452350']:
  r=evidence(load(PRIVATE/f'incoming-{name}.json'))
  calls=[x for x in r['normalized_result']['references'] if x['kind']['call']]
  incoming_counts['0x'+name]=len(calls)
  assert {x['source_procedure']['address'] for x in calls}=={'0x437b30','0x5015a0','0x501a50'}
 assert incoming_counts=={'0x451d60':20,'0x4441e0':16,'0x452350':18}
 owner=evidence(load(PRIVATE/'owner-451db0.json'))['normalized_result']
 assert owner['found'] and owner['procedure']['address']=='0x451d60'
 clipboard=evidence(load(PRIVATE/'clipboard-procedures.json'));assert clipboard['normalized_result']==[]
 member=load(PRIVATE/'evidence-membership-audit.json')
 assert member['passed'] and member['previous_records_unchanged']==1746 and member['current_records']==1775
 assert member['new_operations']=={'analyze_function':17,'resolve_containing_procedure':7,'procedure_references':4,'search_procedures':1}
 closed=load(PRIVATE/'rea-final-closed.json');assert closed['open'] is False and closed['cleanup_pending'] is False
 def unique_bytes(rows):return sum({(s['start'],s['end'],s['sha256']):s['bytes'] for r in rows for s in r['ranges']}.values())
 new=[r for r in native if r['role']=='new-native'];old=[r for r in native if r['role']=='reused-native']
 assert len(new)==17 and unique_bytes(new)==4322 and len(old)==11 and unique_bytes(old)==8681
 summary=dict(new_native_records=17,new_native_body_bytes=4322,reused_complete_native_records=11,
  reused_native_unique_entries=len({r['entry'] for r in old}),reused_native_unique_body_bytes=8681,
  new_derived_entries=0,source_anchored_CALLs=104,editing_dispatch_CALL_sites=18,
  IME_presentation_CALL_sites=20,caret_CALL_sites=16,previous_REA_records_unchanged=1746,current_REA_records=1775,
  modern_input_producer_id=99,modern_input_producer_callback='0x402d90',global97_callback_consumption_closed=False)
 result=dict(schema='moli.capability.game-text-editing-source-check.v1',source=identity(pe_path),native_profile=PROFILE,
  tools=dict(REA='6.7.0',Ghidra='12.1.4'),input_manifest=identity(manifest),native_bodies=native,
  source_anchored_calls=anchor_rows,source_role_corrections=[
   dict(entry='0x451d60',role='IME status/composition attributes/candidate presentation,not edit dispatch'),
   dict(entry='0x4441e0',role='caret presentation andcall-count blink,not edit dispatch'),
   dict(entry='0x4456d0',role='two timed rolling notices,not focus reset or edit dispatch'),
   dict(entry='0x451a80',role='game-clock projection,not an editor or keyboard repeat clock')],
  source_IMM_return=dict(entry='0x451d10',callee='IMM32.DLL::ImmIsIME',after_call='RET without overwriting EAX',
   body_bytes=15,scope='Recovered void pseudocode does not erase ABI register result;no host IME call executed.'),
  clipboard_name_search=dict(evidence_id=clipboard['evidence_id'],operation=clipboard['operation'],matches=0,
   search_boundary='Literal Clipboard in provider procedure-name inventory only.',
   proves_absent_capability=False,real_clipboard_access=False),
  extra_PE_proofs=dict(empty_Tab_call=dict(entry='0x507690',bytes_hex='c3'),
   End_alternate_row=dict(row=row,bytes_hex=pe.read(int(row['row_address'],16),20).hex(),
    table_callback_consumption_not_proven=True)),
  semantic_review=dict(method='Root reviewed relevant bodies andguards/order;tokens locate source only.',
   entries=sorted(tokens,key=lambda x:int(x,16)),full_game_state_semantics_closed=False),
  evidence_membership=identity(PRIVATE/'evidence-membership-audit.json'),summary=summary,
  original_execution=False,VM_execution=False,real_clipboard_keyboard_or_account_observed=False,
  independent_runtime_memory_capture=False,runtime_features_changed=False,all_capability_analysis_complete=False)
 (PUBLIC/'game-text-editing-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(summary,ensure_ascii=False))
if __name__=='__main__':build()
