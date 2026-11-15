#!/usr/bin/env python3
"""Read-only, fail-closed configuration audit for the moli-mac blank UTM VM.

Reads only config.plist (at most 64 KiB) and filesystem metadata. It never opens
guest disks, starts a VM, changes configuration, or proves runtime containment.
Unknown configuration keys are rejected pending explicit review of this schema.
Python 3.9+, standard library only. Exit 0 = this configuration policy passed.
"""

import argparse
import hashlib
import json
import os
from pathlib import Path
import plistlib
import stat
from xml.parsers.expat import ExpatError


MAX_CONFIG_BYTES = 64 * 1024
MAX_DRIVES = 8
MAX_ENTRIES = 32
MAX_CHECKS = 160

# Deliberately version-specific. No unknown key is silently ignored.
KEYS = {
    "root": {"Backend", "ConfigurationVersion", "Display", "Drive",
             "Information", "Input", "Network", "QEMU", "Serial", "Sharing",
             "Sound", "System"},
    "Display": {"DownscalingFilter", "DynamicResolution", "Hardware",
                "NativeResolution", "UpscalingFilter"},
    "Drive": {"Identifier", "ImageName", "ImageType", "Interface",
              "InterfaceVersion", "ReadOnly"},
    "Information": {"IconCustom", "Name", "Notes", "UUID"},
    "Input": {"MaximumUsbShare", "UsbBusSupport", "UsbSharing"},
    "QEMU": {"AdditionalArguments", "BalloonDevice", "DebugLog", "Hypervisor",
             "PS2Controller", "RNGDevice", "RTCLocalTime", "TPMDevice", "TSO",
             "UEFIBoot"},
    "Sharing": {"ClipboardSharing", "DirectoryShareMode", "DirectoryShareReadOnly"},
    "System": {"Architecture", "CPU", "CPUCount", "CPUFlagsAdd",
               "CPUFlagsRemove", "ForceMulticore", "JITCacheSize", "MemorySize",
               "Target"},
}


def _regular_metadata(path):
    """lstat only: do not follow the final component or open its data."""
    try:
        st = path.lstat()
    except OSError:
        return None
    if not stat.S_ISREG(st.st_mode) or st.st_nlink != 1:
        return None
    return {"bytes": st.st_size, "allocated_bytes": st.st_blocks * 512}


