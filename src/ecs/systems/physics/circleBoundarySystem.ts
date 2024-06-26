import { Renderer, RendererResizeEvent } from "../../../renderer.js"
import { Vec2 } from "../../../vec2.js"
import { ComponentContainer } from "../../componentContainer.js"
import { Circle } from "../../components/circle.js"
import { Position } from "../../components/position.js"
import { Velocity } from "../../components/velocity.js"
import { Entity } from "../../entity.js"
import { System } from "../../system.js"

export enum BoundaryType {
	Rect,
	Circle
}

export type BoundaryCollisionEvent = {
	entity: Entity
	point: Vec2
	velocity: Vec2
}

declare global {
	interface GlobalEventHandlersEventMap {
		boundaryCollision: CustomEvent<BoundaryCollisionEvent>;
	}
}

export class CircleBoundarySystem extends System {
	public requiredComponents: Set<Function> = new Set([Position, Velocity, Circle])
	private width: number
	private height: number

	public constructor(public readonly type: BoundaryType, private readonly renderer: Renderer) {
		super()

		this.width = renderer.canvas.clientWidth
		this.height = renderer.canvas.clientHeight

		addEventListener('rendererResize', (ev: CustomEvent<RendererResizeEvent>) => {
			this.width = ev.detail.width
			this.height = ev.detail.height
		})
	}

	public override update(entities: Set<Entity>, dt: number): void {
		this.renderer.ctx.beginPath()

		switch(this.type) {
			case BoundaryType.Rect:
				this.renderer.ctx.rect(0, 0, this.width, this.height)
				break

			case BoundaryType.Circle:
				this.renderer.ctx.beginPath()
				this.renderer.ctx.arc(this.renderer.canvas.clientWidth * 0.5, this.renderer.canvas.clientHeight * 0.5, Math.min(this.renderer.canvas.clientWidth, this.renderer.canvas.clientHeight) * 0.5, 0, 2 * Math.PI)
				this.renderer.ctx.fillStyle = "#282828"
				this.renderer.ctx.fill()
				break
		}

		this.renderer.ctx.strokeStyle = "black"
		this.renderer.ctx.stroke()
	}

	public override physicsUpdate(entities: Set<Entity>, dt: number): void {
		for(const entity of entities) {
			const container: ComponentContainer = this.world?.getEntityComponents(entity) as ComponentContainer
			const position: Position = container.get(Position)
			const velocity: Velocity = container.get(Velocity)
			const circle: Circle = container.get(Circle)

			switch(this.type) {
				case BoundaryType.Rect:
					this.rectBoundary(position, velocity, circle)
					break

				case BoundaryType.Circle:
					this.circleBoundary(entity, position, velocity, circle)
					break
			}
		}
	}

	private rectBoundary(position: Position, velocity: Velocity, circle: Circle): void {
		if(position.position.x - circle.radius < 0) {
			position.position.x = circle.radius 
			velocity.flipX()
		} else if(position.position.x + circle.radius > this.width) {
			position.position.x = this.width - circle.radius
			velocity.flipX()
		}

		if(position.position.y - circle.radius < 0) {
			position.position.y = circle.radius 
			velocity.flipY()
		} else if(position.position.y + circle.radius > this.height) {
			position.position.y = this.height - circle.radius
			velocity.flipY()
		}
	}

	private circleBoundary(entity: Entity, position: Position, velocity: Velocity, circle: Circle): void {
		const boundaryRadius: number = Math.min(this.width, this.height) * 0.5

		const center: Vec2 = { x: this.width * 0.5, y: this.height * 0.5 }
		const diff: Vec2 = Vec2.sub(position.position, center)
		const distance: number = Vec2.length(diff)

		if(distance + circle.radius <= boundaryRadius) {
			return
		}

		const normal: Vec2 = Vec2.div(diff, distance)
		const dot: number = velocity.velocity.x * normal.x + velocity.velocity.y * normal.y
		velocity.velocity.x -= 2 * dot * normal.x
		velocity.velocity.y -= 2 * dot * normal.y

		position.position = Vec2.add(center, Vec2.mul(normal, boundaryRadius - circle.radius - 0.001))

		const collisionEvent: Event = new CustomEvent<BoundaryCollisionEvent>("boundaryCollision", { detail: { entity: entity, point: Vec2.add(position.position, Vec2.mul(normal, circle.radius)), velocity: velocity.velocity } })
		dispatchEvent(collisionEvent)
	}
}
