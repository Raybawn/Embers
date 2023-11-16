import { Enemy } from "./enemy.js";

export class Spawner {
  constructor(spawnInterval, spawnRateIncrease, canvas, player, gameStarted) {
    this.spawnInterval = spawnInterval;
    this.spawnRateIncrease = spawnRateIncrease;
    this.lastSpawnTime = Date.now();
    this.canvas = canvas;
    this.player = player;
    this.spawning = true;
    this.gameStarted = gameStarted;
  }

  shouldSpawn() {
    console.log("Checking if should spawn...");
    // Check if enough time has passed since the last spawn
    if (Date.now() - this.lastSpawnTime >= this.spawnInterval) {
      this.lastSpawnTime = Date.now(); // Update the time of the last spawn
      this.spawnInterval = Math.max(
        this.spawnInterval - this.spawnRateIncrease,
        500
      );
      return true;
    }
    return false;
  }

  spawnEnemy() {
    if (!this.spawning || !this.gameStarted) return null;

    console.log("Spawning enemy...");

    // Calculate spawn position
    let x = Math.random() < 0.5 ? -50 : this.canvas.width + 50;
    let y = Math.random() * this.canvas.height;

    // Calculate direction towards player
    let dx = this.player.x - x;
    let dy = this.player.y - y;
    let length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;

    // Create a new enemy and return it
    return new Enemy(x, y, dx, dy);
  }

  setGameStarted(gameStarted) {
    this.gameStarted = gameStarted;
  }

  start() {
    this.spawning = true;
  }

  stop() {
    this.spawning = false;
  }
}
