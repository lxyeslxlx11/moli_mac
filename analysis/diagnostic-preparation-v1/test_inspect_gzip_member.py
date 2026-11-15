"""Original synthetic data only; no supplied game/member bytes in tests."""
import gzip
import hashlib
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from inspect_gzip_member import GzipInspectionError, inspect_member


class GzipMemberTests(unittest.TestCase):
    def setUp(self):
        self.plain = b"Moli original gzip inspection fixture.\x00" * 32
        self.compressed = gzip.compress(self.plain, mtime=0)

    def rejects(self, code, data, **limits):
        with self.assertRaises(GzipInspectionError) as caught:
            inspect_member(data, **limits)
        self.assertEqual(caught.exception.code, code)

    def test_complete_member_and_independent_roundtrip(self):
        plain, receipt = inspect_member(self.compressed)
        self.assertEqual(plain, self.plain)
        self.assertEqual(gzip.decompress(self.compressed), plain)
        self.assertEqual(receipt["declared_isize"], len(self.plain))
        self.assertEqual(receipt["declared_crc32"], receipt["observed_crc32"])

    def test_corrupt_crc_is_rejected(self):
        corrupted = bytearray(self.compressed)
        corrupted[-8] ^= 1
        self.rejects("INTEGRITY_OR_FORMAT", bytes(corrupted))

    def test_truncated_trailer_is_rejected(self):
        self.rejects("INCOMPLETE_MEMBER", self.compressed[:-1])

    def test_concatenated_members_are_not_silently_ignored(self):
        self.rejects("TRAILING_INPUT", self.compressed + self.compressed)

    def test_trailing_junk_is_rejected(self):
        self.rejects("TRAILING_INPUT", self.compressed + b"original trailing bytes")

    def test_expansion_limit_rejects_compressible_input(self):
        self.rejects("OUTPUT_LIMIT", self.compressed, output_limit=100)

    def test_compressed_input_limit(self):
        self.rejects("INPUT_LIMIT", self.compressed, input_limit=8)

    def test_non_gzip_and_invalid_limits(self):
        self.rejects("GZIP_HEADER", b"Moli original non gzip input")
        self.rejects("INVALID_LIMIT", self.compressed, output_limit=0)

    def test_cli_refuses_existing_output_and_preserves_it(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder).resolve()
            source = root / "original-fixture.gz"
            source.write_bytes(self.compressed)
            output = root / "existing"
            output.mkdir()
            sentinel = output / "member.bin"
            sentinel.write_bytes(b"original owned sentinel")
            result = subprocess.run(
                [sys.executable, str(Path(__file__).with_name("inspect_gzip_member.py").resolve()),
                 str(source), "--sha256", hashlib.sha256(self.compressed).hexdigest(),
                 "--output", str(output)], capture_output=True, timeout=5)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(sentinel.read_bytes(), b"original owned sentinel")
            self.assertEqual(source.read_bytes(), self.compressed)

    def test_cli_hash_mismatch_creates_no_output(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder).resolve()
            source = root / "original-fixture.gz"
            source.write_bytes(self.compressed)
            output = root / "must-not-exist"
            result = subprocess.run(
                [sys.executable, str(Path(__file__).with_name("inspect_gzip_member.py").resolve()),
                 str(source), "--sha256", "0" * 64, "--output", str(output)],
                capture_output=True, timeout=5)
            self.assertNotEqual(result.returncode, 0)
            self.assertFalse(output.exists())
            self.assertEqual(source.read_bytes(), self.compressed)


if __name__ == "__main__":
    unittest.main()
