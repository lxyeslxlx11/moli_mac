import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LAUNCHER_LIMITS, REGION_LIMITS, LauncherError, parseGameCatalog, parseRegionCatalog,
  listGameRegions, selectLauncherRegion, createOfflineRegionLaunchPlan,
} from '../index.mjs';

// All XML, addresses and names below are original synthetic inputs.
const game = (name = 'Classic', refs = ['Alpha', 'Beta'], code = '11') =>
  `<Game Code="${code}"><Name>${name}</Name><EXE>client.exe</EXE><Argsline> updated </Argsline><Regions>${refs.map(n => `<Region>${n}</Region>`).join('')}</Regions></Game>`;
const games = (body = game()) => parseGameCatalog(`<Gamelist><Games>${body}</Games></Gamelist>`);
const region = (name = 'Alpha', code = '91', extra = '', args = '<Args Gamecode="11"> IP:0:192.0.2.10:9013 </Args>') =>
  `<Region Code="${code}"><Name>${name}</Name><BList><BIP Port="09030">192.0.2.1</BIP><BIP Port="9031">billing.example.invalid</BIP></BList><PIP>patch.example.invalid</PIP><PPort>80</PPort><StatusIP>192.0.2.2</StatusIP><Arglist>${args}</Arglist>${extra}</Region>`;
const xml = (body = region() + region('Beta', '92')) => `<Regionlist><Head><Version>synthetic-2</Version></Head><Regions>${body}</Regions></Regionlist>`;
const regions = (body) => parseRegionCatalog(xml(body));
const expect = (fn, code) => assert.throws(fn, e => e instanceof LauncherError && e.code === code);

test('RegionList preserves independent ordinals, Codes, BIP order and raw Args', () => {
  const result = regions();
  assert.equal(result.declaredVersion, 'synthetic-2');
  assert.deepEqual(result.regions.map(r => [r.ordinal, r.code, r.name]), [[0, '91', 'Alpha'], [1, '92', 'Beta']]);
  assert.deepEqual(result.regions[0].billingEndpoints, [
    { ordinal: 0, address: '192.0.2.1', port: 9030, portText: '09030' },
    { ordinal: 1, address: 'billing.example.invalid', port: 9031, portText: '9031' },
  ]);
  assert.deepEqual(result.regions[0].patchEndpoint, { address: 'patch.example.invalid', port: 80, portText: '80' });
  assert.equal(result.regions[0].args[0].text, ' IP:0:192.0.2.10:9013 ');
});

test('region references are matched by decoded name and retain GameList order', () => {
  const choices = listGameRegions(games(game('Classic', ['Beta', 'Alpha'])), 0, regions());
  assert.deepEqual(choices.map(r => [r.referenceOrdinal, r.regionOrdinal, r.name, r.status]),
    [[0, 1, 'Beta', 'available'], [1, 0, 'Alpha', 'available']]);
});

test('duplicate game Codes do not share or merge their region references', () => {
  const catalog = games(game('Classic', ['Alpha']) + game('Testing', ['Beta']));
  assert.equal(selectLauncherRegion(catalog, 0, regions(), 0).regionName, 'Alpha');
  assert.equal(selectLauncherRegion(catalog, 1, regions(), 0).regionName, 'Beta');
});

test('missing region references stay visible and cannot generate a plan', () => {
  const catalog = games(game('Classic', ['Gone', 'Alpha']));
  assert.equal(listGameRegions(catalog, 0, regions())[0].status, 'missing');
  expect(() => selectLauncherRegion(catalog, 0, regions(), 0), 'REGION_MISSING');
  assert.equal(selectLauncherRegion(catalog, 0, regions(), 1).regionOrdinal, 0);
});

test('duplicate names are ambiguous even when their region Codes differ', () => {
  const catalog = regions(region('Alpha', '1') + region('Alpha', '2'));
  assert.deepEqual(listGameRegions(games(), 0, catalog)[0].matchedOrdinals, [0, 1]);
  expect(() => selectLauncherRegion(games(), 0, catalog, 0), 'REGION_AMBIGUOUS');
});

test('names are case sensitive and do not use Unicode normalization aliases', () => {
  assert.equal(listGameRegions(games(game('Classic', ['alpha'])), 0, regions())[0].status, 'missing');
  assert.equal(listGameRegions(games(game('Classic', ['e\u0301'])), 0, regions(region('é')))[0].status, 'missing');
});

