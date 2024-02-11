import { IDrawable } from "./IDrawable";
import { Planet } from "./Planet";
import { Player } from "./Player";
import { AEnemy } from "./enemies/AEnemy";
import { Asteroid } from "./enemies/Asteroid";
import { EnemyPool } from "./pools/EnemyPool";
import { ProjectilePool } from "./pools/ProjectilePool";

export class App {
  private static readonly SHAKING_DELAY = 0.6;
  private static readonly NB_LIVES = 3;
  public static readonly DIAMETER = 800;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly background = document.getElementById(
    "background"
  ) as HTMLImageElement;
  private readonly player = new Player();
  private readonly planet = new Planet();
  private readonly projectiles = new ProjectilePool(10);
  private readonly enemies = new EnemyPool(15, 3);

  private readonly gameElements: IDrawable[] = [];
  private lastDeltaTime = 0;
  private isMouseDown = false;
  private lives = App.NB_LIVES;
  private score = 0;
  private shakingDelay = 0;
  private bestScore = parseInt(localStorage.getItem("best") || "0");

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
    window.addEventListener("keydown", () => {
      if (this.lives < 0) this.reset();
    });
    this.render(0);
  }

  private reset() {
    this.lives = App.NB_LIVES;
    this.score = 0;
  }
  private saveScore() {
    if (this.score <= this.bestScore) return;
    this.bestScore = this.score;
    localStorage.setItem("best", this.bestScore.toString());
  }
  private handleEnemy = (enemy: AEnemy) => {
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
      if (this.lives === 0) {
        this.saveScore();
        this.enemies.forEach((e) => e.kill());
      }
      this.shakingDelay = App.SHAKING_DELAY;
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
      if (!enemy.hasLives) this.score += enemy instanceof Asteroid ? 1 : 2;
    });
  };

  public update(delta: number) {
    if (this.lives > 0) this.enemies.trigger({ x: 0, y: 0 });
    if (this.isMouseDown)
      this.projectiles.trigger(this.player.position);
    this.gameElements.forEach((elem) => elem.update(delta));
    this.enemies.forEach(this.handleEnemy);
    this.shakingDelay -= delta;
  }
  public drawUi() {
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white";
    this.ctx.font = "25px bold";
    if (this.lives > 0) {
      this.ctx.fillText(`Lives: ${this.lives}`, App.DIAMETER / 2, 25);
      this.ctx.fillText(`Score: ${this.score * 100}`, App.DIAMETER / 2, 50);
      return;
    }
    this.ctx.fillText(
      `Your score: ${this.score * 100}`,
      App.DIAMETER / 2,
      App.DIAMETER * 0.4
    );
    this.ctx.fillText(
      `Your best score: ${this.bestScore * 100}`,
      App.DIAMETER / 2,
      App.DIAMETER * 0.6
    );
    this.ctx.fillText(
      "Press any key to restart.",
      App.DIAMETER / 2,
      App.DIAMETER * 0.7
    );
    this.ctx.font = "50px bold";
    this.ctx.fillText("Game over!", App.DIAMETER / 2, App.DIAMETER * 0.3);
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
    this.drawUi();
    this.ctx.restore();
    this.lastDeltaTime = elapsedTime;
    requestAnimationFrame(this.render);
  };
}
