"""Original deterministic caller vectors. No target execution, vendor bytes or accounts."""
import itertools
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]


def quote(raw):
    escaped = re.sub(rb'(\\*)"', lambda match: b'\\' * (len(match[1]) * 2 + 1) + b'"', raw)
    tail = re.search(rb'(\\+)$', escaped)
    if tail:
        escaped += tail[1]
    result = b'"' + escaped + b'"'
    if b' ' in raw or b'\t' in raw:
        assert result.decode('latin1') == subprocess.list2cmdline([raw.decode('latin1')])
    return result


def vector(name, directory, patcher, code=b'0011', address=b'Example.invalid', port=b'00080', already=False):
    backup = patcher.upper().replace(b'.EXE', b'.BAK.EXE')
    path = directory + b'\\' + backup
    return {'name': name, 'input': {key + '_hex': value.hex() for key, value in {
        'directory': directory, 'patcher': patcher, 'codeText': code, 'address': address, 'port': port}.items()},
        'alreadyPatched': already, 'expected': {
            'commandLine_hex': (quote(path) + b' ' + address + b' ' + port + b'\0').hex(),
            'applicationName_hex': (path + b'\0').hex(), 'backupPatcherPath_hex': (path + b'\0').hex(),
            'workingDirectory_hex': (directory + b'\0').hex(), 'backupName_hex': backup.hex(),
            'packagedSourceRelative_hex': (code + b'\\' + patcher + b'\0').hex(),
            'disposition': 'already-patched' if already else 'no-patcher' if not patcher else 'patch-requested'}}


rows = [vector('plain', b'C:\\Original', b'patch.exe'), vector('spaces', b'C:\\Original Folder', b'patch.exe'),
        vector('no-patcher', b'C:\\Original', b''), vector('skip', b'C:\\Original', b'patch.exe', already=True),
        vector('raw-endpoint', b'C:\\Original', b'patch.exe', address=b'Example.invalid raw', port=b'00080'),
        vector('mbcs-directory-byte', b'C:\\Original\x81\x5c', b'patch.exe')]
for length in range(6):
    for ordinal, chars in enumerate(itertools.product(b'a\\"', repeat=length)):
        rows.append(vector(f'quote-{length}-{ordinal}', b'C:\\Original Folder', b'patch.exe' + bytes(chars)))

polls = []
for has_process, query_ok, exit_code, start, now, warned in [
        (False, False, 0, 0, 0, False), (False, True, 100, 0, 9, False),
        (True, False, 100, 0, 1800000, False), (True, False, 102, 0, 7, True),
        *[(True, True, 259, 0, tick, warned) for tick in (0, 1799999, 1800000, 1800001, 4294967295) for warned in (False, True)],
        (True, True, 259, 4294967200, 1799904, False), (True, True, 259, 4294967295, 0, False),
        *[(True, True, code, 7, 8, False) for code in (0, 100, 101, 102, 0xc0000005, 4294967295)]]:
    elapsed = (now - start) % (2**32)
    state = 'no-process' if not has_process else 'query-failed' if not query_ok else 'running' if exit_code == 259 else 'exited'
    warn = state == 'running' and not warned and elapsed >= 1800000
    polls.append({'input': dict(zip(['hasProcess', 'querySucceeded', 'exitCode', 'startTick', 'nowTick', 'warningShown'],
                                   [has_process, query_ok, exit_code, start, now, warned])),
                  'expected': {'disposition': state, 'elapsedMs': elapsed, 'warn': warn, 'warningShown': warned or warn,
                               'continuePolling': state in ('running', 'query-failed'), 'killTimer': state in ('no-process', 'exited'),
                               'closeProcess': state == 'exited', 'clearProcess': state == 'exited', 'dispatchExit': state == 'exited',
                               'exitCode': exit_code if has_process and query_ok else None}})

output = {'schema': 'moli.original-current-patch-vectors.v1', 'producer': 'original_vectors.py; Python stdlib cross-check for paths containing space',
          'original_synthetic_only': True, 'commands': rows, 'polls': polls}
target = Path(__file__).with_name('original-vectors.json')
target.write_text(json.dumps(output, indent=2) + '\n')
print(json.dumps({'commands': len(rows), 'polls': len(polls), 'output': str(target.relative_to(ROOT))}))
