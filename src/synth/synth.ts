import type { Oscillator } from './oscillator'
import type { Spectrum } from './types'
import { Voice } from './voice'

type AdditiveSynthConstructorOptions = {
    spectrum: Spectrum
    audioContext: AudioContext
}

export class AdditiveSynth {
    private _audioContext: AudioContext
    private _spectrum: Spectrum
    private _voices = new Map<string, Voice>()
    private _masterGain: GainNode

    public constructor({ spectrum, audioContext }: AdditiveSynthConstructorOptions) {
        this._audioContext = audioContext
        this._spectrum = spectrum
        this._masterGain = this._audioContext.createGain()
        this._masterGain.connect(audioContext.destination)
    }

    public play({ pitch, velocity, voiceId }: { pitch: number; velocity: number; voiceId?: string }) {
        const voice =
            (voiceId && this._voices.get(voiceId)) ||
            new Voice({
                id: voiceId,
                spectrum: this._spectrum,
                audioContext: this._audioContext,
                destination: this._masterGain,
            })

        voice.play(pitch, velocity)
        if (!this._voices.has(voice.id)) this._voices.set(voice.id, voice)

        return voice
    }

    public release(voiceId: string, time = this._audioContext.currentTime) {
        const voice = this._voices.get(voiceId)
        if (!voice) return

        voice.release(time)
        this._voices.delete(voiceId)
    }

    public releaseAll(time = this._audioContext.currentTime) {
        this._voices.forEach((voice) => {
            voice.release(time)
        })
        this._voices.clear()
    }

    public getOscillators() {
        const oscillators = new Map<string, Oscillator[]>()

        this._voices.forEach((voice) => {
            oscillators.set(voice.id, voice.getOscillators())
        })

        return oscillators
    }

    public update(spectrum: Spectrum, voiceId?: string) {
        this._spectrum = spectrum

        if (voiceId) {
            const voice = this._voices.get(voiceId)
            if (voice) voice.update(this._spectrum)
            return
        }

        this._voices.forEach((voice) => {
            voice.update(this._spectrum)
        })
    }
}
