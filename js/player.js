// JavaScript
import { Bullet } from "./bullet.js";

// JavaScript
export class Player {
  constructor(x, y) {
    // Position
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 5;
    this.direction = { up: false, down: false, left: false, right: false };

    // Shield
    this.shieldHealth = 100;
    this.shieldHealthMax = 100;

    // Health
    this.health = 100;
    this.healthMax = 100;

    // Regeneration
    this.regenRate = 0.1; // Amount of health/shield regenerated per second
    this.regenDelay = 5; // Number of seconds to wait before starting to regenerate health/shield
    this.timeOfLastDamage = Date.now();

    // Score
    this.score = 0;

    // Bullets
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
    ctx.strokeRect(45, 10, this.healthMax, 20); // Move the border to the right

    ctx.fillStyle = "black";
    ctx.font = "20px 'Pixelify Sans'";
    ctx.fillText("HP", 10, 27); // Draw "HP" text
  }

  drawShieldBar(ctx) {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(45, 40, this.shieldHealth, 20); // Move the shield bar to the right

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 40, this.shieldHealthMax, 20); // Move the border to the right

    ctx.fillStyle = "black";
    ctx.font = "20px 'Pixelify Sans'";
    ctx.fillText("SH", 10, 57); // Draw "Shield" text
  }

  drawScore(ctx) {
    ctx.fillStyle = "black";
    ctx.font = "20px 'Pixelify Sans'";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + this.score, 10, 87); // Display the score
  }

  incrementScore() {
    this.score++;
  }

  regen() {
    // Regenerate health/shield if enough time has passed since last damage
    if ((Date.now() - this.timeOfLastDamage) / 1000 >= this.regenDelay) {
      if (this.shieldHealth < this.shieldHealthMax) {
        this.shieldHealth = Math.min(
          this.shieldHealth + this.regenRate,
          this.shieldHealthMax
        );
      } else if (this.health < this.healthMax) {
        this.health = Math.min(this.health + this.regenRate, this.healthMax);
      }
    }
  }

  takeDamage(amount) {
    if (this.shieldHealth > 0) {
      this.shieldHealth = Math.max(this.shieldHealth - amount, 0); // Ensure shield health does not go below zero
    } else {
      this.health = Math.max(this.health - amount, 0); // Ensure health does not go below zero
    }
    this.timeOfLastDamage = Date.now(); // Update the time of last damage
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
