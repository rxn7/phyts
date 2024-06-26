import { Component } from "../component.js";
export class Velocity extends Component {
    constructor(vx = 0, vy = 0) {
        super();
        this.vx = vx;
        this.vy = vy;
        this.ax = 0;
        this.ay = 0;
    }
    flipX() {
        this.vx *= -1;
        this.ax *= -1;
    }
    flipY() {
        this.vy *= -1;
        this.ay *= -1;
    }
}
