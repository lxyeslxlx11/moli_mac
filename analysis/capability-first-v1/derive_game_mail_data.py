"""Verify retained mail rules and the finite attachment-flow/configuration-owner supplement."""
import hashlib,importlib.util,json,re,struct,sys
from pathlib import Path
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parents[2];U=Path(__file__).resolve().parent
P=R/'build/analysis/capability-game-mail-attachment-owners-v1'
OLD=R/'build/analysis/capability-game-mail-group-v1'
M=R/'build/analysis/capability-game-attachment-lifecycle-v1'
N=R/'build/analysis/capability-game-mail-data-v1'
sys.path.insert(0,str(U))
from extract_entry_inventory import PE
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
load=lambda p:json.loads(p.read_text())
digest=lambda raw:hashlib.sha256(raw).hexdigest()
def canonical(v):return digest(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
def pointer(v,p):
 for k in p.split('/')[1:]if p else []:v=v[int(k)]if isinstance(v,list)else v[k]
 return v
MANIFEST_SHA='324bf8188b3a835640d78e6de5a2cd06cc2228e33e02fe02e12e30c2e9c3c68f'
def build():
 manifest=P/'source-inputs.json';assert digest(manifest.read_bytes())==MANIFEST_SHA
 identities={}
 def ident(path):
  if path not in identities:
   h=hashlib.sha256()
   with path.open('rb')as f:
    for raw in iter(lambda:f.read(1048576),b''):h.update(raw)
   identities[path]=dict(path=str(path.relative_to(R)),bytes=path.stat().st_size,sha256=h.hexdigest())
  return identities[path]
 for row in load(manifest)['files']:assert ident(R/row['path'])==row,row['path']
 frozen=P/'before/analysis/capability-first-v1/derive_game_mail_data.py'
 spec=importlib.util.spec_from_file_location('moli_mail_data_retained_base',frozen)
 base=importlib.util.module_from_spec(spec);spec.loader.exec_module(base)
 base.R=R;base.U=U;base.P=R/'build/analysis/capability-game-mail-owner-recovery-v1';base.OLD=R/'build/analysis/capability-game-mail-group-v1';base.M=R/'build/analysis/capability-game-attachment-lifecycle-v1';base.N=R/'build/analysis/capability-game-mail-data-v1'
 result=base.build();prior=dict(result['summary'])
 pe=PE(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe',SHA)
 selection=load(P/'delta-source-selection.json');combined=load(P/'source-body-selection.json');cache={};records={};bodies=[];calls=[]
 totals=dict(native_source_body_bytes=0,native_listing_boundaries=0,reused_derived_body_bytes=0,reused_derived_instructions=0,new_derived_body_bytes=0,new_derived_instructions=0)
 def read(path):
  path=R/path if isinstance(path,str)else path
  if path not in cache:cache[path]=load(path)
  return cache[path]
 def call(at,raw,text,entry,path,ptr):
  if len(raw)<5 or raw[0]!=0xe8:return
  target=(at+5+struct.unpack('<i',raw[1:5])[0])&0xffffffff
  assert re.search(r'\bCALL\b',text,re.I)and re.search(r'0x0*'+format(target,'x')+r'\b',text,re.I)
  calls.append(dict(source=hex(at),target=hex(target),instruction_hex=raw[:5].hex(),owner=entry,file=path,pointer=ptr,file_offset=pe.file_offset(at,5)))
 for row in selection['entries']:
  assert ident(R/row['file']['path'])==row['file'];r=pointer(read(row['file']['path']),row['pointer']);assert canonical(r)==row['record_sha256']
  entry=row['entry'];native=row['kind']=='native';proof=[];occupied=set()
  if native:
   assert r['operation']=='analyze_function'and r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
   n=r['normalized_result'];body=n['procedure']['body'];assert n['procedure']['address']==entry and body['available']and body['contains_entry']
   spans=body['ranges'];size=body['total_bytes'];text=n['pseudocode']
  else:
   assert hex(int(r['requestedEntry'],16))==entry and r['decompileCompleted']and r['status']=='derived-static-export'
   spans=r['derivedBody'];size=r['derivedBodyBytes'];text=r['pseudocode']
  for span in spans:
   a,z=int(span['start'],16),int(span['end'],16);raw=pe.read(a,z-a+1);assert pe.executable(a)and pe.executable(z)
   occupied.update(range(a,z+1));proof.append(dict(start=hex(a),end=hex(z),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=digest(raw)))
  assert len(occupied)==size
  if native:
   points=[]
   for i,line in enumerate(n['assembly']):
    m=re.match(r'\s*(0x[0-9a-fA-F]+):\s*(.*)',line);assert m
    at=int(m[1],16);assert at in occupied;points.append((at,i,m[2]))
   for at,i,line in points:
    end=next(int(s['end'],16)+1 for s in proof if int(s['start'],16)<=at<=int(s['end'],16))
    raw=pe.read(at,min(5,end-at));call(at,raw,line,entry,row['file']['path'],row['pointer']+f'/normalized_result/assembly/{i}')
   count=0;totals['native_source_body_bytes']+=size;totals['native_listing_boundaries']+=len(points)
  else:
   covered=set()
   for i,ins in enumerate(r['instructions']):
    at=int(ins['address'],16);raw=bytes.fromhex(ins['bytesHex']);assert raw and raw==pe.read(at,len(raw))
    area=set(range(at,at+len(raw)));assert not area&covered;covered|=area
    call(at,raw,ins['text'],entry,row['file']['path'],row['pointer']+f'/instructions/{i}')
   assert covered==occupied;count=len(r['instructions']);label='reused'if row['role']=='reused-complete-mail-context-view'else'new'
   totals[label+'_derived_body_bytes']+=size;totals[label+'_derived_instructions']+=count
  records[entry]=r
  bodies.append(dict(entry=entry,kind=row['kind'],role=row['role'],source=row['file'],pointer=row['pointer'],record_sha256=row['record_sha256'],evidence_id=row['evidence_id'],native_profile=row['native_profile'],ranges=proof,declared_body_bytes=size,pseudocode_sha256=digest(text.encode()),derived_instructions_byte_verified=count,semantic_scope='Selected supplement clauses, not every caller or runtime path.'))



 auth=read(P/'authenticate-supplement.json')
 assert auth['passed']and auth['complete_records_factory_validated']==8 and not auth['failures']
 assert auth['source']==ident(P/'delta-source-selection.json')
 tokens={
  '0x45c820':['FUN_004544e0','FUN_005174b0','FUN_00517430','DAT_009236a8 = 0','DAT_00923990 = 0','DAT_00924f44 = 1','DAT_00924328 = 0xff'],
  '0x4544e0':['0x3c39f','0x3bd9f','0x5727','0x56c4','0x55f2','FUN_00452fe0','return 4 - iVar1'],
  '0x452fe0':['DAT_00921aa8 + param_1 * 4','return 1'],
  '0x517430':['DAT_00fc5474','DAT_00fc2c77','uVar2 < 0x33','*param_1 = 0'],
  '0x5174b0':['DAT_00fc5474','DAT_00fc2caa','uVar2 < 0x33','*param_1 = 0'],
  '0x511660':['LAB_00511640','FUN_004ea5b0(0x31)','DAT_00fba958 = local_94','DAT_00fba958 = -1','DAT_00c5fb2c & 0x10'],
  '0x512030':['DAT_00fba960 =','DAT_00d72fb2','FUN_004d0e60','FUN_004ea460(0x57)','FUN_004ea460(0x56)'],
  '0x513250':['uVar7 = 0x58','uVar7 = 0x5a','uVar7 = 0x5e'],
  '0x513700':['DAT_00fc1824 = iVar1','FUN_00505950','FUN_00505450','FUN_004ea460(0x5e)'],
  '0x511640':['DAT_00fba95c = 0','DAT_00fba958 = 0xffffffff'],
  '0x513b40':['FUN_00513b10','FUN_004fe580','DAT_00fba728 = DAT_00fba954','DAT_00fba968'],
  '0x513b10':['DAT_00fba408','200,4,&LAB_005139b0','0xfba728'],
  '0x5139b0':['DAT_00fc1824 == 0','DAT_00fc1824 == 1','DAT_00fbb6c8','DAT_00fbb6ce','DAT_00fbb6dc','return 0xffffffff'],
  '0x505450':['DAT_00f62d50','FUN_005111c0','FUN_0051c700','FUN_00517510'],
  '0x505950':['DAT_00f63063 = (undefined1)DAT_00c5ea70'],
  '0x517510':['DAT_00f62d50','DAT_00fc2c40 + DAT_00fc549c * 0x100','iVar1 = 0x100']}
 for entry,values in tokens.items():
  n=records[entry].get('normalized_result',records[entry])
  for value in values:assert value in n['pseudocode'],(entry,value)
 assert 'fc5474'not in records['0x517510']['normalized_result']['pseudocode'].lower()
 inv=read(U/'entry-inventory.json');selected={'0x511660','0x512030','0x513250','0x513700'}
 for w in inv['modern_windows']:
  if w['callback']not in selected:continue
  at=int(w['row_address'],16);raw=pe.read(at,20)
  assert struct.unpack('<5I',raw)==(w['id'],int(w['callback'],16),w['group'],0,w['initial_dirty'])
  assert not any(q['id']==w['id']for q in result['modern_window_bindings'])
  result['modern_window_bindings'].append(dict(**w,row_sha256=digest(raw),full_activation_not_proven=True))
 static=read(P/'selected-owner-static-spans.json')
 for q in static['spans']:
  at=int(q['address'],16);raw=bytes.fromhex(q['hex']);assert raw==pe.read(at,len(raw))and digest(raw)==q['sha256']
  if q.get('target'):assert struct.unpack('<I',raw)[0]==int(q['target'],16)
  else:
   assert q['encoding_status']=='unresolved-original-rendering-codepage'and q['decoding_is_inference']
   assert all(raw[:-1].decode(enc)==text for enc,text in q['decoded_candidates'].items())
 for q in static['business_descriptors']:
  at=int(q['id_address'],16);raw=pe.read(at,4);assert raw.hex()==q['id_bytes_hex']and digest(raw)==q['id_sha256']and struct.unpack('<I',raw)[0]==q['id']
  assert next(w for w in inv['modern_windows']if w['id']==q['id'])['callback']==q['callback']
 anchors=read(P/'attachment-owner-source-anchors.json')['anchors']
 for q in anchors:
  at=int(q['source'],16);raw=bytes.fromhex(q['instruction_hex']);assert raw==pe.read(at,5)
  if q['kind']in('CALL','tail-JMP'):
   assert raw[0]==(0xe8 if q['kind']=='CALL'else 0xe9)and(at+5+struct.unpack('<i',raw[1:])[0])&0xffffffff==int(q['target'],16)
  else:assert raw==b'\x68'+struct.pack('<I',int(q['target'],16))
  source=q['source_identity'];assert ident(R/source['path'])==source
  original=pointer(read(source['path']),q['original_instruction_pointer'])
  if isinstance(original,dict):assert int(original['address'],16)==at and original['bytesHex']==raw.hex()
  else:assert re.search(r'^\s*0x0*'+format(at,'x')+r':\s*'+('CALL'if q['kind']=='CALL'else'JMP'if q['kind']=='tail-JMP'else'PUSH')+r'\s+0x0*'+format(int(q['target'],16),'x')+r'\b',original,re.I)
 assert len(anchors)==14 and sum(q['kind']=='CALL'for q in anchors)==10 and sum(q['kind']=='tail-JMP'for q in anchors)==1
 query=read(P/'owner-field-literal-query.json');assert query['counts']=={'0xfba958':11,'0xfba960':2,'0xfba408':18,'0xfc1824':3}
 assert not query['unresolved_candidates']and not query['alias_range_fill_or_all_runtime_writes_closed']
 for q in query['candidates']:
  at=int(q['literal_address'],16);assert bytes.fromhex(q['hex'])==pe.read(at,4)and struct.unpack('<I',pe.read(at,4))[0]==int(q['target'],16)
  assert q['resolved']and q['retained_instruction_matches']
  for m in q['retained_instruction_matches']:
   source=m['source'];assert ident(R/source['path'])==source
   ins=pointer(read(source['path']),m['pointer']);raw=bytes.fromhex(m['instruction_hex']);assert raw==pe.read(int(m['instruction_address'],16),len(raw))
   if isinstance(ins,dict):assert ins['bytesHex']==raw.hex()and ins['text']==m['instruction_text']
   else:assert ins.endswith(': '+m['instruction_text'])
 writer=records['0x505450']['normalized_result'];lines={int(re.match(r'\s*(0x[0-9a-fA-F]+):',l)[1],16):l for l in writer['assembly']};points=sorted(lines)
 expected={0x50545d:'MOV ECX, 0x100',0x505462:'MOV ESI, 0xf62d50',0x505467:'LEA EDI, [ESP + 0x10]',
  0x50546d:'MOV ECX, 0xc',0x505474:'LEA EDI, [ESP + 0x47]',0x505478:'PUSH 0x800',0x50548f:'PUSH 0x0',
  0x505495:'PUSH 0x400',0x5054a5:'MOV EAX, [0x00fc549c]',0x5054b6:'MOV ECX, dword ptr [EAX*0x4 + 0xfc5474]',
  0x5054bd:'SHL ECX, 0x8',0x5054c0:'ADD ECX, 0xfc2240',0x5054d9:'PUSH 0x564f90',0x5054eb:'JNZ 0x00505500',
  0x5054ed:'XOR EBX, EBX',0x5054ef:'CALL 0x00517510',0x50551c:'CMP EAX, ECX',0x50551e:'JNC 0x00505522',
  0x505520:'XOR EBX, EBX',0x50552b:'CALL 0x00517510',0x505531:'MOV EAX, EBX'}
 writer_points=[]
 for at,text in expected.items():
  assert text in lines[at],(hex(at),lines[at]);end=next(x for x in points if x>at);raw=pe.read(at,end-at)
  writer_points.append(dict(address=hex(at),instruction=lines[at],bytes_hex=raw.hex(),file_offset=pe.file_offset(at,len(raw))))
 for prefix,count in[('rea-',4),('rea-settings-',3)]:
  closed=read(P/(prefix+'final-closed.json'))['structuredContent']['result'];assert not closed['open']and not closed['cleanup_pending']
  assert read(P/(prefix+'export.json'))['structuredContent']['result']['records']==read(P/(prefix+'close.json'))['structuredContent']['result']['evidence_records']==count
 result['source_bodies']+=bodies;result['direct_E8_CALLs']+=calls;result['verified_call_and_pointer_anchors']+=anchors
 result['selected_static_literals']+=static['spans'];summary=dict(prior)
 for k,v in totals.items():summary[k]+=v
 for k,v in combined['summary'].items():summary[k]=v
 summary.update(declared_source_body_bytes=sum(q['declared_body_bytes']for q in result['source_bodies']),
  direct_E8_CALL_occurrences_verified=len(result['direct_E8_CALLs']),unique_E8_CALL_sites_verified=len({q['source']for q in result['direct_E8_CALLs']}),
  modern_table_rows=len(result['modern_window_bindings']),selected_static_literal_spans=len(result['selected_static_literals']),
  actual_CALL_anchors=prior['actual_CALL_anchors']+10,actual_code_pointer_anchors=prior['actual_code_pointer_anchors']+3,
  actual_tail_JMP_anchors=1,final_REA_export_records=3,final_REA_snapshot_records=3,
  REA_new_export_records_in_this_batch=7,REA_export_batch_counts=[4,3],REA_sessions_closed_in_this_batch=2)
 assert len(result['source_bodies'])==len({q['entry']for q in result['source_bodies']})==138
 assert summary['declared_source_body_bytes']==56176 and totals['new_derived_body_bytes']==509 and totals['new_derived_instructions']==165
 result.update(manifest=ident(manifest),base_source_manifest=result['manifest'],source_selection=ident(P/'source-body-selection.json'),summary=summary,
  retained_base_verifier=ident(frozen),attachment_owner_native_authentication=ident(P/'authenticate-supplement.json'),
  attachment_owner_source_selection=ident(P/'delta-source-selection.json'),attachment_owner_semantic_anchor_tokens=tokens,
  attachment_owner_seed_anchors=anchors,attachment_owner_literal_query=ident(P/'owner-field-literal-query.json'),
  attachment_owner_literal_resolutions=query['candidates'],attachment_owner_alias_or_global_writer_closure=False,
  attachment_owner_business_descriptor_bindings=static['business_descriptors'],current_settings_writer_stack_and_index_anchors=writer_points,
  caption_rendering_encoding_proven=False,source_452fe0_lookup_return_not_probe_result=True,
  attachment_owner_scope=['selected family choice, pet/item selection, sender cleanup, list cache and independent sort settings',
   'actual row-index producer and comparator; no conversion to family member IDs is invented',
   'profile editor publication and five-cell selector using out-values, not unconditional helper return1',
   'current runtime save failure, direct-index memory copy and mapped directory path are distinct',
   'full dispatch, all aliases/bulk reset, late ownership and official acceptance remain unproven'])
 return result
if __name__=='__main__':
 result=build();(U/'game-mail-data-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(result['summary'],ensure_ascii=False))
