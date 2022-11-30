import { round } from "lodash";
import type { TPartial, TPartials } from "./types";

type AdditiveSynthOscillator = {
    node: OscillatorNode
    gain: GainNode
    ratio: number
    frequency: number
    phase: number
    amplitude: number
    loudness: number
}

export class AdditiveSynth {
    /**
     * Given an array of Partials and AudioContext constructs an additive synth
     */
    private audioContext: AudioContext
    private oscillators: AdditiveSynthOscillator[]
    private sampleRate: number
    private masterGain: GainNode
    private canPlay = false
    private isPlaying = false
    private masterGainCompensation = 0.8

    public constructor(partials: TPartials, audioContext: AudioContext) {
        this.audioContext = audioContext
        this.sampleRate = audioContext.sampleRate
        this.masterGain = this.audioContext.createGain();
        this.setMaterGain(this.calculateMasterGainValue(partials))
        this.oscillators = this.createOscillators(partials)
    }

    public connect(dest: AudioNode) {
        this.masterGain.connect(dest);
    }

    public disconnect() {
        this.masterGain.disconnect();
    }

    public start(time = 0) {
        if (this.isPlaying === true) return

        if (this.canPlay === false) this.rebuildOscillators()

        this.isPlaying = true

        this.oscillators.forEach(({ node }) => node.start(time));
    }

    public stop(time = 0) {
        if (this.isPlaying === false) return
        this.oscillators.forEach(({ node }) => node.stop(time));
        this.canPlay = false // need to rebuild oscillators
        this.isPlaying = false
    }

    public updatePartials(partials: TPartials) {
        const currentTime = this.audioContext.currentTime

        if (this.isPlaying === false) {
            this.oscillators = this.createOscillators(partials)
            this.setMaterGain(this.calculateMasterGainValue(this.oscillators))
        } else {
            const length = partials.length >= this.oscillators.length ? partials.length : this.oscillators.length
            for (let i = 0; i < length; i += 1) {
                if (this.oscillators[i] && partials[i]) {
                    this.oscillators[i].node.frequency.exponentialRampToValueAtTime(partials[i].frequency, currentTime)
                    this.oscillators[i].gain.gain.exponentialRampToValueAtTime(partials[i].amplitude, currentTime)
                    this.oscillators[i].frequency = partials[i].frequency
                    this.oscillators[i].amplitude = partials[i].amplitude
                    this.oscillators[i].ratio = partials[i].ratio
                    this.oscillators[i].loudness = partials[i].loudness
                }

                if (this.oscillators[i] && !partials[i]) {
                    this.oscillators[i].node.stop()
                    this.oscillators.splice(i, 1)
                }

                if (!this.oscillators[i] && partials[i]) {
                    this.oscillators[i] = this.createOscillator(partials[i], currentTime)
                    this.oscillators[i].node.start()
                }
            }

            this.setMaterGain(this.calculateMasterGainValue(this.oscillators))
        }
    }

    public setMaterGain(value: number, currentTime = this.audioContext.currentTime) {
        this.masterGain.gain.exponentialRampToValueAtTime(value, currentTime)
    }

    public getPartials() {
        return this.oscillators.map(({ node, gain }, index) => ({ index: index, frequency: node.frequency.value, gain: gain.gain.value }))
    }

    public setFrequencyAtTime(note: number, time = this.audioContext.currentTime) {
        this.oscillators.forEach(({ node, ratio }) => {
            node.frequency.setValueAtTime(note * ratio, time);
        });
    }

    public async generateSample(duration: number, randomPhase = false): Promise<AudioBuffer> {
        if (this.audioContext.state !== 'running') await this.audioContext.resume()
        
        const sample = new Promise<AudioBuffer>((resolve) => {
            const length = duration * this.sampleRate;
            const audioBuffer: AudioBuffer = new AudioBuffer({ length, numberOfChannels: 1, sampleRate: this.sampleRate });
            const channelData = audioBuffer.getChannelData(0);
            const oscillatorPhases = this.oscillators.map(oscillator => randomPhase ? oscillator.phase : 0)

            for (let p = 0; p < length; p++) {
                for (let i = 0; i < this.oscillators.length; i++) {
                    const omega = 2 * Math.PI * this.oscillators[i].frequency;

                    channelData[p] += Math.sin(p / this.sampleRate * omega + oscillatorPhases[i]) * this.oscillators[i].amplitude * this.masterGain.gain.value;
                }
            }

            resolve(audioBuffer)
        })

        return sample;
    }

    private createOscillators(partials: TPartials): AdditiveSynthOscillator[] {
        if (!this.audioContext || !this.masterGain) return []

        // eslint-disable-next-line prefer-const
        let oscillators = [] as AdditiveSynthOscillator[]
        const currentTime = this.audioContext.currentTime

        for (let i = 0; i < partials.length; i += 1) {
            if (partials[i].frequency < 20 || partials[i].frequency > 20000) continue

            oscillators[i] = this.createOscillator(partials[i], currentTime)
        };

        this.canPlay = true

        return oscillators
    }

    private createOscillator(partial: TPartial, currentTime: number): AdditiveSynthOscillator {
        const node = this.audioContext.createOscillator()
        const gain = this.audioContext.createGain()
        const phase = 2 * Math.PI * Math.random()
        node.frequency.setValueAtTime(partial.frequency, currentTime);
        gain.gain.value = partial.amplitude
        node.connect(gain)
        gain.connect(this.masterGain)

        return { node, gain, phase, ...partial }
    }

    private calculateMasterGainValue(partials: TPartials): number {
        let maxAmplitude = 0

        for (let i = 0; i < partials.length; i += 1) {
            maxAmplitude += partials[i].amplitude
        };

        maxAmplitude = maxAmplitude > 1 ? maxAmplitude : 1

        const masterGain = round(this.masterGainCompensation / maxAmplitude, 2)

        return masterGain
    }

    private rebuildOscillators() {
        const partials = this.oscillators.map(({ ratio, frequency, amplitude, loudness }) => ({
            ratio: ratio,
            frequency: frequency,
            amplitude: amplitude,
            loudness: loudness,
        }))

        this.oscillators = this.createOscillators(partials)
    }
}
