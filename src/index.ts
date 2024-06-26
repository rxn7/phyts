import { World } from "./ecs/world.js"
import { Scene } from "./scenes/scene.js"
import { BallsScene } from "./scenes/ballsScene.js"
import { Renderer } from "./renderer.js"
import { Vec2 } from "./vec2.js"

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
const renderer: Renderer = new Renderer(canvas)
const world: World = new World()
let scene: Scene = new BallsScene(renderer)
let previousTime: DOMHighResTimeStamp = 0

function getDeltaTime(time: DOMHighResTimeStamp): number {
	const dt: number = Math.max((time - previousTime) / 1000, 1/10)
	previousTime = time
	return dt
}

function update(time: DOMHighResTimeStamp): void {
	const dt: number = getDeltaTime(time)
	renderer.clear()

	scene.update(dt)
	world.update(dt)

	requestAnimationFrame(update)
}

update(0)

window.addEventListener('keydown', (ev: KeyboardEvent) => {
	scene.keyPressed(ev.key)
})

window.addEventListener('mousedown', (ev: MouseEvent) => {
	const rect: DOMRect = renderer.canvas.getBoundingClientRect()
	const position: Vec2 = {
		x: ev.clientX - rect.left,
		y: ev.clientY - rect.top
	}

	scene.mousePressed(position, ev.button)
})
