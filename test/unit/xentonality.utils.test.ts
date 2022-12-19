import * as Utils from "../../src/xentonality/utils"
import * as Factory from "./factories"
import { curvesEqual } from "./assertions"


describe('Xentonality.Utils.ratioToCents', () => {
    it('returns 0 if provided ratio is 1', () => {
        expect(Utils.ratioToCents(1)).toEqual(0);
    });

    it('returns -1200 if provided ratio is 0.5', () => {
        expect(Utils.ratioToCents(0.5)).toEqual(-1200);
    });

    it('returns 386.3137138648348 if 5 / 4 ratio is provided', () => {
        expect(Utils.ratioToCents(5 / 4)).toEqual(386.3137138648348);
    });

    it('returns 1200 if ratio 2 is provided', () => {
        expect(Utils.ratioToCents(2)).toEqual(1200);
    });

    it('returns 0 if provided ratio is 0', () => {
        expect(Utils.ratioToCents(0)).toEqual(0);
    });

    it('returns 0 if provided ratio is < 0', () => {
        expect(Utils.ratioToCents(-1)).toEqual(0);
    });
})


describe('Xentonality.Utils.centsToRatio', () => {
    it('returns 1 if 0 is provided', () => {
        expect(Utils.centsToRatio(0)).toEqual(1);
    });

    it('returns 2 if 1200 is provided', () => {
        expect(Utils.centsToRatio(1200)).toEqual(2);
    });

    it('returns 0.5 if -1200 is provided', () => {
        expect(Utils.centsToRatio(-1200)).toEqual(0.5);
    });

    it('returns 1.249773510228908 if 386 is provided', () => {
        expect(Utils.centsToRatio(386)).toEqual(1.249773510228908);
    });
})



describe('Xentonality.Utils.setharesLoudness', () => {
    it('returns 0 if 0 amplitude is provided ', () => {
        expect(Utils.setharesLoudness(0)).toEqual(0);
    });

    // WARNING: double check the formula from Sethares
    it('returns 78.84951607609639 if 1 amplitude is provided ', () => {
        expect(Utils.setharesLoudness(1)).toEqual(78.84951607609639);
    });
})


describe('Xentonality.Utils.getAmplitude', () => {
    it('returns 0.5 for ratio 2 and harmonic profile', () => {
        expect(Utils.getAmplitude(1, 2)).toEqual(0.5);
    });

    it('returns 0.2 for ratio 5 and harmonic profile', () => {
        expect(Utils.getAmplitude(1, 5)).toEqual(0.2);
    });

    it('returns 0.3333333333333333 for ratio 3 and harmonic profile', () => {
        expect(Utils.getAmplitude(1, 3)).toEqual(0.3333333333333333);
    });

    it('returns 0.25 for ratio 2 and slope = 2 profile', () => {
        expect(Utils.getAmplitude(2, 2)).toEqual(0.25);
    });

    it('returns 0.04 for ratio 5 and slope = 2 profile', () => {
        expect(Utils.getAmplitude(2, 5)).toEqual(0.04);
    });

    it('returns 0.1111111111111111 for ratio 3 and slope = 2 profile', () => {
        expect(Utils.getAmplitude(2, 3)).toEqual(0.1111111111111111);
    });

    it('returns 1 for ratio 5 and equal profile', () => {
        expect(Utils.getAmplitude(0, 5)).toEqual(1);
    });

    it('returns 1 for ratio 2 and equal profile', () => {
        expect(Utils.getAmplitude(0, 2)).toEqual(1)
    })

    it('returns 0 for ratio < 1 and equal profile', () => {
        expect(Utils.getAmplitude(0, 0.5)).toEqual(0)
    })

    it('returns 0 for ratio < 1 and harmonic profile', () => {
        expect(Utils.getAmplitude(1, 0.5)).toEqual(0)
    })

    it('returns 0 for ratio < 0 and equal profile', () => {
        expect(Utils.getAmplitude(0, -0.5)).toEqual(0)
    })

    it('returns 0 for ratio < 0 and harmonic profile', () => {
        expect(Utils.getAmplitude(1, -0.5)).toEqual(0)
    })

    it('returns 0 for ratio = 0 and equal profile', () => {
        expect(Utils.getAmplitude(0, 0)).toEqual(0)
    })

    it('returns 0 for ratio = 0 and harmonic profile', () => {
        expect(Utils.getAmplitude(1, 0)).toEqual(0)
    })
})

