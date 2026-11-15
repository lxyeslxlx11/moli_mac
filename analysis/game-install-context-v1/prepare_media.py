"""Build and read back a private data CD of the two pinned user installers.

No target code runs. Files are copied to a new private directory; moli/ is read
only. This prepares transfer, not installation or permission to run a sample.
"""

import datetime
import hashlib
import json
import os
import stat
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "build/analysis/game-install-context-v1"
PINS = {
    "CrossGate_Setup.exe": (
        1104268439,
        "e593e47fa09ac03e2213c7dc7bb80575e0295f0dc48a0e1edc73c4ac1982f983",
    ),
    "POLCN_Setup.exe": (
        2192044,
        "dc90bb88e35a82a649f1c026bd0b7b6e7039ddbe5e872f40ffebfb4b16b0fb11",
    ),
}
README = (
    b"MOLIINST102 - data CD, no autorun or boot program.\r\n"
    b"Contains unchanged user-provided installers for identity verification.\r\n"
    b"Presence on this CD does not validate source, terms, installation or compatibility.\r\n"
)


def reject_symlinks(path):
    for p in [*reversed(path.parents), path]:
        if p.is_symlink():
            raise RuntimeError("SYMLINK_COMPONENT: " + str(p))


def identity(path):
    reject_symlinks(path)
    before = path.stat()
    if not stat.S_ISREG(before.st_mode):
        raise RuntimeError("NOT_REGULAR")
    digest = hashlib.sha256()
    count = 0
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(block)
            count += len(block)
    after = path.stat()
    a = (before.st_dev, before.st_ino, before.st_size, before.st_mtime_ns)
    b = (after.st_dev, after.st_ino, after.st_size, after.st_mtime_ns)
    if a != b or count != after.st_size:
        raise RuntimeError("SOURCE_CHANGED_DURING_READ")
    return count, digest.hexdigest()


def main():
    os.umask(0o077)
    source_dir = OUT / "media-source"
    iso = OUT / "MoliInstall-stage102.iso"
    receipt = ROOT / "analysis/game-install-context-v1/media-stage102.json"
    for p in (source_dir, iso, receipt):
        reject_symlinks(p)
        if os.path.lexists(p):
            raise RuntimeError("DESTINATION_EXISTS: inspect instead of replaying")
    for name, pin in PINS.items():
        if identity(ROOT / "moli" / name) != pin:
            raise RuntimeError("INPUT_IDENTITY_MISMATCH: " + name)
    source_dir.mkdir(mode=0o700)
    for name, pin in PINS.items():
        with (ROOT / "moli" / name).open("rb") as source:
            with (source_dir / name).open("xb") as target:
                for block in iter(lambda: source.read(1024 * 1024), b""):
                    target.write(block)
        if identity(source_dir / name) != pin:
            raise RuntimeError("COPY_IDENTITY_MISMATCH: " + name)
        (source_dir / name).chmod(0o400)
    with (source_dir / "README.txt").open("xb") as f:
        f.write(README)
    (source_dir / "README.txt").chmod(0o400)
    command = [
        "/usr/bin/hdiutil", "makehybrid", "-iso", "-joliet",
        "-default-volume-name", "MOLIINST102", "-o", str(iso), str(source_dir),
    ]
    built = subprocess.run(command, capture_output=True, timeout=120)
    (OUT / "media-build.stdout").write_bytes(built.stdout)
    (OUT / "media-build.stderr").write_bytes(built.stderr)
    if built.returncode:
        raise RuntimeError("MAKEHYBRID_FAILED: preserve partial files")
    iso.chmod(0o400)
    verify_media(iso, command)


