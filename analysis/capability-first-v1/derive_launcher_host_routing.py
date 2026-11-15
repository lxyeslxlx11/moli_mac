#!/usr/bin/env python3
"""Specify selected fixed-source path, menu routing and catalog-job boundaries."""
import hashlib
import json
import struct
from pathlib import Path

from extract_entry_inventory import PE, menu_metadata
from derive_dispatch_bindings import vtable_info

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'analysis/capability-first-v1'
PRIVATE = ROOT / 'build/analysis/capability-launcher-host-routing-v1'
TARGET = ROOT / 'build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe'
SHA = 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'
NATIVE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
WORKFLOW = 'b9a9b4f868ae80c2a55407e7d3772a125da19a3d5e2e1765df03951cbd797158'
BUNDLES = [ROOT / 'build/analysis/capability-launcher-catalog-install-v1/rea-launcher-evidence.json',
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
            if name in ('LoadMenuA', 'DestroyMenu', 'GetMenu', 'CreateWindowExA'):
                selected.append({'dll': dll, 'name': name, 'iat_address': hex(pe.base + first + j * 4),
                                 'descriptor_address': hex(address), 'descriptor_sha256': sha(descriptor),
                                 'lookup_address': hex(thunk_address), 'lookup_sha256': sha(raw),
                                 'name_address': hex(name_address), 'name_bytes': length,
                                 'name_sha256': sha(pe.read(name_address, length))})
        else:
            raise AssertionError('import thunk limit')
    else:
        raise AssertionError('import descriptor terminator missing')
    assert {r['name'] for r in selected} == {'LoadMenuA', 'DestroyMenu', 'GetMenu', 'CreateWindowExA'}
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
    anchors = []

    def anchor(entry, claim, *queries):
        matches = []
        for query in queries:
            found = [line for line in assembly[entry] if query in line]
            assert found, (entry, query)
            for line in found:
                address = int(line.split(':', 1)[0], 16)
                assert any(int(s['start'], 16) <= address <= int(s['end_inclusive'], 16)
                           for s in indexed[entry]['ranges'])
                matches.append({'address': hex(address), 'instruction_text_sha256': sha(line.encode())})
        anchors.append({'claim': claim, 'procedure': entry, 'queries': list(queries), 'matches': matches})

    anchor('0x434200', 'dot-component-scan', 'PUSH 0x5d5aa0', 'PUSH 0x5d911c')
    anchor('0x434bd0', 'drive-or-UNC-shape', 'CALL 0x005a3725', '0x3a', '0x5c', 'CALL 0x00434c30')
    anchor('0x434c30', 'UNC-prefix-and-share-bounds', 'PUSH 0x5d90f0', 'PUSH 0x5d90f4', 'PUSH 0x5d90fc')
    anchor('0x5a3725', 'ambiguous-wrapper-resolved-through-callee', 'CALL 0x005a3738')
    anchor('0x5a3738', 'byte-classifier-mask', 'MOV EDX, 0x103', 'TEST byte ptr [ECX + EAX*0x1 + 0x19], 0x1')
    anchor('0x4355f0', 'directory-normalization-calls-selected-predicates', 'CALL 0x00434200', 'CALL 0x00434bd0', '0x104')
    anchor('0x431000', 'Frame-resource-load-request', 'PUSH 0x80', 'PUSH 0xcf8000', '0x168')
    anchor('0x4568ad', 'LoadFrame-create-slot-and-menu-capture', '0x164', 'CALL dword ptr [0x005cf724]')
    anchor('0x45621b', 'LoadMenu-create-and-failure-destruction', 'CALL dword ptr [0x005cf66c]', '0x5c', 'CALL dword ptr [0x005cf694]')
    anchor('0x448be6', 'CreateEx-precreate-before-system-create', '0x64', 'CALL 0x0044dbb9')
    anchor('0x42e3a0', 'Frame-precreate-delegates-and-modifies-style', 'CALL 0x00458bf5', '0x80000000', '0xfffffdff')
    anchor('0x458bf5', 'base-precreate-class-style-only', '0x28', '0x20', '0x2c')
    anchor('0x44dbb9', 'system-create-preserves-menu-argument', 'PUSH dword ptr [EBP + 0x2c]')
    anchor('0x42e2a0', 'Frame-routes-child-before-base', '0x120', 'CALL dword ptr [EAX + 0xc]', 'CALL 0x00457666')
    anchor('0x457666', 'base-route-active-view-map-App', '0xdc', 'CALL 0x00446a03', '0xc')
    anchor('0x446a03', 'command-codes-and-map-traversal', 'MOV EBX, 0x111', '0x28', 'CALL 0x0044793e', 'CALL 0x00446cee')
    anchor('0x406290', 'catalog-job-start-guard', '0x2bc4', '0x2bc8')
    anchor('0x40af60', 'catalog-start-from-window-create', 'CALL 0x00448d83', 'CALL 0x00406290')
    anchor('0x40af80', 'catalog-progress-latch', '0x2bc1', '0x2bc0', 'CALL 0x004091c0')
    anchor('0x409bf0', 'process-busy-fields-only', '0x2b84', '0x2b88', '0x2b90')
    anchor('0x40a320', 'completion-takes-current-job', '0x2bc8', '0x2bc4')
    anchor('0x406a00', 'worker-posts-progress-and-result', 'PUSH 0x80cc', 'PUSH 0x80c9')
    anchor('0x404410', 'cancel-before-bounded-wait', '0x2bc8', 'PUSH 0x1388')

    literals = []
    for address, text in ((0x5d5aa0, '.'), (0x5d911c, '..'), (0x5d90f0, '\\\\'),
                          (0x5d90f4, '\\\\?\\'), (0x5d90fc, '\\\\.\\')):
        blob = text.encode() + b'\0'
        assert pe.read(address, len(blob)) == blob
        literals.append({'address': hex(address), 'text': text, 'bytes': len(blob),
                         'file_offset': pe.file_offset(address, len(blob)), 'sha256': sha(blob)})
    chains = {}
    for name, vt in [('Frame', 0x5d60bc), ('CChildView', 0x5cfff4), ('App', 0x5d6710)]:
        result = vtable_info(pe, vt)
        assert result == load(PRIVATE / f'message-chain-{name}.json') and result['observed_base_chain_closed']
        chains[name] = result
    slots = []
    for owner, vt, offset, target in [('Frame', 0x5d60bc, 0xc, 0x42e2a0), ('Frame', 0x5d60bc, 0x5c, 0x448be6),
                                    ('Frame', 0x5d60bc, 0x64, 0x42e3a0), ('Frame', 0x5d60bc, 0x164, 0x45621b),
                                    ('Frame', 0x5d60bc, 0x168, 0x4568ad), ('CChildView', 0x5cfff4, 0xc, 0x446a03),
                                    ('App', 0x5d6710, 0xc, 0x446a03)]:
        blob = pe.read(vt + offset, 4)
        assert struct.unpack('<I', blob)[0] == target
        slots.append({'owner': owner, 'vtable': hex(vt), 'slot': hex(offset), 'target': hex(target),
                      'file_offset': pe.file_offset(vt + offset, 4), 'sha256': sha(blob)})
    inventory = load(OUT / 'entry-inventory.json')['launcher']
    assert inventory['source']['sha256'] == SHA
    menu = inventory['menus'][0]
    assert menu['name']['id'] == 128
    raw = pe.raw[menu['file_offset']:menu['file_offset'] + menu['bytes']]
    assert sha(raw) == menu['sha256'] and menu['bytes'] == 258
    parsed = menu_metadata(raw, menu['file_offset'])
    assert all(menu[k] == v for k, v in parsed.items())
    commands = [r['command'] for r in parsed['nodes'] if r['command'] not in (None, 0)]
    assert commands == [0xe141, 0xe12b, 0xe123, 0xe122, 0xe125, 0xe140]
    routes = []
    for command in commands:
        matches = {}
        for owner, chain in chains.items():
            matches[owner] = [r for c in chain['message_chain'] for r in c['entries']
                              if r['message'] == '0x111' and r['notification'] == 0
                              and r['first_id'] <= command <= r['last_id']]
        routes.append({'command': hex(command), 'known_owner_matches_in_ancestry_order': matches})
    for row in routes:
        assert not row['known_owner_matches_in_ancestry_order']['Frame']
        assert not row['known_owner_matches_in_ancestry_order']['CChildView']
        expected = {'0xe140': ['0x431620'], '0xe141': ['0x431690', '0x45c22f']}.get(row['command'], [])
        assert [x['handler'] for x in row['known_owner_matches_in_ancestry_order']['App']] == expected
    job_routes = [r for c in chains['CChildView']['message_chain'] for r in c['entries']
                  if r['handler'] in ('0x40af60', '0x40a320', '0x40af80')]
    assert [(r['message'], r['handler']) for r in job_routes] == [('0x1', '0x40af60'), ('0x80c9', '0x40a320'), ('0x80cc', '0x40af80')]
    imports = selected_imports(pe)
    expected_imports = {'LoadMenuA': 0x5cf66c, 'DestroyMenu': 0x5cf694, 'GetMenu': 0x5cf724, 'CreateWindowExA': 0x5cf74c}
    assert all(int(row['iat_address'], 16) == expected_imports[row['name']]
               for row in imports['selected'] if row['name'] in expected_imports)
    summary = {'body_entries': len(bodies), 'new_native_dossiers': sum(r['kind'] == 'new-native' for r in bodies),
               'reused_native_dossiers': sum(r['kind'] == 'reused-native' for r in bodies),
               'composed_reused_bodies': sum(r['kind'] == 'composed' for r in bodies),
               'range_reads': sum(len(r['ranges']) for r in bodies),
               'range_bytes': sum(s['bytes'] for r in bodies for s in r['ranges']),
               'semantic_anchor_groups': len(anchors), 'literal_ranges': len(literals),
               'message_chains': len(chains), 'selected_slots': len(slots), 'static_menu_commands': len(commands),
               'named_imports_bound': len(imports['selected']), 'catalog_message_routes': len(job_routes)}
    check = {'schema': 'moli.capability.launcher-host-routing-source-check.v1', 'source': identity(TARGET),
             'tools': {'REA': '6.7.0', 'Ghidra': '12.1.4', 'native_profile': NATIVE, 'workflow_profile': WORKFLOW},
             'summary': summary, 'bodies': bodies, 'instruction_anchors': anchors, 'literals': literals,
             'selected_slots': slots, 'message_chains': chains, 'menu': menu, 'menu_routes': routes,
             'selected_PE_imports': imports, 'catalog_message_routes': job_routes,
             'all_native_loaded_image_read_bytes_match_original_PE': True,
             'read_memory_kind': 'static analyzer image, never original process memory',
             'limitations': ['Source and complete selected bodies are bounded evidence, not whole-program semantic closure.',
                             'The parsed menu and request path do not prove rendered visibility, enable state or platform acceptance.',
                             'Known-owner negative menu matches do not exclude a dynamically installed active view or other target.',
                             'The imported locale tables, filesystem and Win32 queue behavior were not executed.']}
    write('launcher-host-routing-source-check.json', check)
    facts = [
        {'id': 'dot-components', 'procedures': ['0x434200', '0x4355f0'], 'claim':
         '434200 scans separator-delimited components using CharNextA and returns1 when any component equals dot or dotdot; '
         'empty components are not themselves rejected by this helper. The directory normalizer rejects its positive result.'},
        {'id': 'absolute-root', 'procedures': ['0x434bd0', '0x434c30', '0x4355f0'], 'claim':
         'The root predicate accepts length>=3, an accepted first unsigned byte, colon and backslash, or a valid UNC root. '
         'The normalizer applies this before and after GetFullPathNameA; syntax success alone is not directory existence.'},
        {'id': 'classifier-identity', 'procedures': ['0x5a3725', '0x5a3738', '0x434bd0'], 'claim':
         'The19-byte wrapper has conflicting FID names but directly calls __ismbcalpha_l. For the actual caller input0..255, '
         'the result tests locale ctype[byte]&0x103 or multibyte_flags[byte+0x19]&1. The high-code-point branch is not used '
         'by this first-byte call; neither a graph-character interpretation nor unconditional ASCII-only behavior is proved.'},
        {'id': 'UNC-root', 'procedures': ['0x434c30'], 'claim':
         'UNC requires length>=5, two leading backslashes, neither device prefix\\\\?\\ nor\\\\.\\, a nonempty server '
         'before the next backslash and a nonempty share before the next backslash or end. Later components are outside '
         'this root helper; doubled forward slashes are not this prefix.'},
        {'id': 'menu-create', 'procedures': ['0x431000', '0x4568ad', '0x45621b', '0x448be6', '0x44dbb9', '0x42e3a0', '0x458bf5'], 'claim':
         'Startup requests Frame LoadFrame(resource128). LoadFrame calls the Frame Create slot with low16 resource ID; '
         'Create loads that menu, passes its handle through CreateEx and the PreCreateWindow chain to CreateWindowExA. '
         'Both observed PreCreateWindow bodies leave CREATESTRUCT.hMenu unchanged. Menu-load failure aborts creation; '
         'window-create failure destroys the loaded menu. Successful LoadFrame captures GetMenu or the retained menu field. '
         'This is a source creation/ownership path, not a rendered menu observation.'},
        {'id': 'command-routing', 'procedures': ['0x42e2a0', '0x457666', '0x446a03'], 'claim':
         'Frame OnCmdMsg first delegates to its CChildView at+0x120; otherwise the base route tries an active view at+0xdc, '
         'the Frame map, then the App. Generic command dispatch derives WM_COMMAND/notification fields, obtains '
         'the object message map through slot0x28, follows base maps and dispatches the selected entry.'},
        {'id': 'static-menu-owners', 'procedures': ['0x446a03', '0x431690'], 'claim':
         'Resource128 has six nonzero commands. Across the complete observed Frame/CChildView/App map ancestry, '
         'E140 first selects App431620, E141 first selects App431690 before the inherited exit handler. '
         'E12B/E123/E122/E125 have no normal-command handlers in those three owner chains. A separate active-view target '
         'or dynamic routing remains outside this negative result; do not invent four game requirements or declare them globally unreachable.'},
        {'id': 'catalog-start', 'procedures': ['0x406290', '0x40af60'], 'claim':
         'CChildView WM_CREATE maps to40af60: base creation failure returns-1, otherwise it invokes406290. '
         '406290 returns immediately when either job handle+0x2bc4 or job pointer+0x2bc8 is nonzero; these are independent '
         'of the login-busy and process-handle predicates. The retained dossier lists40af60 as its one analyzed direct caller; '
         'that bounded list does not exclude computed callers.'},
        {'id': 'catalog-messages', 'procedures': ['0x406a00', '0x40af80', '0x40a320'], 'claim':
         'The CChildView map binds80CC to40af80 and80C9 to40a320. The worker posts progress with zero parameters and '
         'completion with a success boolean and zero lParam, after selected cancel/owner checks. Progress consumes '
         '+0x2bc1 when set, and calls4091c0 only when+0x2bc0 is clear. Completion consumes the current job and clears '
         'its owner fields; the posted message itself carries no job identity.'},
        {'id': 'process-busy', 'procedures': ['0x409bf0'], 'claim':
         '409bf0 returns1 iff any of CChildView+0x2b84/+0x2b88/+0x2b90 is nonzero. It does not read catalog '
         'job fields+0x2bc4/+0x2bc8 or Main login-busy+0x1a74. Callers must not treat it as a universal busy predicate.'},
        {'id': 'cancel-boundary', 'procedures': ['0x404410', '0x406a00', '0x40a320'], 'claim':
         'The previous source-bound cancellation/reference rules remain: destruction sets cancel, clears the job HWND, '
         'waits at most5000ms without checking the wait result, closes the handle and releases the owner reference. '
         'Worker checks before posts and owner references are not queue-generation or cancellation-acknowledgement proofs.'}
    ]
    for row in facts:
        row['kind'] = 'fact'
        assert all(entry in indexed for entry in row['procedures'])
    contract = {'schema': 'moli.capability.launcher-host-routing-contract.v1', 'source': identity(TARGET),
                'source_check': 'analysis/capability-first-v1/launcher-host-routing-source-check.json',
                'capabilities': ['L01', 'L05', 'L06', 'L08'], 'facts': facts,
                'scope_refinement': ['Path-helper format rules are now bound; actual locale/path APIs remain a platform acceptance dimension.',
                                     'Menu resource128 participates in the creation request; visible/enabled menus are not verified.',
                                     'Keep process handles, catalog job presence and login busy as distinct source predicates.'],
                'inferences': [{'kind': 'inference', 'claim': 'A shared owner can expose these distinct predicates and correlate its '
                               'own jobs explicitly; platform ports supply locale/filesystem/window effects. This is a design inference, not a new original-program behavior.',
                               'implementation_added': False}],
                'requirement_answers': [
                    {'question': 1, 'status': 'answered-bounded-source', 'result': 'Dot components, drive-byte classification and UNC root shape bound to bytes/callee masks; OS and locale execution remain separate.'},
                    {'question': 2, 'status': 'partially-answered', 'result': 'Menu128 creation/ownership, Frame routing and six known-owner command matches bound; active-view/dynamic handlers, rendered availability and other resources remain.'},
                    {'question': 3, 'status': 'partially-answered', 'result': 'WM_CREATE admission, separate busy predicates, progress/completion and destruction rules bound; full late queue/reopen/other-job lifecycle remains.'}],
                'remaining': ['Full XML lexer/encoding/entity/error behavior and independent parser compatibility.',
                              'Locale, filesystem/registry/profile behavior, clear/remove/exception unwinds and platform effects.',
                              'Active-view/dynamic menu handlers, rendered enable/visibility and resources296/30721/30734; static metadata alone is not a required business capability.',
                              'App initializer, all catalog/login/patch/updater late-result, cancellation acknowledgement and reopen guards; source message absence of job identity is not a safe-scheduling proof.',
                              'Game actual alternate callback dispatch, graphics/input/shared-state ownership and remaining business conditions across the full capability inventory.',
                              'Real platform/device/account/official acceptance remains distinct from static source specifications.'],
                'original_execution': False, 'account_or_session_observed': False, 'runtime_features_changed': False,
                'all_capability_analysis_complete': False, 'implementation_gate_passed': False,
                'official_acceptance': False, 'full_goal_complete': False}
    write('launcher-host-routing-contract.json', contract)
    print(json.dumps(summary, sort_keys=True))


if __name__ == '__main__':
    main()
