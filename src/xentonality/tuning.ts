import { round } from 'lodash'
import type { Partial } from '../synth'

export type Fraction = [number, number]

export type Note = {
    exactRatio?: number
    deviation?: number
    ratio: number
    fraction: Fraction
    correlation: number
}

export type Tuning = Note[]

function pushToTuning(tuning: Tuning, newNote: Note, precision = 2) {
    const threshold = 0.1 ** precision

    for (let i = 0; i < tuning.length; i++) {
        const note = tuning[i]

        if (Math.abs(note.ratio - newNote.ratio) < threshold) {
            tuning[i].correlation += newNote.correlation
            return
        }
    }

    tuning.push(newNote)
}

function fractionsEqual(fraction1: Fraction, fraction2: Fraction) {
    return fraction1[0] === fraction2[0] && fraction1[1] === fraction2[1]
}

function areClose(partial1: Partial, partial2: Partial, threshold: number) {
    return Math.abs(partial1.rate - partial2.rate) < threshold
}

// better name
export function roundPartialRates(partials: Partial[], precision: number) {
    const sorted = partials.sort((a, b) => a.rate - b.rate)
    const result: Partial[] = []
    const threshold = 0.1 ** precision
    let i = 0

    while (i < sorted.length) {
        let step

        if (sorted[i + 1] && areClose(sorted[i], sorted[i + 1], threshold)) {
            let closePartialsCount = 1

            while (sorted[i + closePartialsCount + 1] && areClose(sorted[i + closePartialsCount], sorted[i + closePartialsCount + 1], threshold)) {
                closePartialsCount += 1
            }

            step = closePartialsCount + 1
        } else {
            step = 1
        }

        const roundedPartial = { ...sorted[i], rate: round(sorted[i].rate, precision) }
        result.push(roundedPartial)
        i += step
    }

    return result
}

export function reduceFraction(numerator: number, denominator: number): Fraction {
    let gcd = numerator
    let b = denominator
    let c

    while (b) {
        c = gcd % b
        gcd = b
        b = c
    }

    return [numerator / gcd, denominator / gcd]
}

export function getTuning(partials: Partial[], precision = 3): Tuning {
    const tuning: Tuning = []
    const roundedPartials = roundPartialRates(partials, precision)
    const correlationStep = 1 / roundedPartials.length

    for (let i = 0; i < roundedPartials.length; i++) {
        const iPartialIntegerRate = Math.round(roundedPartials[i].rate * 10 ** precision)

        for (let j = 0; j < roundedPartials.length; j++) {
            const jPartialIntegerRate = Math.round(roundedPartials[j].rate * 10 ** precision)

            const exactRatio = roundedPartials[i].rate / roundedPartials[j].rate
            const fraction = reduceFraction(iPartialIntegerRate, jPartialIntegerRate)
            const ratio = fraction[0] / fraction[1]
            const deviation = Math.abs(ratio - exactRatio)

            const note = {
                exactRatio,
                fraction,
                ratio,
                deviation,
                correlation: correlationStep,
            }

            pushToTuning(tuning, note)
        }
    }

    return tuning
}
