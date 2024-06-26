import { Vec2 } from "../../vec2.js";
import { Component } from "../component.js";
export class Velocity extends Component {
    constructor(velocity = Vec2.zero, acceleration = Vec2.zero) {
        super();
        this.velocity = velocity;
        this.acceleration = acceleration;
    }
    flipX() {
        this.velocity.x *= -1;
        this.acceleration.x *= -1;
    }
    flipY() {
        this.velocity.y *= -1;
        this.acceleration.y *= -1;
    }
}
