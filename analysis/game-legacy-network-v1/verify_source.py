#!/usr/bin/env python3
"""Check retained REA facts against the fixed, private legacy PE. Never runs it."""
from pathlib import Path
from collections import Counter
import hashlib
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/game-legacy-network-v1'
TARGET = ROOT / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'


def info(path):
    raw = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest())


def main():
    raw = TARGET.read_bytes()
    assert len(raw) == 1569280 and hashlib.sha256(raw).hexdigest() == SHA
    pe = struct.unpack_from('<I', raw, 60)[0]
    assert raw[:2] == b'MZ' and raw[pe:pe+4] == b'PE\0\0'
    count, optional = struct.unpack_from('<H', raw, pe+6)[0], struct.unpack_from('<H', raw, pe+20)[0]
    base = struct.unpack_from('<I', raw, pe+24+28)[0]
    assert struct.unpack_from('<H', raw, pe+24)[0] == 0x10b
    table = pe+24+optional
    sections = [struct.unpack_from('<4I', raw, table+i*40+8)[1:] for i in range(count)]

    def locate(address, length=1):
        rva = int(address, 16)-base
        matches = [offset+rva-start for start, size, offset in sections if start <= rva and rva+length <= start+size]
        assert len(matches) == 1
        return matches[0]

    # Independently verify ordinal imports in the original PE, without loading a DLL.
    directory = struct.unpack_from('<I', raw, pe+24+104)[0]
    imports = []
    for index in range(64):
        descriptor = locate(hex(base+directory+20*index), 20)
        lookup, timestamp, chain, name_rva, iat = struct.unpack_from('<5I', raw, descriptor)
        if not (lookup or timestamp or chain or name_rva or iat):
            break
        name_at = locate(hex(base+name_rva))
        name_end = raw.index(b'\0', name_at, name_at+256)
        if raw[name_at:name_end].upper() != b'WSOCK32.DLL':
            continue
        for item in range(1024):
            value = struct.unpack_from('<I', raw, locate(hex(base+(lookup or iat)+item*4), 4))[0]
            if value == 0:
                break
            assert value & 0x80000000
            imports.append(dict(iat=hex(base+iat+item*4), ordinal=value & 0xffff))
    actual = {row['iat']:row['ordinal'] for row in imports}
    assert len(imports) == 15
    assert {key:actual[key] for key in ['0x52d314','0x52d318','0x52d31c','0x52d320']} == {
        '0x52d314':16, '0x52d318':3, '0x52d31c':19, '0x52d320':4}

    previous = json.loads((ROOT/'build/analysis/game-release-current-v1/rea-final.json').read_text())
    bundle = json.loads((PRIVATE/'rea-final.json').read_text())
    old_ids = {row['evidence_id'] for row in previous['records']}
    records = bundle['records']
    assert len(old_ids) == 39 and old_ids <= {row['evidence_id'] for row in records}
    new = [row for row in records if row['evidence_id'] not in old_ids]
    instructions, reads, mappings, functions, projections, noninstructions = [], [], [], [], [], []
    for row in new:
        assert row['subject']['digest']['sha256'] == SHA
        value = row['normalized_result']
        operation = row['operation']
        if operation == 'inspect_analysis_view':
            projections.append(dict(id=row['evidence_id'], parent=value['parent_evidence_id'], coverage=value['coverage']))
            continue
        assert row['provider']['id'] == 'ghidra' and row['provider']['version'] == '12.1.4'
        assert row['analysis_profile']['digest'] == PROFILE
        if operation == 'inspect_native_instruction':
            if value['status'] != 'decoded':
                noninstructions.append(dict(id=row['evidence_id'], address=value['address'], status=value['status']))
                continue
            expected = bytes.fromhex(value['bytes'])
            at = locate(value['address'], len(expected))
            assert raw[at:at+len(expected)] == expected
            instructions.append(dict(id=row['evidence_id'], address=value['address'], offset=at,
                                     bytes=len(expected), sha256=hashlib.sha256(expected).hexdigest(), matched=True))
        elif operation == 'read_bytes':
            assert value['complete'] and value['returned_bytes'] == value['requested_bytes']
            expected = bytes.fromhex(value['bytes_hex'])
            at = locate(value['address'], len(expected))
            assert raw[at:at+len(expected)] == expected
            reads.append(dict(id=row['evidence_id'], address=value['address'], offset=at,
                              bytes=len(expected), sha256=hashlib.sha256(expected).hexdigest(), matched=True))
        elif operation == 'address_to_file_offset':
            assert value['file_offset'] == locate(value['address'])
            mappings.append(dict(id=row['evidence_id'], address=value['address'], offset=value['file_offset'], matched=True))
        elif operation == 'analyze_function':
            functions.append(dict(id=row['evidence_id'], entry=value['procedure']['address'],
                                  body=value['procedure']['body'], pseudocode_chars=len(value['pseudocode']),
                                  assembly_rows=len(value['assembly']),
                                  value_flow_truncated=bool((value.get('native_value_flow') or {}).get('truncated', False))))
    # These anchors distinguish the actual sender stores from decompiler stack aliases.
    assert {row['address'] for row in instructions} >= {'0x4fce2f','0x4fce37','0x4fce41','0x4fce58','0x4fce5e','0x4ee4c3','0x4ee4d9','0x4ee4e4'}
    result = dict(schema='moli.legacy-game-source-check-stage152.v1', source=info(TARGET),
                  tools=dict(rea='6.7.0', provider='Ghidra12.1.4', analysis_profile=PROFILE),
                  artifacts=[info(PRIVATE/'rea-final.json'), info(PRIVATE/'rea-snapshot.json')],
                  session_closed=True, target_executed=False,
                  total_records=len(records), restored_records=len(old_ids), new_records=len(new),
                  new_operations=dict(Counter(row['operation'] for row in new)),
                  wsock32_ordinal_imports=imports,
                  new_functions=functions, instructions=instructions, byte_reads=reads, mappings=mappings,
                  noninstruction_queries=noninstructions, projections=projections,
                  all_selected_source_checks_matched=True,
                  limitations=['One callback at4ee380 is not a defined Ghidra function; failed selector did not produce a dossier.',
                               '4f8a40 exceeds MCP response size; complete dossier retained, first6400/81694 pseudocode characters viewed, remaining retained but not fully reviewed.',
                               'Native value-flow truncation flags are retained; source types/import prototypes are decompiler observations.',
                               'Ordinal names use Wine ABI reference, not an observed Windows DLL or runtime.',
                               'No target execution, ciphertext/session capture, current-version equivalence or server acceptance.'])
    (HERE/'source-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(new_records=len(new), functions=len(functions), instructions=len(instructions),
                          reads=len(reads), mappings=len(mappings), matched=True)))


if __name__ == '__main__':
    main()
