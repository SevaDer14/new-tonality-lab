import type { TPartials, TPlotCurve } from "./types"
import type { AdditiveSynth } from "./synth";

import { round } from 'lodash-es';


export const ratioToCents = (ratio: number): number => {
    return ratio > 0 ? 1200 * Math.log2(ratio) : 0
}


export const centsToRatio = (cents: number): number => {
    return 2 ** (cents / 1200)
}

// rethink error handling
export const checkNumericParam = ({ param, integer = false, condition }: { param: number, integer?: boolean, condition?: boolean }): boolean => {
    let success = true

    if (integer && param.toFixed(0) !== param.toString()) {
        console.error(`ParamNotInteger: In checkNumericParam, param has value ${param}, while integer flag is ${integer}! Success = false`)
        success = false
    }
    if (!condition) {
        console.error(`ConditionViolation: In checkNumericParam, param value ${param} do not satisfy provided condition! Success = false`)
        success = false
    }

    return success
}


// rethink error handling
export const checkPartials = ({ partials, freqCondition, ampCondition }: { partials: TPartials, freqCondition?: (frequency: number) => boolean, ampCondition?: (amplitude: number) => boolean }): boolean => {
    let success = true

    if (ampCondition && partials.every(({ amplitude }) => ampCondition(amplitude))) {
        console.error(`AmplitudeConditionNotSatisfied: In checkSpectrum, one of the amplitudes did not satisfy provided condition! Success = false`)
        success = false
    }
    if (freqCondition && partials.every(({ frequency }) => freqCondition(frequency))) {
        console.error(`FrequencyConditionNotSatisfied: In checkSpectrum, one of the frequencies did not satisfy provided condition! Success = false`)
        success = false
    }

    return success
}


export const withinLimit = ({ value, limits }: { value: number, limits?: { min?: number, max?: number } }) => {
    if (limits === undefined) return true

    const satisfiesMinLimit = limits.min ? value >= limits.min : true
    const satisfiesMaxLimit = limits.max ? value <= limits.max : true

    return satisfiesMinLimit && satisfiesMaxLimit
}

// TODO: Untested
export const getAmplitude = (slope: number, ratio: number, ) => {
    return ratio < 1 ? 0 : slope === 0 ? 1 : ratio ** (-slope)
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

export const rowToString = (row: Array<number | string>) => {
    if (row.length === 0) return ""

    let result = `${row[0]}`

    for (let i = 1; i < row.length; i += 1) {
        result += `\t${row[i]}`
    }

    return result
}

export const parseCurveToFileFormat = (curve: { [key: string]: number }[]) => {
    if (curve.length === 0) return ""

    const headerRow = rowToString(Object.keys(curve[0]))
    const rows = [headerRow]

    for (let i = 0; i < curve.length; i += 1) {
        rows.push(rowToString(Object.values(curve[i])))
    }

    return rows.join('\n')
}

// Not Used, can be baseline for recording user performance
export const recordSample = ({ synth, audioContext, recorderNode, duration }: { synth: AdditiveSynth, audioContext: AudioContext, recorderNode: MediaStreamAudioDestinationNode, duration: number }): Promise<Blob> | undefined => {
    const recorder = new MediaRecorder(recorderNode.stream)

    const recording = new Promise<Blob>((resolve) => {
        setTimeout(() => {
            recorder.stop()
            synth.stop()
            synth.disconnect()
            synth.connect(audioContext.destination)
        }, duration)

        recorder.ondataavailable = (e) => {
            resolve(new Blob([e.data], { type: 'audio/wav; codecs=MS_PCM' }))
        }
    })

    synth.disconnect()
    synth.connect(recorderNode)

    synth.start()
    recorder.start()

    return recording
}

// TODO untested
export const isPowerOfNumber = (number: number, base: number): boolean => {
    if (number - 1 < 0.001) {
        return true;
    };
    if (number % base !== 0) {
        return false;
    }
    return isPowerOfNumber(number / base, base);
}
