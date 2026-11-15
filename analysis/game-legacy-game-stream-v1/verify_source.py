"""Verify the fixed SE6000 idle sender against the private PE and exported REA evidence."""
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
    bundle = PRIVATE / 'rea-evidence.json'
    evidence = json.loads(bundle.read_text())
    assert evidence['artifacts'][0]['digest']['sha256'] == network['SHA']
    assert json.loads((PRIVATE / 'rea-closure.json').read_text()) == {
        'open': False, 'cleanup_pending': False, 'rea': '6.7.0',
    }
    memory, procedures = {}, {}
    for row in evidence['records']:
        assert row['provider']['id'] == 'ghidra' and row['provider']['version'] == '12.1.4'
        result = row['normalized_result']
        if row['operation'] == 'read_bytes':
            address, length = result['address'], result['requested_bytes']
            offset, raw = image.locate(address, length)
            assert result['complete'] and result['returned_bytes'] == length
            assert raw == bytes.fromhex(result['bytes_hex'])
            memory[address] = dict(file_offset=offset, bytes=length, sha256=sha256(raw).hexdigest(), evidence=row['evidence_id'])
        elif row['operation'] == 'procedure_pseudo_code':
            assert result
            procedures[row['parameters']['procedure']] = row['evidence_id']
    assert len(memory) == 14 and set(procedures) == {'0x4edef0', '0x4f8760'}

    anchors = {
        '0x4edf00': '8b2da4d05200',                  # GetTickCount IAT
        '0x4edf11': 'ffd5a3308ed100',                # initial last send
        '0x4edf18': 'a0218ecd0084c0',                # active globals
        '0x4edf25': 'a0348ed10084c0',
        '0x4edf32': 'a0368ed100',
        '0x4edf54': '84c00f851d030000',
        '0x4edf5c': 'a0358ed10084c0',
        '0x4edf6e': '4083e007a32090d100',            # one check in eight
        '0x4ee016': 'c7051c90d10000000000',          # receive-side reset, different cell
        '0x4ee212': '85f67e07ffd5a3308ed100',        # positive send refreshes tick
        '0x4ee24a': '8b0d308ed100',
        '0x4ee251': '81c130750000',                  # +30000 ms
        '0x4ee258': '3bc8731d',                      # unsigned compare, skips equality
        '0x4ee25c': '803d348ed100017514',
        '0x4ee26b': '6878765600',
        '0x4ee39c': '3d00000400',                    # pending native send buffer limit
        '0x4f8765': '68e87b5600',
        '0x518ee0': 'ff251cd35200ff2518d35200ff2514d35200',
        '0x52d0a4': '24151300',
        '0x531524': '6d014765745469636b436f756e7400',
        '0x567678': '6e7200',
        '0x567be8': '33247d00',
    }
    operands = {}
    for address, expected in anchors.items():
        offset, raw = image.locate(address, len(expected) // 2)
        assert raw.hex() == expected, address
        operands[address] = dict(file_offset=offset, bytes=len(raw))
    calls = [image.call(src, dst) for src, dst in (
        ('0x44fc66', '0x4edef0'), ('0x4ee004', '0x518eec'), ('0x4ee20b', '0x518ee0'),
        ('0x4ee040', '0x518ee6'), ('0x4ee231', '0x518ee6'), ('0x4ee271', '0x4f8760'),
        ('0x4ee316', '0x518ee6'), ('0x4ee31b', '0x518f04'), ('0x4f876b', '0x4fcea0'),
        ('0x4f877f', '0x4fcab0'), ('0x4f878e', '0x4fca20'), ('0x4f879f', '0x4fce00'),
    )]
    catalog = json.loads((HERE.parent / 'game-legacy-message-v1/dispatch-catalog.json').read_text())
    assert catalog['source_sha256'] == network['SHA']
    producer = next(row for row in catalog['outgoing'] if row['id'] == 'send-004f8760')
    assert (producer['tag'], producer['tag_address'], producer['fields']) == ('3$}', '0x567be8', ['bytes'])
    previous = HERE.parent / 'game-legacy-network-v1/source-check.json'
    imports = {r['iat']: r['ordinal'] for r in json.loads(previous.read_text())['wsock32_ordinal_imports']}
    assert [imports[key] for key in ('0x52d31c', '0x52d318', '0x52d314')] == [19, 3, 16]
    report = dict(
        stage=243, source=network['info'](image.path), evidence=network['info'](bundle),
        previous=network['info'](previous), rea='6.7.0', provider='Ghidra 12.1.4', session_closed=True,
        memory=memory, procedures=procedures, operands=operands, calls=calls,
        contract=dict(send_tick='0xd18e30', interval_milliseconds=30000, comparison='strict unsigned tick > (last send + 30000)',
                      trigger='active network pump, low 3 bits of counter zero, socket state 1',
                      reset='initial pump and positive send', receive_resets_send_tick=False,
                      operation=producer['id'], tag=producer['tag'], arguments_hex=['6e72'], plain_hex='33247d206e7220'),
        limitations=['Static fixed historical sample. Server behavior and any reply to this message are unverified.',
                     'The native loop uses a wrapped absolute sum and frame cadence. The portable interval uses elapsed unsigned ticks.'],
    )
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(memory)} REA reads, {len(operands)} operands, {len(calls)} calls, {len(procedures)} procedures')


if __name__ == '__main__':
    main()
