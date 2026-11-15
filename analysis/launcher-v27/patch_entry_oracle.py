"""Fixed launch anchors and original patch-entry vectors. Static PE reads and original byte inputs only."""
import argparse,copy,hashlib,importlib.util,json,sys
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[2];D=Path(__file__).parent
SHA='601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31'
def write(name,value):(D/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--pe',type=Path,required=True);args=ap.parse_args();data=args.pe.read_bytes()
    if hashlib.sha256(data).hexdigest()!=SHA:raise ValueError('Fixed source identity mismatch before parsing.')
    s=importlib.util.spec_from_file_location('verify',ROOT/'analysis/protocol-v3/launch/verify_launch.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);pe=m.PE32(data)
    anchors=[]
    for name,va,target,text in [('backup-extension',0x406654,0x4b259c,'.BAK.EXE'),('replace-extension',0x406659,0x4b25a8,'.EXE'),
        ('port-space',0x406673,0x4b25b0,' '),('host-space',0x406684,0x4b25b4,' '),('command-separator',0x40668d,0x4b25b8,'\\'),('copy-separator',0x4067d8,0x4b25bc,'\\')]:
        anchors.append({'id':name,'kind':'literal_reference','va':hex(va),'target':hex(target),'literal':text})
    for name,va,target in [('patch-call',0x412b42,0x406110),('copy-current-patcher',0x406640,0x40bc30),('uppercase',0x40664f,0x4093a0),
        ('replace-all',0x406661,0x409050),('prefix-directory',0x4066a6,0x409520),('append-patcher',0x4066d2,0x409470),
        ('space-after-program',0x4066fe,0x409520),('append-host',0x40672a,0x409470),('space-after-host',0x406756,0x409520),('append-port',0x40677f,0x409470),
        ('uppercase-helper',0x4093ce,0x40a5a0),('uppercase-map',0x44e0d5,0x45b42c),('game-Code-copy',0x4030d4,0x40bd10),
        ('PIP-copy',0x402971,0x40bd10),('PPort-copy',0x4029f5,0x40bd10)]:
        anchors.append({'id':name,'kind':'direct_call','va':hex(va),'target':hex(target)})
    for name,va,size in [('completion-read',0x40636e,8),('completion-write',0x406be9,8),('exit100',0x406bbe,4),('exit101',0x406c16,4),
        ('exit102',0x406d05,4),('attempt-limit',0x406e59,6),('port-field',0x40666c,6),('host-field',0x40667e,5),
        ('directory-field',0x406698,6),('Code-field',0x4030cd,7),('uppercase-flag',0x44e0c9,5)]:
        anchors.append({'id':name,'kind':'instruction_bytes','va':hex(va),'expected_hex':pe.at(va,size).hex()})
    manifest={'sample':{'sha256':SHA},'anchors':anchors};audit=m.verify(data,manifest);negatives=[]
    for name in ['identity','literal','call-target']:
        candidate=copy.deepcopy(manifest);source=data
        if name=='identity':source=data[:-1]+bytes([data[-1]^1])
        elif name=='literal':candidate['anchors'][0]['literal']='.BAD.EXE'
        else:candidate['anchors'][6]['target']='0x406111'
        try:m.verify(source,candidate)
        except m.EvidenceError as error:negatives.append({'name':name,'rejected':True,'reason':str(error)})
        else:raise AssertionError(name)
    write('entry-anchors.json',manifest);write('entry-anchor-audit.json',{**audit,'negative_cases':negatives})
    cases=[]
    for code in [b'0',b'11',b'0011']:
        for patcher in [b'Patcher.exe',b'PATCH.EXE',b'tools.exe/patch.exe',b'patch',b'']:
            directory=b'C:\\Original Folder\\Client';host=b'patch.example.invalid';port=b'00080'
            backup=patcher.upper().replace(b'.EXE',b'.BAK.EXE')
            for completed in [False,True]:
                raw={'directory':directory,'patcher':patcher,'codeText':code,'address':host,'port':port}
                expected={'commandLine':directory+b'\\'+backup+b' '+host+b' '+port+b'\0','workingDirectory':directory+b'\0',
                    'originalPatcherPath':directory+b'\\'+patcher+b'\0','backupPatcherPath':directory+b'\\'+backup+b'\0',
                    'backupName':backup,'packagedSourceRelative':code+b'\\'+patcher+b'\0'}
                cases.append({'name':'entry-%02d'%len(cases),'alreadyPatched':completed,'input':{k+'_hex':v.hex() for k,v in raw.items()},
                    'expected':{**{k+'_hex':v.hex() for k,v in expected.items()},'disposition':'already-patched' if completed else 'no-patcher' if not patcher else 'patch-requested'}})
    for encoding in ['gbk','utf-8']:
        directory='C:\\原创\\魔力'.encode(encoding);patcher=b'PaTcH.ExE';host=b'127.0.0.1';port=b'80';code=b'0011';backup=patcher.upper().replace(b'.EXE',b'.BAK.EXE')
        raw={'directory':directory,'patcher':patcher,'codeText':code,'address':host,'port':port}
        out={'commandLine':directory+b'\\'+backup+b' '+host+b' '+port+b'\0','workingDirectory':directory+b'\0','originalPatcherPath':directory+b'\\'+patcher+b'\0',
            'backupPatcherPath':directory+b'\\'+backup+b'\0','backupName':backup,'packagedSourceRelative':code+b'\\'+patcher+b'\0'}
        cases.append({'name':'opaque-directory-'+encoding,'alreadyPatched':False,'input':{k+'_hex':v.hex() for k,v in raw.items()},'expected':{**{k+'_hex':v.hex() for k,v in out.items()},'disposition':'patch-requested'}})
    exits=[]
    for code in [0,99,100,101,102,103,0xffffffff]:
        for attempt in [1,2,3]:
            disposition='completed' if code==100 else 'source-failed' if code==101 else ('retry' if attempt<3 else 'retry-exhausted') if code==102 else 'unexpected-exit'
            exits.append({'exitCode':code,'attempt':attempt,'disposition':disposition,'markPatched':code==100,'retry':disposition=='retry','nextAttempt':attempt+1 if disposition=='retry' else None})
    write('original-entry-vectors.json',{'schema':'moli.launcher-v27.original-entry-vectors.v1','source':'Original byte inputs/Python uppercase and replacement; no original executable run or account data. Opaque directory encoding does not establish native ACP.','entries':cases,'exits':exits})
    print(json.dumps({'anchors':len(anchors),'negative_cases':len(negatives),'entry_vectors':len(cases),'exit_vectors':len(exits)}))
if __name__=='__main__':main()
