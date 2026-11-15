/** Pure offline GameList/installation planning. No I/O, runtime execution or session data. */
import { LOCAL_PATH_LIMITS, LocalPathError, localRelativePath, localDirectoryPath, joinLocalPath } from './local-paths.mjs';
export const LAUNCHER_LIMITS = Object.freeze({
  catalogChars: 256 * 1024, iniChars: 64 * 1024, fieldChars: LOCAL_PATH_LIMITS.characters,
  games: 128, xmlNodes: 4096, xmlDepth: 8, attributesPerNode: 16,
});
export const REGION_LIMITS = Object.freeze({
  regions: 40, referencesPerGame: 40, billingEndpoints: 10, argumentsPerRegion: 64, gameCodeMax: 14, galaxiesPerRegion: 15,
});

export class LauncherError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'LauncherError';
    this.code = code;
  }
}
const fail = (code, message) => { throw new LauncherError(code, message); };
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const hasText = value => /[^ \t\r\n]/.test(value);
function optionsObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('INVALID_INPUT', 'Expected an options object.');
  return value;
}

function textInput(value, limit, code) {
  if (typeof value !== 'string') fail('INVALID_INPUT', 'Expected already decoded text.');
  if (value.length > limit) fail(code, 'Text exceeds the fixed character budget.');
  for (const character of value) {
    const c = character.codePointAt(0);
    if (!(c === 9 || c === 10 || c === 13 || (c >= 0x20 && c <= 0xd7ff)
      || (c >= 0xe000 && c <= 0xfffd) || (c >= 0x10000 && c <= 0x10ffff))) {
      fail('INVALID_CHARACTER', 'Text contains a forbidden XML character or unpaired surrogate.');
    }
  }
  return value.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}
function field(value) {
  if (typeof value !== 'string') fail('INVALID_INPUT', 'Expected a string field.');
  textInput(value, LAUNCHER_LIMITS.fieldChars, 'FIELD_BUDGET');
  return value;
}
function codeText(value) {
  if (typeof value !== 'string' || !/^[0-9]{1,8}$/.test(value)) {
    fail('GAME_CODE', 'Code must contain one to eight decimal digits; its text is preserved.');
  }
  return value;
}

