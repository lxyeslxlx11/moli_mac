"""Bind window dispatch and MFC class/template observations to immutable samples."""
import json
import re
import struct
from pathlib import Path

from extract_entry_inventory import PE, ROOT, SHA, digest, identity, load

OUT = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/capability-dispatch-bindings-v1'
LAUNCHER_SHA = 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'


def dump(name, data):
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def evidence(path):
    x = load(path)
    return x.get('structuredContent', x)


def ranges(pe, spans):
    rows = []
    for span in spans:
        start, end = int(span['start'], 16), int(span['end'], 16)
        raw = pe.read(start, end - start + 1)
        rows.append(dict(start=hex(start), end=hex(end), bytes=len(raw),
                         file_offset=pe.file_offset(start, len(raw)), sha256=digest(raw)))
    return rows


def bind_bodies(pe, manifest, prefix):
    rows = []
    for item in load(PRIVATE / manifest):
        record = evidence(ROOT / item.get('source', item.get('path')))
        assert record['subject']['digest']['sha256'] == pe.sha_for_check
        assert record['analysis_profile']['digest'] == PROFILE
        assert record['evidence_id'] == item['evidence_id']
        procedure = record['normalized_result']['procedure']
        assert procedure['address'] == item['entry']
        assert procedure['body']['ranges'] == item['ranges']
        spans = ranges(pe, item['ranges'])
        for index, span in enumerate(spans):
            read = evidence(PRIVATE / f"{prefix}-bytes-{item['entry'][2:]}-{index}.json")
            n = read['normalized_result']
            assert read['subject']['digest']['sha256'] == pe.sha_for_check
            assert n['complete'] and n['returned_bytes'] == span['bytes']
            assert bytes.fromhex(n['bytes_hex']) == pe.read(int(span['start'], 16), span['bytes'])
            span['read_evidence_id'] = read['evidence_id']
        rows.append(dict(entry=item['entry'], evidence_id=item['evidence_id'],
                         dossier=identity(ROOT / item.get('source', item.get('path'))),
                         ranges=spans, role=item.get('role', 'source-bound-canonical')))
    return rows


def decode_return_map(pe, address):
    """Only accept observed immediate-return getters or bounded direct tail jumps."""
    chain = []
    seen = set()
    while address not in seen and len(chain) < 4:
        seen.add(address)
        raw = pe.read(address, 6)
        if raw[0] == 0xb8 and raw[5] == 0xc3:
            chain.append(dict(address=hex(address), bytes=6, sha256=digest(raw)))
            return int.from_bytes(raw[1:5], 'little'), chain
        if raw[0] == 0xe9:
            chain.append(dict(address=hex(address), bytes=5, sha256=digest(raw[:5])))
            address += 5 + int.from_bytes(raw[1:5], 'little', signed=True)
            continue
        return None, chain
    return None, chain


def message_chain(pe, getter):
    result = []
    seen = set()
    for _ in range(16):
        pointer, code = decode_return_map(pe, getter)
        if pointer is None or pointer in seen:
            return result, False
        seen.add(pointer)
        header = pe.read(pointer, 8)
        base, table = struct.unpack('<2I', header)
        entries = []
        count = 0
        while count < 512:
            raw = pe.read(table + count * 24, 24)
            words = struct.unpack('<6I', raw)
            if not any(words):
                break
            entries.append(dict(address=hex(table + count * 24), message=hex(words[0]),
                notification=words[1], first_id=words[2], last_id=words[3],
                observed_signature_tag=words[4], handler=hex(words[5]),
                handler_is_file_backed_code=bool(words[5]) and pe.executable(words[5])))
            count += 1
        assert count < 512, 'Sample-specific message-table bound exceeded'
        raw = pe.read(table, (count + 1) * 24)
        result.append(dict(map=hex(pointer), header_sha256=digest(header),
            entry_table=hex(table), table_bytes=len(raw), table_sha256=digest(raw),
            getter_chain=code, entries=entries, base_reference=hex(base)))
        if base == 0:
            return result, True
        getter = base
    return result, False


def vtable_info(pe, vtable):
    locator = int.from_bytes(pe.read(vtable - 4, 4), 'little')
    col = pe.read(locator, 20)
    _, offset, cd_offset, descriptor, hierarchy = struct.unpack('<5I', col)
    chars = bytearray()
    for index in range(200):
        value = pe.read(descriptor + 8 + index, 1)
        if value == b'\0':
            break
        chars.extend(value)
    else:
        raise AssertionError('Bounded RTTI name missing terminator')
    getter = int.from_bytes(pe.read(vtable + 0x28, 4), 'little')
    chain, complete = message_chain(pe, getter)
    return dict(vtable=hex(vtable), source_prefix_sha256=digest(pe.read(vtable - 4, 48)),
        locator=hex(locator), locator_sha256=digest(col), locator_object_offset=offset,
        construction_offset=cd_offset, type_descriptor=hex(descriptor),
        type_descriptor_sha256=digest(pe.read(descriptor, len(chars) + 9)),
        rtti_type_name=chars.decode('ascii'), hierarchy=hex(hierarchy),
        getter_slot_offset='0x28', getter=hex(getter), message_chain=chain,
        observed_base_chain_closed=complete)


