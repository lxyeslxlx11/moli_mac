"""Cross-check retained REA coordinates and the legacy file digest against private PE bytes."""
from hashlib import md5, sha256
from math import sin
from pathlib import Path
import json
import re
import struct


ROOT = Path(__file__).resolve().parents[2]
ANALYSIS = Path(__file__).resolve().parent
PRIVATE = ROOT / 'build/analysis' / ANALYSIS.name


def identity(path):
    data = path.read_bytes()
    return dict(path=str(path.relative_to(ROOT)), bytes=len(data), sha256=sha256(data).hexdigest())


class Image:
    def __init__(self, relative_path, length, digest):
        self.path = ROOT / relative_path
        self.data = self.path.read_bytes()
        assert len(self.data) == length and sha256(self.data).hexdigest() == digest
        assert self.data[:2] == b'MZ'
        header = struct.unpack_from('<I', self.data, 0x3c)[0]
        assert self.data[header:header + 4] == b'PE\0\0'
        machine, count = struct.unpack_from('<HH', self.data, header + 4)
        optional_size, magic = struct.unpack_from('<H2xH', self.data, header + 20)
        assert (machine, magic) == (0x14c, 0x10b)
        self.base = struct.unpack_from('<I', self.data, header + 52)[0]
        self.sections = {}
        for index in range(count):
            at = header + 24 + optional_size + index * 40
            name, virtual, rva, size, offset = struct.unpack_from('<8sIIII', self.data, at)
            self.sections[name.rstrip(b'\0').decode('ascii')] = dict(
                rva=rva, virtual_size=virtual, raw_size=size, raw_offset=offset)

    def locate(self, address, size):
        rva = int(address, 16) - self.base
        for row in self.sections.values():
            delta = rva - row['rva']
            if 0 <= delta and delta + size <= row['raw_size']:
                offset = row['raw_offset'] + delta
                assert offset + size <= len(self.data)
                return offset, self.data[offset:offset + size]
        raise ValueError(address)

    def call(self, address, target):
        offset, raw = self.locate(address, 5)
        assert raw[0] == 0xe8 and int(address, 16) + 5 + struct.unpack_from('<i', raw, 1)[0] == int(target, 16)
        return dict(call=address, target=target, offset=offset)


def records(name, image, count):
    path = PRIVATE / name
    bundle = json.loads(path.read_text())
    assert len(bundle['records']) == count
    assert bundle['artifacts'][0]['digest']['sha256'] == identity(image.path)['sha256']
    functions = {r['normalized_result']['procedure']['address']: r for r in bundle['records']
                 if r['operation'] == 'analyze_function' and r['normalized_result']['procedure']['body']['available']}
    return path, bundle['records'], functions


def literals(line):
    return {(-1 if sign else 1) * int(value, 16) % 2**32
            for sign, value in re.findall(r'(-\s*)?0x([0-9a-f]+)', line)}


def verify_rounds(record, image):
    detail = record['normalized_result']
    body = detail['procedure']['body']
    _, transform = image.locate('0x404310', body['total_bytes'])
    text = detail['pseudocode'].splitlines()
    words = {}
    for line in text:
        match = re.fullmatch(r'\s*(iVar\d+) = (?:\*param_1|param_1\[([0-9a-fx]+)\]);', line)
        if match:
            words[match[1]] = int(match[2], 0) if match[2] else 0
    assert sorted(words.values()) == list(range(16))
    constants = [int(abs(sin(i + 1)) * 2**32) for i in range(64)]
    shifts = [[7, 12, 17, 22], [5, 9, 14, 20], [4, 11, 16, 23], [6, 10, 15, 21]]
    previous = -1
    for index, constant in enumerate(constants):
        assert struct.pack('<I', constant) in transform, index
        positions = [at for at, line in enumerate(text) if constant in literals(line)]
        assert len(positions) == 1 and previous < positions[0], (index, positions)
        previous = positions[0]
        word, = (words[name] for name in re.findall(r'\biVar\d+\b', text[previous]) if name in words)
        round_index = index // 16
        assert word == [index, 5 * index + 1, 3 * index + 5, 7 * index][round_index] % 16
        source = re.match(r'\s*(\w+) =', text[previous])[1]
        rotation = next(line for line in text[previous + 1:previous + 7] if f'{source} >> ' in line and f'{source} * ' in line)
        right = int(re.search(rf'{source} >> (0x[0-9a-f]+|\d+)', rotation)[1], 0)
        left_factor = int(re.search(rf'{source} \* (0x[0-9a-f]+|\d+)', rotation)[1], 0)
        shift = shifts[round_index][index % 4]
        assert (right, left_factor) == (32 - shift, 1 << shift), index
    return dict(constants=64, word_selections=64, rotations=64, transform_sha256=sha256(transform).hexdigest())


