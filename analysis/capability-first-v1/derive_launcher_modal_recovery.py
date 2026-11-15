#!/usr/bin/env python3
"""Verify fixed-source modal ownership and XML recovery; never execute the original target."""
import hashlib
import json
import re
import struct
from pathlib import Path

from extract_entry_inventory import PE
from derive_dispatch_bindings import vtable_info

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'analysis/capability-first-v1'
PRIVATE = ROOT / 'build/analysis/capability-launcher-modal-recovery-v1'
TARGET = ROOT / 'build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe'
SHA = 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'
NATIVE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
WORKFLOW = 'b9a9b4f868ae80c2a55407e7d3772a125da19a3d5e2e1765df03951cbd797158'
BUNDLES = [PRIVATE / 'rea-launcher-evidence.json',
           ROOT / 'build/analysis/capability-launcher-channel-v1/rea-launcher-evidence.json',
           ROOT / 'build/analysis/launcher-current-patch-v1/rea-complete-path.json']


def sha(blob):
    return hashlib.sha256(blob).hexdigest()


def load(path):
    return json.loads(path.read_text())


def identity(path):
    return {'path': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size, 'sha256': sha(path.read_bytes())}


def write(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def selected_imports(pe):
    """Parse PE32 import descriptors/thunks; project only the selected Win32 APIs."""
    pe_at = struct.unpack_from('<I', pe.raw, 60)[0]
    opt = pe_at + 24
    rva, size = struct.unpack_from('<II', pe.raw, opt + 104)
    assert rva and size >= 20

    def cstr(address):
        out = bytearray()
        for i in range(512):
            b = pe.read(address + i, 1)[0]
            if not b:
                return out.decode('ascii'), i + 1
            out.append(b)
        raise AssertionError('unterminated import name')

    selected, imports = [], 0
    for i in range(min(size // 20, 4096)):
        address = pe.base + rva + i * 20
        descriptor = pe.read(address, 20)
        original, timestamp, forwarder, name_rva, first = struct.unpack('<5I', descriptor)
        if not any((original, timestamp, forwarder, name_rva, first)):
            break
        assert name_rva and first
        dll, _ = cstr(pe.base + name_rva)
        lookup = pe.base + (original or first)
        for j in range(4096):
            thunk_address = lookup + 4 * j
            raw = pe.read(thunk_address, 4)
            value = struct.unpack('<I', raw)[0]
            if not value:
                break
            imports += 1
            if value & 0x80000000:
                continue
            name_address = pe.base + value + 2
            name, length = cstr(name_address)
            if name in ('EnableWindow', 'GetMessageA', 'PeekMessageA', 'TranslateMessage', 'DispatchMessageA', 'EndDialog', 'DestroyWindow', 'PostMessageA', 'MessageBoxA', 'GetActiveWindow', 'SetActiveWindow', 'IsWindow', 'IsWindowEnabled', 'GetParent', 'GetWindowLongA', 'GetDesktopWindow', 'GetLastActivePopup'):
                selected.append({'dll': dll, 'name': name, 'iat_address': hex(pe.base + first + j * 4),
                                 'descriptor_address': hex(address), 'descriptor_sha256': sha(descriptor),
                                 'lookup_address': hex(thunk_address), 'lookup_sha256': sha(raw),
                                 'name_address': hex(name_address), 'name_bytes': length,
                                 'name_sha256': sha(pe.read(name_address, length))})
        else:
            raise AssertionError('import thunk limit')
    else:
        raise AssertionError('import descriptor terminator missing')
    assert {r['name'] for r in selected} == {'PeekMessageA', 'IsWindowEnabled', 'MessageBoxA', 'GetMessageA', 'EndDialog', 'EnableWindow', 'PostMessageA', 'GetActiveWindow', 'DispatchMessageA', 'GetDesktopWindow', 'IsWindow', 'SetActiveWindow', 'GetWindowLongA', 'GetParent', 'TranslateMessage', 'GetLastActivePopup', 'DestroyWindow'}
    return {'examined_imports': imports, 'selected': selected,
            'limitation': 'This is static named-import metadata; dynamic API resolution is outside this projection.'}


def main():
    pe = PE(TARGET, SHA)
    manifest = load(PRIVATE / 'body-input-manifest.json')
    wanted, parents, parent_sources = set(), {}, {}
    for row in manifest:
        if row['kind'] == 'composed':
            r = load(ROOT / row['path'])
            wanted.update(r[key] for key in ('pseudocode_parent_evidence_id', 'range_evidence_id', 'assembly_evidence_id'))
    for path in BUNDLES:
        bundle = load(path)
        for r in bundle['records']:
            if r['evidence_id'] in wanted:
                assert r['evidence_id'] not in parents or parents[r['evidence_id']] == r
                parents[r['evidence_id']] = r
                parent_sources.setdefault(r['evidence_id'], identity(path))
        del bundle
    assert wanted <= parents.keys()
    bodies, assembly, indexed = [], {}, {}
    for row in manifest:
        path = ROOT / row['path']
        r = load(path)
        assert r['subject']['digest']['sha256'] == SHA
        entry = row['procedure']
        result = {'procedure': entry, 'kind': row['kind'], 'retained_view': identity(path)}
        if row['kind'] == 'composed':
            assert r['canonical_function_dossier'] is False and r['procedure'] == entry
            parent, info, asm = [parents[r[k]] for k in ('pseudocode_parent_evidence_id', 'range_evidence_id', 'assembly_evidence_id')]
            assert all(x['subject']['digest']['sha256'] == SHA for x in (parent, info, asm))
            assert info['analysis_profile']['digest'] == asm['analysis_profile']['digest'] == NATIVE
            if r['pseudocode_item_index'] is None:
                assert parent['operation'] == 'procedure_pseudo_code' and parent['analysis_profile']['digest'] == NATIVE
                pseudo = parent['normalized_result']
            else:
                assert parent['operation'] == 'batch_decompile' and parent['analysis_profile']['digest'] == WORKFLOW
                item = parent['normalized_result']['items'][r['pseudocode_item_index']]
                assert item['status'] == 'ok' and item['procedure']['address'] == entry
                pseudo = item['pseudocode']
            body, lines = r['body'], r['assembly']
            assert pseudo == r['pseudocode'] and body == info['normalized_result']['body']
            assert info['normalized_result']['entrypoint'] == entry and lines == asm['normalized_result'].splitlines()
            result.update(canonical_native_dossier=False, pseudocode_parent_evidence_id=parent['evidence_id'],
                          pseudocode_profile_digest=parent['analysis_profile']['digest'],
                          pseudocode_parent_source=parent_sources[parent['evidence_id']],
                          pseudocode_utf8_sha256=sha(pseudo.encode()), range_evidence_id=info['evidence_id'],
                          assembly_evidence_id=asm['evidence_id'])
        else:
            assert row['kind'] in ('new-native', 'reused-native')
            assert r['operation'] == 'analyze_function' and r['analysis_profile']['digest'] == NATIVE
            n = r['normalized_result']
            assert n['procedure']['address'] == entry
            body, lines = n['procedure']['body'], n['assembly']
            result.update(canonical_native_dossier=True, evidence_id=r['evidence_id'])
        assert body['available'] and body['contains_entry']
        ranges = []
        for span in body['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            assert start <= end and pe.executable(start) and pe.executable(end)
            path_read = PRIVATE / f'read-range-{start:x}.json'
            read = load(path_read)
            n = read['normalized_result']
            blob = bytes.fromhex(n['bytes_hex'])
            assert read['subject']['digest']['sha256'] == SHA and read['analysis_profile']['digest'] == NATIVE
            assert n['complete'] and n['address'] == hex(start) and n['returned_bytes'] == len(blob) == end - start + 1
            assert pe.read(start, len(blob)) == blob
            ranges.append({'start': hex(start), 'end_inclusive': hex(end), 'bytes': len(blob),
                           'file_offset': pe.file_offset(start, len(blob)), 'sha256': sha(blob),
                           'read_evidence_id': read['evidence_id'], 'retained_read': identity(path_read)})
        assert sum(s['bytes'] for s in ranges) == body['total_bytes'] == row['body_bytes']
        assert entry not in indexed
        result['ranges'] = ranges
        bodies.append(result)
        indexed[entry], assembly[entry] = result, lines

    anchors=[]

    def anchor(entry,claim,*queries):
        matches=[]
        for query in queries:
            found=[line for line in assembly[entry] if query in line]
            assert found,(entry,query)
            for line in found:
                address=int(line.split(':',1)[0],16)
                assert any(int(s['start'],16)<=address<=int(s['end_inclusive'],16) for s in indexed[entry]['ranges'])
                matches.append(dict(address=hex(address),instruction_text_sha256=sha(line.encode())))
        anchors.append(dict(claim=claim,procedure=entry,queries=list(queries),matches=matches))

    anchor('0x422270','preset-chooser-admission-and-normal-latch-release','0x10f2','0x1a74','CALL 0x0044f422','CALL 0x00416cf0')
    anchor('0x422fc0','save-current-holds-business-modal-latch','0x10f2','CALL 0x00427020')
    anchor('0x427020','candidate-editor-accept-before-publish','CALL 0x0044f422','CALL 0x00426d00')
    anchor('0x4278c0','note-selection-and-modal-result-before-write','0x1fe0','CALL 0x0044f422','CALL 0x00427430')
    anchor('0x426150','manual-path-latch-commit-and-normal-restore','0x10f2','0x1a74','CALL 0x0044f422','CALL 0x0040d4d0')
    anchor('0x4156c0','editor-object-vptr','0x415704: MOV dword ptr [EDI], 0x5d3d2c')
    anchor('0x44f422','modal-resource-owner-disable-and-fallback','CALL 0x0044fa8b',
           '0x44f4d9:','0x44f54a:','0x44f571:','JMP 0x0044f59c')
    anchor('0x44fa8b','modal-owner-selection-and-extra-owner-storage','0x94','0x98','CALL 0x0045136f')
    anchor('0x45136f','safe-owner-disabled-state-is-recorded','0x40000000','CALL dword ptr')
    anchor('0x44f147','creation-sets-result-and-continue-before-create',
           '0x44f257:','0x44f25b:','CALL 0x0044fb83','JMP 0x0044f2ba')
    anchor('0x44f2ba','creation-tail-checks-ended-during-init','0x44f318:','0x44f31f:','0x44f32c:','0x44f333:')
    anchor('0x44f3c5','created-window-enters-modal-loop-conditionally','0x44f3e0:','CALL 0x0044bad6')
    anchor('0x44bad6','modal-loop-continues-normal-message-pump',
           '0x44bb09:','CALL 0x0044ff3b','0x44bbd6:','0x44bc2b:','0x44bc2f:')
    anchor('0x44ff3b','thread-pump-virtual-or-fallback-route','0x5c','0x0044fe62')
    anchor('0x45034f','App-pump-slot-is-five-byte-thunk','JMP 0x0044fe62')
    anchor('0x44fe62','thread-pump-unfiltered-get-and-conditional-dispatch','0x36a','CALL dword ptr')
    anchor('0x448a36','continue-modal-bit','0x60','0x10')
    anchor('0x4490b4','end-loop-stores-result-clears-continue-and-wakes','0x68','0xffffffef','CALL dword ptr')
    anchor('0x44f606','end-dialog-marks-ended-before-virtual-loop-end','0x9c','0x8c','0x44f63b:')
    anchor('0x44f983','base-OK-requires-data-update','CALL 0x0044c0d8','CALL 0x0044f606')
    anchor('0x44f7a0','base-cancel-result-two','PUSH 0x2','CALL 0x0044f606')
    anchor('0x44f59c','normal-return-restores-owner-destroys-and-returns-result',
           '0x44f5b7:','0x44f5d5:','CALL 0x0044fa42','0x44f5fd:')
    anchor('0x44fa42','post-modal-detach-and-extra-owner-release','CALL 0x00448e2d','0x98','CALL 0x0045135f')
    anchor('0x422a70','login-error-stop-before-owned-prompt','0x1a74','CALL 0x0041b690','CALL 0x00449c73')
    anchor('0x449c73','message-box-name-conflict-resolved-by-ANSI-IAT','0x449c9b: CALL dword ptr [0x005cf6f4]','RET 0xc')
    anchor('0x40e800','string-assignment-is-not-a-modal-operation','CALL 0x00595ce0','0x40e800:')
    anchor('0x438580','reload-deletes-before-open-and-preserves-return-distinction',
           '0x4385c2:','0x4385c5:','0x4385c9:','0x4385cf:','0x4385d9:','0x4386f4:','SETZ BL')
    anchor('0x437980','node-destruction-recursively-owns-children','0x18','0x30','CALL dword ptr [EAX]')
    anchor('0x437c70','element-clear-detaches-children-and-attributes','0x437c8f:','0x437c96:','0x437c9d:','CALL dword ptr [EAX]')
    anchor('0x437b30','element-deletion-clears-embedded-sentinel-before-base-node',
           'CALL 0x00437c70','LEA ECX, [ESI + 0x34]','CALL 0x00437900','CALL 0x00437980')
    anchor('0x4059f0','document-own-error-string-then-node-destruction','0x3c','CALL 0x00437980')
    anchor('0x437900','attribute-owned-string-destruction','0x14','0x20')
    anchor('0x438540','link-overwrites-parent-and-appends-owned-node','0x10','0x2c','0x30','0x18','0x1c')
    anchor('0x43ae40','first-error-state-remains-distinct','0x34','0x38')
    anchor('0x43a260','parse-diagnostic-reset-and-existing-tree-link','0x34','CALL 0x00438540')
    anchor('0x40bf80','catalog-load-and-shared-publication-gate','CALL 0x00438750','0x2b30','0x2b34')

    def admitted_read(name,address,length):
        path=PRIVATE/name;r=load(path);n=r['normalized_result'];blob=bytes.fromhex(n['bytes_hex'])
        assert r['operation']=='read_bytes' and r['subject']['digest']['sha256']==SHA
        assert r['analysis_profile']['digest']==NATIVE and n['complete']
        assert n['address']==hex(address) and n['requested_bytes']==n['returned_bytes']==len(blob)==length
        assert blob==pe.read(address,length)
        return blob,dict(address=hex(address),bytes=length,file_offset=pe.file_offset(address,length),
                         sha256=sha(blob),read_evidence_id=r['evidence_id'],retained_read=identity(path))

    modal=[]
    for row in load(PRIVATE/'modal-vtable-inputs.json')['dialogs']:
        vt=int(row['vtable'],16);address=int(row['read_address'],16)
        blob,read=admitted_read(f'read-modal-vtable-{row["owner"]}.json',address,row['read_bytes'])
        slots=[]
        for slot in row['slots']:
            offset=int(slot['offset'],16);target=struct.unpack_from('<I',blob,vt+offset-address)[0]
            assert hex(target)==slot['target'] and pe.executable(target)
            slots.append(dict(offset=slot['offset'],target=hex(target),file_offset=pe.file_offset(vt+offset,4),
                              sha256=sha(pe.read(vt+offset,4))))
        chain=vtable_info(pe,vt)
        assert chain==load(PRIVATE/f'message-chain-{row["owner"]}.json') and chain['observed_base_chain_closed']
        chosen={}
        for span in chain['message_chain']:
            for entry in span['entries']:
                if entry['message']=='0x111' and entry['notification']==0:
                    for command in [1,2]:
                        if entry['first_id']<=command<=entry['last_id']:
                            chosen.setdefault(str(command),dict(map=span['map'],**entry))
        assert set(chosen)=={'1','2'} and chosen['2']['handler']=='0x44eee1'
        assert chosen['1']['handler']==('0x4127f0' if row['owner']=='Directory' else '0x44eed2')
        assert not [e for s in chain['message_chain'] for e in s['entries'] if e['message']=='0x10']
        modal.append(dict(owner=row['owner'],vtable=row['vtable'],read=read,slots=slots,
                          command_routes=chosen,WM_CLOSE_ordinary_handler_in_observed_chain=False,message_chain=chain))
    app_blob,app_read=admitted_read('read-App-pump-slot.json',0x5d676c,4)
    assert struct.unpack('<I',app_blob)[0]==0x45034f
    xml_old=load(OUT/'launcher-xml-source-check.json');xml=[]
    for row in load(PRIVATE/'XML-vtable-slot-inputs.json'):
        vt=int(row['vtable'],16);blob,read=admitted_read(f'read-XML-vtable-{row["kind"]}.json',vt,4)
        target=struct.unpack('<I',blob)[0]
        old=next(r for r in xml_old['parse_bindings'] if r['kind']==row['kind'])
        assert old['vtable']==row['vtable'] and hex(target)==row['delete_slot_target'] and hex(target) in indexed
        assert sha(pe.read(vt+8,4))==old['slot_bytes_sha256']
        xml.append(dict(kind=row['kind'],vtable=row['vtable'],delete_slot='0x0',delete_target=hex(target),
                        read=read,previous_parse_slot=old))
    imports=selected_imports(pe);by_iat={r['iat_address']:r['name'] for r in imports['selected']}
    assert by_iat['0x5cf6f4']=='MessageBoxA' and by_iat['0x5cf6a8']=='EndDialog'
    inherited=[]
    for name,suffix in [('launcher-presets','contract'),('launcher-presets','source-check'),
                         ('launcher-id-metadata','contract'),('launcher-id-metadata','source-check'),
                         ('launcher-catalog-install','contract'),('launcher-catalog-install','source-check'),
                         ('launcher-xml','contract'),('launcher-xml','source-check'),('launcher-channel','contract'),
                         ('launcher-lifecycle','contract')]:
        path=OUT/f'{name}-{suffix}.json';d=load(path);assert d['source']['sha256']==SHA;inherited.append(identity(path))
    refs=load(PRIVATE/'platform-reference-receipt.json')
    assert refs['authority']=='documented-platform-behavior' and refs['original_runtime_verified'] is False
    assert len(refs['references'])==3
    summary=dict(body_entries=len(bodies),new_native_dossiers=sum(r['kind']=='new-native' for r in bodies),
                 reused_native_dossiers=sum(r['kind']=='reused-native' for r in bodies),
                 composed_reused_bodies=sum(r['kind']=='composed' for r in bodies),
                 range_reads=sum(len(r['ranges']) for r in bodies),
                 range_bytes=sum(s['bytes'] for r in bodies for s in r['ranges']),semantic_anchor_groups=len(anchors),
                 auxiliary_data_reads=len(xml)+len(modal)+1,auxiliary_data_bytes=sum(r['read']['bytes'] for r in xml+modal)+4,
                 all_read_records=sum(len(r['ranges']) for r in bodies)+len(xml)+len(modal)+1,
                 XML_delete_bindings=len(xml),modal_vtable_slots=sum(len(r['slots']) for r in modal),
                 modal_message_chains=len(modal),App_pump_slots=1,named_imports_bound=len(imports['selected']),
                 external_platform_references=len(refs['references']))
    source=dict(schema='moli.capability.launcher-modal-recovery-source-check.v1',source=identity(TARGET),
                native_profile_digest=NATIVE,workflow_profile_digest=WORKFLOW,tools={'REA':'6.7.0','Ghidra':'12.1.4'},
                summary=summary,bodies=bodies,semantic_anchors=anchors,modal_bindings=modal,
                App_pump_slot=dict(vtable='0x5d6710',offset='0x5c',target='0x45034f',read=app_read),
                XML_delete_bindings=xml,selected_PE_imports=imports,reused_contracts_and_source_checks=inherited,
                XML_source_locator=identity(PRIVATE/'xml-recovery-source-locator.json'),
                documented_platform_contracts=identity(PRIVATE/'platform-reference-receipt.json'),
                all_native_loaded_image_read_bytes_match_original_PE=True,
                body_scope_warnings=[
                    dict(procedure='0x45034f',claim='The five-byte thunk jumps to44fe62. Its inlined pseudocode is not a second68-byte function body.'),
                    dict(procedure='0x449c73',claim='Conflicting A/W FID names and ghost parameters do not change the imported MessageBoxA or RET0xc.'),
                    dict(procedure='0x44f59c',claim='This is a saved-register/stack continuation of44f422; its owner and enable flags come from that parent.'),
                    dict(procedure='0x44f2ba',claim='This is a saved-register continuation of44f147; it is not an independent dialog-creation API.')],
                original_execution=False,runtime_features_changed=False,
                limitations=['Selected four modal families and normal shared loop/cleanup only; other entries,hooks,all exception/owner-loss/cross-thread schedules remain separate.',
                             'Microsoft API documentation supplies default OS behavior,not a captured original-Windows result.',
                             'The source mirror verifies initialized analysis-image bytes,not dynamic process memory or official acceptance.'])
    write('launcher-modal-recovery-source-check.json',source)
    facts=[
        ('modal-admission',['0x422270','0x422fc0','0x426150','0x4278c0','0x41e420'],
         'Preset choose/save-current and manual directory entry check the Main modal/busy/preparation and process gates on their selected paths and hold+10f2 across ordinary modal work. Note editing instead gates the selected row and uses the common dialog owner; no common+10f2 check is added to it. Ordinary login case3 checks busy,so the business modal latch is not a universal command guard.'),
        ('owner-disable-restore',['0x44f422','0x44fa8b','0x45136f','0x44f59c','0x44fa42'],
         'PreModal requests modeless disable and resolves the caller-supplied owner,recording an extra enabled top owner when needed. DoModal disables its returned non-desktop owner only when enabled and remembers that change. The normal tail reenables the remembered owner,conditionally restores activation,calls the destruction slot and PostModal. PostModal detaches,conditionally reenables a still-existing saved extra owner and requests modeless enable. These are selected API requests and normal source ordering,not observed OS success.'),
        ('create-and-early-end',['0x44f422','0x44f147','0x44f2ba','0x44f3c5','0x44f606'],
         'Missing template returns-1 before modal setup. Creation initializes result+68 to-1 and sets continue bit0x10 before creating the window. EndDialog marks+9c and ends the loop before the OS call. A first create failure only retries the alternate module while+9c is zero; ending during initialization suppresses that retry. The creation tail can destroy an ended window and report no live handle while the modal result still carries the explicit completion value.'),
        ('loop-and-result',['0x44bad6','0x44ff3b','0x45034f','0x44fe62','0x448a36','0x4490b4','0x44f59c'],
         'The selected loop sets modal bits0x18,peeks without an HWND filter and delegates thread pumping. The App+5c thunk and fallback both reach44fe62,whose GetMessageA is unfiltered and whose normal branch translates/dispatches messages not consumed by pretranslation. ContinueModal reads+60 bit0x10; EndModalLoop stores+68,clears that bit and posts a null wake message. Normal loop exit clears0x18 and returns+68. Idle message0x36a and WM_TIMER timer-ID0x36a are distinct namespaces; a modal loop is not a global pause of Main timers.'),
        ('accept-and-cancel',['0x44f983','0x44f7a0','0x44f606','0x4490b4','0x422890','0x4228c0','0x422800'],
         'Four source-bound modal vtables share Continue/EndModalLoop and base Cancel2. Directory uses the prior validated command callback then delegates to base OK; preset choose,editor and note have their own OK overrides. Base OK requires UpdateData(1) success before EndDialog1; base Cancel directly ends with2. Existing focus/name/record/note validation remains in each override. A Cancel return is not a generic rollback of all owner state.'),
        ('business-publication',['0x422270','0x427020','0x4278c0','0x426150'],
         'Prior contracts retain separate commits: completed preset-list edits copy back before outer result testing and survive cancel; accepted isolated editor candidates publish after their required persistence step. Note writes occur only on accepted modal completion,using the selected index/key path. Manual install validates/persists before per-game path publication,while earlier dialog scratch writes remain outside that commit. Normal latch restoration does not prove exception-unwind rollback.'),
        ('login-error-prompt',['0x422a70','0x449c73','0x40e800','0x4316c0','0x423c30'],
         'The ordinary error completion requires busy,clears preset pending state and calls Stop before showing a prompt; a deferred close suppresses that prompt. The wrapper uses Main HWND and the actual MessageBoxA import with three stack arguments,despite its conflicting W label.40e800 is a byte-string assignment helper,not itself a popup. The existing reply lease can remain held while its UI path executes; this does not introduce a new protocol message or guarantee every event ordering.'),
        ('XML-delete-ownership',['0x4059f0','0x437a00','0x437a60','0x437a90','0x437b30','0x437ba0','0x437bd0','0x437980','0x437900','0x437c70'],
         'Seven document/node/attribute vtable slot0 targets bind the deleting destructors. Node destruction saves next sibling before virtual deleting each child with flag1,then frees its own value. Element clear resets first/last children and unlinks/deletes attributes around its embedded+34 sentinel; element destruction then destroys that sentinel and the base node. Document/declaration owned strings are released by their selected destructors; the delete flag controls final object release.'),
        ('reload-and-diagnostics',['0x438580','0x438750','0x43a260','0x43ae40'],
         'File load deletes old children and resets first/last/cursor before opening the newly assigned filename. This is not rollback to the old local tree on failure. It does not reset the document error flag before opening; open failure calls first-error SetError2,zero-length file returnsfalse without Parse,and nonempty input invokes Parse. Direct Parse resets diagnostics but appends into the existing child list. Return pointer,file-load boolean and error flag remain different observations; old diagnostic state can matter when Parse was never entered.'),
        ('link-and-catalog-gate',['0x438540','0x40bf80','0x4384a0'],
         'The selected link helper overwrites parent/previous/next and appends the supplied node; it does not itself clone or detach it from another owner. Catalog callers still require both load booleans and named root containers before resetting shared rows. Failed local tree reloads and shared catalog publication are different boundaries; after admission population is in place,not a proved whole transaction.')]
    rows=[dict(id=i,procedures=es,claim=claim,kind='fact') for i,es,claim in facts]
    assert all(e in indexed for r in rows for e in r['procedures'])
    platform=[dict(kind='fact',authority='documented-platform-behavior',url=r['url'],claim=r['claim'],
                   original_runtime_verified=False) for r in refs['references']]
    contract=dict(schema='moli.capability.launcher-modal-recovery-contract.v1',source=identity(TARGET),
                  source_check='analysis/capability-first-v1/launcher-modal-recovery-source-check.json',
                  capabilities=['L01','L02','L03','L04','L08'],facts=rows,documented_platform_contracts=platform,
                  scope_refinement=['Common modal ownership and each business commit/cancel policy are separate.',
                                    'Selected node deletion/reload and catalog publication are separate from arbitrary invalid-memory or OS fault outcomes.',
                                    'Default OS close/Cancel/MessageBox semantics are cited documentation,not original runtime acceptance.'],
                  inferences=[dict(kind='inference',implementation_added=False,
                                   claim='D1 should preserve per-owner modal input gating while allowing background work through its own valid state/identity checks. Edit candidates,completed list writes,local XML trees and shared catalog publication need different commit boundaries. A global modal boolean or blanket cancel rollback would lose these source distinctions. The channel nested-pump guard helps only on its selected same-stack path; platform owner disappearance and callbacks already acquired still need explicit handling.')],
                  requirement_answers=[
                      dict(question=1,status='answered-bounded-source',result='Four selected modal families,normal owner restore,result/creation/Cancel and retained publication policies bound.'),
                      dict(question=2,status='partially-answered',result='Normal thread pumping and error-stop-before-prompt now bound against the retained channel guard/lease rules; arbitrary posted commands,owner loss,cross-thread and all exceptional schedules remain.'),
                      dict(question=3,status='answered-bounded-source',result='Actual deleting slots,recursive child/attribute clear,diagnostic/reload split and catalog gate bound on the selected normal/failure source paths.'),
                      dict(question=4,status='answered-bounded-source',result='Shared modal/edit/tree ownership implications recorded; no product implementation or acceptance claims added.')],
                  remaining=['Other admitted modal/business entries,actual owner loss/posted-command and cross-thread interleavings,global exits and all exceptional/unwind/callback-throw paths affecting required behavior.',
                             'Actual OS/locale/IME/filesystem/profile behavior and bounded invalid/truncated XML inputs; dynamic menu targets and three resource uses remain in the discovery review.',
                             'Game actual alternate dispatch,graphics/input/shared owners and remaining full capability conditions.',
                             'Independent implementation and actual platform/device/account/official acceptance remain outside this static package.'],
                  original_execution=False,account_or_session_observed=False,runtime_features_changed=False,
                  all_capability_analysis_complete=False,implementation_gate_passed=False,official_acceptance=False,full_goal_complete=False)
    write('launcher-modal-recovery-contract.json',contract)
    print(json.dumps(summary,sort_keys=True))


if __name__=='__main__':
    main()
