#!/usr/bin/env python3
"""Independent original vectors: Python hashlib/hmac plus system OpenSSL CBC.

Needs the user's fixed local source solely to read the128-byte protocol constant.
No captured credential, ciphertext or session is used. Keys, headers and messages
are original synthetic data. Normal CI consumes the generated public vectors.
"""
from pathlib import Path
import hashlib
import hmac
import json
import random
import subprocess

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
SOURCE = ROOT/'build/analysis/game-release-current-v1/legacy-members/cg_se_6000.exe'
P = [7,2,5,1,6,3,0,4]
Q = [6,3,1,5,7,2,4,0]


def load_parameter():
    source = SOURCE.read_bytes()
    assert hashlib.sha256(source).hexdigest() == '37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd'
    parameter = source[1248780:1248908]
    assert hashlib.sha256(parameter).hexdigest() == json.loads((HERE/'implementation-spec.json').read_text())['fixed_parameter']['sha256']
    return parameter


def encode(raw, key):
    output = bytearray(((len(raw)+7)//8)*8)
    for at in range(len(output)):
        value = raw[at] if at < len(raw) else 0x11
        output[(at//8)*8+P[at%8]] = 0 if value == 0 else value ^ key[at%64]
    return bytes(output)


def decode(raw, key):
    assert len(raw) > 0 and len(raw)%8 == 0
    output = bytearray(len(raw))
    for at,value in enumerate(raw):
        position = (at//8)*8+Q[at%8]
        output[position] = value ^ key[position%64]
    removed = 0
    while removed < 8 and output[-removed-1] == 0x11:
        removed += 1
    return bytes(output[:len(output)-removed])


def bootstrap(header, key, parameter):
    material = header+bytes(16)
    for _ in range(8192):
        material = hashlib.sha256(material+parameter).digest()
    cipher = subprocess.run(['/usr/bin/openssl','enc','-aes-256-cbc','-e','-nopad',
                             '-K',material.hex(),'-iv',header.hex()],input=key,
                            stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout
    assert len(cipher) == 64
    return header+cipher+hmac.new(material,cipher,hashlib.sha256).digest()


def main():
    parameter = load_parameter()
    rng = random.Random(153)
    keys = [b'A'*64,bytes(range(1,65)),bytes((i*37+11)%255+1 for i in range(64)),
            (b'OriginalSyntheticKey153-'*3)[:64]]
    payloads = [b'',b'A',b'AB',b'\0',b'\0AB\0',b'\x11',b'\x11'*8,b'\x11'*16,bytes(range(256)),
                b'original payload\x11',b'original payload'+b'\x11'*9]
    payloads += [bytes(rng.randrange(256) for _ in range(n)) for n in [7,8,9,15,16,17,63,64,65,127,128,129]]
    payloads += [bytes((i%200)+33 for i in range(32760))]
    normal = []
    for index, raw in enumerate(payloads):
        key = keys[index%len(keys)];wire = encode(raw,key)
        normal.append(dict(id='original-%02d'%index,keyHex=key.hex(),plainHex=raw.hex(),wireHex=wire.hex(),
                           decodedHex=decode(wire,key).hex() if wire else None))
    bootstraps = []
    for index in range(6):
        header = bytearray(rng.randrange(256) for _ in range(16));header[-1] &= 0xf0
        key = keys[index%len(keys)];probe = b'original bootstrap probe-'+bytes([65+index])
        bootstraps.append(dict(id='original-bootstrap-%d'%index,keyHex=key.hex(),
                               payloadHex=bootstrap(bytes(header),key,parameter).hex(),probePlainHex=probe.hex(),probeWireHex=encode(probe,key).hex()))
    invalid = []
    for label,key,nibble in [('nul-key',bytes(64),0),('partial-result',keys[0],3)]:
        header = bytearray(rng.randrange(256) for _ in range(16));header[-1] = (header[-1]&0xf0)|nibble
        invalid.append(dict(id=label,payloadHex=bootstrap(bytes(header),key,parameter).hex(),
                            expectedCode='LEGACY_GAME_PAYLOAD_KEY' if label=='nul-key' else 'LEGACY_GAME_BOOTSTRAP_FORMAT'))
    arbitrary = []
    for index,n in enumerate([8,16,24,64,72]):
        key = keys[index%len(keys)];wire = bytes(rng.randrange(256) for _ in range(n))
        arbitrary.append(dict(keyHex=key.hex(),wireHex=wire.hex(),decodedHex=decode(wire,key).hex()))
    version = subprocess.run(['/usr/bin/openssl','version'],capture_output=True,check=True,text=True).stdout.strip()
    result = dict(schema='moli.original-game-payload-vectors.v1',original_synthetic_only=True,
                  generator=dict(python='stdlib hashlib/hmac/random',aes=version,cbc_padding='disabled'),
                  fixed_parameter_sha256=hashlib.sha256(parameter).hexdigest(),normal=normal,
                  bootstrap=bootstraps,invalidBootstrap=invalid,arbitraryWire=arbitrary)
    (HERE/'original-vectors.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(dict(normal=len(normal),bootstrap=len(bootstraps),invalidBootstrap=len(invalid),arbitrary=len(arbitrary))))


if __name__ == '__main__':
    main()
