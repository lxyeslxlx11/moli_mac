/** Explicit directory/catalog plans; first-Config uses caller-provided account-derived identity. No account reads or file/process I/O. */
import { LAUNCHER_RESOURCE_GROUPS, createLauncherProcessPlan, createLauncherFirstConfigPlan, encodeLauncherProcessField, selectLauncherRegion } from '../shared/index.mjs';
import { localDirectoryPath, joinLocalPath } from '../shared/local-paths.mjs';
import { snapshotLauncherCatalogCandidate } from './launcher-catalog-data.mjs';
export class LauncherLaunchDataError extends Error {
  constructor() { super('The local directory or configured process fields are unsupported.'); this.name = 'LauncherLaunchDataError'; this.code = 'LAUNCH_DATA'; }
}
const fail = () => { throw new LauncherLaunchDataError(); };
const own = (value, key) => {
  let property; try { property = Object.getOwnPropertyDescriptor(value, key); } catch { fail(); }
  if (!property || !Object.hasOwn(property, 'value')) fail(); return property.value;
};
const lower = value => value.replace(/[A-Z]/g, letter => String.fromCharCode(letter.charCodeAt(0) + 32));
const rawAscii = value => {
  if (!/^[\x20-\x7e]+$/.test(value)) fail();
  return Uint8Array.from(value, character => character.charCodeAt(0));
};
/** Ordered browser-long-name subset, deliberately distinct from Win32 wildcard/8.3/enumeration behavior. */
export function snapshotLauncherDirectory(input) {
  try {
    if (!Array.isArray(input)) fail();
    const count = own(input, 'length'); if (!Number.isInteger(count) || count < 1 || count > 32768) fail();
    const groups = LAUNCHER_RESOURCE_GROUPS.map(({ id }) => ({ id, state: 'enumerated', entries: [] }));
    const seen = new Set(); let root, matchedFiles = 0;
    for (let index = 0; index < count; index++) {
      const path = own(own(input, String(index)), 'relativePath');
      if (typeof path !== 'string' || path.length > 4096 || /[\x00-\x1f\\:]/.test(path)) fail();
      const parts = path.split('/');
      if (parts.length < 2 || parts.some(part => !part || part === '.' || part === '..')) fail();
      if (root === undefined) root = parts[0]; else if (root !== parts[0]) fail();
      const canonical = lower(parts.slice(1).join('/')); if (seen.has(canonical)) fail(); seen.add(canonical);
      const name = parts.at(-1), parent = lower(parts.slice(1, -1).join('/')), title = lower(name);
      let group = -1;
      const pair = parent === 'bin' ? 0 : parent === 'bin/puk2' ? 2 : parent === 'bin/puk3' ? 4 : -1;
      if (pair >= 0 && title.endsWith('.bin')) {
        if (title.startsWith('anime')) group = pair;
        else if (title.startsWith('graphic')) group = pair + 1;
        else if (parent === 'bin' && title.startsWith('coordinate')) group = 6;
      }
      if (group < 0) continue;
      if (groups[group].entries.length >= 4096) fail();
      groups[group].entries.push(Object.freeze({ attributes: 32, fileNameBytes: rawAscii(name) })); matchedFiles++;
    }
    return Object.freeze({ filesSeen: count, matchedFiles, ignoredFiles: count - matchedFiles,
      resourceGroups: Object.freeze(groups.map(group => Object.freeze({ ...group, entries: Object.freeze(group.entries) }))),
      profile: 'browser-long-name-ascii', order: 'provided', nativeEnumeration: 'unverified', assetContent: 'not-read' });
  } catch { fail(); }
}
/** Directory is explicitly supplied by the user; this does not claim a registry/INI lookup or actual file existence. */
export function createLauncherCatalogProcessInput(input) {
  let fields;
  try {
    const candidate = snapshotLauncherCatalogCandidate(own(input, 'catalogs'));
    const gameOrdinal = own(input, 'gameOrdinal'), referenceOrdinal = own(input, 'referenceOrdinal');
    const descriptor = Object.getOwnPropertyDescriptor(input, 'galaxyOrdinal');
    const selected = selectLauncherRegion(candidate.games, gameOrdinal, candidate.regions, referenceOrdinal,
      descriptor ? { galaxyOrdinal: own(input, 'galaxyOrdinal') } : {});
    const game = candidate.games.games[gameOrdinal], gameCode = Number(game.code);
    const encoding = own(input, 'pathEncoding'), directory = localDirectoryPath(own(input, 'directoryText'));
    const encode = text => encodeLauncherProcessField(text, { encoding });
    const refreshProperty = Object.getOwnPropertyDescriptor(input, 'onlyRefreshWord');
    fields = { gameCode, onlyRefreshWord: refreshProperty ? own(input, 'onlyRefreshWord') : 0, caseProfile: 'ascii' };
    for (const [key, text] of [['directoryBytes', directory], ['executablePathBytes', joinLocalPath(directory, game.files.client)],
      ['argsLineBytes', selected.baseArgs], ['regionArgsBytes', selected.regionArgs], ['galaxyArgsBytes', selected.galaxyArgs ?? '']]) fields[key] = encode(text);
    if ([0, 1, 2, 4, 11].includes(gameCode) && fields.onlyRefreshWord === 0) fields.resourceGroups = own(input, 'resourceGroups');
    // Validate the complete aggregate now; the returned input is revalidated when a selection creates the lease.
    const check = createLauncherProcessPlan(fields);
    check.commandLineBytes.fill(0); check.workingDirectoryBytes.fill(0);
    for (const group of check.resourceGroups) group.patternBytes.fill(0);
    return Object.freeze(fields);
  } catch {
    if (fields) for (const key of ['directoryBytes', 'executablePathBytes', 'argsLineBytes', 'regionArgsBytes', 'galaxyArgsBytes']) fields[key]?.fill(0);
    fail();
  }
}

