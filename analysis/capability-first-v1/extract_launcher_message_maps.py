"""Extract bounded source message-map candidates; class/resource ownership stays open."""
import json
import struct
from pathlib import Path

from extract_entry_inventory import PE, ROOT, digest, identity, load

OUT = Path(__file__).resolve().parent
LAUNCHER_SHA = 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'


def extract():
    source = ROOT / 'build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe'
    pe = PE(source, LAUNCHER_SHA)
    all_inventory = load(OUT / 'entry-inventory.json')
    inventory = all_inventory['launcher']
    assert inventory['source']['sha256'] == LAUNCHER_SHA
    bundle_path = ROOT / 'build/analysis/launcher-current-login-v1/rea-final.json'
    bundle = load(bundle_path)
    assert identity(bundle_path)['sha256'] == '142abcd35c1b4735bbfc4702d4bec929a393b74b04940735f6f4f500788e9eac'
    getter_record = next(e for e in bundle['records'] if e['evidence_id'] ==
        'ev_4bc8cba5f8da02b313d2f2b7eda99e84d590a4b37596e771384a3af793a90423')
    assert getter_record['subject']['digest']['sha256'] == LAUNCHER_SHA
    getter = next(item for item in getter_record['normalized_result']['items']
                  if item['procedure']['address'] == '0x430ff0')
    assert getter['status'] == 'ok' and '005d69b8' in getter['pseudocode']
    controls = {}
    for dialog in inventory['dialogs']:
        for control in dialog['controls']:
            controls.setdefault(control['id'], []).append(dict(
                dialog_resource=dialog['name'], language=dialog['language'],
                ordinal=control['ordinal'], source_file_offset=control['file_offset']))
    menu_commands = {node['command'] for menu in inventory['menus']
                     for node in menu['nodes'] if node['command'] not in (None, 0)}
    assert len(menu_commands) == all_inventory['summary']['launcher_menu_commands']
    tables = []
    for table, count, message_map, getter_va, expected_hash in [
        (0x5d4780, 43, 0x5d4ba0, 0x41c050, '3516cf3b8a5124656f18efe41bfbe636f5713daa16e54753d44f69cfbf3a1fff'),
        (0x5d6970, 2, 0x5d69b8, 0x430ff0, 'bd4784b38a88c32b76ef4531b41f0cfb8dcc04e2262362d1b9f56af74862bee2')]:
        raw = pe.read(table, (count + 1) * 24)
        assert digest(raw) == expected_hash and raw[-24:] == bytes(24)
        rows = []
        for ordinal in range(count):
            words = struct.unpack_from('<6I', raw, ordinal * 24)
            message, notification, first, last, signature, handler = words
            assert any(words) and pe.executable(handler) and first <= last
            matching_controls = [dict(control_id=i, candidates=controls[i])
                                 for i in controls if first <= i <= last] if message == 0x111 else []
            rows.append(dict(ordinal=ordinal, address=hex(table + ordinal * 24),
                             message=hex(message), notification=notification,
                             first_id=first, last_id=last, observed_signature_tag=signature,
                             handler=hex(handler),
                             same_id_resource_controls=matching_controls,
                             same_id_matches_prove_dialog_ownership=False,
                             matching_menu_commands=sorted(i for i in menu_commands if first <= i <= last)
                                 if message == 0x111 else [],
                             business_effects_specified=False))
        base, entries = struct.unpack('<2I', pe.read(message_map, 8))
        assert entries == table
        getter_bytes = pe.read(getter_va, 6)
        assert getter_bytes == b'\xb8' + message_map.to_bytes(4, 'little') + b'\xc3'
        tables.append(dict(address=hex(table), entries=count, bytes=len(raw),
                           file_offset=pe.file_offset(table, len(raw)), sha256=digest(raw),
                           rows=rows, message_map=hex(message_map), base_reference=hex(base),
                           base_reference_kind='unresolved-base-map-or-getter-reference',
                           message_map_bytes_sha256=digest(pe.read(message_map, 8)),
                           getter=dict(address=hex(getter_va), bytes=6,
                                       file_offset=pe.file_offset(getter_va, 6),
                                       sha256=digest(getter_bytes),
                                       authority='source-exact-MOV-EAX-immediate-RET',
                                       retained_batch_id=getter_record['evidence_id'] if getter_va == 0x430ff0 else None),
                           class_and_dialog_binding_closed=False))
    timer = next(e for e in bundle['records'] if e['evidence_id'] ==
        'ev_0fc4d7bd7dc6e097bc8a6e5d9f7d6e6bc16388f8c129e4b7896e723c127691d5')
    n = timer['normalized_result']
    assert timer['subject']['digest']['sha256'] == LAUNCHER_SHA
    assert n['complete'] and bytes.fromhex(n['bytes_hex']) == pe.read(0x5d4978, 24)
    wm_commands = [r for r in tables[0]['rows'] if r['message'] == '0x111']
    extra_ids = sorted({r['first_id'] for r in wm_commands if not r['same_id_resource_controls']})
    result = dict(schema='moli.capability-launcher-message-map.v1', source=identity(source),
                  tools=dict(REA='6.7.0', Ghidra='12.1.4',
                             extraction='bounded-original-file-layout-and-retained-getter/byte-read'),
                  retained_evidence_bundle=identity(bundle_path),
                  retained_timer_entry_byte_read_id=timer['evidence_id'],
                  resource_inventory=identity(OUT / 'entry-inventory.json'), tables=tables,
                  summary=dict(primary_entries=43, primary_wm_command_entries=len(wm_commands),
                               distinct_primary_command_ids=len({r['first_id'] for r in wm_commands}),
                               command_entries_matching_resource_ids=sum(bool(r['same_id_resource_controls']) for r in wm_commands),
                               extra_static_resource_unmatched_ids=extra_ids,
                               mapped_menu_commands=2, total_resource_menu_commands=len(menu_commands)),
                  format_references=[
                      'https://learn.microsoft.com/en-us/cpp/mfc/tn006-message-maps?view=msvc-170',
                      'https://learn.microsoft.com/en-us/windows/win32/menurc/wm-command'],
                  limitations=['The 24-byte entry layout is a fixed x86 sample observation, not a universal MFC ABI.',
                               'Map getters and entry bytes do not bind all dialog constructors/classes or inherited handlers.',
                               'Repeated IDs across resources remain multiple candidates; no global ID-to-dialog inference.',
                               'Extra IDs are source facts; dynamic-control/subwindow business identity remains unknown.',
                               'No handler effect, runtime UI, current official version or platform acceptance.'],
                  class_bindings_complete=False, all_launcher_capability_analysis_complete=False,
                  all_capability_analysis_complete=False, implementation_gate_passed=False,
                  original_execution=False, runtime_features_changed=False)
    (OUT / 'launcher-message-map.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result['summary']))


if __name__ == '__main__':
    extract()
