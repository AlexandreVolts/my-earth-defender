import { IPooledObject } from "./pools/IPooledObject";
import { Vector2 } from "./Vector2";

export class Projectile implements IPooledObject {
  private free = true;

  public trigger(position: Readonly<Vector2>) {
    this.free = false;
  }
  public kill() {
    this.free = true;
  }
  public update(delta: number): void {
    throw new Error("Method not implemented.");
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }

  public get isAlive() {
    return (!this.free);
  }
}