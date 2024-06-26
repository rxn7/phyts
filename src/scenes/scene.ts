import { World } from "../ecs/world.js";
import { Vec2 } from "../vec2.js";

export abstract class Scene {
	protected readonly world: World
	
	public constructor() {
		this.world = new World()
	}

	public update(dt: number): void {
		this.world.update(dt)
	}
}
