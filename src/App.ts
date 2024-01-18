import { IDrawable } from "./IDrawable";
import { Planet } from "./Planet";
import { Player } from "./Player";

export class App {
	public static readonly DIAMETER = 800;
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;
	private readonly background = document.getElementById("background") as HTMLImageElement;
	private readonly player = new Player();

	private readonly gameElements: IDrawable[] = [new Planet()];
	private lastDeltaTime = 0;

	constructor() {
		this.canvas = document.getElementsByTagName("canvas")[0];
		this.canvas.width = App.DIAMETER;
		this.canvas.height = App.DIAMETER;
		this.ctx = this.canvas.getContext("2d")!;
		this.ctx.imageSmoothingEnabled = false;
		this.gameElements.push(this.player);
		window.addEventListener("mousemove", (e) => {
			this.player.setAngle(e.x - this.canvas.offsetLeft, e.y);
		});
		this.render(0);
	}

	public update(delta: number) {
		
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
