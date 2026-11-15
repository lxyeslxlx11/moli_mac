#!/usr/bin/env python3
"""Read-only, fixed-identity PE/REA callsite cross-check. New receipt only."""
from pathlib import Path
import argparse
import datetime
import hashlib
import importlib.util
import json
import struct

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
SPEC = importlib.util.spec_from_file_location(
    'moliPE', ROOT / 'analysis/protocol-v3/game-network/scan_network_static.py')
MAPPER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MAPPER)
SHA256 = '01588841278dcb7360c91333f0f7c5ec81aec84625ca274be54ad9011aaf10eb'


def audit(target):
    pe = MAPPER.PE(target)
    data = pe.data
    if hashlib.sha256(data).hexdigest() != SHA256:
        raise ValueError('Wrong reviewed fixture identity.')
    calls = json.loads((HERE / 'fixture-call-sites.json').read_text())
    by_iat = {item['iat_va']: item for item in pe.imports}
    passed = []
    for site in calls['sites']:
        va = int(site['callVa'], 16)
        off = pe.file(va)
        if off is None or off < 5 or data[off:off+2] != b'\xff\xd0' or data[off-5] != 0xa1:
            raise ValueError('Unexpected MOV EAX,[IAT]; CALL EAX layout.')
        iat = struct.unpack_from('<I', data, off-4)[0]
        if by_iat[iat]['symbol'] != site['api']:
            raise ValueError('REA target disagrees with original import operand.')
        passed.append(dict(api=site['api'], call_rva=site['callRva'],
                           return_rva=site['returnRva'], file_offset=off,
                           iat_va=hex(iat), passed=True))
    expected = [('GetCommandLineW', 0x102f), ('CreateFileMappingW', 0x1137),
                ('OpenFileMappingW', 0x1192), ('MapViewOfFile', 0x11e5),
                ('UnmapViewOfFile', 0x1236), ('CloseHandle', 0x1249),
                ('CloseHandle', 0x1259)]
    for api, rva in expected:
        if not any(s['api'] == api and s['returnRva'] == rva for s in calls['sites']):
            raise ValueError('Missing expected static success site.')
    optional = struct.unpack_from('<I', data, 0x3c)[0] + 24
    if (struct.unpack_from('<H', data, optional-20)[0] != 0x14c
            or struct.unpack_from('<H', data, optional)[0] != 0x10b):
        raise ValueError('Not x86 PE32.')
    if {s['dll'].lower() for s in pe.imports} != {'kernel32.dll'} or len(pe.imports) != 11:
        raise ValueError('Unexpected fixture import set.')
    return dict(schema='moli.runtime-observer-v2.fixture-static-audit.v1',
                recorded_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                binary_sha256=SHA256, machine='0x14c',
                image_size=struct.unpack_from('<I', data, optional+56)[0],
                entry_rva=pe.entry-pe.base,
                imports=[dict(dll=s['dll'], symbol=s['symbol']) for s in pe.imports],
                callsite_checks=passed, checks_passed=len(passed),
                known_success_return_rvas=[rva for _, rva in expected],
                observed_runtime_trace=False,
                limits='Raw instruction and IAT operands cross-check REA. Return RVAs are static; not captured events or collector privacy proof.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--target', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    result = audit(args.target)
    with args.output.open('x') as stream:
        json.dump(result, stream, indent=2)
        stream.write('\n')
    print(json.dumps(dict(checks_passed=result['checks_passed'],
                          image_size=result['image_size'], binary_sha256=SHA256)))
