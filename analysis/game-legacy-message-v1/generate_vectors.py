#!/usr/bin/env python3
"""Original independent message/field/protocol vectors. No game or captured session required."""
from pathlib import Path
import json
import random
import struct

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
ALPHABET=b'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
P=[7,2,5,1,6,3,0,4]
Q=[6,3,1,5,7,2,4,0]
def prefix(value):return value.split(b'\0',1)[0]
def integer(value):
    negative=value<0;value=abs(value);digits=b''
    while True:
        value,digit=divmod(value,62);digits=bytes([ALPHABET[digit]])+digits
        if not value:return (b'-' if negative else b'')+digits
def int32(value):return ((value+2**31)%2**32)-2**31
def read_integer(raw):
    raw=prefix(raw);sign=-1 if raw.startswith(b'-') else 1
    if sign<0:raw=raw[1:]
    value=0
    for byte in raw:
        if byte not in ALPHABET:return 0
        value=int32(value*62+ALPHABET.index(byte))
    return int32(value*sign)
def escape(raw):
    raw=prefix(raw);result=bytearray();at=0;mapping={92:b'\\\\',32:b'\\S',10:b'\\n',13:b'\\r'}
    while at<len(raw):
        byte=raw[at];at+=1
        if byte>=128:
            if at==len(raw):raise ValueError('Dangling source byte pair')
            second=raw[at];at+=1;result.extend([byte,102 if second in mapping else second])
        else:result.extend(mapping.get(byte,bytes([byte])))
    return bytes(result)
def unescape(raw):
    raw=prefix(raw);result=bytearray();at=0;mapping={83:32,110:10,114:13}
    while at<len(raw):
        byte=raw[at];at+=1
        if byte>=128:
            if at==len(raw):raise ValueError('Dangling source byte pair')
            result.extend([byte,raw[at]]);at+=1
        elif byte==92 and at<len(raw):result.append(mapping.get(raw[at],92));at+=1
        else:result.append(byte)
    return bytes(result)
def message(spec,values):
    assert len(spec['fields'])==len(values)
    return spec['tag'].encode('ascii')+b' '+b''.join((integer(value) if kind=='int32' else escape(value))+b' ' for kind,value in zip(spec['fields'],values))
