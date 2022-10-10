import { changeFundamental, combinePartials } from "./spectrum"
import { centsToRatio, detrend, normalize, ratioToCents } from "./utils"
import type { TDissonanceCurve, TPartials, TPlotCurve, TPlotPoint, TPointX } from "./types"


export const plompLeveltDissonance = ({ minLoudness, frequencyDifference, minFrequency }: { minLoudness: number, frequencyDifference: number, minFrequency: number }): number => {
    if (minLoudness === 0 || minFrequency === 0) return 0

    const coefficient = frequencyDifference / (0.021 * minFrequency + 19)

    return minLoudness * (Math.exp(-0.84 * coefficient) - Math.exp(-1.38 * coefficient))
}



export const intrinsicDissonance = (partials: TPartials) => {
    let dissonance = 0

    for (let i = 0; i < partials.length; i++) {
        for (let j = i + 1; j < partials.length; j++) {
            dissonance += plompLeveltDissonance({
                minLoudness: Math.min(partials[i].loudness, partials[j].loudness),
                frequencyDifference: partials[j].frequency - partials[i].frequency,
                minFrequency: partials[i].frequency,
            })
        }
    }

    return dissonance
}




export const calcDissonanceCurve = (partials: TPartials, points?: number): TDissonanceCurve => {
    const dissonanceCurve = [] as TPlotCurve
    const fundamental = partials[0].frequency

    const pseudoOctave = { ratio: partials[1].ratio, Hz: partials[1].frequency - fundamental, cents: ratioToCents(partials[1].ratio), }
    const numberOfPoints = points ? points - 1 : pseudoOctave.cents
    const sweepStep = { cents: points ? pseudoOctave.cents / (points - 1) : 1 }

    for (let i = 1; i < numberOfPoints; i++) {
        const currentStep = {} as TPointX
        currentStep.cents = sweepStep.cents * i
        currentStep.ratio = centsToRatio(currentStep.cents)
        currentStep.Hz = fundamental * currentStep.ratio

        const sweepPartials = changeFundamental({ partials: partials, fundamental: currentStep.Hz })
        const combinedPartials = combinePartials(partials, sweepPartials)
        const dissonanceValue = intrinsicDissonance(combinedPartials)

        const dissonancePoint = { ...currentStep, value: dissonanceValue, } as TPlotPoint
        dissonanceCurve.push(dissonancePoint)
    }

    // first and last steps where all partials coinside have sudden frop in dissonance value due to calculation optimisation
    // so final dissonance curve excludes them
    const correctedDissonanceCurve = normalize(detrend(dissonanceCurve))

    return { curve: correctedDissonanceCurve, pseudoOctave: pseudoOctave }
}
