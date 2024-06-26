import { World } from "./ecs/world.js";
import { BallsScene } from "./scenes/ballsScene.js";
import { Renderer } from "./renderer.js";
const canvas = document.getElementById('canvas');
const renderer = new Renderer(canvas);
const world = new World();
let scene = new BallsScene(renderer);
let previousTime = 0;
function getDeltaTime(time) {
    const dt = Math.max((time - previousTime) / 1000, 1 / 10);
    previousTime = time;
    return dt;
}
function update(time) {
    const dt = getDeltaTime(time);
    renderer.clear();
    scene.update(dt);
    world.update(dt);
    requestAnimationFrame(update);
}
update(0);
window.addEventListener('keydown', (ev) => {
    scene.keyPressed(ev.key);
});
window.addEventListener('mousedown', (ev) => {
    const rect = renderer.canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    scene.mousePressed(x, y, ev.button);
});
