export class PixelView {
  constructor(canvas, stage, emptyState) {
    this.canvas = canvas;
    this.stage = stage;
    this.emptyState = emptyState;
    this.scale = 'fit';
    this.frame = null;
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => this.updateScale());
      this.observer.observe(stage);
    } else {
      window.addEventListener('resize', () => this.updateScale());
    }
  }

  clear() {
    this.frame = null;
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.canvas.hidden = true;
    this.canvas.setAttribute('aria-label', '尚无可显示的像素');
    this.emptyState.hidden = false;
    this.stage.style.justifyItems = 'center';
    this.stage.style.alignItems = 'center';
    this.stage.scrollTop = 0;
    this.stage.scrollLeft = 0;
  }

  show(frame, sourceLabel) {
    if (frame.width > 4096 || frame.height > 4096) {
      throw new Error('此记录超过浏览器查看器每边 4096 像素的显示预算；未绘制。');
    }
    this.frame = frame;
    this.canvas.width = frame.width;
    this.canvas.height = frame.height;
    const context = this.canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('当前浏览器无法创建 2D 画布。');
    const image = context.createImageData(frame.width, frame.height);
    for (let i = 0; i < frame.pixels.length; i += 1) {
      const value = frame.pixels[i];
      image.data[i * 4] = value;
      image.data[i * 4 + 1] = value;
      image.data[i * 4 + 2] = value;
      image.data[i * 4 + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    this.canvas.hidden = false;
    this.emptyState.hidden = true;
    this.canvas.setAttribute('aria-label', `${sourceLabel}，${frame.width} 乘 ${frame.height} 原始索引像素的灰度检查。颜色和方向未确认。`);
    this.updateScale();
  }

  setScale(value) {
    this.scale = value;
    this.updateScale();
  }

  updateScale() {
    if (!this.frame) return;
    const style = getComputedStyle(this.stage);
    const availableWidth = Math.max(1, this.stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
    const availableHeight = Math.max(1, this.stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom));
    const fit = Math.min(availableWidth / this.frame.width, availableHeight / this.frame.height, 8);
    const scale = this.scale === 'fit' ? fit : Number(this.scale);
    this.canvas.style.width = `${Math.max(1, this.frame.width * scale)}px`;
    this.canvas.style.height = `${Math.max(1, this.frame.height * scale)}px`;
    // Start-aligned overflow keeps the top/left pixels reachable when zoomed.
    this.stage.style.justifyItems = this.frame.width * scale > availableWidth ? 'start' : 'center';
    this.stage.style.alignItems = this.frame.height * scale > availableHeight ? 'start' : 'center';
  }
}
