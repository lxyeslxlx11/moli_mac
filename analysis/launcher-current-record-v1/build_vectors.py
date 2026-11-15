"""Independent current-record oracle; only original public test keys and bytes."""
from pathlib import Path
import json,struct,hashlib
import Crypto
from Crypto.Cipher import Blowfish
ROOT=Path(__file__).parent

def wordswap(data):
    assert len(data)%4==0
    return b''.join(data[i:i+4][::-1]for i in range(0,len(data),4))

def encrypted(key,padded):
    return wordswap(Blowfish.new(key,Blowfish.MODE_ECB).encrypt(wordswap(padded)))

def record(key,plain):
    length=((len(plain)+7)//8)*8+8
    return struct.pack('>II',length,len(plain))+encrypted(key,plain+bytes(length-len(plain)))

def build():
    rows=[];keys=[bytes(range(8)),bytes(8),bytes([255])*8]
    for ordinal,length in enumerate([0,1,7,8,9,15,16,23,24,31,32,47,255]):
        plain=bytes((i*37+ordinal)%256 for i in range(length))
        if length>7:plain=plain[:-4]+bytes(4)
        key=keys[ordinal%3]
        rows.append({'name':'original-current-length-'+str(length),'public_fixture_key_hex':key.hex(),
                     'plaintext_hex':plain.hex(),'record_hex':record(key,plain).hex()})
    maximum=bytes(i*29%256 for i in range(0x7fc8));maximum_record=record(keys[0],maximum)
    cases=[{'name':'native-zero-cipher-record','public_fixture_key_hex':keys[0].hex(),
            'record_hex':struct.pack('>II',0,0).hex(),'plaintext_hex':''}]
    # Native receive accepts a declared prefix and does not enforce its writer's padding rule.
    cases.append({'name':'nonzero-padding-preserves-zero-suffix','public_fixture_key_hex':keys[0].hex(),
                  'record_hex':(struct.pack('>II',8,3)+encrypted(keys[0],b'A\0\0'+b'\xa5'*5)).hex(),
                  'plaintext_hex':'410000'})
    cases.append({'name':'older-floor-record-is-still-decodable','public_fixture_key_hex':keys[0].hex(),
                  'record_hex':(struct.pack('>II',8,1)+encrypted(keys[0],b'A'+bytes(7))).hex(),
                  'plaintext_hex':'41'})
    dh=json.loads((ROOT.parent/'launcher-current-channel-v1/original-vectors.json').read_text())
    old=json.loads((ROOT.parent/'launcher-v8/original-login-vectors.json').read_text())
    empty=next(v for v in old['profiles']if v['expected']['disposition']=='no-profiles')
    body=bytes.fromhex(empty['body_hex']);reply=struct.pack('>H',len(body))+body
    username=b'FixtureU';password=b'FixtureP'
    request=b'\x0a'+struct.pack('>I',7)+bytes([len(username)])+username+bytes([len(password)])+password+struct.pack('>I',11)
    request=struct.pack('>H',len(request))+request
    exchange=[]
    for v in dh['valid']:
        key=bytes.fromhex(v['public_fixture_key_hex'])
        exchange.append({'name':v['name'],'public_fixture_key_hex':key.hex(),
                         'public_fixture_exponent_hex':v['public_fixture_exponent_hex'],
                         'challenge_hex':v['challenge_hex'],'public_message_hex':v['expected_public_message_hex'],
                         'request_frame_hex':request.hex(),'request_record_hex':record(key,request).hex(),
                         'empty_reply_record_hex':record(key,reply).hex()})
    return {'schema':'moli.current-record.original-vectors.v1','synthetic_only':True,
            'oracle':'Python struct and PyCryptodome '+Crypto.__version__+' Blowfish ECB with each32-bit word reversed around standard ECB',
            'records':rows,'decode_only':cases,'maximum':{'plaintext_bytes':len(maximum),'pattern_multiplier':29,
            'public_fixture_key_hex':keys[0].hex(),'record_bytes':len(maximum_record),
            'record_sha256':hashlib.sha256(maximum_record).hexdigest()},'flow_exchanges':exchange}

if __name__=='__main__':
    data=build();(ROOT/'original-vectors.json').write_text(json.dumps(data,indent=2)+'\n')
    print(json.dumps({'records':len(data['records']),'decode_only':len(data['decode_only']),
                      'exchanges':len(data['flow_exchanges']),'pycryptodome':Crypto.__version__}))
