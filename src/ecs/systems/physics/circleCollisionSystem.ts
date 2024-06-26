import { Vec2 } from "../../../vec2.js"
import { ComponentContainer } from "../../componentContainer.js"
import { Circle } from "../../components/circle.js"
import { Position } from "../../components/position.js"
import { Velocity } from "../../components/velocity.js"
import { Entity } from "../../entity.js"
import { System } from "../../system.js"

type Ball = {
	circle: Circle
	position: Position
	velocity: Velocity
}

type Collision = {
	a: Ball
	b: Ball
}

export class CircleCollisionSystem extends System {
	public requiredComponents: Set<Function> = new Set([Position, Velocity, Circle])
	private collisions: Set<Collision> = new Set()

	public override physicsUpdate(entities: Set<Entity>, dt: number): void {
		this.collisions.clear()

		// static resolution
		for(const entityA of entities) {
			for(const entityB of entities) {
				if(entityA == entityB) continue

				const containerA: ComponentContainer = this.world?.getEntityComponents(entityA) as ComponentContainer
				const a: Ball = {
					circle: containerA.get(Circle),
					position: containerA.get(Position),
					velocity: containerA.get(Velocity)
				}

				const containerB: ComponentContainer = this.world?.getEntityComponents(entityB) as ComponentContainer
				const b: Ball = {
					circle: containerB.get(Circle),
					position: containerB.get(Position),
					velocity: containerB.get(Velocity)
				}

				const diff: Vec2 = Vec2.sub(a.position.position, b.position.position)
				const distanceSqr: number = Vec2.lengthSqr(diff)

				if(!CircleCollisionSystem.circlesOverlap(a.circle, b.circle, distanceSqr)) {
					continue
				}

				const distance = Math.sqrt(distanceSqr)
				const overlap: number = (distance - a.circle.radius - b.circle.radius) * 0.5

				const normal: Vec2 = Vec2.div(Vec2.mul(diff, overlap), distance)

				a.position.position = Vec2.sub(a.position.position, normal)
				b.position.position = Vec2.add(b.position.position, normal)

				this.collisions.add({a, b})
			}
		}

		// dynamic resolution
		for(const {a, b} of this.collisions) {
			const distance: number = Vec2.length(Vec2.sub(a.position.position, b.position.position))

			const normal: Vec2 = Vec2.div(Vec2.sub(a.position.position, b.position.position), distance)
			const dotNormalA: number = a.velocity.velocity.x * normal.x + a.velocity.velocity.y * normal.y
			const dotNormalB: number = b.velocity.velocity.x * normal.x + b.velocity.velocity.y * normal.y

			const tangent: Vec2 = {x: -normal.y, y: normal.x}
			const dotTangentA: number = a.velocity.velocity.x * tangent.x + a.velocity.velocity.y * tangent.y
			const dotTangentB: number = b.velocity.velocity.x * tangent.x + b.velocity.velocity.y * tangent.y

			const massSum: number = a.circle.radius + b.circle.radius
			const momentumA: number = (dotNormalA * (a.circle.radius - b.circle.radius) + 2.0 * b.circle.radius * dotNormalB) / massSum
			const momentumB: number = (dotNormalB * (b.circle.radius - a.circle.radius) + 2.0 * a.circle.radius * dotNormalA) / massSum

			a.velocity.velocity = Vec2.add(Vec2.mul(tangent, dotTangentA), Vec2.mul(normal, momentumA))
			b.velocity.velocity = Vec2.add(Vec2.mul(tangent, dotTangentB), Vec2.mul(normal, momentumB))
		}
	}

	private static circlesOverlap(a: Circle, b: Circle, distanceSqr: number): boolean {
		const sum: number = a.radius + b.radius
		return distanceSqr < sum * sum
	}
}
