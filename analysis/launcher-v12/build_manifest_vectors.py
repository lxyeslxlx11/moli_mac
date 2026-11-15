#!/usr/bin/env python3
"""Independent Python byte/hashlib model of fixed launcher metadata branches; original data only."""
from pathlib import Path
import hashlib
import json
import re


def digest(data):
    return hashlib.md5(data).hexdigest()


def response(data):
    if b'\0' in data:
        return {'error': 'MANIFEST_NUL'}
    if any(byte >= 127 or (byte < 32 and byte not in (9, 10, 11, 12, 13)) for byte in data):
        return {'error': 'MANIFEST_CHARACTER'}
    text = data.decode('ascii')
    for char in (' ', '\n', '\r'):
        text = text.rstrip(char).lstrip(char)
    normalized = len(text)
    if not re.fullmatch('[0-9a-fA-F]{32}', text[:32]):
        return {'error': 'MANIFEST_DIGEST'}
    return {'md5': text[:32].lower(), 'inputBytes': len(data), 'trimmedBytes': len(data) - normalized,
            'normalizedBytes': normalized, 'truncatedBytes': max(0, normalized - 32), 'truncated': normalized > 32, 'trust': 'unverified'}


def main():
    launcher = b'Original launcher public fixture bytes\0\xff\x81'
    games = b'Original game catalog raw bytes\r\n\x81'
    regions = b'Original region catalog raw bytes\n\xff'
    h = digest(launcher).encode()
    values = [h, h.upper(), b' ' + h + b' ', b'\n' + h + b'\n', b'\r' + h + b'\r',
              b' \n\r' + h + b'\r\n ', b'\r\n ' + h + b' \n\r', h + b'\n\r', h + b'\t', b'\t' + h,
              h + b'original-extra', h[:31], h[:16] + b' ' + h[16:], h + b'\0', b'\xc2\xa0' + h]
    responses = [{'body_hex': data.hex(), 'expected': response(data)} for data in values]
    plans = []
    for game_changed in (False, True):
        for region_changed in (False, True):
            remote_game = digest(b'Original changed game') if game_changed else digest(games)
            remote_region = digest(b'Original changed region') if region_changed else digest(regions)
            body = f'\t{remote_game.upper()}\r\n{remote_region}\vignored\funknown '
            order = (['gameList'] if game_changed else []) + (['regionList'] if region_changed else [])
            plans.append({'catalog_response_hex': body.encode().hex(), 'expected_disposition': 'catalog-refresh-needed' if order else 'metadata-current',
                          'game_changed': game_changed, 'region_changed': region_changed, 'refresh_order': order, 'ignored_tokens': 2})
    result = {'schema': 'moli.launcher-v12.original-manifest-vectors.v1', 'identity': 'Original public bytes/metadata only, never an actual response/credential/account.',
              'oracle': 'Python byte boundary strip sequence and hashlib; native pipeline established separately by static evidence.',
              'inputs': {'launcher_hex': launcher.hex(), 'game_list_hex': games.hex(), 'region_list_hex': regions.hex(),
                         'launcher_md5': digest(launcher), 'game_list_md5': digest(games), 'region_list_md5': digest(regions)},
              'self_responses': responses, 'catalog_plans': plans}
    Path(__file__).with_name('original-manifest-vectors.json').write_text(json.dumps(result, indent=2) + '\n')


if __name__ == '__main__':
    main()
