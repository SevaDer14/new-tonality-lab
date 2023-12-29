import { expect, describe, it } from 'vitest'
import * as Tuning from './tuning'

describe('getTuning', () => {
    it('should return correct tuning', () => {
        const partials = [
            { rate: 1, amplitude: 1, phase: 0.5 },
            { rate: 2, amplitude: 1, phase: 0.5 },
            { rate: 3, amplitude: 1, phase: 0.5 },
            { rate: 4, amplitude: 1, phase: 0.5 },
        ]

        const expectedFractions = [
            [1, 1],
            [1, 2],
            [1, 3],
            [1, 4],
            [2, 1],
            [2, 3],
            [3, 1],
            [3, 2],
            [3, 4],
            [4, 1],
            [4, 3],
        ]
        const expectedCorrelation = [1, 0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]

        const tuning = Tuning.getTuning(partials)
        const fractions = tuning.map((note) => note.fraction)
        const correlation = tuning.map((note) => note.correlation)

        expect(fractions).toEqual(expectedFractions)
        expect(correlation).toEqual(expectedCorrelation)
    })

    it('should return correct tuning when some partials are close', () => {
        const partials = [
            { rate: 1, amplitude: 1, phase: 0.5 },
            { rate: 2, amplitude: 1, phase: 0.5 },
            { rate: 2.01, amplitude: 1, phase: 0.5 },
        ]
        const expectedFractions = [
            [1, 1],
            [1, 2],
            [100, 201],
            [2, 1],
            [200, 201],
            [201, 100],
            [201, 200],
        ]
        const expectedCorrelation = [1, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3, 1 / 3]

        const tuning = Tuning.getTuning(partials)
        const fractions = tuning.map((note) => note.fraction)
        const correlation = tuning.map((note) => note.correlation)

        expect(fractions).toEqual(expectedFractions)
        expect(correlation).toEqual(expectedCorrelation)
    })

    it('should consider partials as the same if they are too close (below default precision = 3)', () => {
        const partials = [
            { rate: 1, amplitude: 1, phase: 0.5 },
            { rate: 2, amplitude: 1, phase: 0.5 },
            { rate: 2.0009, amplitude: 1, phase: 0.5 },
        ]
        const expectedFractions = [
            [1, 1],
            [1, 2],
            [2, 1],
        ]
        const expectedCorrelation = [1, 0.5, 0.5]

        const tuning = Tuning.getTuning(partials)
        const fractions = tuning.map((note) => note.fraction)
        const correlation = tuning.map((note) => note.correlation)

        expect(fractions).toEqual(expectedFractions)
        expect(correlation).toEqual(expectedCorrelation)
    })

    it('should round partial rates to default precision = 3', () => {
        const partials = [
            { rate: 0.9999, amplitude: 1, phase: 0.5 },
            { rate: 1, amplitude: 1, phase: 0.5 },
            { rate: 2, amplitude: 1, phase: 0.5 },
        ]
        const expectedFractions = [
            [1, 1],
            [1, 2],
            [2, 1],
        ]
        const expectedCorrelation = [1, 0.5, 0.5]

        const tuning = Tuning.getTuning(partials)
        const fractions = tuning.map((note) => note.fraction)
        const correlation = tuning.map((note) => note.correlation)

        expect(fractions).toEqual(expectedFractions)
        expect(correlation).toEqual(expectedCorrelation)
    })

    it.only('should count correlation for stretched tunings', () => {
        const partials = [
            {
                rate: 1,
                amplitude: 1,
                phase: 0.19361968470134694,
            },
            {
                rate: 2.82842712474619,
                amplitude: 0.3535533905932738,
                phase: 0.49757686946647905,
            },
            {
                rate: 5.196152422706632,
                amplitude: 0.19245008972987526,
                phase: 0.36873305616120855,
            },
            {
                rate: 8,
                amplitude: 0.125,
                phase: 0.49364388250884694,
            },
        ]

        const expectedFractions = [
            [1, 1],
            [250, 707],
            [250, 1299],
            [1, 8],
            [707, 250],
            [707, 1299],
            [1299, 250],
            [1299, 707],
            [1299, 2000],
            [8, 1],
            [2000, 1299],
        ]
        const expectedCorrelation = [1, 0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25]

        const tuning = Tuning.getTuning(partials)
        const fractions = tuning.map((note) => note.fraction)
        const correlation = tuning.map((note) => note.correlation)

        expect(fractions).toEqual(expectedFractions)
        expect(correlation).toEqual(expectedCorrelation)
    })
})

describe('roundPartialRates', () => {
    it('should round partial rates and remove duplicates', () => {
        const partials = [
            { rate: 0.9999, amplitude: 1, phase: 0.5 },
            { rate: 1, amplitude: 1, phase: 0.5 },
            { rate: 1.4999, amplitude: 1, phase: 0.5 },
            { rate: 1.5002, amplitude: 0.1, phase: 0.5 },
            { rate: 1.6056, amplitude: 0.3, phase: 0.5 },
            { rate: 1.6055, amplitude: 1, phase: 0.5 },
            { rate: 2, amplitude: 1, phase: 0.5 },
            { rate: 1.6054, amplitude: 1, phase: 0.5 },
        ]

        const expectedOutcome = [
            { rate: 1, amplitude: 1, phase: 0.5 },
            { rate: 1.5, amplitude: 1, phase: 0.5 },
            { rate: 1.605, amplitude: 1, phase: 0.5 },
            { rate: 2, amplitude: 1, phase: 0.5 },
        ]

        expect(Tuning.roundPartialRates(partials, 3)).toEqual(expectedOutcome)
    })
})

describe('reduceFraction', () => {
    it('should reduce 2/4', () => {
        expect(Tuning.reduceFraction(2, 4)).toEqual([1, 2])
    })

    it('should reduce 4/2', () => {
        expect(Tuning.reduceFraction(4, 2)).toEqual([2, 1])
    })

    it('should reduce 13/5', () => {
        expect(Tuning.reduceFraction(13, 5)).toEqual([13, 5])
    })

    it('should reduce 28/12', () => {
        expect(Tuning.reduceFraction(28, 12)).toEqual([7, 3])
    })

    it('should reduce 16/12', () => {
        expect(Tuning.reduceFraction(16, 80)).toEqual([1, 5])
    })
})
