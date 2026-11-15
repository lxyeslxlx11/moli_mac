"""Source-bound REA entry inventory. No target execution, assets, or UI text export."""
from pathlib import Path
import hashlib
import json
import re
import struct

ROOT = Path(__file__).resolve().parents[2]
PRIVATE = ROOT / 'build/analysis/capability-entry-inventory-v1'
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def identity(path):
    path = Path(path)
    data = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(data), sha256=digest(data))


def load(path):
    return json.loads(Path(path).read_text())


class PE:
    def __init__(self, path, expected):
        self.path = Path(path)
        self.raw = self.path.read_bytes()
        assert digest(self.raw) == expected, 'Source identity changed'
        pe = struct.unpack_from('<I', self.raw, 60)[0]
        assert self.raw[pe:pe + 4] == b'PE\0\0'
        opt = pe + 24
        assert struct.unpack_from('<H', self.raw, opt)[0] == 0x10b
        self.base = struct.unpack_from('<I', self.raw, opt + 28)[0]
        table = opt + struct.unpack_from('<H', self.raw, pe + 20)[0]
        self.sections = []
        for i in range(struct.unpack_from('<H', self.raw, pe + 6)[0]):
            at = table + i * 40
            virtual_size, rva, size, offset = struct.unpack_from('<IIII', self.raw, at + 8)
            flags = struct.unpack_from('<I', self.raw, at + 36)[0]
            self.sections.append((self.base + rva, size, offset, flags, virtual_size))

    def file_offset(self, va, size):
        hits = [offset + va - start for start, length, offset, _, _ in self.sections
                if start <= va and va + size <= start + length]
        assert len(hits) == 1, ('Unmapped or ambiguous file bytes', hex(va), size)
        return hits[0]

    def read(self, va, size):
        offset = self.file_offset(va, size)
        data = self.raw[offset:offset + size]
        assert len(data) == size
        return data

    def executable(self, va):
        return any(start <= va < start + length and flags & 0x20000000
                   for start, length, _, flags, _ in self.sections)


def admit_read(pe, name, va, size):
    evidence = load(PRIVATE / name)
    assert evidence['subject']['digest']['sha256'] == SHA
    assert evidence['analysis_profile']['digest'] == PROFILE
    result = evidence['normalized_result']
    assert result['complete'] and result['returned_bytes'] == size
    data = bytes.fromhex(result['bytes_hex'])
    assert data == pe.read(va, size)
    return data, dict(evidence_id=evidence['evidence_id'], address=hex(va),
                      file_offset=pe.file_offset(va, size), bytes=size,
                      sha256=digest(data), all_source_bytes_match=True)


def retained(path):
    evidence = load(ROOT / path)
    assert evidence['subject']['digest']['sha256'] == SHA
    assert evidence['analysis_profile']['digest'] == PROFILE
    return evidence


