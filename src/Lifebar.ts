import { Vector2 } from "./Vector2";

export class Lifebar {
  private static readonly SIZE_X = 60;
  private static readonly SIZE_Y = 5;
  private lives: number;

  constructor(private readonly defaultLives: number) {
    this.lives = defaultLives;
  }

  public regenerate() {
    this.lives = this.defaultLives;
  }
  public hit() {
    this.lives = Math.max(0, this.lives - 1);
  }
  public kill() {
    this.lives = 0;
  }
  public draw(
    ctx: CanvasRenderingContext2D,
    position: Vector2,
    size: number
  ): void {
    if (this.lives === 0 || this.lives === this.defaultLives) return;

    const realPosition = {
      x: position.x - Lifebar.SIZE_X / 2,
      y: position.y - size * 0.75,
    };

    ctx.fillStyle = "darkred";
    ctx.fillRect(
      realPosition.x,
      realPosition.y,
      Lifebar.SIZE_X,
      Lifebar.SIZE_Y
    );
    ctx.fillStyle = "lime";
    ctx.fillRect(
      realPosition.x,
      realPosition.y,
      Lifebar.SIZE_X * (this.lives / this.defaultLives),
      Lifebar.SIZE_Y
    );
  }
  public get isAlive() {
    return this.lives > 0;
  }
}
