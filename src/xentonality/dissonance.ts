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

    const pseudoOctave = partials.length > 1 
    ? {
        ratio: partials[1].ratio,
        Hz: partials[1].frequency - fundamental,
        cents: ratioToCents(partials[1].ratio),
    }
    : {
        ratio: 2,
        Hz: fundamental,
        cents: 1200,
    }

    const numberOfPoints = points ? points : Math.round(pseudoOctave.cents) + 1
    const sweepStep = { cents: points ? pseudoOctave.cents / (points - 1) : 1 }


    for (let i = 0; i < numberOfPoints; i++) {
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

    const correctedDissonanceCurve = normalize(detrend(dissonanceCurve))

    return { curve: correctedDissonanceCurve, pseudoOctave: pseudoOctave }
}
