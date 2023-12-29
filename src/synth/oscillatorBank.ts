import { Oscillator } from './oscillator'
import type { Partial, PlayState, SpectralLayer } from './types'

type OscillatorConstructorArgs = SpectralLayer & {
    audioContext: AudioContext
    destination: GainNode
}

export class OscillatorBank {
    private _gain: GainNode
    private _state: PlayState
    private _pitch = 20
    private _oscillators: Oscillator[]
    private _audioContext: AudioContext

    public constructor({ partials, audioContext, destination }: OscillatorConstructorArgs) {
        this._audioContext = audioContext
        this._gain = this._audioContext.createGain()
        this.connect(destination)

        this._oscillators = this.buildOscillators(partials)
        this.setGain(1)
        this._state = 'ready'
    }

    public get gain() {
        return this._gain.gain.value
    }

    public get state() {
        return this._state
    }

    public get oscillators() {
        return this._oscillators
    }

    public oscillator(index: number): undefined | Oscillator {
        return this._oscillators[index]
    }

    public play(pitch: number, time = this._audioContext.currentTime) {
        if (this._state === 'used') return
        this._pitch = pitch

        for (let i = 0; i < this._oscillators.length; i++) {
            this._oscillators[i].play(this._pitch, time)
        }

        this._state = 'playing'
    }

    public stop(time = this._audioContext.currentTime) {
        for (let i = 0; i < this._oscillators.length; i++) {
            this._oscillators[i].stop(time)
        }
    }

    public update({ partials }: SpectralLayer) {
        const commonLength = Math.min(this._oscillators.length, partials.length)
        const difference = this._oscillators.length - partials.length

        for (let i = 0; i < commonLength; i++) {
            this._oscillators[i].update(partials[i])
        }

        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                this.removeOscillator(commonLength)
            }
        }

        if (difference < 0) {
            for (let i = 0; i < -difference; i++) {
                this.createOscillator(partials[commonLength + i])
            }
        }
    }

    public removeOscillator(index: number): Oscillator {
        const removedOscillator = this._oscillators.splice(index, 1)[0]

        removedOscillator.destroy()

        return removedOscillator
    }

    public createOscillator({ rate, amplitude, phase }: Partial) {
        const newOscillator = new Oscillator({
            rate,
            amplitude,
            phase,
            audioContext: this._audioContext,
            destination: this._gain,
        })

        if (this._state === 'playing') newOscillator.play(this._pitch)

        this._oscillators.push(newOscillator)
    }

    public setGain(value: number, currentTime = this._audioContext.currentTime) {
        this._gain.gain.linearRampToValueAtTime(value, currentTime)
    }

    public shiftRate(shift: number) {
        for (let i = 0; i < this._oscillators.length; i++) {
            const oscillator = this._oscillators[i]
            oscillator.setRate(oscillator.rate + shift)
        }
    }

    public destroy() {
        if (this._state === 'playing') {
            this.stop()
            this.disconnect()
        } else {
            this.disconnect()
        }
    }

    private connect(dest: AudioNode) {
        this._gain.connect(dest)
    }

    private disconnect() {
        this._gain.disconnect()
    }
    private buildOscillators(partials: Partial[]): Oscillator[] {
        const oscillators: Oscillator[] = []

        for (let i = 0; i < partials.length; i++) {
            oscillators.push(
                new Oscillator({
                    audioContext: this._audioContext,
                    destination: this._gain,
                    rate: partials[i].rate,
                    amplitude: partials[i].amplitude,
                    phase: partials[i].phase,
                })
            )
        }

        return oscillators
    }
}
