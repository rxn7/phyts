import { World } from "../ecs/world.js";

export abstract class Scene {
	protected readonly world: World
	
	public constructor() {
		this.world = new World()
	}

	public update(dt: number): void {
		this.world.update(dt)
	}

	public keyPressed(key: string): void {}

	public mousePressed(mouseX: number, mouseY: number, btn: number): void {}
}
