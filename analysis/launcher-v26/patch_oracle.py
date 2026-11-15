"""Fixed source anchors and original Python ZIP/byte-grammar vectors. Never executes a target or uses a network."""
import argparse, copy, hashlib, importlib.util, io, json, struct, sys, zipfile
from pathlib import Path
sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]
SHA = '195f3afda41f342147b0616a4c005a4cb308ae6869b52c4a558fded5f5d9aaa8'
D = Path(__file__).parent
def write(name, value): (D/name).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')
def native_split(data, sep):
    out = []; start = 0
    while True:
        at = data.find(sep, start)
        if at < 0:
            if start < len(data): out.append(data[start:])
            return out
        out.append(data[start:at]); start = at + len(sep)
def parse(data):
    operations=[]; skipped=[]; blocks=native_split(data.strip(b' \t\r\n'), b'}')
    for ordinal, block in enumerate(blocks):
        for literal in [b'\r', b'\t', b' ', b'{\n']: block=block.replace(literal, b'')
        lines=native_split(block.strip(b' \t\r\n'), b'\n')
        if len(lines)<2 or lines[0] not in [b'create',b'append',b'replaceto']:
            skipped.append({'blockOrdinal':ordinal,'reason':'too-few-lines' if len(lines)<2 else 'unknown-command'});continue
        fields=[]; seen=set(); ignored=0; duplicate=0
        for line in lines[1:]:
            pair=native_split(line,b':')
            if len(pair)!=2:ignored+=1;continue
            if pair[0] in seen:duplicate+=1;continue
            seen.add(pair[0]);fields.append({'key_hex':pair[0].hex(),'value_hex':pair[1].hex()})
        operations.append({'blockOrdinal':ordinal,'operation':lines[0].decode('ascii'),'fields':fields,'ignoredLineCount':ignored,'duplicateFieldCount':duplicate})
    return {'blockCount':len(blocks),'operations':operations,'skippedBlocks':skipped}
