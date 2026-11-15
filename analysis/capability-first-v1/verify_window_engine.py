"""Bind retained common-window evidence to the fixed source; no original execution."""
from collections import Counter
import json
from pathlib import Path

from extract_entry_inventory import PE, ROOT, SHA, digest, identity, load

PUBLIC = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/capability-window-engine-v1'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'


def evidence(path):
    value = load(path)
    return value.get('structuredContent', value)


def derived_check(pe, entry, origin):
    assert entry['status'] == 'derived-static-export'
    assert entry['decompileCompleted'] and not entry['decompileError']
    covered = set()
    raw_instructions = bytearray()
    for instruction in entry['instructions']:
        address = int(instruction['address'], 16)
        raw = bytes.fromhex(instruction['bytesHex'])
        assert raw == pe.read(address, len(raw)), hex(address)
        raw_instructions.extend(raw)
        covered.update(range(address, address + len(raw)))
    declared = set()
    ranges = []
    for span in entry['derivedBody']:
        start, end = int(span['start'], 16), int(span['end'], 16)
        raw = pe.read(start, end - start + 1)
        declared.update(range(start, end + 1))
        ranges.append(dict(start=hex(start), end=hex(end), bytes=len(raw),
                           file_offset=pe.file_offset(start, len(raw)), sha256=digest(raw)))
    assert covered == declared
    return dict(entry=hex(int(entry['requestedEntry'], 16)),
                authority='analyst-seeded-derived-static-not-canonical-REA-function',
                origin=origin, ranges=ranges, instructions=len(entry['instructions']),
                bytes=len(covered), instruction_bytes_sha256=digest(raw_instructions),
                all_source_instruction_bytes_match=True)


