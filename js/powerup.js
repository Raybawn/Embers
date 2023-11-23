export class PowerUp {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.specialChance = 0.5;
  }

  draw(ctx) {
    ctx.fillStyle = this.isSpecial ? "yellow" : "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  addToPowerUpList(powerUps) {
    powerUps.push(this);
  }

  static getRandomType() {
    let randomNumber = Math.random();

    // Define all possible power-up types
    // const types = ["increaseSpeed", "increaseHealth", "increaseFireRate"];
    const types = ["increaseFireRate"];
    const typesSpecial = ["aimbot"];

    // Get a random type
    const randomIndex = Math.floor(Math.random() * types.length);
    const randomIndexSpecial = Math.floor(Math.random() * typesSpecial.length);

    if (randomNumber < this.specialChance) {
      return typesSpecial[randomIndexSpecial];
    } else {
      return types[randomIndex];
    }
  }

  // static getRandomTypes() {
  //   // Define all possible power-up types
  //   const types = ["increaseSpeed", "increaseHealth", "increaseFireRate"];

  //   // Get two random types
  //   const randomIndex1 = Math.floor(Math.random() * types.length);
  //   let randomIndex2;
  //   do {
  //     randomIndex2 = Math.floor(Math.random() * types.length);
  //   } while (randomIndex1 === randomIndex2);

  //   return [types[randomIndex1], types[randomIndex2]];
  // }

  applyEffect(player) {
    // Apply the effect of the power-up
    switch (this.type) {
      case "increaseSpeed":
        console.log("speed increased");
        player.speed += 0.05;
        break;
      case "increaseHealth":
        console.log("health increased");
        player.healthMax += 20;
        player.health += 20;
        break;
      case "increaseFireRate":
        console.log("fire rate increased");
        player.fireRate += 10;
        break;
      case "aimbot":
        console.log("aimbot active");
        player.aimbot = true;
        break;
      default:
        break;
    }
  }
}
