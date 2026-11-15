/** Validate only explicit metadata snapshots. Does not read, hash, scan, trust or execute files. */
import { LocalPathError, localRelativePath, localDirectoryPath, localPathKey, joinLocalPath } from './local-paths.mjs';
export const INVENTORY_LIMITS = Object.freeze({ files: 16384, expectations: 4096, metadataCharacters: 4 * 1024 * 1024 });
export class InventoryError extends Error {
  constructor(code, message) { super(message); this.name = 'InventoryError'; this.code = code; }
}
function fail(code, message) { throw new InventoryError(code, message); }
function pathPolicy(callback) {
  try { return callback(); } catch (error) {
    if (error instanceof LocalPathError) fail(error.code, error.message);
    throw error;
  }
}
function byteLength(value) {
  if (!Number.isSafeInteger(value) || value < 0) fail('INVALID_SIZE', 'Byte length must be a nonnegative safe integer.');
  return value;
}
function sha256(value) {
  if (typeof value !== 'string' || !/^[a-fA-F0-9]{64}$/.test(value)) fail('INVALID_DIGEST', 'Expected a 64-hex SHA256 metadata value.');
  return value.toLowerCase();
}
const roles = Object.freeze(['client', 'patcher', 'configuration', 'special']);

export function verifyInstallInventory(plan, inventory, options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) fail('INVALID_INPUT', 'Expected an options object.');
  const expected = options.expected === undefined ? [] : options.expected;
  if (!plan || !plan.directory || !plan.files || typeof plan.code !== 'string' || !/^[0-9]{1,8}$/.test(plan.code)
    || !Number.isSafeInteger(plan.ordinal) || plan.ordinal < 0) fail('INVALID_PLAN', 'Expected a data-only launch file plan.');
  if (Object.keys(plan.files).some(role => !roles.includes(role))) fail('INVALID_PLAN', 'Unknown plan file role.');
  if (!inventory || !Array.isArray(inventory.files)) fail('INVALID_INPUT', 'Expected an explicit inventory snapshot.');
  if (inventory.files.length > INVENTORY_LIMITS.files) fail('INVENTORY_BUDGET', 'Too many inventory entries.');
  if (!Array.isArray(expected) || expected.length > INVENTORY_LIMITS.expectations) fail('EXPECTATION_BUDGET', 'Expected a bounded expectations array.');
  const rootPath = pathPolicy(() => localDirectoryPath(plan.directory.path));
  const suppliedRoot = pathPolicy(() => localDirectoryPath(inventory.rootPath));
  if (localPathKey(rootPath) !== localPathKey(suppliedRoot)) fail('ROOT_MISMATCH', 'Inventory is for a different directory.');
  let metadataCharacters = rootPath.length + suppliedRoot.length;
  function relative(value) {
    const result = pathPolicy(() => localRelativePath(value));
    metadataCharacters += result.length;
    if (metadataCharacters > INVENTORY_LIMITS.metadataCharacters) fail('METADATA_BUDGET', 'Inventory path text exceeds the fixed budget.');
    return result;
  }
  const requirements = new Map();
  for (const role of roles) {
    if (!Object.prototype.hasOwnProperty.call(plan.files, role)) fail('INVALID_PLAN', 'Missing own file role.');
    const descriptor = plan.files[role];
    if (descriptor === null && role !== 'client') continue;
    if (!descriptor || typeof descriptor !== 'object') fail('INVALID_PLAN', 'Missing configured file descriptor.');
    const name = relative(descriptor.relativePath);
    const declaredPath = pathPolicy(() => localDirectoryPath(descriptor.windowsPath));
    if (localPathKey(declaredPath) !== localPathKey(joinLocalPath(rootPath, name))) fail('PLAN_PATH_MISMATCH', 'Plan file is inconsistent with its root and relative path.');
    const key = localPathKey(name);
    const row = requirements.get(key) ?? { relativePath: name, roles: [], expected: null };
    row.roles.push(role); requirements.set(key, row);
  }
  const expectationKeys = new Set();
  for (const item of expected) {
    if (!item || typeof item !== 'object') fail('INVALID_INPUT', 'Expected a metadata expectation.');
    const name = relative(item.relativePath); const key = localPathKey(name);
    if (expectationKeys.has(key)) fail('DUPLICATE_EXPECTATION', 'Duplicate or aliased expectation.');
    expectationKeys.add(key);
    if (item.byteLength === undefined && item.sha256 === undefined) fail('EMPTY_EXPECTATION', 'Supply an expected size or SHA256.');
    const rule = Object.freeze({
      ...(item.byteLength === undefined ? {} : { byteLength: byteLength(item.byteLength) }),
      ...(item.sha256 === undefined ? {} : { sha256: sha256(item.sha256) }),
    });
    const row = requirements.get(key) ?? { relativePath: name, roles: [], expected: null };
    row.expected = rule; requirements.set(key, row);
  }
  const byPath = new Map();
  for (const item of inventory.files) {
    if (!item || typeof item !== 'object') fail('INVALID_INPUT', 'Expected a file metadata entry.');
    if (item.kind !== 'file') fail('UNSUPPORTED_ENTRY_KIND', 'Snapshot must contain only declared ordinary files.');
    const name = relative(item.relativePath); const key = localPathKey(name);
    const row = Object.freeze({ relativePath: name, byteLength: byteLength(item.byteLength),
      ...(item.sha256 === undefined ? {} : { sha256: sha256(item.sha256) }) });
    const group = byPath.get(key) ?? []; group.push(row); byPath.set(key, group);
  }
  const ambiguities = Object.freeze([...byPath].filter(([, items]) => items.length > 1).map(([key, items]) => Object.freeze({
    pathKey: key, paths: Object.freeze(items.map(item => item.relativePath)),
  })));
  const results = [];
  const summary = { present: 0, missing: 0, ambiguous: 0, mismatch: 0, unverified: 0 };
  for (const [key, required] of requirements) {
    const found = byPath.get(key) ?? [];
    let status; let checks = null;
    if (!found.length) status = 'missing';
    else if (found.length > 1) status = 'ambiguous';
    else {
      const actual = found[0]; const rule = required.expected;
      checks = Object.freeze({
        byteLength: rule?.byteLength === undefined ? 'not-requested' : actual.byteLength === rule.byteLength ? 'match' : 'mismatch',
        sha256: rule?.sha256 === undefined ? 'not-requested' : actual.sha256 === undefined ? 'unavailable' : actual.sha256 === rule.sha256 ? 'match' : 'mismatch',
      });
      status = Object.values(checks).includes('mismatch') ? 'mismatch' : checks.sha256 === 'unavailable' ? 'unverified' : 'present';
    }
    summary[status] += 1;
    results.push(Object.freeze({ relativePath: required.relativePath, roles: Object.freeze([...required.roles]),
      expected: required.expected, status, checks,
      actual: found.length === 1 ? found[0] : null }));
  }
  return Object.freeze({ scope: 'explicit-snapshot-and-expectations-only', casePolicy: 'ASCII-fold-and-NFC',
    ordinal: plan.ordinal, code: plan.code, rootPath, fileCount: inventory.files.length,
    snapshotConsistent: ambiguities.length === 0,
    knownRequirementsSatisfied: ambiguities.length === 0 && results.every(item => item.status === 'present'),
    summary: Object.freeze(summary), requirements: Object.freeze(results), ambiguities });
}
