/** Thin desktop/mobile Canvas adapter for a configured source world/runtime. No resource substitutes or network defaults. */
export function createLegacyGameCanvasHost(settings){return createHost(settings,null);}
export function createLegacyGameCanvasResourceHost({library,...settings}){if(library?.inspect?.().profile!=='legacy-se6000-37c4-resource-library-v1')throw Error('LEGACY_CANVAS_RESOURCE_LIBRARY');return createHost(settings,library);}
function createHost({canvas,runtime,readFrame,onRequests=()=>{},onState=()=>{},onPresent=()=>{},onImage=()=>{},renderMapDialogGraphics,decorateFrame,tick=()=>Math.trunc(performance.now())>>>0,
  schedule=(fn,delay)=>setTimeout(fn,delay),cancel=id=>clearTimeout(id),bindPointerEvents=true},resourceLibrary){
  if(!canvas||typeof canvas.getContext!=='function'||typeof readFrame!=='function'||runtime?.inspect?.().profile!=='legacy-se6000-37c4-runtime-v1'||(decorateFrame!==undefined&&typeof decorateFrame!=='function'))throw Error('LEGACY_CANVAS_CONFIGURATION');
  const context=canvas.getContext('2d',{alpha:true});if(!context)throw Error('LEGACY_CANVAS_CONTEXT');
  let state='stopped',timer=null,busy=false,activePointer=null,pickupMode=false,mappedPrimary=false;
  let presentations=0,updates=0,lastError=null,assetJob=null,generation=0;
  const events=[];
  const listen=(target,type,handler)=>{target.addEventListener(type,handler);events.push([target,type,handler]);};
  const active=()=>{if(state==='closed')throw Error('LEGACY_CANVAS_CLOSED');};
  const point=event=>{const r=canvas.getBoundingClientRect();if(!(r.width>0&&r.height>0))throw Error('LEGACY_CANVAS_GEOMETRY');runtime.move([Math.trunc((event.clientX-r.left)*canvas.width/r.width),Math.trunc((event.clientY-r.top)*canvas.height/r.height)]);};
  const input=handler=>event=>{if(state!=='running')return;try{handler(event);}catch{stop();lastError='LEGACY_CANVAS_INPUT';onState(inspect());}};
  const reset=()=>{activePointer=null;mappedPrimary=false;if(runtime.inspect().state==='open')runtime.resetButtons();};
  if(bindPointerEvents){
    listen(canvas,'pointerdown',input(event=>{if(event.button!==0&&event.button!==2)return;if(activePointer!==null&&activePointer!==event.pointerId)return;
      if(event.button===0)mappedPrimary=pickupMode;
      point(event);runtime.press(event.button===0&&mappedPrimary?2:event.button);
      activePointer=event.pointerId;canvas.setPointerCapture?.(event.pointerId);event.preventDefault();}));
    listen(canvas,'pointermove',input(event=>{if(activePointer!==null&&activePointer!==event.pointerId)return;point(event);}));
    listen(canvas,'pointerup',input(event=>{if(activePointer!==null&&activePointer!==event.pointerId)return;if(event.button!==0&&event.button!==2)return;
      point(event);runtime.release(event.button===0&&mappedPrimary?2:event.button);
      if(event.button===0)mappedPrimary=false;
      if(event.buttons===0)activePointer=null;event.preventDefault();}));
    listen(canvas,'pointercancel',input(reset));listen(canvas,'lostpointercapture',input(event=>{if(activePointer===event.pointerId)reset();}));
    listen(canvas,'contextmenu',event=>{if(state==='running')event.preventDefault();});
  }
  function inspect(){return Object.freeze({state,presentations,updates,lastError,pickupMode,runtime:runtime.inspect(),...(resourceLibrary?{loadingImages:assetJob!==null}:{} )});}
  function stop(){active();generation++;assetJob?.cancel();if(timer!==null){cancel(timer);timer=null;}state='stopped';reset();}
  function pump(){active();if(resourceLibrary)return pumpAsync();if(busy)throw Error('LEGACY_CANVAS_REENTRANT');busy=true;
    try{const source=readFrame();active();const stamp=tick(),result=runtime.pump({...source,tick:stamp});active();updates+=result.updates;
      // Descriptors survive drawing failures and source catch-up steps; the caller owns transport ordering.
      onRequests(result.requests,result);active();if(runtime.inspect().state!=='open')throw Error('LEGACY_CANVAS_RUNTIME_CLOSED');
      if(result.present){const layer=result.frame?.sceneLayer;if(!layer)throw Error('LEGACY_CANVAS_SCENE_REQUIRED');if(!draw(layer,result.frame,stamp))return Object.freeze({...result,present:false,sourcePresent:true,cancelled:true});}
      lastError=result.error?.code??null;if(lastError&&state==='running')stop();onState(inspect(),result);return result;
    }catch(error){if(state!=='closed'){stop();lastError='LEGACY_CANVAS_FRAME';onState(inspect());}throw error;}finally{busy=false;}
  }
  const draw=(layer,frame,stamp)=>{const serial=generation;if(decorateFrame){const result=decorateFrame(layer,stamp);if(result!==undefined){Promise.resolve(result).catch(()=>{});throw Error('LEGACY_CANVAS_DECORATOR');}}if(state==='closed'||serial!==generation)return false;if(canvas.width!==layer.width)canvas.width=layer.width;if(canvas.height!==layer.height)canvas.height=layer.height;const image=context.createImageData(layer.width,layer.height);image.data.set(layer.rgba);context.putImageData(image,0,0);onImage(image);onPresent(frame,stamp);presentations++;return true;};
  const code=error=>{let value;try{value=Object.getOwnPropertyDescriptor(error??{},'code')?.value;}catch{value=null;}return typeof value==='string'&&/^LEGACY_[A-Z0-9_]{1,89}$/.test(value)?value:'LEGACY_CANVAS_FRAME';};
  async function pumpAsync(){active();if(busy)throw Error('LEGACY_CANVAS_REENTRANT');busy=true;const serial=generation;let result,scene;
    try{const source=readFrame();active();if(serial!==generation)return null;const stamp=tick();active();if(serial!==generation)return null;result=runtime.pump({...source,tick:stamp});active();scene=runtime.copyScene();updates+=result.updates;onRequests(result.requests,result);active();if(runtime.inspect().state!=='open')throw Error('LEGACY_CANVAS_RUNTIME_CLOSED');
      if(serial!==generation)return Object.freeze({...result,present:false,sourcePresent:result.present,cancelled:true});
      let rendered=null;
      if(result.present){const layer=result.frame?.sceneLayer;if(!layer?.drawPlan)throw Error('LEGACY_CANVAS_DRAW_PLAN_REQUIRED');assetJob=resourceLibrary.startRender(layer.drawPlan);try{rendered=await assetJob.done;}finally{assetJob=null;}
        if(state!=='closed'&&serial===generation){
          const dialogFrame=renderMapDialogGraphics?.();
          if(dialogFrame)await dialogFrame;
        }
        if(state==='closed'||serial!==generation)return Object.freeze({...result,present:false,sourcePresent:result.present,cancelled:true});
        if(runtime.inspect().state!=='open')throw Error('LEGACY_CANVAS_RUNTIME_CLOSED');if(runtime.copyScene()!==scene){const e=Error('LEGACY_CANVAS_SCENE_CHANGED');e.code='LEGACY_CANVAS_SCENE_CHANGED';throw e;}}
      // Image I/O consumes time. Poll the original absolute wait deadline rather than adding its old duration again.
      const now=tick();if(state==='closed'||serial!==generation)return Object.freeze({...result,present:false,sourcePresent:result.present,cancelled:true});if(!Number.isInteger(now)||now<0||now>0xffffffff)throw Error('LEGACY_CANVAS_TICK');const pacing=runtime.copyState().clock,waitMilliseconds=pacing.phase==='waiting'?Math.max(0,Math.floor(pacing.deadline-now)+1):0;
      if(rendered&&!draw(rendered,result.frame,now))return Object.freeze({...result,present:false,sourcePresent:result.present,cancelled:true});lastError=result.error?.code??null;if(lastError&&state==='running')stop();onState(inspect(),result);return Object.freeze({...result,waitMilliseconds,cancelled:false,renderedScene:rendered});
    }catch(error){if(serial!==generation||state==='closed')return result?Object.freeze({...result,present:false,sourcePresent:result.present,cancelled:true}):null;
      stop();lastError=code(error);onState(inspect());throw error;
    }finally{busy=false;if(serial!==generation&&state==='running'&&timer===null)arm(1);}
  }
  function arm(delay){const serial=generation;let handle,fired=false;const callback=()=>{if(fired||state!=='running'||generation!==serial||timer!==handle)return;fired=true;timer=null;return loop();};handle=schedule(callback,Math.max(1,Math.min(50,delay)));timer=handle;}
  async function loop(){if(state!=='running')return;if(resourceLibrary?.inspect().rendering){arm(1);return;}const serial=generation;try{const result=resourceLibrary?await pumpAsync():pump();if(state==='running'&&timer===null)arm(serial===generation?result.waitMilliseconds:1);}catch{/* state/error recorded by pump; no background retry */}}
  return Object.freeze({pump,start(){active();if(state==='running')return;state='running';generation++;if(!busy)loop();},stop,inspect,
    setPickupMode(enabled){active();if(typeof enabled!=='boolean')throw Error('LEGACY_CANVAS_PICKUP_MODE');pickupMode=enabled;},
    close(){if(state==='closed')return;generation++;assetJob?.cancel();if(timer!==null)cancel(timer);timer=null;for(const [target,type,handler] of events)target.removeEventListener(type,handler);events.length=0;state='closed';reset();},
  });
}
