"""Bind retained generic graphics lifetimes to the fixed37c4 source bytes.

Reuses eight canonical dossiers and one independently seeded callback body.
It neither queries a provider nor executes the original game or product code.
"""
import hashlib
import json
import re
from pathlib import Path

from extract_entry_inventory import PE

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/capability-game-graphics-lifetime-v1'
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
PINS = {
    'build/analysis/capability-game-graphics-lifetime-v1/recovered-helper-records.json': '46d73af50d9e0ca26efaa7c7243113066f4f37303ccc9f8e2ce062f6f029e201',
    'build/analysis/capability-game-graphics-lifetime-v1/evidence-membership-audit.json': '7ab7eac0a3168bb2a4135bce83e9ff7e63aba614ab48305a46344ebf6b8688a3',
    'build/analysis/capability-game-graphics-lifetime-v1/retained-generic-object-inventory.json': 'a006374c7a6dd135568d50db5d55eb5807e4965838f814fa9abcb4aedb40d83a',
    'build/analysis/capability-game-graphics-lifetime-v1/alternate-callback-incoming-selected-graph.json': 'a358d1d3b05f765e55ba9899ee9b953aeab03cdc59b29d77be24bcfabd7013f3',
    'build/analysis/game-battle-commands-v1/409e70-retained.json': '55378ad04e310b49c911efb08965d1a0d3d47b0763182c6ad8e1c89628511ba1',
    'build/analysis/game-battle-commands-v1/409fe0-retained.json': 'dd090ae5a1c357e7c45f57a6c214a160ef2fe35760b52c36fad556d32930b644',
    'build/analysis/game-battle-commands-v1/40a090-retained.json': 'cc54416f98a6863c5ccdc500203eb3a325c35e8a047d68a5569c436fb9dada8e',
    'build/analysis/game-battle-shared-storage-v1/producers/4ea7c0-dossier.json': 'a4c61b14e42e515b2136feae90ac0f3338710c7777a73a3aaaf2191b89dd7410',
    'build/analysis/capability-business-map-v1/function-4e94d0.json': '5316caf498c1ce4c5e9602dec0864458265bac8c90dbf567c95a52d484567a3f',
    'build/analysis/game-battle-shared-storage-v1/presentation/derived-window.json': 'f69b5b6d3e424eb52b8d44e14692e6472f5ca710088a13c51eb1b7b97056aa18',
}
BODY_FILES = {
    '0x409e70': 'build/analysis/game-battle-commands-v1/409e70-retained.json',
    '0x409fe0': 'build/analysis/game-battle-commands-v1/409fe0-retained.json',
    '0x40a090': 'build/analysis/game-battle-commands-v1/40a090-retained.json',
    '0x4ea7c0': 'build/analysis/game-battle-shared-storage-v1/producers/4ea7c0-dossier.json',
    '0x4e94d0': 'build/analysis/capability-business-map-v1/function-4e94d0.json',
}
PATTERNS = {
    '0x409e70': ['FUN_0051bcf8(1,800)', 'FUN_0051bcf8(1,param_2)', 'piVar2[2] = 0', 'piVar2[3]', 'FUN_0051bd85'],
    '0x409fe0': ['piVar2[7] == 0', 'piVar2[2]', '0x40000U', 'DAT_0058f6b4', 'DAT_0058f6b8', 'FUN_0040a0a0', '*piVar2 + 4'],
    '0x40a090': ['param_1 != 0', 'param_1 + 0x1c'],
    '0x40a0a0': ['param_1 + 0xc', 'FUN_0051bd85'],
    '0x40a0c0': ['DAT_0058f6b0', 'FUN_00464c70', 'iVar1 + 0x1c', 'DAT_0058f6ac'],
    '0x464c70': ['DAT_00ae2ba0', 'DAT_00b09984', "puVar1[iVar2] == '\\x01'", 'FUN_0040a090', 'iVar2 < 399', '0xba5108'],
    '0x4ea7c0': ['FUN_00409e70(3,0x24)', 'iVar2 + 8', 'LAB_004ea9b0', 'puVar1[1] = 0', 'param_5 == -1', 'param_5 == -2'],
    '0x4e94d0': ['param_1 == 0', 'FUN_0040a090', 'FUN_004ea7c0', 'FUN_004033d0(0)', 'return 2', 'return 1'],
    '0x4ea9b0': ['param_1 + 0x2c', 'iVar7 == 0', '9 < psVar4[1]', 'iVar7 == 1', 'iVar7 != 2',
                  'FUN_00506ac0', 'FUN_0048e8d0', 'FUN_004032f0(1)', 'param_1 + 0x174', 'param_1 + 0x178', 'param_1 + 0x17c'],
}
CALL_ANCHORS = {
    0x4ea7c5: 0x409e70,
    0x40a05c: 0x40a0a0,
    0x40a0ad: 0x51bd85,
    0x40a0b6: 0x51bd85,
    0x40a0c9: 0x464c70,
    0x464c8c: 0x40a090,
    0x4e9629: 0x4033d0,
    0x4eab1c: 0x4032f0,
    0x4eab90: 0x4032f0,
    0x4eabca: 0x4032f0,
}


