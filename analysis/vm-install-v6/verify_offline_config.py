#!/usr/bin/env python3
"""Read-only fixed policy for MoliOffline with three internal drives and no NIC.

This is a new policy, not a relaxation of the historical v1/v2 checks. Expected
values are embedded here: an editable receipt cannot grant new devices/access.
Only one bounded config file is opened. Disk/EFI/TPM contents are never opened.
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
POLICY = "moli-fixed-three-drive-offline-v6"
V5_CONFIG_SHA256 = "97cb2df7e4554cb742d6026ab02388f4333b847c75620a7c5798e2de585c3ce8"
SYSTEM_NAME = "3CDE64AC-478C-4853-85AF-77DE92D646AB.qcow2"
WINDOWS_CD_NAME = "Windows11_Client_arm64_zh-cn_26300_9457.qcow2"
DRIVER_CD_NAME = "netkvm-w11-arm64-0.1.274.qcow2"
EXPECTED = {
    "Backend": "QEMU", "ConfigurationVersion": 4,
    "Display": [{"DownscalingFilter": "Linear", "DynamicResolution": True,
                 "Hardware": "virtio-ramfb", "NativeResolution": False,
                 "UpscalingFilter": "Linear"}],
    "Drive": [
        {"Identifier": "3CDE64AC-478C-4853-85AF-77DE92D646AB", "ImageName": SYSTEM_NAME,
         "ImageType": "Disk", "Interface": "NVMe", "InterfaceVersion": 1, "ReadOnly": False},
        {"Identifier": "DB62EA51-5009-4ED1-ADFD-D80FD123B251", "ImageName": WINDOWS_CD_NAME,
         "ImageType": "CD", "Interface": "USB", "InterfaceVersion": 1, "ReadOnly": True},
        {"Identifier": "EE8771ED-1F3E-45F6-AABE-E21D720C4E2E", "ImageName": DRIVER_CD_NAME,
         "ImageType": "CD", "Interface": "USB", "InterfaceVersion": 1, "ReadOnly": True},
    ],
    "Information": {
        "IconCustom": False, "Name": "MoliOffline-ARM64-20261025",
        "Notes": "moli-mac 隔离准备：空白 ARM64 磁盘，未安装 Windows、未导入官方程序。无网络/目录/剪贴板/USB 共享；取得镜像来源和许可确认后再安装。旧虚拟机保持原样。",
        "UUID": "087A27D7-88CC-4E08-8FB7-0FE852DAA3C8",
    },
    "Input": {"MaximumUsbShare": 3, "UsbBusSupport": "3.0", "UsbSharing": False},
    "Network": [], "Serial": [], "Sound": [],
    "QEMU": {"AdditionalArguments": [], "BalloonDevice": False, "DebugLog": False,
             "Hypervisor": True, "PS2Controller": False, "RNGDevice": True,
             "RTCLocalTime": True, "TPMDevice": True, "TSO": False, "UEFIBoot": True},
    "Sharing": {"ClipboardSharing": False, "DirectoryShareMode": "None",
                "DirectoryShareReadOnly": False},
    "System": {"Architecture": "aarch64", "CPU": "default", "CPUCount": 4,
               "CPUFlagsAdd": [], "CPUFlagsRemove": [], "ForceMulticore": False,
               "JITCacheSize": 0, "MemorySize": 8192, "Target": "virt"},
}
INTERNAL_FILES = (SYSTEM_NAME, WINDOWS_CD_NAME, DRIVER_CD_NAME, "efi_vars.fd", "tpmdata")


def exact(actual, expected):
    """Recursive closed schema; bool and int are deliberately distinct."""
    if type(actual) is not type(expected):
        return False
    if type(expected) is dict:
        return set(actual) == set(expected) and all(exact(actual[k], v) for k, v in expected.items())
    if type(expected) is list:
        return len(actual) == len(expected) and all(exact(a, b) for a, b in zip(actual, expected))
    return actual == expected


def bounded_config(path):
    """Reject leaf links/nonregular files; recheck the open descriptor before read."""
    initial = path.lstat()
    if not stat.S_ISREG(initial.st_mode) or initial.st_nlink != 1 or initial.st_size > LIMIT:
        raise ValueError("config must be a bounded regular single-link file")
    flags = os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0) | getattr(os, "O_NONBLOCK", 0)
    fd = os.open(path, flags)
    with os.fdopen(fd, "rb") as stream:
        before = os.fstat(stream.fileno())
        if (not stat.S_ISREG(before.st_mode) or before.st_nlink != 1 or before.st_size > LIMIT
                or (before.st_dev, before.st_ino) != (initial.st_dev, initial.st_ino)):
            raise ValueError("config changed before opening")
        raw = stream.read(LIMIT + 1)
        after = os.fstat(stream.fileno())
    fields = ("st_dev", "st_ino", "st_size", "st_mtime_ns", "st_ctime_ns", "st_nlink")
    if any(getattr(before, field) != getattr(after, field) for field in fields) or len(raw) > LIMIT:
        raise ValueError("config changed while reading or exceeds limit")
    return raw


class UniqueDict(dict):
    def __setitem__(self, key, value):
        if key in self:
            raise ValueError("duplicate plist key")
        super().__setitem__(key, value)


def plain(value):
    if type(value) is UniqueDict:
        return {key: plain(item) for key, item in value.items()}
    if type(value) is list:
        return [plain(item) for item in value]
    return value


def verify(bundle):
    bundle = Path(bundle).absolute()
    result = {
        "policy": POLICY, "passed": False, "vm_bundle": str(bundle)[:4096],
        "checks": [], "disk_metadata": [],
        "provenance": {
            "v5_config_sha256": V5_CONFIG_SHA256,
            "change_allowed_from_v5": "Network replaced by empty list only",
            "expected_values_source": "fixed constants in this script, not a runtime receipt",
        },
        "limitations": [
            "Opens only config.plist (at most 65537 bytes); other access is filesystem metadata.",
            "Does not establish whether the VM is stopped, guest readiness, runtime isolation or global overrides.",
            "Does not read disk headers, backing chains, EFI/TPM data, media hashes or guest contents.",
            "Does not establish guest Secure Boot, driver trust, account state, activation or game compatibility.",
            "Rejects leaf symlinks/hardlinks but does not exclude ancestor symlinks or all concurrent races.",
            "Information.Notes is historical text fixed for delta auditing, not a current status assertion.",
            "v1/v2 policies remain unchanged and intentionally reject this third CD.",
        ],
    }

    def check(name, passed):
        result["checks"].append({"check": name, "passed": bool(passed)})
        return bool(passed)

    def finish():
        result["failed_checks"] = [row["check"] for row in result["checks"] if not row["passed"]]
        result["passed"] = bool(result["checks"]) and not result["failed_checks"]
        return result

    try:
        if not check("bundle.real_directory", stat.S_ISDIR(bundle.lstat().st_mode)):
            return finish()
        raw = bounded_config(bundle / "config.plist")
        config = plain(plistlib.loads(raw, dict_type=UniqueDict))
    except (OSError, ValueError, TypeError, plistlib.InvalidFileException, ExpatError,
            OverflowError, RecursionError):
        check("config.bounded_regular_unambiguous_plist", False)
        return finish()
    result["config_sha256"] = hashlib.sha256(raw).hexdigest()
    if not check("config.known_root_keys", type(config) is dict and set(config) == set(EXPECTED)):
        return finish()
    for section, value in EXPECTED.items():
        check("config." + section, exact(config[section], value))

    data = bundle / "Data"
    try:
        if not check("Data.real_directory", stat.S_ISDIR(data.lstat().st_mode)):
            return finish()
        names = []
        with os.scandir(data) as entries:
            for entry in entries:
                names.append(entry.name)
                if len(names) > len(INTERNAL_FILES):
                    break
        check("Data.exact_internal_files", set(names) == set(INTERNAL_FILES))
        roles = ("system", "windows_readonly_cd", "netkvm_readonly_cd", "efi", "tpm")
        for role, name in zip(roles, INTERNAL_FILES):
            st = (data / name).lstat()
            regular = stat.S_ISREG(st.st_mode) and st.st_nlink == 1
            check("Data." + role + ".regular_single_link", regular)
            if regular and role not in ("efi", "tpm"):
                result["disk_metadata"].append({"role": role, "bytes": st.st_size,
                                                "allocated_bytes": st.st_blocks * 512})
    except OSError:
        check("Data.metadata_readable", False)
    return finish()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", type=Path, required=True)
    args = parser.parse_args()
    result = verify(args.bundle)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
