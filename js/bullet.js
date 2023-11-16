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
    let i = enemies.length;
    while (i--) {
      if (checkCollision(this, enemies[i])) {
        enemies[i].takeDamage(this.damage);
        this.destroy();
        if (enemies[i].health <= 0) {
          enemies[i].destroyed = true; // Mark the enemy for removal
          return enemies[i]; // Return the enemy that was hit
        }
      }
    }
    return null; // Return null if no enemy was hit
  }
}
