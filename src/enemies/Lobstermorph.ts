import { AEnemy } from "./AEnemy";

export class Lobstermorph extends AEnemy {
  constructor() {
    super(document.getElementById("lobstermorph") as HTMLImageElement, 8, 4, 6, 8);
  }

  public hit() {
    this.frame++;
    super.hit();
  }
}