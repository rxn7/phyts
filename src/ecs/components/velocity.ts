import { Component } from "../component.js"

export class Velocity extends Component {
	public ax: number = 0
	public ay: number = 0

	public constructor(public vx: number = 0, public vy: number = 0) {
		super()
	}

	public flipX(): void {
		this.vx *= -1
		this.ax *= -1
	}

	public flipY(): void {
		this.vy *= -1
		this.ay *= -1
	}
}
