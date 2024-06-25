import { Component } from "../component.js"

export class Position extends Component {
	public constructor(public x: number = 0, public y: number = 0) {
		super()
	}
}
