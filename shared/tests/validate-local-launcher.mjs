/** Explicit fixed config/vector verification only. No directory scan, execution or network. */
import { open, constants } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { parseGameCatalog, parseRegionCatalog, listGameRegions, selectLauncherRegion,
  encodeLauncherRequest10, decodeLauncherRequest10, encodeLauncherRequest10Frame, decodeLauncherRequest10Frame } from '../index.mjs';

async function read(path, limit) {
  const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const before = await file.stat();
    if (!before.isFile() || before.size <= 0 || before.size > limit) throw new Error('Expected a bounded regular file.');
    const bytes = new Uint8Array(before.size);
    let offset = 0;
    while (offset < bytes.length) {
      const { bytesRead } = await file.read(bytes, offset, bytes.length - offset, offset);
      if (!bytesRead) throw new Error('Short read.');
      offset += bytesRead;
    }
    const after = await file.stat();
    if (before.ino !== after.ino || before.size !== after.size || before.mtimeMs !== after.mtimeMs) throw new Error('Input changed.');
    return bytes;
  } finally { await file.close(); }
}
const hash = value => createHash('sha256').update(value).digest('hex');
const hex = value => Buffer.from(value).toString('hex');
const same = (actual, expected) => { if (!isDeepStrictEqual(actual, expected)) throw new Error('Independent oracle mismatch.'); };
try {
  const [oraclePath, vectorPath, gamePath, regionPath, ...extra] = process.argv.slice(2);
  if (!regionPath || extra.length) throw new Error('Usage: node shared/tests/validate-local-launcher.mjs config-oracle.json vectors.json GameList.xml RegionList.xml');
  const oracle = JSON.parse(new TextDecoder().decode(await read(oraclePath, 256 * 1024)));
  const vectors = JSON.parse(new TextDecoder().decode(await read(vectorPath, 65536)));
  if (oracle.schema !== 'moli.launcher-v6.configuration-oracle.v1' || vectors.schema !== 'moli.launcher-v6.request10-vectors.v1') throw new Error('Wrong oracle schema.');
  const gameBytes = await read(gamePath, 1024 * 1024), regionBytes = await read(regionPath, 1024 * 1024);
  for (const [name, bytes] of [['games', gameBytes], ['regions', regionBytes]]) {
    same(bytes.length, oracle.source[name].bytes); same(hash(bytes), oracle.source[name].sha256);
  }
  const decoder = new TextDecoder('gb18030', { fatal: true });
  const games = parseGameCatalog(decoder.decode(gameBytes), { allowBareAmpersands: true });
  const regions = parseRegionCatalog(decoder.decode(regionBytes));
  same(games.diagnostics.literalAmpersands, oracle.literalAmpersands);
  const endpoint = value => value ? { addressSha256: hash(value.address), port: value.port, portText: value.portText } : null;
  same(regions.regions.map(region => ({ ordinal: region.ordinal, code: region.code, nameSha256: hash(region.name),
    billing: region.billingEndpoints.map(endpoint), patch: endpoint(region.patchEndpoint), statusAddressSha256: hash(region.statusAddress),
    args: region.args.map(entry => ({ ordinal: entry.ordinal, gameCode: entry.gameCode, textSha256: hash(entry.text) })),
    closed: region.closed, hasGalaxyList: region.hasGalaxyList })), oracle.regions);
  same(games.games.map(game => ({ ordinal: game.ordinal, code: game.code, nameSha256: hash(game.name), baseArgsSha256: hash(game.argsLine),
    referenceNameSha256: game.regions.map(hash), choices: listGameRegions(games, game.ordinal, regions).map(choice => ({
      referenceOrdinal: choice.referenceOrdinal, status: choice.status, matchedOrdinals: [...choice.matchedOrdinals] })) })), oracle.games);
  let selected = 0, missing = 0;
  for (const game of games.games) {
    for (const choice of listGameRegions(games, game.ordinal, regions)) {
      if (choice.status !== 'available') { missing += 1; continue; }
      const result = selectLauncherRegion(games, game.ordinal, regions, choice.referenceOrdinal);
      const expected = oracle.regions[result.regionOrdinal].args.filter(entry => Number(entry.gameCode) === Number(game.code));
      same(hash(result.regionArgs), expected[0]?.textSha256 ?? hash('')); same(result.authentication, 'unverified'); selected += 1;
    }
  }
  for (const vector of vectors.vectors) {
    const input = { wordA: vector.wordA, wordB: vector.wordB, fieldA: new Uint8Array(Buffer.from(vector.fieldAHex, 'hex')), fieldB: new Uint8Array(Buffer.from(vector.fieldBHex, 'hex')) };
    same(hex(encodeLauncherRequest10(input)), vector.bodyHex); same(hex(encodeLauncherRequest10Frame(input)), vector.frameHex);
    for (const result of [decodeLauncherRequest10(Buffer.from(vector.bodyHex, 'hex')), decodeLauncherRequest10Frame(Buffer.from(vector.frameHex, 'hex'))]) {
      same(result.wordA, input.wordA); same(result.wordB, input.wordB); same(hex(result.fieldA), vector.fieldAHex); same(hex(result.fieldB), vector.fieldBHex);
    }
  }
  console.log(JSON.stringify({ passed: true, fixedConfigHashes: oracle.source, games: games.games.length, regions: regions.regions.length,
    availableSelectionsPassed: selected, unavailableReferences: missing, originalMessageVectorsPassed: vectors.vectors.length,
    scope: 'Fixed offline config and original synthetic request-byte vectors; no real authentication/session or official compatibility.' }, null, 2));
} catch (error) { console.error(error.message); process.exitCode = 1; }
