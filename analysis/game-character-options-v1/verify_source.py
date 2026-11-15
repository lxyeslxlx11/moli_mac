#!/usr/bin/env python3
"""Verify fixed source identities, original bytes and bounded look/upgrade/entry contracts; no target execution."""
from pathlib import Path
from collections import Counter
import hashlib
import json
import struct

R = Path(__file__).resolve().parents[2]
A = Path(__file__).resolve().parent
P = R / 'build/analysis/game-character-options-v1'


def info(path):
    b = path.read_bytes()
    return dict(path=str(path.relative_to(R)), bytes=len(b), sha256=hashlib.sha256(b).hexdigest())


def main():
    spec = json.loads((A / 'implementation-spec.json').read_text())
    path = R / spec['source']['path']
    assert info(path) == spec['source']
    raw = path.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
    pe = struct.unpack_from('<I', raw, 60)[0]
    base = struct.unpack_from('<I', raw, pe + 52)[0]
    start = pe + 24 + struct.unpack_from('<H', raw, pe + 20)[0]
    sections = [struct.unpack_from('<4I', raw, start + i * 40 + 8)[1:] for i in range(struct.unpack_from('<H', raw, pe + 6)[0])]

    def locate(address, size=1):
        rva = int(address, 16) - base
        found = [offset + rva - first for first, length, offset in sections if first <= rva and rva + size <= first + length]
        assert len(found) == 1
        return found[0]

    before = json.loads((R / 'build/analysis/game-character-lifecycle-v1/rea-final.json').read_bytes())['records']
    records = json.loads((P / 'rea-final.json').read_bytes())['records']
    old = {x['evidence_id']: x for x in before}
    after = {x['evidence_id']: x for x in records}
    assert len(old) == 1125 and len(after) == 1236 and all(after[k] == v for k, v in old.items())
    new = [x for x in records if x['evidence_id'] not in old]
    checks, functions = [], []
    for row in new:
        assert row['subject']['digest']['sha256'] == spec['source']['sha256'] and row['analysis_profile']['digest'] == spec['tools']['profile']
        assert row['provider']['version'] == '12.1.4'
        value, operation = row['normalized_result'], row['operation']
        if operation in ['inspect_native_instruction', 'read_bytes']:
            if operation == 'read_bytes':
                assert value['complete'] and value['requested_bytes'] == value['returned_bytes']
                b = bytes.fromhex(value['bytes_hex'])
            else:
                assert value['status'] == 'decoded'
                b = bytes.fromhex(value['bytes'])
            offset = locate(value['address'], len(b))
            assert raw[offset:offset + len(b)] == b
            checks.append(dict(id=row['evidence_id'], operation=operation, address=value['address'], offset=offset, bytes=len(b), sha256=hashlib.sha256(b).hexdigest(), matched=True))
        elif operation == 'address_to_file_offset':
            assert value['file_offset'] == locate(value['address'])
            checks.append(dict(id=row['evidence_id'], operation=operation, address=value['address'], offset=value['file_offset'], matched=True))
        elif operation == 'analyze_function':
            functions.append(dict(entry=value['procedure']['address'], id=row['evidence_id'], requested=row['parameters']['procedure']))
    assert functions == spec['functions'] and len(functions) == 25 and len(new) == 111 and len(checks) == 82
    old_entries = {x['normalized_result']['procedure']['address'] for x in before if x['operation'] == 'analyze_function'}
    assert all(x['entry'] not in old_entries for x in functions)
    for row in spec['reused_functions']:
        assert old[row['id']]['normalized_result']['procedure']['address'] == row['entry']
    f = {x['normalized_result']['procedure']['address']: x['normalized_result'] for x in records if x['operation'] == 'analyze_function'}
    for address, parts in [('0x458900', ['case 3:', 'case 4:', 'piVar9[3]', '0x3b470', 'case 5:', 'case 6:', 'FUN_004586f0(iVar8)']),
                           ('0x4593b0', ['4 < DAT_00924f40', 'piVar2', '6 < DAT_00924f40']),
                           ('0x455f90', ['1 < DAT_00925084', 'FUN_004f8880', 's_abcdefg', 'DAT_00f5f1a0 = 1']),
                           ('0x459bc0', ['s_20031229_30', 's_20031229_20', '&DAT_00923c40', 'DAT_00f5f1a0 = 1']),
                           ('0x4f4a80', ['DAT_005676ac = param_2', 'DAT_00f5f17c == 0xd', 'param_2 !=']),
                           ('0x4ff080', ['DAT_00f536a4 = DAT_00ef582c', 'FUN_005057b0', 'FUN_005059d0']),
                           ('0x4f0000', ['DAT_00f536a4']), ('0x501200', ['local_38 [14]', 'return local_38['])]:
        assert all(part in f[address]['pseudocode'] for part in parts), address
    assert 'MOV EAX, dword ptr [ESP + ECX*0x4 + 0x4]' in '\n'.join(f['0x501200']['assembly'])
    for address, expected in [('0x53c6b4', b'abcdefg\0'), ('0x53caf4', b'20031229_30\0'), ('0x53cb00', b'20031229_20\0'), ('0x567c1c', b'WDM\0'), ('0x567bf8', b'5[B\0')]:
        at = locate(address, len(expected))
        assert raw[at:at + len(expected)] == expected
    fallback=next(x for x in new if x['operation']=='inspect_native_instruction' and x['normalized_result']['address']=='0x45874c')['normalized_result']
    assert fallback['bytes']=='c787f8e9f5004c810000' and raw[locate('0x45874c')+6:locate('0x45874c')+10]==struct.pack('<I',33100)
    assert json.loads((P / 'session-closed.json').read_text()) == dict(open=False, cleanup_pending=False)
    result = dict(schema='moli.game-character-options-source-stage168.v1', source=spec['source'], tools=spec['tools'], artifacts=[info(P / 'rea-final.json'), info(P / 'rea-snapshot-corrected.json')],
                  restored_records=1125, total_records=1236, new_records=111, new_operations=dict(Counter(x['operation'] for x in new)), new_function_entries=25,
                  functions=functions, reused_functions=spec['reused_functions'], byte_and_mapping_checks=checks, look=spec['look'], upgrade=spec['upgrade'], entry=spec['entry'], preview_fallback_correction=spec['preview_fallback_correction'],
                  limitations=['Native inverse table out-of-range accesses are rejected, not modeled as invented stack bytes.',
                               'Upgrade category7 runtime material producer is unresolved; no source timeout is invented.',
                               'Only selected appearance→state field16 is bound, not full native main5 reset, wrapped state zeroing or actorID.',
                               'Original target/VM/account/official execution is not part of this static evidence.'],
                  session_closed=True, target_execution=False, VM_execution=False, official_session=False, goal_status='active', full_goal_complete=False)
    (A / 'source-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(records=1236, new=111, functions=25, reused=12, checks=82)))


if __name__ == '__main__':
    main()
