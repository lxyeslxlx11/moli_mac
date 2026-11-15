#!/usr/bin/env python3
"""Check fixed PE bytes, retained dossier identity and bounded creation contracts; never execute the target."""
from pathlib import Path
from collections import Counter
import hashlib
import json
import struct

R = Path(__file__).resolve().parents[2]
A = Path(__file__).resolve().parent
P = R / 'build/analysis/game-character-lifecycle-v1'


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

    before = json.loads((R / 'build/analysis/game-post-login-v1/rea-final.json').read_bytes())['records']
    records = json.loads((P / 'rea-final.json').read_bytes())['records']
    old = {x['evidence_id']: x for x in before}
    after = {x['evidence_id']: x for x in records}
    assert len(old) == 1044 and len(after) == 1125 and all(after[k] == v for k, v in old.items())
    new = [x for x in records if x['evidence_id'] not in old]
    checks, functions = [], []
    for row in new:
        assert row['subject']['digest']['sha256'] == spec['source']['sha256']
        assert row['analysis_profile']['digest'] == spec['tools']['profile'] and row['provider']['version'] == '12.1.4'
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
    assert functions == spec['functions'] and len(functions) == 21 and len(new) == 81 and len(checks) == 60
    old_entries = {x['normalized_result']['procedure']['address'] for x in before if x['operation'] == 'analyze_function'}
    assert all(x['entry'] not in old_entries for x in functions)
    for x in spec['reused_functions'] + spec['exploratory_reused_functions']:
        assert old[x['id']]['normalized_result']['procedure']['address'] == x['entry']
    f = {x['normalized_result']['procedure']['address']: x['normalized_result'] for x in records if x['operation'] == 'analyze_function'}
    assert 'FUN_004ef480(param_1,uVar5,uVar6,uVar7)' in f['0x4f8a40']['pseudocode']
    assert f['0x455820']['pseudocode'].count('return 0;') == 1 and len(f['0x455820']['callees']) == 3
    for address, parts in [('0x459f30', ['FUN_00459f30', 'FUN_00456390', 'FUN_005019f0(3)', 'FUN_00501a10(3,10)']),
                           ('0x45a970', ['DAT_00922db8', 'iVar7 <=', 'DAT_0092300c', 'FUN_005005c0', 'DAT_00ef582c = iVar7']),
                           ('0x4ef3a0', ['FUN_004f8460', 'DAT_00f5f048', 'DAT_00d5d788 = 1']),
                           ('0x4ef430', ['DAT_00d5d788 == 2', '600000 <']),
                           ('0x4ef480', ['DAT_00d5d788 == 1', 'DAT_00d5d77e = 1', 'DAT_00f5ea2c', 'DAT_00f5ea30'])]:
        assert all(part in f[address]['pseudocode'] for part in parts), address
    resources = struct.unpack_from('<28i', raw, locate('0x53c1e4', 112))
    assert resources == tuple(240000 + i * 100 for i in range(28))
    animations = struct.unpack_from('<56i', raw, locate('0x52d9b0', 224))
    expected = tuple((100002 if family == 0 and mode == 0 else 105002 if family == 0 else 106002) + 25 * (i if i < 7 else i + 3)
                     for family in range(2) for mode in range(2) for i in range(14))
    assert animations == expected
    ctype = raw[locate('0x57f53a', 256):locate('0x57f53a', 256) + 256]
    assert [i for i in range(128) if ctype[i * 2] & 8] == spec['name']['default_ctype']['whitespace']
    assert [i for i in range(128) if ctype[i * 2] & 32] == spec['name']['default_ctype']['control']
    for address, expected in [('0x533690', b'[GP]\0'), ('0x533698', b'\xa1\x40\0'), ('0x53c764', b' \0'), ('0x53cb30', b'\x81\x40\0'), ('0x567c48', b'U_s\0'), ('0x567bd8', b'/qW\0')]:
        at = locate(address, len(expected))
        assert raw[at:at + len(expected)] == expected
    assert json.loads((P / 'session-closed.json').read_text()) == dict(open=False, cleanup_pending=False)
    result = dict(schema='moli.game-character-lifecycle-source-stage167.v1', source=spec['source'], tools=spec['tools'],
                  artifacts=[info(P / 'rea-final.json'), info(P / 'rea-snapshot.json')], restored_records=1044, total_records=1125,
                  new_records=81, new_operations=dict(Counter(x['operation'] for x in new)), new_function_entries=21, functions=functions,
                  reused_functions=spec['reused_functions'], exploratory_reused_functions=spec['exploratory_reused_functions'],
                  byte_and_mapping_checks=checks, wizard=spec['wizard'], name=spec['name'], values=spec['values'], request=spec['request'], reply=spec['reply'], deletion=spec['deletion'],
                  limitations=['Default CRT locale only; native byte editor truncation and preview objects not emulated.',
                               'Local profile.dat reset/write precedes native request but cross-platform persistence is not implemented.',
                               'Fixed deletion waiting body returns0; no usable deletion request consumer established.',
                               'Creation source success causes a roster refresh, not gameplay or official acceptance.'],
                  session_closed=True, target_execution=False, VM_execution=False, official_session=False, goal_status='active', full_goal_complete=False)
    (A / 'source-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(records=1125, new=81, functions=21, reused=len(spec['reused_functions']), checks=60)))


if __name__ == '__main__':
    main()