/** Binds the proven first-Config producer to one selected catalog record. Only explicit synthetic/authorized caller snapshots. */
export function createLauncherCatalogFirstConfigPlan(input) {
  const encoded=[];
  try {
    const candidate=snapshotLauncherCatalogCandidate(own(input,'catalogs')),gameOrdinal=own(input,'gameOrdinal'),referenceOrdinal=own(input,'referenceOrdinal');
    const galaxy=Object.getOwnPropertyDescriptor(input,'galaxyOrdinal');
    const selected=selectLauncherRegion(candidate.games,gameOrdinal,candidate.regions,referenceOrdinal,galaxy?{galaxyOrdinal:own(input,'galaxyOrdinal')}:{});
    const game=candidate.games.games[gameOrdinal],directory=localDirectoryPath(own(input,'directoryText')),pathEncoding=own(input,'pathEncoding');
    const encode=text=>{const bytes=encodeLauncherProcessField(text,{encoding:pathEncoding});encoded.push(bytes);return bytes;};
    const firstConfig=createLauncherFirstConfigPlan({usernameBytes:own(input,'usernameBytes'),firstConfigWord:own(input,'firstConfigWord'),
      codeTextBytes:encode(game.code),directoryBytes:encode(directory),configurerBytes:encode(game.configurerText)});
    return Object.freeze({binding:Object.freeze({gameOrdinal,referenceOrdinal,regionOrdinal:selected.regionOrdinal,gameCodeText:game.code,
      directoryText:directory,pathEncoding,configurerText:game.configurerText,gameListMd5:candidate.gameListMd5,regionListMd5:candidate.regionListMd5,
      ...(selected.galaxyOrdinal===undefined?{}:{galaxyOrdinal:selected.galaxyOrdinal})}),firstConfig,authentication:'unverified',execution:'not-performed'});
  }catch{fail();}
  finally{for(const bytes of encoded)Uint8Array.prototype.fill.call(bytes,0);}
}
