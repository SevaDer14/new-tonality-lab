import * as Dissonance from '../../src/xentonality/dissonance';
import * as Spectrum from '../../src/xentonality/spectrum';
import * as Factory from './factories'
import { diss_curve_440_4_harmonic, diss_curve_440_1_partial } from './fixtures/dissCurves'
import { curvesEqual } from "./assertions"

describe('Xentonality.Dissonance.plompLeveltDissonance', () => {
    it('returns 0 if minLoudness is 0', () => {
        const options = { minLoudness: 0, frequencyDifference: 440, minFrequency: 440 }
        expect(Dissonance.plompLeveltDissonance(options)).toEqual(0);
    });

    it('returns 0 if frequencyDifference is 0', () => {
        const options = { minLoudness: 64, frequencyDifference: 0, minFrequency: 440 }
        expect(Dissonance.plompLeveltDissonance(options)).toEqual(0);
    });

    it('returns 0 if minFrequency is 0', () => {
        const options = { minLoudness: 64, frequencyDifference: 440, minFrequency: 0 }
        expect(Dissonance.plompLeveltDissonance(options)).toEqual(0);
    });

    // WARNING: result not checked with Sethares book!! 
    it('returns correct dissonance value for given options', () => {
        const options = { minLoudness: 64, frequencyDifference: 440, minFrequency: 440 }
        expect(Dissonance.plompLeveltDissonance(options)).toEqual(0.0001324695873304775);
    });
})

describe('Xentonality.Dissonance.intrinsicDissonance', () => {
    it('returns 0 if 0 partials are provided', () => {
        expect(Dissonance.intrinsicDissonance(Factory.noPartals)).toEqual(0);
    });

    it('returns 0 if 1 partial is provided', () => {
        expect(Dissonance.intrinsicDissonance(Factory.partials({ ratios: [1] }))).toEqual(0);
    });

    it('returns 0 if partials have 0 loudness', () => {
        expect(Dissonance.intrinsicDissonance(Factory.partials({ amplitude: 0 }))).toEqual(0);
    });

    it('returns same value as plompLeveltDissonance if 2 partials are provided', () => {
        const partials = Factory.partials({ ratios: [1, 2], fundamental: 440 })
        const expercedOutcome = Dissonance.plompLeveltDissonance({ minLoudness: 64, frequencyDifference: 440, minFrequency: 440 })

        expect(Dissonance.intrinsicDissonance(partials)).toEqual(expercedOutcome);
    });

    // WARNING: value not tested, taken from result of function
    it('returns correct value for complex spectrum', () => {
        expect(Dissonance.intrinsicDissonance(Factory.partials({ ratios: [1, 2, 3, 4] }))).toEqual(0.02201318145631032);
    });
})

describe('Xentonality.Dissonance.calcDissonanceCurve', () => {
    // WARNING: I assume fixtures are correct, but need manual testing to confirm that
    it('returns diss curve for single partial', () => {
        const testFunction = Dissonance.calcDissonanceCurve({ partials: Factory.partials({ ratios: [1], fundamental: 440 }), points: 10 }).curve
        const expectedFunction = diss_curve_440_1_partial

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    })

    it('applies amplitude limits and returns diss curve for single partial', () => {
        const goodPartial = Factory.partials({ ratios: [1], amplitude: 1, fundamental: 440 })
        const hotPartial = Factory.partials({ ratios: [2], amplitude: 1.1, fundamental: 440 })
        const faintPartial = Factory.partials({ ratios: [3], amplitude: 0.09, fundamental: 440 })

        const testSpectrum = Spectrum.combinePartials(goodPartial, hotPartial, faintPartial)
        const dissCurve = Dissonance.calcDissonanceCurve({
            partials: testSpectrum,
            points: 10,
            limits: {
                amplitude: {
                    min: 0.1,
                    max: 1,
                }
            }
        }).curve

        const expectedFunction = diss_curve_440_1_partial

        expect(curvesEqual(dissCurve, expectedFunction)).toEqual(true);
    })

    it('applies frequency limits and returns diss curve for single partial', () => {
        const tooLowPartial = Factory.partials({ ratios: [1], amplitude: 1, fundamental: 19 })
        const goodPartial = Factory.partials({ ratios: [1], amplitude: 1, fundamental: 440 })
        const tooHighPartial = Factory.partials({ ratios: [1], amplitude: 1, fundamental: 6001 })

        const testSpectrum = Spectrum.combinePartials(tooLowPartial, goodPartial, tooHighPartial)
        const dissCurve = Dissonance.calcDissonanceCurve({
            partials: testSpectrum,
            points: 10,
            limits: {
                frequency: {
                    min: 20,
                    max: 6000,
                }
            }
        }).curve

        const expectedFunction = diss_curve_440_1_partial

        expect(curvesEqual(dissCurve, expectedFunction)).toEqual(true);
    })

    it('applies both limits and returns diss curve for single partial', () => {
        const goodPartial = Factory.partials({ ratios: [1], amplitude: 1, fundamental: 440 })
        const tooLowPartial = Factory.partials({ ratios: [1], amplitude: 1, fundamental: 19 })
        const tooHighPartial = Factory.partials({ ratios: [1], amplitude: 1, fundamental: 6001 })
        const hotPartial = Factory.partials({ ratios: [2], amplitude: 1.1, fundamental: 440 })
        const faintPartial = Factory.partials({ ratios: [3], amplitude: 0.09, fundamental: 440 })

        const testSpectrum = Spectrum.combinePartials(tooLowPartial, goodPartial, tooHighPartial, faintPartial, hotPartial)
        const dissCurve = Dissonance.calcDissonanceCurve({
            partials: testSpectrum,
            points: 10,
            limits: {
                frequency: {
                    min: 20,
                    max: 6000,
                },
                amplitude: {
                    min: 0.1,
                    max: 1,
                }
            }
        }).curve

        const expectedFunction = diss_curve_440_1_partial

        expect(curvesEqual(dissCurve, expectedFunction)).toEqual(true);
    })

    it('returns correct diss curve', () => {
        const testFunction = Dissonance.calcDissonanceCurve({ partials: Factory.partials({ ratios: [1, 2, 3, 4], fundamental: 440 }), points: 10 }).curve
        const expectedFunction = diss_curve_440_4_harmonic

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    })

    it('returns diss curve with default number of points = cents in pseudo-octave', () => {
        const dissCurve = Dissonance.calcDissonanceCurve({ partials: Factory.partials({ ratios: [1, 2.1], fundamental: 440 }) }).curve
        const expectedStepInCents = 1
        const expectedNumberOfPoints = 1285

        expect(dissCurve[1].cents - dissCurve[0].cents).toEqual(expectedStepInCents);
        expect(dissCurve.length).toEqual(expectedNumberOfPoints);
    })

    it('returns diss curve within the range of pseudo-octave with correct step', () => {
        const dissCurve = Dissonance.calcDissonanceCurve({ partials: Factory.partials({ ratios: [1, 2.1, 3.2, 4.3], fundamental: 440 }), points: 12 }).curve
        const expectedStepInCents = 116.76974486087978

        expect(dissCurve[0].cents).toEqual(0);
        expect(dissCurve[1].cents - dissCurve[0].cents).toEqual(expectedStepInCents);
        expect(dissCurve.length).toEqual(12);
        expect(dissCurve[dissCurve.length - 1].cents).toEqual(expectedStepInCents * 11);
    })
})
