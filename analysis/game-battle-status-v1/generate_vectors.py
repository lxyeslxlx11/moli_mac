#!/usr/bin/env python3
"""Independent static-source PSN arithmetic/callback/pixel reference; original bytes only."""
from pathlib import Path
import importlib.util, json, struct

A = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('psn_existing_reference', A.parent / 'game-battle-skill-v1/generate_vectors.py')
skill = importlib.util.module_from_spec(spec)
spec.loader.exec_module(skill)
anime, f = skill.anime, skill.f

def signed(value):
    return (value + 2**31) % 2**32 - 2**31

def arithmetic(selector, before, maximum, amount):
    if selector == 1:
        value = signed(before + amount)
        return maximum if maximum < value else value
    value = signed(before - amount)
    return 0 if value < 0 else value

def fixtures():
    _, _, prior, _ = skill.fixtures()
    files = {r['path']: bytes.fromhex(r['bytesHex']) for r in prior}
    info, pixels = bytearray(files['Bin/GraphicInfo.bin']), bytearray(files['Bin/Graphic.bin'])
    index, data = bytearray(files['Bin/AnimeInfo.bin']), bytearray(files['Bin/Anime.bin'])
    existing = {struct.unpack_from('<I', info, at + 36)[0] for at in range(0, len(info), 40)}
    for style in [3, 5]:
        for j, ch in enumerate('-0123456789'):
            resource = 243700 + style * 10 - 48 + ord(ch)
            if resource in existing:
                continue
            existing.add(resource)
            w, h = 8 + 4 * (j % 3), 7
            raw_pixels = bytes(0 if (i + j) % 4 == 0 else 16 + style + i % 2 for i in range(w * h))
            raw = b'RD\0\0' + struct.pack('<iiI', w, h, 16 + len(raw_pixels)) + raw_pixels
            row = bytearray(40)
            struct.pack_into('<IIIiiii', row, 0, 4000 + style * 20 + j, len(pixels), len(raw), -3, -2, w, h)
            struct.pack_into('<I', row, 36, resource)
            info.extend(row)
            pixels.extend(raw)
    for resource in [*range(0x1ae55, 0x1ae59), 0x1ae68]:
        blocks = [anime.action(0, 0, 96, [(1002, 0, 0, 0), (1004, 1, -1, 0), (1005, 0, 0, 0)])]
        index.extend(struct.pack('<IIHH', resource, len(data), len(blocks), 0))
        data.extend(b''.join(blocks))
    files.update({'Bin/GraphicInfo.bin': bytes(info), 'Bin/Graphic.bin': bytes(pixels),
                  'Bin/AnimeInfo.bin': bytes(index), 'Bin/Anime.bin': bytes(data)})
    records = []
    for at in range(0, len(info), 40):
        n, offset, size, ox, oy, w, h = struct.unpack_from('<IIIiiii', info, at)
        resource = struct.unpack_from('<I', info, at + 36)[0]
        records.append(dict(index=n, originX=ox, originY=oy, width=w, height=h, resourceId=resource))
        raw = pixels[offset:offset + size]
        head = 20 if raw[2] == 2 else 16
        skill.scene.IMAGES[n] = dict(index=n, resource=resource, origin=[ox, oy], width=w, height=h,
                                    pixels=raw[head:head + w * h], embedded=raw[head + w * h:] if raw[2] == 2 else None)
    def geometry(kind, value):
        row = next(r for r in records if r['index' if kind == 'index' else 'resourceId'] == value)
        return {k: row[k] for k in ['index', 'originX', 'originY', 'width', 'height']}
    anime.geo = geometry
    groups = [dict(index=files['Bin/AnimeInfo.bin'], animation=files['Bin/Anime.bin'], graphicBase=0)]
    return anime.parse(groups), records, [dict(path=p, bytesHex=b.hex()) for p, b in files.items()]

def queue(selector, flags):
    if selector == 0:
        return [78, 154, 30] + ([44, 45] if flags & 32 else [])
    return [129, 155] if selector == 1 else [78, 155]

class Body(skill.Body):
    def __init__(self, world, row):
        super().__init__(world, row['slot'], 100020)
        self.vitals = row['vitals'][:]
        self.level, self.amount = row['level'], row['amount']
        self.style = [6, 5, 3][row['selector']]
        self.actions = queue(row['selector'], row['flags']) + [-1]
        self.read, self.write, self.busy = 0, len(self.actions) - 2, 1
        self.state = self.actions[0]
        self.sound = 0x111 if row['selector'] == 0 else 0x112
    def body_step(self):
        state = self.state
        if state == 78:
            self.pop()
        elif state == 129:
            if not self.flags & 0x60:
                self.animate(self.body, 0)
            if self.skill == 0:
                resource = 0x1ae55 + [3, 3, 3, 2, 2, 2, 1, 1, 1, 0][self.level]
                node = self.w.node(self, 'status-heal', resource=resource, flags=0x48000,
                                   position=self.position, parent=self.body)
                if resource == 0x1ae55:
                    overlay = self.w.node(self, 'status-heal-overlay', resource=0x1ae68,
                                          flags=0x48000, position=node['position'], parent=node)
                    overlay['drawPriority'] = 203
                self.skill = 1
            self.state = 157
        elif state in [154, 155]:
            if not self.flags & 0x60:
                self.animate(self.body, 0)
            self.w.number(self, self.amount, self.style)
            index = 2 if self.style == 3 else 0
            self.vitals[index] = arithmetic(1 if self.style == 5 else 0,
                                            self.vitals[index], self.vitals[index + 1], self.amount)
            if state == 154:
                self.pop()
            else:
                self.state = 35
        elif state == 30:
            self.action, self.percent = 8, 100
            if self.animate(self.body, 1) == 1:
                self.pop()
        elif state == 35:
            if not self.flags & 0x60:
                self.animate(self.body, 0)
            self.counter += 1
            if self.counter >= 60:
                self.counter = 0
                self.pop()
        else:
            super().body_step()
    def project(self):
        return dict(super().project(), skillLevel=self.level, numberValue=self.amount, numberStyle=self.style)

