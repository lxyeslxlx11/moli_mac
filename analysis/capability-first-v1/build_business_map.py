"""Reuse source-qualified bodies and index bounded static effects; no target execution."""
from collections import Counter, deque
import json
from pathlib import Path
import re

from extract_entry_inventory import PE, ROOT, SHA, digest, identity, load

OUT = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/capability-business-map-v1'
PROFILE = '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
CANONICAL = ['reused-canonical-functions.json', 'located-canonical-functions.json',
             'historical-canonical-functions.json', 'reused-domain-functions.json',
             'reused-4f48b0.json', 'reused-4f48d0.json']
DERIVED = ['build/analysis/capability-entry-inventory-v1/derived-entry-functions.json',
           'build/analysis/game-work-lifetime-v1/derived-skill-popup.json',
           'build/analysis/game-work-lifetime-v1/derived-modern-work.json',
           'build/analysis/game-work-lifetime-v1/derived-modern-helpers.json',
           'build/analysis/game-work-context-v1/derived-context-entry.json',
           'build/analysis/game-work-context-v1/derived-context-toggle.json',
           'build/analysis/game-craft-input-v1/derived-window-callbacks.json',
           'build/analysis/game-work-targets-v1/derived-work-window-callbacks.json']
DEFAULT_ADDRESS = re.compile(r'^0x[0-9a-f]+$')


