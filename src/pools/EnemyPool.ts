import { AEnemy } from "../enemies/AEnemy";
import { Asteroid } from "../enemies/Asteroid";
import { Pool } from "./Pool";

export class EnemyPool extends Pool<AEnemy> {
  constructor(size: number) {
    super(...Array.from({ length: size }).map(() => new Asteroid()));
  }

  public update(delta: number) {
    super.update(delta);
  }
}