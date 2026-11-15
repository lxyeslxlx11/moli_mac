"""Verify retained producer contexts against the fixed source; never run the game.

Complete native Evidence, retained projections and analyst-seeded bodies remain
separate. This emits summaries/anchors, not vendor pseudocode or implementation.
"""
import hashlib
import json
import re
from pathlib import Path

from extract_entry_inventory import PE

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/capability-game-producer-context-v1'
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
MANIFEST_SHA = 'ec3799d91def07c74e7ae2dd535b078160c1df69310f3bad8c7a81918747e3e9'
CAPABILITIES = ['G01', 'G03', 'G04', 'G05', 'G10', 'G13', 'G14', 'G16', 'G18', 'B01', 'X01', 'X02', 'X06', 'X07']


def load(p):
    return json.loads(p.read_text())


def stable(v):
    return json.dumps(v, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def identity(p):
    h = hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda: f.read(1024 * 1024), b''):
            h.update(b)
    return dict(path=str(p.relative_to(ROOT)), bytes=p.stat().st_size, sha256=h.hexdigest())


def evidence(v):
    if 'content' in v:
        v = v.get('structuredContent') or json.loads(next(c['text'] for c in v['content'] if c['type'] == 'text'))
    return v.get('result', v)


def dump(n, v):
    (PUBLIC / n).write_text(json.dumps(v, ensure_ascii=False, indent=2) + '\n')