def verify_media(iso, command, resumed=False):
    receipt = ROOT / "analysis/game-install-context-v1/media-stage102.json"
    if receipt.exists():
        raise RuntimeError("RECEIPT_EXISTS")
    reject_symlinks(iso)
    if not stat.S_ISREG(iso.stat().st_mode) or iso.stat().st_mode & 0o222:
        raise RuntimeError("IMAGE_NOT_READ_ONLY_REGULAR")
    listed = subprocess.run(
        ["/usr/bin/bsdtar", "-tf", str(iso)], capture_output=True, check=True, timeout=30
    )
    entries = listed.stdout.decode("utf-8").splitlines()
    files = [n[2:] if n.startswith("./") else n for n in entries]
    files = [n for n in files if n not in (".", "./")]
    expected = dict(PINS)
    expected["README.txt"] = (len(README), hashlib.sha256(README).hexdigest())
    if len(files) != len(expected) or set(files) != set(expected):
        raise RuntimeError("UNEXPECTED_ISO_MEMBERS: " + repr(files))
    members = []
    for name, pin in expected.items():
        digest = hashlib.sha256()
        size = 0
        with subprocess.Popen(
            ["/usr/bin/bsdtar", "-xOf", str(iso), name], stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        ) as process:
            for block in iter(lambda: process.stdout.read(1024 * 1024), b""):
                digest.update(block)
                size += len(block)
            error = process.stderr.read(4096)
            if process.wait(timeout=30) or error:
                raise RuntimeError("ISO_MEMBER_READ_FAILED")
        if (size, digest.hexdigest()) != pin:
            raise RuntimeError("ISO_MEMBER_IDENTITY_MISMATCH: " + name)
        members.append({"name": name, "bytes": size, "sha256": digest.hexdigest()})
    descriptors = []
    label = None
    with iso.open("rb") as f:
        for sector in range(16, 32):
            f.seek(sector * 2048)
            block = f.read(2048)
            if len(block) != 2048 or block[1:6] != b"CD001" or block[0] == 0:
                raise RuntimeError("INVALID_OR_BOOT_DESCRIPTOR")
            descriptors.append({"sector": sector, "type": block[0]})
            if block[0] == 1:
                label = block[40:72].decode("ascii").rstrip(" \0")
            if block[0] == 255:
                break
        else:
            raise RuntimeError("NO_DESCRIPTOR_TERMINATOR")
    if label != "MOLIINST102":
        raise RuntimeError("VOLUME_LABEL_MISMATCH")
    for name, pin in PINS.items():
        if identity(ROOT / "moli" / name) != pin:
            raise RuntimeError("ORIGINAL_CHANGED_AFTER_BUILD")
    size, digest = identity(iso)
    result = {
        "schema": "moli.game-install-media.v1",
        "recorded_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "private_iso": str(iso), "bytes": size, "sha256": digest,
        "mode": oct(iso.stat().st_mode & 0o777), "volume_label": label,
        "descriptors": descriptors, "bootable": False, "autorun": False,
        "members": members, "build_command": command, "build_exit_code": 0,
        "readback": "Streaming bsdtar, no host mount or target execution",
        "resumed_existing_image": resumed,
        "validation_history": (
            "Initial script exit1 at label check after member hashes passed; hdiutil exit0. "
            "Exact descriptor bytes showed trailing NUL padding; decoder corrected. "
            "Existing image preserved and every member re-read."
            if resumed else "Fresh build and complete readback"
        ),
        "originals_rehashed_unchanged": True, "guest_mounted": False,
        "guest_hash_verified": False, "installer_executed": False,
        "limit": "Preparation only. Unknown-source/terms gates remain separate.",
    }
    with receipt.open("x") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(json.dumps({"iso": str(iso), "bytes": size, "sha256": digest, "members": len(members)}))


if __name__ == "__main__":
    if sys.argv[1:] == ["--verify-existing"]:
        verify_media(
            OUT / "MoliInstall-stage102.iso",
            ["/usr/bin/hdiutil", "makehybrid", "-iso", "-joliet",
             "-default-volume-name", "MOLIINST102", "-o",
             str(OUT / "MoliInstall-stage102.iso"), str(OUT / "media-source")],
            resumed=True,
        )
    elif not sys.argv[1:]:
        main()
    else:
        raise SystemExit("Only --verify-existing is accepted")
