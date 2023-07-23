import { Keyboard, type KeyboardKey } from "./keyboard"
import { OscillatorBank } from "./oscillatorBank"
import type { Spectrum } from "./spectrum"
import { Tuning } from "./tuning"

export type Note = {
    frequency: number,
    ratio: string,
}


export type AdditiveSynthConstructorOptions = {
    spectrum: Spectrum,
    audioContext: AudioContext,
    voices?: number,
}

export class AdditiveSynth {
    private _voices
    private _oscillatorBanks: OscillatorBank[]
    private _tuning: Tuning
    private _baseFrequency = 130.815
    private _keyboard: Keyboard
    private _isPaying: Map<KeyboardKey, Note & { oscillatorIndex: number }> = new Map([])

    public constructor({ spectrum, audioContext, voices = 6 }: AdditiveSynthConstructorOptions) {
        this._voices = voices

        this._tuning = new Tuning(spectrum.partials)

        this._oscillatorBanks = []

        for (let i = 0; i < voices; i++) {
            this._oscillatorBanks[i] = new OscillatorBank({
                partials: spectrum.partials,
                audioContext,
            });

        }

        this._keyboard = new Keyboard(this._tuning, this._baseFrequency)
    }

    play(key: KeyboardKey) {
        const note = this._keyboard.keys.get(key)

        if (note === undefined) throw new Error("Cannot play unknown key")

        if (this._isPaying.get(key) !== undefined) return

        for (let i = 0; i < this._oscillatorBanks.length; i++) {
            if (this._oscillatorBanks[i].isPlaying === false) {
                this._oscillatorBanks[i].play(note.frequency)

                this._isPaying.set(key, { ...note, oscillatorIndex: i })
                return
            }
        }
    }

    release(key: KeyboardKey) {
        const note = this._isPaying.get(key)
        if (note === undefined) throw new Error("Cannot release key that is not pressed")

        this._oscillatorBanks[note.oscillatorIndex].stop()
        this._isPaying.delete(key)
    }

    update(spectrum: Spectrum) {
        this._tuning.update(spectrum.partials)
        this._oscillatorBanks.forEach(bank => bank.updatePartials(spectrum.partials))
        this._keyboard.update(this._tuning, this._baseFrequency)
    }
}
