export class ComponentContainer {
    constructor() {
        this.map = new Map();
    }
    add(component) {
        this.map.set(component.constructor, component);
    }
    remove(type) {
        this.map.delete(type);
    }
    get(type) {
        return this.map.get(type);
    }
    has(type) {
        return this.map.has(type);
    }
    hasAll(types) {
        for (const type of types) {
            if (!this.map.has(type)) {
                return false;
            }
        }
        return true;
    }
}
