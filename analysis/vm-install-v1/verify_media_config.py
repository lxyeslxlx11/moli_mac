#!/usr/bin/env python3
"""Read-only audit of this project's known UTM pre-installation media config.

The older blank-VM policy intentionally rejects the added CD. This separate
policy permits exactly the original internal system disk and one fixed internal,
read-only Windows CD. Only config/baseline text and file metadata are read; media
content equivalence belongs to the independent qemu-img compare evidence.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import plistlib
import stat
from xml.parsers.expat import ExpatError

LIMIT = 65536
VM_NAME = "MoliOffline-ARM64-20261025"
SYSTEM_NAME = "3CDE64AC-478C-4853-85AF-77DE92D646AB.qcow2"
MEDIA_NAME = "Windows11_Client_arm64_zh-cn_26300_9457.qcow2"
ORIGINAL_CONFIG_HASH = "f060314001fa0b625c2f996668b15be20c8510b91e6c22ca25aa38c36561e082"
ORIGINAL_SYSTEM_HASH = "99fc63d473bba2892508eca3fd0bff80551e16b084d80a895ac2b7761f99d5f9"
EXPECTED_SYSTEM = {
    "Architecture": "aarch64", "CPU": "default", "CPUCount": 4,
    "CPUFlagsAdd": [], "CPUFlagsRemove": [], "ForceMulticore": False,
    "JITCacheSize": 0, "MemorySize": 8192, "Target": "virt",
}
EXPECTED_SHARING = {"ClipboardSharing": False, "DirectoryShareMode": "None", "DirectoryShareReadOnly": False}
EXPECTED_SECTIONS = {
    "Backend": "QEMU", "ConfigurationVersion": 4,
    "Display": [{"DownscalingFilter": "Linear", "DynamicResolution": True,
                 "Hardware": "virtio-ramfb", "NativeResolution": False, "UpscalingFilter": "Linear"}],
    "Input": {"MaximumUsbShare": 3, "UsbBusSupport": "3.0", "UsbSharing": False},
    "Network": [], "Serial": [], "Sound": [], "Sharing": EXPECTED_SHARING,
    "System": EXPECTED_SYSTEM,
    "QEMU": {"AdditionalArguments": [], "BalloonDevice": False, "DebugLog": False,
             "Hypervisor": True, "PS2Controller": False, "RNGDevice": True,
             "RTCLocalTime": True, "TPMDevice": True, "TSO": False, "UEFIBoot": True},
}
EXPECTED_DRIVES = [
    {"Identifier": SYSTEM_NAME[:-6], "ImageName": SYSTEM_NAME, "ImageType": "Disk",
     "Interface": "VirtIO", "InterfaceVersion": 1, "ReadOnly": False},
    {"Identifier": "DB62EA51-5009-4ED1-ADFD-D80FD123B251", "ImageName": MEDIA_NAME,
     "ImageType": "CD", "Interface": "USB", "InterfaceVersion": 1, "ReadOnly": True},
]


def exact(actual, expected):
    """Compare recursively without treating integer zero as boolean False."""
    if type(actual) is not type(expected):
        return False
    if type(expected) is dict:
        return set(actual) == set(expected) and all(exact(actual[k], v) for k, v in expected.items())
    if type(expected) is list:
        return len(actual) == len(expected) and all(exact(a, b) for a, b in zip(actual, expected))
    return actual == expected


def small_regular_file(path):
    st = path.lstat()
    if not stat.S_ISREG(st.st_mode) or st.st_nlink != 1 or st.st_size > LIMIT:
        raise ValueError("not a bounded regular single-link file")
    fd = os.open(path, os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0))
    with os.fdopen(fd, "rb") as stream:
        before = os.fstat(stream.fileno())
        raw = stream.read(LIMIT + 1)
        after = os.fstat(stream.fileno())
    if (before.st_ino, before.st_size, before.st_mtime_ns) != (after.st_ino, after.st_size, after.st_mtime_ns) or len(raw) > LIMIT:
        raise ValueError("unstable or oversized file")
    return raw


def verify(bundle, baseline):
    bundle, baseline = Path(bundle).absolute(), Path(baseline).absolute()
    result = {
        "policy": "moli-fixed-two-drive-preinstall-v1", "passed": False,
        "vm_bundle": str(bundle)[:4096], "checks": [], "disk_metadata": [],
        "limitations": [
            "Reads config.plist, before-install.json and metadata only; no disk contents read.",
            "Does not prove runtime isolation, media equivalence or unchanged system-disk contents.",
            "Does not exclude ancestor-directory symlinks, races or later/global overrides.",
            "The older blank-VM audit intentionally rejects this added read-only CD.",
        ],
    }

    def check(code, passed):
        result["checks"].append({"check": code, "passed": bool(passed)})
        return bool(passed)

    def finish():
        result["failed_checks"] = [c["check"] for c in result["checks"] if not c["passed"]]
        result["passed"] = bool(result["checks"]) and not result["failed_checks"]
        return result

    try:
        if not check("bundle.real_directory", stat.S_ISDIR(bundle.lstat().st_mode)):
            return finish()
        raw_before = small_regular_file(baseline)
        before = json.loads(raw_before)
        raw = small_regular_file(bundle / "config.plist")
        config = plistlib.loads(raw)
    except (OSError, ValueError, TypeError, plistlib.InvalidFileException, ExpatError, OverflowError, RecursionError):
        check("bounded_config_and_baseline_read", False)
        return finish()
    result["config_sha256"] = hashlib.sha256(raw).hexdigest()
    result["before_install_sha256"] = hashlib.sha256(raw_before).hexdigest()
    if not check("baseline.dictionary", type(before) is dict):
        return finish()
    for key, value in {"config_sha256": ORIGINAL_CONFIG_HASH, "disk_basename": SYSTEM_NAME,
                       "disk_sha256": ORIGINAL_SYSTEM_HASH, "disk_bytes": 197888,
                       "system": EXPECTED_SYSTEM, "sharing": EXPECTED_SHARING,
                       "network": [], "usb_sharing": False}.items():
        check("baseline." + key, exact(before.get(key), value))
    if not check("config.known_root_keys", type(config) is dict and set(config) == set(EXPECTED_SECTIONS) | {"Information", "Drive"}):
        return finish()
    for section, value in EXPECTED_SECTIONS.items():
        check("config." + section, exact(config.get(section), value))
    info = config.get("Information")
    if check("Information.known_keys", type(info) is dict and set(info) == {"IconCustom", "Name", "Notes", "UUID"}):
        check("Information.identity", exact(info.get("IconCustom"), False)
              and exact(info.get("Name"), VM_NAME)
              and exact(info.get("UUID"), "087A27D7-88CC-4E08-8FB7-0FE852DAA3C8")
              and type(info.get("Notes")) is str and len(info["Notes"]) <= 4096)
    # Exact order/IDs/paths/roles are deliberately fixed; unknown CDs/keys fail.
    check("Drive.exact_original_system_and_readonly_internal_cd", exact(config.get("Drive"), EXPECTED_DRIVES))
    data = bundle / "Data"
    try:
        if not check("Data.real_directory", stat.S_ISDIR(data.lstat().st_mode)):
            return finish()
        names = []
        with os.scandir(data) as entries:
            for entry in entries:
                names.append(entry.name)
                if len(names) > 8:
                    break
        check("Data.exact_internal_files", set(names) == {SYSTEM_NAME, MEDIA_NAME, "efi_vars.fd", "tpmdata"})
        for index, name in enumerate((SYSTEM_NAME, MEDIA_NAME, "efi_vars.fd", "tpmdata")):
            st = (data / name).lstat()
            good = stat.S_ISREG(st.st_mode) and st.st_nlink == 1
            check("Data.file_" + str(index) + ".regular_single_link", good)
            if good and index < 2:
                result["disk_metadata"].append({"role": "system" if index == 0 else "readonly_cd",
                                                "bytes": st.st_size, "allocated_bytes": st.st_blocks * 512})
    except OSError:
        check("Data.metadata_readable", False)
    return finish()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", type=Path, required=True)
    parser.add_argument("--baseline", type=Path, default=Path(__file__).with_name("before-install.json"))
    args = parser.parse_args()
    result = verify(args.bundle, args.baseline)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
