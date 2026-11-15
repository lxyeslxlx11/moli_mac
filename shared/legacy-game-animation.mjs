/** Fixed37c4 animation records and per-native-call player. No frame-clock/IO assumptions. */
import { legacyGamePreparedSpriteDimensions } from './legacy-game-render.mjs';
import {markLegacyGameWaterGraphic} from './legacy-game-water.mjs';
export const LEGACY_GAME_ANIMATION_PROFILE = Object.freeze({
  id: 'legacy-se6000-37c4-animation-v1',
  sourceSha256: '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
  groups: 7, uniqueResources: 10000, inputBytes: 32 * 1024 * 1024,
  ownedBytes: 128 * 1024 * 1024, decodedFrames: 1024 * 1024,
});
export class LegacyGameAnimationError extends Error {
  constructor(code) { super('Animation data or state is outside the supported legacy profile.'); this.name = 'LegacyGameAnimationError'; this.code = code; }
}
const fail = code => { throw new LegacyGameAnimationError(code); };
const catalogs = new WeakMap(), typed = Object.getPrototypeOf(Uint8Array.prototype);
const bufferOf = Object.getOwnPropertyDescriptor(typed, 'buffer').get, lengthOf = Object.getOwnPropertyDescriptor(typed, 'length').get;
const offsetOf = Object.getOwnPropertyDescriptor(typed, 'byteOffset').get, bufferLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get;
function integer(n, low = -2147483648, high = 2147483647) { if (!Number.isInteger(n) || n < low || n > high) fail('LEGACY_ANIMATION_INTEGER'); return n; }
function fields(value, required, optional = []) {
  let d; try { d = Object.getOwnPropertyDescriptors(value); } catch { fail('LEGACY_ANIMATION_FIELDS'); }
  const keys = Reflect.ownKeys(d);
  if (required.some(k => !Object.hasOwn(d, k)) || keys.some(k => !required.includes(k) && !optional.includes(k)) || keys.some(k => !Object.hasOwn(d[k], 'value'))) fail('LEGACY_ANIMATION_FIELDS');
  return Object.fromEntries(keys.map(k => [k, d[k].value]));
}
function bytes(value, maximum) {
  try {
    let buffer, length, offset = 0;
    if (value instanceof ArrayBuffer) { buffer = value; length = Reflect.apply(bufferLength, value, []); }
    else { if (!(value instanceof Uint8Array)) fail('LEGACY_ANIMATION_INPUT'); buffer = Reflect.apply(bufferOf, value, []);
      Reflect.apply(bufferLength, buffer, []); length = Reflect.apply(lengthOf, value, []); offset = Reflect.apply(offsetOf, value, []); }
    if (length > maximum) fail('LEGACY_ANIMATION_INPUT_BUDGET'); return new Uint8Array(new Uint8Array(buffer, offset, length));
  } catch (e) { if (e instanceof LegacyGameAnimationError) throw e; fail('LEGACY_ANIMATION_INPUT'); }
}
function list(value, maximum) {
  if (!Array.isArray(value)) fail('LEGACY_ANIMATION_GROUPS');
  let d; try { d = Object.getOwnPropertyDescriptors(value); } catch { fail('LEGACY_ANIMATION_GROUPS'); }
  const n = integer(d.length?.value, 1, maximum);
  if (Reflect.ownKeys(d).length !== n + 1 || Array.from({length:n}, (_,i) => !Object.hasOwn(d[i] ?? {}, 'value')).some(Boolean)) fail('LEGACY_ANIMATION_GROUPS');
  return Array.from({length:n}, (_,i) => d[i].value);
}
function state(catalog) { const s = catalogs.get(catalog); if (!s) fail('LEGACY_ANIMATION_CATALOG'); if (s.closed) fail('LEGACY_ANIMATION_CLOSED'); return s; }
function load(catalog, resource) {
  const s = state(catalog), record = s.records.get(resource);
  if (!record) return null;
  if (s.loaded.has(resource)) return s.loaded.get(resource);
  const group = s.groups[record.group], data = new DataView(group.animation.buffer), actions = [];
  let cursor = record.offset, framesAdded = 0;
  const requireBytes = n => { if (cursor > data.byteLength || n > data.byteLength - cursor) fail('LEGACY_ANIMATION_TRUNCATED'); };
  for (let ordinal = 0; ordinal < record.actionCount; ordinal++) {
    const head = record.version === 1 ? 20 : 12; requireBytes(head);
    const direction = data.getUint16(cursor, true), action = data.getUint16(cursor + 2, true);
    const duration = data.getUint32(cursor + 4, true), count = data.getUint32(cursor + 8, true);
    if (count > 9999) fail('LEGACY_ANIMATION_FRAME_BUDGET');
    framesAdded += count; if (framesAdded > LEGACY_GAME_ANIMATION_PROFILE.decodedFrames - s.decodedFrames) fail('LEGACY_ANIMATION_DECODED_BUDGET');
    const paletteSelector = head === 20 ? data.getUint16(cursor + 12, true) : 0;
    const flags = head === 20 ? data.getUint16(cursor + 14, true) : 0;
    const color = head === 20 ? data.getUint32(cursor + 16, true) : 0xffffffff;
    cursor += head; requireBytes(count * 10);
    const frames = [];
    for (let i = 0; i < count; i++, cursor += 10) {
      const graphicIndex = data.getUint32(cursor, true) + group.graphicBase;
      if (graphicIndex >= 850000) fail('LEGACY_ANIMATION_GRAPHIC_BOUNDS');
      frames.push(Object.freeze({ graphicIndex, x: data.getInt16(cursor + 4, true), y: data.getInt16(cursor + 6, true), event: data.getUint16(cursor + 8, true) }));
    }
    const delayTicks = count ? Math.max(1, Math.floor(duration / (count * 16))) : duration;
    actions.push(Object.freeze({ direction, action, duration, delayTicks, frameCount: count, paletteSelector, flags, color, frames: Object.freeze(frames) }));
  }
  const attachments = [];
  if (record.attachmentCount && group.attachmentData) {
    const a = new DataView(group.attachmentData.buffer), n = record.attachmentCount, at = record.attachmentOffset;
    if (n > 1000) fail('LEGACY_ANIMATION_ATTACHMENT_BUDGET');
    if (at > a.byteLength || n * 8 > a.byteLength - at) fail('LEGACY_ANIMATION_ATTACHMENT_RANGE');
    for (let i = 0; i < n; i++) {
      const p = at + i * 8, graphicIndex = a.getUint32(p, true) + group.graphicBase;
      if (graphicIndex >= 850000) fail('LEGACY_ANIMATION_GRAPHIC_BOUNDS');
      attachments.push(Object.freeze({graphicIndex, x:a.getInt16(p + 4, true), y:a.getInt16(p + 6, true)}));
    }
  }
  const result = Object.freeze({ resourceId: resource, group: record.group, version: record.version, actionCount: actions.length,
    byteOffset: record.offset, consumedBytes: cursor - record.offset, actions: Object.freeze(actions), attachments: Object.freeze(attachments) });
  s.decodedFrames += framesAdded; s.loaded.set(resource, result); return result;
}

