#!/usr/bin/env python3
"""Recheck fixed PE bytes and the finite ITM dispatch; never run the target."""
from hashlib import sha256
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
A = ROOT / 'analysis/game-battle-item-variants-v1'
P = ROOT / 'build/analysis/game-battle-item-variants-v1'
SOURCE = 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
DIGEST = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
LEDGER = 'build/analysis/game-battle-runtime-v1/derived-callbacks.json'


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def identity(path):
    h = sha256()
    with path.open('rb') as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b''):
            h.update(chunk)
    return {'path': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size,
            'sha256': h.hexdigest()}


def verify():
    source = identity(ROOT / SOURCE)
    assert source['bytes'] == 1569280 and source['sha256'] == DIGEST
    data = (ROOT / SOURCE).read_bytes()
    pe = struct.unpack_from('<I', data, 60)[0]
    base = struct.unpack_from('<I', data, pe + 52)[0]
    table = pe + 24 + struct.unpack_from('<H', data, pe + 20)[0]
    count = struct.unpack_from('<H', data, pe + 6)[0]
    sections = [struct.unpack_from('<4I', data, table + i * 40 + 8)
                for i in range(count)]

    def offset(address, size):
        for _, va, raw_size, raw_at in sections:
            delta = address - base - va
            if 0 <= delta <= raw_size - size:
                return raw_at + delta
        raise AssertionError(('uninitialized address', hex(address), size))

    def original(address, size):
        at = offset(address, size)
        return data[at:at + size]

    def admitted(path):
        record = read(path)
        assert record['subject']['digest']['sha256'] == DIGEST
        assert record['analysis_profile']['digest'] == PROFILE
        return record

    windows = []
    for filename, address, size in [
        ('items-window-restore.json', 0x426379, 206),
        ('items-window-item-body.json', 0x432616, 1468),
        ('items-raw-3.json', 0x4335a3, 170),
        ('items-window-reader.json', 0x434670, 108),
        ('items-window-completion.json', 0x436930, 299),
    ]:
        record = admitted(P / filename)
        value = record['normalized_result']
        assert value['address'] == hex(address) and value['complete']
        assert value['requested_bytes'] == value['returned_bytes'] == size
        raw = bytes.fromhex(value['bytes_hex'])
        assert raw == original(address, size)
        windows.append({'address': hex(address), 'bytes': size,
                        'file_offset': offset(address, size),
                        'sha256': sha256(raw).hexdigest(),
                        'evidence_id': record['evidence_id']})

    ledger = identity(ROOT / LEDGER)
    assert ledger['bytes'] == 3633888
    assert ledger['sha256'] == '0186e166216df07e5be808d57ebf212701e61bb0c5c0d43ba865d8654e4c9c48'
    entry = next(row for row in read(ROOT / LEDGER)['entries']
                 if row['requestedEntry'] == '004260b0')
    instructions = entry['instructions']
    assert not entry['functionExistedBeforeSeed']
    assert len(instructions) == 14120
    byte_count = 0
    for row in instructions:
        raw = bytes.fromhex(row['bytesHex'])
        assert raw == original(int(row['address'], 16), len(raw)), row['address']
        byte_count += len(raw)
    assert byte_count == 54685
    selected = [row for row in instructions if any(
        int(window['address'], 16) <= int(row['address'], 16) <
        int(window['address'], 16) + window['bytes']
        for window in windows[:3])]
    assert sum(len(bytes.fromhex(row['bytesHex'])) for row in selected) == 1844
    epilogue = [row for row in selected
                if 0x4335a3 <= int(row['address'], 16) < 0x43364d]
    assert epilogue and not any(row['text'].startswith('CALL ') for row in epilogue)

    def call(at, target):
        raw = original(at, 5)
        assert raw[0] == 0xe8
        assert at + 5 + struct.unpack('<i', raw[1:])[0] == target

    def jump(at, opcode, target):
        raw = original(at, 6)
        assert raw[:2] == bytes.fromhex(opcode)
        assert at + 6 + struct.unpack('<i', raw[2:])[0] == target

    call(0x432678, 0x434670)
    assert original(0x432680, 7).hex() == 'a344fb58002bc7'
    jump(0x432687, '0f84', 0x432a35)
    assert original(0x43268d, 3).hex() == '83e806'
    jump(0x432690, '0f84', 0x432752)
    assert original(0x432696, 1).hex() == '48'
    jump(0x432697, '0f85', 0x4335a3)
    jump(0x43263c, '0f85', 0x4335a3)
    assert original(0x4263b4, 6).hex() == '8bb284000000'
    assert original(0x4335e0, 12).hex() == '8b0d44fb5800898884000000'

    # Independent arithmetic on the three observed 32-bit comparisons.
    def branch(value):
        accumulator = value & 0xffffffff
        if accumulator == 0:
            return '0x432a35'
        accumulator = (accumulator - 6) & 0xffffffff
        if accumulator == 0:
            return '0x432752'
        accumulator = (accumulator - 1) & 0xffffffff
        return '0x43269d' if accumulator == 0 else '0x4335a3'

    cases = [*range(32), 0x7ffffffe, 0x7fffffff, 0x80000000,
             0xfffffffe, 0xffffffff]
    expected = {0: '0x432a35', 6: '0x432752', 7: '0x43269d'}
    for value in cases:
        assert branch(value) == expected.get(value, '0x4335a3')

    containing = admitted(P / 'items-containing.json')
    assert not containing['normalized_result']['found']
    wrong_boundary = admitted(P / 'items-initial-1.json')
    assert wrong_boundary['normalized_result']['status'] == 'not-instruction-boundary'
    closure = read(P / 'rea-closure.json')
    assert not closure['open'] and not closure['cleanup_pending']
    snapshot = identity(P / 'rea.snapshot.json')
    evidence = identity(P / 'rea-evidence.json')
    assert snapshot['bytes'] == closure['close']['bytes']
    assert evidence['bytes'] == closure['export']['bytes']
    assert closure['close']['evidence_records'] == closure['export']['records'] == 1121
    return {
        'stage': 301, 'source': source, 'analysis_profile': PROFILE,
        'tool': 'REA 6.7.0 / Ghidra 12.1.4', 'raw_windows': windows,
        'raw_window_bytes': sum(row['bytes'] for row in windows),
        'canonical_helpers': ['0x434670', '0x436930'],
        'canonical_helper_bytes': 407,
        'item_dispatch_is_canonical_function': False,
        'dispatch_instruction_evidence_not_function_body': True,
        'retained_derived_assembly': dict(ledger, instructions=14120, bytes_rechecked=54685,
                                         selected_instructions=len(selected),
                                         selected_bytes=1844),
        'branch_equation': 'uint32(v)==0; uint32(v-6)==0; uint32(v-7)==0; otherwise return',
        'branch_samples': [{'uint32': n, 'destination': branch(n)} for n in cases],
        'handled_uint32_values': [0, 6, 7], 'default_uint32_values': 4294967293,
        'facts': [
            'phase0 reads one hexadecimal integer with 434670 and stores it in 58fb44.',
            'Only 0,6,7 branch to item producers; other values reach 4335a3 in this callback.',
            'The common epilogue saves variant state at object+84 and returns; it does not call 436930.',
            'The field reader advances object+64; the default path does not advance command phase or group completion.',
            'At the next phase0 callback the original reads again from its advanced raw cursor; a permanent stall or successful no-op is not established.',
        ],
        'portable_policy': 'Existing item-variant-handler refusal preserves owned boundaries; no new effects or wire fields.',
        'exploratory_only': 'Player-skill/craft locators retained in the private evidence bundle; no recipe or context implementation claimed.',
        'snapshot': snapshot, 'evidence': evidence,
        'session_closure': identity(P / 'rea-closure.json'),
        'retained_records': 1121, 'ancestor_retained_records': 1090,
        'REA_closed': True, 'original_execution': 0, 'VM_actions': 0,
        'official_sessions': 0, 'runtime_changes': 0, 'full_goal_complete': False,
    }


if __name__ == '__main__':
    result = verify()
    (A / 'source-check.json').write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({key: result[key] for key in [
        'stage', 'raw_window_bytes', 'canonical_helper_bytes',
        'retained_records', 'REA_closed', 'runtime_changes']}))
