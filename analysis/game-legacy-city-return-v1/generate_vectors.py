"""Independent triangular displacement oracle for the fixed type15 routine."""
from hashlib import sha256
import json
from pathlib import Path
import struct


width, height = 640, 480
capture = bytes(v for y in range(height) for x in range(width)
                for v in ((x * 3 + y * 7) & 255, (x * 11 + y * 5) & 255, (x ^ y) & 255, 255))
distances = [min(y, height - y) for y in range(height)]
ages = [0] * height


def positions():
    return [y + (-1 if y <= height // 2 else 1) * age * (age + 1) for y, age in enumerate(ages)]


count = 0
while abs(positions()[241]) <= 640:
    ages = [age + int(distance < count) for age, distance in zip(ages, distances)]
    count += 8 if count < 241 else 0

frames = []
for call in range(1, 81):
    ages = [age - int(distance < count) for age, distance in zip(ages, distances)]
    rows = positions()
    assert min(ages) >= 0
    if rows[240] >= 240:
        count = max(0, count - 8)
    result = bytearray(len(capture))
    stride = width * 4
    for y, dest in enumerate(rows):
        if 0 <= dest < height:
            result[dest * stride:(dest + 1) * stride] = capture[y * stride:(y + 1) * stride]
    frames.append(dict(call=call, counter=count, complete=rows[0] >= 0,
                       rows_sha256=sha256(struct.pack('<480h', *rows)).hexdigest(),
                       rgba_sha256=sha256(result).hexdigest()))
    if frames[-1]['complete']:
        break
assert len(frames) == 49 and rows == list(range(height))
summary = dict(type=15, source_sha256='37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',
               authority='Independent age and triangular displacement model for the fixed PE with synthetic pixels',
               capture_sha256=sha256(capture).hexdigest(), frames=frames)
Path(__file__).with_name('original-vectors.json').write_text(json.dumps(summary, indent=2) + '\n')
