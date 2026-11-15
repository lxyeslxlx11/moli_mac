#!/usr/bin/env python3
"""Fixed-hash offline dialog metadata projection. Does not return titles or execute a target."""
from pathlib import Path
import hashlib
import json
import struct
import sys

SAMPLE_SHA256 = '601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'


class Reader:
    def __init__(self, data):
        self.data, self.at = data, 0

    def take(self, length):
        if length < 0 or length > len(self.data) - self.at:
            raise ValueError('truncated dialog template')
        result = self.data[self.at:self.at + length]
        self.at += length
        return result

    def word(self):
        return struct.unpack('<H', self.take(2))[0]

    def field(self):
        first = self.word()
        if first == 0xffff:
            return {'ordinal': self.word()}
        values = []
        while first:
            values.append(first)
            first = self.word()
        # Strings stay local; output only uses the predefined class ordinal.
        return {'text_units': values}

    def align(self):
        self.take((-self.at) % 4)


def inspect(data):
    reader = Reader(data)
    extended = len(data) >= 4 and data[:4] == b'\x01\x00\xff\xff'
    if extended:
        version, signature, help_id, ex_style, style, count, x, y, cx, cy = struct.unpack('<HHIIIHhhhh', reader.take(26))
    else:
        style, ex_style, count, x, y, cx, cy = struct.unpack('<IIHhhhh', reader.take(18))
    if count > 256:
        raise ValueError('unsupported control count')
    reader.field()
    reader.field()
    reader.field()
    if style & 0x40:
        reader.take(6 if extended else 2)
        reader.field()
    selected = []
    for _ in range(count):
        reader.align()
        start = reader.at
        if extended:
            help_id, ex_style, item_style, x, y, cx, cy, item_id = struct.unpack('<IIIhhhhI', reader.take(24))
        else:
            item_style, ex_style, x, y, cx, cy, item_id = struct.unpack('<IIhhhhH', reader.take(18))
        window_class, title = reader.field(), reader.field()
        extra = reader.word()
        if extra:
            raise ValueError('nonempty creation data is outside this fixed analysis helper')
        if item_id in (0x3f5, 0x3f6):
            selected.append({'id': item_id, 'template_offset': start, 'style': item_style,
                             'class_ordinal': window_class.get('ordinal'), 'initial_text_units': len(title.get('text_units', [])),
                             'flags': {name: bool(item_style & value) for name, value in
                                       [('uppercase', 8), ('lowercase', 16), ('password', 32), ('oemconvert', 1024), ('number', 8192)]}})
    if any(data[reader.at:]):
        raise ValueError('unexpected nonzero trailing data')
    return {'format': 'DLGTEMPLATEEX' if extended else 'DLGTEMPLATE', 'controls': count, 'selected': selected}


def main():
    if len(sys.argv) != 3:
        raise SystemExit('usage: inspect_dialog_controls.py <REA-resource-inventory.json> <fixed-unpacked-launcher.exe>')
    inventory_path, sample_path = map(Path, sys.argv[1:])
    inventory = json.loads(inventory_path.read_text())
    if sample_path.is_symlink() or not sample_path.is_file() or sample_path.stat().st_size != 1735168:
        raise ValueError('expected exact ordinary analysis sample')
    data = sample_path.read_bytes()
    if hashlib.sha256(data).hexdigest() != SAMPLE_SHA256:
        raise ValueError('sample identity mismatch')
    source = inventory['normalized_result']
    if source['artifact']['sha256'] != SAMPLE_SHA256:
        raise ValueError('inventory identity mismatch')
    matches, count = [], 0
    for resource in source['resources']:
        if resource['type'].get('id') != 5:
            continue
        count += 1
        payload = resource['payload']
        start, length = payload['location']['offset'], payload['location']['bytes']
        if length > 16384 or start < 0 or length > len(data) - start:
            raise ValueError('resource bounds mismatch')
        part = data[start:start + length]
        if hashlib.sha256(part).hexdigest() != payload['sha256']:
            raise ValueError('resource identity mismatch')
        result = inspect(part)
        if result['selected']:
            matches.append({'resource_id': resource['name']['id'], 'file_offset': start, 'bytes': length,
                            'sha256': payload['sha256'], **result})
    print(json.dumps({'schema': 'moli.launcher-v8.dialog-controls.v1', 'sample_sha256': SAMPLE_SHA256,
                      'source_evidence': inventory['evidence_id'], 'dialogs_examined': count, 'matches': matches,
                      'scope': 'Fixed resource metadata only; no dialog text, original payload, execution or active code-page observation.'}, indent=2))


if __name__ == '__main__':
    main()
