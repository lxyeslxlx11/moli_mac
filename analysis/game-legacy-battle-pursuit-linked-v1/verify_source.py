"""Bind SKL400's existing-row continuation to REA bytes and the fixed PE."""
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
read = lambda path: json.loads(path.read_text())


def main():
    image = STARTUP['Image'](NETWORK['TARGET'], 1569280, NETWORK['SHA'])
    source = identity(image.path)
    prior = HERE.parent / 'game-legacy-battle-pursuit-targets-v1/source-check.json'
    assert identity(prior)['sha256'] == '1ca26e180edba9c8f1b5d0562da41b8d47c1d15c1e19855c97119e5966862458'
    previous = read(prior)
    assert previous['source'] == source
    memory, windows, evidence = [], [], []
    for stem, count in [('rea', 10), ('animation', 1)]:
        bundle, closure = PRIVATE / (stem + '-evidence.json'), PRIVATE / (stem + '-closed.json')
        assert read(closure) == dict(open=False, cleanup_pending=False, rea='6.7.0')
        ledger = read(bundle)
        assert len(ledger['records']) == count and not ledger['unknowns']
        assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
        evidence.append(dict(ledger=identity(bundle), closure=identity(closure)))
        for record in ledger['records']:
            assert record['operation'] == 'read_bytes'
            assert (record['provider']['id'], record['provider']['version']) == ('ghidra', '12.1.4')
            assert record['subject']['digest']['sha256'] == source['sha256']
            result = record['normalized_result']
            address, length = result['address'], result['requested_bytes']
            offset, raw = image.locate(address, length)
            assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
            memory.append(dict(address=address, file_offset=offset, bytes=length,
                               sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
            start = int(address, 16)
            windows.append((start, start + length))
    retained = [row for row in previous['carried_windows'] if row['address'] == '0x434b90']
    assert len(retained) == 1
    row = retained[0]
    offset, raw = image.locate(row['address'], row['bytes'])
    assert offset == row['file_offset'] and sha256(raw).hexdigest() == row['sha256']
    start = int(row['address'], 16)
    windows.append((start, start + len(raw)))

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    operands = []
    for address, expected, meaning in (
        (0x430afa, '6a006a00', 'SKL400 producer writes amount and extra as zero'),
        (0x41e795, 'f7c500008000', 'type31 extended flag'),
        (0x436e65, 'f7c500008000', 'child continuation writer extended flag'),
        (0x436efd, '8b4c301c', 'R1.slot opaque metadata'),
        (0x436f10, '8b4c3024', 'R1.amount first resource'),
        (0x436f23, '8b4c3028', 'R1.extra second resource'),
        (0x436f3c, '8b4c3024', 'R2.amount third resource'),
        (0x414a00, '8b859c0c0000', 'caller rereads advanced tuple cursor'),
        (0x414a10, '3bc8', 'caller compares post-read target with caster'),
        (0x41a0bd, 'f7c600008000', 'metadata result consumes child continuation'),
        (0x41a0e6, 'f7c600200000', 'metadata recipient redirects to owner'),
        (0x4fd693, '3de70300007f0d896e205f5e5d33c05b83c40cc3',
         'animation resource at most999 yields graphicIndex0 and return0'),
        (0x434c46, '3d201c0000', 'retained wait counter compares7200'),
    ):
        offset, raw = cover(address, len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw), meaning=meaning))
    calls = []
    for address, target in (
        (0x430b0d, 0x434af0),
        (0x41e77e, 0x434af0), (0x41e7b2, 0x436ee0), (0x41e7cd, 0x436e60),
        (0x436eea, 0x434b60), (0x436f29, 0x434b60), (0x436f42, 0x434b60),
        (0x436e8f, 0x434af0), (0x436ea2, 0x434af0), (0x436ec7, 0x434af0),
        (0x414a1c, 0x434a30), (0x414a25, 0x434b60),
        (0x4225ad, 0x41a030), (0x41a0de, 0x436ee0),
        (0x41a12f, 0x422d60), (0x41a186, 0x422d60),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    result = dict(stage=274, source=source, evidence=evidence, prior=identity(prior),
                  rea='6.7.0', provider='Ghidra 12.1.4', memory=memory,
                  carried_windows=retained, operands=operands, calls=calls,
                  source_facts=['SKL400 retains slot/flag wire pairs and zero amount/extra words',
                                'extended type31 consumes three existing parent rows and writes four child rows',
                                'action211 rereads the parent target after the helper advances it',
                                'animation resource<1000 returns the graphic-zero marker'],
                  portable_render_policy=dict(graphic_zero='skip submission without allocating a replacement resource',
                                              classification='derived handling of the native hidden marker',
                                              original_graphic_zero_backend_pixels_verified=False),
                  original_runtime_observed=False, native_device_and_official_acceptance=False,
                  extent_limit='Selected raw PE spans; no canonical whole-function discovery claimed for interior entries.')
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ['memory', 'carried_windows', 'operands', 'calls']}))


if __name__ == '__main__':
    main()
