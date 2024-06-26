export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        this.handleResize();
    }
    clear() {
        this.ctx.fillStyle = 'black';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    handleResize() {
        const size = Math.min(window.innerWidth, window.innerHeight);
        this.canvas.style.height = this.canvas.style.width = size + 'px';
        this.canvas.width = size;
        this.canvas.height = size;
        dispatchEvent(new CustomEvent('rendererResize', { detail: { width: this.canvas.width, height: this.canvas.height } }));
    }
}
