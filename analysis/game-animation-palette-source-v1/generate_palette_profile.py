"""Generate a compact factual resource map only after full original-table byte verification."""
from pathlib import Path
from hashlib import sha256
import json
import struct

ROOT=Path(__file__).resolve().parents[2]
A=Path(__file__).resolve().parent
P=ROOT/'build/analysis/game-animation-palette-source-v1'
proof=json.loads((A/'source-check.json').read_text())
raw=(ROOT/proof['source']['path']).read_bytes()
assert sha256(raw).hexdigest()==proof['source']['sha256']
record=proof['palette_table']
table=raw[record['offset']:record['offset']+record['bytes']]
assert sha256(table).hexdigest()==record['sha256']
values=list(struct.unpack('<1495I',table))
runs=[]
for n in values:
    if runs and n==runs[-1][0]+runs[-1][1]:
        runs[-1][1]+=1
    else:
        runs.append([n,1])
out='''/** Fixed37c4 ordinary named-palette resource map,derived from verified1495slot table568310. */
import {assetInteger} from './legacy-game-resource-values.mjs';
export const LEGACY_GAME_NAMED_PALETTE_PROFILE=Object.freeze({id:'legacy-se6000-37c4-named-palette-v1',slots:1495,paletteBytes:768,cacheEntries:64,
 sourceSha256:'SOURCE',tableSha256:'TABLE'});
const resources=Uint32Array.from(RUNS.flatMap(([first,count])=>Array.from({length:count},(_,i)=>first+i)));
export function legacyGameNamedPalette(value){assetInteger(value,0,65535);const selector=value>0&&value<1495?value:0;return Object.freeze({selector,resourceId:resources[selector]});}
'''.replace('SOURCE',proof['source']['sha256']).replace('TABLE',record['sha256']).replace('RUNS',json.dumps(runs,separators=(',',':')))
(ROOT/'shared/legacy-game-named-palette.mjs').write_text(out)
print(json.dumps(dict(stage=292,slots=len(values),runs=len(runs),source_table_sha256=record['sha256'])))
