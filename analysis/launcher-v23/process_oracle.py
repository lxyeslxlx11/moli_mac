"""Original snapshot vectors and fixed-sample anchors; no executable or network use."""
import argparse, hashlib, importlib.util, json, re, sys
from pathlib import Path
sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]
SHA = '601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'
GROUPS = [('bin-anime', r'\Bin\anime*.bin'), ('bin-graphic', r'\Bin\graphic*.bin'),
          ('puk2-anime', r'\Bin\Puk2\anime*.bin'), ('puk2-graphic', r'\Bin\Puk2\graphic*.bin'),
          ('puk3-anime', r'\Bin\Puk3\anime*.bin'), ('puk3-graphic', r'\Bin\Puk3\graphic*.bin'),
          ('bin-coordinate', r'\Bin\coordinate*.bin')]

def transformed(name):
    # Last-dot basename extraction; re.sub avoids the JS split/join implementation.
    title = name.rpartition('.')[0] if '.' in name else name
    title = title.lower()
    title = re.sub(r'(?<=.)_([^_]*)$', r':\1', title)
    for term in ('info', 'graphic', 'anime', 'coordinate'):
        if term in title:
            return re.sub(term, lambda match: match[0] + 'bin', title)
    return title

def resource(entries):
    rows = []
    for ordinal, (name, attr) in enumerate(entries):
        if attr & 16:
            continue
        rows.append({'source_ordinal': ordinal, 'file_name': name, 'argument': transformed(name)})
    return {'bytes_hex': ''.join(' ' + row['argument'] for row in rows).encode('ascii').hex(), 'rows': rows,
            'entries_seen': len(entries), 'skipped_directories': sum(bool(attr & 16) for _, attr in entries)}

