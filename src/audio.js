let context = null;
window.addEventListener('load', () => {
    context = new AudioContext();
});
export class Sound {
    constructor(src) {
        this.src = src;
        this.buffer = null;
        this.sources = new Set();
        window.addEventListener('load', () => {
            this.load();
        });
    }
    load() {
        if (this.buffer) {
            return;
        }
        const request = new XMLHttpRequest();
        request.responseType = "arraybuffer";
        request.open("GET", this.src, true);
        request.send();
        request.addEventListener('load', async () => {
            if (!context) {
                console.error("No audio context");
                return;
            }
            context?.decodeAudioData(request.response, (buffer) => {
                this.buffer = buffer;
                return;
            });
        });
        request.addEventListener('error', async (err) => {
            console.error(err);
            return;
        });
    }
    play(volume = 1.0, pitch = 1.0) {
        if (!this.buffer || !context) {
            return;
        }
        const source = context.createBufferSource();
        this.sources.add(source);
        source.buffer = this.buffer;
        source.addEventListener('ended', () => {
            source.stop(0);
            this.sources.delete(source);
        });
        const gainNode = context.createGain();
        gainNode.gain.value = volume;
        source.playbackRate.value = pitch;
        source.connect(gainNode).connect(context.destination);
        source.start(0);
    }
}
