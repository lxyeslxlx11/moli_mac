#!/usr/bin/env python3
"""Fixed-sample file audit. Reads bytes only; never loads or executes the PE.

This is an analysis helper, not a general untrusted-PE parser. Reuses the
existing fixed-sample PE mapping helper, and refuses a different sample hash.
All outputs must be new files. No original bytes or decompiled code are emitted.
"""
import argparse
import datetime
import hashlib
import importlib.util
import json
from pathlib import Path
import struct

EXPECTED = '9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126'
HERE = Path(__file__).resolve().parent
SPEC = importlib.util.spec_from_file_location(
    'moli_fixed_pe', HERE.parent / 'protocol-v3/game-network/scan_network_static.py')
MAPPER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MAPPER)


def audit(path):
    data = path.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if digest != EXPECTED:
        raise ValueError('Wrong fixed sample SHA256; no format/version equivalence assumed.')
    pe = MAPPER.PE(path)
    checks = []

    def check(name, address, expected):
        offset = pe.file(address)
        if offset is None:
            raise ValueError('Requested anchor has no file backing: ' + hex(address))
        observed = data[offset:offset + len(expected)]
        passed = observed == expected
        checks.append(dict(id=name, va=hex(address), file_offset=hex(offset),
                           bytes=len(expected), passed=passed))
        if not passed:
            raise ValueError('Source anchor mismatch: ' + name)

    check('commandline-IAT-call', 0x1179053, bytes.fromhex('ff1554922401'))
    check('cache-commandline-pointer', 0x1179059, bytes.fromhex('a39c5d2601'))
    check('read-cached-commandline', 0x119489e, bytes.fromhex('a19c5d2601'))
    for name, address, target in [
        ('construct-text', 0x11948a7, 0x11973a0),
        ('text-parser-helper', 0x11948be, 0x11943b0),
    ]:
        check(name, address, b'\xe8' + struct.pack('<i', target - address - 5))

    keywords = [
        (0x1194943, 0x124e0c0, 'SERVER'),
        (0x1194a6c, 0x124e0b0, 'DOWN'),
        (0x1194c86, 0x124e094, 'REGISTER'),
        (0x1194d82, 0x124e078, 'QUIETREGISTER'),
        (0x1194e7e, 0x124e064, 'TRANSFER'),
        (0x1194edc, 0x124e050, 'FIXCLOCK'),
        (0x1194f3a, 0x124e044, 'INFO'),
        (0x1194f98, 0x124e02c, 'UNREGISTER'),
        (0x1194ff6, 0x124e00c, 'QUIETUNREGISTER'),
        (0x1195054, 0x124dff0, 'SHOWNETUSERS'),
        (0x11950b2, 0x124dfd8, 'HWCHANGELOG'),
        (0x1195110, 0x124dfc4, 'QUIETEXIT'),
        (0x119516e, 0x124dfb0, 'ARMDEBUG='),
    ]
    for source, address, word in keywords:
        check('push-' + word, source, b'\x68' + struct.pack('<I', address))
        check('utf16le-' + word, address, word.encode('utf-16le') + b'\0\0')

    for address, word in [(0x5b1874, 'CGSharedMem'), (0x5b1880, 'gid:'),
                          (0x5b1888, 'glt:')]:
        check('ascii-' + word, address, word.encode('ascii') + b'\0')

    original_text = next(s for s in pe.sections if s['name'] == '.text')
    if original_text['raw_size'] != 0:
        raise ValueError('Original text layout changed.')
    import_slot = next(i for i in pe.imports if i['symbol'] == 'GetCommandLineW')
    if import_slot['iat_va'] != 0x1249254:
        raise ValueError('GetCommandLineW IAT changed.')
    return dict(
        schema='moli.game-consumer-v1.source-audit.v1',
        recorded_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        target=dict(path=str(path.resolve()), bytes=len(data), sha256=digest),
        method='SHA256-bound static PE mapping, exact instruction operands and UTF16LE/ASCII literals; no execution or deprotection.',
        checks=checks, passed=len(checks), total=len(checks),
        original_text=original_text,
        commandline_iat=dict(dll=import_slot['dll'], symbol=import_slot['symbol'],
                             va=hex(import_slot['iat_va']),
                             file_offset=hex(import_slot['iat_file_offset'])),
        scope_limits=[
            'File-backed observations only; not a proof of entry reachability or runtime behavior.',
            'The registration-related keyword function is not established as a game argv consumer.',
            'No real command line, IPC, credentials, account, process or network was read.',
            'No protected payload reconstruction, emulation, patching or execution.',
        ])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sample', type=Path,
                        default=Path('/private/tmp/moli-analysis/crossgate/app/cg_se_3000.exe'))
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    result = audit(args.sample)
    with args.output.open('x') as stream:
        json.dump(result, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    print(json.dumps(dict(passed=result['passed'], total=result['total'],
                          sha256=result['target']['sha256'], output=str(args.output))))
