import { derived, writable } from 'svelte/store'
import type { Partial, SpectralLayer, Spectrum } from '../synth'
import * as XenSpectrum from '../xentonality/spectrum'
import { createSynthSettings, type Layer } from './synthSettings'
import type { Pitch } from '../synth/synth'
import { getTuning, type Tuning } from '../xentonality/tuning.js'
import { getAllPartials } from '../xentonality/spectrum.js'

export const boardSpan = writable(2)
export const sampleDuration = writable(10)
export const sampleFundamental = writable(440)
export const synthSettings = createSynthSettings()
export const pitches = writable<Pitch[]>([])
export const spectrumViewType = writable<'audible' | 'seed'>('seed')
export const presetName = writable('sample')

function getHarmonicSpectralLayer(layer: Layer): SpectralLayer {
    const { length, start, transpose, stretch, slope, amplitude } = layer.seed

    const rates = XenSpectrum.getHarmonicRates({ length, start })
    const stretchedRates = XenSpectrum.stretchRates({ rates, stretch })
    const withAmplitudes = XenSpectrum.attachReciprocalAmplitudes({ rates: stretchedRates, slope, amplitude })
    const transposed = XenSpectrum.transpose({ partials: withAmplitudes, ratio: transpose })
    const partials = XenSpectrum.attachRandomPhases({ partials: transposed })

    if (!layer.tweaks.enabled) return { partials }

    const tweakedPartials = XenSpectrum.tweak({ partials, tweaks: layer.tweaks.value })

    return { partials: tweakedPartials }
}

export const spectrum = derived([synthSettings], ([$synthSettings]) => {
    const newSpectrum = $synthSettings.layers
        .map((layer) => {
            if (layer.type === 'harmonic') {
                return getHarmonicSpectralLayer(layer)
            }

            return null
        })
        .filter((spectralLayer) => spectralLayer !== null) as Spectrum

    return newSpectrum
})

export const tuning = derived([spectrum], ([$spectrum]) => {
    const partials = getAllPartials($spectrum)
    return getTuning(partials)
})

export const audiblePartials = derived([spectrum, pitches], ([$spectrum, $pitches]) => {
    const partials = XenSpectrum.getAllPartials($spectrum)
    const allPartials: Partial[][] = []

    $pitches.forEach((pitch) => {
        if (pitch.keyRatio) allPartials.push(XenSpectrum.transpose({ partials, ratio: pitch.keyRatio }))
    })

    return allPartials.flat().sort((a, b) => a.rate - b.rate) as Partial[]
})
