/** Original header vectors in a fresh browser, served only by the existing loopback fixture. */
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { createLauncherBootstrapFixture } from '../../web/tests/helpers/launcher-bootstrap-fixture.mjs';
if (!process.argv[2]) throw Error('Supply an installed Playwright module directory.');
const require = createRequire(import.meta.url), { chromium } = require(process.argv[2]);
const vectors = JSON.parse(await readFile(new URL('./original-vectors.json', import.meta.url)));
const fixture = await createLauncherBootstrapFixture(), requests = [], errors = [], failures = [];
let browser, version, checks, failure;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true }); version = browser.version();
  const context = await browser.newContext();
  try {
    await context.route('**/*', route => new URL(route.request().url()).origin === fixture.origin ? route.continue() : route.abort());
    const page = await context.newPage();
    page.on('request', request => { const url = new URL(request.url()); requests.push({ method: request.method(), path: url.pathname, sameOrigin: url.origin === fixture.origin }); });
    page.on('console', message => { if (['warning', 'error'].includes(message.type())) errors.push({ type: message.type(), text: message.text() }); });
    page.on('pageerror', error => errors.push({ type: 'pageerror', text: error.message }));
    page.on('requestfailed', request => failures.push({ path: new URL(request.url()).pathname, error: request.failure()?.errorText }));
    await page.goto(fixture.origin + '/harness');
    checks = await page.evaluate(async ({ cases }) => {
      const core = await import('/shared/index.mjs'), parse = core.parseWin32LauncherUpdateJournalHeader;
      const bytes = hex => Uint8Array.from(hex.match(/../g) ?? [], part => parseInt(part, 16));
      const good = stage => bytes(cases.find(row => row.name === 'recorded-stage-' + stage).header_hex);
      const check = (ok, label) => { if (!ok) throw Error(label); };
      const reject = (input, expected) => { let code; try { parse(input); } catch (error) { code = error.code; } check(code === expected, 'Wrong rejection:' + expected); };
      for (const row of cases) {
        if (row.expected_error) reject(bytes(row.header_hex), row.expected_error);
        else { const value = parse(bytes(row.header_hex)); check(value.recordedStage === row.expected_stage, 'Wrong stage');
          check(value.authentication === 'unverified' && value.recovery === 'not-performed' && value.startupAcknowledgement === 'not-proven', 'Overbroad success'); }
      }
      const results = [{ name: 'all independent Python vectors in actual browser ESM', count: cases.length, passed: true }];
      const padded = new Uint8Array(40).fill(33); padded.set(good(4), 7);
      check(parse(padded.subarray(7, 23)).recordedStage === 4 && padded[6] === 33 && padded[23] === 33, 'Subview offset/ownership');
      check(parse(good(1).buffer).recordedStage === 1, 'ArrayBuffer'); results.push({ name: 'view offset and ArrayBuffer input', passed: true });
      let reads = 0;
      class View extends Uint8Array {
        get buffer() { reads++; throw Error('Unexpected buffer getter'); }
        get length() { reads++; throw Error('Unexpected length getter'); }
        get byteOffset() { reads++; throw Error('Unexpected offset getter'); }
        get byteLength() { reads++; throw Error('Unexpected byte length getter'); }
        [Symbol.iterator]() { reads++; throw Error('Unexpected iterator'); }
      }
      const fakeMetadata = new View(16); Uint8Array.prototype.set.call(fakeMetadata, good(2));
      check(parse(fakeMetadata).recordedStage === 2 && reads === 0, 'Caller hooks invoked');
      results.push({ name: 'intrinsic access ignores caller metadata and iterator', passed: true });
      const detached = new ArrayBuffer(16), view = new Uint8Array(detached); structuredClone(detached, { transfer: [detached] });
      reject(detached, 'JOURNAL_INPUT'); reject(view, 'JOURNAL_INPUT'); reject(new DataView(new ArrayBuffer(16)), 'JOURNAL_INPUT');
      reject(new Proxy(good(1), {}), 'JOURNAL_INPUT'); reject(new ArrayBuffer(0), 'JOURNAL_HEADER_LENGTH');
      results.push({ name: 'detached/proxy/DataView/empty boundaries', passed: true });
      let sharedChecked = false;
      if (typeof SharedArrayBuffer === 'function') { const shared = new SharedArrayBuffer(16); reject(shared, 'JOURNAL_INPUT'); reject(new Uint8Array(shared), 'JOURNAL_INPUT'); sharedChecked = true; }
      results.push({ name: 'shared-storage browser availability', available: sharedChecked, nodeVerifiedSeparately: true });
      const tails = cases.filter(row => row.native_first16_accepts && row.expected_error);
      check(tails.length === 2, 'Missing native/header differences');
      for (const row of tails) { reject(bytes(row.header_hex), 'JOURNAL_HEADER_LENGTH'); parse(bytes(row.header_hex).subarray(0, 16)); }
      results.push({ name: 'native first-read tail acceptance remains a declared profile difference', count: tails.length, passed: true });
      const changed = good(1), dv = new DataView(changed.buffer); dv.setUint32(8, 5, true); dv.setUint32(12, (5 ^ 0xf016ea0b) >>> 0, true);
      const result = parse(changed); changed.fill(0);
      check(result.recordedStage === 5 && result.integrity === 'xor-consistency-only' && result.authentication === 'unverified' && Object.isFrozen(result), 'Integrity/auth/result ownership');
      results.push({ name: 'unsigned XOR is consistency only; frozen output retains no caller bytes', passed: true });
      return results;
    }, vectors);
    await page.waitForLoadState('networkidle');
    assert.equal(errors.length, 0); assert.equal(failures.length, 0); assert.ok(requests.every(row => row.sameOrigin && row.method === 'GET'));
    assert.equal(fixture.requests.some(row => ['/self', '/hashes', '/games', '/regions', '/locator', '/package'].includes(row.path)), false);
  } finally { await context.close(); }
} catch (error) { failure = { name: error.name, message: error.message }; }
finally { if (browser) await browser.close(); await fixture.close(); }
const report = { schema: 'moli.launcher-update-recovery-v1.browser-validation.v1', recorded_utc: new Date().toISOString(),
  browser: version, driver: 'Installed Playwright' + require(process.argv[2] + '/package.json').version,
  vectors: vectors.cases.length, checks, requests, errors, failures, failure: failure ?? null,
  context_browser_fixture_closed: true, scope: 'Actual Chrome pure ESM, original synthetic inputs only; no official network/account/game or real journal.' };
await writeFile('build/analysis/launcher-update-recovery-v1/browser-validation.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ vectors: report.vectors, checks: checks?.length, requests: requests.length, errors: errors.length, failures: failures.length, failure: failure ?? null }));
if (failure) process.exitCode = 1;
