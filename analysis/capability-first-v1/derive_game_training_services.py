"""Verify retained training-service sources and independent callback derivations.

Source extent, semantic review, independent acceptance policy and runtime results
are separate. This script executes no game, VM, server or product flow.
"""
import hashlib,json,re,struct
from pathlib import Path
from extract_entry_inventory import PE
ROOT=Path(__file__).resolve().parents[2];PUBLIC=Path(__file__).resolve().parent
PRIVATE=ROOT/'build/analysis/capability-game-training-services-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA='c6ff4da4263dd160afde9fe4576c0daf6c9fa0768eff7fadcdcb292022e71a1d'
def load(p):return json.loads(p.read_text())
def stable(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def digest(b):return hashlib.sha256(b).hexdigest()
def identity(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=h.hexdigest())
def pointer(v,p):
 for k in p.split('/')[1:]if p else []:v=v[int(k)]if isinstance(v,list)else v[k]
 return v
def build():
 manifest=PRIVATE/'source-inputs.json';assert identity(manifest)['sha256']==MANIFEST_SHA
 for r in load(manifest)['files']:assert identity(ROOT/r['path'])==r,r['path']
 source=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';pe=PE(source,SHA)
 cache={};native=[];derived=[];pseudocode={};full={}
 for row in load(PRIVATE/'source-body-selection.json')['entries']:
  path=ROOT/row['file']['path'];assert identity(path)==row['file']
  if str(path)not in cache:cache[str(path)]=load(path)
  r=pointer(cache[str(path)],row['pointer']);entry=row['entry'];role=row['role'];spans=[]
  if row['kind']=='native':
   assert r['operation']=='analyze_function'and r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
   n=r['normalized_result'];assert n['procedure']['address']==entry
   body=n['procedure']['body'];assert body['available']and body['contains_entry'];ranges=body['ranges'];size=body['total_bytes'];text=n['pseudocode']
  else:
   assert hex(int(r['requestedEntry'],16))==entry and r['decompileCompleted']and r['status']=='derived-static-export'
   ranges=r['derivedBody'];size=r['derivedBodyBytes'];text=r['pseudocode']
  for s in ranges:
   a,b=int(s['start'],16),int(s['end'],16);raw=pe.read(a,b-a+1);assert pe.executable(a)and pe.executable(b)
   spans.append(dict(start=hex(a),end=hex(b),bytes=len(raw),file_offset=pe.file_offset(a,len(raw)),sha256=digest(raw)))
  assert sum(s['bytes']for s in spans)==size
  item=dict(entry=entry,role=role,source=identity(path),record_pointer=row['pointer'],record_sha256=digest(stable(r).encode()),ranges=spans,pseudocode_sha256=digest(text.encode()))
  if row['kind']=='native':
   bindings=cache[str(path)]['bindings'];binding=next(b for b in bindings if b['evidence_id']==r['evidence_id'])
   assert binding['record_sha256']==item['record_sha256']
   item.update(authority='complete-original-REA-record',native_profile=PROFILE,evidence_id=r['evidence_id'],original_parameters=r['parameters'],
    original_snapshot=binding['source_snapshot'],original_selector=binding['source_json_pointer'],body_metadata=body)
   native.append(item)
  else:
   covered=set()
   for ins in r['instructions']:
    a=int(ins['address'],16);raw=bytes.fromhex(ins['bytesHex']);assert raw and pe.read(a,len(raw))==raw
    assert any(int(s['start'],16)<=a and a+len(raw)-1<=int(s['end'],16)for s in spans)
    covered.update(range(a,a+len(raw)))
   assert len(covered)==size
   item.update(authority='analyst-seeded-derived-static',native_profile=None,instructions_verified=len(r['instructions']),instruction_bytes_verified=len(covered))
   if role=='reused-derived':
    b=next(b for b in cache[str(path)]['bindings']if b['entry']==entry);original=ROOT/b['source_identity']['path']
    if str(original)not in cache:cache[str(original)]=load(original)
    assert pointer(cache[str(original)],b['source_pointer'])==r
    item.update(original_source=b['source_identity'],original_selector=b['source_pointer'],original_authority=b['authority'])
   else:
    meta=cache[str(path)];assert meta['originalExecution']is False and meta['originalBytePatches']is False
    item.update(derivation_metadata={k:v for k,v in meta.items()if k!='entries'})
   derived.append(item)
  pseudocode[entry]=text;full[entry]=r
 # These anchors locate rules reviewed by the root; matching tokens is not a whole-state proof.
 tokens={
  '0x48fce0':['switch(param_1)','DAT_0055e4d4 = param_1','DAT_00c203e0 = param_3','DAT_00c440cc = param_4','FUN_004af7d0','FUN_004b0490'],
  '0x492d50':['FUN_004926f0','LAB_00492cd0'], '0x492cd0':['-1 < param_1','param_1 < 2','param_1 + 1','FUN_004f8240'],
  '0x4929f0':['(*DAT_00c10194)(iVar6)','0x8000'], '0x492770':['param_1 == -1','(*DAT_00c10194)(0xffffffff)'],
  '0x4929c0':['DAT_00c10198','DAT_0055e4d4 == DAT_00c10178'],
  '0x4af7d0':['DAT_00c20f08','DAT_00c3b610','DAT_00c07f6c = 0','FUN_0046c6b0(0x36'],
  '0x4b0680':['DAT_00ef356a','DAT_00eadfbd','DAT_00f53694 - iVar9','DAT_00c1df7c = DAT_00c1df7c + iVar9'],
  '0x4b1e70':['param_2 & 2','DAT_00c07f6c','FUN_004f8240'],
  '0x4b1f60':['case 0:','case 1:','case 2:','case 0xc:','case 3:','case 4:','case 0xd:','99','DAT_0055e4d4 = 0xfffffffe'],
  '0x4b08a0':['DAT_00c22534','DAT_00eadfa4','0x49fc','LAB_004b2bc0'],
  '0x4b2bc0':['cVar2 <','DAT_00c1df3c','cVar2 + 1','FUN_004f8240'],
  '0x4b2f60':['DAT_00f53624 <','DAT_00ef35f0','iVar8 == 0','DAT_00c43f64 = iVar1','DAT_0055e4d4 = 0xfffffffe'],
  '0x4b0020':['DAT_00c11374 != 0','DAT_00c16218 = 0xffffffff','DAT_00c07f6c = 3'],
  '0x4b0200':['DAT_00c11374 != 0','DAT_00c16218 = FUN_00510e50','DAT_00c07f6c = 0xd'],
  '0x4b2d00':['DAT_00c5e295','DAT_00c16218 < 0','DAT_00c5e298','DAT_00c5e29c','DAT_00c07a98 = iVar6'],
  '0x4b0490':['DAT_00c11374 != 0','DAT_00c5dd18','DAT_00c07f6c = 4'],
  '0x4b11e0':['DAT_00c5e280','DAT_00c5dd18'], '0x4b2ea0':['DAT_00c08098','| 2'],
  '0x4b31d0':['DAT_00c08098','FUN_004f8240','0xfffffffd','0x8000'],
  '0x4b3150':['DAT_00c43f64 == iVar1','FUN_005070e0','return 0'],
  '0x4af790':['DAT_00c5e270 != 2','DAT_00c1fab4 == DAT_0055e4d4','DAT_00c5e270 = 0'],
  '0x490db0':['DAT_00c43f60','DAT_00c1ec24 = 2','LAB_004903e0','LAB_00490b80'],
  '0x4903e0':['param_2 + 1','FUN_004f8240','DAT_0055e4d4 = 0xffffffff'],
  '0x490b80':['DAT_00f53624','DAT_00c43f60','FUN_004fee60'],
  '0x4f0000':['uVar1 & 0x20001','DAT_00f53694'], '0x4f0290':['DAT_00eadfbd','FUN_004fdea0']}
 for entry,required in tokens.items():
  for t in required:assert t in pseudocode[entry],(entry,t)
 assert 'DAT_00f53624'not in pseudocode['0x4b0680']and 'DAT_00f53624'not in pseudocode['0x4b1e70']
 assert 'FUN_004f8240'not in pseudocode['0x4b3150']
 # Original protocol/table identities were established earlier; recheck actual file bytes here.
 inv=load(PUBLIC/'entry-inventory.json');windows=[]
 for w in [w for w in inv['classic_windows']if w['id']in [52,54]]:
  a=int(w['descriptor_address'],16);raw=pe.read(a,48);assert digest(raw)==w['descriptor_sha256']
  assert struct.unpack('<I',pe.read(int(w['pointer_address'],16),4))[0]==a
  for c in w['controls']:assert digest(pe.read(int(c['address'],16),32))==c['sha256']
  windows.append(dict(id=w['id'],callbacks=w['callbacks'],descriptor_address=hex(a),descriptor_sha256=digest(raw),control_identities_verified=len(w['controls'])))
 assert len(windows)==2 and sum(w['control_identities_verified']for w in windows)==110
 protocols=[]
 for key,entry,side,fields,tag in [('consumer','0x4f4410','receive_entries',['int32']*4+['bytes'],'Q?m'),('producer','0x4f8240','send_entries',['int32']*5+['bytes'],'/1I')]:
  row=next(r for r in inv[side]if r[key]==entry);assert row['fields']==fields and row['tag']==tag
  raw=pe.read(int(row['tag_address'],16),4);assert raw==tag.encode()+b'\0'and digest(raw)==row['tag_word_sha256'];protocols.append(row)
 audit=load(PRIVATE/'body-byte-audit.json');assert audit['passed']and not audit['problems'];anchors=audit['call_anchors']
 auth=audit['reused_snapshot_record_authentication'];assert auth['passed']and auth['complete_records_factory_validated']==59
 assert not auth['original_snapshot_or_bundle_factory_validated']
 for a in anchors:
  address,target=int(a['source'],16),int(a['target'],16);raw=pe.read(address,5)
  assert raw[0]==0xe8 and address+5+int.from_bytes(raw[1:],'little',signed=True)==target
 closed=load(PRIVATE/'rea-final-closed.json');assert closed['open']is False and closed['cleanup_pending']is False
 prior=identity(ROOT/'build/analysis/capability-game-pet-publication-v1/rea-evidence-final.json');current=identity(PRIVATE/'rea-evidence-final.json')
 assert prior['bytes']==current['bytes']==308223543 and prior['sha256']==current['sha256']=='985323c0b6ecf6ba98e4f62bb979854be18f0dce4403d4d5d8e80d6f73ddabfc'
 size=lambda rows:sum(s['bytes']for r in rows for s in r['ranges'])
 old=[r for r in derived if r['role']=='reused-derived'];new=[r for r in derived if r['role']=='new-derived']
 assert len(native)==28 and size(native)==12028 and len(old)==15 and size(old)==6135 and len(new)==9 and size(new)==4249
 summary=dict(reused_complete_native_records=28,reused_native_unique_body_bytes=12028,reused_derived_entries=15,reused_derived_body_bytes=6135,
  reused_derived_instructions_verified=sum(r['instructions_verified']for r in old),new_derived_entries=9,new_derived_body_bytes=4249,
  new_derived_instructions_verified=sum(r['instructions_verified']for r in new),new_native_records=0,source_anchored_CALLs=len(anchors),
  classic_page_descriptors=2,classic_controls_identity_refs=110,REA_records=1784,REA_export_byte_identical_to_prior=True,new_REA_records=0,
  listed_service_modes=10,full_training_exception_or_global_lifecycle_closed=False,global97_callback_consumption_closed=False)
 result=dict(schema='moli.capability.game-training-services-source-check.v1',source=identity(source),native_profile=PROFILE,tools=dict(REA='6.7.0',Ghidra='12.1.4'),
  input_manifest=identity(manifest),native_bodies=native,derived_bodies=derived,source_anchored_calls=anchors,window_proofs=windows,protocol_bindings=protocols,
  body_byte_audit=identity(PRIVATE/'body-byte-audit.json'),complete_old_records_individually_factory_validated=59,
  original_snapshot_or_bundle_factory_validation_claimed=False,prior_REA_export=prior,current_REA_export=current,
  semantic_review=dict(method='Root reviewed relevant branches, guards, state and request ordering; tokens locate reviewed source only.',
   entries=sorted(tokens,key=lambda a:int(a,16)),generic_4903e0_other_input_modes_reviewed_as_training=False,full_game_state_semantics_closed=False),
  summary=summary,original_execution=False,VM_execution=False,account_or_official_session_observed=False,runtime_features_changed=False,all_capability_analysis_complete=False)
 (PUBLIC/'game-training-services-source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False))
if __name__=='__main__':build()
