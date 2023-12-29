import { expect, describe, it } from 'vitest'
import * as Spectrum from './spectrum'

describe('getHarmonicRates', () => {
    it('should return 4 harmonic rates from 1 to 4', () => {
        const options = { length: 4, start: undefined, transposeTo: undefined }
        const expectedOutcome = [{ rate: 1 }, { rate: 2 }, { rate: 3 }, { rate: 4 }]

        expect(Spectrum.getHarmonicRates(options)).toEqual(expectedOutcome)
    })

    it('should return 4 harmonic rates from 4 to 7', () => {
        const options = { length: 4, start: 4, transposeTo: undefined }
        const expectedOutcome = [{ rate: 4 }, { rate: 5 }, { rate: 6 }, { rate: 7 }]

        expect(Spectrum.getHarmonicRates(options)).toEqual(expectedOutcome)
    })

    it('should return 4 harmonic rates from 4 to 7 transposed to 2', () => {
        const options = { length: 4, start: 4, transposeTo: 2 }
        const expectedOutcome = [{ rate: 2 }, { rate: 5 / 2 }, { rate: 3 }, { rate: 7 / 2 }]

        expect(Spectrum.getHarmonicRates(options)).toEqual(expectedOutcome)
    })

    it('should return 3 harmonic rates from 4 to 6 transposed to 1', () => {
        const options = { length: 3, start: 4, transposeTo: 1 }
        const expectedOutcome = [{ rate: 1 }, { rate: 5 / 4 }, { rate: 6 / 4 }]

        expect(Spectrum.getHarmonicRates(options)).toEqual(expectedOutcome)
    })

    it('should throw if length is negative', () => {
        const options = { length: -1, start: 2, transposeTo: 2 }

        expect(() => Spectrum.getHarmonicRates(options)).toThrowError()
    })

    it('should throw if start is negative', () => {
        const options = { length: 4, start: -1, transposeTo: 2 }

        expect(() => Spectrum.getHarmonicRates(options)).toThrowError()
    })

    it('should throw if transposeTo is negative', () => {
        const options = { length: 4, start: 1, transposeTo: -1 }

        expect(() => Spectrum.getHarmonicRates(options)).toThrowError()
    })
})

describe('stretchRates', () => {
    const rates = [{ rate: 1 }, { rate: 2 }, { rate: 3 }, { rate: 4 }]

    it('should not stretch if stretch is 1', () => {
        const options = { rates, stretch: 1 }
        const expectedOutcome = [{ rate: 1 }, { rate: 2 }, { rate: 3 }, { rate: 4 }]

        expect(Spectrum.stretchRates(options)).toEqual(expectedOutcome)
    })

    it('should stretch twice if stretch is 2', () => {
        const options = { rates, stretch: 2 }
        const expectedOutcome = [{ rate: 1 }, { rate: 4 }, { rate: 9 }, { rate: 16 }]

        expect(Spectrum.stretchRates(options)).toEqual(expectedOutcome)
    })

    it('should shrink twice if stretch is 0.5', () => {
        const options = { rates, stretch: 0.5 }
        const expectedOutcome = [{ rate: 1 }, { rate: 2 ** 0.5 }, { rate: 3 ** 0.5 }, { rate: 4 ** 0.5 }]

        expect(Spectrum.stretchRates(options)).toEqual(expectedOutcome)
    })

    it('should not mutate input rates', () => {
        const options = { rates, stretch: 3 }

        expect(rates !== Spectrum.stretchRates(options)).toEqual(true)
    })

    it('should throw if stretch is negative', () => {
        const options = { rates, stretch: -1 }

        expect(() => Spectrum.stretchRates(options)).toThrowError()
    })
})

describe('attachReciprocalAmplitudes', () => {
    const rates = [{ rate: 1 }, { rate: 2 }, { rate: 3 }, { rate: 4 }]

    it('should attach reciprocal amplitudes', () => {
        const options = { rates, slope: 1 }
        const expectedOutcome = [
            { rate: 1, amplitude: 1 },
            { rate: 2, amplitude: 1 / 2 },
            { rate: 3, amplitude: 1 / 3 },
            { rate: 4, amplitude: 1 / 4 },
        ]

        expect(Spectrum.attachReciprocalAmplitudes(options)).toEqual(expectedOutcome)
    })

    it('should attach amplitudes = 1 if slope = 0', () => {
        const options = { rates, slope: 0 }
        const expectedOutcome = [
            { rate: 1, amplitude: 1 },
            { rate: 2, amplitude: 1 },
            { rate: 3, amplitude: 1 },
            { rate: 4, amplitude: 1 },
        ]

        expect(Spectrum.attachReciprocalAmplitudes(options)).toEqual(expectedOutcome)
    })

    it('should dampen top end with increase in slope', () => {
        const options = { rates, slope: 2 }
        const expectedOutcome = [
            { rate: 1, amplitude: 1 },
            { rate: 2, amplitude: 1 / 4 },
            { rate: 3, amplitude: 1 / 9 },
            { rate: 4, amplitude: 1 / 16 },
        ]

        expect(Spectrum.attachReciprocalAmplitudes(options)).toEqual(expectedOutcome)
    })

    it('should not mutate input rates', () => {
        const options = { rates, slope: 3 }

        expect(rates !== Spectrum.attachReciprocalAmplitudes(options)).toEqual(true)
    })

    it('should throw if slope is negative', () => {
        const options = { rates, slope: -1 }
        expect(() => Spectrum.attachReciprocalAmplitudes(options)).toThrowError()
    })
})

