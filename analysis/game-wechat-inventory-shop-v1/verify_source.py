#!/usr/bin/env python3
"""Bind the inventory and shop Page ports to fixed PE and REA evidence."""
from hashlib import sha256
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/game-wechat-inventory-shop-v1'
PRIOR = ROOT / 'analysis/game-battle-shared-storage-v1'


def read(path):
    return json.loads(path.read_text())


def identity(path):
    data = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(data), sha256=sha256(data).hexdigest())


prior = [PRIOR / f'{name}-source-check.json' for name in (
    'ordinary-items', 'ground-pickup', 'map-shop', 'shop-service', 'shop-exchange',
    'shop-conversion', 'npc-services',
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
assert len(records) == meta['export']['records'] == 35
assert bundle.stat().st_size == meta['export']['bytes']
profile = read(prior[0])['analysis_profile']
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
assert len(functions) == 21 and len(windows) == 14

calls = [
    (0x4f447f, 0x48fce0), (0x48ff74, 0x492b90), (0x48ff83, 0x4a8fd0),
    (0x48ff92, 0x4a92a0), (0x48ffc6, 0x4a9c80), (0x48ffd5, 0x4aa0b0),
    (0x49005f, 0x492ea0), (0x49006e, 0x4a96b0), (0x49008c, 0x4a99b0),
    (0x4ac0fd, 0x4f8240), (0x47b80b, 0x4f6c70), (0x50099b, 0x4f6a30),
]
for site, destination in calls:
    opcode, delta = struct.unpack('<Bi', region(site, 5)[1])
    assert opcode == 0xe8 and site + delta + 5 == destination, hex(site)
literals = [
    (0x4f68b5, 0x567af8, '$fa'), (0x4f6c75, 0x567b10, "'#Q"),
    (0x4f7ae5, 0x567b84, '6=L'), (0x4f6ac5, 0x567b04, '&E1'),
    (0x4f6a35, 0x567b00, '&?S'), (0x4f8245, 0x567bcc, '/1I'),
]
for instruction, address, literal in literals:
    assert hex(address) in windows and region(address, 4)[1] == literal.encode('ascii') + b'\0'
    assert region(instruction, 5)[1] == b'\x68' + struct.pack('<I', address)
receipt = dict(
    source=source, tools=dict(rea='6.7.0', ghidra='12.1.4', profile=profile),
    retained_records=len(records), functions=functions, windows=windows,
    calls=[[hex(a), hex(b)] for a, b in calls],
    outgoing_literals=[dict(instruction=hex(a), address=hex(b), tag=tag) for a, b, tag in literals],
    prior_source_checks=[identity(path) for path in prior],
    REA_bundle=identity(bundle), closure=identity(closure), original_execution=0, official_sessions=0,
)
out = HERE / 'source-check.json'
if out.exists():
    assert read(out) == receipt
else:
    with out.open('x') as f:
        f.write(json.dumps(receipt, indent=2) + '\n')
print(f'{len(records)} records, {len(functions)} functions, {len(windows)} PE windows, {len(calls)} direct calls')
