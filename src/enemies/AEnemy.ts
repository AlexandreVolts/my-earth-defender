import { App } from "../App";
import { Vector2 } from "../Vector2";
import { IPooledObject } from "../pools/IPooledObject";
import { rand } from "../rand";

export abstract class AEnemy implements IPooledObject {
  private static readonly MIN_SIZE = 35;
  private static readonly MAX_SIZE = 70;
  private skin = 0;
  private size = 0;
  private distance = 0;
  private angle = 0;
  private lives = 0;

  constructor(
    private readonly sprite: HTMLImageElement,
    private readonly frames: number,
    private readonly skins: number,
    private readonly explosionFrames: number
  ) {}

  public trigger() {
    this.angle = Math.random() * (Math.PI * 2);
    this.size = rand(AEnemy.MIN_SIZE, AEnemy.MAX_SIZE);
    this.distance = (App.DIAMETER + this.size) / 2;
    this.skin = ~~rand(0, this.skins);
    this.lives = 5;
  }
  public update(delta: number): void {
    this.angle += delta;
    this.distance -= delta * 10;
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.sprite,
      0,
      this.skin * Math.floor(this.sprite.height / this.skins),
      this.sprite.width / (this.frames + this.explosionFrames),
      this.sprite.height / this.skins,
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size,
    );
  }

  private get position(): Vector2 {
    return {
      x: App.DIAMETER / 2 + Math.cos(this.angle) * this.distance,
      y: App.DIAMETER / 2 + Math.sin(this.angle) * this.distance,
    };
  }
  public get isAlive(): boolean {
    return this.lives > 0;
  }
}