def root_store_after(pe, record, target):
    lines = record['normalized_result']['assembly']
    at = next(i for i, line in enumerate(lines) if 'CALL ' + target in line)
    for line in lines[at + 1:at + 17]:
        match = re.match(r'^(0x[0-9a-f]+): MOV dword ptr \[(EDI|ESI|ECX|EBP \+ 0x[0-9a-f]+)\], (0x[0-9a-f]+)$', line)
        if match and int(match[3], 16) >= 0x5c0000:
            address = int(match[1], 16)
            head = pe.read(address, 2)
            count = 10 if head == b'\xc7\x85' else 6
            raw = pe.read(address, count)
            assert raw[0] == 0xc7 and int.from_bytes(raw[-4:], 'little') == int(match[3], 16)
            return dict(address=match[1], receiver=match[2], vtable=match[3],
                        bytes=count, sha256=digest(raw))
    raise AssertionError(('No source-owned vptr store after base call', record['evidence_id']))


def argument_push(pe, record, target, value):
    lines = record['normalized_result']['assembly']
    at = next(i for i, line in enumerate(lines) if 'CALL ' + target in line)
    candidates = [line for line in lines[max(0, at - 7):at] if f'PUSH 0x{value:x}' in line]
    assert len(candidates) == 1
    address = int(candidates[0].split(':', 1)[0], 16)
    opcode = pe.read(address, 1)
    count = 2 if opcode == b'\x6a' else 5
    raw = pe.read(address, count)
    assert opcode in (b'\x6a', b'\x68')
    actual = int.from_bytes(raw[1:], 'little', signed=opcode == b'\x6a') & 0xffffffff
    assert actual == value
    return dict(address=hex(address), value=value, bytes=count, sha256=digest(raw))


