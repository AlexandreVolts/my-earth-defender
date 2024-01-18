import { App } from "./App";
import { IDrawable } from "./IDrawable";

export class Planet implements IDrawable {
  private static readonly DIAMETER = 100;
  private static readonly sprite = document.getElementById(
    "planet"
  ) as HTMLImageElement;

  public update(delta: number): void {
    throw new Error("Method not implemented.");
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      Planet.sprite,
      (App.DIAMETER - Planet.DIAMETER) / 2,
      (App.DIAMETER - Planet.DIAMETER) / 2,
      Planet.DIAMETER,
      Planet.DIAMETER
    );
  }
}