def dialog_metadata(data, file_offset):
    """Read standard/extended Microsoft templates; keep labels as hashes only."""
    at = 0

    def read(fmt):
        nonlocal at
        size = struct.calcsize(fmt)
        assert at + size <= len(data), 'Dialog resource bound'
        value = struct.unpack_from(fmt, data, at)
        at += size
        return value

    def ordinal_or_string():
        start = at
        first = read('<H')[0]
        if first == 0:
            return dict(kind='empty')
        if first == 0xffff:
            return dict(kind='ordinal', value=read('<H')[0])
        while read('<H')[0]:
            pass
        return dict(kind='text', utf16_bytes=at - start - 2,
                    sha256=digest(data[start:at - 2]))

    extended = data[2:4] == b'\xff\xff'
    if extended:
        version, signature, _, exstyle, style, count, x, y, width, height = read('<HHIIIHhhhh')
        assert (version, signature) == (1, 0xffff)
    else:
        style, exstyle, count, x, y, width, height = read('<IIHhhhh')
    menu, cls, title = ordinal_or_string(), ordinal_or_string(), ordinal_or_string()
    if style & 0x40:
        read('<HHBB' if extended else '<H')
        ordinal_or_string()
    controls = []
    for ordinal in range(count):
        at = (at + 3) & ~3
        start = at
        if extended:
            _, item_exstyle, item_style, ix, iy, iw, ih, control_id = read('<IIIhhhhI')
        else:
            item_style, item_exstyle, ix, iy, iw, ih, control_id = read('<IIhhhhH')
        item_class, label = ordinal_or_string(), ordinal_or_string()
        extra_count = read('<H')[0]
        # Standard creation size includes its WORD; extended extraCount excludes it.
        remaining = extra_count if extended else (extra_count - 2 if extra_count else 0)
        assert remaining >= 0 and at + remaining <= len(data)
        at += remaining
        controls.append(dict(ordinal=ordinal, id=control_id, window_class=item_class,
                             label=label, style=hex(item_style), exstyle=hex(item_exstyle),
                             bounds=[ix, iy, iw, ih], file_offset=file_offset + start,
                             bytes=at - start, sha256=digest(data[start:at])))
    assert len(data) - at <= 3 and not any(data[at:]), 'Unparsed dialog tail'
    return dict(template='DIALOGEX' if extended else 'DIALOG', style=hex(style),
                exstyle=hex(exstyle), bounds=[x, y, width, height], menu=menu,
                window_class=cls, title=title, control_count=count, controls=controls,
                consumed_bytes=at, zero_padding_bytes=len(data) - at)


def menu_metadata(data, file_offset):
    version, header = struct.unpack_from('<HH', data)
    assert version == 0 and header == 0, 'Only observed standard menu is admitted'
    at = 4
    nodes = []

    def word():
        nonlocal at
        assert at + 2 <= len(data)
        result = struct.unpack_from('<H', data, at)[0]
        at += 2
        return result

    def level(depth, parent):
        nonlocal at
        assert depth <= 16
        while True:
            start = at
            flags = word()
            popup = bool(flags & 0x10)
            command = None if popup else word()
            title_start = at
            while word():
                pass
            node = dict(ordinal=len(nodes), parent=parent, depth=depth,
                        flags=hex(flags), command=command, popup=popup,
                        file_offset=file_offset + start,
                        label_sha256=digest(data[title_start:at - 2]))
            nodes.append(node)
            assert len(nodes) <= 4096
            if popup:
                level(depth + 1, node['ordinal'])
            if flags & 0x80:
                return

    level(0, None)
    assert at == len(data), 'Unparsed menu bytes'
    return dict(template='MENU-v0', nodes=nodes, commands_decoded=True,
                consumed_bytes=at, command_count=sum(x['command'] not in [None, 0] for x in nodes))


