import { App } from "./App";
import { IDrawable } from "./IDrawable";

export class Planet implements IDrawable {
  private static readonly ROTATE_SPEED = 0.1;
  private static readonly DIAMETER = 50;
  private static readonly sprite = document.getElementById(
    "planet"
  ) as HTMLImageElement;
  private angle = 0;

  public update(delta: number): void {
    this.angle += delta * Planet.ROTATE_SPEED;
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(App.DIAMETER / 2, App.DIAMETER / 2);
    ctx.rotate(this.angle);
    ctx.drawImage(
      Planet.sprite,
      -Planet.DIAMETER / 2,
      -Planet.DIAMETER / 2,
      Planet.DIAMETER,
      Planet.DIAMETER,
    );
    ctx.restore();
  }
}
