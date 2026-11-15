#!/usr/bin/env python3
"""Corroborate a retained static compression view with an independent MD5 model.

Only a closed integer-expression grammar is interpreted. No target instruction,
EXE, generated Python, arbitrary eval, real account or stored profile is run.
"""
import ast
import hashlib
import json
import math
import operator
import random
import re
import struct
from pathlib import Path

MASK = 0xffffffff
IV = (0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476)
OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul,
       ast.BitAnd: operator.and_, ast.BitOr: operator.or_, ast.BitXor: operator.xor,
       ast.LShift: operator.lshift, ast.RShift: operator.rshift}
UNARY = {ast.USub: operator.neg, ast.UAdd: operator.pos, ast.Invert: operator.invert}
SHIFTS = (7, 12, 17, 22) * 4 + (5, 9, 14, 20) * 4 + (4, 11, 16, 23) * 4 + (6, 10, 15, 21) * 4
CONSTANTS = tuple(int(abs(math.sin(i + 1)) * (1 << 32)) for i in range(64))


def reference_compress(state, words):
    a, b, c, d = state
    for i in range(64):
        if i < 16:
            f, g = (b & c) | (~b & d), i
        elif i < 32:
            f, g = (d & b) | (~d & c), (5 * i + 1) % 16
        elif i < 48:
            f, g = b ^ c ^ d, (3 * i + 5) % 16
        else:
            f, g = c ^ (b | ~d), (7 * i) % 16
        value = (a + f + CONSTANTS[i] + words[g]) & MASK
        rotated = ((value << SHIFTS[i]) | (value >> (32 - SHIFTS[i]))) & MASK
        a, b, c, d = d, (b + rotated) & MASK, b, c
    return tuple((x + y) & MASK for x, y in zip(state, (a, b, c, d)))


def parse_static_assignments(text):
    body = text.split('{', 1)[1].rsplit('}', 1)[0]
    assert not re.search(r'\b(if|for|while|goto|switch)\b', body)

    def state_name(match):
        offset = int(match[1], 0)
        assert offset in (8, 12, 16, 20)
        return 'state_' + str((offset - 8) // 4)

    body = re.sub(r'\*\((?:u?int) \*\)\(param_1 \+ (0x[0-9a-f]+|\d+)\)', state_name, body)
    body = re.sub(r'param_2\[(0x[0-9a-f]+|\d+)\]', lambda m: 'word_' + str(int(m[1], 0)), body)
    body = body.replace('*param_2', 'word_0')
    assignments = []
    for statement in body.split(';'):
        statement = statement.strip()
        if not statement or re.fullmatch(r'(?:u?int) [iu]Var\d+', statement):
            continue
        if statement == 'return 0':
            continue
        name, separator, expression = statement.partition('=')
        assert separator and re.fullmatch(r'(?:[iu]Var\d+|state_[0-3])', name.strip()), statement
        tree = ast.parse(expression.strip(), mode='eval').body
        for node in ast.walk(tree):
            assert isinstance(node, (ast.BinOp, ast.UnaryOp, ast.Name, ast.Constant, ast.Load, *OPS, *UNARY)), type(node)
            if isinstance(node, ast.Name):
                assert re.fullmatch(r'(?:[iu]Var\d+|state_[0-3]|word_(?:[0-9]|1[0-5]))', node.id)
            if isinstance(node, ast.Constant):
                assert type(node.value) is int
        assignments.append((name.strip(), tree))
    assert len(assignments) > 100
    assert {name for name, _ in assignments if name.startswith('state_')} == {'state_' + str(i) for i in range(4)}
    return assignments


def static_model(assignments, state, words):
    env = {'state_' + str(i): value for i, value in enumerate(state)}
    env.update({'word_' + str(i): value for i, value in enumerate(words)})

    def integer(node):
        if isinstance(node, ast.Constant):
            return node.value & MASK
        if isinstance(node, ast.Name):
            return env[node.id]
        if isinstance(node, ast.BinOp):
            return OPS[type(node.op)](integer(node.left), integer(node.right)) & MASK
        if isinstance(node, ast.UnaryOp):
            return UNARY[type(node.op)](integer(node.operand)) & MASK
        raise AssertionError(type(node))

    for name, tree in assignments:
        env[name] = integer(tree)
    return tuple(env['state_' + str(i)] for i in range(4))


def full_digest(compress, data):
    padded = data + b'\x80'
    padded += b'\0' * ((56 - len(padded)) % 64)
    padded += struct.pack('<Q', len(data) * 8)
    state = IV
    for start in range(0, len(padded), 64):
        state = compress(state, struct.unpack('<16I', padded[start:start + 64]))
    return struct.pack('<4I', *state)


def verify(record):
    assert record['subject']['digest']['sha256'] == 'c82fc98d3d274beadee91254e3343974d7c7fdaf2b2a32bc21cc81b76e85c152'
    assert record['operation'] == 'analyze_function'
    assert record['normalized_result']['procedure']['address'] == '0x441560'
    text = record['normalized_result']['pseudocode']
    assignments = parse_static_assignments(text)
    rng = random.Random(0x4d4f4c49)
    results = hashlib.sha256()
    for case in range(512):
        state = IV if case < 3 else tuple(rng.getrandbits(32) for _ in range(4))
        words = (0,) * 16 if case == 0 else ((MASK,) * 16 if case == 1 else tuple(rng.getrandbits(32) for _ in range(16)))
        actual = static_model(assignments, state, words)
        assert actual == reference_compress(state, words), case
        results.update(struct.pack('<4I16I4I', *state, *words, *actual))
    lengths = (0, 1, 3, 55, 56, 63, 64, 65, 127, 128, 255, 4096)
    for length in lengths:
        data = bytes((i * 17 + 3) & 255 for i in range(length))
        actual = full_digest(lambda state, words: static_model(assignments, state, words), data)
        assert actual == full_digest(reference_compress, data) == hashlib.md5(data).digest(), length
        results.update(actual)
    return {'schema': 'moli.launcher.metadata-md5-static-model.v1',
            'source_evidence_id': record['evidence_id'], 'source_procedure': '0x441560',
            'pseudocode_utf8_sha256': hashlib.sha256(text.encode()).hexdigest(),
            'authority': 'analyst-derived-static-model', 'original_target_executed': False,
            'integer_model': 'closed AST grammar with uint32 arithmetic; no arbitrary eval or target instructions',
            'assignments': len(assignments), 'compression_cases': 512, 'full_digest_lengths': list(lengths),
            'reference': 'independent mathematical64-round MD5; complete synthetic digests also match Python hashlib.md5',
            'case_results_sha256': results.hexdigest(),
            'limitation': 'Model/reference agreement corroborates the retained static view; it is not a Windows process or stored-profile runtime observation.'}


if __name__ == '__main__':
    path = Path(__file__).resolve().parents[2] / 'build/analysis/capability-launcher-id-metadata-v1/launcher-function-441560.json'
    print(json.dumps(verify(json.loads(path.read_text())), ensure_ascii=False))