def launcher_bindings(pe):
    records = {p.stem.removeprefix('launcher-function-'): evidence(p)
               for p in PRIVATE.glob('launcher-function-*.json')}
    resource_inventory = load(OUT / 'entry-inventory.json')['launcher']
    dialogs = {d['name']['id']: d for d in resource_inventory['dialogs']}
    assert len(dialogs) == len(resource_inventory['dialogs'])
    base = records['44ee28']
    callers = {c['address'] for c in base['normalized_result']['callers']}
    classes = {}
    instances = []
    observations = []
    for address in sorted(callers):
        record = records[address[2:]]
        text = record['normalized_result']['pseudocode']
        arg = re.search(r'FUN_0044ee28\(([^,]+),', text).group(1).strip()
        numeric = bool(re.fullmatch(r'0x[0-9a-f]+|[0-9]+', arg))
        value = int(arg, 0) if numeric else None
        observations.append(dict(entry=address, evidence_id=record['evidence_id'],
            template_argument=arg, fixed_unsigned_value=value,
            matches_packaged_dialog=value in dialogs if value is not None else False))
        if value not in dialogs:
            continue
        # Fixed IDs must occur as explicit stack arguments before the base initializer.
        assembly = record['normalized_result']['assembly']
        at = next(i for i, line in enumerate(assembly) if 'CALL 0x0044ee28' in line)
        assert any(f'PUSH 0x{value:x}' in line for line in assembly[max(0, at - 7):at])
        store = root_store_after(pe, record, '0x0044ee28')
        vtable = int(store['vtable'], 16)
        classes.setdefault(vtable, vtable_info(pe, vtable))
        instances.append(dict(template_id=value, source_entry=address,
            source_role='constructor' if address != '0x431620' else 'stack-dialog-in-menu-handler',
            evidence_id=record['evidence_id'], base_initializer='0x44ee28',
            base_argument=value, argument_push=argument_push(pe, record, '0x0044ee28', value),
            vptr_write=store, final_vtable=hex(vtable),
            byte_bound_source_relationship=True, runtime_presentation_verified=False))
    # Surface receives different template IDs; each caller then writes its leaf vtable.
    for address, template in [('0x4156c0', 7927), ('0x422270', 7900)]:
        record = records[address[2:]]
        text = record['normalized_result']['pseudocode']
        assert f'FUN_00415830(0x{template:x},' in text
        surface = root_store_after(pe, records['415830'], '0x0044ee28')
        leaf = root_store_after(pe, record, '0x00415830')
        for store in [surface, leaf]:
            vtable = int(store['vtable'], 16)
            classes.setdefault(vtable, vtable_info(pe, vtable))
        instances.append(dict(template_id=template, source_entry=address,
            source_role='derived-constructor' if template == 7927 else 'conditional-stack-dialog-in-command-handler',
            evidence_id=record['evidence_id'], base_initializer='0x415830 -> 0x44ee28',
            forwarded_template_argument=template, intermediate_vtable=surface['vtable'],
            argument_push=argument_push(pe, record, '0x00415830', template),
            vptr_write=leaf, final_vtable=leaf['vtable'],
            byte_bound_source_relationship=True, runtime_presentation_verified=False))
    app = vtable_info(pe, 0x5d6710)
    global_store = pe.read(0x401051, 10)
    assert global_store == bytes.fromhex('c70500c8630010675d00')
    old_bundle = load(ROOT / 'build/analysis/launcher-current-login-v1/rea-final.json')
    old_read = next(e for e in old_bundle['records'] if e['evidence_id'] ==
        'ev_eb378e556d3347c7de66f9f6cc4eb7fa9c47fb71b417aa6fa5cec8b0296c39b5')
    assert old_read['subject']['digest']['sha256'] == LAUNCHER_SHA
    assert bytes.fromhex(old_read['normalized_result']['bytes_hex']) == pe.read(0x401040, 96)
    classes[0x5d6710] = app
    bound_ids = {item['template_id'] for item in instances}
    assert bound_ids == {100, 130, 133, 211, 282, 287, 295, 306, 318, 7900, 7927}
    main = next(item for item in instances if item['template_id'] == 133)
    assert main['final_vtable'] == '0x5d3540'
    assert classes[0x5d3540]['message_chain'][0]['map'] == '0x5d4ba0'
    assert app['message_chain'][0]['map'] == '0x5d69b8'
    menu_ids = sorted({node['command'] for menu in resource_inventory['menus']
                       for node in menu['nodes'] if node['command'] not in (None, 0)})
    menu_routes = []
    for command in menu_ids:
        matches = [dict(map=node['map'], handler=row['handler'])
                   for node in app['message_chain'] for row in node['entries']
                   if row['message'] == '0x111' and row['notification'] == 0
                   and row['first_id'] <= command <= row['last_id']]
        menu_routes.append(dict(command=command, matching_app_ancestry_entries=matches,
            first_app_match=matches[0] if matches else None,
            routing_precondition='only if command routing reaches this App object',
            menu_attachment_and_runtime_route_verified=False))
    existing = load(OUT / 'launcher-message-map.json')
    assert len(classes[0x5d3540]['message_chain'][0]['entries']) == 43
    main_controls = {c['id'] for c in dialogs[133]['controls']}
    commands = []
    for row in existing['tables'][0]['rows']:
        if row['message'] == '0x111':
            commands.append(dict(message=row['message'], notification=row['notification'],
                first_id=row['first_id'], last_id=row['last_id'], handler=row['handler'],
                class_vtable='0x5d3540', template_id=133,
                matches_this_template=any(row['first_id'] <= i <= row['last_id'] for i in main_controls),
                handler_business_specification_closed=False))
    assert sum(c['matches_this_template'] for c in commands) == 19
    summaries = []
    for template, dialog in sorted(dialogs.items()):
        matching = [item for item in instances if item['template_id'] == template]
        summaries.append(dict(template_id=template, controls=dialog['control_count'],
            resource_sha256=dialog['sha256'], observed_source_bindings=matching,
            usage_status='class-and-template-id-bound' if matching else 'usage-path-unclosed',
            implied_required_feature=False, runtime_usage_verified=False))
    return dict(schema='moli.capability-launcher-dialog-bindings.v1', source=identity(pe.path),
        tools=dict(REA='6.7.0', Ghidra='12.1.4', profile=PROFILE),
        flat_message_map_input=identity(OUT / 'launcher-message-map.json'),
        base_initializer_evidence_id=base['evidence_id'],
        modal_loader_evidence_id=records['44f422']['evidence_id'],
        base_initializer_rule='Same receiver stores supplied ID at+0x80 and low16 at+0x84; modal loader uses+0x84 in FindResourceA(type5).',
        base_callers=observations, classes=list(classes.values()), dialogs=summaries,
        main_wm_command_bindings=commands,
        app_menu_route_candidates=menu_routes,
        app_owner=dict(global_address='0x63c800', vtable='0x5d6710',
            vptr_store='0x401051', old_byte_read='ev_eb378e556d3347c7de66f9f6cc4eb7fa9c47fb71b417aa6fa5cec8b0296c39b5',
            vptr_store_sha256=digest(global_store),
            destructor='0x430ce0', constructor_body_recovered=False),
        menu_effects=[dict(command=57664, handler='0x431620', kind='fact',
            effect='Construct stack About object with template100, set leaf vtable and invoke modal loader, then destroy it.',
            runtime_verified=False), dict(command=57665, handler='0x431690', kind='fact',
            effect='Call0x4269a0 then0x45c22f; latter sends WM_CLOSE to app main-window handle.',
            cleanup_semantics_closed=False, process_exit_guaranteed=False)],
        excluded_numeric_candidate=dict(value=296, address='0x42dfe9', owner='0x42dfb0',
            evidence_id=records['42dfb0']['evidence_id'],
            reason='Argument in a deleting-destructor branch after base destruction; not an observed template load.',
            proves_template_unused=False),
        summary=dict(packaged_dialogs=14, dialogs_with_source_binding=len(bound_ids),
            unclosed_template_ids=sorted(set(dialogs) - bound_ids), base_initializer_callers=18,
            class_vtables_observed=len(classes), scoped_main_command_entries=len(commands),
            main_command_entries_matching_template133=sum(c['matches_this_template'] for c in commands)),
        format_references=['https://learn.microsoft.com/en-us/cpp/mfc/reference/cdialog-class?view=msvc-170',
                           'https://learn.microsoft.com/en-us/cpp/mfc/tn006-message-maps?view=msvc-170'],
        limitations=['Static class/ID relationships do not prove actual window presentation or resource-language/module selection.',
            'Surface is a shared base; the two observed callers overwrite different leaf vtables.',
            'Constructor calls and message-map ancestry do not close handler conditions, DDX or state lifecycle.',
            'Unbound resources are not declared unused; packaged resources are not automatically user requirements.',
            'Decompiler library names alone are not semantics; pointer/argument and loader bytes are separate evidence.'],
        all_dialog_usage_closed=False, all_launcher_capability_analysis_complete=False,
        implementation_gate_passed=False, original_execution=False, runtime_features_changed=False)


