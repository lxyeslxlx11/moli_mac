import test from 'node:test';
import * as api from '../index.mjs';
import {verifyReactionSmoke} from '../../analysis/game-battle-physical-consumers-v1/verify-smoke-flow.mjs';
test('source41f310 reaction smoke keeps body position and RNG while the escape smoke retains random offsets',()=>verifyReactionSmoke(api));
