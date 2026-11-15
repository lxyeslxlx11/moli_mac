"""Original source-contract vectors; hashlib/bytes operations are independent of JS.

No shipped strings, assets or executable code are copied into these fixtures.
The two response formats have explicitly assigned rejection expectations.
"""
import hashlib
import json
from pathlib import Path

launcher = b'Original current metadata identity\x00'
digest = hashlib.md5(launcher).hexdigest()
self_cases = []
locator_cases = []


def self_ok(name, body):
    normalized = body.strip(b' \r\n')
    prefix = normalized[:32].decode('ascii')
    self_cases.append(dict(name=name, body_hex=body.hex(), expected=dict(
        md5=prefix.lower(), comparisonText=prefix, inputBytes=len(body),
        trimmedBytes=len(body) - len(normalized), normalizedBytes=len(normalized),
        truncatedBytes=max(0, len(normalized) - 32), truncated=len(normalized) > 32,
        trust='unverified')))


def self_bad(name, body, error):
    self_cases.append(dict(name=name, body_hex=body.hex(), expected_error=error))


h = digest.encode('ascii')
self_ok('plain-lowercase', h)
self_ok('plain-uppercase-keeps-comparison-case', h.upper())
self_ok('interleaved-three-character-boundaries', b'\r\n \r ' + h + b' \n\r \n')
self_ok('spaces-only-boundaries', b'   ' + h + b'  ')
self_ok('crlf-boundaries', b'\r\n' + h + b'\n\r')
self_ok('prefix-cut-with-ascii-suffix', h + b'ORIGINAL_SUFFIX')
self_ok('tab-suffix-is-cut-not-trimmed', h + b'\t')
self_ok('vertical-tab-suffix-is-cut-not-trimmed', h + b'\v')
self_ok('interior-space-after-prefix', h + b' suffix \n')
self_ok('exact-response-budget', h + b'x' * (4096 - len(h)))
self_bad('over-response-budget', h + b'x' * (4097 - len(h)), 'MANIFEST_BUDGET')
self_bad('empty', b'', 'MANIFEST_DIGEST')
self_bad('boundaries-only', b' \r\n ', 'MANIFEST_DIGEST')
self_bad('short-prefix', h[:-1], 'MANIFEST_DIGEST')
self_bad('invalid-hex-prefix', b'g' + h[1:], 'MANIFEST_DIGEST')
self_bad('tab-prefix-not-trimmed', b'\t' + h, 'MANIFEST_DIGEST')
self_bad('formfeed-prefix-not-trimmed', b'\f' + h, 'MANIFEST_DIGEST')
self_bad('space-inside-prefix', h[:15] + b' ' + h[15:], 'MANIFEST_DIGEST')
self_bad('nul-after-cut-still-outside-profile', h + b'\x00', 'MANIFEST_NUL')
self_bad('nonascii-after-cut-still-outside-profile', h + b'\x80', 'MANIFEST_CHARACTER')
self_bad('del', b'\x7f' + h, 'MANIFEST_CHARACTER')
self_bad('unsupported-control', b'\x01' + h, 'MANIFEST_CHARACTER')


def locator_ok(name, body):
    # bytes.split() uses exactly the classic six ASCII whitespace characters.
    tokens = body.split()
    locator_cases.append(dict(name=name, body_hex=body.hex(), expected=dict(
        locator=tokens[0].decode('ascii'), archiveBytesText=tokens[1].decode('ascii'),
        archiveBytes=int(tokens[1]), ignoredTokenCount=len(tokens) - 2,
        locatorValidation='native-prefix-only', trust='unverified')))


def locator_bad(name, body, error='WIN32_MANIFEST_LOCATOR'):
    locator_cases.append(dict(name=name, body_hex=body.hex(), expected_error=error))


url = b'https://updates.example.invalid/Original.zip'
locator_ok('minimum-size', url + b' 1')
locator_ok('maximum-native-size', url + b' 268435456')
locator_ok('over-independent-package-budget-still-native-valid', url + b' 33554433')
locator_ok('ten-digit-leading-zero-size', url + b' 0000000001')
locator_ok('mixed-case-http-prefix', b'HtTp://Example.invalid/P.zip 42')
locator_ok('native-prefix-only-invalid-port', b'http://host:bad/Original.zip 42')
locator_ok('native-prefix-only-internal-backslash', b'http://host/a\\b.zip 42')
locator_ok('surplus-tokens', url + b' 42 ignored original')
locator_ok('exact-url-byte-budget', b'http://' + b'a' * 248 + b' 42')
for name, separator in [('space', b' '), ('tab', b'\t'), ('lf', b'\n'),
                        ('vt', b'\v'), ('ff', b'\f'), ('cr', b'\r')]:
    locator_ok('classic-whitespace-' + name, separator + url + separator + b'42' + separator)
locator_ok('exact-independent-token-budget', url + b' 42' + b' x' * 126)
locator_bad('over-url-budget', b'http://' + b'a' * 249 + b' 42')
for name, value in [('non-http', b'file:opaque'), ('empty-host', b'http://'),
                    ('first-slash', b'https:///host'), ('first-backslash', b'https://\\host'),
                    ('pipe', b'http://host/a|b.zip'), ('quote', b'http://host/a"b.zip')]:
    locator_bad(name, value + b' 42')
for name, value in [('zero', b'0'), ('over-native-size', b'268435457'),
                    ('eleven-digits', b'00000000001'), ('negative', b'-1'),
                    ('signed', b'+1'), ('exponent', b'1e3'), ('junk', b'42x'),
                    ('fraction', b'1.0')]:
    locator_bad(name, url + b' ' + value, 'WIN32_MANIFEST_ARCHIVE_SIZE')
locator_bad('missing-size', url, 'MANIFEST_TOKENS')
locator_bad('empty', b' \t\n', 'MANIFEST_TOKENS')
locator_bad('over-independent-token-budget', url + b' 42' + b' x' * 127, 'MANIFEST_BUDGET')
locator_bad('nul', url + b' 42\x00', 'MANIFEST_NUL')
locator_bad('nonascii', url + b' 42\x80', 'MANIFEST_CHARACTER')
locator_bad('over-response-budget', url + b' 42 ' + b'x' * 4096, 'MANIFEST_BUDGET')

plans = [
    dict(name='local-current', response_hex=h.hex(), matches=True, disposition='catalog-pair-needed'),
    dict(name='local-current-mixed-boundaries', response_hex=(b' \r\n ' + h + b'\r \n').hex(), matches=True, disposition='catalog-pair-needed'),
    dict(name='uppercase-is-native-mismatch', response_hex=h.upper().hex(), matches=False,
         disposition='launcher-candidate-needed', locator_hex=(url + b' 42').hex()),
    dict(name='different-digest', response_hex=(b'f' * 32).hex(), matches=False,
         disposition='launcher-candidate-needed', locator_hex=(url + b' 42').hex()),
]
out = dict(schema='moli.launcher-current-metadata.original-vectors.v1',
           generator='Python3 standard hashlib and bytes operations; rejection cases assigned from the recorded source contract',
           notice='Original synthetic bytes only; native-prefix success does not promise an HTTP-downloadable URL.',
           inputs=dict(launcher_hex=launcher.hex(), launcher_md5=digest),
           self_responses=self_cases, locator_responses=locator_cases, plans=plans)
target = Path(__file__).with_name('original-vectors.json')
with target.open('x', encoding='utf-8') as file:
    json.dump(out, file, ensure_ascii=False, indent=2)
    file.write('\n')
print(json.dumps({key: len(out[key]) for key in ('self_responses', 'locator_responses', 'plans')}))
