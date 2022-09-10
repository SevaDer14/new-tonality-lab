import type { TPartials, TPlotCurve } from "./types"



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



export const getAmplitude = (amplitudeProfile: 'equal' | 'harmonic', ratio: number) => {
    if (amplitudeProfile === "equal") {
        return 1
    }

    return 1 / ratio // --> defaults to harmonic profile
}



export const setharesLoudness = (amplitude: number): number => 0.25 * 2 ** Math.log10(2E8 * amplitude)



export const deTrend = (curve: TPlotCurve): TPlotCurve => {
    const result = [] as TPlotCurve

    const slope = (curve[-1].value - curve[0].value) / (curve[-1].cents)

    for (let i = 0; i < curve.length; i++) {
        const trendLineValue = slope * curve[i].cents + curve[0].value // --> ax + b equation of line going through first and last curve points
        const deTrendedValue = curve[i].value - trendLineValue
        result.push({ ...curve[i], value: deTrendedValue })
    }

    return result
}



export const normalize = (curve: TPlotCurve): TPlotCurve => {
    const result = [] as TPlotCurve

    const maxValue = curve.sort((a, b) => b.value - a.value)[0].value

    for (let i = 0; i < curve.length; i++) {
        result.push({ ...curve[i], value: curve[i].value / maxValue })
    }

    return result
}
