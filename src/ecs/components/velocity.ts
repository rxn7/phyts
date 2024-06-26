import { Vec2 } from "../../vec2.js"
import { Component } from "../component.js"

export class Velocity extends Component {
	public constructor(public velocity: Vec2 = Vec2.zero, public acceleration: Vec2 = Vec2.zero) {
		super()
	}

	public flipX(): void {
		this.velocity.x *= -1
		this.acceleration.x *= -1
	}

	public flipY(): void {
		this.velocity.y *= -1
		this.acceleration.y *= -1
	}
}
