// JavaScript
import { Level } from "./level.js";
import { Player } from "./player.js";
import { Spawner } from "./spawner.js";
import { checkCollision } from "./utils.js";

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
let enemies = [];
let paused = false;
let gameStarted = false;

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
      // player.useItem();
      break;
    case "Escape":
      if (paused) {
        // Game is being unpaused
        spawner.start();
      } else {
        // Game is being paused
        spawner.stop();
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

// Start the game
function startGame() {
  gameStarted = true;
  spawner.setGameStarted(gameStarted); // Update the Spawner's gameStarted property

  // Reset player's health
  player.health = 100;
  player.shieldHealth = 100;
  player.score = 0;

  // Clear enemies array
  enemies = [];

  // Start spawning enemies
  spawner.start();
  spawner.startIncreasingSpawnRate();

  // Start the game loop again
  gameLoop();
}

// End the game
function endGame() {
  gameStarted = false;
  spawner.setGameStarted(gameStarted); // Update the Spawner's gameStarted property

  // Draw "Game Over" text
  ctx.fillStyle = "red";
  ctx.font = "60px 'Pixelify Sans'";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);

  ctx.fillStyle = "black";
  ctx.font = "20px 'Pixelify Sans'";
  ctx.textAlign = "center";
  ctx.fillText(
    "Score: " + player.score,
    canvas.width / 2,
    canvas.height / 2 + 50
  ); // Display the score

  // Draw "Restart Game" button
  let buttonWidth = 230;
  let buttonHeight = 50;
  let buttonX = (canvas.width - buttonWidth) / 2;
  let buttonY = (canvas.height - buttonHeight) / 2 + 100;
  ctx.fillStyle = "black";
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  ctx.fillStyle = "white";
  ctx.font = "30px 'Pixelify Sans'";
  ctx.fillText(
    "Restart Game",
    canvas.width / 2,
    buttonY + buttonHeight / 2 + 10
  );

  // Add click event listener to the canvas to handle button click
  canvas.addEventListener(
    "click",
    function (event) {
      let rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      // Check if the click is inside the button
      if (
        x >= buttonX &&
        x <= buttonX + buttonWidth &&
        y >= buttonY &&
        y <= buttonY + buttonHeight
      ) {
        startGame();
      }
    },
    { once: true }
  ); // The event listener is removed after being invoked once

  // Stop spawning enemies
  spawner.stop();
  spawner.stopIncreasingSpawnRate();
}

let spawnRateIncrease = 0.1; // Adjust this value as needed
let spawner = new Spawner(2000, spawnRateIncrease, canvas, player, gameStarted);

// Start increasing the spawn rate every 30 seconds
spawner.startIncreasingSpawnRate();

// Game loop
function gameLoop() {
  if (!paused) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw the player
    player.update(canvas.width, canvas.height);
    player.draw(ctx);

    // debug spawner
    let shouldSpawn = spawner.shouldSpawn();

    // Spawn enemies
    if (shouldSpawn) {
      let newEnemy = spawner.spawnEnemy();
      if (newEnemy !== null) {
        enemies.push(newEnemy);
      }
    }

    // Update and draw enemies
    enemies.forEach((enemy) => {
      enemy.update(player);
      enemy.draw(ctx);

      // Check for collisions between bullets and enemies
      for (let bullet of player.bullets) {
        let hitEnemy = bullet.checkCollisions(enemies);
        if (hitEnemy) {
          bullet.destroy();
          hitEnemy.health -= 10; // Enemy takes damage

          // If enemy's health reaches 0, destroy the enemy
          if (hitEnemy.health <= 0) {
            console.log("Enemy destroyed!");
            hitEnemy.destroyed = true;
          }
        }
      }

      // Check for collision with player
      if (checkCollision(player, enemy)) {
        if (player.health < 0) player.health = 0; // Ensure health doesn't go below 0
        enemy.destroyed = true;

        // Log collision to the console
        console.log("Collision detected!");
      }

      // Increment the score if the enemy is destroyed
      if (enemy.destroyed) {
        player.incrementScore(); // Increment the score
      }

      // Return false if the enemy is destroyed, true otherwise
      return !enemy.destroyed;
    });

    // Draw the player's health and shield bar
    player.drawHealthBar(ctx);
    player.drawShieldBar(ctx);
    player.drawScore(ctx);
    player.regen();

    // If the player's health reaches 0, display the game over screen
    if (player.health <= 0) {
      endGame();
      return; // Stop the game loop
    }
  }

  // Draw "Paused" text if the game is paused
  if (paused) {
    ctx.fillStyle = "black";
    ctx.font = "30px 'Pixelify Sans'";
    ctx.textAlign = "left";
    ctx.fillText("⏸️ Paused", 10, canvas.height - 10);
  }

  player.bullets = player.bullets.filter((bullet) => !bullet.destroyed);
  enemies = enemies.filter((enemy) => !enemy.destroyed);

  // Call the game loop again on the next frame
  requestAnimationFrame(gameLoop);
}

// Create a start button
let startButton = document.createElement("button");
startButton.innerHTML = "Start Game";
startButton.className = "start-button"; // Add a class to the button
document.body.appendChild(startButton);

// Start the game when the start button is clicked
startButton.addEventListener("click", function () {
  // Remove the start button
  startButton.remove();

  startGame();

  // Start the game loop
  gameLoop();
});

let frameCount = 0;
let lastUpdateTime = Date.now();
let fpsElement = document.getElementById("fps");

function countFrames() {
  if (gameStarted) {
    // Only count frames if the game has started
    frameCount++;
    let now = Date.now();
    let delta = now - lastUpdateTime;
    if (delta >= 1000) {
      // Every second
      fpsElement.textContent = `${frameCount} FPS`;
      frameCount = 0;
      lastUpdateTime = now;
    }
  }
  requestAnimationFrame(countFrames);
}

requestAnimationFrame(countFrames);
