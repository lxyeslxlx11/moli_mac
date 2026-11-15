"""Original independent minimap equations and padded native-pitch raster fixtures."""
from pathlib import Path
from hashlib import sha256
import json
import random
import struct

A = Path(__file__).resolve().parent
rng = random.Random(291)
digest = lambda b: sha256(b).hexdigest()


def raster(n, values, palette, marker):
    width, height = 4 * n + 2, 2 * n + 2
    pitch = width + 6
    words = [0] * (pitch * height)
    first = (n + 1) * pitch + 1
    row = first
    for y in range(n):
        pointer = row
        for x in range(n):
            value = values[y * n + x]
            color = palette[value] if palette is not None else value
            color = color or 1
            for at in [pointer - 1, pointer, pointer + 1, pointer - pitch]:
                words[at] = color
            pointer += 2 - pitch
        row += pitch + 2
    pointer = first + ((pitch + 2) * n) // 2 - ((pitch - 2) * n) // 2
    for at in [pointer - 1, pointer, pointer + 1, pointer - pitch]:
        words[at] = marker
    rgba = bytearray()
    for y in range(height):
        for color in words[y * pitch:y * pitch + width]:
            rgba.extend((color >> 16, color >> 8 & 255, color & 255, 255 if color else 0))
    return digest(rgba)


info = bytearray(120)
footprints = [(1, 1, 100), (3, 2, 100), (2, 4, 102)]
for i, (w, h, flags) in enumerate(footprints):
    struct.pack_into('<I', info, i * 40, 1000 + i)
    info[i * 40 + 28:i * 40 + 30] = bytes((w, h))
    struct.pack_into('<H', info, i * 40 + 30, flags)
    struct.pack_into('<I', info, i * 40 + 36, 1000 + i)
palette32 = [(i * 7919) & 0xffffff for i in range(256)]
colors = {1000: 21, 1001: 25, 1002: 42}
auto = bytes(v for y in range(64) for x in range(64) for v in ((x * 3 + y) & 255, (y * 7 + x) & 255, (x ^ y) * 3 & 255))
cases = []
for zoom, n in enumerate([107, 54, 27]):
    for mode in [0, 1, 2]:
        center = [0, 0] if zoom == 0 else [32, 32]
        origin = [v - n // 2 for v in center]
        planes = [[0] * (n * n) for _ in range(3)]
        for y in range(n):
            for x in range(n):
                at = y * n + x
                if not (0 <= origin[0] + x < 64 and 0 <= origin[1] + y < 64):
                    continue
                planes[0][at] = 1000 + (x + y) % 3
                planes[1][at] = 1001 if (x * 7 + y) % 19 == 0 else 1002 if (x + y * 5) % 23 == 0 else 0
                planes[2][at] = 0x4000 if (x + 2 * y) % 5 else 0
        grid = [0] * (n * n)
        for i, flags in enumerate(planes[2]):
            if flags & 0x4000:
                if mode == 1:
                    x, y = origin[0] + i % n, origin[1] + i // n
                    at = (y * 64 + x) * 3
                    grid[i] = int.from_bytes(auto[at:at + 3], 'big')
                else:
                    grid[i] = colors[planes[0][i]]
        if mode != 1:
            for y in range(n):
                for x in range(n):
                    at = y * n + x
                    resource = planes[1][at]
                    if not planes[2][at] & 0x4000 or not resource:
                        continue
                    w, h, flags = footprints[resource - 1000]
                    if flags % 100 == 0:
                        for dy in range(h):
                            for dx in range(w):
                                if 0 <= y - dy < n and 0 <= x + dx < n:
                                    grid[(y - dy) * n + x + dx] = colors[resource]
                    else:
                        grid[at] = colors[resource]
        encoded = struct.pack('<' + ('I' if mode == 1 else 'B') * len(grid), *grid)
        cases.append(dict(zoom=zoom, mode=mode, center=center, origin=origin, size=n,
            planesHex=[struct.pack('<' + 'H' * len(p), *p).hex() for p in planes],
            gridSha256=digest(encoded), rasters=[dict(marker=marker, rgbaSha256=raster(n, grid, palette32 if mode != 1 else None, marker)) for marker in [1, 0xffffff]]))
averages = []
for i in range(20):
    palette = bytes(rng.randrange(256) for _ in range(768))
    pixels = bytes([0] * 16) if i == 0 else bytes(rng.randrange(256) for _ in range(1 + i * 17))
    samples = [palette[v * 3:v * 3 + 3] for v in pixels if v]
    result = 0
    if samples:
        mean = [sum(v[c] for v in samples) // len(samples) for c in range(3)]
        result = min([0] + list(range(16, 240)), key=lambda index: sum((palette[index * 3 + c] - mean[c]) ** 2 for c in range(3)))
    averages.append(dict(paletteHex=palette.hex(), pixelsHex=pixels.hex(), expected=result))
ticks = [[0, 0], [0, 999], [0, 1000], [0, 1001], [1, 1001], [1, 1002], [0, 2000], [0, 2001], [1, 0xfffffff0], [1, 10], [1, 1001]]
phase, last = [0, 0], [0, 0]
clock = []
for mode, tick in ticks:
    color = 0xffffff if phase[mode] else 1
    if (last[mode] + 1000) & 0xffffffff <= tick:
        last[mode] = tick
        phase[mode] ^= 1
    clock.append(dict(mode=mode, tick=tick, color=color))
result = dict(stage=291, original_synthetic_only=True, graphicInfoHex=info.hex(), colors=list(colors.items()),
              palette32=palette32, AUTRGBHex=auto.hex(), cases=cases, averages=averages, clock=clock)
(A / 'original-vectors.json').write_text(json.dumps(result, separators=(',', ':')) + '\n')
print(json.dumps(dict(cases=len(cases), rasters=2 * len(cases), averages=20, clock=len(clock))))
