import test from 'node:test';
import assert from 'node:assert/strict';
import { assessMaterial,SOURCE_SHA256 } from './material-scope.mjs';
const hashes={
 'cg_se_3000.exe':'9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126',
 'Patcher_PUK3.exe':'195f3afda41f342147b0616a4c005a4cb308ae6869b52c4a558fded5f5d9aaa8',
 'Config.exe':'9389add9c04cbc6bd313a34098ed94aef11a866ba721c6ccf7f984973efa0f7d',
 'CG5Reg.exe':'c3baedb2f82a2da785e8d27e5d49560175f09f5a38319edb935995b8e7e228a9',
};
const game=name=>`<Game Code="11"><Name>${name}</Name><EXE>cg_se_3000.exe</EXE><PatchEXE>Patcher_PUK3.exe</PatchEXE><ConfigEXE>Config.exe</ConfigEXE><SpeFile>CG5Reg.exe</SpeFile><Argsline> updated </Argsline></Game>`;
const xml=`<Gamelist><Games>${game('Synthetic classic')}${game('Synthetic test')}</Games></Gamelist>`;
const receipt=()=>({complete:true,source_sha256:SOURCE_SHA256,extracted_files:2367,extracted_bytes:2626083970,selected_code_candidates:Object.entries(hashes).map(([relative_path,sha256])=>({relative_path,sha256,bytes:100,present:true}))});
test('complete source checks preserve both Code11 ordinals and never claim installation',()=>{
 const result=assessMaterial(xml,receipt());assert.equal(result.code11.length,2);
 assert.deepEqual(result.code11.map(row=>row.sourceOrdinal),[0,1]);assert.equal(result.fullMaterialInstalledInVM,false);
 for(const row of result.code11){assert.equal(row.fullSourceConfiguredFileCheck.knownRequirementsSatisfied,true);assert.equal(row.historicalFiveFileSubsetCheck.summary.missing,3);}
});
test('missing and modified code candidates prevent satisfying configured requirements',()=>{
 for(const mode of ['missing','modified']){const data=receipt();if(mode==='missing')data.selected_code_candidates.pop();else data.selected_code_candidates[0].sha256='00'.repeat(32);
 const result=assessMaterial(xml,data);assert.equal(result.code11[0].fullSourceConfiguredFileCheck.knownRequirementsSatisfied,false);}
});
test('incomplete/wrong-source/oversized receipts and changed catalog scope are refused',()=>{
 for(const data of [{...receipt(),complete:false},{...receipt(),source_sha256:'00'.repeat(32)},{...receipt(),selected_code_candidates:Array(33)}])assert.throws(()=>assessMaterial(xml,data));
 assert.throws(()=>assessMaterial(xml.replace(/Code="11"/g,'Code="12"'),receipt()));
});
test('opaque source candidate is retained as an unverified risk, never decoded or executed',()=>{
 const data=receipt();data.selected_code_candidates.push({relative_path:'ApexClient.Dat',present:true,bytes:100,sha256:'ef'.repeat(32),format:'unknown'});
 const result=assessMaterial(xml,data);assert.equal(result.opaqueCandidate.format,'unknown');assert.equal(result.runtimeReadiness,'unverified');
});
