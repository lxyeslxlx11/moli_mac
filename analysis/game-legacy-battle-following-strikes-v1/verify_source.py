"""Check the later pair loop, per-body waits, and charge anchors against the retained PE and REA bundle."""

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
    assert len(memory) == 33 and len(references) == 3
    assert references['0x42470d']['addresses'] == ['0x425fb3']
    calls_to_append = references['0x434990']['addresses']
    assert len(calls_to_append) == 935
    assert {'0x42471a', '0x424737', '0x424749', '0x424882', '0x424f41', '0x425294'} <= set(calls_to_append)
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
        (0, 0x40a188), (3, 0x40a719), (14, 0x40c7e8), (24, 0x40a6b9), (26, 0x40d9aa),
        (71, 0x40f505), (72, 0x40f4de), (113, 0x411e8f), (157, 0x4129e4),
        (232, 0x417e59), (242, 0x4192dd), (243, 0x419301),
    ):
        address = 0x419434 + action * 4
        offset, raw = cover(address, 4)
        assert unpack('<I', raw)[0] == target
        callbacks[str(action)] = dict(address=hex(address), file_offset=offset, target=hex(target))

    actions = {}
    for name, entries in {
        'charged_strike': [(0x42470f, 24), (0x42472c, 3), (0x42473e, 113), (0x424874, 242), (0x424f36, 14)],
        'ordinary_approach': [(0x4247f7, 7), (0x424828, 9), (0x424844, 10)],
        'receiver_wait': [(0x425289, 0)],
        'turn': [(0x4242c2, 3), (0x4242e6, 72)],
    }.items():
        actions[name] = [dict(**verify(address, f'6a{action:02x}' if action < 128 else f'68{action:02x}000000'), action=action)
                         for address, action in entries]

    operands = [verify(address, raw) for address, raw in (
        (0x425e97, '817c2458ff000000'), (0x425eb4, '3dff000000'), (0x425ebd, '8907'),
        (0x425ec5, '8b0c85c4fa5800'), (0x425ecc, '85c9'),
        (0x425f2e, '8902'), (0x425f30, '8b0c85c4fa5800'), (0x425f37, '85c9'),
        (0x425f54, 'f7c300008000'), (0x425f9b, '40'), (0x425fa0, '83c8ff'), (0x425fa3, '89442450'),
        (0x425fb3, 'e955e7ffff'), (0x424726, 'a810'), (0x42475a, 'f6c410'), (0x424a34, '0f85d8040000'),
        (0x4349a3, '89886c100000'), (0x4349af, '41'), (0x4349b6, '899488a40c0000'),
        (0x40a6c2, '8b4c2a1c'), (0x40a6da, '8b482c'), (0x40a6dd, '85c9'), (0x40a6df, '0f8591fbffff'),
        (0x40c7fc, '81bbd002000010270000'), (0x434a41, '41'), (0x434a5c, '89422c'), (0x434b75, '46'),
        (0x4242b9, '7c3c'), (0x436c8c, 'f7c610100000'),
        (0x411ec8, 'f6c410'), (0x411ef2, '89bad4020000'), (0x411ef8, '89bbd4020000'),
        (0x411efe, 'c7432c9d000000'), (0x41dc82, 'b940b64100'), (0x41b650, '83f801'),
        (0x41b669, 'c7802410000002000000'), (0x4129fd, '83bd2410000002'),
        (0x412a0a, '89bd24100000'), (0x412a10, '89bbd4020000'),
    )]
    calls = []
    for address, target in (
        (0x425ea6, 0x434670), (0x425eac, 0x4234e0), (0x425f1c, 0x434670), (0x425f22, 0x4234e0),
        (0x425f3c, 0x434670), (0x425f48, 0x434670), (0x42471a, 0x434990), (0x424737, 0x434990),
        (0x424749, 0x434990), (0x42477e, 0x434990), (0x424802, 0x434990), (0x424833, 0x434990),
        (0x424848, 0x434990), (0x424882, 0x434990), (0x42489f, 0x434af0), (0x424f2f, 0x436e60),
        (0x424f41, 0x434990), (0x425294, 0x434990), (0x4257b4, 0x436c20), (0x425cdf, 0x436c20),
        (0x4242da, 0x434af0), (0x4242ea, 0x434990), (0x40a70c, 0x434a30), (0x411ed6, 0x41dc00),
        (0x41b648, 0x4fd5f0), (0x412a1d, 0x434a30),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    prior = identity(HERE.parent / 'game-legacy-battle-repeated-protection-v1/source-check.json')
    assert prior['sha256'] == 'e2d1f36d4710e30393cc2c8ccef9bba666b8216e82986151efa8403086336b39'
    result = dict(stage=259, source=identity(NETWORK['TARGET']), evidence=identity(bundle), closure=identity(closure),
                  prior=prior, rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, references=references,
                  callbacks=callbacks, actions=actions, operands=operands, calls=calls,
                  limits=dict(native_multiple_departure_replayed=False, native_charge_cancellation_replayed=False,
                              current_consumer_verified=False), original_execution=0, VM_actions=0, official_sessions=0)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print({key: len(result[key]) for key in ('memory', 'references', 'callbacks', 'actions', 'operands', 'calls')})


if __name__ == '__main__':
    main()
