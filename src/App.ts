import { IDrawable } from "./IDrawable";
import { Planet } from "./Planet";
import { Player } from "./Player";
import { AEnemy } from "./enemies/AEnemy";
import { EnemyPool } from "./pools/EnemyPool";
import { ProjectilePool } from "./pools/ProjectilePool";

export class App {
  private static readonly PLAYER_SHAKING_DELAY = 0.6;
  private static readonly ENEMY_SHAKING_DELAY = 0.1;
  public static readonly DIAMETER = 800;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly background = document.getElementById(
    "background"
  ) as HTMLImageElement;
  private readonly player = new Player();
  private readonly planet = new Planet();
  private readonly projectiles = new ProjectilePool(10);
  private readonly enemies = new EnemyPool(10);

  private readonly gameElements: IDrawable[] = [];
  private lastDeltaTime = 0;
  private isMouseDown = false;
  private lives = 3;
  private shakingDelay = 0;

  constructor() {
    this.canvas = document.getElementsByTagName("canvas")[0];
    this.canvas.width = App.DIAMETER;
    this.canvas.height = App.DIAMETER;
    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
    this.gameElements.push(this.planet);
    this.gameElements.push(this.projectiles);
    this.gameElements.push(this.enemies);
    this.gameElements.push(this.player);

    window.addEventListener("mousemove", (e) => {
      this.player.setAngle(e.x - this.canvas.offsetLeft, e.y);
    });
    window.addEventListener("mousedown", () => (this.isMouseDown = true));
    window.addEventListener("mouseup", () => (this.isMouseDown = false));
    this.render(0);
  }

  public handleEnemy = (enemy: AEnemy) => {
    if (!enemy.isAlive) return;
    if (
      enemy.collides(
        { x: App.DIAMETER / 2, y: App.DIAMETER / 2 },
        Planet.DIAMETER / 2
      ) ||
      enemy.collides(this.player.position, Player.SIZE / 2)
    ) {
      enemy.kill();
      this.lives--;
      this.shakingDelay = App.PLAYER_SHAKING_DELAY;
      this.player.blink();
      return;
    }
    this.projectiles.forEach((projectile) => {
      if (!projectile.isAlive) return;
      if (!projectile.isInside) projectile.kill();
      if (!enemy.isAlive || !enemy.collides(projectile.position)) {
        return;
      }
      enemy.hit();
      projectile.kill();
      this.shakingDelay = App.ENEMY_SHAKING_DELAY;
    });
  };

  public update(delta: number) {
    if (this.isMouseDown) this.projectiles.trigger(this.player.position);
    this.gameElements.forEach((elem) => elem.update(delta));
    this.enemies.forEach(this.handleEnemy);
    this.shakingDelay -= delta;
  }
  public render = (elapsedTime: number) => {
    this.ctx.clearRect(0, 0, App.DIAMETER, App.DIAMETER);
    this.update((elapsedTime - this.lastDeltaTime) / 1000);
    if (this.shakingDelay >= 0) {
      this.ctx.save();
      this.ctx.translate(Math.random() * 4, Math.random() * 4);
    }
    this.ctx.drawImage(this.background, 0, 0, App.DIAMETER, App.DIAMETER);
    this.gameElements.forEach((elem) => elem.draw(this.ctx));
    this.ctx.restore();
    this.lastDeltaTime = elapsedTime;
    requestAnimationFrame(this.render);
  };
}
