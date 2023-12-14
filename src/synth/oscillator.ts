import { Partial } from './partial'
import type { PartialArgs, PlayState, SpectralLayer } from './types'

type OscillatorConstructorArgs = SpectralLayer & {
    audioContext: AudioContext
    destination: GainNode
}

export class Oscillator {
    private _gain: GainNode
    private _state: PlayState
    private _pitch = 20
    private _partials: Partial[]
    private _audioContext: AudioContext

    public constructor({ partials, audioContext, destination }: OscillatorConstructorArgs) {
        this._audioContext = audioContext
        this._gain = this._audioContext.createGain()
        this.connect(destination)

        this._partials = this.buildPartials(partials)
        this.setGain(1)
        this._state = 'ready'
    }

    public get gain() {
        return this._gain.gain.value
    }

    public get state() {
        return this._state
    }

    public get partials() {
        return this._partials
    }

    public partial(index: number): undefined | Partial {
        return this._partials[index]
    }

    public play(pitch: number, time = this._audioContext.currentTime) {
        if (this._state === 'used') return
        this._pitch = pitch

        for (let i = 0; i < this._partials.length; i++) {
            this._partials[i].play(this._pitch, time)
        }

        this._state = 'playing'
    }

    public release(time = this._audioContext.currentTime) {
        for (let i = 0; i < this._partials.length; i++) {
            this._partials[i].release(time)
        }

        this.disconnect()
    }

    public update({ partials }: SpectralLayer) {
        const commonLength = Math.min(this._partials.length, partials.length)
        const difference = this._partials.length - partials.length

        for (let i = 0; i < commonLength; i++) {
            this._partials[i].update(partials[i])
        }

        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                this.removePartial(commonLength)
            }
        }

        if (difference < 0) {
            for (let i = 0; i < -difference; i++) {
                this.createPartial(partials[commonLength + i])
            }
        }
    }

    public removePartial(index: number): Partial {
        const removedPartial = this._partials.splice(index, 1)[0]

        removedPartial.destroy()

        return removedPartial
    }

    public createPartial({ rate, amplitude, phase }: PartialArgs) {
        const newPartial = new Partial({
            rate,
            amplitude,
            phase,
            audioContext: this._audioContext,
            destination: this._gain,
        })

        if (this._state === 'playing') newPartial.play(this._pitch)

        this._partials.push(newPartial)
    }

    public setGain(value: number, currentTime = this._audioContext.currentTime) {
        this._gain.gain.linearRampToValueAtTime(value, currentTime)
    }

    public shiftRate(shift: number) {
        for (let i = 0; i < this._partials.length; i++) {
            const partial = this._partials[i]
            partial.setRate(partial.rate + shift)
        }
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
    }
    private buildPartials(partialArgs: PartialArgs[]): Partial[] {
        const partials: Partial[] = []

        for (let i = 0; i < partialArgs.length; i++) {
            partials.push(
                new Partial({
                    audioContext: this._audioContext,
                    destination: this._gain,
                    rate: partialArgs[i].rate,
                    amplitude: partialArgs[i].amplitude,
                    phase: partialArgs[i].phase,
                })
            )
        }

        return partials
    }
}
