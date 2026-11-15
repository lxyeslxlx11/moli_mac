"""Verify lethal reflection stop, ordinary exit and pool retirement in the fixed PE."""
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
    prior = HERE.parent / 'game-legacy-battle-reflected-rid0-v1/source-check.json'
    assert identity(prior)['sha256'] == '6a2378fc5ed6a56ec860d97994761b48aaa0d5975ea7e8eafdcaf34223123146'
    previous = read(prior)
    assert previous['source'] == source
    bundle, closure = PRIVATE / 'rea-evidence.json', PRIVATE / 'rea-closed.json'
    assert read(closure) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    ledger = read(bundle)
    assert len(ledger['records']) == 13 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    memory, windows = [], []
    for record in ledger['records']:
        assert (record['operation'], record['provider']['id'], record['provider']['version']) == (
            'read_bytes', 'ghidra', '12.1.4')
        assert record['subject']['digest']['sha256'] == source['sha256']
        result = record['normalized_result']
        address, length = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, length)
        assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=length,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        windows.append((int(address, 16), int(address, 16) + length))
    retained = [row for row in previous['memory'] if row['address'] == '0x42ac90']
    assert len(retained) == 1 and len({row['address'] for row in memory}) == 13
    for row in retained:
        offset, raw = image.locate(row['address'], row['bytes'])
        assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
        start = int(row['address'], 16)
        windows.append((start, start + row['bytes']))

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    operands = []
    for address, expected in (
        # Local lethal response and the remote departure queue.
        (0x42ad94, '68f4000000'), (0x42ad99, 'e954010000'), (0x42ada5, '6a32'), (0x42adb3, '6a31'),
        (0x419804, '7e934100'), (0x4194b4, '8de24000'), (0x4194e4, 'dbdf4000'),
        (0x4194ec, 'b1e140006ae24000'), (0x4194f8, '47ea400063ea4000'),
        # 244 resets ready and sets stop, then joins the ordinary callback tail.
        (0x41937e, 'c705409c590000000000'), (0x419388, 'c705449c590001000000'),
        (0x4365e9, 'a1449c5900'), (0x436617, '393d409c5900'), (0x43662a, '8935409c5900'),
        (0x436635, 'c705a0f1f50007000000'),
        # Main10 phase7 clears registrations and phase8 retires the whole pool.
        (0x437b64, '33db83f809'), (0x437b6e, 'bd01000000'), (0x437b79, 'ff24855c864300'),
        (0x438678, '8f8243004b834300'), (0x43828f, '891d9c8b5900'), (0x438295, '892d449c5900'),
        (0x4382a5, 'b916000000'), (0x4382ac, 'bfc4fa5800'), (0x4382bb, 'f3ab'),
        (0x438383, '3bc5'), (0x43838b, '556a09'), (0x4383d5, '5350'),
        (0x40a0d6, 'b801000000'), (0x40a0db, '89461c'), (0x40a0de, '8b7604'),
        # The paired B corpse completes its effect before state49 clears its slot.
        (0x40e26a, '83bd2410000002'), (0x40e277, 'c7852410000000000000'),
        (0x40e281, 'c7432c31000000'), (0x40ea4a, 'c70485c4fa580000000000'),
    ):
        offset, raw = cover(address, len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw)))
    calls = []
    for address, target in (
        (0x42ad7d, 0x434990), (0x42ada9, 0x434990), (0x42adbe, 0x434990), (0x42aefb, 0x434990),
        (0x43829b, 0x409fe0), (0x4382a0, 0x436cf0),
        (0x43837b, 0x505030), (0x43838e, 0x501a10), (0x438396, 0x40a0c0), (0x43839b, 0x440570),
        (0x4383a5, 0x4032f0), (0x4383cb, 0x403320), (0x4383d7, 0x4f67f0), (0x40a0c9, 0x464c70),
        (0x40e1b1, 0x4457b0), (0x40e1f2, 0x510000), (0x40e200, 0x41dc00), (0x40ea56, 0x40a090),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    result = dict(stage=270, source=source, evidence=identity(bundle), closure=identity(closure), prior=identity(prior),
                  rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, carried_windows=retained,
                  operands=operands, calls=calls, original_runtime_observed=False,
                  native_device_and_official_acceptance=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'carried_windows', 'operands', 'calls')}))


if __name__ == '__main__':
    main()
