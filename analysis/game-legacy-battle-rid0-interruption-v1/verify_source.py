"""Cross-check the REA cursor, command count, and object retirement evidence."""

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


def scan_cases():
    def scan(data, cursor):
        while not 65 <= data[cursor] <= 90:
            cursor += 1
        return data[cursor:cursor + 3].decode('ascii'), cursor + 4

    outcomes = []
    for unread, successors, expected in (
        ('0|F|FF|', 1, ('F|F', 'RID', 0)),
        ('0|F|FF|', 2, ('F|F', 'RID', 1)),
        ('1|0|F|FF|', 1, ('F|F', 'RID', 0)),
        ('0|A1|FF|', 1, ('A1|', 'F|R', None)),
        ('0|2|FF|', 1, ('FF|', 'ID|', None)),
        ('0|2|FF||', 1, ('FF|', 'RID', 0)),
        ('0|F|FF|', 0, (None, 'F|F', None)),
    ):
        data = (unread + 'RID|0|').encode('ascii')
        skipped, cursor = scan(data, 0) if successors else (None, 0)
        token, after = scan(data, cursor)
        accepted = token == 'RID' and after - 4 == len(unread)
        remaining = successors - 1 if accepted else None
        assert (skipped, token, remaining) == expected
        outcomes.append(dict(unread=unread, successors=successors, abort_token=skipped,
                             tail_token=token, tail_offset=after - 4, accepted=accepted,
                             remaining_after_physical_wait=remaining))
    return outcomes


def main():
    image = STARTUP['Image'](NETWORK['TARGET'], 1569280, NETWORK['SHA'])
    source = identity(image.path)
    bundle = PRIVATE / 'rea-evidence.json'
    closure = PRIVATE / 'rea-closed.json'
    assert read(closure) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    ledger = read(bundle)
    assert len(ledger['records']) == 25 and not ledger['unknowns']
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
    assert len({row['address'] for row in memory}) == 25

    prior = HERE.parent / 'game-legacy-battle-rid0-receive-v1/source-check.json'
    lookahead = HERE.parent / 'game-legacy-battle-missing-lookahead-v1/source-check.json'
    assert identity(prior)['sha256'] == '5a39d7dd31530f2b7abaa1cbc52087fbcc01583e442b86c4fbacddb89d5f4f89'
    assert read(prior)['source'] == read(lookahead)['source'] == source
    retained = [row for row in read(prior)['carried_windows'] if row['address'] in ('0x4236d0', '0x424310')]
    retained += [row for row in read(lookahead)['memory'] if row['address'] == '0x4347e0']
    assert len(retained) == 3
    for row in retained:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        add_window(row['address'], row['bytes'])

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    def operand(address, expected, locate=cover):
        expected = bytes.fromhex(expected)
        offset, raw = locate(address, len(expected))
        assert raw == expected, (hex(address), raw.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(raw))

    operands = [operand(address, raw) for address, raw in (
        (0x436769, '4689705c'), (0x43693e, '8b565c4a8bc289565c'), (0x436949, '0f8eaf000000'),
        (0x43695d, '83f8417c0583f85a7e06'), (0x436970, '6a03'),
        (0x436988, '83c004885c2413894664'), (0x4369b9, 'eb07'),
        (0x4369c2, '895e58895e68'), (0x4369ca, '8b86a8000000'),
        (0x42368d, '83f8417c0583f85a7e06'), (0x4236ab, '6a03'), (0x4236be, '83c004894664'),
        (0x423724, '83ff160f851b080000'), (0x423741, '85c00f8511080000'),
        (0x423f40, '895064e9a0f7ffff'), (0x423f4d, '894d64'),
        (0x425ec5, '8b0c85c4fa580085c90f84e4000000'), (0x425f3a, '747d'),
        (0x426012, '6a07'), (0x42601d, '6a0b'), (0x42602f, '6a0a'),
        (0x426440, 'ff249550364300'), (0x428f7e, '0f8484010000'),
        (0x429121, '8a911c374300ff2495fc364300'), (0x4298a4, 'ff4058'),
        (0x4347fa, 'f680dc0f000002'), (0x434807, '837a2c0d'),
        (0x409ffe, '8b461c'), (0x40a02e, '855e24'), (0x40a098, 'c7401c01000000'),
        (0x40a0a5, '8b460c85c07409'),
    )]
    count_init = operand(0x436834, 'c7415c01000000', lambda address, length: image.locate(hex(address), length))
    calls = []
    for address, target in (
        (0x4236f5, 0x423660), (0x423739, 0x436bb0), (0x42435b, 0x436930),
        (0x42461e, 0x436930), (0x425ea6, 0x434670), (0x425f1c, 0x434670),
        (0x425fb9, 0x436930), (0x426016, 0x434990), (0x426028, 0x434990), (0x42603a, 0x434990),
        (0x42987d, 0x424310), (0x42988f, 0x434a70), (0x429898, 0x4236d0),
        (0x42933e, 0x434b90), (0x4293f7, 0x436930), (0x4369de, 0x4347e0),
        (0x436a4d, 0x40a090), (0x40a05c, 0x40a0a0), (0x40a0ad, 0x51bd85), (0x40a0b6, 0x51bd85),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    dispatch = []
    for address, size, expected in ((0x433650, 4, 0x428f6d), (0x433764, 1, 0), (0x4336fc, 4, 0x42933b)):
        offset, raw = cover(address, size)
        assert int.from_bytes(raw, 'little') == expected
        dispatch.append(dict(address=hex(address), file_offset=offset, bytes=size, value=hex(expected)))
    result = dict(stage=265, source=source, evidence=identity(bundle), closure=identity(closure),
                  prior=identity(prior), carried_sources=[identity(lookahead)], carried_windows=retained,
                  rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, operands=operands, calls=calls,
                  dispatch=dispatch, direct_pe_count_init=count_init, inferred_scan_cases=scan_cases(),
                  original_runtime_observed=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'operands', 'calls', 'inferred_scan_cases')}))


if __name__ == '__main__':
    main()
