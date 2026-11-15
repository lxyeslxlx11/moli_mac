"""Verify grouped G13 source rules and source identities; no game or product run.

Declared function ranges, selected semantics, global scheduling, independent input
policy and official acceptance retain separate evidence and completion states.
"""
import hashlib,json,re,struct,sys
from collections import Counter
from pathlib import Path
sys.dont_write_bytecode=True
from extract_entry_inventory import PE
R=Path(__file__).resolve().parents[2];U=Path(__file__).resolve().parent;P=R/'build/analysis/capability-game-trade-storage-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='d942fb35da84ccb2770de3f274a181eee6f7034aea76a443e206bf9e6d128f93'
def load(p):return json.loads(p.read_text())
def digest(raw):return hashlib.sha256(raw).hexdigest()
def canonical(v):return digest(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
def ident(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def pointer(v,p):
 for k in p.split('/')[1:]if p else []:v=v[int(k)]if isinstance(v,list)else v[k]
 return v
def build():
 manifest=P/'source-inputs.json';assert ident(manifest)['sha256']==MANIFEST_SHA
 for row in load(manifest)['files']:assert ident(R/row['path'])==row,row['path']
 pe=PE(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe',SHA)
 selection=load(P/'source-body-selection.json');cache={};bodies=[];calls=[];texts={};records={};totals=Counter()
 def read(path):
  path=R/path if isinstance(path,str)else path
  if path not in cache:cache[path]=load(path)
  return cache[path]
 def call(a,raw,text,entry,path,ptr):
  if len(raw)<5 or raw[0]!=0xe8:return
  target=(a+5+struct.unpack('<i',raw[1:5])[0])&0xffffffff
  assert re.search(r'\bCALL\b',text,re.I)and re.search(r'0x0*'+format(target,'x')+r'\b',text,re.I),(entry,hex(a),text)
  calls.append(dict(source=hex(a),target=hex(target),instruction_hex=raw[:5].hex(),owner=entry,file=path,pointer=ptr,file_offset=pe.file_offset(a,5)))
 for row in selection['entries']:
  assert ident(R/row['file']['path'])==row['file'];r=pointer(read(row['file']['path']),row['pointer']);assert canonical(r)==row['record_sha256']
  entry=row['entry'];native=row['kind']=='native';occupied=set();proof=[]
  if native:
   assert r['operation']=='analyze_function'and r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
   n=r['normalized_result'];body=n['procedure']['body'];assert n['procedure']['address']==entry and body['available']and body['contains_entry']
   ranges=body['ranges'];size=body['total_bytes'];text=n['pseudocode']
  else:
   assert hex(int(r['requestedEntry'],16))==entry and r['decompileCompleted']and r['status']=='derived-static-export'
   ranges=r['derivedBody'];size=r['derivedBodyBytes'];text=r['pseudocode']
  for q in ranges:
   a,b=int(q['start'],16),int(q['end'],16);raw=pe.read(a,b-a+1);assert pe.executable(a)and pe.executable(b)
   occupied.update(range(a,b+1));proof.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=digest(raw)))
  assert sum(q['bytes']for q in proof)==size
  if native:
   points=[]
   for i,line in enumerate(n['assembly']):
    m=re.match(r'\s*(0x[0-9a-fA-F]+):\s*(.*)',line);assert m
    a=int(m[1],16);assert a in occupied;points.append((a,i,m[2]))
   for a,i,line in points:
    end=next(int(q['end'],16)+1 for q in proof if int(q['start'],16)<=a<=int(q['end'],16));raw=pe.read(a,min(5,end-a))
    if raw[:1]==b'\xe8':assert min([b for b,j,t in points if a<b<end]+[end])-a==5
    call(a,raw,line,entry,row['file']['path'],row['pointer']+f'/normalized_result/assembly/{i}')
   count=0;totals['native_listing_boundaries']+=len(points);totals['native_body_bytes']+=size
  else:
   covered=set()
   for i,ins in enumerate(r['instructions']):
    a=int(ins['address'],16);raw=bytes.fromhex(ins['bytesHex']);assert raw and raw==pe.read(a,len(raw))
    span=set(range(a,a+len(raw)));assert not covered&span;covered|=span
    call(a,raw,ins['text'],entry,row['file']['path'],row['pointer']+f'/instructions/{i}')
   assert covered==occupied;count=len(r['instructions'])
   label='new'if row['role']=='new-call-or-pointer-anchored-view'else'reused'
   totals[label+'_derived_instructions']+=count;totals[label+'_derived_body_bytes']+=size;totals[label+'_derived_views']+=1
  totals['native_views'if native else'derived_views']+=1;totals['body_bytes']+=size
  bodies.append(dict(entry=entry,kind=row['kind'],role=row['role'],source=row['file'],pointer=row['pointer'],record_sha256=row['record_sha256'],
   evidence_id=row['evidence_id'],native_profile=row['native_profile'],ranges=proof,declared_body_bytes=size,pseudocode_sha256=digest(text.encode()),
   derived_instructions_byte_verified=count,semantic_scope='Selected source clauses, not every subroutine effect or runtime path.'))
  texts[entry]=text;records[entry]=r
 auth=read(P/'authenticate-reused-records.json');assert auth['passed']and not auth['failures']and auth['complete_records_factory_validated']==52
 assert not auth['original_snapshot_or_bundle_factory_validated']and not auth['original_snapshot_imported']
 # Exact helper IDs/ranges in the two original source-checks retain their
 # different observations; the new selection does not rewrite old records.
 old=read(P/'reused-trade-storage-native.json');assert len(old['records'])==49 and not old['missing']and not old['conflicts']
 old_ids={r['evidence_id']:r for r in old['records']};bound=0
 for requested in old['requested_helpers']:
  for binding in requested['bindings']:
   doc=read(binding['source_check']['path']);q=pointer(doc,binding['pointer']);entry=binding['entry']
   assert q==binding['original_item']and q['evidence_id']==requested['evidence_id']
   r=old_ids[q['evidence_id']];body=r['normalized_result']['procedure']['body'];assert r['normalized_result']['procedure']['address']==entry
   expected=[(int(z['start'],16),int(z['end'],16),z['sha256'])for z in q['ranges']]
   assert expected==[(int(z['start'],16),int(z['end'],16),digest(pe.read(int(z['start'],16),int(z['end'],16)-int(z['start'],16)+1)))for z in body['ranges']]
   bound+=1
 assert bound==47

 # These tokens locate reviewed clauses; the root's source review supplies semantics.
 tokens={
  '0x467290':['DAT_00f5f170 != 1','FUN_0043f100','DAT_00614884 + 500'],
  '0x4cb680':['LAB_004cb660','FUN_00491200'],
  '0x4cb660':['FUN_004f7d70','FUN_004cbe20'],
  '0x491960':['DAT_00c21940','(*DAT_00c1f6a4)','0x8000'],
  '0x4a2cf0':['FUN_004a2290','FUN_004a23a0','FUN_004f7dc0','DAT_00c444fc = 1'],
  '0x4a3050':['DAT_00c444fc == 1','DAT_00c21ba4 < 1','DAT_00614884 + 500','FUN_004f7e90','FUN_004f7e50'],
  '0x4a2f90':['FUN_004f7e50','DAT_00c444fc = 0','DAT_00c21ba4 == 2'],
  '0x4a24b0':['DAT_00c5e9b8','FUN_004f7e90','FUN_004a2220','FUN_004a2340'],
  '0x4a2480':['DAT_00c5e9b8 = 1','0x8000'],
  '0x4f4830':['FUN_004cbf10(0)','DAT_00c444fc == 2','DAT_00c444fc = 1'],
  '0x49aad0':["case 'A':","case 'G':","case 'I':","case 'P':",'0x11f','iVar3 + 6','local_410 + 0x21'],
  '0x48fce0':['case 0x17:','case 0x21:','case 0x22:','FUN_0049aad0','FUN_0049f080'],
  '0x49b5e0':['FUN_004b98e0(1,1)','DAT_00c10f34 == 0','DAT_0055e4d4 != 0x21'],
  '0x49e200':['FUN_004b98e0(1,1)','DAT_0055e4d4 != 0x22'],
  '0x49aa00':['DAT_0055e4d4 = -1','FUN_004f8240','FUN_00445220'],
  '0x49e1b0':['DAT_0055e4d4 == 0x22','FUN_00445220'],
  '0x47b900':['DAT_007286ad & 2','DAT_00c5e940','FUN_0047e4e0','FUN_0047b7e0(0xffffffff)'],
  '0x47b7e0':['DAT_00c10f30 == 0','DAT_00c10e34 == 0','FUN_004f6c70','FUN_004f8240'],
  '0x47f330':['FUN_004f7940','DAT_00c10f30 != 0','FUN_004f8240'],
  '0x49dc80':['1000000 - DAT_00c2a97c','1000000 - DAT_00f53624','FUN_0046b530','FUN_004f8240'],
  '0x49e3e0':['& 0x60','!= 0x26','!= 0x34','iVar8 == 0x36','FUN_0047b900'],
  '0x49eaa0':['& 0x60','!= 0x26','!= 0x34','FUN_0047b900'],
  '0x4cbce0':['iVar6 * 0x64c','0x193','uVar2 & 1'],
  '0x4cc550':['0x193','param_2 < 0x1c','param_3 < 0x1c'],
  '0x4c80b0':['0x191','param_2 < 0x1c','param_3 < 0x1c'],
  '0x4a34f0':['*param_5 ==','FUN_0046b530','(*pcVar2)'],
  '0x4a47a0':['DAT_00c43838 = *param_9','*param_9 = 0'],
  '0x4a5760':['FUN_004a2290','FUN_004a23a0','DAT_00c43838'],
  '0x4a58b0':['DAT_00c3b2a0','DAT_00c20f04','0x14'],
 }
 for entry,values in tokens.items():
  for value in values:assert value in texts[entry],(entry,value)
 assert 'GetTickCount'not in texts['0x4a2cf0']and 'DAT_00614884'not in texts['0x4a2cf0']
 assert 'FUN_004f8240'not in texts['0x49e1b0']
 # Original selected read windows are bounded raw evidence, not complete functions.
 raw_windows=[]
 for name in ['player-trade','bank-storage']:
  path=f'analysis/game-battle-shared-storage-v1/{name}-source-check.json';doc=read(path)
  for i,q in enumerate(doc['raw_windows']):
   at=int(q['address'],16);raw=pe.read(at,q['bytes']);assert digest(raw)==q['sha256']and pe.file_offset(at,len(raw))==q['file_offset']
   raw_windows.append(dict(**q,source_check=path,pointer=f'/raw_windows/{i}',complete_function_claimed=False))
 # The source position EBP is serialized; the separator counter is separate.
 row=records['0x4a2cf0'];ins={int(i['address'],16):i for i in row['instructions']}
 serialization_anchors=[]
 for at,expected in [(0x4a2d71,'55'),(0x4a2dbd,'55'),(0x4a2dbe,'52'),(0x4a2e80,'55'),(0x4a2e81,'52')]:
  assert ins[at]['bytesHex']==expected and bytes.fromhex(expected)==pe.read(at,1)
  serialization_anchors.append(dict(address=hex(at),bytes_hex=expected,text=ins[at]['text'],owner='0x4a2cf0'))
 for owner in ['0x4a2cf0','0x4a2f90','0x4a3050']:
  direct={q['target']for q in calls if q['owner']==owner}
  if owner=='0x4a2cf0':assert '0x4f7dc0'in direct
  if owner=='0x4a2f90':assert '0x4f7e50'in direct
  if owner=='0x4a3050':assert {'0x4f7e50','0x4f7e90'}<=direct
 inv=read(U/'entry-inventory.json');windows=[]
 for id in [38,41,43,44]:
  w=inv['classic_windows'][id];at=int(w['descriptor_address'],16);raw=pe.read(at,48);words=struct.unpack('<12I',raw)
  assert digest(raw)==w['descriptor_sha256']and struct.unpack('<I',pe.read(int(w['pointer_address'],16),4))[0]==at
  assert all(int(v,16)in words for v in w['callbacks'].values())
  for q in w['controls']:assert digest(pe.read(int(q['address'],16),32))==q['sha256']
  windows.append(dict(id=id,descriptor_address=hex(at),descriptor_sha256=digest(raw),callbacks=w['callbacks'],controls_identity_checked=len(w['controls'])))
 bank=read(U.parent/'game-battle-shared-storage-v1/bank-storage-source-check.json');modes=[];record_branches=[]
 for mode,q in bank['modes'].items():
  m=int(mode,16);idx=pe.read(0x49026c+m,1)[0];target=struct.unpack('<I',pe.read(0x4901f8+idx*4,4))[0]
  assert target==int(q['dispatch'],16)
  c=next(c for c in calls if c['source']==q['call']);assert c['target']=='0x49aad0'
  modes.append(dict(mode=mode,**q,selector_byte=idx,call_target=c['target']))
 listing={int(re.match(r'\s*(0x[0-9a-fA-F]+):',l)[1],16)for l in records['0x49aad0']['normalized_result']['assembly']}
 for key,target in bank['record_branches'].items():
  idx=pe.read(0x49b5cc+ord(key)-65,1)[0];value=struct.unpack('<I',pe.read(0x49b5b8+idx*4,4))[0]
  assert value==int(target,16)and value in listing;record_branches.append(dict(operation=key,target=target,selector_byte=idx))
 formats=[]
 for at,raw in [(0x5633ec,b'%d|%d\0'),(0x56367c,b'I|%d|%d|%d\0'),(0x5637c8,b'P|%d|%d\0'),(0x564584,b'G|%d\0'),(0x56457c,b'D|%d\0'),(0x534594,b'C\0')]:
  assert pe.read(at,len(raw))==raw;formats.append(dict(address=hex(at),bytes=len(raw),hex=raw.hex(),file_offset=pe.file_offset(at,len(raw)),sha256=digest(raw)))
 oldtrade=read(U.parent/'game-battle-shared-storage-v1/player-trade-source-check.json');protocols=[]
 for side,key,items in [('receive_entries','consumer',oldtrade['incoming']),('send_entries','producer',oldtrade['outgoing'])]:
  for q in items:
   if q.get('producer')=='0x4f7dc0':
    assert q['tag']=='+oj'and q['fields']==['bytes','bytes','int32']and pe.read(0x567b9c,4)==b'+oj\0'
    protocols.append(dict(**q,scope='Existing bounded formatter/raw-source proof; absent from old60-entry formatter inventory.'));continue
   actual=next(r for r in inv[side]if r[key]==q[key]);assert actual['tag']==q['tag']and actual['fields']==q['fields']
   assert pe.read(int(actual['tag_address'],16),4)==q['tag'].encode()+b'\0';protocols.append(actual)
 receipt=read(P/'derived-functions-receipt.json');assert receipt['exit_code']==0 and receipt['source_sha256_after']==receipt['source_sha256']==SHA
 anchors=receipt['verified_pointer_or_call_anchors'];assert len(anchors)==8
 for q in anchors:
  at=int(q['address'],16);raw=bytes.fromhex(q['instruction_hex']);assert raw==pe.read(at,len(raw))
  if q['kind']=='PUSH':assert raw==b'\x68'+int(q['target'],16).to_bytes(4,'little')
  else:assert raw[0]==0xe8 and at+5+struct.unpack('<i',raw[1:])[0]==int(q['target'],16)
 counter=read(P/'shared-counter-writer-candidates.json');assert counter['records_examined']==480 and not counter['all_writers_or_aliases_closed']
 trade=(R/'shared/legacy-game-player-trade.mjs').read_text();bankcode=(R/'shared/legacy-game-map-bank.mjs').read_text()
 for token in ['items[slot].revision === revision','offer.petVersion === pets.version','offerStillCurrent(panel.offer, readContext())','lastTick = tick','slotPairs(items)']:assert token in trade,token
 for token in ['action.version !== bank.version','if (bank.pending)','bank.version++','action.fromRevision !== source.revision']:assert token in bankcode,token
 summary=dict(selected_source_views=len(bodies),unique_reused_native_entries=totals['native_views'],native_source_body_bytes=totals['native_body_bytes'],native_listing_boundaries=totals['native_listing_boundaries'],reused_derived_views=totals['reused_derived_views'],reused_derived_body_bytes=totals['reused_derived_body_bytes'],reused_derived_instructions=totals['reused_derived_instructions'],new_derived_views=totals['new_derived_views'],new_derived_body_bytes=totals['new_derived_body_bytes'],new_derived_instructions=totals['new_derived_instructions'],declared_source_body_bytes=totals['body_bytes'],direct_E8_CALL_occurrences_verified=len(calls),unique_E8_CALL_sites_verified=len({q['source']for q in calls}),original_complete_native_records_factory_validated=52,old_helper_ID_bindings_verified=bound,classic_descriptors=4,classic_controls_identity_checked=sum(w['controls_identity_checked']for w in windows),old_bounded_raw_windows_verified=len(raw_windows),storage_wire_modes=3,storage_record_operations=4,trade_protocol_bindings=len(protocols),new_REA_records=0,runtime_features_changed=False,all_capability_analysis_complete=False)
 return dict(schema='moli.capability.game-trade-storage-source-check.v1',source=ident(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'),native_profile=PROFILE,manifest=ident(manifest),source_selection=ident(P/'source-body-selection.json'),source_bodies=bodies,original_complete_record_authentication=ident(P/'authenticate-reused-records.json'),source_helper_index=ident(P/'trade-storage-native-source-index.json'),helper_record_selection=ident(P/'reused-trade-storage-native.json'),semantic_anchor_tokens=tokens,old_bounded_raw_windows=raw_windows,serialization_instruction_anchors=serialization_anchors,classic_window_bindings=windows,storage_mode_dispatch=modes,storage_record_dispatch=record_branches,format_bytes=formats,protocol_bindings=protocols,verified_pointer_or_call_anchors=anchors,direct_E8_CALLs=calls,counter_candidate_scope=counter,summary=summary,passed=True,original_execution=False,VM_operations=False,account_or_official_session_observed=False,runtime_features_changed=False,full_trade_storage_exception_or_global_lifecycle_closed=False,all_capability_analysis_complete=False,implementation_gate_passed=False,full_goal_complete=False,
 known_scope=['Complete declared source extents and derived instruction bytes are checked; selected clauses do not close every helper or global/abnormal schedule.','Native non-CALL opcode text is not independently re-decoded; old raw windows are bounded ranges, not complete native functions.','Six views are independently seeded static Ghidra exports with null native_profile; original REA records and metadata remain unchanged.','52 complete old records are individually factory validated; no whole original snapshot/bundle was factory validated/imported.','Revision/pending/atomic input/dense selection/fresh recheck policies belong to the independent core.','No original program, VM, account/network session, product test/build or device flow was run.'])
if __name__=='__main__':
 result=build();(U/'game-trade-storage-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(result['summary'],ensure_ascii=False))
