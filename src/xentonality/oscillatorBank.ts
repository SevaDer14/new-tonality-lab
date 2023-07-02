import { Partials } from "./partials";
import type { Point, PointSeriesValue } from "./pointSeries";
import { round } from "./utils";

type Oscillator = {
    node: OscillatorNode
    gain: GainNode
    phase: number
    partial: Point
}

type OscillatorBankConstructorOptions = {
    partials: Partials,
    audioContext: AudioContext,
}

export class OscillatorBank {
    /**
     * Given Partials and AudioContext constructs a bank of sine oscillators
     */
    private audioContext: AudioContext
    private oscillators: Oscillator[]
    private partials: Partials
    private sampleRate: number
    private masterGain: GainNode
    public isPlaying = false
    private masterGainCompensation = 0.2
    private note = 440
    private attack = 0.05
    private release = 0.15

    public constructor({ partials, audioContext }: OscillatorBankConstructorOptions) {
        this.audioContext = audioContext
        this.sampleRate = audioContext.sampleRate
        this.masterGain = this.audioContext.createGain();
        this.partials = new Partials(partials.series.value)
        this.oscillators = this.createOscillators(this.partials, this.note)
        this.setMaterGain(this.calculateMasterGainValue(this.oscillators))
        this.connect(this.audioContext.destination)
    }

    public connect(dest: AudioNode) {
        this.masterGain.connect(dest);
    }

    public disconnect() {
        this.masterGain.disconnect();
    }

    public play(note: number | undefined, time = 0) {
        if (note === undefined || this.isPlaying === true) return

        this.note = note

        this.oscillators = this.createOscillators(this.partials, this.note)

        this.setMaterGain(0)
        this.oscillators.forEach(({ node }) => node.start(time));
        this.setMaterGain(this.calculateMasterGainValue(this.oscillators), this.audioContext.currentTime + this.attack)

        this.isPlaying = true
    }

    public stop(time = this.audioContext.currentTime + this.release) {
        if (this.isPlaying === false) return

        this.setMaterGain(0, time)
        
        this.oscillators.forEach(({ node }) => node.stop(time));
        this.isPlaying = false
    }

    public updatePartials(partials: Partials) {
        const currentTime = this.audioContext.currentTime
        this.partials = partials

        if (this.isPlaying === true) {
            const length = partials.length >= this.oscillators.length ? partials.length : this.oscillators.length
            for (let i = length - 1; i >= 0; i -= 1) {
                if (this.oscillators[i] && partials.get(i)) {
                    this.oscillators[i].node.frequency.exponentialRampToValueAtTime(partials.get(i)[0] * this.note, currentTime + 0.05)
                    this.oscillators[i].gain.gain.linearRampToValueAtTime(partials.get(i)[1], currentTime + 0.05)
                    this.oscillators[i].partial = partials.get(i)
                }

                if (this.oscillators[i] && !partials.get(i)) {
                    this.oscillators[i].node.stop()
                    this.oscillators.splice(i, 1)
                }

                if (!this.oscillators[i] && partials.get(i)) {
                    this.oscillators[i] = this.createOscillator(partials.get(i), this.note, currentTime)
                    this.oscillators[i].node.start()
                }
            }

            this.setMaterGain(this.calculateMasterGainValue(this.oscillators))
        }
    }

    public setMaterGain(value: number, currentTime = this.audioContext.currentTime) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioContext.currentTime)
        this.masterGain.gain.linearRampToValueAtTime(value, currentTime)
    }

    public getPartials(): PointSeriesValue {
        return this.partials.series.value
    }

    public setFrequencyAtTime(note: number, time = this.audioContext.currentTime) {
        this.oscillators.forEach(({ node, partial }) => {
            node.frequency.setValueAtTime(note * partial[0], time);
        });
    }

    public async generateSample(duration: number, randomPhase = false): Promise<AudioBuffer> {
        if (this.audioContext.state !== 'running') await this.audioContext.resume()

        const sample = new Promise<AudioBuffer>((resolve) => {
            const length = duration * this.sampleRate;
            let maxAmplitudeValue = 0
            const audioBuffer: AudioBuffer = new AudioBuffer({ length, numberOfChannels: 1, sampleRate: this.sampleRate });
            const channelData = audioBuffer.getChannelData(0);
            const oscillatorPhases = this.oscillators.map(oscillator => randomPhase ? oscillator.phase : 0)

            for (let p = 0; p < length; p++) {
                for (let i = 0; i < this.oscillators.length; i++) {
                    const omega = 2 * Math.PI * this.oscillators[i].partial[0];

                    channelData[p] += Math.sin(p / this.sampleRate * omega + oscillatorPhases[i]) * this.oscillators[i].partial[1];
                }

                if (Math.abs(channelData[p]) > maxAmplitudeValue) {
                    maxAmplitudeValue = Math.abs(channelData[p])
                }
            }

            const normalizationValue = 0.7 / maxAmplitudeValue

            for (let p = 0; p < length; p++) {
                channelData[p] = channelData[p] * normalizationValue
            }

            resolve(audioBuffer)
        })

        return sample;
    }

    private createOscillators(partials: Partials, note: number): Oscillator[] {
        if (!this.audioContext || !this.masterGain) return []

        let oscillators = [] as Oscillator[]
        const currentTime = this.audioContext.currentTime

        for (let i = 0; i < partials.length; i += 1) {
            const partial = partials.get(i)

            if (partial[0] > 20000) continue

            oscillators[i] = this.createOscillator(partial, note, currentTime)
        };

        return oscillators
    }

    private createOscillator(partial: Point, note: number, currentTime: number): Oscillator {
        const node = this.audioContext.createOscillator()
        const gain = this.audioContext.createGain()
        const phase = 2 * Math.PI * Math.random()
        node.frequency.setValueAtTime(partial[0] * note, currentTime);
        gain.gain.value = partial[1]
        node.connect(gain)
        gain.connect(this.masterGain)

        return { node, gain, phase, partial: partial }
    }

    private calculateMasterGainValue(oscillators: Oscillator[]): number {
        let maxAmplitude = 0

        for (let i = 0; i < oscillators.length; i += 1) {
            maxAmplitude += oscillators[i].partial[1] / (0.5 * i + 1)
        };

        maxAmplitude = maxAmplitude > 1 ? maxAmplitude : 1

        const masterGain = round(this.masterGainCompensation / maxAmplitude, 2)

        return masterGain
    }
}
