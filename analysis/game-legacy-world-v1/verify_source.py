#!/usr/bin/env python3
"""Check retained REA observations against the fixed private PE; emit metadata only."""
from pathlib import Path
from collections import Counter
import hashlib
import json
import struct

ROOT=Path(__file__).resolve().parents[2]; HERE=Path(__file__).resolve().parent
PRIVATE=ROOT/'build/analysis/game-legacy-world-v1'
SHA='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE='7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
def info(path):
    raw=path.read_bytes();return dict(path=str(path.relative_to(ROOT)),bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest())
def main():
    target=ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe';raw=target.read_bytes()
    assert hashlib.sha256(raw).hexdigest()==SHA
    pe=struct.unpack_from('<I',raw,60)[0];base=struct.unpack_from('<I',raw,pe+52)[0]
    table=pe+24+struct.unpack_from('<H',raw,pe+20)[0]
    sections=[struct.unpack_from('<4I',raw,table+i*40+8)[1:] for i in range(struct.unpack_from('<H',raw,pe+6)[0])]
    def locate(address,length=1):
        rva=int(address,16)-base;matches=[offset+rva-start for start,size,offset in sections if start<=rva and rva+length<=start+size]
        assert len(matches)==1;return matches[0]
    records=json.loads((PRIVATE/'rea-final.json').read_text())['records']
    old={r['evidence_id'] for r in json.loads((ROOT/'build/analysis/game-legacy-message-v1/rea-final.json').read_text())['records']}
    assert len(old)==247 and old<={r['evidence_id'] for r in records}
    new=[r for r in records if r['evidence_id'] not in old];checks=[];functions=[]
    for row in new:
        assert row['subject']['digest']['sha256']==SHA and row['provider']['id']=='ghidra' and row['provider']['version']=='12.1.4'
        assert row['analysis_profile']['digest']==PROFILE
        n=row['normalized_result'];op=row['operation']
        if op in ['read_bytes','inspect_native_instruction']:
            if op=='read_bytes':assert n['complete'] and n['returned_bytes']==n['requested_bytes']
            else:assert n['status']=='decoded'
            value=bytes.fromhex(n['bytes_hex'] if op=='read_bytes' else n['bytes']);offset=locate(n['address'],len(value))
            assert raw[offset:offset+len(value)]==value
            checks.append(dict(id=row['evidence_id'],operation=op,address=n['address'],offset=offset,bytes=len(value),sha256=hashlib.sha256(value).hexdigest(),matched=True))
        elif op=='address_to_file_offset':
            assert n['file_offset']==locate(n['address'])
            checks.append(dict(id=row['evidence_id'],operation=op,address=n['address'],offset=n['file_offset'],matched=True))
        elif op=='analyze_function':
            functions.append(dict(id=row['evidence_id'],entry=n['procedure']['address'],body=n['procedure']['body'],assembly_rows=len(n['assembly']),pseudocode_characters=len(n['pseudocode']),value_flow_truncated=bool((n.get('native_value_flow') or {}).get('truncated',False))))
    assert len(records)==293 and len(new)==46
    assert Counter(r['operation'] for r in new)==dict(analyze_function=19,inspect_native_instruction=17,read_bytes=4,address_to_file_offset=6)
    assert len({r['entry'] for r in functions})==19
    # Generate the two primitive tables independently; no shipped table is copied into product/fixtures.
    reverse=bytes(int('{:08b}'.format(i)[::-1],2) for i in range(256));poly=[]
    for i in range(256):
        value=i<<8
        for unused in range(8):value=((value<<1)^(0x1021 if value&0x8000 else 0))&0xffff
        poly.append(value)
    assert raw[locate('0x53d5a4',256):locate('0x53d5a4',256)+256]==reverse
    assert struct.unpack_from('<256H',raw,locate('0x53d6a4',512))==tuple(poly)
    vectors=json.loads((HERE/'original-vectors.json').read_text())
    def table_checksum(value):
        c=0
        for byte in value:c=((c&255)<<8)^poly[c>>8]^reverse[byte]
        return c
    for row in vectors['primitive']:assert table_checksum(bytes.fromhex(row['hex']))==row['value']
    plane_checks=0
    for row in vectors['rectangleCases']:
        for expected in row['checksums']:
            for p,values in enumerate(row['planes']):
                mask=0x1ff if expected['mode']==1 else 0xfff
                if p==2:values=[v&mask for v in values]
                data=struct.pack('<{}H'.format(len(values)),*values)
                assert table_checksum((data+b'\0'*1458)[:1458])==expected['values'][p];plane_checks+=1
    by_entry={r['normalized_result']['procedure']['address']:r for r in records if r['operation']=='analyze_function'}
    required={'0x4601f0':['MOV DL, byte ptr [ECX + EDI*0x1]','MOV BH, AL','XOR EDX, EBX'],
              '0x460240':['PUSH 0x5b2','AND word ptr [ECX], 0x1ff','AND word ptr [ECX], 0xfff','CALL 0x004f6610'],
              '0x4ef580':['PUSH 0x470f','PUSH 0x63','PUSH 0x7c','PUSH 0x2c','CALL 0x0045f850']}
    for entry,patterns in required.items():
        asm='\n'.join(by_entry[entry]['normalized_result']['assembly'])
        for pattern in patterns:assert pattern in asm
    result=dict(schema='moli.legacy-world-source-stage155.v1',source=info(target),tools=dict(rea='6.7.0',ghidra='12.1.4',analysis_profile=PROFILE),
                artifacts=[info(PRIVATE/'rea-final.json'),info(PRIVATE/'rea-snapshot.json')],restored_records=247,total_records=293,new_records=46,
                new_operations=dict(Counter(r['operation'] for r in new)),functions=functions,byte_and_mapping_checks=checks,
                generated_primitive_tables=dict(bit_reverse_bytes=256,polynomial_words=256,polynomial=0x1021,matched=True),
                original_vector_source_table_checks=dict(primitive=len(vectors['primitive']),rectangle_planes=plane_checks,matched=True),
                instruction_contracts_match=True,session_closed=True,target_execution=False,
                corrections=['4601f0 pseudocode omits source byte/CRC register operations; raw assembly and original tables are authority.',
                  '460240/4ef580 large stack-probe frames distort recovered signatures; cdecl push/ESP accounting determines parameter and plane order.',
                  'The masked/checksummed third plane is at B+0x14, not the first file plane; checksum length is fixed1458 bytes.'],
                limitations=['Legacy37c4 only; present9baa/6e2ff equivalence not established.',
                  'Special binary slots feed BMP/DIB conversion/drawing; higher UI purpose and single indirect callback remain unknown.',
                  'Map cache projection excludes native scene flags, actor synchronization, viewport updates, rendering and filesystem/path ownership.'])
    (HERE/'source-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(records=293,new_records=46,functions=19,instructions=17,reads=4,mappings=6,tables_matched=512,matched=True)))
if __name__=='__main__':main()
