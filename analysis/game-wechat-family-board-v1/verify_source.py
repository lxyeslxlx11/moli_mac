#!/usr/bin/env python3
"""Bind family and board Page ports to fixed PE and REA evidence."""
from hashlib import sha256
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/game-wechat-family-board-v1'
PRIOR = ROOT / 'analysis/game-battle-shared-storage-v1'


def read(path):
    return json.loads(path.read_text())


def identity(path):
    data = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(data), sha256=sha256(data).hexdigest())


prior = [PRIOR / f'{name}-source-check.json' for name in (
    'family-management', 'family-members', 'family-pet', 'message-board',
)]
source = read(prior[0])['source']
assert all(read(path)['source'] == source for path in prior)
target = ROOT / source['path']
assert identity(target) == source
image = target.read_bytes()
pe = struct.unpack_from('<I', image, 60)[0]
base = struct.unpack_from('<I', image, pe + 52)[0]
table = pe + 24 + struct.unpack_from('<H', image, pe + 20)[0]
sections = [struct.unpack_from('<4I', image, table + i * 40 + 8)
            for i in range(struct.unpack_from('<H', image, pe + 6)[0])]


def region(address, size):
    for _, start, length, offset in sections:
        relative = address - base - start
        if 0 <= relative <= length - size:
            offset += relative
            return offset, image[offset:offset + size]
    raise AssertionError((hex(address), size))


