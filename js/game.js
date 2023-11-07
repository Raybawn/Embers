// game.js
import { Level } from "./level.js";
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { checkCollision } from './collision.js';

export class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.player = new Player(canvas.width / 2, canvas.height / 2);
        this.level = new Level(canvas, ctx, 100);
        this.spawnInterval;
        this.enemies = [];
        this.paused = false;
    }

    start() {
        this.level.draw();
        this.addControls();
        this.startSpawningEnemies();
        this.gameLoop();
    }

    addControls() {
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
    }

    spawnEnemy() {
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

    startSpawningEnemies() {
        this.spawnInterval = setInterval(this.spawnEnemy.bind(this), 2000);
    }

    stopSpawningEnemies() {
        clearInterval(this.spawnInterval);
    }

    gameLoop() {
        if (!paused) {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw the player
            player.update(canvas.width, canvas.height);
            player.draw(ctx);

            // Update and draw enemies
            enemies = enemies.filter((enemy) => {
                enemy.update(player);
                enemy.draw(ctx);

                // Check for collision with player
                if (checkCollision(player, enemy)) {
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
}