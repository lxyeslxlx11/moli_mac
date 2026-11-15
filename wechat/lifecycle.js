const listeners = new Set()
let gameResources = null
function clearGameResources() {
  for (const row of gameResources ?? []) row.bytes.fill(0)
  gameResources = null
}
module.exports = {
  listen(listener) { listeners.add(listener); return () => listeners.delete(listener) },
  stageGameResources(files) { clearGameResources(); gameResources = files },
  takeGameResources() { const files = gameResources; gameResources = null; return files },
  clearGameResources,
  hide() { clearGameResources(); for (const listener of listeners) listener() }
}
