import { Oscillator } from './oscillator'
import type { Partial } from './partial'
import type { OscillatorAddress, PartialAddress, PlayState, SpectralLayer, Spectrum } from './types'

export type VoiceConstructorOptions = {
    id?: string
    spectrum: Spectrum
    audioContext: AudioContext
    destination: GainNode
}

export class Voice {
    private _id: string
    private _pitch = 20
    private _state: PlayState
    private _oscillators: Oscillator[]
    private _gain: GainNode
    private _audioContext: AudioContext

    public constructor({ id, spectrum, audioContext, destination }: VoiceConstructorOptions) {
        this._id = id || Math.random().toString(16)
        this._state = 'ready'
        this._audioContext = audioContext

        this._gain = this._audioContext.createGain()
        this.connect(destination)

        this._oscillators = this.buildOscillators(spectrum)
    }

    public get id() {
        return this._id
    }

    public get pitch() {
        return this._pitch
    }

    public get state() {
        return this._state
    }

    public get oscillators() {
        return this._oscillators
    }

    public play(pitch: number, velocity: number, time = this._audioContext.currentTime) {
        if (this._state === 'used') return
        this._pitch = pitch

        this.setGain(velocity)

        for (let i = 0; i < this._oscillators.length; i++) {
            this._oscillators[i].play(this._pitch, time)
        }

        this._state = 'playing'
    }

    public release(time = this._audioContext.currentTime) {
        for (let i = 0; i < this._oscillators.length; i++) {
            this._oscillators[i].release(time)
        }

        this._state = 'used'
        this.disconnect()
    }

    public get(address: OscillatorAddress & PartialAddress) {
        if (!address.oscIndex) return

        const oscillator = this._oscillators[address.oscIndex]

        if (!address.partialIndex) return oscillator

        return oscillator.partial(address.partialIndex)
    }

    public update(spectrum: Spectrum) {
        if (this._state === 'used') return

        const commonLength = Math.min(this._oscillators.length, spectrum.length)
        const difference = this._oscillators.length - spectrum.length

        for (let i = 0; i < commonLength; i++) {
            this._oscillators[i].update(spectrum[i])
        }

        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                this.removeOscillator(commonLength)
            }
        }

        if (difference < 0) {
            for (let i = 0; i < -difference; i++) {
                this.createOscillator(spectrum[commonLength + i])
            }
        }
    }

    public setGain(value: number, currentTime = this._audioContext.currentTime) {
        this._gain.gain.linearRampToValueAtTime(value, currentTime)
    }

    public getPartials() {
        const partials: Partial[] = []

        for (let i = 0; i < this._oscillators.length; i++) {
            partials.push(...this._oscillators[i].partials)
        }

        return partials
    }

    private removeOscillator(index: number) {
        const removedOscillator = this._oscillators.splice(index, 1)[0]

        removedOscillator.destroy()

        return removedOscillator
    }

    private connect(dest: AudioNode) {
        this._gain.connect(dest)
    }

    private disconnect() {
        this._gain.disconnect()
    }

    private buildOscillators(spectrum: Spectrum): Oscillator[] {
        const oscillators: Oscillator[] = []

        for (let i = 0; i < spectrum.length; i++) {
            this.createOscillator(spectrum[i], oscillators)
        }

        return oscillators
    }

    private createOscillator({ partials }: SpectralLayer, oscillators = this._oscillators) {
        const newOscillator = new Oscillator({
            partials,
            audioContext: this._audioContext,
            destination: this._gain,
        })

        if (this._state === 'playing') newOscillator.play(this._pitch)

        oscillators.push(newOscillator)
    }
}
