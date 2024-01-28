import { IDrawable } from "./IDrawable";
import { Planet } from "./Planet";
import { Player } from "./Player";
import { EnemyPool } from "./pools/EnemyPool";
import { ProjectilePool } from "./pools/ProjectilePool";

export class App {
	public static readonly DIAMETER = 800;
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly background = document.getElementById("background") as HTMLImageElement;
	private readonly player = new Player();
	private readonly planet = new Planet();
	private readonly projectiles = new ProjectilePool(10);
	private readonly enemies = new EnemyPool(10);

	private readonly gameElements: IDrawable[] = [];
	private lastDeltaTime = 0;
	private isMouseDown = false;

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
		this.enemies.trigger();
		this.enemies.trigger();

		this.enemies.trigger();

		this.enemies.trigger();

		window.addEventListener("mousemove", (e) => {
			this.player.setAngle(e.x - this.canvas.offsetLeft, e.y);
		});
		window.addEventListener("mousedown", () => this.isMouseDown = true);
		window.addEventListener("mouseup", () => this.isMouseDown = false);
		this.render(0);
	}

	public update(delta: number) {
		if (this.isMouseDown) this.projectiles.trigger(this.player.position);
		this.gameElements.forEach((elem) => elem.update(delta));
		this.projectiles.forEach((projectile) => {
			if (!projectile.isInside) projectile.kill();
		});
	}
	public render = (elapsedTime: number) => {
		this.ctx.clearRect(0, 0, App.DIAMETER, App.DIAMETER);
		this.update((elapsedTime - this.lastDeltaTime) / 1000);
		if (false) {
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
