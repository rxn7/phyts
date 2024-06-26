import { Vec2 } from "../../vec2.js";
import { Component } from "../component.js";
export class Position extends Component {
    constructor(position = Vec2.zero) {
        super();
        this.position = position;
    }
}
