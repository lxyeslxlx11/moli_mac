"""Pack an explicitly supplied game root for lazy,read-only resource access."""
from pathlib import Path
from hashlib import sha256
import argparse
import json
import zipfile


def pack(root, output, receipt):
    root, output = root.resolve(strict=True), output.resolve()
    if not root.is_dir() or output == root or root in output.parents:
        raise ValueError('Choose a game root and a separate output path.')
    if receipt is not None:
        receipt = receipt.resolve()
        if receipt == output or receipt == root or root in receipt.parents:
            raise ValueError('Choose a receipt outside the game root and separate from the archive.')
        if receipt.exists():
            raise FileExistsError('Choose a new receipt path.')
    files, keys = [], set()
    for path in sorted(root.rglob('*'), key=lambda p: str(p.relative_to(root)).lower()):
        if path.is_symlink():
            raise ValueError('Resource inputs must be regular files or directories: ' + str(path.relative_to(root)))
        if path.is_dir():
            continue
        if not path.is_file():
            raise ValueError('Resource input is not a regular file.')
        name = path.relative_to(root).as_posix()
        if len(name) > 255 or any(ord(c) < 32 or ord(c) > 126 or c in ':*?"<>|' for c in name) or any(p in ['', '.', '..'] or p.endswith(('.', ' ')) for p in name.split('/')):
            raise ValueError('Game resource paths must use the supported relative ASCII names: ' + name)
        if name.lower() in keys:
            raise ValueError('Resource path alias: ' + name)
        keys.add(name.lower()); files.append((name, path))
    if not 1 <= len(files) <= 65536:
        raise ValueError('Expected1..65536 resource files.')
    for key in keys:
        pieces = key.split('/')
        if any('/'.join(pieces[:at]) in keys for at in range(1, len(pieces))):
            raise ValueError('Resource file/directory alias.')
    output.parent.mkdir(parents=True, exist_ok=True)
    records = []
    with zipfile.ZipFile(output, 'x', compression=zipfile.ZIP_STORED, allowZip64=True) as archive:
        for name, path in files:
            before = path.stat(); digest = sha256()
            info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_STORED
            info.create_system = 3; info.external_attr = 0o100600 << 16; info.file_size = before.st_size
            with path.open('rb') as source, archive.open(info, 'w', force_zip64=True) as destination:
                while True:
                    data = source.read(1024 * 1024)
                    if not data:
                        break
                    digest.update(data); destination.write(data)
            after = path.stat()
            if (before.st_dev, before.st_ino, before.st_size, before.st_mtime_ns) != (after.st_dev, after.st_ino, after.st_size, after.st_mtime_ns):
                raise ValueError('Resource input changed while packing: ' + name)
            records.append(dict(path=name, bytes=before.st_size, sha256=digest.hexdigest()))
    result = dict(schema='moli.game-resource-pack.v1', method='stored', files=len(records),
                  content_bytes=sum(r['bytes'] for r in records), archive_bytes=output.stat().st_size,
                  entries=records, original_execution=False)
    if receipt:
        receipt.parent.mkdir(parents=True, exist_ok=True)
        with receipt.open('x') as stream:
            stream.write(json.dumps(result, indent=2) + '\n')
    print(json.dumps({k: v for k, v in result.items() if k != 'entries'}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--receipt', type=Path)
    args = parser.parse_args()
    pack(args.root, args.output, args.receipt)