def load(path):
    return json.loads(path.read_text())


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def identity(path):
    h = hashlib.sha256()
    with path.open('rb') as handle:
        for part in iter(lambda: handle.read(1024 * 1024), b''):
            h.update(part)
    return dict(path=str(path.relative_to(ROOT)), bytes=path.stat().st_size, sha256=h.hexdigest())


def stable(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def evidence(value):
    if 'content' in value:
        value = value.get('structuredContent') or json.loads(next(c['text'] for c in value['content'] if c['type'] == 'text'))
    return value.get('result', value)


def dump(name, value):
    (PUBLIC / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def build():
    inputs = []
    for relative, expected in PINS.items():
        actual = identity(ROOT / relative)
        assert actual['sha256'] == expected, relative
        inputs.append(actual)
    plan = load(PUBLIC / 'game-graphics-lifetime-plan.json')
    assert plan['source_sha256'] == SHA and plan['native_profile'] == PROFILE
    pe = PE(ROOT / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe', SHA)
    membership = load(PRIVATE / 'evidence-membership-audit.json')
    assert membership['passed'] and membership['previous_records_unchanged'] == 1667
    assert membership['current_records'] == 1676 and membership['new_operations'] == {'inspect_analysis_view': 9}
    assert membership['new_native_analysis_records'] == 0
    for key in ['previous_export', 'current_export']:
        assert identity(ROOT / membership[key]['path']) == membership[key]
    recovered_path = PRIVATE / 'recovered-helper-records.json'
    recovered = load(recovered_path)
    assert recovered['source_export'] == membership['current_export']
    bodies = {entry: (load(ROOT / relative), relative, '') for entry, relative in BODY_FILES.items()}
    for i, item in enumerate(recovered['records']):
        assert sha(stable(item['record']).encode()) == item['record_sha256_stable_json_utf8']
        bodies[item['entry']] = (item['record'], str(recovered_path.relative_to(ROOT)), f'/records/{i}/record')
    assert set(bodies) == set(PATTERNS) - {'0x4ea9b0'}
    admitted, views, anchors = [], [], []
    pseudo_by_entry = {}
    for entry, (record, relative, selector) in sorted(bodies.items()):
        assert record['operation'] == 'analyze_function' and record['subject']['digest']['sha256'] == SHA
        assert record['analysis_profile']['digest'] == PROFILE
        normalized = record['normalized_result']
        procedure = normalized['procedure']
        assert procedure['address'] == entry
        ranges = []
        for span in procedure['body']['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            raw = pe.read(start, end - start + 1)
            ranges.append(dict(start=span['start'], end=span['end'], bytes=len(raw),
                               file_offset=pe.file_offset(start, len(raw)), sha256=sha(raw), original_PE_bytes_match=True))
        assert sum(r['bytes'] for r in ranges) == procedure['body']['total_bytes']
        pseudo_by_entry[entry] = normalized['pseudocode']
        admitted.append(dict(entry=entry, evidence_id=record['evidence_id'], kind='reused-canonical-dossier',
            retained_source=identity(ROOT / relative), record_pointer=selector, ranges=ranges,
            native_profile=PROFILE, parameters_sha256=sha(stable(record['parameters']).encode()),
            pseudocode_sha256=sha(normalized['pseudocode'].encode()), assembly_sha256=sha(stable(normalized['assembly']).encode()),
            direct_callee_entries=[r['address'] for r in normalized['callees']],
            source_relationship_coverage=record.get('relationship_coverage'),
            all_callees_or_business_effects_reviewed=False))
    assert sum(r['bytes'] for b in admitted for r in b['ranges']) == 1899
    for item in membership['new_view_records']:
        view_path = ROOT / item['path']
        record = evidence(load(view_path))
        assert sha(stable(record).encode()) == item['evidence_record_sha256']
        assert record['evidence_id'] == item['evidence_id'] and record['operation'] == 'inspect_analysis_view'
        normalized = record['normalized_result']
        assert normalized['coverage']['exhausted'] and normalized['artifact']['sha256'] == SHA
        entry, facet = item['entry'], item['facet']
        native = bodies[entry][0]
        assert normalized['parent_evidence_id'] == native['evidence_id']
        expected = native['normalized_result'][facet] if facet != 'procedure' else native['normalized_result']['procedure']
        observed = normalized['item']['text'] if facet == 'pseudocode' else normalized['item']
        assert observed == expected
        views.append(dict(**item, file=identity(view_path), exhausted=True, exact_original_parent_facet_match=True))
    assert len(views) == 9
    derived_path = ROOT / 'build/analysis/game-battle-shared-storage-v1/presentation/derived-window.json'
    derived = load(derived_path)
    callback = derived['entries'][0]
    assert derived['originalExecution'] is False and derived['originalBytePatches'] is False
    assert callback['requestedEntry'] == '004ea9b0' and callback['functionExistedBeforeSeed'] is False
    assert callback['decompileCompleted'] and callback['status'] == 'derived-static-export'
    instructions = callback['instructions']
    expected_address = 0x4ea9b0
    for row in instructions:
        address, raw = int(row['address'], 16), bytes.fromhex(row['bytesHex'])
        assert address == expected_address and pe.read(address, len(raw)) == raw
        expected_address += len(raw)
    assert len(instructions) == 250 and expected_address == 0x4eac80
    pseudo_by_entry['0x4ea9b0'] = callback['pseudocode']
    derived_body = dict(entry='0x4ea9b0', kind='reused-analyst-seeded-derived-static', canonical_dossier=False,
        file=identity(derived_path), selector='/entries/0', instructions=250, bytes=720,
        ranges=[dict(start='0x4ea9b0', end='0x4eac7f', bytes=720, file_offset=pe.file_offset(0x4ea9b0, 720),
                     sha256=sha(pe.read(0x4ea9b0, 720)), every_instruction_matches_original_PE=True)],
        pseudocode_sha256=sha(callback['pseudocode'].encode()),
        native_lookup_failure='Existing presentation/4ea9b0-dossier.json is a failed canonical lookup,not a function dossier;the separately admitted720B view is reused.')
    for entry, patterns in PATTERNS.items():
        lines = pseudo_by_entry[entry].splitlines()
        groups = []
        for pattern in patterns:
            hits = [i for i, line in enumerate(lines) if pattern in line]
            assert hits, (entry, pattern)
            groups.append(dict(pattern=pattern, pseudocode_line_indices_0_based=hits))
        anchors.append(dict(entry=entry, groups=groups,
            authority='Root-reviewed interpretation; string matches locate the relevant source,not automatic semantic or runtime proof.'))
    call_sites = []
    for address, target in CALL_ANCHORS.items():
        raw = pe.read(address, 5)
        assert raw[0] == 0xe8 and address + 5 + int.from_bytes(raw[1:], 'little', signed=True) == target
        call_sites.append(dict(address=hex(address), target=hex(target), bytes=5,
                               file_offset=pe.file_offset(address, 5), sha256=sha(raw)))
    assert pe.read(0x4ea7ee, 7) == bytes.fromhex('c74608b0a94e00')
    assert pe.read(0x40a024, 2) == bytes.fromhex('ffd0')
    assert pe.read(0x4e9623, 6) == bytes.fromhex('8d8e70010000')
    graph_path = PRIVATE / 'alternate-callback-incoming-selected-graph.json'
    graph = load(graph_path)
    for item in graph['inputs']:
        assert identity(ROOT / item['path']) == {k: item[k] for k in ['path', 'bytes', 'sha256']}
    proof = graph['table_source_byte_proof']
    assert sha(pe.read(int(proof['address'], 16), proof['bytes'])) == proof['sha256']
    assert proof['bytes'] == 1980 and proof['all_rows_match_fixed_PE']
    assert graph['summary']['nonzero_callback_rows'] == len(graph['callbacks']) == 97
    assert graph['summary']['callbacks_with_comparison_intersections'] == graph['summary']['callbacks_with_selected_incoming'] == 0
    assert graph['summary']['candidate_source_records_opened'] == 0
    reused = []
    for name in ['alternate-window-contract.json', 'game-dispatch-findings.json', 'game-entry-review-contract.json']:
        path = PUBLIC / name
        data = load(path)
        assert data.get('source_sha256') == SHA or data.get('source', {}).get('sha256') == SHA
        reused.append(identity(path))
    matrix = load(PUBLIC / 'capability-matrix.json')
    trace = matrix['legacy_traceability']
    assert len(matrix['capabilities']) == 38 and len(trace['remaining_requirements_mapping']) == 37
    assert len(trace['consumer_groups_mapping']) == 10 and len(load(ROOT / trace['protocol_registry_source'])['specs']) == 81
    summary = dict(reused_native_dossiers=8, canonical_ranges=8, canonical_body_bytes=1899,
        reused_derived_callbacks=1, derived_instructions=250, derived_bytes=720,
        independent_PE_relative_CALL_sites=10, cached_view_records=9, recovered_existing_parent_dossiers=3,
        new_native_dossiers=0, new_decompilations=0, alternate_table_bytes=1980,
        alternate_nonnull_callbacks=97, selected_graph_callback_incoming=0)
    source = dict(schema='moli.capability.game-graphics-lifetime-source-check.v1',
        source=identity(pe.path), native_profile=PROFILE,
        tools=dict(REA='6.7.0', Ghidra='12.1.4-retained', verifier='Python3/PE-section-mapping'),
        inputs=inputs, summary=summary, bodies=admitted, derived_body=derived_body,
        semantic_anchors=anchors, relative_CALL_byte_proofs=call_sites,
        pointer_binding_proofs=[
            dict(address='0x4ea7ee', role='creator stores4ea9b0 into object+8', bytes=7, sha256=sha(pe.read(0x4ea7ee, 7))),
            dict(address='0x40a024', role='generic dispatcher calls EAX loaded from object+8', bytes=2, sha256=sha(pe.read(0x40a024, 2))),
            dict(address='0x4e9623', role='common helper binds ECX to graphicsObject+170 before comparison', bytes=6, sha256=sha(pe.read(0x4e9623, 6)))],
        cached_views=views, evidence_membership=identity(PRIVATE / 'evidence-membership-audit.json'),
        generic_object_reference_inventory=identity(PRIVATE / 'retained-generic-object-inventory.json'),
        alternate_selected_graph_check=identity(graph_path), alternate_table=proof, reused_contracts=reused,
        native_current_export_records=1676, inherited_records_unchanged=1667, new_operations={'inspect_analysis_view': 9},
        all_selected_body_and_table_bytes_match_original_PE=True,
        limits=[
            'Literal field offsets and source logical wrapper roles are distinguished;this does not reconstruct physical random tuple storage.',
            'The source allocator/free entries51bcf8/51bd85 remain explicit native boundaries; this package does not newly decompile CRT/OS internals or prove all allocation failure behavior.',
            'The97 business callbacks have zero overlap/incoming only within the selected647-root CALL index;indirect,graph-external,alias/module andcomplete jump coverage remain unknown.',
            'Source images/resources,graphics output,glyphs,frame timing andplatform/runtime equivalence are not executed or accepted here.'],
        original_execution=False, runtime_features_changed=False)
    contract = dict(schema='moli.capability.game-graphics-lifetime-contract.v1', source=source['source'],
        source_check='analysis/capability-first-v1/game-graphics-lifetime-source-check.json', capabilities=plan['capabilities'],
        source_layouts=dict(status='source-memory-layout-not-a-file-format-or-product-ABI',
            generic_object_requested_bytes=800, auxiliary_requested_bytes=36,
            generic_object_fields={
                '+0x00': 'previous pointer', '+0x04': 'next pointer', '+0x08': 'callback pointer', '+0x0c': 'auxiliary pointer',
                '+0x14': 'type byte', '+0x15': 'priority byte', '+0x1c': 'pending-removal int32', '+0x24': 'flags word',
                '+0x2c': 'callback action-state int32', '+0x30/+0x34': 'x/y int32', '+0x38/+0x3c': 'extent increments int32',
                '+0x170': 'logical wrapper used by common eligibility comparison;not a plain ready int32',
                '+0x174/+0x178/+0x17c': 'copied wrapped value components int32/int32/byte', '+0x1d0': 'tile-mode int32'},
            auxiliary_fields={'+0x00': 'style signed int16', '+0x02': 'counter signed int16', '+0x04/+0x08': 'width/height int32',
                '+0x0c/+0x10': 'center x/y int32', '+0x14/+0x18': 'current half extents int32',
                '+0x1c': 'graphics base int32', '+0x20': 'selector signed int16;upper padding not reinterpreted'},
            input_domain_notes='4e94d0 uses descriptor style only when unsigned<1000,otherwise-2.4ea7c0 stores its full caller style asint16 but usesint32 constructor branches;other caller domains must not be guessed.'),
        facts=[
            dict(id='generic-registration', classification='fact', functions=['0x4ea7c0', '0x409e70', '0x409fe0'],
                claim='4ea7c0 requests a type3 generic object and36B auxiliary block,ORs flags6,stores4ea9b0 at object+8 and priority byte0xd4 at+15.409fe0 loads/calls object+8 with that object pointer. This binds a graphics callback consumer,not the97 business-table callback column.'),
            dict(id='construction-and-fields', classification='fact', functions=['0x4ea7c0', '0x409e70'],
                claim='Creator records x/y at+30/+34,auxiliary style word/counter0,width/height,center/extents,velocities and observed graphics/palette selectors. Optional tiled geometry follows the source signed arithmetic in64/48 units;do not generalize its negative-input behavior to ordinary ceil.'),
            dict(id='animation-and-readiness', classification='fact', functions=['0x4ea9b0', '0x4e94d0'],
                claim='Callback actionState+2c=0 draws/expands a rectangle and increments a16-bit counter. When the signed counter is>9,styles-1/-2 select state1;nonnegative styles select state2. A later callback in state1,or after the state2 drawing path,constructs logical value1 via4032f0 andcopies temporary+4/+8/+12 into object+174/+178/+17c before403320 cleanup.4e94d0 binds its comparison to the wrapper at object+170 and admits input only when logical value>0.'),
            dict(id='draw-completion-is-per-call', classification='fact', functions=['0x4ea9b0'],
                claim='State1 only performs the logical1 write. State2 selects the tiled506ac0 path for style<4 with nonzero tile mode,otherwise48e8d0. Logical1 is written even if the tile loops do not iterate. Other action states return. Readiness helpers are called again on subsequent state1/2 callbacks;this is not a one-time Boolean store or an elapsed-milliseconds animation contract.'),
            dict(id='selection-cache-marker-free', classification='fact', functions=['0x4ea5b0', '0x4e94d0', '0x40a090', '0x409fe0', '0x40a0a0'],
                claim='The prior close helper changes active slots. Inactive4e94d0 separately calls null-safe40a090(cache),clears the cache and consumes dirty once(return2).40a090 only writes object+1c=1.409fe0 later unlinks eligible marked nodes before40a0a0 passes nonnull auxiliary+0c then the object itself to51bd85. Clearing a row cache therefore precedes actual generic-record reclamation.'),
            dict(id='pump-gates-and-order', classification='fact', functions=['0x409fe0'],
                claim='Both callback and removal require bit40000 clear,or global58f6b4!=1,or phase58f6b8==0. Phase advances modulo4 per dispatcher call. A callback-marked current node is not rechecked for deletion until a later visit;callback traversal reads next after callback,whereas removal saves next before freeing. This is not proof of arbitrary callback/list reentrancy safety.'),
            dict(id='bulk-clear-is-marking', classification='fact', functions=['0x40a0c0', '0x464c70', '0x40a090'],
                claim='40a0c0 captures the current first node,calls464c70,then marks every tracked list node+1c=1.464c70 visits399x399 flag/pointer pairs;only flag byte1 is cleared andits pointer is sent to40a090. Pointer slots andother flag values are not cleared. This closed call subtree marks records;it does not invoke40a0a0 or synchronously free the generic list.'),
            dict(id='two-callback-domains', classification='fact',
                claim='All97 nonnull business callback addresses are distinct andhave no exact-address overlap withclassic callbacks/controls or main slots. None is a resolved target in the3506 selected647-root index entries. The object callback4ea9b0 consumer above does not resolve the missing business dispatcher;these finite zero results do not prove unused/unreachable code.'),
            dict(id='reuse-and-retention', classification='fact',
                claim='The matching1667-record snapshot supplied the three original helper parents;9 complete native-facet views were retained andchecked against those exact parent records. All1667 imported records are unchanged in the1676-record export. There was no new analyze_function/decompilation. The failed4ea9b0 canonical lookup andthe720-byte independently seeded body retain different authority.'),
        ],
        inferences=[
            dict(classification='inference', claim='A portable owner should model active selection,cached object,logical readiness,pending removal andfinal reclamation separately,using one shared callback/mark/sweep lifecycle.'),
            dict(classification='inference', claim='Reuse these shared rules across business windows;do not create one lifetime implementation per UI table or treat source call-count animation as a platform timer without a scheduling contract.'),
        ],
        module_contract_proposal=dict(status='specified-boundaries-not-implemented',
            responsibilities=['versioned generic object owner','source-order callback dispatch','deferred removal andauxiliary ownership','source-call animation/ready transitions','render command port'],
            inputs=['explicit source update opportunity','owned object selection/close/mark intent','admitted geometry/style andresource references'],
            outputs=['queued draw commands','logical readiness','deferred reclamation events'],
            invariants=['closing selection alone does not free a cached object','a nonparticipating return0 may still mark andclear a cache','a current callback marker is not an immediate in-callback free','generic graphics callbacks andbusiness table callbacks retain distinct contracts']),
        requirement_answers=[
            dict(question=1, status='answered-bounded-logical-writers-and-consumer', result='Construction,derived animation branches,three logical1 writer families andthe+170 input comparison are source-bound;physical tuple/RNG andfull allocator/failure policy remain separate.'),
            dict(question=2, status='answered-bounded-mark-unlink-reclaim', result='Single mark,bulk marker/grid,pump gates/traversal andauxiliary-before-object reclamation are bound;complete native OS/runtime/reset andarbitrary reentrant callback safety are not claimed.'),
            dict(question=3, status='partially-answered', result='Actual generic object+8 callback consumer identified;97 business callback consumer remains unknown within anexplicit graph/table search boundary.'),
            dict(question=4, status='answered-bounded-contract', result='Shared lifetime boundaries andremaining discovery/business/platform dependencies published without runtime changes or scope reduction.'),
        ],
        remaining=[
            dict(id='business-callback-dispatch', question='Find the actual97-callback producer/consumer through a concrete new alias/module/registration edge;do not rerun the same selected graph orliteral negative scans as new evidence.'),
            dict(id='shared-restore-and-business-owners', question='Complete active/restore/deferred/text-focus writers,per-business callback init/error/cancel/reentry andall admitted version/resource/menu dependencies.'),
            dict(id='physical-runtime-boundaries', question='Retain physical wrapped tuple/RNG effects,source allocation failures,full reset/IME/keyboard andsource-to-platform scheduling differences;this logical package is not full platform equivalence.'),
            dict(id='positive-business-frontiers', question='Next reuse the concrete21 sender caller/reference frontiers plus518d70 andef35e0/eadf88 consumers;keep the unresolved97-table branch explicit without repeating its zero-result checks.'),
            dict(id='implementation-and-acceptance', question='Unified38-domain specifications,grouped shared implementation,real web/mobile/WeChat,current normal handoff andappropriate official/account acceptance remain incomplete.'),
        ],
        original_execution=False, account_or_session_observed=False, runtime_features_changed=False,
        all_capability_analysis_complete=False, implementation_gate_passed=False, official_acceptance=False, full_goal_complete=False)
    dump('game-graphics-lifetime-source-check.json', source)
    dump('game-graphics-lifetime-contract.json', contract)
    print(json.dumps(summary))


if __name__ == '__main__':
    build()
