"""Original resource-cache records and procedural maximum-size expectations; no vendor payload."""
import hashlib
import json
from pathlib import Path
import struct


def canonical(value):
    return json.dumps(value, ensure_ascii=True, separators=(',', ':')).encode('ascii')


def header(revision, meta, lengths):
    raw = bytearray(48)
    struct.pack_into('<8sQIIII', raw, 0, b'MOLIRES1', revision, len(meta), sum(lengths), len(lengths), 0)
    raw[32:48] = hashlib.md5(raw[:32] + meta).digest()
    return bytes(raw)


def binding(**overrides):
    return dict(gameListMd5='1' * 32, regionListMd5='2' * 32, gameOrdinal=0, referenceOrdinal=0,
                regionOrdinal=0, gameCodeText='0011', directoryText='C:\\Original', pathEncoding='ascii', **overrides)


def record(name, revision, bound, files):
    schema = 'moli.launcher.resources.v2' if 'patchSourceProfile' in bound else 'moli.launcher.resources.v1'
    meta = canonical(dict(schema=schema, binding=bound, files=[dict(path=path, length=len(data), md5=hashlib.md5(data).hexdigest()) for path, data in files], trust='unverified'))
    raw = header(revision, meta, [len(data) for path, data in files]) + meta + b''.join(data for path, data in files)
    return dict(name=name, revision=revision, binding=bound, files=[dict(path=path, hex=data.hex()) for path, data in files],
                recordHex=raw.hex(), recordMd5=hashlib.md5(raw).hexdigest())


cases = [record('empty-v1', 1, binding(), []),
         record('binary-v1', 2**32 + 7, binding(), [('Data/a.bin', b'\0original\0resource\xff'), ('empty.bin', b'')]),
         record('unicode-binding', 3, {**binding(), 'directoryText': 'C:\\原创\\𝄞', 'pathEncoding': 'windows-936'}, [('Data/a.bin', b'original')]),
         *[record(f'source-{ordinal}', 7 + ordinal, binding(galaxyOrdinal=2, patchSourceProfile='puk3-195f3afd', patchSourceOrdinal=ordinal), [('Data/a.bin', b'original')]) for ordinal in (0, 1)],
         record('maximum-revision', 2**53 - 2, binding(), [('Data/a.bin', b'last revision')])]

block = 1024 * 1024
maximum_files = []
for path, byte in [('first.bin', 0xa5), ('second.bin', 0x5a)]:
    digest = hashlib.md5()
    for _ in range(32):
        digest.update(bytes([byte]) * block)
    maximum_files.append(dict(path=path, length=32 * block, md5=digest.hexdigest(), fill=byte))
meta = canonical(dict(schema='moli.launcher.resources.v1', binding=binding(),
                      files=[{key: row[key] for key in ['path', 'length', 'md5']} for row in maximum_files], trust='unverified'))
raw_header = header(9, meta, [row['length'] for row in maximum_files])
digest = hashlib.md5(raw_header + meta)
for row in maximum_files:
    for _ in range(32):
        digest.update(bytes([row['fill']]) * block)
maximum = dict(revision=9, binding=binding(), files=maximum_files, recordBytes=48 + len(meta) + 64 * block,
               headerHex=raw_header.hex(), recordMd5=digest.hexdigest())

paths = [('f' + str(i).zfill(4) + 'a' * 250 + '.bin') for i in range(1024)]
assert all(len(path) == 259 for path in paths)
meta = canonical(dict(schema='moli.launcher.resources.v1', binding=binding(),
                      files=[dict(path=path, length=0, md5=hashlib.md5(b'').hexdigest()) for path in paths], trust='unverified'))
max_count = dict(revision=10, binding=binding(), count=1024, pathBytes=259, recordBytes=48 + len(meta),
                 recordMd5=hashlib.md5(header(10, meta, [0] * 1024) + meta).hexdigest())

target = Path(__file__).with_name('original-vectors.json')
target.write_text(json.dumps(dict(schema='moli.original-resource-cache-vectors.v1', original_synthetic_only=True,
                                  cases=cases, maximumBytes=maximum, maximumCount=max_count), ensure_ascii=True, indent=2) + '\n')
print(json.dumps(dict(cases=len(cases), maximumPayloadBytes=64 * block, maximumFiles=1024, output=str(target))))