// Small bounded XML subset, independent of DOM and of platform entity resolvers.
function parseXML(source, allowBareAmpersands) {
  const input = textInput(source, LAUNCHER_LIMITS.catalogChars, 'CATALOG_BUDGET');
  let at = 0; let nodes = 0; let root; let literalAmpersands = 0;
  const stack = [];
  const entities = Object.freeze({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" });
  const namePattern = /^[A-Za-z_][A-Za-z0-9_.-]*/;
  const space = () => { while (at < input.length && /[ \t\r\n]/.test(input[at])) at += 1; };
  function name() {
    const match = namePattern.exec(input.slice(at));
    if (!match) fail('XML_SYNTAX', 'Expected a supported XML name.');
    at += match[0].length;
    return match[0];
  }
  function decode(value) {
    return value.replace(/&(?:#[xX][0-9a-fA-F]+|#[0-9]+|[A-Za-z][A-Za-z0-9]*);|&/g, (token, offset) => {
      if (token === '&') {
        if (value[offset + 1] === '#') fail('XML_ENTITY', 'Malformed numeric entity.');
        if (!allowBareAmpersands) fail('XML_ENTITY', 'Bare ampersands require explicit compatibility mode.');
        literalAmpersands += 1;
        return '&';
      }
      const key = token.slice(1, -1);
      if (own(entities, key)) return entities[key];
      if (key[0] !== '#') fail('XML_ENTITY', 'Unknown named entity.');
      const hex = /^#[xX]/.test(key);
      const point = Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10);
      if (!Number.isInteger(point) || point < 0 || point > 0x10ffff) fail('XML_ENTITY', 'Invalid numeric entity.');
      const character = String.fromCodePoint(point);
      textInput(character, 2, 'FIELD_BUDGET');
      return character; // Character references preserve CR, unlike literal XML line endings.
    });
  }
  function append(value, cdata = false) {
    if (stack.length === 0) {
      if (hasText(value)) fail('XML_SYNTAX', 'Text outside the document root.');
      return;
    }
    const current = stack[stack.length - 1];
    const decoded = cdata ? value : decode(value);
    current.textLength += decoded.length;
    if (current.textLength > LAUNCHER_LIMITS.fieldChars) fail('FIELD_BUDGET', 'Element text exceeds the fixed budget.');
    current.parts.push(decoded);
  }
  while (at < input.length) {
    if (input[at] !== '<') {
      const end = input.indexOf('<', at);
      const stop = end < 0 ? input.length : end;
      const value = input.slice(at, stop);
      if (value.includes(']]>')) fail('XML_SYNTAX', 'CDATA terminator in ordinary text.');
      append(value); at = stop; continue;
    }
    if (input.startsWith('<!--', at)) {
      const end = input.indexOf('-->', at + 4);
      if (end < 0 || input.slice(at + 4, end).includes('--')) fail('XML_SYNTAX', 'Malformed comment.');
      at = end + 3; continue;
    }
    if (input.startsWith('<![CDATA[', at)) {
      if (!stack.length) fail('XML_SYNTAX', 'CDATA outside root.');
      const end = input.indexOf(']]>', at + 9);
      if (end < 0) fail('XML_SYNTAX', 'Unclosed CDATA.');
      append(input.slice(at + 9, end), true); at = end + 3; continue;
    }
    if (input.startsWith('<?', at)) {
      const end = input.indexOf('?>', at + 2);
      const declaration = input.slice(at, end + 2);
      const valid = /^<\?xml[ \t\r\n]+version[ \t\r\n]*=[ \t\r\n]*(?:"1\.0"|'1\.0')(?:[ \t\r\n]+encoding[ \t\r\n]*=[ \t\r\n]*(?:"[A-Za-z][A-Za-z0-9._-]{0,63}"|'[A-Za-z][A-Za-z0-9._-]{0,63}'))?(?:[ \t\r\n]+standalone[ \t\r\n]*=[ \t\r\n]*(?:"(?:yes|no)"|'(?:yes|no)'))?[ \t\r\n]*\?>$/;
      if (at !== 0 || end < 0 || declaration.length > 256 || !valid.test(declaration)) {
        fail('XML_UNSUPPORTED', 'Only an initial XML 1.0 declaration is supported.');
      }
      at = end + 2; continue;
    }
    if (input.startsWith('<!', at)) fail('XML_UNSUPPORTED', 'DTD, entity declarations and other declarations are unsupported.');
    at += 1;
    if (input[at] === '/') {
      at += 1; const closing = name(); space();
      if (input[at++] !== '>' || !stack.length || stack.pop().name !== closing) fail('XML_SYNTAX', 'Mismatched closing element.');
      continue;
    }
    const current = { name: name(), attrs: Object.create(null), children: [], parts: [], textLength: 0 };
    if (++nodes > LAUNCHER_LIMITS.xmlNodes) fail('XML_NODE_BUDGET', 'XML node budget exceeded.');
    if (stack.length >= LAUNCHER_LIMITS.xmlDepth) fail('XML_DEPTH', 'XML nesting budget exceeded.');
    let attributes = 0; let selfClosing = false;
    while (true) {
      const before = at; space();
      if (input.startsWith('/>', at)) { at += 2; selfClosing = true; break; }
      if (input[at] === '>') { at += 1; break; }
      if (at === before) fail('XML_SYNTAX', 'Attributes must be separated by whitespace.');
      const key = name();
      if (key === 'xmlns') fail('XML_UNSUPPORTED', 'XML namespaces are outside this subset.');
      if (own(current.attrs, key)) fail('XML_DUPLICATE_ATTRIBUTE', 'Duplicate attribute.');
      if (++attributes > LAUNCHER_LIMITS.attributesPerNode) fail('XML_ATTRIBUTE_BUDGET', 'Attribute budget exceeded.');
      space(); if (input[at++] !== '=') fail('XML_SYNTAX', 'Expected attribute assignment.');
      space(); const quote = input[at++];
      if (quote !== '"' && quote !== "'") fail('XML_SYNTAX', 'Expected quoted attribute.');
      const end = input.indexOf(quote, at);
      if (end < 0 || input.slice(at, end).includes('<')) fail('XML_SYNTAX', 'Invalid attribute value.');
      current.attrs[key] = field(decode(input.slice(at, end))); at = end + 1;
    }
    if (stack.length) stack[stack.length - 1].children.push(current);
    else if (root) fail('XML_SYNTAX', 'Multiple document roots.');
    else root = current;
    if (!selfClosing) stack.push(current);
  }
  if (!root || stack.length) fail('XML_SYNTAX', 'Empty or truncated XML document.');
  return { root, literalAmpersands };
}
function one(parent, name, required = false) {
  const items = parent.children.filter(child => child.name === name);
  if (items.length > 1) fail('DUPLICATE_FIELD', `Duplicate ${name} element.`);
  if (!items.length && required) fail('MISSING_FIELD', `Missing ${name} element.`);
  return items[0];
}
function leaf(parent, name, { required = false, trim = true } = {}) {
  const node = one(parent, name, required);
  if (!node) return '';
  if (node.children.length) fail('XML_SCHEMA', `${name} must contain text only.`);
  const value = field(node.parts.join(''));
  if (required && !value.trim()) fail('MISSING_FIELD', `${name} is empty.`);
  return trim ? value.trim() : value;
}
function pathPolicy(callback) {
  try { return callback(); } catch (error) {
    if (error instanceof LocalPathError) fail(error.code, error.message);
    throw error;
  }
}
function relativePath(value, optional = false) {
  return pathPolicy(() => localRelativePath(value, optional));
}
function directoryPath(value) {
  return pathPolicy(() => localDirectoryPath(value));
}
const knownFields = Object.freeze(['Name', 'EXE', 'Argsline', 'RegKey', 'RegValue', 'OldRegKey', 'OldRegValue', 'PatchEXE', 'ConfigEXE', 'SpeFile', 'Regions']);

function childrenOnly(node, childName) {
  if (hasText(node.parts.join('')) || node.children.some(child => child.name !== childName)) {
    fail('XML_SCHEMA', `Expected only ${childName} elements.`);
  }
  return node.children;
}
function nodeText(node, { trim = true, required = false } = {}) {
  if (node.children.length) fail('XML_SCHEMA', 'Expected text without nested elements.');
  const value = field(node.parts.join(''));
  if (required && !value.trim()) fail('MISSING_FIELD', 'Required text is empty.');
  return trim ? value.trim() : value;
}
function regionReferences(gameNode) {
  const container = one(gameNode, 'Regions');
  if (!container) return Object.freeze([]);
  const nodes = childrenOnly(container, 'Region');
  if (nodes.length > REGION_LIMITS.referencesPerGame) fail('REGION_BUDGET', 'Too many region references.');
  // Names and their order are retained; duplicate references are not silently removed.
  return Object.freeze(nodes.map(node => nodeText(node, { required: true, trim: false })));
}

/** Current Win32 container gate only. Text decoding and complete game/region fields are separate. */
export function inspectWin32LauncherCatalogContainers(gameListText, regionListText, options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)
    || ![Object.prototype, null].includes(Object.getPrototypeOf(options))
    || Reflect.ownKeys(options).some(key => key !== 'allowBareAmpersands')) {
    fail('INVALID_INPUT', 'Expected only an own XML compatibility option.');
  }
  const property = Object.getOwnPropertyDescriptor(options, 'allowBareAmpersands');
  if (property && (!own(property, 'value') || typeof property.value !== 'boolean')) {
    fail('INVALID_INPUT', 'Compatibility mode must be an own boolean value.');
  }
  const allowBareAmpersands = property ? property.value : false;
  const game = parseXML(gameListText, allowBareAmpersands);
  const region = parseXML(regionListText, allowBareAmpersands);
  // Native FirstChildElement selects the first exact named direct element; this gate permits empty containers.
  const gameList = game.root.name === 'Gamelist' && game.root.children.some(node => node.name === 'Games');
  const regionList = region.root.name === 'Regionlist' && region.root.children.some(node => node.name === 'Regions');
  return Object.freeze({ gameList, regionList, containersPresent: gameList && regionList,
    validation: 'containers-only', gameSemantics: 'unverified',
    diagnostics: Object.freeze({ gameListLiteralAmpersands: game.literalAmpersands,
      regionListLiteralAmpersands: region.literalAmpersands }) });
}

