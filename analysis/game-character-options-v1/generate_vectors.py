#!/usr/bin/env python3
"""Independent source arithmetic and original wire oracle, including the corrected native0x814c fallback."""
from pathlib import Path
import importlib.util
import json
import random
import struct

HERE = Path(__file__).resolve().parent


def load(name, path):
    s = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(s)
    s.loader.exec_module(m)
    return m


old = load('original_character_options_base', HERE.parent / 'game-post-login-v1/generate_vectors.py')
creation = load('original_character_options_inverse', HERE.parent / 'game-character-lifecycle-v1/generate_vectors.py')


def allowed(category, present, variant):
    c = category & 255
    if not present or c <= 4:
        return []
    return ([3, 4] if variant in [0, 1] or c >= 7 else []) + ([5, 6] if variant in [0, 1] else [])


def inverse(code):
    if 240000 <= code < 241400:
        return code - 37200
    index = old.trunc(code - 241400, 100)
    if not 0 <= index < 14:
        raise IndexError('native table outside finite coverage')
    return creation.ORDER[index] + code - old.trunc(code, 100) * 100


def option(category, code, temporary, variant, action, present):
    if action not in allowed(category, present, variant):
        return None, 'LEGACY_CHARACTER_OPTION_UNAVAILABLE'
    c = category & 255
    normalized = requested = None
    if action in [3, 4]:
        if code not in [0x814c, 0x814d]:
            if 30000 <= code < 98000:
                temporary = 0
            elif 202800 <= code < 204200 or (c >= 7 and 200000 <= code <= 202699):
                temporary = 1
            elif c >= 7 and 240000 <= code <= 242800:
                temporary = 2
            if c < 7:
                if temporary == 0:
                    code = old.forward_old(code)
                elif temporary == 1:
                    code = creation.legacy(code)
            elif temporary == 0:
                code = old.forward_old(code)
                if action == 3:
                    code = old.forward_new(code)
            elif temporary == 1:
                code = old.forward_new(code) if action == 4 or 200000 <= code <= 202699 else creation.legacy(code)
            elif temporary == 2:
                original = code
                try:
                    code = inverse(code)
                except IndexError:
                    return None, 'LEGACY_CHARACTER_CODE_TABLE'
                if action == 4 and 240000 <= original < 241400:
                    code = creation.legacy(code)
    else:
        requested = 1 - variant
        record = bytearray(148)
        record[0] = 65
        struct.pack_into('<i', record, 24, code)
        struct.pack_into('<i', record, 80, requested)
        result = old.preview(record)
        data = bytes.fromhex(result['recordHex'])
        code = struct.unpack_from('<i', data, 24)[0]
        variant = struct.unpack_from('<i', data, 80)[0]
        normalized = result['normalizedCode']
    return [code, temporary, variant, int(action >= 5), normalized, requested], None


def capability(category, generation):
    c = category & 255
    if generation < 2:
        return [False, None, 'LEGACY_CHARACTER_UPGRADE_CONTENT']
    if c in [0, 2]:
        return [True, 2, None]
    if generation >= 3 and c in [5, 6]:
        return [True, 4, None]
    return [False, None, 'LEGACY_CHARACTER_UPGRADE_MATERIAL' if generation >= 3 and c == 7 else 'LEGACY_CHARACTER_UPGRADE_CATEGORY']


