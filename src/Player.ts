import { ABlinkSprite } from "./ABlinkSprite";
import { App } from "./App";
import { IDrawable } from "./IDrawable";
import { Vector2 } from "./Vector2";

export class Player extends ABlinkSprite implements IDrawable {
  private static readonly DISTANCE = 50;
  private static readonly sprite = document.getElementById(
    "player"
  ) as HTMLImageElement;
  public static readonly SIZE = 35;
  private angle = 0;
  public origin: Vector2 = { x: 0, y: 0 };

  public update(delta: number): void {
    super.update(delta);
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.isBlinking) return;
    ctx.save();
    ctx.translate(this.position.x + this.origin.x, this.position.y + this.origin.y);
    ctx.rotate(this.angle + Math.PI);
    ctx.drawImage(Player.sprite, -Player.SIZE / 2, -Player.SIZE / 2, Player.SIZE, Player.SIZE);
    ctx.restore();
  }
  public get position(): Vector2 {
    return ({
      x: (App.DIAMETER) / 2 + Math.cos(this.angle) * Player.DISTANCE,
      y: (App.DIAMETER) / 2 + Math.sin(this.angle) * Player.DISTANCE,
    });
  }
  public setAngle(x: number, y: number) {
    this.angle = Math.atan2(y - App.DIAMETER / 2, x - App.DIAMETER / 2);
  }
}
