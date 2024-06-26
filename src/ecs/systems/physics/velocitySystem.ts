import { Vec2 } from "../../../vec2.js"
import { ComponentContainer } from "../../componentContainer.js"
import { Position } from "../../components/position.js"
import { Velocity } from "../../components/velocity.js"
import { Entity } from "../../entity.js"
import { System } from "../../system.js"

export class VelocitySystem extends System {
	public requiredComponents: Set<Function> = new Set([Position, Velocity])

	public constructor(public gravity: number = 9.8, public dragCoeff: number = 0.8) {
		super()
	}

	public override physicsUpdate(entities: Set<Entity>, dt: number): void {
		for(const entity of entities) {
			const container: ComponentContainer = this.world?.getEntityComponents(entity) as ComponentContainer
			const position: Position = container.get(Position)
			const velocity: Velocity = container.get(Velocity)

			velocity.acceleration = Vec2.mul(velocity.velocity, -this.dragCoeff)
			velocity.velocity = Vec2.add(velocity.velocity, Vec2.mul(velocity.acceleration, dt))
			velocity.velocity.y += this.gravity * dt

			position.position = Vec2.add(position.position, Vec2.mul(velocity.velocity, dt))
			
			if(Math.abs(Vec2.lengthSqr(velocity.velocity)) < 0.0001) {
				velocity.velocity = Vec2.zero
			}
		}
	}
}
