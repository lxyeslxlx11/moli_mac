from pathlib import Path
import xml.etree.ElementTree as E,json,hashlib,os,stat,datetime
R=Path('/Users/lx/Parallels/Windows 11.pvm')
OUT=Path('/Users/lx/Documents/Codex/2026-10-25/task/analysis/vm-install-v19/native-snapshot-verification.json')
G='{cd6af400-d740-4aac-83f0-b70bbd78cde4}'; N='Moli-before-client-probe-20261025-v19'
def regular(p):
 s=p.lstat(); assert stat.S_ISREG(s.st_mode) and s.st_nlink==1
 return s
def sha(p):
 s=regular(p); h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 t=p.stat();assert (s.st_ino,s.st_size,s.st_mtime_ns)==(t.st_ino,t.st_size,t.st_mtime_ns)
 return h.hexdigest()
def xml(p):
 assert regular(p).st_size<2*1048576
 b=p.read_bytes();assert b'<!DOCTYPE' not in b.upper() and b'<!ENTITY' not in b.upper()
 return E.fromstring(b)
s=xml(R/'Snapshots.xml'); hits=[x for x in s.iter('SavedStateItem') if x.attrib.get('guid')==G]
assert len(hits)==1 and hits[0].findtext('Name')==N and hits[0].attrib['state']=='poweroff'
d=xml(R/'harddisk.hdd/DiskDescriptor.xml'); images={}
for x in d.findall('./StorageData/Storage/Image'):
 name=x.findtext('File');p=Path(name);assert not p.is_absolute() and '..' not in p.parts
 full=R/'harddisk.hdd'/p;assert full.resolve().is_relative_to(R.resolve())
 assert not full.is_symlink(); regular(full);images[x.findtext('GUID')]=full
parents={x.findtext('GUID'):x.findtext('ParentGUID') for x in d.findall('./Snapshots/Shot')}
assert set(parents)==set(images) and G in parents
for start in parents:
 seen=set();cur=start
 while cur!='{00000000-0000-0000-0000-000000000000}':
  assert cur in parents and cur not in seen;seen.add(cur);cur=parents[cur]
c=xml(R/'config.pvs')
assert c.findtext('./Settings/Tools/IsolatedVm')=='1'
assert all(x.findtext('Connected')=='0' for x in c.findall('./Hardware/NetworkAdapter'))
expected=['Disks','HumanInterfaces','Audio','Video','SmartCards','Printers','SmartPhones']
assert all(c.findtext('./Settings/UsbController/ExternalDevices/'+x)=='0' for x in expected)
assert c.findtext('./Settings/VirtualPrintersInfo/UseHostPrinters')=='0'
for cd in c.findall('./Hardware/CdRom'):assert cd.findtext('Connected')=='0'
files=[R/'Snapshots.xml',R/'harddisk.hdd/DiskDescriptor.xml',R/'config.pvs']+[R/'Snapshots'/(G+ext) for ext in ('.dat','.pvc','.pvi','.tnvs')]+list(images.values())
entries=[{'path':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':sha(p)} for p in files]
receipt={'observed_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'vm_path':str(R),'snapshot_name':N,'snapshot_guid':G,'snapshot_state':'poweroff','snapshot_manager_name_and_restore_action_observed':True,'internal_disk_graph_valid':True,'disk_images':len(images),'entries':entries,'network_connected':False,'mac_isolation':True,'usb_visible_categories_disabled':expected,'usb_controller_preserved':True,'shared_clipboard_and_folders':'unavailable under IsolatedVm; saved child settings retained','native_snapshot_created':True,'restoration_invoked':False,'restore_boot_tested':False,'independent_cold_copy':'failed strict extended-metadata comparison; retained, not accepted','sample_execution_count':0}
OUT.parent.mkdir(parents=True,exist_ok=True)
with OUT.open('x') as f:json.dump(receipt,f,ensure_ascii=False,indent=2)
print(json.dumps({'status':'native_snapshot_created_and_structurally_verified','restore_boot_tested':False,'receipt':str(OUT),'disk_images':len(images)}))
