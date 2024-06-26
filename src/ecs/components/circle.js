import { Component } from "../component.js";
export class Circle extends Component {
    constructor(radius = 1) {
        super();
        this.radius = radius;
    }
}
