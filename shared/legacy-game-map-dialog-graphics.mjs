/** Map dialog graphics use source resource IDs and dialog-local sprite anchors. */
import { createLegacyGameAnimationPlayer } from './legacy-game-animation.mjs';
import { createLegacyGameDrawPlan } from './legacy-game-draw-plan.mjs';

const marker = 64;
const signedShort = value => (value << 16) >> 16;

function integer(text) {
  if (!/^[+-]?\d{1,10}$/.test(text)) return null;
  const value = Number(text);
  return value >= -2147483648 && value <= 2147483647 ? value : null;
}

function numberEnd(text, start) {
  const at = text.slice(start).search(/[,(]/);
  return at < 0 ? text.length : start + at;
}

function graphicDirective(bytes, width, height) {
  if (bytes.length > 127 || bytes.some(value => value >= 128)) return null;
  const text = String.fromCharCode(...bytes);
  const end = numberEnd(text, 0);
  const resourceId = integer(text.slice(0, end));
  if (resourceId === null) return null;
  let facing = 0, at = end + 1;
  if (text[end] === ',') {
    // The native scanner advances one more byte after the ID delimiter.
    const start = at + 1, directionEnd = numberEnd(text, start);
    const direction = text.slice(start, directionEnd);
    facing = direction.length ? integer(direction) : 0;
    if (facing === null) return null;
    facing = (facing << 24) >> 24;
    at = directionEnd + 1;
  }
  let x = width / 2, y = height / 2;
  const open = text.indexOf('(', at), close = text.indexOf(')', open + 1);
  if (open >= 0 && close >= 0) {
    const pair = text.slice(open + 1, close).split(',');
    if (pair.length !== 2) return null;
    [x, y] = pair.map(integer);
    if (x === null || y === null) return null;
  }
  return Object.freeze({ resourceId, facing, x: signedShort(x), y: signedShort(y) });
}

export function readLegacyGameMapDialogGraphics(bytes, width, height) {
  const graphics = [];
  let out = 0, directives = 0;
  for (let at = 0; at < bytes.length;) {
    const value = bytes[at];
    if (value >= 128) {
      bytes[out++] = bytes[at++];
      if (at < bytes.length) bytes[out++] = bytes[at++];
    } else if (value === marker && bytes[at + 1] === marker) {
      bytes[out++] = marker;
      bytes[out++] = marker;
      at += 3;
    } else if (value === marker && bytes[at + 1] === 103 && bytes[at + 2] === 44) {
      let end = at + 3;
      while (end < bytes.length && bytes[end] !== marker) end += bytes[end] >= 128 ? 2 : 1;
      if (end >= bytes.length) {
        bytes[out++] = bytes[at++];
        continue;
      }
      if (directives++ < 10) {
        const graphic = graphicDirective(bytes.subarray(at + 3, end), width, height);
        if (graphic) graphics.push(graphic);
      }
      at = end + 1;
    } else {
      bytes[out++] = bytes[at++];
    }
  }
  return {
    text: bytes.subarray(0, out),
    illustration: graphics.length ? Object.freeze({ width, height, graphics: Object.freeze(graphics) }) : null,
  };
}

export function createLegacyGameMapDialogGraphics(illustration, library) {
  const { animations } = library.catalogs();
  const entries = illustration.graphics.filter(({ resourceId }) => resourceId >= 1000 && resourceId <= 120500)
    .map(graphic => ({ graphic, player: createLegacyGameAnimationPlayer(animations) }));
  const geometry = query => {
    const result = library.geometry(query);
    if (result.index < 1000 || result.width === 0 || result.height === 0) throw new Error('Missing dialog graphic.');
    return result;
  };
  return Object.freeze({
    advance() {
      const commands = [];
      let changed = false;
      for (const entry of entries) {
        if (!entry.player) continue;
        const { resourceId, facing, x, y } = entry.graphic;
        try {
          const frame = entry.player.step({ resourceId, facing, action: 0, speedPercent: 100, mode: 0,
            frozen: 0, staticFlip: true, soundScene: 0, actorFlags: 0 }, geometry);
          if (frame.code !== 0) throw new Error('Missing dialog animation.');
          changed ||= frame.frameChanged;
          const draw = entry.player.drawPlan(x, y);
          if (draw) commands.push(draw);
        } catch {
          entry.player.close();
          entry.player = null;
          changed = true;
        }
      }
      return changed ? createLegacyGameDrawPlan(illustration.width, illustration.height, commands) : null;
    },
    close() {
      for (const entry of entries) entry.player?.close();
      entries.length = 0;
    },
  });
}
