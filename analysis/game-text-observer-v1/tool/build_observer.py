"""Build the original fixed .text reader. Does not execute any Windows image."""
from pathlib import Path
import hashlib
import json
import re
import shutil
import struct
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[3]
SOURCE = Path(__file__).resolve().parent
OUT = ROOT / 'build/analysis/game-text-observer-v1/tool'
OUT.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(ROOT / 'analysis/game-entry-v1/probe'))
from pe_layout import validate_own_x86_layout

FIXTURE = ROOT / 'build/analysis/game-entry-v1/probe-stage101/entry-fixture.exe'
FIXTURE_SHA = 'cf8bd654d9daf5c222f5a8ee565085013cf284ee74165a25558c5bbe0cf41c2a'
GAME_SHA = '9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126'
GAME_PATH = 'C:\\Program Files (x86)\\PlayOnline\\魔力宝贝\\cg_se_3000.exe'
FIXTURE_PATH = 'C:\\MoliOffline\\observer-fixture\\entry-fixture.exe'
DEST = 'C:\\MoliOffline\\game-text-observer-stage115\\'
CC = shutil.which('i686-w64-mingw32-gcc')
CLANG = shutil.which('clang')
NM = shutil.which('i686-w64-mingw32-nm')
OBJDUMP = shutil.which('i686-w64-mingw32-objdump')
assert all((CC, CLANG, NM, OBJDUMP)), 'Requires existing compilers and binutils; no auto-install.'
commands = []


def run(argv):
    result = subprocess.run([str(x) for x in argv], cwd=ROOT, capture_output=True,
                            text=True, check=False)
    commands.append({'argv': [str(x) for x in argv], 'exit_code': result.returncode,
                     'stdout': result.stdout, 'stderr': result.stderr})
    (OUT / 'build-commands.json').write_text(json.dumps(commands, indent=2) + '\n')
    if result.returncode:
        raise RuntimeError('Build/check failed; see private build-commands.json.')
    return result.stdout


def identity(path):
    data = path.read_bytes()
    return {'path': str(path.relative_to(ROOT)), 'bytes': len(data),
            'sha256': hashlib.sha256(data).hexdigest()}


def profiles_in_pe(path, symbols):
    data = path.read_bytes()
    layout = validate_own_x86_layout(data)
    pe = struct.unpack_from('<I', data, 60)[0]
    optional = pe + 24
    assert struct.unpack_from('<H', data, pe + 4)[0] == 0x14c
    assert struct.unpack_from('<H', data, optional)[0] == 0x10b
    base = struct.unpack_from('<I', data, optional + 28)[0]
    flags = struct.unpack_from('<H', data, optional + 70)[0]
    assert flags & 0x140 == 0x140, 'Keep ASLR/NX.'

    def read(va, count):
        rva = va - base
        selected = [s for s in layout['sections']
                    if s['rva'] <= rva and rva + count <= s['rva'] + s['raw_bytes']]
        assert len(selected) == 1 and count > 0
        return data[selected[0]['file_offset'] + rva - selected[0]['rva']:
                    selected[0]['file_offset'] + rva - selected[0]['rva'] + count]

    def string(va, wide=False):
        width = 2 if wide else 1
        value = bytearray()
        for index in range(512):
            part = read(va + index * width, width)
            if part == bytes(width):
                return value.decode('utf-16-le' if wide else 'ascii', errors='strict')
            value.extend(part)
        raise AssertionError('Unterminated linked profile string.')

    matches = re.findall(r'^([0-9a-fA-F]+)\s+[rRdD]\s+_profiles$', symbols, re.M)
    assert len(matches) == 1
    table = int(matches[0], 16)
    rows = []
    for index in range(2):
        name, image, final, digest, image_bytes, text_rva, text_bytes, output = struct.unpack(
            '<8I', read(table + index * 32, 32))
        rows.append({'name': string(name), 'path': string(image, True),
                     'final_path': string(final, True), 'sha256': read(digest, 32).hex(),
                     'image_bytes': image_bytes, 'text_rva': text_rva,
                     'text_bytes': text_bytes, 'output': string(output, True)})
    expected = []
    for name, image, digest, image_bytes, text_bytes, leaf in [
            ('fixture', FIXTURE_PATH, FIXTURE_SHA, 0xe82000, 6624, 'fixture-text.bin'),
            ('game-installed', GAME_PATH, GAME_SHA, 0x103b000, 1753452, 'game-text.bin')]:
        expected.append({'name': name, 'path': image, 'final_path': '\\\\?\\' + image,
                         'sha256': digest, 'image_bytes': image_bytes, 'text_rva': 0x1000,
                         'text_bytes': text_bytes, 'output': DEST + leaf})
    assert rows == expected, 'Linked whitelist or UTF16 destination differs.'
    return {'table_va': table, 'rows': rows, 'dll_characteristics': flags,
            'layout_validation': layout}


