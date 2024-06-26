import { Circle } from "../../components/circle.js";
import { Position } from "../../components/position.js";
import { Velocity } from "../../components/velocity.js";
import { System } from "../../system.js";
export class CircleCollisionSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = new Set([Position, Velocity, Circle]);
        this.collisions = [];
    }
    update(entities, dt) {
        this.collisions.length = 0;
        for (const entityA of entities) {
            for (const entityB of entities) {
                if (entityA == entityB)
                    continue;
                const containerA = this.world?.getEntityComponents(entityA);
                const a = {
                    circle: containerA.get(Circle),
                    position: containerA.get(Position),
                    velocity: containerA.get(Velocity)
                };
                const containerB = this.world?.getEntityComponents(entityB);
                const b = {
                    circle: containerB.get(Circle),
                    position: containerB.get(Position),
                    velocity: containerB.get(Velocity)
                };
                const dx = a.position.x - b.position.x;
                const dy = a.position.y - b.position.y;
                const distanceSqr = dx * dx + dy * dy;
                if (!CircleCollisionSystem.circlesOverlap(a.circle, b.circle, distanceSqr)) {
                    continue;
                }
                const distance = Math.sqrt(distanceSqr);
                const overlap = (distance - a.circle.radius - b.circle.radius) * 0.5;
                a.position.x -= overlap * dx / distance;
                a.position.y -= overlap * dy / distance;
                b.position.x += overlap * dx / distance;
                b.position.y += overlap * dy / distance;
                this.collisions.push({ a, b });
            }
        }
        for (const { a, b } of this.collisions) {
            const distance = Math.sqrt((a.position.x - b.position.x) * (a.position.x - b.position.x) + (a.position.y - b.position.y) * (a.position.y - b.position.y));
            const nx = (b.position.x - a.position.x) / distance;
            const ny = (b.position.y - a.position.y) / distance;
            const dotNormalA = a.velocity.vx * nx + a.velocity.vy * ny;
            const dotNormalB = b.velocity.vx * nx + b.velocity.vy * ny;
            console.log(nx, ny);
            const tx = -ny;
            const ty = nx;
            const dotTangentA = a.velocity.vx * tx + a.velocity.vy * ty;
            const dotTangentB = b.velocity.vx * tx + b.velocity.vy * ty;
            const massSum = a.circle.radius + b.circle.radius;
            const momentumA = (dotNormalA * (a.circle.radius - b.circle.radius) + 2.0 * b.circle.radius * dotNormalB) / massSum;
            const momentumB = (dotNormalB * (b.circle.radius - a.circle.radius) + 2.0 * a.circle.radius * dotNormalA) / massSum;
            a.velocity.vx = dotTangentA * tx + nx * momentumA;
            a.velocity.vy = dotTangentA * ty + ny * momentumA;
            b.velocity.vx = dotTangentB * tx + nx * momentumB;
            b.velocity.vy = dotTangentB * ty + ny * momentumB;
        }
    }
    static circlesOverlap(a, b, distanceSqr) {
        const sum = a.radius + b.radius;
        return distanceSqr < sum * sum;
    }
}
