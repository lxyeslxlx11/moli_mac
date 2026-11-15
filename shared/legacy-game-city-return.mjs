/** Captured main10 exit and main9 city transitions for the fixed historical profile. */
import {
  composeLegacyGameBattleExitFade, composeLegacyGameCityEntryFade,
  createLegacyGameBattleExitFade, createLegacyGameCityEntryFade,
} from './legacy-game-battle-exit-fade.mjs';

const width = 640, height = 480;
const image = rgba => ({ width, height, rgba });

export function createLegacyGameCityReturn(previous, render, origin = 'map', onStep = () => {}) {
  if(typeof onStep!=='function')throw new TypeError('City return step callback must be a function.');
  let phase = 'awaiting-server', route = null, revision = 0, wait = 0;
  let fade = null, job = null, pending = null, destination = null;
  let committed = previous, outgoing = null, leftFrames = 0, enteredFrames = 0;
  let hasSurface = previous !== null;

  function releaseTransition() {
    job?.cancel(); job = null;
    fade?.close(); fade = null;
    pending?.rgba?.fill(0); pending = null;
    destination?.fill(0); destination = null;
    if (outgoing !== committed) outgoing?.fill(0);
    outgoing = null;
  }

  return Object.freeze({
    inspect() { return Object.freeze({ origin, phase, route, leftFrames, enteredFrames }); },
    begin(nextRoute) {
      revision++;
      releaseTransition();
      route = nextRoute;
      wait = route === 'scene' ? 5 : 31; // main9/1 retains the surface, then 11 clears thirty times.
      leftFrames = enteredFrames = 0;
      if (route === 'battle' || (route === 'scene' && hasSurface)) {
        outgoing = committed;
        fade = createLegacyGameBattleExitFade(14);
        phase = 'leaving';
      } else phase = 'waiting-map';
    },
    async advance(tick) {
      if (pending || job || phase === 'closed') return null;
      let updated=false;const update=ordinary=>{if(!updated){updated=true;onStep(tick,ordinary);}};
      if(phase==='awaiting-server'){
        const serial=revision,next=render(tick,'awaiting');
        if(!next){update(false);return null;}
        job=next;update(true);let output;
        try{output=await next.done;}catch(error){if(serial===revision)throw error;else return null;}
        finally{if(job===next)job=null;}
        if(serial!==revision){output.rgba.fill(0);return null;}
        return pending={rgba:output.rgba,complete:false};
      }
      if (phase === 'leaving') {
        const frame = fade.step();
        const rgba = outgoing ? composeLegacyGameBattleExitFade(image(outgoing), frame.rowPositions, 14, width, height).rgba : null;
        leftFrames++;
        if (frame.complete) {
          fade.close(); fade = null;
          if (outgoing !== committed) outgoing?.fill(0);
          outgoing = null;
          phase = 'waiting-map';
        }
        update(false);return pending = { rgba, complete: false, battleBoundary: route === 'battle' && frame.complete };
      }
      if (phase === 'waiting-map') {
        if (wait > 0) {
          const retain = route !== 'scene' && wait === 31;
          wait--;
          update(false);
          if (retain) return null;
          return pending = { rgba: null, complete: false };
        }
        const serial = revision, next = render(tick,'capture');
        if (!next) {update(false);return null;}
        job = next;
        update(false);
        let output;
        try { output = await next.done; }
        catch (error) { if (serial === revision) throw error; else return null; }
        finally { if (job === next) job = null; }
        if (serial !== revision) { output.rgba.fill(0); return null; }
        destination = output.rgba;
        fade = createLegacyGameCityEntryFade();
        phase = 'entering';
      }
      const frame = fade.step();
      const rgba = composeLegacyGameCityEntryFade(image(destination), frame.rowPositions, width, height).rgba;
      enteredFrames++;
      update(false);
      return pending = { rgba, complete: frame.complete };
    },
    present(frame, paint) {
      if (!pending || frame !== pending) return false;
      paint(frame.rgba, width, height);
      if (committed !== outgoing) committed?.fill(0);
      committed = frame.rgba; pending = null; hasSurface = true;
      return true;
    },
    close() {
      revision++; phase = 'closed'; releaseTransition();
      committed?.fill(0); committed = null;
    },
  });
}
