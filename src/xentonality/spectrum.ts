import type { TPartials, TSpectrumType } from "./types"
import { centsToRatio, checkNumericParam, getAmplitude, setharesLoudness } from "./utils"
import { cloneDeep, round } from 'lodash-es'

export const generatePartials = ({ type, slope = 0, pseudoOctave = 1200, edo = 12, fundamental = 440, number = 100 }: { type: TSpectrumType, slope?: number, pseudoOctave?: number, edo?: number, fundamental?: number, number?: number }): TPartials => {
    const partials = [] as TPartials

    const success = checkNumericParam({ param: number, condition: number > 0, integer: true }) && checkNumericParam({ param: fundamental, condition: fundamental > 0 })
    const pseudoOctaveRatio = centsToRatio(pseudoOctave)

    if (!success) {
        return partials
    }

    if (type === 'harmonic') {
        for (let i = 1; i <= number; i++) {
            const frequency = round(fundamental * (pseudoOctaveRatio ** Math.log2(i)), 10)
            const ratio = frequency / fundamental
            const amplitude = getAmplitude(slope, ratio)
            partials.push({ ratio: ratio, frequency: frequency, amplitude: amplitude, loudness: setharesLoudness(amplitude) })
        }
    }

    if (type === 'edo') {
        let iteration = 1
        while (partials.length < number) {
            const frequency = fundamental * (pseudoOctaveRatio ** (Math.round(Math.log2(iteration) * edo) / edo))
            if (frequency !== partials[partials.length - 1]?.frequency) {
                const ratio = frequency / fundamental
                const amplitude = getAmplitude(slope, ratio)
                partials.push({ ratio: ratio, frequency: frequency, amplitude: amplitude, loudness: setharesLoudness(amplitude) })
            }
            iteration++
        }
    }

    return partials
}



export const changeFundamental = ({ partials, fundamental }: { partials: TPartials, fundamental: number }): TPartials => {
    const newPartials = [] as TPartials

    const success = checkNumericParam({ param: fundamental, condition: fundamental > 0 })

    if (!success) {
        return newPartials
    }

    for (let i = 0; i < partials.length; i++) {
        newPartials.push({ ...partials[i], frequency: partials[i].ratio * fundamental })
    }

    return newPartials
}



export const sumPartials = (...spectrums: TPartials[]): TPartials => {
    const result = [] as TPartials
    const partials = cloneDeep(spectrums)
    const allPartials = partials.flat().sort((a, b) => a.frequency - b.frequency) as TPartials

    if (allPartials.length === 0) {
        return result
    }

    result[0] = allPartials[0]
    const fundamental = result[0].frequency

    for (let i = 1; i < allPartials.length; i++) {
        if (result[result.length - 1] && allPartials[i].frequency === result[result.length - 1].frequency) {
            const summedAmplitude = result[result.length - 1].amplitude + allPartials[i].amplitude

            result[result.length - 1].amplitude = summedAmplitude
            result[result.length - 1].loudness = setharesLoudness(summedAmplitude)
        } else {
            result.push({
                ...allPartials[i],
                ratio: allPartials[i].frequency / fundamental,
            })
        }
    }

    return result
}



export const combinePartials = (...spectrums: TPartials[]): TPartials => {
    const result = [] as TPartials
    const partials = cloneDeep(spectrums)
    const allPartials = partials.flat().sort((a, b) => a.frequency - b.frequency) as TPartials

    if (allPartials.length === 0) {
        return result
    }

    result[0] = { ...allPartials[0], ratio: 1 } // TODO: non tested setting ratio of first to 1 do the same for sum partials
    const fundamental = result[0].frequency

    for (let i = 1; i < allPartials.length; i++) {

        result[i] = {
            ...allPartials[i],
            ratio: allPartials[i].frequency / fundamental,
        }
    }

    return result
}
