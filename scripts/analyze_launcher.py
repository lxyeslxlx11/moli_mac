#!/usr/bin/env python3
"""Offline metadata only; never launches the supplied PE or contacts its URLs."""
import argparse
import hashlib
import json
import re
import struct
import xml.etree.ElementTree as ET
from pathlib import Path


def inspect_pe(path):
    data = path.read_bytes()
    if len(data) < 64 or data[:2] != b'MZ':
        raise ValueError('Expected an MZ/PE file')
    pe = struct.unpack_from('<I', data, 60)[0]
    if pe + 24 > len(data) or data[pe:pe + 4] != b'PE\0\0':
        raise ValueError('Invalid PE header')
    count = struct.unpack_from('<H', data, pe + 6)[0]
    opt_size = struct.unpack_from('<H', data, pe + 20)[0]
    if pe + 24 + opt_size + count * 40 > len(data):
        raise ValueError('Truncated PE section table')
    if opt_size < 32 or struct.unpack_from('<H', data, pe + 24)[0] != 0x10b:
        raise ValueError('This evidence scanner handles PE32 only')
    image_base = struct.unpack_from('<I', data, pe + 52)[0]
    sections = []
    for i in range(count):
        start = pe + 24 + opt_size + 40 * i
        name = data[start:start + 8].rstrip(b'\0').decode('ascii', 'replace')
        _, va, size, offset = struct.unpack_from('<IIII', data, start + 8)
        sections.append((name, offset, size, va))

    def address(offset):
        for _, file_offset, size, va in sections:
            if file_offset <= offset < file_offset + size:
                return hex(image_base + va + offset - file_offset)
        return None

    pattern = re.compile(r'http|polchina|crossgate|patch|gamelist|regionlist|login|'
                         r'password|ticket|auth|\.xml|\.exe|\.ini|argsline|regkey|'
                         r'encryption|key exchange|vce_|CMD5Checksum', re.I)
    strings = []
    for regex, encoding in [(rb'[\x20-\x7e]{5,}', 'ascii'),
                             (rb'(?:[\x20-\x7e]\x00){5,}', 'utf-16le')]:
        for match in re.finditer(regex, data):
            text = match.group().decode(encoding)
            if pattern.search(text):
                strings.append({'offset': hex(match.start()), 'va': address(match.start()),
                                'encoding': encoding, 'text': text})
    return {'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data),
            'image_base': hex(image_base), 'selected_strings': strings}


def inspect_xml(path):
    data = path.read_bytes()
    text = data.decode('gb18030')
    bare_amp = re.compile(r'&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-fA-F]+;)')
    # Evidence normalization only. Original bytes remain untouched and are hashed.
    normalized, repair_count = bare_amp.subn('&amp;', text)
    root = ET.fromstring(normalized)
    items = []
    elements = root.findall('./Games/Game') + root.findall('./Regions/Region')
    for element in elements:
        item = {'attributes': element.attrib, 'name': element.findtext('Name')}
        if element.tag == 'Game':
            for key in ['EXE', 'PatchEXE', 'ConfigEXE', 'Argsline', 'RegKey',
                        'RegValue', 'SpeFile', 'OfficialSite']:
                item[key] = element.findtext(key)
            item['regions'] = [child.text for child in element.findall('Regions/Region')]
        else:
            item['BIP_ports'] = [child.get('Port') for child in element.findall('BList/BIP')]
            item['PPort'] = element.findtext('PPort')
            item['gamecodes'] = [child.get('Gamecode') for child in element.findall('Arglist/Args')]
            item['server_parameter_count'] = sum(len(re.findall(r'IP:\d+:', child.text or ''))
                                                 for child in element.findall('Arglist/Args'))
        items.append(item)
    return {'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data),
            'encoding_used': 'gb18030', 'bare_ampersands_repaired_in_analysis_memory_only': repair_count,
            'head': {child.tag: child.text for child in root.find('Head')}, 'items': items}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pe', type=Path, required=True, help='Explicit local unpacked PE32 sample')
    parser.add_argument('--xml-dir', type=Path, required=True, help='Explicit local extracted XML directory')
    args = parser.parse_args()
    result = {'pe': inspect_pe(args.pe), 'configs': {name: inspect_xml(args.xml_dir / name)
               for name in ['GameList.xml', 'RegionList.xml']}}
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
