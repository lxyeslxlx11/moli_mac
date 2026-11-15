#!/usr/bin/env python3
"""Verify fixed-source catalog, installation and selected host lifecycle evidence.

This produces a bounded specification. It never executes the original target.
Full proprietary code views remain in the private build/analysis directory.
"""
import hashlib
import json
import struct
from pathlib import Path

from extract_entry_inventory import PE
from derive_dispatch_bindings import vtable_info

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'analysis/capability-first-v1'
PRIVATE = ROOT / 'build/analysis/capability-launcher-catalog-install-v1'
TARGET = ROOT / 'build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe'
SHA = 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'
NATIVE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
WORKFLOW = 'b9a9b4f868ae80c2a55407e7d3772a125da19a3d5e2e1765df03951cbd797158'
BUNDLES = [ROOT / 'build/analysis/capability-launcher-id-metadata-v1/rea-launcher-evidence.json',
           ROOT / 'build/analysis/launcher-current-patch-v1/rea-complete-path.json']


def sha(blob):
    return hashlib.sha256(blob).hexdigest()


def load(path):
    return json.loads(path.read_text())


def identity(path):
    return {'path': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size,
            'sha256': sha(path.read_bytes())}


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def main():
    pe = PE(TARGET, SHA)
    manifest = load(PRIVATE / 'body-input-manifest.json')
    wanted = set()
    for row in manifest:
        if row['kind'] == 'composed':
            r = load(ROOT / row['path'])
            wanted.update(r[k] for k in ('pseudocode_parent_evidence_id', 'range_evidence_id', 'assembly_evidence_id'))
    parents, parent_bundles = {}, {}
    for path in BUNDLES:
        bundle = load(path)
        for record in bundle['records']:
            if record['evidence_id'] in wanted:
                assert record['evidence_id'] not in parents or parents[record['evidence_id']] == record
                parents[record['evidence_id']] = record
                parent_bundles.setdefault(record['evidence_id'], identity(path))
        del bundle
    # New native range/assembly records for the two reused App pseudocode bodies.
    for path in list(PRIVATE.glob('procedure_info-*.json')) + list(PRIVATE.glob('procedure_assembly-*.json')):
        record = load(path)
        if record.get('evidence_id') in wanted:
            parents[record['evidence_id']] = record
            parent_bundles[record['evidence_id']] = identity(path)
    assert wanted <= parents.keys(), wanted - parents.keys()

    bodies, indexed, assemblies, pseudos = [], {}, {}, {}
    for row in manifest:
        path = ROOT / row['path']
        record = load(path)
        assert record['subject']['digest']['sha256'] == SHA
        entry = row['procedure']
        item = {'procedure': entry, 'kind': row['kind'], 'retained_view': identity(path)}
        if row['kind'] == 'composed':
            assert record['canonical_function_dossier'] is False
            assert record['procedure'] == entry
            parent = parents[record['pseudocode_parent_evidence_id']]
            info = parents[record['range_evidence_id']]
            asm = parents[record['assembly_evidence_id']]
            for r in (parent, info, asm):
                assert r['subject']['digest']['sha256'] == SHA
            assert parent['analysis_profile']['digest'] == record['pseudocode_profile']['digest']
            assert info['analysis_profile']['digest'] == asm['analysis_profile']['digest'] == NATIVE
            if record['pseudocode_item_index'] is None:
                assert parent['operation'] == 'procedure_pseudo_code'
                assert parent['analysis_profile']['digest'] == NATIVE
                pseudo = parent['normalized_result']
            else:
                assert parent['analysis_profile']['digest'] == WORKFLOW
                selected = parent['normalized_result']['items'][record['pseudocode_item_index']]
                assert selected['status'] == 'ok' and selected['procedure']['address'] == entry
                pseudo = selected['pseudocode']
            assert pseudo == record['pseudocode']
            body, assembly = record['body'], record['assembly']
            assert info['normalized_result']['entrypoint'] == entry
            assert body == info['normalized_result']['body']
            assert assembly == asm['normalized_result'].splitlines()
            item.update(canonical_native_dossier=False,
                        pseudocode_parent_evidence_id=parent['evidence_id'],
                        pseudocode_source=parent_bundles[parent['evidence_id']],
                        pseudocode_profile_digest=parent['analysis_profile']['digest'],
                        pseudocode_utf8_sha256=sha(pseudo.encode()),
                        range_evidence_id=info['evidence_id'], assembly_evidence_id=asm['evidence_id'])
        else:
            assert row['kind'] in ('new-native', 'reused-native')
            assert record['operation'] == 'analyze_function' and record['analysis_profile']['digest'] == NATIVE
            n = record['normalized_result']
            assert n['procedure']['address'] == entry
            body, assembly, pseudo = n['procedure']['body'], n['assembly'], n['pseudocode']
            item.update(canonical_native_dossier=True, evidence_id=record['evidence_id'])
        assert body['available'] and body['contains_entry']
        ranges = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            assert start <= int(entry, 16) <= end or body['non_contiguous']
            assert pe.executable(start) and pe.executable(end)
            path_read = PRIVATE / f'read-range-{start:x}.json'
            read = load(path_read)
            n = read['normalized_result']
            blob = bytes.fromhex(n['bytes_hex'])
            assert read['subject']['digest']['sha256'] == SHA and read['analysis_profile']['digest'] == NATIVE
            assert n['complete'] and n['address'] == hex(start)
            assert n['returned_bytes'] == len(blob) == end - start + 1
            assert blob == pe.read(start, len(blob))
            ranges.append({'start': hex(start), 'end_inclusive': hex(end), 'bytes': len(blob),
                           'file_offset': pe.file_offset(start, len(blob)), 'sha256': sha(blob),
                           'native_loaded_image_read_evidence_id': read['evidence_id'],
                           'retained_read': identity(path_read)})
        assert sum(r['bytes'] for r in ranges) == body['total_bytes'] == row['body_bytes']
        assert entry not in indexed
        item['ranges'] = ranges
        indexed[entry], assemblies[entry], pseudos[entry] = item, assembly, pseudo
        bodies.append(item)

    anchors = []

    def anchor(entry, claim, *queries):
        matches = []
        for query in queries:
            found = [line for line in assemblies[entry] if query in line]
            assert found, (entry, query)
            for line in found:
                address = int(line.split(':', 1)[0], 16)
                assert any(int(r['start'], 16) <= address <= int(r['end_inclusive'], 16)
                           for r in indexed[entry]['ranges'])
                matches.append({'address': hex(address), 'instruction_text_sha256': sha(line.encode())})
        anchors.append({'claim': claim, 'procedure': entry, 'queries': list(queries),
                        'matches': matches, 'body_reference': entry})

    anchor('0x40bf80', 'catalog-containers-reset-caps-and-published-counts',
           'CALL 0x00438750', 'CALL 0x00403990', 'CALL 0x00403bb0',
           '0x40c818: MOV dword ptr [EDI + 0x2b34], ESI',
           '0x40d3f2: MOV dword ptr [EDI + 0x2b30], ESI', '0x40d495: MOV AL, BL')
    anchor('0x40bf80', 'game-link-fields-are-source-specific',
           '0x40cae7: LEA ECX, [EDI + 0x24]', '0x40cb1d: LEA ECX, [EDI + 0x34]',
           '0x40cb53: LEA ECX, [EDI + 0x20]')
    anchor('0x40bf80', 'DownloadPage-Windowed-receiver-and-value',
           '0x40cbd3: MOV ESI, EAX', '0x40cc18: MOV ECX, ESI',
           '0x40cc1a: CALL 0x00437c20', '0x40cc31: MOV byte ptr [EDI + 0xa0], AL')
    anchor('0x40bf80', 'game-eligibility-registry-and-profile-fallback',
           'CALL 0x00436a80', 'CALL 0x00436c90', 'CALL 0x00436a40',
           'CALL 0x00436d30', 'CALL 0x00436f30', 'CALL 0x0040ba50',
           'CALL 0x0043bcf0', 'CALL 0x0043bf20', '0x40cfbf: MOV byte ptr [EDI + 0xa1], AL')
    anchor('0x4384a0', 'first-matching-child-element', 'CALL 0x004372c0', '0x18', '0x30', '0x14')
    anchor('0x438800', 'next-matching-sibling-element', 'CALL 0x004372c0', '0x30', '0x14')
    anchor('0x437c20', 'raw-attribute-name-lookup', 'CALL 0x004372c0', '0x64', '0x34')
    anchor('0x438750', 'document-load-wrapper', 'CALL 0x00438580')
    anchor('0x435350', 'relative-file-normalization', 'CALL 0x00434ed0', '0x104')
    anchor('0x436a80', 'executable-leaf-check-and-eight-name-list', 'CALL 0x00435350', '0x636010')
    anchor('0x434ed0', 'filename-component-checks', 'CALL 0x004347c0', 'CALL 0x00432cc0')
    anchor('0x4355f0', 'existing-directory-normalization', '0x104')
    anchor('0x40ba50', 'HKCU-string-directory-lookup', 'PUSH 0x80000001', '0x104')
    anchor('0x426150', 'modal-install-path-selection-and-latch', 'CALL 0x00412190', 'CALL 0x0040d4d0', '0x10f2')
    anchor('0x40d4d0', 'path-commit-wrapper-target', 'CALL 0x00402000')
    anchor('0x402000', 'manual-directory-checks-SpeFile-and-EXE',
           '0x4020ba: LEA EAX, [EBX + 0x2bf4]', '0x4020d5: LEA EAX, [EBX + 0x2bdc]',
           'CALL 0x00435ad0', 'CALL 0x0043bf20', '0x2c74')
    anchor('0x412640', 'path-dialog-DDX-control', 'PUSH 0x406', '0xa8')
    anchor('0x4126d0', 'path-dialog-folder-browser', '0x104')
    anchor('0x431000', 'single-instance-and-frame-creation', 'CALL 0x0042e180', 'PUSH 0xcf8000', 'PUSH 0x80', '0x168')
    anchor('0x42e180', 'Frame-owns-CChildView', 'CALL 0x00403040', '0x120')
    anchor('0x42e260', 'Frame-close-check', 'CALL 0x0041a020')
    anchor('0x41a020', 'close-while-login-busy', '0x1a74', '0x1a75', 'CALL 0x0041b690')
    anchor('0x41b690', 'login-owner-release-and-posted-close', '0x1a78', 'CALL 0x004260e0', '0x1a74', '0x1a75', 'PUSH 0x10')
    anchor('0x41fa60', 'main-window-destroy-cleanup', 'CALL 0x00431f60', 'CALL 0x004260e0', 'CALL 0x004269a0', '0x332', '0x36c')
    anchor('0x4260e0', 'login-job-reference-release', '0x40')
    anchor('0x406290', 'catalog-job-two-references-and-worker-start', '0x2bc8', '0x2bc4')
    anchor('0x406a00', 'catalog-job-cancel-checks-and-completion', 'PUSH 0x80c9', 'PUSH 0x80cc')
    anchor('0x40a320', 'completion-takes-current-job-and-releases-owner', '0x2bc8', '0x2bc4')
    anchor('0x404410', 'catalog-job-destruction-cancel-and-bounded-wait', 'PUSH 0x1388', '0x2bc8', '0x2bc4')
    anchor('0x430f30', 'App-exit-channel-release-and-frame-alias-clear', '0xd8', '0xd4')
    anchor('0x430ce0', 'App-destructor-mutex-and-helper-cleanup', '0xcc', '63c7fc', '0xd8')

    # Literal names are metadata, never catalog contents or downloaded payloads.
    field_candidates = load(PRIVATE / 'catalog-field-call-candidates.json')
    assert field_candidates['procedure'] == '0x40bf80'
    data, seen = [], set()
    for call in field_candidates['calls']:
        for candidate in call['candidates']:
            address = int(candidate['string_address'], 16)
            blob = candidate['text'].encode('ascii') + b'\0'
            assert pe.read(address, len(blob)) == blob
            assert sha(blob) == candidate['sha256']
            if address not in seen:
                data.append({'role': candidate['text'], 'address': hex(address), 'bytes': len(blob),
                             'file_offset': pe.file_offset(address, len(blob)), 'sha256': sha(blob)})
                seen.add(address)
    assert len(field_candidates['calls']) == 52
    assert all(any(line.startswith(call['address'] + ':') and ('CALL ' + call['target'].replace('0x', '0x00')) in line
                   for line in assemblies['0x40bf80']) for call in field_candidates['calls'])
    deny = []
    for i, expected in enumerate(('cmd.exe', 'powershell.exe', 'pwsh.exe', 'wscript.exe',
                                  'cscript.exe', 'mshta.exe', 'rundll32.exe', 'regsvr32.exe')):
        pointer = 0x636010 + 4 * i
        address = struct.unpack('<I', pe.read(pointer, 4))[0]
        blob = expected.encode() + b'\0'
        assert pe.read(address, len(blob)) == blob
        deny.append({'pointer_address': hex(pointer), 'pointer_sha256': sha(pe.read(pointer, 4)),
                     'address': hex(address), 'name': expected, 'bytes': len(blob), 'sha256': sha(blob)})
    for address, expected in ((0x5d0ba0, 'Game'), (0x5d0c58, 'Path')):
        blob = expected.encode() + b'\0'
        assert pe.read(address, len(blob)) == blob
        if address not in seen:
            data.append({'role': expected, 'address': hex(address), 'bytes': len(blob),
                         'file_offset': pe.file_offset(address, len(blob)), 'sha256': sha(blob)})

    chains = []
    for vtable, name, retained in ((0x5d60bc, '.?AVCMainFrame@@', 'frame-message-chain.json'),
                                   (0x5d1ff0, '.?AVCDirInfo@@', 'game-path-dialog-message-chain.json')):
        result = vtable_info(pe, vtable)
        assert result == load(PRIVATE / retained)
        assert result['rtti_type_name'] == name and result['observed_base_chain_closed']
        chains.append(result)
    prefix = load(PRIVATE / 'app-codepointer-prefix.json')
    assert prefix['vtable_candidate'] == '0x5d6710'
    for i, row in enumerate(prefix['items']):
        assert int(row['slot'], 16) == i * 4
        address = struct.unpack('<I', pe.read(0x5d6710 + i * 4, 4))[0]
        assert address == int(row['target'], 16) and pe.executable(address)
    assert len(prefix['items']) == 68
    assert not pe.executable(struct.unpack('<I', pe.read(0x5d6820, 4))[0])

    derived_path = PRIVATE / 'derived-gui-callbacks.json'
    derived = load(derived_path)
    derived_plan = load(PRIVATE / 'derived-gui-plan.json')
    derived_receipt = load(PRIVATE / 'derived-gui-receipt.json')
    assert derived_plan['source_sha256'] == SHA and derived_plan['original_execution'] is False
    assert derived_receipt['exit_code'] == 0 and derived_receipt['source_unchanged'] is True
    assert derived_receipt['source_sha256_after'] == SHA and derived_receipt['original_execution'] is False
    assert derived_receipt['artifact_sha256'] == sha(derived_path.read_bytes())
    assert derived_plan['canonical_REA_unchanged'] and derived_receipt['canonical_REA_unchanged']
    for script in derived_plan['scripts']:
        assert sha((ROOT / script['path']).read_bytes()) == script['sha256']
    assert derived['originalExecution'] is False and derived['originalBytePatches'] is False
    expected = {'0042e370': (46, 0x5d62a0), '004127f0': (49, 0x5d21a0)}
    derived_entries = []
    for row in derived['entries']:
        size, table_row = expected[row['requestedEntry']]
        entry = int(row['requestedEntry'], 16)
        assert row['functionExistedBeforeSeed'] is False
        assert row['derivedBodyBytes'] == size and len(row['derivedBody']) == 1
        span = row['derivedBody'][0]
        assert int(span['start'], 16) == entry and int(span['end'], 16) == entry + size - 1
        assert struct.unpack('<I', pe.read(table_row + 20, 4))[0] == entry
        pos = entry
        for ins in row['instructions']:
            assert int(ins['address'], 16) == pos
            blob = bytes.fromhex(ins['bytesHex'])
            assert blob == pe.read(pos, len(blob))
            pos += len(blob)
        assert pos == entry + size
        derived_entries.append({'entry': hex(entry), 'bytes': size, 'instructions': len(row['instructions']),
                                'file_offset': pe.file_offset(entry, size), 'sha256': sha(pe.read(entry, size)),
                                'message_table_row': hex(table_row), 'pointer_address': hex(table_row + 20),
                                'message_row_sha256': sha(pe.read(table_row, 24)),
                                'all_instruction_bytes_match_original_PE': True,
                                'canonical_native_dossier': False,
                                'authority': 'analyst-seeded-independent-Ghidra'})
    assert {r['entry'] for r in derived_entries} == {'0x42e370', '0x4127f0'}

    summary = {'body_entries': len(bodies),
               'new_native_dossiers': sum(r['kind'] == 'new-native' for r in bodies),
               'reused_native_dossiers': sum(r['kind'] == 'reused-native' for r in bodies),
               'composed_reused_bodies': sum(r['kind'] == 'composed' for r in bodies),
               'range_reads': sum(len(r['ranges']) for r in bodies),
               'range_bytes': sum(s['bytes'] for r in bodies for s in r['ranges']),
               'semantic_anchor_groups': len(anchors), 'catalog_field_call_candidates': 52,
               'unique_field_literals': len(seen), 'metadata_literal_ranges': len(data),
               'derived_callbacks': len(derived_entries), 'derived_bytes': sum(r['bytes'] for r in derived_entries),
               'bound_message_chains': len(chains), 'App_code_pointer_prefix_entries': len(prefix['items'])}
    source_check = {'schema': 'moli.capability.launcher-catalog-install-source-check.v1',
                    'source': identity(TARGET),
                    'tools': {'REA': '6.7.0', 'Ghidra': '12.1.4', 'native_profile': NATIVE,
                              'workflow_profile': WORKFLOW}, 'summary': summary, 'bodies': bodies,
                    'instruction_anchors': anchors, 'data': data, 'executable_leaf_exclusions': deny,
                    'dialog_message_chains': chains, 'App_bounded_code_pointer_prefix': prefix,
                    'catalog_literal_candidates': identity(PRIVATE / 'catalog-field-call-candidates.json'),
                    'derived_callback_source': identity(derived_path), 'derived_callbacks': derived_entries,
                    'derived_callback_plan': identity(PRIVATE / 'derived-gui-plan.json'),
                    'derived_callback_receipt': identity(PRIVATE / 'derived-gui-receipt.json'),
                    'all_native_loaded_image_read_bytes_match_original_PE': True,
                    'read_memory_kind': 'static analyzer image, never live original process memory',
                    'limitations': ['Complete selected bodies and original-byte equality are not whole-program coverage.',
                                    'Retained standalone/workflow pseudocode plus native ranges/assembly is composed evidence, not a new native dossier.',
                                    'Two independent seeded callbacks are separate from the unchanged canonical REA analysis.',
                                    'Field literal candidates do not independently prove receiver or business ownership.',
                                    'MBCS locale, Win32 calls, storage and event interleavings were not exercised.']}
    write('launcher-catalog-install-source-check.json', source_check)

    facts = []

    def fact(fid, claim, entries, **extra):
        assert all(entry in indexed or entry in ('0x42e370', '0x4127f0') for entry in entries)
        facts.append({'id': fid, 'kind': 'fact', 'claim': claim, 'procedures': entries, **extra})

    fact('catalog-publication',
         'Both file loads and exact Gamelist/Games plus Regionlist/Regions containers precede row resets. '
         'After this gate the existing owner is populated in place, with caps, defaults and eligibility flags; '
         'this is not a proved all-or-nothing transaction. Normal return AL is false before the gate and true after traversal.',
         ['0x40bf80', '0x438750', '0x438580'],
         limits={'games': 15, 'regions': 40, 'game_region_members': 20, 'BIPs_per_region': 10,
                 'Galaxy_rows_per_region': 15, 'Args_gamecode_slots': 15},
         count_fields={'games': 'CChildView+0x2b30', 'regions': 'CChildView+0x2b34'})
    fact('XML-lookup',
         'Element and attribute names use case-sensitive raw-byte equality. FirstChildElement searches children, '
         'NextSiblingElement searches following siblings, both requiring node type1. Field extraction accepts only '
         'the immediate first child when it is type4; it does not concatenate descendant text or skip a leading non-text child.',
         ['0x40bf80', '0x4372c0', '0x4384a0', '0x438800', '0x437c20'])
    fact('game-row-fields',
         'The C82 producer uses the following byte offsets; matching names or addresses in another hash do not transfer these rules.',
         ['0x40bf80', '0x403990'],
         base='CChildView+0x2bd8', stride_bytes=164,
         string_fields={'Name': 0, 'EXE': 4, 'Argsline': 8, 'OldRegKey': 12, 'OldRegValue': 16,
                        'RegKey': 20, 'RegValue': 24, 'SpeFile': 28, 'OfficialSite': 32, 'CreateURL': 36,
                        'Code_attribute_raw': 40, 'PatchEXE': 44, 'ConfigEXE': 48, 'News': 52,
                        'Status': 56, 'IntroPage': 60, 'DownloadPage': 64},
         other_fields={'member_indices': 68, 'member_count': 148, 'numeric_code': 152,
                       'installed': 156, 'byte_9d': 157, 'old_registry_source': 158, 'byte_9f': 159,
                       'windowed': 160, 'eligible': 161},
         defaults={'strings': 'empty', '20_member_indices': -1, 'counts_and_code': 0,
                   'bytes_9c_through_9f': 0, 'windowed': 1, 'eligible': 0})
    fact('DownloadPage-Windowed',
         'Windowed is read from the selected DownloadPage element, only if that element exists. '
         'An existing attribute is interpreted as atoi(value)!=0; absent element/attribute retains default1.',
         ['0x40bf80', '0x403990'])
    fact('realm-row-fields',
         'Region rows carry patch/status/BIP metadata, per-game Args and Galaxy records. Args are indexed by '
         'atoi(Gamecode): negatives skipped, values>=15 clamped to14, repeated writes replace the same slot. '
         'Galaxy admits unsigned Gamecode<=14 and preserves document order up to15, counting each admitted type.',
         ['0x40bf80', '0x403bb0'], base='CChildView+0x3574', stride_bytes=412,
         fields={'Name': 0, 'PIP': 4, 'PPort': 8, 'Closed_text': 12, 'StatusIP': 16,
                 'BIP_count': 20, 'Galaxy_count': 24, '10_BIP_strings': 28, '15_Args_strings': 68,
                 '10_BIP_ports': 128, '15_Galaxy_type_counts': 168, '15_Galaxy_rows': 228,
                 'Closed_present': 408},
         Galaxy_row={'stride_bytes': 12, 'Gamecode': 0, 'Name_attribute': 4, 'immediate_text': 8},
         defaults='strings/counts/flags clear; all Galaxy counts clear; Closed presence sets flag even without text')
    fact('game-members',
         'Game/Regions/Region first-child text is matched case-sensitively against Region.Name. '
         'Each encountered member consumes one of20 entries even when unresolved, retaining default -1; '
         'no deduplication or ordinal-to-Code conversion is implied.', ['0x40bf80', '0x403990'])
    fact('game-admission',
         'A row remains in the capped catalog even if ineligible. Eligibility requires a nonempty <=6-byte '
         'digit-only Code whose checked numeric value equals the stored atoi value and is<=14, '
         'valid EXE and SpeFile paths, a valid SpeFile basename, optional valid PatchEXE, optional '
         'single-component ConfigEXE that is also an executable when nonempty, and paired valid registry key/value fields. '
         'Numeric Code need not equal the row ordinal.',
         ['0x40bf80', '0x436a40', '0x436a80', '0x436c90', '0x436d30', '0x436f30'])
    fact('filename-path-rules',
         'Relative paths are limited to<260 bytes and normalized to backslashes, with a single optional leading separator '
         'removed; doubled leading separators, empty/dot/dotdot components, edge whitespace, control bytes, '
         'a trailing dot, reserved DOS device stems and single-byte forbidden filename characters are rejected. '
         'Executable paths require a .exe suffix, leaf<=244 bytes and exclusion of the eight retained executable leaf names. '
         'Component and case operations include MBCS/locale-dependent calls.',
         ['0x435350', '0x434ed0', '0x4347c0', '0x432cc0', '0x434380', '0x436350', '0x436a80', '0x436a40'])
    fact('registry-field-rules',
         'Registry key text is relative, <241 bytes, with no leading/trailing backslash, empty/dot/dotdot component, '
         'quote, slash, control byte or edge whitespace. Value names are <256 bytes without either separator, quote, '
         'dot/dotdot, control byte or edge whitespace. Empty text is permitted only by the supplied flag and pairing rules.',
         ['0x436d30', '0x436f30', '0x40bf80'])
    fact('registry-path-lookup',
         'Installation discovery tries HKCU RegKey/RegValue, then OldRegKey/OldRegValue. It accepts terminated '
         'REG_SZ/REG_EXPAND_SZ within the260-byte buffer, expands environment variables when applicable, '
         'and requires the directory normalization/existence predicate. Old-registry success sets row+0x9e.',
         ['0x40bf80', '0x40ba50', '0x4355f0'])
    fact('profile-path-fallback',
         'A registry-discovered directory is published as installed and its Path/Game+rawCode profile write is attempted '
         'without checking that write result. Without such discovery, an eligible row reads the same profile key and '
         'becomes installed only when directory normalization succeeds. This discovery path does not perform the '
         'manual selection EXE/SpeFile existence pair.', ['0x40bf80', '0x4355f0'])
    fact('path-dialog',
         'Template295/CDirInfo binds edit1030 to dialog+0xa8, browse1009 to SHBrowseForFolderA and OK1 to '
         'the separately seeded callback. The OK callback performs UpdateData(1), copies at most260 bytes '
         'to Frame+0x277c before outer validation, then delegates through virtualslot0x180. '
         'The virtual delegate completion semantics are not independently closed here.',
         ['0x412190', '0x412640', '0x4126d0', '0x4127f0'],
         authority_note='OK body is analyst-derived independent static evidence, not a canonical native dossier')
    fact('manual-install-flow',
         'The ordinary selection path checks game/busy/preparation/modal/controller work conditions, saves and sets '
         'the modal latch, prefills the current per-game directory, and commits only on modal result1. '
         'Cancel and ordinary failure restore the latch. Success either advances preparation tostep3 or refreshes '
         'the view and selects the same raw game index.', ['0x426150', '0x40d4d0', '0x412290'])
    fact('manual-install-commit',
         '40d4d0 calls402000. Invalid game/index/null path/ineligible row sets error87. The chosen directory '
         'must normalize and exist, and joined SpeFile(row+0x1c) and EXE(row+4) must both exist. '
         'Failure sets161. The Path/Game+rawCode write precedes per-game path and installed-state publication; '
         'write failure preserves GetLastError or substitutes29. Success sets the installed word to1, '
         'updates current-game path aliases and reports success. Earlier dialog scratch writes are outside this commit.',
         ['0x40d4d0', '0x402000', '0x4355f0', '0x435ad0'])
    fact('helper-identity',
         '40d4f0 is a CString byte/MBCS Replace helper; it is not the installation apply target. '
         '4355f0 is existing-directory normalization, whereas40ba50 is the registry lookup owner.',
         ['0x40d4f0', '0x4355f0', '0x40ba50', '0x40d4d0'])
    fact('App-startup',
         'App startup431000 parses the bounded decimal ID: argument, registers the activation message and creates '
         'the named mutex. An existing instance selects a window with a nonzero activation property in another '
         'process, then verifies the property equals the registered message before posting activation; '
         'it closes its mutex handle and returnsfalse. New-instance startup initializes base/OLE/helpers/channel, '
         'allocates Frame0x7768, loads resource128 through slot0x168, clears both Frame aliases on load failure, '
         'otherwise shows/updates the frame, runs the existing startup-ACK helper and returnstrue.',
         ['0x431000', '0x430f80', '0x42e180'],
         dependencies=['Existing startup ACK/activation contracts remain separate; no new account or IPC observation.'])
    fact('Frame-ownership',
         'Frame constructor owns CChildView at+0x120; CChildView owns the Main object at+0x1a8. '
         'Frame WM_CREATE creates the child view. PreCreateWindow clears extended-style0x200 and replaces style '
         'with0x80000000; this does not itself prove that hMenu is cleared or that static menu128 is attached.',
         ['0x42e180', '0x403040', '0x42e2f0', '0x42e3a0'])
    fact('login-close',
         'Frame WM_CLOSE checks Main login-busy+0x1a74. If busy,41a020 sets close-request+0x1a75 and calls41b690. '
         '41b690 clears/releases the current login job reference, clears busy and related flags, kills the login timer, '
         'stops the channel and, when close-request was set, clears it and posts WM_CLOSE to the Frame. '
         'This closes the selected deferred-close state transition, without proving every late login callback or worker termination.',
         ['0x42e260', '0x41a020', '0x41b690', '0x4260e0'])
    fact('Main-destroy',
         'Main WM_DESTROY removes its activation property, takes and releases its login job reference, clears '
         'busy/close and related flags, unregisters its hotkey when present, removes the tray icon and kills '
         'the explicit timers0x332,100,0x65,0x36a,0x36c before base cleanup. Reference release is not worker termination.',
         ['0x41fa60', '0x431f60', '0x4260e0', '0x4269a0'])
    fact('catalog-job-ownership',
         'Catalog preparation allocates a64-byte job with two references, cancel0 and owner HWND, then starts406a00 '
         'and publishes job/handle at CChildView+0x2bc8/+0x2bc4. Start failure releases both references. '
         'The worker checks cancel before its0x80cc/0x80c9 posts and releases its reference on completion. '
         'The completion handler takes the current job, clears owner fields, closes the handle after a zero-time wait '
         'and releases the owner reference on observed return branches. The message contains no per-job identity.',
         ['0x406290', '0x406a00', '0x40a320'])
    fact('CChildView-destruction',
         'Destruction sets the catalog-job cancel flag, clears its owner HWND, waits at most5000ms when a handle exists '
         'and closes it, without checking the wait result, then releases its reference and clears both owner fields. '
         'Other retained process/event handles are closed. Closing a handle does not prove its process or thread stopped.',
         ['0x404410'])
    fact('App-exit',
         'App exit stops/releases its channel and clears the Frame alias before base exit. The destructor deletes '
         'its helper, closes the retained mutex and releases a remaining channel reference. '
         'The bounded68-entry code-pointer prefix and six option-mask accessors do not by themselves create new user requirements.',
         ['0x430f30', '0x430ce0', '0x431f20', '0x431f30', '0x431f40', '0x431f50', '0x431d60', '0x431d70'])

    remaining = [
        'Full XML lexer, encoding/entity/error behavior and external-parser compatibility; selected tree lookup is not a complete XML specification.',
        'Directory helper434200/434bd0 and all locale/filesystem/registry/profile persistence behavior; dynamic acceptance remains separate.',
        'Explicit directory clear/remove/replace operations beyond the observed selection and catalog fallback, plus exception-unwind publication/latch behavior.',
        'Actual static menu128 attachment/routing, other four static commands and resources296/30721/30734; do not infer capabilities from dormant/library metadata.',
        'App constructor/static initializer full body; vptr store401051 and the bounded code-pointer prefix do not supply its complete entry/body.',
        'All login, updater, patch, child-process and modal late-callback interleavings, queue draining, cancellation acknowledgement and reopen behavior.',
        'Catalog completion consumes the current owner job without a message identity; absence of harmful overlap still needs the complete scheduling guards.',
        'All-capability discovery/specification, cross-platform lifecycle/input/storage, real accounts and corresponding official compatibility.'
    ]
    contract = {'schema': 'moli.capability.launcher-catalog-install-contract.v1', 'source': identity(TARGET),
                'source_check': 'analysis/capability-first-v1/launcher-catalog-install-source-check.json',
                'capabilities': ['L01', 'L02', 'L05', 'L06', 'L08'], 'facts': facts,
                'scope_refinement': ['Same C82 source only; historical c7ba catalog/metadata specs remain separately qualified.',
                                     'Registry discovery and manual installation commit have different predicates and publication rules.',
                                     'The ordinary path dialog mutates a scratch buffer before the outer commit; no whole-flow atomicity claim.',
                                     'The selected login deferred-close path is now specified; whole-owner lifecycle remains open.'],
                'inferences': [{'kind': 'inference', 'claim': 'A cross-platform reconstruction can share catalog/admission/path-plan '
                               'and owner-state rules, while injecting filesystem/profile/window/process effects through platform ports.',
                               'implementation_added': False}],
                'remaining': remaining,
                'requirement_answers': [
                    {'question': 1, 'status': 'partially-answered', 'result': 'Same-source producer fields/defaults/caps/lookup, eligibility and selected failure/publication rules bound; full XML grammar remains.'},
                    {'question': 2, 'status': 'partially-answered', 'result': 'Template295, browse/OK, ordinary modal latch, manual commit and registry/profile discovery bound; clear/unwind/OS behavior remains.'},
                    {'question': 3, 'status': 'partially-answered', 'result': 'App startup/exit, Frame/CChildView/Main ownership and catalog job references bound; initializer and complete scheduling remain.'},
                    {'question': 4, 'status': 'partially-answered', 'result': 'Login deferred close, Main destruction, catalog worker cancellation/reference release bounded; all callbacks/process exits/reentry not closed.'},
                    {'question': 5, 'status': 'partially-answered', 'result': 'Frame resource128 load and popup-style mutation verified; menu attachment/remaining resources not established.'}],
                'original_execution': False, 'account_or_session_observed': False, 'runtime_features_changed': False,
                'all_capability_analysis_complete': False, 'implementation_gate_passed': False,
                'official_acceptance': False, 'full_goal_complete': False}
    write('launcher-catalog-install-contract.json', contract)
    print(json.dumps(summary, sort_keys=True))


if __name__ == '__main__':
    main()
