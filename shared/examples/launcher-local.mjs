import { createLauncherLicenseReview, resetLauncherLoginInputs } from '../index.mjs';

// Original fixture inputs and four placeholder pages; this performs no actual license acceptance or storage.
const usernameBytes = new TextEncoder().encode('SyntheticU1'), passwordBytes = new TextEncoder().encode('SyntheticP1');
const review = createLauncherLicenseReview({ gameCodeText: '11', usernameBytes, recordedVersion: 0,
  forcePrompt: false, pageAvailability: [true, true, true, true] });
const pages = [review.snapshot().resourceId];
for (let index = 0; index < 3; index += 1) pages.push(review.advance().snapshot.resourceId);
const decision = review.decide(true);
const reset = resetLauncherLoginInputs({ usernameBytes, passwordBytes, rememberUsername: true, rememberPassword: false });
console.log(JSON.stringify({ fixtureOnly: true, pages, state: decision.snapshot.state,
  writeIntentValue: decision.writeRequested.value, writeIntentKeyLength: decision.writeRequested.key.length,
  retainedByteLengths: [reset.usernameBytes.length, reset.passwordBytes.length], authentication: 'unverified', persisted: false }, null, 2));