/** Already-decoded XML only; duplicates of Code retain distinct catalog ordinals. */
export function parseGameCatalog(input, options = {}) {
  const { allowBareAmpersands = false } = optionsObject(options);
  if (typeof allowBareAmpersands !== 'boolean') fail('INVALID_INPUT', 'Compatibility mode must be boolean.');
  const { root, literalAmpersands } = parseXML(input, allowBareAmpersands);
  if (root.name !== 'Gamelist' || hasText(root.parts.join(''))) fail('XML_SCHEMA', 'Expected a Gamelist root.');
  const gamesNode = one(root, 'Games', true);
  if (hasText(gamesNode.parts.join(''))) fail('XML_SCHEMA', 'Unexpected Games text.');
  const nodes = gamesNode.children.filter(child => child.name === 'Game');
  if (!nodes.length || nodes.length > LAUNCHER_LIMITS.games) fail('GAME_COUNT', 'Catalog must contain 1..128 games.');
  const games = nodes.map((node, ordinal) => {
    if (hasText(node.parts.join(''))) fail('XML_SCHEMA', 'Unexpected Game text.');
    const code = codeText(node.attrs.Code);
    const name = leaf(node, 'Name', { required: true });
    const client = relativePath(leaf(node, 'EXE', { required: true }));
    const patcherText = leaf(node, 'PatchEXE', { trim: false });
    const configurerText = leaf(node, 'ConfigEXE', { trim: false });
    const files = Object.freeze({ client,
      patcher: relativePath(patcherText.trim(), true),
      configuration: relativePath(configurerText.trim(), true),
      special: relativePath(leaf(node, 'SpeFile'), true) });
    const registry = Object.freeze({ key: leaf(node, 'RegKey'), valueName: leaf(node, 'RegValue'),
      oldKey: leaf(node, 'OldRegKey'), oldValueName: leaf(node, 'OldRegValue') });
    if (Boolean(registry.key) !== Boolean(registry.valueName) || Boolean(registry.oldKey) !== Boolean(registry.oldValueName)) {
      fail('REGISTRY_REFERENCE', 'Registry key/value references must be paired.');
    }
    return Object.freeze({ ordinal, code, name, files, patcherText, configurerText, registry, regions: regionReferences(node),
      argsLine: leaf(node, 'Argsline', { trim: false }),
      unhandledFields: Object.freeze([...new Set(node.children.map(child => child.name).filter(key => !knownFields.includes(key)))]) });
  });
  const head = one(root, 'Head');
  return Object.freeze({ games: Object.freeze(games),
    declaredVersion: head ? leaf(head, 'Version') : '',
    diagnostics: Object.freeze({ literalAmpersands }) });
}

