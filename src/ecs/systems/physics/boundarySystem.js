import { Circle } from "../../components/circle.js";
import { Position } from "../../components/position.js";
import { Velocity } from "../../components/velocity.js";
import { System } from "../../system.js";
export class BoundarySystem extends System {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
        this.requiredComponents = new Set([Position, Velocity]);
    }
    update(entities, dt) {
        for (const entity of entities) {
            const container = this.world?.getEntityComponents(entity);
            const position = container.get(Position);
            const velocity = container.get(Velocity);
            if (container.has(Circle)) {
                const circle = container.get(Circle);
                if (position.x - circle.radius < 0) {
                    velocity.vx *= -1;
                    position.x = circle.radius;
                }
                else if (position.x + circle.radius > this.width) {
                    velocity.vx *= -1;
                    position.x = this.width - circle.radius;
                }
                if (position.y - circle.radius < 0) {
                    velocity.vy *= -1;
                    position.y = circle.radius;
                }
                else if (position.y + circle.radius > this.height) {
                    velocity.vy *= -1;
                    position.y = this.height - circle.radius;
                }
            }
        }
    }
}
