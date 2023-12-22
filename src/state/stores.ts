import { derived, writable } from 'svelte/store'
import type { Spectrum } from '../synth'
import { tweak, type Tweak } from '../xentonality/spectrum'

export const spectrumTemplate = writable<Spectrum>([])
export const tweaks = writable<Tweak[]>([])

export const spectrum = derived([spectrumTemplate, tweaks], ([$spectrumTemplate, $tweaks]) => {
    const partials = tweak({ partials: $spectrumTemplate[0]?.partials, tweaks: $tweaks })
    const spectrum = [{ partials }]
    return spectrum
})

export const pitch = writable<number | null>(null)
export const masterGain = writable<number>(0.7)
