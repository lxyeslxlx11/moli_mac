#!/usr/bin/env python3
"""Verify REA's fixed PE evidence for the native page's existing protocol owners."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT = Path(__file__).resolve().parents[2]
A = Path(__file__).resolve().parent
P = ROOT / 'build/analysis/game-wechat-page-v1'


def read(path):
    return json.loads(path.read_text())


def identity(path):
    data = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(data), sha256=sha256(data).hexdigest())


previous = [ROOT / 'analysis' / name / 'source-check.json' for name in (
    'game-post-login-v1', 'game-browser-owner-v1', 'game-input-runtime-v1', 'game-battle-entry-v1',
)]
target = read(previous[0])['source']
assert all(read(path)['source'] == target for path in previous)
file = ROOT / target['path']
assert identity(file) == target
sample = file.read_bytes()
pe = struct.unpack_from('<I', sample, 60)[0]
base = struct.unpack_from('<I', sample, pe + 52)[0]
table = pe + 24 + struct.unpack_from('<H', sample, pe + 20)[0]
sections = [struct.unpack_from('<4I', sample, table + i * 40 + 8)
            for i in range(struct.unpack_from('<H', sample, pe + 6)[0])]


def region(address, size):
    for _, va, raw_size, raw in sections:
        position = address - base - va
        if 0 <= position <= raw_size - size:
            start = raw + position
            return start, sample[start:start + size]
    raise AssertionError((hex(address), size))


bundle = P / 'rea-evidence-bundle.json'
closure_path = P / 'rea-closure.json'
windows_path = P / 'rea-windows.json'
closure = read(closure_path)
assert not closure['open'] and not closure['cleanup_pending'] and closure['package'] == '6.7.0'
ledger = {row['evidence_id']: row for row in read(bundle)['records']}
assert len(ledger) == closure['export']['records'] == 36 and bundle.stat().st_size == closure['export']['bytes']
profile = read(previous[0])['tools']['profile']
for row in ledger.values():
    assert row['subject']['digest']['sha256'] == target['sha256']
    assert row['analysis_profile']['digest'] == profile
    assert row['analysis_profile']['provider']['version'] == '12.1.4'

windows = []
for address, size, evidence_id in read(windows_path):
    row = ledger[evidence_id]
    observed = row['normalized_result']
    assert row['operation'] == 'read_bytes' and observed['address'] == address and observed['complete']
    assert observed['returned_bytes'] == observed['requested_bytes'] == size
    start, data = region(int(address, 16), size)
    assert data == bytes.fromhex(observed['bytes_hex'])
    windows.append(dict(address=address, bytes=size, file_offset=start, sha256=sha256(data).hexdigest(), evidence_id=evidence_id))

functions = {}
for row in ledger.values():
    if row['operation'] != 'analyze_function':
        continue
    procedure = row['normalized_result']['procedure']
    assert procedure['body']['contains_entry']
    spans = []
    for span in procedure['body']['ranges']:
        first, end = int(span['start'], 16), int(span['end'], 16)
        size = end - first + 1
        offset, data = region(first, size)
        spans.append(dict(**span, bytes=size, file_offset=offset, sha256=sha256(data).hexdigest()))
    assert sum(span['bytes'] for span in spans) == procedure['body']['total_bytes']
    functions[procedure['address']] = dict(evidence_id=row['evidence_id'], ranges=spans)
assert len(functions) == len(windows) == 18
calls = (
    (0x4566db, 0x4ef060), (0x456765, 0x4ef0c0), (0x4ef094, 0x4f8650),
    (0x4f865b, 0x4fcea0), (0x4f866f, 0x4fca70), (0x4f8692, 0x4fca70),
    (0x4f86b5, 0x4fca70), (0x4f86d5, 0x4fce00), (0x4ef8ba, 0x502810),
    (0x4ef92b, 0x440450), (0x4ff191, 0x4ff3b0), (0x4f2c2c, 0x4f6470),
    (0x4f6518, 0x4fce00), (0x4f3477, 0x45f170), (0x4f348c, 0x44e7d0),
    (0x4f379f, 0x436f50), (0x4f682f, 0x4fce00),
)
for site, target_address in calls:
    opcode, relative = struct.unpack('<Bi', region(site, 5)[1])
    assert opcode == 0xe8 and site + 5 + relative == target_address, hex(site)
assert region(0x5678c8, 11)[1] == b'successful\x00'
report = dict(
    source=target, tools=dict(rea='6.7.0', ghidra='12.1.4', profile=profile), closed=True,
    retained_records=len(ledger), functions=functions, windows=windows, call_checks=len(calls),
    evidence_bundle=identity(bundle), closure=identity(closure_path), windows_index=identity(windows_path),
    previous_evidence=[identity(path) for path in previous], official_sessions=0, original_execution=0,
)
receipt = A / 'source-check.json'
if receipt.exists():
    assert read(receipt) == report, 'The retained source receipt differs from this verification.'
else:
    with receipt.open('x') as output:
        output.write(json.dumps(report, indent=2) + '\n')
print(f"{len(ledger)} records, {len(functions)} functions, {len(windows)} PE windows, {len(calls)} direct calls")
