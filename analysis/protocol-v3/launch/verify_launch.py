#!/usr/bin/env python3
"""Read-only verifier of fixed-sample launch anchors; never loads PE code or contacts a network."""
import argparse
import hashlib
import json
import struct
from pathlib import Path

MAX_BYTES = 16 * 1024 * 1024
class EvidenceError(ValueError): pass

class PE32:
    def __init__(self, data):
        self.data = data
        if not 64 <= len(data) <= MAX_BYTES or data[:2] != b'MZ':
            raise EvidenceError('invalid or oversized MZ input')
        pe = self.u32(0x3c)
        if self.read(pe, 4) != b'PE\0\0': raise EvidenceError('invalid PE signature')
        count = self.u16(pe + 6)
        optional = pe + 24
        size = self.u16(pe + 20)
        if count < 1 or count > 96 or size < 112 or size > 4096: raise EvidenceError('header budget')
        self.read(optional, size)
        if self.u16(optional) != 0x10b: raise EvidenceError('only PE32 supported')
        self.base = self.u32(optional + 28)
        self.import_rva = self.u32(optional + 104)
        self.import_size = self.u32(optional + 108)
        self.sections = []
        for i in range(count):
            at = optional + size + i * 40
            self.read(at, 40)
            virtual_size, rva, raw_size, raw_offset = struct.unpack('<IIII', self.read(at + 8, 16))
            self.read(raw_offset, raw_size)
            self.sections.append((rva, raw_size, raw_offset))
    def read(self, offset, size):
        if not isinstance(offset, int) or not isinstance(size, int) or offset < 0 or size < 0 or offset > len(self.data) - size:
            raise EvidenceError('file range out of bounds')
        return self.data[offset:offset + size]
    def u16(self, offset): return struct.unpack('<H', self.read(offset, 2))[0]
    def u32(self, offset): return struct.unpack('<I', self.read(offset, 4))[0]
    def offset(self, va, size=1):
        rva = va - self.base
        candidates = [ro + rva - start for start, length, ro in self.sections if start <= rva and rva + size <= start + length]
        if len(candidates) != 1: raise EvidenceError('unbacked or ambiguous VA')
        self.read(candidates[0], size)
        return candidates[0]
    def at(self, va, size): return self.read(self.offset(va, size), size)
    def cstring(self, va, limit=256):
        out = bytearray()
        for i in range(limit):
            value = self.at(va + i, 1)
            if value == b'\0': return bytes(out).decode('ascii')
            out.extend(value)
        raise EvidenceError('string budget exceeded')
    def imports(self):
        imports = {}
        if not self.import_rva: return imports
        for i in range(min(self.import_size // 20, 256)):
            values = struct.unpack('<IIIII', self.at(self.base + self.import_rva + i * 20, 20))
            if not any(values): return imports
            oft, _, _, name_rva, ft = values
            dll = self.cstring(self.base + name_rva)
            for j in range(4096):
                value = struct.unpack('<I', self.at(self.base + (oft or ft) + 4*j, 4))[0]
                if not value: break
                name = '#' + str(value & 0xffff) if value & 0x80000000 else self.cstring(self.base + value + 2)
                imports[self.base + ft + 4*j] = (dll, name)
            else: raise EvidenceError('import thunk budget')
        raise EvidenceError('unterminated import descriptors')

def inspect_anchor(pe, row, imports):
    va = int(row['va'], 16)
    kind = row['kind']
    if kind == 'iat_call':
        b = pe.at(va, 6)
        if b[:2] != b'\xff\x15': raise EvidenceError('not indirect IAT call')
        target = struct.unpack('<I', b[2:])[0]
        actual = imports.get(target)
        if target != int(row['target'], 16) or not actual or actual[1] != row['api']: raise EvidenceError('IAT/API mismatch')
        result = {'target': hex(target), 'dll': actual[0], 'api': actual[1]}
    elif kind == 'direct_call':
        b = pe.at(va, 5)
        if b[0] != 0xe8: raise EvidenceError('not direct call')
        target = va + 5 + struct.unpack('<i', b[1:])[0]
        if target != int(row['target'], 16): raise EvidenceError('direct target mismatch')
        result = {'target': hex(target)}
    elif kind == 'literal_reference':
        b = pe.at(va, 5)
        target = int(row['target'], 16)
        if b != b'\x68' + struct.pack('<I', target): raise EvidenceError('not expected push literal')
        value = pe.cstring(target)
        if value != row['literal']: raise EvidenceError('literal mismatch')
        result = {'target': hex(target), 'literal': value, 'literal_offset': hex(pe.offset(target))}
    elif kind == 'instruction_bytes':
        expected = bytes.fromhex(row['expected_hex'])
        b = pe.at(va, len(expected))
        if b != expected: raise EvidenceError('instruction bytes mismatch')
        result = {'observed_hex': b.hex()}
    else: raise EvidenceError('unknown anchor kind')
    return {'id': row['id'], 'va': row['va'], 'file_offset': hex(pe.offset(va, len(b))), 'kind': kind, 'passed': True, **result}

def verify(data, manifest):
    sha = hashlib.sha256(data).hexdigest()
    if sha != manifest['sample']['sha256']: raise EvidenceError('sample SHA256 mismatch')
    pe = PE32(data)
    imports = pe.imports()
    ids = [x['id'] for x in manifest['anchors']]
    if len(ids) != len(set(ids)): raise EvidenceError('duplicate anchor IDs')
    return {'sample_sha256': sha, 'image_base': hex(pe.base), 'all_passed': True, 'count': len(ids), 'anchors': [inspect_anchor(pe, x, imports) for x in manifest['anchors']]}

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--pe', type=Path, required=True)
    p.add_argument('--manifest', type=Path, default=Path(__file__).with_name('launch-evidence.json'))
    args = p.parse_args()
    if args.pe.stat().st_size > MAX_BYTES: raise EvidenceError('file budget')
    print(json.dumps(verify(args.pe.read_bytes(), json.loads(args.manifest.read_text())), ensure_ascii=False, indent=2))
if __name__ == '__main__': main()
