// JavaScript
import { Level } from "./level.js";
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set initial canvas size
canvas.width = window.innerWidth - 12;
canvas.height = window.innerHeight - 12;

// Update canvas size on window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let player = new Player(canvas.width / 2, canvas.height / 2);
let level = new Level(canvas, ctx, 100);
let spawnInterval;
let enemies = [];
let paused = false;

// Draw the level
level.draw();

// Add keyboard controls
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "ArrowUp":
      player.direction.up = true;
      break;
    case "s":
    case "ArrowDown":
      player.direction.down = true;
      break;
    case "a":
    case "ArrowLeft":
      player.direction.left = true;
      break;
    case "d":
    case "ArrowRight":
      player.direction.right = true;
      break;
    case " ":
      player.shieldHealth = 100; // Shield will have 100 health points
      break;
    case "Escape":
      if (paused) {
        // Game is being unpaused
        startSpawningEnemies();
      } else {
        // Game is being paused
        stopSpawningEnemies();
      }
      paused = !paused;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
    case "ArrowUp":
      player.direction.up = false;
      break;
    case "s":
    case "ArrowDown":
      player.direction.down = false;
      break;
    case "a":
    case "ArrowLeft":
      player.direction.left = false;
      break;
    case "d":
    case "ArrowRight":
      player.direction.right = false;
      break;
  }
});

// Function to spawn an enemy
function spawnEnemy() {
  // Calculate spawn position
  let x = Math.random() < 0.5 ? -50 : canvas.width + 50;
  let y = Math.random() * canvas.height;

  // Calculate direction towards player
  let dx = player.x - x;
  let dy = player.y - y;
  let length = Math.sqrt(dx * dx + dy * dy);
  dx /= length;
  dy /= length;

  // Create enemy and add to array
  enemies.push(new Enemy(x, y, dx, dy));
}

function startSpawningEnemies() {
  spawnInterval = setInterval(spawnEnemy, 2000);
}

function stopSpawningEnemies() {
  clearInterval(spawnInterval);
}

// Start spawning enemies when the game starts
startSpawningEnemies();

// Game loop
function gameLoop() {
  if (!paused) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw the player
    player.update(canvas.width, canvas.height);
    player.draw(ctx);

    // Update and draw enemies
    enemies = enemies.filter((enemy) => {
      enemy.update(player.x, player.y);
      enemy.draw(ctx);

      // Check for collision with player
      if (
        player.x < enemy.x + enemy.size &&
        player.x + player.size > enemy.x &&
        player.y < enemy.y + enemy.size &&
        player.y + player.size > enemy.y
      ) {
        // Collision detected, decrease player's health and remove enemy
        player.health -= 10;
        if (player.health < 0) player.health = 0; // Ensure health doesn't go below 0

        // Log collision to the console
        console.log("Collision detected!");

        return false;
      }

      return true;
    });

    // Draw the player's health bar
    player.drawHealthBar(ctx);
  }

  // Draw "Paused" text if the game is paused
  if (paused) {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.textAlign = "left";
    ctx.fillText("⏸️ Paused", 10, canvas.height - 10);
  }

  // Call the game loop again on the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
