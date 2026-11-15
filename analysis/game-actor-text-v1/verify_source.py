#!/usr/bin/env python3
"""Verify immutable private REA records and original PE bytes; never executes the source artifact."""
from pathlib import Path
from datetime import datetime,timezone
import json,hashlib,collections,struct
R=Path(__file__).resolve().parents[2];A=R/'analysis/game-actor-text-v1';P=R/'build/analysis/game-actor-text-v1'
def put(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def info(p):
 b=p.read_bytes();return dict(path=str(p.relative_to(R)),bytes=len(b),sha256=hashlib.sha256(b).hexdigest())
def main():
 src=info(R/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe');assert src['bytes']==1569280 and src['sha256']=='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';raw=(R/src['path']).read_bytes()
 x=json.load(open(P/'rea-source.json'));prior=json.load(open(R/'build/analysis/game-actor-presentation-v1/rea-source.json'));records={r['evidence_id']:r for r in x['records']};old={r['evidence_id']:r for r in prior['records']};assert len(records)==1550 and len(old)==1518 and all(records[k]==v for k,v in old.items());new=[v for k,v in records.items()if k not in old]
 compact=json.load(open(P/'functions-compact.json'));assert len(compact)==488;new_functions=[];known=[]
 for path in sorted(P.glob('*-new.json')):
  e=json.load(open(path));assert e['evidence_id']in records and e['evidence_id']not in old;n=e['normalized_result'];address=n['procedure']['address']
  if address in compact:
   assert n['pseudocode']==compact[address]['pseudocode']and n['assembly']==compact[address]['assembly'];known.append(dict(address=address,evidence_id=e['evidence_id'],prior_id=compact[address]['id'],unchanged_pseudocode_and_assembly=True,dossier=info(path)));continue
  compact[address]=dict(id=e['evidence_id'],procedure=n['procedure'],pseudocode=n['pseudocode'],assembly=n['assembly'],callees=n['callees'],callers=n['callers']);new_functions.append(dict(address=address,evidence_id=e['evidence_id'],body=n['procedure']['body'],dossier=info(path)))
 assert len(new_functions)==11 and len(compact)==499 and len(known)==1 and known[0]['address']=='0x505840';put(P/'functions-complete.json',compact)
 for address in['0x44fb60','0x506030','0x4efad0','0x438a30']:
  e=old[compact[address]['id']];assert e['normalized_result']['pseudocode']==compact[address]['pseudocode'];put(P/(address[2:]+'-retained.json'),e)
 checks=[]
 for path in sorted(P.glob('*-bytes.json')):
  e=json.load(open(path));n=e['normalized_result'];assert n['complete'];a=int(n['address'],16);b=bytes.fromhex(n['bytes_hex']);assert len(b)==n['requested_bytes']==n['returned_bytes'];m=json.load(open(P/(path.name.replace('-bytes','-map'))));end=json.load(open(P/(f'{a+len(b)-1:x}-map.json')));offset=m['normalized_result']['file_offset'];assert end['normalized_result']['file_offset']==offset+len(b)-1 and raw[offset:offset+len(b)]==b
  checks.append(dict(evidence_id=e['evidence_id'],address=n['address'],end=f'0x{a+len(b)-1:x}',bytes=len(b),file_offset=offset,sha256=hashlib.sha256(b).hexdigest(),new_record=e['evidence_id']not in old,start_map_id=m['evidence_id'],end_map_id=end['evidence_id'],original_bytes_equal=True))
 assert len(checks)==3 and sum(c['bytes']for c in checks)==1163;assert sum(c['new_record']for c in checks)==2
 t=json.load(open(A/'source-tables.json'));b=bytes.fromhex(json.load(open(P/'5388a8-bytes.json'))['normalized_result']['bytes_hex']);base=0x5388a8
 for row in t['font_struct']['rows']:
  at=int(row['address'],16)-base;values=struct.unpack_from('<6I',b,at);assert list(values)==[row[k]for k in['handle_initial','single_width','single_height','double_width','double_height','descriptor_word']]
 assert list(struct.unpack_from('<6I',b,0x5388f0-base))==t['draw_priorities']['values'];assert[list(b[0x538a58-base+i*3:0x538a58-base+(i+1)*3])for i in range(12)]==t['colors']['RGB'];assert b[0x538a7c-base:0x538a80-base].hex()==t['face_name']['bytes_hex'];assert bytes.fromhex(json.load(open(P/'534598-bytes.json'))['normalized_result']['bytes_hex'])==b'%s\0\0???\0'
 reused=[dict(evidence_id=json.load(open(f))['evidence_id'],dossier=info(f))for f in sorted(P.glob('*-retained.json'))];assert len(reused)==15
 counts=collections.Counter(r['operation']for r in new);assert counts==dict(analyze_function=12,resolve_containing_procedure=8,address_to_file_offset=6,xrefs=4,read_bytes=2)
 spec=json.load(open(A/'implementation-spec.json'));refs={}
 for path in sorted(P.glob('*-xrefs.json')):
  e=json.load(open(path));assert e['evidence_id']in records;refs[path.stem]=dict(evidence_id=e['evidence_id'],observed=e['normalized_result'])
 closed=json.load(open(P/'session-closed.json'))['structuredContent']['result'];assert closed['evidence_records']==1550 and closed['bytes']==364943731 and closed['primitive_entries']==502 and closed['workflow_entries']==3
 put(A/'source-check.json',dict(schema='moli.actor-text-source-check-stage176.v1',source=src,tool='REA6.7.0/Ghidra12.1.4',analysis_profile=spec['analysis_profile'],classification='facts from immutable static sample; glyph/RGBA and ownership reconstruction derived; target execution unobserved',records=len(records),new_records=len(new),new_operations=dict(counts),known_functions_before=488,known_functions_after=499,new_functions=new_functions,known_function_queries=known,reused_dossiers=reused,byte_checks=checks,byte_reuse='534598 cached8-byte read; all6 endpoint maps are new; total3ranges1163bytes',xrefs=refs,tables_verified=dict(font_records=14,font_record_bytes=24,color_records=12,color_record_bytes=3,lane_priorities=6,face_name_bytes='cbcecce5',format_bytes='257300003f3f3f00'),ordinary_hook=dict(target='0x43d150',prior_xref_evidence='build/analysis/game-actor-presentation-v1/43d150-xrefs.json',observed_incoming=['0x43bfeb'],indirect_absence_proven=False),source_facts=spec['facts'],inferences=['The explicit host raster port reconstructs source selection/queue/order with synthetic or installed host glyphs; it does not establish native GDI pixel equality.','Independent code rejects unsafe19-byte catalog overflows and dangling byte pairs instead of emulating arbitrary native memory access.','UI initial label mode0 is an independent local choice; no persisted native default or wire text encoding is inferred.'],unknowns=spec['unknowns'],artifacts=[info(P/'rea-source.json'),info(P/'rea-snapshot.json'),info(P/'functions-complete.json'),info(P/'session-closed.json')],session_closed=True,VM_actions=0,original_target_execution=0,official_sessions=0,recorded_utc=datetime.now(timezone.utc).isoformat()))
 print(json.dumps(dict(records=len(records),new_records=len(new),new_functions=len(new_functions),known_queries=len(known),retained=len(reused),bytes=sum(c['bytes']for c in checks),original_bytes_equal=True,session_closed=True)))
if __name__=='__main__':main()
