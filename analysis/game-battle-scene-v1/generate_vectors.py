#!/usr/bin/env python3
"""Independent pointer-sort and indexed-pixel reference; original synthetic files only."""
from pathlib import Path
import hashlib
import json
import random
import struct
import sys

sys.setrecursionlimit(10000)  # Independent recursive oracle includes4096 equal-key native-sort cases.

A = Path(__file__).resolve().parent
B = json.loads((A.parent / 'game-battle-body-v1/original-vectors.json').read_text())
BASE = json.loads((A.parent / 'game-resource-runtime-v1/original-vectors.json').read_text())


def pointer_sort(rows):
    # Independently use source byte-address ranges, not JS array-index partition arithmetic.
    memory = {4 * i: row for i, row in enumerate(rows)}

    def cmp(a, b):
        a, b = memory[a], memory[b]
        ay = a['alternateY'] if a['flags'] & 0x800000 else a['y']
        by = b['alternateY'] if b['flags'] & 0x800000 else b['y']
        if ay < by:
            return -1
        if ay > by:
            return 1
        return -1 if a['depthKey'] < b['depthKey'] else 1

    def swap(a, b):
        memory[a], memory[b] = memory[b], memory[a]

    def region(first, last):
        count = (last - first) // 4 + 1
        if count <= 8:
            while first < last:
                best = first
                for cursor in range(first + 4, last + 1, 4):
                    if cmp(cursor, best) > 0:
                        best = cursor
                swap(best, last)
                last -= 4
            return
        swap(first + (count // 2) * 4, first)
        low, high = first, last + 4
        while True:
            low += 4
            while low <= last and cmp(low, first) <= 0:
                low += 4
            high -= 4
            while high > first and cmp(high, first) >= 0:
                high -= 4
            if low > high:
                break
            swap(low, high)
        swap(first, high)
        if first + 4 < high:
            region(first, high - 4)
        if low < last:
            region(low, last)

    if len(rows) > 1:
        region(0, 4 * (len(rows) - 1))
    return [memory[4 * i]['id'] for i in range(len(rows))]


FILES = {row['path']: bytes.fromhex(row['bytesHex']) for row in BASE['files']}
FILES.update({row['path']: bytes.fromhex(row['bytesHex']) for row in B['files']})
INFO = FILES['Bin/GraphicInfo.bin']
IMAGES = {}
for at in range(0, len(INFO), 40):
    index, offset, size, ox, oy, width, height = struct.unpack_from('<IIIiiii', INFO, at)
    resource = struct.unpack_from('<I', INFO, at + 36)[0]
    data = FILES['Bin/Graphic.bin'][offset:offset + size]
    assert data[:2] == b'RD' and data[2] in [0, 2] and struct.unpack_from('<ii', data, 4) == (width, height)
    head = 20 if data[2] == 2 else 16
    pixels = data[head:head + width * height]
    embedded = data[head + width * height:] if data[2] == 2 else None
    IMAGES[index] = dict(index=index, resource=resource, origin=[ox, oy], width=width,
                         height=height, pixels=pixels, embedded=embedded)
PALETTE = FILES['Bin/pal/palet_00.cgp']


def rgba_color(index, neutral, embedded=None):
    if index == 0 or index == 168 and not neutral:
        return None
    at = (index if embedded is not None else index - 16) * 3
    b, g, r = (embedded if embedded is not None else PALETTE)[at:at + 3]
    if (neutral or embedded is not None) and r == g == b == 0:
        b = 1
    elif r == g == b == 0:
        return None
    return bytes([r, g, b, 255])


def short(value):
    return ((value + 32768) & 65535) - 32768


def raster(commands, width=640, height=480):
    pixels = bytearray(width * height * 4)
    for ordinal in sorted(range(len(commands)), key=lambda i: (commands[i]['priority'], -i)):
        c = commands[ordinal]
        image = IMAGES[c['index']]
        x0, y0 = short(c['x']), short(c['y'])
        iw, ih = image['width'], image['height']
        scale=c.get('scale',[1.,1.]);dw=int(x0+iw*scale[0])-x0;dh=int(y0+ih*scale[1])-y0
        for y in range(max(0, y0), min(height, y0 + dh)):
            sy=(y-y0)*ih//dh;sy=ih-1-sy if c['flags']&2 else sy
            for x in range(max(0, x0), min(width, x0 + dw)):
                sx=(x-x0)*iw//dw;sx=iw-1-sx if c['flags']&1 else sx
                color = rgba_color(image['pixels'][(ih - 1 - sy) * iw + sx], bool(c['flags'] & 4), image['embedded'])
                if color:
                    p = (y * width + x) * 4
                    pixels[p:p + 4] = color
    return hashlib.sha256(pixels).hexdigest()


def frame_reference(trace, frame):
    nodes = frame['nodes']
    depth = pointer_sort([dict(id=n['id'], y=n['screen'][1], alternateY=0, flags=n['actorFlags'],
                               depthKey=0) for n in nodes if n['actorFlags'] & 0x20000])
    priorities = {node: (i + 9) & 255 for i, node in enumerate(depth)}
    commands, skipped = [], []
    for node in nodes:
        flags, animation = node['actorFlags'], node['animation']
        reason = None
        if flags & 0x8000:
            reason = 'renderer-filter'
        elif animation['graphicIndex'] == -1:
            reason = 'graphic-missing'
        elif node['deleted']:
            reason = 'deleted'
        elif flags & 2:
            reason = 'hidden'
        if reason:
            skipped.append(dict(id=node['id'], reason=reason))
            continue
        scale = frame.get('scale', [1.0, 1.0]) if node['kind'] == 'body' else [1.0, 1.0]
        override = node['kind'] != 'body' or 0x1af0d < animation['lastResource'] < 0x1af26
        draw_flags = animation['drawFlags'] | (4 if override else 0)
        if flags & 0x100000 or draw_flags & ~7 or animation['color'] != 0xffffffff:
            return dict(unavailable='LEGACY_BATTLE_FRAME_DRAW_STYLE')
        priority = priorities.get(node['id'], 9 if node['kind'] in ['body', 'status'] else
                                  200 if node['kind'] in ['death', 'indicator'] else 204)
        commands.append(dict(id=node['id'], kind=node['kind'], index=animation['graphicIndex'],
                             flags=draw_flags, x=node['screen'][0] + int(animation['drawOffsetX']*scale[0]),
                             y=node['screen'][1] + int(animation['drawOffsetY']*scale[1]), priority=priority, **({'scale':scale} if scale != [1.0,1.0] else {})))
    bg = next(image for image in IMAGES.values() if image['resource'] == 1000)
    commands.append(dict(id=None, kind='background', index=bg['index'], flags=0,
                         x=320 + bg['origin'][0], y=240 + bg['origin'][1], priority=0))
    return dict(depthOrder=depth, commands=commands, skipped=skipped, rgbaSha256=raster(commands),
                drawOrder=[commands[i]['id'] for i in sorted(range(len(commands)),
                           key=lambda i: (commands[i]['priority'], -i))])


def main():
    rng = random.Random(184)
    sorts = []
    for count in [0, 1, 2, 7, 8, 9, 17, 22, 255, 256, 300, 4096]:
        for variant in range(3):
            rows = [dict(id=i + 1, y=rng.randint(-500, 500) if variant else 42,
                         alternateY=rng.randint(-500, 500), flags=0x800000 if variant == 2 and i % 2 else 0,
                         depthKey=rng.choice([-32768, -1, 0, 1, 32767]) if variant else 0)
                    for i in range(count)]
            sorts.append(dict(rows=rows, expected=pointer_sort(rows)))
    traces = [dict(name=trace['name'], frames=[frame_reference(trace, frame) for frame in trace['frames']])
              for trace in B['traces']]
    frames = [frame for trace in traces for frame in trace['frames']]
    counts = dict(sort_cases=len(sorts), body_frame_cases=len(frames),
                  pixel_frames=sum('rgbaSha256' in frame for frame in frames),
                  explicit_unavailable_frames=sum('unavailable' in frame for frame in frames))
    out = dict(schema='moli.original-battle-frame-stage196-revision.v1', original_synthetic_only=True,
               authority='independent Python pointer-sort/indexed-pixel reference; stage196 source49 correction, captured selector0 and portable nearest policy; driver pixel equivalence unverified; no product imports',
               source_trace='../game-battle-body-v1/original-vectors.json', width=640, height=480,
               background=1000, sorts=sorts, traces=traces, counts=counts)
    (A / 'original-vectors.json').write_text(json.dumps(out, indent=2) + '\n')
    print(json.dumps(counts))


if __name__ == '__main__':
    if '--oracle' in sys.argv:
        for line in sys.stdin:
            request = json.loads(line)
            print(json.dumps(frame_reference(request['trace'], request['frame'])), flush=True)
    else:
        main()
