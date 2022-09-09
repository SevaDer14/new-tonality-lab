import type { TSpectrum } from "./xentonality"

export interface ICheckNumericParam {
    param: number | undefined
    lowerBound?: number
    higherBound?: number
    fallbackValue?: number
    integer?: boolean
}
export const checkNumericParam = ({ param, integer = false, lowerBound, higherBound, fallbackValue }: ICheckNumericParam): number | undefined => {
    if (param === undefined) {
        return fallbackValue
    }
    if (integer && param.toFixed(0) !== param.toString()) {
        console.warn(`ParamNotInteger: In checkNumericParam, param has value ${param}, while integer flag is ${integer}! Return undefined`)
        return undefined
    }
    if (lowerBound !== undefined && param < lowerBound) {
        console.warn(`LowerBoundViolation: In checkNumericParam, param has value ${param}, while min possible value is ${lowerBound}! Return undefined`)
        return undefined
    }
    if (higherBound !== undefined && param > higherBound) {
        console.warn(`HigherBoundViolation: In checkNumericParam, param has value ${param}, while max possible value is ${higherBound}! Return undefined`)
        return undefined
    }

    return param
}

export interface ICheckSpectrum {
    spectrum: TSpectrum
    freqCondition?: (frequency: number) => boolean
    ampCondition?: (amplitude: number) => boolean
}
export const checkSpectrum = ({ spectrum, freqCondition, ampCondition }: ICheckSpectrum): TSpectrum | undefined => {
    if (ampCondition && [...spectrum.entries()].some(([freq, amp]) => ampCondition(amp))) {
        console.warn(`AmplitudeConditionNotSatisfied: In checkSpectrum, one of the amplitudes did not satisfy provided condition! Amplidudes: ${[...spectrum.values()]}`)
        return undefined
    }
    if (freqCondition && [...spectrum.entries()].some(([freq, amp]) => freqCondition(freq))) {
        console.warn(`FrequencyConditionNotSatisfied: In checkSpectrum, one of the frequencies did not satisfy provided condition! Frequencies: ${[...spectrum.keys()]}`)
        return undefined
    }

    return spectrum
}
