/** Original fixture pipeline. Does not connect, authenticate or read local account data. */
import { createLauncherRecordCodec, createLauncherRecordStream, createLauncherReplyStream } from '../index.mjs';

const fixtureKey = Uint8Array.of(0, 1, 2, 3, 4, 5, 6, 7);
const fixtureReply = Uint8Array.of(0, 9, 2, 0, 0, 0, 7, 0, 0, 0, 19);
const encoder = createLauncherRecordCodec(fixtureKey);
const first = encoder.encode(fixtureReply.subarray(0, 5));
const second = encoder.encode(fixtureReply.subarray(5));
encoder.close();
const records = createLauncherRecordStream(fixtureKey), replies = createLauncherReplyStream();
const parsed = [];
for (const record of [first, second]) {
  for (let offset = 0; offset < record.length; offset += 3) {
    for (const plaintext of records.push(record.subarray(offset, offset + 3))) parsed.push(...replies.push(plaintext));
  }
}
records.finish(); replies.finish(); fixtureKey.fill(0);
console.log(JSON.stringify({ scope: 'original offline fixture only', encryptedRecords: 2,
  decodedReplies: parsed.length, replyTypes: parsed.map(value => value.type), authentication: 'unverified' }, null, 2));
