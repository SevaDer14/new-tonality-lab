import { changeFundamental, combinePartials } from "./spectrum"
import { deTrend, normalize } from "./utils"
import type { TDissonanceCurve, TPartials, TPlotCurve, TPlotPoint, TPointX } from "./types"


export const plomptLevitDissonance = ({ minLoudness, frequencyDifference, minFrequency }: { minLoudness: number, frequencyDifference: number, minFrequency: number }): number => {
    if (minLoudness === 0) return 0

    return minLoudness * (Math.exp((-0.84 * frequencyDifference) / (0.021 * minFrequency + 19)) - Math.exp((-1.38 * frequencyDifference) / (0.021 * minFrequency + 19)))
}



export const intrinsicDissonance = (partials: TPartials) => {
    let dissonance = 0

    for (let i = 0; i < partials.length; i++) {
        for (let j = i + 1; j < partials.length; j++) {
            dissonance += plomptLevitDissonance({
                minLoudness: Math.min(partials[i].loudness, partials[j].loudness),
                frequencyDifference: partials[j].frequency - partials[i].frequency,
                minFrequency: partials[i].frequency,
            })
        }
    }

    return dissonance
}




export const dissonanceCurve = (partials: TPartials): TDissonanceCurve => {
    const dissonanceCurve = [] as TPlotCurve
    const fundamental = partials[0].frequency
    const octave = { ratio: 2, Hz: 2 * fundamental, cents: 1200, }

    const pseudoOctave = { ratio: partials[1].ratio, Hz: partials[1].frequency - fundamental, cents: octave.cents * partials[1].ratio / octave.ratio, }
    const numberOfPoints = pseudoOctave.cents
    const step = { ratio: pseudoOctave.ratio / numberOfPoints, Hz: pseudoOctave.Hz / numberOfPoints, cents: pseudoOctave.cents / numberOfPoints, }

    for (let i = 0; i < numberOfPoints; i++) {
        const currentStep = {
            ratio: 1 + step.ratio * 1,
            Hz: fundamental + step.Hz * i,
            cents: step.cents * i,
        } as TPointX

        const sweepPartials = changeFundamental({ partials: partials, fundamental: currentStep.Hz })
        const combinedPartials = combinePartials(partials, sweepPartials)
        const dissonanceValue = intrinsicDissonance(combinedPartials)

        const dissonancePoint = { ...currentStep, value: dissonanceValue, } as TPlotPoint
        dissonanceCurve.push(dissonancePoint)
    }

    return { curve: normalize(deTrend(dissonanceCurve)), pseudoOctave: pseudoOctave }
}


