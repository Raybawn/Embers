export class PowerUp {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    // Add more properties as needed
  }

  draw(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  activate() {
    // Activate the power-up
  }

  addToPowerUpList(powerUps) {
    powerUps.push(this);
  }

  static getRandomTypes() {
    // Define all possible power-up types
    const types = ["increaseSpeed", "increaseHealth", "increaseDropChance"];

    // Get two random types
    const randomIndex1 = Math.floor(Math.random() * types.length);
    let randomIndex2;
    do {
      randomIndex2 = Math.floor(Math.random() * types.length);
    } while (randomIndex1 === randomIndex2);

    return [types[randomIndex1], types[randomIndex2]];
  }
}
