export type RendererResizeEvent = {
	width: number
	height: number
}

declare global {
	interface GlobalEventHandlersEventMap {
		rendererResize: CustomEvent<RendererResizeEvent>
	}
}

export class Renderer {
	public readonly ctx: CanvasRenderingContext2D

	public constructor(public readonly canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

		window.addEventListener('resize', () => {
			this.handleResize()
		})

		this.handleResize()
	}

	public clear(): void {
		this.ctx.fillStyle = 'black'
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	private handleResize(): void {
		const size: number = Math.min(window.innerWidth, window.innerHeight)

		this.canvas.style.height = this.canvas.style.width = size + 'px'
		this.canvas.width = size
		this.canvas.height = size

		dispatchEvent(new CustomEvent<RendererResizeEvent>('rendererResize', { detail: { width: this.canvas.width, height: this.canvas.height } }))
	}
}