def audit_vm(bundle):
    bundle = Path(bundle).absolute()
    checks = []
    report = {
        "schema_version": 1,
        "policy": "moli-mac-blank-arm64-offline-v1",
        "vm_bundle": str(bundle)[:4096],
        "passed": False,
        "scope": "config.plist and filesystem metadata only",
        "limitations": [
            "A point-in-time configuration check; not proof of runtime isolation.",
            "Guest disk contents, OS installation and network runtime were not inspected.",
            "External UTM preferences, runtime overrides and later mutations are outside this audit.",
        ],
        "checks": checks,
        "drives": [],
    }

    def check(code, condition):
        # Codes are authored here; never emit untrusted plist text or secrets.
        if len(checks) < MAX_CHECKS:
            checks.append({"check": code, "passed": bool(condition)})
        return bool(condition)

    def finish():
        report["passed"] = bool(checks) and all(c["passed"] for c in checks)
        report["failed_checks"] = [c["check"] for c in checks if not c["passed"]]
        return report

    def schema(value, section, prefix):
        if not check(prefix + ".dictionary", type(value) is dict):
            return False
        return check(prefix + ".exact_known_keys", set(value) == KEYS[section])

    def exact(mapping, key, expected, prefix):
        value = mapping.get(key)
        check(prefix + "." + key, type(value) is type(expected) and value == expected)

    try:
        root_st = bundle.lstat()
    except OSError:
        check("bundle.exists", False)
        return finish()
    if not check("bundle.real_directory", stat.S_ISDIR(root_st.st_mode)):
        return finish()

    config_path = bundle / "config.plist"
    if not check("config.regular_single_link", _regular_metadata(config_path) is not None):
        return finish()
    try:
        fd = os.open(config_path, os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0))
        with os.fdopen(fd, "rb") as stream:
            before = os.fstat(stream.fileno())
            raw = stream.read(MAX_CONFIG_BYTES + 1)
            after = os.fstat(stream.fileno())
        check("config.stable_while_reading", (before.st_ino, before.st_size, before.st_mtime_ns)
              == (after.st_ino, after.st_size, after.st_mtime_ns))
    except OSError:
        check("config.readable_without_final_symlink", False)
        return finish()
    report["config_bytes"] = len(raw)
    if not check("config.bounded_size", len(raw) <= MAX_CONFIG_BYTES):
        return finish()
    report["config_sha256"] = hashlib.sha256(raw).hexdigest()
    try:
        config = plistlib.loads(raw)
    except (plistlib.InvalidFileException, ValueError, TypeError, OverflowError, ExpatError, RecursionError):
        check("config.valid_plist", False)
        return finish()
    if not schema(config, "root", "config"):
        return finish()

    exact(config, "Backend", "QEMU", "config")
    exact(config, "ConfigurationVersion", 4, "config")
    for key in ("Network", "Sound", "Serial"):
        exact(config, key, [], "config")

    for section in ("Information", "Input", "QEMU", "Sharing", "System"):
        schema(config[section], section, section)
    # Continue only when field access is safe; unknown keys remain failures.
    if any(type(config[s]) is not dict for s in ("Information", "Input", "QEMU", "Sharing", "System")):
        return finish()

    for section, values in {
        "System": {"Architecture": "aarch64", "CPU": "default", "CPUCount": 4,
                   "MemorySize": 8192, "Target": "virt", "CPUFlagsAdd": [],
                   "CPUFlagsRemove": [], "ForceMulticore": False, "JITCacheSize": 0},
        "Input": {"UsbSharing": False, "UsbBusSupport": "3.0", "MaximumUsbShare": 3},
        "Sharing": {"ClipboardSharing": False, "DirectoryShareMode": "None",
                    "DirectoryShareReadOnly": False},
        "QEMU": {"AdditionalArguments": [], "Hypervisor": True, "TPMDevice": True,
                 "UEFIBoot": True, "BalloonDevice": False, "DebugLog": False,
                 "PS2Controller": False, "RNGDevice": True, "RTCLocalTime": True,
                 "TSO": False},
        "Information": {"IconCustom": False},
    }.items():
        for key, expected in values.items():
            exact(config[section], key, expected, section)
    for key in ("Name", "Notes", "UUID"):
        value = config["Information"].get(key)
        check("Information." + key + ".bounded_text", type(value) is str and len(value) <= 4096)

    displays = config["Display"]
    if check("Display.single", type(displays) is list and len(displays) == 1):
        display = displays[0]
        if schema(display, "Display", "Display.0"):
            for key, value in {"DownscalingFilter": "Linear", "DynamicResolution": True,
                               "Hardware": "virtio-ramfb", "NativeResolution": False,
                               "UpscalingFilter": "Linear"}.items():
                exact(display, key, value, "Display.0")

    data = bundle / "Data"
    try:
        data_st = data.lstat()
    except OSError:
        check("Data.real_directory", False)
        return finish()
    if not check("Data.real_directory", stat.S_ISDIR(data_st.st_mode)):
        return finish()
    drives = config["Drive"]
    if not check("Drive.bounded_nonempty_list", type(drives) is list and 1 <= len(drives) <= MAX_DRIVES):
        return finish()
    names = set()
    for index, drive in enumerate(drives):
        prefix = "Drive." + str(index)
        if not schema(drive, "Drive", prefix):
            continue
        name = drive["ImageName"]
        basename = (type(name) is str and 0 < len(name) <= 255 and name not in (".", "..")
                    and "/" not in name and "\\" not in name and "\x00" not in name
                    and name.endswith(".qcow2"))
        if not check(prefix + ".internal_qcow2_basename", basename):
            continue
        check(prefix + ".unique_image", name not in names)
        names.add(name)
        for key, expected in {"ImageType": "Disk", "Interface": "VirtIO",
                              "InterfaceVersion": 1, "ReadOnly": False}.items():
            exact(drive, key, expected, prefix)
        check(prefix + ".bounded_identifier", type(drive["Identifier"]) is str
              and 0 < len(drive["Identifier"]) <= 128)
        metadata = _regular_metadata(data / name)
        check(prefix + ".regular_single_link_internal_file", metadata is not None)
        if metadata is not None:
            report["drives"].append({"index": index, "internal_basename": True, **metadata})

    # A blank machine has only its internal disks and UEFI/TPM state. Refuse
    # unexpected entries without opening any of their contents.
    expected_entries = names | {"efi_vars.fd", "tpmdata"}
    try:
        entries = []
        with os.scandir(data) as iterator:
            for entry in iterator:
                entries.append(entry.name)
                if len(entries) > MAX_ENTRIES:
                    break
        if check("Data.bounded_entries", len(entries) <= MAX_ENTRIES):
            check("Data.only_expected_entries", set(entries) == expected_entries)
            check("Data.all_regular_single_link", all(_regular_metadata(data / name) is not None for name in entries))
    except OSError:
        check("Data.metadata_readable", False)
    return finish()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("bundle", type=Path, help="Explicit project VM .utm bundle; guest disks are not read")
    args = parser.parse_args()
    result = audit_vm(args.bundle)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
