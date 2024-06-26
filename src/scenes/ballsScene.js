import { Circle } from "../ecs/components/circle.js";
import { Position } from "../ecs/components/position.js";
import { Velocity } from "../ecs/components/velocity.js";
import { Scene } from "./scene.js";
import { VelocitySystem } from "../ecs/systems/physics/velocitySystem.js";
import { CircleRenderSystem } from "../ecs/systems/rendering/circleRenderSystem.js";
import { Color } from "../ecs/components/color.js";
import { BoundaryType, CircleBoundarySystem } from "../ecs/systems/physics/circleBoundarySystem.js";
import { CircleCollisionSystem } from "../ecs/systems/physics/circleCollisionSystem.js";
import { Vec2 } from "../vec2.js";
import { LineRendererSystem } from "../ecs/systems/rendering/lineRendererSystem.js";
import { LineRenderer } from "../ecs/components/lineRenderer.js";
import { Sound } from "../audio.js";
const RADIUS_MIN = 20;
const RADIUS_MAX = 40;
export class BallsScene extends Scene {
    constructor(renderer) {
        super();
        this.renderer = renderer;
        this.hitSound = new Sound("audio/ball.wav");
        this.world.addSystem(new CircleCollisionSystem());
        this.world.addSystem(new CircleBoundarySystem(BoundaryType.Circle, renderer));
        this.world.addSystem(new VelocitySystem(1.0, 0));
        this.world.addSystem(new LineRendererSystem(renderer));
        this.world.addSystem(new CircleRenderSystem(renderer));
        addEventListener("boundaryCollision", (ev) => {
            const container = this.world.getEntityComponents(ev.detail.entity);
            const lineRenderer = container.get(LineRenderer);
            lineRenderer.addLine({ end: ev.detail.point });
            const velocity = container.get(Velocity);
            this.playCollideSound(velocity.velocity);
        });
        addEventListener("collision", (ev) => {
            this.playCollideSound(ev.detail.velocity);
        });
        addEventListener("rendererResize", (ev) => {
            for (const container of this.world.entities.values()) {
                const lineRenderer = container.get(LineRenderer);
                lineRenderer.clear();
            }
        });
        renderer.canvas.addEventListener('click', (ev) => {
            const rect = renderer.canvas.getBoundingClientRect();
            switch (ev.button) {
                case 0:
                    this.spawnBall({ x: ev.clientX - rect.left, y: ev.clientY - rect.top });
            }
        });
    }
    update(dt) {
        super.update(dt);
    }
    spawnBall(position = { x: Math.random() * this.renderer.canvas.clientWidth, y: Math.random() * this.renderer.canvas.clientHeight }) {
        const entity = this.world.spawnEntity();
        this.world.addEntityComponent(entity, new Circle(Math.random() * (RADIUS_MAX - RADIUS_MIN) + RADIUS_MIN));
        this.world.addEntityComponent(entity, new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255));
        this.world.addEntityComponent(entity, new Position(position));
        this.world.addEntityComponent(entity, new Velocity());
        this.world.addEntityComponent(entity, new LineRenderer());
        console.log(`Balls spawned: ${this.world.getEntityCount()}`);
    }
    playCollideSound(velocity) {
        this.hitSound.play(Vec2.length(velocity) * 0.03);
    }
}
