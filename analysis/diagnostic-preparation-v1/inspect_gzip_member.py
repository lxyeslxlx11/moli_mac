"""Bounded ordinary gzip inspection for supplied local analysis material.

This does not execute the member, interpret embedded instructions, or reconstruct
protected images. Only one complete RFC1952 member without trailing input is
admitted. Archive names are never used as filesystem paths.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import platform
import struct
import zlib


class GzipInspectionError(ValueError):
    def __init__(self, code: str):
        self.code = code
        super().__init__(code)


def inspect_member(source: bytes, *, input_limit: int = 1024 * 1024,
                   output_limit: int = 8 * 1024 * 1024) -> tuple[bytes, dict]:
    if (type(input_limit) is not int or type(output_limit) is not int
            or not 1 <= input_limit <= 16 * 1024 * 1024
            or not 1 <= output_limit <= 64 * 1024 * 1024):
        raise GzipInspectionError("INVALID_LIMIT")
    if not isinstance(source, bytes):
        raise GzipInspectionError("INVALID_INPUT")
    if len(source) > input_limit:
        raise GzipInspectionError("INPUT_LIMIT")
    if len(source) < 18 or source[:3] != b"\x1f\x8b\x08":
        raise GzipInspectionError("GZIP_HEADER")
    decoder = zlib.decompressobj(16 + zlib.MAX_WBITS)
    try:
        # The extra byte detects overflow without allocating an unbounded body.
        member = decoder.decompress(source, output_limit + 1)
    except zlib.error as error:
        raise GzipInspectionError("INTEGRITY_OR_FORMAT") from error
    if len(member) > output_limit or decoder.unconsumed_tail:
        raise GzipInspectionError("OUTPUT_LIMIT")
    if not decoder.eof:
        raise GzipInspectionError("INCOMPLETE_MEMBER")
    if decoder.unused_data:
        raise GzipInspectionError("TRAILING_INPUT")
    expected_crc, expected_size = struct.unpack_from("<II", source, len(source) - 8)
    actual_crc = zlib.crc32(member) & 0xffffffff
    if actual_crc != expected_crc or len(member) != expected_size:
        raise GzipInspectionError("INTEGRITY_OR_FORMAT")
    return member, {
        "schema": "moli.single-gzip-member.v1",
        "format": "gzip",
        "member_count": 1,
        "source_bytes": len(source),
        "source_sha256": hashlib.sha256(source).hexdigest(),
        "expanded_bytes": len(member),
        "expanded_sha256": hashlib.sha256(member).hexdigest(),
        "declared_crc32": f"0x{expected_crc:08x}",
        "observed_crc32": f"0x{actual_crc:08x}",
        "declared_isize": expected_size,
        "complete_stream": True,
        "trailing_bytes": 0,
        "input_limit": input_limit,
        "output_limit": output_limit,
        "python_version": platform.python_version(),
        "zlib_compile_version": zlib.ZLIB_VERSION,
        "zlib_runtime_version": zlib.ZLIB_RUNTIME_VERSION,
        "trust": "format integrity only; no publisher or semantic verification",
        "target_executed": False,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--sha256", required=True)
    parser.add_argument("--output", type=Path, required=True,
                        help="New private directory; existing directories are refused")
    args = parser.parse_args()
    if not args.source.is_absolute() or not args.output.is_absolute():
        parser.error("Use absolute source and output paths")
    if args.output.exists() or args.output.is_symlink():
        parser.error("Output already exists")
    # Read at most one byte beyond the fixed compressed-input budget.
    with args.source.open("rb") as handle:
        source = handle.read(1024 * 1024 + 1)
    if hashlib.sha256(source).hexdigest() != args.sha256:
        parser.error("Source SHA256 differs from the expected supplied artifact")
    member, receipt = inspect_member(source)
    args.output.mkdir(mode=0o700)
    with (args.output / "member.bin").open("xb") as handle:
        handle.write(member)
    with args.source.open("rb") as handle:
        after = handle.read(1024 * 1024 + 1)
    if after != source:
        raise GzipInspectionError("SOURCE_CHANGED")
    receipt["source_unchanged_after_output"] = True
    with (args.output / "inspection.json").open("x") as handle:
        json.dump(receipt, handle, indent=2)
        handle.write("\n")
    print(json.dumps(receipt, sort_keys=True))


if __name__ == "__main__":
    main()
