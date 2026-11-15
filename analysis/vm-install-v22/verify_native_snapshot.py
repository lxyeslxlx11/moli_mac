"""Read-only fixed cold-snapshot structure/hash check; never restore or start a VM."""
from pathlib import Path
import datetime,hashlib,json,stat,xml.etree.ElementTree as E
R=Path('/Users/lx/Parallels/Windows 11.pvm')
OUT=Path(__file__).with_name('native-snapshot-verification.json')
G='{7d7de628-ef85-4b19-873d-99071422ea2b}';N='Moli-before-launcher-probe-20261026-v22'
ISO=Path('/Users/lx/Documents/code/moli-mac/build/parallels/media/moli-client-probe-v18.iso')
EXPECTED_ISO='ef526c404a4ce264c07530707329ffb2fbea0f2e158809f803b5153c2c349f68'
def require(ok,msg):
 if not ok:raise RuntimeError(msg)
def sig(p):
 for v in [*reversed(p.parents),p]:require(not v.is_symlink(),'Symlink path')
 s=p.lstat();require(stat.S_ISREG(s.st_mode) and s.st_nlink==1,'Not independent regular file')
 return (s.st_dev,s.st_ino,s.st_size,s.st_mtime_ns,s.st_ctime_ns)
def raw(p):
 before=sig(p);b=p.read_bytes();require(sig(p)==before,'Changed while reading');return b
def xmlbytes(b):
 require(len(b)<2*1048576 and b'<!DOCTYPE' not in b.upper() and b'<!ENTITY' not in b.upper(),'Unexpected XML');return E.fromstring(b)
meta=[R/'Snapshots.xml',R/'config.pvs',R/'harddisk.hdd/DiskDescriptor.xml']
initial={p:raw(p) for p in meta};s,c,d=[xmlbytes(initial[p]) for p in meta]
hits=[x for x in s.iter('SavedStateItem') if x.get('guid')==G or x.findtext('Name')==N]
require(len(hits)==1 and hits[0].get('guid')==G and hits[0].findtext('Name')==N and hits[0].get('state')=='poweroff','New snapshot identity/cold-state mismatch')
hdds=c.findall('./Hardware/Hdd');require(len(hdds)==1 and hdds[0].findtext('SystemName')=='harddisk.hdd','Unexpected hard disk dependency')
images={}
for x in d.findall('./StorageData/Storage/Image'):
 g=x.findtext('GUID');name=x.findtext('File');p=Path(name or '')
 require(g and g not in images and name and not p.is_absolute() and '..' not in p.parts,'Duplicate or unsafe image')
 f=R/'harddisk.hdd'/p;require(f.resolve().is_relative_to(R.resolve()),'External image');sig(f);images[g]=f
parents={}
for x in d.findall('./Snapshots/Shot'):
 g=x.findtext('GUID');require(g and g not in parents,'Duplicate shot');parents[g]=x.findtext('ParentGUID')
require(set(parents)==set(images) and G in parents,'Incomplete disk graph')
for start in parents:
 seen=set();cur=start
 while cur!='{00000000-0000-0000-0000-000000000000}':
  require(cur in parents and cur not in seen,'Broken/cyclic chain');seen.add(cur);cur=parents[cur]
leaves=set(parents)-set(parents.values());require(len(leaves)==1 and parents[next(iter(leaves))]==G,'Expected new snapshot parent of unique live leaf')
require(c.findtext('./Settings/Tools/IsolatedVm')=='1','Mac isolation absent')
nics=c.findall('./Hardware/NetworkAdapter');require(nics and all(x.findtext('Connected')=='0' for x in nics),'NIC not disconnected')
usb=c.find('./Settings/UsbController');disabled=['Disks','HumanInterfaces','Audio','Video','SmartCards','Printers','SmartPhones']
require(usb is not None and all(usb.findtext('./ExternalDevices/'+x)=='0' for x in disabled),'Visible USB category enabled')
require(usb.findtext('EhcEnabled')=='1' and usb.findtext('XhcEnabled')=='1','Virtual controllers changed')
require(all(x.text=='0' for x in c.iter('AutoConnect')),'USB autoconnect enabled')
require(c.findtext('./Settings/VirtualPrintersInfo/UseHostPrinters')=='0','Host printer enabled')
cameras=list(c.iter('SharedCamera'));require(cameras and all(x.findtext('Enabled')=='0' for x in cameras),'Camera enabled/unknown')
inputs=c.findall('./Hardware/Sound/SoundInputs/Sound');require(inputs and all(x.findtext('Enabled')=='0' for x in inputs),'Microphone enabled/unknown')
cd=c.findall('./Hardware/CdRom');require(len(cd)==1 and cd[0].findtext('SystemName')==str(ISO),'Unrecognized CD dependency')
require(ISO.stat().st_mode&0o777==0o400,'CD not readonly')
files=meta+[R/'Snapshots'/(G+ext) for ext in ('.dat','.pvc','.pvi','.tnvs')]+list(images.values())+[ISO]
before={p:sig(p) for p in files};entries=[]
for p in files:
 h=hashlib.sha256()
 with p.open('rb') as f:
  for chunk in iter(lambda:f.read(8*1024*1024),b''):h.update(chunk)
 require(sig(p)==before[p],'File changed during hashing')
 digest=h.hexdigest()
 if p==ISO:require(digest==EXPECTED_ISO,'External readonly CD hash mismatch')
 entries.append({'path':str(p.relative_to(R)) if p.is_relative_to(R) else str(p),'bytes':before[p][2],'sha256':digest})
 print(json.dumps({'verified_file':entries[-1]['path'],'bytes':before[p][2]}),flush=True)
require(all(sig(p)==before[p] for p in files),'Snapshot set changed while checking')
require(all(raw(p)==b for p,b in initial.items()),'Metadata graph changed while checking')
receipt={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'vm_path':str(R),'snapshot_name':N,'snapshot_guid':G,'snapshot_state':'poweroff','internal_disk_graph_valid':True,'disk_images':len(images),'unique_live_leaf':next(iter(leaves)),'live_leaf_parent':G,'entries':entries,'network_connected':False,'mac_isolation':True,'usb_disabled_categories':disabled,'usb_hidden_flags_retained':{x:usb.findtext('./ExternalDevices/'+x) for x in ['Communication','Other']},'virtual_usb_controllers_retained':True,'microphone_camera_printer_disabled':True,'readonly_cd_dependency':{'path':str(ISO),'connected':cd[0].findtext('Connected'),'sha256':EXPECTED_ISO,'required_if_restoring_same_media_state':True},'scope':'Structural and hash verification; normal shutdown and snapshot manager observations recorded separately. Not independent backup or tested restoration.','restoration_invoked':False,'restore_boot_tested':False}
with OUT.open('x') as f:json.dump(receipt,f,ensure_ascii=False,indent=2);f.write('\n')
print(json.dumps({'result':'verified','receipt':str(OUT),'restore_boot_tested':False}))
