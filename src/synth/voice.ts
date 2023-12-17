import { OscillatorBank } from './oscillatorBank'
import type { Oscillator } from './oscillator'
import type { OscillatorAddress, PartialAddress, PlayState, SpectralLayer, Spectrum } from './types'

type VoiceConstructorOptions = {
    id?: string
    spectrum: Spectrum
    audioContext: AudioContext
    destination: GainNode
}

export class Voice {
    private _id: string
    private _pitch = 20
    private _state: PlayState
    private _oscillatorBanks: OscillatorBank[]
    private _gain: GainNode
    private _audioContext: AudioContext

    public constructor({ id, spectrum, audioContext, destination }: VoiceConstructorOptions) {
        this._id = id || Math.random().toString(16)
        this._state = 'ready'
        this._audioContext = audioContext

        this._gain = this._audioContext.createGain()
        this.connect(destination)

        this._oscillatorBanks = this.buildOscillatorBanks(spectrum)
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

    public get oscillatorBanks() {
        return this._oscillatorBanks
    }

    public play(pitch: number, velocity: number, time = this._audioContext.currentTime) {
        if (this._state === 'used') return
        this._pitch = pitch

        this.setGain(velocity)

        for (let i = 0; i < this._oscillatorBanks.length; i++) {
            this._oscillatorBanks[i].play(this._pitch, time)
        }

        this._state = 'playing'
    }

    public release(time = this._audioContext.currentTime) {
        for (let i = 0; i < this._oscillatorBanks.length; i++) {
            this._oscillatorBanks[i].release(time)
        }

        this._state = 'used'
        this.disconnect()
    }

    public get(address: OscillatorAddress & PartialAddress) {
        if (!address.oscIndex) return

        const oscillatorBank = this._oscillatorBanks[address.oscIndex]

        if (!address.partialIndex) return oscillatorBank

        return oscillatorBank.oscillator(address.partialIndex)
    }

    public update(spectrum: Spectrum) {
        if (this._state === 'used') return

        const commonLength = Math.min(this._oscillatorBanks.length, spectrum.length)
        const difference = this._oscillatorBanks.length - spectrum.length

        for (let i = 0; i < commonLength; i++) {
            this._oscillatorBanks[i].update(spectrum[i])
        }

        if (difference > 0) {
            for (let i = 0; i < difference; i++) {
                this.removeOscillatorBank(commonLength)
            }
        }

        if (difference < 0) {
            for (let i = 0; i < -difference; i++) {
                this.createOscillatorBank(spectrum[commonLength + i])
            }
        }
    }

    public setGain(value: number, currentTime = this._audioContext.currentTime) {
        this._gain.gain.linearRampToValueAtTime(value, currentTime)
    }

    public getOscillators() {
        const partials: Oscillator[] = []

        for (let i = 0; i < this._oscillatorBanks.length; i++) {
            partials.push(...this._oscillatorBanks[i].oscillators)
        }

        return partials
    }

    private removeOscillatorBank(index: number) {
        const removedOscillatorBank = this._oscillatorBanks.splice(index, 1)[0]

        removedOscillatorBank.destroy()

        return removedOscillatorBank
    }

    private connect(dest: AudioNode) {
        this._gain.connect(dest)
    }

    private disconnect() {
        this._gain.disconnect()
    }

    private buildOscillatorBanks(spectrum: Spectrum): OscillatorBank[] {
        const oscillators: OscillatorBank[] = []

        for (let i = 0; i < spectrum.length; i++) {
            this.createOscillatorBank(spectrum[i], oscillators)
        }

        return oscillators
    }

    private createOscillatorBank({ partials }: SpectralLayer, oscillators = this._oscillatorBanks) {
        const newOscillator = new OscillatorBank({
            partials,
            audioContext: this._audioContext,
            destination: this._gain,
        })

        if (this._state === 'playing') newOscillator.play(this._pitch)

        oscillators.push(newOscillator)
    }
}
