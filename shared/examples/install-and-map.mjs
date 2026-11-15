// Original synthetic metadata/bytes. No files, registry, account data or network accessed.
import { parseGameCatalog, createOfflineLaunchPlan, verifyInstallInventory, parseMAP01 } from '../index.mjs';
const catalog = parseGameCatalog('<Gamelist><Games><Game Code="11"><Name>Synthetic</Name><EXE>demo.exe</EXE></Game></Games></Gamelist>');
const plan = createOfflineLaunchPlan(catalog,0,{iniText:'[Path]\nGame11=C:\\Synthetic'});
const inventory = verifyInstallInventory(plan,{rootPath:'C:\\Synthetic',files:[{relativePath:'demo.exe',byteLength:100,kind:'file'}]},{expected:[{relativePath:'demo.exe',byteLength:100}]});
const bytes = new Uint8Array(26);bytes.set([0x4d,0x41,0x50,1]);const view = new DataView(bytes.buffer);view.setUint32(12,1,true);view.setUint32(16,1,true);
const map = parseMAP01(bytes);
console.log(JSON.stringify({ inventory: { knownRequirementsSatisfied: inventory.knownRequirementsSatisfied, scope: inventory.scope },
  map: { width:map.width,height:map.height,opaqueBodyBytes:map.opaque.bodyBytes.length },
  runtimeReadiness: 'unverified' },null,2));
