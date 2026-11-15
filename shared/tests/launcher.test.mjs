import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LAUNCHER_LIMITS, LauncherError, parseGameCatalog, parsePathOverrides,
  resolveGameDirectory, createOfflineLaunchPlan,
} from '../index.mjs';

// Original synthetic fixtures only. No official XML, paths or account/session data.
const KEY = 'Software\\ExampleGames\\Offline';
const gameXML = (body = '', code = '11', name = 'Classic') => `<Game Code="${code}"><Name>${name}</Name><EXE>client.exe</EXE><Argsline> updated </Argsline><RegKey>${KEY}</RegKey><RegValue>Path</RegValue>${body}</Game>`;
const catalogXML = (games = gameXML()) => `<Gamelist><Head><Version>synthetic-1</Version></Head><Games><News>https://example.invalid/news</News>${games}</Games></Gamelist>`;
const catalog = (body = '') => parseGameCatalog(catalogXML(gameXML(body)));
const lookup = (status = 'found', value = 'C:\\Local Games\\Classic') => ({ status, hive: 'HKCU', key: KEY, valueName: 'Path', value });
const ini = '[Path]\nGame11=D:\\Offline\\Classic\n';
const expect = (fn, code) => assert.throws(fn, e => e instanceof LauncherError && e.code === code);

// Independent expected results cover the evidence-derived selection chain.
test('catalog keeps duplicate Codes as separate ordinals and preserves static Argsline', () => {
  const result = parseGameCatalog(catalogXML(gameXML('', '11', 'Classic') + gameXML('', '11', 'Testing')));
  assert.deepEqual(result.games.map(g => [g.ordinal, g.code, g.name]), [[0, '11', 'Classic'], [1, '11', 'Testing']]);
  assert.equal(result.games[0].argsLine, ' updated ');
  assert.equal(result.declaredVersion, 'synthetic-1');
});

test('data-only plan includes configured client, patch, configuration and special file paths', () => {
  const result = createOfflineLaunchPlan(catalog('<PatchEXE>tools/patch.exe</PatchEXE><ConfigEXE>config.exe</ConfigEXE><SpeFile>data/map.bin</SpeFile>'), 0, { registry: lookup() });
  assert.equal(result.directory.source, 'registry');
  assert.deepEqual({ ...result.files }, {
    client: { relativePath: 'client.exe', windowsPath: 'C:\\Local Games\\Classic\\client.exe' },
    patcher: { relativePath: 'tools\\patch.exe', windowsPath: 'C:\\Local Games\\Classic\\tools\\patch.exe' },
    configuration: { relativePath: 'config.exe', windowsPath: 'C:\\Local Games\\Classic\\config.exe' },
    special: { relativePath: 'data\\map.bin', windowsPath: 'C:\\Local Games\\Classic\\data\\map.bin' },
  });
  assert.equal(result.argsLine, ' updated ');
  assert.equal(Object.hasOwn(result, 'commandLine'), false);
  assert.equal(Object.hasOwn(result, 'authentication'), false);
});

test('ordinal selects the second same-Code record; Code is not used as an index', () => {
  const value = parseGameCatalog(catalogXML(gameXML('', '11', 'First') + gameXML('', '11', 'Second')));
  assert.equal(createOfflineLaunchPlan(value, 1, { iniText: ini }).name, 'Second');
  for (const ordinal of [-1, 11, 2, 0.5, NaN, '1']) expect(() => createOfflineLaunchPlan(value, ordinal, { iniText: ini }), 'ORDINAL_BOUNDS');
});

test('empty optional fields are absent, unknown fields are named but never interpreted', () => {
  const value = catalog('<PatchEXE/><ConfigEXE></ConfigEXE><OfficialSite>https://example.invalid/?a=1&amp;b=2</OfficialSite><Regions><Region>Demo</Region></Regions>');
  assert.deepEqual(value.games[0].unhandledFields, ['OfficialSite']);
  assert.deepEqual(value.games[0].regions, ['Demo']);
  const plan = createOfflineLaunchPlan(value, 0, { iniText: ini });
  assert.equal(plan.files.patcher, null);
  assert.equal(plan.files.configuration, null);
  assert.equal(plan.files.special, null);
});

test('ConfigEXE declared body preserves raw slash and edge spaces beside canonical file metadata', () => {
  const game=catalog('<ConfigEXE> tools/config.exe </ConfigEXE>').games[0];
  assert.equal(game.configurerText,' tools/config.exe ');assert.equal(game.files.configuration,'tools\\config.exe');
  assert.equal(catalog().games[0].configurerText,'');
});