def shared_frame_recovery(game):
    import hashlib
    P = ROOT / 'build/analysis/capability-shared-dispatch-v1'
    manifest = P / 'source-inputs.json'
    assert digest(manifest.read_bytes()) == '1758147134ad56c1604df08f42436dfee7715b10eae1b2143dd58dc065fa6c5b'
    cache = {}
    def read(path):
        if path not in cache: cache[path] = load(path)
        return cache[path]
    def pointer(value, ptr):
        for part in ptr.split('/')[1:] if ptr else []:
            value = value[int(part)] if isinstance(value, list) else value[part]
        return value
    def canonical(value):
        return digest(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
    for row in read(manifest)['files']:
        assert identity(ROOT / row['path']) == row, row['path']
    selection = read(P / 'source-selection.json')
    views, records, direct_flows = [], {}, []
    native_bytes = derived_bytes = derived_instructions = reduced_bytes = native_lines = 0
    for row in selection['entries']:
        path = ROOT / row['file']['path']
        assert identity(path) == row['file']
        r = pointer(read(path),row['pointer'])
        assert canonical(r) == row['record_sha256']
        native = row['kind'] == 'native'
        derived = row['kind'] == 'derived'
        if derived:
            assert hex(int(r['requestedEntry'],16)) == row['entry'] and r['decompileCompleted']
            assert r['status'] == 'derived-static-export'
            spans, size, text = r['derivedBody'], r['derivedBodyBytes'], r['pseudocode']
        else:
            assert r['subject']['digest']['sha256'] == SHA
            assert r['analysis_profile']['digest'] == PROFILE
            assert r['normalized_result']['procedure']['address'] == row['entry']
            n = r['normalized_result']; body = n['procedure']['body']
            assert body['available'] and body['contains_entry']
            spans, size, text = body['ranges'], body['total_bytes'], n['pseudocode']
        proof = ranges(game,spans)
        declared = {a for s in proof for a in range(int(s['start'],16),int(s['end'],16)+1)}
        assert len(declared) == size
        boundaries = []
        if derived:
            covered = set()
            for i, ins in enumerate(r['instructions']):
                at = int(ins['address'],16); raw = bytes.fromhex(ins['bytesHex'])
                assert raw == game.read(at,len(raw))
                area = set(range(at,at+len(raw))); assert not covered & area
                covered |= area; boundaries.append((at,ins['text']))
            assert covered == declared
            derived_bytes += size; derived_instructions += len(boundaries)
        else:
            for line in n['assembly']:
                m = re.match(r'\s*(0x[0-9a-fA-F]+):\s*(.*)',line); assert m,line
                at = int(m[1],16); assert at in declared
                boundaries.append((at,m[2]))
            if native: native_bytes += size; native_lines += len(boundaries)
            else: reduced_bytes += size
        for at, ins_text in boundaries:
            end = next(int(s['end'],16)+1 for s in proof if int(s['start'],16)<=at<=int(s['end'],16))
            if end-at < 5: continue
            raw = game.read(at,5)
            if raw[0] not in (0xe8,0xe9): continue
            target = (at+5+struct.unpack('<i',raw[1:])[0]) & 0xffffffff
            kind = 'CALL' if raw[0]==0xe8 else 'tail-JMP'
            assert re.search(r'\b'+('CALL' if raw[0]==0xe8 else 'JMP')+r'\b',ins_text,re.I)
            assert re.search(r'0x0*'+format(target,'x')+r'\b',ins_text,re.I)
            direct_flows.append(dict(source=hex(at),target=hex(target),kind=kind,owner=row['entry'],bytes_hex=raw.hex()))
        records[row['entry']] = r
        views.append(dict(**row,ranges=proof,declared_body_bytes=size,
            derived_instructions_byte_verified=len(boundaries) if derived else 0,
            native_listing_boundaries=len(boundaries) if native else 0,pseudocode_sha256=digest(text.encode()),
            semantic_scope='Only the supplement clauses; no full caller, alias, or runtime closure.'))
    assert len(views)==18 and sum(q['kind']=='native' for q in views)==12
    auth = read(P/'record-authentication.json')
    assert auth['passed'] and auth['complete_records_factory_validated']==12
    assert not auth['original_snapshot_or_bundle_factory_validated']
    query = read(P/'original-byte-dispatch-query.json')
    listing = read(P/'candidate-listing-observations.json')
    receipt = read(P/'candidate-listing-receipt.json')
    assert receipt['status']=='read-only-listing-bytes-verified' and receipt['exit_code']==0
    assert receipt['source_project_unchanged'] and receipt['original_PE_unchanged'] and not receipt['seeding_requested']
    assert listing['executableSHA256']==SHA and not listing['metadataMutationRequested']
    for ins in listing['instructions'].values():
        raw = bytes.fromhex(ins['bytesHex']); assert len(raw)==ins['length']
        assert raw==game.read(int(ins['address'],16),len(raw))
    bound, writers, table, non_reference, helpers = [], [], [], [], []
    for mapping in listing['mappings']:
        parts=mapping['queryPointer'].split('/'); q=query[parts[1]][int(parts[2])]
        ins=listing['instructions'][mapping['instructionAddress']]
        at=int(ins['address'],16); target=int(q.get('value',q.get('target')),16)
        assert at<=int(mapping['queryAddress'],16)<at+ins['length']
        refs=[r for r in ins['references'] if int(r['to'],16)==target]
        item=dict(query_pointer=mapping['queryPointer'],instruction_address=hex(at),
            instruction_hex=ins['bytesHex'],instruction_text=ins['text'],owner_entry=ins.get('ownerEntry'),
            target=hex(target),target_references=refs)
        bound.append(item)
        if parts[1]=='edge_candidates':
            raw=bytes.fromhex(ins['bytesHex'])
            assert at==int(q['source'],16) and len(raw)==5 and raw[0]==0xe8
            assert target==(at+5+struct.unpack('<i',raw[1:])[0])&0xffffffff and refs
            helpers.append(item)
        else:
            assert struct.pack('<I',target)==game.read(int(q['address'],16),4)
            if not refs: non_reference.append(item)
            if q['in_table'] and refs: table.append(item)
            op0=ins['operands'][0] if ins['operands'] else ''
            if target in {0xc2056c,0xc20570,0xc1dd94,0xf5f050,0xc450a8} and ins['mnemonic']=='MOV' and '[' in op0 and any(int(v,16)==target for v in re.findall(r'0x[0-9a-fA-F]+',op0)):
                writers.append(item)
    assert len(bound)==128 and len(table)==19 and len(non_reference)==2 and len(helpers)==20
    assert len(writers)==36
    by_target={hex(t):sum(int(q['target'],16)==t for q in writers) for t in [0xc2056c,0xc20570,0xc1dd94,0xf5f050,0xc450a8]}
    assert by_target=={'0xc2056c':8,'0xc20570':5,'0xc1dd94':12,'0xf5f050':8,'0xc450a8':3}
    assert query['counts']['callback_column_literal_candidates']==0 and query['counts']['direct_callback_candidates']==0
    tokens={
        '0x4ea1b0':['switch(DAT_00f5f17c)','case 9:','case 0xfa:','case 0xfc:','FUN_00468e50','FUN_00467ec0','iVar1 < 8'],
        '0x44eb10':['DAT_00614888 == 0','FUN_0040a090','FUN_004ea460(1)','DAT_00c1dd94 = 0','FUN_0046c6b0(0x27'],
        '0x4eada0':['FUN_00443e50','DAT_00c450a8 = 0','DAT_00f5f050 = 0'],
        '0x4f06f0':['DAT_00924f30 == 0','pcVar6 = &DAT_00f5eb10','pcVar6 = pcVar6 + 0x1c','(int)pcVar6 < 0xf5f050'],
        '0x501a50':['case 3:','FUN_004eadc0','FUN_0044eb10','FUN_004ea400','DAT_00c1dd94 = FUN_004ea6f0(1)','FUN_004ea5b0(100)'],
        '0x46ab90':['FUN_0046aa50','FUN_0046a0e0','DAT_00c3b2ac','DAT_00c3b2ac + 0x30','iVar2 + 0x34'],
        '0x4d3610':['iVar1 == 2','DAT_00f5f17c != 10','DAT_00c1dd94 = 0'],
        '0x4d3820':['iVar3 == 2','DAT_00f5f17c != 10','DAT_00c1dd94 = 0'],
        '0x4f3810':['DAT_00924f30 == 0','DAT_00f5f050 = 1'],
        '0x4f3a10':['DAT_00924f30 == 0','DAT_00f5f050 = 2'],
        '0x4f3270':['DAT_00c450a8 = param_2'],
        '0x4ef870':['DAT_00f5f17c == 9','DAT_00c1dd94 = FUN_004ea6f0(1)'],
        '0x4f3430':['DAT_00924f30','DAT_00c1dd94 = FUN_004ea6f0(1)']}
    for entry, values in tokens.items():
        r=records[entry]; text=r['pseudocode'] if 'pseudocode' in r else r['normalized_result']['pseudocode']
        for value in values: assert value in text,(entry,value)
    end_record=records['0x4f06f0']['normalized_result']
    assert any('MOV dword ptr [EBX + -0x8], EAX' in s for s in end_record['assembly'])
    assert any('0x4f0796: CMP EBX, 0xf5f050' in s for s in end_record['assembly'])
    closed=read(P/'rea-final-closed.json')['structuredContent']['result']
    assert not closed['open'] and not closed['cleanup_pending']
    assert read(P/'rea-export.json')['structuredContent']['result']['records']==7
    assert read(P/'rea-close.json')['structuredContent']['result']['evidence_records']==7
    summary=dict(source_views=18,complete_native_records=12,reused_native_records=8,new_native_observations=4,
        reused_derived_views=5,retained_reduced_projections=1,native_body_bytes=native_bytes,
        native_listing_boundaries=native_lines,derived_body_bytes=derived_bytes,
        derived_instructions_byte_verified=derived_instructions,reduced_projection_bytes=reduced_bytes,
        bound_candidates=128,typed_target_literal_candidates=106,table_address_references=19,
        non_reference_literal_candidates=2,verified_helper_CALLs=20,syntactic_MOV_memory_destinations=36,
        destination_counts=by_target,imported_snapshot_records=3,REA_current_new_records=4,
        REA_export_records=7,REA_snapshot_records=7,REA_session_closed=True,
        product_code_changed=False,all_capability_analysis_complete=False)
    return dict(manifest=identity(manifest),selection=identity(P/'source-selection.json'),
        source_views=views,authentication=identity(P/'record-authentication.json'),
        original_byte_query=identity(P/'original-byte-dispatch-query.json'),
        read_only_listing=identity(P/'candidate-listing-observations.json'),
        read_only_listing_receipt=identity(P/'candidate-listing-receipt.json'),
        candidate_bindings=bound,syntactic_memory_destinations=writers,table_address_references=table,
        destination_count_scope='Absolute literal/base expressions; indexed destinations are not counted as resolved primary-slot writes.',
        rejected_address_interpretations=non_reference,verified_helper_calls=helpers,direct_flow_anchors=direct_flows,
        semantic_anchor_tokens=tokens,summary=summary,
        actual_alternate_dispatch_closed=False,all_alias_or_bulk_overlap_writes_closed=False,
        action3_producer_closed=False,all_required_capabilities_closed=False,
        native_non_CALL_opcode_text_independently_redecoded=False,
        reduced_projection_counted_as_complete_original_record=False,
        original_execution=False,real_account_or_cache_reads=False)


def window_rebuild(game):
    P=ROOT/'build/analysis/capability-window-rebuild-v1'
    manifest=P/'source-inputs.json'
    assert digest(manifest.read_bytes())=='19ffadc9e45b68df0e6574c7f14feba29538a2bd2adaa8de98cf144751623f9a'
    cache={}
    def read(path):
        if path not in cache:cache[path]=load(path)
        return cache[path]
    def pointer(v,ptr):
        for k in ptr.split('/')[1:]if ptr else []:v=v[int(k)]if isinstance(v,list)else v[k]
        return v
    def canonical(v):return digest(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
    for row in read(manifest)['files']:assert identity(ROOT/row['path'])==row,row['path']
    selection=read(P/'source-selection.json');views=[];records={};flows=[];points={};body_bytes=0;listing_rows=0
    for row in selection['entries']:
        path=ROOT/row['file']['path'];assert identity(path)==row['file']
        r=pointer(read(path),row['pointer']);assert canonical(r)==row['record_sha256']
        assert r['operation']=='analyze_function'and r['subject']['digest']['sha256']==SHA and r['analysis_profile']['digest']==PROFILE
        n=r['normalized_result'];body=n['procedure']['body'];assert n['procedure']['address']==row['entry']and body['available']and body['contains_entry']
        proof=ranges(game,body['ranges']);occupied={v for q in proof for v in range(int(q['start'],16),int(q['end'],16)+1)}
        assert len(occupied)==body['total_bytes'];body_bytes+=len(occupied)
        lines=[]
        for i,line in enumerate(n['assembly']):
            m=re.match(r'\s*(0x[0-9a-fA-F]+):\s*(.*)',line);assert m
            at=int(m[1],16);assert at in occupied
            lines.append((at,m[2],i))
        listing_rows+=len(lines);points[row['entry']]=lines
        for at,text,i in lines:
            end=next(int(q['end'],16)+1 for q in proof if int(q['start'],16)<=at<=int(q['end'],16))
            if end-at<5:continue
            raw=game.read(at,5)
            if raw[0]not in(0xe8,0xe9):continue
            target=(at+5+struct.unpack('<i',raw[1:])[0])&0xffffffff
            kind='CALL'if raw[0]==0xe8 else'tail-JMP'
            assert re.search(r'\b'+('CALL'if raw[0]==0xe8 else'JMP')+r'\b',text,re.I)
            assert re.search(r'0x0*'+format(target,'x')+r'\b',text,re.I)
            flows.append(dict(source=hex(at),target=hex(target),kind=kind,owner=row['entry'],instruction_hex=raw.hex(),
                source_record_file=row['file'],source_instruction_pointer=row['pointer']+'/normalized_result/assembly/'+str(i)))
        records[row['entry']]=r
        views.append(dict(**row,ranges=proof,declared_body_bytes=len(occupied),native_listing_boundaries=len(lines),
            pseudocode_sha256=digest(n['pseudocode'].encode()),semantic_scope='Only the selected reconstruction and transition clauses; not all caller, alias or runtime behavior.'))
    assert len(views)==15 and len(records)==15 and body_bytes==2170
    auth=read(P/'record-authentication.json');assert auth['passed']and auth['complete_records_factory_validated']==15
    assert not auth['original_snapshot_or_bundle_factory_validated']
    tokens={
        '0x46c6b0':['&PTR_DAT_005599f8','*puVar3 | 0x8000','FUN_0046c560'],
        '0x46c560':['FUN_00409e70(3,0x24)','FUN_0046c4e0','FUN_00468190(param_5)','*param_8 = 0','iVar2 + 0x1d0','param_7 ==','puVar1[1] = 0'],
        '0x46c4e0':['9 < psVar1[1]','FUN_00468190((int)*psVar1)','FUN_0040a090(param_1)','param_1 + 0x1d0','psVar1[1] = psVar1[1] + 1'],
        '0x409e70':['FUN_0051bcf8(1,800)','FUN_0051bcf8(1,param_2)','*puVar3 = 0','param_2 & 3'],
        '0x468ee0':['&DAT_00c10200','puVar1[-0x11] != 0','*puVar1 = 1','puVar1 + 0x15','0xc11850'],
        '0x469540':['&DAT_00c5e94c','iVar1 = 7','DAT_005599dc = 0','DAT_005599e4 = 0','DAT_005599ec = 0xffffffff'],
        '0x469580':['DAT_00c4be9c = 0'],
        '0x469590':['*piVar3 == 1','case 0x15:','case 0x16:','case 0x17:','case 0x28:','case 0x21:','case 0x22:','FUN_00497a90','*piVar3 = 0','0xc11850'],
        '0x497a90':['DAT_00c45044 = 1','FUN_00468190(0x16)'],
        '0x467760':['iVar2 = 0x44','0xc1180c','FUN_00469590','DAT_0060ff18 == 0','DAT_00c1016c = 1','FUN_0049a130'],
        '0x467ec0':['FUN_00468190(6)','FUN_00468190(2)','DAT_00c10938 != 0','DAT_00c1098c != 0','FUN_00468190(0x16)','DAT_00c10f20 = 0'],
        '0x467520':['FUN_005185f0','FUN_00517750','DAT_00c108e4 = 0','DAT_00c10938 = 0','DAT_00c1098c = 0','DAT_00c10f20 = 0'],
        '0x467580':['FUN_004feae0','FUN_004fed30','FUN_00518570','FUN_005186a0'],
        '0x4675a0':['FUN_00468190(6)','FUN_00469590','DAT_00c1016c = 1'],
        '0x468e50':['FUN_00468e20(*piVar3)','*piVar3 = 0','FUN_004f7b50','DAT_005e2778 =']}
    for entry,values in tokens.items():
        text=records[entry]['normalized_result']['pseudocode']
        for value in values:assert value in text,(entry,value)
    wrapper=records['0x46c6b0']['normalized_result']['assembly']
    index=next(i for i,l in enumerate(wrapper)if 'CALL 0x0046c560'in l)
    assert [l.split(': ',1)[1]for l in wrapper[index+1:]]==['ADD ESP, 0x20','POP EDI','POP ESI','POP EBX','RET']
    assert any('0x46c529: CMP word ptr [ESI + 0x2], 0xa'in l for l in records['0x46c4e0']['normalized_result']['assembly'])
    callback_pointers=[]
    for at,text,i in points['0x46c560']:
        if '0x46c4e0'not in text:continue
        end=next(v for v,_,_ in points['0x46c560']if v>at);raw=game.read(at,end-at)
        assert text=='MOV dword ptr [ESI + 0x8], 0x46c4e0'and len(raw)==7 and raw[0]==0xc7 and raw[2]==8 and raw[-4:]==struct.pack('<I',0x46c4e0)
        callback_pointers.append(dict(source=hex(at),target='0x46c4e0',kind='MOV-code-pointer',instruction_hex=raw.hex(),field_offset=8,
            source_check_view_index=next(i for i,q in enumerate(views)if q['entry']=='0x46c560')))
    assert len(callback_pointers)==1
    coordinates=read(P/'sidecar-slot-coordinate-anchors.json')
    source=ROOT/coordinates['source_file']['path'];assert identity(source)==coordinates['source_file']
    original=read(source)
    for q in coordinates['rows']:
        idx=q['window_index'];assert q['live_pointer_address']==hex(0xc101b0+idx*0x54+0xc)
        assert q['marker_address']==hex(0xc101b0+idx*0x54+0x50)
        at=int(q['instruction_address'],16);raw=bytes.fromhex(q['instruction_hex']);assert raw==game.read(at,len(raw))
        assert pointer(original,q['source_instruction_pointer'])==q['instruction_text']
    assert {q['window_index']for q in coordinates['rows']}=={21,22,23,40}
    loops=[dict(kind='object-pool-clear',start='0xc080a0',end_exclusive='0xc081b0',stride=4,count=68),
        dict(kind='sidecar-live-clear',start='0xc101bc',end_exclusive='0xc1180c',stride=0x54,count=68),
        dict(kind='sidecar-marker-capture-or-restore',start='0xc10200',end_exclusive='0xc11850',stride=0x54,count=68)]
    for q in loops:assert int(q['end_exclusive'],16)-int(q['start'],16)==q['stride']*q['count']
    closed=read(P/'rea-final-closed.json')['structuredContent']['result'];assert not closed['open']and not closed['cleanup_pending']
    assert read(P/'rea-export.json')['structuredContent']['result']['records']==17
    assert read(P/'rea-close.json')['structuredContent']['result']['evidence_records']==17
    summary=dict(source_views=15,complete_native_records=15,reused_native_records=5,new_native_observations=10,
        new_derived_views=0,new_function_seeds=0,declared_body_bytes=body_bytes,native_listing_boundaries=listing_rows,
        direct_CALL_anchors=sum(q['kind']=='CALL'for q in flows),direct_tail_JMP_anchors=sum(q['kind']=='tail-JMP'for q in flows),
        callback_pointer_anchors=1,sidecar_coordinate_bindings=4,storage_slots=68,classic_descriptor_slots_unchanged=67,
        imported_snapshot_records=7,REA_current_new_records=10,REA_export_records=17,REA_snapshot_records=17,
        REA_session_closed=True,runtime_features_changed=False,all_capability_analysis_complete=False)
    return dict(manifest=identity(manifest),source_selection=identity(P/'source-selection.json'),source_views=views,
        complete_original_record_authentication=identity(P/'record-authentication.json'),semantic_anchor_tokens=tokens,
        direct_flow_anchors=flows,callback_pointer_anchors=callback_pointers,sidecar_coordinates=coordinates['rows'],
        loop_domains=loops,borrowed_classic_contract=identity(OUT/'window-engine-contract.json'),
        borrowed_graphics_contract=identity(OUT/'game-graphics-lifetime-contract.json'),summary=summary,
        wrapper_EAX_forwarding_checked=True,pseudocode_void_not_used_as_caller_ABI=True,
        counter_is_callback_visits_not_elapsed_time=True,all_sidecar_alias_writers_or_business_reentry_closed=False,
        native_non_CALL_opcode_text_independently_redecoded=False,original_execution=False,
        real_config_mail_cache_or_account_reads=False,product_code_changed=False,implementation_gate_passed=False)


def build():
    game = PE(ROOT / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe', SHA)
    game.sha_for_check = SHA
    launcher = PE(ROOT / 'build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe', LAUNCHER_SHA)
    launcher.sha_for_check = LAUNCHER_SHA
    game_bodies = bind_bodies(game, 'game-body-manifest.json', 'game')
    launcher_bodies = bind_bodies(launcher, 'launcher-body-manifest.json', 'launcher')
    derived = load(PRIVATE / 'derived-game-toggle.json')['entries'][0]
    assert derived['requestedEntry'] == '004ea740' and derived['decompileCompleted']
    covered = set()
    for instruction in derived['instructions']:
        start = int(instruction['address'], 16)
        raw = bytes.fromhex(instruction['bytesHex'])
        assert raw == game.read(start, len(raw))
        covered.update(range(start, start + len(raw)))
    declared = {at for span in derived['derivedBody']
                for at in range(int(span['start'], 16), int(span['end'], 16) + 1)}
    assert covered == declared
    receipt = load(PRIVATE / 'derived-game-toggle-receipt.json')
    assert receipt['exit_code'] == 0 and receipt['source_sha256_before'] == receipt['source_sha256_after'] == SHA
    calls = load(PRIVATE / 'lookup-call-candidates.json')[0]['candidates']
    assert len(calls) == 6
    decoded = {hex(int(i['address'], 16)): i for i in derived['instructions']}
    call_proofs = []
    for candidate in calls:
        address = candidate['address']
        if address == '0x4ea746':
            instruction = decoded[address]
            assert instruction['flowType'] == 'UNCONDITIONAL_CALL'
            assert '004ea7a0' in instruction['flows']
            call_proofs.append(dict(address=address, authority='source-bound-derived-instruction',
                                    owner='0x4ea740', target='0x4ea7a0'))
        else:
            e = evidence(PRIVATE / f'game-instruction-{address[2:]}.json')
            n = e['normalized_result']
            raw = bytes.fromhex(n['bytes'])
            assert raw == game.read(int(address, 16), len(raw))
            assert n['status'] == 'decoded' and n['mnemonic'] == 'CALL'
            assert n['flow']['direct_destinations'] == ['0x4ea7a0']
            call_proofs.append(dict(address=address, authority='canonical-native-instruction',
                owner=n['procedure'], target='0x4ea7a0', evidence_id=e['evidence_id']))
    binding = launcher_bindings(launcher)
    dump('launcher-dialog-bindings.json', binding)
    rebuild=window_rebuild(game)
    dump('dispatch-binding-source-check.json', dict(
        schema='moli.capability-dispatch-binding-source-check.v1',
        game_source=identity(game.path), launcher_source=identity(launcher.path),
        tools=dict(REA='6.7.0', Ghidra='12.1.4', profile=PROFILE),
        game_functions=game_bodies, launcher_functions=launcher_bodies,
        game_body_bytes=sum(r['bytes'] for f in game_bodies for r in f['ranges']),
        launcher_body_bytes=sum(r['bytes'] for f in launcher_bodies for r in f['ranges']),
        game_canonical_bodies=len(game_bodies), launcher_canonical_bodies=len(launcher_bodies),
        new_game_canonical_functions=1, reused_game_canonical_functions=2,
        new_launcher_canonical_functions=32, reused_launcher_canonical_functions=1,
        derived_toggle=dict(entry='0x4ea740', authority='analyst-seeded-derived-static',
            ranges=ranges(game, derived['derivedBody']), bytes=len(covered),
            instructions=len(derived['instructions']), all_source_instruction_bytes_match=True,
            artifact=identity(PRIVATE / 'derived-game-toggle.json'),
            receipt=identity(PRIVATE / 'derived-game-toggle-receipt.json')),
        lookup_direct_call_proofs=call_proofs,
        launcher_bindings=identity(OUT / 'launcher-dialog-bindings.json'),
        shared_frame_recovery=shared_frame_recovery(game),
        window_rebuild=rebuild,
        all_source_bytes_match=True, original_execution=False, runtime_features_changed=False,
        all_capability_analysis_complete=False, implementation_gate_passed=False))
    print(json.dumps(dict(game_bodies=len(game_bodies), launcher_bodies=len(launcher_bodies),
        launcher_bytes=sum(r['bytes'] for f in launcher_bodies for r in f['ranges']),
        derived_toggle_bytes=len(covered), bindings=binding['summary'], window_rebuild_summary=rebuild['summary'])))


if __name__ == '__main__':
    build()
