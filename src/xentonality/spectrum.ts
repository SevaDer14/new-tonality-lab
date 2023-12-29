import type { Partial, Spectrum } from '../synth'

type Rate = Pick<Partial, 'rate'>

type GetHarmonicRatesArgs = {
    length: number
    start?: number
    transposeTo?: number
}

export function getHarmonicRates({ length, start = 1, transposeTo }: GetHarmonicRatesArgs): Rate[] {
    if (length < 0 || start <= 0 || (transposeTo && transposeTo <= 0)) {
        throw new Error(`One of the args is less than zero! length={${length}}; start={${start}}; transposeTo={${transposeTo}}`)
    }

    const rates: Rate[] = []

    const transposeTarget = transposeTo ?? start
    const transposition = transposeTarget / start

    for (let i = start; i < start + length; i++) {
        rates.push({ rate: i * transposition })
    }

    return rates
}

type StretchRatesArgs = {
    rates: Rate[]
    stretch: number
}

export function stretchRates({ rates, stretch }: StretchRatesArgs): Rate[] {
    const stretchedRates: Rate[] = []

    if (stretch <= 0) throw new Error(`One of the args is less than zero! stretch={${stretch}}`)

    for (let i = 0; i < rates.length; i++) {
        const newRate = rates[i].rate ** stretch
        stretchedRates.push({ rate: newRate })
    }

    return stretchedRates
}

type AttachReciprocalAmplitudesArgs = {
    rates: Rate[]
    slope: number
    amplitude?: number
}

export function attachReciprocalAmplitudes({ rates, slope, amplitude = 1 }: AttachReciprocalAmplitudesArgs): Partial[] {
    const partials: Partial[] = []

    if (slope < 0) throw new Error(`One of the args is less than zero! slope={${slope}}`)

    for (let i = 0; i < rates.length; i++) {
        partials.push({ ...rates[i], amplitude: amplitude * rates[i].rate ** -slope })
    }

    return partials
}

type AttachRandomPhasesArgs = {
    partials: Partial[]
}

export function attachRandomPhases({ partials }: AttachRandomPhasesArgs): Partial[] {
    const withPhases: Partial[] = []

    for (let i = 0; i < partials.length; i++) {
        withPhases.push({ ...partials[i], phase: Math.random() })
    }

    return withPhases
}

export type Tweak = {
    rate?: number
    amplitude?: number
    phase?: number
}

type TweakArgs = {
    partials: Partial[]
    tweaks: Tweak[]
}

export function tweak({ partials, tweaks }: TweakArgs): Partial[] {
    const tweaked: Partial[] = []

    for (let i = 0; i < partials.length; i++) {
        if (tweaks[i] === undefined) {
            tweaked.push({ ...partials[i] })
            continue
        }

        const { rate: oldRate, amplitude: oldAmplitude, phase: oldPhase } = partials[i]
        const { rate: tweakRate, amplitude: tweakAmplitude, phase: tweakPhase } = tweaks[i]

        const rate = tweakRate === undefined ? oldRate : oldRate * tweakRate
        const amplitude = tweakAmplitude === undefined ? oldAmplitude : oldAmplitude * tweakAmplitude
        const phase = oldPhase === undefined || tweakPhase === undefined ? oldPhase : oldPhase * tweakPhase

        if (rate < 0 || amplitude < 0 || (phase !== undefined && phase < 0)) throw new Error('One of the tweak args is less than zero!')

        tweaked.push({ rate, amplitude, phase })
    }

    return tweaked
}

function hasPartial(partials: Partial[], testPartial: Partial): boolean {
    let result = false

    for (let i = 0; i < partials.length; i++) {
        const partial = partials[i]

        if (partial.rate === testPartial.rate) {
            result = true
            break
        }
    }

    return result
}

export function getAllPartials(spectrum: Spectrum): Partial[] {
    const partials: Partial[] = []

    for (let i = 0; i < spectrum.length; i++) {
        const layerPartials = spectrum[i].partials

        for (let j = 0; j < layerPartials.length; j++) {
            const partial = layerPartials[j]

            if (!hasPartial(partials, partial)) partials.push(partial)
        }
    }

    return partials.sort((a, b) => a.rate - b.rate)
}
