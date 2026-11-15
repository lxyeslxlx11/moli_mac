#!/usr/bin/env python3
"""Bind storage and trade Page ports to fixed PE and REA evidence."""
from hashlib import sha256
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/game-wechat-storage-trade-v1'
PRIOR = ROOT / 'analysis/game-battle-shared-storage-v1'


def read(path):
    return json.loads(path.read_text())


def identity(path):
    data = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(data), sha256=sha256(data).hexdigest())


prior = [PRIOR / f'{name}-source-check.json' for name in (
    'bank-storage', 'player-trade',
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
assert len(records) == meta['export']['records'] == 83
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
assert len(functions) == 30 and len(windows) == 53

def word(address):
    return struct.unpack('<I', region(address, 4)[1])[0]


dispatch = [
    (0x17, 0x490000, 0x490001),
    (0x21, 0x4900ba, 0x4900bb),
    (0x22, 0x4900e5, 0x4900e6),
]
cases = region(0x49026c, 45)[1]
for mode, entry, _ in dispatch:
    assert word(0x4901f8 + 4 * cases[mode]) == entry
bank_cases = {'A': 0x49b0ac, 'G': 0x49b08d, 'I': 0x49ab44, 'P': 0x49ad1c}
for operation, entry in bank_cases.items():
    index = region(0x49b5cc + ord(operation) - 65, 1)[1][0]
    assert word(0x49b5b8 + index * 4) == entry
assert word(0x559a9c) == 0x52e688 and word(0x52e6b4) == 0x49aa00

calls = [(site, 0x49aad0) for _, _, site in dispatch] + [
    (0x49001e, 0x49dfb0), (0x490105, 0x49f080), (0x49dfe8, 0x49a9d0), (0x49f0bd, 0x49e180),
    (0x4f4456, 0x468f00), (0x468f41, 0x467fc0), (0x49aa7a, 0x4f8240), (0x47b8ea, 0x4f8240),
    (0x49c1c4, 0x47b900), (0x49c3b8, 0x47b900), (0x49c882, 0x47b900),
    (0x49d417, 0x47f330), (0x49d96b, 0x47f330), (0x47f3e3, 0x4f8240), (0x49de5c, 0x4f8240),
    (0x49b217, 0x4c6b60), (0x49b59a, 0x510e50),
]
catalog_path = ROOT / 'analysis/game-legacy-message-v1/dispatch-catalog.json'
catalog = read(catalog_path)
old_trade = read(prior[1])
incoming = old_trade['incoming']
outgoing = old_trade['outgoing']
for row in incoming:
    entry = next(value for value in catalog['incoming'] if value['consumer'] == row['consumer'])
    assert (entry['tag'], entry['fields']) == (row['tag'], row['fields'])
    address = int(entry['tag_address'], 16)
    assert region(address, 4)[1] == row['tag'].encode('ascii') + b'\0'
    calls.append((int(row['call'], 16), int(row['consumer'], 16)))
for index, row in enumerate(outgoing):
    producer = int(row['producer'], 16)
    literal = 0x567b94 + 4 * index
    assert region(literal, 4)[1] == row['tag'].encode('ascii') + b'\0'
    assert region(producer + 5, 5)[1] == b'\x68' + struct.pack('<I', literal)
    if producer != 0x4f7dc0:
        entry = next(value for value in catalog['outgoing'] if value['producer'] == row['producer'])
        assert (entry['tag'], entry['fields']) == (row['tag'], row['fields'])
    calls.extend((int(site, 16), producer) for site in row['callers'])
for site, destination in calls:
    opcode, delta = struct.unpack('<Bi', region(site, 5)[1])
    assert opcode == 0xe8 and site + delta + 5 == destination, hex(site)

constants = [
    (0x4f8245, bytes.fromhex('68cc7b5600')), (0x567bcc, b'/1I\0'),
    (0x56367c, b'I|%d|%d|%d\0'), (0x5637c8, b'P|%d|%d\0'),
    (0x56457c, b'D|%d\0'), (0x564584, b'G|%d\0'), (0x534594, b'C\0'),
    (0x49b0c7, bytes.fromhex('bb06000000')), (0x49b227, bytes.fromhex('83c306')),
    (0x49b231, bytes.fromhex('83fb7e')), (0x49b24e, bytes.fromhex('be90000000')),
    (0x49b262, bytes.fromhex('8d4eea')), (0x49b579, bytes.fromhex('83c621')),
    (0x49b582, bytes.fromhex('81fe35010000')), (0x49b592, bytes.fromhex('681f010000')),
    (0x49aced, bytes.fromhex('83c007')), (0x49b062, bytes.fromhex('83c022')),
    (0x49c873, bytes.fromhex('f604951e3df50060')), (0x49c3ad, bytes.fromhex('83c164')),
    (0x49d40f, bytes.fromhex('83c164')), (0x49dc9f, bytes.fromhex('be40420f00')),
    (0x49dcf8, bytes.fromhex('be40420f00')), (0x467fc6, bytes.fromhex('ff5638')),
    (0x52ea41, b'\x02'), (0x5633ec, b'%d|%d\0'), (0x564754, b'|\0'),
    (0x4a3e8c, bytes.fromhex('f6048dfe6ff50001')), (0x4a44ba, bytes.fromhex('66833cd5f035ef0000')),
    (0x4a30b5, bytes.fromhex('833da41bc20001')),
]
for address, raw in constants:
    assert region(address, len(raw))[1] == raw, hex(address)

receipt = dict(
    source=source, tools=dict(rea='6.7.0', ghidra='12.1.4', profile=profile),
    retained_records=len(records), functions=functions, windows=windows,
    storage_dispatch=[dict(mode=hex(m), case_entry=hex(e), call=hex(s), parser='0x49aad0') for m,e,s in dispatch],
    storage_records={op: hex(address) for op,address in bank_cases.items()},
    trade_incoming=incoming, trade_outgoing=outgoing, calls=[[hex(a), hex(b)] for a,b in calls],
    constants={hex(a): raw.hex() for a,raw in constants}, dispatch_catalog=identity(catalog_path),
    prior_source_checks=[identity(path) for path in prior], REA_bundle=identity(bundle), closure=identity(closure),
    VM_actions=0, original_execution=0, official_sessions=0,
)
out = HERE / 'source-check.json'
if out.exists():
    assert read(out) == receipt
else:
    with out.open('x') as f:
        f.write(json.dumps(receipt, indent=2) + '\n')
print(f'{len(records)} records, {len(functions)} functions, {len(windows)} PE windows, {len(calls)} direct calls')
