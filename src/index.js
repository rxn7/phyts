import { World } from "./ecs/world.js";
import { BallsScene } from "./scenes/ballsScene.js";
import { Renderer } from "./renderer.js";
const canvas = document.getElementById('canvas');
const renderer = new Renderer(canvas);
const world = new World();
let scene = new BallsScene(renderer);
let previousTime = 0;
function getDeltaTime(time) {
    const dt = (time - previousTime) / (1000 / 60);
    previousTime = time;
    return dt;
}
function update(time) {
    requestAnimationFrame(update);
    const dt = getDeltaTime(time);
    renderer.clear();
    scene.update(dt);
    world.update(dt);
}
update(0);
window.addEventListener('keydown', (ev) => {
    scene.keyPressed(ev.key);
});
window.addEventListener('mousedown', (ev) => {
    const rect = renderer.canvas.getBoundingClientRect();
    const position = {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
    };
    scene.mousePressed(position, ev.button);
});