test('initial XML declaration, BOM, CRLF, comments, CDATA and numeric entities are supported', () => {
  const xml = '\uFEFF<?xml version="1.0" encoding="GB2312"?>\r\n<!-- synthetic -->' + catalogXML(gameXML('', '11', '<![CDATA[A & B]]> &#x4E2D;&#25991; &amp;lt;'));
  assert.equal(parseGameCatalog(xml).games[0].name, 'A & B 中文 &lt;');
  const argumentsXML = catalogXML().replace('<Argsline> updated </Argsline>', '<Argsline> a\r\nb&#13;c </Argsline>');
  assert.equal(parseGameCatalog(argumentsXML).games[0].argsLine, ' a\nb\rc ');
});

test('bare ampersands need explicit compatibility mode and remain counted', () => {
  const xml = catalogXML(gameXML('', '11', 'A & B'));
  expect(() => parseGameCatalog(xml), 'XML_ENTITY');
  const value = parseGameCatalog(xml, { allowBareAmpersands: true });
  assert.equal(value.games[0].name, 'A & B');
  assert.equal(value.diagnostics.literalAmpersands, 1);
});

test('XML declaration is bounded and cannot hide duplicate or unknown attributes', () => {
  for (const prefix of [
    '<?xml version="1.0" encoding="UTF-8" encoding="UTF-8"?>',
    '<?xml version="1.0" unknown="x"?>',
    '<?xml version="2.0"?>',
    '<?xml version="1.0" encoding="' + 'x'.repeat(300) + '"?>',
  ]) expect(() => parseGameCatalog(prefix + catalogXML()), 'XML_UNSUPPORTED');
  assert.equal(parseGameCatalog("<?xml version='1.0' standalone='yes'?>" + catalogXML()).games.length, 1);
});

test('DTD, external entities, processing instructions and namespaces are not resolved', () => {
  for (const xml of [
    '<!DOCTYPE Gamelist SYSTEM "https://example.invalid/catalog.dtd">' + catalogXML(),
    '<!DOCTYPE Gamelist [<!ENTITY x "expanded">]>' + catalogXML(),
    '<?xml-stylesheet href="https://example.invalid/a"?>' + catalogXML(),
    catalogXML().replace('<Gamelist>', '<Gamelist xmlns="urn:unknown">'),
  ]) expect(() => parseGameCatalog(xml), 'XML_UNSUPPORTED');
});

test('unknown and malformed entities stay rejected even in bare-amp compatibility mode', () => {
  for (const text of ['&unknown;', '&#-1;', '&#xZZ;', '&#999999999999999999999999;']) {
    expect(() => parseGameCatalog(catalogXML(gameXML('', '11', text)), { allowBareAmpersands: true }), 'XML_ENTITY');
  }
  expect(() => parseGameCatalog(catalogXML(gameXML('', '11', '&#xD800;'))), 'INVALID_CHARACTER');
});

test('truncated, mismatched and multiple-root XML fail without returning partial games', () => {
  for (const xml of ['', catalogXML().slice(0, -4), catalogXML().replace('</Game>', '</Other>'), catalogXML() + '<Another/>', 'outside' + catalogXML(), catalogXML() + 'outside']) {
    expect(() => parseGameCatalog(xml), 'XML_SYNTAX');
  }
});

test('malformed tags, attributes, comments and CDATA are refused', () => {
  for (const xml of [
    catalogXML().replace('Code="11"', 'Code=11'),
    catalogXML().replace('Code="11"', 'Code="11"Next="x"'),
    catalogXML().replace('Code="11"', 'Code="<"'),
    catalogXML().replace('<Name>Classic</Name>', '<Name><![CDATA[missing</Name>'),
    '<!-- bad--comment -->' + catalogXML(),
    catalogXML().replace('Classic', 'bad]]>text'),
  ]) expect(() => parseGameCatalog(xml), 'XML_SYNTAX');
  expect(() => parseGameCatalog(catalogXML().replace('Code="11"', 'Code="11" Code="12"')), 'XML_DUPLICATE_ATTRIBUTE');
});