bundle = PRIVATE / 'rea-evidence-bundle.json'
closure = PRIVATE / 'rea-closure.json'
meta = read(closure)
assert meta['package'] == '6.7.0' and not meta['open'] and not meta['cleanup_pending']
records = read(bundle)['records']
assert len(records) == meta['export']['records'] == 91
assert bundle.stat().st_size == meta['export']['bytes']
profile = read(prior[0])['analysis_profile']
assert all(read(path)['analysis_profile'] == profile for path in prior)
functions, windows = {}, {}
for entry in records:
    assert entry['subject']['digest']['sha256'] == source['sha256']
    assert entry['analysis_profile']['digest'] == profile
    assert entry['analysis_profile']['provider']['version'] == '12.1.4'
    result = entry['normalized_result']
    evidence = entry['evidence_id']
    if entry['operation'] == 'read_bytes':
        address, size = result['address'], result['requested_bytes']
        assert result['complete'] and result['returned_bytes'] == size
        offset, raw = region(int(address, 16), size)
        assert raw == bytes.fromhex(result['bytes_hex'])
        windows[address] = dict(evidence=evidence, bytes=size, offset=offset, sha256=sha256(raw).hexdigest())
    else:
        assert entry['operation'] == 'analyze_function'
        procedure = result['procedure']
        assert procedure['body']['contains_entry']
        ranges = []
        for span in procedure['body']['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            offset, raw = region(start, end - start + 1)
            ranges.append(dict(**span, bytes=len(raw), offset=offset, sha256=sha256(raw).hexdigest()))
        assert sum(span['bytes'] for span in ranges) == procedure['body']['total_bytes']
        functions[procedure['address']] = dict(evidence=evidence, ranges=ranges)
assert len(functions) == 27 and len(windows) == 64

def word(address):
    return struct.unpack('<I', region(address, 4)[1])[0]


cases = region(0x49026c, 45)[1]
dispatch = []
calls = [(0x4f447f, 0x48fce0)]
for mode, case, site, target, refresh in (
    (0x15, 0x48ffe3, 0x48ffe5, 0x4a8b40, 0x48fe71),
    (0x20, 0x4900a9, 0x4900ac, 0x49f380, 0x48fe92),
):
    assert word(0x4901f8 + 4 * cases[mode]) == case
    calls.append((site, target))
    calls.append((refresh, target if mode == 0x15 else 0x49f670))
    dispatch.append(dict(mode=hex(mode), case=hex(case), call=hex(site), parser=hex(target), refresh_call=hex(refresh)))
descriptors = [
    (0x15, 0x52e508, 0x493080, 0x4678a0),
    (0x30, 0x52e718, 0x4a0d90, 0x4678a0),
    (0x32, 0x52e7a8, 0x4a7ca0, 0x4a7d30),
    (0x33, 0x52e6e8, None, 0x49f980),
]
for mode, descriptor, initialize, destroy in descriptors:
    assert word(0x5599f8 + 4 * mode) == descriptor and word(descriptor + 44) == destroy
    if initialize is not None:
        assert word(descriptor + 36) == initialize

catalog_path = ROOT / 'analysis/game-legacy-message-v1/dispatch-catalog.json'
catalog = read(catalog_path)
family = read(prior[0])
incoming = family['incoming']
for tag, row in incoming.items():
    entry = next(value for value in catalog['incoming'] if value['consumer'] == row['consumer'])
    address = int(entry['tag_address'], 16)
    assert (entry['tag'], entry['fields']) == (tag, row['fields'])
    assert region(address, 4)[1] == tag.encode('ascii') + b'\0'
    calls.append((int(row['call'], 16), int(row['consumer'], 16)))
outgoing = [
    ('7nu', 0x4f6fd0, 0x567b2c, ['int32', 'bytes'], [0x4a1e7d, 0x4a1f6d]),
    ('80i', 0x4f7040, 0x567b30, ['int32', 'int32', 'bytes'], [0x4a208b]),
    ('8MV', 0x4f70d0, 0x567b34, ['int32', 'int32'], [0x496ab7]),
    ('8^J', 0x4f7140, 0x567b38, ['int32', 'int32'], [0x4674a2]),
    ('8u6', 0x4f71b0, 0x567b3c, ['int32'], [0x495d4a]),
]
for tag, producer, literal, _, callers in outgoing:
    assert region(literal, 4)[1] == tag.encode('ascii') + b'\0'
    assert region(producer + 5, 5)[1] == b'\x68' + struct.pack('<I', literal)
    calls.extend((call, producer) for call in callers)
calls += [
    (0x49530c, 0x46c6b0), (0x4a0db2, 0x4a1c10), (0x4a0db7, 0x4a1430),
    (0x4a1e67, 0x511180), (0x4a1f57, 0x511180), (0x4a206f, 0x511180),
    (0x467418, 0x43f100), (0x4f4c7f, 0x510e50),
    (0x49f3b0, 0x510d80), (0x49f3ce, 0x5111a0), (0x49f415, 0x5111a0), (0x49f659, 0x46c6b0),
    (0x4a034e, 0x51b2f7), (0x4a0365, 0x511060), (0x4a03a1, 0x4f8240),
    (0x4a0485, 0x51b2f7), (0x4a04be, 0x4f8240), (0x49f980, 0x49f290), (0x49f9e5, 0x4f8240),
    (0x4a8b5e, 0x511000), (0x4a8bf4, 0x5111a0), (0x4a8c67, 0x5111a0),
    (0x4a8050, 0x4f8240), (0x4a811d, 0x511180), (0x4a8156, 0x4f8240),
    (0x4a82b9, 0x4f8240), (0x4a8391, 0x4f8240),
]
for site, destination in calls:
    opcode, delta = struct.unpack('<Bi', region(site, 5)[1])
    assert opcode == 0xe8 and site + delta + 5 == destination, hex(site)
assert region(0x4f552d, 5)[1] == b'\xe9' + struct.pack('<i', 0x516c40 - 0x4f5532)

constants = {
    0x4a1e7a: '6a02', 0x4a1f6a: '6a03', 0x4a20a4: '83c5304381fd00060000', 0x4a2128: 'a880',
    0x4f5176: '83c17c4281f9b017fc00', 0x4673fe: '6a08', 0x467464: 'f680c4b0fb0001',
    0x46747b: '81c1f4010000', 0x493aaf: '6880000000', 0x493adc: 'a168b0fb003bc87512',
    0x4f4c74: 'a901010000', 0x4f4c87: 'a364b0fb00', 0x49fb65: 'f6c180',
    0x4a0699: 'f60564b0fb0004', 0x4a06b1: '833c95143df50035',
    0x4a0348: '68b0455600', 0x4a047f: '68cc455600', 0x49f9bf: '6894455300',
    0x4a8ab5: 'f605605dc40020', 0x4a8ade: 'f605605dc40010',
    0x4a7ea1: '6a00e94b010000', 0x4a7f12: '6a01e9da000000',
    0x4a7f83: '6a02eb6c', 0x4a7ff1: '6a038d94241001000068ac315300',
    0x4a802e: '526a405051', 0x4a8135: '506a015152', 0x4a8293: 'c644240c00506a205152',
    0x4a836b: 'c644240c00506a105152', 0x4a8df5: 'c705d4e45500ffffffff',
    0x4f8245: '68cc7b5600',
}
for address, expected in constants.items():
    raw = bytes.fromhex(expected)
    assert region(address, len(raw))[1] == raw, hex(address)
literals = {
    0x5645b0: b'N|%s', 0x5645cc: b'I|%d', 0x534594: b'C',
    0x5331ac: b'%d', 0x567bcc: b'/1I', 0x567c74: b'Q?m',
}
for address, tag in literals.items():
    assert region(address, len(tag) + 1)[1] == tag + b'\0'
assert struct.unpack('<2I', region(0x55c584, 8)[1]) == (1, 16)
assert struct.unpack('<4I', region(0x55dd8c, 16)[1]) == (2, 70, 16, 0)

receipt = dict(
    source=source, tools=dict(rea='6.7.0', ghidra='12.1.4', profile=profile),
    retained_records=len(records), functions=functions, windows=windows, dialog_dispatch=dispatch,
    descriptors=[dict(mode=hex(m), pointer=hex(p), init=hex(i) if i is not None else None, destroy=hex(d))
                 for m,p,i,d in descriptors],
    family_incoming=incoming, family_outgoing=[
        dict(tag=t, producer=hex(p), literal=hex(l), fields=f, callers=[hex(s) for s in cs])
        for t,p,l,f,cs in outgoing],
    calls=[[hex(a), hex(b)] for a,b in calls],
    constants={hex(address): raw for address,raw in constants.items()},
    literals={hex(address): tag.decode('ascii') for address,tag in literals.items()},
    dispatch_catalog=identity(catalog_path), prior_source_checks=[identity(path) for path in prior],
    REA_bundle=identity(bundle), closure=identity(closure), VM_actions=0, original_execution=0, official_sessions=0,
)
out = HERE / 'source-check.json'
if out.exists():
    assert read(out) == receipt
else:
    with out.open('x') as f:
        f.write(json.dumps(receipt, indent=2) + '\n')
print(f'{len(records)} records, {len(functions)} functions, {len(windows)} PE windows, {len(calls)} direct calls')
