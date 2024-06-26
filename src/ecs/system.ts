import { Entity } from './entity.js'
import { World } from './world.js'

export abstract class System {
	public world: World | null = null
	public abstract requiredComponents: Set<Function>

	public update(entties: Set<Entity>, dt: number): void {}
	public physicsUpdate(entities: Set<Entity>, dt: number): void {}
}
