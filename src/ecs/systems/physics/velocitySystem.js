import { Vec2 } from "../../../vec2.js";
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
    physicsUpdate(entities, dt) {
        for (const entity of entities) {
            const container = this.world?.getEntityComponents(entity);
            const position = container.get(Position);
            const velocity = container.get(Velocity);
            velocity.acceleration = Vec2.mul(velocity.velocity, -this.dragCoeff);
            velocity.velocity = Vec2.add(velocity.velocity, Vec2.mul(velocity.acceleration, dt));
            velocity.velocity.y += this.gravity * dt;
            position.position = Vec2.add(position.position, Vec2.mul(velocity.velocity, dt));
            if (Math.abs(Vec2.lengthSqr(velocity.velocity)) < 0.0001) {
                velocity.velocity = Vec2.zero;
            }
        }
    }
}
