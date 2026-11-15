"""Check the fixed PE evidence for the second projectile trip and guard departure."""
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
    closure = PRIVATE / 'rea-closure.json'
    assert ledger['artifacts'][0]['digest']['sha256'] == network['SHA']
    assert json.loads(closure.read_text()) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    windows, references, memory = [], {}, []
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
        memory.append(dict(address=address, file_offset=offset, bytes=count,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        windows.append((int(address, 16), int(address, 16) + count))
    assert len(memory) == 22 and set(references) == {'0x415369', '0x434b90'}
    assert references['0x415369']['addresses'] == ['0x40a174', '0x419798']
    assert len(references['0x434b90']['addresses']) == 18

    def cover(address, size):
        assert any(low <= address and address + size <= high for low, high in windows), hex(address)
        return image.locate(hex(address), size)

    def verify(address, expected):
        raw = bytes.fromhex(expected)
        offset, actual = cover(address, len(raw))
        assert actual == raw, (hex(address), expected, actual.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(raw))

    def branch(address, opcode, target):
        prefix = bytes.fromhex(opcode)
        width = 1 if len(prefix) == 1 and prefix[0] != 0xe9 else 4
        end = address + len(prefix) + width
        raw = prefix + (target - end).to_bytes(width, 'little', signed=True)
        return dict(**verify(address, raw.hex()), target=hex(target))

    callbacks = {}
    for action, target in (
        (0, 0x40a188), (21, 0x40bb3f), (22, 0x40c2e4), (23, 0x40c540), (24, 0x40a6b9),
        (41, 0x40ea0e), (49, 0x40ea47), (71, 0x40f505), (72, 0x40f4de), (216, 0x415027),
        (217, 0x415369), (232, 0x417e59),
    ):
        address = 0x419434 + action * 4
        offset, raw = cover(address, 4)
        assert unpack('<I', raw)[0] == target
        callbacks[str(action)] = dict(address=hex(address), file_offset=offset, target=hex(target))

    operands = [verify(address, raw) for address, raw in (
        (0x40c3bc, '83f83c'), (0x40c3cf, '83782c0f'), (0x40c3e1, '83782c17'), (0x40c412, '3d0a010000'),
        (0x40c423, 'c786f00f000000000000'), (0x40c42d, '8b869c0c0000'), (0x40c433, '83c002c1e004'),
        (0x40c439, '8b0c30f6c502'), (0x40c466, '8b4c301c'), (0x40c481, '8b0c85c4fa5800'),
        (0x40c488, '8b412c85c0'), (0x40c48f, '6a18'), (0x40c49b, '6a47'), (0x40c4a4, '6a18'),
        (0x40c4ad, '68d9000000'), (0x40c4ba, 'c7434800002041'), (0x40c4d6, '83f814'),
        (0x40c501, '81bc88a80c0000d8000000'), (0x41536f, '6800002041'), (0x415379, '8b442a1c'),
        (0x4153a9, '83f814'), (0x4153b2, '81bd3c1000000a010000'),
        (0x4153d9, 'c782f00f000000000000'), (0x415403, 'c7432c15000000'),
        (0x41541b, 'd80520d45200'), (0x415434, 'd8251cd45200'), (0x415440, 'd80dfcd35200'),
        (0x415458, 'd8051cd45200'), (0x40ea4a, 'c70485c4fa580000000000'), (0x434ba8, '85d2'),
        (0x434be3, '83b8d80f000001'), (0x434c46, '3d201c0000'), (0x43515b, '880c30'),
        (0x425115, '68e8000000'), (0x42fbb6, '68d8000000'),
    )]
    branches = [branch(address, opcode, target) for address, opcode, target in (
        (0x40c3bf, '0f8d', 0x41549a), (0x40c3d3, '75', 0x40c3de), (0x40c3e5, '0f84', 0x40c4c9),
        (0x40c417, '0f85', 0x40c4c9), (0x40c43f, '0f84', 0x40c4c9), (0x40c48d, '74', 0x40c49b),
        (0x40c4d9, '0f8d', 0x41549a), (0x40c50c, '75', 0x40c51a), (0x4153ac, '0f8d', 0x41549a),
        (0x4153bc, '0f85', 0x41547f), (0x434baa, '74', 0x434c23), (0x434bea, '74', 0x434c37),
        (0x434c4b, '7e', 0x434ca9),
    )]
    calls = []
    for address, target in (
        (0x40c3b4, 0x419fd0), (0x40c3d6, 0x434a30), (0x40c404, 0x434a30),
        (0x40c449, 0x434b60), (0x40c452, 0x434a30), (0x40c46c, 0x434af0),
        (0x40c493, 0x434990), (0x40c49f, 0x434990), (0x40c4a8, 0x434990),
        (0x40c4b4, 0x434990), (0x40c4c1, 0x434a30), (0x40c512, 0x434a30),
        (0x415386, 0x419e90), (0x4153a1, 0x419fd0), (0x4153f8, 0x434a30),
        (0x4153fe, 0x434b60), (0x415413, 0x419e90), (0x41549b, 0x419ba0), (0x4154a3, 0x4fd5f0),
        (0x40f51a, 0x434a30), (0x40f520, 0x434a30), (0x40ea56, 0x40a090),
        (0x434c6d, 0x4348e0), (0x434c8b, 0x434a70), (0x42510e, 0x434af0), (0x425123, 0x434990),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    constants = {}
    for address, value in ((0x52d3a8, -180), (0x52d3fc, 0.5), (0x52d41c, 360), (0x52d420, 180)):
        offset, raw = cover(address, 4)
        assert unpack('<f', raw)[0] == value
        constants[hex(address)] = dict(file_offset=offset, value=value)
    prior = identity(HERE.parent / 'game-legacy-battle-guard-release-v1/source-check.json')
    assert prior['sha256'] == '6d173c12752e4d533e2de06578f499c5c3d58dcc9d5af8bccafd5a6417f9728e'
    result = dict(stage=254, source=identity(network['TARGET']), evidence=identity(bundle),
                  prior=prior, closure=identity(closure), rea='6.7.0', provider='Ghidra 12.1.4',
                  memory=memory, references=references, callbacks=callbacks,
                  operands=operands, branches=branches, calls=calls, constants=constants,
                  current_parent_tuple_flags_offset=2 * 16,
                  guard_child_actions=[71, 24, 217], optional_first_wait=24,
                  limits=dict(original_execution_replayed=False, same_caster_alias_complete=False,
                              non_guarded_216_catch_timing_verified_in_port=False),
                  original_execution=0, VM_actions=0, official_sessions=0)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print({key: len(result[key]) for key in ('memory', 'references', 'callbacks', 'operands', 'branches', 'calls', 'constants')})


if __name__ == '__main__':
    main()
