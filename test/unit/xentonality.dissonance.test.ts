import * as Dissonance from '../../src/xentonality/dissonance';
import * as Factory from './factories'


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
        expect(Dissonance.intrinsicDissonance(Factory.partials({ indexes: [1] }))).toEqual(0);
    });

    it('returns 0 if partials have 0 loudness', () => {
        expect(Dissonance.intrinsicDissonance(Factory.partials({ amplitude: 0 }))).toEqual(0);
    });

    it('returns same value as plompLeveltDissonance if 2 partials are provided', () => {
        const partials = Factory.partials({ indexes: [1, 2], fundamental: 440 })
        const expercedOutcome = Dissonance.plompLeveltDissonance({ minLoudness: 64, frequencyDifference: 440, minFrequency: 440 })

        expect(Dissonance.intrinsicDissonance(partials)).toEqual(expercedOutcome);
    });

    // TODO: value not tested, taken from result of function
    it('returns correct value for complex spectrum', () => {
        expect(Dissonance.intrinsicDissonance(Factory.partials({}))).toEqual(0.02201318145631032);
    });
})

// describe('Xentonality.Dissonance.dissonanceCurve', () => {

    // test plomp and levelt curve for 2 different freq

    // test complex dissonance curve with fixture

    // test with pseudo octave

// })
