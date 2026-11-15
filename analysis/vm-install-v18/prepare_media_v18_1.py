"""Build the five approved fixed samples into a private data CD; never execute them."""
from pathlib import Path
import datetime, hashlib, json, os, stat, subprocess, tempfile

SOURCE = Path('/private/tmp/moli-analysis/crossgate/app')
OUTPUT = Path('/Users/lx/Documents/code/moli-mac/build/parallels/media/moli-client-probe-v18.iso')
RECEIPT = Path('/private/tmp/moli-client-probe-v18-media-receipt.json')
EXPECTED = {
 'cg_se_3000.exe': (2904064, '9baa0d2660f96c6699ccf42ad46bd918717b98ccb228f4edde2d92afb89d3126'),
 'd3drm.dll': (350208, '58226b8e12c98ef437af103273c21e88b659acd8328bd4c55fddbae97ab8fad2'),
 'd3dx9_43.dll': (1998168, '0b28546be22c71834501f7d7185ede5d79742457331c7ee09efc14490dd64f5f'),
 'MFC71.dll': (1060864, 'a08ab5280687d699ccd307196e72847b23d0a475744ef7c73654defee0fb2cf2'),
 'msvcr71.dll': (348160, 'c4d4339df314a27ff75a38967b7569d9962337b8d4cd4b0db3aba5ff72b2bfbb')}

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
    work = Path(tempfile.mkdtemp(prefix='moli-client-probe-v18-')).resolve()
    media_root = work / 'media-root'
    media_root.mkdir(mode=0o700)
    for name, data in contents.items():
        with (media_root / name).open('xb') as f:
            f.write(data)
        (media_root / name).chmod(0o400)
    OUTPUT.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    nonsymlink(OUTPUT)
    command = ['/usr/bin/hdiutil', 'makehybrid', '-iso', '-joliet', '-default-volume-name', 'MOLI_PROBE_V18', '-o', str(OUTPUT), str(media_root)]
    built = subprocess.run(command, capture_output=True, text=True)
    if built.returncode:
        raise RuntimeError('makehybrid failed; preserve partial output: ' + built.stderr[-1000:])
    OUTPUT.chmod(0o400)
    listing = subprocess.run(['/usr/bin/bsdtar', '-tf', str(OUTPUT)], capture_output=True, text=True, check=True).stdout.splitlines()
    members = [x for x in listing if x not in {'.', './'} and not x.endswith('/')]
    normalized = {x[2:] if x.startswith('./') else x: x for x in members}
    if len(members) != 5 or set(normalized) != set(EXPECTED):
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
              'format': 'ISO9660/Joliet data CD', 'label': 'MOLI_PROBE_V18', 'descriptors': descriptors,
              'bootable': False, 'autorun': False, 'files': verified, 'build_command': command, 'build_exit': built.returncode,
              'readback': 'bsdtar in memory; no host mount', 'guest_mounted': False, 'guest_imported': False, 'sample_executed': False,
              'state': 'Media prepared only; UI unavailable, VM isolation/cold recovery point/guest hash still pending.'}
    with RECEIPT.open('x') as f:
        json.dump(result, f, indent=2)
        f.write('\n')
        f.flush()
        os.fsync(f.fileno())
    print(json.dumps(result))

if __name__ == '__main__':
    main()
