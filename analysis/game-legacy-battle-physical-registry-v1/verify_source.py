"""Verify the fixed PE's actor registry, reservation and physical guard reads."""
from hashlib import sha256
import json
from pathlib import Path
from runpy import run_path


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
startup = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
network = run_path(str(HERE.parent / 'game-legacy-network-v1/verify_source.py'))


def main():
    image = startup['Image'](network['TARGET'], 1569280, network['SHA'])
    identity = startup['identity']
    bundle = PRIVATE / 'rea-evidence.json'
    data = json.loads(bundle.read_text())
    assert data['artifacts'][0]['digest']['sha256'] == network['SHA']
    assert json.loads((PRIVATE / 'rea-closure.json').read_text()) == {
        'open': False, 'cleanup_pending': False, 'rea': '6.7.0',
    }
    memory, references, windows = [], {}, []
    for record in data['records']:
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
    assert len(memory) == 32 and len(references) == 4
    assert references['0x423fa0']['addresses'] == ['0x4248da', '0x4249cf', '0x424ff7']
    assert references['0x435000']['addresses'] == ['0x435dc2']
    assert references['0x40ea47']['addresses'] == ['0x40a174', '0x4194f8']
    registry = references['0x58fac4'].pop('addresses')
    selected = ['0x40ea4a', '0x424043', '0x4294ea', '0x42f0e3', '0x42f928', '0x433dcb', '0x43464a', '0x4347e8', '0x434ba1']
    assert len(registry) == 2244 and all(address in registry for address in selected)
    references['0x58fac4'].update(total=len(registry), selected=selected)

    def check(address, expected):
        expected = bytes.fromhex(expected)
        assert any(lo <= address and address + len(expected) <= hi for lo, hi in windows), hex(address)
        offset, actual = image.locate(hex(address), len(expected))
        assert actual == expected, (hex(address), expected.hex(), actual.hex())
        return dict(address=hex(address), file_offset=offset, bytes=len(expected))

    def branch(address, opcode, target):
        prefix = bytes.fromhex(opcode)
        width = 1 if len(prefix) == 1 and prefix[0] != 0xe9 else 4
        end = address + len(prefix) + width
        return dict(**check(address, (prefix + (target - end).to_bytes(width, 'little', signed=True)).hex()), target=hex(target))

    operands = [check(address, raw) for address, raw in (
        (0x433cec, 'a820'), (0x433d9f, '83fd16'), (0x433db3, '0bc8'), (0x433dcb, '8904adc4fa5800'),
        (0x43458c, 'bfc4fa5800'), (0x43459a, '85d3'), (0x43464a, 'c70700000000'), (0x434654, '81ff1cfb5800'),
        (0x428ccc, '6a42'), (0x428cfc, '6a4e'), (0x428d2b, '6a0d'), (0x428d4b, '6a31'),
        (0x40a174, 'ff248d34944100'), (0x419434 + 49 * 4, '47ea4000'),
        (0x40ea47, '8b4518'), (0x40ea4a, 'c70485c4fa580000000000'),
        (0x4234e9, 'b814000000'), (0x4234f4, 'b815000000'),
        (0x4350c2, 'f6c702'), (0x4350da, '880c30'), (0x435d30, 'fe0437'),
        (0x435d7b, 'f6c702'), (0x435d93, '880c30'),
        (0x436599, '8a4c0410'), (0x4365a9, '8a98708b5900'), (0x4365b3, '8888708b5900'),
        (0x4368ef, '85d0'), (0x4347e8, '8b14adc4fa5800'), (0x4347ef, '3bd1'),
        (0x434ba1, '8b14b5c4fa5800'), (0x434ba8, '85d2'), (0x434c30, 'b801000000'),
        (0x4248ab, '2500020000'), (0x424944, '85c0'), (0x4249a4, 'f6c402'), (0x424fd2, 'f6c402'),
        (0x42401b, '8b0cbdc4fa5800'), (0x424043, '8b0cbdc4fa5800'), (0x42404c, '8b510c'),
        (0x4294ea, '8b0485c4fa5800'), (0x4294f4, '8b480c'), (0x429524, '85c0'),
        (0x42f0e3, '8b1485c4fa5800'), (0x42f0fa, '8b420c'), (0x42f143, '3bc7'),
        (0x42f572, '89442430'), (0x42f57e, '895c2438'), (0x42f5c1, 'f6c702'), (0x42f5d5, '8bf0'),
        (0x42f882, '837c244402'), (0x42f88d, '813da08b59000a010000'), (0x42f8a1, '85c0'),
        (0x42f8ef, 'f6c402'), (0x42f928, '8b0cb5c4fa5800'), (0x42f936, '8b510c'),
        (0x42f939, '89820c100000'), (0x434994, '85c0'), (0x434a94, '85c0'),
    )]
    branches = [branch(address, op, target) for address, op, target in (
        (0x433cf3, '0f85', 0x434663), (0x433dc2, '75', 0x433dda), (0x43459c, '0f85', 0x434650),
        (0x43465a, '0f8c', 0x434591), (0x4365b1, '75', 0x4365c1), (0x4347f1, '0f84', 0x4348db),
        (0x434baa, '74', 0x434c23), (0x4248b4, '74', 0x4248ff), (0x424946, '0f84', 0x425fb9),
        (0x4249a7, '0f84', 0x424a2f), (0x424fd5, '74', 0x425039),
        (0x429526, '75', 0x429536), (0x42f145, '75', 0x42f155),
        (0x42f56f, '75', 0x42f5dc), (0x42f5c4, '74', 0x42f54a), (0x42f5d7, 'e9', 0x42f54a),
        (0x42f887, '0f85', 0x42fd64), (0x42f897, '0f85', 0x42fd1b), (0x42f8a3, '0f8c', 0x42fd1b),
        (0x42f8f2, '0f84', 0x42fb26), (0x434996, '74', 0x4349d8), (0x434a96, '74', 0x434aee),
    )]
    calls = [image.call(hex(a), hex(target)) for a, target in (
        (0x433ce7, 0x433bd0), (0x433dc5, 0x433a10), (0x433dd2, 0x4348e0), (0x434642, 0x40a090),
        (0x428c45, 0x4234e0), (0x428cc1, 0x434990), (0x428cf1, 0x434990), (0x428d21, 0x434990),
        (0x428d36, 0x434990), (0x428d4f, 0x434990), (0x428d62, 0x434a70), (0x40ea56, 0x40a090),
        (0x4350cd, 0x4234e0), (0x435d26, 0x4234e0), (0x435d86, 0x4234e0), (0x435dc2, 0x435000),
        (0x436586, 0x4351d0), (0x43672c, 0x436500), (0x4367f1, 0x436880), (0x4368f4, 0x4347e0),
        (0x43665a, 0x434b90), (0x4248da, 0x423fa0), (0x4249cf, 0x423fa0), (0x424ff7, 0x423fa0),
        (0x424026, 0x434990), (0x42403e, 0x434a90), (0x429529, 0x436930), (0x42f148, 0x436930),
        (0x42f5c7, 0x434670), (0x42f5cd, 0x4234e0), (0x42f87a, 0x436930),
        (0x42f903, 0x434990), (0x42f923, 0x434a90),
    )]
    assert all(any(lo <= int(row['call'], 16) and int(row['call'], 16) + 5 <= hi for lo, hi in windows) for row in calls)
    prior = HERE.parent / 'game-legacy-battle-physical-missing-v1/source-check.json'
    departure = HERE.parent / 'game-battle-shared-storage-v1/actor-transitions-source-check.json'
    assert identity(prior)['sha256'] == 'bebb285effd27afd90cb30f54450dd49facb133c63b85ea43087dca94d06ae8b'
    assert identity(departure)['sha256'] == 'd9581759a6398ade00e39fe369c76cd02ca7275f3a78d544d2445e6b8f1fd54c'
    positive = json.loads(prior.read_text())['dispatch']['list_categories']
    assert len(positive) == 27 and 73 in positive and 72 not in positive and 113 not in positive
    result = dict(stage=251, source=identity(image.path), evidence=identity(bundle), previous=identity(prior),
                  departure=identity(departure), rea='6.7.0', provider='Ghidra 12.1.4', session_closed=True,
                  memory=memory, references=references, operands=operands, branches=branches, calls=calls,
                  positive_categories=positive,
                  contract=dict(
                      registry='Non-ending C creates listed slots and clears unlisted slots. PLV queues action 49, which zeroes the acting slot.',
                      reservation='M counts physical dependencies by decoded slot. The reservation check consults counts, while reset and wait skip null bodies.',
                      pair_guard='The 4248da pair, 4249cf chain and 424ff7 nested calls reach 42404c after null-tolerant queue helpers.',
                      positive_caster='The related 4294f4 and general 42f0fa entry dereferences precede the later null checks.',
                      saved_self_guard='42f576..42f5d7 replaces the saved self result, including its optional guard slot, without looking up the guard. Only SKL266 variant 2 uses a flagged saved guard at 42f936.',
                      portable='Skip an owned record before body writes when a body needed by those reads is absent. An overwritten or unused saved guard is still reserved but does not need a live body.',
                  ), original_execution=0, VM_actions=0, official_sessions=0)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print({key: len(result[key]) for key in ('memory', 'references', 'operands', 'branches', 'calls', 'positive_categories')})


if __name__ == '__main__':
    main()
