import { Circle } from "../../components/circle.js";
import { Position } from "../../components/position.js";
import { Velocity } from "../../components/velocity.js";
import { System } from "../../system.js";
export class CircleBoundarySystem extends System {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
        this.requiredComponents = new Set([Position, Velocity, Circle]);
    }
    update(entities, dt) {
        for (const entity of entities) {
            const container = this.world?.getEntityComponents(entity);
            const position = container.get(Position);
            const velocity = container.get(Velocity);
            const circle = container.get(Circle);
            if (position.x - circle.radius < 0) {
                position.x = circle.radius;
                velocity.flipX();
            }
            else if (position.x + circle.radius > this.width) {
                position.x = this.width - circle.radius;
                velocity.flipX();
            }
            if (position.y - circle.radius < 0) {
                position.y = circle.radius;
                velocity.flipY();
            }
            else if (position.y + circle.radius > this.height) {
                position.y = this.height - circle.radius;
                velocity.flipY();
            }
        }
    }
}
