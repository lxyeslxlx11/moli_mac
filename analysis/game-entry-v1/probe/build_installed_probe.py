"""Build the fixed installed-directory profile; no Windows or vendor code executes."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import struct
import subprocess

from pe_layout import validate_own_x86_layout

ROOT = Path(__file__).resolve().parents[3]
SOURCE = Path(__file__).resolve().parent
OUTPUT = ROOT / 'build/analysis/game-entry-v1/probe-stage105'
PREVIOUS = ROOT / 'build/analysis/game-entry-v1/probe-stage101'
FIXTURE_SHA = 'cf8bd654d9daf5c222f5a8ee565085013cf284ee74165a25558c5bbe0cf41c2a'
GAME_SHA = '9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126'
INSTALLED_PATH = 'C:\\Program Files (x86)\\PlayOnline\\魔力宝贝\\cg_se_3000.exe'
OUTPUT.mkdir(parents=True, exist_ok=True)
CC = shutil.which('i686-w64-mingw32-gcc')
CLANG = shutil.which('clang')
NM = shutil.which('i686-w64-mingw32-nm')
assert CC and CLANG and NM, 'Use the existing verified compiler tools.'
commands = []


def run(args):
    result = subprocess.run([str(x) for x in args], cwd=ROOT, text=True,
                            capture_output=True, check=False)
    commands.append({'argv': [str(x) for x in args], 'exit_code': result.returncode,
                     'stdout': result.stdout, 'stderr': result.stderr})
    (OUTPUT / 'build-commands.json').write_text(json.dumps(commands, indent=2) + '\n')
    if result.returncode:
        raise RuntimeError('Build/check failed; see private build-commands.json.')
    return result.stdout


def identity(path):
    data = path.read_bytes()
    return {'path': str(path.relative_to(ROOT)), 'bytes': len(data),
            'sha256': hashlib.sha256(data).hexdigest()}


def compiled_profiles(path, symbols):
    """Read the own linked PE table, independently of the C string spelling."""
    data = path.read_bytes()
    layout = validate_own_x86_layout(data)
    pe = struct.unpack_from('<I', data, 60)[0]
    optional = pe + 24
    assert struct.unpack_from('<H', data, pe + 4)[0] == 0x14c
    assert struct.unpack_from('<H', data, optional)[0] == 0x10b
    image_base = struct.unpack_from('<I', data, optional + 28)[0]
    image_bytes = struct.unpack_from('<I', data, optional + 56)[0]
    dll_flags = struct.unpack_from('<H', data, optional + 70)[0]
    assert dll_flags & 0x140 == 0x140, 'Keep ASLR and NX.'

    def read(va, count):
        rva = va - image_base
        matches = [s for s in layout['sections']
                   if s['rva'] <= rva and rva + count <= s['rva'] + s['raw_bytes']]
        assert len(matches) == 1 and count > 0, 'Own linked table pointer outside file data.'
        at = matches[0]['file_offset'] + rva - matches[0]['rva']
        return data[at:at + count]

    def string(va, wide=False):
        unit = 2 if wide else 1
        raw = bytearray()
        for index in range(512):
            item = read(va + index * unit, unit)
            if item == bytes(unit):
                return raw.decode('utf-16-le' if wide else 'ascii', errors='strict')
            raw.extend(item)
        raise AssertionError('Unterminated own profile string.')

    found = re.findall(r'^([0-9a-fA-F]+)\s+[rRdD]\s+_profiles$', symbols, re.M)
    assert len(found) == 1
    table_va = int(found[0], 16)
    rows = []
    for index in range(3):
        name, image_path, final_path, digest, image_size = struct.unpack(
            '<IIIII', read(table_va + index * 20, 20))
        rows.append({'name': string(name), 'path': string(image_path, True),
                     'final_path': string(final_path, True),
                     'sha256': read(digest, 32).hex(), 'image_bytes': image_size})
    fixture_path = 'C:\\MoliOffline\\observer-fixture\\entry-fixture.exe'
    legacy_path = 'C:\\MoliOffline\\launcher-probe\\cg_se_3000.exe'
    expected = []
    for name, image_path, digest, size in [
            ('fixture', fixture_path, FIXTURE_SHA, 0xe82000),
            ('game', legacy_path, GAME_SHA, 0x103b000),
            ('game-installed', INSTALLED_PATH, GAME_SHA, 0x103b000)]:
        expected.append({'name': name, 'path': image_path,
                         'final_path': '\\\\?\\' + image_path,
                         'sha256': digest, 'image_bytes': size})
    assert rows == expected, 'Compiled profile values or UTF16 destination differ.'
    return {'profile_table_va': table_va, 'rows': rows,
            'image_base': image_base, 'image_bytes': image_bytes,
            'dll_characteristics': dll_flags, 'layout_validation': layout}


context = json.loads((ROOT / 'analysis/game-install-context-v1/guest-installed-context-stage105.json').read_text())
assert context['installer']['ExitCode'] == 0
assert context['directory']['path_from_actual_registry'].replace('/', '\\') + '\\cg_se_3000.exe' == INSTALLED_PATH
selected_game = next(x for x in context['directory']['selected_files']
                     if x['relative_path'] == 'cg_se_3000.exe')
assert (selected_game['bytes'], selected_game['sha256']) == (2904064, GAME_SHA)
plan = json.loads((ROOT / 'analysis/game-install-context-v1/installed-observer-plan-stage105.json').read_text())
baseline = ROOT / 'build/analysis/game-install-context-v1/stage105/baseline/callback_probe.c'
assert identity(baseline)['sha256'] == plan['source_before']['sha256']
old, new = baseline.read_text(), (SOURCE / 'callback_probe.c').read_text()
assert old.split('static const struct profile profiles[]')[0] == new.split('static const struct profile profiles[]')[0]
assert old.split('static int same_path')[1] == new.split('static int same_path')[1]
fixture = PREVIOUS / 'entry-fixture.exe'
assert identity(fixture)['sha256'] == FIXTURE_SHA
assert identity(fixture)['bytes'] == 129968
shutil.copyfile(PREVIOUS / 'fixture_identity.h', OUTPUT / 'fixture_identity.h')
flags = ['-std=c11', '-O2', '-Wall', '-Wextra', '-Werror',
         '-Wl,--no-insert-timestamp,--dynamicbase,--nxcompat']
compiler_version = run([CC, '--version']).splitlines()[0]
host_test = OUTPUT / 'probe-core-test'
run([CLANG, '-std=c11', '-O2', '-Wall', '-Wextra', '-Werror',
     SOURCE / 'probe_core_test.c', '-o', host_test])
host_output = run([host_test])
assert 'assertions=26 pass=26 win32_execution=0' in host_output
observer = OUTPUT / 'callback-probe.exe'
build_args = [CC, *flags, '-I', OUTPUT, SOURCE / 'callback_probe.c',
              '-lbcrypt', '-o', observer]
run(build_args)
first = observer.read_bytes()
run(build_args)
assert first == observer.read_bytes(), 'Observer repeat builds differ.'
profile_check = compiled_profiles(observer, run([NM, '-n', observer]))
report = {'schema': 'moli.installed-observer-build.v1',
          'result': 'host-prepared-and-compiled-profile-checked; Windows-not-yet-executed',
          'plan': 'analysis/game-install-context-v1/installed-observer-plan-stage105.json',
          'compiler': CC, 'compiler_version': compiler_version,
          'host_core_output': host_output.strip(), 'host_core_exit': 0,
          'identity_guard_functions_unchanged_from_qualified_source': True,
          'repeat_build_identical': True, 'fixture_unchanged': identity(fixture),
          'observer': identity(observer), 'compiled_profile_check': profile_check,
          'sources': [identity(SOURCE / name) for name in
                      ['callback_probe.c', 'probe_core.h', 'probe_core_test.c',
                       'pe_layout.py', 'build_installed_probe.py']],
          'Windows_API_or_vendor_execution': False,
          'limits': ['Only original host assertions and own linked PE table/layout were checked.',
                     'Original fixture qualification in Windows remains a separate step.',
                     'No original game launch or callback consumer recovered.']}
(OUTPUT / 'build-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
(ROOT / 'analysis/game-entry-v1/observer-build-stage105.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'host_core_assertions': 26, 'compiled_profiles_checked': 3,
                  'guard_source_unchanged': True, 'deterministic': True,
                  'observer': report['observer'], 'Windows_execution': False}))
