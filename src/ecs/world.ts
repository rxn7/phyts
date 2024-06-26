import { Component } from "./component.js"
import { ComponentContainer } from "./componentContainer.js"
import { Entity } from "./entity.js"
import { System } from "./system.js"

const SIMULATION_UPDATES: number = 20

export class World {
	public readonly entities: Map<Entity, ComponentContainer> = new Map()
	public readonly systems: Map<System, Set<Entity>> = new Map()

	private nextEntityId: number = 0
	private entityDestroyQueue: Entity[] = []

	public getEntityCount = (): number => this.entities.size

	public update(dt: number): void {
		this.updateSystems(dt)
		this.updatePhysics(dt)
		this.destroyQueuedEntities()
	}

	public spawnEntity(): Entity {
		const entity: Entity= this.nextEntityId++;
		this.entities.set(entity, new ComponentContainer())
		return entity;
	}

	public queueDestroyEntity(entity: Entity): void {
		this.entityDestroyQueue.push(entity)
	}

	public addEntityComponent(entity: Entity, component: Component): Component | null {
		const container: ComponentContainer | undefined = this.entities.get(entity)
		if(container === undefined) {
			console.error("Tried to add component to non-existent entity")
			return null;
		}

		container.add(component)
		this.checkEntityInAllSystems(entity)

		return component
	}

	public removeEntityComponent(entity: Entity, type: Function): void {
		this.entities.get(entity)?.remove(type)
		this.checkEntityInAllSystems(entity)
	}

	public getEntityComponents(entity: Entity): ComponentContainer {
		return this.entities.get(entity) as ComponentContainer
	}

	public addSystem(system: System): void {
		system.world = this
		this.systems.set(system, new Set<Entity>())

		for(const entity of this.entities.keys()) {
			this.checkEntityInSystem(system, entity)
		}
	}

	private destroyEntity(entity: Entity): void {
		this.entities.delete(entity)
		for(let entities of this.systems.values()) {
			entities.delete(entity)
		}
	}

	private checkEntityInAllSystems(entity: Entity): void {
		for(const system of this.systems.keys()) {
			this.checkEntityInSystem(system, entity)
		}
	}

	private checkEntityInSystem(system: System, entity: Entity): void {
		const components: ComponentContainer = this.entities.get(entity) as ComponentContainer
		const entities: Set<Entity> = this.systems.get(system) as Set<Entity>
		
		if(!components.hasAll(system.requiredComponents)) {
			entities.delete(entity)
			return
		}

		entities.add(entity)
	}

	private destroyQueuedEntities(): void {
		while(this.entityDestroyQueue.length != 0) {
			const entity: Entity = this.entityDestroyQueue.pop() as Entity
			this.destroyEntity(entity)
		}
	}

	private updateSystems(dt: number): void {
		for(let [system, entities] of this.systems.entries()) {
			system.update(entities, dt);
		}
	}

	private updatePhysics(dt: number): void {
		const physicsDt: number = dt / SIMULATION_UPDATES
		for(let i: number = 0; i < SIMULATION_UPDATES; i++) {
			for(let [system, entities] of this.systems.entries()) {
				system.physicsUpdate(entities, physicsDt);
			}
		}
	}
}