/** Caller supplies source group order and graphicBase, never inferred from filenames. */
export function createLegacyGameAnimationCatalog(groups) {
  const source = list(groups, 7), s = {closed:false, groups:[], records:new Map(), loaded:new Map(), ownedBytes:0, decodedFrames:0};
  const attachmentIndices = [];
  try {
    for (let group = 0; group < source.length; group++) {
      const g = fields(source[group], ['index','animation','graphicBase'], ['attachmentIndex','attachmentData']);
      integer(g.graphicBase, 0, 849999);
      if (Object.hasOwn(g,'attachmentIndex') !== Object.hasOwn(g,'attachmentData')) fail('LEGACY_ANIMATION_ATTACHMENT_PAIR');
      const index = bytes(g.index, 20500 * 12); let animation, attachmentData, ap;
      try {
        if (index.length % 12) fail('LEGACY_ANIMATION_INDEX_LENGTH');
        animation = bytes(g.animation, LEGACY_GAME_ANIMATION_PROFILE.inputBytes);
        if (g.attachmentIndex !== undefined) { ap = bytes(g.attachmentIndex, 1 + 20500 * 10); attachmentData = bytes(g.attachmentData, 8 * 1024 * 1024); }
        s.ownedBytes += animation.length + (attachmentData?.length ?? 0);
        if (s.ownedBytes > LEGACY_GAME_ANIMATION_PROFILE.ownedBytes) fail('LEGACY_ANIMATION_OWNED_BUDGET');
        s.groups.push({animation,attachmentData,graphicBase:g.graphicBase}); animation = attachmentData = null;
        const v = new DataView(index.buffer);
        for (let at = 0; at < index.length; at += 12) {
          const resource = v.getUint32(at, true), count = v.getUint16(at + 8, true), version = v.getUint16(at + 10, true);
          if (resource < 100000 || resource >= 120500) fail('LEGACY_ANIMATION_RESOURCE_BOUNDS');
          if (count > 10000) fail('LEGACY_ANIMATION_ACTION_BUDGET');
          s.records.set(resource, {group,offset:v.getUint32(at + 4, true),actionCount:count,version:version > 1 ? 0 : version,attachmentCount:0,attachmentOffset:0});
          if (s.records.size > 10000) fail('LEGACY_ANIMATION_RESOURCE_BUDGET');
        }
        attachmentIndices.push(ap); ap = null;
      } finally { index.fill(0); animation?.fill(0); attachmentData?.fill(0); ap?.fill(0); }
    }
    // Native AP indices update global records; data is read from the record's group.
    for (const ap of attachmentIndices) if (ap) {
      if (!ap.length || ap[0] !== 1 || (ap.length - 1) % 10) fail('LEGACY_ANIMATION_ATTACHMENT_INDEX');
      const v = new DataView(ap.buffer);
      for (let at = 1; at < ap.length; at += 10) {
        const record = s.records.get(v.getUint32(at, true)), count = v.getUint16(at + 8, true);
        if (record) { record.attachmentOffset = v.getUint32(at + 4, true); record.attachmentCount = count; }
      }
    }
    const catalog = Object.freeze({
      animation(resource) { integer(resource); return load(catalog, resource); },
      inspect() { const q = state(catalog); return Object.freeze({profile:LEGACY_GAME_ANIMATION_PROFILE.id, groups:q.groups.length,
        resources:q.records.size, loaded:q.loaded.size, ownedBytes:q.ownedBytes, decodedFrames:q.decodedFrames, currentVersionCompatibility:'unverified'}); },
      close() { if (s.closed) return; s.closed = true; for (const g of s.groups) { g.animation.fill(0); g.attachmentData?.fill(0); } s.groups=[];s.records.clear();s.loaded.clear();s.ownedBytes=s.decodedFrames=0; },
    });
    catalogs.set(catalog, s); return catalog;
  } catch (e) { for (const g of s.groups) { g.animation.fill(0);g.attachmentData?.fill(0); } throw e; }
  finally { for (const ap of attachmentIndices) ap?.fill(0); }
}

