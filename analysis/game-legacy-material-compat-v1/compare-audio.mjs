/** Compare the production PCM reader and selected ZIP ranges with Python wave results. */
import {openSync,closeSync,readSync,readFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {createLegacyGameResourceArchive} from '../../shared/legacy-game-resource-archive.mjs';
import {parseLegacyGameWave,fillLegacyGamePcmChannel} from '../../shared/legacy-game-audio.mjs';
const profile=JSON.parse(readFileSync(new URL('./material-profile.json',import.meta.url)));
const expected=JSON.parse(readFileSync('build/analysis/game-legacy-material-compat-v1/audio-oracle.json'));
const fd=openSync(profile.archive,'r');
const archive=await createLegacyGameResourceArchive({size:statSync(profile.archive).size,async read(at,length){const b=new Uint8Array(length);assert.equal(readSync(fd,b,0,length,at),length);return b;},close(){closeSync(fd);}});
let samples=0;const digest=createHash('sha256'),formats=new Map();
try{
 for(const row of expected.rows){
  const raw=await archive.port.read(row.path,0,row.bytes);
  try{
   assert.equal(createHash('sha256').update(raw).digest('hex'),row.source_sha256);
   const wave=parseLegacyGameWave(raw,false);assert.deepEqual([wave.channels,wave.bits,wave.rate,wave.frames],[row.channels,row.bits,row.rate,row.frames]);
   const hash=createHash('sha256');
   for(let channel=0;channel<wave.channels;channel++){
    const pcm=new Float32Array(wave.frames);fillLegacyGamePcmChannel(wave,channel,0,pcm);hash.update(new Uint8Array(pcm.buffer));samples+=pcm.length;pcm.fill(0);
   }
   const actual=hash.digest('hex');assert.equal(actual,row.float32_le_sha256,row.path);digest.update(actual);
   const key=[wave.bits,wave.channels,wave.rate].join('/');formats.set(key,(formats.get(key)??0)+1);
  }finally{raw.fill(0);}
 }
 assert.equal(expected.paths,260);assert.equal(samples,expected.samples);
 console.log(JSON.stringify({paths:260,ids:270,samples,formats:Object.fromEntries(formats),pcm_digest:digest.digest('hex'),all_wave_and_PCM_equal:true,archive:archive.inspect(),deviceAudioAccepted:false}));
}finally{archive.close();}
