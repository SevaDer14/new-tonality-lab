import type { TPartials } from "./types"
import { checkNumericParam, getAmplitude, setharesLoudness } from "./utils"



export const generatePartials = ({ type, amplitudeProfile = 'harmonic', fundamental = 440, number = 1000 }: { type: 'harmonic', amplitudeProfile?: 'equal' | 'harmonic', fundamental?: number, number?: number }): TPartials => {
    const partials = [] as TPartials

    const success = checkNumericParam({ param: number, condition: number > 0, integer: true }) && checkNumericParam({ param: fundamental, condition: fundamental > 0 })

    if (!success) {
        return partials
    }

    if (type === 'harmonic') {
        for (let i = 1; i <= number; i++) {
            const amplitude = getAmplitude(amplitudeProfile, i)
            partials.push({ ratio: i, frequency: i * 440, amplitude: amplitude, loudness: setharesLoudness(amplitude) })
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
        const partial = partials[i]
        partial.frequency = partial.ratio * fundamental
        newPartials.push(partial)
    }

    return newPartials
}



export const combinePartials = (...partialGroups: TPartials[]): TPartials => {
    const result = [] as TPartials
    const allPartials = partialGroups.flatMap(partialGroup => partialGroup).sort((a, b) => a.ratio - b.ratio) as TPartials

    for (let i = 0; i < allPartials.length; i++) {
        if (result[result.length - 1] && allPartials[i].ratio === result[result.length - 1].ratio) {
            result[result.length - 1].amplitude += allPartials[i].amplitude
            result[result.length - 1].loudness = setharesLoudness(result[result.length - 1].amplitude)
        } else {
            result.push(allPartials[i])
        }
    }

    return result
}