function endpointAddress(value) {
  field(value);
  // This is a conservative metadata subset, not DNS resolution or endpoint reachability.
  if (!value || value.length > 255 || !/^[A-Za-z0-9.-]+$/.test(value)
    || value.startsWith('.') || value.endsWith('.') || value.includes('..')) {
    fail('UNSUPPORTED_ENDPOINT', 'Expected a plain IPv4/DNS address without a URL, path or credentials.');
  }
  return value;
}
function endpointPort(value) {
  if (typeof value !== 'string' || !/^[0-9]{1,5}$/.test(value) || Number(value) < 1 || Number(value) > 65535) {
    fail('ENDPOINT_PORT', 'Port must be decimal text in 1..65535.');
  }
  return Number(value);
}
function argumentCode(value) {
  const text = codeText(value);
  if (Number(text) > REGION_LIMITS.gameCodeMax) fail('UNSUPPORTED_GAME_CODE', 'Region argument slots support Gamecode 0..14 only.');
  return Number(text);
}

/** RegionList is local configuration data. Addresses and Args are never contacted or executed. */
export function parseRegionCatalog(input, options = {}) {
  const { allowBareAmpersands = false } = optionsObject(options);
  if (typeof allowBareAmpersands !== 'boolean') fail('INVALID_INPUT', 'Compatibility mode must be boolean.');
  const { root, literalAmpersands } = parseXML(input, allowBareAmpersands);
  if (root.name !== 'Regionlist' || hasText(root.parts.join(''))) fail('XML_SCHEMA', 'Expected a Regionlist root.');
  const nodes = childrenOnly(one(root, 'Regions', true), 'Region');
  if (!nodes.length || nodes.length > REGION_LIMITS.regions) fail('REGION_BUDGET', 'Region catalog must contain 1..40 regions.');
  const regions = nodes.map((node, ordinal) => {
    if (hasText(node.parts.join(''))) fail('XML_SCHEMA', 'Unexpected Region text.');
    const code = node.attrs.Code === undefined ? '' : codeText(node.attrs.Code);
    const name = leaf(node, 'Name', { required: true, trim: false });
    const billingList = one(node, 'BList');
    const billingNodes = billingList ? childrenOnly(billingList, 'BIP') : [];
    if (billingNodes.length > REGION_LIMITS.billingEndpoints) fail('REGION_BUDGET', 'Too many BIP endpoints.');
    const billingEndpoints = Object.freeze(billingNodes.map((entry, endpointOrdinal) => {
      const address = endpointAddress(nodeText(entry, { required: true }));
      const portText = entry.attrs.Port;
      return Object.freeze({ ordinal: endpointOrdinal, address, port: endpointPort(portText), portText });
    }));
    const address = leaf(node, 'PIP');
    const portText = leaf(node, 'PPort');
    if (Boolean(address) !== Boolean(portText)) fail('ENDPOINT_FIELDS', 'PIP and PPort must be supplied together.');
    const patchEndpoint = address ? Object.freeze({ address: endpointAddress(address), port: endpointPort(portText), portText }) : null;
    const statusAddress = leaf(node, 'StatusIP');
    if (statusAddress) endpointAddress(statusAddress);
    const argsList = one(node, 'Arglist');
    const argsNodes = argsList ? childrenOnly(argsList, 'Args') : [];
    if (argsNodes.length > REGION_LIMITS.argumentsPerRegion) fail('REGION_BUDGET', 'Too many Args entries.');
    const args = Object.freeze(argsNodes.map((entry, argumentOrdinal) => {
      const gameCode = codeText(entry.attrs.Gamecode);
      argumentCode(gameCode);
      return Object.freeze({ ordinal: argumentOrdinal, gameCode, text: nodeText(entry, { trim: false }) });
    }));
    const closedNode = one(node, 'Closed');
    const closedMessage = closedNode ? nodeText(closedNode, { trim: false }).replace(/\\n/g, '\n') : '';
    const galaxy = one(node, 'Galaxylist');
    const galaxyNodes = galaxy ? childrenOnly(galaxy, 'Galaxy') : [];
    if (galaxyNodes.length > REGION_LIMITS.galaxiesPerRegion) fail('REGION_BUDGET', 'Too many Galaxy records.');
    const galaxies = Object.freeze(galaxyNodes.map((entry, galaxyOrdinal) => {
      const gameCode = codeText(entry.attrs.Gamecode); argumentCode(gameCode);
      const name = field(entry.attrs.Name);
      if (!name.trim()) fail('XML_SCHEMA', 'Expected a nonempty Galaxy Name.');
      return Object.freeze({ ordinal: galaxyOrdinal, gameCode, name, text: nodeText(entry, { trim: false }) });
    }));
    const hasGalaxyList = galaxies.length > 0;
    const handled = ['Name', 'BList', 'PIP', 'PPort', 'StatusIP', 'Arglist', 'Closed', 'Galaxylist'];
    return Object.freeze({ ordinal, code, name, billingEndpoints, patchEndpoint, statusAddress,
      args, closed: Boolean(closedNode), closedMessage, hasGalaxyList,
      ...(hasGalaxyList ? { galaxies } : {}),
      unhandledFields: Object.freeze([...new Set(node.children.map(child => child.name).filter(key => !handled.includes(key)))]) });
  });
  const head = one(root, 'Head');
  return Object.freeze({ regions: Object.freeze(regions), declaredVersion: head ? leaf(head, 'Version') : '',
    diagnostics: Object.freeze({ literalAmpersands }) });
}

