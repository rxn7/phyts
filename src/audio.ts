let context: AudioContext | null = null

window.addEventListener('load', () => {
	context = new AudioContext()
})

export class Sound {
	private buffer: AudioBuffer | null = null
	private sources: Set<AudioBufferSourceNode> = new Set()

	constructor(private readonly src: string) {
		window.addEventListener('load', () => {
			this.load()
		})
	}

	public load(): void {
		if(this.buffer) {
			return
		}

		const request: XMLHttpRequest = new XMLHttpRequest()
		request.responseType = "arraybuffer"
		request.open("GET", this.src, true)
		request.send()

		request.addEventListener('load', async () => {
			if(!context) {
				console.error("No audio context")
				return
			}

			context?.decodeAudioData(request.response, (buffer: AudioBuffer) => {
				this.buffer = buffer
				return
			})
		})

		request.addEventListener('error', async (err) => {
			console.error(err)
			return
		})
	}

	public play(pitch: number = 1.0): void {
		if(!this.buffer || !context) {
			return
		}

		const source: AudioBufferSourceNode = context.createBufferSource()
		this.sources.add(source)
		source.buffer = this.buffer

		source.addEventListener('ended', () => {
			source.stop(0)
			this.sources.delete(source)
		})

		source.playbackRate.value = pitch
		source.connect(context.destination)

		source.start(0)
	}
}
