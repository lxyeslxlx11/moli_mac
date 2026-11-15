#!/usr/bin/env python3
"""Check retained source evidence without running or patching the original game.

Canonical REA procedures, analyst-seeded callbacks, mechanical source indices,
modeled playback tests and native acceptance have deliberately separate counts.
Requires the fixed local original and retained private build/analysis artifacts.
"""
from pathlib import Path
import hashlib
import importlib.util
import json
import re
import struct
import sys

sys.dont_write_bytecode = True
A = Path(__file__).resolve().parent
R = A.parent.parent
P = R / 'build/analysis/game-battle-physical-consumers-v1'


def read(path):
    return json.loads(path.read_text())


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def info(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for block in iter(lambda: f.read(8 * 1024 * 1024), b''):
            h.update(block)
    return dict(path=str(path.relative_to(R)), bytes=path.stat().st_size, sha256=h.hexdigest())


def envelope(path):
    value = read(path)
    if 'structuredContent' in value:
        return value['structuredContent']
    if 'content' in value:
        return json.loads(next(c['text'] for c in value['content'] if c['type'] == 'text'))
    return value


def evidence_ids(path):
    pattern = re.compile(rb'"evidence_id"\s*:\s*"([^"]+)"')
    ids, tail = set(), b''
    with path.open('rb') as f:
        for block in iter(lambda: f.read(8 * 1024 * 1024), b''):
            data = tail + block
            ids.update(m[1].decode() for m in pattern.finditer(data))
            tail = data[-256:]
    return ids


def main():
    # Execute the previous complete verifier with every write replaced by an
    # equality check. Historical source records and reports stay byte-identical.
    module_path = R / 'analysis/game-battle-physical-family-v1/verify_source.py'
    spec = importlib.util.spec_from_file_location('retained_physical_source', module_path)
    retained = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(retained)
    checked_historical_outputs = []

    def compare_only(path, value):
        assert read(path) == value, str(path)
        checked_historical_outputs.append(info(path))

    retained.write = compare_only
    retained.main()
    prior = read(R / 'analysis/game-battle-physical-family-v1/source-check.json')
    source, profile = prior['source'], prior['analysis_profile']
    assert info(R / source['path']) == source
    raw = (R / source['path']).read_bytes()
    pe = struct.unpack_from('<I', raw, 60)[0]
    assert raw[pe:pe + 4] == b'PE\0\0' and struct.unpack_from('<H', raw, pe + 24)[0] == 0x10b
    image = struct.unpack_from('<I', raw, pe + 52)[0]
    optional = struct.unpack_from('<H', raw, pe + 20)[0]
    sections = []
    for i in range(struct.unpack_from('<H', raw, pe + 6)[0]):
        _, va, size, at = struct.unpack_from('<IIII', raw, pe + 24 + optional + i * 40 + 8)
        sections.append((image + va, at, size))

    def offset(address, n):
        va = int(address, 16)
        for start, at, size in sections:
            if start <= va and va + n <= start + size:
                return at + va - start
        raise AssertionError('Not a contiguous original-file range: ' + address)

    snapshot = read(P / 'rea.snapshot.json')
    records = snapshot['evidence_bundle']['records']
    byid = {row['evidence_id']: row for row in records}
    assert len(records) == len(byid) == 154
    assert snapshot['binding']['analysis_profile']['digest'] == profile
    for row in records:
        assert row['subject']['digest']['sha256'] == source['sha256']
        if row['provider']['id'] == 'ghidra':
            assert row['analysis_profile']['digest'] == profile
    lookup = {(row['operation'], row['parameters'].get('address')): row for row in records}
    checks = []

    def check_range(address, n):
        read_row, map_row = lookup['read_bytes', address], lookup['address_to_file_offset', address]
        body, at = read_row['normalized_result'], offset(address, n)
        b = bytes.fromhex(body['bytes_hex'])
        assert body['complete'] and body['requested_bytes'] == body['returned_bytes'] == len(b) == n
        assert map_row['normalized_result']['file_offset'] == at and b == raw[at:at + n]
        checks.append(dict(address=address, bytes=n, file_offset=at,
                           sha256=hashlib.sha256(b).hexdigest(),
                           read_id=read_row['evidence_id'], mapping_id=map_row['evidence_id']))
        return b

    layers = [R / row['path'] for row in prior['canonical_cache_layers']] + [P / 'functions-added.json']
    merged, new = {}, []
    for path, expected in zip(layers, [718, 10, 14]):
        layer = read(path)
        assert len(layer) == expected and not set(merged).intersection(layer)
        if path == layers[-1]:
            for address, d in sorted(layer.items()):
                e = byid[d['id']]
                assert e['operation'] == 'analyze_function' and d == dict(id=e['evidence_id'], **e['normalized_result'])
                body = d['procedure']['body']
                assert d['procedure']['address'] == address and body['available'] and body['contains_entry']
                assert not body['non_contiguous'] and len(body['ranges']) == 1
                assert int(body['ranges'][0]['start'], 16) == int(address, 16)
                assert int(body['ranges'][0]['end'], 16) + 1 == int(address, 16) + body['total_bytes']
                check_range(address, body['total_bytes'])
                new.append(dict(address=address, bytes=body['total_bytes'], evidence_id=e['evidence_id'],
                                direct_callees=[c['address'] for c in d['callees']]))
        merged.update(layer)
    assert len(merged) == 742 and sum(row['bytes'] for row in new) == 2991
    assert not {c for row in new for c in row['direct_callees'] if c not in merged}

    derived = read(P / 'derived-callbacks.json')
    assert derived['originalExecution'] is False and derived['originalBytePatches'] == 0
    callback_checks = []
    for row in derived['entries']:
        address = hex(int(row['requestedEntry'], 16))
        assert row['functionExistedBeforeSeed'] is False and row['decompileCompleted']
        b = check_range(address, row['derivedBodyBytes'])
        instruction_bytes = 0
        for ins in row['instructions']:
            bb = bytes.fromhex(ins['bytesHex'])
            at = offset(hex(int(ins['address'], 16)), len(bb))
            assert raw[at:at + len(bb)] == bb
            instruction_bytes += len(bb)
        assert instruction_bytes == len(b)
        callback_checks.append(dict(address=address, original_bytes=instruction_bytes,
                                    authority='analyst-seeded-derived-static', canonical_function=False))
    assert sum(row['original_bytes'] for row in callback_checks) == 443
    table = struct.unpack('<96I', check_range('0x533a74', 384))
    for address, n in [('0x4fd5f0', 1272), ('0x41f2d0', 54), ('0x419fd0', 41)]:
        check_range(address, n)
    assert struct.unpack('<f', check_range('0x52d4f0', 4))[0] == 135.0
    assert len(checks) == 21 and sum(row['bytes'] for row in checks) == 5189
    for selector in [0, 3, 5]:
        assert list(table[selector * 16:selector * 16 + 16]) == read(A / 'implementation-spec.json')['tile_resource_indices'][str(selector)]
    process = read(P / 'derived-process-receipt.json')
    assert process['exit_code'] == 0 and process['original_unchanged'] and not process['original_executed']
    assert process['source_sha256_before'] == process['source_sha256_after'] == source['sha256']

    inventory, closure = read(P / 'consumer-inventory.json'), read(P / 'candidate-state-closure.json')
    for row in inventory['source_files'] + closure['guard_source_files']:
        assert info(R / row['path']) == row
    for row in read(P / 'worker-output-identities-before-public-replay.json'):
        assert info(R / row['path']) == row
    absent = [row['address'] for row in closure['uncached_direct_helpers']]
    assert len(absent) == 9 and all(address in merged for address in absent)
    assert not inventory['source_closure_claim'] and not closure['complete_closure_claim']

    historical = read(R / 'build/analysis/game-battle-physical-family-v1/prior-record-check.json')
    oldids = set()
    paths = [R / row['path'] for row in historical['verified_prior_snapshot_files']]
    paths += [R / row['path'] for row in historical['prior_small_snapshots_verified']]
    paths += [R / 'build/analysis/game-battle-physical-family-v1/rea.snapshot.json']
    for path in paths:
        oldids.update(evidence_ids(path))
    assert len(oldids) == 2387
    current = set(byid)
    record_proof = dict(prior_union=len(oldids), current_snapshot_records=len(current),
                        new_ids=sorted(current - oldids), reused_ids=sorted(current & oldids),
                        new_distinct_records=len(current - oldids), cumulative_after=len(current | oldids),
                        historical_snapshot_files=len(paths), normalized_dossiers_not_counted=True)
    write(P / 'prior-record-check.json', record_proof)
    closed = envelope(P / 'close-result.json')['result']
    session = envelope(P / 'session-final.json')['result']
    assert closed['evidence_records'] == 154 and closed['primitive_entries'] == 32 and closed['workflow_entries'] == 1
    assert not session['open'] and not session['cleanup_pending']
    assert session['server_identity']['package']['version'] == '6.7.0'
    artifacts = [P / name for name in ['functions-added.json', 'rea.snapshot.json', 'derived-callbacks.json',
        'derived-process-receipt.json', 'consumer-inventory.json', 'candidate-state-closure.json',
        'worker-output-identities-before-public-replay.json', 'close-result.json', 'session-final.json',
        'prior-record-check.json', '421f90-new-query.json']]
    out = dict(schema='moli.physical-consumers-source-stage205.v1', source=source,
        tool='REA6.7.0/Ghidra12.1.4', analysis_profile=profile,
        canonical_cache_layers=[info(path) for path in layers], canonical_functions_before=728,
        canonical_functions=742, new_canonical_functions=new, new_original_function_bytes=2991,
        analyst_seeded_callbacks=callback_checks, analyst_seeded_original_bytes=443,
        original_range_checks=checks, original_ranges=21, original_bytes_checked=5189,
        retained_historical_source_reverified_read_only=True, historical_outputs_unchanged=checked_historical_outputs,
        finite_Evidence=record_proof, candidate_direct_missing_before=absent,
        candidate_direct_missing_after=[], selected_new_helper_direct_callees_resolved=True,
        direct_resolution_is_not_full_closure=True, complete_common_family_closure=False,
        consumer_map=info(A / 'consumer-map.json'), implementation_spec=info(A / 'implementation-spec.json'),
        consumer_obligations=info(A / 'consumer-obligations.json'), artifacts=[info(path) for path in artifacts],
        session_closed=True, cleanup_pending=False, original_execution=0, VM_actions=0, official_sessions=0,
        source_investigation_complete=False, runtime_implementation_complete=False,
        phase_complete=False, full_goal_complete=False, goal_status='active')
    write(P / 'original-range-checks.json', checks)
    write(A / 'source-check.json', out)
    print(json.dumps(dict(canonical_functions=742, new_functions=14, function_bytes=2991,
        derived_callback_bytes=443, original_ranges=21, original_bytes=5189,
        current_records=154, new_records=record_proof['new_distinct_records'],
        finite_record_union=record_proof['cumulative_after'], session_closed=True)))


if __name__ == '__main__':
    main()
