import test from 'node:test';
import * as api from '../../shared/index.mjs';
import {runPartyTCP} from '../../analysis/game-party-follow-v1/tcp-flow.mjs';
for(const name of ['leader','follower','removal'])test(`actual original OS TCP party ${name} verifies complete scenes, source requests and ownership`,{timeout:20000},()=>runPartyTCP(api,name));
