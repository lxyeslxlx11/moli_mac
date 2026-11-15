#!/usr/bin/env python3
"""Verify selected static anchors. Reads exact local files; executes no target code.

Outputs original observations/addresses only, not copied pseudocode or machine code.
This is a bounded evidence verifier, not a general x86 or protocol decoder.
"""
import argparse
import hashlib
import json
import struct
from pathlib import Path

EXPECTED_PE = '601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'
EXPECTED_DOSSIER = 'c31c584a2cdd52a1ce2f86d36044ef1685e30a8d64ccb87643f6847568e6508c'


def inspect(pe_path, dossier_path):
    data = pe_path.read_bytes()
    dossier_bytes = dossier_path.read_bytes()
    pe_sha = hashlib.sha256(data).hexdigest()
    dossier_sha = hashlib.sha256(dossier_bytes).hexdigest()
    if pe_sha != EXPECTED_PE or dossier_sha != EXPECTED_DOSSIER:
        raise ValueError('Sample or dossier differs: establish a new evidence version first')
    dossier = json.loads(dossier_bytes)
    normalized = dossier['normalized_result']
    pe = struct.unpack_from('<I', data, 60)[0]
    count = struct.unpack_from('<H', data, pe + 6)[0]
    optional_bytes = struct.unpack_from('<H', data, pe + 20)[0]
    image_base = struct.unpack_from('<I', data, pe + 52)[0]
    sections = []
    for index in range(count):
        start = pe + 24 + optional_bytes + 40 * index
        _, va, length, offset = struct.unpack_from('<IIII', data, start + 8)
        sections.append((va + image_base, length, offset))

    def offset(address):
        for va, length, file_offset in sections:
            if va <= address < va + length:
                return file_offset + address - va
        raise ValueError(f'VA {address:#x} is not file backed')

    checks = []

    def record(kind, address, expected, actual, context):
        valid = actual == expected
        checks.append({'kind': kind, 'va': hex(address), 'file_offset': hex(offset(address)),
                       'expected': expected, 'actual': actual, 'passed': valid, 'context': context})
        if not valid:
            raise ValueError(f'Anchor mismatch at {address:#x}: {context}')

    def direct_call(address, target, context):
        pos = offset(address)
        if data[pos] != 0xe8:
            raise ValueError(f'Not an E8 direct call at {address:#x}')
        actual = address + 5 + struct.unpack_from('<i', data, pos + 1)[0]
        record('direct_call_target', address, hex(target), hex(actual), context)

    def imported_call(address, iat, context):
        pos = offset(address)
        if data[pos:pos + 2] != bytes([0xff, 0x15]):
            raise ValueError(f'Not an FF15 import call at {address:#x}')
        actual = struct.unpack_from('<I', data, pos + 2)[0]
        record('iat_call_slot', address, hex(iat), hex(actual), context)

    def literal(address, expected, context):
        pos = offset(address)
        actual = data[pos:data.index(0, pos)].decode('ascii')
        record('ascii_literal', address, expected, actual, context)

    for address, target, context in [
        (0x401991, 0x41ab70, 'launcher digest candidate request helper'),
        (0x401a4e, 0x409680, 'compare helper'),
        (0x401b9d, 0x41b610, 'embedded updater resource materialization helper'),
        (0x401c41, 0x40af60, 'update locator first extraction'),
        (0x401c4a, 0x40af60, 'update locator second extraction'),
        (0x401ccd, 0x409050, 'first text replacement helper'),
        (0x401ce2, 0x409050, 'module path text replacement helper'),
        (0x401d16, 0x40dc10, 'updater command formatting helper'),
        (0x402569, 0x41eac0, 'local GameList parser'),
        (0x4025b7, 0x41eac0, 'local RegionList parser')
    ]:
        direct_call(address, target, context)
    for address, target, context in [
        (0x401be0, 0x4b1670, 'GetWindowThreadProcessId'),
        (0x401d46, 0x4b136c, 'CreateProcessA'),
        (0x41b64d, 0x4b133c, 'FindResourceA'),
        (0x41b662, 0x4b1330, 'LoadResource'),
        (0x41b67e, 0x4b1338, 'SizeofResource'),
        (0x41b698, 0x4b1334, 'LockResource'),
        (0x41b6c9, 0x4b130c, 'CreateFileA'),
        (0x41b6f5, 0x4b1310, 'WriteFile')
    ]:
        imported_call(address, target, context)
    for address, value, context in [
        (0x4b1940, '/Launcher/launcher_md5.dat', 'self update candidate digest path'),
        (0x4b1a18, '/Launcher/launcher_url.dat', 'self update candidate locator path'),
        (0x4b1c64, '/Launcher/xml_md5.dat', 'catalog candidate digest path'),
        (0x4b1d60, '/Launcher/GameList.xml', 'catalog replacement path'),
        (0x4b1e60, '/Launcher/RegionList.xml', 'region replacement path'),
        (0x4b1ad4, 'LauncherUpdater.exe %d %s %s %s %s', 'self updater argv template'),
        (0x4b1ac4, '|', 'first replacement new text'),
        (0x4b1ac8, ' ', 'first replacement old text'),
        (0x4b1acc, '|', 'second replacement new text'),
        (0x4b1ad0, ' ', 'second replacement old text'),
        (0x4b65f4, 'BIN_DATA', 'resource materialization resource type')
    ]:
        literal(address, value, context)
    selected_names = {'/Launcher/launcher_md5.dat', '/Launcher/launcher_url.dat',
                      '/Launcher/xml_md5.dat', '/Launcher/GameList.xml',
                      '/Launcher/RegionList.xml', 'LauncherUpdater.exe %d %s %s %s %s',
                      'Argsline', 'RegKey', 'PatchEXE', 'ConfigEXE'}
    flow = normalized['native_value_flow']
    return {
        'derived_summary': True, 'not_canonical_evidence': True,
        'subject_sha256': pe_sha, 'source_dossier_sha256': dossier_sha,
        'upstream_evidence_id': dossier['evidence_id'], 'provider': dossier['provider'],
        'procedure': {'address': normalized['procedure']['address'],
                      'name': normalized['procedure']['name'],
                      'ranges': normalized['procedure']['body']['ranges']},
        'value_flow_coverage': {'truncated': flow['truncated'],
                                'retained_operations': len(flow['operations']),
                                'omitted_operations_lower_bound': flow['omitted_operations_lower_bound'],
                                'unresolved_call_count': len(normalized['unresolved_calls'])},
        'selected_source_references': [x for x in normalized['referenced_strings']
                                       if x['value'] in selected_names],
        'checked_anchor_count': len(checks), 'all_anchors_passed': all(x['passed'] for x in checks),
        'checks': checks,
        'limits': ['No target code executed and no endpoint contacted.',
                   'Call sites and literals do not establish full helper semantics or network protocol.',
                   'Hand-audited argument provenance remains a derived interpretation.',
                   'Full assembly, decompiler text and resource payloads remain in temporary local analysis.']
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pe', type=Path, required=True)
    parser.add_argument('--dossier', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(inspect(args.pe, args.dossier), indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
