/** Give each synthetic song a distinct sample for the host route checks. */
import { Buffer } from 'node:buffer';
import { musicBytes } from '../game-legacy-audio-v1/original-audio.mjs';

export function originalMusicPhaseRows() {
  return [['cgbgm_t0', 160], ['puk2_battle1', 192], ['cgbgm_m1', 96]].map(([name, value]) => {
    const bytes = musicBytes();
    bytes[44] = value;
    return { path: 'Bin/bgm/' + name + '.wav', bytesHex: Buffer.from(bytes).toString('hex') };
  });
}
