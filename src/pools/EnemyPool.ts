import { Vector2 } from "../Vector2";
import { AEnemy } from "../enemies/AEnemy";
import { Asteroid } from "../enemies/Asteroid";
import { Lobstermorph } from "../enemies/Lobstermorph";
import { Pool } from "./Pool";

export class EnemyPool extends Pool<AEnemy> {
  private static readonly COOLDOWN_DECREASE_SPEED = 0.01;
  private cooldownLimit = 2;
  private cooldown = 0;

  constructor(size: number, nbLobstermorphes: number) {
    super(...Array.from({ length: size - nbLobstermorphes }).map(() => new Asteroid()));
    for (let i = 0; i < nbLobstermorphes; i++) this.push(new Lobstermorph());
  }

  public trigger(position: Readonly<Vector2>) {
    if (this.cooldown > 0)
			return;
    this.cooldown = this.cooldownLimit;
    this.cooldownLimit -= EnemyPool.COOLDOWN_DECREASE_SPEED;
		super.trigger(position);
  }
  public update(delta: number) {
    super.update(delta);
    this.cooldown -= this.cooldown <= 0 ? 0 : delta;
  }
}