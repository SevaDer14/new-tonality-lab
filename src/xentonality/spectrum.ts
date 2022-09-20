import type { TPartials } from "./types"
import { checkNumericParam, getAmplitude, setharesLoudness } from "./utils"
import cloneDeep from 'lodash-ts/cloneDeep'

export const generatePartials = ({ type, profile = 'harmonic', fundamental = 440, number = 1000 }: { type: 'harmonic', profile?: 'equal' | 'harmonic', fundamental?: number, number?: number }): TPartials => {
    const partials = [] as TPartials

    const success = checkNumericParam({ param: number, condition: number > 0, integer: true }) && checkNumericParam({ param: fundamental, condition: fundamental > 0 })

    if (!success) {
        return partials
    }

    if (type === 'harmonic') {
        for (let i = 1; i <= number; i++) {
            const amplitude = getAmplitude(profile, i)
            partials.push({ ratio: i, frequency: i * fundamental, amplitude: amplitude, loudness: setharesLoudness(amplitude) })
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



export const combinePartials = (...args: TPartials[]): TPartials => {
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
