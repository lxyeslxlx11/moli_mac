#!/usr/bin/env python3
"""Read-only fixed-sample anchors and one bounded dialog-control observation."""
import argparse
import hashlib
import importlib.util
import json
import struct
import unittest
from pathlib import Path

BASE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('prior_pe32', BASE.parent/'protocol-v3/launch/verify_launch.py')
PRIOR = importlib.util.module_from_spec(spec)
spec.loader.exec_module(PRIOR)


def dialog_controls(data):
    if len(data) > 16384:
        raise ValueError('Dialog budget exceeded')
    pos = 0

    def take(count):
        nonlocal pos
        if count < 0 or count > len(data)-pos:
            raise ValueError('Truncated dialog')
        out = data[pos:pos+count]
        pos += count
        return out

    def word():
        return struct.unpack('<H', take(2))[0]

    def var():
        off = pos
        first = word()
        if first == 0:
            return '', off
        if first == 0xffff:
            return {'ordinal': word()}, off
        units = [first]
        while True:
            unit = word()
            if not unit:
                break
            units.append(unit)
            if len(units) > 2048:
                raise ValueError('String budget exceeded')
        try:
            return struct.pack('<'+'H'*len(units), *units).decode('utf-16le'), off
        except UnicodeDecodeError as exc:
            raise ValueError('Invalid UTF16') from exc

    header = take(26)
    version, signature, _, _, style, count, _, _, _, _ = struct.unpack('<HHIIIHhhhh', header)
    if (version, signature) != (1, 0xffff) or count > 256:
        raise ValueError('Unsupported dialog header/count')
    var(); var(); var()
    if style & 0x40:
        take(6); var()
    controls = []
    for index in range(count):
        take((-pos) % 4)
        off = pos
        _, _, item_style, _, _, _, _, control_id = struct.unpack('<IIIhhhhI', take(24))
        cls, _ = var()
        label, label_off = var()
        extra = word()
        take(extra)
        controls.append({'index': index, 'id': control_id, 'relative_offset': off,
                         'label_relative_offset': label_off, 'style': item_style,
                         'class': cls, 'label': label, 'record_bytes': pos-off})
    if pos != len(data):
        raise ValueError('Unconsumed dialog bytes')
    return controls


def branch(va, data):
    if len(data) == 2 and (0x70 <= data[0] <= 0x7f or data[0] == 0xeb):
        return va+2+struct.unpack('<b', data[1:])[0]
    if len(data) == 6 and data[0] == 0x0f and 0x80 <= data[1] <= 0x8f:
        return va+6+struct.unpack('<i', data[2:])[0]
    if len(data) == 5 and data[0] in (0xe8, 0xe9):
        return va+5+struct.unpack('<i', data[1:])[0]
    raise ValueError('Unsupported branch encoding')


def verify(data, manifest):
    if hashlib.sha256(data).hexdigest() != manifest['sample']['sha256']:
        raise ValueError('Fixed-sample SHA256 mismatch')
    pe = PRIOR.PE32(data)
    imports = pe.imports()
    anchors = []
    for row in manifest['anchors']:
        va = int(row['va'], 16)
        expected = bytes.fromhex(row['expected_hex'])
        actual = pe.at(va, len(expected))
        if actual != expected or pe.offset(va, len(expected)) != int(row['file_offset'], 16):
            raise ValueError('Anchor mismatch: '+row['id'])
        if 'target' in row and branch(va, actual) != int(row['target'], 16):
            raise ValueError('Branch/call mismatch')
        if 'api' in row:
            if actual[:2] != b'\xff\x15' or len(actual) != 6:
                raise ValueError('Not an IAT call')
            if imports.get(struct.unpack('<I', actual[2:])[0], (None, None))[1] != row['api']:
                raise ValueError('IAT API mismatch')
        anchors.append({'id': row['id'], 'va': row['va'], 'file_offset': row['file_offset'], 'passed': True})
    r = manifest['dialog']
    payload = pe.at(int(r['payload_va'], 16), r['bytes'])
    if hashlib.sha256(payload).hexdigest() != r['sha256']:
        raise ValueError('Dialog hash mismatch')
    selected = [c for c in dialog_controls(payload) if c['id'] == r['control']['id']]
    if len(selected) != 1 or selected[0] != r['control']:
        raise ValueError('Control mismatch')
    return {'sample_sha256': manifest['sample']['sha256'], 'all_passed': True,
            'anchor_count': len(anchors), 'anchors': anchors, 'dialog_control': selected[0],
            'scope': 'Static bytes only; no execution, network or runtime values'}


def fixture(title='Synthetic', duplicate=False):
    """Original dialog fixture: no official resource bytes."""
    count = 2 if duplicate else 1
    out = bytearray(struct.pack('<HHIIIHhhhh', 1, 0xffff, 0, 0, 0, count, 0, 0, 20, 20)+bytes(6))
    for _ in range(count):
        out.extend(bytes((-len(out)) % 4))
        out.extend(struct.pack('<IIIhhhhI', 0, 0, 3, 0, 0, 10, 10, 0x405))
        out.extend(struct.pack('<HH', 0xffff, 0x80))
        out.extend(title.encode('utf-16le')+bytes(4))
    return bytes(out)


class Tests(unittest.TestCase):
    def test_original_dialog(self):
        row = dialog_controls(fixture())[0]
        self.assertEqual((row['id'], row['label'], row['class']), (0x405, 'Synthetic', {'ordinal': 128}))
    def test_every_truncation_rejected(self):
        data = fixture()
        for length in range(len(data)):
            with self.assertRaises(ValueError): dialog_controls(data[:length])
    def test_header_count_tail_and_budget_rejected(self):
        for data in [b'\x02'+fixture()[1:], fixture()+b'\0', bytes(16385), fixture()[:16]+b'\x01\x01'+fixture()[18:]]:
            with self.assertRaises(ValueError): dialog_controls(data)
    def test_bad_utf16_and_extra_data_length(self):
        data = bytearray(fixture()); data[60:62] = b'\x00\xd8'
        with self.assertRaises(ValueError): dialog_controls(bytes(data))
        data = bytearray(fixture()); data[-2:] = b'\xff\xff'
        with self.assertRaises(ValueError): dialog_controls(bytes(data))
    def test_branch_sign_and_encoding(self):
        self.assertEqual(branch(0x100, b'\x75\xfe'), 0x100)
        self.assertEqual(branch(0x100, b'\xe8'+struct.pack('<i', -5)), 0x100)
        with self.assertRaises(ValueError): branch(0x100, b'\xe8')
    def test_foreign_sample_rejected_before_parse(self):
        with self.assertRaisesRegex(ValueError, 'SHA256'):
            verify(b'Original synthetic bytes', {'sample': {'sha256': '0'*64}})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pe', type=Path)
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    if args.self_test:
        result = unittest.TextTestRunner(verbosity=2).run(unittest.defaultTestLoader.loadTestsFromTestCase(Tests))
        raise SystemExit(0 if result.wasSuccessful() else 1)
    if args.pe is None or args.pe.stat().st_size > PRIOR.MAX_BYTES:
        parser.error('--pe with a bounded local sample is required')
    manifest = json.loads((BASE/'state-field.json').read_text())
    print(json.dumps(verify(args.pe.read_bytes(), manifest), ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
