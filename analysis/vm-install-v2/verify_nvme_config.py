#!/usr/bin/env python3
"""Read-only, fixed NVMe policy for this project's existing two-drive UTM VM.

The v1 policy is unchanged and intentionally rejects NVMe. This policy requires
the fixed former VirtIO configuration plus exactly Drive[0].Interface = NVMe.
It imports v1's bounded text reader, typed comparison and fixed schema; it does
not call, weaken or relabel the v1 audit. Disk payloads are never opened.
"""
import argparse
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import plistlib
import stat
from xml.parsers.expat import ExpatError

V1_PATH = Path(__file__).resolve().parent.parent / "vm-install-v1" / "verify_media_config.py"
SPEC = importlib.util.spec_from_file_location("moli_media_policy_v1", V1_PATH)
v1 = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(v1)

PREVIOUS_CONFIG_HASH = "1206383b36fc281a3d98ce6f00180931bde52a2780bca4f5687d23d0565cd9fd"
EXPECTED_DRIVES = copy.deepcopy(v1.EXPECTED_DRIVES)
EXPECTED_DRIVES[0]["Interface"] = "NVMe"
INTERNAL_FILES = (v1.SYSTEM_NAME, v1.MEDIA_NAME, "efi_vars.fd", "tpmdata")


def verify(bundle, baseline):
    bundle, baseline = Path(bundle).absolute(), Path(baseline).absolute()
    result = {
        "policy": "moli-fixed-two-drive-nvme-v2", "passed": False,
        "vm_bundle": str(bundle)[:4096], "checks": [], "disk_metadata": [],
        "limitations": [
            "Reads two bounded text files and metadata only; no disk contents read.",
            "Only permits the fixed prior config plus system Interface VirtIO -> NVMe.",
            "Baseline's prior plist hash is recorded provenance, not independently rehashed prior bytes.",
            "Does not prove runtime isolation, guest NVMe detection, installation, media equivalence or disk integrity.",
            "EFI, TPM and system-disk bytes may change during installation; sizes are observations, not invariants.",
            "Does not exclude ancestor-directory symlinks, races or later/global overrides.",
            "The unchanged v1 VirtIO policy intentionally rejects this NVMe configuration.",
        ],
    }

    def check(code, passed):
        result["checks"].append({"check": code, "passed": bool(passed)})
        return bool(passed)

    def finish():
        result["failed_checks"] = [c["check"] for c in result["checks"] if not c["passed"]]
        result["passed"] = bool(result["checks"]) and not result["failed_checks"]
        return result

    def fixed_config(config, prefix, drives):
        if not check(prefix + ".known_root_keys", type(config) is dict
                     and set(config) == set(v1.EXPECTED_SECTIONS) | {"Information", "Drive"}):
            return False
        for section, expected in v1.EXPECTED_SECTIONS.items():
            check(prefix + "." + section, v1.exact(config.get(section), expected))
        info = config.get("Information")
        if check(prefix + ".Information.known_keys", type(info) is dict
                 and set(info) == {"IconCustom", "Name", "Notes", "UUID"}):
            check(prefix + ".Information.identity", v1.exact(info.get("IconCustom"), False)
                  and v1.exact(info.get("Name"), v1.VM_NAME)
                  and v1.exact(info.get("UUID"), "087A27D7-88CC-4E08-8FB7-0FE852DAA3C8")
                  and type(info.get("Notes")) is str and len(info["Notes"]) <= 4096)
        check(prefix + ".Drive.exact_fixed_roles_interfaces_and_paths", v1.exact(config.get("Drive"), drives))
        return True

    try:
        if not check("bundle.real_directory", stat.S_ISDIR(bundle.lstat().st_mode)):
            return finish()
        raw_before = v1.small_regular_file(baseline)
        before = json.loads(raw_before)
        raw_current = v1.small_regular_file(bundle / "config.plist")
        current = plistlib.loads(raw_current)
    except (OSError, ValueError, TypeError, plistlib.InvalidFileException, ExpatError, OverflowError, RecursionError):
        check("bounded_config_and_baseline_read", False)
        return finish()
    result["config_sha256"] = hashlib.sha256(raw_current).hexdigest()
    result["before_interface_json_sha256"] = hashlib.sha256(raw_before).hexdigest()
    if not check("baseline.known_receipt_keys", type(before) is dict
                 and set(before) == {"date", "ui_state", "sha256", "config"}):
        return finish()
    check("baseline.recorded_prior_config_hash", v1.exact(before.get("sha256"), PREVIOUS_CONFIG_HASH))
    previous = before["config"]
    if not fixed_config(previous, "baseline.config", v1.EXPECTED_DRIVES):
        return finish()
    if not fixed_config(current, "current.config", EXPECTED_DRIVES):
        return finish()
    # Never mutate the historical object, nor accept a matching tampered pair.
    if v1.exact(previous.get("Drive"), v1.EXPECTED_DRIVES):
        expected_delta = copy.deepcopy(previous)
        expected_delta["Drive"][0]["Interface"] = "NVMe"
        check("current.only_system_interface_delta", v1.exact(current, expected_delta))
    else:
        check("current.only_system_interface_delta", False)
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
        check("Data.exact_internal_files", set(names) == set(INTERNAL_FILES))
        for index, name in enumerate(INTERNAL_FILES):
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
    parser.add_argument("--baseline", type=Path, default=Path(__file__).with_name("before-interface.json"))
    args = parser.parse_args()
    result = verify(args.bundle, args.baseline)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
