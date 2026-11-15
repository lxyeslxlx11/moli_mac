#!/usr/bin/env python3
"""Bind handoff, paired input, appearance and illustrated Page dialogs to fixed PE and REA evidence."""
from hashlib import sha256
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis/game-wechat-special-dialogs-v1'
PRIOR = ROOT / 'analysis/game-battle-shared-storage-v1'


def read(path):
    return json.loads(path.read_text())


def identity(path):
    data = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(data), sha256=sha256(data).hexdigest())


prior = [PRIOR / f'{name}-source-check.json' for name in (
    'map-special-dialogs', 'map-dialog-services', 'shop-conversion',
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
assert len(records) == meta['export']['records'] == 70
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
assert len(functions) == 27 and len(windows) == 43

def word(address):
    return struct.unpack('<I', region(address, 4)[1])[0]


dispatch = [
    (0x00, 0x48fefc, 0x48ff13, 0x4908e0), (0x01, 0x48fefc, 0x48ff13, 0x4908e0),
    (0x02, 0x48fefc, 0x48ff13, 0x4908e0), (0x0a, 0x48ff21, 0x48ff38, 0x4908e0),
    (0x0b, 0x48ff21, 0x48ff38, 0x4908e0), (0x1e, 0x49007c, 0x49007d, 0x492f60),
    (0x1f, 0x49008b, 0x49008c, 0x4a99b0), (0x23, 0x48fefc, 0x48ff13, 0x4908e0),
    (0x24, 0x490132, 0x490135, 0x4b3780), (0x25, 0x490143, 0x490147, 0x4b4010),
]
cases = region(0x49026c, 45)[1]
for mode, branch, _, _ in dispatch:
    assert word(0x4901f8 + 4 * cases[mode]) == branch, hex(mode)

calls = {(site, target) for _, _, site, target in dispatch} | {
    (0x4fb795, 0x4f4410), (0x4f447f, 0x48fce0),
    (0x493037, 0x4926f0), (0x492d36, 0x4f8240), (0x490b17, 0x48f0a0),
    (0x48f15a, 0x48f080), (0x49048e, 0x46d160), (0x4904a7, 0x46d160),
    (0x4904c0, 0x456330), (0x4904dc, 0x456330), (0x490532, 0x511180),
    (0x490573, 0x511180), (0x4905ac, 0x511060), (0x4905e4, 0x4f8240),
    (0x4b387b, 0x500e90), (0x4b3881, 0x5012d0), (0x4b3aae, 0x4b36d0),
    (0x4b3ad4, 0x4b3640), (0x4b3c29, 0x4b3640), (0x4b3c72, 0x4f8240),
    (0x4b3d22, 0x4b3640), (0x4b3df8, 0x4b3640), (0x4b3ec7, 0x4b3640),
    (0x4b4103, 0x48efb0), (0x4b3fca, 0x4f8240),
    (0x49090d, 0x5111a0), (0x4909e5, 0x445390), (0x490a15, 0x445390),
    (0x490a39, 0x490760), (0x490ab5, 0x4e9e20), (0x4908cf, 0x48efb0),
}
for site, target in sorted(calls):
    opcode, delta = struct.unpack('<Bi', region(site, 5)[1])
    assert opcode == 0xe8 and site + delta + 5 == target, hex(site)

constants = {
    0x492ce0: '40', 0x492d16: '6a00', 0x492fa4: '8b0d78bc5500', 0x492fb7: '8b157cbc5500',
    0x490469: 'f6c301', 0x490966: '8d488a83c0bd', 0x48f367: '8b1558e8c100',
    0x48f399: 'a310bc5500', 0x49059e: '68ff000000', 0x5681c8: 'ff',
    0x4b386d: 'a0404f9200', 0x4f4a74: 'a2404f9200', 0x4f01b2: 'a3a436f500',
    0x4b388b: '3df8ae0300', 0x4b38a3: '83fe05', 0x4b38b4: '83fe07',
    0x4b3c52: '6a01', 0x4b3cd7: '83fe04', 0x4b3db7: '83fe07', 0x4b3e87: '83fe0a',
    0x4b3faa: '56', 0x4b40fa: '6a626a566a00516a01', 0x4b410e: '68303f4b00',
    0x48ff05: '68f000000068c0010000', 0x48ff2a: '68b00100006840020000',
    0x4909fb: '3c407506c64601ff', 0x490a05: '3c677557807e012c', 0x490a29: 'c60700d1f8',
    0x490a45: '8d7eff83c102', 0x490a7e: '80f9ff740a', 0x4907d3: '8a4e0146',
    0x48f42d: '89bea8020000', 0x48f445: '89b7b8020000', 0x4f8245: '68cc7b5600',
}
for address, expected in constants.items():
    raw = bytes.fromhex(expected)
    assert region(address, len(raw))[1] == raw, hex(address)
literals = {0x563f34: b'%s|%s\0', 0x563f3c: b'@\0', 0x56bd40: b'\x0an,c|z\\y',
            0x5331ac: b'%d\0', 0x567bcc: b'/1I\0', 0x567c74: b'Q?m\0'}
for address, raw in literals.items():
    assert region(address, len(raw))[1] == raw
for pointer, address, label in ((0x55bc78,0x56275c,'给予物品'),(0x55bc7c,0x562750,'接受物品'),(0x55bc84,0x562814,'不用了')):
    raw = label.encode('cp936') + b'\0'
    assert word(pointer) == address and region(address,len(raw))[1] == raw

descriptor = word(0x559ad8)
assert descriptor == 0x52e838
widgets, initialize, draw, close = struct.unpack('<4I', region(descriptor + 32,16)[1])
assert (widgets, initialize, draw, close) == (0x5556e0, 0x4b3840, 0x4b3b20, 0x4b3bb0)
callbacks = {0:0x4b3be0, 3:0x4b3cb0, 5:0x4b3cb0, 6:0x4b3d90, 8:0x4b3d90, 9:0x4b3e60, 11:0x4b3e60}
for widget, callback in callbacks.items():
    assert word(widgets + widget * 32 + 28) == callback

receipt = dict(
    source=source, tools=dict(rea='6.7.0', ghidra='12.1.4', profile=profile),
    retained_records=len(records), functions=functions, windows=windows,
    dispatch=[dict(mode=hex(m), case=hex(e), call=hex(s), parser=hex(t)) for m,e,s,t in dispatch],
    calls=[[hex(a),hex(b)] for a,b in sorted(calls)],
    appearance_callbacks={str(w):hex(c) for w,c in callbacks.items()},
    constants={hex(a):r for a,r in constants.items()}, literals={hex(a):r.hex() for a,r in literals.items()},
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
