/** Source446740 presentation buffer selector, independent of graphics backend and game progress. */
export const LEGACY_GAME_PRESENTATION_PROFILE=Object.freeze({id:'legacy-se6000-37c4-presentation-v1',sourceSha256:'37c4dfd29efaa665eeb7bdc95486b3f704452ad50ff024f48812cad2f74013bd',buffers:2,initialSelector:'portable-process-zero',originalWindowsPrefix:'unmeasured'});
export function createLegacyGamePresentation(){let closed=false,serial=0,selector=0,owned=new WeakSet();
 const valid=stamp=>!closed&&typeof stamp==='object'&&stamp!==null&&owned.has(stamp)&&stamp.serial===serial&&stamp.selector===selector;
 return Object.freeze({
  capture(){if(closed){const error=Error('Presentation owner is closed.');error.code='LEGACY_PRESENTATION_CLOSED';throw error;}const stamp=Object.freeze({serial,selector});owned.add(stamp);return stamp;},
  canPresent:valid,
  present(stamp){if(!valid(stamp))return false;selector=selector===0?1:0;serial=(serial+1)>>>0;owned=new WeakSet();return true;},
  invalidate(){if(!closed)owned=new WeakSet();},
  inspect(){return Object.freeze({profile:LEGACY_GAME_PRESENTATION_PROFILE.id,state:closed?'closed':'open',serial,selector,initialWindowsParityVerified:false});},
  close(){if(closed)return;closed=true;owned=new WeakSet();},
 });
}
