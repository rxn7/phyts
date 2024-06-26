import { Circle } from "../ecs/components/circle.js";
import { Position } from "../ecs/components/position.js";
import { Velocity } from "../ecs/components/velocity.js";
import { Entity } from "../ecs/entity.js";
import { Scene } from "./scene.js";
import { VelocitySystem } from "../ecs/systems/physics/velocitySystem.js";
import { CircleRenderSystem } from "../ecs/systems/rendering/circleRenderSystem.js";
import { Renderer } from "../renderer.js";
import { Color } from "../ecs/components/color.js";
import { BoundaryCollisionEvent, BoundaryType, CircleBoundarySystem } from "../ecs/systems/physics/circleBoundarySystem.js";
import { CircleCollisionSystem } from "../ecs/systems/physics/circleCollisionSystem.js";
import { Vec2 } from "../vec2.js";
import { LineRendererSystem } from "../ecs/systems/rendering/lineRendererSystem.js";
import { LineRenderer } from "../ecs/components/lineRenderer.js";
import { Sound } from "../audio.js";
import { ComponentContainer } from "../ecs/componentContainer.js";
import { CollisionEvent } from "../events/collisionEvent.js";

const RADIUS_MIN: number = 20
const RADIUS_MAX: number = 40

export class BallsScene extends Scene {
	private readonly hitSound: Sound = new Sound("audio/ball.wav")

	public constructor(private readonly renderer: Renderer) {
		super()

		this.world.addSystem(new CircleCollisionSystem())
		this.world.addSystem(new CircleBoundarySystem(BoundaryType.Circle, renderer.canvas.clientWidth, renderer.canvas.clientHeight, renderer))
		this.world.addSystem(new VelocitySystem(7.0, 0.0))
		this.world.addSystem(new LineRendererSystem(renderer))
		this.world.addSystem(new CircleRenderSystem(renderer))

		addEventListener("boundaryCollision", (ev: CustomEvent<BoundaryCollisionEvent>) => {
			const container: ComponentContainer = this.world.getEntityComponents(ev.detail.entity)

			const lineRenderer: LineRenderer = container.get(LineRenderer)
			lineRenderer.addLine({end: ev.detail.point})

			const velocity: Velocity = container.get(Velocity)

			this.hitSound.play(1.0, Vec2.length(velocity.velocity) * 0.02)
		})

		addEventListener("collision", (ev: CustomEvent<CollisionEvent>) => {
			this.hitSound.play(1.0, Vec2.length(ev.detail.velocity) * 0.02)
		})
	}

	public override update(dt: number): void {
		super.update(dt);
	}

	public override mousePressed(position: Vec2, btn: number): void {
		switch(btn) {
			case 0:
				this.spawnBall(position)
		}
	}

	public spawnBall(position: Vec2 = {x: Math.random() * this.renderer.canvas.clientWidth, y: Math.random() * this.renderer.canvas.clientHeight}): void {
		const entity: Entity = this.world.spawnEntity()

		this.world.addEntityComponent(entity, new Circle(Math.random() * (RADIUS_MAX - RADIUS_MIN) + RADIUS_MIN))
		this.world.addEntityComponent(entity, new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255))
		this.world.addEntityComponent(entity, new Position(position))
		this.world.addEntityComponent(entity, new Velocity())
		this.world.addEntityComponent(entity, new LineRenderer())

		console.log(`Balls spawned: ${this.world.getEntityCount()}`)
	}
}
