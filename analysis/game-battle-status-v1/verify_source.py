#!/usr/bin/env python3
"""Check new native helpers and retained PSN contracts without executing the sample."""
from pathlib import Path
import hashlib, json, struct

A = Path(__file__).resolve().parent
R = A.parent.parent
P = R / 'build/analysis/game-battle-status-v1'

def read(p):
    return json.loads(p.read_text())

def info(p):
    h = hashlib.sha256()
    with p.open('rb') as stream:
        for block in iter(lambda: stream.read(1048576), b''):
            h.update(block)
    return dict(path=str(p.relative_to(R)), bytes=p.stat().st_size, sha256=h.hexdigest())

def main():
    sample = R / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
    identity = info(sample)
    assert identity['bytes'] == 1569280
    assert identity['sha256'] == '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
    data = sample.read_bytes()
    pe = struct.unpack_from('<I', data, 60)[0]
    sections, n = [], struct.unpack_from('<H', data, pe + 6)[0]
    optional = struct.unpack_from('<H', data, pe + 20)[0]
    base = struct.unpack_from('<I', data, pe + 52)[0]
    for i in range(n):
        at = pe + 24 + optional + i * 40
        _, va, size, raw = struct.unpack_from('<IIII', data, at + 8)
        sections.append((base + va, raw, size))
    def offset(address, size):
        for va, raw, count in sections:
            if va <= address and address + size <= va + count:
                return raw + address - va
        raise AssertionError('Not backed by original file')
    previous = read(R / 'analysis/game-battle-skill-v1/source-check.json')
    for row in previous['artifacts']:
        assert info(R / row['path']) == row
    previous_bundle = read(R / 'build/analysis/game-battle-skill-v1/rea-final.json')
    previous_ids = {r['evidence_id'] for r in previous_bundle['records']}
    assert len(previous_ids) == 2210
    del previous_bundle
    bundle = read(P / 'rea-final.json')
    current_ids = {r['evidence_id'] for r in bundle['records']}
    assert len(current_ids) == 2146
    fresh = [r for r in bundle['records'] if r['evidence_id'] not in previous_ids]
    assert len(fresh) == 12 and len(previous_ids | current_ids) == 2222
    from collections import Counter
    operations = dict(Counter(r['operation'] for r in fresh))
    assert operations == dict(analyze_function=4, read_bytes=4, address_to_file_offset=4)
    evidence = read(P / 'new-evidence.json')
    assert len(evidence['functions']) == 4 and len(evidence['checks']) == 8
    mappings = {r['normalized_result']['address']: r for r in fresh if r['operation'] == 'address_to_file_offset'}
    checks = []
    for record in fresh:
        if record['operation'] != 'read_bytes':
            continue
        value = record['normalized_result']
        raw = bytes.fromhex(value['bytes_hex'])
        assert value['complete'] and len(raw) == value['requested_bytes'] == value['returned_bytes']
        at = offset(int(value['address'], 16), len(raw))
        mapping = mappings[value['address']]
        assert at == mapping['normalized_result']['file_offset']
        assert data[at:at + len(raw)] == raw
        checks.append(dict(address=value['address'], bytes=len(raw), file_offset=at,
                           sha256=hashlib.sha256(raw).hexdigest(), read_id=record['evidence_id'],
                           mapping_id=mapping['evidence_id'], original_file_match=True))
    functions = []
    for address, record in evidence['functions'].items():
        procedure = record['normalized_result']['procedure']
        assert procedure['address'] == address and procedure['body']['contains_entry']
        assert not procedure['body']['non_contiguous']
        assert any(c['address'] == address and c['bytes'] == procedure['body']['total_bytes'] for c in checks)
        functions.append(dict(address=address, body=procedure['body'], evidence_id=record['evidence_id'],
                              callees=[r['address'] for r in record['normalized_result']['callees']]))
    complete = read(P / 'functions-complete.json')
    assert len(complete) == 679
    assert all(complete[a]['id'] == record['evidence_id'] for a, record in evidence['functions'].items())
    constants = []
    for address, count in [('0x52d450', 128), ('0x53890c', 96)]:
        row = next(r for r in previous['provider_byte_checks'] if r['address'] == address and r['bytes'] == count)
        at = offset(int(address, 16), count)
        raw = data[at:at + count]
        assert at == row['file_offset'] and hashlib.sha256(raw).hexdigest() == row['sha256']
        constants.append(dict(row, values=list(struct.unpack('<' + str(count // 4) + 'i', raw))))
    derived = R / 'build/analysis/game-battle-runtime-v1/derived-callbacks.json'
    authoritative = read(R / 'analysis/game-battle-commands-v1/source-check.json')
    assert info(derived) == next(r for r in authoritative['artifacts'] if r['path'] == str(derived.relative_to(R)))
    callback = next(e for e in read(derived)['entries'] if e['requestedEntry'] == '004260b0')
    instruction_count = 0
    for instruction in callback['instructions']:
        address = int(instruction['address'], 16)
        raw = bytes.fromhex(instruction['bytesHex'])
        at = offset(address, len(raw))
        assert data[at:at + len(raw)] == raw
        instruction_count += len(raw)
    assert instruction_count == 54685
    lifecycle = read(P / 'rea-lifecycle.json')
    assert lifecycle['final'] == dict(open=False, cleanup_pending=False)
    assert lifecycle['snapshot']['result']['evidence_records'] == 2146
    reused = ['0x40a120', '0x41dc00', '0x41b640', '0x41fe20', '0x403450', '0x403470',
              '0x4033e0', '0x4034d0', '0x4034f0', '0x4236d0']
    assert all(a in complete for a in reused)
    out = dict(schema='moli.battle-status-source-stage192.v1', classification='fact: static source only',
        source=identity, rea='6.7.0', provider='Ghidra12.1.4',
        canonical_functions_before=675, canonical_functions_after=679,
        new_canonical_functions=functions, new_operations=operations,
        retained_records_before=2210, retained_record_union_after=2222,
        current_snapshot_records=2146,
        snapshot_coverage='Valid189 snapshot plus12 new records;24 canonical functions and76 retained records from190 remain in separately verified dossiers/bundle;679 is the union, not the current snapshot query count',
        provider_byte_checks=checks, checked_new_bytes=sum(r['bytes'] for r in checks),
        reused_canonical_functions=reused, derived_command=dict(entry='0x4260b0', case=9,
            original_instruction_bytes=54685, all_original_bytes_match=True),
        numeric_constants=constants, source_contract=info(A / 'implementation-spec.json'),
        artifacts=[info(P / n) for n in ['new-evidence.json', 'functions-complete.json',
            'rea-final.json', 'rea.snapshot.json', 'rea-lifecycle.json']] + [info(derived)],
        source_evidence=[info(R / 'analysis/game-battle-skill-v1/source-check.json'),
            info(R / 'analysis/game-battle-commands-v1/source-check.json')],
        snapshot_saved=True, session_closed=True, cleanup_pending=False,
        original_execution=0, VM_actions=0, official_sessions=0,
        limitations=['Reconstruction uses independent logical values; it does not reproduce native storage encoding or whole-app RNG reads',
            'Ordinary PSN selectors0/1/2 and level0..9 HP healing are the evidenced current consumer; attached RID/full linked/status/renderer branches remain in the full goal',
            'Independent reference and local peers do not prove native runtime/current/official acceptance'],
        no_original_pseudocode_in_selected_delivery=True, phase_complete=False,
        full_goal_complete=False, goal_status='active')
    (A / 'source-check.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(functions=679, new_functions=4, union_records=2222,
                         snapshot_records=2146, checked_new_bytes=out['checked_new_bytes'],
                         derived_original_instruction_bytes=instruction_count, session_closed=True)))

if __name__ == '__main__':
    main()
