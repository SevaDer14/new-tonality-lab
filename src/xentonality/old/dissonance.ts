import { changeFundamental, combinePartials, generatePartials } from "./spectrum"
import { centsToRatio, detrend, isPowerOfNumber, normalize, ratioToCents, withinLimit } from "./utils"
import type { TDissonanceCurve, TDissonanceCurveOptions, TDissonanceCurveMultipleOctavesOptions, TPartials, TPlotCurve, TPlotPoint, TPointX } from "./types"


// export const plompLeveltDissonance = ({ minLoudness, frequencyDifference, minFrequency, }: { minLoudness: number, frequencyDifference: number, minFrequency: number }): number => {
//     if (minLoudness === 0 || minFrequency === 0 || frequencyDifference === 0) return 0
//     const coefficient = frequencyDifference / (0.021 * minFrequency + 19)

//     return minLoudness * (Math.exp(-0.84 * coefficient) - Math.exp(-1.38 * coefficient))
// }



// export const intrinsicDissonance = (partials: TPartials) => {
//     let dissonance = 0

//     for (let i = 0; i < partials.length; i++) {
//         for (let j = i + 1; j < partials.length; j++) {
//             dissonance += plompLeveltDissonance({
//                 minLoudness: Math.min(partials[i].loudness, partials[j].loudness),
//                 frequencyDifference: partials[j].frequency - partials[i].frequency,
//                 minFrequency: partials[i].frequency,
//             })
//         }
//     }

//     return dissonance
// }


// TODO non tested
// export const calcDissonanceCurve = ({ partials, numberOfPoints, sweepStep, startPoint, detrended = true, normalized = true, sweepType = 'same', sweepHarmonicPartials = 6 }: TDissonanceCurveOptions): TPlotCurve => {
//     const dissonanceCurve = [] as TPlotCurve
//     const fundamental = partials[0].frequency
//     const sweepSpectrum = sweepType === 'same' ? [...partials] : generatePartials({ type: 'harmonic', fundamental: fundamental, number: sweepHarmonicPartials, slope: 1 })

//     for (let i = 0; i < numberOfPoints; i++) {
//         const currentStep = {} as TPointX
//         currentStep.cents = startPoint.cents + sweepStep.cents * i
//         currentStep.ratio = centsToRatio(currentStep.cents)
//         currentStep.Hz = fundamental * currentStep.ratio

//         const sweepPartials = changeFundamental({ partials: sweepSpectrum, fundamental: currentStep.Hz })
//         const combinedPartials = combinePartials(partials, sweepPartials)
//         const dissonanceValue = intrinsicDissonance(combinedPartials)

//         const dissonancePoint = { ...currentStep, value: dissonanceValue, } as TPlotPoint
//         dissonanceCurve.push(dissonancePoint)
//     }

//     if (detrended === true && normalized === true) return normalize(detrend(dissonanceCurve))
//     if (detrended === true && normalized === false) return detrend(dissonanceCurve)
//     if (detrended === false && normalized === true) return normalize(dissonanceCurve)

//     return dissonanceCurve
// }


// TODO non tested
export const calcDissonanceCurveMultipleOctaves = ({ partials, octaves, pseudoOctave, points, limits, ...props }: TDissonanceCurveMultipleOctavesOptions): TDissonanceCurve => {
    const dissonanceCurve = [] as TPlotCurve
    const fundamental = partials[0].frequency

    const partialsWithinLimits = combinePartials(
        partials.filter(
            ({ amplitude, frequency }, index) =>
                withinLimit({ value: amplitude, limits: limits?.amplitude }) &&
                withinLimit({ value: frequency, limits: limits?.frequency }) &&
                withinLimit({ value: index + 1, limits: limits?.index })
        )
    )

    pseudoOctave = pseudoOctave || (partialsWithinLimits.length > 1
        ? {
            ratio: partialsWithinLimits[1].ratio,
            Hz: partialsWithinLimits[1].frequency - fundamental,
            cents: ratioToCents(partialsWithinLimits[1].ratio),
        }
        : {
            ratio: 2,
            Hz: fundamental,
            cents: 1200,
        })
        
    const numberOfPoints = points ? points : Math.round(pseudoOctave.cents) + 1
    const sweepStep = { cents: points ? pseudoOctave.cents / (points - 1) : 1 }
    const highestRatio = partialsWithinLimits.length > 1 ? partialsWithinLimits[partialsWithinLimits.length - 1].ratio : pseudoOctave.ratio
    // TODO refactor
    const spectrumOctaveRange = octaves
        ? octaves[1] - 1
        : Math.ceil(Math.log(highestRatio) / Math.log(pseudoOctave.ratio)) + (isPowerOfNumber(highestRatio, pseudoOctave.ratio) ? 1 : 0)

    for (let i = 0; i <= spectrumOctaveRange; i++) {
        // TODO refactor
        const roughStartPointCents = Math.ceil(i * pseudoOctave.cents + (octaves ? octaves[0] : -1) * pseudoOctave.cents)
        const startPoint = {
            cents: roughStartPointCents === 0 ? roughStartPointCents : roughStartPointCents < 0 ? roughStartPointCents - 1 : roughStartPointCents + 1
        }

        dissonanceCurve.push(...calcDissonanceCurve({
            partials: partialsWithinLimits,
            numberOfPoints: numberOfPoints,
            sweepStep: sweepStep,
            startPoint: startPoint,
            normalized: false,
            ...props,
        }))
    }

    return { curve: normalize(dissonanceCurve), pseudoOctave: pseudoOctave }
}

// export const setharesLoudness = (amplitude: number): number => 0.25 * 2 ** Math.log10(2E8 * amplitude)



// export const detrend = (curve: TPlotCurve): TPlotCurve => {
//     const result = [] as TPlotCurve

//     const slope = (curve[curve.length - 1].value - curve[0].value) / (curve[curve.length - 1].ratio - curve[0].ratio)

//     for (let i = 0; i < curve.length; i++) {
//         const trendLineValue = slope * (curve[i].ratio - curve[0].ratio) + curve[0].value // --> a(x - x0) + b equation of line going through first and last curve points
//         const detrendedValue = curve[i].value - trendLineValue
//         result.push({ ...curve[i], value: round(detrendedValue, 15) })
//     }

//     return result
// }



// export const normalize = (curve: TPlotCurve): TPlotCurve => {
//     const result = [] as TPlotCurve

//     const mainExtremum = curve.reduce((a, b) => { return Math.abs(a.value) > Math.abs(b.value) ? a : b });

//     for (let i = 0; i < curve.length; i++) {
//         result.push({ ...curve[i], value: round(curve[i].value / Math.abs(mainExtremum.value), 15) })
//     }

//     return result
// }