class World(skill.World):
    def __init__(self, animations, records, row):
        self.animations, self.records = animations, records
        self.nodes, self.next_id, self.random = [], 1, skill.old.Random(12345)
        self.phase, self.passes, self.bodies, self.slow, self.events = 0, 0, {}, row['slow'], []
        body = Body(self, row)
        self.bodies[row['slot']] = body
    def number(self, body, value, style=6):
        text, center = str(value), len(str(value)) * 9 // 2
        for i, ch in enumerate(text):
            g = next(r for r in self.records if r['resourceId'] == 243700 + style * 10 - 48 + ord(ch))
            node = self.node(body, 'damage-digit', flags=0x40002,
                position=[g['originX'] + body.body['screen'][0] - center + 11 * i,
                          g['originY'] + body.body['screen'][1] - 80], screenSpace=True, delay=i * 2)
            node.update(height=-8., drawPriority=207)
            node['q'].update(graphicIndex=g['index'], geometry={k: g[k] for k in ['index', 'originX', 'originY', 'width', 'height']})
    def step_effect(self, node):
        if node['kind'] == 'status-heal':
            body = node['owner']
            if body.animate(node, 1) == 1:
                if not node['parent']['deleted'] and body.skill:
                    body.skill = 2
                node['deleted'] = True
        elif node['kind'] == 'status-heal-overlay':
            if node['parent']['deleted']:
                node['deleted'] = True
            node['owner'].animate(node, 0)
        else:
            super().step_effect(node)

def main():
    animations, records, files = fixtures()
    rows = [dict(name='damage', selector=0, level=0, slot=10, flags=0, amount=12, vitals=[100, 100, 10, 10], slow=False),
            dict(name='zero-damage', selector=0, level=0, slot=0, flags=0, amount=0, vitals=[100, 100, 10, 10], slow=False),
            dict(name='HP-lower-clamp', selector=0, level=0, slot=10, flags=0, amount=120, vitals=[100, 100, 10, 10], slow=False),
            dict(name='negative-damage', selector=0, level=0, slot=10, flags=0, amount=-9, vitals=[100, 100, 10, 10], slow=False),
            dict(name='source-KO-flag', selector=0, level=0, slot=10, flags=32, amount=1, vitals=[100, 100, 10, 10], slow=False),
            dict(name='MP-damage', selector=2, level=0, slot=0, flags=0, amount=4, vitals=[70, 100, 10, 10], slow=False),
            dict(name='MP-clamp', selector=2, level=0, slot=10, flags=0, amount=18, vitals=[70, 100, 10, 10], slow=False),
            dict(name='negative-MP-damage', selector=2, level=0, slot=0, flags=0, amount=-5, vitals=[70, 100, 10, 10], slow=False),
            dict(name='quartered-MP', selector=2, level=0, slot=0, flags=0, amount=0, vitals=[70, 100, 10, 10], slow=True)]
    for level in range(10):
        rows.append(dict(name='HP-heal-level-' + str(level), selector=1, level=level, slot=0,
                         flags=0, amount=12 if level < 9 else 90, vitals=[70, 100, 10, 10], slow=level == 8))
    rows += [dict(name='negative-heal', selector=1, level=9, slot=10, flags=0, amount=-120,
                  vitals=[70, 100, 10, 10], slow=False),
             dict(name='heal-overflow', selector=1, level=0, slot=0, flags=0, amount=0x7fffffff,
                  vitals=[1, 100, 10, 10], slow=False)]
    traces = []
    for row in rows:
        world, states, renders = World(animations, records, row), [], []
        for _ in range(1800):
            states.append(world.step())
            renders.append(skill.render_reference(world))
            if all(b.detached or not b.busy for b in world.bodies.values()) and all(n['kind'] == 'body' for n in world.nodes):
                break
        assert all(b.detached or not b.busy for b in world.bodies.values()), row['name']
        traces.append(dict(row, actions=queue(row['selector'], row['flags']), states=states, renders=renders))
    arithmetic_rows = []
    for selector in [0, 1, 2]:
        for before in [-2**31, -1, 0, 1, 70, 100, 2**31 - 1]:
            for maximum in [-2**31, -1, 0, 100, 2**31 - 1]:
                for amount in [-2**31, -120, -1, 0, 1, 120, 2**31 - 1]:
                    arithmetic_rows.append(dict(selector=selector, before=before, maximum=maximum,
                        amount=amount, value=arithmetic(selector, before, maximum, amount)))
    out = dict(schema='moli.original-battle-status-reference-stage192.v1',
               authority='Independent Python source arithmetic, callback and original indexed-pixel reference; no product imports or original execution',
               files=files, geometry=records, arithmetic=arithmetic_rows, traces=traces,
               frames=sum(len(t['states']) for t in traces))
    (A / 'original-vectors.json').write_text(json.dumps(out, separators=(',', ':')) + '\n')
    print(json.dumps(dict(cases=len(traces), frames=out['frames'], arithmetic=len(arithmetic_rows))))

if __name__ == '__main__':
    main()
