"""Check repeated protection, formation return, and look-ahead anchors against the retained PE and REA bundle."""

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


def main():
    image = STARTUP['Image'](NETWORK['TARGET'], 1569280, NETWORK['SHA'])
    identity = STARTUP['identity']
    bundle = PRIVATE / 'rea-evidence.json'
    closure = PRIVATE / 'rea-closure.json'
    ledger = json.loads(bundle.read_text())
    assert ledger['artifacts'][0]['digest']['sha256'] == NETWORK['SHA']
    assert json.loads(closure.read_text()) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    memory, references, windows = [], {}, []
    for record in ledger['records']:
        assert record['provider']['id'] == 'ghidra' and record['provider']['version'] == '12.1.4'
        result = record['normalized_result']
        if record['operation'] == 'xrefs':
            references[record['parameters']['address']] = dict(evidence=record['evidence_id'], addresses=result)
            continue
        assert record['operation'] == 'read_bytes'
        address, size = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, size)
        assert result['complete'] and result['returned_bytes'] == size and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=size,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        windows.append((int(address, 16), int(address, 16) + size))
    assert len(memory) == 24 and len(references) == 3
    assert references['0x423fa0']['addresses'] == ['0x4248da', '0x4249cf', '0x424ff7']
    assert references['0x4241f0']['addresses'] == ['0x425690', '0x4257d5', '0x425d11']
    assert references['0x436c20']['addresses'] == ['0x42545a', '0x4257b4', '0x425cdf']

    def cover(address, size):
        assert any(low <= address and address + size <= high for low, high in windows), hex(address)
        return image.locate(hex(address), size)

    def verify(address, expected):
        expected = bytes.fromhex(expected)
        offset, raw = cover(address, len(expected))
        assert raw == expected, (hex(address), raw.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(raw))

    callbacks = {}
    for action, target in (
        (0, 0x40a188), (1, 0x40a262), (3, 0x40a719), (4, 0x40a813), (11, 0x40a325),
        (24, 0x40a6b9), (27, 0x40dc2a), (35, 0x40e79b), (39, 0x40e978), (42, 0x40e9e1),
        (62, 0x40f5c9), (71, 0x40f505), (72, 0x40f4de), (113, 0x411e8f), (232, 0x417e59),
    ):
        address = 0x419434 + action * 4
        offset, raw = cover(address, 4)
        assert unpack('<I', raw)[0] == target
        callbacks[str(action)] = dict(address=hex(address), file_offset=offset, target=hex(target))

    actions = {}
    for role, entries in {
        'protected': [(0x424163, 0), (0x424173, 27), (0x42419b, 71), (0x4241ab, 72),
                      (0x4241be, 62), (0x4241ce, 1)],
        'first_protected_return': [(0x4248e1, 11)],
        'guard_approach': [(0x4240e5, 4), (0x4240f5, 42), (0x424108, 71), (0x424138, 72)],
        'zero_guard_return': [(0x42420b, 35), (0x42421e, 71), (0x42422e, 72),
                              (0x4242c2, 3), (0x4242e6, 72), (0x4242fe, 11)],
    }.items():
        actions[role] = [dict(**verify(address, f'6a{action:02x}'), action=action) for address, action in entries]

    operands = [verify(address, raw) for address, raw in (
        (0x4248ab, '2500020000'), (0x424fd2, 'f6c402'), (0x424200, '85c0'), (0x424202, '7513'),
        (0x4242b3, '85c0'), (0x4242b5, '7553'), (0x4242b9, '7c3c'),
        (0x4242d2, '6a006a006a005550'), (0x425115, '68e8000000'),
        (0x4234e4, '83f832'), (0x4234e9, 'b814000000'), (0x4234ef, '83f833'), (0x4234f4, 'b815000000'),
        (0x436c30, '8b5164'), (0x436c34, '89542414'), (0x436c63, '81ffff000000'),
        (0x436c8c, 'f7c610100000'), (0x436c94, '3bfd'), (0x436ca5, 'f7c600008000'),
        (0x436cd5, '8bc3'), (0x436cdd, '83c8ff'),
        (0x40a741, '8b54291c'), (0x40a86b, '83f808'), (0x40e9ef, '8b4c281c'),
        (0x40a262, 'c783a402000064000000'), (0x40a438, '83f805'), (0x40a43b, '7d15'),
        (0x40a441, 'd95b40'), (0x40a447, 'd95b44'), (0x40f50e, '8b54291c'),
        (0x434a41, '41'), (0x434a5c, '89422c'), (0x434b75, '46'), (0x434b78, '89b09c0c0000'),
    )]
    calls = []
    for address, target in (
        (0x4248da, 0x423fa0), (0x4248ec, 0x434990), (0x424ff7, 0x423fa0),
        (0x42403e, 0x434a90), (0x424154, 0x434a90), (0x42418f, 0x434a90),
        (0x425123, 0x434990), (0x42545a, 0x436c20), (0x4257b4, 0x436c20), (0x425cdf, 0x436c20),
        (0x4257d5, 0x4241f0), (0x425d11, 0x4241f0), (0x4242c6, 0x434990),
        (0x4242da, 0x434af0), (0x4242ea, 0x434990), (0x436c59, 0x4234e0), (0x436c76, 0x4234e0),
        (0x40a74e, 0x419e90), (0x40a848, 0x419e90), (0x40a863, 0x419fd0),
        (0x40e9fb, 0x419e90), (0x40ea01, 0x434a30),
        (0x40a41d, 0x419ba0), (0x40a430, 0x419fa0), (0x40a44a, 0x434a30),
        (0x40f4df, 0x434b60), (0x40f4e5, 0x434a30), (0x40f51a, 0x434a30), (0x40f520, 0x434a30),
        (0x40f5d4, 0x434a30),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    prior = identity(HERE.parent / 'game-legacy-battle-guard-wait-v1/source-check.json')
    assert prior['sha256'] == 'f2dd7b018a552f08c29af0243c3ca69d5def8c6766f052609cb6da5d04a6440d'
    result = dict(stage=258, source=identity(NETWORK['TARGET']), evidence=identity(bundle), closure=identity(closure),
                  prior=prior, rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, references=references,
                  callbacks=callbacks, actions=actions, operands=operands, calls=calls,
                  limits=dict(native_repeated_protected_body_replayed=False, native_departure_replayed=False,
                              current_consumer_verified=False), original_execution=0, VM_actions=0, official_sessions=0)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print({key: len(result[key]) for key in ('memory', 'references', 'callbacks', 'actions', 'operands', 'calls')})


if __name__ == '__main__':
    main()
