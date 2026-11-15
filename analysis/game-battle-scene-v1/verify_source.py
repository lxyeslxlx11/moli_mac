#!/usr/bin/env python3
"""Verify the fixed PE, retained REA dossiers and independent seeded depth comparator."""
from pathlib import Path
from datetime import datetime, timezone
import collections
import hashlib
import json
import struct

R = Path(__file__).resolve().parents[2]
A = R / 'analysis/game-battle-scene-v1'
P = R / 'build/analysis/game-battle-scene-v1'
OLD = R / 'build/analysis/game-battle-body-v1'
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'


def read(path):
    return json.loads(path.read_text())


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def info(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1048576), b''):
            digest.update(chunk)
    return dict(path=str(path.relative_to(R)), bytes=path.stat().st_size, sha256=digest.hexdigest())


def main():
    source = R / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
    raw = source.read_bytes()
    assert len(raw) == 1569280 and hashlib.sha256(raw).hexdigest() == SHA
    current = read(P / 'rea-final.json')
    prior = read(OLD / 'rea-final.json')
    records = {row['evidence_id']: row for row in current['records']}
    old = {row['evidence_id']: row for row in prior['records']}
    assert len(old) == 1830 and len(records) == 1863
    assert all(records[key] == value for key, value in old.items())
    new = [row for key, row in records.items() if key not in old]
    counts = collections.Counter(row['operation'] for row in new)
    assert counts == dict(analyze_function=8, read_bytes=9, address_to_file_offset=16)
    before = read(P / 'functions-before.json')
    after = dict(before)
    functions, known_queries = [], []
    for row in new:
        assert row['subject']['digest']['sha256'] == SHA
        assert row['analysis_profile']['digest'] == PROFILE
        if row['operation'] != 'analyze_function':
            continue
        normalized = row['normalized_result']
        address = normalized['procedure']['address']
        assert address == row['parameters']['procedure']
        if address in before:
            path = P / (address[2:] + '-known-query.json')
            write(path, row)
            known_queries.append(dict(address=address, evidence_id=row['evidence_id'],
                                      retained_evidence_id=before[address]['id'],
                                      counted_as_new_canonical=False, dossier=info(path)))
            continue
        after[address] = {'id': row['evidence_id'], **{key: normalized[key] for key in
                          ['procedure', 'pseudocode', 'assembly', 'callees', 'callers']}}
        path = P / (address[2:] + '-new.json')
        write(path, row)
        functions.append(dict(address=address, evidence_id=row['evidence_id'],
                              body=normalized['procedure']['body'], dossier=info(path)))
    assert len(before) == 606 and len(after) == 613 and len(known_queries) == 1
    assert sum(row['body']['total_bytes'] for row in functions) == 2467
    write(P / 'functions-complete.json', after)
    pe = struct.unpack_from('<I', raw, 60)[0]
    base = struct.unpack_from('<I', raw, pe + 52)[0]
    start = pe + 24 + struct.unpack_from('<H', raw, pe + 20)[0]
    sections = [struct.unpack_from('<4I', raw, start + 40 * i + 8)
                for i in range(struct.unpack_from('<H', raw, pe + 6)[0])]

    def offset(address):
        rva = int(address, 16) - base
        for virtual_size, virtual_at, raw_size, raw_at in sections:
            if virtual_at <= rva < virtual_at + min(virtual_size, raw_size):
                return raw_at + rva - virtual_at
        return None

    maps = {row['normalized_result']['address']: row for row in records.values()
            if row['operation'] == 'address_to_file_offset'}
    checks, initialized = [], []
    for row in new:
        if row['operation'] != 'read_bytes':
            continue
        n = row['normalized_result']
        content = bytes.fromhex(n['bytes_hex'])
        address = n['address']
        assert n['complete'] and n['requested_bytes'] == n['returned_bytes'] == len(content)
        at = offset(address)
        if at is None:
            assert address == '0x614390' and content == bytes(4)
            initialized.append(dict(address=address, bytes=4, evidence_id=row['evidence_id'],
                                    original_file_bytes=False, initialized_analysis_bytes_zero=True,
                                    runtime_value='unobserved; explicit frame clear context remains required'))
            continue
        end = hex(int(address, 16) + len(content) - 1)
        assert maps[address]['normalized_result']['file_offset'] == at
        assert maps[end]['normalized_result']['file_offset'] == at + len(content) - 1
        assert raw[at:at + len(content)] == content
        checks.append(dict(address=address, end=end, file_offset=at, bytes=len(content),
                           evidence_id=row['evidence_id'], sha256=hashlib.sha256(content).hexdigest(),
                           original_bytes_equal=True))
    assert len(checks) == 8 and sum(row['bytes'] for row in checks) == 4014
    derived = read(R / 'build/analysis/game-battle-runtime-v1/derived-callbacks.json')
    comparator = next(row for row in derived['entries'] if row['requestedEntry'] == '004198d0')
    content = bytearray()
    for instruction in comparator['instructions']:
        data = bytes.fromhex(instruction['bytesHex'])
        at = offset(instruction['address'])
        assert at is not None and raw[at:at + len(data)] == data
        content.extend(data)
    assert len(content) == 96 and comparator['decompileCompleted']
    reused = []
    for address in ['437b30', '419930', '506e80', '506ac0', '5059f0', '506030', '503330',
                    '409e70', '51c1a2', '51c2f6', '433a10', '433cd0', '420220', '420570',
                    '420750', '420080', '41f3b0', '4fd5f0', '409fe0', '40a120']:
        row = old[before['0x' + address]['id']]
        path = P / (address + '-retained.json')
        write(path, row)
        reused.append(dict(address='0x' + address, evidence_id=row['evidence_id'], dossier=info(path)))
    closed = read(P / 'final-session-status.json')
    assert closed['open'] is False and closed['cleanup_pending'] is False
    out = dict(schema='moli.battle-scene-source-stage184.v1', source=info(source),
               tool='REA6.7.0/Ghidra12.1.4; retained analyst-seeded depth comparator', analysis_profile=PROFILE,
               records=len(records), new_records=len(new), new_operations=dict(counts),
               known_functions_before=len(before), known_functions_after=len(after),
               new_functions=functions, known_function_queries=known_queries,
               reused_dossiers=reused, byte_checks=checks,
               new_original_bytes_verified=4014, initialized_memory_observations=initialized,
               derived_comparator=dict(entry='0x4198d0', instruction_bytes=96,
                                       sha256=hashlib.sha256(content).hexdigest(),
                                       original_bytes_equal=True, new_export=False, canonical_REA_dossier=False),
               observed_facts=[
                   '419930 sorts all0x20000 pool objects, including objects later filtered from submission, then stores byte(rank+9)',
                   'Derived4198d0 compares screenY or alternateY for0x800000, then signed16 field270; equal keys return+1, not zero',
                   '409e70 calloc initializes field270 to0;433a10/status/death/indicator/message/puff also explicitly store0; it is not the character slot number',
                   '506e80 suppresses8000 when renderer selector0 and10000 when selector1, then skips graphic-1, deleted==1 and hidden flag2',
                   '506e80 assembly multiplies signed animation offsets by float32 object scale before ftol and int32 screen addition',
                   'All five implemented child kinds override animation drawFlags bit4 through309/310; specified C resource range does the same',
                   '437a90 captures background resource at320,240 using506ac0;5059f0 later inserts priority5 captured-surface copy, priority6 capture and priority20 cursor records',
                   '447330 delegates scaled pixels to DirectDraw/D3D; source geometry does not establish cross-backend sampling identity',
                   'Main10 cases0/1,2/3,4/5/6 and7/8 retain distinct fade, C/arrival, input/M and exit responsibilities'],
               coverage_limits=[
                   'Battle main10/fades, input, automatic C/M consumption and exit/map return remain incomplete',
                   'Basic frame path supports actual opaque unit-scale indexed images and flips; scaled/tinted/additive styles remain explicit unavailable',
                   'Background pixels are acquired from real resource metadata; native captured-surface lifetime and fade rendering remain unimplemented',
                   'Initialized analysis zero at614390 has no file mapping and is not a measured runtime clear color',
                   'Full battle actors, shadow/mount/transformation/effects and all gameplay/platform/official acceptance remain incomplete'],
               artifacts=[info(P / name) for name in ['rea-final.json', 'rea.snapshot.json',
                          'functions-complete.json', 'final-session-status.json']], session_closed=True,
               VM_actions=0, original_execution=0, official_sessions=0, phase_complete=False,
               full_goal_complete=False, goal_status='active', recorded_utc=datetime.now(timezone.utc).isoformat())
    write(A / 'source-check.json', out)
    print(json.dumps(dict(records=1863, new_records=33, new_canonical=7, canonical_total=613,
                          reused=20, original_bytes_verified=4014, closed=True)))


if __name__ == '__main__':
    main()
