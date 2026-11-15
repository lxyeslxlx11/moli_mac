"""Verify the fixed PE look-ahead, missing-target cleanup, and grouped cursor."""

from ast import Assign, literal_eval, parse
from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path
from struct import unpack


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
STARTUP = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
NETWORK = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))


def read(path):
    return json.loads(path.read_text())


def main():
    image = STARTUP['Image'](NETWORK['TARGET'], 1569280, NETWORK['SHA'])
    identity = STARTUP['identity']
    bundle, closure = PRIVATE / 'rea-evidence.json', PRIVATE / 'rea-closure.json'
    ledger = read(bundle)
    assert read(closure) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    assert ledger['artifacts'][0]['digest']['sha256'] == NETWORK['SHA']
    assert not ledger['unknowns']
    memory, references, windows = [], {}, []
    for record in ledger['records']:
        assert [record['provider'][key] for key in ('id', 'version')] == ['ghidra', '12.1.4']
        result = record['normalized_result']
        if record['operation'] == 'xrefs':
            references[record['parameters']['address']] = dict(evidence=record['evidence_id'], addresses=result)
            continue
        assert record['operation'] == 'read_bytes'
        address, length = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, length)
        assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=length,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        start = int(address, 16)
        windows.append((start, start + length))
    assert len(memory) == 12 and len(references) == 3
    assert references['0x436c20']['addresses'] == ['0x42545a', '0x4257b4', '0x425cdf']
    assert len(references['0x436930']['addresses']) == 86 and '0x425fb9' in references['0x436930']['addresses']
    assert references['0x4347e0']['addresses'] == ['0x4368f4', '0x4369de', '0x436a38']

    prior = HERE.parent / 'game-legacy-battle-missing-v1/source-check.json'
    previous = read(prior)
    assert previous['source']['sha256'] == NETWORK['SHA']
    carried = {}
    for address in ('0x40a188', '0x434670', '0x434990', '0x434b90'):
        row = previous['memory'][address]
        offset, raw = image.locate(address, row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        carried[address] = row
        start = int(address, 16)
        windows.append((start, start + row['bytes']))

    def cover(address, length):
        assert any(lo <= address and address + length <= hi for lo, hi in windows), hex(address)
        return image.locate(hex(address), length)

    def operand(address, expected):
        expected = bytes.fromhex(expected)
        offset, raw = cover(address, len(expected))
        assert raw == expected, (hex(address), raw.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(raw))

    operands = [operand(address, raw) for address, raw in (
        (0x436c34, '89542414'), (0x436c8c, 'f7c610100000'), (0x436cd5, '8bc3'),
        (0x4242c2, '6a03'), (0x4242d2, '6a006a006a0055'), (0x4242e6, '6a48'),
        (0x425ec5, '8b0c85c4fa5800'), (0x425f30, '8b0c85c4fa5800'), (0x425f37, '85c9'),
        (0x425f3a, '747d'), (0x4346d6, 'ff4664'), (0x436941, '4a'), (0x436988, '83c004'),
        (0x4369b1, '81ffb43e5300'), (0x4369bf, '89692c'), (0x4369c2, '895e58895e68'),
        (0x4347fa, 'f680dc0f000002'), (0x434807, '837a2c0d'), (0x434880, '8988a40c0000'),
        (0x434886, '8988a0130000'), (0x4349ce, 'c780d80f000001000000'), (0x40a196, '3bc1'),
        (0x434c46, '3d201c00007e5c'), (0x426012, '6a07'), (0x42601d, '6a0b'), (0x42602f, '6a0a'),
    )]
    calls = []
    for address, target in (
        (0x436c53, 0x436bb0), (0x436c70, 0x436bb0), (0x4257b4, 0x436c20), (0x425cdf, 0x436c20),
        (0x4257d5, 0x4241f0), (0x425d11, 0x4241f0), (0x4242da, 0x434af0),
        (0x425ea6, 0x434670), (0x425f1c, 0x434670), (0x425f22, 0x4234e0),
        (0x425fb9, 0x436930), (0x4369de, 0x4347e0), (0x436a38, 0x4347e0),
        (0x426016, 0x434990), (0x426028, 0x434990), (0x42603a, 0x434990), (0x40a74e, 0x419e90),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    # 436930 inspects one candidate with the table at 533e54. Its fixed
    # four-byte stride is different from resuming at the validated M record.
    table_offset, table = image.locate('0x533e54', 24 * 4)
    tokens = [image.locate(hex(pointer), 4)[1][:3] for pointer in unpack('<24I', table)]
    assert len(set(tokens)) == 24 and tokens[13] == b'CFP'
    peer = HERE.parent / 'game-browser-owner-v1/original_peer.py'
    modes = next(literal_eval(row.value) for row in parse(peer.read_text()).body if isinstance(row, Assign)
                 and any(getattr(target, 'id', '') == 'repeated_guard_modes' for target in row.targets))
    scans = {}
    for mode, marker, expected in (
        ('missing-lookahead', b'|1|B|11|', b'A|1'),
        ('missing-later-lookahead', b'|2|C|11|', b'FF|'),
    ):
        _, raw = modes['battle-status-physical-skl72-' + mode]
        lookup_end = raw.index(marker) + len(marker) - len(b'11|')
        start = next(i for i in range(lookup_end, len(raw)) if 65 <= raw[i] <= 90)
        candidate = raw[start:start + 3]
        assert candidate == expected and candidate not in tokens
        scans[mode] = dict(missing_lookup_end=lookup_end, first_uppercase=start, candidate=candidate.decode(),
                           native_after_one_scan=start + 4, shared_next_token=raw.index(b'CFP|'))

    result = dict(stage=260, source=identity(image.path), evidence=identity(bundle), closure=identity(closure),
                  carried_source=identity(prior), rea='6.7.0', provider='Ghidra 12.1.4',
                  memory=memory, references=references, carried_windows=carried, operands=operands, calls=calls,
                  grouped_cursor=dict(token_table_file_offset=table_offset, token_count=len(tokens), scans=scans),
                  original_runtime_observed=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(dict(memory=len(memory), carried_windows=len(carried), references=len(references),
                          operands=len(operands), calls=len(calls), grouped_cursor=scans)))


if __name__ == '__main__':
    main()
