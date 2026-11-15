/** Fixed37c4 filename defaults/parameters. Paths only identify caller-owned local resources. */
import { assetFail,assetBytes,assetFields,assetInteger,assetPath } from './legacy-game-resource-values.mjs';
export const LEGACY_GAME_RESOURCE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-resource-library-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',groups:7});
const CATALOG={"base":"Bin","defaults":{"graphic":["Graphic.bin","GraphicEx.bin","GraphicV2.bin","GraphicV3.bin","PUK2\\Graphic_PUK2.bin","PUK3\\Graphic_PUK3.bin","Graphic_Joy.bin"],"graphicInfo":["GraphicInfo.bin","GraphicInfoEx.bin","GraphicInfoV2.bin","GraphicInfoV3.bin","PUK2\\GraphicInfo_PUK2.bin","PUK3\\GraphicInfo_PUK3.bin","GraphicInfo_Joy.bin"],"animation":["Anime.bin","AnimeEx.bin","AnimeV2.bin","AnimeV3.bin","PUK2\\Anime_PUK2.bin","PUK3\\Anime_PUK3.bin","Anime_Joy.bin"],"animationInfo":["AnimeInfo.bin","AnimeInfoEx.bin","AnimeInfoV2.bin","AnimeInfoV3.bin","PUK2\\AnimeInfo_PUK2.bin","PUK3\\AnimeInfo_PUK3.bin","AnimeInfo_Joy.bin"],"coordinate":["*3","*3","*3","Crd.bin","*3","*3","*3"],"coordinateInfo":["*3","*3","*3","CrdInfo.bin","*3","*3","*3"]},"prefixes":{"graphic":["graphicbin:","graphicbinex:","graphicbinv2:","graphicbinv3:","graphicbin_puk2:","graphicbin_puk3:","graphicbin_joy:"],"graphicInfo":["graphicinfobin:","graphicinfobinex:","graphicinfobinv2:","graphicinfobinv3:","graphicinfobin_puk2:","graphicinfobin_puk3:","graphicinfobin_joy:"],"animation":["animebin:","animebinex:","animebinv2:","animebinv3:","animebin_puk2:","animebin_puk3:","animebin_joy:"],"animationInfo":["animeinfobin:","animeinfobinex:","animeinfobinv2:","animeinfobinv3:","animeinfobin_puk2:","animeinfobin_puk3:","animeinfobin_joy:"],"coordinate":["coordinatebin:","coordinatebinex:","coordinatebinv2:","coordinatebinv3:","coordinatebin_puk2:","coordinatebin_puk3:"],"coordinateInfo":["coordinateinfobin:","coordinateinfobinex:","coordinateinfobinv2:","coordinateinfobinv3:","coordinateinfobin_puk2:","coordinateinfobin_puk3:"]},"templates":{"graphic":["graphic_%d.bin","graphicex_%d.bin","graphicv2_%d.bin","graphicv3_%d.bin","PUK2\\graphic_puk2_%d.bin","PUK3\\graphic_puk3_%d.bin","graphic_joy_%d.bin"],"graphicInfo":["graphicInfo_%d.bin","graphicinfoex_%d.bin","graphicinfov2_%d.bin","graphicinfov3_%d.bin","PUK2\\graphicinfo_puk2_%d.bin","PUK3\\graphicinfo_puk3_%d.bin","graphicinfo_joy_%d.bin"],"animation":["anime_%d.bin","animeex_%d.bin","animev2_%d.bin","animev3_%d.bin","PUK2\\anime_puk2_%d.bin","PUK3\\anime_puk3_%d.bin","anime_joy_%d.bin"],"animationInfo":["animeinfo_%d.bin","animeinfoex_%d.bin","animeinfov2_%d.bin","animeinfov3_%d.bin","PUK2\\animeinfo_puk2_%d.bin","PUK3\\animeinfo_puk3_%d.bin","animeinfo_joy_%d.bin"],"coordinate":["coordinate_%d.bin","coordinateex_%d.bin","coordinatev2_%d.bin","coordinatev3_%d.bin","PUK2\\coordinate_puk2_%d.bin","PUK3\\coordinate_puk3_%d.bin"],"coordinateInfo":["coordinateinfo_%d.bin","coordinateinfoex_%d.bin","coordinateinfov2_%d.bin","coordinateinfov3_%d.bin","PUK2\\coordinateinfo_puk2_%d.bin","PUK3\\coordinateinfo_puk3_%d.bin"]},"graphicV2EarlierAlias":{"prefix":"graphicbiv2x:","overridden_by":"graphicbinv2:"},"default_palette":"pal\\palet_00.cgp","cut_template":"bin\\PUK2\\cutdat\\%d.cut"};
const plans=new WeakMap();
const numberAfter=(text,prefix)=>{const at=text.indexOf(prefix);if(at<0)return null;const found=/^[ \t-\r]*([+-]?[0-9]+)/.exec(text.slice(at+prefix.length));if(!found)assetFail('LEGACY_ASSET_PARAMETER_INTEGER');return assetInteger(Number(found[1]),-2147483648,2147483647);};
const wordAfter=(text,prefix)=>{const at=text.indexOf(prefix);if(at<0)return null;const found=/^[ \t-\r]*([^ \t-\r]+)/.exec(text.slice(at+prefix.length));if(!found||found[1].length>127)assetFail('LEGACY_ASSET_PARAMETER_WORD');return found[1];};

