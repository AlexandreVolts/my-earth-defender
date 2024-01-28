import { AEnemy } from "./AEnemy";

export class Asteroid extends AEnemy {

  constructor() {
    super(document.getElementById("asteroid") as HTMLImageElement, 1, 4, 6);
  }
}