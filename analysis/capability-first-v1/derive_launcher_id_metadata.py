#!/usr/bin/env python3
"""Verify and specify fixed-source local GameID metadata behavior, offline."""
import hashlib
import json
import struct
from pathlib import Path

from extract_entry_inventory import PE, dialog_metadata
from derive_dispatch_bindings import vtable_info
from verify_launcher_metadata_md5 import verify as verify_md5

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'analysis/capability-first-v1'
PRIVATE = ROOT / 'build/analysis/capability-launcher-id-metadata-v1'
TARGET = ROOT / 'build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe'
SHA = 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'
NATIVE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
WORKFLOW = 'b9a9b4f868ae80c2a55407e7d3772a125da19a3d5e2e1765df03951cbd797158'


def sha(blob):
    return hashlib.sha256(blob).hexdigest()


def load(path):
    return json.loads(path.read_text())


def identity(path):
    return {'path': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size, 'sha256': sha(path.read_bytes())}


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def main():
    pe = PE(TARGET, SHA)
    bodies, assemblies, indexed = [], {}, {}
    for row in load(PRIVATE / 'body-input-manifest.json'):
        path = ROOT / row['path']
        record = load(path)
        assert record['subject']['digest']['sha256'] == SHA
        item = {'procedure': row['procedure'], 'kind': row['kind'], 'retained_view': identity(path)}
        if row['kind'] == 'composed-prior':
            assert record['canonical_function_dossier'] is False
            origin = record['pseudocode_source']
            parent = load(ROOT / origin['retained_parent'])
            assert parent['subject']['digest']['sha256'] == SHA
            assert parent['analysis_profile']['digest'] == WORKFLOW
            selected = parent['normalized_result']['items'][origin['item_index']]
            assert selected['status'] == 'ok' and selected['procedure']['address'] == row['procedure']
            assert selected['pseudocode'] == record['pseudocode']
            assert sha(record['pseudocode'].encode()) == origin['pseudocode_sha256']
            assert sha((ROOT / origin['source_bundle']).read_bytes()) == origin['source_bundle_sha256']
            info = load(path.parent / f"procedure_info-{row['procedure'][2:]}.json")
            asm = load(path.parent / f"procedure_assembly-{row['procedure'][2:]}.json")
            body, assembly = record['body'], record['assembly']
            assert info['normalized_result']['body'] == body and asm['normalized_result'].splitlines() == assembly
            item.update(canonical_native_dossier=False, pseudocode_parent=identity(ROOT / origin['retained_parent']),
                        pseudocode_parent_evidence_id=parent['evidence_id'], pseudocode_profile_digest=WORKFLOW,
                        range_evidence_id=info['evidence_id'], assembly_evidence_id=asm['evidence_id'])
        else:
            assert row['kind'] in ('new-native', 'reused-native')
            assert record['operation'] == 'analyze_function' and record['analysis_profile']['digest'] == NATIVE
            assert record['normalized_result']['procedure']['address'] == row['procedure']
            body, assembly = record['normalized_result']['procedure']['body'], record['normalized_result']['assembly']
            item.update(canonical_native_dossier=True, evidence_id=record['evidence_id'])
        assert body['available'] and body['contains_entry']
        ranges = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            assert pe.executable(start) and pe.executable(end) and start <= end
            read_path = PRIVATE / f'read-range-{start:x}.json'
            read = load(read_path)
            n = read['normalized_result']
            blob = bytes.fromhex(n['bytes_hex'])
            assert read['subject']['digest']['sha256'] == SHA and read['analysis_profile']['digest'] == NATIVE
            assert n['address'] == hex(start) and n['complete']
            assert n['returned_bytes'] == len(blob) == end - start + 1 and pe.read(start, len(blob)) == blob
            ranges.append({'start': hex(start), 'end_inclusive': hex(end), 'bytes': len(blob),
                           'file_offset': pe.file_offset(start, len(blob)), 'sha256': sha(blob),
                           'native_loaded_image_read_evidence_id': read['evidence_id'], 'retained_read': identity(read_path)})
        assert sum(x['bytes'] for x in ranges) == body['total_bytes'] == row['body_bytes']
        item['ranges'] = ranges
        assert row['procedure'] not in indexed
        bodies.append(item)
        indexed[row['procedure']], assemblies[row['procedure']] = item, assembly

    anchors = []

    def anchor(entry, claim, *needles):
        addresses = []
        for needle in needles:
            matches = [s for s in assemblies[entry] if needle in s]
            assert matches, (entry, needle)
            addresses.extend(s.split(':', 1)[0] for s in matches)
        owner = indexed[entry]
        for address in addresses:
            assert any(int(r['start'], 16) <= int(address, 16) <= int(r['end_inclusive'], 16) for r in owner['ranges'])
        anchors.append({'claim': claim, 'procedure': entry,
                        'body_evidence_id': owner.get('evidence_id', owner.get('assembly_evidence_id')),
                        'instruction_addresses': sorted(set(addresses))})

    anchor('0x41bba0', 'account-game-code-ID-key-format-and-hash', '0x21fc', 'PUSH 0x5d5380', 'CALL 0x0043b390', 'PUSH 0x5d538c')
    for entry, label, helper in [('0x41bd80', 'pin-order-key', '0x5d53a0'), ('0x41be90', 'pin-flag-key', '0x5d5394'),
                                  ('0x41ba90', 'move-order-key', '0x5d53b4'), ('0x41b980', 'move-anchor-key', '0x5d53c8')]:
        anchor(entry, label, 'CALL 0x0041bba0', 'PUSH ' + helper)
    anchor('0x43b390', 'digest-wrapper-and33-byte-hex-output-buffer', 'CALL 0x004410f0', '0x21')
    anchor('0x4412f0', 'MD5-initial-state', '0x67452301', '0xefcdab89', '0x98badcfe', '0x10325476')
    anchor('0x41d6a0', 'note-control-filter-and32-byte-ceiling', '0x20', '0x7f')
    anchor('0x4278c0', 'note-indirect-dialog-then-normalize-persist-publish', '0x5d454c', 'CALL 0x004197f0', 'CALL 0x00427430', 'CALL 0x00425790')
    anchor('0x4197f0', 'dynamic-note-template-four-controls', '0x80c800c0', 'PUSH 0x7208', 'PUSH 0x7207', 'PUSH 0x50010001', 'PUSH 0x50010000')
    anchor('0x420440', 'note-edit-limit-selection-and-focus', 'PUSH 0x7207', 'PUSH 0x20', 'PUSH 0xc5', 'PUSH 0xb1')
    anchor('0x422800', 'note-accept-reads-normalizes-before-base-accept', 'PUSH 0x7207', 'CALL 0x0041d6a0', 'CALL 0x0044f983')
    anchor('0x427a90', 'pin-pair-write-before-publication-and-undo-invalidation', 'CALL 0x004275e0', 'CALL 0x00427510', '0x1998', '0x1c9c', '0x1cdc')
    anchor('0x4199a0', 'capture64-entry-order-snapshot', '0x1ddc', '0x200', '0x40')
    anchor('0x416e40', 'copy-three-array-snapshot-with-owned-strings', '0x40', '0x200', 'CALL 0x004076d0')
    anchor('0x4182c0', 'snapshot-apply-writes-three-values-and-attempts-inclusive-rollback', 'CALL 0x00427510', 'CALL 0x00427360', 'CALL 0x00427270', '0x418549: MOV BL, 0x1', '0x418567: MOV AL, BL')
    anchor('0x41f2c0', 'reset-order-and-single-undo-command-routing', 'PUSH 0x7209', 'PUSH 0x720a', 'CALL 0x004182c0', '0x1998')
    anchor('0x41cc70', 'reorder-persistence-and-snapshot-publication', 'CALL 0x00427270', 'CALL 0x00427360', 'CALL 0x00427510', 'CALL 0x00416e40', '0x1998')
    anchor('0x423c30', 'reply-loads-notes-pin-order-move-order-anchor-and-clears-undo', 'CALL 0x0041c820', 'CALL 0x0041be90', 'CALL 0x0041bd80', 'CALL 0x0041ba90', 'CALL 0x0041c720', '0x1998')
    anchor('0x427430', 'note-write-uses-controller-profile-object', 'CALL 0x0041bba0', 'CALL 0x0041d6a0', '0x7758', 'CALL 0x0043bf20')
    anchor('0x43bf20', 'profile-string-write-passes-configured-filename', 'PUSH dword ptr [ECX + 0x4]', 'CALL dword ptr [0x005cf468]')
    anchor('0x43bcf0', 'profile-string-read-buffer256', '0x100')
    anchor('0x43ba60', 'profile-filename-is-initialized-from-module-path', 'PUSH 0x104')
    anchor('0x403040', 'CChildView-constructs-profile-object', '0x40345c: LEA ECX, [ESI + 0x7638]', 'CALL 0x0043ba60')
    anchor('0x428380', 'game-step0-context-route-holds-modal-latch', '0xa88', '0x10f2', 'CALL 0x00426150')

    data = []
    for address, literal in [(0x5d5380, b'%s|%d|%s'), (0x5d538c, b'GID_'), (0x5d5394, b'GID_PIN_'),
                             (0x5d53a0, b'GID_PIN_ORDER_V2_'), (0x5d53b4, b'GID_MOVE_ORDER_V2_'),
                             (0x5d53c8, b'GID_MOVE_ANCHOR_'), (0x5d53dc, b'GameIDNotes'), (0x5cfe90, b'%d')]:
        blob = literal + b'\0'
        assert pe.read(address, len(blob)) == blob
        data.append({'role': literal.decode(), 'address': hex(address), 'bytes': len(blob),
                     'file_offset': pe.file_offset(address, len(blob)), 'sha256': sha(blob)})

    bridges = []
    for address, slot in [(0x44eed2, 0x180), (0x44eee1, 0x184)]:
        blob = pe.read(address, 15)
        assert blob[:4] == bytes.fromhex('8b018b80') and blob[8] == 0xe8 and blob[13:] == b'\xff\xe0'
        assert int.from_bytes(blob[4:8], 'little') == slot
        guard = address + 13 + int.from_bytes(blob[9:13], 'little', signed=True)
        assert guard == 0x5bc9c0
        assert pe.read(guard, 15) == bytes.fromhex('5051528bc8ff1554fb5c005a5958c3')
        read_path = PRIVATE / f'read-range-{address:x}.json'
        read = load(read_path)
        assert read['subject']['digest']['sha256'] == SHA and read['analysis_profile']['digest'] == NATIVE
        assert read['normalized_result']['address'] == hex(address) and read['normalized_result']['returned_bytes'] == 15
        assert read['normalized_result']['complete'] and bytes.fromhex(read['normalized_result']['bytes_hex']) == blob
        bridges.append({'address': hex(address), 'bytes': 15, 'slot': hex(slot), 'file_offset': pe.file_offset(address, 15),
                        'sha256': sha(blob), 'read_evidence_id': read['evidence_id'], 'retained_read': identity(read_path),
                        'direct_call_target': hex(guard), 'authority': 'bounded-source-byte-derived', 'canonical_native_dossier': False})
    guard_path = PRIVATE / 'read-range-5bc9c0.json'
    guard = load(guard_path)
    assert guard['subject']['digest']['sha256'] == SHA and guard['analysis_profile']['digest'] == NATIVE
    assert guard['normalized_result']['address'] == '0x5bc9c0' and guard['normalized_result']['returned_bytes'] == 15
    assert guard['normalized_result']['complete']
    helper_blob = bytes.fromhex(guard['normalized_result']['bytes_hex'])
    assert helper_blob == pe.read(0x5bc9c0, 15) == bytes.fromhex('5051528bc8ff1554fb5c005a5958c3')

    chain = vtable_info(pe, 0x5d454c)
    assert chain == load(PRIVATE / 'note-dialog-message-chain.json')
    assert chain['rtti_type_name'] == '.?AVCGidNoteDialog@@' and chain['observed_base_chain_closed']
    slots = {hex(slot): hex(int.from_bytes(pe.read(0x5d454c + slot, 4), 'little')) for slot in [0x178, 0x180, 0x184]}
    assert slots == {'0x178': '0x420440', '0x180': '0x422800', '0x184': '0x44f7a0'}

    def wide(address):
        result = bytearray()
        for index in range(128):
            value = pe.read(address + index * 2, 2)
            result.extend(value)
            if value == b'\0\0':
                data.append({'role': 'dialog-text-hash-only', 'address': hex(address), 'bytes': len(result),
                             'file_offset': pe.file_offset(address, len(result)), 'sha256': sha(result)})
                return bytes(result)
        raise AssertionError('unterminated bounded dialog text')

    template = bytearray(struct.pack('<IIHhhhhHH', 0x80c800c0, 1, 4, 0, 0, 0x104, 0x52, 0, 0))
    template += wide(0x5d2a24) + struct.pack('<H', 9) + wide(0x5d4714)
    for style, x, y, width, height, control_id, cls in [
        (0x50000000, 8, 8, 0xf4, 0xc, 0x7208, 0x82),
        (0x50810080, 8, 0x17, 0xf4, 0x10, 0x7207, 0x81),
        (0x50010001, 0x70, 0x30, 0x40, 0x12, 1, 0x80),
        (0x50010000, 0xb8, 0x30, 0x40, 0x12, 2, 0x80)]:
        template += b'\0' * (-len(template) % 4)
        template += struct.pack('<IIhhhhHHHHH', style, 0, x, y, width, height, control_id, 0xffff, cls, 0, 0)
    metadata = dialog_metadata(bytes(template), 0)
    assert metadata['template'] == 'DIALOG' and metadata['control_count'] == 4
    assert [x['id'] for x in metadata['controls']] == [0x7208, 0x7207, 1, 2]
    for control in metadata['controls']:
        control['model_offset'] = control.pop('file_offset')
    for address in (0x5d46d8, 0x5d46e8, 0x5d4704, 0x5d470c):
        wide(address)
    form = {'authority': 'analyst-derived-static-template', 'constructor': '0x4278c0', 'builder': '0x4197f0',
            'helpers': ['0x4180e0', '0x418250'], 'vtable': '0x5d454c', 'class': '.?AVCGidNoteDialog@@',
            'base_map': 'inherited CDialog map; not nine new business commands', 'selected_slots': slots,
            'template_bytes': len(template), 'template_sha256': sha(template), 'metadata': metadata,
            'limitation': 'Model describes the allocation-success static builder path; no original dialog or generated template was executed.'}

    prototype_path = ROOT / 'build/analysis/capability-launcher-catalog-state-v1/prototype-experiment-family.json'
    prototype = load(prototype_path)
    view = prototype['callers_after']['0x41cc70']
    assert prototype['source_sha256'] == prototype['original_source_sha256_after'] == SHA
    assert prototype['canonical_REA_dossier'] is False
    assert view['instructions'] == prototype['callers_before']['0x41cc70']['instructions']
    for instruction in view['instructions']:
        blob = bytes.fromhex(instruction['bytes_hex'])
        assert pe.read(int(instruction['address'], 16), len(blob)) == blob
    derived = {'artifact': identity(prototype_path), 'procedure': '0x41cc70', 'authority': 'reused-analyst-prototype-view',
               'canonical_native_dossier': False, 'instructions': len(view['instructions']),
               'instruction_bytes': sum(len(bytes.fromhex(x['bytes_hex'])) for x in view['instructions']),
               'pseudocode_sha256': sha(view['pseudocode'].encode()), 'prototype_experiment_newly_run': False}
    assert derived['instructions'] == 653 and derived['instruction_bytes'] == 2594
    md5 = verify_md5(load(PRIVATE / 'launcher-function-441560.json'))
    md5['verifier'] = identity(OUT / 'verify_launcher_metadata_md5.py')
    source = {**identity(TARGET), 'official_current_version_proven': False}
    summary = {'body_entries': len(bodies), 'new_native_dossiers': sum(x['kind'] == 'new-native' for x in bodies),
               'reused_native_dossiers': sum(x['kind'] == 'reused-native' for x in bodies),
               'composed_reused_bodies': sum(x['kind'] == 'composed-prior' for x in bodies),
               'range_reads': sum(len(x['ranges']) for x in bodies),
               'range_bytes': sum(r['bytes'] for x in bodies for r in x['ranges']),
               'semantic_anchor_groups': len(anchors), 'data_ranges': len(data), 'derived_bridges': len(bridges),
               'bridge_bytes': 30, 'bridge_helper_bytes': 15, 'derived_dynamic_templates': 1,
               'reused_prototype_views': 1, 'MD5_model_compression_cases': 512, 'MD5_full_digest_cases': 12}
    assert summary['body_entries'] == 56 and summary['range_reads'] == 57 and summary['range_bytes'] == 30433
    source_check = {'schema': 'moli.capability.launcher-id-metadata-source-check.v1', 'source': source,
                    'tools': {'rea': '6.7.0', 'native_provider': 'Ghidra12.1.4', 'native_profile_digest': NATIVE,
                              'reused_workflow_profile_digest': WORKFLOW},
                    'summary': summary, 'bodies': bodies, 'instruction_anchors': anchors, 'data': data,
                    'dialog_message_chain': chain, 'virtual_command_bridges': bridges,
                    'bridge_helper': {'address': '0x5bc9c0', 'bytes': 15, 'sha256': sha(helper_blob),
                                      'read_evidence_id': guard['evidence_id'], 'retained_read': identity(guard_path),
                                      'observed_normal_return': 'saves/restores EAX/ECX/EDX around an indirect call; indirect callee semantics remain unmodelled'},
                    'derived_note_template': form, 'reused_reorder_view': derived, 'MD5_static_model': md5,
                    'all_native_loaded_image_read_bytes_match_original_PE': True,
                    'read_memory_kind': 'static Ghidra loaded image; not a process, VM or crash-dump capture',
                    'limitations': ['Native dossiers, composed reuse, byte-derived bridges, template model and prototype-derived view retain distinct identities.',
                                    '4182c0 has a void pseudocode signature, while the assembly sets AL from BL and callers test AL; return-type inference alone is insufficient.',
                                    'Static source/model checks do not prove actual UI, OS profile parsing, filesystem rollback/durability or current official acceptance.']}
    write('launcher-id-metadata-source-check.json', source_check)

    contract = {
        'schema': 'moli.capability.launcher-id-metadata-contract.v1', 'source': source,
        'source_check': 'analysis/capability-first-v1/launcher-id-metadata-source-check.json',
        'capabilities': ['L01', 'L02', 'L04', 'L08'],
        'facts': {
            'metadata_fields': {'ID': 'main+0x1a9c', 'note': 'main+0x1b9c', 'pinned_byte': 'main+0x1c9c',
                'pin_order_v2_i32': 'main+0x1cdc', 'move_order_v2_i32': 'main+0x1ddc', 'move_anchor': 'main+0x1edc',
                'undo_snapshot': 'main+0x1698, 768 bytes', 'undo_available': 'byte main+0x1998',
                'scope': 'fixed x86 arrays of64; source offsets are not portable API or wire fields'},
            'identity_keys': {'entry': '0x41bba0', 'empty_rule': 'empty account main+0x21fc or empty GameID yields an empty key',
                'input': 'printf-style raw byte format %s|%d|%s using account, current game code and GameID; no realm or additional case folding in this helper',
                'digest': 'MD516-byte result rendered as32 lowercase hexadecimal bytes; standard compression corroborated by the separate static-model analysis',
                'base': 'GID_ + digest', 'note': 'base key', 'pin_flag': 'GID_PIN_ + base suffix after first4 bytes',
                'pin_order_v2': 'GID_PIN_ORDER_V2_ + suffix', 'move_order_v2': 'GID_MOVE_ORDER_V2_ + suffix',
                'move_anchor': 'GID_MOVE_ANCHOR_ + suffix',
                'hash_failure_boundary': 'digest wrapper can return empty text; source concatenates its result rather than introducing a separate hash-success gate'},
            'storage': {'owner': 'profile object controller+0x7758 = CChildView+0x7638', 'constructor': '0x43ba60',
                'filename': 'module directory plus PlayOnline.ini; source uses a260-byte module-path buffer', 'section': 'GameIDNotes',
                'string_read': '43bcf0→GetPrivateProfileStringA with256-byte output buffer',
                'integer_read': '43bc90→GetPrivateProfileIntA',
                'string_write': '43bf20→WritePrivateProfileStringA; configured filename at profile+4',
                'integer_write': '43be30 formats %d and uses the same string-write API',
                'native_write_result': 'BOOL nonzero is propagated; it is not evidence of complete disk durability or a multi-key transaction',
                'portable_design_status': 'shared logic should consume explicit read/write results through a platform store; no new interface implemented'},
            'reply_load': {'entry': '0x423c30', 'rules': [
                'Positive reply path caps count64, clears undo availability and resets the64-row metadata arrays before populating.',
                '41c820 loads the base-key note and applies41d6a0 normalization.',
                'Pin flag is read as nonzero/zero; pin/move V2 ranks are retained only when signed-positive, otherwise0.',
                '41c720 loads MOVE_ANCHOR text; it is not the note loader.',
                'Ordinary list rebuild/filter and preset-ID consumption follow existing contracts.'],
                'not_claimed': 'all late replies, modal ownership and close/reentry conditions'},
            'note_normalization': {'entry': '0x41d6a0', 'byte_ceiling': 32,
                'rule': 'drop bytes<0x20 and0x7f at character starts; preserve spaces; append a2-byte unit when IsDBCSLeadByte reports a lead and another byte exists, otherwise append1; stop before exceeding32 bytes',
                'edge': 'source does not validate the trail byte; an unpaired final lead can be treated as one byte',
                'encoding_boundary': 'IsDBCSLeadByte uses the source OS environment;32 bytes is not32 arbitrary Unicode characters'},
            'note_dialog': {'entry': '0x4278c0', 'class': 'CGidNoteDialog', 'vtable': '0x5d454c',
                'construction': 'ordinary CDialog without a static resource ID;4197f0 builds an indirect standard template',
                'controls': [{'id': 0x7208, 'kind': 'static'}, {'id': 0x7207, 'kind': 'edit'}, {'id': 1, 'kind': 'accept'}, {'id': 2, 'kind': 'cancel'}],
                'init': '420440 supplies title/labels/current note; edit limit parameter32, select-all and focus; returns0',
                'accept': 'CDialog command1 bridge dispatches virtual+0x180→422800: read edit, normalize to local result, invoke ordinary base accept',
                'cancel': 'command2 bridge dispatches virtual+0x184→44f7a0, ordinary modal result2 path',
                'publication': 'outer handler processes only modal result1, normalizes again and calls427430; update note and rebuild only after storage success; failure reports an error after modal return',
                'clear_note': 'context7204 writes an empty normalized note and clears/rebuilds only on success',
                'lifecycle_limit': 'raw index is captured before the modal call; cross-state/late callback validity during the modal interval is not proved'},
            'pin_change': {'entry': '0x427a90', 'conditions': 'valid selected raw index and target flag differs',
                'pin': 'write pin1 then rank max signed rank of group1 +1; on success publish flag1/rank and clear order-undo availability',
                'unpin': 'write pin0 then rank0; on success publish and clear order-undo availability',
                'failure': 'attempt old flag/rank writes, keep memory unchanged, report failure; these rollback results are not checked',
                'integer_boundary': 'source uses32-bit max+1; numeric writer clamps nonpositive rank to0; no extra overflow policy introduced'},
            'order_snapshot': {'capture': '4199a0', 'copy': '416e40',
                'layout': '64 pin-rank integers at+0,64 move-rank integers at+0x100,64 owned anchor strings at+0x200',
                'includes_notes_or_pin_flags': False, 'ownership': 'string values are copied through source string ownership operations, not raw shared pointer snapshots',
                'apply': '4182c0 writes pin-rank, move-rank and anchor for each current received ID before publishing any candidate array',
                'failure': 'restore all three prior values for rows0 through the failing row inclusive; aggregate restoration results selects the failure message; return false',
                'success': 'publish the current-count candidate values, rebuild, return true',
                'transaction_limit': 'restoration can fail; source does not establish atomic multi-key or crash-durable updates'},
            'order_commands': {'menu': '0x41f2c0', 'reset_0x7209': 'capture prior order snapshot, apply zero ranks/empty anchors; on success copy prior snapshot to main+0x1698 and enable one undo',
                'undo_0x720a': 'enabled only while+0x1998 nonzero; apply saved snapshot, clear availability only on success',
                'up_down_0x7205_0x7206': 'disabled with active filter or invalid adjacent group position; delegate to41cc70',
                'not_import_export': '7209/720a are reset/single-undo operations in this bounded chain; no import/export specification or required feature follows from them'},
            'reorder': {'entry': '0x41cc70', 'view': 'reused source-identical analyst prototype view; canonical102 warnings retained',
                'admission': 'empty filter, valid selected raw index, valid changed ordinal within its same group',
                'nonzero_group': 'stable move within selected group, compute consecutive1-based pin ranks, persist changed ranks; failure attempts restoration of prior successful writes before returning without publication',
                'group_zero': [
                    'Keep existing anchors/move ranks and mark rows already customized or the moved row as tracked.',
                    'Find the rightmost untracked ordinal in the new group order.',
                    'Tracked rows before it receive B:<following GameID>; other tracked rows with a predecessor receive A:<previous GameID>; a tracked first row without a predecessor receives F.',
                    'Assign consecutive1-based move ranks to tracked rows, persist changed anchor/rank pairs; on a rank failure attempt to restore its anchor, then restore prior successful pairs.',
                    'Only after all required writes succeed publish affected anchors/ranks; preserve the old full order snapshot and enable one undo, then rebuild.'],
                'error_result': 'rollback writes in these reorder failure paths are attempts, not a proven successful transaction'},
            'context_inventory': {'source': '0x41f2c0 step4 ID list',
                'actions': {'0x1ef6': 'save current launch preset', '0x7201': 'edit note', '0x7202': 'pin', '0x7203': 'unpin',
                            '0x7204': 'clear note', '0x7205': 'move up', '0x7206': 'move down', '0x7209': 'reset order', '0x720a': 'single undo'},
                'coordinates': 'keyboard context request(-1,-1) uses selected item rectangle center; pointer requests are hit-tested and mapped to raw ID before menu actions',
                'game_step0': '428380 handles ordinary game-list context action1 through426150 and existing template295 constructor412190; installation/path application40d4d0 remains a separate unfinished chain'},
            'undo_invalidation': ['main constructor415050 clears availability', 'positive reply load423c30 clears availability',
                                  'successful pin/unpin clears availability', 'successful undo clears availability; note editing is outside the order snapshot']
        },
        'scope_refinement': {'previous_candidate': 'import/export and a custom-order dialog were mentioned among possible local-metadata gaps',
            'observed_result': 'the actual7209/720a chain is local reset/undo; notes use a runtime-built dialog; import/export is not an observed independent feature in this bounded chain',
            'role_correction': 'main+0x1998 is order-undo availability; prior generic dirty labels were corrected in the catalog-state generator/contract/source-check without changing native evidence or historical receipts',
            'discovery_boundary': 'this does not prove that no other program entry implements import/export; discovery stays open without inventing that capability'},
        'inferences': ['The MD5 classification combines full retained compression expressions, initialization/padding/hex code and a separate restricted static-model/reference comparison; original code was not executed.',
                       'A shared metadata owner with platform storage results can preserve source publication/rollback/undo semantics across hosts; this architecture is not implemented yet.'],
        'remaining': ['Exact source OS code page/IME/input semantics and native INI parsing/filesystem behavior versus target-platform storage.',
                      'All modal/async owner cancellation, close/reentry and cross-state validity; pending source paths outside this bounded chain remain open.',
                      'Complete XML/install/App initialization, template296/30721/30734 uses, four non-App static menu routes and remaining dynamic discovery.',
                      'Game common dispatch/graphics/input and every business lifetime, current-version game consumers, actual platform and official acceptance.'],
        'requirement_answers': [
            {'question': 1, 'status': 'partially-answered', 'answer': 'step4 metadata actions and runtime note template/virtual commands bound; step0 game path action source located but full path workflow remains open'},
            {'question': 2, 'status': 'answered-bounded-source', 'answer': 'notes/pins/relative ranks, account-game-ID keys, write-before-publication, rollback attempts and order undo ownership bound'},
            {'question': 3, 'status': 'answered-bounded-source', 'answer': '7209/720a are reset/single undo, not observed import/export; profile API/key/value serialization and failure paths specified for these actions'},
            {'question': 4, 'status': 'partially-answered', 'answer': 'constructor/reply/pin/undo invalidation and immediate writes bound; all modal/async owner close/reentry conditions remain open'}],
        'original_execution': False, 'account_or_session_observed': False, 'runtime_features_changed': False,
        'all_capability_analysis_complete': False, 'implementation_gate_passed': False, 'official_acceptance': False, 'full_goal_complete': False}
    write('launcher-id-metadata-contract.json', contract)
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == '__main__':
    main()