export const legacyGameConfigReadBytes = 256;

/** Merge the regular text-file prefix visible to the fixed legacy WinMain. */
export function mergeLegacyGameResourceParameters(configPrefix, commandTail) {
  const tail = assetBytes(commandTail, 32767);
  if (configPrefix === null) return tail;

  let prefix;
  try {
    prefix = assetBytes(configPrefix, legacyGameConfigReadBytes);
    let length = 0;
    for (let at = 0; at < prefix.length && length < legacyGameConfigReadBytes - 1; at++) {
      const byte = prefix[at] === 13 && prefix[at + 1] === 10 ? 10 : prefix[at];
      if (byte === 0 || byte === 26) break;
      prefix[length++] = byte;
      if (byte === 10) break;
    }
    if (length + tail.length >= 5120) assetFail('LEGACY_ASSET_CONFIG_MERGE_LIMIT');
    const result = new Uint8Array(length + tail.length);
    result.set(prefix.subarray(0, length));
    result.set(tail, length);
    return result;
  } finally {
    prefix?.fill(0);
    tail.fill(0);
  }
}
export function createLegacyGameResourcePlan(commandLineBytes){const raw=assetBytes(commandLineBytes,32767);try{if(raw.some(n=>n===0||n>127))assetFail('LEGACY_ASSET_PARAMETER_ASCII');let text='';for(const n of raw)text+=String.fromCharCode(n);
 const directory=assetPath(wordAfter(text,'binfolder:')??CATALOG.base),names={};
 for(const key of Object.keys(CATALOG.defaults)){names[key]=[...CATALOG.defaults[key]];for(let group=0;group<CATALOG.prefixes[key].length;group++){
   if(names[key][group].includes('*'))continue;
   if(key==='graphic'&&group===2){const n=numberAfter(text,CATALOG.graphicV2EarlierAlias.prefix);if(n!==null)names[key][group]=CATALOG.templates[key][group].replace('%d',String(n));}
   const n=numberAfter(text,CATALOG.prefixes[key][group]);if(n!==null)names[key][group]=CATALOG.templates[key][group].replace('%d',String(n));
 }}
 for(const key of ['coordinate','coordinateInfo'])for(let group=0;group<7;group++){const alias=/^\*([0-6])$/.exec(names[key][group]);if(alias)names[key][group]=names[key][Number(alias[1])];if(names[key][group].includes('*'))assetFail('LEGACY_ASSET_COORDINATE_ALIAS');}
 const groups=Object.freeze(Array.from({length:7},(_,group)=>Object.freeze({group,...Object.fromEntries(Object.keys(names).map(k=>[k,assetPath(directory+'/'+names[k][group])])),graphicRequired:[0,3,6].includes(group),animationRequired:group===0})));
 const result=Object.freeze({profile:LEGACY_GAME_RESOURCE_PROFILE.id,directory,groups,palette:assetPath(directory+'/'+CATALOG.default_palette),currentVersionCompatibility:'unverified'});
 plans.set(result,Object.freeze({sound:!text.includes('soundoff'),music:!text.includes('musicoff')}));return result;
 }finally{raw.fill(0);}}
export function legacyGameResourcePlan(value){if(!plans.has(value))assetFail('LEGACY_ASSET_PLAN');return value;}
export function legacyGameResourceAudio(value){return plans.get(legacyGameResourcePlan(value));}
export function legacyGameCutPath(scene){const r=assetFields(scene,['checksumMode','resolvedSelector']);assetInteger(r.checksumMode,-2147483648,2147483647);if(r.checksumMode!==1){if(r.resolvedSelector!==null)assetFail('LEGACY_ASSET_CUT_SELECTOR');return null;}assetInteger(r.resolvedSelector,-2147483648,2147483647);return assetPath(CATALOG.cut_template.replace('%d',String(r.resolvedSelector)));}
