// JavaScript
import { Bullet } from "./bullet.js";

// JavaScript
export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 5;
    this.direction = { up: false, down: false, left: false, right: false };
    this.shieldHealth = 100;
    this.health = 100;
    this.bullets = [];
    this.shootInterval = 30; // The player will shoot every 30 frames
    this.framesSinceLastShot = 0;
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, 50, 50);

    // Draw blue border if shielded
    if (this.shieldHealth > 0) {
      ctx.strokeStyle = "lightblue";
      ctx.lineWidth = 5;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    // Draw bullets
    for (let bullet of this.bullets) {
      bullet.draw(ctx);
    }
  }

  drawHealthBar(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(45, 10, this.health, 20); // Move the health bar to the right

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 10, 100, 20); // Move the border to the right

    ctx.fillStyle = "black";
    ctx.font = "20px 'Pixelify Sans'";
    ctx.fillText("HP", 10, 27); // Draw "HP" text
  }

  drawShieldBar(ctx) {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(45, 40, this.shieldHealth, 20); // Move the shield bar to the right

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 40, 100, 20); // Move the border to the right

    ctx.fillStyle = "black";
    ctx.font = "20px 'Pixelify Sans'";
    ctx.fillText("SH", 10, 57); // Draw "Shield" text
  }

  takeDamage(amount) {
    // check if player has shield active, if yes reduce shield health, else reduce player health
    if (this.shieldHealth > 0) {
      this.shieldHealth -= amount;
      if (this.shieldHealth < 0) this.shieldHealth = 0; // Ensure shield health doesn't go below 0
      return;
    } else {
      this.health -= amount;
      if (this.health < 0) this.health = 0; // Ensure health doesn't go below 0
    }
  }

  update(canvasWidth, canvasHeight) {
    let dx = 0;
    let dy = 0;

    if (this.direction.up) dy -= 1;
    if (this.direction.down) dy += 1;
    if (this.direction.left) dx -= 1;
    if (this.direction.right) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx /= Math.sqrt(2);
      dy /= Math.sqrt(2);
    }

    // Movement speed
    let speed = this.speed;

    // Check for canvas boundaries before updating position
    let newX = this.x + dx * speed;
    let newY = this.y + dy * speed;

    if (newX >= 0 && newX <= canvasWidth - 50) {
      this.x = newX;
    }

    if (newY >= 0 && newY <= canvasHeight - 50) {
      this.y = newY;
    }

    // Shoot a bullet if enough frames have passed since the last shot
    this.framesSinceLastShot++;
    if (this.framesSinceLastShot >= this.shootInterval) {
      this.bullets.push(new Bullet(this.x + 25, this.y));
      this.framesSinceLastShot = 0;
    }

    // Update bullets and remove off-screen bullets
    this.bullets = this.bullets.filter((bullet) => {
      bullet.update();
      return (
        bullet.y > 0 &&
        bullet.y < canvasHeight &&
        bullet.x > 0 &&
        bullet.x < canvasWidth
      );
    });
  }
}