test('missing and repeated required structure or fields are rejected', () => {
  expect(() => parseGameCatalog('<Other/>'), 'XML_SCHEMA');
  expect(() => parseGameCatalog('<Gamelist/>'), 'MISSING_FIELD');
  expect(() => parseGameCatalog('<Gamelist><Games/></Gamelist>'), 'GAME_COUNT');
  expect(() => catalog('<EXE>other.exe</EXE>'), 'DUPLICATE_FIELD');
  expect(() => catalog('<Name>Other</Name>'), 'DUPLICATE_FIELD');
  expect(() => parseGameCatalog(catalogXML().replace('<Name>Classic</Name>', '<Name/>')), 'MISSING_FIELD');
  expect(() => parseGameCatalog(catalogXML().replace('<EXE>client.exe</EXE>', '<EXE><Nested/></EXE>')), 'XML_SCHEMA');
  expect(() => parseGameCatalog('<Gamelist><Games/><Games/></Gamelist>'), 'DUPLICATE_FIELD');
});

test('Code text is bounded and keeps leading zeroes for the Game key', () => {
  const value = parseGameCatalog(catalogXML(gameXML('', '0011')));
  assert.equal(value.games[0].code, '0011');
  assert.equal(createOfflineLaunchPlan(value, 0, { iniText: '[Path]\nGame0011=C:\\Zero\n' }).directory.key, 'Game0011');
  for (const code of ['', '-1', 'abc', '123456789']) expect(() => parseGameCatalog(catalogXML(gameXML('', code))), 'GAME_CODE');
});

test('fixed catalog, node, depth, attribute, game and field budgets are enforced', () => {
  expect(() => parseGameCatalog(' '.repeat(LAUNCHER_LIMITS.catalogChars + 1)), 'CATALOG_BUDGET');
  expect(() => catalog('<Unknown>' + 'x'.repeat(LAUNCHER_LIMITS.fieldChars + 1) + '</Unknown>'), 'FIELD_BUDGET');
  expect(() => parseGameCatalog(catalogXML(gameXML().repeat(LAUNCHER_LIMITS.games + 1))), 'GAME_COUNT');
  expect(() => parseGameCatalog('<Gamelist>' + '<A>'.repeat(8) + '</A>'.repeat(8) + '</Gamelist>'), 'XML_DEPTH');
  expect(() => parseGameCatalog('<Gamelist>' + '<A/>'.repeat(LAUNCHER_LIMITS.xmlNodes) + '</Gamelist>'), 'XML_NODE_BUDGET');
  const attributes = Array.from({ length: LAUNCHER_LIMITS.attributesPerNode + 1 }, (_, i) => `a${i}="x"`).join(' ');
  expect(() => parseGameCatalog(`<Gamelist ${attributes}/>`), 'XML_ATTRIBUTE_BUDGET');
  assert.equal(Object.isFrozen(LAUNCHER_LIMITS), true);
});

test('forbidden controls and ill-formed Unicode do not enter config or path snapshots', () => {
  for (const text of ['\0', '\u0001', '\ud800', '\udfff']) {
    expect(() => parseGameCatalog(catalogXML(gameXML('', '11', text))), 'INVALID_CHARACTER');
    expect(() => parsePathOverrides('[Path]\nGame11=C:\\' + text), 'INVALID_CHARACTER');
    expect(() => resolveGameDirectory(catalog().games[0], { registry: lookup('found', 'C:\\' + text) }), 'INVALID_CHARACTER');
  }
});

test('catalog and nested output data are frozen and do not share caller state', () => {
  const value = catalog();
  for (const item of [value, value.games, value.games[0], value.games[0].files, value.games[0].registry, value.diagnostics]) assert.equal(Object.isFrozen(item), true);
  assert.throws(() => { value.games[0].code = '42'; }, TypeError);
  const snapshot = lookup();
  const result = createOfflineLaunchPlan(value, 0, { registry: snapshot });
  snapshot.value = 'Z:\\Changed';
  assert.equal(result.directory.path, 'C:\\Local Games\\Classic');
  assert.equal(Object.isFrozen(result.files.client), true);
});

test('Path/Game keys are case-insensitive, unrelated sections are ignored and values are not expanded', () => {
  const value = parsePathOverrides('\uFEFF; original fixture\r\n[Other]\r\nx=not-returned\r\n[pAtH]\r\ngAmE11=C:\\%SYNTHETIC%\\Local\r\nunknown=ignored\r\n');
  assert.deepEqual(value, [{ code: '11', key: 'Game11', path: 'C:\\%SYNTHETIC%\\Local' }]);
  assert.equal(Object.isFrozen(value), true);
  assert.equal(resolveGameDirectory(catalog().games[0], { iniText: '[Path]\nGame11=C:\\%SYNTHETIC%\n' }).path, 'C:\\%SYNTHETIC%');
});

