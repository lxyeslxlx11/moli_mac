"""Stage 17 delivery. Default preflight is read-only; --apply is explicit.

Only fixed project roots are used by the CLI. run() accepts synthetic roots for tests.
No files are deleted from the target. Concurrent edits/renames of either tree are
not supported: checks reduce TOCTOU exposure but cannot atomically compare and
replace an existing file or lock an entire directory namespace. On failure,
inspect the partial delivery and printed backup path; do not automatically rerun.
A staging manifest alone is not completion evidence; both publications and exit 0
are required. Existing ordinary mode bits are preserved. ACLs, ownership and
extended-attribute history are not represented by the old hash-only manifest.
"""
from pathlib import Path, PurePosixPath
import argparse, hashlib, json, os, re, stat, tempfile

STAGE = Path('/Users/lx/Documents/Codex/2026-10-25/task')
TARGET = Path('/Users/lx/Documents/code/moli-mac')
SKIP = {'.build', '.swiftpm', '__pycache__', '.git', '.DS_Store', 'build',
        '.agents', '.codex', '.aws', '.ssh'}
FORBIDDEN = {'.exe', '.dll', '.bin', '.wav', '.dat', '.cgp', '.iso', '.qcow2', '.vhdx', '.fd'}
MANIFEST = 'analysis/delivery-manifest-stage17.json'
PREVIOUS = 'analysis/delivery-manifest-stage16.json'
DESCRIPTION = ('Stage17: official Microsoft Sysinternals Autologon package inspection and '
               'read-only ISO preparation evidence and reports only. No VM or login-security '
               'change, credential handling, Autologon execution, sign-in, game execution, '
               'or official-game-server connection is performed by this preparation stage.')


def check_path(path):
    """Reject symlinks in every existing component, including dangling links."""
    path = Path(path)
    if not path.is_absolute():
        raise RuntimeError(f'Absolute path required: {path}')
    for component in [*reversed(path.parents), path]:
        try:
            mode = component.lstat().st_mode
        except FileNotFoundError:
            continue
        if stat.S_ISLNK(mode):
            raise RuntimeError(f'Symlink component: {component}')
    return path


def signature(st):
    return st.st_dev, st.st_ino, st.st_size, st.st_mtime_ns, st.st_ctime_ns


def read_regular(path):
    check_path(path)
    initial = Path(path).lstat()
    if not stat.S_ISREG(initial.st_mode) or initial.st_nlink != 1:
        raise RuntimeError(f'Not an independent regular file: {path}')
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(fd, 'rb') as f:
        before = os.fstat(f.fileno())
        if (not stat.S_ISREG(before.st_mode) or before.st_nlink != 1
                or signature(before) != signature(initial)):
            raise RuntimeError(f'Not an independent regular file: {path}')
        data = f.read()
        if signature(os.fstat(f.fileno())) != signature(before):
            raise RuntimeError(f'File changed while reading: {path}')
    if signature(Path(path).lstat()) != signature(before):
        raise RuntimeError(f'File replaced while reading: {path}')
    return data


def digest(path):
    return hashlib.sha256(read_regular(path)).hexdigest()


def relative_name(raw):
    if not isinstance(raw, str):
        raise RuntimeError('Non-string manifest path')
    p = PurePosixPath(raw)
    if p.is_absolute() or not raw or str(p) != raw or any(x in {'.', '..', ''} for x in raw.split('/')):
        raise RuntimeError(f'Unsafe manifest path: {raw!r}')
    if any(x in SKIP for x in p.parts) or p.suffix.lower() in FORBIDDEN:
        raise RuntimeError(f'Excluded manifest path: {raw}')
    return raw


def sources(stage):
    result = []
    for directory, dirs, files in os.walk(stage, followlinks=False):
        dirs[:] = sorted(x for x in dirs if x not in SKIP)
        for name in dirs:
            check_path(Path(directory) / name)
        for name in sorted(files):
            f = Path(directory) / name
            rel = f.relative_to(stage).as_posix()
            if name in SKIP or rel == MANIFEST:
                continue
            relative_name(rel)
            check_path(f)
            result.append(f)
    return sorted(result)


def ensure_parent(path):
    check_path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    check_path(path)


def copy_verified(source, destination, expected):
    """Exclusive copy from checked bytes; never follow a final symlink."""
    data = read_regular(source)
    if hashlib.sha256(data).hexdigest() != expected:
        raise RuntimeError(f'Source changed: {source}')
    metadata = Path(source).stat()
    ensure_parent(destination)
    with open(destination, 'xb') as f:
        f.write(data)
        f.flush()
        os.fsync(f.fileno())
    os.chmod(destination, stat.S_IMODE(metadata.st_mode) & 0o777)
    os.utime(destination, ns=(metadata.st_atime_ns, metadata.st_mtime_ns))
    if digest(destination) != expected:
        raise RuntimeError(f'Copy verification failed: {destination}')


