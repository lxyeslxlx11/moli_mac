/** Ordinary chat for the fixed 37c4 sample. */
import { splitLegacyGameStateFields as split, unescapeLegacyGameInnerField as unescape } from './legacy-game-state.mjs';
import { encodeLegacyGameInnerReplyText } from './legacy-game-map-dialog.mjs';
import { legacyGameTextFontMetrics, measureLegacyGameText } from './legacy-game-text.mjs';
import { legacyGameActorPresentationHeight } from './legacy-game-actor-presentation.mjs';

export const legacyGameMapChatInputBytes = 76;
export const legacyGameMapChatBlockedNameBytes = 16;
export const legacyGameMapChatBlacklistCapacity = 100;
export const legacyGameMapSpeechMilliseconds = 1000;
const historyCapacity = 512, textCapacity = 291, playerFieldCapacity = 2023;
const partyBit = 8, ordinaryInterval = 1000, muteInterval = 180000;
const announcement = [91,0xb9,0xab,0xb8,0xe6,93];
const playerAnnouncement = [91,0xcd,0xe6,0xbc,0xd2,0xb9,0xab,0xb8,0xe6,93];
const operatorMarkers = [[91,71,77],[91,103,109]];
const microphone = [91,77,73,67,93], group = [91,71,80,93];
const scrollStart = 640, scrollStyle = 3;
const consumers = new Set(['0x4f22e0','0x4f2df0','0x4f30d0']);
export const isLegacyGameMapChatConsumer = consumer => consumers.has(consumer);

function fail(code) {
  const error = new Error('The requested chat action is unavailable.');
  error.code = code;
  throw error;
}

function command(operationId, args) {
  return Object.freeze({ operationId, arguments:Object.freeze(args) });
}

function startsAt(bytes, marker, offset = 0) {
  return marker.every((byte,index) => bytes[offset+index] === byte);
}

function contains(bytes, marker) {
  for (let at = 0; at <= bytes.length-marker.length; at++) {
    if (startsAt(bytes,marker,at)) return true;
  }
  return false;
}

function wholeCharacters(bytes, maximum) {
  const end = Math.min(bytes.length, maximum);
  let offset = 0;
  while (offset < end) {
    const next = offset + (bytes[offset] & 128 ? 2 : 1);
    if (next > end) break;
    offset = next;
  }
  return bytes.subarray(0,offset);
}

function isDisplayStyle(color, style) {
  return color >= 0 && color < 12 && style >= 0 && style < 14;
}

export function isLegacyGameMapChatBlockedName(bytes) {
  return bytes instanceof Uint8Array && bytes.length > 0 && bytes.length <= legacyGameMapChatBlockedNameBytes &&
    !bytes.some(byte=>byte<32||byte===127) && wholeCharacters(bytes,bytes.length).length===bytes.length;
}

export function createLegacyGameMapSpeech(body, color, style, tick) {
  const first = wholeCharacters(body,40);
  if (!first.length) return null;
  const second = wholeCharacters(body.subarray(first.length),255);
  const lines = (second.length ? [first,second] : [first]).map(line=>line.slice());
  const width = Math.max(...lines.map(line=>measureLegacyGameText(line,style)));
  return { lines,width,color,style,tick };
}

export function copyLegacyGameMapSpeechFrame(speech, tick, resource, screen, bodyFlags) {
  if (speech.tick === null) speech.tick = tick;
  if (!(bodyFlags & 0x180)) return Object.freeze({kind:'icon',x:screen[0]-20,y:screen[1]-84,tick:speech.tick});
  const {doubleHeight} = legacyGameTextFontMetrics(speech.style);
  const y = screen[1]+legacyGameActorPresentationHeight(resource)-33-(speech.lines.length-1)*doubleHeight;
  return Object.freeze({kind:'text',x:screen[0]-Math.trunc(speech.width/2)-5,y,width:speech.width+10,
    height:speech.lines.length*doubleHeight+10,color:speech.color,style:speech.style,tick:speech.tick,
    lines:Object.freeze(speech.lines.map(line=>line.slice()))});
}

