"""Build the three approved fixed launcher files into a private data CD; never execute them."""
from pathlib import Path
import datetime, hashlib, json, os, stat, subprocess, tempfile

SOURCE = Path('/private/tmp/moli-analysis/polcn/app')
OUTPUT = Path('/Users/lx/Documents/code/moli-mac/build/parallels/media/moli-launcher-probe-v21.iso')
RECEIPT = Path('/private/tmp/moli-launcher-probe-v21-media-receipt.json')
EXPECTED = {
 'POLCN_Launcher.exe': (599040, '109b13382e7fbd96759f52e8cdb4bc269c379a613dbbf1ddd04a69a4a5c8ef0e'),
 'XML/GameList.xml': (4377, 'be8f1213d77bd294fbb79b2fb51a5e7fecdc9aa3c0854db7a6d821fad20ef85a'),
 'XML/RegionList.xml': (6205, '0c94ca78c40c1940f241940a97aabef7849e9ad3285310046f346b69128a8438')}


def nonsymlink(path):
    for p in [*reversed(path.parents), path]:
        if p.is_symlink():
            raise RuntimeError('Symlink path component: ' + str(p))

def validated_source(name):
    p = SOURCE / name
    nonsymlink(p)
    before = p.stat()
    if not stat.S_ISREG(before.st_mode) or before.st_nlink != 1:
        raise RuntimeError('Unexpected source file type')
    data = p.read_bytes()
    after = p.stat()
    if (before.st_ino, before.st_size, before.st_mtime_ns) != (after.st_ino, after.st_size, after.st_mtime_ns):
        raise RuntimeError('Source changed while reading')
    if (len(data), hashlib.sha256(data).hexdigest()) != EXPECTED[name]:
        raise RuntimeError('Fixed sample mismatch: ' + name)
    return data

def main():
    os.umask(0o077)
    nonsymlink(OUTPUT)
    nonsymlink(RECEIPT)
    if os.path.lexists(OUTPUT) or os.path.lexists(RECEIPT):
        raise RuntimeError('Existing outcome; inspect instead of retrying')
    # Validate all sources before creating build output.
    contents = {name: validated_source(name) for name in EXPECTED}
    work = Path(tempfile.mkdtemp(prefix='moli-launcher-probe-v21-')).resolve()
    media_root = work / 'media-root'
    media_root.mkdir(mode=0o700)
    for name, data in contents.items():
        (media_root / name).parent.mkdir(mode=0o700, parents=True, exist_ok=True)
        with (media_root / name).open('xb') as f:
            f.write(data)
        (media_root / name).chmod(0o400)
    OUTPUT.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    nonsymlink(OUTPUT)
    command = ['/usr/bin/hdiutil', 'makehybrid', '-iso', '-joliet', '-default-volume-name', 'MOLI_LAUNCH_V21', '-o', str(OUTPUT), str(media_root)]
    built = subprocess.run(command, capture_output=True, text=True)
    if built.returncode:
        raise RuntimeError('makehybrid failed; preserve partial output: ' + built.stderr[-1000:])
    OUTPUT.chmod(0o400)
    listing = subprocess.run(['/usr/bin/bsdtar', '-tvf', str(OUTPUT)], capture_output=True, text=True, check=True).stdout.splitlines()
    normalized = {}; directories = set()
    for line in listing:
        cols = line.split(None, 8)
        if len(cols) != 9:
            raise RuntimeError('Unexpected member description')
        mode, name = cols[0], cols[8]
        name = name[2:] if name.startswith('./') else name
        if mode.startswith('d'):
            directories.add(name)
        elif mode.startswith('-') and name not in normalized:
            normalized[name] = name
        else:
            raise RuntimeError('Non-regular or duplicate image member')
    if len(listing) != 5 or directories != {'.', 'XML'} or set(normalized) != set(EXPECTED):
        raise RuntimeError('Unexpected image member set')
    verified = []
    for name in EXPECTED:
        data = subprocess.run(['/usr/bin/bsdtar', '-xOf', str(OUTPUT), normalized[name]], capture_output=True, check=True).stdout
        if data != contents[name]:
            raise RuntimeError('ISO readback mismatch: ' + name)
        verified.append({'name': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'readback_equal': True})
    raw = OUTPUT.read_bytes()
    descriptors = []
    for sector in range(16, 32):
        d = raw[sector * 2048:(sector + 1) * 2048]
        if len(d) != 2048 or d[1:6] != b'CD001':
            raise RuntimeError('Unexpected ISO descriptor')
        descriptors.append({'sector': sector, 'type': d[0]})
        if d[0] == 0:
            raise RuntimeError('Unexpected boot descriptor')
        if d[0] == 255:
            break
    else:
        raise RuntimeError('Missing descriptor terminator')
    result = {'utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'iso_path': str(OUTPUT),
              'iso_bytes': len(raw), 'iso_sha256': hashlib.sha256(raw).hexdigest(), 'iso_mode': oct(OUTPUT.stat().st_mode & 0o777),
              'private_build_root': str(OUTPUT.parent.parent), 'temporary_source_root': str(work),
              'format': 'ISO9660/Joliet data CD', 'label': 'MOLI_LAUNCH_V21', 'descriptors': descriptors,
              'bootable': False, 'autorun': False, 'files': verified, 'build_command': command, 'build_exit': built.returncode,
              'readback': 'bsdtar in memory; no host mount', 'guest_mounted': False, 'guest_imported': False, 'sample_executed': False,
              'state': 'Media prepared only; UI unavailable, current UI isolation/new recovery point/guest hash still pending; authorization unused.'}
    with RECEIPT.open('x') as f:
        json.dump(result, f, indent=2)
        f.write('\n')
        f.flush()
        os.fsync(f.fileno())
    print(json.dumps(result))

if __name__ == '__main__':
    main()
