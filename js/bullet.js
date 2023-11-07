import { checkCollision } from "./utils.js";

// JavaScript
export class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 10;
    this.speed = 10;
    this.damage = 10;
    this.destroyed = false; // Add a destroyed property
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y -= this.speed;
  }

  destroy() {
    // Remove this bullet from the player's bullets array
    this.destroyed = true;
  }

  checkCollisions(enemies) {
    for (let enemy of enemies) {
      if (checkCollision(this, enemy)) {
        enemy.takeDamage(this.damage);
        return true; // Return true if a collision occurred
      }
    }
    return false; // Return false if no collision occurred
  }
}