test('exact region names preserve leading/trailing spaces and NBSP instead of inventing aliases', () => {
  for (const name of [' Alpha', 'Alpha ', '\tAlpha', '&#160;Alpha']) {
    assert.equal(listGameRegions(games(game('Classic', [name])), 0, regions())[0].status, 'missing');
    assert.equal(listGameRegions(games(game('Classic', ['Alpha'])), 0, regions(region(name)))[0].status, 'missing');
  }
  const catalog = regions(region('Alpha', '1') + region(' Alpha ', '2'));
  assert.equal(selectLauncherRegion(games(game('Classic', [' Alpha '])), 0, catalog, 0).regionOrdinal, 1);
});

test('Closed is a presence flag including zero/empty text; escaped line breaks are decoded', () => {
  for (const message of ['0', '']) {
    const catalog = regions(region('Alpha', '1', `<Closed>${message}</Closed>`));
    assert.equal(listGameRegions(games(), 0, catalog)[0].status, 'closed');
    expect(() => selectLauncherRegion(games(), 0, catalog, 0), 'REGION_CLOSED');
  }
  assert.equal(regions(region('Alpha', '1', '<Closed>Wait\\nLater</Closed>')).regions[0].closedMessage, 'Wait\nLater');
});

test('nonempty Galaxylist cannot silently become a supported region plan', () => {
  const catalog = regions(region('Alpha', '1', '<Galaxylist><Galaxy Gamecode="11" Name="G">opaque</Galaxy></Galaxylist>'));
  assert.equal(catalog.regions[0].hasGalaxyList, true);
  expect(() => selectLauncherRegion(games(), 0, catalog, 0), 'GALAXY_SELECTION_REQUIRED');
  assert.equal(selectLauncherRegion(games(), 0, regions(region('Alpha', '1', '<Galaxylist/>')), 0).regionName, 'Alpha');
});

test('Args uses numeric Gamecode slots while preserving original code text', () => {
  const catalog = regions(region('Alpha', '91', '', '<Args Gamecode="4">other</Args><Args Gamecode="00011"> same </Args>'));
  const result = selectLauncherRegion(games(game('Classic', ['Alpha'], '011')), 0, catalog, 0);
  assert.equal(result.gameCode, '011');
  assert.equal(result.regionCode, '91');
  assert.equal(result.regionArgs, ' same ');
  assert.equal(result.baseArgs, ' updated ');
  assert.equal(result.authentication, 'unverified');
  assert.equal(Object.hasOwn(result, 'commandLine'), false);
});

test('duplicate canonical Args slots are rejected at selection instead of last-value overwrite', () => {
  const catalog = regions(region('Alpha', '1', '', '<Args Gamecode="11">a</Args><Args Gamecode="011">b</Args>'));
  expect(() => selectLauncherRegion(games(), 0, catalog, 0), 'AMBIGUOUS_ARGUMENTS');
});

test('absent Args and endpoints remain absent without invented defaults', () => {
  const catalog = regions('<Region><Name>Alpha</Name></Region>');
  const result = selectLauncherRegion(games(), 0, catalog, 0);
  assert.equal(result.regionCode, '');
  assert.equal(result.regionArgs, '');
  assert.deepEqual(result.billingEndpoints, []);
  assert.equal(result.patchEndpoint, null);
});

test('Args text remains opaque and is not parsed as shell commands or individual servers', () => {
  const text = ' x; $(demo) `literal` IP:opaque &#13; &lt;tag&gt; ';
  const result = selectLauncherRegion(games(), 0, regions(region('Alpha', '1', '', `<Args Gamecode="11">${text}</Args>`)), 0);
  assert.equal(result.regionArgs, ' x; $(demo) `literal` IP:opaque \r <tag> ');
});

test('combined plan binds the selected game, referenced region and existing INI directory', () => {
  const result = createOfflineRegionLaunchPlan(games(), 0, regions(), 1, { iniText: '[Path]\nGame11=C:\\Synthetic\\Classic\n' });
  assert.equal(result.files.client.windowsPath, 'C:\\Synthetic\\Classic\\client.exe');
  assert.equal(result.region.regionName, 'Beta');
  assert.equal(result.argsLine, result.region.baseArgs);
  assert.equal(Object.hasOwn(result, 'readyToPlay'), false);
});

