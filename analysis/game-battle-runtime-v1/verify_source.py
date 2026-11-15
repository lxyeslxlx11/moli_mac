#!/usr/bin/env python3
"""Verify original bytes, immutable REA records and separately derived callbacks."""
from pathlib import Path
from datetime import datetime,timezone
import collections,hashlib,json,re,struct
R=Path(__file__).resolve().parents[2];A=R/'analysis/game-battle-runtime-v1';P=R/'build/analysis/game-battle-runtime-v1'
def read(p):return json.loads(p.read_text())
def info(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R))if p.is_relative_to(R)else str(p),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=source.read_bytes();sha='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';profile='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb';assert len(raw)==1569280 and hashlib.sha256(raw).hexdigest()==sha
 current=read(P/'rea-final.json');old=read(R/'build/analysis/game-battle-transition-v1/rea-final.json');records={r['evidence_id']:r for r in current['records']};prior={r['evidence_id']:r for r in old['records']};assert all(records[k]==v for k,v in prior.items());new=[r for k,r in records.items()if k not in prior];assert len(prior)==1681 and len(records)==1729 and len(new)==48
 counts=collections.Counter(r['operation']for r in new);assert counts==dict(analyze_function=24,read_bytes=9,address_to_file_offset=15)
 before=read(P/'functions-before.json');after=read(P/'functions-complete.json');assert len(before)==551 and len(after)==575;functions=[]
 for r in new:
  assert r['subject']['digest']['sha256']==sha and r['analysis_profile']['digest']==profile
  if r['operation']=='analyze_function':
   n=r['normalized_result'];a=n['procedure']['address'];assert a not in before and after[a]['id']==r['evidence_id'];functions.append(dict(address=a,evidence_id=r['evidence_id'],body=n['procedure']['body'],native_value_flow_truncated=bool(n.get('native_value_flow',{}).get('truncated')),dossier=info(P/(a[2:]+'-new.json'))))
 pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];start=pe+24+struct.unpack_from('<H',raw,pe+20)[0];sections=[struct.unpack_from('<4I',raw,start+40*i+8)for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
 def offset(address):
  rva=int(address,16)-base
  for vs,va,rs,rp in sections:
   if va<=rva<va+min(vs,rs):return rp+rva-va
  raise AssertionError(address)
 maps={r['normalized_result']['address']:r for r in records.values()if r['operation']=='address_to_file_offset'and r['subject']['digest']['sha256']==sha};checks=[]
 for r in new:
  if r['operation']!='read_bytes':continue
  n=r['normalized_result'];b=bytes.fromhex(n['bytes_hex']);a=n['address'];end=hex(int(a,16)+len(b)-1);off=offset(a);assert n['complete']and n['returned_bytes']==n['requested_bytes']==len(b);assert maps[a]['normalized_result']['file_offset']==off and maps[end]['normalized_result']['file_offset']==off+len(b)-1 and raw[off:off+len(b)]==b;checks.append(dict(address=a,end=end,file_offset=off,bytes=len(b),evidence_id=r['evidence_id'],sha256=hashlib.sha256(b).hexdigest(),original_bytes_equal=True))
 assert len(checks)==9 and sum(r['bytes']for r in checks)==1944
 tables=read(A/'source-tables.json');reads={r['normalized_result']['address']:r for r in new if r['operation']=='read_bytes'};tb=bytes.fromhex(reads['0x533e54']['normalized_result']['bytes_hex']);sb=bytes.fromhex(reads['0x534074']['normalized_result']['bytes_hex']);ab=bytes.fromhex(reads['0x533eb4']['normalized_result']['bytes_hex']);tokens=[]
 for i,address in enumerate(struct.unpack('<24I',tb)):
  at=address-0x534074;assert sb[at+3]==0;tokens.append(dict(index=i,address=hex(address),token=sb[at:at+3].decode('ascii')))
 aliases=[list(struct.unpack_from('<2i',ab,4+8*i))for i in range(55)];assert tables['tokens']==tokens and tables['aliases']==aliases
 expected='/** Fixed37c4 numeric aliases and literal protocol tokens; no assets or executable code. */\nexport const BATTLE_MOTION_TOKENS=Object.freeze('+json.dumps([r['token']for r in tokens],separators=(',',':'))+');\nexport const BATTLE_MOTION_ALIASES=Object.freeze('+json.dumps(aliases,separators=(',',':'))+'.map(Object.freeze));\n';assert(R/'shared/legacy-game-battle-motion-data.mjs').read_text()==expected
 derived=read(P/'derived-callbacks.json');process=read(P/'derived-process-2-receipt.json');assert process['exit_code']==0 and process['original_unchanged']and process['source_sha256_before']==process['source_sha256_after']==sha and not process['original_executed'];derived_checks=[]
 assert not derived['originalExecution']and not derived['originalBytePatches']and derived['language']=='x86:LE:32:default'
 for row in derived['entries']:
  total=0;data=bytearray()
  for instruction in row['instructions']:
   off=offset(instruction['address']);b=bytes.fromhex(instruction['bytesHex']);assert raw[off:off+len(b)]==b;total+=len(b);data.extend(b)
  assert total==row['derivedBodyBytes']and row['decompileCompleted']
  derived_checks.append(dict(entry=row['requestedEntry'],body=row['derivedBody'],body_bytes=row['derivedBodyBytes'],instructions=len(row['instructions']),instruction_bytes=total,all_instruction_bytes_equal_original=True,instruction_sha256=hashlib.sha256(data).hexdigest(),default_function_existed=row['functionExistedBeforeSeed'],analyst_seeded_boundary=True,canonical_REA_dossier=False))
 assert [r['body_bytes']for r in derived_checks]==[682,54685,96,28]and sum(r['instruction_bytes']for r in derived_checks)==55491
 assert 'LAB_004365d0'in before['0x433b30']['pseudocode']and 'LAB_004260b0'in after['0x436880']['pseudocode']and 'LAB_004198d0'in before['0x419930']['pseudocode']
 dis=(P/'435000-llvm-disassembly.txt').read_text();instructions=[];branches=[]
 for line in dis.splitlines():
  m=re.match(r'^\s*([0-9a-f]+):\s+((?:[0-9a-f]{2}\s+)+)\s*(\S.*)$',line)
  if not m:continue
  address=int(m[1],16);b=bytes.fromhex(m[2]);assert raw[offset(hex(address)):offset(hex(address))+len(b)]==b;instructions.append((address,b))
  text=m[3];kind=text.split()[0]
  if kind.startswith('j')or kind.startswith('loop'):
   branch=re.search(r'\b0x([0-9a-f]+)',text);assert branch,text;branches.append(int(branch[1],16))
 assert instructions[0][0]==0x435000 and instructions[-1][0]+len(instructions[-1][1])==0x4351cd
 assert all(a+len(b)==c for(a,b),(c,_)in zip(instructions,instructions[1:]))and sum(len(b)for _,b in instructions)==461 and all(a in {a for a,_ in instructions}for a in branches)
 reused=[]
 for p in sorted(P.glob('*-retained.json')):
  r=read(p);assert prior[r['evidence_id']]==r;reused.append(dict(evidence_id=r['evidence_id'],dossier=info(p)))
 assert len(reused)==18
 closed=read(P/'session-closed.json')['structuredContent']['result'];state=read(P/'final-session-status.json');assert closed['evidence_records']==1729 and closed['bytes']==478576202 and not state['open']and not state['cleanup_pending']
 spec=read(A/'implementation-spec.json');out=dict(schema='moli.battle-motion-source-stage181.v1',source=info(source),tool=spec['tool'],analysis_profile=profile,records=1729,new_records=48,new_operations=dict(counts),known_functions_before=551,known_functions_after=575,new_functions=functions,reused_dossiers=reused,known_function_queries=[],byte_checks=checks,source_tables=info(A/'source-tables.json'),derived_callback_checks=derived_checks,derived_instruction_bytes=55491,derived_authority='separate analyst-seeded static Ghidra export; boundaries are inferred, instruction bytes are independently bound to original PE; not canonical REA function dossiers',partial_helper=dict(address='0x435000',canonical_body_bytes=28,seeded_default_body_bytes=28,source_llvm_range_bytes=461,bounded_range_noncall_CFG_closed=True,range='435000..4351cc inclusive',instructions=len(instructions),complete_provider_body_repair=False,disassembly=info(P/'435000-llvm-disassembly.txt')),facts=spec['facts'],unknowns=spec['unknowns'],artifacts=[info(P/n)for n in ['rea-final.json','rea-snapshot.json','functions-complete.json','session-closed.json','final-session-status.json','derived-callbacks.json','derived-byte-checks.json','derived-process-receipt.json','derived-process-2-receipt.json','comparator-procedure-unavailable.json','action-procedure-unavailable.json']]+[info(R/'tools/ghidra/MoliExportCallbacks.java'),info(Path('/opt/homebrew/lib/node_modules/rea-agents/bridge/ghidra/ReaGhidraNoReturnFix.java'))],session_closed=True,VM_actions=0,original_execution=0,official_sessions=0,phase_complete=False,goal_status='active',full_goal_complete=False,recorded_utc=datetime.now(timezone.utc).isoformat());(A/'source-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(records=1729,new_records=48,new_functions=24,reused=18,source_bytes_verified=1944,derived_instruction_bytes=55491,canonical_partial_helper_bytes=28,LLVM_helper_range_bytes=461,closed=True,phase_complete=False)))
if __name__=='__main__':main()
