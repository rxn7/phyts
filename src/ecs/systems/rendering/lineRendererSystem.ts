import { Renderer } from "../../../renderer.js"
import { ComponentContainer } from "../../componentContainer.js"
import { Color } from "../../components/color.js"
import { LineRenderer } from "../../components/lineRenderer.js"
import { Position } from "../../components/position.js"
import { Entity } from "../../entity.js"
import { System } from "../../system.js"

export class LineRendererSystem extends System {
	public requiredComponents: Set<Function> = new Set([Position, LineRenderer, Color])

	public constructor(public renderer: Renderer) {
		super()
	}

	public override update(entities: Set<Entity>, dt: number): void {
		for(const entity of entities) {
			const container: ComponentContainer = this.world?.getEntityComponents(entity) as ComponentContainer
			const position: Position = container.get(Position)
			const lineRenderer: LineRenderer = container.get(LineRenderer)
			const color: Color = container.get(Color)

			for(const line of lineRenderer.lines) {
				this.renderer.ctx.beginPath()
				this.renderer.ctx.strokeStyle = color.toString()
				this.renderer.ctx.moveTo(position.position.x, position.position.y)
				this.renderer.ctx.lineTo(line.end.x, line.end.y)
				this.renderer.ctx.stroke()
			}
		}
	}
}