def encoded(value):return value if isinstance(value,int) else {'bytesHex':value.hex()}
def decoded(value):return value if isinstance(value,int) else {'bytesHex':unescape(escape(value)).hex()}
def payload_encode(raw,key):
    output=bytearray(((len(raw)+7)//8)*8)
    for at in range(len(output)):
        byte=raw[at] if at<len(raw) else 17;output[(at//8)*8+P[at%8]]=0 if byte==0 else byte^key[at%64]
    return bytes(output)
def payload_decode(raw,key):
    assert raw and len(raw)%8==0;output=bytearray(len(raw))
    for at,byte in enumerate(raw):
        position=(at//8)*8+Q[at%8];output[position]=byte^key[position%64]
    removed=0
    while removed<8 and output[-removed-1]==17:removed+=1
    return bytes(output[:len(output)-removed])
def frame(raw):return b'\xaf\xef'+struct.pack('<H',len(raw))+raw+b'\xef\xaf'
def binary(parts,four=False,trailing=b''):
    assert len(parts)==(4 if four else 1)
    return (b']^i' if four else b']Pk')+b''.join(struct.pack('<H',len(part)) for part in parts)+b''.join(parts)+trailing

def main():
    catalog=json.loads((HERE/'dispatch-catalog.json').read_text());rng=random.Random(154)
    writer_values=[0,1,-1,61,62,-61,-62,63,3843,3844,-3844,2147483647,-2147483647]+[rng.randrange(-2147483647,2147483648) for _ in range(100)]
    integer_writes=[dict(value=value,hex=integer(value).hex()) for value in writer_values]
    raw_values=[bytes([byte]) for byte in range(256)]+[b'',b'-',b'+1',b'1!',b'-ZZZZZZ',b'Z'*200,b'-'+b'Z'*200,integer(-2147483648),b'1\0ignored']
    integer_reads=[dict(hex=raw.hex(),value=read_integer(raw)) for raw in raw_values]
    fields=[bytes([byte]) for byte in range(128)]
    fields += [bytes([first,second]) for first in range(128,256) for second in [32,92,10,13,65,128,255]]
    fields += [b'original field\\with spaces\n\r',b'A\0unread',b'\\q',b'\\',b'\\S',b'\x81\x5c\x82\x40']
    field_vectors=[dict(rawHex=raw.hex(),escapedHex=escape(raw).hex(),decodedHex=unescape(escape(raw)).hex()) for raw in fields]
    unescape_values=[b'\\q',b'\\S',b'\\n',b'\\r',b'\\\\',b'\\',b'abc\0tail',b'\x81\x5c\\S']
    unescape_vectors=[dict(hex=raw.hex(),decodedHex=unescape(raw).hex()) for raw in unescape_values]
    directions={}
    for direction in ['incoming','outgoing']:
        rows=[]
        for index,spec in enumerate(catalog[direction]):
            values=[]
            for field,kind in enumerate(spec['fields']):
                if kind=='int32':values.append(writer_values[(index+field)%len(writer_values)])
                else:values.append(('original_%d_%d'%(index,field)).encode()+b' \\\n\r\x81\x5c')
            raw=message(spec,values)
            rows.append(dict(id=spec['id'],values=[encoded(value) for value in values],plainHex=raw.hex(),decoded=[decoded(value) for value in values]))
        directions[direction]=rows
    binary_values=[binary([b'',b'original-a',bytes(range(8)),b'\x80\0\xff'],True,b'ignored'),binary([b'original-binary\0\xff'],False,b'ignored'),binary([b'',b'',b'',b''],True),binary([b''],False)]
    binaries=[]
    for raw in binary_values:
        four=raw[:3]==b']^i';count=4 if four else 1;header=3+2*count;lengths=struct.unpack('<'+'H'*count,raw[3:header]);at=header;parts=[]
        for size in lengths:parts.append(raw[at:at+size].hex());at+=size
        binaries.append(dict(hex=raw.hex(),segments=parts,trailingBytes=len(raw)-at))
    boot=json.loads((ROOT/'analysis/game-legacy-transform-v1/original-vectors.json').read_text())['bootstrap'][:2]
    pose=next(r for r in catalog['incoming'] if r['consumer']=='0x4ef840');reset=next(r for r in catalog['incoming'] if r['action']=='reset-bootstrap')
    pending_pose=message(pose,[17,-29,6]);new_pose=message(pose,[2147483647,-2147483647,3]);new_scaled=[struct.unpack('<f',struct.pack('<f',value*64))[0] for value in [2147483647,-2147483647]]
    byte_spec=next(r for r in catalog['incoming'] if r['fields']==['bytes'] and r['action']=='dispatch')
    normal112=message(byte_spec,[b'A'*(105-len(byte_spec['tag'])-2)]);assert len(payload_encode(normal112,bytes.fromhex(boot[0]['keyHex'])))==112
    result=dict(schema='moli.original-legacy-message-vectors.v1',original_synthetic_only=True,integerWrites=integer_writes,integerReads=integer_reads,
                fields=field_vectors,unescape=unescape_vectors,incoming=directions['incoming'],outgoing=directions['outgoing'],binary=binaries,
                bootstrap=boot,protocol=dict(resetId=reset['id'],resetPlainHex=message(reset,[]).hex(),poseId=pose['id'],pendingPoseHex=pending_pose.hex(),newPoseHex=new_pose.hex(),
                    newPose=dict(coordinates=[2147483647,-2147483647],scaledCoordinates=new_scaled,facingCode=3),normal112PlainHex=normal112.hex(),normal112Operation=byte_spec['id']))
    (HERE/'original-vectors.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({key:len(result[key]) for key in ['integerWrites','integerReads','fields','unescape','incoming','outgoing','binary']}))

if __name__=='__main__':main()
