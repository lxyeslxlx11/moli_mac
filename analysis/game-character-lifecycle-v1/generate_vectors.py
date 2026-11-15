#!/usr/bin/env python3
"""Independent Python arithmetic/control/wire reference; all names, records and traffic are original."""
from pathlib import Path
import importlib.util
import json
import random

HERE = Path(__file__).resolve().parent


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


old = load('original_character_records', HERE.parent / 'game-post-login-v1/generate_vectors.py')
wire = old.wire
ORDER = [200000, 200200, 200800, 201000, 201200, 201400, 201600, 200400, 200600, 201800, 202000, 202200, 202400, 202600]


def inverse(code):
    if code < 241400:
        return code - 37200
    return ORDER[(code - 241400) // 100] + code % 100


def legacy(code):
    if 202800 <= code < 204200:
        group, rem = divmod(code - 202800, 100)
        group = {3: 4, 4: 3}.get(group, group)
        first, rem = divmod(rem, 25)
        second, last = divmod(rem, 5)
        code = last + 10 * (second + 100 * (first + 30 + 4 * group))
        if code >= 58000:
            code += 12000
    return code


def values(family, ordinal, color, detail0, detail1, mode):
    row = [0, 1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 15, 16][ordinal]
    animation = (106002 if family else 100002 if mode == 0 else 105002) + row * 25 + color * 6
    resource = 240000 + (ordinal + family * 14) * 100
    icon = legacy(inverse(resource)) + (detail0 + color * 100) * 10 + detail1 if mode == 0 else (inverse(resource) if mode == 1 else resource) + (color * 5 + detail0) * 5 + detail1
    return [animation, icon, int(mode != 0)]


def name_error(raw, existing=(b'OriginalA', b'')):
    if len(raw) > 16 or b'\0' in raw:
        return 'LEGACY_CREATION_NAME_BYTES'
    if not raw:
        return 'LEGACY_CREATION_NAME_EMPTY'
    if raw in existing:
        return 'LEGACY_CREATION_NAME_DUPLICATE'
    if any(s in raw for s in [b' ', b'\x81\x40', b'\xa1\x40', b'[GP]']):
        return 'LEGACY_CREATION_NAME_RESERVED'
    i = 0
    while i < len(raw):
        if raw[i] >= 128:
            i += 2
        else:
            if raw[i] < 33 or raw[i] == 127 or raw[i] in b'|\\/':
                return 'LEGACY_CREATION_NAME_RESERVED'
            i += 1
    i = 0
    while i < len(raw):
        if raw[i] >= 129:
            i += 2
        else:
            if raw[i] in b'|\\':
                return 'LEGACY_CREATION_NAME_RESERVED'
            i += 1
    return None


def main():
    appearances = []
    for category, family, modes in [(0, 0, [0]), (8, 0, [0, 1, 2]), (8, 1, [1, 2])]:
        for ordinal in range(14):
            for color in range(4):
                for detail0 in range(5):
                    for detail1 in range(5):
                        for mode in modes:
                            appearances.append([category, family, ordinal, color, detail0, detail1, mode, *values(family, ordinal, color, detail0, detail1, mode)])
    rng = random.Random(167)
    stats, elements = [0] * 5, [0] * 4
    remaining = [30, 10]
    traces = []
    for _ in range(6000):
        pool = rng.randrange(2)
        index = rng.randrange(5 if pool == 0 else 4)
        by = rng.choice([-1, 1])
        changed = False
        row = stats if pool == 0 else elements
        if by == -1:
            if row[index] > 0:
                row[index] -= 1
                remaining[pool] += 1
                changed = True
        elif pool == 0:
            if remaining[0] > 0 and row[index] < 15:
                row[index] += 1
                remaining[0] -= 1
                changed = True
        elif row[index] < 10:
            if row[(index + 2) % 4] == 0 and remaining[1] > 0:
                row[index] += 1
                remaining[1] -= 1
                changed = True
            else:
                for candidate in range(4):
                    if candidate != index and row[candidate] > 0:
                        row[candidate] -= 1
                        row[index] += 1
                        changed = True
                        break
        traces.append([pool, index, by, int(changed), *stats, remaining[0], *elements, remaining[1]])
    names = [b'', b'OriginalA', b'OriginalNew', b'A' * 16, b'A' * 17, b'prefix[GP]tail', b'prefix[gp]tail', b'\x81\x40', b'\xa1\x40', b'\x81\x7c', b'\x80\x7c', b'\x81\x2f', b'\x80\x2f', b'\x81', b'A\0B']
    names += [bytes([x]) for x in range(1, 256)]
    names += [b'A' + bytes([a, b]) + b'B' for a in [0x80, 0x81, 0xa1, 0xff] for b in [9, 32, 47, 64, 92, 124, 127, 128, 255]]
    prior = json.loads((HERE.parent / 'game-post-login-v1/original-vectors.json').read_text())
    catalog = json.loads((HERE.parent / 'game-legacy-message-v1/dispatch-catalog.json').read_text())
    incoming = {x['id']: x for x in catalog['incoming']}
    outgoing = {x['id']: x for x in catalog['outgoing']}
    key = bytes.fromhex(prior['bootstrap']['keyHex'])

    def command(operation, arguments, source):
        plain = wire.message(source[operation], arguments)
        return dict(id=operation, arguments=[x if isinstance(x, int) else dict(hex=x.hex()) for x in arguments], plainHex=plain.hex(), frameHex=wire.frame(wire.payload_encode(plain, key)).hex())

    flows = []
    for slot, category, family, ordinal, color, d0, d1, mode in [(1, 8, 1, 3, 2, 1, 4, 2), (0, 8, 0, 7, 3, 4, 2, 0)]:
        animation, icon, variant = values(family, ordinal, color, d0, d1, mode)
        identity = 900 + slot
        initial_rows = [(b'OriginalA', old.record_tokens())] if slot == 1 else []
        final_rows = initial_rows + [(b'OriginalNew', old.record_tokens(slot, icon, variant, identity))]
        initial, final = old.body(initial_rows), old.body(final_rows)
        decoded = old.decode(final)
        prepared = old.preview(bytes.fromhex(decoded['records'][slot]))
        import struct
        record = bytes.fromhex(prepared['recordHex'])
        entry = [struct.unpack_from('<i', record, offset)[0] for offset in [76, 80, 24]]
        flows.append(dict(slot=slot, category=category, family=family, ordinal=ordinal, color=color, details=[d0, d1], mode=mode, initialBodyHex=initial.hex(), finalBodyHex=final.hex(),
                          create=command('send-004f8460', [slot, b'OriginalNew', animation, icon, *([6] * 5), 6, 4, 0, 0], outgoing),
                          created=command('receive-00567c48', [b'successful', identity, b'Original ignored detail'], incoming),
                          denied=command('receive-00567c48', [b'failed', 0, b'Original denial'], incoming),
                          initial=command('receive-00567c3c', [0, initial], incoming),
                          refreshed=command('receive-00567c3c', [0, final], incoming),
                          entry=command('send-004f8650', entry, outgoing)))
    result = dict(schema='moli.original-character-creation-vectors.v1', description='Static-source independent Python reference, not original-client execution; synthetic names and protocol data only.',
                  appearanceColumns=['category', 'family', 'ordinal', 'color', 'detail0', 'detail1', 'mode', 'animation', 'icon', 'nativeVariant'], appearances=appearances,
                  traceColumns=['pool', 'index', 'delta', 'changed', 'stat0', 'stat1', 'stat2', 'stat3', 'stat4', 'statRemaining', 'four0', 'four1', 'four2', 'four3', 'fourRemaining'], traces=traces,
                  names=[dict(hex=x.hex(), error=name_error(x)) for x in names], flows=flows)
    (HERE / 'original-vectors.json').write_text(json.dumps(result, separators=(',', ':')) + '\n')
    print(json.dumps(dict(appearances=len(appearances), control_steps=len(traces), names=len(names), flows=len(flows))))


if __name__ == '__main__':
    main()
