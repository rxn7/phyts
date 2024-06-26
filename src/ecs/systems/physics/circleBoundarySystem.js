import { Vec2 } from "../../../vec2.js";
import { Circle } from "../../components/circle.js";
import { Position } from "../../components/position.js";
import { Velocity } from "../../components/velocity.js";
import { System } from "../../system.js";
export var BoundaryType;
(function (BoundaryType) {
    BoundaryType[BoundaryType["Rect"] = 0] = "Rect";
    BoundaryType[BoundaryType["Circle"] = 1] = "Circle";
})(BoundaryType || (BoundaryType = {}));
export class CircleBoundarySystem extends System {
    constructor(type, width, height, renderer) {
        super();
        this.type = type;
        this.width = width;
        this.height = height;
        this.renderer = renderer;
        this.requiredComponents = new Set([Position, Velocity, Circle]);
    }
    update(entities, dt) {
        this.renderer.ctx.beginPath();
        switch (this.type) {
            case BoundaryType.Rect:
                this.renderer.ctx.rect(0, 0, this.width, this.height);
                break;
            case BoundaryType.Circle:
                this.renderer.ctx.beginPath();
                this.renderer.ctx.arc(this.renderer.canvas.clientWidth * 0.5, this.renderer.canvas.clientHeight * 0.5, Math.min(this.renderer.canvas.clientWidth, this.renderer.canvas.clientHeight) * 0.5, 0, 2 * Math.PI);
                this.renderer.ctx.fillStyle = "#282828";
                this.renderer.ctx.fill();
                break;
        }
        this.renderer.ctx.strokeStyle = "black";
        this.renderer.ctx.stroke();
    }
    physicsUpdate(entities, dt) {
        for (const entity of entities) {
            const container = this.world?.getEntityComponents(entity);
            const position = container.get(Position);
            const velocity = container.get(Velocity);
            const circle = container.get(Circle);
            switch (this.type) {
                case BoundaryType.Rect:
                    this.rectBoundary(position, velocity, circle);
                    break;
                case BoundaryType.Circle:
                    this.circleBoundary(entity, position, velocity, circle);
                    break;
            }
        }
    }
    rectBoundary(position, velocity, circle) {
        if (position.position.x - circle.radius < 0) {
            position.position.x = circle.radius;
            velocity.flipX();
        }
        else if (position.position.x + circle.radius > this.width) {
            position.position.x = this.width - circle.radius;
            velocity.flipX();
        }
        if (position.position.y - circle.radius < 0) {
            position.position.y = circle.radius;
            velocity.flipY();
        }
        else if (position.position.y + circle.radius > this.height) {
            position.position.y = this.height - circle.radius;
            velocity.flipY();
        }
    }
    circleBoundary(entity, position, velocity, circle) {
        const boundaryRadius = Math.min(this.width, this.height) * 0.5;
        const center = { x: this.width * 0.5, y: this.height * 0.5 };
        const diff = Vec2.sub(position.position, center);
        const distance = Vec2.length(diff);
        if (distance + circle.radius <= boundaryRadius) {
            return;
        }
        const normal = Vec2.div(diff, distance);
        const dot = velocity.velocity.x * normal.x + velocity.velocity.y * normal.y;
        velocity.velocity.x -= 2 * dot * normal.x;
        velocity.velocity.y -= 2 * dot * normal.y;
        position.position = Vec2.add(center, Vec2.mul(normal, boundaryRadius - circle.radius));
        const collisionEvent = new CustomEvent("boundaryCollision", { detail: { entity: entity, point: Vec2.add(position.position, Vec2.mul(normal, circle.radius)), velocity: velocity.velocity } });
        dispatchEvent(collisionEvent);
    }
}
