#!/usr/bin/env python3
"""Verify fixed source identities, original bytes and bounded look/upgrade/entry contracts; no target execution."""
from pathlib import Path
from collections import Counter
import hashlib
import json
import struct

R = Path(__file__).resolve().parents[2]
A = Path(__file__).resolve().parent
P = R / 'build/analysis/game-browser-owner-v1'


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

    before = json.loads((R / 'build/analysis/game-character-options-v1/rea-final.json').read_bytes())['records']
    records = json.loads((P / 'rea-final.json').read_bytes())['records']
    old = {x['evidence_id']: x for x in before}
    after = {x['evidence_id']: x for x in records}
    assert len(old) == 1236 and len(after) == 1278 and all(after[k] == v for k, v in old.items())
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
    assert functions == spec['functions'] and len(functions) == 6 and len(new) == 42 and len(checks) == 36
    old_entries = {x['normalized_result']['procedure']['address'] for x in before if x['operation'] == 'analyze_function'}
    assert all(x['entry'] not in old_entries for x in functions)
    for row in spec['reused_functions']:
        assert old[row['id']]['normalized_result']['procedure']['address'] == row['entry']
    f = {x['normalized_result']['procedure']['address']: x['normalized_result'] for x in records if x['operation'] == 'analyze_function'}
    for address, parts in [('0x5015a0',['case 9:', 'FUN_00501a50']), ('0x501a50',['DAT_00f5f1a0 = 100','DAT_00922c4c','FUN_004ff160','FUN_004405a0','FUN_005028a0','DAT_00f5f1a0 = 3']), ('0x4ff160',['FUN_004ff3b0','FUN_004ff750','DAT_00f536a0','DAT_00f536a8']), ('0x4405a0',['FUN_0043c000','puVar7 + 0x128']), ('0x4fe580',['_DAT_00614634 = 3','_DAT_00c1ec14']), ('0x5028a0',['FUN_00506030','_DAT_00728368']), ('0x44e7d0',['DAT_00614888 = 0']), ('0x44e7e0',['_DAT_00614628 = 0','DAT_006145e8 = 0'])]:
        assert all(part in f[address]['pseudocode'] for part in parts),address
    assert json.loads((P / 'session-closed.json').read_text()) == dict(open=False, cleanup_pending=False)
    result = dict(schema='moli.game-browser-owner-source-stage169.v1', source=spec['source'], tools=spec['tools'], artifacts=[info(P/'rea-final.json'),info(P/'rea-snapshot.json')], restored_records=1236,total_records=1278,new_records=42,new_operations=dict(Counter(x['operation'] for x in new)),new_function_entries=6,functions=functions,reused_functions=spec['reused_functions'],byte_and_mapping_checks=checks,native_main9=spec['native_main9'],limitations=['Full native UI/global context/initialization not proven by six direct helpers.','Client readiness/pause/generation/ownership are derivedhost policies,not claimednative phaseidentity.','Original target/VM/account/official execution not partofthis static evidence.'],session_closed=True,target_execution=False,VM_execution=False,official_session=False,goal_status='active',full_goal_complete=False)
    (A / 'source-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(records=1278, new=42, functions=6, reused=7, checks=36)))


if __name__ == '__main__':
    main()