describe('attachRandomPhases', () => {
    const partials = [
        { rate: 1, amplitude: 1 },
        { rate: 2, amplitude: 1 },
        { rate: 3, amplitude: 1 },
        { rate: 4, amplitude: 1 },
    ]

    it('should attach phases', () => {
        const options = { partials }
        const result = Spectrum.attachRandomPhases(options)
        const phases = result.map((partial) => partial.phase)

        phases.forEach((phase) => {
            const validValue = phase !== undefined && phase <= 1 && phase >= 0
            expect(validValue).toEqual(true)
        })
    })

    it('should attach random phases', () => {
        const options = { partials }
        const phases_1 = Spectrum.attachRandomPhases(options).map((partial) => partial.phase)
        const phases_2 = Spectrum.attachRandomPhases(options).map((partial) => partial.phase)

        expect(phases_1).not.toEqual(phases_2)
    })

    it('should not change rate and amplitude', () => {
        const options = { partials }
        const result = Spectrum.attachRandomPhases(options).map((partial) => ({ rate: partial.rate, amplitude: partial.amplitude }))

        expect(result).toEqual(partials)
    })

    it('should not mutate input partials', () => {
        const options = { partials }

        expect(partials !== Spectrum.attachRandomPhases(options)).toEqual(true)
    })
})

describe('tweak', () => {
    const partials = [
        { rate: 1, amplitude: 1, phase: 0.5 },
        { rate: 2, amplitude: 1, phase: 0.5 },
        { rate: 3, amplitude: 1, phase: 0.5 },
        { rate: 4, amplitude: 1, phase: 0.5 },
    ]

    const tweaks = [
        { rate: 1.1, amplitude: 0.75, phase: 2 },
        { rate: 0.75, amplitude: 0.1, phase: 0.5 },
        { rate: 1, amplitude: 1, phase: 1 },
    ]

    it('should apply tweaks', () => {
        const expectedOutcome = [
            { rate: 1.1, amplitude: 0.75, phase: 1 },
            { rate: 1.5, amplitude: 0.1, phase: 0.25 },
            { rate: 3, amplitude: 1, phase: 0.5 },
            { rate: 4, amplitude: 1, phase: 0.5 },
        ]

        const options = { partials, tweaks }

        expect(Spectrum.tweak(options)).toEqual(expectedOutcome)
    })

    it('should allow to tweak specific atrs', () => {
        const expectedOutcome = [
            { rate: 1, amplitude: 1, phase: 0.5 },
            { rate: 2.2, amplitude: 1, phase: 0.5 },
            { rate: 3, amplitude: 0.33, phase: 0.5 },
            { rate: 4, amplitude: 1, phase: 0.75 },
        ]

        const options = { partials, tweaks: [{}, { rate: 1.1 }, { amplitude: 0.33 }, { phase: 1.5 }] }

        expect(Spectrum.tweak(options)).toEqual(expectedOutcome)
    })

    it('should throw if slope is negative', () => {
        const invalidTweaks = [...tweaks, { rate: -1, amplitude: 1, phase: 1 }]
        const options = { partials, tweaks: invalidTweaks }

        expect(() => Spectrum.tweak(options)).toThrowError()
    })

    it('should not mutate input partials', () => {
        const options = { partials, tweaks }

        expect(partials !== Spectrum.tweak(options)).toEqual(true)
    })
})

describe('getAllPartials', () => {
    const spectrum = [
        {
            partials: [
                { rate: 1, amplitude: 1, phase: 0.5 },
                { rate: 2, amplitude: 1, phase: 0.5 },
                { rate: 3, amplitude: 1, phase: 0.5 },
                { rate: 4, amplitude: 1, phase: 0.5 },
            ],
        },
        {
            partials: [
                { rate: 6, amplitude: 1, phase: 0.5 },
                { rate: 5, amplitude: 1, phase: 0.5 },
                { rate: 4, amplitude: 1, phase: 0.5 },
                { rate: 3, amplitude: 1, phase: 0.5 },
            ],
        },
    ]

    it('should return sorted partials without duplicates', () => {
        const expectedOutcome = [
            { rate: 1, amplitude: 1, phase: 0.5 },
            { rate: 2, amplitude: 1, phase: 0.5 },
            { rate: 3, amplitude: 1, phase: 0.5 },
            { rate: 4, amplitude: 1, phase: 0.5 },
            { rate: 5, amplitude: 1, phase: 0.5 },
            { rate: 6, amplitude: 1, phase: 0.5 },
        ]

        expect(Spectrum.getAllPartials(spectrum)).toEqual(expectedOutcome)
    })
})