test('duplicate INI sections/keys and malformed lines do not silently select a directory', () => {
  for (const value of ['[Path]\nGame11=C:\\One\nGAME11=D:\\Two', '[Path]\nGame11=C:\\One\n[path]\nGame12=D:\\Two']) expect(() => parsePathOverrides(value), 'INI_DUPLICATE');
  for (const value of ['Game11=C:\\One', '[Path\nGame11=C:\\One', '[Path]\nbroken', '[Path]\n=value', '[[Path]]']) expect(() => parsePathOverrides(value), 'INI_SYNTAX');
});

test('INI budgets bound text, selected values and number of entries', () => {
  expect(() => parsePathOverrides(' '.repeat(LAUNCHER_LIMITS.iniChars + 1)), 'INI_BUDGET');
  expect(() => parsePathOverrides('[Path]\nGame11=' + 'x'.repeat(LAUNCHER_LIMITS.fieldChars + 1)), 'FIELD_BUDGET');
  const lines = Array.from({ length: LAUNCHER_LIMITS.games + 1 }, (_, i) => `Game${i}=C:\\Game${i}`);
  expect(() => parsePathOverrides('[Path]\n' + lines.join('\n')), 'GAME_COUNT');
});

test('found HKCU directory wins without reading/validating an unused INI fallback', () => {
  const selected = resolveGameDirectory(catalog().games[0], { registry: { ...lookup(), key: KEY.toLowerCase(), valueName: 'pAtH' }, iniText: 'deliberately invalid fallback' });
  assert.deepEqual(selected, { source: 'registry', path: 'C:\\Local Games\\Classic', hive: 'HKCU', key: KEY, valueName: 'Path' });
});

test('missing, unreadable and omitted lookup results fall back to Path/Game11', () => {
  for (const status of ['missing', 'unreadable']) {
    const selected = resolveGameDirectory(catalog().games[0], { registry: lookup(status), iniText: ini });
    assert.equal(selected.source, 'ini');
    assert.equal(selected.path, 'D:\\Offline\\Classic');
    assert.equal(selected.registryStatus, status);
  }
  assert.equal(resolveGameDirectory(catalog().games[0], { iniText: ini }).registryStatus, 'not-provided');
});

test('wrong hive/key/value and unknown registry status fail rather than switching games', () => {
  for (const patch of [{ hive: 'HKLM' }, { key: 'Software\\Other' }, { valueName: 'Other' }]) {
    expect(() => resolveGameDirectory(catalog().games[0], { registry: { ...lookup(), ...patch }, iniText: ini }), 'REGISTRY_MISMATCH');
  }
  for (const registry of [null, {}, { status: true }, { ...lookup(), status: 'ok' }]) expect(() => resolveGameDirectory(catalog().games[0], { registry, iniText: ini }), 'REGISTRY_RESULT');
  expect(() => resolveGameDirectory(catalog().games[0], { registry: { ...lookup(), key: 'x'.repeat(LAUNCHER_LIMITS.fieldChars + 1) } }), 'FIELD_BUDGET');
});

test('empty/invalid found directory is not hidden by a successful INI fallback', () => {
  expect(() => resolveGameDirectory(catalog().games[0], { registry: lookup('found', ''), iniText: ini }), 'UNSUPPORTED_DIRECTORY');
  expect(() => resolveGameDirectory(catalog().games[0], { registry: lookup('found', 'relative'), iniText: ini }), 'UNSUPPORTED_DIRECTORY');
});

test('absence or wrong-section INI produces no directory, not a current-directory default', () => {
  for (const options of [{}, { iniText: '' }, { iniText: '[Game11]\nPath=C:\\Wrong' }, { iniText: '[Path]\nGame12=C:\\Wrong' }, { iniText: '[Path]\nGame11=' }]) {
    expect(() => resolveGameDirectory(catalog().games[0], options), 'NO_DIRECTORY');
  }
});

test('legacy migration is explicitly unsupported unless a current key already resolved', () => {
  const value = catalog('<OldRegKey>Software\\ExampleGames\\Legacy</OldRegKey><OldRegValue>Path</OldRegValue>');
  expect(() => resolveGameDirectory(value.games[0], { registry: lookup('missing'), iniText: ini }), 'UNSUPPORTED_LEGACY_REGISTRY');
  assert.equal(resolveGameDirectory(value.games[0], { registry: lookup() }).source, 'registry');
  expect(() => catalog('<OldRegKey>Software\\Legacy</OldRegKey>'), 'REGISTRY_REFERENCE');
});

