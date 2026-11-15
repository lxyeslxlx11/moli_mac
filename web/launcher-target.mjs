/** Bind a validated catalog choice to an explicit transport allowlist. No I/O or account fields. */
import { selectLauncherRegion } from '../shared/index.mjs';
import { snapshotLauncherCatalogCandidate } from './launcher-catalog-data.mjs';
import { snapshotSessionEndpoints } from './launcher-session-data.mjs';
const messages = Object.freeze({ TARGET_INPUT: 'Configuration or selection is invalid.',
  TARGET_REGION: 'The selected region is unavailable or unsupported.', TARGET_GAME: 'The configured game code is outside the supported request slots.',
  TARGET_EMPTY: 'The selected region has no billing endpoint.', TARGET_DENIED: 'A configured endpoint is outside the explicit transport allowlist.' });
export class LauncherTargetError extends Error {
  constructor(code) { const selected = typeof code === 'string' && Object.hasOwn(messages, code) ? code : 'TARGET_INPUT'; super(messages[selected]); this.name = 'LauncherTargetError'; this.code = selected; }
}
const fail = code => { throw new LauncherTargetError(code); };
export function bindLauncherSessionTarget(input) {
  let candidate, allowed, gameOrdinal, referenceOrdinal, galaxyOptions = {};
  try {
    const own = name => {
      const property = Object.getOwnPropertyDescriptor(input, name);
      if (!property || !Object.hasOwn(property, 'value')) fail('TARGET_INPUT');
      return property.value;
    };
    candidate = snapshotLauncherCatalogCandidate(own('catalogs'));
    allowed = snapshotSessionEndpoints(own('allowedEndpoints'));
    gameOrdinal = own('gameOrdinal'); referenceOrdinal = own('referenceOrdinal');
    if (Object.getOwnPropertyDescriptor(input, 'galaxyOrdinal')) galaxyOptions = { galaxyOrdinal: own('galaxyOrdinal') };
  } catch { fail('TARGET_INPUT'); }
  if (!Number.isSafeInteger(gameOrdinal) || gameOrdinal < 0 || gameOrdinal >= candidate.games.games.length) fail('TARGET_REGION');
  const gameCodeText = candidate.games.games[gameOrdinal].code, gameCode = Number(gameCodeText);
  if (!Number.isInteger(gameCode) || gameCode < 0 || gameCode > 14) fail('TARGET_GAME');
  let selected;
  try { selected = selectLauncherRegion(candidate.games, gameOrdinal, candidate.regions, referenceOrdinal, galaxyOptions); }
  catch { fail('TARGET_REGION'); }
  if (selected.billingEndpoints.length === 0) fail('TARGET_EMPTY');
  const key = value => JSON.stringify([value.address, value.port]);
  const permitted = new Set(allowed.map(key));
  if (selected.billingEndpoints.some(value => !permitted.has(key(value)))) fail('TARGET_DENIED');
  return Object.freeze({ gameOrdinal, referenceOrdinal, regionOrdinal: selected.regionOrdinal,
    gameCodeText, gameCode, gameName: candidate.games.games[gameOrdinal].name, regionName: selected.regionName,
    endpoints: Object.freeze(selected.billingEndpoints.map(({ address, port }) => Object.freeze({ address, port }))),
    catalogIdentity: Object.freeze({ gameListMd5: candidate.gameListMd5, regionListMd5: candidate.regionListMd5 }),
    ...(selected.galaxyOrdinal !== undefined ? { galaxyOrdinal: selected.galaxyOrdinal, galaxyName: selected.galaxyName } : {}),
    trust: 'unverified', authentication: 'unverified' });
}
