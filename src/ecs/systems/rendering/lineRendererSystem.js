import { Color } from "../../components/color.js";
import { LineRenderer } from "../../components/lineRenderer.js";
import { Position } from "../../components/position.js";
import { System } from "../../system.js";
export class LineRendererSystem extends System {
    constructor(renderer) {
        super();
        this.renderer = renderer;
        this.requiredComponents = new Set([Position, LineRenderer, Color]);
    }
    update(entities, dt) {
        for (const entity of entities) {
            const container = this.world?.getEntityComponents(entity);
            const position = container.get(Position);
            const lineRenderer = container.get(LineRenderer);
            const color = container.get(Color);
            for (const line of lineRenderer.lines) {
                this.renderer.ctx.beginPath();
                this.renderer.ctx.strokeStyle = color.toString();
                this.renderer.ctx.moveTo(position.position.x, position.position.y);
                this.renderer.ctx.lineTo(line.end.x, line.end.y);
                this.renderer.ctx.stroke();
            }
        }
    }
}
