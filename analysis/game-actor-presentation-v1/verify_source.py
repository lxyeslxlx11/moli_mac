#!/usr/bin/env python3
"""Verify retained private REA evidence and original PE bytes; never runs the target."""
from pathlib import Path
from datetime import datetime,timezone
import json,hashlib,collections
R=Path(__file__).resolve().parents[2];A=R/'analysis/game-actor-presentation-v1';P=R/'build/analysis/game-actor-presentation-v1'
def put(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 source=R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';src=info(source);assert src['bytes']==1569280 and src['sha256']=='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';raw=source.read_bytes()
 x=json.load(open(P/'rea-source.json'));prior=json.load(open(R/'build/analysis/game-actor-attachment-v1/rea-source.json'));records={r['evidence_id']:r for r in x['records']};old={r['evidence_id']:r for r in prior['records']};assert len(records)==1518 and len(old)==1468 and all(records[k]==v for k,v in old.items());new=[v for k,v in records.items()if k not in old]
 compact=json.load(open(P/'functions-compact.json'));new_functions=[];known_queries=[]
 for path in sorted(P.glob('*-new.json')):
  e=json.load(open(path));assert e['evidence_id']in records and e['evidence_id']not in old;n=e['normalized_result'];address=n['procedure']['address']
  if address in compact:
   assert n['pseudocode']==compact[address]['pseudocode']and n['assembly']==compact[address]['assembly'];known_queries.append(dict(address=address,evidence_id=e['evidence_id'],prior_id=compact[address]['id'],unchanged_pseudocode_and_assembly=True,dossier=info(path)));continue
  compact[address]=dict(id=e['evidence_id'],procedure=n['procedure'],pseudocode=n['pseudocode'],assembly=n['assembly'],callees=n['callees'],callers=n['callers']);new_functions.append(dict(address=address,evidence_id=e['evidence_id'],body=n['procedure']['body'],dossier=info(path)))
 assert len(new_functions)==36 and len(compact)==488 and len(known_queries)==1
 put(P/'functions-complete.json',compact)
 # Reuse already captured canonical dossiers; no repeated native query.
 for address in['0x452e40','0x45f170','0x45f1c0','0x4ff5a0','0x4400e0']:
  hits=[r for r in prior['records']if isinstance(r.get('normalized_result'),dict)and isinstance(r['normalized_result'].get('procedure'),dict)and r['normalized_result']['procedure'].get('address')==address and isinstance(r['normalized_result'].get('pseudocode'),str)]
  assert hits;put(P/(address[2:]+'-retained.json'),hits[0])
 checks=[]
 for path in sorted(P.glob('*-bytes.json')):
  e=json.load(open(path));n=e['normalized_result'];assert n['complete'];a=int(n['address'],16);b=bytes.fromhex(n['bytes_hex']);assert len(b)==n['requested_bytes']==n['returned_bytes'];m=json.load(open(P/(path.name.replace('-bytes','-map'))));end=json.load(open(P/(f'{a+len(b)-1:x}-map.json')));offset=m['normalized_result']['file_offset'];assert end['normalized_result']['file_offset']==offset+len(b)-1 and raw[offset:offset+len(b)]==b
  checks.append(dict(evidence_id=e['evidence_id'],address=n['address'],end=f'0x{a+len(b)-1:x}',bytes=len(b),file_offset=offset,sha256=hashlib.sha256(b).hexdigest(),start_map_id=m['evidence_id'],end_map_id=end['evidence_id'],original_bytes_equal=True))
 assert len(checks)==4
 spec=json.load(open(A/'implementation-spec.json'));refs=json.load(open(P/'43d150-xrefs.json'));assert refs['normalized_result']==['0x43bfeb']
 reused=[dict(evidence_id=json.load(open(f))['evidence_id'],dossier=info(f))for f in sorted(P.glob('*-retained.json'))];assert len(reused)==35
 counts=collections.Counter(r['operation']for r in new)
 put(A/'source-check.json',dict(schema='moli.actor-presentation-source-check-stage175.v1',source=src,tool='REA6.7.0/Ghidra12.1.4',analysis_profile=spec['analysis_profile'],classification='facts from immutable static sample; independent reconstruction derived; original execution unobserved',records=len(records),new_records=len(new),new_operations=dict(counts),known_functions_before=452,known_functions_after=488,new_functions=new_functions,known_function_queries=known_queries,reused_dossiers=reused,byte_checks=checks,ordinary_hook=dict(address='0x43bfeb',target='0x43d150',xref_evidence=refs['evidence_id'],observed_incoming=['0x43bfeb'],indirect_absence_proven=False),instruction_crosschecks=[dict(address='0x43dba7',fact='primary-present branch jumps over transient creation/draw'),dict(address='0x43dd96',fact='unconditional aux0c counter dereference; null case not fabricated'),dict(address='0x43dda9',fact='signed counter comparison600 after increment'),dict(address='0x43da32',fact='variant table read precedes primary overrides'),dict(address='0x43dd88',fact='type1 queue after helper without return-code branch'),dict(address='0x43ba64',fact='raw secondary80 exits ordinary callback before43d150')],source_facts=spec['facts'],inferences=['Independent ownership frees icon children rather than reproducing unsafe native null dereferences.','Only extracted variant prefix0..15 is supported; it is not a native table-length assertion.','A known source99 write resolves its gate bit; unrelated explicit baseline context remains intact.'],unknowns=spec['unknowns'],artifacts=[info(P/'rea-source.json'),info(P/'rea-snapshot.json'),info(P/'functions-complete.json'),info(R/'build/analysis/game-legacy-actors-v1/callback-objdump.txt'),info(P/'session-closed.json')],session_closed=True,VM_actions=0,original_target_execution=0,official_sessions=0,recorded_utc=datetime.now(timezone.utc).isoformat()))
 print(json.dumps(dict(records=len(records),new_records=len(new),new_functions=len(new_functions),retained=len(reused),bytes=sum(c['bytes']for c in checks),original_bytes_equal=True,session_closed=True)))
if __name__=='__main__':main()
