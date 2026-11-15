/** Original PCM and an observation port for the Node WeChat Page harness. */
import { Buffer } from 'node:buffer';

function chunk(name, bytes) {
  const header = Buffer.alloc(8);
  header.write(name);
  header.writeUInt32LE(bytes.length, 4);
  return Buffer.concat([header, bytes, Buffer.alloc(bytes.length % 2)]);
}

function wave({ channels, bits, rate, data, loop }) {
  const format = Buffer.alloc(16), align = channels * bits / 8;
  format.writeUInt16LE(1, 0);
  format.writeUInt16LE(channels, 2);
  format.writeUInt32LE(rate, 4);
  format.writeUInt32LE(rate * align, 8);
  format.writeUInt16LE(align, 12);
  format.writeUInt16LE(bits, 14);
  const chunks = [chunk('fmt ', format), chunk('data', data)];
  if (loop) {
    const sample = Buffer.alloc(60);
    sample.writeUInt32LE(1, 28);
    sample.writeUInt32LE(loop[0], 44);
    sample.writeUInt32LE(loop[1], 48);
    chunks.push(chunk('smpl', sample));
  }
  const header = Buffer.alloc(12);
  header.write('RIFF');
  header.writeUInt32LE(4 + chunks.reduce((total, value) => total + value.length, 0), 4);
  header.write('WAVE', 8);
  return Uint8Array.from(Buffer.concat([header, ...chunks]));
}

const music = Buffer.alloc(22050 * 2 + 1);
for (let i = 0; i < music.length - 1; i += 2) {
  music[i] = i % 20 < 10 ? 224 : 32;
  music[i + 1] = 96;
}
const cue = Buffer.alloc(2205 * 2);
for (let i = 0; i < cue.length; i += 2) cue.writeInt16LE(i % 20 < 10 ? -16384 : 8192, i);

export const musicBytes = () => wave({ channels: 2, bits: 8, rate: 44100, data: music, loop: [2205, 11025] });
export const cueBytes = () => wave({ channels: 1, bits: 16, rate: 22050, data: cue });
export const originalAudioRows = () => [
  { path: 'Bin/bgm/cgbgm_m0.wav', bytesHex: Buffer.from(musicBytes()).toString('hex') },
  { path: 'Bin/se/cgsys09.wav', bytesHex: Buffer.from(cueBytes()).toString('hex') },
];

export function observeAudio() {
  const starts = [], gains = [];
  let closed = 0, resumed = 0;
  const context = {
    destination: {},
    resume() { resumed++; },
    close() { closed++; },
    createBuffer(channels, length, sampleRate) {
      const samples = Array.from({ length: channels }, () => new Float32Array(length));
      return { length, sampleRate, samples, copyToChannel(source, channel, start) { samples[channel].set(source, start); } };
    },
    createGain() {
      const changes = [];
      const gain = { changes, gain: { set value(value) { changes.push(value); } },
        disconnected: false, connect() {}, disconnect() { this.disconnected = true; } };
      gains.push(gain);
      return gain;
    },
    createBufferSource() {
      return { loop: false, stopped: false, disconnected: false, connect(gain) { this.connected = gain; },
        start() { starts.push(this); }, stop() { this.stopped = true; }, disconnect() { this.disconnected = true; } };
    },
  };
  return { context, starts, gains, get closed() { return closed; }, get resumed() { return resumed; } };
}