def archive(rows, compressed=True):
    buffer=io.BytesIO()
    with zipfile.ZipFile(buffer,'w',compression=zipfile.ZIP_DEFLATED if compressed else zipfile.ZIP_STORED) as out:
        for name,data in rows:
            info=zipfile.ZipInfo(name,(2026,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED if compressed else zipfile.ZIP_STORED
            out.writestr(info,data)
    return buffer.getvalue()
def script(op,name,payload,path='Bin',old=None):
    fields=[('path',path),('name',name),('md5',hashlib.md5(payload).hexdigest())]
    if old is not None:fields.append(('old_name',old))
    return (op+'\n{\n'+'\n'.join(k+':'+v for k,v in fields)+'\n}').encode()
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--pe',type=Path,required=True);args=ap.parse_args();data=args.pe.read_bytes()
    if hashlib.sha256(data).hexdigest()!=SHA:raise ValueError('Fixed sample SHA256 mismatch before parsing.')
    spec=importlib.util.spec_from_file_location('source_verify',ROOT/'analysis/protocol-v3/launch/verify_launch.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);pe=m.PE32(data)
    anchors=[]
    for label,va,target,literal in [('block-delimiter',0x40a44f,0x477c40,'}'),('remove-cr',0x40a498,0x477c44,'\r'),
        ('remove-tab',0x40a4b0,0x477c48,'\t'),('remove-space',0x40a4c8,0x47787c,' '),('remove-open-line',0x40a4e0,0x477c4c,'{\n'),
        ('factory-line-split',0x409010,0x477a44,'\n'),('fields-line-split',0x412176,0x477a44,'\n'),('field-colon',0x4121dd,0x477b20,':')]:
        anchors.append({'id':label,'kind':'literal_reference','va':hex(va),'target':hex(target),'literal':literal})
    for label,va,target in [('http-backend-factory',0x409b9e,0x404cd0),('command-factory',0x40a503,0x408f90),
        ('command-lines',0x409018,0x402df0),('create-equal',0x40906e,0x401970),('append-equal',0x4090f8,0x401970),
        ('replaceto-equal',0x409182,0x401970),('create-fields',0x4090b8,0x412120),('append-fields',0x409142,0x412120),
        ('replaceto-fields',0x4091cc,0x412120),('field-node',0x41223c,0x4075d0),('field-insert',0x41224e,0x407600),
        ('trim-document',0x40a412,0x401880),('trim-block',0x40a4f7,0x401880)]:
        anchors.append({'id':label,'kind':'direct_call','va':hex(va),'target':hex(target)})
    for label,va,length in [('vtable-append',0x47987c,8),('vtable-create',0x479888,8),('vtable-replaceto',0x479894,8),
        ('three-attempt-limit',0x40a7bf,10),('create-command-ref',0x409069,5),('append-command-ref',0x4090f3,5),('replaceto-command-ref',0x40917d,5)]:
        anchors.append({'id':label,'kind':'instruction_bytes','va':hex(va),'expected_hex':pe.at(va,length).hex()})
    manifest={'sample':{'sha256':SHA},'anchors':anchors};audit=m.verify(data,manifest)
    negatives=[]
    for label in ['identity','call-target','source-byte']:
        changed=copy.deepcopy(manifest);source=data
        if label=='identity':source=data[:-1]+bytes([data[-1]^1])
        elif label=='call-target':changed['anchors'][8]['target']='0x404cd1'
        else:changed['anchors'][-1]['expected_hex']='00'*5
        try:m.verify(source,changed)
        except m.EvidenceError as error:negatives.append({'name':label,'rejected':True,'reason':str(error)})
        else:raise AssertionError(label)
    write('patch-anchors.json',manifest);write('patch-anchor-audit.json',{**audit,'negative_cases':negatives})
    grammar=[]
    sources=[b'',b'}',b'}}',b'create\nname:x}',b'create\n{\nname:x\n}',b'create{\nname:x}',b'CREATE\nname:x}',
        b'create\nname:a:b\nname:last\n}',b'create\na:\na::\n:b\n::\n}',
        b'create\nname:first\nname:second\nName:case\n}',b'unknown\nname:x}append\nname:y}',
        b'create\npath:\\A\\B\nname:\xd6\xd0\xce\xc4.bin\nmd5:d}',b'create\n{\nname:x\n']
    for op in ['create','append','replaceto']:
        for ending in ['}','', '}\r\n']:
            for whitespace in ['', ' \t']:
                sources.append((op+'\r\n{\r\n'+whitespace+'name'+whitespace+':'+whitespace+'a b'+whitespace+'\r\n'+ending).encode())
    for ordinal,source in enumerate(sources):grammar.append({'name':'grammar-%02d'%ordinal,'manifest_hex':source.hex(),'expected':parse(source)})
    scenarios=[]
    def add(name,manifest,files,archives,expected):
        scenarios.append({'name':name,'manifest_hex':manifest.hex(),'files':[{'path':p,'hex':b.hex()} for p,b in files],
            'archives':[{'blockOrdinal':i,'hex':b.hex()} for i,b in archives],
            'expected_files':[{'path':p,'hex':b.hex(),'md5':hashlib.md5(b).hexdigest()} for p,b in expected]})
    payload=b'Original game patch candidate\x00\xff';chunk=b' appended\x00bytes';base=b'Original base'
    for compressed in [False,True]:
        suffix='deflate' if compressed else 'stored'
        add('create-'+suffix,script('create','new.bin',payload),[('keep.txt',b'keep')],[(0,archive([('new.bin',payload),('extra.bin',b'extra')],compressed))],
            [('keep.txt',b'keep'),('Bin/new.bin',payload),('Bin/extra.bin',b'extra')])
        add('append-'+suffix,script('append','new.bin',base+chunk,old='old.bin'),[('Bin/old.bin',base)],[(0,archive([('new.bin',chunk),('ignored.bin',b'ignore')],compressed))],[('Bin/new.bin',base+chunk)])
        add('replaceto-'+suffix,script('replaceto','new.bin',payload,old='old.bin'),[('Bin/old.bin',base)],[(0,archive([('new.bin',payload)],compressed))],[('Bin/new.bin',payload)])
    add('directory-first',script('create','new.bin',payload),[],[(0,archive([('folder/',b''),('new.bin',payload),('folder/side.bin',b'side')]))], [('Bin/new.bin',payload),('Bin/folder/side.bin',b'side')])
    add('already-current',script('create','new.bin',payload),[('Bin/new.bin',payload)],[],[('Bin/new.bin',payload)])
    add('append-base-missing',script('append','new.bin',base+chunk,old='old.bin'),[],[],[])
    a=b'First';b=b' second';sequence=script('create','first.bin',a)+script('append','final.bin',a+b,old='first.bin')
    add('sequential-create-append',sequence,[],[(0,archive([('first.bin',a)])),(1,archive([('final.bin',b)]))],[('Bin/final.bin',a+b)])
    write('original-patch-vectors.json',{'schema':'moli.launcher-v26.original-patch-vectors.v1','source':'Original synthetic fixtures. Python zipfile/zlib/hashlib and independent byte splitter; no official payloads.',
        'grammar':grammar,'scenarios':scenarios,'malicious_archives':{name:archive(rows).hex() for name,rows in {
        'traversal':[('../escape.bin',b'x')],'absolute':[('/root.bin',b'x')],'drive':[('C:/root.bin',b'x')],
        'case-alias':[('new.bin',payload),('NEW.BIN',payload)],'file-directory':[('a',b'x'),('a/b',b'y')],
        'reserved':[('NUL.bin',b'x')],'directory-file-prefix':[('a',b'x'),('a/b/',b'')],
        'empty-directory-body':[('a/',b'not empty')],'second-crc':[('new.bin',payload),('side.bin',b'side')]}.items()}})
    print(json.dumps({'anchors':len(anchors),'negative_cases':len(negatives),'grammar_vectors':len(grammar),'candidate_scenarios':len(scenarios)}))
if __name__=='__main__':main()
