#!/usr/bin/env python3
"""Check the REA creation evidence against the fixed legacy PE."""
from hashlib import sha256
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
BUILD = ROOT / 'build/analysis/game-wechat-creation-v1'
PREVIOUS = ROOT / 'analysis/game-character-lifecycle-v1/source-check.json'


def read(path):
    return json.loads(path.read_text())


def identity(path):
    data = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(data), sha256=sha256(data).hexdigest())


prior = read(PREVIOUS)
source = ROOT / prior['source']['path']
assert identity(source) == prior['source']
pe = source.read_bytes()
header = struct.unpack_from('<I', pe, 60)[0]
image = struct.unpack_from('<I', pe, header + 52)[0]
table = header + 24 + struct.unpack_from('<H', pe, header + 20)[0]
sections = [struct.unpack_from('<4I', pe, table + i * 40 + 8)
            for i in range(struct.unpack_from('<H', pe, header + 6)[0])]


def mapped(address, size):
    for _, start, length, offset in sections:
        index = address - image - start
        if 0 <= index <= length - size:
            return offset + index, pe[offset + index:offset + index + size]
    raise AssertionError((hex(address), size))


bundle_path = BUILD / 'rea-evidence-bundle.json'
closure_path = BUILD / 'rea-closure.json'
closure = read(closure_path)
assert not closure['open'] and not closure['cleanup_pending'] and closure['package'] == '6.7.0'
records = read(bundle_path)['records']
assert len(records) == closure['export']['records'] == 22
assert bundle_path.stat().st_size == closure['export']['bytes']
assert len({record['evidence_id'] for record in records}) == len(records)
functions, windows = {}, {}
for row in records:
    assert row['subject']['digest']['sha256'] == prior['source']['sha256']
    assert row['analysis_profile']['digest'] == prior['tools']['profile']
    assert row['analysis_profile']['provider']['version'] == '12.1.4'
    result = row['normalized_result']
    if row['operation'] == 'read_bytes':
        address, length = result['address'], result['requested_bytes']
        assert result['complete'] and result['returned_bytes'] == length
        offset, raw = mapped(int(address, 16), length)
        assert raw == bytes.fromhex(result['bytes_hex'])
        windows[address] = dict(bytes=length, offset=offset, sha256=sha256(raw).hexdigest(), evidence=row['evidence_id'])
    else:
        assert row['operation'] == 'analyze_function'
        procedure = result['procedure']
        assert procedure['body']['contains_entry']
        spans = []
        for span in procedure['body']['ranges']:
            start, end = int(span['start'], 16), int(span['end'], 16)
            offset, raw = mapped(start, end - start + 1)
            spans.append(dict(**span, offset=offset, bytes=len(raw), sha256=sha256(raw).hexdigest()))
        assert sum(span['bytes'] for span in spans) == procedure['body']['total_bytes']
        functions[procedure['address']] = dict(ranges=spans, evidence=row['evidence_id'])
assert set(functions) == {
    '0x456370', '0x456390', '0x459f30', '0x45a0e0', '0x45a1a0', '0x45a8a0',
    '0x45a970', '0x4ef3a0', '0x4ef430', '0x4ef480', '0x4f8460',
}
assert len(windows) == 11
calls = (
    (0x459f3a, 0x45a0e0), (0x459f7e, 0x45a1a0), (0x459f94, 0x45a8a0),
    (0x459fcf, 0x45a8a0), (0x459fe5, 0x45a8a0), (0x459ffb, 0x45a970),
    (0x45a042, 0x456370), (0x45a065, 0x456390), (0x456382, 0x5183a0),
    (0x45644c, 0x4ef3a0), (0x456460, 0x4ef430), (0x4ef405, 0x4f8460),
    (0x45b02d, 0x5005c0), (0x45b079, 0x4052d0), (0x45b08a, 0x456330),
)
for site, target in calls:
    opcode, relative = struct.unpack('<Bi', mapped(site, 5)[1])
    assert opcode == 0xe8 and site + 5 + relative == target, hex(site)
assert mapped(0x4f8465, 5)[1] == b'\x68' + struct.pack('<I', 0x567bd8)
literals = {0x567bd8: b'/qW\x00', 0x567c48: b'U_s\x00', 0x5678c8: b'successful\x00'}
for address, value in literals.items():
    assert hex(address) in windows and mapped(address, len(value))[1] == value
assert b'\x3d\xc0\x27\x09\x00\x76' in mapped(0x4ef430, 80)[1]

report = dict(
    source=prior['source'], tools=prior['tools'], prior_creation_contract=identity(PREVIOUS),
    REA_bundle=identity(bundle_path), closed=identity(closure_path), retained_records=len(records),
    functions=functions, windows=windows, direct_calls=[(hex(a), hex(b)) for a, b in calls],
    literals={hex(address): value[:-1].decode('ascii') for address, value in literals.items()},
    timeout_when_unsigned_elapsed_exceeds_ms=600000, original_execution=0, official_sessions=0,
)
receipt = HERE / 'source-check.json'
if receipt.exists():
    assert read(receipt) == json.loads(json.dumps(report))
else:
    with receipt.open('x') as output:
        output.write(json.dumps(report, indent=2) + '\n')
print(f'{len(records)} REA records, {len(functions)} functions, {len(windows)} PE windows, {len(calls)} calls')