test('combined plan preserves old directory errors and does not invent a working directory', () => {
  expect(() => createOfflineRegionLaunchPlan(games(), 0, regions(), 0), 'NO_DIRECTORY');
  expect(() => createOfflineRegionLaunchPlan(games(), 0, regions(), 0, { iniText: '[Path]\nGame11=../escape' }), 'UNSUPPORTED_DIRECTORY');
});

test('parsed catalogs, diagnostics, choices and selected nested data are frozen', () => {
  const catalog = regions();
  for (const value of [catalog, catalog.regions, catalog.regions[0], catalog.regions[0].args, catalog.regions[0].args[0], catalog.diagnostics]) {
    assert.equal(Object.isFrozen(value), true);
  }
  const selected = selectLauncherRegion(games(), 0, catalog, 0);
  assert.equal(Object.isFrozen(selected.billingEndpoints[0]), true);
  assert.equal(Object.isFrozen(listGameRegions(games(), 0, catalog)[0].matchedOrdinals), true);
});

test('selection copies endpoint metadata and does not retain mutable caller objects', () => {
  const parsed = regions();
  const mutable = structuredClone(parsed);
  const selected = selectLauncherRegion(games(), 0, mutable, 0);
  mutable.regions[0].billingEndpoints[0].address = 'changed.invalid';
  mutable.regions[0].patchEndpoint.portText = '81';
  assert.equal(selected.billingEndpoints[0].address, '192.0.2.1');
  assert.equal(selected.patchEndpoint.port, 80);
});

test('region/root/field duplicate and nested scalar ambiguities are rejected', () => {
  for (const body of [
    region().replace('<Name>Alpha</Name>', '<Name>A</Name><Name>B</Name>'),
    region().replace('<Name>Alpha</Name>', '<Name><Nested/></Name>'),
    region().replace('</Region>', '<Arglist/></Region>'),
    region().replace('</Region>', '<Closed/><Closed/></Region>'),
  ]) assert.throws(() => regions(body), LauncherError);
  expect(() => parseRegionCatalog('<Regionlist><Regions/><Regions/></Regionlist>'), 'DUPLICATE_FIELD');
  expect(() => parseRegionCatalog(xml().replace('Regionlist', 'Gamelist')), 'XML_SYNTAX');
  expect(() => parseRegionCatalog('<Regionlist><Regions><Unknown/></Regions></Regionlist>'), 'XML_SCHEMA');
});

test('GameList region containers reject duplicates, nested or blank references', () => {
  for (const body of [
    '<Regions/><Regions/>', '<Regions><Region/></Regions>',
    '<Regions><Region><Name>A</Name></Region></Regions>', '<Regions>mixed<Region>A</Region></Regions>',
  ]) assert.throws(() => games(`<Game Code="11"><Name>A</Name><EXE>a.exe</EXE>${body}</Game>`), LauncherError);
});

test('all fixed count budgets are inclusive and cannot be raised with options', () => {
  assert.equal(regions(region().repeat(REGION_LIMITS.regions)).regions.length, REGION_LIMITS.regions);
  expect(() => parseRegionCatalog(xml(region().repeat(REGION_LIMITS.regions + 1)), { regions: 999 }), 'REGION_BUDGET');
  assert.equal(games(game('A', Array(REGION_LIMITS.referencesPerGame).fill('Alpha'))).games[0].regions.length, 40);
  expect(() => games(game('A', Array(41).fill('Alpha'))), 'REGION_BUDGET');
  const ten = region().replace(/<BList>[\s\S]*?<\/BList>/, `<BList>${'<BIP Port="1">host.invalid</BIP>'.repeat(10)}</BList>`);
  assert.equal(regions(ten).regions[0].billingEndpoints.length, 10);
  expect(() => regions(ten.replace('</BList>', '<BIP Port="1">extra.invalid</BIP></BList>')), 'REGION_BUDGET');
  assert.equal(regions(region('Alpha', '1', '', '<Args Gamecode="11"/>'.repeat(64))).regions[0].args.length, 64);
  expect(() => regions(region('Alpha', '1', '', '<Args Gamecode="11"/>'.repeat(65))), 'REGION_BUDGET');
});

