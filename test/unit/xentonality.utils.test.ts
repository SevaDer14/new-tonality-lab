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
        expect(Utils.getAmplitude("harmonic", 2)).toEqual(0.5);
    });

    it('returns 0.2 for ratio 5 and harmonic profile', () => {
        expect(Utils.getAmplitude("harmonic", 5)).toEqual(0.2);
    });

    it('returns 0.3333333333333333 for ratio 3 and harmonic profile', () => {
        expect(Utils.getAmplitude("harmonic", 3)).toEqual(0.3333333333333333);
    });

    it('returns 1 for ratio 5 and equal profile', () => {
        expect(Utils.getAmplitude("equal", 5)).toEqual(1);
    });

    it('returns 1 for ratio 2 and equal profile', () => {
        expect(Utils.getAmplitude("equal", 2)).toEqual(1)
    })

    it('returns 0 for ratio < 1 and equal profile', () => {
        expect(Utils.getAmplitude("equal", 0.5)).toEqual(0)
    })

    it('returns 0 for ratio < 1 and harmonic profile', () => {
        expect(Utils.getAmplitude("harmonic", 0.5)).toEqual(0)
    })

    it('returns 0 for ratio < 0 and equal profile', () => {
        expect(Utils.getAmplitude("equal", -0.5)).toEqual(0)
    })

    it('returns 0 for ratio < 0 and harmonic profile', () => {
        expect(Utils.getAmplitude("harmonic", -0.5)).toEqual(0)
    })

    it('returns 0 for ratio = 0 and equal profile', () => {
        expect(Utils.getAmplitude("equal", 0)).toEqual(0)
    })

    it('returns 0 for ratio = 0 and harmonic profile', () => {
        expect(Utils.getAmplitude("harmonic", 0)).toEqual(0)
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
