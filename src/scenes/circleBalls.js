import { Circle } from "../ecs/components/circle.js";
import { Position } from "../ecs/components/position.js";
import { Velocity } from "../ecs/components/velocity.js";
import { Scene } from "./scene.js";
import { VelocitySystem } from "../ecs/systems/velocitySystem.js";
import { CircleRenderSystem } from "../ecs/systems/renderSystem.js";
import { Color } from "../ecs/components/color.js";
export class CircleBallsScene extends Scene {
    constructor(renderer) {
        super();
        this.world.addSystem(new VelocitySystem());
        this.world.addSystem(new CircleRenderSystem(renderer));
        this.spawnBall();
    }
    update(dt) {
        super.update(dt);
    }
    keyPressed(key) {
        if (key === " ") {
            this.world.spawnEntity();
        }
    }
    spawnBall() {
        const entity = this.world.spawnEntity();
        this.world.addEntityComponent(entity, new Circle(20));
        this.world.addEntityComponent(entity, new Color(255, 0, 0));
        this.world.addEntityComponent(entity, new Position(100, 100));
        this.world.addEntityComponent(entity, new Velocity(10, -10));
    }
}
