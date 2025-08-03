import type { Partial as SpectrumPartial } from 'new-tonality-web-synth'

const NORMALISATION_PRESSURE_UNIT = 2.8284271247461905

/**
 * The formula to calculate loudness from amplitude. The converstion to SPL (phons) is done according to Sethares in the appendix "How to Draw Dissonance Curves". The converstion to loudness is done according to https://sengpielaudio.com/calculatorSonephon.htm
 * @param {number} amplitude - the normalized peak value where 0.001 corresponds to SPL of 40 db or 1 sone and 1 to SPL of 100db and 64 sones. Normalisation is done for the simplicity of providing harmonic spectrum with amplitudes 1, 1/2, 1/3, ...
 */
export function getLoudness(amplitude: number): number {
    const rms = amplitude / Math.SQRT2
    const pressure = rms * NORMALISATION_PRESSURE_UNIT
    const referencePressure = 2e-5

    const phons = 20 * Math.log10(pressure / referencePressure)

    if (phons < 8) return 0
    if (phons < 40) return Math.pow(phons / 40, 2.86) - 0.005
    return Math.pow(2, (phons - 40) / 10)
}

/** Fitting parameters proposed by Sethares in the appendix "How to Draw Dissonance Curves" */
export const SETHARES_DISSONANCE_PARAMS = {
    s1: 0.021,
    s2: 19,
    b1: 3.5,
    b2: 5.75,
    x_star: 0.24,
}

export type SetharesDissonanceParams = Partial<typeof SETHARES_DISSONANCE_PARAMS>

/** The formula to calculate sensory dissoannce proposed by Sethares in the appendix "How to Draw Dissonance Curves" */
export function getPlompLeveltDissonance(partial1: SpectrumPartial, partial2: SpectrumPartial, params = SETHARES_DISSONANCE_PARAMS): number {
    if (partial1.rate === partial2.rate) return 0

    const minLoudness = Math.min(getLoudness(partial1.amplitude), getLoudness(partial2.amplitude))
    if (minLoudness <= 0) return 0

    const minFrequency = Math.min(partial1.rate, partial2.rate)
    const frequencyDifference = Math.abs(partial1.rate - partial2.rate)

    if (minFrequency <= 0) return 0

    const s = params.x_star / (params.s1 * minFrequency + params.s2)

    return minLoudness * (Math.exp(-1 * params.b1 * s * frequencyDifference) - Math.exp(-1 * params.b2 * s * frequencyDifference))
}

export function getIntrinsicDissonance(spectrum: SpectrumPartial[], params?: SetharesDissonanceParams) {
    let dissonance = 0

    for (let i = 0; i < spectrum.length; i++) {
        for (let j = i + 1; j < spectrum.length; j++) {
            const partial1 = spectrum[i]!
            const partial2 = spectrum[j]!

            dissonance += getPlompLeveltDissonance(partial1, partial2, { ...SETHARES_DISSONANCE_PARAMS, ...params })
        }
    }

    return dissonance
}

export function getSetharesDissonance(spectrum1: SpectrumPartial[], spectrum2: SpectrumPartial[], params?: SetharesDissonanceParams) {
    let dissonance = getIntrinsicDissonance(spectrum1, params) + getIntrinsicDissonance(spectrum2, params)

    for (let i = 0; i < spectrum1.length; i++) {
        for (let j = 0; j < spectrum2.length; j++) {
            const partial1 = spectrum1[i]!
            const partial2 = spectrum2[j]!

            dissonance += getPlompLeveltDissonance(partial1, partial2, { ...SETHARES_DISSONANCE_PARAMS, ...params })
        }
    }

    return dissonance
}

export function ratioToCents(ratio: number): number {
    return ratio > 0 ? 1200 * Math.log2(ratio) : 0
}

export function centsToRatio(cents: number): number {
    return Math.pow(2, cents / 1200)
}

export function transpose(partials: SpectrumPartial[], cents: number) {
    const result: SpectrumPartial[] = []

    for (const partial of partials) {
        result.push({
            rate: partial.rate * centsToRatio(cents),
            amplitude: partial.amplitude,
        })
    }

    return result
}
