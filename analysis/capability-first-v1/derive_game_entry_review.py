"""Verify the retained 72-root review against the fixed PE; publish summaries only.

No target execution, provider query, product mutation, or new decompilation.
The original business map remains immutable. This is a separate semantic overlay.
"""

import collections
import hashlib
import json
import re
from pathlib import Path

from extract_entry_inventory import PE

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/capability-game-entry-review-v1'
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
WORKER_SHA = '81cef5dfaf216de261c175aa9119323f50a83f58379a1245b8f996ce71330eba'
CORE = ['evidence_id', 'subject', 'analysis_profile', 'provider', 'operation', 'parameters', 'normalized_result']


def load(path):
    return json.loads(path.read_text())


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def stable(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def identity(path):
    raw = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(raw), sha256=sha(raw))


def dump(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def pointer(value, path):
    for part in path.strip('/').split('/'):
        value = value[int(part)] if isinstance(value, list) else value[part]
    return value


# Root-reviewed effects. Addresses are fixed-build locators, not portable APIs.
# A retained dossier establishes its body, not the semantics of every callee.
EFFECTS = {
    '0x4678a0': ('shared-constant', ['X02'],
        'Returns 1 without calls or stores. The 36 initializer/destructor occurrences retain their different table contexts.',
        ['return 1'], 'Callback return consumption still follows each window caller; this is not 36 separate features.'),
    '0x48a060': ('battle-window-frame', ['B01', 'G07', 'X02'],
        'Window26 frame calls469670, refreshes selected control text in modes3/4, scans active actor flags and chooses alias/name for a target header, then queues text/graphic presentation.',
        ['FUN_00469670', 'DAT_00c10a54', 'FUN_00437430', 'DAT_0058fac4', 'FUN_0044f2c0', 'FUN_0044f890'],
        'Names of the mode3/4 enums, the complete input/selection lifecycle and platform text rendering are separate dependencies.'),
    '0x4a31b0': ('shared-constant', ['X02'],
        'Returns 0 without calls or stores. The 1464 classic-control occurrences share the body, not business behavior.',
        ['return 0'], 'Business controls and event-bit dispatch must be reviewed through their actual owners.'),
    '0x5015a0': ('main-state-dispatch', ['G03', 'X02'],
        'Converts host cursor coordinates; consumes pending main state; dispatches the source main table; state5 runs a broad ordered reset; state11 runs a timed return path; state13 selects a version-upgrade UI.',
        ['GetCursorPos', 'ScreenToClient', 'ShowCursor', 'DAT_00f5f1a8', 'switch(DAT_00f5f17c)', 'case 5:', 'case 0xb:', 'case 0xd:', 'FUN_00409fe0', 'FUN_00506e80', 'GetDesktopWindow', 'keybd_event'],
        'Callee-owned reset/graphics/IME/storage effects and adapter decisions remain open; the retained caller list is not complete relationship coverage.'),
    '0x4eec00': ('receive-state-effect', ['G01', 'G03'],
        'Only pending ack1 becomes2. Full status0 sets session success, timestamps and processes a detail prefix/suffix; a specific nonzero detail remaps the retained low16 status.',
        ['DAT_00d5d788 == 1', 'DAT_00d5d778', 'DAT_00d5d776 = 1', 'DAT_00922f5c', 'FUN_00405620'],
        'Reuse the session contract; suffix405620, complete digest/bootstrap and actual transport/session acceptance are not closed here.'),
    '0x4eee60': ('receive-delegation', ['G01'],
        'Delegates the two decoded integers to518d70; no local state update is present in this wrapper.',
        ['FUN_00518d70(param_2,param_3)'], 'Follow518d70 and its consumers before assigning the two integers a business meaning.'),
    '0x4eef20': ('receive-state-effect', ['G02'],
        'Pending ack1 becomes2. Status0 marks roster success and supplies two alternating name/record pairs to500630; exact OUTOFSERVICE sets result2.',
        ['DAT_00d5d788 == 1', 'DAT_00d5d77a = 1', 'FUN_00500630', 'iVar3 = iVar3 + 2', 's_OUTOFSERVICE'],
        'Reuse the two-slot roster contract and its bounds; this is not complete character selection or deletion.'),
    '0x4ef130': ('receive-state-effect', ['G02', 'G03'],
        'Pending ack1 becomes2. Exact successful marks entry flags; other replies populate an error-text buffer under the observed flag/detail conditions.',
        ['DAT_00d5d788 == 1', 's_successful', 'DAT_00d5d780 = 1', 'DAT_00d5d784 = 1', 'DAT_00923624'],
        'Source handshake success is distinct from a complete scene, player/UI and official acceptance.'),
    '0x4ef290': ('receive-state-effect', ['G03'],
        'Pending success sets return-result1; unsolicited successful sets ack2/result2, resets wrapped state, requests main7 and a local notice.',
        ['DAT_00d5d788 == 1', 'DAT_00d5d782 = 1', 'DAT_00d5d782 = 2', 'FUN_00501a30(7)', 'FUN_00510000'],
        'Reuse server-return notice/request separation; wrapped-state storage and complete scene/UI recovery remain separate.'),
    '0x4ef480': ('receive-state-effect', ['G02'],
        'Pending exact successful marks creation success and updates the selected148-byte record with returned field15 and cached preview variant.',
        ['DAT_00d5d788 == 1', 'DAT_00d5d77e = 1', 'DAT_00f5f048', 'iVar3 * 0x94', 'DAT_00924f38'],
        'Roster requery remains authoritative; do not fabricate a created name/identity or automatically enter it.'),
    '0x4ef510': ('receive-delegation', ['G04', 'G03'],
        'Outside gate924f30 delegates nine decoded integers to460240. On success it conditionally clears scene-wait state and performs deferred map initialization.',
        ['DAT_00924f30 == 0', 'FUN_00460240', 'DAT_0096ba10 == param_3', 'DAT_00bff324 = 0', 'FUN_00460180'],
        'Argument names and map-cache semantics follow the existing map source contract, not the wrapper prototype alone.'),
    '0x4ef580': ('receive-state-effect', ['G04', 'G03'],
        'Parses token triples and calls45f850; matching map identities release pending initialization, set coverage-ready state and clear selected load flags.',
        ['DAT_00924f30 == 0', 'FUN_0045f850', 'FUN_00460180', 'DAT_0096ba30 = 1', 'DAT_00bff32c = 0'],
        'The void/large-stack decompiler signature is not a wire ABI. Reuse the six-int-plus-bytes dispatch row and independently specified map parser.'),
    '0x4ef840': ('receive-state-effect', ['G04', 'G05'],
        'Resets selected movement state, updates local coordinates, refreshes body position and writes current facing through four ordered helpers.',
        ['FUN_0045f1c0', 'FUN_004ff580(param_2,param_3)', 'FUN_004ff5a0', 'FUN_004ff700(param_4)'],
        'Logical coordinates/facing have prior source bindings; native wrapped storage and every actor lifecycle effect remain outside this wrapper review.'),
    '0x4ef870': ('receive-state-effect', ['G03', 'G04', 'G06'],
        'Marks scene loading, prepares map header/resource parameters, clears selected scene state, resets movement and records a positive optional transition plus final resource-related value.',
        ['DAT_00bff324 = 1', 'FUN_0045f530', 'FUN_0045f2a0', 'FUN_0045f2f0', 'DAT_0096b9d8 = 0', 'DAT_00f5f194 = 1'],
        'Reuse the twelve-field scene contract; opaque modes are not assigned new names and complete source scene/UI recovery remains open.'),
    '0x4ef9d0': ('receive-state-effect', ['G03', 'G07'],
        'Unescapes whole input, selects/unescapes its first token, copies a bounded scene label or fallback and derives a nonnegative second decimal or-1; a pending load sets a deferred flag.',
        ['FUN_00511000(param_2)', 'FUN_005111a0(local_100)', '0x19', 'DAT_00957e50', 'DAT_00f5f188', 'DAT_00bff32c == 1'],
        'Reuse exact byte/escape/label semantics from the scene contract; platform glyph rendering is separate.'),
    '0x4f0210': ('receive-state-effect', ['G01'],
        'Outside924f30 stores the low byte at ef35e0 and unescapes a text value, copying it to eadf88 only below24 bytes or using the source fallback.',
        ['DAT_00924f30 == 0', 'DAT_00ef35e0 = param_2', 'FUN_005111a0(param_3)', '0x18', 'DAT_00eadf88'],
        'Find readers/writers of ef35e0 and eadf88 before naming this flag/text or assigning an actor/HUD capability.'),
    '0x4f06f0': ('receive-state-effect', ['G05', 'G07'],
        'Outside924f30 writes48 unescaped text/int/int label records with stride28; negative first integer clears the row; creates and sorts a separate copy.',
        ['DAT_00924f30 == 0', 'DAT_00f5eb10', 'pcVar6 = pcVar6 + 0x1c', 'FUN_004fef80', 'FUN_004fefb0'],
        'Reuse the safe19-byte text domain and distinction between raw selected labels and sorted copy; native unchecked copies are not reproduced.'),
    '0x4f07d0': ('receive-state-effect', ['G14', 'G05'],
        'Updates/removes a five-slot party record using a field mask; refreshes local/remote body membership, can dissolve the party or cascade old follower coordinates.',
        ['DAT_00924f30 == 0', 'FUN_00510f80', 'FUN_00500500', 'FUN_00461f40', 'FUN_004ffbd0', 'FUN_0043ce90'],
        'Reuse source slot/mask/record bounds; complete follower queues, body lifecycle and UI acceptance remain separate.'),
    '0x4f1240': ('receive-state-effect', ['G05', 'G07'],
        'Reads up to five actor-ID/four-number groups, stops on empty ID and updates four wrapped value pairs only for an indexed existing actor.',
        ['FUN_00510f00(local_800)', 'FUN_00440250(uVar2)', 'iVar7 + 0x174', 'iVar7 + 0x184', 'iVar7 + 0x1b4', 'iVar7 + 0x1c4', 'iVar8 = iVar8 + 5'],
        'Reuse actor-vitals interpretation and unsupported arithmetic bounds; this wrapper does not select the main local body.'),
    '0x4f2010': ('receive-state-effect', ['G05'],
        'Outside924f30 and a wrapped-state gate parses actor rows, distinguishes local ID from indexed remote bodies, updates known bodies and collects missing IDs.',
        ['DAT_00924f30 == 0', 'FUN_0043b1f0', 'DAT_00f536a8 == iVar2', 'FUN_00440250', 'uStack00000004 < 0x1000', 'FUN_0043e610'],
        'Recovered stack/parameter view is incomplete. Reuse actor/ride/spin source contracts rather than infer a new void wire signature or unknown row meanings.'),
    '0x4f2bb0': ('receive-state-effect', ['G03', 'G05', 'X02'],
        'Writes local entity identity through4ff570, records an integer/time/config-derived value and dispatches a local audio selection; stores two additional context integers.',
        ['FUN_004ff570(param_2)', 'DAT_007283f4', 'FUN_0051b669', 'FUN_00451a80', 'FUN_0044a3f0', 'DAT_0095d554'],
        'Only local identity has a reused named binding here; the other fields and full time/audio owner lifecycle are not newly closed.'),
    '0x4f2c40': ('receive-delegation', ['G09', 'G11'],
        'Outside924f30 swaps two inventory rows and notifies item, shop and service consumers with the same two indices.',
        ['DAT_00924f30 == 0', 'FUN_005009b0', 'FUN_004e1d20', 'FUN_004cc550', 'FUN_004c80b0'],
        'Reuse item-swap/service contracts; full business-window ownership and all inventory operations are distinct.'),
    '0x4f3310': ('receive-state-effect', ['G14', 'G04'],
        'Outside924f30 applies two observed party-action result branches; one clears follow state/party records and invokes4f8340; both finish by clearing the pending action word.',
        ['DAT_00924f30 == 0', 'param_2 == 1', 'param_2 == 0', 'FUN_00500500', 'FUN_004f8340', 'DAT_00f5f16c = 0'],
        'Reuse party-action/follow semantics. The shortened decompiler call to a three-int sender does not establish its full argument ABI.'),
    '0x4f3390': ('receive-state-effect', ['G04', 'B01'],
        'Updates two wrapped coordinate-like records and copies the first into the scene backup triplet.',
        ['FUN_004032f0(param_2)', 'FUN_004032f0(param_3)', 'DAT_00978a3c', 'DAT_00a6e10c', 'DAT_00bff30c'],
        'Battle-transition context is reused; full wrapped-storage effects and all transition branches are not established by these copies alone.'),
    '0x4f3430': ('receive-state-effect', ['B01', 'B04', 'G03'],
        'Outside924f30 separates a special return branch from encounter entry. Positive encounter mode sets pending/mode/background flags and resets two four-slot queues; a nonpositive mode performs only its observed partial reset.',
        ['DAT_00924f30 != 0', 'DAT_00c5ec18 != 0', 'FUN_00501a10(9,1)', 'FUN_004f67f0', 'DAT_00599e0c = 1', 'DAT_00599d90 = 1'],
        'Nonpositive mode does not clear an already pending encounter. Reuse the separate ordinary entry and special return contracts.'),
    '0x4f36d0': ('receive-state-effect', ['B01', 'B02', 'X02'],
        'Battle input chooses C, P, A first, then second-byte U, then M. C/M use separate four-slot4096-byte rings; P/A parse hex fields and A calls436f50.',
        ["cVar1 == 'C'", "cVar1 == 'P'", "cVar1 == 'A'", "param_2[1] == 'U'", "cVar1 == 'M'", 'FUN_00436f50'],
        'Receiving M is not input completion. Queue count/safe byte bounds, full command scheduling and rendering retain their existing independent contracts and gaps.'),
    '0x4f4640': ('receive-delegation', ['G18'],
        'Only when the observed wrapped-state getter returns0 delegates bytes to4d6890, the primary work-target consumer.',
        ['thunk_FUN_004034f0', 'iVar1 == 0', 'FUN_004d6890(param_2)'],
        'Reuse known kind3 target rules; remaining work contexts/types and full UI lifecycle remain open.'),
    '0x4f4660': ('receive-delegation', ['G18'],
        'Only when the observed wrapped-state getter returns0 delegates bytes to4d5dd0, the secondary work-target consumer.',
        ['thunk_FUN_004034f0', 'iVar1 == 0', 'FUN_004d5dd0(param_2)'],
        'Reuse saved source ordinals and known secondary target rules; no guessed target rows or contexts.'),
    '0x4f4a70': ('receive-state-effect', ['G02'],
        'Stores the low byte of the decoded integer in the character category slot924f40, without an ack gate.',
        ['DAT_00924f40 = param_2'], 'Reuse unsigned category consumers; a byte write is not a licensing or current-server entitlement conclusion.'),
    '0x4f4a80': ('receive-state-effect', ['G02'],
        'Stores the low byte at5676ac; only main13 changes the subphase to100 for zero or200 otherwise.',
        ['DAT_005676ac = param_2', 'DAT_00f5f17c == 0xd', 'DAT_00f5f1a0'],
        'Reuse version-upgrade request ownership and requery rules; do not modify character category locally.'),
    '0x4f4de0': ('receive-state-effect', ['G16'],
        'Outside924f30 processes a positive count of slot/flags/title triples in48-byte family-role records; flags-1 clears a record, otherwise accepts unescaped title below41 bytes.',
        ['DAT_00924f30 == 0', 'iVar3 == -1', 'DAT_00fbb0c4', 'DAT_00fbb0c8', '0x29', 'iVar6 = iVar6 + 3'],
        'Reuse32-role capacity, permissions and independent bounds; native unchecked indices/copies are not portable behavior.'),
    '0x4f5520': ('receive-delegation', ['G16'],
        'Calls516c40 only if the received integer equals the current family-context integer fbb058; the reused family contract identifies the delegated roster reset.',
        ['DAT_00fbb058 == param_2', 'FUN_00516c40'],
        'Full516c40 dialog/owner effects remain a caller-context dependency; the equality alone does not name a new family action.'),
    '0x4f6440': ('receive-state-effect', ['G01', 'X02'],
        'Stores the received integer in d5d7b0 and requests a fixed local prompt through47e4e0 with callback4f63e0.',
        ['DAT_00d5d7b0 = param_2', 'FUN_0047e4e0', 'LAB_004f63e0'],
        'The prompt callback/close/reentry and complete connection failure lifecycle remain separate dependencies.'),
}

# Only positively corroborated business associations are promoted beyond G01.
# Generic wire format does not establish the meaning of an unknown caller.
SEND_BINDINGS = {
    '0x4f6530': (['G04'], 'Existing local movement evidence binds callers461d00/461e00; the wrapper serializes five integers.', 'game-legacy-local-movement-v1/source-check.json'),
    '0x4f6610': (['G04'], 'Existing local movement missing-cache rules bind461e90 to map requests; retained461e90/460240 caller metadata links this six-integer wrapper.', 'game-legacy-local-movement-v1/implementation-spec.json'),
    '0x4f6710': (['G04'], 'Existing local movement evidence binds caller461bf0; the wrapper serializes two integers.', 'game-legacy-local-movement-v1/source-check.json'),
    '0x4f67f0': (['B01', 'B04'], 'Reviewed receiver4f3430 calls this sender with a zero integer in its special return branch;437b30 is also retained as a caller.', 'game-battle-transition-v1/source-check.json'),
    '0x4f74e0': (['G10'], 'Actor-interaction source binds460c40 right press to integer3 and the selected actor ID.', 'game-battle-shared-storage-v1/actor-interaction-source-check.json'),
    '0x4f79b0': (['G18'], 'Work-target source binds472a10 to the primary skill-slot target query; the chosen caller metadata is empty and is not a completeness proof.', 'game-work-targets-v1/source-check.json'),
    '0x4f7a00': (['G18'], 'Work-target source binds47a960 to the saved primary ordinal query; chosen caller metadata is empty.', 'game-work-targets-v1/source-check.json'),
    '0x4f7ae0': (['G09'], 'Item-target source binds the eligible target/source bag-index submission; chosen caller metadata is empty.', 'game-battle-shared-storage-v1/item-targets-source-check.json'),
    '0x4f7be0': (['G18'], 'Craft-input source binds501160 to logical tileX,tileY and work pose.', 'game-craft-input-v1/source-check.json'),
    '0x4f8340': (['G14', 'G04'], 'Reviewed party-action receiver4f3310 invokes this three-integer sender after clearing party/follow state; recovered call arguments are incomplete.', 'game-party-follow-v1/source-check.json'),
    '0x4f83d0': (['G03'], 'Session source binds4ee730 to three byte fields: module digest,glt,gid; no live values or substitute fingerprint are supplied.', 'game-session-runtime-v1/source-check.json'),
    '0x4f8460': (['G02'], 'Character-creation source binds4ef3a0 to slot,name,appearance/icon,allocation and four-value fields.', 'game-character-lifecycle-v1/source-check.json'),
    '0x4f8650': (['G02', 'G03'], 'Post-login source binds4ef060 to record fields15/17/2, not slot ordinal or name.', 'game-post-login-v1/source-check.json'),
    '0x4f86e0': (['G02'], 'Post-login source binds4eed10 to the argument-free roster request.', 'game-post-login-v1/source-check.json'),
    '0x4f8720': (['G03'], 'Server-return source binds4ef1e0 to this explicit request, distinct from the unsolicited VKW notice.', 'game-legacy-server-return-v1/source-check.json'),
    '0x4f8880': (['G02'], 'Character-options source binds455f90/459bc0 to kind/marker version-upgrade branches; unknown kind5 marker remains unsupported.', 'game-character-options-v1/source-check.json'),
    '0x4f88f0': (['B01', 'B02', 'G09'], 'Battle-input and item-input sources bind the byte command payload to observed battle player/pet/item actions.', 'game-battle-input-v1/source-check.json'),
    '0x4f8940': (['G18'], 'Craft-input source binds4748e0 to duration seconds after a single CRT random draw; other callers/contexts remain distinct.', 'game-craft-input-v1/source-check.json'),
}

CONTEXT_KEYS = {
    'game-session-runtime-v1/source-check.json': ['native_semantics'],
    'game-post-login-v1/source-check.json': ['roster', 'entry'],
    'game-character-lifecycle-v1/source-check.json': ['request', 'reply'],
    'game-character-options-v1/source-check.json': ['upgrade', 'entry'],
    'game-local-bootstrap-v1/source-check.json': ['source_slots'],
    'game-legacy-scene-v1/source-check.json': ['facts'],
    'game-actor-text-v1/source-check.json': ['source_facts'],
    'game-actor-vitals-v1/source-check.json': ['source_facts'],
    'game-battle-transition-v1/source-check.json': ['facts'],
    'game-battle-input-v1/source-check.json': ['observed_facts'],
    'game-work-targets-v1/source-check.json': ['facts'],
    'game-craft-input-v1/source-check.json': ['facts'],
    'game-legacy-server-return-v1/source-check.json': ['direct_calls', 'notice'],
    'game-battle-shared-storage-v1/item-input-source-check.json': ['facts'],
    'game-battle-shared-storage-v1/item-targets-source-check.json': ['facts'],
    'game-battle-shared-storage-v1/actor-interaction-source-check.json': ['facts'],
    'game-battle-shared-storage-v1/family-management-source-check.json': ['roles'],
    'game-legacy-local-movement-v1/source-check.json': ['functions', 'byte_and_mapping_checks'],
    'game-party-follow-v1/source-check.json': ['source_facts'],
    'game-legacy-local-movement-v1/implementation-spec.json': ['facts'],
}


def build():
    worker_path = PRIVATE / 'unmapped-body-inventory.json'
    assert sha(worker_path.read_bytes()) == WORKER_SHA
    worker = load(worker_path)
    review = load(PRIVATE / 'review-roots.json')
    inventory = load(OUT / 'entry-inventory.json')
    index = load(OUT / 'entry-evidence-index.json')
    business = load(OUT / 'business-entry-map.json')
    assert inventory['source']['sha256'] == index['source_sha256'] == business['source_sha256'] == SHA
    pe = PE(ROOT / inventory['source']['path'], SHA)
    for item in worker['inputs']:
        assert identity(ROOT / item['path']) == {k: item[k] for k in ['path', 'bytes', 'sha256']}, item['path']
    source_documents = {r['source']['path']: load(ROOT / r['source']['path']) for r in review}
    index_by_entry = {r['entry']: r for r in index['entries']}
    current_by_entry = {r['entry']: r for r in business['entries']}
    assert len(review) == len(worker['roots']) == 72
    assert {r['entry'] for r in review} == {r['entry'] for r in business['entries'] if not r['capability_candidates']}
    assert set(EFFECTS).isdisjoint(SEND_BINDINGS)
    contexts = []
    for relative, keys in CONTEXT_KEYS.items():
        path = ROOT / 'analysis' / relative
        data = load(path)
        # These are reused public summaries, not newly queried native dossiers.
        assert SHA in json.dumps(data.get('source')), relative
        for key in keys:
            assert key in data, (relative, key)
        contexts.append({**identity(path), 'reviewed_sections': keys})
    bodies, assignments, anchors = [], [], []
    counts = collections.Counter()
    for original, row in zip(review, worker['roots']):
        entry = row['entry']
        assert original['entry'] == entry and original == current_by_entry[entry]
        assert row['semantic_status'] == 'Unassigned; all capability decisions remain with the root agent.'
        document = source_documents[row['source']['path']]
        observations = [(i, record) for i, record in enumerate(document['records']) if record.get('evidence_id') == row['evidence_id']]
        assert len(observations) == len(row['source_observations'])
        cores = [stable({key: record.get(key) for key in CORE}) for _, record in observations]
        assert len(set(cores)) == 1 and sha(cores[0].encode()) == row['core_record_sha256_stable_json_utf8']
        record = pointer(document, row['preferred_record_pointer'])
        assert record['operation'] == 'analyze_function'
        assert record['subject']['digest']['sha256'] == SHA and record['analysis_profile']['digest'] == PROFILE
        view = record['normalized_result']
        assert view['procedure']['address'] == entry
        assert sha(view['pseudocode'].encode()) == row['body']['pseudocode_sha256_utf8']
        assert sha(stable(view['assembly']).encode()) == row['body']['assembly_sha256_stable_json_utf8']
        ranges = []
        for span in original['ranges']:
            start = int(span['start'], 16)
            size = int(span['end'], 16) - start + 1
            raw = pe.read(start, size)
            assert size == span['bytes'] and pe.file_offset(start, size) == span['file_offset']
            assert sha(raw) == span['sha256']
            ranges.append({**span, 'original_PE_bytes_match': True})
        native_ranges = view['procedure']['body']['ranges']
        assert [(r['start'], r['end']) for r in native_ranges] == [(r['start'], r['end']) for r in ranges]
        occurrences = index_by_entry[entry]['occurrences']
        assert occurrences == row['origin']['occurrences_as_indexed'] and len(occurrences) == original['occurrence_count']
        for binding in row['origin']['inventory_bindings']:
            actual = pointer(inventory, binding['source_pointer'])
            if binding['kind'] == 'classic-window-callback':
                assert actual == entry
            elif binding['kind'] == 'classic-control':
                assert actual == binding['control'] and actual['callback'] == entry
            else:
                assert actual == binding['row']
                target = int(actual['target'], 16)
                assert any(int(s['start'], 16) <= target <= int(s['end'], 16) for s in ranges)
        protocol = []
        for binding in row['origin']['protocol_slots_as_recorded']:
            actual = pointer(inventory, binding['source_pointer'])
            assert actual == binding['row']
            tag = pe.read(int(actual['tag_address'], 16), 4)
            assert tag == actual['tag'].encode('ascii') + b'\0' and sha(tag) == actual['tag_word_sha256']
            assert pe.file_offset(int(actual['tag_address'], 16), 4) == actual['tag_file_offset']
            protocol.append(dict(direction=binding['direction_as_recorded'], inventory_pointer=binding['source_pointer'], row=actual, original_tag_bytes_match=True))
        # Recheck each retained short window, without publishing its vendor text.
        windows = [row['body']['entry_window']]
        for section in ['direct_CALL_instructions', 'non_immediate_CALL_instructions']:
            windows += [item['window'] for item in row['calls'][section]]
        windows += [item['window'] for item in row['return_instructions']]
        for window in windows:
            lines = view['assembly'][window['start_index_0_based']:window['end_index_exclusive']]
            assert sha('\n'.join(lines).encode()) == window['sha256_utf8_joined_lines']
        counts['short_windows'] += len(windows)
        callers = row['caller_and_reference_metadata']
        assert callers['callers_field_present'] and not callers['incoming_references_field_present']
        assert 'incoming_references' not in view and 'relationship_coverage' not in view and 'relationship_coverage' not in record
        assert [c['owner_metadata_as_recorded'] for c in callers['callers']] == view['callers']
        sender = bool(protocol and protocol[0]['direction'] == 'send')
        pseudo = view['pseudocode']
        if sender:
            counts['senders'] += 1
            wire = protocol[0]['row']
            encoded = re.findall(r'FUN_004fca(70|b0)\(param_\d+,DAT_00567db4\)', pseudo)
            assert ['int32' if v == '70' else 'bytes' for v in encoded] == wire['fields']
            assert 'FUN_004fcea0' in pseudo and 'FUN_004fca20' in pseudo and 'FUN_004fce00' in pseudo
            tag_operand = int(wire['tag_address'], 16).to_bytes(4, 'little')
            assert any(tag_operand in pe.read(int(s['start'], 16), s['bytes']) for s in ranges)
            kind, caps = 'wire-producer', ['G01']
            fact = 'Formats the fixed source tag, serializes ordered fields through4fca70(int32)/4fcab0(bytes), appends through4fca20 and queues through4fce00 using the shared567db8/567db4 buffers.'
            patterns = ['FUN_004fcea0', 'FUN_004fca20', 'FUN_004fce00']
            business_binding = None
            if entry in SEND_BINDINGS:
                linked_caps, reason, source = SEND_BINDINGS[entry]
                caps += linked_caps
                business_binding = dict(classification='fact-with-bounded-reused-context', capabilities=linked_caps, claim=reason, source='analysis/' + source)
                remaining = 'The named source path is bounded; complete caller conditions, other callers, cancellation/reentry and server/platform acceptance remain separate.'
                counts['senders_with_corroborated_business_context'] += 1
            else:
                targets = [c['entry_as_recorded'] for c in callers['callers']]
                remaining = ('Review retained positive caller bodies/arguments/conditions at ' + ','.join(targets) if targets else
                             'No callers are retained in this reduced view. Query instruction/data/table references for this exact entry and compare coverage before choosing a business owner.')
                counts['senders_business_context_pending'] += 1
            if not callers['callers']:
                counts['senders_without_retained_callers'] += 1
            detail = dict(fields=wire['fields'], tag=wire['tag'], business_binding=business_binding,
                          absence_of_encoded_fields_is_not_missing_formatter=len(encoded) == 0)
        else:
            kind, caps, fact, patterns, remaining = EFFECTS[entry]
            detail = None
            counts['non_sender_roots'] += 1
        hit_groups = []
        for pattern in patterns:
            hits = [i for i, line in enumerate(pseudo.splitlines()) if pattern in line]
            assert hits, (entry, pattern)
            hit_groups.append(dict(pattern=pattern, pseudocode_line_indices_0_based=hits))
        anchors.append(dict(entry=entry, source=row['source']['path'], record_pointer=row['preferred_record_pointer'],
                            pseudocode_sha256=row['body']['pseudocode_sha256_utf8'], groups=hit_groups,
                            interpretation_authority='root-reviewed-summary; matching text is a locator, not an automatic semantic proof'))
        assert all(cap in {c['id'] for c in load(OUT / 'capability-matrix.json')['capabilities']} for cap in caps)
        assignments.append(dict(entry=entry, role=kind, classification='fact-bounded-body-and-explicit-context',
             capabilities=caps, claim=fact, detail=detail, remaining=remaining,
             evidence_id=row['evidence_id'], source_check_pointer=f'/bodies/{len(bodies)}',
             source_occurrence_roles=original['roles'], source_occurrence_count=original['occurrence_count'],
             retained_caller_entries=[c['entry_as_recorded'] for c in callers['callers']],
             caller_coverage='not-retained; neither caller absence nor non-immediate CALL implies complete/unresolved coverage',
             full_business_semantics_verified=False))
        bodies.append(dict(entry=entry, evidence_id=row['evidence_id'], authority=original['authority'],
            source=row['source'], record_pointer=row['preferred_record_pointer'],
            equivalent_record_pointers=[f'/records/{i}' for i, _ in observations],
            core_record_sha256=row['core_record_sha256_stable_json_utf8'], native_profile=PROFILE,
            parameters_sha256=sha(stable(record['parameters']).encode()), ranges=ranges,
            pseudocode_sha256=row['body']['pseudocode_sha256_utf8'], assembly_sha256=row['body']['assembly_sha256_stable_json_utf8'],
            protocol_bindings=protocol, occurrence_index=f'entry-evidence-index.json#{entry}',
            original_occurrences_checked=len(occurrences), inventory_bindings_checked=len(row['origin']['inventory_bindings']),
            retained_callers=len(callers['callers']), incoming_references_retained=False, relationship_coverage_retained=False,
            immediate_CALL_instructions=len(row['calls']['direct_CALL_instructions']),
            non_immediate_CALL_instructions=len(row['calls']['non_immediate_CALL_instructions']),
            provider_unresolved_calls_as_recorded=original['unresolved_call_sites']))
        counts['ranges'] += len(ranges)
        counts['body_bytes'] += sum(s['bytes'] for s in ranges)
        counts['equivalent_record_selectors'] += len(observations)
        counts['duplicate_record_roots'] += len(observations) > 1
        counts['occurrences'] += len(occurrences)
        counts['inventory_bindings'] += len(row['origin']['inventory_bindings'])
        counts['protocol_tags'] += len(protocol)
        counts['retained_callers'] += len(callers['callers'])
    assert counts['senders'] == 39 and counts['non_sender_roots'] == 33
    assert counts['ranges'] == 72 and counts['body_bytes'] == 12617
    assert counts['duplicate_record_roots'] == 41 and counts['equivalent_record_selectors'] == 113
    assert set(EFFECTS) | {a['entry'] for a in assignments if a['role'] == 'wire-producer'} == {r['entry'] for r in review}
    assert pe.read(0x4678a0, 6) == bytes.fromhex('b801000000c3')
    assert pe.read(0x4a31b0, 3) == bytes.fromhex('33c0c3')
    main = next(b for b in bodies if b['entry'] == '0x5015a0')
    assert main['non_immediate_CALL_instructions'] == 15 and main['provider_unresolved_calls_as_recorded'] == 0
    matrix = load(OUT / 'capability-matrix.json')
    trace = matrix['legacy_traceability']
    registry = load(ROOT / trace['protocol_registry_source'])
    assert len(matrix['capabilities']) == 38 and len(registry['specs']) == 81
    assert len(trace['remaining_requirements_mapping']) == 37 and len(trace['consumer_groups_mapping']) == 10
    covered = sorted({c for a in assignments for c in a['capabilities']})
    scopes = dict(capability_domains=38, protocol_registry_entries=81, historical_remaining_requirements=37, consumer_groups=10,
                  counts_are_not_completion_percentages=True, no_requirements_removed=True)
    source = identity(pe.path)
    source_check = dict(schema='moli.capability.game-entry-review-source-check.v1', source=source,
        native_profile=PROFILE, tools=dict(REA='6.7.0-retained-evidence', Ghidra='12.1.4-retained-evidence', verifier='Python3/PE-section-mapping'),
        review_scope='Exactly the72 roots without historical capability candidates in the immutable647-root map',
        inputs=worker['inputs'], mechanical_inventory=identity(worker_path),
        summary=dict(roots=72, receivers=29, protocol_tag_bytes=4 * counts['protocol_tags'],
                     immediate_CALL_instructions=sum(b['immediate_CALL_instructions'] for b in bodies),
                     non_immediate_CALL_instructions=sum(b['non_immediate_CALL_instructions'] for b in bodies), **counts),
        bodies=bodies, semantic_anchors=anchors, reused_contexts=contexts,
        all_original_PE_range_and_protocol_tag_bytes_match=True,
        no_new_root_or_callee_decompilation=True, no_new_REA_target_opened=True,
        limitations=[
            'Reduced retained dossiers omit incoming_references and relationship_coverage; coverage remains unknown.',
            'The15 non-immediate CALL instructions in5015a0 are an instruction-shape count; the old provider unresolved_calls0 is a different metric.',
            'PE range digests bind retained body ranges to file bytes; matching text anchors do not independently recover callee semantics.',
            'Source summaries and chosen native dossiers retain different evidence roles; no live argument/session observation is performed.',
            'Inventory association checks reuse source-bound table selectors; this run does not reread every original window descriptor/control-table byte.',
            'The immutable old candidate labels remain a historical index; this separate overlay does not turn them into acceptance.'],
        original_execution=False, runtime_features_changed=False)
    contract = dict(schema='moli.capability.game-entry-review-contract.v1', source=source,
        source_check='analysis/capability-first-v1/game-entry-review-source-check.json',
        historical_map='analysis/capability-first-v1/business-entry-map.json',
        overlay_policy='Keep original map and its source-check hash intact; these72 bounded role assignments are a separate current review, not a rewrite of old candidate labels.',
        capabilities=covered, scope_preserved=scopes,
        facts=[
            dict(id='reuse-before-analysis', classification='fact', claim='All72 roots already had full retained canonical bodies; equivalent observations agree within each root across113 selected record selectors. Reuse verifies72 original PE ranges/12617 bytes and68 source tags without fresh decompilation.'),
            dict(id='mechanism-versus-feature', classification='fact', claim='39 send wrappers share one formatting/field-encoding/append/queue mechanism;29 receive wrappers have state/delegation effects. The other4 roots are two constant callbacks,a battle frame and the main dispatcher. These are not72 newly discovered product requirements.'),
            dict(id='positive-context-versus-unknown', classification='fact', claim=f'{counts["senders_with_corroborated_business_context"]} send roots have bounded corroborated business context;{counts["senders_business_context_pending"]} retain concrete caller/reference frontiers. Eight sender caller lists are empty without retained coverage;3 of those have other positive source-context evidence.'),
            dict(id='battle-reclassification', classification='fact', claim='4f36d0 is battle queue/control reception by actual branches and the reused battle-transition contract. A reference from character-options analysis does not make it a character-options function.'),
            dict(id='main-owner-and-host-effects', classification='fact', claim='5015a0 owns main dispatch and ordered reset/return calls, including cursor APIs and a timed desktop-focus/keybd_event sequence. The source virtual-key byte0x6a must not be renamed from the decompiler printable character or executed as a shared-core behavior.'),
            dict(id='ABI-and-side-effects', classification='fact', claim='Decompiler void/large-stack signatures in4ef580/4f2010 and a shortened call in4f3310 are not complete wire ABIs. Use the existing source-bound dispatch fields; wrapped helper internals and unreviewed callees remain explicit.'),
        ],
        entry_assignments=assignments,
        inferences=[dict(classification='inference', claim='Reusing one send mechanism, separating constant callbacks and binding old source contracts should reduce duplicate analysis and divergent implementations; no measured end-to-end schedule reduction follows from these counts.')],
        requirement_answers=[
            dict(question=1, status='answered-bounded-role-review', result='72 exact retained bodies, source bytes, occurrences and roles reviewed; concrete business gaps remain per entry.'),
            dict(question=2, status='partially-answered', result='Existing capability/registry/original scopes preserved; common mechanisms separated from bounded business context. Complete647-body semantics and discovery remain open.'),
            dict(question=3, status='answered-reuse-first', result='No duplicated root or callee decompilation. The specific missing consumers/callers are listed for demand-driven follow-up;97 alternate callbacks and dynamic entries are not declared unused.'),
            dict(question=4, status='answered-bounded-contract', result='Current overlay, dependencies and build/platform/official gate separation published; no runtime feature change.'),
        ],
        implementation_dependencies=[
            dict(id='shared-wire', capabilities=['G01', 'X06'], rule='Reuse one owned serial formatter/decoder pipeline and explicit versioned operation descriptors; do not implement39 parallel packet writers or let shared scratch buffers cross owners.'),
            dict(id='request-and-reply-owners', capabilities=['G01', 'G02', 'G03', 'X02'], rule='Preserve per-operation gates and shared native ack constraints, late replies, timeout/close/requery order; wrapper availability is not lifecycle completeness.'),
            dict(id='world-battle-work', capabilities=['G04', 'G05', 'G09', 'G14', 'G18', 'B01', 'B02', 'B04'], rule='Reuse existing source contracts and reconcile shared state writes before grouped implementation; retain unknown business contexts and branch conditions.'),
            dict(id='host-input-presentation', capabilities=['G07', 'X02', 'X04', 'X05'], rule='Specify portable cursor/focus/input/clock/render ports. Legacy desktop key injection has no automatically accepted browser/Page equivalent; user-facing behavior and host effects require a separate decision and runtime acceptance.'),
        ],
        remaining=[
            dict(id='unknown-business-edges', entries=[a['entry'] for a in assignments if a['role'] == 'wire-producer' and a['detail']['business_binding'] is None] + ['0x4eee60', '0x4f0210'], rule='Follow the exact caller/reference/state frontiers recorded per entry; no guessed wire fields or dead-code declarations.'),
            dict(id='actual-dispatch-and-lifetime', rule='Resolve97 nonnull alternate callback consumers/producers, graphicsObject+170 writers,40a090/4ea9b0 lifetimes and deferred/restore ownership; four reviewed nonprotocol roots do not close those chains.'),
            dict(id='complete-capability-specifications', rule='Review remaining admitted business conditions/versions/dynamic resources and required keyboard/IME/RNG/full reset behavior to implementation depth; preserve38/81/37/10 scope.'),
            dict(id='platform-and-official-acceptance', rule='Grouped shared implementation, product regressions, real web/mobile/WeChat execution, current-build normal handoff and appropriately authorized account/server acceptance remain separate and incomplete.'),
        ],
        original_execution=False, account_or_session_observed=False, runtime_features_changed=False,
        all_capability_analysis_complete=False, implementation_gate_passed=False,
        official_acceptance=False, full_goal_complete=False)
    assert counts['senders_without_retained_callers'] == 8
    dump('game-entry-review-source-check.json', source_check)
    dump('game-entry-review-contract.json', contract)
    print(json.dumps(source_check['summary'], ensure_ascii=False))


if __name__ == '__main__':
    build()
