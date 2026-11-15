#!/usr/bin/env python3
"""Bind treatment and skill service Page ports to fixed PE and REA evidence."""
from hashlib import sha256
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/game-wechat-map-services-v1'
PRIOR = ROOT / 'analysis/game-battle-shared-storage-v1'


def read(path):
    return json.loads(path.read_text())


def identity(path):
    data = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(data), sha256=sha256(data).hexdigest())


prior = [PRIOR / f'{name}-source-check.json' for name in (
    'map-dialog-services', 'npc-services', 'pet-training',
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
assert len(records) == meta['export']['records'] == 41
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
assert len(functions) == 19 and len(windows) == 22

dispatch = [
    (0x10, 0x48ff46, 0x48ff47, 0x492d50),
    (0x11, 0x48ff55, 0x48ff56, 0x4af7d0),
    (0x12, 0x48ff64, 0x48ff65, 0x4af910),
    (0x13, 0x48ffa0, 0x48ffb7, 0x490db0),
    (0x18, 0x490040, 0x490041, 0x4afaa0),
    (0x19, 0x49004f, 0x490050, 0x4b0020),
    (0x1a, 0x490173, 0x490174, 0x4b0490),
    (0x2a, 0x490155, 0x490156, 0x4afd60),
    (0x2b, 0x490164, 0x490165, 0x4b0200),
    (0x2c, 0x490173, 0x490174, 0x4b0490),
]
cases = region(0x49026c, 45)[1]
for mode, entry, site, destination in dispatch:
    assert struct.unpack('<I', region(0x4901f8 + 4 * cases[mode], 4)[1])[0] == entry
    assert entry <= site and hex(destination) in functions

calls = [(site, destination) for _, _, site, destination in dispatch]
calls += [
    (0x4f447f, 0x48fce0), (0x4910e7, 0x48f0a0), (0x4f04ed, 0x4fdea0),
    (0x490683, 0x4f8240), (0x490725, 0x4f8240), (0x4b1f11, 0x4f8240),
    (0x4b2044, 0x4f8240), (0x4b20b3, 0x4f8240), (0x4b2c9c, 0x4f8240),
    (0x4b2e3f, 0x4f8240), (0x4b3120, 0x4f8240), (0x4b32fe, 0x4f8240),
    (0x4b2103, 0x4f8240),
]
for site, destination in dict(calls).items():
    opcode, delta = struct.unpack('<Bi', region(site, 5)[1])
    assert opcode == 0xe8 and site + delta + 5 == destination, hex(site)

constants = [
    (0x4f8245, bytes.fromhex('68cc7b5600')),
    (0x567bcc, b'/1I\0'),
    (0x53632c, b'1\0'),
    (0x564e70, b'2\0'),
    (0x4b205d, bytes.fromhex('6a63')),
    (0x4906c6, bytes.fromhex('408d5424085068ac315300')),
    (0x4b178b, struct.pack('<I', 0x4b2f60)),
    (0x4b17b9, struct.pack('<I', 0x4b2f60)),
]
for address, raw in constants:
    assert region(address, len(raw))[1] == raw, hex(address)
pet_flags = region(0x4b21e0, 14)[1]
assert [pet_flags[i] for i in (2, 3, 4, 12, 13)] == [2, 3, 3, 2, 3]

receipt = dict(
    source=source, tools=dict(rea='6.7.0', ghidra='12.1.4', profile=profile),
    retained_records=len(records), functions=functions, windows=windows,
    dispatch=[dict(mode=hex(m), case_entry=hex(e), call=hex(s), parser=hex(d)) for m, e, s, d in dispatch],
    calls=[[hex(a), hex(b)] for a, b in dict(calls).items()],
    constants={hex(a): raw.hex() for a, raw in constants},
    pet_flags=dict(address='0x4b21e0', bytes=pet_flags.hex()),
    prior_source_checks=[identity(path) for path in prior],
    REA_bundle=identity(bundle), closure=identity(closure), original_execution=0, official_sessions=0,
)
out = HERE / 'source-check.json'
if out.exists():
    assert read(out) == receipt
else:
    with out.open('x') as f:
        f.write(json.dumps(receipt, indent=2) + '\n')
print(f'{len(records)} records, {len(functions)} functions, {len(windows)} PE windows, {len(dict(calls))} direct calls')
