import { Component } from "../component.js";
export class LineRenderer extends Component {
    constructor() {
        super(...arguments);
        this.lines = new Set();
    }
    addLine(line) {
        this.lines.add(line);
    }
    removeLine(line) {
        this.lines.delete(line);
    }
}
