/** Data-contract checker only; not a collector, debugger, launcher or proof of backend privacy. */
const target = 'moli-diagnostic-fixture.exe';
export const REQUIRED_SYNTHETIC_APIS = Object.freeze(['GetCommandLineW','CreateFileMappingW','OpenFileMappingW','MapViewOfFile','UnmapViewOfFile']);
const allowed = new Set([...REQUIRED_SYNTHETIC_APIS,'CloseHandle']);
function fail(message) { throw new Error(message); }
function keys(object, list) {
  if (!object || typeof object !== 'object' || Array.isArray(object) || Object.keys(object).some(key=>!list.includes(key))) fail('Unexpected metadata fields.');
}
export function checkSyntheticTrace(trace, identity) {
  keys(identity,['binarySha256','imageSize','machine']);
  if (!/^[0-9a-f]{64}$/.test(identity.binarySha256 ?? '') || identity.machine!=='0x14c'
    || !Number.isSafeInteger(identity.imageSize) || identity.imageSize<=0 || identity.imageSize>16*1024*1024) fail('Expected a reviewed x86 PE32 identity.');
  keys(trace,['target','binarySha256','exitCode','events']);
  if(trace.target!==target || trace.binarySha256!==identity.binarySha256 || trace.exitCode!==0) fail('Wrong or failed synthetic target.');
  if(!Array.isArray(trace.events)||trace.events.length>64)fail('Trace budget.');
  let last=-1;let next=0;let closes=0;
  for(const event of trace.events){
    keys(event,['api','callerModule','callerRva','elapsedMs']);
    if(!allowed.has(event.api)||event.callerModule!==target)fail('Unexpected API or caller module.');
    if(!Number.isSafeInteger(event.callerRva)||event.callerRva<0||event.callerRva>=identity.imageSize)fail('Caller RVA outside reviewed image.');
    if(!Number.isFinite(event.elapsedMs)||event.elapsedMs<last||event.elapsedMs<0||event.elapsedMs>10000)fail('Invalid relative time.');
    last=event.elapsedMs;
    if(event.api===REQUIRED_SYNTHETIC_APIS[next])next+=1;
    if(next===REQUIRED_SYNTHETIC_APIS.length&&event.api==='CloseHandle')closes+=1;
  }
  if(next!==REQUIRED_SYNTHETIC_APIS.length||closes<2)fail('Incomplete ordered synthetic trace.');
  return Object.freeze({schema:'moli.synthetic-metadata-acceptance.v1',passed:true,events:trace.events.length,
    limit:'Contract on supplied synthetic metadata only; does not verify a collector or any game consumer/protocol.'});
}
