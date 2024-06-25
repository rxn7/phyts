import { ComponentContainer } from "../../componentContainer.js"
import { Circle } from "../../components/circle.js"
import { Position } from "../../components/position.js"
import { Velocity } from "../../components/velocity.js"
import { Entity } from "../../entity.js"
import { System } from "../../system.js"

export class CircleBoundarySystem extends System {
	public requiredComponents: Set<Function> = new Set([Position, Velocity, Circle])

	public constructor(public width: number, public height: number) {
		super()
	}

	public update(entities: Set<Entity>, dt: number): void {
		for(const entity of entities) {
			const container: ComponentContainer = this.world?.getEntityComponents(entity) as ComponentContainer
			const position: Position = container.get(Position)
			const velocity: Velocity = container.get(Velocity)
			const circle: Circle = container.get(Circle)

			if(position.x - circle.radius < 0) {
				position.x = circle.radius
				velocity.flipX()
			} else if(position.x + circle.radius > this.width) {
				position.x = this.width - circle.radius
				velocity.flipX()
			}

			if(position.y - circle.radius < 0) {
				position.y = circle.radius
				velocity.flipY()
			} else if(position.y + circle.radius > this.height) {
				position.y = this.height - circle.radius
				velocity.flipY()
			}
		}
	}
}
