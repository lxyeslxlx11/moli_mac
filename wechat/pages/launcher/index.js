const { createWeChatLauncherHost } = require('../../lib/launcher.js')
const config = require('../../runtime-config.js')
const lifecycle = require('../../lifecycle.js')
Page({
  data: { status: '正在准备…', games: [], regions: [], galaxies: [], rows: [], inputMounts: [0] },
  onLoad() {
    this._disposed = false
    this._host = createWeChatLauncherHost({ wx, config, render: view => { if (!this._disposed) this.setData(view) } })
    this._unsubscribe = lifecycle.listen(() => this._host?.hide())
  },
  onHide() { this._host?.hide() },
  onUnload() { this._disposed = true; this._unsubscribe?.(); this._host?.hide(); this._host = null },
  onGame(event) { this._host.chooseGame(Number(event.detail.value)) },
  onLoadCatalogs() { return this._host.loadCatalogs() },
  onCheckCatalogCache() { return this._host.checkCatalogCache() },
  onSaveCatalogCache() { return this._host.saveCatalogCache() },
  onRestoreCatalogCache() { this._host.restoreCatalogCache() },
  onPatchSource(event) { this._host.choosePatchSource(Number(event.detail.value)-1) },
  onImportResourceBase() { return this._host.importResourceBase() },
  onPrepareResources() { return this._host.prepareResources() },
  onClearResources() { this._host.clearResources() },
  onSelectResources() { this._host.selectResources() },
  onCheckResourceCache() { return this._host.checkResourceCache() },
  onRestoreResourceCache() { this._host.restoreResourceCache() },
  onSaveResourceCache() { return this._host.saveResourceCache() },
  onRegion(event) { this._host.chooseRegion(Number(event.detail.value)) },
  onGalaxy(event) { this._host.chooseGalaxy(Number(event.detail.value)) },
  onUsername(event) { this._host.inputUsername(event.detail.value) },
  onPassword(event) { this._host.inputPassword(event.detail.value) },
  onReview() { this._host.beginReview() },
  onNext() { this._host.nextPage() },
  onAccept() { this._host.decide(true) },
  onDecline() { this._host.decide(false) },
  onStart() { return this._host.login() },
  onCancel() { this._host.cancel() },
  onProfile(event) { this._host.selectProfile(Number(event.currentTarget.dataset.ordinal)) },
  onOpenGame() {
    if (!this._host || this.data.busy || this._openingGame) return
    this._openingGame = true
    const failed = () => {
      lifecycle.clearGameResources()
      this._openingGame = false
      if (!this._disposed) this.setData({ status: '无法打开游戏页，请重试。' })
    }
    try {
      const files = this.data.resourcesSelected ? this._host.copySelectedResources().files : null
      lifecycle.stageGameResources(files)
      wx.navigateTo({ url: '/game/pages/play/index', success: () => { this._openingGame = false }, fail: failed })
    } catch { failed() }
  }
})
