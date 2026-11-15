#!/usr/bin/env python3
"""Revalidate completed REA dossiers and original dispatcher bytes for POS/EQU."""
from pathlib import Path
import hashlib, json, struct
A=Path(__file__).resolve().parent;R=A.parent.parent;P=R/'build/analysis/game-battle-change-v1'
def read(p):return json.loads(p.read_text())
def info(p):
 h=hashlib.sha256()
 with p.open('rb')as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return dict(path=str(p.relative_to(R)),bytes=p.stat().st_size,sha256=h.hexdigest())
def main():
 prior=read(R/'analysis/game-battle-status-v1/source-check.json');assert prior['canonical_functions_after']==679 and prior['retained_record_union_after']==2222
 for row in prior['artifacts']:assert info(R/row['path'])==row
 source=R/prior['source']['path'];assert info(source)==prior['source'];data=source.read_bytes();pe=struct.unpack_from('<I',data,60)[0];base=struct.unpack_from('<I',data,pe+52)[0];optional=struct.unpack_from('<H',data,pe+20)[0];sections=[]
 for i in range(struct.unpack_from('<H',data,pe+6)[0]):
  at=pe+24+optional+i*40;_,va,count,raw=struct.unpack_from('<IIII',data,at+8);sections.append((base+va,raw,count))
 def offset(address,length):
  for va,raw,count in sections:
   if va<=address and address+length<=va+count:return raw+address-va
  raise AssertionError('Not backed by original file')
 complete=read(R/'build/analysis/game-battle-status-v1/functions-complete.json');assert len(complete)==679
 addresses=['0x419840','0x419f60','0x433a10','0x433cd0','0x4f36d0','0x437b30','0x40a120','0x500a70','0x436930','0x434b90','0x434990','0x434a70']
 reused=[]
 for address in addresses:
  row=complete[address];p=row['procedure'];assert p['address']==address and p['body']['contains_entry'];ranges=[]
  for span in p['body']['ranges']:
   start,end=int(span['start'],16),int(span['end'],16);n=end-start+1;at=offset(start,n);ranges.append(dict(start=span['start'],end=span['end'],file_offset=at,bytes=n,original_sha256=hashlib.sha256(data[at:at+n]).hexdigest()))
  reused.append(dict(address=address,evidence_id=row['id'],body=p['body'],original_ranges=ranges))
 derived=R/'build/analysis/game-battle-runtime-v1/derived-callbacks.json';assert info(derived)==next(r for r in prior['artifacts']if r['path']==str(derived.relative_to(R)))
 entry=next(r for r in read(derived)['entries']if r['requestedEntry']=='004260b0');count=0
 for instruction in entry['instructions']:
  raw=bytes.fromhex(instruction['bytesHex']);at=offset(int(instruction['address'],16),len(raw));assert data[at:at+len(raw)]==raw;count+=len(raw)
 assert count==54685
 baseline=read(P/'baseline-reface.json');assert baseline['reproduced']and baseline['actualAngle']!=baseline['expectedRestoredAngle']and baseline['actualSourceCommands']and baseline['realResourceCatalog']
 out=dict(schema='moli.battle-change-source-stage193.v1',classification='fact: retained immutable REA dossiers and independently derived dispatcher plus actual original-fixture baseline; ownership adapter is derived',source=prior['source'],rea='6.7.0',provider='Ghidra12.1.4',reused_canonical_function_union=679,reused_retained_record_union=2222,new_native_queries=0,reused_dossiers=reused,derived_dispatcher=dict(entry='0x4260b0',cases=[4,6,9],original_instruction_bytes=count,all_original_bytes_match=True),source_contract=info(A/'implementation-spec.json'),source_evidence=[info(R/'analysis/game-battle-status-v1/source-check.json'),info(R/'analysis/game-battle-commands-v1/source-check.json')],artifacts=[info(R/'build/analysis/game-battle-status-v1/functions-complete.json'),info(derived),info(P/'baseline-reface.json'),info(P/'reproduce-reface.mjs')],baseline=baseline,no_target_opened_in_stage193=True,last_known_REA_closure='stage192 saved valid snapshot and closed its owned session; no new session is claimed',original_execution=0,VM_actions=0,official_sessions=0,limitations=['Static and independent reconstruction evidence is distinct from original runtime equivalence','Full linked/ride/type32/scale/other character changes, native UI and whole-app scheduling remain in the original goal','Independent local TCP/product evidence does not imply physical device/current/official acceptance'],phase_complete=False,full_goal_complete=False,goal_status='active')
 (A/'source-check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(reused_functions=679,reused_dossiers=len(reused),new_native_queries=0,original_dispatcher_bytes=count,baseline_reproduced=True)))
if __name__=='__main__':main()
