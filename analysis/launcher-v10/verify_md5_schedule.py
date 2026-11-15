#!/usr/bin/env python3
"""Compare fixed REA MD5 round metadata to RFC1321 without executing target code."""
from pathlib import Path
import json
import math
import re
import sys


def verify(path):
    bundle = json.loads(Path(path).read_text())
    records = [entry for entry in bundle['records'] if entry['operation'] == 'analyze_function'
               and entry['normalized_result']['procedure']['address'] == '0x423300']
    if len(records) != 1 or records[0]['subject']['digest']['sha256'] != '601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31':
        raise ValueError('expected one fixed-sample MD5 dossier')
    record = records[0]
    calls = re.findall(r'FUN_(004240a0|00424130|00424190|004241f0)\(([^;]+)\);', record['normalized_result']['pseudocode'])
    if len(calls) != 64:
        raise ValueError('expected64 MD5 rounds')
    shifts = [[7, 12, 17, 22], [5, 9, 14, 20], [4, 11, 16, 23], [6, 10, 15, 21]]
    registers = ['local_8', 'local_c', 'local_54', 'local_50']
    for index, (function, args) in enumerate(calls):
        values = [arg.strip() for arg in args.split(',')]
        group = index // 16
        expected_registers = [registers[(-index + offset) % 4] for offset in range(4)]
        word = index if group == 0 else (5 * index + 1) % 16 if group == 1 else (3 * index + 5) % 16 if group == 2 else 7 * index % 16
        good = (function == ['004240a0', '00424130', '00424190', '004241f0'][group]
                and values[:4] == ['&' + expected_registers[0]] + expected_registers[1:]
                and (0x4c - int(values[4][6:], 16)) // 4 == word
                and int(values[5], 0) == shifts[group][index % 4]
                and int(values[6], 0) & 0xffffffff == math.floor(abs(math.sin(index + 1)) * 2**32))
        if not good:
            raise ValueError(f'MD5 round mismatch at{index}')
    return {'evidence_id': record['evidence_id'], 'rounds': 64, 'constants_match': True,
            'word_schedule_match': True, 'rotations_match': True, 'register_schedule_match': True}


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('usage: verify_md5_schedule.py <private-REA-bundle.json>')
    print(json.dumps(verify(sys.argv[1]), indent=2))
