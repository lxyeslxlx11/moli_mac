"""Independent local CUT/AUT inventory, selected native-order colors and RGB rasters; digests only."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json
import struct
import sys

ROOT = Path(__file__).resolve().parents[2]
A = Path(__file__).resolve().parent
P = ROOT / 'build/analysis/game-legacy-minimap-v1'
M = ROOT / 'build/analysis/game-legacy-resource-archive-v1/material-root'
profile = json.loads((ROOT / 'analysis/game-legacy-material-compat-v1/material-profile.json').read_text())
paths = {p.relative_to(M).as_posix().lower(): p for p in M.rglob('*') if p.is_file()}
sys.path.insert(0, str(ROOT / 'analysis/game-legacy-render-v1'))


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


rd = module('moli_minimap_rd_reference', ROOT / 'analysis/game-legacy-render-v1/corpus_oracle.py')
mini = module('moli_minimap_raster_reference', A / 'generate_vectors.py')
records = {}
base = 0
for group in profile['groups']:
    file = paths.get(group['graphicInfo'].lower())
    if file is None:
        continue
    raw = file.read_bytes()
    for offset in range(0, len(raw), 40):
        index, start, length = struct.unpack_from('<III', raw, offset)
        resource = struct.unpack_from('<I', raw, offset + 36)[0]
        records[base + index] = (group['group'], resource, group['graphic'], start, length)
    base += len(raw) // 40
sources = [-1] * 65536
for index, (group, resource, *_rest) in sorted(records.items()):
    if group <= 2:
        tile = resource if 1000 <= resource <= 19999 else resource - 200000 if 220000 <= resource <= 265535 else -1
        if tile >= 0:
            sources[tile] = index
    elif resource < 65536:
        sources[resource] = -1
eligible = [i for i, index in enumerate(sources) if index >= 0]
selected = sorted(set(eligible[:8] + eligible[len(eligible)//2:len(eligible)//2+8] + eligible[-8:] + [0, 1000, 1001, 1006, 5000, 20001]))
original, _current = rd.base_rgb(paths[profile['palette'].lower()].read_bytes())
colors = []
for tile in selected:
    index = sources[tile]
    row = dict(tile=tile, index=index, expected=0)
    if index >= 0:
        group, resource, graphic, offset, length = records[index]
        with paths[graphic.lower()].open('rb') as stream:
            stream.seek(offset)
            raw = stream.read(length)
        w, h, pixels, _embedded, _consumed = rd.decode(raw)
        sums = [0, 0, 0]
        count = 0
        for value in pixels:
            if value:
                count += 1
                for channel in range(3):
                    sums[channel] += original[value * 3 + channel]
        mean = [v // count for v in sums] if count else [0, 0, 0]
        distance = lambda i: sum((original[i*3+c] - mean[c]) ** 2 for c in range(3))
        chosen = min([0] + list(range(16, 240)), key=distance) if count else 0
        row.update(expected=chosen, group=group, resource=resource, graphic=graphic,
                   offset=offset, bytes=length, input_sha256=sha256(raw).hexdigest(), pixels=w*h)
    colors.append(row)

inventory = []
for key, path in sorted(paths.items()):
    if '/cutdat/' in key and path.suffix.lower() in ('.cut', '.aut'):
        raw = path.read_bytes()
        row = dict(path=path.relative_to(M).as_posix(), bytes=len(raw), sha256=sha256(raw).hexdigest())
        if path.suffix.lower() == '.cut':
            row.update(records=sum(struct.unpack_from('<3h', raw, 6)))
        inventory.append(row)
aut = paths['bin/puk2/cutdat/59529.aut'].read_bytes()
cases = []
for zoom, n in enumerate([107, 54, 27]):
    origin = [2 - n//2, 3 - n//2]
    grid = [0] * (n*n)
    for y in range(n):
        for x in range(n):
            wx, wy = origin[0]+x, origin[1]+y
            if 0 <= wx < 12 and 0 <= wy < 12:
                offset = (wy*12+wx)*3
                grid[y*n+x] = int.from_bytes(aut[offset:offset+3], 'big')
    cases.append(dict(zoom=zoom, origin=origin, grid_sha256=sha256(struct.pack('<'+'I'*len(grid), *grid)).hexdigest(),
                      rgba_sha256=mini.raster(n, grid, None, 1)))
out = dict(stage=291, classification='actual local material digests with an authored12x12 map,not official map dimensions',
           final_records=len(records), eligible_tiles=len(eligible), selected_colors=colors, inventory=inventory,
           CUT_files=sum(r['path'].lower().endswith('.cut')for r in inventory), AUT_files=sum(r['path'].lower().endswith('.aut')for r in inventory),
           selector=59529, RGB_cases=cases, original_execution=False)
(P / 'material-oracle.json').write_text(json.dumps(out, indent=2)+'\n')
print(json.dumps({k: out[k] for k in ['stage','final_records','eligible_tiles','CUT_files','AUT_files','selector']} | dict(color_cases=len(colors), RGB_cases=len(cases))))
