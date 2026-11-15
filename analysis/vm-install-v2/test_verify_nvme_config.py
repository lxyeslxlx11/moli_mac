"""Original synthetic fixtures; no Windows, official media or guest payloads."""
import copy
import importlib.util
import json
import os
from pathlib import Path
import plistlib
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location("verify_nvme_config", Path(__file__).with_name("verify_nvme_config.py"))
audit = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(audit)


class NvmeConfigTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.vm = self.root / "synthetic.utm"
        (self.vm / "Data").mkdir(parents=True)
        for name in audit.INTERNAL_FILES:
            (self.vm / "Data" / name).write_bytes(b"original synthetic fixture")
        previous = copy.deepcopy(audit.v1.EXPECTED_SECTIONS)
        previous["Drive"] = copy.deepcopy(audit.v1.EXPECTED_DRIVES)
        previous["Information"] = {"Name": audit.v1.VM_NAME, "IconCustom": False,
                                   "UUID": "087A27D7-88CC-4E08-8FB7-0FE852DAA3C8", "Notes": "original synthetic note"}
        self.before = {"date": "2026-10-25", "ui_state": "original synthetic state",
                       "sha256": audit.PREVIOUS_CONFIG_HASH, "config": previous}
        self.baseline = self.root / "before-interface.json"
        self.baseline.write_text(json.dumps(self.before))
        self.current = copy.deepcopy(previous)
        self.current["Drive"][0]["Interface"] = "NVMe"
        self.save(self.current)

    def save(self, value):
        (self.vm / "config.plist").write_bytes(plistlib.dumps(value))

    def rejected(self):
        result = audit.verify(self.vm, self.baseline)
        self.assertFalse(result["passed"])
        self.assertLess(len(json.dumps(result)), 16384)
        return result

    def test_valid_nvme_opens_only_receipt_and_config_and_allows_guest_file_growth(self):
        # Growing guest storage/EFI/TPM is not a configuration-policy failure.
        for name in audit.INTERNAL_FILES:
            (self.vm / "Data" / name).write_bytes(b"synthetic enlarged file" * 80)
        with patch.object(audit.v1.os, "open", wraps=audit.v1.os.open) as opened:
            result = audit.verify(self.vm, self.baseline)
        self.assertTrue(result["passed"], result["failed_checks"])
        self.assertEqual([c.args[0] for c in opened.call_args_list], [self.baseline, self.vm / "config.plist"])
        self.assertEqual(result["policy"], "moli-fixed-two-drive-nvme-v2")
        self.assertNotIn("synthetic enlarged file", json.dumps(result))
        self.assertEqual(audit.v1.EXPECTED_DRIVES[0]["Interface"], "VirtIO")

    def test_old_interface_cd_writeability_unknown_devices_and_external_paths_rejected(self):
        for index, key, value in [(0, "Interface", "VirtIO"), (0, "Interface", "SCSI"),
                                  (1, "ReadOnly", False), (1, "ReadOnly", 1),
                                  (1, "Interface", "NVMe"), (1, "ImageType", "Disk"),
                                  (0, "ImageName", "/tmp/external.qcow2"),
                                  (1, "ImageName", "../external.qcow2"),
                                  (0, "Identifier", "replacement-system")]:
            with self.subTest(index=index, key=key, value=value):
                config = copy.deepcopy(self.current)
                config["Drive"][index][key] = value
                self.save(config)
                self.rejected()
        for mutate in (lambda c: c["Drive"].append(copy.deepcopy(c["Drive"][0])),
                       lambda c: c["Drive"][0].update({"ExternalURL": "/tmp/disk"}),
                       lambda c: c.update({"UnknownDevice": {}})):
            config = copy.deepcopy(self.current)
            mutate(config)
            self.save(config)
            self.rejected()

    def test_isolation_and_tampered_matching_baseline_cannot_widen_policy(self):
        for section, key, value in [(None, "Network", [{"Hardware": "virtio-net-pci"}]),
                                    (None, "Serial", [{}]), (None, "Sound", [{}]),
                                    ("Sharing", "ClipboardSharing", True), ("Sharing", "DirectoryShareMode", "WebDAV"),
                                    ("Input", "UsbSharing", True), ("QEMU", "AdditionalArguments", ["-nic", "user"]),
                                    ("QEMU", "TPMDevice", False), ("System", "MemorySize", 4096)]:
            with self.subTest(section=section, key=key):
                config, before = copy.deepcopy(self.current), copy.deepcopy(self.before)
                (config if section is None else config[section])[key] = value
                old = before["config"]
                (old if section is None else old[section])[key] = value
                self.save(config)
                self.baseline.write_text(json.dumps(before))
                self.rejected()
        self.baseline.write_text(json.dumps(self.before))
        config = copy.deepcopy(self.current)
        config["Information"]["Notes"] = "another change beyond the allowed interface delta"
        self.save(config)
        self.assertIn("current.only_system_interface_delta", self.rejected()["failed_checks"])
        del config["Sharing"]
        self.save(config)
        self.rejected()

    def test_links_extra_files_and_bad_bounded_inputs_rejected(self):
        for relative in ("config.plist", "Data/" + audit.v1.MEDIA_NAME, "Data/" + audit.v1.SYSTEM_NAME, "Data"):
            with self.subTest(relative=relative):
                path = self.vm / relative
                saved = self.root / (path.name + ".saved")
                path.rename(saved)
                path.symlink_to(saved, target_is_directory=saved.is_dir())
                self.rejected()
                path.unlink()
                saved.rename(path)
        extra = self.vm / "Data" / "unexpected-device"
        extra.write_bytes(b"original synthetic extra")
        self.rejected()
        extra.unlink()
        os.link(self.vm / "Data" / audit.v1.SYSTEM_NAME, self.root / "hardlink")
        self.rejected()
        (self.root / "hardlink").unlink()
        for raw in (b"not a plist", b"x" * (audit.v1.LIMIT + 1)):
            (self.vm / "config.plist").write_bytes(raw)
            self.rejected()
        self.save(self.current)
        for raw in (b"{", b"[]", b"x" * (audit.v1.LIMIT + 1)):
            self.baseline.write_bytes(raw)
            self.rejected()


if __name__ == "__main__":
    unittest.main()
