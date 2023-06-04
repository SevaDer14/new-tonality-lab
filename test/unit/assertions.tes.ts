// import { describe, expect, it } from 'vitest'
// import { curvesEqual } from "./assertions";
// import * as Factory from "./factories"


// describe('Assertions.curvesEqual', () => {
//     it('returns true for same zero functions', () => {
//         expect(curvesEqual(Factory.zeroPlot, Factory.zeroPlot)).toEqual(true);
//     });

//     it('returns true for same functions', () => {
//         const parabola = Factory.quadraticPlot({ a: -1, b: 2, c: 6 })

//         expect(curvesEqual(parabola, parabola)).toEqual(true);
//     })

//     it('returns false for parabola and zero function', () => {
//         const parabola = Factory.quadraticPlot({ a: -1, b: 2, c: 6 })

//         expect(curvesEqual(parabola, Factory.zeroPlot)).toEqual(false);
//     })

//     it('returns false for parabola and linear function', () => {
//         const parabola = Factory.quadraticPlot({ a: -1, b: 2, c: 6 })
//         const linear = Factory.linearPlot({ a: -1, b: 2 })

//         expect(curvesEqual(parabola, linear)).toEqual(false);
//     })

//     it('returns false for functions with different number of points', () => {
//         const parabola = Factory.quadraticPlot({ a: -1, b: 2, c: 6 })
//         const parabolaSlice = parabola.slice(0, 10)

//         expect(curvesEqual(parabola, parabolaSlice)).toEqual(false);
//     })
// })
