import { Entity } from "../ecs/entity"
import { Vec2 } from "../vec2"

export type CollisionEvent = {
	entityA: Entity
	entityB: Entity
	velocity: Vec2
}

declare global {
	interface GlobalEventHandlersEventMap {
		collision: CustomEvent<CollisionEvent>;
	}
}

