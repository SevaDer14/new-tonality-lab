import type { TPartials, TPlotCurve } from "./types"
import { round } from 'lodash-es';

// TODO: Untested
export const ratioToCents = (ratio: number): number => {
    return 1200 * Math.log2(ratio)
}
// TODO: Untested
export const centsToRatio = (cents: number): number => {
    return 2 ** (cents / 1200)
}

export const checkNumericParam = ({ param, integer = false, condition }: { param: number, integer?: boolean, condition?: boolean }): boolean => {
    let success = true

    if (integer && param.toFixed(0) !== param.toString()) {
        console.warn(`ParamNotInteger: In checkNumericParam, param has value ${param}, while integer flag is ${integer}! Success = false`)
        success = false
    }
    if (!condition) {
        console.warn(`ConditionViolation: In checkNumericParam, param value ${param} do not satisfy provided condition! Success = false`)
        success = false
    }

    return success
}



export const checkPartials = ({ partials, freqCondition, ampCondition }: { partials: TPartials, freqCondition?: (frequency: number) => boolean, ampCondition?: (amplitude: number) => boolean }): boolean => {
    let success = true

    if (ampCondition && partials.every(({ amplitude }) => ampCondition(amplitude))) {
        console.warn(`AmplitudeConditionNotSatisfied: In checkSpectrum, one of the amplitudes did not satisfy provided condition! Success = false`)
        success = false
    }
    if (freqCondition && partials.every(({ frequency }) => freqCondition(frequency))) {
        console.warn(`FrequencyConditionNotSatisfied: In checkSpectrum, one of the frequencies did not satisfy provided condition! Success = false`)
        success = false
    }

    return success
}



export const getAmplitude = (profile: 'equal' | 'harmonic', ratio: number) => {
    if (profile === "equal") {
        return ratio >= 1 ? 1 : 0
    }

    return ratio >= 1 ? 1 / ratio : 0 // --> defaults to harmonic profile
}



export const setharesLoudness = (amplitude: number): number => 0.25 * 2 ** Math.log10(2E8 * amplitude)



export const detrend = (curve: TPlotCurve): TPlotCurve => {
    const result = [] as TPlotCurve

    const slope = (curve[curve.length - 1].value - curve[0].value) / (curve[curve.length - 1].ratio - curve[0].ratio)

    for (let i = 0; i < curve.length; i++) {
        const trendLineValue = slope * (curve[i].ratio - curve[0].ratio) + curve[0].value // --> a(x - x0) + b equation of line going through first and last curve points
        const detrendedValue = curve[i].value - trendLineValue
        result.push({ ...curve[i], value: round(detrendedValue, 15) })
    }

    return result
}



export const normalize = (curve: TPlotCurve): TPlotCurve => {
    const result = [] as TPlotCurve

    const mainExtremum = curve.reduce((a, b) => { return Math.abs(a.value) > Math.abs(b.value) ? a : b });

    for (let i = 0; i < curve.length; i++) {
        result.push({ ...curve[i], value: round(curve[i].value / Math.abs(mainExtremum.value), 15) })
    }

    return result
}
