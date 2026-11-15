/** Fixed-source diagnostic preparation; data-only assessment, never imports or executes a sample. */
import { parseGameCatalog, createOfflineLaunchPlan, verifyInstallInventory } from '../../shared/index.mjs';
export const SOURCE_SHA256 = 'e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983';
const known = Object.freeze({
  'cg_se_3000.exe': '9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126',
  'Patcher_PUK3.exe': '195f3afda41f342147b0616a4c005a4cb308ae6869b52c4a558fded5f5d9aaa8',
  'Config.exe': '9389add9c04cbc6bd313a34098ed94aef11a866ba721c6ccf7f984973efa0f7d',
  'CG5Reg.exe': 'c3baedb2f82a2da785e8d27e5d49560175f09f5a38319edb935995b8e7e228a9',
});
const oldProbe = new Set(['cg_se_3000.exe','d3drm.dll','d3dx9_43.dll','MFC71.dll','msvcr71.dll']);

export function assessMaterial(catalogText, receipt) {
  if (!receipt || !receipt.complete || receipt.source_sha256 !== SOURCE_SHA256 || !Array.isArray(receipt.selected_code_candidates)
    || receipt.selected_code_candidates.length > 32) throw new Error('Expected a completed fixed-source receipt.');
  const catalog = parseGameCatalog(catalogText,{allowBareAmpersands:true});
  const rootPath = 'C:\\MoliOffline\\game-candidate'; // Proposed import label, NOT an observed guest path.
  const files = receipt.selected_code_candidates.filter(item=>item.present).map(item=>({
    relativePath:item.relative_path,byteLength:item.bytes,sha256:item.sha256,kind:'file',
  }));
  const expected=Object.entries(known).map(([relativePath,sha256])=>({relativePath,sha256}));
  const results=[];
  for (const entry of catalog.games.filter(game=>game.code==='11')) {
    const plan=createOfflineLaunchPlan(catalog,entry.ordinal,{iniText:`[Path]\nGame11=${rootPath}\n`});
    const complete=verifyInstallInventory(plan,{rootPath,files},{expected});
    const probe=verifyInstallInventory(plan,{rootPath,files:files.filter(file=>oldProbe.has(file.relativePath))},{expected});
    results.push({sourceOrdinal:entry.ordinal,name:entry.name,plan,fullSourceConfiguredFileCheck:complete,historicalFiveFileSubsetCheck:probe});
  }
  if (results.length!==2) throw new Error('Expected the two observed Code11 records.');
  return Object.freeze({
    scope:'host-extracted-material-only; proposed directory labels, no actual guest inventory',
    sourceSha256:receipt.source_sha256,sourceFiles:receipt.extracted_files,sourceBytes:receipt.extracted_bytes,
    catalogGames:catalog.games.length,literalAmpersands:catalog.diagnostics.literalAmpersands,
    proposedGameDirectory:rootPath,code11:results,
    fullMaterialInstalledInVM:false,runtimeReadiness:'unverified',
    opaqueCandidate:receipt.selected_code_candidates.find(item=>item.relative_path==='ApexClient.Dat')??null,
    limit:'Configured-file metadata matches do not prove complete current installation, runtime dependencies, code trust or official compatibility.',
  });
}
