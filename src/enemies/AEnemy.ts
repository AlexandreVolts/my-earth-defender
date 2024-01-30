import { App } from "../App";
import { Vector2 } from "../Vector2";
import { IPooledObject } from "../pools/IPooledObject";
import { rand } from "../rand";

export abstract class AEnemy implements IPooledObject {
  private static readonly MIN_SIZE = 35;
  private static readonly MAX_SIZE = 70;
  private static readonly ATTRACTION = 20;
  private static readonly LIVES = 6;
  private static readonly HIT_DELAY = 0.3;
  private static readonly SCALE_RATIO = 0.1;
  private static readonly ANIMATION_SPEED = 0.1;
  private static readonly EXPLOSITION_INFLATION_RATIO = 0.3;
  private skin = 0;
  private size = 0;
  private distance = 0;
  private angle = 0;
  private lives = 0;
  private hitDelay = 0;
  private frame = 0;
  private _isAlive = false;

  constructor(
    private readonly sprite: HTMLImageElement,
    private readonly frames: number,
    private readonly skins: number,
    private readonly explosionFrames: number
  ) {}

  public trigger() {
    this._isAlive = true;
    this.angle = Math.random() * (Math.PI * 2);
    this.size = rand(AEnemy.MIN_SIZE, AEnemy.MAX_SIZE);
    this.distance = (App.DIAMETER + this.size) / 2;
    this.skin = ~~rand(0, this.skins);
    this.lives = AEnemy.LIVES;
    this.frame = 0;
  }
  public update(delta: number): void {
    this.angle += delta;
    this.distance -= delta * AEnemy.ATTRACTION;
    this.hitDelay -= delta;
    if (this.lives <= 0) this.frame += delta;
    if (this.frame >= this.explosionFrames) {
      this._isAlive = false;
    }
  }
  public collides(point: Vector2, distance = 0) {
    const dist = Math.hypot(
      point.x - this.position.x,
      point.y - this.position.y
    );

    if (this.lives <= 0) return false;
    return dist <= this.size / 2 + distance;
  }
  public hit() {
    this.lives--;
    this.hitDelay = AEnemy.HIT_DELAY;
  }
  public kill() {
    this.lives = 0;
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    const framePosition =
      this.lives > 0
        ? 0
        : ~~(this.frame / AEnemy.ANIMATION_SPEED) + this.frames;
    const frameSize = Math.floor(
      this.sprite.width / (this.frames + this.explosionFrames)
    );
    const scale = {
      x: 1 + framePosition * AEnemy.EXPLOSITION_INFLATION_RATIO,
      y: 1 + framePosition * AEnemy.EXPLOSITION_INFLATION_RATIO,
    };

    if (this.hitDelay > 0) {
      scale.x += Math.random() * AEnemy.SCALE_RATIO;
      scale.y += Math.random() * AEnemy.SCALE_RATIO;
    }
    ctx.drawImage(
      this.sprite,
      framePosition * frameSize,
      this.skin * Math.floor(this.sprite.height / this.skins),
      this.sprite.width / (this.frames + this.explosionFrames),
      this.sprite.height / this.skins,
      this.position.x - (this.size * scale.x) / 2,
      this.position.y - (this.size * scale.y) / 2,
      this.size * scale.x,
      this.size * scale.y
    );
  }

  private get position(): Vector2 {
    return {
      x: App.DIAMETER / 2 + Math.cos(this.angle) * this.distance,
      y: App.DIAMETER / 2 + Math.sin(this.angle) * this.distance,
    };
  }
  public get isAlive(): boolean {
    return this._isAlive;
  }
}
