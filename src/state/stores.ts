import { derived, writable } from 'svelte/store'
import type { SpectralLayer, Spectrum } from '../synth'
import * as XenSpectrum from '../xentonality/spectrum'
import { createSynthSettings, type Layer } from './synthSettings'

export const boardSpan = writable(2)
export const synthSettings = createSynthSettings()

function getHarmonicSpectralLayer(layer: Layer): SpectralLayer {
    const { length, start, transposeTo, stretch, slope, amplitude } = layer.seed

    const rates = XenSpectrum.getHarmonicRates({ length, start, transposeTo })
    const stretchedRates = XenSpectrum.stretchRates({ rates, stretch })
    const withAmplitudes = XenSpectrum.attachReciprocalAmplitudes({ rates: stretchedRates, slope, amplitude })
    const partials = XenSpectrum.attachRandomPhases({ partials: withAmplitudes })

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

export const pitch = writable<number | null>(null)
