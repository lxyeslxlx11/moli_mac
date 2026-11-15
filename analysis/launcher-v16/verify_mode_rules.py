#!/usr/bin/env python3
"""Fixed-sample mode/profile operands only. Never executes a target or reads live configuration."""
import argparse
import hashlib
import importlib.util
import json
import struct
from pathlib import Path

EXPECTED = '601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'
DIRECT = [(0x40483f, 0x424d50), (0x404894, 0x40f780), (0x4048a3, 0x431c1a),
          (0x40492c, 0x424f00), (0x4049a7, 0x424f00), (0x415d89, 0x40f780),
          (0x415d9b, 0x431c1a), (0x415dc5, 0x42b19a), (0x415e77, 0x424f00),
          (0x415fee, 0x424f00), (0x40f7b2, 0x431570), (0x40f8a0, 0x4341f8),
          (0x40f8b4, 0x4341f8), (0x40f8c7, 0x40f8d0)]
PROFILE_CALLS = [0x424ed0, 0x424f77, 0x42503c, 0x4250f7, 0x43cc3c]
FIXED = [(0x40f7aa, '681f010000', 'dialog287'), (0x40f89a, '6a02', 'control2'),
         (0x40f8ae, '6a01', 'control1'), (0x415dca, '83f807', 'confirmation-result7'),
         (0x404862, '83b8886c000001', 'stored-mode1'), (0x404875, '83b9886c000002', 'stored-mode2'),
         (0x4b2330, '557365724d6f646500', 'UserMode-key'), (0x4b233c, '53657474696e677300', 'Settings-suffix'),
         (0x4b3790, '5e1a430098374b00', 'base-map-and-own-entry-pointer'),
         (0x4b3798, '00' * 24, 'first-own-message-entry-zero')]


def identity(data):
    if hashlib.sha256(data).hexdigest() != EXPECTED:
        raise ValueError('Fixed sample SHA256 mismatch')


def inspect(path):
    identity(path.read_bytes())
    spec = importlib.util.spec_from_file_location('mode_fixed_pe', Path(__file__).resolve().parents[1] / 'protocol-v3/game-network/scan_network_static.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    pe = module.PE(path)
    identity(pe.data)
    rows = []

    def take(va, length):
        start = pe.file(va)
        if start is None or start + length > len(pe.data):
            raise ValueError('Unbacked fixed operand')
        return start, pe.data[start:start + length]

    for va, target in DIRECT:
        offset, data = take(va, 5)
        if data[0] != 0xe8 or va + 5 + struct.unpack_from('<i', data, 1)[0] != target:
            raise ValueError('Direct-call mismatch')
        rows.append({'kind': 'direct_call', 'va': hex(va), 'file_offset': offset, 'target': hex(target), 'passed': True})
    imports = {row['iat_va']: row for row in pe.imports}
    for va in PROFILE_CALLS:
        offset, data = take(va, 6)
        if data != b'\xff\x15' + struct.pack('<I', 0x4b12d8):
            raise ValueError('Profile IAT operand mismatch')
        imported = imports[0x4b12d8]
        if imported['symbol'] != 'WritePrivateProfileStringA' or imported['dll'].upper() != 'KERNEL32.DLL':
            raise ValueError('Profile import mismatch')
        rows.append({'kind': 'iat_call', 'va': hex(va), 'file_offset': offset, 'symbol': imported['symbol'], 'passed': True})
    for va, expected, purpose in FIXED:
        offset, data = take(va, len(bytes.fromhex(expected)))
        if data.hex() != expected:
            raise ValueError('Fixed mode/data operand mismatch')
        rows.append({'kind': purpose, 'va': hex(va), 'file_offset': offset, 'bytes': len(data), 'passed': True})
    changed = bytearray(pe.data)
    changed[0] ^= 1
    rejected = []
    for name, raw in [('modified', changed), ('truncated', pe.data[:128]), ('empty', b'')]:
        try:
            identity(raw)
        except ValueError:
            rejected.append(name)
        else:
            raise AssertionError('Different sample accepted')
    return {'schema': 'moli.launcher-v16.mode-operand-audit.v1', 'sample_sha256': EXPECTED,
            'source_bytes': len(pe.data), 'anchors': rows, 'negative_identities_rejected': rejected,
            'passed': True, 'scope': 'Fixed offline operands; not account persistence absence, native execution or runtime modal dispatch'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pe', type=Path, required=True)
    print(json.dumps(inspect(parser.parse_args().pe), ensure_ascii=False, indent=2))
