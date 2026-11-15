"""Original sparse ZIP64 fixtures;system zlib independently computes zero-bank CRCs."""
from pathlib import Path
import ctypes
import ctypes.util
import json
import struct
import sys
import zlib

lib = ctypes.CDLL(ctypes.util.find_library('z'))
combine = lib.crc32_combine
combine.argtypes = [ctypes.c_ulong, ctypes.c_ulong, ctypes.c_longlong]
combine.restype = ctypes.c_ulong


def zero_crc(length):
    crc, block, size = 0, zlib.crc32(b'\0'), 1
    while length:
        if length & 1:
            crc = combine(crc, block, size) & 0xffffffff
        block = combine(block, block, size) & 0xffffffff
        size *= 2; length >>= 1
    return crc


assert zero_crc(12345) == zlib.crc32(bytes(12345))


def write_pack(output, rows, filler=0x100000000 + 123, deflated=False):
    entries = []
    with output.open('xb') as out:
        def add(name, body=None, zero_size=None):
            name_bytes = name.encode('utf-8'); size = zero_size if zero_size is not None else len(body)
            crc = zero_crc(size) if zero_size is not None else zlib.crc32(body)
            method = 8 if deflated and zero_size is None else 0
            if method == 8:
                compressor = zlib.compressobj(6, zlib.DEFLATED, -15)
                payload = compressor.compress(body) + compressor.flush()
            else:
                payload = body
            compressed = size if zero_size is not None else len(payload)
            offset = out.tell(); wide = size >= 0xffffffff or compressed >= 0xffffffff
            extra = struct.pack('<HHQQ', 1, 16, size, compressed) if wide else b''
            csize, usize = (0xffffffff, 0xffffffff) if wide else (compressed, size)
            version = 45 if wide else 20
            flags = 0x800 if any(b >= 128 for b in name_bytes) else 0
            out.write(struct.pack('<IHHHHHIIIHH', 0x04034b50, version, flags, method, 0, 33, crc, csize, usize, len(name_bytes), len(extra)))
            out.write(name_bytes); out.write(extra)
            data_offset = out.tell()
            if zero_size is not None:
                out.seek(zero_size, 1)
            else:
                out.write(payload)
            entries.append(dict(path=name, bytes=size, compressed=compressed, crc32=crc, offset=offset,
                                data_offset=data_offset, name=name_bytes, method=method, flags=flags))
        add('Bin/original-padding.bin', zero_size=filler)
        for row in rows:
            add(row['path'], bytes.fromhex(row['bytesHex']))
        central = out.tell()
        for row in entries:
            fields = [row['bytes'], row['compressed'], row['offset']]
            words = [n for n in fields if n >= 0xffffffff]
            extra = struct.pack('<HH', 1, len(words) * 8) + b''.join(struct.pack('<Q', n) for n in words) if words else b''
            size, compressed, offset = [min(n, 0xffffffff) for n in fields]
            out.write(struct.pack('<IHHHHHHIIIHHHHHII', 0x02014b50, 3 << 8 | 45, 45 if words else 20, row['flags'], row['method'],
                                  0, 33, row['crc32'], compressed, size, len(row['name']), len(extra), 0, 0, 0, 0o100600 << 16, offset))
            out.write(row['name']); out.write(extra)
        central_bytes = out.tell() - central; end64 = out.tell(); count = len(entries)
        out.write(struct.pack('<IQHHIIQQQQ', 0x06064b50, 44, 45, 45, 0, 0, count, count, central_bytes, central))
        out.write(struct.pack('<IIQI', 0x07064b50, 0, end64, 1))
        out.write(struct.pack('<IHHHHIIH', 0x06054b50, 0, 0, min(count, 0xffff), min(count, 0xffff), min(central_bytes, 0xffffffff), min(central, 0xffffffff), 0))
    return dict(archive_bytes=output.stat().st_size, allocated_bytes=output.stat().st_blocks * 512,
                filler_bytes=filler, files=count, central_offset=central, methods=sorted({r['method'] for r in entries}),
                entries=[{k:v for k,v in row.items() if k != 'name'} for row in entries])


if __name__ == '__main__':
    output, rows_path = map(Path, sys.argv[1:3])
    filler = int(sys.argv[3]) if len(sys.argv) > 3 else 0x100000000 + 123
    result = write_pack(output, json.loads(rows_path.read_text()), filler, len(sys.argv) > 4 and sys.argv[4] == 'deflated')
    output.with_suffix('.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({k:v for k,v in result.items() if k != 'entries'}))
