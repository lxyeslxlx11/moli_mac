#!/usr/bin/env python3
"""Validate exact source bytes and regenerate only metadata for a catalog equality check."""
from pathlib import Path
from collections import Counter
import hashlib
import importlib.util
import json
import re
import struct

ROOT=Path(__file__).resolve().parents[2];HERE=Path(__file__).resolve().parent;PRIVATE=ROOT/'build/analysis/game-legacy-message-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(path):
    raw=path.read_bytes();return dict(path=str(path.relative_to(ROOT)),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())
def main():
    target=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=target.read_bytes();assert hashlib.sha256(raw).hexdigest()==SHA
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0];count=struct.unpack_from('<H',raw,pe+6)[0];optional=struct.unpack_from('<H',raw,pe+20)[0]
    table=pe+24+optional;sections=[struct.unpack_from('<4I',raw,table+i*40+8)[1:] for i in range(count)]
    def locate(address,length=1):
        rva=int(address,16)-base;matches=[offset+rva-start for start,size,offset in sections if start<=rva and rva+length<=start+size];assert len(matches)==1;return matches[0]
    records=json.loads((PRIVATE/'rea-final.json').read_text())['records'];old={r['evidence_id'] for r in json.loads((ROOT/'build/analysis/game-legacy-transform-v1/rea-final.json').read_text())['records']}
    assert len(old)==129 and old<={r['evidence_id'] for r in records};new=[r for r in records if r['evidence_id'] not in old]
    instructions=[];reads=[];maps=[];functions=[]
    for row in new:
        assert row['subject']['digest']['sha256']==SHA and row['provider']['id']=='ghidra' and row['provider']['version']=='12.1.4' and row['analysis_profile']['digest']==PROFILE
        n=row['normalized_result'];op=row['operation']
        if op=='inspect_native_instruction':
            assert n['status']=='decoded';value=bytes.fromhex(n['bytes']);offset=locate(n['address'],len(value));assert raw[offset:offset+len(value)]==value
            instructions.append(dict(id=row['evidence_id'],address=n['address'],offset=offset,bytes=len(value),sha256=hashlib.sha256(value).hexdigest(),matched=True))
        elif op=='read_bytes':
            assert n['complete'] and n['returned_bytes']==n['requested_bytes'];value=bytes.fromhex(n['bytes_hex']);offset=locate(n['address'],len(value));assert raw[offset:offset+len(value)]==value
            reads.append(dict(id=row['evidence_id'],address=n['address'],offset=offset,bytes=len(value),sha256=hashlib.sha256(value).hexdigest(),matched=True))
        elif op=='address_to_file_offset':
            assert n['file_offset']==locate(n['address']);maps.append(dict(id=row['evidence_id'],address=n['address'],offset=n['file_offset'],matched=True))
        elif op=='analyze_function':
            functions.append(dict(id=row['evidence_id'],entry=n['procedure']['address'],requested=row['parameters'].get('procedure'),body=n['procedure']['body'],pseudocode_chars=len(n['pseudocode']),assembly_rows=len(n['assembly']),value_flow_truncated=bool((n.get('native_value_flow') or {}).get('truncated',False))))
    assert len(records)==247 and len(new)==118 and len(functions)==86 and len({r['entry'] for r in functions})==85
    assert [len(instructions),len(reads),len(maps)]==[15,11,5]
    spec=importlib.util.spec_from_file_location('catalog_extractor',HERE/'extract_catalog.py');extractor=importlib.util.module_from_spec(spec);spec.loader.exec_module(extractor)
    catalog=extractor.extract(PRIVATE/'rea-final.json');assert catalog==json.loads((HERE/'dispatch-catalog.json').read_text())
    module=(ROOT/'shared/legacy-game-catalog.mjs').read_text();embedded=json.loads(module.split('const data = ',1)[1].split(';\nfor (',1)[0])
    for direction in ['incoming','outgoing']:
        assert len(embedded[direction])==len(catalog[direction])
        for actual,expected in zip(embedded[direction],catalog[direction]):assert all(actual[key]==expected[key] for key in actual)
    tag_checks=[]
    for row in catalog['incoming']+catalog['outgoing']:
        at=locate(row['tag_address'],4);word=raw[at:at+4];assert row['tag_file_offset']==at and hashlib.sha256(word).hexdigest()==row['tag_word_sha256']
        assert word.split(b'\0')[0].decode('ascii')==row['tag'];tag_checks.append(dict(address=row['tag_address'],offset=at,matched=True))
    alphabet=b'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';assert raw[locate('0x56816c',63):locate('0x56816c',63)+63]==alphabet+b'\0'
    assert struct.unpack_from('<f',raw,locate('0x52d928',4))[0]==64.0
    assert raw[locate('0x56735c',4):locate('0x56735c',4)+4]==b'%s \0'
    payload=(ROOT/'shared/legacy-game-message.mjs').read_text();assert "const alphabet='"+alphabet.decode()+"';" in payload
    parent=next(r for r in records if r['operation']=='analyze_function' and r['normalized_result']['procedure']['address']=='0x4edef0')
    assert 'puVar6 = DAT_00567ddc' in parent['normalized_result']['pseudocode'] and '*puVar6 = 0;' in parent['normalized_result']['pseudocode']
    result=dict(schema='moli.legacy-message-source-stage154.v1',source=info(target),tools=dict(rea='6.7.0',ghidra='12.1.4',analysis_profile=PROFILE),
                artifacts=[info(PRIVATE/'rea-final.json'),info(PRIVATE/'rea-snapshot.json')],restored_records=129,total_records=247,new_records=118,new_operations=dict(Counter(r['operation'] for r in new)),
                function_dossiers=86,unique_function_entries=85,new_functions=functions,instructions=instructions,byte_reads=reads,mappings=maps,
                catalog_regeneration_match=True,product_catalog_match=True,tag_word_checks=tag_checks,source_catalog=catalog['coverage'],alphabet_match=True,position_scale=64.0,
                session_closed=True,target_execution=False,real_credentials_or_sessions=False,
                limitations=['Selector4ff680 resolved existing4ff5a0: one extra dossier record, excluded from unique function count.',
                  'Existing complete4f8a40 dossier reused locally for104branch extraction, not reanalyzed; native value-flow truncation remains.',
                  'Catalog covers recorded resolved text formatter callers/dispatch branches; computed callers and full business/control/gameplay are not established.',
                  'Position projection is source-derived intent only; native conditional actor synchronization/rendering/interpolation not reproduced.',
                  'Current9baa/6e2ff and native/official acceptance remain unverified.'])
    (HERE/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(new_records=118,dossiers=86,unique_functions=85,instructions=15,reads=11,maps=5,tag_checks=len(tag_checks),incoming=104,outgoing=60,matched=True)))

if __name__=='__main__':main()