function selectedGame(catalog, ordinal) {
  if (!catalog || !Array.isArray(catalog.games) || !catalog.games.length || catalog.games.length > LAUNCHER_LIMITS.games) {
    fail('INVALID_INPUT', 'Expected a bounded parsed game catalog.');
  }
  if (!Number.isSafeInteger(ordinal) || ordinal < 0 || ordinal >= catalog.games.length) fail('ORDINAL_BOUNDS', 'Invalid game ordinal.');
  const game = catalog.games[ordinal];
  if (!game || game.ordinal !== ordinal || !Array.isArray(game.regions) || game.regions.length > REGION_LIMITS.referencesPerGame) {
    fail('INVALID_INPUT', 'Expected a parsed game with region references.');
  }
  codeText(game.code); field(game.argsLine);
  for (const name of game.regions) if (!field(name).trim()) fail('INVALID_INPUT', 'Empty region reference.');
  return game;
}
function regionRecords(catalog) {
  if (!catalog || !Array.isArray(catalog.regions) || !catalog.regions.length || catalog.regions.length > REGION_LIMITS.regions) {
    fail('INVALID_INPUT', 'Expected a bounded parsed region catalog.');
  }
  catalog.regions.forEach((region, ordinal) => {
    if (!region || region.ordinal !== ordinal || typeof region.closed !== 'boolean' || !field(region.name).trim()) {
      fail('INVALID_INPUT', 'Invalid region record.');
    }
  });
  return catalog.regions;
}

