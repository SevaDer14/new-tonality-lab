import type { TPartials, TSpectrumType } from "./types"
import { checkNumericParam, getAmplitude, setharesLoudness } from "./utils"
import { cloneDeep, round } from 'lodash-es'

export const generatePartials = ({ type, profile = 'harmonic', stretch = 1, edo = 12, fundamental = 440, number = 1000 }: { type: TSpectrumType, profile?: 'equal' | 'harmonic', stretch?: number, edo?: number, fundamental?: number, number?: number }): TPartials => {
    const partials = [] as TPartials

    const success = checkNumericParam({ param: number, condition: number > 0, integer: true }) && checkNumericParam({ param: fundamental, condition: fundamental > 0 })

    if (!success) {
        return partials
    }

    // TODO: untested with stretch
    if (type === 'harmonic') {
        for (let i = 1; i <= number; i++) {
            const amplitude = getAmplitude(profile, i)
            const frequency = round(fundamental * ((2 * stretch) ** Math.log2(i)), 10)
            const ratio = frequency / fundamental
            partials.push({ ratio: ratio, frequency: frequency, amplitude: amplitude, loudness: setharesLoudness(amplitude) })
        }
    }

    // TODO: untested
    if (type === 'edo') {
        for (let i = 1; i <= number; i++) {
            const amplitude = getAmplitude(profile, i)
            const frequency = fundamental * (2 * stretch) ** (Math.round(Math.log2(i) * edo) / edo)
            const ratio = frequency / fundamental
            partials.push({ ratio: ratio, frequency: frequency, amplitude: amplitude, loudness: setharesLoudness(amplitude) })
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



export const sumPartials = (...args: TPartials[]): TPartials => {
    const result = [] as TPartials
    const partialGroups = cloneDeep(args) as TPartials[]
    const allPartials = partialGroups.flatMap(partialGroup => partialGroup).sort((a, b) => a.frequency - b.frequency) as TPartials

    for (let i = 0; i < allPartials.length; i++) {
        if (result[result.length - 1] && allPartials[i].frequency === result[result.length - 1].frequency) {

            result[result.length - 1].amplitude += allPartials[i].amplitude
            result[result.length - 1].loudness = setharesLoudness(result[result.length - 1].amplitude)

        } else {
            result.push({ ...allPartials[i], ratio: i === 0 ? allPartials[i].ratio : allPartials[i].frequency / result[0].frequency })
        }
    }

    return result
}


// TODO: untested
export const combinePartials = (...args: TPartials[]): TPartials => {
    const result = [] as TPartials
    const partialGroups = cloneDeep(args) as TPartials[]
    const allPartials = partialGroups.flatMap(partialGroup => partialGroup).sort((a, b) => a.frequency - b.frequency) as TPartials

    for (let i = 0; i < allPartials.length; i++) {
        result.push({ ...allPartials[i], ratio: i === 0 ? allPartials[i].ratio : allPartials[i].frequency / result[0].frequency })
    }

    return result
}
