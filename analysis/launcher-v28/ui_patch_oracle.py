"""Original UI patch fixture: classic ZIP and MD5 using Python standard libraries only."""
import hashlib,io,json,zipfile
from pathlib import Path
def archive(name,data):
    output=io.BytesIO()
    with zipfile.ZipFile(output,'w') as out:
        info=zipfile.ZipInfo(name,(2026,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;out.writestr(info,data)
    return output.getvalue()
def main():
    first=b'Original UI graphic metadata\x00\xff';chunk=b' and original appended bytes';final=first+chunk
    rows=[('create','GraphicInfo_7.bin',first,None,first),('append','GraphicInfo_8.bin',final,'GraphicInfo_7.bin',chunk)]
    manifest=[];packages=[]
    for ordinal,(operation,name,digest_input,old,payload) in enumerate(rows):
        fields=['path:Bin','name:'+name,'md5:'+hashlib.md5(digest_input).hexdigest()]
        if old:fields.append('old_name:'+old)
        manifest.append(operation+'\n{\n'+'\n'.join(fields)+'\n}')
        packages.append({'blockOrdinal':ordinal,'path':'/cg50/Bin/'+name+'.bz2','hex':archive(name,payload).hex()})
    value={'schema':'moli.launcher-v28.original-ui-patch.v1','source':'Entirely original text bytes and filenames; Pythonzipfile/zlib/hashlib reference. No official assets.','manifest_hex':''.join(manifest).encode().hex(),'packages':packages,
        'expected_files':[{'path':'Bin/GraphicInfo_8.bin','hex':final.hex(),'md5':hashlib.md5(final).hexdigest()}]}
    Path(__file__).with_name('original-ui-patch.json').write_text(json.dumps(value,indent=2)+'\n');print('Original sequential UI ZIP fixture generated.')
if __name__=='__main__':main()
