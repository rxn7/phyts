import { ComponentContainer } from "./componentContainer.js";
const SIMULATION_UPDATES = 20;
export class World {
    constructor() {
        this.entities = new Map();
        this.systems = new Map();
        this.nextEntityId = 0;
        this.entityDestroyQueue = [];
        this.getEntityCount = () => this.entities.size;
    }
    update(dt) {
        this.updateSystems(dt);
        this.updatePhysics(dt);
        this.destroyQueuedEntities();
    }
    spawnEntity() {
        const entity = this.nextEntityId++;
        this.entities.set(entity, new ComponentContainer());
        return entity;
    }
    queueDestroyEntity(entity) {
        this.entityDestroyQueue.push(entity);
    }
    addEntityComponent(entity, component) {
        const container = this.entities.get(entity);
        if (container === undefined) {
            console.error("Tried to add component to non-existent entity");
            return null;
        }
        container.add(component);
        this.checkEntityInAllSystems(entity);
        return component;
    }
    removeEntityComponent(entity, type) {
        this.entities.get(entity)?.remove(type);
        this.checkEntityInAllSystems(entity);
    }
    getEntityComponents(entity) {
        return this.entities.get(entity);
    }
    addSystem(system) {
        system.world = this;
        this.systems.set(system, new Set());
        for (const entity of this.entities.keys()) {
            this.checkEntityInSystem(system, entity);
        }
    }
    destroyEntity(entity) {
        this.entities.delete(entity);
        for (let entities of this.systems.values()) {
            entities.delete(entity);
        }
    }
    checkEntityInAllSystems(entity) {
        for (const system of this.systems.keys()) {
            this.checkEntityInSystem(system, entity);
        }
    }
    checkEntityInSystem(system, entity) {
        const components = this.entities.get(entity);
        const entities = this.systems.get(system);
        if (!components.hasAll(system.requiredComponents)) {
            entities.delete(entity);
            return;
        }
        entities.add(entity);
    }
    destroyQueuedEntities() {
        while (this.entityDestroyQueue.length != 0) {
            const entity = this.entityDestroyQueue.pop();
            this.destroyEntity(entity);
        }
    }
    updateSystems(dt) {
        for (let [system, entities] of this.systems.entries()) {
            system.update(entities, dt);
        }
    }
    updatePhysics(dt) {
        const physicsDt = dt / SIMULATION_UPDATES;
        for (let i = 0; i < SIMULATION_UPDATES; i++) {
            for (let [system, entities] of this.systems.entries()) {
                system.physicsUpdate(entities, physicsDt);
            }
        }
    }
}
