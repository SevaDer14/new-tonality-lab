import { changeFundamental, combinePartials } from "./spectrum"
import { detrend, normalize } from "./utils"
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




export const dissonanceCurve = (partials: TPartials, points?: number): TDissonanceCurve => {
    const dissonanceCurve = [] as TPlotCurve
    const fundamental = partials[0].frequency
    const octave = { ratio: 2, Hz: 2 * fundamental, cents: 1200, }

    const pseudoOctave = { ratio: partials[1].ratio, Hz: partials[1].frequency - fundamental, cents: octave.cents * partials[1].ratio / octave.ratio, }
    const numberOfPoints = points ? points : pseudoOctave.cents
    const sweepStep = { cents: points ? pseudoOctave.cents / (numberOfPoints - 1) : 1 }

    for (let i = 0; i < numberOfPoints; i++) {
        // eslint-disable-next-line prefer-const
        let currentStep = {} as TPointX
        currentStep.cents = sweepStep.cents * i
        currentStep.ratio = 2 ** (currentStep.cents / 1200)
        currentStep.Hz = fundamental * currentStep.ratio

        const sweepPartials = changeFundamental({ partials: partials, fundamental: currentStep.Hz })
        const combinedPartials = combinePartials(partials, sweepPartials)
        const dissonanceValue = intrinsicDissonance(combinedPartials)

        const dissonancePoint = { ...currentStep, value: dissonanceValue, } as TPlotPoint
        dissonanceCurve.push(dissonancePoint)
    }

    return { curve: normalize(detrend(dissonanceCurve)), pseudoOctave: pseudoOctave }
}


