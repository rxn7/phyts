import { Component } from "../component.js";
export class Color extends Component {
    constructor(r = 255, g = 0, b = 0) {
        super();
        this.r = r;
        this.g = g;
        this.b = b;
    }
    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}
