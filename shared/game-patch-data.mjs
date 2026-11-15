/** Shared patch budgets/error identity; no platform dependency. */
export const GAME_PATCH_LIMITS = Object.freeze({ manifestBytes: 256 * 1024, blocks: 512, operations: 512,
  linesPerBlock: 256, fieldBytes: 4096, files: 1024, fileBytes: 32 * 1024 * 1024, totalBytes: 64 * 1024 * 1024, pathBytes: 259 });
export class GamePatchError extends Error {
  constructor(code, message) { super(message); this.name = 'GamePatchError'; this.code = code; }
}