test('XML size, field, depth, entity and unsupported-declaration rules are shared', () => {
  expect(() => parseRegionCatalog(' '.repeat(LAUNCHER_LIMITS.catalogChars + 1)), 'CATALOG_BUDGET');
  expect(() => regions(region('a'.repeat(LAUNCHER_LIMITS.fieldChars + 1))), 'FIELD_BUDGET');
  for (const prefix of ['<!DOCTYPE Regionlist SYSTEM "https://example.invalid/x">', '<?xml-stylesheet href="x"?>']) {
    expect(() => parseRegionCatalog(prefix + xml()), 'XML_UNSUPPORTED');
  }
  expect(() => regions(region('A & B')), 'XML_ENTITY');
  assert.equal(parseRegionCatalog(xml(region('A & B')), { allowBareAmpersands: true }).diagnostics.literalAmpersands, 1);
  expect(() => parseRegionCatalog(xml().replace('Alpha', '&unknown;'), { allowBareAmpersands: true }), 'XML_ENTITY');
});

test('port ranges and endpoint schemes/paths/credentials fail before plan generation', () => {
  for (const port of ['', '0', '65536', '-1', '1.2', '1e3', 'x']) {
    expect(() => regions(region().replace('Port="09030"', `Port="${port}"`)), 'ENDPOINT_PORT');
  }
  for (const address of ['https://example.invalid', 'user@example.invalid', 'host/path', 'host\\path', 'bad host', '::1', '.bad', 'a..b']) {
    expect(() => regions(region().replace('192.0.2.1', address)), 'UNSUPPORTED_ENDPOINT');
  }
  expect(() => regions(region().replace('<PPort>80</PPort>', '')), 'ENDPOINT_FIELDS');
});

test('Gamecode bounds are explicit instead of copying legacy clamping or invalid slots', () => {
  for (const code of ['-1', 'x', '999999999']) expect(() => regions(region('Alpha', '1', '', `<Args Gamecode="${code}">x</Args>`)), 'GAME_CODE');
  expect(() => regions(region('Alpha', '1', '', '<Args Gamecode="15">x</Args>')), 'UNSUPPORTED_GAME_CODE');
  expect(() => selectLauncherRegion(games(game('A', ['Alpha'], '15')), 0, regions(), 0), 'UNSUPPORTED_GAME_CODE');
  assert.equal(selectLauncherRegion(games(game('A', ['Alpha'], '14')), 0, regions(region('Alpha', '1', '', '<Args Gamecode="14">edge</Args>')), 0).regionArgs, 'edge');
});

test('game and reference ordinals never accept Codes, strings, fractions or unsafe integers', () => {
  for (const ordinal of [-1, 0.5, '0', NaN, Infinity, Number.MAX_SAFE_INTEGER]) {
    expect(() => listGameRegions(games(), ordinal, regions()), 'ORDINAL_BOUNDS');
    expect(() => selectLauncherRegion(games(), 0, regions(), ordinal), 'ORDINAL_BOUNDS');
  }
  expect(() => selectLauncherRegion(games(), 0, regions(), 91), 'ORDINAL_BOUNDS');
});

test('unknown metadata is named without turning it into a network or execution action', () => {
  const catalog = regions(region('Alpha', '1', '<Future><URL>https://example.invalid</URL></Future>'));
  assert.deepEqual(catalog.regions[0].unhandledFields, ['Future']);
  assert.equal(selectLauncherRegion(games(), 0, catalog, 0).regionName, 'Alpha');
});

test('invalid public inputs and inconsistent endpoint metadata fail with stable LauncherError', () => {
  for (const value of [undefined, null, [], {}, 1]) {
    expect(() => parseRegionCatalog(value), 'INVALID_INPUT');
    expect(() => listGameRegions(value, 0, regions()), 'INVALID_INPUT');
    expect(() => listGameRegions(games(), 0, value), 'INVALID_INPUT');
  }
  expect(() => parseRegionCatalog(xml(), { allowBareAmpersands: 'true' }), 'INVALID_INPUT');
  const forged = structuredClone(regions());
  forged.regions[0].billingEndpoints[0].port = 1;
  expect(() => selectLauncherRegion(games(), 0, forged, 0), 'INVALID_INPUT');
});
