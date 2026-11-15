import { createLegacyGameMapDialogGraphics } from '../../shared/legacy-game-map-dialog-graphics.mjs';

export function createWeChatDialogGraphics(notify) {
  let current = null, generation = 0;

  function release(value) {
    value.job?.cancel();
    value.renderer?.close();
    if (value.context) {
      try { value.context.clearRect(0, 0, value.illustration.width, value.illustration.height); }
      catch { /* The Page may already have unmounted this surface. */ }
    }
    value.renderer = value.context = null;
  }

  function clear() {
    const previous = current;
    current = null;
    if (previous) release(previous);
  }

  function state(value, status) {
    if (current !== value || value.status === status) return;
    value.status = status;
    notify();
  }

  function unavailable(value) {
    if (current !== value) return;
    release(value);
    state(value, 'unavailable');
  }

  function sync(client, revision, illustration) {
    if (!illustration) { clear(); return; }
    const signature = revision + '/' + JSON.stringify(illustration);
    if (current?.client === client && current.signature === signature) return;
    clear();
    current = { client, illustration, signature, key: ++generation, status: 'loading',
      context: null, renderer: null, job: null };
  }

  function bind(node, key) {
    const value = current;
    if (!value || value.key !== key) return false;
    if (value.renderer) return true;
    try {
      const context = node?.getContext('2d', { alpha: true });
      if (!context || typeof context.createImageData !== 'function' || typeof context.putImageData !== 'function') {
        unavailable(value);
        return false;
      }
      node.width = value.illustration.width;
      node.height = value.illustration.height;
      value.context = context;
      value.renderer = createLegacyGameMapDialogGraphics(value.illustration, value.client.library());
      state(value, 'loading');
      return true;
    } catch {
      unavailable(value);
      return false;
    }
  }

  function render() {
    const value = current;
    if (!value?.renderer || value.job) return;
    try {
      const plan = value.renderer.advance();
      if (!plan) {
        if (value.status === 'loading') unavailable(value);
        return;
      }
      if (!plan.commands.length) { unavailable(value); return; }
      const job = value.client.library().startRender(plan);
      value.job = job;
      return job.done.then(frame => {
        try {
          if (current !== value || value.job !== job || !value.context) return;
          const image = value.context.createImageData(frame.width, frame.height);
          image.data.set(frame.rgba);
          value.context.putImageData(image, 0, 0);
          state(value, 'ready');
        } finally { frame.rgba.fill(0); }
      }).catch(() => unavailable(value)).finally(() => { if (value.job === job) value.job = null; });
    } catch {
      unavailable(value);
    }
  }

  return Object.freeze({
    sync, bind, render, clear,
    snapshot() {
      if (!current) return null;
      const { width, height } = current.illustration;
      return { key: current.key, status: current.status, width, height, displayHeight: Math.round(650 * height / width) };
    },
  });
}
