// JavaScript
export class Enemy {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = 2;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, 20, 20);
  }

  update(playerX, playerY) {
    // Calculate direction towards player
    let dx = playerX - this.x;
    let dy = playerY - this.y;
    let length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;

    // Update position
    this.x += dx * this.speed;
    this.y += dy * this.speed;
  }
}