def dump(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def evidence(path):
    x = load(path)
    return x.get('structuredContent', x)


def source_ranges(pe, spans):
    rows = []
    for span in spans:
        start, end = int(span['start'], 16), int(span['end'], 16)
        raw = pe.read(start, end - start + 1)
        rows.append(dict(start=hex(start), end=hex(end), bytes=len(raw),
                         file_offset=pe.file_offset(start, len(raw)), sha256=digest(raw)))
    return rows


def build():
    pe = PE(ROOT / 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe', SHA)
    index = load(OUT / 'entry-evidence-index.json')
    inventory = load(OUT / 'entry-inventory.json')
    roots = {e['entry']: e for e in index['entries']}
    assert len(roots) == 647
    file_identities = {}

    def file_id(path):
        path = Path(path)
        if path not in file_identities:
            file_identities[path] = identity(path)
        return file_identities[path]

    candidates = {}
    for name in CANONICAL:
        path = PRIVATE / name
        data = load(path)
        records = data['records'] if 'records' in data else [data]
        for e in records:
            n = e['normalized_result']
            address = n['procedure']['address']
            assert e['subject']['digest']['sha256'] == SHA
            assert e['analysis_profile']['digest'] == PROFILE
            assert e['operation'] == 'analyze_function'
            if address not in roots:
                continue
            assert n['pseudocode'] and n['procedure']['body']['available']
            assert n['procedure']['body']['contains_entry']
            values = candidates.setdefault(address, {})
            values[e['evidence_id']] = (e, file_id(path))
    derived = {}
    for name in DERIVED:
        path = ROOT / name
        data = load(path)
        assert data['originalExecution'] is False and data['originalBytePatches'] is False
        for item in data['entries']:
            address = hex(int(item['requestedEntry'], 16))
            if address in roots:
                derived[address] = (item, file_id(path))
    checks = {}
    records = []
    derived_instructions = 0
    derived_bytes = 0
    canonical_bytes = 0
    for address, root in sorted(roots.items(), key=lambda item: int(item[0], 16)):
        qualified_ids = set()
        for reference in root['existing_source_references']:
            path = ROOT / reference['source']
            if path.is_file() and reference['source'].startswith('analysis/'):
                if path not in checks:
                    checks[path] = path.read_text()
                qualified_ids.update(re.findall(r'ev_[0-9a-f]{64}', checks[path]))
        if address in candidates:
            options = candidates[address]
            # A public source-check binding wins over an arbitrary same-address dossier.
            selected = sorted(options, key=lambda eid: (eid in qualified_ids, eid))[-1]
            e, source = options[selected]
            n = e['normalized_result']
            spans = source_ranges(pe, n['procedure']['body']['ranges'])
            assert sum(span['bytes'] for span in spans) == n['procedure']['body']['total_bytes']
            canonical_bytes += sum(span['bytes'] for span in spans)
            row = dict(entry=address, authority='retained-canonical-REA-dossier',
                       evidence_id=selected, source=source, ranges=spans,
                       public_binding_matched=selected in qualified_ids,
                       alternate_dossier_observations=len(options),
                       resolved_call_targets=sorted({c['address'] for c in n['callees']}),
                       unresolved_call_sites=len(n['unresolved_calls']),
                       call_coverage='provider-resolved-targets-not-runtime-feasibility')
        elif address in derived:
            item, source = derived[address]
            assert item['status'] == 'derived-static-export' and item['decompileCompleted']
            assert item['pseudocode'] and not item['decompileError']
            covered = set()
            targets = set()
            unresolved = 0
            for instruction in item['instructions']:
                at = int(instruction['address'], 16)
                raw = bytes.fromhex(instruction['bytesHex'])
                assert raw == pe.read(at, len(raw)), hex(at)
                covered.update(range(at, at + len(raw)))
                if 'CALL' in instruction['flowType']:
                    if not instruction['flows']:
                        unresolved += 1
                    for target in instruction['flows']:
                        targets.add(target if ':' in target else hex(int(target, 16)))
            declared = {at for span in item['derivedBody']
                        for at in range(int(span['start'], 16), int(span['end'], 16) + 1)}
            assert covered == declared
            derived_instructions += len(item['instructions'])
            derived_bytes += len(covered)
            row = dict(entry=address, authority='reused-analyst-seeded-derived-static',
                       source=source, selector=item['requestedEntry'],
                       ranges=source_ranges(pe, item['derivedBody']),
                       all_source_instruction_bytes_match=True,
                       instructions=len(item['instructions']),
                       resolved_call_targets=sorted(targets), unresolved_call_sites=unresolved,
                       call_coverage='decoded-instruction-targets-not-runtime-feasibility')
        else:
            assert address == '0x4ea7a0', ('Unlocated function body', address)
            pseudo = evidence(ROOT / 'build/analysis/capability-entry-inventory-v1/modern-lookup.json')
            assert pseudo['subject']['digest']['sha256'] == SHA
            n = evidence(PRIVATE / 'function-4e94d0.json')['normalized_result']
            callee = next(c for c in n['callees'] if c['address'] == address)
            row = dict(entry=address, authority='composed-retained-pseudocode-caller-body-and-byte-read',
                       evidence_id=pseudo['evidence_id'],
                       source=file_id(ROOT / 'build/analysis/capability-entry-inventory-v1/modern-lookup.json'),
                       range_parent=evidence(PRIVATE / 'function-4e94d0.json')['evidence_id'],
                       ranges=source_ranges(pe, callee['body']['ranges']),
                       resolved_call_targets=[], unresolved_call_sites=0,
                       call_coverage='retained-pseudocode-no-call-and-source-bound-31-byte-body')
        row.update(occurrence_count=len(root['occurrences']),
                   roles=sorted({o['role'] for o in root['occurrences']}),
                   occurrence_index='entry-evidence-index.json#' + address,
                   capability_candidates=root['candidate_capabilities'],
                   candidate_labels_are_semantic_acceptance=False,
                   full_semantics_verified=False)
        row['structural_capability_roles'] = []
        if any(o['role'].startswith('protocol-') for o in root['occurrences']):
            row['structural_capability_roles'].append(dict(
                capability='G01', kind='fact', scope='catalogued receive/formatter role only',
                business_conditions_closed=False))
        if address == '0x4a31b0':
            assert pe.read(int(address, 16), 3) in (b'\x33\xc0\xc3', b'\x31\xc0\xc3')
            row['structural_capability_roles'].append(dict(
                capability='X02', kind='fact', scope='shared default zero-return callback',
                proof='entry-findings.json#shared-default', business_conditions_closed=False))
        records.append(row)
    assert len(records) == 647
    by_entry = {r['entry']: r for r in records}
    # Preserve static reachability as a bounded graph fact, never a claim that a request ran.
    senders = {r['producer']: r for r in inventory['send_entries']}
    for row in records:
        queue = deque([(row['entry'], [row['entry']])])
        seen = set()
        paths = {}
        while queue:
            entry, chain = queue.popleft()
            if entry in seen:
                continue
            seen.add(entry)
            if entry in senders:
                paths[entry] = dict(sender=entry, sender_id=senders[entry]['id'],
                                    tag=senders[entry]['tag'], path=chain)
            if entry in by_entry:
                for target in by_entry[entry]['resolved_call_targets']:
                    if target in by_entry and target not in seen:
                        queue.append((target, chain + [target]))
        row['possible_sender_paths_in_selected_graph'] = list(paths.values())
    classic = []
    for window in inventory['classic_windows']:
        entries = sorted({a for a in window['callbacks'].values() if a != '0x0'} |
                         {c['callback'] for c in window['controls'] if c['callback_is_file_backed_code']})
        classic.append(dict(id=window['id'], descriptor=window['descriptor_address'],
                            group=window['group_flag'], function_entries=entries,
                            source_role_names_are_historical=True,
                            callback_role_contract='window-engine-contract.json',
                            possible_sender_entries=sorted({path['sender'] for a in entries
                                for path in by_entry[a]['possible_sender_paths_in_selected_graph']}),
                            business_specification_closed=False))
    alternate = [dict(id=w['id'], callback=w['callback'], group=w['group'],
                      callback_present=w['callback_present'],
                      callback_execution_dispatch_closed=False,
                      business_specification_closed=False) for w in inventory['modern_windows']]
    summary = dict(root_entries=647, bodies_located=647,
                   authority_counts=dict(Counter(row['authority'] for row in records)),
                   roots_with_capability_candidates=sum(bool(r['capability_candidates']) for r in records),
                   roots_without_capability_candidates=sum(not r['capability_candidates'] for r in records),
                   roots_with_selected_graph_sender_paths=sum(bool(r['possible_sender_paths_in_selected_graph']) for r in records),
                   resolved_call_edges=sum(len(r['resolved_call_targets']) for r in records),
                   unresolved_call_sites=sum(r['unresolved_call_sites'] for r in records),
                   reused_derived_instructions_verified=derived_instructions,
                   reused_derived_bytes_verified=derived_bytes,
                   retained_canonical_source_range_bytes_hashed=canonical_bytes,
                   full_semantic_closures=0, new_root_decompilations=0)
    result = dict(schema='moli.capability-business-entry-map.v1', source_sha256=SHA,
                  entry_inventory=file_id(OUT / 'entry-inventory.json'),
                  entry_index=file_id(OUT / 'entry-evidence-index.json'),
                  summary=summary, entries=records,
                  classic_window_ownership=classic, alternate_window_ownership=alternate,
                  additional_dynamic_registration=dict(entry='0x4a8e20',
                      proof='window-engine-source-check.json', included_in_647=False),
                  selected_graph_scope='647 bounded table/protocol roots; stop at unindexed callees',
                  path_conditions_reviewed=False, all_capability_analysis_complete=False,
                  implementation_gate_passed=False, runtime_features_changed=False,
                  limitations=['Body availability and graph paths are not business semantic closure.',
                               'Provider metadata and analyst-seeded boundaries retain distinct authority.',
                               'No direct or indirect-call completeness outside the selected graph is asserted.',
                               'A possible sender path does not prove reachability, arguments, timing or server acceptance.',
                               'Candidate capabilities require source-semantic review; unknown labels remain explicit.'])
    dump('business-entry-map.json', result)
    body_reads = []
    for item in load(PRIVATE / 'alternate-functions-manifest.json'):
        ranges = source_ranges(pe, item['body']['ranges'])
        for index, span in enumerate(ranges):
            read = evidence(PRIVATE / f"bytes-{item['entry'][2:]}-{index}.json")
            n = read['normalized_result']
            assert read['subject']['digest']['sha256'] == SHA
            assert n['complete'] and n['returned_bytes'] == span['bytes']
            assert bytes.fromhex(n['bytes_hex']) == pe.read(int(span['start'], 16), span['bytes'])
            span['read_evidence_id'] = read['evidence_id']
        body_reads.append(dict(entry=item['entry'], evidence_id=item['evidence_id'],
                               source=item['source'], ranges=ranges))
    dump('business-map-source-check.json', dict(
         schema='moli.capability-business-map-source-check.v1', source=identity(pe.path),
         tools=dict(REA='6.7.0', Ghidra='12.1.4', profile=PROFILE),
         body_registry=file_id(OUT / 'business-entry-map.json'), summary=summary,
         reused_function_artifacts=list(file_identities.values()),
         alternate_functions=body_reads, alternate_function_bodies=16,
         alternate_body_bytes_verified=sum(r['bytes'] for f in body_reads for r in f['ranges']),
         new_canonical_helper_functions=7, new_root_decompilations=0,
         source_unchanged=True, original_execution=False, runtime_features_changed=False,
         all_capability_analysis_complete=False, implementation_gate_passed=False))
    print(json.dumps(summary))


if __name__ == '__main__':
    build()