def main():
    legacy = Image('build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe', 1569280,
                   '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd')
    launcher = Image('build/analysis/launcher-current-runtime-v4/POLCN_Launcher.analysis-only.exe', 4111872,
                     'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152')
    packed_launcher = identity(ROOT / 'build/analysis/launcher-current-runtime-v4/POLCN_Launcher.observed-update.exe')
    assert packed_launcher['sha256'] == '6d459ddbdf80a86cf7a1e41b99ab7fb575b42842d7163522efb3c9fa6e6ac987'
    launcher_bundle, _, launcher_functions = records('rea-launcher.json', launcher, 50)
    game_bundle, game_records, game_functions = records('rea-game.json', legacy, 21)
    launcher_entries = ['0x42d830', '0x410c00', '0x40b750']
    game_entries = ['0x457c30', '0x505540', '0x404c40', '0x404150', '0x404230', '0x404310',
                    '0x4041a0', '0x404180', '0x404d30', '0x4f83d0', '0x45cc90', '0x51b1ed']
    assert legacy.locate('0x52d344', 64)[1] == b'\x80' + bytes(63)
    assert legacy.locate('0x52d384', 17)[1] == b'0123456789abcdef\0'
    data = legacy.sections['.data']
    assert data['raw_size'] <= 0x5849c8 - legacy.base - data['rva'] < data['virtual_size']
    assert launcher.locate('0x5d1a54', 12)[1] == b'CGSharedMem\0'
    assert legacy.locate('0x53c9d0', 12)[1] == b'CGSharedMem\0'
    for address in ['0x458013', '0x4eeb2c']:
        assert legacy.locate(address, 5)[1] == b'\x68' + struct.pack('<I', 0xd5d674)
    calls = [launcher.call('0x411555', '0x40b750')]
    calls.extend(legacy.call(a, b) for a, b in [('0x45801d', '0x505540'), ('0x4eeb39', '0x4f83d0'), ('0x505591', '0x404c40'),
                 ('0x5055ce', '0x404d30'), ('0x404c50', '0x404150'), ('0x404cf7', '0x404230'),
                 ('0x404d14', '0x4041a0'), ('0x40420d', '0x404310'), ('0x404218', '0x404180')])
    windows = []
    initial_zero = None
    for record in game_records:
        if record['operation'] != 'read_bytes':
            continue
        row = record['normalized_result']
        assert row['complete'] and row['returned_bytes'] == row['requested_bytes']
        if row['address'] == '0x5849c8':
            assert row['bytes_hex'] == '00'
            initial_zero = dict(address=row['address'], section='.data', file_bytes=False, evidence_id=record['evidence_id'])
            continue
        offset, raw = legacy.locate(row['address'], row['returned_bytes'])
        assert raw.hex() == row['bytes_hex']
        windows.append(dict(address=row['address'], offset=offset, bytes=len(raw), evidence_id=record['evidence_id']))
    assert len(windows) == 7 and initial_zero is not None
    rounds = verify_rounds(game_functions['0x404310'], legacy)
    current = []
    for path, size, digest in [
        ('build/analysis/diagnostic-material-20261026-_9d1ephh/source/app/cg_se_3000.exe', 2904064,
         '9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126'),
        ('build/analysis/launcher-current-entry-v1/variant6000/cg_se_6000.observed-update.exe', 1757184,
         '6e2ff83274561047129ef61cbda8b718e3806f68aeb5d36f3a9b5cd08df60a4a'),
    ]:
        image = Image(path, size, digest)
        section = image.sections['.text']
        assert section['raw_size'] == section['raw_offset'] == 0 and section['virtual_size'] > 0
        current.append(dict(file=identity(image.path), text_section=section))
    file_md5 = md5(legacy.data).hexdigest()
    assert file_md5 == 'c3f48428dc3201dac0747f4e55887ec7'
    closure = PRIVATE / 'rea-closure.json'
    assert json.loads(closure.read_text()) == dict(rea='6.7.0', open=False, cleanup_pending=False)
    result = dict(stage=229, tools=dict(rea='6.7.0', ghidra='12.1.4'),
                  launcher=dict(file=identity(launcher.path), packed_file=packed_launcher, bundle=identity(launcher_bundle), records=50,
                                procedures={a: launcher_functions[a]['evidence_id'] for a in launcher_entries}),
                  legacy=dict(file=identity(legacy.path), bundle=identity(game_bundle), records=21,
                              procedures={a: game_functions[a]['evidence_id'] for a in game_entries},
                              module_file_md5=file_md5, rounds=rounds, byte_windows=windows, initial_zero=initial_zero),
                  direct_calls=calls, current=current, rea_closure=identity(closure),
                  original_executed=False, official_session=False, current_game_consumer='unverified')
    (ANALYSIS / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
    print(f"Verified {len(windows)} byte windows, {len(calls)} calls, {rounds['constants']} digest rounds, {len(current)} current section tables")


if __name__ == '__main__':
    main()
