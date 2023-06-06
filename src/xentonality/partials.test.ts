import { describe, it, expect } from "vitest";
import { Partials } from "./partials";
import { PointSeries, type PointSeriesValue } from "./pointSeries";
import { Series } from "./series";
import { errors } from "./errorMessages";
import { round } from "./utils";

const Fixture = {
    edo_12_1: [[1, 1], [2, 0.5], [2.9966141538, 0.3337099635], [4, 0.25], [5.0396841996, 0.1984251315], [5.9932283075, 0.1668549818], [7.1271897451, 0.140307756], [8, 0.125], [8.9796963865, 0.1113623398], [10.0793683992, 0.0992125657]],
    edo_3_1: [[1, 1], [2, 1], [3.1748021039, 1], [4, 1], [5.0396841996, 1], [6.3496042079, 1], [8, 1], [10.0793683992, 1]],
    stretch_harm_3: [[1, 1], [3, 1], [5.7045224947, 1], [9, 1]],
    stretch_edo_11_fifth: [[1, 1], [1.5, 1], [1.8712897413, 1], [2.25, 1], [2.6074482829, 1], [2.8069346119, 1]],
}

describe('Partials:', () => {
    describe('constructor', () => {
        it('should construct partials with no partials', () => {
            const partials = new Partials()

            expect(partials.value).toEqual([])
        })

        it('should construct partials with [[1, 1], [2, 0.5]] partials', () => {
            const partials = new Partials([[1, 1], [2, 0.5]])

            expect(partials.value).toEqual([[1, 1], [2, 0.5]])
        })

        it('should construct deep copy of provided partials', () => {
            const partials_1 = new Partials([[1, 1], [2, 1], [3, 1]])
            const partials_2 = new Partials(partials_1.value)

            partials_2.stretch(4)

            expect(partials_1.value).toEqual([[1, 1], [2, 1], [3, 1]])
        })
    })

    describe('getter', () => {
        it('should return a value of partials of the partials', () => {
            const partials = new Partials([[1, 1], [2, 1], [3, 1], [4, 1]])

            expect(partials.value).toEqual([[1, 1], [2, 1], [3, 1], [4, 1]])
        })
    })

    describe('.generate, type = harmonic', () => {
        it('should construct harmonic partials with 0 partials', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 0 })

            expect(partials.value).toEqual([])
        })

        it('should construct harmonic partials with 4 partials and default equal amplitudes', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 4 })

            const ratios = new Series().fill(4, (i) => i + 1).value
            const amplitudes = new Series().fill(4, () => 1).value
            const expectedPartials = new PointSeries().merge(ratios, amplitudes).value

            expect(partials.value).toEqual(expectedPartials)
        })

        it('should construct harmonic partials with 3 partials and log amplitude profile', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3, amplitudeProfile: 1 })

            const ratios = new Series().fill(3, (i) => i + 1).value
            const amplitudes = new Series(ratios).transform((n) => round(1 / n)).value
            const expectedPartials = new PointSeries().merge(ratios, amplitudes).value

            expect(partials.value).toEqual(expectedPartials)
        })

        it('should throw less than 1 octave ratio error if octaveRatio is 1', () => {
            expect(() => new Partials().generate({ type: "harmonic", numberOfPartials: 10, octaveRatio: 1 }))
                .toThrowError(errors.partials.lessThanOneOctaveRatio)
        })

        it('should throw infinite loop error if iterations exceed 1 000 000', () => {
            expect(() => new Partials().generate({ type: "harmonic", numberOfPartials: 1000001, octaveRatio: 1.0000000001 }))
                .toThrowError(errors.partials.probableInfiniteLoop)
        })

        it('should throw error if number of partials is negative', () => {
            expect(() => new Partials().generate({ type: "harmonic", numberOfPartials: -1 }))
                .toThrowError(errors.partials.negativeNumberOfPartials)
        })

        it('should throw error if amplitude profile is negative', () => {
            expect(() => new Partials().generate({ type: "harmonic", numberOfPartials: 4, amplitudeProfile: -1 }))
                .toThrowError(errors.partials.negativeAmplitudeProfile)
        })

        it('should throw error if number of partials is not integer', () => {
            expect(() => new Partials().generate({ type: "harmonic", numberOfPartials: 2.5 }))
                .toThrowError(errors.partials.nonIntegerNumberOfPartials)
        })
    })

    describe('.generate type = equalTemperament', () => {
        it('returns 10 partials of 12 edo partials and harmonic amplitude profile', () => {
            const expectedOutcome = Fixture.edo_12_1
            const partials = new Partials().generate({ type: "equalTemperament", steps: 12, numberOfPartials: 10, amplitudeProfile: 1 })

            expect(partials.value).toEqual(expectedOutcome);
        });

        it('returns 8 partials of 3 edo partials with no duplicates and default equal amplitude profile', () => {
            const expectedOutcome = Fixture.edo_3_1
            const partials = new Partials().generate({ type: "equalTemperament", steps: 3, numberOfPartials: 8 })

            expect(partials.value).toEqual(expectedOutcome);
        });

        it('should throw less than 1 octave ratio error if octaveRatio is 1', () => {
            expect(() => new Partials().generate({ type: "harmonic", numberOfPartials: 10, octaveRatio: 1 }))
                .toThrowError(errors.partials.lessThanOneOctaveRatio)
        })

        it('should throw infinite loop error if iterations exceed 1 000 000', () => {
            expect(() => new Partials().generate({ type: "harmonic", numberOfPartials: 1000001, octaveRatio: 1.0000000001 }))
                .toThrowError(errors.partials.probableInfiniteLoop)
        })

        it('should throw error if number of partials is negative', () => {
            expect(() => new Partials().generate({ type: "equalTemperament", numberOfPartials: -1 }))
                .toThrowError(errors.partials.negativeNumberOfPartials)
        })

        it('should throw error if amplitude profile is negative', () => {
            expect(() => new Partials().generate({ type: "equalTemperament", numberOfPartials: 4, amplitudeProfile: -1 }))
                .toThrowError(errors.partials.negativeAmplitudeProfile)
        })

        it('should throw error if number of partials is not integer', () => {
            expect(() => new Partials().generate({ type: "equalTemperament", numberOfPartials: 2.5 }))
                .toThrowError(errors.partials.nonIntegerNumberOfPartials)
        })
    })

    describe('.stretch', () => {
        it('should do nothing with empty partials', () => {
            const partials = new Partials().stretch(3)

            expect(partials.value).toEqual([])
        })

        it('should stretch octave to octave + fifth', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 4 }).stretch(3)

            expect(partials.value).toEqual(Fixture.stretch_harm_3)
        })

        it('should shrink octave to fifth', () => {
            const partials = new Partials().generate({ type: "equalTemperament", steps: 11, numberOfPartials: 6 }).stretch(3 / 2)

            expect(partials.value).toEqual(Fixture.stretch_edo_11_fifth)
        })

        it('should throw error if octave ratio is 0', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })

            expect(() => partials.stretch(0)).toThrowError(errors.partials.lessThanOneOctaveRatio)
        })

        it('should throw error if octave ratio is negative', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })

            expect(() => partials.stretch(-1)).toThrowError(errors.partials.lessThanOneOctaveRatio)
        })
    })

    describe('.include', () => {
        it('should return empty partials if both partials are empty', () => {
            const partials_1 = new Partials()
            const partials_2 = new Partials()

            partials_1.include(partials_2.value)

            expect(partials_1.value).toEqual([])
        })

        it('should return original partials if included partials is empty', () => {
            const partials_1 = new Partials().generate({ type: "harmonic", numberOfPartials: 3 }).include([])
            const expectedOutcome = [[1, 1], [2, 1], [3, 1]]

            expect(partials_1.value).toEqual(expectedOutcome)
        })

        it('should return included partials if original partials is empty', () => {
            const partials_1 = new Partials()
            const partials_2 = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const expectedOutcome = [[1, 1], [2, 1], [3, 1]]

            partials_1.include(partials_2.value)

            expect(partials_1.value).toEqual(expectedOutcome)
        })

        it('should not change partials if including itself', () => {
            const harmonic = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const expectedOutcome = [[1, 1], [2, 1], [3, 1]]

            harmonic.include(harmonic.value)

            expect(harmonic.value).toEqual(expectedOutcome)
        })

        it('should not change partials if including equal one', () => {
            const harmonic_1 = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const harmonic_2 = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const expectedOutcome = [[1, 1], [2, 1], [3, 1]]

            harmonic_1.include(harmonic_2.value)

            expect(harmonic_1.value).toEqual(expectedOutcome)
        })

        it('should include new partials to the end', () => {
            const partials_1 = new Partials([[1, 1], [2, 1], [3, 1]])
            const partials_2 = new Partials([[10, 10], [20, 10], [30, 10]])

            partials_1.include(partials_2.value)

            expect(partials_1.value).toEqual([[1, 1], [2, 1], [3, 1], [10, 10], [20, 10], [30, 10]])
        })

        it('should not change partials of the partials that is included', () => {
            const partials_1 = new Partials([[1, 1], [2, 1], [3, 1]])
            const partials_2 = new Partials([[10, 10], [20, 10], [30, 10]])

            partials_1.include(partials_2.value)

            expect(partials_2.value).toEqual([[10, 10], [20, 10], [30, 10]])
        })

        it('should include harmonic and stretched partials without duplicate partials', () => {
            const harmonic = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const stretched = new Partials([[1, 1], [2, 1], [3, 1]]).stretch(2.1)
            harmonic.include(stretched.value)

            expect(harmonic.value).toEqual([[1, 1], [2, 1], [2.1, 1], [3, 1], [3.2411975292, 1]])
        })


        it('should choose the point with largest Y if point with same X is present', () => {
            const partials_1 = new Partials([[1, 1], [2, 0.5], [3, 0.33], [4, 0.6]])
            const partials_2 = new Partials([[1.1, 0.1], [2.2, 1], [3, 1], [4, 0.5]])

            partials_1.include(partials_2.value)

            expect(partials_1.value).toEqual([[1, 1], [1.1, 0.1], [2, 0.5], [2.2, 1], [3, 1], [4, 0.6]])
        })
    })

    describe('.shift', () => {
        it('should do nothing on empty partials', () => {
            const harmonic = new Partials()
            harmonic.shift(2)

            expect(harmonic.value).toEqual([])
        })

        it('should shift partials on the ratio', () => {
            const harmonic = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            harmonic.shift(2)

            expect(harmonic.value).toEqual([[2, 1], [4, 1], [6, 1]])
        })
    })

    // describe('.shiftAndInclude', () => {
    //     it('should add 1.1 of the same partials', () => {
    //         const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3, amplitudeProfile: 1 })
    //         partials.shiftAndInclude(1.1)


    //         expect(partials.value).toEqual([[1, 1], [1.1, 1], [2, 0.5], [2.2, 0.5], [3, 0.3333333333], [3.3, 0.3333333333]])
    //     })

    //     it('should add fifth of the same partials', () => {
    //         const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3, amplitudeProfile: 1 })
    //         partials.shiftAndInclude(1.5)


    //         expect(partials.value).toEqual([[1, 1], [1.5, 1], [2, 0.5], [3, 0.5], [4.5, 0.3333333333]])
    //     })

    //     it('should add octave + fifth of the same partials', () => {
    //         const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3, amplitudeProfile: 1 })
    //         partials.shiftAndInclude(3)


    //         expect(partials.value).toEqual([[1, 1], [2, 0.5], [3, 1], [6, 0.5], [9, 0.3333333333]])
    //     })
    // })

    describe('.tweak', () => {
        it('should apply tweaks to partials', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[0.5, 0], [1, 1], [2, 2]]
            partials.tweak(tweaks)


            expect(partials.value).toEqual([[0.5, 0], [2, 1], [6, 2]])
        })

        it('should apply tweaks to only first partial', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[0.9, 0.9]]
            partials.tweak(tweaks)

            expect(partials.value).toEqual([[0.9, 0.9], [2, 1], [3, 1]])
        })

        it('should not throw error if amplitude tweak is 0', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[1, 1], [1, 0]]
            partials.tweak(tweaks)

            expect(partials.value).toEqual([[1, 1], [2, 0], [3, 1]])
        })

        it('should throw error if ratio tweak is 0', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[0, 1]]

            expect(() => partials.tweak(tweaks)).toThrowError(errors.partials.tweakRatioLessOrEqualZero)
        })

        it('should throw error if ratio tweak is negative', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[1, 1], [-1, 1]]

            expect(() => partials.tweak(tweaks)).toThrowError(errors.partials.tweakRatioLessOrEqualZero)
        })

        it('should throw error if amplitude tweak is negative', () => {
            const partials = new Partials().generate({ type: "harmonic", numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[1, 1], [1, -1]]

            expect(() => partials.tweak(tweaks)).toThrowError(errors.partials.tweakAmplitudeLessZero)
        })
    })
})
