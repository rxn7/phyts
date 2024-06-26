import { Vec2 } from "../../vec2.js"
import { Component } from "../component.js"

export type Line = {
	end: Vec2
}

export class LineRenderer extends Component {
	public lines: Set<Line> = new Set()

	public addLine(line: Line): void {
		this.lines.add(line)
	}

	public removeLine(line: Line): void {
		this.lines.delete(line)
	}
}
