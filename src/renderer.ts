export class Renderer {
	public readonly ctx: CanvasRenderingContext2D

	public constructor(public readonly canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

		this.canvas.width = 800
		this.canvas.height = 800

		// TODO: Letterboxing
	}

	public clear(): void {
		this.ctx.fillStyle = 'black'
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}
}
