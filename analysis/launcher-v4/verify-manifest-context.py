#!/usr/bin/env python3
"""Read-only, fixed-identity PE manifest evidence; never executes target files.

Only RT_MANIFEST/1/1033 is traversed. No resource text or target bytes are
written or printed. This is an evidence checker, not a general PE/XML parser.
Python 3.9+ standard library only. stdout is JSON; failure exits nonzero.
"""
import datetime
import hashlib
import json
import os
from pathlib import Path
import platform
import stat
import struct
import sys
import xml.etree.ElementTree as ET

MAX_BYTES = 4 * 1024 * 1024
LAUNCHER_MANIFEST = "550db666b4812a36a4688487b35807d85c2025cf8d058a708675b78c5ca6abe3"
GAME_OS_IDS = [
    "{8e0f7a12-bfb3-4fe8-b9a5-48fd50a15a9a}",
    "{1f676c76-80e1-4239-95bb-83d0f6d0da78}",
    "{4a2f28e3-53b9-4441-ba9c-d69d4a4a6e38}",
    "{35138b9a-5d96-4fbd-8e2d-a2440225f93a}",
    "{e2011457-1546-43c5-a5fe-008deee3d3f0}",
]
SAMPLES = [
    {
        "role": "original_launcher",
        "path": "/tmp/moli-analysis/polcn/app/POLCN_Launcher.exe",
        "bytes": 599040,
        "sha256": "109b13382e7fbd96759f52e8cdb4bc269c379a613dbbf1ddd04a69a4a5c8ef0e",
        "manifest_offset": 0x91EB0,
        "manifest_bytes": 496,
        "manifest_sha256": LAUNCHER_MANIFEST,
        "level": "requireAdministrator",
        "supported_os": [],
    },
    {
        "role": "upx_unpacked_analysis_derivative",
        "path": "/tmp/moli-analysis/polcn/POLCN_Launcher.unpacked.exe",
        "bytes": 1735168,
        "sha256": "601b79565e4ac4c71605744a5087bb24582dde164f417514c74190cd4cdc6e31",
        "manifest_offset": 0x1A7638,
        "manifest_bytes": 496,
        "manifest_sha256": LAUNCHER_MANIFEST,
        "level": "requireAdministrator",
        "supported_os": [],
    },
    {
        "role": "original_game",
        "path": "/tmp/moli-analysis/crossgate/app/cg_se_3000.exe",
        "bytes": 2904064,
        "sha256": "9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126",
        "manifest_offset": 0x2C4458,
        "manifest_bytes": 822,
        "manifest_sha256": "3e9fb184c1a5da021cf6d4c78a440a2600aa656e27a99ee50aac85884fc862e9",
        "level": "asInvoker",
        "supported_os": GAME_OS_IDS,
    },
]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def span(data, offset, size):
    require(0 <= offset <= len(data) and 0 <= size <= len(data) - offset,
            "out-of-file range")
    return data[offset:offset + size]


def fields(data, offset, fmt):
    return struct.unpack(fmt, span(data, offset, struct.calcsize(fmt)))


def stable_read(sample):
    # O_NOFOLLOW checks the final file; /tmp itself may be a normal macOS alias.
    fd = os.open(sample["path"], os.O_RDONLY | os.O_NOFOLLOW)
    try:
        before = os.fstat(fd)
        require(stat.S_ISREG(before.st_mode), "sample is not a regular file")
        require(before.st_size == sample["bytes"] <= MAX_BYTES,
                "fixed sample size mismatch")
        chunks = []
        remaining = before.st_size + 1
        while remaining:
            chunk = os.read(fd, min(remaining, 1024 * 1024))
            if not chunk:
                break
            chunks.append(chunk)
            remaining -= len(chunk)
        data = b"".join(chunks)
        after = os.fstat(fd)
        current = os.stat(sample["path"], follow_symlinks=False)
        fingerprint = lambda x: (x.st_dev, x.st_ino, x.st_size,
                                  x.st_mtime_ns, x.st_ctime_ns)
        require(fingerprint(before) == fingerprint(after) == fingerprint(current),
                "sample changed during read")
    finally:
        os.close(fd)
    require(len(data) == sample["bytes"], "short or enlarged sample read")
    require(hashlib.sha256(data).hexdigest() == sample["sha256"],
            "fixed sample SHA256 mismatch")
    return data


