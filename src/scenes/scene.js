import { World } from "../ecs/world.js";
export class Scene {
    constructor() {
        this.world = new World();
    }
    update(dt) {
        this.world.update(dt);
    }
    keyPressed(key) { }
    mousePressed(position, btn) { }
}
