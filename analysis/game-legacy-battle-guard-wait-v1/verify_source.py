"""Check guard and nested result anchors against the retained PE and REA bundle."""

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
    assert len(memory) == 23 and len(references) == 3
    assert references['0x423fa0']['addresses'] == ['0x4248da', '0x4249cf', '0x424ff7']
    assert references['0x4241f0']['addresses'] == ['0x425690', '0x4257d5', '0x425d11']
    assert {'0x40f51a', '0x40f520', '0x40f5d4'} <= set(references['0x434a30']['addresses'])

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
        (0, 0x40a188), (1, 0x40a262), (4, 0x40a813), (24, 0x40a6b9), (27, 0x40dc2a),
        (35, 0x40e79b), (39, 0x40e978), (42, 0x40e9e1), (62, 0x40f5c9), (71, 0x40f505),
        (72, 0x40f4de), (232, 0x417e59),
    ):
        address = 0x419434 + action * 4
        offset, raw = cover(address, 4)
        assert unpack('<I', raw)[0] == target
        callbacks[str(action)] = dict(address=hex(address), file_offset=offset, target=hex(target))

    actions = {}
    for role, entries in {
        'caster': [(0x423fb3, 72), (0x423fdf, 24), (0x423fef, 71), (0x423fff, 0), (0x424012, 24)],
        'guard_approach': [(0x424022, 0), (0x42404a, 39), (0x42406a, 78), (0x424094, 67), (0x4240b5, 34),
                           (0x4240c5, 73), (0x4240d5, 7), (0x4240e5, 4), (0x4240f5, 42), (0x424108, 71),
                           (0x424118, 10), (0x424128, 74), (0x424138, 72)],
        'protected': [(0x424163, 0), (0x424173, 27), (0x42419b, 71), (0x4241ab, 72),
                      (0x4241be, 62), (0x4241ce, 1)],
        'guard_return': [(0x42420b, 35), (0x42421e, 71), (0x42422e, 72), (0x4242a3, 38), (0x4242fe, 11)],
    }.items():
        actions[role] = [dict(**verify(address, f'6a{action:02x}'), action=action) for address, action in entries]

    operands = [verify(address, raw) for address, raw in (
        (0x4248ab, '2500020000'), (0x424fd2, 'f6c402'), (0x425115, '68e8000000'),
        (0x424200, '85c0'), (0x424202, '7513'), (0x4242b3, '85c0'),
        (0x4349af, '41'), (0x4349b6, '899488a40c0000'), (0x434aa5, 'c1e104'),
        (0x434aa8, '8954011c'), (0x434ad9, 'c744012cffffffff'), (0x434ae7, '41'),
        (0x434a41, '41'), (0x434a5c, '89422c'), (0x434a60, 'c7422ce7000000'),
        (0x434b75, '46'), (0x434b78, '89b09c0c0000'), (0x434b7e, 'c1e104'),
        (0x40a262, 'c783a402000064000000'), (0x40a276, 'c783b002000000000000'),
        (0x40a287, '0f8505f10000'), (0x40a298, 'e9f5f00000'),
        (0x40f50e, '8b54291c'), (0x40f512, '8b0495c4fa5800'), (0x40f5ca, 'c783b002000000000000'),
        (0x417e7a, 'be10000000'), (0x417e81, '7d3a'), (0x417eb4, '83f814'),
        (0x417ed0, '8b54291c'), (0x417eda, '8b3495c4fa5800'),
    )]
    calls = []
    for address, target in (
        (0x4248da, 0x423fa0), (0x424ff7, 0x423fa0),
        (0x42403e, 0x434a90), (0x42413c, 0x434990), (0x424154, 0x434a90), (0x42418f, 0x434a90),
        (0x425690, 0x4241f0), (0x4257d5, 0x4241f0), (0x425d11, 0x4241f0),
        (0x42420f, 0x434990), (0x424222, 0x434990), (0x424232, 0x434990),
        (0x42510e, 0x434af0), (0x425123, 0x434990), (0x417eac, 0x419fd0),
        (0x40a290, 0x4fd5f0), (0x40f4df, 0x434b60), (0x40f4e5, 0x434a30),
        (0x40f51a, 0x434a30), (0x40f520, 0x434a30), (0x40f5d4, 0x434a30),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    prior = identity(HERE.parent / 'game-legacy-battle-skl113-wire-v1/source-check.json')
    assert prior['sha256'] == '893b1b91dfa730348205839b73404af522e5753c3ceee5a40f8f092f9842c458'
    result = dict(stage=257, source=identity(NETWORK['TARGET']), evidence=identity(bundle), closure=identity(closure),
                  prior=prior, rea='6.7.0', provider='Ghidra 12.1.4', memory=memory, references=references,
                  callbacks=callbacks, actions=actions, operands=operands, calls=calls,
                  limits=dict(native_callback_order_replayed=False, native_shared_guard_queue_reordered=False,
                              same_protected_slot_resolved=False), original_execution=0, VM_actions=0, official_sessions=0)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print({key: len(result[key]) for key in ('memory', 'references', 'callbacks', 'actions', 'operands', 'calls')})


if __name__ == '__main__':
    main()
