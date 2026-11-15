"""Bind nested target and empty projectile boundaries to the fixed PE."""
from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path
from struct import unpack


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
startup = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
network = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))


def main():
    image = startup['Image'](network['TARGET'], 1569280, network['SHA'])
    identity = startup['identity']
    bundle = PRIVATE / 'rea-evidence.json'
    ledger = json.loads(bundle.read_text())
    assert ledger['artifacts'][0]['digest']['sha256'] == network['SHA']
    assert json.loads((PRIVATE / 'rea-closure.json').read_text()) == {
        'open': False, 'cleanup_pending': False, 'rea': '6.7.0',
    }
    memory, references, windows = [], {}, []
    for record in ledger['records']:
        assert record['provider']['id'] == 'ghidra' and record['provider']['version'] == '12.1.4'
        result = record['normalized_result']
        if record['operation'] == 'xrefs':
            references[record['parameters']['address']] = dict(evidence=record['evidence_id'], addresses=result)
            continue
        assert record['operation'] == 'read_bytes'
        address, count = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, count)
        assert result['complete'] and result['returned_bytes'] == count and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=count, sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        windows.append((int(address, 16), int(address, 16) + count))
    assert len(memory) == 41 and len(references) == 3
    assert references['0x425fb9']['addresses'] == ['0x424946', '0x425f3a']
    assert references['0x42f882']['addresses'] == ['0x42f563']
    assert references['0x42fd96']['addresses'] == ['0x42fcfb', '0x42fd19', '0x42fd62']

    def cover(address, count):
        assert any(lo <= address and address + count <= hi for lo, hi in windows), hex(address)
        return image.locate(hex(address), count)

    def check(address, raw):
        expected = bytes.fromhex(raw)
        offset, actual = cover(address, len(expected))
        assert actual == expected, (hex(address), expected.hex(), actual.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(expected))

    def branch(address, opcode, target):
        prefix = bytes.fromhex(opcode)
        width = 1 if len(prefix) == 1 and prefix[0] != 0xe9 else 4
        end = address + len(prefix) + width
        return dict(**check(address, (prefix + (target - end).to_bytes(width, 'little', signed=True)).hex()), target=hex(target))

    callbacks = {}
    for action, target in ((4, 0x40a813), (15, 0x40a873), (18, 0x40b677), (23, 0x40c540), (24, 0x40a6b9),
                           (42, 0x40e9e1), (41, 0x40ea0e), (71, 0x40f505), (72, 0x40f4de), (216, 0x415027), (232, 0x417e59)):
        address = 0x419434 + action * 4
        offset, raw = cover(address, 4)
        assert unpack('<I', raw)[0] == target
        callbacks[str(action)] = dict(address=hex(address), file_offset=offset, target=hex(target))

    operands = [check(address, raw) for address, raw in (
        (0x40a174, 'ff248d34944100'), (0x424b85, '83f848'), (0x424b8e, '83f871'), (0x424f54, '83e501'),
        (0x424f76, '89442464'), (0x424fd2, 'f6c402'), (0x424ffc, '89442478'),
        (0x4250fd, '8b442468'), (0x425115, '68e8000000'), (0x435106, '83f848'), (0x43511e, '8bf8'), (0x43515b, '880c30'),
        (0x417e9f, '8b54291c'), (0x417ea3, '8b0495c4fa5800'), (0x419fd8, 'd94044'),
        (0x417eda, '8b3495c4fa5800'), (0x417ee6, '8b7e0c'), (0x41847d, 'c785f00f000000000000'),
        (0x40a85a, '8b0495c4fa5800'), (0x419ea1, '85c9'), (0x434a34, '85d2'),
        (0x40a6c6, '8b048dc4fa5800'), (0x40a6cd, '85c0'),
        (0x40a8cd, '83f9ff'), (0x40a9c7, '83f8ff'), (0x40b6b3, '83f8ff'),
        (0x40a973, '3d10270000'), (0x40a97e, '3d204e0000'), (0x40aa05, '3d10270000'), (0x40b6f6, '3d10270000'),
        (0x41a938, '8b0495c4fa5800'), (0x41a93f, '8b4820'), (0x41acaa, '8b148dc4fa5800'), (0x41acb1, '8b4a30'),
        (0x40ea0e, '8b4310'), (0x40c54f, '83f814'),
        (0x42f4e6, '6a29'), (0x42faea, '6a29'), (0x42f542, 'c744242cffffffff'), (0x42f559, '3dff000000'),
        (0x42f882, '837c244402'), (0x42f88d, '813da08b59000a010000'), (0x42f8a1, '85c0'),
        (0x42fd25, '6aff'), (0x42fd3a, '6a48'), (0x42fd4f, '6a17'), (0x42fd6e, '6aff'),
        (0x42fb82, '8b4c2448'), (0x42fb86, '8b542470'), (0x42f628, '89442450'), (0x42f63a, '89442414'),
        (0x42fbb6, '68d8000000'), (0x429608, '3dff000000'),
    )]
    branches = [branch(address, op, target) for address, op, target in (
        (0x424b88, '0f84', 0x424f4e), (0x424b91, '0f84', 0x424f4e), (0x424f63, '0f84', 0x425039),
        (0x424fd5, '74', 0x425039), (0x435109, '75', 0x43515e), (0x435146, '74', 0x43515e),
        (0x417e94, '7d', 0x417ebd), (0x419ea3, '0f84', 0x419f5c), (0x434a36, '74', 0x434a67),
        (0x40a8d0, '74', 0x40a94e), (0x40a9ca, '74', 0x40a9e0), (0x40b6b6, '75', 0x40b6d3),
        (0x40ea13, '74', 0x40ea23), (0x40c552, '0f8e', 0x419392), (0x42f563, '0f84', 0x42f882),
        (0x42f887, '0f85', 0x42fd64), (0x42f897, '0f85', 0x42fd1b), (0x42f8a3, '0f8c', 0x42fd1b),
        (0x429612, '0f84', 0x429841),
    )]
    calls = []
    for address, target in (
        (0x435110, 0x434cf0), (0x435116, 0x4234e0), (0x43514e, 0x4234e0),
        (0x424f6a, 0x434670), (0x424f70, 0x4234e0), (0x424ff7, 0x423fa0), (0x42510e, 0x434af0), (0x425123, 0x434990),
        (0x417eac, 0x419fd0), (0x417eed, 0x419e90), (0x418475, 0x434a30),
        (0x40a848, 0x419e90), (0x40a863, 0x419fd0), (0x40e9fb, 0x419e90), (0x40ea01, 0x434a30),
        (0x40f51a, 0x434a30), (0x40f520, 0x434a30), (0x40a95f, 0x434a30), (0x40a9f1, 0x434a30),
        (0x40a98a, 0x41ab20), (0x40aae0, 0x41a8c0), (0x40b6c9, 0x434a30), (0x40b764, 0x41a8c0),
        (0x42f4f1, 0x434990), (0x42faee, 0x434990), (0x42fba1, 0x436e60), (0x42fbbd, 0x434990),
        (0x42fd2f, 0x434a90), (0x42fd45, 0x434990), (0x42fd5a, 0x434990), (0x42fda3, 0x434a70), (0x42984f, 0x434a70),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))
    prior = {name: identity(HERE.parent / directory / 'source-check.json') for name, directory in (
        ('registry', 'game-legacy-battle-physical-registry-v1'), ('nested', 'game-battle-nested-physical-v1'),
        ('self', 'game-battle-self-physical-v1'), ('projectiles', 'game-battle-physical-projectiles-v1'),
    )}
    assert [item['sha256'] for item in prior.values()] == [
        '4761a6cc39b764f44f3c9c2b4ba3b8277b55c9487da31eeabacc692630ea4e1b',
        'ede4058b9609581d1a5b9159824f7ce47cf4ae13367c894ecc09c35943898f7c',
        '4daa622cab5db7c44cd9a708be07f007bc566a28b5f3cc8a680966cd01f523ce',
        '8cdaecd1ce21baee6acdc048701271dd98fb888360ba34d684cdc49a04f5525b',
    ]
    result = dict(stage=252, source=identity(image.path), evidence=identity(bundle), prior=prior,
                  rea='6.7.0', provider='Ghidra 12.1.4', session_closed=True, memory=memory, references=references,
                  callbacks=callbacks, operands=operands, branches=branches, calls=calls,
                  contract=dict(
                      nested='435106 consumes the nested target only for 72 and does not reserve it. The 72/113 producer queues the stored slot, or the guard returned by 423fa0, for action 232.',
                      live_slot='232 needs a live recipient for distance and body writes. Guard 4 uses the protected actor for distance, while 42 and 71 already call null-tolerant helpers.',
                      positive='Generic positive lists retain self words separately. At FF they queue sentinel/72 and variant-2 23, or the final 266 variant-2 self script. Related 73 FF activates its existing queue.',
                      empty_emitter='15 and 18 skip aiming at a sentinel, while animation signals can still call constructors that index the target. 41 uses a child pointer and does not advance itself.',
                      self_RID='The final self script still reads the two foreign RID stack slots. Their values without an earlier foreign RID were not established.',
                      portable='Prequeue nested absence skips the owned record. An already queued 232 with a departed recipient consumes the skipped tuple and releases the action. Empty emitters keep their animation and ordinary settlement without creating a flight or waiting for its child.',
                  ), VM_actions=0, original_execution=0, official_sessions=0)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print({key: len(result[key]) for key in ('memory', 'references', 'callbacks', 'operands', 'branches', 'calls')})


if __name__ == '__main__':
    main()
