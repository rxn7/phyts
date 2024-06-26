export type Vec2 =  {
	x: number
	y: number
}

export namespace Vec2 {
	export const zero = { x: 0, y: 0 }

	export function add(v1: Vec2, v2: Vec2): Vec2 {
		return {
			x: v1.x + v2.x,
			y: v1.y + v2.y
		}
	}

	export function sub(v1: Vec2, v2: Vec2): Vec2 {
		return {
			x: v1.x - v2.x,
			y: v1.y - v2.y
		}
	}

	export function mul(v1: Vec2, v: number): Vec2 {
		return {
			x: v1.x * v,
			y: v1.y * v
		}
	}

	export function div(v1: Vec2, v: number): Vec2 {
		return {
			x: v1.x / v,
			y: v1.y / v
		}
	}

	export function length(v: Vec2): number {
		return Math.sqrt(v.x * v.x + v.y * v.y)
	}

	export function lengthSqr(v: Vec2): number {
		return v.x * v.x + v.y * v.y
	}
}
