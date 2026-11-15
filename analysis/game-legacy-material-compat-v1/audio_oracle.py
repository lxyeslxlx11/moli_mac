"""Python wave/array PCM oracle for the fixed sound catalog; write digests only."""
from pathlib import Path
from hashlib import sha256
from array import array
import json
import sys
import wave

ROOT = Path(__file__).resolve().parents[2]
P = ROOT / 'build/analysis/game-legacy-material-compat-v1'
source = json.loads((ROOT / 'analysis/game-legacy-battle-audio-v1/source-check.json').read_text())
manifest = json.loads((ROOT / 'build/analysis/game-legacy-resource-archive-v1/full-material-pack.json').read_text())
files = {r['path'].lower(): r for r in manifest['entries']}
rows = []
for path in sorted({r['path'] for r in source['catalog']}):
    entry = files[('bin/' + path).lower()]
    actual = ROOT / 'build/analysis/game-legacy-resource-archive-v1/material-root' / entry['path']
    assert sha256(actual.read_bytes()).hexdigest() == entry['sha256']
    with wave.open(str(actual), 'rb') as handle:
        channels, width, rate, count = handle.getnchannels(), handle.getsampwidth(), handle.getframerate(), handle.getnframes()
        raw = handle.readframes(count)
    assert len(raw) == channels * width * count
    samples = array('h') if width == 2 else array('B')
    samples.frombytes(raw)
    if width == 2 and sys.byteorder != 'little':
        samples.byteswap()
    digest = sha256()
    for channel in range(channels):
        values = array('f', ((v / 32768) if width == 2 else ((v - 128) / 128) for v in samples[channel::channels]))
        if sys.byteorder != 'little':
            values.byteswap()
        digest.update(values.tobytes())
    rows.append(dict(path=entry['path'], bytes=entry['bytes'], source_sha256=entry['sha256'], channels=channels,
                     bits=width * 8, rate=rate, frames=count, float32_le_sha256=digest.hexdigest()))
result = dict(stage=290, ids=len(source['catalog']), paths=len(rows), samples=sum(r['frames'] * r['channels'] for r in rows),
              rows=rows, original_audio_exported=False, original_execution=False)
(P / 'audio-oracle.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({k: v for k, v in result.items() if k != 'rows'}))