def publish_manifest(path, data):
    """Fully flush/close private temporary bytes before exclusive publication."""
    ensure_parent(path)
    fd, name = tempfile.mkstemp(prefix='.moli-stage17-manifest-', dir=path.parent)
    temporary = Path(name)
    try:
        with os.fdopen(fd, 'wb') as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        check_path(path)
        os.link(temporary, path)  # Atomic no-overwrite publication on the same filesystem.
    finally:
        temporary.unlink(missing_ok=True)


def verify_delivered(target, payload):
    for row in payload['files']:
        if digest(target / row['path']) != row['sha256']:
            raise RuntimeError(f'Verification failed: {row["path"]}')


def run(stage=STAGE, target=TARGET, apply=False):
    stage, target = check_path(Path(stage)), check_path(Path(target))
    if not stage.is_dir() or not target.is_dir() or stage == target:
        raise RuntimeError('Distinct existing source and target directories required')
    for root in (stage, target):
        check_path(root / MANIFEST)
        if os.path.lexists(root / MANIFEST):
            raise RuntimeError(f'Stage17 manifest exists; inspect prior outcome: {root / MANIFEST}')
    previous_bytes = read_regular(stage / PREVIOUS)
    baseline = {}
    for row in json.loads(previous_bytes)['files']:
        rel = relative_name(row['path'])
        if rel in baseline or not re.fullmatch('[0-9a-f]{64}', row['sha256']):
            raise RuntimeError(f'Invalid or duplicate baseline row: {rel}')
        baseline[rel] = row['sha256']
    baseline[PREVIOUS] = hashlib.sha256(previous_bytes).hexdigest()
    # A user deletion is a protected change, even if the source still has that file.
    for rel, expected in baseline.items():
        dst = check_path(target / rel)
        if not dst.exists() or digest(dst) != expected:
            raise RuntimeError(f'User change or deletion: {rel}')
    files = sources(stage)
    payload = {'description': DESCRIPTION, 'files': []}
    changed = []
    for f in files:
        rel = f.relative_to(stage).as_posix()
        data = read_regular(f)
        expected = hashlib.sha256(data).hexdigest()
        dst = check_path(target / rel)
        if dst.exists() and (rel not in baseline or digest(dst) != baseline[rel]):
            raise RuntimeError(f'User change or unexpected collision: {rel}')
        payload['files'].append({'path': rel, 'bytes': len(data), 'sha256': expected})
        if not dst.exists() or expected != baseline[rel]:
            changed.append((f, rel, expected, dst.exists()))
    plan = {'payload_files': len(files), 'new_files': sum(not row[3] for row in changed),
            'updated_files': sum(row[3] for row in changed), 'apply': apply}
    if not apply:
        return plan
    backup = Path(tempfile.mkdtemp(prefix='moli-stage17-backup-')).resolve()
    print(json.dumps({'backup': str(backup), 'status': 'copying; not yet verified'}), flush=True)
    for source, rel, expected, existed in changed:
        dst = check_path(target / rel)
        if existed:
            if not dst.exists() or digest(dst) != baseline[rel]:
                raise RuntimeError(f'Target changed during copy: {rel}')
            preserved_mode = stat.S_IMODE(dst.lstat().st_mode) & 0o777
            target_before_copy = signature(dst.lstat())
            copy_verified(dst, backup / rel, baseline[rel])
        elif os.path.lexists(dst):
            raise RuntimeError(f'New target appeared during copy: {rel}')
        ensure_parent(dst)
        fd, name = tempfile.mkstemp(prefix='.moli-stage17-', dir=dst.parent)
        os.close(fd)
        temporary = Path(name)
        temporary.unlink()  # Only our just-created empty temporary file.
        try:
            copy_verified(source, temporary, expected)
            check_path(dst)
            if existed:
                if (digest(dst) != baseline[rel]
                        or signature(dst.lstat()) != target_before_copy):
                    raise RuntimeError(f'Target changed before replacement: {rel}')
                os.chmod(temporary, preserved_mode)
                os.replace(temporary, dst)
            else:
                os.link(temporary, dst)  # New files must never replace a concurrent addition.
        finally:
            temporary.unlink(missing_ok=True)
    verify_delivered(target, payload)
    # Both manifests are withheld until complete payload validation. Target is published last.
    manifest_bytes = (json.dumps(payload, ensure_ascii=False, indent=2) + '\n').encode()
    publish_manifest(stage / MANIFEST, manifest_bytes)
    publish_manifest(target / MANIFEST, manifest_bytes)
    if digest(stage / MANIFEST) != digest(target / MANIFEST):
        raise RuntimeError('Published manifests differ; inspect partial outcome')
    return {**plan, 'status': 'delivered_and_verified', 'backup': str(backup), 'target': str(target)}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    print(json.dumps(run(apply=args.apply), ensure_ascii=False))


if __name__ == '__main__':
    main()