test('absolute, URL, traversal, alternate-stream and ambiguous configured file paths are rejected', () => {
  for (const path of ['../escape.exe', 'a\\..\\escape.exe', '/absolute.exe', '\\\\server\\share\\file.exe', 'C:\\absolute.exe', 'https://example.invalid/a.exe', 'client.exe:stream', 'a//b.exe', 'a/./b.exe', 'NUL.exe', 'COM1.txt', 'client.exe.', 'alias /client.exe', 'a|b.exe', '"client.exe"']) {
    const xml = catalogXML().replace('<EXE>client.exe</EXE>', `<EXE>${path}</EXE>`);
    expect(() => parseGameCatalog(xml), 'UNSAFE_PATH');
  }
});

test('file fields trim exterior whitespace while structural XML accepts only XML whitespace', () => {
  const value = parseGameCatalog(catalogXML().replace('<EXE>client.exe</EXE>', '<EXE>  client.exe  </EXE>'));
  assert.equal(value.games[0].files.client, 'client.exe');
  expect(() => parseGameCatalog('\u00a0' + catalogXML()), 'XML_SYNTAX');
  expect(() => parseGameCatalog(catalogXML().replace('Code="11"', 'Code\u00a0="11"')), 'XML_SYNTAX');
  expect(() => parseGameCatalog(catalogXML().replace('<Games>', '<Games>\u00a0')), 'XML_SCHEMA');
});

test('directory planning accepts local drive roots and normalizes separators, never UNC/URLs', () => {
  const value = catalog();
  assert.equal(createOfflineLaunchPlan(value, 0, { registry: lookup('found', 'c:/Local Games/Classic/') }).files.client.windowsPath, 'c:\\Local Games\\Classic\\client.exe');
  assert.equal(createOfflineLaunchPlan(value, 0, { registry: lookup('found', 'C:\\') }).files.client.windowsPath, 'C:\\client.exe');
  for (const path of ['C:relative', '/posix/mount', '\\\\server\\share', 'https://example.invalid/path']) expect(() => resolveGameDirectory(value.games[0], { registry: lookup('found', path) }), 'UNSUPPORTED_DIRECTORY');
  for (const path of ['C:\\..\\outside', 'C:\\Local\\..', 'C:\\CON', 'C:\\Local:stream', 'C:\\Local ', 'C:\\"Quoted"', 'C:\\A\\\\B']) expect(() => resolveGameDirectory(value.games[0], { registry: lookup('found', path) }), 'UNSAFE_PATH');
});

test('forged plans cannot bypass file validation or provide non-text static arguments', () => {
  const value = catalog();
  const game = { ...value.games[0], files: { ...value.games[0].files, client: '..\\outside.exe' } };
  expect(() => createOfflineLaunchPlan({ games: [game] }, 0, { iniText: ini }), 'UNSAFE_PATH');
  expect(() => createOfflineLaunchPlan({ games: [{ ...value.games[0], argsLine: {} }] }, 0, { iniText: ini }), 'INVALID_INPUT');
  expect(() => createOfflineLaunchPlan({ games: [{ ...value.games[0], ordinal: 9 }] }, 0, { iniText: ini }), 'INVALID_INPUT');
});

test('invalid API inputs and options use stable LauncherError codes', () => {
  for (const value of [undefined, null, 2, new Uint8Array()]) expect(() => parseGameCatalog(value), 'INVALID_INPUT');
  for (const options of [null, false, []]) expect(() => parseGameCatalog(catalogXML(), options), 'INVALID_INPUT');
  expect(() => parseGameCatalog(catalogXML(), { allowBareAmpersands: 'true' }), 'INVALID_INPUT');
  expect(() => parsePathOverrides(null), 'INVALID_INPUT');
  expect(() => resolveGameDirectory(null), 'INVALID_INPUT');
  expect(() => resolveGameDirectory(catalog().games[0], null), 'INVALID_INPUT');
  expect(() => createOfflineLaunchPlan(null, 0), 'INVALID_INPUT');
});

test('prototype-shaped unknown XML/INI names do not pollute output or global prototypes', () => {
  const xml = catalogXML(gameXML('<__proto__>ignored</__proto__><constructor>ignored</constructor>')).replace('<Gamelist>', '<Gamelist __proto__="x">');
  const value = parseGameCatalog(xml);
  assert.deepEqual(value.games[0].unhandledFields, ['__proto__', 'constructor']);
  assert.equal(Object.prototype.polluted, undefined);
  assert.deepEqual(parsePathOverrides('[Path]\n__proto__=x\nconstructor=y\nGame11=C:\\Local'), [{ code: '11', key: 'Game11', path: 'C:\\Local' }]);
});
