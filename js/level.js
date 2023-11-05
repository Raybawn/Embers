// JavaScript
export class Level {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