/** Resolve exact decoded names in reference order; missing/ambiguous references remain visible. */
export function listGameRegions(gameCatalog, gameOrdinal, regionCatalog) {
  const game = selectedGame(gameCatalog, gameOrdinal);
  const records = regionRecords(regionCatalog);
  return Object.freeze(game.regions.map((name, referenceOrdinal) => {
    const matches = records.filter(region => region.name === name);
    const status = !matches.length ? 'missing' : matches.length > 1 ? 'ambiguous' : matches[0].closed ? 'closed' : 'available';
    return Object.freeze({ referenceOrdinal, name, status, regionOrdinal: matches.length === 1 ? matches[0].ordinal : null,
      matchedOrdinals: Object.freeze(matches.map(region => region.ordinal)) });
  }));
}

/** Select only a referenced region. Result is data; it never grants authentication or runtime readiness. */
function regionSelection(gameCatalog, gameOrdinal, regionCatalog, referenceOrdinal) {
  const game = selectedGame(gameCatalog, gameOrdinal);
  const choices = listGameRegions(gameCatalog, gameOrdinal, regionCatalog);
  if (!Number.isSafeInteger(referenceOrdinal) || referenceOrdinal < 0 || referenceOrdinal >= choices.length) {
    fail('ORDINAL_BOUNDS', 'Invalid region reference ordinal.');
  }
  const choice = choices[referenceOrdinal];
  if (choice.status !== 'available') fail(`REGION_${choice.status.toUpperCase()}`, 'Selected region is unavailable or ambiguous.');
  const region = regionCatalog.regions[choice.regionOrdinal];
  if (typeof region.hasGalaxyList !== 'boolean') fail('INVALID_INPUT', 'Invalid Galaxy status.');
  return { game, region };
}

function galaxyChoices(game, region) {
  const records = region.galaxies ?? [];
  if (!Array.isArray(records) || records.length > REGION_LIMITS.galaxiesPerRegion || Boolean(records.length) !== region.hasGalaxyList) {
    fail('INVALID_INPUT', 'Invalid Galaxy records.');
  }
  const slot = argumentCode(game.code), names = new Map();
  for (const [ordinal, record] of records.entries()) {
    if (!record || record.ordinal !== ordinal || !field(record.name).trim()) fail('INVALID_INPUT', 'Invalid Galaxy record.');
    field(record.text); argumentCode(record.gameCode);
    names.set(record.name, (names.get(record.name) ?? 0) + 1);
  }
  return Object.freeze(records.filter(record => argumentCode(record.gameCode) === slot).map(record => Object.freeze({
    galaxyOrdinal: record.ordinal, gameCode: record.gameCode, name: record.name, text: record.text,
    status: names.get(record.name) === 1 ? 'available' : 'ambiguous-name' })));
}

/** Keep source ordinals after Gamecode filtering. Duplicate labels across the region are deliberately unselectable. */
export function listGameGalaxies(gameCatalog, gameOrdinal, regionCatalog, referenceOrdinal) {
  const { game, region } = regionSelection(gameCatalog, gameOrdinal, regionCatalog, referenceOrdinal);
  return galaxyChoices(game, region);
}

