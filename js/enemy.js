import { checkCollision } from "./utils.js";

// JavaScript
export class Enemy {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.dx = dx;
    this.dy = dy;
    this.speedMax = 3;
    this.speedMin = 1;
    this.speed =
      Math.random() * (this.speedMax - this.speedMin) + this.speedMin;
    this.damage = 10;
    this.health = 10;
    this.destroyed = false;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy() {
    // Remove this enemy from the enemies array
    this.destroyed = true;
  }

  update(player) {
    // Calculate direction towards player
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;

    // Update position
    this.x += dx * this.speed;
    this.y += dy * this.speed;

    // check for collision with player
    if (checkCollision(this, player)) {
      // Collision detected, damage the player
      player.takeDamage(this.damage);
    }
  }
}
