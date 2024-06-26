import { Circle } from "../ecs/components/circle.js";
import { Position } from "../ecs/components/position.js";
import { Velocity } from "../ecs/components/velocity.js";
import { Entity } from "../ecs/entity.js";
import { Scene } from "./scene.js";
import { VelocitySystem } from "../ecs/systems/physics/velocitySystem.js";
import { CircleRenderSystem } from "../ecs/systems/rendering/circleRenderSystem.js";
import { Renderer } from "../renderer.js";
import { Color } from "../ecs/components/color.js";
import { CircleBoundarySystem } from "../ecs/systems/physics/circleBoundarySystem.js";
import { CircleCollisionSystem } from "../ecs/systems/physics/circleCollisionSystem.js";

const VELOCITY_MIN: number = 10
const VELOCITY_MAX: number = 15
const RADIUS_MIN: number = 20
const RADIUS_MAX: number = 40

export class BallsScene extends Scene {
	public constructor(private readonly renderer: Renderer) {
		super()
		this.world.addSystem(new VelocitySystem(20, 0.1))
		this.world.addSystem(new CircleBoundarySystem(renderer.canvas.clientWidth, renderer.canvas.clientHeight))
		this.world.addSystem(new CircleCollisionSystem())
		this.world.addSystem(new CircleRenderSystem(renderer))

		this.spawnBall()
	}

	public override update(dt: number): void {
		super.update(dt);
	}

	public override keyPressed(key: string): void {
		switch(key) {
			case " ":
				this.spawnBall()
				break
		}
	}

	public spawnBall(): void {
		const entity: Entity = this.world.spawnEntity()
		this.world.addEntityComponent(entity, new Circle(Math.random() * (RADIUS_MAX - RADIUS_MIN) + RADIUS_MIN))
		this.world.addEntityComponent(entity, new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255))
		this.world.addEntityComponent(entity, new Position(Math.random() * this.renderer.canvas.clientWidth, Math.random() * this.renderer.canvas.clientHeight))

		const velocity: Velocity = this.world.addEntityComponent(entity, new Velocity()) as Velocity
		const speed: number = Math.random() * (VELOCITY_MAX - VELOCITY_MIN) + VELOCITY_MIN
		velocity.vx = speed * (Math.random() > 0.5 ? 1 : -1)
		velocity.vy = speed * (Math.random() > 0.5 ? 1 : -1)

		console.log(`Balls spawned: ${this.world.getEntityCount()}`)
	}
}
