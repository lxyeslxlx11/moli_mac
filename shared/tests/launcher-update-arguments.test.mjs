import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeWin32LauncherUpdateArguments, LauncherUpdateArgumentError, WIN32_LAUNCHER_UPDATE_ARGUMENT_PROFILE } from '../index.mjs';

const ascii = text => new TextEncoder().encode(text);
const text = bytes => new TextDecoder().decode(bytes);
const digest = '0123456789aBcDeF0123456789AbCdEf';
const input = () => ({ parentPid: 42, urlBytes: ascii('HtTpS://example.invalid/My  Update.pak?q=A B'),
  launcherPathBytes: ascii('C:\\Synthetic Games\\Launcher.exe'), archiveSizeBytes: ascii('000001024'), launcherMd5Bytes: ascii(digest) });
const code = (source, expected) => assert.throws(() => encodeWin32LauncherUpdateArguments(source),
  error => error instanceof LauncherUpdateArgumentError && error.code === expected);

test('source-derived golden bytes preserve five fields, adjacent spaces, zeroes and digest case', () => {
  const source = input(), before = Object.fromEntries(Object.entries(source).map(([key, value]) => [key, value instanceof Uint8Array ? value.slice() : value]));
  const result = encodeWin32LauncherUpdateArguments(source);
  assert.equal(text(result.argumentBytes), `42 HtTpS://example.invalid/My||Update.pak?q=A|B C:\\Synthetic|Games\\Launcher.exe 000001024 ${digest}`);
  assert.equal(result.archiveBytes, 1024);
  assert.equal(result.fields, 5);
  assert.equal(result.profile, 'win32-updater-arguments-ascii-v1');
  assert.ok(Object.isFrozen(result) && Object.isFrozen(WIN32_LAUNCHER_UPDATE_ARGUMENT_PROFILE));
  assert.equal(result.execution, 'not-performed');
  assert.equal(result.authentication, 'unverified');
  assert.equal(result.trust, 'unverified');
  assert.equal(result.argumentBytes.includes(0), false);
  assert.deepEqual(source, before);
});

test('maximum supported source fields produce exactly570bytes without truncation', () => {
  const source = { parentPid: 0xffffffff, urlBytes: ascii('http://a' + 'x'.repeat(247)),
    launcherPathBytes: ascii('Z:\\' + 'a'.repeat(256)), archiveSizeBytes: ascii('0268435456'), launcherMd5Bytes: ascii('F'.repeat(32)) };
  const result = encodeWin32LauncherUpdateArguments(source);
  assert.equal(result.argumentBytes.length, 570);
  assert.equal(result.argumentBytes.length, WIN32_LAUNCHER_UPDATE_ARGUMENT_PROFILE.argumentBytes);
  assert.equal(result.archiveBytes, 268435456);
  assert.deepEqual(text(result.argumentBytes).split(' '), ['4294967295', text(source.urlBytes), text(source.launcherPathBytes), '0268435456', 'F'.repeat(32)]);
});

test('own data is required and accessors are never read', () => {
  let reads = 0;
  const source = input();
  const accessor = { ...source, get urlBytes() { reads++; throw Error('not a field'); } };
  for (const value of [null, undefined, [], true, 'fields', Object.create(source), accessor,
    { ...source, extra: true }, { ...source, [Symbol('extra')]: true }]) code(value, 'UPDATE_ARGUMENT_INPUT');
  assert.equal(reads, 0);
  const plain = Object.assign(Object.create(null), source);
  assert.equal(encodeWin32LauncherUpdateArguments(Object.freeze(plain)).archiveBytes, 1024);
});

test('PID rejects zero, coercion and values outside UInt32', () => {
  for (const parentPid of [0, -0, -1, 1.5, NaN, Infinity, 0x100000000, '42', 42n, undefined]) code({ ...input(), parentPid }, 'UPDATE_ARGUMENT_PID');
  assert.ok(text(encodeWin32LauncherUpdateArguments({ ...input(), parentPid: 1 }).argumentBytes).startsWith('1 '));
});

test('field byte budgets reject oversize, truncated and empty values', () => {
  for (const [key, value] of [['urlBytes', new Uint8Array(256)], ['urlBytes', new Uint8Array()],
    ['launcherPathBytes', ascii('C:\\')], ['launcherPathBytes', new Uint8Array(260)],
    ['archiveSizeBytes', ascii('00000000001')], ['archiveSizeBytes', new Uint8Array()],
    ['launcherMd5Bytes', ascii('f'.repeat(31))], ['launcherMd5Bytes', ascii('f'.repeat(33))]]) {
    code({ ...input(), [key]: value }, 'UPDATE_ARGUMENT_LENGTH');
  }
});

