#!/usr/bin/env python3
"""Original MAP01 maps, clipping/patch/checksum oracle, and a synthetic map exchange."""
from pathlib import Path
import json
import random
import struct

HERE=Path(__file__).resolve().parent
ALPHABET=b'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
def integer(n):
    sign=b'-' if n<0 else b'';n=abs(n);out=b''
    while True:
        n,digit=divmod(n,62);out=ALPHABET[digit:digit+1]+out
        if n==0:return sign+out
def map_bytes(width,height):
    header=b'MAP\1'+struct.pack('<4I',0x12345678,0x90abcdef,width,height)
    planes=[[((i*1877+p*14903)^((i%7)<<13))&0xffff for i in range(width*height)] for p in range(3)]
    return header+b''.join(struct.pack('<{}H'.format(len(p)),*p) for p in planes)
def read(raw,rect):
    width,height=struct.unpack_from('<II',raw,12);x1,y1,x2,y2=rect
    planes=[]
    for p in range(3):
        values=[]
        for y in range(y1,y2):
            for x in range(x1,x2):values.append(struct.unpack_from('<H',raw,20+2*(p*width*height+y*width+x))[0] if 0<=x<width and 0<=y<height else 0)
        planes.append(values)
    return planes
def checksum(raw):
    # Polynomial long division, independent of the product's shift-register implementation.
    remainder=0
    for byte in raw:
        remainder=(remainder<<8)^int('{:08b}'.format(byte)[::-1],2)
        for bit in range(23,15,-1):
            if remainder&(1<<bit):remainder^=0x11021<<(bit-16)
    return remainder
def checks(raw,rect,mode):
    output=[]
    for p,values in enumerate(read(raw,rect)):
        if p==2:values=[v&(0x1ff if mode==1 else 0xfff) for v in values]
        data=struct.pack('<{}H'.format(len(values)),*values)
        output.append(checksum((data+b'\0'*1458)[:1458]))
    return output
def number(raw):
    value=0;sign=1
    for char in raw:
        value=(value*62)&0xffffffff
        if char==45:sign=-1
        elif char in ALPHABET:value=(value+ALPHABET.index(char))&0xffffffff
        else:return 0
    return (value*sign)&0xffff
def split(raw,separator,maximum=None):
    raw=raw.split(b'\0',1)[0];output=[];at=0;start=0
    while at<len(raw):
        if raw[at]>=128:at+=2;continue
        if raw[at]==separator:
            output.append(raw[start:at]);start=at+1
            if maximum and len(output)==maximum:return output,len(raw)-start
        at+=1
    return output+[raw[start:]],0
def decode(raw):
    outer,ignored=split(raw,124,3)
    return [[number(token) for token in split(plane,44)[0]] for plane in outer],ignored
def apply(raw,rect,planes):
    result=bytearray(raw);width,height=struct.unpack_from('<II',raw,12);x1,y1,x2,y2=rect;written=0
    for y in range(y1,y2):
        for x in range(x1,x2):
            if not (0<=x<width and 0<=y<height):continue
            written+=1;source=(y-y1)*(x2-x1)+x-x1
            for p in range(3):struct.pack_into('<H',result,20+2*(p*width*height+y*width+x),planes[p][source]|(0xc000 if p==2 else 0))
    return bytes(result),written
def main():
    rng=random.Random(155);raw=map_bytes(29,30)
    rectangles=[[0,0,27,27],[-2,-1,3,4],[26,28,31,33],[-100,-100,-97,-97],[50,50,53,53],[0,0,1,1],[1,1,30,31],[0,0,51,51]]
    for unused in range(24):
        x,y=rng.randrange(-8,35),rng.randrange(-8,35);rectangles.append([x,y,x+rng.randrange(1,10),y+rng.randrange(1,10)])
    reads=[dict(rectangle=r,planes=read(raw,r),checksums=[dict(mode=mode,values=checks(raw,r,mode)) for mode in [0,1,-7]]) for r in rectangles]
    small=map_bytes(5,4);patches=[];tokens=[b'',b'0',b'-1',b'1-',b'--1',b'a-b',b'!',b'Z',b'10000000000000000000000',b'\x81,',b'\x81|']
    for index,r in enumerate([[-1,-1,3,2],[3,2,7,6],[0,0,5,4],[9,9,11,11],[0,0,1,1]]):
        area=(r[2]-r[0])*(r[3]-r[1]);sections=[b','.join(tokens[(i+p+index)%len(tokens)] for i in range(area)) for p in range(3)]
        data=b'|'.join(sections)+b'|ignored-extra\x81';planes,ignored=decode(data);updated,written=apply(small,r,planes)
        patches.append(dict(rectangle=r,dataHex=data.hex(),planes=planes,ignoredOuterBytes=ignored,updatedHex=updated.hex(),writtenCells=written))
    rect=[-1,-1,3,2];count=(rect[2]-rect[0])*(rect[3]-rect[1]);plane_values=[[(i*103+p*70+11)&0xffff for i in range(count)] for p in range(3)]
    data=b'|'.join(b','.join(integer(value) for value in plane) for plane in plane_values);updated,written=apply(small,rect,plane_values)
    first=[9,23]+rect+[0,0,0];last=[7,23]+rect+checks(updated,rect,1)
    def message(tag,values):return tag+b' '+b' '.join(integer(v) for v in values)+b' '
    protocol=dict(identity=[7,23],mode=1,rectangle=rect,cacheHex=small.hex(),updatedHex=updated.hex(),writtenCells=written,
      initialNotice=first,finalNotice=last,noticeHex=message(b'=]M',first).hex(),patchHex=(message(b'=mJ',[7,23]+rect)+data+b' ').hex(),
      finalNoticeHex=message(b'=]M',last).hex(),unavailableHex=(message(b'=mJ',[8,23,0,0,1,1])+b'not-map-data ').hex(),requestHex=message(b'!hM',first[:6]).hex())
    source_bootstrap=json.loads((HERE.parent/'game-legacy-message-v1/original-vectors.json').read_text())['bootstrap'][0]
    vectors=dict(schema='moli.original-legacy-map-vectors-stage155.v1',origin='original synthetic data; no source assets, keys or sessions',
      mapHex=raw.hex(),rectangleCases=reads,smallMapHex=small.hex(),patchCases=patches,protocol=protocol,bootstrap=source_bootstrap,
      primitive=[dict(hex=b.hex(),value=checksum(b)) for b in [b'',b'123456789',bytes(range(256)),b'\xff'*1458,b'\0'*1458]])
    (HERE/'original-vectors.json').write_text(json.dumps(vectors,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(dict(rectangles=len(reads),checksum_cases=len(reads)*3,patches=len(patches),primitive=len(vectors['primitive']),original=True)))
if __name__=='__main__':main()
