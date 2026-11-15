"""Original ZIP fixtures from the independent Python standard-library writer."""
from pathlib import Path
from hashlib import sha256
import io
import json
import struct
import zipfile
import random

HERE = Path(__file__).resolve().parent
cases = {}


def make(rows, *, force64=False, streamed=False, prefix=b'', comment=b'', known_size=False, strip_signature=False):
    class Stream(io.BytesIO):
        def write(self, data):
            if strip_signature and len(data) in [16, 24] and data[:4] == b'PK\x07\x08':
                return super().write(data[4:])
            return super().write(data)
        def seekable(self):
            return False
        def seek(self, *args):
            raise io.UnsupportedOperation('original streaming fixture')
    out = Stream() if streamed else io.BytesIO()
    with zipfile.ZipFile(out, 'w', allowZip64=True) as z:
        z.comment = comment
        for name, body, method in rows:
            info = zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0)); info.compress_type = method
            if known_size:
                info.file_size = len(body)
            info.create_system = 3; info.external_attr = (0o40755 if name.endswith('/') else 0o100600) << 16
            with z.open(info, 'w', force_zip64=force64) as f:
                f.write(body)
    return prefix + out.getvalue()


def add(name, rows, **kwargs):
    raw = make(rows, **kwargs)
    files = []
    for n, b, _ in rows:
        if n.endswith('/'):
            continue
        entry = dict(path=n)
        if len(b) > 1024 and b == body[:len(b)]:
            entry['payloadBytes'] = len(b)
        elif len(b) > 1024 * 1024:
            assert b == bytes([b[0]]) * len(b)
            entry.update(fillByte=b[0], length=len(b))
        else:
            entry['bytesHex'] = b.hex()
        files.append(entry)
    cases[name] = dict(hex=raw.hex(), files=files)
    return raw


body = bytes((i * 73 + i // 251) & 255 for i in range(150000))
base = [('Bin/', b'', 0), ('Bin/a.bin', body, 0), ('Bin/b.bin', body, 8), ('Bin/empty', b'', 8)]
add('ordinary', base)
add('local64', base, force64=True)
add('descriptor32', base, streamed=True)
add('descriptor64', base, force64=True, streamed=True)
add('descriptor32-no-signature', base, streamed=True, strip_signature=True)
add('descriptor64-no-signature', base, force64=True, streamed=True, strip_signature=True)
add('known-size64', base, force64=True, known_size=True)
previous_limit = zipfile.ZIP64_LIMIT
zipfile.ZIP64_LIMIT = 1024
try:
    add('end64', base, force64=True)
    add('end64-prefix', base, force64=True, prefix=b'original resource prefix')
finally:
    zipfile.ZIP64_LIMIT = previous_limit
add('prefix-comment', base, prefix=b'Original prefix only', comment=b'original comment')
add('wrapped', [('Wrapper/cg_se_6000.exe', b'original module marker', 0), ('Wrapper/Bin/a.bin', body[:101], 8)])
add('unicode-root', [('\u9b54\u529b/cg_se_6000.exe', b'original module marker', 0), ('\u9b54\u529b/Bin/a.bin', body[:101], 8)])
add('multiple-root', [('A/cg_se_6000.exe', b'a', 0), ('B/cg_se_6000.exe', b'b', 0)])
for name, rows in {
    'duplicate': [('Bin/a', b'a', 0), ('bin/A', b'b', 0)],
    'file-directory': [('Bin', b'a', 0), ('Bin/a', b'b', 0)],
    'parent': [('../Bin/a', b'a', 0)],
    'absolute': [('/Bin/a', b'a', 0)],
}.items():
    add(name, rows)
add('many', [(f'Bin/items/{i}.dat', bytes([i % 256]) * 7, i % 2 * 8) for i in range(1200)])
random_source = random.Random(289)
add('chunked-deflate', [('Bin/random.bin', bytes(random_source.getrandbits(8) for _ in range(98333)), 8)])
add('large-deflate', [('Bin/large.bin', b'x' * (33 * 1024 * 1024), 8)])
raw = bytearray.fromhex(cases['ordinary']['hex']); raw[raw.find(b'Bin/a.bin')] ^= 1; cases['local-name'] = dict(hex=raw.hex())
raw = bytearray.fromhex(cases['ordinary']['hex']); at = raw.find(b'Bin/a.bin'); raw[at + len(b'Bin/a.bin') + 5] ^= 1; cases['stored-crc'] = dict(hex=raw.hex())
raw = bytearray.fromhex(cases['ordinary']['hex']); at = raw.find(b'PK\x01\x02'); struct.pack_into('<I', raw, at + 42, 0xffffffff); cases['missing-zip64'] = dict(hex=raw.hex())
raw = bytearray.fromhex(cases['descriptor64']['hex']); at = raw.find(b'PK\x07\x08', raw.find(b'PK\x07\x08') + 4); raw[at + 4] ^= 1; cases['bad-descriptor'] = dict(hex=raw.hex())
raw = bytearray.fromhex(cases['ordinary']['hex'])
with zipfile.ZipFile(io.BytesIO(raw)) as z:
    entry = z.getinfo('Bin/b.bin'); local = entry.header_offset
at = raw.find(b'PK\x01\x02')
while raw[at + 46:at + 46 + 9] != b'Bin/b.bin':
    at = raw.find(b'PK\x01\x02', at + 4)
raw[at + 16] ^= 1; raw[local + 14] ^= 1; cases['deflate-crc'] = dict(hex=raw.hex())
HERE.joinpath('original-fixtures.json').write_text(json.dumps(dict(authority='Python zipfile original bytes;not copied game resources', payloadHex=body.hex(), cases=cases), indent=2) + '\n')
print(json.dumps(dict(cases=len(cases), bytes=sum(len(r['hex']) // 2 for r in cases.values()))))