assert identity(FIXTURE)['sha256'] == FIXTURE_SHA
fixture_layout = validate_own_x86_layout(FIXTURE.read_bytes())
text = next(s for s in fixture_layout['sections'] if s['rva'] == 4096)
fixture_data = FIXTURE.read_bytes()
fixture_pe = struct.unpack_from('<I', fixture_data, 60)[0]
fixture_table = fixture_pe + 24 + struct.unpack_from('<H', fixture_data, fixture_pe + 20)[0]
assert fixture_data[fixture_table:fixture_table + 8].rstrip(b'\0') == b'.text'
assert text['rva'] == 4096 and text['virtual_bytes'] == 6624
header = ROOT / 'build/analysis/game-entry-v1/probe-stage101/fixture_identity.h'
shutil.copyfile(header, OUT / 'fixture_identity.h')
old = (ROOT / 'analysis/game-entry-v1/probe/callback_probe.c').read_text()
source = (SOURCE / 'text_observer.c').read_text()
extract_hash = lambda content: content[content.index('static int hash_image('):content.index('\nint main(')]
assert extract_hash(old) == extract_hash(source), 'Reused disk-hash guard must remain unchanged.'
assert source.count('ReadProcessMemory(') == 1, 'Exactly one target-byte read call site.'
assert 'PROCESS_VM_READ | SYNCHRONIZE' in source
assert 'CREATE_NEW' in source and 'OPEN_ALWAYS' not in source and 'CREATE_ALWAYS' not in source
version = run([CC, '--version']).splitlines()[0]
host_test = OUT / 'text-core-test'
run([CLANG, '-std=c11', '-O2', '-Wall', '-Wextra', '-Werror',
     SOURCE / 'text_core_test.c', '-o', host_test])
host_output = run([host_test]).strip()
assert re.fullmatch(r'MOLI_TEXT_CORE assertions=(\d+) pass=\1 win32_execution=0', host_output)
flags = ['-std=c11', '-O2', '-Wall', '-Wextra', '-Werror',
         '-Wl,--no-insert-timestamp,--dynamicbase,--nxcompat']
exe = OUT / 'text-observer.exe'
args = [CC, *flags, '-I', OUT, SOURCE / 'text_observer.c', '-lbcrypt', '-o', exe]
run(args)
first = exe.read_bytes()
run(args)
assert first == exe.read_bytes(), 'Repeat own builds differ.'
profile_check = profiles_in_pe(exe, run([NM, '-n', exe]))
imports_text = run([OBJDUMP, '-p', exe])
(OUT / 'objdump-pe.txt').write_text(imports_text)
imports = sorted(set(re.findall(r'^\s+[0-9a-fA-F]+\s+(?:<none>\s+)?[0-9a-fA-F]+\s+([A-Za-z_][A-Za-z0-9_@]+)\s*$', imports_text, re.M)))
assert {'ReadProcessMemory', 'VirtualQueryEx', 'OpenProcess', 'CreateFileW'}.issubset(imports)
forbidden = {'WriteProcessMemory', 'VirtualProtectEx', 'CreateRemoteThread',
             'SetThreadContext', 'SuspendThread', 'ResumeThread', 'DebugActiveProcess',
             'CreateProcessA', 'CreateProcessW', 'TerminateProcess', 'AdjustTokenPrivileges',
             'OpenProcessToken', 'ShellExecuteA', 'ShellExecuteW'}
assert not forbidden.intersection(imports)
report = {'schema': 'moli.game-text-observer-v1.host-validation.v1',
          'plan': 'analysis/game-text-observer-v1/plan.json',
          'compiler_version': version, 'host_output': host_output,
          'host_test_exit': 0, 'repeat_build_identical': True,
          'disk_hash_function_unchanged_from_stage105': True,
          'single_target_read_call_site': True,
          'fixture': identity(FIXTURE), 'fixture_text': text,
          'observer': identity(exe), 'compiled_profile_check': profile_check,
          'imports': imports, 'forbidden_direct_imports_absent': sorted(forbidden),
          'sources': [identity(SOURCE / name) for name in
                      ['text_observer.c', 'text_core.h', 'text_core_test.c', 'build_observer.py']]
                     + [identity(ROOT / 'analysis/game-entry-v1/probe/probe_core.h')],
          'scope': 'Original host boundary assertions, own PE layout/profile/import checks only.',
          'limitations': ['No Windows image executed; no actual Windows API, x86/ARM64, ASLR or page evidence.',
                         'Import inventory is static; own CRT may import VirtualProtect for its own relocations, not VirtualProtectEx.',
                         'Snapshot remains private. One read is not atomic/stable or proof of unpacking, consumer meaning or compatibility.',
                         'No whole-operation hard deadline; local synchronous calls can exceed loop checkpoints.'],
          'windows_fixture_qualified': False, 'game_executed_or_read': False,
          'game_consumers_recovered': False, 'full_goal_complete': False}
(OUT / 'host-validation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
(ROOT / 'analysis/game-text-observer-v1/host-validation.json').write_text(
    json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'host_output': host_output, 'deterministic': True,
                  'linked_profiles': 2, 'observer': report['observer'], 'windows_execution': False}))
