import { ComponentContainer } from "../../componentContainer"
import { Position } from "../../components/position.js"
import { Velocity } from "../../components/velocity.js"
import { Entity } from "../../entity.js"
import { System } from "../../system.js"

export class VelocitySystem extends System {
	public requiredComponents: Set<Function> = new Set([Position, Velocity])

	public constructor(public gravity: number = 9.8, public dragCoeff: number = 0.8) {
		super()
	}

	public override update(entities: Set<Entity>, dt: number): void {
		for(const entity of entities) {
			const container: ComponentContainer = this.world?.getEntityComponents(entity) as ComponentContainer
			const position: Position = container.get(Position)
			const velocity: Velocity = container.get(Velocity)

			velocity.ax = -velocity.vx * this.dragCoeff
			velocity.ay = -velocity.vy * this.dragCoeff

			velocity.vx += velocity.ax * dt
			velocity.vy += velocity.ay * dt
			velocity.vy += this.gravity * dt
			position.x += velocity.vx * dt
			position.y += velocity.vy * dt

			if(Math.abs(velocity.vx * velocity.vx + velocity.vy * velocity.vy) < 0.01) {
				velocity.vx = 0
				velocity.vy = 0
			}
		}
	}
}