def manifest_payload(data, sample):
    require(span(data, 0, 2) == b"MZ", "missing MZ")
    pe, = fields(data, 0x3C, "<I")
    require(span(data, pe, 4) == b"PE\0\0", "missing PE signature")
    machine, count = fields(data, pe + 4, "<HH")
    optional_bytes, = fields(data, pe + 20, "<H")
    require(machine == 0x14C and 1 <= count <= 96, "unexpected PE architecture/sections")
    optional = pe + 24
    span(data, optional, optional_bytes)
    require(optional_bytes >= 120, "short PE32 optional header")
    magic, = fields(data, optional, "<H")
    directory_count, = fields(data, optional + 92, "<I")
    require(magic == 0x10B and 3 <= directory_count <= 16,
            "unexpected optional header/directories")
    require(optional_bytes >= 96 + directory_count * 8, "short directory table")
    resource_rva, resource_bytes = fields(data, optional + 112, "<II")
    require(resource_rva > 0 and 16 <= resource_bytes <= MAX_BYTES,
            "missing or excessive resource directory")
    require(resource_rva + resource_bytes <= 0x100000000, "resource RVA overflow")
    sections = []
    table = optional + optional_bytes
    span(data, table, count * 40)
    for index in range(count):
        virtual_size, rva, raw_size, raw_offset = fields(data, table + index * 40 + 8, "<IIII")
        require(rva + max(virtual_size, raw_size) <= 0x100000000,
                "section RVA overflow")
        if raw_size:
            span(data, raw_offset, raw_size)
            sections.append((rva, raw_size, raw_offset))

    def map_rva(rva, size):
        require(0 <= rva and 0 < size and rva + size <= 0x100000000,
                "invalid mapped RVA range")
        matches = [offset + rva - start for start, raw_size, offset in sections
                   if start <= rva and rva + size <= start + raw_size]
        require(len(matches) == 1, "RVA is not uniquely file-backed")
        span(data, matches[0], size)
        return matches[0]

    def resource_range(relative, size):
        require(0 <= relative and 0 < size and relative + size <= resource_bytes,
                "range exceeds declared resource directory")
        return map_rva(resource_rva + relative, size)

    visited = set()

    def directory_entry(relative, wanted, is_directory):
        require(relative not in visited, "resource directory cycle")
        visited.add(relative)
        offset = resource_range(relative, 16)
        named, ids = fields(data, offset + 12, "<HH")
        require(0 < named + ids <= 512, "invalid or excessive resource entry count")
        entries_offset = resource_range(relative + 16, 8 * (named + ids))
        matches = []
        seen_ids = set()
        for index in range(named + ids):
            name, pointer = fields(data, entries_offset + 8 * index, "<II")
            if not name & 0x80000000:
                require(name not in seen_ids, "duplicate resource identifier")
                seen_ids.add(name)
                if name == wanted:
                    matches.append(pointer)
        require(len(matches) == 1, "required resource identifier missing/ambiguous")
        pointer = matches[0]
        require(bool(pointer & 0x80000000) == is_directory,
                "resource node kind mismatch")
        return pointer & 0x7FFFFFFF

    type_node = directory_entry(0, 24, True)
    name_node = directory_entry(type_node, 1, True)
    entry_node = directory_entry(name_node, 1033, False)
    entry_offset = resource_range(entry_node, 16)
    rva, size, code_page, reserved = fields(data, entry_offset, "<IIII")
    require(reserved == 0 and 0 < size <= 4096, "unexpected manifest data entry")
    offset = map_rva(rva, size)
    require(offset == sample["manifest_offset"] and size == sample["manifest_bytes"],
            "manifest mapping differs from fixed evidence")
    payload = span(data, offset, size)
    require(hashlib.sha256(payload).hexdigest() == sample["manifest_sha256"],
            "manifest SHA256 mismatch")
    return payload, {
        "type_id": 24, "name_id": 1, "language_id": 1033,
        "data_entry_file_offset": hex(entry_offset),
        "payload_rva": hex(rva), "payload_file_offset": hex(offset),
        "bytes": size, "sha256": sample["manifest_sha256"], "code_page": code_page,
    }