def main():
    cases = {}

    def add(row):
        result, error = option(*row)
        cases[tuple(row)] = dict(input=row, expected=result, error=error)

    for c in range(256):
        for variant in [0, 1, 2]:
            for code in [30000, 241799]:
                for action in range(3, 7):
                    add([c, code, 0, variant, action, True])
    bounds = [-2147483648, -1, 0, 29999, 30000, 33000, 33100, 33101, 57999, 58000, 69999, 70000, 97999, 98000, 199999, 200000, 202699, 202700, 202799, 202800, 204199, 204200, 239999, 240000, 241399, 241400, 242799, 242800, 242801, 2147483647]
    for c in [5, 6, 7, 8]:
        for code in bounds:
            for temporary in [-1, 0, 1, 2, 7]:
                for variant in [0, 1, 2]:
                    for action in range(3, 7):
                        add([c, code, temporary, variant, action, True])
    rng = random.Random(168)
    for i in range(2000):
        add([rng.randint(-2**31, 2**31 - 1), rng.choice(bounds) if i % 2 else rng.randint(30000, 242900), rng.choice([-1, 0, 1, 2, 7]), rng.choice([-1, 0, 1, 2, 2147483647]), rng.randint(3, 6), bool(i % 5)])
    categories = [*range(256), -2147483648, -1, 256, 257, 2147483647]
    upgrades = [dict(category=c, generation=g, expected=capability(c, g), nativeAuxiliary=old.policy(c, g)['nativeAuxiliaryOption']) for c in categories for g in range(-1, 5)]
    base = json.loads((HERE.parent / 'game-post-login-v1/original-vectors.json').read_text())
    catalog = json.loads((HERE.parent / 'game-legacy-message-v1/dispatch-catalog.json').read_text())
    incoming = {x['id']: x for x in catalog['incoming']}
    outgoing = {x['id']: x for x in catalog['outgoing']}
    key = bytes.fromhex(base['bootstrap']['keyHex'])

    def framed(operation, args, table):
        plain = old.wire.message(table[operation], args)
        return dict(id=operation, arguments=[x if isinstance(x, int) else dict(hex=x.hex()) for x in args], plainHex=plain.hex(), frameHex=old.wire.frame(old.wire.payload_encode(plain, key)).hex())

    flows = []
    for slot, actions, fallback in [(0, [4], False), (1, [3], False), (0, [5], True)]:
        body = old.body([(b'OriginalA', old.record_tokens(0, 0 if fallback else 30000, -1, 501)), (b'OriginalB', old.record_tokens(1, 33001, 2, 502))])
        initial = [old.preview(bytes.fromhex(x)) for x in old.decode(body)['records']]
        rec = bytearray.fromhex(initial[slot]['recordHex'])
        for action in actions:
            code, temporary, variant = [struct.unpack_from('<i', rec, offset)[0] for offset in [24, 36, 80]]
            result, error = option(8, code, temporary, variant, action, True)
            assert error is None
            for offset, value in zip([24, 36, 80], result[:3]):
                struct.pack_into('<i', rec, offset, value)
        entry = [struct.unpack_from('<i', rec, offset)[0] for offset in [76, 80, 24]]
        flows.append(dict(slot=slot, actions=actions, fallback=fallback, bodyHex=body.hex(), preparedRecords=[x['recordHex'] for x in initial], expectedRecordHex=rec.hex(),
                          initial=framed('receive-00567c3c', [0, body], incoming), entry=framed('send-004f8650', entry, outgoing)))
    result = dict(schema='moli.original-character-options-vectors.v1', description='Independent Python from fixed static consumers; original test names/bytes only, not target execution.',
                  inputColumns=['category', 'code', 'temporary36', 'variant17', 'action', 'present'], resultColumns=['code', 'temporary36', 'variant17', 'previewPrepared', 'normalized', 'requestedVariant'],
                  options=list(cases.values()), upgradeCapabilities=upgrades, flows=flows,
                  wire=dict(category5=framed('receive-00567c20', [5], incoming), category8=framed('receive-00567c20', [8], incoming),
                            request=framed('send-004f8880', [4, b'20031229_30'], outgoing), accepted=framed('receive-00567c1c', [256], incoming), denied=framed('receive-00567c1c', [1], incoming),
                            field16=framed('receive-00567d00', [old.wire.integer(65536) + b'|123456'], incoming)),
                  sourceFallback=33100)
    (HERE / 'original-vectors.json').write_text(json.dumps(result, separators=(',', ':')) + '\n')
    print(json.dumps(dict(option_cases=len(cases), upgrade_capabilities=len(upgrades), wire_branches=len(flows), fallback=33100)))


if __name__ == '__main__':
    main()