const INITIAL = Object.freeze({lastResource:0,lastAction:0,lastFacing:0,nextFrame:0,delay:0,cycles:0,signal:0,mode:0,
  graphicIndex:-1,drawOffsetX:0,drawOffsetY:0,attachmentX:0,attachmentY:0,paletteSelector:0,drawFlags:0,color:0xffffffff,geometry:null});
const playerCopies=new WeakMap();
function context(value) {
  const c = fields(value, ['resourceId','action','facing','speedPercent','mode','frozen','staticFlip','soundScene','actorFlags']);
  for (const key of ['resourceId','action','facing','speedPercent','mode','frozen','soundScene']) c[key]=integer(c[key])|0;
  c.actorFlags=integer(c.actorFlags,0,0xffffffff)>>>0; if (typeof c.staticFlip !== 'boolean') fail('LEGACY_ANIMATION_BOOLEAN'); return c;
}
function geometry(resolve, kind, value) {
  const g = fields(resolve(Object.freeze({kind,value})), ['index','originX','originY','width','height']);
  integer(g.index,0,849999); if (kind === 'index' && g.index !== value) fail('LEGACY_ANIMATION_GEOMETRY_INDEX');
  g.originX=integer(g.originX,-32768,32767)|0;g.originY=integer(g.originY,-32768,32767)|0;integer(g.width,1,32767);integer(g.height,1,32767);
  return Object.freeze(g);
}
/** One call corresponds to one source helper invocation, not a guessed wall-clock interval. */
export function createLegacyGameAnimationPlayer(catalog) {
  state(catalog); let q = {...INITIAL}, closed = false;
  const active = () => { if (closed) fail('LEGACY_ANIMATION_CLOSED'); state(catalog); };
  const snapshot = () => Object.freeze({...q});
  const finish = (n, code, reason, changed = false, event = null) => { active();q=n;return Object.freeze({code,reason,frameChanged:changed,event,state:snapshot()}); };
  const player=Object.freeze({
    // 41f740/41f7a0 copy the source actor's animation cells without replaying a frame.
    clone(){active();const next=createLegacyGameAnimationPlayer(catalog);playerCopies.get(next)(q);return next;},
    invalidate() { active();q={...q,lastAction:-1}; },
    resetFrames() { active();q={...q,nextFrame:0,delay:0}; },
    clearSignal() { active();q={...q,signal:0}; },
    setSignal(value) { active();integer(value,-2147483648,2147483647);q={...q,signal:value}; },
    setColorAlpha(value) { active();integer(value,0,255);q={...q,color:((q.color&0xffffff)|(value<<24))>>>0}; },
    copyState() { active();return snapshot(); },
    step(sourceContext, resolveGraphic) {
      active();const c=context(sourceContext);if(typeof resolveGraphic !== 'function')fail('LEGACY_ANIMATION_GEOMETRY');active();
      const n={...q};if(c.frozen===1)return finish(n,0,'frozen');n.mode=c.mode;
      if(n.lastAction!==c.action||n.lastFacing!==c.facing||n.lastResource!==c.resourceId) {
        n.lastAction=c.action;n.lastFacing=c.facing;n.lastResource=c.resourceId;n.delay=0;n.nextFrame=0;n.cycles=0;
      }
      if(n.delay!==0){n.delay=(n.delay-1)>>>0;return finish(n,0,'countdown');}
      if(c.resourceId<1000){n.graphicIndex=0;n.geometry=null;return finish(n,0,'hidden');}
      if(c.resourceId>99999&&c.resourceId<200000) {
        if(c.resourceId>120500)return finish(n,1,'resource-missing');
        const animation=load(catalog,c.resourceId);
        if(!animation)return finish(n,1,'resource-missing');
        if(!animation.actionCount)return finish(n,-1,'load-empty');
        const action=animation.actions.find(a=>a.direction===c.facing&&a.action===c.action);
        if(!action)return finish(n,1,'action-missing');
        n.delay=Math.floor((Math.imul(action.delayTicks,c.speedPercent)>>>0)/100)||1;
        if(n.nextFrame>=action.frameCount){
          if(c.mode===1){n.delay=255;n.cycles=1;return finish(n,1,'complete');}
          if(!action.frameCount)fail('LEGACY_ANIMATION_EMPTY_LOOP');n.nextFrame=0;n.cycles=(n.cycles+1)|0;
        }
        const frame=action.frames[n.nextFrame],g=geometry(resolveGraphic,'index',frame.graphicIndex);
        n.graphicIndex=frame.graphicIndex;n.geometry=g;n.drawOffsetX=frame.x+g.originX;n.drawOffsetY=frame.y+g.originY;
        n.drawFlags=action.flags&255;n.paletteSelector=action.paletteSelector;n.color=action.color;
        if(n.drawFlags&1)n.drawOffsetX=-(g.width+n.drawOffsetX)|0;if(n.drawFlags&2)n.drawOffsetY=-(g.height+n.drawOffsetY)|0;
        const ap=animation.attachments.find(a=>a.graphicIndex===frame.graphicIndex);
        n.attachmentX=frame.x+(ap?.x??0);n.attachmentY=frame.y+(ap?.y??0);
        if(n.drawFlags&1)n.attachmentX=-n.attachmentX|0;if(n.drawFlags&2)n.attachmentY=-n.attachmentY|0;
        let event=null;
        if(frame.event>=10000){n.signal=frame.event;event=Object.freeze({kind:'signal',value:frame.event});}
        else if(frame.event&&!(c.soundScene===9&&(c.actorFlags&0x80200)))event=Object.freeze({kind:'sound',value:frame.event});
        n.nextFrame++;n.delay--;return finish(n,0,'frame',true,event);
      }
      const g=geometry(resolveGraphic,'resource',c.resourceId);n.graphicIndex=g.index;n.geometry=g;
      n.drawOffsetX=g.originX;n.drawOffsetY=g.originY;n.delay=2147483647;n.paletteSelector=0;n.drawFlags=0;n.color=0xffffffff;
      if(c.staticFlip&&c.facing>=2&&c.facing<5){n.drawFlags=1;n.drawOffsetX=-(g.width+n.drawOffsetX)|0;}
      n.attachmentX=n.attachmentY=0;return finish(n,0,'static',true);
    },
    drawPlan(x,y) {
      active();integer(x);integer(y);if(!q.geometry||q.graphicIndex<1000)return null;
      if((q.drawFlags&~15)!==0)fail('LEGACY_ANIMATION_DRAW_STYLE');
      return Object.freeze({image:Object.freeze({index:q.graphicIndex,paletteSelector:q.paletteSelector,flags:q.drawFlags,color:q.color}),
        x:(x+q.drawOffsetX)|0,y:(y+q.drawOffsetY)|0,priority:10,flip:q.drawFlags&3,expectedDimensions:Object.freeze([q.geometry.width,q.geometry.height])});
    },
    drawCommand(sprite,x,y) {
      active();integer(x);integer(y);if(!q.geometry||q.graphicIndex<1000)return null;
      if(q.paletteSelector!==0||(q.drawFlags&~15)!==0)fail('LEGACY_ANIMATION_DRAW_STYLE');
      const dims=legacyGamePreparedSpriteDimensions(sprite);
      if(dims.width!==q.geometry.width||dims.height!==q.geometry.height)fail('LEGACY_ANIMATION_SPRITE_DIMENSIONS');
      return markLegacyGameWaterGraphic(Object.freeze({sprite,x:(x+q.drawOffsetX)|0,y:(y+q.drawOffsetY)|0,priority:10,flip:q.drawFlags&3,...(q.color!==0xffffffff?{color:q.color}:{}),...(q.drawFlags&8?{blend:'additive'}:{})}),q.graphicIndex);
    },
    close() { if(closed)return;closed=true;q={...INITIAL}; },
  });
  playerCopies.set(player,value=>{q={...value};});return player;
}
