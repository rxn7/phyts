import { Position } from "../../components/position.js";
import { Velocity } from "../../components/velocity.js";
import { System } from "../../system.js";
export class VelocitySystem extends System {
    constructor(gravity = 9.8, dragCoeff = 0.8) {
        super();
        this.gravity = gravity;
        this.dragCoeff = dragCoeff;
        this.requiredComponents = new Set([Position, Velocity]);
    }
    update(entities, dt) {
        for (const entity of entities) {
            const container = this.world?.getEntityComponents(entity);
            const position = container.get(Position);
            const velocity = container.get(Velocity);
            velocity.ax = -velocity.vx * this.dragCoeff;
            velocity.ay = -velocity.vy * this.dragCoeff;
            velocity.vx += velocity.ax * dt;
            velocity.vy += velocity.ay * dt;
            velocity.vy += this.gravity * dt;
            position.x += velocity.vx * dt;
            position.y += velocity.vy * dt;
            if (Math.abs(velocity.vx * velocity.vx + velocity.vy * velocity.vy) < 0.01) {
                velocity.vx = 0;
                velocity.vy = 0;
            }
        }
    }
}
