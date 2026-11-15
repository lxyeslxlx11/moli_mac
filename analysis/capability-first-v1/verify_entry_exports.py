"""Bind the batch's derived instructions and call graph to immutable source bytes."""
from pathlib import Path
import collections
import json
import shutil
from extract_entry_inventory import ROOT, PRIVATE, SHA, PE, identity, load, digest


def verify():
    source = ROOT / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
    pe = PE(source, SHA)
    path = PRIVATE / 'derived-entry-functions.json'
    derived = load(path)
    receipt = load(PRIVATE / 'derived-entry-receipt.json')
    anchors = load(PRIVATE / 'derived-entry-anchors.json')
    assert receipt['exit_code'] == 0
    assert receipt['source_sha256_before'] == receipt['source_sha256_after'] == SHA
    expected = {int(row['entry'], 16) for row in anchors}
    assert expected == {int(row['requestedEntry'], 16) for row in derived['entries']}
    assert len(expected) == len(derived['entries']) == 480
    rows = []
    total_bytes = 0
    total_instructions = 0
    unique_bytes = {}
    for entry in derived['entries']:
        assert entry['status'] == 'derived-static-export' and entry['decompileCompleted']
        assert entry['pseudocode'] and not entry['decompileError']
        count = 0
        calls = set()
        nondefault_calls = set()
        unresolved_calls = 0
        code = bytearray()
        for instruction in entry['instructions']:
            address = int(instruction['address'], 16)
            raw = bytes.fromhex(instruction['bytesHex'])
            assert raw == pe.read(address, len(raw)), hex(address)
            count += len(raw)
            code.extend(raw)
            for offset, value in enumerate(raw):
                previous = unique_bytes.setdefault(address + offset, value)
                assert previous == value
            if 'CALL' in instruction['flowType']:
                if instruction['flows']:
                    for target in instruction['flows']:
                        if ':' in target:
                            nondefault_calls.add(target)
                        else:
                            calls.add(hex(int(target, 16)))
                else:
                    unresolved_calls += 1
        ranges = []
        for span in entry['derivedBody']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            raw = pe.read(start, end - start + 1)
            ranges.append(dict(start=hex(start), end=hex(end),
                               file_offset=pe.file_offset(start, len(raw)), bytes=len(raw), sha256=digest(raw)))
        total_bytes += count
        total_instructions += len(entry['instructions'])
        rows.append(dict(entry=hex(int(entry['requestedEntry'], 16)),
                         authority='analyst-seeded-derived-static-not-canonical-REA-function',
                         ranges=ranges, declared_body_bytes=entry['derivedBodyBytes'],
                         verified_instruction_bytes=count, instructions=len(entry['instructions']),
                         instruction_bytes_sha256=digest(code), all_source_instruction_bytes_match=True,
                         direct_call_targets=sorted(calls, key=lambda x: int(x, 16)),
                         nondefault_space_call_targets=sorted(nondefault_calls),
                         unresolved_indirect_calls=unresolved_calls,
                         exact_zero_return_body=bytes(code) in [b'\x33\xc0\xc3', b'\x31\xc0\xc3'],
                         full_semantics_verified=False))
    inventory = load(Path(__file__).with_name('entry-inventory.json'))
    control_rows = [row for window in inventory['classic_windows'] for row in window['controls']]
    result = dict(schema='moli.capability-entry-source-check.v1', source=identity(source),
                  tools=dict(REA='6.7.0', Ghidra='12.1.4'),
                  batch_output=identity(path), receipt=identity(PRIVATE / 'derived-entry-receipt.json'),
                  input_anchors=identity(PRIVATE / 'derived-entry-anchors.json'),
                  entry_inventory=identity(Path(__file__).with_name('entry-inventory.json')),
                  functions=rows, derived_functions=480, canonical_functions_added=0,
                  verified_instructions=total_instructions, verified_instruction_bytes=total_bytes,
                  unique_instruction_bytes=len(unique_bytes),
                  all_source_instruction_bytes_match=True,
                  source_table_bytes_verified=sum(x['bytes'] for x in inventory['table_byte_checks']),
                  distinct_classic_control_rows=len({x['address'] for x in control_rows}),
                  noncode_control_field_occurrences=sum(not x['callback_is_file_backed_code'] for x in control_rows),
                  exact_zero_return_functions=sum(x['exact_zero_return_body'] for x in rows),
                  unresolved_indirect_call_sites=sum(x['unresolved_indirect_calls'] for x in rows),
                  source_unchanged=True, original_execution=False,
                  runtime_features_changed=False, capability_discovery_complete=False,
                  all_capability_analysis_complete=False,
                  limitations=['All 480 selected source-anchored entries exported and their instructions match the source.',
                               'Derived function boundaries, call targets and pseudocode are static analysis observations.',
                               'A successful export or byte match does not close business conditions, shared-state lifetime or runtime reachability.',
                               'Non-code control fields remain recorded; they were not coerced into callable function entries.'])
    Path(__file__).with_name('entry-source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    old_index = Path(__file__).with_name('entry-evidence-index.json')
    backup = PRIVATE / 'entry-evidence-index-before-derived.json'
    if not backup.exists():
        shutil.copy2(old_index, backup)
    print(json.dumps({key: result[key] for key in ['derived_functions', 'verified_instructions',
                         'verified_instruction_bytes', 'unique_instruction_bytes',
                         'source_table_bytes_verified', 'exact_zero_return_functions',
                         'unresolved_indirect_call_sites', 'all_source_instruction_bytes_match']}))


if __name__ == '__main__':
    verify()
