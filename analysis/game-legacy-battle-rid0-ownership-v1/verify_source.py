"""Verify the fixed PE first-pair, wait, and attached RID0 retirement evidence."""

from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
STARTUP = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
NETWORK = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))
identity = STARTUP['identity']


def read(path):
    return json.loads(path.read_text())


def main():
    image = STARTUP['Image'](NETWORK['TARGET'], 1569280, NETWORK['SHA'])
    source = identity(image.path)
    bundle = PRIVATE / 'rea-evidence.json'
    closure = PRIVATE / 'rea-closed.json'
    assert read(closure) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    ledger = read(bundle)
    assert len(ledger['records']) == 24 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    memory, windows = [], []

    def add_window(address, length):
        start = int(address, 16)
        windows.append((start, start + length))

    for record in ledger['records']:
        assert (record['operation'], record['provider']['id'], record['provider']['version']) == (
            'read_bytes', 'ghidra', '12.1.4')
        result = record['normalized_result']
        address, length = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, length)
        assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=length,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        add_window(address, length)
    assert len({row['address'] for row in memory}) == 24

    prior = HERE.parent / 'game-legacy-battle-rid0-interruption-v1/source-check.json'
    assert identity(prior)['sha256'] == '0dce2a7bafc871a0fecf6682e2b69f7b28a9a2879ae7b7b2f83155db77be7a16'
    previous = read(prior)
    assert previous['source'] == source
    retained = [row for row in previous['carried_windows'] if row['address'] in ('0x4236d0', '0x424310')]
    retained += [row for row in previous['memory'] if row['address'] in ('0x423660', '0x42933b', '0x429396')]
    assert len(retained) == 5
    for row in retained:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        add_window(row['address'], row['bytes'])

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    operands = []
    for address, expected in (
        (0x424341, '8903894424408907'), (0x42434f, '8b0485c4fa58003bc57511'), (0x42436b, '6a26'),
        (0x4243ce, '83fd487514'), (0x4243d5, '6893000000'), (0x424612, '8b0c85c4fa580085c97511'),
        (0x4347e5, '33c9'), (0x43487a, '8988c40f00008988a40c0000'),
        (0x434898, '89b8c80f0000'), (0x4349b6, '899488a40c0000'), (0x4349ce, 'c780d80f000001000000c3'),
        (0x434a74, '85c97413'), (0x434a81, '8b8490a40c000089412c'),
        (0x423868, '8b04b5c4fa5800'), (0x423874, '0f8404070000'), (0x423e61, '89825c100000'),
        (0x423e5c, '68dd000000'), (0x40a174, 'ff248d34944100'), (0x419434, '88a14000'),
        (0x40a19a, '81bc85a40c0000a10000007509'), (0x40a1f5, '8d50ff85d27c19'),
        (0x434ba1, '8b14b5c4fa580085d27477'), (0x434bb5, '8583a80000007466'),
        (0x434be3, '83b8d80f000001744b'), (0x434c46, '3d201c00007e5c'),
        (0x434c74, '6a0b'), (0x434c7f, '6a26'), (0x43495e, '8988a40c00008990a80c0000'),
        (0x41674a, '8904b5c4fa5800'), (0x41675f, 'c7402c01000000'), (0x416790, '33d2895104'),
        (0x4168aa, '8b04b5c4fa5800d94040'), (0x416954, '0f8c14faffff'),
        (0x41697f, '8904bdc4fa5800'), (0x416a18, 'c70000000000'), (0x416a7d, 'c7855c10000000000000'),
        (0x43459a, '85d30f85ae000000'), (0x4345d3, '8b865c100000'), (0x43464a, 'c70700000000'),
        (0x40ea4a, 'c70485c4fa580000000000'), (0x40a0a5, '8b460c85c07409'),
    ):
        offset, raw = cover(address, len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw)))

    calls = []
    for address, target in (
        (0x424326, 0x434670), (0x42435b, 0x436930), (0x42436f, 0x434990),
        (0x4245f5, 0x434990), (0x4245fe, 0x434670), (0x42461e, 0x436930),
        (0x42988f, 0x434a70), (0x429898, 0x4236d0), (0x423e7a, 0x434990), (0x423e93, 0x434af0),
        (0x423f7f, 0x436930), (0x40a1a8, 0x434a30), (0x42933e, 0x434b90), (0x4293f7, 0x436930),
        (0x434c6d, 0x4348e0), (0x434c78, 0x434990), (0x434c83, 0x434990), (0x434c8b, 0x434a70),
        (0x416a42, 0x434a70), (0x416a78, 0x40a090), (0x416ac2, 0x434a70), (0x416ac8, 0x40a090),
        (0x4345da, 0x40a090), (0x43463a, 0x40a090), (0x434642, 0x40a090),
        (0x40a05c, 0x40a0a0), (0x40a0ad, 0x51bd85), (0x40a0b6, 0x51bd85),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    cases = []
    for unread, abort, tail in (
        ('0|F|FF|', 'F|F', 'RID'),
        ('1|0|F|FF|', 'F|F', 'RID'),
        ('A|0|F|FF|', 'A|0', 'F|F'),
    ):
        wire = unread + 'RID|0|'
        first = next(i for i, c in enumerate(wire) if 'A' <= c <= 'Z')
        second = next(i for i in range(first + 4, len(wire)) if 'A' <= wire[i] <= 'Z')
        assert wire[first:first + 3] == abort and wire[second:second + 3] == tail
        cases.append(dict(unread=unread, abort=abort, tail=tail, reaches_rid=second == len(unread)))

    result = dict(stage=266, source=source, evidence=identity(bundle), closure=identity(closure),
                  prior=identity(prior), carried_windows=retained, rea='6.7.0', provider='Ghidra 12.1.4',
                  memory=memory, operands=operands, calls=calls, inferred_scan_cases=cases,
                  wait_check_threshold=7200, queue_after_wait_timeout=[11, 38],
                  original_runtime_observed=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'operands', 'calls', 'inferred_scan_cases')}))


if __name__ == '__main__':
    main()
