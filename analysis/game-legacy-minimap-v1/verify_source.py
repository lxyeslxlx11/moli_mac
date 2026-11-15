"""Bind minimap dossiers,body bytes and constants to the exact source PE; no target execution."""
from pathlib import Path
from hashlib import sha256
import json
import struct

A = Path('analysis/game-legacy-minimap-v1')
P = Path('build/analysis/game-legacy-minimap-v1')
source = Path('build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe')
raw = source.read_bytes()
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
assert sha256(raw).hexdigest() == SHA
pe = struct.unpack_from('<I', raw, 60)[0]
count = struct.unpack_from('<H', raw, pe + 6)[0]
optional = pe + 24
header_size = struct.unpack_from('<H', raw, pe + 20)[0]
base = struct.unpack_from('<I', raw, optional + 28)[0]
sections = [struct.unpack_from('<IIII', raw, optional + header_size + i * 40 + 8) for i in range(count)]


def offset(address, size):
    rva = int(address, 16) - base
    for virtual, start, length, at in sections:
        if start <= rva and rva + size <= start + length:
            return at + rva - start
    raise AssertionError(address)


def identity(path):
    path = Path(path)
    h = sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return dict(path=str(path), bytes=path.stat().st_size, sha256=h.hexdigest())


bundle = json.loads((P / 'rea-evidence.json').read_text())
entries = ['0x463780','0x4636a0','0x45f4e0','0x448e40','0x449730','0x464f20','0x448bb0','0x4494a0','0x464bc0','0x452fe0','0x452f40','0x452ee0','0x4649b0','0x452960','0x452bc0','0x463ea0','0x44b610','0x44a300','0x45f2a0','0x44b720','0x452460']
records = bundle['records']
functions = {}
reads = {}
for e in records:
    n = e['normalized_result']
    if e['operation'] == 'analyze_function' and n['procedure']['address'] in entries:
        functions[n['procedure']['address']] = e
    if e['operation'] == 'read_bytes':
        reads[(n['address'], n['requested_bytes'])] = e
assert set(functions) == set(entries)
checked = []
for entry in entries:
    e = functions[entry]
    assert e['subject']['digest']['sha256'] == SHA
    assert e['provider']['id'] == 'ghidra' and e['provider']['version'] == '12.1.4'
    assert e['analysis_profile']['digest'] == '7810ea9437da59780820ec6fedb47ce47390841a95d527ddb6c3b3700fe180cb'
    body = e['normalized_result']['procedure']['body']
    assert body['available'] and body['contains_entry'] and not body['non_contiguous']
    for region in body['ranges']:
        size = int(region['end'], 16) - int(region['start'], 16) + 1
        r = reads[(region['start'], size)]
        n = r['normalized_result']
        data = bytes.fromhex(n['bytes_hex'])
        at = offset(region['start'], size)
        assert n['complete'] and len(data) == n['returned_bytes'] == size and raw[at:at + size] == data
        checked.append(dict(entry=entry, dossier=e['evidence_id'], byte_evidence=r['evidence_id'], bytes=size,
                            offset=at, sha256=sha256(data).hexdigest(),
                            value_flow_truncated=e['normalized_result'].get('native_value_flow', {}).get('truncated')))
table = reads[('0x53d57c', 80)]['normalized_result']
data = bytes.fromhex(table['bytes_hex'])
assert raw[offset('0x53d57c', 80):offset('0x53d57c', 80) + 80] == data
assert struct.unpack_from('<6I', data, 16) == (107,107,54,54,27,27)
closure = json.loads((P / 'rea-closure.json').read_text())
assert closure['open'] is False and closure['cleanup_pending'] is False
manifest_path = Path('build/analysis/game-legacy-resource-archive-v1/full-material-pack.json')
manifest = json.loads(manifest_path.read_text())
cuts = {Path(r['path']).stem:r for r in manifest['entries'] if r['path'].lower().endswith('.cut')}
autos = {Path(r['path']).stem:r for r in manifest['entries'] if r['path'].lower().endswith('.aut')}
assert len(cuts) == 341 and len(autos) == 337 and '23' not in cuts and '59500' in cuts and '59500' in autos
result = dict(stage=291, source=identity(source), provider=dict(rea='6.7.0', ghidra='12.1.4'),
    evidence=identity(P / 'rea-evidence.json'), snapshot=identity(P / 'rea-snapshot.json'),
    retained_records=len(records), functions=checked, function_bytes=sum(r['bytes'] for r in checked),
    dimension_table=dict(address='0x53d58c', sizes=[107,54,27], matched=True),
    ABI_correction=dict(entry='0x463780', allocation_bytes=0x11294, native_arguments=['cache identityB','centerX','centerY'],
                        dimensions_source='map-cache header offsets12/16;not a function width argument',
                        basis=['0x4637ac','0x463846','0x46384d','0x463821','0x463830']),
    actual_material=dict(manifest=identity(manifest_path), CUT_files=341, AUT_files=337,
                         CUT_without_AUT=sorted(set(cuts) - set(autos)), authored23_missing=True,
                         selected_pair=[cuts['59500'],autos['59500']]),
    facts=['AUT is raw RGB without a file header;native reads at most477603 bytes and indexes using the active map width.',
           'The ordinary colour source scans final image slots in index order;runtime group identifies eligibility,not GraphicInfo field32.',
           'Representative colour averages nonzero pixel-index RGB against original palette;nearest candidates are0 and16..239,strictly closer only.',
           'Loaded flag0x4000 gates ground/AUT data.Object colour spreads right/up only for collisionClass0,otherwise one cell.',
           '32-bit painter makes4-pixel diamonds,changes black0 to000001 and draws a separate-mode blinking player stencil.',
           'Existing archive already has341 CUT and337 AUT files;the23 test selector is not a distribution-wide CUT deficit.'],
    independent_choices=['Lazy bounded colour/AUT loading and top-right show/range UI;full native init dialogs/scheduler/window placement are not claimed.',
                         'Reject colour access beyond provided AUT bytes rather than copying stale unread native global memory.'],
    remaining=['Native16/24-bit paths and complete application scheduling/context/UI.',
               'Unobserved consumers,current/full material-version and actual platform/official acceptance.'],
    REA_closed=True, original_execution=0, VM_actions=0, official_sessions=0, full_goal_complete=False)
(A / 'source-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(dict(stage=291, functions=len(checked), bytes=result['function_bytes'], CUT_files=341, AUT_files=337, REA_closed=True)))
