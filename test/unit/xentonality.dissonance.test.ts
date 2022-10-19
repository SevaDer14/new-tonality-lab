import * as Dissonance from '../../src/xentonality/dissonance';
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
        expect(Dissonance.intrinsicDissonance(Factory.partials({}))).toEqual(0.02201318145631032);
    });
})

describe('Xentonality.Dissonance.calcDissonanceCurve', () => {
    // WARNING: I assume fixtures are correct, but need manual testing to confirm that
    // WARNING: check default number of points for diss curve 
    it('returns diss curve for single partial', () => {
        const testFunction = Dissonance.calcDissonanceCurve(Factory.partials({ ratios: [1], fundamental: 440 }), 10).curve
        const expectedFunction = diss_curve_440_1_partial

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    })

    it('returns correct diss curve', () => {
        const testFunction = Dissonance.calcDissonanceCurve(Factory.partials({ ratios: [1, 2, 3, 4], fundamental: 440 }), 10).curve
        const expectedFunction = diss_curve_440_4_harmonic

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    })

    it('returns diss curve within the range of pseudo-octave with correct step', () => {
        const dissCurve = Dissonance.calcDissonanceCurve(Factory.partials({ ratios: [1, 2.1, 3.2, 4.3], fundamental: 440 }), 12).curve
        const expectedStepInCents = 116.76974486087978

        expect(dissCurve[0].cents).toEqual(0);
        expect(dissCurve[1].cents - dissCurve[0].cents).toEqual(expectedStepInCents);
        expect(dissCurve.length).toEqual(12);
        expect(dissCurve[dissCurve.length - 1].cents).toEqual(expectedStepInCents * 11);
    })
})
