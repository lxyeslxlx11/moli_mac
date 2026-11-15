/** Configuration-bound game patch preparation. Explicit allowed HTTP origin, owned input snapshots, no installed-file writes or execution. */
import { selectLauncherRegion, encodeLauncherProcessField, createLauncherPatchPlan,
  PUK3_PATCH_SOURCE_PROFILE, createPuk3PatchSourcePlan, applyGamePatchCandidates, createGamePatchCandidateRun } from './index.mjs';
import { localDirectoryPath } from './local-paths.mjs';
import { snapshotLauncherCatalogCandidate, ownLauncherInputBytes } from './launcher-catalog-data.mjs';
import { createWin32LauncherPatchPlan } from './launcher-patch-current.mjs';

export class LauncherGamePatchError extends Error {
  constructor(code, message) { super(message); this.name = 'LauncherGamePatchError'; this.code = code; }
}
const fail = (code, message) => { throw new LauncherGamePatchError(code, message); };
export function ownLauncherPatchInput(value, name, fallback, optional = false) {
  let descriptor; try { descriptor = Object.getOwnPropertyDescriptor(value, name); } catch { fail('GAME_PATCH_INPUT', 'Expected own data fields.'); }
  if (!descriptor && optional) return fallback;
  if (!descriptor || !Object.hasOwn(descriptor, 'value')) fail('GAME_PATCH_INPUT', 'Expected own data fields.');
  return descriptor.value;
}

/** Duplicate game Codes retain separate catalog ordinals. A configured endpoint is a declaration, never a request permission. */
export function createLauncherCatalogPatchPlan(input, { decodeText, callerProfile = 'legacy' } = {}) {
  if (!['legacy', 'win32-current'].includes(callerProfile)) fail('GAME_PATCH_CALLER_PROFILE', 'Choose a supported explicit caller profile.');
  const catalogs = snapshotLauncherCatalogCandidate(ownLauncherPatchInput(input, 'catalogs'), { decodeText }),
    gameOrdinal = ownLauncherPatchInput(input, 'gameOrdinal'), referenceOrdinal = ownLauncherPatchInput(input, 'referenceOrdinal');
  const galaxyOrdinal = ownLauncherPatchInput(input, 'galaxyOrdinal', undefined, true),
    selected = selectLauncherRegion(catalogs.games, gameOrdinal, catalogs.regions, referenceOrdinal,
      galaxyOrdinal === undefined ? {} : { galaxyOrdinal });
  const game = catalogs.games.games[gameOrdinal], encoding = ownLauncherPatchInput(input, 'pathEncoding'), directory = localDirectoryPath(ownLauncherPatchInput(input, 'directoryText')),
    encode = value => encodeLauncherProcessField(value, { encoding }), endpoint = selected.patchEndpoint;
  const processPlan = (callerProfile === 'win32-current' ? createWin32LauncherPatchPlan : createLauncherPatchPlan)({ codeTextBytes: encode(game.code), directoryBytes: encode(directory),
    patcherBytes: encode(game.patcherText), addressBytes: encode(endpoint?.address ?? ''), portBytes: encode(endpoint?.portText ?? ''),
    alreadyPatched: ownLauncherPatchInput(input, 'alreadyPatched'), caseProfile: 'ascii' });
  const patchSourceProfile = ownLauncherPatchInput(input, 'patchSourceProfile', 'configured-only', true),
    patchSourceOrdinal = ownLauncherPatchInput(input, 'patchSourceOrdinal', 0, true);
  let patchSources;
  if (patchSourceProfile === 'configured-only') {
    patchSources = Object.freeze(endpoint ? [Object.freeze({ ...endpoint, sourceOrdinal: 0, kind: 'configured' })] : []);
  } else if (patchSourceProfile === PUK3_PATCH_SOURCE_PROFILE.id) {
    if (game.patcherText !== PUK3_PATCH_SOURCE_PROFILE.patcherName || !endpoint) {
      fail('GAME_PATCH_SOURCE_PROFILE', 'The explicit fixed profile requires matching patcher metadata and an endpoint.');
    }
    patchSources = createPuk3PatchSourcePlan(endpoint).sources;
  } else fail('GAME_PATCH_SOURCE_PROFILE', 'Choose a supported explicit patch-source profile.');
  if (!Number.isSafeInteger(patchSourceOrdinal) || patchSourceOrdinal < 0 ||
      (patchSources.length ? patchSourceOrdinal >= patchSources.length : patchSourceOrdinal !== 0)) {
    fail('GAME_PATCH_SOURCE_ORDINAL', 'Select an available patch-source ordinal explicitly.');
  }
  return Object.freeze({ processPlan, patchEndpoint: endpoint ? Object.freeze({ ...endpoint }) : null,
    patchSourceProfile, patchSourceOrdinal, patchSources, selectedPatchSource: patchSources[patchSourceOrdinal] ?? null,
    binding: Object.freeze({ gameOrdinal, referenceOrdinal, regionOrdinal: selected.regionOrdinal, gameCodeText: game.code,
      gameName: game.name, regionName: selected.regionName, patcher: game.files.patcher, patcherText: game.patcherText, directoryText: directory, pathEncoding: encoding,
      gameListMd5: catalogs.gameListMd5, regionListMd5: catalogs.regionListMd5,
      patchSourceProfile, patchSourceOrdinal,
      ...(selected.galaxyOrdinal === undefined ? {} : { galaxyOrdinal:selected.galaxyOrdinal }) }),
    trust: 'unverified', authentication: 'unverified', execution: 'not-performed' });
}

