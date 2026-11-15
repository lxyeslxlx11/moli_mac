"""Independent original ZIP input packs; no vendor assets or executable code."""
import io
import json
import zipfile


def archive(rows):
    output = io.BytesIO()
    with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as pack:
        for name, data in rows:
            info = zipfile.ZipInfo(name, date_time=(2020, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            if name.endswith('/'):
                info.external_attr = (0o40755 << 16) | 0x10
            pack.writestr(info, data)
    return output.getvalue().hex()


cases = {
    'base': [('Bin/base.bin', b'original base'), ('Empty/', b'')],
    'extra': [('Assets/other.dat', b'original other')],
    'duplicate': [('bin/BASE.bin', b'original duplicate')],
    'unsafe': [('../escape.bin', b'original invalid')],
    'file-shadow': [('Bin', b'original file'), ('Bin/child.bin', b'original child')],
    'directory-shadow': [('Bin/', b''), ('bin', b'original file')],
    'too-many': [(f'entry-{i}.bin', b'x') for i in range(65)],
}
result = {'schema': 'moli.original-resource-packs.v1', 'origin': 'Python zipfile, entirely original test text.',
    'cases': {name: archive(rows) for name, rows in cases.items()},
    'batches': [archive([(f'Batch{index}/file{i}.bin', b'x') for i in range(64)]) for index in range(17)]}
print(json.dumps(result, indent=2))
