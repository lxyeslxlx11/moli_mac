"""Verify bounded movement/service invalidation sources without running a product.

Native Evidence, analyst-seeded function views, and decoded callback reachability
have distinct authority. None establishes a live dispatcher or official acceptance.
"""
import hashlib,json,re,struct,sys
from collections import Counter
from pathlib import Path
sys.dont_write_bytecode=True
from extract_entry_inventory import PE
R=Path(__file__).resolve().parents[2];U=Path(__file__).resolve().parent
P=R/'build/analysis/capability-game-service-invalidation-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='a5df6d4b0b04e131917b52d0a4ccb9878eff1c65d4689179b2c83e06063c2c43'
def load(p):return json.loads(p.read_text())
def digest(b):return hashlib.sha256(b).hexdigest()
def canonical(v):return digest(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
def identity(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def ptr(v,p):
 for k in p.split('/')[1:]if p else []:v=v[int(k)]if isinstance(v,list)else v[k]
 return v
def build():
 manifest=P/'source-inputs.json';assert identity(manifest)['sha256']==MANIFEST_SHA
 for row in load(manifest)['files']:assert identity(R/row['path'])==row,row['path']
 pe=PE(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe',SHA)
 selected=load(P/'source-body-selection.json');index=load(P/'service-caller-index.json')
 cache={};bodies=[];calls=[];texts={};records={};totals=Counter()
 def source(row):
  path=R/row['file']['path'];assert identity(path)==row['file']
  if path not in cache:cache[path]=load(path)
  r=ptr(cache[path],row['pointer']);assert canonical(r)==row['record_sha256'];return r
 def call(va,raw,text,entry,pointer,path):
  if len(raw)<5 or raw[0]!=0xe8:return
  raw=raw[:5];target=(va+5+struct.unpack('<i',raw[1:])[0])&0xffffffff
  assert re.search(r'\bCALL\b',text,re.I)and re.search(r'0x0*'+format(target,'x')+r'\b',text,re.I),(hex(va),text)
  assert raw==pe.read(va,5)
  calls.append(dict(source=hex(va),target=hex(target),instruction_hex=raw.hex(),file_offset=pe.file_offset(va,5),
   sha256=digest(raw),owner=entry,source_file=path,source_pointer=pointer))
 for row in selected['entries']:
  r=source(row);entry=row['entry'];kind=row['kind'];native=kind=='native';spans=[];occupied=set()
  if native:
   assert r['operation']=='analyze_function'and r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
   n=r['normalized_result'];assert n['procedure']['address']==entry
   body=n['procedure']['body'];assert body['available']and body['contains_entry'];ranges=body['ranges'];size=body['total_bytes'];text=n['pseudocode']
  else:
   assert hex(int(r['requestedEntry'],16))==entry and r['decompileCompleted']and r['status']=='derived-static-export'
   ranges=r['derivedBody'];size=r['derivedBodyBytes'];text=r['pseudocode']
  for span in ranges:
   a,b=int(span['start'],16),int(span['end'],16);raw=pe.read(a,b-a+1)
   assert pe.executable(a)and pe.executable(b)
   occupied.update(range(a,b+1));spans.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=digest(raw)))
  assert sum(s['bytes']for s in spans)==size and spans==row['ranges']
  instructions=0
  if native:
   points=[]
   for i,s in enumerate(n['assembly']):
    match=re.match(r'^\s*(0x[0-9a-fA-F]+):\s*(.*)$',s);assert match
    va=int(match[1],16);assert va in occupied;points.append((va,i,match[2]))
   assert len({a for a,i,s in points})==len(points)
   for a,i,s in points:
    end=next(int(z['end'],16)+1 for z in spans if int(z['start'],16)<=a<=int(z['end'],16))
    if pe.read(a,min(5,end-a))[0]==0xe8:
     next_boundary=min([z for z,j,t in points if z>a and z<end]+[end]);assert next_boundary-a==5
     call(a,pe.read(a,5),s,entry,row['pointer']+f'/normalized_result/assembly/{i}',row['file']['path'])
   totals['native_listing_boundaries']+=len(points)
  else:
   covered=set()
   for i,ins in enumerate(r['instructions']):
    a=int(ins['address'],16);raw=bytes.fromhex(ins['bytesHex']);assert raw==pe.read(a,len(raw))and raw
    positions=set(range(a,a+len(raw)));assert not covered&positions;covered|=positions
    call(a,raw,ins['text'],entry,row['pointer']+f'/instructions/{i}',row['file']['path'])
   assert covered==occupied
   instructions=len(r['instructions']);totals['derived_instructions']+=instructions
  totals['body_bytes']+=size;totals['native_bodies'if native else'reused_derived_bodies'if row['role'].startswith('reused')else'new_derived_bodies']+=1
  bodies.append(dict(entry=entry,kind=kind,role=row['role'],source=row['file'],record_pointer=row['pointer'],record_sha256=row['record_sha256'],
   evidence_id=row['evidence_id'],native_profile=row['native_profile'],ranges=spans,body_bytes=size,pseudocode_sha256=digest(text.encode()),
   derived_instructions_byte_verified=instructions,native_non_CALL_opcodes_individually_redecoded=False))
  texts[entry]=text;records[entry]=r
 # Full retained Evidence fields/IDs were authenticated once, without claiming a
 # factory validation/import of either large original snapshot or combined bundle.
 auth=load(P/'authenticate-reused-records.json');assert auth['passed']and auth['records_checked']==totals['native_bodies']and not auth['failures']
 assert not auth['original_snapshot_or_bundle_factory_validated']and not auth['original_snapshot_imported']
 # These are source anchors for manually reviewed rules, not automated semantic proof.
 tokens={
  '0x4b98c0':['DAT_00c22564 = param_1','DAT_00c2256c = param_2'],
  '0x4b98e0':['(DAT_00c22564 << 6)','(DAT_00c2256c << 6)','(param_1 << 6)','(param_2 << 6)','return 0','return 1'],
  '0x476170':['FUN_004b98e0(1,1)','*DAT_00c10558 | 0x8000','DAT_00c439fc','DAT_00c3ab34 <= DVar3','FUN_004f7c70'],
  '0x479f80':['FUN_004b98e0(1,1)','DAT_00c21908','DAT_00c1e808 <','FUN_00479880','FUN_004f7c70'],
  '0x479880':['DAT_00c21908','FUN_004706e0','DAT_00c3ac14 = 0xffffffff'],
  '0x4892d0':['DAT_00c3b930 = 0','_DAT_00c3b940 = 0'],
  '0x4a8df0':['DAT_0055e4d4 = 0xffffffff','0x8000','FUN_00510000(0x39'],
  '0x492770':['FUN_004b98e0(2,2)','(*DAT_00c10194)(0xffffffff)'],
  '0x4b1a70':['FUN_004b98e0(2,2)','DAT_0055e4d4 != -2','DAT_00c1fab4 != DAT_0055e4d4'],
  '0x48f4f0':['DAT_00c1e862 & 4','DAT_00c1e861','FUN_004b98e0'],
  '0x48fce0':['DAT_0055e4d4 = param_1','DAT_00c203e0 = param_3','DAT_00c440cc = param_4','FUN_004b98c0'],
 }
 for entry,ts in tokens.items():
  for token in ts:assert token in texts[entry],(entry,token)
 constants=[]
 for a,n in [(0x52d928,64.0),(0x52d400,0.0)]:
  raw=pe.read(a,4);assert struct.unpack('<f',raw)[0]==n
  constants.append(dict(address=hex(a),format='float32',value=n,hex=raw.hex(),file_offset=pe.file_offset(a,4),sha256=digest(raw)))
 # Historical incoming refs are only one source. Validate all 64 actual E8 sites.
 for site in index['actual_CALL_sites']:
  a=int(site['source'],16);raw=bytes.fromhex(site['instruction_hex']);assert raw==pe.read(a,5)and raw[0]==0xe8
  assert (a+5+struct.unpack('<i',raw[1:])[0])&0xffffffff==int(site['target'],16)
 # Positive decoded callback flow supplements, and does not replace, old bounds.
 flow=load(P/'callback68-flow.json');assert not flow['gaps']and not flow['functionMetadataChanged']and not flow['originalExecution']and not flow['originalBytePatches']
 assert flow['entry']=='004c4880'and flow['lower']=='004c4880'and flow['exclusiveUpper']=='004c5ba0'
 points={int(i['address'],16):i for i in flow['instructions']};seen=set();todo=[int(flow['entry'],16)];covered=set();flowcalls=[]
 for j,ins in enumerate(flow['instructions']):
  a=int(ins['address'],16);raw=bytes.fromhex(ins['bytesHex']);assert raw==pe.read(a,len(raw))and pe.executable(a)
  span=set(range(a,a+len(raw)));assert not covered&span;covered|=span
  assert 0x4c4880<=a<a+len(raw)<=0x4c5ba0
  for successor in ins['successors']:assert int(successor,16)in points
  if ins['isJump']:
   direct=None
   if raw[0]in (0xe9,):direct=a+len(raw)+struct.unpack('<i',raw[-4:])[0]
   elif raw[0]in [0xeb]+list(range(0x70,0x80))+list(range(0xe0,0xe4)):direct=a+len(raw)+struct.unpack('<b',raw[-1:])[0]
   elif raw[:1]==b'\x0f'and len(raw)>=6 and 0x80<=raw[1]<=0x8f:direct=a+len(raw)+struct.unpack('<i',raw[-4:])[0]
   assert direct is not None and [hex(int(t,16))for t in ins['directTargets']]==[hex(direct)]
  before=len(calls);call(a,raw,ins['text'],'0x4c4880',f'/instructions/{j}',str((P/'callback68-flow.json').relative_to(R)))
  if len(calls)>before:flowcalls.append(calls[-1])
 while todo:
  a=todo.pop()
  if a in seen:continue
  seen.add(a);todo.extend(int(t,16)for t in points[a]['successors'])
 assert seen==set(points)
 assert points[0x4c5077]['bytesHex']=='e86448ffff'and points[0x4c5077]['directTargets']==['004b98e0']
 assert points[0x4c5089]['directTargets']==['004ea5b0']and points[0x4c509a]['successors']==['004c509f']
 old=load(R/'build/analysis/capability-entry-inventory-v1/derived-entry-functions.json')
 old68=next(r for r in old['entries']if r['requestedEntry']=='004c4880')
 assert old68['derivedBodyBytes']==721 and len(old68['instructions'])==120
 assert not any(int(s['start'],16)<=0x4c5077<=int(s['end'],16)for s in old68['derivedBody'])
 # Rebind every selected table relation against original PE, including ID68.
 inv=load(U/'entry-inventory.json');tables=[];pairs=set()
 for r in index['selected_graph_callers']:
  for t in r['table_owners']:
   key=(t['family'],t['window_id'],r['entry']);
   if key in pairs:continue
   pairs.add(key)
   if t['family']=='classic':
    w=next(w for w in inv['classic_windows']if w['id']==t['window_id']);a=int(w['descriptor_address'],16)
    assert digest(pe.read(a,48))==w['descriptor_sha256']and struct.unpack('<I',pe.read(int(w['pointer_address'],16),4))[0]==a
    if t['callback_role']=='control':
     control=w['controls'][t['control_ordinal']];assert control['callback']==r['entry']
     assert digest(pe.read(int(control['address'],16),32))==control['sha256']
    else:assert w['callbacks'][t['callback_role']]==r['entry']
    tables.append(dict(family='classic',window_id=w['id'],entry=r['entry'],callback_role=t['callback_role'],descriptor_address=hex(a),descriptor_sha256=w['descriptor_sha256']))
   else:
    w=next(w for w in inv['modern_windows']if w['id']==t['window_id']);a=int(w['row_address'],16);raw=pe.read(a,20)
    assert struct.unpack('<II',raw[:8])==(w['id'],int(r['entry'],16))
    tables.append(dict(family='modern',window_id=w['id'],entry=r['entry'],row_address=hex(a),row_sha256=digest(raw)))
 w=next(w for w in inv['modern_windows']if w['id']==68);a=int(w['row_address'],16);raw=pe.read(a,20)
 assert a==0x55a1d8 and struct.unpack('<II',raw[:8])==(68,0x4c4880)
 tables.append(dict(family='modern',window_id=68,entry='0x4c4880',row_address=hex(a),row_sha256=digest(raw),authority='anchored-decoded-flow-supplement'))
 # Pin the literal independent implementation difference; no product behavior runs.
 craft=(R/'shared/legacy-game-craft.mjs').read_text();start=craft.index('    tick(tick){');tail=craft[start:]
 assert tail.index('if(origin!==null)')<tail.index('if(gathering())')<tail.index("}else if(phase==='working')")
 assert 'retire();return Object.freeze({requests:Object.freeze(requests)});'in tail.split('if(gathering())')[0]
 dialog=(R/'shared/legacy-game-map-dialog.mjs').read_text()
 assert 'clear();\n    if (nextTraining) petTrainingProgress = { ...nextTraining, actorId: dialog.actorId, mode: dialog.mode };'in dialog
 summary=dict(complete_reused_native_records=totals['native_bodies'],reused_derived_bodies=totals['reused_derived_bodies'],new_derived_close_helpers=totals['new_derived_bodies'],
  complete_selected_bodies=len(bodies),selected_body_bytes=totals['body_bytes'],native_listing_boundaries=totals['native_listing_boundaries'],
  derived_instructions_byte_verified=totals['derived_instructions'],supplemental_flow_instructions=len(points),supplemental_flow_instruction_bytes=len(covered),
  supplemental_flow_gaps=len(flow['gaps']),all_direct_E8_CALL_occurrences_verified=len(calls),unique_direct_E8_CALL_sites_verified=len({c['source']for c in calls}),
  helper_actual_unique_CALL_sites=len(index['actual_CALL_sites']),helper_incoming_references=len(index['incoming_CALL_references']),
  helper_CALL_sites_missing_old_incoming=len(index['graph_only_actual_CALL_sites']),selected_table_relations=len(tables),new_REA_records=0,
  native_profile=PROFILE,runtime_features_changed=False,all_capability_analysis_complete=False)
 return dict(schema='moli.capability.game-service-invalidation-source-check.v1',source=identity(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'),
  native_profile=PROFILE,manifest=identity(manifest),selection=identity(P/'source-body-selection.json'),source_bodies=bodies,
  complete_old_record_factory_authentication=identity(P/'authenticate-reused-records.json'),constants=constants,table_bindings=tables,
  helper_caller_inventory=dict(file=identity(P/'service-caller-index.json'),summary=index['summary'],limitations=index['limitations'],
   filename_only_missing_entries=index['missing_native_caller_entries'],resolved_filename_lookup_gap='0x48fce0 is retained in the previous native package, not a function-*.json file.',
   additional_historical_getter_owner='0x4c5077 is reached from table68/0x4c4880 by the supplemental flow; it is not a newly discovered CALL site.'),
  supplemental_flow=dict(file=identity(P/'callback68-flow.json'),entry='0x4c4880',native_profile=None,table68_pointer_verified=True,old_declared_body_bytes=721,
   old_retained_instructions=120,old_range_excludes_getter_CALL=True,all_positive_instruction_successors_walked=True,call_targets_entered=False,
   instruction_budget=4096,gaps=flow['gaps'],private_listing_overrides=flow['privateListingOverrides'],canonical_function_metadata_changed=False,
   claim='Decoded positive static flow in a private copy; not a replacement canonical function body or runtime activation proof.'),
  direct_E8_CALLs=calls,semantic_anchor_tokens=tokens,independent_source_files=[identity(R/name)for name in
   ['shared/legacy-game-craft.mjs','shared/legacy-game-map-dialog.mjs','shared/legacy-game-map-npc-services.mjs','shared/legacy-game-map-pet-training.mjs']],
  limits=['Native complete address-set ranges and retained Listing boundaries are checked; native non-CALL opcode text is not independently re-decoded.',
   'Complete source extents, selected branch semantics, activation and whole-game acceptance remain separate.',
   'No numerical-protection, authentication, RNG/check-internal implementation is analyzed.',
   'A 647-root scan and historical incoming references do not establish whole-program completeness.'],
  summary=summary,passed=True,original_execution=False,VM_operations=False,account_or_official_session_observed=False,runtime_features_changed=False,
  all_capability_analysis_complete=False,implementation_gate_passed=False,full_goal_complete=False)
if __name__=='__main__':
 result=build();(U/'game-service-invalidation-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(result['summary'],ensure_ascii=False))
