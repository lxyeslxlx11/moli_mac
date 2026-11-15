"""Verify the fixed PE for ordinary input resets and the tile-event clock."""
from pathlib import Path
from runpy import run_path
import json
import struct


HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PRIVATE = ROOT / 'build/analysis' / HERE.name
SOURCE = 'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
SHA = '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
base = run_path(str(HERE.parent / 'game-legacy-startup-materials-v1/verify_source.py'))
identity = base['identity']


def main():
    image = base['Image'](SOURCE, 1569280, SHA)
    evidence_path = PRIVATE / 'rea-evidence.json'
    bundle = json.loads(evidence_path.read_text())
    assert bundle['artifacts'][0]['digest']['sha256'] == SHA and len(bundle['records']) == 125
    assert any(p['id'] == 'ghidra' and p['version'] == '12.1.4' for p in bundle['providers'])
    records = bundle['records']
    functions = {r['normalized_result']['procedure']['address']: r for r in records if r['operation'] == 'analyze_function'}
    entries = ('0x5015a0', '0x45eef0', '0x45ee80', '0x4032a0', '0x403330', '0x44e740', '0x44eb10',
               '0x4e1cf0', '0x4ff080', '0x46ab90', '0x4665b0', '0x460c40', '0x460f20', '0x461940',
               '0x461ac0', '0x461c60', '0x461d00', '0x461e00', '0x462410', '0x4f2bb0', '0x51b669', '0x451a80', '0x451b60')
    calls = [image.call(a, b) for a, b in [
        ('0x50178c', '0x461940'), ('0x501791', '0x45eef0'), ('0x501796', '0x4ff080'), ('0x5017a5', '0x44e740'),
        ('0x460c4a', '0x403330'), ('0x460f3e', '0x403330'), ('0x461c81', '0x451b60'),
        ('0x4f921f', '0x4f2bb0'), ('0x4f2bd5', '0x451a80'), ('0x4f2bdf', '0x451b60'), ('0x44fc4f', '0x451a80')]]
    assert struct.unpack('<I', image.locate('0x538f3c', 4)[1]) == (0x3ae805e7,)
    for address in ('0x561aec', '0x53d8a4'):
        assert image.locate(address, 4)[1] == b'\xff' * 4
    for address, instruction in [('0x460c67', bytes.fromhex('66c7053cf3bf000000')),
                                 ('0x451afd', bytes.fromhex('bf201c0000')),
                                 ('0x451b17', bytes.fromhex('bf2c010000')),
                                 ('0x4f2bc0', bytes.fromhex('890df4837200')),
                                 ('0x4f2c02', bytes.fromhex('a3e8837200'))]:
        assert image.locate(address, len(instruction))[1] == instruction, address
    physical = {'0x501787':39, '0x45f0df':36, '0x460c43':45, '0x461940':20, '0x4ff080':39,
                '0x4f2bb0':88, '0x451a80':87, '0x461c72':35, '0x44e768':41, '0x46ab90':30,
                '0x462483':25, '0x461d6e':27, '0x461e6c':20, '0x538f3c':4, '0x561aec':4, '0x53d8a4':4}
    virtual = {'0x728404':4, '0xf5f170':2, '0xbff338':4, '0xbff358':4, '0xc07890':4, '0xf536b2':2, '0x614678':4}
    mapped, zeros = [], []
    for evidence in records:
        if evidence['operation'] != 'read_bytes':
            continue
        row = evidence['normalized_result']
        address, size = row['address'], row['returned_bytes']
        if {**physical, **virtual}.get(address) != row['requested_bytes']:
            continue
        assert row['complete'] and size == row['requested_bytes']
        item = dict(address=address, bytes=size, evidence_id=evidence['evidence_id'])
        raw = bytes.fromhex(row['bytes_hex'])
        if address in virtual:
            data = image.sections['.data']
            displacement = int(address, 16) - image.base - data['rva']
            assert data['raw_size'] <= displacement and displacement + size <= data['virtual_size'] and raw == bytes(size)
            zeros.append(dict(**item, file_bytes=False))
        else:
            offset, expected = image.locate(address, size)
            assert raw == expected
            mapped.append(dict(**item, file_offset=offset))
    assert len(mapped) == len(physical) and len(zeros) == len(virtual)
    closure = PRIVATE / 'rea-closure.json'
    assert json.loads(closure.read_text()) == dict(rea='6.7.0', open=False, cleanup_pending=False)
    report = dict(stage=232, source=identity(image.path), tools=dict(rea='6.7.0', ghidra='12.1.4'),
                  bundle=identity(evidence_path), closure=identity(closure), records=len(records),
                  functions={address: functions[address]['evidence_id'] for address in entries}, calls=calls,
                  file_windows=mapped, virtual_initializers=zeros,
                  movement=dict(input_guard=0, movement_guard=0, coordination_guard=0, turn_guard=0, action_guard=0,
                                party_mode=0, party_flags=0, arrival_countdown=0, initial_interaction_sequence=0,
                                initial_turn_tick=0),
                  pointer=dict(inactive_dialog_index=-1, initial_request_tick=0xffffffff,
                               action_reset_requires=['0xbff2f8 decoded equal to 0', '0x9257f8 equal to 0', '0x978a4e equal to 0']),
                  event_clock=dict(tag='@Qu', server_seconds_column=1, offset_seconds_column=3, origin=0x3ae805e7,
                                   day_slot_count=24, wall_seconds_per_slot=300, wrap='uint32'),
                  original_execution=False, current_game_consumer='unverified')
    (HERE / 'source-check.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f'{len(mapped)} source windows, {len(calls)} calls, {len(entries)} functions, {len(zeros)} virtual initializers')


if __name__ == '__main__':
    main()
