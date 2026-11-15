#!/usr/bin/env python3
"""Original envelope vectors using Python struct; no captured/game payloads."""
from pathlib import Path
import hashlib
import json
import random
import struct

randomizer = random.Random(152)
payloads = [b'', b'\0', b'AB', b'\xaf\xef', b'\xef\xaf', b'\xaf\xef\x00\x80\xef\xaf',
            bytes(range(256)), bytes((i*31+7)&255 for i in range(32767))]
payloads += [bytes(randomizer.randrange(256) for _ in range(n)) for n in [3,4,5,7,8,15,16,31,32,63,64,127,128,255,257,511]]
vectors = []
for index, raw in enumerate(payloads):
    frame = b'\xaf\xef'+struct.pack('<H', len(raw))+raw+b'\xef\xaf'
    vectors.append(dict(id='original-%02d'%index, payloadHex=raw.hex(), frameHex=frame.hex(),
                        payloadBytes=len(raw), payloadSha256=hashlib.sha256(raw).hexdigest()))
result = dict(schema='moli.original-envelope-vectors.v1', generator='Python stdlib struct/random/hashlib',
              original_synthetic_only=True, vectors=vectors)
Path(__file__).with_name('original-vectors.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(dict(vectors=len(vectors), maximum_payload=max(map(len,payloads)))))
