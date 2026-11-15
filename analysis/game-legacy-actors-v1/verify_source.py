#!/usr/bin/env python3
"""Bind retained native facts, bounded callback disassembly and mathematical metadata to private PE."""
from pathlib import Path
from collections import Counter
import hashlib,importlib.util,json,struct
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent;PRIVATE=ROOT/'build/analysis/game-legacy-actors-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(path):
    raw=path.read_bytes();return dict(path=str(path.relative_to(ROOT)),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())
def module(name,path):
    spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def main():
    target=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=target.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];table=pe+24+struct.unpack_from('<H',raw,pe+20)[0]
    sections=[struct.unpack_from('<4I',raw,table+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
    def locate(address,length=1):
        rva=int(address,16)-base;matches=[offset+rva-start for start,size,offset in sections if start<=rva and rva+length<=start+size];assert len(matches)==1;return matches[0]
    records=json.loads((PRIVATE/'rea-final.json').read_text())['records'];old={r['evidence_id'] for r in json.loads((ROOT/'build/analysis/game-legacy-scene-v1/rea-final.json').read_text())['records']}
    assert len(old)==340 and old<={r['evidence_id'] for r in records};new=[r for r in records if r['evidence_id'] not in old];checks=[];functions=[];data_refs=[]
    for row in new:
        assert row['subject']['digest']['sha256']==SHA and row['provider']['id']=='ghidra' and row['provider']['version']=='12.1.4' and row['analysis_profile']['digest']==PROFILE
        n=row['normalized_result'];op=row['operation']
        if op in ['read_bytes','inspect_native_instruction']:
            if op=='read_bytes':assert n['complete'] and n['returned_bytes']==n['requested_bytes']
            elif n['status']=='data':data_refs.append(dict(id=row['evidence_id'],address=n['address'],writes=[r for r in n['incoming_references'] if r.get('write')]));continue
            else:assert n['status']=='decoded'
            data=bytes.fromhex(n['bytes_hex'] if op=='read_bytes' else n['bytes']);offset=locate(n['address'],len(data));assert raw[offset:offset+len(data)]==data
            checks.append(dict(id=row['evidence_id'],operation=op,address=n['address'],offset=offset,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),matched=True))
        elif op=='address_to_file_offset':
            assert n['file_offset']==locate(n['address']);checks.append(dict(id=row['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
        elif op=='analyze_function':functions.append(dict(id=row['evidence_id'],requested=row['parameters']['procedure'],entry=n['procedure']['address'],body=n['procedure']['body'],assembly_rows=len(n['assembly']),pseudocode_characters=len(n['pseudocode']),value_flow_truncated=bool((n.get('native_value_flow') or {}).get('truncated',False))))
    assert len(records)==449 and len(new)==109
    assert Counter(r['operation'] for r in new)==dict(analyze_function=48,inspect_native_instruction=37,read_bytes=13,address_to_file_offset=8,resolve_containing_procedure=3)
    assert len(functions)==48 and len({f['entry'] for f in functions})==47 and len(data_refs)==2 and len(checks)==56
    callback=module('verify_actor_callback',HERE/'verify_callback.py').verify(raw,locate)
    extractor=module('actor_catalog_extractor',HERE/'extract_catalog.py');catalog=extractor.extract();assert catalog==json.loads((HERE/'actor-catalog.json').read_text())
    product=ROOT/'shared/legacy-game-actor-data.mjs';product_match=product.is_file() and product.read_text()==extractor.product(catalog)
    directions=catalog['math']['direction_table'];assert len(directions)==65 and directions[0]==0 and directions[-1]==45
    for field,value in [('speed_scale',0.01),('step_scale',4),('inverse_grid',1/64)]:assert abs(catalog['math'][field]-value)<1e-8
    result=dict(schema='moli.legacy-actors-source-stage157.v1',source=info(target),tools=dict(rea='6.7.0',ghidra='12.1.4',analysis_profile=PROFILE,GNU_objdump='2.47.20260726'),
      artifacts=[info(PRIVATE/'rea-final.json'),info(PRIVATE/'rea-snapshot.json')],restored_records=340,total_records=449,new_records=109,new_operations=dict(Counter(r['operation'] for r in new)),
      function_dossiers=48,unique_function_entries=47,functions=functions,byte_and_mapping_checks=checks,typed_data_references=data_refs,callback=callback,
      catalog_regeneration_match=True,product_catalog_match=product_match,direction_table_values=65,session_closed=True,target_execution=False,real_credentials_or_sessions=False,
      corrections=['An interior selector4ff560 returned already analyzed4ff510; actual owned-ID setter was provider-resolved4ff570 and then analyzed. Count48dossiers/47unique entries.',
       'Actor callback43ba10 has decoded bytes but no Ghidra function; existing local GNU range plus REA bytes/CFG supplement it, without analyzer mutations or target execution.',
       'Large stack probes distort4f16d0/4f2010 signatures; cdecl push/ESP ledger is authority. Action column4 precedes facing column5.',
       '43c360 recovered float pointer/speed parameters are decompiler artifacts: raw pointer and FILD speed, source float32 spill points are authority.',
       'Direction uses65rounded degree-table entries and interpolation, not direct atan2. Native x87 bit-for-bit and host timing remain unverified.'],
      limitations=['Compound party/ride/attachment actions, collision/pathfinding, native scene gates, renderer/resource availability and local prediction are not fully modeled.',
       'Resource mode is explicit caller context; do not infer it from an account or current version.',
       'Legacy37c4 only; current9baa/6e2ff/full auth/actual platform/official gameplay incomplete.'])
    (HERE/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(new_records=109,dossiers=48,unique_functions=47,byte_checks=56,callback_instructions=callback['instructions_checked'],callback_reachable=callback['reachable_instructions'],catalog_match=product_match)))
if __name__=='__main__':main()
