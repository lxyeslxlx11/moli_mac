"""Original exhaustive writer/reader vectors derived from the finite configuration contract, not copied file contents."""
import itertools
import json
from pathlib import Path
import re

NAMES = ['windowMode', 'onlyActive', 'soundOff', 'musicOff']
TOKENS = [b'windowmode', b'onlyactive', b'soundoff', b'musicoff']


def reference(data):
    read = data[:256]
    nul = read.find(b'\0')
    text = read if nul < 0 else read[:nul]
    found = text.find(b'3Ddevice:')
    if found < 0:
        return dict(error='GAME_CONFIG_DEVICE_MISSING')
    match = re.match(rb'[ \t\r\n\v\f]*([+-]?[0-9]+)', text[found + 9:])
    if not match:
        return dict(error='GAME_CONFIG_DEVICE_PARSE')
    device = int(match[1])
    if not -(2**31) <= device < 2**31:
        return dict(error='GAME_CONFIG_DEVICE_OVERFLOW')
    if not 1 <= device <= 4:
        return dict(error='GAME_CONFIG_DEVICE_RANGE')
    return dict(settings=dict(deviceCode=device, **{name: token in text for name, token in zip(NAMES, TOKENS)}),
                offsets=dict(device=found, **{name: text.find(token) for name, token in zip(NAMES, TOKENS)}),
                inputBytes=len(data), readBytes=len(read), textBytes=len(text), unreadBytes=len(data) - len(read),
                ignoredAfterNul=0 if nul < 0 else len(read) - nul - 1,
                boundary='bounded-read-end' if nul < 0 else 'nul-in-read')


writes = []
for device, bits in itertools.product(range(1, 5), itertools.product([False, True], repeat=4)):
    settings = dict(deviceCode=device, **dict(zip(NAMES, bits)))
    raw = b' 3Ddevice:' + str(device).encode() + b' ' + b''.join(token + b' ' for token, enabled in zip(TOKENS, bits) if enabled)
    writes.append(dict(settings=settings, hex=raw.hex(), expected=reference(raw)))

raws = [b'', b'windowmode soundoff', b'3ddevice:2', b'3Ddevice:', b'3Ddevice:+', b'3Ddevice:-1', b'3Ddevice:0', b'3Ddevice:5',
        b'3Ddevice:2147483647', b'3Ddevice:2147483648', b'3Ddevice:-2147483648', b'3Ddevice:-2147483649',
        b'3Ddevice:0x2', b'3Ddevice:1.5', b'3Ddevice:4tail', b'x3Ddevice:+0002notwindowmode soundoffice',
        b'3Ddevice:bad 3Ddevice:2', b'3Ddevice:4 3Ddevice:1', b'3Ddevice:2 WINDOWMODE Onlyactive SOUNDOFF MUSICOff',
        b'3Ddevice:\t\r\n\v\f +3 windowmode onlyactive soundoff musicoff',
        b'3Ddevice:' + b'0' * 240 + b'1', b'3Ddevice:1\0windowmode soundoff', b'\0 3Ddevice:1',
        b'3Ddevice:2' + b'x' * 260 + b'soundoff', b'3Ddevice:3\xffmusicoff', b'\xef\xbb\xbf3Ddevice:1 onlyactive',
        b' ' * 246 + b'3Ddevice:4', b' ' * 247 + b'3Ddevice:4', b' ' * 248 + b'3Ddevice:4',
        b'3Ddevice:1' + b'x' * 236 + b'windowmode', b'3Ddevice:1' + b'x' * 237 + b'windowmode']
reads = [dict(name='reader-' + str(i), hex=data.hex(), expected=reference(data)) for i, data in enumerate(raws)]
target = Path(__file__).with_name('original-vectors.json')
target.write_text(json.dumps(dict(schema='moli.original-game-config-vectors.v1', original_synthetic_only=True,
    writer=writes, reader=reads, native_undefined_states_rejected=True), indent=2) + '\n')
print(json.dumps(dict(writer=len(writes), reader=len(reads), minimumBytes=min(len(bytes.fromhex(row['hex'])) for row in writes),
                     maximumBytes=max(len(bytes.fromhex(row['hex'])) for row in writes), output=str(target))))
