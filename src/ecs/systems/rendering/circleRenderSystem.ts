import { Renderer } from "../../../renderer.js"
import { ComponentContainer } from "../../componentContainer.js"
import { Circle } from "../../components/circle.js"
import { Color } from "../../components/color.js"
import { Position } from "../../components/position.js"
import { Entity } from "../../entity.js"
import { System } from "../../system.js"

export class CircleRenderSystem extends System {
	public requiredComponents: Set<Function> = new Set([Position, Circle, Color])

	public constructor(public renderer: Renderer) {
		super()
	}

	public update(entities: Set<Entity>, dt: number): void {
		for(const entity of entities) {
			const container: ComponentContainer = this.world?.getEntityComponents(entity) as ComponentContainer
			const position: Position = container.get(Position)
			const circle: Circle = container.get(Circle)
			const color: Color = container.get(Color)

			this.renderer.ctx.beginPath()
			this.renderer.ctx.arc(position.x, position.y, circle.radius, 0, 2 * Math.PI)
			this.renderer.ctx.fillStyle = color.toString()
			this.renderer.ctx.fill()
		}
	}
}