/** One source-bound sequential preparation; platform and source transport are explicit ports. */
export function createLauncherGamePatchPreparer(options) {
  const ports={};
  for(const name of ['decodeText','now','setTimer','clearTimer','createAbortController','readSignal','clientForSource']){
    const field=options&&Object.getOwnPropertyDescriptor(options,name);
    if(!field||!Object.hasOwn(field,'value')||typeof field.value!=='function')fail('GAME_PATCH_INPUT','Supply complete patch ports.');ports[name]=field.value;
  }
  const callerProfile = ownLauncherPatchInput(options, 'callerProfile', 'legacy', true);
  if (!['legacy', 'win32-current'].includes(callerProfile)) fail('GAME_PATCH_CALLER_PROFILE', 'Choose a supported explicit caller profile.');
  function signal(value){try{const result=ports.readSignal(value);if(value===undefined&&result===null)return null;
    if(!result||['aborted','add','remove'].some(name=>typeof result[name]!=='function')||typeof result.aborted()!=='boolean')throw new TypeError();return result;
  }catch{fail('GAME_PATCH_INPUT','Expected a platform cancellation signal.');}}
  return Object.freeze({async prepare(input){
    let previous=-Infinity;
    function now(){const value=ports.now();if(!Number.isFinite(value)||value<0||value<previous)fail('GAME_PATCH_INPUT','Expected monotonic time.');previous=value;return value;}
    const started=now(),timeoutMs=ownLauncherPatchInput(input,'timeoutMs',10000,true),
      external=signal(ownLauncherPatchInput(input,'signal',undefined,true)),epochSeconds=ownLauncherPatchInput(input,'epochSeconds');
    if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>60000||!Number.isInteger(epochSeconds)||epochSeconds<0||epochSeconds>0x7fffffff)
      fail('GAME_PATCH_INPUT','Expected bounded timeout and explicit nonnegative signed32 epoch seconds.');
    const deadline=started+timeoutMs;let stopped,rejectStop,control,timer,run,local;
    const stopPromise=new Promise((resolve,reject)=>{rejectStop=reject;});stopPromise.catch(()=>{});
    function stop(code){if(stopped)return;stopped=new LauncherGamePatchError(code,code==='GAME_PATCH_TIMEOUT'?'The complete patch preparation deadline expired.':'Patch preparation was cancelled.');
      try{control?.abort();}catch{/* Continue deadline rejection and cleanup. */}rejectStop(stopped);}
    function check(){if(now()>=deadline)stop('GAME_PATCH_TIMEOUT');if(external?.aborted())stop('GAME_PATCH_ABORTED');if(stopped)throw stopped;}
    const abort=()=>stop(now()>=deadline?'GAME_PATCH_TIMEOUT':'GAME_PATCH_ABORTED');
    try{
      check();const plan=createLauncherCatalogPatchPlan(input,{decodeText:ports.decodeText,callerProfile});check();const requests=[];
      if(plan.processPlan.disposition!=='patch-requested')return Object.freeze({...plan,disposition:plan.processPlan.disposition,candidate:null,requests:Object.freeze(requests),replacement:'not-performed'});
      if(!plan.patchEndpoint)fail('GAME_PATCH_ENDPOINT','The selected region has no explicit patch endpoint.');
      const client=ports.clientForSource(plan.selectedPatchSource,input);
      if(!client||typeof client.getBytes!=='function'||typeof client.urlForPath!=='function')fail('GAME_PATCH_INPUT','Expected a source-bound byte client.');
      const getBytes=client.getBytes.bind(client),urlForPath=client.urlForPath.bind(client);
      local=applyGamePatchCandidates({manifestBytes:new Uint8Array(),files:ownLauncherPatchInput(input,'files'),archives:[]}).files;check();
      control=ports.createAbortController();if(!control||typeof control.abort!=='function'||!control.signal||!signal(control.signal))fail('GAME_PATCH_INPUT','Invalid cancellation control.');
      external?.add(abort);if(external?.aborted())abort();check();timer=ports.setTimer(()=>stop('GAME_PATCH_TIMEOUT'),Math.max(1,Math.ceil(deadline-now())));
      const get=async(path,kind)=>{check();const url=urlForPath(path);if(typeof url!=='string'||url.length>4096)fail('GAME_PATCH_INPUT','Expected a bounded transport URL.');
        requests.push(Object.freeze({url,kind}));const pending=Promise.resolve().then(()=>{check();return getBytes(path,{kind,signal:control.signal,timeoutMs:Math.max(1,Math.ceil(deadline-now()))});});
        const response=await Promise.race([pending,stopPromise]);check();return ownLauncherInputBytes(response.bytes,kind==='catalog'?1048576:33554432,{allowEmpty:true});};
      const manifestBytes=await get(`/cg50/Update.TXT?t=${epochSeconds}`,'catalog');run=createGamePatchCandidateRun({manifestBytes,files:local});
      let step=run.next();check();
      while(!step.done){const request=step.value;
        if(/[?#%\x00-\x20\x7f]/.test(request.directory+request.name))fail('GAME_PATCH_URL_PROFILE','Patch path contains unsupported URL syntax.');
        const archive=await get(`/cg50/${request.directory}/${request.name}.bz2?time=${epochSeconds}`,'package');check();step=run.next(archive);check();}
      return Object.freeze({...plan,disposition:'game-patch-candidate',candidate:step.value,requests:Object.freeze(requests),trust:'unverified',authentication:'unverified',replacement:'not-performed'});
    }catch(error){if(now()>=deadline)stop('GAME_PATCH_TIMEOUT');if(stopped)throw stopped;throw error;}
    finally{try{if(timer!==undefined)ports.clearTimer(timer);}finally{external?.remove(abort);run?.return();for(const row of local??[])row.bytes.fill(0);}}
  }});
}