/** Explicit Galaxy selection is required only when this game's filtered list is nonempty. */
export function selectLauncherRegion(gameCatalog, gameOrdinal, regionCatalog, referenceOrdinal, options = {}) {
  const { game, region } = regionSelection(gameCatalog, gameOrdinal, regionCatalog, referenceOrdinal);
  const choices = galaxyChoices(game, region);
  let descriptor;
  try { descriptor = Object.getOwnPropertyDescriptor(optionsObject(options), 'galaxyOrdinal'); }
  catch { fail('INVALID_INPUT', 'Expected Galaxy selection data.'); }
  if (descriptor && !own(descriptor, 'value')) fail('INVALID_INPUT', 'Expected an own Galaxy ordinal.');
  let galaxy = null;
  if (choices.length) {
    if (!descriptor) fail('GALAXY_SELECTION_REQUIRED', 'Select a Galaxy record explicitly.');
    if (!Number.isSafeInteger(descriptor.value) || descriptor.value < 0) fail('ORDINAL_BOUNDS', 'Invalid Galaxy ordinal.');
    galaxy = choices.find(choice => choice.galaxyOrdinal === descriptor.value);
    if (!galaxy) fail('GALAXY_UNAVAILABLE', 'The Galaxy record does not match this game.');
    if (galaxy.status !== 'available') fail('GALAXY_AMBIGUOUS', 'The Galaxy label is ambiguous within this region.');
  } else if (descriptor) fail('GALAXY_UNAVAILABLE', 'This game has no Galaxy selection.');
  const gameSlot = argumentCode(game.code);
  if (!Array.isArray(region.args) || region.args.length > REGION_LIMITS.argumentsPerRegion) fail('INVALID_INPUT', 'Invalid Args list.');
  const matches = region.args.filter(entry => {
    if (!entry || typeof entry !== 'object') fail('INVALID_INPUT', 'Invalid Args record.');
    field(entry.text);
    return argumentCode(entry.gameCode) === gameSlot;
  });
  if (matches.length > 1) fail('AMBIGUOUS_ARGUMENTS', 'Multiple Args records resolve to the same game slot.');
  if (!Array.isArray(region.billingEndpoints) || region.billingEndpoints.length > REGION_LIMITS.billingEndpoints) fail('INVALID_INPUT', 'Invalid BIP list.');
  const cloneEndpoint = entry => {
    if (!entry || typeof entry !== 'object') fail('INVALID_INPUT', 'Invalid endpoint record.');
    const address = endpointAddress(entry.address);
    const port = endpointPort(entry.portText);
    if (port !== entry.port) fail('INVALID_INPUT', 'Endpoint port metadata is inconsistent.');
    return Object.freeze({ address, port, portText: entry.portText });
  };
  const billingEndpoints = Object.freeze(region.billingEndpoints.map(cloneEndpoint));
  const patchEndpoint = region.patchEndpoint === null ? null : cloneEndpoint(region.patchEndpoint);
  field(region.statusAddress); if (region.statusAddress) endpointAddress(region.statusAddress);
  if (region.code) codeText(region.code);
  return Object.freeze({ gameOrdinal, gameCode: game.code, referenceOrdinal, regionOrdinal: region.ordinal,
    regionCode: region.code, regionName: region.name, billingEndpoints, patchEndpoint, statusAddress: region.statusAddress,
    baseArgs: game.argsLine, regionArgs: matches[0]?.text ?? '',
    ...(galaxy ? { galaxyOrdinal: galaxy.galaxyOrdinal, galaxyName: galaxy.name, galaxyArgs: galaxy.text } : {}),
    authentication: 'unverified' });
}

export function createOfflineRegionLaunchPlan(gameCatalog, gameOrdinal, regionCatalog, referenceOrdinal, options = {}) {
  const region = selectLauncherRegion(gameCatalog, gameOrdinal, regionCatalog, referenceOrdinal, options);
  const plan = createOfflineLaunchPlan(gameCatalog, gameOrdinal, options);
  return Object.freeze({ ...plan, region });
}

