"""Independent complete GraphicInfo metadata and sampled real-pixel digests; no asset export."""
from pathlib import Path
from hashlib import sha256
import importlib.util
import json
import struct
import sys

ROOT = Path(__file__).resolve().parents[2]
A = Path(__file__).resolve().parent
P = ROOT / 'build/analysis/game-legacy-material-compat-v1'
M = ROOT / 'build/analysis/game-legacy-resource-archive-v1/material-root'
profile = json.loads((A / 'material-profile.json').read_text())


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


sys.path.insert(0, str(ROOT / 'analysis/game-legacy-render-v1'))
reference = module('moli_material_rd_reference', ROOT / 'analysis/game-legacy-render-v1/corpus_oracle.py')
files = {r['path'].lower(): r for r in profile['files']}


def local(path):
    return M / files[path.lower()]['path']


for row in profile['files']:
    h = sha256()
    with (M / row['path']).open('rb') as stream:
        for b in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(b)
    assert h.hexdigest() == row['sha256'], row['path']

capacity = 850000
records = bytearray(capacity * 40)
lookup = bytearray(capacity * 4)
for i in range(capacity):
    struct.pack_into('<I', records, i * 40, i)
base = 0
samples = []
occupied = bytearray(capacity)
index_overwrites = 0
cross_group_overwrites = 0
for group in profile['groups']:
    if group['graphicInfo'].lower() not in files:
        continue
    raw = local(group['graphicInfo']).read_bytes()
    count = len(raw) // 40
    assert len(raw) % 40 == 0
    selected = set(range(min(8, count))) | set(range(max(0, count // 2 - 4), min(count, count // 2 + 4))) | set(range(max(0, count - 8), count))
    for ordinal in range(count):
        at = ordinal * 40
        index, offset, length = struct.unpack_from('<III', raw, at)
        index += base
        x, y = struct.unpack_from('<h', raw, at + 12)[0], struct.unpack_from('<h', raw, at + 16)[0]
        w, h = struct.unpack_from('<H', raw, at + 20)[0], struct.unpack_from('<H', raw, at + 24)[0]
        resource = struct.unpack_from('<I', raw, at + 36)[0]
        collision = raw[at + 28] | raw[at + 29] << 8 | struct.unpack_from('<H', raw, at + 30)[0] << 16
        assert 0 <= index < capacity
        if occupied[index]:
            index_overwrites += 1
            cross_group_overwrites += struct.unpack_from('<I', records, index * 40 + 4)[0] != group['group'] + 1
        occupied[index] = 1
        struct.pack_into('<10I', records, index * 40, index, group['group'] + 1, offset, length, x & 0xffffffff, y & 0xffffffff, w, h, collision, resource)
        if resource == 0:
            struct.pack_into('<I', lookup, 0, 0)
        elif resource < capacity:
            struct.pack_into('<I', lookup, resource * 4, index)
        if ordinal in selected:
            samples.append(dict(group=group['group'], index=index, offset=offset, length=length, graphic=group['graphic']))
    base += count
for resource, index in [(0x3bd30, 0x9999d), (0x3bd3a, 0x9999e), (0x3bd44, 0x9999f), (0x3bea2, 0x999a0)]:
    if struct.unpack_from('<I', lookup, resource * 4)[0]:
        struct.pack_into('<I', lookup, resource * 4, index)

cgp = local(profile['palette']).read_bytes()
_, current = reference.base_rgb(cgp)
base_colors, _ = reference.palette(current, 'default-rgb')
accepted = rejected = 0


def image_digest(row):
    with local(row['graphic']).open('rb') as stream:
        stream.seek(row['offset'])
        raw = stream.read(row['length'])
    assert len(raw) == row['length']
    row['input_sha256'] = sha256(raw).hexdigest()
    try:
        w, h, pixels, tail, consumed = reference.decode(raw)
        colors, known = reference.palette(tail, 'embedded-bgr') if tail else (base_colors, [1] * 256)
        if max(w, h) > 32767:
            raise ValueError('LEGACY_RENDER_DIMENSIONS_UNPROVEN')
        if w % 4:
            raise ValueError('LEGACY_RENDER_STRIDE_UNPROVEN')
        if any(not known[i] for i in set(pixels)):
            raise ValueError('LEGACY_RENDER_UNKNOWN_COLOR')
        rgba = reference.raster(w, h, pixels, colors)
        row.update(status='accepted', width=w, height=h, rgba_sha256=sha256(rgba).hexdigest())
    except ValueError as error:
        row.update(status='rejected', code=str(error))
    return row


for row in samples:
    image_digest(row)
    accepted += row['status'] == 'accepted'
    rejected += row['status'] == 'rejected'
    if row['index'] >= 1000:
        words = struct.unpack_from('<10I', records, row['index'] * 40)
        final = dict(index=words[0], group=words[1] - 1, offset=words[2], length=words[3], graphic=profile['groups'][words[1] - 1]['graphic'])
        row['library'] = image_digest(final)

animation_groups = []
animation_records = {}
ap_indices = []
graphic_base = 0
for group in profile['groups']:
    index = local(group['animationInfo']).read_bytes() if group['animationInfo'].lower() in files else b''
    data = local(group['animation']).read_bytes() if index else b''
    ap = local(group['coordinateInfo']).read_bytes() if group['coordinateInfo'].lower() in files else b''
    attachment = local(group['coordinate']).read_bytes() if ap else b''
    animation_groups.append((data, attachment, graphic_base))
    ap_indices.append(ap)
    for at in range(0, len(index), 12):
        resource, offset, count, version = struct.unpack_from('<IIHH', index, at)
        animation_records[resource] = dict(resource=resource, group=group['group'], offset=offset, count=count, version=version if version <= 1 else 0, ap_count=0, ap_offset=0)
    if group['graphicInfo'].lower() in files:
        graphic_base += local(group['graphicInfo']).stat().st_size // 40
for ap in ap_indices:
    if ap:
        assert ap[0] == 1 and (len(ap) - 1) % 10 == 0
        for at in range(1, len(ap), 10):
            resource, offset, count = struct.unpack_from('<IIH', ap, at)
            if resource in animation_records:
                animation_records[resource].update(ap_count=count, ap_offset=offset)
animation_samples = []
for group in range(7):
    resources = sorted(k for k, r in animation_records.items() if r['group'] == group)
    selected = set(resources[:2] + resources[max(0, len(resources) // 2 - 1):len(resources) // 2 + 1] + resources[-2:])
    for resource in sorted(selected):
        r = animation_records[resource]
        data, attachment, graphic_base = animation_groups[group]
        cursor = r['offset']
        actions = []
        frame_count = 0
        for _ in range(r['count']):
            direction, action, duration, count = struct.unpack_from('<HHII', data, cursor)
            selector, flags, color = struct.unpack_from('<HHI', data, cursor + 12) if r['version'] == 1 else (0, 0, 0xffffffff)
            cursor += 20 if r['version'] == 1 else 12
            frames = []
            for _ in range(count):
                index, x, y, event = struct.unpack_from('<IhhH', data, cursor)
                frames.append([index + graphic_base, x, y, event])
                cursor += 10
            frame_count += count
            actions.append([direction, action, duration, max(1, duration // (count * 16)) if count else duration, count, selector, flags, color, frames])
        attachments = []
        for i in range(r['ap_count']):
            index, x, y = struct.unpack_from('<Ihh', attachment, r['ap_offset'] + i * 8)
            attachments.append([index + graphic_base, x, y])
        canonical = [resource, group, r['version'], r['count'], r['offset'], cursor - r['offset'], actions, attachments]
        animation_samples.append(dict(resource=resource, group=group, actions=r['count'], frames=frame_count, attachments=len(attachments), sha256=sha256(json.dumps(canonical, separators=(',', ':')).encode()).hexdigest()))

result = dict(stage=290, records=base, capacity=capacity, metadata_sha256=sha256(records).hexdigest(),
              lookup_sha256=sha256(lookup).hexdigest(), sample_count=len(samples), accepted=accepted, rejected=rejected,
              index_overwrites=index_overwrites, cross_group_overwrites=cross_group_overwrites,
              animation_resources=len(animation_records), animation_samples=animation_samples,
              samples=samples, all_source_hashes=True, original_execution=False, original_pixels_exported=False)
(P / 'corpus-oracle.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({k: v for k, v in result.items() if k not in ['samples', 'animation_samples']} | dict(animation_samples=len(animation_samples), sampled_animation_frames=sum(r['frames'] for r in animation_samples))))
