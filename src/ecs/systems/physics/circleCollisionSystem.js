import { Vec2 } from "../../../vec2.js";
import { Circle } from "../../components/circle.js";
import { Position } from "../../components/position.js";
import { Velocity } from "../../components/velocity.js";
import { System } from "../../system.js";
export class CircleCollisionSystem extends System {
    constructor() {
        super(...arguments);
        this.requiredComponents = new Set([Position, Velocity, Circle]);
        this.collisions = new Set();
    }
    physicsUpdate(entities, dt) {
        this.collisions.clear();
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
                const diff = Vec2.sub(a.position.position, b.position.position);
                const distanceSqr = Vec2.lengthSqr(diff);
                if (!CircleCollisionSystem.circlesOverlap(a.circle, b.circle, distanceSqr)) {
                    continue;
                }
                const distance = Math.sqrt(distanceSqr);
                const overlap = (distance - a.circle.radius - b.circle.radius) * 0.5;
                const normal = Vec2.div(Vec2.mul(diff, overlap), distance);
                a.position.position = Vec2.sub(a.position.position, normal);
                b.position.position = Vec2.add(b.position.position, normal);
                this.collisions.add({ a, b });
                const event = new CustomEvent("collision", {
                    detail: { entityA: entityA, entityB: entityB, velocity: Vec2.add(a.velocity.velocity, b.velocity.velocity) }
                });
                dispatchEvent(event);
            }
        }
        for (const { a, b } of this.collisions) {
            const distance = Vec2.length(Vec2.sub(a.position.position, b.position.position));
            const normal = Vec2.div(Vec2.sub(a.position.position, b.position.position), distance);
            const dotNormalA = a.velocity.velocity.x * normal.x + a.velocity.velocity.y * normal.y;
            const dotNormalB = b.velocity.velocity.x * normal.x + b.velocity.velocity.y * normal.y;
            const tangent = { x: -normal.y, y: normal.x };
            const dotTangentA = a.velocity.velocity.x * tangent.x + a.velocity.velocity.y * tangent.y;
            const dotTangentB = b.velocity.velocity.x * tangent.x + b.velocity.velocity.y * tangent.y;
            const massSum = a.circle.radius + b.circle.radius;
            const momentumA = (dotNormalA * (a.circle.radius - b.circle.radius) + 2.0 * b.circle.radius * dotNormalB) / massSum;
            const momentumB = (dotNormalB * (b.circle.radius - a.circle.radius) + 2.0 * a.circle.radius * dotNormalA) / massSum;
            a.velocity.velocity = Vec2.add(Vec2.mul(tangent, dotTangentA), Vec2.mul(normal, momentumA));
            b.velocity.velocity = Vec2.add(Vec2.mul(tangent, dotTangentB), Vec2.mul(normal, momentumB));
        }
    }
    static circlesOverlap(a, b, distanceSqr) {
        const sum = a.radius + b.radius;
        return distanceSqr < sum * sum;
    }
}