export function createLegacyGameMapChat(onSpeech) {
  const history = Array(historyCapacity);
  const blocked = [];
  const lanes = [
    {kind:'operator',y:60,color:4,passes:4,x:scrollStart,tick:0,text:null},
    {kind:'player',y:76,color:5,passes:3,x:scrollStart,tick:0,text:null},
  ];
  let version = 0, flags = null, lastAttempt = null, muted = false, blockedVersion = 0, announcementVersion = 0;
  const partySelected = () => !!(flags & partyBit);
  const findBlocked = name => blocked.findIndex(entry=>entry.length===name.length&&startsAt(entry,name));

  function append(kind, actorId, color, style, text) {
    if (!text.length || text.length > textCapacity || !isDisplayStyle(color,style)) {
      text.fill(0);
      return false;
    }
    const at = version % historyCapacity;
    history[at]?.text.fill(0);
    history[at] = { kind,actorId,color,style,text };
    version++;
    return true;
  }

  function receivePlayer(args) {
    const [actorId,raw,wireColor,wireStyle] = args, [prefix,body] = split(raw);
    if (prefix[0] !== 80 || !body?.length || body.length > playerFieldCapacity) return false;
    const text = unescape(body), color = wireColor < 0 ? 0 : wireColor, style = wireColor < 0 ? 1 : wireStyle;
    const colon = text.findIndex((byte,index)=>byte===58&&text[index+1]===32);
    const mic = startsAt(text,microphone), offset = mic ? microphone.length : startsAt(text,group) ? group.length : 0;
    let speech = false;
    if (colon > offset) {
      const name = text.subarray(offset,colon);
      if (findBlocked(name) !== -1) {
        text.fill(0);
        return false;
      }
      if (actorId >= 0 && isDisplayStyle(color,style) && colon+2 < text.length) {
        speech = onSpeech(actorId,name,text.subarray(colon+2),mic,color,style);
      }
    }
    return append('player',actorId,color,style,text) || speech;
  }

  function receiveSystem(raw) {
    if (raw.length > playerFieldCapacity) return false;
    const text = unescape(raw);
    const player = startsAt(text,playerAnnouncement);
    const operator = operatorMarkers.some(marker=>contains(text,marker));
    if (player || operator) {
      const lane = lanes[player ? 1 : 0];
      const display = wholeCharacters(text,287).slice();
      for (let index = 0; index < display.length-1; index++) {
        if (display[index] === 92) display.fill(32,index,index+2);
      }
      const first = wholeCharacters(display,255);
      const width = measureLegacyGameText(first,scrollStyle)+measureLegacyGameText(display.subarray(first.length),scrollStyle);
      lane.text?.fill(0);
      Object.assign(lane,{text:display,width,pass:0,version:++announcementVersion});
    }
    if (contains(text,announcement) || player || raw.length > textCapacity*2) {
      text.fill(0);
      return player || operator;
    }
    return append('system',null,4,3,text) || operator;
  }

  function checkRate(tick, party) {
    const elapsed = lastAttempt === null ? Infinity : (tick-lastAttempt) >>> 0;
    if (muted || party) {
      if (elapsed > muteInterval) muted = false;
      else if (!party) fail('LEGACY_GAME_CHAT_MUTED');
      return;
    }
    lastAttempt = tick;
    if (elapsed < ordinaryInterval) {
      muted = true;
      fail('LEGACY_GAME_CHAT_RATE');
    }
  }

  return Object.freeze({
    receive(consumer, args, missingArguments) {
      let updated = false;
      if (!missingArguments) {
        if (consumer === '0x4f22e0') {
          const next = args[0] & 0xfffd;
          updated = flags !== next;
          flags = next;
        } else if (consumer === '0x4f2df0') updated = receivePlayer(args);
        else if (consumer === '0x4f30d0') updated = receiveSystem(args[0]);
      }
      return Object.freeze({ kind:'map-chat',updated });
    },
    setBlocked(name, enabled) {
      if (!isLegacyGameMapChatBlockedName(name) || typeof enabled !== 'boolean') fail('LEGACY_GAME_CHAT_BLOCKED_NAME');
      const index = findBlocked(name);
      if (enabled && index === -1) {
        if (blocked.length === legacyGameMapChatBlacklistCapacity) fail('LEGACY_GAME_CHAT_BLACKLIST_FULL');
        blocked.push(Uint8Array.from(name));
      } else if (!enabled && index !== -1) {
        blocked.splice(index,1)[0].fill(0);
      } else return false;
      blockedVersion++;
      return true;
    },
    copyBlocked() {
      return Object.freeze(blocked.map(name=>name.slice()));
    },
    advanceAnnouncements(tick) {
      const rows = [];
      for (const lane of lanes) {
        if (!lane.text) continue;
        if (((tick-lane.tick)>>>0)>10) {
          lane.tick = tick;
          lane.x--;
          if (lane.x < -2-lane.width) {
            lane.x = scrollStart;
            if (++lane.pass === lane.passes) {
              lane.text.fill(0);
              lane.text = null;
              continue;
            }
          }
        }
        const {kind,x,y,color,version,pass,text} = lane;
        rows.push(Object.freeze({kind,x,y,color,version,pass,style:scrollStyle,text:text.slice()}));
      }
      return Object.freeze(rows);
    },
    prepare(text, {color=0,range=1,size=0} = {}, tile, tick, inParty) {
      if (!(text instanceof Uint8Array) || !text.length || text.length > legacyGameMapChatInputBytes ||
          text.some(byte=>byte<32||byte===127)) fail('LEGACY_GAME_CHAT_TEXT');
      if (!Number.isInteger(color) || color < 0 || color > 9 || !Number.isInteger(range) || range < 1 || range > 5 ||
          !Number.isInteger(size) || size < 0 || size > 2) fail('LEGACY_GAME_CHAT_OPTIONS');
      if (!Number.isInteger(tick) || tick < 0 || tick > 0xffffffff) fail('LEGACY_GAME_LOCAL_TICK');
      const encoded = encodeLegacyGameInnerReplyText(text);
      try {
        checkRate(tick,inParty && partySelected());
        const body = new Uint8Array(encoded.length+2);
        body.set([80,124]);body.set(encoded,2);
        return command('send-004f7680',[...tile,body,color===4?5:color,range,size]);
      } finally { encoded.fill(0); }
    },
    setParty(enabled,inParty) {
      if (typeof enabled !== 'boolean' || flags === null || (enabled && !inParty)) fail('LEGACY_GAME_CHAT_MODE');
      if (enabled === partySelected()) return null;
      flags = enabled ? flags | partyBit : flags & ~partyBit;
      return command('send-004f7780',[flags]);
    },
    inspect() {
      return Object.freeze({ version,count:Math.min(version,historyCapacity),flagsKnown:flags!==null,partySelected:partySelected(),
        ...(blockedVersion?{blockedVersion,blockedCount:blocked.length}:{} ) });
    },
    copy() {
      const count = Math.min(version,historyCapacity);
      return Object.freeze(Array.from({length:count},(_,i)=>{
        const row = history[(version-count+i)%historyCapacity];
        return Object.freeze({...row,text:row.text.slice()});
      }));
    },
    close() {
      for (const row of history) row?.text.fill(0);
      history.fill(undefined);version=0;flags=null;lastAttempt=null;muted=false;
      for (const name of blocked) name.fill(0);
      blocked.length=0;blockedVersion=0;announcementVersion=0;
      for (const lane of lanes) {
        lane.text?.fill(0);lane.text=null;lane.x=scrollStart;lane.tick=0;
      }
    },
  });
}
