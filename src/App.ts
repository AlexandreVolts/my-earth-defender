import { IDrawable } from "./IDrawable";

export class App {
	public static readonly WIDTH = 720;
	public static readonly HEIGHT = 720;
	private readonly canvas: HTMLCanvasElement;
	private readonly ctx: CanvasRenderingContext2D;

	private readonly gameElements: IDrawable[] = [];
	private lastDeltaTime = 0;

	constructor() {
		this.canvas = document.getElementsByTagName("canvas")[0];
		this.canvas.width = App.WIDTH;
		this.canvas.height = App.HEIGHT;
		this.ctx = this.canvas.getContext("2d")!;
		this.ctx.imageSmoothingEnabled = false;
		this.render(0);
	}

	public update(delta: number) {
		
	}
	public render = (elapsedTime: number) => {
		this.ctx.clearRect(0, 0, App.WIDTH, App.HEIGHT);
		this.update((elapsedTime - this.lastDeltaTime) / 1000);
		if (false) {
			this.ctx.save();
			this.ctx.translate(Math.random() * 4, Math.random() * 4);
		}
		this.gameElements.forEach((elem) => elem.draw(this.ctx));
		this.ctx.restore();
		this.lastDeltaTime = elapsedTime;
		requestAnimationFrame(this.render);
	};
}

document.addEventListener("DOMContentLoaded", () => new App());