/** Strict INI subset: sections, key=value, semicolon comment lines; no interpolation or writes. */
export function parsePathOverrides(input) {
  const text = textInput(input, LAUNCHER_LIMITS.iniChars, 'INI_BUDGET');
  let section = ''; let sawPath = false;
  const paths = []; const seen = new Set();
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith(';')) continue;
    if (line.startsWith('[')) {
      const match = /^\[([^\[\]]+)\]$/.exec(line);
      if (!match) fail('INI_SYNTAX', 'Malformed INI section.');
      section = match[1].trim().toLowerCase();
      if (section === 'path') {
        if (sawPath) fail('INI_DUPLICATE', 'Duplicate Path section.');
        sawPath = true;
      }
      continue;
    }
    const equals = line.indexOf('=');
    if (!section || equals < 1) fail('INI_SYNTAX', 'Expected a section and key=value.');
    if (section !== 'path') continue;
    const key = line.slice(0, equals).trim();
    const match = /^Game([0-9]{1,8})$/i.exec(key);
    if (!match) continue;
    const code = match[1];
    if (seen.has(code)) fail('INI_DUPLICATE', 'Duplicate game directory key.');
    seen.add(code);
    paths.push(Object.freeze({ code, key: `Game${code}`, path: field(line.slice(equals + 1).trim()) }));
    if (paths.length > LAUNCHER_LIMITS.games) fail('GAME_COUNT', 'INI path count exceeds budget.');
  }
  return Object.freeze(paths);
}
function registryReference(game) {
  if (!game || typeof game !== 'object' || !game.registry) fail('INVALID_INPUT', 'Expected a catalog game record.');
  codeText(game.code);
  for (const key of ['key', 'valueName', 'oldKey', 'oldValueName']) field(game.registry[key]);
  return game.registry;
}

/** Registry status/value is explicitly supplied by the caller; no registry, INI or directory I/O. */
export function resolveGameDirectory(game, options = {}) {
  const { registry, iniText } = optionsObject(options);
  const reference = registryReference(game);
  let status = 'not-provided';
  if (registry !== undefined) {
    if (!registry || !['found', 'missing', 'unreadable'].includes(registry.status)) fail('REGISTRY_RESULT', 'Unknown registry lookup result.');
    status = registry.status;
    if (typeof registry.key === 'string') field(registry.key);
    if (typeof registry.valueName === 'string') field(registry.valueName);
    if (registry.hive !== 'HKCU' || typeof registry.key !== 'string' || typeof registry.valueName !== 'string'
      || registry.key.toLowerCase() !== reference.key.toLowerCase()
      || registry.valueName.toLowerCase() !== reference.valueName.toLowerCase() || !reference.key) {
      fail('REGISTRY_MISMATCH', 'Snapshot does not match this game HKCU reference.');
    }
    if (status === 'found') return Object.freeze({ source: 'registry', path: directoryPath(registry.value),
      hive: 'HKCU', key: reference.key, valueName: reference.valueName });
  }
  if (reference.oldKey || reference.oldValueName) {
    fail('UNSUPPORTED_LEGACY_REGISTRY', 'Legacy lookup/migration is outside this read-only subset.');
  }
  if (iniText !== undefined) {
    const item = parsePathOverrides(iniText).find(item => item.code === game.code);
    if (item?.path) return Object.freeze({ source: 'ini', path: directoryPath(item.path),
      section: 'Path', key: item.key, registryStatus: status });
  }
  fail('NO_DIRECTORY', 'No directory was supplied for this game.');
}

/** Data-only file plan. Argsline remains opaque; no command line, auth, existence check or execution. */
export function createOfflineLaunchPlan(catalog, ordinal, options = {}) {
  if (!catalog || !Array.isArray(catalog.games) || catalog.games.length > LAUNCHER_LIMITS.games) fail('INVALID_INPUT', 'Expected a bounded parsed catalog.');
  if (!Number.isSafeInteger(ordinal) || ordinal < 0 || ordinal >= catalog.games.length) fail('ORDINAL_BOUNDS', 'Select a valid catalog ordinal, not a possibly repeated Code.');
  const game = catalog.games[ordinal];
  if (!game || game.ordinal !== ordinal || !game.files) fail('INVALID_INPUT', 'Invalid catalog record.');
  field(game.name); field(game.argsLine);
  const directory = resolveGameDirectory(game, options);
  const files = Object.create(null);
  for (const role of ['client', 'patcher', 'configuration', 'special']) {
    const relative = game.files[role] === null && role !== 'client' ? null : relativePath(game.files[role]);
    files[role] = relative === null ? null : Object.freeze({ relativePath: relative,
      windowsPath: pathPolicy(() => joinLocalPath(directory.path, relative)) });
  }
  return Object.freeze({ ordinal, code: game.code, name: game.name, directory,
    files: Object.freeze(files), argsLine: game.argsLine });
}