describe('Xentonality.Utils.detrend', () => {
    it('returns zeroPlot for linear function', () => {
        const testFunction = Utils.detrend(Factory.linearPlot({}))
        const expectedFunction = Factory.zeroPlot

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    });

    it('returns correct deTrend curve y = x^2 -3x + 2 for y = x^2 + 1', () => {
        const testFunction = Utils.detrend(Factory.quadraticPlot({ a: 1, b: 0, c: 1 }))
        const expectedFunction = Factory.quadraticPlot({ a: 1, b: -3, c: 2 })

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    })
})

describe('Xentonality.Utils.normilize', () => {
    it('returns y = 1 for y = 2', () => {
        const testFunction = Utils.normalize(Factory.linearPlot({ a: 0, b: 2 }))
        const expectedFunction = Factory.linearPlot({ a: 0, b: 1 })

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    });

    it('returns y = -1 for y = -2', () => {
        const testFunction = Utils.normalize(Factory.linearPlot({ a: 0, b: -2 }))
        const expectedFunction = Factory.linearPlot({ a: 0, b: -1 })

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    });

    it('returns y = 0.5x if y = 2x provided', () => {
        const testFunction = Utils.normalize(Factory.linearPlot({ a: 2, b: 0 }))
        const expectedFunction = Factory.linearPlot({ a: 0.5, b: 0 })

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    });

    it('returns y = -x if y = -2x provided', () => {
        const testFunction = Utils.normalize(Factory.linearPlot({ a: -2, b: 0 }))
        const expectedFunction = Factory.linearPlot({ a: -0.5, b: 0 })

        expect(curvesEqual(testFunction, expectedFunction)).toEqual(true);
    });
})


describe('Xentonality.Utils.withinLimit', () => {
    it('returns false for 0 in [0.5, 1]', () => {
        expect(Utils.withinLimit({ value: 0, limits: { min: 0.5, max: 1 } })).toEqual(false);
    });

    it('returns true for 0 in [undefined, 1]', () => {
        expect(Utils.withinLimit({ value: 0, limits: { max: 1 } })).toEqual(true);
    });

    it('returns false for 2 in [undefined, 1]', () => {
        expect(Utils.withinLimit({ value: 2, limits: { max: 1 } })).toEqual(false);
    });

    it('returns true for 0.5 in [0, 1]', () => {
        expect(Utils.withinLimit({ value: 0.5, limits: { min: 0, max: 1 } })).toEqual(true);
    });

    it('returns false for 1 in [0, 0.5]', () => {
        expect(Utils.withinLimit({ value: 1, limits: { min: 0, max: 0.5 } })).toEqual(false);
    });

    it('returns true for 1 in [0.5, undefined]', () => {
        expect(Utils.withinLimit({ value: 1, limits: { min: 0.5 } })).toEqual(true);
    });

    it('returns false for 0 in [0.5, undefined]', () => {
        expect(Utils.withinLimit({ value: 0, limits: { min: 0.5 } })).toEqual(false);
    });

    it('returns true for 1 in [undefined, undefined]', () => {
        expect(Utils.withinLimit({ value: 1, limits: {} })).toEqual(true);
    });

    it('returns true for 1 with limits = undefined', () => {
        expect(Utils.withinLimit({ value: 1 })).toEqual(true);
    });
})


describe('Xentonality.Utils.rowToString', () => {
    it('returns empty string for empty array', () => {
        expect(Utils.rowToString([])).toEqual("");
    });

    it('returns correct string for array of length 1', () => {
        expect(Utils.rowToString([1])).toEqual("1");
    });

    it('returns correct string with tab spaced numbers', () => {
        expect(Utils.rowToString([0, 1, 2, 3])).toEqual("0\t1\t2\t3");
    });

    it('returns correct string with tab spaced strings', () => {
        expect(Utils.rowToString(['zero', 'one', 'two', 'three'])).toEqual("zero\tone\ttwo\tthree");
    });
})

describe('Xentonality.Utils.parseCurveToFileFormat', () => {
    it('returns correct string with tab spaced numbers', () => {
        const curveToTest = [
            { key1: 1, key2: 10, key3: 20 },
            { key1: 2, key2: 11, key3: 21 },
            { key1: 3, key2: 12, key3: 22 },
        ]

        const expectedOutcome = `key1\tkey2\tkey3\n1\t10\t20\n2\t11\t21\n3\t12\t22`

        expect(Utils.parseCurveToFileFormat(curveToTest)).toEqual(expectedOutcome);
    });

    it('returns empty string for empty array', () => {
        expect(Utils.parseCurveToFileFormat([])).toEqual('');
    });
})
