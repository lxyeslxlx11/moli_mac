"""Synthetic-only boundary tests. Contains no official resource bytes."""
import struct
import unittest
from raw_graphic_oracle import InvalidGraphic, UnsupportedVersion, decode_raw, parse_record

def fixture(version=0, width=2, height=2, palette_bytes=6):
    pixels = bytes([0, 1, 1, 0])
    body = pixels if version == 0 else struct.pack('<I', palette_bytes)+pixels+bytes(palette_bytes)
    # Deliberately unrelated word@12: raw variants do not use it as record size.
    payload = struct.pack('<2sBBIII', b'RD', version, 171, width, height, 0xdeadbeef)+body
    index = struct.pack('<IIIiiII4BII', 91, 0, len(payload), -2, 3, width, height, 1, 1, 0, 0, 0, 900)
    return index, payload

class RawOracleTests(unittest.TestCase):
    def test_v0_opaque_word_and_origins(self):
        index, payload = fixture()
        pixels, meta = decode_raw(parse_record(index, 0, len(payload)), payload)
        self.assertEqual(pixels, bytes([0, 1, 1, 0]))
        self.assertEqual((meta['origin_x'], meta['origin_y']), (-2, 3))
        self.assertEqual(meta['opaque_word12'], 0xdeadbeef)

    def test_v2_short_palette(self):
        index, payload = fixture(2, palette_bytes=6)
        _, meta = decode_raw(parse_record(index, 0, len(payload)), payload)
        self.assertEqual(meta['candidate_palette_bytes'], 6)

    def test_wrong_dimension(self):
        index, payload = fixture()
        damaged = bytearray(payload)
        struct.pack_into('<I', damaged, 4, 3)
        with self.assertRaises(InvalidGraphic):
            decode_raw(parse_record(index, 0, len(payload)), damaged)

    def test_truncated_record_and_outside_archive(self):
        index, payload = fixture()
        with self.assertRaises(InvalidGraphic): parse_record(index, 0, len(payload)-1)
        with self.assertRaises(InvalidGraphic): parse_record(index[:-1], 0, len(payload))
        with self.assertRaises(InvalidGraphic): parse_record(index, -1, len(payload))
        with self.assertRaises(InvalidGraphic): parse_record(index, 1, len(payload))

    def test_unsupported_compressed_version(self):
        index, payload = fixture()
        damaged = bytearray(payload)
        damaged[2] = 1
        with self.assertRaises(UnsupportedVersion):
            decode_raw(parse_record(index, 0, len(payload)), damaged)

    def test_palette_byte_extent(self):
        index, payload = fixture(2)
        damaged = bytearray(payload)
        damaged[20] = 2
        with self.assertRaises(InvalidGraphic):
            decode_raw(parse_record(index, 0, len(payload)), damaged)

    def test_invalid_palette_size_and_trailing_bytes(self):
        for count in (0, 5, 771):
            index, payload = fixture(2, palette_bytes=count)
            with self.assertRaises(InvalidGraphic):
                decode_raw(parse_record(index, 0, len(payload)), payload)
        index, payload = fixture()
        enlarged = bytearray(index)
        struct.pack_into('<I', enlarged, 8, len(payload)+1)
        with self.assertRaises(InvalidGraphic):
            decode_raw(parse_record(enlarged, 0, len(payload)+1), payload+b'\0')

    def test_dimension_budget_before_allocation(self):
        index, payload = fixture()
        damaged = bytearray(index)
        struct.pack_into('<I', damaged, 20, 0xffffffff)
        with self.assertRaises(InvalidGraphic): parse_record(damaged, 0, len(payload))

if __name__ == '__main__': unittest.main()
