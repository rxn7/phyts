import { World } from "./ecs/world.js"
import { Scene } from "./scenes/scene.js"
import { BallsScene } from "./scenes/ballsScene.js"
import { Renderer } from "./renderer.js"

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
const renderer: Renderer = new Renderer(canvas)
const world: World = new World()
let scene: Scene = new BallsScene(renderer)
let previousTime: DOMHighResTimeStamp = 0

function getDeltaTime(time: DOMHighResTimeStamp): number {
	const dt: number = (time - previousTime) / (1000 / 60)
	previousTime = time
	return dt
}

function update(time: DOMHighResTimeStamp): void {
	requestAnimationFrame(update)

	const dt: number = getDeltaTime(time)
	renderer.clear()

	scene.update(dt)
	world.update(dt)
}

update(0)
