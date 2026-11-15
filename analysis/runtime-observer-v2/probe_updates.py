#!/usr/bin/env python3
"""Bounded, account-free GET of five already evidenced public update paths.

Never follows a redirect, uses proxy credentials/cookies, downloads a locator
target, or executes a response. Raw public responses stay in a new private
build directory; the delivered receipt contains metadata and hashes only.
"""
import argparse
import datetime
import hashlib
import http.client
import json
from pathlib import Path
import socket
import time
from urllib.parse import urlsplit

HOST = 'launch.polchina.com.cn'
PATHS = [
    ('launcher-digest', '/Launcher/launcher_md5.dat', 4096),
    ('catalog-digests', '/Launcher/xml_md5.dat', 4096),
    ('game-catalog', '/Launcher/GameList.xml', 2 * 1024 * 1024),
    ('region-catalog', '/Launcher/RegionList.xml', 2 * 1024 * 1024),
    ('update-locator', '/Launcher/launcher_url.dat', 4096),
]


def probe(directory):
    directory.mkdir(mode=0o700)
    started = time.monotonic()
    result = dict(schema='moli.runtime-observer-v2.public-update-probe.v1',
                  started_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                  authority='user-approved networking tests; fixed paths from static evidence',
                  host=HOST, port=80, transport='HTTP, no server identity authentication',
                  cookies=False, authorization_header=False, environment_proxy=False,
                  redirects_followed=False, retries=0, original_sample_executions=0,
                  requests=[], status='not-started')
    try:
        result['dns_addresses'] = sorted({s[4][0] for s in socket.getaddrinfo(
            HOST, 80, type=socket.SOCK_STREAM)})
        for label, path, budget in PATHS:
            if time.monotonic() - started >= 55:
                result['status'] = 'stopped-total-budget'
                break
            request_start = time.monotonic()
            connection = http.client.HTTPConnection(HOST, 80, timeout=8)
            row = dict(label=label, path=path, method='GET', body_budget=budget)
            result['requests'].append(row)
            try:
                connection.request('GET', path, headers={
                    'Accept-Encoding': 'identity', 'Connection': 'close'})
                response = connection.getresponse()
                row['http_status'] = response.status
                row['headers'] = {key: response.getheader(key) for key in [
                    'Content-Type', 'Content-Length', 'Last-Modified', 'ETag']}
                location = response.getheader('Location')
                if location:
                    parsed = urlsplit(location)
                    row['redirect_location_without_query'] = dict(
                        scheme=parsed.scheme, host=parsed.hostname, path=parsed.path)
                body = response.read(budget + 1)
                row['bytes_read'] = len(body)
                if len(body) > budget:
                    result['status'] = 'stopped-response-budget'
                    break
                row['sha256'] = hashlib.sha256(body).hexdigest()
                row['md5'] = hashlib.md5(body).hexdigest()
                with (directory / (label + '.response')).open('xb') as stream:
                    stream.write(body)
                if response.status != 200:
                    result['status'] = 'stopped-http-status'
                    break
                if body.startswith(b'MZ'):
                    result['status'] = 'stopped-unexpected-executable'
                    break
            except (OSError, http.client.HTTPException) as error:
                row['error_type'] = type(error).__name__
                row['error'] = str(error)[:240]
                result['status'] = 'stopped-transport-error'
                break
            finally:
                row['elapsed_ms'] = round((time.monotonic() - request_start) * 1000)
                connection.close()
        else:
            result['status'] = 'all-five-http200'
    except OSError as error:
        result['status'] = 'stopped-dns-error'
        result['error_type'] = type(error).__name__
        result['error'] = str(error)[:240]
    result['elapsed_ms'] = round((time.monotonic() - started) * 1000)
    result['limits'] = [
        'Bare evidenced paths, no native rtm query or WinINet emulation.',
        'HTTP200 and MD5 do not establish publisher identity, latest version or authentication.',
        'Only metadata/XML/locator contents requested, never a locator payload or game service.',
        'Host tests do not prove Windows VM networking or original client acceptance.',
    ]
    with (directory / 'network-receipt.json').open('x') as stream:
        json.dump(result, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-directory', required=True, type=Path)
    args = parser.parse_args()
    receipt = probe(args.output_directory)
    print(json.dumps(receipt, ensure_ascii=False))
    raise SystemExit(0 if receipt['status'] == 'all-five-http200' else 2)
