#!/usr/bin/env python3
"""Verify retained immutable native evidence, source anchors and navigation metadata."""
from pathlib import Path
from collections import Counter
import hashlib,json,struct
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent;PRIVATE=ROOT/'build/analysis/game-legacy-local-movement-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(path):
    raw=path.read_bytes();return dict(path=str(path.relative_to(ROOT)),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())
def main():
    target=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=target.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];table=pe+24+struct.unpack_from('<H',raw,pe+20)[0]
    sections=[struct.unpack_from('<4I',raw,table+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
    def locate(address,length=1):
        rva=int(address,16)-base;found=[offset+rva-start for start,size,offset in sections if start<=rva and rva+length<=start+size];assert len(found)==1;return found[0]
    records=json.loads((PRIVATE/'rea-final.json').read_text())['records'];prior={r['evidence_id']:r for r in json.loads((ROOT/'build/analysis/game-legacy-actors-v1/rea-final.json').read_text())['records']};current={r['evidence_id']:r for r in records}
    assert len(prior)==449 and all(current.get(k)==v for k,v in prior.items());new=[r for r in records if r['evidence_id'] not in prior];checks=[];functions=[];references=[]
    for r in new:
        assert r['subject']['digest']['sha256']==SHA and r['provider']['id']=='ghidra' and r['provider']['version']=='12.1.4' and r['analysis_profile']['digest']==PROFILE
        n=r['normalized_result'];op=r['operation']
        if op=='inspect_native_instruction' and n['status']!='decoded':
            assert n['status'] in ['data','undecodable'] and n['incoming_references'];references.append(dict(id=r['evidence_id'],address=n['address'],status=n['status'],incoming=n['incoming_references']));continue
        if op in ['read_bytes','inspect_native_instruction']:
            if op=='read_bytes':assert n['complete'] and n['requested_bytes']==n['returned_bytes']
            else:assert n['status']=='decoded'
            selected=bytes.fromhex(n['bytes_hex'] if op=='read_bytes' else n['bytes']);offset=locate(n['address'],len(selected));assert raw[offset:offset+len(selected)]==selected
            checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=offset,bytes=len(selected),sha256=hashlib.sha256(selected).hexdigest(),matched=True))
        elif op=='address_to_file_offset':
            assert n['file_offset']==locate(n['address']);checks.append(dict(id=r['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
        elif op=='analyze_function':functions.append(dict(id=r['evidence_id'],entry=n['procedure']['address'],body=n['procedure']['body'],assembly_rows=len(n['assembly']),pseudocode_characters=len(n['pseudocode']),value_flow_truncated=bool((n.get('native_value_flow') or {}).get('truncated',False))))
    operations=Counter(r['operation'] for r in new);assert len(records)==566 and len(new)==117
    assert operations==dict(analyze_function=52,inspect_native_instruction=57,resolve_containing_procedure=6,read_bytes=1,address_to_file_offset=1)
    assert len(functions)==len({f['entry'] for f in functions})==52 and len(checks)==54 and len(references)==5
    read=next(r for r in new if r['operation']=='read_bytes');directions=[list(p) for p in zip(*[iter(struct.unpack('<16h',bytes.fromhex(read['normalized_result']['bytes_hex']))) ]*2)]
    expected=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];assert directions==expected
    metadata=dict(schema='moli.legacy-navigation-metadata-stage158.v1',source_sha256=SHA,directions=directions,directions_address='0x53d4d4',
        viewport=dict(offsets=[-30,-20,21,31],maximum_cells=2601),path=dict(capacity=100,candidate_offsets=[0,1,-1],batch_steps=2),
        graphic=dict(file_record_bytes=40,runtime_record_bytes=32,capacity=850000,maximum_groups=7,file_footprint_offsets=[28,29],file_collision_flags_offset=30,file_resource_id_offset=36,collision_class_modulus=100,
            primitive_split=20000,primitive_offset=200000,conditional_overrides=[[0x3bd30,0x9999d],[0x3bd3a,0x9999e],[0x3bd44,0x9999f],[0x3bea2,0x999a0]]),
        collision=dict(mode1_block_mask=256,mode0_zero_ground_block_mask=16384,blocking_primitive_classes=[2,5,6,9,10],override_primitive_class=4),turn=dict(byte_offset=65,minimum_interval_exclusive=500),
        outgoing=[dict(id='send-004f6470',scope='origin x,y + lowercase direction bytes + scene field11'),dict(id='send-004f6610',scope='identity pair + missing-cache rectangle'),dict(id='send-004f6530',scope='tile event code,sequence,x,y,direction')])
    catalog=HERE/'navigation-catalog.json'
    if catalog.exists():assert json.loads(catalog.read_text())==metadata
    else:catalog.write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
    result=dict(schema='moli.legacy-local-movement-source-stage158.v1',source=info(target),tools=dict(rea='6.7.0',ghidra='12.1.4',analysis_profile=PROFILE),artifacts=[info(PRIVATE/'rea-final.json'),info(PRIVATE/'rea-snapshot.json')],restored_records=449,total_records=566,new_records=117,new_operations=dict(operations),function_dossiers=52,unique_function_entries=52,functions=functions,byte_and_mapping_checks=checks,typed_or_undecodable_data_references=references,direction_values=8,metadata_regeneration_match=True,session_closed=True,target_execution=False,real_credentials_or_sessions=False,
        source_corrections=['403370 compares wrapped value > argument, not less-than; caller arithmetic results in the unused lookahead prelude are not coordinate assignments. Wrapped getter/storage internals are not emulated.',
            '40B file GraphicInfo is converted to32B runtime metadata; collision fields28/29/30 and map resourceID36 come from fread stack/member stores, not existing opaque field guesses.',
            '462650 native path is directional candidate/merge/fallback, not A*. Outer count100 clears pending path; fallback arrays have no original bound and require independent rejection beyond capacity.',
            'Path/current-window signed shorts and source float stores are explicit; native wrapped byte encoding and x87 bit identity are not emulated.',
            '463ea0 full renderer value flow is truncated; only directly observed collision preparation/wait-reset call chain used. Rendering remains incomplete.'],
        limitations=['Native party/follower/ride/attachments/UI/input lifecycle and arrival countdown effects are not completely modeled.','Dynamic input/action gates and tile-selector source fields require explicit caller context; do not infer authentication or player state.','Full rendering/battle/remaining consumers, current9baa/6e2ff comparison, actual platform and official playable acceptance remain incomplete.'])
    (HERE/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(new_records=117,function_dossiers=52,source_checks=54,data_reference_sites=5,directions=8)))
if __name__=='__main__':main()
