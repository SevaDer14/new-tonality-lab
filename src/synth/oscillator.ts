import type { Partial, PlayState } from './types'

type OscillatorConstructorArgs = Partial & {
    audioContext: AudioContext
    destination: GainNode
}

export class Oscillator {
    private _rate: number
    private _amplitude: number
    private _phase: number
    private _pitch = 0
    private _oscNode: OscillatorNode
    private _gain: GainNode
    private _state: PlayState
    private _audioContext: AudioContext

    public constructor(args: OscillatorConstructorArgs) {
        const { rate, amplitude, phase, audioContext, destination } = args
        this._rate = rate
        this._amplitude = amplitude
        this._phase = phase || 0
        this._audioContext = audioContext

        this._gain = this._audioContext.createGain()
        this.setGain(this._amplitude)
        this.connect(destination)

        this._oscNode = this.buildOscNode()
        this._oscNode.connect(this._gain)

        this._state = 'ready'
    }

    public get rate() {
        return this._rate
    }

    public get amplitude() {
        return this._amplitude
    }

    public get gain() {
        return this._gain.gain.value
    }

    public get phase() {
        return this._phase
    }

    public get state() {
        return this._state
    }

    public play(pitch: number, time = this._audioContext.currentTime) {
        if (this._state === 'used') throw new Error(`Attempting to start oscillator with 'used' state`)

        const frequency = this._rate * pitch
        if (frequency > 20000 || frequency < 20) throw new Error(`Oscillator frequency="${frequency}" is out of range`)

        this._pitch = pitch
        this.setOscNodeFrequency(frequency, time)

        if (this._state === 'ready') {
            this._state = 'playing'
            this._oscNode.start(time)
        }
    }

    public release(time = this._audioContext.currentTime) {
        if (this._state !== 'playing') return

        this.setGain(0, time)
        this._oscNode.stop(time)
        this._state = 'used'
        this.disconnect()
    }

    public setRate(rate: number) {
        this._rate = rate
        if (this._state === 'playing' && this._pitch) {
            this.setOscNodeFrequency(this._rate * this._pitch)
        }
    }

    public setAmplitude(amplitude: number) {
        this._amplitude = amplitude
        this.setGain(this._amplitude)
    }

    public update({ rate, amplitude }: { rate: number; amplitude: number }) {
        if (rate) this.setRate(rate)
        if (amplitude) this.setAmplitude(amplitude)
    }

    public destroy() {
        if (this._state === 'playing') {
            this.release()
        } else {
            this.disconnect()
        }
    }

    private connect(dest: AudioNode) {
        this._gain.connect(dest)
    }

    private disconnect() {
        this._gain.disconnect()
        this._oscNode.disconnect()
    }
    private buildOscNode() {
        const newOsc = this._audioContext.createOscillator()
        const wave = this._audioContext.createPeriodicWave([0, this._phase], [0, 1 - this._phase])
        newOsc.setPeriodicWave(wave)

        return newOsc
    }

    private setOscNodeFrequency(frequency: number, time = this._audioContext.currentTime) {
        this._oscNode.frequency.exponentialRampToValueAtTime(frequency, time)
    }

    private setGain(gain: number, time = this._audioContext.currentTime) {
        this._gain.gain.linearRampToValueAtTime(gain, time)
    }
}