def verify():
    sample = ROOT / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
    pe = PE(sample, SHA)
    manifest = load(PRIVATE / 'function-manifest.json')
    functions = []
    for item in manifest:
        entry = item['entry']
        dossier = evidence(ROOT / item['path']) if item['role'] != 'reused-mouse-producer' else None
        if dossier:
            assert dossier['subject']['digest']['sha256'] == SHA
            assert dossier['analysis_profile']['digest'] == PROFILE
            assert dossier['evidence_id'] == item['evidence_id']
            procedure = dossier['normalized_result']['procedure']
            assert procedure['address'] == entry and procedure['body']['ranges'] == item['ranges']
        else:
            previous = load(ROOT / item['path'])
            assert previous['source']['sha256'] == SHA
            assert any(row['id'] == item['evidence_id'] and row['entry'] == entry
                       and row['body']['ranges'] == item['ranges'] for row in previous['functions'])
        ranges = []
        for index, span in enumerate(item['ranges']):
            start, end = int(span['start'], 16), int(span['end'], 16)
            count = end - start + 1
            path = PRIVATE / f'bytes-{entry[2:]}-{index}.json'
            read = evidence(path)
            assert read['subject']['digest']['sha256'] == SHA
            result = read['normalized_result']
            assert result['complete'] and result['address'] == span['start']
            assert result['requested_bytes'] == result['returned_bytes'] == count
            raw = pe.read(start, count)
            assert raw == bytes.fromhex(result['bytes_hex']), entry
            ranges.append(dict(start=span['start'], end=span['end'], bytes=count,
                               file_offset=pe.file_offset(start, count), sha256=digest(raw),
                               read_evidence_id=read['evidence_id']))
        functions.append(dict(entry=entry, authority='canonical-REA-function-body',
                              role=item['role'], evidence_id=item['evidence_id'],
                              dossier_reference=identity(ROOT / item['path']), ranges=ranges))
    output = PRIVATE / 'derived-context-callback.json'
    current = load(output)
    assert current['originalExecution'] is False and current['originalBytePatches'] is False
    receipt = load(PRIVATE / 'derived-context-receipt.json')
    assert receipt['exit_code'] == 0
    assert receipt['source_sha256_before'] == receipt['source_sha256_after'] == SHA
    assert len(current['entries']) == 1 and current['entries'][0]['requestedEntry'] == '004a8e20'
    derived = [derived_check(pe, current['entries'][0], 'new-explicit-registration-callback')]
    old = load(ROOT / 'build/analysis/capability-entry-inventory-v1/derived-entry-functions.json')
    reused = {'004a7d20', '0046ad80', '004b6830', '0048f1b0', '0048f4f0', '0048f800', '0049aa00'}
    selected = [item for item in old['entries'] if item['requestedEntry'] in reused]
    assert len(selected) == len(reused)
    derived += [derived_check(pe, item, 'previous-480-entry-batch') for item in selected]
    writers = load(PRIVATE / 'owner-write-candidates.json')['candidates']
    callback_instructions = {int(i['address'], 16): i for i in current['entries'][0]['instructions']}
    verified_writes = []
    owners = {'0x4685f2': '0x468190', '0x468606': '0x468190', '0x46abd1': '0x46ab90'}
    for item in writers:
        address = int(item['candidate_instruction'], 16)
        if address in callback_instructions:
            instruction = callback_instructions[address]
            text = instruction['text']
            owner = '0x4a8e20'
        else:
            owner = owners[hex(address)]
            body = next(row for row in manifest if row['entry'] == owner)
            assembly = evidence(ROOT / body['path'])['normalized_result']['assembly']
            text = next(line for line in assembly if line.startswith(hex(address) + ':'))
        raw = pe.read(address, 6)
        assert raw[0] == 0x89 and raw[1] & 0xc7 == 0x05
        assert int.from_bytes(raw[2:6], 'little') == 0xc3b2ac
        assert 'MOV' in text and 'c3b2ac' in text.lower()
        verified_writes.append(dict(address=hex(address), owner=owner,
                                    file_offset=pe.file_offset(address, 6), bytes=6, sha256=digest(raw)))
    assert len(verified_writes) == 7
    anchors = []
    for address in (0x4a8ef2, 0x4a8f74):
        proof = evidence(PRIVATE / f'instruction-{address:x}.json')
        result = proof['normalized_result']
        raw = pe.read(address, 5)
        assert result['status'] == 'decoded' and result['mnemonic'] == 'PUSH'
        assert bytes.fromhex(result['bytes']) == raw == b'\x68\x20\x8e\x4a\x00'
        anchors.append(dict(address=hex(address), literal_callback='0x4a8e20',
                            file_offset=pe.file_offset(address, 5), bytes=5, sha256=digest(raw),
                            evidence_id=proof['evidence_id']))
    groups = pe.read(0x52ea18, 67)
    assert set(groups) == {0, 1, 2, 4}
    inactive = pe.read(0x54c298, 32)
    words = [int.from_bytes(inactive[i:i + 4], 'little') for i in range(0, 32, 4)]
    assert words == [0, 0x5849c8, 3, 0, 44, 0, 0, 1]
    result = dict(schema='moli.capability-window-engine-source-check.v1', source=identity(sample),
                  tools=dict(REA='6.7.0', Ghidra='12.1.4', profile=PROFILE),
                  functions=functions, canonical_function_count=len(functions),
                  new_canonical_functions=sum(item['role'] == 'new-canonical' for item in manifest),
                  reused_canonical_functions=sum(item['role'] != 'new-canonical' for item in manifest),
                  canonical_body_bytes_verified=sum(r['bytes'] for f in functions for r in f['ranges']),
                  derived_functions=derived,
                  derived_instructions_verified=sum(item['instructions'] for item in derived),
                  derived_bytes_verified=sum(item['bytes'] for item in derived),
                  new_derived_callbacks=1, reused_derived_functions=len(reused),
                  derived_output=identity(output), derived_receipt=identity(PRIVATE / 'derived-context-receipt.json'),
                  direct_literal_owner_writes=verified_writes,
                  owner_write_search_complete_for_aliases=False,
                  registration_anchors=anchors,
                  group_byte_counts={str(k): v for k, v in sorted(Counter(groups).items())},
                  type0_record=dict(address='0x54c298', bytes=32, sha256=digest(inactive),
                                    initial_participation=0, callback_field=1,
                                    all_runtime_activation_paths_closed=False),
                  all_source_bytes_match=True, source_unchanged=True, original_execution=False,
                  runtime_features_changed=False, full_capability_analysis_complete=False,
                  implementation_gate_passed=False,
                  limitations=['Common classic-window source rules only; alternate UI framework remains separate.',
                               'Derived callback boundaries are analyst seeded; original instruction bytes are verified.',
                               'Direct literal writes do not exclude aliased stores or runtime-generated code.',
                               'Per-business effects, indirect hooks and type0 future activation remain open.',
                               'No runtime, target-platform, current-version or official-server acceptance.'])
    (PUBLIC / 'window-engine-source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: result[key] for key in ('canonical_function_count', 'new_canonical_functions',
          'reused_canonical_functions', 'canonical_body_bytes_verified', 'new_derived_callbacks',
          'reused_derived_functions', 'derived_instructions_verified', 'derived_bytes_verified',
          'group_byte_counts', 'all_source_bytes_match', 'implementation_gate_passed')}))


if __name__ == '__main__':
    verify()
