"""Recheck the casting producer, action dispatch and tuple readers in the fixed PE."""

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
    prior = HERE.parent / 'game-legacy-battle-rid0-flight-v1/source-check.json'
    assert identity(prior)['sha256'] == '10783cfc3a2be5ab96fa146cdc8c5633a7b21592b48781fc4ffd2de4e42f4472'
    assert read(prior)['source'] == source
    bundle = PRIVATE / 'rea-evidence.json'
    closure = PRIVATE / 'rea-closed.json'
    assert read(closure) == {'open': False, 'cleanup_pending': False, 'rea': '6.7.0'}
    ledger = read(bundle)
    assert len(ledger['records']) == 25 and not ledger['unknowns']
    assert ledger['artifacts'][0]['digest']['sha256'] == source['sha256']
    memory, windows, references = [], [], []
    for record in ledger['records']:
        assert record['subject']['digest']['sha256'] == source['sha256']
        assert (record['provider']['id'], record['provider']['version']) == ('ghidra', '12.1.4')
        result = record['normalized_result']
        if record['operation'] == 'xrefs':
            assert record['parameters'] == {'address': '0x4236d0'}
            assert len(set(result)) == 13 and '0x42b00a' in result
            references.append(dict(target='0x4236d0', references=result, evidence=record['evidence_id']))
            continue
        assert record['operation'] == 'read_bytes'
        address, length = result['address'], result['requested_bytes']
        offset, raw = image.locate(address, length)
        assert result['complete'] and result['returned_bytes'] == length and raw.hex() == result['bytes_hex']
        memory.append(dict(address=address, file_offset=offset, bytes=length,
                           sha256=sha256(raw).hexdigest(), evidence=record['evidence_id']))
        start = int(address, 16)
        windows.append((start, start + length))
    assert len({row['address'] for row in memory}) == 24 and len(references) == 1

    def cover(address, length):
        assert any(start <= address and address + length <= stop for start, stop in windows), hex(address)
        return image.locate(hex(address), length)

    operands = []
    for address, expected in (
        # Dispatch and producer
        (0x42949f, '8a90a8384300ff249578384300'), (0x4338bb, '03' * 13), (0x433884, '95a44200'),
        (0x42a4e1, '6a18'), (0x42a535, '6a35'), (0x42a54a, '6a26'), (0x42a560, '6887000000'),
        (0x42a579, '6a3e'), (0x42a682, '3dff000000'), (0x42a68c, '0f84e5050000'),
        (0x42ac7d, '6a006a006aff'), (0x42ac9a, '0f8456030000'), (0x42b016, 'c7415802000000'),
        (0x423e5c, '68dd00000089825c100000'), (0x423e8b, '51506a00508b0250'),
        # Three-cell terminator and four-cell row share the write counter.
        (0x434aa8, '8954011c'), (0x434abc, '891401'), (0x434acc, '89540124'),
        (0x434ad9, 'c744012cffffffff'), (0x434ae7, '418988a00c0000'),
        (0x434b3d, '89540128'), (0x434b4a, 'c744012cffffffff'),
        # Action dispatch and the animation signal range
        (0x41952c, 'c9f54000'), (0x419650, 'b3214100'), (0x4197a8, '18674100'),
        (0x4121dc, '8b83d00200003d10270000'), (0x4121e7, '0f8c3f010000'),
        (0x4121ed, '3d204e00000f8d34010000'), (0x412400, '0f8508010000'),
        (0x41250e, '83f8137c0583f81e7e0583f81f7537'),
        (0x41252a, '83f8ff0f84eafdffff'), (0x412552, 'ebc9'),
        # Completion, tuple advance, action advance and the RID0 slot reads
        (0x412337, '83f801755a'), (0x41233c, '8b43103bc77444'), (0x412382, '83f80175cd'),
        (0x434b6f, '8bb09c0c0000468bce89b09c0c0000'), (0x434b7e, 'c1e1048b74011c83feff'),
        (0x40f5ca, 'c783b002000000000000'), (0x434a3b, '8b88c40f000041'),
        (0x434a48, '8988c40f0000'), (0x416736, '8b78248b7028'),
    ):
        offset, raw = cover(address, len(expected) // 2)
        assert raw.hex() == expected, (hex(address), raw.hex())
        operands.append(dict(address=hex(address), file_offset=offset, bytes=len(raw)))

    calls = []
    for address, target in (
        (0x42a52a, 0x434990), (0x42a540, 0x434990), (0x42a555, 0x434990), (0x42a56e, 0x434990),
        (0x42a584, 0x434990), (0x42a767, 0x434af0), (0x42a78e, 0x436e60), (0x42ac8b, 0x434a90),
        (0x42b004, 0x434a70), (0x42b00a, 0x4236d0), (0x423e7a, 0x434990), (0x423e93, 0x434af0),
        (0x4121d1, 0x41dc00), (0x412544, 0x41dc00), (0x41254a, 0x434b60), (0x41231e, 0x434b60),
        (0x41232f, 0x4fd5f0), (0x412344, 0x40a090), (0x41237a, 0x434b60), (0x41238e, 0x434a30),
        (0x40f5d4, 0x434a30),
    ):
        cover(address, 5)
        calls.append(image.call(hex(address), hex(target)))

    cursors = {}
    for name, target_rows in (('plain', 1), ('empty', 0), ('packed', 5)):
        rows = [10] * target_rows + [-1, 0, -1]
        signal = rows.index(-1) + 1
        completion = rows.index(-1, 1)
        cursors[name] = dict(target_rows=target_rows, cast_terminator=target_rows, rid=signal,
                             signal_at_62=signal, completion_without_signal_at_62=completion)
    assert [(row['signal_at_62'], row['completion_without_signal_at_62']) for row in cursors.values()] == [
        (2, 1), (1, 2), (6, 5)]
    result = dict(stage=268, source=source, evidence=identity(bundle), closure=identity(closure),
                  prior=identity(prior), rea='6.7.0', provider='Ghidra 12.1.4', memory=memory,
                  references=references, operands=operands, calls=calls, synthetic_cursor=cursors,
                  cast_terminator_cells_written=3, cast_terminator_fourth_cell_observed=False,
                  original_runtime_observed=False, no_signal_recovery_observed_in_original=False)
    (HERE / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({key: len(result[key]) for key in ('memory', 'references', 'operands', 'calls')}))


if __name__ == '__main__':
    main()
