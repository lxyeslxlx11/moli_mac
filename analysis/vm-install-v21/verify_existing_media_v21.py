"""Read back existing v21 media; no rebuild, mount, execution or VM mutation."""
from pathlib import Path
import datetime, hashlib, importlib.util, json, subprocess
spec=importlib.util.spec_from_file_location('build_media', Path(__file__).with_name('prepare_media_v21.py'))
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
b.nonsymlink(b.OUTPUT)
original={name:b.validated_source(name) for name in b.EXPECTED}
listing=subprocess.run(['/usr/bin/bsdtar','-tvf',str(b.OUTPUT)],capture_output=True,text=True,check=True).stdout.splitlines()
files=set();dirs=set()
for line in listing:
    cols=line.split(None,8)
    if len(cols)!=9:raise RuntimeError('Unexpected member description')
    mode,name=cols[0],cols[8]
    if name.startswith('./'):name=name[2:]
    if mode.startswith('d'):dirs.add(name)
    elif mode.startswith('-'):
        if name in files:raise RuntimeError('Duplicate file')
        files.add(name)
    else:raise RuntimeError('Non-regular member')
if dirs!={'.','XML'} or files!=set(b.EXPECTED) or len(listing)!=5:raise RuntimeError('Unexpected member set')
verified=[]
for name,data in original.items():
    readback=subprocess.run(['/usr/bin/bsdtar','-xOf',str(b.OUTPUT),name],capture_output=True,check=True).stdout
    if readback!=data:raise RuntimeError('Readback differs')
    verified.append({'name':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'readback_equal':True})
raw=b.OUTPUT.read_bytes();descriptors=[]
for sector in range(16,32):
    d=raw[sector*2048:(sector+1)*2048]
    if len(d)!=2048 or d[1:6]!=b'CD001':raise RuntimeError('Invalid ISO descriptor')
    descriptors.append({'sector':sector,'type':d[0]})
    if d[0]==0:raise RuntimeError('Unexpected boot descriptor')
    if d[0]==255:break
else:raise RuntimeError('No terminator')
if b.OUTPUT.stat().st_mode&0o777!=0o400:raise RuntimeError('Not expected readonly mode')
result={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'iso_path':str(b.OUTPUT),'iso_bytes':len(raw),'iso_sha256':hashlib.sha256(raw).hexdigest(),'iso_mode':'0o400','format':'ISO9660/Joliet data CD','label':'MOLI_LAUNCH_V21','descriptors':descriptors,'bootable':False,'autorun':False,'directories':sorted(dirs),'files':verified,'readback':'bsdtar in memory; no host mount','guest_mounted':False,'guest_imported':False,'sample_executed':False,'initial_build_result':'Image creation succeeded; original member check counted XML directory as file and stopped before receipt. No rebuild performed. Existing exact member types and bytes subsequently verified.'}
with Path(__file__).with_name('media-validation.json').open('x') as f:json.dump(result,f,indent=2);f.write('\n')
print(json.dumps(result))
