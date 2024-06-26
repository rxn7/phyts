import { Position } from "../components/position.js";
import { Velocity } from "../components/velocity.js";
import { System } from "../system.js";
export class VelocitySystem extends System {
    constructor(gravity = 9.8) {
        super();
        this.gravity = gravity;
        this.requiredComponents = new Set([Position, Velocity]);
    }
    update(entities, dt) {
        for (const entity of entities) {
            const container = this.world?.getEntityComponents(entity);
            const position = container.get(Position);
            const velocity = container.get(Velocity);
            velocity.vy += this.gravity * dt;
            position.x += velocity.vx * dt;
            position.y += velocity.vy * dt;
        }
    }
}
