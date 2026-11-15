"""Verify fixed PE mappings, canonical dossiers, independent callback seeds and retained evidence union."""
from pathlib import Path
import json,hashlib,struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-player-skills-v1'
def read(p):return json.loads(p.read_text())
def info(p):return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=hashlib.sha256(p.read_bytes()).hexdigest())
def unwrap(d):return d.get('structuredContent',{}).get('result')or d.get('result')or json.loads(next(c['text']for c in d['content']if c['type']=='text'))['result']
def main():
 old=read(R/'analysis/game-battle-pet-transition-v1/source-check.json');source=R/old['source']['path'];assert info(source)==old['source'];raw=source.read_bytes();pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];optional=struct.unpack_from('<H',raw,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',raw,pe+6)[0]):
  _,va,n,at=struct.unpack_from('<IIII',raw,pe+24+optional+i*40+8);sections.append((base+va,at,n))
 def offset(va,n):
  for start,at,count in sections:
   if start<=va and va+n<=start+count:return at+va-start
  raise AssertionError('Original file bytes unavailable')
 retained=R/'build/analysis/game-battle-pet-transition-v1/functions-complete.json';assert info(retained)==next(x for x in old['artifacts']if x['path']==str(retained.relative_to(R)));functions=read(retained);assert len(functions)==695
 profile='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
 def evidence(p):
  e=read(p);assert e['subject']['digest']['sha256']==old['source']['sha256']and e['analysis_profile']['digest']==profile;return e
 checks=[];files=[retained];new={}
 for address,n in[('4f0210',125),('4f0290',633),('4f0510',475),('4ff030',77),('4fdea0',82),('470b20',358),('470c90',296),('4ea400',85),('4033a0',15),('437410',29)]:
  name='function-'+address+('-accepted'if address=='4f0210'else'')+'.json';ev=evidence(P/name);v=ev['normalized_result'];assert v['procedure']['address']=='0x'+address and v['procedure']['body']['total_bytes']==n
  rb=evidence(P/f'read_bytes-{address}.json');fb=evidence(P/f'address_to_file_offset-{address}.json');b=rb['normalized_result'];at=offset(int(address,16),n);assert b['complete']and b['returned_bytes']==b['requested_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]and fb['normalized_result']['file_offset']==at
  key='0x'+address;assert key not in functions;new[key]=dict(id=ev['evidence_id'],**v);checks.append(dict(address=key,bytes=n,file_offset=at,evidence_id=ev['evidence_id'],original_match=True));files.extend(P/n for n in[name,f'read_bytes-{address}.json',f'address_to_file_offset-{address}.json'])
 assert sum(c['bytes']for c in checks)==2175;duplicate=evidence(P/'function-4f6d00.json');assert dict(id=duplicate['evidence_id'],**duplicate['normalized_result'])==functions['0x4f6d00'];files.append(P/'function-4f6d00.json')
 constants=[]
 for a,n in[('559a20',4),('52df98',48),('5415b0',960),('534160',16),('53459c',4)]:
  e=evidence(P/f'read_bytes-{a}.json');b=e['normalized_result'];m=evidence(P/f'address_to_file_offset-{a}.json');at=offset(int(a,16),n);assert b['complete']and b['returned_bytes']==n and bytes.fromhex(b['bytes_hex'])==raw[at:at+n]and m['normalized_result']['file_offset']==at;constants.append(dict(address='0x'+a,bytes=n,file_offset=at,evidence_id=e['evidence_id'],original_match=True));files.extend(P/x for x in[f'read_bytes-{a}.json',f'address_to_file_offset-{a}.json'])
 assert struct.unpack_from('<I',raw,offset(0x559a20,4))[0]==0x52df98
 assert struct.unpack_from('<III',raw,offset(0x52df98+36,12))==(0x4712a0,0x471420,0x471dd0)
 assert all(struct.unpack_from('<I',raw,offset(0x5415b0+i*32+28,4))[0]==0x472610 for i in range(17,27))
 assert raw[offset(0x534160,10):offset(0x534160,10)+10]==b'S|%X|%X|%X'and raw[offset(0x53459c,4):offset(0x53459c,4)+4]==b'???\0'
 derived=[]
 for name,expected in[('derived-callbacks.json',14),('derived-battle-row-callbacks.json',1),('derived-level-row-callbacks.json',1),('derived-level-reopen-callbacks.json',1),('derived-close-callbacks.json',2)]:
  d=read(P/name);assert not d['originalExecution']and not d['originalBytePatches']and len(d['entries'])==expected
  for e in d['entries']:
   count=0
   for instruction in e['instructions']:
    b=bytes.fromhex(instruction['bytesHex']);at=offset(int(instruction['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
   assert count==e['derivedBodyBytes'];derived.append(dict(entry='0x'+e['requestedEntry'],bytes=count,canonical=False,all_original_bytes_match=True))
  files.append(P/name)
 assert sum(r['bytes']for r in derived)==6651
 for n in['derived-process-receipt.json','derived-battle-row-process-receipt.json','derived-level-row-process-receipt.json','derived-level-reopen-process-receipt.json','derived-close-process-receipt.json']:
  d=read(P/n);assert d['exit_code']==0 and d['source_sha256_before']==d['source_sha256_after']==old['source']['sha256']and d['original_unchanged']and not d['original_executed']and d['canonical_REA_profile_unchanged'];files.append(P/n)
 dispatcher=R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json';d=next(e for e in read(dispatcher)['entries']if e['requestedEntry']=='004260b0');count=0
 for ins in d['instructions']:
  b=bytes.fromhex(ins['bytesHex']);at=offset(int(ins['address'],16),len(b));assert raw[at:at+len(b)]==b;count+=len(b)
 assert count==54685;files.append(dispatcher)
 commands=R/'build/analysis/game-battle-input-v1/command-callbacks-derived.json';cmd=next(e for e in read(commands)['functions']if e['entry']=='0x48a8b0');assert 'DAT_00599d94 = 2;'in cmd['pseudocode'];files.append(commands)
 assert 'DAT_00599d28'in functions['0x4f36d0']['pseudocode']and'DAT_0096ba10 = param_2;'in functions['0x45f2a0']['pseudocode']
 assert 'iVar3 * 0x49fc'in new['0x4f0290']['pseudocode']and 'for (iVar6 = 0x197;'in new['0x4f0510']['pseudocode']
 all_instructions=[i for n in['derived-level-row-callbacks.json','derived-callbacks.json']for e in read(P/n)['entries']for i in e['instructions']];assert any(i['text']=='ADD ECX,0x1b0'for i in all_instructions)
 u=read(P/'prior-record-check.json');assert u['queried_records']==48 and u['new_distinct_records']==45 and u['cumulative_after']==2338 and len(u['verified_prior_snapshot_files'])==42 and not u['missing_referenced_snapshots'];files.append(P/'prior-record-check.json')
 snapshot=read(P/'rea.snapshot.json');assert len(snapshot['evidence_bundle']['records'])==48 and set(e['evidence_id']for e in snapshot['evidence_bundle']['records'])==set(u['reused_ids']+u['new_ids'])and snapshot['binding']['analysis_profile']['digest']==profile
 closed=unwrap(read(P/'close-result.json'));assert closed['evidence_records']==48 and closed['primitive_entries']==11
 for n in['session-initial.json','session-final.json']:
  v=unwrap(read(P/n));assert not v['open']and not v['cleanup_pending']
 files.extend(P/n for n in['rea.snapshot.json','session-initial.json','session-final.json','close-result.json','queried-evidence-ids.txt'])
 functions.update(new);assert len(functions)==705;complete=P/'functions-complete.json'
 if complete.exists():assert read(complete)==functions
 else:complete.write_text(json.dumps(functions,ensure_ascii=False,separators=(',',':'))+'\n')
 files.append(complete);files=list(dict.fromkeys(files))
 out=dict(schema='moli.player-skills-source-stage197.v1',classification='fact: fixed PE instructions/mappings/pointers; derived: independently seeded callbacks and port; original runtime/native UI/current/official equivalence unverified',source=old['source'],rea='6.7.0',provider='Ghidra12.1.4',profile_digest=profile,canonical_functions_before=695,canonical_functions_after=705,new_canonical_functions=checks,checked_new_function_bytes=2175,requeried_existing_functions=1,current_snapshot_records=48,new_distinct_records=45,retained_records_before=2293,retained_record_union_after=2338,prior_snapshot_files_verified=42,reused_record_ids=u['reused_ids'],constants=constants,checked_constant_bytes=sum(r['bytes']for r in constants),derived_callbacks=derived,reverified_derived_callback_bytes=6651,reverified_command_instruction_bytes=54685,source_contract=info(A/'implementation-spec.json'),artifacts=[info(p)for p in files],session_closed=True,cleanup_pending=False,original_execution=0,VM_actions=0,official_sessions=0,limitations=['19 seeded callbacks are independent static derivations, not new canonical procedures','48-record current snapshot includes3 identical retained records and is not the whole2338-record union','Source main-list native pagination reads adjacent byte c45d4c[15]; semantic web list does not claim that unported native-window identity','Nonzero ordinary craft context, craft recipe state, special-map window edge and full other SKL/variants/RID/render/UI/game/platform/current/official acceptance remain required'],phase_complete=False,full_goal_complete=False,goal_status='active');(A/'source-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(functions=705,record_union=2338,queried=48,reused=3,new_records=45,new_function_bytes=2175,callback_bytes=6651,constants=out['checked_constant_bytes'],session_closed=True)))
if __name__=='__main__':main()
