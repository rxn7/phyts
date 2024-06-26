import { Vec2 } from "../../vec2.js"
import { Component } from "../component.js"

export type Line = {
	end: Vec2
}

export class LineRenderer extends Component {
	public readonly lines: Set<Line> = new Set()

	public addLine(line: Line): void {
		this.lines.add(line)
	}

	public removeLine(line: Line): void {
		this.lines.delete(line)
	}

	public clear(): void {
		this.lines.clear()
	}
}
