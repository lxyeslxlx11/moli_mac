#!/usr/bin/env python3
"""Validate retained REA source anchors and deterministic state metadata against private PE."""
from pathlib import Path
from collections import Counter
import hashlib,importlib.util,json,struct
ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent;PRIVATE=ROOT/'build/analysis/game-legacy-scene-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd';PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(path):
    raw=path.read_bytes();return dict(path=str(path.relative_to(ROOT)),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())
def main():
    target=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=target.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];table=pe+24+struct.unpack_from('<H',raw,pe+20)[0]
    sections=[struct.unpack_from('<4I',raw,table+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
    def locate(address,length=1):
        rva=int(address,16)-base;matches=[offset+rva-start for start,size,offset in sections if start<=rva and rva+length<=start+size];assert len(matches)==1;return matches[0]
    records=json.loads((PRIVATE/'rea-final.json').read_text())['records'];old={r['evidence_id'] for r in json.loads((ROOT/'build/analysis/game-legacy-world-v1/rea-final.json').read_text())['records']}
    assert len(old)==293 and old<={r['evidence_id'] for r in records};new=[r for r in records if r['evidence_id'] not in old];checks=[];functions=[]
    for row in new:
        assert row['subject']['digest']['sha256']==SHA and row['provider']['id']=='ghidra' and row['provider']['version']=='12.1.4' and row['analysis_profile']['digest']==PROFILE
        n=row['normalized_result'];op=row['operation']
        if op in ['read_bytes','inspect_native_instruction']:
            if op=='read_bytes':assert n['complete'] and n['returned_bytes']==n['requested_bytes']
            else:assert n['status']=='decoded'
            data=bytes.fromhex(n['bytes_hex'] if op=='read_bytes' else n['bytes']);offset=locate(n['address'],len(data));assert raw[offset:offset+len(data)]==data
            checks.append(dict(id=row['evidence_id'],operation=op,address=n['address'],offset=offset,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),matched=True))
        elif op=='address_to_file_offset':
            assert n['file_offset']==locate(n['address']);checks.append(dict(id=row['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
        elif op=='analyze_function':functions.append(dict(id=row['evidence_id'],entry=n['procedure']['address'],body=n['procedure']['body'],assembly_rows=len(n['assembly']),pseudocode_characters=len(n['pseudocode']),value_flow_truncated=bool((n.get('native_value_flow') or {}).get('truncated',False))))
    assert len(records)==340 and len(new)==47 and len(functions)==len({r['entry'] for r in functions})==17
    assert Counter(r['operation'] for r in new)==dict(analyze_function=17,inspect_native_instruction=17,read_bytes=7,address_to_file_offset=6)
    assert raw[locate('0x56bd40',8):locate('0x56bd40',8)+8]==b'\nn,c|z\\y'
    assert raw[locate('0x53d900',4):locate('0x53d900',4)+4]==b'MAP\0'
    assert raw[locate('0x53459c',4):locate('0x53459c',4)+4]==b'???\0'
    assert struct.unpack_from('<I',raw,locate('0x57f530',4))[0]==0x57f53a and struct.unpack_from('<I',raw,locate('0x57f73c',4))[0]==1
    ctype=struct.unpack_from('<256H',raw,locate('0x57f53a',512));spaces=[i for i,v in enumerate(ctype) if v&8];digits=[i for i,v in enumerate(ctype) if v&4]
    assert spaces==[9,10,11,12,13,32] and digits==list(range(48,58))
    spec=importlib.util.spec_from_file_location('scene_catalog_extractor',HERE/'extract_catalog.py');extractor=importlib.util.module_from_spec(spec);spec.loader.exec_module(extractor)
    catalog=extractor.extract();assert catalog==json.loads((HERE/'state-catalog.json').read_text())
    product_path=ROOT/'shared/legacy-game-state-catalog.mjs';product_match=product_path.is_file() and product_path.read_text()==extractor.product(catalog)
    result=dict(schema='moli.legacy-scene-source-stage156.v1',source=info(target),tools=dict(rea='6.7.0',ghidra='12.1.4',analysis_profile=PROFILE),artifacts=[info(PRIVATE/'rea-final.json'),info(PRIVATE/'rea-snapshot.json')],
      restored_records=293,total_records=340,new_records=47,new_operations=dict(Counter(r['operation'] for r in new)),functions=functions,byte_and_mapping_checks=checks,
      inner_escape_pairs=4,default_label_bytes=3,default_C_ctype=dict(table_words=256,whitespace_bytes=spaces,digit_bytes=digits,initial_locale_width=1,runtime_locale_changes='unverified'),
      state_catalog_regeneration_match=True,state_record_fields=[30,18],product_catalog_match=product_match,
      session_closed=True,target_execution=False,real_credentials_or_sessions=False,
      facts=['4ef870 ->45f530/45f760 prepares MAP01 header[wire6,wire7,width,height] and zero body; identityA2 forces rewrite, identityB0 skips preparation.',
       '45f2a0 ->4649b0 carries wire8 directly to957e88 (checksum mode), wire10 as resource selector; no higher mode enumeration assigned.',
       '4efad0/4f0000 select ordered30/18 fields with bit0-all masks; missing numeric fields are-1, default-C decimal wraps32bits; one nonpositive value becomes100.',
       '4ef9d0 whole-inner-unescape then first-token-inner-unescape; source fallback3questionmarks and nonnegative second decimal or-1.'],
      limitations=['Source slots are not assigned HP/MP/attribute names; original wrapped-storage and actor+0x284 copies are not emulated.',
       'Scene/native guard/UI/viewport/rendering and cache filesystem/path ownership remain unmodeled.',
       'Legacy37c4 only; current9baa/6e2ff, full auth/gameplay and actual native/official acceptance remain unverified.'])
    (HERE/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(records=340,new_records=47,functions=17,source_checks=30,state_fields=48,default_ctype_matched=True,product_catalog_match=product_match)))
if __name__=='__main__':main()
