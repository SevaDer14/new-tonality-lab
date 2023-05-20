import { describe, it, expect } from "vitest";
import { PRECISION, Spectrum } from "./spectrum";
import { PointSeries, type PointSeriesValue } from "./pointSeries";
import { Series } from "./series";
import { errors } from "./errorMessages";
import * as Fixture from "../../test/fixtures/spectrum";
import { round } from "lodash";

describe('Spectrum:', () => {
    const partials_1: PointSeriesValue = [[1, 1], [2, 1], [3, 1], [4, 1]]

    describe('constructor', () => {
        it('should construct spectrum with no partials', () => {
            const spectrum = new Spectrum()

            expect(spectrum.partials).toEqual([])
        })

        it('should construct spectrum with [[1, 1], [2, 0.5]] partials', () => {
            const partials: PointSeriesValue = [[1, 1], [2, 0.5]]
            const spectrum = new Spectrum(partials)

            expect(spectrum.partials).toEqual(partials)
        })
    })

    describe('getter', () => {
        it('should return a value of partials of the spectrum', () => {
            const spectrum = new Spectrum(partials_1)

            expect(spectrum.partials).toEqual(partials_1)
        })

        it('should return deep copy partials', () => {
            const spectrum_1 = new Spectrum([[1, 1], [2, 1], [3, 1]])
            const spectrum_2 = new Spectrum(spectrum_1.partials)

            spectrum_2.stretch(4)

            expect(spectrum_1.partials).toEqual([[1, 1], [2, 1], [3, 1]])
        })
    })

    describe('.harmonic', () => {
        it('should construct harmonic spectrum with 0 partials', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 0 })

            expect(spectrum.partials).toEqual([])
        })

        it('should construct harmonic spectrum with 4 partials and default equal amplitudes', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 4 })

            const ratios = new Series().fill(4, (i) => i + 1).value
            const amplitudes = new Series().fill(4, () => 1).value
            const expectedPartials = new PointSeries().merge(ratios, amplitudes).value

            expect(spectrum.partials).toEqual(expectedPartials)
        })

        it('should construct harmonic spectrum with 3 partials and log amplitude profile', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3, amplitudeProfile: 1 })

            const ratios = new Series().fill(3, (i) => i + 1).value
            const amplitudes = new Series(ratios).transform((n) => round(1 / n, PRECISION)).value
            const expectedPartials = new PointSeries().merge(ratios, amplitudes).value

            expect(spectrum.partials).toEqual(expectedPartials)
        })

        it('should throw error if number of partials is negative', () => {
            expect(() => new Spectrum().harmonic({ numberOfPartials: -1 }))
                .toThrowError(errors.spectrum.negativeNumberOfPartials)
        })

        it('should throw error if amplitude profile is negative', () => {
            expect(() => new Spectrum().harmonic({ numberOfPartials: 4, amplitudeProfile: -1 }))
                .toThrowError(errors.spectrum.negativeAmplitudeProfile)
        })

        it('should throw error if number of partials is not integer', () => {
            expect(() => new Spectrum().harmonic({ numberOfPartials: 2.5 }))
                .toThrowError(errors.spectrum.nonIntegerNumberOfPartials)
        })
    })

    describe('.edo', () => {
        it('returns 10 partials of 12 edo spectrum and harmonic amplitude profile', () => {
            const expectedOutcome = Fixture.edo_12_1
            const spectrum = new Spectrum().edo({ steps: 12, numberOfPartials: 10, amplitudeProfile: 1 })

            expect(spectrum.partials).toEqual(expectedOutcome);
        });

        it('returns 8 partials of 3 edo spectrum with no duplicates and default equal amplitude profile', () => {
            const expectedOutcome = Fixture.edo_3_1
            const spectrum = new Spectrum().edo({ steps: 3, numberOfPartials: 8 })

            expect(spectrum.partials).toEqual(expectedOutcome);
        });

        it('returns total of 10 partials for 3-EDO if ratio is limited to 16', () => {
            const spectrum = new Spectrum().edo({ steps: 3, numberOfPartials: 1000, ratioLimit: 16 })

            expect(spectrum.partials.length).toEqual(10);
            expect(spectrum.partials[spectrum.partials.length - 1][0]).toEqual(16);
        });

        it('should throw infinite loop error if number of partials is larger than 1 000 000', () => {
            expect(() => new Spectrum().harmonic({ numberOfPartials: -1 }))
                .toThrowError(errors.spectrum.negativeNumberOfPartials)
        })

        it('should throw error if number of partials is negative', () => {
            expect(() => new Spectrum().harmonic({ numberOfPartials: -1 }))
                .toThrowError(errors.spectrum.negativeNumberOfPartials)
        })

        it('should throw error if amplitude profile is negative', () => {
            expect(() => new Spectrum().harmonic({ numberOfPartials: 4, amplitudeProfile: -1 }))
                .toThrowError(errors.spectrum.negativeAmplitudeProfile)
        })

        it('should throw error if number of partials is not integer', () => {
            expect(() => new Spectrum().harmonic({ numberOfPartials: 2.5 }))
                .toThrowError(errors.spectrum.nonIntegerNumberOfPartials)
        })
    })
    describe('.stretch', () => {
        it('should do nothing with empty spectrum', () => {
            const spectrum = new Spectrum().stretch(3)

            expect(spectrum.partials).toEqual([])
        })

        it('should stretch octave to octave + fifth', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 4 }).stretch(3)

            expect(spectrum.partials).toEqual(Fixture.stretch_harm_3)
        })

        it('should shrink octave to fifth', () => {
            const spectrum = new Spectrum().edo({ steps: 11, numberOfPartials: 6 }).stretch(3 / 2)

            expect(spectrum.partials).toEqual(Fixture.stretch_edo_11_fifth)
        })

        it('should throw error if octave ratio is 0', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3 })

            expect(() => spectrum.stretch(0)).toThrowError(errors.spectrum.zeroOrNegativeOctaveRatio)
        })

        it('should throw error if octave ratio is negative', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3 })

            expect(() => spectrum.stretch(-1)).toThrowError(errors.spectrum.zeroOrNegativeOctaveRatio)
        })
    })

    describe('.include', () => {
        it('should return empty spectrum if both spectrums are empty', () => {
            const spectrum_1 = new Spectrum()
            const spectrum_2 = new Spectrum()

            spectrum_1.include(spectrum_2.partials)

            expect(spectrum_1.partials).toEqual([])
        })

        it('should return original spectrum if included spectrum is empty', () => {
            const spectrum_1 = new Spectrum().harmonic({ numberOfPartials: 3 }).include([])
            const expectedOutcome = [[1, 1], [2, 1], [3, 1]]

            expect(spectrum_1.partials).toEqual(expectedOutcome)
        })

        it('should return included spectrum if original spectrum is empty', () => {
            const spectrum_1 = new Spectrum()
            const spectrum_2 = new Spectrum().harmonic({ numberOfPartials: 3 })
            const expectedOutcome = [[1, 1], [2, 1], [3, 1]]

            spectrum_1.include(spectrum_2.partials)

            expect(spectrum_1.partials).toEqual(expectedOutcome)
        })

        it('should not change spectrum if including itself', () => {
            const harmonic = new Spectrum().harmonic({ numberOfPartials: 3 })
            const expectedOutcome = [[1, 1], [2, 1], [3, 1]]

            harmonic.include(harmonic.partials)

            expect(harmonic.partials).toEqual(expectedOutcome)
        })

        it('should not change spectrum if including equal one', () => {
            const harmonic_1 = new Spectrum().harmonic({ numberOfPartials: 3 })
            const harmonic_2 = new Spectrum().harmonic({ numberOfPartials: 3 })
            const expectedOutcome = [[1, 1], [2, 1], [3, 1]]

            harmonic_1.include(harmonic_2.partials)

            expect(harmonic_1.partials).toEqual(expectedOutcome)
        })

        it('should include new partials to the end', () => {
            const spectrum_1 = new Spectrum([[1, 1], [2, 1], [3, 1]])
            const spectrum_2 = new Spectrum([[10, 10], [20, 10], [30, 10]])

            spectrum_1.include(spectrum_2.partials)

            expect(spectrum_1.partials).toEqual([[1, 1], [2, 1], [3, 1], [10, 10], [20, 10], [30, 10]])
        })

        it('should not change partials of the spectrum that is included', () => {
            const spectrum_1 = new Spectrum([[1, 1], [2, 1], [3, 1]])
            const spectrum_2 = new Spectrum([[10, 10], [20, 10], [30, 10]])

            spectrum_1.include(spectrum_2.partials)

            expect(spectrum_2.partials).toEqual([[10, 10], [20, 10], [30, 10]])
        })

        it('should include harmonic and stretched spectrums without duplicate partials', () => {
            const harmonic = new Spectrum().harmonic({ numberOfPartials: 3 })
            const stretched = new Spectrum([[1, 1], [2, 1], [3, 1]]).stretch(2.1)
            harmonic.include(stretched.partials)

            expect(harmonic.partials).toEqual([[1, 1], [2, 1], [2.1, 1], [3, 1], [3.2411975292, 1]])
        })


        it('should choose the point with largest Y if point with same X is present', () => {
            const spectrum_1 = new Spectrum([[1, 1], [2, 0.5], [3, 0.33], [4, 0.6]])
            const spectrum_2 = new Spectrum([[1.1, 0.1], [2.2, 1], [3, 1], [4, 0.5]])

            spectrum_1.include(spectrum_2.partials)

            expect(spectrum_1.partials).toEqual([[1, 1], [1.1, 0.1], [2, 0.5], [2.2, 1], [3, 1], [4, 0.6]])
        })
    })

    describe('.shift', () => {
        it('should do nothing on empty spectrum', () => {
            const harmonic = new Spectrum()
            harmonic.shift(2)

            expect(harmonic.partials).toEqual([])
        })

        it('should shift spectrum on the ratio', () => {
            const harmonic = new Spectrum().harmonic({ numberOfPartials: 3 })
            harmonic.shift(2)

            expect(harmonic.partials).toEqual([[2, 1], [4, 1], [6, 1]])
        })
    })

    describe('.shiftAndInclude', () => {
        it('should add 1.1 of the same spectrum', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3, amplitudeProfile: 1 })
            spectrum.shiftAndInclude(1.1)


            expect(spectrum.partials).toEqual([[1, 1], [1.1, 1], [2, 0.5], [2.2, 0.5], [3, 0.3333333333], [3.3, 0.3333333333]])
        })

        it('should add fifth of the same spectrum', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3, amplitudeProfile: 1 })
            spectrum.shiftAndInclude(1.5)


            expect(spectrum.partials).toEqual([[1, 1], [1.5, 1], [2, 0.5], [3, 0.5], [4.5, 0.3333333333]])
        })

        it('should add octave + fifth of the same spectrum', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3, amplitudeProfile: 1 })
            spectrum.shiftAndInclude(3)


            expect(spectrum.partials).toEqual([[1, 1], [2, 0.5], [3, 1], [6, 0.5], [9, 0.3333333333]])
        })
    })

    describe('.tweak', () => {
        it('should apply tweaks to spectrum', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[0.5, 0], [1, 1], [2, 2]]
            spectrum.tweak(tweaks)


            expect(spectrum.partials).toEqual([[0.5, 0], [2, 1], [6, 2]])
        })

        it('should apply tweaks to only first partial', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[0.9, 0.9]]
            spectrum.tweak(tweaks)

            expect(spectrum.partials).toEqual([[0.9, 0.9], [2, 1], [3, 1]])
        })

        it('should not throw error if amplitude tweak is 0', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[1, 1], [1, 0]]
            spectrum.tweak(tweaks)

            expect(spectrum.partials).toEqual([[1, 1], [2, 0], [3, 1]])
        })

        it('should throw error if ratio tweak is 0', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[0, 1]]

            expect(() => spectrum.tweak(tweaks)).toThrowError(errors.spectrum.tweakRatioLessOrEqualZero)
        })

        it('should throw error if ratio tweak is negative', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[1, 1], [-1, 1]]

            expect(() => spectrum.tweak(tweaks)).toThrowError(errors.spectrum.tweakRatioLessOrEqualZero)
        })

        it('should throw error if amplitude tweak is negative', () => {
            const spectrum = new Spectrum().harmonic({ numberOfPartials: 3 })
            const tweaks: PointSeriesValue = [[1, 1], [1, -1]]

            expect(() => spectrum.tweak(tweaks)).toThrowError(errors.spectrum.tweakAmplitudeLessZero)
        })
    })
})