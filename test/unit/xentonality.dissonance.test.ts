import * as Dissonance from '../../src/xentonality/dissonance';
import * as Factory from './factories'
import { diss_curve_440_4_harmonic } from './fixtures/dissCurves'
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

    // TODO: result not checked with Sethares book!! 
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

    // TODO: value not tested, taken from result of function
    it('returns correct value for complex spectrum', () => {
        expect(Dissonance.intrinsicDissonance(Factory.partials({}))).toEqual(0.02201318145631032);
    });
})

describe('Xentonality.Dissonance.dissonanceCurve', () => {
    // TODO: I assume fixtures are correct, but need manual testing to confirm that
    it('returns correct diss curve', () => {
        const testFunction = Dissonance.dissonanceCurve(Factory.partials({ ratios: [1, 2, 3, 4], fundamental: 440 }), 10).curve
        const expectedFunction = diss_curve_440_4_harmonic

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    })

    it('returns diss curve within the range of pseudo-octave', () => {
        const dissCurve = Dissonance.dissonanceCurve(Factory.partials({ ratios: [1, 2.1, 3.2, 4.3], fundamental: 440 }), 10).curve

        expect(dissCurve[0].cents).toEqual(0);
        expect(dissCurve[dissCurve.length - 1].cents).toEqual(1260);
    })
})
