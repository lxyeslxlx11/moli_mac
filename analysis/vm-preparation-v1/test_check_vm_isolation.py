"""Original synthetic plist/metadata fixtures; no guest or official content."""
import copy
import importlib.util
import json
from pathlib import Path
import plistlib
import tempfile
import unittest
from unittest.mock import patch


MODULE_PATH = Path(__file__).resolve().parents[2] / "scripts" / "check_vm_isolation.py"
SPEC = importlib.util.spec_from_file_location("check_vm_isolation", MODULE_PATH)
audit = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(audit)


def fixture():
    return {
        "Backend": "QEMU", "ConfigurationVersion": 4,
        "Display": [{"DownscalingFilter": "Linear", "DynamicResolution": True,
                     "Hardware": "virtio-ramfb", "NativeResolution": False, "UpscalingFilter": "Linear"}],
        "Drive": [{"Identifier": "original-test", "ImageName": "original.qcow2",
                   "ImageType": "Disk", "Interface": "VirtIO", "InterfaceVersion": 1, "ReadOnly": False}],
        "Information": {"IconCustom": False, "Name": "original", "Notes": "private synthetic text", "UUID": "original"},
        "Input": {"MaximumUsbShare": 3, "UsbBusSupport": "3.0", "UsbSharing": False},
        "Network": [], "Serial": [], "Sound": [],
        "QEMU": {"AdditionalArguments": [], "BalloonDevice": False, "DebugLog": False,
                 "Hypervisor": True, "PS2Controller": False, "RNGDevice": True,
                 "RTCLocalTime": True, "TPMDevice": True, "TSO": False, "UEFIBoot": True},
        "Sharing": {"ClipboardSharing": False, "DirectoryShareMode": "None", "DirectoryShareReadOnly": False},
        "System": {"Architecture": "aarch64", "CPU": "default", "CPUCount": 4,
                   "CPUFlagsAdd": [], "CPUFlagsRemove": [], "ForceMulticore": False,
                   "JITCacheSize": 0, "MemorySize": 8192, "Target": "virt"},
    }


class IsolationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.vm = self.root / "original.utm"
        (self.vm / "Data").mkdir(parents=True)
        for name in ("original.qcow2", "efi_vars.fd", "tpmdata"):
            (self.vm / "Data" / name).write_bytes(b"synthetic payload never emitted")
        self.save(fixture())

    def save(self, value):
        (self.vm / "config.plist").write_bytes(plistlib.dumps(value))

    def rejected(self):
        result = audit.audit_vm(self.vm)
        self.assertFalse(result["passed"])
        self.assertTrue(result["failed_checks"])
        self.assertLess(len(json.dumps(result)), 32768)
        return result

    def test_valid_bounded_metadata_audit_does_not_emit_contents(self):
        with patch.object(audit.os, "open", wraps=audit.os.open) as opened:
            result = audit.audit_vm(self.vm)
        self.assertEqual(opened.call_count, 1)
        self.assertEqual(opened.call_args[0][0], self.vm / "config.plist")
        self.assertTrue(result["passed"], result["failed_checks"])
        output = json.dumps(result)
        self.assertNotIn("synthetic payload", output)
        self.assertNotIn("private synthetic text", output)
        self.assertEqual(result["drives"][0]["bytes"], 31)
        self.assertEqual(len(result["config_sha256"]), 64)

    def test_sharing_and_protection_switches_rejected(self):
        for section, key, value in [("Sharing", "ClipboardSharing", True),
                                    ("Sharing", "DirectoryShareMode", "WebDAV"),
                                    ("Input", "UsbSharing", True), ("QEMU", "Hypervisor", False),
                                    ("QEMU", "TPMDevice", False), ("QEMU", "UEFIBoot", False)]:
            with self.subTest(section=section, key=key):
                config = fixture()
                config[section][key] = value
                self.save(config)
                self.rejected()

    def test_network_devices_and_additional_arguments_rejected(self):
        for key in ("Network", "Serial", "Sound"):
            with self.subTest(key=key):
                config = fixture()
                config[key] = [{"original": "enabled"}]
                self.save(config)
                self.rejected()
        config = fixture()
        config["QEMU"]["AdditionalArguments"] = ["-nic", "user"]
        self.save(config)
        self.rejected()

    def test_external_traversal_missing_duplicate_and_extra_disks_rejected(self):
        for name in ("/tmp/outside.qcow2", "../outside.qcow2", "sub/disk.qcow2", "C:\\disk.qcow2", "missing.qcow2"):
            with self.subTest(name=name):
                config = fixture()
                config["Drive"][0]["ImageName"] = name
                self.save(config)
                self.rejected()
        config = fixture()
        config["Drive"].append(copy.deepcopy(config["Drive"][0]))
        self.save(config)
        self.rejected()
        self.save(fixture())
        (self.vm / "Data" / "unexpected.qcow2").write_bytes(b"original")
        self.rejected()

    def test_symlinks_and_hardlinked_disk_rejected_without_following(self):
        linked_bundle = self.root / "link.utm"
        linked_bundle.symlink_to(self.vm, target_is_directory=True)
        self.assertFalse(audit.audit_vm(linked_bundle)["passed"])
        for relative in ("config.plist", "Data/original.qcow2", "Data"):
            with self.subTest(relative=relative):
                original = self.vm / relative
                moved = self.root / (original.name + ".saved")
                original.rename(moved)
                original.symlink_to(moved, target_is_directory=moved.is_dir())
                self.rejected()
                original.unlink()
                moved.rename(original)
        import os
        os.link(self.vm / "Data" / "original.qcow2", self.root / "outside-hardlink")
        self.rejected()

    def test_missing_fields_wrong_types_and_malformed_bounded_input_rejected(self):
        for section, key in [(None, "Sharing"), ("System", "CPUCount"), ("Sharing", "ClipboardSharing")]:
            with self.subTest(section=section, key=key):
                config = fixture()
                del (config if section is None else config[section])[key]
                self.save(config)
                self.rejected()
        for section, key, value in [("System", "CPUCount", True), ("Sharing", "ClipboardSharing", 0),
                                    ("System", "MemorySize", "8192")]:
            with self.subTest(section=section, key=key):
                config = fixture()
                config[section][key] = value
                self.save(config)
                self.rejected()
        for raw in (b"not a plist", b'<?xml version="1.0"?><plist><dict><key>X</key></plist>',
                    b"x" * (audit.MAX_CONFIG_BYTES + 1)):
            (self.vm / "config.plist").write_bytes(raw)
            self.rejected()

    def test_unknown_keys_and_large_device_lists_fail_closed(self):
        for section in (None, "Sharing", "QEMU", "Input", "Information"):
            with self.subTest(section=section):
                config = fixture()
                (config if section is None else config[section])["UnknownSecretSharingKey"] = "do not emit"
                self.save(config)
                result = self.rejected()
                self.assertNotIn("UnknownSecretSharingKey", json.dumps(result))
                self.assertNotIn("do not emit", json.dumps(result))
        config = fixture()
        config["Drive"] = config["Drive"] * (audit.MAX_DRIVES + 1)
        self.save(config)
        self.rejected()


if __name__ == "__main__":
    unittest.main()
