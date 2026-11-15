#!/usr/bin/env python3
"""Verify the GMN and SKL404 source slice against the fixed PE and REA snapshots."""
import hashlib
import json
import struct
import sys

sys.dont_write_bytecode = True
from verify_source import R, A, P, env, info, read, same

PRIVATE = P / 'producers'
RAW_WINDOWS = {
    'gmn-dispatch': (0x4336a4, 4),
    'skill404-dispatch': (0x433a04, 4),
    'skill404-wait-index': (0x433876, 1),
    'skill404-wait-table': (0x4337d0, 24),
    'body222-dispatch': (0x4197ac, 4),
    'formation-map': (0x5337b0, 88),
    'palette-records': (0x534b18, 5070),
    'gmn-mode-source': (0x432e9e, 53),
    'gmn-save-palette-source': (0x433134, 55),
    'gmn-restore-palette-source': (0x433492, 38),
    'skill404-priority-source': (0x431ee4, 54),
}
MAIN_WINDOWS = {
    'gmn-producer-and-extra-wait': (0x432e0c, 0x433580),
    'skill404-producer': (0x431118, 0x4323b6),
    'skill404-release': (0x429396, 0x429404),
}
BODY_STATES = (
    6, 7, 10, 11, 24, 32, 34, 35, 38, 39, 44, 49, 50, 71, 72, 74, 78,
    119, 120, 121, 147, 157, 162, 163, 166, 167, 168, 169, 170, 171,
    202, 222, 225, 226, 227, 228, 229, 230, 231, 244,
)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    prior = read(A / 'source-check.json')
    same(prior['source'])
    data = (R / prior['source']['path']).read_bytes()
    pe = struct.unpack_from('<I', data, 60)[0]
    base = struct.unpack_from('<I', data, pe + 52)[0]
    table_offset = pe + 24 + struct.unpack_from('<H', data, pe + 20)[0]
    sections = []
    for i in range(struct.unpack_from('<H', data, pe + 6)[0]):
        _, va, size, offset = struct.unpack_from('<4I', data, table_offset + i * 40 + 8)
        sections.append((base + va, size, offset))

    def original(address, length):
        address = int(address, 16) if isinstance(address, str) else address
        for start, size, offset in sections:
            if start <= address and address + length <= start + size:
                file_offset = offset + address - start
                return data[file_offset:file_offset + length]
        raise AssertionError(f'Unmapped source range {address:#x} + {length}')

    def evidence(path):
        row = env(path)
        assert row['subject']['digest']['sha256'] == prior['source']['sha256']
        assert row['analysis_profile']['digest'] == prior['analysis_profile']
        return row

    old_functions = {}
    for layer in prior['canonical_cache_layers']:
        same(layer)
        old_functions.update(read(R / layer['path']))
    assert len(old_functions) == 746
    counter = old_functions['0x41a000']
    assert '0x58fb1c' in counter['pseudocode'] and '0xff8' in counter['pseudocode']
    retained = read(PRIVATE / 'retained-helpers.json')
    for address, record in retained.items():
        assert record == old_functions[address]

    old_snapshot = P / 'rea.snapshot.json'
    new_snapshot = PRIVATE / 'rea.snapshot.json'
    old_records = {r['evidence_id'] for r in read(old_snapshot)['evidence_bundle']['records']}
    new_records = {r['evidence_id'] for r in read(new_snapshot)['evidence_bundle']['records']}
    added_records = new_records - old_records
    assert old_records <= new_records and len(added_records) == 25
    assert env(PRIVATE / 'close-result.json')['result']['evidence_records'] == len(new_records) == 437
    session = env(PRIVATE / 'session-final.json')['result']
    assert not session['open'] and not session['cleanup_pending']

    raw = {}
    raw_checks = {}
    for name, (address, length) in RAW_WINDOWS.items():
        path = PRIVATE / f'{name}.json'
        row = evidence(path)
        observed = row['normalized_result']
        actual = bytes.fromhex(observed['bytes_hex'])
        assert row['evidence_id'] in added_records
        assert observed['complete'] and observed['returned_bytes'] == len(actual) == length
        assert int(observed['address'], 16) == address and actual == original(address, length)
        raw[name] = actual
        raw_checks[name] = dict(address=hex(address), bytes=length, sha256=sha(actual),
                                evidence_id=row['evidence_id'], receipt=info(path))
    for name, target in {
        'gmn-dispatch': 0x432e0c,
        'skill404-dispatch': 0x431118,
        'body222-dispatch': 0x416ad5,
    }.items():
        assert struct.unpack('<I', raw[name])[0] == target
    assert raw['skill404-wait-index'][0] == 3
    assert struct.unpack('<6I', raw['skill404-wait-table'])[3] == 0x429396
    formation = struct.unpack('<22I', raw['formation-map'])
    assert sorted(formation) == list(range(22))
    formation_targets = [
        list(struct.unpack('<2i', original(0x533810 + index * 16, 8))) for index in formation
    ]
    palette = raw['palette-records']
    assert palette[13 * 130 + 2:13 * 130 + 18].rstrip(b'\0') == b'pal\\palet_13.cgp'
    assert struct.unpack_from('<h', palette, 0)[0] == struct.unpack_from('<h', palette, 13 * 130)[0] == 0

    dossiers = {}
    for path in sorted(PRIVATE.glob('*-dossier.json')):
        row = evidence(path)
        assert row['evidence_id'] in added_records
        procedure = row['normalized_result']['procedure']
        address = procedure['address']
        body = procedure['body']
        assert body['available'] and body['contains_entry']
        ranges = []
        for extent in body['ranges']:
            count = int(extent['end'], 16) - int(extent['start'], 16) + 1
            ranges.append(dict(**extent, bytes=count, sha256=sha(original(extent['start'], count))))
        assert sum(r['bytes'] for r in ranges) == body['total_bytes']
        dossiers[address] = dict(new_canonical=address not in old_functions, bytes=body['total_bytes'],
                                 ranges=ranges, evidence_id=row['evidence_id'], receipt=info(path))
    new_functions = [a for a, row in dossiers.items() if row['new_canonical']]
    assert len(new_functions) == 8
    turn = evidence(PRIVATE / '419dd0-instructions.json')
    turn_asm = turn['normalized_result']['instructions']
    assert any('FSUB float ptr [ESI + 0x50]' in ins for ins in turn_asm)
    assert any('FADD float ptr [ESI + 0x50]' in ins for ins in turn_asm)
    observed_ids = {r['evidence_id'] for r in [*raw_checks.values(), *dossiers.values(), turn]}
    assert observed_ids == added_records

    derived = prior['retained_derived_main']
    same(derived['evidence'])
    main_record = next(e for e in read(R / derived['evidence']['path'])['entries']
                       if e['requestedEntry'] == '004260b0')
    instructions = main_record['instructions']
    assert len(instructions) == 14120
    for ins in instructions:
        encoded = bytes.fromhex(ins['bytesHex'])
        assert original(ins['address'], len(encoded)) == encoded
    main_ranges = {}
    for name, (start, end) in MAIN_WINDOWS.items():
        entries = [ins for ins in instructions if start <= int(ins['address'], 16) < end]
        code = b''.join(bytes.fromhex(ins['bytesHex']) for ins in entries)
        assert int(entries[0]['address'], 16) == start
        assert int(entries[-1]['address'], 16) + len(bytes.fromhex(entries[-1]['bytesHex'])) == end
        main_ranges[name] = dict(start=hex(start), end_exclusive=hex(end), instructions=len(entries),
                                 decoded_bytes=len(code), raw_bytes=end-start, sha256=sha(original(start, end-start)))
    case_table = struct.unpack('<245I', original(0x419434, 245 * 4))
    body_text = old_functions['0x40a120']['pseudocode']
    case_path = R / 'build/analysis/game-battle-physical-family-v1/body-cases-private.json'
    cases = {row['case']: row for row in read(case_path)}
    body_checks = {}
    for state in BODY_STATES:
        case = cases[state]
        assert case['text'] in body_text and sha(case['text'].encode()) == case['sha256']
        body_checks[state] = dict(entry=hex(case_table[state]), fragment_sha256=case['sha256'])
    assert case_table[222] == 0x416ad5

    result = dict(
        schema='moli.shared-battle-producers-source.v1', source=prior['source'],
        tool=prior['tool'], analysis_profile=prior['analysis_profile'],
        canonical_total=len(old_functions) + len(new_functions), new_canonical=new_functions,
        prior_finite_records=2703, new_finite_records=len(added_records), finite_records=2728,
        retained_snapshot_records=len(new_records), snapshot=info(new_snapshot), closed=True,
        raw_windows=raw_checks, canonical_dossiers=dossiers, retained_helpers=len(retained),
        registered_body_aux_counter=dict(address='0x41a000', slots=22, evidence_id=counter['id']),
        turn_419dd0_evidence=turn['evidence_id'], main_windows=main_ranges,
        main_authority='retained analyst-seeded instruction derivation, verified against original PE',
        main_original_instructions=len(instructions), main_original_bytes=main_record['derivedBodyBytes'],
        body_states=body_checks, formation_targets=formation_targets,
        executed_original=False, phase_complete=False,
    )
    (A / 'producer-source-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key: result[key] for key in [
        'canonical_total', 'new_canonical', 'finite_records', 'retained_snapshot_records',
        'main_original_instructions', 'main_original_bytes', 'closed',
    ]}))


if __name__ == '__main__':
    main()
