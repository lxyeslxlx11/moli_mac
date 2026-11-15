import hashlib
import struct
import unittest
from fixture_oracle import FIXTURE, expected_fixture_text, verify_fixture_snapshot


class FixtureOracleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.image = FIXTURE.read_bytes()

    def test_preferred_base_matches_original_text_digest(self):
        text, report = expected_fixture_text(self.image, 0x400000)
        self.assertEqual(hashlib.sha256(text).hexdigest(),
                         'c9db2d224a7f56cda6217c60d5abd3646970117be2a11a54cbbbe45566837e79')
        self.assertEqual(report['highlow_fixups'], 245)

    def test_negative_delta_three_original_word_anchors(self):
        text, _ = expected_fixture_text(self.image, 0x360000)
        for rva, old in [(4193, 19292588), (4206, 4214812), (4221, 4214816)]:
            self.assertEqual(struct.unpack_from('<I', text, rva - 4096)[0], old - 0xa0000)

    def test_positive_delta_three_original_word_anchors(self):
        text, _ = expected_fixture_text(self.image, 0x6a0000)
        for rva, old in [(4193, 19292588), (4206, 4214812), (4221, 4214816)]:
            self.assertEqual(struct.unpack_from('<I', text, rva - 4096)[0], old + 0x2a0000)

    def test_other_image_rejected(self):
        with self.assertRaises(ValueError):
            expected_fixture_text(self.image[:-1], 0x400000)

    def test_malformed_base_rejected(self):
        for base in [0, True, -65536, 0x360001, 0xffff0000, 0x100000000]:
            with self.subTest(base=base), self.assertRaises(ValueError):
                expected_fixture_text(self.image, base)

    def test_snapshot_wrong_length_byte_and_base_are_distinct_failures(self):
        text, _ = expected_fixture_text(self.image, 0x360000)
        self.assertTrue(verify_fixture_snapshot(self.image, 0x360000, text)['bytes_equal'])
        self.assertFalse(verify_fixture_snapshot(self.image, 0x360000, text[:-1])['bytes_equal'])
        changed = bytearray(text)
        changed[-1] ^= 1
        self.assertFalse(verify_fixture_snapshot(self.image, 0x360000, changed)['bytes_equal'])
        self.assertFalse(verify_fixture_snapshot(self.image, 0x400000, text)['bytes_equal'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