test('URL and path reject ambiguous delimiters, controls and boundary spaces', () => {
  for (const key of ['urlBytes', 'launcherPathBytes']) {
    const base = text(input()[key]);
    for (const value of [' ' + base, base + ' ', base + '|x', base + '"x', base + '\tX', base + '\nX', base + '\0X', base + '\x7fX', base + '\u0080X']) {
      code({ ...input(), [key]: ascii(value) }, 'UPDATE_ARGUMENT_TEXT');
    }
  }
});

test('URL checks follow the observed limited prefix rule without implying origin authorization', () => {
  for (const value of ['ftp://a', 'http://', 'https://', 'http:///a', 'https://\\a', 'http:// a']) code({ ...input(), urlBytes: ascii(value) }, 'UPDATE_ARGUMENT_URL');
  // Source accepts internal spaces and does not parse the rest as a standards-complete URL.
  const result = encodeWin32LauncherUpdateArguments({ ...input(), urlBytes: ascii('HTTP://a b') });
  assert.equal(text(result.argumentBytes).split(' ')[1], 'HTTP://a|b');
  assert.equal(result.trust, 'unverified');
});

test('launcher path requires an ASCII drive letter and absolute backslash prefix', () => {
  for (const value of ['\\\\server\\a.exe', '/tmp/a.exe', 'C:a.exe', 'C:/a.exe', '1:\\a.exe', 'a.exe']) code({ ...input(), launcherPathBytes: ascii(value) }, 'UPDATE_ARGUMENT_PATH');
  assert.ok(text(encodeWin32LauncherUpdateArguments({ ...input(), launcherPathBytes: ascii('z:\\a') }).argumentBytes).includes(' z:\\a '));
});

test('archive decimal text preserves leading zeroes and enforces the native256MiB limit', () => {
  for (const value of ['0', '0000000000', '268435457', '4294967295', '+1', '-1', '1.0', '0x10', '1 ', ' 1']) code({ ...input(), archiveSizeBytes: ascii(value) }, 'UPDATE_ARGUMENT_SIZE');
  const result = encodeWin32LauncherUpdateArguments({ ...input(), archiveSizeBytes: ascii('0000000001') });
  assert.equal(result.archiveBytes, 1);
  assert.equal(text(result.argumentBytes).split(' ')[3], '0000000001');
});

test('MD5 is exactly hexadecimal data and keeps letter case', () => {
  for (const value of ['g'.repeat(32), 'f'.repeat(31) + '\n', 'f'.repeat(31) + ' ', 'f'.repeat(31) + '|']) code({ ...input(), launcherMd5Bytes: ascii(value) }, 'UPDATE_ARGUMENT_MD5');
  for (const value of ['a'.repeat(32), 'A'.repeat(32), digest]) assert.equal(text(encodeWin32LauncherUpdateArguments({ ...input(), launcherMd5Bytes: ascii(value) }).argumentBytes).split(' ')[4], value);
});

test('ArrayBuffers and offset views are accepted as independent byte snapshots', () => {
  const source = input(), padded = new Uint8Array(source.urlBytes.length + 9);
  padded.set(source.urlBytes, 4);
  source.urlBytes = padded.subarray(4, padded.length - 5);
  source.launcherPathBytes = source.launcherPathBytes.buffer;
  const first = encodeWin32LauncherUpdateArguments(source), expected = first.argumentBytes.slice();
  padded.fill(0); first.argumentBytes.fill(0);
  const second = encodeWin32LauncherUpdateArguments(input());
  assert.deepEqual(second.argumentBytes, expected);
  assert.equal(text(new Uint8Array(source.launcherPathBytes)), 'C:\\Synthetic Games\\Launcher.exe');
});

test('subclass properties and iterators cannot substitute a different byte view', () => {
  class Shadow extends Uint8Array {
    get length() { return 1; }
    get byteLength() { return 1; }
    get buffer() { throw Error('shadow'); }
    [Symbol.iterator]() { throw Error('iterator'); }
  }
  const source = input();
  source.urlBytes = new Shadow(source.urlBytes);
  assert.deepEqual(encodeWin32LauncherUpdateArguments(source).argumentBytes, encodeWin32LauncherUpdateArguments(input()).argumentBytes);
  source.urlBytes = new Shadow(256);
  code(source, 'UPDATE_ARGUMENT_LENGTH');
});

test('proxy, non-byte, shared and detached storage are outside the input contract', () => {
  for (const value of [[], 'http://a', new DataView(new ArrayBuffer(8)), new Proxy(ascii('http://a'), {})]) code({ ...input(), urlBytes: value }, 'UPDATE_ARGUMENT_BYTES');
  if (typeof SharedArrayBuffer === 'function') code({ ...input(), urlBytes: new Uint8Array(new SharedArrayBuffer(8)) }, 'UPDATE_ARGUMENT_BYTES');
  const detached = ascii('http://a'); structuredClone(detached.buffer, { transfer: [detached.buffer] });
  code({ ...input(), urlBytes: detached }, 'UPDATE_ARGUMENT_BYTES');
});
