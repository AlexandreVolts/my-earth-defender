import { App } from "./App";
import { IDrawable } from "./IDrawable";
import { Planet } from "./Planet";

export class Player implements IDrawable {
  private static readonly SIZE = 50;
  private static readonly RADIUS = 80;
  private static readonly sprite = document.getElementById(
    "player"
  ) as HTMLImageElement;
  private angle = 0;

  constructor() {}

  public update(delta: number): void {
    throw new Error("Method not implemented.");
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    const pos = {
      x:
        (App.DIAMETER) / 2 + Math.cos(this.angle) * Player.RADIUS,
      y:
        (App.DIAMETER) / 2 + Math.sin(this.angle) * Player.RADIUS,
    };

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(this.angle + Math.PI);
    ctx.drawImage(Player.sprite, -Player.SIZE / 2, -Player.SIZE / 2, Player.SIZE, Player.SIZE);
    ctx.restore();
  }
  public setAngle(x: number, y: number) {
    this.angle = Math.atan2(y - App.DIAMETER / 2, x - App.DIAMETER / 2);
  }
}
