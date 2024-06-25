import { Entity } from './entity.js'
import { World } from './world.js'

export abstract class System {
	public world: World | null = null
	public abstract requiredComponents: Set<Function>

	public abstract update(entties: Set<Entity>, dt: number): void
}
