import { round } from "lodash"
import { PointSeries } from "./pointSeries"
import { PRECISION, Spectrum } from "./partials"

export type DissonanceCurveOptions = {
    sweepSpectrum?: Spectrum,
    min?: number,
    max?: number,
}

// UNTESTED
export const calcDissonanceCurve = (spectrum: Spectrum, fundamental: number, { sweepSpectrum, min = 1, max = 2 }: DissonanceCurveOptions): PointSeries => {
    const dissonanceCurve = new PointSeries()
    const pointDensity = 1000
    const step = 1 / pointDensity
    const numberOfPoints = (max - min) / step

    const sweep = sweepSpectrum ? new Spectrum(sweepSpectrum.partials) : new Spectrum(spectrum.partials)
    const stationary = new Spectrum(spectrum.partials).shift(fundamental)

    for (let i = 0; i < numberOfPoints; i++) {
        const currentStep = step * i + 1
        sweep.shift(fundamental * currentStep)

        const dissonanceValue = calcDissonance(stationary, sweep)

        dissonanceCurve.push([currentStep, dissonanceValue])
    }

    dissonanceCurve.normalize()

    return dissonanceCurve
}

// UNTESTED
export const calcDissonance = (stationary: Spectrum, sweep: Spectrum): number => {
    const stationaryPartials = stationary.partials
    const sweepPartials = sweep.partials
    let dissonance = 0

    for (let i = 0; i < stationaryPartials.length; i++) {
        for (let j = i + 1; j < sweepPartials.length; j++) {
            const minLoudness = setharesLoudness(Math.min(stationaryPartials[i][1], sweepPartials[j][1]))

            dissonance += plompLeveltDissonance({
                minLoudness: minLoudness,
                frequencyDifference: sweepPartials[j][0] - stationaryPartials[i][0],
                minFrequency: stationaryPartials[i][0],
            })
        }
    }

    return round(dissonance, PRECISION)
}

// UNTESTED
export const plompLeveltDissonance = ({ minLoudness, frequencyDifference, minFrequency, }: { minLoudness: number, frequencyDifference: number, minFrequency: number }): number => {
    if (minLoudness === 0 || minFrequency === 0 || frequencyDifference === 0) return 0
    const coefficient = frequencyDifference / (0.021 * minFrequency + 19)

    return minLoudness * (Math.exp(-0.84 * coefficient) - Math.exp(-1.38 * coefficient))
}

// UNTESTED
export const setharesLoudness = (amplitude: number): number => round(0.25 * 2 ** Math.log10(2E8 * amplitude), PRECISION)
