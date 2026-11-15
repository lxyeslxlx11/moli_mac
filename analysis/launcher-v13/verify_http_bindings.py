#!/usr/bin/env python3
"""Audit selected fixed-sample operands only. No target execution or network."""
import argparse
import hashlib
import importlib.util
import json
import struct
from pathlib import Path

EXPECTED = '601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'

def identity(data):
    if hashlib.sha256(data).hexdigest() != EXPECTED:
        raise ValueError('Fixed sample SHA256 mismatch')

def inspect(path):
    identity(path.read_bytes())
    mapper = Path(__file__).resolve().parents[1] / 'protocol-v3/game-network/scan_network_static.py'
    spec = importlib.util.spec_from_file_location('fixed_http_pe', mapper)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    pe = module.PE(path)
    identity(pe.data)
    rows = []

    def check(va, expected, context):
        offset = pe.file(va)
        if offset is None or pe.data[offset:offset + len(expected)] != expected:
            raise ValueError('Fixed operand mismatch')
        rows.append({'va': hex(va), 'file_offset': hex(offset), 'bytes': len(expected), 'context': context,
                     'range_sha256': hashlib.sha256(expected).hexdigest(), 'passed': True})

    for va, target in [(0x4ba968, 0x445f74), (0x4ba900, 0x445f74), (0x4ba980, 0x445b3d)]:
        check(va, struct.pack('<I', target), 'vtable slot -> ' + hex(target))
    for va, target in [(0x446688, 0x4ba934), (0x446508, 0x4ba8cc)]:
        check(va, b'\xc7\x06' + struct.pack('<I', target), 'constructor writes vptr ' + hex(target))
    imports = {i['iat_va']: i for i in pe.imports}
    for va, iat, symbol in [(0x445fa4, 0x4b168c, 'InternetReadFile'), (0x446006, 0x4b168c, 'InternetReadFile'),
                             (0x44604a, 0x4b168c, 'InternetReadFile'), (0x445b50, 0x4b16a4, 'InternetCloseHandle'),
                             (0x4463c9, 0x4b16a4, 'InternetCloseHandle')]:
        item = imports[iat]
        if item['symbol'] != symbol or item['dll'].upper() != 'WININET.DLL':
            raise ValueError('Unexpected imported function')
        check(va, b'\xff\x15' + struct.pack('<I', iat), 'IAT -> ' + symbol)
    check(0x41ae2d, b'\x68\x00\x04\x00\x00', '0x400 buffer allocation request')
    check(0x41ae4f, b'\x68\xff\x03\x00\x00', '0x3ff read request')
    check(0x41ae63, b'\xff\xd0', 'indirect CALL EAX from vptr+0x34')
    check(0x41ae80, b'\xc6\x02\x00', 'NUL after returned chunk')
    modified = bytearray(pe.data)
    modified[0] ^= 1
    rejected = []
    for name, sample in [('modified', modified), ('truncated', pe.data[:128]), ('empty', b'')]:
        try:
            identity(sample)
        except ValueError:
            rejected.append(name)
        else:
            raise AssertionError('Unexpected sample accepted')
    return {'schema': 'moli.launcher-v13.http-bindings.v1', 'sample_sha256': EXPECTED,
            'source_bytes': len(pe.data), 'anchors': rows, 'negative_identities_rejected': rejected, 'passed': True,
            'limits': ['Fixed offline operand audit, not a general PE loader', 'No target execution or observed native I/O',
                       'Vtable/normal path only; complete EH and all runtime dispatch are not proven']}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pe', type=Path, required=True)
    print(json.dumps(inspect(parser.parse_args().pe), ensure_ascii=False, indent=2))
