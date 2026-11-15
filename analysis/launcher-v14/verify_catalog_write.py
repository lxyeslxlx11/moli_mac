#!/usr/bin/env python3
"""Fixed-sample static file-call audit; never executes a target or writes game files."""
import argparse
import hashlib
import importlib.util
import json
import struct
from pathlib import Path

EXPECTED = '601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'
DIRECT = [(0x40229b, 0x41ab70), (0x402307, 0x431241), (0x402318, 0x44d9b0), (0x402333, 0x43083d),
          (0x40233e, 0x430b4e), (0x402349, 0x408660), (0x402457, 0x41ab70), (0x4024c3, 0x431241),
          (0x4024d4, 0x44d9b0), (0x4024ef, 0x43083d), (0x4024fa, 0x430b4e), (0x402505, 0x408660),
          (0x402569, 0x41eac0), (0x4025b7, 0x41eac0), (0x402494, 0x44d88a),
          (0x40187b, 0x4230a0), (0x401f1c, 0x4230a0), (0x401fb9, 0x4230a0),
          (0x43086e, 0x447d02), (0x43087f, 0x447cbc), (0x430b8b, 0x447d02), (0x447cfc, 0x44f2c3)]
IMPORTED = [(0x4022ef, 0x4b135c, 'DeleteFileA'), (0x4024ab, 0x4b135c, 'DeleteFileA'),
            (0x43085a, 0x4b1310, 'WriteFile'), (0x4313d1, 0x4b130c, 'CreateFileA'),
            (0x430b5f, 0x4b134c, 'CloseHandle'), (0x430867, 0x4b1370, 'GetLastError'), (0x430b84, 0x4b1370, 'GetLastError')]

def identity(data):
    if hashlib.sha256(data).hexdigest() != EXPECTED:
        raise ValueError('Fixed sample SHA256 mismatch')

def inspect(path):
    identity(path.read_bytes())
    spec = importlib.util.spec_from_file_location('fixed_file_pe', Path(__file__).resolve().parents[1] / 'protocol-v3/game-network/scan_network_static.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    pe = module.PE(path)
    identity(pe.data)
    rows = []

    def pos(va, size):
        offset = pe.file(va)
        if offset is None or offset + size > len(pe.data):
            raise ValueError('Unbacked operand')
        return offset

    for va, target in DIRECT:
        offset = pos(va, 5)
        if pe.data[offset] != 0xe8 or va + 5 + struct.unpack_from('<i', pe.data, offset + 1)[0] != target:
            raise ValueError('Direct-call operand mismatch')
        rows.append({'kind': 'direct_call', 'va': hex(va), 'file_offset': hex(offset), 'target': hex(target), 'passed': True})
    imports = {row['iat_va']: row for row in pe.imports}
    for va, iat, symbol in IMPORTED:
        offset = pos(va, 6)
        if pe.data[offset:offset + 6] != b'\xff\x15' + struct.pack('<I', iat):
            raise ValueError('Import operand mismatch')
        if imports[iat]['symbol'] != symbol or imports[iat]['dll'].upper() != 'KERNEL32.DLL':
            raise ValueError('Unexpected imported symbol')
        rows.append({'kind': 'iat_call', 'va': hex(va), 'file_offset': hex(offset), 'iat_va': hex(iat), 'symbol': symbol, 'passed': True})
    for va in [0x4022f7, 0x4024b3]:
        offset = pos(va, 5)
        if pe.data[offset:offset + 5] != b'\x68\x01\x30\x00\x00':
            raise ValueError('Open flags mismatch')
        rows.append({'kind': 'push_flags', 'va': hex(va), 'file_offset': hex(offset), 'value': '0x3001', 'passed': True})
    modified = bytearray(pe.data)
    modified[0] ^= 1
    rejected = []
    for name, sample in [('modified', modified), ('truncated', pe.data[:128]), ('empty', b'')]:
        try:
            identity(sample)
        except ValueError:
            rejected.append(name)
        else:
            raise AssertionError('Different sample accepted')
    return {'schema': 'moli.launcher-v14.catalog-write-audit.v1', 'sample_sha256': EXPECTED,
            'source_bytes': len(pe.data), 'anchors': rows, 'negative_identities_rejected': rejected, 'passed': True,
            'scope': 'Fixed offline operands only; not native execution, filesystem durability or a global absence proof'}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pe', type=Path, required=True)
    print(json.dumps(inspect(parser.parse_args().pe), ensure_ascii=False, indent=2))