def build():
    manifest = PRIVATE / 'source-inputs.json'
    assert identity(manifest)['sha256'] == MANIFEST_SHA
    pins = load(manifest)['files']
    for pin in pins:
        assert identity(ROOT / pin['path']) == pin, pin['path']
    pe = PE(ROOT / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe', SHA)
    member = load(PRIVATE / 'evidence-membership-audit.json')
    assert member['passed'] and member['previous_records_unchanged'] == 1676 and member['current_records'] == 1703
    for key in ['previous_export', 'current_export']:
        assert identity(ROOT / member[key]['path']) == member[key]
    for q in member['new_records']:
        assert identity(ROOT / q['file']['path']) == q['file']
        assert sha(stable(evidence(load(ROOT / q['file']['path']))).encode()) == q['record_sha256']
    bodies, native, derived = {}, [], []

    def admit(record, path, pointer, kind):
        assert record['operation'] == 'analyze_function' and record['subject']['digest']['sha256'] == SHA
        assert record['analysis_profile']['digest'] == PROFILE
        n = record['normalized_result']
        entry = n['procedure']['address']
        ranges = []
        for span in n['procedure']['body']['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            raw = pe.read(start, end - start + 1)
            ranges.append(dict(start=hex(start), end=hex(end), bytes=len(raw), file_offset=pe.file_offset(start, len(raw)), sha256=sha(raw)))
        assert sum(r['bytes'] for r in ranges) == n['procedure']['body']['total_bytes']
        native.append(dict(entry=entry, evidence_id=record['evidence_id'], kind=kind,
            retained_source=identity(path), record_pointer=pointer, parameters=record['parameters'],
            record_sha256=sha(stable(record).encode()), native_profile=PROFILE, ranges=ranges,
            pseudocode_sha256=sha(n['pseudocode'].encode()), assembly_sha256=sha(stable(n['assembly']).encode())))
        bodies.setdefault(entry, n)

    reused_path = PRIVATE / 'reused-producer-functions.json'
    reused = load(reused_path)
    for i, record in enumerate(reused['records']):
        admit(record, reused_path, f'/records/{i}', 'reused-complete-native-record')
    for path in sorted(PRIVATE.glob('function-*.json')):
        admit(evidence(load(path)), path, '', 'new-canonical-native-dossier')
    reset_path = PRIVATE / 'recovered-state-reset-record.json'
    admit(load(reset_path)['record'], reset_path, '/record', 'recovered-complete-retained-native-record')
    for relative, eid in [
        ('build/analysis/capability-business-map-v1/historical-canonical-functions.json', 'ev_aa5124f04964721c0be154a4cc20e07a0a684edae6cdd7ba3afca46f366cfe9c'),
        ('build/analysis/capability-business-map-v1/reused-canonical-functions.json', 'ev_334c1f32ed72fcb6347aa133d439749fab9f5a6cb41993d9eab4d2bdfdcd66f5')]:
        path = ROOT / relative
        for i, record in enumerate(load(path)['records']):
            if record.get('evidence_id') == eid:
                admit(record, path, f'/records/{i}', 'retained-canonical-body-projection-not-full-Evidence')
                break
        else:
            raise AssertionError(eid)
    for filename in ['derived-positive-producers.json', 'derived-extra-producers.json']:
        path = PRIVATE / filename
        for selected in load(path)['entries']:
            r = selected['original_derived_entry']
            assert sha(stable(r).encode()) == selected['original_derived_entry_canonical_json_sha256']
            assert '0x' + r['requestedEntry'].lstrip('0') == selected['entry']
            spans, instruction_bytes = [], 0
            for span in r['derivedBody']:
                start, end = int(span['start'], 16), int(span['end'], 16)
                raw = pe.read(start, end - start + 1)
                assert len(raw) == span['bytes']
                spans.append(dict(start=hex(start), end=hex(end), bytes=len(raw), sha256=sha(raw)))
            for ins in r['instructions']:
                raw = bytes.fromhex(ins['bytesHex'])
                assert pe.read(int(ins['address'], 16), len(raw)) == raw
                instruction_bytes += len(raw)
            assert instruction_bytes == sum(s['bytes'] for s in spans)
            derived.append(dict(entry=selected['entry'], authority='analyst-seeded-derived-static-not-native-dossier',
                source=selected['source'], retained_copy=identity(path), original_selector=selected['record_selector'],
                record_sha256=selected['original_derived_entry_canonical_json_sha256'], ranges=spans,
                instructions=len(r['instructions']), pseudocode_sha256=sha(r['pseudocode'].encode())))
            bodies[selected['entry']] = dict(pseudocode=r['pseudocode'], assembly=[f"0x{int(i['address'],16):x}: {i['text']}" for i in r['instructions']])

    incoming, call_anchors = [], {}
    expected = {'4f6be0': ['4816b5', '481c99', '4824c9'], '4f7ee0': ['46eb75'],
                '4f8020': ['48220a', '4df808'], '4f8190': ['46b3fe'], '4f89d0': ['4f6432']}
    for target, sites in expected.items():
        r = evidence(load(PRIVATE / f'incoming-{target}.json'))
        n = r['normalized_result']
        assert n['direction'] == 'incoming'
        calls = [x for x in n['references'] if x['kind']['call']]
        assert sorted(int(x['source_address'], 16) for x in calls) == sorted(int(s, 16) for s in sites)
        for x in calls:
            assert int(x['target_address'], 16) == int(target, 16)
            assert x['source_procedure'] is None and not x['kind']['indirect'] and not x['kind']['computed']
            call_anchors[int(x['source_address'], 16)] = int(target, 16)
        incoming.append(dict(target='0x'+target, evidence_id=r['evidence_id'],
            retained_source=identity(PRIVATE / f'incoming-{target}.json'), native_calls=[dict(source=x['source_address'], target=x['target_address'], native_owner=None) for x in calls],
            completeness='exact-entry/body ReferenceManager; unresolved computed flows not excluded'))
    for start, target in [(0x4dda15,0x4f6be0),(0x46e6ed,0x4f7ee0),(0x4ee271,0x4f8760),
                          (0x466f13,0x4f6780),(0x46701a,0x4f6840),(0x47e8d2,0x4f6970),(0x480b92,0x4f7860)]:
        call_anchors[start] = target
    proofs = []
    for start, target in sorted(call_anchors.items()):
        raw = pe.read(start, 5)
        assert raw[0] == 0xe8 and start + 5 + int.from_bytes(raw[1:], 'little', signed=True) == target
        window = pe.read(max(start-20, 0x400000), 30)
        proofs.append(dict(source=hex(start), target=hex(target), file_offset=pe.file_offset(start,5),
            instruction_hex=raw.hex(), preceding_and_following_window_sha256=sha(window)))

    patterns = {
        '0x517a80': ['DAT_00fdce00', 'DAT_00fdcf08', 'DAT_00fdd010', '0x828', 'param_1 == 0', 'param_1 == 1', 'FUN_004f73c0', 'FUN_00511180'],
        '0x518090': ['FUN_00517a80(1)', 'FUN_004f7630', 'DAT_00fdda44'],
        '0x518d70': ['FUN_005019f0', 'DAT_0056ca74', 'DAT_0056ca78', 'param_2 < 1'],
        '0x518de0': ['DAT_0056ca74 == 9', 'FUN_004eeed0', 'DAT_00fefcb8 = 0xffffffff'],
        '0x5019f0': ['DAT_00f5f1a0 = 0', 'DAT_00f5f17c = param_1'],
        '0x450640': ['DAT_00d18e34', '59999', 'FUN_004f87b0'],
        '0x4edef0': ['DAT_00c60528', 'FUN_004f8990', 'FUN_004f8760', '30000'],
        '0x47e880': ['param_1 == -3', 'FUN_004f7a50', 'FUN_004f6970', 'param_1 == -1'],
        '0x47e740': ['FUN_004f7a90', 'DAT_00c1e6d4', 'param_1 == -1'],
        '0x47f330': ['100', 'FUN_004f7940', 'FUN_004f8240'],
        '0x4f5640': ['DAT_00fc8b18', 'DAT_00fc8b1c', 'FUN_004f7370'],
        '0x4f0210': ['DAT_00ef35e0', 'DAT_00eadf88', '< 0x18'],
        '0x46bbc0': ['DAT_00eadf88', '0x88'], '0x46fa10': ['DAT_00eadf88', '0x88'],
        '0x4ff080': ['DAT_00eadf88', '0x11597'],
        '0x4f6440': ['LAB_004f63e0', 'FUN_0047e4e0'],
        '0x46b070': ['case 0x17:', 'case 0x18:', 'DAT_00f536c8', 'FUN_004f8190'],
        '0x46e600': ['FUN_004fef20', 'FUN_004f7ee0'],
        '0x4dd740': ['DAT_00d72fb0', 'FUN_004f6be0'],
    }
    semantic_anchors = []
    for entry, tokens in patterns.items():
        s = bodies[entry]['pseudocode']
        for token in tokens:
            assert token in s, (entry, token)
        semantic_anchors.append(dict(entry=entry, required_tokens=tokens, pseudocode_sha256=sha(s.encode())))
    literal_values = {0x567678: 'nr', 0x56ca0c: '未设定', 0x56ca14: '不公开',
                      0x56ca80: '[提示:请选择最大的数]', 0x56ca98: '[请选择最大的数,%d次错误后将掉线]',
                      0x562f74: '把战斗时的位置变更为后排。', 0x562f90: '把战斗时的位置变更为前排。',
                      0x56303c: '设定此称号。', 0x5638c8: '打开此宠物的能力窗口。'}
    literals = []
    for address, value in literal_values.items():
        raw = value.encode('gbk') + b'\0'
        assert pe.read(address, len(raw)) == raw
        literals.append(dict(address=hex(address), file_offset=pe.file_offset(address,len(raw)), bytes=len(raw),
                             sha256=sha(raw), value=value, role='code-correlated literal;not sole business proof'))
    state_scan = load(PRIVATE / 'state-symbol-occurrences.json')
    assert state_scan['summary']['selected_roots'] == 647 and state_scan['summary']['positive_unique_roots'] == 6
    state_matches = []
    for candidate in state_scan['positive_candidates']:
        for ins in candidate['instruction_matches']:
            proof = ins.get('exact_derived_instruction_byte_proof')
            if proof:
                assert pe.read(int(proof['address'],16), proof['bytes']).hex() == proof['bytes_hex']
            state_matches.append(dict(entry=candidate['entry'], address=ins['address'], instruction=ins['text'],
                classification='array-end-immediate-not-byte-read' if 'CMP' in ins['text'] and 'ef35e0' in ins['text'].lower() else 'text-address-or-store;see-contract',
                source=candidate['source'], record_selector=candidate['record_selector']))
    assert len(state_matches) == 11
    assert sum(x['classification']=='array-end-immediate-not-byte-read' for x in state_matches) == 4

    # This prospective callback is anchored by an actual retained code-pointer
    # assignment, not guessed from proximity to CALL4df808. It is not a newly
    # admitted callback body or proof of its internal reachability.
    graph = load(PUBLIC / 'business-entry-map.json')
    prospect = next(r for r in graph['entries'] if r['entry'] == '0x4de9a0')
    prospect_path = ROOT / prospect['source']['path']
    assert identity(prospect_path) == prospect['source']
    candidates = load(prospect_path)['entries']
    i, r = next((i,r) for i,r in enumerate(candidates) if r['requestedEntry'] == '004de9a0')
    j, ins = next((j,s) for j,s in enumerate(r['instructions']) if '0x4df420' in s['text'].lower())
    pointer_raw = bytes.fromhex(ins['bytesHex'])
    assert pe.read(int(ins['address'],16),len(pointer_raw)) == pointer_raw
    callback_prospects = [dict(candidate_entry='0x4df420', producer_entry='0x4de9a0',
        source=identity(prospect_path), selector=f'/entries/{i}/instructions/{j}',
        address='0x'+ins['address'].lstrip('0'), instruction=ins['text'], bytes_hex=ins['bytesHex'],
        callback_body_reviewed=False, reaches_4df808_not_yet_verified=True),
        dict(candidate_entry='0x4f63e0', producer_entry='0x4f6440',
             source_body_evidence_id='ev_aa5124f04964721c0be154a4cc20e07a0a684edae6cdd7ba3afca46f366cfe9c',
             callback_body_reviewed=False, reaches_4f6432_not_yet_verified=True)]
    pending = load(PRIVATE / 'pending-senders.json')
    assert len(pending) == 21 and len({p['entry'] for p in pending}) == 21
    contexts = producer_contexts()
    assert {c['entry'] for c in contexts} == {p['entry'] for p in pending}
    for c in contexts:
        old = next(p for p in pending if p['entry'] == c['entry'])
        c.update(classification='fact-bounded-source-context', tag=old['detail']['tag'], wire_fields=old['detail']['fields'],
            sender_evidence_id=old['evidence_id'], full_business_semantics_verified=False)
        assert set(c['capabilities']) <= set(CAPABILITIES)
    summary = dict(prior_sender_frontiers=21, source_context_rows=21,
        reused_complete_native_record_observations=len(reused['records']),
        reused_requested_native_roots=12, new_native_dossiers=9, new_native_body_bytes=6628,
        native_record_observations=len(native), native_unique_roots=len({r['entry'] for r in native}),
        reused_derived_roots=len(derived), derived_instructions=sum(r['instructions'] for r in derived),
        derived_instruction_bytes=sum(s['bytes'] for r in derived for s in r['ranges']),
        previously_empty_sender_reference_queries=5, positive_native_CALL_sites=8,
        native_unowned_CALL_sites_with_exact_derived_owner=6, additional_selected_graph_CALL_sites=2,
        native_unowned_CALL_sites_still_without_canonical_owner=2,
        independent_PE_relative_CALL_sites=len(proofs), selected_state_roots_scanned=647,
        selected_state_positive_roots=6, selected_state_instruction_matches=11,
        immediate_array_end_comparisons=4, current_export_records=1703, prior_export_records_unchanged=1676)
    assert summary['derived_instructions'] == 4022 and summary['derived_instruction_bytes'] == 13799
    assert sum(r['ranges'][0]['bytes'] for r in native if r['kind']=='new-canonical-native-dossier') == 6628
    source = dict(schema='moli.capability.game-producer-context-source-check.v1', source=identity(pe_path()),
        native_profile=PROFILE, evidence_input_manifest=identity(manifest), inputs=pins,
        evidence_membership=identity(PRIVATE/'evidence-membership-audit.json'), native_bodies=native,
        derived_bodies=derived, incoming_references=incoming, independent_CALL_proofs=proofs,
        source_anchored_callback_prospects=callback_prospects,
        semantic_anchors=semantic_anchors, literal_anchors=literals, selected_state_instruction_matches=state_matches,
        state_scan=identity(PRIVATE/'state-symbol-occurrences.json'), summary=summary,
        native_range_identity_bound_to_fixed_source=True, derived_instruction_bytes_match_original_PE=True,
        native_range_identity_is_not_independent_runtime_memory_capture=True,
        target_execution=False, runtime_features_changed=False, all_capability_analysis_complete=False)
    dump('game-producer-context-source-check.json', source)
    contract = dict(schema='moli.capability.game-producer-context-contract.v1', source=source['source'],
        source_check='analysis/capability-first-v1/game-producer-context-source-check.json', capabilities=CAPABILITIES,
        producer_contexts=contexts, facts=shared_facts(), inferences=[dict(kind='inference',
            claim='Grouping these existing senders by state owner, rather than adding 21 standalone features, should reduce repeated analysis and integration.',
            basis='Source contexts share connection,coordinate,UI,per-character andclock owners; no measured overall time saving is claimed.')],
        dependency_batches=[
            dict(id='D0', scope='Connection queue/time,coordinate reads,UI owner/lifecycle,version andmanual-input contracts reused once.'),
            dict(id='D2/D3', scope='Profile/entry,pet/party/title/formation andcontext-menu operations share owners;preserve wire arity andunknown field meanings.'),
            dict(id='D5/D6', scope='Platform input/display andordinary manual challenges require actual platform/official acceptance;native integrity reports have no assumed web equivalent.')],
        requirement_answers=[
            dict(question=1,status='partially-answered',answer='All21 frontiers have bounded source/reference contexts;field/business labels,activation andclosure remain where explicitly listed.'),
            dict(question=2,status='answered-with-coverage-limit',answer='Allfive empty reduced lists have positive ReferenceManager calls;6 of8 map toold derived owners and2 remain without canonical owner;2 extra CALLs exist inselected graph.'),
            dict(question=3,status='partially-answered',answer='Manual challenge reply/restore anddisplay/reset text consumers are bound;ef35e0 byteconsumer/meaning remains unknown andfour selected matches arearray ends.'),
            dict(question=4,status='answered-with-scope-limit',answer='21 rows grouped byowners andsource-backed capabilities;38/81/37/10 scope unchanged;global gate remains false.')],
        remaining=[
            dict(id='menu-and-neighbor-actions',capabilities=['G04','G10'],question='Bind466e50/466f50 and47e740/47e880 activation,exact UI names andnormal receive/close paths;do not guess fromneighbour masks.'),
            dict(id='pet-and-formation-variants',capabilities=['G05','B01'],question='Close semantic enums andall caller/restore paths forfive-word petstate andselected pet/formation actions;4df808 remains unowned canonically;4de9a0 exposes actualcallback4df420 forfuture source-led tracing.'),
            dict(id='ordinary-prompt',capabilities=['G10'],question='4f6432 positively calls4f89d0;receiver4f6440 suppliesactual callbackpointer4f63e0. Decode that anchoredcallback andnormal input/admission before namingfields.'),
            dict(id='profile-and-challenge-owners',capabilities=['G03','X02'],question='Bindprofile mode0 UIactivation,named editablefields andpersistence;bindmanual challenge creation/selection callback457aa0 andall normal cancel/error/restoration paths. No automatic challenge solving.'),
            dict(id='opaque-metadata',capabilities=['G18','X02'],question='eadf88 isreceived/displayed/reset text;business label remains unproved. ef35e0 hasactualwrite butnoestablished byteconsumer inthis scope;do not inventjob/rank semantics.'),
            dict(id='global-analysis-and-platform',capabilities=['X01','X07'],question='Other admittedbusiness/97-callback dispatch/resource/modal/physical-time andversion gaps remain inunified matrix;normal official/platform acceptance isstill pending. Do not repeatedly runidentical negative searches.')],
        original_execution=False, account_or_session_observed=False, runtime_features_changed=False,
        all_capability_analysis_complete=False, implementation_gate_passed=False, official_acceptance=False, full_goal_complete=False)
    dump('game-producer-context-contract.json', contract)
    print(json.dumps(summary, ensure_ascii=False))


def pe_path():
    return ROOT / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'


def producer_contexts():
    # Summaries reference complete private bodies above; unresolved meanings stay explicit.
    rows = [
        ('4eeed0',['G03','G10','X07'],['518de0'],'manual-challenge-selection','Savedstate must equal9;send suppliedinteger thenreset transient selection andmarkold promptobject.','Manual UIproducer/cancel remains;never infercorrectanswer orautomate selection.'),
        ('4f6780',['G04','G10'],['466e50'],'neighbor-selector-request-A','Facing/neighbor mask8,party/leader,input/movement andstrict500ms sharedclock gate;orderedwrapped localX,localY.','Exact useroperation/activation andreply lifecycle unproved.'),
        ('4f6840',['G04','G10'],['466f50'],'neighbor-selector-request-B','Distinct43f220 selector with8/0xc400/0;other sharedguards and500ms gate;orderedwrapped localX,localY.','Do not merge withA orname asduel/trade without UIevidence.'),
        ('4f6970',['G10'],['47e880'],'context-option-request','Nonnegative callbackargument;fourfields localX,localY,c1e6d0,recordword(c1e998+argument*0x34). Assemblyrecovers omitted pseudocodearguments.','Creator/menu/business-field meanings andbounds remain.'),
        ('4f6be0',['G05'],['4813c0','481a30','482260','4dd740'],'selected-pet-operation','UIeventbit2/active selectedrecord andsourceguards;threefields localX,localY,selectedsignedshort(d72fb2+index*8). Extra4dd740 pathusesitsown flags.','Exact operationname/ack/wholepet lifecycle remain;wrappers arecoordinate getters,not wire fields disappearing.'),
        ('4f7370',['G16'],['4f5640'],'family-state-change-mask','Parsefourpipeintegers;storethird/fourth;maskbit1/2 comparesfirsttwo withfc8b18/fc8b1c;sendonlynonzero mask usingincoming connection.','Thisbody doesnot updatecomparison cache;full familylifecycle remains.'),
        ('4f73c0',['G03','X02'],['517a80'],'per-character-profile-disclosure','Threeintegerflag/stringpairs andfourthstring;mode0 useslivefields thenupdatesselected2088-byte cache;mode1 usescached values.','Exacteditablefield labels/mode0UI/persistence unknown;mode1 stringselection usesliveflags whilewireintegers usecached flags.'),
        ('4f7630',['G03'],['518090'],'entry-profile-followup','Always517a80(1)before oneinteger packet;value1/0 fromselected fdda44 cacheword.','Noack-gate invented;upstreamnormalstate entry/cancel/actualserveracceptance separate.'),
        ('4f77d0',['G04','G14'],['467060'],'party-join-or-leave','SendslocaldisplayX/Y andjoin1/leave0;joingatedbyfacingneighbor/flags,leave skipsjoinguards;sharedstrict500ms gate.','Membershipcomesfromreply;other partybranches andplatformacceptance remain.'),
        ('4f7860',['G05'],['480b40'],'five-word-pet-state','Loopfive0x6d8-spaced recordfields;OR0x10 intoeach correspondingc1fc14word whenrecordfieldnonzero;sendfivecontiguous words.','Exactbit/field meanings andall UIwriters remain;fifthfield isinitialized byloop despite Ghidrastack split.'),
        ('4f7940',['G05','G13'],['47f330'],'two-index-direct-operation','Bothindicesnonnegative/different andbelow100 take twointegerwirepath;otherwise withc10f30 sendinner P|index|index through4f8240 withcontextIDs.','Do not flatten direct/bankcontext branches intoone unconditionalswap.'),
        ('4f7a50',['G10'],['47e880'],'context-option-minus-three','Callbackargument-3 sendsargumentfree packet andreturns0.','Exact UIactivation andcancelmeaning needcreator;do not renameallnegative values ascancel.'),
        ('4f7a90',['G10'],['47e740'],'context-selection','Nonnegativeargument sendsinteger andstoresc1e6d4;argument-1 decrementswindowcounters;othernegative returns1.','Creator andnormalreply/close lifecycle remain.'),
        ('4f7ee0',['G16'],['46e600','46e710'],'title-selection-or-clear','46e600 mapsselectedtitle record through4fef20 andsendsnonnegative result;46e710 eventbranch sends-1. UItext corroborates set/cancel title.','Other delete/titlemodes,cache/result lifecycle remain.'),
        ('4f8020',['G05'],['481a30'],'selected-pet-mode','Twointegers:selectedsignedshort(d72fb2+index*8),sourcechosenmode. Nativecallsalso include4df808,withoutcanonical owner.','Allmode/UI meanings andactual4df420 callbackbody stillneed source-ledclosure.'),
        ('4f8190',['G10','B01'],['46b070'],'front-back-formation-toggle','Cases0x17/0x18 requireeventbit2 andcurrentf536c8 equal0/1 respectively;bothsendargumentfree packet. Tooltipsrequestfront/back battleposition.','Replypublication/timing andother UIowners remain;nooptimisticformationupdate inferred.'),
        ('4f8760',['G01','X06'],['4edef0'],'write-idle-marker','Afterstrict(lastWriteTick+30000<now)andconnectedbyte1,sendliteralbytes nr at567678. Assemblyprovespayloadpointer.','Thisdoesnot establish60s timer orclockwrap repair;queue/errorsourcecontext distinct.'),
        ('4f87b0',['G01','X06'],['450640'],'periodic-connection-packet','Whend18e34 nonzero,signed(now-last)>59999 sendsargumentfreepacket andupdatesclock;firstcall initializesclock.','Independentofwrite-idlemarker;platform scheduling/clockwrap remain.'),
        ('4f87f0',['X02','X07'],['405510','44fb60','4ec9d0','4ecc20'],'native-integrity-input-report','Positiveparentsreportnativeintegrity,timing orabnormalinput conditions. Thisisnot ordinarygameheartbeat.','Nativechecks/platformsupport neednormalofficialcompatibility;no forgedcleanreport,scannerport orprotectionbypass is specified.'),
        ('4f8990',['G01','X06'],['4edef0'],'bootstrap-not-ready-request','Receive/queueprocessing withc60528==0 sendsargumentfreepacket before4ee470 andpossiblependingstate transition;clears scratch afterordinarydispatch.','Queuebootstrap/readiness andall disconnect/restore conditions remain distinct.'),
        ('4f89d0',['G10'],[],'prompt-reply-positive-reference','ExactsourceCALL4f6432 exists;4f6440 receiverstoresparameter andregistersactualcallback4f63e0 through47e4e0.','Canonicalcallbackowner/inputfield semantics unclosed;pointerandnearbyCALLalone do not provefullcallbackcontrolflow.')]
    return [dict(entry='0x'+e, capabilities=c, positive_context_entries=['0x'+x for x in roots], role=role,
                 source_rule=rule, remaining=remaining) for e,c,roots,role,rule,remaining in rows]


def shared_facts():
    return [
        dict(id='complete-reference-versus-reduced-callers',kind='fact',entries=['0x4f6be0','0x4f7ee0','0x4f8020','0x4f8190','0x4f89d0'],
             claim='Fiveempty reducedcallerlists contain8 exactReferenceManager CALLs;6joinold derivedowners. Selectedgraphadds2morepositiveCALLs. Nativeowners remainnull;notunused-code proof.'),
        dict(id='profile-mode-asymmetry',kind='fact',entries=['0x517a80','0x518090'],
             claim='Mode0 normalizesemptytext to未设定 andnonpublic first3strings to不公开;eachstring innerencoding capacity256. Mode1 sendscachedflags butchoosesfirst3strings usingliveflags. Fourthstring alwayssupplied;profile precedesentryfollowup.'),
        dict(id='manual-challenge-state',kind='fact',entries=['0x518d70','0x518de0','0x5019f0'],
             claim='Challengecallback handlesnormalreply/error text,requestsrestoredsavedmain via5019f0 thenrestoressubstate onresult1;elsewarnswithremainingattempts andrequestsstate11 below1. Setterwritespendingmainf5f17c andclearssubstate;currentmain publication isnotprovedhere. Manualdisplay/selectiononly.'),
        dict(id='metadata-addresses',kind='fact',entries=['0x4f0210','0x471420','0x4e6780','0x46bbc0','0x46fa10','0x4ff080'],
             claim='4f0210 writeslowbyteef35e0 andreceived/unescaped text at eadf88 withlength<24elsefallback. eadf88 iscopied/displayed bytraditional/alternate UIs andzeroed within0x11597-dword reset. Fourselected CMP-immediateef35e0 hitsarearrayends,notbyteconsumers;businesslabel remainsunproved.'),
        dict(id='field-arity-and-timers',kind='fact',entries=['0x466e50','0x466f50','0x47e880','0x480b40','0x4edef0','0x450640'],
             claim='Assemblypreserves2/4/5argumentoperations whenpseudo omitsarguments/splitsstack. nr30000ms writeidle andsigned59999msperiodic timersaredistinct;preservesourcecomparisons andqueueconditions.'),
        dict(id='protection-role-boundary',kind='fact',entries=['0x405510','0x44fb60','0x4ec9d0','0x4ecc20'],
             claim='4f87f0 parentsarenativeintegrity/timing/inputreporting;noordinaryheartbeatlabel orassumedcross-platformcleanreport. Investigationdidnotexecuteoriginal,alterchecks orautomatechallengeanswers.')]


if __name__ == '__main__':
    build()
