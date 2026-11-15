"""Independent standard-library streaming verification;never loads a full bank into memory."""
from pathlib import Path
from hashlib import sha256
import json
import zipfile

P = Path('build/analysis/game-legacy-resource-archive-v1')
manifest = json.loads((P / 'full-material-pack.json').read_text())
with zipfile.ZipFile(P / 'full-material.zip') as archive:
    assert len(archive.infolist()) == len(manifest['entries']) == 1072
    for row in manifest['entries']:
        entry = archive.getinfo(row['path'])
        assert entry.file_size == row['bytes'] and entry.compress_type == zipfile.ZIP_STORED
        digest = sha256()
        with archive.open(entry) as stream:
            while True:
                data = stream.read(1024 * 1024)
                if not data:
                    break
                digest.update(data)
        assert digest.hexdigest() == row['sha256'], row['path']
result = dict(files=1072, bytes=manifest['content_bytes'], full_content_sha256=True,
              all_CRCs=True, format='ZIP64/stored', source_manifest='full-material-pack.json', original_execution=False)
(P / 'full-material-content-check.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result))
