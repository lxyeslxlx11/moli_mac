/** Optional local launch preparation controls. Reads directory metadata only; no file payloads or process execution. */
import { snapshotLauncherDirectory } from './launcher-launch-data.mjs';
import { LAUNCHER_RESOURCE_GROUPS } from '../shared/index.mjs';
export function bindLoginLaunchControls({ createInput, onChange, selectedPaths=()=>null }) {
  const $ = id => document.getElementById(id), fields = $('launch-fields');
  const directory = $('launch-directory'), encoding = $('launch-path-encoding'), files = $('launch-folder');
  const refresh = $('launch-only-refresh'); let onlyRefresh = false;
  const status = text => { $('launch-status').textContent = text; };
  let prepared = null, index = null, intent = false, locked = true;
  function clear() {
    if (prepared) for (const key of ['directoryBytes', 'executablePathBytes', 'argsLineBytes', 'regionArgsBytes', 'galaxyArgsBytes']) prepared[key].fill(0);
    for (const group of index?.resourceGroups ?? []) for (const entry of group.entries) entry.fileNameBytes.fill(0);
    prepared = null; index = null;
  }
  function changed(field) {
    clear(); intent = !!directory.value || files.files.length > 0 || onlyRefresh;
    status(intent ? field==='only-refresh'?'仅刷新选项已变化，请重新准备；旧交接数据已清除。':'目录或编码已变化，请重新准备；旧交接数据已清除。' : '可在交换前准备完整参数。'); onChange({kind:'field',field});
  }
  directory.addEventListener('input',()=>changed('directory')); encoding.addEventListener('change',()=>changed('encoding')); files.addEventListener('change',()=>changed('folder'));
  refresh.addEventListener('change',()=>{if(locked){refresh.checked=onlyRefresh;return;}onlyRefresh=refresh.checked;changed('only-refresh');});
  function prepare() {
    if (locked) return;
    clear(); intent = true; onChange({kind:'preparing'});
    try {
      const candidatePaths=selectedPaths();
      if(onlyRefresh){ index=null; }
      else if(candidatePaths!==null){
        index=candidatePaths.length?snapshotLauncherDirectory(candidatePaths.map(path=>({relativePath:'Candidate/'+path}))):
          {matchedFiles:0,resourceGroups:LAUNCHER_RESOURCE_GROUPS.map(({id})=>({id,state:'enumerated',entries:[]}))};
      } else if (files.files.length) {
        const getter = Object.getOwnPropertyDescriptor(File.prototype, 'webkitRelativePath')?.get;
        if (!getter || files.files.length > 32768) throw new Error();
        index = snapshotLauncherDirectory(Array.from(files.files, file => ({ relativePath: Reflect.apply(getter, file, []) })));
      }
      prepared = createInput({ directoryText: directory.value, pathEncoding: encoding.value, onlyRefreshWord:onlyRefresh?1:0,
        ...(index ? { resourceGroups: index.resourceGroups } : {}) });
      status(`参数已准备：${index?.matchedFiles ?? 0}项资源；${onlyRefresh?'已选择仅刷新通行证，按所选游戏分支准备交接。':candidatePaths!==null?'资源来自所选补丁候选。':'选择候选后生成完整交接。'}`);
    } catch {
      clear(); status('参数未准备：请核对目录、路径编码及安装文件夹。资源标题目前只支持ASCII文件名。');
    }
  }
  $('prepare-launch').addEventListener('click',prepare);
  return Object.freeze({
    setLocked(value) { locked = value; fields.disabled = value; },prepare,
    invalidate(){clear();intent=!!directory.value||files.files.length>0||onlyRefresh;status('候选已变化，请重新准备完整参数。');},
    getInput() {
      if (intent && !prepared) throw new Error('Prepare the current local directory first.');
      return prepared;
    },
    reset() {
      clear(); intent = false; directory.value = ''; files.value = ''; encoding.value = 'ascii';onlyRefresh=false;refresh.checked=false;
      status('可在交换前准备完整参数。');
    },
  });
}
