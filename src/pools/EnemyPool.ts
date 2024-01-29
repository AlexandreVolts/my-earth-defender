import { Vector2 } from "../Vector2";
import { AEnemy } from "../enemies/AEnemy";
import { Asteroid } from "../enemies/Asteroid";
import { Pool } from "./Pool";

export class EnemyPool extends Pool<AEnemy> {
  private static readonly COOLDOWN = 2;
  private cooldown = 0;

  constructor(size: number) {
    super(...Array.from({ length: size }).map(() => new Asteroid()));
  }

  public trigger(position: Readonly<Vector2>) {
    if (this.cooldown > 0)
			return;
    this.cooldown = EnemyPool.COOLDOWN;
		super.trigger(position);
  }
  public update(delta: number) {
    super.update(delta);
    this.cooldown -= this.cooldown <= 0 ? 0 : delta;
    this.trigger({ x: 0, y: 0 });
  }
}