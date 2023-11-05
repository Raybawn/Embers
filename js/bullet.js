// JavaScript
export class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, 5, 10);
  }

  update() {
    this.y -= this.speed;
  }
}
