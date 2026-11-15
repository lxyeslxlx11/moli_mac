"""Original resource-cache vectors. Standard-library digests/JSON, no official assets."""
from pathlib import Path
import hashlib
import json

HERE = Path(__file__).resolve().parent
source = HERE.parent / 'launcher-v28/original-ui-patch.json'
original = json.loads(source.read_text())
base = {'gameListMd5': hashlib.md5(b'Original resource GameList').hexdigest(),
        'regionListMd5': hashlib.md5(b'Original resource RegionList').hexdigest(),
        'gameOrdinal': 0, 'referenceOrdinal': 1, 'regionOrdinal': 2,
        'gameCodeText': '0011', 'directoryText': 'C:\\Original', 'pathEncoding': 'ascii'}
rows = []
for name, binding, files in [
    ('binary-and-empty', base, [('Bin/base.bin', bytes([0, 1, 255])), ('empty', b'')]),
    ('original-patch-result', {**base, 'directoryText': 'C:\\原创', 'pathEncoding': 'windows-936', 'galaxyOrdinal': 0},
     [(row['path'], bytes.fromhex(row['hex'])) for row in original['expected_files']]),
]:
    rows.append({'name': name, 'binding': binding,
                 'binding_key': json.dumps(binding, ensure_ascii=False, separators=(',', ':')),
                 'files': [{'path': path, 'hex': data.hex(), 'md5': hashlib.md5(data).hexdigest()} for path, data in files],
                 'total_bytes': sum(len(data) for _, data in files)})
with (HERE / 'original-resources.json').open('x') as output:
    json.dump({'schema': 'moli.launcher-v29.original-resource-vectors.v1',
               'source': 'Entirely original files; Python hashlib/JSON reference. Not an official resource-cache format.',
               'reused_original_source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'cases': rows}, output, ensure_ascii=False, indent=2)
    output.write('\n')
