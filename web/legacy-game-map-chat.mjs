import { LEGACY_GAME_TEXT_COLORS, legacyGameTextFontMetrics, measureLegacyGameText } from '../shared/legacy-game-text.mjs';
import { isLegacyGameMapChatBlockedName, legacyGameMapChatBlacklistCapacity,
  legacyGameMapSpeechMilliseconds } from '../shared/legacy-game-map-chat.mjs';

const keyFor = ({address,port}) => 'moli.map-chat.blacklist.v1:'+JSON.stringify([address,port]);

export function readMapChatBlacklist(endpoint) {
  try {
    const value = localStorage.getItem(keyFor(endpoint));
    if (!value || value.length > 4096) return [];
    const stored = JSON.parse(value);
    if (!Array.isArray(stored) || stored.length > legacyGameMapChatBlacklistCapacity) return [];
    const names = [];
    for (const hex of stored) {
      if (typeof hex !== 'string' || !/^(?:[0-9a-f]{2}){1,16}$/.test(hex)) continue;
      const bytes = Uint8Array.from(hex.match(/../g), pair=>Number.parseInt(pair,16));
      if (isLegacyGameMapChatBlockedName(bytes)) names.push(bytes);
    }
    return names;
  } catch { return []; }
}

export function saveMapChatBlacklist(endpoint, names) {
  try {
    if (names.length) {
      const rows = names.map(bytes=>Array.from(bytes, byte=>byte.toString(16).padStart(2,'0')).join(''));
      localStorage.setItem(keyFor(endpoint),JSON.stringify(rows));
    } else localStorage.removeItem(keyFor(endpoint));
    return true;
  } catch { return false; }
  finally { for (const name of names) name.fill(0); }
}

/** Draw the portable frame over the same coordinate space as the scene Canvas. */
export function createMapChatOverlay(svg, live, decode) {
  function element(tag, attributes) {
    const node = svg.ownerDocument.createElementNS(svg.namespaceURI,tag);
    for (const [name,value] of Object.entries(attributes)) node.setAttribute(name,value);
    return node;
  }
  function text(value,x,y,color,style) {
    const node = element('text',{x,y,fill:`rgb(${LEGACY_GAME_TEXT_COLORS[color].join(' ')})`,
      'font-size':legacyGameTextFontMetrics(style).doubleHeight,'dominant-baseline':'hanging'});
    node.textContent = value;
    return node;
  }
  const fit = (position, span, limit) => Math.max(1,Math.min(position,limit-span-1));
  return (frame,width,height,tick) => {
    const rows = [], announcements = [], notices = [];
    for (const row of frame?.speech??[]) {
      if (((tick-row.tick)>>>0)>=legacyGameMapSpeechMilliseconds) continue;
      const group = element('g',{'data-actor-id':row.actorId,class:'game-chat-speech'});
      if (row.kind === 'icon') {
        const x=fit(row.x,34,width),y=fit(row.y,18,height);
        group.append(element('rect',{x,y,width:34,height:18,rx:4}),text('…',x+8,y+2,0,1));
      } else {
        const lineHeight = legacyGameTextFontMetrics(row.style).doubleHeight;
        const boxWidth = Math.min(row.width,Math.max(12,width-2));
        const x=fit(row.x,boxWidth,width),y=fit(row.y,row.height,height);
        group.append(element('rect',{x,y,width:boxWidth,height:row.height,rx:4}));
        row.lines.forEach((line,index)=>{
          const label=text(decode(line),x+5,y+5+index*lineHeight,row.color,row.style);
          label.setAttribute('textLength',Math.min(measureLegacyGameText(line,row.style),boxWidth-10));
          label.setAttribute('lengthAdjust','spacingAndGlyphs');
          group.append(label);
        });
      }
      rows.push(group);
    }
    for (const row of frame?.announcements??[]) {
      const value = decode(row.text);
      const notice = text(value,row.x,row.y,row.color,row.style);
      notice.setAttribute('data-announcement',row.kind);
      notices.push(notice);
      announcements.push(value);
    }
    if (notices.length) {
      const marquee=element('g',{transform:`scale(${width/640} ${height/480})`});
      marquee.append(...notices);
      rows.push(marquee);
    }
    if (rows.length || svg.childElementCount) {
      svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      svg.replaceChildren(...rows);
    }
    const summary = announcements.join(' ');
    if (live.textContent!==summary) live.textContent=summary;
  };
}