def declarations(payload, sample):
    require(b"<!DOCTYPE" not in payload.upper() and b"<!ENTITY" not in payload.upper(),
            "DTD/entity declaration rejected")
    root = ET.fromstring(payload.rstrip(b"\0"))
    require(root.tag == "{urn:schemas-microsoft-com:asm.v1}assembly", "unexpected XML root")
    level_tag = "{urn:schemas-microsoft-com:asm.v3}requestedExecutionLevel"
    os_tag = "{urn:schemas-microsoft-com:compatibility.v1}supportedOS"
    levels = list(root.iter(level_tag))
    require(len(levels) == 1, "execution level missing/ambiguous")
    level = levels[0].attrib
    require(level == {"level": sample["level"], "uiAccess": "false"},
            "execution-level declaration mismatch")
    supported = list(root.iter(os_tag))
    require(all(set(x.attrib) == {"Id"} for x in supported),
            "unexpected supportedOS attributes")
    ids = [x.attrib["Id"] for x in supported]
    require(ids == sample["supported_os"], "supportedOS declaration mismatch")
    return {"requested_execution_level": level["level"], "ui_access": False,
            "supported_os_count": len(ids), "supported_os_ids": ids}


def main():
    require(len(sys.argv) == 1, "no path/identity override is accepted")
    records, payloads = [], []
    for sample in SAMPLES:
        data = stable_read(sample)
        payload, resource = manifest_payload(data, sample)
        records.append({
            "role": sample["role"], "path": sample["path"], "bytes": len(data),
            "sha256": sample["sha256"], "machine": "0x14c", "pe_optional_magic": "0x10b",
            "resource": resource, "declarations": declarations(payload, sample),
            "verification": "pass",
        })
        payloads.append(payload)
    require(payloads[0] == payloads[1], "original/unpacked manifest bytes differ")
    checker = Path(__file__).read_bytes()
    result = {
        "schema": "moli-manifest-context-v1",
        "observed_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "method": "Fixed identities; bounded read-only PE32 resource traversal RT_MANIFEST/1/1033; bounded XML declaration extraction",
        "tool": {"python": platform.python_version(), "verifier": Path(__file__).name,
                 "verifier_sha256": hashlib.sha256(checker).hexdigest()},
        "status": "pass", "samples_verified": len(records), "samples": records,
        "original_unpacked_manifest_exact_byte_identity": True,
        "source_installers": [
            {"path": "moli/POLCN_Setup.exe", "sha256": "dc90bb88e35a82a649f1c026bd0b7b6e7039ddbe5e872f40ffebfb4b16b0fb11"},
            {"path": "moli/CrossGate_Setup.exe", "sha256": "e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983"},
        ],
        "provenance": {
            "installer_hashes": "Previously recorded in analysis/input-manifest.json; not rehashed by this checker",
            "source_authenticity": "Unverified",
            "prior_resources": ["analysis/launcher/rea-unpacked-pe-resources.json", "analysis/game/rea-cg_se_3000.exe-resources.json"],
            "launcher_derivative": "Existing standard UPX offline decompression; derivative is for static analysis, not the executable proposed for launch",
        },
        "facts": [
            "Original launcher and unpacked derivative both declare requireAdministrator, uiAccess=false, with identical manifest bytes",
            "Original game declares asInvoker, uiAccess=false and five supportedOS IDs",
        ],
        "unknowns": [
            "Actual Windows compatibility-mode configuration, required version and target executable are not established",
            "Manifest declarations do not establish actual runtime token, successful launch or official protocol compatibility",
        ],
        "next_experiment_boundary": [
            "Obtain the intended compatibility-mode version and target executable before proposing a setting change",
            "Launcher execution and its administrator/UAC requirement need explicit scoped authorization; the consumed ordinary-rights game one-shot does not cover them",
            "No manifest patch, RunAsInvoker workaround, UAC disabling, account login, network enabling or updater execution is authorized by this evidence",
        ],
        "limits": [
            "Only three fixed samples and one resource path per sample are checked; this is not a general parser validation or full resource inventory",
            "No XML payload, executable bytes, credentials, memory or account session data are saved",
            "No application, VM, network, compatibility setting or security policy is operated by this checker",
            "The supportedOS IDs are declarations, not proof that any compatibility shim is configured or required",
        ],
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, struct.error, ET.ParseError) as exc:
        # Fixed checks emit labels only; no resource payload is exposed.
        print(json.dumps({"status": "fail", "error_type": type(exc).__name__,
                          "reason": str(exc)}, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)
