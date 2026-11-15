"""Original first-Config byte plans and outcome vectors; no native execution or real accounts."""
from pathlib import Path
import hashlib
import itertools
import json

HERE = Path(__file__).resolve().parent
vectors = []
for index, (username, configurer, word) in enumerate(itertools.product(
        [b'', b'OriginalU1', bytes([128, 254, 1]), bytes(range(1, 17))],
        [b'', b' tools/Config.exe '], [0, 1, 0xffffffff])):
    code = b'0011' if index % 2 else b'11'
    directory = b'C:\\Original Folder\\' if index % 3 == 0 else b'C:\\Original'
    disposition = 'flag-clear' if word == 0 else 'no-configuration-program' if not configurer else 'configuration-requested'
    vectors.append({'name': 'original-first-config-' + str(index),
                    'input': {'username_hex': username.hex(), 'codeText_hex': code.hex(), 'directory_hex': directory.hex(),
                              'configurer_hex': configurer.hex(), 'firstConfigWord': word},
                    'expected': {'disposition': disposition,
                                 'section_hex': (hashlib.md5(username).hexdigest().encode() + b'\0').hex(),
                                 'key_hex': (b'Game' + code + b'_Config\0').hex(),
                                 'command_hex': (directory + b'\\' + configurer + b'\0').hex() if disposition == 'configuration-requested' else '',
                                 'cwd_hex': (directory + b'\0').hex() if disposition == 'configuration-requested' else ''}})
outcomes = []
for disposition in ['flag-clear', 'no-configuration-program', 'configuration-requested']:
    for created, returned in [(False, False), (True, False), (True, True)]:
        result = 'not-requested' if disposition != 'configuration-requested' else 'create-failed-continue' if not created else 'waiting' if not returned else 'profile-write-requested'
        outcomes.append({'input': {'planDisposition': disposition, 'processCreated': created, 'waitReturned': returned},
                         'expected': {'disposition': result, 'waiting': result == 'waiting',
                                      'writeRequested': result == 'profile-write-requested',
                                      'writeValue': 0 if result == 'profile-write-requested' else None,
                                      'continueContextPreparation': result != 'waiting'}})
with (HERE / 'original-first-config-vectors.json').open('x') as output:
    json.dump({'schema': 'moli.launcher-v30.original-first-config-vectors.v1',
               'source': 'Python hashlib and original synthetic bytes; lookup identity is account-derived but no real account is used.',
               'vectors': vectors, 'outcomes': outcomes}, output, indent=2)
    output.write('\n')
