import { Projectile } from "../Projectile";
import { Vector2 } from "../Vector2";
import { Pool } from "./Pool";

export class ProjectilePool extends Pool<Projectile> {
  private static readonly COOLDOWN = 0.15;
  private cooldown = 0;

  constructor(size: number) {
    super(...Array.from({ length: size }).map(() => new Projectile()));
  }
  
  public reset() {
    this.forEach((item) => item.kill());
  }
  public trigger(position: Readonly<Vector2>) {
    if (this.cooldown > 0)
			return;
    this.cooldown = ProjectilePool.COOLDOWN;
		super.trigger(position);
  }
  public update(delta: number) {
    super.update(delta);
    this.cooldown -= this.cooldown <= 0 ? 0 : delta;
  }
}