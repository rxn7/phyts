import { Component } from "./component.js"

type ComponentClass<T extends Component> = new (...args: any[]) => T

export class ComponentContainer {
	private map: Map<Function, Component> = new Map()

	public add(component: Component): void {
		this.map.set(component.constructor, component)
	}

	public remove(type: Function): void {
		this.map.delete(type)
	}

	public get<T extends Component>(type: ComponentClass<T>): T {
		return this.map.get(type) as T
	}

	public has(type: Function): boolean {
		return this.map.has(type)
	}

	public hasAll(types: Iterable<Function>): boolean {
		for (const type of types) {
			if (!this.map.has(type)) {
				return false
			}
		}

		return true
	}
}
