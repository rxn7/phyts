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
	private collisions: Array<Collision> = [];

	public override update(entities: Set<Entity>, dt: number): void {
		this.collisions.length = 0

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

				const dx: number = a.position.x - b.position.x
				const dy: number = a.position.y - b.position.y
				const distanceSqr: number = dx * dx + dy * dy

				if(!CircleCollisionSystem.circlesOverlap(a.circle, b.circle, distanceSqr)) {
					continue
				}

				const distance = Math.sqrt(distanceSqr)
				const overlap: number = (distance - a.circle.radius - b.circle.radius) * 0.5

				a.position.x -= overlap * dx / distance;
				a.position.y -= overlap * dy / distance;

				b.position.x += overlap * dx / distance;
				b.position.y += overlap * dy / distance;

				this.collisions.push({a, b})
			}
		}

		// dynamic resolution
		for(const {a, b} of this.collisions) {
			const distance: number = Math.sqrt((a.position.x - b.position.x) * (a.position.x - b.position.x) + (a.position.y - b.position.y) * (a.position.y - b.position.y))

			// normal
			const nx: number = (b.position.x - a.position.x) / distance
			const ny: number = (b.position.y - a.position.y) / distance
			const dotNormalA: number = a.velocity.vx * nx + a.velocity.vy * ny
			const dotNormalB: number = b.velocity.vx * nx + b.velocity.vy * ny

			console.log(nx, ny)

			// tangent
			const tx: number = -ny
			const ty: number = nx
			const dotTangentA: number = a.velocity.vx * tx + a.velocity.vy * ty
			const dotTangentB: number = b.velocity.vx * tx + b.velocity.vy * ty

			const massSum: number = a.circle.radius + b.circle.radius
			const momentumA: number = (dotNormalA * (a.circle.radius - b.circle.radius) + 2.0 * b.circle.radius * dotNormalB) / massSum
			const momentumB: number = (dotNormalB * (b.circle.radius - a.circle.radius) + 2.0 * a.circle.radius * dotNormalA) / massSum

			a.velocity.vx = dotTangentA * tx + nx * momentumA
			a.velocity.vy = dotTangentA * ty + ny * momentumA
			b.velocity.vx = dotTangentB * tx + nx * momentumB
			b.velocity.vy = dotTangentB * ty + ny * momentumB
		}
	}

	private static circlesOverlap(a: Circle, b: Circle, distanceSqr: number): boolean {
		const sum: number = a.radius + b.radius
		return distanceSqr < sum * sum
	}
}
