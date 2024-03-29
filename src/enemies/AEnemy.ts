import { App } from "../App";
import { Lifebar } from "../Lifebar";
import { Vector2 } from "../Vector2";
import { IPooledObject } from "../pools/IPooledObject";
import { rand } from "../rand";

export abstract class AEnemy implements IPooledObject {
  private static readonly MIN_SIZE = 35;
  private static readonly MAX_SIZE = 70;
  private static readonly ATTRACTION = 20;
  private static readonly HIT_DELAY = 0.3;
  private static readonly SCALE_RATIO = 0.1;
  private static readonly ANIMATION_SPEED = 0.1;
  private static readonly EXPLOSITION_INFLATION_RATIO = 0.3;
  private readonly SPEED = rand(0.5, 1.5);
  private lifebar: Lifebar;
  private skin = 0;
  private size = 0;
  private distance = 0;
  private angle = 0;
  private hitDelay = 0;
  private _isAlive = false;
  protected frame = 0;

  constructor(
    private readonly sprite: HTMLImageElement,
    private readonly frames: number,
    private readonly skins: number,
    private readonly explosionFrames: number,
    nbLives: number
  ) {
    this.lifebar = new Lifebar(nbLives);
  }

  public trigger() {
    this._isAlive = true;
    this.angle = Math.random() * (Math.PI * 2);
    this.size = rand(AEnemy.MIN_SIZE, AEnemy.MAX_SIZE);
    this.distance = (App.DIAMETER + this.size) / 2;
    this.skin = ~~rand(0, this.skins);
    this.lifebar.regenerate();
    this.frame = 0;
  }
  public update(delta: number): void {
    this.angle += delta * this.SPEED;
    this.distance -= delta * AEnemy.ATTRACTION;
    this.hitDelay -= delta;
    if (this.lifebar.isAlive) return;
    this.frame += delta;
    if (this.frame >= this.explosionFrames) {
      this._isAlive = false;
    }
  }
  public collides(point: Vector2, distance = 0) {
    const dist = Math.hypot(
      point.x - this.position.x,
      point.y - this.position.y
    );

    if (!this.lifebar.isAlive) return false;
    return dist <= this.size / 2 + distance;
  }
  public hit() {
    this.lifebar.hit();
    this.hitDelay = AEnemy.HIT_DELAY;
    if (!this.lifebar.isAlive) {
      this.frame = 0;
    }
  }
  public kill() {
    this.lifebar.kill();
    this.frame = 0;
  }
  public draw(ctx: CanvasRenderingContext2D): void {
    const framePosition =
      this.lifebar.isAlive
        ? this.frame
        : ~~(this.frame / AEnemy.ANIMATION_SPEED) + this.frames;
    const frameSize = Math.floor(
      this.sprite.width / (this.frames + this.explosionFrames)
    );
    const scale = { x: 1, y: 1 };

    if (!this.lifebar.isAlive) {
      scale.x *= framePosition * AEnemy.EXPLOSITION_INFLATION_RATIO;
      scale.y *= framePosition * AEnemy.EXPLOSITION_INFLATION_RATIO;
    }
    if (this.hitDelay > 0) {
      scale.x += Math.random() * AEnemy.SCALE_RATIO;
      scale.y += Math.random() * AEnemy.SCALE_RATIO;
    }
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.sprite,
      framePosition * frameSize,
      this.skin * Math.floor(this.sprite.height / this.skins),
      this.sprite.width / (this.frames + this.explosionFrames),
      this.sprite.height / this.skins,
      -(this.size * scale.x) / 2,
      -(this.size * scale.y) / 2,
      this.size * scale.x,
      this.size * scale.y
    );
    ctx.restore();
    this.lifebar.draw(ctx, this.position, this.size);
  }

  private get position(): Vector2 {
    return {
      x: App.DIAMETER / 2 + Math.cos(this.angle) * this.distance,
      y: App.DIAMETER / 2 + Math.sin(this.angle) * this.distance,
    };
  }
  public get hasLives(): boolean {
    return this.lifebar.isAlive;
  }
  public get isAlive(): boolean {
    return this._isAlive;
  }
}