def build():
    source = ROOT / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
    pe = PE(source, SHA)
    checks = []
    pointers, proof = admit_read(pe, 'classic-pointer-neighborhood.json', 0x5599f8, 536)
    checks.append(proof)
    desc, proof = admit_read(pe, 'classic-descriptors-flags.json', 0x52ddb8, 3235)
    checks.append(proof)
    modern, proof = admit_read(pe, 'modern-window-table.json', 0x559c10, 1980)
    checks.append(proof)
    main_tables, proof = admit_read(pe, 'main-state-tables.json', 0x50199c, 76)
    checks.append(proof)
    constructor = retained('build/analysis/game-battle-input-v1/468190-new.json')
    pseudo = constructor['normalized_result']['pseudocode']
    assert all(x in pseudo for x in ['PTR_DAT_005599f8', 'PTR_DAT_00559b04',
                                     'puVar15 = puVar15 + 8', 'puVar7[0xe] = puVar12[0xb]'])
    # Two adjacent 67-pointer arrays, corroborated by 66 contiguous descriptors
    # and one descriptor alias. The 68 live-object pool slots are a different bound.
    classic = []
    controls_total = 0
    descriptor_set = set()
    for window_id in range((0x559b04 - 0x5599f8) // 4):
        address = struct.unpack_from('<I', pointers, window_id * 4)[0]
        auxiliary = struct.unpack_from('<I', pointers, 268 + window_id * 4)[0]
        assert 0x52ddb8 <= address < 0x52ea18 and (address - 0x52ddb8) % 48 == 0
        descriptor_set.add(address)
        fields = struct.unpack('<12I', pe.read(address, 48))
        count, control_address = fields[7:9]
        assert count <= 4096 and controls_total + count <= 32768, 'Analysis budget exceeded'
        controls = []
        for ordinal in range(count):
            va = control_address + ordinal * 32
            raw = pe.read(va, 32)
            values = struct.unpack('<8I', raw)
            callback = values[7] or 0x4a31b0
            controls.append(dict(ordinal=ordinal, address=hex(va),
                                 file_offset=pe.file_offset(va, 32), sha256=digest(raw),
                                 type=values[0], payload_pointer=hex(values[6]),
                                 callback=hex(callback), callback_is_file_backed_code=bool(pe.executable(callback)),
                                 uses_default_callback=values[7] == 0))
        callbacks = dict(initializer=hex(fields[9]), frame=hex(fields[10]), destructor=hex(fields[11]))
        assert all(int(x, 16) == 0 or pe.executable(int(x, 16)) for x in callbacks.values())
        controls_total += count
        classic.append(dict(id=window_id, pointer_address=hex(0x5599f8 + window_id * 4),
                            descriptor_address=hex(address), file_offset=pe.file_offset(address, 48),
                            descriptor_sha256=digest(pe.read(address, 48)),
                            group_flag=desc[3168 + window_id], auxiliary_pointer=hex(auxiliary),
                            auxiliary_runtime_value_not_assumed=True, callbacks=callbacks,
                            descriptor_has_callbacks=any(fields[9:12]),
                            control_count=count, controls=controls))
    assert len(descriptor_set) == 66
    assert descriptor_set == set(range(0x52ddb8, 0x52ea18, 48))
    modern_rows = []
    for ordinal in range(99):
        window_id, callback, group, pad, dirty = struct.unpack_from('<5I', modern, ordinal * 20)
        assert group <= 2 and pad == 0 and dirty == 0
        assert callback == 0 or pe.executable(callback)
        modern_rows.append(dict(id=window_id, row_address=hex(0x559c10 + ordinal * 20),
                                callback=hex(callback), group=group, initial_dirty=dirty,
                                callback_present=callback != 0,
                                semantic_status='unclassified'))
    assert len({x['id'] for x in modern_rows}) == 99
    assert {x['id'] for x in modern_rows if not x['callback_present']} == {0, 100}
    lookup = load(PRIVATE / 'modern-lookup.json')
    assert all(x in lookup['normalized_result'] for x in ['00559c10', '0x55a3cc', 'piVar2 + 5'])
    main = retained('build/analysis/game-post-login-v1/5015a0-retained.json')
    jumps = main['normalized_result']['native_api']['jump_tables']
    primary = next(x for x in jumps if x['dispatch_address'] == '0x501684')
    cases = {int(x['case_value']): x['target_address'] for x in primary['mappings']}
    defaults = {x['target_address'] for x in primary['default_targets']}
    main_rows = []
    for number in range(1, 15):
        target = hex(struct.unpack_from('<I', main_tables, (number - 1) * 4)[0])
        assert target == cases.get(number) or (number not in cases and target in defaults)
        main_rows.append(dict(value=number, target=target, explicit_case=number in cases))
    assert len(cases) == 12
    protocol_path = ROOT / 'analysis/game-legacy-message-v1/dispatch-catalog.json'
    protocol = load(protocol_path)
    assert protocol['source_sha256'] == SHA
    for row in protocol['incoming'] + protocol['outgoing']:
        offset = row['tag_file_offset']
        assert digest(pe.raw[offset:offset + 4]) == row['tag_word_sha256']
    launcher_evidence = load(PRIVATE / 'launcher-resource-tree.json')
    resource_tree = launcher_evidence['normalized_result']
    launcher = PE(resource_tree['artifact']['path'], resource_tree['artifact']['sha256'])
    assert resource_tree['artifact']['sha256'] == 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'
    dialogs = []
    menus = []
    for resource in resource_tree['resources']:
        kind = resource['type'].get('id')
        if kind not in [4, 5]:
            continue
        location = resource['payload']['location']
        raw = launcher.raw[location['offset']:location['offset'] + location['bytes']]
        assert len(raw) == location['bytes'] and digest(raw) == resource['payload']['sha256']
        item = dict(resource_index=resource['index'], name=resource['name'],
                    language=resource['language'], file_offset=location['offset'],
                    bytes=location['bytes'], sha256=digest(raw))
        if kind == 5:
            item.update(dialog_metadata(raw, location['offset']))
            dialogs.append(item)
        else:
            item.update(menu_metadata(raw, location['offset']))
            menus.append(item)
    assert len(dialogs) == 14
    result = dict(schema='moli.capability-source-entry-inventory.v1', source=identity(source),
                  source_profile=PROFILE, tools=dict(REA='6.7.0', Ghidra='12.1.4'),
                  table_byte_checks=checks, classic_windows=classic,
                  modern_windows=modern_rows, main_state_slots=main_rows,
                  receive_entries=protocol['incoming'], send_entries=protocol['outgoing'],
                  launcher=dict(source=identity(launcher.path), evidence_id=launcher_evidence['evidence_id'],
                                resources=resource_tree['coverage'], dialogs=dialogs, menus=menus),
                  reused_evidence=[dict(path='build/analysis/game-battle-input-v1/468190-new.json',
                                        evidence_id=constructor['evidence_id']),
                                   dict(path='build/analysis/game-post-login-v1/5015a0-retained.json',
                                        evidence_id=main['evidence_id']), identity(protocol_path)],
                  new_lookup_evidence=lookup['evidence_id'],
                  summary=dict(classic_window_slots=len(classic), classic_unique_descriptors=66,
                               classic_control_occurrences=controls_total,
                               modern_table_rows=99, modern_callback_rows=97,
                               main_table_slots=14, main_explicit_states=12,
                               receive_entries=len(protocol['incoming']), send_entries=len(protocol['outgoing']),
                               launcher_dialogs=len(dialogs),
                               launcher_controls=sum(x['control_count'] for x in dialogs),
                               launcher_menu_commands=sum(x['command_count'] for x in menus)),
                  limitations=['Entry metadata is not complete behavior or runtime reachability.',
                               'Classic descriptor and auxiliary table boundaries are source-layout bounds, not arbitrary-ID admission checks.',
                               'Modern 0 and 100 are null callback rows; open helper excludes IDs outside 1..99.',
                               'Control callbacks and initial bytes do not establish every later mutation.',
                               'Launcher command-handler bindings, other versions, game menu paths and all capability semantics remain open.',
                               'No titles, strings, assets, executable payloads, credentials or source pseudocode are exported.'],
                  format_references=['https://learn.microsoft.com/en-us/windows/win32/dlgbox/dlgtemplateex',
                                     'https://learn.microsoft.com/en-us/windows/win32/dlgbox/dlgitemtemplateex',
                                     'https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-dlgtemplate',
                                     'https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-dlgitemtemplate',
                                     'https://learn.microsoft.com/en-us/windows/win32/menurc/menuheader',
                                     'https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-menuitemtemplate',
                                     'https://learn.microsoft.com/en-us/windows/win32/menurc/normalmenuitem',
                                     'https://learn.microsoft.com/en-us/windows/win32/menurc/popupmenuitem'],
                  original_execution=False, runtime_features_changed=False,
                  capability_discovery_complete=False, all_capability_analysis_complete=False)
    target = Path(__file__).with_name('entry-inventory.json')
    target.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result['summary']))


if __name__ == '__main__':
    build()
