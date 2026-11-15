#!/usr/bin/env python3
"""Verify static source facts, fixed parameters and exact vendored library files."""
from pathlib import Path
from collections import Counter
import hashlib
import json
import re
import struct

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
PRIVATE=ROOT/'build/analysis/game-legacy-transform-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(path):
    raw=path.read_bytes();return dict(path=str(path.relative_to(ROOT)),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())

def main():
    target=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
    raw=target.read_bytes();assert len(raw)==1569280 and hashlib.sha256(raw).hexdigest()==SHA
    pe=struct.unpack_from('<I',raw,60)[0];assert raw[:2]==b'MZ' and raw[pe:pe+4]==b'PE\0\0'
    count,optional=struct.unpack_from('<H',raw,pe+6)[0],struct.unpack_from('<H',raw,pe+20)[0]
    base=struct.unpack_from('<I',raw,pe+24+28)[0];table=pe+24+optional
    assert struct.unpack_from('<H',raw,pe+24)[0]==0x10b
    sections=[struct.unpack_from('<4I',raw,table+i*40+8)[1:] for i in range(count)]
    def locate(address,length=1):
        rva=int(address,16)-base
        matches=[offset+rva-start for start,size,offset in sections if start<=rva and rva+length<=start+size]
        assert len(matches)==1;return matches[0]
    old=json.loads((ROOT/'build/analysis/game-legacy-network-v1/rea-final.json').read_text())['records']
    records=json.loads((PRIVATE/'rea-final.json').read_text())['records'];old_ids={r['evidence_id'] for r in old}
    assert len(old_ids)==86 and old_ids<={r['evidence_id'] for r in records}
    new=[r for r in records if r['evidence_id'] not in old_ids]
    instructions=[];reads=[];maps=[];functions=[];views=[]
    for row in new:
        assert row['subject']['digest']['sha256']==SHA
        n=row['normalized_result'];operation=row['operation']
        if operation=='inspect_analysis_view':views.append(dict(id=row['evidence_id'],coverage=n['coverage']));continue
        assert row['provider']['id']=='ghidra' and row['provider']['version']=='12.1.4'
        assert row['analysis_profile']['digest']==PROFILE
        if operation=='inspect_native_instruction':
            assert n['status']=='decoded';value=bytes.fromhex(n['bytes']);at=locate(n['address'],len(value));assert raw[at:at+len(value)]==value
            instructions.append(dict(id=row['evidence_id'],address=n['address'],offset=at,bytes=len(value),sha256=hashlib.sha256(value).hexdigest(),matched=True))
        elif operation=='read_bytes':
            assert n['complete'] and n['returned_bytes']==n['requested_bytes'];value=bytes.fromhex(n['bytes_hex']);at=locate(n['address'],len(value));assert raw[at:at+len(value)]==value
            reads.append(dict(id=row['evidence_id'],address=n['address'],offset=at,bytes=len(value),sha256=hashlib.sha256(value).hexdigest(),matched=True))
        elif operation=='address_to_file_offset':
            assert n['file_offset']==locate(n['address']);maps.append(dict(id=row['evidence_id'],address=n['address'],offset=n['file_offset'],matched=True))
        elif operation=='analyze_function':
            functions.append(dict(id=row['evidence_id'],entry=n['procedure']['address'],body=n['procedure']['body'],pseudocode_chars=len(n['pseudocode']),assembly_rows=len(n['assembly']),value_flow_truncated=bool((n.get('native_value_flow') or {}).get('truncated',False))))
    assert len(records)==129 and len(new)==43 and len(functions)==16 and len(instructions)==14 and len(reads)==8 and len(maps)==4
    module=(ROOT/'shared/legacy-game-payload.mjs').read_text()
    parameters=re.search(r'const derivationParameter = new Uint8Array\(\[([^\]]+)\]\);',module).group(1)
    parameter=bytes(int(x) for x in re.findall(r'\d+',parameters));assert len(parameter)==128
    assert parameter==raw[locate('0x53360c',128):locate('0x53360c',128)+128]
    permutations=struct.unpack_from('<16I',raw,locate('0x5335cc',64))
    assert list(permutations[:8])==[7,2,5,1,6,3,0,4] and list(permutations[8:])==[6,3,1,5,7,2,4,0]
    for name,values in [('encodePermutation',permutations[:8]),('decodePermutation',permutations[8:])]:
        observed=re.search(name+r': Object.freeze\(\[([^\]]+)\]\)',module).group(1)
        assert tuple(int(x) for x in re.findall(r'\d+',observed))==values
    deps=[]
    for name in ['hashes','ciphers']:
        directory=ROOT/'shared/vendor'/('noble-'+name)/'2.4.0';p=json.loads((directory/'provenance.json').read_text());assert p['license']=='MIT'
        for row in p['files']:
            actual=info(directory/row['path']);actual['path']=row['path'];assert actual==row
        deps.append(dict(package=p['package'],version=p['version'],license=p['license'],files_verified=len(p['files']),provenance=info(directory/'provenance.json')))
    noble=(ROOT/'shared/vendor/noble-hashes/2.4.0/sha2.js').read_text().split('const SHA256_K =')[1].split(']);',1)[0]
    expected=[int(x,16) for x in re.findall(r'0x[0-9a-f]+',noble)]
    sha=next(r for r in new if r['operation']=='analyze_function' and r['normalized_result']['procedure']['address']=='0x405a90')
    pseudo=sha['normalized_result']['pseudocode'];observed=[int(x,16)&0xffffffff for x in re.findall(r'(?<![\w])(-?0x[0-9a-f]+)',pseudo) if int(x,16)&0xffffffff in expected]
    assert len(expected)==64 and observed==expected
    result=dict(schema='moli.legacy-game-transform-source-stage153.v1',source=info(target),tools=dict(rea='6.7.0',ghidra='12.1.4',analysis_profile=PROFILE),
                artifacts=[info(PRIVATE/'rea-final.json'),info(PRIVATE/'rea-snapshot.json')],restored_records=86,total_records=129,new_records=43,new_operations=dict(Counter(r['operation'] for r in new)),
                new_functions=functions,instructions=instructions,byte_reads=reads,mappings=maps,views=views,
                fixed_parameter=dict(address='0x53360c',offset=locate('0x53360c'),bytes=128,sha256=hashlib.sha256(parameter).hexdigest(),product_bytes_match=True),
                permutations_match=True,SHA256_ordered_round_constants=dict(evidence=sha['evidence_id'],matched=64,expected=64,order_equal=True),
                crypto_identification='Statically derived from init/rotations/64round constants/digest format and AES table/key/inverse-block flow; not native execution or formal equivalence proof.',
                dependencies=deps,session_closed=True,target_execution=False,real_credentials_or_session_keys=False,
                limitations=['SHA compression dossier exceeds MCP budget; retained complete and first7000/44068 characters viewed; full retained text scanned for64ordered constants and tail state update. Native value-flow truncation retained.',
                             'Full handshake/control/binary-prefix lifecycle and business/text grammar remain incomplete.',
                             'Fixed shipped derivation bytes are protocol parameters; all test keys/headers/messages are original, no real sessions.',
                             'Current9baa/6e2ff and native/official gameplay acceptance remain unverified.'])
    (HERE/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(new_records=43,functions=16,instructions=14,reads=8,maps=4,parameter_match=True,SHA256_constants=64,dependencies=deps)))

if __name__=='__main__':main()
