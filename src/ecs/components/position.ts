import { Vec2 } from "../../vec2.js"
import { Component } from "../component.js"

export class Position extends Component {
	public constructor(public position: Vec2 = Vec2.zero) {
		super()
	}
}
