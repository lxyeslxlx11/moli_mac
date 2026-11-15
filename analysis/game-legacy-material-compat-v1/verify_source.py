"""Recheck retained REA anchors and exact local corpus identity without opening a new native session."""
from pathlib import Path
from hashlib import sha256
import json
import struct

A = Path('analysis/game-legacy-material-compat-v1')
P = Path('build/analysis/game-legacy-material-compat-v1')


def identity(p):
    p = Path(p)
    h = sha256()
    with p.open('rb') as stream:
        for b in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(b)
    return dict(path=str(p), bytes=p.stat().st_size, sha256=h.hexdigest())


old = json.loads(Path('analysis/game-resource-runtime-v1/source-check.json').read_text())
source = Path(old['source']['path'])
assert identity(source) == old['source']
raw = source.read_bytes()
pe = struct.unpack_from('<I', raw, 60)[0]
count, optional_size = struct.unpack_from('<H', raw, pe + 6)[0], struct.unpack_from('<H', raw, pe + 20)[0]
optional = pe + 24
image_base = struct.unpack_from('<I', raw, optional + 28)[0]
sections = []
for ordinal in range(count):
    at = optional + optional_size + ordinal * 40
    virtual_size, rva, file_size, offset = struct.unpack_from('<IIII', raw, at + 8)
    sections.append((rva, file_size, offset))


def locate(address, length=1):
    rva = int(address, 16) - image_base
    for start, size, offset in sections:
        if start <= rva and rva + length <= start + size:
            return offset + rva - start
    raise AssertionError(address)


for row in old['byte_and_mapping_checks']:
    assert locate(row['address'], row.get('bytes', 1)) == row['offset']
    if 'bytes' in row:
        assert sha256(raw[row['offset']:row['offset'] + row['bytes']]).hexdigest() == row['sha256']
assert len(old['byte_and_mapping_checks']) == 31
for row in old['artifacts']:
    assert identity(row['path']) == row
catalog = json.loads(Path('analysis/game-resource-runtime-v1/resource-path-catalog.json').read_text())


def literal(address):
    at = locate(address)
    return raw[at:raw.index(0, at)].decode('ascii')


assert literal('0x53cc1c') == catalog['base'] == 'Bin'
assert literal('0x53351c') == catalog['join_format'] == '%s\\%s'
assert literal('0x5331ac') == catalog['integer_format'] == '%d'
for i, key in enumerate(['graphic', 'graphicInfo', 'animation', 'animationInfo', 'coordinate', 'coordinateInfo']):
    assert catalog['defaults'][key] == [literal(hex(0x536f2c + (i * 7 + group) * 128)) for group in range(7)]
archive_source = json.loads(Path('analysis/game-legacy-resource-archive-v1/source-check.json').read_text())
archive = archive_source['actual_material']['archive']
assert identity(archive['path']) == archive
profile = json.loads((A / 'material-profile.json').read_text())
assert len(profile['files']) == 27
manifest = json.loads(Path('build/analysis/game-legacy-resource-archive-v1/full-material-pack.json').read_text())
assert not any(r['path'].lower() == 'bin/puk2/cutdat/23.cut' for r in manifest['entries'])
refs = ['analysis/game-resource-runtime-v1/source-check.json', 'analysis/game-resource-runtime-v1/implementation-spec.json',
        'analysis/game-resource-runtime-v1/resource-path-catalog.json', 'analysis/game-legacy-render-v1/source-check.json',
        'analysis/game-legacy-animation-v1/source-check.json', 'analysis/game-legacy-battle-audio-v1/source-check.json',
        'analysis/game-legacy-resource-archive-v1/source-check.json']
result = dict(stage=290, source=old['source'], tools=old['tools'], reference_contracts=[identity(p) for p in refs],
    retained_REA_artifacts=old['artifacts'], byte_and_mapping_checks=31, original_filename_literals=42,
    archive=archive, profile=identity(A / 'material-profile.json'),
    facts=['The exact37c4 module,retained REA evidence and31 byte/file mappings remain unchanged;the42 default filename literals match the PE.',
        'Explicit numeric suffixes select27 supplied local files across seven slots;optional V2 is absent.The choices do not establish a server version.',
        'The supplied material has no bin/PUK2/cutdat/23.cut.The authored checksumMode1 scene fails with required-file status;the independently declared checksumMode0 scene renders and moves.',
        'All641666 GraphicInfo rows and850000 lookup/metadata slots compare against an independent Python model;510 same-group index overwrites retain the last record,no cross-group overwrite was observed.',
        'The selected physical RD records and final catalog slots are distinct checks;repeated index259166 in GraphicInfoEx selects the last offset943307559,length244878.'],
    observations=['144 actual RD pixel buffers and136 resource-library renders match the Python raster;8 reserved indices below1000 are tested through the sprite API,not the ordinary draw-plan domain.',
        '36 actual animation definitions,16280 frames and260 WAVE files compare independently.No original image/audio files enter analysis outputs.'],
    unverified=['Complete resource-version equivalence,missing CUT materials,other maps/consumers and complete application scheduling.',
        'Actual WeChat file/audio APIs,physical phones and official-account/server acceptance.'],
    new_REA_session=False, source_execution=False, VM_actions=0, official_sessions=0)
(A / 'source-check.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(dict(stage=290, checks=31, filename_literals=42, profile_files=27, archive_identity=True)))
