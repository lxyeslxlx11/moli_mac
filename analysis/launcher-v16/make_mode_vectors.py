#!/usr/bin/env python3
"""Original non-secret mode policy table, independent of the JavaScript implementation."""
import json

SECTION = 'Original.Settings'


def result(state, mode, retention=None, clear=False, write=False):
    return {'state': state, 'mode': mode, 'retention': retention, 'clearInputs': clear,
            'writeRequested': {'section': SECTION, 'key': 'UserMode', 'value': mode} if write else None,
            'authentication': 'unverified', 'persistence': 'unconfirmed'}


def flags(mode, initial=False, remember=False):
    return {'rememberUsername': True if mode == 1 else remember if initial else False,
            'rememberPassword': False, 'passwordControlVisible': mode == 1}


def make_vectors():
    rows = []
    for recorded in (1, 2):
        for remember in (False, True):
            rows.append({'kind': 'initialization', 'input': {'recordedMode': recorded,
                         'initialRememberUsername': remember, 'settingsSection': SECTION},
                         'expected': result('initialized', recorded, flags(recorded, True, remember))})
    for recorded in (-1, 0, 3, 0xffffffff):
        for remember in (False, True):
            for choice in (None, 1, 2, 'cancel'):
                state = 'choice-required' if choice is None else 'cancelled' if choice == 'cancel' else 'initialized'
                mode = choice if isinstance(choice, int) else None
                rows.append({'kind': 'initialization', 'input': {'recordedMode': recorded,
                             'initialRememberUsername': remember, 'settingsSection': SECTION, 'choice': choice},
                             'expected': result(state, mode, flags(mode, True, remember) if mode else None,
                                                write=mode is not None)})
    for current in (1, 2):
        for requested in (1, 2, 'cancel'):
            for confirm in (None, False, True):
                data = {'currentMode': current, 'requestedMode': requested,
                        'settingsSection': SECTION, 'confirmMode1': confirm}
                if requested == 'cancel':
                    expected = result('cancelled', current)
                elif current == 2 and requested == 1 and confirm is not True:
                    expected = result('confirmation-required' if confirm is None else 'declined', current)
                else:
                    expected = result('changed', requested, flags(requested), True, True)
                rows.append({'kind': 'change', 'input': data, 'expected': expected})
    return {'schema': 'moli.launcher-v16.original-mode-vectors.v1',
            'scope': 'Independent Python policy table from fixed native branches plus explicitly separate strict cancel/confirmation/section policies. Original non-secret values only; not runtime compatibility.',
            'vectors': rows}


if __name__ == '__main__':
    print(json.dumps(make_vectors(), ensure_ascii=False, indent=2))
