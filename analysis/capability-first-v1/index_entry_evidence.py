"""Deduplicate observed function entries and locate reusable source evidence."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).parent
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
ADDRESS = re.compile(r'^0x[0-9a-fA-F]+$')


def read(path):
    return json.loads(Path(path).read_text())


def identity(path):
    p = Path(path)
    raw = p.read_bytes()
    return dict(path=str(p.relative_to(ROOT)), bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest())


def build():
    inventory = read(OUT / 'entry-inventory.json')
    matrix = read(OUT / 'capability-matrix.json')
    cap_sources = {}
    for c in matrix['capabilities']:
        for source in c['evidence']:
            cap_sources.setdefault(source, set()).add(c['id'])
    refs = {}
    used_sources = []
    selected = set(ROOT.joinpath('analysis').rglob('*source-check.json'))
    selected.update(ROOT.joinpath('analysis').rglob('source-verification.json'))
    function_keys = {'functions', 'reused_functions', 'canonical_functions', 'helpers',
                     'new_helpers', 'new_function_entries', 'new_functions', 'derived_functions'}

    def admit(value, path, caps, kind, evidence_id=None):
        if isinstance(value, str) and ADDRESS.match(value):
            address = hex(int(value, 16))
            if 0x400000 <= int(address, 16) < 0x52d000:
                row = dict(source=path, kind=kind, candidate_capabilities=sorted(caps))
                if evidence_id:
                    row['evidence_id'] = evidence_id
                if row not in refs.setdefault(address, []):
                    refs[address].append(row)

    def walk(value, path, caps, in_functions=False, container_key=None):
        if isinstance(value, dict):
            if in_functions:
                for key in ['entry', 'address', 'function']:
                    admit(value.get(key), path, caps, 'existing-function-or-helper-reference',
                          value.get('evidence_id', value.get('id')))
            for key, child in value.items():
                marked = in_functions or key in function_keys
                if marked:
                    admit(key, path, caps, 'existing-function-map-key')
                walk(child, path, caps, marked, key)
        elif isinstance(value, list):
            for child in value:
                if in_functions and container_key in function_keys:
                    admit(child, path, caps, 'existing-function-entry-list')
                walk(child, path, caps, in_functions, container_key)

    for path in sorted(selected):
        data = read(path)
        source = data.get('source', {})
        matches = ((isinstance(source, dict) and source.get('sha256') == SHA)
                   or data.get('source_sha256') == SHA)
        if not matches:
            continue
        relative = str(path.relative_to(ROOT))
        used_sources.append(identity(path))
        walk(data, relative, cap_sources.get(relative, set()))
    derived = ROOT / 'build/analysis/game-work-lifetime-v1/source-research-byte-check.json'
    for entry in read(derived)['derived_functions']:
        admit(entry['entry'], str(derived.relative_to(ROOT)), {'G18', 'X02'},
              'analyst-seeded-derived-byte-verified-reference')
    retained_path = ROOT / 'build/analysis/capability-entry-inventory-v1/retained-native-index.json'
    native_index = read(retained_path)['result']
    assert native_index['filters']['target_sha256'] == SHA
    for record in native_index['records']:
        dossier = record['native_dossier']
        assert record['retention'] == 'complete-record' and dossier['available']
        admit(dossier['procedure_address'], str(retained_path.relative_to(ROOT)), set(),
              'retained-native-function-dossier', record['evidence_id'])
    lookup_path = ROOT / 'build/analysis/capability-entry-inventory-v1/modern-lookup.json'
    admit('0x4ea7a0', str(lookup_path.relative_to(ROOT)), {'X02'},
          'new-native-lookup-pseudocode', read(lookup_path)['evidence_id'])
    jobs = {}
    exceptions = []

    def add(address, role, identifier):
        if not address or int(address, 16) == 0:
            return
        row = jobs.setdefault(address, dict(entry=address, occurrences=[]))
        occurrence = dict(role=role, owner=identifier)
        if occurrence not in row['occurrences']:
            row['occurrences'].append(occurrence)

    for window in inventory['classic_windows']:
        for kind, callback in window['callbacks'].items():
            add(callback, 'classic-' + kind, 'classic-window-' + str(window['id']))
        for control in window['controls']:
            owner = 'classic-window-' + str(window['id']) + '/control-' + str(control['ordinal'])
            if control['callback_is_file_backed_code']:
                add(control['callback'], 'classic-control', owner)
            else:
                exceptions.append(dict(owner=owner, source_address=control['address'],
                                       observed_value=control['callback'],
                                       status='non-code-field-runtime-use-unresolved'))
    for window in inventory['modern_windows']:
        if window['callback_present']:
            add(window['callback'], 'alternate-window', 'alternate-window-' + str(window['id']))
    for row in inventory['receive_entries']:
        add(row.get('consumer'), 'protocol-receive', row['id'])
    for row in inventory['send_entries']:
        add(row['producer'], 'protocol-send', row['id'])
    add('0x5015a0', 'main-dispatch', 'main-state-table')
    add('0x468190', 'classic-constructor', 'classic-window-table')
    add('0x4ea7a0', 'alternate-table-lookup', 'alternate-window-table')
    for entry, record in jobs.items():
        found = refs.get(entry, [])
        record['existing_source_references'] = found
        record['candidate_capabilities'] = sorted({cap for r in found for cap in r['candidate_capabilities']})
        record['full_semantics_verified'] = False
        record['next_action'] = ('reuse-and-review-existing-source-evidence' if found
                                 else 'locate-retained-evidence-or-analyze-entry')
    queue = sorted(jobs.values(), key=lambda x: (-len(x['occurrences']), int(x['entry'], 16)))
    result = dict(schema='moli.capability-entry-evidence-index.v1', source_sha256=SHA,
                  entry_inventory=identity(OUT / 'entry-inventory.json'),
                  scanned_same_source_checks=used_sources, source_reference_index_size=len(refs),
                  retained_native_records=native_index['matching_records'],
                  retained_native_index=identity(retained_path),
                  unique_function_entries=len(queue),
                  entries_with_existing_references=sum(bool(x['existing_source_references']) for x in queue),
                  entries_without_indexed_references=sum(not x['existing_source_references'] for x in queue),
                  callback_occurrences=sum(len(x['occurrences']) for x in queue),
                  noncode_control_occurrences=exceptions, entries=queue,
                  evidence_index_is_complete=False,
                  limitations=['A source reference locates reusable evidence; it does not prove full semantics.',
                               'An absent reference in selected public source checks does not prove REA evidence is absent elsewhere.',
                               'Candidate capability labels require semantic review; unknown entries remain unclassified.',
                               'Main-state targets are internal blocks and are not reclassified as function entries.',
                               'One default callback shared by many controls is one analysis question, not one per control.'],
                  all_capability_analysis_complete=False, runtime_features_changed=False)
    (OUT / 'entry-evidence-index.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({key: result[key] for key in ['source_reference_index_size', 'unique_function_entries',
                         'entries_with_existing_references', 'entries_without_indexed_references',
                         'callback_occurrences']}))


if __name__ == '__main__':
    build()