def expected(case):
    code, refresh = case['game_code'], case['only_refresh_word']
    fields = {key: bytes.fromhex(case[key + '_hex']) for key in ('directory', 'executable_path', 'args_line', 'region_args', 'galaxy_args')}
    # The unconditional first separator is observable even when Argsline is empty.
    command = fields['executable_path'] + b' ' + b' '.join([fields['args_line']] +
              [fields[key] for key in ('region_args', 'galaxy_args') if fields[key]])
    cg = code in (0, 1, 2, 4, 11)
    wanted = cg and not refresh
    groups = []
    if wanted:
        for descriptor, snapshot in zip(GROUPS, case['resource_groups']):
            result = resource(snapshot['entries']) if snapshot['state'] == 'enumerated' else resource([])
            command += bytes.fromhex(result['bytes_hex'])
            groups.append({'id': descriptor[0], 'pattern_hex': (fields['directory'] + descriptor[1].encode('ascii') + b'\0').hex(),
                           'state': snapshot['state'], **result})
    suffix = {3: b'\\Bin\\', 5: b'\\GBrowser\\'}.get(code, b'')
    return {'command_line_hex': (command + b'\0').hex(), 'working_directory_hex': (fields['directory'] + suffix + b'\0').hex(),
            'resource_enumeration_requested': wanted, 'client_creation_requested': not (cg and bool(refresh)), 'groups': groups}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pe', required=True, type=Path)
    args = parser.parse_args()
    data = args.pe.read_bytes()
    if hashlib.sha256(data).hexdigest() != SHA:
        raise ValueError('Fixed sample identity mismatch before parsing.')
    spec = importlib.util.spec_from_file_location('launch_anchor_verifier', ROOT / 'analysis/protocol-v3/launch/verify_launch.py')
    helper = importlib.util.module_from_spec(spec); spec.loader.exec_module(helper)
    pe = helper.PE32(data); anchors = []
    def literal(label, va, target, value):
        anchors.append({'id': label, 'va': hex(va), 'kind': 'literal_reference', 'target': hex(target), 'literal': value})
    def call(label, va, target):
        anchors.append({'id': label, 'va': hex(va), 'kind': 'direct_call', 'target': hex(target)})
    for label, va, target in [('base-separator', 0x407e50, 0x4b2a70), ('region-separator', 0x407e8f, 0x4b2a74),
                              ('galaxy-separator', 0x407ec9, 0x4b2a78), ('resource-separator', 0x408a48, 0x4b2ce4)]:
        literal(label, va, target, ' ')
    for (group, suffix), va, target in zip(GROUPS, [0x408001, 0x408083, 0x408105, 0x408187, 0x408209, 0x40828b, 0x40830d],
                                          [0x4b2aa0, 0x4b2ab4, 0x4b2ac8, 0x4b2ae0, 0x4b2afc, 0x4b2b14, 0x4b2b30]):
        literal(group, va, target, '%s' + suffix)
    literal('code3-working-directory', 0x4083a9, 0x4b2b48, '%s\\Bin\\')
    literal('code5-working-directory', 0x4083df, 0x4b2b60, '%s\\GBrowser\\')
    for row in [('find-file', 0x408890, 0x4335fc), ('next-file', 0x408903, 0x43326b), ('is-dots', 0x40890e, 0x43352c),
                ('file-title', 0x408920, 0x433736), ('is-directory', 0x40894d, 0x40b2c0), ('lower', 0x40895d, 0x4093f0),
                ('logical-length', 0x408965, 0x40bd50), ('last-underscore-write', 0x4089a1, 0x4097d0),
                ('append-space', 0x408a55, 0x409520), ('append-title', 0x408a72, 0x409470),
                ('append-current-length', 0x40aa2a, 0x40bd50), ('append-current-data', 0x40aa33, 0x40bd70),
                ('length-header', 0x40bd5a, 0x40c910), ('resource-first-group', 0x40803d, 0x408840),
                ('format-narrow', 0x40e823, 0x44f843), ('title-splitpath', 0x43377e, 0x4530c3)]:
        call(*row)
    for label, va, target, text in [('info-find', 0x4089ac, 0x4b2c6c, 'info'), ('info-replacement', 0x4089bd, 0x4b2c74, 'infobin'),
                                   ('graphic-find', 0x4089d3, 0x4b2c84, 'graphic'), ('graphic-replacement', 0x4089e4, 0x4b2c8c, 'graphicbin'),
                                   ('anime-find', 0x4089fa, 0x4b2ca0, 'anime'), ('anime-replacement', 0x408a0b, 0x4b2ca8, 'animebin'),
                                   ('coordinate-find', 0x408a21, 0x4b2cbc, 'coordinate'), ('coordinate-replacement', 0x408a32, 0x4b2cc8, 'coordinatebin')]:
        literal(label, va, target, text)
    for label, va, length in [('exclude-index-zero', 0x40897e, 6), ('compare-underscore', 0x408993, 3),
                               ('replacement-colon', 0x408998, 2), ('current-buffer-swap', 0x433290, 14),
                               ('length-read-plus-four', 0x40bd5f, 3), ('data-header-minus-sixteen', 0x40c91c, 3),
                               ('lower-map-flag', 0x44e1e5, 5), ('file-title-capacity', 0x433766, 5),
                               ('resource-code-and-refresh-branch', 0x407f94, 81),
                               ('process-refresh-and-code-branch', 0x408518, 75),
                               ('process-arguments-and-branch', 0x40854b, 68)]:
        anchors.append({'id': label, 'va': hex(va), 'kind': 'instruction_bytes', 'expected_hex': pe.at(va, length).hex()})
    anchors.append({'id': 'CreateProcessA', 'va': '0x408589', 'kind': 'iat_call', 'target': '0x4b136c', 'api': 'CreateProcessA'})
    manifest = {'sample': {'sha256': SHA, 'bytes': len(data)}, 'anchors': anchors}
    audit = helper.verify(data, manifest)
    directory = Path(__file__).parent
    def write(name, value):
        (directory / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    write('process-anchors.json', manifest); write('process-anchor-audit.json', audit)
    names = ['GraphicInfo_Joy_22.bin', 'ANIME_1_2.bin', '_ANIME.bin', '__Anime__.bin', 'InfoInfo_1.bin',
             'Graphic.foo.bin', '.bin', 'Title.', 'NoExtension', 'COORDINATE_99.bin', 'InfoGraphicAnime_7.bin',
             'graphic_1.bin', 'graphic_1.bin', 'last_7.bin']
    entries = [('.', 16), ('..', 16), ('AnimeDir_5.bin', 16)] + [(name, 0x22 if i == 3 else 0x20) for i, name in enumerate(names)]
    resource_cases = [{'name': 'ordered-final-duplicate-and-directory', 'state': 'enumerated', 'entries': entries, 'expected': resource(entries)},
                      {'name': 'only-final-row', 'state': 'enumerated', 'entries': [('Anime_1.bin', 32)], 'expected': resource([('Anime_1.bin', 32)])},
                      {'name': 'empty-enumeration', 'state': 'enumerated', 'entries': [], 'expected': resource([])},
                      {'name': 'find-failed', 'state': 'find-failed', 'expected': resource([])}]
    cases = []
    def case(label, code, refresh, fields=None, resources=None):
        raw = {'directory': b'D:\\Original Root', 'executable_path': b'D:\\Original Root\\OriginalClient.exe',
               'args_line': b'--original base', 'region_args': b'--region 2', 'galaxy_args': b'--galaxy original'}
        raw.update(fields or {})
        groups = resources if resources is not None else [{'id': group, 'state': 'enumerated', 'entries': [(f'{group.replace("-", "")}_{i}.bin', 32)]} for i, (group, _) in enumerate(GROUPS)]
        value = {'name': label, 'game_code': code, 'only_refresh_word': refresh, **{key + '_hex': val.hex() for key, val in raw.items()}, 'resource_groups': groups}
        value['expected'] = expected(value); cases.append(value)
    for code in range(15):
        for refresh in (0, 1, 0xffffffff):
            case('code-%d-refresh-%d' % (code, refresh), code, refresh)
    case('empty-all', 11, 0, {key: b'' for key in ('directory', 'executable_path', 'args_line', 'region_args', 'galaxy_args')},
         [{'id': group, 'state': 'find-failed'} for group, _ in GROUPS])
    case('preserve-spaces-quotes-tabs-high-bytes', 11, 0, {'directory': b'C:\\Root\\', 'executable_path': b'"C:\\Root\\A B.exe"',
         'args_line': b'  \t--raw "x"\xff ', 'region_args': b' ', 'galaxy_args': b'\x80\xfe'},
         [{'id': group, 'state': 'enumerated', 'entries': entries if i == 0 else []} for i, (group, _) in enumerate(GROUPS)])
    case('double-slash-working-directory', 3, 0, {'directory': b'C:\\Root\\'})
    write('original-process-vectors.json', {'schema': 'moli.launcher-v23.original-process-vectors.v1',
          'identity': 'Original public byte fields and filenames only. No game assets, account or session material.',
          'oracle': 'Independent Python bytes composition and regular-expression replacement. Source anchors checked separately; synthetic vectors do not prove native runtime or game acceptance.',
          'resource_cases': resource_cases, 'cases': cases})
    print(json.dumps({'source_anchors': audit['count'], 'all_anchors_passed': audit['all_passed'],
                      'process_vectors': len(cases), 'resource_vectors': len(resource_cases)}))

if __name__ == '__main__':
    main()
