import { Component } from "../component.js"

export class Color extends Component {
	public constructor(public r: number = 255, public g: number = 0, public b: number = 0) {
		super()
	}

	public override toString(): string {
		return `rgb(${this.r}, ${this.g}, ${this.b})`
	}
}
