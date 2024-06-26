import { Circle } from "../ecs/components/circle.js";
import { Position } from "../ecs/components/position.js";
import { Velocity } from "../ecs/components/velocity.js";
import { Scene } from "./scene.js";
import { VelocitySystem } from "../ecs/systems/physics/velocitySystem.js";
import { CircleRenderSystem } from "../ecs/systems/rendering/circleRenderSystem.js";
import { Color } from "../ecs/components/color.js";
import { CircleBoundarySystem } from "../ecs/systems/physics/circleBoundarySystem.js";
import { CircleCollisionSystem } from "../ecs/systems/physics/circleCollisionSystem.js";
const VELOCITY_MIN = 20;
const VELOCITY_MAX = 35;
const RADIUS_MIN = 20;
const RADIUS_MAX = 40;
export class BallsScene extends Scene {
    constructor(renderer) {
        super();
        this.renderer = renderer;
        this.world.addSystem(new VelocitySystem(20, 0.2));
        this.world.addSystem(new CircleBoundarySystem(renderer.canvas.clientWidth, renderer.canvas.clientHeight));
        this.world.addSystem(new CircleCollisionSystem());
        this.world.addSystem(new CircleRenderSystem(renderer));
        this.spawnBall();
    }
    update(dt) {
        super.update(dt);
    }
    mousePressed(mouseX, mouseY, btn) {
        switch (btn) {
            case 0:
                this.spawnBall(mouseX, mouseY);
        }
    }
    spawnBall(x = Math.random() * this.renderer.canvas.clientWidth, y = Math.random() * this.renderer.canvas.clientHeight) {
        const entity = this.world.spawnEntity();
        this.world.addEntityComponent(entity, new Circle(Math.random() * (RADIUS_MAX - RADIUS_MIN) + RADIUS_MIN));
        this.world.addEntityComponent(entity, new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255));
        this.world.addEntityComponent(entity, new Position(x, y));
        const velocity = this.world.addEntityComponent(entity, new Velocity());
        const speed = Math.random() * (VELOCITY_MAX - VELOCITY_MIN) + VELOCITY_MIN;
        velocity.vx = speed * (Math.random() > 0.5 ? 1 : -1);
        velocity.vy = speed * (Math.random() > 0.5 ? 1 : -1);
        console.log(`Balls spawned: ${this.world.getEntityCount()}`);
    }
}
