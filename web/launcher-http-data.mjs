/** Platform-independent HTTP budgets and error identity shared by the browser and WeChat ports. */
export const LAUNCHER_HTTP_LIMITS = Object.freeze({ metadataBytes: 4096, catalogBytes: 1024 * 1024,
  packageBytes: 32 * 1024 * 1024, origins: 16, urlChars: 4096, readCalls: 65536, defaultTimeoutMs: 10000, maximumTimeoutMs: 60000 });
export class LauncherHttpError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherHttpError'; this.code = code; }
}
