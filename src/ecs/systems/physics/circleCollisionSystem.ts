import { ComponentContainer } from "../../componentContainer.js"
import { Circle } from "../../components/circle.js"
import { Position } from "../../components/position.js"
import { Velocity } from "../../components/velocity.js"
import { Entity } from "../../entity.js"
import { System } from "../../system.js"

export class CircleCollisionSystem extends System {
	public requiredComponents: Set<Function> = new Set([Position, Velocity, Circle])

	public update(entities: Set<Entity>, dt: number): void {
		for(const entityA of entities) {
			for(const entityB of entities) {
				if(entityA == entityB) continue

				const containerA: ComponentContainer = this.world?.getEntityComponents(entityA) as ComponentContainer
				const positionA: Position = containerA.get(Position)
				const velocityA: Velocity = containerA.get(Velocity)
				const circleA: Circle = containerA.get(Circle)

				const containerB: ComponentContainer = this.world?.getEntityComponents(entityB) as ComponentContainer
				const positionB: Position = containerB.get(Position)
				const velocityB: Velocity = containerB.get(Velocity)
				const circleB: Circle = containerB.get(Circle)

				const dx: number = positionA.x - positionB.x
				const dy: number = positionA.y - positionB.y
				const distanceSqr: number = dx * dx + dy * dy

				if(!CircleCollisionSystem.circlesOverlap(circleA, circleB, distanceSqr)) {
					continue
				}

				const distance = Math.sqrt(distanceSqr)
				const overlap: number = (distance - circleA.radius - circleB.radius) * 0.5

				positionA.x -= overlap * dx / distance;
				positionA.y -= overlap * dy / distance;

				positionB.x += overlap * dx / distance;
				positionB.y += overlap * dy / distance;
			}
		}
	}

	private static circlesOverlap(a: Circle, b: Circle, distanceSqr: number): boolean {
		const sum: number = a.radius + b.radius
		return distanceSqr < sum * sum
	}
}
