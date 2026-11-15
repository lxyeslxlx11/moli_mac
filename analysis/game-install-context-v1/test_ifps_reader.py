#!/usr/bin/env python3
"""Qualify the pinned static IFPS reader with original in-memory fixtures.

Run with Python 3.12 -I and explicit private source/dependency directories.
No installer, target script, emulator, imported target API, or registry is run.
This is a narrow reader qualification, not an IFPS runtime or a safety audit.
"""

import argparse
import hashlib
import struct
import sys
import unittest
from pathlib import Path


READER_SHA256 = 'b8261fc2a4a1c0f5a09685366dd1d602c2110d1fb0cce09f906c91862f17e993'
IFPSFile = Op = COp = None


def u32(value):
    return struct.pack('<I', value)


def counted(data):
    return u32(len(data)) + data


def variable(index):
    return b'\x00' + u32(index)


def integer(value):
    return b'\x01' + u32(0) + struct.pack('<i', value)


def unicode_literal(text):
    data = text.encode('utf-16-le')
    return b'\x01' + u32(1) + u32(len(data) // 2) + data


def fixture(functions):
    """Original IFPS23: S32, UnicodeString, U08, exported internal functions."""
    types = b''.join(bytes([code]) + u32(0) for code in (6, 28, 1))
    header = struct.pack('<7I', 1397769801, 23, 3, len(functions), 0, 0, 0)
    declarations = [(name.encode('ascii'), decl, body) for name, decl, body in functions]
    offset = len(header) + len(types)
    offset += sum(9 + 4 + len(name) + 4 + len(decl) for name, decl, _ in declarations)
    table = bytearray()
    bodies = bytearray()
    for name, decl, body in declarations:
        table += b'\x02' + u32(offset) + u32(len(body)) + counted(name) + counted(decl)
        bodies += body
        offset += len(body)
    return header + types + table + bodies


class ReaderQualification(unittest.TestCase):
    def parse(self, data):
        return IFPSFile.Parse(data, unicode=True)

    def test_exported_name_and_return(self):
        parsed = self.parse(fixture([('FixtureReturn', b'-1', b'\x09')]))
        self.assertEqual((parsed.version, parsed.count_types, parsed.count_functions), (23, 3, 1))
        self.assertEqual(parsed.functions[0].name, 'FixtureReturn')
        self.assertEqual([i.opcode for i in parsed.functions[0].body], [Op.Ret])
        self.assertIn('Ret', parsed.disassembly(True))

    def test_direct_call_resolution(self):
        parsed = self.parse(fixture([
            ('FixtureCaller', b'-1', b'\x05' + u32(1) + b'\x09'),
            ('FixtureCallee', b'-1', b'\x09'),
        ]))
        call = parsed.functions[0].body[0]
        self.assertIs(call.opcode, Op.Call)
        self.assertIs(call.operands[0], parsed.functions[1])
        self.assertEqual(call.encoded, b'\x05\x01\x00\x00\x00')
        self.assertIn('FixtureCallee', parsed.disassembly(True))

    def test_utf16_literal_including_surrogate_pair(self):
        text = 'Fixture\\目录😀'
        body = b'\x0b' + u32(1)
        body += b'\x00' + variable(0x60000001) + unicode_literal(text) + b'\x04\x09'
        parsed = self.parse(fixture([('FixtureText', b'-1', body)]))
        assignment = parsed.functions[0].body[1]
        self.assertIs(assignment.opcode, Op.Assign)
        self.assertEqual(assignment.operands[1].value.value, text)
        self.assertEqual(assignment.operands[1].value.type.code.value, 28)

    def test_signed_32_bit_literal(self):
        body = b'\x0b' + u32(0)
        body += b'\x00' + variable(0x60000001) + integer(-2147483647) + b'\x04\x09'
        parsed = self.parse(fixture([('FixtureSigned', b'-1', body)]))
        value = parsed.functions[0].body[1].operands[1].value.value
        self.assertEqual(value, -2147483647)
        self.assertEqual(value & 0xFFFFFFFF, 0x80000001)

    def test_greater_than_zero_comparison(self):
        body = b'\x0b' + u32(0)
        body += b'\x00' + variable(0x60000001) + integer(3)
        body += b'\x0c\x02' + variable(0x5FFFFFFF) + variable(0x60000001) + integer(0)
        body += b'\x04\x09'
        parsed = self.parse(fixture([('FixtureCompare', b'2', body)]))
        compare = parsed.functions[0].body[2]
        self.assertIs(compare.opcode, Op.Compare)
        self.assertIs(compare.operator, COp.GT)
        self.assertEqual(str(compare.operands[0]), 'ReturnValue')
        self.assertEqual(compare.operands[2].value.value, 0)
        self.assertIn('> 0', parsed.disassembly(True))

    def test_invalid_headers(self):
        good = fixture([('FixtureHeader', b'-1', b'\x09')])
        with self.subTest(case='bad magic'), self.assertRaises(ValueError):
            self.parse(b'NOPE' + good[4:])
        with self.subTest(case='truncated header'), self.assertRaises(Exception):
            self.parse(good[:15])
        with self.subTest(case='unsupported version'), self.assertRaises(NotImplementedError):
            self.parse(good[:4] + u32(24) + good[8:])

    def test_invalid_callee_and_opcode(self):
        with self.subTest(case='callee out of range'), self.assertRaises(IndexError):
            self.parse(fixture([('FixtureBadCall', b'-1', b'\x05' + u32(99) + b'\x09')]))
        with self.subTest(case='unsupported opcode'), self.assertRaises(ValueError):
            self.parse(fixture([('FixtureBadOpcode', b'-1', b'\xdd')]))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-dir', type=Path, required=True)
    parser.add_argument('--deps-dir', type=Path, required=True)
    args = parser.parse_args()
    if sys.version_info < (3, 11):
        parser.error('The pinned upstream reader requires Python >=3.11.')
    reader = args.source_dir / 'refinery/lib/inno/ifps.py'
    if hashlib.sha256(reader.read_bytes()).hexdigest() != READER_SHA256:
        parser.error('Reader identity does not match the qualified upstream source.')
    sys.path[:0] = [str(args.deps_dir.resolve()), str(args.source_dir.resolve())]
    global IFPSFile, Op, COp
    from refinery.lib.inno.ifps import IFPSFile, Op, COp
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(ReaderQualification)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    sys.exit(main())
