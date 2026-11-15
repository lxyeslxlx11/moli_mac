#!/usr/bin/env python3
"""Independent Python codecs references and original scalar cases. No game/account input or I/O."""
from pathlib import Path
import hashlib
import json
import struct

def main():
    groups=[]
    for lead in range(0x81,0xff):
        digest=hashlib.sha256();defined=0;unassigned=0
        for trail in range(0x40,0xff):
            if trail==0x7f:continue
            encoded=bytes([lead,trail])
            try:text=encoded.decode('gbk','strict')
            except UnicodeDecodeError:unassigned+=1;continue
            assert len(text)==1 and text.encode('gbk','strict')==encoded
            digest.update(encoded+struct.pack('>I',ord(text)));defined+=1
        groups.append({'lead':lead,'defined':defined,'unassigned':unassigned,'sha256':digest.hexdigest()})
    points=[0x20,0x7e,0xa0,0x7ff,0x800,0xd7ff,0xe000,0xfeff,0xfffd,0xffff,0x10000,0x1f600,0x10ffff]
    seed=0x13579bdf
    while len(points)<1037:
        seed=(1664525*seed+1013904223)&0xffffffff
        point=seed%0x110000
        if point<0x20 or 0x7f<=point<=0x9f or 0xd800<=point<=0xdfff or point in points:continue
        points.append(point)
    digest=hashlib.sha256()
    for point in points:
        encoded=chr(point).encode('utf-8','strict')
        assert encoded.decode('utf-8','strict')==chr(point)
        digest.update(struct.pack('>I',point)+bytes([len(encoded)])+encoded)
    result={'schema':'moli.launcher-v20.encoding-reference.v1','producer':'Python3 stdlib gbk/utf-8 strict codecs + hashlib/struct; independent of JavaScript table/codec implementation',
            'windows936_double_groups':groups,'double_entries':sum(g['defined'] for g in groups),'unassigned_pairs':sum(g['unassigned'] for g in groups),
            'single_byte_euro':{'byte':128,'scalar':0x20ac,'authority':'Pinned Microsoft CP9362.01 table; Python gbk deliberately rejects80.'},
            'utf8_scalar_points':points,'utf8_sha256':digest.hexdigest(),'unicode_normalization':'none'}
    path=Path(__file__).with_name('encoding-reference.json');path.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'double_entries':result['double_entries'],'unassigned_pairs':result['unassigned_pairs'],'utf8_original_scalars':len(points),'output_sha256':hashlib.sha256(path.read_bytes()).hexdigest()}))

if __name__=='__main__':main()
