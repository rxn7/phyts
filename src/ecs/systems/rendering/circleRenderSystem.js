import { Circle } from "../../components/circle.js";
import { Color } from "../../components/color.js";
import { Position } from "../../components/position.js";
import { System } from "../../system.js";
export class CircleRenderSystem extends System {
    constructor(renderer) {
        super();
        this.renderer = renderer;
        this.requiredComponents = new Set([Position, Circle, Color]);
    }
    update(entities, dt) {
        for (const entity of entities) {
            const container = this.world?.getEntityComponents(entity);
            const position = container.get(Position);
            const circle = container.get(Circle);
            const color = container.get(Color);
            this.renderer.ctx.beginPath();
            this.renderer.ctx.arc(position.x, position.y, circle.radius, 0, 2 * Math.PI);
            this.renderer.ctx.fillStyle = color.toString();
            this.renderer.ctx.fill();
        }
    }
}
