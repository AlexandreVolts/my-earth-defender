import { App } from "./App";
import { IPooledObject } from "./pools/IPooledObject";
import { Vector2 } from "./Vector2";

export class Projectile implements IPooledObject {
  private static readonly SPEED = 350;
  private _position: Vector2 = { x: 0, y: 0 };
  private velocity: Vector2 = { x: 0, y: 0 };
  private free = true;

  public trigger(position: Readonly<Vector2>) {
    const angle = Math.atan2(position.y - App.DIAMETER / 2, position.x - App.DIAMETER / 2);

    this._position = position;
    this.velocity.x = Math.cos(angle) * Projectile.SPEED;
    this.velocity.y = Math.sin(angle) * Projectile.SPEED;
    this.free = false;
  }
  public kill() {
    this.free = true;
  }
  public update(delta: number): void {
    this._position.x += this.velocity.x * delta;
    this._position.y += this.velocity.y * delta;
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this._position.x, this._position.y, 3, 0, Math.PI * 2);
    ctx.fill();   
  }

  public get isInside() {
    const dist = Math.hypot(
      this._position.x - App.DIAMETER / 2,
      this._position.y - App.DIAMETER / 2
    );

    return dist < App.DIAMETER / 2;
  }
  public get position() {
    return this._position;
  }
  public get isAlive() {
    return (!this.free);
  }
}